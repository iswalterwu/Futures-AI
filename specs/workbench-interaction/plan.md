# Feature: workbench-interaction 实施计划（plan.md）

> Plan 阶段产物。需求在 `spec.md`（2026-10-28 Gate 1 批准冻结，9 条需求 / 46 条 AC），本文只写实现机制与验收落点，不复制需求。
> 依据：`docs/interaction.md` §3/§7、`docs/designUI.md` §2.4/§3/§5.2/§7、`specs/frontend-workbench/plan.md`（地基与约定）、D-016。

## 1. 技术方案

- **栈**：沿用 `frontend-workbench`——Vue 3.5 + Vite 8 + TypeScript、Pinia、vue-router、ECharts 6、zod 4；Vitest + @vue/test-utils、Playwright；pnpm / Node ≥ 22.12（版本以该 feature 锁定为准，本 feature 不升级工具链）
- **交付形态**：纯前端 + mock；真实后端归 `api`，真实解析/闸门归知识库 feature，真实 agent 归 agent-runtime。界面层零直接网络调用（沿用 `check --only network`）
- **新代码落点**：`frontend/src/jobs/`（页面 / 组件 / stores / diff / 本地持久化）；契约扩展在 `frontend/src/contracts/`；测试在 `frontend/tests/`、`frontend/e2e/`
- **契约版本**：`CONTRACT_VERSION` 1.0.0 → **2.0.0**（新增方法、新增类型、事件与 `SendMessage` 增加可选 `jobContext`；不删除、不改既有字段语义，1.x 数据可解析）
- **复用**：design tokens / 三层玻璃 / `Num` / `Kpi` / 三态 / 对话抽屉 / CoT 时间线 / ECharts 暗色主题 / `check.mjs` / 契约生成器。**不新增颜色字面量与玻璃层级**
- **状态徽与来源徽**：只用既有令牌（文字主/次、琥珀；点睛红只作图标/边，不作文字），以文案 + 图标为主，不新增色值（designUI §2.4「派生标记」用来源徽+文字）
- **文件边界**：
  - 本 feature 拥有：`frontend/src/jobs/**`、`frontend/tests/{unit,component}/jobs/**`、`frontend/e2e/jobs/**`、`frontend/src/contracts/**` 的扩展、`frontend/src/agent/events.ts` 的可选字段、`specs/workbench-interaction/**`、`specs/README.md` 本 feature 行
  - **共享文件（需与 `frontend-workbench` v2 协调）**：`frontend/src/app/{nav.ts,router.ts,TopBar.vue,AppShell.vue}`、`frontend/src/workbench/WorkbenchPage.vue`、`frontend/src/agent/store.ts`、`frontend/scripts/contract-build.mjs`（如方法表驱动则无需改）
  - 不修改：`backend/`、`docs/` 权威内容（`interaction.md` / `architecture.md` / `designUI.md`）、冻结的 `specs/frontend-workbench/spec.md`

## 2. 模块设计

### 2.1 路由与入口（R-001 / R-002）

| 路由 | 页面 | 说明 |
|---|---|---|
| `/jobs` | `JobListPage.vue` | 作业列表；筛选 / 搜索 / 新建对话框 |
| `/jobs/:id/:stage?` | `JobDetailPage.vue` | 作业详情；`stage ∈ collect / process / analyze / deliver`，缺省取作业当前阶段 |
| （全局抽屉） | `IntakeDrawer.vue` | 任意页面投放；由 shell 的"投放"按钮打开，携带可选 `jobId` |

- `router.ts` 注册上述路由（`meta: {navId: 'jobs', placeholderOwner: undefined}`）；作业导航项由 `frontend-workbench` v2 在 `nav.ts` 增加并指向 `/jobs`
- 阶段切换用 `router.replace({ name: 'job-detail', params: { id, stage } })`；刷新保持；未知 stage 回落当前阶段
- 全局投放入口、工作台作业轨道、导航项均属 v2 前置变更（§7），v1 先保证路由可直达与页面内入口

### 2.2 组件与职责

