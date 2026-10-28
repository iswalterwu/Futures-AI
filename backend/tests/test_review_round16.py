"""第十六轮双审发现（R16-B-01/B-02 两项 P2、Checklist 第 4/9 项与 P3）的回归测试（tasks.md T-67~T-72）。"""
from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

import pandas as pd
import pytest

from data import cli, creds, mcp_server
from data.adapters.akshare import akshare_adapter as ak_mod
from data.fetch.on_demand import FetchError
from data.lock import read_endpoint
from data.service import Service

from test_review_round12 import SC0, SC_RECEIPT, cli_run, freeze_today, main_df
from test_review_round14 import sid_of
from test_serve_e2e import BOOT_SLOW_UPSTREAM

BACKEND = Path(__file__).resolve().parent.parent
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONPATH=str(BACKEND))


def wait_for(path: Path, timeout: float = 60.0) -> None:
    deadline = time.monotonic() + timeout
    while not path.exists():
        assert time.monotonic() < deadline, f"等待超时：{path.name}"
        time.sleep(0.02)


def statuses(svc) -> list[str]:
    return [r[0] for r in svc.store.con.execute(
        "SELECT status FROM ingest_runs ORDER BY ingest_run").fetchall()]


def http_get(port: int, path: str, token: str):
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, None


# 引导脚本：在子进程内把 os.replace 换成“到达后报到、等放行再替换”的闸门，再进入真实 CLI
BOOT_GATED_REPLACE = r'''
import os, sys, time
from pathlib import Path

flags, me = Path(sys.argv[1]), sys.argv[2]
real_replace = os.replace


def gated(src, dst):
    (flags / f"{me}-ready").write_text("1", encoding="utf-8")
    while not (flags / f"{me}-go").exists():
        time.sleep(0.02)
    return real_replace(src, dst)


os.replace = gated
from data import cli

sys.exit(cli.main(sys.argv[3:]))
'''

# 引导脚本：上游调用 0.2s 超时被放弃，被放弃线程 0.6s 时才打印；CLI 返回后再停留，让迟到打印发生在退出前
BOOT_LATE_PRINT = r'''
import sys, time

import pandas as pd

from data.adapters.akshare import akshare_adapter as m

m.AKSHARE_TIMEOUT_S = 0.2


def late(symbol):
    time.sleep(0.6)
    print("LATE-SDK-STDOUT", flush=True)
    return pd.DataFrame({"日期": ["2026-10-01"], "收盘价": [1.0]})


m._get_main = late
from data import cli

rc = cli.main(sys.argv[1:])
time.sleep(1.2)
sys.exit(rc)
'''


class TestCredentialConcurrency:
    """T-67 / R16-B-01：并发保存互不串写；成功即已写入自己的值；失败不改变有效凭证。"""

    def test_interleaved_saves_two_processes(self, tmp_path):
        boot = tmp_path / "boot.py"
        boot.write_text(BOOT_GATED_REPLACE, encoding="utf-8")
        flags = tmp_path / "flags"
        flags.mkdir()
        root = tmp_path / "root"
        value_a, value_b = "k-" + "proc-a-0001", "k-" + "proc-b-0002"

        def start(me, value):
            return subprocess.Popen(
                [sys.executable, str(boot), str(flags), me,
                 "--root", str(root), "config", "credentials", "eia_api_key", value],
                cwd=str(BACKEND), env=ENV, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                text=True, encoding="utf-8", errors="replace",
            )

        a = start("A", value_a)
        wait_for(flags / "A-ready")  # A 已写完自己的临时文件，停在替换前
        b = start("B", value_b)
        wait_for(flags / "B-ready")  # B 也已写完，停在替换前
        try:
            (flags / "A-go").write_text("1", encoding="utf-8")
            out_a = a.communicate(timeout=60)
            assert a.returncode == 0, out_a
            assert creds.get(root / "creds", "eia_api_key") == value_a  # A 成功 = A 自己的值已生效
            (flags / "B-go").write_text("1", encoding="utf-8")
            out_b = b.communicate(timeout=60)
            assert b.returncode == 0, out_b
            assert creds.get(root / "creds", "eia_api_key") == value_b  # 后完成替换者生效
            assert not [p.name for p in (root / "creds").iterdir() if p.suffix == ".tmp"]
        finally:
            for p in (a, b):
                if p.poll() is None:
                    p.kill()


