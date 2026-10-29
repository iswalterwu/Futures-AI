===PLAN_HEADER===
> **v2 Plan 追加（2026-10-28）**：新增 §7「v2 实施设计（v2.1 冻结需求）」。需求依据是 spec v2.1：Walter 已于 2026-10-28 批准 Gate 1，范围包括 Q-023～Q-031，52 条 AC 已冻结。§1～§6 原文保留，作为 v1 历史基线；v1 的 45 条 AC 设计没有废弃。§1～§6 与 §7 冲突时以 §7 为准，覆盖范围见 §7.1。本轮是 Plan 文本收敛，只交付本文件 §7 和 `specs/README.md` 本 feature 一行的文本；没有修改 spec、tasks、checklist、产品 ADR 或代码。§7 中的新增令牌、文件和测试都只是计划，本轮不写入，也不授权 Tasks 之后的任何实施。
> **v2 Plan 模型记录**：Plan = `claude-opus-5-5` via `anthropic`。`claude-bridge/claude-opus-5-5` 的最小真实调用因额度或限流失败；按规则只换通道、不换模型，当前限额窗口内不再重试 bridge。协调与落盘 = `openai/gpt-6.1-sol`，只负责读取和串行集成，不是审核员 A。任务 = frontend-workbench v2 Plan §7 文本收敛。基线 = `spec/frontend-workbench-v2` @ `fec355650f614ef42138f409afc748206e941ba1`。失败类别 = 通道额度或限流；本记录已脱敏，不含密钥、token 或原始鉴权报错。
> **v2 审核状态**：§7 需要审核员 A 新开独立会话审核，并生成 v2 Checklist。A 首选 `claude-fable-5-1`：先测 bridge，不通再走 anthropic；模型回退按 AGENTS §6。现有 `checklist.md` 只证明 v1，不能授权 v2。§1～§6 未变部分能否复用，也要由 A 确认。本 Plan 的自检不是审核结论；文中对外部 feature checklist 的只读核对，也不是本 feature 的审核。

===PLAN_V2===
## 7. v2 实施设计（v2.1 冻结需求）

### 7.0 阶段、闸门、基线与依据

- **当前阶段**：Plan（v2）。Gate 1 已通过：spec v2.1 由 Walter 于 2026-10-28 批准，52 条 AC 已冻结。各需求的 AC 数为：R-001～R-009 分别 6/8/9/6/9/4/5/3/2。后续流程：A 独立做 v2 Checklist → Tasks（追加 v2 任务）→ Analyze → Implement。
- **本节不做的事**：不修改 spec、tasks、checklist、产品 ADR 或代码；不授权实施。
- **设计依据**：
  - AGENTS §2/§4/§5/§6；
  - `docs/interaction.md` §2.4、§3.3、§7.2；
  - `docs/designUI.md` §2.1、§2.2、§3.1、§3.2、§3.6、§3.9、§3.10；
  - D-015：涨跌色作用域不变；
  - D-016：九项菜单、作业轨道，对话只是接口之一；
  - D-018：使用“格物致知 / 定稿”，路由 `/learning` 不变；
  - D-019：运行时角色芯片、模型档和成本不属于本次冻结的 52 条 AC 增量，Plan 不顺手扩入。开发流程的模型路由仍按 AGENTS §6。
- **文档状态**：docs 增量已通过 `54570b8` 合入当前树。spec 页首“尚未同步”是旧描述，不再列为未完成依赖。
- **视觉基准**：只以 designUI.md 的文字和令牌为准。未经批准的原型位于 `D:/2030/Futures-AI-frontend/specs/frontend-workbench/assets/workbench-v2`，它不作为视觉基准；本 Plan 不读取、不引用其内容。
- **外部设计输入**：workbench-interaction（下称“互动方”）只作只读参考，固定设计基线为 `D:/2030/Futures-AI-interaction` @ `8bd1b31`。
  - 2026-10-28 只读核对：它的 spec v1.1 已通过 Gate 1。
  - 它的 `checklist.md` 当前有效轮次是 **R3**，审查对象为 `8bd1b31`，结论为**未通过**。阻断项有两个：
    - B-09：`SourceNote` 的来源发布日期被误改为 `finalizedAt`；
    - B-10：`Deliverable` 的 `draft/final` 定稿状态没有设计落点。
  - 这两项由互动方修 Plan，再经 A 做 R4 复核；壳方不修，也不依赖。
  - 该 worktree 中已有等待 R4 的补正文字，但未审核前不算数。
  - 结论：**外部交接未就绪**，必须以互动方最新有效审核为准，不能以旧的 R2 通过为准。外部 checklist 可能被并行会话更新；本 Plan 的固定设计基线仍是 `8bd1b31`，核对结果也不是本 feature 的审核结论。
  - 互动方分支后续移动，不算已交付证据。§7.3 各交接项须按其规则交付后，壳方对应任务才能开启。
