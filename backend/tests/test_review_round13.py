"""第十三轮双审（A=claude-fable-5-1，B=gpt-6.1-sol）发现与测试缺口的回归测试（tasks.md T-47~T-53）。"""
from __future__ import annotations

import json
import threading
import time
from datetime import date, datetime, timedelta
from pathlib import Path

import pandas as pd
import pytest

from data import cli, creds, mcp_server
from data.adapters.akshare import akshare_adapter as ak_mod
from data.adapters.eia import eia_adapter as eia_mod
from data.adapters.eia.eia_adapter import EiaAdapter
from data.catalog.db import CatalogDB
from data.catalog.descriptor import derive_id
from data.fetch.on_demand import FetchError
from data.lock import LockBusy
from data.manifest import load
from data.service import Service
from data.store.duck import DuckStore
from data.store.provenance import DiffError, diff
from data.store.winners import asof_view, latest_obs

from test_review_round12 import (
    BACKEND,
    EIA_DIESEL,
    FU_STOCK,
    SC0,
    call_tool,
    cli_run,
    freeze_today,
    main_df,
    manifest_yaml,
    provide_yaml,
    write_manifest,
)

BASE = datetime(2026, 10, 1)
CRUDE = derive_id({"asset": "crude", "geo": "world", "measure": "close", "contract": ""})
EIA_PROVIDE = provide_yaml("diesel", "na", "stock", "", "WDISTUS1", "kb", freq="1w", tz="America/New_York", priority=1)


class TestEiaCredentialRef:
    """T-47 / R13 共同 P2：eia 无凭证引用 → 配置期可见报错；运行期守卫返回 unauthorized。"""

    def test_manifest_rejects_eia_without_api_key(self, tmp_path):
        write_manifest(tmp_path, "my-eia", manifest_yaml("my-eia", [EIA_PROVIDE], implementation="eia"))
        svc = Service(tmp_path).init()
        try:
            err = [s for s in svc.list_sources()["sources"] if s["status"] == "error"]
            assert len(err) == 1 and "implementation" in err[0]["reason"] and "api_key" in err[0]["reason"]
            assert "my-eia" not in svc.adapters
        finally:
            svc.close()

    def test_adapter_guard_without_credential_ref(self, tmp_path):
        m = load(str(BACKEND / "data" / "adapters" / "eia" / "manifest.yaml"))
        with pytest.raises(FetchError) as ei:
            EiaAdapter(tmp_path / "creds", credential_ref=None).fetch(m.provides[0], None, None)
        assert (ei.value.code, ei.value.retryable) == ("unauthorized", False)
        assert "local variable" not in ei.value.message

    def test_corrupt_credential_unauthorized_service_and_mcp(self, tmp_path, monkeypatch):
        (tmp_path / "creds").mkdir(parents=True, exist_ok=True)
        (tmp_path / "creds" / "eia_api_key.bin").write_bytes(b"not-base64!!!")
        called = []
        monkeypatch.setattr(eia_mod, "_request", lambda *a, **k: called.append(1))
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(EIA_DIESEL, do_fetch=True, source="eia")
            assert (ei.value.code, ei.value.retryable) == ("unauthorized", False)
            out = call_tool(
                mcp_server.build_mcp(svc, "tok"),
                "fetch_series",
                {"series_id": EIA_DIESEL, "range": {}, "fetch": True, "source": "eia"},
            )
            assert (out["error"]["code"], out["error"]["retryable"]) == ("unauthorized", False)
            assert not called
        finally:
            svc.close()

    @pytest.mark.parametrize(
        "status,code,retryable",
        [(401, "unauthorized", False), (403, "unauthorized", False), (429, "rate_limited", True),
         (500, "adapter_error", True), (503, "adapter_error", True), (404, "validation_error", False),
         (400, "validation_error", False)],
    )
    def test_http_status_mapping_at_request_boundary(self, tmp_path, monkeypatch, status, code, retryable):
        class Resp:
            status_code = status
            text = "{}"

            def json(self):
                return {}

        monkeypatch.setattr(eia_mod.requests, "get", lambda url, params=None, timeout=None: Resp())
        creds.put(tmp_path / "creds", "eia_api_key", "k-" + "http-map-0001")
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(EIA_DIESEL, do_fetch=True, source="eia")
            assert (ei.value.code, ei.value.retryable) == (code, retryable)
            assert "http-map" not in ei.value.message
        finally:
            svc.close()


