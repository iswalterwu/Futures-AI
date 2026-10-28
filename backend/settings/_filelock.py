"""目录写锁 + 短暂排队（profile 与 state.json 共用；复用 data-layer 的 PID 锁）。"""
from __future__ import annotations

import time
from pathlib import Path

from data.lock import LockBusy, write_lock

RETRY_S = 0.02
TIMEOUT_S = 5.0


class LockTimeout(Exception):
    """取锁超时（另一个 settings 进程正在写档案/状态）。"""


def acquire(directory: Path, timeout: float = TIMEOUT_S):
    """取目录写锁；被占用时排队重试，超时抛 LockTimeout（消息面向 settings 用户）。"""
    directory.mkdir(parents=True, exist_ok=True)
    deadline = time.monotonic() + timeout
    while True:
        try:
            return write_lock(directory)
        except LockBusy as e:
            if time.monotonic() >= deadline:
                raise LockTimeout(f"{directory.name} 正被另一个设置进程写入，请稍后重试") from e
            time.sleep(RETRY_S)
