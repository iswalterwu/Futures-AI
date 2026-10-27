"""独立评审 F-01~F-15 的回归测试。"""
from __future__ import annotations

import concurrent.futures
from datetime import datetime, timedelta

import pytest

from data import creds
from data.catalog.db import CatalogDB
from data.catalog.descriptor import derive_id
from data.fetch.on_demand import FetchError, fetch_series
from data.service import Service
from data.store.duck import DuckStore, SUCCEEDED

BASE = datetime(2026, 10, 1)
SID = derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": ""})

ALT_MANIFEST_1D = """id: alt-src
name: Alt
version: 1
credentials: none
provides:
  - descriptor: {asset: sc, geo: cn, measure: close, contract: ""}
    symbols: [S]
    unit: cny_bbl
    freq: 1d
    tz: Asia/Shanghai
    priority: 10
    fetch: {modes: [on_demand], history_days: 1}
    update: {lag_min: 0, revises: true}
"""

VALID_SMALL_MANIFEST = """id: broken-source
name: x
version: 1
credentials: none
provides:
  - descriptor: {asset: bu, geo: cn, measure: close, contract: ""}
    symbols: [B]
    unit: cny_ton
    freq: 1d
    tz: Asia/Shanghai
    fetch: {modes: [on_demand], history_days: 1}
    update: {lag_min: 0, revises: true}
"""

ALT_MANIFEST_1W = ALT_MANIFEST_1D.replace("freq: 1d", "freq: 1w").replace("priority: 10", "priority: 200")


class TestBatchLifecycle:
    """F-13：重放不改成功事实；空批次可提交；终态保护。"""

    def test_replay_does_not_change_finished_at(self, tmp_path):
        store = DuckStore(tmp_path / "d.duckdb")
        rid = store.new_run("a", "s", BASE, BASE, "u", "1d", "tz")
        store.commit_run(rid, [("s", BASE, 1.0, "u", "a", BASE)])
        f1 = store.run(rid)[10]  # finished_at（索引 10）
        store.commit_run(rid, [("s", BASE, 1.0, "u", "a", BASE)])
        assert store.run(rid)[10] == f1  # finished_at 不变

    def test_empty_batch_succeeds(self, tmp_path):
        store = DuckStore(tmp_path / "d.duckdb")
        rid = store.new_run("a", "s", BASE, BASE, "u", "1d", "tz")
        store.commit_run(rid, [])
        assert store.run(rid)[8] == SUCCEEDED

    def test_terminal_state_protected(self, tmp_path):
        store = DuckStore(tmp_path / "d.duckdb")
        rid = store.new_run("a", "s", BASE, BASE, "u", "1d", "tz")
        store.commit_run(rid, [])
        store.fail_run(rid)  # 成功不可回退
        assert store.run(rid)[8] == SUCCEEDED
        store.commit_run(rid, [("s", BASE, 1.0, "u", "a", BASE)])  # 已成功重放 = no-op
        assert store.run(rid)[8] == SUCCEEDED
        assert store.count_obs("s") == 0  # 不新增行


class TestPayloadHashAndTime:
    """F-12：真实链路哈希非空、时间 UTC 一致。"""

    def test_fetch_produces_payload_hash(self, tmp_path, monkeypatch):
        svc = Service(tmp_path).init()
        try:
            from data.adapters.akshare import akshare_adapter as ak_mod
            import pandas as pd

            df = pd.DataFrame({"日期": ["2026-10-01"], "收盘价": [1.0]})
            monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: df)
            svc.fetch(SID, do_fetch=True)
            rows = svc.store.con.execute(
                "SELECT fetched_at, \"asof\", payload_hash FROM observations"
            ).fetchall()
            assert rows[0][2]  # hash 非空
            # F-12：同一 UTC 基准（naive UTC，相差 < 1s）
            assert abs((rows[0][0] - rows[0][1]).total_seconds()) < 1
            assert rows[0][0].tzinfo is None and rows[0][1].tzinfo is None
        finally:
            svc.close()


