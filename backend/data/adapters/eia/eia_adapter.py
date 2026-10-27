"""EIA 适配器（AC-007-2）：双路径取数（plan §2.1，D-014）。

- 配置了用户 API key（凭证文件存在）→ 官方 API（按序列精确、实时；agent workflow 首选）
- key 不存在 → 自动回退官方免凭证历史数据下载（`dnav/pet/hist_xls/<SERIES><freq>.xls`）
- key 存在但读取/解密失败 → 报错（unauthorized），不回退（凭证故障不得静默降级）

F-04：API 请求携带 series_id 与时间范围；响应按序列过滤。
F-07：上游错误脱敏（API key 不进入错误消息）；错误按类型映射。
"""
from __future__ import annotations

import io
import json
from datetime import datetime

import pandas as pd
import requests

from data import creds
from data.adapters.base import Adapter
from data.fetch.on_demand import FetchError

# 免凭证路径：EIA 官方公开的历史数据下载（无需 key）
EIA_DNAV_XLS_URL = "https://www.eia.gov/dnav/pet/hist_xls/{series}{freq}.xls"
_FREQ_CODES = {"1w": "w", "1m": "m", "1d": "d"}
_DNAV_SHEET = "Data 1"


def _request(series_id: str, api_key: str, start, end):
    """可注入的请求点（测试注入固定响应样本）。"""
    url = "https://api.eia.gov/v2/petroleum/stoc/wstk/data/"
    params = {
        "api_key": api_key,
        "frequency": "weekly",
        "data[0]": "value",
        "facets[series][]": series_id,
    }
    if start:
        params["start"] = start.strftime("%Y-%m-%dT%H")
    if end:
        params["end"] = end.strftime("%Y-%m-%dT%H")
    try:
        resp = requests.get(url, params=params, timeout=30)
    except requests.exceptions.RequestException:
        # F-07：网络异常不携带 URL/参数（防 key 泄露）
        raise FetchError("adapter_error", "EIA 网络请求失败")
    if resp.status_code in (401, 403):
        raise FetchError("unauthorized", "EIA 认证失败（请检查 API key）")
    if resp.status_code == 429:
        raise FetchError("rate_limited", "EIA 限流，请稍后重试")
    if resp.status_code >= 500:
        raise FetchError("adapter_error", f"EIA 服务端错误（HTTP {resp.status_code}）")
    if resp.status_code >= 400:  # 其余 4xx = 请求本身无效（序列代码/参数），重试无益
        raise FetchError("validation_error", f"EIA 请求无效（HTTP {resp.status_code}，请检查序列代码与参数）")
    return resp.json(), resp.text


def _dnav_xls(series_id: str, freq: str) -> bytes:
    """可注入：EIA 官方免凭证历史数据（.xls）。"""
    code = _FREQ_CODES.get(freq)
    if code is None:
        raise FetchError("validation_error", f"EIA 免凭证路径不支持的频率: {freq!r}（仅 1d/1w/1m）")
    url = EIA_DNAV_XLS_URL.format(series=series_id, freq=code)
    try:
        resp = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
    except requests.exceptions.RequestException:
        raise FetchError("adapter_error", "EIA 免凭证数据下载失败（网络不可达）")
    if resp.status_code == 404:
        raise FetchError("not_found", f"EIA 免凭证路径无此序列: {series_id}")
    if resp.status_code >= 400:
        raise FetchError("adapter_error", f"EIA 免凭证数据下载失败（HTTP {resp.status_code}）")
    return resp.content


def _parse_dnav_xls(raw: bytes) -> list[tuple]:
    """解析 dnav 的 `Data 1` 表（首列日期、次列值；首行可能是标题）。"""
    try:
        df = pd.read_excel(io.BytesIO(raw), sheet_name=_DNAV_SHEET, header=None)
    except Exception as e:  # 上游改版/格式变化 → 可重试的适配器错误
        raise FetchError("adapter_error", f"EIA 免凭证数据解析失败: {e}") from e
    rows: list[tuple] = []
    for _, r in df.iterrows():
        try:
            ts = pd.to_datetime(r[0]).to_pydatetime()
            value = float(r[1])
        except (TypeError, ValueError):
            continue  # 标题行/空行
        rows.append((ts, value))
    return rows


class EiaAdapter(Adapter):
    id = "eia"

    def __init__(self, creds_dir, credential_ref: str = "eia_api_key"):
        self.creds_dir = creds_dir
        self.credential_ref = credential_ref
        self.last_path: str | None = None  # 最近一次取数路径：api | offline

    def fetch(self, provide, range_start=None, range_end=None):
        series_id = provide.symbols[0]
        if not self.credential_ref:
            raise FetchError(
                "unauthorized",
                "该源清单未声明凭证引用（credentials: {kind: api_key, credential_ref: <名>}）",
            )
        if creds.exists(self.creds_dir, self.credential_ref):
            return self._fetch_api(provide, range_start, range_end)
        return self._fetch_offline(provide, range_start, range_end)

    def _fetch_api(self, provide, range_start, range_end):
        series_id = provide.symbols[0]
        self.last_path = "api"
        # 凭证存在但读不出来 → CredsError → unauthorized（不回退免凭证路径）
        api_key = creds.get(self.creds_dir, self.credential_ref)
        result = _request(series_id, api_key, range_start, range_end)
        if isinstance(result, tuple):  # (data, raw_text)
            payload, raw = result
        else:  # 兼容测试注入的纯 dict
            payload, raw = result, json.dumps(result, ensure_ascii=False, sort_keys=True)
        rows = []
        bad = 0
        for item in payload.get("response", {}).get("data", []):
            # F-04：按序列过滤（响应可能含多序列/多维度）
            if item.get("series") and item["series"] != series_id:
                continue
            try:
                ts = datetime.fromisoformat(item["period"])
                val = float(item["value"])
            except (KeyError, TypeError, ValueError):
                bad += 1
                continue  # 统计无效行，交由调用方校验层整批拒绝（R6-01）
            if range_start and ts < range_start:
                continue
            if range_end and ts > range_end:
                continue
            rows.append((ts, val))
        if bad:
            raise FetchError(
                "validation_error", f"EIA 响应含 {bad} 行无效数据（空日期/非法值），整批拒绝"
            )
        rows.sort(key=lambda r: r[0])
        return rows, raw

    def _fetch_offline(self, provide, range_start, range_end):
        """免凭证回退：官方历史数据下载（同 series code、同单位）。"""
        self.last_path = "offline"
        raw = _dnav_xls(provide.symbols[0], getattr(provide, "freq", "1w"))
        rows = [
            (ts, value)
            for ts, value in _parse_dnav_xls(raw)
            if not (range_start and ts < range_start) and not (range_end and ts > range_end)
        ]
        rows.sort(key=lambda r: r[0])
        return rows, raw

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