| 模块 | 文件 | 职责 |
|---|---|---|
| 作业列表 | `pages/JobListPage.vue`、`pages/JobCreateDialog.vue`、`components/JobCard.vue` | 列表 / 筛选 / 搜索 / 三态；创建校验与跳转 |
| 作业详情 | `pages/JobDetailPage.vue`、`components/StageRail.vue`、`components/StageWorkspace.vue` | 阶段轨道、状态、待确认横幅、重跑确认 |
| 徽标体系 | `components/JobStatusBadge.vue`、`components/ArtifactStatusBadge.vue`、`components/SourceBadge.vue` | 统一状态/来源徽（文案+图标，非仅颜色） |
| 采集台 | `stages/IntakeDrawer.vue`、`stages/IntakePanel.vue`、`stages/ExtractionPreview.vue`、`stages/MappingEditor.vue`、`stages/UnassignedPool.vue` | 三种投放、来源说明、预览修正、待归属池 |
| 处理台 | `stages/ProcessWorkspace.vue`、`stages/RecipeSteps.vue`、`stages/ParamEditor.vue`、`stages/ReconciliationDiff.vue` | 配方只读、参数修正、对账 diff、溯源 |
| 分析台 | `stages/AnalyzeWorkspace.vue`、`stages/ConclusionCard.vue`、`stages/EvidenceChain.vue`、`stages/InterventionComposer.vue`、`stages/RuleCandidateDialog.vue` | 结论卡、证据链、批注/追问/否决/深挖、教规则 |
| 交付台 | `stages/DeliverWorkspace.vue`、`stages/DeliverableBlock.vue`、`stages/BlockTextEditor.vue`、`stages/BlockChart.vue`、`stages/BlockTable.vue`、`stages/BlockCommentThread.vue`、`stages/RevisionHistory.vue`、`stages/DiffView.vue`、`stages/PublishDialog.vue`、`stages/RevisionRequestDialog.vue` | 6 类块、编辑/批注、版本/diff、改稿指令、发布快照 |
| 介入与不干扰 | `components/InterventionHistory.vue`、`components/PendingMergeChip.vue`、`components/InboxDrawer.vue` | 事件历史、待合并、角标/收件箱 |
| 工具 | `diff.ts`、`persistence.ts` | 行级 diff（自实现）、localStorage 快照（带版本与损坏兜底） |
| 契约 | `src/contracts/{types.ts,client.ts,methods.ts,mock/**}` | v2 方法与 mock 实现（stateful） |

- 复用 `agent/AgentDrawer.vue` 与 `agent/store.ts`：作业内发送时带 `jobContext`；抽屉显示上下文标签（作业标题 / 阶段）。不为作业复制第二套对话组件

### 2.3 状态管理（Pinia）

| store | 内容 | 持久化 |
|---|---|---|
| `jobsStore` | 当前作业、阶段工作区数据、运行态轮询（mock 立即返回） | 经契约 mock 层，不在 store 内直接落盘 |
| `intakeStore` | 投放抽屉开关、当前投放草稿、待归属池 | 同上 |
| `inboxStore` | 待处理介入角标、收件箱已读状态 | `fai.inbox.v1` |
| `sessionStore` | 当前作业/阶段上下文（供抽屉、介入事件使用） | 内存 |

- **契约 mock 层持有唯一可变状态**（`contracts/mock/job-state.ts`），读写均经契约方法；UI store 只做视图缓存。这样 `api` feature 落地时只需替换实现，不动组件
- 本地持久化 key：`fai.jobs.v1`（作业、产物、投放、介入事件、交付物与版本、发布快照的 mock 快照）；`fai.inbox.v1`。`scenario !== normal` 时不恢复本地状态（从 fixture 重建），避免场景互相污染

### 2.4 契约 v2（R-008）

新增类型（zod，`contracts/types.ts` 或 `contracts/job-types.ts`）：

| 类型 | 要点 |
|---|---|
| `Stage` | `collect / process / analyze / deliver` |
| `StageState` | `not_started / running / needs_human / done / conflict` |
| `JobType` / `JobStatus` | `daily / research / adhoc`；9 状态与 `spec.md` R-001 一致 |
| `Job` / `JobListItem` | 标题、类型、品种/主题、目标说明、创建者、状态、阶段、更新时间、父作业 id |
| `Artifact` | `kind`（dataset / recipe / analysis / deliverable）、状态、来源、`pendingMerge`、版本摘要 |
| `Intervention` | `kind` 13 种（ingest / map_fix / recipe / framework / question / delete / rewrite / veto / approve / ask_why / pin_rule / rerun / publish）+ payload / reason / outcome |
| `Upload` / `ExtractionPreview` / `FieldMapping` | 投放元数据、来源说明、抽取预览与字段映射 |
| `RecipeStep` / `ParamChange` / `ReconciliationDiff` | 处理台 |
| `Deliverable` / `Block` / `Revision` / `BlockComment` / `PublishSnapshot` | 块模型与版本；`Block` 为按 `type` 的可辨识联合（conclusion / chart / table / quote / verification / note） |
| `JobContext` | `{jobId, stage}`；`SendMessage.jobContext?` 与 Agent 事件可选字段 |

