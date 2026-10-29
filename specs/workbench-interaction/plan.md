# Feature: workbench-interaction 实施计划（plan.md）

> Plan 阶段产物。需求在 `spec.md`（2026-10-28 Gate 1 批准冻结，9 条需求 / 46 条 AC），本文只写实现机制与验收落点，不复制需求。
> 依据：`docs/interaction.md` §3/§7、`docs/designUI.md` §2.4/§3/§5.2/§7、`specs/frontend-workbench/plan.md`（地基与约定）、D-016。
> **2026-10-28 Checklist R1 修订**：针对 A 的 B-01～B-08 / S-01～S-10 补设计；冻结 spec 不变。以下是待 A 复核的修正，不是审核通过，不授权 Tasks / Implement。
> **2026-10-28 Checklist R3 补正（待 A R4 复核）**：只针对 R3 阻断项做设计补全——B-09（§2.4 `SourceNote.publishedAt`、§3 日期命名）与 B-10（§2.4 `Deliverable` 定稿元数据与 `DeliverableStatusLabel`、§2.4 场景样例、§4.1 / §4.6、§5 AC-003-3 / AC-006-7 / AC-008-1 断言落点）。冻结 spec v1.1、AC 数量与需求、docs 权威均不变；B-01～B-08 已闭环的方法、场景、状态迁移、版本 / 旁路语义，六类块、产物状态与外部依赖闸门不变；S-11～S-17 仍归 Tasks。本补正待 A 新开会话做 R4 复核，**不表示 B-09 / B-10 已审核关闭**，不授权 Tasks / Implement。
> **2026-10-28 恢复轮 r6（接口精化 + 实施基线登记；待 A 新会话定向复核 = Checklist R7）**：① 登记 `implementation_base_sha = 43b6d79681a49562f41751368b2ae00c24062f56`（PR #7 merge commit，见 §1.1）；② 与 frontend-workbench v2（只读参照 `ded7161`，v2.1 Gate 1 已批准）plan §7.3 / tasks §1.2 的 H-1～H-6 与页面切片对拍，在**既有需求与既有设计意图内**补接口机制精度：§1 文件边界（`main.ts` 作业注册内容）、§2.1（`registerJobRoutes` 与会话上下文守卫）、§2.3（jobsStore 共享未筛选缓存与统一刷新、intakeStore 公开接口、sessionStore 设置 / 清空时机、fixture 初始收件箱条目）、§2.4（`ACTIVE_JOB_STATUSES`、`JobListItem` 字段、`jobFixtures` 语义）、§6 回滚、§7。冻结 spec v1.1、46 AC、方法集、动作矩阵、九场景、样例表、rerun 迁移表、定稿语义均不变；完整对拍见 `interface-handoff.md`。本补正**不是审核通过**，不授权 Implement。阶段记录：Plan = claude-opus-5-5 via anthropic（本窗口协调器探活 `claude-bridge/claude-opus-5-5` exit 1，quota / rate / spend_limit 类；同模型 anthropic exit 0；只换通道、未改配置）。
> **2026-10-28 r6.1（Checklist R7 P3 精度修订，开工前）**：按 R7「下一步」2 的授权范围只吸收措辞 / 断言精度——S-27（§2.4 `jobFixtures` 句：`job-state.ts` 为模块级唯一共享会话状态，由 `createMockDataClient()` 建立 / 重建，AgentClient 共用当前状态）、S-29（§2.3 种子句：j-failed 只有阶段态 conflict，分析产物 draft，不预置条目）、S-30（动作矩阵“追问”行：经 `agentClient.send` 直接发送、不带 sessionId）；S-28 落在 tasks T-A18 标准 4。不改行为、方法集、AC、任务数、依赖与工时，不需重过 R7。IMPL-GATE-R6 当前状态（三项已满足、实现分支待带入本规格后开码）以 tasks.md 页首「当前开工状态」块为准；本文件 §1.1 / §7 中“待 R7 / 待授权”为当时原文。作者 = claude-opus-5-5 via anthropic（bridge 本窗口已限额，未重试；未改配置）。
> **2026-10-29 r6.2（Converge batch-a09a 精度登记，实施后）**：首批 T-A01～T-A09a 已实施（代码 diff `8753fa9..13a3373`，待独立 Review）。实施中定形的最小字段事实只按精度同步到 §2.4 `Artifact`、`RecipeStep`、`Deliverable / Block`（表格单元）、`FinalSnapshot` 行与 fixture 句（标【r6.2】）：`FinalSnapshot.revisionNumber` 为 S-18 既有“快照版本号”比较对象的承载字段；工作区按阶段携带限定 kind 的 `artifacts[]` / `revisions[]`；修订锚取 `Revision.id`；fixture 文件形状。不改行为、方法集、动作矩阵、九场景、样例表、定稿语义、46 AC 与任务结构；不是需求变更（见 analyze.md「Analyze R8」、`converge-batch-a09a.md` §3）。作者 = claude-opus-5-5 via anthropic（bridge 本窗口已明确限额，未重试；未改配置）。
> **2026-10-29 r6.4（Checklist R8 B-12 粒度修订，未实施；只动 tasks 拆分与本文件两处文字）**：独立 A 的 Checklist R8 未通过（唯一 P2 = B-12：T-A10 并入 R-B 后越出 0.5～2 h 粒度上限）。按其最小关闭要求只在 Tasks 层拆分：R-B 种子校正单列为 tasks **T-A09b**（fixture-only，0.5 h，依赖 T-A08），T-A10 恢复核心 2 h、只经真实 `getStageWorkspace` 读回验证；本文件只在 §2.4 R-B 句尾补落地任务号、§1 徽标句把 designUI 引用更正为 §6（R8 S-33）。设计、行为、方法集、样例表、迁移表、定稿语义、冻结 spec / 46 AC 均不变；不是需求变更（analyze.md「Analyze R10」）。作者 = claude-opus-5-5 via anthropic（本轮协调器真实调用 `claude-bridge/claude-opus-5-5` 为 provider / invocation 失败、未确认 quota，官方 anthropic 通道成功；只换通道、未改配置）。
> **2026-10-29 r6.3（第二批开工前精度澄清，未实施）**：只为第二批（T-A10 / T-A22 / T-A22b / T-A23 / T-A24）开码前补最小精度（标【r6.3】）：§2.4 fixture 句登记 R-B 种子口径（内置种子中 `not_started` 阶段为空工作区；fixture-only，不是读侧推导、不是 schema 不变量）；§2.1 / §2.3 登记 H-4 只读上下文的生产路由绑定入口 `bindRouter(router)`（只注册既有 `afterEach` 守卫、不接受任意上下文，不是 setter）；§1 徽标为自制组件、不导入 shared `Badge.vue`（基线事实）。R-D（五处跨字段约束）口径 = 不加 refine、由对应写方法按构造保持，只登记在 tasks / implementation-log。冻结 spec v1.1、46 AC、行为、方法集、动作矩阵、九场景、样例表、rerun 迁移表、定稿语义、任务数 / 依赖 / 工时均不变；不是需求变更（analyze.md「Analyze R9」）。作者 = claude-opus-5-5 via anthropic（本轮协调器最小真实调用 `claude-bridge/claude-opus-5-5` exit 1，provider / invocation error 类、非已确认限额；同模型 anthropic exit 0；只换通道、未改配置）。
> **派工记录（脱敏）**：角色 = Plan 补正；任务 = B-09 / B-10；基线 `8bd1b31`；Plan = claude-opus-5-5 via anthropic。通道切换原因：claude-bridge 通道在本限额窗口的 R3 真实探活（对象 `claude-bridge/claude-fable-5-1`）已失败（quota / rate / spend_limit 类，exit 1），按 AGENTS §6 规则 5 不重复试已耗尽通道，本阶段**未发起任何 claude-bridge 调用**；`anthropic/claude-opus-5-5` 最小真实调用成功（exit 0）。只换通道，不换模型，不改任何 provider / 路由 / 配置。

## 1. 技术方案