- **实施起点（硬前置）**：Tasks 头部必须登记 v1 完成 Review、Gate 2、Handoff 并合入 main 的准确 SHA。双方都以它作为实施起点，v2 实现分支也从这个 SHA 建立。
  - `fdaa7d8`（本分支前端快照）不能作为开工基线。
  - `0ffa15e`（v1 实施分支 HEAD，尚未 Handoff）也不能作为开工基线。
  - 本节引用的 v1 文件以 Handoff SHA 的实际内容为准，包括 `agent/store.ts`、`AgentDock.vue`、`AgentDrawer.vue`、`CotTimeline.vue`、`app/AppShell.vue`、`workbench/*` 和 `stores/{app,ui,badges,layout}.ts`。Tasks 起草时必须重新读取。
  - 当前只读参照的是 v1 实施 worktree `D:/2030/Futures-AI-frontend`，它尚未 Handoff：
    - `AgentDrawer` 位于底栏 `.agent-dock` 内，样式为 `position:absolute; inset-inline:0; bottom:100%`；
    - `AppShell .content` 有三行：顶栏、`main.route-view`、`footer.dock-slot`；
    - `agent/store.ts` 中的 `AgentRun` 由 `run.started` 创建。
  - 本轮只做设计，不用占位宣称任何集成已经完成。

### 7.1 对旧节的覆盖（只改增量）

| 旧节 | v2 处理 |
|---|---|
| §1 目录 | 新增 `src/workbench/JobTrack.vue`。`src/jobs/**` 归互动方，不属于本 feature |
| §2.2 导航 | 八项菜单加专题研究子项，改为九项菜单（§7.4）。壳不再调用 `getResearchList`；`stores/app.ts` 只做最小派生修改 |
| §2.3 工作台 | 由 `FocusBand + ModuleGrid` 改为 `FocusBand → JobTrack → ModuleGrid`（§7.5） |
| §2.5 对话 | 新增作业上下文的捕获、绑定、展示和按作业查看（§7.7）。两档高度、时间线、模块角标、引导跳转和唯一终态不变 |
| §2.7 契约 | 契约从 1.0.0 升到 2.0.0，只由互动方执行（§7.8）。壳不改 schema、version 或 mock，也不新增 schema 方法 |
| §3 存储 | 不变（§7.9） |
| §5 验收 | 新增 7 条 AC。AC-002-2/002-3/002-4/002-7/005-1 的验收落点由 §7.11 取代；其余沿用旧落点，并加入 v2 回归 |
| §6 风险末尾的回滚段 | 旧的“删除 `frontend/`”对 v2 不适用，改用 §7.12 的精确回滚 |

§2.1、§2.4、§2.6、§2.8、§2.9 全部沿用；v1 的 45 条 AC 不废弃。

### 7.2 文件唯一写入者

| 路径 | 唯一写入者 | 备注 |
|---|---|---|
| `frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue,AppShell.vue}` | 壳（本 feature） | 只有 AppShell 挂载全局采集抽屉 |
| `frontend/src/stores/app.ts` | 壳（最小派生修改） | spec §4 的 v2 壳文件清单没有列出此文件。修改它是因为 AC-002-2 删除了专题子项，属于派生改动，需由 A 确认。只做三处改动：去掉 `getResearchList` 调用和 `research` ref 及其导出；加载步骤从 4 改为 3（`progress` 分母和“加载完成”判定）；状态文案从“正在加载资讯、数据源与研究列表…”改为“正在加载资讯与数据源…”。回归落在 AC-002-7 |
| `frontend/src/workbench/{WorkbenchPage.vue,JobTrack.vue}` | 壳 | FocusBand、ModuleGrid、ModuleLibrary 不改 |
| `frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}` | 壳 | 只消费上下文、负责展示，并做双抽屉避让 |
| `frontend/src/design/tokens.json`、`design/ui/UI_DARK_ADDITIONS.md`（源）；`src/design/generated/*`（生成物） | 壳 | 计划只新增 `layout.intake_width` 一项（§7.6）。生成物只能通过 `pnpm -C frontend tokens` 再生成，不手改 |
| 壳测试：既有文件修改 `tests/component/{topbar,timeline}.spec.ts`、`tests/unit/manual-acceptance.spec.ts`、`e2e/{shell,workbench,modules,breakpoints,agent}.spec.ts` | 壳 | e2e 文件名以 v1 Handoff SHA 的实际文件为准 |
| 壳测试：计划新增 `tests/component/job-track.spec.ts`、`tests/unit/agent-context.spec.ts`、`e2e/integration-v2.spec.ts` | 壳 | 目前都不存在，本轮不创建 |
| `specs/frontend-workbench/**`（含 `manual-acceptance.md`） | 壳 | — |
| `frontend/src/jobs/**`：页面、`routes.ts`、`jobsStore/intakeStore/sessionStore/inboxStore`、`IntakeDrawer.vue`、徽标组件，以及 jobs 测试 | 互动方 | 壳只导入，不写入 |
| `frontend/src/contracts/**`、`frontend/src/agent/events.ts`、`scripts/contract-build.mjs` | 互动方 | 契约 2.0.0 的拥有者；契约中旧的 `getResearchList`、`ResearchItem`、`research.json`、`MockOverrides.fixtures.research` 保留 |
| `frontend/contracts/{CONTRACT.md,schema.json}` 生成物 | 互动方 | 只改源，再执行 `pnpm -C frontend contract` 生成；任何一方都不手改 |
| `tests/unit/{contracts,mock,contract-doc}.spec.ts` | 互动方 | 承载 AC-007-5 的生产方证据 |
| `frontend/src/main.ts` | 互动方 | 只负责 `addRoute` 注册；壳不改 |
| `frontend/package.json`、lock 文件、工具链配置 | 两方都不改 | 如需修改，先登记 |
| `specs/README.md` | 两方各改本 feature 一行 | 由协调集成人串行合并 |
| `backend/`、`docs/` 权威文件 | 不改 | — |

