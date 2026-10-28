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


class TestStateFile:
    """F-04：状态文件原子写；并发写不产生无法解析的 JSON。"""

    def test_concurrent_state_writes_stay_valid(self, tmp_path):
        import json
        import threading

        from settings import onboarding as ob

        def write(i):
            ob.write_state(tmp_path, f"src{i}", verified_at=f"t{i}")

        threads = [threading.Thread(target=write, args=(i,)) for i in range(4)]
        for t in threads:
            t.start()
        for t in threads:
            t.join(30)
        data = json.loads(ob.state_path(tmp_path).read_text(encoding="utf-8"))
        assert len([k for k in data if k.startswith("src")]) == 4  # 串行化：全部写入且文件可解析

    def test_onboard_state_roundtrip(self, tmp_path):
        from settings import onboarding as ob

        assert ob.onboard_state(tmp_path) == {"completed": False, "skipped": False}
        ob.set_onboard_state(tmp_path, completed=True, skipped=True)
        assert ob.onboard_state(tmp_path) == {"completed": True, "skipped": True}


class TestProbeClassification:
    """F-07/F-11：真实请求的错误分类与日志脱敏（不替换 `_probe`）。"""

    @staticmethod
    def _inject(monkeypatch, status=200, payload=None, raise_json=False):
        import requests

        class Resp:
            status_code = status
            text = "{}"

            def json(self):
                if raise_json:
                    raise ValueError("not json")
                return payload if payload is not None else {"response": {"data": [{"period": "2026-10-16", "value": "1"}]}}

        calls = []

        def fake_get(url, params=None, timeout=None):
            calls.append((url, dict(params or {})))
            return Resp()

        monkeypatch.setattr(requests, "get", fake_get)
        return calls

    @pytest.mark.parametrize(
        "status,payload,raise_json,expected",
        [
            (401, None, False, "invalid_key"),
            (403, None, False, "invalid_key"),
            (429, None, False, "rate_limited"),
            (503, None, False, "server_error"),
            (200, {"response": {"data": []}}, False, "bad_response"),
            (200, None, True, "bad_response"),
        ],
    )
    def test_error_codes(self, tmp_path, monkeypatch, status, payload, raise_json, expected):
        self._inject(monkeypatch, status, payload, raise_json)
        step = onboarding.verify_and_save(tmp_path, "k-" + "probe-0001")
        assert step.detail["ok"] is False and step.detail["error"] == expected
        assert not onboarding.has_key(tmp_path)

    def test_http_debug_logs_suppressed_and_restored(self, tmp_path, monkeypatch):
        """F-07：请求期间 HTTP 客户端日志压到 WARNING，结束后恢复（key 在查询参数里）。"""
        import logging

        levels = []
        import requests

        class Resp:
            status_code = 200

            def json(self):
                return {"response": {"data": [{"period": "2026-10-16", "value": "1"}]}}

        def fake_get(url, params=None, timeout=None):
            levels.append(logging.getLogger("urllib3.connectionpool").level)
            return Resp()

        monkeypatch.setattr(requests, "get", fake_get)
        logger = logging.getLogger("urllib3.connectionpool")
        logger.setLevel(logging.DEBUG)
        try:
            step = onboarding.verify_and_save(tmp_path, "k-" + "log-0001")
        finally:
            logger.setLevel(logging.WARNING)
        assert step.detail["ok"] is True
        assert levels == [logging.WARNING]
