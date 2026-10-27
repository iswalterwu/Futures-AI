"""MCP server（plan §2.2/§4.6，AC-008-1/2/3/4）与内部只读通道（AC-004-6）。

- MCP streamable HTTP + 内部只读端点 = **同一端口**（FastMCP custom_route）
- 主 MCP 通道与内部端点均要求 Bearer token（F-06）
- 内部端点每请求独立只读连接（F-02 并发串线）
"""
from __future__ import annotations

import json
import time
from pathlib import Path

from mcp.server.auth.provider import AccessToken, TokenVerifier
from mcp.server.fastmcp import FastMCP
from starlette.responses import JSONResponse

from data.fetch.on_demand import FetchError
from data.service import Service
from data.store.duck import DuckStore
from data.store.provenance import diff, provenance


class StaticTokenVerifier:
    def __init__(self, token: str):
        self.token = token

    async def verify_token(self, token: str) -> AccessToken | None:
        if token != self.token:
            return None
        return AccessToken(
            token=token,
            client_id="local",
            scopes=[],
            expires_at=int(time.time()) + 86400,
        )


# 内部端点直接调用 service（Service._access_lock 串行化单连接，F-02）


def _jsonable(obj):
    return json.loads(json.dumps(obj, ensure_ascii=False, default=str))


def build_mcp(service: Service, token: str) -> FastMCP:
    from mcp.server.auth.settings import AuthSettings

    mcp = FastMCP(
        "futuresai-data",
        token_verifier=StaticTokenVerifier(token),
        auth=AuthSettings(
            issuer_url="http://127.0.0.1:8932",
            resource_server_url="http://127.0.0.1:8932",
            validate_token_resource=False,
        ),
    )

    @mcp.tool()
    def search_series(q: str) -> dict:
        try:
            return service.search(q)
        except FetchError as e:
            return e.to_dict()
        except Exception as e:
            return {"error": {"code": "internal", "message": str(e), "retryable": False}}

    @mcp.tool()
    def fetch_series(
        series_id: str, range: dict, fetch: bool = False, source: str | None = None
    ) -> dict:
        try:
            rng = range or {}
            res = service.fetch(
                series_id, rng.get("start"), rng.get("end"), do_fetch=fetch, source=source
            )
            rows = [
                {"ts": r[0], "value": r[1], "unit": r[2], "source": r[3]} for r in res["rows"]
            ]
            return {"series_id": series_id, "rows": rows, "meta": _meta_json(res["meta"])}
        except FetchError as e:
            return e.to_dict()
        except Exception as e:
            return {"error": {"code": "internal", "message": str(e), "retryable": False}}

    @mcp.tool()
    def list_sources() -> dict:
        try:
            return service.list_sources()
        except Exception as e:
            return {"error": {"code": "internal", "message": str(e), "retryable": False}}

    @mcp.tool()
    def reconcile(series_id: str) -> dict:
        try:
            return service.reconcile(series_id)
        except Exception as e:
            return {"error": {"code": "internal", "message": str(e), "retryable": False}}

    # ---- 内部只读端点（与 MCP 同端口，同令牌） ----

    def _auth(request) -> bool:
        return request.headers.get("authorization", "") == f"Bearer {token}"

    @mcp.custom_route("/internal/provenance", methods=["GET"])
    async def internal_provenance(request):
        if not _auth(request):
            return JSONResponse({"error": "unauthorized"}, status_code=403)
        series_id = request.query_params.get("series_id", "")
        try:
            payload = service.provenance(series_id)
            return JSONResponse(_jsonable(payload))
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=400)

    @mcp.custom_route("/internal/diff", methods=["GET"])
    async def internal_diff(request):
        if not _auth(request):
            return JSONResponse({"error": "unauthorized"}, status_code=403)
        try:
            payload = service.diff(int(request.query_params["a"]), int(request.query_params["b"]))
            return JSONResponse(_jsonable(payload))
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=400)



        rows = cat.con.execute(
            "SELECT id, descriptor_json, unit, freq FROM series "
            "WHERE display_id_8slot LIKE ? OR descriptor_json LIKE ? OR id IN "
            "(SELECT series_id FROM aliases WHERE source_symbol LIKE ?) "
            "ORDER BY id LIMIT 50",
            [f"%{q}%", f"%{q}%", f"%{q}%"],
        ).fetchall()
        return {
            "matches": [
                {"series_id": r[0], "descriptor": _json.loads(r[1]) if r[1] else {}, "unit": r[2], "freq": r[3]}
                for r in rows
            ]
        }

    @mcp.custom_route("/internal/search", methods=["GET"])
    async def internal_search(request):
        if not _auth(request):
            return JSONResponse({"error": "unauthorized"}, status_code=403)
        q = request.query_params.get("q", "")
        try:
            return JSONResponse(_jsonable(service.search(q)))
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=400)

    @mcp.custom_route("/internal/sources", methods=["GET"])
    async def internal_sources(request):
        if not _auth(request):
            return JSONResponse({"error": "unauthorized"}, status_code=403)
        try:
            return JSONResponse(_jsonable(service.list_sources()))
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=400)

    @mcp.custom_route("/internal/jobs", methods=["GET"])
    async def internal_jobs(request):
        if not _auth(request):
            return JSONResponse({"error": "unauthorized"}, status_code=403)
        try:
            return JSONResponse(_jsonable({"jobs": service.jobs.list() if service.jobs else []}))
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=400)

    @mcp.custom_route("/internal/reconcile", methods=["GET"])
    async def internal_reconcile(request):
        if not _auth(request):
            return JSONResponse({"error": "unauthorized"}, status_code=403)
        sid = request.query_params.get("series_id")
        try:
            return JSONResponse(_jsonable(service.reconcile(sid)))
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=400)

    return mcp


def _meta_json(meta: dict) -> dict:
    m = dict(meta)
    for k in ("fetched_at", "asof"):
        v = m.get(k)
        if v is not None:
            m[k] = v.isoformat() if hasattr(v, "isoformat") else str(v)
    rng = m.get("range") or {}
    m["range"] = {
        "start": rng.get("start").isoformat() if rng.get("start") is not None else None,
        "end": rng.get("end").isoformat() if rng.get("end") is not None else None,
    }
    return m
