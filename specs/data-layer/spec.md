# Feature: data-layer（spec.md）

> Spec 阶段产物：what/why 与验收规则，不含技术方案（技术落点引用 docs/architecture.md §3，实施细节在 plan.md）。
> **Gate 1 记录**：2026-10-26 首版批准（Walter）；同日 Checklist 双审发现 14 项阻断，经二至九轮复核修订（登记于 §5 Q-005~Q-029 与 D-012 ADR）。**待重新批准后冻结。**

## 1. 背景与动机（why）

四个产品痛点中，数据分散、不可追溯、无法按需取数都压在数据层上：

- 多供应商时间序列拼图（痛点 1）需要"标准序列 + 多源归并"；
- agent 按指令单次/实时提取并更新数据库（plan.md §7.3）需要按需取数模式；
- 平衡表等信息可追踪（痛点 3）需要观测级溯源与对账；
- 日报、图表、知识库表格全部依赖统一序列目录。

本 feature 交付**统一数据层骨架**，是后续所有 feature 的地基（D-005 / D-006）。

## 2. 目标与非目标

### 目标

- 声明式数据源适配器框架（manifest 加载/注册/目录自动编译）
- 序列身份：3 键描述符（asset/geo/measure）派生 ID + 别名映射 + 同描述符归并；unit/freq/tz 为序列元数据（非身份）
- 观测存储：DuckDB 追加写、latest_obs、asof 重建（与择优规则一致）、供方竞争择优（含决胜规则）
- 取数模式：scheduled 骨架 + on_demand（agent 触发）；realtime 仅定义接口签名
- 溯源与对齐最小集：provenance 字段、批次 diff（带覆盖范围约束）、单位/时区/重采样对账
- v1 内置适配器：akshare（行情/仓单）、EIA（能源公开数据）、本地文件（CSV/Excel 向导映射）
- agent 工具（经 MCP 暴露）：search_series / fetch_series / list_sources / reconcile
- 凭证本地加密存储，代码零 fallback，读取失败 fail closed；单写者（DuckDB 文件锁）
- 最小 CLI 数据源配置入口（开发/测试期；正式 GUI 归 settings feature）

### 非目标

- realtime 行情流实现（Phase 2）
- 品种业务模型（供需/物流/平衡表口径 —— 后续 domain feature）
- 前端数据源配置界面（归 settings feature；本 feature 只提供 **CLI 入口**，service 门面供未来 API 包装，**不交付任何前端业务 HTTP 端点（MCP streamable HTTP 除外）**）
- 第三方适配器生态与安装市场（Phase 4）
- 统一交易日历（v1 存原始时间戳 + freq 标记）

## 3. 需求条目

### R-001 适配器框架

- **what**：适配器 = 目录 + manifest（声明可产出序列、源符号映射、取数模式、更新语义、凭证要求）。程序启动时扫描内置与用户适配器目录，编译序列目录。manifest 必填字段、类型与枚举见 plan §2（字段契约在 Gate 1 前定稿，不推迟到实施）。
- **验收规则**：
  - [ ] AC-001-1 内置适配器目录与用户适配器目录均可被扫描并加载
  - [ ] AC-001-2 manifest 校验：缺失/非法字段的适配器被拒绝并报告原因，不影响其他适配器（判定依据 = plan §2.1 manifest 字段表）
  - [ ] AC-001-3 新增/移除适配器后，序列目录在下次启动（或显式 reload）时自动重建；**校验失败（含不可解析）= source 标 error（无论此前状态），数据保留；“移除”仅指目录中消失 = disabled（软删）**
  - [ ] AC-001-4 重复 id：按扫描顺序先加载者生效，后到者标 error 并报告“重复 id”（不影响先加载者与其他适配器）

### R-002 序列身份

