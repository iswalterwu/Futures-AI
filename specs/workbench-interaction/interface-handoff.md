# Feature: workbench-interaction 生产方接口交接（interface-handoff.md）

> **性质**：本 feature 作为“生产方 / 互动方”，对 frontend-workbench v2（“壳方”）交接切片 H-1～H-6 与页面切片的**设计对拍与交付登记**。它不是 v2 的规格副本，也不是 v2 会话的接收结论；v2 的需求与消费要求以 v2 自己的 spec / plan / tasks 为准，本文件只引用编号并写本 feature 的落点。
> **当前状态（2026-10-28 恢复轮 r6）**：所有切片 **未交付**。没有实现代码、没有定向测试输出、没有集成 SHA；本文件中的接口名称是 r6 设计，须经 A 新会话定向复核（Checklist R7）后才可作为实施依据。对比 v2 的只读接口不代表对方会话已人工接收，**不宣称双向已签收**。
> **阶段记录（脱敏）**：作者 = claude-opus-5-5 via anthropic（Plan / Tasks / Analyze 角色；本窗口 `claude-bridge/claude-opus-5-5` 经协调器探活 exit 1，quota / rate / spend_limit 类，未重试；未改 provider / key / 全局配置）。

## 0. 固定参照

| 项 | 值 |
|---|---|
| 本 feature 规格分支 | `docs/workbench-interaction-resume-20261028`，起点 `8af343ff085c0f958068b6b50008a6985f51d170`（R6 暂停快照） |
| 实施基线 | `implementation_base_sha = 43b6d79681a49562f41751368b2ae00c24062f56`（PR #7 merge commit，已在 origin/main；v1 源交付 `eba5002`）。基线门已满足；实现分支未建立 |
| v2 只读参照 | `D:/2030/Futures-AI-interaction-v2-ref-ded7161` @ `ded716100381fcd2b4b5d3481f4f56e44c9869fd`：spec v2.1（Gate 1 已批准，52 AC）、plan §7.2（文件唯一写入者）/ §7.3（H-1～H-6）/ §7.13（分阶段依赖）、tasks v2 §1.2（交接登记）/ §5（开工闸门）；v2 A Checklist R2 产物 `f1f755bad8e4bab7577c415f4aea3d297c9d37a8`（审 `949a232`） |
| 本 feature 审核证据 | Checklist R6（26/26）已提交于 `8af343f`，**只覆盖 r5 设计**；r6 新增的接口精化须 R7 复核后生效 |

## 1. 交付登记（四项齐全才“已交付”）

四项 = ① 生产实现固定 commit；② 生产方已提交的有效 Checklist SHA / 轮次；③ 定向测试命令与输出摘要；④ 集成验证分支上的集成 SHA（由指定集成人登记）。设计对拍、任务完成、本地测试绿都不等于交付。

| 切片 | 提供任务（tasks §2a） | 定向测试（交付时执行） | ① commit | ② Checklist SHA | ③ 测试摘要 | ④ 集成 SHA | 状态 |
|---|---|---|---|---|---|---|---|
| H-1 | T-A02、T-A09、T-A09a | `agent-context-contract.spec.ts`；`contract-version.spec.ts -t "WI scenarios"` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-2·标签 | T-A01、T-A23 | `contract-labels.spec.ts -t "WI labels"`；`badges.spec.ts -t "WI status badges"` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-2·列表 | T-A01、T-A02、T-A10、T-A12、T-A22a | `jobs-store.spec.ts -t "WI H-2"` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-3·路由切片 | T-A22 | `routes.spec.ts` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| 页面切片 | T-B01、T-B02、T-B04、T-C01、T-C01a、T-C02、T-C03、T-C04 | `e2e/jobs/intake.spec.ts`；`detail-stage.spec.ts -g "WI AC-002-2"`；`job-list.spec.ts` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-4 | T-A22b | `session-context.spec.ts -t "WI H-4"` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-5 | T-C01、T-C01a | `intake.spec.ts -t "WI H-5"` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-6 | T-A07、T-A09、T-A10、T-A11、T-A21 | `contract-version.spec.ts -t "WI jobFixtures"`；`job-state-read.spec.ts -t "WI scenarios read"`；`job-state-inbox.spec.ts -t "WI inbox seed"` | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |

