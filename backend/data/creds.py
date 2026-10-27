"""凭证存储（AC-009-1）：DPAPI 加密，保存与读取均 fail closed。"""
from __future__ import annotations

import base64
import binascii
import os
import re
from pathlib import Path

_NAME_RE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")  # 凭证名 = 文件名，禁止路径分隔与穿越


class CredsError(Exception):
    pass


def _path(creds_dir: Path, name: str) -> Path:
    if not _NAME_RE.match(str(name or "")):
        raise CredsError(f"凭证名非法: {name!r}（须匹配 [A-Za-z0-9_-]{{1,64}}）")
    return Path(creds_dir) / f"{name}.bin"


def _win32():
    try:
        import win32crypt

        return win32crypt
    except ImportError as e:  # DPAPI 不可用 → fail closed
        raise CredsError("DPAPI 不可用（pywin32 缺失），拒绝凭证操作") from e


def put(creds_dir: Path, name: str, secret: str) -> Path:
    """加密保存；任何失败（含 DPAPI 不可用）→ 报错，绝不写明文；空凭证拒绝。"""
    out = _path(creds_dir, name)
    if not str(secret):
        raise CredsError("空凭证拒绝保存")
    try:
        win32crypt = _win32()
        blob = win32crypt.CryptProtectData(
            secret.encode("utf-8"), name, None, None, None, 0
        )
    except CredsError:
        raise
    except Exception as e:
        raise CredsError(f"凭证加密失败，拒绝保存: {e}") from e
    # 先写临时文件再原子替换：写入失败不留半写文件、不破坏既有凭证
    tmp = out.with_name(out.name + ".tmp")
    try:
        out.parent.mkdir(parents=True, exist_ok=True)
        tmp.write_bytes(base64.b64encode(blob))
        os.replace(tmp, out)
    except OSError as e:
        try:
            tmp.unlink(missing_ok=True)
        except OSError:
            pass
        raise CredsError(f"凭证写入失败，拒绝保存: {e}") from e
    return out


def get(creds_dir: Path, name: str) -> str:
    """解密读取；读取/解密失败 → 报错，禁止返回明文或 None。"""
    p = _path(creds_dir, name)
    try:
        raw = p.read_bytes()
    except OSError as e:
        raise CredsError(f"凭证读取失败（{name} 不存在或不可读）") from e
    try:
        blob = base64.b64decode(raw)
    except (ValueError, binascii.Error) as e:
        raise CredsError(f"凭证文件损坏（{name}）") from e
    try:
        win32crypt = _win32()
        secret = win32crypt.CryptUnprotectData(blob, None, None, None, 0)[1]
    except CredsError:
        raise
    except Exception as e:
        raise CredsError(f"凭证解密失败，拒绝返回: {e}") from e
    secret = secret.decode("utf-8")
    if not secret:
        raise CredsError("凭证读取失败：空凭证（拒绝返回空值）")
    return secret