### 7.3 契约与 store 交接要求（生产方 → 壳）

**交接单元**：互动方在自己最新有效 A 审核授权的 plan、Checklist、Tasks 下实现，并交付：

- 一个固定 commit；
- 该交接项的定向测试命令和输出摘要。

当前互动方的有效审核是 R3 未通过，所以至少要等 R4 通过后才能交接。指定集成人把交接单元串行集成到双方共用的集成验证分支，分支名在 Tasks 登记；壳方任务基于集成后的 SHA 开启。

- 不要求互动方整个 feature 先完成 Review、Gate 2、Handoff 并合入 main。它的 H 组集成验证本来就依赖壳 S1，如果要求先合 main，会形成循环依赖。
- 互动方的 A～G 组可以按可用切片交接。共享的契约、schema、mock、路由、stores 和 `IntakeDrawer`，按壳方实际用到的组分批解锁（§7.13）。
- 完整集成后，双方仍要各自完成 Review、Gate 2、Handoff。壳 v2 合入 main 时，所依赖的生产方提交必须先于壳方或在同一批合入 main，顺序由集成人安排。
- 壳方实际使用的字段、方法和导出名，以交接 SHA 为准；如有差异，Tasks 照实更新。壳方不自行兜底，也不复制实现。

| # | 生产方需落实的内容（尚未存在的部分已标出） | 解锁的壳任务 |
|---|---|---|
| H-1 | `CONTRACT_VERSION = '2.0.0'`，并导出 `JobContext = {jobId, stage}`。`SendMessage.jobContext?` 和十类 `AgentEvent` 都带公共可选字段 `jobContext`。mock `send` 把 payload 中的上下文原样写入该 run 的全部事件。原十类事件和旧 fixtures 不带该字段时仍能解析 | S1-ctx：AC-005-8 单元部分、AC-005-9 |
| H-2 | **数据**：`listJobs(filter?)` 返回 `JobListItem[]`，至少含 `id/title/type/status/currentStage/stages[4]{stage,state,pendingCount}/pendingCount/updatedAt`，默认按 `updatedAt` 倒序。契约导出 `JobStatusLabel/StageLabel/StageStateLabel`，带文案和图标。<br>**共享列表缓存（尚不存在）**：互动方 plan §2.3 的 `jobsStore` 目前只写了“当前作业、阶段工作区视图缓存”。需要在 `jobsStore` 中补充：<br>① 一个只读的**未筛选**作业列表视图缓存，以及它的读状态（加载中）和错误；<br>② 共享的 ensure/load action 和 refresh action，方法名由生产方确定；<br>③ “进行中”判定：可以是 selector，也可以是 `ACTIVE_JOB_STATUSES` 一类契约常量；<br>④ 列表页筛选用 selector 派生，或单独保存筛选结果，不能覆盖未筛选缓存；<br>⑤ 互动方已有“写回执 / agent 通知后重读”的机制，这个机制必须刷新同一份缓存。凡是会改变作业摘要的写操作都要覆盖，包括投放提交、确认、归属、`createJob`、`submitIntervention`、`markInboxRead` 等；agent 通知也要覆盖（mock 状态层先处理事件，再通知 UI）。<br>**还缺**：`JobTypeLabel`。<br>以上由互动方在其 Plan/Tasks 中落实；对方拒绝时报 Walter 裁决，壳不自建映射、缓存或刷新机制 | S1-track：AC-003-7～AC-003-9 |
| H-3 | `jobs/routes.ts` 导出 `jobs`（`/jobs`）和 `job-detail`（`/jobs/:id/:stage?`）两条路由。`stage ∈ collect/process/analyze/deliver`，`meta = {title, en, navId:'jobs'}`。`main.ts` 在 mount 前调用 `addRoute`，用同名记录替换壳的 `jobs` 占位 | S2：AC-002-2 集成部分、AC-002-3、AC-003-7 集成部分 |
| H-4 | `sessionStore.context: JobContext \| null`，只读。进入作业详情或切换阶段时设置；离开 `job-detail` 时，必须在同一次路由导航内同步清空，例如在路由守卫中清空。这个值不能从 lastRun 推导 | S1-ctx、S1-intake：AC-005-8 |
| H-5 | `intakeStore` 提供 `open(jobId?: string)`、`close()`、`isOpen` 和 `jobId`；`jobId` 是打开时的快照，提交时使用该快照。`IntakeDrawer.vue` 根元素用 `.glass-drawer`，填满壳提供的容器。它不能自设 `position: fixed`、遮罩、`aria-modal` 或焦点锁；关闭时不导航，也不调用 agent。它的写操作按 H-2 ⑤ 刷新共享列表缓存 | S1-intake：AC-002-8 |
| H-6 | 场景 `empty`、`error`、`slow` 覆盖 `listJobs`；`jobFixtures` 覆盖项可以新增作业；fixtures 中至少有一个进行中作业带未读待处理项，供角标测试使用 | S1-track：AC-003-9；S2：AC-002-3 |