- **栈**：沿用 `frontend-workbench`——Vue 3.5 + Vite 8 + TypeScript、Pinia、vue-router、ECharts 6、zod 4；Vitest + @vue/test-utils、Playwright；pnpm / Node ≥ 22.12（版本以该 feature 锁定为准，本 feature 不升级工具链）
- **交付形态**：纯前端 + mock；真实后端归 `api`，真实解析/闸门归知识库 feature，真实 agent 归 agent-runtime。界面层零直接网络调用（沿用 `check --only network`）
- **新代码落点**：`frontend/src/jobs/`（页面 / 组件 / stores / diff / 本地持久化）；契约扩展在 `frontend/src/contracts/`；测试在 `frontend/tests/`、`frontend/e2e/`
- **契约版本**：`CONTRACT_VERSION` 1.0.0 → **2.0.0**。保留既有方法/字段语义，事件与 `SendMessage` 只加可选 `jobContext`；旧消息/事件 fixtures 不加该字段仍可解析。新增必实现的 `DataClient` 方法及封闭场景枚举使旧 real 实现不再满足接口，故统一升 MAJOR；不承诺旧 bootstrap 通过新 `z.literal(CONTRACT_VERSION)`，bootstrap 必须声明 2.0.0
- **复用**：design tokens / 三层玻璃 / `Num` / `Kpi` / 三态 / 对话抽屉 / CoT 时间线 / ECharts 暗色主题 / `check.mjs` / 契约生成器。**不新增颜色字面量与玻璃层级**
- **状态徽与来源徽**：只用既有令牌（文字主/次、琥珀；点睛红只作图标/边，不作文字），以文案 + 图标为主，不新增色值（designUI §2.4「派生标记」用来源徽+文字）。【r6.3】徽标为 `jobs/components/` 内自制组件（designUI §6 :214“新增组件（D-016）……移植 / 自制决策随实施登记”；r6.4 更正，r6.3 误写 §8），不导入 `shared/components/Badge.vue`（其文案固定、无插槽 / 文案 prop，且不属本 feature），只复用令牌与样式写法（tasks T-A23）
- **文件边界**：
  - 本 feature 唯一修改者：`frontend/src/jobs/**`、相应 jobs 测试、`frontend/src/contracts/**` 的作业类型/方法/mock/可选 `SendMessage.jobContext`、`frontend/src/agent/events.ts` 的可选上下文、`frontend/src/main.ts` 的作业注册（挂载前调用 `registerJobRoutes(router, pinia)`：两条路由 + 会话上下文守卫；`jobsStore` 的应用级 agent 订阅，沿用既有 `useAgentStore(pinia).receive` 订阅写法——r6 精化）、frontend-workbench 既有 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受契约 2.0.0 影响的硬编码断言（仅 T-A09，保留 v1 语义）、`specs/workbench-interaction/**`、`specs/README.md` 本 feature 行。新增 schema 并入 `contractSchemas`，方法进 `methodSemantics`；表驱动生成器无需修改
  - `frontend-workbench` v2 唯一修改者（本 feature 不改）：`frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue,AppShell.vue}`、`frontend/src/workbench/WorkbenchPage.vue` 与首页作业轨道、`frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}` 的上下文消费/展示；本 feature 提供组件、契约和集成测试输入。v2 的契约字段需求交由本 feature 统一写入，不重复改 schema
  - 不修改：`backend/`、`docs/` 权威内容（`interaction.md` / `architecture.md` / `designUI.md`）、冻结的 `specs/frontend-workbench/spec.md`

### 1.1 实施基线与接线顺序（B-06）

- 本轮仅补正既有 Plan。**实现起点**必须是 `frontend-workbench` v1 T-01～T-15 完成、经其 Review / Gate 2 / Handoff 合入后的 commit；届时在 Tasks 头部登记 SHA，再建实现分支。`fdaa7d8` 只是本次只读审查基线，不是可开工基线（当时 T-12 `theme.ts`、T-13 对话/store 尚不存在）。此前不写实现、不靠空壳冒充依赖
- 接线顺序：v1 地基 → 本 feature 的共享作业契约/schema/mock 和 `jobs/routes.ts` → v2 获 Gate 1 后更新其 Plan/Checklist/Tasks，再由壳方接导航/轨道/投放/上下文 → 本 feature 集成验证。v2 草稿不视为已批准接口
- **r6 基线登记（2026-10-28）**：frontend-workbench v1 已完成 Review / Gate 2（Walter 确认）/ Handoff，并经 PR #7 合入 main；`implementation_base_sha = 43b6d79681a49562f41751368b2ae00c24062f56`（merge commit；v1 源交付提交 `eba5002`）。协调器实查 `gh pr view 7` = MERGED、`git merge-base --is-ancestor` 对 `origin/main` 成功；本会话在该 SHA 的只读目录重核前端事实（tasks §0.0）。**基线门已满足**，但实现分支尚未建立、代码未同步；Implement 另待 r6 的 A 定向复核（Checklist R7）、Walter 代码授权与集成人 / worktree 登记（tasks 页首 IMPL-GATE-R6）。v1 Handoff 遗留的 H-01 / H-02 与人工截图签字属 frontend-workbench 待办，不作为本 feature 新硬阻塞。
- 直达作业页面与详情阶段轨道不依赖 v2 菜单。AC-003-1 的全局投放、AC-005-5 的全局抽屉上下文、AC-007-4 的**首页作业轨道**部分标 `blocked_by: frontend-workbench-v2`；列表卡/详情阶段轨道角标属本 feature。外部阻塞未解除时 Converge 必报“未收敛（外部阻塞）”，不能报全量完成

## 2. 模块设计

### 2.1 路由与入口（R-001 / R-002）

| 路由 | 页面 | 说明 |
|---|---|---|
| `/jobs` | `JobListPage.vue` | 作业列表；筛选 / 搜索 / 新建内联面板 |
| `/jobs/:id/:stage?` | `JobDetailPage.vue` | 作业详情；`stage ∈ collect / process / analyze / deliver`，缺省取作业当前阶段 |
| （全局抽屉） | `IntakeDrawer.vue` | 任意页面投放；由 shell 的"投放"按钮打开，携带可选 `jobId` |

- 本 feature 在 `jobs/routes.ts` 导出两条记录（name=`jobs` / `job-detail`，meta 含 `title/en/navId:'jobs'`），由 `main.ts` 在挂载前对既有 router 调用 `addRoute`；**不改 `app/router.ts`**。具名 `jobs` 记录可替换壳由导航表生成的同名占位，避免 v2 接入后双路由；导航项由 v2 在 `nav.ts` 增加
- 阶段切换用 `router.replace({ name: 'job-detail', params: { id, stage } })`；刷新保持；未知 stage 回落当前阶段（缺省或未知 stage 时页面以 `router.replace` 补成 currentStage）
- **r6（H-3 / H-4）**：`jobs/routes.ts` 另导出 `registerJobRoutes(router, pinia)`，对两条记录调用 `addRoute`，并注册一个 `router.afterEach`：目标为 `job-detail` 且 `stage` 合法时把 `sessionStore.context` 置为 `{jobId, stage}`，否则置 null——离开详情时在同一次导航内清空；context 只读、不提供公开 setter、不从 agent run 推导。【r6.3】为让 `registerJobRoutes` 绑定生产 router 而不暴露 setter：`sessionStore` 只多暴露一个**生产路由绑定入口** `bindRouter(router)`——它只注册上述 `afterEach`（目标判定在 store 内完成），不接受任何 `JobContext`；`registerJobRoutes` 在 addRoute 后以 `useSessionStore(pinia).bindRouter(router)` 调用；`context` 为 getter（类型层只读）；壳与测试不调用 `bindRouter`，只经导航改变上下文；不加 navigation failure / 竞态兜底
- 全局投放入口、工作台作业轨道、导航项均属 v2 前置变更（§7），v1 先保证路由可直达与页面内入口

### 2.2 组件与职责

