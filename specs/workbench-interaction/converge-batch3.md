# Feature: workbench-interaction Converge 报告 — 第三批 T-A11 / T-A12 / T-A13 / T-A22a（converge-batch3.md）

> **性质**：这是 AGENTS §2 第 9 步 Converge 的**批次报告**，只读对比本批真实代码与 spec / plan / tasks。它**不是** Review、审核结论、Gate 2 或 Handoff；不勾选 checklist，也不改 spec。
>
> **阶段记录（脱敏）**：
> - **角色与模型**：Converge / 进度登记 / Analyze 作者 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18715-bffa-74e9-8b0d-483f569eee2b`）。
> - **通道**：本轮协调器对 `claude-bridge/claude-opus-5-5` 做了最小真实调用，exit 1，失败类别为 **quota / rate / spend_limit**；同模型官方通道调用成功。按 AGENTS §6 规则 2 / 5，只换通道、不换模型，本窗口不重试已明确限额的通道，也没有改 provider / key / 路由 / 全局配置。模型不因测试结果回退。
> - **派工人**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter 的“允许”授权和集成人指定在既有 tasks 范围内持续有效。
>
> **写入范围**：
> - 唯一可写 worktree：`D:/2030/Futures-AI-interaction-converge-batch3`（branch `docs/workbench-interaction-batch3-converge`，固定起点 `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc`，起始 clean）。
> - 只写 `specs/workbench-interaction/{plan,tasks,analyze,implementation-log,interface-handoff,converge-batch3}.md`，以及 `specs/README.md` 中本 feature 的状态行和本 feature 的跨 feature 队列行。
> - **未改动**：代码、测试、fixture、生成器、spec、checklist、已有 Review 原件、前两批 Converge 报告、权威 docs、其他 feature、根 HANDOFF、其他 worktree。
> - **未执行**：没有 commit / push / PR / merge；没有启动子 agent、服务或安装；**没有运行任何产品测试**。
> - **测试数字来源**：下文测试数字全部由实施者执行，本会话没有重跑。
> - **只读核对产物**：放在协调器独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/converge-*`（非项目产物，不清理）。
>
> **日期**：2026-10-29（+04:00）。

## 0. 固定输入

| 项 | 值 |
|---|---|
| `implementation_base_sha` | `43b6d79681a49562f41751368b2ae00c24062f56`（v1 Handoff，不变） |
| `upstream_start_sha` | `90187f7d8907316e554d2441d846827468c5371f`（本批仍 pin）。main / `origin/main` = `072bb12de3425e1b76357b5771e47f0609b32979`，**不是**本树祖先（只读核验，§6） |
| 有效 Checklist | **R9**，原件提交 `ab742f5801628b15324fc998f03959482fd31d9d`。本树 `checklist.md` 的 blob 为 `74084c1337491a042c944096e1f290fe07aab324`，与原件相同，只读未改。结论 26 / 26 ☑，0 P1 / P2，P3 S-38～S-40。r6.6 的持久化白名单补列 `quarantineReason` 和内部 `mappingHistory`，已由独立 A 在 R9 判为既有需求内的精度；spec 仍为 46 AC，未改 |
| 本批代码 diff | `ab742f5..0032fc6 -- frontend`：**5 个前端提交，17 个文件，+2318 / −26**（逐文件读过，见 §1 / §2） |
| 区间内的纯文档提交 | 同一区间另有 2 个 doc-scope 补记，**不计入**源码提交数：`e4031fa`（r6.6.1）、`1988463`（r6.6.2，从 `8c4660fe9121610b2bd85a13cfd7ea97d7f7c75e` 定向导入 analyze / tasks / implementation-log 三份文档；三份 blob 与来源逐一相同，见 §1） |
| 逐提交 | T-A11 `c7ebccb8f9e29350d5a815959be3b532191bdb95` → T-A12 `742d6aa3d671cee91c6cce856f657a103d510615` → A12 test-fix `0a2d1a5e756b4a469996d2069996a256f16722b9` → T-A13 `a5ad11c79cf08ca50ebb55ef0984beae952a7dad` → T-A22a `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc` |
| 生产方集成树 | `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`，HEAD = `0032fc6`。集成人 ff-only 合入，本会话只读 `rev-parse` / `worktree list` 核验。只作旁证，不是 ④ |
| v2 消费方集成 | `integration/frontend-workbench-v2` = `3f632739fc186396221482364cf16e3629b4b24f`（只读）。本批 4 个提交和前两批切片 ① 都**不是**它的祖先。本会话不写、不代登记 v2 树 |