本 feature 不复制 `Job`、`Stage` 或 schema，不另建 mock，不另升契约版本，不推进阶段，也不持有作业业务状态。

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

  删除 `research` 项。
- **`router.ts`**：
  - 路由仍由 `navItems` 生成。
  - 保留 `daily` 的 `/daily/:date?`；删除 `research` 的 `/research/:id?` 特例。
  - `jobs` 生成名为 `jobs` 的占位路由。壳不定义 `job-detail`，作业路由只由 H-3 提供。
  - 旧的 `/research/*` 落到既有兜底页，不承诺旧 URL 迁移。
- **`Rail.vue`**：
  - 删除专题研究子列表及其样式。
  - 当前项判定改为 `route.meta.navId === item.id`。如果同时 `route.name === item.id`，设 `aria-current="page"`；否则设 `aria-current="location"`，例如作业详情页高亮“作业”。
  - 全局同一时刻只有一个 `aria-current`。
  - 窄于 980 时的顶部横向导航按九项换行，不出现横向溢出。
- **`stores/app.ts`**：按 §7.2 的最小派生修改执行。契约侧的旧方法、类型、fixture 和覆盖项都保留，不删除，它们归契约拥有者。

### 7.5 工作台作业轨道（R-003）

- **页面结构**：`WorkbenchPage.vue` 依次为页头、`FocusBand`、`JobTrack`、`ModuleGrid`。`ModuleGrid` 仍是唯一的纵向滚动区。
- **轨道属性**：`JobTrack` 不是模块，不进入模块目录或 layout，也没有移除、排序或 AI 角标操作。
  - designUI §3.1 提到的“验证提醒”属于 spec 非目标（真实验证提醒），本轮不显示。
- **`JobTrack.vue` 结构**：
  - 容器是透明行，不加新的玻璃样式。
  - 卡片复用 `.glass-module`，保证文字只落在一层玻璃上。
  - 卡片列表横向排列，在轨道内部 `overflow-x: auto`；页面本身不出现横向滚动条。
  - 高度固定为一行。
  - 不引用 `updown.css`，不新增颜色字面量。
- **数据来源**：轨道和作业列表消费互动方 `jobsStore` 中的同一份未筛选列表缓存（H-2）。
  - 卡片集合 = H-2 的“进行中”selector 或常量作用在这份缓存上的结果。
  - 不从阶段状态推断进度。
  - 轨道不持有业务数据副本，本地只有展示用的 computed 派生。
  - 不持久化。
- **卡片内容**：
  - 显示标题和类型文案（`JobTypeLabel`）。
  - 四阶段固定按提取 → 处理 → 分析 → 交付排列。每段显示 `StageLabel`，再加 `StageStateLabel` 的图标和文案；运行中、待人工确认和冲突必须有文字。
  - `pendingCount > 0` 时显示“待介入 N”角标。
  - 作业状态优先复用互动方已交接的 `JobStatusBadge`；壳不维护第二份映射。
- **点击行为**：执行 `router.push({name:'job-detail', params:{id, stage: item.currentStage}})`。壳不推进阶段，也不改作业状态。
- **三种状态**（读取 store 的读状态和错误）：
  - 加载：沿用 v1 的 Loading。
  - 空：显示“暂无进行中的作业”和原因，并提供 `/jobs` 链接。
  - 错误：沿用 v1 的 ErrorState，诊断信息为 `{source:'job-track', code, message, ts}`；`code` 和 `message` 取自 store 错误，`ts` 是这次失败的时间；可以复制诊断。重试调用共享 refresh action。
  - 三种状态都不影响焦点带和模块区独立渲染。
- **刷新**：
  - 壳只在挂载时调用共享 ensure/load，并在错误重试时调用共享 refresh。
  - 其他更新都由互动方的“写回执 / agent 通知后重读”机制刷新同一份缓存，轨道随响应式更新。这包括轨道仍挂载时，在工作台打开采集抽屉完成投放归属的情况。
  - 壳不 watch agent store，不轮询，不建事件总线，不建第二套状态机。

### 7.6 全局投放（R-002）

- **入口**：`TopBar.vue` 新增文字按钮“投放”，点击时发出 `intake` 事件。`TopBar` 仍只接收 props，便于组件测试。
- **打开流程**：AppShell 处理 `intake` 事件，调用 `intake.open(session.context?.jobId)`。
  - 打开时对 `jobId` 做一次快照。
  - 在作业列表或其他非作业页面打开时，`jobId` 为 `undefined`。
  - 打开后路由变化不会改写这个快照。
