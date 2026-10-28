"""desktop-shell 后端宿主：健康检查与鉴权（spec AC-002-2、AC-009-1）。"""
from __future__ import annotations

import json
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest
from starlette.testclient import TestClient

from app.main import VERSION, create_app

BACKEND = Path(__file__).resolve().parent.parent
TOKEN = "tok-" + "host-test"


def client_for(root: Path, token: str = TOKEN):
    return TestClient(create_app(root, token=token))


class TestHealth:
    def test_health_reports_ready_and_version(self, tmp_path):
        with client_for(tmp_path) as client:
            body = client.get("/health").json()
        assert body == {"status": "ok", "data_ready": True, "version": VERSION}

    def test_health_needs_no_token(self, tmp_path):
        with client_for(tmp_path) as client:
            assert client.get("/health").status_code == 200

    def test_other_endpoints_require_token(self, tmp_path):
        with client_for(tmp_path) as client:
            assert client.get("/settings/profile").status_code == 401
            ok = client.get("/settings/profile", headers={"Authorization": f"Bearer {TOKEN}"})
            assert ok.status_code == 200

    def test_health_not_ready_when_service_init_fails(self, tmp_path, monkeypatch):
        """AC-002-2：Service 起不来时 /health 不能用 200 冒充就绪。"""
        from data.service import Service

        def boom(self):
            raise RuntimeError("init failed")

        monkeypatch.setattr(Service, "init", boom)
        with pytest.raises(RuntimeError):
            with client_for(tmp_path):
                pass  # lifespan 启动失败 → 应用不可用（外壳据此判为未就绪）


class TestLoopbackBind:
    def test_subprocess_listens_on_loopback_only(self, tmp_path):
        """AC-009-1：真实进程只绑 127.0.0.1，端口由系统分配并写入端点文件。"""
        port_file = tmp_path / "host.json"
        env = {"PYTHONPATH": str(BACKEND), "PYTHONIOENCODING": "utf-8"}
        proc = subprocess.Popen(
            [sys.executable, "-m", "app", "--root", str(tmp_path), "--port-file", str(port_file), "--token", TOKEN],
            cwd=str(BACKEND), env={**__import__("os").environ, **env},
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        try:
            deadline = time.monotonic() + 60
            while time.monotonic() < deadline and not port_file.exists() and proc.poll() is None:
                time.sleep(0.1)
            assert port_file.exists(), "宿主未在 60s 内就绪"
            info = json.loads(port_file.read_text(encoding="utf-8"))
            assert info["token"] == TOKEN
            with urllib.request.urlopen(f"http://127.0.0.1:{info['port']}/health", timeout=5) as resp:
                assert json.loads(resp.read())["data_ready"] is True
            # 127.0.0.1 可连、本机其他地址不可连（用非回环地址探测）
            host_ip = socket.gethostbyname(socket.gethostname())
            if not host_ip.startswith("127."):
                with pytest.raises(OSError):
                    socket.create_connection((host_ip, info["port"]), timeout=2).close()
        finally:
            if proc.poll() is None:
                proc.kill()
            proc.wait(15)
