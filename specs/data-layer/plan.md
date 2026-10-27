# Feature: data-layer 实施计划（plan.md）

> Plan 阶段产物：由 spec.md（v18，去技术化版）生成的设计成果。需求在 spec.md（what/why），本文承载全部实现机制与契约细则。

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
implementation: akshare      # 可选，enum: akshare | eia | local-file（v1 内置取数实现，封闭清单）；缺省 = 仅声明源
                             #   （进目录、可检索/对账，不可取数：取数返回 not_found）；用户目录清单借此复用内置实现，
                             #   如声明指定合约 {asset: sc, geo: cn, measure: close, contract: SC2401} 并绑定 akshare；
                             #   跨字段：implementation: eia 要求 credentials.kind = api_key（否则校验失败，源标 error 并给出原因）
provides:                    # 必填，非空数组
  - descriptor:              #   必填：3 键 + 可选 contract
      asset: sc              #     必填，v1 enum: sc/fu/lu/bu/pg/crude/brent/diesel/lpg
      geo: world             #     必填，v1 enum: world/na/nwe/med/me/afr/in/cn/apx
      measure: close         #     必填，v1 enum: close/volume/oi/stock/receipt/balance
      contract: ""           #     可选，缺省空串 = 主力/连续；非空 = 指定合约（去首尾空白、不转小写）
                            #     字符集 `[A-Za-z0-9]{1,20}`；含非法字符/纯空白/超长 → 校验拒绝（AC-001-2）
    symbols: ["futures_daily_SC"]   # 必填，非空：源侧符号，自动注册别名（rule_kind=manifest）
    unit: cny_bbl            #   必填，v1 enum: cny_bbl/cny_ton/usd_bbl/kb_d/kb/kton（kb 于 2026-10-26 评审后新增：库存存量单位）
    freq: 1d                 #   必填，enum: 1d/1w/1m
    tz: Asia/Shanghai        #   必填，IANA 时区
    priority: 100            #   可选，int ≥0，默认 100（越小越优先；落库到 series_sources）
    fetch: {modes: [on_demand], history_days: 3650}   # 必填：modes ⊂ {scheduled, on_demand, realtime}；history_days int ≥0
    update: {lag_min: 0, revises: true}               # 必填：lag_min int ≥0（分钟）；revises bool
