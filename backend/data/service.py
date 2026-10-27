"""service 门面（plan §1/§2.2）：CLI 与 MCP 共用同一组调用。

写模式：构造时**先取写锁、后开库**（F-01）；只读模式：read_only 连接、不取锁；
只读且库文件尚不存在/未初始化（空目录首启）→ 内存目录（按清单编译）+ 空观测库，不在磁盘建库。
并发（plan §2.2 MCP 执行模型）：全部数据访问经 _access_lock 串行（单连接），并带关闭屏障；
取数写路径另经 _write_mutex 串行，适配器网络阶段不持 _access_lock。
"""
from __future__ import annotations

import contextlib
import json
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import duckdb

from data.adapters.akshare.akshare_adapter import AkshareAdapter
from data.adapters.eia.eia_adapter import EiaAdapter
from data.adapters.local_file.local_file_adapter import LocalFileAdapter
from data.align import reconcile
from data.catalog.db import CatalogDB
from data.catalog.registry import BUILTIN_ADAPTERS_DIR, Registry
from data.fetch.on_demand import FetchError, JobRegistry, fetch_series
from data.lock import LockBusy, ensure_layout, release_lock, write_lock
from data.store.duck import DuckStore
from data.store.provenance import diff, provenance

CATALOG_FILE = "catalog.sqlite"
STORE_FILE = "observations.duckdb"


def _parse_ts(v, tz: str | None = None):
    """ISO8601 → naive 时间标签；非法输入 → validation_error。

    不带时区 = 原样（与观测 ts 同基准：源声明时区下的时间标签）；
    带时区 = 换算到序列声明时区 tz 后去时区（tz 未知 → UTC）（plan §2.2 range 时间语义）。
    """
    if v is None:
        return None
    if isinstance(v, datetime):
        dt = v
    else:
        try:
            dt = datetime.fromisoformat(str(v))
        except ValueError as e:
            raise FetchError("validation_error", f"非法时间参数: {v!r}（须为 ISO8601）") from e
    if dt.tzinfo is None:
        return dt
    target = timezone.utc
    if tz:
        try:
            target = ZoneInfo(tz)
        except Exception:
            target = timezone.utc
    return dt.astimezone(target).replace(tzinfo=None)


def _like(q: str) -> str:
    """LIKE 子串模式；% _ \\ 按字面匹配（配合 ESCAPE '\\'）。"""
    return "%" + q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"


# DuckDB 文件被其他进程占用的消息特征：带持有者 PID 的变体（already open）与
# 持有者已退出、仅剩 Windows 共享冲突文本的变体（英/中文系统）
_BUSY_MARKERS = ("already open", "being used by another process", "正在使用此文件")
OPEN_RETRY_S = 5.0  # 写进程开库遇占用的重试窗口（秒）：取锁后新的只读命令不再本地开库


class ServiceClosed(FetchError):
    """关闭屏障：服务已关闭后迟到的数据访问在触碰连接前即被拒绝（plan §2.2）。"""

    def __init__(self):
        super().__init__("internal", "服务已关闭（写进程正在退出），请稍后重试")


class _AccessGuard:
    """数据访问锁（可重入，单连接串行）+ 关闭屏障。

    `with guard:` 取锁后检查关闭标志，已关闭 → 释放锁并抛 ServiceClosed；
    `with guard.closing():` 取锁并置关闭标志（Service.close 关库用）。
    """

    def __init__(self):
        self._lock = threading.RLock()
        self._closed = False

    def __enter__(self):
        self._lock.acquire()
        if self._closed:
            self._lock.release()
            raise ServiceClosed()
        return self

    def __exit__(self, *exc):
        self._lock.release()
        return False

    @contextlib.contextmanager
    def closing(self):
        with self._lock:
            self._closed = True
            yield

    @property
    def closed(self) -> bool:
        return self._closed

    def owned(self) -> bool:
        """当前线程是否持有访问锁（锁覆盖断言与诊断用）。"""
        return self._lock._is_owned()


def _is_busy(e: Exception) -> bool:
    return any(m in str(e) for m in _BUSY_MARKERS)