新增 `DataClient` 方法（契约语义表同步进 `methods.ts`，`contract-build` 重新生成 `CONTRACT.md` / `schema.json`）：

```
listJobs(filter?)            getJob(jobId)                 createJob(input)
getStageWorkspace(jobId,stage)                           rerunStage(jobId, stage)
submitIntake(input)          getIntakePreview(uploadId)    confirmIntake(uploadId, mapping)
listUnassignedUploads()      assignUpload(uploadId, jobId)
updateParams(jobId, changes) getReconciliation(jobId, seriesId)
listInterventions(jobId, filter?)                        markProvisional(jobId, artifactId)
saveBlockText(jobId, blockId, text)                      createBlockComment(jobId, blockId, input)
listRevisions(jobId)         getRevision(jobId, revisionId)
requestRevision(jobId, blockIds, instruction)            resolveRevision(jobId, revisionId, action)
publishDeliverable(jobId)
```

- `AgentClient.send` 增加可选 `jobContext`；`AgentEvent` 公共可选 `jobContext`（不改变 10 类事件与"一次 run 恰好一个终态"规则）
- mock：`fixtures/jobs.json`、`job-detail.json`、`deliverable.json`、`interventions.json`、`uploads.json`；`contracts/mock/job-state.ts` 提供有状态实现；`MockOverrides` 增加 `jobFixtures` 与 `jobScript`
- 场景：既有 5 个 + `job-running`、`job-pending-merge`、`job-conflict`、`job-delivered`（选择优先级同 `?scenario=` > `VITE_MOCK_SCENARIO` > normal）
- 错误形态、日期/时间语义沿用 v1；新方法写进 CONTRACT.md 的参数字义表

### 2.5 检查与测试

- **静态**：沿用 `pnpm check`（generated / colors / glass / updown / grid / network）；新增代码自动纳入；`contract-build` 扩展后 `check --only generated` 必须通过
- **单元**：`diff.ts`（LCS、超长退化）、`persistence.ts`（解析失败重建）、契约 schema（fixtures 全部过 parse）、状态/来源徽映射、`pendingMerge` selector
- **组件**：六个界面与徽标、三态、块渲染与编辑、版本/diff 视图
- **端到端**（Playwright，默认 1440×900）：作业列表/创建/阶段切换/刷新保持；投放三方式与来源说明；处理参数修正；分析介入事件；交付编辑/版本/diff/改稿/发布；待合并 chip（`job-pending-merge` 脚本）；角标/收件箱；破坏性确认与非模态；窄窗口不回归（工作台基线由 frontend-workbench 覆盖）
- **人工验收**：`specs/workbench-interaction/manual-acceptance.md`（M-01~M-10），Handoff 附截图
- 命令：`pnpm check && pnpm typecheck && pnpm lint && pnpm test:unit && pnpm test:e2e`（沿用 `pnpm test`；实现时登记）

## 3. 数据与存储

- 无服务端、无用户私有数据；**上传只在前端读取元数据与文本内容，不落盘文件本体**（`File` 仅用于抽取预览；不写入 localStorage；不读真实 PDF 内容，类型/文件名 + 用户修正驱动 mock 预览）
- localStorage：`fai.jobs.v1`（mock 快照，≤ 1MB 预期；写入前 `JSON.stringify` 超 512KB 时降级为内存并提示）、`fai.inbox.v1`；沿用既有 `fai.rail` / `fai.drawer` / `fai.layout`
- 生成物照旧入库：`contracts/{CONTRACT.md,schema.json}`
- 时间与日期：`asOf` / `ts` 用 ISO 8601 带偏移；作业日期沿用 `TradingDate`（`YYYY-MM-DD`）；审计字段 `created_at`

## 4. 关键流程

