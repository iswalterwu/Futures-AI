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


class TestChannelDrain:
    """T-74 / R17-B-01：写命令退出时先等在途只读请求完成，再在访问锁保护下关库、释放写锁。"""

    def test_writer_exit_waits_for_inflight_read(self, tmp_path, monkeypatch):
        from data.catalog.db import CatalogDB

        Service(tmp_path).init().close()
        write_done, entered, gate = threading.Event(), threading.Event(), threading.Event()
        real_has_table = CatalogDB.has_table

        def gated_has_table(self, name):  # 只读请求在持有访问锁期间停住（超过旧实现 join(5) 的上限）
            if threading.current_thread() is not threading.main_thread() and not entered.is_set():
                entered.set()
                assert gate.wait(30)
            return real_has_table(self, name)

        real_run_write = cli._run_write

        def run_write_then_hold(svc, root, args):
            rc = real_run_write(svc, root, args)
            write_done.set()
            assert entered.wait(30)  # 写命令的数据访问已结束，只读请求正持锁在途
            return rc

        monkeypatch.setattr(CatalogDB, "has_table", gated_has_table)
        monkeypatch.setattr(cli, "_run_write", run_write_then_hold)
        result = {}

        def reader():
            assert write_done.wait(30)
            ep = read_endpoint(tmp_path / "data")
            result["resp"] = http_get(ep["port"], "/internal/sources", ep["token"], timeout=60)

        t = threading.Thread(target=reader, daemon=True)
        t.start()
        releaser = threading.Timer(6.0, gate.set)
        releaser.start()
        try:
            t0 = time.monotonic()
            assert cli_run(tmp_path, "config", "disable", "eia") == 0
            elapsed = time.monotonic() - t0
            t.join(30)
            status, body = result["resp"]
            assert status == 200 and body["sources"]  # 在途读取完成，未撞上已关闭的连接
            assert elapsed >= 5.5  # 写命令等到在途读取结束才关库退出
            assert not (tmp_path / "data" / ".lock").exists()
            assert read_endpoint(tmp_path / "data") is None
        finally:
            gate.set()
            releaser.cancel()


    def test_close_waits_for_access_lock(self, tmp_path):
        """Service.close() 在访问锁保护下关库：持锁的在途访问结束前不关。"""
        svc = Service(tmp_path).init()
        held, release, errors = threading.Event(), threading.Event(), []

        def holder():
            with svc.access_lock:
                held.set()
                release.wait(10)
                try:
                    svc.cat.has_table("sources")  # 仍在持锁：连接必须可用
                except Exception as e:
                    errors.append(e)

        t = threading.Thread(target=holder, daemon=True)
        t.start()
        assert held.wait(5)
        threading.Timer(1.0, release.set).start()
        t0 = time.monotonic()
        svc.close()
        assert time.monotonic() - t0 >= 0.8
        t.join(5)
        assert errors == []

    def test_channel_exit_drains_inflight_request(self, tmp_path, monkeypatch):
        """通道退出等在途请求完成（不以固定 5s 为界），退出后后台线程已结束。"""
        svc = Service(tmp_path).init()
        gate, entered, result = threading.Event(), threading.Event(), {}
        real_list = svc.list_sources

        def slow_list():
            entered.set()
            assert gate.wait(30)
            return real_list()

        monkeypatch.setattr(svc, "list_sources", slow_list)
        releaser = threading.Timer(6.0, gate.set)
        try:
            with mcp_server.readonly_channel(svc, tmp_path / "data") as port:
                token = read_endpoint(tmp_path / "data")["token"]
                t = threading.Thread(
                    target=lambda: result.update(resp=http_get(port, "/internal/sources", token, 60)),
                    daemon=True,
                )
                t.start()
                assert entered.wait(10)
                releaser.start()
            assert channel_threads() == []  # 退出时已等到在途请求完成、服务停止
            t.join(10)
            assert result["resp"][0] == 200 and result["resp"][1]["sources"]
        finally:
            gate.set()
            releaser.cancel()
            svc.close()


class TestChannelCleanup:
    """T-75 / R17-B-02：启动等待中断、端点发布/删除失败都不遗留后台线程；无通道时写命令照常并提示。"""

    def test_publish_failure_degrades_without_thread(self, tmp_path, monkeypatch):
        svc = Service(tmp_path).init()
        try:
            def deny(*a, **k):
                raise PermissionError("endpoint not writable (injected)")

            monkeypatch.setattr(mcp_server, "write_endpoint", deny)
            with mcp_server.readonly_channel(svc, tmp_path / "data") as port:
                assert port is None
                assert channel_threads() == []  # 无人可发现的服务已被停掉
            assert channel_threads() == []
        finally:
            svc.close()

    def test_remove_failure_still_stops_server(self, tmp_path, monkeypatch):
        svc = Service(tmp_path).init()
        try:
            def deny(*a, **k):
                raise PermissionError("endpoint locked (injected)")

            monkeypatch.setattr(mcp_server, "remove_endpoint", deny)
            with mcp_server.readonly_channel(svc, tmp_path / "data") as port:
                assert port and channel_threads()
            assert channel_threads() == []
        finally:
            svc.close()

    def test_interrupted_startup_stops_server(self, tmp_path, monkeypatch):
        svc = Service(tmp_path).init()
        try:
            def interrupted(*a, **k):
                raise KeyboardInterrupt

            monkeypatch.setattr(mcp_server, "_wait_started", interrupted)
            with pytest.raises(KeyboardInterrupt):
                with mcp_server.readonly_channel(svc, tmp_path / "data"):
                    pytest.fail("不应进入通道上下文")
            deadline = time.monotonic() + 10
            while channel_threads() and time.monotonic() < deadline:
                time.sleep(0.05)
            assert channel_threads() == []
            assert read_endpoint(tmp_path / "data") is None
        finally:
            svc.close()

    def test_cli_warns_when_channel_unavailable(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()

        def deny(*a, **k):
            raise PermissionError("endpoint not writable (injected)")

        monkeypatch.setattr(mcp_server, "write_endpoint", deny)
        assert cli_run(tmp_path, "config", "disable", "eia") == 0  # 写命令照常执行
        assert "只读通道未能启动" in capsys.readouterr().err


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


class TestWizardChannel:
    """T-78：import 向导等待输入时不持访问锁，经写进程只读通道的读取即时成功。"""

    def test_reads_served_while_wizard_waits_for_input(self, tmp_path, monkeypatch):
        Service(tmp_path).init().close()
        f = tmp_path / "p.csv"
        f.write_text("日期,收盘价\n2026-10-01,70.5\n", encoding="utf-8")
        reads = []

        def answer(prompt=""):
            ep = read_endpoint(tmp_path / "data")
            t0 = time.monotonic()
            reads.append((http_get(ep["port"], "/internal/sources", ep["token"], timeout=10), time.monotonic() - t0))
            return "y"

        monkeypatch.setattr("builtins.input", answer)
        assert cli_run(tmp_path, "import", str(f)) == 0
        assert len(reads) >= 2  # 目标确认 + 映射确认两处等待输入
        for (status, body), dt in reads:
            assert status == 200 and body["sources"] and dt < 5


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
