"""第十九轮双审 P3 与测试缺口的回归测试（tasks.md T-89~T-93）。"""
from __future__ import annotations

import asyncio
import json
import os
import socket
import subprocess
import sys
import threading
import time
from pathlib import Path

import duckdb
import pytest

from data import cli, mcp_server, service as service_mod
from data.adapters.akshare import akshare_adapter as ak_mod
from data.lock import read_endpoint, release_lock, write_endpoint, write_lock
from data.service import Service, ServiceClosed

from test_review_round12 import SC0, cli_run, main_df
from test_review_round18 import READER_LOOP, _BeginInterrupt, http_get, statuses
from test_serve_e2e import RELAY, _free_port

BACKEND = Path(__file__).resolve().parent.parent
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))


class SlowHttpServer:
    """最小 HTTP 服务：可模拟正常/慢正文/慢响应头/真 chunked/Connection: close（用于截止时间边界）。

    mode: "length"（Content-Length，默认）/ "slow-headers" / "chunked" / "close"。
    max_duration 是服务端自身总时长上限：超过即停止并断开，避免测试悬挂。
    """

    def __init__(
        self, body: bytes = b'{"sources":[]}', first_delay: float = 0.0, byte_interval: float = 0.0,
        mode: str = "length", max_duration: float = 6.0,
    ):
        self.body, self.first_delay, self.byte_interval = body, first_delay, byte_interval
        self.mode, self.max_duration = mode, max_duration
        self.sock = socket.socket()
        self.sock.bind(("127.0.0.1", 0))
        self.sock.listen()
        self.sock.settimeout(0.2)
        self.port = self.sock.getsockname()[1]
        self.stop = threading.Event()
        self.thread = threading.Thread(target=self._serve, daemon=True)
        self.thread.start()

    def _serve(self):
        while not self.stop.is_set():
            try:
                conn, _ = self.sock.accept()
            except OSError:
                continue
            threading.Thread(target=self._handle, args=(conn,), daemon=True).start()

    def _handle(self, conn):
        try:
            conn.settimeout(5)
            data = b""
            while b"\r\n\r\n" not in data:
                part = conn.recv(4096)
                if not part:
                    return
                data += part
            time.sleep(self.first_delay)
            if self.mode == "slow-headers":  # 头逐行慢发，永不结束（由 max_duration 断开）
                conn.sendall(b"HTTP/1.1 200 OK\r\n")
                stop_at = time.monotonic() + self.max_duration
                while time.monotonic() < stop_at and not self.stop.is_set():
                    conn.sendall(b"X-Slow: %f\r\n" % time.monotonic())
                    time.sleep(self.byte_interval or 0.5)
                return
            if self.mode == "chunked":  # 真 chunked：chunk-size 行后正文逐字节慢发
                conn.sendall(b"HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n")
                conn.sendall(b"%x\r\n" % len(self.body))
                for i in range(len(self.body)):
                    conn.sendall(self.body[i:i + 1])
                    time.sleep(self.byte_interval)
                conn.sendall(b"\r\n0\r\n\r\n")
                return
            if self.mode == "close":  # Connection: close：无 Content-Length，正文慢发后断开
                conn.sendall(b"HTTP/1.1 200 OK\r\nConnection: close\r\n\r\n")
                stop_at = time.monotonic() + self.max_duration
                for i in range(len(self.body)):
                    if time.monotonic() > stop_at or self.stop.is_set():
                        return
                    conn.sendall(self.body[i:i + 1])
                    time.sleep(self.byte_interval)
                return
            conn.sendall(
                b"HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: %d\r\n\r\n" % len(self.body)
            )
            for i in range(len(self.body)):
                if self.stop.is_set():
                    return
                conn.sendall(self.body[i:i + 1])
                time.sleep(self.byte_interval)
        except OSError:
            pass
        finally:
            conn.close()

    def close(self):
        self.stop.set()
        self.thread.join(5)
        self.sock.close()


