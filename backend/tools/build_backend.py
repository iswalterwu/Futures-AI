"""打包后端宿主为可执行目录（desktop-shell plan §3.3，T-04）。

用法：cd backend && python tools/build_backend.py [--clean]
产物：backend/dist/futuresai-backend/futuresai-backend.exe（onedir）

要点：
- 显式带上三份内置 manifest（package-data 不会自动进 PyInstaller 产物）
- 不带入测试、构建目录与用户数据（AC-001-4）
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent
DIST = BACKEND / "dist"
WORK = BACKEND / "build" / "pyinstaller"
APP_NAME = "futuresai-backend"


def data_arg() -> str:
    """`--add-data 源:目标`（Windows 用分号分隔）。"""
    manifests = BACKEND / "data" / "adapters"
    sep = ";" if sys.platform == "win32" else ":"
    return f"{manifests}{sep}data/adapters"


def main(argv: list[str]) -> int:
    clean = "--clean" in argv
    if clean:
        for p in (DIST / APP_NAME, WORK):
            shutil.rmtree(p, ignore_errors=True)

    cmd = [
        sys.executable, "-m", "PyInstaller",
        "--noconfirm",
        "--onedir",
        "--name", APP_NAME,
        "--distpath", str(DIST),
        "--workpath", str(WORK),
        "--specpath", str(WORK),
        "--add-data", data_arg(),
        "--collect-submodules", "data",
        "--collect-submodules", "settings",
        "--collect-submodules", "app",
        "--exclude-module", "pytest",
        "--exclude-module", "tests",
        str(BACKEND / "app" / "__main__.py"),
    ]
    print("运行:", " ".join(cmd))
    result = subprocess.run(cmd, cwd=str(BACKEND))
    if result.returncode != 0:
        return result.returncode

    exe = DIST / APP_NAME / f"{APP_NAME}.exe"
    if sys.platform != "win32":
        exe = DIST / APP_NAME / APP_NAME
    if not exe.exists():
        print(f"未找到产物：{exe}", file=sys.stderr)
        return 1
    print(f"产物：{exe}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
