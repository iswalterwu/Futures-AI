"""settings R-004：数据源状态（spec AC-004-1~3，plan §2.3）。"""
from __future__ import annotations

from pathlib import Path

import pytest

from data import creds
from data.service import Service
from settings import sources


def _by_id(rows):
    return {r["adapter_id"]: r for r in rows}


class TestConsistency:
    def test_same_ids_as_data_layer(self, tmp_path):
        """AC-004-1：与 data-layer 的源列表同口径。"""
        svc = Service(tmp_path).init()
        try:
            expected = {s["adapter_id"] for s in svc.list_sources()["sources"]}
        finally:
            svc.close()
        rows = _by_id(sources.list_with_status(tmp_path))
        assert set(rows) == expected
        for row in rows.values():
            assert {"adapter_id", "name", "enabled", "status", "path"} <= set(row)


class TestPaths:
    def test_builtin_sources_need_no_credential(self, tmp_path):
        rows = _by_id(sources.list_with_status(tmp_path))
        assert rows["akshare"]["path"] == "builtin"
        assert rows["local-file"]["path"] == "builtin"
        assert rows["akshare"]["credential_state"] == "missing"

    def test_eia_missing_credential_is_offline(self, tmp_path):
        """AC-004-3：未配置凭证 → 明确标注免凭证回退。"""
        row = _by_id(sources.list_with_status(tmp_path))["eia"]
        assert row["path"] == "offline"
        assert row["credential_state"] == "missing"
        assert "免凭证回退" in row["reason"]

    def test_eia_with_credential_is_api(self, tmp_path):
        creds.put(tmp_path / "creds", "eia_api_key", "k-" + "status-0001")
        row = _by_id(sources.list_with_status(tmp_path))["eia"]
        assert row["path"] == "api" and row["credential_state"] == "configured"

    def test_eia_unreadable_credential_reports_error(self, tmp_path):
        """AC-004-2：凭证存在但不可读 → 错误状态并给原因（不回退）。"""
        d = tmp_path / "creds"
        d.mkdir(exist_ok=True)
        (d / "eia_api_key.bin").write_bytes(b"not-base64!!!")
        row = _by_id(sources.list_with_status(tmp_path))["eia"]
        assert row["credential_state"] == "unreadable"
        assert row["path"] == sources.PATH_BLOCKED  # 凭证故障：不是"未配置"，不得显示为回退
        assert row["status"] == "error"  # 清单 ok ≠ 可用
        assert "读取/解密失败" in row["reason"]

    def test_declaration_only_source(self, tmp_path):
        """清单未声明 implementation → declaration_only（仅声明、不可取数）。"""
        from data.service import Service

        d = tmp_path / "adapters" / "decl-only"
        d.mkdir(parents=True)
        (d / "manifest.yaml").write_text(
            chr(10).join([
                "id: decl-only", "name: Decl", "version: 1", "credentials: none", "provides:",
                "  - descriptor: {asset: bu, geo: cn, measure: close, contract: \"\"}",
                "    symbols: [B]", "    unit: cny_ton", "    freq: 1d", "    tz: Asia/Shanghai",
                "    fetch: {modes: [on_demand], history_days: 1}",
                "    update: {lag_min: 0, revises: true}",
            ]),
            encoding="utf-8",
        )
        Service(tmp_path).init().close()  # 目录编译：登记该源（仅声明）
        row = _by_id(sources.list_with_status(tmp_path))["decl-only"]
        assert row["path"] == sources.PATH_DECLARATION_ONLY
        assert row["implementation"] is None

class TestRuntime:
    """F-02/F-03/F-06：运行态与写锁场景。"""

    def test_last_fetch_reported(self, tmp_path, monkeypatch):
        """最近一次取数（成功）出现在状态里，而不是只有向导的 verified_at。"""
        import pandas as pd

        from data.adapters.akshare import akshare_adapter as ak_mod
        from data.catalog.descriptor import derive_id
        from data.service import Service

        monkeypatch.setattr(ak_mod, "_get_main", lambda symbol: pd.DataFrame({"日期": ["2026-10-01"], "收盘价": [1.0]}))
        svc = Service(tmp_path).init()
        try:
            sid = derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": ""})
            svc.fetch(sid, do_fetch=True)
        finally:
            svc.close()
        row = _by_id(sources.list_with_status(tmp_path))["akshare"]
        assert row["run_status"] == "succeeded" and row["run_at"]
        assert row["guide_error"] is None  # 成功不是错误



    def test_write_process_without_channel_fails_cleanly(self, tmp_path, capsys, monkeypatch):
        """写进程已开启观测库但未发布只读通道：结构化提示，不抛裸 traceback。"""
        import os
        import subprocess
        import sys

        from settings import cli

        monkeypatch.setattr(sources, "READ_WAIT_S", 1.0)  # 缩短等待窗口
        backend = str(Path(__file__).resolve().parent.parent)
        env = dict(os.environ, PYTHONPATH=backend, PYTHONIOENCODING="utf-8")
        code = chr(10).join([
            "import sys, time",
            "from pathlib import Path",
            "from data.service import Service",
            "s = Service(Path(sys.argv[1])).init()",
            "print('held', flush=True)",
            "time.sleep(30)",
        ])
        holder = subprocess.Popen(
            [sys.executable, "-c", code, str(tmp_path)],
            env=env, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True,
        )
        try:
            assert holder.stdout.readline().strip() == "held"
            assert cli.main(["--root", str(tmp_path), "source", "list"]) == 1
            err = capsys.readouterr().err
            assert "错误：" in err and "Traceback" not in err
        finally:
            holder.kill()
            holder.wait()


class TestReasonAndFailure:
    """B2-03 / B2-06：失败要有可操作原因；data-layer 的清单原因不被覆盖。"""

    def test_failed_run_reports_actionable_hint(self, tmp_path, monkeypatch):
        from data.adapters.akshare import akshare_adapter as ak_mod
        from data.service import Service

        def boom(symbol):
            raise RuntimeError("upstream down")

        monkeypatch.setattr(ak_mod, "_get_main", boom)
        svc = Service(tmp_path).init()
        try:
            from data.catalog.descriptor import derive_id

            sid = derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": ""})
            try:
                svc.fetch(sid, do_fetch=True)
            except Exception:
                pass
        finally:
            svc.close()
        row = _by_id(sources.list_with_status(tmp_path))["akshare"]
        assert row["run_status"] == "failed"
        assert "最近一次取数失败" in (row.get("reason") or "") or "最近一次取数失败" in (row.get("reason_hint") or "")

    def test_bad_manifest_reason_preserved(self, tmp_path):
        """坏件：data-layer 给出的原因（含路径/字段）不被 settings 覆盖。"""
        d = tmp_path / "adapters" / "bad-one"
        d.mkdir(parents=True)
        (d / "manifest.yaml").write_text(
            chr(10).join([
                'id: bad-one',
                'name: B',
                'version: 1',
                'credentials: none',
                'provides:',
                '  - descriptor: {asset: rb, geo: cn, measure: close, contract: ""}',
                '    symbols: [X]',
                '    unit: cny_ton',
                '    freq: 1d',
                '    tz: Asia/Shanghai',
                '    fetch: {modes: [on_demand], history_days: 1}',
                '    update: {lag_min: 0, revises: true}',
            ]),
            encoding="utf-8",
        )
        from data.service import Service

        Service(tmp_path).init().close()
        rows = sources.list_with_status(tmp_path)
        err = [r for r in rows if r["status"] == "error"]
        assert err and "asset" in (err[0]["reason"] or "")  # 保留真实校验原因
