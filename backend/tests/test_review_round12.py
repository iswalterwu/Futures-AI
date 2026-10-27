"""第十二轮审核员 A 发现（A-P2-1~5、P3、测试缺口）的回归测试（tasks.md T-34~T-46）。"""
from __future__ import annotations

import asyncio
import json
import os
import sqlite3
import subprocess
import sys
import threading
import time
from datetime import date, datetime
from pathlib import Path

import pandas as pd
import pytest

from data import cli, creds
from data.adapters.akshare import akshare_adapter as ak_mod
from data.adapters.eia import eia_adapter as eia_mod
from data.catalog.db import CatalogDB
from data.catalog.descriptor import derive_id
from data.catalog.registry import REASON_REMOVED
from data.fetch.on_demand import FetchError
from data.lock import LockBusy
from data.service import Service
from data.store.duck import utcnow

BACKEND = Path(__file__).resolve().parent.parent
BASE = datetime(2026, 10, 1)
SC0 = derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": ""})
SC2401 = derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": "SC2401"})
SC_RECEIPT = derive_id({"asset": "sc", "geo": "cn", "measure": "receipt", "contract": ""})
FU_STOCK = derive_id({"asset": "fu", "geo": "cn", "measure": "stock", "contract": ""})
EIA_DIESEL = derive_id({"asset": "diesel", "geo": "na", "measure": "stock", "contract": ""})
NWE_STOCK = derive_id({"asset": "diesel", "geo": "nwe", "measure": "stock", "contract": ""})


def cli_run(root, *argv):
    return cli.main(["--root", str(root), *argv])


def provide_yaml(asset, geo, measure, contract, symbol, unit, freq="1d", tz="Asia/Shanghai", priority=100):
    return (
        f'  - descriptor: {{asset: {asset}, geo: {geo}, measure: {measure}, contract: "{contract}"}}\n'
        f'    symbols: ["{symbol}"]\n'
        f"    unit: {unit}\n    freq: {freq}\n    tz: {tz}\n    priority: {priority}\n"
        "    fetch: {modes: [on_demand], history_days: 3650}\n"
        "    update: {lag_min: 0, revises: true}\n"
    )


def manifest_yaml(source_id, provides, implementation=None, credentials="none"):
    impl = f"implementation: {implementation}\n" if implementation else ""
    return (
        f"id: {source_id}\nname: {source_id}\nversion: 1\ncredentials: {credentials}\n{impl}provides:\n"
        + "".join(provides)
    )


def write_manifest(root, dirname, text):
    d = Path(root) / "adapters" / dirname
    d.mkdir(parents=True, exist_ok=True)
    (d / "manifest.yaml").write_text(text, encoding="utf-8")
    return d


def call_tool(mcp, name, args):
    out = asyncio.run(mcp.call_tool(name, args))
    text = out[0].text if hasattr(out[0], "text") else str(out[0])
    return json.loads(text)


class FrozenDate(date):
    """固定“今天”：仓单/库存的默认滚动窗口与运行日期无关（测试可复现）。"""

    @classmethod
    def today(cls):
        return cls(2026, 10, 27)


def freeze_today(monkeypatch):
    monkeypatch.setattr(ak_mod, "date", FrozenDate)


def main_df(value=500.0, day="2026-10-01"):
    return pd.DataFrame({"日期": [day], "收盘价": [value]})


ALT_SC0 = manifest_yaml(
    "alt-src", [provide_yaml("sc", "cn", "close", "", "SC0", "cny_bbl", priority=10)], implementation="akshare"
)


class TestFreshRootReadonly:
    """T-34 / A-P2-1：空数据目录首启，只读命令不抛裸异常、不建库。"""

    def test_readonly_commands_on_fresh_root(self, tmp_path, capsys):
        root = tmp_path / "fresh"
        assert cli_run(root, "list", "sources") == 0
        ids = {s["adapter_id"] for s in json.loads(capsys.readouterr().out)["sources"]}
        assert {"akshare", "eia", "local-file"} <= ids  # 内存目录按当前清单编译
        assert cli_run(root, "list", "series") == 0
        assert json.loads(capsys.readouterr().out)["matches"]
        assert cli_run(root, "reconcile", "no-such-series") == 0
        rep = json.loads(capsys.readouterr().out)["report"]
        assert any("无可用序列" in w for w in rep["warnings"])
        assert cli_run(root, "reconcile", SC0) == 0
        assert json.loads(capsys.readouterr().out)["report"]["series_id"] == SC0
        assert cli_run(root, "provenance", SC0) == 0
        assert json.loads(capsys.readouterr().out) == []
        assert cli_run(root, "jobs", "list") == 0
        assert json.loads(capsys.readouterr().out) == {"jobs": []}
        assert cli_run(root, "diff", "1", "2") == 1
        err = json.loads(capsys.readouterr().out)["error"]
        assert err["code"] == "validation_error" and "不可比" in err["message"]
        # 只读命令不在磁盘建库、不留写锁
        for name in ("catalog.sqlite", "observations.duckdb", ".lock"):
            assert not (root / "data" / name).exists(), name

    def test_uninitialized_db_files_treated_as_fresh(self, tmp_path, capsys):
        root = tmp_path / "half"
        (root / "data").mkdir(parents=True)
        (root / "data" / "catalog.sqlite").write_bytes(b"")  # 中途崩溃留下的空文件
        (root / "data" / "observations.duckdb").write_bytes(b"")
        assert cli_run(root, "list", "sources") == 0
        assert json.loads(capsys.readouterr().out)["sources"]
        assert cli_run(root, "provenance", SC0) == 0


