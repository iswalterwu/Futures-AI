"""AC-006-1/2/3/4：对账与主源退化。"""
from __future__ import annotations

from data.align import reconcile
from data.catalog.db import CatalogDB


def setup(tmp_path):
    cat = CatalogDB(tmp_path / "catalog.sqlite")
    cat.con.execute(
        "INSERT INTO series VALUES ('s1','{}','sc.world.-.-.-.close.-.1d','cny_bbl','1d','Asia/Shanghai','active',NULL)"
    )
    cat.con.execute("INSERT INTO sources VALUES ('a','a','A',1,'ok','')")
    cat.con.execute("INSERT INTO sources VALUES ('b','b','B',1,'ok','')")
    cat.set_series_source("s1", "a", 100, 1, "cny_bbl", "1d", "Asia/Shanghai")
    cat.set_series_source("s1", "b", 200, 2, "usd_bbl", "1w", "America/New_York")
    return cat


class TestReconcile:
    def test_mismatches_reported(self, tmp_path):
        cat = setup(tmp_path)
        rep = reconcile(cat, "s1")["report"]
        mism = [c for c in rep["checks"] if c["status"] == "mismatch"]
        assert {(c["kind"]) for c in mism} == {"unit", "freq", "tz"}

    def test_ok_when_same(self, tmp_path):
        cat = setup(tmp_path)
        cat.set_series_source("s1", "b", 200, 2, "cny_bbl", "1d", "Asia/Shanghai")
        rep = reconcile(cat, "s1")["report"]
        assert all(c["status"] == "ok" for c in rep["checks"])

    def test_no_enabled_warning(self, tmp_path):
        cat = setup(tmp_path)
        cat.con.execute("UPDATE sources SET enabled=0")
        cat.con.commit()
        rep = reconcile(cat, "s1")["report"]
        # R6-02：对账覆盖全部当前源（含停用），口径差异仍报告；退化 warning 并存
        assert len(rep["checks"]) == 3
        assert any("主源候选为空" in w for w in rep["warnings"])

    def test_unknown_series_warning(self, tmp_path):
        cat = setup(tmp_path)
        rep = reconcile(cat, "nope")["report"]
        assert any("无可用序列" in w for w in rep["warnings"])

    def test_null_series_id(self, tmp_path):
        cat = setup(tmp_path)
        rep = reconcile(cat, None)["report"]
        assert any("无可用序列" in w for w in rep["warnings"])

    def test_cache_stale_warning(self, tmp_path):
        cat = setup(tmp_path)
        cat.con.execute("UPDATE sources SET status='disabled' WHERE id='b'")
        cat.con.execute("UPDATE series SET unit='usd_bbl' WHERE id='s1'")  # 人为使缓存与主源不符
        cat.con.commit()
        rep = reconcile(cat, "s1")["report"]
        assert any("不一致" in w for w in rep["warnings"])
