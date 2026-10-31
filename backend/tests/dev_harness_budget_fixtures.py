"""dev-harness-budget 合成夹具；在测试临时目录写出，不读取真实会话。"""
from __future__ import annotations

import json
import sys
from contextlib import contextmanager
from pathlib import Path


_AUDIT_ACTIVE = False
_AUDIT_BLOCK_EXTERNAL = False
_AUDIT_EVENTS: list[tuple[str, tuple]] = []


def _audit_hook(event: str, args: tuple) -> None:
    if _AUDIT_ACTIVE and (event == "open" or event.startswith("socket.") or event in
                          {"subprocess.Popen", "os.system", "os.kill", "os.killpg", "os.posix_spawn", "os.spawn"}):
        _AUDIT_EVENTS.append((event, args))
        if _AUDIT_BLOCK_EXTERNAL and event != "open":
            raise PermissionError("synthetic offline boundary")


# Python 没有卸载 API；模块导入时只注册一次，各测试只切 active。
sys.addaudithook(_audit_hook)


@contextmanager
def audit_events(*, block_external: bool = False):
    global _AUDIT_ACTIVE, _AUDIT_BLOCK_EXTERNAL
    _AUDIT_EVENTS.clear()
    _AUDIT_BLOCK_EXTERNAL = block_external
    _AUDIT_ACTIVE = True
    try:
        yield _AUDIT_EVENTS
    finally:
        _AUDIT_ACTIVE = False
        _AUDIT_BLOCK_EXTERNAL = False


def write_jsonl(path: Path, rows: list[dict]) -> Path:
    content = b"".join(json.dumps(row, ensure_ascii=False).encode("utf-8") + b"\n" for row in rows)
    with path.open("xb") as stream:
        stream.write(content)
    return path


def write_manifest(path: Path, sources: list[dict], **metadata) -> Path:
    raw = {"manifest_version": 1, "batch_id": "synthetic-batch", "sources": sources, **metadata}
    with path.open("x", encoding="utf-8", newline="\n") as stream:
        json.dump(raw, stream, ensure_ascii=False)
    return path


def source(path: Path, sid: str = "S1", kind: str = "pi-session-v3", **annotations) -> dict:
    return {"source_id": sid, "kind": kind, "path": str(path), **annotations}


def header(sid: str = "synthetic-session", timestamp: str = "2026-10-30T00:00:00Z", **extra) -> dict:
    return {"type": "session", "version": 3, "id": sid, "timestamp": timestamp, "cwd": "synthetic-only", **extra}


def usage(input: int = 100, output: int = 20, cache_read: int = 40, cache_write: int = 10, **extra) -> dict:
    # totalTokens 刻意默认缺失，按 r3 不做辅助对账。
    return {"input": input, "output": output, "cacheRead": cache_read, "cacheWrite": cache_write, **extra}


def assistant(stop: str = "stop", tokens: dict | None = None, calls: tuple[str, ...] = (), **extra) -> dict:
    return {"role": "assistant", "provider": "openai", "model": "synthetic-model", "stopReason": stop,
            "usage": usage(reasoning=5) if tokens is None else tokens,
            "content": [{"type": "text", "text": "synthetic\u2028text\u2029only"},
                        *({"type": "toolCall", "id": call, "name": "synthetic", "arguments": {"text": "not metadata"}} for call in calls)],
            **extra}


def entry(eid: str, entry_type: str = "message", parent: str | None = None, timestamp: str = "2026-10-30T00:00:01Z", **extra) -> dict:
    return {"type": entry_type, "id": eid, "parentId": parent, "timestamp": timestamp, **extra}


def f1_rows(historical: bool = False) -> list[dict]:
    stamp = "2020-01-01T00:00:00Z" if historical else "2026-10-30T00:00:00Z"
    return [header(timestamp=stamp), entry("a1", timestamp=stamp, message=assistant(tokens=usage(reasoning=5, totalTokens=170)))]


