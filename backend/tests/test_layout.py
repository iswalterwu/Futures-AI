"""AC-009-3：目录权威布局；AC-004-6：写锁互斥与端点发现。"""
from __future__ import annotations

import pytest

from data.lock import LockBusy, ensure_layout, read_endpoint, release_lock, write_endpoint, write_lock


class TestLayout:
    def test_ensure_layout(self, tmp_path):
        dirs = ensure_layout(tmp_path)
        for name in ("data", "adapters", "creds"):
            assert dirs[name].is_dir()
        assert (tmp_path / "data").is_dir()


class TestLock:
    def test_write_lock_exclusive(self, tmp_path):
        data = tmp_path / "data"
        data.mkdir()
        f1 = write_lock(data)
        try:
            with pytest.raises(LockBusy):
                write_lock(data)
        finally:
            release_lock(f1)
        f2 = write_lock(data)  # 释放后可再获取
        release_lock(f2)

    def test_endpoint_discovery(self, tmp_path):
        data = tmp_path / "data"
        data.mkdir()
        write_endpoint(data, 8932, "tok123")
        ep = read_endpoint(data)
        assert ep == {"port": 8932, "token": "tok123"}

    def test_endpoint_missing(self, tmp_path):
        assert read_endpoint(tmp_path / "data") is None
