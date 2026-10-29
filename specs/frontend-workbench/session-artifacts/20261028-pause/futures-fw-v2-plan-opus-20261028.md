===PLAN_HEADER===
> **v2 Plan 追加（2026-10-28）**：新增 §7「v2 实施设计（v2.1 冻结需求）」。需求依据为 spec v2.1：Walter 已于 2026-10-28 批准 Gate 1，范围含 Q-023～Q-031，52 条 AC 已冻结。§1～§6 原文保留，作为 v1 历史基线；v1 的 45 条 AC 设计没有废弃。§1～§6 与 §7 冲突时，以 §7 为准，具体覆盖范围见 §7.1。本次只产出 Plan，没有修改 spec、tasks、checklist 或产品 ADR，也不授权 Tasks 之后的任何实施。
> **v2 Plan 模型记录**：Plan = `claude-opus-5-5` via `anthropic`。`claude-bridge/claude-opus-5-5` 的最小真实调用因额度或限流不可用；本次只换通道、不换模型，当前限额窗口内不再重试 bridge。协调与落盘 = `openai/gpt-6.1-sol`，只负责读取和串行集成，不是审核员 A。任务 = frontend-workbench v2 Plan §7。基线 = `spec/frontend-workbench-v2` @ `fec355650f614ef42138f409afc748206e941ba1`，工作树干净。失败类别 = 通道额度或限流；本记录已脱敏，不含密钥、token 或原始鉴权报错。
> **v2 审核状态**：§7 需要由审核员 A 新开独立会话审核，并生成 v2 Checklist。A 首选 `claude-fable-5-1`：先测 bridge，不可用时走 anthropic；模型回退按 AGENTS §6。现有 `checklist.md` 只证明 v1，不能授权 v2。§1～§6 未变部分能否复用，也必须由 A 确认；本 Plan 的自检不是审核结论。

===PLAN_V2===
## 7. v2 实施设计（v2.1 冻结需求）

### 7.0 阶段、闸门、基线与依据

- **当前阶段**：Plan（v2）。Gate 1 已通过：spec v2.1 由 Walter 于 2026-10-28 批准，52 条 AC 已冻结。各需求的 AC 数为：R-001～R-009 分别 6/8/9/6/9/4/5/3/2。后续流程为：A 独立 v2 Checklist → Tasks（追加 v2 任务）→ Analyze → Implement。
- **本节不做的事**：不修改 spec、tasks、checklist 或产品 ADR；不授权实施。
- **设计依据**：
  - AGENTS §2/§4/§5/§6；
  - `docs/interaction.md` §2.4、§3.3、§7.2；
  - `docs/designUI.md` §2.1、§2.2、§3.1、§3.2、§3.6、§3.9、§3.10；
  - D-015：涨跌色作用域不变；
  - D-016：九项菜单、作业轨道、对话作为接口之一；
  - D-018：使用“格物致知 / 定稿”，路由 `/learning` 不变；
  - D-019：只约束产品运行时，与本 Plan 无关。
- **文档状态**：docs 增量已经通过 `54570b8` 合入当前树。spec 页首“尚未同步”是旧描述，不再列为未完成依赖。
- **视觉基准**：只以 designUI.md 的文字与令牌为准。`D:/2030/Futures-AI-frontend/frontend/assets/workbench-v2` 未经批准，不作为视觉基准，也不纳入本 Plan。
- **外部设计输入**：只读参考 workbench-interaction，位置为 `D:/2030/Futures-AI-interaction` @ `8bd1b31`。
  - 其 spec v1.1 已通过 Gate 1。
  - 其 plan 含待 A 复核的修订；该 checklist 的 R2 结论针对更早的提交，不覆盖当前修订。
  - 因此它只是设计输入，不是已实现、已审核的共享接口。§7.3 的交接项在生产方已审核产物中落实前，壳方对应任务不得开启。
- **实施起点（硬前置）**：Tasks 头部必须登记 v1 完成 Review、Gate 2、Handoff 并合入 main 的准确 SHA。v2 实现分支从该 SHA 建立。
  - `fdaa7d8`（本分支前端快照）不可作为开工基线。
  - `0ffa15e`（v1 实施分支 HEAD，尚未 Handoff）也不可作为开工基线。
  - 本节引用的 v1 文件以 Handoff SHA 的实际内容为准，包括 `agent/store.ts`、`AgentDock.vue`、`AgentDrawer.vue`、`CotTimeline.vue`、`workbench/*` 和 `stores/{ui,badges,layout}.ts`。Tasks 起草时必须重新读取。
  - 本轮只做设计，不通过占位宣称任何集成已经完成。

