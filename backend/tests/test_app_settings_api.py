"""desktop-shell 后端宿主：引导与设置端点（spec AC-005-1~4）。"""
from __future__ import annotations

from pathlib import Path

import pytest
from starlette.testclient import TestClient

from app.main import create_app
from data import creds
from settings import onboarding
from settings.profile import Profile, load as load_profile, save as save_profile

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


class TestProfileWrite:
    """PUT /settings/profile：部分更新、校验失败不落盘；AC-005-1/3。"""

    def test_partial_update_and_masked_response(self, tmp_path):
        with client(tmp_path) as c:
            r = c.put("/settings/profile", json={"first_name": "Walter", "email": "w@example.com"}, headers=HEADERS)
            assert r.status_code == 200
            body = r.json()
        assert body["profile"]["first_name"] == "Walter"
        assert body["profile"]["email"] == "w***@example.com"
        assert "sector" in body["missing_for_registration"]

    def test_invalid_email_rejected_without_writing(self, tmp_path):
        with client(tmp_path) as c:
            r = c.put("/settings/profile", json={"email": "bad"}, headers=HEADERS)
            assert r.status_code == 422
            body = c.get("/settings/profile", headers=HEADERS).json()
        assert body["profile"]["email"] == ""

    def test_masked_email_rejected_422_without_writing(self, tmp_path):
        save_profile(tmp_path, Profile(first_name="Original", email="fixture@example.test"))
        before = (tmp_path / "profile" / "profile.bin").read_bytes()
        with client(tmp_path) as c:
            response = c.put("/settings/profile", json={
                "email": "fi***@example.test", "first_name": "Must not save",
            }, headers=HEADERS)
            assert response.status_code == 422
            assert response.json() == {"detail": "遮蔽显示值不可回写"}
        assert (tmp_path / "profile" / "profile.bin").read_bytes() == before
        assert load_profile(tmp_path).email == "fixture@example.test"
        assert load_profile(tmp_path).first_name == "Original"

    def test_partial_update_preserves_email_and_empty_clears(self, tmp_path):
        save_profile(tmp_path, Profile(email="fixture@example.test"))
        with client(tmp_path) as c:
            response = c.put("/settings/profile", json={"first_name": "Changed"}, headers=HEADERS)
            assert response.status_code == 200
            assert response.json()["profile"]["email"] == "fi***@example.test"
            assert load_profile(tmp_path).email == "fixture@example.test"
            response = c.put("/settings/profile", json={"email": ""}, headers=HEADERS)
            assert response.status_code == 200
            assert load_profile(tmp_path).email == ""
            assert load_profile(tmp_path).first_name == "Changed"

    def test_sectors_endpoint_matches_official_list(self, tmp_path):
        """AC-005-3：组织类型清单由后端下发（11 项，含 Library）。"""
        with client(tmp_path) as c:
            sectors = c.get("/settings/sectors", headers=HEADERS).json()["sectors"]
        assert len(sectors) == 11 and any(x["key"] == "library" for x in sectors)


class TestRegistrationGuide:
    def test_complete_profile_matches_core_labels(self, tmp_path):
        save_profile(tmp_path, Profile(first_name="Fixture", last_name="Trader",
                     email="fixture@example.test", sector="research", reason_for_use="Energy research"))
        before = (tmp_path / "profile" / "profile.bin").read_bytes()
        with client(tmp_path) as c:
            response = c.get("/settings/registration-guide", headers=HEADERS)
            assert response.status_code == 200
            assert response.json() == {
                "missing": [], "hint": "",
                "prefill": [
                    {"label": "First Name", "value": "Fixture"},
                    {"label": "Last Name", "value": "Trader"},
                    {"label": "Email", "value": "fixture@example.test"},
                    {"label": "Category that best describes you/your organization", "value": "Research/Consulting"},
                    {"label": "Reason for use（可选）", "value": "Energy research"},
                ],
                "submit": {
                    "url": "https://www.eia.gov/opendata/register.php",
                    "notes": [
                        "打开上面的地址，按「逐项指引」填写；条款与勾选由你本人确认",
                        "提交后 key 会发送到你在表单里填写的邮箱（注意查收垃圾邮件）",
                        "本程序不会代替你提交表单，也不会读取你的邮箱",
                    ],
                },
            }
            assert c.get("/settings/profile", headers=HEADERS).json()["profile"]["email"] == "fi***@example.test"
        assert (tmp_path / "profile" / "profile.bin").read_bytes() == before
        assert not (tmp_path / "profile" / "state.json").exists()

    def test_missing_profile_lists_core_missing(self, tmp_path):
        save_profile(tmp_path, Profile(first_name="Fixture"))
        with client(tmp_path) as c:
            response = c.get("/settings/registration-guide", headers=HEADERS)
            assert response.status_code == 200
            body = response.json()
            assert body["missing"] == ["last_name", "email", "sector"]
            assert body["hint"] == "先补齐档案中的缺项，再继续注册（档案可在 profile set 中修改）"
            assert body["prefill"] == [
                {"label": "First Name", "value": "Fixture"},
                {"label": "Last Name", "value": ""},
                {"label": "Email", "value": ""},
                {"label": "Category that best describes you/your organization", "value": ""},
                {"label": "Reason for use（可选）", "value": ""},
            ]

    def test_requires_token(self, tmp_path):
        with client(tmp_path) as c:
            assert c.get("/settings/registration-guide").status_code == 401
            assert c.get("/settings/registration-guide", headers={"Authorization": "Bearer wrong"}).status_code == 401

    def test_no_key_in_response_and_no_email_in_logs(self, tmp_path, caplog, capsys):
        import logging
        import uuid

        email = "plant.user@example.test"
        secret = "-".join(("FAIPLANT", "KEY", uuid.uuid4().hex))
        save_profile(tmp_path, Profile(first_name="Fixture", last_name="Trader", email=email, sector="research"))
        creds.put(tmp_path / "creds", "eia_api_key", secret)
        with caplog.at_level(logging.DEBUG):
            with client(tmp_path) as c:
                response = c.get("/settings/registration-guide", headers=HEADERS)
                assert response.status_code == 200
                assert email in response.text
                assert secret not in response.text
        captured = capsys.readouterr()
        assert "registration-guide" in caplog.text  # 捕获器正对照：确实记录了该请求
        assert email not in caplog.text + captured.out + captured.err
        assert secret not in caplog.text + captured.out + captured.err

    def test_corrupt_profile_is_422_not_empty_guide(self, tmp_path):
        save_profile(tmp_path, Profile(first_name="Fixture"))
        (tmp_path / "profile" / "profile.bin").write_bytes(b"invalid encrypted fixture")
        with client(tmp_path) as c:
            response = c.get("/settings/registration-guide", headers=HEADERS)
            assert response.status_code == 422
            assert response.json() == {"detail": "ProfileError"}


class TestClearKey:
    """DELETE /settings/key：清除后回到免凭证路径（AC-005-3）。"""

    def test_clear_returns_to_offline(self, tmp_path, monkeypatch):
        monkeypatch.setattr(onboarding, "_probe", lambda key: None)
        with client(tmp_path) as c:
            c.post("/settings/key", json={"key": "k-" + "clear-api-0001"}, headers=HEADERS)
            assert c.delete("/settings/key", headers=HEADERS).json()["cleared"] is True
            rows = {r["adapter_id"]: r for r in c.get("/settings/sources", headers=HEADERS).json()["sources"]}
        assert rows["eia"]["path"] == "offline"
        assert not onboarding.has_key(tmp_path)
