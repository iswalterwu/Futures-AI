# Feature: data-layer（spec.md）

> Spec 阶段产物：what/why 与验收规则，不含技术方案（技术落点引用 docs/architecture.md §3，实施细节在 plan.md）。
> **Gate 1 记录**：2026-10-26 首版批准（Walter）；同日 Checklist 双审核员（deepseek-flash / gpt-6.1-sol）发现 14 项阻断，
> 已按双审意见修订（修订点均登记于 §5 歧义记录），**待重新批准后冻结**。

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
- 序列身份：描述符派生 ID + 别名映射 + 同描述符归并
- 观测存储：DuckDB 追加写、latest_obs、asof 重建、供方竞争择优
- 取数模式：scheduled 骨架 + on_demand（agent 触发）；realtime 仅留接口
- 溯源与对齐最小集：provenance 字段、批次 diff、单位/时区/重采样对账
- v1 内置适配器：akshare（行情/仓单）、EIA（能源公开数据）、本地文件（CSV/Excel 向导映射）
- agent 工具（经 MCP 暴露）：search_series / fetch_series / list_sources / reconcile
- 凭证本地加密存储，代码零 fallback
- 最小 CLI 数据源配置入口（开发/测试期；正式 GUI 归 settings feature）

### 非目标

- realtime 行情流实现（Phase 2）
- 品种业务模型（供需/物流/平衡表口径 —— 后续 domain feature）
- 前端数据源配置界面（归 settings feature；本 feature 只提供 **CLI 入口**，service 门面供未来 API 包装，不交付任何 HTTP 端点）
- 第三方适配器生态与安装市场（Phase 4）
- 统一交易日历（v1 存原始时间戳 + freq 标记）

## 3. 需求条目

### R-001 适配器框架

- **what**：适配器 = 目录 + manifest（声明可产出序列、源符号映射、取数模式、更新语义、凭证要求）。程序启动时扫描内置与用户适配器目录，编译序列目录。
- **验收规则**：
  - [ ] AC-001-1 内置适配器目录与用户适配器目录均可被扫描并加载
  - [ ] AC-001-2 manifest 校验：缺失/非法字段的适配器被拒绝并报告原因，不影响其他适配器（manifest 必填字段与枚举见 plan §2）
  - [ ] AC-001-3 新增/移除适配器后，序列目录在下次启动（或显式 reload）时自动重建；移除适配器 = 该 source 标记 disabled（软删），既有序列与观测数据保留

### R-002 序列身份

- **what**：规范身份 = 描述符（asset/geo/measure/unit/freq）经规范化（键集固定、枚举小写、缺省为空串、JSON 键排序）后取 SHA-256 前 16 字节（32 hex 字符）为序列 ID；8 槽渲染格式仅用于显示（沿用 FTEngine 约定）；别名映射层把源侧符号映射到描述符（模板规则 + 模糊匹配 + 手动覆盖），冲突裁决顺序：手动 > 模板 > 模糊，别名带来源作用域。
- **验收规则**：
  - [ ] AC-002-1 同一描述符经规范化后产生确定且稳定的 ID（跨重启/跨机器不变）；canonical JSON 键排序 + 截断规则由测试对拍
  - [ ] AC-002-2 两个来源声明同一描述符 → 自动归并到同一序列
  - [ ] AC-002-3 别名映射可被用户手动覆盖，覆盖持久化；冲突时按"手动 > 模板 > 模糊"裁决
  - [ ] AC-002-4 同一 ID 永不手写分配（代码审查项：仓库内无人工编号入口，CI grep 检查）

### R-003 观测存储

