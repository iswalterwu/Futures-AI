"""CLI（plan §2.2，AC-004-5/6、AC-005-1/2 交付入口、AC-007-3 交互向导）。

- 写命令：构造写 Service（先取锁后开库，LockBusy → 报错退出）
- 只读命令：先探测写锁——无锁直接只读 Service（空目录首启 = 内存库，不建库）；
  有锁时：serve 在跑则经其内部只读通道路由；否则等待写命令结束（≤30s）后本地读取
- 错误：业务错误输出结构化 {error:{code,message,retryable}} 并返回 1；不抛裸异常
- import：交互式向导（目标选择/确认 → 复用映射/改列）+ 统一批次生命周期（F-08）
"""
from __future__ import annotations

import argparse
import http.client
import json
import re
import socket
import sqlite3
import sys
import time
import urllib.parse
from pathlib import Path

import duckdb

from data import creds
from data.adapters.local_file.local_file_adapter import guess_mapping, parse_with_mapping
from data.fetch.on_demand import FetchError, validate_rows
from data.lock import (
    DEFAULT_SERVE_PORT,
    LockBusy,
    ensure_layout,
    lock_held,
    read_endpoint,
    remove_endpoint,
    write_endpoint,
)
from data.manifest import IMPLEMENTATIONS
from data.service import Service
from data.store.duck import utcnow
from data.store.provenance import DiffError

DEFAULT_ROOT = Path.home() / "AppData" / "Local" / "FuturesAI"

_SOURCE_ID_RE = re.compile(r"^[a-z0-9-]{1,64}$")  # 同 manifest id（plan §2.1）
READ_WAIT_S = 30  # 只读命令在写进程启停过渡窗口（尚无只读通道）内的等待上限（秒）
ROUTE_TIMEOUT_S = 10  # 单次内部路由请求超时（秒）
ROUTE_RETRY_S = 1.0  # 端点不可达/无响应后的重试间隔（秒）


def _json_out(obj):
    print(json.dumps(obj, ensure_ascii=False, default=str, indent=1))


def _err_dict(e: Exception) -> dict:
    if isinstance(e, FetchError):
        return e.to_dict()
    if isinstance(e, DiffError):
        return FetchError("validation_error", f"不可比：{e.reason}").to_dict()
    if isinstance(e, (sqlite3.Error, duckdb.Error)):
        return _db_error(e)
    return FetchError("internal", f"{type(e).__name__}: {e}").to_dict()


def _db_error(e: Exception) -> dict:
    """库错误 → 结构化 internal 错误（不抛裸异常）：锁定、文件损坏与其他库错误分开提示。"""
    low = str(e).lower()
    if isinstance(e, sqlite3.OperationalError) and "locked" in low:
        text = f"目录库正被其他连接锁定，请稍后重试：{e}"
    elif "not a database" in low or "not a valid duckdb" in low:
        text = f"数据库不可读（文件可能损坏）：{e}"
    else:
        text = f"数据库错误：{e}"
    return FetchError("internal", text).to_dict()


def _route_timeout() -> TimeoutError:
    return TimeoutError("只读通道响应超时（超出统一截止时间）")


