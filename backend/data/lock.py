"""用户数据目录权威布局与单写者写锁（plan §3.3，AC-004-6/009-3）。"""
from __future__ import annotations

import json
import os
from pathlib import Path

LAYOUT = ["data", "adapters", "creds"]  # plan §3.3 权威布局（data/.lock 为运行态文件）

LOCK_FILENAME = ".lock"
ENDPOINT_FILENAME = "mcp_endpoint.json"


class LockBusy(Exception):
    pass


def ensure_layout(root: Path) -> dict[str, Path]:
    """创建权威布局目录；返回 {data, adapters, creds}。"""
    dirs = {name: (root / name) for name in LAYOUT}
    for d in dirs.values():
        d.mkdir(parents=True, exist_ok=True)
    return dirs


def write_lock(data_dir: Path):
    """写锁：原子创建 data/.lock 并持有排它锁（Windows msvcrt）。"""
    lock_path = data_dir / LOCK_FILENAME
    f = open(lock_path, "a+")
    try:
        import msvcrt

        msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
    except OSError as e:
        f.close()
        raise LockBusy("数据目录被另一写进程占用") from e
    return f


def release_lock(f) -> None:
    try:
        import msvcrt

        msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
    finally:
        f.close()


def write_endpoint(data_dir: Path, port: int, token: str) -> Path:
    """serve 启动时写端点发现文件（AC-004-6 只读路由）。"""
    p = data_dir / ENDPOINT_FILENAME
    p.write_text(
        json.dumps({"port": port, "token": token}, ensure_ascii=False),
        encoding="utf-8",
    )
    return p


def read_endpoint(data_dir: Path) -> dict | None:
    p = data_dir / ENDPOINT_FILENAME
    if not p.is_file():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