1. **创建作业**：列表 → 新建对话框（校验）→ `createJob` → mock 写入状态 + 持久化 → `router.push('/jobs/:id/collect')`
2. **投放**：任意页打开 `IntakeDrawer`（全局按钮由 v2 接入；页面内按钮先可用）→ 选文件/URL/文本 + 来源说明 → `submitIntake` → 预览与映射修正 → `confirmIntake`（可选 `jobId`；否则进待归属池）→ 状态徽显示
3. **阶段推进（mock）**：作业 fixtures 提供运行中/待确认/冲突/已交付样本；阶段轨道显式读 `StageState`，不自行推导；重跑 = 二次确认 → `rerunStage` → 新介入事件
4. **介入**：批注/追问/教规则/否决 → 对应契约方法（返回事件回执）→ `InterventionHistory` 与角标更新
5. **交付版本**：编辑块 → `saveBlockText` 生成 revision（来源=人）→ 版本历史/diff；`requestRevision` 记录指令，mock 回放 agent 改稿事件 → 新 revision（来源=agent）→ 接受/回退；发布 = 二次确认 → `publishDeliverable` 生成不可变快照、作业置 delivered
6. **待合并**：作业运行时（agent 事件带 `jobContext`）人的编辑标 `pendingMerge`；收到该 run 的终态事件（`run.completed` 视为检查点合并；`failed`/`aborted` 保持待合并并提示）→ 清除标记并记一条合并结果
7. **场景切换**：URL/`VITE_MOCK_SCENARIO`/`window.__FAI_MOCK__` → 重置 mock 状态与本地快照 → 页面按场景渲染

## 5. 验收对应

| AC | 实现位置与验证 |
|---|---|
| AC-001-1 | `JobListPage` + `JobCard`（组件）；fixtures 字段断言 |
| AC-001-2 | `jobsStore.filter` + 列表组件（组件）；筛选组合/清空 |
| AC-001-3 | `JobCreateDialog` + e2e（创建 → `/jobs/:id/collect`，契约记录参数） |
| AC-001-4 | 列表/详情三态组件测试 + `scenario=empty/error` |
| AC-001-5 | `JobStatusBadge` 文案/图标映射单测；人工 M-01 |
| AC-002-1 | `StageRail` 组件测试（顺序、当前态、五状态映射） |
| AC-002-2 | e2e 点击切换 + URL + reload 保持；未知 stage 回落 |
| AC-002-3 | `job-running` 场景含 `needs_human` e2e（横幅、跳转、其他阶段可看） |
| AC-002-4 | `rerunStage` + 二次确认 e2e；断言事件 kind=rerun 与历史 |
| AC-002-5 | failed/cancelled fixtures 组件测试（原因 + 占位动作说明） |
| AC-003-1 | `IntakeDrawer` 三处入口 e2e（工作台入口依赖 v2，标记 blocked_by） |
| AC-003-2 | 三种投放 + 白名单组件测试 |
| AC-003-3 | 用途必填 + payload 断言 e2e |
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
| AC-005-4 | `RuleCandidateDialog` + pin_rule 事件组件测试 |
| AC-005-5 | 抽屉 `jobContext` 标签 + mock 回放 e2e |
| AC-005-6 | 三态/冲突场景组件测试 |
| AC-006-1 | 六类块渲染组件测试 + 图表块用契约 chart-spec 与主题；人工 M-05 |
| AC-006-2 | inline 编辑 → revision（来源=人）组件测试；只读块不可编辑断言 |
| AC-006-3 | 批注线程新建/回复/解决 e2e |
| AC-006-4 | `RevisionHistory` 列表 + 历史只读 e2e |
| AC-006-5 | `DiffView` 组件测试（块级差异与摘要） |
| AC-006-6 | `requestRevision` + mock 回放 e2e；新 revision 来源=agent，接受/回退 |
| AC-006-7 | 发布二次确认 → 快照 + delivered + 只读 e2e |
| AC-006-8 | 块来源/状态徽组件测试 |
| AC-007-1 | `InterventionHistory` 渲染 + 阶段/类型筛选组件测试 |
| AC-007-2 | `job-pending-merge` 场景 e2e（待合并 → 终态事件后已合并） |
| AC-007-3 | e2e：正常编辑无模态；删除/发布/取消有二次确认 |
| AC-007-4 | `inboxStore` + 角标/收件箱 e2e |
| AC-007-5 | `check --only glass`（继承；本 feature 不新增玻璃类） |
| AC-008-1 | `contract-build` 生成比对 + 文档字段对拍单测 |
| AC-008-2 | 场景清单单测 + e2e 遍历正常/空/错误/延迟/运行中/冲突/已交付 |
| AC-008-3 | `check --only network`（新代码纳入 allowlist 规则） |
| AC-008-4 | CONTRACT.md 版本 2.0.0 与变更说明；生成物入库 |
| AC-009-1 | `pnpm test` 全绿（实现时登记命令与输出） |
| AC-009-2 | `manual-acceptance.md` M-01~M-10 + Handoff 截图 |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| 共享文件与 `frontend-workbench` 进行中实现冲突（nav / router / TopBar / AppShell / agent store / contracts） | 先落 v2 变更清单（§7）并协调顺序；本 feature 分支基于该 feature 完成后合并；契约只做新增/可选字段 |
| 契约 v2 破坏 frontend-workbench 既有测试 | 不删除/不改既有字段；`CONTRACT_VERSION` 升 2.0.0；合并前跑其 `pnpm test` |
| 上传文件读内容带来隐私/体积风险 | 只读元数据与文本；不做真实解析、不落盘文件、不写私有文档到 localStorage |
| localStorage 容量 / 损坏 | 快照超 512KB 降级内存 + 提示；解析失败重置；mock 数据可整体重置 |
| 行级 diff 性能 | 上限 2000 行，超出显示"变更摘要"；不引入第三方 diff 库（保持依赖最小） |
| 状态色无新增令牌导致冲突徽对比度 | 冲突用图标 + 文字（文字次/琥珀），点睛红只作非文字；如仍不足，登记后继设计变更（不私加色值） |
| 阶段状态在 UI 推导造成误判 | 阶段状态只读契约 `StageState`，不在前端推导 |
| 依赖 v2 / api 延迟 | 本 feature 页面与路由可独立验收；v2 集成任务显式 `blocked_by`；api 不阻塞 mock 验收 |

