"""MCP server（plan §2.2/§4.6，AC-008-1/2/3/4）与内部只读通道（AC-004-6）。

- MCP streamable HTTP + 内部只读端点 = **同一端口**（FastMCP custom_route），仅监听 127.0.0.1
- 主 MCP 通道与内部端点均要求 Bearer token（F-06）
- 工具与内部端点在工作线程执行，不阻塞事件循环；数据访问由 service 访问锁串行（F-02）
"""
from __future__ import annotations

import hmac
import json
import time

import anyio
from mcp.server.auth.provider import AccessToken
from mcp.server.auth.settings import AuthSettings
from mcp.server.fastmcp import FastMCP
from starlette.responses import JSONResponse

from data.fetch.on_demand import FetchError
from data.lock import DEFAULT_SERVE_PORT
from data.service import Service
from data.store.provenance import DiffError

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = DEFAULT_SERVE_PORT


class StaticTokenVerifier:
    def __init__(self, token: str):
        self.token = token

    async def verify_token(self, token: str) -> AccessToken | None:
        if not hmac.compare_digest(token.encode("utf-8"), self.token.encode("utf-8")):
            return None
        return AccessToken(
            token=token,
            client_id="local",
            scopes=[],
            expires_at=int(time.time()) + 86400,
        )


def _jsonable(obj):
    return json.loads(json.dumps(obj, ensure_ascii=False, default=str))


def _error(e: Exception) -> dict:
    """异常 → 结构化错误（AC-008-3：不抛裸异常给模型）。"""
    if isinstance(e, FetchError):
        return e.to_dict()
    if isinstance(e, DiffError):
        return FetchError("validation_error", f"不可比：{e.reason}").to_dict()
    return FetchError("internal", str(e)).to_dict()


def _int_param(params, name: str) -> int:
    try:
        return int(params[name])
    except (KeyError, ValueError) as e:
        raise FetchError("validation_error", f"参数 {name} 须为整数") from e


async def _in_thread(fn, *args):
    """同步 service 调用移入工作线程（取数的网络等待不阻塞事件循环）。"""
    return await anyio.to_thread.run_sync(fn, *args)


def build_mcp(
    service: Service, token: str, host: str = DEFAULT_HOST, port: int = DEFAULT_PORT
) -> FastMCP:
    base_url = f"http://{host}:{port}"
    mcp = FastMCP(
        "futuresai-data",
        host=host,
        port=port,
        token_verifier=StaticTokenVerifier(token),
        auth=AuthSettings(
            issuer_url=base_url,
            resource_server_url=base_url,
            validate_token_resource=False,
        ),
    )

    @mcp.tool()
    async def search_series(q: str) -> dict:
        try:
            return await _in_thread(service.search, q)
        except Exception as e:
            return _error(e)

    @mcp.tool()
    async def fetch_series(
        series_id: str, range: dict, fetch: bool = False, source: str | None = None
    ) -> dict:
        def call():
            rng = range or {}
            res = service.fetch(
                series_id, rng.get("start"), rng.get("end"), do_fetch=fetch, source=source
            )
            rows = [
                {"ts": r[0], "value": r[1], "unit": r[2], "source": r[3]} for r in res["rows"]
            ]
            return {"series_id": series_id, "rows": rows, "meta": _meta_json(res["meta"])}

        try:
            return await _in_thread(call)
        except Exception as e:
            return _error(e)

    @mcp.tool()
    async def list_sources() -> dict:
        try:
            return await _in_thread(service.list_sources)
        except Exception as e:
            return _error(e)

    @mcp.tool()
    async def reconcile(series_id: str) -> dict:
        try:
            return await _in_thread(service.reconcile, series_id)
        except Exception as e:
            return _error(e)

    # ---- 内部只读端点（与 MCP 同端口，同令牌；CLI 只读命令在写锁被占时经此路由） ----

    expected_auth = f"Bearer {token}".encode("utf-8")

    def _authorized(request) -> bool:
        got = request.headers.get("authorization", "").encode("utf-8")
        return hmac.compare_digest(got, expected_auth)

    def _internal(path: str, handler) -> None:
        @mcp.custom_route(path, methods=["GET"])
        async def endpoint(request):
            if not _authorized(request):
                return JSONResponse(
                    FetchError("unauthorized", "令牌无效").to_dict(), status_code=403
                )
            try:
                payload = await _in_thread(handler, request.query_params)
            except Exception as e:
                return JSONResponse(_error(e), status_code=400)
            return JSONResponse(_jsonable(payload))

    _internal("/internal/sources", lambda qp: service.list_sources())
    _internal("/internal/search", lambda qp: service.search(qp.get("q", "")))
    _internal("/internal/jobs", lambda qp: {"jobs": service.list_jobs()})
    _internal("/internal/reconcile", lambda qp: service.reconcile(qp.get("series_id")))
    _internal("/internal/provenance", lambda qp: service.provenance(qp.get("series_id", "")))
    _internal(
        "/internal/diff",
        lambda qp: service.diff(_int_param(qp, "a"), _int_param(qp, "b")),
    )
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
