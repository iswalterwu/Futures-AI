"""MCP server（plan §2.2/§4.6，AC-008-1/2/3/4）与内部只读通道（AC-004-6）。"""
from __future__ import annotations

import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from mcp.server.fastmcp import FastMCP

from data.fetch.on_demand import FetchError
from data.service import Service


def build_mcp(service: Service) -> FastMCP:
    mcp = FastMCP("futuresai-data")

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
            start = range.get("start")
            end = range.get("end")
            res = service.fetch(series_id, start, end, do_fetch=fetch, source=source)
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
        return service.list_sources()

    @mcp.tool()
    def reconcile(series_id: str) -> dict:
        return service.reconcile(series_id)

    return mcp


def _meta_json(meta: dict) -> dict:
    m = dict(meta)
    for k in ("fetched_at", "asof"):
        if m.get(k) is not None:
            m[k] = m[k].isoformat()
    rng = m.get("range") or {}
    m["range"] = {
        "start": rng.get("start").isoformat() if rng.get("start") else None,
        "end": rng.get("end").isoformat() if rng.get("end") else None,
    }
    return m


# ---- 内部只读通道（AC-004-6：CLI 只读命令在写锁被占时经此路由） ----

def _make_handler(service: Service, token: str):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            parts = urlparse(self.path)
            if parts.path not in ("/internal/provenance", "/internal/diff"):
                self.send_response(404)
                self.end_headers()
                return
            if self.headers.get("Authorization") != f"Bearer {token}":
                self.send_response(403)
                self.end_headers()
                return
            qs = parse_qs(parts.query)
            try:
                if parts.path == "/internal/provenance":
                    payload = service.provenance(qs.get("series_id", [""])[0])
                else:
                    payload = service.diff(int(qs["a"][0]), int(qs["b"][0]))
                body = json.dumps(payload, ensure_ascii=False, default=str).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(body)
            except Exception as e:
                body = json.dumps({"error": str(e)}, ensure_ascii=False).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(body)

        def log_message(self, *a):
            pass

    return Handler


def start_internal(service: Service, port: int, token: str) -> ThreadingHTTPServer:
    srv = ThreadingHTTPServer(("127.0.0.1", port), _make_handler(service, token))
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    return srv