class TestConfigValidation:
    """T-35 / A-P2-2：只能配置已有清单的源与存在的序列（AC-004-5），违者不落库。"""

    @pytest.mark.parametrize(
        "argv,code",
        [
            (["config", "priority", "no-such-series", "akshare", "5"], "not_found"),
            (["config", "priority", SC0, "no-such-src", "5"], "not_found"),
            (["config", "priority", SC0, "eia", "5"], "validation_error"),  # eia 清单未声明 SC0
            (["config", "priority", SC0, "akshare", "-1"], "validation_error"),
            (["config", "alias", "MY_SYM", "no-such-src", SC0], "not_found"),
            (["config", "alias", "MY_SYM", "akshare", "no-such-series"], "not_found"),
            (["config", "enable", "no-such-src"], "not_found"),
            (["config", "disable", "no-such-src"], "not_found"),
            (["jobs", "register", "j1", "no-such-src", SC0], "not_found"),
            (["jobs", "register", "j1", "eia", SC0], "validation_error"),
            (["jobs", "register", "j1", "akshare", "no-such-series"], "not_found"),
        ],
    )
    def test_unknown_targets_rejected_not_persisted(self, tmp_path, capsys, argv, code):
        Service(tmp_path).init().close()
        assert cli_run(tmp_path, *argv) == 1
        err = json.loads(capsys.readouterr().out)["error"]
        assert err["code"] == code and err["retryable"] is False
        cat = CatalogDB(tmp_path / "data" / "catalog.sqlite")
        try:
            assert cat.con.execute("SELECT COUNT(*) FROM user_overrides").fetchone()[0] == 0
            assert cat.con.execute(
                "SELECT COUNT(*) FROM aliases WHERE rule_kind='manual'"
            ).fetchone()[0] == 0
            assert cat.con.execute("SELECT COUNT(*) FROM jobs").fetchone()[0] == 0
            assert all(r[0] == 1 for r in cat.con.execute("SELECT enabled FROM sources WHERE status='ok'"))
        finally:
            cat.close()

    def test_virtual_error_entry_and_removed_source_not_configurable(self, tmp_path, capsys):
        write_manifest(tmp_path, "gone", ALT_SC0.replace("alt-src", "gone-src"))
        write_manifest(tmp_path, "bad", "id: [broken")
        Service(tmp_path).init().close()
        import shutil

        shutil.rmtree(tmp_path / "adapters" / "gone")
        svc = Service(tmp_path).init()
        try:
            virtual = next(s["adapter_id"] for s in svc.list_sources()["sources"] if s["adapter_id"].startswith("error:"))
        finally:
            svc.close()
        assert cli_run(tmp_path, "config", "disable", virtual) == 1
        assert json.loads(capsys.readouterr().out)["error"]["code"] == "not_found"
        assert cli_run(tmp_path, "config", "enable", "gone-src") == 1  # 清单已移除
        assert json.loads(capsys.readouterr().out)["error"]["code"] == "validation_error"


