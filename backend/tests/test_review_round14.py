"""第十四轮双审（B 两项 P2 + A/B 的 P3 与测试缺口）的回归测试（tasks.md T-54~T-59）。"""
from __future__ import annotations

import json
import sqlite3
import threading
import time
from datetime import datetime, timedelta

import pandas as pd
import pytest

from data import cli, creds, mcp_server
from data.adapters.akshare import akshare_adapter as ak_mod
from data.adapters.eia import eia_adapter as eia_mod
from data.catalog.descriptor import derive_id
from data.fetch.on_demand import FetchError
from data.lock import write_endpoint
from data.service import Service
from data.store.provenance import DiffError

from test_review_round12 import (
    EIA_DIESEL,
    SC0,
    SC_RECEIPT,
    FrozenDate,
    call_tool,
    cli_run,
    freeze_today,
    main_df,
    manifest_yaml,
    provide_yaml,
    write_manifest,
)

TODAY = datetime(2026, 10, 27)


def sid_of(asset, measure):
    return derive_id({"asset": asset, "geo": "cn", "measure": measure, "contract": ""})


def receipt_df(var, rows):
    """get_receipt 真实列结构：var/receipt/receipt_chg/date。"""
    return pd.DataFrame(
        {"var": [var] * len(rows), "receipt": [v for _, v in rows],
         "receipt_chg": [0] * len(rows), "date": [d for d, _ in rows]}
    )


def frozen_on(d: datetime):
    """返回“今天 = d”的日期类（模拟跨日取数）。"""

    class Day(FrozenDate):
        @classmethod
        def today(cls):
            return cls(d.year, d.month, d.day)

    return Day


def run_range(svc, rid):
    r = svc.store.run(rid)
    return r[3], r[4]  # range_start, range_end


class TestCoverageSnapshot:
    """T-54 / R14-B-01：批次覆盖 = 实际请求窗口（滚动窗口在建批次前解析）；diff 不再误报删除。"""

    def test_rolling_receipt_windows_not_comparable(self, tmp_path, monkeypatch):
        import shfe_html

        shfe_html.patch(monkeypatch, 1000)  # 上游数值恒定：只有请求窗口在变
        svc = Service(tmp_path).init()
        try:
            rids = []
            for day in (datetime(2026, 10, 28), datetime(2026, 10, 29)):
                monkeypatch.setattr(ak_mod, "date", frozen_on(day))
                svc.fetch(SC_RECEIPT, do_fetch=True)
                rids.append(svc.store.con.execute("SELECT max(ingest_run) FROM ingest_runs").fetchone()[0])
            r1, r2 = (run_range(svc, r) for r in rids)
            assert r1 == (datetime(2026, 9, 28), datetime(2026, 10, 28))  # 实际请求窗口入快照
            assert r2 == (datetime(2026, 9, 29), datetime(2026, 10, 29))
            with pytest.raises(DiffError) as ei:  # 窗口滑动 ≠ 删除：覆盖不同 → 不可比
                svc.diff(*rids)
            assert "覆盖范围不同" in ei.value.reason
            svc.fetch(SC_RECEIPT, do_fetch=True)  # 同一天再取：覆盖相同 → 可比且无删除
            r3 = svc.store.con.execute("SELECT max(ingest_run) FROM ingest_runs").fetchone()[0]
            assert svc.diff(rids[1], r3)["counts"] == {"added": 0, "revised": 0, "deleted": 0}
        finally:
            svc.close()

    def test_window_snapshot_per_route(self, tmp_path, monkeypatch):
        freeze_today(monkeypatch)
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df())
        monkeypatch.setattr(
            ak_mod, "_get_stock",
            lambda asset: pd.DataFrame({"日期": ["2026-10-09"], "库存": [1000.0], "增减": [0]}),
        )
        svc = Service(tmp_path).init()
        try:
            last = lambda: svc.store.con.execute("SELECT max(ingest_run) FROM ingest_runs").fetchone()[0]  # noqa: E731
            svc.fetch(SC0, do_fetch=True)
            assert run_range(svc, last()) == (None, None)  # 价格型：源全量历史
            svc.fetch(sid_of("fu", "stock"), do_fetch=True)
            assert run_range(svc, last()) == (TODAY - timedelta(days=ak_mod.STOCK_DEFAULT_DAYS), TODAY)
            svc.fetch(sid_of("fu", "stock"), "2026-10-01", "2026-10-20", do_fetch=True)
            assert run_range(svc, last()) == (datetime(2026, 10, 1), datetime(2026, 10, 20))  # 显式窗口原样
            res = svc.fetch(SC0, do_fetch=False)  # 读回仍按调用方范围（None = 全部历史）
            assert res["meta"]["range"] == {"start": None, "end": None}
        finally:
            svc.close()

    def test_truncated_stock_page_rejects_uncovered_start(self, tmp_path, monkeypatch):
        days = pd.bdate_range(end="2026-10-23", periods=ak_mod.STOCK_PAGE_ROWS)  # 源单页：最近 500 个交易日
        page = pd.DataFrame({"日期": days.date, "库存": [1000.0] * len(days), "增减": [0] * len(days)})
        monkeypatch.setattr(ak_mod, "_get_stock", lambda asset: page)
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            fu = sid_of("fu", "stock")
            with pytest.raises(FetchError) as ei:  # 请求起点早于源单页最早日期 → 不得虚报覆盖
                svc.fetch(fu, "2020-01-01", "2026-10-23", do_fetch=True)
            assert ei.value.code == "validation_error" and "超出源窗口" in ei.value.message
            assert svc.store.con.execute(
                "SELECT status FROM ingest_runs ORDER BY ingest_run DESC LIMIT 1"
            ).fetchone()[0] == "failed"
            res = svc.fetch(fu, do_fetch=True)  # 默认窗口（365 天）落在单页窗口内
            assert res["meta"]["count"] > 0
        finally:
            svc.close()


