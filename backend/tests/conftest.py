"""pytest 隔离临时根 fixture（AGENTS.md §4：不接触真实私有数据）。"""
from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest


@pytest.fixture()
def tmp_root(tmp_path: Path) -> Path:
    """隔离数据目录根：data/、adapters/、creds/ 布局（plan §3.3）。"""
    (tmp_path / "data").mkdir()
    (tmp_path / "adapters").mkdir()
    (tmp_path / "creds").mkdir()
    return tmp_path


@pytest.fixture()
def data_dir(tmp_root: Path) -> Path:
    return tmp_root / "data"


@pytest.fixture()
def user_adapters_dir(tmp_root: Path) -> Path:
    return tmp_root / "adapters"