class TestUnknownSeries:
    """T-48 / B-02：目录中不存在的序列 → not_found（两分支一致）；已登记无观测 = 成功空结果。"""

    def test_unknown_series_not_found(self, tmp_path, capsys):
        unknown = derive_id({"asset": "brent", "geo": "world", "measure": "stock", "contract": ""})
        svc = Service(tmp_path).init()
        try:
            assert not svc.cat.series_exists(unknown)
            for kwargs in ({"do_fetch": False}, {"do_fetch": True}, {"do_fetch": True, "source": "akshare"}):
                with pytest.raises(FetchError) as ei:
                    svc.fetch(unknown, **kwargs)
                assert (ei.value.code, ei.value.retryable) == ("not_found", False)
            out = call_tool(mcp_server.build_mcp(svc, "tok"), "fetch_series", {"series_id": unknown, "range": {}})
            assert out["error"]["code"] == "not_found"
            res = svc.fetch(SC0, do_fetch=False)
            assert res["rows"] == [] and res["meta"]["count"] == 0
        finally:
            svc.close()
        assert cli_run(tmp_path, "fetch", unknown) == 1
        assert json.loads(capsys.readouterr().out)["error"]["code"] == "not_found"


class TestFetchQueueIsolation:
    """T-49 / B-03：排队的取数不占工作线程，只读请求不被写请求耗尽线程容量。"""

    def test_queued_fetches_do_not_starve_reads(self, tmp_path, monkeypatch):
        from starlette.testclient import TestClient

        gate, entered = threading.Event(), threading.Event()

        def slow(symbol):
            if not entered.is_set():  # 仅首个取数停在“网络等待”，其余放行后即刻完成
                entered.set()
                assert gate.wait(60)
            return main_df(1.0)

        monkeypatch.setattr(ak_mod, "_get_main", slow)
        svc = Service(tmp_path).init()
        try:
            mcp = mcp_server.build_mcp(svc, "tok")
            with TestClient(mcp.streamable_http_app()) as client:
                futs = [
                    client.portal.start_task_soon(
                        mcp.call_tool, "fetch_series", {"series_id": SC0, "range": {}, "fetch": True}
                    )
                    for _ in range(45)  # > anyio 默认线程容量 40
                ]
                assert entered.wait(10)
                time.sleep(0.5)  # 其余调用进入排队
                box = {}
                reader = threading.Thread(
                    target=lambda: box.update(r=client.get("/internal/sources", headers={"Authorization": "Bearer tok"})),
                    daemon=True,
                )
                reader.start()
                reader.join(5)
                starved = reader.is_alive()
                gate.set()  # 先放行，避免失败时级联等待
                reader.join(60)
                assert not starved, "只读请求被排队的取数耗尽线程容量"
                assert box["r"].status_code == 200
                outs = [json.loads(f.result(timeout=120)[0].text) for f in futs]
                assert all("error" not in o for o in outs)
            n = svc.store.con.execute(
                "SELECT COUNT(*) FROM ingest_runs WHERE status='succeeded'"
            ).fetchone()[0]
            assert n == 45
        finally:
            gate.set()
            svc.close()

    def test_hung_upstream_times_out_and_releases_write_path(self, tmp_path, monkeypatch):
        release = threading.Event()
        monkeypatch.setattr(ak_mod, "AKSHARE_TIMEOUT_S", 0.5)
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: release.wait(30) and main_df())
        svc = Service(tmp_path).init()
        try:
            t0 = time.monotonic()
            with pytest.raises(FetchError) as ei:
                svc.fetch(SC0, do_fetch=True)
            assert (ei.value.code, ei.value.retryable) == ("adapter_error", True)
            assert "超时" in ei.value.message and time.monotonic() - t0 < 10
            assert svc.store.con.execute("SELECT status FROM ingest_runs").fetchone()[0] == "failed"
            monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df())
            assert svc.fetch(SC0, do_fetch=True)["meta"]["count"] == 1  # 写路径未被挂起调用占住
        finally:
            release.set()
            svc.close()


