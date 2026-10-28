以下三个区块只供协调器落盘：我没有写文件，也没有安装、测试或提交。本轮只读，读过的文件是：AGENTS.md、docs/plan.md、architecture.md、interaction.md、designUI.md、spec.md、plan.md（共 561 行，已读完）、checklist-v2.md、旧 tasks.md、templates/tasks.md 和 specs/README.md。

**区块概要**
- **v2 任务**：12 个，编号 T-V2-01～T-V2-12，合计 **22 h**，依赖只指向更早任务、无环。全部任务都标为 blocked：v1 Handoff 的准确 SHA 没有取得，H-1～H-6 也没有任何已交付的实现 SHA。
- **AC 矩阵**：52 条 AC 逐条列出，没有用范围写法。AC-007-5 只登记生产方证据，壳侧跑回归，不代勾。
- **Plan 小改**：共 15 处，全部只在 §7 内。这些修改都没有经过审核，必须由 A 新开独立会话定向复核。
- **超出你清单的三处 Plan 修正**：
  - **S1-ctx 加依赖**：chip 文案要用 `StageLabel`，它属于 H-2 的导出，所以 S1-ctx 需要先拿到这个导出（不用等共享列表缓存）。
  - **S1-intake 串行**：它和 S1-ctx 都要改 `AgentDrawer.vue`，所以 Tasks 里两者串行，实际排期会继承 S1-ctx 的交接前置。
  - **0ffa15e 的说法**：§7.0 原文写的是“v1 实施分支 HEAD”，改为“固定历史参照”。
- **README 第 33 行建议补字样（我没改）**：本 Tasks 细化了三点，建议协调器落盘时补进这一行：
  - `JobStatusBadge` 随 H-2 一起交付；
  - H-2 的标签可以先单独交付给 S1-ctx；
  - H-3 的路由切片可以先交付给 S1-track，不用等页面功能。
- **plan.md 用的是 CRLF 换行**：所以每条 oldText 都限在单行内。同一行里相近的改动已经合并；跨行的相邻改动，比如 §7.5 的三行，是分开给出的。

===TASKS_HEADER===
> **v2 Tasks 追加（2026-10-28，草案）**：本文件末尾新增「## v2 任务（spec v2.1 / plan §7）」。**本声明优先于上方旧页首**：旧页首写的「45 条 AC / Checklist 通过后生效 / 15 个任务约 25.5 h」，连同 T-01～T-15 的正文、勾选状态和「AC 覆盖」表，都原样保留为 v1 历史基线，不再修改。与 v2 冲突的地方，按 v2 任务第 2 节的覆盖声明以 v2 为准。需求依据是冻结的 spec v2.1（52 条 AC，Gate 1 已通过，AC 集合与 `fec3556` 一致）加 plan §7。
> **模型记录**：Tasks = `claude-opus-5-5` via `anthropic`。`claude-bridge` 在本限额窗口已明确额度不可用，按 AGENTS §6 第 5 条不重复探活；只换了通道，没有换模型。协调与串行落盘 = `openai/gpt-6.1-sol`，它不是审核员 A，也不是实施者。任务 = frontend-workbench v2 Tasks 起草。固定基线 = `a8ab444a28e8e6a9fd056401b55f63a1b25a2c4a`（工作树干净）。失败类别 = 通道额度；本记录已脱敏。
> **审核依据**：当前有效的 v2 清单是 `specs/frontend-workbench/checklist-v2.md`。审核员 A = `claude-fable-5-1` via `anthropic`，独立会话，审查对象 `d2bf5a7`，结论为通过：0 阻断、9 条建议，允许进入 Tasks，不授权 Implement。这个通过**只覆盖 `d2bf5a7` 的 plan §7**；本次 Tasks 以及随附的 plan §7 小改**都未经审核**。旧 `checklist.md` 只证明 v1，不修改，也不授权 v2。
> **状态**：v2 任务是草案。下一步先做 Analyze，再由 A 新开独立会话定向复核，并补勾 checklist-v2「阶段说明」里的 I-01b 和 V-02。**全部 v2 实施任务 blocked**，原因有两个：v1 完成 Review / Gate 2 / Handoff 并合入 main 的准确 SHA 未取得；H-1～H-6 没有任何已交付的实现 SHA。本清单不启动 Implement；在等外部前置的任务，不能视为已完成。
===TASKS_V2===
## v2 任务（spec v2.1 / plan §7）

> 本节是 v2 唯一有效的任务清单，目前是草案，需要等 Analyze 和 A 定向复核。**所有任务都未开始，状态都是 blocked。** 本节列出的测试文件、测试标题和 fixture 用法都是计划，要到实施后才能执行；本轮没有运行任何命令，所以不是验收证据。

### 1. 固定基线与交接登记

#### 1.1 基线与开工登记

| 项 | 值 | 说明 |
|---|---|---|
| 冻结需求 | spec v2.1，共 52 条 AC。R-001～R-009 分别为 6 / 8 / 9 / 6 / 9 / 4 / 5 / 3 / 2 条；AC 集合与 `fec3556` 一致 | Q-023～Q-031 已在 spec 页首的批准记录里闭环。spec §5 裁定表里残留的“待 Walter 确认”字样，以页首批准记录为准（V2-S09）。spec 已冻结，不改 |
| 设计依据 | plan §7（A 审 `d2bf5a7` 后通过），加上本轮随 Tasks 提出的 §7 小改（未审） | 小改要由 A 新开独立会话定向复核 |
| 当前有效清单 | `specs/frontend-workbench/checklist-v2.md` | 旧 `checklist.md` 不改，也不授权 v2 |
| Tasks 起草基线 | `a8ab444a28e8e6a9fd056401b55f63a1b25a2c4a` | 只读 |
| **v1 Review / Gate 2 / Handoff 合入 main 的 SHA** | **未取得（开工前必须填真实SHA）** | 双方实施起点都是它。不得填 `fdaa7d8`（本分支前端快照）、`0ffa15e`（Plan / A 核对用的固定历史参照）或 `b19427a`（v1 实施分支最近一次移动，只是只读元信息，不代表已 Handoff） |
| 壳 v2 实施 worktree / 分支 | 未取得（开工前登记） | 从 v1 Handoff SHA 建立；壳实施者是唯一写入者 |
| 集成验证分支名 | 未取得（开工前由集成人登记） | 只有指定集成人能写；其他会话只读 |
| 指定集成人 | 未取得（开工前登记） | 负责把生产方交接单元和壳提交串行集成进来 |
| 本 Tasks 落盘提交 SHA | 由协调器落盘后登记 | — |

**工作树规则**：
- 壳方和互动方各用独立的 worktree / 分支，只写自己拥有的文件（见第 4 节）。
- 壳方的 S1 / S2 任务开启前，先把壳实施分支同步到集成验证分支上“对应 H-x 已集成”的那个 SHA。同步只读拉取，不向集成分支写入。
- 壳的提交由集成人串行合入集成验证分支。
- 任何会话都不在对方分支上提交、reset 或强推。

#### 1.2 生产方交接登记（按消费切片，不要求互动方全量 Handoff）

| 交接单元（plan §7.3） | 内容 | 消费的壳任务 | 生产方固定 commit | 生产方已提交的有效 Checklist SHA / 轮次 | 定向测试命令与输出摘要 | 集成验证分支上的集成 SHA | 状态 |
|---|---|---|---|---|---|---|---|
| H-1 | `CONTRACT_VERSION='2.0.0'`；`JobContext`；`SendMessage.jobContext?`；十类事件都带可选 `jobContext`；mock 把 payload 的上下文原样写入该 run 的全部事件；旧事件和旧 fixture 仍能解析 | T-V2-03、T-V2-04、T-V2-09；AC-007-5 的生产方证据（T-V2-11） | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-2·标签 | `JobStatusLabel / StageLabel / StageStateLabel / JobTypeLabel`，以及徽标组件 `JobStatusBadge`（V2-S07） | T-V2-04（只用 `StageLabel`）、T-V2-05、T-V2-06 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-2·列表 | `listJobs`；`jobsStore` 共享未筛选缓存 ①～⑤（读状态和错误、ensure/load/refresh、筛选不覆盖缓存、写回执和 agent 通知刷新同一份缓存）；“进行中”口径，用契约常量或 selector 表达，并登记进 CONTRACT.md（V2-S02） | T-V2-05、T-V2-06 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-3·路由切片 | `jobs/routes.ts` 里的 `jobs` 和 `job-detail` 两条路由，以及 `main.ts` 在 mount 前调用 `addRoute`；**不含页面功能**（V2-S04） | T-V2-05、T-V2-06、T-V2-09 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| 页面切片 | 互动方的 `/jobs` 列表页、作业详情页，以及 `IntakeDrawer` 的投放提交和归属流程（plan §7.13 S2） | T-V2-09、T-V2-10 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-4 | 只读的 `sessionStore.context`；离开 `job-detail` 时在同一次导航内同步清空 | T-V2-03、T-V2-07、T-V2-09 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-5 | `intakeStore.open(jobId?) / close / isOpen / jobId`，`jobId` 是打开时的快照；`IntakeDrawer` 根元素用 `.glass-drawer`，无 fixed 定位、遮罩、`aria-modal` 或焦点锁，关闭时不导航；它的写操作按 H-2 ⑤ 刷新缓存 | T-V2-07、T-V2-08、T-V2-10 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-6 | `empty / error / slow` 三个场景覆盖 `listJobs`；`jobFixtures` 覆盖项可以新增作业；至少有一个进行中作业带未读待处理项 | T-V2-05、T-V2-06、T-V2-09 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |

