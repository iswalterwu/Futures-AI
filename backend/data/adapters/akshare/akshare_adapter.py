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


def _get_receipt(asset: str):
    """可注入：交易所仓单/库存日报（返回与日线同形：日期/收盘价 列名归一为 日期/值）。"""
    import akshare as ak

    df = ak.get_receipt(start_date="20260101", end_date="20261231", vars_list=[asset.upper()])
    if df is None or df.empty:
        return pd.DataFrame(columns=["日期", "值"])
    col = [c for c in df.columns if c not in ("日期", "date")]
    df = df.rename(columns={col[0]: "值", df.columns[0]: "日期"})
    return df[["日期", "值"]]


def _route(symbol: str):
    """源符号 → (取数函数, 值列名)。"""
    if symbol.endswith("_RECEIPT"):
        return lambda: _get_receipt(symbol.split("_")[0]), "值"
    if symbol.endswith(_MAIN_SUFFIX) and len(symbol) == 3:
        return lambda: _get_main(symbol), "收盘价"
    # 指定合约（如 SC2401）
    return lambda: _get_contract(symbol), "收盘价"


class AkshareAdapter(Adapter):
    id = "akshare"

    def fetch(self, provide, range_start=None, range_end=None):
        symbol = provide.symbols[0]
        getter, value_col = _route(symbol)
        df = getter()
        if df is None or df.empty:
            return []
        df = df.rename(columns={c: str(c).strip() for c in df.columns})
        # 合约接口返回 date/close 列名 → 归一（F-03）
        if "date" in df.columns:
            df = df.rename(columns={"date": "日期"})
        if "close" in df.columns and value_col == "收盘价":
            df = df.rename(columns={"close": "收盘价"})
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