```

枚举规则：**封闭清单，新增枚举值必须先行修订本 spec（§5 登记）并更新本字段契约，不得运行时自动注册**；非法值 = 不在封闭清单中（AC-001-2 判定）。重复 id：按扫描顺序先加载者生效，后到者登记为 sources 表 error 虚拟条目（adapter_id=文件路径）并报告“重复 id”。校验失败 = 拒绝加载并报告文件路径 + 字段 + 原因（AC-001-2）；**原因持久化并用户可见**（`list_sources` 的 `reason` 字段 + `serve` 启动时打印到 stderr）。

**执行绑定（AC-001-1/AC-007-1）**：冷启动时每个合法清单按 `implementation` 绑定一个取数实例（akshare/local-file 无状态；eia 的凭证引用取自**该清单**的 `credentials.credential_ref`）。v1 不加载用户目录中的代码（第三方实现属 Phase 4，spec 非目标）——用户源只能复用内置实现。

**akshare 源符号约定**：`<品种>0` = 主力连续日线（如 `SC0`）；`<合约代码>` = 指定合约日线（如 `SC2401`）；`<品种>_RECEIPT` = 交易所仓单日报；`<品种>_STOCK` = 库存日报（东方财富期货库存数据）。价格型序列不换算。上游 SDK 调用有硬超时（300s，超时 = adapter_error 可重试）。

**数量型（仓单/库存）归一**：按品种登记源侧原始口径并折算到清单声明单位——

| 品种 | 交易所口径 | 声明单位 | 折算 |
|---|---|---|---|
| SC | 能源中心，桶 | kb | ÷ 1000 |
| FU/BU/LU | 上期所/能源中心，吨 | kton | ÷ 1000 |
| PG | 大商所，手（合约规格 20 吨/手） | kton | × 20 ÷ 1000 |

未登记品种或声明单位量纲不匹配（如 SC 仓单声明 kton）→ validation_error，在请求上游前拒绝（不产出错标数据）。

**覆盖窗口（AC-005-2）**：批次的覆盖范围 = 适配器在建批次前解析的实际请求窗口（`Adapter.effective_range`）。价格型 = 调用方范围原样（None = 源全量历史，无截断）；仓单未给起点 = 回看 30 天（逐日抓取），库存未给起点 = 回看 365 天；未给终点 = 当日。滚动窗口下跨日的两批覆盖不同 → diff 报不可比，而非误报删除。东财库存每次只返回最近 500 个交易日：整页且最早日期晚于请求起点 → validation_error（不虚报覆盖）。

**R-007 覆盖对照（内置）**：SC/FU/LU/BU/PG 五品种均内置主力连续日线与交易所仓单日报；FU/LU/BU/PG 另内置库存日报（东财库存数据不含 SC；SC 的交易所库存口径即能源中心仓单日报）。指定合约日线由用户清单绑定 akshare 声明（合约会到期，不宜内置）。

### 2.2 接口与契约（spec 中所有“见 plan §2.2”的落点）

**术语定义**：启用源 = status=ok 且 enabled=true；非启用源 = status 非 ok 或 enabled=false。

**service/CLI 接口（CLI/MCP 共用）**：

| 接口 | 签名与语义 |
|---|---|
| search_series | `search_series(q) -> {matches:[{series_id, descriptor, unit, freq}]}`；q 匹配 = 描述符字段值（asset/geo/measure/contract，不含键名）与别名的子串匹配（`%`/`_` 按字面字符匹配，不作通配）；descriptor = 描述符 dict（含 contract，缺省空串） |
| fetch_series | `fetch_series(series_id, range, do_fetch, source=None)` —— do_fetch **无默认值**；range = `{start: ISO8601, end: ISO8601}`（**end 为闭区间**）；source=None = 启用源中优先级数值最小者（并列取注册顺序先者）；**仅 do_fetch=true 分支：无启用源 → not_found；显式 source 指向非启用源 → validation_error；只读分支忽略 source、不受源状态影响（返回跨源择优历史数据）**；do_fetch=false = 只读短路（不触发适配器、不写库）。**序列不存在（目录中无此 ID）→ not_found（两分支一致）；已登记但无观测 = 成功空结果**。**range 时间语义**：观测 ts = 源声明时区下的时间标签（naive）；range 不带时区 = 同一基准直接比较；带时区 = 先换算到序列主源声明时区再去时区比较 |
| list_sources | `list_sources() -> {sources:[{adapter_id, name, enabled, status, reason}]}`（status: ok/disabled/error；reason = 最近一次目录编译给出的状态原因：error = 校验失败的路径+字段+原因，disabled = 清单已移除，ok = null） |
| reconcile | `reconcile(series_id) -> {report:{series_id, checks:[{kind: unit|tz|freq, source_a, source_b, status: ok|mismatch, detail}], warnings:[string]}}`（warnings = 退化/全局问题，不绑定成对源；**无可用序列时（空目录首启）：返回 warnings 说明“无可用序列”**） |
| config | `config add-source <id> [--implementation akshare|eia|local-file]` / `alias <symbol> <source_id> <series_id>` / `priority <series_id> <source_id> <n>` / `enable <source_id>` / `disable <source_id>` / `credentials <name> [secret]`（CLI 专属；持久化，重启后生效）。**只能配置已有清单的源**：源须为真实源（非 error 虚拟条目）且清单仍在（status≠disabled）；priority 另要求该源当前清单声明该序列、n ≥ 0；alias 要求序列存在；不满足 → not_found/validation_error，不落库。add-source = 在用户适配器目录写清单骨架（id 须符合 §2.1 正则；骨架含 credentials/implementation，provides 待填——填写前该源登记为 error 并给出原因）。enable/disable = R-001 单源启停（写 sources.enabled 后重算主源派生缓存）。credentials 省略 secret 时交互输入（不回显，避免进入 shell 历史）；不需要写锁（只写 creds/）；显式传 secret 仅供脚本化场景（已知风险：可能进入 shell 历史/进程参数，风险接受并在 CLI 帮助中提示）；凭证名须匹配 `[A-Za-z0-9_-]{1,64}` |
| jobs | `jobs register|list|run`（CLI 专属；`jobs register <name> <source_id> <series_id>` 要求该源当前清单声明该序列；last_run = 触发后记录的 UTC 时间） |
| import | `import <file> [--series <id>] [--source <id>]`（CLI 向导，CSV/Excel 映射；目标 = `implementation: local-file` 的启用源所声明的序列，多目标时交互选择；带时区时间戳换算到目标源声明时区） |
| serve | `serve [--port N]`（默认 8932，仅 127.0.0.1；启动时打印清单校验失败报告；正常退出删除端点文件并释放写锁） |
| provenance | `provenance <series_id>`（CLI 开发者工具，AC-005-1 交付入口；序列不存在 → not_found，与 fetch_series 同口径；已登记无观测 = 空列表） |
| diff | `diff <run_a> <run_b>`（CLI 开发者工具，AC-005-2 交付入口） |

**MCP 工具契约（pi 经 MCP 调用；MCP 层参数 `fetch` ↔ 内部 `do_fetch`）**：

| 工具 | 输入 | 成功返回 |
|---|---|---|
| search_series | `q: string` | `{matches:[{series_id, descriptor, unit, freq}]}` |
| fetch_series | `series_id, range, fetch: boolean = false, source?: string` | `{series_id, rows:[{ts, value, unit, source}], meta:{series_id, source, fetched_at, asof, count, range}}`（meta 的 fetched_at/asof = 返回行的 max 值；meta.source = 返回行 source 集合（多源取 `"mixed"`，空结果 = null）；空结果 rows=[]、count=0、fetched_at/asof=null） |
| list_sources | 无 | `{sources:[{adapter_id, name, enabled, status, reason}]}` |
| reconcile | `series_id` | `{report:{series_id, checks:[...], warnings:[string]}}` |

**内部只读通道（AC-004-6 判定依据）**：serve 的同一 HTTP 端点提供内部只读子端点 `/internal/sources`、`/internal/search`、`/internal/jobs`、`/internal/reconcile`、`/internal/provenance`、`/internal/diff`（同令牌）；CLI 只读命令（list/jobs list/reconcile/provenance/diff）在写锁被占时经此路由查询。失败返回 HTTP 400 + `{error:{code, message, retryable}}`，CLI 原样输出 message（含 diff 不可比原因）。写锁由非 serve 写命令（fetch/import/config…）持有时无只读通道（DuckDB 单写者固有限制）：只读命令等待其释放写锁（≤ 30s）后本地读取，超时返回“写进程运行中，请稍后重试”；残留端点文件不可达时按同一规则处理。CLI 不抛裸异常：库文件损坏（“不可读（文件可能损坏）”）、目录库被锁定（“正被其他连接锁定，请稍后重试”）与其他意外错误均输出结构化 internal 错误，且不留写锁（只读/写/serve 三路一致）。

**空数据目录首启（只读命令，AC-004-6/AC-006-4）**：库文件尚不存在（或未初始化）时，只读命令使用内存目录（按当前清单编译）+ 空观测库照常返回，不在磁盘上建库、不取写锁；reconcile 对不存在的序列返回 warnings“无可用序列”。

**错误契约**：`{error:{code, message, retryable}}`；code↔retryable 映射（固定）：not_found=false / unauthorized=false / adapter_error=true / rate_limited=true / validation_error=false / internal=false。失败类别 → code：凭证未声明/缺失/读取/解密失败与上游 401/403 → unauthorized；序列/源/任务不存在、源未绑定取数实现 → not_found；参数/数据校验失败、配置目标不合法、diff 不可比 → validation_error；上游其余 4xx（如 404，序列代码/参数无效）→ validation_error；网络/上游 5xx/解析失败/上游调用超时 → adapter_error；上游 429 → rate_limited。

**MCP 执行模型**：工具与内部端点在工作线程中执行（不阻塞事件循环）；service 的全部数据访问经同一访问锁串行（单连接）；取数的网络阶段不持访问锁（批次创建与提交两段持锁），写路径另由写互斥串行。取数（fetch=true）先在专用单槽限流器上异步排队、再进工作线程：排队不占线程，只读请求的线程容量不被写请求耗尽；上游调用有硬超时，挂起不得长期占住写路径。

**realtime 接口签名（AC-004-4 判定依据）**：`base.Adapter.realtime_signature(descriptor, on_update)` 方法签名 + 模块级文档常量；测试以 import 断言方法存在与签名参数（无网络实现）。

**diff 汇总统计量（AC-005-2 判定依据）**：三类计数（新增/修订/删除）；ΣΔvalue = 修订值净变化总和；max|Δ| = 修订值最大绝对变化；新增/删除不计入 Δ。

### 2.3 描述符规范化、ID 派生与 8 槽渲染（AC-002-1/2/5 golden）

**规范化规则**（描述符 → 规范 JSON）：键集恒四键 {asset, geo, measure, contract}（contract 缺省输出空串）；枚举小写；contract 去首尾空白、不转小写；JSON 键排序；UTF-8 编码；`separators=(',',':')`。

**ID 派生**：规范 JSON 字节串 → SHA-256 → 取前 16 字节 → 32 位 hex 字符串。golden 向量随实现提交（含 contract 缺省与 SC2401 样例）。

**8 槽渲染映射**：`cat = asset → 槽1；geo → 槽2；槽3/4/5 = "-"；measure → 槽6；contract → 槽7（空串渲染为 "-"）；freq 元数据 → 槽8`。
示例：`{asset: sc, geo: world, measure: close, contract: ""} + freq=1d → sc.world.-.-.-.close.-.1d`；
`contract: "SC2401" → sc.world.-.-.-.close.SC2401.1d`。

## 3. 数据与存储

### 3.1 SQLite（catalog.sqlite，仅目录）

```
sources(id, adapter_id, name, enabled, status, manifest_path)
        -- status: ok/disabled/error；manifest_path 持久化适配器目录路径（冷启动按路径定位更新状态）
