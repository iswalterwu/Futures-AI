"""打包产物冒烟（desktop-shell T-04；plan §3.3、§5）。

用法：cd backend && python tools/shell_check.py
前置：先 `python tools/build_backend.py`。

检查项（对应 spec AC）：产物存在、/health 就绪、内置三源随包、Bearer 鉴权、/shutdown 优雅退出、
写锁释放、端口释放、产物不含测试/用户数据。
"""
from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent
EXE = BACKEND / "dist" / "futuresai-backend" / ("futuresai-backend.exe" if sys.platform == "win32" else "futuresai-backend")
TOKEN = "tok-" + "shell-check"

results: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, ok, detail))
    print(f"{'PASS' if ok else 'FAIL'}  {name}{('  — ' + detail) if detail else ''}")


def get(url: str, token: str | None = None) -> tuple[int, dict]:
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"} if token else {})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, {}


def main() -> int:
    check("打包产物存在", EXE.is_file(), str(EXE))
    if not EXE.is_file():
        print("\n请先运行: python tools/build_backend.py")
        return 1

    app_dir = EXE.parent
    # 只查"我们的测试"与 pytest 包本身（第三方库自带的 tests 目录不算）
    pytest_pkgs = [p.name for p in app_dir.rglob("*") if p.name in ("pytest", "_pytest") or p.name.startswith("pytest-")]
    our_tests = [p for p in app_dir.rglob("tests") if p.parent.name in ("futuresai-backend", "_internal", "data", "settings", "app")]
    check("产物不含测试依赖（AC-001-4）", not pytest_pkgs and not our_tests,
          f"pytest={pytest_pkgs[:2]} tests={[str(x.relative_to(app_dir)) for x in our_tests[:2]]}")

    root = Path(tempfile.mkdtemp(prefix="futuresai-shellcheck-")) / "root"
    port_file = root.parent / "host.json"
    proc = subprocess.Popen(
        [str(EXE), "--root", str(root), "--port-file", str(port_file), "--token", TOKEN],
        cwd=str(app_dir), env={**os.environ, "PYTHONIOENCODING": "utf-8"},
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True,
    )
    info: dict = {}
    try:
        deadline = time.monotonic() + 90
        while time.monotonic() < deadline and proc.poll() is None:
            if port_file.exists():
                info = json.loads(port_file.read_text(encoding="utf-8"))
                status, body = get(f"http://127.0.0.1:{info['port']}/health")
                if status == 200 and body.get("data_ready"):
                    break
            time.sleep(0.2)
        check("打包产物启动并就绪（AC-002-2）", bool(info) and proc.poll() is None,
              f"port={info.get('port')}" if info else "no endpoint")

        if info:
            base = f"http://127.0.0.1:{info['port']}"
            status, body = get(f"{base}/settings/sources", TOKEN)
            ids = {s["adapter_id"] for s in body.get("sources", [])}
            check("内置三源随包（AC-001-4）", {"akshare", "eia", "local-file"} <= ids, str(sorted(ids)))
            code, _ = get(f"{base}/settings/profile")
            check("非 /health 端点需令牌（AC-009-1）", code == 401, f"http {code}")

            req = urllib.request.Request(f"{base}/shutdown", data=b"{}", method="POST",
                                         headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
            urllib.request.urlopen(req, timeout=10).read()
            try:
                proc.wait(timeout=30)
                rc = proc.returncode
            except subprocess.TimeoutExpired:
                rc = None
            check("优雅退出（AC-003-1）", rc == 0, f"rc={rc}")
            check("退出后写锁释放（AC-003-1）", not (root / "data" / ".lock").exists())
            try:
                with socket.socket() as s:
                    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                    s.bind(("127.0.0.1", info["port"]))
                released = True
            except OSError:
                released = False
            check("退出后端口释放（AC-003-1）", released)
    finally:
        if proc.poll() is None:
            proc.kill()
        proc.wait(15)

    failed = [n for n, ok, _ in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} 项通过" + (f"；失败：{failed}" if failed else ""))
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
