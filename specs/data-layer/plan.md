# Feature: data-layer 实施计划（plan.md）

> Plan 阶段产物：由 spec.md 生成的设计成果。需求在 spec.md，本文只写"怎么做"。

## 1. 技术方案

- **语言/框架**：Python 3.14（D-002）；包名 `backend.data`，FastAPI 不参与本 feature（仅预留 service 门面供后续 API 包装）
- **存储**：DuckDB（观测与 vintage）+ SQLite（目录/别名/源注册/ingest_run）（D-006）
- **MCP**：官方 Python MCP SDK（`mcp`，FastMCP），stdio server，工具 = R-008 四件套
- **依赖**：duckdb、pydantic（manifest 校验）、pyyaml、requests、akshare、openpyxl、pandas、mcp、pywin32（DPAPI）、pytest
- **凭证**：Windows DPAPI（win32crypt.CryptProtectData），仅 Windows 路径（D-009 一致）
- **目录（backend/data/）**：
  ```
  backend/
  ├── pyproject.toml            # 依赖与 [project.scripts] futureai-data = data.cli:main
  ├── data/
  │   ├── service.py            # 对外门面：CLI / MCP / 未来 REST 共用同一组调用
  │   ├── manifest.py           # adapter manifest schema（pydantic）+ 校验错误报告
  │   ├── adapters/
  │   │   ├── base.py           # Adapter 抽象：fetch(series_descriptor, range) -> DataFrame
  │   │   ├── akshare_adapter.py
  │   │   ├── eia_adapter.py
  │   │   └── local_file_adapter.py
  │   ├── catalog/
  │   │   ├── descriptor.py     # 描述符规范化（canonical JSON）+ SHA-256 截断 ID + 8 槽渲染
  │   │   ├── aliases.py        # 别名映射（模板规则/模糊匹配/手动覆盖，SQLite 持久化）
  │   │   └── registry.py       # 目录编译：扫描适配器目录 -> manifest -> 序列目录
  │   ├── store/
  │   │   ├── duck.py           # DuckDB schema 初始化、latest_obs/asof 查询、vintage 视图
  │   │   └── ingest.py         # ingest_run 生命周期 + 事务式幂等写入（delete-run + insert）
  │   ├── fetch/
  │   │   ├── on_demand.py      # fetch_series 实现：解析适配器 -> 拉取 -> 归一化 -> ingest
  │   │   └── jobs.py           # scheduled 骨架：任务注册表 + 查看 + run_now（不引调度器）
  │   ├── align.py              # 对账：单位/时区/频率校验 -> 报告
  │   ├── creds.py              # DPAPI 加解密 + 凭证读写
  │   ├── cli.py                # python -m backend.data config|fetch|list|reconcile
  │   └── mcp_server.py         # FastMCP 四工具
  └── tests/                    # pytest，隔离临时根 fixture
  ```

## 2. 模块设计

| 模块 | 职责 | 关键接口 |
|---|---|---|
| service | 门面：组装 catalog/store/fetch/align；CLI 与 MCP 只调它 | `search_series(q)` `fetch_series(id, range, source, do_fetch)` `list_sources()` `reconcile(id)` |
| manifest | manifest YAML/JSON → pydantic 模型；错误带文件路径与字段 | `load(path) -> Manifest | ManifestError` |
| catalog | 描述符→ID；别名解析；目录编译与 reload | `resolve_alias(sym) -> descriptor` `rebuild()` |
| store | DuckDB 写入/查询；SQLite 元数据 | `ingest_run(rows, run_id)` `latest(series_id)` `asof(series_id, t)` |
| fetch | on_demand 拉取与归一化；任务注册表 | `fetch_series(...)` `register_job(...)` `run_job(name)` |
| align | 对账报告 | `check(series_id) -> Report` |
| creds | DPAPI 凭证 | `put(name, secret)` `get(name)` |

## 3. 数据与存储

### 3.1 SQLite（catalog.sqlite）