### 7.1 对旧节的覆盖（只改增量）

| 旧节 | v2 处理 |
|---|---|
| §1 目录 | 新增 `src/workbench/JobTrack.vue`。`src/jobs/**` 归 workbench-interaction，不属于本 feature |
| §2.2 导航 | 八项菜单加专题研究子项改为九项菜单（§7.4）。`getResearchList` 不再被壳消费 |
| §2.3 工作台 | `FocusBand + ModuleGrid` 改为 `FocusBand → JobTrack → ModuleGrid`（§7.5） |
| §2.5 对话 | 新增作业上下文的捕获、绑定、展示和按作业查看（§7.7）。两档高度、时间线、模块角标、引导跳转和唯一终态不变 |
| §2.7 契约 | 契约 1.0.0 → 2.0.0 只由 workbench-interaction 升级（§7.8）。壳不改 schema、version 或 mock |
| §3 存储 | 不变（§7.9） |
| §5 验收 | 新增 7 条 AC；AC-002-2/002-3/002-4/005-1 的验收落点由 §7.11 取代；其余行沿用旧落点，并加入 v2 回归 |
| §6 回滚 | 旧“删除 `frontend/`”对 v2 不适用，改用 §7.12 的精确回滚 |

§2.1、§2.4、§2.6、§2.8、§2.9 全部沿用；v1 45 条 AC 不废弃。

### 7.2 文件唯一写入者

| 路径 | 唯一写入者 | 备注 |
|---|---|---|
| `frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue,AppShell.vue}` | 壳（本 feature） | AppShell 唯一挂载全局采集抽屉 |
| `frontend/src/stores/app.ts` | 壳 | 只停止加载研究列表 |
| `frontend/src/workbench/{WorkbenchPage.vue,JobTrack.vue}` | 壳 | FocusBand、ModuleGrid、ModuleLibrary 不改 |
| `frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}` | 壳 | 只消费上下文并负责展示 |
| `frontend/src/design/tokens.json`、`design/ui/UI_DARK_ADDITIONS.md`、`src/design/generated/*` | 壳 | 只新增 `layout.intake_width` 一项；生成物只经 `pnpm -C frontend tokens` 再生成 |
| 壳测试：`tests/component/{topbar,timeline,job-track}.spec.ts`、`tests/unit/{agent-context,manual-acceptance}.spec.ts`、`e2e/{shell,workbench,modules,breakpoints,agent,integration-v2}.spec.ts` | 壳 | 加粗文件名表示计划新增，当前并不存在：`job-track.spec.ts`、`agent-context.spec.ts`、`integration-v2.spec.ts` |
| `specs/frontend-workbench/**`，含 `manual-acceptance.md` | 壳 | — |
| `frontend/src/jobs/**`：页面、`routes.ts`、`jobsStore/intakeStore/sessionStore/inboxStore`、`IntakeDrawer.vue`、徽标组件，以及 jobs 测试 | workbench-interaction | 壳只导入，不写入 |
| `frontend/src/contracts/**`、`frontend/src/agent/events.ts`、`scripts/contract-build.mjs` | workbench-interaction | 契约 2.0.0 的拥有者 |
| `frontend/contracts/{CONTRACT.md,schema.json}` 生成物 | workbench-interaction | 只改源，再执行 `pnpm -C frontend contract` 生成；任何一方都不得手改 |
| `tests/unit/{contracts,mock,contract-doc}.spec.ts` | workbench-interaction | 承载 AC-007-5 的生产方证据 |
| `frontend/src/main.ts` | workbench-interaction | 只负责 `addRoute` 注册；壳不改 |
| `frontend/package.json`、lock、工具链配置 | 两方都不改 | 如需修改，先登记 |
| `specs/README.md` | 两方各自更新本 feature 一行 | 由协调集成人串行合并 |
| `backend/`、`docs/` 权威文件 | 不改 | — |

### 7.3 契约与 store 交接要求（生产方 → 壳）

