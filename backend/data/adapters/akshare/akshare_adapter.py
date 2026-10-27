"""akshare 适配器（AC-007-1）：能源品种主力/连续日线、指定合约、仓单/库存日报。

三个取数点均可注入固定响应样本：
- `_get_main(symbol)`：主力连续日线（如 SC0）
- `_get_contract(symbol)`：指定合约日线（如 SC2401）
- `_get_receipt(asset)`：交易所仓单/库存日报（如 SC）
"""
from __future__ import annotations

from datetime import datetime

import pandas as pd

from data.adapters.base import Adapter

_MAIN_SUFFIX = "0"  # 主力连续符号后缀（SC0/FU0/…）


def _get_main(symbol: str):
    """可注入：主力连续日线。"""
    import akshare as ak

    return ak.futures_main_sina(symbol=symbol)


def _get_contract(symbol: str):
    """可注入：指定合约日线。"""
    import akshare as ak

    return ak.futures_zh_daily_sina(symbol=symbol)


def _get_receipt(asset: str, start=None, end=None):
    """可注入：交易所仓单/库存日报（归一为 日期/值 两列）。

    真实 SDK（akshare get_receipt）返回 var/receipt/receipt_chg/date：
    取 date 列 + receipt 列（F-03）。
    """
    import akshare as ak

    s = (start.strftime("%Y%m%d") if start else "20260101")
    e = (end.strftime("%Y%m%d") if end else "20261231")
    df = ak.get_receipt(start_date=s, end_date=e, vars_list=[asset.upper()])
    if df is None or df.empty:
        return pd.DataFrame(columns=["日期", "值"])
    return df  # 列归一由 fetch 统一处理（date→日期、receipt→值）


def _route(symbol: str):
    """源符号 → (取数函数, 值列名)。"""
    if symbol.endswith("_RECEIPT"):
        return lambda start=None, end=None: _get_receipt(symbol.split("_")[0], start, end), "值"
    if symbol.endswith(_MAIN_SUFFIX) and len(symbol) == 3:
        return lambda: _get_main(symbol), "收盘价"
    # 指定合约（如 SC2401）
    return lambda: _get_contract(symbol), "收盘价"


class AkshareAdapter(Adapter):
    id = "akshare"

    def fetch(self, provide, range_start=None, range_end=None):
        symbol = provide.symbols[0]
        getter, value_col = _route(symbol)
        if symbol.endswith("_RECEIPT"):
            df = getter(range_start, range_end)
        else:
            df = getter()
        if df is None or df.empty:
            return []
        df = df.rename(columns={c: str(c).strip() for c in df.columns})
        # 列名归一：SDK 变体 → 规范列（F-03）
        if "date" in df.columns:
            df = df.rename(columns={"date": "日期"})
        if "close" in df.columns and value_col == "收盘价":
            df = df.rename(columns={"close": "收盘价"})
        if "receipt" in df.columns and value_col == "值":
            df = df.rename(columns={"receipt": "值"})
        date_col = next(c for c in ("日期", "date", "Date") if c in df.columns)
        if value_col not in df.columns:
            raise ValueError(f"响应缺少值列: {value_col}")
        rows = []
        for _, r in df.iterrows():
            ts = pd.to_datetime(r[date_col]).to_pydatetime()
            if range_start and ts < range_start:
                continue
            if range_end and ts > range_end:
                continue
            rows.append((ts, float(r[value_col])))
        return rows

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
