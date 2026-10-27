"""akshare 适配器（AC-007-1）：能源品种主力/连续日线、指定合约、仓单日报、库存日报。

源符号约定（plan §2.1）与可注入取数点：
- `<品种>0`（如 SC0）→ `_get_main(symbol)`：主力连续日线
- `<合约代码>`（如 SC2401）→ `_get_contract(symbol)`：指定合约日线
- `<品种>_RECEIPT`（如 SC_RECEIPT）→ `_get_receipt(asset, start, end)`：交易所仓单日报
- `<品种>_STOCK`（如 FU_STOCK）→ `_get_stock(asset)`：库存日报（东方财富期货库存数据）

仓单/库存为数量型：按品种登记的源侧原始口径（桶/吨/手）折算到清单声明单位（kb/kton），
未登记品种或量纲不匹配 → validation_error（不产出错标数据）；价格型不换算。
上期所/能源中心的仓单日报自解析官方页面（akshare 的品种名映射在上游新增品种后会整体崩溃）。
批次覆盖 = effective_range 解析出的实际请求窗口（仓单/库存为滚动窗口，AC-005-2）。
上游 SDK 调用有硬超时（SDK 内部请求未设超时，挂起不得长期占住写路径）；
SDK 在其工作线程内的运行期打印按线程改道 stderr（plan §2.2 CLI 输出契约）。
"""
from __future__ import annotations

import sys
import threading
from datetime import date, datetime, timedelta

import pandas as pd

from data.adapters.base import Adapter
from data.fetch.on_demand import FetchError

AKSHARE_TIMEOUT_S = 300  # 单次上游调用上限（含仓单逐日抓取）
RECEIPT_DEFAULT_DAYS = 30  # 仓单未给起点时的回看窗口（逐日抓取）
STOCK_DEFAULT_DAYS = 365  # 库存未给起点时的回看窗口（须落在源的单页窗口内）
STOCK_PAGE_ROWS = 500  # 东财库存每次只返回最近 500 个交易日

_MAIN_SUFFIX = "0"  # 主力连续符号后缀（SC0/FU0/…）
_RECEIPT_SUFFIX = "_RECEIPT"
_STOCK_SUFFIX = "_STOCK"

# 数量型（仓单/库存）源侧原始口径：品种 → (基准量纲, 每原始单位折合的基准量)
# 上期所/能源中心按吨（FU/BU/LU）、桶（SC）计；大商所 PG 按手计，合约规格 20 吨/手
_RAW_QUANTITY = {
    "SC": ("bbl", 1.0),
    "FU": ("ton", 1.0),
    "BU": ("ton", 1.0),
    "LU": ("ton", 1.0),
    "PG": ("ton", 20.0),
}

# 上期所/能源中心仓单页面（自解析）：品种 → 页面上的品种名
SHFE_RECEIPT_URL = "https://www.shfe.com.cn/data/tradedata/future/stockdata/dailystock_{date}/ZH/all.html"
SHFE_RECEIPT_NAMES = {
    "SC": "中质含硫原油",
    "FU": "燃料油",
    "BU": "石油沥青",
    "LU": "低硫燃料油",
}
# 清单声明单位 → (基准量纲, 除数)
_DECLARED_QUANTITY = {"kb": ("bbl", 1000.0), "kton": ("ton", 1000.0)}


def _get_main(symbol: str):
    """可注入：主力连续日线。"""
    import akshare as ak

    return ak.futures_main_sina(symbol=symbol)


def _get_contract(symbol: str):
    """可注入：指定合约日线。"""
    import akshare as ak

    return ak.futures_zh_daily_sina(symbol=symbol)


def _receipt_calendar_last() -> date:
    """可注入：akshare 仓单抓取所用静态交易日历的末日（日历外的日期被 SDK 当作非交易日跳过）。"""
    from akshare.futures import receipt as ak_receipt

    last = max(ak_receipt.calendar)
    return date(int(last[:4]), int(last[4:6]), int(last[6:8]))


