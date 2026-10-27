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

    def load_provides(self) -> dict[tuple[str, str], object]:
        """只读扫描（CLI 只读命令用）：加载全部适配器清单，返回 (adapter_id, series_id) → Provide。"""
        provides_map: dict[tuple[str, str], object] = {}
        for _dir, mf_path in scan_adapters(self.builtin_dir, self.user_dir):
            try:
                m = load(mf_path)
            except ManifestError:
                continue
            for p in m.provides:
                d = normalize(p.descriptor.model_dump())
                provides_map[(m.id, derive_id(d))] = p
        return provides_map

    def rebuild(self) -> dict:
        """增量重建。返回 {sources: {...}, series: {...}, errors: [...]}。"""
        entries = scan_adapters(self.builtin_dir, self.user_dir)
        goods: dict[str, tuple] = {}  # adapter_id → (manifest, adapter_dir, mf_path)
        errors: list[dict] = []

        for adapter_dir, mf_path in entries:
            try:
                m = load(mf_path)
            except ManifestError as e:
                errors.append({"path": mf_path, "reason": str(e), "kind": "invalid"})
                continue
            if m.id in goods:
                errors.append({"path": mf_path, "reason": f"重复 id: {m.id}（后到者拒绝）", "kind": "dup"})
                continue
            goods[m.id] = (m, adapter_dir, mf_path)

        # ---- sources 状态机（F-10：既有源按 manifest_path 原地标 error；保留用户 enabled） ----
        seen_ids = set(goods)
        path_to_id = {}  # R6-03：在 goods 更新后重建，避免旧路径误伤
        for sid, (m, adapter_dir, mf_path) in goods.items():
            self.cat.con.execute(
                "INSERT INTO sources(id, adapter_id, name, enabled, status, manifest_path) "
                "VALUES (?,?,?,1,'ok',?) "
                "ON CONFLICT(id) DO UPDATE SET status='ok', name=excluded.name, "
                "manifest_path=excluded.manifest_path",
                [sid, sid, m.name, adapter_dir],
            )
        # R6-03/R7-03：goods 更新后建路径映射；仅纳入本轮实际扫描到的路径
        scanned_dirs = {str(Path(mf).parent) for (_d, mf) in entries}
        path_to_id = {
            r[5]: r[0]
            for r in self.cat.con.execute(
                "SELECT * FROM sources"  # F-10：含 error 源（坏件重建幂等）
            ).fetchall()
            if r[5] and r[5] in scanned_dirs
        }
        # error 条目：按 manifest 路径原地标 error（既有源），否则虚拟条目
        stale_errors = {r[0] for r in self.cat.con.execute("SELECT id FROM sources WHERE status='error'").fetchall()}
        current_errors = set()
        goods_dirs = {str(Path(mf).parent) for (_d, mf) in entries if any(
            mf == g_mf for g_mf in [g[2] for g in goods.values()]
        )}
        for e in errors:
            key = f"error:{e['path']}"
            existing_id = (
                path_to_id.get(str(Path(e["path"]).parent))
                if e.get("kind") == "invalid"
                else None
            )
            # R5-02：该 id 本轮已被其他路径的合法清单接管 → 不误伤
            if existing_id and existing_id in goods:
                existing_id = None
            # R8-02：该目录本轮已被其他合法清单占用 → 归属已变，不原地标记
            if existing_id and str(Path(e["path"]).parent) in goods_dirs:
                existing_id = None
            # R9-01：候选源已 disabled（目录曾被复用）→ 不原地标记，归属本轮实际源
            if existing_id:
                st = self.cat.con.execute(
                    "SELECT status FROM sources WHERE id=?", [existing_id]
                ).fetchone()
                if st and st[0] == "disabled":
                    existing_id = None
            if existing_id:
                self.cat.con.execute(
                    "UPDATE sources SET status='error' WHERE id=?", [existing_id]
                )
                current_errors.add(existing_id)
            else:
                self.cat.con.execute(
                    "INSERT INTO sources(id, adapter_id, name, enabled, status, manifest_path) "
                    "VALUES (?,?,?,0,'error',?) "
                    "ON CONFLICT(id) DO UPDATE SET status='error'",
                    [key, key, "error", e["path"]],
                )
                current_errors.add(key)
        for old in stale_errors - current_errors:
            # F-10：路径仍在磁盘 → 保留 error；路径消失 → disabled（保配置，不物理删除）
            if old.startswith("error:") and Path(old[len("error:"):]).exists():
                continue
            self.cat.con.execute("UPDATE sources SET status='disabled' WHERE id=?", [old])
        # 本次成功加载的清单 → 清理其虚拟 error 残留（F-10：精确路径）
        for sid, (m, adapter_dir, mf_path) in goods.items():
            self.cat.con.execute(
                "DELETE FROM sources WHERE id=? AND status='error'",
                [f"error:{mf_path}"],
            )

        for (sid, status) in self.cat.con.execute(
            "SELECT id, status FROM sources WHERE status != 'error'"
        ).fetchall():
            if sid not in seen_ids and status != "disabled":
                self.cat.con.execute("UPDATE sources SET status='disabled' WHERE id=?", [sid])

        # ---- series 编译（增量，不清空；同描述符归并 AC-002-2） ----
        # F-10：本轮未被声明的提供关系标 current=0（历史快照保留）
        self.cat.con.execute("UPDATE series_sources SET current=0")
        reg_counter = [0]
        provided_series: set[str] = set()
        provides_map: dict[tuple[str, str], object] = {}
        for sid, (m, _dir, _mf) in goods.items():
            for p in m.provides:
                d = normalize(p.descriptor.model_dump())
                series_id = derive_id(d)
                display = display_8slot(d, p.freq)
                provided_series.add(series_id)
                self.cat.con.execute(
                    "INSERT INTO series(id, descriptor_json, display_id_8slot, unit, freq, tz, status, valid_to) "
                    "VALUES (?,?,?,NULL,NULL,NULL,'active',NULL) "
                    "ON CONFLICT(id) DO UPDATE SET descriptor_json=excluded.descriptor_json, "
                    "status='active', valid_to=NULL",
                    [series_id, self._desc_json(d), display],
                )
                reg_counter[0] += 1
                self.cat.set_series_source(
                    series_id, sid, p.priority, reg_counter[0], p.unit, p.freq, p.tz, current=1
                )
                provides_map[(sid, series_id)] = p
                for sym in p.symbols:
                    self.cat.write_alias(sym, sid, series_id, "manifest")

        # ---- soft_deleted：无任何非 disabled 源的 series ----
        for (series_id,) in self.cat.con.execute("SELECT id FROM series").fetchall():
            n_okish = self.cat.con.execute(
                "SELECT COUNT(*) FROM series_sources ss JOIN sources s ON s.id = ss.source_id "
                "WHERE ss.series_id=? AND ss.current=1 AND s.status != 'disabled'",
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

        # ---- 主源派生缓存（F-11：用有效优先级；unit/freq/tz 与显示 ID 一并重算） ----
        for (series_id,) in self.cat.con.execute("SELECT id FROM series").fetchall():
            enabled = self.cat.enabled_sources(series_id)
            if enabled:
                regs = {
                    r[0]: r[1]
                    for r in self.cat.con.execute(
                        "SELECT source_id, reg_order FROM series_sources WHERE series_id=?",
                        [series_id],
                    ).fetchall()
                }
                # 有效优先级排序，并列取注册顺序先者
                primary = min(
                    enabled,
                    key=lambda s: (self.cat.effective_priority(series_id, s), regs.get(s, 1 << 30)),
                )
                decls = self.cat.source_declarations(series_id)
                pd = decls[primary]
                desc_row = self.cat.con.execute(
                    "SELECT descriptor_json FROM series WHERE id=?", [series_id]
                ).fetchone()
                import json as _json

                desc = _json.loads(desc_row[0]) if desc_row and desc_row[0] else {}
                display = display_8slot(desc, pd["freq"])
                self.cat.con.execute(
                    "UPDATE series SET unit=?, freq=?, tz=?, display_id_8slot=? WHERE id=?",
                    [pd["unit"], pd["freq"], pd["tz"], display, series_id],
                )

        self.cat.con.commit()
        return {
            "sources": seen_ids,
            "series": sorted(provided_series),
            "errors": errors,
            "provides": provides_map,
        }

    @staticmethod
    def _desc_json(d: dict) -> str:
        import json

        return json.dumps(d, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