**登记规则**：
1. 外部 `8bd1b31` 里已提交的旧 R2（审查对象 `630e06f`）不覆盖 H-2、H-4、H-5、H-6 的新增要求。外部 worktree 里未提交的 R3 / R4 修改，不能作为交接证据。生产方的有效授权，以登记进来的“已提交的有效 Checklist SHA”为准。
2. 每个交接单元都必须同时满足四项：有固定 commit、有已提交的有效 Checklist SHA、有定向测试命令和输出摘要、已由集成人集成。四项都满足后，消费它的任务才解除对应的 blocked_by。缺任何一项，任务就继续 blocked。
3. 按消费切片解锁，不等互动方全量完成 Review / Gate 2 / Handoff 合入 main，所以没有循环依赖：
   - 互动方 A～G 组只依赖 v1；
   - 壳 S1 只依赖对应的交接切片；
   - 互动方 H 组的集成验证依赖壳 S1；
   - 壳 S2 依赖全部 S1，加上 H-3 和页面切片。
   - 完整集成后，双方各自走 Review / Gate 2 / Handoff。壳合入 main 时，生产方的依赖提交要先于壳或与壳同批合入，顺序由集成人安排。
4. 字段名、方法名和导出名以交接 SHA 为准。如果与 plan 有差异，回到 Analyze 更新 Tasks；壳不兜底，也不复制实现。生产方拒绝某项要求时，报 Walter 裁决。
5. 跨 feature 的新增要求已在 `specs/README.md` 的「跨 feature 待同步事项」第 33 行登记（V2-S01）。

### 2. 对 v1 历史任务的覆盖声明（原文不改）

| v1 位置 | 与 v2 冲突的内容 | v2 处理（以 v2 条款为准） |
|---|---|---|
| 旧页首「45 条 AC」「Checklist 通过后生效」「15 个任务约 25.5 h」 | v1 基线说明 | 保留为历史。v2 的前置是 checklist-v2 加第 5 节的开工闸门，不是旧 `checklist.md` |
| 约定「文件边界：只动 frontend/、design/…」 | v1 的边界比较宽 | v2 按第 4 节的文件唯一写入者执行，范围更窄 |
| T-08 上下文里的「路由与八项菜单」、完成标准 1「八项菜单固定顺序」、验证命令 1 | 八项菜单 | 以 T-V2-01 标准 1（九项，AC-002-2 v2）为准 |
| T-08 完成标准 5「专题研究子项由研究列表驱动」、验证命令 5 `-g "AC-002-3"` | 专题子项 | v2 中作废：旧用例由 T-V2-01 删除；AC-002-3 的 v2 语义由 T-V2-09 标准 2 验收 |
| T-08 修改范围中的 `src/stores/app.ts`（研究列表加载、4 步进度、含“研究列表”的文案）以及完成标准 2 的进度部分 | 4 步加载 | 以 T-V2-02 标准 1（3 步，文案不含“研究列表”）为准 |
| T-08、T-13 修改范围中的 `src/main.ts` | v1 时由壳写入 | v2 壳不改 `main.ts`，它归互动方（H-3 的 `addRoute`） |
| T-13 完成标准 1「八路由输入栏可见」、验证命令 1 | 八个路由 | 以 T-V2-01 标准 2（九个路由）为准 |
| T-14 完成标准 1（十个视口） | 没有覆盖轨道和双抽屉 | 保留，由 T-V2-01 标准 4 和 T-V2-08 扩充 |
| T-09 完成标准 3～5、T-10 完成标准 4 | 没有覆盖轨道 | 保留，由 T-V2-06 标准 3、4 扩充 |
| T-15 完成标准 1「`pnpm test` 全绿」 | v1 证据 | v2 只认集成验证分支上的全量结果（T-V2-12 标准 1） |
| T-15 完成标准 2「M-01～M-08 八项」、验证命令 2 | 八项人工清单 | 以 M-01～M-12 为准：文本在 T-V2-02 标准 3，截图在 T-V2-12 标准 3 |
| T-06、T-07（契约类型、事件、mock、real、contract-build、CONTRACT.md） | 契约写入任务 | v2 不重做。契约 2.0.0、可选 `jobContext`、作业方法 / 类型 / mock 和契约生成物，都由互动方唯一写入（H-1、H-2、H-6）。壳只导入和跑回归，不接管 schema、mock 或 `main.ts` |
| T-01（脚手架、package、lock、工具链） | — | v2 不改 |
| 旧「AC 覆盖」表（45 条）、尾注「T-08 / T-13 超过 2 h 就拆分」 | v1 矩阵 | 保留为历史；v2 以第 7 节的 52 条矩阵为准 |

v1 Handoff 合入 main 后，本文件和 v1 版本 tasks.md 的合并由集成人处理：v1 段以 Handoff 版本为准，v2 段原样保留。如果出现语义冲突，回到 Analyze。

### 3. 约定

- 命令都在 worktree 根目录执行，格式为 `pnpm -C frontend …`。
- **测试标题**格式为 `<AC 编号> <v2 主题标签> <描述>`，用 `test:unit -t` / `test:e2e -g` 按前缀选取。主题标签和任务的对应关系：
  - T-V2-01：`v2-nav`
  - T-V2-02：`v2-boot`、`v2-topbar`、`v2-manual`
  - T-V2-03：`v2-ctx-store`
  - T-V2-04：`v2-ctx-ui`
  - T-V2-05：`v2-track`
  - T-V2-06：`v2-track-state`
  - T-V2-08：`v2-bp`
  - T-V2-09：`v2-int-nav`、`v2-int-ctx`
  - T-V2-10：`v2-int-intake`、`v2-int-track`
  - v1 原有测试标题不加标签，按 AC 编号回归。
- 测试使用真实实现：真实 Pinia、互动方真实交付的 store / routes，以及真实 mock `dataClient` / `agentClient`。只在系统边界注入，也就是 `?scenario=`、`window.__FAI_MOCK__` 和 `jobFixtures` 覆盖。不要用 `vi.mock` 替换内部模块，也不要把“进行中”判定之类的业务逻辑抄进测试。
- 每个任务完成后提交一次，提交信息以 `T-V2-xx` 开头。
- 每个任务开工前，要重读第 1 节登记表和第 5 节闸门。blocked_by 没有全部解除的任务不得开始。

### 4. 文件唯一写入者（v2 任务内；同一文件被多个任务修改时串行）

| 文件 | 写入任务（按顺序） |
|---|---|
| `frontend/src/app/{nav.ts,router.ts,Rail.vue}` | T-V2-01 |
| `frontend/src/app/AppShell.vue` | T-V2-01（**仅当** v1 Handoff SHA 中窄窗口顶部导航的样式在这个文件里时，只改这部分样式）→ T-V2-07 |
| `frontend/src/stores/app.ts`、`frontend/src/app/TopBar.vue`、`frontend/tests/component/topbar.spec.ts` | T-V2-02 |
| `frontend/e2e/shell.spec.ts` | T-V2-01 → T-V2-02 |
| `frontend/e2e/agent.spec.ts` | T-V2-01 |
| `specs/frontend-workbench/manual-acceptance.md`、`frontend/tests/unit/manual-acceptance.spec.ts` | T-V2-02 |
| `frontend/src/agent/store.ts`、`frontend/tests/unit/agent-context.spec.ts`（新建） | T-V2-03 |
| `frontend/src/agent/{AgentDock.vue,CotTimeline.vue}`、`frontend/tests/component/timeline.spec.ts` | T-V2-04 |
| `frontend/src/agent/AgentDrawer.vue` | T-V2-04（选择器）→ T-V2-07（避让） |
| `frontend/src/workbench/WorkbenchPage.vue` | T-V2-05 |
| `frontend/src/workbench/JobTrack.vue`（新建）、`frontend/tests/component/job-track.spec.ts`（新建） | T-V2-05 → T-V2-06 |
| `frontend/e2e/{workbench,modules}.spec.ts` | T-V2-06 |
| `frontend/src/design/tokens.json`、`design/ui/UI_DARK_ADDITIONS.md`；生成物 `frontend/src/design/generated/*`、`frontend/index.html` 首帧块 | T-V2-07；生成物只能用 `pnpm -C frontend tokens` 重新生成 |
| `frontend/e2e/breakpoints.spec.ts` | T-V2-08 |
| `frontend/e2e/integration-v2.spec.ts`（新建） | T-V2-09（创建）→ T-V2-10（追加） |

