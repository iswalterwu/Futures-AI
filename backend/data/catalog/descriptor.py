"""描述符规范化、ID 派生与 8 槽渲染（plan §2.3，AC-002-1/2/5）。

身份键集恒四键 {asset, geo, measure, contract}；asset/geo/measure 必填且非空；
contract 可选（缺省空串 = 主力/连续；非空 = 指定合约，1–20 位字母或数字）。
unit/freq/tz 是序列元数据，不参与身份。
"""
from __future__ import annotations

import hashlib
import json
import re

ASSETS = {"sc", "fu", "lu", "bu", "pg", "crude", "brent", "diesel", "lpg"}
GEOS = {"world", "na", "nwe", "med", "me", "afr", "in", "cn", "apx"}
MEASURES = {"close", "volume", "oi", "stock", "receipt", "balance"}

_CONTRACT_RE = re.compile(r"^[A-Za-z0-9]{1,20}$")

ASSET_ENUM = ASSETS
GEO_ENUM = GEOS
MEASURE_ENUM = MEASURES
CONTRACT_RE = _CONTRACT_RE


class DescriptorError(ValueError):
    """描述符不合法（含字段与原因）。"""


def normalize(descriptor: dict) -> dict:
    """规范化描述符：校验 + 键集恒四键 + 枚举小写 + contract 去空白不转小写。"""
    if not isinstance(descriptor, dict):
        raise DescriptorError("descriptor 必须是对象")
    asset = str(descriptor.get("asset", "")).strip().lower()
    geo = str(descriptor.get("geo", "")).strip().lower()
    measure = str(descriptor.get("measure", "")).strip().lower()
    contract = descriptor.get("contract", "")
    raw_contract = contract
    contract = "" if contract is None else str(contract).strip()
    if raw_contract is not None and str(raw_contract).strip() == "" and str(raw_contract) != "":
        raise DescriptorError("contract 非法值: 纯空白输入（应为空或 1–20 位字母数字）")
    if not asset:
        raise DescriptorError("asset 必填且非空")
    if asset not in ASSETS:
        raise DescriptorError(f"asset 非法值: {asset!r}（封闭枚举）")
    if not geo:
        raise DescriptorError("geo 必填且非空")
    if geo not in GEOS:
        raise DescriptorError(f"geo 非法值: {geo!r}（封闭枚举）")
    if not measure:
        raise DescriptorError("measure 必填且非空")
    if measure not in MEASURES:
        raise DescriptorError(f"measure 非法值: {measure!r}（封闭枚举）")
    if contract and not _CONTRACT_RE.match(contract):
        raise DescriptorError(
            f"contract 非法值: {contract!r}（须为 1–20 位字母或数字；纯空白/非法字符/超长拒绝）"
        )
    return {"asset": asset, "geo": geo, "measure": measure, "contract": contract}


def canonical(descriptor: dict) -> str:
    """规范 JSON 字符串（ID 派生输入）。键排序、UTF-8、separators=(',',':')。"""
    return json.dumps(normalize(descriptor), sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def derive_id(descriptor: dict) -> str:
    """规范 JSON → SHA-256 → 前 16 字节 → 32 位 hex 字符串。"""
    return hashlib.sha256(canonical(descriptor).encode("utf-8")).hexdigest()[:32]


def display_8slot(descriptor: dict, freq: str) -> str:
    """8 槽渲染：asset.geo.-.-.-.measure.contract.freq（contract 空串渲染 '-'）。"""
    d = normalize(descriptor)
    freq = str(freq)
    if not re.match(r"^(1d|1w|1m)$", freq):
        raise DescriptorError(f"freq 非法值: {freq!r}（仅 1d/1w/1m）")
    return f"{d['asset']}.{d['geo']}.-.-.-.{d['measure']}.{d['contract'] or '-'}.{freq}"