- **挂载位置**：AppShell 第二行改为 `.route-area { position: relative; min-height: 0 }`，里面包含 `<main class="route-view">` 和 `<aside class="intake-slot" v-if="intake.isOpen">`。
  - `.intake-slot` 绝对定位，覆盖 `.route-area` 右侧整高。
  - 宽度为 `min(var(--fai-layout-intake-width), 50%)`；`z-index` 用已有的 `--fai-z-drawer`。
  - 不加遮罩，不加焦点锁，不设 `aria-modal`。
  - 打开时焦点移入 slot（`tabindex="-1"`）；关闭时焦点回到“投放”按钮。
  - 整个应用只有这一处挂载点。底部输入栏仍是全局固定件，不被 slot 覆盖。
- **与 AgentDrawer 共存（最小避让）**：
  - 投放打开时，AppShell 在 `.content` 上设置局部 CSS 变量 `--shell-intake-offset`，值等于 slot 宽度。这个变量沿 DOM 继承到底栏内的 `AgentDrawer`。
  - `AgentDrawer` 把 `inset-inline: 0` 改为 `inset-inline: 0 var(--shell-intake-offset, 0)`，让出右侧空间。
  - 两个面板都用 `.glass-drawer`，各自独立开关、并排显示，不新增第四层玻璃。
  - 不改 `ui.drawer` 或 `fai.drawer`，不新增配色，也不引入 overlay 管理器。
  - 支持的最小宽度是 960，这时两个面板仍能并排；`50%` 上限保证不溢出。三层玻璃和 v1 断点保持不变。
- **关闭**：执行 `intake.close()`。路由不变；壳不碰 agent store，后台 run 不会重启。
- **技术尺寸登记建议**：新增几何令牌 `layout.intake_width`，用于避免两个面板互相遮挡，直接服务 AC-002-8 和支持宽度。值在实施时确定，建议 `24rem`。
  - 实施时一次登记源 `tokens.json`，并在 `UI_DARK_ADDITIONS.md` 增加条目；`source` 指向 `design/ui/UI_DARK_ADDITIONS.md#drawer`。
  - 然后经 `pnpm -C frontend tokens` 再生成，不手改生成物。
  - 本轮不写入。

### 7.7 对话的作业上下文（R-005）

- **发送时捕获**：`agent/store.ts` 的 `send(message)` 在第一个 `await` 之前，同步读取 `useSessionStore().context` 的快照。
  - 有上下文时，调用 `agentClient.send({sessionId, message, jobContext})`。
  - 没有上下文时，payload 不出现 `jobContext` 键，形状与 v1 一致。
  - 不读 lastRun，也不读路由。
- **run 绑定**：`AgentRun` 增加 `jobContext?`。收到 `run.started` 时，把事件中的上下文写入 run；此后这个 run 的归属不再变化。切页、切阶段或清空 sessionStore，都不改写历史 run。
- **接收事件**：`receive` 原样接收并处理全部事件，不按作业过滤，也不丢弃任何事件。
- **不变规则**：模块角标（`badges.markRunning/settle`）、`running` 指示和“每个 run 恰好一个终态”的规则都不变，并且全局有效，不按作业拆分。
- **查看筛选（最小 API）**：store 提供 `runsFor(jobId?: string)`。
  - `undefined` 表示全部，包括无上下文的 run。
  - 传入 `jobId` 时，只返回绑定该作业的 run。
  - 不额外提供“仅全局”筛选。
  - AgentDrawer 页头新增“查看：全部 / 作业 X”选择器，选项来自当前 runs 中出现过的不同 `jobId`。选择结果只存在组件本地 ref，不持久化。
  - 筛选只影响展示，不影响 `receive`、角标或 `running`。
- **展示**：
  - 输入栏显示当前上下文 chip：有上下文时为“作业 {jobId} · {StageLabel}”，没有时为“全局”。
  - 每个 run 头部也显示它绑定的 chip；无上下文的 run 显示“全局”。
- **单次发送**：会话 ID 沿用 v1 的单会话。运行中禁止再次发送的规则不变，不扩展成多路并行发送。多作业交错只在 store 层验证（AC-005-9）。
- **上下文不带来新能力**：上下文不能让 agent 推进阶段，也不能让 agent 覆盖产物。

### 7.8 契约（R-007）

- **版本**：只由互动方统一升级到 2.0.0。只新增可选 `jobContext`，以及作业相关的方法和类型；原十类事件、v1 字段语义和唯一终态不变。
- **生成物**：只改生成源，再重新生成；生成和提交都由契约拥有者负责。
- **壳的使用范围**：壳只导入类型、`dataClient/agentClient`，以及 §7.3 已交接的 store 和组件。壳不改 schema、`CONTRACT_VERSION`、mock、fixtures 或契约测试，也不新增 schema 方法。
- **AC-007-5 证据**：生产方证据来自互动方的契约测试。壳只在 S1、S2 跑全量回归，作为参与证据，不代为勾选。

### 7.9 数据与存储

- 不新增 localStorage 键。
- 作业列表视图缓存属于互动方 `jobsStore`，只在内存中，壳不复制。run 不写入壳的持久化存储，对话历史和 v1 一样只在内存。
- `fai.rail`、`fai.drawer`、`fai.layout` 不迁移，也不改格式。
- `fai.jobs.v1` 和 `fai.inbox.v1` 属于互动方，壳不读也不写。