只有当某个交接项已经出现在生产方的已审核产物中，壳方才能开启对应任务。已审核产物指：A 已通过对应的 plan 修订，代码已合入，并登记了 SHA。壳方实际使用的字段、方法和导出名称，以该 SHA 为准；如有差异，Tasks 必须照实更新，壳侧不得自行兜底，也不得复制实现。

| # | 生产方需要落实的内容 | 解锁的壳任务 |
|---|---|---|
| H-1 | `CONTRACT_VERSION = '2.0.0'`，并导出 `JobContext = {jobId, stage}`。`SendMessage.jobContext?` 与十类 `AgentEvent` 都带公共可选 `jobContext`。mock `send` 把 payload 中的上下文原样写入该 run 的全部事件。原十类事件和旧 fixtures 不带该字段时仍可解析 | 上下文 store；AC-005-8、AC-005-9 |
| H-2 | `listJobs(filter?)` 返回 `JobListItem[]`，至少包含 `id/title/type/status/currentStage/stages[4]{stage,state,pendingCount}/pendingCount/updatedAt`，默认按 `updatedAt` 倒序。契约必须导出 `JobStatusLabel/StageLabel/StageStateLabel`，并提供文案和图标。**当前缺口**：其 plan 尚未声明“进行中”状态集合，例如 `ACTIVE_JOB_STATUSES` 或对应的 filter 参数；也未声明 `JobTypeLabel`。这两项须由互动方补齐，壳不得自建映射。若互动方拒绝，报 Walter 裁决 | JobTrack；AC-003-7～AC-003-9 |
| H-3 | `jobs/routes.ts` 导出 `jobs`（`/jobs`）和 `job-detail`（`/jobs/:id/:stage?`）两条路由。`stage ∈ collect/process/analyze/deliver`，`meta = {title, en, navId:'jobs'}`。`main.ts` 在 mount 前调用 `addRoute`，用同名记录替换壳的 `jobs` 占位 | 集成部分：AC-002-2、AC-002-3、AC-003-7 |
| H-4 | `sessionStore.context: JobContext \| null` 只读。进入作业详情或切换阶段时设置；离开 `job-detail` 时，必须在同一次路由导航内同步清空，例如在路由守卫中清空。该值不能由 lastRun 推导 | AC-005-8 |
| H-5 | `intakeStore` 提供 `open(jobId?: string)`、`close()`、`isOpen` 和 `jobId`；`jobId` 是打开时的快照。`IntakeDrawer.vue` 的根元素使用 `.glass-drawer`，填满壳提供的容器。它不得自设 `position: fixed`、遮罩、`aria-modal` 或焦点锁；关闭时不导航，也不调用 agent | AC-002-8 |
| H-6 | 场景 `empty`、`error`、`slow` 覆盖 `listJobs`。`jobFixtures` 覆盖项可以新增作业。mock 状态层先处理 agent 事件，再通知 UI | AC-003-9、AC-002-3 |

本 feature 不复制 `Job`、`Stage` 或 schema，不另建 mock，不另升契约版本，也不推进阶段。

### 7.4 导航与路由（R-002）

- **`nav.ts` 九项固定顺序**：

  | id | path | 标题 | en | placeholderOwner |
  |---|---|---|---|---|
  | `workbench` | `/workbench` | 工作台 | Workbench | — |
  | `jobs` | `/jobs` | 作业 | Jobs | `workbench-interaction` |
  | `daily` | `/daily` | 日报 | Daily report | `daily-report` |
  | `prices` | `/prices` | 价格 | Prices | `prices` |
  | `balance` | `/balance` | 平衡表 | Balance sheet | `balance-sheet` |
  | `logistics` | `/logistics` | 物流 | Logistics | `logistics` |
  | `learning` | `/learning` | 格物致知 | Inquiry | `learning` |
  | `knowledge` | `/knowledge` | 知识库 | Knowledge base | `knowledge-base` |
  | `settings` | `/settings` | 设置 | Settings | `settings` |

  `research` 项删除。