- **what**：DuckDB observations 表按 architecture.md §3.3 的 schema（series_id/ts/value/unit/source/fetched_at/asof/ingest_run/payload_hash）。**追加写永不删行**；幂等 = `(series_id, ts, source, ingest_run)` 唯一索引 + 冲突忽略（同 run 重放不产生重复行、不覆盖历史）。latest_obs = 每 `(series_id, ts)` 按择优规则取当前版本；"每序列最新值" = 该序列最新 ts 的择优值。asof(t) = 每 `(series_id, ts)` 取 asof ≤ t 的最新摄入版本。fetched_at = 实际拉取时间；asof = 摄入批次时间（默认等于 fetched_at，允许修订批次显式标注）。
- **验收规则**：
  - [ ] AC-003-1 同 ingest_run 重放不产生重复行（唯一索引冲突忽略，不覆盖已保留历史）
  - [ ] AC-003-2 latest_obs 每 `(series_id, ts)` 返回择优值；latest(series_id) 返回最新 ts 的择优值
  - [ ] AC-003-3 asof(t) 返回任一时点所见（每 `(series_id, ts)` 取 asof ≤ t 的最新摄入版本）
  - [ ] AC-003-4 供方竞争择优：优先级数值低者胜；同优先级取 asof 最新；用户手动覆盖最优先。v1 基础版（FTEngine 五层分类不搬，architecture §3.3 已注记收窄）

### R-004 取数模式

- **what**：scheduled 骨架（任务注册表 + 查看 + 手动触发，不引调度器——architecture §3.5 已注记收窄）+ on_demand（fetch_series 触发适配器即时拉取 → 写库 → 返回）；realtime 仅定义接口签名。
- **验收规则**：
  - [ ] AC-004-1 fetch_series(series, range, source?, do_fetch=true) 触发按需取数并返回结果，数据同时写库
  - [ ] AC-004-2 scheduled 任务可注册/查看/手动触发（v1 骨架，不要求完整调度 UI）
  - [ ] AC-004-3 失败原子性：拉取/归一化/写入任一环节失败，本批次不产生部分写入（ingest_run 标记 failed），已有成功批次不回退；可重试错误（网络超时/5xx/限流）支持手动重试，重试 = 新 ingest_run

### R-005 溯源

- **what**：每个观测值可回答"哪来的、何时来、哪一批"；批次 diff 报告"什么变了、变多少"。
- **验收规则**：
  - [ ] AC-005-1 任意观测可查询其 source/fetched_at/ingest_run/payload_hash
  - [ ] AC-005-2 两个 ingest_run 之间可生成 diff：比较区间内 run A 有、run B 无的 `(series_id, ts, source)` 记为删除；数值变化记为修订；结果含新增/修订/删除三类与"变多少"汇总

### R-006 对齐校验

- **what**：同序列多源自动检查单位、时区/日历、重采样口径；**单位/时区/频率以 manifest 声明为唯一权威**（series 表字段为派生缓存，冲突时以 manifest 为准并出对账提示）；不一致进对账报告（v1 最小集：单位 + 时区 + 频率）。展示口径跟随主源（优先级最低数值者）。
- **验收规则**：
  - [ ] AC-006-1 两源同序列且 manifest 声明单位不同 → 对账报告提示（不静默换算），展示口径跟随主源
  - [ ] AC-006-2 时区/频率声明不一致 → 对账报告提示
  - [ ] AC-006-3 对账结果可查询（reconcile 工具）

### R-007 内置适配器

- **what**：akshare（能源板块核心品种 SC/FU/LU/BU/PG 主力与连续合约日线 + 交易所仓单/库存日报）、EIA（能源公开数据，用户自带 API key）、本地文件（CSV/Excel 向导式列映射）。更多数据源/板块后续按适配器机制新增。
- **验收规则**：
  - [ ] AC-007-1 akshare 适配器能拉取指定合约/连续合约日线并入库（离线测试用固定响应样本 mock；在线时跑冒烟）
  - [ ] AC-007-2 EIA 适配器经凭证库（DPAPI）按 manifest 的 credential_ref 读取用户 key，拉取公开数据集并入库（测试用固定响应样本）
  - [ ] AC-007-3 本地 CSV/Excel 经 CLI 向导映射后进入观测存储，且映射可保存复用（向导 = CLI 交互，本 feature 无 GUI）
  - [ ] AC-007-4 任一适配器失败不影响其他适配器与程序运行

### R-008 agent 工具（MCP）

