# Feature: workbench-interaction 代码 Review — 第三批 T-A11 / T-A12 / T-A13 / T-A22a（review-batch3.md）

> **性质**：AGENTS §2 第 10 步 Review 的**批次评审**，只审第三批 4 项。**不是**全 feature 最终 Review、**不是** Gate 2、**不是** Handoff；不勾 checklist、不改代码 / 测试 / fixture / spec / plan / tasks / 旧 Review / Converge / docs；不替作者修代码、不代 Walter 做风险接受（P3 均未经风险接受）、不代 v2 接收方签收。结构参照 `templates/review.md`，Gate 2 记录不填。
> **审核员 A（脱敏）**：`claude-fable-5-1` **via anthropic**（官方通道；`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`、PI_SESSION_ID `01a1872c-7882-7448-9b7d-17c75c6101cc`）。本轮协调器对 bridge / opus 的最小真实 probe 为 quota / rate / spend_limit 类失败，本窗口同通道不重复试；**fable 未单独探 bridge，不声称探过**；fable 官方最小调用与 R9 设计任务均 exit 0，本代码 Review 走官方通道。只换通道、不换模型；未改 provider / key / 路由 / 全局配置；不因测试结果换模型。新会话、独立 worktree，与 Implement（`openai/gpt-6-astra`）异模型，与 Converge（`claude-opus-5-5`）隔离。
> **固定输入**：worktree `D:/2030/Futures-AI-interaction-review-batch3`，branch `review/workbench-interaction-batch3-code`，HEAD `e14ad25d525d319fee85e2fc34e4ebb972e42150`（起始 `git status --short` 为空）。受审代码 = `git diff ab742f5801628b15324fc998f03959482fd31d9d 0032fc6b3e47ee6de27a03c2c229ef57ca9115cc -- frontend`（5 个前端提交、17 文件、+2318 / −26），逐提交 T-A11 `c7ebccb` → T-A12 `742d6aa` → A12 test-fix `0a2d1a5` → T-A13 `a5ad11c` → T-A22a `0032fc6`；区间内纯文档提交 `e4031fa`（r6.6.1）/ `1988463`（r6.6.2，父 `742d6aa`，`-- frontend` 零差异）。文档精度同步 `0032fc6..e14ad25`：7 个 specs 文件，`-- frontend` **零差异**（本会话核对）。有效 Checklist **R9** 原件 `ab742f5`，本树 `checklist.md` `git hash-object` = `74084c1337491a042c944096e1f290fe07aab324`（与原件 blob 相同，只读未改）。正式 base `43b6d79`（HEAD 祖先 ✓）、上游 pin `90187f7`（祖先 ✓）、main `072bb12` **不是**祖先（本会话核）。
> **重新读取**（不依赖会话记忆）：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`、`docs/interaction.md` §3 / §7、冻结 spec v1.1（46 AC；R-001 / R-003 / R-007 / R-008 / §4 持久化）、plan.md（含 r6.6 / r6.7：§2.3 / §2.4 写方法精度 / §3 持久化精度 / §4 / 动作矩阵 / 九场景表）、tasks.md（页首 batch3 / r6.6 / r6.6.1 / r6.6.2 块、§1、§2a、T-A11 / T-A12 / T-A13 / T-A22a 全部标准与命令、§7 S-31）、checklist.md R9 节（只读）、analyze.md R12.1 / R12.2 / R13、implementation-log §8 / §10、interface-handoff §1 / §3、`converge-batch3.md` 全文、`review-batch2.md` R2-A～R2-E、`review-batch-a09a.md` R-A～R-F。受审 17 个文件（源、测试、生成物变更段）全部真实阅读；关键链路另以只读探针独立复现（§4）。
> **边界**：唯一改动文件 = 本文件。依赖安装与测试产物只落在本树 gitignore 目录（`frontend/node_modules/`、`frontend/test-results/`），锁文件未改（`git status` clean）；临时日志、只读探针与其 vitest 配置只写 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/review-b3-*`（不清理共享 tmp、不上传 session、不记凭证）。未 commit / push / PR / merge，未派生 agent，未写其他 worktree，未保留服务（E2E 结束后 4173 无 LISTEN），未重装浏览器。
> **日期**：2026-10-29（+04:00）。

## 0. 判定

**本批通过**（0 P1 / 0 P2；**3 项 P3**，编号 R3-A～R3-C，见 §5；另 3 项不计入判定的观察 O-R3-1～3）。4 / 4 任务的完成标准在真实代码层成立；本会话亲跑全部 19 条任务命令，用例数与实施者逐条相同；全量单测 31 文件 951 / 0、六守卫、`contract --check` 24 / 10 / 2、typecheck、lint、既有 shell + agent E2E 24 / 0 全绿；文件所有权与 AGENTS §5 纪律未越界；r6.6.1 / r6.6.2 只增不改 / 只改 error 分支属实；无 `vi.mock` 内部模块、无 Window 测试钩子、无新 guard / 请求序号 / 总线。

