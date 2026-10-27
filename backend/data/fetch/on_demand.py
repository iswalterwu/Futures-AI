"""按需取数（plan §4.2/§4.3，AC-004-1/3）与任务注册表（AC-004-2）。"""
from __future__ import annotations

from contextlib import nullcontext

from data.catalog.db import CatalogDB
from data.creds import CredsError
from data.store.duck import DuckStore, utcnow
from data.store.winners import latest_obs

# 错误码 ↔ retryable 映射（固定，plan §2.2）
CODE_RETRYABLE = {
    "not_found": False,
    "unauthorized": False,
    "adapter_error": True,
    "rate_limited": True,
    "validation_error": False,
    "internal": False,
}


class FetchError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        if code not in CODE_RETRYABLE:
            code = "internal"
        self.code = code
        self.message = message
        self.retryable = CODE_RETRYABLE[code]

    def to_dict(self) -> dict:
        return {"error": {"code": self.code, "message": self.message, "retryable": self.retryable}}


def fetch_series(
    cat: CatalogDB,
    store: DuckStore,
    adapters: dict[str, object],
    series_id: str,
    start,
    end,
    do_fetch: bool,
    source: str | None = None,
    get_provide=None,
    guard=None,
):
    """统一取数入口。

    - 序列不存在（目录中无此 ID）→ not_found（两分支一致；已登记但无观测 = 成功空结果）
    - do_fetch 无默认值（Python 层强制传参）；只读分支忽略 source，返回跨源择优结果
    - do_fetch=True：source=None → 启用源中优先级最小者（无 → not_found）；
      显式 source 指向非启用源 → validation_error；源未绑定取数实现 → not_found
    - guard = 数据访问锁（service 传入）：批次创建/提交/读取持锁，适配器网络阶段不持锁
      （plan §2.2 MCP 执行模型；写路径由调用方的写互斥串行）
    - 失败分类：凭证失败 → unauthorized；其余非 FetchError 异常 → adapter_error（可重试）
    """
    guard = guard if guard is not None else nullcontext()
    with guard:
        if not cat.series_exists(series_id):
            raise FetchError("not_found", f"序列 {series_id} 不存在")
        priorities = cat.effective_priorities(series_id)
        if not do_fetch:
            rows = latest_obs(store, series_id, priorities, start=start, end=end)
            return {"series_id": series_id, "rows": rows, "meta": _meta(series_id, rows, None, start, end)}

        # —— 取数分支 ——
        if source is None:
            enabled = cat.enabled_sources(series_id)
            if not enabled:
                raise FetchError("not_found", f"序列 {series_id} 无启用源")
            source = enabled[0]
        else:
            if source not in cat.enabled_sources(series_id):
                raise FetchError("validation_error", f"源 {source} 非启用（status 非 ok 或未启用）")
        decls = cat.source_declarations(series_id)
        decl = decls.get(source)
        if decl is None:
            raise FetchError("not_found", f"源 {source} 未提供序列 {series_id}")
        adapter = adapters.get(source)
        if adapter is None:
            raise FetchError(
                "not_found", f"源 {source} 未绑定取数实现（清单未声明 implementation，仅声明数据）"
            )
        provide = get_provide(cat, series_id, source) if get_provide else None
        rid = store.new_run(
            source, series_id, start, end, decl["unit"], decl["freq"], decl["tz"]
        )
    try:
        fetched, raw_payload = adapter.fetch(provide, start, end)
        validate_rows(fetched)
        rows = [
            (series_id, ts, float(v), decl["unit"], source, _utcnow())
            for (ts, v) in fetched
        ]
        with guard:
            store.commit_run(rid, rows, payload_hash=_payload_hash(raw_payload, fetched))
    except BaseException as e:  # 任一环节失败 → 失败原子性（批次标 failed，无部分写入）
        with guard:
            store.fail_run(rid)
        if isinstance(e, FetchError):
            raise
        if isinstance(e, CredsError):  # 凭证缺失/不可读/解密失败：重试无益
            raise FetchError("unauthorized", f"{e}（请先配置凭证：config credentials <名>）") from e
        if isinstance(e, Exception):  # 网络/解析等适配器错误 → 可重试
            raise FetchError("adapter_error", str(e)) from e
        raise

    with guard:
        priorities = cat.effective_priorities(series_id)
        rows = latest_obs(store, series_id, priorities, start=start, end=end)
        return {"series_id": series_id, "rows": rows, "meta": _meta(series_id, rows, source, start, end)}


