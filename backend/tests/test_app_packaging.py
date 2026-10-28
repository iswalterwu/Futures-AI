"""T-04b: real PyInstaller collection parity, excluding only pyarrow test data."""
from __future__ import annotations

import importlib.util
import runpy
import subprocess
from pathlib import Path

import pytest

from tools import build_backend

BACKEND = Path(__file__).resolve().parent.parent
HOOK = BACKEND / "tools" / "pyinstaller_hooks" / "hook-pyarrow.py"


@pytest.fixture(scope="module")
def pyarrow_hooks():
    pytest.importorskip("pyarrow", reason="pyarrow hook applies only when pyarrow is installed")
    contrib = importlib.util.find_spec("_pyinstaller_hooks_contrib")
    upstream = Path(contrib.origin).parent / "stdhooks" / "hook-pyarrow.py"
    return runpy.run_path(str(HOOK)), runpy.run_path(str(upstream))


def is_test_destination(destination: str) -> bool:
    destination = destination.replace("\\", "/")
    return destination == "pyarrow/tests" or destination.startswith("pyarrow/tests/")


def test_build_command_wires_repository_hook_dir(monkeypatch):
    calls = []

    def record_run(cmd, *, cwd):
        calls.append((cmd, cwd))
        return subprocess.CompletedProcess(cmd, 7)

    monkeypatch.setattr(subprocess, "run", record_run)
    assert build_backend.main([]) == 7
    assert len(calls) == 1
    cmd, cwd = calls[0]
    assert cwd == str(BACKEND)
    assert cmd.count("--additional-hooks-dir") == 1
    hook_dir = cmd[cmd.index("--additional-hooks-dir") + 1]
    assert hook_dir == str(HOOK.parent)
    assert Path(hook_dir).is_absolute()
    assert (Path(hook_dir) / "hook-pyarrow.py").is_file()
    excluded = [cmd[i + 1] for i, value in enumerate(cmd) if value == "--exclude-module"]
    assert excluded == ["pytest", "tests"]
    assert cmd.count("--add-data") == 1
    separator = ";" if build_backend.sys.platform == "win32" else ":"
    assert cmd[cmd.index("--add-data") + 1] == f"{BACKEND / 'data' / 'adapters'}{separator}data/adapters"


def test_pyarrow_hook_collects_no_test_assets(pyarrow_hooks):
    repository, _ = pyarrow_hooks
    for collection in ("datas", "binaries"):
        assert not [entry for entry in repository[collection] if is_test_destination(entry[1])]
    assert not [name for name in repository["hiddenimports"]
                if name == "pyarrow.tests" or name.startswith("pyarrow.tests.")]


def test_pyarrow_hook_matches_contrib_except_tests(pyarrow_hooks):
    repository, upstream = pyarrow_hooks
    assert set(repository["hiddenimports"]) == set(upstream["hiddenimports"])
    assert set(repository["binaries"]) == set(upstream["binaries"])
    removed = {entry for entry in upstream["datas"] if is_test_destination(entry[1])}
    assert removed, "Installed contrib hook must reproduce the test-data collection"
    assert set(repository["datas"]) == set(upstream["datas"]) - removed
    assert {"pyarrow.lib", "pyarrow.compute", "pyarrow.parquet"} <= set(repository["hiddenimports"])
    assert {"arrow.dll", "parquet.dll"} <= {Path(source).name for source, _ in repository["binaries"]}
    assert ("api.h", "pyarrow/include/arrow") in {
        (Path(source).name, destination.replace("\\", "/"))
        for source, destination in repository["datas"]
    }
