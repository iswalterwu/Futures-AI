"""本机后端宿主：初始化失败输出安全标记，退出码 3；运行期优雅释放资源。"""
from __future__ import annotations

import argparse
import errno
import json
import os
import secrets
import sys
import threading
from pathlib import Path

import uvicorn

from app.main import Host, create_app, is_disk_full
from data.lock import LockBusy, write_endpoint


class HostServer(uvicorn.Server):
    """在实际监听后发布端点；消费宿主的正常退出信号。"""

    def __init__(self, config, host: Host, port_file: Path | None, token: str):
        super().__init__(config)
        self.host = host
        self.port_file = port_file
        self.token = token
        self.startup_complete = False

    async def startup(self, sockets=None):
        await super().startup(sockets=sockets)
        if self.started:
            port = self.servers[0].sockets[0].getsockname()[1]
            write_endpoint(self.host.root / "data", port, self.host.channel_token)
            if self.port_file:
                self.port_file.write_text(
                    json.dumps({"port": port, "token": self.token}), encoding="utf-8"
                )
            self.startup_complete = True

    async def on_tick(self, counter):
        return self.host.should_exit.is_set() or await super().on_tick(counter)


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="futuresai-backend")
    p.add_argument("--root", required=True, help="用户数据目录")
    p.add_argument("--port-file", default=None, help="监听后写入端点；仍须探测 /health")
    p.add_argument("--token", default=None, help="Bearer 令牌（缺省随机生成）")
    p.add_argument("--port", type=int, default=0, help="监听端口（默认系统分配）")
    p.add_argument("--exit-on-stdin-eof", action="store_true", help="父进程管道关闭时优雅退出")
    args = p.parse_args(argv)

    root = Path(args.root)
    token = args.token or secrets.token_hex(16)
    host = None
    server = None
    try:
        host = Host(root)
        app = create_app(root, token=token, host=host)
        config = uvicorn.Config(app, host="127.0.0.1", port=args.port,
                                log_level="warning", access_log=False, lifespan="on")
        server = HostServer(config, host, Path(args.port_file) if args.port_file else None, token)
        if args.exit_on_stdin_eof:
            threading.Thread(target=_exit_on_stdin_eof, args=(host,),
                             name="host-stdin", daemon=True).start()
        server.run()
        return 0
    except (Exception, SystemExit) as exc:
        if server is not None and server.startup_complete:
            raise
        code, detail = startup_failure(exc, root, explicit_port=bool(args.port))
        print("FAI_HOST " + json.dumps({
            "event": "startup_failed", "code": code, "path": str(root), "detail": detail,
        }, ensure_ascii=False), flush=True)
        return 3
    finally:
        if server is not None:
            for listener in getattr(server, "servers", []):
                listener.close()
        if host is not None:
            host.close()


def _exit_on_stdin_eof(host: Host) -> None:
    # 不持有 BufferedReader 锁：/shutdown 可以先于 EOF 退出解释器。
    while os.read(sys.stdin.fileno(), 4096):
        pass
    host.should_exit.set()


def startup_failure(exc: BaseException, root: Path, *, explicit_port=False) -> tuple[str, str]:
    if is_disk_full(exc):
        return "disk_full", "磁盘空间不足，写入失败"
    cause = exc
    while cause is not None:
        if isinstance(cause, LockBusy):
            detail = "数据目录被另一写进程占用"
            try:
                pid = int((root / "data" / ".lock").read_text(encoding="utf-8").strip())
                detail += f" (PID {pid})"
            except (OSError, ValueError):
                pass
            return "data_root_locked", detail
        if (isinstance(cause, PermissionError)
                or getattr(cause, "errno", None) in (errno.EACCES, errno.EPERM, errno.EROFS)
                or getattr(cause, "winerror", None) in (5, 19)):
            return "data_root_unwritable", "数据目录不可写：权限不足或只读"
        if explicit_port and isinstance(cause, SystemExit):
            return "port_in_use", "指定端口不可用"
        cause = cause.__cause__
    return "startup_internal", type(exc).__name__


if __name__ == "__main__":
    raise SystemExit(main())