class TestAkshareSdkBoundary:
    """T-50：真实 SDK 符号映射与列解析（仅在 HTTP 边界注入固定响应）。"""

    @pytest.mark.parametrize("variety", ["FU", "BU", "LU"])
    def test_inventory_through_real_sdk(self, tmp_path, monkeypatch, variety):
        import akshare.futures.futures_inventory_em as em

        code = em.futures_inventory_em_symbol_dict[variety.lower()]

        class Resp:
            def __init__(self, payload):
                self._payload = payload

            def json(self):
                return self._payload

        def fake_get(url, params=None, **kw):
            if params["reportName"] == "RPT_FUTU_POSITIONCODE":
                return Resp({"result": {"data": [{"TRADE_MARKET_CODE": "x", "TRADE_CODE": "ZZ", "TRADE_TYPE": "其他"}]}})
            assert params["reportName"] == "RPT_FUTU_STOCKDATA"
            assert f'SECURITY_CODE="{code}"' in params["filter"]
            return Resp({"result": {"data": [
                {"SECURITY_CODE": code, "TRADE_DATE": "2026-10-09 00:00:00", "ON_WARRANT_NUM": 15000, "ADDCHANGE": 3000},
                {"SECURITY_CODE": code, "TRADE_DATE": "2026-10-08 00:00:00", "ON_WARRANT_NUM": 12000, "ADDCHANGE": 0},
            ]}})

        monkeypatch.setattr(em.requests, "get", fake_get)
        freeze_today(monkeypatch)
        sid = derive_id({"asset": variety.lower(), "geo": "cn", "measure": "stock", "contract": ""})
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(sid, do_fetch=True)
            assert [(r[0], r[1], r[2]) for r in res["rows"]] == [
                (datetime(2026, 10, 8), 12.0, "kton"),
                (datetime(2026, 10, 9), 15.0, "kton"),
            ]
        finally:
            svc.close()

    def test_receipt_default_window_is_recent(self, monkeypatch):
        import shfe_html

        freeze_today(monkeypatch)  # 与运行日期解耦：受测 SDK 交易日历止于 2026-12-31
        calls = shfe_html.patch(monkeypatch, 1000)  # 上期所仓单逐交易日抓页面
        ak_mod._get_receipt("SC")
        today = ak_mod.date.today()
        assert today == date(2026, 10, 27)
        assert calls[-1] == today.strftime("%Y%m%d")  # 终点 = 当日
        earliest = (today - timedelta(days=ak_mod.RECEIPT_DEFAULT_DAYS)).strftime("%Y%m%d")
        assert min(calls) >= earliest  # 未给起点 → 只回看 RECEIPT_DEFAULT_DAYS 天
        assert len(calls) < 30  # 非交易日不抓
        calls.clear()
        ak_mod._get_receipt("SC", datetime(2026, 9, 1), datetime(2026, 9, 30))
        assert calls and min(calls) >= "20260901" and max(calls) <= "20260930"  # 显式窗口原样


