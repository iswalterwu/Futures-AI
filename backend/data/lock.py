"""用户数据目录权威布局与单写者写锁（plan §3.3，AC-004-6/009-3）。"""
from __future__ import annotations

import json
import os
from pathlib import Path

LAYOUT = ["data", "adapters", "creds"]  # plan §3.3 权威布局（data/.lock 为运行态文件）

LOCK_FILENAME = ".lock"
ENDPOINT_FILENAME = "mcp_endpoint.json"
DEFAULT_SERVE_PORT = 8932  # serve 默认端口（仅 127.0.0.1；可用 --port 覆盖）


class LockBusy(Exception):
    pass


def _unlink_retry(path: Path, timeout: float = 2.0) -> None:
    """删除运行态文件；遇共享冲突（其他进程正读取该文件）短暂重试，超时仍失败则抛出。"""
    import time

    deadline = time.monotonic() + timeout
    while True:
        try:
            Path(path).unlink(missing_ok=True)
            return
        except PermissionError:
            if time.monotonic() >= deadline:
                raise
            time.sleep(0.02)


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
                try:
                    lock_path.unlink(missing_ok=True)
                except OSError:  # 删除失败 = 文件仍被持有 → 并非陈旧
                    raise LockBusy("数据目录被另一写进程占用") from e
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


def _pid_alive(pid: int) -> bool:
    """进程是否存在。仅“进程不存在”（OpenProcess 返回 ERROR_INVALID_PARAMETER）判死；
    拒绝访问等其他失败 = 进程存在但无权查询 → 视为存活（保守，不误删他人锁）。"""
    import ctypes
    from ctypes import wintypes

    PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
    STILL_ACTIVE = 259
    ERROR_INVALID_PARAMETER = 87
    k32 = ctypes.WinDLL("kernel32", use_last_error=True)
    k32.OpenProcess.restype = wintypes.HANDLE
    k32.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
    k32.GetExitCodeProcess.restype = wintypes.BOOL
    k32.GetExitCodeProcess.argtypes = [wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD)]
    k32.CloseHandle.argtypes = [wintypes.HANDLE]
    h = k32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid)
    if not h:
        return ctypes.get_last_error() != ERROR_INVALID_PARAMETER
    try:
        code = wintypes.DWORD()
        if not k32.GetExitCodeProcess(h, ctypes.byref(code)):
            return True
        return code.value == STILL_ACTIVE
    finally:
        k32.CloseHandle(h)


def _stale(lock_path: Path) -> bool:
    """锁文件存在但持有进程已不存在 → 陈旧锁。"""
    import time

    try:
        text = lock_path.read_text(encoding="utf-8", errors="ignore").strip()
    except OSError:
        return False
    if not text:
        # R10-02：空锁 = 可能正在创建；仅当超过 30 秒才判陈旧（F-01 崩溃恢复）
        try:
            return (time.time() - lock_path.stat().st_mtime) > 30
        except OSError:
            return False
    try:
        pid = int(text)
    except ValueError:
        return False
    if pid <= 0:
        return False
    try:
        return not _pid_alive(pid)
    except Exception:
        return False  # 不确定 → 保守视为有效锁


def lock_held(data_dir: Path) -> bool:
    """锁是否真实被持有（存在且进程存活）；陈旧锁自动回收。"""
    lock_path = data_dir / LOCK_FILENAME
    if not lock_path.exists():
        return False
    if _stale(lock_path):
        try:
            lock_path.unlink(missing_ok=True)
        except OSError:  # 删除失败 = 仍被持有
            return True
        return False
    return True


def release_lock(f) -> None:
    lock_path = getattr(f, "_lock_path", f.name)
    try:
        import msvcrt

        os.lseek(f.fileno(), 64, os.SEEK_SET)
        msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
    finally:
        f.close()
        _unlink_retry(Path(lock_path))


def write_endpoint(data_dir: Path, port: int, token: str) -> Path:
    """serve 启动时写端点发现文件（AC-004-6 只读路由）。"""
    p = data_dir / ENDPOINT_FILENAME
    p.write_text(
        json.dumps({"port": port, "token": token}, ensure_ascii=False),
        encoding="utf-8",
    )
    return p


def remove_endpoint(data_dir: Path, token: str) -> None:
    """serve 退出时删除端点文件（仅删除本进程写入的那份：令牌一致）。"""
    ep = read_endpoint(data_dir)
    if ep and ep.get("token") == token:
        _unlink_retry(data_dir / ENDPOINT_FILENAME)


def read_endpoint(data_dir: Path) -> dict | None:
    p = data_dir / ENDPOINT_FILENAME
    if not p.is_file():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