- **what**：规范身份 = **3 键描述符 {asset, geo, measure}**（三键必填且非空、枚举小写）经规范化后取 SHA-256 前 16 字节（32 hex 字符）为序列 ID；unit/freq/tz 属于序列元数据，不参与身份。规范化输入规则：JSON 键排序、UTF-8 编码、`separators=(',',':')`（无缺省/空值分支，因三键均必填）。8 槽渲染格式仅用于显示：`asset.geo.-.-.-.measure.-.freq`（映射表见 plan §2.3，含 golden 对拍）。别名映射：源侧符号 → 描述符（模板规则 + 模糊匹配 + 手动覆盖），带来源作用域，裁决顺序：**手动 > manifest > 模板 > 模糊**。
- **验收规则**：
  - [ ] AC-002-1 同一描述符经规范化后产生确定且稳定的 ID（跨重启/跨机器/跨实现稳定）：规范化规则 = 三键必填、枚举小写、JSON 键排序、UTF-8 编码、`separators=(',',':')`；测试含 golden 向量
  - [ ] AC-002-2 两个来源声明同一 3 键描述符 → 自动归并到同一序列（unit/freq 不同仍归并，差异进对账 R-006）
  - [ ] AC-002-3 别名映射可被用户手动覆盖，覆盖持久化；别名带来源作用域；冲突时按"手动 > manifest > 模板 > 模糊"裁决
  - [ ] AC-002-4 同一 ID 永不手写分配（检查 = 独立规则：grep 模式 `(?<![\w.])series_id\s*=\s*["']` 禁止字面量赋值（负向后查避免误伤 `expected_series_id` 等测试变量），扫描范围同 AC-009-2；阳性样例置 `backend/tests/fixtures/manual_series_id_fixtures/`（在排除清单内）；构造性检查“ID 仅由 descriptor.derive() 产出”）
  - [ ] AC-002-5 8 槽渲染 ID 由 3 键描述符 + freq 元数据按映射表渲染，含 golden 对拍

### R-003 观测存储

- **what**：DuckDB observations 表（series_id/ts/value/unit/source/fetched_at/asof/ingest_run/payload_hash）。**追加写永不删行**；幂等 = `(series_id, ts, source, ingest_run)` 唯一索引 + 冲突忽略。latest_obs = 每 `(series_id, ts)` 按择优规则取当前版本；latest(series_id) = 最新 ts 的择优值。asof(t) = 取 asof ≤ t 的行按**同一择优规则**返回，保证 asof(now) ≡ latest_obs。**择优候选 = 全部源的观测行（数据不因源状态改变历史可见性；status 只影响配置角色：主源/默认拉取源/展示口径）**。择优规则（唯一全序）：优先级数值低者胜 → asof 新者胜 → ingest_run 大者胜（**ingest_run = DuckDB 自增 BIGINT，全局唯一，数值比较**）。**手动覆盖 = 替换该 source 的优先级值并参与同一决胜链，不存在独立于决胜链的绝对覆盖**。fetched_at = 实际拉取时间；**asof = 该批次成功提交的时刻（finished_at）**。历史择优配置语义：asof 查询只影响观测行可见性，择优使用**当前**配置（历史配置版本化留 Phase 2，明确不承诺）。
- **验收规则**：
  - [ ] AC-003-1 同 ingest_run 重放不产生重复行（唯一索引冲突忽略，不覆盖已保留历史）
  - [ ] AC-003-2 latest_obs 每 `(series_id, ts)` 返回择优值；latest(series_id) 返回最新 ts 的择优值
  - [ ] AC-003-3 asof(t) = 取 asof ≤ t 的行按同一择优规则返回（asof(now) 与 latest_obs 一致；asof 为批次提交时刻，不会"看到"提交前不存在的数据）
  - [ ] AC-003-4 择优唯一全序：优先级低者胜 → asof 新者胜 → ingest_run（自增 BIGINT，数值比较）大者胜；手动覆盖 = 替换该 source 优先级值并参与同一决胜链；v1 基础版（FTEngine 五层分类不搬，architecture §3.3 已注记收窄）

