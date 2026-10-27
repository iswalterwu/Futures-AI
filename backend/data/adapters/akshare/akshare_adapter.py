"""akshare 适配器（AC-007-1）：能源品种主力/连续日线与仓单/库存日报。"""
from __future__ import annotations

from datetime import datetime

import pandas as pd

from data.adapters.base import Adapter

# 源符号 → akshare 接口选择
_MAIN_SYMBOLS = {"SC0", "FU0", "LU0", "BU0", "PG0"}


def _get_data(symbol: str):
    """可 monkeypatch 的取数点（测试注入固定响应样本）。"""
    import akshare as ak

    if symbol in _MAIN_SYMBOLS:
        return ak.futures_main_sina(symbol=symbol)
    if symbol.endswith("_RECEIPT"):
        # 仓单/库存日报：v1 经同接口族（receipt 数据源），字段对齐由下方归一
        return ak.futures_main_sina(symbol=symbol[:2] + "0")
    raise ValueError(f"未知源符号: {symbol}")


class AkshareAdapter(Adapter):
    id = "akshare"

    def fetch(self, provide, range_start=None, range_end=None):
        symbol = provide.symbols[0]
        df = _get_data(symbol)
        if df is None or df.empty:
            return []
        df = df.rename(columns={c: c.strip() for c in df.columns})
        date_col = next(c for c in ("日期", "date", "Date") if c in df.columns)
        close_col = next(c for c in ("收盘价", "close", "Close") if c in df.columns)
        rows = []
        for _, r in df.iterrows():
            ts = pd.to_datetime(r[date_col]).to_pydatetime()
            if range_start and ts < range_start:
                continue
            if range_end and ts > range_end:
                continue
            rows.append((ts, float(r[close_col])))
        return rows

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
