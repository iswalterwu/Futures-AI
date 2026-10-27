"""AC-004-5/6、AC-005-1/2 交付入口：CLI 全子命令与单写者路由。"""
from __future__ import annotations

import json
from datetime import datetime

import pytest

from data import cli, mcp_server
from data.catalog.db import CatalogDB
from data.service import Service

BASE = datetime(2026, 10, 1)


def run(*argv):
    args = list(argv)
    if "--root" in args:
        i = args.index("--root")
        root = args.pop(i + 1)
        args.pop(i)
        return cli.main(["--root", root, *args])
    return cli.main([*args])


from data.catalog.descriptor import derive_id

SID = derive_id({"asset": "sc", "geo": "cn", "measure": "close", "contract": ""})


def setup(tmp_path):
    svc = Service(tmp_path).init()  # registry 已注册 akshare 真实序列
    assert any(sid == SID for (_a, sid) in svc._provides)
    return svc


class TestConfig:
    def test_priority_persists(self, tmp_path):
        setup(tmp_path)
        assert run("config", "priority", SID, "akshare", "5", "--root", str(tmp_path)) == 0
        cat = CatalogDB(tmp_path / "data" / "catalog.sqlite")
        assert cat.effective_priorities(SID)["akshare"] == 5

    def test_alias_persists(self, tmp_path):
        setup(tmp_path)
        assert run("config", "alias", "MY_SYM", "akshare", SID, "--root", str(tmp_path)) == 0
        cat = CatalogDB(tmp_path / "data" / "catalog.sqlite")
        assert cat.resolve_alias("MY_SYM", "akshare") == SID

    def test_credentials_roundtrip(self, tmp_path):
        assert run("config", "credentials", "eia_api_key", "sk-test-12345678", "--root", str(tmp_path)) == 0
        from data import creds

        assert creds.get(tmp_path / "creds", "eia_api_key") == "sk-test-12345678"

    def test_add_source_skeleton_and_dup(self, tmp_path):
        assert run("config", "add-source", "my-src", "--root", str(tmp_path)) == 0
        assert (tmp_path / "adapters" / "my-src" / "manifest.yaml").is_file()
        assert run("config", "add-source", "my-src", "--root", str(tmp_path)) == 1  # 已存在


class TestJobs:
    def test_register_list_run(self, tmp_path, monkeypatch):
        svc = setup(tmp_path)
        from data.adapters.akshare import akshare_adapter as ak_mod

        df = __import__("pandas").DataFrame({"日期": ["2026-10-01"], "收盘价": [1.0]})
        monkeypatch.setattr(ak_mod, "_get_data", lambda symbol: df)
        assert run("jobs", "register", "daily-sc", "akshare", SID, "--root", str(tmp_path)) == 0
        assert run("jobs", "list", "--root", str(tmp_path)) == 0
        assert run("jobs", "run", "daily-sc", "--root", str(tmp_path)) == 0
        # 但 jobs.run 用 source=akshare 取 s1——akshare 适配器 fetch 返回 mock 数据
        assert svc.store.count_obs(SID) == 1


class TestFetchAndList:
    def test_fetch_cli(self, tmp_path, monkeypatch):
        setup(tmp_path)
        from data.adapters.akshare import akshare_adapter as ak_mod

        df = __import__("pandas").DataFrame({"日期": ["2026-10-01"], "收盘价": [1.0]})
        monkeypatch.setattr(ak_mod, "_get_data", lambda symbol: df)
        assert run("fetch", SID, "--root", str(tmp_path)) == 0

    def test_list_series_sources(self, tmp_path, capsys):
        setup(tmp_path)
        assert run("list", "sources", "--root", str(tmp_path)) == 0
        assert run("list", "series", "--root", str(tmp_path)) == 0
        out = capsys.readouterr().out
        assert "akshare" in out


class TestImport:
    def test_import_csv(self, tmp_path):
        svc = setup(tmp_path)
        f = tmp_path / "p.csv"
        f.write_text("日期,收盘价\n2026-10-01,70.5\n", encoding="utf-8")
        assert run("import", str(f), "--root", str(tmp_path)) == 0
        cat = CatalogDB(tmp_path / "data" / "catalog.sqlite")
        maps = cat.con.execute("SELECT id FROM import_maps").fetchall()
        assert ("user_csv",) in maps
        # 观测已入库（local-file 源）
        n = cat.con.execute("SELECT COUNT(*) FROM series_sources WHERE source_id='local-file'").fetchone()[0]
        assert n >= 1


class TestProvenanceDiff:
    def test_provenance_diff_cli(self, tmp_path, capsys):
        svc = setup(tmp_path)
        ra = svc.store.new_run("akshare", SID, BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(ra, [(SID, BASE, 1.0, "cny_bbl", "akshare", BASE)])
        rb = svc.store.new_run("akshare", SID, BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(rb, [(SID, BASE, 2.0, "cny_bbl", "akshare", BASE)])
        assert run("provenance", SID, "--root", str(tmp_path)) == 0
        assert run("diff", str(ra), str(rb), "--root", str(tmp_path)) == 0
        out = capsys.readouterr().out
        assert '"revised": 1' in out or "revised" in out


class TestSingleWriter:
    def test_write_command_blocked_when_locked(self, tmp_path, capsys):
        svc = setup(tmp_path)
        svc.acquire_write_lock()  # 模拟 serve 持写锁
        rc = run("fetch", SID, "--root", str(tmp_path))
        assert rc == 1
        assert "占用" in capsys.readouterr().err
        svc.release_write_lock()

    def test_readonly_routes_via_internal_when_locked(self, tmp_path, capsys):
        svc = setup(tmp_path)
        ra = svc.store.new_run("akshare", SID, BASE, BASE, "cny_bbl", "1d", "Asia/Shanghai")
        svc.store.commit_run(ra, [(SID, BASE, 1.0, "cny_bbl", "akshare", BASE)])
        from data.lock import write_endpoint

        svc.acquire_write_lock()
        srv = mcp_server.start_internal(svc, 0, "tok")
        try:
            write_endpoint(tmp_path / "data", srv.server_address[1], "tok")
            assert run("provenance", SID, "--root", str(tmp_path)) == 0
            out = capsys.readouterr().out
            assert "akshare" in out
        finally:
            srv.shutdown()
            svc.release_write_lock()
