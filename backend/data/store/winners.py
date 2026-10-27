"""择优解析（plan §3.2，AC-003-2/3/4）。

唯一全序：优先级数值小者胜 → asof 新者胜 → ingest_run 大者胜。
手动覆盖 = 替换优先级值，参与同一决胜链。择优候选 = 全部源的观测行。
"""
from __future__ import annotations

from datetime import datetime

from data.store.duck import DuckStore


def _pick(cands: list[tuple], priorities: dict[str, int]) -> tuple | None:
    """候选中选唯一赢家。cands 行 = (ts, value, unit, source, asof, ingest_run)。"""
    if not cands:
        return None
    def key(row):
        _, _, _, source, asof_ts, ingest_run = row
        return (
            priorities.get(source, 100),
            -asof_ts.timestamp() if hasattr(asof_ts, "timestamp") else -float(asof_ts),
            -ingest_run,
        )
    return min(cands, key=key)


def latest_obs(
    store: DuckStore,
    series_id: str,
    priorities: dict[str, int],
    start: datetime | None = None,
    end: datetime | None = None,
) -> list[tuple]:
    """每 (series_id, ts) 的择优值。行 = (ts, value, unit, source, asof, ingest_run)。"""
    rows = store.candidates(series_id, start=start, end=end)
    by_ts: dict = {}
    for row in rows:
        ts = row[0]
        cur = by_ts.get(ts)
        if cur is None or _pick([cur, row], priorities) is row:
            by_ts[ts] = row
    return [by_ts[ts] for ts in sorted(by_ts)]


def latest(store: DuckStore, series_id: str, priorities: dict[str, int]) -> tuple | None:
    """该序列最新 ts 的择优值。"""
    rows = store.candidates(series_id)
    if not rows:
        return None
    max_ts = max(r[0] for r in rows)
    return _pick([r for r in rows if r[0] == max_ts], priorities)


def asof_view(
    store: DuckStore,
    series_id: str,
    t: datetime,
    priorities: dict[str, int],
) -> list[tuple]:
    """asof ≤ t 的行按同一择优规则；asof(now) ≡ latest_obs。"""
    rows = store.candidates(series_id, asof=t)
    by_ts: dict = {}
    for row in rows:
        ts = row[0]
        cur = by_ts.get(ts)
        if cur is None or _pick([cur, row], priorities) is row:
            by_ts[ts] = row
    return [by_ts[ts] for ts in sorted(by_ts)]