class TestHardDeadline:
    """T-89 / R19-B-01：统一截止时间是硬上限（连接、响应头、完整响应体）；剩余预算不被 0.5s 下限放大。"""

    def test_slow_chunked_body_cannot_exceed_deadline(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        srv = SlowHttpServer(byte_interval=1.0)  # 每秒 1 字节：单次 socket 超时永不触发
        writer = Service(tmp_path)
        try:
            write_endpoint(tmp_path / "data", srv.port, "tok")
            monkeypatch.setattr(cli, "READ_WAIT_S", 3)
            t0 = time.monotonic()
            assert cli_run(tmp_path, "list", "sources") == 1
            elapsed = time.monotonic() - t0
            assert 2.5 <= elapsed < 6  # 不会读满 14 秒
            assert "无响应" in capsys.readouterr().err
        finally:
            srv.close()
            writer.close()

    def test_tiny_remaining_budget_not_inflated(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        srv = SlowHttpServer(first_delay=0.4)
        writer = Service(tmp_path)
        try:
            write_endpoint(tmp_path / "data", srv.port, "tok")
            monkeypatch.setattr(cli, "READ_WAIT_S", 0.1)
            t0 = time.monotonic()
            assert cli_run(tmp_path, "list", "sources") == 1  # 0.1s 预算内不会等到 0.4s 的响应
            assert time.monotonic() - t0 < 0.4
            assert "无响应" in capsys.readouterr().err
        finally:
            srv.close()
            writer.close()








class TestBeginVisibility:
    """T-93 / AC-004-3：BEGIN 后中断、下一次取数前，failed 对独立连接即时可见。"""

    def test_failed_visible_to_independent_connection(self, tmp_path, monkeypatch):
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df(1.0, "2026-10-01"))
        svc = Service(tmp_path).init()
        try:
            svc.fetch(SC0, do_fetch=True)
            proxy = _BeginInterrupt(svc.store.con, KeyboardInterrupt)
            svc.store.con = proxy
            with pytest.raises(KeyboardInterrupt):
                svc.fetch(SC0, do_fetch=True)
            svc.store.con = proxy._con
            other = duckdb.connect(str(tmp_path / "data" / "observations.duckdb"))
            try:
                seen = [r[0] for r in other.execute("SELECT status FROM ingest_runs ORDER BY ingest_run").fetchall()]
                assert seen == ["succeeded", "failed"]  # 失败状态已独立提交，其他连接即时可见
                assert other.execute("SELECT COUNT(*) FROM observations").fetchone()[0] == 1
            finally:
                other.close()
        finally:
            svc.close()




class TestToolsAfterClose:
    """T-93 / AC-008-3：服务关闭后 MCP 四工具均返回结构化 internal，不触碰已关闭连接。"""

    def test_four_tools_structured_after_close(self, tmp_path):
        svc = Service(tmp_path).init()
        mcp = mcp_server.build_mcp(svc, "tok")
        svc.close()
        calls = {
            "search_series": {"q": "sc"},
            "fetch_series": {"series_id": SC0, "range": {}},
            "list_sources": {},
            "reconcile": {"series_id": SC0},
        }
        for name, args in calls.items():
            out = asyncio.run(mcp.call_tool(name, args))
            body = json.loads(out[0].text)
            assert body["error"]["code"] == "internal" and body["error"]["retryable"] is False, name
            assert "已关闭" in body["error"]["message"], name


class TestBarrierAfterNetwork:
    """T-93 / AC-004-3：网络阶段后遇关闭屏障 → 批次遗留 running（无观测行），冷启动超时清理标 failed。"""

    def test_running_batch_cleaned_on_cold_start(self, tmp_path, monkeypatch):
        gate, entered, result = threading.Event(), threading.Event(), {}

        def slow(symbol):
            entered.set()
            assert gate.wait(30)
            return main_df(1.0, "2026-10-01")

        monkeypatch.setattr(ak_mod, "_get_main", slow)
        svc = Service(tmp_path).init()

        def fetch():
            try:
                svc.fetch(SC0, do_fetch=True)
            except BaseException as e:  # noqa: BLE001
                result["exc"] = e

        t = threading.Thread(target=fetch, daemon=True)
        t.start()
        assert entered.wait(10)
        svc.close()  # 网络阶段不持访问锁 → 关库先于提交
        gate.set()
        t.join(30)
        assert isinstance(result.get("exc"), ServiceClosed)
        svc = Service(tmp_path).init()  # 冷启动：批次仍 running（未超时），无观测行
        try:
            assert statuses(svc) == ["running"] and svc.store.count_obs(SC0) == 0
            assert svc.store.stale_running(minutes=0) == [1]  # 超时清理 → failed
            assert statuses(svc) == ["failed"]
        finally:
            svc.close()
