# Feature: data-layer 实施计划（plan.md）

> Plan 阶段产物：由 spec.md（v15，十四轮双审修订后）生成的设计成果。需求在 spec.md，本文只写“怎么做”。

## 1. 技术方案

- **语言/框架**：Python 3.14（D-002）；包名 `backend.data`；FastAPI 不参与本 feature（service 门面供未来 API 包装；**不交付前端业务 HTTP 端点，MCP streamable HTTP 与 CLI 只读内部通道除外**）
- **存储**：DuckDB（observations + ingest_runs，同文件单事务）+ SQLite（目录/别名/源注册/手动覆盖）（D-006；Q-012）
- **MCP**：官方 Python MCP SDK（FastMCP），**streamable HTTP、localhost、Backend 进程内提供**（pi 经 mcp.json URL 连接；单进程单写者，Q-013）
- **依赖**：duckdb、pydantic、pyyaml、requests、akshare、openpyxl、pandas、mcp、pywin32（DPAPI）、pytest
- **凭证**：Windows DPAPI；保存与读取均 fail closed（拒绝/报错，禁止明文降级）（AC-009-1）
- **目录（backend/data/）**：
  ```
  backend/
  ├── pyproject.toml            # 依赖；[project.scripts] futureai-data = data.cli:main
  ├── data/
  │   ├── service.py            # 对外门面：CLI / MCP 共用；持有 DuckDB 连接（单写者）
  │   ├── manifest.py           # manifest schema（pydantic，字段表见 §2）
  │   ├── adapters/             # 每适配器一目录：manifest.yaml + 适配器模块（内置以包内资源形式，用户目录在数据目录）
  │   │   ├── base.py           # Adapter 抽象：fetch(descriptor, source_symbol, range) -> DataFrame
  │   │   ├── akshare/          #   manifest.yaml + akshare_adapter.py
  │   │   ├── eia/              #   manifest.yaml + eia_adapter.py
  │   │   └── local_file/       #   manifest.yaml + local_file_adapter.py
  │   ├── catalog/
  │   │   ├── descriptor.py     # 描述符规范化（asset/geo/measure 必填 + contract 可选，键集恒四键）+ SHA-256 截断 16 字节 + 8 槽渲染
  │   │   ├── aliases.py        # 别名（含 adapter 来源作用域，手动 > manifest > 模板 > 模糊）
  │   │   └── registry.py       # 目录编译：扫描适配器目录 -> manifest -> 序列目录；软删/error 状态迁移
  │   ├── store/
  │   │   ├── duck.py           # DuckDB schema（observations + ingest_runs）、幂等写入、候选行查询
  │   │   ├── winners.py        # 唯一全序：优先级 → asof → ingest_run（手动覆盖 = 替换优先级）
  │   │   └── ingest.py         # ingest_run 生命周期：拉取前建 running，成功 succeeded / 失败 failed
  │   ├── fetch/
  │   │   ├── on_demand.py      # fetch_series(do_fetch 显式)；do_fetch=false 只读短路
  │   │   └── jobs.py           # 任务注册表 + list/run（不引 APScheduler）
  │   ├── align.py              # 对账（manifest 权威）
  │   ├── creds.py              # DPAPI 加解密（保存/读取均 fail closed）
  │   ├── cli.py                # config|fetch|list|jobs|reconcile|import|provenance|diff|serve 子命令
  │   └── mcp_server.py         # FastMCP streamable HTTP（localhost）
  └── tests/                    # pytest，隔离临时根 fixture
  ```

## 2. 模块设计

### 2.1 manifest 字段契约（AC-001-2 判定依据，Gate 1 前定稿）

manifest 文件名固定 `manifest.yaml`，位于适配器目录内；重复 id：按扫描顺序先加载者生效，后到者拒绝并报告。字段契约：