class TestErrorClassification:
    """T-36 / A-P2-3：凭证失败 → unauthorized；未绑定实现 → not_found；均不可重试。"""

    def test_missing_credential_unauthorized_service_and_mcp(self, tmp_path, monkeypatch):
        called = []
        monkeypatch.setattr(eia_mod, "_request", lambda *a, **k: called.append(1))
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(EIA_DIESEL, do_fetch=True, source="eia")
            assert ei.value.code == "unauthorized" and ei.value.retryable is False
            assert not called  # 凭证失败不发起网络请求
            (status,) = svc.store.con.execute("SELECT status FROM ingest_runs").fetchone()
            assert status == "failed"  # 批次拉取前创建、失败标 failed

            from data import mcp_server

            out = call_tool(
                mcp_server.build_mcp(svc, "tok"),
                "fetch_series",
                {"series_id": EIA_DIESEL, "range": {}, "fetch": True, "source": "eia"},
            )
            assert out["error"]["code"] == "unauthorized"
            assert out["error"]["retryable"] is False
        finally:
            svc.close()

    def test_unbound_source_not_found(self, tmp_path):
        write_manifest(
            tmp_path,
            "decl-only",
            manifest_yaml("decl-only", [provide_yaml("sc", "cn", "close", "", "DECL", "cny_bbl", priority=1)]),
        )
        svc = Service(tmp_path).init()
        try:
            for kwargs in ({"source": "decl-only"}, {}):  # 显式源 / 默认源（优先级最小 = 仅声明源）
                with pytest.raises(FetchError) as ei:
                    svc.fetch(SC0, do_fetch=True, **kwargs)
                assert ei.value.code == "not_found" and ei.value.retryable is False
                assert "未绑定" in ei.value.message
        finally:
            svc.close()


class TestBindingContractInventory:
    """T-37 / A-P2-4：指定合约（用户清单绑定 akshare）与库存日报经 清单→目录→取数→入库 全链路。"""

    def test_user_manifest_contract_end_to_end(self, tmp_path, monkeypatch):
        write_manifest(
            tmp_path,
            "sc-contracts",
            manifest_yaml(
                "sc-contracts",
                [provide_yaml("sc", "cn", "close", "SC2401", "SC2401", "cny_bbl")],
                implementation="akshare",
            ),
        )
        seen = []
        df = pd.DataFrame({"date": ["2023-12-01", "2023-12-04"], "close": [600.5, 610.0]})
        monkeypatch.setattr(ak_mod, "_get_contract", lambda symbol: seen.append(symbol) or df)
        svc = Service(tmp_path).init()
        try:
            assert svc.cat.enabled_sources(SC2401) == ["sc-contracts"]
            res = svc.fetch(SC2401, do_fetch=True)
            assert seen == ["SC2401"]
            assert [r[1] for r in res["rows"]] == [600.5, 610.0]
            assert {r[3] for r in res["rows"]} == {"sc-contracts"}
            assert svc.store.count_obs(SC2401) == 2
            match = next(m for m in svc.search("SC2401")["matches"] if m["series_id"] == SC2401)
            assert match["descriptor"]["contract"] == "SC2401"
        finally:
            svc.close()

    def test_builtin_inventory_end_to_end(self, tmp_path, monkeypatch):
        seen = []
        df = pd.DataFrame(
            {"日期": ["2026-10-08", "2026-10-09"], "库存": [12000.0, 15000.0], "增减": [0, 3000]}
        )
        monkeypatch.setattr(ak_mod, "_get_stock", lambda asset: seen.append(asset) or df)
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(FU_STOCK, do_fetch=True)
            assert seen == ["FU"]
            assert [r[1] for r in res["rows"]] == [12.0, 15.0]  # 吨 → 千吨（声明 kton）
            assert {r[2] for r in res["rows"]} == {"kton"}
            assert svc.store.count_obs(FU_STOCK) == 2
        finally:
            svc.close()

    def test_builtin_receipt_end_to_end(self, tmp_path, monkeypatch):
        df = pd.DataFrame({"var": ["SC"], "receipt": [5451000], "receipt_chg": [0], "date": ["2026-10-09"]})
        monkeypatch.setattr(ak_mod, "_get_receipt", lambda asset, start=None, end=None: df)
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(SC_RECEIPT, do_fetch=True)
            assert [(r[1], r[2]) for r in res["rows"]] == [(5451.0, "kb")]  # 桶 → 千桶
        finally:
            svc.close()

    def test_user_eia_binding_uses_own_credential_ref(self, tmp_path, monkeypatch):
        write_manifest(
            tmp_path,
            "my-eia",
            manifest_yaml(
                "my-eia",
                [provide_yaml("diesel", "na", "stock", "", "WDISTUS1", "kb", freq="1w", tz="America/New_York", priority=1)],
                implementation="eia",
                credentials="{kind: api_key, credential_ref: my_eia_key}",
            ),
        )
        got = []
        payload = {"response": {"data": [{"period": "2026-10-02", "value": "100.0"}]}}
        monkeypatch.setattr(eia_mod, "_request", lambda sid, key, s, e: got.append(key) or payload)
        creds.put(tmp_path / "creds", "my_eia_key", "k-" + "user-eia-0001")
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(EIA_DIESEL, do_fetch=True, source="my-eia")
            assert got == ["k-" + "user-eia-0001"]
            assert res["meta"]["source"] == "my-eia"
        finally:
            svc.close()

    def test_unknown_implementation_rejected_with_reason(self, tmp_path):
        write_manifest(
            tmp_path,
            "weird",
            manifest_yaml("weird", [provide_yaml("sc", "cn", "close", "", "W", "cny_bbl")], implementation="python-code"),
        )
        svc = Service(tmp_path).init()
        try:
            err = [s for s in svc.list_sources()["sources"] if s["status"] == "error"]
            assert len(err) == 1 and "implementation" in err[0]["reason"]
        finally:
            svc.close()