- **`router.ts`**：路由继续由 `navItems` 生成。保留 `daily` 的 `/daily/:date?`，删除 `research` 的 `/research/:id?` 特例。`jobs` 生成名为 `jobs` 的占位路由；壳不定义 `job-detail`，作业路由只由 H-3 提供。旧 `/research/*` 落入既有兜底页，不承诺旧 URL 迁移。
- **`Rail.vue`**：删除专题研究子列表及其样式。当前项判定改为：`route.meta.navId === item.id`。若同时满足 `route.name === item.id`，设置 `aria-current="page"`；否则设置 `aria-current="location"`，例如作业详情会高亮“作业”项。全局同一时刻只有一个 `aria-current`。窄于 980 时的顶部横向导航按九项换行，不产生横向溢出。
- **`stores/app.ts`**：不再调用 `getResearchList`，加载步骤从 4 步变为 3 步，状态文案去掉“研究列表”。`getResearchList`、`ResearchItem`、`research.json` 和 `MockOverrides.fixtures.research` 保持兼容，不删除；它们归契约拥有者。

### 7.5 工作台作业轨道（R-003）

- **页面结构**：`WorkbenchPage.vue` 依次为页头、`FocusBand`、`JobTrack` 和 `ModuleGrid`。`ModuleGrid` 仍是唯一纵向滚动区。
- **轨道属性**：`JobTrack` 不是模块，不进入模块目录或 layout，也不提供移除、排序或 AI 角标操作。
- **`JobTrack.vue` 结构**：
  - 容器为透明行，不加新的玻璃样式。
  - 卡片复用 `.glass-module`，保证文字只落在一层玻璃上。
  - 卡片列表横向排列，在轨道内部使用 `overflow-x: auto`；页面本身不得出现横向滚动条。
  - 高度固定为一行。
  - 不引用 `updown.css`，不新增颜色字面量。
- **数据读取**：组件挂载时调用 `dataClient.listJobs()`。按 H-2 声明的进行中状态集合或 filter 选出卡片，不通过阶段状态推断进度。组件状态只保存在本地 ref，不持久化。
- **卡片内容**：
  - 显示标题和类型文案（`JobTypeLabel`）。
  - 四阶段固定按提取 → 处理 → 分析 → 交付排列。每段使用 `StageLabel`，再加 `StageStateLabel` 的图标和文案；运行中、待人工确认和冲突必须显示文字。
  - `pendingCount > 0` 时显示“待介入 N”角标。
  - 作业状态优先复用互动方已审核的 `JobStatusBadge`；壳不维护第二份映射。
- **点击行为**：点击卡片执行 `router.push({name:'job-detail', params:{id, stage: item.currentStage}})`。壳不推进阶段，也不改写作业状态。
- **三种状态**：
  - 加载：沿用 v1 的 Loading。
  - 空：显示“暂无进行中的作业”及原因，并提供 `/jobs` 链接。
  - 错误：沿用 v1 的 ErrorState，诊断信息为 `{source:'job-track', code, message, ts}`，支持复制和重试。
  - 三种状态都不影响焦点带和模块区独立渲染。
- **刷新**：
  - 每次进入工作台都会重新挂载并读取一次。
  - 已有 agent store 中，带 `jobContext` 的 run 终态数增加时，重新读取一次。
  - 错误态重试时，重新读取一次。
  - 不做轮询，不新建事件总线，不建立第二套状态机。

### 7.6 全局投放（R-002）

- **入口**：`TopBar.vue` 新增文字按钮“投放”，点击时发出 `intake` 事件。`TopBar` 仍只接收 props，便于组件测试。
- **打开流程**：AppShell 处理 `intake` 事件，调用 `intake.open(session.context?.jobId)`。
  - 打开时对 `jobId` 做一次快照。
  - 在作业列表或其他非作业页面打开时，`jobId` 为 `undefined`。
  - 打开后，路由切换不会改写这个快照。
- **挂载位置**：AppShell 的第二行改为 `.route-area { position: relative; min-height: 0 }`，其中包含 `<main>` 和 `<aside class="intake-slot" v-if="intake.isOpen">`。
  - `.intake-slot` 使用绝对定位，覆盖 `.route-area` 右侧整高。
  - 宽度为 `min(var(--fai-layout-intake-width), 50%)`；`z-index` 使用既有 `--fai-z-drawer`。
  - 不加遮罩，不使用焦点锁，也不设置 `aria-modal`。
  - 打开时焦点移入 slot（`tabindex="-1"`）；关闭时焦点回到“投放”按钮。
  - 整个应用只有这一处挂载点。