```yaml
id: akshare                  # 必填，唯一，[a-z0-9-]{1,64}
name: AKShare 行情           # 必填，显示名（list_sources 的 name 来源）
version: 1                   # 必填，正整数
credentials: none            # 必填，enum: none | {kind: api_key, credential_ref: <名>}
provides:                    # 必填，非空数组
  - descriptor:              #   必填：3 键 + 可选 contract
      asset: sc              #     必填，v1 enum: sc/fu/lu/bu/pg/crude/brent/diesel/lpg
      geo: world             #     必填，v1 enum: world/na/nwe/med/me/afr/in/cn/apx
      measure: close         #     必填，v1 enum: close/volume/oi/stock/receipt/balance
      contract: ""           #     可选，缺省空串 = 主力/连续；非空 = 指定合约（去首尾空白、不转小写）
                            #     字符集 `[A-Za-z0-9]{1,20}`；含非法字符/纯空白/超长 → 校验拒绝（AC-001-2）
    symbols: ["futures_daily_SC"]   # 必填，非空：源侧符号，自动注册别名（rule_kind=manifest）
    unit: cny_bbl            #   必填，v1 enum: cny_bbl/cny_ton/usd_bbl/kb_d/kton
    freq: 1d                 #   必填，enum: 1d/1w/1m
    tz: Asia/Shanghai        #   必填，IANA 时区
    priority: 100            #   可选，int ≥0，默认 100（越小越优先；落库到 series_sources）
    fetch: {modes: [on_demand], history_days: 3650}   # 必填：modes ⊂ {scheduled, on_demand, realtime}；history_days int ≥0
    update: {lag_min: 0, revises: true}               # 必填：lag_min int ≥0（分钟）；revises bool
```

枚举规则：**封闭清单，新增枚举值必须先行修订本 spec（§5 登记）并更新本字段契约，不得运行时自动注册**；非法值 = 不在封闭清单中（AC-001-2 判定）。重复 id：按扫描顺序先加载者生效，后到者登记为 sources 表 error 虚拟条目（adapter_id=文件路径）并报告“重复 id”。校验失败 = 拒绝加载并报告文件路径 + 字段 + 原因（AC-001-2）。

### 2.2 service 接口（CLI/MCP 共用）

| 接口 | 签名与语义 |
|---|---|
| search_series | `search_series(q) -> {matches:[{series_id, descriptor, unit, freq}]}` |
| fetch_series | `fetch_series(series_id, range, do_fetch, source=None)` —— do_fetch **无默认值**；source=None = 该序列 status=ok 且 enabled 的启用源中优先级数值最小者（并列取注册顺序先者）；**仅 do_fetch=true 分支：无启用源 → not_found；只读分支忽略 source、不受源状态影响（返回跨源择优历史数据）**；false = 只读短路（不触发适配器、不写库） |
| list_sources | `list_sources() -> {sources:[{adapter_id, name, enabled, status}]}`（status: ok/disabled/error） |
| reconcile | `reconcile(series_id) -> {report:{series_id, checks:[...]}}` |
| config | `config add-source/alias/priority/credentials …`（CLI 专属；add-source = 在用户适配器目录写 manifest 骨架；只能配置已有 manifest 的源） |
| jobs | `jobs list/run`（CLI 专属） |
| import | `import <file>`（CLI 向导，CSV/Excel 映射） |
| provenance | `provenance <series_id>`（CLI 开发者工具，AC-005-1 交付入口） |
| diff | `diff <run_a> <run_b>`（CLI 开发者工具，AC-005-2 交付入口） |

### 2.3 8 槽渲染映射（AC-002-5 golden）

`cat = asset → 槽1；geo → 槽2；槽3/4/5 = "-"；measure → 槽6；contract → 槽7（空串渲染为 "-"）；freq 元数据 → 槽8`。
示例：`{asset: sc, geo: world, measure: close, contract: ""} + freq=1d → sc.world.-.-.-.close.-.1d`；
`contract: "SC2401" → sc.world.-.-.-.close.SC2401.1d`。

## 3. 数据与存储

### 3.1 SQLite（catalog.sqlite，仅目录）

```
sources(id, adapter_id, name, enabled, status, manifest_path)
        -- status: ok/disabled/error；manifest_path 持久化适配器目录路径（冷启动按路径定位更新状态）
        -- 注：优先级不在本表；唯一权威 = series_sources.priority（provides[].priority 默认 100 落库）；enabled 单一权威在本表
series(id, descriptor_json, display_id_8slot, unit, freq, tz,
      status, valid_to)  -- status: active/soft_deleted；valid_to = 软删时间戳（载体）；
                        -- 序列目录增量重建：移除源时 series 标 soft_deleted，历史数据保留且可查询
series_sources(series_id, source_id, priority, reg_order)
        UNIQUE(series_id, source_id)                           -- source_id = sources.id；provides[].priority 落库于此，逐序列择优以此为准
aliases(id, source_symbol, adapter_id, series_id, rule_kind)  -- rule_kind: manifest/template/fuzzy/manual
        UNIQUE(source_symbol, adapter_id)
        -- 写入裁决：新写入的 rule_kind 优先级低于现有行时拒绝并提示（手动 > manifest > 模板 > 模糊）
user_overrides(series_id, source_id, priority)                -- 手动覆盖 = 替换该 source 优先级值，参与同一决胜链；UNIQUE(series_id, source_id)
jobs(name, adapter_id, series_id, schedule_spec, last_run)    -- AC-004-2 任务注册表
import_maps(id, file_pattern, column_map_json)                -- AC-007-3 列映射持久化
```

