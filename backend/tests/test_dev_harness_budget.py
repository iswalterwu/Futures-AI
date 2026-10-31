"""通过公开接口观测合成文件；不复写统计算法。"""
import ast
from dataclasses import FrozenInstanceError, replace
import hashlib
import json
import os
from pathlib import Path
import subprocess

import pytest

from tools import dev_harness_budget as budget
from tests import dev_harness_budget_fixtures as fx


def read_fixture(tmp_path, rows, *, kind="pi-session-v3", **metadata):
    path = fx.write_jsonl(tmp_path / "source.jsonl", rows)
    manifest = budget.load_manifest(fx.write_manifest(tmp_path / "manifest.json", [fx.source(path, kind=kind)], **metadata))
    return budget.read_source(manifest.sources[0], budget.ReadContext(manifest.confirmed_zero))


@pytest.mark.parametrize("case,field_path", [
    ("self", "sources[0].duplicate_of.source"),
    ("missing", "sources[0].duplicate_of.source"),
    ("duplicate_cycle", "sources[1].duplicate_of.source"),
    ("nested_cycle", "sources[1].nested_of.source"),
    ("mixed_cycle", "sources[1].nested_of.source"),
    ("both", "sources[0].nested_of"),
    ("unknown_key", "unknown_field"),
    ("unknown_nested_key", "sources[0].dimensions.unknown_field"),
    ("version", "manifest_version"),
    ("boolean_version", "manifest_version"),
    ("baseline", "baseline_commit"),
    ("duplicate_id", "sources[1].source_id"),
    ("bad_kind", "sources[0].kind"),
    ("path_label", "sources[0].dimensions.phase"),
    ("provider_path", "confirmed_zero[0].provider"),
    ("model_path", "confirmed_zero[0].model"),
    ("tool_path", "sources[0].nested_of.tool_call_id"),
    ("bad_timing", "sources[0].timing.origin"),
    ("valid", None),
])
def test_relation_graph_rejected(tmp_path, case, field_path):
    metadata = {}
    if case in {"self", "missing", "duplicate_cycle", "nested_cycle", "mixed_cycle", "both"}:
        sources = fx.f11_sources(case)
    else:
        sources = [fx.source(tmp_path / "not-opened-A", "A"), fx.source(tmp_path / "not-opened-B", "B")]
        if case == "unknown_key":
            metadata["PRIVATE_KEY_SENTINEL"] = "PRIVATE_VALUE_SENTINEL"
        elif case == "unknown_nested_key":
            sources[0]["dimensions"] = {"PRIVATE_KEY_SENTINEL": "PRIVATE_VALUE_SENTINEL"}
        elif case in {"version", "boolean_version"}:
            metadata["manifest_version"] = True if case == "boolean_version" else 2
        elif case == "baseline":
            metadata["baseline_commit"] = "PRIVATE_VALUE_SENTINEL"
        elif case == "duplicate_id":
            sources[1]["source_id"] = "A"
        elif case == "bad_kind":
            sources[0]["kind"] = "PRIVATE_VALUE_SENTINEL"
        elif case == "path_label":
            sources[0]["dimensions"] = {"phase": "C:/PRIVATE_VALUE_SENTINEL"}
        elif case in {"provider_path", "model_path"}:
            metadata["confirmed_zero"] = [{"provider": "openai", "model": "*", "fields": ["input"], "basis": "synthetic"}]
            metadata["confirmed_zero"][0]["provider" if case == "provider_path" else "model"] = "C:/PRIVATE_VALUE_SENTINEL"
        elif case == "tool_path":
            sources[0]["nested_of"] = {"source": "B", "basis": "synthetic", "tool_call_id": "C:/PRIVATE_VALUE_SENTINEL"}
        elif case == "bad_timing":
            sources[0]["timing"] = {"origin": "PRIVATE_VALUE_SENTINEL", "basis": "synthetic"}
        elif case == "valid":
            metadata.update(baseline_commit="7bd2e5b", conditions={"config_label": "测试 config", "task_scope": "T01-03"},
                            confirmed_zero=[{"provider": "openai", "model": "*", "fields": ["cacheWrite"], "basis": "manual-1"}],
                            comparability_note={"text": "same scope", "basis": "manual-2"},
                            all_nested_children_declared=True, links=[{"type": "disjoint", "sources": ["A", "B"], "basis": "manual-3"}])
            sources[0].update(dimensions={"phase": "Implement", "role": "author", "channel": "openai", "baseline_commit": "123abcd"},
                              rework={"count": 0, "basis": "manual-4"},
                              timing={"start": "2026-10-30T00:00:00Z", "end": "2026-10-30T00:00:30Z",
                                      "outcome": "timeout", "origin": "external", "basis": "manual-5"})
    path = fx.write_manifest(tmp_path / "manifest.json", sources, **metadata)
    with fx.audit_events() as events:
        if field_path is not None:
            with pytest.raises(budget.InputError) as caught:
                budget.load_manifest(path)
            assert caught.value.category == "manifest_invalid"
            assert caught.value.field_path == field_path
            assert "PRIVATE" not in str(caught.value)
            assert "undeclared-private-sentinel" not in str(caught.value)
        else:
            manifest = budget.load_manifest(path)
            assert manifest.baseline_commit == "7bd2e5b"
            assert manifest.conditions.config_label == "测试 config"
            assert manifest.sources[0].rework.value == 0
            assert manifest.sources[0].timing.outcome == "timeout"
            assert manifest.confirmed_zero[0].model == "*"
            assert manifest.links[0].sources == ("A", "B")
            with pytest.raises(FrozenInstanceError):
                manifest.batch_id = "changed"
            assert not hasattr(manifest, "__dict__")
    assert len(events) == 1
    assert events[0][0] == "open"
    assert events[0][1][1] == "r"  # 审计 mode 不含 b；O_BINARY 由 flags 表达。


@pytest.mark.parametrize("case,status,reason,bad", [
    ("missing", "unavailable", "source_missing", 0),
    ("directory", "unavailable", "source_unreadable", 0),
    ("v2", "unavailable", "unsupported_version", 0),
    ("no_version", "unavailable", "unsupported_version", 0),
    ("rpc", "unavailable", "unsupported_format", 0),
    ("header", "empty", None, 0),
    ("bad_json", "partial", "bad_json", 1),
    ("truncated", "partial", "truncated", 1),
    ("bad_utf8", "partial", "bad_json", 1),
    ("nonobject", "partial", "bad_json", 1),
    ("bad_header", "unavailable", "unsupported_format", 1),
    ("bad_entry", "partial", "bad_entry", 1),
    ("crlf", "loaded", None, 0),
    ("no_final_lf", "loaded", None, 0),
])
def test_observation_failures_marked(tmp_path, case, status, reason, bad):
    source_path = fx.f6_file(tmp_path / "source", case)
    manifest = budget.load_manifest(fx.write_manifest(tmp_path / "manifest.json", [fx.source(source_path)]))
    with fx.audit_events() as events:
        facts = budget.read_source(manifest.sources[0], budget.ReadContext())
    assert facts.status == status
    assert facts.bad_line_count == bad
    assert reason is None or reason in facts.reasons
    assert facts.attempt_run_total.status == "unknown"
    assert facts.attempt_run_total.value is None
    if status in ("empty", "unavailable"):
        assert facts.usage_records == ()
    else:
        assert len(facts.usage_records) == 1
        assert facts.usage_records[0].tokens.input.value == 100
        assert facts.session_ref == "s:" + hashlib.sha256(b"synthetic-session").hexdigest()[:16]
    if case not in ("missing", "directory"):
        assert facts.content_sha256 == hashlib.sha256(source_path.read_bytes()).hexdigest()
    assert len(events) == 1 and events[0][0] == "open"
    assert events[0][1][1] == "r"


def test_historical_records_same_semantics(tmp_path):
    paths = [fx.write_jsonl(tmp_path / "new.jsonl", fx.f1_rows()), fx.write_jsonl(tmp_path / "old.jsonl", fx.f1_rows(True))]
    manifest = budget.load_manifest(fx.write_manifest(tmp_path / "manifest.json", [fx.source(paths[0], "new"), fx.source(paths[1], "old")]))
    with fx.audit_events() as events:
        new, old = [budget.read_source(s, budget.ReadContext()) for s in manifest.sources]
    assert new.status == old.status == "loaded"
    assert new.usage_records[0].tokens == old.usage_records[0].tokens
    tokens = new.usage_records[0].tokens
    assert (tokens.input.value, tokens.output.value, tokens.cache_read.value, tokens.cache_write.value, tokens.reasoning.value) == (100, 20, 40, 10, 5)
    assert new.attempts[0].state == old.attempts[0].state == "completed"
    assert new.entry_keys != old.entry_keys
    assert new.content_sha256 != old.content_sha256
    assert new.line_count == old.line_count == 2  # U+2028 / U+2029 不拆行。
    assert [event for event, _ in events] == ["open", "open"]
    assert new.retries.total.status == "unknown"
    assert new.retries.confirmed.reason == "retry_markers_not_persisted"
    # 全文件分支、摘要与工具归属：上下文折叠 / 编辑不能隐藏历史。
    rows = fx.f1_rows()
    rows[0]["parentSession"] = str(tmp_path / "unselected-parent")
    rows += [fx.entry("a2", parent="a1", message=fx.assistant("toolUse", calls=("call_0", "call_1", "proposed"))),
             fx.entry("t1", parent="a2", message={"role": "toolResult", "toolCallId": "call_0", "usage": fx.usage(2, 1, 1, 1),
                                                  "nestedCalls": {"calls": [{"id": "n1", "status": "ok"}, {"id": "n1", "status": "ok"}], "complete": True}}),
             fx.entry("t2", parent="t1", message={"role": "toolResult", "toolCallId": "call_1"}),
             fx.entry("c1", "compaction", parent="t2", usage=fx.usage(3, 1, 1, 1), summary="not metadata"),
             fx.entry("b1", "branch_summary", parent="a1", usage=fx.usage(4, 1, 1, 1)),
             fx.entry("u1", "usage", parent="b1", kind="future-operation", provider="org/provider", model="qwen3:32b", usage=fx.usage(5, 1, 1, 1)),
             fx.entry("c2", "compaction", parent="u1"),
             fx.entry("edit", "context_edit", parent="c2", targetId="a1", replacement=None)]
    rows += [rows[1]]
    extended_path = fx.write_jsonl(tmp_path / "extended.jsonl", rows)
    selected = budget.load_manifest(fx.write_manifest(tmp_path / "extended-manifest.json", [fx.source(extended_path)]))
    with fx.audit_events() as events:
        facts = budget.read_source(selected.sources[0], budget.ReadContext())
    assert facts.status == "loaded"
    assert len(facts.attempts) == 2
    assert [r.category for r in facts.usage_records] == ["main", "main", "tool_nested", "compaction", "branch_summary", "usage_entry", "compaction"]
    assert facts.usage_records[5].kind == "future-operation"
    assert facts.usage_records[5].model == "qwen3:32b"
    assert facts.usage_records[-1].usage_present is False
    assert facts.usage_records[-1].tokens.input.status == "unknown"
    assert facts.reasons.count("duplicate_entry_id") == 1
    assert [t.state for t in facts.tool_calls] == ["finished", "finished", "proposed_only"]
    assert facts.tool_calls[0].owner_ref == facts.tool_calls[1].owner_ref == facts.attempts[1].record_ref
    assert len(facts.tool_calls[0].nested.calls) == 1
    assert facts.parent_link == os.path.normcase(os.path.abspath(tmp_path / "unselected-parent"))
    assert [event for event, _ in events] == ["open"]


@pytest.mark.parametrize("case,unreconciled,reason", [
    ("missing_total", False, None), ("valid_total", False, None),
    ("string_total", True, "total_tokens_invalid"), ("negative_total", True, "total_tokens_invalid"),
    ("bool_total", True, "total_tokens_invalid"), ("float_total", True, "total_tokens_invalid"),
    ("nan_total", True, "total_tokens_invalid"), ("mismatch", True, "total_tokens_mismatch"),
    ("reasoning_exceeds", True, "subset_exceeds_parent"), ("cache_subset_exceeds", True, "subset_exceeds_parent"),
    ("missing_dimension", False, None), ("missing_subset", False, None),
    ("invalid_dimension", False, None), ("bool_dimension", False, None),
    ("float_dimension", False, None), ("infinite_dimension", False, None), ("zero", False, None),
])
def test_subset_fields_and_unreconciled(tmp_path, case, unreconciled, reason):
    raw = fx.f7_usage(case)
    counts = budget.normalize_usage(raw, finality="final", provider="openai", model="synthetic-model", rules=())
    assert counts.unreconciled is unreconciled
    assert counts.reasons == (() if reason is None else (reason,))
    if case in ("missing_total", "valid_total"):
        assert (counts.input.value, counts.output.value, counts.cache_read.value, counts.cache_write.value) == (100, 20, 40, 10)
        assert (counts.reasoning.value, counts.cache_write_1h.value) == (5, 3)
    elif case == "missing_dimension":
        assert counts.cache_read == budget.Value(reason="missing")
    elif case == "missing_subset":
        assert counts.reasoning == budget.Value(reason="missing")
    elif case.endswith("dimension"):
        assert counts.input == budget.Value(reason="invalid")
    elif case == "zero":
        assert counts.cache_write == budget.Value(reason="default_zero")
        rules = (budget.ZeroRule("openai", "*", ("cacheWrite", "cacheWrite1h"), "synthetic-proof"),)
        confirmed = budget.normalize_usage(raw, finality="final", provider="openai", model="synthetic-model", rules=rules)
        assert confirmed.cache_write == budget.Value("known", 0, "annotation")
        assert confirmed.cache_write_1h == budget.Value("known", 0, "annotation")
        unmatched = budget.normalize_usage(raw, finality="final", provider="other", model="synthetic-model", rules=rules)
        assert unmatched.cache_write.status == "unknown"
        interrupted = budget.normalize_usage(raw, finality="interrupted", provider="openai", model="synthetic-model", rules=rules)
        assert interrupted.cache_write.status == "unknown"
        assert interrupted.input == budget.Value("partial", 100)
    facts = read_fixture(tmp_path, [fx.header(), fx.entry("a1", message=fx.assistant(tokens=raw))])
    assert facts.usage_records[0].tokens == counts


@pytest.mark.parametrize("case", ["success", "chain", "cancelled", "after_end", "unmarked", "partial", "nonmonotonic"])
def test_cumulative_snapshots_final_12(tmp_path, case):
    rows = fx.f3_stream_rows(case == "nonmonotonic") if case in ("partial", "nonmonotonic") else fx.f4_rows() if case == "unmarked" else fx.f2_rows(case)
    facts = read_fixture(tmp_path, rows, kind="pi-json-events")
    main = [r for r in facts.usage_records if r.category == "main"]
    if case in ("success", "chain"):
        final = main[-1]
        assert final.finality == "final"
        assert (final.tokens.input.value, final.tokens.output.value, final.tokens.cache_read.value, final.tokens.cache_write.value) == (9, 1, 1, 1)
        assert len(main) == (3 if case == "chain" else 2)
        assert facts.status == "loaded"
        assert facts.attempt_run_total.value == (3 if case == "chain" else 2)
        assert facts.retries.total.reason == "retry_total_not_provable"
        assert [m.type for m in facts.markers] == (["message_start", "message_end", "auto_retry_start",
                                                   "message_start", "message_end", "auto_retry_start",
                                                   "message_start", "message_end", "auto_retry_end", "agent_settled"] if case == "chain" else
                                                  ["message_start", "message_end", "auto_retry_start", "message_start", "message_end", "auto_retry_end", "agent_settled"])
        assert main[0].tokens.input.status == "unknown"  # error 默认零不是实际零。
    elif case == "cancelled":
        assert len(main) == 1
        assert [m.type for m in facts.markers] == ["message_start", "message_end", "auto_retry_start", "auto_retry_end", "agent_settled"]
        assert facts.markers[-2].success is False
        assert facts.settled_aborted is True
    elif case == "after_end":
        assert len(main) == 2
        assert [m.type for m in facts.markers] == ["message_start", "message_end", "auto_retry_start", "auto_retry_end", "agent_settled", "message_start", "message_end", "agent_settled"]
    elif case == "unmarked":
        assert len(main) == 2
        assert [m.type for m in facts.markers] == ["message_start", "message_end", "message_start", "message_end", "agent_settled"]
    else:
        assert facts.status == "partial"
        assert len(main) == 1
        assert main[0].finality == "nonfinal"
        assert main[0].tokens.output == (budget.Value(reason="nonmonotonic") if case == "nonmonotonic" else budget.Value("partial", 10))
        assert facts.attempts[0].state == "inflight"
        assert facts.attempt_run_total.status == "unknown"
    assert [m.ordinal for m in facts.markers] == sorted(m.ordinal for m in facts.markers)