| 模块 | 文件 | 职责 |
|---|---|---|
| 作业列表 | `pages/JobListPage.vue`、`pages/JobCreatePanel.vue`、`components/JobCard.vue` | 列表 / 筛选 / 搜索 / 三态；非模态创建面板、校验与跳转 |
| 作业详情 | `pages/JobDetailPage.vue`、`components/StageRail.vue`、`components/StageWorkspace.vue` | 阶段轨道、状态、待确认横幅、重跑确认 |
| 徽标体系 | `components/JobStatusBadge.vue`、`components/ArtifactStatusBadge.vue`、`components/SourceBadge.vue` | 统一状态/来源徽（文案+图标，非仅颜色） |
| 采集台 | `stages/IntakeDrawer.vue`、`stages/IntakePanel.vue`、`stages/ExtractionPreview.vue`、`stages/MappingEditor.vue`、`stages/UnassignedPool.vue` | 三种投放、来源说明、预览修正、待归属池 |
| 处理台 | `stages/ProcessWorkspace.vue`、`stages/RecipeSteps.vue`、`stages/ParamEditor.vue`、`stages/ReconciliationDiff.vue` | 配方只读、参数修正、对账 diff、溯源 |
| 分析台 | `stages/AnalyzeWorkspace.vue`、`stages/ConclusionCard.vue`、`stages/EvidenceChain.vue`、`stages/InterventionComposer.vue`、`stages/RuleCandidatePanel.vue` | 结论卡、证据链、批注/追问/否决/深挖、非模态教规则 |
| 交付台 | `stages/DeliverWorkspace.vue`、`stages/DeliverableBlock.vue`、`stages/BlockTextEditor.vue`、`stages/BlockChart.vue`、`stages/BlockTable.vue`、`stages/BlockCommentThread.vue`、`stages/RevisionHistory.vue`、`stages/DiffView.vue`、`stages/FinalizeDialog.vue`、`stages/RevisionRequestPanel.vue` | 6 类块、编辑/批注、版本/diff、非模态改稿指令、定稿确认与未决项 |
| 介入与不干扰 | `components/InterventionHistory.vue`、`components/PendingMergeChip.vue`、`components/InboxDrawer.vue` | 事件历史、待合并、角标/收件箱 |
| 工具 | `diff.ts`、`persistence.ts` | 行级 diff（自实现）、localStorage 快照（带版本与损坏兜底） |
| 契约 | `src/contracts/{types.ts,client.ts,methods.ts,mock/**}` | v2 方法与 mock 实现（stateful） |

- 地基交付后复用 `agent/AgentDrawer.vue` 与 `agent/store.ts`，由 v2 壳方接作业上下文标签（作业 id/标题、阶段）与按作业过滤 selector；本 feature 的 `sessionStore` 提供当前上下文。普通编辑/批注/教规则/投放/改稿均为内联面板或非模态抽屉，无遮罩、无焦点锁；仅删除来源/结论、定稿、取消、显式重跑用二次确认

### 2.3 状态管理（Pinia）

| store | 内容 | 持久化 |
|---|---|---|
| `jobsStore` | 当前作业、阶段工作区视图缓存；写回执/agent 通知后重新读取，不做轮询。r6（H-2）：另持只读的**未筛选**作业列表 `jobs` 及其 `listStatus` / `listError`；`ensureJobs()`（仅首次加载）、`refresh()`（重读未筛选列表、当前筛选结果与已打开的详情；已有数据时不回到 loading）；`applyFilter()` 结果单独保存为 `filteredJobs`，不覆盖未筛选缓存；`createJob(input)` 为随 H-2·列表交付的可调用写 action；`receiveAgentEvent` 对带 `jobContext` 的终态事件调用 `refresh()`，由 `main.ts` 订阅 | 经契约 mock 层，不在 store 内直接落盘 |
| `intakeStore` | 投放抽屉开关、当前投放草稿、待归属池视图缓存。r6（H-5）：`open(jobId?)` 记录打开时的 jobId 快照（之后路由变化不改写），`close()`、只读 `isOpen` / `jobId`；提交使用该快照；关闭不导航、不调用 agent | 同上；原文草稿只在内存 |
| `inboxStore` | `listInbox` 返回的条目与 unreadCount 视图缓存，调用 `markInboxRead` 清除角标 | 已读 id 由 mock 层写 `fai.inbox.v1`，store 不直接写 |
| `sessionStore` | 当前作业/阶段上下文（供抽屉、介入事件使用）。r6（H-4）：只读 `context: JobContext \| null`，只由 §2.1 的路由守卫设置 / 清空（守卫经【r6.3】`bindRouter` 注册） | 内存 |

- **写后统一刷新（r6，落实本表“写回执/agent 通知后重新读取”）**：所有领域写调用（作业、投放、介入、交付、收件箱已读、重置）成功后只调用一次 `jobsStore.refresh()`；写失败不刷新；不轮询、不建事件总线、不加请求序号等竞态防护（mock 各请求同延迟、按序完成；真实 `api` 接入时再评估，AGENTS §5.1）。“进行中”只用契约常量 `ACTIVE_JOB_STATUSES`，store 不另建判定

- **契约 mock 层持有唯一可变状态**（`contracts/mock/job-state.ts`），读写均经契约方法；UI store 只做视图缓存。这样 `api` feature 落地时只需替换实现，不动组件
- 本地持久化 key：`fai.jobs.v1`（作业、产物/版本、投放的允许子集、介入事件、交付物/定稿快照、收件箱条目）；`fai.inbox.v1`（已读 id）。非 normal 场景使用 fixture + 会话内可变副本，**不读、不写、不清**这两个 key；切场景不会清空正常模式数据
- 待处理项由 mock 契约状态层生成：阶段首次进入 `needs_human`、产物首次 `conflict`、人的 overlay 首次待合并、agent 改稿待接受/回退各生成一条 `InboxItem`（同一目标/原因不重复生成；修订号变化可产生新项）。阶段进度不由 UI 推导，计数亦由 `JobListItem.pendingCount` / 阶段 `pendingCount` 提供
- 状态建立时对 fixture 初始状态应用同一生成规则（r6）：预置的 H 阶段 / conflict 产物各有一条未读条目，因此 job-running 的 j-human、job-conflict 的 j-conflict 初始即带角标（AC-007-4 与 v2 H-6 的角标样例）。“conflict 产物”指产物 `status=conflict`；normal 的 j-failed 只有分析**阶段态** conflict（运行失败的呈现，S-14）与 reason，其分析产物为 draft，故 normal 场景不预置条目（r6.1，R7 S-29）
- `listInbox(jobId?)` 返回条目、已读/已解决状态及作业/阶段计数（只数未读且未解决项）；`markInboxRead(ids)` 将本次实际展示的 id 标已读，清除相应角标但保留条目和介入历史。打开前请求后一次标记，之后新来的条目仍未读；已读不等于已解决，冲突/待合并状态徽继续显示。阶段离开 H、冲突被裁定、overlay 合并、候选被接受/回退时由 mock 层把对应条目标 resolved，完成态不常驻角标。角标位置：列表卡、详情阶段轨道（本 feature），首页作业轨道（v2 消费同一计数）

### 2.4 契约 v2（R-008）

新增类型（zod，`contracts/types.ts` 或 `contracts/job-types.ts`）：

