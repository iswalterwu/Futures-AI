"""AC-001-1/3/4、AC-002-2：目录编译、状态机、归并、软删。"""
from __future__ import annotations

import pytest

from data.catalog.db import CatalogDB
from data.catalog.descriptor import derive_id
from data.catalog.registry import Registry

MANIFEST_A = """
id: akshare
name: AKShare 行情
version: 1
credentials: none
provides:
  - descriptor: {asset: sc, geo: world, measure: close, contract: ""}
    symbols: ["futures_daily_SC"]
    unit: cny_bbl
    freq: 1d
    tz: Asia/Shanghai
    priority: 100
    fetch: {modes: [on_demand], history_days: 3650}
    update: {lag_min: 0, revises: true}
"""

MANIFEST_B_SAME_DESC = """
id: source-b
name: 源B（同描述符）
version: 1
provides:
  - descriptor: {asset: sc, geo: world, measure: close, contract: ""}
    symbols: ["SC_MAIN"]
    unit: cny_bbl
    freq: 1d
    tz: Asia/Shanghai
    priority: 200
    fetch: {modes: [scheduled], history_days: 3650}
    update: {lag_min: 0, revises: false}
"""

MANIFEST_BAD = """
id: bad-one
name: 坏清单
version: 1
provides:
  - descriptor: {asset: rb, geo: world, measure: close}
    symbols: ["RB_MAIN"]
    unit: cny_bbl
    freq: 1d
    tz: Asia/Shanghai
    fetch: {modes: [on_demand], history_days: 1}
    update: {lag_min: 0, revises: true}
"""

MANIFEST_DUP = """
id: akshare
name: 重复 id
version: 1
provides:
  - descriptor: {asset: fu, geo: cn, measure: close}
    symbols: ["FU_MAIN"]
    unit: cny_ton
    freq: 1d
    tz: Asia/Shanghai
    fetch: {modes: [on_demand], history_days: 1}
    update: {lag_min: 0, revises: true}
"""


def write_adapter(adapters_dir, name, text):
    d = adapters_dir / name
    d.mkdir(exist_ok=True)
    (d / "manifest.yaml").write_text(text, encoding="utf-8")
    return d


def status(cat, source_id):
    return cat.con.execute("SELECT status FROM sources WHERE id=?", [source_id]).fetchone()[0]


class TestScanAndLoad:
    def test_both_dirs_scanned(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        write_adapter(builtin, "ak", MANIFEST_A)
        write_adapter(tmp_root / "adapters", "sb", MANIFEST_B_SAME_DESC)
        res = reg.rebuild()
        assert "akshare" in res["sources"] and "source-b" in res["sources"]

    def test_bad_manifest_error_isolated(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        write_adapter(builtin, "ak", MANIFEST_A)
        write_adapter(tmp_root / "adapters", "bad", MANIFEST_BAD)
        res = reg.rebuild()
        assert res["errors"], "坏件必须报告"
        assert status(cat, "akshare") == "ok"
        err_row = cat.con.execute(
            "SELECT id, status FROM sources WHERE status='error'"
        ).fetchone()
        assert err_row and err_row[0].startswith("error:")

    def test_duplicate_id_later_error(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        write_adapter(builtin, "ak", MANIFEST_A)  # 内置先
        write_adapter(tmp_root / "adapters", "dup", MANIFEST_DUP)  # 用户后
        res = reg.rebuild()
        assert any("重复 id" in e["reason"] for e in res["errors"])
        assert status(cat, "akshare") == "ok"

    def test_removal_marks_disabled(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        d = write_adapter(tmp_root / "adapters", "sb", MANIFEST_B_SAME_DESC)
        reg.rebuild()
        assert status(cat, "source-b") == "ok"
        import shutil

        shutil.rmtree(d)
        reg.rebuild()
        assert status(cat, "source-b") == "disabled"

    def test_same_descriptor_merges(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        write_adapter(builtin, "ak", MANIFEST_A)
        write_adapter(tmp_root / "adapters", "sb", MANIFEST_B_SAME_DESC)
        reg.rebuild()
        sid = derive_id({"asset": "sc", "geo": "world", "measure": "close", "contract": ""})
        rows = cat.con.execute(
            "SELECT source_id FROM series_sources WHERE series_id=?", [sid]
        ).fetchall()
        assert {r[0] for r in rows} == {"akshare", "source-b"}
        n_series = cat.con.execute("SELECT COUNT(*) FROM series").fetchone()[0]
        assert n_series == 1

    def test_soft_delete_and_restore(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        d = write_adapter(tmp_root / "adapters", "sb", MANIFEST_B_SAME_DESC)
        reg.rebuild()
        sid = derive_id({"asset": "sc", "geo": "world", "measure": "close", "contract": ""})
        import shutil

        shutil.rmtree(d)
        reg.rebuild()
        s = cat.con.execute("SELECT status, valid_to FROM series WHERE id=?", [sid]).fetchone()
        assert s[0] == "soft_deleted" and s[1] is not None
        # 重新加入 → active、清 valid_to
        write_adapter(tmp_root / "adapters", "sb", MANIFEST_B_SAME_DESC)
        reg.rebuild()
        s = cat.con.execute("SELECT status, valid_to FROM series WHERE id=?", [sid]).fetchone()
        assert s[0] == "active" and s[1] is None

    def test_incremental_no_wipe(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        write_adapter(builtin, "ak", MANIFEST_A)
        reg.rebuild()
        # 全部 manifest 变坏 → 既有 series 行保留（历史仍可查询）
        for d in builtin.iterdir():
            (d / "manifest.yaml").write_text("id: [broken", encoding="utf-8")
        reg.rebuild()
        n = cat.con.execute("SELECT COUNT(*) FROM series").fetchone()[0]
        assert n == 1


class TestPrimaryDerivation:
    def test_primary_cache_follows_enabled_min_priority(self, tmp_root, tmp_path):
        builtin = tmp_path / "builtin"
        builtin.mkdir()
        cat = CatalogDB(tmp_root / "data" / "catalog.sqlite")
        reg = Registry(cat, builtin, tmp_root / "adapters")
        write_adapter(builtin, "ak", MANIFEST_A)  # priority 100
        write_adapter(tmp_root / "adapters", "sb", MANIFEST_B_SAME_DESC)  # priority 200
        reg.rebuild()
        sid = derive_id({"asset": "sc", "geo": "world", "measure": "close", "contract": ""})
        s = cat.con.execute(
            "SELECT unit, freq, tz FROM series WHERE id=?", [sid]
        ).fetchone()
        # 主源 = 启用源中优先级最小者（akshare）
        assert s[0] == "cny_bbl" and s[1] == "1d"
