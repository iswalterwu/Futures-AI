"""AC-004-1/2/3：按需取数与任务注册表。"""
from __future__ import annotations

from datetime import datetime, timedelta

import pytest

from data.catalog.db import CatalogDB
from data.fetch.on_demand import FetchError, JobRegistry, fetch_series
from data.store.duck import DuckStore

BASE = datetime(2026, 10, 1)


class FakeAdapter:
    id = "akshare"

    def __init__(self, data=None, fail=False):
        self.data = data if data is not None else [(BASE, 100.0), (BASE + timedelta(days=1), 101.0)]
        self.fail = fail

    def fetch(self, provide, range_start, range_end):
        if self.fail:
            raise RuntimeError("网络超时")
        return self.data


def setup(tmp_root):
    store = DuckStore(tmp_root / "data" / "observations.duckdb")
    cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
    cat.con.execute(
        "INSERT INTO series VALUES ('s1','{}','sc.world.-.-.-.close.-.1d','cny_bbl','1d','Asia/Shanghai','active',NULL)"
    )
    cat.con.execute(
        "INSERT INTO sources VALUES ('akshare','akshare','AK',1,'ok','')"
    )
    cat.set_series_source("s1", "akshare", 100, 1, "cny_bbl", "1d", "Asia/Shanghai")
    return store, cat


class TestFetch:
    def test_read_branch_ignores_source(self, tmp_root):
        store, cat = setup(tmp_root)
        a = FakeAdapter()
        a.fetch = lambda *_: (_ for _ in ()).throw(AssertionError("只读分支不得触发适配器"))
        res = fetch_series(cat, store, {"akshare": a}, "s1", None, None, do_fetch=False, source="akshare")
        assert res["rows"] == [] and res["meta"]["count"] == 0

    def test_fetch_writes_and_returns(self, tmp_root):
        store, cat = setup(tmp_root)
        a = FakeAdapter()
        res = fetch_series(cat, store, {"akshare": a}, "s1", None, None, do_fetch=True)
        assert res["meta"]["count"] == 2
        assert res["rows"][0][1] == 100.0
        assert store.count_obs("s1") == 2

    def test_no_enabled_source_not_found(self, tmp_root):
        store, cat = setup(tmp_root)
        cat.con.execute("UPDATE sources SET status='disabled' WHERE id='akshare'")
        cat.con.commit()
        with pytest.raises(FetchError) as ei:
            fetch_series(cat, store, {"akshare": FakeAdapter()}, "s1", None, None, do_fetch=True)
        assert ei.value.code == "not_found" and ei.value.retryable is False

    def test_explicit_disabled_source_validation_error(self, tmp_root):
        store, cat = setup(tmp_root)
        cat.con.execute("UPDATE sources SET enabled=0 WHERE id='akshare'")
        cat.con.commit()
        with pytest.raises(FetchError) as ei:
            fetch_series(cat, store, {"akshare": FakeAdapter()}, "s1", None, None, do_fetch=True, source="akshare")
        assert ei.value.code == "validation_error"

    def test_failure_atomic_no_partial_write(self, tmp_root):
        store, cat = setup(tmp_root)
        with pytest.raises(FetchError) as ei:
            fetch_series(cat, store, {"akshare": FakeAdapter(fail=True)}, "s1", None, None, do_fetch=True)
        assert ei.value.retryable is True
        assert store.count_obs("s1") == 0
        (status,) = store.con.execute("SELECT status FROM ingest_runs").fetchone()
        assert status == "failed"

    def test_retry_is_new_run(self, tmp_root):
        store, cat = setup(tmp_root)
        adapter = FakeAdapter(fail=True)
        with pytest.raises(FetchError):
            fetch_series(cat, store, {"akshare": adapter}, "s1", None, None, do_fetch=True)
        adapter.fail = False
        fetch_series(cat, store, {"akshare": adapter}, "s1", None, None, do_fetch=True)
        statuses = store.con.execute("SELECT status FROM ingest_runs ORDER BY ingest_run").fetchall()
        assert [s[0] for s in statuses] == ["failed", "succeeded"]


class TestJobs:
    def test_realtime_signature_exists(self):
        """AC-004-4：realtime 仅定义接口签名（三适配器均有签名，无网络实现）。"""
        from data.adapters.akshare.akshare_adapter import AkshareAdapter
        from data.adapters.eia.eia_adapter import EiaAdapter
        from data.adapters.local_file.local_file_adapter import LocalFileAdapter

        for a in (AkshareAdapter, EiaAdapter, LocalFileAdapter):
            assert hasattr(a, "realtime_signature") and callable(a.realtime_signature)
    def test_register_list_run(self, tmp_root):
        store, cat = setup(tmp_root)

        def run_fn(adapter_id, series_id):
            return fetch_series(cat, store, {"akshare": FakeAdapter()}, series_id, None, None, do_fetch=True)

        jobs = JobRegistry(cat, run_fn)
        jobs.register("daily_sc", "akshare", "s1")
        assert any(r[0] == "daily_sc" for r in jobs.list())
        res = jobs.run("daily_sc")
        assert res["meta"]["count"] == 2

    def test_run_missing_job(self, tmp_root):
        store, cat = setup(tmp_root)
        jobs = JobRegistry(cat, lambda *_: None)
        with pytest.raises(FetchError) as ei:
            jobs.run("nope")
        assert ei.value.code == "not_found"