| 类型 | 要点 |
|---|---|
| `Stage` | `collect / process / analyze / deliver` |
| `StageState` | `not_started / running / needs_human / done / conflict` |
| `JobType` / `JobStatus` | `daily / research / adhoc`；9 状态与 `spec.md` R-001 一致 |
| `Job` / `JobListItem` | `id/title/type/subject/goal/createdBy(human或schedule)/status/currentStage/updatedAt/parentJobId(null可用)`；`reason:string|null`（failed/cancelled 必填原因）；`stages` 四阶段状态与计数、`pendingCount`；列表项为其摘要（r6 固定字段：`id/title/type/subject/status/currentStage/updatedAt/reason/stages/pendingCount`） |
| `ActiveJobStatus`（r6，H-2 ③） | `JobStatus` 去掉 `delivered` / `cancelled`（即领域只读门封存的终结态）的 7 个值，导出同源常量 `ACTIVE_JOB_STATUSES` 并登记进 CONTRACT.md；`failed` 可经 rerunStage 继续且以 conflict 阶段呈现（S-14），计入进行中；`draft` 计入。只是对已有状态枚举的分组口径，不新增状态或行为 |
| 契约展示映射 | 导出 `JobStatusLabel`（九状态）、`StageLabel`（四阶段）、`StageStateLabel`（五状态）、`ArtifactStatusLabel`、`DeliverableStatusLabel`（draft=草稿 / final=已定稿）与 `SourceLabel`；CONTRACT.md 登记同表，徽标只消费契约文案/图标，不另建状态映射 |
| `Artifact` | `id/kind(dataset或recipe或analysis或deliverable)/status(draft或provisional或confirmed或conflict)/source(external或human或agent或mixed)/origin(source或derived)`；`revisions/latestMergedRev/overlayRev/pendingMerge/pendingRunId`，无 overlay/run 时为 null；人/agent 的分析产物带 derived 标记。【r6.2】`latestMergedRev`（非空）/ `overlayRev` / `Revision.baseRev` 取值为 `Revision.id`；修订列表不内嵌于 Artifact，而由 `getStageWorkspace` 结果按阶段携带：各阶段分支带限定本阶段 kind 的 `artifacts[]` 与对应分支的 `revisions[]`，空态为空集合，交付空态 `deliverable=null`、`finalSnapshot=null` |
| `Intervention` | 十个必有字段：`id/jobId/stage/artifactId/baseRev/kind/payload/reason/outcome/createdAt`；作业级事件 artifactId/baseRev 可 null，reason 可 null；outcome=`recorded/pending/merged/rejected`，原动作不可改，检查点只更新 outcome。kind 13 种仍为 ingest/map_fix/recipe/framework/question/delete/rewrite/veto/approve/ask_why/pin_rule/rerun/finalize |
| `Upload` / `SourceNote` | `id/jobId(null可用)/inputKind(file或url或text)/fileMeta?/url?/sourceNote/status/mapping/createdAt/removed`；来源说明 `{purpose(非空),reliability(high/medium/low/unknown),publishedAt:null或日期（材料发布日期，不是定稿时间）,validUntil:null或日期,scopeNote:null或文本}`；status=`pending_validation/ingested/quarantined`，对应待验证/已入库/隔离 |
| `ExtractionPreview` / `FieldMapping` | `detectedType/fields/unit/timeRange`；mapping 的每项 `{sourceField,targetField,unit}`，单位修正一同提交。submit 后 pending_validation；confirm 默认 ingested，隔离样例由 fixture 的模拟判定给出并说明原因，不做真实闸门 |
| `RecipeStep` / `ParamChange` / `ReconciliationDiff` | 配方步骤与输入/输出锚（【r6.2】`{id,label,input,output}`，input / output 为单字符串锚，单链）；参数 `{unit,timezone,calendar,resample,aggregation}`；对账行含两个来源、原值/差值（复用 Figure 元数据：unit/freq/semantic/asOf/seriesId）、是否不同（由契约提供），空差异由空行集表达 |
| `Deliverable` / `Block` | 有序块；共同字段 id/status/source/origin/anchors/comments；按 type 区分 conclusion/text、note/text、quote/text与source锚、table/columns与rows与tableId（【r6.2】columns 为字符串表头数组，rows 为按列排列的 string / number / null 标量二维数组）、verification/question与结论块锚、chart/chartSpec与seriesData；v1 verification 只读文本，不建验证队列。`Deliverable` 另带交付物级定稿元数据 `{deliverableStatus:'draft'或'final', finalSnapshotId:null或id, finalRevisionNumber:null或正整数, finalizedAt:null或时间戳}`：draft 时三个定稿锚均为 null，final 时均非空且与对应 `FinalSnapshot` 一致。该元数据独立于 `JobStatus` 与 `Artifact` / `Block` 的 `status`（draft/provisional/confirmed/conflict），只由 `finalizeDeliverable` 改变；UI 与 mock 都不从 job.status 或快照是否存在推导交付物状态 |
| `ChartSpec`（仅样例） | `{templateId:'line-sample',seriesBindings:{main:seriesId},overrides:{title?}}`，对应 designUI §5.1 的 template_id/series_bindings/overrides；绑定数据 `seriesData` 复用带单位/频率/semantic/asOf 的 `SparkSeries`。`BlockChart` 仅编译此固定样例为 ECharts option，使用地基 `fai-dark`，不接受任意 option 或实现模板库 |
| `Revision` / `BlockComment` | revision `{id,artifactId,number,baseRev,author(human或agent),createdAt,summary,blocks,changeSummary}`，保存完整只读快照；comment `{id,threadId,parentId(null或根评论id),author,text,createdAt}`，线程根含 status=`open/resolved`；回复引用 threadId，解决操作改线程状态且产生新 revision，旧快照不变；批注不改块正文来源 |
| `FinalSnapshot` | `{id,jobId,revisionId,finalizedAt,blocks}`，取已合并 revision 的深拷贝；读 API 返回副本，不暴露内存中可变引用。【r6.2】另含必填 `revisionNumber`（= revisionId 对应修订的 number），供交付工作区一次校验 `finalSnapshotId` / `finalRevisionNumber` / `finalizedAt` 三锚（S-18） |
| `InboxItem` | `{id,jobId,stage,artifactId,revisionId,interventionId,reason(needs_human/conflict/pending_merge/revision_review),createdAt,read,resolved}`，不适用的锚可 null；计数只数未读且未解决条目 |
| `JobContext` | `{jobId, stage}`；`SendMessage.jobContext?` 与十类 AgentEvent 的公共可选字段，所有同 run 事件保留发送时上下文，不随页面改写 |

契约统一 **camelCase**，文档登记 `job_id→jobId`、`artifact_id→artifactId`、`base_rev→baseRev`、`created_at→createdAt`；spec 字段含义不变。上述 schema 进入 `contractSchemas` 注册表，类型/字段描述/展示映射由生成器进 CONTRACT.md；只在契约输入、返回值和本地快照入口 parse 一次，内部组件不重复校验。

新增 `DataClient` 方法（契约语义表同步进 `methods.ts`，`contract-build` 重新生成 `CONTRACT.md` / `schema.json`）：

```
listJobs(filter?)            getJob(jobId)                 createJob(input)
getStageWorkspace(jobId,stage)                           rerunStage(jobId, stage)
submitIntake(input)          getIntakePreview(uploadId)    confirmIntake(uploadId, mapping)
listUnassignedUploads()      assignUpload(uploadId, jobId)
updateParams(jobId, changes) getReconciliation(jobId, seriesId)
listInterventions(jobId, filter?)                        submitIntervention(jobId, input)
markProvisional(jobId, artifactId)                       mergePending(jobId, artifactId)
removeUpload(uploadId, reason)                          cancelJob(jobId, reason)
saveBlockText(jobId, blockId, text)                      createBlockComment(jobId, blockId, input)
replyBlockComment(jobId, threadId, text)                 resolveBlockComment(jobId, threadId)
listRevisions(jobId)         getRevision(jobId, revisionId)
requestRevision(jobId, blockIds, instruction)            resolveRevision(jobId, revisionId, action)
finalizeDeliverable(jobId)    listInbox(jobId?)            markInboxRead(ids)
resetMockData()
```