**R9 交代的隐私核对项（本会话按真实 diff 与探针核）**：`fai.jobs.v1` 只含六键业务子集；Upload 键集 = strict `UploadSchema`（十项 + 既有可选 `quarantineReason`），`IntakeInputSchema` 不含 `quarantineReason`、用户经投放不能写入（篡改 → validation_error 有测试）；文本正文（探针用 `SECRET_BODY_*`、测试用 `PRIVATE_*`）在 submit / confirm / assign / remove 后均不出现在快照字符串；`mappingHistory` 条目 = `{uploadId, mapping, status, replacedAt}`，每条投放至多一条（二次 confirm 被拒）。**无原文持久化，隐私边界实质不变**。

**不改变的事实**：46 AC 最终验收仍 **0**（本批全部“部分前置”）；feature 整体**未收敛**（20 / 67 已实施 = 16 已完成 + 本批 4、47 未开始 + H 组 `blocked_by: frontend-workbench-v2`）；H-2·列表生产方 ①②③ 具备（③ 经本评审亲跑，**④ 未取得**），H-6 仍缺 T-A21，H-5 / 页面切片未做；A14+ / A17 只读门 / A18 Agent 状态 / A21 收件箱 / B–C 页面 / G04 横幅均未实现，本评审不因未来项缺失记本批 P2，也不冒称全部写管线（S-31）已交付。本评审**不是** Gate 2 / Handoff。

## 1. 独立亲跑证据（本会话执行；日志在上述独占目录）

| 命令 | 结果 | 日志 |
|---|---|---|
| `pnpm -C frontend install --frozen-lockfile` | exit 0（本树原无 `node_modules`；锁文件未改，`git status` clean） | `review-b3-install.log` |
| `pnpm -C frontend contract --check` | exit 0：`24 methods, 10 events, 2 artifacts match` | `review-b3-contract-check.log` |
| `pnpm -C frontend check`（六守卫） | exit 0：generated / colors（24/24 正样本、0 负命中）/ glass / updown / grid / network 全 passed；之后 `git status` 仍 clean ⇒ 生成物与源一致 | `review-b3-check.log` |
| `pnpm -C frontend typecheck` / `lint` | exit 0 / exit 0（`--max-warnings 0`；最终树无 `eslint-disable`） | `review-b3-typecheck.log` / `review-b3-lint.log` |
| `pnpm -C frontend test:unit`（全量） | **31 files / 951 passed / 0 failed**（与实施者末轮一致） | `review-b3-unit.log` |
| 三份既有 v1 契约测试 `contracts / contract-doc / mock.spec.ts` | 3 files / **88 passed**（v1 语义未回归） | `review-b3-v1-contract-tests.log` |
| `tests/unit/jobs/real-stubs.spec.ts` | **23 passed**（13 旧键 + 9 新键 + 键集相等） | `review-b3-real-stubs.log` |
| 本批 19 条任务命令（15 条 `-t` + 4 条工程门） | T-A11：`WI whitelist` **6** / `WI degrade` **3** / `WI corrupt` **4** / `WI non-normal` **13**；T-A12：`WI createJob` **11** / `WI confirm` **5** / `WI intake validation` **10** / `WI scenario writes` **5**；T-A13：`WI assign` **15** / `WI removeUpload` **4** / `WI cancelJob` **8**；T-A22a：`WI H-2 cache` **5** / `WI H-2 filter` **4** / `WI H-2 createJob refresh` **7** / `WI H-2 agent refresh` **9**；工程门（contract --check / typecheck / lint）见上行。**全部 exit 0，用例数与实施者逐条相同** | `review-b3-task-titles.log` |
| `job-state-read.spec.ts -t "WI scenarios read"`（A11 改写两例所在） | 33 passed | — |
| `pnpm -C frontend test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` | 先核 `4173` 无 LISTEN；Playwright 自管 webServer；**24 passed / 0 failed**（1.0 min）；结束后无 LISTEN | `review-b3-e2e.log` |
| 只读探针（独占目录内 `review-b3-probe/{vitest.probe.config.ts,probe.spec.ts}`，经本树 `node_modules` 运行；**非产品测试**，不改受控文件） | 8 例全部执行，输出见 §4 | `review-b3-probe/probe-results.log`、`probe.log` |
| `git diff --check` / `git status --short`（写本文件前） | 通过 / 为空 | — |

**未跑项**：全量 `pnpm test` 中其余 7 份 E2E（breakpoints / modules / scenarios / smoke / theme / tokens / workbench）——本批无 UI 页面，tasks 本批命令不含 E2E，归 T-G09 / T-H04；未在 `742d6aa` / `0a2d1a5` 中间 SHA 单独重跑全量（本树只允许停在固定 HEAD，不另建 tree；O-B3-6 见 §5 说明）；无人工截图。

## 2. diff 事实与所有权（本会话核对）

