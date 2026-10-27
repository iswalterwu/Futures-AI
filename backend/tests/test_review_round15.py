"""第十五轮双审 P3 收口与测试缺口的回归测试（tasks.md T-60~T-64）。"""
from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path

import pytest

from data import cli, creds
from data.adapters.akshare import akshare_adapter as ak_mod
from data.fetch.on_demand import FetchError
from data.lock import write_endpoint
from data.service import Service

from test_review_round12 import SC_RECEIPT, cli_run, freeze_today
from test_review_round14 import receipt_df, sid_of

PG_RECEIPT_SID = sid_of("pg", "receipt")
PG_RECEIPT = sid_of("pg", "receipt")


def run_count(svc) -> int:
    return svc.store.con.execute("SELECT COUNT(*) FROM ingest_runs").fetchone()[0]


def last_run(svc) -> tuple:
    return svc.store.con.execute(
        "SELECT ingest_run, status FROM ingest_runs ORDER BY ingest_run DESC LIMIT 1"
    ).fetchone()


class TestInvertedWindow:
    """T-60：补全后的有效窗口倒置 → validation_error，不建批次、不请求上游。"""

    @pytest.mark.parametrize("sid,start", [(PG_RECEIPT_SID, "2027-01-01"), (SC_RECEIPT, "2026-12-01")])
    def test_future_start_without_end_rejected(self, tmp_path, monkeypatch, sid, start):
        called = []
        monkeypatch.setattr(ak_mod, "_get_receipt", lambda *a, **k: called.append(1))
        freeze_today(monkeypatch)  # 今天 = 2026-10-27 → 未给终点时终点 = 当日
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(sid, start, do_fetch=True)
            assert (ei.value.code, ei.value.retryable) == ("validation_error", False)
            assert "倒置" in ei.value.message
            assert run_count(svc) == 0 and not called
        finally:
            svc.close()


class TestReceiptCalendar:
    """T-61：请求终点超出 akshare 静态交易日历 → validation_error（提示升级），不静默 0 行成功。"""

    def test_window_beyond_calendar_rejected(self, tmp_path, monkeypatch):
        import akshare

        called = []
        monkeypatch.setattr(akshare, "get_receipt", lambda **kw: called.append(kw))
        monkeypatch.setattr(ak_mod, "_receipt_calendar_last", lambda: date(2026, 10, 25))
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(SC_RECEIPT, do_fetch=True)  # 默认窗口终点 = 2026-10-27 > 日历末日
            assert (ei.value.code, ei.value.retryable) == ("validation_error", False)
            assert "交易日历" in ei.value.message and "升级 akshare" in ei.value.message
            assert not called  # 拒绝在请求上游之前
            assert last_run(svc)[1] == "failed" and svc.store.count_obs(SC_RECEIPT) == 0
        finally:
            svc.close()

    def test_window_ending_on_calendar_last_day_allowed(self, tmp_path, monkeypatch):
        import shfe_html

        shfe_html.patch(monkeypatch, 2000)
        monkeypatch.setattr(ak_mod, "_receipt_calendar_last", lambda: date(2026, 10, 27))
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(SC_RECEIPT, do_fetch=True)
            assert res["rows"] and {r[1] for r in res["rows"]} == {2.0}
            assert {r[2] for r in res["rows"]} == {"kb"}
        finally:
            svc.close()

    def test_calendar_last_reads_sdk_calendar(self):
        from akshare.futures import receipt as ak_receipt

        assert ak_mod._receipt_calendar_last().strftime("%Y%m%d") == max(ak_receipt.calendar)


