"""CLI（plan §2.2，AC-004-5/6、AC-005-1/2 交付入口、AC-007-3 交互向导）。

- 写命令：构造写 Service（先取锁后开库，LockBusy → 报错退出）
- 只读命令：先探测写锁——无锁直接只读 Service；有锁（serve 运行中）经内部 HTTP 路由（AC-004-6）
- import：交互式向导（确认/改列/复用映射）+ 统一批次生命周期（F-08）
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

from data import creds
from data.adapters.local_file.local_file_adapter import guess_mapping, parse_with_mapping
from data.catalog.descriptor import derive_id
from data.fetch.on_demand import FetchError, validate_rows
from data.lock import LockBusy, ensure_layout, read_endpoint, write_endpoint
from data.store.duck import utcnow
from data.service import Service

DEFAULT_ROOT = Path.home() / "AppData" / "Local" / "FuturesAI"


def _json_out(obj):
    print(json.dumps(obj, ensure_ascii=False, default=str, indent=1))


def _internal_get(root: Path, path: str, params: dict):
    ep = read_endpoint(root / "data")
    if not ep:
        raise FetchError("internal", "serve 未运行且未发现端点文件")
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"http://127.0.0.1:{ep['port']}{path}?{qs}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {ep['token']}"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _lock_held(root: Path) -> bool:
    return (root / "data" / ".lock").exists()


def _import_wizard(svc: Service, root: Path, fpath: Path) -> int:
    """交互导入（F-08）：目标确认 → 批次先建 → 复用映射/读取/解析全部纳入批次生命周期。"""
    import pandas as pd

    cat = svc.cat

    # 目标确认（v1 目标 = local-file 清单声明的 crude/world/close）
    sid = derive_id({"asset": "crude", "geo": "world", "measure": "close", "contract": ""})
    decls = cat.source_declarations(sid)
    decl = decls.get("local-file")
    if decl is None:
        print("错误：local-file 适配器未注册目标序列", file=sys.stderr)
        return 1
    ok = input(f"目标序列: {sid[:12]}…（crude/world/close，local-file 源）确认？[y/n] ").strip().lower()
    if ok not in ("y", ""):
        print("已取消", file=sys.stderr)
        return 1

    # F-08：批次先建（目标已知），此后任何读取/解析失败都记 failed
    rid = svc.store.new_run("local-file", sid, None, None, decl["unit"], decl["freq"], decl["tz"])
    try:
        reuse = cat.con.execute(
            "SELECT id, column_map_json FROM import_maps ORDER BY id"
        ).fetchall()
        mapping = None
        if reuse:
            want = input(f"发现已有映射模板 {[r[0] for r in reuse]}，复用？[y/n] ").strip().lower()
            if want == "y":
                chosen = input(f"选择模板 id（{reuse[0][0]}）: ").strip() or reuse[0][0]
                row = cat.con.execute(
                    "SELECT column_map_json FROM import_maps WHERE id=?", [chosen]
                ).fetchone()
                if row:
                    mapping = json.loads(row[0])
        if mapping is None:
            df = pd.read_csv(fpath) if fpath.suffix == ".csv" else pd.read_excel(fpath)
            mapping = guess_mapping(df)
            print(f"猜测映射: {mapping}")
            adjust = input("确认？[y/修改: date_col=列名,value_col=列名] ").strip()
            if adjust and adjust.lower() != "y":
                for part in adjust.split(","):
                    k, _, v = part.partition("=")
                    mapping[k.strip()] = v.strip()
        print(f"使用映射: {mapping}")

        rows, raw = parse_with_mapping(str(fpath), mapping)
        validate_rows(rows)
        range_start = min((t for t, _ in rows), default=None)
        range_end = max((t for t, _ in rows), default=None)
        svc.store.con.execute(
            "UPDATE ingest_runs SET range_start=?, range_end=? WHERE ingest_run=?",
            [range_start, range_end, rid],
        )
        svc.store.commit_run(
            rid,
            [(sid, ts, v, decl["unit"], "local-file", utcnow()) for (ts, v) in rows],
            payload_hash=_hash_bytes(raw),
        )
    except Exception as e:
        svc.store.fail_run(rid)
        print(f"导入失败: {e}", file=sys.stderr)
        return 1
    cat.con.execute(
        "INSERT OR REPLACE INTO import_maps VALUES (?,?,?)",
        ["user_csv", str(fpath), json.dumps(mapping, ensure_ascii=False)],
    )
    cat.con.commit()
    print(f"已入库 {len(rows)} 行，映射已保存")
    return 0


def _hash_bytes(raw: bytes) -> str:
    """F-12：原始载荷哈希 = 原始字节 SHA-256。"""
    import hashlib

    return hashlib.sha256(raw).hexdigest()


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="futureai-data")
    p.add_argument("--root", default=str(DEFAULT_ROOT))
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("serve")

    cfg = sub.add_parser("config")
    cfg_sub = cfg.add_subparsers(dest="cfg_cmd", required=True)
    c_alias = cfg_sub.add_parser("alias")
    c_alias.add_argument("symbol"); c_alias.add_argument("adapter_id"); c_alias.add_argument("series_id")
    c_prio = cfg_sub.add_parser("priority")
    c_prio.add_argument("series_id"); c_prio.add_argument("source_id"); c_prio.add_argument("priority", type=int)
    c_cred = cfg_sub.add_parser("credentials")
    c_cred.add_argument("name"); c_cred.add_argument("secret")
    c_src = cfg_sub.add_parser("add-source")
    c_src.add_argument("id")

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

    pr = sub.add_parser("provenance"); pr.add_argument("series_id")

    d = sub.add_parser("diff"); d.add_argument("run_a", type=int); d.add_argument("run_b", type=int)

    args = p.parse_args(argv)
    root = Path(args.root)
    ensure_layout(root)

    if args.cmd == "serve":
        from data import mcp_server
        import secrets

        try:
            svc = Service(root)
        except LockBusy:
            print("错误：数据目录已被另一写进程占用", file=sys.stderr)
            return 1
        svc.init()
        token = secrets.token_hex(16)
        mcp = mcp_server.build_mcp(svc, token)
        try:
            port = mcp.settings.port
            write_endpoint(root / "data", port, token)
            print(f"MCP + 内部只读通道: http://127.0.0.1:{port} (Bearer {token})")
            mcp.run(transport="streamable-http")
        except KeyboardInterrupt:
            pass
        finally:
            svc.close()
        return 0

    # 只读命令：无锁 → 本地只读；有锁 → 内部路由（含 jobs list，R2-04）
    readonly_cmds = {"list", "reconcile", "provenance", "diff"}
    is_readonly = args.cmd in readonly_cmds or (args.cmd == "jobs" and args.job_cmd == "list")

    if is_readonly:
        if _lock_held(root):
            try:
                if args.cmd == "list":
                    if args.what == "series":
                        _json_out(_internal_get(root, "/internal/search", {}))
                    elif args.what == "sources":
                        _json_out(_internal_get(root, "/internal/sources", {}))
                    else:
                        _json_out(_internal_get(root, "/internal/jobs", {}))
                elif args.cmd == "reconcile":
                    _json_out(_internal_get(root, "/internal/reconcile", {"series_id": args.series_id}))
                elif args.cmd == "provenance":
                    _json_out(_internal_get(root, "/internal/provenance", {"series_id": args.series_id}))
                elif args.cmd == "jobs":
                    _json_out(_internal_get(root, "/internal/jobs", {}))
                else:
                    _json_out(_internal_get(root, "/internal/diff", {"a": args.run_a, "b": args.run_b}))
                return 0
            except Exception as e:
                print(f"错误：内部路由失败: {e}", file=sys.stderr)
                return 1
        svc = Service(root, readonly=True)
        svc.init()
        try:
            if args.cmd == "list":
                if args.what == "series":
                    _json_out(svc.search(""))
                elif args.what == "sources":
                    _json_out(svc.list_sources())
                else:
                    _json_out({"jobs": svc.list_jobs()})
            elif args.cmd == "jobs":
                _json_out({"jobs": svc.list_jobs()})
            elif args.cmd == "reconcile":
                _json_out(svc.reconcile(args.series_id))
            elif args.cmd == "provenance":
                _json_out(svc.provenance(args.series_id))
            else:
                _json_out(svc.diff(args.run_a, args.run_b))
            return 0
        finally:
            svc.close()

    # 写命令：构造写 Service（先锁后库）
    try:
        svc = Service(root)
    except LockBusy:
        print("错误：数据目录被另一写进程占用（serve 运行中？）", file=sys.stderr)
        return 1
    try:
        svc.init()
        if args.cmd == "fetch":
            res = svc.fetch(args.series_id, args.start, args.end, do_fetch=True, source=args.source)
            _json_out({"series_id": res["series_id"], "count": res["meta"]["count"]})
        elif args.cmd == "jobs":
            if args.job_cmd == "register":
                svc.jobs.register(args.name, args.adapter_id, args.series_id)
                print("registered")
            elif args.job_cmd == "list":
                _json_out({"jobs": svc.jobs.list()})
            else:
                _json_out(svc.jobs.run(args.name))
        elif args.cmd == "import":
            return _import_wizard(svc, root, Path(args.file))
        elif args.cmd == "config":
            if args.cfg_cmd == "alias":
                print(svc.cat.write_alias(args.symbol, args.adapter_id, args.series_id, "manual"))
            elif args.cfg_cmd == "priority":
                svc.cat.set_override(args.series_id, args.source_id, args.priority)
                svc.reg.rebuild()  # F-11：覆盖后刷新主源派生缓存与显示 ID
                print("ok")
            elif args.cfg_cmd == "credentials":
                creds.put(root / "creds", args.name, args.secret)
                print("ok")
            else:
                target = root / "adapters" / args.id
                if (target / "manifest.yaml").exists():
                    print("错误：该源已存在", file=sys.stderr)
                    return 1
                target.mkdir(parents=True, exist_ok=True)
                (target / "manifest.yaml").write_text(
                    f"id: {args.id}\nname: {args.id}\nversion: 1\nprovides: []\n",
                    encoding="utf-8",
                )
                print(f"manifest 骨架已写入 {target / 'manifest.yaml'}（provides 待填）")
    except FetchError as e:
        _json_out(e.to_dict())
        return 1
    finally:
        svc.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