@pytest.mark.parametrize("case", ["repeated", "tool_result_pair", "other_roles", "two_owners", "reused", "unfinished", "proposed", "terminal_only", "orphan_tool", "operations", "labels", "states"])
def test_repeated_message_counted_once(tmp_path, case):
    if case in ("repeated", "tool_result_pair", "other_roles"):
        rows = fx.f2_rows()
        if case == "other_roles":
            pairs = [event for role in ("user", "custom", "system")
                     for event in fx.tool_result_events({"role": role, "usage": fx.usage(999, 999, 999, 999)})]
            rows = rows[:1] + pairs + rows[1:]
    elif case == "operations":
        rows = fx.f2_rows()[:-1] + [
            {"type": "summarization_retry_scheduled", "errorMessage": "not metadata"},
            {"type": "summarization_retry_attempt_start", "source": "compaction"},
            {"type": "summarization_retry_finished"},
            {"type": "compaction_end", "result": {"usage": fx.usage(8, 2, 1, 1), "summary": "not metadata"}, "aborted": False},
            {"type": "compaction_end", "errorMessage": "not metadata", "aborted": False},
            {"type": "compaction_end", "aborted": True},
            {"type": "agent_settled", "aborted": True}]
    elif case == "labels":
        rows = [fx.header(), {"type": "message_end", "message": fx.assistant(provider="C:/PRIVATE_SENTINEL", model="//private/PRIVATE_SENTINEL")},
                {"type": "entry_appended", "entry": {"type": "usage", "id": "u1", "kind": "C:/PRIVATE_SENTINEL", "usage": fx.usage(), "provider": "org/provider", "model": "qwen3:32b"}},
                {"type": "agent_settled", "aborted": False}]
    else:
        rows = fx.f12_events(case)
    facts = read_fixture(tmp_path, rows, kind="pi-json-events")
    if case in ("repeated", "tool_result_pair", "other_roles", "operations"):
        assert "tool_call_id_reused_in_scope" not in facts.reasons
        assert len(facts.attempts) == 2
        assert len(facts.tool_calls) == 1
        tool = facts.tool_calls[0]
        assert tool.state == "finished"
        assert tool.duration_ms == 3
        assert tool.result_observed
        assert tool.nested.complete is False
        assert len(tool.nested.calls) == 2
        nested = [r for r in facts.usage_records if r.category == "tool_nested"]
        assert len(nested) == 1
        assert nested[0].tokens.input.value == 2  # end.result.usage 的 999 不读。
        assert nested[0].record_ref == tool.usage_ref
        assert [a.state for a in facts.attempts] == ["failed", "completed"]
        if case == "operations":
            operations = [r for r in facts.usage_records if r.category == "compaction"]
            assert len(operations) == 3
            assert [r.finality for r in operations] == ["final", "interrupted", "interrupted"]
            assert operations[0].tokens.input.value == 8
            assert operations[1].tokens.input.status == operations[2].tokens.input.status == "unknown"
            assert [m.source for m in facts.markers if m.type.startswith("summarization_retry_")] == [None, "compaction", None]
    elif case in ("two_owners", "reused"):
        assert len(facts.tool_calls) == 2
        assert [t.state for t in facts.tool_calls] == ["finished", "finished"]
        assert (facts.tool_calls[0].owner_ref == facts.tool_calls[1].owner_ref) is (case == "reused")
        assert facts.reasons.count("tool_call_id_reused_in_scope") == (1 if case == "reused" else 0)
    elif case in ("unfinished", "proposed"):
        assert len(facts.tool_calls) == 1
        assert facts.tool_calls[0].state == ("unfinished" if case == "unfinished" else "proposed_only")
    elif case == "states":
        assert [a.state for a in facts.attempts] == ["completed", "completed", "completed", "failed", "aborted", "completed"]
        assert [r.finality for r in facts.usage_records] == ["final", "final", "final", "interrupted", "interrupted", "nonfinal"]
        assert facts.usage_records[3].tokens.input == budget.Value("partial", 100)
        assert facts.usage_records[5].tokens.input == budget.Value("partial", 100)
    elif case == "terminal_only":
        assert facts.attempts[0].state == "terminal_only"
        assert facts.attempt_run_total.status == "unknown"
    elif case == "orphan_tool":
        assert len(facts.tool_calls) == 1
        assert facts.tool_calls[0].state == "terminal_only"
        assert facts.tool_calls[0].owner_ref is None
        assert "tool_owner_unresolved" in facts.reasons
    elif case == "labels":
        assert facts.reasons.count("invalid_label") == 3
        assert facts.usage_records[0].provider == facts.usage_records[0].model == "(无效标签)"
        assert facts.usage_records[1].kind == "(无效标签)"
        assert facts.usage_records[1].provider == "org/provider"
        assert facts.usage_records[1].model == "qwen3:32b"
        assert "PRIVATE_SENTINEL" not in repr(facts)
    assert "call_0" not in repr(facts)


@pytest.mark.parametrize("case", ["allowed", "two_prompts", "none", "unknown", "appended",
    "agent_start", "agent_end", "turn_start", "turn_end", "message_start", "message_update", "message_end",
    "tool_execution_start", "tool_execution_update", "tool_execution_end", "compaction_start", "compaction_end",
    "auto_retry_start", "auto_retry_end", "summarization_retry_scheduled", "summarization_retry_attempt_start", "summarization_retry_finished"])
def test_stream_settled_tail_rule(tmp_path, case):
    rows = fx.f6_tail_rows("allowed" if case == "appended" else case)
    if case == "appended":
        # T-03 只验证入口归属 / 白名单；F13 与完整总计在 T-04。
        appended = {"type": "entry_appended", "entry": {"type": "usage", "id": "u1", "kind": "cache_warm", "provider": "openai", "model": "synthetic-model", "usage": fx.usage(5, 1, 30, 4), "note": "PRIVATE_PAYLOAD"}}
        rows += [appended, appended,
                 {"type": "entry_appended", "entry": {"type": "compaction", "id": "c1", "usage": fx.usage(2, 1, 1, 1), "summary": "PRIVATE_PAYLOAD", "details": "PRIVATE_PAYLOAD", "systemMessage": "PRIVATE_PAYLOAD"}},
                 {"type": "entry_appended", "entry": {"type": "unrecognized", "id": "x1", "usage": {"input": 987654}}},
                 {"type": "entry_appended", "entry": {"type": "custom_message", "id": "custom-2", "content": "PRIVATE_PAYLOAD"}}]
    facts = read_fixture(tmp_path, rows, kind="pi-json-events")
    expected = "loaded" if case in ("allowed", "two_prompts", "appended") else "partial"
    assert facts.status == expected
    assert facts.settled is (expected == "loaded")
    assert ("stream_not_settled" in facts.reasons) is (expected == "partial")
    assert facts.settled_aborted is (False if expected == "loaded" else None)
    if case == "appended":
        assert [r.category for r in facts.usage_records] == ["main", "usage_entry", "compaction", "entry_unrecognized"]
        assert facts.reasons.count("duplicate_entry_id") == 1
        assert facts.usage_records[1].tokens.cache_read.value == 30
        assert facts.usage_records[2].tokens.input.value == 2
        assert facts.usage_records[3].tokens.input == budget.Value(reason="entry_appended_usage_unrecognized")
        assert "987654" not in repr(facts)
        assert "PRIVATE_PAYLOAD" not in repr(facts)


@pytest.mark.parametrize("case,direct,executed,reported", [
    ("a", 1, 2, 2), ("b", 1, 3, 3), ("c", 1, 3, 2), ("d", 1, 2, 1),
    ("e", 2, 2, 2), ("f", 2, 2, 2), ("F2", 1, 2, 2),
    *[(case, count, 0, 0) for case, count in (("two_owners", 2), ("reused", 2), ("unfinished", 1),
        ("proposed", 0), ("orphan_tool", 1), ("inflight", 0), ("terminal_only", 0), ("states", 0))],
])
def test_nested_execution_events_read_as_nested(tmp_path, case, direct, executed, reported):
    rows = fx.f2_rows() if case == "F2" else fx.f14_rows(case) if case in "abcdef" else fx.f12_events(case)
    facts = read_fixture(tmp_path, rows, kind="pi-json-events")
    tools = [t for t in facts.tool_calls if t.state != "proposed_only"]
    assert len(tools) == direct
    assert len(facts.nested_executions) == executed
    calls = {c.call_ref for t in tools if t.nested for c in t.nested.calls}
    resolved = {n.call_ref for n in facts.nested_executions if n.root_ref is not None}
    assert len(calls) == reported
    if case == "d":
        assert len(resolved & calls) == 1
        assert len(resolved - calls) == 1
    else:
        assert resolved == calls
    if executed:
        assert all(n.state == "finished" for n in facts.nested_executions)
        assert all(n.root_ref in {t.call_ref for t in tools} for n in facts.nested_executions if n.root_ref)
    if case == "b":
        assert facts.nested_executions[0].root_ref == facts.nested_executions[1].root_ref
    if case == "c":
        assert facts.nested_executions[-1].root_ref is None
        assert facts.reasons.count("nested_parent_unresolved") == 2  # start 和 end 均无法解析。
    if case in ("e", "f"):
        first, second = facts.nested_executions
        assert first.root_ref != second.root_ref
        assert first.call_ref != second.call_ref
        assert first.call_ref == tools[0].nested.calls[0].call_ref
        assert second.call_ref == tools[1].nested.calls[0].call_ref
    if case == "F2":
        assert len(resolved) == len(calls) == 2
        assert tools[0].nested.complete is False
        assert [c.status for c in tools[0].nested.calls] == ["ok", "unfinished"]
    assert "parentToolCallId" not in repr(facts)
    assert "call_0" not in repr(facts) and "call_1" not in repr(facts)


def report_sources(tmp_path, sources, **metadata):
    manifest = budget.load_manifest(fx.write_manifest(tmp_path / "report-manifest.json", sources, **metadata))
    facts = [budget.read_source(s, budget.ReadContext(manifest.confirmed_zero)) for s in manifest.sources]
    return budget.build_report(manifest, facts, None)


def report_fixture(tmp_path, rows, *, kind="pi-session-v3", **metadata):
    path = fx.write_jsonl(tmp_path / "report-source.jsonl", rows)
    return report_sources(tmp_path, [fx.source(path, kind=kind)], **metadata)


def test_exclusive_dimensions_total_170(tmp_path):
    report = report_fixture(tmp_path, fx.f1_rows())
    tokens = report["tokens"]
    assert report["schema"] == "dhb-report/1"
    assert report["semantics"]["version"] == "dhb-metrics/1"
    assert tokens["known_subtotal"] == tokens["complete_total"]["value"] == 170
    assert tokens["complete_total"]["status"] == "known"
    assert tokens["status"] == "complete"
    assert tokens["reasons"] == []
    assert tokens["record_count"] == tokens["known_records"] == 1
    assert tokens["unknown_records"] == 0
    assert tokens["dimensions"]["input"]["known_subtotal"] == 100
    assert tokens["dimensions"]["output"]["known_subtotal"] == 20
    assert tokens["dimensions"]["cache_read"]["known_subtotal"] == 40
    assert tokens["dimensions"]["cache_write"]["known_subtotal"] == 10
    assert tokens["subsets"]["reasoning"]["known_subtotal"] == 5
    assert tokens["categories"]["main"]["known_subtotal"] == 170
    assert report["acquisition"]["status"] == "ok"


@pytest.mark.parametrize("case", ["complete", "unknown", "operation"])
def test_source_reported_input_peak_150(tmp_path, case):
    rows = fx.f1_rows()
    if case == "unknown":
        rows += [fx.entry("a2", message=fx.assistant(tokens=fx.usage(0, 1, 1, 1)))]
    elif case == "operation":
        rows += [fx.entry("c1", "compaction", usage=fx.usage(500, 20, 40, 10))]
    peak = report_fixture(tmp_path, rows)["tokens"]["peak"]
    assert peak["value"] == 150
    assert peak["label"] == "主 assistant 尝试内的来源上报输入峰值"
    assert "操作记录输入不参与" in peak["note"] and "非单请求值" in peak["note"]
    assert "计费" not in repr(peak)
    assert peak["participating_records"] == 1
    assert peak["attempt_records"] == (2 if case == "unknown" else 1)
    assert peak["lower_bound"] is (case == "unknown")


@pytest.mark.parametrize("case", ["placeholder", "confirmed", "known50", "invalid", "unreconciled", "disjoint"])
def test_confirmed_zero_vs_placeholder(tmp_path, case):
    metadata = {}
    rows = [fx.header(), fx.entry("a1", message=fx.assistant(tokens=fx.usage(40, 8, 2, 0)))]
    if case in ("confirmed", "known50", "disjoint"):
        metadata["confirmed_zero"] = [{"provider": "openai", "model": "*", "fields": ["cacheWrite"], "basis": "synthetic-zero"}]
    if case == "known50":
        rows += [fx.entry("a2", message=fx.assistant(tokens={}))]
    elif case == "invalid":
        rows[1]["message"]["usage"]["cacheWrite"] = -1
    elif case == "unreconciled":
        rows[1]["message"]["usage"] = fx.usage(totalTokens=175)
    if case == "disjoint":
        paths = [fx.write_jsonl(tmp_path / "A.jsonl", rows),
                 fx.write_jsonl(tmp_path / "B.jsonl", [fx.header("B"), fx.entry("b1", message=fx.assistant())])]
        report = report_sources(tmp_path, [fx.source(paths[0], "A"), fx.source(paths[1], "B")],
                                links=[{"type": "disjoint", "sources": ["A", "B"], "basis": "synthetic-disjoint"}], **metadata)
        assert report["tokens"]["complete_total"]["value"] == 220
        assert report["relations"][0]["origin"] == "annotation"
        return
    tokens = report_fixture(tmp_path, rows, **metadata)["tokens"]
    if case == "confirmed":
        assert tokens["complete_total"]["value"] == 50
        assert tokens["dimensions"]["cache_write"]["known_subtotal"] == 0
        assert tokens["dimensions"]["cache_write"]["annotation_records"] == 1
    else:
        assert tokens["complete_total"]["status"] == "unknown"
        assert tokens["complete_total"]["value"] is None
    if case == "known50":
        assert tokens["known_subtotal"] == 50
        assert tokens["unknown_records"] == 1
    elif case == "placeholder":
        assert tokens["dimensions"]["cache_write"]["unknown_records"] == 1
        assert tokens["dimensions"]["cache_write"]["known_subtotal"] is None
    elif case == "invalid":
        assert tokens["dimensions"]["cache_write"]["invalid_records"] == 1
    elif case == "unreconciled":
        assert tokens["known_subtotal"] is None
        assert "total_tokens_mismatch" in tokens["reasons"]


@pytest.mark.parametrize("case", ["double_capture", "undeclared", "F1"])
def test_unconfirmed_partition_denominators_unknown(tmp_path, capsys, case):
    metadata = {}
    if case == "double_capture":
        sources = fx.f5_sources(tmp_path, case)
    elif case == "undeclared":
        sources, metadata = fx.f8_sources(tmp_path, case)
    else:
        sources = [fx.source(fx.write_jsonl(tmp_path / "source.jsonl", fx.f1_rows()))]
    manifest = fx.write_manifest(tmp_path / "manifest.json", sources, **metadata)
    out = tmp_path / "out"
    out.mkdir()
    assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == 0
    stdout, stderr = capsys.readouterr()
    assert "sources=ok" in stdout and stderr == ""
    report = read_report(out)
    summary = (out / "summary.md").read_text(encoding="utf-8")
    token_count = 2 if case == "double_capture" else 1 if case == "undeclared" else 0
    tool_count = 2 if case == "double_capture" else 0
    for name, count in (("tokens", token_count), ("tool_calls", tool_count)):
        metric = report["observation"]["metrics"][name]
        assert metric["missing_sources"] == {"count": 0, "unit": "来源"}
        assert metric["unconfirmed_sources"] == {"count": count, "unit": "来源"}
        if count:
            assert metric["denominator"] is metric["missing"] is metric["coverage_percent"] is None
        else:
            assert metric["denominator"] == (0 if name == "tool_calls" and case == "F1" else 1)
    for name, group in report["groups"].items():
        assert group["denominator"] == (1 if case == "F1" else None)
        assert group["unconfirmed_sources"] == {"count": token_count, "unit": "来源"}
        assert group["conserved"] is True
        section = summary.split(f"### {name}\n", 1)[1].split("\n#", 1)[0]
        assert ("分母 未知" in section) is (case != "F1")
        if case != "F1":
            assert all(line.endswith("| 未知 | 未知 |") for line in section.splitlines()[3:] if line.startswith("| "))
    if case == "double_capture":
        assert "no_confirmed_records" in report["tokens"]["reasons"]
        assert "no_usage_records_observed" not in json.dumps(report)
        token_line = next(line for line in summary.splitlines() if line.startswith("| tokens |"))
        assert "| 未知 | 0 | 未知 | 未知 |" in token_line
        assert "分母 0" not in summary
        assert "未完全去重；未知用量归属记录数 未知；" in summary
    if case != "F1":
        assert f"tokens：未确认去重来源 {token_count} 来源；tool_calls：{tool_count} 来源；不与记录计数相加。" in summary
        section = summary.split("### token\n", 1)[1].split("\n###", 1)[0]
        assert "未知用量归属记录数 未知" in section
        dimension_rows = [line for line in section.splitlines() if line.startswith("| ")][1:]
        assert len(dimension_rows) == 6
        assert all(line.endswith("| 未知 | 0 |") for line in dimension_rows)
    else:
        assert "未确认去重来源" not in summary
        assert "已确认去重；未知 0 条用量归属记录；原因：无。" in summary


