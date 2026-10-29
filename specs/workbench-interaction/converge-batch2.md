# Feature: workbench-interaction Converge 报告 — 第二批 T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24（converge-batch2.md）

> **性质**：AGENTS §2 第 9 步 Converge 的**批次报告**：只读对比本批真实代码与 spec / plan / tasks。**不是** Review、不是审核结论、不是 Gate 2、不是 Handoff；不勾选 checklist，不改 spec。
> **阶段记录（脱敏）**：Converge / 状态记账 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18625-c9a1-76a3-aa8d-fefefec99096`）。本轮协调器对 `claude-bridge/claude-opus-5-5` 的最小真实调用 exit 1，失败类别 = **provider / invocation error（未确认为 quota）**；同模型官方通道最小调用 exit 0，正式任务也由官方通道完成。按 AGENTS §6 规则 2 只换通道、不换模型，未改 provider / key / 路由 / 全局配置。派工人 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。
> **写入范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-converge-batch2`（branch `docs/workbench-interaction-batch2-converge`，固定起点 `27e59e610e2ab8c14e7c3db554609e52e40f5f76`，起始 clean）；只写 `specs/workbench-interaction/{plan,tasks,analyze,implementation-log,interface-handoff,converge-batch2}.md` 与 `specs/README.md` 中本 feature 的状态行和本 feature 的跨 feature 行。未改代码 / 测试 / fixture / 生成器 / spec / checklist / 已有 Review 原件 / 首批 Converge 报告 / 权威 docs / 其他 feature / 根 HANDOFF；未 commit / push / PR / merge；未启动子 agent / 服务 / 安装；**未运行任何产品测试**。下文测试数字全部由实施者执行，本会话没有重跑。只读核对脚本放在协调器独占临时目录：`C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/converge-fixture-check.py`。它不是项目产物，本会话也不清理。
> **日期**：2026-10-29（+04:00）。

## 0. 固定输入

| 项 | 值 |
|---|---|
| `implementation_base_sha` | `43b6d79681a49562f41751368b2ae00c24062f56`（v1 Handoff，不变） |
| `upstream_start_sha` | `90187f7d8907316e554d2441d846827468c5371f`（本批仍 pin；main 的后续移动见 §6） |
| 有效 Checklist | **R8.1**，原件提交 `34d339eb1705310927f06d95aaf64bfc9bf4a5c3`。本树 `checklist.md` 的 `git hash-object` = `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`，与原件 blob 相同，只读未改；26 / 26 ☑，B-12 已关闭，另有 1 项 P3（S-37）。R7 `9acf3de` 是首批和 r6 设计的历史有效轮次，R8 `7b91a2c` 未通过，两者都不再作为本批有效 Checklist |
| 本批代码 diff | `34d339e..27e59e6 -- frontend`：6 个提交、25 个文件、+1333 / −903；`git diff --stat 34d339e..27e59e6 -- . ':!frontend'` 为空 |
| 逐任务提交 | T-A09b `75a115975b50d8078f159f2e41ce5c401318f0b7` → T-A10 `1841029f5a948b53ef21cbc54967556dc04e0815` → T-A22 `cc59e946df2d08178b03e3b37928ab34517067d7` → T-A22b `b38cf43f602390d7645cc84514d0da9860a7e0b7` → T-A23 `ebce4c85b1422a62b883117f75459a1fdee81b80` → T-A24 `27e59e610e2ab8c14e7c3db554609e52e40f5f76` |
| 生产方集成树 | `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`，HEAD = `27e59e6`（只读 `rev-parse` 核验，clean；集成人 ff-only 合入）。只作旁证，不是 ④ |
| v2 消费方集成 | 未取得（本会话不写、不代登记；v2 树未被写入） |

