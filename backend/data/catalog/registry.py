"""目录编译与源状态机（plan §4.1，AC-001-1/3/4、AC-002-2）。

扫描顺序 = 内置目录先、用户目录后；重复 id 先加载者生效、后到者 error。
增量重建：既有 series 行不清空；error 虚拟条目按路径登记。
"""
from __future__ import annotations

from pathlib import Path

from data.catalog.db import CatalogDB
from data.catalog.descriptor import derive_id, display_8slot, normalize
from data.manifest import MANIFEST_FILENAME, ManifestError, load

BUILTIN_ADAPTERS_DIR = Path(__file__).resolve().parent.parent / "adapters"


def scan_adapters(builtin_dir: Path, user_dir: Path) -> list[tuple[str, str]]:
    """返回 [(adapter_dir, manifest_path)]，内置在前、用户在后。"""
    found: list[tuple[str, str]] = []
    for d in (builtin_dir, user_dir):
        if not d.is_dir():
            continue
        for sub in sorted(d.iterdir()):
            if sub.is_dir():
                mf = sub / MANIFEST_FILENAME
                if mf.is_file():
                    found.append((str(sub), str(mf)))
    return found


class Registry:
    def __init__(self, cat: CatalogDB, builtin_dir: Path, user_dir: Path):
        self.cat = cat
        self.builtin_dir = builtin_dir
        self.user_dir = user_dir

    def rebuild(self) -> dict:
        """增量重建。返回 {sources: {...}, series: {...}, errors: [...]}。"""
        entries = scan_adapters(self.builtin_dir, self.user_dir)
        goods: dict[str, tuple] = {}  # adapter_id → (manifest, adapter_dir)
        errors: list[dict] = []

        for adapter_dir, mf_path in entries:
            try:
                m = load(mf_path)
            except ManifestError as e:
                errors.append({"path": mf_path, "reason": str(e)})
                continue
            if m.id in goods:
                errors.append({"path": mf_path, "reason": f"重复 id: {m.id}（后到者拒绝）"})
                continue
            goods[m.id] = (m, adapter_dir)

        # ---- sources 状态机（按 manifest_path 定位；error 按路径虚拟条目） ----
        seen_ids = set(goods)
        for (sid,) in self.cat.con.execute("SELECT id FROM sources WHERE status != 'error'").fetchall():
            if sid not in seen_ids:
                self.cat.con.execute("UPDATE sources SET status='disabled' WHERE id=?", [sid])
        for sid, (m, adapter_dir) in goods.items():
            self.cat.con.execute(
                "INSERT INTO sources(id, adapter_id, name, enabled, status, manifest_path) "
                "VALUES (?,?,?,1,'ok',?) "
                "ON CONFLICT(id) DO UPDATE SET status='ok', enabled=1, name=excluded.name, "
                "manifest_path=excluded.manifest_path",
                [sid, sid, m.name, adapter_dir],
            )
        # error 条目（不可解析/非法/重复 id）——路径为键，清理陈旧 error
        err_keys = [f"error:{e['path']}" for e in errors]
        self.cat.con.execute(
            f"DELETE FROM sources WHERE status='error' AND id NOT IN ({','.join('?' * len(err_keys))})",
            err_keys,
        ) if err_keys else self.cat.con.execute("DELETE FROM sources WHERE status='error'")
        for e in errors:
            key = f"error:{e['path']}"
            self.cat.con.execute(
                "INSERT INTO sources(id, adapter_id, name, enabled, status, manifest_path) "
                "VALUES (?,?,?,0,'error',?) "
                "ON CONFLICT(id) DO UPDATE SET status='error'",
                [key, key, "error", e["path"]],
            )

        # ---- series 编译（增量，不清空；同描述符归并 AC-002-2） ----
        reg_counter = [0]
        provided_series: set[str] = set()
        for sid, (m, _dir) in goods.items():
            for p in m.provides:
                d = normalize(p.descriptor.model_dump())
                series_id = derive_id(d)
                display = display_8slot(d, p.freq)
                provided_series.add(series_id)
                self.cat.con.execute(
                    "INSERT INTO series(id, descriptor_json, display_id_8slot, unit, freq, tz, status, valid_to) "
                    "VALUES (?,?,?,NULL,NULL,NULL,'active',NULL) "
                    "ON CONFLICT(id) DO UPDATE SET descriptor_json=excluded.descriptor_json, "
                    "display_id_8slot=excluded.display_id_8slot, status='active', valid_to=NULL",
                    [series_id, self._desc_json(d), display],
                )
                reg_counter[0] += 1
                self.cat.set_series_source(
                    series_id, sid, p.priority, reg_counter[0], p.unit, p.freq, p.tz
                )
                for sym in p.symbols:
                    self.cat.write_alias(sym, sid, series_id, "manifest")

        # ---- soft_deleted：无任何非 disabled 源的 series ----
        for (series_id,) in self.cat.con.execute("SELECT id FROM series").fetchall():
            n_okish = self.cat.con.execute(
                "SELECT COUNT(*) FROM series_sources ss JOIN sources s ON s.id = ss.source_id "
                "WHERE ss.series_id=? AND s.status != 'disabled'",
                [series_id],
            ).fetchone()[0]
            if n_okish == 0:
                self.cat.con.execute(
                    "UPDATE series SET status='soft_deleted', valid_to=datetime('now') WHERE id=?",
                    [series_id],
                )
            elif series_id in provided_series:
                self.cat.con.execute(
                    "UPDATE series SET status='active', valid_to=NULL WHERE id=?", [series_id]
                )

        # ---- 主源派生缓存（unit/freq/tz = 启用源中优先级最小者；无启用源 → 保留现值） ----
        for (series_id,) in self.cat.con.execute("SELECT id FROM series").fetchall():
            enabled = self.cat.enabled_sources(series_id)
            if enabled:
                decls = self.cat.source_declarations(series_id)
                primary = enabled[0]
                pd = decls[primary]
                self.cat.con.execute(
                    "UPDATE series SET unit=?, freq=?, tz=? WHERE id=?",
                    [pd["unit"], pd["freq"], pd["tz"], series_id],
                )

        self.cat.con.commit()
        return {"sources": seen_ids, "series": sorted(provided_series), "errors": errors}

    @staticmethod
    def _desc_json(d: dict) -> str:
        import json

        return json.dumps(d, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
