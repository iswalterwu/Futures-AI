"""AC-009-2（零凭证字面量，三正则组）与 AC-002-4（零手写 series_id，辅助 grep + 构造性）。

扫描范围 = backend/（含 backend/tests/）与仓库根 tests/（若存在）；
排除 backend/tests/fixtures/credential_scan_fixtures/ 与 manual_series_id_fixtures/。
阳性样例必须命中对应规则（防规则空转）。
"""
from __future__ import annotations

import re
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent
REPO_ROOT = BACKEND.parent

EXCLUDE_DIRS = {"credential_scan_fixtures", "manual_series_id_fixtures"}

CRED_PATTERNS = [
    re.compile(r"(?i)(api[_-]?key|apikey|secret|token|password)\s*[:=]\s*[\"'][^\"']{8,}[\"']"),
    re.compile(r"(?i)(api[_-]?key|apikey|secret|token|password)\s*[:=]\s*(?!\s*[A-Za-z0-9_.\-]*\s*\()\s*[A-Za-z0-9_\-]{8,}"),
    re.compile(r"(?i)(api[_-]?key|apikey|secret|token|password)\s*:\s*str\s*=\s*[\"'][^\"']{8,}[\"']"),
]

SERIES_ID_PATTERN = re.compile(r"(?<![\w.])series_id\s*=\s*[\"']")


def _scan_roots() -> list[Path]:
    roots = [BACKEND]
    root_tests = REPO_ROOT / "tests"
    if root_tests.is_dir():
        roots.append(root_tests)
    return roots


def _iter_text_files(roots: list[Path]):
    for root in roots:
        for p in root.rglob("*"):
            if not p.is_file():
                continue
            if p.suffix not in (".py", ".yaml", ".yml", ".json", ".toml", ".md", ".txt"):
                continue
            if any(part in EXCLUDE_DIRS for part in p.parts):
                continue
            yield p


def scan_credentials() -> list[tuple[Path, int]]:
    hits = []
    for p in _iter_text_files(_scan_roots()):
        for lineno, line in enumerate(p.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if any(pat.search(line) for pat in CRED_PATTERNS):
                hits.append((p, lineno))
    return hits


def scan_manual_series_id() -> list[tuple[Path, int]]:
    hits = []
    for p in _iter_text_files(_scan_roots()):
        for lineno, line in enumerate(p.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if SERIES_ID_PATTERN.search(line):
                hits.append((p, lineno))
    return hits


def test_no_credential_literals():
    hits = scan_credentials()
    assert hits == [], f"凭证字面量命中: {hits}"


def test_no_manual_series_id():
    hits = scan_manual_series_id()
    assert hits == [], f"手写 series_id 命中: {hits}"


def test_positive_samples_hit():
    """阳性样例必须命中规则（防空转）。"""
    fix = BACKEND / "tests" / "fixtures" / "credential_scan_fixtures"
    samples = list(fix.glob("*")) if fix.is_dir() else []
    assert samples, "credential 阳性样例缺失"
    matched = 0
    for s in samples:
        text = s.read_text(encoding="utf-8", errors="replace")
        if any(pat.search(text) for pat in CRED_PATTERNS):
            matched += 1
    assert matched == len(samples), f"{len(samples) - matched} 个阳性样例未命中规则"
    fix2 = BACKEND / "tests" / "fixtures" / "manual_series_id_fixtures"
    samples2 = list(fix2.glob("*")) if fix2.is_dir() else []
    assert samples2, "series_id 阳性样例缺失"
    for s in samples2:
        assert SERIES_ID_PATTERN.search(s.read_text(encoding="utf-8", errors="replace")), s