def internal_get(root: Path, path: str, params: dict, timeout: float = ROUTE_TIMEOUT_S):
    """经持锁进程的内部只读端点查询；HTTP 400 的结构化错误还原为 FetchError。

    端点文件已消失、HTTP 503（关闭屏障：通道即将停止）→ ConnectionError，由调用方按“通道不可用”等待。
    timeout 是整次请求的上限：单次 socket 超时取剩余时间，响应体逐段核对截止时间。
    """
    ep = read_endpoint(root / "data")
    if not ep:
        raise ConnectionError("端点文件已消失（写进程正在退出）")
    deadline = time.monotonic() + timeout
    qs = urllib.parse.urlencode(params)
    conn = http.client.HTTPConnection("127.0.0.1", ep["port"], timeout=max(0.01, timeout))
    try:
        conn.connect()
        sock = conn.sock
        conn.request(
            "GET", path + (f"?{qs}" if qs else ""), headers={"Authorization": f"Bearer {ep['token']}"}
        )
        resp = conn.getresponse()
        body = bytearray()
        while True:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise _route_timeout()
            sock.settimeout(remaining)  # 用保存的引用：will_close 时 conn.sock 会变 None
            chunk = resp.read1(65536)  # 至多一次系统调用：每段数据之间都重新核对剩余时间
            if not chunk:
                if time.monotonic() >= deadline:
                    raise _route_timeout()
                break
            body.extend(chunk)
    except TimeoutError as e:
        if time.monotonic() >= deadline:
            raise _route_timeout() from e
        raise ConnectionError(f"只读通道读取失败：{e}") from e
    except (OSError, http.client.HTTPException) as e:
        if time.monotonic() >= deadline:
            raise _route_timeout() from e
        raise ConnectionError(f"只读通道读取失败：{e}") from e
    finally:
        conn.close()
    if resp.status == 503:
        raise ConnectionError("只读通道正在关闭")
    text = bytes(body).decode("utf-8") if body else ""
    if resp.status >= 400:
        try:
            err = json.loads(text)["error"]
        except Exception:
            raise FetchError("internal", f"内部路由 HTTP {resp.status}")
        raise FetchError(err.get("code", "internal"), err.get("message", ""))
    return json.loads(text)


def _lock_held(root: Path) -> bool:
    return lock_held(root / "data")  # R9-02：陈旧锁回收，真实持锁才路由


def _route_readonly(root: Path, args, timeout: float = ROUTE_TIMEOUT_S) -> object:
    if args.cmd == "list":
        path = {"series": "/internal/search", "sources": "/internal/sources", "jobs": "/internal/jobs"}
        return internal_get(root, path[args.what], {}, timeout=timeout)
    if args.cmd == "jobs":
        return internal_get(root, "/internal/jobs", {}, timeout=timeout)
    if args.cmd == "reconcile":
        return internal_get(root, "/internal/reconcile", {"series_id": args.series_id}, timeout=timeout)
    if args.cmd == "provenance":
        return internal_get(root, "/internal/provenance", {"series_id": args.series_id}, timeout=timeout)
    return internal_get(root, "/internal/diff", {"a": args.run_a, "b": args.run_b}, timeout=timeout)


def _readonly(root: Path, args) -> int:
    """只读命令（plan §2.2）：无写锁 → 本地只读；有写锁 → 经持锁进程的只读通道路由。

    写进程启停过渡窗口内尚无端点、端点不可达/无响应/正在关闭、本地开库恰逢写进程开库（竞态）
    均继续等待：端点可用即路由、写锁释放即本地读取；全部受同一截止时间约束。
    """
    deadline = time.monotonic() + READ_WAIT_S
    route_err = busy_err = None
    retry_at = 0.0
    while True:
        if _lock_held(root):
            remaining = deadline - time.monotonic()
            if read_endpoint(root / "data") and time.monotonic() >= retry_at and remaining > 0:
                try:
                    payload = _route_readonly(root, args, timeout=min(ROUTE_TIMEOUT_S, remaining))
                except FetchError as e:
                    _json_out(e.to_dict())
                    return 1
                except OSError as e:
                    route_err, retry_at = e, time.monotonic() + ROUTE_RETRY_S
                except Exception as e:
                    print(f"错误：内部路由失败: {e}", file=sys.stderr)
                    return 1
                else:
                    _json_out(payload)
                    return 0
        else:
            try:
                svc = Service(root, readonly=True)
            except LockBusy as e:
                svc, busy_err = None, e  # 写进程开库中或外部进程占用 → 继续等待/重试
            except Exception as e:
                _json_out(_err_dict(e))
                return 1
            if svc is not None:
                try:
                    svc.init()
                    payload = _local_readonly(svc, args)
                except Exception as e:  # 业务错误/不可比/库错误/意外错误 → 结构化输出
                    _json_out(_err_dict(e))
                    return 1
                finally:
                    svc.close()
                _json_out(payload)
                return 0
        if time.monotonic() >= deadline:
            if route_err is not None:
                msg = f"错误：写进程运行中，只读通道无响应（{route_err}），请稍后重试"
            elif busy_err is not None and not _lock_held(root):
                msg = f"错误：{busy_err}"
            else:
                msg = "错误：写进程运行中且尚未提供只读通道，请稍后重试"
            print(msg, file=sys.stderr)
            return 1
        time.sleep(0.2)