**v2 任务都不修改**：`frontend/package.json`、lock 文件、工具链配置、`frontend/src/contracts/**`、`frontend/contracts/*`、`frontend/scripts/contract-build.mjs`、`frontend/src/agent/events.ts`、`frontend/src/jobs/**`、`frontend/src/main.ts`、`tests/unit/{contracts,mock,contract-doc}.spec.ts`、`backend/`、`docs/` 下的权威文件、旧 `checklist.md`、spec.md。`specs/README.md` 只由协调集成人改本 feature 那一行。

### 5. 开工闸门（Implement 前逐项核对；任何一项没满足，所有任务都 blocked）

1. v1 Handoff SHA 已登记，并且在 main 上：`git merge-base --is-ancestor <v1HandoffSHA> main`（没填真实 SHA 之前，这条命令无法执行，即闸门未过）。
2. checklist-v2 没有未勾选项，而且 A 已在「阶段说明」补勾：`git grep -n "^- \[ \]" -- specs/frontend-workbench/checklist-v2.md` 应无输出；补勾情况由人工核对。
3. 本任务用到的每个交接单元都已集成：`git merge-base --is-ancestor <H-x commit> <集成验证分支>`，并且第 1.2 节该行四项登记齐全。
4. Analyze 报告已产出，且没有未解决项（人工核对报告结论）。

### 6. 任务

#### T-V2-01 九项导航、路由与侧栏（S0）

- [ ] **状态**：blocked。blocked_by：v1 Handoff SHA（未取得）
- **上下文**：
  - 依据：plan §7.4、§7.1；spec R-002、Q-023、Q-027。
  - 作业详情路由只由 H-3 提供，壳只生成名为 `jobs` 的占位路由。
  - 格物致知占位要能追溯归属（V2-S08），但不增加页面功能。
- **修改范围**：
  - `nav.ts`：按 plan §7.4 写九项表；删除 `research`；`learning` 项加一行归属注释：“格物致知 = 学习循环产品区，docs/plan.md §8 Phase 2C；仓库暂无同名 feature；路由 `/learning` 不改”。
  - `router.ts`：仍由 `navItems` 生成；保留 `/daily/:date?`；删除 `/research/:id?` 特例；不定义 `job-detail`。
  - `Rail.vue`：删除专题子列表及其样式。当前项判定为 `route.meta.navId === item.id`：同时 `route.name === item.id` 时设 `aria-current="page"`，否则设 `"location"`；全局同一时刻只有一个 `aria-current`。窄于 980 时九项换行。
  - `AppShell.vue`：只按第 4 节的条件修改。
  - `e2e/shell.spec.ts`：新增 `AC-002-2 v2-nav` 用例；删除 v1 用研究列表注入验证的旧 `AC-002-3` 用例。
  - `e2e/agent.spec.ts`：AC-005-1 的路由集改成九项，标题加 `v2-nav`。
- **依赖**：无（v2 首任务）　**预计**：2 h
- **完成标准**：
  1. 九项顺序和 href 正确；`aria-current` 全局唯一；`/jobs` 占位页的 owner 为 `workbench-interaction`，`/learning` 占位页的 owner 文案含 `learning`；直接打开 `/jobs`、`/learning`、`/prices` 并刷新后仍停留在原页；页面中没有 `.research-link`。满足 AC-002-2 的壳部分；集成部分见 T-V2-09。
  2. 九个导航路由上输入栏都可见；提交后抽屉展开并显示用户消息。满足 AC-005-1。
  3. 加载页到工作台之间无空白帧、侧栏折叠持久化，都没有回归。对应 AC-002-1、AC-002-5 回归。
  4. 九项导航在 960 和 979 宽度下文档没有横向溢出，原来十个视口的断言不回归。对应 AC-002-6 回归（导航部分）。
- **验证命令**（1、2 是修改后的测试，实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-2 v2-nav"`
  2. `pnpm -C frontend test:e2e -g "AC-005-1 v2-nav"`
  3. `pnpm -C frontend test:e2e -g "AC-002-1|AC-002-5"`
  4. `pnpm -C frontend test:e2e -g "AC-002-6"`

#### T-V2-02 加载步骤派生修改、顶栏「投放」与人工清单文本（S0）

- [ ] **状态**：blocked。blocked_by：v1 Handoff SHA
- **上下文**：
  - 依据：plan §7.2 中 `stores/app.ts` 的最小派生修改（checklist-v2 I-01 已确认）、§7.6 入口、§7.12 M-09～M-12。
  - 本任务只让按钮发出 `intake` 事件，**不宣称满足 AC-002-8**。
- **修改范围**：
  - `stores/app.ts`，只做三处修改：
    - 去掉 `getResearchList` 调用和 `research` ref 及其导出；
    - 加载步骤从 4 改为 3，进度分母和“加载完成”的判定同步改；
    - 状态文案改为“正在加载资讯与数据源…”。
  - `TopBar.vue`：新增文字按钮“投放”，点击时发出 `intake` 事件，组件仍只接收 props。
  - `tests/component/topbar.spec.ts`。
  - `e2e/shell.spec.ts`：AC-002-7 的进度和文案断言按 3 步更新。
  - `manual-acceptance.md`：M-01～M-08 原样保留；追加 M-09～M-12。其中 M-09 写明“格物致知（learning，Phase 2C）占位注明归属”。
  - `tests/unit/manual-acceptance.spec.ts`。
- **依赖**：T-V2-01　**预计**：2 h
- **完成标准**：
  1. 加载进度按 3 步计算，状态文案不含“研究列表”；`boot-error` 的重试路径不变。满足 AC-002-7。
  2. 原有的 ticker 和状态点断言保留；“投放”按钮可见、文案为“投放”、点击发出 `intake` 事件。满足 AC-002-4。
  3. 人工清单有 M-01～M-12，每项都写了“看什么”，测试与清单同步。满足 AC-009-2 的文本部分。
- **验证命令**（都要实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-7"`
  2. `pnpm -C frontend test:unit -t "AC-002-4"`
  3. `pnpm -C frontend test:unit -t "AC-009-2"`

#### T-V2-03 对话上下文：store 捕获、绑定与按作业查看（S1-ctx）

- [ ] **状态**：blocked。blocked_by：v1 Handoff SHA、H-1、H-4
- **上下文**：plan §7.7、§7.10 第 3、4 条；V2-S06。
- **修改范围**：
  - `agent/store.ts`：
    - `send` 在第一个 `await` 之前，同步读取 `useSessionStore().context` 的快照。`useSessionStore()` **只在 `send` 函数体内调用**，不在模块顶层调用，以免与 `jobs/**` 互相导入时形成初始化循环；不为此加抽象。
    - 有上下文时 payload 带 `jobContext`；没有时 payload 里不出现这个键。
    - `AgentRun.jobContext?` 由 `run.started` 事件写入，之后不再变化。
    - `receive` 不过滤、不丢弃事件。
    - 新增 `runsFor(jobId?)`。
    - 模块角标、`running` 指示和“每个 run 恰好一个终态”的规则都不变。
  - 新建 `tests/unit/agent-context.spec.ts`：
    - 用真实 Pinia、真实 mock `agentClient` 和 fake timers。
    - `sessionStore` 只用 H-4 交接的公开方式设置；如果它只能由路由守卫设置，就用真实 router 加互动方的 routes 导航来设置。
    - payload 只在系统边界对 `agentClient.send` 做透传 spy：调用原实现、不改返回值。
    - 交错回放时直接调用三次 mock `agentClient.send`（作业 A、作业 B、无上下文各一次），不改动 store 的“运行中禁止再发”规则。
- **依赖**：T-V2-02　**预计**：2 h
- **完成标准**：
  1. 发送时取到快照；没有上下文时（包括 `sessionStore` 从某个作业变成 null 之后），payload 里没有 `jobContext` 键；run 的归属来自 `run.started`；之后 `sessionStore` 变化不影响已有的 run；同时导入 store 和 jobs 模块时不出现循环。满足 AC-005-8 的单元部分。
  2. 交错回放作业 A、作业 B 和无上下文 run：`runsFor('A')` 只含 A 的 run，`runsFor()` 含全部 run；`receive` 收到全部事件；模块角标不变；每个 run 恰好一个终态。满足 AC-005-9 的 store 部分。
  3. success / failure / retry / long 四份无上下文脚本和事件契约都照旧通过。对应 AC-005-6 回归；契约测试由互动方维护，壳只运行。
