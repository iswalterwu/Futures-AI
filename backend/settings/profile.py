"""用户档案（spec R-001，plan §2.1）。

全部字段可空（spec Q-001：不是必填项）；档案 DPAPI 加密存本机，与凭证同等保护。
写入一律经 `update()`：整个「读—合并—校验—写」在**档案目录锁**内完成，
避免两个进程各自 set 不同字段时互相覆盖（并发部分更新不丢字段）。
"""
from __future__ import annotations

import re
from pathlib import Path

from pydantic import BaseModel, field_validator

from data import creds
from data.lock import release_lock, write_lock

PROFILE_NAME = "profile"  # 档案在 creds 机制里的名字（文件名 profile.bin）
PROFILE_DIR = "profile"

# 与数据源（EIA）注册表单选项一致（2026-10-27 抓取 register.php 的 Category 选项，含 Library）
SECTORS = {
    "business": "Business/Industry",
    "citizen": "Private citizen",
    "research": "Research/Consulting",
    "finance": "Finance (banking, investment)",
    "government": "Government",
    "library": "Library",
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


def _lock(root: Path, timeout: float = 5.0):
    """档案目录写锁（复用 data-layer 的 PID 锁）；并发写短暂排队而不是立刻失败。"""
    import time

    from data.lock import LockBusy

    directory = Path(root) / PROFILE_DIR
    directory.mkdir(parents=True, exist_ok=True)
    deadline = time.monotonic() + timeout
    while True:
        try:
            return write_lock(directory)
        except LockBusy:
            if time.monotonic() >= deadline:
                raise
            time.sleep(0.02)


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


def exists(root: Path) -> bool:
    """档案文件是否存在（与"内容是否为空"无关：可留空但已建立）。"""
    return prof_exists(root)


def prof_exists(root: Path) -> bool:
    return (Path(root) / PROFILE_DIR / f"{PROFILE_NAME}.bin").is_file()


def _save_locked(root: Path, profile: Profile) -> Path:
    directory = Path(root) / PROFILE_DIR
    try:
        return creds.put(directory, PROFILE_NAME, profile.model_dump_json())
    except creds.CredsError as e:
        raise ProfileError(f"档案保存失败（{e}）") from e


def save(root: Path, profile: Profile) -> Path:
    """保存（写前再校验一次）。非法输入不会落盘，避免写进无法再读出的档案。"""
    profile = Profile.model_validate(profile.model_dump())
    lock = _lock(root)
    try:
        return _save_locked(root, profile)
    finally:
        release_lock(lock)


def update(root: Path, **fields) -> Profile:
    """部分更新：读 → 合并 → 校验 → 写在同一个档案锁内（并发不丢字段、非法值不落盘）。"""
    lock = _lock(root)
    try:
        current = load(root)
        merged = {**current.model_dump(), **{k: v for k, v in fields.items() if v is not None}}
        profile = Profile.model_validate(merged)  # 校验失败抛 ValueError，不写盘
        _save_locked(root, profile)
        return profile
    finally:
        release_lock(lock)


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
