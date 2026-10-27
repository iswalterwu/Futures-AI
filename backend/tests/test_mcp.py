"""AC-008-1/2/3/4：MCP 工具契约与内部只读通道。"""
from __future__ import annotations

import asyncio
import json
import socket
import urllib.request
from datetime import datetime, timedelta

import pytest

from data import mcp_server
from data.service import Service

BASE = datetime(2026, 10, 1)


def setup_service(tmp_path):
    svc = Service(tmp_path).init()
    svc.cat.con.execute(
        "INSERT INTO series VALUES ('s1','{}','sc.world.-.-.-.close.-.1d','cny_bbl','1d','Asia/Shanghai','active',NULL)"
    )
    # 内置 akshare 源已由 registry 注册；为测试序列登记源关系
    svc.cat.set_series_source("s1", "akshare", 100, 1, "cny_bbl", "1d", "Asia/Shanghai")
    return svc


def _call(mcp, name, args):
    out = asyncio.run(mcp.call_tool(name, args))
    text = out[0].text if hasattr(out[0], "text") else str(out[0])
    return json.loads(text)


class TestTools:
    def test_search_series_contract(self, tmp_path):
        svc = setup_service(tmp_path)
        out = _call(mcp_server.build_mcp(svc), "search_series", {"q": "sc"})
        assert "matches" in out

    def test_fetch_default_false_short_circuit(self, tmp_path):
        svc = setup_service(tmp_path)
        before = svc.store.count_obs("s1")
        mcp = mcp_server.build_mcp(svc)
        out = _call(mcp, 
            "fetch_series",
            {"series_id": "s1", "range": {"start": None, "end": None}},
        )
        assert "rows" in out and out["meta"]["count"] == before
        assert svc.store.count_obs("s1") == before  # 无写库

    def test_fetch_returns_contract_shape(self, tmp_path):
        svc = setup_service(tmp_path)
        rid = svc.store.new_run("akshare", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(rid, [("s1", BASE, 1.0, "cny_bbl", "akshare", BASE)])
        mcp = mcp_server.build_mcp(svc)
        out = _call(mcp, 
            "fetch_series",
            {"series_id": "s1", "range": {"start": None, "end": None}, "fetch": False},
        )
        assert out["rows"][0] == {"ts": BASE.isoformat(), "value": 1.0, "unit": "cny_bbl", "source": "akshare"}
        assert out["meta"]["source"] == "akshare"

    def test_error_structured(self, tmp_path):
        svc = setup_service(tmp_path)
        svc.cat.con.execute("UPDATE sources SET status='disabled' WHERE id='akshare'")
        svc.cat.con.commit()
        mcp = mcp_server.build_mcp(svc)
        out = _call(mcp, 
            "fetch_series",
            {"series_id": "s1", "range": {"start": None, "end": None}, "fetch": True},
        )
        assert out["error"]["code"] == "not_found"
        assert out["error"]["retryable"] is False

    def test_list_sources_and_reconcile(self, tmp_path):
        svc = setup_service(tmp_path)
        mcp = mcp_server.build_mcp(svc)
        assert "sources" in _call(mcp, "list_sources", {})
        rep = _call(mcp, "reconcile", {"series_id": "s1"})
        assert "report" in rep


class TestInternalChannel:
    def test_provenance_endpoint(self, tmp_path):
        svc = setup_service(tmp_path)
        rid = svc.store.new_run("akshare", "s1", BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(rid, [("s1", BASE, 1.0, "cny_bbl", "akshare", BASE)])
        srv = mcp_server.start_internal(svc, 0, "tok123")
        try:
            port = srv.server_address[1]
            url = f"http://127.0.0.1:{port}/internal/provenance?series_id=s1"
            req = urllib.request.Request(url, headers={"Authorization": "Bearer tok123"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                assert resp.status == 200
                rows = json.loads(resp.read().decode("utf-8"))
            assert rows and rows[0]["source"] == "akshare"
        finally:
            srv.shutdown()

    def test_wrong_token_403(self, tmp_path):
        svc = setup_service(tmp_path)
        srv = mcp_server.start_internal(svc, 0, "good")
        try:
            url = f"http://127.0.0.1:{srv.server_address[1]}/internal/provenance?series_id=s1"
            req = urllib.request.Request(url, headers={"Authorization": "Bearer bad"})
            with pytest.raises(urllib.error.HTTPError) as ei:
                urllib.request.urlopen(req, timeout=5)
            assert ei.value.code == 403
        finally:
            srv.shutdown()

    def test_unknown_path_404(self, tmp_path):
        svc = setup_service(tmp_path)
        srv = mcp_server.start_internal(svc, 0, "t")
        try:
            url = f"http://127.0.0.1:{srv.server_address[1]}/other"
            req = urllib.request.Request(url, headers={"Authorization": "Bearer t"})
            with pytest.raises(urllib.error.HTTPError) as ei:
                urllib.request.urlopen(req, timeout=5)
            assert ei.value.code == 404
        finally:
            srv.shutdown()
