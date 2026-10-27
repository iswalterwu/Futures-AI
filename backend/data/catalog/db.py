"""SQLite 目录库（plan §3.1）：schema、优先级解析与配置目标校验。

优先级唯一权威 = series_sources.priority（provides[].priority 落库）；
user_overrides 替换对应 source 的优先级值，参与同一决胜链。
连接允许跨线程使用：并发访问由 service 的访问锁串行（plan §2.2 MCP 执行模型）。
"""
from __future__ import annotations

import sqlite3
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS sources(
  id TEXT PRIMARY KEY, adapter_id TEXT, name TEXT,
  enabled INTEGER DEFAULT 1, status TEXT DEFAULT 'ok', manifest_path TEXT
);
CREATE TABLE IF NOT EXISTS source_reasons(
  source_id TEXT PRIMARY KEY, reason TEXT
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

# 虚拟 error 条目（按清单路径登记的坏件）的 id 前缀
ERROR_PREFIX = "error:"


class CatalogDB:
    def __init__(self, path: str | Path, read_only: bool = False):
        self.path = str(path)
        self.read_only = read_only
        if read_only:
            uri = Path(self.path).resolve().as_uri() + "?mode=ro"
            self.con = sqlite3.connect(uri, uri=True, check_same_thread=False)
        else:
            self.con = sqlite3.connect(self.path, check_same_thread=False)
            self.con.executescript(SCHEMA)
            self.con.commit()

    def close(self):
        try:
            self.con.close()
        except Exception:
            pass

    def has_table(self, name: str) -> bool:
        return self.con.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", [name]
        ).fetchone() is not None

    def is_initialized(self) -> bool:
        """库文件已建表（首启/中途崩溃留下的空文件 → False）。"""
        return self.has_table("sources") and self.has_table("series")

    # ---- 配置目标校验（AC-004-5：只能配置已有清单的源） ----

    def series_exists(self, series_id: str) -> bool:
        return self.con.execute(
            "SELECT 1 FROM series WHERE id=?", [series_id]
        ).fetchone() is not None

    def source_row(self, source_id: str) -> tuple | None:
        """真实源的 (enabled, status)；不存在或为虚拟 error 条目 → None。"""
        if source_id.startswith(ERROR_PREFIX):
            return None
        return self.con.execute(
            "SELECT enabled, status FROM sources WHERE id=?", [source_id]
        ).fetchone()

    def source_declares(self, series_id: str, source_id: str) -> bool:
        """该源的当前清单是否声明了该序列。"""
        return self.con.execute(
            "SELECT 1 FROM series_sources WHERE series_id=? AND source_id=? AND current=1",
            [series_id, source_id],
        ).fetchone() is not None

    def set_source_enabled(self, source_id: str, enabled: bool, commit: bool = True) -> None:
        self.con.execute(
            "UPDATE sources SET enabled=? WHERE id=?", [1 if enabled else 0, source_id]
        )
        if commit:
            self.con.commit()

    # ---- 状态原因（AC-001-2 用户可见报告） ----

    def set_reason(self, source_id: str, reason: str | None) -> None:
        if reason is None:
            self.con.execute("DELETE FROM source_reasons WHERE source_id=?", [source_id])
        else:
            self.con.execute(
                "INSERT OR REPLACE INTO source_reasons(source_id, reason) VALUES (?,?)",
                [source_id, reason],
            )

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
        self, series_id: str, source_id: str, priority: int, reg_order: int | None = None,
        unit: str | None = None, freq: str | None = None, tz: str | None = None,
        current: int = 1, commit: bool = True,
    ) -> None:
        """登记提供关系。reg_order=None：沿用首次登记顺序，新关系追加到末尾（重建不重排）。"""
        if reg_order is None:
            row = self.con.execute(
                "SELECT reg_order FROM series_sources WHERE series_id=? AND source_id=?",
                [series_id, source_id],
            ).fetchone()
            if row and row[0] is not None:
                reg_order = row[0]
            else:
                reg_order = self.con.execute(
                    "SELECT COALESCE(MAX(reg_order), 0) + 1 FROM series_sources"
                ).fetchone()[0]
        self.con.execute(
            "INSERT OR REPLACE INTO series_sources"
            "(series_id, source_id, priority, reg_order, unit, freq, tz, current) "
            "VALUES (?,?,?,?,?,?,?,?)",
            [series_id, source_id, priority, reg_order, unit, freq, tz, current],
        )
        if commit:
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

    def current_sources(self, series_id: str) -> list[str]:
        """该序列全部当前声明源（current=1，含停用/报错）。"""
        return [
            r[0]
            for r in self.con.execute(
                "SELECT source_id FROM series_sources WHERE series_id=? AND current=1 "
                "ORDER BY reg_order ASC",
                [series_id],
            ).fetchall()
        ]

    def enabled_sources(self, series_id: str) -> list[str]:
        """该序列的启用源（status=ok 且 enabled=1 且 current=1），按有效优先级、注册顺序排序。"""
        return [
            r[0]
            for r in self.con.execute(
                "SELECT ss.source_id FROM series_sources ss "
                "JOIN sources s ON s.id = ss.source_id "
                "LEFT JOIN user_overrides uo ON uo.series_id = ss.series_id AND uo.source_id = ss.source_id "
                "WHERE ss.series_id=? AND ss.current=1 AND s.status='ok' AND s.enabled=1 "
                "ORDER BY COALESCE(uo.priority, ss.priority) ASC, ss.reg_order ASC",
                [series_id],
            ).fetchall()
        ]

    def series_tz(self, series_id: str) -> str | None:
        """序列展示口径的时区（主源声明值，派生缓存）。"""
        row = self.con.execute("SELECT tz FROM series WHERE id=?", [series_id]).fetchone()
        return row[0] if row else None

    def set_override(self, series_id: str, source_id: str, priority: int, commit: bool = True) -> None:
        self.con.execute(
            "INSERT OR REPLACE INTO user_overrides VALUES (?,?,?)",
            [series_id, source_id, priority],
        )
        if commit:
            self.con.commit()

    # ---- alias 写入裁决（AC-002-3） ----

    def write_alias(
        self, symbol: str, adapter_id: str, series_id: str, rule_kind: str, commit: bool = True
    ) -> str:
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
        if commit:
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