**本轮开始时重新读取**（不依赖会话记忆）：
- 工作流与权威文档：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`。
- 本 feature 规格：冻结 spec.md（v1.1，46 AC）；plan.md（页首、§2.3 / §2.4 / §3【r6.6】）；tasks.md（页首 r6.6 / r6.6.1 / r6.6.2 块、§1、§2a、T-A10～T-A13、T-A22a、§5～§7）。
- 审核与分析：checklist.md R9 节（只读）、analyze.md R12 / R12.1 / R12.2。
- 记账与交接：implementation-log、interface-handoff、`converge-batch2.md`、`review-batch2.md`（R2-A～R2-E）、`review-batch-a09a.md`（R-A～R-F），以及 `specs/README.md`。

实施者的四份脱敏回报（`astra-persistence-resume-result.md`、`astra-intake-result.md`、`astra-intake-resume-result.md`、`astra-store-result.md`）只作为结果来源，不能代替代码阅读。

## 1. diff 事实与所有权

- **逐提交文件清单**（`git show --name-only`）与 tasks 修改范围、implementation-log §10 写权限一致：
  - **T-A11 `c7ebccb`**（11 个文件）：
    - 新建 `jobs/persistence.ts`、`tests/unit/jobs/persistence.spec.ts`。
    - 改 `contracts/{client.ts,methods.ts,mock/index.ts,mock/job-state.ts,real/index.ts}`；生成物 `contracts/{CONTRACT.md,schema.json}`。
    - `job-state-read.spec.ts` 只增 `localStorage.clear()`，并改写两例。
    - `real-stubs.spec.ts` 只增 `resetMockData` 一键（r6.6.1）。
  - **T-A12 `742d6aa`**（10 个文件）：
    - `types.ts` 只增 `CreateJobInputSchema` / `IntakeReceiptSchema`（含注册与类型）。
    - 同上五个契约源文件；生成物。
    - 新建 `job-state-intake.spec.ts`；`real-stubs.spec.ts` 只增四键。
    - **没有改** `jobs/persistence.ts`（原因见 §5 O-B3-1）。
  - **A12 test-fix `0a2d1a5`**（1 个文件，+9 / −1）：只改 `persistence.spec.ts` 中 `WI non-normal` 参数化用例的 error 分支（r6.6.2）。其余 7 个场景、reset、零 storage 访问、哨兵断言原样，生产 `commit` 未动。
  - **T-A13 `a5ad11c`**（9 个文件）：
    - 同上五个契约源文件；生成物。
    - 新建 `job-state-pool.spec.ts`；`real-stubs.spec.ts` 只增四键。
    - 对 `persistence.spec.ts` 无改动。
  - **T-A22a `0032fc6`**（3 个文件）：
    - 新建 `jobs/stores/jobs.ts`、`jobs-store.spec.ts`。
    - `main.ts` 只增一行 import，以及订阅加两处解除（3 行）。
- **零差异**（`git diff --stat ab742f5..0032fc6 -- <路径>` 为空）：
  - 前端壳与共享代码：`frontend/src/{app,shared,agent,workbench}/**`。
  - 工具、依赖与配置：`frontend/scripts/**`、`package.json`、`pnpm-lock.yaml`、`vitest.config.ts`、`playwright.config.ts`。
  - fixture：`contracts/mock/fixtures/**`（含 jobs 五个文件）。
  - 测试：v1 三份契约测试 `tests/unit/{mock,contracts,contract-doc}.spec.ts`、`frontend/e2e/**`。
  - 规格与文档：spec.md、checklist.md、plan.md、interface-handoff.md、`specs/README.md`、`docs/**`、AGENTS.md。
- **A13 WIP 保全核对**（本会话独立复算）：`git diff 742d6aa a5ad11c` 去掉 `persistence.spec.ts` / `job-state-pool.spec.ts` 后，SHA256 = `d9cf34d3…0145`，与 scope 停止时留存的 `A13-before-scope-update.patch` 相同；`a5ad11c` 中 `job-state-pool.spec.ts` 的 SHA256 = `8b29241c…ab84`，与留存的 `A13-before-scope-job-state-pool.spec.ts` 相同。`1988463` 与 `0a2d1a5` 的 `frontend/src` 无差异。结论：导入三份文档时没有丢失 A13 WIP。
- **模块方向**：`contracts/mock/job-state.ts → jobs/persistence.ts → contracts/types.ts`；`persistence.ts` 不导入 job-state 或 mock/index。生产代码中只有 `job-state.ts` 导入 persistence。

## 2. 逐任务核对（完成标准 → 代码证据 → 命令）

- **命令结果**列：由实施者在实施树执行（openai/gpt-6-astra，新会话，调用正常，未回退），本会话没有重跑。
- **标题存在**列：本会话读过测试源，确认 tasks 命令的 `-t` 标题存在；`test` / `test.each` 展开数与回报的用例数逐一对得上。

| 任务 | 固定 commit | 完成标准 → 代码证据 | 标题存在 | 命令结果（实施者执行） | 判定 |
|---|---|---|---|---|---|
| T-A11 | `c7ebccb`（error 分支后由 `0a2d1a5` 维护） | **① 白名单**：快照 = `{version:1, data:{jobs, details, deliverables, interventions, uploads, mappingHistory}}`。`saveJobsSnapshot` 只按这六个字段投影后序列化，不整体 dump state；Upload 走 strict `UploadSchema`。测试三类 inputKind 的键集都只等于十项白名单 +（有时）`quarantineReason`；带正文 / File / 字节 / 完整 input 的 commit 被边界拒绝，且 setItem 零调用；`quarantineReason` 读回不丢。<br>**② 降级**：> 512 KiB 时不调 setItem（UTF-8，恰 512 KiB 通过、多一个字节与多字节文本拒绝）；setItem 抛错时在 persistence 内吞下；两者都只置 degraded，内存业务成功，最后成功快照保留、removeItem 零调用；之后每次 commit 照常重试，成功回 ok；状态回调同步触发。<br>**③ 损坏**：坏 JSON / version 2 / schema 不符 / 多余运行时或正文字段时，本会话用种子、状态 unreadable、原值保留、保存一律不写；显式 reset 后依次 removeItem 两键 → 重建 → 写一次，状态回 ok，inbox 删除（S-40 已落实）。<br>**④ 零访问**：八个非 normal 场景与 normal + 覆盖（`{}` / `{jobs}`）下，含旧 client reset，对两键 get / set / remove / clear 都为 0；`fai.rail` / `fai.drawer` / `fai.layout` 不受影响；切到非持久会话时状态置 ok。<br>**初始化顺序（R2-B）**：工厂只读一次 scenario 与 override getter → 解析种子 → 建出确定类型的 state → 仅 normal 且无覆盖时 hydrate；测试在 getItem 回调内断言 state 已建好。<br>**⑤** 生成物 / 工程门 | ✓（whitelist 6、degrade 3、corrupt 3+1、non-normal 8+2+3） | 命令 1～4：**6 / 3 / 4 / 13 pass**；命令 5：`contract --check` 16 methods / 10 events / 2 artifacts，typecheck / lint 通过。另：persistence + read 定向 65 / 65，real-stubs 15，`check` 六守卫通过；`c7ebccb` 提交时 clean 全量 **28 文件 860 pass / 0 fail**。**失败留痕**：首轮新测试出现 Storage spy 漏记、跨例残留，另有两处新测试类型错误，只修了新测试 | 满足（error 分支见 T-A12 失败留痕） |
| T-A12 | `742d6aa` + test-fix `0a2d1a5` | **① createJob**：`CreateJobInputSchema` strict（title / subject 经 zod `trim().min(1)`，见 §3）；写入 human、collecting / collect、R,N,N,N、`parentJobId` / `reason` 为 null；只建交付侧 `<jobId>-deliverable` draft + r1 + Deliverable draft（三锚 null）；不预建 recipe / analysis。<br>**② confirm**：submit 后为 pending_validation，confirm 后才是 ingested；fixture 预置 `quarantineReason` → quarantined，原因保留；已归属投放写 dataset 新修订（旧修订保留修正前 mapping）+ map_fix；未归属投放只写 `mappingHistory`、不写事件；每条投放至多一条 history（二次 confirm 被拒后长度仍为 1）。<br>**③ 入口校验**：空 purpose、白名单外文件、篡改 `quarantineReason`、空正文、非法 reliability / 日期都返回 validation_error，且无副作用、不落盘；ingest payload 的 sourceNote 五字段原样；快照不含正文。<br>**④ 场景**：error 下的写在 commit 内、替换前拒绝，读回不变；未知锚仍为 not_found；slow 在 1499 ms 未提交、1500 ms 提交；场景来源是当前共享状态。<br>**⑤** 生成物 / 工程门 | ✓（createJob 3+7+1、confirm 1+1+2+1、intake validation 3+6+1、scenario writes 1+3+1） | 命令 1～4：**11 / 5 / 10 / 5 pass**；命令 5：`contract` / `contract --check` 20 methods，typecheck / lint 通过；real-stubs 19。**失败留痕**：① 首次 typecheck 发现新建交付物漏填 `jobId`，补齐后通过。② `742d6aa` 提交时**没有跑 clean 全量**（A12 任务命令只跑 intake spec，不含 persistence spec）。自 `742d6aa` 起，T-A11 命令 4 的 error 分支应为红（同一 `commit` 代码推断，未另跑）；在含 A13 WIP 的树上，首次批量 `test:unit` 为 **925 pass / 1 fail**，唯一失败即此例 → Astra 按范围停下 → r6.6.2 许可 → 独立 test-fix `0a2d1a5`。test-fix 前后的验证都在含 A13 WIP 的树上完成，**不表述为 test-fix 单独干净树的结果，也不补造 `742d6aa` 当时的全量绿** | 满足（经 test-fix 维护后） |
| T-A13 | `a5ad11c` | **① assign**：池记录连同预览**移入**目标作业，池中删除；dataset 追加修订；只补一条 ingest，不重放未归属期间的确认；未知投放 / 作业返回 not_found；已删除、不在池中或终结作业返回 validation_error；quarantined 原因与 sourceNote 保留。<br>**② remove**：只置 `removed=true`；`getStageWorkspace` collect 与 `listUnassignedUploads` 的当前视图去掉它；旧修订、预览、事件与快照记录保留；已归属者写 dataset 修订 + delete / remove_source，未归属者不写事件。<br>**③ cancel**：status=cancelled + reason（trim 后非空，否则 validation_error）；currentStage / stages / 各阶段工作区不变；写 delete / cancel_job（stage=currentStage，artifactId / baseRev 为 null）；不 abort。<br>**投影唯一位置**：`listUnassignedUploads` 过滤 `jobId=null && !removed`；`getStageWorkspace` collect 去掉 removed；`commit` 与快照不过滤；`getStageWorkspace` 的方法描述补了一句实现中立的话。<br>**④** 生成物 / 工程门 | ✓（assign 2+1+1+9+1+1、removeUpload 2+1+1、cancelJob 4+3+1） | 命令 1～3：**15 / 4 / 8 pass**；命令 4：`contract --check` 24 methods / 10 events / 2 artifacts，typecheck / lint 通过；real-stubs **23**；persistence / intake / read 三文件 96 pass。**`a5ad11c` 提交后 clean 树**：全量 `test:unit` **30 文件 926 pass / 0 fail**，`check` 六守卫、`git diff --check` 通过，HEAD clean | 满足 |
| T-A22a | `0032fc6` | **① cache**：`jobs` 为未筛选结果（倒序）；idle → loading → ready；重复 ensure 不重读；无轮询，计时器为 0；读 action 期间对 Storage 零调用；error 时 `listError.code='adapter_error'`，refresh 可恢复；已有数据时 refresh 不回 loading；对外视图为 `computed(readonly)`，元素层也只读。<br>**② filter**：`applyFilter(f)` 只写 `filter` / `filteredJobs`，`jobs` 保持全集；`applyFilter(null)` 不发请求、置空。<br>**③ createJob**：调用一次写 → 恰一次 refresh（有筛选时 `listJobs()` + `listJobs(filter)` 各一次）→ 返回回执 `jobs[0]`；新作业状态属于 `ACTIVE_JOB_STATUSES`；校验失败 / adapter 失败时以原 ErrorResponse 拒绝，不刷新、缓存引用不变。<br>**④ agent refresh**：四个内置脚本经真实 mock AgentClient 假时钟回放，只在带 `jobContext` 的终态恰好刷新一次；中间事件、无上下文事件、退订后的事件都不刷新；契约 `run.aborted` 变体同样处理。**S-38**：真实 error 场景下终态触发的读失败由 refresh 自身 resolve，状态为 error、缓存保留，无 unhandled rejection。<br>**main.ts**：在 agent store 订阅之后订阅 `useJobsStore(pinia).receiveAgentEvent`，并交 `app.onUnmount` / `import.meta.hot?.dispose` 解除。<br>**⑤** 工程门 | ✓（cache 5、filter 4、createJob refresh 2+1+3+1、agent refresh 4+1+4） | 命令 1～4：**5 / 4 / 7 / 9 pass**；命令 5：typecheck / lint 通过；`contract --check` 24 / 10 / 2。**末轮 clean 树**：全量 `test:unit` **31 文件 951 pass / 0 fail**，`check` 六守卫通过；既有 `test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` **24 pass / 0 fail**（4173 运行前后均无监听，Playwright 自管）；`git diff --check` 通过；本轮无失败 | 满足 |

**批次回归时间线**（实施者执行、本会话未重跑；只登记真实发生的运行）：

| 时点 | 树 | 结果 |
|---|---|---|
| `c7ebccb` 提交时 | clean | 全量 `test:unit` 28 文件 860 / 0；六守卫过 |
| `742d6aa` 提交时 | — | 只跑 A12 任务命令、contract、typecheck、lint、real-stubs；**没有跑全量** |
| A13 实现后（未提交） | `742d6aa` + A13 WIP | 全量 `test:unit` **925 pass / 1 fail**（唯一失败 = T-A11 `WI non-normal` 的 error 分支）；六守卫过；**按范围停下** |
| test-fix `0a2d1a5` 后 | `0a2d1a5` + A13 WIP | persistence / intake / read 定向 96 pass；A12 命令 11 / 5 / 10 / 5；gates 通过 |
| `a5ad11c` 提交后 | clean | 全量 `test:unit` **30 文件 926 / 0**；六守卫；`contract --check` 24 / 10 / 2；typecheck / lint |
| `0032fc6` 提交后（末轮） | clean | 全量 `test:unit` **31 文件 951 / 0**；六守卫；`contract --check` 24 / 10 / 2；typecheck / lint；既有 shell + agent E2E 24 / 0 |

本批没有新增 E2E，tasks 中本批命令也不含 E2E。全量 `pnpm -C frontend test` 和全部 E2E 属 T-G09 / T-H04。

**本批结论**：
- 4 / 4 任务的完成标准在代码层都有对应实现；19 条原定命令的标题都存在，实施者执行结果全部通过。
- 失败留痕都已真实保留：A11 新测试的 spy / 类型问题、A12 的 `jobId` typecheck、A12 → A13 的 925 / 1，后者由经 r6.6.2 许可的单独 test-fix 维护。没有放宽生产规则，也没有 skip。
- **没有发现需要新增修复任务的缺口**。按 AGENTS §2 第 9 步，本批范围记为“**已收口（待第三批独立代码 Review）**”。
- 本批对各 AC 都只是**部分前置**，不构成任何 AC 的最终验收。

## 3. 实施中的定形：是否需求变更

| 实施事实（源码确认） | 原 plan / tasks 文本 | 判定 | 同步位置 |
|---|---|---|---|
| `DataClient` 新增 9 个方法：`resetMockData(): Promise<null>`、`createJob(input: CreateJobInput): Promise<WriteReceipt>`、`submitIntake(input: IntakeInput): Promise<IntakeReceipt>`、`getIntakePreview(uploadId): Promise<ExtractionPreview>`、`confirmIntake(uploadId, mapping: FieldMapping): Promise<IntakeReceipt>`、`listUnassignedUploads(): Promise<Upload[]>`、`assignUpload(uploadId, jobId)` / `removeUpload(uploadId, reason)` / `cancelJob(jobId, reason)` 都返回 `Promise<WriteReceipt>`。`dataMethods` 共 22 个，加 agent 2 个，`contract --check` 为 24 methods | plan §2.4【r6.6】签名 | 一致（已审签名的落地），无须改 plan | interface-handoff §3 落地核对 |
| `CreateJobInput = {title, type, subject: string \| null, goal}`，strict；title / subject 用 zod `.trim().min(1)`，即**写入的是去掉两端空白后的值**；`removeUpload` / `cancelJob` 的 reason 同样 trim。`IntakeReceipt = WriteReceiptSchema.extend({upload, preview})`；两者已进 `contractSchemas` 并带 describe | plan §2.4【r6.6】“去空白非空” | 精度：明确“去空白”是变换后保存，不只是校验 | plan §2.4【r6.7】一句 |
| 首次投放到无 dataset 的作业时，同一次写内建立 `<jobId>-dataset`；ingest 事件 `artifactId` 指向该 dataset（含本次新建者），`baseRev` 在首次建立时为 null | plan §2.4【r6.6】“artifactId = dataset，baseRev = 原最新修订，没有 dataset 时为 null”（R9 S-39 指出可双解） | 精度：落在 S-39 建议的读法上，ingest 总能锚到 dataset | plan §2.4【r6.7】一句 |
| `jobs/persistence.ts` 导出 `JOBS_KEY` / `INBOX_KEY`、`PersistedJobDataSchema` / `PersistedJobData`（含 `mappingHistory`，`.default([])`）、`loadJobsSnapshot` / `saveJobsSnapshot` / `clearJobKeys`、`resetPersistenceStatus` / `getPersistenceStatus` / `onPersistenceStatus`；状态类型 `'ok'\|'degraded'\|'unreadable'` 未单独导出 | T-A11【r6.6 精度】导出清单；plan §3 | 一致（私有 API，不进产品契约）；`mappingHistory` 在 A11 即落地（§5 O-B3-1） | tasks T-A11 状态行 / 【r6.7】注 |
| `useJobsStore()` 对外暴露只读 `jobs` / `listStatus` / `listError` / `filter` / `filteredJobs`（`computed(readonly)`），以及 `ensureJobs` / `refresh` / `applyFilter` / `createJob` / `receiveAgentEvent`；另导出类型 `ListJobsFilter`。`applyFilter(f)` 成功时置 ready 并清 `listError` | T-A22a【r6.6 精度】；interface-handoff §3 | 一致；`applyFilter` 成功口径是对 refresh 成功口径的沿用，作为观察项交 Review（§5 O-B3-4） | interface-handoff §3、tasks T-A22a【r6.7】注 |

**判定**：都是已审设计的落地或名称 / 类型精度。方法集、动作矩阵（13 kind）、九场景、样例表、迁移表、定稿语义、46 AC，以及任务编号 / 依赖 / 预估 / 完成标准 / 命令都没有变。**不是需求变更**，不回 Clarify / Gate 1。同步文字统一标为【r6.7 精度（Converge batch3 登记）】，只写字段、导出名和读法，不复制实现算法，也不新增机制或要求。

## 4. P3 与精度项状态（只记事实，不冒称关闭）

| 项 | 本批事实 | 状态 |
|---|---|---|
| R9 S-38 | `refresh()` / `applyFilter()` 内部捕获读失败，总是 resolve；真实 error 场景的终态回放无 unhandled rejection，并有 `await expect(store.refresh()).resolves` 断言 | 实施侧已落实（tasks 文字未改） |
| R9 S-39 | 实现选的是“ingest 总锚 dataset（含新建）”这一读法 | 已落实；plan 补一句精度（§3） |
| R9 S-40 | `WI corrupt` 断言 reset 后状态 ok、`fai.jobs.v1` 按种子重建、`fai.inbox.v1` 已删除 | 实施侧已落实 |
| R2-B | 状态只由 DataClient 工厂建立；初始化先建 state 再 hydrate，有测试固定；没有加 guard。AgentClient 侧接入（T-A18）仍在后续 | **DataClient 侧已按口径固定**；T-A18 未做 |
| R2-E | 新增的读、reset、写都从同一个当前共享 scenario（`getJobScenario()`）取场景；v1 十个方法仍按工厂闭包捕获的 scenario，行为保留 | 按口径延续；代码未改 v1 行为 |
| R2-A / R-C | 新方法描述保持实现中立；mock 场景句未写进新方法描述。三个旧读方法描述中的 mock 句仍在 | 未处理，归 T-G06 |
| R-D ② / ⑤ | quarantined 必带原因（只来自 fixture），由 confirm 按构造保持；createJob 的 R,N,N,N 由写方法按构造保持；cancel 按 plan 保留阶段快照。没有新增 refine / guard | 按口径落实到本批写方法；①③④ 仍归 T-A14 / T-A17 / T-A20，**未修** |
| R-A / R-B 残留 / R-E / R-F / R2-C / R2-D | 本批不涉及 | **未处理**，未经 Walter 风险接受 |
| T-A17 只读门 | 本批以作业为目标的写都经 `writableJob` 查一次 delivered / cancelled，这是 §4.6 既有规则；逐方法全量只读门与“定稿 / Agent 隔离”未做 | **未冒称完成**（T-A17 / T-A18） |

## 5. 给第三批独立 Review 的观察项（不是缺口，没有新增任务，由 A 判定是否算 P3）

- **O-B3-1（任务间落点顺序）**：`mappingHistory` 的 schema 与快照投影在 **T-A11 `c7ebccb`** 就已落地：`.default([])`，A11 白名单测试断言六键；状态层 `mappingHistory: []`。tasks 原文写的是 A11 = 五键、A12 增 `mappingHistory`，A12 对 `persistence.ts` 的写权限因此没有用到。终态与 plan §2.3【r6.6】一致，批内提前落地不扩大范围，请 A 确认可以接受。
- **O-B3-2（重复删除）**：`removeUpload` 对已经 `removed=true` 的记录没有拒绝。已归属者会再追加一条 dataset 修订和一条 remove_source 事件；未归属者静默成功。confirm / assign 都拒绝已删除记录。plan / 标准没有规定重复删除的语义；UI 投影已隐藏 removed 记录，所以只能经 API 触发。没有加 guard（AGENTS §5.1）。
- **O-B3-3（Storage 其他异常）**：
  - `loadJobsSnapshot` 的 try 同时包住了 getItem，所以 getItem 抛错也会按 unreadable 处理。plan 只规定了内容损坏，这一路径没有测试。
  - `clearJobKeys` 里的 removeItem 抛错**没有捕获**，`resetMockData` 会在重建前以原始 DOMException（不是 ContractError）拒绝。plan 只规定了 setItem 的配额失败。
  - 两者概率都低，没有为此加防御。是否需要记为 P3，由 A 判定。
- **O-B3-4（共享读状态）**：`listStatus` / `listError` 由未筛选列表和筛选视图共用，`applyFilter(f)` 成功时会置 ready 并清除错误。若先前未筛选列表读失败，`jobs` 可能是旧值或空值，但状态显示 ready。plan r6.6 只写了 applyFilter 的失败口径（“同上”），成功口径是沿用 refresh 的；已有测试“the next filter read clears the error”固定了这一行为。mock 下 error 场景的读全部失败，不会出现这种组合。
- **O-B3-5（trim 是变换）**：title / subject / reason 存的是 trim 后的值（§3）。这符合“去空白非空”，plan 已补一句精度。
- **O-B3-6（证据粒度）**：test-fix `0a2d1a5` 和 `742d6aa` 都没有各自 clean 树的全量运行；第一个可引用的 clean 全量是 `a5ad11c` 后的 926 / 0。请 Review 以固定代码亲跑为准。

## 6. 上游与 H-x（只记录，不导入、不代登记）

- **上游**：main / `origin/main` 仍为 `072bb12`，不是本树祖先；本批继续 pin `90187f7`。R2-D 同步流程（tasks §7 重核 → Analyze → A 定向复核 → 指定范围小任务）不变，也**不新增人工门**。本会话不写 v2 任何树。
- **H-2·列表**：提供任务 T-A01 / A02 / A10 / A12 / A22a 现在都已实施，生产方证据如下：
  - ① 当前 `0032fc6`（含 T-A12 `742d6aa`、T-A22a `0032fc6`，祖先含 T-A01 / A02 / A10）；
  - ② 当前有效 Checklist R9 `ab742f5`；
  - ③ 定向测试 `jobs-store.spec.ts -t "WI H-2 …"` 5 / 4 / 7 / 9 pass（实施者执行，**待本批独立代码 Review**）；
  - ④ 消费方集成 SHA **未取得**。
  - → “**待消费方集成（未交付）**”，生产方 3 / 4，③ 待审核。
- **H-6**：T-A11 已提供“有覆盖时只在内存、normal 持久化”部分，但仍缺 **T-A21**（收件箱种子 / 角标样例），**未交付**。
- **H-5 / 页面切片**：未做。
- **H-1 / H-2·标签 / H-3 / H-4**：保留历史生产方证据（①②③，③ 含 A 亲跑），② 当时为 R7 / R8.1，当前有效 Checklist 可并记 R9 `ab742f5`；④ 仍缺，均为“待消费方集成（未交付）”。不代填 ④。

## 7. AC 与 Converge 核对项

- **46 AC 最终验收：0 / 46**。本批全部是“部分前置”。
- **tasks §7 写后统一刷新核对（S-31）**：
  - 本批**唯一**已接入 UI 层的写路径是 `useJobsStore().createJob`：成功后恰一次 `refresh()`，失败不刷新、缓存不变，有定向断言。
  - 其他 DataClient 写 API（`submitIntake` / `confirmIntake` / `assignUpload` / `removeUpload` / `cancelJob` / `resetMockData`）**目前没有 store / UI 调用方**（`grep` 核实）。写后 refresh 由将来调用它们的页面 / store 任务接入：T-C01 / T-C02 / T-C03 / T-B05 / T-G04，届时按本条逐条核对。
  - 不能据此声称全部写管线已交付；本批也不是这些写路径的缺口。
- **tasks §7 实施期粒度**：实施者没有回报任何任务超过 2 h，未触发拆分。两次停止都是范围问题（r6.6.1 / r6.6.2），不是粒度问题。
- **tasks §7 外部阻塞**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍未解除，必须报“未收敛（外部阻塞）”。

## 8. 结论

- **本批（T-A11、T-A12、T-A13、T-A22a，共 4 项）**：**已收口，待第三批独立代码 Review**。
  - 没有发现需要修代码或新增任务的缺口。
  - 定形只是精度，已同步到 plan / tasks / interface-handoff（r6.7）。
  - O-B3-1～6 交给 Review 判定。
- **feature 整体**：**未收敛（尚未实施 + H 组外部阻塞）**。67 项中 **20 项已实施**：前两批 16 项已完成并经批次 Review，本批 4 项待 Review。其余 **47 项未开始**：
  - A 组 8 项：T-A14～T-A21；
  - B 组 7 项、C 组 5 项、D 组 3 项、E 组 3 项、F 组 7 项；
  - G 组 10 项、H 组 4 项。

  46 AC 最终验收为 0；H 组仍 `blocked_by: frontend-workbench-v2`。
- **不是** Review 通过、不是 Gate 2、不是 Handoff；没有写 `review.md`；H-x 无一“已交付”。

## 9. 下一步

1. **第三批独立代码 Review**：由审核员 A 进行，须是新会话、与实施异模型；模型按 AGENTS §6，首选 `claude-fable-5-1`，先试 bridge，不通再走 anthropic。
   - **只读输入**：
     - 冻结 spec.md；
     - plan.md / tasks.md（含 r6.6 / r6.6.1 / r6.6.2 / r6.7）；
     - checklist R9；
     - 本报告与 analyze.md「Analyze R13」；
     - 固定代码 diff `ab742f5..0032fc6 -- frontend`，逐提交见 §0。
   - **重点审查**：
     - 持久化白名单补列 `quarantineReason` 与内部 `mappingHistory` 的真实 diff（R9 交代的核对项）；
     - test-fix `0a2d1a5` 是否只改 error 分支；
     - `real-stubs.spec.ts` 是否只增不改；
     - §5 O-B3-1～6；
     - R2-B / R2-E 口径；
     - S-31 中 createJob 一条写路径的写后刷新。
   - A 可以亲跑本批 19 条命令；本报告中的测试结果都由实施者执行。
2. Review 后按 DAG 派后续任务。以本批 4 项计入后，依赖已全部满足的任务（只读脚本 `converge-ready.py` 复算）为：T-A14 / T-A15 / T-A16（依赖 T-A11）、T-B01（依赖 A10 / A22 / A22a / A23）、T-C01（依赖 A22 / A12 / A22a）。批次划分由集成人决定，本报告不预写。
3. main `072bb12` 的同步决策由集成人 / Walter 作出，本 feature 不自动导入。
4. 本 worktree 的文档改动由集成人审阅后提交，本会话不 commit。