### 3.2 DuckDB（observations.duckdb，数据 + 批次）

```
observations(series_id, ts, value, unit, source,             -- source 存 adapter_id（与 sources.adapter_id 同口径）
             fetched_at, asof, ingest_run, payload_hash)
        UNIQUE(series_id, ts, source, ingest_run)             -- 幂等 = 冲突忽略，永不删行
ingest_runs(ingest_run, adapter_id, series_id, range_start, range_end,
            unit, freq, tz,                       -- 批次口径快照（diff 可比条件）
            status, started_at, finished_at, payload_hash)
            ingest_run = DuckDB 自增 BIGINT，全局唯一，数值比较
```

- 幂等：`INSERT OR IGNORE`；重放不重复、不覆盖（AC-003-1）
- **择优解析在 Python 侧（store/winners.py）**：DuckDB 取**全部源**候选行 → SQLite 读 series_sources.priority + user_overrides → 唯一全序：优先级低者胜 → asof 新者胜 → ingest_run 大者胜（自增 BIGINT 数值比较）；**手动覆盖 = 替换该 source 的优先级值，参与同一决胜链**；status 只影响配置角色（主源/默认拉取源/展示口径，Q-027）（AC-003-4）
- `latest_obs(series_id)` 与 `asof(series_id, t)` 共用同一择优函数；asof(t) = asof ≤ t 的行（AC-003-3）
- **asof = finished_at（批次成功提交时刻）**；fetched_at = 拉取时间；run 提交前数据不可见
- 原子性：run 建在拉取前（running）；提交 = observations + run=succeeded 同一 DuckDB 事务；失败 = 独立事务标 failed（无部分数据行）；崩溃遗留 running → 冷启动时超时（>60min）标 failed
- **单写者**：service 打开 DuckDB 时持有数据目录写锁（plan §3.3 .lock）；CLI 写操作遇锁报错提示；CLI 只读命令（list/reconcile/provenance/diff）在锁被占时经 localhost MCP HTTP 路由查询；MCP 在 Backend 进程内，service 连接互斥串行化（Q-019/Q-029）

### 3.3 用户数据目录（权威布局，AC-009-3 指向本节；每安装一套，默认 `%LOCALAPPDATA%/FuturesAI/`）

```
data/catalog.sqlite
data/observations.duckdb
data/.lock               # 单写者写锁
data/mcp_endpoint.json   # 运行态：serve 端口+令牌（CLI 只读路由的端点发现，AC-004-6）
adapters/                # 用户适配器目录（扫描点，manifest.yaml 每适配器一份）
creds/                   # DPAPI 加密凭证
```

## 4. 关键流程

1. **冷启动**：service.init() → 扫描内置（包内资源）与用户适配器目录 → manifest 校验：**不可解析或字段非法的 manifest 一律把对应 source 标 error（按 manifest_path 定位：曾存在则原地改 status，未存在则以 adapter_id=文件路径登记虚拟条目；重复 id 的后到者同样标 error），报告路径+字段+原因；error 不影响其他适配器**（AC-001-3/4）→ 对比上次扫描：目录中消失的 source 标 disabled（软删，数据保留）→ 编译序列目录（series_sources 登记 provides 优先级；**编译 = 增/改/软删，不清空既有 series 行——全部 manifest 非法时历史序列仍可查询与对账**）→ 加载别名与覆盖 → **最后计算主源（候选 = status=ok 且 enabled=true 的启用源；enabled=false 视为非启用）**并写 series 派生缓存（unit/freq/tz = 主源值） → 清理超时 running 批次 → 就绪
2. **按需取数**（do_fetch=true）：建 ingest_run（running，记录 series/range）→ 解析适配器与源符号 → adapter.fetch → 单位归一化检查 → **同一 DuckDB 事务**：写 observations + run=succeeded → 返回；任一步失败 → 无数据行 + 独立事务 run=failed；可重试错误（超时/5xx/限流）支持手动重试 = 新 run
3. **只读短路**（do_fetch=false）：仅查询现有数据（latest_obs/asof），不创建 run、不触发适配器、不写库
4. **diff**：两 run 仅当均为 succeeded、series_id 相同、source 相同、[range_start, range_end] 相同、unit/freq/tz 快照一致时可比；否则返回不可比原因（AC-005-2）
5. **对账**：reconcile(id) → 各源 manifest 声明的 unit/tz/freq 对比 → 报告（不静默换算）；展示口径跟随主源（优先级最低数值者，并列取 series_sources 注册顺序先者）
6. **MCP**：FastMCP 以 streamable HTTP 起在 Backend 进程内（localhost 端口 + 令牌）；**生命周期 = service.start_mcp()/stop_mcp()，v1 经 CLI `serve` 子命令启动**（desktop-shell feature 将由 Backend 进程托管）；pi 的 mcp.json 用 URL 连接；四工具委托 service（**连接互斥串行化**）；逐工具输入/返回契约见 spec R-008

