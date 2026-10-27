"""settings R-005：隐私与安全边界（spec AC-005-1~3）。

- AC-005-1：不存在向数据源注册页提交表单的代码路径
- AC-005-2：档案与凭证不入版本库
- AC-005-3：界面/日志/错误消息不含凭证明文
"""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

import pytest

from data.fetch.on_demand import FetchError
from settings import onboarding
from settings.profile import Profile, save as save_profile

BACKEND = Path(__file__).resolve().parent.parent
REPO = BACKEND.parent
SETTINGS_SRC = BACKEND / "settings"

FORBIDDEN_POST = re.compile(r"(?i)requests\.post\([^)]*register", re.S)
FORM_SUBMIT = re.compile(r"(?i)(<form|submit\(\)|mechanize|selenium|playwright)")


def _iter_py(root: Path):
    for p in root.rglob("*.py"):
        yield p


class TestNoAutoSubmit:
    def test_no_post_to_registration_page(self):
        """AC-005-1：没有向注册页提交表单的代码路径。"""
        hits = []
        for p in _iter_py(SETTINGS_SRC):
            text = p.read_text(encoding="utf-8", errors="replace")
            if FORBIDDEN_POST.search(text):
                hits.append(p.name)
        assert hits == [], hits

    def test_no_browser_automation(self):
        """AC-005-1：不驱动浏览器代替用户提交（无自动化库、无表单提交）。"""
        hits = []
        for p in _iter_py(SETTINGS_SRC):
            text = p.read_text(encoding="utf-8", errors="replace")
            if FORM_SUBMIT.search(text) or re.search(r"(?i)^\s*import (selenium|playwright|mechanize)", text, re.M):
                hits.append(p.name)
        assert hits == [], hits

    def test_registration_url_only_used_as_link(self):
        """注册页地址只作为展示链接出现，不参与请求。"""
        text = (SETTINGS_SRC / "onboarding.py").read_text(encoding="utf-8")
        assert "REGISTRATION_URL" in text
        assert not re.search(r"(?i)(requests\.(get|post)|urlopen)\([^)]*REGISTRATION_URL", text)


class TestNotTracked:
    def test_profile_and_creds_not_in_git(self):
        """AC-005-2：档案/凭证目录不在版本库。"""
        try:
            tracked = subprocess.run(
                ["git", "ls-files"], cwd=str(REPO), capture_output=True, text=True, timeout=60
            ).stdout
        except (OSError, subprocess.SubprocessError):
            pytest.skip("非 git 环境")
        assert "profile/" not in tracked
        assert "creds/" not in tracked
        assert "eia_api_key.bin" not in tracked

    def test_gitignore_covers_local_data(self):
        text = (REPO / ".gitignore").read_text(encoding="utf-8")
        assert any(tok in text for tok in ("FuturesAI", "*.bin", "creds"))


class TestNoPlaintextInMessages:
    def test_verify_error_has_no_key(self, tmp_path, monkeypatch):
        """AC-005-3：验证失败消息不含 key。"""
        def boom(key):
            raise FetchError("unauthorized", "injected")

        monkeypatch.setattr(onboarding, "_probe", boom)
        secret = "k-" + "privacy-check-4321"
        step = onboarding.verify_and_save(tmp_path, secret)
        assert secret not in repr(step)

    def test_state_file_has_no_key(self, tmp_path, monkeypatch):
        """AC-005-3：状态文件只记时间与错误码，不含凭证。"""
        monkeypatch.setattr(onboarding, "_probe", lambda key: None)
        secret = "k-" + "state-check-9876"
        onboarding.verify_and_save(tmp_path, secret)
        state = onboarding.state_path(tmp_path).read_text(encoding="utf-8")
        assert secret not in state
        creds_raw = (tmp_path / "creds" / "eia_api_key.bin").read_bytes()
        assert secret.encode() not in creds_raw  # 凭证文件本身也是密文

    def test_profile_email_not_in_command_output(self, tmp_path, capsys):
        """AC-005-3：CLI 展示档案时邮箱遮蔽。"""
        from settings import cli

        save_profile(tmp_path, Profile(email="walter@example.com"))
        assert cli.main(["--root", str(tmp_path), "profile", "show"]) == 0
        out = capsys.readouterr().out
        assert "walter@example.com" not in out
        assert "wa***@example.com" in out
