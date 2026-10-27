"""AC-007-1/2/3：内置适配器（固定响应样本 mock + 隔离性 AC-007-4）。"""
from __future__ import annotations

from datetime import datetime

import pandas as pd
import pytest

from data import creds
from data.adapters.akshare import akshare_adapter as ak_mod
from data.adapters.akshare.akshare_adapter import AkshareAdapter
from data.adapters.eia import eia_adapter as eia_mod
from data.adapters.eia.eia_adapter import EiaAdapter
from data.adapters.local_file.local_file_adapter import (
    LocalFileAdapter,
    guess_mapping,
    parse_with_mapping,
)
from data.fetch.on_demand import FetchError
from data.manifest import load
from pathlib import Path

MANIFEST_DIR = Path(__file__).resolve().parent.parent / "data" / "adapters"


class TestAkshare:
    def test_main_daily_lines(self, monkeypatch):
        df = pd.DataFrame(
            {
                "日期": ["2026-10-01", "2026-10-02", "2026-10-03"],
                "收盘价": [500.0, 512.4, 510.0],
            }
        )
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: df)
        m = load(str(MANIFEST_DIR / "akshare" / "manifest.yaml"))
        p = m.provides[0]
        rows, _ = AkshareAdapter().fetch(p, None, None)
        assert len(rows) == 3 and rows[1][1] == pytest.approx(512.4)

    def test_range_filter(self, monkeypatch):
        df = pd.DataFrame({"日期": ["2026-10-01", "2026-10-05"], "收盘价": [1.0, 2.0]})
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: df)
        m = load(str(MANIFEST_DIR / "akshare" / "manifest.yaml"))
        rows, _ = AkshareAdapter().fetch(
            m.provides[0], datetime(2026, 10, 2), datetime(2026, 10, 10)
        )
        assert len(rows) == 1 and rows[0][1] == 2.0


class TestReceiptAndContract:
    def test_receipt_route_not_price(self, monkeypatch):
        df = pd.DataFrame({"日期": ["2026-10-01"], "值": [32000.0]})
        monkeypatch.setattr(ak_mod, "_get_receipt", lambda asset, start=None, end=None: df)
        m = load(str(MANIFEST_DIR / "akshare" / "manifest.yaml"))
        provide = next(p for p in m.provides if p.symbols[0] == "SC_RECEIPT")
        rows, _ = AkshareAdapter().fetch(provide, None, None)
        assert rows[0][1] == pytest.approx(32000.0)

    def test_designated_contract_route(self, monkeypatch):
        df = pd.DataFrame({"日期": ["2026-10-01"], "收盘价": [499.0]})
        monkeypatch.setattr(ak_mod, "_get_contract", lambda symbol: df)
        provide = type("P", (), {"symbols": ["SC2401"]})()
        rows, _ = AkshareAdapter().fetch(provide, None, None)
        assert rows[0][1] == pytest.approx(499.0)


class TestEia:
    def test_fetch_with_fixed_sample(self, tmp_path, monkeypatch):
        payload = {"response": {"data": [{"period": "2026-10-03", "value": "120.5"}]}}
        monkeypatch.setattr(eia_mod, "_request", lambda *a, **k: payload)
        creds.put(tmp_path / "creds", "eia_api_key", "sk-fake-key-12345678")
        m = load(str(MANIFEST_DIR / "eia" / "manifest.yaml"))
        rows, _ = EiaAdapter(tmp_path / "creds").fetch(m.provides[0], None, None)
        assert len(rows) == 1 and rows[0][1] == pytest.approx(120.5)

    def test_key_missing_fail_closed(self, tmp_path, monkeypatch):
        called = []
        monkeypatch.setattr(eia_mod, "_request", lambda *a, **k: called.append(1))
        m = load(str(MANIFEST_DIR / "eia" / "manifest.yaml"))
        with pytest.raises(creds.CredsError):
            EiaAdapter(tmp_path / "creds").fetch(m.provides[0], None, None)
        assert not called  # 凭证失败 → 不发起网络请求


class TestLocalFile:
    def test_guess_and_parse_csv(self, tmp_path):
        f = tmp_path / "prices.csv"
        f.write_text("日期,收盘价\n2026-10-01,70.5\n2026-10-02,71.0\n", encoding="utf-8")
        df = pd.read_csv(f)
        mp = guess_mapping(df)
        assert mp == {"date_col": "日期", "value_col": "收盘价"}
        rows, _ = parse_with_mapping(str(f), mp)
        assert len(rows) == 2 and rows[0][1] == pytest.approx(70.5)

    def test_incomplete_mapping_rejected(self, tmp_path):
        f = tmp_path / "x.csv"
        f.write_text("a,b\n1,2\n", encoding="utf-8")
        df = pd.read_csv(f)
        mp = guess_mapping(df)
        with pytest.raises(FetchError) as ei:
            parse_with_mapping(str(f), mp)
        assert ei.value.code == "validation_error"

    def test_direct_fetch_guides_to_import(self):
        m = load(str(MANIFEST_DIR / "local_file" / "manifest.yaml"))
        with pytest.raises(FetchError) as ei:
            LocalFileAdapter().fetch(m.provides[0], None, None)
        assert "import" in ei.value.message


class TestReceiptSdkShape:
    def test_receipt_real_column_shape(self, monkeypatch):
        """F-03：真实 akshare 仓单列结构（var/receipt/receipt_chg/date）。"""
        df = pd.DataFrame(
            {
                "var": ["SC"],
                "receipt": [32000],
                "receipt_chg": [100],
                "date": ["2026-10-01"],
            }
        )
        monkeypatch.setattr(ak_mod, "_get_receipt", lambda asset, start=None, end=None: df)
        m = load(str(MANIFEST_DIR / "akshare" / "manifest.yaml"))
        provide = next(p for p in m.provides if p.symbols[0] == "SC_RECEIPT")
        rows, _ = AkshareAdapter().fetch(provide, None, None)
        assert len(rows) == 1 and rows[0][1] == pytest.approx(32000)


class TestIsolation:
    def test_one_adapter_failure_isolated(self, tmp_path, monkeypatch):
        """AC-007-4：任一适配器失败不影响其他适配器。"""
        def boom(*a, **k):
            raise RuntimeError("akshare 网络故障")

        monkeypatch.setattr(ak_mod, "_get_main", boom)
        m_ak = load(str(MANIFEST_DIR / "akshare" / "manifest.yaml"))
        payload = {"response": {"data": [{"period": "2026-10-03", "value": "1.0"}]}}
        monkeypatch.setattr(eia_mod, "_request", lambda *a, **k: payload)
        creds.put(tmp_path / "creds", "eia_api_key", "sk-fake-key-12345678")
        m_eia = load(str(MANIFEST_DIR / "eia" / "manifest.yaml"))
        with pytest.raises(Exception):
            AkshareAdapter().fetch(m_ak.provides[0], None, None)
        rows, _ = EiaAdapter(tmp_path / "creds").fetch(m_eia.provides[0], None, None)
        assert len(rows) == 1  # EIA 不受影响
