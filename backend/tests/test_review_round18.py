"""第十八轮双审发现（A P2-1、B R18-B-01/B-02 三项 P2 与 P3、测试缺口）的回归测试（tasks.md T-81~T-88）。"""
from __future__ import annotations

import inspect
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

import duckdb
import pandas as pd
import pytest

from data import cli, mcp_server, service as service_mod
from data.adapters.akshare import akshare_adapter as ak_mod
from data.catalog.db import CatalogDB
from data.lock import LockBusy, read_endpoint, write_endpoint
from data.service import Service, ServiceClosed

from test_review_round12 import SC0, cli_run, main_df

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


def statuses(svc) -> list[str]:
    return [r[0] for r in svc.store.con.execute(
        "SELECT status FROM ingest_runs ORDER BY ingest_run").fetchall()]


# 读者进程：循环执行真实 CLI 只读命令，统计失败，直到出现停止标记
READER_LOOP = r'''
import contextlib, io, json, sys
from pathlib import Path

from data import cli

root, stop, out = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
runs = fails = 0
errs = []
while not stop.exists():
    o, e = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(o), contextlib.redirect_stderr(e):
        rc = cli.main(["--root", root, "list", "sources"])
    runs += 1
    if rc != 0:
        fails += 1
        errs.append([o.getvalue()[-300:], e.getvalue()[-300:]])
out.write_text(json.dumps({"runs": runs, "fails": fails, "errs": errs[:5]}), encoding="utf-8")
'''




class TestShutdownBarrier:
    """T-82 / R18-B-01：关库后迟到的数据访问在触碰连接前即被拒绝；强制停服后排队请求只得 200 或 503。"""

    def test_access_after_close_rejected(self, tmp_path):
        svc = Service(tmp_path).init()
        svc.close()
        for call in (lambda: svc.list_sources(), lambda: svc.search("sc"), lambda: svc.fetch(SC0, do_fetch=False)):
            with pytest.raises(ServiceClosed) as ei:
                call()
            assert ei.value.code == "internal" and "已关闭" in ei.value.message


    # 关闭屏障的 503 路径（服务端真实 503 + CLI 回退）由 test_review_round19.py::TestClosedEndpoint 确定性覆盖


class _BeginInterrupt:
    """DuckDB 连接代理：真实 BEGIN 生效后、返回调用者前抛出退出类异常（一次）。"""

    def __init__(self, con, exc):
        self._con, self._exc, self.fired = con, exc, False

    def execute(self, sql, *a, **k):
        res = self._con.execute(sql, *a, **k)
        if sql == "BEGIN" and not self.fired:
            self.fired = True
            raise self._exc()
        return res

    def __getattr__(self, name):
        return getattr(self._con, name)


class TestBeginInterrupt:
    """T-83 / R18-B-02：BEGIN 纳入回滚保护：刚生效即中断也回滚，失败状态独立提交，连接可继续使用。"""

    @pytest.mark.parametrize("exc", [KeyboardInterrupt, SystemExit])
    def test_interrupt_right_after_begin(self, tmp_path, monkeypatch, exc):
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df(1.0, "2026-10-01"))
        svc = Service(tmp_path).init()
        try:
            svc.fetch(SC0, do_fetch=True)
            proxy = _BeginInterrupt(svc.store.con, exc)
            svc.store.con = proxy
            monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df(9.0, "2026-10-02"))
            with pytest.raises(exc):
                svc.fetch(SC0, do_fetch=True)
            svc.store.con = proxy._con
            assert proxy.fired and statuses(svc) == ["succeeded", "failed"]
            assert svc.store.count_obs(SC0) == 1
            monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df(5.0, "2026-10-05"))
            assert svc.fetch(SC0, do_fetch=True)["meta"]["count"] == 2  # 无遗留事务，继续取数成功
        finally:
            svc.close()
        svc = Service(tmp_path).init()
        try:
            assert statuses(svc) == ["succeeded", "failed", "succeeded"]  # 失败状态已独立提交
        finally:
            svc.close()


