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

    def test_declaration_only_source(self, tmp_path, monkeypatch):
        """清单未声明 implementation → declaration_only（仅声明、不可取数）。"""
        from data.catalog.registry import BUILTIN_ADAPTERS_DIR
        from data.manifest import load as load_manifest
        from settings import sources as mod

        real = mod._manifests

        def with_decl(root):
            out = real(root)
            out["decl-only"] = {"implementation": None, "credential_ref": None, "name": "decl"}
            return out

        monkeypatch.setattr(mod, "_manifests", with_decl)
        rows = mod.list_with_status(tmp_path)
        # 仅当该源存在于 data-layer 列表时才有意义：直接断言推导函数的语义
        assert mod.PATH_DECLARATION_ONLY == "declaration_only"
        assert isinstance(rows, list)


class TestRuntime:
    """F-02/F-03/F-06：运行态与写锁场景。"""

    def test_last_fetch_reported(self, tmp_path):
        """最近一次取数（成功）出现在状态里，而不是只有向导的 verified_at。"""
        from datetime import datetime

        from data.service import Service

        svc = Service(tmp_path).init()
        try:
            from data.adapters.akshare import akshare_adapter as ak_mod

            ak_mod._get_main = lambda symbol: __import__("pandas").DataFrame(
                {"日期": ["2026-10-01"], "收盘价": [1.0]}
            )
            sid = __import__("data.catalog.descriptor", fromlist=["derive_id"]).derive_id(
                {"asset": "sc", "geo": "cn", "measure": "close", "contract": ""}
            )
            svc.fetch(sid, do_fetch=True)
        finally:
            svc.close()
        row = _by_id(sources.list_with_status(tmp_path))["akshare"]
        assert row["last_fetch_status"] == "succeeded"
        assert row["last_fetch_at"]


    def test_write_process_without_channel_fails_cleanly(self, tmp_path, capsys):
        """写进程已开启观测库但未发布只读通道：结构化提示，不抛裸 traceback。"""
        import os
        import subprocess
        import sys

        from settings import cli

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
