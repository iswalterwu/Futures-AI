"""settings R-001：用户档案（spec AC-001-1~4，plan §2.1/§3.1）。"""
from __future__ import annotations

import socket
from pathlib import Path

import pytest

from data import creds
from settings.profile import (
    SECTORS,
    Profile,
    ProfileError,
    clear,
    load,
    mask_email,
    missing_for_registration,
    profile_path,
    save,
)


class TestSaveLoad:
    def test_partial_save_and_load(self, tmp_path):
        """AC-001-1：允许部分字段留空；读回一致。"""
        save(tmp_path, Profile(first_name="Walter"))
        p = load(tmp_path)
        assert p.first_name == "Walter" and p.last_name == "" and p.email == ""

    def test_empty_profile_when_missing(self, tmp_path):
        assert load(tmp_path) == Profile()  # 首次启动判定

    def test_stored_encrypted(self, tmp_path):
        """AC-001-3：档案加密落盘，不含明文。"""
        save(tmp_path, Profile(first_name="Walter", email="walter@example.com"))
        raw = profile_path(tmp_path).read_bytes()
        assert b"walter@example.com" not in raw and b"Walter" not in raw

    def test_no_network_needed(self, tmp_path, monkeypatch):
        """AC-001-3：保存/读取不产生任何网络请求。"""
        def boom(*a, **k):
            raise AssertionError("档案操作不得访问网络")

        monkeypatch.setattr(socket.socket, "connect", boom)
        monkeypatch.setattr(socket, "create_connection", boom)
        save(tmp_path, Profile(email="a@b.co"))
        assert load(tmp_path).email == "a@b.co"


class TestValidation:
    def test_email_format(self):
        """AC-001-2：非空邮箱须合法。"""
        with pytest.raises(ValueError):
            Profile(email="not-an-email")
        assert Profile(email="a@b.co").email == "a@b.co"

    def test_sector_closed_list(self):
        """AC-001-2：组织类型来自固定清单。"""
        with pytest.raises(ValueError):
            Profile(sector="freelancer")
        assert Profile(sector="research").sector == "research"
        assert "research" in SECTORS

    def test_missing_items(self):
        """AC-001-1：能判定注册所需字段缺项（保存时不拦截）。"""
        assert missing_for_registration(Profile()) == ["first_name", "last_name", "email", "sector"]
        full = Profile(first_name="A", last_name="B", email="a@b.co", sector="other")
        assert missing_for_registration(full) == []


class TestClear:
    def test_clear_keeps_credentials(self, tmp_path):
        """AC-001-4：清除档案不影响已保存的凭证。"""
        save(tmp_path, Profile(first_name="Walter"))
        creds.put(tmp_path / "creds", "eia_api_key", "k-" + "keep-me-0001")
        assert clear(tmp_path) is True
        assert load(tmp_path) == Profile()
        assert creds.get(tmp_path / "creds", "eia_api_key") == "k-" + "keep-me-0001"
        assert clear(tmp_path) is False  # 再清除是空操作

    def test_corrupt_profile_fails_closed(self, tmp_path):
        """档案存在但损坏 → 报错（不静默当空档案）。"""
        d = tmp_path / "profile"
        d.mkdir()
        (d / "profile.bin").write_bytes(b"not-base64!!!")
        with pytest.raises(ProfileError):
            load(tmp_path)


class TestMasking:
    def test_mask_email(self):
        assert mask_email("walter@example.com") == "wa***@example.com"
        assert mask_email("") == ""


class TestUpdate:
    """F-01/F-04：非法不落盘；并发部分更新不丢字段。"""

    def test_invalid_update_does_not_touch_file(self, tmp_path):
        from settings.profile import update

        save(tmp_path, Profile(first_name="Walter", email="walter@example.com"))
        with pytest.raises(ValueError):
            update(tmp_path, email="not-an-email")
        assert load(tmp_path).email == "walter@example.com"  # 原档案未受影响

    def test_empty_profile_still_creates_file(self, tmp_path):
        assert profile_path(tmp_path).is_file() is False
        save(tmp_path, Profile())  # 全空也算建立
        assert profile_path(tmp_path).is_file() is True



class TestSectorsMatchOfficialForm:
    """F-09 / AC-001-2 / Q-004：组织类型清单与官方注册表单选项一致（fixture 为 2026-10-27 抓取）。"""

    def test_matches_official_options(self):
        fixture = Path(__file__).resolve().parent / "fixtures" / "eia_register" / "sectors.txt"
        official = [
            ln.strip() for ln in fixture.read_text(encoding="utf-8").splitlines()
            if ln.strip() and not ln.startswith("#")
        ]
        assert sorted(SECTORS.values()) == sorted(official)

    def test_library_present(self):
        assert Profile(sector="library").sector == "library"


