"""溯源查询与批次 diff（plan §4.4，AC-005-1/2）。"""
from __future__ import annotations

from data.store.duck import DuckStore, SUCCEEDED


def provenance(store: DuckStore, series_id: str, ts=None) -> list[dict]:
    """任意观测的来源/拉取时间/批次/载荷哈希。"""
    sql = (
        "SELECT ts, value, unit, source, fetched_at, \"asof\", ingest_run, payload_hash "
        "FROM observations WHERE series_id=?"
    )
    args: list = [series_id]
    if ts is not None:
        sql += " AND ts=?"
        args.append(ts)
    cols = ["ts", "value", "unit", "source", "fetched_at", "asof", "ingest_run", "payload_hash"]
    return [dict(zip(cols, r)) for r in store.con.execute(sql, args).fetchall()]


class DiffError(Exception):
    def __init__(self, reason: str):
        super().__init__(reason)
        self.reason = reason


def diff(store: DuckStore, run_a: int, run_b: int) -> dict:
    """两个成功批次间 diff（可比条件见 spec R-005/AC-005-2）。"""
    ra = store.run(run_a)
    rb = store.run(run_b)
    if ra is None or rb is None:
        raise DiffError("批次不存在")
    if ra[8] != SUCCEEDED or rb[8] != SUCCEEDED:
        raise DiffError("仅成功批次可比（存在 running/failed 批次）")
    if ra[2] != rb[2]:
        raise DiffError(f"序列不同：{ra[2]} vs {rb[2]}")
    if ra[1] != rb[1]:
        raise DiffError(f"源不同：{ra[1]} vs {rb[1]}")
    if (ra[3], ra[4]) != (rb[3], rb[4]):
        raise DiffError(f"覆盖范围不同：{ra[3:5]} vs {rb[3:5]}")
    if (ra[5], ra[6], ra[7]) != (rb[5], rb[6], rb[7]):
        raise DiffError("口径快照（unit/freq/tz）不同，不可比")

    def key_rows(rid):
        rows = store.con.execute(
            "SELECT ts, value, source FROM observations WHERE ingest_run=?", [rid]
        ).fetchall()
        return {(r[0], r[2]): r[1] for r in rows}

    ka, kb = key_rows(run_a), key_rows(run_b)
    deleted = sorted(k for k in ka if k not in kb)
    added = sorted(k for k in kb if k not in ka)
    revised = sorted(k for k in ka.keys() & kb.keys() if ka[k] != kb[k])
    deltas = [kb[k] - ka[k] for k in revised]
    return {
        "run_a": run_a,
        "run_b": run_b,
        "counts": {"added": len(added), "revised": len(revised), "deleted": len(deleted)},
        "sum_delta": sum(deltas),
        "max_abs_delta": max((abs(d) for d in deltas), default=0.0),
        "added": added,
        "revised": revised,
        "deleted": deleted,
    }