- **what**：data 工具集经本地 MCP server 暴露给 pi：search_series / fetch_series / list_sources / reconcile。成功返回最小字段集 `{series_id, rows, meta}`；错误返回 `{error: {code, message, retryable}}`。
- **验收规则**：
  - [ ] AC-008-1 四个工具可经 MCP 调用并返回结构化结果（成功/错误契约见 what）
  - [ ] AC-008-2 fetch_series 工具默认 do_fetch=false（只读现有数据）；带显式 fetch 标志（用户/agent 明确请求）才触发按需取数与写库
  - [ ] AC-008-3 工具错误返回结构化错误（含 code/message/retryable，不抛裸异常给模型）

### R-009 凭证与隔离

- **what**：凭证存用户数据目录并加密（DPAPI）；**DPAPI 不可用 = 拒绝保存凭证并报错（fail closed，禁止明文降级）**；代码无硬编码凭证；每安装独立数据目录。
- **验收规则**：
  - [ ] AC-009-1 凭证文件不含明文（DPAPI 加密）；DPAPI 不可用时保存操作失败并报错（测试覆盖失败路径）
  - [ ] AC-009-2 代码库零凭证字面量（含测试 fixture）：grep 扫描范围 = backend/ 与 tests/ 全部文本文件，规则 = 常见 key/secret/token 模式，配阳性/阴性样例
  - [ ] AC-009-3 数据目录结构与 architecture.md §3/§4 一致，用户数据不入 Git

## 4. 约束与依赖

- 依赖决策：D-002（Python）、D-005（数据底座）、D-006（DuckDB + SQLite）、D-003（pi RPC + MCP）、D-009（知识层共用 DuckDB）
- 环境：Windows 11、Python 3.14；测试用隔离临时根，不接触真实私有数据（AGENTS.md §4）
- 前端不参与本 feature（无 HTTP 端点交付）；MCP 工具是给 pi 的接口
- Python 3.14 依赖可行性：实施首任务 = 依赖安装冒烟（全依赖 pip install + import），失败则调整版本锁定

## 5. 歧义记录（Clarify / 双审修订）

| # | 问题 | 回答 | 融入位置 |
|---|---|---|---|
| Q-001 | akshare v1 拉取范围 | 能源板块核心品种 SC/FU/LU/BU/PG 主力与连续合约日线 + 交易所仓单/库存日报；其他板块后续按适配器机制新增（2026-10-26） | R-007 |
| Q-002 | 本地文件映射方式 | 向导式半自动：猜测 + 确认/改列 + 模板复用；全自动留后续（2026-10-26） | R-007 |
| Q-003 | 供方竞争优先级 v1 复杂度 | 基础版：优先级数值 + 手动覆盖；五层分类留给平衡表 feature（2026-10-26） | R-003 |
| Q-004 | 无 GUI 阶段的最小配置入口 | 最小 CLI；GUI 归 settings feature（2026-10-26） | 目标 |
| Q-005 | 幂等与重放语义（双审 B-01/B-06） | 追加写永不删行；`(series_id, ts, source, ingest_run)` 唯一索引冲突忽略；不用 DELETE+INSERT（2026-10-26） | R-003 |
| Q-006 | 描述符规范化与 ID 截断（双审 B-07） | 键集固定/枚举小写/缺省空串/键排序 → SHA-256 前 16 字节；8 槽仅显示（2026-10-26） | R-002 |
| Q-007 | 适配器移除后数据归属（双审 B-09） | 软删：source 标记 disabled，序列与观测保留（2026-10-26） | R-001 |
| Q-008 | 单位/时区/频率权威来源（双审 B-10） | manifest 声明为唯一权威，series 表为派生缓存（2026-10-26） | R-006 |
| Q-009 | DPAPI 失败策略（双审 B-02） | fail closed：拒绝保存并报错，禁止明文降级（2026-10-26） | R-009 |
| Q-010 | 取数默认语义（双审 B-03） | MCP 工具默认只读；do_fetch=true 为显式取数（2026-10-26） | R-004/R-008 |
