# Feature: data-layer（spec.md）

> Spec 阶段产物：what/why 与验收规则，不含技术方案（技术落点引用 docs/architecture.md §3，实施细节在 plan.md）。

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

### 非目标

- realtime 行情流实现（Phase 2）
- 品种业务模型（供需/物流/平衡表口径 —— 后续 domain feature）
- 前端数据源配置界面（归 settings feature；本 feature 只提供 API/CLI 入口）
- 第三方适配器生态与安装市场（Phase 4）
- 统一交易日历（v1 存原始时间戳 + freq 标记）

## 3. 需求条目

### R-001 适配器框架

- **what**：适配器 = 目录 + manifest（声明可产出序列、源符号映射、取数模式、更新语义、凭证要求）。程序启动时扫描内置与用户适配器目录，编译序列目录。
- **验收规则**：
  - [ ] AC-001-1 内置适配器目录与用户适配器目录均可被扫描并加载
  - [ ] AC-001-2 manifest 校验：缺失/非法字段的适配器被拒绝并报告原因，不影响其他适配器
  - [ ] AC-001-3 新增/移除适配器后，序列目录在下次启动（或显式 reload）时自动重建

### R-002 序列身份

- **what**：规范身份 = 描述符（asset/geo/measure/unit/freq）的稳定哈希派生 ID；8 槽渲染格式沿用 FTEngine 约定；别名映射层把源侧符号映射到描述符（模板规则 + 模糊匹配 + 手动覆盖）。
- **验收规则**：
  - [ ] AC-002-1 同一描述符产生确定且稳定的 ID（跨重启不变）
  - [ ] AC-002-2 两个来源声明同一描述符 → 自动归并到同一序列
  - [ ] AC-002-3 别名映射可被用户手动覆盖，覆盖持久化
  - [ ] AC-002-4 同一 ID 永不手写分配（无人工编号入口）

### R-003 观测存储

- **what**：DuckDB observations 表按 architecture.md §3.3 的 schema（series_id/ts/value/unit/source/fetched_at/asof/ingest_run/payload_hash）；追加写永不删行；latest_obs 视图；asof 可重建任一时点；同序列多源按优先级择优。
- **验收规则**：
  - [ ] AC-003-1 写入为追加语义，重复摄入不产生重复观测行（幂等：同 ingest_run 重放不重复）
  - [ ] AC-003-2 latest_obs 返回每序列最新值
  - [ ] AC-003-3 asof 查询返回任一时点所见（含修订后历史）
  - [ ] AC-003-4 供方竞争：同序列多源逐点择优，优先级规则可配置

### R-004 取数模式

- **what**：scheduled 骨架（注册任务 + 执行 + 状态）+ on_demand（fetch_series 触发适配器即时拉取 → 写库 → 返回）；realtime 仅定义接口签名。
- **验收规则**：
  - [ ] AC-004-1 fetch_series(series, range, source?) 触发按需取数并返回结果，数据同时写库
  - [ ] AC-004-2 scheduled 任务可注册/查看/手动触发（v1 骨架，不要求完整调度 UI）
  - [ ] AC-004-3 取数失败有明确错误与重试语义，不污染已存数据（失败不回退）

### R-005 溯源

- **what**：每个观测值可回答"哪来的、何时来、哪一批"；批次 diff 报告"什么变了、变多少"。
- **验收规则**：
  - [ ] AC-005-1 任意观测可查询其 source/fetched_at/ingest_run/payload_hash
  - [ ] AC-005-2 两个 ingest_run 之间可生成 diff（新增/修订/删除值）

### R-006 对齐校验

- **what**：同序列多源自动检查单位、时区/日历、重采样口径；不一致进对账报告（v1 最小集：单位 + 时区 + 频率）。
- **验收规则**：
  - [ ] AC-006-1 两源同序列且单位不同 → 对账报告提示（不静默换算）
  - [ ] AC-006-2 时区/频率不一致 → 对账报告提示
  - [ ] AC-006-3 对账结果可查询（reconcile 工具）

### R-007 内置适配器

- **what**：akshare（油品相关期货行情 + 交易所仓单/库存）、EIA（能源公开数据，用户自带 API key）、本地文件（CSV/Excel 向导式列映射）。
- **验收规则**：
  - [ ] AC-007-1 akshare 适配器能拉取指定合约/连续合约日线并入库（网络可用时）
  - [ ] AC-007-2 EIA 适配器使用用户配置的 key 拉取公开数据集并入库
  - [ ] AC-007-3 本地 CSV/Excel 经向导映射后进入观测存储，且映射可保存复用
  - [ ] AC-007-4 任一适配器失败不影响其他适配器与程序运行

### R-008 agent 工具（MCP）

- **what**：data 工具集经本地 MCP server 暴露给 pi：search_series / fetch_series / list_sources / reconcile。
- **验收规则**：
  - [ ] AC-008-1 四个工具可经 MCP 调用并返回结构化结果
  - [ ] AC-008-2 fetch_series 默认只读现有数据，带 fetch 标志时触发按需取数（写库经显式授权）
  - [ ] AC-008-3 工具错误返回结构化错误（不抛裸异常给模型）

### R-009 凭证与隔离

- **what**：凭证存用户数据目录并加密（DPAPI）；代码无硬编码凭证；每安装独立数据目录。
- **验收规则**：
  - [ ] AC-009-1 凭证文件不含明文（DPAPI 加密）
  - [ ] AC-009-2 代码库零凭证字面量（含测试 fixture）
  - [ ] AC-009-3 数据目录结构与 architecture.md §3/§4 一致，用户数据不入 Git

## 4. 约束与依赖

- 依赖决策：D-002（Python）、D-005（数据底座）、D-006（DuckDB + SQLite）、D-003（pi RPC + MCP）、D-009（知识层共用 DuckDB）
- 环境：Windows 11、Python 3.14；测试用隔离临时根，不接触真实私有数据（AGENTS.md §4）
- 前端不参与本 feature（仅 API 边界）；MCP 工具是给 pi 的接口

## 5. 歧义记录（Clarify 阶段填写）

| # | 问题 | 回答 | 融入位置 |
|---|---|---|---|
| Q-001 | akshare v1 拉取范围（哪些品种/哪些接口） | 待确认 | R-007 |
| Q-002 | 本地文件映射：完全自动 vs 向导式半自动 | 待确认 | R-007 |
| Q-003 | 供方竞争优先级 v1 复杂度（基础版 vs FTEngine 全部分层） | 待确认 | R-003 |
| Q-004 | 无 GUI 阶段的最小配置入口（CLI？） | 待确认 | R-004 / 非目标 |