def _open_duck(path, read_only: bool, retry_s: float = 0.0) -> DuckStore:
    """DuckDB 文件被其他进程占用 → retry_s 内间隔重试；仍占用 → LockBusy（不抛裸 IO 异常）。"""
    deadline = time.monotonic() + retry_s
    while True:
        try:
            return DuckStore(path, read_only=read_only)
        except duckdb.IOException as e:
            if not _is_busy(e):
                raise
            if time.monotonic() >= deadline:
                raise LockBusy("数据目录被其他进程占用（观测库正被打开），请稍后重试") from e
            time.sleep(0.05)


class Service:
    def __init__(self, root: Path, builtin_dir: Path | None = None, readonly: bool = False):
        self.dirs = ensure_layout(root)
        self.root = root
        self.readonly = readonly
        self._lock_f = None
        self._ephemeral_catalog = False
        if not readonly:
            # F-01：先取写锁，再开任何可写存储；开库失败必须释放锁
            self._lock_f = write_lock(self.dirs["data"])
        try:
            self.cat, self.store = self._open_stores()
        except BaseException:  # 含 KeyboardInterrupt：开库未完成即释放写锁
            if self._lock_f is not None:
                release_lock(self._lock_f)
                self._lock_f = None
            raise
        self.reg = Registry(self.cat, builtin_dir or BUILTIN_ADAPTERS_DIR, self.dirs["adapters"])
        self._access_lock = _AccessGuard()  # F-02：全部数据访问串行（单连接）+ 关闭屏障
        self._write_mutex = threading.Lock()  # 取数写路径串行（网络阶段不占访问锁）
        self.adapters: dict[str, object] = {}  # source_id → 取数实例（按 implementation 绑定）
        self._bindings: dict[str, str] = {}  # source_id → implementation
        self._provides: dict[tuple[str, str], object] = {}
        self.manifest_errors: list[dict] = []
        self.jobs = (
            JobRegistry(self.cat, self._run_job, guard=self._access_lock) if not readonly else None
        )

    def _open_stores(self) -> tuple[CatalogDB, DuckStore]:
        cat_path = self.dirs["data"] / CATALOG_FILE
        duck_path = self.dirs["data"] / STORE_FILE
        if not self.readonly:
            cat = CatalogDB(cat_path)
            try:
                return cat, _open_duck(duck_path, read_only=False, retry_s=OPEN_RETRY_S)
            except Exception:
                cat.close()
                raise
        # 只读：库文件不存在/未初始化（空目录首启）→ 内存库，不在磁盘建库（plan §2.2）
        cat = None
        if cat_path.exists():
            cat = CatalogDB(cat_path, read_only=True)
            if not cat.is_initialized():
                cat.close()
                cat = None
        if cat is None:
            cat = CatalogDB(":memory:")
            self._ephemeral_catalog = True
        try:
            store = None
            if duck_path.exists() and duck_path.stat().st_size > 0:
                store = _open_duck(duck_path, read_only=True)
                if not store.is_initialized():
                    store.close()
                    store = None
            if store is None:
                store = DuckStore(":memory:")
        except Exception:
            cat.close()
            raise
        return cat, store

    def init(self) -> "Service":
        if self.readonly and not self._ephemeral_catalog:
            self._provides = self.reg.load_provides()
            return self
        with self._access_lock:
            self._refresh()  # 写模式落盘；只读首启仅编译内存目录
            if not self.readonly:
                self.store.stale_running()
        return self

    def _refresh(self) -> None:
        """重建目录并刷新取数绑定（冷启动与配置变更后，F-11）。"""
        res = self.reg.rebuild()
        self._provides = res["provides"]
        self.manifest_errors = res["errors"]
        if not self.readonly:
            self._bind(res["manifests"])

    def _bind(self, manifests: dict) -> None:
        """按清单 implementation 绑定取数实例（plan §2.1 执行绑定；v1 不加载用户目录代码）。"""
        adapters: dict[str, object] = {}
        bindings: dict[str, str] = {}
        for source_id, m in manifests.items():
            impl = m.implementation
            if impl == "akshare":
                adapters[source_id] = AkshareAdapter()
            elif impl == "eia":
                adapters[source_id] = EiaAdapter(
                    self.dirs["creds"], credential_ref=m.credentials.credential_ref
                )
            elif impl == "local-file":
                adapters[source_id] = LocalFileAdapter()
            else:
                continue  # 仅声明源：不可取数（取数返回 not_found）
            bindings[source_id] = impl
        self.adapters = adapters
        self._bindings = bindings

    def _get_provide(self, cat, series_id, source_id):
        return self._provides.get((source_id, series_id))

    # ---- 取数与查询（CLI/MCP 共用） ----

    def fetch(self, series_id, start=None, end=None, do_fetch=None, source=None):
        if do_fetch is None:
            raise FetchError("validation_error", "do_fetch 必须显式传入")
        if self.readonly and do_fetch:
            raise FetchError("validation_error", "只读服务不可取数")
        with self._access_lock:
            tz = self.cat.series_tz(series_id)
        start, end = _parse_ts(start, tz), _parse_ts(end, tz)
        if start and end and start > end:
            raise FetchError("validation_error", "start 不得晚于 end")
        if do_fetch:
            with self._write_mutex:
                return fetch_series(
                    self.cat, self.store, self.adapters, series_id, start, end, True, source,
                    get_provide=self._get_provide, guard=self._access_lock,
                )
        return fetch_series(
            self.cat, self.store, self.adapters, series_id, start, end, False, source,
            get_provide=self._get_provide, guard=self._access_lock,
        )

    def search(self, q: str) -> dict:
        with self._access_lock:
            return self._search_unlocked(q)

    def _search_unlocked(self, q: str) -> dict:
        """q 子串匹配描述符字段值（asset/geo/measure/contract，不含 JSON 键名）与别名（plan §2.2）。"""
        pat = _like(q or "")
        fields = " OR ".join(
            f"json_extract(descriptor_json, '$.{k}') LIKE ? ESCAPE '\\'"
            for k in ("asset", "geo", "measure", "contract")
        )
        rows = self.cat.con.execute(
            "SELECT id, descriptor_json, display_id_8slot, unit, freq FROM series "
            f"WHERE {fields} OR id IN "
            "(SELECT series_id FROM aliases WHERE source_symbol LIKE ? ESCAPE '\\') "
            "ORDER BY id LIMIT 50",
            [pat] * 5,
        ).fetchall()
        return {
            "matches": [
                {
                    "series_id": r[0],
                    "descriptor": json.loads(r[1]) if r[1] else {},
                    "unit": r[3],
                    "freq": r[4],
                }
                for r in rows
            ]
        }

    def list_jobs(self) -> list:
        """只读任务列表（N-02：只读 CLI 可用）。"""
        with self._access_lock:
            return self.cat.con.execute("SELECT * FROM jobs").fetchall()

    def list_sources(self) -> dict:
        with self._access_lock:
            if self.cat.has_table("source_reasons"):
                sql = (
                    "SELECT s.id, s.name, s.enabled, s.status, r.reason FROM sources s "
                    "LEFT JOIN source_reasons r ON r.source_id = s.id ORDER BY s.id"
                )
            else:  # 旧版本目录库（只读打开、未经写进程升级）
                sql = "SELECT id, name, enabled, status, NULL FROM sources ORDER BY id"
            rows = self.cat.con.execute(sql).fetchall()
            return {
                "sources": [
                    {
                        "adapter_id": r[0],
                        "name": r[1],
                        "enabled": bool(r[2]),
                        "status": r[3],
                        "reason": r[4],
                    }
                    for r in rows
                ]
            }

    def reconcile(self, series_id):
        with self._access_lock:
            return reconcile(self.cat, series_id, store=self.store)

    def provenance(self, series_id, ts=None):
        with self._access_lock:
            if not self.cat.series_exists(series_id):  # 与 fetch_series 同口径
                raise FetchError("not_found", f"序列 {series_id} 不存在")
            return provenance(self.store, series_id, ts)

    def diff(self, run_a: int, run_b: int):
        with self._access_lock:
            return diff(self.store, run_a, run_b)

    def _run_job(self, adapter_id, series_id):
        with self._write_mutex:
            return fetch_series(
                self.cat, self.store, self.adapters, series_id, None, None, True,
                source=adapter_id, get_provide=self._get_provide, guard=self._access_lock,
            )

    # ---- 配置（CLI 专属；AC-004-5：只能配置已有清单的源） ----

    def _require_writable(self) -> None:
        if self.readonly:
            raise FetchError("validation_error", "只读服务不可修改配置")

    def _configurable_source(self, source_id: str) -> None:
        row = self.cat.source_row(source_id)
        if row is None:
            raise FetchError("not_found", f"源 {source_id} 不存在（只能配置已有清单的源）")
        if row[1] == "disabled":
            raise FetchError("validation_error", f"源 {source_id} 的清单已移除，不可配置")

    def set_priority(self, series_id: str, source_id: str, priority: int) -> None:
        """手动覆盖优先级（替换该源优先级值，参与同一决胜链）。"""
        self._require_writable()
        if isinstance(priority, bool) or not isinstance(priority, int) or priority < 0:
            raise FetchError("validation_error", f"优先级须为 ≥0 的整数: {priority!r}")
        with self._access_lock:
            if not self.cat.series_exists(series_id):
                raise FetchError("not_found", f"序列 {series_id} 不存在")
            self._configurable_source(source_id)
            if not self.cat.source_declares(series_id, source_id):
                raise FetchError("validation_error", f"源 {source_id} 的当前清单未声明序列 {series_id}")
            self.cat.set_override(series_id, source_id, priority)
            self._refresh()  # F-11：覆盖后刷新主源派生缓存与显示 ID

    def set_alias(self, symbol: str, source_id: str, series_id: str) -> str:
        """手动别名（来源作用域；手动 > manifest > 模板 > 模糊）。返回 written | rejected。"""
        self._require_writable()
        symbol = str(symbol).strip()
        if not symbol:
            raise FetchError("validation_error", "源侧符号不能为空")
        with self._access_lock:
            if not self.cat.series_exists(series_id):
                raise FetchError("not_found", f"序列 {series_id} 不存在")
            self._configurable_source(source_id)
            return self.cat.write_alias(symbol, source_id, series_id, "manual")

    def set_source_enabled(self, source_id: str, enabled: bool) -> None:
        """R-001 单源启停：持久化（重启后生效），并重算主源派生缓存。"""
        self._require_writable()
        with self._access_lock:
            self._configurable_source(source_id)
            self.cat.set_source_enabled(source_id, enabled)
            self._refresh()

    def import_targets(self) -> list[dict]:
        """导入向导目标（AC-007-3）：implementation=local-file 的启用源所声明的序列。"""
        out = []
        with self._access_lock:
            for (source_id, series_id) in sorted(self._provides):
                if self._bindings.get(source_id) != "local-file":
                    continue
                if source_id not in self.cat.enabled_sources(series_id):
                    continue
                decl = self.cat.source_declarations(series_id).get(source_id)
                row = self.cat.con.execute(
                    "SELECT display_id_8slot FROM series WHERE id=?", [series_id]
                ).fetchone()
                out.append(
                    {
                        "source": source_id,
                        "series_id": series_id,
                        "display": row[0] if row else series_id,
                        "unit": decl["unit"],
                        "freq": decl["freq"],
                        "tz": decl["tz"],
                    }
                )
        return out

    @property
    def access_lock(self):
        """数据访问锁（单连接串行）：直接访问 cat/store 连接的调用方须持有（plan §2.2）。"""
        return self._access_lock

    # ---- 单写者 ----

    def acquire_write_lock(self):
        if self._lock_f is None and not self.readonly:
            self._lock_f = write_lock(self.dirs["data"])

    def release_write_lock(self):
        if self._lock_f is not None:
            release_lock(self._lock_f)
            self._lock_f = None

    def close(self):
        """关库并释放写锁。在访问锁内先置关闭标志：仍持锁的在途访问先完成，
        此后迟到的数据访问被屏障拒绝（ServiceClosed），不会触碰已关闭的连接。"""
        with self._access_lock.closing():
            try:
                self.store.close()
            finally:
                self.cat.close()
                self.release_write_lock()
