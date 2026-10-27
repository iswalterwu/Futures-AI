"""CLI（plan §2.2，AC-004-5/6、AC-005-1/2 交付入口、AC-007-3 向导）。

子命令：config | fetch | list | jobs | reconcile | import | provenance | diff | serve
单写者：写操作遇锁报错；只读命令遇锁经内部 HTTP 路由（AC-004-6）。
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
from data.catalog.db import CatalogDB
from data.fetch.on_demand import FetchError
from data.lock import LockBusy, read_endpoint, write_endpoint, write_lock
from data.manifest import ManifestError, load
from data.service import Service

DEFAULT_ROOT = Path.home() / "AppData" / "Local" / "FuturesAI"


def _service(root: Path, init: bool = True) -> Service:
    return Service(root).init() if init else Service(root)


def _json_out(obj):
    print(json.dumps(obj, ensure_ascii=False, default=str, indent=1))


def _try_lock_write(svc: Service):
    try:
        svc.acquire_write_lock()
        return True
    except LockBusy:
        print("错误：数据目录被另一写进程占用（serve 运行中？请先关闭或改用只读命令）", file=sys.stderr)
        return False


def _internal_get(root: Path, path: str, params: dict):
    ep = read_endpoint(root / "data")
    if not ep:
        raise FetchError("internal", "serve 未运行且未发现端点文件")
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"http://127.0.0.1:{ep['port']}{path}?{qs}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {ep['token']}"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))


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
    ensure = __import__("data.lock", fromlist=["ensure_layout"]).ensure_layout
    ensure(root)

    if args.cmd == "serve":
        from data import mcp_server
        from data.lock import write_lock as _wl

        svc = _service(root, init=True)
        try:
            svc.acquire_write_lock()
        except LockBusy:
            print("错误：数据目录已被另一写进程占用", file=sys.stderr)
            return 1
        import secrets

        token = secrets.token_hex(16)
        # 内部只读通道：端口 0 = 系统分配
        srv = mcp_server.start_internal(svc, 0, token)
        internal_port = srv.server_address[1]
        write_endpoint(root / "data", internal_port, token)
        print(f"内部只读通道: http://127.0.0.1:{internal_port} (token={token})")
        try:
            mcp = mcp_server.build_mcp(svc)
            print("MCP serve 启动（Ctrl+C 退出）")
            mcp.run(transport="streamable-http")
        except KeyboardInterrupt:
            pass
        finally:
            srv.shutdown()
            svc.release_write_lock()
        return 0

    svc = _service(root, init=False)

    try:
        if args.cmd == "fetch":
            svc.init()
            if not _try_lock_write(svc):
                return 1
            try:
                res = svc.fetch(args.series_id, args.start, args.end, do_fetch=True, source=args.source)
                _json_out({"series_id": res["series_id"], "count": res["meta"]["count"]})
            finally:
                svc.release_write_lock()
        elif args.cmd == "list":
            svc.init()
            if args.what == "series":
                _json_out(svc.search(""))
            elif args.what == "sources":
                _json_out(svc.list_sources())
            else:
                _json_out({"jobs": svc.jobs.list()})
        elif args.cmd == "reconcile":
            svc.init()
            _json_out(svc.reconcile(args.series_id))
        elif args.cmd == "provenance":
            svc.init()
            if (root / "data" / ".lock").exists():
                _json_out(_internal_get(root, "/internal/provenance", {"series_id": args.series_id}))
            else:
                _json_out(svc.provenance(args.series_id))
        elif args.cmd == "diff":
            svc.init()
            if (root / "data" / ".lock").exists():
                _json_out(_internal_get(root, "/internal/diff", {"a": args.run_a, "b": args.run_b}))
            else:
                _json_out(svc.diff(args.run_a, args.run_b))
        elif args.cmd == "jobs":
            svc.init()
            if args.job_cmd == "register":
                svc.jobs.register(args.name, args.adapter_id, args.series_id)
                print("registered")
            elif args.job_cmd == "list":
                _json_out({"jobs": svc.jobs.list()})
            else:
                if not _try_lock_write(svc):
                    return 1
                try:
                    _json_out(svc.jobs.run(args.name))
                finally:
                    svc.release_write_lock()
        elif args.cmd == "import":
            svc.init()
            import pandas as pd

            fpath = Path(args.file)
            df = pd.read_csv(fpath) if fpath.suffix == ".csv" else pd.read_excel(fpath)
            mp = guess_mapping(df)
            print(f"猜测映射: {mp}")
            rows = parse_with_mapping(str(fpath), mp)
            cat = CatalogDB(root / "data" / "catalog.sqlite")
            # 导入目标 = local-file 适配器的首个 provides 对应序列（crude close）
            from data.catalog.descriptor import derive_id

            sid = derive_id({"asset": "crude", "geo": "world", "measure": "close", "contract": ""})
            decls = cat.source_declarations(sid)
            decl = decls.get("local-file")
            if decl is None:
                print("错误：local-file 适配器未注册该序列", file=sys.stderr)
                return 1
            if not _try_lock_write(svc):
                return 1
            try:
                rid = svc.store.new_run("local-file", sid, None, None, decl["unit"], decl["freq"], decl["tz"])
                svc.store.commit_run(
                    rid,
                    [(sid, ts, v, decl["unit"], "local-file", datetime.now()) for (ts, v) in rows],
                )
            finally:
                svc.release_write_lock()
            # 保存映射模板（复用，AC-007-3）
            cat.con.execute(
                "INSERT OR REPLACE INTO import_maps VALUES (?,?,?)",
                ["user_csv", str(fpath), json.dumps(mp, ensure_ascii=False)],
            )
            cat.con.commit()
            print(f"已入库 {len(rows)} 行，映射已保存")
        elif args.cmd == "config":
            svc.init()
            if args.cfg_cmd == "alias":
                if not _try_lock_write(svc):
                    return 1
                try:
                    r = svc.cat.write_alias(args.symbol, args.adapter_id, args.series_id, "manual")
                    print(r)
                finally:
                    svc.release_write_lock()
            elif args.cfg_cmd == "priority":
                if not _try_lock_write(svc):
                    return 1
                try:
                    svc.cat.set_override(args.series_id, args.source_id, args.priority)
                    print("ok")
                finally:
                    svc.release_write_lock()
            elif args.cfg_cmd == "credentials":
                creds.put(root / "creds", args.name, args.secret)
                print("ok")
            else:  # add-source：写 manifest 骨架（只能配置已有清单的源 → 骨架模板）
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