def _get_receipt(asset: str, start=None, end=None):
    """可注入：交易所仓单日报。

    上期所/能源中心（SC/FU/BU/LU）自解析官方页面：akshare.get_receipt 的品种名映射
    在上游新增品种（如“20号胶”）后会整体崩溃（list.index），自解析只取需要的品种。
    其他交易所（如大商所 PG）仍用 SDK。请求终点超出 SDK 交易日历 → validation_error（不静默 0 行）。
    """
    import akshare as ak

    end_d = end.date() if end else date.today()
    start_d = start.date() if start else end_d - timedelta(days=RECEIPT_DEFAULT_DAYS)
    last = _receipt_calendar_last()
    if end_d > last:
        raise FetchError(
            "validation_error",
            f"请求终点 {end_d:%Y-%m-%d} 超出 akshare 交易日历覆盖（止于 {last:%Y-%m-%d}），"
            "仓单无法可靠抓取；请升级 akshare 并同步更新 backend/constraints.txt 后重试",
        )
    if asset.upper() in SHFE_RECEIPT_NAMES:
        return _get_shfe_receipt(asset.upper(), start_d, end_d)
    df = ak.get_receipt(
        start_date=start_d.strftime("%Y%m%d"),
        end_date=end_d.strftime("%Y%m%d"),
        vars_list=[asset.upper()],
    )
    if df is None or df.empty:
        return pd.DataFrame(columns=["日期", "值"])
    return df  # 列归一由 fetch 统一处理（date→日期、receipt→值）

def _shfe_page(date_str: str) -> str:
    """可注入：上期所/能源中心仓单日报页面（HTML）。"""
    import requests
    from akshare.futures import cons

    resp = requests.get(SHFE_RECEIPT_URL.format(date=date_str), headers=cons.shfe_headers, timeout=30)
    resp.raise_for_status()
    return resp.text


def _parse_shfe_receipt(html: str, variety_name: str) -> float | None:
    """从仓单页面解析某品种的仓单合计（仓库 + 厂库）。页面首表为日期，其后每表一品种。"""
    import io
    import re

    total = None
    for table in pd.read_html(io.StringIO(html))[1:]:
        if table.shape[1] < 3 or len(table) < 2:
            continue
        name = re.sub(r"[（(].*?[）)]", "", str(table.iloc[0, 1])).strip()
        if name != variety_name:
            continue
        try:
            value = float(str(table.iloc[-1, 2]).replace(",", ""))
        except (TypeError, ValueError):
            continue
        total = value if total is None else total + value
    return total


def _get_shfe_receipt(asset: str, start_d: date, end_d: date):
    """逐交易日抽上期所页面 → 原始单位（桶/吨）的 日期/值 两列。"""
    from akshare.futures import receipt as ak_receipt

    name = SHFE_RECEIPT_NAMES[asset]
    trading = set(ak_receipt.calendar)
    rows = []
    day = start_d
    while day <= end_d:
        key = day.strftime("%Y%m%d")
        if key in trading:
            value = _parse_shfe_receipt(_shfe_page(key), name)
            if value is not None:
                rows.append((datetime(day.year, day.month, day.day), value))
        day += timedelta(days=1)
    return pd.DataFrame({"日期": [r[0] for r in rows], "值": [r[1] for r in rows]})


def _get_stock(asset: str):
    """可注入：库存日报（akshare futures_inventory_em，列 日期/库存/增减）。"""
    import akshare as ak

    return ak.futures_inventory_em(symbol=asset.lower())


_tls = threading.local()


class _SdkStdoutRouter:
    """sys.stdout 代理：上游 SDK 工作线程内的打印改道 stderr，其余线程照常写入原 stdout。

    akshare 部分接口（如逐日仓单）直接 print；按线程路由而非整体替换 sys.stdout：
    超时被放弃线程的迟到打印同样落 stderr，CLI 主线程与 serve 的输出不受影响。
    """

    def __init__(self, target):
        self._target = target

    def _stream(self):
        return sys.stderr if getattr(_tls, "sdk_call", False) else self._target

    def write(self, s):
        stream = self._stream()
        return stream.write(s) if stream is not None else len(s)

    def flush(self):
        stream = self._stream()
        if stream is not None:
            stream.flush()

    def __getattr__(self, name):
        return getattr(self._target, name)


def _install_stdout_router() -> None:
    if sys.stdout is not None and not isinstance(sys.stdout, _SdkStdoutRouter):
        sys.stdout = _SdkStdoutRouter(sys.stdout)


def _call_with_timeout(fn, timeout: float):
    """在守护线程中执行上游调用；超时抛 TimeoutError（可重试的适配器错误），挂起线程被放弃。

    该线程内的打印经 _SdkStdoutRouter 改道 stderr（包括被放弃后的迟到打印）。
    """
    box: dict = {}
    _install_stdout_router()

    def run():
        _tls.sdk_call = True
        try:
            box["value"] = fn()
        except BaseException as e:  # 原样转交调用方
            box["error"] = e

    t = threading.Thread(target=run, name="akshare-call", daemon=True)
    t.start()
    t.join(timeout)
    if t.is_alive():
        raise TimeoutError(f"akshare 上游调用超时（>{timeout:g}s）")
    if "error" in box:
        raise box["error"]
    return box.get("value")