（测试文件均在 `frontend/tests/{unit,component}/jobs/` 或 `frontend/e2e/jobs/`；命令前缀 `pnpm -C frontend test:unit|test:e2e`。）

## 2. 逐项对拍（v2 要求 → r5 状态 → r6 落点）

“r5 状态”按已审 r5 plan / tasks 原文判断；“需求回流”判断是否改变本 feature 冻结 spec。

| v2 要求（plan §7.3 / tasks §1.2） | r5 状态 | r6 落点 | 需求回流 |
|---|---|---|---|
| H-1：`CONTRACT_VERSION='2.0.0'` | 已覆盖（T-A09） | 不变；**T-A09 单独不等于 H-1** | 否 |
| H-1：导出 `JobContext={jobId,stage}` | 已覆盖（T-A02） | 不变 | 否 |
| H-1：`SendMessage.jobContext?`、十类事件公共可选 `jobContext`、mock 把 payload 上下文原样写入该 run 全部事件、旧事件 / fixture 仍可解析 | 已覆盖，但全部在 T-A18（依赖 mock 状态层 A10～A17），H-1 须等 T-A18 | 拆为 **T-A09a**（只依赖 A02 / A09）；无上下文时事件不出现该键；T-A18 保留状态层关联（activeRunId / overlay）并复跑 H-1 测试 | 否（S-22 原拆法） |
| H-2·标签：`JobStatusLabel / StageLabel / StageStateLabel / JobTypeLabel`（文案 + 图标） | 已覆盖（T-A01，S-11 九张映射含 `JobTypeLabel`） | 不变 | 否 |
| H-2·标签：`JobStatusBadge` 组件 | 已覆盖（T-A23） | 公开接口登记见 §3 | 否 |
| H-2·列表：`listJobs` 返回含 `stages[4]{stage,state,pendingCount}` / `pendingCount` 的摘要、默认 updatedAt 倒序 | 已覆盖（T-A10；字段在 plan 写作“摘要”） | T-A02 固定 `JobListItem` 字段 | 否 |
| ① 只读未筛选列表缓存 + 读状态 / 错误 | **缺口**（plan §2.3 的 jobsStore 只写“当前作业、工作区视图缓存”） | T-A22a：`jobs` / `listStatus` / `listError` | 否（落实 plan §2.3 既有“写回执 / 通知后重读”） |
| ② 共享 ensure / load 与 refresh action | 缺口 | `ensureJobs()` / `refresh()` | 否 |
| ③ “进行中”判定（契约常量或 selector，登记进 CONTRACT.md） | 缺口 | T-A01：`ActiveJobStatusSchema` + `ACTIVE_JOB_STATUSES` = 去掉 delivered / cancelled 的 7 个状态；不另建 selector | 否（R-008 契约扩展、plan §1 “v2 契约字段需求由本 feature 写入”；不改任何 AC） |
| ④ 筛选不覆盖未筛选缓存 | 缺口（T-B02 写“stores/jobs.ts 的筛选参数”，未区分） | `applyFilter()` 结果存 `filteredJobs`（T-A22a / T-B02） | 否 |
| ⑤ 所有改变摘要的写回执 + agent 通知后刷新同一份缓存 | 部分（plan §2.3 有原则，无机制；本 feature 自己的待合并 / 重跑 / 改稿 e2e 同样需要） | tasks §1-9：写成功后只调用一次 `refresh()`；T-A22a `receiveAgentEvent` 对带 `jobContext` 的终态事件刷新，`main.ts` 订阅；T-C01 / T-C02 / T-C03 / T-G02 各有写后刷新定向测试 | 否 |
| ⑤ 随 H-2·列表交付一个可调用、会改变摘要的写 action（不能用 inbox / intake 冒充） | 缺口 | `useJobsStore().createJob(input)`（T-A22a 标准 3） | 否 |
| H-3：`jobs/routes.ts` 两条路由、`meta.navId='jobs'`、`main.ts` 挂载前 `addRoute`、同名替换壳占位 | 已覆盖（T-A22），但 T-A22 依赖 T-A10 且混有 store 骨架 | T-A22 只做路由切片（依赖改为 T-A01）；`registerJobRoutes(router, pinia)`；含占位的测试路由验证同名替换 | 否 |
| H-4：`sessionStore.context` 只读；进入详情 / 切阶段设置；离开 `job-detail` 同次导航内同步清空；不从 lastRun 推导；登记是否有公开设置方式 | 缺口（plan 只写“当前上下文”） | T-A22b：`afterEach` 守卫设置 / 清空；**无公开 setter**（壳 S1-ctx 因而条件依赖 H-3·路由切片，v2 tasks §1.2 已预设此分支） | 否 |
| H-5：`intakeStore.open(jobId?) / close / isOpen / jobId`，jobId 为打开时快照、提交用快照 | 部分（T-C01 只写“抽屉开关与当前草稿”） | T-C01 标准 4 | 否 |
| H-5：`IntakeDrawer` 根 `.glass-drawer`、填满壳容器、无 fixed / 遮罩 / `aria-modal` / 焦点锁；关闭不导航、不调 agent | 部分（plan 有“非模态、无遮罩、无焦点锁”） | T-C01a | 否 |
| H-5：写操作按 ⑤ 刷新 | 缺口 | T-C01（submit）、T-C02（confirm）、T-C03（assign / remove） | 否 |
| 页面切片：`/jobs` 列表、详情、IntakeDrawer 投放提交与归属 | 已覆盖（B / C 组），但待归属池位置未定 | T-C03：待归属池放在 IntakeDrawer 内，任何挂载点（含 v2 AppShell 的 `.intake-slot`，例如在工作台）都能完成归属 | 否（R-003 内的位置精化） |
| H-6：empty / error / slow 覆盖 `listJobs` | 已覆盖（T-A10 场景表） | T-A10 标准 2 明写 `listJobs` | 否 |
| H-6：`jobFixtures` 可整集合替换 | 部分（T-A09 只写“键为文件名、边界校验”） | T-A07 `jobs.json` 按场景集合分键；T-A09 整文件替换、每 client 状态建立时读一次；T-A10 缺工作区样例 → 空工作区；T-A11 有覆盖时只在内存 | 否 |
| H-6：至少一个进行中作业带未读待处理项 | 部分（T-G02 e2e 隐含需要，生成规则只写“状态迁移时”） | T-A21：状态建立时对 fixture 初始状态应用同一生成规则；样例为 job-running 的 j-human、job-conflict 的 j-conflict | 否 |

