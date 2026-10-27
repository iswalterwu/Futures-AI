"""发布管线：在线冒烟（tasks.md T-99）。

默认跳过；`FUTURESAI_ONLINE=1` 时对真实上游执行。用于发布前确认：
- akshare 仓单静态交易日历尚有余量（日历到期前预警，避免静默失效）
- 主力日线、库存日报、仓单日报在真实网络下可用（经本层适配器，不只测 SDK）
- EIA 需要用户自带 key：未配置时显式 skip

上游已知状况会打印在断言消息里（如库存源数据陈旧），便于发布记录。
"""
from __future__ import annotations

import os
from datetime import date, datetime, timedelta

import pytest

from data.adapters.akshare import akshare_adapter as ak_mod
from data.adapters.eia import eia_adapter as eia_mod
from data.catalog.descriptor import derive_id
from data.service import Service

pytestmark = pytest.mark.skipif(
    os.environ.get("FUTURESAI_ONLINE") != "1", reason="在线冒烟：设置 FUTURESAI_ONLINE=1 才执行"
)

SID = {
    "sc_close": derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": ""}),
    "sc_receipt": derive_id({"asset": "sc", "geo": "cn", "measure": "receipt", "contract": ""}),
    "diesel_stock": derive_id({"asset": "diesel", "geo": "na", "measure": "stock", "contract": ""}),
}


def _recent_trading_day(offset: int = 7) -> str:
    """最近一个（大致）交易日：往前推 offset 天，交给适配器的窗口/日历处理。"""
    return (date.today() - timedelta(days=offset)).strftime("%Y-%m-%d")


class TestCalendarHorizon:
    def test_receipt_calendar_has_headroom(self):
        """仓单静态交易日历须留有至少 31 天余量，否则发布前必须升级 akshare。"""
        last = ak_mod._receipt_calendar_last()
        headroom = (last - date.today()).days
        assert headroom >= 31, (
            f"akshare 仓单交易日历止于 {last}，仅剩 {headroom} 天："
            "请升级 akshare、更新 backend/constraints.txt 并回归后发布"
        )


class TestAkshareOnline:
    def test_main_daily_fetches_and_ingests(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(SID["sc_close"], do_fetch=True)
            rows = res["rows"]
            assert len(rows) > 100, f"主力日线行数过少：{len(rows)}"
            latest = max(r[0] for r in rows)
            assert (datetime.now() - latest).days <= 14, f"最新日线过旧：{latest}"
            assert all(r[2] == "cny_bbl" for r in rows)
        finally:
            svc.close()

    def test_builtin_coverage_is_close_plus_receipt(self, tmp_path):
        """v23（D-013）：内置只有五品种主力日线 + 交易所仓单，无第三方库存源。"""
        svc = Service(tmp_path).init()
        try:
            for asset in ("sc", "fu", "lu", "bu", "pg"):
                for measure in ("close", "receipt"):
                    sid = derive_id({"asset": asset, "geo": "cn", "measure": measure, "contract": ""})
                    assert svc.cat.source_declares(sid, "akshare"), (asset, measure)
                assert not svc.cat.source_declares(
                    derive_id({"asset": asset, "geo": "cn", "measure": "stock", "contract": ""}), "akshare"
                ), asset
        finally:
            svc.close()

    @pytest.mark.parametrize("key", ["sc_receipt"])
    def test_receipt_fetches(self, tmp_path, key):
        svc = Service(tmp_path).init()
        try:
            # 显式小窗口：仓单逐日抓取，只取最近 5 天
            res = svc.fetch(SID[key], _recent_trading_day(5), None, do_fetch=True)
            rows = res["rows"]
            assert rows, "仓单日报未返回数据（上期所页面解析可能需随上游改版调整）"
            assert all(r[2] == "kb" for r in rows)
            print(f"\n[在线冒烟] 仓单最新：{max(r[0] for r in rows):%Y-%m-%d} = {rows[-1][1]} kb")
        finally:
            svc.close()


class TestEiaOnline:
    def test_eia_api_or_offline_fallback(self, tmp_path):
        """D-014：有 key 走 API，无 key 自动回退免凭证官方下载；两条路径都必须真实可用。"""
        from data import creds

        has_key = creds.exists(tmp_path / "creds", "eia_api_key")
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(SID["diesel_stock"], do_fetch=True, source="eia")
            rows = res["rows"]
            assert rows, "EIA 未返回数据"
            path = svc.adapters["eia"].last_path
            assert path == ("api" if has_key else "offline"), path
            latest = max(r[0] for r in rows)
            print(f"\n[在线冒烟] EIA 路径={path}，最新 {latest:%Y-%m-%d} = {rows[-1][1]} kb")
            assert all(r[2] == "kb" for r in rows)
        finally:
            svc.close()