source_reasons(source_id PRIMARY KEY, reason)                  -- AC-001-2 用户可见报告：最近一次编译给出的 error/disabled 原因
        -- 注：优先级不在本表；唯一权威 = series_sources.priority（provides[].priority 默认 100 落库）；enabled 单一权威在本表
series(id, descriptor_json, display_id_8slot, unit, freq, tz,
      status, valid_to)  -- status: active/soft_deleted；valid_to = 软删时间戳（载体）
      -- 软删生命周期：series_sources 行**永不物理删除**（作为历史择优的优先级快照）；
      -- 同序列仍有其他提供源 → series 不移除；全部源移除 → series 标 soft_deleted；
      -- 源重新加入 → series 恢复 active、清 valid_to，series_sources 对应行更新
series_sources(series_id, source_id, priority, reg_order, unit, freq, tz, current)
        UNIQUE(series_id, source_id)                           -- source_id = sources.id；provides[].priority 落库于此，逐序列择优以此为准
        -- reg_order = 首次登记顺序（持久化，重建不重排；主源并列决胜用）；current = 该源本轮清单是否声明
        -- 目录重建 = SQLite 单事务（中途失败整体回滚；并发只读进程不见中间态）
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
- `latest_obs(series_id)` 与 `asof(series_id, t)` 共用同一择优函数；asof(t) = asof ≤ t 的行（AC-003-3）；可见时间比较按 naive UTC 纯算术进行（不经本机时区解释，夏令时不影响全序）
- **asof = finished_at（批次成功提交时刻）**；fetched_at = 拉取时间；run 提交前数据不可见
- 原子性：run 建在拉取前（running）；提交 = observations + run=succeeded 同一 DuckDB 事务；失败 = 独立事务标 failed（无部分数据行）；崩溃遗留 running → 冷启动时超时（>60min）标 failed
- **单写者**：service 打开 DuckDB 时持有数据目录写锁（plan §3.3 .lock）；CLI 写操作遇锁报错提示；CLI 只读命令（list/reconcile/provenance/diff）在锁被占时经 localhost MCP HTTP 路由查询；MCP 在 Backend 进程内，service 连接互斥串行化（Q-019/Q-029）；陈旧锁 = 持有者 PID 已不存在（进程存在但无权查询 → 视为存活）；DuckDB 文件被其他进程打开 → 报单写者占用错误（LockBusy），不抛裸 IO 异常

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