### R-004 取数模式

- **what**：scheduled 骨架（任务注册表 + 查看 + 手动触发，不引调度器）+ on_demand（fetch_series 触发适配器即时拉取 → 写库 → 返回）；realtime 仅定义接口签名（不实现）。
- **验收规则**：
  - [ ] AC-004-1 service.fetch_series(series_id, range, do_fetch, source=None) 的 do_fetch **无默认值，调用方必须显式传入**；source=None = 该序列 status=ok 的启用源中优先级数值最小者（并列取注册顺序先者；**无 ok 源 → 返回 not_found**）；**source 参数仅作用于 do_fetch=true 的拉取来源选择，只读分支忽略 source（返回跨源择优结果）**；do_fetch=true 触发按需取数并写库返回；CLI fetch 命令 = true，MCP 工具 = false（见 R-008）
  - [ ] AC-004-2 scheduled 任务可注册/查看/手动触发（v1 骨架，不要求完整调度 UI）；CLI 提供 jobs 子命令
  - [ ] AC-004-3 失败原子性：ingest_run 在拉取前创建（running），拉取/归一化/写入任一环节失败 → run 标记 failed，本批次不产生部分写入；已有成功批次不回退；可重试错误（网络超时/5xx/限流）支持手动重试，重试 = 新 ingest_run
  - [ ] AC-004-4 realtime 仅定义接口签名（base.Adapter 中存在签名定义，测试 import 断言存在即可），不实现、不测试网络行为
  - [ ] AC-004-5 CLI `config` 子命令可配置数据源并持久化（重启后生效）；**config 只能配置已有 manifest 的源**（凭证/优先级/别名），`add-source` = 在用户适配器目录写入 manifest 骨架文件
  - [ ] AC-004-6 单写者：数据目录**写锁**互斥——持写锁进程在运行，CLI 写操作报错退出并提示（锁冲突断言入测试）；只读查询以 DuckDB read_only 连接执行，不受写锁影响

### R-005 溯源

- **what**：每个观测值可回答“哪来的、何时来、哪一批”；批次 diff 报告“什么变了、变多少”。**交付入口**：CLI `provenance <series_id>`（按值查 source/fetched_at/ingest_run/payload_hash）与 `diff <run_a> <run_b>`（开发者工具，不进 MCP 工具集）。ingest_run 记录 (adapter_id, series_id, range_start, range_end, unit, freq, tz 快照)；**diff 仅在两个 status=succeeded 的 run、同 series_id、同 source（adapter）、覆盖范围相同、unit/freq/tz 快照一致时可比**，否则报告不可比原因而非误报删除。
- **验收规则**：
  - [ ] AC-005-1 任意观测可查询其 source/fetched_at/ingest_run/payload_hash（CLI `provenance <series_id>` 可执行）
  - [ ] AC-005-2 两个成功且同 series、同 source、同覆盖范围、同 unit/freq/tz 快照的 ingest_run 之间可生成 diff（CLI `diff <run_a> <run_b>` 可执行）：run A 有、run B 无的 `(series_id, ts, source)` 记为删除；数值变化记为修订；汇总含三类计数、ΣΔvalue、max|Δ|；不满足可比条件 → 报告不可比原因

### R-006 对齐校验

- **what**：同序列多源自动检查单位、时区/日历、重采样口径；**单位/时区/频率以 manifest 声明为唯一权威**；series 表为派生缓存：unit/freq/tz 取主源（**主源候选 = status=ok 的启用源**，优先级数值最小者，并列取注册顺序先者；**全源非 ok → 沿用最后一次缓存值并对账报告标 warning**）的声明值，冷启动编译时写入；不一致进对账报告（v1 最小集：单位 + 时区 + 频率）。展示口径跟随主源，不静默换算。
- **验收规则**：
  - [ ] AC-006-1 两源同序列且 manifest 声明单位不同 → 对账报告提示（不静默换算），展示口径跟随主源
  - [ ] AC-006-2 时区/频率声明不一致 → 对账报告提示
  - [ ] AC-006-3 对账结果可查询（reconcile 工具）