### 7.10 关键时序

1. **投放**：点击“投放”→ 快照 `session.context?.jobId` → `intake.open(jobId)` → `.intake-slot` 渲染 `IntakeDrawer`，AgentDrawer 让出右侧 → 用户关闭时调用 `intake.close()`，焦点回到按钮。路由和 run 都不受影响。
2. **工作台内投放写入**：轨道保持挂载 → 在采集抽屉中提交、确认或归属到作业 X → 互动方写回执 → 刷新 `jobsStore` 共享缓存 → 轨道卡片顺序和角标更新，并且与 `/jobs` 一致。整个过程中没有 run 终态，也没有手动重读。
3. **作业内发送**：从输入栏提交 → 同步捕获上下文 → 调用 `send` → mock 回放带 `jobContext` 的 `run.started` → `receive` 创建 run 并绑定归属 → 后续事件按 `runId` 归入 → 唯一终态。互动方 mock 状态层先处理事件再通知，并由 agent 通知重读同一份缓存，轨道和列表同步更新。
4. **离开作业**：路由离开 `job-detail` → sessionStore 在同一次导航内置为 `null`（H-4）→ 下一次发送不带 `jobContext`，chip 显示“全局”。

### 7.11 验收对应（52 条）

S0、S1-*、S2 的定义见 §7.13。`blocked_by` 表示：要等对应的生产方交接单元集成后才能验证。