## 5. 验收对应

| AC | 实现位置 | 验证方式 |
|---|---|---|
| AC-001-1/2/3/4 | adapters/ + registry | tests/test_adapters.py（好/坏 manifest 样例按 §2.1 字段表；移除 → disabled、校验失败 → error、重复 id 后到者 → error 且先到者生效） |
| AC-002-1/2/3/4/5 | catalog/descriptor + aliases | tests/test_identity.py（golden 向量对拍 ID 与 8 槽（含 contract 缺省与 SC2401 样例）；**contract 非法字符/超长/纯空白拒绝样例**；归并；别名作用域与裁决；AC-002-4 grep 范围同 AC-009-2、阳性样例置 fixtures/manual_series_id_fixtures/） |
| AC-003-1/2/3/4 | store/duck + winners | tests/test_store.py（重放幂等；latest 两粒度；asof≡latest；决胜链含 tie-break 与手动覆盖） |
| AC-004-1/2/3/4/5/6 | fetch/ + jobs + cli | tests/test_fetch.py（mock adapter；原子性：中途失败无部分行 + run=failed；重试=新 run）；test_cli.py（config/jobs 持久化；add-source 写 manifest 骨架）；AC-004-4 = base.Adapter 签名存在断言（import 测试）；AC-004-6 = serve 持锁下写命令报错 + 只读命令经 HTTP 路由断言 |
| AC-005-1/2 | store + ingest | tests/test_provenance.py（字段查询；同范围 diff 三分类；跨范围 → 覆盖不一致） |
| AC-006-1/2/3/4 | align.py | tests/test_align.py（单位/时区/频率不一致样例；manifest 权威裁决；退化分支：无主源 → 缓存沿用/置空 + report.warnings） |
| AC-007-1/2/3/4 | adapters/* | tests/test_adapters_*.py（akshare/EIA 固定响应样本 mock + 在线冒烟；import 向导样例文件；隔离性） |
| AC-008-1/2/3/4 | mcp_server.py | tests/test_mcp.py（HTTP 调用四工具逐 schema；fetch 默认 false 短路断言无写库；结构化错误含 retryable 映射；serve 启动后端点可连接） |
| AC-009-1/2/3 | creds.py + 扫描 | tests/test_creds.py（保存/读取失败路径均报错）；grep：backend/ + 根 tests/（排除 fixtures/credential_scan_fixtures/，规则正则+阳/阴性样例随测试提交）；目录结构断言（plan §3.3） |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| akshare 接口漂移/限流 | 适配器隔离 + 版本锁定 + 失败不回退（AC-004-3）；离线测试用固定响应样本 mock |
| DuckDB 单写者限制 | 写锁（plan §3.3 .lock）：service 持写锁，CLI 写操作遇锁报错；CLI 只读命令经 localhost HTTP 路由（端点发现 = data/mcp_endpoint.json）；MCP 进程内 + 连接互斥串行化（Q-019/Q-029） |
| Windows 编码/时区坑 | `PYTHONIOENCODING=utf-8`；时间戳 UTC 存储 + tz 标记 |
| pywin32（DPAPI）不可用 | fail closed：拒绝保存/读取并报错（AC-009-1），无降级路径 |
| Python 3.14 wheel 可用性 | **实施首任务 = 依赖安装冒烟**（全依赖 pip install + import）；失败则调整版本锁定并回 spec |
| MCP SDK 接口变动 | 锁定 mcp 版本；工具层只依赖 FastMCP 稳定 API；逐工具返回契约固定 |

调度器注记：v1 不引 APScheduler（任务注册表 + 手动触发）；architecture §3.5 已注记收窄，调度器随 daily-report feature 引入。

回滚：本 feature 未改动既有文档/代码之外的任何生产文件；数据目录为本地新建，可整目录删除重建。
