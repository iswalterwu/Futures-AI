"""真实宿主启动拒绝：独占锁、临时目录 ACL、存储边界故障（无上游请求）。"""
from __future__ import annotations

import errno
import os
import socket
import subprocess
import time
import sys
from pathlib import Path

import pytest

from app.__main__ import main, startup_failure
from data.service import Service
from data.store.duck import DuckStore
from test_app_lifecycle import BACKEND, TOKEN, _start, _wait_ready, _post_shutdown


def _run(root, *extra):
    return subprocess.run(
        [sys.executable, "-m", "app", "--root", str(root), "--token", TOKEN, *extra],
        cwd=BACKEND, env={**os.environ, "PYTHONIOENCODING": "utf-8"},
        capture_output=True, text=True, encoding="utf-8", timeout=10,
    )


def _marker(output):
    import json

    lines = [line for line in output.splitlines() if line.startswith("FAI_HOST ")]
    assert len(lines) == 1
    result = json.loads(lines[0].removeprefix("FAI_HOST "))
    assert result["event"] == "startup_failed"
    assert TOKEN not in output
    return result


def test_locked_root_exits_3_with_marker(tmp_path):
    svc = Service(tmp_path).init()
    try:
        result = _run(tmp_path)
        assert result.returncode == 3
        marker = _marker(result.stdout)
        assert marker["code"] == "data_root_locked"
        assert marker["path"] == str(tmp_path)
        assert str(os.getpid()) in marker["detail"]
        assert (tmp_path / "data" / ".lock").exists()
        assert TOKEN not in result.stderr
    finally:
        svc.close()


def test_unwritable_root_exits_3_with_marker(tmp_path):
    # 只改本测试新建的目录，不改父目录、仓库或真实用户目录。
    root = tmp_path / "denied"
    root.mkdir()
    identity = subprocess.check_output(["whoami"], text=True).strip()
    try:
        subprocess.run(["icacls", str(root), "/deny", f"{identity}:(OI)(CI)(W)"],
                       check=True, capture_output=True)
        # ACL 命令成功不等于真的拒写；先验证操作系统行为。
        with pytest.raises(PermissionError):
            (root / "write-probe").write_text("probe", encoding="utf-8")
        result = _run(root)
        assert result.returncode == 3
        marker = _marker(result.stdout)
        assert marker["code"] == "data_root_unwritable"
        assert marker["path"] == str(root)
        assert not (root / "data" / ".lock").exists()
    finally:
        subprocess.run(["icacls", str(root), "/remove:d", identity],
                       check=True, capture_output=True)
        probe = root / "restored-probe"
        probe.write_text("restored", encoding="utf-8")
        probe.unlink()


def test_enospc_classified_disk_full(tmp_path, monkeypatch, capsys):
    original = Path.mkdir

    def full(path, *args, **kwargs):
        if path == tmp_path / "data":
            raise OSError(errno.ENOSPC, "PRIVATE filesystem payload")
        return original(path, *args, **kwargs)

    monkeypatch.setattr(Path, "mkdir", full)
    assert main(["--root", str(tmp_path), "--token", TOKEN]) == 3
    output = capsys.readouterr()
    assert _marker(output.out)["code"] == "disk_full"
    assert "PRIVATE" not in output.out + output.err
    assert not (tmp_path / "data" / ".lock").exists()


def test_unknown_error_marker_has_type_only(tmp_path):
    data = tmp_path / "data"
    data.mkdir()
    (data / "catalog.sqlite").write_bytes(b"PRIVATE not a sqlite database")
    result = _run(tmp_path)
    assert result.returncode == 3
    assert _marker(result.stdout)["code"] == "startup_internal"
    assert _marker(result.stdout)["detail"] == "DatabaseError"
    assert "PRIVATE" not in result.stdout + result.stderr
    assert not (data / ".lock").exists()


def test_init_failure_closes_stores_and_releases_lock(tmp_path, monkeypatch, capsys):
    def full(store):
        raise OSError(errno.ENOSPC, "PRIVATE store failure")

    with monkeypatch.context() as patch:
        patch.setattr(DuckStore, "stale_running", full)
        assert main(["--root", str(tmp_path)]) == 3
    assert _marker(capsys.readouterr().out)["code"] == "disk_full"
    assert not (tmp_path / "data" / ".lock").exists()
    svc = Service(tmp_path).init()
    svc.close()


def test_two_hosts_get_distinct_ports(tmp_path):
    processes = []
    try:
        infos = []
        for name in ("first", "second"):
            root = tmp_path / name
            root.mkdir()
            endpoint = root / "host.json"
            proc = _start(root, endpoint)
            processes.append(proc)
            infos.append(_wait_ready(proc, endpoint))
        assert infos[0]["port"] != infos[1]["port"]
        assert all(proc.poll() is None for proc in processes)
        for info in infos:
            _post_shutdown(info["port"])
        for proc in processes:
            assert proc.wait(10) == 0
    finally:
        for proc in processes:
            if proc.poll() is None:
                proc.kill()
            proc.wait(15)


def test_explicit_busy_port_exits_3_port_in_use(tmp_path):
    with socket.socket() as occupied:
        occupied.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        occupied.bind(("127.0.0.1", 0))
        occupied.listen()
        start = time.monotonic()
        result = _run(tmp_path, "--port", str(occupied.getsockname()[1]))
        assert time.monotonic() - start < 10
        assert result.returncode == 3
        assert _marker(result.stdout)["code"] == "port_in_use"
        assert not (tmp_path / "data" / ".lock").exists()
    svc = Service(tmp_path).init()
    svc.close()


@pytest.mark.parametrize("number,code", [
    (errno.EACCES, "data_root_unwritable"), (errno.EPERM, "data_root_unwritable"),
    (errno.EROFS, "data_root_unwritable"), (errno.ENOSPC, "disk_full"),
])
def test_wrapped_oserror_classification(tmp_path, number, code):
    outer = RuntimeError("PRIVATE wrapper")
    outer.__cause__ = OSError(number, "PRIVATE cause")
    actual, detail = startup_failure(outer, tmp_path)
    assert actual == code
    assert "PRIVATE" not in detail


@pytest.mark.parametrize("number,code", [(5, "data_root_unwritable"), (19, "data_root_unwritable"),
                                         (39, "disk_full"), (112, "disk_full")])
def test_wrapped_winerror_classification(tmp_path, number, code):
    cause = OSError("PRIVATE")
    cause.winerror = number
    outer = RuntimeError("PRIVATE wrapper")
    outer.__cause__ = cause
    assert startup_failure(outer, tmp_path)[0] == code
