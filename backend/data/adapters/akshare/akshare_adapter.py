"""akshare 适配器（AC-007-1）：能源品种主力/连续日线、指定合约、仓单日报、库存日报。

源符号约定（plan §2.1）与可注入取数点：
- `<品种>0`（如 SC0）→ `_get_main(symbol)`：主力连续日线
- `<合约代码>`（如 SC2401）→ `_get_contract(symbol)`：指定合约日线
- `<品种>_RECEIPT`（如 SC_RECEIPT）→ `_get_receipt(asset, start, end)`：交易所仓单日报
- `<品种>_STOCK`（如 FU_STOCK）→ `_get_stock(asset)`：库存日报（东方财富期货库存数据）

仓单/库存为数量型：源侧原始单位为桶/吨，按清单声明单位归一（kb/kton = 原始值 ÷ 1000）；
价格型不换算。
"""
from __future__ import annotations

import pandas as pd

from data.adapters.base import Adapter

_MAIN_SUFFIX = "0"  # 主力连续符号后缀（SC0/FU0/…）
_RECEIPT_SUFFIX = "_RECEIPT"
_STOCK_SUFFIX = "_STOCK"

# 数量型序列：清单声明单位 → 相对源侧原始单位（桶/吨）的除数
_QUANTITY_DIVISOR = {"kb": 1000.0, "kton": 1000.0}


def _get_main(symbol: str):
    """可注入：主力连续日线。"""
    import akshare as ak

    return ak.futures_main_sina(symbol=symbol)


def _get_contract(symbol: str):
    """可注入：指定合约日线。"""
    import akshare as ak

    return ak.futures_zh_daily_sina(symbol=symbol)


def _get_receipt(asset: str, start=None, end=None):
    """可注入：交易所仓单日报。

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


def _get_stock(asset: str):
    """可注入：库存日报（akshare futures_inventory_em，列 日期/库存/增减）。"""
    import akshare as ak

    return ak.futures_inventory_em(symbol=asset.lower())


def _route(symbol: str):
    """源符号 → (取数函数(start, end), 值列名, 是否数量型)。"""
    if symbol.endswith(_RECEIPT_SUFFIX):
        asset = symbol[: -len(_RECEIPT_SUFFIX)]
        return (lambda start, end: _get_receipt(asset, start, end)), "值", True
    if symbol.endswith(_STOCK_SUFFIX):
        asset = symbol[: -len(_STOCK_SUFFIX)]
        return (lambda start, end: _get_stock(asset)), "库存", True
    if symbol.endswith(_MAIN_SUFFIX) and len(symbol) == 3:
        return (lambda start, end: _get_main(symbol)), "收盘价", False
    # 指定合约（如 SC2401）
    return (lambda start, end: _get_contract(symbol)), "收盘价", False


class AkshareAdapter(Adapter):
    id = "akshare"

    def fetch(self, provide, range_start=None, range_end=None):
        symbol = provide.symbols[0]
        getter, value_col, quantity = _route(symbol)
        df = getter(range_start, range_end)
        raw = df.to_json(force_ascii=False) if df is not None else None
        if df is None or df.empty:
            return [], raw
        df = df.rename(columns={c: str(c).strip() for c in df.columns})
        # 列名归一：SDK 变体 → 规范列（F-03）
        if "date" in df.columns:
            df = df.rename(columns={"date": "日期"})
        if "close" in df.columns and value_col == "收盘价":
            df = df.rename(columns={"close": "收盘价"})
        if "receipt" in df.columns and value_col == "值":
            df = df.rename(columns={"receipt": "值"})
        if "var" in df.columns and symbol.endswith(_RECEIPT_SUFFIX):
            df = df[df["var"].astype(str).str.upper() == symbol[: -len(_RECEIPT_SUFFIX)].upper()]
        date_col = next((c for c in ("日期", "date", "Date") if c in df.columns), None)
        if date_col is None:
            raise ValueError("响应缺少日期列")
        if value_col not in df.columns:
            raise ValueError(f"响应缺少值列: {value_col}")
        divisor = _QUANTITY_DIVISOR.get(getattr(provide, "unit", None), 1.0) if quantity else 1.0
        rows = []
        for _, r in df.iterrows():
            ts = pd.to_datetime(r[date_col]).to_pydatetime()
            if range_start and ts < range_start:
                continue
            if range_end and ts > range_end:
                continue
            rows.append((ts, float(r[value_col]) / divisor))
        return rows, raw

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