- **验证命令**（1、2 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-005-8 v2-ctx-store"`
  2. `pnpm -C frontend test:unit -t "AC-005-9 v2-ctx-store"`
  3. `pnpm -C frontend test:unit -t "AC-005-6"`

#### T-V2-04 对话上下文展示：chip 与“查看”选择器（S1-ctx）

- [ ] **状态**：blocked。blocked_by：v1 Handoff SHA、H-1、H-4、H-2·标签（只需 `StageLabel`）
- **上下文**：plan §7.7 的展示部分。两档高度和 `fai.drawer` 都不变。
- **修改范围**：
  - `AgentDock.vue`：输入栏 chip。有上下文时显示“作业 {jobId} · {StageLabel}”，没有时显示“全局”。
  - `CotTimeline.vue`：每个 run 头部显示 chip，全局 run 显示“全局”。
  - `AgentDrawer.vue`：页头新增“查看：全部 / 作业 X”选择器。选项来自 runs 中出现过的 `jobId`；选择结果只存在组件本地 ref，不持久化；通过 `runsFor` 实现，只影响展示。
  - `tests/component/timeline.spec.ts`。
- **依赖**：T-V2-03　**预计**：2 h
- **完成标准**：
  1. 输入栏 chip 和 run 头 chip 正确，全局 run 显示“全局”；选择器的选项、筛选结果和“不持久化”都正确；筛选不影响 `receive`、模块角标和 `running`。满足 AC-005-9 的展示部分。
  2. 时间线的展开 / 收起、`step.error` 和唯一终态行都没有回归。对应 AC-005-2 回归。
  3. 后台运行、模块角标、引导跳转、抽屉两档高度和运行中指示都没有回归。对应 AC-005-3、AC-005-4、AC-005-5、AC-005-7 回归。
- **验证命令**（1 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-005-9 v2-ctx-ui"`
  2. `pnpm -C frontend test:unit -t "AC-005-2"`
  3. `pnpm -C frontend test:e2e -g "AC-005-3|AC-005-4|AC-005-5|AC-005-7"`

#### T-V2-05 作业轨道：卡片、共享缓存与跳转（S1-track）

- [ ] **状态**：blocked。blocked_by：v1 Handoff SHA、H-2·标签（含 `JobTypeLabel`、`JobStatusBadge`）、H-2·列表、H-3·路由切片、H-6
- **上下文**：
  - 依据：plan §7.5；V2-S02、S04、S07。
  - 具名路由 `job-detail` 要等 H-3 路由切片集成后才存在。在此之前本任务 blocked，不加 `hasRoute` 兜底，也不演示未集成的界面。
- **修改范围**：
  - 新建 `workbench/JobTrack.vue`：
    - 容器是透明行；卡片复用 `.glass-module`，不用 `section.fai-module`；卡片在轨道内 `overflow-x: auto`；高度固定一行；不引用 `updown.css`；不写颜色字面量。
    - 卡片显示标题和 `JobTypeLabel`；四阶段按固定顺序排列，每段显示 `StageLabel` 加 `StageStateLabel` 的图标和文案；`pendingCount > 0` 时显示“待介入 N”；作业状态复用 `JobStatusBadge`。
    - 卡片集合 = H-2 的“进行中”selector 或常量作用在未筛选缓存上的结果；不从阶段状态推断，不持有数据副本。
    - 挂载时调用共享 ensure/load。
    - 点击执行 `router.push({name:'job-detail', params:{id, stage: currentStage}})`。
  - `WorkbenchPage.vue`：顺序为页头 → FocusBand → JobTrack → ModuleGrid，ModuleGrid 仍是唯一纵向滚动区。
  - 新建 `tests/component/job-track.spec.ts`：用真实 Pinia、互动方真实 `jobsStore`、真实 mock `dataClient`，加上真实 router 和互动方的 routes。
- **依赖**：T-V2-02　**预计**：2 h
- **完成标准**：
  1. 卡片的名称、类型文案、四阶段顺序、状态文案和图标、“待介入”角标都正确，状态不只靠颜色区分。按 V2-S02 的最低口径：fixture 里“等待人工确认”和“存在冲突待介入”的作业在轨道中，终结态作业不在；具体枚举以生产方 CONTRACT.md 的登记为准，用明确的 fixture id 断言，不在测试里重写判定逻辑。满足 AC-003-7 的组件部分（卡片）。
  2. 关键用例：轨道保持挂载，`agent.runs` 中没有终态，调用互动方的写 action（如 `markInboxRead` 或投放归属）后，“待介入 N”或卡片顺序自动变化，并与 store 列表 selector 中同一作业的值一致；测试不调用手动重读。满足 AC-003-7 的组件部分（共享缓存）。
  3. 点击卡片后，路由跳到 `job-detail`，参数为 `{id, currentStage}`；壳不推进阶段，也不改作业状态。满足 AC-003-7 的组件部分（跳转）。
  4. 仓库六项检查都通过，并覆盖新文件：colors、glass、updown、grid、network、generated。对应 AC-001-2、AC-001-3、AC-001-5、AC-004-6、AC-007-1 回归。
- **验证命令**（1～3 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-003-7 v2-track card"`
  2. `pnpm -C frontend test:unit -t "AC-003-7 v2-track shared"`
  3. `pnpm -C frontend test:unit -t "AC-003-7 v2-track nav"`
  4. `pnpm -C frontend check`

#### T-V2-06 作业轨道：三态与固定件位置（S1-track）

- [ ] **状态**：blocked。blocked_by：同 T-V2-05
- **上下文**：plan §7.5 的三种状态；V2-S03。
- **修改范围**：
  - `JobTrack.vue`：
    - 加载态沿用 v1 的 Loading。
    - 空态分两种静态文案，不加 `reason` 字段：
      - 缓存为空时显示“暂无作业”，原因“还没有创建任何作业”；
      - 缓存非空但没有进行中作业时显示“暂无进行中的作业”，原因“现有作业均不在进行中”；
      - 两种都提供“前往作业”链接到 `/jobs`。
    - 错误态沿用 ErrorState，诊断信息为 `{source:'job-track', code, message, ts}`，可以复制；重试调用共享 refresh。
  - `job-track.spec.ts`（追加）。
  - `e2e/workbench.spec.ts`、`e2e/modules.spec.ts`。
  - 第二种空态的测试：用 `jobFixtures` 覆盖为只含非进行中作业的列表。如果 H-6 的覆盖项只能追加、不能替换，这个子用例保持 blocked，并报协调器补登记 README 队列；壳不自建 fixture。
- **依赖**：T-V2-05　**预计**：2 h
- **完成标准**：
  1. `slow` 场景出现加载态；两种空态的文案正确，都有 `/jobs` 入口；`error` 场景的诊断可以复制，重试调用共享 refresh；三种状态下焦点带和模块区都能独立渲染。满足 AC-003-9。
  2. DOM 顺序为 Focus → Track → Grid；模块库中没有轨道；轨道没有移除、上移或下移操作；增删、移动模块并刷新后，轨道位置不变。满足 AC-003-8。
  3. 增删模块后，焦点带和轨道都还在。对应 AC-003-6 回归扩充。
  4. 默认七个模块、模块库、顺序持久化都没有回归；页面遍历时不把轨道卡片当成模块。对应 AC-004-1、AC-004-2、AC-004-3（页面部分）回归。
- **验证命令**（1、2 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-003-9 v2-track-state"`
  2. `pnpm -C frontend test:e2e -g "AC-003-8 v2-track-state"`
  3. `pnpm -C frontend test:e2e -g "AC-003-6"`
  4. `pnpm -C frontend test:e2e -g "AC-004-1|AC-004-2|AC-004-3 page"`

#### T-V2-07 全局投放挂载、几何令牌与对话抽屉避让（S1-intake）