def f6_file(path: Path, case: str) -> Path:
    if case == "missing":
        return path
    if case == "directory":
        path.mkdir()
        return path
    if case == "v2":
        return write_jsonl(path, [header(version=2)])
    if case == "no_version":
        row = header()
        del row["version"]
        return write_jsonl(path, [row])
    if case == "rpc":
        return write_jsonl(path, [{"type": "agent_start"}])
    if case == "header":
        return write_jsonl(path, [header()])
    rows = f1_rows()
    raw = b"".join(json.dumps(row, ensure_ascii=False).encode("utf-8") + b"\n" for row in rows)
    if case == "bad_json":
        raw += b"bad-json\n"
    elif case == "truncated":
        raw += b'{"type":"message"'
    elif case == "bad_utf8":
        raw += b"\xff\n"
    elif case == "nonobject":
        raw += b"[]\n"
    elif case == "bad_header":
        raw = b"bad-json\n" + raw
    elif case == "crlf":
        raw = raw.replace(b"\n", b"\r\n")
    elif case == "no_final_lf":
        raw = raw[:-1]
    elif case == "bad_entry":
        raw += b'{"type":"message","message":{"role":"assistant"}}\n'
    else:
        raise ValueError("unknown synthetic case")
    with path.open("xb") as stream:
        stream.write(raw)
    return path


def f7_usage(case: str) -> dict:
    tokens = usage(reasoning=5, cacheWrite1h=3)
    if case == "missing_total":
        return tokens
    changes = {"valid_total": {"totalTokens": 170}, "string_total": {"totalTokens": "170"},
               "negative_total": {"totalTokens": -1}, "bool_total": {"totalTokens": True},
               "float_total": {"totalTokens": 170.0}, "nan_total": {"totalTokens": float("nan")},
               "mismatch": {"totalTokens": 175}, "reasoning_exceeds": {"reasoning": 21},
               "cache_subset_exceeds": {"cacheWrite1h": 11}, "zero": {"cacheWrite": 0, "cacheWrite1h": 0},
               "invalid_dimension": {"input": -1}, "bool_dimension": {"input": True},
               "float_dimension": {"input": 100.0}, "infinite_dimension": {"input": float("inf")}}
    if case == "missing_dimension":
        del tokens["cacheRead"]
        tokens["totalTokens"] = 170
    elif case == "missing_subset":
        del tokens["reasoning"]
    else:
        tokens.update(changes[case])
    return tokens


def f11_sources(case: str) -> list[dict]:
    sources = [source(Path("never-open-A"), "A"), source(Path("never-open-B"), "B"), source(Path("never-open-C"), "C")]
    duplicate = lambda target: {"source": target, "basis": "synthetic-proof"}
    nested = lambda target: {"source": target, "tool_call_id": "call_0", "basis": "synthetic-proof"}
    if case == "self":
        sources[0]["duplicate_of"] = duplicate("A")
    elif case == "missing":
        sources[0]["duplicate_of"] = duplicate("undeclared-private-sentinel")
    elif case == "duplicate_cycle":
        sources[0]["duplicate_of"], sources[1]["duplicate_of"] = duplicate("B"), duplicate("A")
    elif case == "nested_cycle":
        sources[0]["nested_of"], sources[1]["nested_of"] = nested("B"), nested("A")
    elif case == "mixed_cycle":
        sources[0]["duplicate_of"], sources[1]["nested_of"] = duplicate("B"), nested("A")
    elif case == "both":
        sources[0]["duplicate_of"], sources[0]["nested_of"] = duplicate("B"), nested("C")
    elif case == "duplicate_chain":
        sources[0]["duplicate_of"], sources[1]["duplicate_of"] = duplicate("B"), duplicate("C")
    elif case == "nested_chain":
        sources[0]["nested_of"], sources[1]["nested_of"] = nested("B"), nested("C")
    elif case == "mixed_component":
        sources[0]["duplicate_of"], sources[1]["nested_of"] = duplicate("B"), nested("C")
    else:
        raise ValueError("unknown synthetic graph")
    return sources


def _attempt_events(stop: str, tokens: dict, calls: tuple[str, ...] = ()) -> list[dict]:
    message = assistant(stop, tokens, calls)
    return [{"type": "agent_start"}, {"type": "turn_start"},
            {"type": "message_start", "message": assistant("pending", usage(0, 0, 0, 0))},
            {"type": "message_end", "message": message},
            {"type": "turn_end", "message": message}, {"type": "agent_end", "messages": [message], "willRetry": stop == "error"}]


def tool_result_events(message: dict) -> list[dict]:
    return [{"type": "message_start", "message": message}, {"type": "message_end", "message": message}]