| AC | 类型 | 落点与验证 | 阶段 |
|---|---|---|---|
| AC-001-1、AC-001-2、AC-001-3、AC-001-4、AC-001-5、AC-001-6 | 不变 | 沿用旧 §5。`pnpm -C frontend check` 自动覆盖 `JobTrack`、chip 和 slot：colors 检查；glass 只允许三类；updown 中轨道不得引用；`layout.intake_width` 纳入 generated 对拍 | S0/S1 |
| AC-002-1 | 不变 | 旧 §5；`e2e/shell.spec.ts` 回归 | S0 |
| AC-002-2 | 修改；部分集成 | **壳部分**：`shell.spec` 验证九项顺序、href、`aria-current`；格物致知占位 owner 为 `learning`，作业占位 owner 为 `workbench-interaction`；直达和刷新（含 `/jobs`、`/learning`）；没有 `.research-link`。<br>**集成部分**：`integration-v2` 验证 `/jobs/:id/:stage` 直达、刷新后仍高亮“作业”，且名为 `jobs` 的路由只有一条。集成部分 blocked_by H-3 | S0 / S2 |
| AC-002-3 | 修改；集成 | `integration-v2`：通过 `jobFixtures` 新增一项，经 `/jobs` 可见并能进入详情。整项 blocked_by H-3/H-6。“无专题子项”并入 AC-002-2 壳部分 | S2 |
| AC-002-4 | 修改 | `topbar.spec`：保留原有 ticker 和状态点断言；新增“投放”按钮可见、文案为“投放”、点击发出 `intake` 事件 | S0 |
| AC-002-5 | 不变 | `shell.spec` | S0 |
| AC-002-6 | 不变 + 回归 | `breakpoints.spec`：10 个视口不变（960/979/981/1239/1241/1399/1401/1499/1501/1440×900）。新增断言：轨道存在且没有横向溢出；在 960 和 1440×900 下同时打开投放和对话，仍没有溢出 | S1-track、S1-intake / S2 |
| AC-002-7 | 不变（回归更新） | `shell.spec`：进度断言按 3 个加载步骤更新实测值，状态文案不含“研究列表”（`stores/app.ts` 最小派生修改）；`boot-error` 重试路径不变 | S0 |
| AC-002-8 | 新增；集成 | `integration-v2`：在工作台、`/jobs`、作业详情和 `/prices` 点“投放”，都进入同一个 `.intake-slot`。作业详情页的快照 `jobId` 等于当前作业，其他页面为 `undefined`。在 `long` run 运行中关闭投放后：URL 不变，`runId` 不变，步骤继续增加且不重复。blocked_by H-4/H-5 和 `IntakeDrawer` 页面交接 | S2 |
| AC-003-1、AC-003-2、AC-003-3、AC-003-4、AC-003-5 | 不变 | 旧 §5：`focus-band.spec` / `workbench.spec` | S0 |
| AC-003-6 | 不变 + 回归 | `workbench.spec`：增删模块后，焦点带和轨道都还在 | S1-track |
| AC-003-7 | 新增；部分集成 | **组件部分**（`job-track.spec`）：使用真实 Pinia、互动方真实 `jobsStore` 和真实 mock `dataClient`，只在系统边界通过 mock 覆盖或场景注入，不 `vi.mock` 内部模块，不抄业务逻辑。验证：名称、类型文案、四阶段顺序、状态文案和图标、待介入角标。**关键用例**：轨道保持挂载，`agent.runs` 中没有任何终态，调用互动方的写 action（如 `markInboxRead`，或投放归属）→ “待介入 N”或卡片顺序自动变化，且与该 store 列表 selector 中同一作业的值一致；测试不调用任何手动重读。<br>**集成部分**（`integration-v2`）：在工作台打开投放，完成到进行中作业的归属，期间轨道不卸载 → 轨道更新 → 进入 `/jobs`，进行中项的集合、顺序和待介入数都与轨道一致 → 点击卡片进入 `/jobs/:id/<currentStage>`。集成部分 blocked_by H-3/H-5 | S1-track / S2 |
| AC-003-8 | 新增 | `workbench.spec` 和 `modules.spec`：DOM 顺序为 Focus → Track → Grid；模块库中没有轨道；轨道没有移除、上移或下移操作；增删、移动模块并刷新后，轨道位置不变 | S1-track |
| AC-003-9 | 新增 | `job-track.spec`：`slow` 触发加载态；`empty` 触发空态，并提供 `/jobs` 入口；`error` 触发错误态，可复制诊断，重试调用共享 refresh。三种状态下焦点带和模块区都能独立渲染 | S1-track |
| AC-004-1、AC-004-2、AC-004-3、AC-004-4、AC-004-5、AC-004-6 | 不变 | 旧 §5。AC-004-1、AC-004-2 的回归与 AC-003-8 共用 | S0/S1 |
| AC-005-1 | 修改（路由数） | `agent.spec`：九个导航路由上输入栏都可见；提交后抽屉展开并显示用户消息 | S0 |
| AC-005-2、AC-005-3、AC-005-4、AC-005-5、AC-005-6、AC-005-7 | 不变 | 旧 §5：`timeline.spec` / `agent.spec`。v1 的无上下文脚本全部照旧通过 | S1-ctx |
| AC-005-8 | 新增；部分集成 | **单元部分**（`agent-context.spec`）：发送时捕获快照；无上下文时 payload 中没有该键；归属由 `run.started` 绑定；sessionStore 变化不改已有 run。<br>**端到端部分**（`integration-v2`）：在 `/jobs/:id/analyze` 用 `long` 发送，chip 显示该作业和阶段；切到 `deliver`，再切到 `/prices`，原 run 的 chip 不变；之后的全局发送显示“全局”。端到端部分 blocked_by H-1/H-3/H-4 | S1-ctx / S2 |
| AC-005-9 | 新增 | `agent-context.spec`：使用真实 mock `AgentClient` 和 fake timers，交错回放作业 A、作业 B 和无上下文 run。`runsFor('A')` 只含 A 的 run，`runsFor()` 包含全部 run（含无上下文）；`receive` 收到全部事件；模块角标不变；每个 run 恰好一个终态。`timeline.spec` 补充选择器和 chip 断言（全局 run 显示“全局”） | S1-ctx |
| AC-006-1、AC-006-2、AC-006-3、AC-006-4 | 不变 | 旧 §5 | S0 |
| AC-007-1、AC-007-2、AC-007-3、AC-007-4 | 不变 | 旧 §5。network 守卫纳入新文件；壳侧 e2e 继续使用 normal、empty、error、slow 场景。2.0.0 文档由生产方重新生成，壳只跑 `check --only generated` 作为回归 | S1 |
| AC-007-5 | 新增；生产方证据 | 由互动方契约测试证明三点：可选上下文已声明；旧消息和 fixtures 能解析；新上下文能透传。壳跑全量回归只作参与证据；没看到生产方证据前不得勾选 | S1/S2 |
| AC-008-1、AC-008-2、AC-008-3 | 不变 | 旧 §5。新令牌的 `source` 必须能解析（AC-008-2） | S1-intake |
| AC-009-1 | 不变 | `pnpm -C frontend test` 全绿；只有集成后的全量结果才算 v2 证据 | S2 |
| AC-009-2 | 不变 + 扩充 | `manual-acceptance.md` 保留 M-01～M-08，新增 M-09～M-12；`manual-acceptance.spec` 同步；Handoff 时附截图 | S0 文本 / S2 截图 |

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
  - M-09 导航：九项菜单；作业详情高亮“作业”；没有专题子项；格物致知占位页注明归属。
  - M-10 轨道：位置正确；没有新增玻璃层；四阶段和状态不只靠颜色区分；三种状态都能看到；在 1440×900 下不挤压；工作台投放后轨道当场更新。
  - M-11 投放：非模态；与对话抽屉并排；在 960 下不溢出；关闭后回到原页面；底栏输入栏始终可见。
  - M-12 上下文：chip 正确；可按作业查看；离开作业后发送为全局。
  - 视口沿用 10 个，与 AC-002-6 相同。
- **精确回滚**：只撤销 v2 补丁本身。
  - 优先对已隔离的 v2 壳方提交执行 `git revert`。
  - 如果与后续功能有共享行冲突，只按最小 hunk 人工回退，然后重跑 `pnpm -C frontend test` 复验。
  - **禁止**用 `git checkout <SHA> -- <文件>` 整文件覆盖，因为会冲掉后续功能。
  - 新令牌通过修改源文件、再重新生成来撤销。
  - 同时撤回 M-09～M-12 和新增测试。
  - `specs/README.md` 只改本 feature 一行。
  - 禁止使用旧 §6 的删除整个 `frontend/`；禁止撤销互动方的 jobs、契约或 `main.ts` 修改。
  - 撤销壳侧改动后，依赖壳的互动方 H 组 AC 恢复为 blocked。