- **与 AgentDrawer 共存**：
  - 投放打开时，AppShell 在 `.content` 上设置局部 CSS 变量 `--shell-intake-offset`，值与 slot 宽度相同。
  - `AgentDrawer` 使用 `inset-inline-end: var(--shell-intake-offset, 0)` 让出右侧空间。
  - 两个面板都使用 `.glass-drawer`，可以各自独立开关，并排显示，不新增第四层。
  - 不修改 `ui.drawer` 或 `fai.drawer`，也不引入 overlay 管理器。
  - 支持的最小宽度为 960；这时两个面板仍可并排，`50%` 上限保证不溢出。
- **关闭**：执行 `intake.close()`。路由不变，壳不触碰 agent store，后台 run 不重启。
- **新令牌**：`layout.intake_width` 的值在实施时确定，建议为 `24rem`。`source` 指向 `design/ui/UI_DARK_ADDITIONS.md#drawer`。

### 7.7 对话的作业上下文（R-005）

- **发送时捕获**：`agent/store.ts` 的 `send(message)` 在第一个 `await` 之前，同步读取 `useSessionStore().context` 的快照。
  - 有上下文时，调用 `agentClient.send({sessionId, message, jobContext})`。
  - 没有上下文时，payload 不出现 `jobContext` 键，与 v1 形状一致。
  - 不读取 lastRun，也不读取路由。
- **run 绑定**：`AgentRun` 增加 `jobContext?`。收到 `run.started` 时，把事件中的上下文写入 run；之后这个 run 的归属不再改变。切换页面、切换阶段或清空 sessionStore，都不改写历史 run。
- **接收事件**：`receive` 原样接收并处理全部事件，不按作业过滤，也不丢弃任何事件。
- **不变规则**：模块角标（`badges.markRunning/settle`）和“每个 run 恰好一个终态”的规则不变；角标在全局范围有效，不按作业拆分。
- **查看筛选**：store 提供 `runsFor(jobId | null)` selector，只在 run 粒度筛选。
  - AgentDrawer 页头新增“查看：全部 / 作业 X”选择器。
  - 选项来自当前 runs 中出现过的不同 `jobId`。
  - 选择结果只保存在组件本地 ref，不持久化。
- **展示**：
  - 输入栏显示当前上下文 chip：有上下文时为“作业 {jobId} · {StageLabel}”，否则为“全局”。
  - 每个 run 头也显示它绑定的 chip。
- **单次发送**：会话 ID 沿用 v1 的单会话。运行中禁止再次发送的规则保持不变，不扩展为多并行发送功能。多作业交错只在 store 层验证（AC-005-9）。
- **上下文不带来新能力**：上下文不让 agent 推进阶段，也不让 agent 覆盖产物。

### 7.8 契约（R-007）

- **版本**：只由 workbench-interaction 统一升级到 2.0.0，并且只新增可选 `jobContext` 以及作业相关方法和类型。原十类事件、v1 字段语义和唯一终态都不改变。
- **生成物**：只修改生成源，再重新生成；生成和提交都由契约拥有者负责。
- **壳的使用范围**：壳只导入类型、`dataClient/agentClient`，以及 §7.3 列出的已审核 store 和组件。壳不改 schema、`CONTRACT_VERSION`、mock、fixtures，也不改契约测试。
- **AC-007-5 证据**：生产方证据来自互动方的契约测试。壳只在 S1、S2 运行全量回归作为参与证据，不代勾。

### 7.9 数据与存储

- 不新增 localStorage 键。
- 作业和 run 的业务状态不写入壳的持久化存储；对话历史和 v1 一样只保存在内存中。
- `fai.rail`、`fai.drawer`、`fai.layout` 不迁移，也不改格式。
- `fai.jobs.v1` 和 `fai.inbox.v1` 属于互动方，壳不读、不写。

### 7.10 关键时序

1. **投放**：点击“投放”→ 快照 `session.context?.jobId` → `intake.open(jobId)` → `.intake-slot` 渲染 `IntakeDrawer`，AgentDrawer 让出右侧 → 用户关闭时调用 `intake.close()`，焦点回到按钮；路由和 run 都不受影响。
2. **作业内发送**：从输入栏提交 → 同步捕获上下文 → 调用 `send` → mock 回放带 `jobContext` 的 `run.started` → `receive` 创建 run 并绑定归属 → 后续事件按 `runId` 归入 → 唯一终态 → `JobTrack` 在下次挂载时，或因带上下文 run 的终态数变化而重新读取。
3. **离开作业**：路由导航离开 `job-detail` → sessionStore 在同一次导航内被置为 `null`（H-4）→ 下一次发送不带 `jobContext`，chip 显示“全局”。

