"""变异验证（可复现的"测试守护力"证据）。

用法：
    cd backend && python tools/mutations.py            # 跑全部
    cd backend && python tools/mutations.py settings   # 只跑名字含 settings 的

每个变异：注入一处旧行为 → 跑指定测试 → **必须失败**（KILLED）；否则说明该行为没被测试守住。
退出码：全部 KILLED 为 0，存在 SURVIVED 为 1。运行前请确保没有别的测试在跑（会临时改源码）。
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent

MUTATIONS: list[dict] = [
    dict(
        name="settings/引导不校验（非法值落盘）",
        file="settings/cli.py",
        old='                profile = update_profile(root, **{field: raw})  # 逐项校验并落盘（非法不写）',
        new='                from settings.profile import save as _save\n'
            '                _save(root, profile.model_copy(update={field: raw}))',
        test="tests/test_settings_cli.py::TestOnboard::test_invalid_email_rejected_then_retry",
    ),
    dict(
        name="settings/不可读凭证显示为免凭证回退",
        file="settings/sources.py",
        old='        elif credential_state == "unreadable":\n            path = PATH_BLOCKED  # 凭证故障：既不回退也不可用',
        new='        elif credential_state == "unreadable":\n            path = PATH_OFFLINE',
        test="tests/test_settings_sources.py::TestPaths::test_eia_unreadable_credential_reports_error",
    ),
    dict(
        name="settings/getpass 无法隐藏时仍继续",
        file="settings/cli.py",
        old="    if not (sys.stdin and sys.stdin.isatty()):",
        new="    if False:",
        test="tests/test_settings_cli.py::TestEchoSafety::test_non_tty_input_aborts_without_reading",
    ),
    dict(
        name="data-layer/无 key 不回退（直接报错）",
        file="data/adapters/eia/eia_adapter.py",
        old="        if creds.exists(self.creds_dir, self.credential_ref):\n            return self._fetch_api(provide, range_start, range_end)\n        return self._fetch_offline(provide, range_start, range_end)",
        new="        return self._fetch_api(provide, range_start, range_end)",
        test="tests/test_adapters_builtin.py::TestEia::test_no_key_falls_back_to_offline",
    ),
    dict(
        name="data-layer/凭证故障静默回退",
        file="data/adapters/eia/eia_adapter.py",
        old="        if creds.exists(self.creds_dir, self.credential_ref):",
        new="        if False:",
        test="tests/test_adapters_builtin.py::TestEia::test_corrupt_key_errors_without_fallback",
    ),
    dict(
        name="data-layer/内置清单回流 stock",
        file="data/adapters/akshare/manifest.yaml",
        old='  - descriptor: {asset: pg, geo: cn, measure: receipt, contract: ""}\n    symbols: ["PG_RECEIPT"]',
        new='  - descriptor: {asset: pg, geo: cn, measure: receipt, contract: ""}\n    symbols: ["PG_RECEIPT"]\n'
            '  - descriptor: {asset: pg, geo: cn, measure: stock, contract: ""}\n    symbols: ["PG_STOCK"]\n'
            "    unit: kton\n    freq: 1d\n    tz: Asia/Shanghai\n    priority: 100\n"
            "    fetch: {modes: [on_demand], history_days: 3650}\n    update: {lag_min: 0, revises: true}",
        test="tests/test_review_round14.py::TestQuantityUnits::test_builtin_coverage_r007",
    ),
    # ---- data-layer：只读通道与事务（第十九/二十轮） ----
    dict(
        name="data-layer/BEGIN 移出回滚保护",
        file="data/store/duck.py",
        old='        try:\n            self.con.execute("BEGIN")  # 纳入保护：BEGIN 刚生效即被中断也会回滚',
        new='        self.con.execute("BEGIN")\n        try:',
        test="tests/test_review_round18.py::TestBeginInterrupt",
    ),
]


def run_mutation(m: dict) -> tuple[str, str]:
    path = BACKEND / m["file"]
    original = path.read_text(encoding="utf-8")
    if original.count(m["old"]) != 1:
        return "SKIP(未匹配)", f"命中 {original.count(m['old'])} 次"
    backup = path.with_suffix(path.suffix + ".mutbak")
    shutil.copy(path, backup)
    try:
        path.write_text(original.replace(m["old"], m["new"]), encoding="utf-8")
        r = subprocess.run(
            [sys.executable, "-m", "pytest", m["test"], "-q", "-x", "-p", "no:cacheprovider"],
            cwd=str(BACKEND),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=600,
            env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
        )
        if r.returncode in (4, 5) or "no tests ran" in r.stdout:
            return "BROKEN(测试未执行)", (r.stdout.strip().splitlines() or [""])[-1]
        if r.returncode != 0:
            return "KILLED", (r.stdout.strip().splitlines() or [""])[-1]
        return "SURVIVED", "目标测试仍通过（该行为未被守护）"
    finally:
        shutil.move(backup, path)


def main(argv: list[str]) -> int:
    needle = argv[1] if len(argv) > 1 else ""
    selected = [m for m in MUTATIONS if needle in m["name"]]
    if not selected:
        print(f"没有匹配 {needle!r} 的变异")
        return 1
    results = []
    for m in selected:
        status, detail = run_mutation(m)
        results.append((m["name"], status, detail))
        print(f"{status:14s} {m['name']}  — {detail}")
    survived = [r for r in results if r[1] != "KILLED"]  # BROKEN 也计入未检出
    print(f"\n{len(results) - len(survived)}/{len(results)} 被检出")
    return 0 if not survived else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