def _utcnow():
    return utcnow()


def validate_rows(fetched) -> None:
    """R5-01/R8-01：提交前拒绝空时间/NaT/NaN/非有限值，整批拒绝入库。"""
    import math

    import pandas as _pd

    def bad(v):
        try:
            fv = float(v)
        except (TypeError, ValueError):
            return True
        return math.isnan(fv) or math.isinf(fv)

    bad_rows = [
        (ts, v) for (ts, v) in fetched
        if ts is None or _pd.isna(ts) or bad(v)
    ]
    if bad_rows:
        raise FetchError(
            "validation_error",
            f"数据含无效时间/数值（{len(bad_rows)} 行），整批拒绝入库",
        )


def _payload_hash(raw, fetched) -> str:
    """F-12：原始载荷优先；无原始载荷时回退归一化行。"""
    import hashlib
    import json

    if raw is not None:
        if isinstance(raw, bytes):
            return hashlib.sha256(raw).hexdigest()
        return hashlib.sha256(str(raw).encode("utf-8")).hexdigest()
    canon = json.dumps(
        [(ts.isoformat(), v) for (ts, v) in fetched],
        ensure_ascii=False,
        sort_keys=True,
    )
    return hashlib.sha256(canon.encode("utf-8")).hexdigest()


def _meta(series_id: str, rows: list, source: str | None, start, end) -> dict:
    sources = {r[3] for r in rows}
    meta_source = None if not sources else (next(iter(sources)) if len(sources) == 1 else "mixed")
    fetched_at = max((r[4] for r in rows), default=None)
    asof = max((r[5] for r in rows), default=None)
    return {
        "series_id": series_id,
        "source": meta_source,
        "fetched_at": fetched_at,
        "asof": asof,
        "count": len(rows),
        "range": {"start": start, "end": end},
    }


class JobRegistry:
    """AC-004-2：任务注册表骨架（注册/查看/手动触发，不引调度器）。"""

    def __init__(self, cat: CatalogDB, run_fn, guard=None):
        self.cat = cat
        self._run_fn = run_fn
        self._guard = guard if guard is not None else nullcontext()

    def register(self, name: str, adapter_id: str, series_id: str, schedule_spec: str | None = None) -> None:
        """AC-004-5：只接受“当前清单声明了该序列”的真实源（不存在 → not_found，未声明 → validation_error）。"""
        if not str(name).strip():
            raise FetchError("validation_error", "任务名不能为空")
        with self._guard:
            if not self.cat.series_exists(series_id):
                raise FetchError("not_found", f"序列 {series_id} 不存在")
            if self.cat.source_row(adapter_id) is None:
                raise FetchError("not_found", f"源 {adapter_id} 不存在（只能使用已有清单的源）")
            if not self.cat.source_declares(series_id, adapter_id):
                raise FetchError("validation_error", f"源 {adapter_id} 的当前清单未声明序列 {series_id}")
            self.cat.con.execute(
                "INSERT OR REPLACE INTO jobs VALUES (?,?,?,?,?)",
                [name, adapter_id, series_id, schedule_spec, None],
            )
            self.cat.con.commit()

    def list(self) -> list[tuple]:
        with self._guard:
            return self.cat.con.execute("SELECT * FROM jobs").fetchall()

    def run(self, name: str):
        with self._guard:
            row = self.cat.con.execute("SELECT * FROM jobs WHERE name=?", [name]).fetchone()
        if not row:
            raise FetchError("not_found", f"任务 {name} 不存在")
        try:
            return self._run_fn(row[1], row[2])
        finally:
            # 触发后记录（成功或失败均记），UTC
            with self._guard:
                self.cat.con.execute(
                    "UPDATE jobs SET last_run=? WHERE name=?",
                    [utcnow().isoformat(sep=" ", timespec="seconds"), name],
                )
                self.cat.con.commit()
