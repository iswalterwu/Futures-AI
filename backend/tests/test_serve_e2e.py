"""AC-008-4 / AC-004-6：真实 serve 子进程端到端（tasks.md T-40）。

不 monkeypatch：真实端口、真实端点文件、真实写锁、真实 HTTP 路由与 MCP streamable HTTP 握手。
"""
from __future__ import annotations

import contextlib
import json
import os
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest

from data import cli
from data.catalog.descriptor import derive_id
from data.lock import read_endpoint

BACKEND = Path(__file__).resolve().parent.parent
SC0 = derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": ""})

INIT = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2025-03-26",
        "capabilities": {},
        "clientInfo": {"name": "e2e", "version": "0"},
    },
}


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _listening(port: int) -> bool:
    try:
        urllib.request.urlopen(f"http://127.0.0.1:{port}/internal/sources", timeout=1)
    except urllib.error.HTTPError:
        return True  # 403（无令牌）= 已监听
    except OSError:
        return False
    return True


def _mcp_post(port, body, bearer=None, session=None, timeout=15):
    hdr = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
    if bearer:
        hdr["Authorization"] = f"Bearer {bearer}"
    if session:
        hdr["Mcp-Session-Id"] = session
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}/mcp", data=json.dumps(body).encode(), headers=hdr, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.headers.get("mcp-session-id"), r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, None, e.read().decode("utf-8", "replace")


# 中继：自带控制台运行，在同一控制台内以新进程组启动 serve 并发送 CTRL_BREAK（与测试进程是否挂控制台无关）
RELAY = r'''
import json, signal, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

backend, root, port, out = sys.argv[1], Path(sys.argv[2]), int(sys.argv[3]), Path(sys.argv[4])
proc = subprocess.Popen(
    [sys.executable, "-m", "data.cli", "--root", str(root), "serve", "--port", str(port)],
    cwd=backend, creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
ready = False
deadline = time.monotonic() + 90
while time.monotonic() < deadline and proc.poll() is None:
    if (root / "data" / "mcp_endpoint.json").exists():
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port}/internal/sources", timeout=1)
        except urllib.error.HTTPError:
            ready = True
            break
        except OSError:
            pass
    time.sleep(0.3)
res = {"ready": ready}
if ready:
    proc.send_signal(signal.CTRL_BREAK_EVENT)
    try:
        res["rc"] = proc.wait(timeout=30)
    except subprocess.TimeoutExpired:
        proc.kill()
        res["rc"] = "timeout"
else:
    proc.kill()
res["lock"] = (root / "data" / ".lock").exists()
res["endpoint"] = (root / "data" / "mcp_endpoint.json").exists()
out.write_text(json.dumps(res), encoding="utf-8")
'''


def _tool_result(body: str) -> dict:
    """tools/call 响应（SSE 或 JSON）→ 工具返回的 dict。"""
    text = body.strip()
    if not text.startswith("{"):
        text = next(line[len("data:"):].strip() for line in text.splitlines() if line.startswith("data:"))
    return json.loads(json.loads(text)["result"]["content"][0]["text"])


# 引导脚本：在 serve 子进程内把主力日线上游换成“首次调用停在网络等待”的桩，再进入真实 CLI
BOOT_SLOW_UPSTREAM = r'''
import sys, time
from pathlib import Path

import pandas as pd

from data.adapters.akshare import akshare_adapter as m

flags = Path(sys.argv[1])


def slow(symbol):
    release = flags / "release"
    if not release.exists():
        (flags / "entered").write_text("1", encoding="utf-8")
        while not release.exists():
            time.sleep(0.05)
    return pd.DataFrame({"日期": ["2026-10-01"], "收盘价": [1.0]})


m._get_main = slow
from data import cli

sys.exit(cli.main(sys.argv[2:]))
'''


@contextlib.contextmanager
def _spawn_serve(tmp_path, launcher):
    """启动真实 serve 子进程并等到端口就绪；launcher = CLI 参数之前的启动命令。"""
    root = tmp_path / "root"
    port = _free_port()
    log_path = tmp_path / "serve.log"
    env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))
    with open(log_path, "w", encoding="utf-8") as log:
        proc = subprocess.Popen(
            [*launcher, "--root", str(root), "serve", "--port", str(port)],
            cwd=str(BACKEND), env=env, stdout=log, stderr=subprocess.STDOUT,
        )
        try:
            deadline = time.monotonic() + 90
            while time.monotonic() < deadline:
                if proc.poll() is not None:
                    break
                if read_endpoint(root / "data") and _listening(port):
                    break
                time.sleep(0.3)
            if proc.poll() is not None or not _listening(port):
                log.flush()
                pytest.fail("serve 未就绪：\n" + log_path.read_text(encoding="utf-8", errors="replace")[-3000:])
            yield root, port, proc
        finally:
            if proc.poll() is None:
                proc.kill()
                proc.wait(15)