def f2_rows(case: str = "success") -> list[dict]:
    rows = [header(), *_attempt_events("error", usage(0, 0, 0, 0)), {"type": "auto_retry_start", "attempt": 1}]
    if case == "chain":
        rows += _attempt_events("error", usage(1, 1, 0, 0)) + [{"type": "auto_retry_start", "attempt": 2}]
    elif case in ("cancelled", "after_end"):
        rows += [{"type": "auto_retry_end", "success": False, "attempt": 1, "finalError": "synthetic retry cancellation"},
                 {"type": "agent_settled", "aborted": True}]
        if case == "after_end":
            rows += _attempt_events("stop", usage(9, 1, 1, 1)) + [{"type": "agent_settled", "aborted": False}]
        return rows
    final = assistant(tokens=usage(9, 1, 1, 1, totalTokens=12), calls=("call_0",))
    rows += [{"type": "agent_start"}, {"type": "turn_start"},
             {"type": "message_start", "message": assistant("pending", usage(0, 0, 0, 0))},
             {"type": "message_update", "usage": usage(3, 1, 1, 1, totalTokens=6)},
             {"type": "message_update", "usage": usage(7, 1, 1, 1, totalTokens=10)},
             {"type": "message_end", "message": final},
             {"type": "auto_retry_end", "success": True, "attempt": 2 if case == "chain" else 1},
             {"type": "tool_execution_start", "toolCallId": "call_0", "args": {"text": "synthetic only"}},
             {"type": "tool_execution_start", "toolCallId": "call_0/1", "parentToolCallId": "call_0"},
             {"type": "tool_execution_end", "toolCallId": "call_0/1", "parentToolCallId": "call_0"},
             {"type": "tool_execution_start", "toolCallId": "call_0/2", "parentToolCallId": "call_0"},
             {"type": "tool_execution_end", "toolCallId": "call_0", "durationMs": 3, "isError": False,
              "result": {"content": "not metadata", "usage": usage(999, 999, 999, 999)}},
             *tool_result_events({"role": "toolResult", "toolCallId": "call_0", "isError": False,
                                  "content": "synthetic result", "usage": usage(2, 1, 1, 1),
                                  "nestedCalls": {"calls": [{"id": "call_0/1", "status": "ok"},
                                                            {"id": "call_0/2", "status": "unfinished"}], "complete": False}}),
             {"type": "tool_execution_end", "toolCallId": "call_0/2", "parentToolCallId": "call_0"},
             {"type": "turn_end", "message": final}, {"type": "agent_end", "messages": [final]},
             {"type": "agent_settled", "aborted": False}]
    return rows


def f14_rows(case: str) -> list[dict]:
    """F14：嵌套执行与父结果同流，id 只作合成身份。"""
    rows = [header()]
    rounds = [("call_0",), ("call_0",)] if case == "f" else [("call_A", "call_B")] if case == "e" else [("call_1",)]
    for roots in rounds:
        attempt = _attempt_events("toolUse", usage(), roots)
        rows += attempt[:-2]
        rows += [{"type": "tool_execution_start", "toolCallId": root} for root in roots]
        children = [(root + "/1", root) for root in roots]
        if case not in ("e", "f"):
            if case == "b":
                children.append(("call_1/1/1", "call_1/1"))
            children.append(("call_1/2", "call_1"))
        if case == "c":
            children.append(("orphan-child", "absent-parent"))
        rows += [{"type": "tool_execution_start", "toolCallId": child, "parentToolCallId": parent} for child, parent in children]
        rows += [{"type": "tool_execution_update", "toolCallId": child, "parentToolCallId": parent,
                  "result": {"content": "synthetic update"}} for child, parent in children]
        rows += [{"type": "tool_execution_end", "toolCallId": child, "parentToolCallId": parent,
                  "result": {"usage": usage(999, 999, 999, 999)}} for child, parent in reversed(children)]
        rows += [{"type": "tool_execution_end", "toolCallId": root} for root in roots]
        for root in roots:
            reported = [child for child, _ in children if child.startswith(root + "/")]
            if case == "d":
                reported = reported[:1]
            rows += tool_result_events({"role": "toolResult", "toolCallId": root, "usage": usage(2, 1, 1, 1),
                                        "nestedCalls": {"complete": case != "d", "calls": [
                                            {"id": child, "status": "ok"} for child in reported]}})
        rows.append(attempt[-2])
    rows += _attempt_events("stop", usage()) + [{"type": "agent_settled", "aborted": False}]
    return rows


