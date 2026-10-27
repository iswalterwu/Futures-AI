"""settings R-003：EIA 开通向导核心（spec AC-003-1~5，plan §2.2）。"""
from __future__ import annotations

import pytest

from data import creds
from data.fetch.on_demand import FetchError
from settings import onboarding
from settings.profile import Profile, save as save_profile

FULL = Profile(first_name="Walter", last_name="Wu", email="walter@example.com", sector="research")


def _inject(monkeypatch, *, ok=True, code="unauthorized"):
    calls = []

    def probe(key):
        calls.append(key)
        if not ok:
            raise FetchError(code, "injected failure")

    monkeypatch.setattr(onboarding, "_probe", probe)
    return calls


class TestPrepare:
    def test_missing_fields_reported(self, tmp_path):
        """AC-003-1：档案缺字段时明确列出，不出现空表单。"""
        save_profile(tmp_path, Profile(first_name="Walter"))
        step = onboarding.prepare(tmp_path)
        assert step.key == "prepare"
        assert set(step.detail["missing"]) == {"last_name", "email", "sector"}
        assert step.detail["hint"]

    def test_prefill_matches_profile(self, tmp_path):
        """AC-003-1：预填内容与档案一致。"""
        save_profile(tmp_path, FULL)
        step = onboarding.prepare(tmp_path)
        assert step.detail["missing"] == []
        values = {item["label"]: item["value"] for item in step.detail["prefill"]}
        assert values["First Name"] == "Walter"
        assert values["Email"] == "walter@example.com"
        assert values["Category that best describes you/your organization"] == "Research/Consulting"

    def test_registration_hint_does_not_submit(self, tmp_path):
        hint = onboarding.registration_hint()
        assert hint.detail["url"].endswith("register.php")
        assert any("不会代替你提交" in n for n in hint.detail["notes"])


class TestVerifyAndSave:
    def test_success_saves_key_and_time(self, tmp_path, monkeypatch):
        """AC-003-2/4：验证成功才保存，并记录验证时间与路径。"""
        calls = _inject(monkeypatch, ok=True)
        step = onboarding.verify_and_save(tmp_path, "k-" + "good-0001")
        assert step.key == "done" and step.detail["ok"] is True
        assert step.detail["path"] == "api" and step.detail["verified_at"]
        assert calls == ["k-" + "good-0001"]
        assert creds.get(tmp_path / "creds", "eia_api_key") == "k-" + "good-0001"
        assert onboarding.read_state(tmp_path)["eia"]["verified_at"]

    @pytest.mark.parametrize(
        "code,expected",
        [("unauthorized", "invalid_key"), ("rate_limited", "rate_limited"),
         ("adapter_error", "unreachable"), ("validation_error", "bad_response")],
    )
    def test_failures_do_not_save(self, tmp_path, monkeypatch, code, expected):
        """AC-003-2：四类失败均不保存，且给出可操作原因。"""
        _inject(monkeypatch, ok=False, code=code)
        step = onboarding.verify_and_save(tmp_path, "k-" + "bad-key-0001")
        assert step.detail["ok"] is False and step.detail["error"] == expected
        assert not onboarding.has_key(tmp_path)
        assert onboarding.read_state(tmp_path)["eia"]["last_error"] == expected

    def test_error_message_has_no_key(self, tmp_path, monkeypatch):
        """AC-003-3：错误消息不含 key 明文。"""
        _inject(monkeypatch, ok=False, code="unauthorized")
        secret = "k-" + "leak-check-9876"
        step = onboarding.verify_and_save(tmp_path, secret)
        assert secret not in str(step.detail)

    def test_empty_key_rejected(self, tmp_path):
        step = onboarding.verify_and_save(tmp_path, "   ")
        assert step.detail["ok"] is False and step.detail["error"] == "empty_key"
        assert not onboarding.has_key(tmp_path)


class TestClearKey:
    def test_clear_returns_to_offline(self, tmp_path, monkeypatch):
        """AC-003-5：清除凭证后回到免凭证路径。"""
        _inject(monkeypatch, ok=True)
        onboarding.verify_and_save(tmp_path, "k-" + "good-0002")
        assert onboarding.has_key(tmp_path) is True
        assert onboarding.clear_key(tmp_path) is True
        assert onboarding.has_key(tmp_path) is False
        assert onboarding.read_state(tmp_path)["eia"]["verified_at"] is None
        assert onboarding.clear_key(tmp_path) is False  # 再清除是空操作