class TestRouteDeadline:
    """T-84 / R18-B-03 与 R18-A P3-1：单次路由超时受统一截止时间约束；端点中途消失继续等待。"""

    def test_hanging_endpoint_bounded_by_deadline(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        srv = socket.socket()
        srv.bind(("127.0.0.1", 0))
        srv.listen()
        conns = []
        stop = threading.Event()

        def accept_never_reply():
            srv.settimeout(0.2)
            while not stop.is_set():
                try:
                    conns.append(srv.accept()[0])
                except OSError:
                    pass

        t = threading.Thread(target=accept_never_reply, daemon=True)
        t.start()
        writer = Service(tmp_path)
        try:
            write_endpoint(tmp_path / "data", srv.getsockname()[1], "tok")
            monkeypatch.setattr(cli, "READ_WAIT_S", 3)
            t0 = time.monotonic()
            assert cli_run(tmp_path, "list", "sources") == 1
            elapsed = time.monotonic() - t0
            assert 2.5 <= elapsed < 6  # 不会因单次 10s 超时越过 3s 截止时间
            assert "无响应" in capsys.readouterr().err
        finally:
            stop.set()
            t.join(5)
            for c in conns:
                c.close()
            srv.close()
            writer.close()

    def test_endpoint_vanishing_mid_loop_keeps_waiting(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        writer = Service(tmp_path)
        calls = []

        def vanishing(data_dir):
            calls.append(1)
            return {"port": 1, "token": "tok"} if len(calls) == 1 else None  # 第一次读到，随后消失

        monkeypatch.setattr(cli, "read_endpoint", vanishing)
        threading.Timer(1.0, writer.close).start()
        assert cli_run(tmp_path, "list", "sources") == 0  # 继续等待 → 写锁释放后本地读取
        assert json.loads(capsys.readouterr().out)["sources"]


class TestRuntimeFileRemoval:
    """T-85 / R18-A P3-2：端点/写锁文件删除遇共享冲突短暂重试；serve 停服不因端点删除失败而报错。"""

    def test_serve_clean_stop_despite_endpoint_removal_failure(self, tmp_path, monkeypatch):
        from mcp.server.fastmcp import FastMCP

        def stop(self, transport=None, **kw):
            raise KeyboardInterrupt  # 正常停服

        def locked(*a, **k):
            raise PermissionError("endpoint file in use (injected)")

        monkeypatch.setattr(FastMCP, "run", stop)
        monkeypatch.setattr(cli, "_install_exit_signals", lambda: None)
        monkeypatch.setattr(cli, "remove_endpoint", locked)
        assert cli_run(tmp_path, "serve", "--port", "18993") == 0
        assert not (tmp_path / "data" / ".lock").exists()

    @pytest.mark.parametrize("target", ["mcp_endpoint.json", ".lock"])
    def test_transient_sharing_violation_retried(self, tmp_path, monkeypatch, target):
        from data import lock

        svc = Service(tmp_path).init()  # 持写锁
        data_dir = tmp_path / "data"
        write_endpoint(data_dir, 1, "tok")
        orig = Path.unlink
        fails = {"n": 0}

        def flaky(self, missing_ok=False):
            if self.name == target and fails["n"] < 2:
                fails["n"] += 1
                raise PermissionError("[WinError 32] in use (injected)")
            return orig(self, missing_ok=missing_ok)

        monkeypatch.setattr(Path, "unlink", flaky)
        if target == ".lock":
            svc.close()
        else:
            lock.remove_endpoint(data_dir, "tok")
            svc.close()
        assert fails["n"] == 2 and not (data_dir / target).exists()




class _GuardedConnection:
    """连接代理：每次数据访问断言当前线程持有 service 访问锁。"""

    def __init__(self, con, owned, violations, label):
        self._con, self._owned, self._violations, self._label = con, owned, violations, label

    def _check(self, op, args):
        if not self._owned():
            self._violations.append((self._label, op, str(args[0])[:60] if args else ""))

    def execute(self, *a, **k):
        self._check("execute", a)
        return self._con.execute(*a, **k)

    def executemany(self, *a, **k):
        self._check("executemany", a)
        return self._con.executemany(*a, **k)

    def commit(self):
        self._check("commit", ())
        return self._con.commit()

    def rollback(self):
        self._check("rollback", ())
        return self._con.rollback()

    def __getattr__(self, name):
        return getattr(self._con, name)


class TestLockCoverage:
    """T-87：CLI 写命令（含 import 向导复用模板、add-source、取数、配置）的全部数据访问都持访问锁。"""

    def test_all_db_access_under_access_lock(self, tmp_path, monkeypatch):
        violations: list = []
        real_open = Service._open_stores

        def guarded_open(self):
            cat, store = real_open(self)
            owned = lambda: self._access_lock.owned()  # noqa: E731
            cat.con = _GuardedConnection(cat.con, owned, violations, "catalog")
            store.con = _GuardedConnection(store.con, owned, violations, "store")
            return cat, store

        monkeypatch.setattr(Service, "_open_stores", guarded_open)
        reads = []

        def answer(prompt=""):
            reads.append(prompt[:12])  # 向导等待输入的每一处
            return "y" if "模板 id" not in prompt else ""

        monkeypatch.setattr("builtins.input", answer)
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df(1.0, "2026-10-01"))
        Service(tmp_path).init().close()
        f1, f2 = tmp_path / "a.csv", tmp_path / "b.csv"
        f1.write_text("日期,收盘价\n2026-10-01,70.5\n", encoding="utf-8")
        f2.write_text("日期,收盘价\n2026-10-02,71.0\n", encoding="utf-8")
        assert cli_run(tmp_path, "import", str(f1)) == 0
        assert cli_run(tmp_path, "import", str(f2)) == 0  # 复用模板：确认 → 复用 → 模板 id
        assert cli_run(tmp_path, "config", "add-source", "my-src") == 0
        assert cli_run(tmp_path, "fetch", SC0) == 0
        assert cli_run(tmp_path, "config", "disable", "eia") == 0
        assert violations == []
        assert len(reads) >= 5  # 两次导入的全部等待输入点


class TestRealtimeSignature:
    """T-88 / AC-004-4：realtime 接口签名参数固定为 (descriptor, on_update)。"""

    def test_signature_parameters(self):
        from data.adapters.akshare.akshare_adapter import AkshareAdapter
        from data.adapters.base import Adapter
        from data.adapters.eia.eia_adapter import EiaAdapter
        from data.adapters.local_file.local_file_adapter import LocalFileAdapter

        for cls in (Adapter, AkshareAdapter, EiaAdapter, LocalFileAdapter):
            assert list(inspect.signature(cls.realtime_signature).parameters) == ["self", "descriptor", "on_update"]
