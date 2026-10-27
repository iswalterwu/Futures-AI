"""第二十轮双审 P3 与测试缺口的回归测试（tasks.md T-94~T-97）。

- R20-A P3-1/P3-2、R20-B-01：响应头/分块帧/Connection: close 阶段受统一截止时间约束（在看门狗测试同处）
- R20-A P3-3、R20-B-02：截止处占用消息、冷启动自动清理、关闭检查顺序、serve 错误仍到 stderr
"""
from __future__ import annotations

import os
import socket
import subprocess
import sys
import threading
import time
from datetime import timedelta
from pathlib import Path

import pytest

from data import cli
from data.lock import LockBusy, read_endpoint
from data.service import Service
from data.store.duck import utcnow

from test_review_round12 import SC0, cli_run
from test_review_round19 import statuses
from test_serve_e2e import _free_port

BACKEND = Path(__file__).resolve().parent.parent
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))


class TestDeadlineBusyMessage:
    """R20-A P3-3 / R20-B-02：截止时间处的占用消息分支（连续 LockBusy 且始终无写锁）。"""

    def test_deadline_reports_busy_message(self, tmp_path, monkeypatch, capsys):
        Service(tmp_path).init().close()
        real_service = cli.Service
        monkeypatch.setattr(cli, "READ_WAIT_S", 0.6)
        monkeypatch.setattr(cli, "EXTERNAL_BUSY_S", 999)  # 关闭提前失败，强制走截止分支

        def always_busy(root, readonly=False, **kw):
            if readonly:
                raise LockBusy("数据目录被其他进程占用（观测库正被打开），请稍后重试")
            return real_service(root, readonly=readonly, **kw)

        monkeypatch.setattr(cli, "Service", always_busy)
        assert cli_run(tmp_path, "list", "sources") == 1
        err = capsys.readouterr().err
        assert "占用" in err and "尚未提供只读通道" not in err


class TestColdStartCleanup:
    """R20-B-02：冷启动经 init() 自动清理超时 running 批次（而非测试直接调用清理函数）。"""

    def test_init_cleans_stale_running_automatically(self, tmp_path):
        svc = Service(tmp_path).init()
        try:
            rid = svc.store.new_run("akshare", SC0, None, None, "cny_bbl", "1d", "Asia/Shanghai")
            svc.store.con.execute(
                "UPDATE ingest_runs SET started_at=? WHERE ingest_run=?",
                [utcnow() - timedelta(hours=2), rid],
            )
        finally:
            svc.close()
        svc = Service(tmp_path).init()  # 冷启动入口
        try:
            assert statuses(svc) == ["failed"]
        finally:
            svc.close()


class TestClosedCheckOrder:
    """R20-B-02：关闭标志必须在取到访问锁之后检查（否则排队者在关库后仍会进入）。"""

    def test_closed_checked_after_acquire(self):
        from data.service import _AccessGuard

        log: list[str] = []

        class Recorder:
            def __init__(self, real):
                self.real = real

            def acquire(self, *a, **k):
                log.append("acquire")
                return self.real.acquire(*a, **k)

            def release(self):
                log.append("release")
                return self.real.release()

            def _is_owned(self):
                return self.real._is_owned()

            def __enter__(self):
                return self.real.__enter__()

            def __exit__(self, *e):
                return self.real.__exit__(*e)

        class ProbeClosed:
            def __bool__(self):
                log.append("closed-check")
                return False

        guard = _AccessGuard()
        guard._lock = Recorder(threading.RLock())
        guard._closed = ProbeClosed()
        with guard:
            pass
        assert log[:2] == ["acquire", "closed-check"], log

    def test_queued_waiter_sees_closed_state(self):
        """取锁后关闭：仍在排队的等待者拿到锁时必须被拒绝。"""
        from data.service import _AccessGuard, ServiceClosed

        guard = _AccessGuard()
        held, release = threading.Event(), threading.Event()
        outcome: list[str] = []

        def holder():
            with guard:
                held.set()
                release.wait(10)

        t1 = threading.Thread(target=holder, daemon=True)
        t1.start()
        assert held.wait(5)

        def waiter():
            try:
                with guard:
                    outcome.append("entered")
            except ServiceClosed:
                outcome.append("closed")

        t2 = threading.Thread(target=waiter, daemon=True)
        t2.start()
        time.sleep(0.2)  # 确保 waiter 已在排队
        release.set()  # holder 释放 → waiter 取得锁（此时尚未置关闭）
        t1.join(5)
        t2.join(5)
        assert outcome == ["entered"]  # 正常路径：关闭前排队者可以进入
        guard._closed = True
        with pytest.raises(ServiceClosed):
            with guard:
                pass


class TestServeErrorsVisible:
    """R20-A P3-4 / R20-B-02：WARNING 级别下真实错误仍输出到 stderr，stdout 保持为空。"""

    def test_invalid_request_warning_reaches_stderr(self, tmp_path):
        root = tmp_path / "root"
        port = _free_port()
        err_path = tmp_path / "serve.err"
        env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))
        with open(err_path, "w", encoding="utf-8") as err:
            proc = subprocess.Popen(
                [sys.executable, "-m", "data.cli", "--root", str(root), "serve", "--port", str(port)],
                cwd=str(BACKEND), env=env, stdout=subprocess.PIPE, stderr=err,
            )
            try:
                deadline = time.monotonic() + 90
                while time.monotonic() < deadline and proc.poll() is None:
                    if read_endpoint(root / "data"):
                        try:
                            socket.create_connection(("127.0.0.1", port), timeout=1).close()
                            break
                        except OSError:
                            pass
                    time.sleep(0.3)
                with socket.create_connection(("127.0.0.1", port), timeout=5) as s:  # 非法 HTTP 请求
                    s.sendall(b"\x00\x00\x00\x00\r\n\r\n")
                    time.sleep(0.3)
                time.sleep(1.0)
            finally:
                proc.kill()
                out, _ = proc.communicate(timeout=30)
        assert out.strip() == b"", out[:300]
        stderr = err_path.read_text(encoding="utf-8", errors="replace")
        assert "Invalid HTTP request" in stderr, stderr[-800:]