def test_nested_executed_reason_uses_selection(tmp_path, capsys):
    sources = fx.f5_sources(tmp_path, "double_capture")
    manifest = fx.write_manifest(tmp_path / "manifest.json", sources)
    out = tmp_path / "out"
    out.mkdir()
    assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == 0
    stdout, stderr = capsys.readouterr()
    assert "sources=ok" in stdout and stderr == ""
    report = read_report(out)
    assert [s["status"] for s in report["sources"]] == ["loaded", "loaded"]
    executed = report["tool_calls"]["nested_executed"]
    assert executed["observed_total"] is None
    assert executed["reasons"] == ["overlap_unconfirmed"]
    assert "nested_events_not_persisted" not in json.dumps(report["tool_calls"])
    source_executed = report["sources"][1]["tool_calls"]["nested_executed"]
    assert source_executed["observed_total"] == 0
    assert source_executed["reasons"] == []
    assert report["observation"]["metrics"]["tokens"]["unconfirmed_sources"]["count"] == 2


@pytest.mark.parametrize("case", ["duplicate_replaced", "nested_covered", "replaced_lineage_partial"])
def test_unconfirmed_sources_exclude_replaced_and_covered(tmp_path, capsys, case):
    if case == "replaced_lineage_partial":
        copied = fx.entry("p1", message=fx.assistant())
        parent = fx.write_jsonl(tmp_path / "parent.jsonl", [fx.header("parent"), copied])
        with parent.open("ab") as stream:
            stream.write(b"bad-json\n")
        original = fx.write_jsonl(tmp_path / "original.jsonl", [
            fx.header("child", parentSession=str(parent)), copied,
            fx.entry("x1", parent="p1", message=fx.assistant(tokens=fx.usage(4, 3, 2, 1))),
        ])
        duplicate = tmp_path / "duplicate.jsonl"
        duplicate.write_bytes(original.read_bytes())
        sources = [fx.source(parent, "P"), fx.source(original, "X"),
                   fx.source(duplicate, "S", duplicate_of={"source": "X", "basis": "synthetic-containment"})]
        manifest = fx.write_manifest(tmp_path / "manifest.json", sources)
        out = tmp_path / "out"
        out.mkdir()
        assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == 3
        stdout, stderr = capsys.readouterr()
        assert "sources=gaps" in stdout and stderr == ""
        report = read_report(out)
        assert report["relations"][0]["effective"] is True
        assert [s["status"] for s in report["sources"]] == ["partial", "loaded", "loaded"]
        assert report["sources"][2]["replaced_by"] == "X"
        for source in report["sources"]:
            assert source["unconfirmed_reasons"] == ["lineage_parent_unavailable"]
        assert [s["tokens"]["known_subtotal"] for s in report["sources"]] == [170, 180, 180]
        assert report["tokens"]["known_subtotal"] is None
        assert report["tokens"]["complete_total"]["value"] is None
        metrics = report["observation"]["metrics"]
        for name in ("tokens", "tool_calls"):
            assert metrics[name]["unconfirmed_sources"] == {"count": 2, "unit": "来源"}
        assert metrics["tool_calls"]["denominator"] is None
        for dimension in ("phase", "role", "model", "channel"):
            assert report["groups"][dimension]["unconfirmed_sources"] == {"count": 2, "unit": "来源"}
        summary = (out / "summary.md").read_text(encoding="utf-8")
        assert "tokens：未确认去重来源 2 来源；tool_calls：2 来源；" in summary
        return
    metadata = {}
    if case == "duplicate_replaced":
        rows = fx.f1_rows()
        rows.append(fx.entry("t1", parent="a1", message={"role": "toolResult", "toolCallId": "call_0",
                                                          "usage": fx.usage(20, 10, 5, 5)}))
        original = fx.write_jsonl(tmp_path / "original.jsonl", rows)
        duplicate = tmp_path / "duplicate.jsonl"
        duplicate.write_bytes(original.read_bytes())
        other_rows = fx.f1_rows()
        other_rows[0]["id"] = "other-session"
        other = fx.write_jsonl(tmp_path / "other.jsonl", other_rows)
        sources = [fx.source(original, "X"),
                   fx.source(duplicate, "S", duplicate_of={"source": "X", "basis": "synthetic-containment"}),
                   fx.source(other, "O")]
    else:
        sources, metadata = fx.f8_sources(tmp_path, "equal")
    manifest = fx.write_manifest(tmp_path / "manifest.json", sources, **metadata)
    out = tmp_path / "out"
    out.mkdir()
    assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == 0
    stdout, stderr = capsys.readouterr()
    assert "sources=ok" in stdout and stderr == ""
    report = read_report(out)
    assert report["relations"][0]["effective"] is True
    assert report["sources"][1]["unconfirmed_record_count"] == 0
    count = 1 if case == "duplicate_replaced" else 0
    metrics = report["observation"]["metrics"]
    assert metrics["tokens"]["unconfirmed_sources"] == {"count": count, "unit": "来源"}
    assert metrics["tool_calls"]["unconfirmed_sources"] == {"count": 0, "unit": "来源"}
    for dimension in ("phase", "role", "model", "channel"):
        assert report["groups"][dimension]["unconfirmed_sources"] == {"count": count, "unit": "来源"}
    if case == "duplicate_replaced":
        assert report["sources"][1]["replaced_by"] == "X"
        assert report["sources"][0]["unconfirmed_record_count"] == 1
        assert report["tokens"]["known_subtotal"] == 340
        assert report["tokens"]["complete_total"]["value"] is None
        assert "nested_coverage_unverifiable" in report["tokens"]["reasons"]
        summary = (out / "summary.md").read_text(encoding="utf-8")
        assert "tokens：未确认去重来源 1 来源；tool_calls：0 来源；" in summary
    else:
        assert report["sources"][1]["token_covered_by"] == "P"
        assert report["tokens"]["complete_total"]["value"] == 210


def test_header_only_not_zero(tmp_path):
    report = report_fixture(tmp_path, [fx.header()])
    assert report["sources"][0]["status"] == "empty"
    assert report["sources"][0]["raw_record_count"] == 0
    assert report["population"]["empty"] == ["S1"]
    assert report["acquisition"]["status"] == "gaps"
    assert report["tokens"]["status"] == "unavailable"
    assert report["tokens"]["complete_total"]["value"] is None
    assert report["tokens"]["known_subtotal"] is None
    assert "no_usage_records_observed" in report["tokens"]["reasons"]


@pytest.mark.parametrize("case,reason", [("missing", "source_missing"), ("bad_json", "bad_json"),
                                        ("header", "no_usage_records_observed"), ("v2", "unsupported_version")])
def test_selected_source_gap_blocks_full_total(tmp_path, case, reason):
    rows = fx.f1_rows()
    rows[0]["id"] = "another-session"
    good = fx.write_jsonl(tmp_path / "good.jsonl", rows)
    gap = fx.f6_file(tmp_path / "gap.jsonl", case)
    # 不同会话，不引入双采集；partial 文件中有效记录也照计。
    sources = [fx.source(good, "S1"), fx.source(gap, "S2")]
    report = report_sources(tmp_path, sources)
    assert report["sources"][0]["tokens"]["known_subtotal"] == 170
    assert report["tokens"]["known_subtotal"] == (340 if case == "bad_json" else 170)
    assert report["tokens"]["complete_total"]["value"] is None
    assert reason in report["tokens"]["reasons"]
    assert report["acquisition"]["status"] == "gaps"


@pytest.mark.parametrize("nonmonotonic", [False, True])
def test_nonfinal_partial_lower_bound_10(tmp_path, nonmonotonic):
    tokens = report_fixture(tmp_path, fx.f3_stream_rows(nonmonotonic), kind="pi-json-events")["tokens"]
    assert tokens["complete_total"]["status"] == "unknown"
    assert tokens["known_subtotal"] is None
    assert tokens["dimensions"]["output"]["partial_lower_bound"] == (None if nonmonotonic else 10)
    assert tokens["dimensions"]["output"]["partial_records"] == (0 if nonmonotonic else 1)
    assert "stream_not_settled" in tokens["reasons"]
    if nonmonotonic:
        assert "nonmonotonic" in tokens["reasons"]


@pytest.mark.parametrize("case", ["a", "b", "c", "d"])
def test_entry_appended_usage_records_counted(tmp_path, case):
    report = report_fixture(tmp_path, fx.f13_rows(case), kind="pi-json-events")
    tokens = report["tokens"]
    assert report["sources"][0]["status"] == "loaded"
    assert tokens["peak"]["value"] == 150
    assert tokens["peak"]["attempt_records"] == 1
    if case == "a":
        assert tokens["complete_total"]["value"] == 210
        assert tokens["status"] == "complete"
        assert tokens["categories"]["usage_entry"]["by_kind"]["cache_warm"] == {"record_count": 1, "known_subtotal": 40}
        assert tokens["categories"]["usage_entry"]["request_count"]["status"] == "unknown"
    elif case == "b":
        assert tokens["categories"]["compaction"]["record_count"] == 2
        assert tokens["complete_total"]["value"] == 212
        assert report["sources"][0]["reasons"].count("duplicate_entry_id") == 1
    elif case == "c":
        assert tokens["known_subtotal"] == 170
        assert tokens["complete_total"]["value"] is None
        assert tokens["status"] == "partial"
        assert tokens["categories"]["entry_unrecognized"] == {"record_count": 1}
        assert "entry_appended_usage_unrecognized" in tokens["reasons"]
        assert "987654" not in repr(report)
    else:
        assert tokens["complete_total"]["value"] == 240
        assert tokens["record_count"] == 3


@pytest.mark.parametrize("case", ["lineage", "parent_not_selected", "normalized_path"])
def test_lineage_dedup_confirmed(tmp_path, case):
    sources = fx.f5_sources(tmp_path, "lineage" if case == "normalized_path" else case)
    if case == "normalized_path":
        # 只改变清单路径拼写；不扫描或打开 parentSession。
        sources[0]["path"] = str(tmp_path / "unused" / ".." / "parent.jsonl")
    with fx.audit_events() as events:
        report = report_sources(tmp_path, sources)
    child = report["sources"][-1]
    if case == "parent_not_selected":
        assert child["tokens"]["known_subtotal"] == 180
        assert child["copied_record_count"] is None
        assert child["net_new_record_count"] is None
        assert child["lineage"]["net_new_determined"] is False
        summary = budget.render_summary(report)
        assert "复制件 未知 条；净新增记录 未知 条" in summary
        assert "复制件 0 条" not in summary
        assert "parent_not_selected" in report["tokens"]["reasons"]
        assert report["tokens"]["complete_total"]["value"] is None
        assert all("not-selected" not in str(args[0]) for event, args in events if event == "open")
    else:
        assert report["tokens"]["complete_total"]["value"] == 180
        assert child["raw_record_count"] == 2
        assert child["copied_record_count"] == child["net_new_record_count"] == 1
        assert child["tokens"]["known_subtotal"] == 10
        assert child["lineage"]["parent"] == "P"
        assert child["lineage"]["net_new_determined"] is True


@pytest.mark.parametrize("case,reason", [("double_capture", "same_session_unconfirmed"), ("lineage_conflict", "lineage_usage_conflict")])
def test_ambiguous_overlap_not_deduplicated(tmp_path, case, reason):
    report = report_sources(tmp_path, fx.f5_sources(tmp_path, case))
    assert report["tokens"]["complete_total"]["value"] is None
    assert report["tokens"]["known_subtotal"] is None
    assert report["tokens"]["status"] == "partial"
    assert report["tokens"]["deduplication_label"] == "未完全去重"
    assert reason in report["tokens"]["reasons"]
    assert report["sources"][0]["tokens"]["known_subtotal"] == 170
    assert report["sources"][1]["tokens"]["known_subtotal"] == (181 if case == "lineage_conflict" else 170)
    child = report["sources"][1]
    if case == "lineage_conflict":
        assert child["copied_record_count"] is None
        assert child["net_new_record_count"] is None
        assert child["lineage"]["net_new_determined"] is False
        section = budget.render_summary(report).split("- C：", 2)[-1].split("- 关系", 1)[0]
        assert "复制件 未知 条；净新增记录 未知 条" in section
        assert "复制件 0 条" not in section
    else:
        assert child["copied_record_count"] == 0


@pytest.mark.parametrize("case", ["lineage_missing", "lineage_empty", "lineage_partial", "lineage_chain"])
def test_lineage_parent_unavailable_not_determined(tmp_path, capsys, case):
    sources = fx.f5_sources(tmp_path, case)
    manifest = fx.write_manifest(tmp_path / "manifest.json", sources)
    out = tmp_path / "out"
    out.mkdir()
    assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == (0 if case == "lineage_chain" else 3)
    assert capsys.readouterr().err == ""
    report = read_report(out)
    child = report["sources"][1]
    assert child["tokens"]["known_subtotal"] == 180
    assert child["lineage"]["net_new_determined"] is False
    assert child["lineage"]["copied_entry_count"] is None
    assert child["copied_record_count"] is child["net_new_record_count"] is None
    assert report["tokens"]["complete_total"]["value"] is None
    summary = (out / "summary.md").read_text(encoding="utf-8")
    assert "复制件由血缘父计" not in summary
    section = summary.split("- C：", 2)[-1].split("- D：", 1)[0].split("- 关系", 1)[0]
    assert "复制件 未知 条；净新增记录 未知 条" in section
    assert "复制件 0 条" not in section
    if case == "lineage_chain":
        assert "relation_shape_unsupported" in report["tokens"]["reasons"]
        assert report["tokens"]["known_subtotal"] is None
    else:
        assert child["lineage"]["reason"] == "lineage_parent_unavailable"
        assert child["lineage"]["note"] == "血缘父未完整加载，无法区分复制件。"
        assert "lineage_parent_unavailable" in report["tokens"]["reasons"]
        if case == "lineage_partial":
            assert report["sources"][0]["tokens"]["known_subtotal"] == 170
            assert report["tokens"]["known_subtotal"] is None
            assert report["tokens"]["deduplication_label"] == "未完全去重"
            assert all("lineage_parent_unavailable" in s["unconfirmed_reasons"] for s in report["sources"])
        else:
            assert report["tokens"]["known_subtotal"] == 180
            assert report["tokens"]["deduplication_label"] == "已确认去重"


@pytest.mark.parametrize("case", ["duplicate_contained", "duplicate_not_contained", "duplicate_missing", "duplicate_partial",
                                 "duplicate_empty", "duplicate_source_missing", "duplicate_star", "unverified"])
def test_duplicate_of_containment_and_unavailable_target(tmp_path, case):
    fixture_case = "double_capture" if case == "unverified" else "duplicate_missing" if case == "duplicate_source_missing" else case
    sources = fx.f5_sources(tmp_path, fixture_case)
    if case == "unverified":
        sources[1]["duplicate_of"] = {"source": "P", "basis": "synthetic-containment"}
    elif case == "duplicate_source_missing":
        sources[1].pop("duplicate_of")
        sources[0]["duplicate_of"] = {"source": "C", "basis": "synthetic-containment"}
    elif case == "duplicate_star":
        other = fx.write_jsonl(tmp_path / "other.jsonl", [fx.header("other"), fx.entry("a1", message=fx.assistant())])
        sources.append(fx.source(other, "D", duplicate_of={"source": "P", "basis": "synthetic-containment"}))
    report = report_sources(tmp_path, sources)
    relation = report["relations"][0]
    assert relation["origin"] == "annotation"
    assert relation["basis"] == "synthetic-containment"
    assert "正确性由断言者负责" in relation["note"] and "尾部记录会被丢弃" in relation["note"]
    assert relation["verification"] == ("unverified" if case == "unverified" else "v3_keyset")
    assert report["sources"][1]["tokens"]["known_subtotal"] == (180 if case == "duplicate_not_contained" else 170)
    if case in ("duplicate_contained", "duplicate_star", "unverified"):
        assert all(r["effective"] for r in report["relations"])
        assert relation["effective"] is True
        assert report["sources"][1]["replaced_by"] == "P"
        assert report["tokens"]["complete_total"]["value"] == 170
    else:
        assert relation["effective"] is False
        assert report["sources"][1]["replaced_by"] is None
        assert report["tokens"]["complete_total"]["value"] is None
        assert report["tokens"]["known_subtotal"] is None
        assert relation["reasons"] == (["duplicate_not_contained"] if case == "duplicate_not_contained" else ["duplicate_target_unavailable"])