def f3_stream_rows(nonmonotonic: bool = False) -> list[dict]:
    return [header(), {"type": "agent_start"},
            {"type": "message_start", "message": assistant("pending", usage(0, 0, 0, 0))},
            {"type": "message_update", "usage": usage(0, 6, 0, 0)},
            {"type": "message_update", "usage": usage(0, 10, 0, 0)},
            *([{"type": "message_update", "usage": usage(0, 8, 0, 0)}] if nonmonotonic else [])]


def f4_rows() -> list[dict]:
    return [header(), *_attempt_events("error", usage(0, 0, 0, 0)),
            *_attempt_events("stop", usage(9, 1, 1, 1)), {"type": "agent_settled", "aborted": False}]


def f6_tail_rows(case: str) -> list[dict]:
    rows = [header(), *_attempt_events("stop", usage()), {"type": "agent_settled", "aborted": False}]
    if case == "allowed":
        rows += [{"type": "queue_update"}, {"type": "session_info_changed"}, {"type": "thinking_level_changed"},
                 {"type": "entry_appended", "entry": {"id": "custom-1", "type": "custom", "data": {"usage": 987654}}}]
    elif case == "two_prompts":
        rows += _attempt_events("stop", usage()) + [{"type": "agent_settled", "aborted": False}]
    elif case == "none":
        rows.pop()
    elif case == "unknown":
        rows += [{"type": "synthetic_future_event"}]
    else:
        rows += [{"type": case}]
    return rows


def f12_events(case: str) -> list[dict]:
    rows = [header()]
    if case == "inflight":
        return f3_stream_rows()
    if case == "states":
        for stop in ("stop", "length", "toolUse", "error", "aborted", "deferred"):
            rows += _attempt_events(stop, usage())
        return rows + [{"type": "agent_settled", "aborted": False}]
    if case == "terminal_only":
        return [header(), {"type": "message_end", "message": assistant()}, {"type": "agent_settled", "aborted": False}]
    if case == "orphan_tool":
        return [header(), {"type": "tool_execution_end", "toolCallId": "call_0"},
                *tool_result_events({"role": "toolResult", "toolCallId": "call_0", "usage": usage()}),
                {"type": "agent_settled", "aborted": False}]
    rounds = 2 if case == "two_owners" else 1
    for _ in range(rounds):
        rows += _attempt_events("toolUse", usage(), ("call_0",))[:-2]
        if case != "proposed":
            for _ in range(2 if case == "reused" else 1):
                rows += [{"type": "tool_execution_start", "toolCallId": "call_0"}]
                if case != "unfinished":
                    rows += [{"type": "tool_execution_end", "toolCallId": "call_0", "isError": False},
                             *tool_result_events({"role": "toolResult", "toolCallId": "call_0", "isError": False})]
    return rows + [{"type": "agent_settled", "aborted": False}]


def f13_rows(case: str) -> list[dict]:
    rows = [header(), *_attempt_events("stop", usage())]
    warm = {"type": "entry_appended", "entry": entry("warm", "usage", kind="cache_warm", provider="openai",
                                                               model="synthetic-model", usage=usage(5, 1, 30, 4))}
    boundary = {"type": "entry_appended", "entry": entry("boundary", "compaction", fromHook=True, usage=usage(20, 5, 3, 2))}
    if case == "b":
        # 常规压缩必须在末个 settled 之前，边界草稿位于 turn_end 之后。
        rows[-1:-1] = [boundary, boundary, {"type": "compaction_start"},
                       {"type": "compaction_end", "result": {"usage": usage(8, 2, 1, 1)}}]
    rows.append({"type": "agent_settled", "aborted": False})
    if case == "a":
        rows.append(warm)
    elif case == "c":
        rows.append({"type": "entry_appended", "entry": entry("unknown", "future-type", usage=usage(987654, 987654, 987654, 987654))})
    elif case == "d":
        warm["entry"]["note"] = "PRIVATE_ENTRY_NOTE"
        boundary["entry"].update(summary="PRIVATE_ENTRY_SUMMARY", details="PRIVATE_ENTRY_DETAILS", systemMessage="PRIVATE_ENTRY_SYSTEM")
        rows[-1:-1] = [boundary]
        rows += [warm,
                 {"type": "entry_appended", "entry": entry("custom", "custom", customType="PRIVATE_ENTRY_CUSTOM",
                                                          data={"usage": usage(987654, 987654, 987654, 987654), "text": "PRIVATE_ENTRY_DATA"})},
                 {"type": "entry_appended", "entry": entry("custom-message", "custom_message", content="PRIVATE_ENTRY_CONTENT")}]
    return rows