### R-007 内置适配器

- **what**：akshare（能源板块核心品种 SC/FU/LU/BU/PG 主力与连续合约日线 + 交易所仓单/库存日报）、EIA（能源公开数据，用户自带 API key）、本地文件（CSV/Excel 向导式列映射）。更多数据源/板块后续按适配器机制新增（新增品种/枚举值须先修订本 spec 的封闭枚举并过 Gate，机制不变）。
- **验收规则**：
  - [ ] AC-007-1 akshare 适配器能拉取指定合约/连续合约日线以及交易所仓单/库存日报并入库（离线测试用固定响应样本 mock；在线时跑冒烟）
  - [ ] AC-007-2 EIA 适配器经凭证库（DPAPI）按 manifest 的 credential_ref 读取用户 key，拉取公开数据集并入库（测试用固定响应样本）；key 读取失败 → fail closed 报错
  - [ ] AC-007-3 本地 CSV/Excel 经 CLI 向导（import 子命令）映射后进入观测存储，且映射可保存复用（向导 = CLI 交互，本 feature 无 GUI）
  - [ ] AC-007-4 任一适配器失败不影响其他适配器与程序运行

### R-008 agent 工具（MCP）

- **what**：data 工具集经本地 MCP server（streamable HTTP，localhost，由 Backend 进程内提供）暴露给 pi。**生命周期：service.start_mcp()/stop_mcp()；v1 启动入口 = CLI `serve` 子命令**（desktop-shell 阶段由 Backend 进程托管）。**输入契约**：`search_series(q: string)`（q 匹配 = 3 键描述符字段与别名的子串匹配；返回 descriptor = 3 键 dict）；`fetch_series(series_id, range, fetch: boolean = false, source?: string)`，range = `{start: ISO8601, end: ISO8601}`（**end 为闭区间**），source = adapter_id（仅作用于 fetch=true 的拉取来源）；`list_sources()`；`reconcile(series_id)`。**返回契约**：search_series → `{matches:[{series_id, descriptor, unit, freq}]}`；fetch_series → `{series_id, rows:[{ts, value, unit, source}], meta:{series_id, source, fetched_at, asof, count, range}}`（meta 的 fetched_at/asof = 返回行的 max 值；**meta.source = 返回行 source 集合（多源时取 `"mixed"`）**；空结果 rows=[]、count=0、fetched_at/asof=null）；list_sources → `{sources:[{adapter_id, name, enabled, status}]}`；reconcile → `{report:{series_id, checks:[{kind: unit|tz|freq, source_a, source_b, status: ok|mismatch, detail}]}}`；错误统一 `{error:{code, message, retryable}}`，code 枚举与 retryable 映射：not_found=false / unauthorized=false / adapter_error=true / rate_limited=true / validation_error=false / internal=false。
- **验收规则**：
  - [ ] AC-008-1 四个工具可经 MCP 调用并返回各自契约的结构化结果（逐工具 schema 见 what）
  - [ ] AC-008-2 fetch_series 工具参数 `fetch` 默认 false（**MCP 层参数 `fetch` ↔ service 层 `do_fetch`**）：走只读短路分支（仅查询现有数据，不触发适配器、不写库）；带显式 fetch 标志才触发按需取数与写库
  - [ ] AC-008-3 工具错误返回结构化错误（含 code/message/retryable，retryable 取值符合 what 中 code↔retryable 映射表；不抛裸异常给模型）
  - [ ] AC-008-4 CLI `serve` 启动后 MCP HTTP 端点可连接（生命周期断言）

### R-009 凭证与隔离