def _local_readonly(svc: Service, args) -> object:
    if args.cmd == "list":
        if args.what == "series":
            return svc.search("")
        if args.what == "sources":
            return svc.list_sources()
        return {"jobs": svc.list_jobs()}
    if args.cmd == "jobs":
        return {"jobs": svc.list_jobs()}
    if args.cmd == "reconcile":
        return svc.reconcile(args.series_id)
    if args.cmd == "provenance":
        return svc.provenance(args.series_id)
    return svc.diff(args.run_a, args.run_b)


def _choose_import_target(svc: Service, series: str | None, source: str | None) -> dict | None:
    """导入目标 = implementation=local-file 的启用源所声明的序列；多目标交互选择。"""
    targets = svc.import_targets()
    if series:
        targets = [t for t in targets if t["series_id"] == series]
    if source:
        targets = [t for t in targets if t["source"] == source]
    if not targets:
        print(
            "错误：无可导入目标（需要 implementation: local-file 的已启用源声明该序列）",
            file=sys.stderr,
        )
        return None
    if len(targets) == 1:
        t = targets[0]
    else:
        for i, cand in enumerate(targets, 1):
            print(f"  [{i}] {cand['display']}（源 {cand['source']}，{cand['unit']}/{cand['freq']}/{cand['tz']}）")
        ans = input(f"选择目标序列 [1-{len(targets)}]: ").strip()
        if not ans.isdigit() or not 1 <= int(ans) <= len(targets):
            print("错误：无效选择", file=sys.stderr)
            return None
        t = targets[int(ans) - 1]
    ok = input(
        f"目标序列: {t['display']}（{t['series_id'][:12]}…，源 {t['source']}）确认？[y/n] "
    ).strip().lower()
    if ok not in ("y", ""):
        print("已取消", file=sys.stderr)
        return None
    return t


def _import_wizard(svc: Service, fpath: Path, series: str | None = None, source: str | None = None) -> int:
    """交互导入（F-08）：目标选择/确认 → 批次先建 → 复用映射/读取/解析全部纳入批次生命周期。"""
    import pandas as pd

    cat = svc.cat
    t = _choose_import_target(svc, series, source)
    if t is None:
        return 1
    sid, src = t["series_id"], t["source"]

    # F-08：批次先建（目标已知），此后任何读取/解析失败都记 failed。
    # 只读通道线程与向导共用连接：每段数据访问持访问锁，等待用户输入时不持锁。
    with svc.access_lock:
        rid = svc.store.new_run(src, sid, None, None, t["unit"], t["freq"], t["tz"])
    try:
        with svc.access_lock:
            reuse = cat.con.execute(
                "SELECT id, column_map_json FROM import_maps ORDER BY id"
            ).fetchall()
        mapping = None
        if reuse:
            want = input(f"发现已有映射模板 {[r[0] for r in reuse]}，复用？[y/n] ").strip().lower()
            if want == "y":
                chosen = input(f"选择模板 id（{reuse[0][0]}）: ").strip() or reuse[0][0]
                with svc.access_lock:
                    row = cat.con.execute(
                        "SELECT column_map_json FROM import_maps WHERE id=?", [chosen]
                    ).fetchone()
                if row:
                    mapping = json.loads(row[0])
        if mapping is None:
            df = pd.read_csv(fpath) if fpath.suffix.lower() == ".csv" else pd.read_excel(fpath)
            mapping = guess_mapping(df)
            print(f"猜测映射: {mapping}")
            adjust = input("确认？[y/修改: date_col=列名,value_col=列名] ").strip()
            if adjust and adjust.lower() != "y":
                for part in adjust.split(","):
                    k, _, v = part.partition("=")
                    mapping[k.strip()] = v.strip()
        print(f"使用映射: {mapping}")

        rows, raw = parse_with_mapping(str(fpath), mapping, tz=t["tz"])
        validate_rows(rows)
        range_start = min((ts for ts, _ in rows), default=None)
        range_end = max((ts for ts, _ in rows), default=None)
        with svc.access_lock:
            svc.store.con.execute(
                "UPDATE ingest_runs SET range_start=?, range_end=? WHERE ingest_run=?",
                [range_start, range_end, rid],
            )
            svc.store.commit_run(
                rid,
                [(sid, ts, v, t["unit"], src, utcnow()) for (ts, v) in rows],
                payload_hash=_hash_bytes(raw),
            )
    except BaseException as e:  # 含向导中 Ctrl+C：批次标 failed 后，退出类异常原样传播
        try:
            with svc.access_lock:
                svc.store.fail_run(rid)
        except Exception:
            pass
        if not isinstance(e, Exception):
            raise
        print(f"导入失败: {e}", file=sys.stderr)
        return 1
    with svc.access_lock:
        cat.con.execute(
            "INSERT OR REPLACE INTO import_maps VALUES (?,?,?)",
            ["user_csv", str(fpath), json.dumps(mapping, ensure_ascii=False)],
        )
        cat.con.commit()
    print(f"已入库 {len(rows)} 行（源 {src}），映射已保存")
    return 0