@pytest.mark.parametrize("case", ["duplicate_chain", "nested_chain", "mixed_component"])
def test_relation_shapes_unsupported_retain_facts(tmp_path, case):
    sources = fx.f11_sources(case)
    for s in sources:
        path = fx.write_jsonl(tmp_path / (s["source_id"] + ".jsonl"), [fx.header(s["source_id"]), fx.entry("a1", message=fx.assistant())])
        s["path"] = str(path)
    # 独立分量不受链式分量影响。
    extra = fx.write_jsonl(tmp_path / "D.jsonl", [fx.header("D"), fx.entry("d1", message=fx.assistant(tokens=fx.usage(4, 3, 2, 1)))])
    sources.append(fx.source(extra, "D"))
    report = report_sources(tmp_path, sources, all_nested_children_declared=True)
    assert [s["tokens"]["known_subtotal"] for s in report["sources"]] == [170, 170, 170, 10]
    assert [s["replaced_by"] for s in report["sources"]] == [None, None, None, None]
    assert report["tokens"]["known_subtotal"] == 10
    assert report["tokens"]["complete_total"]["value"] is None
    assert "relation_shape_unsupported" in report["tokens"]["reasons"]
    assert all(r["reasons"] == ["relation_shape_unsupported"] for r in report["relations"])


@pytest.mark.parametrize("case,reason", [
    ("equal", None), ("single", None), ("unreferenced", None),
    ("absent", "nested_coverage_absent"), ("missing_id", "nested_link_mismatch"),
    ("reused", "nested_link_mismatch"), ("partial", "nested_coverage_partial"),
    ("mismatch", "nested_sum_mismatch"), ("parent_unknown", "nested_coverage_partial"),
    ("child_partial", "nested_coverage_unverifiable"), ("child_missing", "nested_coverage_unverifiable"),
    ("undeclared", "nested_coverage_unverifiable"), ("flag_false", "nested_coverage_unverifiable"),
])
def test_nested_link_negative_cases(tmp_path, case, reason):
    sources, metadata = fx.f8_sources(tmp_path, case)
    if case == "single":
        sources = sources[:1]
        metadata = {}
    elif case == "unreferenced":
        sources[1].pop("nested_of")
    report = report_sources(tmp_path, sources, **metadata)
    if reason is None:
        assert report["tokens"]["complete_total"]["value"] == (250 if case == "unreferenced" else 210)
        assert report["tokens"]["categories"]["tool_nested"]["known_subtotal"] == 40
        if case == "equal":
            assert report["relations"][0]["effective"] is True
            assert report["sources"][1]["token_covered_by"] == "P"
            assert report["sources"][1]["tokens"]["known_subtotal"] == 40
    else:
        assert report["tokens"]["complete_total"]["value"] is None
        assert reason in report["tokens"]["reasons"]
        assert report["tokens"]["deduplication"] == "unconfirmed"
        assert report["sources"][1]["token_covered_by"] is None
        if case not in ("child_partial", "child_missing"):
            assert report["sources"][1]["tokens"]["known_subtotal"] == (41 if case == "mismatch" else 40)
        if case == "undeclared":
            assert report["sources"][0]["unconfirmed_record_count"] == 1
            assert report["sources"][0]["tokens"]["known_subtotal"] == 210
            assert report["tokens"]["known_subtotal"] == 210  # 父主调用 170 + 子 40；父工具 40 未纳入。
            assert "tool_nested" not in report["tokens"]["categories"]
        else:
            assert report["tokens"]["known_subtotal"] is None
            assert report["relations"][0]["reasons"] == [reason]


@pytest.mark.parametrize("case,reason", [("two_equal", None), ("two_mismatch", "nested_sum_mismatch"), ("two_unknown", "nested_coverage_unverifiable")])
def test_nested_multi_children_per_dimension(tmp_path, case, reason):
    sources, metadata = fx.f8_sources(tmp_path, case)
    report = report_sources(tmp_path, sources, **metadata)
    assert report["sources"][1]["tokens"]["known_subtotal"] == 23
    assert report["sources"][2]["tokens"]["known_subtotal"] == (None if case == "two_unknown" else 17)
    if reason is None:
        assert report["tokens"]["complete_total"]["value"] == 210
        assert [s["token_covered_by"] for s in report["sources"]] == [None, "P", "P"]
        assert all(r["effective"] for r in report["relations"])
    else:
        assert report["tokens"]["complete_total"]["value"] is None
        assert report["tokens"]["known_subtotal"] is None
        assert all(r["reasons"] == [reason] for r in report["relations"])


@pytest.mark.parametrize("case,reason", [("lineage_equal", None), ("lineage_unknown_history", None), ("lineage_mismatch", "nested_sum_mismatch"),
                                        ("parent_not_selected", "nested_coverage_unverifiable"), ("lineage_conflict", "nested_coverage_unverifiable")])
def test_lineage_net_new_before_nested_coverage(tmp_path, case, reason):
    sources, metadata = fx.f8_sources(tmp_path, case)
    report = report_sources(tmp_path, sources, **metadata)
    child = report["sources"][1]
    if case in ("lineage_equal", "lineage_unknown_history", "lineage_mismatch"):
        assert child["raw_record_count"] == 2
        assert child["copied_record_count"] == child["net_new_record_count"] == 1
        assert child["tokens"]["known_subtotal"] == (41 if case == "lineage_mismatch" else 40)
    if reason is None:
        assert report["tokens"]["complete_total"]["value"] == (None if case == "lineage_unknown_history" else 210)
        if case == "lineage_unknown_history":
            assert report["tokens"]["known_subtotal"] == 40  # 历史未知不阻止净新增覆盖，但仍阻止批次完整总计。
        assert child["token_covered_by"] == "P"
        assert report["relations"][0]["effective"] is True
    else:
        assert report["tokens"]["complete_total"]["value"] is None
        assert report["tokens"]["known_subtotal"] is None
        assert report["relations"][0]["reasons"] == [reason]
        assert child["token_covered_by"] is None


@pytest.mark.parametrize("case,attempts,direct", [("retry", 2, 1), ("nested", 2, 3), ("lineage", 2, 1),
                                                 ("duplicate", 1, 1), ("uncertain", None, None),
                                                 ("nested_unconfirmed", None, None), ("undeclared_usage", 2, 1), ("unsupported_shape", 1, 1)])
def test_tool_calls_separate_from_attempts(tmp_path, case, attempts, direct):
    if case == "retry":
        report = report_fixture(tmp_path, fx.f2_rows(), kind="pi-json-events")
    elif case == "nested":
        report = report_sources(tmp_path, fx.f12_nested_sources(tmp_path), all_nested_children_declared=True)
        assert report["tokens"]["complete_total"]["value"] == 210
        assert report["sources"][1]["attempts"]["main_assistant"]["observed_total"] == 1
    elif case in ("nested_unconfirmed", "undeclared_usage"):
        sources, metadata = fx.f8_sources(tmp_path, "mismatch" if case == "nested_unconfirmed" else "undeclared")
        report = report_sources(tmp_path, sources, **metadata)
        assert report["sources"][0]["attempts"]["main_assistant"]["observed_total"] == 1
        assert report["sources"][1]["attempts"]["main_assistant"]["observed_total"] == 1
        assert report["sources"][0]["tool_calls"]["direct"]["observed_total"] == 1
    elif case == "unsupported_shape":
        sources = fx.f11_sources("mixed_component") + [fx.source(tmp_path / "D.jsonl", "D")]
        for source in sources:
            path = fx.write_jsonl(tmp_path / (source["source_id"] + ".jsonl"), [fx.header(source["source_id"]),
                fx.entry("a", message=fx.assistant("toolUse", calls=("call_0",))),
                fx.entry("t", parent="a", message={"role": "toolResult", "toolCallId": "call_0"})])
            source["path"] = str(path)
        report = report_sources(tmp_path, sources)
        assert report["tokens"]["known_subtotal"] == 170
        assert report["tool_calls"]["all_total"]["value"] is None
        assert [s["tool_calls"]["direct"]["observed_total"] for s in report["sources"]] == [1, 1, 1, 1]
    else:
        parent = [fx.header("P"), fx.entry("a", message=fx.assistant("toolUse", calls=("call_0",))),
                  fx.entry("t", parent="a", message={"role": "toolResult", "toolCallId": "call_0"})]
        path = fx.write_jsonl(tmp_path / "P.jsonl", parent)
        child = [fx.header("C", **({"parentSession": str(path)} if case == "lineage" else {})), *parent[1:]]
        if case == "lineage":
            child.append(fx.entry("c", parent="t", message=fx.assistant()))
        if case == "uncertain":
            child[0]["id"] = "P"
        cpath = fx.write_jsonl(tmp_path / "C.jsonl", child)
        annotations = {"duplicate_of": {"source": "P", "basis": "synthetic"}} if case == "duplicate" else {}
        report = report_sources(tmp_path, [fx.source(path, "P"), fx.source(cpath, "C", **annotations)])
        assert report["sources"][0]["tool_calls"]["direct"]["observed_total"] == 1
        if case == "lineage":
            assert report["sources"][1]["tool_calls"]["direct"]["observed_total"] == 0
    assert report["attempts"]["main_assistant"]["observed_total"] == attempts
    assert report["tool_calls"]["direct"]["observed_total"] == direct
    if case in ("uncertain", "nested_unconfirmed"):
        assert report["attempts"]["main_assistant"]["status"] == "partial"
        assert report["tool_calls"]["status"] == "partial"
        assert report["tool_calls"]["all_total"]["value"] is None


@pytest.mark.parametrize("case,direct,proposed,status", [
    ("two_owners", 2, 0, "complete"), ("reused", 2, 0, "partial"),
    ("unfinished", 1, 0, "partial"), ("proposed", 0, 1, "partial"),
    ("orphan_tool", 1, 0, "partial"), ("nested", 3, 0, "complete"), ("nested_partial", 1, 0, "partial"),
    ("session_reused", 2, 0, "partial"), ("nested_identity", 2, 0, "complete")])
def test_tool_identity_and_views(tmp_path, case, direct, proposed, status):
    if case == "nested":
        report = report_sources(tmp_path, fx.f12_nested_sources(tmp_path), all_nested_children_declared=True)
    elif case in ("session_reused", "nested_identity"):
        rows = [fx.header(), fx.entry("a", message=fx.assistant("toolUse", calls=("call_0", "call_1")))]
        nested = {"calls": [{"id": "same", "status": "ok"}, {"id": "same", "status": "ok"}], "complete": True}
        rows += [fx.entry("t1", parent="a", message={"role": "toolResult", "toolCallId": "call_0", "nestedCalls": nested}),
                 fx.entry("t2", parent="t1", message={"role": "toolResult", "toolCallId": "call_0" if case == "session_reused" else "call_1", "nestedCalls": nested})]
        if case == "session_reused":
            rows[1]["message"] = fx.assistant("toolUse", calls=("call_0",))
        report = report_fixture(tmp_path, rows)
    else:
        report = report_fixture(tmp_path, fx.f2_rows() if case == "nested_partial" else fx.f12_events(case), kind="pi-json-events")
    tools = report["tool_calls"]
    assert tools["direct"]["observed_total"] == direct
    assert tools["proposed_only"] == proposed
    assert tools["status"] == status
    if case in ("reused", "session_reused"):
        assert "tool_call_id_reused_in_scope" in tools["reasons"]
    elif case == "orphan_tool":
        assert "tool_owner_unresolved" in tools["reasons"]
        assert tools["direct"]["terminal_only"] == 1
    elif case == "unfinished":
        assert tools["direct"]["unfinished"] == 1
    elif case == "two_owners":
        assert tools["reasons"] == []
        assert tools["direct"]["finished"] == 2
    if case in ("nested", "nested_partial", "nested_identity", "session_reused"):
        assert tools["nested_reported"]["observed_total"] == 2
        assert tools["all_total"]["value"] is None
        assert tools["all_total"]["reason"] == "nested_overlap_unresolved"
        assert tools["nested_reported"]["status"] == ("partial" if case == "nested_partial" else "complete")
    else:
        assert tools["all_total"]["value"] == direct
    assert tools["views_additive"] is False
    assert "call_0" not in repr(report) and "child-call-1" not in repr(report)


@pytest.mark.parametrize("case", ["session", "states", "inflight", "terminal_only", "operations", "a", "b", "c"])
def test_attempt_states_and_operation_records(tmp_path, case):
    if case == "session":
        report = report_fixture(tmp_path, fx.f1_rows())
    elif case in ("a", "b", "c"):
        report = report_fixture(tmp_path, fx.f13_rows(case), kind="pi-json-events")
    elif case == "operations":
        rows = fx.f1_rows() + [fx.entry("c", "compaction", usage=fx.usage()), fx.entry("b", "branch_summary", usage=fx.usage()),
                              fx.entry("u", "usage", kind="future-operation", provider="openai", model="synthetic", usage=fx.usage()),
                              fx.entry("no-usage", "compaction")]
        report = report_fixture(tmp_path, rows)
    else:
        report = report_fixture(tmp_path, fx.f12_events(case), kind="pi-json-events")
    main = report["attempts"]["main_assistant"]
    assert set(main["states"]) == {"completed", "failed", "aborted", "inflight", "terminal_only"}
    assert main["observed_total"] == (6 if case == "states" else 1)
    if case == "states":
        assert main["states"] == {"completed": 4, "failed": 1, "aborted": 1, "inflight": 0, "terminal_only": 0}
        assert main["run_total"]["value"] == 6
    elif case in ("inflight", "terminal_only"):
        assert main["states"][case] == 1
        assert main["run_total"]["value"] is None
    elif case in ("session", "operations"):
        assert main["run_total"]["value"] is None
        assert "pending_not_persisted" in main["reasons"]
    else:
        assert main["run_total"]["value"] == 1
    operations = report["attempts"]["model_operations"]
    for operation in operations.values():
        assert operation["request_count"]["status"] == "unknown"
        assert operation["request_count"]["value"] is None
    if case == "operations":
        assert operations["compaction"]["record_count"] == 2
        assert operations["compaction"]["with_usage"] == 1
        assert operations["branch_summary"]["record_count"] == 1
        assert operations["usage_entry"]["by_kind"] == {"future-operation": 1}
    elif case == "a":
        assert operations["usage_entry"]["by_kind"] == {"cache_warm": 1}
    elif case == "b":
        assert operations["compaction"]["record_count"] == 2


@pytest.mark.parametrize("case,attempts,confirmed,scheduled", [
    ("success", 2, 1, 0), ("chain", 3, 2, 0), ("cancelled", 1, 0, 1), ("after_end", 2, 0, 1),
    ("unmarked", 2, 0, 0), ("truncated", 1, 0, 1), ("aborted", 2, 1, 0), ("no_error", 2, 0, 0),
    ("summaries", 2, 1, 0), ("two_starts", 3, 1, 0), ("two_brackets", 1, 0, 2), ("session", 1, None, 0)])
def test_retry_requires_explicit_association(tmp_path, case, attempts, confirmed, scheduled):
    rows = fx.f4_rows() if case == "unmarked" else fx.f1_rows() if case == "session" else fx.f2_rows(case)
    if case == "truncated":
        rows = rows[:8]  # error 的完整尝试之后，只有排程。
    elif case == "aborted":
        for event in rows:
            if event["type"] == "message_end" and event["message"]["role"] == "assistant" and event["message"]["stopReason"] == "stop":
                event["message"]["stopReason"] = "aborted"
    elif case == "no_error":
        rows[4]["message"]["stopReason"] = "stop"
    elif case == "summaries":
        rows[-1:-1] = [{"type": "summarization_retry_scheduled"}, {"type": "summarization_retry_attempt_start"}, {"type": "summarization_retry_finished"}]
    elif case == "two_starts":
        rows.insert(10, {"type": "message_start", "message": fx.assistant("pending", fx.usage(0, 0, 0, 0))})
    elif case == "two_brackets":
        rows = rows[:8] + [{"type": "auto_retry_start", "attempt": 2}, {"type": "agent_settled", "aborted": True}]
    report = report_fixture(tmp_path, rows, kind="pi-session-v3" if case == "session" else "pi-json-events")
    retries = report["retries"]
    assert report["attempts"]["main_assistant"]["observed_total"] == attempts
    assert retries["confirmed"]["value"] == confirmed
    assert retries["scheduled_unobserved"] == scheduled
    assert retries["total"]["status"] == "unknown" and retries["total"]["value"] is None
    assert retries["status"] == ("unavailable" if case == "session" else "partial")
    assert retries["total"]["reason"] == ("retry_markers_not_persisted" if case == "session" else "retry_total_not_provable")
    assert report["observation"]["metrics"]["retries"]["status"] == retries["status"]
    assert report["observation"]["overall"] == "incomplete"
    assert retries["summarization_retry_markers"]["value"] == (None if case == "session" else 3 if case == "summaries" else 0)
    assert retries["confirmed_is_lower_bound"] is True