class TestImportTargets:
    """T-37 / T-44 / T-45：导入目标 = local-file 绑定的启用源所声明序列；带时区时间换算到声明时区。"""

    LOCAL_NWE = manifest_yaml(
        "my-csv",
        [provide_yaml("diesel", "nwe", "stock", "", "nwe_csv", "kton", tz="Europe/Amsterdam")],
        implementation="local-file",
    )

    def test_choose_among_targets_tz_and_upper_suffix(self, tmp_path, monkeypatch):
        write_manifest(tmp_path, "my-csv", self.LOCAL_NWE)
        Service(tmp_path).init().close()
        f = tmp_path / "stock.CSV"  # 大写后缀
        f.write_text("date,value\n2026-10-01T00:00:00+00:00,10.5\n", encoding="utf-8")
        answers = iter(["2", "y", "y"])  # [1]=local-file/crude [2]=my-csv/nwe → 确认 → 映射确认
        monkeypatch.setattr("builtins.input", lambda prompt="": next(answers))
        assert cli_run(tmp_path, "import", str(f)) == 0
        svc = Service(tmp_path)
        try:
            rows = svc.store.con.execute(
                "SELECT ts, value, source, unit FROM observations WHERE series_id=?", [NWE_STOCK]
            ).fetchall()
            # UTC 00:00 → 阿姆斯特丹夏令时 02:00（目标源声明时区下的时间标签）
            assert rows == [(datetime(2026, 10, 1, 2, 0), 10.5, "my-csv", "kton")]
        finally:
            svc.close()

    def test_series_option_and_no_target(self, tmp_path, monkeypatch, capsys):
        write_manifest(tmp_path, "my-csv", self.LOCAL_NWE)
        Service(tmp_path).init().close()
        f = tmp_path / "s.csv"
        f.write_text("date,value\n2026-10-01,1.0\n", encoding="utf-8")
        monkeypatch.setattr("builtins.input", lambda prompt="": "y")
        assert cli_run(tmp_path, "import", str(f), "--series", NWE_STOCK) == 0
        assert cli_run(tmp_path, "import", str(f), "--series", SC0) == 1  # SC0 无 local-file 源
        assert "无可导入目标" in capsys.readouterr().err

    def test_invalid_choice_rejected(self, tmp_path, monkeypatch, capsys):
        write_manifest(tmp_path, "my-csv", self.LOCAL_NWE)
        Service(tmp_path).init().close()
        f = tmp_path / "s.csv"
        f.write_text("date,value\n2026-10-01,1.0\n", encoding="utf-8")
        monkeypatch.setattr("builtins.input", lambda prompt="": "0")
        assert cli_run(tmp_path, "import", str(f)) == 1
        assert "无效选择" in capsys.readouterr().err


class TestEnableDisable:
    """T-38 / A-P2-5：R-001 单源启停入口；停用不改历史可见性与择优（AC-003-2/4）。"""

    def test_disable_enable_persist_across_restart(self, tmp_path, capsys):
        write_manifest(tmp_path, "alt-src", ALT_SC0)
        Service(tmp_path).init().close()
        assert cli_run(tmp_path, "config", "disable", "alt-src") == 0
        assert cli_run(tmp_path, "list", "sources") == 0
        capsys.readouterr()
        svc = Service(tmp_path).init()  # 新进程语义：重新打开即读到持久化状态
        try:
            assert svc.cat.enabled_sources(SC0) == ["akshare"]
            src = {s["adapter_id"]: s for s in svc.list_sources()["sources"]}
            assert src["alt-src"]["enabled"] is False and src["alt-src"]["status"] == "ok"
        finally:
            svc.close()
        assert cli_run(tmp_path, "config", "enable", "alt-src") == 0
        svc = Service(tmp_path).init()
        try:
            assert svc.cat.enabled_sources(SC0) == ["alt-src", "akshare"]
        finally:
            svc.close()

    def test_disabled_history_visible_and_default_fetch_moves(self, tmp_path, monkeypatch):
        write_manifest(tmp_path, "alt-src", ALT_SC0)
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df())
        svc = Service(tmp_path).init()
        try:
            svc.fetch(SC0, do_fetch=True)  # 默认源 = alt-src（优先级 10）
            svc.set_source_enabled("alt-src", False)
            svc.fetch(SC0, do_fetch=True)  # 默认源移到 akshare
            last = svc.store.con.execute(
                "SELECT adapter_id FROM ingest_runs ORDER BY ingest_run DESC LIMIT 1"
            ).fetchone()[0]
            assert last == "akshare"
            rows = svc.fetch(SC0, do_fetch=False)["rows"]
            # 择优候选 = 全部源观测：停用源 alt-src 的历史仍可见，且按优先级 10 胜出
            assert len(rows) == 1 and rows[0][3] == "alt-src"
            with pytest.raises(FetchError) as ei:
                svc.fetch(SC0, do_fetch=True, source="alt-src")
            assert ei.value.code == "validation_error"
            # 展示口径（主源派生缓存）随启停刷新：主源回到 akshare
            assert svc.cat.enabled_sources(SC0) == ["akshare"]
        finally:
            svc.close()


