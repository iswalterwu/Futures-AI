"""AC-008-1/2/3/4：MCP 工具契约与内部只读通道（同端口同令牌）。"""
from __future__ import annotations

import asyncio
import json
from datetime import datetime

from starlette.testclient import TestClient

from data import mcp_server
from data.service import Service

BASE = datetime(2026, 10, 1)
TOKEN = "tok123"


def setup_service(tmp_path):
    svc = Service(tmp_path).init()
    svc.cat.con.execute(
        "INSERT INTO series VALUES ('s1','{}','sc.world.-.-.-.close.-.1d','cny_bbl','1d','Asia/Shanghai','active',NULL)"
    )
    svc.cat.set_series_source("s1", "akshare", 100, 1, "cny_bbl", "1d", "Asia/Shanghai")
    return svc


def client_for(svc, token=TOKEN):
    mcp = mcp_server.build_mcp(svc, token)
    app = mcp.streamable_http_app()
    return TestClient(app)


def _call(mcp, name, args):
    out = asyncio.run(mcp.call_tool(name, args))
    text = out[0].text if hasattr(out[0], "text") else str(out[0])
    return json.loads(text)


class TestTools:
    def test_four_tools_registered(self, tmp_path):
        svc = setup_service(tmp_path)
        mcp = mcp_server.build_mcp(svc, TOKEN)
        names = {t.name for t in mcp._tool_manager.list_tools()}
        assert names == {"search_series", "fetch_series", "list_sources", "reconcile"}

    def test_search_series_contract(self, tmp_path):
        svc = setup_service(tmp_path)
        out = _call(mcp_server.build_mcp(svc, TOKEN), "search_series", {"q": "sc"})
        assert "matches" in out
        if out["matches"]:
            assert isinstance(out["matches"][0]["descriptor"], dict)  # F-05：descriptor 为对象

    def test_fetch_default_false_short_circuit(self, tmp_path):
        svc = setup_service(tmp_path)
        before = svc.store.count_obs("s1")
        mcp = mcp_server.build_mcp(svc, TOKEN)
        out = _call(
            mcp,
            "fetch_series",
            {"series_id": "s1", "range": {"start": None, "end": None}},
        )
        assert "rows" in out and out["meta"]["count"] == before
        assert svc.store.count_obs("s1") == before

    def test_fetch_returns_contract_shape(self, tmp_path):
        svc = setup_service(tmp_path)
        rid = svc.store.new_run("akshare", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(rid, [("s1", BASE, 1.0, "cny_bbl", "akshare", BASE)])
        mcp = mcp_server.build_mcp(svc, TOKEN)
        out = _call(
            mcp,
            "fetch_series",
            {"series_id": "s1", "range": {"start": None, "end": None}, "fetch": False},
        )
        assert out["rows"][0]["value"] == 1.0
        assert out["rows"][0]["source"] == "akshare"
        assert out["meta"]["source"] == "akshare"

    def test_iso_range_accepted(self, tmp_path):
        """F-05：合法 ISO8601 范围可用。"""
        svc = setup_service(tmp_path)
        rid = svc.store.new_run("akshare", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(rid, [("s1", BASE, 1.0, "cny_bbl", "akshare", BASE)])
        mcp = mcp_server.build_mcp(svc, TOKEN)
        out = _call(
            mcp,
            "fetch_series",
            {"series_id": "s1", "range": {"start": "2026-10-01", "end": "2026-10-02"}},
        )
        assert "error" not in out
        assert out["meta"]["count"] == 1

    def test_iso_range_invalid_rejected(self, tmp_path):
        svc = setup_service(tmp_path)
        mcp = mcp_server.build_mcp(svc, TOKEN)
        out = _call(
            mcp,
            "fetch_series",
            {"series_id": "s1", "range": {"start": "not-a-date", "end": None}},
        )
        assert out.get("error", {}).get("code") == "validation_error"

    def test_error_structured(self, tmp_path):
        svc = setup_service(tmp_path)
        svc.cat.con.execute("UPDATE sources SET status='disabled' WHERE id='akshare'")
        svc.cat.con.commit()
        mcp = mcp_server.build_mcp(svc, TOKEN)
        out = _call(
            mcp,
            "fetch_series",
            {"series_id": "s1", "range": {"start": None, "end": None}, "fetch": True},
        )
        assert out["error"]["code"] == "not_found"
        assert out["error"]["retryable"] is False

    def test_list_sources_and_reconcile(self, tmp_path):
        svc = setup_service(tmp_path)
        mcp = mcp_server.build_mcp(svc, TOKEN)
        assert "sources" in _call(mcp, "list_sources", {})
        rep = _call(mcp, "reconcile", {"series_id": "s1"})
        assert "report" in rep


class TestAuthAndInternal:
    def test_mcp_requires_token(self, tmp_path):
        """F-06：MCP 主通道无令牌拒绝。"""
        svc = setup_service(tmp_path)
        client = client_for(svc)
        # 无 Authorization 的 JSON-RPC initialize 应被拒
        resp = client.post(
            "/mcp",
            json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}},
        )
        assert resp.status_code in (401, 403)

    def test_internal_provenance_endpoint(self, tmp_path):
        svc = setup_service(tmp_path)
        rid = svc.store.new_run("akshare", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(rid, [("s1", BASE, 1.0, "cny_bbl", "akshare", BASE)])
        client = client_for(svc)
        resp = client.get(
            "/internal/provenance?series_id=s1",
            headers={"Authorization": f"Bearer {TOKEN}"},
        )
        assert resp.status_code == 200
        rows = resp.json()
        assert rows and rows[0]["source"] == "akshare"

    def test_wrong_token_403(self, tmp_path):
        svc = setup_service(tmp_path)
        client = client_for(svc)
        resp = client.get(
            "/internal/provenance?series_id=s1",
            headers={"Authorization": "Bearer bad"},
        )
        assert resp.status_code == 403

    def test_unknown_path_404(self, tmp_path):
        svc = setup_service(tmp_path)
        client = client_for(svc)
        resp = client.get("/other", headers={"Authorization": f"Bearer {TOKEN}"})
        assert resp.status_code == 404