1. **冷启动**：service.init() → 扫描内置（包内资源）与用户适配器目录 → manifest 校验：**不可解析或字段非法的 manifest 一律把对应 source 标 error（按 manifest_path 定位：曾存在则原地改 status，未存在则以 adapter_id=文件路径登记虚拟条目；重复 id 的后到者同样标 error），报告路径+字段+原因；error 不影响其他适配器**（AC-001-3/4）→ 对比上次扫描：目录中消失的 source 标 disabled（软删，数据保留）→ 编译序列目录（series_sources 登记 provides 优先级；**编译 = 增/改/软删，不清空既有 series 行——全部 manifest 非法时历史序列仍可查询与对账**）→ 加载别名与覆盖 → **最后计算主源（候选 = status=ok 且 enabled=true 的启用源；enabled=false 视为非启用）**并写 series 派生缓存（unit/freq/tz = 主源值）（以上目录写入 = 单事务；error/disabled 原因写 source_reasons） → 按 `implementation` 绑定取数实例 → 清理超时 running 批次 → 就绪
2. **按需取数**（do_fetch=true）：解析实际请求窗口（effective_range，见 §2.1）→ 建 ingest_run（running，记录 series/实际请求窗口）→ 解析适配器与源符号 → adapter.fetch → 单位归一化检查 → **同一 DuckDB 事务**：写 observations + run=succeeded → 返回；任一步失败 → 无数据行 + 独立事务 run=failed；可重试错误（超时/5xx/限流）支持手动重试 = 新 run
3. **只读短路**（do_fetch=false）：仅查询现有数据（latest_obs/asof），不创建 run、不触发适配器、不写库
4. **diff**：两 run 仅当均为 succeeded、series_id 相同、source 相同、[range_start, range_end] 相同、unit/freq/tz 快照一致时可比；否则返回不可比原因（AC-005-2）
5. **对账**：reconcile(id) → 各源 manifest 声明的 unit/tz/freq 对比 → 报告（不静默换算）；展示口径跟随主源（优先级最低数值者，并列取 series_sources 注册顺序先者）
6. **MCP**：启动/生命周期见 §1（CLI `serve`）；四工具委托 service（连接互斥串行化）；**完整输入/返回/错误契约见 §2.2**