def _hash_bytes(raw: bytes) -> str:
    """F-12：原始载荷哈希 = 原始字节 SHA-256。"""
    import hashlib

    return hashlib.sha256(raw).hexdigest()


def _skeleton(source_id: str, implementation: str | None) -> str:
    """清单骨架（plan §2.2）：除 provides 外字段齐全；provides 待填（填写前该源登记为 error 并给出原因）。

    id/name 以 JSON 字符串写出（YAML 兼容），避免 123、null 等被解析为非字符串；
    eia 凭证引用名按凭证名规则截断到 64 字符以内。
    """
    if implementation == "eia":
        ref = source_id.replace("-", "_")[:60] + "_key"
        cred = f"{{kind: api_key, credential_ref: {ref}}}"
    else:
        cred = "none"
    impl_line = (
        f"implementation: {implementation}\n"
        if implementation
        else "# implementation: akshare      # 可选：akshare | eia | local-file；缺省 = 仅声明源（不可取数）\n"
    )
    quoted = json.dumps(source_id)
    return (
        f"id: {quoted}\n"
        f"name: {quoted}\n"
        "version: 1\n"
        f"credentials: {cred}\n"
        f"{impl_line}"
        "provides: []   # 待填：至少一项（字段契约见 specs/data-layer/plan.md §2.1），示例：\n"
        "#  - descriptor: {asset: sc, geo: cn, measure: close, contract: SC2401}\n"
        '#    symbols: ["SC2401"]\n'
        "#    unit: cny_bbl\n"
        "#    freq: 1d\n"
        "#    tz: Asia/Shanghai\n"
        "#    priority: 100\n"
        "#    fetch: {modes: [on_demand], history_days: 3650}\n"
        "#    update: {lag_min: 0, revises: true}\n"
    )


def _port(v: str) -> int:
    n = int(v)
    if not 1 <= n <= 65535:
        raise argparse.ArgumentTypeError("端口须在 1–65535")
    return n


def _install_exit_signals() -> None:
    """uvicorn 优雅退出后会重新触发所捕获的信号；SIGBREAK/SIGTERM 的默认动作是直接终止进程
    （跳过清理）→ 改为抛 KeyboardInterrupt，走 finally 删除端点文件并释放写锁。"""
    import signal

    def _raise(signum, frame):
        raise KeyboardInterrupt

    for name in ("SIGBREAK", "SIGTERM"):
        sig = getattr(signal, name, None)
        if sig is None:
            continue
        try:
            signal.signal(sig, _raise)
        except (ValueError, OSError):
            pass


