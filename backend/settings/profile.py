"""用户档案（spec R-001，plan §2.1）。

全部字段可空（spec Q-001：不是必填项）；档案 DPAPI 加密存本机，与凭证同等保护。
"""
from __future__ import annotations

import re
from pathlib import Path

from pydantic import BaseModel, field_validator

from data import creds

PROFILE_NAME = "profile"  # 档案在 creds 机制里的名字（文件名 profile.bin）
PROFILE_DIR = "profile"

# 与数据源（EIA）注册表单选项一致的封闭清单（plan §2.1）
SECTORS = {
    "business": "Business/Industry",
    "citizen": "Private citizen",
    "research": "Research/Consulting",
    "finance": "Finance (banking, investment)",
    "government": "Government",
    "student": "Student",
    "teacher": "Teacher/Professor",
    "media": "Media",
    "trade_assoc": "Trade Association/Nonprofit",
    "other": "Other",
}

# 数据源注册所需字段（档案可留空，但开通需要凭证的数据源时须齐全）
REGISTRATION_FIELDS = ("first_name", "last_name", "email", "sector")

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class ProfileError(Exception):
    """档案不合法或不可读写（fail closed，不降级为空档案）。"""


class Profile(BaseModel):
    first_name: str = ""
    last_name: str = ""
    email: str = ""
    sector: str = ""
    reason_for_use: str = ""
    notify: bool = False
    display_name: str = ""

    @field_validator("first_name", "last_name", "display_name", "reason_for_use", mode="before")
    @classmethod
    def _strip(cls, v):
        return "" if v is None else str(v).strip()

    @field_validator("email", mode="before")
    @classmethod
    def _email(cls, v):
        v = "" if v is None else str(v).strip()
        if v and not _EMAIL_RE.match(v):
            raise ValueError(f"邮箱格式不合法: {v!r}")
        return v

    @field_validator("sector", mode="before")
    @classmethod
    def _sector(cls, v):
        v = "" if v is None else str(v).strip()
        if v and v not in SECTORS:
            raise ValueError(f"组织类型非法: {v!r}（可选：{sorted(SECTORS)}）")
        return v


def profile_path(root: Path) -> Path:
    return Path(root) / PROFILE_DIR / f"{PROFILE_NAME}.bin"


def load(root: Path) -> Profile:
    """读取档案。文件不存在 → 空档案（首次启动判定）；存在但读不出来 → ProfileError（不静默当空）。"""
    directory = Path(root) / PROFILE_DIR
    if not creds.exists(directory, PROFILE_NAME):
        return Profile()
    try:
        raw = creds.get(directory, PROFILE_NAME)
    except creds.CredsError as e:
        raise ProfileError(f"档案读取失败（{e}）") from e
    try:
        return Profile.model_validate_json(raw)
    except Exception as e:
        raise ProfileError(f"档案内容损坏: {e}") from e


def save(root: Path, profile: Profile) -> Path:
    """DPAPI 加密保存（原子替换，失败报错、不留半写文件）。"""
    directory = Path(root) / PROFILE_DIR
    try:
        return creds.put(directory, PROFILE_NAME, profile.model_dump_json())
    except creds.CredsError as e:
        raise ProfileError(f"档案保存失败（{e}）") from e


def clear(root: Path) -> bool:
    """删除档案；**不动凭证**（spec AC-001-4）。返回是否确实删除。"""
    p = profile_path(root)
    if p.exists():
        p.unlink()
        return True
    return False


def missing_for_registration(profile: Profile) -> list[str]:
    """数据源注册所需的缺项（空表示齐全）；供向导与界面提示，不在保存时拦截（spec AC-001-1）。"""
    return [f for f in REGISTRATION_FIELDS if not getattr(profile, f)]


def mask_email(email: str) -> str:
    """展示用遮蔽：`ab***@example.com`。"""
    if not email or "@" not in email:
        return email
    local, _, domain = email.partition("@")
    return f"{local[:2]}***@{domain}"