- `git diff --stat ab742f5..0032fc6 -- . ':!frontend'` 只有 `analyze.md` / `implementation-log.md` / `tasks.md`（即 `e4031fa` + `1988463` 两个纯文档补记）；`0032fc6..e14ad25 -- frontend` 为空。
- 逐提交文件清单与 implementation-log §10 写权限逐条一致：
  - `c7ebccb`（11 文件）：新建 `jobs/persistence.ts`、`persistence.spec.ts`；改 `contracts/{client,methods,mock/index,mock/job-state,real/index}.ts` + 生成物；`job-state-read.spec.ts` 只增 `beforeEach(localStorage.clear())` 并改写 `WI scenarios read` 两例（spy 目标由 `Storage.prototype` 改为 `localStorage` 实例，断言面不变：非 normal 与覆盖零访问、normal 无覆盖恰一次 `getItem('fai.jobs.v1')`、无 set / remove / clear）；`real-stubs.spec.ts` 只 +1 键。
  - `742d6aa`（10 文件）：`types.ts` 只加 `CreateJobInputSchema` / `IntakeReceiptSchema` + 注册 + 两个类型；五个契约源 + 生成物；新建 `job-state-intake.spec.ts`；`real-stubs` +4 键；**未改** `persistence.ts`。
  - `0a2d1a5`（1 文件，+9 / −1）：只改 `WI non-normal` 参数化用例的 `scenario === 'error'` 分支（断言真实 `commit` 抛 adapter_error 且 `getJob('j-collect')` 读回不变）；其余 7 场景、reset resolve null、两键零访问、无 clear、两个哨兵断言原样；生产 `commit` 未动。本会话核 `742d6aa` 的 `job-state.ts:89` 已有 adapter_error 抛出而 `c7ebccb` 没有 ⇒ 实施者“自 `742d6aa` 起该分支红”的留痕与代码一致，**不是删覆盖、不是放宽**。
  - `a5ad11c`（9 文件）：五个契约源 + 生成物；新建 `job-state-pool.spec.ts`；`real-stubs` +4 键；对 `persistence.spec.ts` 零改动。
  - `0032fc6`（3 文件）：新建 `jobs/stores/jobs.ts`、`jobs-store.spec.ts`；`main.ts` +4 行（import、订阅、`app.onUnmount`、`import.meta.hot?.dispose`）。
- **零差异**（本会话逐路径 `git diff --stat`）：`app/**`、`shared/**`、`agent/**`（含 `store.ts`）、`workbench/**`、`scripts/**`、`package.json` / `pnpm-lock.yaml`、`vitest.config.ts` / `playwright.config.ts`、`mock/fixtures/**`、`e2e/**`、v1 三份契约测试、`jobs/{routes.ts,diff.ts,stores/session.ts,components/**,pages/**}`、`docs/**`、`AGENTS.md`、`backend/`、spec / checklist。
- `real-stubs.spec.ts`：既有 13 键、`satisfies` 约束、两条断言与 describe / test 均未改；9 个新键参数均为最小合法值。
- 模块方向：`contracts/mock/job-state.ts → jobs/persistence.ts → contracts/types.ts`；`persistence.ts` 只导入 zod 与 `contracts/types.ts`；生产代码中只有 `job-state.ts` 导入 persistence。`readJobFixtures()` 仍导出但本批后无生产调用方（只被测试用），形状未变。
- D-020～D-024 内容未混入（diff 文本 grep 无相关词）。CONTRACT.md `contractChange` 2.0.0 条已含“作业方法随状态层任务逐项接入”，本批不需另升版本（AC-008-4）。

## 3. 逐任务核对（完成标准 → 真实代码证据 → 本会话结果）

