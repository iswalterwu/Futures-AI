"""service 门面（plan §1/§2.2）：CLI 与 MCP 共用同一组调用；持有写锁与连接。"""
from __future__ import annotations

from pathlib import Path

from data.adapters.akshare.akshare_adapter import AkshareAdapter
from data.adapters.eia.eia_adapter import EiaAdapter
from data.adapters.local_file.local_file_adapter import LocalFileAdapter
from data.align import reconcile
from data.catalog.db import CatalogDB
from data.catalog.registry import BUILTIN_ADAPTERS_DIR, Registry
from data.fetch.on_demand import FetchError, JobRegistry, fetch_series
from data.lock import LockBusy, ensure_layout, release_lock, write_lock
from data.store.duck import DuckStore
from data.store.provenance import diff, provenance


class Service:
    def __init__(self, root: Path, builtin_dir: Path | None = None):
        self.dirs = ensure_layout(root)
        self.root = root
        self.cat = CatalogDB(self.dirs["data"] / "catalog.sqlite")
        self.store = DuckStore(self.dirs["data"] / "observations.duckdb")
        self.reg = Registry(self.cat, builtin_dir or BUILTIN_ADAPTERS_DIR, self.dirs["adapters"])
        self.adapters = {
            "akshare": AkshareAdapter(),
            "eia": EiaAdapter(self.dirs["creds"]),
            "local-file": LocalFileAdapter(),
        }
        self.jobs = JobRegistry(self.cat, self._run_job)
        self._lock_f = None

    def init(self) -> "Service":
        res = self.reg.rebuild()
        self._provides = res["provides"]
        self.store.stale_running()
        return self

    # ---- 取数与查询（CLI/MCP 共用） ----

    def fetch(self, series_id, start=None, end=None, do_fetch=False, source=None):
        return fetch_series(
            self.cat,
            self.store,
            self.adapters,
            series_id,
            start,
            end,
            do_fetch,
            source,
            get_provide=lambda cat, sid, src: self._provides.get((src, sid)),
        )

    def search(self, q: str) -> dict:
        rows = self.cat.con.execute(
            "SELECT id, descriptor_json, display_id_8slot, unit, freq FROM series "
            "WHERE display_id_8slot LIKE ? OR descriptor_json LIKE ? OR id IN "
            "(SELECT series_id FROM aliases WHERE source_symbol LIKE ?) "
            "ORDER BY id LIMIT 50",
            [f"%{q}%", f"%{q}%", f"%{q}%"],
        ).fetchall()
        return {
            "matches": [
                {"series_id": r[0], "descriptor": r[1], "display_id": r[2], "unit": r[3], "freq": r[4]}
                for r in rows
            ]
        }

    def list_sources(self) -> dict:
        rows = self.cat.con.execute(
            "SELECT id, name, enabled, status FROM sources ORDER BY id"
        ).fetchall()
        return {
            "sources": [
                {"adapter_id": r[0], "name": r[1], "enabled": bool(r[2]), "status": r[3]}
                for r in rows
            ]
        }

    def reconcile(self, series_id):
        return reconcile(self.cat, series_id)

    def provenance(self, series_id, ts=None):
        return provenance(self.store, series_id, ts)

    def diff(self, run_a: int, run_b: int):
        return diff(self.store, run_a, run_b)

    def _run_job(self, adapter_id, series_id):
        return fetch_series(
            self.cat,
            self.store,
            self.adapters,
            series_id,
            None,
            None,
            True,
            source=adapter_id,
            get_provide=lambda cat, sid, src: self._provides.get((src, sid)),
        )

    # ---- 单写者 ----

    def acquire_write_lock(self):
        if self._lock_f is None:
            self._lock_f = write_lock(self.dirs["data"])

    def release_write_lock(self):
        if self._lock_f is not None:
            release_lock(self._lock_f)
            self._lock_f = None

    def close(self):
        self.release_write_lock()
