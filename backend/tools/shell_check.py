"""打包产物冒烟（desktop-shell T-04；plan §3.3、§5）。

用法：cd backend && python tools/shell_check.py
前置：先 `python tools/build_backend.py`。

检查项（对应 spec AC）：产物存在、/health 就绪、内置三源随包、Bearer 鉴权、/shutdown 优雅退出、
写锁释放、端口释放、产物不含测试/用户数据。
"""
from __future__ import annotations

import json
import os
import shutil
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


def wait_for_health(proc, port_file: Path, timeout: float = 90) -> dict | None:
    """端点文件只是发现机制；只返回亲自探测成功的端点。"""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline and proc.poll() is None:
        try:
            info = json.loads(port_file.read_text(encoding="utf-8"))
            status, body = get(f"http://127.0.0.1:{info['port']}/health")
            if status == 200 and body.get("status") == "ok" and body.get("data_ready") is True:
                return info
        except (OSError, ValueError):
            pass
        time.sleep(0.2)
    return None


def listening_addresses(pid: int) -> list[str]:
    """按本次创建的 PID 检查 Windows 的全部 TCP LISTENING 行。"""
    result = subprocess.run(["netstat", "-ano", "-p", "TCP"], check=True,
                            capture_output=True, text=True, timeout=15)
    return [fields[1].rsplit(":", 1)[0] for line in result.stdout.splitlines()
            if len(fields := line.split()) == 5 and fields[0] == "TCP"
            and fields[3] == "LISTENING" and fields[4] == str(pid)]


def package_exclusions(app_dir: Path) -> list[str]:
    """Plan §7.4 冻结黑名单；第三方同名条目也必须报告，不能豁免。"""
    denied = []
    for path in app_dir.rglob("*"):
        name = path.name.lower()
        relative = path.relative_to(app_dir).as_posix()
        if (name.endswith((".duckdb", ".duckdb.wal", ".sqlite", ".log"))
                or name in {"profile.bin", "eia_api_key.bin", "host.json", "mcp_endpoint.json",
                            "shell-prefs.json", "pytest", "_pytest"}
                or name.startswith((".env", "pytest-"))
                or (path.is_dir() and name in {"creds", "profile", "tests", ".git"})
                or (name == "electron-builder" and path.parent.name.lower() == "node_modules")):
            denied.append(relative)
    return sorted(denied)


def main() -> int:
    results.clear()
    check("打包产物存在", EXE.is_file(), str(EXE))
    if not EXE.is_file():
        print("\n请先运行: python tools/build_backend.py")
        return 1

    app_dir = EXE.parent
    denied = package_exclusions(app_dir)
    check("产物不含黑名单文件（AC-001-4）", not denied, ", ".join(denied))

    root = Path(tempfile.mkdtemp(prefix="futuresai-shellcheck-")) / "root"
    port_file = root.parent / "host.json"
    proc = subprocess.Popen(
        [str(EXE), "--root", str(root), "--port-file", str(port_file), "--token", TOKEN,
         "--exit-on-stdin-eof"],
        cwd=str(app_dir), env={**os.environ, "PYTHONIOENCODING": "utf-8"},
        stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        info = wait_for_health(proc, port_file)
        check("就绪：/health 200 且 data_ready（AC-002-2）", info is not None,
              "health=200/ok/true" if info else "未观测到健康检查成功")

        if info:
            addresses = listening_addresses(proc.pid)
            check("监听地址仅 127.0.0.1（AC-009-1）", bool(addresses) and set(addresses) == {"127.0.0.1"},
                  f"pid={proc.pid}, LISTENING={addresses}")
            base = f"http://127.0.0.1:{info['port']}"
            status, body = get(f"{base}/settings/sources", TOKEN)
            ids = {s["adapter_id"] for s in body.get("sources", [])}
            check("内置三源随包（AC-001-4）", {"akshare", "eia", "local-file"} <= ids, str(sorted(ids)))
            code, _ = get(f"{base}/settings/profile")
            check("非 /health 端点需令牌（AC-009-1）", code == 401, f"http {code}")

            req = urllib.request.Request(f"{base}/shutdown", data=b"{}", method="POST",
                                         headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=10) as response:
                response.read()
            try:
                proc.wait(timeout=30)
                rc = proc.returncode
            except subprocess.TimeoutExpired:
                rc = None
            check("优雅退出（AC-003-1）", rc == 0, f"rc={rc}")
            check("退出后写锁释放（AC-003-1）", not (root / "data" / ".lock").exists())
            check("退出后只读端点删除（AC-003-1）", not (root / "data" / "mcp_endpoint.json").exists())
            try:
                with socket.socket() as s:
                    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                    s.bind(("127.0.0.1", info["port"]))
                released = True
            except OSError:
                released = False
            check("退出后端口释放（AC-003-1）", released)
    except (OSError, ValueError, subprocess.SubprocessError) as exc:
        check("冒烟执行", False, type(exc).__name__)
    finally:
        proc.stdin.close()
        try:
            proc.wait(5)
        except subprocess.TimeoutExpired:
            proc.kill()  # 仅结束本运行创建的进程
            proc.wait(15)
        check("本次后端进程已退出", proc.poll() is not None, f"pid={proc.pid}")
        shutil.rmtree(root.parent)
        check("临时目录已删除", not root.parent.exists())

    failed = [n for n, ok, _ in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} 项通过" + (f"；失败：{failed}" if failed else ""))
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