### 7.13 分阶段依赖（实施依赖与设计输入分开）

| 阶段 | 内容 | 依赖（交接单元按 §7.3 集成） | 可验证 | 说明 |
|---|---|---|---|---|
| S0 壳独立 | nav、router、Rail、`stores/app.ts` 最小派生修改；TopBar 按钮；M-09～M-12 文本 | v1 Handoff SHA | AC-002-2 壳部分、AC-002-4、AC-002-7、AC-005-1，以及不变项回归 | 未接线的按钮不能宣称满足 AC-002-8；S0 不单独 Handoff |
| S1-ctx | agent 上下文：store、chip、`runsFor`、选择器 | S0 + H-1、H-4 | AC-005-8 单元部分、AC-005-9、AC-005-2～AC-005-7 回归 | 可以独立开启 |
| S1-track | `JobTrack` | S0 + H-2、H-6 | AC-003-7 组件部分、AC-003-8、AC-003-9、AC-003-6 和 AC-002-6 回归 | 可以独立开启；H-2 共享缓存未交接时保持 blocked |
| S1-intake | AppShell slot、令牌、AgentDrawer 避让 | S0 + H-4、H-5 | AC-008-2 新令牌、AC-002-6 双抽屉回归 | 可以独立开启 |
| S2 集成 | `integration-v2`、全量命令、人工截图 | 全部 S1-* + H-3 + 互动方页面和 `IntakeDrawer` 已集成 | 集成部分：AC-002-2、AC-002-3、AC-002-8、AC-003-7、AC-005-8；AC-009-1；AC-009-2 截图 | 外部阻塞未解除时，Converge 必须报告“未收敛（外部阻塞）” |

**依赖链是单向的**：

- 双方都从 v1 Handoff SHA 起步。
- 互动方 A～G 组只依赖 v1，不依赖壳。
- 壳的各 S1 子阶段只依赖互动方对应的交接单元，交接单元不要求互动方先 Handoff 合入 main。
- 互动方 H 组集成验证依赖壳 S1。
- 双方都不需要等对方全量完成，因此没有循环依赖。完整集成后，双方仍各自走 Review、Gate 2、Handoff。

### 7.14 风险

| 风险 | 对策 |
|---|---|
| 生产方接口名或字段与设计输入不一致 | 任务以 §7.3 交接单元的 SHA 为前提开启；有差异就更新 Tasks，壳不兜底 |
| 互动方 R3 未通过，后续审核继续推迟 | 相关 S1/S2 保持 blocked；壳不修 B-09/B-10，不把旧 R2 当成依赖已完成 |
| H-2 的共享未筛选缓存、刷新覆盖面、进行中判定或 `JobTypeLabel` 缺失 | 由互动方在其 Plan/Tasks 中补齐；对方拒绝时报 Walter 裁决。壳不自建缓存、映射、轮询或 watch 终态 |
| 列表筛选覆盖共享缓存，导致轨道与列表不一致 | H-2 ④ 约束；AC-003-7 集成部分在筛选后返回工作台复验 |
| `addRoute` 同名替换失败，出现双路由 | 在 `integration-v2` 中断言名为 `jobs` 的路由只有一条 |
| sessionStore 清空时机滞后 | 由 H-4 约束为同一次导航内同步清空，并由 AC-005-8 端到端部分覆盖 |
| 投放与对话抽屉在窄宽下互相遮挡 | 在 960 和 1440 下同时打开两者，跑 breakpoints 断言，并做 M-11 人工验收 |
| 轨道挤压 900 高度的视口 | 轨道固定一行，由 AC-002-6 和 M-10 验证 |
| 契约 2.0.0 使 v1 测试变红 | 壳只更新与壳语义相关的测试；契约测试由互动方修复 |
| v1 Handoff 延迟 | 整体 blocked，不用 `fdaa7d8` 或 `0ffa15e` 提前开工 |

===README_ROW===
| frontend-workbench | in-progress（v1：T-01～T-15 已实施，**尚未 Review / Gate 2 / Handoff**；v2.1：Gate 1 已通过 → `plan.md` §7 v2 设计已起草，待审核员 A 独立做 v2 Checklist） | 无后端依赖。v2 实施起点必须是 v1 Handoff 合入 main 的准确 SHA，拿到之前不得开工。v2 的 S1/S2 依赖 workbench-interaction 按 plan §7.3 交付的交接单元，要求是：在其最新有效 A 审核授权下实现的固定 commit 加定向测试摘要，由集成人串行集成。它当前的 checklist R3（审查 `8bd1b31`）**未通过**（B-09/B-10），外部交接**未就绪**；旧的 R2 通过不能作为依赖已完成的依据 | 2026-10-28 | v1：45 条 AC 已通过 A Checklist，只授权 v1。v2：分支 `spec/frontend-workbench-v2`（基线 `fec3556`），52 条 AC；Plan = `claude-opus-5-5` via `anthropic`。`tasks.md` 和 `checklist.md` 仍是 v1，不授权 v2 实施；§7 中的新令牌和新测试都只是计划，尚未写入 |