| 任务 | 核对要点（真实读源 + 亲跑 + 探针） | 结论 |
|---|---|---|
| **T-A11** `c7ebccb`（error 分支经 `0a2d1a5` 维护） | **标准 1**：`SnapshotSchema = strictObject{version: literal(1), data: PersistedJobDataSchema}`，`PersistedJobDataSchema = strictObject{jobs, details, deliverables, interventions, uploads, mappingHistory.default([])}`，只组合既有边界 schema；`saveJobsSnapshot` 解构六个业务字段再序列化，不 dump 整个 state（测试塞入 `scenario / emptyJobIds / runs` 后快照 data 仍等于六键）。Upload 走 strict `UploadSchema`，text 分支无正文字段；测试对三类 inputKind 的键集逐条等于十项白名单（+ 有时 `quarantineReason`），带 `text / File / Uint8Array / 完整 input` 的 commit 在边界被拒且 setItem 零调用；`u-unassigned-quarantine` 的原因恢复后逐字段相等。探针 P7：submit 文本 + confirm 后快照不含正文、顶层恰六键、`mappingHistory` 每条投放一条。✓<br>**标准 2**：`new TextEncoder().encode(snapshot).byteLength > 512*1024` 时不调 setItem 置 degraded；setItem 抛错在 persistence 内吞下置 degraded；两者业务 commit 已在内存成功（回执 / 错误不变），最后成功快照保留、removeItem 零调用，之后每次 commit 照常尝试、成功回 ok；`onPersistenceStatus` 同步回调（通知序列 `['degraded','ok']`）。恰 512 KiB 通过、+1 字节与多字节拒绝。✓<br>**标准 3**：坏 JSON / version 2 / schema 不符 / 多余运行时或正文字段 → 本会话用种子、`unreadable`、原值保留、`saveJobsSnapshot` 一律早退（含 > 512 KiB 的 commit）；只有 `resetMockData` 才 `removeItem` 两键 → 重建 → 写一次 → ok（S-40 已固定）。✓<br>**标准 4**：八个非 normal 场景 + normal 带 `{}` / `{jobs}` 覆盖，含旧 client 发起的 reset，对两键 get / set / remove / clear 计数全 0；`fai.rail / fai.drawer / fai.layout` 不受 reset 影响；切非持久会话时状态置 ok。`persistent = scenario === 'normal' && override === undefined`，getter 只读一次到局部变量（getter 计数 = 1，含 reset 后仍 1；探针 P8 reset 期间 getter 读 0 次）。✓<br>**R2-B**：工厂 `readScenario()` → 读 getter → `parseJobFixtures` → `initializeJobState` 先 `createSeedState` 再条件 `loadJobsSnapshot()`，测试在 getItem 回调内断言 state 已建好；未加 guard。✓ **R2-E**：reset / 写 / 读都取 `getJobScenario()`。✓<br>**标准 5**：生成物 / 工程门 ✓ | 满足（观察 R3-C、O-B3-1 见 §5） |
| **T-A12** `742d6aa` + `0a2d1a5` | **标准 1**：`CreateJobInputSchema` strict，title / subject `.trim().min(1)`（变换后保存：`'  合成研究  '` → `'合成研究'`），goal 任意字符串、subject 可 null；写入 `createdBy='human'`、collecting / collect、`[R,N,N,N]`、`parentJobId` / `reason` null、`pendingCount` 0；只建 `<jobId>-deliverable`（draft / human / derived、`latestMergedRev=…-r1`）+ r1（blocks=[]）+ `Deliverable` draft 三锚 null；collect / process / analyze 工作区为空集合；不预建 recipe / analysis、不猜业务参数；回执副本隔离（caller 改回执不影响状态）。✓<br>**标准 2**：submit → `pending_validation`，`mapping = preview.fields`；confirm 只接受未删除且 pending（否则 validation_error），先 push `mappingHistory{uploadId, mapping(修正前), status, replacedAt}` 再改 mapping / status；`quarantineReason !== undefined` → quarantined（原因原样，只能来自 fixture / `jobFixtures` 覆盖，覆盖会话不持久化）；已归属者追加 dataset 修订（以原 `latestMergedRev` 为 base，旧修订保留修正前 mapping）+ map_fix（payload 带修正后 mapping）；未归属者不写事件（`Intervention.jobId` 必填，不伪造，无新 kind）。二次 confirm 被拒后 `mappingHistory` 长度仍 1。✓<br>**标准 3**：空 purpose / `no.exe` / 篡改 `quarantineReason` / 空正文 / 非法 reliability / 非法日期 → validation_error，状态与快照无副作用；ingest payload = `{action, uploadId, sourceNote 五字段原样}`；Upload 键集只含元数据；快照不含 `PRIVATE_SYNTHETIC_BODY`。✓<br>**标准 4**：`writeJobState` = 入口 parse → `delayScenario(getJobScenario())` → 写 → 结果 parse；`commit` = clone → mutator → `JobStateSchema.parse` → error 场景在替换前抛 adapter_error → 替换 → persistent 时 save。error 下四种写拒绝且 `current()` 不变、快照不写；未知锚仍 not_found（submit 未知 jobId、confirm / preview 未知 uploadId）；slow 1499 ms 未提交、1500 ms 提交，且旧 client 跟随当前共享 scenario。✓<br>**S-39 / r6.7**：首次投放到无 dataset 作业时同一次写内建 `<jobId>-dataset`（draft / external / source），ingest `artifactId` 即该 dataset、`baseRev` null；有 dataset 时 `baseRev = 原 latestMergedRev`。✓ **sealed 前置**：`writableJob` 对 delivered / cancelled 返回 validation_error——是 plan §4.6 既有规则的入口查询，本评审不把它记作 T-A17 完成。<br>**标准 5**：生成物 / 工程门 ✓ | 满足 |
| **T-A13** `a5ad11c` | **标准 1**：`listUnassignedUploads` = `jobId === null && !removed` 的池记录副本；`assignUpload`：`findUpload` → `writableJob(jobId)` → 须 `jobId === null && !removed && 在池中`（否则 validation_error）→ 记录与预览**移入**目标作业（池中删除、`uploads.previews` 删除）→ `appendDatasetRevision` 只补**一条** ingest（revision `uploads` 携当前 mapping / status，不重放未归属期间的 map_fix）；未知投放 / 作业 not_found；quarantined 的原因 / sourceNote 保留；empty 会话可投放 + 建作业 + 归入。✓<br>**标准 2**：`removeUpload` 只置 `removed=true`、预览保留、`mappingHistory` 不变；`getStageWorkspace(…,'collect').uploads` 与 `listUnassignedUploads` 去掉它（唯一投影位置：两个读函数；`commit` 与快照不过滤，快照中记录带 `removed:true` 原地保留）；已归属者追加不含该投放的 dataset 修订 + `kind=delete / action=remove_source / reason`（trim 后），`at(-2)` 旧修订仍含该 uploadId；未归属者不写事件；之后 `getIntakePreview` 仍可取、confirm 被拒。历史可查经回执 / 快照 / 旧修订 / 预览验证，未虚构读 API（T-A15 / T-B06 再覆盖）。✓<br>**标准 3**：`cancelJob`：`writableJob` → status cancelled、`reason` trim 后非空（`''` / 空白 / undefined → validation_error）、`updatedAt` = 写入时刻；`currentStage` / `stages` / 四个阶段工作区与取消前逐一相等（含 j-failed）；写 `delete / cancel_job`（stage = currentStage，artifactId / baseRev null）；取消后 submit / assign / 再取消均 validation_error；本批无 run 关联，“不 abort”只是实现约束。✓<br>**标准 4**：生成物 / 工程门 ✓；`getStageWorkspace` 描述补句实现中立。 | 满足（观察 R3-B、O-R3-1 见 §5） |
| **T-A22a** `0032fc6` | **标准 1**：`jobs` / `listStatus` / `listError` / `filter` / `filteredJobs` 为 `computed(readonly)`（元素层只读，`isReadonly` 断言）；`ensureJobs()` 仅 `idle` 时 `refresh()`；`refresh()` 先 `listJobs()` 写 `jobs`，有 filter 再 `listJobs(filter)` 写 `filteredJobs`，成功 ready + 清错，失败 error + `listError` 且两缓存引用保留；已有数据时不回 loading（slow 场景假时钟断言）；60 s 内无计时器、无轮询；读 action 期间 `Storage.prototype` 四方法零调用；error 场景 `listError.code='adapter_error'`、重复 ensure 不重读、显式 refresh 恢复。✓<br>**标准 2**：`applyFilter(f)` 只请求 `listJobs(f)`，`jobs` 引用不变；`applyFilter(null)` 不发请求、置空。✓（但见 §5 R3-A）<br>**标准 3**：`createJob` = `await dataClient.createJob` → `await refresh()`（有 filter 时 `[[], [filter]]` 各一次）→ 返回回执 `jobs[0]`；新作业状态 ∈ `ACTIVE_JOB_STATUSES`；validation_error / adapter_error 以原 ErrorResponse 拒绝、不 refresh、缓存引用不变。✓ **S-31**：本批唯一已接入 UI 层的写路径，恰一次刷新；其他写 API 无 store / UI 调用方（grep 核实），不冒称全部管线。<br>**标准 4**：`receiveAgentEvent` 仅 `event.jobContext && isTerminalEvent(event)` 时 `void refresh()`；四个内置脚本经真实 `createMockAgentClient()` 假时钟回放：终态前 0 次、终态恰 1 次、无上下文 send 0 次、退订后 0 次；契约 `run.aborted` 变体同样处理。**S-38**：`refresh` / `applyFilter` 捕获读失败自身 resolve；真实 error 场景的终态回放无 unhandled rejection（Vitest 会报）。`main.ts` 在 agent store 订阅之后加订阅并交 `onUnmount` / `hot.dispose`，`agent/store.ts` 零 diff。✓<br>**测试真实性**：真实 Pinia + 真实 mock DataClient / AgentClient；只对 `contracts/index.ts` 的 `dataClient.listJobs / createJob` 做透传 spy（系统边界），场景切换经真实 `createMockDataClient()` 重建共享状态；无 `vi.mock` 内部模块、无 Window 钩子、无生产故障开关。<br>**标准 5**：工程门 ✓ | 满足（R3-A 为 P3） |

