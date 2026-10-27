"""DuckDB 观测存储（plan §3.2，AC-003-1/2/3）。

追加写永不删行；幂等 = (series_id, ts, source, ingest_run) 唯一索引冲突忽略。
asof = 批次成功提交时刻（commit_run 事务内统一 now）。
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import duckdb

SCHEMA = """
CREATE TABLE IF NOT EXISTS observations(
  series_id VARCHAR, ts TIMESTAMP, value DOUBLE, unit VARCHAR, source VARCHAR,
  fetched_at TIMESTAMP, "asof" TIMESTAMP, ingest_run BIGINT, payload_hash VARCHAR
);
CREATE UNIQUE INDEX IF NOT EXISTS obs_unique ON observations(series_id, ts, source, ingest_run);
CREATE TABLE IF NOT EXISTS ingest_runs(
  ingest_run BIGINT PRIMARY KEY, adapter_id VARCHAR, series_id VARCHAR,
  range_start TIMESTAMP, range_end TIMESTAMP, unit VARCHAR, freq VARCHAR, tz VARCHAR,
  status VARCHAR, started_at TIMESTAMP, finished_at TIMESTAMP, payload_hash VARCHAR
);
CREATE SEQUENCE IF NOT EXISTS ingest_run_seq;
"""

RUNNING = "running"
SUCCEEDED = "succeeded"
FAILED = "failed"


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)  # 保留微秒（F-12 可见时间）


class DuckStore:
    """单写者连接持有者（service 持锁）。"""

    def __init__(self, path: str | Path, read_only: bool = False):
        self.path = str(path)
        self.read_only = read_only
        self.con = duckdb.connect(self.path, read_only=read_only)
        if not read_only:
            self.con.execute(SCHEMA)

    def close(self):
        try:
            self.con.close()
        except Exception:
            pass

    def is_initialized(self) -> bool:
        """库文件已建表（首启/中途崩溃留下的空文件 → False）。"""
        n = self.con.execute(
            "SELECT COUNT(*) FROM information_schema.tables "
            "WHERE table_name IN ('observations', 'ingest_runs')"
        ).fetchone()[0]
        return n == 2

    # ---- ingest_run 生命周期 ----

    def new_run(
        self,
        adapter_id: str,
        series_id: str,
        range_start: datetime | None,
        range_end: datetime | None,
        unit: str,
        freq: str,
        tz: str,
        payload_hash: str | None = None,
    ) -> int:
        rid = self.con.execute("SELECT nextval('ingest_run_seq')").fetchone()[0]
        self.con.execute(
            "INSERT INTO ingest_runs VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [rid, adapter_id, series_id, range_start, range_end, unit, freq, tz,
             RUNNING, utcnow(), None, payload_hash],
        )
        return rid

    def commit_run(self, rid: int, rows: list[tuple], payload_hash: str | None = None) -> int:
        """单事务：写入观测（asof = 提交时刻）+ run 标 succeeded。幂等（冲突忽略）。

        - 仅 RUNNING → SUCCEEDED；已成功批次重放 = no-op（不改 finished_at，F-13）
        - 空结果可成功提交（F-13）
        """
        cur = self.con.execute("SELECT status FROM ingest_runs WHERE ingest_run=?", [rid]).fetchone()
        if cur is None:
            raise ValueError(f"批次 {rid} 不存在")
        if cur[0] == SUCCEEDED:
            return rid  # 重放不改成功事实
        if cur[0] != RUNNING:
            raise ValueError(f"批次 {rid} 已终态（{cur[0]}），不可提交")
        try:
            self.con.execute("BEGIN")  # 纳入保护：BEGIN 刚生效即被中断也会回滚
            if rows:
                stamped = [
                    (sid, ts, val, unit, src, fetched, None, rid, payload_hash)
                    for (sid, ts, val, unit, src, fetched) in rows
                ]
                self.con.executemany(
                    "INSERT OR IGNORE INTO observations VALUES (?,?,?,?,?,?,?,?,?)", stamped
                )
            now = utcnow()  # F-12：插入后、提交前取可见时间（asof = 提交时刻）
            self.con.execute(
                'UPDATE observations SET "asof"=? WHERE ingest_run=? AND "asof" IS NULL',
                [now, rid],
            )
            self.con.execute(
                "UPDATE ingest_runs SET status=?, finished_at=?, payload_hash=COALESCE(?, payload_hash) WHERE ingest_run=?",
                [SUCCEEDED, now, payload_hash, rid],
            )
            self.con.execute("COMMIT")
        except BaseException:  # 含 KeyboardInterrupt/SystemExit：先回滚，由调用方独立标 failed
            try:
                self.con.execute("ROLLBACK")
            except Exception:
                pass  # 回滚本身失败不得掩盖原异常
            raise
        return rid

    def fail_run(self, rid: int) -> int:
        """仅 RUNNING → FAILED（成功事实不可回退，F-13）。"""
        cur = self.con.execute("SELECT status FROM ingest_runs WHERE ingest_run=?", [rid]).fetchone()
        if cur is None or cur[0] != RUNNING:
            return rid
        self.con.execute(
            "UPDATE ingest_runs SET status=?, finished_at=? WHERE ingest_run=?",
            [FAILED, utcnow(), rid],
        )
        return rid

    def run(self, rid: int) -> tuple | None:
        return self.con.execute("SELECT * FROM ingest_runs WHERE ingest_run=?", [rid]).fetchone()

    def stale_running(self, minutes: int = 60) -> list[int]:
        """冷启动清理：超时 running → failed。"""
        rows = self.con.execute(
            "SELECT ingest_run FROM ingest_runs WHERE status=? AND started_at < ?",
            [RUNNING, utcnow() - __import__("datetime").timedelta(minutes=minutes)],
        ).fetchall()
        for (rid,) in rows:
            self.fail_run(rid)
        return [r[0] for r in rows]

    # ---- 查询 ----

    def candidates(
        self,
        series_id: str,
        asof: datetime | None = None,
        start: datetime | None = None,
        end: datetime | None = None,
    ) -> list[tuple]:
        """候选行：可选 asof ≤ t、ts 区间过滤。行 = (ts, value, unit, source, asof, ingest_run)。"""
        sql = "SELECT ts, value, unit, source, fetched_at, \"asof\", ingest_run FROM observations WHERE series_id=?"
        args: list = [series_id]
        if asof is not None:
            sql += " AND \"asof\" <= ?"
            args.append(asof)
        if start is not None:
            sql += " AND ts >= ?"
            args.append(start)
        if end is not None:
            sql += " AND ts <= ?"
            args.append(end)
        return self.con.execute(sql, args).fetchall()

    def count_obs(self, series_id: str) -> int:
        return self.con.execute(
            "SELECT COUNT(*) FROM observations WHERE series_id=?", [series_id]
        ).fetchone()[0]