### 7.11 验收对应（52 条）

S0、S1、S2 的定义见 §7.13。表中 `blocked_by` 表示：生产方页面和 store 已交付并合入、壳 S1 完成后，才能验证该项。

| AC | 类型 | 落点与验证 | 阶段 |
|---|---|---|---|
| AC-001-1、AC-001-2、AC-001-3、AC-001-4、AC-001-5、AC-001-6 | 不变 | 沿用旧 §5。`pnpm -C frontend check` 自动覆盖 `JobTrack`、chip 和 slot：colors、glass 只允许三类、updown 中轨道不得引用；`layout.intake_width` 纳入 generated 对拍 | S0/S1 |
| AC-002-1 | 不变 | 旧 §5；`e2e/shell.spec.ts` 回归 | S0 |
| AC-002-2 | 修改；部分集成 | **壳部分**：`shell.spec` 验证九项顺序、href、`aria-current`、学习占位 owner 为 `learning`、作业占位 owner 为 `workbench-interaction`、直达和刷新（含 `/jobs`、`/learning`），且没有 `.research-link`。**集成部分**：`integration-v2` 验证 `/jobs/:id/:stage` 直达、刷新后仍高亮“作业”，且名为 `jobs` 的路由唯一。集成部分 blocked_by workbench-interaction（H-3） | S0 / S2 |
| AC-002-3 | 修改；集成 | `integration-v2`：通过 `jobFixtures` 新增一项，经 `/jobs` 可见并能进入详情。全项 blocked_by workbench-interaction（H-3/H-6）；“无专题子项”并入 AC-002-2 的壳部分 | S2 |
| AC-002-4 | 修改 | `topbar.spec`：保留旧有 ticker 和状态点断言；新增“投放”按钮可见、文案为“投放”、点击发出 `intake` 事件 | S0 |
| AC-002-5 | 不变 | `shell.spec` | S0 |
| AC-002-6 | 不变 + 回归 | `breakpoints.spec`：保持 10 个视口不变（960/979/981/1239/1241/1399/1401/1499/1501/1440×900）；新增断言轨道存在、无横向溢出；在 960 和 1440×900 下同时打开投放与对话，仍无溢出 | S1/S2 |
| AC-002-7 | 不变 | `shell.spec`。进度断言按 3 个加载步骤更新实测值，状态文案去掉“研究列表” | S0 |
| AC-002-8 | 新增；集成 | `integration-v2`：在工作台、`/jobs`、作业详情和 `/prices` 打开“投放”，都应进入同一个 `.intake-slot`。作业详情页的快照 `jobId` 等于当前作业；其他页面为 `undefined`。在 `long` run 运行中关闭投放后，URL 不变、`runId` 不变、步骤继续增加且不重复。blocked_by workbench-interaction（H-5） | S2 |
| AC-003-1、AC-003-2、AC-003-3、AC-003-4、AC-003-5 | 不变 | 旧 §5：`focus-band.spec` / `workbench.spec` | S0 |
| AC-003-6 | 不变 + 回归 | `workbench.spec`：增删模块后，焦点带和轨道都仍在 | S1 |
| AC-003-7 | 新增；部分集成 | **组件部分**：`job-track.spec` 使用互动方真实 mock `listJobs`，验证名称、类型文案、四阶段顺序、状态文案和图标、待介入角标；修改 `jobFixtures` 后重新读取，结果保持一致。**集成部分**：`integration-v2` 验证点击进入 `/jobs/:id/<currentStage>`，且轨道卡集合等于 `/jobs` 中的进行中项。集成部分 blocked_by workbench-interaction | S1 / S2 |
| AC-003-8 | 新增 | `workbench.spec` 和 `modules.spec`：DOM 顺序为 Focus → Track → Grid；模块库中没有轨道；轨道没有移除、上移或下移操作；增删、移动模块并刷新后，轨道位置不变 | S1 |
| AC-003-9 | 新增 | `job-track.spec`：用 `slow` 触发加载态，用 `empty` 触发空态并提供 `/jobs` 入口，用 `error` 触发错误态并支持复制诊断；三种状态下焦点带和模块区都能独立渲染 | S1 |
| AC-004-1、AC-004-2、AC-004-3、AC-004-4、AC-004-5、AC-004-6 | 不变 | 旧 §5。AC-004-1 和 AC-004-2 的回归与 AC-003-8 共用 | S0/S1 |
| AC-005-1 | 不变 + 回归 | `agent.spec`：九个路由的输入栏都可见 | S0 |
| AC-005-2、AC-005-3、AC-005-4、AC-005-5、AC-005-6、AC-005-7 | 不变 | 旧 §5：`timeline.spec` / `agent.spec`。v1 无上下文脚本全部照旧通过 | S1 |
| AC-005-8 | 新增；部分集成 | **单元部分**：`agent-context.spec` 验证四件事：发送时捕获快照；无上下文时没有该键；由 `run.started` 绑定归属；上下文变化不改已有 run。**端到端部分**：`integration-v2` 在 `/jobs/:id/analyze` 使用 `long` 发送消息，chip 显示该作业和阶段；切到 `deliver`，再切到 `/prices`，原 run 的 chip 不变；之后全局发送显示“全局”。端到端部分 blocked_by workbench-interaction（H-1/H-4） | S1 / S2 |
| AC-005-9 | 新增 | `agent-context.spec` 使用真实 mock `AgentClient` 和 fake timers，交错回放作业 A、作业 B 与无上下文 run。按作业查看时，只显示对应 run；`receive` 收到全部事件；模块角标不变；每个 run 恰好一个终态。`timeline.spec` 补充筛选器和 chip 断言 | S1 |
| AC-006-1、AC-006-2、AC-006-3、AC-006-4 | 不变 | 旧 §5 | S0 |
| AC-007-1、AC-007-2、AC-007-3、AC-007-4 | 不变 | 旧 §5。network 守卫纳入新文件。壳侧 e2e 继续使用 normal、empty、error、slow 场景。2.0.0 文档由生产方重新生成；壳只运行 `check --only generated` 作为回归 | S1 |
| AC-007-5 | 新增；生产方证据 | 由互动方契约测试证明可选上下文已声明、旧消息和 fixtures 可解析、新上下文可透传。壳运行全量回归只作参与证据；未见生产方证据前不得勾选 | S1/S2 |
| AC-008-1、AC-008-2、AC-008-3 | 不变 | 旧 §5。新令牌的 `source` 必须能解析（AC-008-2） | S1 |
| AC-009-1 | 不变 | `pnpm -C frontend test` 全绿；只有集成后的全量结果才算 v2 证据 | S2 |
| AC-009-2 | 不变 + 扩充 | `manual-acceptance.md` 保留 M-01～M-08，并新增 M-09～M-12；`manual-acceptance.spec` 同步；Handoff 时附截图 | S0 文本 / S2 截图 |