class TestQuantityUnits:
    """T-55 / R14-B-02：PG 仓单/库存（大商所按手计，20 吨/手）正确归一；未登记/量纲不匹配拒绝。"""

    @pytest.mark.parametrize(
        "var,raw,expected", [("PG", 2000, 40.0), ("FU", 12000, 12.0), ("BU", 9000, 9.0), ("LU", 3000, 3.0)]
    )
    def test_builtin_receipts_normalized(self, tmp_path, monkeypatch, var, raw, expected):
        import shfe_html

        if var == "PG":  # 大商所仓单仍走 akshare SDK
            import akshare

            monkeypatch.setattr(
                akshare, "get_receipt",
                lambda start_date=None, end_date=None, vars_list=None: receipt_df(var, [("20261020", raw)]),
            )
        else:  # 上期所/能源中心走上期所页面自解析
            shfe_html.patch(monkeypatch, raw, name=ak_mod.SHFE_RECEIPT_NAMES[var])
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(sid_of(var.lower(), "receipt"), do_fetch=True)
            assert res["rows"] and {r[1] for r in res["rows"]} == {expected}
            assert {r[2] for r in res["rows"]} == {"kton"}
        finally:
            svc.close()

    def test_builtin_pg_stock_through_real_sdk(self, tmp_path, monkeypatch):
        import akshare.futures.futures_inventory_em as em

        class Resp:
            def __init__(self, payload):
                self._payload = payload

            def json(self):
                return self._payload

        def fake_get(url, params=None, **kw):
            if params["reportName"] == "RPT_FUTU_POSITIONCODE":
                return Resp({"result": {"data": [{"TRADE_MARKET_CODE": "x", "TRADE_CODE": "ZZ", "TRADE_TYPE": "其他"}]}})
            assert 'SECURITY_CODE="PG"' in params["filter"]
            return Resp({"result": {"data": [
                {"SECURITY_CODE": "PG", "TRADE_DATE": "2026-10-20 00:00:00", "ON_WARRANT_NUM": 2000, "ADDCHANGE": 0},
            ]}})

        monkeypatch.setattr(em.requests, "get", fake_get)
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(sid_of("pg", "stock"), do_fetch=True)
            assert [(r[1], r[2]) for r in res["rows"]] == [(40.0, "kton")]  # 2000 手 × 20 吨 ÷ 1000
        finally:
            svc.close()

    def test_builtin_coverage_r007(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            for v in ("sc", "fu", "lu", "bu", "pg"):
                for m in ("close", "receipt"):
                    assert svc.cat.source_declares(sid_of(v, m), "akshare"), (v, m)
            for v in ("fu", "lu", "bu", "pg"):  # SC 的交易所库存口径 = 仓单日报（plan §2.1）
                assert svc.cat.source_declares(sid_of(v, "stock"), "akshare"), v
        finally:
            svc.close()

    @pytest.mark.parametrize(
        "asset,symbol,unit,needle",
        [("sc", "SC_RECEIPT", "kton", "不匹配"), ("pg", "PG_STOCK", "kb", "不匹配"),
         ("brent", "BRENT_RECEIPT", "kton", "未登记")],
    )
    def test_unsupported_quantity_rejected(self, tmp_path, monkeypatch, asset, symbol, unit, needle):
        called = []
        monkeypatch.setattr(ak_mod, "_get_receipt", lambda *a, **k: called.append(1))
        monkeypatch.setattr(ak_mod, "_get_stock", lambda *a, **k: called.append(1))
        measure = "stock" if symbol.endswith("_STOCK") else "receipt"
        write_manifest(
            tmp_path, "user-q",
            manifest_yaml("user-q", [provide_yaml(asset, "cn", measure, "", symbol, unit, priority=1)], implementation="akshare"),
        )
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(sid_of(asset, measure), do_fetch=True, source="user-q")
            assert ei.value.code == "validation_error" and needle in ei.value.message
            assert not called  # 拒绝在请求上游之前
        finally:
            svc.close()


class TestRound14Robustness:
    """T-56：迟到线程不回写、取消排队不泄漏、DPAPI 解密失败分类、未知序列溯源 not_found。"""

    def test_late_abandoned_call_cannot_write(self, tmp_path, monkeypatch):
        release = threading.Event()
        monkeypatch.setattr(ak_mod, "AKSHARE_TIMEOUT_S", 0.3)
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: (release.wait(30), main_df(999.0))[1])
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError):
                svc.fetch(SC0, do_fetch=True)
            release.set()
            time.sleep(0.5)  # 让被放弃的调用迟到返回
            assert svc.store.count_obs(SC0) == 0  # 迟到结果无回写路径
            monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df(500.0))
            svc.fetch(SC0, do_fetch=True)
            statuses = [r[0] for r in svc.store.con.execute(
                "SELECT status FROM ingest_runs ORDER BY ingest_run").fetchall()]
            assert statuses == ["failed", "succeeded"]  # failed 不翻转，重试批次不受污染
            assert [r[1] for r in svc.fetch(SC0, do_fetch=False)["rows"]] == [500.0]
        finally:
            release.set()
            svc.close()

    def test_cancelled_queued_fetches_do_not_run_or_leak(self, tmp_path, monkeypatch):
        from starlette.testclient import TestClient

        gate, entered, calls = threading.Event(), threading.Event(), []

        def slow(symbol):
            calls.append(symbol)
            if not entered.is_set():
                entered.set()
                assert gate.wait(30)
            return main_df(1.0)

        monkeypatch.setattr(ak_mod, "_get_main", slow)
        svc = Service(tmp_path).init()
        try:
            mcp = mcp_server.build_mcp(svc, "tok")
            args = {"series_id": SC0, "range": {}, "fetch": True}
            with TestClient(mcp.streamable_http_app()) as client:
                first = client.portal.start_task_soon(mcp.call_tool, "fetch_series", args)
                assert entered.wait(10)
                queued = [client.portal.start_task_soon(mcp.call_tool, "fetch_series", args) for _ in range(5)]
                time.sleep(0.3)
                for f in queued[:3]:
                    f.cancel()
                gate.set()
                first.result(timeout=30)
                for f in queued[3:]:
                    f.result(timeout=30)
                assert len(calls) == 3  # 1 个运行中 + 2 个未取消；3 个取消的排队请求未执行
                again = client.portal.call(mcp.call_tool, "fetch_series", args)  # 限流容量未泄漏
                assert "error" not in json.loads(again[0].text)
        finally:
            gate.set()
            svc.close()

    def test_dpapi_decrypt_failure_unauthorized(self, tmp_path, monkeypatch):
        creds.put(tmp_path / "creds", "eia_api_key", "k-" + "dpapi-0001")

        class BrokenDpapi:
            @staticmethod
            def CryptUnprotectData(*a, **k):
                raise OSError("simulated DPAPI decrypt failure")

        monkeypatch.setattr(creds, "_win32", lambda: BrokenDpapi)
        called = []
        monkeypatch.setattr(eia_mod, "_request", lambda *a, **k: called.append(1))
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(EIA_DIESEL, do_fetch=True, source="eia")
            assert (ei.value.code, ei.value.retryable) == ("unauthorized", False)
            out = call_tool(
                mcp_server.build_mcp(svc, "tok"), "fetch_series",
                {"series_id": EIA_DIESEL, "range": {}, "fetch": True, "source": "eia"},
            )
            assert (out["error"]["code"], out["error"]["retryable"]) == ("unauthorized", False)
            assert not called and svc.store.count_obs(EIA_DIESEL) == 0
            statuses = [r[0] for r in svc.store.con.execute(
                "SELECT status FROM ingest_runs ORDER BY ingest_run").fetchall()]
            assert statuses == ["failed", "failed"]  # service、MCP 两次各建一个批次并标 failed
        finally:
            svc.close()

    def test_provenance_unknown_series_not_found(self, tmp_path, capsys):
        from starlette.testclient import TestClient

        unknown = derive_id({"asset": "brent", "geo": "world", "measure": "stock", "contract": ""})
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.provenance(unknown)
            assert ei.value.code == "not_found"
            assert svc.provenance(SC0) == []  # 已登记无观测 = 空列表
            client = TestClient(mcp_server.build_mcp(svc, "tok").streamable_http_app())
            r = client.get(f"/internal/provenance?series_id={unknown}", headers={"Authorization": "Bearer tok"})
            assert r.status_code == 400 and r.json()["error"]["code"] == "not_found"
        finally:
            svc.close()
        assert cli_run(tmp_path, "provenance", unknown) == 1
        assert json.loads(capsys.readouterr().out)["error"]["code"] == "not_found"


