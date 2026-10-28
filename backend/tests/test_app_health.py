"""desktop-shell 后端宿主：健康检查与鉴权（spec AC-002-2、AC-009-1）。"""
from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest
from starlette.testclient import TestClient

from app.main import VERSION, create_app
from tools.shell_check import listening_addresses, package_exclusions, wait_for_health

BACKEND = Path(__file__).resolve().parent.parent
TOKEN = "tok-" + "host-test"


def client_for(root: Path, token: str = TOKEN):
    return TestClient(create_app(root, token=token))


class TestHealth:
    def test_health_reports_ready_and_version(self, tmp_path):
        with client_for(tmp_path) as client:
            body = client.get("/health").json()
        assert body == {"status": "ok", "data_ready": True, "version": VERSION}

    def test_health_probes_both_stores(self, tmp_path, monkeypatch):
        with client_for(tmp_path) as client:
            svc = client.app.state.host.svc
            calls = []

            class ConnectionProbe:
                def __init__(self, con, name):
                    self.con, self.name = con, name

                def execute(self, sql):
                    assert svc.access_lock.owned()
                    calls.append((self.name, sql))
                    return self.con.execute(sql)

            with monkeypatch.context() as patch:
                patch.setattr(svc.cat, "con", ConnectionProbe(svc.cat.con, "catalog"))
                patch.setattr(svc.store, "con", ConnectionProbe(svc.store.con, "observations"))
                response = client.get("/health")
            assert response.status_code == 200
            assert calls == [("catalog", "SELECT 1"), ("observations", "SELECT 1")]

    @pytest.mark.parametrize("store", ["cat", "store"])
    def test_health_503_when_store_probe_raises(self, tmp_path, monkeypatch, store):
        with client_for(tmp_path) as client:
            svc = client.app.state.host.svc

            class FailedConnection:
                def execute(self, sql):
                    assert svc.access_lock.owned()
                    raise OSError("PRIVATE-PAYLOAD must not escape")

            with monkeypatch.context() as patch:
                patch.setattr(getattr(svc, store), "con", FailedConnection())
                response = client.get("/health")
            assert response.status_code == 503
            assert response.json() == {
                "status": "unavailable", "data_ready": False,
                "version": VERSION, "reason": "OSError",
            }
            assert client.get("/health").status_code == 200

    def test_health_503_after_service_closed(self, tmp_path):
        with client_for(tmp_path) as client:
            client.app.state.host.svc.close()
            response = client.get("/health")
            assert response.status_code == 503
            assert response.json() == {
                "status": "unavailable", "data_ready": False,
                "version": VERSION, "reason": "ServiceClosed",
            }

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
    def test_listening_sockets_of_pid_are_loopback_only(self, tmp_path):
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
            addresses = listening_addresses(proc.pid)
            assert addresses, "netstat 未找到该宿主的 LISTENING 行，不得空集通过"
            assert set(addresses) == {"127.0.0.1"}
            request = urllib.request.Request(f"http://127.0.0.1:{info['port']}/shutdown", data=b"{}",
                                             headers={"Authorization": f"Bearer {TOKEN}"}, method="POST")
            with urllib.request.urlopen(request, timeout=5) as response:
                assert response.status == 200
            assert proc.wait(5) == 0
        finally:
            if proc.poll() is None:
                proc.kill()
            proc.wait(15)


class TestPackagedSmokeChecks:
    @pytest.mark.parametrize("status,body,ready", [
        (200, {"status": "ok", "data_ready": True}, True),
        (503, {"status": "ok", "data_ready": True}, False),
        (200, {"status": "unavailable", "data_ready": True}, False),
        (200, {"status": "ok", "data_ready": False}, False),
        (200, {"status": "ok", "data_ready": 1}, False),
    ])
    def test_readiness_requires_actual_health_success(self, tmp_path, status, body, ready):
        import threading
        from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
        from types import SimpleNamespace

        hits = []

        class HealthHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                hits.append(self.path)
                self.send_response(status)
                self.end_headers()
                self.wfile.write(json.dumps(body).encode())

            def log_message(self, *args):
                pass

        server = ThreadingHTTPServer(("127.0.0.1", 0), HealthHandler)
        worker = threading.Thread(target=server.serve_forever)
        worker.start()
        endpoint = tmp_path / "host.json"
        info = {"port": server.server_port}
        endpoint.write_text(json.dumps(info), encoding="utf-8")
        try:
            result = wait_for_health(SimpleNamespace(poll=lambda: None), endpoint, timeout=0.25)
            assert result == (info if ready else None)
            assert hits
            assert set(hits) == {"/health"}
        finally:
            server.shutdown()
            server.server_close()
            worker.join(5)
            assert not worker.is_alive()

    @pytest.mark.parametrize("entry", [
        "data.duckdb", "data.duckdb.wal", "catalog.sqlite", "profile.bin", "eia_api_key.bin",
        "creds/", "profile/", "host.json", "mcp_endpoint.json", "shell-prefs.json", "private.log",
        ".env", ".env.local", "vendor/tests/", "pytest/", "_pytest/", "pytest-9.dist-info/",
        "node_modules/electron-builder/", ".git/",
    ])
    def test_package_blacklist_has_no_third_party_exemption(self, tmp_path, entry):
        path = tmp_path / entry
        if entry.endswith("/"):
            path.mkdir(parents=True)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b"fixture")
        assert entry.rstrip("/") in package_exclusions(tmp_path)

    def test_clean_package_scan(self, tmp_path):
        (tmp_path / "futuresai-backend.exe").write_bytes(b"fixture")
        (tmp_path / "_internal").mkdir()
        assert package_exclusions(tmp_path) == []