def f5_sources(tmp_path: Path, case: str) -> list[dict]:
    parent_path, child_path = tmp_path / "parent.jsonl", tmp_path / "child.jsonl"
    original = entry("a1", message=assistant())
    parent_rows = [header("parent")] if case in ("duplicate_empty", "lineage_empty") else [header("parent"), original]
    child_rows = [header("child"), original]
    if case.startswith("lineage") or case == "parent_not_selected":
        child_rows[0]["parentSession"] = str(parent_path if case != "parent_not_selected" else tmp_path / "not-selected.jsonl")
        child_rows.append(entry("a2", parent="a1", message=assistant(tokens=usage(4, 3, 2, 1))))
        if case == "lineage_conflict":
            child_rows[1] = entry("a1", message=assistant(tokens=usage(101, 20, 40, 10)))
    if case == "duplicate_not_contained":
        child_rows.append(entry("unique", parent="a1", message=assistant(tokens=usage(4, 3, 2, 1))))
    if case == "double_capture":
        child_rows = [header("parent"), *_attempt_events("stop", usage()), {"type": "agent_settled", "aborted": False}]
    if case not in ("duplicate_missing", "lineage_missing"):
        write_jsonl(parent_path, parent_rows)
        if case in ("duplicate_partial", "lineage_partial"):
            with parent_path.open("ab") as stream:
                stream.write(b"bad-json\n")
    write_jsonl(child_path, child_rows)
    sources = [source(parent_path, "P"), source(child_path, "C", kind="pi-json-events" if case == "double_capture" else "pi-session-v3")]
    if case.startswith("duplicate"):
        sources[1]["duplicate_of"] = {"source": "P", "basis": "synthetic-containment"}
    if case == "lineage_chain":
        sources[1]["duplicate_of"] = {"source": "P", "basis": "synthetic-chain"}
        other = write_jsonl(tmp_path / "other.jsonl", [header("other"), entry("d", message=assistant())])
        sources.append(source(other, "D", duplicate_of={"source": "C", "basis": "synthetic-chain"}))
    return sources[1:] if case == "parent_not_selected" else sources


def f8_sources(tmp_path: Path, case: str) -> tuple[list[dict], dict]:
    parent_path = tmp_path / "parent.jsonl"
    first = entry("p1", message=assistant("toolUse", calls=("call_0",)))
    if case == "lineage_unknown_history":
        first["message"]["usage"] = usage(0, 0, 0, 0)
    result = {"role": "toolResult", "toolCallId": "call_0", "usage": usage(20, 10, 5, 5),
              "nestedCalls": {"calls": [{"id": "nested-1", "status": "ok"}], "complete": True}}
    if case == "absent":
        del result["usage"]
    elif case == "partial":
        result["nestedCalls"]["complete"] = False
    elif case == "parent_unknown":
        result["usage"]["cacheRead"] = 0
    parent_rows = [header("parent"), first, entry("t1", parent="p1", message=result)]
    if case == "reused":
        parent_rows += [entry("p2", parent="t1", message=assistant("toolUse", calls=("call_0",))),
                        entry("t2", parent="p2", message=result)]
    write_jsonl(parent_path, parent_rows)
    sources = [source(parent_path, "P")]
    two = case in ("two_equal", "two_mismatch", "two_unknown")
    values = [usage(12, 6, 3, 2), usage(8, 4, 2, 3)] if two else [usage(20, 10, 5, 5)]
    if case in ("mismatch", "lineage_mismatch"):
        values[0] = usage(21, 10, 5, 5)
    elif case == "two_mismatch":
        values[1] = usage(9, 3, 2, 3)
    elif case == "two_unknown":
        values[1] = usage(8, 4, 0, 3)
    for index, tokens in enumerate(values):
        sid = "C" + str(index + 1)
        child_path = tmp_path / (sid + ".jsonl")
        child_rows = [header(sid)]
        if case.startswith("lineage"):
            child_rows[0]["parentSession"] = str(parent_path)
            copied = first if case != "lineage_conflict" else entry("p1", message=assistant(tokens=usage(101, 20, 40, 10)))
            child_rows.append(copied)
        elif case == "parent_not_selected":
            child_rows[0]["parentSession"] = str(tmp_path / "not-selected.jsonl")
        child_rows.append(entry("c-new", message=assistant("error" if case == "child_partial" else "stop", tokens)))
        if case != "child_missing":
            write_jsonl(child_path, child_rows)
        annotations = {} if case == "undeclared" else {"nested_of": {"source": "P", "tool_call_id": "absent" if case == "missing_id" else "call_0", "basis": "synthetic-nesting"}}
        sources.append(source(child_path, sid, **annotations))
    return sources, {"all_nested_children_declared": case not in ("undeclared", "flag_false")}