@pytest.mark.parametrize("case", ["absent", "zero", "two", "partial", "new_scope"])
def test_semantic_rework_annotation_only(tmp_path, case):
    path = fx.write_jsonl(tmp_path / "source.jsonl", fx.f2_rows())
    annotation = {"rework": {"count": 0 if case == "zero" else 2, "basis": "synthetic-rework"}} if case in ("zero", "two", "partial") else {}
    sources = [fx.source(path, kind="pi-json-events", **annotation)]
    if case in ("partial", "new_scope"):
        other = fx.write_jsonl(tmp_path / "other.jsonl", [fx.header("other"), fx.entry("a", message=fx.assistant(provider="other-channel"))])
        sources.append(fx.source(other, "S2", dimensions={"phase": "New scope", "channel": "other-channel"}))
    report = report_sources(tmp_path, sources)
    rework = report["retries"]["semantic_rework"]
    assert rework["known_subtotal"] == (0 if case == "zero" else 2 if case in ("two", "partial") else None)
    assert rework["status"] == ("complete" if case in ("zero", "two") else "partial" if case == "partial" else "unavailable")
    assert rework["total"]["value"] == (0 if case == "zero" else 2 if case == "two" else None)
    assert report["retries"]["confirmed"]["value"] == 1
    if annotation:
        assert rework["annotations"][0]["origin"] == "annotation"
        assert rework["annotations"][0]["basis"] == "synthetic-rework"


@pytest.mark.parametrize("case", ["session", "retry", "nested", "a", "b", "no_usage"])
def test_covered_and_unobserved_paths(tmp_path, case):
    if case == "session":
        rows = fx.f1_rows() + [fx.entry("b", "branch_summary", usage=fx.usage()),
                              fx.entry("u", "usage", kind="future-kind", usage=fx.usage())]
        report = report_fixture(tmp_path, rows)
    elif case == "nested":
        sources, metadata = fx.f8_sources(tmp_path, "equal")
        report = report_sources(tmp_path, sources, **metadata)
    else:
        rows = fx.f2_rows() if case in ("retry", "no_usage") else fx.f13_rows(case)
        if case == "no_usage":
            rows[-1:-1] = [{"type": "compaction_end", "aborted": True}]
        report = report_fixture(tmp_path, rows, kind="pi-json-events")
    paths = {p["path"] for p in report["unobserved_paths"]}
    assert "physical_http_sdk_provider_requests_and_retries" in paths
    assert "failed_or_aborted_cache_warm_requests" in paths
    assert "model_operation_request_counts" in paths
    assert "tool_model_work_without_usage" in paths
    assert "usage_entry" not in paths and "boundary_compaction" not in paths
    if case in ("session", "nested"):
        assert "inflight_attempts_not_persisted" in paths
        assert "retry_markers_not_persisted" in paths
        assert "tool_duration_not_persisted" in paths
    else:
        assert "branch_summary_not_emitted" in paths
    if case in ("retry", "no_usage"):
        assert "incomplete_nested_paths" in paths
    if case == "no_usage":
        assert "compaction_usage_missing" in paths
    for item in report["attempts"]["model_operations"].values():
        assert item["coverage"] == "covered"
        assert item["request_count"]["value"] is None
    if case == "a":
        assert report["attempts"]["model_operations"]["usage_entry"]["by_kind"] == {"cache_warm": 1}
    elif case == "b":
        assert report["attempts"]["model_operations"]["compaction"]["record_count"] == 2
    assert all(p["status"] == "unobserved" for p in report["unobserved_paths"])
    assert "选定记录小计 ≠ 整次会话或平台账单" in repr(report["unobserved_paths"])


@pytest.mark.parametrize("case", ["parallel", "offsets", "missing_end", "naive", "mixed_offsets", "negative", "until_after_end", "end_only", "no_times"])
def test_parallel_window_10_sum_20(tmp_path, case):
    paths = [fx.write_jsonl(tmp_path / "A.jsonl", [fx.header("A"), fx.entry("a", message=fx.assistant())]),
             fx.write_jsonl(tmp_path / "B.jsonl", [fx.header("B"), fx.entry("b", message=fx.assistant())])]
    second = fx.timing()
    if case == "offsets":
        second = fx.timing("2026-10-30T08:00:00+08:00", "2026-10-30T08:00:10+08:00")
    elif case == "missing_end":
        second = fx.timing(end=None)
    elif case == "naive":
        second = fx.timing("2026-10-30T00:00:00", "2026-10-30T00:00:10")
    elif case == "mixed_offsets":
        second = fx.timing(end="2026-10-30T00:00:10")
    elif case == "negative":
        second = fx.timing(end="2026-10-29T23:59:59Z")
    elif case == "until_after_end":
        second = fx.timing(observed_until="2026-10-30T00:00:11Z")
    elif case == "end_only":
        second = fx.timing(start=None)
    elif case == "no_times":
        second = fx.timing(start=None, end=None)
    report = report_sources(tmp_path, [fx.source(paths[0], "A", timing=fx.timing()), fx.source(paths[1], "B", timing=second)])
    timing = report["timing"]
    assert timing["window_label"] == "批次观测墙钟窗口"
    assert timing["sum_label"] == "会话耗时合计"
    if case in ("parallel", "offsets"):
        assert timing["batch_window_seconds"]["value"] == 10
        assert timing["session_duration_sum_seconds"]["value"] == 20
        assert timing["status"] == "complete"
    else:
        assert timing["batch_window_seconds"]["value"] is None
        assert timing["session_duration_sum_seconds"]["value"] is None
        assert timing["status"] == "partial"
    if case == "naive":
        assert timing["sources"][1]["duration_seconds"]["value"] == 10
        assert timing["sources"][1]["status"] == "complete"
        assert "timing_clocks_incomparable" in timing["reasons"]
    elif case == "mixed_offsets":
        assert "timing_offset_mismatch" in timing["sources"][1]["reasons"]
    elif case in ("negative", "until_after_end"):
        assert timing["sources"][1]["duration_seconds"]["value"] is None
        assert "timing_invalid_order" in timing["sources"][1]["reasons"]
    assert report["observation"]["metrics"]["timing"]["status"] == timing["status"]


@pytest.mark.parametrize("case", ["nested", "nested_unconfirmed", "duplicate_tokens_only", "double_capture", "duplicate_confirmed", "duplicate_conflict", "duplicate_missing_bound"])
def test_timing_independent_of_token_overlap(tmp_path, case):
    metadata = {}
    if case in ("nested", "nested_unconfirmed"):
        sources, metadata = fx.f8_sources(tmp_path, "equal" if case == "nested" else "mismatch")
        sources[0]["timing"] = fx.timing()
        sources[1]["timing"] = fx.timing(end="2026-10-30T00:00:05Z")
    else:
        sources = fx.f5_sources(tmp_path, "duplicate_contained" if case == "duplicate_tokens_only" else "double_capture")
        for source in sources:
            source["timing"] = fx.timing()
        if case == "duplicate_confirmed":
            sources[1]["duplicate_of"] = {"source": "P", "basis": "synthetic"}
        elif case == "duplicate_conflict":
            sources[1]["timing"] = fx.timing(end="2026-10-30T00:00:05Z")
        elif case == "duplicate_missing_bound":
            sources[1]["timing"] = fx.timing(end=None)
    report = report_sources(tmp_path, sources, **metadata)
    timing = report["timing"]
    if case in ("duplicate_conflict", "duplicate_missing_bound"):
        assert timing["batch_window_seconds"]["value"] is None
        assert timing["session_duration_sum_seconds"]["value"] is None
        assert "duplicate_timing_conflict" in timing["reasons"]
    else:
        assert timing["batch_window_seconds"]["value"] == 10
        assert timing["session_duration_sum_seconds"]["value"] == (15 if case in ("nested", "nested_unconfirmed") else 20 if case == "duplicate_tokens_only" else 10)
    if case in ("double_capture", "duplicate_confirmed"):
        assert timing["duplicate_captures_counted_once"] == ["C"]
    else:
        assert timing["duplicate_captures_counted_once"] == []
    if case in ("nested_unconfirmed", "double_capture"):
        assert report["tokens"]["complete_total"]["value"] is None
        assert timing["status"] == "complete"  # 时间不服从 token 未确认分区。
    elif case == "nested":
        assert report["tokens"]["complete_total"]["value"] == 210
        assert report["sources"][1]["token_covered_by"] == "P"
    elif case == "duplicate_tokens_only":
        assert report["sources"][1]["replaced_by"] == "P"
        assert report["sources"][1]["timing"]["duration_seconds"]["value"] == 10


@pytest.mark.parametrize("case", ["missing", "bad_json", "header", "v2"])
def test_timing_kept_for_unavailable_source(tmp_path, case):
    good = fx.write_jsonl(tmp_path / "good.jsonl", [fx.header("good"), fx.entry("a", message=fx.assistant())])
    gap = fx.f6_file(tmp_path / "gap.jsonl", case)
    report = report_sources(tmp_path, [fx.source(good, "A", timing=fx.timing()),
                                      fx.source(gap, "B", timing=fx.timing(end="2026-10-30T00:00:30Z", outcome="timeout"))])
    assert report["acquisition"]["status"] == "gaps"
    assert report["tokens"]["complete_total"]["value"] is None
    assert report["timing"]["status"] == "complete"
    assert report["timing"]["batch_window_seconds"]["value"] == 30
    assert report["timing"]["session_duration_sum_seconds"]["value"] == 40
    assert report["sources"][1]["outcome"]["value"] == "timeout"
    assert report["sources"][1]["timing"]["duration_seconds"]["value"] == 30
    assert report["observation"]["overall"] == "incomplete"


@pytest.mark.parametrize("case", ["timeout", "cancelled", "interrupted_only", "missing_end", "until", "naive_until", "bad_until", "mixed_until", "native_times", "completed_conflict", "failed_conflict", "failed_agrees", "outcome_only"])
def test_timeout_known_duration_usage_unknown(tmp_path, case):
    message = fx.assistant("aborted", fx.usage(0, 0, 0, 0), timestamp=1356998400000)
    rows = [fx.header(timestamp="2013-01-01T00:00:00Z"),
            {"type": "message_start", "message": fx.assistant("pending", fx.usage(0, 0, 0, 0))},
            {"type": "message_end", "message": message}, {"type": "agent_settled", "aborted": True}]
    annotation = fx.timing(end="2026-10-30T00:00:30Z", outcome="timeout")
    if case == "cancelled":
        annotation["outcome"] = "cancelled"
    elif case == "interrupted_only":
        annotation.pop("outcome")
    elif case in ("missing_end", "until", "naive_until", "bad_until", "mixed_until"):
        annotation.pop("end")
        if case != "missing_end":
            annotation["observed_until"] = "2026-10-30T00:00:12Z"
        if case == "bad_until":
            annotation["observed_until"] = "2026-10-29T23:59:59Z"
        elif case in ("naive_until", "mixed_until"):
            annotation["observed_until"] = "2026-10-30T00:00:12"
            if case == "naive_until":
                annotation["start"] = "2026-10-30T00:00:00"
    elif case in ("completed_conflict", "failed_conflict", "failed_agrees"):
        rows[-1]["aborted"] = False
        message["stopReason"] = "stop" if case == "completed_conflict" else "error"
        if case != "completed_conflict":
            annotation["outcome"] = "completed" if case == "failed_conflict" else "failed"
    elif case == "outcome_only":
        annotation = fx.timing(start=None, end=None, outcome="timeout")
    path = fx.write_jsonl(tmp_path / "source.jsonl", rows)
    report = report_sources(tmp_path, [fx.source(path, kind="pi-json-events", **({} if case == "native_times" else {"timing": annotation}))])
    time = report["timing"]["sources"][0]
    assert report["tokens"]["complete_total"]["value"] is None
    assert report["tokens"]["status"] == "unavailable"
    assert report["observation"]["overall"] == "incomplete"
    if case in ("timeout", "cancelled", "interrupted_only", "completed_conflict", "failed_conflict", "failed_agrees"):
        assert time["duration_seconds"]["value"] == 30
        assert time["status"] == report["timing"]["status"] == "complete"
    else:
        assert time["duration_seconds"]["value"] is None
        assert report["timing"]["status"] != "complete"
    if case in ("until", "naive_until"):
        assert time["partial_duration_seconds"]["status"] == "partial"
        assert time["partial_duration_seconds"]["value"] == 12
        assert time["partial_label"] == "标注观测至（下界）"
    else:
        assert time["partial_duration_seconds"]["value"] is None
    if case in ("completed_conflict", "failed_conflict"):
        assert time["outcome"]["value"] == "unknown"
        assert time["outcome"]["reasons"] == ["annotation_conflict"]
        assert report["sources"][0]["annotation_conflict"] == 1
    elif case == "failed_agrees":
        assert time["outcome"]["value"] == "failed"
        assert time["outcome"]["reasons"] == []
    elif case not in ("native_times", "interrupted_only"):
        assert time["outcome"]["value"] == ("cancelled" if case == "cancelled" else "timeout")
        assert time["outcome"]["interrupted"] is True
        assert time["outcome"]["reasons"] == []
        assert time["outcome"]["annotation"]["basis"] == "synthetic-clock"
    else:
        assert time["outcome"]["value"] == "unknown"
    if case == "native_times":
        assert time["annotation"] is None
        assert time["status"] == report["timing"]["status"] == "unavailable"
        os.utime(path, (946684800, 946688400))
        manifest = budget.load_manifest(tmp_path / "report-manifest.json")
        again = budget.build_report(manifest, [budget.read_source(manifest.sources[0], budget.ReadContext())], None)
        assert again == report  # 原生创建时间、文件 mtime 都不是运行边界或下界。


@pytest.mark.parametrize("case", ["phase_role", "all_unknown"])
def test_missing_dimensions_unknown_group(tmp_path, case):
    rows = fx.f1_rows()
    if case == "all_unknown":
        rows[1]["message"].pop("provider")
        rows[1]["message"].pop("model")
    report = report_fixture(tmp_path, rows)
    for name in ("phase", "role", "model", "channel"):
        group = report["groups"][name]
        assert "(未知)" in group["groups"]
        assert "" not in group["groups"]
        assert group["conserved"] is True
        if name in ("phase", "role") or case == "all_unknown":
            assert group["groups"]["(未知)"]["known_subtotal"] == 170
            assert report["sources"][0]["dimensions"][name] == [{"value": "(未知)", "origin": "derived", "reason": "missing"}]
    assert report["observation"]["metrics"]["tokens"]["status"] == "complete"
    assert report["observation"]["metrics"]["main_attempts"]["status"] == "partial"
    assert report["observation"]["metrics"]["tool_calls"]["status"] == "complete"
    assert report["observation"]["metrics"]["retries"]["status"] == "unavailable"
    assert report["observation"]["metrics"]["rework"]["status"] == "unavailable"
    assert report["observation"]["metrics"]["timing"]["status"] == "unavailable"
    assert report["observation"]["overall"] == "incomplete"


@pytest.mark.parametrize("case", ["source_priority", "missing_source_channel"])
def test_annotation_origin_and_sources_untouched(tmp_path, case):
    rows = fx.f1_rows()
    if case == "missing_source_channel":
        rows[1]["message"].pop("provider")
    # model_change 不改变已归属 assistant 的物理模型。
    rows.append(fx.entry("virtual", "model_change", provider="futures", modelId="auto"))
    path = fx.write_jsonl(tmp_path / "source.jsonl", rows)
    before = hashlib.sha256(path.read_bytes()).hexdigest()
    first = fx.source(path, dimensions={"phase": "Plan", "role": "author", "channel": "manual-channel", "baseline_commit": "abcdef1"})
    manifest = budget.load_manifest(fx.write_manifest(tmp_path / "first.json", [first], baseline_commit="123abcd"))
    report = budget.build_report(manifest, [budget.read_source(manifest.sources[0], budget.ReadContext())], None)
    dims = report["sources"][0]["dimensions"]
    assert dims["phase"] == [{"value": "Plan", "origin": "annotation", "reason": None}]
    assert dims["role"] == [{"value": "author", "origin": "annotation", "reason": None}]
    assert dims["baseline_commit"] == [{"value": "abcdef1", "origin": "annotation", "reason": None}]
    assert dims["model"] == [{"value": "synthetic-model", "origin": "source", "reason": None}]
    if case == "source_priority":
        assert dims["channel"] == [{"value": "openai", "origin": "source", "reason": "annotation_conflict"}]
        assert report["sources"][0]["annotation_conflict"] == 1
        assert "annotation_conflict" in report["sources"][0]["reasons"]
    else:
        assert dims["channel"] == [{"value": "manual-channel", "origin": "annotation", "reason": None}]
        assert report["sources"][0]["annotation_conflict"] == 0
    first["dimensions"] = {"phase": "Review", "role": "reviewer", "channel": "openai"}
    changed = budget.load_manifest(fx.write_manifest(tmp_path / "changed.json", [first], baseline_commit="123abcd"))
    again = budget.build_report(changed, [budget.read_source(changed.sources[0], budget.ReadContext())], None)
    assert again["sources"][0]["dimensions"]["phase"] == [{"value": "Review", "origin": "annotation", "reason": None}]
    assert again["sources"][0]["dimensions"]["baseline_commit"] == [{"value": "123abcd", "origin": "annotation", "reason": None}]
    assert again["sources"][0]["annotation_conflict"] == 0
    assert again["groups"]["phase"]["groups"]["Review"]["known_subtotal"] == 170
    assert report["groups"]["phase"]["groups"]["Plan"]["known_subtotal"] == 170
    assert hashlib.sha256(path.read_bytes()).hexdigest() == before
    assert again["sources"][0]["content_sha256"] == report["sources"][0]["content_sha256"] == before