## 4. 只读探针结果（独立复现，不预设 severity）

| 探针 | 结果（`probe-results.log` 原文摘要） |
|---|---|
| P1（协调器 O-B3-4 链）：全新 store、`listStatus=idle`，直接 `await applyFilter({type:'daily'})`（真实 normal mock，纯顺序、无竞态） | `applyFilter` 后 `listStatus=ready`、`listError=null`、`jobs.length=0`、`filteredJobs.length=2`、reads=`[[{type:'daily'}]]`；随后 `await ensureJobs()` **不发请求**，`jobs.length` 仍 0；而 `listJobs()` 未筛选为 5 条 ⇒ `store.jobs ≠ 未筛选结果` |
| P2：base 读失败（error 场景 ensure → `error`、jobs=[]），切回 normal 后 `applyFilter` 成功 | `listStatus=ready`、`listError=null`、`jobs=0`、`filtered=2`；之后 `ensureJobs()` 仍不重读 base |
| P3：已有筛选 `{status:'collecting'}` 成功，再在 error 场景 `applyFilter({status:'delivering'})` | `filter={status:'delivering'}` 而 `filteredJobs` 仍是 collecting 的结果（与前一筛选结果相同），`listStatus=error`（plan“已有 filteredJobs 保留”的直接后果） |
| P4（O-B3-2）：对已 `removed=true` 的记录再 `removeUpload` | 已归属：两次 remove 后 collect 修订 1 → 3、每次各写一条 `remove_source` 事件（第二条 reason=“第二次”）；未归属：第二次静默 resolve、零事件；对已删除池记录 assign / confirm 均 validation_error（与 remove 不一致） |
| P5（O-B3-3）：`getItem` 抛 SecurityError；`removeItem` 抛 SecurityError | getItem 抛错 → `unreadable`，业务读种子正常；removeItem 抛错 → `resetMockData` 以**原始 `DOMException`**（无 `.error`，非契约错误形态）拒绝，状态仍 `unreadable`，状态未重建 |
| P6：`commit` 的 mutator 产出 schema 非法状态（failed 且 reason=null） | 抛裸 `ZodError`（非契约形态）；状态未替换、无快照写入。本批公开写方法按构造只产出合法对象，此路径经公开 API 不可达（与 R2-B 同类、T-A10 既有形态），**不记新发现** |
| P7：文本投放 + confirm（已归属 / 未归属各一） | 快照不含 `SECRET_BODY`；顶层恰六键；`mappingHistory` 长度 2（每条一次）；未归属 Upload 键集 = 8 项白名单 |
| P8：normal 下 createJob 后 reset，期间把 `window.__FAI_MOCK__` 换成计数 getter | reset 后 jobs 回到 5 条种子、`fai.rail` 保留、`fai.inbox.v1` 已删、getter 读 0 次 |

