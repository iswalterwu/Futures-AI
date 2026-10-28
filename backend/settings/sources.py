"""数据源状态（spec R-004，plan §2.3）：与 data-layer 同口径的源状态 + 当前取数路径。

路径推导按凭证状态：
- 声明了实现且需要凭证：凭证可用 → api；未配置 → offline（免凭证回退）；存在但解不开 → blocked
- 不需要凭证的内置实现（akshare / local-file）→ builtin
- 未声明实现（仅声明源）→ declaration_only
凭证状态判定只做一次解密校验（用于区分"未配置"与"存在但损坏"），不保留明文。
"""
from __future__ import annotations

from pathlib import Path

from data import creds
from data.catalog.registry import BUILTIN_ADAPTERS_DIR, scan_adapters
from data.manifest import load as load_manifest
from data.service import Service

from settings.onboarding import STATE_FILE, read_state

PATH_API = "api"
PATH_OFFLINE = "offline"
PATH_BUILTIN = "builtin"
PATH_DECLARATION_ONLY = "declaration_only"
PATH_BLOCKED = "blocked"  # 凭证故障：不回退、不可用（区别于"未配置 → 免凭证回退"）
READ_WAIT_S = 30.0  # 写进程启停过渡窗口内的等待上限（与 data-layer 一致）


def _manifests(root: Path) -> dict[str, dict]:
    """扫描内置 + 用户适配器目录：source_id → {implementation, credential_ref, name}。"""
    out: dict[str, dict] = {}
    for _adapter_dir, manifest_path in scan_adapters(BUILTIN_ADAPTERS_DIR, Path(root) / "adapters"):
        try:
            m = load_manifest(manifest_path)
        except Exception:  # 坏件由 data-layer 的 registry 报告，这里只跳过
            continue
        out.setdefault(
            m.id,
            {
                "implementation": m.implementation,
                "credential_ref": m.credentials.credential_ref if m.credentials.kind == "api_key" else None,
                "name": m.name,
            },
        )
    return out


def _credential_state(root: Path, ref: str | None) -> str:
    """configured | missing | unreadable（存在但读不出来 = fail closed，不回退）。"""
    if not ref:
        return "missing"
    directory = Path(root) / "creds"
    if not creds.exists(directory, ref):
        return "missing"
    try:
        creds.get(directory, ref)
    except creds.CredsError:
        return "unreadable"
    return "configured"


def _sources_and_runtime(root: Path) -> tuple[list[dict], dict[str, dict], str | None]:
    """取源列表与运行态。返回 (sources, 运行态, 说明)。

    - 有写锁且有只读端点（serve 在跑）：经 data-layer 的内部通道读，不另开库
    - 否则本地只读打开（顺带查最近批次）；写进程正在启停时短暂等待
    """
    import time

    from data.lock import LockBusy, lock_held, read_endpoint

    data_dir = Path(root) / "data"
    deadline = time.monotonic() + READ_WAIT_S
    while True:
        if lock_held(data_dir) and read_endpoint(data_dir):
            from data.cli import internal_get  # 复用 data-layer 唯一的读取路径

            payload = internal_get(Path(root), "/internal/sources", {})
            return payload["sources"], {}, "写进程运行中：运行态由写进程持有，此处仅显示清单状态"
        try:
            svc = Service(Path(root), readonly=True)
            break
        except LockBusy as e:
            if time.monotonic() >= deadline:
                raise RuntimeError(f"数据目录被写进程占用，请稍后重试（{e}）") from e
            time.sleep(0.2)

    try:
        svc.init()
        sources = svc.list_sources()["sources"]
        runtime: dict[str, dict] = {}
        with svc.access_lock:
            for row in svc.store.con.execute(
                "SELECT adapter_id, status, finished_at FROM ingest_runs "
                "ORDER BY ingest_run DESC"
            ).fetchall():
                runtime.setdefault(
                    row[0], {"last_fetch_at": str(row[2]) if row[2] else None, "last_fetch_status": row[1]}
                )
        return sources, runtime, None
    finally:
        svc.close()

def list_with_status(root: Path) -> list[dict]:
    """源列表 + 路径 + 验证时间 + 最近取数运行态 + 不可用原因（与 data-layer list_sources 同口径）。"""
    manifests = _manifests(root)
    state = read_state(root)
    sources, runtime, runtime_note = _sources_and_runtime(root)

    rows = []
    for src in sources:
        sid = src["adapter_id"]
        meta = manifests.get(sid, {})
        implementation = meta.get("implementation")
        ref = meta.get("credential_ref")
        credential_state = _credential_state(root, ref) if implementation else "missing"

        if implementation is None:
            path = PATH_DECLARATION_ONLY
        elif ref is None:
            path = PATH_BUILTIN
        elif credential_state == "unreadable":
            path = PATH_BLOCKED  # 凭证故障：既不回退也不可用
        else:
            path = PATH_API if credential_state == "configured" else PATH_OFFLINE

        entry = state.get(sid, {})
        run = runtime.get(sid, {})
        status = src["status"]
        if credential_state == "unreadable":
            status = "error"  # 清单状态 ok ≠ 可用：凭证故障必须反映为错误
        row = {
            **src,  # 含 data-layer 的 reason（坏件/重复 id/已移除），不覆盖
            "status": status,
            "implementation": implementation,
            "credential_state": credential_state,
            "path": path,
            "verified_at": entry.get("verified_at"),
            "guide_error": entry.get("last_error"),  # 向导期的凭证错误码
            "run_status": run.get("last_fetch_status"),  # 运行态：succeeded/failed/running
            "run_at": run.get("last_fetch_at"),
        }
        hints = []
        if credential_state == "unreadable":
            hints.append("凭证文件存在但读取/解密失败（不回退；请重新配置或清除凭证）")
        elif path == PATH_OFFLINE:
            hints.append("未配置凭证：当前使用免凭证回退路径")
        elif path == PATH_DECLARATION_ONLY:
            hints.append("清单未声明取数实现（仅声明数据，不可取数）")
        if run.get("last_fetch_status") == "failed":
            hints.append("最近一次取数失败（failed）：可重试，或检查凭证/网络")
        if runtime_note:
            hints.append(runtime_note)
        if hints:
            if row.get("reason"):
                row["reason_hint"] = "；".join(hints)  # 保留原因为主
            else:
                row["reason"] = "；".join(hints)
        rows.append(row)
    return rows
