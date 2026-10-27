"""AC-005-1/2：溯源查询与批次 diff。"""
from __future__ import annotations

from datetime import datetime, timedelta

import pytest

from data.store.duck import DuckStore
from data.store.provenance import DiffError, diff, provenance

BASE = datetime(2026, 10, 1)


def _run(store, sid, adapter, start, end, unit, rows, rid=None):
    rid = rid if rid is not None else store.new_run(adapter, sid, start, end, unit, "1d", "Asia/Shanghai", "h1")
    store.commit_run(rid, [(sid, ts, v, unit, adapter, BASE) for (ts, v) in rows], "h1")
    return rid


class TestProvenance:
    def test_fields_queryable(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        _run(store, "s1", "a", BASE, BASE, "cny_bbl", [(BASE, 1.0)])
        rows = provenance(store, "s1")
        assert len(rows) == 1
        r = rows[0]
        assert r["source"] == "a" and r["ingest_run"] and r["payload_hash"] == "h1"

    def test_filter_by_ts(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        _run(store, "s1", "a", BASE, BASE, "cny_bbl", [(BASE, 1.0), (BASE + timedelta(days=1), 2.0)])
        assert len(provenance(store, "s1", ts=BASE)) == 1


class TestDiff:
    def test_three_categories_and_stats(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        rows_a = [(BASE, 1.0), (BASE + timedelta(days=1), 2.0), (BASE + timedelta(days=2), 3.0)]
        rows_b = [(BASE, 1.0), (BASE + timedelta(days=1), 5.0), (BASE + timedelta(days=3), 9.0)]
        ra = _run(store, "s1", "a", BASE, BASE + timedelta(days=3), "cny_bbl", rows_a)
        rb = _run(store, "s1", "a", BASE, BASE + timedelta(days=3), "cny_bbl", rows_b)
        d = diff(store, ra, rb)
        assert d["counts"] == {"added": 1, "revised": 1, "deleted": 1}
        assert d["sum_delta"] == pytest.approx(3.0)  # 仅修订类（5.0-2.0）
        assert d["max_abs_delta"] == pytest.approx(3.0)

    def test_incomparable_cases(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        ra = _run(store, "s1", "a", BASE, BASE, "cny_bbl", [(BASE, 1.0)])
        rb = _run(store, "s1", "a", BASE, BASE, "cny_bbl", [(BASE, 2.0)])
        with pytest.raises(DiffError):
            diff(store, ra, 999)  # 不存在
        r_failed = store.new_run("a", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        store.fail_run(r_failed)
        with pytest.raises(DiffError):
            diff(store, ra, r_failed)  # 非成功批次
        r_src = _run(store, "s2", "b", BASE, BASE, "cny_bbl", [(BASE, 1.0)])
        with pytest.raises(DiffError):
            diff(store, ra, r_src)  # 序列不同
        r_range = _run(store, "s1", "a", BASE + timedelta(days=5), BASE + timedelta(days=6), "cny_bbl", [(BASE, 1.0)])
        with pytest.raises(DiffError):
            diff(store, ra, r_range)  # 覆盖范围不同
        r_unit = _run(store, "s1", "a", BASE, BASE, "usd_bbl", [(BASE, 1.0)])
        with pytest.raises(DiffError):
            diff(store, ra, r_unit)  # 口径快照不同
