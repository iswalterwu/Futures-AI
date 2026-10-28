"""settings CLI（spec AC-002-1~4、AC-003-*，plan §2.4），含引导状态与非法输入回归。

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

    def fake(prompt=""):
        try:
            return next(it)
        except StopIteration:
            raise AssertionError(f"多余输入：{prompt}")

    monkeypatch.setattr("builtins.input", fake)


class TestSkeleton:
    def test_help_and_import(self):
        with pytest.raises(SystemExit) as ei:
            cli.main(["--help"])
        assert ei.value.code == 0


class TestProfileCli:
    def test_partial_set_and_show(self, tmp_path, capsys):
        assert run(tmp_path, "profile", "set", "--first-name", "Walter", "--email", "walter@example.com") == 0
        capsys.readouterr()
        assert run(tmp_path, "profile", "show") == 0
        out = json.loads(capsys.readouterr().out)
        assert out["first_name"] == "Walter" and out["email"] == "wa***@example.com"
        assert out["missing_for_registration"] == ["last_name", "sector"]

    def test_invalid_input_reported_and_not_saved(self, tmp_path, capsys):
        assert run(tmp_path, "profile", "set", "--email", "bad") == 1
        assert "邮箱格式不合法" in capsys.readouterr().err
        assert load_profile(tmp_path).email == ""  # 非法值不落盘

    def test_clear(self, tmp_path, capsys):
        save_profile(tmp_path, FULL)
        assert run(tmp_path, "profile", "clear") == 0
        assert load_profile(tmp_path) == Profile()


class TestOnboard:
    def test_first_run_collects_and_saves(self, tmp_path, monkeypatch, capsys):
        """AC-002-1/2：无档案进引导；逐项保存。"""
        _feed(monkeypatch, ["Walter", "", "walter@example.com", "research"])
        assert run(tmp_path, "onboard") == 0
        p = load_profile(tmp_path)
        assert p.first_name == "Walter" and p.last_name == ""
        assert p.email == "walter@example.com"
        assert onboarding.onboard_state(tmp_path)["completed"] is True

    def test_all_empty_still_completes(self, tmp_path, monkeypatch, capsys):
        """AC-002-2：全部留空也可完成（档案可稍后填写，非必填）。"""
        _feed(monkeypatch, ["", "", "", ""])
        assert run(tmp_path, "onboard") == 0
        assert onboarding.onboard_state(tmp_path)["completed"] is True
        assert run(tmp_path, "onboard") == 0
        assert "已完成过" in capsys.readouterr().out  # 全空完成后不再重复引导

    def test_completed_not_repeated(self, tmp_path, capsys):
        save_profile(tmp_path, FULL)
        onboarding.set_onboard_state(tmp_path, completed=True)
        assert run(tmp_path, "onboard") == 0
        assert "已完成过" in capsys.readouterr().out

    def test_profile_without_onboard_still_guides(self, tmp_path, monkeypatch):
        """档案已存在但引导未完成（profile set 预填或上次中断）→ 继续引导并预填。"""
        save_profile(tmp_path, Profile(first_name="Walter"))
        _feed(monkeypatch, ["", "", "", ""])
        assert run(tmp_path, "onboard") == 0
        assert load_profile(tmp_path).first_name == "Walter"
        assert onboarding.onboard_state(tmp_path)["completed"] is True

    def test_skip_marks_completed(self, tmp_path, capsys):
        """AC-002-3：可直接跳过（返回 0），且不再重复引导。"""
        assert run(tmp_path, "onboard", "--skip") == 0
        assert "已跳过" in capsys.readouterr().out
        assert onboarding.onboard_state(tmp_path) == {"completed": True, "skipped": True}
        assert run(tmp_path, "onboard") == 0
        assert "已完成过" in capsys.readouterr().out

    def test_interrupt_keeps_filled_and_resumes(self, tmp_path, monkeypatch, capsys):
        """AC-002-4：中断不丢已填项、不标记完成；下次继续引导。"""
        answers = iter(["Walter"])

        def feed(prompt=""):
            try:
                return next(answers)
            except StopIteration:
                raise KeyboardInterrupt

        monkeypatch.setattr("builtins.input", feed)
        assert run(tmp_path, "onboard") == 0
        assert load_profile(tmp_path).first_name == "Walter"
        assert onboarding.onboard_state(tmp_path)["completed"] is False  # 未完成 → 下次继续

        _feed(monkeypatch, ["", "", "", ""])  # 继续：其余直接回车（保留已填默认）
        assert run(tmp_path, "onboard") == 0
        assert onboarding.onboard_state(tmp_path)["completed"] is True
        assert load_profile(tmp_path).first_name == "Walter"

    def test_invalid_email_rejected_then_retry(self, tmp_path, monkeypatch, capsys):
        """F-01：非法输入不落盘，提示后重试；档案保持可读。"""
        _feed(monkeypatch, ["Walter", "", "not-an-email", "walter@example.com", "research"])
        assert run(tmp_path, "onboard") == 0
        assert "输入不合法" in capsys.readouterr().err
        p = load_profile(tmp_path)
        assert p.email == "walter@example.com"  # 重试后写入合法值
        assert p.first_name == "Walter"

    def test_invalid_twice_skips_field(self, tmp_path, monkeypatch, capsys):
        _feed(monkeypatch, ["Walter", "", "bad", "also-bad", "", ""])
        assert run(tmp_path, "onboard") == 0
        assert load_profile(tmp_path).email == ""  # 两次非法 → 跳过，不写非法值
        assert "已跳过该项" in capsys.readouterr().err


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
        monkeypatch.setattr(cli, "_read_key", lambda: "k-" + "cli-open-0001")
        assert run(tmp_path, "source", "open", "eia") == 0
        out = json.loads(capsys.readouterr().out)
        assert out["ok"] is True and out["path"] == "api" and out["verified_at"]
        assert creds.get(tmp_path / "creds", "eia_api_key") == "k-" + "cli-open-0001"
        assert "k-cli-open-0001" not in json.dumps(out)  # 不回显

    def test_open_failure_not_saved(self, tmp_path, monkeypatch, capsys):
        save_profile(tmp_path, FULL)

        def boom(key):
            raise onboarding._ProbeError(onboarding.ERR_INVALID_KEY)

        monkeypatch.setattr(onboarding, "_probe", boom)
        monkeypatch.setattr(cli, "_read_key", lambda: "k-" + "bad-0001")
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


class TestEchoSafety:
    def test_non_tty_input_aborts_without_reading(self, tmp_path, monkeypatch, capsys):
        """F-08/B2-02：非终端（无法保证隐藏输入）→ 不读取、不验证、不保存。"""
        import io

        save_profile(tmp_path, FULL)
        fake_stdin = io.StringIO("k-" + "should-not-be-read")
        monkeypatch.setattr("sys.stdin", fake_stdin)
        probed = []
        called = []
        monkeypatch.setattr(onboarding, "_probe", lambda key: probed.append(key))
        monkeypatch.setattr("getpass.getpass", lambda prompt="": called.append(1) or "k-" + "nope")
        assert run(tmp_path, "source", "open", "eia") == 1
        assert "无法在此终端隐藏输入" in capsys.readouterr().err
        assert fake_stdin.tell() == 0  # 没有读取任何输入
        assert probed == [] and called == []  # 未验证、也未调用 getpass
        assert not onboarding.has_key(tmp_path)


class TestStorageFailure:
    def test_dpapi_failure_is_not_reported_as_saved(self, tmp_path, monkeypatch, capsys):
        """B2-07：存储失败（DPAPI）→ 失败退出、不置完成标记、不报 saved。"""
        from data import creds
        from settings import profile as profile_mod

        def boom(*a, **k):
            raise creds.CredsError("DPAPI 不可用（injected）")

        monkeypatch.setattr(profile_mod.creds, "put", boom)
        answers = iter(["Walter", "Wu", "", ""])
        monkeypatch.setattr("builtins.input", lambda prompt="": next(answers))
        assert run(tmp_path, "onboard") == 1
        out = capsys.readouterr()
        assert "saved" not in out.out
        assert "DPAPI" in out.err
        assert onboarding.onboard_state(tmp_path)["completed"] is False
