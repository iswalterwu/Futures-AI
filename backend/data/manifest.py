"""manifest 字段契约与校验（plan §2.1，AC-001-2）。

文件名为 manifest.yaml，位于适配器目录内；重复 id 检测在 registry（AC-001-4）。
枚举封闭：新增值须先修订 spec 过 Gate。
"""
from __future__ import annotations

from dataclasses import dataclass

import yaml
from pydantic import BaseModel, Field, field_validator

from data.catalog.descriptor import ASSET_ENUM, GEO_ENUM, MEASURE_ENUM, CONTRACT_RE, DescriptorError

MANIFEST_FILENAME = "manifest.yaml"

_ASSET_RE = r"^[a-z0-9-]{1,64}$"
_FREQS = {"1d", "1w", "1m"}
_MODES = {"scheduled", "on_demand", "realtime"}
_UNITS = {"cny_bbl", "cny_ton", "usd_bbl", "kb_d", "kb", "kton"}
# v1 内置取数实现（封闭）：用户清单经 implementation 复用，不加载用户目录代码（plan §2.1）
IMPLEMENTATIONS = {"akshare", "eia", "local-file"}


class Credentials(BaseModel):
    kind: str = Field(default="none", pattern="^(none|api_key)$")
    credential_ref: str | None = None


class DescriptorSpec(BaseModel):
    asset: str
    geo: str
    measure: str
    contract: str = ""

    @field_validator("asset")
    @classmethod
    def _asset(cls, v: str) -> str:
        v = str(v).strip().lower()
        if not v or v not in ASSET_ENUM:
            raise ValueError(f"asset 非法值: {v!r}（封闭枚举）")
        return v

    @field_validator("geo")
    @classmethod
    def _geo(cls, v: str) -> str:
        v = str(v).strip().lower()
        if not v or v not in GEO_ENUM:
            raise ValueError(f"geo 非法值: {v!r}（封闭枚举）")
        return v

    @field_validator("measure")
    @classmethod
    def _measure(cls, v: str) -> str:
        v = str(v).strip().lower()
        if not v or v not in MEASURE_ENUM:
            raise ValueError(f"measure 非法值: {v!r}（封闭枚举）")
        return v

    @field_validator("contract")
    @classmethod
    def _contract(cls, v: str) -> str:
        raw = v
        v = "" if v is None else str(v).strip()
        # F-14：纯空白输入拒绝（与描述符直接路径一致）
        if raw is not None and str(raw) != "" and v == "":
            raise ValueError(f"contract 非法值: {raw!r}（纯空白输入拒绝）")
        if v and not CONTRACT_RE.match(v):
            raise ValueError(f"contract 非法值: {v!r}（1–20 位字母或数字）")
        return v


class FetchSpec(BaseModel):
    modes: list[str]
    history_days: int = Field(ge=0)

    @field_validator("modes")
    @classmethod
    def _modes(cls, v: list[str]) -> list[str]:
        if not v or any(m not in _MODES for m in v):
            raise ValueError(f"modes 非法值: {v!r}（⊂ {sorted(_MODES)}）")
        return v


class UpdateSpec(BaseModel):
    lag_min: int = Field(ge=0)
    revises: bool


class Provide(BaseModel):
    descriptor: DescriptorSpec
    symbols: list[str]
    unit: str
    freq: str
    tz: str
    priority: int = Field(default=100, ge=0)
    fetch: FetchSpec
    update: UpdateSpec

    @field_validator("symbols")
    @classmethod
    def _symbols(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("symbols 必填且非空")
        return v

    @field_validator("unit")
    @classmethod
    def _unit(cls, v: str) -> str:
        if v not in _UNITS:
            raise ValueError(f"unit 非法值: {v!r}（v1 enum: {sorted(_UNITS)}）")
        return v

    @field_validator("freq")
    @classmethod
    def _freq(cls, v: str) -> str:
        if v not in _FREQS:
            raise ValueError(f"freq 非法值: {v!r}（仅 {sorted(_FREQS)}）")
        return v

    @field_validator("tz")
    @classmethod
    def _tz(cls, v: str) -> str:
        # v1 简化：IANA 时区名格式校验（ZoneInfo 可用性）
        from zoneinfo import ZoneInfo

        try:
            ZoneInfo(str(v))
        except Exception:
            raise ValueError(f"tz 非法值: {v!r}（须为 IANA 时区名）")
        return str(v)


class Manifest(BaseModel):
    id: str
    name: str
    version: int = Field(gt=0)
    credentials: Credentials  # F-14/N-03：必填（无默认）
    implementation: str | None = None  # 缺省 = 仅声明源（不可取数）
    provides: list[Provide]

    @field_validator("id")
    @classmethod
    def _id(cls, v: str) -> str:
        import re

        if not re.match(_ASSET_RE, v):
            raise ValueError(f"id 非法值: {v!r}（[a-z0-9-]{{1,64}}）")
        return v

    @field_validator("implementation")
    @classmethod
    def _implementation(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = str(v).strip()
        if v not in IMPLEMENTATIONS:
            raise ValueError(f"implementation 非法值: {v!r}（v1 内置实现: {sorted(IMPLEMENTATIONS)}）")
        return v

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        if not str(v).strip():
            raise ValueError("name 必填且非空（显示名）")
        return str(v).strip()

    @field_validator("credentials", mode="before")
    @classmethod
    def _credentials(cls, v):
        if v is None or v == "none":
            return {"kind": "none"}
        return v

    @field_validator("credentials", mode="after")
    @classmethod
    def _credentials_cond(cls, v: Credentials) -> Credentials:
        # F-14：api_key 必带有效 credential_ref
        if v.kind == "api_key" and not (v.credential_ref and str(v.credential_ref).strip()):
            raise ValueError("kind=api_key 时 credential_ref 必填")
        return v

    @field_validator("provides")
    @classmethod
    def _provides(cls, v: list[Provide]) -> list[Provide]:
        if not v:
            raise ValueError("provides 必填且非空")
        return v


@dataclass
class ManifestError(Exception):
    path: str
    field: str
    reason: str

    def __str__(self) -> str:
        return f"manifest 校验失败 {self.path}: 字段 {self.field} — {self.reason}"


def load(path: str) -> Manifest:
    """加载并校验 manifest 文件；失败抛 ManifestError（含路径+字段+原因）。

    读取/解码失败同样隔离为 ManifestError（F-14：坏适配器不影响启动）。
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        raise ManifestError(path, "-", "文件不存在")
    except (OSError, UnicodeDecodeError) as e:
        raise ManifestError(path, "-", f"文件读取/解码失败: {e}")
    try:
        raw = yaml.safe_load(text)
    except yaml.YAMLError as e:
        raise ManifestError(path, "-", f"YAML 解析失败: {e}")
    if not isinstance(raw, dict):
        raise ManifestError(path, "-", "根节点必须是映射")
    try:
        return Manifest.model_validate(raw)
    except Exception as err:  # pydantic ValidationError
        msgs = getattr(err, "errors", None)
        if callable(msgs):
            msgs = msgs()
        if msgs:
            loc = ".".join(str(x) for x in msgs[0]["loc"])
            reason = msgs[0]["msg"]
            raise ManifestError(path, loc or "-", reason)
        raise ManifestError(path, "-", str(err))


def _raise(path: str, field: str, reason: str) -> Manifest:
    raise ManifestError(path, field, reason)