## 5. 发现（全部 P3；本批不阻断，不替作者修，均未经 Walter 风险接受）

| # | 严重度 | 位置 / 复现 | 说明与独立判断 | 受影响 AC | 最小归属 |
|---|---|---|---|---|---|
| **R3-A** | **P3**（jobsStore 共享读状态允许“未筛选缓存从未加载却为 ready”；= Converge O-B3-4 的我方判定，探针 P1 / P2 复现） | `jobs/stores/jobs.ts:36-49` `applyFilter` 成功分支写 `listStatus='ready'` / `listError=null`；`:17-19` `ensureJobs` 只看 `listStatus==='idle'`。复现：§4 P1（纯顺序、真实 normal mock） | **不接受“未规定”**：plan §2.3 r6 与 interface-handoff §2 ① 明确 `listStatus` / `listError` 是**未筛选列表缓存**的读状态（“只读未筛选列表缓存 + 读状态 / 错误”），`ensureJobs()` = “仅首次加载”；T-A22a【r6.6】写 `applyFilter(f)` **只写** `filter` / `filteredJobs`、失败口径同 refresh——成功分支改写 `listStatus` / `listError` 已越出“只写”两字段。结果：在 filter-before-ensure 的合法调用顺序下，标准 1“`ensureJobs()` 后 `jobs` 等于 `listJobs()` 未筛选结果”与标准 2“`jobs` 保持未筛选全集”都不成立（P1：jobs=[] 却 ready，且 ensure 永不加载）；P2 则是 base 读失败后被筛选成功“洗白”。**为何不是 P2**：本批无任何消费方；T-B01（挂载 `ensureJobs`）→ T-B02（筛选条 `applyFilter`）的既定顺序不触发；同一 tick 内并发调用也不触发（`applyFilter` 的 await 未返回前 `listStatus` 仍 idle）；无 AC 在本批最终验收；修复 ≤ 2 行。但 H-2·列表的 v2 消费方（首页作业轨道）只按 `ensureJobs()` + `jobs` / `listStatus` 消费，若列表页将来从 URL 恢复筛选并先 `applyFilter`，轨道会得到“ready 且为空”的错误视图，故须在消费方接入前收口。**最小修复（二选一，不建状态机 / 锁 / 请求序号）**：(a) `applyFilter` 成功分支只在 `listStatus.value !== 'idle'` 时置 ready / 清错（保持“下一次筛选读清除错误”测试，P1 路径下保持 idle 让 ensure 仍能加载）；或 (b) 按 r6.6 原文把成功分支的两行删去（只写 `filter` / `filteredJobs`），错误只由 `refresh()` 清除。两者都需在 `jobs-store.spec.ts` 加一例“先 applyFilter 后 ensureJobs 仍加载未筛选列表”。P2 / P3 路径（base 错误被筛选成功清除；筛选失败时 `filter` 与 `filteredJobs` 不对应）是 plan 自身“共享状态 + 已有数据保留”的设计后果，mock 下不可观察（同场景同失败），建议作为 plan §2.3 一句精度登记（“`listStatus` 为两视图共享的最近一次读状态；`applyFilter` 不把 idle 变 ready”），不新增字段 | AC-001-1 / AC-001-2 部分前置；H-2 ①②④ | 需补一条 ≤ 0.5 h 的小任务（或并入 T-B02 修改范围，**T-B02 / H-2 ④ 之前**），含上述测试；plan §2.3 / tasks T-A22a【r6.6】补一句精度；不回 Clarify |
| **R3-B** | P3（重复删除产生冗余修订与事件；= Converge O-B3-2，探针 P4 复现） | `mock/job-state.ts` `removeUpload`：未检查 `upload.removed` | 对已删除记录再次 remove：已归属者每次都追加一条内容相同的 dataset 修订和一条 `remove_source` 事件（历史被无意义膨胀，T-B06 介入历史会显示重复删除）；未归属者静默成功。同批 `confirmIntake` / `assignUpload` 对已删除记录一律 validation_error（“只能…未删除…”），remove 是三者中唯一不一致者。UI 投影已隐藏 removed 记录，现只能经 API 触发；T-C03 的删除确认若因双击 / 重试重复提交即会触发。**不是** AGENTS §5.1 的猜测性 guard，而是与兄弟方法对齐的幂等语义。最小修复：`if (upload.removed) throw validation_error('投放已删除。')`（1 行）+ pool spec 一例 | AC-007-3 / AC-007-1 部分前置 | 可并入 T-C03（删除确认的消费方）或 T-A17 只读门统一入口；plan §2.4【r6.6】remove 句补“已删除者拒绝” |
| **R3-C** | P3（Storage 非配额异常的错误形态；= Converge O-B3-3，探针 P5 复现） | `jobs/persistence.ts:49-58` `loadJobsSnapshot` 的 try 包住 `getItem`；`:77-81` `clearJobKeys` 的 `removeItem` 未捕获 → `mock/index.ts` `resetMockData` 以原始 `DOMException` 拒绝 | getItem 抛错归 `unreadable`（原值保留、不覆写）是安全读法，可接受。removeItem 抛错时 `resetMockData` 向调用方抛**非契约形态**错误（无 `{error:{code}}`），T-G04 横幅“可重置样例”的调用方按 `ErrorResponse` 处理会得到 `undefined.code`；状态停在 unreadable、内存也未重建。触发条件 = 浏览器禁用 / 锁定 storage（桌面 Electron 下概率极低），plan §3 只规定 setItem 配额失败。不建议建故障框架；最小修复：`clearJobKeys` 对两次 `removeItem` 各 try / catch → 置 degraded（与 setItem 同口径）并继续重建，或在 `resetMockData` 处转为 `adapter_error`。可在系统边界 `vi.spyOn(localStorage,'removeItem')` 一例固定 | 无独立 AC（spec §4 持久化约束；T-G04 消费） | T-G04 接入横幅 / 重置按钮时一并处理（0.5 h 内）；plan §3 补一句“removeItem 失败按 degraded” |

