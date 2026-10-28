"""目录写锁 + 短暂排队（profile 与 state.json 共用；复用 data-layer 的 PID 锁）。"""
from __future__ import annotations

import time
from pathlib import Path

from data.lock import LockBusy, write_lock

RETRY_S = 0.02
TIMEOUT_S = 5.0


def acquire(directory: Path, timeout: float = TIMEOUT_S):
    """取目录写锁；被占用时排队重试，超时才抛 LockBusy。"""
    directory.mkdir(parents=True, exist_ok=True)
    deadline = time.monotonic() + timeout
    while True:
        try:
            return write_lock(directory)
        except LockBusy:
            if time.monotonic() >= deadline:
                raise
            time.sleep(RETRY_S)
