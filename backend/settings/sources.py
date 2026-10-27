"""数据源状态（spec R-004，plan §2.3）：与 data-layer 同口径的源状态 + 当前取数路径。

路径推导只用凭证是否**存在**（不读内容，避免明文进内存）：
- 声明了实现且需要凭证：凭证在 → api；不在 → offline（免凭证回退）
- 不需要凭证的内置实现（akshare / local-file）→ builtin
- 未声明实现（仅声明源）→ declaration_only
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


def list_with_status(root: Path) -> list[dict]:
    """源列表 + 路径 + 验证时间 + 不可用原因（与 data-layer list_sources 同口径）。"""
    manifests = _manifests(root)
    state = read_state(root)
    svc = Service(Path(root), readonly=True)
    try:
        svc.init()
        sources = svc.list_sources()["sources"]
    finally:
        svc.close()

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
        else:
            path = PATH_API if credential_state == "configured" else PATH_OFFLINE

        entry = state.get(sid, {})
        row = {
            **src,
            "implementation": implementation,
            "credential_state": credential_state,
            "path": path,
            "verified_at": entry.get("verified_at"),
            "last_error": entry.get("last_error"),
        }
        if credential_state == "unreadable":
            row["reason"] = "凭证文件存在但读取/解密失败（不回退免凭证路径，请重新配置）"
        elif path == PATH_OFFLINE:
            row["reason"] = "未配置凭证：当前使用免凭证回退路径"
        elif path == PATH_DECLARATION_ONLY:
            row["reason"] = "清单未声明取数实现（仅声明数据，不可取数）"
        rows.append(row)
    return rows


def state_file(root: Path) -> Path:
    return Path(root) / "profile" / STATE_FILE