- [ ] **状态**：blocked。blocked_by：v1 Handoff SHA、H-4、H-5；另外因为和 T-V2-04 同写 `AgentDrawer.vue` 而串行，继承 H-1 和 H-2·标签
- **上下文**：plan §7.6、§7.10 第 1 条。
- **修改范围**：
  - `tokens.json`：新增 `layout.intake_width`，值在实施时确定（建议 `24rem`），`source` 为 `design/ui/UI_DARK_ADDITIONS.md#drawer`。
  - `UI_DARK_ADDITIONS.md`：在 `#drawer` 段补一条记录。
  - 运行 `pnpm -C frontend tokens` 重新生成 `generated/*` 和 index.html 首帧块，不手改生成物。
  - `AppShell.vue`：
    - 第二行改为 `.route-area { position: relative; min-height: 0 }`，里面放 `main.route-view` 和 `aside.intake-slot v-if="intake.isOpen"`。
    - `.intake-slot` 绝对定位在右侧整高，宽度 `min(var(--fai-layout-intake-width), 50%)`，`z-index` 用 `var(--fai-z-drawer)`；不加遮罩、焦点锁或 `aria-modal`。
    - 用 `tabindex="-1"`：打开时焦点移入 slot，关闭时焦点回到“投放”按钮。
    - 处理 `intake` 事件：调用 `intake.open(session.context?.jobId)`，打开时快照一次。
    - 在 `.content` 上设置 `--shell-intake-offset`。
    - 整个应用只有这一个挂载点；不碰 agent store。
  - `AgentDrawer.vue`：只把定位改为 `inset-inline: 0 var(--shell-intake-offset, 0)`。不改 `ui.drawer` 和 `fai.drawer`，不引入 overlay 管理器。
- **依赖**：T-V2-02、T-V2-04　**预计**：2 h
- **完成标准**：
  1. 新令牌已登记，重新生成后与生成物一致。对应 AC-001-1。
  2. 新令牌的 `source` 能解析到条目锚点。对应 AC-008-2。
  3. slot 不带玻璃样式，没有第四层玻璃，没有颜色字面量。对应 AC-001-2、AC-001-3。
  4. 为 AC-002-8 提供唯一挂载点的实现，类型检查和 lint 通过。**本任务不宣称满足 AC-002-8**：AC-002-8 在 T-V2-10 验收，双抽屉几何在 T-V2-08 验证。
- **验证命令**：
  1. `pnpm -C frontend tokens && pnpm -C frontend check --only generated`
  2. `pnpm -C frontend test:unit -t "AC-008-2"`
  3. `pnpm -C frontend check --only glass && pnpm -C frontend check --only colors`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

#### T-V2-08 断点回归：轨道与双抽屉（S1 汇合）

- [ ] **状态**：blocked。blocked_by：T-V2-06 和 T-V2-07 的全部 blocked_by 合并
- **上下文**：plan §7.11 AC-002-6；M-10、M-11。
- **修改范围**：`e2e/breakpoints.spec.ts`。
- **依赖**：T-V2-06、T-V2-07　**预计**：1 h
- **完成标准**：
  1. 在 960、979、981、1239、1241、1399、1401、1499、1501 和 1440×900 这 10 个视口下，原来对侧栏、栅格和焦点带卡数的断言不变；轨道都存在，且文档没有横向溢出。对应 AC-002-6（轨道部分）。
  2. 在 960 和 1440×900 下同时打开投放抽屉和对话抽屉：两个面板并排，没有溢出，底部输入栏始终可见。对应 AC-002-6（双抽屉部分）。
- **验证命令**（都是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-6 v2-bp track"`
  2. `pnpm -C frontend test:e2e -g "AC-002-6 v2-bp dual"`

#### T-V2-09 集成 e2e（一）：作业路由、列表与对话上下文（S2）

- [ ] **状态**：blocked。blocked_by：v1 Handoff SHA、H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-6（另经依赖继承 H-5）
- **上下文**：plan §7.11 中 AC-002-2、AC-002-3、AC-005-8 的集成部分；V2-S05。
- **修改范围**：新建 `e2e/integration-v2.spec.ts`，本任务是创建者，T-V2-10 之后串行追加。
- **依赖**：T-V2-08　**预计**：2 h
- **完成标准**：
  1. 直接打开 `/jobs/:id/:stage` 并刷新，“作业”项为 `aria-current="location"`。名为 `jobs` 的路由只有一条：用 v1 Handoff SHA 中已有的 mock 测试钩子读取 router；如果钩子不暴露 router，就以“`/jobs` 渲染的是互动方列表、且没有壳占位的 owner 文案”作为等价断言。不为此修改 `main.ts`，也不新增钩子。满足 AC-002-2 的集成部分。
  2. 通过 `window.__FAI_MOCK__` 的 `jobFixtures` 新增一项作业，它在 `/jobs` 可见，并能进入详情。满足 AC-002-3。
  3. 按以下步骤验证上下文：
     - 用 addInitScript 固定 `agentScript=long`，打开 `/jobs/:id/analyze` 并发送；输入栏 chip 和 run 头 chip 都显示该作业和“分析”。
     - 切到 `deliver`，再切到 `/prices`；原 run 的 chip 和 runId 都不变。
     - **显式等待原 `long` run 出现唯一终态、输入栏运行中指示消失**；超时设为脚本时长加余量，不用固定 sleep。
     - 做一次全局发送；输入栏 chip 和新 run 头 chip 都显示“全局”，新 run 不带作业标识。H-1 的 mock 会把 payload 上下文原样写进事件，所以新 run 没有上下文，就证明 payload 没有沿用旧的 `jobContext`；payload 中没有该键由 T-V2-03 直接断言。
     
     满足 AC-005-8 的端到端部分。
- **验证命令**（都是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-2 v2-int-nav"`
  2. `pnpm -C frontend test:e2e -g "AC-002-3 v2-int-nav"`
  3. `pnpm -C frontend test:e2e -g "AC-005-8 v2-int-ctx"`

#### T-V2-10 集成 e2e（二）：全局投放与轨道一致性（S2）

- [ ] **状态**：blocked。blocked_by：同 T-V2-09，另加 H-5 和页面切片中的 `IntakeDrawer` 流程
- **上下文**：plan §7.11 中 AC-002-8、AC-003-7 的集成部分；§7.10 第 2 条。
- **修改范围**：`e2e/integration-v2.spec.ts`（追加）。
- **依赖**：T-V2-09　**预计**：2 h
- **完成标准**：
  1. 在 `/workbench`、`/jobs`、`/jobs/:id/:stage` 和 `/prices` 点“投放”，都出现同一个 `.intake-slot`，且只有一个。在作业详情页打开时，`IntakeDrawer` 显示的归属是当前作业（按 H-5 交接时登记的可见标识断言）；在其他页面打开时没有归属。在 `long` run 运行中打开再关闭投放：URL 不变，runId 不变，步骤继续增加且不重复，焦点回到按钮。满足 AC-002-8。
  2. 在工作台打开投放，把材料归属到一个进行中的作业，期间轨道不卸载。之后：
     - 轨道的角标和顺序更新；
     - `/jobs` 里进行中项的集合、顺序和待介入数与轨道一致；
     - 在列表页应用筛选后回到工作台，轨道仍一致（H-2 ④）；
     - 点击卡片进入 `/jobs/:id/<currentStage>`。
     
     满足 AC-003-7 的集成部分。
  3. 整个集成文件一起运行时用例互不干扰。对应 AC-002-2、AC-002-3、AC-002-8、AC-003-7、AC-005-8 的集成部分合跑。
- **验证命令**（都是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-8 v2-int-intake"`
  2. `pnpm -C frontend test:e2e -g "AC-003-7 v2-int-track"`
  3. `pnpm -C frontend test:e2e e2e/integration-v2.spec.ts`

#### T-V2-11 静态、运行时与 52 条 AC 回归（含 AC-007-5 参与证据）

- [ ] **状态**：blocked。blocked_by：全部交接单元，以及 T-V2-10
- **上下文**：
  - 依据：plan §7.11 中“不变 + v2 回归”的各条。
  - 只在集成验证分支的 SHA 上运行。
  - 默认不改代码。回归失败时：如果在壳的文件里，只能在第 4 节已列的壳文件内修复，并在 review.md 记录；如果在生产方文件里，退回生产方，壳不代修。
- **修改范围**：没有新增修改；修复限于第 4 节的壳文件。
- **依赖**：T-V2-10　**预计**：1.5 h
- **完成标准**：
  1. 六项仓库检查全部通过，新文件和新令牌都已纳入。对应 AC-001-1、AC-001-2、AC-001-3、AC-001-5、AC-001-6、AC-004-6、AC-007-1、AC-007-3（generated 对拍）。
  2. 运行时令牌对拍、计算字体族、`.sem-market` 的位置都没有回归。对应 AC-001-1、AC-001-4、AC-001-5 的运行时部分。
  3. 格式化、字族和 `Num` 语义类都没有回归。对应 AC-001-4、AC-001-5 的单元 / 组件部分。
  4. 焦点带的结论、跳转、空态、取色和两段分隔都没有回归。对应 AC-003-1、AC-003-2、AC-003-3、AC-003-4、AC-003-5。
  5. 模块壳结构、三态和代表模块的形态都没有回归。对应 AC-004-3、AC-004-4、AC-004-5。
  6. 主题、对比度、样例图颜色和透明背景都没有回归。对应 AC-006-1、AC-006-2、AC-006-3、AC-006-4。
  7. 场景切换、契约文档和数值元数据都没有回归；2.0.0 生成物由生产方重新生成，壳只回归。对应 AC-007-2、AC-007-3、AC-007-4。
  8. AC-007-5：第 1.2 节 H-1 行的生产方证据齐全，包括已提交的有效 Checklist SHA 和定向测试摘要；在集成 SHA 上，生产方的三份契约测试全绿，作为壳的参与回归。**壳不代做、不代勾**；证据缺失时本项 blocked。
  9. 规范资产登记、令牌来源和暗色配色表都没有回归。对应 AC-008-1、AC-008-2、AC-008-3。
