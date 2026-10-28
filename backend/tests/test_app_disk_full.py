"""真实加密存储 + 文件系统边界 ENOSPC：507，旧值保留，宿主仍健康。"""
from __future__ import annotations

import errno
import os
import pytest

from data import creds
from settings import onboarding
from settings.profile import Profile, load, save
from test_app_settings_api import HEADERS, client


@pytest.mark.parametrize("boundary", ["replace", "write"])
def test_profile_put_enospc_507_then_health_ok(tmp_path, monkeypatch, caplog, boundary):
    save(tmp_path, Profile(first_name="Original", email="fixture@example.test"))
    before = (tmp_path / "profile" / "profile.bin").read_bytes()

    def full(*args, **kwargs):
        raise OSError(errno.ENOSPC, "PRIVATE filesystem payload")

    with client(tmp_path) as c:
        with monkeypatch.context() as patch:
            patch.setattr(os, boundary, full)
            response = c.put("/settings/profile", json={"first_name": "Changed"}, headers=HEADERS)
            assert response.status_code == 507
            assert response.json() == {"error": "disk_full", "message": "磁盘空间不足，写入失败"}
            assert c.get("/health").status_code == 200
        assert (tmp_path / "profile" / "profile.bin").read_bytes() == before
        assert load(tmp_path).first_name == "Original"
        assert c.put("/settings/profile", json={"first_name": "Recovered"}, headers=HEADERS).status_code == 200
    assert load(tmp_path).first_name == "Recovered"
    assert "PRIVATE" not in caplog.text
    # 失败没有产生遗留临时文件。
    assert not list((tmp_path / "profile").glob("*.tmp"))


@pytest.mark.parametrize("boundary", ["replace", "write"])
def test_key_post_enospc_507(tmp_path, monkeypatch, caplog, boundary):
    old_key = "FAIPLANT-old-key"
    new_key = "FAIPLANT-new-key"
    creds.put(tmp_path / "creds", "eia_api_key", old_key)
    monkeypatch.setattr(onboarding, "_probe", lambda key: None)  # 唯一网络边界，不访问 EIA

    def full(*args, **kwargs):
        raise OSError(errno.ENOSPC, "PRIVATE " + new_key)

    with client(tmp_path) as c:
        with monkeypatch.context() as patch:
            patch.setattr(os, boundary, full)
            response = c.post("/settings/key", json={"key": new_key}, headers=HEADERS)
            assert response.status_code == 507
            assert response.json() == {"error": "disk_full", "message": "磁盘空间不足，写入失败"}
            assert c.get("/health").status_code == 200
        assert creds.get(tmp_path / "creds", "eia_api_key") == old_key
        assert not list((tmp_path / "creds").glob("*.tmp"))
    assert new_key not in response.text + caplog.text
    assert "PRIVATE" not in caplog.text


def test_onboard_raw_enospc_507(tmp_path, monkeypatch):
    def full(*args, **kwargs):
        raise OSError(errno.ENOSPC, "PRIVATE state write")

    with client(tmp_path) as c:
        with monkeypatch.context() as patch:
            patch.setattr(os, "replace", full)
            response = c.post("/settings/onboard", json={"skip": True}, headers=HEADERS)
            assert response.status_code == 507
            assert response.json()["error"] == "disk_full"
            assert c.get("/health").status_code == 200
        assert onboarding.onboard_state(tmp_path) == {"completed": False, "skipped": False}