**本批 bug（P1 / P2）**：无。**架构风险**：无新增（R3-A 为共享读状态的归属精度，R3-C 为错误形态口径）。**测试缺口**：本批 19 条命令对标准 1:1 且亲跑通过；未见复写实现逻辑的测试；缺的是 R3-A（filter-before-ensure）与 R3-B（重复 remove）两个负向顺序用例，随各自归属补。**目标对齐**：与冻结 spec v1.1 / plan r6.6–r6.7 / tasks 一致；无 D-020～D-024 混入；AGENTS §5：§5.1 零新增 guard / 事务 / 锁（`writableJob` 是既有领域规则）、§5.2 入口 parse 一次 + 快照入口一次、§5.3 `jobDetail` / `appendDatasetRevision` / `emptyReceipt` / `writableJob` / `findUpload` 均多处复用、§5.6 真实 commit / 真实 client / 边界 spy、§5.7 无新工具依赖。

### 观察（不计入判定，不要求处理；供后续任务阅读）

- **O-R3-1（取消覆盖失败原因）**：`cancelJob` 对 `j-failed` 这类 `failed` 作业把 `job.reason` 改写为取消理由，原失败原因只剩在作业对象之外（本批尚无失败事件记录）。`Job.reason` 单值、schema 只要求 failed / cancelled 非空，spec AC-002-5 显示的是当前状态的原因，本批不算缺口；T-A20（run failed 写 reason）/ T-B05（展示）接入时核一次“失败原因是否需保留在事件或修订中”。
- **O-R3-2（筛选失败后 `filter` 与 `filteredJobs` 不对应）**：探针 P3；plan“已有数据保留”的直接后果，UI 以 `listStatus='error'` 呈现即可，随 R3-A 的精度句一并说明。
- **O-R3-3（`readJobFixtures()` 无生产调用方）**：T-A11 后工厂改为私有 helper，导出函数只被测试使用；不影响契约与守卫，留 T-G06 收口时决定是否保留。

### 对 Converge §3 / §5 的独立判断

| 项 | 判定 |
|---|---|
| O-B3-1 `mappingHistory` 在 A11 落地而非 A12 | **可接受、非缺口**：终态 = plan §2.3【r6.6】六键；`.default([])` 使 A11 的五键快照也可读回（有测试）；批内落点顺序差异，未扩大范围、未改写权限之外的文件（A12 未碰 `persistence.ts`） |
| O-B3-2 重复删除 | → **R3-B（P3）** |
| O-B3-3 Storage 其他异常 | → **R3-C（P3）**；getItem 归 unreadable 部分无发现 |
| O-B3-4 共享读状态 | → **R3-A（P3）**，判定理由见上；不接受“未规定”，但也不升 P2 |
| O-B3-5 trim 为变换 | 无发现：spec R-001“标题必填”未定去空白口径，“去空白非空”落为变换后保存是既有需求内的精度，plan §2.4【r6.7】已登记；`removeUpload` / `cancelJob` reason 同理 |
| O-B3-6 证据粒度 | 本评审以固定 `0032fc6`（= HEAD frontend）亲跑为准：951 / 0；`742d6aa` 与 `0a2d1a5` 未单独重跑（本树不另建 tree），实施者 925 / 1 的留痕由代码阅读印证（§2 `0a2d1a5` 行）。无发现 |
| Converge §3 五项精度（九方法签名、trim、首投放 dataset 锚、persistence 导出、jobsStore 导出） | 均为已审设计的落地或名称 / 类型精度，**不是需求变更**；spec 46 AC 不变。唯一需要回写精度的是 R3-A 的 `applyFilter` 成功口径（Converge 已标“交 Review”，本评审判为 P3 并要求修正而非仅登记） |

