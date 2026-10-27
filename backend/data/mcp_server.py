"""MCP server（plan §2.2/§4.6，AC-008-1/2/3/4）与内部只读通道（AC-004-6）。

- MCP streamable HTTP + 内部只读端点 = **同一端口**（FastMCP custom_route），仅监听 127.0.0.1
- 主 MCP 通道与内部端点均要求 Bearer token（F-06）
- 工具与内部端点在工作线程执行，不阻塞事件循环；数据访问由 service 访问锁串行（F-02）
- 取数（fetch=true）经专用单槽限流器排队：排队期间不占工作线程，只读请求的线程容量不被写请求耗尽
- 非 serve 写进程（CLI 写命令）持锁期间经 readonly_channel 提供同一组只读端点（不含 MCP）
"""
from __future__ import annotations

import asyncio
import contextlib
import hmac
import json
import threading
import time
import weakref
from pathlib import Path

import anyio
from mcp.server.auth.provider import AccessToken
from mcp.server.auth.settings import AuthSettings
from mcp.server.fastmcp import FastMCP
from starlette.responses import JSONResponse

from data.fetch.on_demand import FetchError
from data.lock import DEFAULT_SERVE_PORT, remove_endpoint, write_endpoint
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


async def _in_thread(fn, *args, limiter=None):
    """同步 service 调用移入工作线程（取数的网络等待不阻塞事件循环）。"""
    return await anyio.to_thread.run_sync(fn, *args, limiter=limiter)


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

    # 取数写路径的单槽限流器（每事件循环一个；写本身另由 service 写互斥串行）
    fetch_limiters: weakref.WeakKeyDictionary = weakref.WeakKeyDictionary()

    def _fetch_limiter() -> anyio.CapacityLimiter:
        loop = asyncio.get_running_loop()
        lim = fetch_limiters.get(loop)
        if lim is None:
            lim = fetch_limiters[loop] = anyio.CapacityLimiter(1)
        return lim

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
            return await _in_thread(call, limiter=_fetch_limiter() if fetch else None)
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

    authorized = _bearer_checker(token)
    for path, handler in _internal_routes(service):
        mcp.custom_route(path, methods=["GET"])(_internal_endpoint(handler, authorized))
    return mcp


def _internal_routes(service: Service) -> list[tuple[str, object]]:
    """内部只读端点：路径 → handler(query_params)（serve 与写进程只读通道共用，AC-004-6）。"""
    return [
        ("/internal/sources", lambda qp: service.list_sources()),
        ("/internal/search", lambda qp: service.search(qp.get("q", ""))),
        ("/internal/jobs", lambda qp: {"jobs": service.list_jobs()}),
        ("/internal/reconcile", lambda qp: service.reconcile(qp.get("series_id"))),
        ("/internal/provenance", lambda qp: service.provenance(qp.get("series_id", ""))),
        ("/internal/diff", lambda qp: service.diff(_int_param(qp, "a"), _int_param(qp, "b"))),
    ]


def _bearer_checker(token: str):
    expected = f"Bearer {token}".encode("utf-8")

    def authorized(request) -> bool:
        got = request.headers.get("authorization", "").encode("utf-8")
        return hmac.compare_digest(got, expected)

    return authorized


def _internal_endpoint(handler, authorized):
    async def endpoint(request):
        if not authorized(request):
            return JSONResponse(FetchError("unauthorized", "令牌无效").to_dict(), status_code=403)
        try:
            payload = await _in_thread(handler, request.query_params)
        except Exception as e:
            return JSONResponse(_error(e), status_code=400)
        return JSONResponse(_jsonable(payload))

    return endpoint


def build_internal_app(service: Service, token: str):
    """只含内部只读端点的 HTTP 应用（无 MCP）：非 serve 写进程的只读通道。"""
    from starlette.applications import Starlette
    from starlette.routing import Route

    authorized = _bearer_checker(token)
    return Starlette(
        routes=[
            Route(path, _internal_endpoint(handler, authorized), methods=["GET"])
            for path, handler in _internal_routes(service)
        ]
    )


@contextlib.contextmanager
def readonly_channel(service: Service, data_dir: Path, startup_timeout: float = 10.0):
    """非 serve 写进程持锁期间的内部只读通道（AC-004-6）：后台线程 HTTP 服务 + 端点文件。

    仅 127.0.0.1、随机端口、独立令牌；退出时先删端点文件再停服务。起不来不影响写命令本身：
    yield None，读者回退为等待写锁释放。
    """
    import secrets

    import uvicorn

    token = secrets.token_hex(16)
    config = uvicorn.Config(
        build_internal_app(service, token), host=DEFAULT_HOST, port=0, ws="none",
        log_config=None, log_level="warning", access_log=False, lifespan="off",
    )
    server = uvicorn.Server(config)
    thread = threading.Thread(target=server.run, name="readonly-channel", daemon=True)
    thread.start()
    deadline = time.monotonic() + startup_timeout
    while not server.started and thread.is_alive() and time.monotonic() < deadline:
        time.sleep(0.01)
    port = None
    if server.started and getattr(server, "servers", None):
        port = server.servers[0].sockets[0].getsockname()[1]
        write_endpoint(Path(data_dir), port, token)
    try:
        yield port
    finally:
        if port is not None:
            remove_endpoint(Path(data_dir), token)
        server.should_exit = True
        thread.join(5)


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