**本轮开始时重新读取**（不依赖会话记忆）：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`、`docs/interaction.md` §3.2、`docs/designUI.md`（§2.4 状态与来源语义、§6 :214 自制组件登记）、冻结 spec.md（v1.1，46 AC）、plan.md、tasks.md（页首、§0.0、§1、§2a、T-A07～T-A24、§5～§7）、checklist.md 的 R8.1 节（只读）、analyze.md（R10）、implementation-log.md、interface-handoff.md、`converge-batch-a09a.md`、`review-batch-a09a.md`（只读）、`specs/README.md`。实施者两份脱敏回报（`astra-state-result.md`、`astra-ui-result.md`）只作为结果来源，不能代替代码核对。

## 1. diff 事实与所有权

- 逐提交 `git show --name-only` 的结果与 tasks 修改范围一致：
  - T-A09b：只改 `fixtures/jobs/{job-detail,deliverable}.json` 和 `tests/unit/jobs/fixtures.spec.ts`。
  - T-A10：改 `contracts/{client.ts,methods.ts,mock/index.ts,real/index.ts}`，新建 `mock/job-state.ts`；生成物 `contracts/{CONTRACT.md,schema.json}` 由生成器重新生成；新建 `tests/unit/jobs/{job-state-read,real-stubs}.spec.ts`。本任务**没有**改任何 fixture 或 `fixtures.spec.ts`。
  - T-A22：新建 `jobs/routes.ts` 和 `jobs/pages/{JobListPage,JobDetailPage}.vue` 骨架；`main.ts` 只加一行 import 和一行挂载前的 `registerJobRoutes(router, pinia)`；新建 `routes.spec.ts`。
  - T-A22b：新建 `jobs/stores/session.ts`，改 `routes.ts`，新建 `session-context.spec.ts`。
  - T-A23：新建三个徽标 SFC 和 `tests/component/jobs/badges.spec.ts`。
  - T-A24：新建 `jobs/diff.ts` 和 `diff.spec.ts`。
- **零差异**（`git diff --stat 34d339e..27e59e6 -- <路径>` 为空）：
  - 前端壳与共享代码：`frontend/src/{app,shared,agent,workbench}/**`。
  - 工具、依赖与配置：`frontend/scripts/**`、`package.json`、`pnpm-lock.yaml`、`vitest.config.ts`、`playwright.config.ts`。
  - 契约与 fixture：`contracts/types.ts`（schema 本批未改）、`fixtures/jobs/{jobs,interventions,uploads}.json`、v1 顶层 `fixtures/*.json`、`mock/agent/*`。
  - 测试：三份既有契约测试 `tests/unit/{contracts,contract-doc,mock}.spec.ts`、`frontend/e2e/**`。
  - 非前端：所有非 `frontend` 路径，包括 `specs/**`、`docs/**`、`AGENTS.md`、`HANDOFF.md`。
- T-A09b fixture 校正经只读脚本对比 `34d339e` 与 `27e59e6`：
  - `jobs.json` 完全不变。
  - plan 样例表中阶段态为 `not_started` 的 (作业, 阶段) 恰好 12 个：j-cancelled 四个阶段，j-collect 的 process / analyze / deliver，j-process 的 analyze / deliver，j-failed / j-human / j-running 的 deliver。校正后 12 个全部为空，残留非空字段为 0。
  - 已开始阶段的工作区与 `34d339e` 逐一相等，被改动的数量为 0。
  - `previews` 只有 j-cancelled 变为 `{}`；`reconciliations` 只有 j-collect、j-cancelled 变为 `[]`；其余作业仍是 2 / 2。
  - done 阶段的上游 draft 产物保持不变（R-B 残留，见 §4）。

## 2. 逐任务核对（完成标准 → 代码证据 → 命令）

- **命令结果**列：由实施者在独立实施树执行，本会话没有重跑（openai/gpt-6-astra，新会话，未回退）。
- **标题存在**列：本会话读过测试源，确认 tasks 命令里的 `-t` 标题存在并能匹配；用例数与源码中的 `test` / `test.each` 展开数逐一对得上。

| 任务 | 固定 commit | 完成标准 → 代码证据 | 标题存在 | 命令结果（实施者执行） | 判定 |
|---|---|---|---|---|---|
| T-A09b | `75a1159` | ① 12 个空工作区（四种形态），j-cancelled `previews={}`，j-collect / j-cancelled `reconciliations=[]`；新增顶层用例 `WI not-started seeds`，期望值来自 spec 内手写的 `expected` 状态表，不从 fixture 推导。② 三处收窄：逐作业内容断言按阶段态分段执行；deliverable 全作业循环跳过 deliver 未开始的作业；final-only 中 deliver 未开始者断言 `deliverable=null` / `finalSnapshot=null`。五个既有顶层标题和 S-18 / 介入锚 / 真实 schema 反例未删、未放宽。③ 工程门 | ✓（1 + 五个既有标题） | 命令 1：1 pass；命令 2：整文件 23 pass；命令 3：typecheck / lint 通过 | 满足 |
| T-A10 | `1841029` | **共享状态与事务**：`job-state.ts` 持有模块级唯一 `state`；`createMockDataClient()` 每次读 scenario 和 `readJobFixtures()` 各一次，用来重建状态；单一 `commit(mutator)` 依次做 `structuredClone` → `JobStateSchema.parse` → 整体替换，`JobStateSchema` 只组合既有边界 schema，不加跨字段 guard。<br>**三个读方法**：`listJobs` 先过滤，再按 `Date.parse(updatedAt)` 倒序，最后经 `JobListItemSchema` 边界去掉多余字段；`getJob` 只对 empty 场景的预置 id 返回 null，未知 id 返回 not_found；`getStageWorkspace` 原样返回状态内容，缺失时返回 `emptyWorkspace(stage)`，不按阶段态过滤。<br>**场景与边界**：error 场景下，已知目标读失败返回 adapter_error；slow 场景每次延迟 1500 ms；返回值都是副本。`client.ts`、`methods.ts`（`dataMethods` 增三项，方法语义共 15 条）、`real/index.ts` 增三个 NotImplementedError 桩。<br>**测试覆盖**：标准 1～4 依次对应 `WI listJobs` / `WI scenarios read` / `WI slow` / `real-stubs`；标准 5 为 `WI not-started seeds read` 12 例，并附非空正向样例（S-37，见 §4）；标准 6 为生成物和工程门 | ✓（`WI listJobs` 2、`WI scenarios read` 33、`WI slow` 3、`real-stubs` 1+13、`WI not-started seeds` 1） | 2 / 33 / 3 / 14 / 1 pass；`contract --check` = 15 methods / 10 events / 2 artifacts 一致，typecheck / lint 通过。**失败留痕**：场景组首跑 23 pass / 10 fail，原因是新测试的嵌套匹配器没有容纳 `message` 字段；只改新测试匹配器后 33 pass，生产代码和既有测试都没有放宽 | 满足 |
| T-A22 | `cc59e94` | `jobRoutes` 两条记录：`jobs`（`/jobs`）和 `job-detail`（`/jobs/:id/:stage?`），meta 为 `{title, en, navId:'jobs'}`；`registerJobRoutes(router, pinia)` 只调用 `addRoute`；`main.ts` 在 `app.use(pinia).use(router).mount` 前调用它；两页是不读数据的骨架。S-32：本提交对暂未使用的 `pinia` 用行内 `eslint-disable-next-line` 处理，而不是改名为 `_pinia`，签名没变，T-A22b 随即撤销该注释。`app/router.ts` 零差异 | ✓（`WI routes` 6+1、`WI register` 2） | 7 / 2 pass；typecheck / lint 通过 | 满足 |
| T-A22b | `b38cf43` | `useSessionStore` 是 setup store，私有 `ref`；`context` 为 `computed`，返回 `readonly(...)`，类型层和字段层都是只读；唯一的额外成员是 `bindRouter(router: Router): void`，只注册一次 `afterEach`，用 `StageSchema.safeParse` 判断 stage，`job-detail` 且 stage 合法时为 `{jobId, stage}`，其余情况为 null。<br>`registerJobRoutes` 在 addRoute 之后调用 `useSessionStore(pinia).bindRouter(router)`。`session.ts` 只导入 vue / pinia / vue-router 类型和契约，不导入 `routes.ts` / `agent/**`；没有顶层 useStore，也没有 WeakMap / 注册表 / provide。<br>测试只用真实 memory-history router + `registerJobRoutes` + 真实 Pinia 导航；`@ts-expect-error` 放在不执行的函数体内 | ✓（enter 1+3、leave 3、readonly 1） | 4 / 3 / 1 pass；typecheck / lint 通过；A22b 后 `routes.spec.ts` 整文件 9 pass | 满足 |
| T-A23 | `ebce4c8` | 三个自制 SFC 的 props：`JobStatusBadge{status: JobStatus}`、`ArtifactStatusBadge{status: ArtifactStatus \| UploadStatus}`（上传状态复用同一组件，两组枚举没有重叠值）、`SourceBadge{origin: Origin; source: Source}`。<br>文案和图标只来自 `JobStatusLabel` / `ArtifactStatusLabel` / `UploadStatusLabel` / `OriginLabel` / `SourceLabel`；derived 显示“内部生成”，并用 `· {SourceLabel}` 作次文案。<br>不导入 `shared/components/Badge.vue`，只用 `var(--fai-*)` 令牌，没有新色值或玻璃类。测试去掉 class / style 后仍能读出文案，9 / 4 / 3 个可见标签互不相同 | ✓（`WI status badges` 9+4+3+1+1、`WI source badge` 4+4+1） | 18 / 9 pass；`check --only colors` / `glass`、typecheck / lint 通过。**失败留痕**：首跑 16 fail / 2 pass，原因是新测试选择器把根 `<span>` 算进了索引；只修新测试选择器后全部通过 | 满足 |
| T-A24 | `27e59e6` | `diffLines(before, after): LineDiffResult`；按 `'\n'` 切行，空串算 0 行；任一侧超过 2000 行时，在分配 LCS 表之前直接返回 `{kind:'summary', beforeLineCount, afterLineCount}`；否则返回 `{kind:'lines', lines: {kind:'equal'\|'add'\|'remove', text}[]}`（S-36 的具名判别已采纳）。<br>不引第三方库，`package.json` / 锁文件零差异；期望值手写，覆盖 2000 / 2001 两个边界和尾随换行，不按耗时断言 | ✓（`WI lcs` 6、`WI limit` 1+5+1） | 6 / 7 pass；typecheck / lint 通过 | 满足 |

**批次回归**（实施者执行、本会话未重跑）：

| 时点 | 结果 |
|---|---|
| A09b + A10 段末 | 全量 `test:unit` 23 文件 776 pass / 0 fail |
| 本批末轮 | 全量 `test:unit` **27 文件 833 pass / 0 fail**；`check` 六守卫（generated / colors / glass / updown / grid / network）全过；`contract --check` = 15 methods / 10 events / 2 artifacts；typecheck、lint（0 warning）通过；各提交 `git diff --check` 通过 |
| 既有 E2E | `test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` 24 pass / 0 fail：先确认 `127.0.0.1:4173` 空闲，Playwright 自管 webServer，结束后端口再次空闲，未下载浏览器 |

本批没有新增 E2E，tasks 中本批命令也不含 E2E。全量 `pnpm -C frontend test` 和全部 E2E 属 T-G09 / T-H04，后续仍须执行。

**结论（本批）**：6 / 6 任务的完成标准在代码层都有对应实现；21 条原定命令的标题都存在，实施者执行结果全部通过；两次新增测试失败都只修了新测试本身，属于正常任务结果，不能作为回退或降级的理由。**没有发现需要新增修复任务的缺口**。按 AGENTS §2 第 9 步，本批范围记为“**已收口（待本批独立代码 Review）**”。这些任务对多数 AC 只是**部分前置**。唯一例外是 T-A23，它对 AC-001-5 是“最终（组件部分）”，但人工部分 M-01 仍归 T-G10，所以本批仍不构成任何 AC 的最终验收。

## 3. 实施中的最小接口定形：是否需求变更

| 实施事实 | 原 plan / tasks 文本 | 判定 | 同步位置 |
|---|---|---|---|
| `DataClient.listJobs(filter?: {status?: JobStatus; type?: JobType; title?: string})`；契约参数为 strict 对象，未知键返回 validation_error；status / type 精确匹配；`title` 区分大小写做子串匹配，空串不限制；省略 filter 或传 `{}` 时返回全列表 | plan §2.4 “按状态 / 类型与标题子串组合筛选，缺省 updatedAt 倒序，清空筛选恢复全列表”；T-A10 同 | 精度：明确字段名和匹配口径，行为不变 | plan §2.4 `listJobs` 句；T-A10 修改范围【r6.5】 |
| `getJob(jobId)` / `getStageWorkspace(jobId, stage)` 的位置参数；`jobId` 必须非空；未知锚在任何场景都先返回 not_found，error 场景只对已知目标返回 adapter_error | S-13；T-A10 标准 2（未知 id 在 normal / empty 下返回 not_found；error 时三个读方法返回 adapter_error）；plan “未知锚返回 not_found” | 精度：明确 error 与未知锚的先后顺序；已写进 `methods.ts` 描述和 CONTRACT.md，可能的读法差异作为观察项交给 Review（§5 O-B2-2） | T-A10 修改范围【r6.5】 |
| `jobs/routes.ts` 导出 `jobRoutes: RouteRecordRaw[]`（两条）与 `registerJobRoutes(router: Router, pinia: Pinia): void` | plan §2.1 “导出两条记录”，未写变量名 | 精度：写明导出名 | plan §2.1；T-A22 修改范围【r6.5】；interface-handoff §3 |
| `useSessionStore()`：`context` 为 getter，返回深只读对象，字段也不可写；`bindRouter(router: Router): void` 只注册 `afterEach` | plan §2.1 / §2.3【r6.3】已有 getter + `bindRouter` | 精度：确认“只读”覆盖到字段层；机制不变 | interface-handoff §3（H-4 行）；T-A22b 修改范围【r6.5】 |
| `diffLines(before, after): LineDiffResult`；`LineDiffResult = {kind:'lines', lines: DiffLine[]} \| {kind:'summary', beforeLineCount, afterLineCount}`；`DiffLine = {kind:'equal'\|'add'\|'remove', text}` | plan §2.2 / §6 “LCS、上限 2000、超出给变更摘要”；T-A24【r6.3】边界 + S-36 具名判别提示 | 精度：写明返回结构和字段名 | plan §2.2 工具行；T-A24 修改范围【r6.5】 |
| 三个徽标的 props（见 §2 T-A23） | plan §2.2 徽标体系；interface-handoff §3 已登记 `JobStatusBadge{status}` | 一致，无须同步 | — |

**判定**：上表都是既有需求内的接口名和类型精度。方法集只按 plan 已列的方法逐个接入，没有新增方法；动作矩阵、九场景、样例表、迁移表、定稿语义、46 AC，以及任务编号 / 依赖 / 预估 / 完成标准 / 命令都没有变。**不是需求变更**，不需要回 Clarify / Gate 1。同步文字统一标注为【r6.5 精度（Converge batch2 登记）】，只写字段和导出名，不复制实现算法。

## 4. P3 与精度项状态（只记事实，不冒称关闭）

| 项 | 本批事实 | 状态 |
|---|---|---|
| R-B（`review-batch-a09a.md`） | **已校正**：12 个未开始种子置空并由真实 `getStageWorkspace` 读回（T-A09b + T-A10 标准 5）。**仍残留**：done 阶段的上游产物仍是 `status=draft`（例如 j-delivered 上游三个产物）。产物状态和阶段态是两个独立维度，本批没有把 draft 自动升为 confirmed，因为那等于替人审批 | **部分落实、未关**（残留留给 T-A20 / R-A 定案时核对；待本批 Review） |
| R-D | T-A10 的 `JobStateSchema` 只组合既有边界 schema，代码注释写明“no additional cross-field domain guards”；没有加五处跨字段 refine 或入口校验。各约束按 implementation-log §8 的口径，由后续写方法（T-A12 / A13 / A14 / A17 / A18 / A20）在构造时保持 | 口径不变、**未修**（没有引入新 guard） |
| S-37（Checklist R8.1） | `job-state-read.spec.ts` 的 `WI not-started seeds read` 用例除 12 个空态外，还断言了非空正向样例：j-collect collect 等于原样例且有 2 条投放；j-deliver deliver 等于原样例，六类块顺序为 conclusion / chart / table / quote / verification / note。另外 `WI scenarios read` 断言 j-deliver 四个阶段都等于原样例。**断言已落实**；tasks 标准 5 没有改字（标准是下限） | 实施侧已落实 |
| S-36 | `LineDiffResult` 已有具名 `kind` 判别 | 已采纳（实施提示，不是标准） |
| R-A / R-C / R-E / R-F | 本批不涉及。R-C 的契约文档前瞻文字仍写“新增作业方法”，当前 `methodSemantics` 共 15 条（v1 12 + 本批 3 个读方法），其余写方法未接入 | **未处理**，未经 Walter 风险接受；R-C 仍待 T-G06 收口复核 |

## 5. 给本批独立 Review 的观察项（不是缺口，没有新增任务，由 A 判定是否算 P3）

- **O-B2-1**（状态共享时机）：读方法每次都读模块级当前状态，所以旧 client 也会看到新建 client 重建后的状态；v1 十个方法仍沿用各自工厂捕获的 scenario。测试已显式记录这一点。这与 S-27 / plan §2.4 “模块级唯一共享会话状态”一致，请 Review 确认这正是设计意图。
- **O-B2-2**（error 场景下的未知锚）：实现先查锚，再判断 error，所以 error 场景下未知 id 返回 not_found，已知目标才返回 adapter_error；`methods.ts` 描述写的是“独立于 error”。T-A10 标准 2 的原文是“error 时三个读方法都返回 adapter_error”，本报告按“已知目标”理解。
- **O-B2-3**（未初始化状态）：模块级 `state` 只在 `createMockDataClient()` 中初始化。T-A18 让 AgentClient 共用状态时，需要确认在 DataClient 创建之前不会被调用（T-A18 实施时核对，本批无调用方）。
- **O-B2-4**（徽标边色）：三个徽标统一用 `--fai-status-ok` 边框（与 shared `Badge.vue` 同一令牌），状态完全靠文案 + 图标区分，满足 designUI §2.4 “不得只靠颜色”和 AC-001-5 组件部分。是否要按状态改边色，属于视觉判断，留给 Review / T-G10 M-01，不新增要求。
- **O-B2-5**（S-32 处理方式）：T-A22 中间提交用行内 eslint-disable 处理暂未使用的 `pinia`，没有用 `_pinia`；签名不变，T-A22b 已撤销。
- **O-B2-6**（真实路由表断言只适用于当前基线）：`routes.spec.ts` 的 “adds exactly two records to the actual app router” 用例断言真实 `app/router.ts` 中**没有** `jobs` 记录，且注册后恰好增加 2 条。这在 pin 的 `90187f7` 上成立，但 main 已移动（§6），同步后该断言会失效。

## 6. 上游移动（只记录，不导入）

- **main `cf8e11b`**：相对 `90187f7` 只改了外部 `specs/README.md` 和 frontend-workbench 文档 / 截图证据；`git diff --stat 90187f7 cf8e11b -- frontend docs AGENTS.md backend design` 为空。
- **本轮新发现**：本地 `main` 和 `origin/main` 均已到 **`072bb12de3425e1b76357b5771e47f0609b32979`**（PR #11：frontend-workbench v2 S0，即 T-V2-01 / 02，经其授权阶段性合入 main，`cf8e11b` 是其祖先）。相对 `90187f7`，`frontend docs AGENTS.md backend design` 范围有 **12 个文件改动**，涉及：
  - 前端源码：`src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue}`、`src/pages/PlaceholderPage.vue`、`src/stores/app.ts`；
  - 测试：`e2e/{shell,agent}.spec.ts`、`tests/component/topbar.spec.ts`、`tests/unit/manual-acceptance.spec.ts`；
  - 设计文档：`design/ui/{README,UI_NAV}.md`。
- **与本 feature 的已知交点**（只读核对）：
  1. `nav.ts` 新增 `{id:'jobs', path:'/jobs', placeholderOwner:'workbench-interaction'}`，所以真实路由表已有名为 `jobs` 的壳占位。本 feature 的 `registerJobRoutes` 按 H-3 / plan §2.1 的既定口径做同名替换：`routes.spec.ts` 中的占位替换用例已覆盖这一点，但 O-B2-6 中的真实路由表用例在同步后会失败。
  2. v2 的 `e2e/shell.spec.ts` 断言 `/jobs` 是 owner = `workbench-interaction` 的占位页。v2 tasks 已写明这只是 S0 证据，H-3 集成后由 **T-V2-09#4** 迁移为集成态；但如果本 feature 集成树先同步该 main，这条既有 E2E 会因 `/jobs` 已被本 feature 骨架页替换而失败。
  3. 其余改动（`/research` 退出、`learning` 菜单、TopBar 投放入口）不触及本批文件。`main.ts`、`contracts/**`、`agent/**`、`shared/**`、脚本、依赖零差异。
- **处理**：本批与本报告继续 pin `90187f7`；生产方集成树 `27e59e6` 不含 `072bb12`。**不自动导入、不改测试、不新增任务**。按 tasks §7（“基线再变须重核”），集成人若要同步 `072bb12`，须先按该条重核 §0.0：修订 tasks 并重跑 Analyze，经 A 复核后，再派任务调整 T-A22 的真实路由表断言，并与 v2 所有者协调 T-V2-09#4 的迁移时点。本 feature 不代改 v2 的壳文件或测试。这是交给集成人 / Walter 的流程决策，本会话不代定。

## 7. AC 与 Converge 核对项

- **46 AC 最终验收：0 / 46**。T-A23 对 AC-001-5 是“组件部分最终”，其人工部分 M-01 归 T-G10，因此 AC-001-5 仍未最终验收；其余都只是“部分前置”。
- tasks §7 写后统一刷新核对（S-31）：本批没有领域写路径、没有 jobsStore；`commit` 没有生产调用方，**不适用**。从 T-A12 / T-A22a 起逐条写路径核对。
- tasks §7 实施期粒度：实施者没有回报任何任务超过 2 h，未触发拆分；B-12 已在 Tasks 阶段通过拆出 T-A09b 解决。
- tasks §7 外部阻塞：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍未解除，必须报“未收敛（外部阻塞）”。

## 8. H-x 交接状态（四项齐全才算“已交付”）

| 切片 | ① | ② | ③（**待本批独立代码 Review**，实施者执行） | ④ | 状态 |
|---|---|---|---|---|---|
| H-1 | `13a3373`（首批，未变） | R7 `9acf3de`（首批时有效，保留追溯） | 首批实施者 + A 亲跑（`af95b66`） | 未取得 | 待消费方集成（未交付） |
| H-2·标签 | `ebce4c8`（T-A23；祖先含 T-A01 `07ef7cc`） | R8.1 `34d339e` | `contract-labels.spec.ts -t "WI labels"` 10 pass（本批复跑）；`badges.spec.ts -t "WI status badges"` 18 pass | 未取得 | **待消费方集成（未交付）**：生产方 3 / 4，③ 待审核 |
| H-3·路由切片 | `cc59e94`（T-A22；`b38cf43` 后路由整文件仍 9 pass） | R8.1 `34d339e` | `routes.spec.ts`：`WI routes` 7、`WI register` 2 pass | 未取得 | **待消费方集成（未交付）**：生产方 3 / 4，③ 待审核；只是路由切片，页面是骨架 |
| H-4 | `b38cf43`（T-A22b） | R8.1 `34d339e` | `session-context.spec.ts`：`WI H-4 enter` 4、`leave same navigation` 3、`readonly` 1 pass | 未取得 | **待消费方集成（未交付）**：生产方 3 / 4，③ 待审核；公开设置方式 = 无 |
| H-2·列表 | 部分：T-A01 / T-A02 / T-A10；缺 T-A12、T-A22a | — | 无 `jobs-store.spec.ts` | 未取得 | 未交付 |
| H-6 | 部分：T-A07、T-A09、**T-A10 `1841029`**（真实读 API + `jobFixtures` 建状态时读一次）；缺 T-A11（有覆盖时只在内存 / 持久化）与 T-A21（收件箱种子） | — | 部分：`WI jobFixtures` 14（首批），`WI scenarios read` 33（本批）；`job-state-inbox.spec.ts` 尚不存在 | 未取得 | 未交付（读 API 完成 ≠ H-6 交付） |
| H-5 | 未实施（T-C01 / T-C01a） | — | 无 | 未取得 | 未交付 |
| 页面切片 | 未实施（B 组 / C 组） | — | 无 | 未取得 | 未交付 |

生产方集成树 `27e59e6` 只是旁证，**不能填作 ④**。④ 只能由 `integration/frontend-workbench-v2` 的所有者在真正集成后登记。

## 9. 结论

- **本批（T-A09b、T-A10、T-A22、T-A22b、T-A23、T-A24，共 6 项）**：已收口，**待本批独立代码 Review**；没有发现需要修代码或新增任务的缺口；最小接口定形只是精度，已同步到 plan / tasks / interface-handoff。
- **feature 整体**：**未收敛（尚未实施 + H 组外部阻塞）**。67 项中 16 项已实施：首批 10 项已完成并经批次 Review，本批 6 项待 Review。其余 **51 项未开始**：
  - A 组 12 项：T-A11～T-A21、T-A22a；
  - B 组 7 项、C 组 5 项、D 组 3 项、E 组 3 项、F 组 7 项；
  - G 组 10 项、H 组 4 项。

  46 AC 最终验收为 0。H 组仍 `blocked_by: frontend-workbench-v2`。
- **不是** Review 通过、不是 Gate 2、不是 Handoff；没有写 `review.md`；H-x 无一“已交付”。
- **需要报告的发现**：只有一项，即 §6 的上游移动（main `072bb12`）。它不是本批相对 pin 基线的缺口，是否同步、何时同步由集成人 / Walter 按 tasks §7 决定。

## 10. 下一步

1. **本批独立代码 Review**：由审核员 A 进行，须是新会话，且与实施异模型。模型按 AGENTS §6，首选 `claude-fable-5-1`，先试 bridge，不通再走 anthropic。只读输入：
   - 冻结 spec.md；
   - plan.md / tasks.md（含 r6.5 精度同步）；
   - 本报告和 analyze.md「Analyze R11」；
   - 固定代码 diff `34d339e..27e59e6 -- frontend`，逐提交清单见 §0 / §2。

   重点审查：
   - §3 的接口定形是否确实只是精度；
   - §4 R-B 残留、R-D 是否未加 guard；
   - §5 O-B2-1～6；
   - T-A09b 对首批断言是否只收窄、没有放宽；
   - H-4 是否只读、没有 setter；
   - T-A23 是否自制、未导入 shared Badge；
   - T-A24 的边界。

   A 可以亲跑本批 21 条命令；本报告中的测试结果都由实施者执行。
2. Review 后，按 DAG 派第三批。依赖已满足、可起步的任务：T-A11（依赖 T-A10）；T-A12 起的写方法依赖 T-A11。H-2·标签 / H-3 / H-4 的 ④ 由 v2 所有者集成后登记。
3. §6 的 main `072bb12` 同步决策由集成人 / Walter 作出，本 feature 不自动导入。
4. 本 worktree 的文档改动由集成人审阅后提交，本会话不 commit。