- `listJobs` 按状态/类型与标题子串组合筛选，缺省 updatedAt 倒序，清空筛选恢复全列表；`getJob` 未知 id 返回 not_found。读取历史版本不改变当前版本。写回执包含已改变的作业/产物/版本/事件与 inbox 计数，UI 以回执或重新读取消费，不自行改业务状态
- `AgentClient.send` 增加可选 `jobContext`；`AgentEvent` 公共可选 `jobContext`（不改变十类事件/唯一终态）。mock DataClient 与 AgentClient 共享 `job-state.ts`；AgentClient 先让该状态层处理事件，再通知 UI 订阅者。runId→作业/阶段/改稿请求的关联在 mock 层，页面卸载不移除它；UI 只刷新缓存
- mock fixture 为 `jobs.json/job-detail.json/deliverable.json/interventions.json/uploads.json`；`MockOverrides` 增加 `jobFixtures`，**不新增 `jobScript`**。r6（H-6）：`jobs.json` 按场景集合分键（normal / job-running / job-pending-merge / job-conflict / job-delivered），`job-detail.json` / `deliverable.json` 以作业 id 为键（【r6.2】`job-detail.json` 值为 `{collect, process, analyze, previews（以 Upload.id 为键）, reconciliations}`；`deliverable.json` 值为交付分支工作区；`uploads.json` 为 `{uploads, previews}`；`interventions.json` 为介入事件数组；各文件的具名边界 schema 注册进 `contractSchemas`，生成器不改）；`jobFixtures` 的每个给出的键整体替换对应内置文件（不深合并，与 v1 `fixtures` 覆盖口径一致），在每个 mock DataClient 的会话状态建立时读取一次并在边界校验（r6.1，R7 S-27：`job-state.ts` 持有**模块级唯一共享会话状态**，每次 `createMockDataClient()` 时建立 / 重建它——读 scenario 与 `jobFixtures` 各一次；`createMockAgentClient()` 与所有 DataClient 实例共用当前状态，不各持一份；故 `jobFixtures` 为“建状态时读一次”，与 v1 `fixtures` 的“每次请求读取”时机不同，切换覆盖值须新建 client）；覆盖集合中缺工作区样例的作业返回带阶段的空工作区；【r6.3，R-B】内置种子中按下方样例表阶段态为 `not_started` 的工作区为空（集合为空；deliver 为 `deliverable=null`、`finalSnapshot=null`；采集未开始时该作业 `previews={}`、处理未开始时 `reconciliations=[]`），已开始阶段保留有效样例，done 阶段产物状态不因阶段完成而改为 confirmed——这是**种子数据口径**：`getStageWorkspace` 原样返回状态层内容、不按阶段态过滤或推导（rerunStage 后下游 `not_started` 仍保留旧修订与 draft 新修订，见 §4 迁移表），schema 不加对应约束，`createJob` 的初始空产物（§4.1）不变（r6.4：种子校正由 tasks T-A09b（fixture-only）落地，T-A10 经真实 `getStageWorkspace` 读回验证）；存在覆盖时会话只在内存，不读写两个本地 key。作业运行统一经既有 `send({jobContext})` 的 success/failure/retry/long 脚本驱动；不因读取页面自动启动、不新造检查点事件种类
- 错误形态沿用 `{error:{code,message,retryable}}` 与既有 code；本 feature 的无效操作/只读写入/定稿未决项均返回 validation_error，payload 含说明；未知锚返回 not_found。方法输入/输出/参数字义写进 `methods.ts` 与生成文档

#### 动作 → 契约方法 → 介入 kind（B-01）

所有事件填齐公共锚/时间/outcome；payload 为按 action 可辨识的联合，不以任意 JSON 代替确定类型。普通补充不要求 reason，破坏性操作由确认面板给出默认理由并可修改。

| 动作 | 方法 | kind | payload 必填字段 |
|---|---|---|---|
| 投放/归入作业 | submitIntake / assignUpload | ingest | action=ingest, uploadId, sourceNote；未归属时先留投放记录，assign 时追加作业内事件 |
| 修正映射/单位后确认 | confirmIntake | map_fix | action=map_fix, uploadId, mapping；原记录与修正前 mapping 保留 |
| 参数/口径修正 | updateParams | recipe | action=recipe, artifactId, changes |
| 结论级批注 | submitIntervention | framework | action=annotate, conclusionId, note |
| 追问“依据” / “如果” | submitIntervention | ask_why / question | action=ask_why 或 what_if, conclusionId, question；同时经 `contracts/index.ts` 的 `agentClient.send({message, jobContext})` 直接发送以保留上下文（不经 `agent/store.ts`、不带 sessionId，基线 mock 为其分配独立 mock session，抽屉时间线仍回放；r6.1，R7 S-30），不重复写两条事件 |
| 要求深挖 | submitIntervention | rewrite | action=deepen, conclusionId, instruction |
| 删除结论 / 否决 | submitIntervention | delete / veto | action=delete_conclusion 或 veto, conclusionId, reason；删除用 tombstone 新 revision，不删旧内容 |
| 候选规则 | submitIntervention | pin_rule | action=pin_rule, ruleText, state='candidate'；不自动激活/蒸馏 |
| 删除来源 | removeUpload | delete | action=remove_source, uploadId, reason；只从当前视图移除，历史锚保留 |
| 取消作业 | cancelJob | delete | action=cancel_job, reason；作业置 cancelled，保留原因/历史；已有 mock run 不被 abort，其后事件只留时间线，不再改取消后的产物 |
| 行内编辑 / 块改稿指令 | saveBlockText / requestRevision | rewrite | action=edit_block（blockId,text）或 revise_blocks（blockIds,instruction） |
| 块批注/回复/解决 | createBlockComment / replyBlockComment / resolveBlockComment | framework | action=block_comment/reply_comment/resolve_comment，blockId或threadId；前两者含 text |
| 标记暂定 | markProvisional | approve | action=mark_provisional, artifactId；生成新 revision，状态向下游透传 |
| 阶段重跑 | rerunStage | rerun | action=rerun, stage, affectedStages |
| 接受/回退 agent 版本 | resolveRevision | approve / rewrite | action=accept 或 revert, revisionId |
| 定稿前裁定冲突块 | submitIntervention | approve | action=resolve_conflict, blockId, humanRevId, agentRevId, choice='human'或'agent'；选中版本形成新 confirmed revision，不覆盖两版 |
| 定稿 | finalizeDeliverable | finalize | action=finalize, revisionId, snapshotId；一次确认只产生一条定稿事件（D-018 §1：交付物 `draft → final`） |

`mergePending` 只将原介入 outcome 从 pending 更新为 merged（并产合并 revision），不伪造人的 merge 动作；`markInboxRead` / `resetMockData` 是 mock/视图管理操作，不充当分析介入。

#### 场景与驱动（B-02）

既有五场景加四个 job 场景，共九个；同步扩展 `BootstrapSchema.scenario`、配置解析、fixtures 校验与生成文档。优先级仍为 `?scenario=` > `VITE_MOCK_SCENARIO` > normal。以下行为覆盖**全部新增 DataClient 读/写方法**，查无 id 的行为独立保持 not_found；AgentClient 的脚本规则单列，不偷换成 DataClient 写方法。

| 场景 | 新读方法 | 新写方法 | 本地快照 |
|---|---|---|---|
| normal | 正常 fixture 或本地快照 | 按本文状态机修改并返回回执 | 读写允许子集 |
| empty | 初始化时列表/池/收件箱/版本集合为空；预置 fixture id 为可查的空键：getJob 返回 null（“暂无作业”）、getStageWorkspace 返回带阶段的空集合/配方为空。创建后对新 id 正常读回，不在每次读取时重新强制置空 | 可创建/投放并在会话内读回；对未知目标返回 not_found | 不读写清空 |
| error | bootstrap/目录仍成功；所有新增业务读方法返回 adapter_error（含详情/工作区），UI 错误态可达 | 所有新增业务写方法返回 adapter_error，不产生部分修改 | 不读写清空 |
| slow | normal 返回值，逐调用延迟 1500ms | normal 行为，在提交边界延迟 1500ms，延迟前不提交 | 不读写清空 |
| boot-error | 首次 bootstrap 失败/重试成功；新读同 normal | 新写同 normal，仅内存 | 不读写清空 |
| job-running | 下面 j-running / j-human 等专用样例 | 正常写入会话副本 | 不读写清空 |
| job-pending-merge | j-merge 专用样例 | 正常写入；用户显式 send(long) → 人编辑 → 该 run 完成后合并 | 不读写清空 |
| job-conflict | j-conflict 专用样例 | 可介入、继续用暂定快照；定稿未决项拒绝 | 不读写清空 |
| job-delivered | j-delivered 与定稿快照 | 该作业的领域写方法拒绝 validation_error；已读/新建作业仍可用 | 不读写清空 |

