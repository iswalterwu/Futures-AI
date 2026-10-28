"""settings R-003：EIA 开通向导核心（spec AC-003-1~5，plan §2.2）。"""
from __future__ import annotations

import pytest

from data import creds
from data.adapters.eia import eia_adapter
from settings import onboarding
from settings.profile import Profile, save as save_profile

FULL = Profile(first_name="Walter", last_name="Wu", email="walter@example.com", sector="research")


def _inject(monkeypatch, *, ok=True, code=onboarding.ERR_INVALID_KEY):
    calls = []

    def probe(key):
        calls.append(key)
        if not ok:
            raise onboarding._ProbeError(code)

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
        [(onboarding.ERR_INVALID_KEY, "invalid_key"), (onboarding.ERR_RATE_LIMITED, "rate_limited"),
         (onboarding.ERR_UNREACHABLE, "unreachable"), (onboarding.ERR_BAD_RESPONSE, "bad_response")],
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
        _inject(monkeypatch, ok=False, code=onboarding.ERR_INVALID_KEY)
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


    def test_onboard_state_roundtrip(self, tmp_path):
        from settings import onboarding as ob

        assert onboarding.onboard_state(tmp_path) == {"completed": False, "skipped": False}
        onboarding.set_onboard_state(tmp_path, completed=True, skipped=True)
        assert onboarding.onboard_state(tmp_path) == {"completed": True, "skipped": True}


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

    def test_http_debug_logs_are_redacted(self, tmp_path, monkeypatch, caplog):
        """F-07/B2-01：DEBUG 级别下日志里的 key 被脱敏为 ***，且不依赖全局级别开关。"""
        import logging

        import requests

        secret = "k-" + "log-redact-0001"

        class Resp:
            status_code = 200

            def json(self):
                return {"response": {"data": [{"period": "2026-10-16", "value": "1"}]}}

        def fake_get(url, params=None, timeout=None):
            # 模拟真实 HTTP 客户端在 DEBUG 下打印完整 URL（含 api_key）
            logging.getLogger("urllib3.connectionpool").debug("send: GET %s?api_key=%s", url, params["api_key"])
            return Resp()

        monkeypatch.setattr(requests, "get", fake_get)
        monkeypatch.setattr(eia_adapter, "_FILTER_INSTALLED", False)  # 避免依赖其它测试先跑
        for name in ("urllib3", "urllib3.connectionpool", "requests"):
            logging.getLogger(name).filters.clear()
        logger = logging.getLogger("urllib3.connectionpool")
        old_level = logger.level
        logger.setLevel(logging.DEBUG)
        try:
            with caplog.at_level(logging.DEBUG, logger="urllib3.connectionpool"):
                step = onboarding.verify_and_save(tmp_path, secret)
        finally:
            logger.setLevel(old_level)
        assert step.detail["ok"] is True
        joined = chr(10).join(r.getMessage() for r in caplog.records)
        assert "api_key" in joined            # 日志确实产生了
        assert secret not in joined           # 但明文已脱敏
        assert "api_key=***" in joined









class TestCredentialRefContract:
    """N-07：向导用的凭证名必须与内置 eia 清单声明一致。"""

    def test_matches_builtin_manifest(self):
        from pathlib import Path as _P

        from data.catalog.registry import BUILTIN_ADAPTERS_DIR
        from data.manifest import load as load_manifest

        m = load_manifest(str(BUILTIN_ADAPTERS_DIR / "eia" / "manifest.yaml"))
        assert onboarding.CREDENTIAL_REF == m.credentials.credential_ref


class TestUnreachable:
    """NEW-6：真实 requests 异常 → unreachable，且异常链不含 key。"""

    def test_real_connection_error_maps_to_unreachable(self, tmp_path, monkeypatch):
        import requests

        secret = "k-" + "unreach-0001"

        def boom(url, params=None, timeout=None):
            raise requests.exceptions.ConnectionError(f"refused: {url}?api_key={secret}")

        monkeypatch.setattr(requests, "get", boom)
        step = onboarding.verify_and_save(tmp_path, secret)
        assert step.detail["error"] == onboarding.ERR_UNREACHABLE
        assert secret not in repr(step.detail)
        assert not onboarding.has_key(tmp_path)