- **验证命令**：
  1. `pnpm -C frontend check`
  2. `pnpm -C frontend test:e2e -g "AC-001-1|AC-001-4|AC-001-5"`
  3. `pnpm -C frontend test:unit -t "AC-001-4|AC-001-5"`
  4. `pnpm -C frontend test:unit -t "AC-003-1|AC-003-3|AC-003-4|AC-003-5" && pnpm -C frontend test:e2e -g "AC-003-2"`
  5. `pnpm -C frontend test:unit -t "AC-004-3|AC-004-4|AC-004-5" && pnpm -C frontend test:e2e -g "AC-004-4"`
  6. `pnpm -C frontend test:unit -t "AC-006-1|AC-006-2" && pnpm -C frontend test:e2e -g "AC-006-3|AC-006-4"`
  7. `pnpm -C frontend test:unit -t "AC-007-2|AC-007-3|AC-007-4" && pnpm -C frontend test:e2e -g "AC-007-2"`
  8. `pnpm -C frontend test:unit tests/unit/contracts.spec.ts tests/unit/mock.spec.ts tests/unit/contract-doc.spec.ts`
  9. `pnpm -C frontend test:unit -t "AC-008-1|AC-008-2|AC-008-3"`

#### T-V2-12 全量命令与人工验收截图收口

- [ ] **状态**：blocked。blocked_by：同 T-V2-11
- **上下文**：
  - 依据：plan §7.12；spec R-009。
  - 只有集成验证分支上的全量结果才算 v2 证据。
  - 证据摘要和截图交给 Handoff 时的 review.md；截图的存放路径沿用 v1 Handoff 时的约定。
- **修改范围**：截图证据文件。不改 manual-acceptance.md 正文：如果发现文本与实现不符，回 Analyze 另行登记。
- **依赖**：T-V2-11　**预计**：1.5 h
- **完成标准**：
  1. 一条命令跑完 `check + typecheck + lint + test:unit + test:e2e`，全部通过。对应 AC-009-1。
  2. 人工清单与测试同步，共 M-01～M-12。对应 AC-009-2 的文本部分。
  3. 在 10 个视口下，按 M-01～M-12 逐项截图，作为 AC-009-2 的截图证据。截图同时覆盖：
     - AC-001-3（M-01）、AC-003-5（M-03）、AC-004-5（M-04）、AC-006-4（M-08）的人工部分；
     - M-09 导航（AC-002-2）、M-10 轨道（AC-003-7、AC-003-8、AC-003-9、AC-002-6）、M-11 投放（AC-002-8、AC-002-6）、M-12 上下文（AC-005-8、AC-005-9）的视觉检查。
- **验证命令**：
  1. `pnpm -C frontend test`
  2. `pnpm -C frontend test:unit -t "AC-009-2"`
  3. 人工：执行 `pnpm -C frontend dev`，然后按 `specs/frontend-workbench/manual-acceptance.md` 的 M-01～M-12 逐项截图

### 7. 52 条 AC 的任务 / 验证矩阵

命令前缀 `pnpm -C frontend` 已省略；“T-V2-xx#n”表示该任务的第 n 条完成标准及其对应的验证命令。类型说明：
- **复用+回归**：沿用 v1 实现，v2 只做回归；
- **修改**、**新增**：需要 v2 实现；
- **集成**：需要互动方交接后才能验证；
- **生产方证据**：由互动方提供，壳不代勾。

| AC | 类型 | 任务#标准 | 验证命令 |
|---|---|---|---|
| AC-001-1 | 复用+回归（新令牌纳入对拍） | T-V2-07#1；T-V2-11#1、#2 | `tokens && check --only generated`；`check`；`test:e2e -g "AC-001-1\|AC-001-4\|AC-001-5"` |
| AC-001-2 | 复用+回归（扫描覆盖新文件） | T-V2-05#4；T-V2-07#3；T-V2-11#1 | `check`；`check --only glass && check --only colors`；`check` |
| AC-001-3 | 复用+回归；人工 M-01 | T-V2-05#4；T-V2-07#3；T-V2-11#1；T-V2-12#3 | `check`；`check --only glass && …`；`check`；人工截图 |
| AC-001-4 | 复用+回归 | T-V2-11#2、#3 | `test:e2e -g "AC-001-1\|AC-001-4\|AC-001-5"`；`test:unit -t "AC-001-4\|AC-001-5"` |
| AC-001-5 | 复用+回归（轨道不得引用 updown） | T-V2-05#4；T-V2-11#1、#2、#3 | `check`；同上两条 |
| AC-001-6 | 复用+回归 | T-V2-11#1 | `check` |
| AC-002-1 | 复用+回归 | T-V2-01#3 | `test:e2e -g "AC-002-1\|AC-002-5"` |
| AC-002-2 | 修改；部分集成 | T-V2-01#1（壳部分）；T-V2-09#1（集成部分）；T-V2-10#3；人工 M-09 | `test:e2e -g "AC-002-2 v2-nav"`；`test:e2e -g "AC-002-2 v2-int-nav"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-002-3 | 修改；集成 | T-V2-09#2；T-V2-10#3 | `test:e2e -g "AC-002-3 v2-int-nav"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-002-4 | 修改（新增按钮） | T-V2-02#2 | `test:unit -t "AC-002-4"` |
| AC-002-5 | 复用+回归 | T-V2-01#3 | `test:e2e -g "AC-002-1\|AC-002-5"` |
| AC-002-6 | 复用+回归扩充 | T-V2-01#4；T-V2-08#1、#2；人工 M-10、M-11 | `test:e2e -g "AC-002-6"`；`test:e2e -g "AC-002-6 v2-bp track"`；`test:e2e -g "AC-002-6 v2-bp dual"` |
| AC-002-7 | 复用，回归更新为 3 步 | T-V2-02#1 | `test:e2e -g "AC-002-7"` |
| AC-002-8 | 新增；集成 | T-V2-07#4（只提供实现，不验收）；T-V2-10#1、#3；人工 M-11 | `typecheck && lint`；`test:e2e -g "AC-002-8 v2-int-intake"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-003-1 | 复用+回归 | T-V2-11#4 | `test:unit -t "AC-003-1\|AC-003-3\|AC-003-4\|AC-003-5" && test:e2e -g "AC-003-2"` |
| AC-003-2 | 复用+回归 | T-V2-11#4 | 同上 |
| AC-003-3 | 复用+回归 | T-V2-11#4 | 同上 |
| AC-003-4 | 复用+回归 | T-V2-11#4 | 同上 |
| AC-003-5 | 复用+回归；人工 M-03 | T-V2-11#4；T-V2-12#3 | 同上；人工截图 |
| AC-003-6 | 复用+回归扩充（轨道仍在） | T-V2-06#3 | `test:e2e -g "AC-003-6"` |
| AC-003-7 | 新增；部分集成 | T-V2-05#1、#2、#3（组件部分）；T-V2-10#2、#3（集成部分）；人工 M-10 | `test:unit -t "AC-003-7 v2-track card"`；`… shared`；`… nav`；`test:e2e -g "AC-003-7 v2-int-track"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-003-8 | 新增 | T-V2-06#2；人工 M-10 | `test:e2e -g "AC-003-8 v2-track-state"` |
| AC-003-9 | 新增 | T-V2-06#1；人工 M-10 | `test:unit -t "AC-003-9 v2-track-state"` |
| AC-004-1 | 复用+回归 | T-V2-06#4 | `test:e2e -g "AC-004-1\|AC-004-2\|AC-004-3 page"` |
| AC-004-2 | 复用+回归 | T-V2-06#4 | 同上 |
| AC-004-3 | 复用+回归（轨道卡片不算模块） | T-V2-06#4；T-V2-11#5 | 同上；`test:unit -t "AC-004-3\|AC-004-4\|AC-004-5" && test:e2e -g "AC-004-4"` |
| AC-004-4 | 复用+回归 | T-V2-11#5 | 同上 |
| AC-004-5 | 复用+回归；人工 M-04 | T-V2-11#5；T-V2-12#3 | 同上；人工截图 |
| AC-004-6 | 复用+回归（覆盖轨道样式） | T-V2-05#4；T-V2-11#1 | `check` |
| AC-005-1 | 修改（九个路由） | T-V2-01#2 | `test:e2e -g "AC-005-1 v2-nav"` |
| AC-005-2 | 复用+回归 | T-V2-04#2 | `test:unit -t "AC-005-2"` |
| AC-005-3 | 复用+回归 | T-V2-04#3 | `test:e2e -g "AC-005-3\|AC-005-4\|AC-005-5\|AC-005-7"` |
| AC-005-4 | 复用+回归 | T-V2-04#3 | 同上 |
| AC-005-5 | 复用+回归 | T-V2-04#3 | 同上 |
| AC-005-6 | 复用+回归 | T-V2-03#3 | `test:unit -t "AC-005-6"` |
| AC-005-7 | 复用+回归 | T-V2-04#3 | `test:e2e -g "AC-005-3\|AC-005-4\|AC-005-5\|AC-005-7"` |
| AC-005-8 | 新增；部分集成 | T-V2-03#1（单元部分）；T-V2-09#3、T-V2-10#3（端到端部分）；人工 M-12 | `test:unit -t "AC-005-8 v2-ctx-store"`；`test:e2e -g "AC-005-8 v2-int-ctx"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-005-9 | 新增 | T-V2-03#2；T-V2-04#1；人工 M-12 | `test:unit -t "AC-005-9 v2-ctx-store"`；`test:unit -t "AC-005-9 v2-ctx-ui"` |
| AC-006-1 | 复用+回归 | T-V2-11#6 | `test:unit -t "AC-006-1\|AC-006-2" && test:e2e -g "AC-006-3\|AC-006-4"` |
| AC-006-2 | 复用+回归 | T-V2-11#6 | 同上 |
| AC-006-3 | 复用+回归 | T-V2-11#6 | 同上 |
| AC-006-4 | 复用+回归；人工 M-08 | T-V2-11#6；T-V2-12#3 | 同上；人工截图 |
| AC-007-1 | 复用+回归（network 守卫覆盖新文件） | T-V2-05#4；T-V2-11#1 | `check` |
| AC-007-2 | 复用+回归 | T-V2-11#7 | `test:unit -t "AC-007-2\|AC-007-3\|AC-007-4" && test:e2e -g "AC-007-2"` |
| AC-007-3 | 复用；2.0.0 文档由生产方重新生成，壳回归 | T-V2-11#1、#7 | `check`；同上 |
| AC-007-4 | 复用；fixture 由生产方维护，壳回归 | T-V2-11#7 | 同上 |
| AC-007-5 | 新增；**生产方证据** | 第 1.2 节 H-1 行登记；T-V2-11#8（参与回归，不代勾） | `test:unit tests/unit/contracts.spec.ts tests/unit/mock.spec.ts tests/unit/contract-doc.spec.ts` |
| AC-008-1 | 复用+回归 | T-V2-11#9 | `test:unit -t "AC-008-1\|AC-008-2\|AC-008-3"` |
| AC-008-2 | 复用+v2（新令牌的 source） | T-V2-07#2；T-V2-11#9 | `test:unit -t "AC-008-2"`；同上 |
| AC-008-3 | 复用+回归 | T-V2-11#9 | 同上 |
| AC-009-1 | 复用（只认集成后的全量结果） | T-V2-12#1 | `test` |
| AC-009-2 | 复用+扩充（M-09～M-12） | T-V2-02#3；T-V2-12#2、#3 | `test:unit -t "AC-009-2"`；人工截图 |

