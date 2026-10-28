"""第十七轮审核员 B 发现（R17-B-01 P2 与 P3、测试缺口）的回归测试（tasks.md T-74~T-79）。"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest

from data import cli, creds, mcp_server
from data.lock import read_endpoint, write_endpoint
from data.service import Service

from test_review_round12 import cli_run

BACKEND = Path(__file__).resolve().parent.parent
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))


def http_get(port: int, path: str, token: str, timeout: float = 30.0):
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))


def channel_threads() -> list[threading.Thread]:
    return [t for t in threading.enumerate() if t.name == "readonly-channel" and t.is_alive()]


def wait_for(path: Path, timeout: float = 60.0) -> None:
    deadline = time.monotonic() + timeout
    while not path.exists():
        assert time.monotonic() < deadline, f"等待超时：{path.name}"
        time.sleep(0.02)






class TestRouteRetry:
    """T-76 / R17-B-03：同一端点一次失败后在截止时间内间隔重试，恢复即成功。"""

    def test_same_endpoint_recovers_within_deadline(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        writer = Service(tmp_path)
        try:
            write_endpoint(tmp_path / "data", 1, "tok")
            calls = []

            def flaky(*a, **k):
                calls.append(1)
                if len(calls) <= 2:
                    raise ConnectionRefusedError("[WinError 10061] refused (injected)")
                return {"sources": [{"adapter_id": "akshare"}]}

            monkeypatch.setattr(cli, "_internal_get", flaky)
            t0 = time.monotonic()
            assert cli_run(tmp_path, "list", "sources") == 0
            assert len(calls) == 3 and time.monotonic() - t0 < 10
            assert json.loads(capsys.readouterr().out)["sources"][0]["adapter_id"] == "akshare"
        finally:
            writer.close()


class TestServeShutdown:
    """T-77 / R17-B-04：serve 的正常停服（SystemExit(0)）是退出契约的例外：清理后返回 0。"""

    def test_system_exit_zero_is_clean_shutdown(self, tmp_path, monkeypatch):
        from mcp.server.fastmcp import FastMCP

        def clean_exit(self, transport=None, **kw):
            raise SystemExit(0)

        monkeypatch.setattr(FastMCP, "run", clean_exit)
        monkeypatch.setattr(cli, "_install_exit_signals", lambda: None)
        assert cli_run(tmp_path, "serve", "--port", "18994") == 0
        assert not (tmp_path / "data" / ".lock").exists()
        assert read_endpoint(tmp_path / "data") is None




# 引导脚本：os.replace 闸门（到达后报到、等放行）；存在 <me>-fail 标记时替换失败
BOOT_GATED_REPLACE_FAIL = r'''
import os, sys, time
from pathlib import Path

flags, me = Path(sys.argv[1]), sys.argv[2]
real_replace = os.replace


def gated(src, dst):
    (flags / f"{me}-ready").write_text("1", encoding="utf-8")
    while not (flags / f"{me}-go").exists():
        time.sleep(0.02)
    if (flags / f"{me}-fail").exists():
        raise PermissionError("target locked (injected)")
    return real_replace(src, dst)


os.replace = gated
from data import cli

sys.exit(cli.main(sys.argv[3:]))
'''


class TestCredentialFailures:
    """T-79 / AC-009-1：部分写入后失败、双写者交错且一方替换失败——旧值/成功者的值保持，只清理自身临时文件。"""

    def test_partial_write_failure(self, tmp_path, monkeypatch):
        cdir = tmp_path / "creds"
        creds.put(cdir, "eia_api_key", "k-" + "old-0001")
        real_write = os.write
        state = {"n": 0}

        def partial(fd, data):
            if state["n"] == 0:
                state["n"] += 1
                return real_write(fd, bytes(data[:7]))  # 先写进 7 字节
            raise OSError(28, "No space left on device (injected)")

        with monkeypatch.context() as m:
            m.setattr(creds.os, "write", partial)
            with pytest.raises(creds.CredsError):
                creds.put(cdir, "eia_api_key", "k-" + "new-0002")
        assert state["n"] == 1
        assert creds.get(cdir, "eia_api_key") == "k-" + "old-0001"
        assert sorted(p.name for p in cdir.iterdir()) == ["eia_api_key.bin"]

    def test_interleaved_one_replace_fails(self, tmp_path):
        boot = tmp_path / "boot.py"
        boot.write_text(BOOT_GATED_REPLACE_FAIL, encoding="utf-8")
        flags = tmp_path / "flags"
        flags.mkdir()
        root = tmp_path / "root"
        value_a, value_b = "k-" + "proc-a-0003", "k-" + "proc-b-0004"

        def start(me, value):
            return subprocess.Popen(
                [sys.executable, str(boot), str(flags), me,
                 "--root", str(root), "config", "credentials", "eia_api_key", value],
                cwd=str(BACKEND), env=ENV, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                text=True, encoding="utf-8", errors="replace",
            )

        a = start("A", value_a)
        wait_for(flags / "A-ready")
        b = start("B", value_b)
        wait_for(flags / "B-ready")
        try:
            (flags / "B-fail").write_text("1", encoding="utf-8")
            (flags / "A-go").write_text("1", encoding="utf-8")
            out_a = a.communicate(timeout=60)
            assert a.returncode == 0, out_a
            (flags / "B-go").write_text("1", encoding="utf-8")
            _, err_b = b.communicate(timeout=60)
            assert b.returncode == 1 and "凭证写入失败" in err_b
            assert creds.get(root / "creds", "eia_api_key") == value_a  # 失败方不改变有效凭证
            assert sorted(p.name for p in (root / "creds").iterdir()) == ["eia_api_key.bin"]
        finally:
            for p in (a, b):
                if p.poll() is None:
                    p.kill()