def _serve(root: Path, port: int) -> int:
    from data import mcp_server
    import secrets

    try:
        svc = Service(root)
    except LockBusy as e:
        print(f"错误：{e}", file=sys.stderr)
        return 1
    except Exception as e:
        _json_out(_err_dict(e))
        return 1
    try:
        try:
            svc.init()
        except Exception as e:
            _json_out(_err_dict(e))
            return 1
        for e in svc.manifest_errors:  # AC-001-2：清单校验失败启动即报告
            print(f"清单校验失败（已隔离）：{e['reason']}", file=sys.stderr)
        token = secrets.token_hex(16)
        mcp = mcp_server.build_mcp(svc, token, port=port)
        _install_exit_signals()
        write_endpoint(root / "data", port, token)
        print(  # 运行日志 → stderr（stdout 只留给结构化输出）
            f"MCP + 内部只读通道启动中: http://127.0.0.1:{port}/mcp（Bearer 令牌见 data/mcp_endpoint.json）",
            file=sys.stderr,
        )
        try:
            mcp.run(transport="streamable-http")
        except KeyboardInterrupt:
            pass
        except SystemExit as e:  # uvicorn 启动失败（如端口被占）以 sys.exit 退出
            if e.code not in (0, None):
                _json_out(FetchError(
                    "internal", f"serve 启动失败（端口 {port} 可能已被占用，退出码 {e.code}）"
                ).to_dict())
                return 1
        finally:
            try:
                remove_endpoint(root / "data", token)
            except OSError:
                pass  # 残留端点由读者按“不可达 → 等待写锁释放”处理，不影响正常停服
    finally:
        svc.close()
    return 0


def main(argv=None) -> int:
    args = _parser().parse_args(argv)  # 用法错误由 argparse 报用法（SystemExit）
    try:
        return _dispatch(args)
    except Exception as e:  # 最外层统一出口：未分类异常 → 结构化 internal（plan §2.2）
        _json_out(_err_dict(e))
        return 1


def _parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="futureai-data")
    p.add_argument("--root", default=str(DEFAULT_ROOT))
    sub = p.add_subparsers(dest="cmd", required=True)

    srv = sub.add_parser("serve")
    srv.add_argument("--port", type=_port, default=DEFAULT_SERVE_PORT)

    cfg = sub.add_parser("config")
    cfg_sub = cfg.add_subparsers(dest="cfg_cmd", required=True)
    c_alias = cfg_sub.add_parser("alias")
    c_alias.add_argument("symbol"); c_alias.add_argument("adapter_id"); c_alias.add_argument("series_id")
    c_prio = cfg_sub.add_parser("priority")
    c_prio.add_argument("series_id"); c_prio.add_argument("source_id"); c_prio.add_argument("priority", type=int)
    c_cred = cfg_sub.add_parser("credentials")
    c_cred.add_argument("name")
    c_cred.add_argument(
        "secret", nargs="?", default=None,
        help="建议省略：省略则不回显交互输入；显式传入仅供脚本化场景，可能留在 shell 历史或进程参数中",
    )
    c_src = cfg_sub.add_parser("add-source")
    c_src.add_argument("id")
    c_src.add_argument("--implementation", choices=sorted(IMPLEMENTATIONS), default=None)
    c_en = cfg_sub.add_parser("enable"); c_en.add_argument("source_id")
    c_dis = cfg_sub.add_parser("disable"); c_dis.add_argument("source_id")

    f = sub.add_parser("fetch")
    f.add_argument("series_id"); f.add_argument("--start"); f.add_argument("--end"); f.add_argument("--source")

    l = sub.add_parser("list")
    l.add_argument("what", choices=["series", "sources", "jobs"])

    j = sub.add_parser("jobs")
    j_sub = j.add_subparsers(dest="job_cmd", required=True)
    jr = j_sub.add_parser("register")
    jr.add_argument("name"); jr.add_argument("adapter_id"); jr.add_argument("series_id")
    j_sub.add_parser("list")
    jrun = j_sub.add_parser("run"); jrun.add_argument("name")

    r = sub.add_parser("reconcile"); r.add_argument("series_id")

    im = sub.add_parser("import")
    im.add_argument("file")
    im.add_argument("--series", default=None, help="目标序列 id（缺省交互选择）")
    im.add_argument("--source", default=None, help="目标源 id（implementation: local-file）")

    pr = sub.add_parser("provenance"); pr.add_argument("series_id")

    d = sub.add_parser("diff"); d.add_argument("run_a", type=int); d.add_argument("run_b", type=int)
    return p


