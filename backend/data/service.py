"""service 门面（plan §1/§2.2）：CLI 与 MCP 共用同一组调用。

写模式：构造时**先取写锁、后开库**（F-01）；只读模式：read_only 连接、不取锁。
"""
from __future__ import annotations

from datetime import datetime
from pathlib import Path
import threading

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


def _parse_ts(v):
    """ISO8601 → naive UTC datetime；非法输入 → validation_error（F-05 时区归一）。"""
    if v is None:
        return None
    if isinstance(v, datetime):
        dt = v
    else:
        try:
            dt = datetime.fromisoformat(str(v))
        except ValueError as e:
            raise FetchError("validation_error", f"非法时间参数: {v!r}（须为 ISO8601）") from e
    if dt.tzinfo is not None:
        return dt.astimezone(__import__("datetime").timezone.utc).replace(tzinfo=None)
    return dt  # 无时区 = 视为 UTC


class Service:
    def __init__(self, root: Path, builtin_dir: Path | None = None, readonly: bool = False):
        self.dirs = ensure_layout(root)
        self.root = root
        self.readonly = readonly
        self._lock_f = None
        if not readonly:
            # F-01：先取写锁，再开任何可写存储；开库失败必须释放锁
            self._lock_f = write_lock(self.dirs["data"])
        try:
            self.cat = CatalogDB(self.dirs["data"] / "catalog.sqlite", read_only=readonly)
            self.store = DuckStore(self.dirs["data"] / "observations.duckdb", read_only=readonly)
        except Exception:
            if self._lock_f is not None:
                release_lock(self._lock_f)
                self._lock_f = None
            raise
        self.reg = Registry(self.cat, builtin_dir or BUILTIN_ADAPTERS_DIR, self.dirs["adapters"])
        self.adapters = {
            "akshare": AkshareAdapter(),
            "eia": EiaAdapter(self.dirs["creds"]),
            "local-file": LocalFileAdapter(),
        }
        self.jobs = JobRegistry(self.cat, self._run_job) if not readonly else None
        self._provides: dict[tuple[str, str], object] = {}
        self._write_mutex = threading.Lock()  # F-02：写路径业务级串行
        self._access_lock = threading.RLock()  # F-02：全部数据访问串行（duckdb 单连接）

    def init(self) -> "Service":
        if self.readonly:
            self._provides = self.reg.load_provides()
        else:
            res = self.reg.rebuild()
            self._provides = res["provides"]
            self.store.stale_running()
        return self

    # ---- 取数与查询（CLI/MCP 共用） ----

    def fetch(self, series_id, start=None, end=None, do_fetch=None, source=None):
        if do_fetch is None:
            raise FetchError("validation_error", "do_fetch 必须显式传入")
        if self.readonly and do_fetch:
            raise FetchError("validation_error", "只读服务不可取数")
        start, end = _parse_ts(start), _parse_ts(end)
        if start and end and start > end:
            raise FetchError("validation_error", "start 不得晚于 end")
        with self._access_lock:
            if do_fetch:
                with self._write_mutex:
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
        with self._access_lock:
            return self._search_unlocked(q)

    def _search_unlocked(self, q: str) -> dict:
        rows = self.cat.con.execute(
            "SELECT id, descriptor_json, display_id_8slot, unit, freq FROM series "
            "WHERE display_id_8slot LIKE ? OR descriptor_json LIKE ? OR id IN "
            "(SELECT series_id FROM aliases WHERE source_symbol LIKE ?) "
            "ORDER BY id LIMIT 50",
            [f"%{q}%", f"%{q}%", f"%{q}%"],
        ).fetchall()
        import json as _json

        return {
            "matches": [
                {
                    "series_id": r[0],
                    "descriptor": _json.loads(r[1]) if r[1] else {},
                    "unit": r[3],
                    "freq": r[4],
                }
                for r in rows
            ]
        }

    def list_jobs(self) -> list:
        """只读任务列表（N-02：只读 CLI 可用）。"""
        with self._access_lock:
            return self.cat.con.execute("SELECT * FROM jobs").fetchall()

    def list_sources(self) -> dict:
        with self._access_lock:
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
        with self._access_lock:
            return reconcile(self.cat, series_id)

    def provenance(self, series_id, ts=None):
        with self._access_lock:
            return provenance(self.store, series_id, ts)

    def diff(self, run_a: int, run_b: int):
        with self._access_lock:
            return diff(self.store, run_a, run_b)

    def _run_job(self, adapter_id, series_id):
        with self._access_lock:
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
        if self._lock_f is None and not self.readonly:
            self._lock_f = write_lock(self.dirs["data"])

    def release_write_lock(self):
        if self._lock_f is not None:
            release_lock(self._lock_f)
            self._lock_f = None

    def close(self):
        try:
            self.store.close()
        finally:
            self.cat.close()
            self.release_write_lock()
