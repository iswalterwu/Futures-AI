"""上期所仓单页面测试辅助：生成与真实页面同结构的 HTML，并注入 `_shfe_page`。

真实页面：首表为日期，其后每品种一张表（品种名在第 2 列首行、合计在第 3 列末行）。
品种名与适配器的 SHFE_RECEIPT_NAMES 对应：SC=中质含硫原油、FU=燃料油、BU=石油沥青、LU=低硫燃料油。
"""
from __future__ import annotations

from data.adapters.akshare import akshare_adapter as ak_mod

DEFAULT_NAME = ak_mod.SHFE_RECEIPT_NAMES["SC"]


def page(pages: dict[str, dict[str, float]]) -> str:
    """pages: {date_str: {variety_name: total}} → HTML。"""
    parts = ["<html><body>"]
    for date_str, varieties in pages.items():
        parts.append(f"<table><tr><td>{date_str}</td></tr></table>")
        for name, total in varieties.items():
            parts.append(
                "<table><tr><td>品种</td><td>{}</td><td>仓单</td><td>增减</td></tr>"
                "<tr><td>合计</td><td></td><td>{}</td><td>0</td></tr></table>".format(name, total)
            )
    parts.append("</body></html>")
    return "\n".join(parts)


def patch(monkeypatch, values, name: str = DEFAULT_NAME):
    """注入 `_shfe_page`；values = 固定值或 fn(date_str) -> 值。返回收到的日期列表。"""
    calls: list[str] = []

    def fake(date_str: str) -> str:
        calls.append(date_str)
        value = values(date_str) if callable(values) else values
        return page({date_str: {name: value}})

    monkeypatch.setattr(ak_mod, "_shfe_page", fake)
    return calls


def patch_sequence(monkeypatch, values_by_call: list[float], name: str = DEFAULT_NAME):
    """按调用次序返回不同值（用于同窗口多次取数的 diff 场景）。"""
    state = {"i": 0}

    def next_value(date_str: str) -> float:
        value = values_by_call[min(state["i"], len(values_by_call) - 1)]
        state["i"] += 1
        return value

    return patch(monkeypatch, next_value, name)