### 8. V2-S01～S09 落实

| 建议 | 处理 | 落实位置 |
|---|---|---|
| V2-S01 | 接受 | 第 1.2 节登记表要求填固定 commit、已提交的有效 Checklist SHA 和定向测试摘要；不以 `8bd1b31` 的旧 R2 或移动工作树中的 R3/R4 作为证据。README 第 33 行已登记 H-2/H-4/H-5/H-6 的新增要求。本 Tasks 新细化了三点：`JobStatusBadge` 随 H-2 交付；H-2 标签可先供 S1-ctx；H-3 路由切片可先供 S1-track。这三点是交接范围的细化，建议协调器在同一行补上字样（本区块不写 README） |
| V2-S02 | 接受 | plan §7.3 H-2 ③ 小改；T-V2-05#1：“等待人工确认”和“存在冲突待介入”的作业在集合内，终结态不在；具体枚举由生产方的契约常量定义并登记进 CONTRACT.md |
| V2-S03 | 接受 | plan §7.5 空态和 §7.11 AC-003-9 小改；T-V2-06：两种静态文案，不加 `reason` 字段 |
| V2-S04 | 接受，采用“列依赖”方案，不改成按 path 跳转 | plan §7.5 点击行为、H-3 解锁列和 §7.13 S1-track 小改；T-V2-05/06 的 blocked_by 加 H-3 路由切片（不等页面功能）；不加 `hasRoute`；切片集成前卡片不可点、不演示 |
| V2-S05 | 接受 | plan §7.11 AC-005-8 小改；T-V2-09#3：显式等待原 run 终态后再全局发送，并通过新 run 没有上下文推出 payload 没有旧上下文；T-V2-03#1 直接断言 payload 中没有该键 |
| V2-S06 | 接受 | plan §7.7 小改；T-V2-03 修改范围和第 1 条完成标准：`useSessionStore()` 只在 `send` 函数体内调用，不加抽象 |
| V2-S07 | 接受 | plan §7.5、H-2、§7.13 小改：“优先复用”改为“复用”；T-V2-05/06 的 blocked_by 加 H-2·标签（含 `JobStatusBadge`）；没交接就 blocked，不用文案直出替代 |
| V2-S08 | 接受，不增加页面功能 | T-V2-01：在 `nav.ts` 加归属注释，`AC-002-2 v2-nav` 断言 owner 文案；T-V2-02：M-09 写“格物致知（learning，Phase 2C）” |
| V2-S09 | 接受，spec 不改 | 页首声明和第 1.1 节：以 spec 页首批准记录为准；plan §7.1 小改，补“其余回归见 §7.11” |
| Tasks 自查补充（不是 A 的建议） | 一并送 A 复核 | plan §7.13：S1-ctx 的 chip 需要 H-2 的 `StageLabel`；S1-intake 和 S1-ctx 同写 `AgentDrawer.vue`，因此串行；§7.0 中 `0ffa15e` 的表述改为“固定历史参照” |

### 9. 工时、依赖与下一步

| 任务 | 阶段 | 依赖 | 预计 |
|---|---|---|---|
| T-V2-01 | S0 | — | 2 h |
| T-V2-02 | S0 | T-V2-01 | 2 h |
| T-V2-03 | S1-ctx | T-V2-02 | 2 h |
| T-V2-04 | S1-ctx | T-V2-03 | 2 h |
| T-V2-05 | S1-track | T-V2-02 | 2 h |
| T-V2-06 | S1-track | T-V2-05 | 2 h |
| T-V2-07 | S1-intake | T-V2-02、T-V2-04 | 2 h |
| T-V2-08 | S1 汇合 | T-V2-06、T-V2-07 | 1 h |
| T-V2-09 | S2 | T-V2-08 | 2 h |
| T-V2-10 | S2 | T-V2-09 | 2 h |
| T-V2-11 | 回归 | T-V2-10 | 1.5 h |
| T-V2-12 | 收口 | T-V2-11 | 1.5 h |
| **合计** | | | **22 h（12 个任务）** |

- 依赖都只指向编号更早的任务，没有前向依赖，也没有环。
- 关键路径为 01 → 02 → 03 → 04 → 07 → 08 → 09 → 10 → 11 → 12，共 18 h。05 → 06 可以和 03 → 04 并行，前提是两边的交接都已到位。
- **本清单不启动实施。** 后续顺序：
  1. Tasks 落盘；
  2. Analyze：只读，重新读取 spec / plan / tasks 后出报告，发现问题就修复并重跑；
  3. A 新开独立会话，定向复核 Tasks 和 plan §7 小改，并补勾 checklist-v2「阶段说明」；
  4. 外部前置齐备：v1 Handoff SHA 已登记且在 main 上，所需的 H-x 已交付并集成，第 5 节闸门通过；
  5. 按依赖顺序 Implement；
  6. Converge：外部阻塞未解除时，必须报“未收敛（外部阻塞）”；
  7. Review → Gate 2 → Handoff。