### 7.12 测试命令、人工验收与回滚

- **现有命令**：
  - `pnpm -C frontend check [--only <name>]`
  - `pnpm -C frontend typecheck`
  - `pnpm -C frontend test:unit -t "AC-005-9"`
  - `pnpm -C frontend test:e2e -g "AC-003-8"`
  - `pnpm -C frontend test:e2e e2e/integration-v2.spec.ts`
  - 全量：`pnpm -C frontend test`，即 `check + typecheck + lint + test:unit + test:e2e`
- **证据边界**：上面的命令和新增文件都是计划，本轮没有运行，也不是验收证据。
- **人工验收**：
  - M-09 导航：九项菜单、作业详情高亮“作业”、没有专题子项、格物致知占位页注明归属。
  - M-10 轨道：位置正确、没有新增玻璃层、四阶段和状态不只靠颜色、三种状态、在 1440×900 下不挤压。
  - M-11 投放：非模态、与对话抽屉并排、在 960 下不溢出、关闭后回到原页面。
  - M-12 上下文：chip、按作业查看、离开作业后全局发送。
  - 视口沿用 10 个，与 AC-002-6 相同。
- **精确回滚**：只撤销 v2 补丁本身。
  - 优先使用 `git revert <v2 壳方提交>`。
  - 必要时，只对 §7.2 中壳方拥有的文件执行 `git checkout <v1 Handoff SHA> -- <这些文件>`；执行前必须确认这些文件没有其他 feature 的后续改动。
  - 新令牌通过修改源文件、再重新生成来撤销。
  - 同时撤回 M-09～M-12 和新增测试。
  - `specs/README.md` 只改本 feature 一行。
  - 禁止使用旧 §6 删除整个 `frontend/`；禁止对其他 feature 的文件做整文件 reset；禁止撤销互动方的 jobs、契约或 `main.ts` 修改。
  - 撤销壳侧改动后，互动方相关 AC 恢复为 blocked。