def _dispatch(args) -> int:
    root = Path(args.root)
    ensure_layout(root)

    if args.cmd == "serve":
        return _serve(root, args.port)

    # 凭证：只写 creds/（不涉及数据库，不取写锁）；省略 secret → 不回显交互输入
    if args.cmd == "config" and args.cfg_cmd == "credentials":
        secret = args.secret
        if secret is None:
            import getpass

            secret = getpass.getpass(f"输入凭证 {args.name}（不回显）: ")
        try:
            creds.put(root / "creds", args.name, secret)
        except creds.CredsError as e:
            print(f"错误：{e}", file=sys.stderr)
            return 1
        print("ok")
        return 0

    # 只读命令：无锁 → 本地只读；有锁 → 内部路由（含 jobs list，R2-04）
    readonly_cmds = {"list", "reconcile", "provenance", "diff"}
    is_readonly = args.cmd in readonly_cmds or (args.cmd == "jobs" and args.job_cmd == "list")

    if is_readonly:
        return _readonly(root, args)

    # 写命令：构造写 Service（先锁后库）
    try:
        svc = Service(root)
    except LockBusy as e:  # 另一写进程持锁，或观测库正被其他进程打开（重试后仍占用）
        print(f"错误：{e}（serve 或其他写命令运行中？）", file=sys.stderr)
        return 1
    except Exception as e:
        _json_out(_err_dict(e))
        return 1
    try:
        svc.init()
        return _run_write(svc, root, args)
    except Exception as e:  # 业务错误/库错误/意外错误 → 结构化输出（不抛裸异常）
        _json_out(_err_dict(e))
        return 1
    finally:
        svc.close()


def _run_write(svc: Service, root: Path, args) -> int:
    if args.cmd == "fetch":
        res = svc.fetch(args.series_id, args.start, args.end, do_fetch=True, source=args.source)
        _json_out({"series_id": res["series_id"], "count": res["meta"]["count"]})
    elif args.cmd == "jobs":
        if args.job_cmd == "register":
            svc.jobs.register(args.name, args.adapter_id, args.series_id)
            print("registered")
        else:
            _json_out(svc.jobs.run(args.name))
    elif args.cmd == "import":
        return _import_wizard(svc, Path(args.file), args.series, args.source)
    elif args.cfg_cmd == "alias":
        print(svc.set_alias(args.symbol, args.adapter_id, args.series_id))
    elif args.cfg_cmd == "priority":
        svc.set_priority(args.series_id, args.source_id, args.priority)
        print("ok")
    elif args.cfg_cmd in ("enable", "disable"):
        svc.set_source_enabled(args.source_id, args.cfg_cmd == "enable")
        print("ok")
    else:
        return _add_source(svc, root, args.id, args.implementation)
    return 0


def _add_source(svc: Service, root: Path, source_id: str, implementation: str | None) -> int:
    """AC-004-5：新增源 = 在用户适配器目录生成清单骨架。"""
    if not _SOURCE_ID_RE.match(source_id):
        print("错误：源 id 须匹配 [a-z0-9-]{1,64}", file=sys.stderr)
        return 1
    with svc.access_lock:
        row = svc.cat.source_row(source_id)
    if row is not None and row[1] != "disabled":
        print(f"错误：源 {source_id} 已存在", file=sys.stderr)
        return 1
    target = root / "adapters" / source_id
    if (target / "manifest.yaml").exists():
        print("错误：该源已存在", file=sys.stderr)
        return 1
    target.mkdir(parents=True, exist_ok=True)
    (target / "manifest.yaml").write_text(_skeleton(source_id, implementation), encoding="utf-8")
    print(
        f"manifest 骨架已写入 {target / 'manifest.yaml'}；填写 provides 后重启生效"
        "（填写前该源显示为 error，原因见 list sources）"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