`resetMockData` 仅为显式“重置样例数据”确认动作：normal 删除两个 key 并重建 fixture；其他场景只重建内存 fixture，不触碰两个 key。error 场景允许此恢复动作（但仍保持 error 业务行为），不绕过业务报错。

阶段列缩写 N=not_started、R=running、H=needs_human、D=done、C=conflict；顺序永远 collect/process/analyze/deliver。各 job-* 场景替换作业 fixture，不把互斥状态塞进同一个作业。静态 R 代表已在进行的样例状态；可回放的 activeRunId 只在显式 send 后存在，两者不混淆。交付物定稿元数据：仅 j-delivered 初始为 `final`；其余样例与 `createJob` 新建的交付物初始为 `draft`，定稿锚为 null。

| fixture / 场景 | job.status / currentStage | 四阶段状态 | 关键产物 / 说明 |
|---|---|---|---|
| normal: j-collect | collecting / collect | R,N,N,N | dataset=draft，投放预览待验证 |
| normal: j-process | processing / process | D,R,N,N | recipe=provisional；无 activeRunId 可测手动检查点 |
| normal: j-deliver | delivering / deliver | D,D,D,R | 六类块、两个人/agent 历史版本；可改稿/定稿 |
| normal: j-failed / j-cancelled | failed / analyze；cancelled / collect | D,D,C,N；N,N,N,N | 明确 reason；作业级重试只显示后续 feature 归属，不实现重试 |
| job-running: j-running | analyzing / analyze | D,D,R,N | 分析稿=draft，无待确认 |
| job-running: j-human | needs_human / process | D,H,R,N | recipe=provisional，下游分析仍运行；横幅定位 process |
| job-pending-merge: j-merge | delivering / deliver | D,D,D,R | 初始无 overlay；e2e 用 ?agentScript=long，在作业改稿面板 requestRevision（选结论块）→send(jobContext)，等 run.started 后编辑另一备注块，再推进脚本时钟到 run.completed；期间不切换 runId |
| job-conflict: j-conflict | needs_human / analyze | D,D,C,R | 分析结论/对应交付块=conflict，另有可用 provisional 快照；下游可查看/编辑；定稿列出未决项 |
| job-delivered: j-delivered | delivered / deliver | D,D,D,D | confirmed 块、snapshot；交付物 deliverableStatus=final（finalSnapshotId / finalRevisionNumber / finalizedAt 与该 snapshot 一致）、定稿信息、只读 |

`job-pending-merge` 的终态由同一次 send 的 runId 驱动，failed/aborted 不合并、不清 overlay。单测/端到端用既有脚本和时钟推进真实 mock 定时器，不凭 UI 手工造终态。`requestRevision` / 实际执行的 `rerunStage` 也统一调用 mock AgentClient.send：前者记录 runId 与请求后在该 run 的权威 step.text 中准备候选版本、成功终态才生成 agent revision；后者依 §4 状态表处理。两者不增加事件种类；普通全局 send 无 jobContext 不改作业。

### 2.5 检查与测试

- **静态**：沿用 `pnpm check`（generated / colors / glass / updown / grid / network）；新增代码自动纳入；新增 schema/methods 注册后 `check --only generated` 必须通过。R-009 的状态/来源徽守卫以组件测试逐状态/逐块断言文字或图标/徽存在（AC-001-5/003-6/006-8），不假称既有脚本具备该扫描
- **单元**：`diff.ts`（LCS、超长退化，期望用手写样例，不重写算法）、`persistence.ts`（解析失败/配额异常/超限）、契约 schema（fixtures 全部过 parse）、状态/来源契约映射、mock 状态机与 runId 归属、`pendingMerge` selector
- **组件**：六个界面与徽标、三态、块渲染与编辑、版本/diff 视图
- **端到端**（Playwright，默认 1440×900）：作业列表/创建/阶段切换/刷新保持；投放三方式与来源说明；处理参数修正；分析介入事件；交付编辑/版本/diff/改稿/定稿；待合并 chip（`job-pending-merge` 脚本）；角标/收件箱；破坏性确认与非模态；窄窗口不回归（工作台基线由 frontend-workbench 覆盖）
- **人工验收**：`specs/workbench-interaction/manual-acceptance.md`：M-01 作业状态/类型与非颜色区分；M-02 四阶段/待确认与不阻塞；M-03 投放/预览/来源说明；M-04 配方/溯源/对账；M-05 六块/暗色图表/徽；M-06 编辑/批注/非模态；M-07 版本/diff/接受回退；M-08 待合并/冲突/定稿只读；M-09 角标/收件箱/上下文；M-10 最小960与基准1440×900布局及≤3玻璃。Handoff 逐项附截图，当前不声称已验收
- 命令：`pnpm check && pnpm typecheck && pnpm lint && pnpm test:unit && pnpm test:e2e`（沿用 `pnpm test`；实现时登记）

## 3. 数据与存储

- fixture 永远只有合成样例，不写用户私有数据到仓库；无服务端、无真实解析/URL 抓取。File 只取 name/size/type/lastModified，不调用文件正文解析；粘贴正文仅在当前投放草稿/契约提交参数中存在，不保存到 fixture 或 localStorage，mock 预览由输入类型+人工映射驱动
- `fai.jobs.v1` 的 Upload 白名单子集：id/jobId/inputKind/fileMeta/url/sourceNote/mapping/status/createdAt/removed，以及合成预览。不含 File 对象、字节、粘贴正文或完整提交参数；事件 payload 只含表中结构化摘要/锚，不夹带原文。URL 只保存字符串、不访问；来源说明、人工编辑与批注会保存在本机，界面明确说明“本地样例记录；原文不保存，刷新后需重新投放原文”
- normal 快照封装 `{version:1,data}`；`JSON.stringify` 的 UTF-8 字节数超过 512 KiB 或 setItem 抛配额异常时转内存并在作业列表/详情、投放抽屉顶部显示共享**非模态横幅**“本次修改未持久化，刷新会丢失”，保留最后成功快照、不主动删除。损坏/版本不支持时本次用 fixture，显示“原快照无法读取，可重置样例”；保留原 key、该会话不自动覆写，只有显式重置才删除
- `fai.inbox.v1` 只存已读 id。正常场景仅显式 `resetMockData` 二次确认后删除两个 key 并重建（连同新样例的已读状态）；场景切换不清空。非 normal 场景全程内存，既不恢复也不修改两个 key。沿用既有 `fai.rail` / `fai.drawer` / `fai.layout`，重置作业样例不动这些键
- 生成物照旧入库：`contracts/{CONTRACT.md,schema.json}`，只改源后生成
- 时间与日期：asOf/ts/createdAt/updatedAt 为 ISO 8601 带偏移；来源说明的 `publishedAt`（材料发布日期）/ `validUntil`（有效期）与作业日期用 `TradingDate`（`YYYY-MM-DD`）；定稿时间 `finalizedAt`（`FinalSnapshot` 与 `Deliverable` 定稿元数据）为 ISO 8601 带偏移时间戳。`publishedAt` 指被投放材料自身的发布日期，与交付物定稿时间 `finalizedAt` 是不同概念，不互换、不同名；命名映射见 §2.4

## 4. 关键流程