### 7.13 分阶段依赖（实施依赖与设计输入分开）

| 阶段 | 内容 | 依赖 | 可验证 | 必须 blocked |
|---|---|---|---|---|
| S0 壳独立 | nav、router、Rail、`app.ts`；TopBar 按钮；M-09～M-12 文本 | v1 Handoff SHA | AC-002-2 壳部分、AC-002-4，以及不变项回归 | 未接线的按钮不得宣称满足 AC-002-8；S0 不单独 Handoff |
| S1 消费契约 | `JobTrack`；agent 上下文；AppShell slot 与令牌 | S0 + H-1～H-6 已审核并合入 | AC-003-7 组件部分、AC-003-8、AC-003-9、AC-005-9、AC-005-8 单元部分、AC-002-6 回归 | — |
| S2 集成 | `integration-v2`、全量命令、人工截图 | S1 + 互动方页面和 `IntakeDrawer` 已合入 | 集成部分：AC-002-2、AC-002-3、AC-002-8、AC-003-7、AC-005-8 | 外部阻塞未解除时，Converge 必须报告“未收敛（外部阻塞）” |

依赖链为单向：互动方 A～G 组只依赖 v1，不依赖壳；壳 S1 依赖互动方交付的生产方产物；互动方的 H 组集成验证依赖壳 S1。双方不需要等对方全量完成，因此不存在循环依赖。

### 7.14 风险

| 风险 | 对策 |
|---|---|
| 生产方接口名或字段与设计输入不一致 | 任务开启以 §7.3 的已审核 SHA 为前提；出现差异时更新 Tasks，壳不做兜底 |
| H-2 缺少进行中状态集合或类型文案 | 交给互动方补齐；若对方拒绝，报 Walter 裁决，壳不自建映射 |
| `addRoute` 同名替换失败，导致双路由 | 在 `integration-v2` 中断言名为 `jobs` 的路由唯一 |
| sessionStore 清空时机滞后 | 由 H-4 约束为同一次导航内同步清空，并由 AC-005-8 的端到端测试覆盖 |
| 投放与对话抽屉在窄宽下互相遮挡 | 在 960 和 1440 下同时打开两者，执行 breakpoints 断言，并完成 M-11 人工验收 |
| 轨道挤压 900 高度的视口 | 轨道固定为一行，并通过 AC-002-6 和 M-10 验证 |
| 契约 2.0.0 导致 v1 测试变红 | 壳只更新壳语义相关测试；契约测试由互动方负责修复 |
| v1 Handoff 延迟 | 整体标记为 blocked，不用 `fdaa7d8` 或 `0ffa15e` 提前开工 |

===README_ROW===
| frontend-workbench | in-progress（v1：T-01～T-15 已实施，待 Review / Gate 2 / Handoff；v2.1：Gate 1 已通过 → v2 Plan §7 已起草，待 A 独立 Checklist） | 无后端依赖。v2 实施起点必须是 v1 Handoff 合入的准确 SHA，取得前不得开工。v2 集成 AC（AC-002-2 部分 / AC-002-3 / AC-002-8 / AC-003-7 部分 / AC-005-8）依赖 workbench-interaction 已审核并合入的契约 2.0.0、jobs 路由、intake/session store 与采集抽屉 | 2026-10-28 | v1 的 45 条 AC 已通过 A Checklist，只授权 v1。v2 分支为 `spec/frontend-workbench-v2`（基线 `fec3556`），共 52 条 AC；`plan.md` §7 为 v2 设计（Plan = `claude-opus-5-5` via `anthropic`）。`tasks.md` 和 `checklist.md` 仍为 v1，不授权 v2 实施 |