def test_group_conservation_computed_not_asserted(tmp_path):
    tree = ast.parse(Path(budget.__file__).read_text(encoding="utf-8"))
    assert not any(isinstance(node, ast.Assert) for node in ast.walk(tree))
    rows = fx.f1_rows()
    rows[0]["id"] = "conservation-F1"
    sources = [fx.source(fx.write_jsonl(tmp_path / "first.jsonl", rows), "S1"),
               fx.source(fx.write_jsonl(tmp_path / "second.jsonl", fx.f2_rows()), "S2", "pi-json-events")]
    report = report_sources(tmp_path, sources, all_nested_children_declared=True)
    assert report["tokens"]["known_subtotal"] == 187
    assert "group_conservation_failed" not in report["tokens"]["reasons"]
    for group in report["groups"].values():
        assert group["conserved"] is True
        assert sum(g["known_subtotal"] or 0 for g in group["groups"].values()) == 187
    assert report["observation"]["metrics"]["tokens"]["status"] == report["tokens"]["status"]


@pytest.mark.parametrize("case", ["confirmed", "unconfirmed", "selection_gap", "nested_covered"])
def test_group_conservation_per_dimension(tmp_path, case):
    if case == "nested_covered":
        sources, metadata = fx.f8_sources(tmp_path, "equal")
        report = report_sources(tmp_path, sources, **metadata)
        assert report["groups"]["phase"]["groups"]["(未知)"]["known_subtotal"] == 210
        assert report["groups"]["phase"]["record_count"] == 2
        assert report["sources"][1]["tokens"]["known_subtotal"] == 40
        assert report["groups"]["model"]["groups"]["synthetic-model"]["known_subtotal"] == 170
        assert report["groups"]["model"]["groups"]["(未知)"]["known_subtotal"] == 40
        return
    sources = fx.f5_sources(tmp_path, "double_capture" if case == "unconfirmed" else "lineage")
    sources[0]["dimensions"] = {"phase": "Implement", "role": "author"}
    sources[1]["dimensions"] = {"role": "author"}
    retry = fx.write_jsonl(tmp_path / "retry.jsonl", fx.f2_rows())
    sources.append(fx.source(retry, "R", "pi-json-events", dimensions={"phase": "Review", "role": "reviewer"}))
    if case == "selection_gap":
        sources.append(fx.source(tmp_path / "missing.jsonl", "M"))
    report = report_sources(tmp_path, sources, all_nested_children_declared=True)
    expected = 17 if case == "unconfirmed" else 197
    # F5 净新增 10 + 父 170，F2 已知主尝试 12 + 工具 5 = 197。
    assert report["tokens"]["known_subtotal"] == expected
    for name in ("phase", "role", "model", "channel"):
        groups = report["groups"][name]
        assert groups["known_subtotal"] == expected
        assert groups["conserved"] is True
        assert groups["unconfirmed_excluded"] is (case == "unconfirmed")
        assert sum(g["known_subtotal"] or 0 for g in groups["groups"].values()) == expected
    assert report["groups"]["phase"]["groups"]["Review"]["known_subtotal"] == 17
    assert report["groups"]["model"]["groups"]["(未知)"]["known_subtotal"] == 5
    assert report["groups"]["channel"]["groups"]["openai"]["known_subtotal"] == (12 if case == "unconfirmed" else 192)
    if case == "unconfirmed":
        assert "Implement" not in report["groups"]["phase"]["groups"]
        assert report["sources"][0]["tokens"]["known_subtotal"] == 170
        assert report["sources"][1]["tokens"]["known_subtotal"] == 170
    else:
        assert report["groups"]["phase"]["groups"]["Implement"]["known_subtotal"] == 170
        assert report["groups"]["phase"]["groups"]["(未知)"]["known_subtotal"] == 10


@pytest.mark.parametrize("case,states", [
    pytest.param("complete", ("complete", "complete", "complete", "complete", "complete", "complete"), id="D1_not_a_native_reader"),
    pytest.param("token_partial", ("partial", "complete", "complete", "complete", "complete", "complete"), id="D1_not_a_native_reader_token_partial"),
    pytest.param("attempt_partial", ("complete", "partial", "complete", "complete", "complete", "complete"), id="D1_not_a_native_reader_attempt_partial"),
    pytest.param("tool_partial", ("complete", "complete", "partial", "complete", "complete", "complete"), id="D1_not_a_native_reader_tool_partial"),
    pytest.param("retry_partial", ("complete", "complete", "complete", "partial", "complete", "complete"), id="D1_not_a_native_reader_retry_partial"),
    pytest.param("rework_partial", ("complete", "complete", "complete", "complete", "partial", "complete"), id="D1_not_a_native_reader_rework_partial"),
    pytest.param("timing_missing", ("complete", "complete", "complete", "complete", "complete", "unavailable"), id="D1_not_a_native_reader_timing_missing"),
    pytest.param("unavailable", ("unavailable", "unavailable", "unavailable", "unavailable", "unavailable", "unavailable"), id="D1_not_a_native_reader_unavailable"),
])
def test_all_known_aggregation_normalized_facts(tmp_path, case, states):
    # D1：只在 build_report 边界注入归一化事实，不代表任何原生读取器能产出这些事实。
    tokens = budget.TokenCounts(budget.Value("known", 100), budget.Value("known", 20), budget.Value("known", 40),
                                budget.Value("known", 10), budget.Value("known", 5), budget.Value("known", 3))
    record = budget.UsageRecord("D1-record", "main", "(未知)", "synthetic-provider", "synthetic-model", "stop", "final", tokens)
    fact = budget.SourceFacts("S1", "pi-json-events", status="loaded", session_ref="s:D1", content_sha256="a" * 64,
                              attempt_run_total=budget.Value("known", 1), usage_records=(record,),
                              attempts=(budget.AttemptRecord("D1-record", "completed"),),
                              tool_calls=(budget.ToolCallRecord("D1-record", "D1-call", "finished"),),
                              retries=budget.RetryFacts(budget.Value("known", 0), 0, budget.Value("known", 0), budget.Value("known", 0)))
    annotations = {"timing": fx.timing(), "rework": {"count": 0, "basis": "synthetic-domain"}}
    facts = [fact]
    sources = [fx.source(tmp_path / "not-read", kind="pi-json-events", **annotations)]
    if case == "token_partial":
        facts[0] = replace(fact, usage_records=(replace(record, tokens=replace(tokens, cache_write=budget.Value(reason="missing"))),))
    elif case == "attempt_partial":
        facts[0] = replace(fact, attempt_run_total=budget.Value(reason="attempt_run_incomplete"))
    elif case == "tool_partial":
        facts[0] = replace(fact, tool_calls=(budget.ToolCallRecord("D1-record", "D1-call", "unfinished"),))
    elif case == "retry_partial":
        facts[0] = replace(fact, retries=replace(fact.retries, total=budget.Value(reason="retry_total_not_provable")))
    elif case == "rework_partial":
        facts.append(replace(fact, source_id="S2", session_ref="s:D1-other"))
        sources.append(fx.source(tmp_path / "not-read-other", "S2", kind="pi-json-events", timing=fx.timing()))
    elif case == "timing_missing":
        sources[0].pop("timing")
    elif case == "unavailable":
        facts = [budget.SourceFacts("S1", "pi-json-events", reasons=("source_missing",))]
        sources[0].pop("timing")
        sources[0].pop("rework")
    manifest = budget.load_manifest(fx.write_manifest(tmp_path / "domain-manifest.json", sources))
    with fx.audit_events() as events:
        report = budget.build_report(manifest, facts, None)
    assert events == []  # 声明的系统边界无需读取任何原生文件。
    metrics = report["observation"]["metrics"]
    assert tuple(metrics) == ("tokens", "main_attempts", "tool_calls", "retries", "rework", "timing")
    assert tuple(m["status"] for m in metrics.values()) == states
    for metric in metrics.values():
        assert metric["unit"] and metric["population"]
        assert isinstance(metric["reasons"], list)
        if metric["denominator"] is None:
            assert metric["coverage_percent"] is None
    if case == "complete":
        assert report["observation"]["overall"] == "complete"
        assert report["observation"]["metrics_complete"] == 6
        assert report["tokens"]["complete_total"]["value"] == 170
        assert report["retries"]["total"]["value"] == 0
        assert report["timing"]["batch_window_seconds"]["value"] == 10
        assert report["timing"]["session_duration_sum_seconds"]["value"] == 10
        assert metrics["tokens"]["covered"] == metrics["tokens"]["denominator"] == 1
        assert metrics["tokens"]["coverage_percent"] == 100
    else:
        assert report["observation"]["overall"] == "incomplete"
    if case == "rework_partial":
        assert report["tokens"]["complete_total"]["value"] == 340
        assert report["retries"]["total"]["value"] == 0
        assert report["timing"]["session_duration_sum_seconds"]["value"] == 20
        assert metrics["rework"]["denominator"] == 2
        assert metrics["rework"]["covered"] == metrics["rework"]["missing"] == 1


def cli_fixture(tmp_path, rows=None, *, kind="pi-session-v3", annotations=None, **metadata):
    path = fx.write_jsonl(tmp_path / "input.jsonl", fx.f1_rows() if rows is None else rows)
    manifest = fx.write_manifest(tmp_path / "cli-manifest.json", [fx.source(path, kind=kind, **(annotations or {}))], **metadata)
    out = tmp_path / "out"
    out.mkdir()
    return ["report", "--manifest", str(manifest), "--out-dir", str(out)], out, path


def read_report(out):
    return json.loads((out / "report.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize("case,direct,total,matched,only_executed", [
    ("a", 1, 2, 2, 0), ("b", 1, 3, 3, 0), ("c", 1, 3, 2, 1), ("d", 1, 2, 1, 1),
    ("e", 2, 2, 2, 0), ("f", 2, 2, 2, 0), ("F2", 1, 2, 2, 0),
    ("two_owners", 2, 0, 0, 0), ("session", 3, 2, 0, 0),
    ("unfinished", 1, 2, 2, 0), ("terminal_only", 1, 2, 2, 0),
])
def test_nested_views_dedup_and_direct_coverage(tmp_path, capsys, case, direct, total, matched, only_executed):
    if case == "session":
        sources = fx.f12_nested_sources(tmp_path)
        manifest = fx.write_manifest(tmp_path / "manifest.json", sources, all_nested_children_declared=True)
        out = tmp_path / "out"
        out.mkdir()
        args = ["report", "--manifest", str(manifest), "--out-dir", str(out)]
    else:
        rows = fx.f2_rows() if case == "F2" else fx.f12_events(case) if case == "two_owners" else fx.f14_rows("a" if case in ("unfinished", "terminal_only") else case)
        if case in ("unfinished", "terminal_only"):
            omitted = "tool_execution_end" if case == "unfinished" else "tool_execution_start"
            rows = [r for r in rows if not (r["type"] == omitted and r.get("toolCallId") == "call_1/2")]
        args, out, _ = cli_fixture(tmp_path, rows, kind="pi-json-events")
    assert budget.main([*args, "--detail"]) == 0
    stdout, stderr = capsys.readouterr()
    assert stderr == ""
    report = read_report(out)
    tools = report["tool_calls"]
    assert tools["direct"] == {"finished": direct, "unfinished": 0, "terminal_only": 0, "observed_total": direct}
    assert tools["nested_deduplicated"] == {"observed_total": total, "matched": matched,
                                          "executed_only": only_executed, "reported_only": 2 if case == "session" else 0}
    executed = tools["nested_executed"]
    assert executed["observed_total"] == (None if case == "session" else total)
    assert executed["parent_unresolved"] == (1 if case == "c" else 0)
    assert executed["finished"] == (0 if case == "session" else 1 if case in ("unfinished", "terminal_only") else total)
    assert executed["unfinished"] == (1 if case == "unfinished" else 0)
    assert executed["terminal_only"] == (1 if case == "terminal_only" else 0)
    assert tools["nested_reported"]["observed_total"] == (None if case == "two_owners" else 1 if case == "d" else 3 if case == "b" else 2)
    reasons = (["nested_parent_unresolved"] if case == "c" else ["nested_incomplete"] if case in ("d", "F2")
               else ["nested_execution_incomplete"] if case in ("unfinished", "terminal_only") else [])
    assert tools["reasons"] == reasons
    assert tools["status"] == ("partial" if reasons else "complete")
    assert "tool_call_id_reused_in_scope" not in tools["reasons"]
    if case == "two_owners":
        assert tools["all_total"]["value"] == 2
    else:
        assert tools["all_total"]["value"] is None
        assert tools["all_total"]["reason"] == "nested_overlap_unresolved"
    if case == "session":
        assert executed["reasons"] == ["nested_events_not_persisted"]
    metric = report["observation"]["metrics"]["tool_calls"]
    assert metric["denominator"] == metric["covered"] == direct
    assert metric["missing"] == 0
    assert metric["coverage_percent"] == 100
    summary = (out / "summary.md").read_text(encoding="utf-8")
    if case == "a":
        assert report["attempts"]["main_assistant"]["observed_total"] == 2
        assert report["tokens"]["known_subtotal"] == 345  # 执行事件中的 result.usage 不重复计入。
        assert "| tool_calls | complete | 来源内调用身份 | 选定且已确认去重的 direct 视图 | 1 | 1 | 0 | 100% | 无 |" in summary
        assert "嵌套工具调用（不计入 direct、不与 direct 相加）：执行事件 2（父未解析 0）；nestedCalls 记录 2；按标识去重后 2（两者均见 2）。" in summary
    if case == "c":
        assert "| tool_calls | partial | 来源内调用身份 | 选定且已确认去重的 direct 视图 | 1 |" in summary
    assert ("嵌套工具调用（" in summary) is (case != "two_owners")
    output = stdout + stderr + "".join(p.read_text(encoding="utf-8") for p in out.iterdir())
    for raw_id in ("parentToolCallId", "toolCallId", "call_1", "call_0", "call_A", "absent-parent"):
        assert raw_id not in output


@pytest.mark.parametrize("case", ["complete_tokens", "partial", "empty", "missing", "timeout"])
def test_summary_contents_units_denominators(tmp_path, case):
    rows = fx.f3_stream_rows() if case in ("partial", "timeout") else [fx.header()] if case == "empty" else fx.f1_rows()
    annotations = {"timing": fx.timing(end="2026-10-30T00:00:30Z", outcome="timeout")} if case == "timeout" else {}
    args, out, path = cli_fixture(tmp_path, rows, kind="pi-json-events" if case in ("partial", "timeout") else "pi-session-v3", annotations=annotations)
    if case == "missing":
        path.unlink()
    assert budget.main(args) == (0 if case == "complete_tokens" else 3)
    report = read_report(out)
    summary = (out / "summary.md").read_text(encoding="utf-8")
    assert summary == budget.render_summary(report)
    for text in ("## 报告生成", "## 来源采集", "## 度量覆盖", "## 观测到的执行结果", "非验收结论",
                 "已知小计", "完整总计", "单位", "分母", "已覆盖", "未覆盖 / 缺失", "选定记录", "content_sha256",
                 "快照中的记录", "不证明运行已结束", "非 loaded 来源", "phase", "role", "model", "channel",
                 "主 assistant 尝试内的来源上报输入峰值", "操作记录输入不参与", "非单请求值", "来源语义", "比较条件",
                 "批次观测墙钟窗口", "会话耗时合计", "选定记录小计 ≠ 整次会话或平台账单"):
        assert text in summary
    assert "incomplete" in summary
    retry_line = next(line for line in summary.splitlines() if line.startswith("| retries |"))
    assert "未知" in retry_line and "%" not in retry_line
    assert "message_end" not in summary and "synthetic\u2028text" not in summary
    assert not (out / "records.json").exists()
    if case == "complete_tokens":
        assert "已知小计 170 token；完整总计 170 token" in summary
        assert "峰值：150 token" in summary
        assert "参与记录数 / 尝试总数：1 / 1" in summary
        assert "| tokens | complete | 用量归属记录 | 选定且已确认去重的快照记录 | 1 | 1 | 0 | 100% |" in summary
    elif case == "empty":
        assert "观测到的归属记录 0 条" in summary and "token 消耗未知" in summary
        assert "非 loaded 来源 empty：S1" in summary
        assert "完整总计 0" not in summary
    elif case == "missing":
        assert "非 loaded 来源 unavailable：S1" in summary
        assert "source_missing" in summary
    elif case == "timeout":
        assert "timeout" in summary and "耗时 30.0 秒" in summary
        assert "| timing | complete" in summary and "完整总计 未知" in summary
    else:
        assert "非 loaded 来源 partial：S1" in summary
        assert "| output | 未知 | 0 | 10 | 1 |" in summary


