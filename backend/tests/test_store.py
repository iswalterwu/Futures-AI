"""AC-003-1/2/3/4：观测存储与择优（DuckDB + SQLite 目录）。"""
from __future__ import annotations

from datetime import datetime, timedelta

import pytest

from data.catalog.db import CatalogDB
from data.store.duck import DuckStore
from data.store.winners import asof_view, latest, latest_obs

BASE = datetime(2026, 10, 1, 0, 0, 0)


def mkrow(sid, ts, val, unit, source, fetched):
    return (sid, ts, val, unit, source, fetched)


class TestIdempotentReplay:
    def test_replay_no_duplicates_no_overwrite(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        rid = store.new_run("a1", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        rows = [mkrow("s1", BASE, 1.0, "cny_bbl", "a1", BASE)]
        store.commit_run(rid, rows)
        # 同批次重放
        store.commit_run(rid, rows)
        assert store.count_obs("s1") == 1
        # 重放携带不同值也不覆盖
        rid2 = store.new_run("a1", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        store.commit_run(rid2, [mkrow("s1", BASE, 99.0, "cny_bbl", "a1", BASE)])
        assert store.count_obs("s1") == 2  # 不同批次 = 新行（追加）

    def test_fail_no_partial_write(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        rid = store.new_run("a1", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        store.fail_run(rid)
        assert store.count_obs("s1") == 0
        assert store.run(rid)[8] == "failed"

    def test_stale_running_cleaned(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        rid = store.new_run("a1", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        store.con.execute(
            "UPDATE ingest_runs SET started_at=? WHERE ingest_run=?",
            [datetime(2000, 1, 1), rid],
        )
        assert store.stale_running(minutes=60) == [rid]
        assert store.run(rid)[8] == "failed"


class TestWinnerRule:
    @pytest.fixture()
    def env(self, tmp_root):
        store = DuckStore(tmp_root / "data" / "observations.duckdb")
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        return store, cat

    def _ingest(self, store, source, series_id, ts, val, rid=None, fetched=None):
        rid = rid or store.new_run(source, series_id, ts, ts, "cny_bbl", "1d", "Asia/Shanghai")
        store.commit_run(rid, [mkrow(series_id, ts, val, "cny_bbl", source, fetched or BASE)])
        return rid

    def test_priority_wins(self, env):
        store, cat = env
        cat.set_series_source("s1", "src_high", 200, 1)
        cat.set_series_source("s1", "src_low", 10, 2)
        self._ingest(store, "src_high", "s1", BASE, 100.0)
        self._ingest(store, "src_low", "s1", BASE, 200.0)
        got = latest(store, "s1", cat.effective_priorities("s1"))
        assert got[1] == 200.0 and got[3] == "src_low"

    def test_newer_asof_wins_same_priority(self, env):
        store, cat = env
        cat.set_series_source("s1", "a", 100, 1)
        cat.set_series_source("s1", "b", 100, 2)
        r1 = self._ingest(store, "a", "s1", BASE, 1.0)
        self._ingest(store, "b", "s1", BASE, 2.0)
        # b 的批次后提交 → asof 新 → b 胜
        got = latest(store, "s1", cat.effective_priorities("s1"))
        assert got[3] == "b"

    def test_tiebreak_by_run(self, env):
        store, cat = env
        cat.set_series_source("s1", "a", 100, 1)
        cat.set_series_source("s1", "b", 100, 2)
        # 强制 asof 相同：同批次不可能双源，构造同 asof 数据——直接篡改 asof
        r1 = self._ingest(store, "a", "s1", BASE, 1.0)
        r2 = self._ingest(store, "b", "s1", BASE, 2.0)
        store.con.execute('UPDATE observations SET "asof"=? WHERE ingest_run IN (?,?)', [BASE, r1, r2])
        got = latest(store, "s1", cat.effective_priorities("s1"))
        assert got[6] == max(r1, r2)  # ingest_run 大者胜

    def test_manual_override_replaces_priority(self, env):
        store, cat = env
        cat.set_series_source("s1", "a", 10, 1)
        cat.set_series_source("s1", "b", 200, 2)
        self._ingest(store, "a", "s1", BASE, 100.0)
        self._ingest(store, "b", "s1", BASE, 200.0)
        cat.set_override("s1", "b", 5)  # 覆盖：b 优先级改为 5 → b 胜
        got = latest(store, "s1", cat.effective_priorities("s1"))
        assert got[1] == 200.0 and got[3] == "b"

    def test_latest_obs_per_ts_and_series_latest(self, env):
        store, cat = env
        cat.set_series_source("s1", "a", 100, 1)
        self._ingest(store, "a", "s1", BASE, 1.0)
        self._ingest(store, "a", "s1", BASE + timedelta(days=1), 2.0)
        rows = latest_obs(store, "s1", cat.effective_priorities("s1"))
        assert len(rows) == 2
        got = latest(store, "s1", cat.effective_priorities("s1"))
        assert got[0] == BASE + timedelta(days=1) and got[1] == 2.0

    def test_asof_consistency_with_latest(self, env):
        store, cat = env
        cat.set_series_source("s1", "a", 100, 1)
        self._ingest(store, "a", "s1", BASE, 1.0)
        now = datetime(2030, 1, 1)
        a = asof_view(store, "s1", now, cat.effective_priorities("s1"))
        l = latest_obs(store, "s1", cat.effective_priorities("s1"))
        assert a == l
        # asof 早于写入 → 不可见
        before = asof_view(store, "s1", datetime(2000, 1, 1), cat.effective_priorities("s1"))
        assert before == []

    def test_disabled_source_history_still_visible(self, env):
        """AC-003-2/AC-003-4：择优候选 = 全部源观测；停用/清单移除只改配置角色。"""
        store, cat = env
        cat.con.execute("INSERT INTO sources(id, adapter_id, name) VALUES ('a','a','A')")
        cat.con.execute("INSERT INTO sources(id, adapter_id, name) VALUES ('b','b','B')")
        cat.set_series_source("s1", "a", 10, 1)
        cat.set_series_source("s1", "b", 100, 2)
        self._ingest(store, "a", "s1", BASE, 1.0)
        self._ingest(store, "b", "s1", BASE, 2.0)
        cat.set_source_enabled("a", False)  # 停用 a（R-001 启停入口同一写法）
        assert cat.enabled_sources("s1") == ["b"]  # 配置角色：a 不再是启用源
        rows = latest_obs(store, "s1", cat.effective_priorities("s1"))
        assert len(rows) == 1 and rows[0][3] == "a" and rows[0][1] == 1.0  # 历史可见且按优先级胜出
        cat.con.execute("UPDATE sources SET status='disabled' WHERE id='a'")  # 清单移除（registry 软删）
        cat.con.commit()
        got = latest(store, "s1", cat.effective_priorities("s1"))
        assert got[3] == "a" and got[1] == 1.0