class TestInterruptedCommit:
    """T-68 / R16-B-02：提交事务被退出类异常中断 → 回滚、独立标 failed、原样传播；连接可继续使用。"""

    @pytest.mark.parametrize("exc", [KeyboardInterrupt, SystemExit])
    def test_interrupt_during_commit(self, tmp_path, monkeypatch, exc):
        from data.store import duck as duck_mod

        two_days = pd.DataFrame({"日期": ["2026-10-01", "2026-10-02"], "收盘价": [1.0, 2.0]})
        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: two_days)
        svc = Service(tmp_path).init()
        try:
            svc.fetch(SC0, do_fetch=True)  # 既有成功批次
            real, calls = duck_mod.utcnow, []

            def flaky():
                calls.append(1)
                if len(calls) == 2:  # 1 = new_run；2 = commit_run 事务内（观测已插入、run 未标成功）
                    raise exc()
                return real()

            monkeypatch.setattr(duck_mod, "utcnow", flaky)
            monkeypatch.setattr(
                ak_mod, "_get_main",
                lambda symbol: pd.DataFrame({"日期": ["2026-10-01", "2026-10-03"], "收盘价": [9.0, 3.0]}),
            )
            with pytest.raises(exc):  # 退出类异常原样传播，不被转换
                svc.fetch(SC0, do_fetch=True)
            monkeypatch.setattr(duck_mod, "utcnow", real)
            assert statuses(svc) == ["succeeded", "failed"]
            assert svc.store.count_obs(SC0) == 2  # 同一连接不见部分插入
            assert [r[1] for r in svc.fetch(SC0, do_fetch=False)["rows"]] == [1.0, 2.0]
            monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: main_df(5.0, "2026-10-05"))
            assert svc.fetch(SC0, do_fetch=True)["meta"]["count"] == 3  # 连接可继续取数（无未结束事务）
        finally:
            svc.close()
        svc = Service(tmp_path).init()
        try:
            assert statuses(svc) == ["succeeded", "failed", "succeeded"]  # 重开后失败批次仍为 failed
            assert svc.store.count_obs(SC0) == 3
        finally:
            svc.close()




class TestSdkStdout:
    """T-70 / R16-B-03：SDK 打印按线程改道 stderr（含超时被放弃线程的迟到打印），主线程输出不受影响。"""

    def test_late_print_after_timeout_stays_off_stdout(self, tmp_path):
        boot = tmp_path / "boot.py"
        boot.write_text(BOOT_LATE_PRINT, encoding="utf-8")
        r = subprocess.run(
            [sys.executable, str(boot), "--root", str(tmp_path / "root"), "fetch", SC0],
            cwd=str(BACKEND), env=ENV, capture_output=True, text=True, encoding="utf-8",
            errors="replace", timeout=120,
        )
        assert r.returncode == 1
        err = json.loads(r.stdout)["error"]  # stdout 整体仍是一个 JSON 文档
        assert err["code"] == "adapter_error" and "超时" in err["message"]
        assert "LATE-SDK-STDOUT" in r.stderr and "LATE-SDK-STDOUT" not in r.stdout

    def test_only_sdk_thread_is_routed(self, capsys):
        ak_mod._call_with_timeout(lambda: print("printed-inside-sdk-call"), 5)
        print("printed-by-main-thread")
        out = capsys.readouterr()
        assert out.out == "printed-by-main-thread\n"
        assert "printed-inside-sdk-call" in out.err


