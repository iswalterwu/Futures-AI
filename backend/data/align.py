"""对账（plan §4.5，AC-006-1/2/3/4）。

口径声明以源清单（落库于 series_sources）为唯一权威；不静默换算。
主源 = 启用源中优先级最小者（并列取注册顺序先者）。
"""
from __future__ import annotations

from itertools import combinations

from data.catalog.db import CatalogDB

KINDS = ("unit", "freq", "tz")


def reconcile(cat: CatalogDB, series_id: str | None, store=None) -> dict:
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
    # R6-02/R7-02：对账候选 = 当前源 ∪ 历史观测来源（清单失效但观测仍在择优的源不得遗漏）
    candidates = list(dict.fromkeys(cat.current_sources(series_id)))
    if store is not None:
        obs_sources = [
            r[0]
            for r in store.con.execute(
                "SELECT DISTINCT source FROM observations WHERE series_id=?", [series_id]
            ).fetchall()
        ]
        for s in obs_sources:
            if s not in candidates:
                candidates.append(s)
    # 有观测但无任何口径声明的源：无从比对，进 warnings 而非抛错
    undeclared = [s for s in candidates if s not in decls]
    if undeclared:
        warnings.append(f"以下源有观测但无口径声明，未参与口径比对：{', '.join(undeclared)}")
        candidates = [s for s in candidates if s in decls]
    checks = []
    for a, b in combinations(candidates, 2):
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
        cache = cat.con.execute(
            "SELECT unit, freq, tz FROM series WHERE id=?", [series_id]
        ).fetchone()
        if cache and any(v is not None for v in cache):
            warnings.append("主源候选为空：无启用源（展示口径沿用末次缓存）")
        else:
            warnings.append("主源候选为空：无启用源且无历史展示口径（展示口径置空）")
    else:
        primary = enabled[0]
        srow = cat.con.execute(
            "SELECT unit, freq, tz FROM series WHERE id=?", [series_id]
        ).fetchone()
        if srow and any(srow[i] != decls[primary][KINDS[i]] for i in range(3)):
            warnings.append("series 派生缓存与主源清单声明不一致（缓存未刷新）")
    return {"report": {"series_id": series_id, "checks": checks, "warnings": warnings}}