class TestSearchAndSkeleton:
    """T-51：检索只匹配描述符字段值与别名；add-source 骨架对任意合法 id 可用。"""

    def test_search_matches_values_not_json_keys(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            for q in ("as", "geo", "measure", "contract", "{", ":"):
                assert svc.search(q)["matches"] == [], q
            hits = {m["series_id"] for m in svc.search("stock")["matches"]}
            assert {FU_STOCK, EIA_DIESEL} <= hits
        finally:
            svc.close()

    @pytest.mark.parametrize("source_id", ["123", "null", "true", "x" * 64])
    def test_add_source_skeleton_any_valid_id(self, tmp_path, source_id):
        Service(tmp_path).init().close()
        impl = "eia" if source_id.startswith("x") else "akshare"
        assert cli_run(tmp_path, "config", "add-source", source_id, "--implementation", impl) == 0
        mf = tmp_path / "adapters" / source_id / "manifest.yaml"
        provide = EIA_PROVIDE if impl == "eia" else provide_yaml("sc", "cn", "close", "SC2401", "SC2401", "cny_bbl")
        mf.write_text(mf.read_text(encoding="utf-8").replace("provides: []", "provides:\n" + provide), encoding="utf-8")
        m = load(str(mf))
        assert (m.id, m.name, m.implementation) == (source_id, source_id, impl)
        if impl == "eia":
            ref = m.credentials.credential_ref
            assert len(ref) <= 64
            creds.put(tmp_path / "creds", ref, "k-" + "long-id-0001")  # 生成的引用名可实际保存/读取
            assert creds.get(tmp_path / "creds", ref) == "k-" + "long-id-0001"
        svc = Service(tmp_path).init()
        try:
            assert {s["adapter_id"]: s for s in svc.list_sources()["sources"]}[source_id]["status"] == "ok"
        finally:
            svc.close()


class TestCorruptDbAndLockEdges:
    """T-52：库文件损坏 → 结构化错误（只读/写两路）；陈旧锁删除失败 → 视为占用。"""

    def test_corrupt_catalog_structured_error(self, tmp_path, capsys):
        Service(tmp_path).init().close()
        (tmp_path / "data" / "catalog.sqlite").write_bytes(b"this is not a sqlite database" * 100)
        assert cli_run(tmp_path, "list", "sources") == 1
        err = json.loads(capsys.readouterr().out)["error"]
        assert err["code"] == "internal" and "数据库不可读" in err["message"]
        assert cli_run(tmp_path, "config", "disable", "eia") == 1
        assert "数据库不可读" in json.loads(capsys.readouterr().out)["error"]["message"]
        assert not (tmp_path / "data" / ".lock").exists()  # 开库失败释放写锁

    def test_stale_lock_unlink_failure_treated_as_held(self, tmp_path, monkeypatch):
        import subprocess
        import sys

        from data import lock

        data = tmp_path / "data"
        data.mkdir()
        p = subprocess.Popen([sys.executable, "-c", "pass"])
        p.wait()
        (data / ".lock").write_text(str(p.pid), encoding="utf-8")  # 陈旧（进程已退出）
        orig = Path.unlink

        def deny(self, missing_ok=False):
            if self.name == ".lock":
                raise PermissionError("锁文件仍被打开")
            return orig(self, missing_ok=missing_ok)

        monkeypatch.setattr(Path, "unlink", deny)
        assert lock.lock_held(data) is True
        with pytest.raises(LockBusy):
            lock.write_lock(data)


class TestAcceptanceGaps:
    """T-53：按 AC 补齐的断言（第十三轮双审列出的测试缺口）。"""

    def test_ac004_3_commit_failure_after_partial_insert(self, tmp_path, monkeypatch):
        from data.store import duck as duck_mod

        monkeypatch.setattr(
            ak_mod, "_get_main",
            lambda symbol: pd.DataFrame({"日期": ["2026-10-01", "2026-10-02"], "收盘价": [1.0, 2.0]}),
        )
        svc = Service(tmp_path).init()
        try:
            svc.fetch(SC0, do_fetch=True)  # 成功批次（2 行）
            real, calls = duck_mod.utcnow, []

            def flaky():
                calls.append(1)
                if len(calls) == 2:  # 1 = new_run；2 = commit_run 事务内（观测已插入、run 未标成功）
                    raise RuntimeError("提交中途故障")
                return real()

            monkeypatch.setattr(duck_mod, "utcnow", flaky)
            monkeypatch.setattr(
                ak_mod, "_get_main",
                lambda symbol: pd.DataFrame({"日期": ["2026-10-01", "2026-10-03"], "收盘价": [9.0, 3.0]}),
            )
            with pytest.raises(FetchError):
                svc.fetch(SC0, do_fetch=True)
            statuses = [r[0] for r in svc.store.con.execute(
                "SELECT status FROM ingest_runs ORDER BY ingest_run"
            ).fetchall()]
            assert statuses == ["succeeded", "failed"]
            assert svc.store.count_obs(SC0) == 2  # 部分插入整体回滚
            assert [r[1] for r in svc.fetch(SC0, do_fetch=False)["rows"]] == [1.0, 2.0]  # 既有成功批次不受影响
        finally:
            svc.close()

    def test_ac003_3_4_asof_between_revisions_with_override(self, tmp_path):
        store, cat = DuckStore(tmp_path / "o.duckdb"), CatalogDB(tmp_path / "c.sqlite")
        cat.set_series_source("s1", "a", 10, 1)
        cat.set_series_source("s1", "b", 100, 2)

        def commit(source, value):
            rid = store.new_run(source, "s1", BASE, BASE, "u", "1d", "Asia/Shanghai")
            store.commit_run(rid, [("s1", BASE, value, "u", source, BASE)])
            time.sleep(0.01)
            return store.run(rid)[10]  # finished_at = 可见时间

        t1, t2, t3 = commit("a", 1.0), commit("a", 2.0), commit("b", 3.0)
        pr = cat.effective_priorities("s1")
        values = lambda t, p: [r[1] for r in asof_view(store, "s1", t, p)]  # noqa: E731
        assert values(t1, pr) == [1.0]  # 修订前时点 → 旧版本
        assert values(t2, pr) == [2.0]
        assert values(t3, pr) == [2.0]  # a（优先级 10）胜 b
        cat.set_override("s1", "b", 5)  # 手动覆盖替换 b 的优先级，参与同一决胜链（历史择优用当前配置）
        pr = cat.effective_priorities("s1")
        assert values(t2, pr) == [2.0]  # t2 时 b 尚不可见
        assert values(t3, pr) == [3.0]
        assert asof_view(store, "s1", datetime(2100, 1, 1), pr) == latest_obs(store, "s1", pr)

    @pytest.mark.parametrize(
        "change,needle",
        [({"adapter": "b"}, "源不同"), ({"freq": "1w"}, "口径快照"), ({"tz": "UTC"}, "口径快照"),
         ({"unit": "kb"}, "口径快照"), ({"end": BASE + timedelta(days=1)}, "覆盖范围不同")],
    )
    def test_ac005_2_single_change_incomparable_reason(self, tmp_path, change, needle):
        store = DuckStore(tmp_path / "o.duckdb")
        base = {"adapter": "a", "start": BASE, "end": BASE, "unit": "u", "freq": "1d", "tz": "Asia/Shanghai"}

        def run(**kw):
            p = {**base, **kw}
            rid = store.new_run(p["adapter"], "s1", p["start"], p["end"], p["unit"], p["freq"], p["tz"])
            store.commit_run(rid, [("s1", BASE, 1.0, p["unit"], p["adapter"], BASE)])
            return rid

        ra = run()
        with pytest.raises(DiffError) as ei:
            diff(store, ra, run(**change))
        assert needle in ei.value.reason
        assert diff(store, ra, run())["counts"] == {"added": 0, "revised": 0, "deleted": 0}

    def test_ac006_4_cache_retained_or_null_without_history(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            q = "SELECT unit, freq, tz FROM series WHERE id=?"
            before = svc.cat.con.execute(q, [SC0]).fetchone()
            svc.set_source_enabled("akshare", False)
            assert svc.cat.con.execute(q, [SC0]).fetchone() == before == ("cny_bbl", "1d", "Asia/Shanghai")
            assert any("沿用末次缓存" in w for w in svc.reconcile(SC0)["report"]["warnings"])
        finally:
            svc.close()
        one = provide_yaml("lpg", "cn", "close", "", "LPG", "cny_ton")
        write_manifest(tmp_path, "late", manifest_yaml("late", [one], implementation="akshare"))
        svc = Service(tmp_path).init()
        svc.set_source_enabled("late", False)
        svc.close()
        two = provide_yaml("lpg", "cn", "volume", "", "LPGV", "kton")
        write_manifest(tmp_path, "late", manifest_yaml("late", [one, two], implementation="akshare"))
        svc = Service(tmp_path).init()
        try:
            new_sid = derive_id({"asset": "lpg", "geo": "cn", "measure": "volume", "contract": ""})
            assert svc.cat.con.execute(
                "SELECT unit, freq, tz FROM series WHERE id=?", [new_sid]
            ).fetchone() == (None, None, None)
            assert any("置空" in w for w in svc.reconcile(new_sid)["report"]["warnings"])
        finally:
            svc.close()

    def test_ac007_3_excel_import_and_mapping_reuse(self, tmp_path, monkeypatch):
        Service(tmp_path).init().close()
        f1 = tmp_path / "a.xlsx"
        pd.DataFrame({"D": ["2026-10-01", "2026-10-02"], "V": [70.5, 71.0]}).to_excel(f1, index=False)
        answers = iter(["y", "date_col=D,value_col=V"])  # 确认唯一目标 → 手工映射（列名无法猜测）
        monkeypatch.setattr("builtins.input", lambda prompt="": next(answers))
        assert cli_run(tmp_path, "import", str(f1)) == 0
        f2 = tmp_path / "b.xlsx"
        pd.DataFrame({"D": ["2026-10-03"], "V": [72.0]}).to_excel(f2, index=False)
        answers = iter(["y", "y", ""])  # 确认目标 → 复用模板 → 默认模板 id（不再询问映射）
        monkeypatch.setattr("builtins.input", lambda prompt="": next(answers))
        assert cli_run(tmp_path, "import", str(f2)) == 0
        svc = Service(tmp_path).init()
        try:
            assert [r[1] for r in svc.fetch(CRUDE, do_fetch=False)["rows"]] == [70.5, 71.0, 72.0]
        finally:
            svc.close()

    def test_ac008_2_default_readonly_no_adapter_call_no_writes(self, tmp_path, monkeypatch):
        calls = []
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: calls.append(symbol) or main_df())
        svc = Service(tmp_path).init()
        try:
            svc.fetch(SC0, do_fetch=True)
            n_obs = svc.store.count_obs(SC0)
            n_runs = svc.store.con.execute("SELECT COUNT(*) FROM ingest_runs").fetchone()[0]
            out = call_tool(mcp_server.build_mcp(svc, "tok"), "fetch_series", {"series_id": SC0, "range": {}})
            assert out["meta"]["count"] == 1 and calls == ["SC0"]  # 省略 fetch → 适配器未再调用
            assert svc.store.count_obs(SC0) == n_obs
            assert svc.store.con.execute("SELECT COUNT(*) FROM ingest_runs").fetchone()[0] == n_runs
        finally:
            svc.close()

    def test_ac008_1_list_sources_reason_via_mcp(self, tmp_path):
        write_manifest(tmp_path, "bad-one", manifest_yaml("bad-one", [provide_yaml("sc", "cn", "close", "", "X", "usd_barrel")]))
        svc = Service(tmp_path).init()
        try:
            out = call_tool(mcp_server.build_mcp(svc, "tok"), "list_sources", {})
            assert all(set(s) == {"adapter_id", "name", "enabled", "status", "reason"} for s in out["sources"])
            assert any(s["status"] == "error" and "unit" in s["reason"] for s in out["sources"])
        finally:
            svc.close()