class TestExitContract:
    """T-71：参数用法错误 / 退出类异常 / serve 启动失败 / Service 构造中断。"""

    def test_usage_error_exit_code_2(self, tmp_path):
        with pytest.raises(SystemExit) as ei:
            cli.main(["--root", str(tmp_path), "no-such-command"])
        assert ei.value.code == 2

    def test_keyboard_interrupt_propagates_and_cleans_up(self, tmp_path, monkeypatch):
        Service(tmp_path).init().close()

        def interrupted(self, *a, **k):
            raise KeyboardInterrupt

        monkeypatch.setattr(Service, "fetch", interrupted)
        with pytest.raises(KeyboardInterrupt):  # 不被最外层出口转换为 internal
            cli_run(tmp_path, "fetch", SC0)
        assert not (tmp_path / "data" / ".lock").exists()
        assert read_endpoint(tmp_path / "data") is None

    def test_serve_port_in_use(self, tmp_path):
        """真实子进程：端口被占 → 退出码 1，stdout 仅一个结构化错误，不留写锁与端点文件。"""
        root = tmp_path / "root"
        with socket.socket() as busy:
            busy.bind(("127.0.0.1", 0))
            busy.listen()
            port = busy.getsockname()[1]
            r = subprocess.run(
                [sys.executable, "-m", "data.cli", "--root", str(root), "serve", "--port", str(port)],
                cwd=str(BACKEND), env=ENV, capture_output=True, text=True, encoding="utf-8",
                errors="replace", timeout=120,
            )
        assert r.returncode == 1, r.stderr
        err = json.loads(r.stdout)["error"]
        assert err["code"] == "internal" and "启动失败" in err["message"] and str(port) in err["message"]
        assert not (root / "data" / ".lock").exists()
        assert read_endpoint(root / "data") is None

    def test_service_construction_interrupted_releases_lock(self, tmp_path, monkeypatch):
        def interrupted(self):
            raise KeyboardInterrupt

        monkeypatch.setattr(Service, "_open_stores", interrupted)
        with pytest.raises(KeyboardInterrupt):
            Service(tmp_path)
        assert not (tmp_path / "data" / ".lock").exists()


class TestRound16Gaps:
    """T-72：上期所/能源中心 HTTP 边界、倒置窗口消息、package-data 声明。"""

    # 2026-10-20 真实上期所仓单页面（相关品种表格）：SC=3,666,000 桶、FU=40,000 吨
    SHFE_FIXTURE = BACKEND / "tests" / "fixtures" / "shfe_receipt" / "20261020.html"

    @pytest.mark.parametrize("var,sid,expected", [
        ("SC", SC_RECEIPT, (3666.0, "kb")),       # 桶 → 千桶
        ("FU", sid_of("fu", "receipt"), (40.0, "kton")),  # 吨 → 千吨
    ])
    def test_shfe_receipt_through_http_boundary(self, tmp_path, monkeypatch, var, sid, expected):
        import requests

        calls = []
        html = self.SHFE_FIXTURE.read_text(encoding="utf-8")

        class Resp:
            text = html

            def raise_for_status(self):
                pass

        def fake_get(url, headers=None, **kw):
            calls.append(url)
            assert "shfe.com.cn" in url and "dailystock_20261020" in url
            return Resp()

        monkeypatch.setattr(requests, "get", fake_get)
        svc = Service(tmp_path).init()
        try:
            res = svc.fetch(sid, "2026-10-20", "2026-10-20", do_fetch=True)
            assert [(r[0], r[1], r[2]) for r in res["rows"]] == [(datetime(2026, 10, 20), *expected)]
            assert len(calls) == 1  # 仅上期所（含能源中心）页面被请求
        finally:
            svc.close()

    def test_inverted_window_message_has_time(self, tmp_path, monkeypatch):
        freeze_today(monkeypatch)
        svc = Service(tmp_path).init()
        try:
            with pytest.raises(FetchError) as ei:
                svc.fetch(sid_of("pg", "receipt"), "2026-10-27T10:00:00", do_fetch=True)
            assert "2026-10-27 10:00:00" in ei.value.message and "2026-10-27 00:00:00" in ei.value.message
        finally:
            svc.close()

    def test_package_data_declares_manifests(self):
        import tomllib

        pkg = tomllib.loads((BACKEND / "pyproject.toml").read_text(encoding="utf-8"))["tool"]["setuptools"]["package-data"]
        for name in ("akshare", "eia", "local_file"):
            assert "manifest.yaml" in pkg[f"data.adapters.{name}"]
            assert (BACKEND / "data" / "adapters" / name / "manifest.yaml").is_file()