def _kind(symbol: str) -> str:
    if symbol.endswith(_RECEIPT_SUFFIX):
        return "receipt"
    if symbol.endswith(_STOCK_SUFFIX):
        return "stock"
    return "price"


def _variety(symbol: str) -> str:
    for suffix in (_RECEIPT_SUFFIX, _STOCK_SUFFIX):
        if symbol.endswith(suffix):
            return symbol[: -len(suffix)].upper()
    return symbol


def _quantity_scale(variety: str, unit: str | None) -> tuple[float, float]:
    """(乘数, 除数)：原始值 × 乘数 ÷ 除数 = 清单声明单位下的值；未登记品种/量纲不匹配 → validation_error。"""
    raw = _RAW_QUANTITY.get(variety)
    if raw is None:
        raise FetchError(
            "validation_error",
            f"品种 {variety} 的仓单/库存原始口径未登记（plan §2.1），不支持取数",
        )
    decl = _DECLARED_QUANTITY.get(unit or "")
    if decl is None or decl[0] != raw[0]:
        want = "kb" if raw[0] == "bbl" else "kton"
        raise FetchError(
            "validation_error",
            f"{variety} 仓单/库存原始量纲为 {raw[0]}，清单声明单位 {unit!r} 不匹配（应为 {want}）",
        )
    return raw[1], decl[1]


def _midnight(d: date) -> datetime:
    return datetime(d.year, d.month, d.day)


def _route(symbol: str):
    """源符号 → (取数函数(start, end), 值列名)。"""
    kind = _kind(symbol)
    if kind == "receipt":
        asset = _variety(symbol)
        return (lambda start, end: _get_receipt(asset, start, end)), "值"
    if kind == "stock":
        asset = _variety(symbol)
        return (lambda start, end: _get_stock(asset)), "库存"
    if symbol.endswith(_MAIN_SUFFIX) and len(symbol) == 3:
        return (lambda start, end: _get_main(symbol)), "收盘价"
    # 指定合约（如 SC2401）
    return (lambda start, end: _get_contract(symbol)), "收盘价"


class AkshareAdapter(Adapter):
    id = "akshare"

    def effective_range(self, provide, range_start=None, range_end=None):
        """价格型 = 调用方范围（None = 源全量历史）；仓单/库存 = 滚动窗口，未给端点时按默认回看补全。"""
        kind = _kind(provide.symbols[0])
        if kind == "price":
            return range_start, range_end
        end = range_end or _midnight(date.today())
        days = RECEIPT_DEFAULT_DAYS if kind == "receipt" else STOCK_DEFAULT_DAYS
        start = range_start or (end - timedelta(days=days))
        return start, end

    def fetch(self, provide, range_start=None, range_end=None):
        symbol = provide.symbols[0]
        kind = _kind(symbol)
        mult, div = 1.0, 1.0
        if kind != "price":
            mult, div = _quantity_scale(_variety(symbol), getattr(provide, "unit", None))
        getter, value_col = _route(symbol)
        df = _call_with_timeout(lambda: getter(range_start, range_end), AKSHARE_TIMEOUT_S)
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
        if "var" in df.columns and kind == "receipt":
            df = df[df["var"].astype(str).str.upper() == _variety(symbol)]
        date_col = next((c for c in ("日期", "date", "Date") if c in df.columns), None)
        if date_col is None:
            raise ValueError("响应缺少日期列")
        if value_col not in df.columns:
            raise ValueError(f"响应缺少值列: {value_col}")
        if kind == "stock" and range_start is not None and len(df) >= STOCK_PAGE_ROWS:
            earliest = pd.to_datetime(df[date_col]).min().to_pydatetime()
            if earliest > range_start:  # 源单页已截断：覆盖不到请求起点，拒绝虚报覆盖范围
                raise FetchError(
                    "validation_error",
                    f"库存日报源仅提供最近约 {STOCK_PAGE_ROWS} 个交易日（最早 {earliest:%Y-%m-%d}），"
                    f"请求起点 {range_start:%Y-%m-%d} 超出源窗口",
                )
        rows = []
        for _, r in df.iterrows():
            ts = pd.to_datetime(r[date_col]).to_pydatetime()
            if range_start and ts < range_start:
                continue
            if range_end and ts > range_end:
                continue
            rows.append((ts, float(r[value_col]) * mult / div))
        return rows, raw

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