- **what**：凭证存用户数据目录 `creds/` 并加密（DPAPI）；**保存与读取两条路径均 fail closed**（DPAPI 不可用 = 拒绝保存并报错；读取/解密失败 = 报错，禁止返回明文或 None）；代码无硬编码凭证；每安装独立数据目录。
- **验收规则**：
  - [ ] AC-009-1 凭证文件不含明文（DPAPI 加密）；保存失败与读取失败两条路径均报错（测试覆盖）
  - [ ] AC-009-2 代码库零凭证字面量：扫描范围 = backend/（含 backend/tests/）与仓库根 tests/（若存在），排除 `backend/tests/fixtures/credential_scan_fixtures/` 与 `backend/tests/fixtures/manual_series_id_fixtures/`（路径根与扫描根一致）；规则 = 可执行正则组（大小写不敏感）：① `(?i)(api[_-]?key|apikey|secret|token|password)\s*[:=]\s*["'][^"']{8,}["']`；② `(?i)(api[_-]?key|apikey|secret|token|password)\s*[:=]\s*(?!\s*[A-Za-z0-9_\-]*\()\s*[A-Za-z0-9_\-]{8,}`（负向预查排除函数调用赋值）；③ `(?i)(api[_-]?key|apikey|secret|token|password)\s*:\s*str\s*=\s*["'][^"']{8,}["']`（类型注解赋值）；阳性样例置于排除目录且须命中三条之一（漏检即测试失败，新变形随时补样例）
  - [ ] AC-009-3 数据目录结构与 plan §3.3 权威布局一致（统一 `creds/` 命名），用户数据不入 Git；测试断言目录结构

## 4. 约束与依赖

- 依赖决策：D-002（Python）、D-005（数据底座）、D-006（DuckDB + SQLite）、D-003（pi RPC + MCP）、D-009（知识层共用 DuckDB）
- 环境：Windows 11、Python 3.14；测试用隔离临时根，不接触真实私有数据（AGENTS.md §4）
- 前端不参与本 feature（无 HTTP 端点交付）；MCP 工具是给 pi 的接口（Backend 进程内 HTTP，单写者）
- Python 3.14 依赖可行性：实施首任务 = 依赖安装冒烟（全依赖 pip install + import），失败则调整版本锁定

## 5. 歧义记录（Clarify / 多轮双审修订）

