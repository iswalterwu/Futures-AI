"""desktop-shell 后端宿主：生命周期与优雅退出（spec AC-003-1，plan §2/§4）。"""
from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent
TOKEN = "tok-" + "lifecycle"


def _start(root: Path, port_file: Path, *extra: str) -> subprocess.Popen:
    env = {**os.environ, "PYTHONPATH": str(BACKEND), "PYTHONIOENCODING": "utf-8"}
    return subprocess.Popen(
        [sys.executable, "-m", "app", "--root", str(root), "--port-file", str(port_file), "--token", TOKEN, *extra],
        cwd=str(BACKEND), env=env, stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def _wait_ready(proc: subprocess.Popen, port_file: Path, timeout: float = 60.0) -> dict:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline and proc.poll() is None:
        if port_file.exists():
            info = json.loads(port_file.read_text(encoding="utf-8"))
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{info['port']}/health", timeout=2) as r:
                    body = json.loads(r.read())
                    if r.status == 200 and body.get("status") == "ok" and body.get("data_ready") is True:
                        return info
            except OSError:
                pass
        time.sleep(0.1)
    raise AssertionError("宿主未就绪")


def _post_shutdown(port: int) -> None:
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}/shutdown",
        data=b"{}",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        assert resp.status == 200


class TestStdinEof:
    def test_stdin_eof_releases_lock_and_port(self, tmp_path):
        endpoint = tmp_path / "host.json"
        proc = _start(tmp_path, endpoint, "--exit-on-stdin-eof")
        try:
            info = _wait_ready(proc, endpoint)
            assert (tmp_path / "data" / ".lock").exists()
            proc.stdin.close()
            assert proc.wait(5) == 0
            assert not (tmp_path / "data" / ".lock").exists()
            with socket.socket() as sock:
                sock.bind(("127.0.0.1", info["port"]))
        finally:
            proc.stdin.close()
            if proc.poll() is None:
                proc.kill()
            proc.wait(15)

    def test_without_flag_stdin_eof_ignored(self, tmp_path):
        endpoint = tmp_path / "host.json"
        proc = _start(tmp_path, endpoint)
        try:
            info = _wait_ready(proc, endpoint)
            proc.stdin.close()
            time.sleep(0.5)
            assert proc.poll() is None
            assert (tmp_path / "data" / ".lock").exists()
            with urllib.request.urlopen(f"http://127.0.0.1:{info['port']}/health", timeout=2) as response:
                assert response.status == 200
            _post_shutdown(info["port"])
            assert proc.wait(5) == 0
        finally:
            proc.stdin.close()
            if proc.poll() is None:
                proc.kill()
            proc.wait(15)


class TestGracefulShutdown:
    def test_shutdown_releases_lock_and_port(self, tmp_path):
        """AC-003-1：/shutdown 后进程退出、写锁删除、端口释放。"""
        port_file = tmp_path / "host.json"
        proc = _start(tmp_path, port_file)
        try:
            info = _wait_ready(proc, port_file)
            assert (tmp_path / "data" / ".lock").exists()  # 宿主持写锁

            _post_shutdown(info["port"])
            proc.wait(timeout=30)

            assert proc.returncode == 0
            assert not (tmp_path / "data" / ".lock").exists(), "退出后写锁未释放"
            with socket.socket() as s:  # 端口已释放，可再次绑定
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind(("127.0.0.1", info["port"]))
        finally:
            if proc.poll() is None:
                proc.kill()
            proc.wait(15)

    def test_shutdown_requires_token(self, tmp_path):
        port_file = tmp_path / "host.json"
        proc = _start(tmp_path, port_file)
        try:
            info = _wait_ready(proc, port_file)
            req = urllib.request.Request(
                f"http://127.0.0.1:{info['port']}/shutdown", data=b"{}", method="POST",
                headers={"Content-Type": "application/json"},
            )
            try:
                urllib.request.urlopen(req, timeout=5)
                raise AssertionError("无令牌的 /shutdown 不应成功")
            except urllib.error.HTTPError as e:
                assert e.code == 401
            assert proc.poll() is None  # 仍在运行
        finally:
            if proc.poll() is None:
                proc.kill()
            proc.wait(15)

    def test_stale_lock_recovered_after_hard_kill(self, tmp_path):
        """AC-003-3：强杀后下次启动能自愈（陈旧锁回收）。"""
        port_file = tmp_path / "host.json"
        proc = _start(tmp_path, port_file)
        try:
            _wait_ready(proc, port_file)
        finally:
            proc.kill()
            proc.wait(15)
        assert (tmp_path / "data" / ".lock").exists()  # 强杀留下锁

        port_file.unlink()
        proc2 = _start(tmp_path, port_file)
        try:
            info = _wait_ready(proc2, port_file)
            assert info["port"] > 0
        finally:
            if proc2.poll() is None:
                proc2.kill()
            proc2.wait(15)
