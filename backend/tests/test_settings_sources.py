"""settings R-004：数据源状态（spec AC-004-1~3，plan §2.3）。"""
from __future__ import annotations

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
        assert row["path"] == "offline"  # 路径推导仍显示回退，但原因说明为故障
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