1. **创建作业**：列表 → `JobCreatePanel`（校验）→ createJob → 写作业（collecting/collect；R,N,N,N）与初始空产物（交付物 deliverableStatus=draft、定稿锚为 null）→ 跳 `/jobs/:id/collect`。所有写方法保留旧 revision，UI 不覆盖业务对象
2. **投放**：页面入口或 v2 顶栏打开同一 IntakeDrawer → 提交一种输入+来源说明 → pending_validation 预览 → 修正 mapping（含单位）→ confirmIntake → ingested/样例 quarantined；jobId 在 submit 时确定，无作业则待归属；assign 后出现在采集列表并补作业内 ingest 事件。removeUpload 二次确认，只移除当前关联且保留历史
3. **阶段/重跑**：轨道直接读 stages。needs_human 横幅目标取按固定顺序第一个 H（冲突样例取第一个 C），可随时查看其他阶段；不在 UI 推导状态。rerunStage 二次确认后生成一条 kind=rerun 事件，按下表执行；failed/cancelled 的“作业级重试”仍只是注明归属的占位，不新增重试实现
4. **介入**：由 §2.4 动作矩阵走唯一方法 → 新事件/版本与 inbox 回执 → 刷新介入历史、角标；普通批注/追问/改稿无模态。问答同时走既有 send 时，只由 submitIntervention 记录结构化动作，mock send 不重复追加同一动作
5. **交付版本**：saveBlockText 立即生成作者=human 的新 revision，改变块来源=human；批注写入亦生成新 revision，但正文来源不变。requestRevision 记录 baseRev/blockIds 与指令，再 send(jobContext)；成功检查点先处理人的 overlay，再以最新已合并快照为底仅应用指定 blockIds 的 agent 改动，产作者=agent 的候选 revision、显示 diff，只有涉及的块来源=agent。若同一块在 baseRev 后被人改过，则保留人版/agent 版并标 conflict，不覆盖人版；不相交块的修改可合并。resolveRevision(action='accept') 将候选涉及的块确认成新 revision；action='revert' 仅把请求涉及的块恢复至该请求 baseRev 内容，其他块的后续人工改动保留，agent 候选/原版本都不删。冲突候选不能直接 accept；在 diff 旁走 submitIntervention(action=resolve_conflict) 明确选人版/agent 版，产新 confirmed revision，正文来源沿用选中版；此收口只在定稿时要求，不阻塞其他阶段
6. **定稿**：二次确认面板先列出当前 conflict / pendingMerge / 未接受的 agent 候选。finalizeDeliverable 遇未决项返回 validation_error（说明目标块），不生成快照、不改作业状态、交付物保持 draft；人处理或回退后再定稿。成功时在**同一次 mock 状态提交**内原子地完成：从 latestMergedRev 深拷贝保存 FinalSnapshot；交付物 deliverableStatus draft→final，写入 finalSnapshotId、finalRevisionNumber（该 revision 的 number）与 finalizedAt（=快照 finalizedAt）；job.status→delivered；连同矩阵中唯一一条 finalize 事件。不存在只完成其中一部分的中间状态。交付台现有头部按 `DeliverableStatusLabel` 显示：final 为“已定稿 vN · 时间”（N=finalRevisionNumber，时间=finalizedAt），draft 为“草稿”；只读交付物元数据，不从 job.status 推导，不新增组件。随后针对该作业的一切领域写方法（含投放归属、编辑、批注、介入、参数、暂定、合并、重跑、改稿、接受回退、取消、重复定稿）均在契约入口拒绝 validation_error；读取/历史/diff/markInboxRead 仍可用，快照和历史不可变。cancelled 同样领域只读，取消后的晚到 run 事件只进时间线、不改已封存作业
7. **旁路/检查点**：有 activeRunId 时，人编辑立即产 overlay revision 与 pending 事件，agent 始终使用 latestMergedRev，不读 overlay。仅匹配 pendingRunId 的 run.completed 才将 overlay 合并成新 revision、清 pendingMerge、原介入 outcome=merged；不同作业/run 的终态不能代合并。failed/aborted 保留 overlay/pending 并提示；冲突保留两版与 provisional 已合并快照供下游，定稿门处理。无 activeRunId 的参数修正仍先返回 pendingMerge=true（满足 AC-004-2），处理台显示非模态“应用到检查点”；mergePending 在无运行时产生合并 revision、原事件 outcome=merged，运行中该按钮不执行（等待本 run 检查点）。普通非运行文本编辑则直接合并成新 revision
8. **场景切换**：按配置重建当前会话 fixture，非 normal 不触碰正常快照；唯一清空操作为 resetMockData（§3）。读取页面不启动 agent；job-pending-merge 的演示按 §2.4 显式 send(long) 驱动

#### rerunStage 状态迁移（B-03）

| 时点 | 阶段状态 / job.status | 版本/介入 |
|---|---|---|
| 无 activeRunId 时确认重跑 s | 上游原样；s→running，下游→not_started；currentStage=s，status 按 collect/process/analyze/deliver 映射 collecting/processing/analyzing/delivering | 保留全部旧 revision；s 与下游各生成以旧已合并版为 base 的 draft 新 revision；记录一条 rerun 介入 |
| 新 run 成功终态 | s 与下游按顺序模拟推进为 done，job.status=delivering、currentStage=deliver（不自动 delivered） | 对 s/下游追加 mock 产物 revision，合并该 run 的非冲突 overlay；事件 outcome=merged；定稿仍需人确认 |
| 新 run failed/aborted | failed 时 job.failed + reason、当前运行阶段→conflict，下游保持未完成；aborted 时保持阶段快照并说明中止 | 旧版本与 pending overlay 均保留，不误标合并 |
| 已有 activeRunId 时请求重跑 | 请求先 pending，阶段/产物暂不改；当前 run 不 abort、不重启，终态后再按上述迁移启动新 run | 请求排队在 mock 状态层；completed 先处理检查点，再执行请求；失败/中止保留人的 overlay，新 run 分配后把其 pendingRunId 转交该后继 run（原 baseRev/介入 id 不变），再在后继检查点处理，定稿前仍需清未决项 |

同一作业多个重跑请求按提交顺序串行执行（仅 mock 内存待执行记录，不引调度器）；运行结束时由 mock 层执行下一请求，UI 切页不影响。

## 5. 验收对应