**结论**：全部缺口都是既有需求（spec R-001 / R-003 / R-005 / R-007 / R-008）与既有 plan 意图（§2.3 写后重读、§2.4 契约扩展）内的接口机制精度；**没有需要回流 Clarify / 重过 Gate 1 的需求变更**，不阻塞、不需要 Walter 改需求。

## 3. 公开接口清单（r6 设计；名称以交付 commit 为准，若有出入回到 Analyze 更新本表）

| 来源文件（本 feature 唯一写入） | 导出 / 成员 | 语义 |
|---|---|---|
| `frontend/src/contracts/types.ts` | `CONTRACT_VERSION`（`'2.0.0'`）、`JobContextSchema` / `JobContext`、`SendMessageSchema.jobContext?` | H-1 |
| `frontend/src/agent/events.ts` | 十类事件公共可选 `jobContext` | H-1；无上下文时不出现该键 |
| `frontend/src/contracts/types.ts` | `JobStatusLabel`、`StageLabel`、`StageStateLabel`、`JobTypeLabel`（及其余五张映射）：`{[值]: {text, icon}}` | H-2·标签；壳只消费，不建第二份映射 |
| `frontend/src/contracts/types.ts` | `ActiveJobStatusSchema`、`ACTIVE_JOB_STATUSES` | H-2 ③；= JobStatus − {delivered, cancelled} |
| `frontend/src/jobs/components/JobStatusBadge.vue` | props：`status: JobStatus`（只读 props，不读 store） | H-2·标签；文案 + 图标来自 `JobStatusLabel` |
| `frontend/src/jobs/stores/jobs.ts` | `useJobsStore()`：只读 `jobs: JobListItem[]`、`listStatus: 'idle'\|'loading'\|'ready'\|'error'`、`listError: ContractError \| null`；`ensureJobs()`、`refresh()`、`createJob(input)`；（本 feature 内部另有 `filteredJobs` / `applyFilter()` / `openJob()` / `receiveAgentEvent()`） | H-2·列表；进行中集合 = `jobs` 中 status ∈ `ACTIVE_JOB_STATUSES` |
| `frontend/src/jobs/routes.ts` | 两条路由记录（`jobs`、`job-detail`）；`registerJobRoutes(router, pinia)` | H-3（+ H-4 守卫）；`main.ts` 在挂载前调用 |
| `frontend/src/jobs/stores/session.ts` | `useSessionStore()`：只读 `context: JobContext \| null` | H-4；无公开 setter，只经导航改变 |
| `frontend/src/jobs/stores/intake.ts` | `useIntakeStore()`：`open(jobId?)`、`close()`、只读 `isOpen`、`jobId` | H-5；jobId 为打开时快照 |
| `frontend/src/jobs/stages/IntakeDrawer.vue` | 无必需 props；根元素 `.glass-drawer`，填满父容器 | H-5；v2 前由本 feature 两个页面挂载，v2 后由 AppShell `.intake-slot` 挂载并由 T-H01 移除页面级挂载 |
| `frontend/src/contracts/mock/index.ts` | `MockOverrides.jobFixtures`：键 = `fixtures/jobs` 文件名，值整体替换；`jobs` 按场景集合分键 | H-6；每个 client 状态建立时读取一次；切换覆盖值需新建 client（沿用 v1 测试在系统边界 spy 委托的做法） |
| `frontend/src/main.ts` | `registerJobRoutes(router, pinia)`；`agentClient.subscribe(useJobsStore(pinia).receiveAgentEvent)` | 本 feature 写入；壳不改 |