class TestManifestReason:
    """T-39 / AC-001-2：校验失败原因用户可见（list_sources.reason + serve 启动报告）。"""

    BAD = manifest_yaml("bad-one", [provide_yaml("sc", "cn", "close", "", "X", "usd_barrel")])

    def test_reason_visible_then_cleared(self, tmp_path, capsys):
        write_manifest(tmp_path, "bad-one", self.BAD)
        Service(tmp_path).init().close()
        assert cli_run(tmp_path, "list", "sources") == 0
        srcs = json.loads(capsys.readouterr().out)["sources"]
        err = [s for s in srcs if s["status"] == "error"]
        assert len(err) == 1
        assert "bad-one" in err[0]["reason"] and "unit" in err[0]["reason"]  # 路径 + 字段 + 原因
        assert {s["adapter_id"]: s for s in srcs}["akshare"]["reason"] is None
        write_manifest(tmp_path, "bad-one", self.BAD.replace("usd_barrel", "cny_bbl"))
        svc = Service(tmp_path).init()
        try:
            srcs = {s["adapter_id"]: s for s in svc.list_sources()["sources"]}
            assert srcs["bad-one"]["status"] == "ok" and srcs["bad-one"]["reason"] is None
            assert not any(k.startswith("error:") for k in srcs)
            n = svc.cat.con.execute("SELECT COUNT(*) FROM source_reasons").fetchone()[0]
            assert n == 0
        finally:
            svc.close()

    def test_removed_source_reason(self, tmp_path):
        d = write_manifest(tmp_path, "alt-src", ALT_SC0)
        Service(tmp_path).init().close()
        import shutil

        shutil.rmtree(d)
        svc = Service(tmp_path).init()
        try:
            src = {s["adapter_id"]: s for s in svc.list_sources()["sources"]}["alt-src"]
            assert src["status"] == "disabled" and src["reason"] == REASON_REMOVED
        finally:
            svc.close()

    def test_serve_reports_errors_and_cleans_up(self, tmp_path, monkeypatch, capsys):
        """serve：启动打印校验失败；端口/issuer 一致；退出删除端点文件并释放写锁（T-40）。"""
        from mcp.server.fastmcp import FastMCP

        from data.lock import read_endpoint

        write_manifest(tmp_path, "bad-one", self.BAD)
        seen = {}

        def fake_run(self, transport=None, **kw):
            seen["endpoint"] = read_endpoint(tmp_path / "data")
            seen["lock"] = (tmp_path / "data" / ".lock").exists()
            seen["port"] = self.settings.port
            seen["issuer"] = str(self.settings.auth.issuer_url)
            raise KeyboardInterrupt

        monkeypatch.setattr(FastMCP, "run", fake_run)
        monkeypatch.setattr(cli, "_install_exit_signals", lambda: None)
        assert cli_run(tmp_path, "serve", "--port", "18931") == 0
        err = capsys.readouterr().err
        assert "清单校验失败" in err and "unit" in err
        assert seen["endpoint"]["port"] == 18931 and seen["lock"] is True
        assert seen["port"] == 18931 and "18931" in seen["issuer"]
        assert not (tmp_path / "data" / "mcp_endpoint.json").exists()
        assert not (tmp_path / "data" / ".lock").exists()

    def test_exit_signals_raise_keyboardinterrupt(self):
        import signal

        names = [n for n in ("SIGBREAK", "SIGTERM") if hasattr(signal, n)]
        saved = {n: signal.getsignal(getattr(signal, n)) for n in names}
        try:
            cli._install_exit_signals()
            for n in names:
                handler = signal.getsignal(getattr(signal, n))
                with pytest.raises(KeyboardInterrupt):
                    handler(getattr(signal, n), None)
        finally:
            for n, h in saved.items():
                signal.signal(getattr(signal, n), h)


