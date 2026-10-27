"""对账（plan §4.5，AC-006-1/2/3/4）。

口径声明以源清单（落库于 series_sources）为唯一权威；不静默换算。
主源 = 启用源中优先级最小者（并列取注册顺序先者）。
"""
from __future__ import annotations

from itertools import combinations

from data.catalog.db import CatalogDB

KINDS = ("unit", "freq", "tz")


def reconcile(cat: CatalogDB, series_id: str | None) -> dict:
    """返回 {report: {series_id, checks: [...], warnings: [...]}}。

    - checks：启用源两两对比三类口径，status = ok | mismatch
    - warnings：退化/全局问题（主源候选为空等），不绑定成对源
    - 序列不存在（含空目录首启）→ warnings 说明"无可用序列"
    """
    warnings: list[str] = []
    if series_id is None:
        warnings.append("无可用序列：未提供序列标识")
        return {"report": {"series_id": None, "checks": [], "warnings": warnings}}

    row = cat.con.execute("SELECT id FROM series WHERE id=?", [series_id]).fetchone()
    if row is None:
        warnings.append(f"无可用序列：{series_id}（目录中不存在，可能为空数据目录首启）")
        return {"report": {"series_id": series_id, "checks": [], "warnings": warnings}}

    decls = cat.source_declarations(series_id)
    enabled = cat.enabled_sources(series_id)
    checks = []
    for a, b in combinations(enabled, 2):
        for kind in KINDS:
            va, vb = decls[a][kind], decls[b][kind]
            checks.append(
                {
                    "kind": kind,
                    "source_a": a,
                    "source_b": b,
                    "status": "ok" if va == vb else "mismatch",
                    "detail": None if va == vb else f"{va} != {vb}",
                }
            )
    if not enabled:
        warnings.append("主源候选为空：无启用源（展示口径沿用末次缓存或置空）")
    else:
        primary = enabled[0]
        srow = cat.con.execute(
            "SELECT unit, freq, tz FROM series WHERE id=?", [series_id]
        ).fetchone()
        if srow and any(srow[i] != decls[primary][KINDS[i]] for i in range(3)):
            warnings.append("series 派生缓存与主源清单声明不一致（缓存未刷新）")
    return {"report": {"series_id": series_id, "checks": checks, "warnings": warnings}}
