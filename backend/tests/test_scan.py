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
    re.compile(r"(?i)([\"']?(?:api[_-]?key|apikey|secret|token|password)[\"']?)\s*[:=]\s*[\"'][^\"']{8,}[\"']"),
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


CRED_FIXTURES = BACKEND / "tests" / "fixtures" / "credential_scan_fixtures"


def _fixture_lines(name: str) -> list[str]:
    lines = (CRED_FIXTURES / name).read_text(encoding="utf-8").splitlines()
    return [ln for ln in lines if ln.strip() and not ln.startswith("#")]


def test_positive_samples_hit_each_rule():
    """阳性样例逐条命中其标注的规则组，且三组规则各自有样例（任一组失效即报警）。"""
    covered = set()
    for line in _fixture_lines("positives.txt"):
        body, _, mark = line.rpartition("⟨rule-")
        n = int(mark.rstrip("⟩"))
        assert CRED_PATTERNS[n - 1].search(body.strip()), f"规则 {n} 未命中：{body.strip()}"
        covered.add(n)
    assert covered == set(range(1, len(CRED_PATTERNS) + 1)), f"缺少阳性样例的规则组：{covered}"


def test_negative_samples_not_hit():
    """合法的凭证引用写法不得被任一规则命中（防误报）。"""
    lines = _fixture_lines("negatives.txt")
    assert lines
    for line in lines:
        assert not any(p.search(line) for p in CRED_PATTERNS), f"误报：{line}"


def test_positive_samples_hit():
    """手写 series_id 阳性样例必须命中规则（防空转）。"""
    fix2 = BACKEND / "tests" / "fixtures" / "manual_series_id_fixtures"
    samples2 = list(fix2.glob("*")) if fix2.is_dir() else []
    assert samples2, "series_id 阳性样例缺失"
    for s in samples2:
        assert SERIES_ID_PATTERN.search(s.read_text(encoding="utf-8", errors="replace")), s
