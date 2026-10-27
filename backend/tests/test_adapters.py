"""AC-001-2：manifest 字段契约与校验（plan §2.1）。"""
from __future__ import annotations

import pytest
import yaml

from data.manifest import ManifestError, load

GOOD = """
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


def write_manifest(tmp_path, text):
    p = tmp_path / "manifest.yaml"
    p.write_text(text, encoding="utf-8")
    return str(p)


class TestGood:
    def test_load_ok(self, tmp_path):
        m = load(write_manifest(tmp_path, GOOD))
        assert m.id == "akshare"
        assert m.provides[0].descriptor.contract == ""
        assert m.provides[0].priority == 100

    def test_contract_defaults(self, tmp_path):
        m = load(write_manifest(tmp_path, GOOD))
        d = m.provides[0].descriptor
        assert d.asset == "sc" and d.geo == "world" and d.measure == "close"


class TestRejections:
    def _bad(self, tmp_path, patch: str):
        """patch 形如 'key: value' 行替换，返回 ManifestError。"""
        raw = yaml.safe_load(GOOD)
        # patch 语法: "provides.0.unit: usd" 等
        path, _, value = patch.partition(": ")
        keys = path.split(".")
        node = raw
        for k in keys[:-1]:
            node = node[int(k)] if k.isdigit() else node[k]
        if keys[-1].isdigit():
            node[int(keys[-1])] = yaml.safe_load(value)
        else:
            node[keys[-1]] = yaml.safe_load(value)
        p = tmp_path / "manifest.yaml"
        p.write_text(yaml.safe_dump(raw, allow_unicode=True), encoding="utf-8")
        with pytest.raises(ManifestError) as ei:
            load(str(p))
        return ei.value

    def test_missing_required(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.unit: null")
        assert "unit" in e.field or "unit" in e.reason

    def test_illegal_unit(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.unit: usd_barrel")
        assert "unit" in e.field or "unit" in e.reason

    def test_illegal_freq(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.freq: 5m")
        assert "freq" in e.field or "freq" in e.reason

    def test_illegal_asset(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.descriptor.asset: rb")
        assert "asset" in e.field or "asset" in e.reason

    def test_illegal_contract_chars(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.descriptor.contract: 'SC 2401'")
        assert "contract" in e.field or "contract" in e.reason

    def test_contract_too_long(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.descriptor.contract: 'AAAAAAAAAAAAAAAAAAAAA'")
        assert "contract" in e.field or "contract" in e.reason

    def test_empty_symbols(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.symbols: []")
        assert "symbols" in e.field or "symbols" in e.reason

    def test_bad_tz(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.tz: Not/AZone")
        assert "tz" in e.field or "tz" in e.reason

    def test_negative_priority(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.priority: -5")
        assert "priority" in e.field or "priority" in e.reason

    def test_illegal_id(self, tmp_path):
        e = self._bad(tmp_path, "id: 'Bad Id!'")
        assert "id" in e.field or "id" in e.reason

    def test_missing_name(self, tmp_path):
        e = self._bad(tmp_path, "name: ''")
        assert "name" in e.field or "name" in e.reason

    def test_empty_provides(self, tmp_path):
        e = self._bad(tmp_path, "provides: []")
        assert "provides" in e.field or "provides" in e.reason

    def test_bad_modes(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.fetch.modes: [teleport]")
        assert "modes" in e.field or "modes" in e.reason

    def test_error_reports_path_and_field(self, tmp_path):
        e = self._bad(tmp_path, "provides.0.unit: bad_unit_x")
        assert tmp_path.name in e.path or "manifest" in e.path
        assert e.field
        assert e.reason
