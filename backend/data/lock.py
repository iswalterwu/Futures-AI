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
    """写锁：原子独占创建 data/.lock（存在即拒绝）+ 持排它锁（msvcrt）。

    锁状态 = 文件存在且被持有；release 删除文件 → .lock 存在 ⟺ 锁被持有。
    F-01：写入持有者 PID；发现陈旧锁（进程已死）→ 清理后重试。
    """
    lock_path = data_dir / LOCK_FILENAME
    for attempt in (0, 1):
        try:
            fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_RDWR)
            break
        except FileExistsError as e:
            if attempt == 0 and _stale(lock_path):
                lock_path.unlink(missing_ok=True)
                continue
            raise LockBusy("数据目录被另一写进程占用") from e
    os.write(fd, str(os.getpid()).encode())
    f = os.fdopen(fd, "r+")
    f._lock_path = str(lock_path)  # os.fdopen 的 .name 是 fd 整数，记真实路径
    try:
        import msvcrt

        os.lseek(fd, 64, os.SEEK_SET)  # 锁区域避开 PID 字节（读者可读 PID 判陈旧）
        msvcrt.locking(fd, msvcrt.LK_NBLCK, 1)
    except OSError as e:
        f.close()
        lock_path.unlink(missing_ok=True)
        raise LockBusy("数据目录被另一写进程占用") from e
    return f


def _stale(lock_path: Path) -> bool:
    """锁文件存在但持有进程已死 → 陈旧锁。"""
    try:
        pid = int(lock_path.read_text(encoding="utf-8", errors="ignore").strip())
    except (OSError, ValueError):
        return True  # F-01：空/非法内容 = 创建后写 PID 前崩溃 → 陈旧
    if pid <= 0:
        return False
    import ctypes

    PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
    STILL_ACTIVE = 259
    try:
        h = ctypes.windll.kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid)
        if not h:
            return True  # 打不开 → 进程不存在
        code = ctypes.c_ulong()
        ctypes.windll.kernel32.GetExitCodeProcess(h, ctypes.byref(code))
        ctypes.windll.kernel32.CloseHandle(h)
        return code.value != STILL_ACTIVE
    except Exception:
        return False  # 不确定 → 保守视为有效锁


def release_lock(f) -> None:
    lock_path = getattr(f, "_lock_path", f.name)
    try:
        import msvcrt

        os.lseek(f.fileno(), 64, os.SEEK_SET)
        msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
    finally:
        f.close()
        Path(lock_path).unlink(missing_ok=True)





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