## 5. 验收对应

| AC | 实现位置 | 验证方式 |
|---|---|---|
| AC-001-1/2/3/4 | adapters/ + registry | tests/test_adapters.py（好/坏 manifest 样例按 §2.1 字段表；移除 → disabled、校验失败 → error、重复 id 后到者 → error 且先到者生效） |
| AC-002-1/2/3/4/5 | catalog/descriptor + aliases | tests/test_identity.py（golden 向量对拍 ID 与 8 槽（含 contract 缺省与 SC2401 样例）；**contract 非法字符/超长/纯空白拒绝样例**；归并；别名作用域与裁决；AC-002-4 grep 范围同 AC-009-2、阳性样例置 fixtures/manual_series_id_fixtures/） |
| AC-003-1/2/3/4 | store/duck + winners | tests/test_store.py（重放幂等；latest 两粒度；asof≡latest；决胜链含 tie-break 与手动覆盖） |
| AC-004-1/2/3/4/5/6 | fetch/ + jobs + cli | tests/test_fetch.py（mock adapter；原子性：中途失败无部分行 + run=failed；重试=新 run）；test_cli.py（config/jobs 持久化；add-source 写 manifest 骨架；**未知源/序列被拒的负向断言；enable/disable 重启后生效**）；AC-004-4 = base.Adapter 签名存在断言（import 测试）；AC-004-6 = serve 持锁下写命令报错 + 只读命令经 HTTP 路由断言（**含真实 serve 子进程端到端**）；空目录首启只读命令不抛异常、不建库 |
| AC-005-1/2 | store + ingest | tests/test_provenance.py（字段查询；同范围 diff 三分类；跨范围 → 覆盖不一致） |
| AC-006-1/2/3/4 | align.py | tests/test_align.py（单位/时区/频率不一致样例；manifest 权威裁决；退化分支：无主源 → 缓存沿用/置空 + report.warnings） |
| AC-007-1/2/3/4 | adapters/* | tests/test_adapters_*.py（akshare/EIA 固定响应样本 mock + 在线冒烟；import 向导样例文件；隔离性）；**指定合约（用户清单绑定 akshare）与库存日报经 清单→目录→取数→入库 全链路断言；凭证缺失经 fetch_series 返回 unauthorized/retryable=false** |
| AC-008-1/2/3/4 | mcp_server.py | tests/test_mcp.py（HTTP 调用四工具逐 schema；fetch 默认 false 短路断言无写库；结构化错误含 retryable 映射；serve 启动后端点可连接） |
| AC-009-1/2/3 | creds.py + 扫描 | tests/test_creds.py（保存/读取失败路径均报错）；grep：backend/ + 根 tests/（排除 fixtures/credential_scan_fixtures/，规则正则+阳/阴性样例随测试提交）；目录结构断言（plan §3.3） |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| akshare 接口漂移/限流/挂起 | 适配器隔离 + 受测版本约束（`backend/constraints.txt`；pyproject 仅声明兼容下界，升级须回归）+ 失败不回退（AC-004-3）；离线测试用固定响应样本 mock（库存在 SDK 的 HTTP 边界注入，覆盖符号映射与列解析）；SDK 内部请求无超时 → 适配器硬超时（守护线程，超时放弃） |
| DuckDB 单写者限制 | 写锁（plan §3.3 .lock）：service 持写锁，CLI 写操作遇锁报错；CLI 只读命令经 localhost HTTP 路由（端点发现 = data/mcp_endpoint.json）；MCP 进程内 + 连接互斥串行化（Q-019/Q-029） |
| Windows 编码/时区坑 | `PYTHONIOENCODING=utf-8`；系统时间（fetched_at/asof/批次时间）= naive UTC；观测 ts = 源声明时区下的时间标签（naive）+ 清单 tz 元数据（spec 非目标：v1 存原始时间戳）；带时区的查询范围/导入时间先换算到声明时区 |
| pywin32（DPAPI）不可用 | fail closed：拒绝保存/读取并报错（AC-009-1），无降级路径 |
| Python 3.14 wheel 可用性 | **实施首任务 = 依赖安装冒烟**（全依赖 pip install + import）；失败则调整版本约束并回 spec |
| MCP SDK 接口变动 | 锁定 mcp 版本；工具层只依赖 FastMCP 稳定 API；逐工具返回契约固定 |

调度器注记：v1 不引 APScheduler（任务注册表 + 手动触发）；architecture §3.5 已注记收窄，调度器随 daily-report feature 引入。

回滚：本 feature 未改动既有文档/代码之外的任何生产文件；数据目录为本地新建，可整目录删除重建。
