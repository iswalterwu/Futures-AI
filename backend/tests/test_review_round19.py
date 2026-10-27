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

    @pytest.mark.parametrize(
        "mode,interval",
        [("slow-headers", 0.5), ("chunked", 0.6), ("close", 0.6)],
    )
    def test_header_and_framing_stages_bounded(self, tmp_path, monkeypatch, capsys, mode, interval):
        """响应头逐行慢发、真 chunked 帧、Connection: close 正文都受统一截止时间约束（看门狗）。"""
        Service(tmp_path).init().close()
        srv = SlowHttpServer(mode=mode, byte_interval=interval)
        writer = Service(tmp_path)
        try:
            write_endpoint(tmp_path / "data", srv.port, "tok")
            monkeypatch.setattr(cli, "READ_WAIT_S", 1)
            t0 = time.monotonic()
            assert cli_run(tmp_path, "list", "sources") == 1
            elapsed = time.monotonic() - t0
            assert elapsed < 2.5, (mode, elapsed)
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


class TestExternalHold:
    """T-90 / R19-A P3-1：外部进程（无写锁）长期占用观测库 → 只读命令约 2s 提前报占用，不等满 30s。"""

    def test_reader_fails_early_with_lockbusy(self, tmp_path, capsys):
        Service(tmp_path).init().close()
        holder = subprocess.Popen(
            [sys.executable, "-c",
             "import duckdb, sys, time; c = duckdb.connect(sys.argv[1]); print('held', flush=True); time.sleep(60)",
             str(tmp_path / "data" / "observations.duckdb")],
            stdout=subprocess.PIPE, text=True,
        )
        try:
            assert holder.stdout.readline().strip() == "held"
            t0 = time.monotonic()
            assert cli_run(tmp_path, "list", "sources") == 1
            elapsed = time.monotonic() - t0
            assert cli.EXTERNAL_BUSY_S <= elapsed < 10
            assert "占用" in capsys.readouterr().err
            assert not (tmp_path / "data" / ".lock").exists()
        finally:
            holder.kill()
            holder.wait()


class TestBusyMarkers:
    """T-92 / R19-A P3-3：占用识别含系统错误码 32/33 的本地化消息，不依赖系统语言。"""

    def test_system_messages_are_markers(self):
        import ctypes

        for code in (32, 33):
            text = ctypes.FormatError(code).strip()
            assert text and text in service_mod._BUSY_MARKERS
            assert service_mod._is_busy(duckdb.IOException(f'IO Error: Cannot open file "x": {text}\r\n'))
        assert service_mod._is_busy(duckdb.IOException("IO Error: ... being used by another process."))
        assert not service_mod._is_busy(duckdb.IOException('IO Error: Cannot open file "x": 拒绝访问。'))


class TestClosedEndpoint:
    """T-93 / R19-B-02：服务关闭后内部端点确定性返回 503 + 结构化错误；CLI 读者经真实 503 回退为等待。"""

    def test_endpoint_503_and_cli_fallback(self, tmp_path, capsys):
        w = Service(tmp_path).init()
        data = tmp_path / "data"
        with mcp_server.readonly_channel(w, data) as port:
            token = read_endpoint(data)["token"]
            w.close()  # 服务关闭（写锁释放），通道仍在运行 → 迟到请求被屏障拒绝
            status, body = http_get(port, "/internal/sources", token)
            assert status == 503
            assert body["error"]["code"] == "internal" and "已关闭" in body["error"]["message"]
            assert body["error"]["retryable"] is False
            lk = write_lock(data)  # 模拟写锁仍被持有：读者须经通道 → 503 → 视同不可用 → 等待
            threading.Timer(0.8, lambda: release_lock(lk)).start()
            t0 = time.monotonic()
            assert cli_run(tmp_path, "list", "sources") == 0  # 写锁释放后本地读取
            assert 0.6 <= time.monotonic() - t0 < 10
            assert json.loads(capsys.readouterr().out)["sources"]


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


class TestServeWithReaders:
    """T-93 / AC-008-4、AC-004-6：真实 serve 启动与 CTRL_BREAK 停服期间，持续轮询的读者零失败。"""

    def test_readers_unaffected_by_serve_lifecycle(self, tmp_path):
        root = tmp_path / "root"
        Service(root).init().close()
        reader = tmp_path / "reader.py"
        reader.write_text(READER_LOOP, encoding="utf-8")
        stop = tmp_path / "stop"
        readers = [
            subprocess.Popen(
                [sys.executable, str(reader), str(root), str(stop), str(tmp_path / f"r{i}.json")],
                cwd=str(BACKEND), env=ENV, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
            for i in range(2)
        ]
        try:
            time.sleep(1.0)
            relay = tmp_path / "relay.py"
            relay.write_text(RELAY, encoding="utf-8")
            out = tmp_path / "res.json"
            si = subprocess.STARTUPINFO()
            si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            si.wShowWindow = 0
            p = subprocess.Popen(
                [sys.executable, str(relay), str(BACKEND), str(root), str(_free_port()), str(out)],
                env=ENV, creationflags=subprocess.CREATE_NEW_CONSOLE, startupinfo=si,
            )
            p.wait(timeout=180)
            assert json.loads(out.read_text(encoding="utf-8")) == {
                "ready": True, "rc": 0, "lock": False, "endpoint": False,
            }
            time.sleep(1.0)  # 停服后读者回到本地读取
        finally:
            stop.write_text("1", encoding="utf-8")
            for r in readers:
                r.wait(60)
        for i in range(2):
            res = json.loads((tmp_path / f"r{i}.json").read_text(encoding="utf-8"))
            assert res["runs"] > 0 and res["fails"] == 0, res


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
