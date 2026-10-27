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
    "fu_stock": derive_id({"asset": "fu", "geo": "cn", "measure": "stock", "contract": ""}),
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

    def test_inventory_fetches(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(SID["fu_stock"], do_fetch=True)
            rows = res["rows"]
            assert rows, "库存日报未返回数据"
            latest = max(r[0] for r in rows)
            if (datetime.now() - latest).days > 30:  # 上游数据陈旧：不判失败，但要显式报告
                print(f"\n[在线冒烟] 注意：东财库存日报最新数据为 {latest:%Y-%m-%d}（已陈旧，上游数据源停更）")
            assert all(r[2] == "kton" for r in rows)
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
    def test_eia_requires_user_key(self, tmp_path):
        """EIA 使用用户自带 key：未配置时显式 skip（凭据缺失属预期，不算失败）。"""
        from data import creds

        try:
            creds.get(tmp_path / "creds", "eia_api_key")
        except creds.CredsError:
            pytest.skip("未配置 EIA API key（用户自带凭证，发布验证时按需注入）")
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(SID["diesel_stock"], do_fetch=True, source="eia")
            assert res["rows"], "EIA 未返回数据"
        finally:
            svc.close()