@pytest.mark.parametrize("case,status,token_covered", [
    ("missing", "unavailable", 1), ("bad_json", "partial", 2), ("header", "empty", 1), ("loaded", "loaded", 1),
])
def test_coverage_denominator_unknown_with_source_gaps(tmp_path, capsys, case, status, token_covered):
    rows = fx.f1_rows()
    rows[0]["id"] = "coverage-session-S1"
    rows.append(fx.entry("tool-result", parent="a1", message={"role": "toolResult", "toolCallId": "call_0"}))
    good = fx.write_jsonl(tmp_path / "good.jsonl", rows)
    annotations = {"timing": fx.timing(), "rework": {"count": 0, "basis": "synthetic-coverage"}}
    sources = [fx.source(good, "S1", **annotations)]
    if case != "loaded":
        gap = fx.f6_file(tmp_path / "gap.jsonl", case)
        sources.append(fx.source(gap, "S2", **annotations))
    manifest = fx.write_manifest(tmp_path / "manifest.json", sources)
    out = tmp_path / "out"
    out.mkdir()

    assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == (0 if case == "loaded" else 3)
    stdout, stderr = capsys.readouterr()
    assert stderr == ""
    assert ("sources=ok" if case == "loaded" else "sources=gaps") in stdout
    report = read_report(out)
    summary = (out / "summary.md").read_text(encoding="utf-8")
    metrics = report["observation"]["metrics"]
    assert report["sources"][0]["tokens"]["known_subtotal"] == 170
    assert report["tool_calls"]["direct"]["finished"] == 1
    assert report["tokens"]["known_subtotal"] == (340 if case == "bad_json" else 170)
    if case != "loaded":
        assert report["sources"][1]["status"] == status
        assert report["sources"][0]["session_ref"] != report["sources"][1]["session_ref"]
        assert report["tokens"]["complete_total"]["value"] is None
        assert "非 loaded 选定来源 1 来源；不与记录计数相加" in summary
        assert "记录单位：用量归属记录；分母 未知" in summary
    else:
        assert report["tokens"]["complete_total"]["value"] == 170
    for name, covered, unit in (("tokens", token_covered, "用量归属记录"), ("tool_calls", 1, "来源内调用身份")):
        metric = metrics[name]
        assert metric["unit"] == unit
        assert metric["covered"] == covered
        assert metric["missing_sources"] == {"count": 0 if case == "loaded" else 1, "unit": "来源"}
        line = next(line for line in summary.splitlines() if line.startswith(f"| {name} |"))
        if case == "loaded":
            assert metric["denominator"] == 1
            assert metric["missing"] == 0
            assert metric["coverage_percent"] == 100
            assert "| 1 | 1 | 0 | 100% |" in line
        else:
            assert metric["denominator"] is None
            assert metric["missing"] is None
            assert metric["coverage_percent"] is None
            assert f"| 未知 | {covered} | 未知 | 未知 |" in line
            assert "%" not in line
    for name in ("rework", "timing"):
        assert metrics[name]["denominator"] == (1 if case == "loaded" else 2)
        assert metrics[name]["covered"] == (1 if case == "loaded" else 2)
        assert metrics[name]["missing"] == 0
        assert metrics[name]["coverage_percent"] == 100
    for name in ("main_attempts", "retries"):
        assert metrics[name]["denominator"] is None
        assert metrics[name]["coverage_percent"] is None
        assert metrics[name]["missing"] is None


@pytest.mark.parametrize("case,status,subtotal,covered", [
    ("missing", "unavailable", 170, 1), ("bad_json", "partial", 340, 2),
    ("header", "empty", 170, 1), ("loaded", "loaded", 170, 1),
])
def test_group_denominator_unknown_with_source_gaps(tmp_path, capsys, case, status, subtotal, covered):
    rows = fx.f1_rows()
    rows[0]["id"] = "group-session-S1"
    rows.append(fx.entry("tool-result", parent="a1", message={"role": "toolResult", "toolCallId": "call_0"}))
    good = fx.write_jsonl(tmp_path / "good.jsonl", rows)
    sources = [fx.source(good, "S1", dimensions={"phase": "Plan"})]
    if case != "loaded":
        gap = fx.f6_file(tmp_path / "gap.jsonl", case)
        sources.append(fx.source(gap, "S2", dimensions={"phase": "Plan"}))
    manifest = fx.write_manifest(tmp_path / "manifest.json", sources)
    out = tmp_path / "out"
    out.mkdir()

    assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == (0 if case == "loaded" else 3)
    stdout, stderr = capsys.readouterr()
    assert stderr == ""
    assert ("sources=ok" if case == "loaded" else "sources=gaps") in stdout
    report = read_report(out)
    summary_bytes = (out / "summary.md").read_bytes()
    summary = summary_bytes.decode("utf-8")
    assert report["tokens"]["known_subtotal"] == subtotal
    assert report["sources"][0]["tokens"]["known_subtotal"] == 170
    if case != "loaded":
        assert report["sources"][1]["status"] == status
        assert report["sources"][0]["session_ref"] != report["sources"][1]["session_ref"]
        assert report["tokens"]["complete_total"]["value"] is None
    else:
        # 812c1c1 同一全 loaded 合成输入的摘要字节，不能因新增 JSON 字段而变化。
        assert hashlib.sha256(summary_bytes).hexdigest() == "b9884b1e7ae3ed6397a5b141a74cc4701d2390fa68e0ac4d46b426832758c554"
    for name, label in (("phase", "Plan"), ("role", "(未知)"), ("model", "synthetic-model"), ("channel", "openai")):
        group = report["groups"][name]
        assert group["denominator"] == (1 if case == "loaded" else None)
        assert group["missing_sources"] == {"count": 0 if case == "loaded" else 1, "unit": "来源"}
        assert group["record_count"] == covered
        assert group["known_subtotal"] == subtotal
        assert group["conserved"] is True
        assert sum(g["known_subtotal"] or 0 for g in group["groups"].values()) == subtotal
        values = group["groups"][label]
        assert values["known_subtotal"] == subtotal
        assert values["record_count"] == values["known_records"] == covered
        assert values["unknown_records"] == 0  # 仍是观测记录计数，不混入来源数。
        section = summary.split(f"### {name}\n", 1)[1].split("\n#", 1)[0]
        if case == "loaded":
            assert section.splitlines()[0] == "单位：用量归属记录；分母 1；选定且已确认去重的快照记录。"
            assert f"| {label} | 170 | 1 | 0 | 1 |" in section
        else:
            assert section.splitlines()[0] == "单位：用量归属记录；分母 未知；选定且已确认去重的快照记录。"
            assert "分母 1" not in section and "分母 2" not in section
            assert f"| {label} | {subtotal} | {covered} | 未知 | 未知 |" in section
            for line in section.splitlines()[3:]:
                if line.startswith("| "):
                    assert line.endswith("| 未知 | 未知 |")
            # 与 T-13 的覆盖表保持相同总体口径。
            for metric in ("tokens", "tool_calls"):
                assert report["observation"]["metrics"][metric]["denominator"] is None
                assert report["observation"]["metrics"][metric]["missing"] is None


@pytest.mark.parametrize("case,status,reason,input_total,covered", [
    ("missing", "unavailable", "source_missing", 100, 1),
    ("bad_json", "partial", "bad_json", 200, 2),
    ("header", "empty", "no_usage_records_observed", 100, 1),
    ("loaded", "loaded", "无", 100, 1),
])
def test_token_unknown_records_unknown_with_source_gaps(tmp_path, capsys, case, status, reason, input_total, covered):
    rows = fx.f1_rows()
    rows[0]["id"] = "token-session-S1"
    rows.append(fx.entry("tool-result", parent="a1", message={"role": "toolResult", "toolCallId": "call_0"}))
    good = fx.write_jsonl(tmp_path / "good.jsonl", rows)
    sources = [fx.source(good, "S1")]
    if case != "loaded":
        gap = fx.f6_file(tmp_path / "gap.jsonl", case)
        sources.append(fx.source(gap, "S2"))
    manifest = fx.write_manifest(tmp_path / "manifest.json", sources)
    out = tmp_path / "out"
    out.mkdir()

    assert budget.main(["report", "--manifest", str(manifest), "--out-dir", str(out)]) == (0 if case == "loaded" else 3)
    stdout, stderr = capsys.readouterr()
    assert stderr == ""
    assert ("sources=ok" if case == "loaded" else "sources=gaps") in stdout
    report = read_report(out)
    summary = (out / "summary.md").read_text(encoding="utf-8")
    tokens = report["tokens"]
    metric = report["observation"]["metrics"]["tokens"]
    assert tokens["unknown_records"] == 0
    assert tokens["dimensions"]["input"]["unknown_records"] == 0
    assert tokens["subsets"]["cache_write_1h"]["unknown_records"] == covered
    assert tokens["known_subtotal"] == (340 if case == "bad_json" else 170)
    assert report["tool_calls"]["direct"]["finished"] == 1
    assert metric["missing_sources"] == {"count": 0 if case == "loaded" else 1, "unit": "来源"}
    section = summary.split("### token\n", 1)[1].split("\n###", 1)[0]
    dimension_rows = [line for line in section.splitlines() if line.startswith("| ")][1:]
    assert len(dimension_rows) == 6
    if case == "loaded":
        assert "已确认去重；未知 0 条用量归属记录；原因：无。" in section
        assert "| input | 100 | 1 | 未知 | 0 | 0 | 0 |" in dimension_rows
        assert "| cache_write_1h（子集，不再计入总量） | 未知 | 0 | 未知 | 0 | 1 | 0 |" in dimension_rows
        assert metric["missing"] == 0
    else:
        assert report["sources"][1]["status"] == status
        assert report["sources"][0]["session_ref"] != report["sources"][1]["session_ref"]
        assert f"已确认去重；未知用量归属记录数 未知；原因：{reason}。" in section
        assert "未知 0 条" not in summary
        assert f"| input | {input_total} | {covered} | 未知 | 0 | 未知 | 0 |" in dimension_rows
        assert "| cache_write_1h（子集，不再计入总量） | 未知 | 0 | 未知 | 0 | 未知 | 0 |" in dimension_rows
        assert all(line.endswith("| 未知 | 0 |") for line in dimension_rows)
        assert metric["missing"] is None
        assert tokens["complete_total"]["value"] is None


@pytest.mark.parametrize("case", ["loaded", "missing", "bad_json", "header", "unsettled", "unrecognized",
                                  "invalid_arguments", "manifest_missing", "manifest_invalid", "out_missing", "out_file", "out_inside"])
def test_exit_codes_separate_acquisition_from_coverage(tmp_path, capsys, case):
    args, out, path = cli_fixture(tmp_path, fx.f13_rows("c") if case == "unrecognized" else fx.f3_stream_rows() if case == "unsettled" else None,
                                  kind="pi-json-events" if case in ("unrecognized", "unsettled") else "pi-session-v3")
    error = None
    if case == "missing":
        path.unlink()
    elif case == "bad_json":
        with path.open("ab") as stream:
            stream.write(b"bad-json\n")
    elif case == "header":
        path.unlink()
        fx.write_jsonl(path, [fx.header()])
    elif case == "invalid_arguments":
        args += ["--PRIVATE_ARG", "C:/PRIVATE_VALUE"]
        error = "invalid_arguments"
    elif case == "manifest_missing":
        Path(args[2]).unlink()
        error = "manifest_unreadable"
    elif case == "manifest_invalid":
        Path(args[2]).write_text('{"PRIVATE_KEY": "PRIVATE_VALUE"}', encoding="utf-8")
        error = "manifest_invalid unknown_field"
    elif case in ("out_missing", "out_file", "out_inside"):
        args[4] = str(tmp_path / "absent" if case == "out_missing" else path if case == "out_file" else Path(budget.__file__).resolve().parents[1])
        error = "out_dir_inside_repo" if case == "out_inside" else "out_dir_invalid"
    code = budget.main(args)
    stdout, stderr = capsys.readouterr()
    if error:
        assert code == 2 and stdout == ""
        assert stderr == f"error: {error}\n"
        assert list(out.iterdir()) == []
    else:
        assert code == (0 if case in ("loaded", "unrecognized") else 3)
        status_counts = {"loaded": "loaded=1 partial=0 empty=0 unavailable=0", "unrecognized": "loaded=1 partial=0 empty=0 unavailable=0",
                         "missing": "loaded=0 partial=0 empty=0 unavailable=1", "bad_json": "loaded=0 partial=1 empty=0 unavailable=0",
                         "header": "loaded=0 partial=0 empty=1 unavailable=0", "unsettled": "loaded=0 partial=1 empty=0 unavailable=0"}
        report = read_report(out)
        assert stdout == (f"dev-harness-budget: report written; sources={'ok' if code == 0 else 'gaps'} {status_counts[case]}; "
                          f"metrics_complete={report['observation']['metrics_complete']}/6; overall_observation=incomplete; not an acceptance verdict\n")
        assert stderr == ""
        assert sorted(p.name for p in out.iterdir()) == ["report.json", "summary.md"]
        summary = (out / "summary.md").read_text(encoding="utf-8")
        assert "采集成功" not in summary and "观测完整" not in summary
        if case == "unrecognized":
            assert "987654" not in summary
            assert report["tokens"]["complete_total"]["value"] is None
    assert "PRIVATE" not in stdout + stderr


@pytest.mark.parametrize("name", ["report.json", "records.json", "summary.md"])
def test_existing_outputs_never_overwritten(tmp_path, capsys, name):
    args, out, path = cli_fixture(tmp_path)
    temporary_source = fx.write_jsonl(out / ".summary.md.tmp", fx.f1_rows())
    manifest = fx.write_manifest(tmp_path / "selected.json", [fx.source(temporary_source)])
    args[2] = str(manifest)
    args += ["--detail"]
    existing = out / name
    existing.write_bytes(b"synthetic existing artifact\n")
    before = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in out.iterdir()}
    assert budget.main(args) == 2
    assert capsys.readouterr() == ("", "error: output_exists\n")
    assert {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in out.iterdir()} == before
    # 目标即选定来源或先前报告，也必须独占失败且不删除。
    if name == "report.json":
        existing.unlink()
        fx.write_jsonl(existing, fx.f1_rows())
        other_manifest = fx.write_manifest(tmp_path / "same-name.json", [fx.source(existing)])
        args[2] = str(other_manifest)
        before_bytes = existing.read_bytes()
        assert budget.main(args) == 2
        assert existing.read_bytes() == before_bytes


@pytest.mark.parametrize("detail,cleanup_failure,write_failure", [(False, False, False), (True, False, False),
                                                                    (True, True, False), (False, False, True)])
def test_write_failure_cleans_own_artifacts_only(tmp_path, monkeypatch, capsys, detail, cleanup_failure, write_failure):
    args, out, path = cli_fixture(tmp_path)
    untouched = out / ".summary.md.tmp"
    untouched.write_bytes(b"synthetic existing\n")
    args += ["--detail"] if detail else []
    original_open, original_unlink = Path.open, Path.unlink
    order = []
    second = "records.json" if detail else "summary.md"

    class FailingWriter:
        def __init__(self, stream):
            self.stream = stream
        def __enter__(self):
            return self
        def write(self, content):
            self.stream.write("partial")
            raise OSError("PRIVATE_WRITE_ERROR")
        def __exit__(self, *args):
            self.stream.close()

    def fail_open(self, mode="r", *pos, **kwargs):
        if mode == "x":
            order.append(self.name)
            if self.name == second:
                if write_failure:
                    return FailingWriter(original_open(self, mode, *pos, **kwargs))
                raise OSError("PRIVATE_WRITE_ERROR")
        return original_open(self, mode, *pos, **kwargs)

    def fail_unlink(self, *pos, **kwargs):
        if cleanup_failure and self == out / "report.json":
            raise PermissionError("PRIVATE_CLEANUP_ERROR")
        return original_unlink(self, *pos, **kwargs)

    monkeypatch.setattr(Path, "open", fail_open)
    monkeypatch.setattr(Path, "unlink", fail_unlink)
    assert budget.main(args) == 1
    assert order == ["report.json", second]
    assert capsys.readouterr() == ("", "error: write_failed" + ("; partial_artifacts_left=1" if cleanup_failure else "") + "\n")
    assert sorted(p.name for p in out.iterdir()) == ([".summary.md.tmp", "report.json"] if cleanup_failure else [".summary.md.tmp"])
    assert untouched.read_bytes() == b"synthetic existing\n"