===PLAN_EDITS===
```json
[
  {
    "oldText": "- **本节不做的事**：不修改 spec、tasks、checklist、产品 ADR 或代码；不授权实施。",
    "newText": "- **本节不做的事**：不修改 spec、tasks、checklist、产品 ADR 或代码；不授权实施。**Tasks 阶段补充（2026-10-28）**：Tasks = `claude-opus-5-5` via `anthropic`（bridge 本限额窗口额度不可用，未换模型）。为落实 checklist-v2 建议 V2-S02～S07、S09，并修正两处依赖表述，对 §7.0、§7.1、§7.3、§7.5、§7.7、§7.11、§7.13 做了实施细节小改；没有需求变化，不改 spec，也不改产品 ADR。这些小改**未经审核**：A 的通过只针对 `d2bf5a7`，须由 A 新开独立会话定向复核后，才能作为实施依据。"
  },
  {
    "oldText": "  - `0ffa15e`（v1 实施分支 HEAD，尚未 Handoff）也不能作为开工基线。",
    "newText": "  - `0ffa15e`（Plan 与 A 核对时使用的 v1 实施分支固定历史参照，不是当前 HEAD，尚未 Handoff）也不能作为开工基线。v1 实施分支其后的移动（如 `b19427a`）只是只读元信息，同样不代表 Handoff，也不能作为开工基线。"
  },
  {
    "oldText": "| §5 验收 | 新增 7 条 AC。AC-002-2/002-3/002-4/002-7/005-1 的验收落点由 §7.11 取代；其余沿用旧落点，并加入 v2 回归 |",
    "newText": "| §5 验收 | 新增 7 条 AC。AC-002-2/002-3/002-4/002-7/005-1 的验收落点由 §7.11 取代；其余沿用旧落点，并加入 v2 回归。其余各条的回归与扩充（如 AC-001-x、AC-002-6、AC-003-6、AC-004-x、AC-007-x、AC-008-2、AC-009-2）见 §7.11，以 §7.11 为准 |"
  },
  {
    "oldText": "③ “进行中”判定：可以是 selector，也可以是 `ACTIVE_JOB_STATUSES` 一类契约常量；<br>",
    "newText": "③ “进行中”判定：可以是 selector，也可以是 `ACTIVE_JOB_STATUSES` 一类契约常量。壳的最低期望：等待人工确认的作业、存在冲突待介入的作业必须在集合内，终结态作业不在；具体枚举由生产方用契约常量定义并登记进 CONTRACT.md，壳不自定；<br>"
  },
  {
    "oldText": "<br>**还缺**：`JobTypeLabel`。<br>以上由互动方在其 Plan/Tasks 中落实；对方拒绝时报 Walter 裁决，壳不自建映射、缓存或刷新机制 | S1-track：AC-003-7～AC-003-9 |",
    "newText": "<br>**还缺**：`JobTypeLabel`；以及轨道复用的作业状态徽标组件 `JobStatusBadge`（属于 §7.2 中互动方的徽标组件），随本交接单元交付。<br>以上由互动方在其 Plan/Tasks 中落实；对方拒绝时报 Walter 裁决，壳不自建映射、缓存或刷新机制。标签导出与 `JobStatusBadge` 可以和列表缓存分批交接 | S1-track：AC-003-7～AC-003-9（需要全部内容）；S1-ctx 的 chip 只需要其中的 `StageLabel` 导出 |"
  },
  {
    "oldText": "| S2：AC-002-2 集成部分、AC-002-3、AC-003-7 集成部分 |",
    "newText": "| S2：AC-002-2 集成部分、AC-002-3、AC-003-7 集成部分。其中“路由定义与 `main.ts` 注册”这一切片（不含列表/详情页面功能）先解锁 S1-track 的卡片跳转（AC-003-7 组件部分） |"
  },
  {
    "oldText": "  - 作业状态优先复用互动方已交接的 `JobStatusBadge`；壳不维护第二份映射。",
    "newText": "  - 作业状态复用互动方随 H-2 交接的 `JobStatusBadge`；未交接前 S1-track 保持 blocked，壳不用 `JobStatusLabel` 文案直出替代，也不维护第二份映射。"
  },
  {
    "oldText": "- **点击行为**：执行 `router.push({name:'job-detail', params:{id, stage: item.currentStage}})`。壳不推进阶段，也不改作业状态。",
    "newText": "- **点击行为**：执行 `router.push({name:'job-detail', params:{id, stage: item.currentStage}})`。壳不推进阶段，也不改作业状态。具名路由 `job-detail` 只由 H-3 提供，未注册时 push 会抛错；壳不加 `hasRoute` 兜底，也不改为按 path 跳转。因此 S1-track 依赖 H-3 的“路由定义与 `main.ts` 注册”切片，但不等列表/详情页面功能：该切片集成前卡片不可点，S1-track 保持 blocked，也不提前演示未集成的界面。"
  },
  {
    "oldText": "  - 空：显示“暂无进行中的作业”和原因，并提供 `/jobs` 链接。",
    "newText": "  - 空：按共享未筛选缓存区分两种静态文案，都提供 `/jobs` 链接。缓存为空时显示“暂无作业”，原因“还没有创建任何作业”；缓存非空但进行中集合为空时显示“暂无进行中的作业”，原因“现有作业均不在进行中”。原因由这两种情形静态给出，不为此在契约中加 `reason` 字段。"
  },
  {
    "oldText": "- **发送时捕获**：`agent/store.ts` 的 `send(message)` 在第一个 `await` 之前，同步读取 `useSessionStore().context` 的快照。",
    "newText": "- **发送时捕获**：`agent/store.ts` 的 `send(message)` 在第一个 `await` 之前，同步读取 `useSessionStore().context` 的快照。`useSessionStore()` 只在 `send` 函数体内调用，不在模块顶层求值：互动方的 `jobs/**` 也导入 `agent/store.ts`，顶层调用会在模块初始化时形成循环；不为此新增抽象。"
  },
  {
    "oldText": "`empty` 触发空态，并提供 `/jobs` 入口",
    "newText": "`empty` 触发“暂无作业”空态；用 `jobFixtures` 覆盖为只含非进行中作业时，触发“暂无进行中的作业”空态（如果覆盖项只能追加、不能替换，这个子用例 blocked 并回报生产方）；两种空态都提供 `/jobs` 入口"
  },
  {
    "oldText": "原 run 的 chip 不变；之后的全局发送显示“全局”。端到端部分 blocked_by H-1/H-3/H-4",
    "newText": "原 run 的 chip 不变。之后等原 `long` run 出现唯一终态、输入栏运行中指示消失（运行中禁止再发，所以须显式等待，不用固定延时），再做全局发送：新 run 显示“全局”，且不带 `jobContext`。H-1 的 mock 会把 payload 上下文原样写进事件，所以新 run 没有上下文，就证明 payload 没有沿用旧上下文；payload 中没有该键由单元部分直接断言。端到端部分 blocked_by H-1/H-3/H-4"
  },
  {
    "oldText": "| S1-ctx | agent 上下文：store、chip、`runsFor`、选择器 | S0 + H-1、H-4 |",
    "newText": "| S1-ctx | agent 上下文：store、chip、`runsFor`、选择器 | S0 + H-1、H-4；chip 另外需要 H-2 中的 `StageLabel` 导出（不需要等共享列表缓存） |"
  },
  {
    "oldText": "| S1-track | `JobTrack` | S0 + H-2、H-6 | AC-003-7 组件部分、AC-003-8、AC-003-9、AC-003-6 和 AC-002-6 回归 | 可以独立开启；H-2 共享缓存未交接时保持 blocked |",
    "newText": "| S1-track | `JobTrack` | S0 + H-2（含 `JobTypeLabel`、`JobStatusBadge`）、H-3 的路由定义与注册切片（不含页面功能）、H-6 | AC-003-7 组件部分、AC-003-8、AC-003-9、AC-003-6 和 AC-002-6 回归 | 可以独立开启；H-2 共享缓存、`JobStatusBadge` 或 H-3 路由切片任一未交接时保持 blocked |"
  },
  {
    "oldText": "| S1-intake | AppShell slot、令牌、AgentDrawer 避让 | S0 + H-4、H-5 | AC-008-2 新令牌、AC-002-6 双抽屉回归 | 可以独立开启 |",
    "newText": "| S1-intake | AppShell slot、令牌、AgentDrawer 避让 | S0 + H-4、H-5 | AC-008-2 新令牌、AC-002-6 双抽屉回归 | 从依赖上看可以独立开启；但它和 S1-ctx 都要写 `AgentDrawer.vue`，Tasks 按文件唯一写入者串行（先做 S1-ctx 的选择器，再做 S1-intake 的避让），所以实际排期会继承 S1-ctx 的交接前置 |"
  }
]
```