### 前两批 P3 在本批的状态（只记事实）

- **R2-B**：DataClient 侧“先建 state 再 hydrate、不加 guard”已以测试固定；AgentClient 侧（T-A18）未做。
- **R2-E**：新增读 / 写 / reset 均取 `getJobScenario()`；v1 十方法仍按工厂闭包（代码未动），plan 已登记。
- **R2-A / R-C**：新增 9 条方法描述保持实现中立；`getStageWorkspace` 旧描述的 mock 句仍在，归 T-G06。
- **R-D ② / ⑤**：由 `confirmIntake` / `createJob` / `cancelJob` 按构造保持，未加 refine；① ③ ④ 归 T-A14 / T-A17 / T-A20。
- **R-A / R-B 残留 / R-E / R-F / R2-C / R2-D**：本批不涉及、未处理、未经风险接受。

## 6. H-x 交接与 feature 状态（本评审不代填）

| 切片 | 状态（本评审核对后） |
|---|---|
| H-2·列表 | 提供任务 T-A01 / A02 / A10 / A12 / A22a 齐；① `0032fc6` ✓；② R9 `ab742f5` ✓；③ 本会话亲跑 `WI H-2 cache / filter / createJob refresh / agent refresh` 5 / 4 / 7 / 9 ✓；**④ 未取得** → **待消费方集成（未交付）**。建议消费方接入前先关 R3-A |
| H-6 | T-A11 已提供“有覆盖只在内存 / normal 持久化”；仍缺 **T-A21** → 未交付 |
| H-5 / 页面切片 | 未做 |
| H-1 / H-2·标签 / H-3 / H-4 | 历史生产方证据保留（③ 含前批 A 亲跑）；④ 仍缺 |

生产方集成树 `0032fc6` 只是旁证，不能填作 ④。feature：20 / 67 已实施（16 已完成 + 本批 4 本评审通过）、47 未开始；46 AC 最终验收 **0**；H 组外部阻塞不变；**未收敛**。

## 7. 上游移动的边界判断（只记录，不导入）

- 本会话只读核：`072bb12` 不在 HEAD 祖先；本批与本评审按 pin `90187f7`。当前固定树上 `routes.spec.ts` 与 `e2e/shell.spec.ts` 真实通过（全量单测 + E2E 亲跑）。
- 判定：R2-D 同步风险保持原判（后续同步时的基线变化，不是本批问题）；本评审不用 main 的事实假称当前树测试失败，未 merge、未改壳测试。

## 8. 下一步（建议，不替作者改）

1. 集成人确认本结论后原样提交本文件，更新 tasks 四条状态行与 `specs/README.md` 行（“待第三批 Review”→“第三批 Review 通过（`<本文件提交 SHA>`），不表示 AC 验收”），把 R3-A～R3-C 登记进 implementation-log §8 台账（均未经风险接受）。
2. **R3-A 在 T-B02 / H-2 ④ 之前关闭**：派一条 ≤ 0.5 h 小任务（或并入 T-B02 修改范围），按 §5 最小修复 + 一例顺序测试；plan §2.3 / tasks T-A22a 补一句精度。走 Analyze 登记，不回 Clarify。
3. R3-B 并入 T-C03 或 T-A17；R3-C 并入 T-G04。
4. 按 §6 DAG 派第四批（Converge 列出的可起步：T-A14 / T-A15 / T-A16、T-B01、T-C01）；批次划分由集成人决定。
5. H-2·列表 / H-6 / H-1 / H-3 / H-4 的 ④ 待 `integration/frontend-workbench-v2` 所有者登记；`072bb12` 同步按 R2-D 流程。

## 验收证据（本批）

- 测试命令输出摘要：见 §1（全量 `test:unit` 31 files / 951 passed / 0 failed；v1 三份契约测试 88 passed；`real-stubs` 23 passed；本批 19 条任务命令全部亲跑通过且用例数与实施者逐条相同；`check` 六守卫 / `contract --check` 24 methods / typecheck / lint 过；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` 24 passed；只读探针 8 例输出见 §4）。
- Converge 报告结论：`converge-batch3.md` 判本批“已收口、待第三批独立代码 Review”；本评审核对其 §1 diff 事实、§2 逐任务证据、§3 精度判定成立；§5 O-B3-1～6 独立判定：O-B3-1 / O-B3-5 / O-B3-6 无发现，O-B3-2 → R3-B、O-B3-3 → R3-C、O-B3-4 → R3-A（均 P3，R3-A 要求在消费方接入前修正）。
- Gate 2 确认记录：**不适用**（本批不是全 feature Review / Handoff；Gate 2 待全 feature 最终 Review）。