**回滚**：删除 `frontend/src/jobs/`、`frontend/tests/**/jobs/`、`frontend/e2e/jobs/`、本 spec 目录与 `specs/README.md` 本 feature 行；回退 `contracts/`（types/client/methods/mock 新增部分）与 `agent/events.ts` 可选字段；回退 `app/{nav,router,TopBar,AppShell}.vue` 与 `WorkbenchPage.vue` 的 v2 补丁；`docs/` 不动（本轮未改）。

## 7. 前置变更清单（frontend-workbench v2，需其 Clarify + Gate 1）

本 feature 的导航/工作台/全局入口依赖以下对 `frontend-workbench` 的增量变更；在其 v2 spec 获批前，本 feature 只交付"路由可直达 + 页面内入口"，对应 AC 标记 `blocked_by`：

1. **导航**：`nav.ts` 8 项 → 9 项（"专题研究"升级为"作业"指向 `/jobs`，新增"学习"占位；专题研究作为作业类型保留）——影响该 feature R-002 / AC-002-2、AC-002-3
2. **工作台**：`WorkbenchPage.vue` 焦点带与模块区之间新增**作业轨道**固定件（非模块、不可移除；含待处理介入角标）——影响 R-003
3. **全局入口**：`TopBar.vue` 增加"投放"按钮、`AppShell.vue` 挂载 `IntakeDrawer`——影响 R-002/R-003 的 shell 结构
4. **对话上下文**：`agent/store.ts` 保留事件 `jobContext` 并暴露按作业过滤的 selector；`SendMessage` 透传 `jobContext`

## 8. 实施顺序（任务在 Tasks 阶段拆分，0.5–2h/项）

- **A 契约与骨架**：契约 v2 类型/方法/生成物 → mock 有状态层 + 场景 → 路由与空页面 → 徽标组件 → 持久化与 diff 工具
- **B 作业对象**：列表 / 创建 / 详情 / 阶段轨道 / 三态 / 重跑
- **C 采集台**：抽屉 / 三种投放 / 来源说明 / 预览与映射 / 待归属池
- **D 处理台**：配方 / 参数修正 / 对账 diff / 溯源 / 暂定
- **E 分析台**：结论卡 / 证据链 / 介入动作 / 教规则 / 抽屉上下文
- **F 交付台**：六类块 / 编辑与 revision / 批注 / 版本与 diff / 改稿回放 / 发布
- **G 不干扰与收口**：待合并 / 角标收件箱 / 破坏性确认审计 / 静态守卫 / e2e 全量 / 人工清单
- **H v2 集成**（前置依赖获批后）：导航项 / 工作台作业轨道 / 全局投放入口接线