class TestRegistryStateMachine:
    """F-10/F-11：enabled 保留、坏件原地 error、provides 撤销、覆盖后主源与显示 ID。"""

    def test_enabled_preserved_across_reload(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            svc.cat.con.execute("UPDATE sources SET enabled=0 WHERE id='akshare'")
            svc.cat.con.commit()
            svc.reg.rebuild()
            (enabled,) = svc.cat.con.execute(
                "SELECT enabled FROM sources WHERE id='akshare'"
            ).fetchone()
            assert enabled == 0  # F-10：不重置用户启停
        finally:
            svc.close()

    def test_broken_existing_manifest_marks_in_place_error(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            mf = svc.dirs["adapters"] / "broken" / "manifest.yaml"
            mf.parent.mkdir(exist_ok=True)
            mf.write_text(VALID_SMALL_MANIFEST, encoding="utf-8")
            svc.reg.rebuild()
            mf.write_text("id: [broken", encoding="utf-8")
            svc.reg.rebuild()
            row = svc.cat.con.execute(
                "SELECT status FROM sources WHERE id='broken-source'"
            ).fetchone()
            assert row and row[0] == "error"  # 原地 error 而非 disabled
        finally:
            svc.close()

    def test_provides_removal_current_flag(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            mf = svc.dirs["adapters"] / "alt-src" / "manifest.yaml"
            mf.parent.mkdir(exist_ok=True)
            mf.write_text(ALT_MANIFEST_1D, encoding="utf-8")
            svc.reg.rebuild()
            assert "alt-src" in svc.cat.enabled_sources(SID)
            mf.unlink()
            svc.reg.rebuild()
            assert "alt-src" not in svc.cat.enabled_sources(SID)
        finally:
            svc.close()

    def test_override_affects_primary_and_display(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            mf = svc.dirs["adapters"] / "alt-src" / "manifest.yaml"
            mf.parent.mkdir(exist_ok=True)
            mf.write_text(ALT_MANIFEST_1W, encoding="utf-8")
            svc.reg.rebuild()
            svc.cat.set_override(SID, "alt-src", 5)
            svc.reg.rebuild()
            row = svc.cat.con.execute(
                "SELECT freq, display_id_8slot FROM series WHERE id=?", [SID]
            ).fetchone()
            assert row[0] == "1w"
            assert row[1].endswith(".1w")
        finally:
            svc.close()


class TestCredentialRedaction:
    """F-07：上游错误不泄露 key；空凭证拒绝。"""

    def test_eia_error_redacted(self, tmp_path, monkeypatch):
        svc = Service(tmp_path).init()
        try:
            from data.adapters.eia import eia_adapter as eia_mod

            def boom(series_id, api_key, start, end):
                raise FetchError("unauthorized", "EIA 认证失败（请检查 API key）")

            monkeypatch.setattr(eia_mod, "_request", boom)
            creds.put(tmp_path / "creds", "eia_api_key", "sk-REVIEW-SECRET-" + "1234")
            eia_sid = derive_id({"asset": "diesel", "geo": "na", "measure": "stock", "contract": ""})
            with pytest.raises(FetchError) as ei:
                svc.fetch(eia_sid, do_fetch=True, source="eia")
            assert "REVIEW-SECRET" not in ei.value.message
            assert ei.value.code == "unauthorized"
            assert ei.value.retryable is False
        finally:
            svc.close()

    def test_network_exception_key_redacted(self, tmp_path, monkeypatch):
        """F-07：真实 requests 边界异常（URL 含 key）不得进入错误消息。"""
        import requests

        def boom(url, params=None, timeout=None):
            raise requests.exceptions.ConnectionError(
                f"Connection aborted to {url}?api_key=" + ("sk-LEAK-" + "12345678")
            )

        import data.adapters.eia.eia_adapter as mod

        monkeypatch.setattr(mod.requests, "get", boom)
        from data.fetch.on_demand import FetchError

        with pytest.raises(FetchError) as ei:
            # 直接调 _request 真实实现（内部会 catch RequestException）
            mod._request("WDISTUS1", "sk-LEAK-" + "12345678", None, None)
        assert "LEAK" not in ei.value.message

    def test_empty_secret_rejected(self, tmp_path):
        with pytest.raises(creds.CredsError):
            creds.put(tmp_path / "creds", "x", "")


class TestConcurrency:
    """F-02：内部端点并发请求结果不串线（Service 级串行）。"""

    def test_concurrent_provenance_no_crosstalk(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            from data import mcp_server
            from starlette.testclient import TestClient

            mcp = mcp_server.build_mcp(svc, "tok")
            client = TestClient(mcp.streamable_http_app())
            series_ids = []
            for i in range(8):
                sid = f"t{i}"
                svc.cat.con.execute(
                    "INSERT INTO series VALUES (?,?,?,?,?,?,'active',NULL)",
                    [sid, "{}", sid, "u", "1d", "tz"],
                )
                svc.cat.con.commit()
                rid = svc.store.new_run("akshare", sid, BASE, BASE, "u", "1d", "tz")
                svc.store.commit_run(rid, [(sid, BASE, float(i), "u", "akshare", BASE)])
                series_ids.append(sid)

            def hit(sid):
                r = client.get(
                    f"/internal/provenance?series_id={sid}",
                    headers={"Authorization": "Bearer tok"},
                )
                assert r.status_code == 200, r.text
                return r.json()[0]["value"]

            with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
                results = list(ex.map(hit, series_ids * 20))
            for i in range(8):
                vals = [r for r in results[slice(i, None, 8)]]
                assert all(v == float(i) for v in vals), f"串线: series t{i} 得到 {vals}"
        finally:
            svc.close()


class TestRound5Regressions:
    def test_empty_date_rejected_whole_batch(self, tmp_path, monkeypatch):
        """R5-01：空日期 → 整批拒绝、批次 failed、无观测。"""
        from data.service import Service

        setup_svc = Service(tmp_path).init()
        setup_svc.close()
        f = tmp_path / "bad.csv"
        f.write_text("日期,收盘价\n,70.5\n2026-10-02,71.0\n", encoding="utf-8")
        monkeypatch.setattr("builtins.input", lambda prompt="": "y")
        from data import cli

        assert cli.main(["--root", str(tmp_path), "import", str(f)]) == 1
        svc = Service(tmp_path)
        try:
            statuses = svc.store.con.execute(
                "SELECT status FROM ingest_runs ORDER BY ingest_run"
            ).fetchall()
            assert statuses and statuses[-1][0] == "failed"
            assert svc.store.count_obs(
                __import__("data.catalog.descriptor", fromlist=["derive_id"]).derive_id(
                    {"asset": "crude", "geo": "world", "measure": "close", "contract": ""}
                )
            ) == 0
        finally:
            svc.close()

    def test_old_path_invalid_does_not_hurt_new_path(self, tmp_path):
        """R5-02：新路径合法清单接管后，旧路径坏件不得误伤。"""
        svc = Service(tmp_path).init()
        try:
            b = svc.dirs["adapters"] / "b" / "manifest.yaml"
            b.parent.mkdir(exist_ok=True)
            b.write_text(
                "id: shared\nname: S\nversion: 1\ncredentials: none\nprovides:\n"
                "  - descriptor: {asset: bu, geo: cn, measure: close, contract: \"\"}\n"
                "    symbols: [X]\n    unit: cny_ton\n    freq: 1d\n    tz: Asia/Shanghai\n"
                "    fetch: {modes: [on_demand], history_days: 1}\n"
                "    update: {lag_min: 0, revises: true}\n",
                encoding="utf-8",
            )
            svc.reg.rebuild()
            a = svc.dirs["adapters"] / "a" / "manifest.yaml"
            a.parent.mkdir(exist_ok=True)
            a.write_text(b.read_text(encoding="utf-8"), encoding="utf-8")
            b.write_text("id: [broken", encoding="utf-8")
            svc.reg.rebuild()
            row = svc.cat.con.execute(
                "SELECT status FROM sources WHERE id='shared'"
            ).fetchone()
            assert row and row[0] == "ok"
        finally:
            svc.close()

    def test_local_hash_matches_parsed_snapshot(self, tmp_path):
        """R5-03：哈希与实际解析内容同一快照（单次读取）。"""
        import hashlib

        from data.adapters.local_file.local_file_adapter import parse_with_mapping

        f = tmp_path / "p.csv"
        f.write_text("日期,收盘价\n2026-10-01,70.5\n", encoding="utf-8")
        rows, raw = parse_with_mapping(str(f), {"date_col": "日期", "value_col": "收盘价"})
        assert hashlib.sha256(f.read_bytes()).hexdigest() == hashlib.sha256(raw).hexdigest()
        assert len(rows) == 1


class TestRound11Regressions:
    def test_dir_reuse_in_place_error_targets_current_id(self, tmp_path):
        """R11-01/R10-01：目录复用后坏件原地标 error 应指向当前归属源。"""
        svc = Service(tmp_path).init()
        try:
            d = svc.dirs["adapters"] / "shared-dir"
            d.mkdir(exist_ok=True)
            mf = d / "manifest.yaml"
            mf.write_text(
                "id: src-a\nname: A\nversion: 1\ncredentials: none\nprovides:\n"
                "  - descriptor: {asset: bu, geo: cn, measure: close, contract: \"\"}\n"
                "    symbols: [A]\n    unit: cny_ton\n    freq: 1d\n    tz: Asia/Shanghai\n"
                "    fetch: {modes: [on_demand], history_days: 1}\n"
                "    update: {lag_min: 0, revises: true}\n",
                encoding="utf-8",
            )
            svc.reg.rebuild()
            mf.write_text(
                "id: src-b\nname: B\nversion: 1\ncredentials: none\nprovides:\n"
                "  - descriptor: {asset: bu, geo: cn, measure: close, contract: \"\"}\n"
                "    symbols: [B]\n    unit: cny_ton\n    freq: 1d\n    tz: Asia/Shanghai\n"
                "    fetch: {modes: [on_demand], history_days: 1}\n"
                "    update: {lag_min: 0, revises: true}\n",
                encoding="utf-8",
            )
            svc.reg.rebuild()
            mf.write_text(
                "id: src-a\nname: A\nversion: 1\ncredentials: none\nprovides:\n"
                "  - descriptor: {asset: bu, geo: cn, measure: close, contract: \"\"}\n"
                "    symbols: [A]\n    unit: cny_ton\n    freq: 1d\n    tz: Asia/Shanghai\n"
                "    fetch: {modes: [on_demand], history_days: 1}\n"
                "    update: {lag_min: 0, revises: true}\n",
                encoding="utf-8",
            )
            svc.reg.rebuild()
            # 此时 src-a=ok, src-b=disabled；再把清单破坏 → 应原地标 src-a error
            mf.write_text("id: [broken", encoding="utf-8")
            svc.reg.rebuild()
            row = svc.cat.con.execute(
                "SELECT status FROM sources WHERE id='src-a'"
            ).fetchone()
            assert row and row[0] == "error"
        finally:
            svc.close()