@pytest.fixture()
def serve_proc(tmp_path):
    with _spawn_serve(tmp_path, [sys.executable, "-m", "data.cli"]) as handle:
        yield handle


class TestServeE2E:
    def test_serve_mcp_readonly_routing_single_writer_and_recovery(self, serve_proc, capsys):
        root, port, proc = serve_proc
        ep = read_endpoint(root / "data")
        assert ep["port"] == port and (root / "data" / ".lock").exists()

        # AC-008-4：MCP 可连接——无令牌 401；带令牌 initialize → tools/list → tools/call
        assert _mcp_post(port, INIT)[0] == 401
        status, session, body = _mcp_post(port, INIT, ep["token"])
        assert status == 200 and session, body
        _mcp_post(port, {"jsonrpc": "2.0", "method": "notifications/initialized"}, ep["token"], session)
        status, _, body = _mcp_post(port, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"}, ep["token"], session)
        assert status == 200
        for name in ("search_series", "fetch_series", "list_sources", "reconcile"):
            assert name in body
        status, _, body = _mcp_post(
            port,
            {"jsonrpc": "2.0", "id": 3, "method": "tools/call",
             "params": {"name": "reconcile", "arguments": {"series_id": SC0}}},
            ep["token"], session,
        )
        assert status == 200 and SC0 in body

        # AC-004-6：锁被占时 CLI 只读命令经真实 HTTP 路由（不 monkeypatch）
        assert cli.main(["--root", str(root), "list", "sources"]) == 0
        out = json.loads(capsys.readouterr().out)
        assert {"akshare", "eia", "local-file"} <= {s["adapter_id"] for s in out["sources"]}
        assert cli.main(["--root", str(root), "provenance", SC0]) == 0
        assert json.loads(capsys.readouterr().out) == []
        assert cli.main(["--root", str(root), "jobs", "list"]) == 0
        assert json.loads(capsys.readouterr().out) == {"jobs": []}
        assert cli.main(["--root", str(root), "diff", "1", "2"]) == 1  # 不可比原因经路由透传
        assert "不可比" in json.loads(capsys.readouterr().out)["error"]["message"]

        # AC-004-6：写命令被拒（单写者）
        assert cli.main(["--root", str(root), "config", "disable", "eia"]) == 1
        assert "占用" in capsys.readouterr().err

        # 强杀（无清理机会）→ 陈旧锁回收，只读命令回到本地路径，写命令可再取锁
        proc.kill()
        proc.wait(15)
        assert cli.main(["--root", str(root), "list", "sources"]) == 0
        assert json.loads(capsys.readouterr().out)["sources"]
        assert not (root / "data" / ".lock").exists()
        assert cli.main(["--root", str(root), "config", "disable", "eia"]) == 0

    def test_graceful_ctrl_break_removes_endpoint_and_lock(self, tmp_path):
        """AC-008-4 生命周期：真实信号优雅退出 → 退出码 0，端点文件与写锁均清理。"""
        relay = tmp_path / "relay.py"
        relay.write_text(RELAY, encoding="utf-8")
        root, out = tmp_path / "root", tmp_path / "res.json"
        si = subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        si.wShowWindow = 0  # SW_HIDE
        env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))
        p = subprocess.Popen(
            [sys.executable, str(relay), str(BACKEND), str(root), str(_free_port()), str(out)],
            env=env, creationflags=subprocess.CREATE_NEW_CONSOLE, startupinfo=si,
        )
        p.wait(timeout=180)
        assert json.loads(out.read_text(encoding="utf-8")) == {
            "ready": True, "rc": 0, "lock": False, "endpoint": False,
        }

    def test_queued_fetches_do_not_block_reads(self, tmp_path, capsys):
        """AC-004-6 / AC-008-1：真实 serve 中多个 fetch=true 排队（首个停在上游等待）时，
        内部只读端点、MCP 只读工具与 CLI 只读命令照常响应；放行后全部取数成功。"""
        boot = tmp_path / "boot.py"
        boot.write_text(BOOT_SLOW_UPSTREAM, encoding="utf-8")
        flags = tmp_path / "flags"
        flags.mkdir()
        release = flags / "release"
        with _spawn_serve(tmp_path, [sys.executable, str(boot), str(flags)]) as (root, port, proc):
            try:
                token = read_endpoint(root / "data")["token"]
                status, session, body = _mcp_post(port, INIT, token)
                assert status == 200 and session, body
                _mcp_post(port, {"jsonrpc": "2.0", "method": "notifications/initialized"}, token, session)

                results: dict = {}

                def call_fetch(i):
                    msg = {"jsonrpc": "2.0", "id": 100 + i, "method": "tools/call",
                           "params": {"name": "fetch_series",
                                      "arguments": {"series_id": SC0, "range": {}, "fetch": True}}}
                    results[i] = _mcp_post(port, msg, token, session, timeout=120)

                workers = [threading.Thread(target=call_fetch, args=(i,), daemon=True) for i in range(3)]
                for w in workers:
                    w.start()
                deadline = time.monotonic() + 60
                while not (flags / "entered").exists():
                    assert time.monotonic() < deadline, "首个取数未进入上游等待"
                    time.sleep(0.05)
                time.sleep(0.5)  # 其余取数进入排队

                t0 = time.monotonic()
                req = urllib.request.Request(
                    f"http://127.0.0.1:{port}/internal/sources", headers={"Authorization": f"Bearer {token}"}
                )
                with urllib.request.urlopen(req, timeout=10) as r:
                    assert r.status == 200
                status, _, body = _mcp_post(
                    port,
                    {"jsonrpc": "2.0", "id": 200, "method": "tools/call",
                     "params": {"name": "list_sources", "arguments": {}}},
                    token, session, timeout=10,
                )
                assert status == 200 and _tool_result(body)["sources"]
                assert cli.main(["--root", str(root), "list", "sources"]) == 0  # CLI 只读经 HTTP 路由
                assert json.loads(capsys.readouterr().out)["sources"]
                assert time.monotonic() - t0 < 10
                assert all(w.is_alive() for w in workers)  # 取数仍在等待/排队

                release.write_text("1", encoding="utf-8")
                for w in workers:
                    w.join(120)
                assert sorted(results) == [0, 1, 2]
                for status, _, body in results.values():
                    assert status == 200
                    out = _tool_result(body)
                    assert "error" not in out and out["meta"]["count"] == 1
                req = urllib.request.Request(
                    f"http://127.0.0.1:{port}/internal/provenance?series_id={SC0}",
                    headers={"Authorization": f"Bearer {token}"},
                )
                with urllib.request.urlopen(req, timeout=10) as r:
                    rows = json.loads(r.read().decode("utf-8"))
                assert len(rows) == 3 and len({row["ingest_run"] for row in rows}) == 3  # 三个批次各一行
            finally:
                release.write_text("1", encoding="utf-8")

    def test_serve_stdout_is_quiet(self, tmp_path):
        """serve 的 stdout 无运行期输出（访问日志关闭）：托管进程无需排空 stdout（R19-A P3-2）。"""
        root = tmp_path / "root"
        port = _free_port()
        env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))
        with open(tmp_path / "serve.err", "w", encoding="utf-8") as err:
            proc = subprocess.Popen(
                [sys.executable, "-m", "data.cli", "--root", str(root), "serve", "--port", str(port)],
                cwd=str(BACKEND), env=env, stdout=subprocess.PIPE, stderr=err,
            )
            try:
                deadline = time.monotonic() + 90
                while time.monotonic() < deadline and proc.poll() is None:
                    if read_endpoint(root / "data") and _listening(port):
                        break
                    time.sleep(0.3)
                token = read_endpoint(root / "data")["token"]
                for _ in range(5):
                    req = urllib.request.Request(
                        f"http://127.0.0.1:{port}/internal/sources", headers={"Authorization": f"Bearer {token}"}
                    )
                    with urllib.request.urlopen(req, timeout=10) as r:
                        assert r.status == 200
                status, session, _ = _mcp_post(port, INIT, token)
                assert status == 200 and session
            finally:
                proc.kill()
                out, _ = proc.communicate(timeout=30)
        assert out.strip() == b"", out[:500]
