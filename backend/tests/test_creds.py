"""AC-009-1：凭证 fail closed（保存/读取双失败路径）。"""
from __future__ import annotations

import pytest

from data.creds import CredsError, get, put


class TestRoundtrip:
    def test_roundtrip(self, tmp_path):
        creds_dir = tmp_path / "creds"
        put(creds_dir, "eia_key", "sk-secret-12345678")
        assert get(creds_dir, "eia_key") == "sk-secret-12345678"

    def test_no_plaintext_on_disk(self, tmp_path):
        creds_dir = tmp_path / "creds"
        put(creds_dir, "eia_key", "sk-secret-12345678")
        raw = (creds_dir / "eia_key.bin").read_bytes()
        assert b"sk-secret-12345678" not in raw


class TestFailClosed:
    def test_read_missing(self, tmp_path):
        with pytest.raises(CredsError):
            get(tmp_path / "creds", "nope")

    def test_read_corrupt(self, tmp_path):
        creds_dir = tmp_path / "creds"
        creds_dir.mkdir()
        (creds_dir / "bad.bin").write_bytes(b"not-base64!!!")
        with pytest.raises(CredsError):
            get(creds_dir, "bad")

    def test_save_failure_no_file(self, tmp_path, monkeypatch):
        def boom(*a, **k):
            raise OSError("simulated DPAPI failure")

        monkeypatch.setattr("data.creds._win32", lambda: type("W", (), {"CryptProtectData": staticmethod(boom)})())
        with pytest.raises(CredsError):
            put(tmp_path / "creds", "x", "secret-value")
        assert not (tmp_path / "creds" / "x.bin").exists()
