"""SQLite 目录库（plan §3.1）：schema 与优先级解析。

优先级唯一权威 = series_sources.priority（provides[].priority 落库）；
user_overrides 替换对应 source 的优先级值，参与同一决胜链。
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS sources(
  id TEXT PRIMARY KEY, adapter_id TEXT, name TEXT,
  enabled INTEGER DEFAULT 1, status TEXT DEFAULT 'ok', manifest_path TEXT
);
CREATE TABLE IF NOT EXISTS series(
  id TEXT PRIMARY KEY, descriptor_json TEXT, display_id_8slot TEXT,
  unit TEXT, freq TEXT, tz TEXT, status TEXT DEFAULT 'active', valid_to TEXT
);
CREATE TABLE IF NOT EXISTS series_sources(
  series_id TEXT, source_id TEXT, priority INTEGER DEFAULT 100, reg_order INTEGER,
  unit TEXT, freq TEXT, tz TEXT, current INTEGER DEFAULT 1,
  UNIQUE(series_id, source_id)
);
CREATE TABLE IF NOT EXISTS aliases(
  id INTEGER PRIMARY KEY AUTOINCREMENT, source_symbol TEXT, adapter_id TEXT,
  series_id TEXT, rule_kind TEXT, UNIQUE(source_symbol, adapter_id)
);
CREATE TABLE IF NOT EXISTS user_overrides(
  series_id TEXT, source_id TEXT, priority INTEGER, UNIQUE(series_id, source_id)
);
CREATE TABLE IF NOT EXISTS jobs(
  name TEXT PRIMARY KEY, adapter_id TEXT, series_id TEXT,
  schedule_spec TEXT, last_run TEXT
);
CREATE TABLE IF NOT EXISTS import_maps(
  id TEXT PRIMARY KEY, file_pattern TEXT, column_map_json TEXT
);
"""

# rule_kind 优先级（裁决用，小者优先）
RULE_ORDER = {"manual": 0, "manifest": 1, "template": 2, "fuzzy": 3}


class CatalogDB:
    def __init__(self, path: str | Path, read_only: bool = False):
        self.path = str(path)
        self.read_only = read_only
        if read_only:
            self.con = sqlite3.connect(f"file:{self.path}?mode=ro", uri=True)
        else:
            self.con = sqlite3.connect(self.path)
            self.con.executescript(SCHEMA)
            self.con.commit()

    def close(self):
        try:
            self.con.close()
        except Exception:
            pass

    # ---- 优先级解析（winners 输入） ----

    def effective_priorities(self, series_id: str) -> dict[str, int]:
        """source_id → 有效优先级（series_sources 打底，user_overrides 覆盖）。"""
        base = dict(self.con.execute(
            "SELECT source_id, priority FROM series_sources WHERE series_id=?",
            [series_id],
        ).fetchall())
        over = dict(self.con.execute(
            "SELECT source_id, priority FROM user_overrides WHERE series_id=?",
            [series_id],
        ).fetchall())
        base.update(over)
        return base

    def effective_priority(self, series_id: str, source_id: str) -> int:
        row = self.con.execute(
            "SELECT priority FROM user_overrides WHERE series_id=? AND source_id=?",
            [series_id, source_id],
        ).fetchone()
        if row:
            return row[0]
        row = self.con.execute(
            "SELECT priority FROM series_sources WHERE series_id=? AND source_id=?",
            [series_id, source_id],
        ).fetchone()
        return row[0] if row else 100

    def set_series_source(
        self, series_id: str, source_id: str, priority: int, reg_order: int,
        unit: str | None = None, freq: str | None = None, tz: str | None = None,
        current: int = 1,
    ) -> None:
        self.con.execute(
            "INSERT OR REPLACE INTO series_sources VALUES (?,?,?,?,?,?,?,?)",
            [series_id, source_id, priority, reg_order, unit, freq, tz, current],
        )
        self.con.commit()

    def source_declarations(self, series_id: str) -> dict[str, dict]:
        """source_id → {priority, unit, freq, tz}（每源口径声明快照，对账与主源派生用）。"""
        rows = self.con.execute(
            "SELECT source_id, priority, unit, freq, tz FROM series_sources WHERE series_id=?",
            [series_id],
        ).fetchall()
        return {
            r[0]: {"priority": r[1], "unit": r[2], "freq": r[3], "tz": r[4]} for r in rows
        }

    def enabled_sources(self, series_id: str) -> list[str]:
        """该序列的启用源（status=ok 且 enabled=1 且 current=1，F-10）。"""
        return [
            r[0]
            for r in self.con.execute(
                "SELECT ss.source_id FROM series_sources ss "
                "JOIN sources s ON s.id = ss.source_id "
                "WHERE ss.series_id=? AND ss.current=1 AND s.status='ok' AND s.enabled=1 "
                "ORDER BY ss.priority ASC, ss.reg_order ASC",
                [series_id],
            ).fetchall()
        ]

    def set_override(self, series_id: str, source_id: str, priority: int) -> None:
        self.con.execute(
            "INSERT OR REPLACE INTO user_overrides VALUES (?,?,?)",
            [series_id, source_id, priority],
        )
        self.con.commit()

    # ---- alias 写入裁决（AC-002-3） ----

    def write_alias(self, symbol: str, adapter_id: str, series_id: str, rule_kind: str) -> str:
        """写入裁决：新写入 rule 优先级低于现有行 → 拒绝并提示。返回 'written' | 'rejected'。"""
        existing = self.con.execute(
            "SELECT rule_kind FROM aliases WHERE source_symbol=? AND adapter_id=?",
            [symbol, adapter_id],
        ).fetchone()
        if existing and RULE_ORDER.get(rule_kind, 9) > RULE_ORDER.get(existing[0], 9):
            return "rejected"
        self.con.execute(
            "INSERT OR REPLACE INTO aliases(source_symbol, adapter_id, series_id, rule_kind) VALUES (?,?,?,?)",
            [symbol, adapter_id, series_id, rule_kind],
        )
        self.con.commit()
        return "written"

    def resolve_alias(self, symbol: str, adapter_id: str | None = None) -> str | None:
        if adapter_id is not None:
            row = self.con.execute(
                "SELECT series_id FROM aliases WHERE source_symbol=? AND adapter_id=?",
                [symbol, adapter_id],
            ).fetchone()
            return row[0] if row else None
        # 全适配器模糊回退：取 rule 优先级最高的一条
        rows = self.con.execute(
            "SELECT series_id, rule_kind FROM aliases WHERE source_symbol=?", [symbol]
        ).fetchall()
        if not rows:
            return None
        rows.sort(key=lambda r: RULE_ORDER.get(r[1], 9))
        return rows[0][0]
