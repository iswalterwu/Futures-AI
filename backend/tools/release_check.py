"""发布管线检查（tasks.md T-98）：wheel 构建 / 包内容 / 隔离安装 / 入口点 / 首启冒烟。

用法：cd backend && python tools/release_check.py
退出码：0 全部通过；1 存在失败项。不依赖仓库源码路径（安装后用独立目标目录运行）。
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent
MANIFESTS = ["data/adapters/akshare/manifest.yaml", "data/adapters/eia/manifest.yaml", "data/adapters/local_file/manifest.yaml"]

results: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, ok, detail))
    print(f"{'PASS' if ok else 'FAIL'}  {name}{('  — ' + detail) if detail else ''}")


def run(cmd: list[str], cwd: Path, env: dict | None = None, timeout: int = 600) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, cwd=str(cwd), capture_output=True, text=True, encoding="utf-8", errors="replace",
        timeout=timeout, env={**os.environ, "PYTHONIOENCODING": "utf-8", **(env or {})},
    )


def main() -> int:
    work = Path(tempfile.mkdtemp(prefix="futuresai-release-"))
    try:
        wheel_dir = work / "dist"
        wheel_dir.mkdir()
        # 1) 构建 wheel（build isolation：在隔离环境装 setuptools/wheel，不污染运行环境）
        r = run([sys.executable, "-m", "pip", "wheel", ".", "--no-deps", "-w", str(wheel_dir)], BACKEND)
        wheels = list(wheel_dir.glob("futuresai_data-*.whl"))
        check("构建 wheel", r.returncode == 0 and len(wheels) == 1, (r.stderr or r.stdout).strip().splitlines()[-1] if not wheels else wheels[0].name)
        if not wheels:
            return 1
        wheel = wheels[0]

        # 2) wheel 内容：包、内置清单、entry point 元数据
        with zipfile.ZipFile(wheel) as z:
            names = set(z.namelist())
            data_files = [n for n in names if n.startswith("data/") and n.endswith(".py")]
            missing = [m for m in MANIFESTS if m not in names]
            entry = [n for n in names if n.endswith("entry_points.txt")]
            entry_text = z.read(entry[0]).decode("utf-8") if entry else ""
        check("wheel 含 data 包", bool(data_files), f"{len(data_files)} 个模块")
        check("wheel 含三份内置清单", not missing, f"缺：{missing}" if missing else "")
        check("wheel 声明 CLI 入口", "futureai-data = data.cli:main" in entry_text, entry_text.strip()[:60])
        check("wheel 不含测试/临时数据", not any(n.startswith(("tests/", "dist/")) for n in names))

        # 3) 隔离安装（--no-deps：依赖由当前环境提供），验证不依赖仓库路径
        target = work / "site"
        r = run([sys.executable, "-m", "pip", "install", "--no-deps", "--target", str(target), str(wheel)], work)
        check("wheel 可安装（隔离目录）", r.returncode == 0, (r.stderr or "").strip().splitlines()[-1] if r.returncode else "")
        if r.returncode != 0:
            return 1
        installed = sorted((target / "data" / "adapters").glob("*/manifest.yaml"))
        check("安装后内置清单在位", len(installed) == 3, f"{len(installed)} 份")
        env = {"PYTHONPATH": str(target)}

        # 4) 在隔离目录导入并读取版本/入口点
        code = (
            "import json, importlib.metadata as md, data.catalog.descriptor as d\n"
            "print(json.dumps({'version': md.version('futuresai-data'),"
            " 'scripts': [e.name + '=' + e.value for e in md.entry_points(group='console_scripts')"
            " if e.name == 'futureai-data'],"
            " 'golden': d.derive_id({'asset': 'sc', 'geo': 'world', 'measure': 'close', 'contract': ''})}))\n"
        )
        r = run([sys.executable, "-c", code], work, env=env)  # 不用 -I：-I 会忽略 PYTHONPATH
        try:
            info = json.loads(r.stdout.strip().splitlines()[-1])
        except Exception:
            info = {}
        check(
            "隔离导入与元数据",
            info.get("version") == "0.1.0"
            and info.get("scripts") == ["futureai-data=data.cli:main"]
            and info.get("golden") == "82b6ce0c3b909b82dad25623ef47f66e",
            json.dumps(info, ensure_ascii=False),
        )

        # 5) 首启冒烟：空数据目录 → list sources 列出内置三源，且不在磁盘建库
        root = work / "fresh-root"
        r = run([sys.executable, "-m", "data.cli", "--root", str(root), "list", "sources"], work, env=env)
        sources = []
        try:
            sources = sorted(s["adapter_id"] for s in json.loads(r.stdout)["sources"])
        except Exception:
            pass
        check(
            "首启冒烟（只读，不建库）",
            r.returncode == 0 and sources == ["akshare", "eia", "local-file"],
            f"rc={r.returncode} sources={sources} {r.stderr.strip()[:120]}",
        )
        check("首启未落盘库文件", not (root / "data" / "catalog.sqlite").exists())

        # 6) 写命令冒烟：init 建库 + 目录编译
        r = run([sys.executable, "-m", "data.cli", "--root", str(root), "config", "disable", "eia"], work, env=env)
        check("写命令冒烟（建库+目录编译）", r.returncode == 0 and (root / "data" / "catalog.sqlite").exists(), f"rc={r.returncode} {r.stderr.strip()[:120]}")
    finally:
        shutil.rmtree(work, ignore_errors=True)

    failed = [name for name, ok, _ in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} 项通过" + (f"；失败：{failed}" if failed else ""))
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