class TestNonBlocking:
    """T-41：取数网络阶段不占数据访问锁；MCP 工具不阻塞事件循环。"""

    def _slow_main(self, gate, entered):
        def slow(symbol):
            entered.set()
            assert gate.wait(15)
            return main_df(1.0)

        return slow

    def test_reads_proceed_while_fetch_waits(self, tmp_path, monkeypatch):
        gate, entered = threading.Event(), threading.Event()
        monkeypatch.setattr(ak_mod, "_get_main", self._slow_main(gate, entered))
        svc = Service(tmp_path).init()
        try:
            t = threading.Thread(target=lambda: svc.fetch(SC0, do_fetch=True))
            t.start()
            assert entered.wait(10)
            t0 = time.monotonic()
            assert svc.search("sc")["matches"]
            assert svc.list_sources()["sources"]
            svc.provenance(SC0)
            svc.reconcile(SC0)
            assert svc.fetch(SC0, do_fetch=False)["rows"] == []  # 批次未提交 → 不可见
            assert time.monotonic() - t0 < 5
            gate.set()
            t.join(15)
            assert not t.is_alive()
            assert len(svc.fetch(SC0, do_fetch=False)["rows"]) == 1
        finally:
            gate.set()
            svc.close()

    def test_internal_route_responds_during_slow_tool_call(self, tmp_path, monkeypatch):
        from starlette.testclient import TestClient

        from data import mcp_server

        gate, entered = threading.Event(), threading.Event()
        monkeypatch.setattr(ak_mod, "_get_main", self._slow_main(gate, entered))
        svc = Service(tmp_path).init()
        try:
            mcp = mcp_server.build_mcp(svc, "tok")
            with TestClient(mcp.streamable_http_app()) as client:
                fut = client.portal.start_task_soon(
                    mcp.call_tool, "fetch_series", {"series_id": SC0, "range": {}, "fetch": True}
                )
                assert entered.wait(10)
                t0 = time.monotonic()
                r = client.get("/internal/sources", headers={"Authorization": "Bearer tok"})
                assert r.status_code == 200 and time.monotonic() - t0 < 5  # 同一事件循环照常响应
                gate.set()
                out = fut.result(timeout=15)
                body = json.loads(out[0].text)
                assert body["meta"]["count"] == 1
        finally:
            gate.set()
            svc.close()


