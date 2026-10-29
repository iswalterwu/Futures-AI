# Feature: workbench-interaction 代码 Review — 第二批 T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24（review-batch2.md）

> **性质**：AGENTS §2 第 10 步 Review 的**批次评审**，只审第二批 6 项。**不是**全 feature 最终 Review、**不是** Gate 2、**不是** Handoff；不勾 checklist、不改代码 / 测试 / fixture / spec / plan / tasks / 旧 Review / docs；不替作者修代码、不代 Walter 做风险接受、不代其他 feature 签收。结构参照 `templates/review.md`，Gate 2 记录不填。
> **审核员 A（脱敏）**：`claude-fable-5-1` **via anthropic**（官方通道；PI_SESSION_ID `01a18636-553d-77ae-afbd-b5a736447a7a`）。本轮协调器对 `claude-bridge/claude-fable-5-1` 的最小真实调用 exit 1，失败类别 = **provider / invocation error（未确认 quota）**；同模型官方通道最小 probe 与 R8 / R8.1 实际任务 exit 0，本会话直接走官方通道。只换通道、不换模型；未改 provider / key / 路由 / 全局配置；不因审核结果换模型。新会话、独立 worktree，与 Implement（`openai/gpt-6-astra`）异模型，与 Converge（`claude-opus-5-5`）隔离。
> **固定输入**：worktree `D:/2030/Futures-AI-interaction-review-batch2`，branch `review/workbench-interaction-batch2-code`，HEAD `858025d0b75f529e160b973ba5bda10848889228`（起始 clean）。受审代码 = `git diff 34d339eb1705310927f06d95aaf64bfc9bf4a5c3 27e59e610e2ab8c14e7c3db554609e52e40f5f76 -- frontend`（6 提交、25 文件、+1333 / −903），逐任务提交 T-A09b `75a1159` → T-A10 `1841029` → T-A22 `cc59e94` → T-A22b `b38cf43` → T-A23 `ebce4c8` → T-A24 `27e59e6`。文档精度同步 = `27e59e6..858025d`（7 个 specs 文件；`-- frontend` 零差异，本会话核对）。有效 Checklist R8.1 原件 `34d339e`，本树 `checklist.md` `git hash-object` = `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`（与原件 blob 相同，未改）。正式 base `43b6d79`，上游 pin `90187f7`（本会话核：`90187f7` 是 HEAD 祖先；`072bb12` **不是**）。
> **重新读取**（不依赖会话记忆）：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`、`docs/interaction.md` §3、`docs/designUI.md` §2.4 / §6、冻结 spec v1.1（46 AC）、plan.md（含 r6.5）、tasks.md（页首、§0.0、§1、§2a、T-A09b / T-A10 / T-A22 / T-A22a / T-A22b / T-A23 / T-A24 全部标准与命令）、checklist.md R8.1 节（只读）、analyze.md「Analyze R11」、implementation-log §8 / 批次条目、interface-handoff（含 batch2 落地核对与 §5-9）、`converge-batch2.md`、`review-batch-a09a.md` R-A～R-F。全部受审源码 / 测试 / 两份改动 fixture 真实阅读；fixture 校正用只读脚本独立复算（不引用 Converge 脚本）。
> **边界**：唯一改动文件 = 本文件。依赖安装与测试产物只落在本树 gitignore 目录（`frontend/node_modules/`、`frontend/test-results/`），锁文件未改；临时日志、只读探针与其 vitest 配置只写 `C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/review-b2-*`（不清理共享 tmp、不上传 session、不记凭证）。未 commit / push / PR / merge，未派生 agent，未写其他 worktree，未保留服务（E2E 结束后 4173 无 LISTEN）。
> **日期**：2026-10-29（+04:00）。

## 0. 判定

**本批通过**（0 P1 / 0 P2；**5 项 P3**，编号 R2-A～R2-E，见 §4）。6 / 6 任务的完成标准在代码层面真实成立；本会话亲跑全部 21 条任务命令，数字与实施者逐条相同；全量单测 / 六守卫 / `contract --check` / typecheck / lint / 既有 shell + agent E2E 全绿；文件所有权与 AGENTS §5 工程纪律未越界；R-D 未新增 guard；无测试故障开关或测试专用 setter。

**不改变的事实**：46 AC 最终验收仍 **0**（T-A23 只完成 AC-001-5 的组件半项，人工 M-01 归 T-G10；其余均“部分前置”）；feature 整体**未收敛**（16 / 67 已实施、51 未开始 + H 组 `blocked_by: frontend-workbench-v2`）；H-2·标签 / H-3·路由切片 / H-4 生产方 ①②③ 具备（③ 经本评审亲跑，**④ 未取得**），H-1 既有登记保留，H-2·列表（缺 T-A12 / T-A22a）、H-6（缺 T-A11 / T-A21）、H-5、页面切片未交付；本评审不代填 ④、不代 v2 签收。本评审**不是** Gate 2 / Handoff。

## 1. 独立亲跑证据（本会话执行；日志在上述独占目录）

| 命令 | 结果 | 日志 |
|---|---|---|
| `pnpm -C frontend install --frozen-lockfile` | exit 0（锁文件未改，`git status` clean） | `review-b2-install.log` |
| `pnpm -C frontend contract --check` | exit 0：`15 methods, 10 events, 2 artifacts match` | `review-b2-contract-check.log` |
| `pnpm -C frontend check`（六守卫） | exit 0：generated / colors（24/24 正样本、0 负命中）/ glass / updown / grid / network 全 passed；之后 `git status` 仍 clean ⇒ 生成物与源一致 | `review-b2-check.log` |
| `check --only colors` / `check --only glass`（T-A23 命令 3） | exit 0 / exit 0 | `review-b2-check-colors.log` / `-glass.log` |
| `pnpm -C frontend typecheck` / `lint` | exit 0 / exit 0（`--max-warnings 0`；最终树无 eslint-disable） | `review-b2-typecheck.log` / `review-b2-lint.log` |
| `pnpm -C frontend test:unit`（全量） | **27 files / 833 passed / 0 failed**（与实施者末轮一致） | `review-b2-unit.log` |
| 三份既有契约测试 `contracts / contract-doc / mock.spec.ts` | 3 files / 88 passed（v1 语义未回归） | `review-b2-v1-contract-tests.log` |
| 本批 21 条任务命令（16 条 `test:unit`，逐条带文件路径与 `-t`） | T-A09b：`WI not-started seeds` 1 / 整文件 23；T-A10：`WI listJobs` 2 / `WI scenarios read` 33 / `WI slow` 3 / `real-stubs` 14 / `WI not-started seeds` 1；T-A22：`WI routes` 7 / `WI register` 2；T-A22b：`WI H-4 enter` 4 / `leave same navigation` 3 / `readonly` 1；T-A23：`WI status badges` 18 / `WI source badge` 9；T-A24：`WI lcs` 6 / `WI limit` 7；工程门命令（typecheck / lint / contract / colors / glass）见上行。**全部 exit 0，用例数与实施者逐条相同** | `review-b2-task-titles.log` |
| H-2·标签旁证 `contract-labels.spec.ts -t "WI labels"` | 10 passed | 同上 |
| `pnpm -C frontend test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` | 先核 `127.0.0.1:4173` 无监听；Playwright 自管 webServer；**24 passed / 0 failed**（1.0 min）；结束后端口仅 TIME_WAIT、无 LISTEN；未下载浏览器、未动配置 | `review-b2-e2e.log` |
| 只读边界探针（独占目录内的 vitest 配置 + spec，经本树 node_modules 运行，**非产品测试**、不改受控代码 / 测试） | 见 §4 R2-B / R2-C 与 §3 T-A10 / T-A22b 行 | `review-b2-probe/probe.spec.ts`、`probe-results.log` |
| `git diff --check` / `git status` | 通过 / clean（写本文件前） | — |

**未跑项**：全量 `pnpm test`（含其余 7 份 E2E：breakpoints / modules / scenarios / smoke / theme / tokens / workbench）——本批无 UI 页面功能、tasks 本批命令不含 E2E，全量归 T-G09 / T-H04；未重装浏览器、未改全局配置。

## 2. diff 事实与所有权（本会话核对）

- `git diff --stat 34d339e 27e59e6 -- . ':!frontend'` 为空；`27e59e6..858025d -- frontend` 为空。
- 改动文件全部在 tasks 修改范围内：`contracts/{client,methods}.ts`、`contracts/mock/{index,job-state}.ts`、`contracts/real/index.ts`、生成物 `contracts/{CONTRACT.md,schema.json}`、`fixtures/jobs/{job-detail,deliverable}.json`、`jobs/{routes.ts,diff.ts}`、`jobs/pages/*`、`jobs/stores/session.ts`、`jobs/components/*Badge.vue`、`main.ts`（+2 行：import 与挂载前 `registerJobRoutes(router, pinia)`）、7 份 jobs 测试。
- **零差异**：`app/**`（含 `router.ts` / `nav.ts`）、`shared/**`（含 `Badge.vue`）、`agent/**`、`workbench/**`、`scripts/**`、`package.json` / `pnpm-lock.yaml`、`vitest.config.ts` / `playwright.config.ts`、`contracts/types.ts`、`fixtures/jobs/{jobs,interventions,uploads}.json`、v1 顶层 fixtures、三份既有契约测试、`e2e/**`、`docs/**`、`AGENTS.md`、spec / checklist。
- 无新增依赖；最终树无 `eslint-disable`；`structuredClone` 为 Web 标准 API（基线未用，但无需依赖）。

## 3. 逐任务核对（完成标准 → 真实代码证据 → 本会话结果）

| 任务 | 核对要点（真实读源 + 亲跑） | 结论 |
|---|---|---|
| **T-A09b** `75a1159` | 只读脚本按手写 plan 十行状态表复算：`not_started` 的 (作业, 阶段) 恰 12 个，校正后 **12 / 12 为规定空形态**（四种形态逐键相等）；已开始阶段工作区与 `34d339e` **逐一相等（改动 0）**；`job-detail.json` / `deliverable.json` 键集合不变；`previews` 只 j-cancelled → `{}`，`reconciliations` 只 j-collect / j-cancelled → `[]`；`jobs.json` / `interventions.json` / `uploads.json` 零 diff；i-seed-1～6 锚全部落在 running / done 阶段，校正后仍可达。`fixtures.spec.ts`：5 个 describe 标题逐字相同、test 13 → 14（只新增 `WI not-started seeds`）、`expect` 114 → 120（只增不减）；三处收窄均以 `expected` 手写表的阶段态作条件、未删 schema 负例 / S-18 反例 / 介入锚断言；`WI not-started seeds` 期望来自同一手写表与字面空形态，不从 fixture 推导。未写任何读侧过滤或 guard（schema / 生成物零 diff）。标准 1～3 ✓ | 满足 |
| **T-A10** `1841029` | `job-state.ts`：模块级唯一 `let state`；`initializeJobState(scenario, seeds)` 只由 `createMockDataClient()` 调用（先 `readScenario()` 再 `readJobFixtures()` 各一次；两者任一 validation_error 时在初始化之前抛出、当前状态不被替换——测试 10 组非法覆盖证实）。`commit(mutator)` = `structuredClone` → mutator → `JobStateSchema.parse` 整体替换（mutator 抛错 / 校验失败均不留部分修改，测试用真实 commit 证实；工作副本引用不被保留）。`JobStateSchema` 为 `strictObject` 只组合既有边界 schema（`JobSchema` / `JobDetailsSchema` / `DeliverableFixturesSchema` / `InterventionSchema` / `UploadFixturesSchema`），**无新增跨字段 guard**（探针：job.status / currentStage 错配可提交 = R-D ⑤ 按口径未封；final 三锚错配被既有 S-18 superRefine 拒绝 = R-D ③ 半覆盖）。读方法：`listJobs` 组合筛选（status / type 精确、title 大小写敏感子串、空串不限制、strict 拒未知键）+ `Date.parse` 倒序（含 +08:00 / Z 混合实例测试）+ `JobListItemSchema` 边界剥成十字段；`getJob` 仅 empty 预置 id 返回 null、未知 id not_found；`getStageWorkspace` 原样返回、缺样例给带阶段空集合、**不按阶段态过滤**（测试：把 j-deliver 的 stages 换成全 not_started 后 deliver 仍返回原样例）；所有读返回 `structuredClone` 副本（突变测试覆盖 list / job / workspace / revision / finalSnapshot）。场景：empty（初始化一次、commit 后新 id 可读）；error（已知目标三读方法 adapter_error、bootstrap / catalog 仍可用）；slow 1499 / 1500 假时钟；boot-error 不阻塞读；四 job-* 只用专用集合；九场景未知锚均 not_found；九场景 + 覆盖全程不触 localStorage。`client.ts` 三方法、`methods.ts` 三条语义、`real/index.ts` 三个具名 NotImplementedError（`real-stubs` 以 `satisfies` 保证键全覆盖）。生成物经 `check --only generated` + `contract --check` 双重一致。S-37 正向样例已断言（j-collect collect 两条投放、j-deliver 六类块顺序）。测试用真实工厂与真实 `commit`，期望手写，不复制生产算法。标准 1～6 ✓ | 满足（观察见 R2-A / R2-B / R2-E） |
| **T-A22** `cc59e94` | `jobRoutes` 两条具名记录（`jobs` `/jobs`、`job-detail` `/jobs/:id/:stage?`），meta `{title, en, navId:'jobs'}` 与 `app/router.ts` 的 `RouteMeta` 声明兼容；`registerJobRoutes` 只 `addRoute`（同名替换由 vue-router 语义保证，测试以占位 `jobs` 验证恰一条且指向本 feature 页）；`main.ts` 在 `app.use(pinia).use(router).mount` 之前调用；两页为明确“尚未实现 / 仅路由骨架”的静态 SFC，不读数据、不冒充交付；`app/router.ts` / `nav.ts` 零 diff。中间提交对暂未使用的 `pinia` 用行内 eslint-disable（签名不变），`b38cf43` 即撤销，最终树无残留。标准 1～3 ✓ | 满足（观察见 R2-D） |
| **T-A22b** `b38cf43` | `session.ts` 为 setup store：私有 `ref<JobContext|null>`，只返回 `context`（computed → `readonly()` 深只读）与 `bindRouter(router): void`；`bindRouter` 只注册一次 `afterEach`，目标判定在 store 内（`to.name === 'job-detail'` 且 `StageSchema.safeParse(to.params.stage)` 成功才置 `{jobId, stage}`，否则 null），不接受任何 `JobContext`，不是 setter；`registerJobRoutes` 在 addRoute 后 `useSessionStore(pinia).bindRouter(router)`（沿用 `main.ts` 既有 `useAgentStore(pinia)` 先于 `app.use(pinia)` 的写法）。无顶层 useStore / WeakMap / registry / provide；`session.ts` 只导入 vue / pinia / vue-router 类型与契约；无 navigation failure / 重复注册分支。探针：运行时对 `store.context.stage` 赋值触发 Vue readonly 警告且值不变；`$state` 为空；重复导航（failure type 16）仍维持同一上下文。测试只经真实 memory-history router + `registerJobRoutes` + 真实 Pinia 导航，`@ts-expect-error` 置于不执行函数体。标准 1～3 ✓ | 满足 |
| **T-A23** `ebce4c8` | 三个自制 SFC（`jobs/components/`），**不导入** `shared/components/Badge.vue`（grep 证实；该组件固定四文案无插槽，确无法承载契约文案）；文案 / 图标只来自 `JobStatusLabel` / `ArtifactStatusLabel` / `UploadStatusLabel` / `OriginLabel` / `SourceLabel`；`ArtifactStatusBadge` 以 `in ArtifactStatusLabel` 分流两组无重叠枚举；`SourceBadge` derived → “内部生成” + `· {SourceLabel}` 次文案，source → `SourceLabel`。样式只用 `var(--fai-*)` 令牌（`check --only colors` 24/24、glass 通过，无新色值 / 玻璃类）。测试逐枚举断言 DOM 文案与图标（9 / 4 / 3），剥 class / style 后文案仍可区分且各族集合唯一，prop 切换无残留。标准 1～3 ✓（AC-001-5 组件半项；人工 M-01 未做） | 满足（观察见 R2-C） |
| **T-A24** `27e59e6` | `diffLines(before, after): LineDiffResult`，`kind:'lines'|'summary'` 具名判别（S-36 采纳）；按 `'\n'` 切行、空串 0 行；任一侧 > 2000 在分配 LCS 表之前直接返回 `{beforeLineCount, afterLineCount}`；LCS 用后缀表（`Uint16Array`，2000 上限安全；2001² × 2B ≈ 8 MB）与确定性平局（先 remove）。测试期望全部手写：增删改序、空 / 相同 / 空行与空白、重复行非贪婪两例、无公共行、尾换行与 `\r`、2000 含边界、2001 × 5 组合摘要、尾换行成第 2001 行；无耗时断言；`package.json` / 锁零 diff。标准 1～3 ✓ | 满足 |

**测试真实性**：本批测试均驱动真实实现（真实 mock 工厂 / 真实 `commit` / 真实 router + Pinia / 真实 SFC 挂载 / 真实 diff），期望值来自手写表或字面量；两次首跑失败（A10 匹配器、A23 选择器）只改了新测试本身——本会话对照最终测试源与生产源，未见放宽生产逻辑或既有测试。

## 4. 发现（全部 P3；本批不阻断，不替作者修，均未经 Walter 风险接受）

| # | 严重度 | 位置 / 复现 | 说明 | 受影响 AC | 最小归属 |
|---|---|---|---|---|---|
| **R2-A** | P3（契约文档混入 mock 实现语义；关联首批 R-C） | `contracts/methods.ts:110-131` → `CONTRACT.md` `listJobs` / `getJob` / `getStageWorkspace` 描述 | 三条方法 description 写入“empty 初始化为空；error 返回 adapter_error；slow 每次调用延迟 1500ms”“读取当前共享会话状态并返回副本”“empty 的预置 normal 集合作业 id 返回 null”。v1 十二条描述均为实现中立（场景行为单列在 `jobScenarios`）；`CONTRACT.md` 是 real `api` 实现者的契约，这些句子让“共享会话状态 / 预置 normal 集合”成为契约义务，而它们只是 mock 口径。AC-008-1 的对拍仍一致，不阻断 | AC-008-4（文档质量） | 后续：接入写方法的任务沿用 v1 风格写描述；T-G06 收口时与 R-C 一并把 mock 场景句迁回 `jobScenarios` |
| **R2-B** | P3（未初始化模块状态的错误形态；= Converge O-B2-3，探针证实） | `mock/job-state.ts:37` `let state: JobState`；探针：未经 `createMockDataClient()` 直接 `getJobScenario()` → `TypeError`，`commit(() => {})` → 裸 `ZodError`（非 `{error:{code}}` 契约错误） | 本批无生产调用方（`contracts/index.ts` 在模块加载时先建 DataClient，再建 AgentClient），当前不可触发。T-A18 让 AgentClient 共用状态、T-A11 持久化入口若先于 DataClient 建立就会得到非契约错误。不建议本批加 guard（AGENTS §5.1），但应在 T-A18 / T-A11 的完成标准里写明“状态由 DataClient 工厂建立，AgentClient 不自行初始化”并以测试固定调用顺序 | AC-007-2 / AC-002-4（后续） | 后续：T-A18（实施提示 + 顺序断言），T-A11 同 |
| **R2-C** | P3（状态语义令牌误用；= Converge O-B2-4 的我方判定） | `jobs/components/{JobStatusBadge,ArtifactStatusBadge,SourceBadge}.vue` `<style>`：三者一律 `border: thin solid var(--fai-status-ok)`；探针：`status='failed'` 的徽标边框令牌仍为 `--fai-status-ok` | AC-001-5“不只靠颜色”已由文案 + 图标满足，但 plan §1 / §6 已登记“冲突用图标 + 文字（文字次 / 琥珀），点睛红只作图标 / 边”的二级色线索；shared `Badge.vue` 也按 state 映射 `--fai-status-{ok,warn,bad,sample}`。把 `failed` / `conflict` / `quarantined` 的边框标成 **ok** 令牌是语义反向，M-01 人工验收时可能被判为“状态徽视觉无差异 / 语义错位”。修正只需按状态映射既有令牌，不新增色值、不改 AC | AC-001-5（人工 M-01）、AC-003-6、AC-006-8（视觉部分） | 后续：T-G10 M-01 前由首个消费徽标的页面任务（T-B01 / T-C04 / T-F01）或 0.5 h 以内样式修订处理；不改契约、不加新令牌 |
| **R2-D** | P3（测试与 pin 基线事实耦合；= Converge O-B2-6 的我方判定，不是本批缺口） | `tests/unit/jobs/routes.spec.ts:56` `expect(before.some(route => route.name === 'jobs')).toBe(false)`，`:59` `toHaveLength(before.length + 2)` | 在 pin `90187f7` 上成立（本会话亲跑 ✓）。本会话核：`main` / `origin/main` = `072bb12`，其 `app/nav.ts:11` 已含 `{id:'jobs', path:'/jobs', placeholderOwner:'workbench-interaction'}`；同步后该用例必红（同名替换路径已由占位替换用例覆盖，功能不受影响）。同时 v2 `e2e/shell.spec.ts` 的 `/jobs` owner 占位断言在 H-3 集成后也已知红，由 v2 T-V2-09#4 迁移。两者都是**同步时的基线变化**，不是本批相对固定 diff 的错误；本评审不用 main 的新事实假称当前树测试失败 | AC-002-2 部分前置（后续同步） | 后续：集成人决定同步 `072bb12` 时，按 tasks §7 先重核 §0.0、重跑 Analyze，再派一条小任务把该用例改为“注册后名为 `jobs` 的记录恰一条且指向本 feature 页，基线其余记录全部保留”（两种基线下都成立）；并与 v2 所有者协调 T-V2-09#4 时点。本 feature 不代改壳测试 |
| **R2-E** | P3（同一 client 内新旧方法的场景行为来源不一致；= Converge O-B2-1 的我方判定） | `mock/index.ts:231-236` `readJobState` 用 `jobState.getJobScenario()`（模块状态）决定延迟与 error；v1 十方法用工厂闭包 `scenario`。测试 `jobFixtures is read once…` 末段：同一 `first` 实例 `bootstrap().scenario === 'normal'` 而 `listJobs()` 在后建 error client 后 rejects adapter_error | 与 S-27 / plan §2.4“模块级唯一共享会话状态、所有 DataClient 共用当前状态”一致，数据共享是设计意图；但“延迟 / error 行为也跟随最新建立者”是 S-27 未写明的推论，使单个 client 实例在 v1 与 v2 方法之间出现两套场景。生产只有一个 client（`contracts/index.ts`），不可观察；测试已显式记录。建议作为精度一句登记到 plan §2.4（“新增方法的场景延迟 / 错误行为随当前共享状态的 scenario”），不改代码 | AC-008-2（场景语义精度） | 后续：下一次 plan 精度修订一句登记；T-A18 接入 AgentClient 时沿用同一来源，避免第三套 |

**本批 bug**：无。**架构风险**：无新增（R2-B 为后续接线顺序约束；R2-E 为精度登记）。**测试缺口**：本批 21 条命令对标准 1:1 且亲跑通过；未见复写实现逻辑的测试；T-A10 对 `getStageWorkspace` 已含正向样例（S-37 落实）。**目标对齐**：与冻结 spec v1.1 / plan r6.5 / tasks 一致；D-020～D-024 内容未混入；AGENTS §5 纪律：无猜测性竞态 / failure 分支（§5.1）、入口校验一次（§5.2；读方法参数与返回在契约边界各 parse 一次，与 v1 `readFixture` 模式相同）、未提前抽象（§5.3：`readJobState` / `findJob` / `emptyWorkspace` 均有多处调用）、不引入新工具 / 依赖（§5.7）。

### 对 Converge §3「接口定形是否仅精度」的独立判断

| 实施事实 | 判定 |
|---|---|
| `listJobs(filter?: {status?, type?, title?})` strict、title 大小写敏感子串、空串不限制 | **精度**。spec AC-001-2 只要求“标题搜索生效、组合与清空可恢复”，未定大小写口径；mock 层的大小写敏感是可接受的最小实现，UI 层可自行归一。但该口径已随 R2-A 写进 CONTRACT.md 成为 real 实现义务——属 R2-A 的一部分，不是需求变更 |
| 未知锚在任何场景先 not_found、error 只对已知目标 adapter_error（O-B2-2） | **与 plan 一致、非缺口**：plan §2.4 场景表明写“查无 id 的行为独立保持 not_found”，T-A10 标准 2 的“error 时三个读方法都返回 adapter_error”在测试中以已知目标验证，两者不冲突 |
| `jobRoutes` / `registerJobRoutes(router, pinia)` 导出名与签名 | 精度（命名） |
| `context` 深只读、`bindRouter(router): void` | 精度（只读覆盖到字段层，探针证实运行时也只读）；机制与 r6.3 相同 |
| `diffLines` / `LineDiffResult` 结构 | 精度（S-36 提示采纳） |

结论：Converge §3 六项均为既有需求内的精度，**不是需求变更**；spec 46 AC 不变。

### 首批 P3 在本批的状态（只记事实）

- **R-B**：12 个未开始种子已置空并经真实 `getStageWorkspace` 读回（本会话脚本独立复算 12 / 12、已开始 0 改动）。**残留**：done 阶段上游产物仍 `status=draft`（本会话脚本列出 17 个，如 j-delivered 三个上游产物、j-deliver 三个上游产物）——产物状态与阶段态是独立维度，本批未代人审批，仍“部分落实、未关”。
- **R-D**：未新增任何 refine / 入口跨字段校验（探针证实 ⑤ 仍可提交）；口径“由写方法按构造保持”待 T-A12 / A13 / A14 / A17 / A18 / A20。
- **R-A / R-C / R-E / R-F**：本批不涉及、未处理（R-C 与本批 R2-A 同归 T-G06）。

## 5. H-x 交接与 feature 状态（本评审不代填）

| 切片 | 状态（本评审核对后） |
|---|---|
| H-2·标签 | ① `ebce4c8`（祖先含 T-A01 `07ef7cc`）✓；② R8.1 `34d339e` ✓；③ 本会话亲跑 `WI labels` 10 / `WI status badges` 18 ✓；**④ 未取得**（本会话核：`integration/frontend-workbench-v2` = `3f63273`，`ebce4c8` 非其祖先）→ **待消费方集成（未交付）** |
| H-3·路由切片 | ① `cc59e94` ✓；② `34d339e` ✓；③ 亲跑 `WI routes` 7 / `WI register` 2、整文件 9 ✓；④ 未取得（`cc59e94` 非 v2 集成树祖先）→ 待消费方集成（未交付）；页面为骨架、非页面切片 |
| H-4 | ① `b38cf43` ✓；② `34d339e` ✓；③ 亲跑 enter 4 / leave 3 / readonly 1 ✓；④ 未取得（`b38cf43` 非 v2 集成树祖先）；公开设置方式 = 无 → 待消费方集成（未交付） |
| H-1 | 首批登记保留（① `13a3373` ② R7 `9acf3de` ③ `af95b66` 亲跑）；④ 未取得（`13a3373` 非 v2 集成树祖先） |
| H-2·列表 / H-6 / H-5 / 页面切片 | 提供任务未齐（缺 T-A12 / T-A22a；T-A11 / T-A21；T-C01 / T-C01a；B / C 组）→ 未交付 |

生产方集成树 `27e59e6` 只是旁证，不能填作 ④。

feature：16 / 67 已实施（首批 10 已完成 + 本批 6 本评审通过）、51 未开始；46 AC 最终验收 **0**；H 组外部阻塞不变；**未收敛**。

## 6. 上游移动的边界判断（只记录，不导入）

- 本会话只读核：本地 `main` 与 `origin/main` = `072bb12`；`072bb12` 不在本树 HEAD 祖先中；本批与本评审仍按 pin `90187f7`。`072bb12:frontend/src/app/nav.ts` 已含 `jobs` 壳占位。
- 判定：**不是本批问题**，是**后续同步风险**（R2-D）。当前固定树上 `routes.spec.ts` 与 `e2e/shell.spec.ts` 均真实通过（本会话亲跑）。同步时点、`routes.spec` 真实路由表用例的改写、v2 `shell.spec` 占位断言的迁移（T-V2-09#4）由集成人 / Walter 与 v2 所有者决定；本会话未 merge、未改壳测试。

## 7. 下一步（建议，不替作者改）

1. 集成人确认本结论后原样提交本文件，更新 tasks 六条状态行与 `specs/README.md` 行（“待本批 Review”→“本批 Review 通过（`<本文件提交 SHA>`），不表示 AC 验收”），把 R2-A～R2-E 登记进 implementation-log §8 台账（均未经风险接受）。
2. 按 §6 DAG 派第三批：T-A11（依赖 T-A10）起；T-A12 起的写方法依赖 T-A11。派工时把 R2-B 的调用顺序约束带进 T-A11 / T-A18 实施提示。
3. R2-C 在首个消费徽标的页面任务或 T-G10 前以既有令牌映射修正；R2-A 与 R-C 同归 T-G06；R2-E 下次 plan 精度修订登记一句。
4. `072bb12` 同步与 R2-D 用例改写按 tasks §7 走（先重核 §0.0 / Analyze、经 A 复核再派任务）。
5. H-2·标签 / H-3 / H-4 / H-1 的 ④ 待 `integration/frontend-workbench-v2` 所有者登记。

## 验收证据（本批）

- 测试命令输出摘要：见 §1（全量单测 27 files / 833 passed / 0 failed；三份既有契约测试 88 passed；本批 21 条任务命令全部亲跑通过且用例数与实施者相同；`check` 六守卫 / `contract --check` 15 methods / typecheck / lint 过；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` 24 passed）。
- Converge 报告结论：`converge-batch2.md` 判本批“已收口、待独立 Review”；本评审核对其 §1 diff 事实、§2 逐任务证据、§3 精度判定成立；§5 O-B2-1～6 独立判定：O-B2-2 / O-B2-5 无发现，O-B2-1 → R2-E、O-B2-3 → R2-B、O-B2-4 → R2-C、O-B2-6 → R2-D（均 P3）。
- Gate 2 确认记录：**不适用**（本批不是全 feature Review / Handoff；Gate 2 待全 feature 最终 Review）。
