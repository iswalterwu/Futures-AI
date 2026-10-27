"""本地文件适配器 + import 向导核心（AC-007-3）。

向导 = CLI 交互；本模块承载可测试的核心：猜测映射、保存/复用映射、按映射解析入库。
直接 fetch 提示使用 import 向导。
"""
from __future__ import annotations

import json
from datetime import datetime

import pandas as pd

from data.adapters.base import Adapter
from data.fetch.on_demand import FetchError

DATE_COLS = {"日期", "date", "Date", "时间", "timestamp"}
VALUE_COLS = {"收盘价", "close", "Close", "value", "价格", "收盘"}


def guess_mapping(df: pd.DataFrame) -> dict:
    """猜测列映射：{date_col, value_col}；无把握 → 空值供用户确认。"""
    date_col = next((c for c in df.columns if str(c).strip() in DATE_COLS), None)
    value_col = next((c for c in df.columns if str(c).strip() in VALUE_COLS), None)
    return {"date_col": date_col, "value_col": value_col}


def parse_with_mapping(path: str, mapping: dict, start=None, end=None) -> tuple[list[tuple], bytes]:
    """按映射解析文件 → ([(ts, value)], raw_bytes)。时区统一 naive UTC（R2-01）。"""
    from pathlib import Path

    raw = Path(path).read_bytes()
    df = pd.read_csv(path) if str(path).lower().endswith(".csv") else pd.read_excel(path)
    if not mapping.get("date_col") or not mapping.get("value_col"):
        raise FetchError("validation_error", "列映射不完整，请先完成向导确认")
    rows = []
    for _, r in df.iterrows():
        ts = pd.to_datetime(r[mapping["date_col"]])
        if getattr(ts, "tzinfo", None) is not None:
            ts = ts.tz_convert("UTC").tz_localize(None)  # aware → naive UTC
        ts = ts.to_pydatetime()
        if start and ts < start:
            continue
        if end and ts > end:
            continue
        rows.append((ts, float(r[mapping["value_col"]])))
    return rows, raw


class LocalFileAdapter(Adapter):
    id = "local-file"

    def fetch(self, provide, range_start=None, range_end=None):
        raise FetchError(
            "validation_error",
            "本地文件源请使用 import 向导入库（CLI: futureai-data import <file>）",
        )

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