class TestRobustness:
    """T-42：择优/对账/检索/目录的健壮性。"""

    def test_asof_order_independent_of_local_dst(self):
        code = (
            "from datetime import datetime\n"
            "from data.store.winners import _pick\n"
            "a = (datetime(2026,1,1), 1.0, 'u', 's', None, datetime(2026,3,8,2,30), 1)\n"
            "b = (datetime(2026,1,1), 2.0, 'u', 's', None, datetime(2026,3,8,3,0), 2)\n"
            "print(_pick([a, b], {'s': 100})[1], _pick([b, a], {'s': 100})[1])\n"
        )
        env = dict(os.environ, TZ="EST5EDT,M3.2.0,M11.1.0", PYTHONPATH=str(BACKEND))
        r = subprocess.run([sys.executable, "-c", code], cwd=str(BACKEND), env=env, capture_output=True, text=True)
        assert r.returncode == 0, r.stderr
        assert r.stdout.split() == ["2.0", "2.0"]  # 可见时间更晚者胜（春令时跳变小时内亦然）

    def test_reconcile_undeclared_observation_source(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            rid = svc.store.new_run("ghost-src", SC0, None, None, "cny_bbl", "1d", "Asia/Shanghai")
            svc.store.commit_run(rid, [(SC0, BASE, 1.0, "cny_bbl", "ghost-src", BASE)])
            rep = svc.reconcile(SC0)["report"]
            assert any("ghost-src" in w for w in rep["warnings"])
            from data import mcp_server

            out = call_tool(mcp_server.build_mcp(svc, "tok"), "reconcile", {"series_id": SC0})
            assert "report" in out
        finally:
            svc.close()

    def test_search_like_wildcards_literal(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            assert svc.search("%")["matches"] == []
            hits = {m["series_id"] for m in svc.search("_")["matches"]}
            assert SC_RECEIPT in hits and SC0 not in hits  # 仅别名含字面下划线者（SC_RECEIPT）
            assert SC0 in {m["series_id"] for m in svc.search("SC0")["matches"]}
        finally:
            svc.close()

    def test_reg_order_stable_when_new_source_sorts_first(self, tmp_path):
        write_manifest(
            tmp_path, "zz-src",
            manifest_yaml("zz-src", [provide_yaml("sc", "cn", "close", "", "SC0", "cny_bbl", priority=5)], implementation="akshare"),
        )
        svc = Service(tmp_path).init()
        try:
            assert svc.cat.enabled_sources(SC0)[0] == "zz-src"
            write_manifest(
                tmp_path, "aa-src",
                manifest_yaml("aa-src", [provide_yaml("sc", "cn", "close", "", "SC0", "usd_bbl", priority=5)], implementation="akshare"),
            )
            svc.reg.rebuild()
            assert svc.cat.enabled_sources(SC0)[:2] == ["zz-src", "aa-src"]  # 并列取首次登记者
            unit = svc.cat.con.execute("SELECT unit FROM series WHERE id=?", [SC0]).fetchone()[0]
            assert unit == "cny_bbl"
        finally:
            svc.close()

    def test_rebuild_single_transaction(self, tmp_path, monkeypatch):
        svc = Service(tmp_path).init()
        try:
            q = "SELECT series_id, source_id, current, reg_order FROM series_sources ORDER BY 1, 2"
            before = svc.cat.con.execute(q).fetchall()
            other = sqlite3.connect(str(tmp_path / "data" / "catalog.sqlite"))
            seen = []

            def boom(*a, **k):
                seen.append(other.execute(
                    "SELECT COUNT(*) FROM series_sources WHERE current=0"
                ).fetchone()[0])
                raise RuntimeError("重建中途失败")

            monkeypatch.setattr(svc.cat, "write_alias", boom)
            with pytest.raises(RuntimeError):
                svc.reg.rebuild()
            other.close()
            assert seen == [0]  # 并发只读连接看不到 current=0 中间态
            monkeypatch.undo()
            assert svc.cat.con.execute(q).fetchall() == before  # 整体回滚
        finally:
            svc.close()

    def test_internal_route_errors_structured(self, tmp_path):
        from starlette.testclient import TestClient

        from data import mcp_server

        svc = Service(tmp_path).init()
        try:
            client = TestClient(mcp_server.build_mcp(svc, "tok").streamable_http_app())
            hdr = {"Authorization": "Bearer tok"}
            r = client.get("/internal/diff?a=1&b=2", headers=hdr)
            assert r.status_code == 400
            err = r.json()["error"]
            assert err["code"] == "validation_error" and "不可比" in err["message"]
            r = client.get("/internal/diff?a=x&b=2", headers=hdr)
            assert r.status_code == 400 and r.json()["error"]["code"] == "validation_error"
            r = client.get("/internal/sources", headers={"Authorization": "Bearer tok-x"})
            assert r.status_code == 403
        finally:
            svc.close()


class TestLockRobustness:
    """T-43：陈旧锁只认“进程不存在”；DuckDB 文件被占用 → LockBusy。"""

    def test_access_denied_pid_not_stale(self, tmp_path):
        from data import lock

        data = tmp_path / "data"
        data.mkdir()
        (data / ".lock").write_text("4", encoding="utf-8")  # System 进程：存在但通常无权查询
        assert lock._stale(data / ".lock") is False
        assert lock.lock_held(data) is True
        with pytest.raises(LockBusy):
            lock.write_lock(data)
        assert (data / ".lock").exists()

    def test_dead_pid_recovered(self, tmp_path):
        from data import lock

        data = tmp_path / "data"
        data.mkdir()
        p = subprocess.Popen([sys.executable, "-c", "pass"])
        p.wait()
        (data / ".lock").write_text(str(p.pid), encoding="utf-8")
        assert lock.lock_held(data) is False and not (data / ".lock").exists()
        lock.release_lock(lock.write_lock(data))

    def test_duckdb_open_conflict_maps_to_lockbusy(self, tmp_path):
        Service(tmp_path).init().close()
        db = tmp_path / "data" / "observations.duckdb"
        holder = subprocess.Popen(
            [sys.executable, "-c",
             "import duckdb, sys, time; c = duckdb.connect(sys.argv[1]); print('held', flush=True); time.sleep(60)",
             str(db)],
            stdout=subprocess.PIPE, text=True,
        )
        try:
            assert holder.stdout.readline().strip() == "held"
            with pytest.raises(LockBusy):
                Service(tmp_path)
            assert not (tmp_path / "data" / ".lock").exists()  # 开库失败释放写锁
            with pytest.raises(LockBusy):
                Service(tmp_path, readonly=True)
        finally:
            holder.kill()
            holder.wait()


class TestTimeSemantics:
    """T-44：带时区 range 换算到序列主源声明时区（观测 ts = 源声明时区时间标签）。"""

    def test_aware_range_uses_series_tz(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            rid = svc.store.new_run("akshare", SC0, None, None, "cny_bbl", "1d", "Asia/Shanghai")
            svc.store.commit_run(
                rid, [(SC0, datetime(2026, 10, d), float(d), "cny_bbl", "akshare", BASE) for d in (1, 2, 5)]
            )
            days = lambda res: [r[0].day for r in res["rows"]]  # noqa: E731
            res = svc.fetch(SC0, "2026-10-02T00:00:00+08:00", "2026-10-05T00:00:00+08:00", do_fetch=False)
            assert days(res) == [2, 5]  # 闭区间含 10-05 日线
            res = svc.fetch(SC0, "2026-10-01T16:00:00+00:00", "2026-10-04T16:00:00Z", do_fetch=False)
            assert days(res) == [2, 5]  # 同一时刻的 UTC 写法
            res = svc.fetch(SC0, "2026-10-02", "2026-10-05", do_fetch=False)
            assert days(res) == [2, 5]  # 不带时区 = 本地时间标签
        finally:
            svc.close()


class TestCliMisc:
    """T-45：CLI 小项。"""

    def test_credentials_prompt_and_no_write_lock_needed(self, tmp_path, monkeypatch):
        monkeypatch.setattr("getpass.getpass", lambda prompt="": "k-" + "prompted-0001")
        holder = Service(tmp_path).init()  # 写锁被占（如 serve 运行中）也可配置凭证
        try:
            assert cli_run(tmp_path, "config", "credentials", "eia_api_key") == 0
        finally:
            holder.close()
        assert creds.get(tmp_path / "creds", "eia_api_key") == "k-" + "prompted-0001"

    def test_credentials_name_traversal_rejected(self, tmp_path, capsys):
        assert cli_run(tmp_path, "config", "credentials", "../evil", "k-" + "x-0000001") == 1
        assert "凭证名非法" in capsys.readouterr().err
        assert not (tmp_path / "evil.bin").exists()

    def test_add_source_validation_and_skeleton(self, tmp_path, capsys):
        Service(tmp_path).init().close()
        assert cli_run(tmp_path, "config", "add-source", "../evil") == 1
        assert not (tmp_path / "evil").exists()
        assert cli_run(tmp_path, "config", "add-source", "akshare") == 1  # 已有源 id
        assert cli_run(tmp_path, "config", "add-source", "my-ak", "--implementation", "akshare") == 0
        mf = tmp_path / "adapters" / "my-ak" / "manifest.yaml"
        text = mf.read_text(encoding="utf-8")
        assert "implementation: akshare" in text and "credentials: none" in text
        svc = Service(tmp_path).init()
        try:  # provides 待填 → error，原因可见
            err = [s for s in svc.list_sources()["sources"] if s["status"] == "error"]
            assert len(err) == 1 and "provides" in err[0]["reason"]
        finally:
            svc.close()
        mf.write_text(
            text.replace("provides: []", "provides:\n" + provide_yaml("sc", "cn", "close", "SC2401", "SC2401", "cny_bbl")),
            encoding="utf-8",
        )
        svc = Service(tmp_path).init()
        try:
            src = {s["adapter_id"]: s for s in svc.list_sources()["sources"]}
            assert src["my-ak"]["status"] == "ok" and "my-ak" in svc.adapters
            assert not any(s["status"] == "error" for s in src.values())
        finally:
            svc.close()

    def test_job_last_run_utc_recorded_after_trigger(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()

        def boom(symbol):
            raise RuntimeError("网络故障")

        monkeypatch.setattr(ak_mod, "_get_main", boom)
        assert cli_run(tmp_path, "jobs", "register", "j1", "akshare", SC0) == 0
        before = utcnow().replace(microsecond=0)
        assert cli_run(tmp_path, "jobs", "run", "j1") == 1  # 失败也记录触发
        assert json.loads(capsys.readouterr().out.split("registered", 1)[-1])["error"]["retryable"] is True
        cat = CatalogDB(tmp_path / "data" / "catalog.sqlite")
        try:
            raw = cat.con.execute("SELECT last_run FROM jobs WHERE name='j1'").fetchone()[0]
        finally:
            cat.close()
        last = datetime.fromisoformat(raw)
        assert before <= last and abs((utcnow() - last).total_seconds()) < 120  # UTC，非本地时间

    def test_mcp_pinned_below_2(self):
        import tomllib

        deps = tomllib.loads((BACKEND / "pyproject.toml").read_text(encoding="utf-8"))["project"]["dependencies"]
        mcp_dep = next(d for d in deps if d.replace(" ", "").startswith("mcp"))
        assert "<2" in mcp_dep.replace(" ", "")