class TestStdoutPurity:
    """T-62：CLI 的 stdout 只输出 JSON；上游 SDK 的运行期打印（在工作线程中）改道 stderr。"""

    @staticmethod
    def chatty_receipt(monkeypatch):
        import shfe_html

        def chatty(date_str):
            print(date_str)  # 与真实 SDK 一样逐日打印到 stdout
            return shfe_html.page({date_str: {ak_mod.SHFE_RECEIPT_NAMES["SC"]: 1000}})

        monkeypatch.setattr(ak_mod, "_shfe_page", chatty)
        freeze_today(monkeypatch)

    def test_fetch_stdout_is_json(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        self.chatty_receipt(monkeypatch)
        assert cli_run(tmp_path, "fetch", SC_RECEIPT) == 0
        out = capsys.readouterr()
        payload = json.loads(out.out)
        assert payload["series_id"] == SC_RECEIPT and payload["count"] > 0
        assert "2026" in out.err  # SDK 打印未丢失，只是改道 stderr

    def test_jobs_run_stdout_is_json(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        self.chatty_receipt(monkeypatch)
        assert cli_run(tmp_path, "jobs", "register", "j-receipt", "akshare", SC_RECEIPT) == 0
        capsys.readouterr()
        assert cli_run(tmp_path, "jobs", "run", "j-receipt") == 0
        out = capsys.readouterr()
        assert json.loads(out.out)["meta"]["count"] > 0
        assert "2026" in out.err


class TestCliExit:
    """T-63：最外层统一错误出口；凭证写入失败 fail closed；只读通道无响应措辞。"""

    def test_root_is_a_file(self, tmp_path, capsys):
        f = tmp_path / "not-a-dir"
        f.write_text("x", encoding="utf-8")
        assert cli.main(["--root", str(f), "list", "sources"]) == 1
        err = json.loads(capsys.readouterr().out)["error"]
        assert err["code"] == "internal" and err["retryable"] is False

    def test_serve_build_failure_structured_and_clean(self, tmp_path, monkeypatch, capsys):
        from data import mcp_server

        def boom(*a, **k):
            raise RuntimeError("build failed (injected)")

        monkeypatch.setattr(mcp_server, "build_mcp", boom)
        monkeypatch.setattr(cli, "_install_exit_signals", lambda: None)
        assert cli_run(tmp_path, "serve", "--port", "18995") == 1
        err = json.loads(capsys.readouterr().out)["error"]
        assert err["code"] == "internal" and "injected" in err["message"]
        assert not (tmp_path / "data" / ".lock").exists()
        assert not (tmp_path / "data" / "mcp_endpoint.json").exists()

    def test_credential_write_failure_keeps_old_and_no_partial(self, tmp_path, monkeypatch, capsys):
        cdir = tmp_path / "creds"
        creds.put(cdir, "eia_api_key", "k-" + "old-0001")
        written = []

        def deny(src, dst):  # 临时文件已写入、替换时失败（覆盖清理分支）
            written.append(Path(src).read_bytes())
            raise PermissionError("target locked (injected)")

        monkeypatch.setattr(creds.os, "replace", deny)
        assert cli_run(tmp_path, "config", "credentials", "eia_api_key", "k-" + "new-0001") == 1
        assert "凭证写入失败" in capsys.readouterr().err
        monkeypatch.undo()
        assert written and written[0]  # 临时文件确已落盘后才失败
        assert creds.get(cdir, "eia_api_key") == "k-" + "old-0001"  # 既有凭证未被破坏
        assert not [p.name for p in cdir.iterdir() if p.suffix == ".tmp"]  # 自身临时文件已清理

    def test_unresponsive_route_wording(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        writer = Service(tmp_path)
        try:
            write_endpoint(tmp_path / "data", 1, "tok")

            def timeout(*a, **k):
                raise TimeoutError("timed out")

            monkeypatch.setattr(cli, "_internal_get", timeout)
            monkeypatch.setattr(cli, "READ_WAIT_S", 0.3)
            assert cli_run(tmp_path, "list", "sources") == 1
            err = capsys.readouterr().err
            assert "只读通道无响应" in err and "timed out" in err
        finally:
            writer.close()


class TestGaps15:
    """T-64：仓单经真实 SDK 到交易所 HTTP 边界；显式窗口的首/尾端点真删除仍计删除。"""

    def test_pg_receipt_through_real_sdk_dce_boundary(self, tmp_path, monkeypatch):
        import requests

        calls = []

        class Resp:
            def __init__(self, payload):
                self._payload = payload

            def json(self):
                return self._payload

        def fake_post(url, json=None, **kw):
            calls.append((url, json))
            assert "dce.com.cn" in url
            return Resp({"data": {"entityList": [
                {"variety": "液化石油气小计", "wbillQty": 2000, "diff": 0},
                {"variety": "豆一小计", "wbillQty": 999, "diff": 0},
            ]}})

        monkeypatch.setattr(requests, "post", fake_post)
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(PG_RECEIPT, "2026-10-20", "2026-10-20", do_fetch=True)
            # 2000 手 × 20 吨 ÷ 1000 = 40 千吨；其他品种（豆一）被过滤
            assert [(r[0], r[1], r[2]) for r in res["rows"]] == [(datetime(2026, 10, 20), 40.0, "kton")]
            assert [c[1]["tradeDate"] for c in calls] == ["20261020"]  # 仅大商所被请求
        finally:
            svc.close()

    def test_explicit_window_true_deletion_counted(self, tmp_path, monkeypatch):
        import shfe_html

        rounds = [
            {"20261019": 1000, "20261020": 1100, "20261021": 1200},
            {"20261020": 1100, "20261021": 1200},  # 上游删除首端点
            {"20261019": 1000, "20261020": 1100},  # 上游删除尾端点
        ]
        state = {"round": 0}

        def fake(date_str):
            value = rounds[min(state["round"], 2)].get(date_str)
            if date_str == "20261021":
                state["round"] += 1
            # 缺该品种的日期也返回带日期表的页面（结构真实，只是没有品种行）
            varieties = {ak_mod.SHFE_RECEIPT_NAMES["SC"]: value} if value is not None else {}
            return shfe_html.page({date_str: varieties})

        monkeypatch.setattr(ak_mod, "_shfe_page", fake)
        svc = Service(tmp_path).init()
        try:
            rids = []
            for _ in range(3):
                svc.fetch(SC_RECEIPT, "2026-10-19", "2026-10-21", do_fetch=True)
                rids.append(last_run(svc)[0])
            head = svc.diff(rids[0], rids[1])
            assert head["counts"] == {"added": 0, "revised": 0, "deleted": 1}
            assert head["deleted"] == [(datetime(2026, 10, 19), "akshare")]
            tail = svc.diff(rids[0], rids[2])
            assert tail["deleted"] == [(datetime(2026, 10, 21), "akshare")]
        finally:
            svc.close()
