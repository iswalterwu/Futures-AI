"""EIA 适配器（AC-007-2）：凭证经凭证库读取（fail closed），公开数据集拉取。"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd

from data import creds
from data.adapters.base import Adapter


def _request(series_id: str, api_key: str, start, end):
    """可 monkeypatch 的请求点（测试注入固定响应样本）。"""
    import requests

    url = "https://api.eia.gov/v2/petroleum/stoc/wstk/data/"
    params = {"api_key": api_key, "frequency": "weekly", "data[0]": "value"}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


class EiaAdapter(Adapter):
    id = "eia"

    def __init__(self, creds_dir, credential_ref: str = "eia_api_key"):
        self.creds_dir = creds_dir
        self.credential_ref = credential_ref

    def fetch(self, provide, range_start=None, range_end=None):
        # 凭证读自 manifest 的 credential_ref（AC-007-2：读取失败 fail closed）
        api_key = creds.get(self.creds_dir, self.credential_ref)
        payload = _request(provide.symbols[0], api_key, range_start, range_end)
        rows = []
        for item in payload.get("response", {}).get("data", []):
            ts = datetime.fromisoformat(item["period"])
            if range_start and ts < range_start:
                continue
            if range_end and ts > range_end:
                continue
            rows.append((ts, float(item["value"])))
        rows.sort(key=lambda r: r[0])
        return rows

    def realtime_signature(self, descriptor, on_update):
        raise NotImplementedError