| # | 问题 | 回答 | 融入位置 |
|---|---|---|---|
| Q-001 | akshare v1 拉取范围 | 能源板块核心品种 SC/FU/LU/BU/PG 主力与连续合约日线 + 交易所仓单/库存日报；其他板块后续按适配器机制新增（2026-10-26） | R-007 |
| Q-002 | 本地文件映射方式 | 向导式半自动：猜测 + 确认/改列 + 模板复用；全自动留后续（2026-10-26） | R-007 |
| Q-003 | 供方竞争优先级 v1 复杂度 | 基础版：优先级数值 + 手动覆盖；五层分类留给平衡表 feature（2026-10-26） | R-003 |
| Q-004 | 无 GUI 阶段的最小配置入口 | 最小 CLI；GUI 归 settings feature（2026-10-26） | 目标 |
| Q-005 | 幂等与重放语义（双审 B-01/B-06） | 追加写永不删行；唯一索引冲突忽略；不用 DELETE+INSERT（2026-10-26） | R-003 |
| Q-006 | 描述符规范化与 ID 截断（双审 B-07） | 键集固定/键排序/UTF-8 → SHA-256 前 16 字节；golden 对拍（2026-10-26；**“缺省空串”规则已被 Q-021 取代：三键必填，无缺省分支**） | R-002 |
| Q-007 | 适配器移除后数据归属（双审 B-09） | 软删：source 标记 disabled，序列与观测保留（2026-10-26） | R-001 |
| Q-008 | 单位/时区/频率权威来源（双审 B-10） | manifest 声明为唯一权威，series 表为派生缓存（2026-10-26） | R-006 |
| Q-009 | DPAPI 失败策略（双审 B-02） | fail closed：保存与读取均拒绝并报错，禁止明文降级（2026-10-26） | R-009 |
| Q-010 | 取数默认语义（双审 B-03） | service 无默认（显式传入）；CLI fetch=true；MCP 默认 false（2026-10-26） | R-004/R-008 |
| Q-011 | 身份键集（复核 B9：unit/freq 入身份致 AC-006 不可达） | 身份收窄为 3 键 {asset, geo, measure}；unit/freq/tz 为元数据（2026-10-26） | R-002/R-006 |
| Q-012 | 跨库失败原子性（复核 D18） | ingest_runs 移入 DuckDB（与 observations 同文件），单事务原子（2026-10-26） | R-003/R-004/plan §3.2 |
| Q-013 | MCP 进程模型与单写者（复核 D19） | MCP 改为 streamable HTTP、Backend 进程内提供；pi 经 URL 连接（2026-10-26） | R-008 |
| Q-014 | 择优最终决胜（复核 D5） | 优先级低 → asof 新 → ingest_run 大（2026-10-26） | R-003 |
| Q-015 | diff 覆盖范围（复核 C8/D6） | 仅同 series + 同覆盖范围可比；否则报告覆盖不一致（2026-10-26） | R-005 |
| Q-016 | MCP 逐工具 schema（复核 D10） | 四工具各自最小返回契约（2026-10-26） | R-008 |
| Q-017 | asof 时间点语义（三轮复核） | asof = 批次成功提交时刻（finished_at），数据对世界可见的时间点；asof(t) = asof ≤ t 的行（2026-10-26） | R-003 |
| Q-018 | 历史择优配置语义（三轮复核） | asof 只影响行可见性，择优用当前配置；历史配置版本化留 Phase 2，明确不承诺（2026-10-26） | R-003 |
| Q-019 | CLI 与 Backend 单写者（三轮复核） | DuckDB 打开时持数据目录文件锁；CLI 写操作遇锁报错提示；MCP 进程内串行化（2026-10-26） | plan §3.2/§6 |
| Q-020 | diff 可比条件（三轮复核） | 仅两个 succeeded、同 series、同 source、同覆盖范围的 run 可比（2026-10-26） | R-005 |
| Q-021 | 三键必填与空值规则（六轮复核） | 三键必填且非空，规范化无缺省/空值分支（2026-10-26） | R-002 |
| Q-022 | 优先级单一权威（六轮复核） | 唯一权威 = series_sources.priority；sources 表不存优先级列（2026-10-26） | plan §3.1 |
| Q-023 | MCP 参数名映射（六轮复核） | MCP 层参数 `fetch` ↔ service 层 `do_fetch`（2026-10-26） | R-008 |
| Q-024 | 重复 id 归属（五/六轮复核） | 先加载者生效，后到者标 error 并报告（2026-10-26） | AC-001-4 |
| Q-025 | 枚举封闭与扩展（五轮复核） | 封闭清单，新增须先修订 spec 过 Gate，禁止运行时注册（2026-10-26） | plan §2.1 |
| Q-026 | v1 收窄与语义裁定入 ADR（六轮复核） | 十项裁定登记为 D-012（2026-10-26） | D-012 |
| Q-027 | 择优候选与状态关系（九轮复核） | 择优候选 = 全部源的观测行（历史可见性不因状态改变）；status 只影响配置角色（主源/默认拉取源/展示口径）（2026-10-26） | R-003/R-006 |
| Q-028 | 全源非 ok 退化行为（九轮复核） | 主源/派生缓存：沿用最后一次缓存值 + 对账 warning；source=None 拉取：返回 not_found（2026-10-26） | R-006/AC-004-1 |
| Q-029 | MCP 生命周期与只读旁路（九轮复核） | MCP v1 启动入口 = CLI serve；只读查询以 DuckDB read_only 连接执行，不受写锁影响（2026-10-26） | R-008/AC-004-6 |
