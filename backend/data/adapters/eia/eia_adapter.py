"""EIA 适配器（AC-007-2）：凭证经凭证库读取（fail closed），按序列/时间范围请求。

F-04：请求携带 series_id 与时间范围；响应按序列过滤。
F-07：上游错误脱敏（API key 不进入错误消息）；错误按类型映射。
"""
from __future__ import annotations

from datetime import datetime

import requests

import json

from data import creds
from data.adapters.base import Adapter
from data.fetch.on_demand import FetchError


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
    if resp.status_code >= 400:
        raise FetchError("adapter_error", f"EIA 请求失败（HTTP {resp.status_code}）")
    return resp.json(), resp.text


class EiaAdapter(Adapter):
    id = "eia"

    def __init__(self, creds_dir, credential_ref: str = "eia_api_key"):
        self.creds_dir = creds_dir
        self.credential_ref = credential_ref

    def fetch(self, provide, range_start=None, range_end=None):
        # 凭证读自 manifest 的 credential_ref（AC-007-2：读取失败 fail closed）
        api_key = creds.get(self.creds_dir, self.credential_ref)
        result = _request(provide.symbols[0], api_key, range_start, range_end)
        if isinstance(result, tuple):  # (data, raw_text)
            payload, raw = result
        else:  # 兼容测试注入的纯 dict
            payload, raw = result, json.dumps(result, ensure_ascii=False, sort_keys=True)
        rows = []
        bad = 0
        for item in payload.get("response", {}).get("data", []):
            # F-04：按序列过滤（响应可能含多序列/多维度）
            if item.get("series") and item["series"] != provide.symbols[0]:
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
            from data.fetch.on_demand import FetchError

            raise FetchError(
                "validation_error", f"EIA 响应含 {bad} 行无效数据（空日期/非法值），整批拒绝"
            )
        rows.sort(key=lambda r: r[0])
        return rows, raw

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
