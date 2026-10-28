"""宿主持写锁时既有 CLI 复用同端口只读通道，不创建第二个数据服务。"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

import pytest

from data.lock import read_endpoint
from test_app_lifecycle import BACKEND, TOKEN, _start, _wait_ready, _post_shutdown


@pytest.fixture
def running_host(tmp_path):
    port_file = tmp_path / "host.json"
    proc = _start(tmp_path, port_file, "--exit-on-stdin-eof")
    try:
        info = _wait_ready(proc, port_file)
        assert (tmp_path / "data" / ".lock").read_text().strip() == str(proc.pid)
        yield tmp_path, proc, info
    finally:
        proc.stdin.close()
        try:
            proc.wait(5)
        except subprocess.TimeoutExpired:
            proc.kill()
            proc.wait(15)
        assert proc.poll() is not None


def _cli(module, root, *args):
    result = subprocess.run(
        [sys.executable, "-m", module + ".cli", "--root", str(root), *args],
        cwd=BACKEND, env={**os.environ, "PYTHONIOENCODING": "utf-8"},
        capture_output=True, text=True, encoding="utf-8", timeout=10,
    )
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


def test_data_list_sources_via_channel(running_host):
    root, proc, info = running_host
    payload = _cli("data", root, "list", "sources")
    assert {row["adapter_id"] for row in payload["sources"]} >= {"akshare", "eia", "local-file"}
    assert proc.poll() is None
    assert (root / "data" / ".lock").read_text().strip() == str(proc.pid)
    assert read_endpoint(root / "data")["port"] == info["port"]


def test_settings_source_list_via_channel(running_host):
    root, proc, info = running_host
    payload = _cli("settings", root, "source", "list")
    rows = {row["adapter_id"]: row for row in payload["sources"]}
    assert set(rows) >= {"akshare", "eia", "local-file"}
    assert rows["eia"]["path"] == "offline"
    assert proc.poll() is None
    assert (root / "data" / ".lock").read_text().strip() == str(proc.pid)


def test_endpoint_file_removed_after_shutdown(running_host):
    root, proc, info = running_host
    assert (root / "data" / "mcp_endpoint.json").is_file()
    _post_shutdown(info["port"])
    assert proc.wait(5) == 0
    assert not (root / "data" / "mcp_endpoint.json").exists()
    assert not (root / "data" / ".lock").exists()


def test_channel_token_differs_from_shell_token(tmp_path):
    tokens = []
    for iteration in range(2):
        endpoint = tmp_path / "host.json"
        endpoint.unlink(missing_ok=True)
        proc = _start(tmp_path, endpoint, "--exit-on-stdin-eof")
        try:
            info = _wait_ready(proc, endpoint)
            channel = read_endpoint(tmp_path / "data")
            assert channel["port"] == info["port"]
            assert channel["token"] != TOKEN
            tokens.append(channel["token"])
            req = urllib.request.Request(f"http://127.0.0.1:{info['port']}/internal/sources",
                                         headers={"Authorization": f"Bearer {TOKEN}"})
            with pytest.raises(urllib.error.HTTPError) as error:
                urllib.request.urlopen(req, timeout=2)
            assert error.value.code == 403
            req.add_header("Authorization", f"Bearer {channel['token']}")
            with urllib.request.urlopen(req, timeout=2) as response:
                assert response.status == 200
            req = urllib.request.Request(f"http://127.0.0.1:{info['port']}/settings/profile",
                                         headers={"Authorization": f"Bearer {channel['token']}"})
            with pytest.raises(urllib.error.HTTPError) as error:
                urllib.request.urlopen(req, timeout=2)
            assert error.value.code == 401
        finally:
            proc.stdin.close()
            try:
                proc.wait(5)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait(15)
        assert proc.returncode == 0
        assert not (tmp_path / "data" / "mcp_endpoint.json").exists()
    assert tokens[0] != tokens[1]
