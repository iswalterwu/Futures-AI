"""settings CLI（spec AC-002-1~4、AC-003-*，plan §2.4）。

`onboard` 的交互通过 monkeypatch `builtins.input` / `getpass.getpass` 驱动，不读真实终端。
"""
from __future__ import annotations

import json

import pytest

from data import creds
from settings import cli, onboarding
from settings.profile import Profile, load as load_profile, save as save_profile

FULL = Profile(first_name="Walter", last_name="Wu", email="walter@example.com", sector="research")


def run(root, *argv):
    return cli.main(["--root", str(root), *argv])


def _feed(monkeypatch, answers):
    it = iter(answers)
    monkeypatch.setattr("builtins.input", lambda prompt="": next(it))


class TestSkeleton:
    def test_help_and_import(self):
        with pytest.raises(SystemExit) as ei:
            cli.main(["--help"])
        assert ei.value.code == 0


class TestProfileCli:
    def test_partial_set_and_show(self, tmp_path, capsys):
        """AC-001-1：部分更新与展示（邮箱遮蔽）。"""
        assert run(tmp_path, "profile", "set", "--first-name", "Walter", "--email", "walter@example.com") == 0
        capsys.readouterr()
        assert run(tmp_path, "profile", "show") == 0
        out = json.loads(capsys.readouterr().out)
        assert out["first_name"] == "Walter" and out["email"] == "wa***@example.com"
        assert out["missing_for_registration"] == ["last_name", "sector"]

    def test_invalid_input_reported(self, tmp_path, capsys):
        assert run(tmp_path, "profile", "set", "--email", "bad") == 1
        assert "邮箱格式不合法" in capsys.readouterr().err

    def test_clear(self, tmp_path, capsys):
        save_profile(tmp_path, FULL)
        assert run(tmp_path, "profile", "clear") == 0
        assert load_profile(tmp_path) == Profile()


class TestOnboard:
    def test_first_run_collects_and_saves(self, tmp_path, capsys):
        """AC-002-1/2：无档案进引导；留空也可完成。"""
        _feed(monkeypatch_factory := pytest.MonkeyPatch(), ["Walter", "", "walter@example.com", "research"])
        try:
            assert run(tmp_path, "onboard") == 0
        finally:
            monkeypatch_factory.undo()
        p = load_profile(tmp_path)
        assert p.first_name == "Walter" and p.last_name == ""
        assert p.email == "walter@example.com"

    def test_skip_returns_zero(self, tmp_path, capsys):
        """AC-002-3：可直接跳过，进入主界面语义（返回 0）。"""
        assert run(tmp_path, "onboard", "--skip") == 0
        assert "已跳过" in capsys.readouterr().out
        assert load_profile(tmp_path) == Profile()

    def test_existing_profile_not_repeated(self, tmp_path, capsys):
        save_profile(tmp_path, FULL)
        assert run(tmp_path, "onboard") == 0
        assert "已存在" in capsys.readouterr().out

    def test_interrupt_keeps_filled_fields(self, tmp_path, monkeypatch, capsys):
        """AC-002-4：中断后本次已填内容不丢。"""
        answers = iter(["Walter"])

        def feed(prompt=""):
            try:
                return next(answers)
            except StopIteration:
                raise KeyboardInterrupt

        monkeypatch.setattr("builtins.input", feed)
        assert run(tmp_path, "onboard") == 0
        assert load_profile(tmp_path).first_name == "Walter"  # 逐项保存


class TestSourceCli:
    def test_list_shows_paths(self, tmp_path, capsys):
        """AC-004-3：未配置凭证时 eia 显示免凭证回退。"""
        assert run(tmp_path, "source", "list") == 0
        rows = {r["adapter_id"]: r for r in json.loads(capsys.readouterr().out)["sources"]}
        assert rows["eia"]["path"] == "offline"
        assert rows["akshare"]["path"] == "builtin"

    def test_open_requires_profile(self, tmp_path, capsys):
        """AC-003-1：档案缺项 → 先补档案，不出现空表单。"""
        save_profile(tmp_path, Profile(first_name="Walter"))
        assert run(tmp_path, "source", "open", "eia") == 1
        err = capsys.readouterr().err
        assert "缺少注册所需字段" in err and "profile set" in err

    def test_open_verifies_then_saves(self, tmp_path, monkeypatch, capsys):
        """AC-003-2/3/4：不回显读 key → 验证 → 保存 → 显示路径与时间。"""
        save_profile(tmp_path, FULL)
        monkeypatch.setattr(onboarding, "_probe", lambda key: None)
        monkeypatch.setattr("getpass.getpass", lambda prompt="": "k-" + "cli-open-0001")
        assert run(tmp_path, "source", "open", "eia") == 0
        out = json.loads(capsys.readouterr().out)
        assert out["ok"] is True and out["path"] == "api" and out["verified_at"]
        assert creds.get(tmp_path / "creds", "eia_api_key") == "k-" + "cli-open-0001"
        assert "k-cli-open-0001" not in json.dumps(out)  # 不回显

    def test_open_failure_not_saved(self, tmp_path, monkeypatch, capsys):
        save_profile(tmp_path, FULL)

        def boom(key):
            from data.fetch.on_demand import FetchError

            raise FetchError("unauthorized", "injected")

        monkeypatch.setattr(onboarding, "_probe", boom)
        monkeypatch.setattr("getpass.getpass", lambda prompt="": "k-" + "bad-0001")
        assert run(tmp_path, "source", "open", "eia") == 1
        out = json.loads(capsys.readouterr().out)
        assert out["ok"] is False and out["error"] == "invalid_key"
        assert not onboarding.has_key(tmp_path)

    def test_clear_returns_to_offline(self, tmp_path, capsys):
        """AC-003-5"""
        creds.put(tmp_path / "creds", "eia_api_key", "k-" + "clear-0001")
        assert run(tmp_path, "source", "clear", "eia") == 0
        assert "免凭证回退" in capsys.readouterr().out
        assert not onboarding.has_key(tmp_path)