@pytest.mark.parametrize("case", ["baseline", "model", "config", "scope", "semantics", "format", "missing", "different_and_missing",
                                  "invalid_schema", "invalid_label", "invalid_shape", "unreadable", "projection", "missing_format", "missing_model"])
def test_comparability_flags_no_money(tmp_path, capsys, case):
    original = tmp_path / "original"
    original.mkdir()
    args, prior_out, _ = cli_fixture(original, baseline_commit="123abcd", conditions={"config_label": "standard", "task_scope": "batch-1"})
    assert budget.main(args) == 0
    prior = read_report(prior_out)
    if case == "model":
        prior["sources"][0]["dimensions"]["model"][0]["value"] = "other-model"
    elif case == "config":
        prior["batch"]["conditions"]["config_label"] = "other"
    elif case in ("scope", "different_and_missing"):
        prior["batch"]["conditions"]["task_scope"] = "other"
    elif case == "semantics":
        prior["semantics"]["version"] = "dhb-metrics/2"
    elif case == "format":
        prior["sources"][0]["format"] = "pi-json-events"
    elif case == "invalid_schema":
        prior["schema"] = "PRIVATE_SCHEMA"
    elif case == "invalid_label":
        prior["sources"][0]["dimensions"]["model"][0]["value"] = "C:/PRIVATE_MODEL"
    elif case == "invalid_shape":
        prior["batch"]["conditions"] = []
    if case in ("missing", "different_and_missing"):
        prior["batch"]["conditions"].pop("config_label")
    elif case == "missing_format":
        prior["sources"].append({"dimensions": {"model": [{"value": "synthetic-model"}]}})
    elif case == "missing_model":
        prior["sources"][0]["dimensions"]["model"].append({"value": "(未知)"})
    prior["PRIVATE_EXTRA"] = {"prompt": "PRIVATE_PAYLOAD", "cost": 987654321}
    compare_path = tmp_path / "compare.json"
    compare_path.write_text(json.dumps(prior), encoding="utf-8")
    if case == "unreadable":
        compare_path.unlink()
    current = tmp_path / "current"
    current.mkdir()
    args, out, path = cli_fixture(current, baseline_commit="abcdef1", conditions={"config_label": "standard", "task_scope": "batch-1"},
                                  comparability_note={"text": "manual same scope", "basis": "synthetic-note"})
    capsys.readouterr()
    code = budget.main([*args, "--detail", "--compare-with", str(compare_path)])
    stdout, stderr = capsys.readouterr()
    if case in ("invalid_schema", "invalid_label", "invalid_shape", "unreadable"):
        assert code == 2 and stderr == "error: compare_report_invalid\n" and stdout == ""
        assert list(out.iterdir()) == []
        return
    assert code == 0 and stderr == ""
    report = read_report(out)
    comparison = report["comparability"]
    assert comparison["baseline_different"] is True
    assert comparison["baseline"] == "已披露"
    if case in ("baseline", "projection"):
        assert comparison["status"] == "same"
        assert comparison["label"] == "比较条件相同"
        assert comparison["differences"] == []
    elif case in ("missing", "missing_format", "missing_model"):
        assert comparison["status"] == "unknown"
        assert comparison["label"] == "可比性未知"
    else:
        assert comparison["status"] == "different"
        assert comparison["label"] == "条件不同、不可直接比较"
        assert comparison["differences"]
    if case == "different_and_missing":
        assert comparison["differences"] == ["task_scope"]
        assert comparison["missing"] == ["config_label"]
    assert comparison["note"] == {"text": "manual same scope", "origin": "annotation", "basis": "synthetic-note"}
    output = "".join(p.read_text(encoding="utf-8") for p in out.iterdir()) + stdout + stderr
    assert "PRIVATE" not in output and "987654321" not in output
    for forbidden in ('"cost"', '"price"', '"money"', '"amount"', '"currency"'):
        assert forbidden not in output
    assert json.loads((out / "records.json").read_text(encoding="utf-8"))["schema"] == "dhb-records/1"
    assert report["tokens"]["complete_total"]["value"] == 170


def test_only_selected_sources_opened(tmp_path, capsys):
    private = tmp_path / "PRIVATE_DIRECTORY"
    private.mkdir()
    unselected = fx.write_jsonl(private / "PRIVATE_UNSELECTED.jsonl", fx.f1_rows())
    (private / "PRIVATE_DOCUMENT.txt").write_text("PRIVATE_DOCUMENT_BODY", encoding="utf-8")
    rows = fx.f1_rows()
    rows[0]["parentSession"] = str(unselected)
    args, out, selected = cli_fixture(tmp_path, rows)
    with fx.audit_events() as events:
        assert budget.main([*args, "--detail"]) == 0
    opened = {Path(event_args[0]).resolve() for event, event_args in events if event == "open"}
    assert opened == {Path(args[2]).resolve(), selected.resolve(), out / "report.json", out / "records.json", out / "summary.md"}
    assert all(event == "open" for event, _ in events)
    writes = [(Path(a[0]).name, a[1], a[2]) for event, a in events if event == "open" and a[1] == "x"]
    assert [name for name, _, _ in writes] == ["report.json", "records.json", "summary.md"]
    assert all(flags & os.O_EXCL and flags & os.O_CREAT for _, _, flags in writes)
    stdout, stderr = capsys.readouterr()
    output = stdout + stderr + "".join(p.read_text(encoding="utf-8") for p in out.iterdir())
    assert "PRIVATE" not in output
    assert read_report(out)["tokens"]["known_subtotal"] == 170


@pytest.mark.parametrize("case", ["F1", "F2"])
def test_zero_model_and_network_attempts(tmp_path, monkeypatch, capsys, case):
    for key in list(os.environ):
        if any(part in key.upper() for part in ("KEY", "TOKEN", "SECRET", "CREDENTIAL", "PASSWORD", "AUTH")):
            monkeypatch.delenv(key, raising=False)
    args, out, _ = cli_fixture(tmp_path, fx.f1_rows() if case == "F1" else fx.f2_rows(),
                              kind="pi-session-v3" if case == "F1" else "pi-json-events")
    # 出口先记尝试再拒绝；即使实现吞掉离线异常，也会因非零计数失败。
    with fx.audit_events(block_external=True) as events:
        code = budget.main(args)
    assert code == 0
    assert [name for name, _ in events if name != "open"] == []
    report = read_report(out)
    assert report["schema"] == "dhb-report/1"
    assert set(report) == {"schema", "batch", "semantics", "population", "acquisition", "sources", "relations", "tokens",
                           "attempts", "tool_calls", "retries", "timing", "observation", "groups", "comparability", "unobserved_paths"}
    assert report["acquisition"]["status"] == "ok"
    assert report["tokens"]["known_subtotal"] == (170 if case == "F1" else 17)
    assert report["observation"]["overall"] == "incomplete"
    assert (out / "summary.md").read_text(encoding="utf-8").startswith("# 开发批次用量观测")
    assert sorted(p.name for p in out.iterdir()) == ["report.json", "summary.md"]
    assert capsys.readouterr().err == ""


@pytest.mark.parametrize("case", ["loaded", "missing", "bad_json"])
def test_no_effect_on_observed_work(tmp_path, capsys, case):
    sandbox = tmp_path / "specs" / "demo"
    sandbox.mkdir(parents=True)
    states = {"spec.md": "# synthetic spec\nGate 1 frozen\n- [ ] AC-demo\n",
              "checklist.md": "# synthetic checklist\n- [x] quality only\n",
              "review.md": "Gate 2 pending\nroute=synthetic-fixed\n"}
    for name, content in states.items():
        (sandbox / name).write_text(content, encoding="utf-8")
    artifact = tmp_path / "existing-deliverable.txt"
    artifact.write_text("synthetic existing deliverable", encoding="utf-8")
    args, out, source = cli_fixture(tmp_path)
    if case == "missing":
        source.unlink()
    elif case == "bad_json":
        with source.open("ab") as stream:
            stream.write(b"bad-json\n")
    protected = [artifact, *(sandbox / name for name in states), *([source] if source.exists() else [])]
    before = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in protected}
    with fx.audit_events(block_external=True) as events:
        assert budget.main(args) == (0 if case == "loaded" else 3)
    assert {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in protected} == before
    # 业务状态与控制动作分别观测，不拿文件哈希替代它们。
    assert {name: (sandbox / name).read_text(encoding="utf-8") for name in states} == states
    assert [name for name, _ in events if name != "open"] == []
    source_opens = [a for name, a in events if name == "open" and Path(a[0]) == source]
    assert len(source_opens) == 1
    assert source_opens[0][1] == "r"
    assert not source_opens[0][2] & (os.O_WRONLY | os.O_RDWR | os.O_CREAT | os.O_TRUNC | os.O_APPEND)
    if hasattr(os, "O_BINARY"):
        assert source_opens[0][2] & os.O_BINARY
    assert capsys.readouterr().err == ""


@pytest.mark.parametrize("case", ["F1", "F2", "F12", "F13", "internal", "invalid_cli", "unknown_key"])
def test_privacy_sentinels_absent(tmp_path, monkeypatch, capsys, case):
    private = tmp_path / "PRIVATE_PATH"
    private.mkdir()
    fixture = case if case in ("F1", "F2", "F12", "F13") else "F1"
    rows = fx.privacy_rows(fixture, private)
    args, out, path = cli_fixture(private, rows, kind="pi-session-v3" if fixture == "F1" else "pi-json-events")
    expected = 0
    if case == "internal":
        original_open = Path.open
        def failing_open(self, *pos, **kwargs):
            if self == path:
                raise RuntimeError("PRIVATE_INTERNAL_ERROR C:/PRIVATE_PATH")
            return original_open(self, *pos, **kwargs)
        monkeypatch.setattr(Path, "open", failing_open)
        expected = 1
    elif case == "invalid_cli":
        args += ["--PRIVATE_ARG", "PRIVATE_ARG_VALUE"]
        expected = 2
    elif case == "unknown_key":
        Path(args[2]).write_text('{"PRIVATE_KEY": "PRIVATE_VALUE"}', encoding="utf-8")
        expected = 2
    assert budget.main([*args, "--detail"]) == expected
    stdout, stderr = capsys.readouterr()
    output = stdout + stderr + "".join(p.read_text(encoding="utf-8") for p in out.iterdir())
    assert "PRIVATE" not in output and "987654" not in output
    assert "PRIVATE_PARENT_TOOL_CALL_ID" not in output
    if fixture == "F2":
        assert any(row.get("parentToolCallId") == "PRIVATE_PARENT_TOOL_CALL_ID" for row in rows)
    assert str(private) not in output and "Traceback" not in output
    if expected == 0:
        report = read_report(out)
        assert report["tokens"]["known_subtotal"] == {"F1": 170, "F2": 17, "F12": 340, "F13": 240}[case]
        if case == "F13":
            assert report["tokens"]["record_count"] == 3
            assert report["tokens"]["categories"]["usage_entry"]["known_subtotal"] == 40
            assert report["tokens"]["categories"]["compaction"]["known_subtotal"] == 30
        assert stderr == ""
    else:
        assert list(out.iterdir()) == []
        assert stdout == ""
        assert stderr == ("error: internal_error\n" if expected == 1 else "error: invalid_arguments\n" if case == "invalid_cli" else "error: manifest_invalid unknown_field\n")


@pytest.mark.parametrize("value", ["C:/Users/PRIVATE_SENTINEL", "//server/share/PRIVATE_SENTINEL", "/private/PRIVATE_SENTINEL",
                                  "openai/gpt-6.1-sol", "qwen3:32b", "claude-opus-5-5"])
def test_path_shaped_labels_rejected_not_echoed(tmp_path, capsys, value):
    invalid = "PRIVATE" in value
    rows = fx.f1_rows()
    rows[1]["message"].update(provider=value, model=value)
    args, out, _ = cli_fixture(tmp_path, rows)
    assert budget.main([*args, "--detail"]) == 0
    stdout, stderr = capsys.readouterr()
    output = stdout + stderr + "".join(p.read_text(encoding="utf-8") for p in out.iterdir())
    if invalid:
        assert value not in output and "PRIVATE" not in output
        assert "(无效标签)" in output
        report = read_report(out)
        assert report["sources"][0]["reasons"].count("invalid_label") == 2
        for index, annotations in enumerate(({"dimensions": {"phase": value}}, {"dimensions": {"role": value}},
                                             {"dimensions": {"channel": value}}, {"rework": {"count": 1, "basis": value}})):
            invalid_manifest = fx.write_manifest(tmp_path / f"invalid-{index}.json", [fx.source(tmp_path / "not-opened", **annotations)])
            with fx.audit_events() as events:
                assert budget.main(["report", "--manifest", str(invalid_manifest), "--out-dir", str(out)]) == 2
            stdout, stderr = capsys.readouterr()
            assert stdout == "" and stderr.startswith("error: manifest_invalid sources[0].")
            assert value not in stderr and "PRIVATE" not in stderr
            assert len(events) == 1 and events[0][0] == "open"
    else:
        assert value in output and "(无效标签)" not in output
    assert budget.main(["--help"]) == 0
    stdout, stderr = capsys.readouterr()
    assert "usage:" in stdout and stderr == "" and str(tmp_path) not in stdout


def test_repo_state_unchanged(tmp_path, capsys):
    repo = Path(budget.__file__).resolve().parents[2]
    sandbox = tmp_path / "sandbox"
    sandbox.mkdir()
    subprocess.run(["git", "init", "-q", str(sandbox)], check=True, capture_output=True)
    tracked = fx.write_jsonl(sandbox / "tracked.jsonl", fx.f1_rows())
    manifest = fx.write_manifest(tmp_path / "manifest.json", [fx.source(tracked)])
    out = tmp_path / "out"
    out.mkdir()
    args = ["report", "--manifest", str(manifest), "--out-dir", str(out)]
    subprocess.run(["git", "-C", str(sandbox), "add", "tracked.jsonl"], check=True, capture_output=True)
    subprocess.run(["git", "-C", str(sandbox), "-c", "user.name=Synthetic", "-c", "user.email=synthetic@example.invalid",
                    "-c", "commit.gpgsign=false", "commit", "-qm", "synthetic sandbox"], check=True, capture_output=True)
    def status(path):
        return subprocess.run(["git", "-C", str(path), "status", "--porcelain=v1", "--untracked-files=all"],
                              check=True, capture_output=True).stdout
    assert status(sandbox) == b""
    before_repo = status(repo)
    assert budget.main([*args, "--detail"]) == 0
    assert status(sandbox) == b""
    assert status(repo) == before_repo
    before_files = sorted(p.name for p in out.iterdir())
    capsys.readouterr()
    for inside in (repo, repo / "backend"):
        with fx.audit_events() as events:
            assert budget.main([*args[:3], "--out-dir", str(inside)]) == 2
        assert capsys.readouterr() == ("", "error: out_dir_inside_repo\n")
        assert all(a[1] == "r" for name, a in events if name == "open")
    assert sorted(p.name for p in out.iterdir()) == before_files
    assert status(repo) == before_repo
    assert status(sandbox) == b""


def test_synthetic_categories_covered(tmp_path):
    complete_dir, retry_dir, parallel_dir = (tmp_path / name for name in ("complete", "retry", "parallel"))
    for directory in (complete_dir, retry_dir, parallel_dir):
        directory.mkdir()
    first = report_fixture(complete_dir, fx.f1_rows())
    assert first["tokens"]["complete_total"]["value"] == 170
    assert first["observation"]["metrics"]["tokens"]["status"] == "complete"
    assert first["observation"]["overall"] == "incomplete"
    second = report_fixture(retry_dir, fx.f2_rows(), kind="pi-json-events")
    assert second["tokens"]["categories"]["main"]["known_subtotal"] == 12
    assert second["attempts"]["main_assistant"]["observed_total"] == 2
    assert second["retries"]["confirmed"]["value"] == 1
    rows_a, rows_b = fx.f3_stream_rows(), fx.f3_stream_rows()
    rows_a[0]["id"], rows_b[0]["id"] = "parallel-A", "parallel-B"
    sources = [fx.source(fx.write_jsonl(parallel_dir / "A.jsonl", rows_a), "A", "pi-json-events", timing=fx.timing()),
               fx.source(fx.write_jsonl(parallel_dir / "B.jsonl", rows_b), "B", "pi-json-events", timing=fx.timing())]
    third = report_sources(parallel_dir, sources)
    assert third["tokens"]["known_subtotal"] is None
    assert third["tokens"]["dimensions"]["output"]["partial_lower_bound"] == 20
    assert third["timing"]["batch_window_seconds"]["value"] == 10
    assert third["timing"]["session_duration_sum_seconds"]["value"] == 20
    assert third["observation"]["overall"] == "incomplete"
    # 全部度量已知仅由 test_all_known_aggregation_normalized_facts 的 D1 验证；不是原生夹具能力。
