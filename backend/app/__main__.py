"""后端宿主入口：`python -m app --root <data dir> --port-file <path> --token <t>`。

- 只监听 127.0.0.1，端口由系统分配（避免冲突，spec AC-007-1）
- 就绪后把 {port, token} 写入 port-file，供外壳发现；**外壳仍以 /health 判定就绪**
- 收到 POST /shutdown 后优雅退出（lifespan 释放数据目录写锁）
"""
from __future__ import annotations

import argparse
import json
import secrets
import threading
import time
from pathlib import Path

import uvicorn

from app.main import create_app

STARTUP_GRACE_S = 30.0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="futuresai-backend")
    p.add_argument("--root", required=True, help="用户数据目录")
    p.add_argument("--port-file", default=None, help="就绪后写入 {port, token} 的路径")
    p.add_argument("--token", default=None, help="Bearer 令牌（缺省随机生成）")
    p.add_argument("--port", type=int, default=0, help="监听端口（默认系统分配）")
    args = p.parse_args(argv)

    root = Path(args.root)
    token = args.token or secrets.token_hex(16)
    app = create_app(root, token=token)
    config = uvicorn.Config(app, host="127.0.0.1", port=args.port, log_level="warning", lifespan="on")
    server = uvicorn.Server(config)

    def wait_and_publish() -> None:
        deadline = time.monotonic() + STARTUP_GRACE_S
        while not server.started and time.monotonic() < deadline:
            time.sleep(0.05)
        port = server.servers[0].sockets[0].getsockname()[1] if server.started and server.servers else None
        if port and args.port_file:
            Path(args.port_file).write_text(
                json.dumps({"port": port, "token": token}, ensure_ascii=False), encoding="utf-8"
            )
        # /shutdown 置位后停服
        while not app.state.host.should_exit.is_set():
            time.sleep(0.1)
        server.should_exit = True

    threading.Thread(target=wait_and_publish, name="host-lifecycle", daemon=True).start()
    server.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
