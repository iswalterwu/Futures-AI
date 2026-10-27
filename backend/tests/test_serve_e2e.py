"""AC-008-4 / AC-004-6：真实 serve 子进程端到端（tasks.md T-40）。

不 monkeypatch：真实端口、真实端点文件、真实写锁、真实 HTTP 路由与 MCP streamable HTTP 握手。
"""
from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
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


def _mcp_post(port, body, bearer=None, session=None):
    hdr = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
    if bearer:
        hdr["Authorization"] = f"Bearer {bearer}"
    if session:
        hdr["Mcp-Session-Id"] = session
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}/mcp", data=json.dumps(body).encode(), headers=hdr, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
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


@pytest.fixture()
def serve_proc(tmp_path):
    root = tmp_path / "root"
    port = _free_port()
    log_path = tmp_path / "serve.log"
    env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))
    with open(log_path, "w", encoding="utf-8") as log:
        proc = subprocess.Popen(
            [sys.executable, "-m", "data.cli", "--root", str(root), "serve", "--port", str(port)],
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