| AC | 实现位置与验证 |
|---|---|
| AC-001-1 | `JobListPage` + `JobCard`（组件）；fixtures 字段断言 |
| AC-001-2 | `jobsStore.filter` + 列表组件（组件）；筛选组合/清空 |
| AC-001-3 | `JobCreatePanel` + e2e（创建 → `/jobs/:id/collect`，契约记录参数） |
| AC-001-4 | 列表/详情三态组件测试 + `scenario=empty/error` |
| AC-001-5 | `JobStatusBadge` 文案/图标映射单测；人工 M-01 |
| AC-002-1 | `StageRail` 组件测试（顺序、当前态、五状态映射） |
| AC-002-2 | e2e 点击切换 + URL + reload 保持；未知 stage 回落 |
| AC-002-3 | `job-running` 场景含 `needs_human` e2e（横幅、跳转、其他阶段可看） |
| AC-002-4 | `rerunStage` + 二次确认 e2e；断言事件 kind=rerun 与历史 |
| AC-002-5 | failed/cancelled fixtures 组件测试（原因 + 占位动作说明） |
| AC-003-1 | `IntakeDrawer` 三处入口 e2e（工作台入口依赖 v2，标记 blocked_by） |
| AC-003-2 | 三种投放 + 白名单组件测试 |
| AC-003-3 | 用途必填 + payload 断言 e2e（`sourceNote.purpose/reliability/publishedAt/validUntil/scopeNote`） |
| AC-003-4 | `ExtractionPreview` / `MappingEditor` 组件测试；确认后才入库 |
| AC-003-5 | `UnassignedPool` + `assignUpload` e2e |
| AC-003-6 | 抽取状态徽组件测试（文案+图标） |
| AC-004-1 | `ProcessWorkspace` / `RecipeSteps` / 溯源跳转组件测试 |
| AC-004-2 | `ParamEditor` → `updateParams` 事件断言 + 待合并徽 e2e |
| AC-004-3 | `ReconciliationDiff` 组件测试（差异高亮、空 diff） |
| AC-004-4 | `markProvisional` → 下游状态徽组件测试 |
| AC-004-5 | 三态组件测试 |
| AC-005-1 | `ConclusionCard` 列表组件测试（证据数、徽标） |
| AC-005-2 | `EvidenceChain` + 跳转组件测试 |
| AC-005-3 | `InterventionComposer` 五类操作 e2e，断言 kind/payload |
| AC-005-4 | `RuleCandidatePanel` → submitIntervention，pin_rule / payload.state=candidate 组件测试 |
| AC-005-5 | 抽屉 `jobContext` 标签 + mock 回放 e2e；blocked_by v2 上下文接线 |
| AC-005-6 | 三态/冲突场景组件测试 |
| AC-006-1 | 六类块渲染组件测试 + 图表块用契约 chart-spec 与主题；人工 M-05 |
| AC-006-2 | inline 编辑 → revision（来源=人）组件测试；只读块不可编辑断言 |
| AC-006-3 | 批注线程新建/回复/解决 e2e |
| AC-006-4 | `RevisionHistory` 列表 + 历史只读 e2e |
| AC-006-5 | `DiffView` 组件测试（块级差异与摘要） |
| AC-006-6 | `requestRevision` + mock 回放 e2e；新 revision 来源=agent，接受/回退 |
| AC-006-7 | 定稿二次确认 → 同一次提交内快照 + 交付物 deliverableStatus=final（定稿锚与快照一致）+ delivered，头部“已定稿 vN · 时间”+ 只读 e2e；未决项被拒时快照 / 交付物 draft / 作业状态均不变 |
| AC-006-8 | 块来源/状态徽组件测试 |
| AC-007-1 | `InterventionHistory` 渲染 + 阶段/类型筛选组件测试 |
| AC-007-2 | job-pending-merge：作业内改稿指令经 requestRevision→send(long/jobContext) → 编辑另一备注块 → 同 run completed 才合并；失败/他 run 不误清。可不依赖全局输入栏自动绑定上下文 |
| AC-007-3 | e2e：编辑/批注/投放/教规则/改稿无模态；removeUpload/delete_conclusion/finalize/cancel/rerun 二次确认后才调用契约 |
| AC-007-4 | listInbox / markInboxRead + 列表卡/详情阶段轨道角标 e2e；首页作业轨道部分 blocked_by v2 |
| AC-007-5 | `check --only glass`（继承；本 feature 不新增玻璃类） |
| AC-008-1 | `contract-build` 生成比对 + 文档字段对拍单测（含 `Deliverable` 定稿元数据、`DeliverableStatusLabel`、`SourceNote.publishedAt`） |
| AC-008-2 | 场景清单单测 + e2e 遍历正常/空/错误/延迟/运行中/冲突/已交付 |
| AC-008-3 | `check --only network`（新代码纳入 allowlist 规则） |
| AC-008-4 | CONTRACT.md 版本 2.0.0 与变更说明；生成物入库 |
| AC-009-1 | `pnpm test` 全绿（实现时登记命令与输出） |
| AC-009-2 | `manual-acceptance.md` M-01~M-10 + Handoff 截图 |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| 共享文件与 `frontend-workbench` 进行中实现冲突 | 按 §1.1 等 v1 Handoff SHA；契约/events/main/jobs 归本 feature，nav/router/TopBar/AppShell/WorkbenchPage/agent UI-store 归 v2，唯一修改者；始终使用独立 worktree |
| 契约 v2 破坏 frontend-workbench 既有测试 | 不删除/不改既有字段；`CONTRACT_VERSION` 升 2.0.0；合并前跑其 `pnpm test` |
| 上传文件读内容带来隐私/体积风险 | 只读元数据与文本；不做真实解析、不落盘文件、不写私有文档到 localStorage |
| localStorage 容量 / 损坏 | 按 §3 降级内存 + 共享内联横幅；保留原 key，只在显式确认重置时删除；场景切换不清正常快照 |
| 行级 diff 性能 | 上限 2000 行，超出显示"变更摘要"；不引入第三方 diff 库（保持依赖最小） |
| 状态色无新增令牌导致冲突徽对比度 | 冲突用图标 + 文字（文字次/琥珀），点睛红只作非文字；如仍不足，登记后继设计变更（不私加色值） |
| 阶段状态在 UI 推导造成误判 | 阶段状态只读契约 `StageState`，不在前端推导 |
| 依赖 v2 / api 延迟 | 本 feature 页面与路由可独立验收；v2 集成任务显式 `blocked_by`；api 不阻塞 mock 验收 |

**回滚**：仅回退本 feature 的 jobs/测试、contracts 新增部分、agent/events 可选字段、main.ts 的作业注册（路由、守卫与 jobsStore 订阅，r6）、T-A09 对既有 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受契约 2.0.0 影响的硬编码断言的修改（恢复 v1 原断言）以及本 feature 规格/状态行；不回退壳方的 nav/router/TopBar/AppShell/WorkbenchPage/agent store 补丁，壳集成由 v2 自行撤销并恢复其占位接口。不得按整文件覆盖其他 feature 的变更；`docs/` 不动。

## 7. 前置变更清单（frontend-workbench v2，需其 Clarify + Gate 1）

本 feature 的导航/工作台/全局入口依赖以下对 `frontend-workbench` 的增量变更；在其 v2 spec 获批前，本 feature 只交付"路由可直达 + 页面内入口"，对应 AC 标记 `blocked_by`：

1. **导航**：`nav.ts` 8 项 → 9 项（"专题研究"升级为"作业"指向 `/jobs`，新增"格物致知"占位（路由 `/learning`）；专题研究作为作业类型保留）——影响该 feature R-002 / AC-002-2、AC-002-3
2. **工作台**：`WorkbenchPage.vue` 焦点带与模块区之间新增**作业轨道**固定件（非模块、不可移除；含待处理介入角标）——影响 R-003
3. **全局入口**：`TopBar.vue` 增加"投放"按钮、`AppShell.vue` 挂载 `IntakeDrawer`——影响 R-002/R-003 的 shell 结构
4. **对话上下文**：v2 方在 agent store/抽屉消费可选 jobContext、暴露 selector；类型/events/SendMessage 的新增字段统一由本 feature 写入共享契约，壳方不再重复修改。草稿位置 `D:/2030/Futures-AI-workbench-v2/specs/frontend-workbench/spec.md`（待 Gate 1），其文件责任需与 §1 一致。【r6 状态更新】v2 spec v2.1 已于 2026-10-28 获 Walter 批准（Gate 1）；其 plan §7 / tasks（固定只读参照 `ded7161`，A Checklist v2 R2 产物 `f1f755b`）在 §7.3 / tasks §1.2 定义了 H-1～H-6 与页面切片交接要求，文件唯一写入者与本 §1 一致（`main.ts`、`contracts/**`、`agent/events.ts`、`jobs/**` 归本 feature）
5. **生产方交接（r6）**：H-1～H-6 / 页面切片由本 feature 的哪些任务提供、公开接口名称、定向测试与四项交接登记见 `interface-handoff.md` 与 tasks §2a；当前全部**未交付**。对拍结论：全部缺口属既有需求内的接口机制精度，无需回流 Clarify

## 8. 实施顺序（任务在 Tasks 阶段拆分，0.5–2h/项）

- **A 契约与骨架**：契约 v2 类型/方法/生成物 → mock 有状态层 + 场景 → 路由与空页面 → 徽标组件 → 持久化与 diff 工具
- **B 作业对象**：列表 / 创建 / 详情 / 阶段轨道 / 三态 / 重跑
- **C 采集台**：抽屉 / 三种投放 / 来源说明 / 预览与映射 / 待归属池
- **D 处理台**：配方 / 参数修正 / 对账 diff / 溯源 / 暂定
- **E 分析台**：结论卡 / 证据链 / 介入动作 / 教规则 / 抽屉上下文
- **F 交付台**：六类块 / 编辑与 revision / 批注 / 版本与 diff / 改稿回放 / 定稿
- **G 不干扰与收口**：待合并 / 角标收件箱 / 破坏性确认审计 / 静态守卫 / e2e 全量 / 人工清单
- **H v2 集成验证**（blocked_by: frontend-workbench-v2；前置获批且壳方交付后）：验证导航 / 首页作业轨道 / 全局投放 / 抽屉上下文；不由本 feature 重复改壳接线