## 4. 不做的事（生产方边界）

- 不为壳兜底实现：不写 `app/**`、`workbench/**`、`agent/{store,AgentDock,AgentDrawer,CotTimeline}`；不提供“仅供测试”的 setter、窗口钩子或 `hasRoute` 兜底。
- 不加猜测性的竞态 / 安全防线（请求序号、去抖、单实例登记等，AGENTS §5.1）；不另建“进行中” selector（常量即契约）。
- 不改 `scripts/contract-build.mjs`（v2 plan §7.2 记为本 feature 所有，但本 feature 不需要修改它）、`check.mjs`、`package.json`。
- 本 feature 的 jobs 代码不导入 `agent/store.ts`（分析台追问经 `contracts/index.ts` 的 `agentClient.send({message, jobContext})`），因此不存在 v2 plan §7.7 所防范的初始化循环；壳的防范写法无害。

## 5. 待 v2 接收方确认 / 集成人处理（未签收，不代办）

1. `main.ts` 除 `addRoute` 外新增守卫注册与 jobsStore 订阅（本 feature 文件，壳不改），与 v2 plan §7.2 “只负责 addRoute 注册”的描述不同，需 v2 会话知悉。
2. H-4 无公开 setter → v2 T-V2-03 的条件依赖（H-3·路由切片）成立。
3. H-6 的角标样例在 job-running（j-human）/ job-conflict（j-conflict）场景，normal 场景不预置；其交付依赖 T-A21（链路较深）。是否把 H-6 拆成“场景 / 覆盖”与“角标样例”两批交接，须 v2 接收方同意，本 feature 不预设。
4. `jobFixtures` 的形状（`jobs` 按场景集合分键）与“每 client 读一次”语义；`failed` 计入进行中、`draft` 计入。
5. 待归属池位于 IntakeDrawer 内。
6. 合并注意（集成人）：`43b6d79` 不含 `specs/workbench-interaction/**`；main 的 `specs/README.md` 无本 feature 行，且仍有已完成的“D-018 → workbench-interaction 回 Clarify”待同步行（本分支已于 `c238bd8` / `8bd1b31` 完成），合并时保留本 feature 行并删除该已完成行；v2 参照分支 README 中对本 feature 的待同步行，在交付完成前保留。

## 6. 已登记的外部风险（不升级为本 feature 新硬阻塞）

- frontend-workbench v1 Handoff 新发现 H-01（图注断行）/ H-02（<980 顶部导航过高，960～979×900 模块区约 215 px）未经 Walter 处置；H-02 可能影响本 feature T-G07 / M-10 在 960 视口的截图观感（T-G07 只断言无横向溢出、关键控件可达），不改变本 feature 的 AC。
- v1 M-01～M-08 为 AI 截图，人工勾选未签字；11 项 P3 已接受为后续、未修复（含 R1-03：agent store 对未知 runId 硬断言）。本会话不代批。