class TestCliRound14:
    """T-57：CLI 不抛裸异常（写路径意外错误、DuckDB 损坏、serve 路径）；锁定措辞；非 serve 写进程等待。"""

    def test_write_path_unexpected_error_structured(self, tmp_path, monkeypatch, capsys):
        import duckdb

        from data.store.duck import DuckStore

        Service(tmp_path).init().close()

        def boom(self, *a, **k):
            raise duckdb.InvalidInputException("injected new_run failure")

        monkeypatch.setattr(DuckStore, "new_run", boom)
        assert cli_run(tmp_path, "fetch", SC0) == 1
        err = json.loads(capsys.readouterr().out)["error"]
        assert err["code"] == "internal" and "injected" in err["message"]
        assert not (tmp_path / "data" / ".lock").exists()

    @pytest.mark.parametrize("target", ["observations.duckdb", "catalog.sqlite"])
    def test_corrupt_db_all_paths_structured(self, tmp_path, capsys, target):
        Service(tmp_path).init().close()
        (tmp_path / "data" / target).write_bytes(b"\x00garbage, not a database file\x00" * 200)
        for argv in (["list", "sources"], ["provenance", SC0], ["config", "disable", "eia"],
                     ["serve", "--port", "18997"]):
            assert cli_run(tmp_path, *argv) == 1, argv
            err = json.loads(capsys.readouterr().out)["error"]
            assert err["code"] == "internal" and err["retryable"] is False, argv
            assert not (tmp_path / "data" / ".lock").exists(), argv

    def test_locked_catalog_wording(self, tmp_path, capsys):
        Service(tmp_path).init().close()
        other = sqlite3.connect(str(tmp_path / "data" / "catalog.sqlite"), isolation_level=None)
        other.execute("BEGIN EXCLUSIVE")
        try:
            assert cli_run(tmp_path, "list", "sources") == 1
            msg = json.loads(capsys.readouterr().out)["error"]["message"]
            assert "锁定" in msg and "损坏" not in msg
        finally:
            other.execute("ROLLBACK")
            other.close()

    def test_readonly_waits_for_non_serve_writer(self, tmp_path, capsys):
        Service(tmp_path).init().close()
        writer = Service(tmp_path)  # 非 serve 写命令持锁（无只读通道、无端点文件）
        threading.Timer(1.0, writer.close).start()
        t0 = time.monotonic()
        assert cli_run(tmp_path, "list", "sources") == 0  # 等待写进程结束后本地只读
        assert time.monotonic() - t0 >= 0.8
        assert json.loads(capsys.readouterr().out)["sources"]

    def test_stale_endpoint_falls_back_to_wait(self, tmp_path, capsys):
        Service(tmp_path).init().close()
        writer = Service(tmp_path)
        write_endpoint(tmp_path / "data", 1, "stale")  # 残留端点文件：不可达（Windows 拒连约 2s）→ 按非 serve 处理
        threading.Timer(4.5, writer.close).start()
        t0 = time.monotonic()
        assert cli_run(tmp_path, "list", "sources") == 0
        assert time.monotonic() - t0 >= 4.0  # 路由失败后继续等到写锁释放，而非报“内部路由失败”
        assert json.loads(capsys.readouterr().out)["sources"]

    def test_readonly_gives_up_after_wait(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        monkeypatch.setattr(cli, "READ_WAIT_S", 0.3)
        writer = Service(tmp_path)
        try:
            assert cli_run(tmp_path, "list", "sources") == 1
            assert "写进程运行中" in capsys.readouterr().err
        finally:
            writer.close()
