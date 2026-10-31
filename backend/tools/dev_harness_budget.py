"""开发批次用量的只读、离线观测（dev-harness-budget）。

用法：cd backend && python tools/dev_harness_budget.py report
    --manifest <清单.json> --out-dir <仓库外已有目录>
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import sys
from dataclasses import dataclass, field, replace
from datetime import datetime
from pathlib import Path
from typing import Literal


# 入口校验
LABEL = re.compile(r"\w[\w .+#@-]{0,63}")
MODEL_LABEL = re.compile(r"[A-Za-z0-9][A-Za-z0-9._:/@+-]{0,95}")
TOOL_ID = re.compile(r"[A-Za-z0-9_][A-Za-z0-9_.|:-]{0,127}")
COMMIT = re.compile(r"[0-9a-fA-F]{7,40}")
USAGE_FIELDS = ("input", "output", "cacheRead", "cacheWrite", "reasoning", "cacheWrite1h")
UNKNOWN_LABEL = "(未知)"
INVALID_LABEL = "(无效标签)"
NONRUN_EVENTS = frozenset({"queue_update", "session_info_changed", "thinking_level_changed", "entry_appended"})
STOP_REASONS = frozenset({"stop", "length", "toolUse", "error", "aborted", "deferred", "pending"})
type Finality = Literal["final", "interrupted", "nonfinal"]
type ZeroRules = tuple[ZeroRule, ...]


class InputError(Exception):
    def __init__(self, category: str, field_path: str = "") -> None:
        self.category = category
        self.field_path = field_path
        super().__init__(category + (" " + field_path if field_path else ""))


def load_manifest(path: Path) -> Manifest:
    raw = _load_manifest_json(path)
    obj = _object(raw, "", {"manifest_version", "batch_id", "baseline_commit", "conditions",
                           "comparability_note", "confirmed_zero", "all_nested_children_declared", "links", "sources"},
                  {"manifest_version", "batch_id", "sources"})
    if type(obj["manifest_version"]) is not int or obj["manifest_version"] != 1:
        raise InputError("manifest_invalid", "manifest_version")
    batch = _label(obj["batch_id"], "batch_id")
    baseline = _optional_label(obj, "baseline_commit", "", COMMIT)
    conditions = _conditions(obj.get("conditions", {}))
    note = _annotation(obj["comparability_note"], "comparability_note", "text") if "comparability_note" in obj else None
    rules = tuple(_zero_rule(value, f"confirmed_zero[{i}]")
                  for i, value in enumerate(_list(obj.get("confirmed_zero", []), "confirmed_zero")))
    nested = obj.get("all_nested_children_declared", False)
    if type(nested) is not bool:
        raise InputError("manifest_invalid", "all_nested_children_declared")
    sources = tuple(_source_spec(value, i, path.parent) for i, value in enumerate(_list(obj["sources"], "sources")))
    if not sources:
        raise InputError("manifest_invalid", "sources")
    _validate_relations(sources)
    links = tuple(_disjoint(value, i, sources) for i, value in enumerate(_list(obj.get("links", []), "links")))
    return Manifest(batch, sources, baseline, conditions, note, rules, nested, links)


def _load_manifest_json(path: Path) -> object:
    try:
        with path.open("rb") as stream:
            content = stream.read()
    except (OSError, ValueError):
        raise InputError("manifest_unreadable") from None
    try:
        return json.loads(content)
    except (ValueError, UnicodeError):
        raise InputError("manifest_invalid") from None


def _object(raw: object, at: str, allowed: set[str], required: set[str] = frozenset()) -> dict:
    if not isinstance(raw, dict):
        raise InputError("manifest_invalid", at)
    if raw.keys() - allowed:
        raise InputError("manifest_invalid", _field(at, "unknown_field"))
    for key in sorted(required - raw.keys()):
        raise InputError("manifest_invalid", _field(at, key))
    return raw


def _field(at: str, name: str) -> str:
    return f"{at}.{name}" if at else name


def _list(raw: object, at: str) -> list:
    if not isinstance(raw, list):
        raise InputError("manifest_invalid", at)
    return raw


def _valid_label(raw: object, pattern: re.Pattern = LABEL) -> bool:
    return (isinstance(raw, str) and pattern.fullmatch(raw) is not None
            and (pattern is not MODEL_LABEL or ("//" not in raw and re.match(r"[A-Za-z]:/", raw) is None)))


def _label(raw: object, at: str, pattern: re.Pattern = LABEL) -> str:
    if not _valid_label(raw, pattern):
        raise InputError("manifest_invalid", at)
    return raw


def _optional_label(obj: dict, key: str, at: str, pattern: re.Pattern = LABEL) -> str | None:
    return _label(obj[key], _field(at, key), pattern) if key in obj else None


def _enum(raw: object, at: str, choices: tuple[str, ...]) -> str:
    if not isinstance(raw, str) or raw not in choices:
        raise InputError("manifest_invalid", at)
    return raw


def _conditions(raw: object) -> Conditions:
    obj = _object(raw, "conditions", {"config_label", "task_scope"})
    return Conditions(_optional_label(obj, "config_label", "conditions"), _optional_label(obj, "task_scope", "conditions"))


def _annotation(raw: object, at: str, key: str) -> Annotation:
    obj = _object(raw, at, {key, "basis"}, {key, "basis"})
    value = obj[key]
    if key == "count":
        if type(value) is not int or value < 0:
            raise InputError("manifest_invalid", _field(at, key))
    else:
        value = _label(value, _field(at, key))
    return Annotation(value, _label(obj["basis"], _field(at, "basis")))


def _zero_rule(raw: object, at: str) -> ZeroRule:
    obj = _object(raw, at, {"provider", "model", "fields", "basis"}, {"provider", "model", "fields", "basis"})
    provider = _label(obj["provider"], at + ".provider", MODEL_LABEL)
    model = "*" if obj["model"] == "*" else _label(obj["model"], at + ".model", MODEL_LABEL)
    fields = tuple(_enum(value, f"{at}.fields[{i}]", USAGE_FIELDS)
                   for i, value in enumerate(_list(obj["fields"], at + ".fields")))
    return ZeroRule(provider, model, fields, _label(obj["basis"], at + ".basis"))


def _timing(raw: object, at: str) -> TimingAnnotation:
    obj = _object(raw, at, {"start", "end", "observed_until", "outcome", "origin", "basis"}, {"origin", "basis"})
    times = []
    for key in ("start", "end", "observed_until"):
        if key not in obj:
            times.append(None)
            continue
        try:
            if not isinstance(obj[key], str):
                raise ValueError
            times.append(datetime.fromisoformat(obj[key]))
        except ValueError:
            raise InputError("manifest_invalid", _field(at, key)) from None
    outcome = _enum(obj["outcome"], at + ".outcome", ("completed", "failed", "cancelled", "timeout")) if "outcome" in obj else None
    origin = _enum(obj["origin"], at + ".origin", ("manual", "external"))
    return TimingAnnotation(*times, outcome, origin, _label(obj["basis"], at + ".basis"))


def _source_spec(raw: object, index: int, base: Path) -> SourceSpec:
    at = f"sources[{index}]"
    obj = _object(raw, at, {"source_id", "kind", "path", "dimensions", "rework", "timing", "duplicate_of", "nested_of"},
                  {"source_id", "kind", "path"})
    sid = _label(obj["source_id"], at + ".source_id")
    kind = _enum(obj["kind"], at + ".kind", ("pi-session-v3", "pi-json-events"))
    if not isinstance(obj["path"], str) or not obj["path"] or "\0" in obj["path"]:
        raise InputError("manifest_invalid", at + ".path")
    path = Path(os.path.abspath(base / obj["path"]))
    dims = _object(obj.get("dimensions", {}), at + ".dimensions", {"phase", "role", "channel", "baseline_commit"})
    dimensions = Dimensions(*(_optional_label(dims, key, at + ".dimensions", COMMIT if key == "baseline_commit" else LABEL)
                              for key in ("phase", "role", "channel", "baseline_commit")))
    duplicate = _source_link(obj["duplicate_of"], at + ".duplicate_of", "duplicate_of") if "duplicate_of" in obj else None
    nested = _source_link(obj["nested_of"], at + ".nested_of", "nested_of") if "nested_of" in obj else None
    return SourceSpec(sid, kind, path, dimensions,
                      _annotation(obj["rework"], at + ".rework", "count") if "rework" in obj else None,
                      _timing(obj["timing"], at + ".timing") if "timing" in obj else None, duplicate, nested)


def _source_link(raw: object, at: str, kind: str) -> Link:
    keys = {"source", "basis"} | ({"tool_call_id"} if kind == "nested_of" else set())
    obj = _object(raw, at, keys, keys)
    call_ref = _hash_ref("t", _label(obj["tool_call_id"], at + ".tool_call_id", TOOL_ID)) if kind == "nested_of" else None
    return Link(kind, (_label(obj["source"], at + ".source"),), _label(obj["basis"], at + ".basis"), call_ref)


def _disjoint(raw: object, index: int, sources: tuple[SourceSpec, ...]) -> Link:
    at = f"links[{index}]"
    obj = _object(raw, at, {"type", "sources", "basis"}, {"type", "sources", "basis"})
    kind = _enum(obj["type"], at + ".type", ("disjoint",))
    ids = tuple(_label(value, f"{at}.sources[{i}]") for i, value in enumerate(_list(obj["sources"], at + ".sources")))
    if len(ids) < 2 or len(set(ids)) != len(ids) or not set(ids) <= {s.source_id for s in sources}:
        raise InputError("manifest_invalid", at + ".sources")
    return Link(kind, ids, _label(obj["basis"], at + ".basis"))


def _validate_relations(sources: tuple[SourceSpec, ...]) -> None:
    ids: dict[str, int] = {}
    edges: dict[str, tuple[str, str]] = {}
    for i, source in enumerate(sources):
        if source.source_id in ids:
            raise InputError("manifest_invalid", f"sources[{i}].source_id")
        ids[source.source_id] = i
        if source.duplicate_of and source.nested_of:
            raise InputError("manifest_invalid", f"sources[{i}].nested_of")
        link = source.duplicate_of or source.nested_of
        if link:
            edges[source.source_id] = (link.sources[0], f"sources[{i}].{link.type}.source")
    for sid, (target, at) in edges.items():
        if target not in ids or target == sid:
            raise InputError("manifest_invalid", at)
    # 出度至多一；迭代 DFS，不依赖 Python 递归深度。
    done: set[str] = set()
    for sid in ids:
        visiting: set[str] = set()
        current = sid
        while current in edges and current not in done:
            visiting.add(current)
            target, at = edges[current]
            if target in visiting:
                raise InputError("manifest_invalid", at)
            current = target
        done.update(visiting)


# 类型化事实（不保存原始 dict 或负载）
@dataclass(frozen=True, slots=True)
class Conditions:
    config_label: str | None = None
    task_scope: str | None = None
    baseline_commit: str | None = None
    models: tuple[str, ...] = ()
    models_complete: bool = False
    formats: tuple[str, ...] = ()
    formats_complete: bool = False
    metrics_version: str | None = None
    semantics_source: str | None = None


@dataclass(frozen=True, slots=True)
class Annotation:
    value: str | int
    basis: str


@dataclass(frozen=True, slots=True)
class Dimensions:
    phase: str | None = None
    role: str | None = None
    channel: str | None = None
    baseline_commit: str | None = None


@dataclass(frozen=True, slots=True)
class TimingAnnotation:
    start: datetime | None
    end: datetime | None
    observed_until: datetime | None
    outcome: str | None
    origin: str
    basis: str


@dataclass(frozen=True, slots=True)
class ZeroRule:
    provider: str
    model: str
    fields: tuple[str, ...]
    basis: str


@dataclass(frozen=True, slots=True)
class Link:
    type: str
    sources: tuple[str, ...]
    basis: str
    tool_call_ref: str | None = None


@dataclass(frozen=True, slots=True)
class SourceSpec:
    source_id: str
    kind: str
    path: Path = field(repr=False)
    dimensions: Dimensions = Dimensions()
    rework: Annotation | None = None
    timing: TimingAnnotation | None = None
    duplicate_of: Link | None = None
    nested_of: Link | None = None


@dataclass(frozen=True, slots=True)
class Manifest:
    batch_id: str
    sources: tuple[SourceSpec, ...]
    baseline_commit: str | None = None
    conditions: Conditions = Conditions()
    comparability_note: Annotation | None = None
    confirmed_zero: ZeroRules = ()
    all_nested_children_declared: bool = False
    links: tuple[Link, ...] = ()


@dataclass(frozen=True, slots=True)
class ReadContext:
    rules: ZeroRules = ()


@dataclass(frozen=True, slots=True)
class Value:
    status: Literal["known", "partial", "unknown"] = "unknown"
    value: int | None = None
    origin: Literal["source", "annotation", "derived"] = "source"
    reason: str | None = None


@dataclass(frozen=True, slots=True)
class TokenCounts:
    input: Value = Value(reason="missing")
    output: Value = Value(reason="missing")
    cache_read: Value = Value(reason="missing")
    cache_write: Value = Value(reason="missing")
    reasoning: Value = Value(reason="missing")
    cache_write_1h: Value = Value(reason="missing")
    unreconciled: bool = False
    reasons: tuple[str, ...] = ()


@dataclass(frozen=True, slots=True)
class UsageRecord:
    record_ref: str
    category: str
    kind: str
    provider: str
    model: str
    stop_reason: str | None
    finality: Finality
    tokens: TokenCounts
    entry_key: str | None = None
    tool_call_ref: str | None = None
    usage_present: bool = True


@dataclass(frozen=True, slots=True)
class AttemptRecord:
    record_ref: str
    state: Literal["completed", "failed", "aborted", "inflight", "terminal_only"]
    entry_key: str | None = None


@dataclass(frozen=True, slots=True)
class NestedCall:
    call_ref: str
    status: Literal["ok", "error", "unfinished", "unknown"]


@dataclass(frozen=True, slots=True)
class NestedView:
    calls: tuple[NestedCall, ...]
    complete: bool | None


@dataclass(frozen=True, slots=True)
class ToolCallRecord:
    owner_ref: str | None
    call_ref: str
    state: Literal["finished", "unfinished", "terminal_only", "proposed_only"]
    nested: NestedView | None = None
    tool_call_ref: str | None = None
    entry_key: str | None = None
    usage_ref: str | None = None
    duration_ms: int | float | None = None
    is_error: bool | None = None
    result_observed: bool = False


@dataclass(frozen=True, slots=True)
class NestedExecutionRecord:
    owner_ref: str | None
    call_ref: str
    root_ref: str | None
    state: Literal["finished", "unfinished", "terminal_only"]


@dataclass(frozen=True, slots=True)
class RetryFacts:
    confirmed: Value = Value(reason="retry_markers_not_persisted")
    scheduled_unobserved: int = 0
    total: Value = Value(reason="retry_markers_not_persisted")
    summarization_markers: Value = Value(reason="retry_markers_not_persisted")


@dataclass(frozen=True, slots=True)
class EventMarker:
    ordinal: int
    type: str
    record_ref: str | None = None
    stop_reason: str | None = None
    attempt: int | None = None
    success: bool | None = None
    source: str | None = None
    aborted: bool | None = None


@dataclass(frozen=True, slots=True)
class SourceFacts:
    source_id: str
    format: str
    status: Literal["loaded", "partial", "empty", "unavailable"] = "unavailable"
    reasons: tuple[str, ...] = ()
    session_ref: str | None = None
    content_sha256: str | None = None
    parent_link: str | None = field(default=None, repr=False)
    entry_keys: frozenset[str] = frozenset()
    attempt_run_total: Value = Value(reason="pending_not_persisted")
    line_count: int = 0
    bad_line_count: int = 0
    usage_records: tuple[UsageRecord, ...] = ()
    attempts: tuple[AttemptRecord, ...] = ()
    tool_calls: tuple[ToolCallRecord, ...] = ()
    retries: RetryFacts = RetryFacts()
    markers: tuple[EventMarker, ...] = ()
    settled: bool = False
    settled_aborted: bool | None = None
    nested_executions: tuple[NestedExecutionRecord, ...] = ()


def normalize_usage(raw: object, *, finality: Finality, provider: str, model: str, rules: ZeroRules) -> TokenCounts:
    if not isinstance(raw, dict):
        reason = "missing" if raw is None else "invalid"
        return TokenCounts(*(Value(reason=reason) for _ in USAGE_FIELDS))
    values = tuple(_usage_value(raw, key, finality, provider, model, rules) for key in USAGE_FIELDS)
    reasons: list[str] = []
    if "totalTokens" in raw:
        total = raw["totalTokens"]
        if type(total) is not int or total < 0:
            reasons.append("total_tokens_invalid")
        elif all(v.status == "known" for v in values[:4]) and total != sum(v.value for v in values[:4]):
            reasons.append("total_tokens_mismatch")
    for child, parent in ((values[4], values[1]), (values[5], values[3])):
        if child.status == parent.status == "known" and child.value > parent.value:
            reasons.append("subset_exceeds_parent")
    return TokenCounts(*values, bool(reasons), tuple(dict.fromkeys(reasons)))


def _usage_value(raw: dict, key: str, finality: Finality, provider: str, model: str, rules: ZeroRules) -> Value:
    if key not in raw:
        return Value(reason="missing")
    value = raw[key]
    if type(value) is not int or value < 0:
        return Value(reason="invalid")
    if value == 0:
        if finality == "final" and any(r.provider == provider and r.model in (model, "*") and key in r.fields for r in rules):
            return Value("known", 0, "annotation")
        return Value(reason="default_zero")
    return Value("known" if finality == "final" else "partial", value)


def read_source(spec: SourceSpec, ctx: ReadContext) -> SourceFacts:
    try:
        with spec.path.open("rb") as stream:
            content = stream.read()
    except FileNotFoundError:
        return SourceFacts(spec.source_id, spec.kind, reasons=("source_missing",))
    except (OSError, ValueError):
        return SourceFacts(spec.source_id, spec.kind, reasons=("source_unreadable",))
    facts = SourceFacts(spec.source_id, spec.kind, content_sha256=hashlib.sha256(content).hexdigest())
    rows, bad, reasons, line_count = _json_lines(content)
    facts = replace(facts, line_count=line_count, bad_line_count=bad, reasons=tuple(reasons))
    if not rows or rows[0][0] != 1 or rows[0][1].get("type") != "session":
        return replace(facts, reasons=(*facts.reasons, "unsupported_format"))
    header = rows[0][1]
    if type(header.get("version")) is not int or header["version"] != 3:
        return replace(facts, reasons=(*facts.reasons, "unsupported_version"))
    if not isinstance(header.get("id"), str) or not header["id"]:
        return replace(facts, reasons=(*facts.reasons, "unsupported_format"))
    parent = header.get("parentSession")
    parent_link = os.path.normcase(os.path.abspath(parent)) if isinstance(parent, str) and "\0" not in parent else None
    facts = replace(facts, session_ref=_hash_ref("s", header["id"]), parent_link=parent_link)
    reader = _read_pi_session_v3 if spec.kind == "pi-session-v3" else _read_pi_json_events
    facts = reader(rows[1:], facts, ctx)
    status = "partial" if facts.bad_line_count or "stream_not_settled" in facts.reasons else "loaded" if facts.usage_records else "empty"
    run_total = facts.attempt_run_total
    if spec.kind == "pi-json-events":
        complete = status == "loaded" and facts.settled and all(a.state not in ("inflight", "terminal_only") for a in facts.attempts)
        run_total = Value("known", len(facts.attempts), "derived") if complete else Value(reason="attempt_run_incomplete")
    return replace(facts, status=status, attempt_run_total=run_total)


def _json_lines(content: bytes) -> tuple[list[tuple[int, dict]], int, list[str], int]:
    lines = content.split(b"\n")
    if lines[-1] == b"":
        lines.pop()
    rows: list[tuple[int, dict]] = []
    reasons: list[str] = []
    bad = 0
    for index, line in enumerate(lines, 1):
        try:
            value = json.loads(line.removesuffix(b"\r"))
            if not isinstance(value, dict) or not isinstance(value.get("type"), str):
                raise ValueError
            rows.append((index, value))
        except (ValueError, UnicodeError):
            bad += 1
            reasons.append("truncated" if index == len(lines) and not content.endswith(b"\n") else "bad_json")
    return rows, bad, reasons, len(lines)


def _hash_ref(prefix: str, value: str) -> str:
    return prefix + ":" + hashlib.sha256(value.encode("utf-8", errors="surrogatepass")).hexdigest()[:16]


def _entry_key(entry: dict) -> str:
    # 整个三元组作哈希，既能比复制键，也不让原始 ID / timestamp 进入事实。
    return _hash_ref("e", json.dumps([entry.get("type"), entry.get("id"), entry.get("timestamp")], ensure_ascii=True))


def _source_label(raw: object, reasons: list[str]) -> str:
    if raw is None:
        return UNKNOWN_LABEL
    if _valid_label(raw, MODEL_LABEL):
        return raw
    reasons.append("invalid_label")
    return INVALID_LABEL


def _stop(raw: object) -> str | None:
    return raw if isinstance(raw, str) and raw in STOP_REASONS else None


def _finality(stop: str | None) -> Finality:
    return "final" if stop in ("stop", "length", "toolUse") else "interrupted" if stop in ("error", "aborted") else "nonfinal"


def _attempt_state(stop: str | None) -> str:
    return "failed" if stop == "error" else "aborted" if stop == "aborted" else "completed"


def _usage_record(raw: dict, ref: str, category: str, ctx: ReadContext, reasons: list[str], *,
                  entry_key: str | None = None, tool_ref: str | None = None,
                  finality: Finality | None = None) -> UsageRecord:
    provider = _source_label(raw.get("provider"), reasons)
    model = _source_label(raw.get("model"), reasons)
    kind = _source_label(raw.get("kind"), reasons) if category == "usage_entry" else UNKNOWN_LABEL
    stop = _stop(raw.get("stopReason")) if category == "main" else None
    finality = finality or (_finality(stop) if category == "main" else "final")
    return UsageRecord(ref, category, kind, provider, model, stop, finality,
                       normalize_usage(raw.get("usage"), finality=finality, provider=provider, model=model, rules=ctx.rules),
                       entry_key, tool_ref, "usage" in raw)


def _tool_ref(raw: object) -> str | None:
    # 原生 ID 是不透明身份；只留哈希，不把参数或 ID 放入输出。
    return _hash_ref("t", raw) if isinstance(raw, str) and raw else None


def _proposals(message: dict) -> tuple[str, ...]:
    content = message.get("content")
    if not isinstance(content, list):
        return ()
    return tuple(ref for block in content if isinstance(block, dict) and block.get("type") == "toolCall"
                 if (ref := _tool_ref(block.get("id"))) is not None)


def _nested(raw: object, parent_ref: str) -> NestedView | None:
    if not isinstance(raw, dict):
        return None
    calls: list[NestedCall] = []
    seen: set[str] = set()
    records = raw.get("calls", [])
    for call in records if isinstance(records, list) else ():
        if not isinstance(call, dict) or not isinstance(call.get("id"), str):
            continue
        ref = _hash_ref("n", parent_ref + "\0" + call["id"])
        if ref in seen:
            continue
        seen.add(ref)
        status = call.get("status")
        calls.append(NestedCall(ref, status if status in ("ok", "error", "unfinished") else "unknown"))
    complete = raw.get("complete")
    return NestedView(tuple(calls), complete if type(complete) is bool else None)


def _read_pi_session_v3(rows: list[tuple[int, dict]], facts: SourceFacts, ctx: ReadContext) -> SourceFacts:
    reasons = list(facts.reasons)
    entries: dict[str, dict] = {}
    keys: set[str] = set()
    records: list[UsageRecord] = []
    attempts: list[AttemptRecord] = []
    tools: list[ToolCallRecord] = []
    proposals: list[tuple[str, str]] = []
    for ordinal, entry in rows:
        eid = entry.get("id")
        if not isinstance(eid, str) or not eid:
            reasons.append("bad_entry")
            continue
        if eid in entries:
            reasons.append("duplicate_entry_id")
            continue
        entries[eid] = entry
        key = _entry_key(entry)
        keys.add(key)
    for eid, entry in entries.items():
        key = _entry_key(entry)
        ref = key
        kind = entry["type"]
        message = entry.get("message") if kind == "message" else None
        if isinstance(message, dict) and message.get("role") == "assistant":
            records.append(_usage_record(message, ref, "main", ctx, reasons, entry_key=key))
            attempts.append(AttemptRecord(ref, _attempt_state(_stop(message.get("stopReason"))), key))
            proposals.extend((ref, call) for call in _proposals(message))
        elif isinstance(message, dict) and message.get("role") == "toolResult":
            owner = _session_owner(entry, entries)
            if owner is None:
                reasons.append("tool_owner_unresolved")
            call = _tool_ref(message.get("toolCallId"))
            usage_ref = None
            if "usage" in message:
                usage_ref = ref
                records.append(_usage_record(message, ref, "tool_nested", ctx, reasons, entry_key=key, tool_ref=call))
            tools.append(ToolCallRecord(owner, ref, "finished", _nested(message.get("nestedCalls"), ref), call,
                                        key, usage_ref, is_error=_bool(message.get("isError")), result_observed=True))
        elif kind in ("compaction", "branch_summary", "usage"):
            # 摘要只取用量；不读取模型归属或负载旁路。
            projected = entry if kind == "usage" else {"usage": entry["usage"]} if "usage" in entry else {}
            records.append(_usage_record(projected, ref, "usage_entry" if kind == "usage" else kind, ctx, reasons, entry_key=key))
    seen_calls: set[tuple[str | None, str | None]] = set()
    for tool in tools:
        identity = (tool.owner_ref, tool.tool_call_ref)
        if tool.tool_call_ref is not None and identity in seen_calls:
            reasons.append("tool_call_id_reused_in_scope")
        seen_calls.add(identity)
    for owner, call in proposals:
        if (owner, call) not in seen_calls:
            tools.append(ToolCallRecord(owner, _hash_ref("p", owner + call), "proposed_only", tool_call_ref=call, entry_key=owner))
    bad_entries = reasons.count("bad_entry")
    return replace(facts, reasons=tuple(reasons), entry_keys=frozenset(keys), usage_records=tuple(records),
                   attempts=tuple(attempts), tool_calls=tuple(tools), bad_line_count=facts.bad_line_count + bad_entries)


def _session_owner(entry: dict, entries: dict[str, dict]) -> str | None:
    parent = entry.get("parentId")
    seen: set[str] = set()
    while isinstance(parent, str) and parent in entries and parent not in seen:
        seen.add(parent)
        ancestor = entries[parent]
        message = ancestor.get("message") if ancestor.get("type") == "message" else None
        if not isinstance(message, dict):
            return None
        if message.get("role") == "assistant":
            return _entry_key(ancestor)
        if message.get("role") != "toolResult":
            return None
        parent = ancestor.get("parentId")
    return None


def _bool(value: object) -> bool | None:
    return value if type(value) is bool else None


def _read_pi_json_events(rows: list[tuple[int, dict]], facts: SourceFacts, ctx: ReadContext) -> SourceFacts:
    reasons = list(facts.reasons)
    records: list[UsageRecord] = []
    attempts: list[AttemptRecord] = []
    tools: list[ToolCallRecord] = []
    markers: list[EventMarker] = []
    nested: list[NestedExecutionRecord] = []
    nested_ids: dict[tuple[str | None, str | None], list[int]] = {}
    proposals: list[tuple[str, str]] = []
    entries: set[str] = set()
    active: UsageRecord | None = None
    active_proposals: tuple[str, ...] = ()
    monotonic: set[str] = set()
    owner: str | None = None
    settled = False
    aborted = None
    for ordinal, event in rows:
        kind = event["type"]
        if kind == "agent_settled":
            settled, aborted = True, _bool(event.get("aborted"))
            markers.append(EventMarker(ordinal, kind, aborted=aborted))
        elif kind not in NONRUN_EVENTS:
            settled = False
        message = event.get("message") if kind in ("message_start", "message_end") else None
        if isinstance(message, dict) and message.get("role") == "assistant":
            if kind == "message_start":
                if active is not None:
                    records.append(_nonmonotonic(active, monotonic))
                    attempts.append(AttemptRecord(active.record_ref, "inflight"))
                    proposals.extend((active.record_ref, call) for call in active_proposals)
                ref = f"a:{ordinal}"
                active = _usage_record(message, ref, "main", ctx, reasons, finality="nonfinal")
                active_proposals = _proposals(message)
                monotonic = set()
                markers.append(EventMarker(ordinal, kind, ref))
            else:
                ref = active.record_ref if active is not None else f"a:{ordinal}"
                record = _usage_record(message, ref, "main", ctx, reasons)
                records.append(record)
                attempts.append(AttemptRecord(ref, _attempt_state(record.stop_reason) if active else "terminal_only"))
                proposals.extend((ref, call) for call in _proposals(message))
                markers.append(EventMarker(ordinal, kind, ref, record.stop_reason))
                active, owner = None, ref
        elif kind == "message_update" and active is not None:
            tokens = normalize_usage(event.get("usage"), finality="nonfinal", provider=active.provider, model=active.model, rules=ctx.rules)
            for name in ("input", "output", "cache_read", "cache_write", "reasoning", "cache_write_1h"):
                previous, latest = getattr(active.tokens, name), getattr(tokens, name)
                if previous.value is not None and (latest.value is None or latest.value < previous.value):
                    monotonic.add(name)
            active = replace(active, tokens=tokens, usage_present="usage" in event)
        elif kind in ("tool_execution_start", "tool_execution_end"):
            parent = event.get("parentToolCallId")
            if isinstance(parent, str) and parent:
                _nested_event(event, ordinal, owner, tools, nested, nested_ids, reasons)
            else:
                _tool_event(event, ordinal, owner, tools, reasons)
        elif kind == "message_end" and isinstance(message, dict) and message.get("role") == "toolResult":
            _event_tool_result(message, ordinal, owner, tools, records, ctx, reasons)
        elif kind == "compaction_end":
            result = event.get("result")
            projected = {"usage": result["usage"]} if isinstance(result, dict) and "usage" in result else {}
            finality = "final" if isinstance(result, dict) and event.get("aborted") is not True else "interrupted"
            records.append(_usage_record(projected, f"c:{ordinal}", "compaction", ctx, reasons, finality=finality))
        elif kind == "entry_appended":
            _appended_entry(event.get("entry"), ordinal, entries, records, ctx, reasons)
        elif kind in ("auto_retry_start", "auto_retry_end", "summarization_retry_scheduled",
                       "summarization_retry_attempt_start", "summarization_retry_finished"):
            attempt = event.get("attempt") if kind.startswith("auto_retry_") else None
            source = event.get("source") if kind.startswith("summarization_retry_") else None
            markers.append(EventMarker(ordinal, kind, attempt=attempt if type(attempt) is int and attempt >= 0 else None,
                                       success=_bool(event.get("success")) if kind == "auto_retry_end" else None,
                                       source=source if source in ("compaction", "branchSummary") else None))
    if active is not None:
        records.append(_nonmonotonic(active, monotonic))
        attempts.append(AttemptRecord(active.record_ref, "inflight"))
        proposals.extend((active.record_ref, call) for call in active_proposals)
    if not settled:
        reasons.append("stream_not_settled")
    identities = {(tool.owner_ref, tool.tool_call_ref) for tool in tools}
    for proposal_owner, call in proposals:
        if (proposal_owner, call) not in identities:
            tools.append(ToolCallRecord(proposal_owner, _hash_ref("p", proposal_owner + call), "proposed_only", tool_call_ref=call))
    retries = _retry_brackets(markers)
    return replace(facts, reasons=tuple(reasons), usage_records=tuple(records), attempts=tuple(attempts),
                   tool_calls=tuple(tools), nested_executions=tuple(nested), markers=tuple(markers), settled=settled,
                   settled_aborted=aborted if settled else None, retries=retries)


def _retry_brackets(markers: list[EventMarker]) -> RetryFacts:
    confirmed = scheduled = summaries = 0
    last_stop = None
    bracket = False
    eligible = observed = False
    for marker in markers:
        if marker.type in ("auto_retry_start", "auto_retry_end", "agent_settled"):
            if bracket and not observed:
                scheduled += 1
            bracket = marker.type == "auto_retry_start"
            eligible, observed = last_stop == "error", False
        elif marker.type == "message_start" and bracket and not observed:
            observed = True
            if eligible:
                confirmed += 1
        elif marker.type == "message_end":
            last_stop = marker.stop_reason
        elif marker.type.startswith("summarization_retry_"):
            summaries += 1
    if bracket and not observed:
        scheduled += 1
    return RetryFacts(Value("known", confirmed, "derived"), scheduled,
                      Value(reason="retry_total_not_provable"), Value("known", summaries, "derived"))


def _nonmonotonic(record: UsageRecord, fields: set[str]) -> UsageRecord:
    return replace(record, tokens=replace(record.tokens, **{key: Value(reason="nonmonotonic") for key in fields}))


def _tool_event(event: dict, ordinal: int, owner: str | None, tools: list[ToolCallRecord], reasons: list[str]) -> None:
    call = _tool_ref(event.get("toolCallId"))
    matches = [i for i, tool in enumerate(tools) if call is not None and tool.owner_ref == owner and tool.tool_call_ref == call]
    if owner is None:
        reasons.append("tool_owner_unresolved")
    if event["type"] == "tool_execution_start":
        if matches:
            reasons.append("tool_call_id_reused_in_scope")
        tools.append(ToolCallRecord(owner, f"t:{ordinal}", "unfinished", tool_call_ref=call))
        return
    unfinished = [i for i in matches if tools[i].state == "unfinished"]
    duration = event.get("durationMs")
    duration = duration if (type(duration) is int or type(duration) is float and math.isfinite(duration)) and duration >= 0 else None
    if unfinished:
        i = unfinished[0]
        tools[i] = replace(tools[i], state="finished", duration_ms=duration, is_error=_bool(event.get("isError")))
    else:
        if matches:
            reasons.append("tool_call_id_reused_in_scope")
        tools.append(ToolCallRecord(owner, f"t:{ordinal}", "terminal_only", tool_call_ref=call,
                                    duration_ms=duration, is_error=_bool(event.get("isError"))))


def _nested_event(event: dict, ordinal: int, owner: str | None, tools: list[ToolCallRecord],
                  nested: list[NestedExecutionRecord], identities: dict, reasons: list[str]) -> None:
    parent = _tool_ref(event["parentToolCallId"])
    parents = [t.call_ref for t in tools if t.owner_ref == owner and t.tool_call_ref == parent]
    if not parents:
        parents = [nested[i].root_ref for i in identities.get((owner, parent), ()) if nested[i].root_ref is not None]
    root = parents[0] if len(parents) == 1 else None
    child = event.get("toolCallId")
    key = (owner, _tool_ref(child))
    ref = _hash_ref("n", root + "\0" + child) if root is not None and isinstance(child, str) else None
    if root is None:
        reasons.append("nested_parent_unresolved")
    matches = [i for i in identities.get(key, ()) if nested[i].root_ref == root]
    if event["type"] == "tool_execution_end":
        unfinished = [i for i in matches if nested[i].state == "unfinished"]
        if unfinished:
            i = unfinished[0]
            nested[i] = replace(nested[i], state="finished")
            return
    state = "unfinished" if event["type"] == "tool_execution_start" else "terminal_only"
    identities.setdefault(key, []).append(len(nested))
    nested.append(NestedExecutionRecord(owner, ref or f"n:{ordinal}", root, state))


def _event_tool_result(message: dict, ordinal: int, owner: str | None, tools: list[ToolCallRecord],
                       records: list[UsageRecord], ctx: ReadContext, reasons: list[str]) -> None:
    call = _tool_ref(message.get("toolCallId"))
    matches = [i for i, tool in enumerate(tools) if call is not None and tool.owner_ref == owner
               and tool.tool_call_ref == call and not tool.result_observed]
    if matches:
        i = matches[0]
    else:
        if owner is None:
            reasons.append("tool_owner_unresolved")
        if any(t.owner_ref == owner and t.tool_call_ref == call for t in tools):
            reasons.append("tool_call_id_reused_in_scope")
        i = len(tools)
        tools.append(ToolCallRecord(owner, f"t:{ordinal}", "terminal_only", tool_call_ref=call))
    tool = tools[i]
    usage_ref = None
    if "usage" in message:
        usage_ref = f"u:{ordinal}"
        records.append(_usage_record(message, usage_ref, "tool_nested", ctx, reasons, tool_ref=call))
    tools[i] = replace(tool, nested=_nested(message.get("nestedCalls"), tool.call_ref), usage_ref=usage_ref,
                       is_error=_bool(message.get("isError")), result_observed=True)


def _appended_entry(raw: object, ordinal: int, seen: set[str], records: list[UsageRecord],
                    ctx: ReadContext, reasons: list[str]) -> None:
    if not isinstance(raw, dict):
        return
    eid = raw.get("id")
    if isinstance(eid, str):
        if eid in seen:
            reasons.append("duplicate_entry_id")
            return
        seen.add(eid)
    kind = raw.get("type")
    ref = f"e:{ordinal}"
    if kind == "usage":
        records.append(_usage_record(raw, ref, "usage_entry", ctx, reasons))
    elif kind == "compaction":
        projected = {"usage": raw["usage"]} if "usage" in raw else {}
        records.append(_usage_record(projected, ref, "compaction", ctx, reasons))
    elif "usage" in raw:
        tokens = TokenCounts(*(Value(reason="entry_appended_usage_unrecognized") for _ in USAGE_FIELDS))
        records.append(UsageRecord(ref, "entry_unrecognized", UNKNOWN_LABEL, UNKNOWN_LABEL, UNKNOWN_LABEL, None, "nonfinal", tokens))


# 聚合
TOKEN_DIMENSIONS = ("input", "output", "cache_read", "cache_write")
SUBSET_DIMENSIONS = ("reasoning", "cache_write_1h")
PEAK_LABEL = "主 assistant 尝试内的来源上报输入峰值"
PEAK_NOTE = "操作记录输入不参与：非单请求值，一条记录可能对应多个请求，请求数 unknown。"


@dataclass(frozen=True, slots=True)
class _Partition:
    net: dict[str, tuple[UsageRecord, ...]]
    copied_keys: dict[str, frozenset[str]]
    lineage: dict[str, dict]
    uncertain: dict[str, set[str]]
    uncertain_records: dict[str, set[str]]
    replaced: dict[str, str]
    covered: dict[str, str]
    relations: list[dict]


def build_report(manifest: Manifest, facts: list[SourceFacts], prior: Conditions | None) -> dict:
    by_id = {fact.source_id: fact for fact in facts}
    partition = _partition_sources(manifest, by_id)
    blockers = set()
    confirmed = []
    confirmed_pairs = []
    count_facts = []
    count_blockers = set()
    sources = []
    for spec in manifest.sources:
        fact = by_id[spec.source_id]
        sid = spec.source_id
        gaps = _source_gaps(fact)
        reasons = gaps | partition.uncertain[sid]
        if partition.lineage[sid].get("reason"):
            reasons.add(partition.lineage[sid]["reason"])
        if partition.uncertain_records[sid]:
            reasons.add("nested_coverage_unverifiable")
        blockers.update(reasons)
        copied_attempts = sum(a.entry_key in partition.copied_keys[sid] for a in fact.attempts)
        run_total = (replace(fact.attempt_run_total, value=fact.attempt_run_total.value - copied_attempts)
                     if fact.attempt_run_total.status == "known" else fact.attempt_run_total)
        scoped = replace(fact, usage_records=partition.net[sid], attempt_run_total=run_total,
                         attempts=tuple(a for a in fact.attempts if a.entry_key not in partition.copied_keys[sid]),
                         tool_calls=tuple(t for t in fact.tool_calls if t.entry_key not in partition.copied_keys[sid]))
        count_blockers.update(gaps | partition.uncertain[sid])
        if partition.lineage[sid].get("reason"):
            count_blockers.add(partition.lineage[sid]["reason"])
        if not partition.uncertain[sid] and sid not in partition.replaced:
            count_facts.append(scoped)
            if sid not in partition.covered:
                records = [r for r in partition.net[sid] if r.record_ref not in partition.uncertain_records[sid]]
                confirmed.extend(records)
                confirmed_pairs.extend((spec, r) for r in records)
        attempts, tools, retries = _count_metrics([scoped], partition.net[sid], gaps,
                                                 selected_has_json_events=fact.format == "pi-json-events")
        sources.append({
            "source_id": sid, "format": fact.format, "session_ref": fact.session_ref,
            "content_sha256": fact.content_sha256, "status": fact.status,
            "reasons": list(fact.reasons), "line_count": fact.line_count, "bad_line_count": fact.bad_line_count,
            "raw_record_count": len(fact.usage_records),
            "copied_record_count": (None if partition.lineage[sid].get("net_new_determined") is False
                                    else len(fact.usage_records) - len(partition.net[sid])),
            "net_new_record_count": None if partition.lineage[sid].get("net_new_determined") is False else len(partition.net[sid]),
            "lineage": partition.lineage[sid],
            "replaced_by": partition.replaced.get(sid), "token_covered_by": partition.covered.get(sid),
            "unconfirmed_reasons": sorted(partition.uncertain[sid]),
            "unconfirmed_record_count": len(partition.uncertain_records[sid]),
            "tokens": _aggregate_tokens(partition.net[sid], gaps, empty_reason=fact.status not in ("empty", "unavailable")),
            "attempts": attempts, "tool_calls": tools, "retries": retries,
            "semantic_rework": _rework([spec]),
            "dimensions": _source_dimensions(manifest, spec, partition.net[sid]),
        })
    unconfirmed_tools = sum(bool(partition.uncertain[sid]) for sid in by_id
                            if sid not in partition.replaced and sid not in partition.covered)
    unconfirmed_tokens = sum(bool(partition.uncertain[sid] or partition.uncertain_records[sid]) for sid in by_id
                             if sid not in partition.replaced and sid not in partition.covered)
    uncertain = unconfirmed_tokens > 0
    tokens = _aggregate_tokens(confirmed, blockers, dedup_confirmed=not uncertain)
    # 未确认分区的已知值仍是观测事实，但不进入批次精确小计。
    if tokens["status"] == "unavailable" and any(s["tokens"]["status"] != "unavailable" for s in sources):
        tokens["status"] = "partial"
    attempts, tools, retries = _count_metrics(count_facts, confirmed, count_blockers,
                                             selected_has_json_events=any(f.format == "pi-json-events" for f in facts))
    # 未确认来源仍有观测值，只是不进入已确认计数。
    for metric, key in ((attempts["main_assistant"], "attempts"), (tools, "tool_calls"), (retries, "retries")):
        if metric["status"] == "unavailable" and any(
                (s[key]["main_assistant"] if key == "attempts" else s[key])["status"] != "unavailable" for s in sources):
            metric["status"] = "partial"
    main = attempts["main_assistant"]
    if main["run_total"]["status"] == "known" and any(f.attempt_run_total.status != "known" for f in facts):
        main["run_total"] = _value_dict(Value(origin="derived", reason="attempt_run_incomplete"))
        main["status"] = "partial"
        main["reasons"] = sorted({f.attempt_run_total.reason or "attempt_run_incomplete" for f in facts if f.attempt_run_total.status != "known"})
    if retries["total"]["status"] == "known" and any(f.retries.total.status != "known" for f in facts):
        retries["total"] = _value_dict(Value(origin="derived", reason="retry_total_not_provable"))
        retries.update(status="partial", confirmed_is_lower_bound=True)
        retries["reasons"] = sorted({f.retries.total.reason or "retry_total_not_provable" for f in facts if f.retries.total.status != "known"})
    if any(f.nested_executions or any(t.nested is not None for t in f.tool_calls) for f in facts):
        tools["all_total"] = _value_dict(Value(reason="nested_overlap_unresolved"))
    retries["semantic_rework"] = _rework(list(manifest.sources))
    timing = _aggregate_timing(manifest, by_id)
    for source, time in zip(sources, timing["sources"]):
        source["timing"] = time
        source["outcome"] = time["outcome"]
        source["annotation_conflict"] = source["dimensions"]["annotation_conflict"] + len(time["outcome"]["reasons"])
        if source["annotation_conflict"]:
            source["reasons"].append("annotation_conflict")
    missing_sources = sum(s["status"] != "loaded" for s in sources)
    groups = _groups(manifest, confirmed_pairs, tokens["known_subtotal"], unconfirmed_tokens, missing_sources)
    if any(not group["conserved"] for group in groups.values()):
        tokens["reasons"] = sorted({*tokens["reasons"], "group_conservation_failed"})
        tokens["complete_total"] = _value_dict(Value(origin="derived", reason="group_conservation_failed"))
        if tokens["status"] == "complete":
            tokens["status"] = "partial"
    observation = _observation(tokens, attempts, tools, retries, timing, len(manifest.sources), missing_sources,
                               {"tokens": unconfirmed_tokens, "tool_calls": unconfirmed_tools})
    return {
        "schema": "dhb-report/1",
        "batch": {"batch_id": manifest.batch_id, "baseline_commit": manifest.baseline_commit,
                  "conditions": {"config_label": manifest.conditions.config_label, "task_scope": manifest.conditions.task_scope}},
        "semantics": {"version": "dhb-metrics/1", "source": "pi-coding-agent 1.4.0 docs"},
        "population": {"selected_sources": len(manifest.sources),
                       "description": "选定来源 content_sha256 文件快照中的记录；不证明运行已结束，不代表整次会话或平台账单。",
                       "partial": [s["source_id"] for s in sources if s["status"] == "partial"],
                       "empty": [s["source_id"] for s in sources if s["status"] == "empty"],
                       "unavailable": [s["source_id"] for s in sources if s["status"] == "unavailable"]},
        "acquisition": {"status": "ok" if all(f.status == "loaded" for f in facts) else "gaps",
                        "sources": [{"source_id": s["source_id"], "status": s["status"], "reasons": s["reasons"]} for s in sources]},
        "sources": sources, "relations": partition.relations, "tokens": tokens,
        "attempts": attempts, "tool_calls": tools, "retries": retries, "timing": timing,
        "observation": observation,
        "groups": groups,
        "comparability": _comparability(manifest, sources, prior),
        "unobserved_paths": _unobserved_paths(facts),
    }


def _count_metrics(facts: list[SourceFacts], operations: list[UsageRecord] | tuple[UsageRecord, ...], blockers=(), *,
                   selected_has_json_events: bool) -> tuple[dict, dict, dict]:
    available = any(f.status in ("loaded", "partial") or f.attempts or f.tool_calls for f in facts)
    states = {state: sum(a.state == state for f in facts for a in f.attempts)
              for state in ("completed", "failed", "aborted", "inflight", "terminal_only")}
    run_reasons = set(blockers)
    run_reasons.update(f.attempt_run_total.reason for f in facts if f.attempt_run_total.status != "known")
    run_reasons.discard(None)
    run_known = bool(facts) and not run_reasons and all(f.attempt_run_total.status == "known" for f in facts)
    observed = sum(states.values()) if available else None
    run_total = Value("known", sum(f.attempt_run_total.value for f in facts), "derived") if run_known else Value(origin="derived", reason="attempt_run_incomplete")
    main = {"states": states, "observed_total": observed, "run_total": _value_dict(run_total),
            "status": "complete" if run_known else "partial" if available else "unavailable", "reasons": sorted(run_reasons)}
    categories = {}
    for category in dict.fromkeys(r.category for r in operations if r.category != "main"):
        members = [r for r in operations if r.category == category]
        item = {"record_count": len(members), "with_usage": sum(r.usage_present for r in members),
                "request_count": _value_dict(Value(reason="operation_request_count_unknown")),
                "coverage": "unrecognized" if category == "entry_unrecognized" else "covered"}
        if category == "usage_entry":
            item["by_kind"] = {kind: sum(r.kind == kind for r in members) for kind in dict.fromkeys(r.kind for r in members)}
        categories[category] = item
    attempts = {"main_assistant": main, "model_operations": categories,
                "scope": "观测到的主 assistant 逻辑尝试，不是全部物理 API 调用数"}
    tools = _tool_counts(facts, available, blockers, selected_has_json_events)
    confirmed = [f.retries.confirmed.value for f in facts if f.retries.confirmed.status == "known"]
    total_known = bool(facts) and not blockers and all(f.retries.total.status == "known" for f in facts)
    retry_reasons = set(blockers) | {f.retries.total.reason for f in facts if f.retries.total.reason}
    summaries = [f.retries.summarization_markers.value for f in facts if f.retries.summarization_markers.status == "known"]
    retries = {"scope": "观测到的 pi 自动重试（assistant 循环级）",
               "confirmed": _value_dict(Value("known", sum(confirmed), "derived") if confirmed else Value(reason="retry_markers_not_persisted")),
               "scheduled_unobserved": sum(f.retries.scheduled_unobserved for f in facts),
               "total": _value_dict(Value("known", sum(f.retries.total.value for f in facts), "derived") if total_known
                                    else Value(origin="derived", reason="retry_markers_not_persisted" if facts and all(f.format == "pi-session-v3" for f in facts)
                                               else "retry_total_not_provable")),
               "summarization_retry_markers": _value_dict(Value("known", sum(summaries), "derived") if summaries
                                                          else Value(reason="retry_markers_not_persisted")),
               "status": "complete" if total_known else "partial" if confirmed else "unavailable",
               "reasons": sorted(retry_reasons), "confirmed_is_lower_bound": not total_known}
    return attempts, tools, retries


def _tool_counts(facts: list[SourceFacts], available: bool, blockers, selected_has_json_events: bool) -> dict:
    tools = [t for f in facts for t in f.tool_calls]
    direct = {state: sum(t.state == state for t in tools) for state in ("finished", "unfinished", "terminal_only")}
    reasons = set(blockers)
    for fact in facts:
        seen = set()
        for tool in fact.tool_calls:
            if tool.state == "proposed_only":
                continue
            identity = (tool.owner_ref, tool.tool_call_ref)
            if tool.owner_ref is None:
                reasons.add("tool_owner_unresolved")
            if tool.tool_call_ref is not None and identity in seen:
                reasons.add("tool_call_id_reused_in_scope")
            seen.add(identity)
    proposed = sum(t.state == "proposed_only" for t in tools)
    if proposed:
        reasons.add("proposed_only")
    if direct["unfinished"] or direct["terminal_only"]:
        reasons.add("tool_execution_incomplete")
    nested = [t.nested for t in tools if t.nested is not None]
    if any(n.complete is False for n in nested):
        reasons.add("nested_incomplete")
    executions = [n for f in facts for n in f.nested_executions]
    if any(n.root_ref is None for n in executions):
        reasons.add("nested_parent_unresolved")
    if any(n.state != "finished" for n in executions):
        reasons.add("nested_execution_incomplete")
    executed = {state: sum(n.state == state for n in executions) for state in ("finished", "unfinished", "terminal_only")}
    confirmed_has_json_events = any(f.format == "pi-json-events" for f in facts)
    # 父未解析是独立属性，与三个执行状态重叠。
    executed.update(parent_unresolved=sum(n.root_ref is None for n in executions),
                    observed_total=len(executions) if confirmed_has_json_events else None,
                    scope="选定且已确认去重的 pi-json-events 来源",
                    reasons=[] if confirmed_has_json_events else
                    ["overlap_unconfirmed" if selected_has_json_events else "nested_events_not_persisted"])
    deduplicated = {"observed_total": 0, "matched": 0, "executed_only": 0, "reported_only": 0}
    for fact in facts:
        reported_ids = {c.call_ref for t in fact.tool_calls if t.nested for c in t.nested.calls}
        executed_ids = {n.call_ref for n in fact.nested_executions if n.root_ref is not None}
        unresolved = sum(n.root_ref is None for n in fact.nested_executions)
        deduplicated["observed_total"] += len(reported_ids | executed_ids) + unresolved
        deduplicated["matched"] += len(reported_ids & executed_ids)
        deduplicated["executed_only"] += len(executed_ids - reported_ids) + unresolved
        deduplicated["reported_only"] += len(reported_ids - executed_ids)
    complete = bool(facts) and all(f.status == "loaded" for f in facts) and not reasons
    direct["observed_total"] = sum(direct.values()) if available else None
    nested_count = sum(len(n.calls) for n in nested)
    all_total = (Value(reason="nested_overlap_unresolved") if nested or executions else Value(reason="overlap_unconfirmed") if blockers
                 else Value("known", direct["observed_total"], "derived") if available else Value(reason="no_usable_source"))
    return {"direct": direct, "proposed_only": proposed,
            "nested_executed": executed, "nested_deduplicated": deduplicated,
            "nested_reported": {"observed_total": nested_count if nested else None,
                                "status": "partial" if any(n.complete is False for n in nested) else "complete" if nested else "unavailable",
                                "states": {state: sum(c.status == state for n in nested for c in n.calls)
                                           for state in ("ok", "error", "unfinished", "unknown")}},
            "all_total": _value_dict(all_total), "status": "complete" if complete else "partial" if available else "unavailable",
            "reasons": sorted(reasons), "views_additive": False}


def _rework(specs: list[SourceSpec]) -> dict:
    annotated = [s for s in specs if s.rework is not None]
    known = sum(s.rework.value for s in annotated) if annotated else None
    complete = len(annotated) == len(specs)
    return {"known_subtotal": known, "total": _value_dict(Value("known", known, "annotation") if complete
                                                        else Value(origin="annotation", reason="rework_not_annotated")),
            "status": "complete" if complete else "partial" if annotated else "unavailable",
            "reasons": [] if complete else ["rework_not_annotated"],
            "annotated_sources": len(annotated), "missing_sources": len(specs) - len(annotated),
            "annotations": [{"source_id": s.source_id, "count": s.rework.value, "origin": "annotation", "basis": s.rework.basis} for s in annotated]}


def _unobserved_paths(facts: list[SourceFacts]) -> list[dict]:
    paths: dict[str, list[str]] = {}
    for fact in facts:
        names = ["physical_http_sdk_provider_requests_and_retries", "failed_or_aborted_cache_warm_requests",
                 "model_operation_request_counts", "tool_model_work_without_usage"]
        if fact.format == "pi-session-v3":
            names += ["inflight_attempts_not_persisted", "retry_markers_not_persisted", "tool_duration_not_persisted"]
        else:
            names.append("branch_summary_not_emitted")
        if any(t.nested is not None and t.nested.complete is False for t in fact.tool_calls):
            names.append("incomplete_nested_paths")
        if any(r.category == "compaction" and not r.usage_present for r in fact.usage_records):
            names.append("compaction_usage_missing")
        for name in names:
            paths.setdefault(name, []).append(fact.source_id)
    return [{"path": name, "status": "unobserved", "sources": ids,
             "note": "选定记录小计 ≠ 整次会话或平台账单"} for name, ids in paths.items()]


def _source_timing(spec: SourceSpec, fact: SourceFacts) -> dict:
    annotation = spec.timing
    result = {"source_id": spec.source_id, "status": "unavailable", "reasons": [],
              "duration_seconds": {"status": "unknown", "value": None, "origin": "annotation"},
              "partial_duration_seconds": {"status": "unknown", "value": None, "origin": "annotation"},
              "partial_label": "标注观测至（下界）", "outcome": _outcome(fact, annotation),
              "annotation": None, "offset_aware": False}
    if annotation is None:
        result["reasons"] = ["timing_not_annotated"]
        return result
    result["annotation"] = {"origin": annotation.origin, "basis": annotation.basis,
                            "start": annotation.start.isoformat() if annotation.start else None,
                            "end": annotation.end.isoformat() if annotation.end else None,
                            "observed_until": annotation.observed_until.isoformat() if annotation.observed_until else None}
    start, end, until = annotation.start, annotation.end, annotation.observed_until
    times = [t for t in (start, end, until) if t is not None]
    awareness = {t.utcoffset() is not None for t in times}
    if len(awareness) > 1:
        result["reasons"] = ["timing_offset_mismatch"]
        return result
    if ((start is not None and end is not None and end < start)
            or (start is not None and until is not None and until < start)
            or (end is not None and until is not None and until > end)):
        result["reasons"] = ["timing_invalid_order"]
        return result
    result["offset_aware"] = awareness == {True}
    if start is not None and end is not None:
        result["status"] = "complete"
        result["duration_seconds"].update(status="known", value=(end - start).total_seconds())
    elif start is not None:
        result["status"] = "partial"
        result["reasons"] = ["timing_end_missing"]
        if until is not None:
            result["partial_duration_seconds"].update(status="partial", value=(until - start).total_seconds())
    else:
        result["reasons"] = ["timing_start_missing"]
    return result


def _outcome(fact: SourceFacts, annotation: TimingAnnotation | None) -> dict:
    native = "unknown"
    interrupted = fact.settled and fact.settled_aborted is True
    if fact.settled and fact.settled_aborted is False:
        last = next((r for r in reversed(fact.usage_records) if r.category == "main"), None)
        native = "failed" if last is not None and last.stop_reason == "error" else "completed"
    annotated = annotation.outcome if annotation is not None else None
    conflict = native != "unknown" and annotated is not None and native != annotated
    value = "unknown" if conflict else native if native != "unknown" else annotated or "unknown"
    return {"value": value, "origin": "derived" if conflict else "source" if native != "unknown" else "annotation" if annotated else "derived",
            "scope": "被观测 agent run", "native": native, "interrupted": interrupted,
            "annotation": {"value": annotated, "origin": annotation.origin, "basis": annotation.basis} if annotated else None,
            "reasons": ["annotation_conflict"] if conflict else []}


def _aggregate_timing(manifest: Manifest, facts: dict[str, SourceFacts]) -> dict:
    sources = [_source_timing(s, facts[s.source_id]) for s in manifest.sources]
    reasons = {reason for s in sources for reason in s["reasons"]}
    if any(s["status"] != "complete" for s in sources):
        reasons.add("timing_bounds_unknown")
    if any(s["status"] == "complete" and not s["offset_aware"] for s in sources):
        reasons.add("timing_clocks_incomparable")
    windows: dict[str, TimingAnnotation | None] = {}
    selected: list[TimingAnnotation | None] = []
    duplicates = []
    for spec, source in zip(manifest.sources, sources):
        identity = facts[spec.source_id].session_ref
        annotation = spec.timing
        if identity is not None and identity in windows:
            previous = windows[identity]
            if (annotation is not None and previous is not None and source["status"] == "complete"
                    and previous.start == annotation.start and previous.end == annotation.end):
                duplicates.append(spec.source_id)
            else:
                reasons.add("duplicate_timing_conflict")
        else:
            if identity is not None:
                windows[identity] = annotation
            selected.append(annotation)
    complete = not reasons
    window = {"status": "unknown", "value": None, "origin": "derived"}
    duration_sum = dict(window)
    if complete:
        window.update(status="known", value=(max(t.end for t in selected) - min(t.start for t in selected)).total_seconds())
        duration_sum.update(status="known", value=sum((t.end - t.start).total_seconds() for t in selected))
    return {"sources": sources, "batch_window_seconds": window, "session_duration_sum_seconds": duration_sum,
            "window_label": "批次观测墙钟窗口", "sum_label": "会话耗时合计", "duplicate_captures_counted_once": duplicates,
            "status": "complete" if complete else "partial" if any(s.timing is not None for s in manifest.sources) else "unavailable",
            "reasons": sorted(reasons), "known_sources": sum(s["status"] == "complete" for s in sources),
            "partial_sources": sum(s["status"] == "partial" for s in sources)}


def _dimension_values(manifest: Manifest, spec: SourceSpec, record: UsageRecord | None) -> dict:
    dimensions = {}
    for name in ("phase", "role", "model", "channel", "baseline_commit"):
        annotated = getattr(spec.dimensions, name, None)
        if name == "baseline_commit" and annotated is None:
            annotated = manifest.baseline_commit
        native = record.model if record is not None and name == "model" else record.provider if record is not None and name == "channel" else None
        native = None if native == UNKNOWN_LABEL else native
        conflict = native is not None and annotated is not None and native != annotated
        dimensions[name] = {"value": native or annotated or UNKNOWN_LABEL,
                            "origin": "source" if native else "annotation" if annotated else "derived",
                            "reason": "annotation_conflict" if conflict else "missing" if not native and not annotated else None}
    return dimensions


def _source_dimensions(manifest: Manifest, spec: SourceSpec, records: tuple[UsageRecord, ...]) -> dict:
    values = [_dimension_values(manifest, spec, record) for record in records] or [_dimension_values(manifest, spec, None)]
    dimensions = {}
    for name in ("phase", "role", "model", "channel", "baseline_commit"):
        distinct = []
        for value in values:
            if value[name] not in distinct:
                distinct.append(value[name])
        dimensions[name] = distinct
    dimensions["annotation_conflict"] = sum(v["reason"] == "annotation_conflict" for row in values for v in row.values())
    return dimensions


def _groups(manifest: Manifest, pairs: list[tuple[SourceSpec, UsageRecord]], subtotal: int | None,
            unconfirmed_sources: int, missing_sources: int) -> dict:
    result = {}
    resolved = [(record, _dimension_values(manifest, spec, record)) for spec, record in pairs]
    for name in ("phase", "role", "model", "channel"):
        groups: dict[str, list[UsageRecord]] = {UNKNOWN_LABEL: []}
        for record, dimensions in resolved:
            groups.setdefault(dimensions[name]["value"], []).append(record)
        totals = {label: _aggregate_tokens(records) for label, records in groups.items()}
        conserved = sum(g["known_subtotal"] or 0 for g in totals.values()) == (subtotal or 0)
        result[name] = {"groups": totals, "conserved": conserved, "population": "选定且已确认去重的快照记录",
                        "unconfirmed_excluded": unconfirmed_sources > 0, "record_count": len(pairs), "known_subtotal": subtotal,
                        "denominator": None if missing_sources or unconfirmed_sources else len(pairs),
                        "missing_sources": {"count": missing_sources, "unit": "来源"},
                        "unconfirmed_sources": {"count": unconfirmed_sources, "unit": "来源"}}
    return result


def _observation(tokens: dict, attempts: dict, tools: dict, retries: dict, timing: dict,
                 selected: int, missing_sources: int, unconfirmed_sources: dict[str, int]) -> dict:
    main, rework = attempts["main_assistant"], retries["semantic_rework"]
    definitions = {
        "tokens": (tokens, "用量归属记录", "选定且已确认去重的快照记录", tokens["record_count"], tokens["known_records"], tokens["unknown_records"]),
        "main_attempts": (main, "观测到的主 assistant 逻辑尝试", "选定且已确认去重的主 assistant 尝试", main["run_total"]["value"], main["observed_total"], None),
        "tool_calls": (tools, "来源内调用身份", "选定且已确认去重的 direct 视图", tools["direct"]["observed_total"], tools["direct"]["finished"],
                       tools["direct"]["unfinished"] + tools["direct"]["terminal_only"]),
        "retries": (retries, "已确认的 pi 自动重试关联", "选定来源的 pi assistant 循环级重试", retries["total"]["value"], retries["confirmed"]["value"], None),
        "rework": (rework, "来源", "选定来源的 rework 标注", selected, rework["annotated_sources"], rework["missing_sources"]),
        "timing": (timing, "来源（会话）", "全部选定会话的确认起止与批次窗口", selected, timing["known_sources"], selected - timing["known_sources"]),
    }
    metrics = {}
    for name, (metric, unit, population, denominator, covered, missing) in definitions.items():
        if name in ("tokens", "tool_calls") and (missing_sources or unconfirmed_sources[name]):
            # 来源缺口或未确认分区的记录数未知，不能以已确认子集充当总体。
            denominator = missing = None
        metrics[name] = {"status": metric["status"], "reasons": metric["reasons"], "unit": unit, "population": population,
                         "denominator": denominator, "covered": covered, "missing": missing,
                         "coverage_percent": 100 * covered / denominator if denominator and covered is not None else None}
        if name in ("tokens", "tool_calls"):
            metrics[name]["missing_sources"] = {"count": missing_sources, "unit": "来源"}
            metrics[name]["unconfirmed_sources"] = {"count": unconfirmed_sources[name], "unit": "来源"}
    complete = sum(m["status"] == "complete" for m in metrics.values())
    return {"metrics": metrics, "metrics_complete": complete, "overall": "complete" if complete == 6 else "incomplete"}


def _source_gaps(fact: SourceFacts) -> set[str]:
    if fact.status == "empty":
        return {"no_usage_records_observed"}
    if fact.status in ("partial", "unavailable"):
        return set(fact.reasons) or {"source_incomplete"}
    return set()


def _value_dict(value: Value) -> dict:
    return {"status": value.status, "value": value.value, "origin": value.origin, "reason": value.reason}


def _record_known(record: UsageRecord) -> bool:
    return (record.finality == "final" and not record.tokens.unreconciled
            and all(getattr(record.tokens, name).status == "known" for name in TOKEN_DIMENSIONS))


def _dimension_totals(records: list[UsageRecord] | tuple[UsageRecord, ...], name: str) -> dict:
    values = [getattr(record.tokens, name) for record in records]
    known = [v.value for v in values if v.status == "known"]
    partial = [v.value for v in values if v.status == "partial"]
    return {"known_subtotal": sum(known) if known else None, "known_records": len(known),
            "partial_lower_bound": sum(partial) if partial else None, "partial_records": len(partial),
            "unknown_records": sum(v.status == "unknown" and v.reason != "invalid" for v in values),
            "invalid_records": sum(v.reason == "invalid" for v in values),
            "annotation_records": sum(v.origin == "annotation" for v in values)}


def _aggregate_tokens(records: list[UsageRecord] | tuple[UsageRecord, ...], blockers=(), *,
                      dedup_confirmed: bool = True, empty_reason: bool = True) -> dict:
    dimensions = {name: _dimension_totals(records, name) for name in TOKEN_DIMENSIONS}
    known = [r for r in records if _record_known(r)]
    subtotal = sum(getattr(r.tokens, name).value for r in known for name in TOKEN_DIMENSIONS) if known else None
    reasons = set(blockers)
    if not records and empty_reason:
        reasons.add("no_confirmed_records")
    for record in records:
        if not _record_known(record):
            reasons.update(record.tokens.reasons)
            reasons.update(getattr(record.tokens, name).reason for name in TOKEN_DIMENSIONS if getattr(record.tokens, name).reason)
            if record.finality != "final":
                reasons.add("nonfinal_usage")
    if len(known) != len(records):
        reasons.add("record_usage_unknown")
    if not dedup_confirmed:
        reasons.add("overlap_unconfirmed")
    complete = not reasons and subtotal is not None
    total = Value("known", subtotal, "derived") if complete else Value(origin="derived", reason="complete_total_unknown")
    main = [r for r in records if r.category == "main"]
    peak_values = [sum(getattr(r.tokens, name).value for name in ("input", "cache_read", "cache_write"))
                   for r in main if r.finality == "final" and not r.tokens.unreconciled
                   and all(getattr(r.tokens, name).status == "known" for name in ("input", "cache_read", "cache_write"))]
    lower_bound = len(peak_values) != len(main) or bool(blockers) or not dedup_confirmed
    categories = {}
    for category in dict.fromkeys(r.category for r in records):
        members = [r for r in records if r.category == category]
        item = {"record_count": len(members)}
        if category != "entry_unrecognized":
            complete_members = [r for r in members if _record_known(r)]
            item["known_subtotal"] = (sum(getattr(r.tokens, name).value for r in complete_members for name in TOKEN_DIMENSIONS)
                                      if complete_members else None)
            if category != "main":
                item["request_count"] = _value_dict(Value(reason="operation_request_count_unknown"))
            if category == "usage_entry":
                item["by_kind"] = {kind: {"record_count": sum(r.kind == kind for r in members),
                                         "known_subtotal": sum(getattr(r.tokens, name).value for r in complete_members
                                                               if r.kind == kind for name in TOKEN_DIMENSIONS)
                                         if any(r.kind == kind for r in complete_members) else None}
                                   for kind in dict.fromkeys(r.kind for r in members)}
        categories[category] = item
    observed = any(d["known_records"] or d["partial_records"] for d in dimensions.values())
    return {"status": "complete" if complete else "partial" if observed else "unavailable",
            "unit": "用量归属记录", "population": "选定且已确认去重的快照记录", "record_count": len(records),
            "dimensions": dimensions, "subsets": {name: _dimension_totals(records, name) for name in SUBSET_DIMENSIONS},
            "known_subtotal": subtotal, "known_records": len(known), "unknown_records": len(records) - len(known),
            "complete_total": _value_dict(total), "reasons": sorted(reasons),
            "deduplication": "confirmed" if dedup_confirmed else "unconfirmed",
            "deduplication_label": "已确认去重" if dedup_confirmed else "未完全去重",
            "peak": {"label": PEAK_LABEL, "note": PEAK_NOTE, "value": max(peak_values) if peak_values else None,
                     "participating_records": len(peak_values), "attempt_records": len(main), "lower_bound": lower_bound,
                     "coverage_label": "已知记录中的峰值（下界）" if lower_bound else "选定主 assistant 尝试记录"},
            "categories": categories}


def _relation_components(specs: tuple[SourceSpec, ...]) -> list[list[tuple[str, Link]]]:
    edges = {s.source_id: s.duplicate_of or s.nested_of for s in specs if s.duplicate_of or s.nested_of}
    neighbours: dict[str, set[str]] = {}
    for sid, link in edges.items():
        target = link.sources[0]
        neighbours.setdefault(sid, set()).add(target)
        neighbours.setdefault(target, set()).add(sid)
    components = []
    seen = set()
    for root in neighbours:
        if root in seen:
            continue
        pending, members = [root], set()
        while pending:
            sid = pending.pop()
            if sid in members:
                continue
            members.add(sid)
            pending.extend(neighbours[sid] - members)
        seen.update(members)
        components.append([(sid, link) for sid, link in edges.items() if sid in members])
    return components


def _partition_sources(manifest: Manifest, facts: dict[str, SourceFacts]) -> _Partition:
    partition = _Partition({sid: f.usage_records for sid, f in facts.items()}, {sid: frozenset() for sid in facts},
                           {sid: {} for sid in facts}, {sid: set() for sid in facts}, {sid: set() for sid in facts}, {}, {}, [])
    unsupported = set()
    links = []
    for component in _relation_components(manifest.sources):
        targets = {link.sources[0] for _, link in component}
        supported = len(targets) == 1 and len({link.type for _, link in component}) == 1
        members = targets | {sid for sid, _ in component}
        if not supported:
            unsupported.update(members)
            for sid in members:
                partition.uncertain[sid].add("relation_shape_unsupported")
        for sid, link in component:
            relation = {"type": link.type, "source": sid, "target": link.sources[0], "origin": "annotation",
                        "basis": link.basis, "effective": False, "reasons": [], "verification": "unverified"}
            partition.relations.append(relation)
            if supported:
                links.append((sid, link, relation))
            else:
                relation["reasons"] = ["relation_shape_unsupported"]
    for sid, link, relation in links:
        if link.type != "duplicate_of":
            continue
        target = link.sources[0]
        child, parent = facts[sid], facts[target]
        relation["note"] = "正确性由断言者负责；断言错误时，来源独有的尾部记录会被丢弃。"
        is_v3 = child.format == parent.format == "pi-session-v3"
        relation["verification"] = "v3_keyset" if is_v3 else "unverified"
        if child.status != "loaded" or parent.status != "loaded":
            reason = "duplicate_target_unavailable"
        elif is_v3 and not child.entry_keys <= parent.entry_keys:
            reason = "duplicate_not_contained"
        else:
            reason = None
        if reason:
            relation["reasons"] = [reason]
            partition.uncertain[sid].add(reason)
            partition.uncertain[target].add(reason)
        else:
            relation["effective"] = True
            relation["note"] += "按人工链接被目标取代。" if is_v3 else "未经核验的人工断言；按人工链接被目标取代。"
            partition.replaced[sid] = target
    _lineage_partition(manifest, facts, partition, unsupported)
    sessions: dict[str, list[str]] = {}
    for sid, fact in facts.items():
        if fact.session_ref and sid not in partition.replaced:
            sessions.setdefault(fact.session_ref, []).append(sid)
    for members in sessions.values():
        if len(members) > 1:
            for sid in members:
                partition.uncertain[sid].add("same_session_unconfirmed")
    _nested_partition(manifest, facts, partition, links)
    for link in manifest.links:
        partition.relations.append({"type": "disjoint", "sources": list(link.sources), "basis": link.basis,
                                    "origin": "annotation", "effective": True, "reasons": [], "verification": "unverified"})
    return partition


def _lineage_partition(manifest: Manifest, facts: dict[str, SourceFacts], partition: _Partition, unsupported: set[str]) -> None:
    paths = {os.path.normcase(os.path.abspath(s.path)): s.source_id for s in manifest.sources}
    for sid, child in facts.items():
        if not child.parent_link:
            continue
        target = paths.get(child.parent_link)
        if target is None:
            partition.lineage[sid] = {"reason": "parent_not_selected", "net_new_determined": False,
                                      "copied_entry_count": None, "note": "可能含复制自父会话的历史用量，无法区分。"}
            continue
        partition.lineage[sid] = {"parent": target, "net_new_determined": False, "copied_entry_count": None}
        if sid in unsupported or target in unsupported:
            continue
        parent = facts[target]
        if parent.status != "loaded":
            partition.lineage[sid].update(reason="lineage_parent_unavailable", note="血缘父未完整加载，无法区分复制件。")
            if parent.status == "partial":
                partition.uncertain[sid].add("lineage_parent_unavailable")
                partition.uncertain[target].add("lineage_parent_unavailable")
            continue
        child_usage = {r.entry_key: r for r in child.usage_records if r.entry_key}
        parent_usage = {r.entry_key: r for r in parent.usage_records if r.entry_key}
        shared = child.entry_keys & parent.entry_keys
        conflict = any((key in child_usage) != (key in parent_usage)
                       or (key in child_usage and (child_usage[key].tokens != parent_usage[key].tokens
                           or child_usage[key].finality != parent_usage[key].finality
                           or child_usage[key].usage_present != parent_usage[key].usage_present)) for key in shared)
        if conflict:
            partition.uncertain[sid].add("lineage_usage_conflict")
            partition.uncertain[target].add("lineage_usage_conflict")
            partition.lineage[sid]["reason"] = "lineage_usage_conflict"
        else:
            partition.copied_keys[sid] = frozenset(shared)
            partition.net[sid] = tuple(r for r in child.usage_records if r.entry_key not in shared)
            partition.lineage[sid].update(net_new_determined=True, copied_entry_count=len(shared), note="复制件由血缘父计。")


def _nested_partition(manifest: Manifest, facts: dict[str, SourceFacts], partition: _Partition,
                      links: list[tuple[str, Link, dict]]) -> None:
    declared = len(manifest.sources) == 1 or manifest.all_nested_children_declared
    if not declared:
        for sid, records in partition.net.items():
            if sid not in partition.replaced and sid not in partition.covered:
                partition.uncertain_records[sid].update(r.record_ref for r in records if r.category == "tool_nested")
    groups: dict[tuple[str, str], list[tuple[str, dict]]] = {}
    for sid, link, relation in links:
        if link.type == "nested_of":
            groups.setdefault((link.sources[0], link.tool_call_ref), []).append((sid, relation))
    decisions = [(parent, group, _nested_failure(parent, tool_ref, [sid for sid, _ in group], declared, facts, partition))
                 for (parent, tool_ref), group in groups.items()]
    for parent, group, reason in decisions:
        children = [sid for sid, _ in group]
        for sid, relation in group:
            relation["verification"] = "per_dimension_net_new"
            relation["effective"] = reason is None
            relation["reasons"] = [reason] if reason else []
            if reason is None:
                partition.covered[sid] = parent
        if reason:
            for sid in [parent, *children]:
                partition.uncertain[sid].add(reason)


def _nested_failure(parent: str, tool_ref: str, children: list[str], declared: bool,
                    facts: dict[str, SourceFacts], partition: _Partition) -> str | None:
    members = [parent, *children]
    if not declared or any(facts[sid].status != "loaded" for sid in members):
        return "nested_coverage_unverifiable"
    matches = [t for t in facts[parent].tool_calls if t.result_observed and t.tool_call_ref == tool_ref]
    if len(matches) != 1:
        return "nested_link_mismatch"
    tool = matches[0]
    record = next((r for r in partition.net[parent] if r.record_ref == tool.usage_ref), None)
    if record is None or not record.usage_present:
        return "nested_coverage_absent"
    if not _record_known(record) or tool.nested is not None and tool.nested.complete is False:
        return "nested_coverage_partial"
    if (any(partition.uncertain[sid] for sid in members)
            or any(partition.lineage[sid].get("net_new_determined") is False for sid in children)):
        return "nested_coverage_unverifiable"
    records = [r for sid in children for r in partition.net[sid]]
    if not all(_record_known(r) for r in records):
        return "nested_coverage_unverifiable"
    if any(sum(getattr(r.tokens, name).value for r in records) != getattr(record.tokens, name).value for name in TOKEN_DIMENSIONS):
        return "nested_sum_mismatch"
    return None


# 输出
class _ArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> None:
        raise InputError("invalid_arguments")


class _OutputError(Exception):
    def __init__(self, category: str, remaining: int) -> None:
        self.category = category
        self.remaining = remaining


def main(argv: list[str] | None = None) -> int:
    try:
        args = _arguments(argv)
        manifest = load_manifest(Path(args.manifest))
        out_dir = _out_dir(args.out_dir)
        prior = _load_comparison(Path(args.compare_with)) if args.compare_with else None
        facts = [read_source(source, ReadContext(manifest.confirmed_zero)) for source in manifest.sources]
        report = build_report(manifest, facts, prior)
        artifacts = [("report.json", json.dumps(report, ensure_ascii=False, indent=2) + "\n")]
        if args.detail:
            artifacts.append(("records.json", json.dumps(_detail_records(facts), ensure_ascii=False, indent=2) + "\n"))
        artifacts.append(("summary.md", render_summary(report)))
        _write_artifacts(out_dir, artifacts)
        counts = {state: sum(s["status"] == state for s in report["sources"])
                  for state in ("loaded", "partial", "empty", "unavailable")}
        print("dev-harness-budget: report written; sources=" + report["acquisition"]["status"]
              + " " + " ".join(f"{state}={count}" for state, count in counts.items())
              + f"; metrics_complete={report['observation']['metrics_complete']}/6"
              + f"; overall_observation={report['observation']['overall']}; not an acceptance verdict")
        return 0 if report["acquisition"]["status"] == "ok" else 3
    except SystemExit as error:
        return 0 if error.code == 0 else 2
    except InputError as error:
        print(f"error: {error.category}" + (f" {error.field_path}" if error.field_path else ""), file=sys.stderr)
        return 2
    except _OutputError as error:
        print(f"error: {error.category}" + (f"; partial_artifacts_left={error.remaining}" if error.remaining else ""), file=sys.stderr)
        return 2 if error.category == "output_exists" else 1
    except (Exception, KeyboardInterrupt):
        print("error: internal_error", file=sys.stderr)
        return 1


def _arguments(argv: list[str] | None) -> argparse.Namespace:
    parser = _ArgumentParser(prog="dev-harness-budget", allow_abbrev=False)
    commands = parser.add_subparsers(dest="command", required=True)
    report = commands.add_parser("report", allow_abbrev=False)
    report.add_argument("--manifest", required=True)
    report.add_argument("--out-dir", required=True)
    report.add_argument("--detail", action="store_true")
    report.add_argument("--compare-with")
    return parser.parse_args(argv)


def _out_dir(raw: str) -> Path:
    try:
        path = Path(raw).resolve()
        if not path.is_dir():
            raise InputError("out_dir_invalid")
        if path.is_relative_to(Path(__file__).resolve().parents[2]):
            raise InputError("out_dir_inside_repo")
        return path
    except (OSError, ValueError):
        raise InputError("out_dir_invalid") from None


def _load_comparison(path: Path) -> Conditions:
    # 比较入口只投影元数据；其余字段既不校验也不复制。
    try:
        with path.open("rb") as stream:
            raw = json.load(stream)
        if not isinstance(raw, dict) or raw.get("schema") != "dhb-report/1":
            raise ValueError
        batch = raw.get("batch", {})
        semantics = raw.get("semantics", {})
        sources = raw.get("sources", [])
        if not isinstance(batch, dict) or not isinstance(semantics, dict) or not isinstance(sources, list):
            raise ValueError
        conditions = batch.get("conditions", {})
        if not isinstance(conditions, dict):
            raise ValueError
        models, formats = set(), set()
        models_complete = formats_complete = bool(sources)
        for source in sources:
            if not isinstance(source, dict):
                raise ValueError
            format_name = source.get("format")
            if format_name is not None:
                if format_name not in ("pi-session-v3", "pi-json-events"):
                    raise ValueError
                formats.add(format_name)
            else:
                formats_complete = False
            dimensions = source.get("dimensions", {})
            if not isinstance(dimensions, dict):
                raise ValueError
            values = dimensions.get("model", [])
            if not isinstance(values, list):
                raise ValueError
            models_complete &= bool(values)
            for item in values:
                if not isinstance(item, dict):
                    raise ValueError
                value = item.get("value")
                if value in (None, UNKNOWN_LABEL, INVALID_LABEL):
                    models_complete = False
                else:
                    models.add(_label(value, "", MODEL_LABEL))
        return Conditions(_comparison_label(conditions, "config_label"), _comparison_label(conditions, "task_scope"),
                          _comparison_label(batch, "baseline_commit", COMMIT), tuple(sorted(models)), models_complete,
                          tuple(sorted(formats)), formats_complete, _comparison_label(semantics, "version", MODEL_LABEL),
                          _comparison_label(semantics, "source"))
    except (OSError, ValueError, TypeError, InputError):
        raise InputError("compare_report_invalid") from None


def _comparison_label(obj: dict, key: str, pattern: re.Pattern = LABEL) -> str | None:
    value = obj.get(key)
    return None if value is None else _label(value, "", pattern)


def _comparability(manifest: Manifest, sources: list[dict], prior: Conditions | None) -> dict:
    values = [v["value"] for source in sources for v in source["dimensions"]["model"]]
    models = tuple(sorted({v for v in values if v not in (UNKNOWN_LABEL, INVALID_LABEL)}))
    current = Conditions(manifest.conditions.config_label, manifest.conditions.task_scope, manifest.baseline_commit,
                         models, bool(values) and all(v not in (UNKNOWN_LABEL, INVALID_LABEL) for v in values),
                         tuple(sorted({s["format"] for s in sources})), True, "dhb-metrics/1", "pi-coding-agent 1.4.0 docs")
    fields = ("models", "config_label", "task_scope", "metrics_version", "formats")
    differences, missing = [], []
    for name in fields:
        left, right = getattr(current, name), getattr(prior, name) if prior else None
        if left and right and left != right:
            differences.append(name)
        if (not left or not right
                or name == "models" and (not current.models_complete or not prior or not prior.models_complete)
                or name == "formats" and (not current.formats_complete or not prior or not prior.formats_complete)):
            missing.append(name)
    status = "different" if differences else "unknown" if missing else "same"
    note = manifest.comparability_note
    def metadata(value: Conditions) -> dict:
        return {"baseline_commit": value.baseline_commit, "config_label": value.config_label, "task_scope": value.task_scope,
                "models": list(value.models), "models_complete": value.models_complete,
                "formats": list(value.formats), "formats_complete": value.formats_complete,
                "metrics_version": value.metrics_version, "semantics_source": value.semantics_source}
    return {"status": status, "label": {"different": "条件不同、不可直接比较", "unknown": "可比性未知", "same": "比较条件相同"}[status],
            "differences": differences, "missing": missing, "current": metadata(current), "prior": metadata(prior) if prior else None,
            "baseline": "已披露", "baseline_different": bool(prior and current.baseline_commit and prior.baseline_commit
                                                                and current.baseline_commit != prior.baseline_commit),
            "note": {"text": note.value, "origin": "annotation", "basis": note.basis} if note else None,
            "disclaimer": "比较条件相同不等于基线充分或质量相同；不计算差值，不给出节省或质量结论。"}


def _detail_records(facts: list[SourceFacts]) -> dict:
    # 明细不是事件回放：只输出类型化用量，不输出调用 ID、原始消息或标记。
    return {"schema": "dhb-records/1", "sources": [
        {"source_id": fact.source_id, "records": [
            {"record_ref": r.record_ref, "category": r.category, "kind": r.kind, "provider": r.provider, "model": r.model,
             "finality": r.finality, "stop_reason": r.stop_reason,
             "tokens": {name: _value_dict(getattr(r.tokens, name)) for name in (*TOKEN_DIMENSIONS, *SUBSET_DIMENSIONS)},
             "unreconciled": r.tokens.unreconciled, "reasons": list(r.tokens.reasons)} for r in fact.usage_records]}
        for fact in facts]}


def _write_artifacts(out_dir: Path, artifacts: list[tuple[str, str]]) -> None:
    created = []
    try:
        for name, content in artifacts:
            with (out_dir / name).open("x", encoding="utf-8", newline="\n") as stream:
                created.append(out_dir / name)
                stream.write(content)
    except (Exception, KeyboardInterrupt) as error:
        remaining = 0
        for path in reversed(created):
            try:
                path.unlink()
            except FileNotFoundError:
                pass
            except (OSError, ValueError):
                remaining += 1
        category = "output_exists" if isinstance(error, FileExistsError) else "write_failed" if isinstance(error, OSError) else "internal_error"
        raise _OutputError(category, remaining) from None


def render_summary(report: dict) -> str:
    tokens, observation = report["tokens"], report["observation"]
    peak, timing = tokens["peak"], report["timing"]
    lines = ["# 开发批次用量观测", "", "非验收结论", "",
             "## 报告生成", "报告生成：产物已生成；全部写出后本摘要才有效。", "",
             "## 来源采集", f"来源采集：{report['acquisition']['status']}", report["population"]["description"],
             "选定记录小计 ≠ 整次会话或平台账单"]
    for state in ("partial", "empty", "unavailable"):
        lines.append(f"非 loaded 来源 {state}：{', '.join(report['population'][state]) or '无'}")
    lines += ["", "## 度量覆盖", f"整体观测：{observation['overall']}；complete 度量 {observation['metrics_complete']}/6。",
              "| 度量 | 状态 | 单位 | 选定总体（分母口径） | 分母 | 已覆盖 | 未覆盖 / 缺失 | 覆盖率 | 原因 |",
              "|---|---|---|---|---|---|---|---|---|"]
    for name, metric in observation["metrics"].items():
        percent = "未知" if metric["coverage_percent"] is None else f"{metric['coverage_percent']:g}%"
        lines.append(f"| {name} | {metric['status']} | {metric['unit']} | {metric['population']} | {_display(metric['denominator'])} | "
                     f"{_display(metric['covered'])} | {_display(metric['missing'])} | {percent} | {', '.join(metric['reasons']) or '无'} |")
    missing_sources = observation["metrics"]["tokens"]["missing_sources"]
    if missing_sources["count"]:
        lines += ["", f"tokens / tool_calls：非 loaded 选定来源 {missing_sources['count']} {missing_sources['unit']}；不与记录计数相加。"]
    unconfirmed_tokens = observation["metrics"]["tokens"]["unconfirmed_sources"]["count"]
    unconfirmed_tools = observation["metrics"]["tool_calls"]["unconfirmed_sources"]["count"]
    if unconfirmed_tokens or unconfirmed_tools:
        lines += ["", f"tokens：未确认去重来源 {unconfirmed_tokens} 来源；tool_calls：{unconfirmed_tools} 来源；不与记录计数相加。"]
    unknown_population = missing_sources["count"] > 0 or unconfirmed_tokens > 0
    unknown_records_label = ("未知用量归属记录数 未知" if unknown_population
                             else f"未知 {tokens['unknown_records']} 条用量归属记录")
    lines += ["", "### token", f"已知小计 {_display(tokens['known_subtotal'])} token；完整总计 {_display(tokens['complete_total']['value'])} token。",
              f"{tokens['deduplication_label']}；{unknown_records_label}；原因：{', '.join(tokens['reasons']) or '无'}。",
              "| 维度 | 已知小计（token） | 已知记录 | 部分观测值（下界，token） | 部分记录 | 未知记录 | 无效记录 |",
              "|---|---|---|---|---|---|---|"]
    for name, dimension in {**tokens["dimensions"], **tokens["subsets"]}.items():
        label = name + ("（子集，不再计入总量）" if name in tokens["subsets"] else "")
        unknown_records = None if unknown_population else dimension["unknown_records"]
        lines.append(f"| {label} | {_display(dimension['known_subtotal'])} | {dimension['known_records']} | "
                     f"{_display(dimension['partial_lower_bound'])} | {dimension['partial_records']} | {_display(unknown_records)} | {dimension['invalid_records']} |")
    lines += [f"记录单位：用量归属记录；分母 {_display(observation['metrics']['tokens']['denominator'])}（选定且已确认去重的快照记录）。", "",
              f"{peak['label']}：{_display(peak['value'])} token；{peak['coverage_label']}；参与记录数 / 尝试总数：{peak['participating_records']} / {peak['attempt_records']}。",
              peak["note"], "", "### 尝试、工具、重试与返工"]
    main, tools, retries = report["attempts"]["main_assistant"], report["tool_calls"], report["retries"]
    lines += [report["attempts"]["scope"], f"观测到的主 assistant 尝试：{_display(main['observed_total'])}；运行内总数：{_display(main['run_total']['value'])}。",
              "尝试状态：" + "；".join(f"{k}={v}" for k, v in main["states"].items()),
              f"工具 direct：{_display(tools['direct']['observed_total'])}；仅提议：{tools['proposed_only']}；nested_reported：{_display(tools['nested_reported']['observed_total'])}；两视图不相加；全部总数：{_display(tools['all_total']['value'])}。"]
    if tools["all_total"]["reason"] == "nested_overlap_unresolved":
        executed, dedup = tools["nested_executed"], tools["nested_deduplicated"]
        lines.append(f"嵌套工具调用（不计入 direct、不与 direct 相加）：执行事件 {_display(executed['observed_total'])}（父未解析 {executed['parent_unresolved']}）；nestedCalls 记录 {_display(tools['nested_reported']['observed_total'])}；按标识去重后 {dedup['observed_total']}（两者均见 {dedup['matched']}）。")
    lines += [f"{retries['scope']}：已确认小计（下界）{_display(retries['confirmed']['value'])}；排程但未观测尝试 {retries['scheduled_unobserved']}；总数 {_display(retries['total']['value'])}。",
              f"摘要重试标记：{_display(retries['summarization_retry_markers']['value'])}；语义返工已知小计：{_display(retries['semantic_rework']['known_subtotal'])}；完整总数：{_display(retries['semantic_rework']['total']['value'])}。"]
    for name, operation in report["attempts"]["model_operations"].items():
        lines.append(f"操作记录 {name}：{operation['record_count']} 条；{'已覆盖' if operation['coverage'] == 'covered' else '无法识别'}；请求数未知，不与尝试相加。")
    lines += ["", "### 时间", f"{timing['window_label']}：{_display(timing['batch_window_seconds']['value'])} 秒。",
              f"{timing['sum_label']}：{_display(timing['session_duration_sum_seconds']['value'])} 秒。", "", "## 观测到的执行结果"]
    for source in report["sources"]:
        outcome, time = source["outcome"], source["timing"]
        lines.append(f"- {source['source_id']}：{outcome['value']}（{outcome['scope']}，origin={outcome['origin']}）；耗时 {_display(time['duration_seconds']['value'])} 秒；{time['partial_label']} {_display(time['partial_duration_seconds']['value'])} 秒。")
    lines += ["", "## 分组", "各维度独立守恒，只含已确认去重的选定记录；不跨维度相加。"]
    for name, group in report["groups"].items():
        lines += [f"### {name}", f"单位：用量归属记录；分母 {_display(group['denominator'])}；{group['population']}。",
                  "| 分组 | 已知小计（token） | 已覆盖记录 | 未覆盖 / 缺失记录 | 分母 |", "|---|---|---|---|---|"]
        for label, values in group["groups"].items():
            missing = values["unknown_records"] if group["denominator"] is not None else None
            denominator = values["record_count"] if group["denominator"] is not None else None
            lines.append(f"| {label} | {_display(values['known_subtotal'])} | {values['known_records']} | {_display(missing)} | {_display(denominator)} |")
    lines += ["", "## 证据与比较条件", f"批次：{report['batch']['batch_id']}；基线提交：{report['batch']['baseline_commit'] or '未知'}。",
              f"度量版本：{report['semantics']['version']}；来源语义：{report['semantics']['source']}。"]
    for source in report["sources"]:
        lines.append(f"- {source['source_id']}：{source['format']}；session_ref={source['session_ref'] or '未知'}；content_sha256={source['content_sha256'] or '未知'}；{source['status']}；原因：{', '.join(source['reasons']) or '无'}。")
        lines.append(f"  观测到的归属记录 {source['raw_record_count']} 条；复制件 {_display(source['copied_record_count'])} 条；净新增记录 {_display(source['net_new_record_count'])} 条；token 消耗{'未知' if source['tokens']['complete_total']['value'] is None else '已知'}；来源已知小计 {_display(source['tokens']['known_subtotal'])}。")
        for name in ("phase", "role", "model", "channel", "baseline_commit"):
            lines.append(f"  {name}：" + "；".join(f"{v['value']}（{v['origin']}）" for v in source["dimensions"][name]))
        if source["timing"]["annotation"]:
            annotation = source["timing"]["annotation"]
            lines.append(f"  时间标注来源：{annotation['origin']}；出处：{annotation['basis']}。")
    for relation in report["relations"]:
        lines.append(f"- 关系 {relation['type']}（annotation，{relation['basis']}）：effective={relation['effective']}；{relation['verification']}；{relation.get('note', '')} {'; '.join(relation['reasons'])}")
    comparison = report["comparability"]
    lines += [comparison["label"], "基线差异仅已披露，不据此判不可比。",
              "已知差异：" + (", ".join(comparison["differences"]) or "无"), "缺失条件：" + (", ".join(comparison["missing"]) or "无")]
    for label in ("current", "prior"):
        metadata = comparison[label]
        if metadata:
            lines.append(label + "：" + "；".join(f"{key}={', '.join(value) if isinstance(value, list) else _display(value)}" for key, value in metadata.items()))
    if comparison["note"]:
        note = comparison["note"]
        lines.append(f"人工说明：{note['text']}（{note['origin']}；出处 {note['basis']}），不移除差异警示。")
    lines += [comparison["disclaimer"], "", "## 未观测路径"]
    lines += [f"- {item['path']}：未观测（{', '.join(item['sources'])}），不视为 0。" for item in report["unobserved_paths"]]
    return "\n".join(lines) + "\n"


def _display(value: object) -> str:
    return "未知" if value is None else str(value)


if __name__ == "__main__":
    raise SystemExit(main())
