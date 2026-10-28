"""desktop-shell 后端宿主：引导与设置端点（spec AC-005-1~4）。"""
from __future__ import annotations

from pathlib import Path

import pytest
from starlette.testclient import TestClient

from app.main import create_app
from data import creds
from settings import onboarding
from settings.profile import Profile, save as save_profile

TOKEN = "tok-" + "settings-api"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}


def client(root: Path):
    return TestClient(create_app(root, token=TOKEN))


class TestOnboardState:
    def test_first_run_not_completed(self, tmp_path):
        """AC-005-1：无档案 → onboarding.completed 为 false（外壳据此进引导）。"""
        with client(tmp_path) as c:
            body = c.get("/settings/profile", headers=HEADERS).json()
        assert body["onboarding"] == {"completed": False, "skipped": False}
        assert body["missing_for_registration"] == ["first_name", "last_name", "email", "sector"]

    def test_mark_completed_skip(self, tmp_path):
        """AC-005-2：可跳过；状态持久化后不再进引导。"""
        with client(tmp_path) as c:
            assert c.post("/settings/onboard", json={"skip": True}, headers=HEADERS).json()["skipped"] is True
        with client(tmp_path) as c:
            body = c.get("/settings/profile", headers=HEADERS).json()
        assert body["onboarding"]["completed"] is True

    def test_email_is_masked(self, tmp_path):
        """AC-005-4：接口不回传明文邮箱。"""
        save_profile(tmp_path, Profile(first_name="W", email="walter@example.com"))
        with client(tmp_path) as c:
            body = c.get("/settings/profile", headers=HEADERS).json()
        assert body["profile"]["email"] == "wa***@example.com"
        assert "walter@example.com" not in str(body)


class TestSources:
    def test_lists_three_sources_with_offline_eia(self, tmp_path):
        """AC-005-3：数据源状态可见，未配置凭证时 eia 标为免凭证回退。"""
        with client(tmp_path) as c:
            rows = c.get("/settings/sources", headers=HEADERS).json()["sources"]
        by_id = {r["adapter_id"]: r for r in rows}
        assert {"akshare", "eia", "local-file"} <= set(by_id)
        assert by_id["eia"]["path"] == "offline"
        assert by_id["akshare"]["path"] == "builtin"


class TestKeyWizard:
    def test_success_saves_and_hides_key(self, tmp_path, monkeypatch):
        """AC-005-3/4：验证通过才保存；响应不含 key。"""
        monkeypatch.setattr(onboarding, "_probe", lambda key: None)
        secret = "k-" + "host-api-0001"
        with client(tmp_path) as c:
            body = c.post("/settings/key", json={"key": secret}, headers=HEADERS).json()
            rows = c.get("/settings/sources", headers=HEADERS).json()["sources"]
        assert body["ok"] is True and secret not in str(body)
        assert creds.get(tmp_path / "creds", "eia_api_key") == secret
        assert {r["adapter_id"]: r for r in rows}["eia"]["path"] == "api"

    def test_failure_does_not_save(self, tmp_path, monkeypatch):
        def boom(key):
            raise onboarding._ProbeError(onboarding.ERR_INVALID_KEY)

        monkeypatch.setattr(onboarding, "_probe", boom)
        secret = "k-" + "host-api-bad-0001"
        with client(tmp_path) as c:
            body = c.post("/settings/key", json={"key": secret}, headers=HEADERS).json()
        assert body["ok"] is False and body["error"] == "invalid_key"
        assert not onboarding.has_key(tmp_path)
        assert secret not in str(body)