```
sources(id, adapter_id, name, priority, enabled)
series(id, descriptor_json, display_id_8slot, unit, freq, tz)
aliases(id, source_symbol, series_id, rule_kind)        -- 模板/模糊/手动
ingest_runs(id, adapter_id, started_at, finished_at, status, payload_hash)
user_overrides(series_id, source_id, priority)          -- 手动覆盖
```

### 3.2 DuckDB（observations.duckdb）

```
observations(series_id, ts, value, unit,
             source, fetched_at, asof, ingest_run, payload_hash)
```

- 视图 `latest_obs`：每 (series_id, ts) 按 供方优先级 → asof 最新 择优
- 视图 `vintage(asof_ts)`：参数化重建任一时点所见
- 幂等：写入 = 事务内 `DELETE WHERE ingest_run=?` + `INSERT`；同 run 重放无副作用

### 3.3 用户数据目录（每安装一套，默认 `%LOCALAPPDATA%/FuturesAI/`）

```
data/catalog.sqlite
data/observations.duckdb
adapters/            # 用户适配器目录（扫描点）
creds/               # DPAPI 加密凭证
```

## 4. 关键流程

1. **冷启动**：service.init() → 扫描内置 + 用户适配器目录 → manifest 校验（坏件报告、跳过）→ 编译序列目录（描述符→ID）→ 加载别名与覆盖 → 就绪
2. **按需取数**：`fetch_series(id, range, source?)` → catalog 解析适配器与源符号 → adapter.fetch → 单位归一化检查 → 新 ingest_run → 事务写库 → 返回最新值与 provenance
3. **幂等重放**：同 run_id 重放 = 覆盖重写（delete+insert），不产生重复行
4. **对账**：`reconcile(id)` → 取该序列全部源 → 比较 manifest 声明的 unit/tz/freq → 输出报告（不一致项逐条列出，不做静默换算）
5. **MCP**：`mcp_server.py` 以 stdio 启动 FastMCP，四工具委托 service；错误包装为结构化返回

## 5. 验收对应

| AC | 实现位置 | 验证方式 |
|---|---|---|
| AC-001-1/2/3 | adapters/ + catalog/registry | tests/test_adapters.py（临时根放好/坏适配器，校验报告与重建） |
| AC-002-1/2/3/4 | catalog/descriptor + aliases | tests/test_identity.py（确定性、归并、覆盖持久化） |
| AC-003-1/2/3/4 | store/duck + ingest | tests/test_store.py（重放幂等、latest、asof、优先级择优） |
| AC-004-1/2/3 | fetch/on_demand + jobs | tests/test_fetch.py（mock adapter 注入，成功/失败路径） |
| AC-005-1/2 | store + ingest | tests/test_provenance.py（字段查询、run 间 diff） |
| AC-006-1/2/3 | align.py | tests/test_align.py（单位/时区/频率不一致样例） |
| AC-007-1/2/3/4 | adapters/* | tests/test_adapters_*.py（网络用例标记 skip-if-offline；CSV/Excel 向导映射用样例文件） |
| AC-008-1/2/3 | mcp_server.py | tests/test_mcp.py（stdio 调用四工具，结构化错误） |
| AC-009-1/2/3 | creds.py + 扫描测试 | tests/test_creds.py（加解密往返；代码库无字面量 grep 检查） |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| akshare 接口漂移/限流 | 适配器隔离 + 版本锁定 + 失败不回退（AC-004-3）；网络用例离线可跳过 |
| DuckDB 单写者限制 | 单进程内统一连接管理（service 持有连接）；测试用独立临时文件 |
| Windows 编码/时区坑 | 沿用 FTEngine 约定：`PYTHONIOENCODING=utf-8`；时间戳一律 UTC 存储 + tz 标记 |
| pywin32（DPAPI）依赖体积 | 仅 creds.py 导入，失败时降级为"未加密 + 强警告"（不阻塞开发） |
| MCP SDK 接口变动 | 锁定 mcp 版本；工具层只依赖 FastMCP 稳定 API |

回滚：本 feature 未改动既有文档/代码之外的任何生产文件；数据目录为本地新建，可整目录删除重建。
