"""凭证存储（AC-009-1）：DPAPI 加密，保存与读取均 fail closed。"""
from __future__ import annotations

import base64
import binascii
from pathlib import Path


class CredsError(Exception):
    pass


def _win32():
    try:
        import win32crypt

        return win32crypt
    except ImportError as e:  # DPAPI 不可用 → fail closed
        raise CredsError("DPAPI 不可用（pywin32 缺失），拒绝凭证操作") from e


def put(creds_dir: Path, name: str, secret: str) -> Path:
    """加密保存；任何失败（含 DPAPI 不可用）→ 报错，绝不写明文。"""
    try:
        win32crypt = _win32()
        blob = win32crypt.CryptProtectData(
            secret.encode("utf-8"), name, None, None, None, 0
        )
    except CredsError:
        raise
    except Exception as e:
        raise CredsError(f"凭证加密失败，拒绝保存: {e}") from e
    creds_dir = Path(creds_dir)
    creds_dir.mkdir(parents=True, exist_ok=True)
    out = creds_dir / f"{name}.bin"
    out.write_bytes(base64.b64encode(blob))
    return out


def get(creds_dir: Path, name: str) -> str:
    """解密读取；读取/解密失败 → 报错，禁止返回明文或 None。"""
    p = Path(creds_dir) / f"{name}.bin"
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
    return secret.decode("utf-8")