def timing(start: str | None = "2026-10-30T00:00:00Z", end: str | None = "2026-10-30T00:00:10Z", **extra) -> dict:
    annotation = {"origin": "external", "basis": "synthetic-clock", **extra}
    if start is not None:
        annotation["start"] = start
    if end is not None:
        annotation["end"] = end
    return annotation


def f12_nested_sources(tmp_path: Path) -> list[dict]:
    parent = [header("parent"), entry("p", message=assistant("toolUse", calls=("parent-call",))),
              entry("t", parent="p", message={"role": "toolResult", "toolCallId": "parent-call", "usage": usage(20, 10, 5, 5),
                    "nestedCalls": {"complete": True, "calls": [{"id": "n1", "status": "ok"}, {"id": "n1", "status": "ok"},
                                                               {"id": "n2", "status": "ok"}]}})]
    child = [header("child"), entry("c", message=assistant("toolUse", usage(20, 10, 5, 5), ("child-call-1", "child-call-2"))),
             entry("ct1", parent="c", message={"role": "toolResult", "toolCallId": "child-call-1"}),
             entry("ct2", parent="ct1", message={"role": "toolResult", "toolCallId": "child-call-2"})]
    return [source(write_jsonl(tmp_path / "parent.jsonl", parent), "P"),
            source(write_jsonl(tmp_path / "child.jsonl", child), "C", nested_of={"source": "P", "tool_call_id": "parent-call", "basis": "synthetic"})]


def privacy_rows(case: str, private_dir: Path) -> list[dict]:
    """F9 / F13(d)：哨兵只放禁止负载字段，不占合法用量。"""
    rows = f1_rows() if case == "F1" else f2_rows() if case == "F2" else f12_events("two_owners") if case == "F12" else f13_rows("d")
    rows[0].update(id="PRIVATE_SESSION_ID", cwd=str(private_dir), parentSession=str(private_dir / "PRIVATE_PARENT.jsonl"))
    for row in rows:
        row["errorMessage"] = "PRIVATE_ERROR"
        row["prompt"] = "PRIVATE_PROMPT"
        if "toolCallId" in row:
            row["toolCallId"] = "PRIVATE_TOOL_CALL_ID"
        if "parentToolCallId" in row:
            row["parentToolCallId"] = "PRIVATE_PARENT_TOOL_CALL_ID"
        if "args" in row:
            row["args"] = {"command": "PRIVATE_BASH_COMMAND"}
        if "result" in row:
            row["result"]["content"] = "PRIVATE_BASH_OUTPUT"
        message = row.get("message")
        if isinstance(message, dict):
            message["errorMessage"] = "PRIVATE_MESSAGE_ERROR"
            if message.get("role") == "assistant":
                message["content"] = [{"type": "text", "text": "PRIVATE_TEXT"},
                                      {"type": "thinking", "thinking": "PRIVATE_THINKING"},
                                      {"type": "toolCall", "id": "PRIVATE_TOOL_CALL_ID", "name": "PRIVATE_TOOL_NAME",
                                       "arguments": {"credential": "PRIVATE_CREDENTIAL"}}]
            else:
                message["content"] = "PRIVATE_TOOL_RESULT"
                message["toolCallId"] = "PRIVATE_TOOL_CALL_ID"
            if "usage" in message:
                message["usage"]["cost"] = {"total": 987654321}
        if "entry" in row:
            row["entry"]["id"] = "PRIVATE_ENTRY_ID_" + row["entry"]["id"]
        if row.get("type") == "message":
            row["id"] = "PRIVATE_ENTRY_ID"
    return rows
