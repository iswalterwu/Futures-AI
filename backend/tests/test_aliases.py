"""AC-002-3：别名映射与裁决（手动 > manifest > 模板 > 模糊；来源作用域）。"""
from __future__ import annotations

from data.catalog.db import CatalogDB


class TestPrecedence:
    def test_manual_wins_over_manifest(self, tmp_path):
        cat = CatalogDB(tmp_path / "catalog.sqlite")
        assert cat.write_alias("SC_MAIN", "akshare", "s1", "manifest") == "written"
        assert cat.write_alias("SC_MAIN", "akshare", "s1", "manual") == "written"
        assert cat.resolve_alias("SC_MAIN", "akshare") == "s1"

    def test_lower_rule_rejected(self, tmp_path):
        cat = CatalogDB(tmp_path / "catalog.sqlite")
        cat.write_alias("SC_MAIN", "akshare", "s1", "manual")
        assert cat.write_alias("SC_MAIN", "akshare", "s9", "template") == "rejected"
        assert cat.resolve_alias("SC_MAIN", "akshare") == "s1"

    def test_manifest_over_template(self, tmp_path):
        cat = CatalogDB(tmp_path / "catalog.sqlite")
        cat.write_alias("X", "a", "s1", "manifest")
        assert cat.write_alias("X", "a", "s2", "template") == "rejected"
        assert cat.resolve_alias("X", "a") == "s1"

    def test_persistence_across_reopen(self, tmp_path):
        p = tmp_path / "catalog.sqlite"
        cat = CatalogDB(p)
        cat.write_alias("SC_MAIN", "akshare", "s1", "manual")
        cat2 = CatalogDB(p)
        assert cat2.resolve_alias("SC_MAIN", "akshare") == "s1"

    def test_adapter_scope(self, tmp_path):
        cat = CatalogDB(tmp_path / "catalog.sqlite")
        cat.write_alias("SC_MAIN", "akshare", "s1", "manifest")
        cat.write_alias("SC_MAIN", "other", "s2", "manifest")
        assert cat.resolve_alias("SC_MAIN", "akshare") == "s1"
        assert cat.resolve_alias("SC_MAIN", "other") == "s2"
        # 无适配器限定 → 取 rule 优先级最高者（同为 manifest 取先写入者）
        assert cat.resolve_alias("SC_MAIN") in ("s1", "s2")
