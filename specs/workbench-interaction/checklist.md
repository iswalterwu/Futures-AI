# Feature: workbench-interaction 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求 / 设计质量达标，不代表实施完成。实施者不勾选本文件。
>
> **审核员**：A = claude-fable-5-1 **via anthropic**（`--model anthropic/claude-fable-5-1`），独立新会话，与实施模型隔离。
> **R11 通道（2026-10-29，第五批 r6.12 派工准备的限定范围定向复核）**：A = claude-fable-5-1 via anthropic（`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`，PI_SESSION_ID `01a18938-3e93-7225-b28c-5323c62758f9`），新开独立会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch4`（HEAD `fdac9f2`，clean）。协调器本窗口对 `claude-bridge` 的真实调用已明确为 **quota / spend_limit 类**失败且无重置证据，按 AGENTS.md §6 规则 5 不在本限额窗口重试；**fable 未单独探 bridge，不声称探过**；官方 `anthropic/claude-fable-5-1` 近期最小 / 正式调用成功，本轮实际任务走该通道。按 §6 规则 2 只换通道、不换模型；被审作者 = claude-opus-5-5 via anthropic（Plan / Tasks r6.12、Analyze R21、implementation-log §20、interface-handoff、README 行），与 A 异模型、隔离；Implement 首选 openai/gpt-6-astra，与 A 异模型。未改任何 provider / key / 路由 / 全局配置；不因审核结果换模型。
> **R10 通道（2026-10-29，第四批 r6.9 派工准备的限定范围定向复核）**：A = claude-fable-5-1 via anthropic（`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`，PI_SESSION_ID `01a187cd-624c-71de-96e0-1767b222d743`），新开独立会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch4`。协调器本窗口对 `claude-bridge` 的真实最小调用已明确为 **quota / rate / spend_limit 类**失败，按 AGENTS.md §6 规则 5 不在本限额窗口重试；**fable 未单独探 bridge，不声称探过**；`anthropic/claude-fable-5-1` 本批最小真实调用 exit 0（`Temp/wi-batch4-01a18388-nzh9q1wh/probe-fable-summary.json`：exit 0 / healthy / success），本轮实际任务走该通道。按 §6 规则 2 只换通道、不换模型；被审作者 = claude-opus-5-5 via anthropic（Plan / Tasks r6.9、Analyze R16、implementation-log §14、interface-handoff、README 行），与 A 异模型、隔离；Implement 首选 openai/gpt-6-astra，与 A 异模型。未改任何 provider / key / 路由 / 全局配置；不因审核结果换模型。
> **R9 通道（2026-10-29，第三批 r6.6 派工准备的限定范围定向复核）**：A = claude-fable-5-1 via anthropic（`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`、PI_SESSION_ID `01a186ba-c493-712f-b230-5598ff50670c`），新开独立会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch3`。协调器本轮对 `claude-bridge/claude-opus-5-5` 的真实最小调用 exit 1，失败类别 = **quota / rate / spend_limit 类**，bridge 通道在本限额窗口已明确限额，按 AGENTS.md §6 规则 5 不重复试；**fable 未单独探 bridge，不声称探过**；`anthropic/claude-fable-5-1` 最小真实调用 exit 0，本轮实际任务走该通道。按 §6 规则 2 只换通道、不换模型；被审作者 = claude-opus-5-5 via anthropic（Plan / Tasks r6.6、Analyze R12、implementation-log §10、interface-handoff、README 行），与 A 异模型、隔离；Implement 首选 openai/gpt-6-astra，与 A 异模型。未改任何 provider / key / 路由 / 全局配置；不因审核结果换模型。
> **R8.1 通道（2026-10-29，B-12 拆分 r6.4 的增量复核）**：A = claude-fable-5-1 via anthropic，新开独立会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch2-r81`。协调器本轮对 `claude-bridge/claude-fable-5-1` 的真实最小调用 exit 1，失败类别 = **provider / invocation error（未确认为 quota / 限额）**；同模型 `anthropic/claude-fable-5-1` 最小真实调用与本任务均 exit 0，本轮实际走该通道。按 AGENTS.md §6 规则 2 只换通道、不换模型；被审作者 = claude-opus-5-5 via anthropic（Tasks r6.4 / Analyze R10 / implementation-log / interface-handoff / plan 两处 / README 行），与 A 异模型、隔离；Implement 首选 openai/gpt-6-astra，与 A 异模型。未改任何 provider / key / 路由 / 全局配置；不因审核结果换模型。
> **R8 通道（2026-10-29，第二批 r6.3 派工准备定向复核）**：A = claude-fable-5-1 via anthropic，新开独立会话、独立 worktree。协调器本轮对 `claude-bridge/claude-fable-5-1` 的真实最小调用 exit 1，失败类别 = **provider / invocation error（未确认为 quota / 限额）**；同模型 `anthropic/claude-fable-5-1` 最小真实调用 exit 0，本轮实际任务走该通道。按 AGENTS.md §6 规则 2 只换通道、不换模型，不编造本窗口限额证据；被审作者 = claude-opus-5-5 via anthropic（Plan / Tasks r6.3 / Analyze R9 / implementation-log §9 / interface-handoff §5-8），与 A 异模型、隔离；Implement 首选 openai/gpt-6-astra，与 A 异模型。未改任何 provider / key / 路由 / 全局配置，不因审核结果换模型。
> **R7 通道（2026-10-28，恢复轮 r6 定向复核）**：A = claude-fable-5-1 via anthropic，新开独立会话。本窗口协调器对 `claude-bridge/claude-opus-5-5` 的真实最小调用 exit 1（quota / rate / spend_limit 类，错误原文未记录），bridge 通道在本限额窗口已明确限额，按 AGENTS.md §6 规则 5 不重试；**fable 未单独重探 bridge，不声称 fable bridge 探活成功**；`anthropic/claude-fable-5-1` 最小真实调用 exit 0，本轮实际任务走该通道。被审作者 = claude-opus-5-5 via anthropic（Plan r6 / Tasks r6 / Analyze R6 / interface-handoff），与 A 异模型、隔离。未改任何 provider / key / 路由 / 全局配置，不因审核结果换模型。
> **R6 通道（2026-10-28）**：A = claude-fable-5-1 via anthropic。继承本限额窗口 R3 / R4 / R5 的可用通道证据（`claude-bridge` 对 fable 已为 quota / rate / spend_limit 类失败，exit 1；`anthropic/claude-fable-5-1` 成功），按 AGENTS.md §6 规则 5 **本轮未重探 bridge、未换模型、未改任何 provider / 路由 / 配置**。Tasks r5 / Analyze R5 作者为 claude-opus-5-5 via anthropic（独立会话、不同模型），与 A 隔离。只因正常审核结果修正文档，不换模型找通过。
> **R5 通道（2026-10-28）**：A = claude-fable-5-1 via anthropic。继承本限额窗口 R3 的探活证据（`claude-bridge/claude-fable-5-1` 失败：quota / rate / spend_limit 类，exit 1；`anthropic/claude-fable-5-1` 成功，exit 0；R4 亦经 anthropic 实际完成），按 AGENTS.md §6 规则 5 **本轮未重探 bridge、未换模型、未改任何 provider / 路由 / 配置**。Tasks / Analyze 作者为 claude-opus-5-5 via anthropic（独立会话、不同模型），与 A 隔离。
> **R4 通道（2026-10-28）**：A = claude-fable-5-1 via anthropic。继承本限额窗口 R3 调度会话的探活证据——`claude-bridge/claude-fable-5-1` 已失败（quota / rate / spend_limit 类，exit 1）、`anthropic/claude-fable-5-1` 成功（exit 0）；按 AGENTS.md §6 规则 5 不在同一限额窗口重试已耗尽通道，**本轮未再发起 claude-bridge 探活**，直接走 anthropic；只换通道不换模型，未改任何 provider / 路由 / 配置。Plan 补正者为 claude-opus-5-5 via anthropic（独立会话、不同模型），与 A 隔离。
> **切换原因**（R3，2026-10-28）：调度会话按 AGENTS.md §6 规则 2/5 做本轮最小真实探活——`claude-bridge/claude-fable-5-1` 失败（quota / rate / spend_limit 类，exit 1），`anthropic/claude-fable-5-1` 成功（exit 0）；按 §6 只换同一模型的接入通道，不换模型、不在本限额窗口内重试 bridge；审核员身份不变。（R2 时的切换原因同类，当时依据为 AGENTS.md §2 第 5 步旧文，现并入 §6。）
> **单审**（AGENTS.md §2 第 5 步、§6）：本文件结论即审核结论。
>
> **文件结构**：§R11 为**当前有效结论与勾选**（唯一参与 Implement 前置判定的复选框；审查对象固定为提交 `fdac9f2be23dabef2b825ba9f2393477e0eaf76b`，增量范围 = `4bc6627..fdac9f2` 的第五批 r6.12 开码前精度（T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04）与结构复算；**结论通过：26 ☑ / 0 ☐，0 P1 / 0 P2，5 项 P3 S-44～S-48 不阻断；T-A13a（R3-B）独立判定为既有领域规则、不需 Walter §5.1 另批**；R10 已通过的 26 项按其原判定沿用、本轮只核“未回退”并对 r6.12 触及的项重新判定；第五批有效 Checklist = 本节被集成人提交后的 SHA）；§R10（审查对象 `94f1f83`，26/26 通过，r6.9 定向复核的历史快照，其复选框已改为 ☑ 文字；第四批据其提交 `37e2f71` 开码并经 `review-batch4.md` / `review-batch4-r4a.md` 闭环通过）；§R9（审查对象 `ef64c18`，26/26 通过，r6.6 定向复核的历史快照，其复选框已改为 ☑ 文字；第三批据其提交 `ab742f5` 开码并经 `review-batch3.md` / `review-batch3-cache-fix.md` 通过）；§R8.1（审查对象 `8bf56b8`，26/26 通过，r6.4 增量复核的历史快照，其复选框已改为 ☑ 文字；第二批据其提交 `34d339e` 开码并经 `review-batch2.md` 通过）；§R8（审查对象 `8ad5e28`，25 ☑ / 1 ☐，r6.3 设计定向复核的历史快照——其 B-12 / V-02 ☐ 已由 r6.4 + §R8.1 关闭；编号 Checklist R8 与 analyze.md 的 Analyze R8 / R9 无关）；§R7（审查对象 `0e37fbf`，26/26 通过，r6 设计有效结论；其“Implement 仍 BLOCKED（IMPL-GATE-R6 (2)(3)）”为 R7 时点原文，后已满足并据此实施首批 10 项）、§R6、§R5、§R4、§R3、§R2、§R1 为历史快照（内容原样保留，其复选框均已改为 ☐ / ☑ 文字，**不参与**当前判定；R3 的 3 项 ☐ 表示 R3 当时未闭环的 B-09 / B-10，R4 已关闭；R5 的 1 项 ☐（P-1）表示 R5 当时未闭环的 B-11，R6 已关闭；R6 的 26 ☑ 只覆盖 r5 设计，其“`implementation_base_sha = PENDING` / Implement 不得开工直到合入 main 的 commit 登记”为 R6 时点原文，基线门已由 `43b6d79` 满足——以 §R7 为准）。
> 阶段不适用项（Tasks / Analyze / 代码级 / Handoff 截图）统一放在当前轮「阶段说明」，以文字说明而非复选框，避免未来项造成流程死锁；Tasks 产出后由 A 另开会话复核并补勾。

---

# R11（2026-10-29，第十一轮：第五批 r6.12 派工准备（采集台闭环 T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04）的限定范围定向复核；只核协调器八项审查重点、R10 已认可项“未回退”与结构数字，不重审既有设计；本节是 **Checklist R11**，与 analyze.md 的「Analyze R21」无关，也**不是**第五批代码 Review）

## 基线与范围

- **审查对象（固定）**：本工作树 `D:/2030/Futures-AI-interaction-checklist-batch4`，分支 `review/workbench-interaction-batch4-checklist`，HEAD = `fdac9f2be23dabef2b825ba9f2393477e0eaf76b`，启动时 `git status` clean。增量 diff `git diff --stat 4bc6627..fdac9f2`：**6 文件 +436 / −65，全部在 `specs/`**——`specs/README.md`（本 feature 行 + 跨 feature 行）、`analyze.md`（页首当前结论 + 新增「Analyze R21」）、`implementation-log.md`（页首块、§8 r6.12 段、新增 §20）、`interface-handoff.md`（页首 r6.12 块、§1 r6.12 口径、§3 r6.12 接口精度）、`plan.md`（页首 r6.12 行；§2.1 / §2.2 / §2.3 / §2.4 / §3 / §5 各一处【r6.12】）、`tasks.md`（页首 r6.12 块；§2a 两格；新增 T-A01a / T-A13a / T-A15a；T-A15 / A17 / B06 / C01 / C01a / C02 / C03 / C04 / D02 / E03 / F03；§5 标题注 + 7 行；§6 一段）。**独立核实的零差异**：`git diff --stat 4bc6627..fdac9f2 -- docs AGENTS.md HANDOFF.md frontend backend templates design` 为空；`git diff --stat ae592ba fdac9f2 -- frontend` 为空（源码 = R4-A 关闭时受审 `ae592ba`）；spec blob `102af73b…`、本文件 HEAD blob `4537c55f…`（= `37e2f71` 提交的 R10 原件）均未动；spec `AC-\d{3}-\d` 去重 = 46。
- **重读**（本轮开始时重新读取，不依赖会话记忆）：AGENTS.md（§2 第 5～8 步、§3、§4、§5、§6）、`docs/designUI.md` §3.2～§3.4（“右侧常驻产物版本与介入历史”）、冻结 spec v1.1 全文（46 AC；R-003 / R-007 / R-008 逐句）、plan.md 页首 r6.12 与 §1 / §2.1～§2.4 / §3 / §4 / §5 全文、tasks.md（页首 r6.12 块、§1 全局约定、§2 S-11、§2a、§3、T-A01 / T-A13 / T-A13a / T-A15 / T-A15a / T-A17 / T-B06 / T-C01～T-C04 / T-D02 / T-E03 / T-F03 全文、§5、§6、§7）、analyze.md「Analyze R21」全文、implementation-log 页首 / §8 r6.12 段 / §20 全文、interface-handoff 页首 / §1 / §3 r6.12 段、`specs/README.md` 本 feature 行、本文件 §R10 全文、`review-batch3.md` §5 R3-B 原文与 §2 T-A13 行、`review-batch4-r4a.md`（R4-A 关闭范围）。
- **真实代码事实（本树 frontend = `ae592ba`，逐文件读 / 只读脚本，不以作者 Analyze R21 §1 摘要代替；下列为本审核员独立核得）**：
  - `contracts/mock/job-state.ts`（341 行）：`removeUpload` = `findUpload` → 已归属时 `writableJob` → **无条件** `upload.removed = true` → 已归属者 `appendDatasetRevision`（新修订 + `delete / remove_source` 事件 + `job.updatedAt`），未归属者 `emptyReceipt()`；**不检查 `removed`**。`confirmIntake` 对 `upload.removed || status !== 'pending_validation'`、`assignUpload` 对 `jobId !== null || removed || 不在池中` 均抛 `validation_error`。所有写经唯一 `commit(mutator)`：mutator 抛错发生在 `state = validated` 之前 ⇒ 无部分修改、不触发 `saveJobsSnapshot`。`findJob`：未知 id 抛 not_found，`emptyJobIds` 命中返回 null；`state.interventions` 为带 `jobId` 的扁平数组。`confirmIntake` 回执 `upload` 为确认后记录（`mapping` = 修正值、`status` = ingested / 有 `quarantineReason` 时 quarantined），`preview` = `previews[uploadId]` 不变；`submitIntake` 的 `Upload.mapping = structuredClone(preview.fields)`。`getStageWorkspace(…,'collect')` 过滤 removed；`listUnassignedUploads` = `jobId===null && !removed`。⇒ R3-B 事实属实；A13a 的检查位置（findUpload / writableJob 之后、写入之前）与 confirm / assign 同构；C02 “映射草稿初值 = `upload.mapping` 而非 `preview.fields`”“confirm 以回执替换选中”与真实回执一致。
  - `contracts/mock/index.ts`：`readJobState` = `delayScenario`（slow 1500 ms）→ `read()`（未知锚 not_found 独立于场景）→ error 场景抛 `adapter_error` → `parseBoundary`；`writeJobState` 先 parse params 再延迟再写。⇒ T-A15a 标准 2 的 slow / error / not_found 口径与既有读方法同源（R2-E）。
  - `contracts/types.ts`：`CONTRACT_VERSION = '2.0.0'`；九张 `*Label` 常量 + `labelSchema()`（模块私有函数，同文件可用）+ `contractSchemas` 注册；`SourceNoteSchema.reliability` 为内联 `z.enum(['high','medium','low','unknown'])`（`.options` 可用，zod 4.6.7）；`IntakeFileMetaSchema` 以扩展名白名单 refine、`type` 允许空串；`IntakeInputSchema` 为 `discriminatedUnion('inputKind')`（`.options[i].shape` 可用）；`FieldMappingSchema` 三字段 `min(1)`；`UploadSchema` 带可选 `quarantineReason`；`InterventionSchema` 十字段、`InterventionPayloadSchema` 按 `action` 判别。⇒ A01a 只加一张映射 + schema + 注册即可（`labelSchema` 现成）；C01 / C02 的表单边界 schema 都是契约现有导出。
  - `contracts/methods.ts`：22 个 `dataMethods` + 2 个 `agentMethods` = 24（`contract --check` 当前 24 methods）；`removeUpload.params` = `z.tuple([uploadId, reason: trim().min(1)])`；`listJobs.params` 的 `strictObject(...).optional()` 写法可被 `listInterventions` 直接沿用。`contracts/client.ts` 无 `listInterventions`；`contracts/real/index.ts` 逐方法 `NotImplementedError`。
  - `tests/unit/jobs/real-stubs.spec.ts`：`requests` 22 键 + `satisfies { [M in keyof DataClient]: … }` 全键约束 + 键集合断言 + `test.each` 22 ⇒ 23 例；新增 `DataClient` 方法时**必须**追加一键否则 typecheck 失败，追加后 24 例。
  - `tests/unit/jobs/contract-labels.spec.ts`：`WI enums` 2、`WI labels` = 9 张 `mappings` `test.each` + 1 = 10、`WI contract notes` 1；新增独立 describe 不改 `mappings` ⇒ `-t "WI labels"` 仍 10。v1 `contract-doc.spec` / `contracts.spec` 的方法 / schema 计数均从 `methodSemantics` / `contractSchemas` 动态取（`arrayContaining` / `Object.keys(...).length`），新增方法与 schema 不破坏 88 例。`scripts/contract-build.mjs` 对 `contractSchemas` 逐项表驱动渲染（`UploadStatusLabel` 小节即先例）⇒ `ReliabilityLabel` 小节自动生成、生成器不改。
  - `tests/unit/jobs/job-state-pool.spec.ts`：`WI assign` 2、`WI removeUpload` 2 + 1 + 1 = **4**、`WI cancelJob` 5；无任何用例对同一投放重复 remove ⇒ A13a 不改变原 4 例结果；新组标题 `WI R3-B repeated remove` 不匹配 `-t "WI removeUpload"`。
  - `jobs/stores/jobs.ts`（113 行）：私有 `readDetail` 每次成功 `currentJob.value = job`（契约返回新对象），对外 `computed(() => readonly(currentJob.value))` ⇒ 引用随每次详情读替换（含 `refresh()` 锚非空分支与同作业切阶段）；`refresh()` 列表 / 详情各自 try；无 `listInterventions` / intake 成员。⇒ B06 “`props.job` 替换即重读”有真实信号源，不需新增 store 成员。
  - `jobs/pages/JobDetailPage.vue`（106 行）：`watch` 回调含 R4-A 的 `onCleanup` / `stale` / `!stale` 六行；根 `<section class="job-detail" aria-label="作业详情">` 为 grid；ready 且有作业分支 = 详情头 + `StageRail` + `StageWorkspace(:stage)`。`jobs/components/StageWorkspace.vue`（26 行）只接收 `stage`、渲染 `aria-label="<阶段>工作区"` 占位。`jobs/pages/JobListPage.vue`：`h1` “作业”、`.job-create-toggle` 按钮、`.job-filters`（含唯一清除按钮，`.job-filters button`）。⇒ C01a 的 `.intake-slot` / “投放”按钮落点与现页面结构相容；`.job-filters button` 选择器不受抽屉影响（抽屉不在 `.job-filters` 内）。
  - `shared/components/Loading.vue` = `<p class="loading-state" role="status" aria-busy="true">`；`ErrorState` props `{moduleId, error, ts?}`、重试仅 retryable；`EmptyState` props `{message?}`。
  - 已审断言的真实约束：`job-detail.spec.ts`（13 例）全局取 `h1` / `.job-type` / `.job-status-badge` / `.job-subject` / `.job-goal` / `[aria-current="step"]` / `[aria-pressed="true"]`，`findComponent(Loading)` 在 slow ready 后须不存在，`reads.mock.calls` 恰 `[['j-process'],['j-process']]`、`lists` 不被调用、`listStatus` 保持 idle，`[aria-label="分析工作区"]` 含“由后续任务提供”；`detail-stage.spec.ts`（5）/ `list-create.spec.ts`（1）E2E 以严格模式取 `heading level 1`、`region "作业详情" / "<阶段>工作区" / "新建作业"`、`navigation "作业阶段"`、`.job-status-badge`、`.job-card h2 a`；`job-list.spec.ts`（12）取 `select[aria-label="状态"|"类型"]`、`input[aria-label="标题"]`、`.job-filters button`。⇒ r6.12 “新组件不渲染 h1 / `.job-*` / `aria-current` / `aria-pressed` / `JobStatusBadge`、可访问名称不重名、默认收起不读、`<aside>`（role complementary，非 region）”逐条对应这些断言，是必要而非多余的约束。
  - fixtures：`interventions.json` 6 条种子——j-collect 仅 1 条（collect / ingest）；j-process（process / approve）；j-running（analyze / ask_why）；j-deliver 2 条（deliver / rewrite 与 framework，**同一 `createdAt` 08:02:00**）；j-delivered（deliver / finalize）。`uploads.json` 池 2 条（`u-unassigned-file` pending、`u-unassigned-quarantine` quarantined 带原因），`job-detail.json` 各作业 2 条 url 投放，**所有种子 `mapping === preview.fields`**。⇒ C02 标准 1 必须经 `jobFixtures` 注入“mapping ≠ fields 的待验证投放”（任务已写明）；A15a 的“同刻保持记录顺序”有真实种子可断言（j-deliver）；跨阶段筛选用 j-collect 单一作业只能得到 `[]` 对照，覆盖“跨阶段 / kind 种子”须另取 j-deliver / j-process（见 S-47 实施提示）。
  - 测试环境（只读内省，非产品测试）：`vitest.config.ts` environment = **happy-dom 21.0.4**、`restoreMocks: true`；本树无 `node_modules`，本审核员用 Node 25.2.1 在只读目录 `D:/2030/Futures-AI-interaction-review-batch4/frontend/node_modules` 内省：happy-dom `File.prototype` 自有属性只有 `constructor`，`text / arrayBuffer / stream / slice` **继承自 `Blob.prototype`**；`FileReader.prototype` 自有只有 `constructor`，`readAsText / readAsArrayBuffer / readAsDataURL / readAsBinaryString` 为继承方法；`new File(['abc'],'a.csv',{type,lastModified})` 的 `name / size / type / lastModified` 正常；`URL.createObjectURL` / `DataTransfer` / `DragEvent` / `FileList` 均存在。vitest 5.0.5 的 `@vitest/spy` `spyOn` 经 `getDescriptor` **沿原型链**找到描述符，并把 spy 以自有属性定义在传入对象上、restore 时 `deleteProperty`；vitest happy-dom 环境以 `populateGlobal` 把 `File / Blob / FileReader / FileList` 注入全局（KEYS 列表含这四项）。⇒ T-C01 harness “在系统边界 spy `File.prototype.{text,arrayBuffer,stream,slice}` 与 `FileReader.prototype.readAs*`”**在当前环境真实可行**，不需生产 shim；`restoreMocks` 保证逐例恢复。zod 4.6.7 `ZodTuple` 无 `.items` getter（`removeUpload.params` 的 reason schema取 `.def.items[1]` 或整元组 `safeParse`），实施提示见 S-47。
  - `scripts/check.mjs`：`checkGlass` 允许集合 `{glass-focus, glass-module, glass-drawer}`，`glass-drawer` 已被 `agent/AgentDrawer.vue` 使用；`.intake-drawer` / `.intake-slot` 不以 `glass-` 开头不命中；`checkGrid` 要求 `1fr` 包在 `minmax()` 内（B06 已写明）；`checkNetwork` 只扫网络 API。`tsconfig.json` `include` 含 `tests/**`、`e2e/**` ⇒ `typecheck` 真实检查测试里的 `@ts-expect-error`（既有先例 `job-state-read.spec.ts:187`）。
- **审核员与通道**：A = **claude-fable-5-1 via anthropic**（`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`，PI_SESSION_ID `01a18938-3e93-7225-b28c-5323c62758f9`），新开独立会话、独立 worktree；协调器本窗口对 `claude-bridge` 的真实调用已明确为 quota / spend_limit 类、无重置证据，按 AGENTS §6 规则 5 不重试；**fable 未单独探 bridge，不伪称**；官方 `anthropic` 通道近期最小 / 正式调用成功，本轮实际任务走该通道。只换通道不换模型；被审作者 = claude-opus-5-5 via anthropic（Plan / Tasks r6.12、Analyze R21、implementation-log §20、interface-handoff、README 行），与 A 异模型、隔离；Implement 首选 openai/gpt-6-astra，与 A 异模型。未改任何 provider / key / 路由 / 全局配置；不因审核结果换模型。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试（仅只读 Node 内省第三方包的原型与 spy 实现，不执行仓库测试）、未启动子 agent / 服务、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写入任何其他 worktree、未修改 plan / tasks / analyze / implementation-log / interface-handoff / spec / README / 代码 / fixtures / tests / 审核原件。结构复算用**本审核员自写**的 `python` 一次性脚本只读完成（不沿用作者 `prepare-struct.py` 或 R10 脚本；依赖按真实图 DFS 环检测、编号前向另记 BACKEDGES、依赖行先剥去括注再取任务号、矩阵祖先与双向按任务正文 AC 引用核），脚本与日志在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/checklist-r11/`（`r11-struct.py`、`struct-HEAD.log`、`struct-parent.log`、`std-cmd-diff.log`、`tasks-HEAD.md` / `tasks-parent.md` 及其 `.r11dump.txt` / `.matrix`、`introspect.mjs`、`r11-section.md`；非项目产物、不入库、不清理共享 tmp）。唯一写入的仓库文件为本文件（新增 §R11、页首 R11 通道行与「文件结构」段、把 §R10 的 26 个 `[x]` 改为 ☑ 文字并在其标题补“历史快照”；R10 其余内容未动）。本审核员不 commit、不改 README / tasks 状态、不填 Gate 1 / Gate 2；**第五批有效 Checklist = 本节被集成人提交后的 SHA；未提交前 T-A01a 不得开码**。

## 结论（R11）：**通过**（定向；r6.12 的 T-A15a 拆分与移交、T-B06 挂载权 / 默认收起 / `currentJob` 替换重读、T-A01a `ReliabilityLabel`、intakeStore 公开 / 内部成员与写后刷新口径、`StageWorkspace` collect 分发与 `CollectWorkspace`、C01 File 元数据边界与 harness、C02 / C03 / C04 接线、T-D02 / E03 / F03 显式依赖、文件所有权与回归命令，全部判定为**既有需求与既有设计内的机制 / 粒度 / 顺序精度**，不需回流 Clarify / Gate 1、不改 spec / 46 AC；**T-A13a（R3-B）独立判定为既有领域规则，可在现有授权内实施，不需 Walter AGENTS §5.1 另批**；**0 P1 / 0 P2**；5 项 P3 建议 S-44～S-48 不阻断）——**26 项当前有效检查项 26 ☑ / 0 ☐**。

本结论的边界（必须同时成立，不得单独引用）：

1. 本轮只核协调器八项审查重点（§1～§8）、R10 已通过项“未回退”与结构数字；R10 的 26 ☑ 按其原判定沿用，本轮对 r6.12 触及的项（N-02 / N-03 / N-04 / I-01a / I-01b / I-03 / I-04 / V-01 / V-02 / V-03 / P-1 / P-2 / P-3 / P-5 / P-6 / P-7 / C-01 / C-02 / C-03 / C-04 / C-06 / C-07）重新判定，其余（N-01 / C-05 / C-08）只核未回退。第五批 9 项**均未实施**，一行代码未写、一条测试未跑（`frontend` 与 `ae592ba` 零差异）；46 AC 最终验收仍 **0**；27 / 73 的“已完成”= 批次 / 增量代码 Review 通过而非 AC 验收；feature **未收敛**（46 项未开始 + H 组 `blocked_by: frontend-workbench-v2`）。本轮未运行任何产品测试，不声称任何命令会通过；未写的 tests 不是证据。Gate 2 / Handoff 不在本阶段。
2. 本审核员不代 Walter 做风险接受（R4-B～R4-E / S-41 / R3-C / R-A / R-B 残留 / R-C / R2-A / R-D ①③④ / R-E / R-F / R2-B AgentClient 侧 / R2-D 仍未处理、未经风险接受；**R3-B 本轮只是判定“可在领域规则内实施”并把落点定在 T-A13a，R3-B 本身维持开放，关闭与否由第五批代码 Review 对真实 diff 判定**，不预宣），不代 v2 接收方签收 interface-handoff §5，不代 v2 集成树所有者登记任何 H-x ④，不就 main `072bb12` 的同步做决定。
3. 按 AGENTS §2 第 8 步，Implement 前置 = 当前有效轮次全部勾选；本节 26 ☑ ⇒ 第五批可在**本节被提交后**按 tasks §6 DAG 在同一实施树串行开码（T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04；A01a / A13a / A15a 三者互不依赖，作者选定的顺序是执行顺序而非拓扑要求）。本节未提交前仍为 blocked。本节是 Analyze R21 §7 所指“开码前定向复核”，由集成人裁量发起；**不替代**第五批完成后的独立代码 Review。

## 独立核验（不照单全收作者结论）

### 1. T-A15a 拆分与 T-B06 / T-C04 依赖显式化（协调器重点 1）

- **拆分无损**：父 `4bc6627` 的 T-A15 标准 4“筛选结果正确；十个字段齐全（AC-007-1 部分前置）”与命令 4 `-t "WI listInterventions"` 在 HEAD 从 T-A15 删除（原文保留为“移交原文”），在 T-A15a 标准 1 / 命令 1 以更具体的形式重现（jobId 归属、`createdAt` 升序与同刻稳定、stage / kind 单项与组合、十字段过 `InterventionSchema`、未知作业 not_found、empty 预置 `[]`、返回副本）；另增标准 2（场景同源 + real 桩）与工程门。T-A15 余 4 条标准 / 命令，1.5 → 1 h；A15a 0.5 h，总工时不变。`listInterventions` 自 r5 起就在 plan §2.4 方法清单中——**不是新 what**，只是把一个只读方法从七个分析写动作中解耦。✓
- **C04 历史展开取证保留**：T-C04 标准 2 原句“并核对介入历史展开内容；不新增窗口钩子”逐字保留，【r6.12】只是把“展开后可见哪些字段 / 文案”具体化；原依赖只有 C03 / B04，而介入历史界面在 B06、读方法在 A15 ⇒ 这是真实的隐含依赖缺口，+B06 是唯一诚实做法（删该句讨绿是 AGENTS §6 规则 6 禁止的方向）。✓
- **B06 依赖改写**：T-A15 → T-A15a + T-A01a（ingest 摘要要显示可靠性文案）。两者均在本批、前向。
- **D02 / E03 / F03 增依赖 B06**：三者既有标准分别断言“介入历史出现 kind=recipe”“介入历史只多一条事件”“介入历史出现三条 framework 事件”（本审核员逐条核对原文），端到端若没有 B06 的界面只能伪造或删句 ⇒ 增依赖是对既有标准的忠实显式化，标准 / 工时 / 矩阵不改、无新需求、无覆盖丢失。T-A17 增 A15a：其标准 2 原文已用 `listInterventions` 读回验证原子性 ⇒ 同理。✓
- **矩阵 7 行**：parent → HEAD 的 §5 逐行 diff 只在 AC-003-3 / 003-5 / 007-1 / 007-3 / 008-1 / 008-2 / 008-3 的**部分前置列**（+A01a / +B06、+C01a、A15 → A15a、+A13a、+A01a、+A15a、+A15a），最终任务与最终命令 46 行零变化。
- **真实图**：本审核员脚本（依赖行先剥括注）DFS：**CYCLE None**；编号前向检查 **BACKEDGES = [(T-B03, T-B04)]**，与父相同、无新回边；`T-B06 ∈ ancestors(T-C04)`、`T-A15a ∈ ancestors(T-A17)`、`T-A15 ∌ T-A15a`（A15 不反向依赖 A15a）均属实；矩阵 46 = spec 46、`PARTIAL_NOT_ANCESTOR = []`、`BIDIR_BAD = []`。注意：T-B06 依赖行的括注“（r6.12：原依赖 T-A15 改为只读的 T-A15a）”含非依赖任务号 T-A15，不剥括注的脚本会误判 B06 依赖未开始的 T-A15 → 见 S-44（措辞，不阻断）。

### 2. T-A01a `ReliabilityLabel` 与 T-A15a 接口（协调器重点 2）

- **A01a 是 S-11 同机制的必要契约增量**：spec R-003 what 原文“可靠性（高 / 中 / 低 / 未知）”，AC-001-5 / tasks §1-7 / S-11 要求展示文案由契约声明、组件不另建映射；T-C01 表单、T-B06 ingest 摘要、T-C04 取证三处消费同一文案，组件内各写一份即 S-11 所禁。实现 = 第十张 `as const` 常量 + 既有私有 `labelSchema()` + `contractSchemas` 注册 + 重新生成；键集合 / 顺序 = `SourceNoteSchema.shape.reliability.options`（high / medium / low / unknown）、文案 高 / 中 / 低 / 未知与 spec 逐字一致；不新建 `ReliabilitySchema`（字段已存在）、不改 `SourceNoteSchema`、不升 `CONTRACT_VERSION`（`listInterventions` 属 2.0.0 已声明的作业方法清单——plan §2.4 方法清单自 r5 即含它，`contractSemantics.contractChange` 原文“作业方法随状态层任务逐项接入，本版本号本身不表示状态层已实现”——第三批逐项接入九个写方法时同样未升版；展示映射只是 2.0 内的增量；本轮沿用既有口径）。`contract-labels.spec` 只新增独立 describe、`mappings` 不加项 ⇒ `-t "WI labels"` 仍 10、H-2·标签 ③ 的集合不扩大；v1 88 例按动态计数不受影响；生成器不改。✓
- **A15a 参数与语义**：`listInterventions(jobId, filter?: {stage?, kind?})`，filter strict、省略不限制（`listJobs` 同写法）；结果 `Intervention[]`；mock 走 `readJobState` ⇒ empty 预置 id 返回 `[]`（`findJob` 得 null 后过滤空数组）、未知作业 not_found、error 场景 adapter_error、slow 1500 ms——与既有读方法**同源**，不另造延迟 / 错误分支。`job-state.ts` 直接过滤 `state.interventions` 并返回 `structuredClone` 副本——**读的是唯一状态层，不是 API 历史副本或第二份存储**；按 `Date.parse(createdAt)` 稳定排序（ES2019 `sort` 稳定）。`real-stubs.spec` 只追加一键是 `satisfies` 全键约束下的**必要**改动（否则 typecheck 失败），旧 22 键 / `satisfies` / 两条断言 / describe 不改，追加后 24 例。复用 `StageSchema` / `InterventionKindSchema` / `InterventionSchema`，不新增注册 schema。✓

### 3. T-A13a（R3-B）领域边界判定（协调器重点 3；独立判定，不借 R4-A 批准，不沿用 R3 审核员或作者的结论）

- **事实**（本审核员读 `job-state.ts` 复核）：对同一投放重复 `removeUpload`，已归属者每次都追加一条内容相同的 dataset 修订与一条 `remove_source` 介入事件并改写 `job.updatedAt`；未归属者静默成功。同一文件中 `confirmIntake` / `assignUpload` 对 `removed` 记录一律 `validation_error`。R3 Review 探针 P4 已复现（`review-batch3.md` §5），不是猜测。
- **判定：属既有领域规则，可在现有授权内实施；不是 AGENTS §5.1 意义上的新 guard。** 理由：
  1. **规则早已写在已审设计里**：plan §2.4 自 `8753fa9`（R7 通过的 r6 设计）起即有“本 feature 的无效操作 / 只读写入 / 定稿未决项均返回 validation_error，payload 含说明；未知锚返回 not_found”；plan §4.2 “removeUpload … 只移除当前关联且保留历史”——对已不存在的当前关联再次“移除”是无效操作。现有代码对该句的落实在 confirm / assign 上完整、在 remove 上缺失，A13a 是**补齐既有规则的遗漏**，不是加一条新规则。
  2. **类别不同于 §5.1 所管的对象**：§5.1 管的是“猜测的竞态 / 安全边界”；A13a 是对单条记录既有 `removed` 标志的确定性域判断，发生在同一 `commit` 事务内、与时序 / 并发 / 网络无关，与 `writableJob`（终结作业只读）、confirm / assign 的 `removed` 检查同类——这三者在 T-A12 / T-A13 都按既有授权实施并经 R3 Review 认定为“既有领域规则”。R4-A 则是生命周期 / 迟到回调（竞态类），所以才走 §5.1；两者不同类，本判定**不引用、不借用** R4-A 的批准。
  3. **§5.1 的三问即使适用也已答清**：怎么出错 = 台账出现无意义的重复删除记录与修订、`updatedAt` 被无操作改写（违反 AGENTS §4 “手改数据必须走事务接口并记台账”的审计纪律——台账条目须对应真实动作）、T-B06 历史与 T-C04 取证会显示重复删除；概率 = 任何一次重复提交即触发，且 C03 是首个消费方；代码量 = 1 行 + 2 例。
  4. **范围护栏**：只改 `removeUpload` 一处、只检查 `removed`；不加幂等键 / 锁 / 请求去重 / “已处理”框架，不改 confirm / assign / cancel / submit；“双击 / 重试”只是说明消费方路径，**不是**本判定的依据，也不得被引申为加任何并发防线的许可。
- **关于作者条件句**：tasks T-A13a 状态行“若判为须 §5.1 … T-C03 照常实施（其依赖中的本任务按‘未关闭 P3’处理）”——本审核员明确：该分支**不是**可接受的流程，T-C03 依赖 T-A13a，依赖未满足的任务不得开码；若门未满足，正确做法是协调器修范围并重走 Analyze。本轮判定使该分支失效，但原文仍在 tasks / 日志 / README / interface-handoff 中，须在下一次 Tasks 精度轮以本判定替换（S-45，措辞，不阻断）。R3-B 维持开放，关闭由第五批代码 Review 判。

### 4. intakeStore 公开 / 内部成员、草稿与快照、写后刷新与 C02 / C03 视图口径（协调器重点 4）

- **H-5 公开成员只有四项**：`open(jobId?)`（每次置 `isOpen=true`、快照 = `jobId ?? null` 覆盖上次、不读 route）、`close()`（只置 false，不导航、不调 agent、不清草稿与快照）、只读 `isOpen` / `jobId`——与 v2 plan §7.3 H-5 原约定及 interface-handoff §3 r6 行一致，未扩大交接面；草稿 / 选中 / 池 / 各写动作明列为本 feature 内部成员。✓
- **草稿语义**：`IntakeDraft` 只持 `fileMeta: IntakeFileMeta | null`（四项元数据）而非 `File`；`url` / `text` 原文只在内存；`reliability` 初值 `unknown` 是契约枚举自身的“未知”值（spec 四值之一），不是伪造高 / 中 / 低；`publishedAt` / `validUntil` / `scopeNote` 空串在提交时转 null（不伪造日期 / 口径）；`open()` 清选中与预览读状态、**不清草稿**；`close()` 保草稿；`submit` 成功才 `resetDraft()`；刷新页面即丢（plan §3 原文“原文草稿只在内存”）。跨互斥路由重新挂载时 store 常驻，草稿 / 快照 / 选中保留（C01a 标准 3 可断言）。✓ 字段默认均不“填错”。
- **`submit`**：`IntakeSubmission` = 按 `inputKind` **分配**的 `Omit<…,'jobId'>`（非分配写法会丢失 `fileMeta / url / text` 判别字段，本审核员核 TS 语义），`{...submission, jobId: 快照}` 交契约 ⇒ 外部类型上无法覆盖快照；`@ts-expect-error` 断言由 `typecheck` 真实检查（tsconfig 含 tests，既有先例）。成功 → `resetDraft()` → `await useJobsStore().refresh()` **恰一次** → resolve；失败 → 以原 `ErrorResponse` reject、不 refresh、不清草稿——与已审 `jobsStore.createJob` / `JobCreatePanel` 同口径（O-R21-4）；读动作（`selectUpload` / `loadPool`）失败写各自状态并 resolve（S-38）。store 内不再 parse（契约边界已 parse）。✓
- **C02 选中与确认**：`selection.mapping` 初值复制自 `upload.mapping`（当前已保存映射），**不是** `preview.fields`——本审核员核 `confirmIntake` 把 `upload.mapping = mapping` 而 `previews[uploadId]` 不变，所以取 `preview.fields` 会在再次选中时覆盖已保存修正；`confirm` 成功先以回执 `{upload, preview, mapping: 复制回执.upload.mapping}` 替换选中（回执 `upload.status` 已是 ingested / quarantined，不会停在旧 pending）再 `refresh()` 恰一次；“确认入库”只在 `pending_validation && !removed` 时出现，与契约拒绝条件同构。✓
- **C03 池**：池不在 jobsStore 内（`listUnassignedUploads` 是独立读）；写后 `refresh()` 恰一次，**仅当** `poolStatus !== 'idle'` 再 `loadPool()` 一次——这是对一个本就不在共享缓存内的视图做“单独正常重读”，不是第二次 `jobsStore.refresh()`、不是局部重读替代统一刷新（§1-9 的对象是领域共享缓存），也不是事件总线 / 轮询。失败路径 reject + 0 次刷新 + 0 次池重读，组件 await + catch 显示 `ErrorState` ⇒ 无 unhandled。`UnassignedPool` 挂载时 `ensureJobs()` 只在 idle 时加载（详情页直达也有作业可选）。✓
- **不做**：请求序号 / 锁 / 总线 / 轮询 / 实例登记 / 草稿持久化 / File 持有——与 plan §2.3 r6 原文、tasks §3 挂载约定一致。✓

### 5. T-C01 File 输入与 schema 边界、harness 可行性（协调器重点 5）

- **隐私 / 网络边界**：文件只取 `files[0]` 的 `name / size / type / lastModified`；明文禁止 `File.text / arrayBuffer / stream / slice`、`FileReader`、`URL.createObjectURL`、任何解析与 URL 请求；URL 只存字符串；文本正文只进内存草稿；标准 3 以 spy 0 次 + `fai.jobs.v1` 不含正文字符串固定。与 plan §3 / §6 风险表“只读元数据与文本”“URL 只保存字符串、不访问”一致。✓
- **白名单**：`IntakeFileMetaSchema.safeParse` 失败 → 提示由 `INTAKE_FILE_EXTENSIONS` 拼出、`fileMeta` 保持 null、不提交；成功才写草稿（AC-003-2）。✓
- **来源五项**：用途必填、可靠性来自 `ReliabilityLabel` 键序与文案、两个 `<input type="date">` 空 → null、口径空 → null；payload 五项 typed（AC-003-3）。✓
- **校验位置（§5.2）**：url / text 的原始字符串在提交时 parse 一次是正确的边界；`fileMeta` 在拖入 / 选择时已 parse 成确定类型并写入草稿，提交时再对它 `IntakeFileMetaSchema.safeParse` 一次是同一 UI 边界内对已确定类型的重复校验——无害（一行）但不必要，提交时对 file 种类只需判 `fileMeta !== null`（“请选择文件”）。登记为 S-46 实施提示，不改标准 / 命令；契约入口 parse 照旧（设计原文）。不新增故障框架、不反复 Status guard：面板只用既有 `ErrorState(moduleId='intake-submit')` + 重试同一提交。✓
- **harness 真实可行**（只读内省结论，见“基线与范围”）：happy-dom 21.0.4 的 `File` 继承 `Blob.prototype.{text,arrayBuffer,stream,slice}`、`FileReader.prototype.readAs*` 为继承方法；vitest `spyOn` 沿原型链取描述符并在 `File.prototype` / `FileReader.prototype` 上定义自有 spy、`restoreMocks` 逐例删除 ⇒ `vi.spyOn(File.prototype,'text')` 等**可用且能计数**经 `File` 实例的调用；`new File([...], name, {type, lastModified})` 四项元数据可用；`URL.createObjectURL` 亦可 spy；`<input type="file">` 的 `files` 可用 `Object.defineProperty(input,'files',{value:[file]})` 或 `DataTransfer` 构造、`drop` 可用 VTU `trigger('drop',{dataTransfer:{files:[file]}})`。不需生产 shim、不需改业务伪造测试。✓（S-47 汇总实施提示）

### 6. T-C01a 接线、互斥挂载、`StageWorkspace` 分发与旧断言（协调器重点 6）

- **新组件与分发**：`StageWorkspace` props `{stage, job: DeepReadonly<Job>, workspace: DeepReadonly<StageWorkspace> | null}`，`JobDetailPage` 传 `currentJob` / `currentStageWorkspace`；仅 `stage==='collect' && workspace?.stage==='collect'` 渲染 `CollectWorkspace`；collect 但工作区仍是上一阶段（同作业切阶段的读取窗口：`openJob` 同作业不置 loading，`currentStageWorkspace` 在 `readDetail` 完成前仍是旧阶段——本审核员核 store）→ 本地 `<p role="status">读取中…</p>`，不用 shared `Loading`（否则 slow 用例 `findComponent(Loading)` 断言失真）；process / analyze / deliver 原占位——D–F 不提前。根 section 与 `aria-label="<阶段>工作区"` 不变 ⇒ `detail-stage` E2E 的 `region "<阶段>工作区"` 与 `job-detail.spec` 的“分析工作区含‘由后续任务提供’”不受影响。✓ 这是 plan §2.2 采集台组件表的文件级精度（D/E/F 各有 `*Workspace.vue`，采集台此前缺同位组件），不是新 what。
- **互斥挂载、容器与非模态**：`JobListPage` / `JobDetailPage` 各自在 `isOpen` 时渲染 `.intake-slot`（详情页放状态分支之前、不随 `detailStatus` 变化）；`IntakeDrawer` 根 `<aside class="glass-drawer intake-drawer">` 宽高 100%、不 fixed、无遮罩 / `role="dialog"` / `aria-modal` / `inert` / 焦点锁；关闭只 `close()`。无实例登记 / 首个挂载者 / guard（tasks §3 r5 约定原文）。`glass-drawer` 在 `check.mjs` 允许集合内且有 `AgentDrawer` 先例；`.intake-*` 不命中 glass 守卫；不新增颜色 / 玻璃层。✓ H-5 容器约定与 v2 plan §7.3 一致；v2 落地后由 T-H01 移除页面级挂载（既有约定）。
- **路由变化不丢草稿 / 快照**：store 常驻、页面重挂载只重新读 store ⇒ 标准 3 可断言。✓
- **旧断言不改且不失真**：新组件不渲染 `h1` / `.job-*` / `aria-current` / `aria-pressed` / `JobStatusBadge`，名称不与“新建作业 / 作业详情 / X工作区 / 作业阶段 / 状态 / 类型 / 标题”重名；“投放”按钮在 `.job-filters` 之外 ⇒ `.job-filters button` 仍唯一；抽屉未打开时不渲染任何额外读 ⇒ `reads` 恰两次、`lists` 0 次、`listStatus` idle 的断言成立；`<aside>` 为 complementary，不进入 Playwright `region` 严格匹配；`CollectWorkspace` 行用 `ArtifactStatusBadge`（`.artifact-status-badge`），不碰 `.job-status-badge` 严格定位。本审核员逐条对照 13 / 5 / 1 / 12 / 5 例真实选择器，均成立。R4-A 六行在 `watch` 回调内，B06 / C01a 明写不动。✓
- **历史侧栏默认收起（独立判断）**：designUI §3.3 “右侧常驻产物版本与介入历史”——B06 的 `<aside aria-label="介入历史">` 在 ready 有作业分支**常驻**，只是内容默认收起、展开才读。冻结 spec R-007 / AC-007-1 要求“侧栏…按时间展示，可按阶段 / 类型筛选 / 字段齐全”，R7 通过的 B06 原标准已写“可见或可展开”，均不要求默认展开；AC-002-4 / D02 / E03 / F03 的“介入历史可见 / 出现”在展开后同样可断言。收起的工程理由成立（挂载即读会让 slow 用例在 ready 后看到 shared `Loading`，而旧用例不得改；无人看时不读）。判定：**v1 可接受的展示精度，不是需求变更**；但 designUI “常驻”的内容可见性读法应登记给人工验收 / 设计一轮确认，若希望默认展开，只需 B06 改为挂载即读 + 本地状态文案（不改 AC），见 S-48。
- **`currentJob` 替换作为重读信号**：本审核员核 `jobs.ts`——`readDetail` 每次成功都 `currentJob.value = job`（契约 `structuredClone` + parse 的新对象），对外 `computed(readonly(...))` 随之给出新引用；所有写后统一 `refresh()`、`openJob`、同作业切阶段都会替换 ⇒ `watch(() => props.job)` 一次真实重读，不需 bus / 轮询 / seq / 比较 guard。同作业切阶段多读一次（O-R21-5）登记为代价而非防护。十字段 + ingest payload 五项（可靠性用 `ReliabilityLabel`，null 显示“未知 / 无”、不伪造）在 `<details>` 内可展开 ⇒ AC-007-1 “字段齐全 / 可见或可展开”有落点；kind / outcome 用契约值原样（契约无映射，AC 不要求中文），其余 payload 分支只显示 `action`——AC-007-1 要求“payload 摘要”而非全量渲染，可接受；后续若扩展须明确 `InterventionHistory.vue` 的写权限（S-44 合并登记）。读状态为组件本地，直接读 `dataClient`（既有模块写法），不新增 store 成员。✓

### 7. T-C03 / T-C04、所有权、粒度与 H-5 交接（协调器重点 7）

- **C03**：“归入作业”选项 = `jobsStore.jobs` 中 `status ∈ ACTIVE_JOB_STATUSES`（契约常量，store 不另建判定；normal 下含 j-failed、不含 j-cancelled——本审核员核 `ACTIVE_JOB_STATUSES` 7 值）；删除来源 = 行内非模态 `<section aria-label="确认删除来源">`，理由默认“来源不再适用”可改、校验复用 `dataMethods.removeUpload.params` 的 reason schema（不另立规则）；取消 → 零调用；确认 → `removeUpload` 恰 1 次带理由；成功后 `refresh()` 一次 + 池重读一次；失败 reject + 0 刷新。破坏性动作二次确认 + 非模态与 R-007 / AC-007-3 / T-B03 面板写法一致。✓ C03 不改 `job-state.ts`（R3-B 归 A13a）。
- **C04**：只新建 `e2e/jobs/intake.spec.ts`，normal 场景、Playwright 自管 4173、不改配置、不加窗口钩子，取证只读 `fai.jobs.v1` 与页面可见内容；“若 E2E 暴露生产缺陷，停下回报，不在本任务改生产文件或既有用例”明写；三条标准 = AC-003-1 本地子项 / AC-003-3 最终 / AC-003-5 最终，命令 1:1；标准 2 的历史展开取证保留并具体化。✓
- **所有权（implementation-log §20.2 ↔ 各任务“一律不改”逐项一致）**：A01a = `types.ts` + `contract-labels.spec` 只增组 + 生成物；A13a = `job-state.ts`（只 `removeUpload`）+ `methods.ts`（只描述）+ `job-state-pool.spec` 只增组 + 生成物；A15a = `client.ts` / `methods.ts` / `real/index.ts` / `mock/index.ts` / `job-state.ts`（只加 `listInterventions`）+ 新 `job-state-history.spec` + `real-stubs.spec` 只追加一键 + 生成物；B06 = 新 `InterventionHistory.vue` + `JobDetailPage.vue`（只 ready 有作业分支）+ 新 `intervention-history.spec`；C01 = 新 `stores/intake.ts` + 新 `IntakePanel.vue` + 新 `intake.spec`；C01a = 新 `IntakeDrawer.vue` / `CollectWorkspace.vue` + `JobListPage.vue`（按钮 + slot）+ `JobDetailPage.vue`（slot + 两 props）+ `StageWorkspace.vue`（props + 分发）+ `intake.spec` 追加四组；C02 = `intake.ts` 追加 + 新 `ExtractionPreview.vue` / `MappingEditor.vue` + `IntakeDrawer.vue` / `CollectWorkspace.vue` + 新 `extraction-preview.spec`；C03 = `intake.ts` 追加 + 新 `UnassignedPool.vue` + `IntakeDrawer.vue` / `CollectWorkspace.vue` + 新 `unassigned-pool.spec`；C04 = 只 E2E。全批禁写 `app/**` / `shared/**` / `agent/**` / `workbench/**` / `main.ts` / `routes.ts` / `stores/{jobs,session}.ts` / `persistence.ts` / fixtures / `scripts/**` / 配置与锁 / `docs/**` / `specs/**` / `backend/**`；旧用例清单（jobs-store 43 / routes+session 17 / job-list 12 / job-detail 13 / job-create 5 / badges 48 / v1 契约 88 / real-stubs 只追加一键）明列不改、真实失败即停报。同一实施树串行、后序任务在前序文件上继续改是 §14 / §20 明写口径。✓ 最小且充分；无 v2 / peer 树写入。
- **粒度与 1:1**：9 项 0.5～2 h（B06 / C01 / C02 顶格 2 h，本审核员**不认定已知超额**，实际超出按 §7 S-22 停下拆分，不得预吸收）；标准 ↔ 命令逐任务 3/3、3/3、3/3、3/3、5/5、5/5、4/4、4/4、3/3 = 33；每条标准含 AC；新 `-t` / `-g` 标题（`WI reliability label` / `WI R3-B repeated remove` / `WI history scenarios` / `WI history refresh` + 既有 `WI listInterventions` 换文件）不扩大 `WI labels` / `WI removeUpload` / `WI H-2` / `WI status badges` 等定向集合；`WI H-5` 前缀集合（store / container / close）即 §2a H-5 定向命令范围。✓
- **H-5 / 页面切片**：提供任务仍为 T-C01 / T-C01a（页面切片 B01 / B02 / B04 / C01 / C01a / C02 / C03 / C04），B06 / A15a / A01a / A13a 只是依赖、不单列；本批完成并经 Review 后至多形成 ①③（② 以提交后的本轮 SHA 为准），④ 永远只能由 `integration/frontend-workbench-v2` 所有者登记——interface-handoff 页首 / §1 / §3 r6.12 块均如此写，未预宣交付。✓

### 8. 未关项、范围与工程准则（协调器重点 8 + AGENTS §5）

- **P3 台账**：R4-B～R4-E / S-41 / R3-C / R-A / R-B 残留 / R-C / R2-A / R-D ①③④ / R-E / R-F / R2-B AgentClient 侧 / R2-D 在 implementation-log §8 r6.12 段“不在第五批、归属不变、未经风险接受”；R3-B 只定落点、标“未修、未经风险接受”。无假关。✓
- **范围**：无 D-020～D-024 内容、无真实解析 / URL 抓取 / agent 接入 / 伪并发防线混入；每项 r6.12 精度均能对回 spec R-003 / R-007 / R-008 既有 what 与 plan r6 既有设计（§1～§7 逐项），无需 Clarify；作者“机制精度”自述经本轮逐项独立核对而非照单接受。✓
- §5.1：零新增 guard / 序号 / 锁 / 去重 / 轮询 / 总线 / 实例登记 / fallback；A13a 为领域规则（§3）；两处额外读登记为代价。§5.2：File / url / text / 来源说明 / 映射 / 理由各在用户输入边界 parse 一次，契约入口照旧，store 不重复 parse（S-46 只是去掉一处同边界内的冗余）。§5.3：`CollectWorkspace` / `IntakeDrawer` / `IntakePanel` / `ExtractionPreview` / `MappingEditor` / `UnassignedPool` / `InterventionHistory` 各是能起清楚名字的组件；不建 helper / 映射工具。§5.5：生成物只经 `pnpm -C frontend contract`。§5.6：真实 Pinia / memory router + `registerJobRoutes` + `RouterView` / 真实 mock client + 系统边界透传 spy / 假时钟 / 真实 `fai.jobs.v1`，不 `vi.mock` 内部模块、不复写业务逻辑、不改旧断言讨绿。§5.7：命令形态不变，无新工具 / 依赖 / 配置。✓
- **流程**：本轮未写代码；README / 日志 / analyze / interface-handoff 四处数字与本审核员复算一致（73 / 107 h / 245 / 245 / 27 + 46 / 9 项 12 h 33 命令 / 唯一回边 B03 → B04）；Gate 1 / Gate 2 / 开发状态均未由本审核员填写。✓

## 阻断项（R11）

无。

## 非阻断建议（R11；P3，不计入判定，由作者 / 实施者自行决定是否吸收；均不改 AC、标准编号或命令）

| # | 位置 | 说明 | 建议归类 |
|---|---|---|---|
| S-44 | tasks T-B06 依赖行括注“（r6.12：原依赖 T-A15 改为只读的 T-A15a）”；§6 “UI：…C01 依赖 A22 / A12 / A22a，C01a 依赖 C01…”一句；T-B06【r6.12】“其余分支只显示 action（后续台面任务按需扩展）” | ① 依赖行的括注含非依赖任务号 T-A15，不剥括注的结构脚本会把未开始的 T-A15 当成 B06 依赖（本审核员脚本已剥括注后才得到正确图）；建议把说明移到状态行或写成“依赖：T-B04、T-A15a、T-A01a。（说明：…）”。② §6 该句仍是 r6.9 前口径，与同节末尾 r6.12 段并存，建议加“【r6.12 见下】”标记。③ 若 D / E / F 任务将来要扩展 `InterventionHistory.vue` 的 payload 摘要，须把该文件加入那条任务的写权限或单列精度，不得顺手改 | Tasks 措辞 / 所有权登记 |
| S-45 | tasks T-A13a 状态行、页首 r6.12 块第 4 点、implementation-log §20.4、README 行、interface-handoff 页首中“若判为须 §5.1 … T-C03 照常实施 / 按未关闭 P3 处理” | 本轮已判定 T-A13a 属既有领域规则（§3），该条件分支失效；但其原文描述的“依赖未满足却照常实施”不是可接受流程（AGENTS §2 第 8 步按依赖顺序执行）。建议下一次 Tasks 精度轮把这些句子替换为“R11 判定：领域规则，可实施；R3-B 维持开放至代码 Review”，避免被引用为先例 | Tasks / 日志措辞 |
| S-46 | tasks T-C01【r6.12】IntakePanel“提交：组装候选后做一次外部校验——…加当前种类的输入字段（`IntakeFileMetaSchema` / …）” | file 种类的 `fileMeta` 在拖入 / 选择时已经 `IntakeFileMetaSchema.safeParse` 为确定类型写入草稿，提交时再 parse 一次属同一 UI 边界内的冗余（§5.2）；建议提交时对 file 种类只判 `draft.fileMeta !== null`（提示“请选择文件”），url / text 仍在提交时 parse 一次。只是写法提示，不改标准 3 / 命令 | 实施提示（§5.2 精度） |
| S-47 | tasks T-A15a 标准 1 / T-C01 harness / T-C03 理由 schema / T-C02 注入 | 实施提示汇总（均由本审核员只读核实，不改标准 / 命令）：① happy-dom 21.0.4 下 `File.prototype` 的 `text / arrayBuffer / stream / slice` 继承自 `Blob.prototype`、`FileReader.prototype.readAs*` 亦为继承方法，`vi.spyOn(File.prototype,'text')` 会在 `File.prototype` 上定义自有 spy（vitest `getDescriptor` 沿原型链），可直接计数，`restoreMocks` 逐例恢复；`URL.createObjectURL` 同理可 spy；`input.files` 用 `Object.defineProperty` 或 `DataTransfer`，`drop` 用 `trigger('drop',{dataTransfer:{files:[file]}})`。② `interventions.json` 中 j-collect 只有 1 条 collect 种子，“跨阶段 / kind 种子”与“同刻保持记录顺序”宜用 j-deliver（两条同 `createdAt`、kind 不同）或 j-process 断言，j-collect 用于真实 submit / remove 产生的 ingest / remove_source。③ zod 4.6.7 的 `ZodTuple` 无 `.items` getter：reason schema 取 `dataMethods.removeUpload.params.def.items[1]`，或对整元组 `safeParse([uploadId, reason])`。④ 所有内置投放种子 `mapping === preview.fields`，C02 标准 1 的“初值 = `upload.mapping`”只能经 `window.__FAI_MOCK__.jobFixtures` 注入差异样例（任务已写明） | 测试 harness 提示 |
| S-48 | tasks T-B06【r6.12】“默认收起、收起时不读”与 designUI §3.3 “右侧常驻产物版本与介入历史” | 侧栏本身常驻、内容默认收起在 v1 判为可接受展示精度（§6），但 designUI “常驻”的内容可见性读法未在任何文档登记。建议在 tasks T-B06 状态行或 T-G08 人工验收（M-02 / M-09 看什么）登记“v1 介入历史默认收起、展开才读，理由 = 旧 slow 用例与无人看时不读”，并交人工验收 / 设计一轮确认；若要改为默认展开，只需 B06 改挂载即读 + 本地状态文案（不用 shared `Loading`），不改 AC / 命令，不需重过 Checklist | 范围登记 / 人工验收提示 |

## 当前有效检查项（R11 勾选；唯一参与 Implement 前置判定；R10 的 26 项沿用其原判定，本轮对 r6.12 触及项重新判定、其余只核未回退）

### 需求完整性

- [x] **N-01 每条编号需求至少有一条可验证的验收规则。** 沿用 R10；spec 零 diff、46 AC 独立计数；矩阵 46 / 46（脚本差集 ∅）。
- [x] **N-02 无未澄清歧义。** 本轮重新判定：r6.12 全部项（A15a 拆分、B06 挂载 / 收起 / 重读信号、A01a 映射、intakeStore 成员与口径、C01a 分发与容器、C01 边界、C02 / C03 视图口径、C04 取证、D02 / E03 / F03 依赖、A13a 领域规则）均为既有 what / AC 内的机制、粒度、顺序精度（§1～§8 逐项判定），未改任何 AC 判据 / 目标 / 非目标；S-44～S-48 为措辞 / 实施提示 / 范围登记，不是需求歧义；无需回流 Clarify / Gate 1。
- [x] **N-03 目标与非目标边界清晰。** 本轮重新判定：tasks §3 无 diff；页首 r6.12 块明写不在本批（D–F、A14 / A15 / A16～A21、B05 / B07、角标收件箱、T-G04、v2 壳、D-020～D-024、真实解析 / 抓取 / agent）；`StageWorkspace` 只对 collect 分发、其余占位不虚构功能；预览合成、隔离由 fixture 判定，不做真实闸门。
- [x] **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 本轮重新判定：R-003 六句 what（页面内入口 / 三种投放与白名单 / 来源说明四项 / 预览与修正后确认 / 待归属池归入 / 状态展示）在 plan §2.1【r6.12】/ §2.2 / §2.3【r6.12】/ §2.4 / §3【r6.12】均有可实现落点；R-007 “详情侧栏介入历史按时间展示、可筛选”在 §2.1 / §2.3【r6.12】+ T-B06；AC-003-2 / 003-4 / 003-6 / 007-1 最终任务与命令零变化、AC-003-3 / 003-5 最终仍为 T-C04。

### 一致性

- [x] **I-01a spec ↔ plan 无冲突。** 本轮重读：plan §2.3【r6.12】草稿 / File 边界与 spec §4 “持久化”句、§2 非目标“真实解析”不冲突；§2.4【r6.12】`listInterventions` 是 r5 方法清单既有项、`removeUpload` 已删除拒绝落在既有“无效操作 validation_error”句内、`ReliabilityLabel` 文案与 R-003 四值逐字一致；§2.1【r6.12】侧栏常驻与 R-007 一致；方法集 / 动作矩阵 / 九场景 / 样例表 / 迁移表 / 定稿语义无 hunk。
- [x] **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核 Analyze R21 §2 G1～G7 / O1 与 §3 一致性成立：plan【r6.12】六处 ↔ tasks A01a / A13a / A15a / B06 / C01 / C01a / C02 / C03 逐条对应；interface-handoff §3 r6.12 段的公开 / 内部成员与 tasks T-C01 一致；implementation-log §20.2 写权限 ↔ 各任务“一律不改”一致；§5 矩阵 7 行只改部分前置；§6 r6.12 段与各任务依赖行一致（S-44 ① 为括注措辞，不是冲突）。
- [x] **I-02 与 docs/ 决策与 ADR 无冲突。** 沿用 R10 + 本轮：`docs/**` 零 diff；designUI §3.3 “右侧常驻产物版本与介入历史”——侧栏常驻成立、内容默认收起登记为 S-48 待人工验收确认，不是冲突；§3.4 采集台“文件拖入 / 链接 / 粘贴；来源说明；抽取预览与字段修正；待归属池”与 C01～C03 逐项对应（剪藏预览属 D-018 §3，非本 feature）；D-016 / D-018 定稿语义无 hunk；D-017 仅作“真实闸门非本 feature”边界；A13a 落实 AGENTS §4 台账纪律而非新决策，不需 ADR；D-020～D-024 未带入。
- [x] **I-03 前端基线事实核对。** 本轮在本树（= `ae592ba`）独立重核（见「基线与范围」真实代码事实）：`removeUpload` 无 removed 检查而 confirm / assign 有、`commit` 抛错不产生部分修改、`readJobState` 场景同源、`labelSchema` 私有可复用、`SourceNoteSchema.reliability` 内联枚举、`real-stubs` 22 键 `satisfies`、`contract-labels` 10 例、v1 测试动态计数、生成器表驱动、`job-state-pool` `WI removeUpload` 4 例、`jobs.ts` `readDetail` 替换 `currentJob`、`JobDetailPage` R4-A 六行与 ready 分支、`StageWorkspace` 只收 `stage`、`JobListPage` 结构、`Loading` role=status、旧断言选择器、fixtures 种子（j-collect 1 条、j-deliver 同刻两条、种子 mapping = fields、池 2 条）、happy-dom 原型结构与 vitest spyOn 行为、`check.mjs` glass 允许集合、tsconfig 含 tests——全部属实。
- [x] **I-04 文件边界与回滚一致。** 本轮重新判定：implementation-log §20.2 逐任务写权限与九任务“一律不改 / 逐文件写入许可”逐项一致，且在 §1-5 所有权内（`jobs/**`、`contracts/**`、jobs 测试、生成物）；B06 / C01a 获 `JobDetailPage.vue` 分区写权（R4-A 六行不动）；`real-stubs.spec` 只追加一键、`contract-labels.spec` / `job-state-pool.spec` / `intake.spec` 只增组；全批禁写 `app/**` / `shared/**` / `agent/**` / `workbench/**` / `main.ts` / `routes.ts` / `stores/{jobs,session}.ts` / `persistence.ts` / fixtures / `scripts/**` / 配置与锁 / `docs/**` / `specs/**` / `backend/**`；回滚范围（plan §6）未扩大。

### 可测试性

- [x] **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 本轮重新判定：AC-003-2 / 003-4 / 003-6 / 007-1 最终任务与命令零变化，AC-003-3 / 003-5 最终仍 T-C04；本批 33 条命令中 3 条 E2E 为 AC-003-1 本地子项 / 003-3 / 003-5 最终，其余为单测 / 工程门 / 回归；A01a / A13a / A15a / B06 / C01～C03 的【r6.12】具体化全部可由真实实现输出断言（真实 commit 与快照、真实 `readJobState` 场景、真实 Pinia + router + mock client、系统边界 spy、`jobFixtures` 注入、`fai.jobs.v1` 真实快照）；File / FileReader spy 在当前环境真实可行（只读内省）；AC-003-1 工作台 / 顶栏子项仍 `blocked_by: frontend-workbench-v2`。
- [x] **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 本轮重新复算：73 任务 / 107.0 h（A 33·45.5 / B 8·12 / C 5·8.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4）/ 每项 0.5～2 h 0 例外 / 245 ↔ 245 逐任务 1:1 连续 / 每条标准含 AC / 真实图无环 + 唯一有意回边 (B03, B04) / 46 = 46 / 27 + 46 / 第五批 9 项 12 h 33 命令——全部成立；父 → HEAD 逐任务 est / deps / 状态 / 标准 / 命令比对差异**只在** A01a / A13a / A15a（新增）、A15（1.5 → 1，标准 / 命令 5 → 4）、A17 / D02 / E03 / F03（只增依赖）、B06 / C01 / C01a / C02 / C03 / C04（依赖 / 预计 / 标准追加 / 命令追加），其余 59 个任务零变化；所有追加都在原句后附加、无删减放宽（A15 标准 4 的移交在 A15a 以更具体形式重现）；B06 / C01 / C02 顶格 2 h 未越限、不认定已知超额。
- [x] **V-03 静态守卫声称与真实脚本一致。** 本轮核 `check.mjs`：`glass-drawer` 在允许集合、`.intake-*` 不命中、`checkGrid` 的 `minmax` 要求已写进 B06；`checkNetwork` 对本批无新声称；`contract --check` 对 A01a / A13a / A15a 的生成物对拍是既有工程门。

### 工程准则（AGENTS §5）

- [x] **P-1 不为猜测场景加复杂度（§5.1）。** 本轮重新判定：零新增 guard / 序号 / 锁 / 去重 / 轮询 / 总线 / 实例登记 / fallback / 草稿持久化；T-A13a 经独立判定为既有领域规则（§3）而非 §5.1 对象，范围只限 `removeUpload` 一处、不借 R4-A；同作业切阶段的历史多读一次与池单独重读登记为代价而非防护；并发按 mock 按序口径（S-43 已登记）。
- [x] **P-2 外部数据只在入口层校验（§5.2）。** 本轮重新判定：File 元数据 / url / text / 来源说明 / 映射 / 删除理由各在用户输入边界用契约导出 schema parse 一次得确定类型再交 store，store 不重复 parse，契约入口照旧 parse 一次；S-46 指出的 file 种类二次 safeParse 是同边界内的冗余写法提示，不是设计缺陷。
- [x] **P-3 不提前抽只用一次的抽象（§5.3）。** 本轮重新判定：七个新组件各代表能起清楚名字的界面概念；`ReliabilityLabel` 三处消费；不建 helper / 映射工具 / 故障框架；A15a 复用既有 `readJobState` / schema。
- [x] **P-5 自动生成文件不手改（§5.5）。** 本轮重新判定：A01a / A13a / A15a 的 `CONTRACT.md` / `schema.json` 只经 `pnpm -C frontend contract` 生成并以 `contract --check` 对拍；生成器不改。
- [x] **P-6 测试测真实实现、少用 mock（§5.6）。** 本轮重新判定：真实 Pinia / memory router + `registerJobRoutes` + `RouterView` / 真实 mock client 与 `commit` / 真实快照；spy 只在 `dataClient` 与 `File` / `FileReader` 原型等系统边界透传或计数；`jobFixtures` 只在系统边界注入；E2E 只读真实 `fai.jobs.v1`、无钩子；不 `vi.mock` 内部模块、不改旧断言讨绿、不在 E2E 任务改生产。
- [x] **P-7 按仓库现有流程（§5.7）。** 命令形态不变；无新工具 / 依赖 / 脚本 / 配置；新 E2E 自动进 `testDir`。

### 其他自定义项

- [x] **C-01 前置依赖与职责边界清楚。** 本轮重新判定：第五批 DAG（A01a ← A01；A13a ← A13；A15a ← A13；B06 ← B04 / A15a / A01a；C01 ← A22 / A12 / A22a / A01a；C01a ← C01 / B04；C02 ← C01 / C01a / A23；C03 ← C02 / A13 / C01a / A13a；C04 ← C03 / B04 / B06）与 §6 / §20.1 / README 一致，本批外依赖全部已完成；A17 / D02 / E03 / F03 的新依赖均前向；唯一有意回边 B03 → B04 真实无环；B06 / A15a / A01a / A13a 不单列为切片提供任务；T-A13a 的“若需批则 C03 照常”分支经本轮判定失效（S-45），本审核员不接受“依赖未满足却开码”的读法。
- [x] **C-02 契约闭环。** 本轮重新判定：`listInterventions`（client / methods / real 桩 / mock / 状态层 / 生成物 / real-stubs 一键）五处同步、复用既有 schema、不升版；`ReliabilityLabel` 常量 + schema + 注册 + 生成；`removeUpload` 描述补句实现中立；方法描述均实现中立；契约 24 → 25 methods 由 `contract --check` 对拍。
- [x] **C-03 事件与状态闭环。** 本轮重新判定：A13a 拒绝发生在 `commit` 事务内、无部分修改；A15a 只读不改状态；写后刷新仍经唯一 `jobsStore.refresh()`（submit / confirm / assign / remove 各恰一次），池为独立视图单独重读；`receiveAgentEvent` / activeRunId / overlay 不触及（T-A18 / T-A20）。
- [x] **C-04 场景定义足以稳定验证。** 本轮重新判定：A15a / B06 / C01～C03 用例全部以真实九场景（normal / slow / empty / error）+ 真实 fixture id（j-collect / j-process / j-deliver / u-unassigned-file / u-unassigned-quarantine）与 `jobFixtures` 注入定义，期望来自契约语义；S-47 ② 只是种子选择提示。
- [x] **C-05 版本与定稿闭环。** 沿用 R10；本批不触及修订链语义（A13a 只是不再追加冗余修订）、不触及定稿。
- [x] **C-06 隐私与本地持久化自洽。** 本轮重新判定：File 只取四项元数据、store 不持有 File、不调用正文读取 API / 对象 URL / 网络；url / text 原文只在内存草稿与契约参数；`fai.jobs.v1` 白名单不变（标准 3 断言不含正文）；E2E 只读既有业务子集、不加 key / 钩子；A15a 读路径不触碰 storage。
- [x] **C-07 视觉与工程纪律。** 本轮重新判定：只用既有令牌与 `glass-drawer`（允许集合、有先例），不新增颜色 / 令牌 / 玻璃类；状态徽复用 `ArtifactStatusBadge`（上传三态文案 + 图标，R2-C 令牌已关）；两列 grid 用 `minmax(0, …)`；无 fixed / 遮罩 / 焦点锁；本地“读取中…”不借 shared `Loading` 以免失真。
- [x] **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 沿用 R10；本批无 D-015 / D-013 引用；预览 / 隔离明写“真实闸门非本 feature”（D-017 边界）；D-020～D-024 未带入。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **定向通过 vs 本批尚未实施**：本节 26 ☑ 表示 r6.12 精度在 Plan / Tasks 层达标且 R10 已认可设计未回退；第五批 9 项**一行代码未写、一条测试未跑**，不得读作任何任务完成或 AC 验收。27 / 73 的“已完成”仍 = 批次 / 增量代码 Review 通过。
- **T-A13a**：本轮判定为既有领域规则、可在现有授权内实施，T-A13a 不 blocked、T-C03 依赖照常成立；R3-B **维持开放**，只有第五批代码 Review 对真实 diff（`removeUpload` 一处检查 + 2 例、不改 confirm / assign / cancel / submit、无幂等 / 锁 / 去重框架）核实后才可关闭。本判定不扩展为任何其他竞态 / 安全 guard 的许可。
- **P-4**：代码级，批次 / 最终 Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试（只做只读 Node 内省），不声称任何 AC 已通过、不假绿。
- **Implement 前置**：当前有效轮次 = 本 §R11，26 ☑ ⇒ 第五批可在**本节被集成人提交后**按 DAG 串行开码（提交前仍 blocked；**T-A01a 开始前的有效 Checklist = 本 R11 经集成人提交后的 SHA**），并登记到 `specs/README.md` 本 feature 行与 implementation-log §20.4（本审核员不 commit、不改 README / tasks）。
- **第五批代码 Review 须明确核对**（本节不替代）：A13a 真实 diff 范围与 R3-B 关闭与否；A15a `real-stubs` 旧 22 键 / `satisfies` / 两断言零改动、24 例；A01a `contract-labels` 原 13 例零改动、`-t "WI labels"` 仍 10；B06 / C01a 对 `JobDetailPage.vue` 的改动不触及 R4-A 六行与 `watch` / `selectStage` / 三态 / 详情头；`job-detail` 13 / `job-list` 12 / `job-create` 5 / `badges` 48 / routes + session 17 / `jobs-store` 43 / v1 88 零改动；`stores/jobs.ts` / `session.ts` / `routes.ts` / `main.ts` / `app/**` / `shared/**` 零 diff；intakeStore 公开成员只有四项、`submit` 参数类型不含 `jobId`；四个写动作各恰一次 `refresh()`、池重读只在已加载时；File / FileReader / `createObjectURL` 零调用；C04 未改生产文件；任一任务超 2 h 是否按 S-22 停下记录；默认收起 / 展开重读是否按 `currentJob` 替换而非新增机制。
- **H-x 交接**：八切片仍**全部未交付**；本批完成后 H-5 与页面切片的提供任务齐备，可形成 ①③（② = 本轮提交 SHA），④ 仍只能由 v2 集成树所有者登记；interface-handoff §5 待 v2 接收方确认，本审核员不代签。
- **上游**：main `072bb12` 不在本树祖先、继续 pin `90187f7`；同步按 tasks §7 / R2-D 流程，不是本批新人工门。
- **Gate 2 / Handoff**：不在本阶段；feature 未收敛（46 项未开始 + H 组外部阻塞）。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前必报“未收敛（外部阻塞）”；S-22 兜底继续有效且不得预先吸收已知超额；§7 S-31 写后刷新核对表本批新增 submit / confirm / assign / remove 四行（各恰一次 `refresh()`）。
- **P3 台账**：R4-B～R4-E / S-41 / R3-C / R-A / R-B 残留 / R-C / R2-A / R-D ①③④ / R-E / R-F / R2-B AgentClient 侧 / R2-D 未处理、未经 Walter 风险接受；R3-B 落点 T-A13a、未修、未经风险接受；S-42 / S-43 已由 r6.11 / r6.10 吸收，S-38～S-40 由作者自决；新增 S-44～S-48。

## 下一步

1. 集成人原样提交本文件（R11），以该 SHA 作为第五批有效 Checklist，更新 `specs/README.md` 本 feature 行与 implementation-log §20.4“开码前置”。
2. 第五批按 §6 DAG 在同一实施树串行开码：T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04；Implement 首选 `openai/gpt-6-astra`（新会话、实施树）；每任务固定 commit + 逐命令输出摘要回报；任一任务实际超 2 h（B06 / C01 / C02 已到上限）、旧用例真实失败、需改 §20.2 表以外文件、或发现与 plan / tasks 精度不符，先停下回报，不在实施中偷换。
3. 作者可自行决定是否吸收 S-44～S-48（均为措辞 / 实施提示 / 范围登记，不需重过 Checklist）；S-45 建议随下一次 Tasks 精度轮一并落实，以免条件句被引用为先例。
4. 本批完成后 Converge → 独立代码 Review（新会话、异模型），该 Review 须按「阶段说明」所列项核对真实 diff、旧用例零改动、store / 壳零 diff、R3-B 关闭与否。
5. H-x ④ 待 v2 集成树所有者登记；interface-handoff §5 待 v2 接收方确认；main `072bb12` 同步由集成人按 §7 决定。

## 结构核验证据（R11，只读）

```text
TARGET    fdac9f2be23dabef2b825ba9f2393477e0eaf76b（parent 4bc6627）；worktree D:/2030/Futures-AI-interaction-checklist-batch4 @ review/workbench-interaction-batch4-checklist；启动 git status clean
DIFF      git diff --stat 4bc6627..fdac9f2：specs/README.md | analyze.md | implementation-log.md | interface-handoff.md | plan.md | tasks.md；6 files, +436 −65；全部在 specs/（no code）
ZERO      git diff --stat 4bc6627..fdac9f2 -- docs AGENTS.md HANDOFF.md frontend backend templates design = 空；git diff --stat ae592ba fdac9f2 -- frontend = 空；spec blob 102af73b… / checklist blob 4537c55f…（= 37e2f71 的 R10 原件）未动；spec AC 去重计数 46
CODE      job-state.ts removeUpload：findUpload → writableJob(已归属) → removed=true 无条件 → appendDatasetRevision（修订 + delete/remove_source + updatedAt）/ emptyReceipt；confirmIntake / assignUpload 对 removed → validation_error；commit 抛错在 state=validated 之前 ✓
          mock/index.ts readJobState：delay → read()（not_found 独立）→ error 抛 adapter_error → parse ✓；methods.ts 22 data + 2 agent = 24；removeUpload.params = tuple[uploadId, reason trim().min(1)]
          types.ts：CONTRACT_VERSION 2.0.0；九张 Label + 私有 labelSchema()；SourceNoteSchema.reliability 内联 enum（.options 可用）；IntakeFileMetaSchema 扩展名 refine；IntakeInputSchema discriminatedUnion（.options[i].shape）；FieldMappingSchema min(1)×3；UploadSchema 可选 quarantineReason ✓
          real/index.ts 逐方法 NotImplementedError；real-stubs.spec requests 22 键 + satisfies 全键 + 键集合断言 + test.each 22 = 23 例 ✓
          contract-labels.spec：enums 2 / labels 9×each + 1 = 10 / notes 1 = 13；v1 contract-doc / contracts 计数动态（methodSemantics / contractSchemas）✓；contract-build.mjs 对 contractSchemas 表驱动（UploadStatusLabel 小节先例）✓
          job-state-pool.spec：assign 2 / removeUpload 2+1+1 = 4 / cancelJob 5；无重复 remove 用例 ✓
          jobs.ts 113 行：readDetail 每次 currentJob.value = job（新对象）→ computed(readonly) 新引用；refresh 列表/详情各自 try；无 intake / listInterventions 成员 ✓
          JobDetailPage.vue 106 行：watch 含 onCleanup/stale/!stale；根 section grid；ready 分支 = 头 + StageRail + StageWorkspace(:stage)；StageWorkspace.vue 26 行只收 stage ✓；JobListPage：h1 作业 / .job-create-toggle / .job-filters（唯一 button）✓
          Loading = <p role=status aria-busy>；ErrorState {moduleId,error,ts?} 重试仅 retryable；EmptyState {message?} ✓
          旧断言：job-detail 13（h1 / .job-* / aria-current / aria-pressed / findComponent(Loading) / reads 恰 2 / lists 0 / listStatus idle / 分析工作区占位）；detail-stage 5 + list-create 1（strict heading1 / region / navigation / .job-status-badge）；job-list 12（select[aria-label=状态|类型] / input[aria-label=标题] / .job-filters button）；job-create 5 ✓
FIXTURE   interventions.json 6：j-collect 1（collect/ingest）；j-process（process/approve）；j-running（analyze/ask_why）；j-deliver 2（deliver/rewrite + framework，同刻 08:02:00）；j-delivered（deliver/finalize）
          uploads.json 池 2（u-unassigned-file pending；u-unassigned-quarantine quarantined 带原因）；job-detail.json 各作业 2 条 url；所有种子 mapping === preview.fields ✓
ENV       vitest happy-dom 21.0.4、restoreMocks；本树无 node_modules；只读内省 D:/2030/Futures-AI-interaction-review-batch4/frontend/node_modules（Node 25.2.1）：File.prototype 自有 [constructor]，text/arrayBuffer/stream/slice 继承自 Blob.prototype；FileReader.prototype 自有 [constructor]，readAs* 继承；URL.createObjectURL / DataTransfer / DragEvent / FileList 存在；@vitest/spy spyOn：getDescriptor 沿原型链、defineProperty 到目标对象、restore deleteProperty；populateGlobal KEYS 含 File/Blob/FileReader/FileList ✓；zod 4.6.7 ZodTuple 无 .items getter（用 .def.items）
          check.mjs：glass 允许 {glass-focus, glass-module, glass-drawer}（AgentDrawer 先例）；.intake-* 不命中；grid 要求 minmax；tsconfig include tests/** e2e/** ✓
TASKS     HEAD：73 任务 / 107.0 h（A33·45.5 B8·12 C5·8.5 D3·5 E3·5.5 F7·12 G10·14.5 H4·4）/ 每项 0.5–2.0 h 0 例外 / 真实图 CYCLE None / BACKEDGES [(T-B03, T-B04)]（父 同）
          parent：70 / 104.5 h / 235 / 235 / 27 + 43；HEAD：27×已完成 + 46×未开始；标准 245 ↔ 命令 245 逐任务 1:1、编号连续（0 例外）；标准含 AC 0 例外；UNKNOWN_DEP []；矩阵 46 = spec 46（差集 ∅）；PARTIAL_NOT_ANCESTOR []；BIDIR_BAD []
          父→HEAD 逐任务 est/deps/状态/STD/CMD 比对：差异仅 A01a / A13a / A15a（新增）、A15（est 1.5→1、STD/CMD 5→4）、A17 / D02 / E03 / F03（只 deps）、B06（est、deps、STD 1–3、CMD 2–3）、C01（deps、STD 2–4 追加）、C01a（est、deps、STD 3/5、CMD 5）、C02（est、deps、STD 1–4 追加、CMD 4）、C03（deps、STD 1–4 追加、CMD 4）、C04（deps、STD 1–3 追加）；其余 59 任务零变化
          矩阵 diff：仅 AC-003-3 / 003-5 / 007-1 / 007-3 / 008-1 / 008-2 / 008-3 的部分前置列；最终任务 / 最终命令零变化
          -t/-g 全文件 234 / 去重 176（父 227 / 172；+4 新唯一标题 reliability label / R3-B repeated remove / history scenarios / history refresh；WI listInterventions 换文件）
          第五批：A01a 0.5←A01；A13a 0.5←A13；A15a 0.5←A13；B06 2←B04,A15a,A01a；C01 2←A22,A12,A22a,A01a；C01a 1.5←C01,B04；C02 2←C01,C01a,A23；C03 1.5←C02,A13,C01a,A13a；C04 1.5←C03,B04,B06；合计 12 h、33 命令（3+3+3+3+5+5+4+4+3）
          B06 ∈ anc(C04) True；A15a ∈ anc(A17) True；A15a ∈ deps(A15) False；READY（已完成依赖齐）：A01a / A13a / A14 / A15 / A15a / A16
          注意：B06 依赖行括注含 T-A15（非依赖）；本脚本剥括注后取号，否则会误得 B06 ← A15
AGENTS    §2 第 6 步 0.5–2 h / 任务；§2 第 8 步依赖顺序；§4 审计纪律；§5.1 / §5.2 / §5.3 / §5.5 / §5.6 / §5.7；§6 通道：A = claude-fable-5-1 via anthropic（PI_SESSION_ID 01a18938-3e93-7225-b28c-5323c62758f9；bridge 本窗口 quota / spend_limit 无重置证据，不重试；fable 未单独探 bridge、不伪称；官方通道近期成功；只换通道不换模型；未改配置）
WRITE     唯一改动仓库文件 specs/workbench-interaction/checklist.md；临时文件在独占 Temp/checklist-r11/（r11-struct.py、struct-*.log、std-cmd-diff.log、tasks-*.md(+.r11dump.txt/.matrix)、introspect.mjs、r11-section.md）；git diff --check 见回复；不 commit
```

---

# R10（2026-10-29，第十轮：第四批 r6.9 派工准备的限定范围定向复核；只核六项审查重点、R9 已认可项“未回退”与结构数字，不重审既有设计；本节是 **Checklist R10**，与 analyze.md 的「Analyze R16」无关，也**不是**第四批代码 Review；**历史快照，复选框已改为文字符号，不参与当前判定**——其 26 ☑ 为 R10 时点对 `94f1f83` 的结论，第四批据其提交 `37e2f71` 开码并经 `review-batch4.md` / `review-batch4-r4a.md` 通过，当前有效勾选见 §R11）

## 基线与范围

- **审查对象（固定）**：本工作树 `D:/2030/Futures-AI-interaction-checklist-batch4`，分支 `review/workbench-interaction-batch4-checklist`，HEAD = `94f1f83d6871cdd9ef6ce1e57d13d505992fda70`，启动时 `git status --porcelain` 为空、clean。增量 diff `git diff --stat 6ba2a15..94f1f83`：**6 文件 +417 / −29，全部在 `specs/`**——`specs/README.md`（本 feature 行）、`analyze.md`（页首当前结论 + 新增「Analyze R16」）、`implementation-log.md`（页首当前状态块、§7 一行、§8 r6.9 更新段、新增 §14）、`interface-handoff.md`（页首 r6.9 块、§1 r6.9 口径段、§3 r6.9 接口精度段）、`plan.md`（页首 r6.9 记录、§1 R2-C 令牌表、§2.1 详情页入口与阶段轨道、§2.3 详情视图缓存）、`tasks.md`（页首 r6.9 块；§2a 页面切片一格；新增 T-A22d；T-A23 状态行旁注；T-B01 / T-B02 / T-B03 / T-B04 状态 / 预计 / 依赖 / 修改范围【r6.9 精度】/ 标准；§5 标题 + 五行；§6 三句）。**独立核实的零差异**：`git diff --stat af24c82 HEAD -- frontend` 为空（源码 = 第三批 + R3-A 补修受审 `af24c82`）；spec blob `102af73b…`、本文件 HEAD blob `74084c13…`（= `ab742f5` 所提交的 R9 原件）均未动；`docs/**`、AGENTS.md、旧 Review / Converge 原件、根 HANDOFF 在本增量无 hunk；spec `AC-\d{3}-\d` 去重 = 46。
- **重读**（本轮开始时重新读取，不依赖会话记忆）：AGENTS.md（§2 第 5～8 步、§3、§5、§6）、`docs/plan.md`（D-015 行与编号说明）、`docs/designUI.md` §2.4 / §3.9 / §6 :214、`design/ui/UI_COLORS.md#status_colors` 与暗色对应表（:274–:281）、冻结 spec v1.1（§2 范围句、R-001 / R-002 全文、AC-001-1～5、AC-002-1 / 2、AC-007-3、AC-009-1）、plan.md 页首 r6.9 / §1【r6.9】/ §2.1【r6.9】/ §2.3【r6.8】【r6.9】、tasks.md（页首 r6.9 块、§1 全局约定、§2a、§3、T-A22a / T-A22c / T-A22d / T-A23 / T-B01～T-B04 全文、§5、§6、§7）、analyze.md「Analyze R16」全文、implementation-log 页首 / §8 / §13 / §14、interface-handoff 页首 / §1 / §3、`specs/README.md` 本 feature 行、本文件 §R9 全文、`review-batch2.md` §4 R2-C 行与 §7 第 3 条、`review-batch3-cache-fix.md`（R3-A 已关）。
- **真实代码事实（本树 frontend = `af24c82`，逐文件读 / 只读脚本，不以作者 Analyze R16 §2 摘要代替；下列为本审核员独立核得）**：
  - 三个徽标 SFC（`jobs/components/{JobStatusBadge,ArtifactStatusBadge,SourceBadge}.vue`）：根 `<span class="…-badge">`，样式**均为** `border: thin solid var(--fai-status-ok)`，无状态分支；文字色 Job / Artifact = `--fai-text-secondary`、Source = `--fai-text-primary`；无 `data-*` 属性。shared `Badge.vue` 以 `.badge[data-badge='warn'|'bad'|'sample']` 改 `border-color`，sample 另加 `border-style: dashed`。⇒ R2-C 事实属实（`failed` / `conflict` / `quarantined` 现为 ok 边框）；plan §1【r6.9】“沿用 `[data-badge]` 写法”有真实先例。
  - `design/generated/tokens.css`：`--fai-status-ok: #6CA7C7`（蓝）、`-warn: #C69633`（琥珀）、`-bad: #DF5C4D`（= `--fai-accent-red`）、`-sample: #8F8D87`（= `--fai-text-muted`）、`--fai-glass-module-border: rgba(255,255,255,.09)`。`UI_COLORS.md` :278–:281：ok 为“亮化蓝，不是行情方向”、bad “仅点 / 边框，文案用 text.primary”、sample “配虚线边与「样例」文字”。⇒ 映射表只用既有令牌、状态不绿、sample 不用、红只作边，全部与设计资产一致。
  - `scripts/check.mjs` `checkGlass` 正则 `(?<![\w-])glass-[\w-]+`：`--fai-glass-module-border` 中 `glass-` 前为 `-`，**不命中**；`shared/components/ErrorState.vue:85` 已用该令牌且当前 `check --only glass` 通过（第三批 A 亲跑 24 / 10 / 2）。⇒ B01 命令 3 的 `check --only glass` 不会因中性边令牌误报。
  - `tests/component/jobs/badges.spec.ts`：`WI status badges` = 9 + 4 + 3 + 1 + 1 = **18**，`WI source badge` = 4 + 4 + 1 = **9**，合计 27；:19–:21 只剥 `class` / `style` / `data-v-*`，其余断言只看 `children[1].textContent` / `text()`。⇒ 根上新增 `data-status` 不改变任何既有断言的结果；“只新增 `WI badge tone` 组”可行。`styleRule`（`?raw` + `CSSStyleSheet` + `<style scoped>` 切片，按 `selectorText` 精确匹配）已在 `modules.spec` / `focus-band.spec` / `topbar.spec` / `typography.spec` 四份 spec 中各自内联，复制到 `badges.spec` 符合仓库既有做法。
  - 契约枚举：`JobStatusSchema` 9 值、`ArtifactStatusSchema` 4 值、`UploadStatusSchema` 3 值；plan §1【r6.9】表 ok / warn / bad / 中性四列恰好覆盖 9 / 4 / 3 全部值、无重叠无遗漏（Job：5 + 1 + 1 + 2；Artifact：1 + 1 + 1 + 1；Upload：1 + 1 + 1 + 0）。
  - `jobs/stores/jobs.ts`（71 行）：成员 `jobs / listStatus / listError / filter / filteredJobs / ensureJobs / refresh / applyFilter / createJob / receiveAgentEvent`；`refresh()` 单一 try、捕获后 resolve；`createJob` 成功恰一次 `refresh()`；读经模块级 `dataClient`（`contracts/index.ts`）。无 `openJob` / 详情成员。`interface-handoff.md:163` r6 表已登记“本 feature 内部另有 `openJob()`”，tasks §1-9（r6，R7 通过）已写 `refresh()` “同时重读……已打开的作业详情 / 工作区”。⇒ 详情视图缓存是既有设计的定形，不是新 what。
  - `contracts/mock/index.ts` `readJobState`：`delayScenario` → `read()` → error 场景抛 `adapter_error`（retryable）→ 边界 parse；`job-state.ts findJob`：未知 id 抛 `not_found`（retryable=false），`emptyJobIds` 命中返回 null；`getStageWorkspace` 对预置 id 返回 `emptyWorkspace(stage)`；读路径不触碰 persistence（只有 `commit` / 初始化 `loadJobsSnapshot`）。`parseBoundary` 把 zod 失败转为 `validation_error`。⇒ T-A22d 标准 2 的四种语义（slow / empty null / adapter_error / not_found）与真实契约一致；“读期间不调用 localStorage”成立。
  - `contracts/types.ts`：`CreateJobInputSchema` strict（`title` / `subject` 均 `trim().min(1)`，`subject` nullable，`goal` 任意字符串），`.shape.title.safeParse` / `JobTypeSchema.safeParse` 可用于表单即时提示（tasks §1-7）；`JobSchema` 比 `JobListItem` 多 `goal / createdBy / parentJobId`；`stages` 恰四项固定顺序由 zod 边界约束；`StageSummary = {stage, state, pendingCount}`。⇒ B03 表单映射（subject 空白 → null、goal 可 `''`）是契约 trim 规则的必要前置；B04 详情头字段全部来自 `Job`；StageRail 不需推导顺序。
  - `tests/unit/jobs/jobs-store.spec.ts`：5 组 **27** 例（5 / 2 / 4 / 7 / 9），`connect()` 只对 `listJobs` / `createJob` 做透传 spy；模块级 `dataClient` 与 `createMockDataClient()` 共享 `job-state.ts` 模块状态，`readJobState` 按共享 `getJobScenario()` 取场景。⇒ 新组可在 `connect()` 之上再加 `getJob` / `getStageWorkspace` 透传 spy 计数而**不改** `connect` / `changeScenario`。
  - `tests/unit/jobs/routes.spec.ts`（9 例）/ `session-context.spec.ts`（4 例）：只 `router.push` / `resolve` / `getRoutes`，**不挂载**页面组件；`routes.spec` 顶层 import 两个页面 SFC。页面开始 import `useJobsStore` → `contracts/index.ts` 在 vitest 下的模块副作用已由 `jobs-store.spec` 证明可用。⇒ “预计无需维护、失败即停报”的判断成立。
  - `jobs/routes.ts`：`/jobs/:id/:stage?`，缺省 stage 的 `params.stage` 为 `''`（`routes.spec:17`）；`session.ts` `afterEach` 只在 `StageSchema.safeParse(to.params.stage)` 成功时设上下文，无公开 setter。⇒ B04 的“缺省 / 未知 → `openJob(id, null)` → `router.replace` 一次”与 H-4 守卫自然衔接；replace 后上下文随之设置。
  - `shared/components/ErrorState.vue`：props `{moduleId: string; error: ContractError; ts?: string}`，诊断 = `JSON.stringify({moduleId, code, message, ts})`，`navigator.clipboard.writeText` 复制，`重试` 按钮仅在 `error.retryable` 时渲染；`EmptyState` props `{message?}`；`Loading` props `{message?}`。⇒ B01 / B04 / B03 的三态与诊断 JSON 形状、“not_found 无重试按钮”均按真实签名写。
  - `app/Rail.vue:152–:154`：`.nav-link[aria-current='page'] { border-inline-start-color: var(--fai-accent-red); … }`。⇒ B04 “参照 Rail 当前项写法、既有令牌边线、红只作边”有真实先例。
  - fixtures `jobs.json`：normal **5** 作业（j-collect / j-process / j-deliver / j-failed / j-cancelled）；`j-process` = research / processing / currentStage process / subject 非空；`j-failed` stages = done / done / **conflict** / not_started；job-running 的 `j-human` stages = done / **needs_human** / **running** / not_started。⇒ B01 标准 1 “5 张卡片”、B04 标准 1 “两条路径合起来覆盖五种阶段态”“`/jobs/j-process/collect`：`aria-current` 在处理、`aria-pressed` 在提取”、标准 2 “replace 为 `/jobs/j-process/process`”、B03 标准 2 “专题 / 处理中”均与种子一致。
  - `playwright.config.ts`：`testDir: './e2e'`，自管 `pnpm dev --port 4173`；`e2e/jobs/` 目前不存在。⇒ 新建 `e2e/jobs/*.spec.ts` 自动纳入，不需改配置。
  - `package.json`：vue `~3.5.44`、vue-router `^4.6.4`、pinia `^3.0.0`、vitest `^5.0.5`、@playwright/test `1.64.1`（本树未安装 `node_modules`，本审核员未装依赖；以下关于调度顺序的说法是对 Vue 3 公开行为的理解，不是本树运行核实）：经 `RouterView` 渲染时，路由切换先由父组件更新卸载 `JobDetailPage`，已停止的 pre-flush watcher 任务被调度器跳过，其 `watch` 不应再以 `id=undefined` 触发；直接挂载页面再 `push` 则页面不卸载（S-42 只作 harness 提示，不是产品缺陷）。
- **审核员与通道**：A = **claude-fable-5-1 via anthropic**（页首 R10 通道行）；新开独立会话、独立 worktree；与被审作者 claude-opus-5-5、Implement 首选 openai/gpt-6-astra 均异模型。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试、未启动子 agent / 服务、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写入任何其他 worktree、未修改 plan / tasks / analyze / implementation-log / interface-handoff / spec / README / 代码 / fixtures / tests / 审核原件。结构复算用**本审核员自写**的 `python` 一次性脚本只读完成（不沿用作者 `prepare-struct.py`；依赖按真实图做 DFS 环检测、编号前向另记 BACKEDGES、矩阵祖先与双向按任务正文 AC 引用核），脚本与日志在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch4-01a18388-nzh9q1wh/`（`checklist-r10-struct.py`、`checklist-r10-structure.log`、`checklist-r10-structure-parent.log`、`checklist-r10-tasks-HEAD.txt`、`checklist-r10-tasks-parent.txt`、`checklist-r10-std-cmd-diff.log`、`checklist-r10-section.md`；非项目产物、不入库、不清理共享 tmp）。唯一写入的仓库文件为本文件（新增 §R10、页首 R10 通道行与「文件结构」段、把 §R9 的 26 个 `[x]` 改为 ☑ 文字并在其标题补“历史快照”；R9 其余内容未动）。本审核员不 commit；**第四批有效 Checklist = 本节被集成人提交后的 SHA；未提交前 T-B01 不得开码**。

## 结论（R10）：**通过**（定向；r6.9 的 R2-C 令牌映射、B03 挂载点与表单映射、B03 → B04 有意回边、T-A22d 详情视图缓存拆分、B04 URL 入口定型与两种轨道标记、harness 与写权限全部判定为**既有需求与既有设计内的机制 / 粒度 / 顺序精度**，不需回流 Clarify / Gate 1、不改 spec / 46 AC；**0 P1 / 0 P2**；3 项 P3 建议 S-41～S-43 不阻断）——**26 项当前有效检查项 26 ☑ / 0 ☐**。

本结论的边界（必须同时成立，不得单独引用）：

1. 本轮只核六项审查重点（§1～§6）、R9 已通过项“未回退”与结构数字；R9 的 26 ☑ 按其原判定沿用，本轮对 r6.9 触及的项（N-02 / N-04 / I-01a / I-01b / I-03 / I-04 / V-01 / V-02 / V-03 / P-1 / P-3 / P-6 / C-01 / C-03 / C-07）重新判定，其余只核未回退。第四批 **T-B01 / T-B02 / T-A22d / T-B04 / T-B03 均未实施**，一行代码未写、一条测试未跑（`frontend` 与 `af24c82` 零差异）；46 AC 最终验收仍 **0**；21 / 69 的“已完成”= 批次代码 Review 通过而非 AC 验收；feature **未收敛**（48 项未开始 + H 组 `blocked_by: frontend-workbench-v2`）。本轮未运行任何产品测试，不声称任何命令会通过；未写的 tests 不是证据。Gate 2 / Handoff 不在本阶段。
2. 本审核员不代 Walter 做风险接受（R-A / R-B 残留 / R-C / R2-A / R-D ①③④ / R-E / R-F / R2-B AgentClient 侧 / R2-D / R3-B / R3-C 仍未处理、未经风险接受；R2-C 本批只是**归属与设计已定、代码未修**，关闭与否由第四批代码 Review 判定），不代 v2 接收方签收 interface-handoff §5，不代 v2 集成树所有者登记任何 H-x ④，不就 H-2·标签 ① 是否改为 B01 提交做决定（集成人已决定：以 B01 提交更新 ①、重跑 `WI status badges` 18 / `WI source badge` 9 / 新组；④ 仍缺——`94f1f83` commit body），不就 main `072bb12` 的同步做决定。
3. 按 AGENTS §2 第 8 步，Implement 前置 = 当前有效轮次全部勾选；本节 26 ☑ ⇒ 第四批可在**本节被提交后**按 tasks §6 DAG 在同一实施树串行开码（T-B01 → T-B02 → T-A22d → T-B04 → T-B03；A22d 与 B01 互不依赖，作者选定的顺序是执行顺序而非拓扑要求）。本节未提交前仍为 blocked。本节是 Analyze R16 §8 所指“开码前限定范围 A 定向复核”，由集成人裁量发起；**不替代**第四批完成后的独立代码 Review。

## 独立核验（不照单全收作者结论）

### 1. T-B01 纳入 R2-C（协调器重点 1）：既有令牌、既有 Review 归属、范围与耗时可接受

- **语义**：plan §1【r6.9】表 ok = 作业进行中四态 + delivered、产物 confirmed、上传 ingested；warn = needs_human / provisional / pending_validation；bad = failed / conflict / quarantined；中性 = draft / cancelled + SourceBadge 全部。本审核员按契约枚举逐值核对：16 个值全部落入恰一列，无遗漏、无重叠；“进行中 = ok（蓝）”“delivered = ok”“draft / cancelled 中性”与 `UI_COLORS.md` 的 ok / warn / bad / sample 语义和 D-015 “状态不借用涨跌令牌”一致；“来源与状态正交”正确——`SourceBadge` 不写 `data-status`，根本不进入状态色体系，比“写一个静态中性标志”更简单，也不会被误读为新增 source 状态推导。
- **不用 sample**：设计资产 :281 规定 sample 须配虚线边与「样例」文字；三个徽标没有样例语义，用 sample 会要求虚线和文案、且让“中性”与“样例”混淆。中性边取 `--fai-glass-module-border`（既有令牌，`ErrorState` 按钮已用）正确。
- **只用既有令牌 / 不新增机制**：实现 = 根 `:data-status="status"` + SFC 内 `[data-status=…]` 属性选择器（shared `Badge.vue` 同写法）；不建 TS 色调映射 / helper / schema / 枚举；props / 文案 / 图标 / class 名不变；`check --only colors` 无新字面量、`check --only glass` 不命中（本审核员核正则）。✓ 零新增颜色 / 状态 / 机制。
- **测试真实性**：标准 3 用 `styleRule` 解析**真实 SFC** 的 `<style scoped>`（仓库四份 spec 先例），断言基础规则边框令牌、每个 ok / warn / bad 值命中规则的 `border-color`、中性值无专属规则、三 SFC 无 `--fai-status-sample`、`color` 声明不取状态色 / 点睛红、SourceBadge 无任何 `--fai-status-`；DOM 侧逐枚举挂载断言根 `data-status` 等于该值、SourceBadge 根无该属性。这是对真实组件输出的断言，不是复写映射表（AGENTS §5.6）。实施提示（非标准）：若把多个值合写在一条逗号选择器里，“每个值命中的规则”应按 `selectorText` 包含该值匹配，而不是精确等于单选择器；两种写法都能满足标准，不改命令。
- **范围 / 所有权**：只改三个 `jobs/components/*.vue` 的样式与根属性，`badges.spec.ts` 只新增一组；`shared/**` 明列不改（implementation-log §14 表、tasks T-B01【r6.9】“一律不改”）。✓
- **耗时**：原 1.5 h + R2-C（`review-batch2.md` R2-C 估“0.5 h 以内样式修订”）= 2 h，顶格但未越限；标准 / 命令 3 ↔ 3、4 ↔ 4 新增 1 : 1。本审核员不认定已知超额；实际超 2 h 按 §7 S-22 停下拆分，不在实施中偷换。✓
- **H-2·标签**：交接 props / 文案 / 图标不变；① 改为 B01 提交并重跑 18 / 9 是集成人已做的决定（`94f1f83` commit body、interface-handoff 页首 r6.9 块），本节只核其不与本 feature 规则冲突：`-t "WI status badges"` 集合仍 18（新组标题不含该前缀）。✓

### 2. T-B03 挂载点、表单映射与 B03 → B04 回边（协调器重点 2）

- **挂载点**：原修改范围只列 `JobCreatePanel.vue`，而 `JobListPage.vue` 现为无入口骨架（本审核员读 6 行源码），不明写就只能越权或猜测；r6.9 允许在 `JobListPage` 挂“新建作业”按钮（`aria-expanded`）与内联 `<section>` 面板，并明写无 `role="dialog"` / `aria-modal` / 遮罩 / `position: fixed` / `inert` / 焦点锁、展开时列表与筛选仍可操作——与 spec R-001 “非模态的内联面板”（tasks T-B03 上下文原文）、AC-007-3 部分前置、T-C01a 的非模态口径同义。✓ 既有 what 内的落点精度。
- **表单 → `CreateJobInput`**：`subject` 空白 → `null`（否则契约 `trim().min(1).nullable()` 会拒绝仅空白主题——既有 `jobs-store.spec:338` 已证明 `subject: ''` 被拒）；`goal` 可 `''`；`type` 无默认、初始占位；即时提示只复用 `CreateJobInputSchema.shape.title.safeParse` / `JobTypeSchema.safeParse`（tasks §1-7 “表单只复用契约 schema / 常量”）；校验失败不调 `createJob`；成功经既有 `useJobsStore().createJob(input)`（内部恰一次 `refresh()`，已由 `WI H-2 createJob refresh` 固定）再 `router.push` 到 `/jobs/:id/collect`；失败以原 `ErrorResponse.error` 显示 `ErrorState`（`moduleId='job-create'`、`@retry` 同一输入再提交）。本审核员核 `ErrorState` 真实签名与 `retryable` 分支：adapter_error 有重试、validation_error 不会到达（已被即时校验拦下）。✓ 不新建故障框架、不加重复提交锁 / 草稿。
- **端到端**：保留“读取 `localStorage["fai.jobs.v1"]` 中新作业记录 + 核对详情页回显”（r5 既有标准 2，R7 通过）；【r6.9】只把断言具体化为 `{title, type:'research', subject:null, goal, status:'collecting', currentStage:'collect', createdBy:'human'}` 与详情头 / 状态徽 / `aria-current="step"`——字段与 `createJob` 真实写入（`job-state.ts:createJob`：`createdBy:'human'`、collecting / collect）一致；经 Playwright `page.evaluate` 读快照，**无窗口钩子**、不改 `playwright.config.ts`（`testDir: './e2e'` 自动纳入）。✓
- **B03 → B04 有意回边（独立判断）**：
  - 必要性：B03 标准 2 要核对“详情页回显”，详情页由 B04 提供；若保持 B03 先于 B04，端到端只能删这项覆盖或伪造回显——删标准讨绿是 AGENTS §6 规则 6 禁止的方向；加依赖是唯一诚实做法。
  - 规则性质：tasks §6 “每个任务只依赖排序在它之前的任务”是 Analyze R6 时为脚本无环检查设的**本文件约定**，AGENTS §2 第 6 步只要求任务可按依赖顺序执行，不规定编号必须前向。重编号 B03 ↔ B04 会牵动 §5 矩阵、§2a、interface-handoff、历史 Review / Converge 与 README 中的 T-B03 / T-B04 引用，收益为零。
  - 真实性：本审核员自写脚本按真实依赖图 DFS：**CYCLE None**；编号前向检查：**BACKEDGES = [(T-B03, T-B04)]**，唯一；tasks 页首 / §6 / T-B03 状态行三处如实登记“唯一有意回边、拓扑无环”。矩阵同步：AC-001-3 部分前置加 B04，B04 标准 1 引用“AC-001-3 部分前置（供 T-B03 端到端核对回显）”；B04 是 B03 的祖先（直接依赖）。
  - 判定：**可接受**。附带要求（已满足）：今后任何结构脚本必须按依赖图做环检测，不得把“编号前向”当作无环证明；analyze R16 已明写脚本改法，本审核员脚本亦独立实现。
- **所有权**：B03 = 新建 `JobCreatePanel.vue` + 改 `JobListPage.vue`（挂载）+ 两份新测试；不改 `stores/jobs.ts` / 契约 / `shared/**` / `app/**` / B01 / B02 / B04 已有用例。同一实施树串行，后序任务在前序文件上继续改是 §14 明写的口径。✓

### 3. T-A22d 详情视图缓存（协调器重点 3）：既有设计的定形，粒度拆分正确，无遗漏需补机制

- **是否新 what**：`openJob()` 自 r6 起就登记在 interface-handoff §3 表“本 feature 内部另有”，tasks §1-9（r6）已写 `refresh()` 重读“已打开的作业详情 / 工作区”，原 T-B04 修改范围（r5）已含“`stores/jobs.ts` 增加当前作业 / 阶段工作区视图缓存（`openJob(id, stage)`）并纳入 `refresh()`”。r6.9 只补成员名、签名、loading / 失败 / 锚 / 隔离口径——**既有设计精度，不是新机制**。
- **拆分**：原 T-B04 顶格 2 h；再并入定形的四个只读成员 + action + 私有读函数 + 三组 store 单测（≈ 10 例）属已知超额，按 R8 B-12 先例在 Tasks 阶段拆出 1 h 任务，而不是以 §7 S-22 兜底预吸收。拆后 B04 仍 2 h、只消费 store；A22d 1 h 与 T-A22c（0.5 h：一处修改 + 2 例）/ T-A22a（1.5 h：store 全部 + 5 组）体量比例合理。依赖 A10 / A22a / A22c 全部已完成、全部前向。✓
- **接口核对（对真实 store 与契约）**：
  - 只读 `currentJob / currentStageWorkspace / detailStatus / detailError`（`computed` + `readonly`，同既有成员写法）；`openJob(jobId, stage | null): Promise<Stage | null>`；私有锚不导出；无 `closeJob` / setter；H-2·列表公开成员 `jobs / listStatus / listError / ensureJobs / refresh / createJob` 签名与语义不变；`-t "WI H-2"` 集合不扩大（新组标题 `WI detail cache *`）。✓
  - `openJob`：先置锚；仅换作业（含 `currentJob` 为 null）置 loading，同作业切阶段不回 loading；`getJob` → 有效阶段 = 入参 ?? `job.currentStage`；job 为 null（empty 预置 id，S-13）不读工作区、两缓存 = null、返回 null；成功写缓存 / 锚 stage 定为有效阶段 / ready / 清错 / 返回有效阶段；失败保留旧缓存、error + 原 `ErrorResponse.error`、resolve null（S-38 同口径）。与 `readJobState` / `findJob` 的真实语义（not_found retryable=false、adapter_error retryable=true、null 只在 empty 预置 id）逐一对拍一致。✓
  - `refresh()`：列表块原样（含【r6.8】只由列表块写 `listStatus` / `listError`），之后锚非 null 时独立 try 重读详情，不置 loading，只写 `detailStatus` / `detailError`；列表失败不跳过详情、详情失败不污染列表。标准 3 的“打开 `j-missing` 后 refresh：`listStatus='ready'` 而 `detailStatus='error'`”“error 场景两份各写各错、切回 normal 两者恢复”正是 R3-A 口径的直接延伸，可用真实 mock 场景验证。✓
  - 写后 / agent 终态经同一 `refresh()` 自动带上详情；`receiveAgentEvent` 触发条件不变；`main.ts` 不改。✓ §1-9 统一刷新保持“一处写路径、一次 refresh”。
- **遗漏核查（协调器重点 3 点名的四类）**：
  - *空*：empty 预置 id → `currentJob=null`、ready、`EmptyState`（B04 ready 且 null → “暂无作业。”）；锚 stage 可为 null，后续 refresh 若 job 出现则以 `job.currentStage` 读工作区。无遗漏。
  - *未知锚*：not_found → error 保留旧缓存；页面按 `detailStatus` 呈现，不会把旧作业当新作业显示；refresh 持续 not_found 直到换锚（已登记）。`resetMockData` 后锚指向已消失的会话新建作业 → not_found，列表页不可见、再次打开即换锚（Analyze R16 §7 已登记，T-G04 接入时知悉）。无遗漏。
  - *保留旧 cache*：离开详情不清锚不清缓存 ⇒ 每次 `refresh()` 多读一次最近详情（`getJob` + `getStageWorkspace`，mock 内存读）。这是“统一刷新 + 视图缓存”的直接代价，已在 plan / tasks / §14 显式登记为可接受；加 `closeJob` 或离开清锚会引入页面生命周期与 store 的耦合和新的公开成员，收益只是省一次内存读——按 AGENTS §5.1 不加是正确的。
  - *新 job stage 读取*：B03 创建后 `createJob` 内部 `refresh()` 先重读旧锚（额外读），再 `router.push` → 新页面 `openJob(newId,'collect')` 换锚置 loading → `getStageWorkspace(newId,'collect')` 对无 details 的新作业返回 `emptyWorkspace('collect')`（本审核员核 `job-state.ts`）。无遗漏。
  - *并发顺序*：mock 同延迟、按序完成 ⇒ 快速 A → B → A 切换在 slow 下可能短暂显示 B 后再回 A（自愈）；plan 明写按序口径、不加请求序号 / 锁（AGENTS §5.1：说不清概率 / 代价前不加）。真实 API 乱序是 `api` feature 的事，见 S-43（登记，不加机制）。
- **测试口径**：真实 Pinia + 真实 mock client + 系统边界透传 spy（`getJob` / `getStageWorkspace` 在新组内追加，不改 `connect` / `changeScenario` / 原 27 例）+ 假时钟；标准 2 “均 resolve、无 unhandled rejection”沿用 S-38 用例写法；标准 1 “读期间不调用 localStorage”以 Storage spy 量 store 自身（读路径不触碰 persistence，本审核员核实）。✓ 不复写业务逻辑、不加生产故障开关。

### 4. T-B04 详情页、URL 入口定型与阶段轨道（协调器重点 4）

- **只消费 A22d**：修改范围明写不改 `stores/jobs.ts` / `routes.ts` / `session.ts` / `main.ts` / `routes.spec.ts`；三态按 `detailStatus`，页面不调 `ensureJobs`、与 `listStatus` 无关。✓
- **固定四阶段 / 五状态**：`StageRail` props `{stages: readonly StageSummary[]; currentStage; viewedStage}`，按 `job.stages` 原顺序渲染（顺序由契约 zod refine 固定，不重排、不推导状态），文案 / 图标只取 `StageLabel` / `StageStateLabel`。标准 1 用 `j-failed/analyze`（done / conflict / not_started）+ job-running `j-human/process`（needs_human / running）覆盖五态——本审核员核 fixture 属实。✓ AC-002-1 “固定顺序、各自状态、当前阶段高亮”逐项有落点。
- **两种标记**：业务当前阶段 = `job.currentStage` → `aria-current="step"` + 既有令牌边线（Rail.vue 先例，红只作边）；当前查看 = 路由 stage → `aria-pressed="true"`。两者分开是 spec 两句（“当前阶段高亮”与“点击阶段切换对应工作区；URL 携带阶段参数”）的直接表达，不是新 what；`/jobs/j-process/collect` 的用例把两者区分得可断言。✓ 无障碍专项为非目标，`aria-pressed` 作为“正在查看”标记可接受。
- **URL 定型一次**：`watch([id, stage], {immediate})`：合法 → `openJob(id, stage)`；缺省（`params.stage === ''`）/ 未知 → `openJob(id, null)` → 返回非 null 时 `router.replace` 一次（不 push 历史）→ 监听再触发一次 `openJob(id, s)`。只在页面入口校验一次路由参数（AGENTS §5.2），不做多层校验；返回 null（empty 预置 id / 读失败）不 replace。缺省路径多读一次 `getJob` + 工作区：加比较 / 去重 guard 要在页面持有“上次已开 (id, stage)”并与 store 锚重复——两份真相；按 §5.1 不加是正确的，代价只是 mock 内存读。**独立风险判定：低**（仅缺省 / 未知 stage 入口、仅一次、无用户可见闪烁——第二次 `openJob` 同作业不回 loading）。✓
- **三态与诊断**：`idle` / `loading` → `Loading`；`error` → `ErrorState(moduleId='job-detail', error=detailError, @retry → refresh())`，not_found 按真实组件不显示重试；`ready` 且 null → `EmptyState`“暂无作业。”；`ready` 有作业 → 详情头 + Rail + 占位工作区。标准 3 四条路径（slow / empty S-13 / error 可复制并重试 / `j-missing` not_found 且 `listStatus` 不变）与 B01 列表侧合跑即 AC-001-4 最终。✓
- **C–F 占位不假交付**：`StageWorkspace` 只渲染 `aria-label="<阶段名>工作区"` 占位与一句说明，不消费 `currentStageWorkspace`；tasks §3 / 页首明写四阶段内容仍为 C–F。✓
- **详情头**：标题 / 类型 / 状态徽 / subject（null 不渲染）/ goal（空串不渲染、保留换行）全部来自 `Job`；failed / cancelled 原因区归 T-B05；不显示 createdBy → 见 S-41（P3）。
- **耗时**：拆出 store 后仍顶格 2 h（页面 + 两个组件 + 组件测试两组 + 端到端四例）；本审核员不认定已知超额，但它与 B01 同为本批 2 h 上限项，§14 已写超时即停。✓

### 5. 文件所有权与 harness（协调器重点 5）

- §14 写权限表与 tasks 五任务【r6.9】“一律不改”逐项一致：B01 = `JobListPage` + 新 `JobCard` + 三徽标（只 R2-C）+ 新 `job-list.spec` + `badges.spec` 只增组；B02 = `JobListPage`（筛选条）+ `job-list.spec` 增 `WI AC-001-2` 组；A22d = `stores/jobs.ts` + `jobs-store.spec` 只增三组（原 27 与 `connect` / `changeScenario` 不改）；B04 = `JobDetailPage` + 新 `StageRail` / `StageWorkspace` + 新 `job-detail.spec` / `e2e/jobs/detail-stage.spec.ts`（不改 store）；B03 = 新 `JobCreatePanel` + `JobListPage`（挂载）+ 新 `job-create.spec` / `e2e/jobs/list-create.spec.ts`。`shared/**` / `app/**` / `workbench/**` / `agent/**` / `main.ts` / `routes.ts` / `session.ts` / `persistence.ts` / `contracts/**` 与生成物 / fixture / `scripts/**` / `package.json` / 锁 / vite / vitest / playwright 配置 / v1 测试 / 既有 jobs 测试（两份“只增”除外）/ 壳 E2E / `backend/` / `docs/` / spec / checklist / 审核与 converge 原件 / 根 HANDOFF 明列不改；不写 v2 任何树或 peer 树。✓ 最小且充分（B03 需要 `JobListPage` 挂载权，已补）。
- **harness 可真实运行**：真实 Pinia；真实 memory-history router（`appRouter.options.routes` + `registerJobRoutes(router, pinia)`，`timeline.spec` 先例）；真实 mock client + `connect()` 式透传 spy 切场景；slow 用假时钟；clipboard 按 `focus-band.spec` 先例；`styleRule` 按 `modules.spec` 先例；不 `vi.mock` 内部模块。组件测试中的场景只能经 `window.location` 查询串 + `createMockDataClient()`（同 `connect()`），memory router 的 query 不会改 `window.location`——这是 harness 常识，`job-list.spec` / `job-detail.spec` 均按 B01 同一做法即可。
- **`routes.spec` / `session-context.spec` 不改**：二者不挂载页面；页面 import store 的模块副作用在 vitest 已被 `jobs-store.spec` 证明可用；“预计无需维护，真实失败则停下回报、不改断言 / `app/**` / 壳 E2E 讨绿”写进 tasks 页首与 §14 回报要求。✓
- **E2E**：新 `e2e/jobs/*.spec.ts` 自动进 `testDir`；B03 只读 `fai.jobs.v1`、无窗口钩子；B04 reload 用例依赖 T-A11 normal 持久化（已完成）。✓
- **接口**：H-2·列表公开成员保留；H-4 上下文只经路由守卫、无测试 setter（`session.ts` 不改）。✓

### 6. 结构与任务粒度（协调器重点 6；本审核员自写脚本只读复算 HEAD 并与父 `6ba2a15` 比对，不沿用作者数字）

- **69 个任务**（父 68；新增 T-A22d，无删除）、编号唯一、排序规则 “T-Xnn < T-Xnna < … < T-Xnnd < T-X(nn+1)” 成立（T-A22c < T-A22d < T-A23）；合计 **104.0 h**（A 30·44.5 / B 7·11 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4；父 102.5，+1 = A22d、+0.5 = B01）；每项 0.5～2.0 h **0 例外**；依赖全部指向已知任务，真实图 **无环**；编号前向检查 **1 条有意回边 (T-B03, T-B04)**（父 0）。
- 状态：**21 × 已完成、48 × 未开始**（父 21 / 47），无其他值。
- 完成标准 **232** ↔ 验证命令 **232**（父 227 / 227；+1 B01、+4 A22d），逐任务 1:1、编号连续（0 例外）；每条标准含 AC 引用（0 例外）。
- **父 → HEAD 逐任务文本比对**（est / deps / 状态 / 每条标准 / 每条命令，`checklist-r10-std-cmd-diff.log`）：差异**仅**在 T-A22d（新增）、T-B01（预计 1.5 → 2、标准 1～4、命令 3 / 4）、T-B02（标准 1 追加【r6.9】）、T-B03（依赖 + B04、标准 1 / 2 追加）、T-B04（依赖 + A22d、标准 1～3 追加）；**其余 64 个任务零变化**；B02 / B03 / B04 的命令一字未改；所有追加都是在原标准句后**附加**【r6.9】具体化，原句与 AC 标注原样保留，无删减、无放宽。作者“232 : 232、只在五任务与 §5 / §6”属实。
- §5 矩阵 46 行 = spec 46 AC（差集 ∅）；“部分前置”均为最终任务祖先（0 例外：A22d → B04 为 AC-001-4 / 002-1 / 002-2 最终的直接祖先；B04 → B03 为 AC-001-3 最终的直接祖先；B01 经 B03 → G03 → G06 → G09 → G10 为 AC-001-5 人工部分最终的祖先）；任务正文 AC 引用 ↔ 矩阵双向一致（AC-009-1 工程门除外，0 例外）。
- `-t` / `-g` 标题（全文件）222 / 去重 171（父 218 / 167；+4 = `WI badge tone`、`WI detail cache open / states / refresh`，均不含 `WI H-2` / `WI status badges` / `WI source badge` 前缀，定向集合不扩大；`-t "WI AC-001-4"` 同时匹配 list / detail 两组正是 B04 命令 3 所需）。
- **第四批**：B01 2 h（← A10 / A22 / A22a / A22c / A23，均已完成）、B02 1 h（← B01 / A22c）、A22d 1 h（← A10 / A22a / A22c，均已完成）、B04 2 h（← B01 / A22d）、B03 1.5 h（← B01 / A12 / B04）；合计 **7.5 h、17 条命令**（4 + 2 + 4 + 4 + 3），标准 ↔ 命令逐任务 1:1；命令全部带 jobs 路径；其中 e2e 两条（B04 命令 2、B03 命令 2）是各自 AC 的**最终**命令，其余单测 / 工程门。启动时依赖已满足的未开始任务：T-A14 / A15 / A16 / **A22d** / **B01** / C01（与 §14 一致）。
- **粒度判断**：A22d 的拆出是 Tasks 阶段对已知超额的处理（R8 B-12 先例），不是把原任务细节当额外 feature；B01 2 h / B04 2 h 顶格但本审核员**不认定已知超额**，也不接受以 S-22 预吸收——实际超 2 h 须停下拆分并记录。没有真正的新 feature 藏进精度（§1～§4 逐项判定）。✓

### 7. 工程准则（AGENTS §5）与流程纪律（增量）

- §5.1：零新增 guard / 请求序号 / 锁 / 去重 / 轮询 / 事件总线 / fallback / 重复提交锁 / 草稿；两处多余读取显式登记为代价而非防护。
- §5.2：路由参数在页面 `watch` 入口校验一次；表单只用契约 schema 即时提示；契约入口 parse 一次；组件不二次校验。
- §5.3：`openJob` 与 `refresh` 共用一个私有读函数（两处复用）；不抽只用一次的抽象；`styleRule` 在 spec 内联沿用仓库做法。
- §5.5：本批不改契约 / 生成物。
- §5.6：真实 Pinia / router / mock client / `createMockAgentClient` 回放；spy 只在系统边界透传；`styleRule` 断言真实 SFC；e2e 只读真实快照。
- §5.7：命令形态不变，无新工具 / 依赖 / 配置。
- **流程**：本轮未写代码（frontend 零差异）；P3 台账（implementation-log §8 r6.9 段）只把 R2-C 归属落定，其余未关项原样、未代为风险接受；main `072bb12` 不同步（R2-D 流程不变）；H-x 无一“已交付”，④ 全缺；README / 日志 / analyze / interface-handoff 四处数字与本审核员复算一致（69 / 104 / 232 / 21 + 48 / 7.5 h / 17）。✓

## 阻断项（R10）

无。

## 非阻断建议（R10；P3，不计入判定，由作者 / 实施者自行决定是否吸收；均不改 AC、标准编号或命令）

| # | 位置 | 说明 | 建议归类 |
|---|---|---|---|
| S-41 | tasks T-B04【r6.9】详情头 “不显示 createdBy” | spec §2 范围句把“创建者”列在“作业列表与详情（类型、状态、当前阶段、创建者、目标说明…）”之内，R-001 what 也列“创建者（人 / 计划）”为作业字段；46 AC 无一要求展示它，故不阻断、不改 AC。但目前没有任何任务承接“详情显示创建者”，也未在 §3 非目标登记。建议二选一登记：(a) 在后续契约任务（如 T-G06 收口或下一次 A 组精度）加第十张 `CreatedByLabel`（同 S-11 机制）并由 T-B05 作业级展示一起渲染；(b) 在 tasks §3 明写 v1 详情不展示创建者（理由：契约无展示映射、无 AC）。不在本批做 | Tasks 范围登记 |
| S-42 | tasks T-B04【r6.9】测试 harness “以 RouterView 或在 push 后挂载页面” | 建议组件测试**优先经 `RouterView`** 挂载详情页：经 RouterView 时离开 `/jobs/:id` 先卸载页面，其 `watch` 不应再以 `id=undefined` 触发（对 Vue 3 调度顺序的理解，本树未装依赖、未运行核实）；若直接挂载页面再 `push('/jobs')`，页面不卸载，`watch` 会带 `undefined` 调 `openJob` → 契约 `validation_error` 置 `detailStatus='error'` 并把锚写成无效值，这是 harness 伪影而非产品行为。只是测试写法提示，不加页面 guard、不改标准 / 命令；若实施者在 RouterView 下仍观察到该触发，按 §14 回报要求停下回报，不自行加 guard | Tasks 测试提示 |
| S-43 | plan §2.3【r6.9】“并发 open / refresh 按 mock 同延迟、按序完成口径处理” | 建议在该句后补一句登记：真实 `api` 实现可能乱序完成，届时若出现“后发先至”覆盖，按需求流程在 `api` feature 决定是否加请求序号；本 feature 不预做。目的只是让 `api` feature 的 Clarify 能从 plan 直接看到这条已知边界，不是要求现在加机制 | Plan 措辞 / 跨 feature 登记 |

## 当前有效检查项（R10 勾选；唯一参与 Implement 前置判定；R9 的 26 项沿用其原判定，本轮对 r6.9 触及项重新判定、其余只核未回退）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** 沿用 R9；spec 零 diff、46 AC 独立计数；矩阵 46 / 46（脚本差集 ∅）。
- ☑ **N-02 无未澄清歧义。** 本轮重新判定：r6.9 五项（R2-C 映射、B03 挂载点 / 表单映射 / 依赖 B04、A22d 拆分与接口、B04 入口定型与两种标记、harness / 写权限）全部为既有 what / AC 内的机制、粒度、顺序精度（§1～§5 逐项判定），未改任何 AC 判据 / 目标 / 非目标；S-41 是范围登记建议（无 AC 牵涉）、S-42 / S-43 是测试与措辞提示，不是需求歧义；无需回流 Clarify / Gate 1。
- ☑ **N-03 目标与非目标边界清晰。** 沿用 R9；tasks §3 无 diff；r6.9 明写四阶段工作区内容仍为 C–F 占位、不做 T-B05 横幅 / 取消、T-G02 角标、T-B07 重跑、C 组投放、D-020～D-024；`StageWorkspace` 占位不虚构功能。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 本轮重新判定：R-001 “新建作业 / 非模态内联面板 / 列表三态 / 徽标”与 R-002 “固定四阶段、各自状态、当前阶段高亮、点击切换、URL 阶段参数、刷新停留”在 plan §1【r6.9】/ §2.1【r6.9】/ §2.3【r6.9】均有可实现落点；AC-001-1～4 / 002-1 / 002-2 的最终任务与命令零变化；S-41 为 spec §2 范围句的一处无 AC 承接项，建议登记、不阻断。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** 本轮重读：plan §1【r6.9】与 AC-001-5 “不只靠颜色”（颜色只是二级线索）及 designUI §2.4 一致；§2.1【r6.9】与 R-002 / AC-002-1 / 002-2 逐句一致；§2.3【r6.9】与 R-001 “列表与详情具备三态”、§4 持久化句不冲突；方法集 / 动作矩阵 / 九场景 / 样例表 / 迁移表 / 定稿语义无 hunk。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核 Analyze R16 §3 五项判定与 §4 一致性成立：plan §1 表 ↔ T-B01 R2-C 逐值一致；plan §2.1 ↔ T-B04 一致；plan §2.3 ↔ T-A22d 成员 / 签名 / loading / 失败 / 锚 / 离开口径一致；【r6.8】列表读状态归属未被改写；§1-9 统一刷新不变；interface-handoff §3 r6.9 段与 tasks 一致（新成员内部、交接成员不变）。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** 沿用 R9；`docs/**` 零 diff；R2-C 映射遵守 `UI_COLORS.md#status_colors`（状态不借涨跌令牌、ok 为蓝、bad 只作边、sample 专用）与 D-015 作用域；designUI §3.9 “阶段轨道不新增玻璃层级”；D-016 / D-018 定稿语义无 hunk；D-020～D-024 未带入。
- ☑ **I-03 前端基线事实核对。** 本轮在本树（= `af24c82`）独立重核（见「基线与范围」真实代码事实）：三徽标样式与 shared Badge 写法、令牌值与 glass 守卫正则、`badges.spec` 18 / 9 与剥属性范围、`styleRule` 四处先例、契约枚举 9 / 4 / 3 与表覆盖、`jobs.ts` 成员与 `refresh` 结构、`readJobState` / `findJob` 语义、`CreateJobInputSchema` trim 规则、`jobs-store.spec` 27 例与 `connect` 范围、`routes.spec` / `session-context.spec` 不挂载、`ErrorState` 签名与 `retryable` 分支、Rail 当前项写法、fixture 五作业与五态覆盖、playwright `testDir`——全部属实。
- ☑ **I-04 文件边界与回滚一致。** 本轮重新判定：implementation-log §14 写权限表与 tasks 五任务【r6.9】“一律不改”逐项一致，且在 §1-5 所有权内；B03 获 `JobListPage` 挂载权是必要补列；`badges.spec` / `jobs-store.spec` 只增不改；`shared/**` / `app/**` / `main.ts` / `routes.ts` / `session.ts` / `persistence.ts` / 契约 / 生成物 / fixture / `scripts/**` / 锁与配置 / 既有测试 / `backend/` / `docs/` / spec / checklist / 审核原件明列不改。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 本轮重新判定：AC-001-1 / 001-2 / 001-3 / 001-4 / 002-1 / 002-2 最终任务与命令零变化；本批 17 条命令中 2 条 e2e 为各自 AC 最终、其余为单测 / 工程门与部分前置；B01 标准 3 / A22d 标准 1～3 / B04 标准 1～3 / B03 标准 1～2 的【r6.9】具体化全部可由真实实现输出断言（styleRule 真实 SFC、真实 mock 场景、真实快照 `fai.jobs.v1`、真实路由 replace）；AC-001-5 人工部分仍归 M-01。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 本轮重新复算：69 任务 / 104.0 h / 每项 0.5～2 h 0 例外 / 232 ↔ 232 逐任务 1:1 连续 / 每条标准含 AC / 真实图无环 + 唯一有意回边 (B03, B04) 如实登记 / 46 = 46 / 21 + 48 / 第四批 7.5 h 17 命令——全部成立；父 → HEAD 差异只在五任务与 §5 / §6；A22d 拆分在 Tasks 阶段处理已知超额（R8 B-12 先例）；B01 / B04 顶格 2 h 未越限。
- ☑ **V-03 静态守卫声称与真实脚本一致。** 本轮核 `scripts/check.mjs` `checkGlass` 正则不命中 `--fai-glass-module-border`、`checkColors` 只扫颜色字面量与退役色——B01 命令 3 对两守卫的声称成立；r6.9 未对守卫作任何新声称。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 本轮重新判定：零新增 guard / 序号 / 锁 / 去重 / 轮询 / 总线 / fallback / 重复提交锁 / `closeJob`；缺省路径多读一次与离开后仍重读详情登记为代价而非防护；并发按序口径不加机制（S-43 只是跨 feature 登记）。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** 沿用 R9 + 本轮：路由参数在 `watch` 入口校验一次、表单即时提示只复用契约 schema、契约入口 parse 一次、组件不重复校验。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** 本轮重新判定：`openJob` / `refresh` 共用私有读函数（两处复用）；`JobCard` / `StageRail` / `StageWorkspace` / `JobCreatePanel` 各是能起清楚名字的组件；不建 TS 色调映射 / helper。
- ☑ **P-5 自动生成文件不手改（§5.5）。** 沿用 R9；本批不改契约 / 生成物，无需 `contract --check`。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 本轮重新判定：真实 Pinia / memory router / mock client / AgentClient 回放，spy 只在 `dataClient` 系统边界透传计数；`styleRule` 解析真实 SFC 而非复写映射；e2e 只读真实 `fai.jobs.v1`、无窗口钩子；不 `vi.mock` 内部模块；不改既有断言讨绿。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令形态不变；无新工具 / 依赖 / 脚本 / 配置。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** 本轮重新判定：第四批 DAG（B01 ← A10 / A22 / A22a / A22c / A23；B02 ← B01 / A22c；A22d ← A10 / A22a / A22c；B04 ← B01 / A22d；B03 ← B01 / A12 / B04）与 §6、§14、README 一致，本批外依赖全部已完成；唯一有意回边 B03 → B04 真实无环、三处登记；A22d 不单列为页面切片提供任务（同 A22a 关系）；H-2·标签 ① 更新为 B01 提交是集成人决定、④ 只能由 v2 所有者登记。
- ☑ **C-02 契约闭环。** 沿用 R9；本批零新增方法 / schema / 生成物；B03 只复用 `CreateJobInputSchema` / `JobTypeSchema` 即时提示；`createJob` 回执 `jobs[0]` 口径不变。
- ☑ **C-03 事件与状态闭环。** 本轮重新判定：`receiveAgentEvent` 触发条件不变（带 `jobContext` 的三种终态），同一 `refresh()` 自动带上详情；详情读状态与列表读状态各自独立（R3-A 口径延伸）；不触及 activeRunId / overlay / 排队（T-A18 / T-A20）。
- ☑ **C-04 场景定义足以稳定验证。** 沿用 R9 + 本轮：A22d / B01 / B04 用例全部以真实九场景（normal / slow / empty / error / job-running）+ 真实 fixture id（j-process / j-collect / j-failed / j-human / j-missing）定义，期望来自契约语义而非实现内部。
- ☑ **C-05 版本与定稿闭环。** 沿用 R9；本批不触及修订 / 定稿；B03 新作业经既有 `createJob` 写入（draft 交付产物 + r1）不变。
- ☑ **C-06 隐私与本地持久化自洽。** 沿用 R9；本批不改 `persistence.ts` / 白名单；B03 端到端只读 `fai.jobs.v1` 既有业务子集，不加钩子、不写新 key；A22d 读路径不触碰 storage。
- ☑ **C-07 视觉与工程纪律。** 本轮重新判定：R2-C 只用既有 `--fai-status-ok/warn/bad` 与 `--fai-glass-module-border`，不用 sample、不新增色值 / 令牌 / 玻璃类；文字色不变、红只作边；StageRail 高亮沿用 Rail 既有令牌边线；`check --only colors` / `glass` 纳入 B01 命令 3。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 沿用 R9；plan §1【r6.9】引用 D-015 只为“状态不用绿、不借涨跌令牌”的作用域边界，与 D-013（库存收敛）无涉；D-017 仅作“真实闸门非本 feature”边界；D-020～D-024 未带入。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **定向通过 vs 本批尚未实施**：本节 26 ☑ 表示 r6.9 精度在 Plan / Tasks 层达标且 R9 已认可设计未回退；第四批 5 项**一行代码未写、一条测试未跑**，不得读作任何任务完成或 AC 验收。21 / 69 的“已完成”仍 = 批次代码 Review 通过。
- **P-4**：代码级，批次 / 最终 Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，不声称任何 AC 已通过、不假绿。
- **Implement 前置**：当前有效轮次 = 本 §R10，26 ☑ ⇒ 第四批可在**本节被集成人提交后**按 DAG 串行开码（提交前仍 blocked；**T-B01 开始前的有效 Checklist = 本 R10 经集成人提交后的 SHA**），并登记到 `specs/README.md` 本 feature 行与 implementation-log §14 “②”（本审核员不 commit、不改 README）。
- **第四批代码 Review 须明确核对**（本节不替代）：R2-C 三 SFC 真实 diff（只改边框令牌与根 `data-status`，文字色 / 文案 / 图标 / props 不变，无 sample、无新字面量）并据此判 R2-C 关闭与否；`jobs-store.spec` 原 27 例与 `connect` / `changeScenario` 零改动；`badges.spec` 原 27 例零改动；`routes.spec` 9 / `session-context.spec` 4 不改断言；`stores/jobs.ts` 公开列表成员签名不变、详情块独立 try、不改写 `listStatus` / `listError`；B04 不改 store；B03 e2e 无窗口钩子、不改 playwright 配置；两处“可接受多读”没有被偷加 guard，也没有被扩成缓存框架；任一任务超 2 h 是否按 S-22 停下记录。
- **H-x 交接**：八切片仍**全部未交付**；本批完成后页面切片 B01 / B02 / B04 具备、仍缺 C 组；H-2·标签 ① 改为 B01 提交并重跑 18 / 9（集成人决定），④ 仍缺；H-2·列表对外成员不变、`-t "WI H-2"` 集合不扩大；interface-handoff §5 待 v2 接收方确认，本审核员不代签。
- **上游**：main `072bb12` 不在本树祖先、继续 pin `90187f7`；同步按 tasks §7 / R2-D 流程，不是本批新人工门。
- **Gate 2 / Handoff**：不在本阶段；feature 未收敛（48 项未开始 + H 组外部阻塞）。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前必报“未收敛（外部阻塞）”；S-22 兜底继续有效且不得预先吸收已知超额；§7 S-31 写后刷新核对表本批只涉 createJob（已有定向断言）。
- **P3 台账**：R-A / R-B 残留 / R-C / R2-A / R-D ①③④ / R-E / R-F / R2-B AgentClient 侧 / R2-D / R3-B / R3-C 未处理、未经 Walter 风险接受；R2-C 归 T-B01、代码未修；S-38～S-40 由作者自决（S-38 口径已扩展到 `openJob`）；新增 S-41 / S-42 / S-43。

## 下一步

1. 集成人原样提交本文件（R10），以该 SHA 作为第四批有效 Checklist，更新 `specs/README.md` 本 feature 行与 implementation-log §14 “②”。
2. 第四批按 §6 DAG 在同一实施树串行开码：T-B01 → T-B02 → T-A22d → T-B04 → T-B03；Implement 首选 `openai/gpt-6-astra`（新会话、实施树）；每任务固定 commit + 逐命令输出摘要回报；任一任务实际超 2 h（T-B01 / T-B04 已到上限）、`routes.spec` / `session-context.spec` 真实失败、需改 §14 表以外文件、或发现与 plan / tasks 精度不符，先停下回报，不在实施中偷换。
3. 作者可自行决定是否吸收 S-41 / S-42 / S-43（均为范围登记 / 测试提示 / 措辞，不需重过 Checklist；S-42 若只在测试写法中体现则不改 tasks）。
4. 本批完成后 Converge → 独立代码 Review（新会话、异模型），该 Review 须按「阶段说明」所列项核对 R2-C 真实 diff、既有测试零改动与 store 隔离；集成人据 B01 提交更新 H-2·标签 ① 并复跑 18 / 9。
5. H-x ④ 待 v2 集成树所有者登记；interface-handoff §5 待 v2 接收方确认；main `072bb12` 同步由集成人按 §7 决定。

## 结构核验证据（R10，只读）

```text
TARGET    94f1f83d6871cdd9ef6ce1e57d13d505992fda70（parent 6ba2a15）；worktree D:/2030/Futures-AI-interaction-checklist-batch4 @ review/workbench-interaction-batch4-checklist；启动 git status --porcelain 空
DIFF      git diff --stat 6ba2a15..94f1f83：specs/README.md | analyze.md | implementation-log.md | interface-handoff.md | plan.md | tasks.md；6 files, +417 −29；全部在 specs/（no code）
ZERO      git diff --stat af24c82 HEAD -- frontend = 空；spec blob 102af73b… / checklist blob 74084c13…（= ab742f5 的 R9 原件）未动；docs / AGENTS / 旧 Review / Converge / 根 HANDOFF 无 hunk；spec AC 去重计数 46
CODE      JobStatusBadge / ArtifactStatusBadge / SourceBadge：均 border: thin solid var(--fai-status-ok)，无 data-*；文字色 secondary / secondary / primary ✓
          shared/Badge.vue：.badge[data-badge='warn'|'bad'|'sample'] 改 border-color，sample 加 dashed ✓
          tokens.css：status-ok #6CA7C7（蓝）/ warn #C69633 / bad #DF5C4D（= accent-red）/ sample #8F8D87（= text-muted）；glass-module-border rgba(255,255,255,.09) ✓
          check.mjs checkGlass 正则 (?<![\w-])glass-[\w-]+ 不命中 --fai-glass-module-border；ErrorState.vue:85 已用该令牌 ✓
          jobs.ts 71 行：无详情成员；refresh 单 try；createJob 恰一次 refresh ✓；interface-handoff:163 r6 已列内部 openJob()；tasks §1-9 r6 已写 refresh 重读已打开详情 ✓
          mock/index.ts readJobState：delay → read() → error 抛 adapter_error → parse；job-state findJob：未知 not_found(retryable=false) / emptyJobIds → null；getStageWorkspace 预置 id → emptyWorkspace ✓；读路径不触碰 persistence ✓
          types.ts：CreateJobInput strict，title / subject trim().min(1)，subject nullable，goal 任意；Job 含 goal / createdBy / parentJobId；stages 四项固定顺序 refine ✓；枚举 9 / 4 / 3 全部落入映射表恰一列 ✓
          routes.ts /jobs/:id/:stage?（缺省 stage params.stage=''）；session.ts afterEach 只在 StageSchema 合法时设上下文、无 setter ✓
          ErrorState props {moduleId, error, ts?}，诊断 JSON {moduleId, code, message, ts}，clipboard 复制，重试仅 retryable ✓；Rail.vue [aria-current='page'] 用 --fai-accent-red 边线 ✓
          playwright.config testDir ./e2e、自管 4173 ✓；package.json vue ~3.5.44（本树无 node_modules，未装依赖）
TESTS     badges.spec：status 18（9+4+3+1+1）/ source 9（4+4+1）= 27；只剥 class / style / data-v-*；styleRule 先例 modules / focus-band / topbar / typography ✓
          jobs-store.spec：27（5/2/4/7/9）；connect() 只 spy listJobs / createJob；共享 job-state 模块状态 ✓
          routes.spec 9 / session-context.spec 4：不挂载页面 ✓
FIXTURE   jobs.json normal 5：j-process research/processing/process/subject 非空；j-failed done/done/conflict/not_started；job-running j-human done/needs_human/running/not_started ⇒ 五态覆盖 ✓
TASKS     69 任务 / 104.0 h（A30·44.5 B7·11 C5·7.5 D3·5 E3·5.5 F7·12 G10·14.5 H4·4）/ 每项 0.5–2.0 h 0 例外 / 真实图 CYCLE None / BACKEDGES [(T-B03, T-B04)]（父 []）
          21×已完成 + 48×未开始；标准 232 ↔ 命令 232 逐任务 1:1、编号连续（0 例外）；标准含 AC 0 例外；矩阵 46 = spec 46（差集 ∅）；PARTIAL_NOT_ANCESTOR []；BIDIR_BAD []
          父→HEAD 逐任务 est/deps/状态/STD/CMD 比对：差异仅 T-A22d（新增）、T-B01（est、STD 1–4、CMD 3/4）、T-B02（STD 1 追加）、T-B03（deps、STD 1/2 追加）、T-B04（deps、STD 1–3 追加）；其余 64 任务零变化；B02/B03/B04 CMD 零变化
          -t/-g 全文件 222 / 去重 171（父 218 / 167；+4 新标题）
          第四批：B01 2h←A10,A22,A22a,A22c,A23；B02 1h←B01,A22c；A22d 1h←A10,A22a,A22c；B04 2h←B01,A22d；B03 1.5h←B01,A12,B04；合计 7.5 h、17 命令（4+2+4+4+3）
          READY（已完成依赖齐）：A14 / A15 / A16 / A22d / B01 / C01
AGENTS    §2 第 6 步 0.5–2 h / 任务；§5.1 / §5.2 / §5.3 / §5.5 / §5.6 / §5.7；§6 通道：A = claude-fable-5-1 via anthropic（bridge 本窗口 quota / rate / spend_limit 类，不重试；fable 未单独探 bridge、不伪称；anthropic/fable 本批 exit 0；只换通道不换模型；未改配置）
WRITE     唯一改动仓库文件 specs/workbench-interaction/checklist.md；临时文件 7 个在独占 Temp/wi-batch4-01a18388-nzh9q1wh/（checklist-r10-*）；git diff --check 见回复；不 commit
```

---

# R9（2026-10-29，第九轮：第三批 r6.6 派工准备的限定范围定向复核；只核六项审查重点、R8.1 已认可项“未回退”与结构数字，不重审既有设计；本节是 **Checklist R9**，与 analyze.md 的「Analyze R12」无关，也**不是**第三批代码 Review；**历史快照，复选框已改为文字符号，不参与当前判定**——其 26 ☑ 为 R9 时点对 `ef64c18` 的结论，第三批据其提交 `ab742f5` 开码并经 `review-batch3.md` / `review-batch3-cache-fix.md` 通过，当前有效勾选见 §R10）

## 基线与范围

- **审查对象（固定）**：本工作树 `D:/2030/Futures-AI-interaction-checklist-batch3`，分支 `review/workbench-interaction-batch3-checklist`，HEAD = `ef64c1853f79ea1e18e99a7b0ff22de2152de40c`，启动时 `git status --short` 为空、clean。增量 diff `git diff f1b7c06 ef64c18`：**6 文件 +347 / −7**——`specs/README.md`（本 feature 行）、`analyze.md`（页首当前结论改写 + 旧结论标“历史原文” + 新增「Analyze R12」）、`implementation-log.md`（页首当前状态块、§7 一行、新增 §10）、`interface-handoff.md`（页首当前状态块、§3 r6.6 接口精度块）、`plan.md`（页首 r6.6 记录、§2.3 一条、§2.4 写方法精度块、§3 持久化精度块）、`tasks.md`（页首 r6.6 块；T-A11 / T-A12 / T-A13 / T-A22a 的状态行旁注 + 修改范围【r6.6 精度】；T-A11 标准 1 补列；**仅 5 个 hunk，§5 矩阵 / §6 DAG / §7 无 hunk**）。**独立核实的零差异**：`git diff --name-only f1b7c06 ef64c18 | grep -v '^specs/'` 为空；`git diff --quiet f1b7c06 ef64c18 -- spec.md checklist.md review-batch2.md review-batch-a09a.md converge-batch2.md converge-batch-a09a.md docs AGENTS.md frontend` exit 0；`git diff 27e59e6 HEAD -- frontend` 0 行（源码 = 第二批受审 `27e59e6`）；本文件 HEAD blob `99e096ad9f82bffe2e61d13ea5a8512d5075ce71` = `34d339e` 所提交的 R8.1 原件；spec `AC-\d{3}-\d` 去重 = 46。
- **重读**（本轮开始时重新读取，不依赖会话记忆）：AGENTS.md（§2 第 5～8 步、§3、§5、§6）、`docs/plan.md` 全文、冻结 spec v1.1 全文（R-001 / R-003 / R-007 / R-008、§4 持久化、Q-011）、plan.md §2.3 / §2.4（方法表、动作矩阵、九场景表、样例表、r6.6 写方法精度）/ §3（r6.6 持久化精度）/ §4.1 / §4.2 / §4.6 / 迁移表、tasks.md（页首 r6.6 块、§1 全局约定、§2a、§3、T-A10 / T-A11 / T-A12 / T-A13 / T-A17 / T-A18 / T-A21 / T-A22 / T-A22a 全文、§5 矩阵、§7 S-22 / S-31）、analyze.md「Analyze R12」全文、implementation-log 页首 / §7 / §8 / §10、interface-handoff 页首与 §3、`specs/README.md` 本 feature 行、本文件 §R8.1 全文、`review-batch2.md` R2-A～R2-E 与 §3 T-A10 行、`review-batch-a09a.md` R-A～R-F。
- **真实代码事实（本树 = `27e59e6`，逐文件读 / node 只读汇总，不以作者 F-1～F-10 摘要代替；下列为本审核员独立核得）**：
  - `contracts/mock/job-state.ts`（97 行）：模块级 `let state: JobState`；`JobStateSchema = strictObject{scenario, jobs, details, deliverables, interventions, uploads, emptyJobIds}` 只组合既有边界 schema；`initializeJobState(scenario, seeds)` 由 `createMockDataClient()` 唯一调用；`commit(mutator)` = `structuredClone` → mutator → `JobStateSchema.parse` → 整体替换；`getJobScenario()` 读模块状态；`findJob` 未知 id 抛 `{error:{code:'not_found'}}`。⇒ F-2 属实：快照子集 = 去掉 `scenario` / `emptyJobIds` 的五项；save 挂在替换之后是唯一自然落点。
  - `contracts/mock/index.ts`（271 行）：`readJobFixtures()` 在函数内读 `window.__FAI_MOCK__?.jobFixtures` getter 并经 `jobFixturesBoundary`（`undefined` → 内置五文件；对象 → 整键替换）解析；工厂 `createMockDataClient()` 先 `readScenario()` 再 `jobState.initializeJobState(scenario, readJobFixtures())` 各一次；`readJobState()` 用 `jobState.getJobScenario()` 决定 slow / error，且 `read()` 先于 error 抛出（未知锚独立 not_found）。⇒ F-1 / F-9 属实：A11 若另判“有无覆盖”会第二次触发 getter（既有 `jobFixtures is read once` 用例以 getter 计数 = 1 固定），r6.6“工厂读一次到局部变量、helper 共用”是必要的精度，不是新机制。
  - `contracts/types.ts`：`uploadFields = {jobId, sourceNote, id, status, mapping, createdAt, removed, quarantineReason?}` + `inputKind` 判别 + `fileMeta`（file）/ `url`（url）；text 分支**无正文字段**（describe “文本投放记录，不保留正文”）；三分支均 `strictObject`。`quarantineReason = z.string().min(1).optional().describe('隔离样例的模拟判定原因。')`（:321）。⇒ **plan §3 白名单十项 + `quarantineReason` 恰好等于既有 strict `UploadSchema` 的全部键**；`IntakeInputSchema`（:298）的字段只有 `jobId / sourceNote / inputKind / fileMeta|url|text`，**不含 `quarantineReason`**，用户经 `submitIntake` 无法写入该字段。`InterventionSchema.jobId = z.string().min(1)` 必填（:569），`artifactId` / `baseRev` nullable（:570–:571）⇒ F-3 属实。`WriteReceiptSchema{jobs, artifacts, revisions, interventions, inbox}` 已注册（:586 / :606），`InboxCountsSchema{unread, byStage}` 可取真实 0；`DataClient` 恰 13 个方法 ⇒ F-6 属实。dataset 修订 `uploads:[{uploadId, mapping, status}]`（:478，describe “入库摘要，不含投放原文”）⇒ `mappingHistory` 条目与既有已持久化的修订摘要同形（多一个 `replacedAt`）。`Artifact.latestMergedRev` 非空（:460）⇒ `createJob` 初始交付产物必须带 r1，r6.6 写法与 schema 一致。`PendingMerge ⇒ overlayRev` refine 已存在（:464）。
  - fixtures（node 只读汇总）：`uploads.json` 池 2 条——`u-unassigned-file`（pending_validation，无 `quarantineReason`）、`u-unassigned-quarantine`（quarantined，`quarantineReason` = “合成隔离判定：缺少可核验的材料出处，请补充来源。”）；`job-detail.json` 九作业 18 条投放全部 `url`、j-collect 两条 pending、其余 ingested，**无一带 `quarantineReason`**；全库**没有** pending_validation + `quarantineReason` 的投放 ⇒ F-4 / F-5 属实（T-A12 标准 2 只能经 `jobFixtures` 覆盖注入，且覆盖会话不持久化）。`interventions.json` 6 条均带 jobId。
  - `tests/unit/jobs/job-state-read.spec.ts`：`:222` “real commit…”末句 `expect(await clientFor().getJob('j-collect')).toEqual(before)`（新 normal client 丢弃提交）；`:236` “this batch stays entirely in memory…”对九场景 + normal 覆盖断言 `getItem / setItem / removeItem / clear` 全部零调用 ⇒ F-7 属实：A11 起这两例语义必变。全部 `tests/unit/*.spec.ts` 与 `tests/unit/jobs/*.spec.ts` 中**没有其他** Storage spy；`tests/component/{module-shell,timeline}.spec.ts` 只碰 `fai.layout` / `fai.drawer`；`tests/setup.ts` 不清 localStorage；`mock.spec.ts:381 dataRequests` 为显式十方法清单、`contracts.spec.ts:248` 用 `arrayContaining`、`real-stubs.spec.ts` 以 `satisfies` 全键覆盖 ⇒ F-8 属实：新增 `resetMockData` 等方法不破 v1 三份契约测试，real 桩须加键（在 T-A11 范围）。
  - `main.ts`（19 行）：`agentClient.subscribe(useAgentStore(pinia).receive)` + `app.onUnmount` + `import.meta.hot?.dispose`，`registerJobRoutes(router, pinia)` 在 mount 前 ⇒ F-10 属实。`agent/events.ts:104–:108` 终态 = `run.completed | run.failed | run.aborted`（已有 `isTerminal` 判别）⇒ T-A22a 终态口径与契约一致。`scripts/check.mjs:317–:318` network 守卫只扫 `fetch / XMLHttpRequest / WebSocket / EventSource / axios`，`localStorage` 不在其列，且无 import 方向守卫 ⇒ `jobs/persistence.ts` 位置（R7 已审）与 `contracts/mock → jobs/persistence` 方向不触发任何既有守卫。
- **审核员与通道**：A = **claude-fable-5-1 via anthropic**（页首 R9 通道行）；新开独立会话、独立 worktree；与被审作者 claude-opus-5-5、Implement 首选 openai/gpt-6-astra 均异模型。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试、未启动子 agent / 服务、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写入任何其他 worktree、未修改 plan / tasks / analyze / implementation-log / interface-handoff / spec / README / 代码 / fixtures / tests / 审核原件。结构复算用 `python` 一次性脚本只读完成，脚本与日志在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/`（`checklist-r9-struct.py`、`checklist-r9-structure.log`、`checklist-r9-structure-parent.log`、`checklist-r9-tasks-parent.md`、`checklist-r9-std-cmd-diff.log`；非项目产物、不入库、不清理共享 tmp）。唯一写入的仓库文件为本文件（新增 §R9、页首 R9 通道行与「文件结构」段、把 §R8.1 的 26 个 `[x]` 改为 ☑ 文字并在其标题补“历史快照”；R8.1 其余内容未动）。本审核员不 commit；**第三批有效 Checklist = 本节被集成人提交后的 SHA**。

## 结论（R9）：**通过**（定向；r6.6 的持久化白名单补列、内部 `mappingHistory`、写方法签名 / 回执 / 时机、投放写入规则、当前列表投影、jobsStore 口径全部判定为**既有需求与既有设计内的机制 / 类型精度**，不需回流 Clarify / Gate 1、不改 spec / 46 AC；**0 P1 / 0 P2**；3 项 P3 建议 S-38～S-40 不阻断）——**26 项当前有效检查项 26 ☑ / 0 ☐**。

本结论的边界（必须同时成立，不得单独引用）：

1. 本轮只核六项审查重点（§1～§6）、R8.1 已通过项“未回退”与结构数字；R8.1 的 26 ☑ 按其原判定沿用，本轮对 r6.6 触及的项（I-03 / V-02 / P-1 / P-2 / C-02 / C-03 / C-05 / C-06）重新判定，其余只核未回退。第三批 **T-A11 / T-A12 / T-A13 / T-A22a 均未实施**，一行代码未写、一条测试未跑（`frontend` 与 `27e59e6` 零差异）；46 AC 最终验收仍 **0**；16 / 67 的“已完成”= 批次代码 Review 通过而非 AC 验收；feature **未收敛**（51 项未开始 + H 组 `blocked_by: frontend-workbench-v2`）。本轮未运行任何产品测试，不声称任何命令会通过；未写的 tests 不是证据。Gate 2 / Handoff 不在本阶段。
2. 本审核员不代 Walter 做风险接受（R-A / R-C / R-E / R-F、R2-C / R2-D 仍未处理、未经风险接受；R-B 部分定案、S-35 残留未关；R-D 口径已定、未修；R2-A → T-G06、R2-B / R2-E 由本批按口径固定调用顺序与场景来源，不加 guard），不代 v2 接收方签收 interface-handoff §5，不代 v2 集成树所有者登记任何 H-x ④，不就 main `072bb12` 的同步做决定（R2-D 流程不变，不是本批新人工门）。
3. 按 AGENTS §2 第 8 步，Implement 前置 = 当前有效轮次全部勾选；本节 26 ☑ ⇒ 第三批可在**本节被提交后**按 tasks §6 DAG 串行开码（T-A11 → T-A12 → T-A13 → T-A22a）。本节未提交前仍为 blocked。本节是 Analyze R12 §8 所指“开码前限定范围 A 定向复核”，由集成人裁量发起；**不替代**第三批完成后的独立代码 Review（持久化白名单 + `mappingHistory` 仍须在该代码 Review 按真实 diff 核对）。

## 独立核验（不照单全收作者结论）

### 1. 持久化白名单文字修订（协调器重点 1）：是既有需求内的元数据精度，不是隐私 / 安全 / 需求变更

- **`quarantineReason` 补列**：
  - 既有性：字段在 `UploadSchema`（T-A03 交付、首批 Review 通过）中已存在、可选、strict；plan §2.4 `ExtractionPreview` 行（R2 通过）早已写“隔离样例由 fixture 的模拟判定给出**并说明原因**”；spec AC-003-6 要求隔离状态可见；T-C02 最终命令要验“隔离显示原因”。plan §3 白名单原文漏列它是**文字疏漏**：不补列，则持久化入口要么把 strict schema 已允许的字段剥掉（刷新后种子 `u-unassigned-quarantine` 的原因丢失，AC-003-6 在刷新后不成立），要么原样保存而与 T-A11 标准 1 的文字相矛盾。补列后白名单 = strict `UploadSchema` 全部键，一处权威、无第二套口径。
  - 隐私边界：该字段的**唯一来源**是仓库内合成 fixture（内置种子或 `jobFixtures` 覆盖）——`IntakeInputSchema` 没有该字段，用户经投放流程不能写入；r6.6 的 confirm 规则只“原样保留 fixture 预置的原因”，不生成、不推断；覆盖会话又不持久化 ⇒ 在持久会话中能进入 `fai.jobs.v1` 的 `quarantineReason` 只能是内置种子那一条合成文本。**不含原文 / File / 字节 / 完整 input**，不扩大 spec §4“浏览器本地持久化”的内容类别。判定：精度，**不触发需求变更**；不因“字段名新增”扩大为新产品需求。
- **内部 `mappingHistory {uploadId, mapping, status, replacedAt}`**：
  - 依据：plan §2.4 动作矩阵 map_fix 行（B-01，R2 通过）“原记录与修正前 mapping 保留”、T-A12 标准 2“原记录保留”（R7 通过）。已归属投放的修正前 mapping 由 dataset 旧修订承载（既有设计）；未归属投放没有 dataset、也没有事件载体（`Intervention.jobId` 必填，本审核员核实），r6.6 用一个内部数组承载，是满足既有不变量的**最小载体**：条目 = 已持久化的 dataset 修订摘要同形（`{uploadId, mapping, status}`，:478）+ 时间戳；`mapping` 本就是白名单字段；confirm 只从 pending_validation 出发 ⇒ 每条投放至多一条，增长有界；无读 API、无 UI、无新 kind / 新方法。判定：精度（既有需求内的结构化元数据），不是新产品需求；**不是**防御性 guard（AGENTS §5.1 不适用）。
  - 观察（非 P3，不要求处理）：已归属投放的修正前 mapping 会同时出现在 dataset 旧修订与 `mappingHistory`，是为统一一条 confirm 路径而接受的冗余；后续若要展示或读取 `mappingHistory`，须走需求流程（Analyze R12 §7 已登记）。
- **state 业务子集与 runtime 控制分离、snapshot version 1 入口可选字段默认一次、非 normal / 有覆盖对两 key 零 get / set / remove**：与 plan §2.3 / §3 既有句、T-A11 标准 3 / 4、H-6“注入的样例不污染本机快照”逐句一致；“运行时控制不入快照”是对 T-A18 / T-A20 的前瞻限定，不新增机制。✓
- **真实硬约束改动有没有被忽略**：本轮逐字对比父提交，**唯一**改字的完成标准 = T-A11 标准 1（见 §5 脚本），其余 223 条标准 / 224 条命令 / 预计 / 依赖零变化；spec §4 持久化句零 diff。没有其他硬约束被悄悄放宽。✓

### 2. T-A11 初始化、降级、损坏、重置与状态订阅（协调器重点 2）

| 要求 | r6.6 原文（plan §3 / T-A11【r6.6 精度】） | 对代码事实的判定 |
|---|---|---|
| 先 DataClient 建 state 再 hydrate | `initializeJobState(scenario, seeds, persistent)`：先建状态；persistent 时 `loadJobsSnapshot()` 非 null 才覆盖可持久化字段 | 与现 `initializeJobState` 顺序同构，只加一个布尔与一次覆盖；R2-B“状态只由 DataClient 工厂建立、不加 guard”保持 ✓ |
| getter 只读一次 | 工厂把 `window.__FAI_MOCK__?.jobFixtures` 读一次到局部变量交私有 helper；`readJobFixtures()` 改为同 helper 的薄包装；`persistent = scenario==='normal' && override===undefined` | 必要（F-1），且不改 `readJobFixtures()` 返回形状；既有 `jobFixtures is read once` 用例保持 ✓ |
| 两 key per-key 最后成功快照 | “最后成功快照是每个 key 各自的承诺，不做跨 key 事务、回滚或锁” | 零新增机制 ✓（AGENTS §5.1） |
| 失败只 degraded、内存业务成功 | > 512 KiB 不调 setItem；setItem 抛错在 persistence 内吞下；回执 / 错误不变；之后每次 commit 照常尝试 | 与 T-A11 标准 2 同义；“转内存”读作“该次未写” ✓ |
| 坏 key unreadable、禁止自动覆盖直到显式 reset | 本会话用种子、原值保留、保存一律不写；reset：`removeItem` 两 key → 重建 → 写 `fai.jobs.v1`（成功 ok / 失败 degraded） | 与 T-A11 标准 3、T-G04 标准 1“key 被重建”一致；unreadable 闩由 reset 路径解除是唯一自洽读法（见 S-40 的测试提示） ✓ |
| reset 用当前 session seed / scenario，不拿旧 client 闭包、不重读 override | “使用当前共享会话记录的 scenario 与已解析种子，不重读、不更换覆盖，也不用旧 client 闭包”；`resetMockData` 按当前共享状态 scenario 延迟 | 与 R2-E“新增方法随当前共享状态的 scenario”同一来源 ✓；`resetJobState()` 用模块记录的 `{seeds, persistent}` ✓ |
| 不加跨 key 事务 / 锁 / guard | 明写 | ✓ |
| `getPersistenceStatus` / `onPersistenceStatus` 既定接口，无 UI 横幅 | 导出名、取值 `ok|degraded|unreadable`、同步回调 + 取消函数、初始 ok、非持久置 ok；“横幅归 T-G04” | 与 T-A11 上下文（R7 已审）同名同义，只补回调口径；T-G04 不提前 ✓ |
| 模块方向 | `job-state.ts → jobs/persistence.ts → contracts/types.ts`；persistence 不导入 job-state / mock/index | 无环；`jobs/persistence.ts` 位置为 R7 既定；既有守卫不涉及 ✓ |

### 3. T-A12 / T-A13 类型、顺序与规则（协调器重点 3）：可实施，没有新增方法 / 事件 / 机制

- **方法集**：A11 `resetMockData`；A12 `createJob / submitIntake / getIntakePreview / confirmIntake`；A13 `listUnassignedUploads / assignUpload / removeUpload / cancelJob`——九个全部在 plan §2.4 方法表（R2 通过）内，**零新增**。kind 只用 ingest / map_fix / delete（动作矩阵既有行），**零新增** kind / outcome / 事件种类。
- **类型**：`CreateJobInput{title 去空白非空, type: JobType, subject 去空白非空|null, goal}` strict ↔ spec R-001“标题必填、类型必选、品种 / 主题可选、目标说明多行”✓；`IntakeReceipt = WriteReceipt + {upload, preview}` 复用既有 `WriteReceiptSchema` ✓；两者进 `contractSchemas` 并带 describe（既有描述守卫）✓。无第三个新 schema。
- **createJob**：`createdBy='human'`、collecting / collect、R,N,N,N、`parentJobId=null`、`reason=null`、pendingCount 0；初始空产物只有交付侧（`<jobId>-deliverable` draft + r1 `blocks=[]` + `Deliverable` draft 三锚 null）；不预建 recipe / analysis；dataset 首投放时建 ↔ plan §4.1、样例表、R-D ⑤ 口径、`latestMergedRev` 非空 ✓；“不猜 recipe 默认”正确（未开始阶段的业务参数不该由 createJob 捏造）。
- **投放**：pending_validation → confirm → ingested，或 fixture 预置原因 → quarantined（原因原样）↔ T-A12 标准 2、R-D ②；合成预览固定值（`detectedType` 只标输入种类、一行中性字段、`unit` / `timeRange` null）↔ plan §3“mock 预览由输入类型 + 人工映射驱动”、不解析不抓取 ✓；confirm 只接受 pending 且未删除（否则 validation_error）是既有状态机的直接读法 ✓。
- **归属 / 未归属**：已归属 confirm 另追加 dataset 修订（旧修订保留修正前 mapping）并写 map_fix；未归属 confirm / remove 只结构化记录、**不伪造 jobId、不新增 kind**（`Intervention.jobId` 必填，本审核员核实）；assign 把池记录连同预览**移入**目标作业、追加 dataset 修订、只补**一条** ingest、不重放未归属期间的确认 ↔ plan 矩阵 ingest 行“未归属时先留投放记录，assign 时追加作业内事件”、§4.2 ✓。
- **删除 / 取消**：remove 只置 `removed=true`、预览保留、已归属者追加不含该投放的 dataset 修订 + remove_source ↔ 矩阵“只从当前视图移除，历史锚保留”✓；cancel = status + reason、currentStage / stages / 产物不变、写 cancel_job（stage=currentStage，artifactId / baseRev null，schema 允许）、不 abort run（晚到事件隔离归 T-A18 标准 5）↔ 矩阵 cancel_job 行、§4.6 ✓；T-A13 标准 3“reason 必填、空 reason 被拒”↔ `reason 去空白非空` ✓。
- **delivered / cancelled 写前置**：以作业为目标的写在入口查一次 → validation_error。这是 plan §4.6“随后针对该作业的一切领域写方法…在契约入口拒绝 validation_error”“cancelled 同样领域只读”与场景表 job-delivered 行（R2 / R4 通过）的既有领域规则，**不是** R-D 类新 guard；全方法逐方法验收仍归 T-A17 标准 3，本批不冒称 ✓。`writableJob` 作为 T-A17 统一入口的种子，与 T-A17 修改范围“统一检查…覆盖目前已有的全部领域写方法”衔接无矛盾。
- **当前列表投影唯一位置**（协调器重点 3 / 4 交叉）：`listUnassignedUploads()` 过滤 `jobId=null && removed=false`；`getStageWorkspace(jobId,'collect').uploads` 去掉 `removed=true`；状态层与快照不过滤、无公开历史读 API。与 R-B“`getStageWorkspace` 原样返回、不按阶段态过滤”不冲突（按 `removed` 标记、不按阶段态；现 fixture 全部 `removed=false`，T-A10 既有“every stage return their actual snapshots”用例不受影响）；与 spec AC-003-5 / AC-007-3、矩阵 remove_source 一致 ✓。T-A13 标准 2“介入历史和原锚仍可查”在本批无 `listInterventions` 时经回执事件 / 快照 / 旧修订 uploadId / `getIntakePreview` 验证，T-A15 / T-B06 再经读 API——不假称已有读 API ✓。
- **时机**：入口 parse → 按当前共享 scenario 在 slow 下延迟 1500 ms 后才执行 → 唯一 `commit(mutator)`；error 在 mutator 与边界校验之后、替换之前拒绝（无部分修改、未知锚仍独立 not_found）↔ 九场景表“查无 id 独立”、T-A12 标准 4、R2-E 同一来源 ✓。`resetMockData` 不经 commit、error 不拒绝 ↔ plan §2.4 场景段既有句 ✓。
- **可实施性**：id / 修订号 / 时间戳生成规则、helper（`writableJob` / `findUpload` / dataset 修订追加 / 回执收件箱计数）均为“会复用”的抽象（A12 建、A13 复用；AGENTS §5.3）；回执 `inbox` 在 T-A21 前取真实 `{unread:0, byStage:全 0}`，不伪造 ✓。实施者不再需要临时猜测的点：F-1 / F-3 / F-4 / F-5 / F-7 / F-9 + 回执 / 预览 / 投影，本审核员逐项复核属实。一处措辞精度见 S-39。

### 4. T-A22a jobsStore（协调器重点 4）

- 共享**未筛选**缓存 `jobs` + `filteredJobs: JobListItem[] | null` 副本、`ensureJobs()` 仅 idle 加载、`refresh()` 先 `listJobs()` 再（有 filter 时）`listJobs(filter)`、已有数据不回 loading、任一失败置 error + `listError` 且保留缓存、`applyFilter(null)` 不发请求 ↔ plan §2.3 r6（R7 通过）/ T-A22a 标准 1 / 2 ✓；`ListJobsFilter = NonNullable<Parameters<DataClient['listJobs']>[0]>` 不另建 schema ✓。
- `createJob(input: CreateJobInput): Promise<Job>` 返回回执 `jobs[0]`（`WriteReceipt.jobs` = 本次改变的作业，createJob 恰一项）；失败以原 ErrorResponse 拒绝、不 refresh、不动缓存；成功后恰一次 `refresh()` ↔ §1-9、标准 3、interface-handoff §3 r6.6 ✓；本批只接 createJob 一条写路径，其余写路径由各自任务接入（§7 S-31 核对表），不冒称 pipeline 已交付 ✓。
- `receiveAgentEvent`：仅 `run.completed / run.failed / run.aborted` 且带 `jobContext` 时恰一次 `refresh()`（与 `agent/events.ts` 终态判别一致）；`main.ts` 在 agent store 订阅之后加一行订阅并同样交 `app.onUnmount` / `import.meta.hot?.dispose` 解除 ↔ §0 B-10 先例、F-10 ✓。
- 标准 4 验证方式：真实 `createMockAgentClient()` 回放 + 假时钟 + `dataClient.listJobs` 透传 spy 计数，不加生产故障开关 / 注入 setter、不复写业务逻辑（AGENTS §5.6）✓；T-A18 未接线，状态层不随事件改变，只验“终态触发一次重读”，不预做 Agent 写状态 ✓；不预做 T-B04 `openJob` / 详情重读、不做其它 UI 写路径 ✓。
- 测试卫生：每例前清 localStorage（A11 起 normal 持久化）；标准 1“store 不调用 localStorage”只在读 action 期间以 Storage spy 断言，createJob 成功后契约层写快照不计为 store 访问——口径正确（AC-008-3 的“零直接网络调用”本就只约束界面层，store 不直接碰 storage 的断言亦应只量 store 自身）✓。一处实现精度见 S-38。

### 5. 结构与任务粒度（协调器重点 5；脚本只读、作用于 HEAD 并与父 `f1b7c06` 对比，不沿用作者数字）

- **67 个任务**、编号唯一、排序成立；合计 **102.0 h**（A 28·43 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4）；每项 0.5～2.0 h **0 例外**；依赖去括注后全部向前、无环（0 例外）。
- 状态：**16 × 已完成、51 × 未开始**（本批 4 项状态行只追加“r6.6 精度已补，仍未开始”旁注，仍计未开始）。
- 完成标准 **224** ↔ 验证命令 **224**，逐任务 1:1、编号连续（0 例外）；每条标准含 AC 引用（0 例外）。
- **父 → HEAD 逐任务文本比对**（est / deps / 状态 done-todo / 每条标准 / 每条命令）：**唯一差异 = T-A11 标准 1**（补列 `quarantineReason` 括注）；其余 66 个任务与 T-A11 的其他 4 条标准 / 5 条命令零变化（`checklist-r9-std-cmd-diff.log` 仅 1 处 `110c110`）。作者“224 : 224、唯一改字 A11#1”属实。
- §5 矩阵 46 行 = spec 46 AC（差集 ∅）；§5 / §6 / §7 在本增量**无 hunk** ⇒ 部分前置均为最终任务祖先、任务 ↔ 矩阵双向一致、DAG 与 H-x 句均沿用 R8.1 判定且未被动。
- `-t` / `-g` 标题全文件 **216 = 214 WI + 2 §1 占位**（父相同；比 R8.1 时点多 1，来自第二批 Converge 记账，不在本增量）。
- **第三批**：T-A11（2 h，依赖 T-A10）→ T-A12（2 h，依赖 T-A11）→ T-A13（1.5 h，依赖 T-A12）；T-A22a（1.5 h，依赖 T-A09a / T-A10 / T-A12 / T-A22）；合计 **7.0 h、19 条命令**（5 + 5 + 4 + 5），全部 `test:unit tests/unit/jobs/**` / 工程门，不冒充 e2e 最终验收；DAG 不变。
- **粒度判断**：r6.6 对四任务只补机制 / 类型 / 测试提示，没有新增独立工作量。T-A12 处于 2 h 上限（4 方法 + 2 schema + `mappingHistory` 一行 + 三个 helper + 4 组测试），与第二批内实际交付的 T-A10（状态层核心 + 3 读方法 + 九场景 + 2 份 spec，2 h）体量相当；r6.6 消除的恰是最耗时的猜测点，本审核员**不认定已知超额**，也不接受以 S-22 兜底预吸收——若实际超 2 h 按 §7 S-22 停下拆分并记录，不在实施中偷换。T-A11 同理（含两例既有回归改写，属本任务语义变更）。没有“原任务本来就包含的细节”被当作额外 feature 计入，也没有真正的新 feature 被藏进精度。✓

### 6. source 所有权与流程纪律（协调器重点 6）

- **T-A11 改既有测试**：仅 `tests/unit/jobs/job-state-read.spec.ts` 的 `beforeEach(localStorage.clear())` + `WI scenarios read` 两例（`:222` 末句改为读回已持久化提交 / “重建即丢弃”改用非持久场景；`:236` 改为“非 normal 与有覆盖零访问；normal 无覆盖只 getItem 一次 `fai.jobs.v1`，不写不删”）。两例的原断言“normal 也零 storage 访问 / 新 normal client 丢弃提交”是第二批对**当时**（无持久化）状态的真实描述，A11 落地 plan §2.3 / §3 既定的 normal 持久化后必然改变——属语义变更处，允许且必须改写；文件在 tasks §1-5“上述 jobs 测试”所有权内 ✓。v1 三份契约测试（`mock.spec` / `contracts.spec` / `real-stubs.spec` 均动态或 `arrayContaining`）、生成器、`scripts/**`、`package.json` / 锁文件、壳 UI 明列不改（implementation-log §10）✓。
- **本轮未写代码**：`frontend` 与 `27e59e6` 零差异 ✓。
- **P3 台账**：R-A / R-C / R-E / R-F、R2-C / R2-D 保留后续，implementation-log §8 在本增量无 diff，未被代为风险接受 ✓；R2-A 由本批新增方法描述沿用实现中立写法（不把 mock 场景句写进描述）；R2-B / R2-E 由本批按口径固定 ✓。
- **main `072bb12`**：未引入（本树祖先不含）、继续 pin `90187f7`、R2-D 同步流程不变且明写“不是本批的新人工门” ✓。
- **H-x ④**：interface-handoff 页首仍写“四项 ④ 仍缺、本 feature 不写 / 不重建 v2 树”，消费分支 `3f63273` 未变 ✓（本审核员未 fetch，不独立核实远端）。
- **工程准则（AGENTS §5）增量**：§5.1 零新增防御面（`mappingHistory` 是数据载体不是 guard；入口只读查一次是既有领域规则）；§5.2 入口 parse 一次 + 快照入口 parse 一次；§5.3 只抽会复用的 helper；§5.5 生成物只经 `contract`；§5.6 真实 `commit` / 真实 client / 真实 AgentClient 回放、系统边界 `vi.spyOn(Storage.prototype, …)` 注入；§5.7 命令形态不变、无新工具。✓

## 阻断项（R9）

无。

## 非阻断建议（R9；P3，不计入判定，由作者 / 实施者自行决定是否吸收；均不改 AC、标准编号或命令）

| # | 位置 | 说明 | 建议归类 |
|---|---|---|---|
| S-38 | tasks T-A22a【r6.6 精度】`refresh()` 句 | 应明写 **`refresh()` 自身总是 resolve（失败以 `listStatus='error'` + `listError` 承载，不 reject）**。出错链：`main.ts` 的 `agentClient.subscribe(store.receiveAgentEvent)` 是同步回调、对 `refresh()` 只能 fire-and-forget；在 error 场景下 AgentClient 仍可 send（其场景只影响延迟），带 `jobContext` 的终态 → `refresh()` → `listJobs` adapter_error——若 `refresh()` 把拒绝向外抛，就是一条无人捕获的 unhandled rejection。标准 1 的“error 场景…`refresh()` 可重试成功”已隐含此意，建议在 `WI H-2 cache` 的 error 用例加 `await expect(store.refresh()).resolves` 一类断言固定，不加机制 | Tasks 措辞 / 实施提示 |
| S-39 | plan §2.4【r6.6】投放 · “submit 的 jobId 非空”句 | “写 ingest（artifactId = dataset，baseRev = 原最新修订，**没有 dataset 时为 null**）”可被读成 artifactId 为 null 或 baseRev 为 null 两种。既然 dataset 在同一次写内按需建立，建议改为“artifactId = 该 dataset（含本次新建者），baseRev = 原最新修订、首次建立时为 null”，让 ingest 事件总能锚到 dataset；两种读法都通过 schema，不影响标准 / 命令 | Plan 措辞 |
| S-40 | tasks T-A11【r6.6 精度】测试提示 | 标准 3 的 `WI corrupt` 用例建议同时断言“显式 `resetMockData` 后 `getPersistenceStatus()==='ok'` 且 `fai.jobs.v1` 已按种子重建、`fai.inbox.v1` 已删除”，以固定 unreadable 闩在 reset 路径被解除（plan §3 已写“成功为 ok”，这是 T-G04 标准 1“key 被重建”的前置）；实现上由 `clearJobKeys()` 或 `resetJobState()` 调 `resetPersistenceStatus()` 二选一即可，不加机制 | Tasks 测试提示 |

## 当前有效检查项（R9 勾选；唯一参与 Implement 前置判定；R8.1 的 26 项沿用其原判定，本轮对 r6.6 触及项重新判定、其余只核未回退）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** 沿用 R8.1；spec 零 diff、46 AC 独立计数；矩阵 46 / 46（§5 无 hunk，脚本差集 ∅）。
- ☑ **N-02 无未澄清歧义。** 沿用 R8.1 + 本轮：r6.6 全部为既有 what / AC 内的机制与类型精度（§1～§4 逐项判定），未改任何 AC 判据 / 目标 / 非目标；S-38～S-40 为措辞 / 测试提示，不是需求歧义；无需回流 Clarify / Gate 1。
- ☑ **N-03 目标与非目标边界清晰。** 沿用 R8.1；tasks §3 无 diff；r6.6 明写不做真实解析 / 抓取 / 模型 / 启发式隔离、不预做 T-A17 只读门 / T-A18 run 关联 / T-A21 收件箱 / T-B04 详情 / T-G04 横幅。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R8.1；plan r6.6 只在 §2.3 / §2.4 / §3 补机制精度，§5 验收对应表无 diff；T-B03 / T-C02 / T-C03 / T-C04 的既有下游断言（快照含 jobs / 事件 / Upload、隔离原因、`updatedAt` 变化）均被覆盖（Analyze R12 §4 本轮独立复核成立）。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** 本轮重读：plan §2.4 r6.6 写方法精度与 spec R-001 / R-003 字段与流程逐句对拍一致（§3）；§3 持久化精度与 spec §4“浏览器本地持久化、真实持久化归 api”一致；方法集 / 动作矩阵 / 九场景 / 样例表 / 迁移表 / 定稿语义无 hunk。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核 Analyze R12 §3 十九项判定与 §4 一致性成立；plan §3【r6.6】与 T-A11 标准 1 补列同句同义；plan §2.4【r6.6】与 T-A12 / T-A13【r6.6 精度】只引用不另立口径；T-A17 / T-A18 / T-A21 / T-B04 / T-G04 的衔接无矛盾；S-39 仅为一处可双解措辞。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** 沿用 R8.1；`docs/**` 零 diff；D-018 定稿语义无 hunk；D-020～D-024 未带入；持久化 / 投放规则未越出 D-016 / D-018“处理台复用 data-layer 既有机制、不加内置 manual 源”的边界。
- ☑ **I-03 前端基线事实核对。** 本轮在本树（= `27e59e6`）独立重核 F-1～F-10（见「基线与范围」真实代码事实）：getter 读次、JobState 形状与 commit 顺序、`Intervention.jobId` 必填、`UploadSchema` 含可选 `quarantineReason` 且 `IntakeInputSchema` 不含、fixture 无 pending + `quarantineReason`、`WriteReceipt` 已注册、`DataClient` 13 方法、两例既有测试的具体断言行、v1 契约测试的动态比较、`main.ts` 订阅先例、终态判别——全部属实。
- ☑ **I-04 文件边界与回滚一致。** implementation-log §10 逐任务写权限与 tasks §1-5 一致：T-A11 允许改 `job-state-read.spec.ts` 仅限两例 + `beforeEach`；T-A12 的 `types.ts` 只加两 schema；T-A22a 的 `main.ts` 只加订阅与解除；fixture / v1 契约测试 / `scripts/**` / 锁文件 / `app/**` / `workbench/**` / `shared/**` / `agent/{store,AgentDock,AgentDrawer,CotTimeline}` / `backend/` / `docs/` / spec / checklist / 审核原件明列不改。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 沿用 R8.1；矩阵 46 条最终任务与命令零变化；第三批 19 条命令全为单测 / 工程门、只作“部分前置”；标准 2（A12）/ 标准 2（A13）在本批无读 API 时的替代验证路径（覆盖注入、快照、回执、旧修订、`getIntakePreview`）均为真实实现输出。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 本轮重新复算：67 任务 / 102.0 h / 每项 0.5～2 h 0 例外 / 224 ↔ 224 逐任务 1:1 连续 / 每条标准含 AC / 依赖向前无环 / 46 = 46 / 16 + 51 / 第三批 7.0 h 19 命令——全部成立；父 → HEAD 唯一标准文字变化 = T-A11 标准 1；无新增独立工作量 > 2 h（§5 粒度判断）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** 本轮核 `scripts/check.mjs`：network 守卫只扫 fetch / XHR / WebSocket / EventSource / axios，不扫 localStorage，无 import 方向守卫——r6.6 未对守卫作任何新声称；T-A22a 标准 1“store 不调用 localStorage”经 Storage spy 而非守卫验证，口径正确。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 本轮重新判定：零新增 guard / 事务 / 锁 / 竞态防护 / 迁移框架；`mappingHistory` 是既有不变量的最小数据载体；“入口查一次 delivered / cancelled”是既有领域规则而非新防线；unreadable / degraded 只是状态标记。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** 本轮重新判定：写方法入口 parse 一次、结果边界 parse 一次、快照入口 JSON.parse + schema parse 一次；内部 helper 不重复校验；`Upload` 白名单由 strict `UploadSchema` 在入口一次执行。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `writableJob` / `findUpload` / dataset 修订追加 / 回执收件箱计数均 A12 建、A13（及后续）复用；写包装为四个写方法共用。
- ☑ **P-5 自动生成文件不手改（§5.5）。** 四任务生成物均只经 `pnpm -C frontend contract` 并以 `contract --check` 对拍（命令 5 / 5 / 4 / —）。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 持久化经真实 `commit`；配额异常在系统边界 `vi.spyOn(Storage.prototype,'setItem')`；隔离样例经 `jobFixtures` 边界注入；jobsStore 用真实 Pinia + 真实 mock DataClient / AgentClient 回放 + 透传 spy；明写不加生产故障开关 / 注入 setter、不复写业务逻辑。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令形态不变；无新工具 / 依赖 / 脚本。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** 第三批 DAG（A10 → A11 → A12 → A13；A09a / A10 / A12 / A22 → A22a）与 §6、implementation-log §10、README 一致且本批内全部满足；不在本批的任务明列；H-2·列表的提供任务本批完成后齐备可形成 ①③，② 为届时已提交的有效 Checklist，④ 只能由 v2 所有者登记。
- ☑ **C-02 契约闭环。** 本轮重新判定：九个方法均在 plan §2.4 方法表内、零新增；新增 schema 仅 `CreateJobInput` / `IntakeReceipt`（复用 `WriteReceipt`）并进 `contractSchemas` 带 describe；real 桩由 `real-stubs.spec` 的 `satisfies` 强制全键覆盖；`resetMockData(): Promise<null>`；`methods.ts` 描述实现中立（R2-A）。
- ☑ **C-03 事件与状态闭环。** 本轮重新判定：只用 ingest / map_fix / delete 三种既有 kind；未归属投放不写事件、不伪造 jobId；assign 只补一条 ingest；cancel_job 作业级锚 null 在 schema 允许范围；不触及 activeRunId / overlay / 合并 / 排队（T-A18 / T-A20）；回执 `inbox` 取真实 0。
- ☑ **C-04 场景定义足以稳定验证。** 沿用 R8.1 + 本轮：写方法 slow / error 行为随当前共享状态 scenario（R2-E 同源），error 在 commit 替换前拒绝、未知锚独立 not_found；`resetMockData` 在 error 下不拒绝、非 normal 只重建内存——与九场景表既有句一致。
- ☑ **C-05 版本与定稿闭环。** 本轮重新判定：createJob 初始交付产物 draft + r1（满足 `latestMergedRev` 非空）+ `Deliverable` draft 三锚 null；dataset 修订以原最新修订为底追加、旧修订保留；cancel 保留阶段 / 产物快照；定稿语义无 hunk；S-35 残留在台账未关。
- ☑ **C-06 隐私与本地持久化自洽。** 本轮重新判定（§1）：`fai.jobs.v1` 只含 `{jobs, details, deliverables, interventions, uploads, mappingHistory}` 业务子集，不含运行时控制 / File / 字节 / 正文 / 完整提交参数；Upload 白名单 = strict `UploadSchema` 全部键（十项 + 既有可选 `quarantineReason`，后者只能来自仓库合成 fixture、用户不能经投放写入）；`mappingHistory` 条目与已持久化的 dataset 修订摘要同形、有界、无读 API；文本投放正文只在提交参数与内存草稿；非 normal / 有覆盖零访问；损坏不覆写、只显式重置删除；`fai.rail` / `fai.drawer` / `fai.layout` 不动。隐私边界实质不变。
- ☑ **C-07 视觉与工程纪律。** 沿用 R8.1；r6.6 不触及组件 / 令牌 / 色值 / 玻璃层级；T-G04 横幅不提前。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 沿用 R8.1；r6.6 文字未引用 D-015；D-017 仅作“真实闸门非本 feature”边界；D-020～D-024 未带入。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **定向通过 vs 本批尚未实施**：本节 26 ☑ 表示 r6.6 精度在 Plan / Tasks 层达标且 R8.1 已认可设计未回退；第三批 4 项**一行代码未写、一条测试未跑**，不得读作任何任务完成或 AC 验收。16 / 67 的“已完成”仍 = 批次代码 Review 通过。
- **P-4**：代码级，批次 / 最终 Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，不声称任何 AC 已通过、不假绿。
- **Implement 前置**：当前有效轮次 = 本 §R9，26 ☑ ⇒ 第三批可在**本节被集成人提交后**按 DAG 串行开码（提交前仍 blocked）；以 **R9 提交后的 SHA** 作为第三批有效 Checklist 并登记到 `specs/README.md` 本 feature 行与 implementation-log §10 “②”（本审核员不 commit、不改 README）。
- **第三批代码 Review 须明确核对**（本节不替代）：持久化白名单（Upload 快照键集 = strict `UploadSchema`、`quarantineReason` 只来自 fixture）、`mappingHistory` 内容与有界性、`fai.jobs.v1` 中不含文本投放正文（T-A12 标准 3）、两例既有测试改写未放宽其他断言、getter 读次仍为 1、R2-B 调用顺序、R2-E 同源。
- **H-x 交接**：八切片仍**全部未交付**；本批完成后 H-2·列表可形成 ①③，② 届时填已提交的有效 Checklist SHA，④ 只能由 `integration/frontend-workbench-v2` 所有者登记；interface-handoff §5（含 §5-8）待 v2 接收方确认，本审核员不代签。
- **上游**：main `072bb12` 不在本树祖先、继续 pin `90187f7`；同步时按 tasks §7 重核 / Analyze / A 定向复核（R2-D），不是本批新人工门。
- **Gate 2 / Handoff**：不在本阶段；feature 未收敛（51 项未开始 + H 组外部阻塞）。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前必报“未收敛（外部阻塞）”；S-22 兜底继续有效且不得预先吸收已知超额；§7 S-31 写后刷新核对表本批只核 createJob 一条。
- **P3 台账**：R-A / R-C / R-E / R-F、R2-C / R2-D 未处理、未经 Walter 风险接受；R-B 部分定案（S-35 残留未关）；R-D 口径已定、未修；R2-A → T-G06；R2-B / R2-E 由本批按口径固定；S-37 已在第二批落实；新增 S-38 / S-39 / S-40。

## 下一步

1. 集成人原样提交本文件（R9），以该 SHA 作为第三批有效 Checklist，更新 `specs/README.md` 本 feature 行与 implementation-log §10 “②”。
2. 第三批按 §6 DAG 串行开码：T-A11 → T-A12 → T-A13 → T-A22a；Implement 首选 `openai/gpt-6-astra`（新会话、实施树）；每任务固定 commit + 逐命令输出摘要回报；任一任务实际超 2 h（T-A11 / T-A12 已到上限）或发现与 plan / tasks 精度不符，先停下回报，不在实施中偷换。
3. 作者可自行决定是否吸收 S-38 / S-39 / S-40（均为措辞 / 测试提示，不需重过 Checklist；若只在实施中多断言则不改 tasks）。
4. 本批完成后 Converge → 独立代码 Review（新会话、异模型），该 Review 须按「阶段说明」所列项核对持久化白名单与 `mappingHistory` 的真实 diff。
5. H-x ④ 待 v2 集成树所有者登记；interface-handoff §5-8 待 v2 接收方确认；main `072bb12` 同步由集成人按 §7 决定。

## 结构核验证据（R9，只读）

```text
TARGET    ef64c1853f79ea1e18e99a7b0ff22de2152de40c（parent f1b7c06）；worktree D:/2030/Futures-AI-interaction-checklist-batch3 @ review/workbench-interaction-batch3-checklist；启动 git status clean
DIFF      git diff f1b7c06 ef64c18 --stat：specs/README.md | analyze.md | implementation-log.md | interface-handoff.md | plan.md | tasks.md；6 files, +347 −7；--name-only 排除 specs/ 后为空
          tasks.md hunk 仅 5 处：@@ -1,5 / @@ -400,12（T-A11）/ @@ -419,10（T-A12）/ @@ -438,10（T-A13）/ @@ -620,10（T-A22a）；§5 / §6 / §7 无 hunk
ZERO      git diff 27e59e6 HEAD -- frontend = 0 行；spec.md / checklist.md（blob 99e096ad… = 34d339e 的 R8.1 原件）/ review-batch2.md / review-batch-a09a.md / converge-batch2.md / converge-batch-a09a.md / docs / AGENTS.md 相对 f1b7c06 零差异（git diff --quiet exit 0）；spec AC 去重计数 46
CODE      job-state.ts：let state；JobStateSchema strict{scenario,jobs,details,deliverables,interventions,uploads,emptyJobIds}；commit = structuredClone→mutator→parse→替换 ✓
          mock/index.ts：readJobFixtures() 函数内读 window getter；工厂 readScenario()→initializeJobState(scenario, readJobFixtures()) 各一次；readJobState 用 getJobScenario()，read() 先于 error 抛出 ✓
          types.ts：uploadFields = jobId/sourceNote/id/status/mapping/createdAt/removed/quarantineReason? + inputKind + fileMeta|url；text 分支无正文；strict；quarantineReason :321 optional；IntakeInputSchema :298 无 quarantineReason ✓
          InterventionSchema.jobId min(1) :569；artifactId/baseRev nullable :570–:571；WriteReceiptSchema :586 注册 :606；InboxCounts{unread,byStage}；DataClient 13 方法；dataset 修订 uploads[{uploadId,mapping,status}] :478；latestMergedRev 非空 :460 ✓
          main.ts：agent store subscribe + onUnmount + hot.dispose；registerJobRoutes 在 mount 前 ✓；events.ts 终态 = run.completed|failed|aborted :104–:108 ✓
          check.mjs :317–:318 network 守卫只扫 fetch/XHR/WebSocket/EventSource/axios；无 import 方向守卫 ✓
FIXTURE   uploads.json 池 2 条：u-unassigned-file（pending，无 qr）、u-unassigned-quarantine（quarantined，qr=合成文本）；job-detail 18 条全 url、j-collect 2 条 pending、无 qr；全库 pending+qr = 0 ✓；interventions 6 条均带 jobId
TESTS     job-state-read.spec.ts :222 末句新 normal client 丢弃提交；:236 九场景+覆盖零 get/set/remove/clear（含 normal）⇒ A11 起两例必改 ✓；其他 unit spec 无 Storage spy；component 只碰 fai.layout/fai.drawer；setup.ts 不清 localStorage；mock.spec dataRequests 显式十方法、contracts.spec arrayContaining、real-stubs satisfies ✓
TASKS     67 任务 / 102.0 h（A28·43 B7·10.5 C5·7.5 D3·5 E3·5.5 F7·12 G10·14.5 H4·4）/ 每项 0.5–2.0 h 0 例外 / 依赖全部向前、无环（0 例外）
          16×已完成 + 51×未开始；标准 224 ↔ 命令 224 逐任务 1:1、编号连续（0 例外）；标准含 AC 0 例外；矩阵 46 = spec 46（差集 ∅）
          父→HEAD 逐任务 est/deps/done/STD/CMD 文本比对：唯一差异 T-A11 STD 1（checklist-r9-std-cmd-diff.log 仅 110c110）
          -t/-g 全文件 216 = 214 WI + 2 占位（父相同）
          第三批：A11 2h←A10；A12 2h←A11；A13 1.5h←A12；A22a 1.5h←A09a,A10,A12,A22；合计 7.0 h、19 命令（5+5+4+5）
AGENTS    §2 第 6 步 0.5–2 h / 任务；§5.1 / §5.2 / §5.3 / §5.5 / §5.6 / §5.7；§6 通道：A = claude-fable-5-1 via anthropic（bridge/opus 本轮 exit 1 = quota / rate / spend_limit 类，本窗口不重试；fable 未单独探 bridge、不伪称；anthropic/fable exit 0；只换通道不换模型；未改配置）
WRITE     唯一改动仓库文件 specs/workbench-interaction/checklist.md；临时文件 5 个在独占 Temp/wi-batch3-01a18388-0yit2j1a/（checklist-r9-*）；git diff --check 见回复；不 commit
```

---

# R8.1（2026-10-29，第八轮增量：B-12 拆分 r6.4 的增量复核；只核拆分落点、未回退与结构数字，不重审 R8 已认可的 25 项设计；本节是 **Checklist R8.1**，与 analyze.md 的「Analyze R10」无关；**历史快照，复选框已改为文字符号，不参与当前判定**——其 26 ☑ 为 R8.1 时点对 `8bf56b8` 的结论，第二批据其提交 `34d339e` 开码并经 `review-batch2.md` 通过，当前有效勾选见 §R9）

## 基线与范围

- **审查对象（固定）**：本工作树 `D:/2030/Futures-AI-interaction-checklist-batch2-r81`，分支 `review/workbench-interaction-batch2-checklist-r81`，HEAD = `8bf56b8aa3af37ea62f4a67eb07b3a054d81377b`，启动时 `git status --short` 为空、clean。增量 diff `git diff 7b91a2c3b5bdfd1147aeee7fbeb23d043c439b98 8bf56b8`：**6 文件 +128 / −36**——`specs/README.md`（本 feature 行）、`analyze.md`（页首当前结论 + 新增「Analyze R10」）、`implementation-log.md`（页首当前状态行、§7 两行、§8 R-B 行 + 【r6.4 更新】、§9）、`interface-handoff.md`（页首一行、§1 表后口径一段）、`plan.md`（页首 r6.4 记录、§1 徽标句 designUI 引用、§2.4 R-B 句尾）、`tasks.md`（页首 r6.4 块、§0.0 r6.3 复核 ④ 句尾、T-A07 / T-A08 状态行旁注与修改范围注、新增 T-A09b、T-A10 状态 / 预计 / 依赖 / 修改范围末段 / 标准 5 / 命令 5、T-A23 修改范围章节号、T-A24 修改范围实施提示、§5 矩阵五行、§6 四处、§7 一句）。**独立核实的零差异**：`git diff --name-only 7b91a2c 8bf56b8 | grep -v '^specs/'` 为空（代码 / tests / fixtures / docs / AGENTS 零改动）；`git diff 13a3373 8bf56b8 -- frontend` 0 行（源码 = 首批受审 `13a3373`）；`spec.md`、本文件（blob `d8175986…` = R8 原件）、`review-batch-a09a.md`、`converge-batch-a09a.md` 相对 `7b91a2c` 零差异（`git diff --quiet` exit 0）；spec 46 AC 独立计数（`AC-\d{3}-\d` 去重 = 46）。前轮审查对象 `8ad5e28` 与本轮父提交 `7b91a2c` 的差异 = 集成人原样提交 R8 原件（作者自报，本轮以 `7b91a2c` 为父独立 diff，不依赖该说明）。
- **重读**（本轮开始时重新读取，不依赖会话记忆）：AGENTS.md（§2 第 6～8 步、§5、§6）、`docs/plan.md`、`docs/designUI.md`（§6 :214、§8 标题，核 S-33）、冻结 spec v1.1、本文件 §R8 全文（结论、B-12 最小关闭要求五项、S-33～S-36、26 项勾选、阶段说明）、tasks.md（页首 r6.4 块、§0.0、T-A07 / T-A08 / T-A09 / T-A09a / T-A09b / T-A10 / T-A22b / T-A23 / T-A24 全文、§5、§6、§7）、plan.md（页首、§1 徽标句、§2.4 R-B 句、§4 迁移表、§4.1）、analyze.md「Analyze R10」全文、implementation-log §7 / §8 / §9、interface-handoff 页首与 §1 口径、`specs/README.md` 本 feature 行。
- **真实代码事实（本树 = `13a3373`，逐文件读 / 脚本只读复算，不以作者摘要代替）**：`frontend/tests/unit/jobs/fixtures.spec.ts` 只导入 `vitest`、`contracts/types.ts` 与五份 `fixtures/jobs/*.json`，**不导入 `mock/index.ts` / `createMockDataClient` / `readJobFixtures`** ⇒ T-A09b “不需要 T-A09 / T-A10 状态层或任何 DataClient 运行状态、只用 `fixtures.spec.ts` 验收”属实；该文件五个顶层 `describe` 标题 = `WI jobs fixtures` / `WI deliverable fixtures` / `WI final only delivered` / `WI interventions fixtures` / `WI list coverage`，与 T-A09b 标准 2 点名的五个完全一致；三处收窄点（:54 `test.each(Object.keys(details))`、:129 deliverable 全作业循环、:199 final-only）属实。`jobs.json` 阶段态 `not_started` 的 (作业, 阶段) 恰 **12** 个（j-cancelled ×4、j-collect ×3、j-process ×2、j-failed / j-human / j-running 各 deliver），与 T-A09b 修改范围 / T-A10 标准 5 列表同集合；这 12 个工作区目前 **12 / 12 非空**（校正确有对象）；十作业 `previews` / `reconciliations` 均 2 / 2；`interventions.json` 落在 `not_started` 的锚 **0** 个。`types.ts`：四分支 `uploads / sources / series / artifacts / revisions / derivedValues` 均为无 `.min()` 的 `z.array`（:496–:511），`deliverable` / `finalSnapshot` `.nullable()`（:443–:444，描述文字即“空工作区为 null”），`previews` 为 `z.record`、`reconciliations` 为 `z.array`（:525–:526）⇒ 空态无需改 schema / 生成物。
- **审核员与通道**：A = **claude-fable-5-1 via anthropic**（页首 R8.1 通道行）；新开独立会话、独立 worktree；与被审作者 claude-opus-5-5、Implement 首选 openai/gpt-6-astra 均异模型。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试、未启动子 agent / 服务、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写入任何其他 worktree、未修改 plan / tasks / analyze / implementation-log / interface-handoff / spec / README / 代码 / fixtures / tests。结构复算用 `python` 一次性脚本只读完成，脚本与日志在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/`（`checklist-r81-struct.py`、`checklist-r81-structure.log`、`checklist-r81-tasks-parent.md`；非项目产物、不入库、不清理共享 tmp）。唯一写入的仓库文件为本文件（新增 §R8.1、页首 R8.1 通道行与「文件结构」段、把 §R8 的 25 个 `[x]` / 1 个 `[ ]` 改为 ☑ / ☐ 文字并在其标题补“历史快照”；R8 其余内容未动）。本审核员不 commit；**第二批有效 Checklist = 本节被集成人提交后的 SHA**。

## 结论（R8.1）：**通过**（增量；B-12 **关闭**，V-02 补勾；0 P1 / 0 P2；1 项 P3 建议 S-37 不阻断）——**26 项当前有效检查项 26 ☑ / 0 ☐**。

本结论的边界（必须同时成立，不得单独引用）：

1. 本轮只复核 B-12 的拆分落点、R8 已通过项“未回退”与结构数字；R8 的 25 ☑ 按 R8 原判定沿用，不重审、不重新背书其内容。第二批 **T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24 均未实施**，一行代码未写、一条测试未跑；46 AC 最终验收仍 **0**；首批 10 / 67 的“已完成”= 本批代码 Review 通过（`af95b66`）而非 AC 验收；feature **未收敛**（57 项未开始 + H 组 `blocked_by: frontend-workbench-v2`）。本轮未运行任何产品测试，不声称任何命令会通过。Gate 2 / Handoff 不在本阶段。
2. 本审核员不代 Walter 做风险接受（R-A / R-C / R-E / R-F 未处理、未经风险接受；R-B 部分定案、残留 S-35 在台账保持未关；R-D 口径已定、未修），不代 v2 接收方签收 interface-handoff §5（含 §5-8），不代 v2 集成树所有者登记任何 H-x ④。
3. 按 AGENTS §2 第 8 步，Implement 前置 = 当前有效轮次全部勾选；本节 26 ☑ ⇒ 第二批可在**本节被提交后**按 tasks §6 DAG 开码（T-A09b → T-A10；T-A22 → T-A22b；T-A23 / T-A24 独立）。本节未提交前仍为 blocked。

## 独立核验（不照单全收作者结论）

### 1. B-12 最小关闭要求逐项对拍（R8 阻断表 (1)～(5)）

| R8 要求 | HEAD 实况（独立读 tasks / plan / 日志原文） | 判定 |
|---|---|---|
| (1) 新增 fixture-only 任务，0.5 h，依赖 T-A08，无代码 / schema / 生成物改动；修改范围 = 原 T-A10【r6.3 R-B】段 | T-A09b：预计 **0.5 h**、依赖 **T-A08**（脚本）；排序 T-A09 < T-A09a < T-A09b < T-A10 成立；修改范围只许 `fixtures/jobs/{job-detail,deliverable}.json` + `fixtures.spec.ts`，明写“无代码 / schema / 类型 / 生成物改动”“不需要 T-A09 / T-A10 状态层或任何 DataClient 运行状态”；12 个空工作区四种形态、j-cancelled `previews={}`、j-collect / j-cancelled `reconciliations=[]`、不改 jobs / interventions / uploads / ID / 已开始内容 / done 阶段产物状态、`fixtures.spec.ts` 三处收窄 + 新增 `WI not-started seeds`、不删用例 / 不改既有标题 / 不放宽 schema 与已开始断言——逐句与 `7b91a2c` 的 T-A10【r6.3 R-B】段对拍，**内容整体迁入、无扩写、无删减**；T-A10 中该段已删除，不留可误读为许可的原文 | ✓ |
| (1) 完成标准 ① 12 空态 + `WI not-started seeds` ② 工程门；命令 = `fixtures.spec.ts` 与 `typecheck && lint` | 3 / 3：① 12 空态 + previews / reconciliations 由 `WI not-started seeds` 依手写状态表断言（AC-002-5 / 004-5 / 005-6 部分前置）↔ `fixtures.spec.ts -t "WI not-started seeds"`；② 全文件通过——既有五个标题仍匹配、已开始内容 / S-18 parse / final 唯一 / i-seed-1～6 锚可达 / 真实 schema 反例拒绝均保留未放宽（AC-002-5 / 005-6 / 006-7 / 007-1 部分前置）↔ `fixtures.spec.ts`（整文件）；③ 工程门（AC-009-1）↔ `typecheck && lint`。比 R8 建议多拆一条（空态 vs 不回退），标准 ↔ 命令仍 1:1、每条含 AC、命令全在 `tests/unit/jobs/**`。协调器要求的“12 空态 / started 内容与介入锚 / 未放宽 schema / 工程门”四点各有归属 | ✓ |
| (2) T-A10 恢复 r6.1 范围、无 fixture 写权限、无“2 h + 0.5 h”并入 / 停工兜底表述、依赖 T-A09 + T-A09b、预计 2 h | 预计行 = “**2 h**”（无括注）；依赖 = **T-A09、T-A09b**；状态行与修改范围末段明写“本任务**不改**任何 fixture 文件与 `fixtures.spec.ts`”“fixture 校正本身归 T-A09b”；修改范围**首段**（模块级唯一共享状态 / `commit(mutator)` 深拷贝 → 边界校验 → 整体替换 / 读 API 返回副本 / 三读方法 / 九场景读行为 / `client.ts` `methods.ts` `real/index.ts` `mock/index.ts` / 生成物 / 两份新 spec / 不实现 A11 · A12 起 · A18 / commit 无生产调用方由 T-A17 标准 2 验证）与 `7b91a2c` 逐字相同（diff 中为上下文行）；末段只保留“原样返回、不按阶段态过滤、不写进 schema / 入口校验、`createJob` 初始空产物不受影响、S-13 空工作区表达非新 UI 状态”并补“`job-state-read.spec.ts` 新增 `WI not-started seeds`，与 fixture 侧同名前缀用例分属两份 spec、命令均带文件路径”；标准 1～4 / 6 与命令 1～4 / 6 逐字未变 | ✓ |
| (2) 标准 5 收窄为真实 `getStageWorkspace` 读回；命令 5 = `job-state-read.spec.ts -t "WI not-started seeds"` | 标准 5 = T-A09b 校正后的 12 个 (作业, 阶段)（逐一列出）经真实 `getStageWorkspace`（normal / job-running、新建 client）返回带阶段的空工作区（deliver `deliverable=null` / `finalSnapshot=null`）（AC-002-5 / 004-5 / 005-6 部分前置）；命令 5 = `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI not-started seeds"`（:342），不再 `&&` 拼接 `fixtures.spec.ts`。R8 建议句中的“已开始阶段返回原样例”未保留（作者自报 O-R10-1）→ 见 §2 独立判断：**非阻断精度（S-37）** | ✓（含 1 P3） |
| (3) T-A07 / T-A08 注、plan §2.4 句尾、implementation-log §8 / §9、页首块与 §6、矩阵同步 | T-A07 / T-A08：状态行只**追加**“r6.4 旁注”（固定 commit `0f60448` / `7bb83f9` / `320277a`、验证计数、`af95b66` Review 结论三者原文未动，脚本核 10 条已完成状态行只有这两条有追加、无改写），修改范围注 T-A10 → T-A09b；§0.0 r6.3 复核 ④ 句尾注“拆为 T-A09b，结论不变”；plan §2.4 R-B 句尾补“由 tasks T-A09b 落地、T-A10 读回验证”，页首 r6.4 记录；implementation-log 页首当前状态行、§7 新增 R8 与 r6.4 两行（脱敏、只记通道类别）、§8 R-B 行落点 + S-35 残留 + 【r6.4 更新】、§9 范围 / 写权限（T-A10 “不再改任何 fixture 与 fixtures.spec.ts”、T-A09b 单列）/ 口径 1 / 命令数 21 / 回报 / ② / 复核状态；tasks 页首 r6.4 块、§6 组序（排序规则加 `T-Xnnb`）/ 主干（A08 → {A09, A09b}，{A09, A09b} → A10）/ H-x 句 / r6.4 行 / 合计、§7 S-22 “兜底不得预先吸收已知超额”；矩阵 AC-002-5 / 004-5 / 005-6 / 006-7 / 007-1 加 A09b；interface-handoff 页首 + §1 表后口径；README 行 | ✓ |
| (4) 重跑 Analyze（R10）并复算结构，如实登记 | analyze.md「Analyze R10」存在：§1 重读 / 固定输入、§2 五项落点对拍、§3 一致性、§4 脚本复算（67 / 102 / 224 / 224 / 10 + 57 / 215 = 213 + 2 / 162）、§5 O-R10-1 / O-R10-2、§6 结论“不宣布 B-12 关闭、不勾 V-02”。数字与本轮独立复算（§4）逐项相同 | ✓ |
| (5) A 新会话 R8.1 增量复核补勾 | 即本节 | ✓ |

### 2. O-R10-1 的独立判断（T-A10 标准 5 未保留“已开始阶段返回原样例”）

- **事实**：r6.1（R7 26 / 26 通过）的 T-A10 标准 1～4 本就没有“已开始阶段经 `getStageWorkspace` 返回种子内容”的正向断言（标准 2 全是 empty / not_found / adapter_error / 覆盖缺样例 ⇒ 空集合）；该正向句是 r6.3 随 R-B 并入标准 5 时才出现，r6.4 随 R-B 拆出而去掉。
- **它是否是“不按阶段态过滤”的判别器**：不是。已开始阶段在“原样返回”与“按阶段态过滤”两种实现下都返回原样例；真正能区分两者的是“`not_started` 但带内容的工作区仍返回内容”，而这只在 rerunStage 之后出现（T-A20），不在 T-A10 范围。故去掉该句不削弱 R-B 口径的可验证性。
- **它是否是 B-12 的实质**：不是。B-12 = 粒度；粒度已由 T-A09b 0.5 h + T-A10 2 h（无 fixture 工作）关闭。
- **残留风险**：T-A10 自身 6 条标准对 `getStageWorkspace` 没有任何非空正向样例，一个“对所有 (作业, 阶段) 都返回空工作区”或“取错作业 / 阶段”的实现在 T-A10 内不被捕获，要到 T-B04 / T-B05 / T-D01 / T-E01（AC-002-5 / 004-5 / 005-6 的最终任务，经真实 mock client 渲染内容）才暴露。这是 r6.1 既有、R7 已接受的任务级覆盖面，不是 r6.4 引入的回退；AC 最终判据与最终命令未变。→ **S-37（P3，非阻断）**：建议 T-A10 标准 5 末尾恢复一句正向样例（“已开始阶段返回原样例，如 j-collect 的 collect 两条投放、j-deliver 的六类块交付物”），命令 5 不变（同一 `WI not-started seeds` 标题内加断言即可）；也可由实施者在该用例内直接多断言一例（标准是下限，不需改 tasks）。不采信“默认可行”，也不为预计测试结果改模型；本审核员不替作者改设计。

### 3. 未回退核对（R8 已认可项，只核“有没有被动”）

- diff 中 **无** T-A22b hunk（`bindRouter` / `context` getter / `registerJobRoutes(router, pinia)` / 标准 1～3 命令 1～3 原样）；plan §2.1 / §2.3 无 hunk；interface-handoff 只 +3 行（页首一行、§1 表后口径一段、空行），§3 `session.ts` 行与 §5-8 “公开设置方式 = 无”原样。✓ H-4 未回退。
- T-A23：唯一改动 = 修改范围中 designUI 引用 `§8` → `§6（:214 “新增组件（D-016）”）`（S-33）；`docs/designUI.md` :214 实为“新增组件（D-016）：阶段轨道、作业卡、产物卡、来源徽、状态徽……”，§8 为“规范资产移植计划”——更正属实；自制徽标、不导入 Badge.vue、只复用令牌、标准 1～3 / 命令 1～3 原样。✓
- T-A24：唯一改动 = 修改范围末尾追加“实施提示（r6.4，S-36；不新增机制 / 标准 / 命令）：返回类型可给逐行与摘要分支一个具名判别”；`'\n'` 切行 / 空串 0 行 / 2000 边界 / 不引依赖、标准 1～3 / 命令 1～3 原样。✓ 这是实施提示而非新标准，符合 R8 S-36 的定位。
- R-D：implementation-log §8 R-D 行无 diff；T-A10 状态行仍写“不接管任何领域写入，不加跨字段 refine”；未加任何 refine / 入口校验。✓ 未加 R-D 防线、未私自风险接受。
- R-A / R-C / R-E / R-F：§8 对应行无 diff，仍“未处理”；【r6.4 更新】明写“未经 Walter 风险接受”。✓
- S-35：§8 R-B 行登记“done 阶段上游产物仍 draft——产物 status 与阶段态独立、阶段 done ≠ 产物 confirmed、不为关 P3 自动审批、留 T-A20 / R-A 定案时核对、R-B 保持部分定案未关”；T-A09b 修改范围也写“done 阶段产物状态照旧”。✓ 没有把 R-B 整体记为已关闭。
- 首批 10 项：状态行固定 commit / 验证计数 / Review 结论零改写（脚本：只有 T-A07 / T-A08 的 `st` 字段有追加，其余 8 条零变化；T-A01～T-A09a 的 est / dep / std / cmd 全部零变化）。✓
- 冻结 spec：零 diff，46 AC；plan §2.4 `Deliverable` / `FinalSnapshot` / 九场景表 / 十样例表 / §4 迁移表 / §4.1 `createJob` / D-018 定稿语义：无 hunk。✓

### 4. 任务结构独立复算（脚本，只读；作用于 HEAD `8bf56b8` 并与父 `7b91a2c` 对比；**不沿用作者或 R8 的预期数字**）

- **67 个任务**（父 66；新增 T-A09b，无删除）、编号唯一、排序规则 “T-Xnn < T-Xnna < T-Xnnb < T-X(nn+1)” 成立；合计 **102.0 h**（A 28·43 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4；父 101.5，+0.5 = T-A09b）；每项 0.5～2.0 h（min 0.5 = T-A09b，max 2.0；**0 例外**，B-12 的越限已消失）；依赖去括注后全部向前、无环（0 例外）。
- 任务级差异（父 → HEAD）：仅 T-A07 / T-A08（状态行追加旁注）、T-A09b（新增）、T-A10（预计 / 依赖 / 状态 / 标准 / 命令）；其余 62 个任务的预计 / 依赖 / 状态 / 标准 / 命令 **零变化**（T-A23 / T-A24 只在修改范围文字，不在标准 / 命令）。
- 状态：**10 × 已完成**（T-A01～T-A09、T-A09a）、**57 × 未开始**，无其他值；H 4 / 4 另带 `frontend-workbench-v2`。
- 完成标准 **224** ↔ 验证命令 **224**，逐任务 1:1、编号连续（0 例外；父 221 / 221，+3 = T-A09b 3 / 3，T-A10 仍 6 / 6）；每条标准含 AC 引用（0 例外）。
- §5 矩阵 46 行 = spec 46 AC（差集 ∅）；“部分前置”均为最终任务祖先（0 例外；A09b 出现在 AC-002-5 / 004-5 / 005-6 / 006-7 / 007-1 五行，均经 A09b → A10 → B01 → B04 → {B05 / D01 / E01 / B06 / F01 → … → F07} 为祖先）；任务正文 AC 引用 ↔ 矩阵双向一致（AC-009-1 工程门除外，0 例外）。
- `-t` / `-g` 标题（全文件）**215** = 213 `WI` + 2 §1 占位符（父 214 = 212 + 2；+1 = T-A09b 命令 1）；任务命令内标题 162（父 161）；`WI not-started seeds` 恰两处命令（:319 `fixtures.spec.ts`、:342 `job-state-read.spec.ts`），各带文件路径，S-34 消解属实。单测 / e2e 路径全部在 `tests/{unit,component}/jobs/**`、`e2e/jobs/**`，唯一例外仍是 T-A09 命令 3 的三份既有契约测试（有意整文件跑）。
- spec 标“端到端”的 AC 共 **18** 条，最终命令全部为 `test:e2e e2e/jobs/…`；第二批 **21** 条命令（A09b 3 + A10 6 + A22 3 + A22b 3 + A23 3 + A24 3）全为 `test:unit` / 工程门，不冒充 e2e 最终验收；第二批工时 **7.0 h**（0.5 + 2 + 1 + 1 + 1.5 + 1）。
- 以上与 tasks 页首 r6.4 块、§6、analyze R10 §4、implementation-log 页首 / §9、interface-handoff 页首、README 行所报数字（67 / 102 / 224 / 224 / 10 + 57 / 6 项 7 h / 21 条）**全部一致**。
- H-x：tasks §6 / interface-handoff 页首与 §1 口径 / implementation-log §9 一致——A09b 只是 A10 的新祖先，不是任何切片的提供任务、不形成 ①～④；八切片仍全部未交付，H-1 维持“待消费方集成”；② 明写“R8 未通过不能作 ②，以 R8.1 提交 SHA 为准”；④ 只能由 v2 集成树所有者登记。✓

### 5. 工程准则（AGENTS §5）与所有权（增量）

- §5.1：r6.4 零新增运行时机制 / 校验；T-A09b 只改合成种子与断言；S-36 只是类型形态的实施提示。
- §5.2：跨字段关系仍只在测试断言层；`jobFixtures` 入口校验不变。
- §5.6：T-A09b 的 `WI not-started seeds` 期望来自手写状态表、不从 fixture 推导；T-A10 标准 5 经真实 `getStageWorkspace` + 新建 client 读回，不 mock 内部模块。
- §5.7：命令全部沿用 `pnpm -C frontend {test:unit,typecheck,lint,contract}`；无新工具 / 依赖。
- 所有权：T-A09b 写权限（两份 JSON + `fixtures.spec.ts`）在 `contracts/mock/**` / `tests/unit/jobs/**` 内，与 implementation-log §9 一致；T-A10 写权限已去掉 fixture 项；`shared/**` / `app/**` / `agent/{store,AgentDock,AgentDrawer,CotTimeline}` / `scripts/**` / `package.json` 锁文件 / `backend/` / `docs/` / spec / checklist / 审核原件均明列不改。

## 阻断项（R8.1）

无。**B-12 关闭**（Tasks 粒度：每项 0.5～2 h 0 例外；R-B 与状态层核心分属两任务、两次提交、可分别 Review；出错链“半成品混合提交”消失）。

## 非阻断建议（R8.1；P3，不计入判定，由作者自行决定是否吸收，可随实施或下一次 Tasks 精度修订落实）

| # | 位置 | 说明 | 建议归类 |
|---|---|---|---|
| S-37 | tasks T-A10 标准 5 | 见 §2：T-A10 的 6 条标准对 `getStageWorkspace` 无任何非空正向样例（r6.1 既有、R7 已接受，r6.4 未引入新回退）。建议标准 5 末尾恢复一句“已开始阶段返回原样例（如 j-collect 的 collect 两条投放、j-deliver 的六类块交付物）”，命令 5 不变；或实施者在同一用例内多断言一例（标准为下限）。不改 AC、不改命令、不加机制 | Tasks 措辞 / 实施提示 |

## 当前有效检查项（R8.1 勾选；唯一参与 Implement 前置判定；R8 的 25 项沿用其原判定、本轮只核未回退，V-02 为本轮重新判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** 沿用 R8；spec 零 diff、46 AC 独立计数；矩阵 46 / 46（本轮脚本差集 ∅）。
- ☑ **N-02 无未澄清歧义。** 沿用 R8；r6.4 只是任务切分，未改任何 AC 判据 / 目标 / 非目标；S-37 为任务级覆盖面建议，不是需求歧义；无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** 沿用 R8；tasks §3 无 diff；T-A09b 明写不是生产 guard、不是读侧推导、不改 schema / 生成物。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R8；plan r6.4 只补落地任务号与章节号更正，§5 验收对应表无 diff。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** 沿用 R8；plan 三处 hunk 均为记录 / 引用精度，§2.4 R-B 句与 §4 迁移表、§4.1 并存自洽（本轮重读）。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核 Analyze R10 §3 八项成立；T-A09b 修改范围 ↔ plan §2.4 R-B 句 ↔ T-A10 标准 5 ↔ T-A07 / T-A08 注 ↔ §8 R-B 行一致；矩阵五行 ↔ T-A09b 标准 1 / 2 的 AC 引用双向一致（脚本 0 例外）。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** 沿用 R8；`docs/**` 零 diff；S-33 更正后 designUI 引用（§6 :214）与真实文件一致；D-018 定稿语义无 hunk。
- ☑ **I-03 前端基线事实核对。** 本轮在本树（= `13a3373`）重核：`fixtures.spec.ts` 无 DataClient 依赖、五个顶层标题、三处收窄点、12 个 `not_started` 全部非空、介入锚 0 个落在 `not_started`、schema 接受空态——T-A09b 的前提全部属实。
- ☑ **I-04 文件边界与回滚一致。** T-A09b 写权限两份 JSON + `fixtures.spec.ts`；T-A10 已无 fixture 写权限；implementation-log §9 与 tasks §1-5 一致；壳方文件零修改。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 沿用 R8；矩阵 46 条最终任务与命令零变化；A09b 只作“部分前置”；18 条 e2e AC 最终命令均为 e2e，第二批 21 条单测 / 工程门命令不冒充。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 本轮重新判定：67 任务 / 102 h / 每项 0.5～2 h **0 例外** / 224 ↔ 224 逐任务 1:1 / 每条标准含 AC / 依赖全部向前无环 / 46 = 46 / 部分前置均为最终任务祖先 / 任务 ↔ 矩阵双向一致 / 215 标题 = 213 WI + 2 占位 / 路径隔离 / 10 已完成 + 57 未开始 / H 4×v2——全部成立；B-12（T-A10 越限 + 停工兜底）已由 T-A09b 0.5 h（fixture-only、依赖 T-A08、3 / 3）与 T-A10 2 h（无 fixture 写权限、依赖 T-A09 + T-A09b、6 / 6）关闭；§7 S-22 补“兜底不得预先吸收已知超额”。S-37 不影响粒度与 1:1。
- ☑ **V-03 静态守卫声称与真实脚本一致。** 沿用 R8；r6.4 未引入新守卫声称；T-A09b 命令 3 只用 `typecheck && lint`。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 沿用 R8 + 增量：r6.4 零新增机制；S-36 为实施提示非机制；R-D 仍不扩防御面。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** 沿用 R8；不变。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** 沿用 R8；T-A09b 不新建共享工具，只改数据与断言。
- ☑ **P-5 自动生成文件不手改（§5.5）。** T-A09b 明写不改 `types.ts` / 生成物；T-A10 仍经 `contract --check` 对拍。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** T-A09b 期望手写、用真实边界 schema；T-A10 标准 5 经真实 `getStageWorkspace` 读回。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令形态不变；无新工具 / 依赖 / 脚本。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** 第二批 DAG（A09b → A10；A22 → A22b；A23 / A24 独立）与 §6、implementation-log §9、README 一致；T-A09b 依赖 T-A08 即足（本轮核实其验收不需状态层）；不在本批的任务明列；H-x 本批只能形成 ①③、④ 待 v2 所有者。
- ☑ **C-02 契约闭环。** 沿用 R8；方法集 / schema / 生成物在 r6.4 零变化；T-A10 标准 4 仍覆盖 real 桩全部键。
- ☑ **C-03 事件与状态闭环。** 沿用 R8；T-A09b 不触及 activeRunId / overlay / 合并 / 排队；介入锚校正后仍可达（0 锚落在 `not_started`）。
- ☑ **C-04 场景定义足以稳定验证。** 沿用 R8；12 个空工作区与 empty 场景 / 覆盖缺样例的“带阶段的空集合”同形；两份 spec 的 `WI not-started seeds` 期望均来自手写表。
- ☑ **C-05 版本与定稿闭环。** 沿用 R8；T-A09b 保留 j-delivered final 三锚与快照、j-conflict 两版与 provisional 快照、done 阶段产物状态照旧（S-35 残留在台账未关）。
- ☑ **C-06 隐私与本地持久化自洽。** 沿用 R8；T-A09b 只改合成样例、不含私有数据。
- ☑ **C-07 视觉与工程纪律。** 沿用 R8；T-A23 只改章节号引用，令牌 / 不新增色值 / 点睛红只作边或图标不变。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 沿用 R8；r6.4 文字未引用 D-015；D-020～D-024 未带入。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **增量通过 vs 本批尚未实施**：本节 26 ☑ 表示 r6.4 拆分在 Tasks 层达标且 R8 已认可设计未回退；第二批 6 项**一行代码未写、一条测试未跑**，不得读作任何任务完成或 AC 验收。首批 10 项“已完成”仍 = 批次代码 Review 通过。
- **P-4**：代码级，批次 / 最终 Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，不声称任何 AC 已通过、不假绿。
- **Implement 前置**：当前有效轮次 = 本 §R8.1，26 ☑ ⇒ 第二批可在**本节被集成人提交后**开码（提交前仍 blocked）；以 **R8.1 提交后的 SHA** 作为第二批有效 Checklist 并登记到 `specs/README.md` 本 feature 行（本审核员不 commit、不改 README）。
- **H-x 交接**：八切片仍**全部未交付**；本批完成后 H-3·路由切片 / H-4 / H-2·标签可形成 ①③，② 届时填 R8.1 提交 SHA，④ 只能由 `integration/frontend-workbench-v2` 所有者登记；interface-handoff §5（含 §5-8）待 v2 接收方确认，本审核员不代签。
- **Gate 2 / Handoff**：不在本阶段；feature 未收敛（57 项未开始 + H 组外部阻塞）。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前必报“未收敛（外部阻塞）”；S-22 兜底继续有效且已明确不得预先吸收已知超额。
- **P3 台账**：R-A / R-C / R-E / R-F 未处理、未经 Walter 风险接受；R-B 部分定案（落点 T-A09b 校正 + T-A10 读回；残留 S-35 未关）；R-D 口径已定、未修；S-37 新增（T-A10 正向样例）。

## 下一步

1. 集成人原样提交本文件（R8.1），以该 SHA 作为第二批有效 Checklist，更新 `specs/README.md` 本 feature 行（blocked → in-progress）与 implementation-log §9 “②”。
2. 第二批按 §6 DAG 开码：T-A09b（fixture-only）→ T-A10 → T-A22 → T-A22b；T-A23 / T-A24 独立；Implement 首选 `openai/gpt-6-astra`（新会话、实施树）；每任务固定 commit + 逐命令输出摘要回报；任一任务实际超 2 h 先停下回报。
3. 作者可自行决定是否吸收 S-37（不需重过 Checklist；若只在实施中多断言一例则不改 tasks）。
4. H-x ④ 待 v2 集成树所有者登记；interface-handoff §5-8 待 v2 接收方确认。

## 结构核验证据（R8.1，只读）

```text
TARGET    8bf56b8aa3af37ea62f4a67eb07b3a054d81377b（parent 7b91a2c）；worktree D:/2030/Futures-AI-interaction-checklist-batch2-r81 @ review/workbench-interaction-batch2-checklist-r81；启动 git status clean
DIFF      git diff 7b91a2c 8bf56b8 --stat：specs/README.md | analyze.md | implementation-log.md | interface-handoff.md | plan.md | tasks.md；6 files, +128 −36；--name-only 排除 specs/ 后为空
ZERO      git diff 13a3373 8bf56b8 -- frontend = 0 行；spec.md / checklist.md（blob d8175986…= R8 原件）/ review-batch-a09a.md / converge-batch-a09a.md 相对 7b91a2c 零差异；spec AC 去重计数 46
CODE      fixtures.spec.ts 导入 = vitest + contracts/types.ts + 五份 fixtures/jobs/*.json（无 mock/index、无 createMockDataClient、无 readJobFixtures）✓；顶层 describe 五个 = WI jobs fixtures / WI deliverable fixtures / WI final only delivered / WI interventions fixtures / WI list coverage ✓；收窄点 :54 test.each / :129 deliverable 循环 / :199 final-only ✓
          types.ts：四分支数组无 .min()（:496–:511）、deliverable / finalSnapshot nullable（:443–:444）、previews record / reconciliations array（:525–:526）✓
FIXTURE   not_started (作业,阶段) = 12（j-cancelled C/P/A/D、j-collect P/A/D、j-process A/D、j-failed D、j-human D、j-running D）；当前 12/12 非空 ✓；十作业 previews 2 / reconciliations 2 ✓；interventions 落在 not_started 的锚 = 0 ✓
DOCS      designUI :214 “新增组件（D-016）：……来源徽、状态徽……” 在 §6（:207）；§8（:230）= 规范资产移植计划 ⇒ S-33 更正属实 ✓
TASKS     67 任务（父 66，+T-A09b）/ 102.0 h（A28·43 B7·10.5 C5·7.5 D3·5 E3·5.5 F7·12 G10·14.5 H4·4；父 101.5）/ 每项 0.5–2.0 h 0 例外 / 依赖全部向前、无环（0 例外）
          任务级差异（父→HEAD）：T-A07 st、T-A08 st（追加旁注）、T-A09b 新增、T-A10 est/dep/st/std/cmd；其余 62 任务 est/dep/st/std/cmd 零变化
          10×已完成 + 57×未开始；H 4×v2；标准 224 ↔ 命令 224 逐任务 1:1、编号连续（0 例外；父 221/221）；标准含 AC 0 例外
          矩阵 46 = spec 46（差集 ∅）；部分前置均为最终任务祖先（0 例外）；A09b ∈ AC-002-5 / 004-5 / 005-6 / 006-7 / 007-1；任务↔矩阵双向一致（0 例外）
          -t/-g 全文件 215 = 213 WI + 2 占位（父 214）；任务命令内标题 162（父 161）；"WI not-started seeds" 命令两处 :319 fixtures.spec.ts / :342 job-state-read.spec.ts
          非 jobs 路径仅 T-A09 命令 3；e2e AC 18 条均 test:e2e e2e/jobs；第二批 6 项 7.0 h、21 条命令（A09b 3 + A10 6 + A22 3 + A22b 3 + A23 3 + A24 3）
          A09b deps = {T-A08}；A10 deps = {T-A09, T-A09b}；排序 T-A09 < T-A09a < T-A09b < T-A10 ✓
B-12      T-A09b 0.5 h fixture-only（无代码 / schema / 生成物）+ T-A10 2 h（预计行无括注、无 fixture 写权限、无停工兜底表述）⇒ 粒度 0 例外，关闭
O-R10-1   T-A10 标准 5 去掉“已开始阶段返回原样例”：非 R-B 口径判别器、非 B-12 实质、r6.1 既有覆盖面 ⇒ P3 S-37，非阻断
AGENTS    §2 第 6 步 0.5–2 h / 任务；§5.1 / §5.2 / §5.6 / §5.7；§6 通道：A = claude-fable-5-1 via anthropic（bridge 对 fable 本轮 exit 1 = provider / invocation error、未确认 quota；anthropic/fable exit 0；只换通道不换模型；未改配置）
WRITE     唯一改动仓库文件 specs/workbench-interaction/checklist.md；临时文件 3 个在独占 Temp/wi-batch2-01a18388-i8ukv6xl/（checklist-r81-*）；git diff --check 见回复；不 commit
```

---

# R8（2026-10-29，第八轮：第二批 r6.3 派工准备的限定范围定向复核；编号区别于 analyze.md 的「Analyze R8 / R9」，本节是 **Checklist R8**；历史快照，复选框已改为文字符号，不参与当前判定——其 25 ☑ / 1 ☐ 为 R8 时点对 `8ad5e28` 的结论，B-12 已由 r6.4 拆分并经 §R8.1 增量复核关闭，当前有效勾选见 §R8.1）

## 基线与范围

- **审查对象（固定）**：本工作树 `D:/2030/Futures-AI-interaction-checklist-batch2`，分支 `review/workbench-interaction-batch2-checklist`，HEAD = `8ad5e28691475097cdef5cd2bad67ef902f062f7`（`docs(workbench-interaction): scope second batch fixture and binding refinements`），启动时 `git status --short --branch` 只有分支行、clean。真实 diff `git diff 0920004..8ad5e28`：6 文件 +136 / −29——`specs/README.md`（本 feature 行）、`analyze.md`（追加 Analyze R9）、`implementation-log.md`（页首当前状态行、§7 派工表一行、§8 R-B / R-D 行与 r6.3 补记、新增 §9）、`interface-handoff.md`（页首当前状态行、§3 `session.ts` 行、§5-8）、`plan.md`（页首 r6.3 记录、§1 徽标句、§2.1 / §2.3 `bindRouter`、§2.4 fixture 句 R-B）、`tasks.md`（页首 r6.3 派工块、§0.0 r6.3 复核段、T-A07 / T-A08 修改范围注、T-A10 范围 + 标准 5 / 命令 5、T-A12 / A13 / A14 / A17 / A18 / A20 / A22 / A22b / A23 / A24 状态行、T-A22b / T-A23 / T-A24 修改范围【r6.3】、§5 矩阵 AC-002-5 行、§6 r6.3 行）。**独立核实的零差异**：`git diff 13a3373 8ad5e28 -- frontend` 为 0 行（源码 = 首批受审 `13a3373`）；`spec.md`（blob `102af73b…`）与本文件（blob `7c219c07…`，即 R7 原件 `9acf3de`）相对 `0920004` 零差异；`review-batch-a09a.md` 相对 `af95b66` 零差异；首批 10 项的“已完成”状态行在 `0920004..8ad5e28` 无改动（状态行 diff 只落在 11 个未开始任务）。
- **重读**（本轮开始时重新读取，不依赖会话记忆）：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`、`docs/designUI.md` §2.4 / §6（:214）/ §8、`docs/interaction.md` §3（重跑口径）、冻结 spec v1.1（46 AC 独立计数）、plan.md（r6.3：§1、§2.1、§2.3、§2.4 fixture 句与样例表、§4 迁移表、§4.1、§6）、tasks.md（页首、§0.0、§1、§2、§2a、§3、T-A07 / T-A08 / T-A09 / T-A10 / T-A22 / T-A22a / T-A22b / T-A23 / T-A24 / T-B01 / T-B04 / T-B05、§5、§6、§7）、analyze.md「Analyze R9」全文（与 R8 对照）、本文件 R7 全文、`review-batch-a09a.md` 原件（R-A～R-F、O-1～O-6）、`implementation-log.md` §8 / §9、`interface-handoff.md` §3 / §5、`converge-batch-a09a.md` §4 O-2、`specs/README.md` 本 feature 行。
- **真实代码事实（本树 = `13a3373`，逐文件读；不以作者 §0.0 摘要代替）**：`frontend/src/shared/components/Badge.vue`（`defineProps<{ state?: 'ok'|'warn'|'bad'|'sample' }>`，`labels = {ok:'正常',warn:'警告',bad:'异常',sample:'样例'}` 固定文案，模板只渲染 `labels[state]`，**无插槽、无文案 / 图标 prop**；样式只用 `--fai-status-*` / `--fai-text-secondary` / `--fai-type-tag` / `--fai-radius-base` / `--fai-space-grid-gap` 令牌）；`frontend/src/design/generated/tokens.css`（上述令牌与 `--fai-accent-red` / `--fai-text-primary` / `--fai-text-muted` 均真实存在）；`frontend/src/main.ts`（`useAgentStore(pinia)` 在 `app.use(pinia).use(router).mount` 之前显式传 pinia 取 store——T-A22b `useSessionStore(pinia)` 的先例成立）；`frontend/src/app/router.ts`（无 `beforeEach`、无 `jobs` 占位）；`frontend/src/contracts/types.ts`（`StageWorkspaceSchema` 四分支的 `uploads / sources / series / artifacts / revisions / derivedValues` 均为无 `.min()` 的 `z.array`，`DeliverWorkspaceSchema.deliverable / finalSnapshot` 均 `.nullable()` 且 superRefine 对 `deliverable=null` 只要求 `finalSnapshot=null`，`JobDetailFixtureSchema.previews` 为 record、`reconciliations` 为 array——**空态与 `deliverable=null` 无需改 schema**；`ArtifactSchema` 现有 refine 只有 `pendingMerge ⇒ overlayRev` 单向）；`frontend/src/contracts/mock/index.ts`（`readJobFixtures()` 已存在、尚无调用方，`createMockDataClient()` 每次 `readScenario()`）；五份 `fixtures/jobs/*.json` 用脚本只读复算：十作业的 status / currentStage / 四阶段态与 plan 样例表逐行一致；阶段态 `not_started` 的 (作业, 阶段) **恰 12 个**——j-collect{process, analyze, deliver}、j-process{analyze, deliver}、j-failed{deliver}、j-cancelled{collect, process, analyze, deliver}、j-running{deliver}、j-human{deliver}——与作者列表完全相同；这 12 个工作区目前全部带完整内容（collect 2 投放 / 1 产物 / 1 修订，process 2 源 / 2 序列 / 1 产物 / 1 修订 / 1 派生值，analyze 1 产物 / 1 修订，deliver 1 产物 / 1 修订 + `deliverable` draft 空块对象、`finalSnapshot=null`）；每作业 `previews` 2、`reconciliations` 2；`interventions.json` i-seed-1～6 的 (jobId, stage) = j-collect/collect（R）、j-process/process（R）、j-running/analyze（R）、j-deliver/deliver（R）×2、j-delivered/deliver（D），**全部落在已开始阶段**；`uploads.json` 两条待归属、其一 `quarantined` 带 `quarantineReason`。`frontend/tests/unit/jobs/fixtures.spec.ts`（260 行）真实阅读：手写十行 `expected` 状态表已存在；`test.each(Object.keys(details))` 与 `WI deliverable fixtures` 中 `for (const [id, delivery] of Object.entries(deliveries))` 两个循环对**全部**作业断言内容，`WI final only delivered` 对非 j-delivered 断言 `deliverable` 为 draft 三锚 null——即 R-B 收窄恰须改这三处；`contract-version.spec.ts` 只读 `jobs.json` 标题与内置 `job-detail` 整体相等，不受 R-B 内容校正影响。
- **只读参照（消费方）**：`D:/2030/Futures-AI-workbench-v2` @ `76abe92`（clean）：plan §7.3 H-4 行（“交接登记须写明是否含可在测试中使用的公开设置方式；只经路由守卫设置时 S1-ctx 条件依赖 H-3 路由切片；壳不为此新增测试专用 setter 或抽象”）、tasks §1.2 H-3 / H-4 行、§7.13 S1-ctx 行。未复制、未写入。
- **审核员与通道**：A = **claude-fable-5-1 via anthropic**，新开独立会话、独立 worktree，与 Implement 首选 `openai/gpt-6-astra` 异模型，与本轮文档作者 claude-opus-5-5 隔离。通道原因（脱敏）：协调器本轮对 `claude-bridge/claude-fable-5-1` 的最小真实调用 exit 1，失败类别 **provider / invocation error（未确认为 quota / 限额）**；同模型 `anthropic/claude-fable-5-1` exit 0，本轮实际任务走该通道。按 AGENTS §6 规则 2 只换通道不换模型；未改任何 provider / key / 路由 / 全局配置；不编造本窗口限额证据；不因审核结果换模型。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试、未启动子 agent / 服务 / 下载、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写入任何其他 worktree、未修改 plan / tasks / analyze / implementation-log / interface-handoff / spec / README / 代码 / fixtures / tests。结构复算用 `python -` 标准输入一次性脚本只读完成，日志与本节草稿写在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/`（`checklist-r8-structure.log`、`checklist-r8-section.md`；非项目产物、不入库、不清理共享 tmp）。唯一写入的仓库文件为本文件（新增 §R8、页首两处说明、把 §R7 的 26 个 `[x]` 改为 ☑ 文字并在其标题补“历史快照”；R7 其余内容未动）。

## 结论（R8）：**未通过**（定向；1 项 **P2 = B-12**（T-A10 任务粒度：R-B 并入后按作者自报 2 + 0.3～0.5 h，越出 AGENTS §2 第 6 步“0.5～2 h / 任务”上限，V-02 不能勾）；**0 P1**；4 项 P3 建议 S-33～S-36 不阻断）——**26 项当前有效检查项中 25 ☑、1 ☐（V-02）**。除 B-12 外，r6.3 的五处精度（T-A23 自制徽标、H-4 `bindRouter`、R-B fixture-only 落法本身、R-D 口径、T-A24 边界）**设计质量通过**，不需回流 Clarify / Gate 1，不需改 spec / 46 AC；B-12 的最小关闭只是一次 Tasks 层拆分（见阻断表），关闭后由 A 做**增量**复核（只核拆分落点与结构数字，不重审本节已通过项）。

本结论的边界（必须同时成立，不得单独引用）：

1. “设计质量通过”只针对 r6.3 文档精度与可实施性；第二批 5 项 **均未实施**，46 AC 最终验收仍 **0**，首批 10 / 66 的“已完成”= 本批代码 Review 通过（`af95b66`）而非 AC 验收；feature **未收敛**（56 项未开始 + H 组 `blocked_by: frontend-workbench-v2`）。没有任何产品测试被本轮运行；“未写出来的测试”不是证据。Gate 2 / Handoff 不在本阶段。
2. 本审核员不代 Walter 做风险接受（R-A / R-C / R-E / R-F 仍为“未处理、未经风险接受”，R-D 的“不扩防御面”是作者在 AGENTS §5.1 内的保守选择而非风险接受），不代 v2 接收方签收 interface-handoff §5（含新增 §5-8），不代 v2 集成树所有者登记任何 H-x ④。
3. 按 AGENTS §2 第 8 步，Implement 前置 = 当前有效轮次全部勾选；本轮 V-02 ☐ ⇒ **第二批任何任务（含与 B-12 无关的 T-A22 / T-A22b / T-A23 / T-A24）在 B-12 关闭并由 A 增量复核补勾前不得开码**。这是流程后果，不是对那四项设计的否定。

## 独立核验（不照单全收作者结论）

### 1. 基线事实与零差异（对应协调器要求 ①⑥ 的事实部分）

| 项 | 作者声称 | 独立核实 | 判定 |
|---|---|---|---|
| 源码 = 受审代码 | 本树代码与 `13a3373` 相同 | `git diff 13a3373 8ad5e28 -- frontend` 0 行 | ✓ |
| 冻结 spec / 既有 Checklist / 审核原件未动 | spec、checklist（blob `7c219c07…`）、`review-batch-a09a.md` 零 diff | 三者分别相对 `0920004` / `af95b66` 零差异；spec 46 AC 独立计数（5+5+6+5+6+8+5+4+2） | ✓ |
| 首批 10 项状态未改 | “10 / 66 已完成”不变 | 10 条 `**已完成（batch-a09a…`状态行在 diff 中无改动；状态行改动只在 T-A10 / A12 / A13 / A14 / A17 / A18 / A20 / A22 / A22b / A23 / A24（11 个未开始任务） | ✓ |
| B-9 补充：`Badge.vue` 基线事实 | 只接受 `state`、固定文案、无插槽 / 文案 prop | 真实文件 23 行，与声称完全一致（见“基线与范围”） | ✓ 属 tasks §7 “基线实况与任务文字不符”一类，作者已按 §7 修订 + 重跑 Analyze（R9），本轮即 A 复核 |
| B-10 补充：`useAgentStore(pinia)` 先例 | 在 `app.use(pinia)` 之前显式传 pinia | `main.ts` 第 14 行，属实 | ✓ |
| fixture 事实 | 12 个 `not_started` 工作区带完整内容；介入锚全在已开始阶段；schema 已接受空集合 / `deliverable=null` | 脚本复算 12 / 12 同集合；6 / 6 介入锚在已开始阶段；`types.ts` 无 `.min()`、`.nullable()` 属实 | ✓ |
| upstream | main `cf8e11b` 相对 `90187f7` 只改 `specs/README.md` 与 frontend-workbench 文档 / 截图 | 本会话**未 fetch、未读 `cf8e11b`**，此项沿用作者 / 协调器记录；对本轮判定无影响（源码零 diff 已独立核实） | — 沿用 |

### 2. 需求边界（是否需要 Clarify / 重过 Gate 1）

| r6.3 精度 | 归属判断 | 结论 |
|---|---|---|
| R-B：内置种子 `not_started` 工作区为空（fixture-only） | plan 样例表只约束 status / currentStage / 阶段态 / 关键产物；S-13 “未开始 / 空 = 空集合”表达既有；AC-002-5 / 004-5 / 005-6 判据不变 | 数据口径，不回流 |
| R-D：不加五处跨字段 refine | 既是首批 A 自己给出的二选一之一（“在 tasks 明示‘由状态层保证’”）；未扩机制 | 不回流 |
| H-4 `bindRouter(router)` | R7 已审“`registerJobRoutes` 注册 `afterEach`、无公开 setter”；新增的只是把“守卫在哪个模块注册”落为一个公开成员名，行为 / 时机 / 只读语义不变 | 接口精度，不回流 |
| T-A23 自制徽标 | AC-001-5 / 003-6 / 006-8 的“文案 + 图标、契约同源”不变；只是实现载体从“复用 Badge.vue”改为“自制、复用令牌” | 基线事实修正，不回流 |
| T-A24 `'\n'` 切行 / 空串 0 行 / 任一侧 > 2000 行直接摘要 | plan §6 “上限 2000 行，超出显示变更摘要”的边界口径 | 不回流 |

**结论**：与 Analyze R9 一致——**无需求变更**；这是本审核员独立判定，不是采信作者自报。

### 3. 五项限定范围定向判定（协调器要求 ①～⑤）

- **① T-A23（基线事实 + 自制徽标）**：`Badge.vue` 确实无法承载契约文案（固定 `labels`、无插槽），且 `shared/**` 不属本 feature（tasks §1-5）——“复用 Badge.vue”在基线上**不可实施**，自制是唯一在所有权内的路径，不是过度设计。修改范围写明：三个 SFC 在 `jobs/components/`、不导入 / 不改 Badge.vue、只复用 `var(--fai-*)` 令牌与样式写法、点睛红只作边 / 图标（plan §1）、文案 / 图标只来自契约常量、不新增色值 / 玻璃（标准 3 + `check --only colors / glass`）、不新增共享抽象（上传状态复用 ArtifactStatusBadge 渲染方式）。AC-001-5（组件部分最终）/ AC-003-6 / AC-006-8 的判据与标准 / 命令未变。designUI §2.4 “状态徽不得只靠颜色”与 §6 :214 “来源徽、状态徽……移植 / 自制决策随实施登记”成立（作者写作“§8”，为引用章节号笔误 → S-33）。**最小且在职责边界内，可实施。**
- **② H-4 / T-A22b `bindRouter(router)`**：设计为 setup store 私有 `ref` + 对外 `context`（computed，Pinia 类型层 `readonly`，标准 3 的 `@ts-expect-error` 可成立且由命令 3 的 `typecheck` 兜住未用指令）+ 唯一额外成员 `bindRouter(router: Router): void`，只调用 `router.afterEach` 注册守卫、目标判定在 store 内、不接受 `JobContext`、不是 setter；`registerJobRoutes(router, pinia)` 在 addRoute 后调用 `useSessionStore(pinia).bindRouter(router)`（先例 = `main.ts` 的 `useAgentStore(pinia)`，在 `app.use(pinia)` 前可用）。私有 ref 不从 setup 返回 ⇒ 不进入 `$state`，`$patch` 也触不到；不顶层 `useStore`、不用 WeakMap / 注册表 / provide、不导入 `routes.ts` / `agent/**`（与 v2 在 `send` 体内调 `useSessionStore()` 不成环）、不加 navigation failure / 重复注册 / 竞态兜底（基线 router 无 `beforeEach`，R7 S-28 旁注口径延续）。`afterEach` 按注册顺序同步执行 ⇒ 标准 2 “测试在 `registerJobRoutes` 之后注册的 `afterEach` 读到 null”成立；`/jobs/:id/:stage?` 缺省 stage 时 `StageSchema` 不通过 ⇒ null，待 T-B04 `router.replace` 补成 currentStage 后再设置，与 plan §2.1 一致。与 v2 H-4 消费要求对拍：公开设置方式登记为“无”（§5-8），S1-ctx 条件依赖 H-3 路由切片成立，壳不加测试 setter。**旁注（非发现）**：`bindRouter` 接受任意 `Router`，用桩 router 触发守卫在能力上等价于 R7 已审的 `registerJobRoutes(桩 router, pinia)`，不是新增写面；“无公开设置方式”的登记仍准确。**可实施，符合 H-4，无新增行为 / 安全复杂度。**
- **③ R-B 落法（归 T-A10，fixture-only）**：选定路径与首批 A 自己的最小修复建议（“未开始阶段改为空 `artifacts[] / revisions[]`，deliver 空态 `deliverable=null`”）一致，并补了“不留孤立引用”的 `previews={}` / `reconciliations=[]`，仍在该建议范围内；**不按阶段态在读侧过滤**是正确的——plan §4 迁移表“无 activeRunId 重跑 s：下游 → not_started，s 与下游各生成 draft 新修订”使“未开始 = 空”不是运行期不变量，读侧规范化会与之冲突；`createJob` 初始空产物（§4.1）不受影响。保留 `jobs.json` / `interventions.json` / `uploads.json`、ID、已开始阶段内容、done 阶段产物状态；schema / 生成物 / 样例表 / spec 不改。`fixtures.spec.ts` 的改法（按既有手写十行表分情况、三处循环收窄、新增 `WI not-started seeds`、不删用例、不放宽 schema 与已开始样例断言）与真实测试文件结构吻合（见“基线与范围”）。标准 5 ↔ 命令 5 一一对应；AC-002-5 / 004-5 / 005-6 “部分前置”且矩阵 AC-002-5 行已加 A10，A10 是最终任务 T-B05 的祖先（B05 ← B04 ← B01 ← A10，脚本核实）；T-A10 依赖 T-A09（← T-A08 ← T-A07，R-B 所需 fixture 已在祖先内）。**唯一不成立的是任务粒度**：T-A10 在 r6 已是 2 h 顶格（状态层 + 三读方法 + 九场景 + client / methods / real 桩 / 接线 + 生成物 + 两份新 spec），r6.3 又并入“手改 105 KB + 42 KB 两份 JSON 的 12 个工作区与 2 个作业的 previews / reconciliations、三处断言循环改写、两份 spec 各加一个 `WI not-started seeds`”，作者自报 +0.3～0.5 h 却仍标 2 h，并以“实际超 2 h 再停下拆分”兜底——这是把超额预先写进任务再靠实施期停工处理，即“硬塞”。R-B 工作只依赖 T-A08 的 fixture 与既有 schema、与状态层零耦合、可独立用 `fixtures.spec.ts` 验收，首批 A 已建议“或登记为独立 0.5 h fixture 任务”。→ **B-12（P2，Tasks 层拆分）**。
- **④ R-D 口径**：本批不加 schema refine / 入口跨字段校验，各项（①→T-A14 / T-A18，②→T-A12，③→T-A17，④→T-A20，⑤→T-A12 / A13 / A17 / A20）由对应写方法按构造保持、以既有读回断言覆盖，T-A10 不接管领域写入；明写“如认为必须加，按 AGENTS §5.1 先报 Walter”。这是在 A 给出的二选一内选了不扩机制的一侧，守住 §5.1 边界，没有私自扩防御面，也没有私自把 R-D 记为已关闭（§8 写“口径已定、未修”）。R-A / R-C / R-E / R-F 在 implementation-log §8 与 tasks 状态行均保持“未处理”，**无私自风险接受**。✓
- **⑤ T-A24 边界与 T-A10 未回退**：`'\n'` 切行、空串 0 行（`''.split('\n')` 得 `['']`，明示 0 行是必要口径）、两侧 ≤ 2000 逐行、任一侧 > 2000 直接摘要（两侧行数）不进 LCS、以 2000 / 2001 各一例断言形态、不以耗时断言、不引入依赖——与 plan §2.2 / §6 一致，标准 1 / 2 ↔ 命令 1 / 2 不变。T-A10 修改范围 diff 逐句对拍：模块级唯一共享状态（S-27）、单一 `commit(mutator)` 深拷贝 → 边界校验 → 整体替换、读 API 返回副本、九场景读行为、`client.ts` / `methods.ts` / `real/index.ts` 桩 / `mock/index.ts` 接线、生成物、两份 spec——**全部原样**，只追加了“不实现 T-A11 / T-A12 起 / T-A18；`commit` 本任务无生产调用方、原子性由 T-A17 标准 2 验证”（既有安排，R5 S-24），无回退。✓

### 4. 工程准则（AGENTS §5）与所有权

- §5.1：r6.3 未新增任何运行时机制或校验；`bindRouter` 是把已审守卫的注册点落到 store 内的最小入口；R-B 明示“不是生产 guard、不是读侧推导”；R-D 明示不扩防御面。
- §5.2：R-B 的跨字段关系只在测试断言层；`jobFixtures` 入口校验仍是既有一次边界 parse（T-A09）。
- §5.3：`bindRouter` 有且只有一个生产调用方（`registerJobRoutes`），但它承载“写权限只在 store 内”这一可命名概念，是 H-4 “无公开 setter”约束下的必要而非提前抽象；自制徽标三个组件对应三组契约常量，不建共享抽象。
- §5.6：T-A22b 测试只经真实 memory-history router + `registerJobRoutes` + 真实 Pinia 导航；R-B 新增用例期望来自手写状态表；T-A24 期望手写不重写算法。
- §5.7：命令全部沿用既有 `pnpm -C frontend {contract,check,typecheck,lint,test:unit}` 形态；不新增工具 / 依赖。
- 所有权：implementation-log §9 逐任务写权限与 tasks §1-5 一致；`shared/**`、`app/**`、`agent/{store,AgentDock,AgentDrawer,CotTimeline}`、`scripts/**`、`package.json` / 锁文件、`backend/`、`docs/`、spec / checklist / 审核原件均明列不改；T-A10 R-B 另许的两份 JSON 与 `fixtures.spec.ts` 在 `contracts/mock/**` / `tests/unit/jobs/**` 内。

### 5. 任务结构独立复算（脚本，只读；作用于 HEAD `8ad5e28` 并与 `0920004` 对比）

- **66 个任务**、编号唯一、排序规则成立；合计 **101.5 h**（A 27·42.5 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4）；每项标称 1～2 h（max 2.0 / min 1.0，**但 T-A10 实际内容越限，见 B-12**）；依赖（去括号说明后）全部向前、无环（0 例外）；与 `0920004` 相比预计 / 依赖行 0 变化。
- 状态：**10 × 已完成（T-A01～T-A09、T-A09a）、56 × 未开始**，无其他值；H 4 / 4 另带 `frontend-workbench-v2`。
- 完成标准 **221** ↔ 验证命令 **221**，逐任务 1:1（0 例外；`0920004` 为 220 / 220，唯一变化 = T-A10 +1）；每条标准含 AC 引用（0 例外）。第二批五任务：T-A10 6 / 6、T-A22 3 / 3、T-A22b 3 / 3、T-A23 3 / 3、T-A24 3 / 3 = **18 条**命令。
- §5 矩阵 46 行 = spec 46 AC（差集 ∅）；“部分前置”均为最终任务祖先（0 例外，含新加的 AC-002-5 ← A10）；任务正文 AC 引用 ↔ 矩阵双向一致（AC-009-1 工程门除外，0 例外）。
- `-t` / `-g` 标题 **214** = 212 `WI` + 2 §1 占位符（R7 为 213 = 211 + 2；+1 = T-A10 命令 5 `WI not-started seeds`）；单测 / e2e 路径全部在 `tests/{unit,component}/jobs/**`、`e2e/jobs/**`，唯一例外仍是 T-A09 命令 3 的三份既有契约测试（有意整文件跑）。
- spec 标“端到端”的 AC 共 **18** 条，最终命令全部为 `test:e2e e2e/jobs/…`；第二批 18 条命令全为 `test:unit` / 工程门，不冒充任何 e2e 最终验收。
- H-x：tasks §2a / interface-handoff §1 / implementation-log §9 一致——本批完成后 H-3·路由切片、H-4、H-2·标签只能形成生产方 ①③；② = 当前有效 Checklist（R7 `9acf3de`，或本节被提交后的 SHA）；**④ 只能由 v2 集成树所有者登记**，三份文档都未以生产集成树 SHA 代填 ④；H-1 仍“待消费方集成（未交付）”。

### 6. 未回退核对

diff 的删除行只落在 tasks 页首 / 状态行 / T-A07·A08·A10·A22b·A23·A24 修改范围 / T-A10 原标准 5 命令 5（顺延为 6）/ §5 AC-002-5 行 / plan §1·§2.1·§2.3·§2.4 单句 / interface-handoff 页首·§3 一行 / implementation-log §8 两行。plan §2.4 `Deliverable` / `FinalSnapshot` / `Revision`、§3 持久化、§4.5～§4.7、rerun 迁移表、动作矩阵、九场景表、十样例表、tasks §3 范围边界、T-A17 / T-F01 / T-F07 / T-G06、D-018 定稿语义（draft / final 三锚、不自动、不可撤销）、S-15 / S-23、B-11 (a) 无登记机制、R7 S-27～S-32 落点——**全部原样**。

## 阻断项（R8）

| # | 严重度 | 位置 | 问题 | 受影响 AC | 最小关闭要求 | 分类 |
|---|---|---|---|---|---|---|
| **B-12** | **P2**（Tasks 粒度违反 AGENTS §2 第 6 步 / `templates/tasks.md` “0.5～2 h / 任务”；不是设计缺陷） | tasks.md T-A10 预计行（“2 h（r6.3：R-B … 估约 0.3～0.5 h 并入；实际超 2 h 按 §7 S-22 停下回报…）”）、修改范围末段【r6.3 R-B】、标准 5 / 命令 5；T-A07 / T-A08 修改范围【r6.3】注（“由 T-A10 校正”）；implementation-log §8 R-B 行、§9 T-A10 写权限；analyze.md R9 O-R9-1 | T-A10 在 r6 已是 2 h 顶格任务，r6.3 把 R-B（两份 JSON 12 个工作区 + 2 作业 previews / reconciliations 手改、`fixtures.spec.ts` 三处循环收窄、两份 spec 各加 `WI not-started seeds`）并入而不调预估，作者自报净增 0.3～0.5 h ⇒ 实际 2.3～2.5 h，再以“超 2 h 实施期停工拆分”兜底。R7 V-02 的判定依据之一是“每项 ≤ 2 h：0 例外”，此处按作者自己的数字已不成立；R-B 与状态层零耦合、可独立验收，首批 A 已建议“或登记为独立 0.5 h fixture 任务”。出错链：实施者在同一任务 / 同一 commit 里混做 fixture 手术与状态层核心 → 超时停工时产生半成品混合提交，fixture 校正与读方法无法分别 Review | AC-002-5 / 004-5 / 005-6（部分前置；不改判据） | **Tasks 层拆分（唯一路径，不改 plan / spec / AC）**：(1) 新增一个 **fixture-only 任务**（如 `T-A09b R-B 种子校正`，**0.5 h**，依赖 T-A08，无代码 / schema / 生成物改动；修改范围 = 现 T-A10【r6.3 R-B】段原文；完成标准 = ① 12 个 (作业, 阶段) 种子为规定空工作区、j-cancelled `previews={}`、j-collect / j-cancelled `reconciliations=[]`，`fixtures.spec.ts` 全文件通过且 T-A07 / T-A08 既有五个标题仍全部匹配，新增 `WI not-started seeds`（AC-002-5 / 004-5 / 005-6 部分前置；R-B）② 工程门；命令 = `test:unit tests/unit/jobs/fixtures.spec.ts` 与 `typecheck && lint`）；(2) T-A10 恢复 r6.1 范围（删【r6.3 R-B】段的 fixture 改动许可，只保留“`getStageWorkspace` 原样返回、不按阶段态过滤”一句），依赖改为 T-A09、T-A09b，预计 **2 h** 不带并入说明；标准 5 收窄为“12 个未开始 (作业, 阶段) 经真实 `getStageWorkspace`（normal / job-running、新建 client）返回空工作区、已开始阶段返回原样例”，命令 5 = `test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI not-started seeds"`（建议读侧标题与 fixture 侧区分，如 `WI not-started seeds read`，见 S-34）；(3) T-A07 / T-A08 注、plan §2.4 R-B 句尾、implementation-log §8 R-B 行 / §9 写权限、tasks 页首 r6.3 块与 §6 r6.3 行、矩阵 AC-002-5 行（A09b 加入部分前置）同步到新任务号；(4) 按 AGENTS §2 第 7 步重跑 Analyze（R10，只读）并复算结构（预期 67 任务 / 102 h / 223 ↔ 223 或 222 ↔ 222 视标准数而定，由作者如实登记）；(5) 提交后 A 新会话做 **R8.1 增量复核**（只核拆分落点、新任务 1:1 / AC 祖先 / 依赖、结构数字；本节其余 25 项不重审）并补勾 V-02 | Tasks 可修正 |

## 非阻断建议（R8；均为 P3，不计入判定，由作者自行决定是否吸收；可随 B-12 关闭时一并落实）

| # | 位置 | 说明 | 建议归类 |
|---|---|---|---|
| S-33 | tasks T-A23 修改范围【r6.3】、plan §1【r6.3】、analyze.md R9 §2 T-A23 行 | “designUI §8‘来源徽、状态徽……移植 / 自制决策随实施登记’”——该句在 `docs/designUI.md` **§6**（:214，“新增组件（D-016）”），§8 是“规范资产移植计划”。章节号笔误，实质成立 | 措辞 |
| S-34 | tasks T-A10 标准 5 / 命令 5 | 标准 5 的两部分（fixture 种子空态；真实 `getStageWorkspace` 读回）分属 `fixtures.spec.ts` 与 `job-state-read.spec.ts`，而文字只在 fixtures.spec 侧点名 `WI not-started seeds`，命令 5 却对 job-state-read.spec 用同一 `-t`。vitest `-t` 无匹配会失败，故不会假绿，但应写明两份 spec 各有一个该标题（或读侧另起 `WI not-started seeds read`）。随 B-12 拆分后自然分到两任务，顺带消解 | Tasks 措辞 |
| S-35 | implementation-log §8 R-B 行；tasks T-A07 / T-A08 状态行 | R-B 原文还包含“j-delivered 上游三产物仍 draft”；r6.3 明确“done 阶段产物状态照旧（不把 draft 升为 confirmed）”——这是有意的范围排除，但 §8 R-B 行写“r6.3 已定案、待 T-A10 实施”易被读成 R-B 整体随 T-A10 关闭。建议该行加“残留：done 阶段上游产物状态口径未定，待 T-A20 成功终态（‘s 与下游 done’）定义产物状态时一并处理”，使 R-B 在 Review 台账中保持部分未关 | 登记精度 |
| S-36 | tasks T-A24 修改范围【r6.3】；plan §6 | “摘要（两侧行数）”是 plan §6 “变更摘要”的最小形态，可接受；建议在 `diff.ts` 的返回类型上给摘要分支一个具名判别（如 `kind: 'lines' \| 'summary'`），让 T-F05 消费时不靠长度判断。实施细节，不改标准 | 实施提示 |

## 当前有效检查项（R8 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 零 diff（blob `102af73b…` 相对 `0920004` 不变），46 条 AC 独立计数无误；tasks 矩阵 46 / 46（独立脚本比对，差集为空）。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；r6.3 五处精度（§“独立核验” 2）逐项判定为既有需求与既有 plan 意图内的数据口径 / 接口精度 / 基线事实修正，无一改变 AC 判据或 §2 目标 / 非目标；R-B 已从“二选一”收敛为唯一路径（fixture-only），无残留歧义；无需回流 Clarify。S-33～S-36 为措辞 / 登记精度，不是需求歧义。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；tasks §3 未改；本批明确不提前实现 T-A11 / T-A12 起 / T-A18 / T-A22a / B 组；未把导航 / 顶栏投放 / 抽屉标签（v2）或 D-017 / D-019～D-024 带入。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R7；plan r6.3 只在既有落点上补精度（§1 / §2.1 / §2.3 / §2.4），§5 验收对应表未改；“复用 Badge.vue”这一不可实施落点已修正为自制徽标。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** plan r6.3 五处 hunk 逐处核对：全部是数据口径 / 接口精度 / 基线事实，无一与 R-001～R-009 / 46 AC 相悖；R-B 句与 §4 迁移表、§4.1 `createJob` 并存且自洽（本轮独立推演）。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核 Analyze R9 §3 九项一致性检查成立；T-A08 标准 2 “其余都是 draft”与 R-B `deliverable=null` 的读法已在 T-A08 注写明；矩阵 AC-002-5 行与 T-A10 标准 5 的 AC 引用双向一致；interface-handoff §3 / §5-8 ↔ plan §2.1 / §2.3 ↔ T-A22b 一致。B-12 是任务粒度问题，不是文档间冲突；S-34 是措辞精度。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** D-018 §1 / §2 原样（§“未回退核对”）；interaction §3 重跑口径与 plan §4 迁移表一致，R-B 不在读侧推导正是为了不与之冲突；designUI §2.4（状态徽不只靠颜色）与 §6 :214（自制决策随实施登记）支持 T-A23 自制徽标（S-33 仅章节号笔误）；main `cf8e11b` 的 D-020～D-024 文档对本 feature 不加 AC（R7 §3 口径不变，此项沿用作者记录）。
- ☑ **I-03 前端基线事实核对。** 本轮在本树（= `13a3373`）真实文件逐项核对 §0.0 r6.3 复核 ②③④：`Badge.vue` 固定文案无插槽、`main.ts` 先例、12 个 `not_started` 工作区带内容、介入锚全在已开始阶段、schema 接受空态——全部属实；作者按 tasks §7 “基线实况与任务文字不符 → 修订 + 重跑 Analyze + 经 A 复核”处理，本轮即该复核。
- ☑ **I-04 文件边界与回滚一致。** plan §1 唯一修改者行未变；T-A23 不导入 / 不改 `shared/**`；T-A22b 不改 `app/router.ts`、`session.ts` 不导入 `agent/**`；T-A10 R-B 另许文件在 `contracts/mock/**` / `tests/unit/jobs/**`；implementation-log §9 写权限与 tasks §1-5 一致；壳方文件零修改。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 矩阵 46 条映射未改（最终任务与命令不变）；T-A10 标准 5 / T-A22b / T-A23 / T-A24 均只作“部分前置”（T-A23 对 AC-001-5 为“组件部分最终”，人工部分仍 T-G10 M-01）；18 条 e2e AC 最终命令均为 e2e，本批 18 条单测 / 工程门命令不冒充。
- ☐ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 独立复算：66 任务 / 101.5 h / 221 ↔ 221 逐任务 1:1 / 每条标准含 AC / 依赖全部向前 / 46 = 46 / 部分前置均为最终任务祖先 / 任务 ↔ 矩阵双向一致 / 214 标题 = 212 WI + 2 占位 / 路径隔离 / 10 已完成 + 56 未开始 / H 4×v2——**以上全部成立**；**唯一不成立**：T-A10 并入 R-B 后按作者自报为 2 + 0.3～0.5 h，越出“0.5～2 h / 任务”上限且以实施期停工兜底（**B-12**）。B-12 按最小关闭要求拆分并经 Analyze R10 后，由 A 增量复核补勾。
- ☑ **V-03 静态守卫声称与真实脚本一致。** `check.mjs` 六项未变；T-A23 命令 3 `check --only colors / glass` 与之一致；徽标“不只靠颜色”仍由组件测试承担（未假称脚本具备）；T-A24 不引入依赖故无新守卫需求。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** r6.3 零新增运行时机制：`bindRouter` 只是已审守卫的注册入口（不加 failure / 重复注册 / 竞态兜底）；R-B 明示不是生产 guard、不做读侧推导；R-D 明示不扩防御面、要加先报 Walter。无待 Walter 批准的机制残留。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** `jobFixtures` 仍为状态建立时一次边界 parse（T-A09 已交付）；R-B 跨字段关系只在测试断言；T-A22b 的 stage 判定复用契约 `StageSchema`（一次）；组件不复校验（tasks §1-7 未变）。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `bindRouter` 承载“写权限只在 store 内”的可命名概念、是 H-4 无 setter 约束下的必要入口；三个徽标各对应一组契约常量、不建共享基类；T-A24 不引第三方库。
- ☑ **P-5 自动生成文件不手改（§5.5）。** R-B 不改 schema / 生成物；T-A10 仍经 `pnpm -C frontend contract` 更新并 `contract --check` 对拍；`contract-build.mjs` / `check.mjs` 不改。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** T-A22b 只经真实 memory-history router + `registerJobRoutes` + 真实 Pinia 导航（壳与测试不直接调 `bindRouter`），`@ts-expect-error` 只验类型层；R-B 新增用例期望来自手写状态表、不从 fixture 推导；T-A10 标准 5 经真实 `getStageWorkspace` 读回；T-A24 期望手写。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令全部沿用 `pnpm -C frontend {contract,check,typecheck,lint,test:unit}`；`useSessionStore(pinia)` 沿用 `main.ts` 既有写法；不新增工具 / 依赖 / 脚本。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** IMPL-GATE-R6 三项已满足、Walter 授权在既有 tasks 范围内持续有效（tasks 页首 / implementation-log §1）；第二批 DAG（A10 → A22 → A22b；A23 / A24 独立）与 §6 一致；不在本批的任务明列；H-x 本批只能形成 ①③、④ 待 v2 所有者；`specs/README.md` 本 feature 行与上述一致（只读核对；R8 结论由集成人更新该行）。
- ☑ **C-02 契约闭环。** 方法集 / schema / 生成物在 r6.3 零变化；T-A10 仍覆盖 `listJobs / getJob / getStageWorkspace` 与 real 桩全部键（标准 4）；T-A23 只消费 T-A01 的九张映射常量。
- ☑ **C-03 事件与状态闭环。** T-A09a → T-A18 → T-A22a 链路未动；R-B 不触及 activeRunId / overlay / 合并 / 排队；H-4 上下文仍只由导航设置、与 agent run 无关（不从 lastRun 推导）。
- ☑ **C-04 场景定义足以稳定验证。** 九场景 × 读 / 写行为表未变；R-B 后 normal / job-running 的 12 个空工作区与 empty 场景 / 覆盖缺样例的“带阶段的空集合”同形，T-A10 标准 2 / 5 的空态口径一致；`WI not-started seeds` 期望来自手写表，稳定可复现。
- ☑ **C-05 版本与定稿闭环。** T-A16 / T-A17 / T-A19 / T-F01 / T-F07 零触及；R-B 保留 j-delivered final 三锚与快照、保留 j-conflict 两版与 provisional 快照；R-D ③ 由 T-A17 同一次 commit 按构造保持——独立核对原样。
- ☑ **C-06 隐私与本地持久化自洽。** T-A11 未变且不在本批；R-B 只改合成样例、不含私有数据；T-A10 本任务不读写两个本地 key。
- ☑ **C-07 视觉与工程纪律。** T-A23 自制徽标只复用 `var(--fai-*)` 令牌（本轮核实令牌真实存在）、不新增色值 / 玻璃类、点睛红只作边 / 图标；标准 3 + `check --only colors / glass` 守住。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** r6.3 文字未引用 D-015；D-017 仅在 S-17（T-A23 标准 2 “内部生成”）作边界引用；D-020～D-024 未带入。

**合计**：26 项中 25 ☑、1 ☐（V-02，因 B-12）。

### 阶段说明（不设复选框）

- **设计质量通过 vs 本批尚未实施**：本节 25 ☑ 表示 r6.3 的 T-A23 / H-4 `bindRouter` / R-B 落法 / R-D 口径 / T-A24 边界在文档与设计层达标；第二批 T-A10 / T-A22 / T-A22b / T-A23 / T-A24 **一行代码未写、一条测试未跑**，不得读作任何任务完成或 AC 验收。首批 10 项“已完成”仍 = 批次代码 Review 通过。
- **P-4**：代码级，批次 / 最终 Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，不声称任何 AC 已通过、不假绿。
- **Implement 前置**：当前有效轮次 = 本 §R8，**V-02 ☐ ⇒ 第二批尚不得开码**（含与 B-12 无关的四项，这是 AGENTS §2 第 8 步的前置规则，不是对其设计的否定）。关闭路径：作者按 B-12 最小关闭要求拆分 → Analyze R10 → A 新会话 R8.1 增量复核补勾 V-02 → 以**R8.1 被提交后的 SHA** 作为第二批有效 Checklist（本审核员不 commit）。
- **H-x 交接**：八切片仍**全部未交付**；本批完成后 H-3·路由切片 / H-4 / H-2·标签可形成 ①③，② 届时填 R8.1 提交 SHA，④ 只能由 `integration/frontend-workbench-v2` 所有者登记；interface-handoff §5（含 §5-8）待 v2 接收方确认，本审核员不代签。
- **Gate 2 / Handoff**：不在本阶段；feature 未收敛（56 项未开始 + H 组外部阻塞）。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前必报“未收敛（外部阻塞）”；S-22 顶格 2 h 任务的实施期拆分提醒继续有效——但它是**兜底**，不能用来预先吸收已知超额（B-12）。
- **P3 台账**：R-A / R-C / R-E / R-F 未处理、未经 Walter 风险接受；R-B 部分定案（残留见 S-35）；R-D 口径已定、未修。

## 下一步

1. 作者（计划 / 分析类角色）按 B-12 最小关闭要求做 Tasks 层拆分（可顺带吸收 S-33～S-35），重跑 Analyze R10（只读、复算结构）；不改 plan 行为 / spec / AC。
2. 集成人提交后，派 A 新会话做 R8.1 增量复核（只核拆分落点与结构数字），补勾 V-02；R8.1 提交 SHA 即第二批有效 Checklist，并在 `specs/README.md` 本 feature 行登记。
3. R8.1 通过后第二批按 §6 DAG 开码：`T-A09b`（fixture-only）→ T-A10 → T-A22 → T-A22b；T-A23 / T-A24 独立；Implement 首选 `openai/gpt-6-astra`。
4. H-x ④ 待 v2 集成树所有者登记；interface-handoff §5-8 待 v2 接收方确认。

## 结构核验证据（R8，只读）

```text
TARGET    8ad5e28691475097cdef5cd2bad67ef902f062f7（parent 0920004）；worktree D:/2030/Futures-AI-interaction-checklist-batch2 @ review/workbench-interaction-batch2-checklist；启动 git status clean
DIFF      git diff 0920004..8ad5e28 --stat：specs/README.md | analyze.md | implementation-log.md | interface-handoff.md | plan.md | tasks.md；6 files, +136 −29
ZERO      git diff 13a3373 8ad5e28 -- frontend = 0 行；spec.md blob 102af73b…（相对 0920004 零差异）；checklist.md blob 7c219c07…（= R7 原件 9acf3de）；review-batch-a09a.md 相对 af95b66 零差异；10 条“已完成”状态行无改动
CODE      Badge.vue：state∈{ok,warn,bad,sample}、labels 固定、无插槽 / 文案 prop ✓；tokens.css 含 --fai-status-* / --fai-text-* / --fai-type-tag / --fai-radius-base / --fai-space-grid-gap / --fai-accent-red ✓；main.ts useAgentStore(pinia) 在 app.use(pinia) 前 ✓；app/router.ts 无 beforeEach / 无 jobs ✓
          types.ts：StageWorkspace 四分支数组无 .min()、deliverable / finalSnapshot nullable、previews record / reconciliations array ✓；Artifact refine 仅 pendingMerge⇒overlayRev ✓；mock/index.ts readJobFixtures 存在、无调用方 ✓
FIXTURE   十作业 status / currentStage / 阶段态 = plan 样例表 ✓；not_started (作业,阶段) = 12（j-collect P/A/D、j-process A/D、j-failed D、j-cancelled C/P/A/D、j-running D、j-human D）= 作者列表 ✓；12 个工作区当前均带完整内容 ✓；每作业 previews 2 / reconciliations 2 ✓
          interventions i-seed-1..6 锚：j-collect/collect R、j-process/process R、j-running/analyze R、j-deliver/deliver R×2、j-delivered/deliver D（全在已开始阶段）✓；uploads 2 待归属、1 quarantined 带原因 ✓
          fixtures.spec.ts：手写十行 expected 表存在；test.each 全作业内容断言 + deliveries 全作业循环 + final-only 非 delivered 断言 = R-B 须改的三处 ✓；contract-version.spec 不受内容校正影响 ✓
V2REF     D:/2030/Futures-AI-workbench-v2 @ 76abe92（clean）：plan §7.3 H-4（登记公开设置方式；只经守卫时 S1-ctx 条件依赖 H-3）、tasks §1.2 H-3 / H-4、§7.13 S1-ctx；interface-handoff §5-8 登记“无”且披露 bindRouter ✓
TASKS     66 任务 / 101.5 h（A27·42.5 B7·10.5 C5·7.5 D3·5 E3·5.5 F7·12 G10·14.5 H4·4）/ 标称每项 1–2 h / 依赖全部向前（0 例外）/ 预计·依赖行相对 0920004 零变化
          10×已完成 + 56×未开始；H 4×v2；标准 221 ↔ 命令 221 逐任务 1:1（0 例外；0920004 为 220/220，+1 = T-A10）；标准含 AC 0 例外
          矩阵 46 = spec 46（差集 ∅）；部分前置均为最终任务祖先（0 例外；AC-002-5 ← A10 ← B01 ← B04 ← B05）；任务↔矩阵双向一致（0 例外）
          -t/-g 214 = 212 WI + 2 占位；非 jobs 路径仅 T-A09 命令 3；e2e AC 18 条均 test:e2e e2e/jobs；第二批命令 18 = A10 6 + A22 3 + A22b 3 + A23 3 + A24 3
          B-12：T-A10 = 2 h 顶格 + 作者自报 R-B 0.3～0.5 h 并入 ⇒ 越出 0.5–2 h 上限
DOCS      designUI §2.4 :55（状态徽不只靠颜色）、§6 :214（来源徽 / 状态徽自制决策随实施登记；作者引为 §8 → S-33）；plan §4 迁移表（下游→not_started 保留 draft 新修订）⇒ 读侧过滤不可行 ✓；plan §6 :291（2000 行上限、变更摘要）✓
AGENTS    §2 第 6 步 0.5–2 h / 任务；§5.1–§5.3 / §5.5–§5.7 逐项核；§6 通道：A = claude-fable-5-1 via anthropic（bridge 对 fable 本轮 exit 1 = provider / invocation error、未确认 quota；anthropic/fable exit 0；只换通道不换模型；未改配置）
WRITE     唯一改动仓库文件 specs/workbench-interaction/checklist.md；临时片段 2 个在独占 Temp/wi-batch2-01a18388-i8ukv6xl/（checklist-r8-*）；git diff --check 见回复；不 commit
```

---

# R7（2026-10-28，第七轮：r6 接口精化 + 实施基线登记的定向复核；历史快照，复选框已改为文字符号，不参与当前判定——其 26 ☑ 覆盖 r6 设计，r6.3 增量见 §R8）

## 基线与范围

- **审查对象（固定）**：`0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d`（`docs(workbench-interaction): register merged v1 base and H-x producer design`；唯一父提交 = R6 暂停快照 `8af343ff085c0f958068b6b50008a6985f51d170`）。本审核员工作树 `D:/2030/Futures-AI-interaction-review-r7`，分支 `review/workbench-interaction-resume-r7`，HEAD = 审查对象；启动时 `git status --short` 为空。真实 diff `git diff 8af343ff 0e37fbf9`：5 文件 +458 / −144——`specs/README.md`（本 feature 行 + 新增一条跨 feature 待同步行）、`plan.md`（7 处 hunk：页首 r6 记录、§1 唯一修改者行、§1.1 r6 基线登记、§2.1 缺省 stage 与 `registerJobRoutes` / `afterEach`、§2.3 三个 store 行 + “写后统一刷新”段 + fixture 初始条目、§2.4 `JobListItem` 固定字段 + `ActiveJobStatus` 行 + `jobFixtures` 语义、§6 回滚、§7 第 4 条状态更新 + 第 5 条）、`tasks.md`（页首当前状态块 / IMPL-GATE-R6 / H-x 状态 / r6 阶段与修订记录、§0.0 r6 基线审计表、§1-5 所有权与 §1-9 写后统一刷新、§2a 切片→任务表、§3 H-5 容器句、T-A01 / A02 / A07 / A09 / A10 / A11 / A18 / A21 / A22 / B01～B04 / C01～C04 / E03 / G02 / G04 精化、新增 T-A09a / A22a / A22b / C01a、§5 矩阵部分前置列、§6 / §7）、`interface-handoff.md`（新建 99 行）、`analyze.md`（追加 Analyze R6 节 + 页首当前结论）。**spec.md、本文件（含 R6）、`checklist-review-request.md`、HANDOFF.md、`docs/**`、AGENTS.md、`frontend/**`、`backend/**` 为 0 差异。**
- **只读参照 1（实施基线）**：`D:/2030/Futures-AI-interaction-base-43b6d79`，detached HEAD `43b6d79681a49562f41751368b2ae00c24062f56`。本审核员独立核实：该提交为 merge commit（父 `3bf6476` + `eba5002`，标题“Merge PR #7: frontend-workbench v1（Gate 2 已确认，Handoff）”，提交时间 2026-10-28 16:49:38 +04:00 = 12:49:38Z，与协调器所报 mergedAt 一致）；本工作树仓库 `origin/main` 恰为该 SHA，`git merge-base --is-ancestor 43b6d79 origin/main` 成功。本会话**未调用 `gh`、未 fetch**，`gh pr view 7` = MERGED 这一项沿用协调器记录。另核：审查对象 `0e37fbf` 与 `43b6d79` 的 merge-base 为 `3bf6476`，即规格分支**不含** `43b6d79`、main 也不含 `specs/workbench-interaction/**`（与 tasks 页首、interface-handoff §5-6 的说明一致）。
- **只读参照 2（消费方）**：`D:/2030/Futures-AI-interaction-v2-ref-ded7161`，detached HEAD `ded716100381fcd2b4b5d3481f4f56e44c9869fd`（`WIP: pause frontend-workbench v2 …`）。读 `specs/frontend-workbench/plan.md` §7.2 / §7.3 / §7.4 / §7.5 / §7.6 / §7.7 / §7.13、`tasks.md` v2 §1.1 / §1.2 / §3 / §4 / §5 与 T-V2-03 / 05 / 06 / 09 原文；v2.1 Gate 1 按已批准处理。
- **重读**（本轮开始时重新读取，不依赖任何会话记忆）：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md` 全文、spec.md 全文（v1.1，46 AC 独立计数：5+5+6+5+6+8+5+4+2）、plan.md 全文（r6）、tasks.md 全文（r6，分五段读完 1240 行）、analyze.md 全文（R1～R6）、interface-handoff.md 全文、本文件 R6 全文与 R1～R5 结构、`templates/tasks.md`、`docs/interaction.md` §3.3～§3.5、`docs/designUI.md` §3（:73 顶栏“投放”归壳层）、D-018 ADR（§1 定稿 draft/final、不自动、不可撤销；派生“内部生成”）。
- **实施基线真实代码（`43b6d79`，逐文件读）**：`frontend/src/main.ts`（`agentClient.subscribe(useAgentStore(pinia).receive)` 在 `app.use(pinia).use(router).mount` 之前，卸载 / HMR 解除——T-A22a 订阅先例成立）；`src/contracts/index.ts`（`dataClient` / `agentClient` 为**两个独立工厂各自创建的模块级单例**）；`mock/index.ts`（`MockOverrides{fixtures?,agentScript?}`，`fixtures` 每次请求读取整键替换；`readScenario()` 每个 client 创建时读一次；`send` 受理时经 `AgentRunSchema` 预算全部事件再按 `afterMs` 逐个 `setTimeout` 直投监听者；`delayScenario` 1500 ms）；`src/agent/events.ts`（十类事件共享 `eventFields`，从 `contracts/types.ts` 单向导入）；`src/agent/store.ts`（`send` 只传 `{sessionId,message}`；`receive` 对 `run.started` 追加 run）；`src/app/router.ts`（由 `navItems` 生成 + `/` + 兜底，无任何 `beforeEach`，**无 `jobs` 占位**）、`nav.ts`（八项，含 `research`）；`tests/unit/mock.spec.ts:15 / :34 / :94-99（按索引配对循环）/ :100（`'1.0.0'`）`、`contracts.spec.ts:248-253`、`contract-doc.spec.ts:63-64`；`tests/component/focus-band.spec.ts:108-111`（新建 client + 系统边界 spy 委托）；`package.json` 脚本与版本、`vitest.config.ts`（`clearMocks / restoreMocks`）、`tests/setup.ts`、`scripts/check.mjs`（glass 允许名单三类、network 只许 `src/contracts/real/`）、`src/design/glass.css`（`.glass-drawer` 存在）；`specs/frontend-workbench/review.md` 页首 / §8 / §9（Gate 2 确认、11 项 P3 接受未修复、M-01～M-08 为 AI 截图、H-01 / H-02 未经 Walter 处置）；`git diff 8af343f 43b6d79 -- AGENTS.md docs specs/README.md`（仅 `docs/plan.md` D-015、`designUI.md`、新 ADR `20261027-updown-scope.md`、README 两行）。tasks §0.0 B-1～B-11 逐项与真实文件一致，未发现作者漏记或误记。
- **审核员与通道**：A = **claude-fable-5-1 via anthropic**，新开独立会话，与作者（claude-opus-5-5 via anthropic）异模型、隔离。通道原因（脱敏）：本窗口协调器对 `claude-bridge/claude-opus-5-5` 的真实最小调用 exit 1（quota / rate / spend_limit 类，错误原文未记录），bridge 通道在本限额窗口已明确限额，按 AGENTS §6 规则 5 不重试；**fable 未单独重探 bridge，不声称 fable bridge 探活成功**；`anthropic/claude-fable-5-1` 最小真实调用 exit 0，本轮实际任务即走该通道。未改任何 provider / key / 路由 / 全局配置，不因审核结果换模型。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试、未启动子 agent / 服务 / 下载、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写入任何其他 worktree、未修改 plan / tasks / analyze / interface-handoff / spec / README / HANDOFF / docs / 代码。结构复算用 `python -` 标准输入一次性脚本只读完成；为避免长编辑被截断，在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-resume-01a18388-dmiq93ec/` 写入 `r7-checklist-section.md`、`r7-tasks.pkl`、`r7-order.pkl` 三个 r7 命名片段（非项目产物、不入库、不清理）。唯一写入的仓库文件为本文件（新增 §R7、页首两处说明、把 §R6 的 26 个 `[x]` 改为 ☑ 文字并在其标题补“历史快照”；R6 其余内容未动）。

## 结论（R7）：**通过**（定向；r6 接口精化与基线登记的设计质量达标，26 / 26 有效项勾选；**无 P1 / P2**，6 项 P3 建议 S-27～S-32 不阻断）——**Implement 仍 BLOCKED**（IMPL-GATE-R6 的 (2) Walter 代码实施授权与 (3) 集成人 / 集成验证分支 / 实施 worktree 登记未取得；H 组另待 v2 壳方 S1 / S2）

本结论的边界（必须同时成立，不得单独引用）：

1. 通过 = r6 的 plan / tasks / analyze / interface-handoff **文档与设计质量**通过，且 r6 新增内容未越出冻结 spec v1.1 的需求边界。**不等于**可立即实施、不等于任何产品 AC 已验证、不等于 Handoff / Gate 2、不等于 H-1～H-6 / 页面切片任一已交付（四项登记全部“未取得”，作者如实登记，本轮核对无误）。没有任何测试被运行；“未写出来的测试”不是证据。
2. 本审核员**不代 Walter** 批准代码实施授权，不代 v2 接收方签收 interface-handoff §5 各项，不代 frontend-workbench 处置 H-01 / H-02 或签字人工截图。
3. 本轮只解除 IMPL-GATE-R6 的第 (1) 项（A 定向复核），且以本文件**被协调器 / 实施侧提交后的 SHA** 为准（本审核员不 commit）；(2)(3) 由 Walter / 集成人另行满足。

## 独立核验（不照单全收作者结论）

### 1. 实施基线与 §0 事实

| 项 | 作者声称 | 独立核实 | 判定 |
|---|---|---|---|
| `implementation_base_sha` | `43b6d79` = PR #7 merge commit，origin/main | 本地 `git log -1` 为双亲 merge、标题含“Merge PR #7”、时间 12:49:38Z；本仓库 `origin/main` == `43b6d79`；is-ancestor 成立 | ✓（`gh` 结果沿用协调器，本会话不调用） |
| 规格文档不在 main | `specs/workbench-interaction/**` 不在 `43b6d79` | `ls specs/` 于基线目录只有 README / data-layer / frontend-workbench / settings；merge-base(`0e37fbf`, `43b6d79`) = `3bf6476` | ✓ 集成人须带入规格（interface-handoff §5-6 已写） |
| B-7 唯一实质差异 | `mock.spec.ts:96-99` 按索引配对循环 | 真实行 :94-99：`for (const [index, method] of Object.values(dataMethods).entries()) expect(method.result.safeParse(results[index])…)`；方法数增加后第 11 个起 `results[index]` 为 `undefined` → 失败。T-A09 修改范围已写“只遍历 v1 十个方法键” | ✓ 真实差异、落点正确、仍在 S-20 所有权内 |
| B-10 `main.ts` 订阅先例 / 路由无 `jobs` 占位 | 如 §0.0 | 代码一致；`router.ts` 无 `beforeEach`（与 H-4 用 `afterEach` 的充分性相关，见 S-28 旁注） | ✓ |
| B-1 / B-11 v1 遗留与文档差异 | H-01 / H-02 未处置、AI 截图、11 P3；docs 仅 D-015 / ADR | review.md 页首 / §8 / §9、`git diff --stat` 一致 | ✓ 登记而不升级为本 feature 阻塞，口径正确 |
| 旧措辞区分 | “草案 r5 / PENDING / 待 Gate 1”为历史 | tasks 页首当前状态块、§0.1 “历史证据”标题、analyze 页首与 R6 节、plan §1.1 新增行均明示“以本块为准”；本文件 R6 的“PENDING / 不得开工直到…”为 R6 时点原文 | ✓ 已正确区分；本轮不改历史原文 |

### 2. 需求边界（是否需要 Clarify / 重过 Gate 1）

逐项独立判断 interface-handoff §2 的全部“缺口 → r6 落点”：

| r6 新增 | 归属判断 | 结论 |
|---|---|---|
| `ACTIVE_JOB_STATUSES` = JobStatus − {delivered, cancelled} | 对既有 9 状态的分组口径，供 v2 R-003 作业轨道消费；spec R-008“契约扩展”+ plan §1 既有“v2 的契约字段需求由本 feature 写入”；不新增状态、不改任何 AC 判据；领域只读门本就只封 delivered / cancelled（T-A17），failed 可经 rerunStage 继续（plan rerun 表）故计入“进行中”自洽 | 契约精度，不回流。`failed` 计入是产品可见的口径选择，已在 interface-handoff §5-4 交 v2 接收方知悉，妥当 |
| jobsStore `jobs / listStatus / listError / ensureJobs / refresh / applyFilter / filteredJobs / createJob / receiveAgentEvent` + §1-9 写后统一刷新 | plan §2.3 原文“写回执 / agent 通知后重新读取，不做轮询”的机制落地；本 feature 自身 AC-002-4 / 006-6 / 007-2 e2e 亦需要 | 机制精度，不回流 |
| `JobListItem` 固定字段（含 `subject` / `reason`） | 摘要字段固定，是 R-001 列表字段的子集 | 不回流 |
| `registerJobRoutes(router, pinia)` + `afterEach` 守卫、sessionStore 只读无 setter | plan §2.1 / §2.3 既有“sessionStore 提供当前上下文”的设置 / 清空时机 | 不回流 |
| intakeStore `open(jobId?)` 快照 / `close` / `isOpen` / `jobId`；IntakeDrawer `.glass-drawer` 填满容器、无 fixed / 遮罩 / `aria-modal` / 焦点锁、关闭不导航不调 agent | spec R-007 “无模态”与 plan §2.2 “非模态抽屉、无遮罩、无焦点锁”的容器约定精度 | 不回流 |
| 待归属池放在 IntakeDrawer 内 | spec R-003 只要求“进入待归属池，可从池中归入”，位置未定；AC-003-5 判据不变 | R-003 内位置精化，不回流 |
| `jobs.json` 按场景集合分键、`jobFixtures` 整文件替换、每 client 状态建立时读一次、有覆盖时只在内存 | R-008 mock 与场景机制 | 不回流（时机与 v1 `fixtures` 不同，见 S-27） |
| fixture 初始状态应用同一收件箱生成规则 | AC-007-4 本就需要“待处理介入角标出现”的样例；同一规则复用，无新机制 | 不回流（j-failed 口径见 S-29） |
| T-A18 拆出 T-A09a | 纯任务拆分；H-1 不再等状态层（S-22 原建议） | 不回流 |

**结论**：与作者 / Analyze R6 一致——**无需求变更，不需回流 Clarify / 重过 Gate 1**；这是本审核员独立核验后的结论，不是采信作者自报。

### 3. H-1～H-6 设计衔接（逐项）

- **H-1 / T-A09a**：依赖 A02（`JobContextSchema`）与 A09（`CONTRACT_VERSION='2.0.0'`，同文件 `mock/index.ts` 的 `jobFixtures` 解析先行）；不再依赖 A10～A17。`events.ts` 的 `eventFields` 是十类事件共享对象（真实代码核实），加一处即十类同得；`events.ts → contracts/types.ts` 单向导入，引用 `JobContextSchema` 不成环。mock `send` 预算事件后再投递，故“不带时不出现该键”“后一次 send 不改前一 run 已投递事件”在现有结构下自然成立；T-A18 命令 4 复跑 H-1 测试防回归。H-1 最早可交接点 = A09a（祖先 A01～A09，脚本核实）。**可实施、无矛盾**。
- **H-2·列表 / T-A22a**：缓存只读、`ensureJobs` 仅 idle、`refresh` 不回 loading、`applyFilter` 不覆盖、`createJob` 为随交付的写 action（符合 v2 tasks §1.2 F-04“不能用 inbox / intake 冒充”）、`receiveAgentEvent` 只对带 `jobContext` 的终态刷新、`main.ts` 一行订阅沿用先例、测试真实 Pinia + 真实 mock + 边界 spy（§5.6）。与 v2 §7.5 的壳用法（挂载 ensure、重试 refresh、`listError.code/message` 入诊断、集合 = 常量作用于 `jobs`）逐条对得上。“终态才刷新”的充分性：按 plan §4.7 / rerun 表 / S-15，状态层只在**写方法受理时**与**终态事件**改变作业摘要（送出 send 不改阶段态，“静态 R 与 activeRunId 不混淆”），终态时状态层先处理后通知，故刷新读到的是处理后状态；排队重跑亦在前一 run 终态处理后才启动。**成立，但该不变量目前只是推论**，见 S-28。
- **H-3 / T-A22**：只依赖 A01；`addRoute` 同名替换为 vue-router 既有语义；`43b6d79` 无 `jobs` 占位（v2 前为新增），T-A22 标准 2 用含占位的测试路由验证替换、用真实路由表验证新增无重复，覆盖两态。`registerJobRoutes` 在 `app.use(router)` 之前调用，使 `afterEach` 在初始导航前已注册（直达 `/jobs/:id/:stage` 刷新即能设置上下文）。**可实施**。
- **H-4 / T-A22b**：`context` 只读、无公开 setter、只由 `afterEach` 设置 / 清空；`afterEach` 在导航确认后同步执行、早于组件卸载，满足 v2“同一次导航内同步清空”；基线路由无 `beforeEach`，不存在导航被中止却按 `to` 设置的情形（不为猜测情形加 failure 分支，§5.1）。缺省 / 未知 stage 由 T-B04 `router.replace` 补齐后守卫再设置——与 plan §2.1 新增句一致；在此之前 context 为 null，与 T-A22b 标准 1 一致。无 setter → v2 T-V2-03 条件依赖 H-3·路由切片，v2 tasks §1.2 已预设此分支，interface-handoff §5-2 已登记。**无矛盾**。
- **H-5 / T-C01 + T-C01a**：`open(jobId?)` 快照、提交用快照、`close()` 不导航且 `agentClient.send` 透传 spy 0 次、根 `.glass-drawer` 填满父容器、无 fixed / 遮罩 / `aria-modal` / 焦点锁；v2 前两页互斥路由视图各自提供容器并挂载，v2 后 AppShell `.intake-slot` 挂载、T-H01 从本 feature 自有页面移除（R6 已接受的 B-11 (a) 结构未回退，双挂载窗口仍由集成人串行合并收口，不加运行时机制）。**无矛盾**。
- **H-6 / T-A07 + A09 + A10 + A11 + A21**：整集合替换（“+ 一项”“只含 delivered / cancelled”两例在 T-A09 标准 4 / T-A10 标准 2 分层断言，AR6-1 的依赖倒置已修正且本轮核实 T-A09 只断言解析结果）、每 client 读一次、有覆盖时不读写 `fai.jobs.v1` / `fai.inbox.v1`（T-A11 标准 4 Storage spy 计数为 0）、缺工作区样例返回带阶段空工作区、初始角标样例 j-human（job-running）/ j-conflict（job-conflict）由 T-A21 标准 5 断言。v2 T-V2-06 第二种空态（只含非进行中作业）与 T-V2-09 #2（`addInitScript` 注入新增一项）在“每 client 读一次”下可行；v2 组件测试若在 client 创建后才设置 `window.__FAI_MOCK__.jobFixtures`，须沿用新建 client + 边界 spy 的 v1 写法——这一点 interface-handoff §3 / §5-4 已写明。是否把 H-6 拆“场景 / 覆盖”与“角标样例”两批交接，作者正确地留给 v2 接收方（§5-3），未预设。**无矛盾**，细节见 S-27 / S-29。
- **页面切片**：B01 / B02 / B04 / C01 / C01a / C02 / C03 / C04；最早可交接点 = C04 之后（祖先含 A22a、C01a），与 §6 一致。

### 4. 工程准则（AGENTS §5）与所有权

- §5.1：r6 新增全部为最小机制——`refresh()` 单一入口、显式“不加请求序号 / 去抖 / 事件总线 / 单实例登记”、守卫约十行、intakeStore 快照一字段、种子复用既有生成规则；无未经 Walter 同意的猜测性防线。
- §5.2：`jobFixtures` 在状态建立时一次边界校验（validation_error）；表单复用契约 schema；组件不复校验（tasks §1-7 未变）。
- §5.3：`registerJobRoutes` 既供 `main.ts` 又供 v2 / 本 feature 测试（真实 router + 真实 routes）使用，是可复用入口，不是只用一次的提前抽象。
- §5.6：T-A22a / T-A22b / T-C01a 全部“真实 Pinia + 真实 mock client / 真实 memory-history router + 系统边界 spy”，不 `vi.mock` 内部模块，不造测试专用 setter。
- 所有权 / 回滚：`main.ts` 由“只加路由注册”扩为“路由 + 守卫 + jobsStore 订阅”，plan §1 / §6 同步，v2 §7.2 仍写“只负责 `addRoute`”——文件归本 feature，差异已在 interface-handoff §5-1 请 v2 知悉；`agent/events.ts` 只加可选字段；壳方文件零修改（任务修改范围脚本扫描：无 `src/app/**`、`WorkbenchPage`、agent store / UI、`contract-build.mjs`、`check.mjs`）。

### 5. 任务结构独立复算（脚本，只读；不照抄作者数字）

- **66 个任务**、编号唯一、排序满足 “T-Xnn < T-Xnna/b < T-X(nn+1)”；每项预估 1～2 h（≤2 h：0 例外）；合计 **101.5 h**（A 27·42.5 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4）——与作者数字相同。
- 依赖（剔除括号内“不再依赖 T-A10”一类说明文字后）全部指向排序更早的任务：0 例外、无环。T-A22 实依赖仅 A01；T-A18 依赖 A09a / A14 / A16 / A17；T-A22a 依赖 A09a / A10 / A12 / A22；T-A22b 依赖 A02 / A22；T-C01a 依赖 C01；T-C03 另依赖 C01a；T-E03 另依赖 A22b；T-G04 另依赖 C01a。
- 66 / 66 “状态：未开始”，66 / 66 `blocked_by: IMPL-GATE-R6`；H 4 / 4 另带 `frontend-workbench-v2`，非 H 0。
- 完成标准 **220** 条 ↔ 验证命令 **220** 条，逐任务 1:1（0 例外）；每条完成标准含 AC 引用或“spec §4 约束 / 随 AC-009-1”口径（0 例外）。
- §5 矩阵 46 行，AC 集合 == spec 46 条（独立从 spec 提取比对，差集为空）；“部分前置”均为最终任务的祖先（0 例外）；任务正文引用的 AC 与矩阵行、矩阵列出的任务与其正文引用**双向一致**（0 例外；AC-009-1 工程门按矩阵说明处理）；T-G06 / T-G09 以全部 A～F 任务为祖先；T-G10 以 T-G09 为祖先；T-H04 以 H01～H03 为祖先。
- spec 标“端到端”的 AC 共 **18** 条，最终命令全部为 `test:e2e e2e/jobs/…`（Analyze R6 已订正 R6 的“17”为计数笔误，本轮独立计数亦为 18）。
- `-t` / `-g` 标题 **213** 处 = 211 处 `WI` 开头 + 2 处 §1 命令形态 `<标题>` 占位符；单测 / e2e 路径全部限定 `tests/{unit,component}/jobs/**`、`e2e/jobs/**`，唯一例外仍是 T-A09 命令 3 有意整文件跑 `tests/unit/{contracts,contract-doc,mock}.spec.ts`。
- interface-handoff §1 / tasks §2a 的切片 → 任务映射与定向测试标题逐项对拍：H-1（A02 / A09 / A09a；`agent-context-contract.spec`、`contract-version.spec -t "WI scenarios"`）、H-2·标签（A01 / A23）、H-2·列表（A01 / A02 / A10 / A12 / A22a；`-t "WI H-2"` 命中 4 条）、H-3（A22）、页面切片（8 任务）、H-4（A22b；`-t "WI H-4"` 命中 3 条）、H-5（C01 / C01a；`-t "WI H-5"` 命中 3 条）、H-6（A07 / A09 / A10 / A11 / A21；三条命令标题均存在）——两表一致，标题均真实存在于对应任务命令中。§6 “最早可交接点”六项与祖先集合一致。
- 最终全量：T-G09 `pnpm -C frontend test`（v2 后 T-H04 复跑）；T-G10 截图归 Handoff；Converge 口径“未收敛（外部阻塞）”未变。

### 6. 未回退核对（D-018 与旧闭环）

diff 的删除行中无一落在 plan §2.4 `Deliverable` / `FinalSnapshot` / `Revision` / `InboxItem`、§3 持久化、§4.5～§4.7、rerun 迁移表、动作矩阵、九场景表、十样例表，或 tasks §3 范围边界、T-A17、T-F01、T-F07、T-G06（仅 T-A18 标准 4 拆分改写、T-A21 预估 / 标准 5 新增）。独立核对：定稿 draft / final 三锚（`finalSnapshotId / finalRevisionNumber / finalizedAt`）与 `FinalSnapshot` 一致、`publishedAt`（材料发布日期）≠ `finalizedAt`（定稿时间）、同一次 commit 原子提交与未决项拒绝、定稿 / 取消后领域只读且无反向方法、`OriginLabel.derived.text='内部生成'`、六类块与编辑边界、有 activeRunId 时的 overlay / 仅匹配 `pendingRunId` 的终态才合并、S-15 / S-23 不接任口径、B-11 (a) 无登记机制——**全部原样**。R6 的 S-25（基线后刷新 §0）已由 §0.0 落实；S-26 为 R5 算术笔误说明，不涉及本轮。

## 阻断项（R7）

**无。** 未发现 P1 / P2 级设计问题；下列 P3 建议不阻断、不计入判定，可作为后续 Tasks 层微调或 Converge 核对项，由作者自行决定是否吸收（本审核员不替作者修设计）。

## 非阻断建议（R7；均为 P3）

| # | 位置 | 说明 | 建议归类 |
|---|---|---|---|
| S-27 | plan §2.4 `jobFixtures` 句、tasks T-A10 / T-A18 修改范围、interface-handoff §3 `MockOverrides.jobFixtures` 行 | r6 新句“在每个 mock DataClient 的会话状态建立时读取一次”与 plan §2.3 “契约 mock 层持有唯一可变状态”、§2.4 “mock DataClient 与 AgentClient 共享 `job-state.ts`”同时成立的唯一方式，是 `job-state.ts` 为**模块级单例会话状态**：`createMockDataClient()` 调用时重建该单例（读 scenario / `jobFixtures` 各一次），`createMockAgentClient()` 与所有 DataClient 实例共用当前单例（基线 `contracts/index.ts` 中两者是独立工厂创建的单例，无相互引用）。现文字可被读成“每个 DataClient 实例各持一份状态”，到 T-A18 接入 AgentClient 时才会发现无法共享。建议在 T-A10 修改范围写明上述一句（无新机制，仅定语义）。同一处顺带点明：`jobFixtures` 为“建状态时读一次”，与 v1 `fixtures` “每次请求读取”**时机不同**，消费方组件测试须新建 client + 边界 spy（§5-4 已登记，此处只是把差异写进接口行） | Tasks 层措辞 |
| S-28 | tasks T-A18 / T-A22a 标准 4；plan §4.7 | “只对带 `jobContext` 的终态事件刷新”足够的前提是：状态层只在**写方法受理**与**终态事件**两处改变作业摘要（阶段态 / `status` / `updatedAt` / `pendingCount` / 顺序），非终态事件与 send 受理不改摘要。现设计满足这一点，但它只是从 plan §4.7 / rerun 表 / S-15 推出的隐含不变量，没有任何一条标准断言它。建议 T-A18 标准 4 补半句“非终态事件处理前后 `listJobs()` / `getJob()` 结果不变”，或 plan §4.7 加一句不变量；二选一即可。旁注：基线路由无 `beforeEach`，H-4 `afterEach` 不处理 `failure` 参数是正确的最小实现，不要为此加分支 | Tasks 层（测试断言） |
| S-29 | plan §2.3 fixture 种子句、tasks T-A07 / T-A21 标准 5、interface-handoff §5-3 | normal 的 j-failed 四阶段为 D,D,**C**,N；种子规则为“预置的 H 阶段 / conflict **产物**各一条未读条目”。若 T-A07 把 j-failed 的分析产物也写成 `conflict`，normal 场景就会预置角标，与 §5-3 “normal 场景不预置”矛盾；若只是阶段态 conflict（S-14：运行失败以 conflict 呈现）而产物为 draft，则不矛盾。建议 T-A07 明写 j-failed 的分析产物 status（建议 draft，仅阶段态 conflict + reason），T-A21 标准 5 顺带列出 j-failed / j-cancelled 的 `pendingCount` 期望值，消除歧义 | Tasks 层（fixture 口径） |
| S-30 | plan 动作矩阵“追问”行（“同时由抽屉 send 保留上下文”）、tasks T-E03、interface-handoff §4 | r6 在 §4 明确“jobs 代码不导入 `agent/store.ts`，分析台追问经 `contracts/index.ts` 的 `agentClient.send({message, jobContext})`”。后果：这类 send 不带 `sessionId`，基线 mock 会为每次 send 分配新 `mock-session-*`，与 v2 §7.7 “会话 ID 沿用 v1 的单会话”不同轨；壳的 `running` 由 runs 派生仍能禁发，时间线仍回放（T-E03 标准 2 成立），S-15 已覆盖并发第二 run。属 r5 既有设计（R6 已过），本轮只指出两处措辞应对齐：矩阵“由抽屉 send”改为“经 `agentClient.send` 直接发送、不带 sessionId”，并在 interface-handoff §5 加一条让 v2 知悉“作业内追问是独立 mock session”。不要求改行为 | Plan 措辞 + 交接登记 |
| S-31 | tasks §1-9 与各写任务 | 写后统一刷新的定向断言只在 T-C01（submit）/ T-C02（confirm）/ T-C03（assign / remove）/ T-G02（markRead）/ T-A22a（createJob）；`submitIntervention`（T-E02 / E03）、`updateParams` / `mergePending`（T-D02）、`markProvisional`（T-D03）、`saveBlockText` / 批注 / `requestRevision` / `resolveRevision` / `finalizeDeliverable`（T-F02 / F03 / F06 / F07）、`cancelJob` / `rerunStage`（T-B05 / B07）、`resetMockData`（T-G04）只靠 e2e 间接覆盖。v2 H-2 ⑤ 点名 `submitIntervention` 必须刷新。建议 Converge 时逐写路径核对“成功后恰一次 `refresh()`”，或在 T-G05 场景遍历中对 `listJobs` 透传计数做一次全局断言；不新增机制 | Converge 核对项 |
| S-32 | tasks T-A22 | `registerJobRoutes(router, pinia)` 在 T-A22 阶段 `pinia` 参数尚未使用（T-A22b 才用于守卫），而工程门 `eslint --max-warnings 0` 可能把未用参数报为错误。实施细节，由实施者按仓库 eslint 规则处理（如 `_pinia` 或在 A22 即把参数传入守卫占位），不改设计、不改签名 | 实施提示 |

## 当前有效检查项（R7 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 零 diff（`git diff 8af343ff 0e37fbf9 -- spec.md` 为空），46 条 AC 独立计数无误；tasks r6 矩阵 46 / 46（独立脚本比对，差集为空）。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；r6 九项新增（§“独立核验” 2）逐项判定为既有需求与既有 plan 意图内的接口 / 机制精度，无一改变 AC 判据或 §2 目标 / 非目标；无需回流 Clarify。S-27～S-32 为措辞 / 断言精度，不是需求歧义。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；tasks §3 只加 H-5 容器句（非模态约定的精化）；未把导航 / 首页轨道 / 顶栏投放 / 抽屉标签（v2）或 D-017 / D-019 / 验证队列带入。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R4 / R6；plan r6 只在既有落点上补机制（§2.1 / §2.3 / §2.4 / §6），§5 验收对应表未改。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** plan r6 七处 hunk 逐处核对：全部是机制精度或状态登记，无一与 R-001～R-009 / 46 AC 相悖。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核 Analyze R6 §4 八项一致性检查成立；AR6-1（T-A09 ↔ T-A10 断言分层）、AR6-2（§2a / §3 恢复）在最终文本中确已修正（§3 标题与原文完整、T-A09 标准 4 只断言解析结果）；interface-handoff §1 / §2 / §3 与 tasks §2a / §6 一致（本轮逐行对拍）。S-27～S-29 是精度建议，不构成冲突。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** D-018 §1（draft / final、不自动、不可撤销）/ §2（内部生成）原样（§“未回退核对”）；interaction §3.3 R1～R6 旁路口径与 S-15 / S-23 / §4.7 一致；designUI §3:73 顶栏“投放”归壳层与 tasks §3 / T-C01a / T-H01 一致；`43b6d79` 的 docs 差异（D-015 正式行、涨跌作用域 ADR、designUI 指针）对本 feature 无设计影响（不用涨跌色、不新增色值 / 玻璃），作者判断属实。
- ☑ **I-03 前端基线事实核对。** 本轮在 `43b6d79` 真实文件逐项核对 tasks §0.0 B-1～B-11（见“基线与范围”），全部属实；唯一实质差异 B-7（`mock.spec.ts:94-99`）已落 T-A09。这是实施基线上的核对，不再是“核对时刻事实”；实现分支建立时若基线再变，按 tasks §7 重核。
- ☑ **I-04 文件边界与回滚一致。** plan §1 唯一修改者行与 §6 回滚块同步为“`main.ts` 的作业注册（路由、守卫与 jobsStore 订阅）”；tasks §1-5、interface-handoff §3 末行一致；与 v2 §7.2 “`main.ts` 只负责 `addRoute`”的差异已在 §5-1 请对方知悉（文件归本 feature，不需对方批准）；任务修改范围无壳方文件；仍在 spec §4 “只改 frontend/”之内。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 矩阵 46 条映射未改（43 ✓ + 3 ◐ 外部阻塞子项 AC-003-1 / 005-5 / 007-4 → T-H01～H03）；r6 新增 T-A09a / A22a / A22b / C01a 均只作“部分前置”，不冒充最终验收；18 条 e2e AC 最终命令均为 e2e。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 独立复算：66 任务 / 101.5 h / 每项 1～2 h / 排序规则成立 / 依赖全部向前（去括号说明后 0 例外）/ 220↔220 逐任务 1:1 / 每条标准含 AC / 46 = 46 / 部分前置均为最终任务祖先 / 任务↔矩阵双向一致 / G06·G09 祖先覆盖 A～F / 213 标题 = 211 WI + 2 占位 / 路径隔离 / 真实脚本名 / 66×IMPL-GATE-R6、H 4×v2 / `implementation_base_sha` 已登记为真实 merge commit。a / b 后缀任务排序清晰、依赖最小（A09a 不等状态层、A22 只依赖 A01、A22b 只依赖 A02 / A22、C01a 只依赖 C01）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** `43b6d79` 的 `check.mjs`：`--only generated / colors / glass / updown / grid / network` 六项、glass 允许名单 `glass-focus / glass-module / glass-drawer`、network 只许 `src/contracts/real/`；T-A23 / T-C01a / T-G06 命令与之一致；徽标守卫由组件测试承担（未假称脚本具备）。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** r6 新增机制逐项为最小必要（§“独立核验” 4）：单一 `refresh()`、显式拒绝请求序号 / 去抖 / 事件总线、守卫十行、快照一字段、种子复用既有规则；B-11 (a) 的“无登记机制”未回退；S-28 旁注明确不为 `afterEach` 加 failure 分支。无待 Walter 批准的机制残留。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** `jobFixtures` 在状态建立时一次边界校验并对非法值返回 validation_error（T-A09 标准 4）；`SendMessage.jobContext` 非法 stage 在契约边界被拒（T-A09a 标准 1）；表单复用契约 schema；组件不复校验（tasks §1-7 未变）。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `registerJobRoutes` 服务 `main.ts` 与双方测试，可复用；未新增 selector（“进行中”用常量）、未新增 store 以外的层；`ensureJobs` / `refresh` / `applyFilter` 各对应一个真实调用点集合。
- ☑ **P-5 自动生成文件不手改（§5.5）。** `ACTIVE_JOB_STATUSES` / `JobContext` / 场景 describe 经 `contractSchemas` / `contractSemantics` 进生成物，`contract --check` 对拍；`contract-build.mjs` / `check.mjs` 不改（interface-handoff §4 明示）。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** T-A22a（真实 Pinia + 真实 mock client + 边界透传 spy、不 `vi.mock`）、T-A22b（真实 memory-history router + `registerJobRoutes`，只经导航改变上下文，类型层 `@ts-expect-error` 断只读）、T-C01a（`agentClient.send` 透传 spy 0 次）、T-A09a（假时钟推进真实定时器）；S-24 真实 `commit` 取证未回退。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令全部沿用 `pnpm -C frontend {contract,check,typecheck,lint,test:unit,test:e2e,test}`；`main.ts` 订阅沿用既有 `useAgentStore(pinia).receive` 写法；不新增工具 / 依赖 / 脚本。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** tasks 页首 IMPL-GATE-R6 三项、H 组 v2 闸门、H-x 四项交付登记（全部“未取得 / 未交付”）、“R6 26/26 只覆盖 r5”均如实；`specs/README.md` 本 feature 行与跨 feature 待同步行与上述一致（只读核对；R7 结论由实施侧更新该行）。
- ☑ **C-02 契约闭环。** 30 方法仍各有实现任务与单测；新增 `ActiveJobStatusSchema` / `ACTIVE_JOB_STATUSES`（T-A01）、`JobListItem` 固定字段（T-A02）、`SendMessage.jobContext?` 与十类事件可选字段（T-A09a）、`MockOverrides.jobFixtures` 解析（T-A09）均有正反例与生成物对拍；real 桩覆盖全部键（T-A10 标准 4）。
- ☑ **C-03 事件与状态闭环。** T-A09a（透传）→ T-A18（受理登记 / 先处理后通知 / 只投递一次 / S-15·S-23）→ T-A22a（终态刷新）链路衔接无矛盾；旁路 / 终态合并 / 排队重跑 / 收件箱生成 - 已读 - 已解决未回退；S-28 只是把隐含不变量显式化的建议。
- ☑ **C-04 场景定义足以稳定验证。** 九场景 × 读 / 写行为表未变；`jobs.json` 按场景集合分键 + 整文件替换 + 每 client 读一次 + 有覆盖只在内存，使 v2 两例（“+ 一项”“只含终结态”）与本 feature T-G05 遍历都可稳定复现；S-27 / S-29 为措辞精度。
- ☑ **C-05 版本与定稿闭环。** T-A16 不可变历史、T-A19 accept / revert / resolve_conflict、T-A17 原子定稿 + 未决项拒绝 + delivered / cancelled 只读门、T-F01 头部“已定稿 vN · 时间”、T-F07 正负向 e2e、无反向方法——diff 零触及，独立核对原样。
- ☑ **C-06 隐私与本地持久化自洽。** T-A11 白名单 / 512 KiB / 损坏保留原 key 未变，并新增“有 `jobFixtures` 覆盖时对两个 key 零访问”（注入样例不污染本机快照）；T-C01 标准 3 File 只取元数据；fixture 合成样例。
- ☑ **C-07 视觉与工程纪律。** T-A23 / T-D03 / T-C01a 不新增色值与玻璃类，IntakeDrawer 复用既有 `.glass-drawer`（`43b6d79` 真实存在）；差异行 / 徽标文字 + 图标。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** r6 文字未引用 D-015（基线 docs 的 D-015 / 涨跌 ADR 对本 feature 无影响）；D-017 仅在 S-17 作边界引用。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，代码未实施，不声称任何 AC 已通过、不假绿。
- **Implement 前置（IMPL-GATE-R6）**：(1) A 对 r6 的定向复核 = **本 §R7 通过**，以本文件被提交后的 SHA 为准（本审核员不 commit）；(2) **Walter 代码实施授权：未取得**（本恢复轮授权仅限恢复 / 基线 / 接口对拍）；(3) **指定集成人、集成验证分支、本 feature 实施 worktree / 分支（从 `43b6d79` 建立并带入 `specs/workbench-interaction/**`）：未登记**。(2)(3) 任一未满足，**任何任务不得开始**。H 组另待 v2 壳方 S1 / S2 交付并集成。
- **H-x 交接**：H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-5、H-6 全部**未交付**；本轮通过只解除“生产方已提交的有效 Checklist SHA / 轮次”这一项对 r6 设计的审核前提（届时填本文件提交 SHA），其余三项（生产实现固定 commit、定向测试输出摘要、集成 SHA）仍须在实现后由实施者 / 集成人取得。设计对拍通过 ≠ 交接，也 ≠ v2 接收方已签收 interface-handoff §5 各项。
- **frontend-workbench 遗留**：H-01 / H-02 处置、M-01～M-08 人工截图签字、11 项 P3 属该 feature，本审核员不代批，也不升级为本 feature 阻塞。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项（T-H01～T-H03）未解除前必报“未收敛（外部阻塞）”；D-019 / 剪藏预览 / 复核结果 / 验证队列不计入本 feature；S-22 顶格 2 h 任务的实施期拆分提醒继续有效。

## 下一步

1. 实施侧（非本审核员）提交本文件，并在 `specs/README.md` 本 feature 行登记“Checklist R7 通过（26/26，SHA 待填）；Implement 待 Walter 代码授权 + 集成人 / worktree 登记”。
2. 作者可按需吸收 S-27～S-32（S-27 / S-29 建议在建实现分支前以一次 Tasks 层措辞修订落实，不需重过 R7；若改动超出措辞 / 断言精度，按 AGENTS §2 第 7 步重跑 Analyze 并再请 A 定向复核）。
3. Walter 决定是否给出代码实施授权；集成人登记集成验证分支与实施 worktree；v2 接收方对 interface-handoff §5 各项给出确认（含 H-6 是否分批）。
4. 实现分支从 `43b6d79` 建立时，按 tasks §7 复核 §0.0 是否因集成人带入其他提交而变化。

## 结构核验证据（R7，只读）

```text
TARGET    0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d（parent 8af343ff085c0f958068b6b50008a6985f51d170）；worktree D:/2030/Futures-AI-interaction-review-r7 @ review/workbench-interaction-resume-r7；启动 git status --short 为空
DIFF      git diff 8af343ff 0e37fbf9 --stat：specs/README.md | analyze.md | interface-handoff.md(new) | plan.md | tasks.md；5 files, +458 −144；spec / checklist / checklist-review-request / HANDOFF / docs / AGENTS / frontend / backend 0 diff
BASE      43b6d79 = merge(3bf6476, eba5002) “Merge PR #7: frontend-workbench v1（Gate 2 已确认，Handoff）” 2026-10-28 16:49:38+04:00；origin/main == 43b6d79；is-ancestor ✓；merge-base(0e37fbf, 43b6d79) = 3bf6476；base 的 specs/ 无 workbench-interaction
          真实文件核对：main.ts 订阅先例 ✓ / contracts/index.ts 独立单例 ✓ / mock/index.ts fixtures 每请求读·readScenario 每 client 读·send 预算+setTimeout ✓ / events.ts eventFields 共享·单向导入 ✓ / router.ts 无 beforeEach·无 jobs ✓ nav 八项含 research ✓ / mock.spec.ts:94-99 索引配对·:100 '1.0.0' ✓ contracts.spec.ts:248-253 ✓ contract-doc.spec.ts:63-64 ✓ / focus-band.spec.ts:108-111 新建 client+spy ✓ / check.mjs glass 三类·network real/ ✓ / glass.css .glass-drawer ✓ / package.json 脚本·TS 5.9.2·vitest ^5.0.5·playwright 1.64.1·zod ^4.6.7 ✓ / vitest restoreMocks ✓ / review.md §8 §9 H-01 H-02 ✓
V2REF     ded716100381fcd2b4b5d3481f4f56e44c9869fd；plan §7.2 §7.3 §7.5 §7.6 §7.7 §7.13；tasks §1.1 §1.2 §3 §4 §5、T-V2-03 / 05 / 06 / 09（jobFixtures 用法：addInitScript 注入、只含非进行中集合）
TASKS     66 任务 / 唯一 / 排序 T-Xnn<T-Xnna<T-X(nn+1) ✓ / 101.5 h（A27·42.5 B7·10.5 C5·7.5 D3·5 E3·5.5 F7·12 G10·14.5 H4·4）/ 每项 1–2 h / 依赖全部向前（去括号说明后 0 例外，无环）
          66×未开始 / 66×IMPL-GATE-R6 / H 4×v2（非 H 0）；标准 220 ↔ 命令 220 逐任务 1:1（0 例外）；标准含 AC 0 例外
          矩阵 46 = spec 46（差集 ∅）；部分前置均为最终任务祖先（0 例外）；任务↔矩阵 AC 引用双向一致（0 例外）；G06 / G09 祖先覆盖全部 A–F；e2e AC 18 条均 test:e2e e2e/jobs
          -t/-g 213 = 211 WI + 2 占位符；非 jobs 路径仅 T-A09 命令 3 的三份既有契约测试
          H-x 映射：interface-handoff §1 ≡ tasks §2a；定向测试标题均存在；最早可交接点 ≡ 祖先集合（A22←A01；A09a←A01..A09；A22b←A02,A22；A22a←..A12,A22；C01a←C01；A21←..A20）
DOCS      D-018 §1 / §2；interaction §3.3 R1–R6；designUI §3:73 顶栏投放归壳层；docs 差异(8af343f↔43b6d79) 仅 D-015 / updown ADR / designUI 指针 / README
AGENTS    §5.1–§5.3 / §5.5–§5.7 逐项核；§6 通道：A = claude-fable-5-1 via anthropic（bridge 本窗口限额 exit 1 于 opus 探活；fable 未重探 bridge；anthropic/fable exit 0）
WRITE     唯一改动仓库文件 specs/workbench-interaction/checklist.md；临时片段 3 个在独占 Temp/wi-resume-01a18388-dmiq93ec/（r7-*）；git diff --check 见回复；不 commit
```

---

# R6（2026-10-28，第六轮：B-11 修正定向复核 + 未回退核对；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD **`8bd1b31`**（与 R3～R5 相同；本轮**无新提交**）。启动时 `git status --porcelain`：` M specs/README.md`、` M specs/workbench-interaction/checklist.md`、` M specs/workbench-interaction/plan.md`、`?? specs/workbench-interaction/analyze.md`、`?? specs/workbench-interaction/tasks.md`——五个文件仍为未提交 / 未跟踪状态，本审核员原样保留、未暂存、未提交；审查前后 `git status` 一致。
- 冻结输入（审查前、写入前两次核对一致）raw SHA256：spec `ed0f6c6c…942d9`（v1.1，46 AC，R3 起未变）；plan `2623f32b…09fc5`（r5：R4 版 `981ecc25…81d21` + S-20 两处）；tasks.md（r5）`2d1f5508…77f39`（**全文 1108 行分四段读完**）；analyze.md `79471e67…86476`（221 行读完）；原 checklist（含 R5）`a6cf37f0…09380`；`specs/README.md` `18f95dba…b0385`（只读）。全部与调度给出的 hash 一致，未移动。
- 重读：AGENTS.md（§2 / §5 / §6）、`docs/plan.md` 全文、spec.md 全文、plan.md 全文、checklist.md §R5 全文（B-11 / O-4 / S-19～S-24 / P-1 / 最小关闭要求；R1～R4 按需）、`templates/tasks.md`、tasks.md 全文、analyze.md 全文、`docs/interaction.md` §3.3–§3.5 / §3.7、`docs/designUI.md` §3（顶栏全局“投放”入口归壳层，:73）。不以作者摘要或 hash 代替阅读。
- **plan 真实 diff（`git diff HEAD -- plan.md`，只读）**：14 个 hunk、+15/−13。其中 12 个 hunk 落在 R4 已核实的 B-09 / B-10 位置（:6–7 页首两行、:83、:86、:89、:166、:178、:198、:202、:207、:238、:259、:266），内容与 R4 逐项引用的文字一致；**新增的 2 个 hunk 仅为 :18（§1 唯一修改者清单）与 :286（§6 回滚块）**，各加入一处“frontend-workbench 既有 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受契约 2.0.0 影响的硬编码断言（仅 T-A09，保留 v1 语义 / 恢复 v1 原断言）”——即 S-20 原文范围，未触及方法表、矩阵、场景表、迁移表、§4.5～§4.7、§3 持久化、§1.1、§7、§8。R4 版 plan 未曾提交，无法按字节重放其 diff，本轮以 R4 记录的 hunk 位置与引用文字做内容比对。
- **前端基线只读核对**（`D:/2030/Futures-AI-frontend`，核对时 HEAD **`8920b06`**，分支 `feat/frontend-workbench`；自 R5 的 `b991059` 又前移 2 个提交：`beb5b75` 记录 Walter 2026-10-28 Gate 2 确认、`8920b06` “Merge origin/main into feat/frontend-workbench（Handoff 合并主线）”）：`git merge-base --is-ancestor HEAD main` / `origin/main` → **均不是** `main`（`85c6cbb`）/ `origin/main`（`3bf6476`）的祖先；review.md 页首现写“Gate 2 已批准 … 进入 Handoff”，但 §8 原文授权“PR 并 merge 到 main”尚未体现为 main 上的提交。→ **frontend-workbench v1 Handoff 合入 main 的 commit 仍不存在**，plan §1.1“实现起点 = 经 Review / Gate 2 / Handoff 合入后的 commit”未满足，`implementation_base_sha = PENDING` 如实。另在 `8920b06` 抽查 tasks §0 事实：`package.json` 脚本 `contract` / `check` / `typecheck` / `lint` / `test:unit` / `test:e2e` / `test` ✓；`CONTRACT_VERSION` 仍 `'1.0.0'` ✓；`mock.spec.ts:15`（`fixtures/*.json` glob 不递归）/ `:100`（`contractVersion: '1.0…'`）、`contracts.spec.ts:248`（`dataMethods` 键列表）、`contract-doc.spec.ts:64`（`x-methods` 长度 12）✓；`fixtures/*.json` 恰 9 个 ✓；`nav.ts` 无 `jobs` ✓。以上均为**核对时刻事实**，不是实施基线；Implement 开工时仍须按 tasks §7 在 `implementation_base_sha` 重核。本轮未 fetch、未改该仓库任何引用。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（见页首 R6 通道）。派工脱敏记录：角色 A / 任务 Checklist R6（B-11 定向 + 未回退）/ 基线 `8bd1b31` + 上述六个输入 hash / provider `anthropic` / 继承失败类别 `claude-bridge` quota·rate·spend_limit（exit 1，R3 窗口；本轮未重试）。
- **未执行**：未安装依赖、未运行任何产品测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / tasks / analyze / docs / README / 代码 / 前端分支、**未在仓库内外创建、修改或删除任何临时文件**（结构复算只用 `python - <<'PY'` 标准输入一次性脚本，不落盘）、未 commit / push / merge / 切分支。唯一写入文件为本文件（新增 §R6、页首两处说明、把 §R5 的 25 个 `[x]` 与 1 个 `[ ]` 改为 ☑ / ☐ 文字；R5 其余内容未动）。

## 结论（R6）：**通过**（定向；B-11 关闭，P-1 补勾；Tasks r5 + Analyze R5 文档质量通过；**Implement 仍 BLOCKED（外部基线）**）

- **B-11 关闭（按 R5 最小关闭要求 (a)）**：作者**删除**了登记机制而非规避 AGENTS §5.1，tasks 页首明写“未请求、也未声称 Walter 批准任何机制”，§3 / T-C01 / T-H01 逐项与 (a) 一致（见下表）；运行时复杂度净减少，无新增机制；不改 plan / spec。→ **P-1 ☑**。
- **S-19～S-24 处置**：S-19 / S-22 / S-23 / S-24 在 tasks 以一句口径或测试写法落实、S-20 在 plan §1 / §6 各一行、S-21 在 analyze 以“历史注 + 现编号状态表”落实；均**未引入新机制**（见下表）。
- **未回退**：V-02 结构项独立复算与 R5 相同（62 任务 / 96.5 h / 46=46 AC / 无环 / 1:1 / 全部引用 AC / 62×v1 闸门、H 4×v2 闸门）；I-01b 独立复核 spec ↔ plan ↔ tasks 仍无冲突；B-09 / B-10、S-11～S-18、D-018 scope、壳方文件零修改均未回退。
- **外部闸门**：`implementation_base_sha = PENDING` 为真实外部阻塞（见“基线与范围”）；本审核员**不能代 Walter 批准任何 Gate**，Gate 2 已批准是 frontend-workbench 的事实、不是本 feature 的 Handoff commit。**Implement 不得开工**，直到合入 main 的 Handoff commit 登记为 `implementation_base_sha` 并按 tasks §7 重核 §0 事实。AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍为外部阻塞，Converge 必报“未收敛（外部阻塞）”。

## B-11 逐项核对（R5 最小关闭要求 (a) → r5 落点）

| 要求 | r5 落点（tasks 行号） | 核实 | 判定 |
|---|---|---|---|
| §3 该条改为“v2 之前由两页挂载（互斥路由视图）；v2 AppShell 挂载后由 T-H01 移除页面级挂载” | :67 原文：v2 之前 `JobListPage` / `JobDetailPage` 各自挂载同一 IntakeDrawer（互斥路由视图，同一时刻仅一个），v2 AppShell 落地后由 T-H01 从本 feature 自有的这两个页面文件移除（不改 `app/**`）；并明写“不设任何首个挂载者登记 / 单实例登记 / 卸载释放运行时机制，`intakeStore` 不含实例登记” | plan §2.1 两条路由记录（`jobs` / `job-detail`）为同一 `<RouterView>` 下的并列顶层记录、非嵌套 → 互斥成立；与 plan §1.1 接线顺序、§4.2“页面入口或 v2 顶栏打开同一 IntakeDrawer”、designUI §3 顶栏入口归壳层一致 | ✓ |
| T-C01 删“单实例登记”；`stores/intake.ts` 不含实例登记；标准 3 改为 metadata only；命令 3 标题同步 | :595 标题“页面级抽屉挂载”；:601 修改范围 `stores/intake.ts`“**不含实例登记**”、两页各自挂载；:606 标准 3 “不调用任何文件正文读取 API（File 只取 name / size / type / lastModified）（spec §4 … 随 AC-009-1）”；:611 命令 3 `-t "WI metadata only"`；标准↔命令 4:4 | 全文残留扫描：“单实例 / 首个挂载 / 卸载释放”仅出现于 :7（修订记录的删除说明）与 :67（否定句）；“实例登记”仅 :7 / :67 / :601（均为否定或删除说明）；“single drawer”0 处 | ✓ |
| T-H01 修改范围加“移除两页的 IntakeDrawer 挂载（不改 `app/**`）”；标准 1 保留“同一页面只渲染一个抽屉”作集成断言 | :1035–:1046：修改范围“移除 `frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 中的页面级 IntakeDrawer 挂载（本 feature 自有文件）… 不改 `app/**` 和 `workbench/**`”；标准 1 三处入口同一流程 + “同一页面只渲染一个抽屉”（AC-003-1 最终）；新增标准 2 / 命令 2 工程门（`typecheck && lint`，AC-009-1 部分前置）——因 T-H01 现改 Vue 文件，按 tasks §1-4 自身规则必须补工程门；2:2；依赖 T-C04 / T-G09、预估 1 h、`blocked_by: v2` 不变；上下文写明页面内投放按钮保留、经 `intakeStore` 开同一抽屉，T-C04 本地 e2e 由 T-H04 全量复跑回归 | H 组标题 / §6 DAG 说明同步为“只清理本 feature 页面级抽屉挂载 + 集成验证，不改壳方”；仍在 `jobs/**` 内，不触碰壳方文件 | ✓ |
| 不走 (b)：无 Walter 批准、不保留待批登记机制 | 页首 r5 说明“不请求、也不声称 Walter 批准任何机制”；`specs/README.md` 本 feature 行亦写“删除 IntakeDrawer 首个挂载者登记”、“B-11 尚未经 A 复核关闭” | 删除即不再触发 §5.1“先报 Walter”的前提；A 未代批任何机制 | ✓ |
| 不改 plan / spec | spec hash 未变；plan 仅 S-20 两处（见“基线与范围”） | — | ✓ |

附带观察（接受，不加防线）：Analyze R5 §1 指出“v2 壳方挂载合入集成分支 → T-H01 完成”之间存在短暂双挂载窗口。这是集成顺序问题，由 plan §1.1 接线顺序与 AGENTS §6 规则 7（集成人串行合并）收口，T-H01 标准 1 断言最终状态；**不为此窗口增加任何运行时逻辑**，与 §5.1 一致。

## S-19～S-24 处置核对

| # | 落点 | 核实 | 判定 |
|---|---|---|---|
| S-19 | T-A09 修改范围 `contractSemantics.jobScenarios` 明写声明句“CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准”（:210）；T-A09 标准 2 / 命令 2 `WI change note`；T-G06 `contract-doc.spec` 断言该句（:933）；§0 生成器条目指向 S-19 | 静态 v1 文案口径声明 + 文档断言；**不改生成器** | 已落实 |
| S-20 | plan :18 所有权清单、:286 回滚块各一处（见 plan diff 核对） | 只补 T-A09 的三份既有契约测试硬编码断言范围；无其他 plan 改动；I-04“所有权 = 回滚块”在该文件集上成立 | 已落实 |
| S-21 | analyze.md 页首改指向“Analyze R5”；R3「1. 冲突 / 差距 / 歧义（最终状态）」与「最终结论（R4）」下各插一行【r5 注】标历史；新增 Analyze R5 §3 当前状态表用现编号（O-3 / O-6 → T-A09、O-5 → T-A11、O-7 / O-9 → T-A18）；R1～R4 原文保留 | 历史未删、现状可读 | 已落实 |
| S-22 | tasks §7（:1107）：实施期顶格 2 h 任务若超时按 AGENTS §2 第 9 步追加拆分任务并记录，不改 AC / 范围；r5 不预先重拆 | 只是提醒，不是新机制；62 任务不变 | 已落实 |
| S-23 | §2 S-15（:56）与 T-A18 修改范围（:371）/ 标准 3（:375）：activeRunId 终态后置 null；仍在运行的第二个带上下文 run **不接任**、其终态不合并 overlay；一句写入 `SendMessageSchema.jobContext` describe；命令 3 `WI no context` 承担正反例 | 与 plan §4.7“仅匹配 pendingRunId 的终态才合并”、interaction §3.3 R2 旁路一致；无调度 / 接任逻辑 | 已落实 |
| S-24 | T-A17 标准 2（:357）：原子性测试走 T-A10 的**真实 `commit(mutator)`**——测试 mutator 先改 working copy 再抛错，或写入不合 schema 的值触发真实边界校验失败；随后经真实读 API（`getJob` / `getStageWorkspace` / `listInterventions`）断言原状态不变；不复制 commit 算法、**不加生产故障开关或注入框架** | 符合 AGENTS §5.6（测真实实现、在系统边界注入） | 已落实 |

## 未回退核对

| 对象 | 核对方式 | 结果 |
|---|---|---|
| V-02 结构项 | 独立脚本复算（stdin，不落盘）：62 任务 / 编号唯一 / 96.5 h（A 24·38.5 h，B 7·10.5，C 4·6.5，D 3·5，E 3·5.5，F 7·12，G 10·14.5，H 4·4）/ 每项 1～2 h / 依赖全部指向更早编号 / 62×“未开始”/ 62×`blocked_by: frontend-workbench-v1-handoff` / H 4×`frontend-workbench-v2`（非 H 0）/ 完成标准↔验证命令逐任务 1:1（0 例外；T-C01 4:4、T-H01 2:2）/ 每条标准含 AC 引用（0 例外）/ 矩阵 46 行 = spec 46 AC / “部分前置”均为最终任务祖先（0 例外）/ T-G06 与 T-G09 以全部 A～F 任务为祖先 / spec 标“端到端”的 17 条 AC 最终命令均为 `test:e2e e2e/jobs/…` / `-t`·`-g` 标题 184 条中 182 条以 `WI` 开头、另 2 条为 §1 命令形态的 `<标题>` 占位符（R5 记“184 条全部 WI”系未扣占位符，不影响结论）/ 修改范围中无壳方文件（`src/app/**`、`WorkbenchPage`、agent store / UI、`contract-build.mjs`、`check.mjs`）| 未回退 |
| I-01b | tasks r5 未改 spec 行为 / AC；未改 plan 30 方法 + `send(jobContext)`、19 行矩阵、九场景、十样例、rerun 迁移表、§4.5～§4.7、§3 持久化；tasks §3“plan §2.1 / §4.2 没写明 v2 之前由谁挂载”属实（plan 只写“由 shell 的投放按钮打开 / 页面入口或 v2 顶栏打开同一 IntakeDrawer”），r5 填补方式与 plan §1.1 接线顺序一致，不构成冲突；Analyze R5 结论“无内部冲突、新发现无”经独立复核成立 | 未回退 |
| B-09 / B-10 | plan :86 / :198 / :238 / :266（publishedAt）、:83 / :89 / :166 / :178 / :202 / :207 / :259 / :266（Deliverable 判别 + 三锚 + `DeliverableStatusLabel` + 原子定稿 + “已定稿 vN · 时间”）与 R4 引用一致；tasks T-A03 / T-C04 / T-G06、T-A04 / T-A08 / T-A17 / T-F01 / T-F07 / T-G06 落点未动 | 未回退 |
| S-11～S-18 | tasks §2 八行与落点任务未动（S-15 仅增 S-23 一句） | 未回退 |
| D-018 scope | tasks §3：不自动定稿、无反向方法、v1 只做①+派生标记、不做验证队列 / 格物致知 / 蒸馏 / D-019 角色成本 | 一致 |
| spec v1.1 / checklist（R5） | hash 与调度给出一致，未变 | 未变 |

## 新观察（R6；不阻断、不计入判定）

| # | 位置 | 说明 |
|---|---|---|
| S-25 | tasks §0 外部依赖证据表 | 前端分支已前移到 `8920b06`（Gate 2 已批准、Handoff 进行中、**未合入 main**）。§0 表仍记 `b991059` 时点事实并已声明“仅核对时事实”，不算 Tasks 缺陷；登记 `implementation_base_sha` 时按 tasks §7 刷新 §0（含 `8920b06` 合入主线后 AGENTS §6 / D-015 等变动对 §0 事实的影响）。本轮抽查的 §0 前端事实在 `8920b06` 仍成立。 |
| S-26 | checklist §R5 “合计” | R5 原文“25 项中 24 ☑、1 ☐”为算术笔误：R5 实际复选框 26 项（N 4、I 5、V 3、P 6、C 8），25 ☑ / 1 ☐（P-1）。R5 结论不变、原文不改；本轮按真实复选框重算。 |

## 当前有效检查项（R6 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 未变（SHA256 与 R3～R5 一致），46 条 AC；tasks r5 矩阵 46 / 46（独立复算）。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；r5 修订（B-11 删除、S-19～S-24）均为任务 / 口径层，未引入新需求问题，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；tasks §3 范围边界未扩（B-11 条改为纯接线安排）。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R4；plan 仅 S-20 两处文字，落点未动。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** spec 未变；plan 变更仅 S-20 所有权 / 回滚文字，不涉行为。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核（见“未回退核对”）：Analyze R5 “无内部冲突、新发现无”成立；B-11 已从 §5.1 范围问题转为无机制的接线安排，不再挂 P-1。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** 沿用 R5 映射（D-018 §1 / §2 / §5、interaction §3.3–§3.4 / §3.7、designUI §2.4 / §3.4 / §3.9 / §5.2）；S-23 口径与 interaction §3.3 R2 旁路一致；designUI §3 顶栏“投放”入口归壳层与 tasks §3 / T-H01 一致。
- ☑ **I-03 前端基线事实核对。** R5 在 `b991059` 全量核对属实；本轮在 `8920b06` 抽查 tasks §0 关键事实（脚本名、`CONTRACT_VERSION` 1.0.0、三处硬编码行、fixture 9 个、glob 不递归、`nav.ts` 无 jobs）仍成立；均为核对时刻事实，Implement 开工时按 tasks §7 重核。
- ☑ **I-04 文件边界与回滚一致。** plan :18 所有权与 :286 回滚块已含 T-A09 三份既有契约测试（S-20 闭环）；tasks §1-5 与之一致；T-H01 只改 `jobs/pages/**`，H 组零壳方文件；在 spec §4“只改 frontend/”之内。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 沿用 R4 / R5；矩阵 46 条映射未改（43 ✓ + 3 ◐ 外部阻塞）。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 独立复算与 R5 一致（62 / 96.5 h / 无环 / 1:1 / 引用 AC / e2e 层级 / `WI` + jobs 路径隔离 / 真实脚本名 / 闸门齐全 / `implementation_base_sha: PENDING` 如实）；r5 改动后 T-C01 4:4、T-H01 2:2；H 组表述更新为“只清理本 feature 页面级挂载 + 集成验证，不改壳方”（R5 原话“只写集成测试”对应 r4 文本，本轮按 r5 口径确认）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** `check --only {glass,network,generated,colors,updown,grid}` 六项与 `check.mjs` 一致（R5 核；`8920b06` 脚本名未变）；徽标守卫由组件测试承担。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** **B-11 关闭**：`intakeStore` 实例登记 / 卸载释放机制已整体删除，替代为零运行时逻辑的接线安排（两页互斥挂载 → T-H01 移除），未请求、未声称 Walter 批准，无待批机制残留；r5 其余改动（S-23 守卫口径、S-24 测试写法、S-19 / S-20 文字）均不新增运行时机制；Analyze 提到的双挂载过渡窗口由集成顺序收口、不加防线。其余 R5 已核项（commit 原子替换、持久化状态订阅、S-15 守卫、rerun 内存排队）来源不变。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** tasks §1-7 未变；S-18 refine 在契约边界。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** 沿用 R5；r5 未新增抽象（删除了一个只为未来场景服务的 store 机制）。
- ☑ **P-5 自动生成文件不手改（§5.5）。** tasks §1-4 未变；S-19 经 `contractSemantics` 进文档、不改生成器。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** S-24 以真实 `commit` + 测试 mutator / 真实校验失败 + 真实读 API 取证，不造生产故障开关；其余沿用 R5（normal 场景持久记录取证、aborted 系统边界注入、`page.clock` 推进真实定时器、diff 期望手写）。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令全部沿用 frontend 既有脚本；T-H01 新增工程门亦为既有 `typecheck` / `lint`；不新增工具 / 依赖。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** tasks 头部与 §0 如实（PENDING、点时事实声明）；本轮第四次核对外部闸门：Gate 2 已批准但未合入 main，闸门未解除；`specs/README.md` 本 feature 行“待 A R6 定向复核 / B-11 尚未经 A 复核关闭 / Implement 外部基线 blocked”与 R6 前事实一致（只读核对；R6 结论由实施侧更新该行）。
- ☑ **C-02 契约闭环。** 30 方法在 T-A10～T-A21 各有实现任务与单测；T-A06 23 个 action 判别联合；r5 未改。
- ☑ **C-03 事件与状态闭环。** T-A14 / T-A18 / T-A19 / T-A20 / T-A21 覆盖未变；S-23 使 `job-state-agent.spec` 反例口径唯一。
- ☑ **C-04 场景定义足以稳定验证。** T-A07 / T-A08 十样例、T-A09 九场景（含 S-19 声明句）、T-G05 遍历、非 normal 不触碰两个 key 的 Storage spy 断言未变。
- ☑ **C-05 版本与定稿闭环。** T-A16 不可变历史、T-A19 accept / revert / resolve_conflict、T-A17 原子定稿（S-24 真实 commit 取证）+ 未决项拒绝 + final / cancelled 只读门、T-F07 正负向 e2e、无反向方法。
- ☑ **C-06 隐私与本地持久化自洽。** T-A11 白名单 / 512 KiB / 损坏保留原 key；T-C01 标准 3 File 只取元数据（`WI metadata only`）；T-G04 e2e；fixture 合成样例。
- ☑ **C-07 视觉与工程纪律。** T-A23 / T-D03 不新增色值与玻璃类；差异行 / 徽标文字 + 图标；r5 未改。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** tasks / analyze 未引用 D-015；D-017 仅在 S-17 作边界引用。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，代码未实施，不声称任何 AC 已通过、不假绿。
- **Implement 前置**（累计）：(1) R4 ✓；(2) Tasks 复核：V-02 ✓、**P-1 ✓（R6）**；(3) `implementation_base_sha` = **PENDING**——frontend-workbench v1 Handoff **合入 main 的 commit** 出现后登记（`8920b06` 是 Gate 2 已批准、Handoff 进行中的分支提交，**不是** main 上的合入提交，不得用其或任何中间提交替代）；(4) Analyze 复核 I-01b ✓。**Implement 不得开工**（唯一剩余阻塞为 (3)，属外部，A 不能代批）。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项在 v2 Gate 1 + 壳方交付 + T-H01～T-H03 前**必须报“未收敛（外部阻塞）”**；D-019 / 剪藏预览 / 复核结果 / 验证队列不计入本 feature。

## 下一步

1. 实施侧更新 `specs/README.md` 本 feature 行（R6 通过：B-11 关闭、checklist 26/26；Implement 等待 v1 Handoff 合入 main 的 commit）；plan / README / tasks / analyze 的工作区改动与本文件一并由实施侧提交（本审核员未 commit）。
2. v1 Handoff commit 合入 main 后：在 tasks 头部登记 `implementation_base_sha`，按 tasks §7 重核 §0 前端事实（S-25）；如有出入先修 tasks 并重跑 Analyze，再由 A 定向复核；无出入则按 checklist 前置条件（本 §R6 全部 ☑）进入 Implement。
3. S-22 拆分提醒、S-25 刷新属 Implement / Converge 期事项，不是现在的阻断。

## 结构核验证据（R6，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；无新提交）；git status: M README / M checklist / M plan / ?? analyze.md / ?? tasks.md（审查前后一致）
INPUTS    spec ed0f6c6c…942d9 | plan 2623f32b…09fc5 | checklist(含R5) a6cf37f0…09380 | tasks 2d1f5508…77f39 | analyze 79471e67…86476 | README 18f95dba…b0385（写入前复核一致）
PLAN DIFF 14 hunks / +15 −13：12 个在 R4 核实的 B-09 / B-10 位置（:6–7, :83, :86, :89, :166, :178, :198, :202, :207, :238, :259, :266）+ 2 个新 hunk :18 / :286 = S-20
TASKS     62 任务 / 62 唯一 / 96.5 h / 每项 1–2 h / 依赖全部指向更早编号 / 62×未开始 / 62×blocked_by v1 / H 4×blocked_by v2
          标准↔命令 1:1（0 例外；C01 4:4、H01 2:2）；每条标准含 AC（0 例外）；46/46 AC = spec；部分前置均为最终任务祖先（0 例外）；G06 / G09 祖先覆盖全部 A–F
          17 条 e2e AC 最终命令均 test:e2e e2e/jobs/…；-t/-g 184 条 = 182 WI + 2 个 §1 <标题> 占位符；修改范围无壳方文件
          B-11 残留：“单实例 / 首个挂载 / 卸载释放”仅 :7（删除说明）/ :67（否定句）；“实例登记”仅 :7 / :67 / :601（否定）；“single drawer”0
          S-19 句 :210 / :933；S-23“不接任” :56 / :371 / :375；S-24 真实 commit(mutator) :357；S-22 :1107；T-H01 “不改 app/**” :1041
FRONTEND  D:/2030/Futures-AI-frontend @ 8920b06（feat/frontend-workbench；beb5b75 = Gate 2 确认，8920b06 = merge origin/main 入分支）；非 main(85c6cbb)/origin/main(3bf6476) 祖先 → 未合入 main
          §0 抽查仍成立：scripts ✓ / CONTRACT_VERSION 1.0.0 / mock.spec:15,100 / contracts.spec:248 / contract-doc.spec:64 / fixtures 9 / nav 无 jobs
DOCS      D-018 §1/§2/§5；interaction §3.3–§3.5/§3.7；designUI §3（:73 顶栏投放归壳层）
AGENTS    §5.1（B-11 关闭依据：机制已删除，无待批项）、§5.6（S-24）、§6（A = claude-fable-5-1 via anthropic，继承探活，未重探 bridge）
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md；仓库内外未创建 / 修改 / 删除任何其他文件；git diff --check 见回复
```

---

# R5（2026-10-28，第五轮：Tasks（V-02）/ Analyze（I-01b）质量复核；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD **`8bd1b31`**（与 R3 / R4 相同；本轮**无新提交**）。启动时 `git status --porcelain`：` M specs/README.md`、` M specs/workbench-interaction/checklist.md`、` M specs/workbench-interaction/plan.md`、`?? specs/workbench-interaction/analyze.md`、`?? specs/workbench-interaction/tasks.md`——**工作区不干净**，五个文件均为未提交 / 未跟踪状态，本审核员原样保留、未暂存、未提交；不伪称任何提交已完成。
- 冻结输入（审查前、写入前两次核对一致）raw SHA256：spec `ed0f6c6c…942d9`（v1.1，46 AC，与 R3 / R4 相同）；plan `981ecc25…81d21`（与 R4 相同，**本轮无改动**）；原 checklist（含 R4）`56181b02…b5075`；tasks.md（r4，未跟踪新文件，**全文 1103 行分三段读完**）`98d080d3…740fc`；analyze.md（未跟踪新文件，138 行读完）`c97f6cad…2259b`；`specs/README.md` `66376f8e…dc55e`（只读）。`git diff HEAD --stat` 仅 plan / checklist / README 三处既有改动，与 R4 记录一致；tasks / analyze 为新文件，按 hash 核对后整篇审读（未漏审）。
- 重读：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`、spec.md、plan.md、checklist.md §R4（R1～R3 按需）、`templates/tasks.md`、tasks.md 全文、analyze.md 全文、`docs/interaction.md` §3.3–§3.5 / §3.7 / §7、`docs/designUI.md` §2.4 / §3.4 / §3.5 / §3.9 / §5.1 / §5.2、D-018 全文、`specs/README.md`（只读）。
- **前端基线只读核对**（`D:/2030/Futures-AI-frontend`，审查时 HEAD **`b991059`**，分支 `feat/frontend-workbench`；该分支会继续移动，本轮只记录核对时刻）：`git merge-base --is-ancestor HEAD main` → **不是** `main`（`85c6cbb`）/ `origin/main`（`3bf6476`）的祖先；`git branch -a --contains HEAD` 仅本地 `feat/frontend-workbench`；`specs/frontend-workbench/review.md` 页首明写“**不是 Handoff；Gate 2 尚未批准**，未进入 PR / merge”。→ **frontend-workbench v1 Handoff SHA 仍不存在**，Implement 外部闸门未解除；该 review.md 只是外部状态证据，不是 Handoff。另核对 tasks §0 所引事实：`package.json` 脚本 `contract` / `check` / `typecheck` / `lint` / `test:unit`（vitest run）/ `test:e2e`（playwright test）/ `test`（= check && typecheck && lint && test:unit && test:e2e）✓；`vitest.config.ts` include `tests/**/*.spec.ts`、happy-dom、`tests/setup.ts` ✓；`playwright.config.ts` testDir `./e2e`、Chrome 通道、`127.0.0.1:4173` ✓；`@playwright/test` 1.64.1（`page.clock` 可用）✓；`contract-build.mjs` 由 `contractSchemas` + `methodSemantics` / `contractSemantics`（字符串项进 §1）驱动、字段清单渲染 `const` / `enum`、§4 / §5 为静态文案（仅 v1 五场景、九个 fixture 键）✓；`contract --check` / `check --only {generated,colors,glass,updown,grid,network}` 存在 ✓；既有硬编码：`tests/unit/contracts.spec.ts:248–253`（十个 dataMethods 键、`methodSemantics` 长度 12）、`contract-doc.spec.ts:64`（`x-methods` 长度 12）、`mock.spec.ts:100`（`contractVersion: '1.0.0'`）、`mock.spec.ts:15/34`（`import.meta.glob('…/fixtures/*.json')` **不递归**、恰好 9 个）✓；`schema.json` 中 `AgentEvent`（discriminatedUnion）生成为 `oneOf`、`AgentRun`（superRefine）正常入 `$defs` → S-11 / S-12 / S-18 的 literal-object / 判别联合 / refine 与现生成器相容 ✓；`src/shared/components/{Badge,Loading,EmptyState,ErrorState}.vue`、`src/agent/{store,AgentDrawer,…}`、`mock/agent/{success,failure,retry,long}.ts`（long 含 done=true 的 `step.text`、12000ms `run.completed`；failure 1200ms `run.failed`）、mock `send` 以 `setTimeout` 相对 `Date.now()` 回放（假时钟可控）、`main.ts` 为装配点且 `app/router.ts` 由 `navItems` 生成（无 `jobs` 项）、`real/index.ts` 为逐方法 NotImplementedError 桩 ✓。`spec/frontend-workbench-v2` 未过 Gate 1，未作为依赖读取。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（见页首 R5 通道）。派工脱敏记录：角色 A / 任务 Checklist R5（V-02 + I-01b）/ 基线 `8bd1b31` + 上述六个输入 hash / provider `anthropic` / 继承失败类别 `claude-bridge` quota·rate·spend_limit（exit 1，R3 窗口；本轮未重试）。
- **未执行**：未安装依赖、未运行任何产品测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / tasks / analyze / docs / README / 代码 / 前端分支、未创建任何新文件、未 commit / push / merge / 切分支。结构核验（任务数 / 依赖方向 / 祖先关系 / 标准↔命令计数 / AC 集合 / `-t`·`-g` 标题前缀）由本审核员用一次性 Python 只读脚本**独立复算**，不采信 Analyze 的脚本结论；这是文档结构检查，不是产品测试。唯一写入文件为本文件（新增 §R5、页首两处说明、把 §R4 的 24 个 `[x]` 改为 ☑ 文字；R4 内容未动）。

## 结论（R5）：**未通过**（定向；阻断 1 项 **B-11**，为 Tasks 层最小修正或 Walter 批准二选一；不回流 Plan / Clarify、不动冻结 spec、不改 docs）

- **V-02（Tasks 质量）**：62 个任务、编号唯一、依赖全部指向更早编号（无环）；每项 1～2 h（合计 96.5 h）；每项含上下文 / 修改范围 / 完成标准 / 验证命令；**每条完成标准均引用 AC**（spec §4 持久化约束无独立 AC 者以“随 AC-009-1 全量回归”引用，可接受）；完成标准与验证命令**逐任务条数 1:1**（独立复算 0 例外）；46 / 46 AC 在矩阵中、与 spec 集合完全相同；矩阵“部分前置”均为最终任务的祖先，T-G06 / T-G09 以全部 A～F 任务为祖先；62 / 62 `blocked_by: frontend-workbench-v1-handoff`，H 组 4 / 4 另 `blocked_by: frontend-workbench-v2` 且只写集成测试、不改壳方文件；spec 标“端到端”的 17 条 AC 最终命令均为 `test:e2e e2e/jobs/…`，schema / 状态层单测只作“部分前置”，**没有用 schema 代替 e2e**；184 条 `-t` / `-g` 标题全部以 `WI` 开头且路径限定 `tests/{unit,component}/jobs/**`、`e2e/jobs/**`（仅 T-A09 命令 3 有意整文件跑三份既有契约测试，用于证明 v2 不破坏 v1），不会误匹配 frontend-workbench 同编号 AC；命令使用真实脚本名、真实 flag（已对照前端基线）。各任务按增量可落地（A 契约 → mock 状态层 → 路由 / 徽标 / diff → B～F 界面 → G 收口 → H 集成）。**V-02 勾选**。
- **I-01b（Analyze 结论）**：独立对 spec → plan → tasks 做一致性复核：tasks 未改 spec 行为 / AC、未改 plan 方法集（30 个 DataClient 方法 + `send(jobContext)`）、19 行动作矩阵、九场景 × 读 / 写 / 快照行为、十个作业样例、rerun 迁移表、§4.5 版本 / 冲突语义、§4.6 定稿原子提交与 final 后只读门、§4.7 旁路 / 检查点、§3 持久化白名单与 512 KiB / 损坏规则、§1.1 基线与 blocked_by；R4 关闭的 **B-09（`SourceNote.publishedAt` 为 TradingDate，T-A03 / T-C04 / T-G06）与 B-10（`Deliverable` 判别联合 + 三锚 + `DeliverableStatusLabel` + 原子 `finalizeDeliverable` + 头部“已定稿 vN · 时间”，T-A04 / T-A08 / T-A17 / T-F01 / T-F07 / T-G06）均未回退**；D-018 scope 守住（tasks §3：不自动定稿、无撤销 / 反向方法、v1 只做①+派生标记、不做验证队列 / 格物致知 / 蒸馏 / D-019 角色成本）。Analyze 自查四轮（TF-1～TF-9 修正留痕）结构可信，但本轮**不按其“无内部冲突”自动通过**：其留给 A 的 O-3 / O-4 经独立裁定——O-3 **接受**（见下），O-4 **不接受**（→ B-11）。spec ↔ plan ↔ tasks 之间**无内部冲突**，**I-01b 勾选**；O-4 属 AGENTS §5.1 未经批准的范围扩大，记在 **P-1**（未勾）。
- **S-11～S-18**：在 Tasks 层**全部已确定且可验证**（逐项见下），本轮判为“Tasks 层关闭”；这只是设计 / 任务落实，不是实现完成。
- **Implement 前置**：(1) R4 ✓；(2) Tasks 复核 → 本轮 V-02 ✓ 但 **P-1 ☐（B-11）**，需 B-11 关闭后 R6 定向补勾；(3) Tasks 头部 `implementation_base_sha` = **PENDING**（外部闸门未解除，本轮核实）；(4) Analyze 复核 → I-01b ✓。**Implement 仍 BLOCKED**（外部基线 + B-11）。AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍为外部阻塞，Converge 必报“未收敛（外部阻塞）”。

## 阻断项（R5）

| # | 严重度 | 位置 | 问题 | 受影响 AC | 最小关闭要求 | 分类 |
|---|---|---|---|---|---|---|
| **B-11** | 中（AGENTS §5.1 程序性违规 + 永久死代码：v2 之后 AppShell 先于路由视图挂载，“首个挂载者渲染”规则会让页面级挂载永远不渲染，登记逻辑随之成为常驻无用分支） | tasks.md §3 末条“IntakeDrawer 的挂载”；T-C01 修改范围（“单实例登记”）、完成标准 3（“同时挂载两个 IntakeDrawer 只渲染一个”）、验证命令 3（`WI single drawer and metadata only`）；T-H01 完成标准 1（“同一页面只渲染一个抽屉”）；analyze.md O-4 | 为“v2 的 AppShell 也挂载 IntakeDrawer 后会出现两个抽屉”在 `intakeStore` 加**首个挂载实例登记 / 卸载释放**（约 10 行运行时逻辑）。AGENTS §5.1：即使能说清怎么出错、概率与代码量，也“**必须先报给 Walter 并得到同意**”；Analyze 明写“§5.1 是否需要报 Walter，交 A 判断”——**A 不是 Walter，不能代批**。且存在零运行时逻辑的既定接线安排：v2 之前 `JobListPage` / `JobDetailPage` 各自挂载（二者是互斥的路由视图，同一时刻只有一个存在，不会双渲染）；v2 的 AppShell 挂载落地时，由本 feature 在 T-H01（本就 `blocked_by: v2`，且只改本 feature 自有文件 `jobs/pages/**`，不碰壳方代码）移除页面级挂载——这正是 plan §1.1 “v2 壳方接投放 → 本 feature 集成验证”的接线顺序，无需任何登记机制 | AC-003-1（本地子项与 v2 子项）、AC-007-3（抽屉非模态）间接 | **二选一**：(a) **Tasks 最小修正**（推荐）：tasks §3 该条改为“v2 之前由 `JobListPage` / `JobDetailPage` 挂载（互斥路由视图，同一时刻仅一个实例）；v2 AppShell 挂载后由 T-H01 移除页面级挂载（本 feature 自有文件）”；T-C01 修改范围删“单实例登记”、`stores/intake.ts` 不含实例登记，完成标准 3 改为“不调用任何文件正文读取 API（File 只取 name / size / type / lastModified）”并同步命令 3 标题（如 `WI metadata only`）；T-H01 修改范围加“移除 `jobs/pages/{JobListPage,JobDetailPage}.vue` 的 IntakeDrawer 挂载（不改 `app/**`）”，完成标准 1 保留“同一页面只渲染一个抽屉”作为集成断言。或 (b) 保留登记机制，但须 **Walter 书面同意**并在 tasks §3 与 `specs/README.md` 本 feature 行记录批准（A 不代批）。两者均不改 plan / spec。修正后由 A 新开会话做 **R6 定向复核**（只核 B-11 与未回退） | Tasks 可修正（或 Walter 批准） |

## O-1～O-10 独立裁定（不按“作者说在 plan 意图内”接受）

| # | 裁定 | 依据 |
|---|---|---|
| O-1 补 `UploadStatusLabel` / `OriginLabel` / `JobTypeLabel` | 接受 | AC-003-6 / AC-001-1 / S-17 要求的文案必须有来源，plan §2.4 口径“徽标只消费契约文案、不另建映射”决定了只能补在契约；同一机制、零行为 |
| O-2 补 `Conclusion` / `EvidenceAnchor` / `DerivedValue` / `StageWorkspace` / `WriteReceipt` 最小形态 | 接受 | spec R-004 / R-005 what 与 plan “写回执包含…” 已给语义；Tasks 只定字段，不加行为 |
| **O-3** T-A09 修改 frontend-workbench 既有三份契约测试的硬编码断言 | **接受（附 S-20）** | 本审核员核实硬编码真实存在（`contracts.spec.ts:248–253`、`contract-doc.spec.ts:64`、`mock.spec.ts:100`）；`CONTRACT_VERSION` 升 2.0.0 与方法数增加后这些断言**必然失败**，plan §6 又要求“合并前跑其 `pnpm test`”——不改则 plan §6 不可满足，删用例更差，故“只改受 v2 影响的硬编码、保留 v1 语义”是唯一且最小的解；v2 已被 plan §1 排除在契约 / schema 修改之外，不存在并发写者冲突；`mock.spec.ts:34` 的 9 文件断言因 glob 不递归**不受** `fixtures/jobs/` 影响（tasks §0 判断正确）。plan §1 / §6 未列这三份文件 → 记 S-20 要求补一行所有权与回滚说明（非阻断） |
| **O-4** IntakeDrawer 首个挂载实例登记 | **不接受 → B-11** | 见阻断表 |
| O-5 `persistence.ts` 提供只读状态订阅供横幅 | 接受 | plan §3 明确要求横幅显示降级 / 不可读，横幅必须有状态来源；订阅是最小机制且不经业务契约 |
| O-6 v1 十个方法在 job-* 场景按 normal 行为 | 接受 | 现 mock 代码路径本就如此；只在 describe 登记，不加分支 |
| O-7 已有 activeRunId 时第二个带上下文的 send 不替换、其终态不合并 overlay | 接受（附 S-23） | 是 A 在 R2 S-15 主动要求“一句话定清”的事项；与 plan “仅匹配 pendingRunId 的终态才合并”“j-merge 期间不切换 runId”一致，是一个守卫条件而非新机制；替换 activeRunId 的替代方案会使 overlay 失去归属，更差。边界“首个 run 终态后第二个仍在跑的 run 是否接任 activeRunId”未写 → S-23 在 describe 写明“不接任”，不加逻辑 |
| O-8 `manual-acceptance.md` 放 `specs/workbench-interaction/` | 接受 | R2 I-04 已接受 |
| O-9 aborted 用合成合法事件序列从系统边界注入 | 接受 | plan §4.7 要求 aborted 行为；不新增脚本；AGENTS §5.6 在系统边界注入 |
| O-10 schema 写在 `types.ts`，不建 `job-types.ts` | 接受 | plan §2.4 允许二选一；生成器只读 `types.ts` 的 `contractSchemas`，核实属实 |

## S-11～S-18 复核（Tasks 层关闭；非实现完成）

| # | Tasks 落点 | 可验证 | 判定 |
|---|---|---|---|
| S-11 展示映射入 CONTRACT.md | §2：九张 literal-object schema 与 `as const` 常量同源，注册 `contractSchemas`，不改生成器；T-A01 / T-A23 / T-G06 | 生成器 `fieldRows` 渲染 `const`（`contract-build.mjs:148`）已核；`contract-labels.spec` / `contract-doc.spec` 正反例 | 关闭 |
| S-12 revision 载荷按 kind 可辨识 | §2：`z.discriminatedUnion('artifactKind', …)` 四分支，deliverable 保留 `blocks`；T-A05 / T-A14～T-A16 | discriminatedUnion → `oneOf` 已核；`contract-entities.spec` 分支不匹配被拒；不可变性单测 | 关闭 |
| S-13 `getJob` → `Job \| null` | §2：null 只在 empty 场景预置 id；未知 id 一律 not_found；T-A02 / T-A10 / T-B04 | `job-state-read.spec` 两分支；AC-001-4 空态用预置 id | 关闭 |
| S-14 失败以 conflict + reason 呈现 | §2：schema refine + describe + j-failed 样例；T-A01 / A02 / A07 / A20 / B05 / G06 | `contract-labels.spec`、`job-state-rerun.spec`、`job-detail.spec`、`contract-doc.spec` | 关闭 |
| S-15 普通追问与 activeRunId | §2：带上下文的 send 在无 activeRunId 时登记并设为 active；不带上下文不改作业；上下文取发送时值；事件只投递一次；T-A18 / T-E03 / T-G01 | `job-state-agent.spec` 正反例 | 关闭（附 S-23） |
| S-16 kind v1 子集注记 | §2：13 种，不含 `source_pref` / `value_fix`，describe 注记定稿用独立 finalize；T-A01 / T-G06 | `contract-labels.spec`、`contract-doc.spec` | 关闭 |
| S-17 派生来源徽“内部生成” | §2：`OriginLabel.derived.text='内部生成'` + source 次文案，不新增色值；T-A01 / A23 / E01 / F01 | `badges.spec`、`analyze.spec`、`deliver-blocks.spec` | 关闭 |
| S-18 Deliverable 不变量在契约入口一次 parse | §2：判别联合（draft 三锚 null / final 三锚非空）+ `DeliverWorkspace` 一次 superRefine 对齐快照；T-A04 / A08 / A17 / G06 | superRefine 与生成器相容已核（`AgentRun` 先例）；`contract-deliverable.spec` 四反例、`fixtures.spec` j-deliver / j-delivered | 关闭 |

## 新建议（R5；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-19 | tasks §0 / T-A09；`contract-build.mjs:117–139` | 生成器 §4 “Mock 与实现选择”/ §5 是静态文案（只列 v1 五场景、九个 fixture 键、`window.__FAI_MOCK__.fixtures`），2.0.0 文档中将与 §1 的 `jobScenarios` 并存且不提 `jobFixtures`。不改生成器可接受，但 T-A09 的 `contractSemantics.jobScenarios` 应明写“§4 所列为 v1 五场景与 fixture 键；job-* 场景与 `__FAI_MOCK__.jobFixtures` 以本条为准”，T-G06 `contract-doc.spec` 断言该句存在，避免 Review 时被当作文档自相矛盾。 |
| S-20 | plan §1 所有权清单（:16）、§6 回滚块 | 补一行：“frontend-workbench 既有 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受契约 2.0.0 影响的硬编码断言（仅 T-A09，保留 v1 语义）”进所有权与回滚范围，使 I-04 的“所有权 = 回滚块”在 Tasks 新增的这一文件集上继续成立。一行 plan 微调，可与 B-11 修正同批提交，不需 Plan 轮次。 |
| S-21 | analyze.md “最终状态” §1 与 R1-3 O-3 / O-5 / O-7 / O-9 | 任务编号为 r2 顺延前的旧号（T-A08 → 现 T-A09；T-A10 → T-A11；T-A17 → T-A18）。R1 表作为历史可保留，但“最终状态”段落应用现编号；Converge 时顺手改。 |
| S-22 | T-A18 / T-A19 / T-A20（各 2 h，均在上限且内容密集） | Implement 时若单项超 2 h，按 AGENTS §2 第 9 步在 tasks.md 追加拆分任务（如 A18 拆“上下文登记 + 事件投递”与“overlay / 终态合并”），不要硬塞。 |
| S-23 | tasks §2 S-15；T-A18 | 写明“activeRunId 在其终态后置 null，不由仍在运行的第二个带上下文 run 接任”（describe 一句，不加逻辑），使 `job-state-agent.spec` 的反例口径唯一。 |
| S-24 | T-A17 完成标准 2 “向 commit 注入失败” | 写明注入方式（如 mutator 在部分修改后抛错 / 边界校验失败）以保证测试测的是真实 `commit` 的回滚路径，而非测试自造的状态。 |

## 当前有效检查项（R5 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 未变（SHA256 与 R4 一致），46 条 AC；tasks 矩阵 46 / 46。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；Tasks / Analyze 未引入新需求问题；O-1～O-10 均为 plan 留白的落实而非需求变更，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；tasks §3 范围边界与之一致，未把 D-018 效果 ②～⑥ / 撤销 / 自动定稿 / 验证队列 / 格物致知 / D-019 带入。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R4；tasks 未改 plan 落点。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** 两者 SHA256 与 R4 一致，未变。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核：tasks 未改 spec 行为 / AC、未改 plan 方法集 / 矩阵 / 场景 / 迁移表 / 版本与定稿语义 / 持久化规则 / 所有权；B-09 / B-10 未回退；Analyze R1～R4 结论“无内部冲突”经复核成立。O-4 不是 spec / plan / tasks 间冲突，是 §5.1 范围问题，记于 P-1。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** D-018 §1（显式 / 二次确认 / 不自动 / 不可撤销 / v1 只做①）→ tasks §3 + T-A17 / T-F07；D-018 §2 / designUI §2.4 “内部生成” → S-17；D-018 §5 `/learning` 不改（tasks 不涉及）；interaction §3.3 R1–R6 → T-A16 / T-A18 / T-A19 / T-G01 / T-G03；§3.4 kind v1 子集 → S-16 注记；§3.7 / designUI §5.2 `draft / final` → S-18；designUI §3.4 “已定稿 vN · 时间” → T-F01；§3.9 完成态不常驻角标 → T-A21。
- ☑ **I-03 前端基线事实核对。** 本轮重读 `D:/2030/Futures-AI-frontend` @ `b991059`：tasks §0 所列脚本名、配置、生成器结构、既有硬编码、fixture glob 不递归、`page.clock` 可用、mock 回放用 `setTimeout`、组件 / 脚本存在性**全部属实**（明细见“基线与范围”）。
- ☑ **I-04 文件边界与回滚一致。** tasks §1-5 所有权与 plan §1 一致，且 H 组不改壳方文件；新增的三份既有契约测试（O-3）在 spec §4 “只改 frontend/” 之内，plan §1 / §6 需补一行（S-20，非阻断）。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 沿用 R4；tasks 矩阵把 46 条映射到具体文件与标题（43 ✓ + 3 ◐ 外部阻塞）。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 62 任务 / 1～2 h / 无环 / 上下文·范围·标准·命令齐全 / 标准引用 AC / 标准↔命令 1:1 / 端到端 AC 用 e2e / `WI` 前缀 + jobs 路径隔离 / 真实脚本名 / H 组 `blocked_by: v2` / 头部 `implementation_base_sha: PENDING` 如实登记（独立复算与基线对照见结论）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** `check --only {glass,network,generated,colors,updown,grid}` 六项与 `check.mjs:8–14` 一致；T-G06 / T-A23 引用正确；徽标守卫由组件测试承担（未假称脚本具备）。

### 工程准则（AGENTS §5）

- ☐ **P-1 不为猜测场景加复杂度（§5.1）。** **未满足：B-11**——`intakeStore` 首个挂载实例登记是为 v2 之后的双挂载预先加的运行时逻辑，未经 Walter 同意，且有零逻辑的接线安排可替代。其余：commit 原子替换（plan §4.6 / §2.4 error 不产生部分修改要求）、持久化状态订阅（plan §3 横幅要求）、S-15 守卫、rerun 内存排队（plan 既定）均有 spec / plan 来源，不算猜测。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** tasks §1-7：契约输入 / 返回值 / 本地快照各 parse 一次；S-18 refine 在契约边界；表单复用契约 schema 提示，组件不重复校验。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `UploadStatus` 复用 `ArtifactStatusBadge` 渲染不新建组件；头部定稿状态不新增组件；`PersistenceBanner` 三处复用；`diff.ts` / `persistence.ts` 多消费者。
- ☑ **P-5 自动生成文件不手改（§5.5）。** tasks §1-4：生成物只靠 `contract` 生成、`contract --check` 对拍；不改生成器。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** e2e 取证走 normal 场景持久记录 + 介入历史界面，不加窗口钩子；aborted 从系统边界注入合法事件；diff 期望手写；`page.clock` 推进真实 mock 定时器。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令全部沿用 frontend-workbench 脚本；不新增工具 / 依赖；`pnpm test` 不改。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** tasks 头部外部闸门如实；§0 两次核对 + 本轮第三次核对均为“v1 未 Handoff”；`specs/README.md` 本 feature 行“待 A 复核 / Implement 外部基线 blocked”与事实一致（只读核对；R5 结论由实施侧更新该行）。
- ☑ **C-02 契约闭环。** 30 个方法在 T-A10～T-A21 各有实现任务与单测；矩阵 23 个 action 在 T-A06 以判别联合建模并约束 kind。
- ☑ **C-03 事件与状态闭环。** T-A14 / T-A18 / T-A19 / T-A20 / T-A21 覆盖 pendingMerge 两条清除路径、同 run 匹配、failed / aborted 保留、排队与 pendingRunId 转交、inbox 生成 / 已读 / resolved；T-G01 e2e 正负向。
- ☑ **C-04 场景定义足以稳定验证。** T-A07 / T-A08 十个样例逐行对照 plan 表；T-A09 九场景；T-A10 / T-A11 / T-A12 场景读写行为；T-G05 遍历九场景 e2e；非 normal 不触碰两个 key 有 Storage spy 断言。
- ☑ **C-05 版本与定稿闭环。** T-A16 不可变历史；T-A19 accept / revert / resolve_conflict；T-A17 原子定稿 + 未决项拒绝 + final / cancelled 只读门（含删除来源与带封存作业 jobId 的 submitIntake）；T-F07 正负向 e2e；无反向方法。
- ☑ **C-06 隐私与本地持久化自洽。** T-A11 白名单（不含粘贴正文 / File）、512 KiB / 配额降级保留最后快照、损坏保留原 key；T-C01 File 只取元数据；T-G04 e2e；fixture 合成样例。
- ☑ **C-07 视觉与工程纪律。** T-A23 / T-D03 不新增色值与玻璃类，`check --only colors/glass` 纳入；差异行 / 徽标用文字 + 图标。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** tasks / analyze 未引用 D-015；D-017 仅在 S-17 作边界引用。

**合计**：25 项中 24 ☑、1 ☐（P-1，因 B-11）。（R6 注：R5 实际复选框为 26 项、25 ☑ / 1 ☐，原文算术笔误，结论不变；见 R6 S-26。）

### 阶段说明（不设复选框）

- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，不声称任何 AC 已通过。
- **Implement 前置**（累计）：(1) R4 ✓；(2) Tasks 复核：V-02 ✓、**P-1 ☐（B-11）→ 需 R6 定向补勾**；(3) `implementation_base_sha` = PENDING（frontend-workbench v1 Gate 2 + Handoff 合入 main 后登记，不得用 `b991059` 等中间提交替代）；(4) Analyze 复核 I-01b ✓。**Implement 不得开工**。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项在 v2 Gate 1 + 壳方交付 + T-H01～T-H03 前**必须报“未收敛（外部阻塞）”**；D-019 / 剪藏预览 / 复核结果 / 验证队列不计入本 feature。

## 最小关闭要求与下一步

1. 实施侧（Tasks 角色）按 B-11 (a) 修正 tasks.md §3 / T-C01 / T-H01（或走 (b) 取得 Walter 书面同意并登记）；建议同批处理 S-20（plan §1 / §6 各一行）、S-23 / S-24（tasks 一句话）、S-21（analyze 最终状态编号）；S-19 / S-22 可留到 Implement。修正后 A **新开会话** R6 定向复核：只核 B-11 关闭与 V-02 / I-01b 未回退，补勾 P-1。
2. R6 通过后 Implement 仍须等 frontend-workbench v1 Handoff 合入 main 的 commit 登记为 `implementation_base_sha`；届时按 tasks §0 / §7 重新核对前端事实，如有出入先修 tasks 并重跑 Analyze。
3. 实施侧更新 `specs/README.md` 本 feature 行（R5 未通过 → 待 B-11 修正与 R6）；本审核员不改该文件。plan / README / tasks / analyze 的工作区改动与本文件一并由实施侧提交（本审核员未 commit）。

## 结构核验证据（R5，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；无新提交）；git status: M README / M checklist / M plan / ?? analyze.md / ?? tasks.md（审查前后一致）
INPUTS    spec ed0f6c6c…942d9 | plan 981ecc25…81d21 | checklist(含R4) 56181b02…b5075 | tasks 98d080d3…740fc | analyze c97f6cad…2259b | README 66376f8e…dc55e（写入前复核一致）
TASKS     62 任务 / 62 唯一 / 96.5 h / 每项 0.5–2 h / 依赖全部指向更早编号 / 状态均“未开始” / 62×blocked_by v1 / H 4×blocked_by v2
          完成标准↔验证命令条数 1:1（0 例外）；每条标准含 AC 引用（0 例外）；46/46 AC = spec 集合；矩阵 46 行
          “部分前置”均为最终任务祖先（0 例外）；T-G06 / T-G09 的祖先覆盖全部 A–F 任务；184 条 -t/-g 标题均以 WI 开头
FRONTEND  D:/2030/Futures-AI-frontend @ b991059（feat/frontend-workbench）；非 main(85c6cbb)/origin/main(3bf6476) 祖先；review.md“不是 Handoff；Gate 2 尚未批准”
          scripts contract/check/typecheck/lint/test:unit/test:e2e/test ✓；vitest include tests/**/*.spec.ts ✓；playwright testDir ./e2e ✓；@playwright/test 1.64.1 ✓
          硬编码 contracts.spec:248–253 / contract-doc.spec:64 / mock.spec:100；mock.spec:15 glob fixtures/*.json 不递归（9 个）✓
          contract-build: contractSemantics 字符串→§1；fieldRows const/enum；§4/§5 静态五场景；AgentEvent→oneOf；AgentRun(superRefine)∈$defs ✓
          shared/components/{Badge,Loading,EmptyState,ErrorState}.vue ✓；agent/{store,AgentDrawer}.vue ✓；nav.ts 无 jobs 项；real/index.ts 逐方法桩 ✓
DOCS      D-018 §1/§2/§5；interaction §3.3–§3.5/§3.7/§7；designUI §2.4/§3.4/§3.5/§3.9/§5.1/§5.2
AGENTS    §5.1（B-11 依据）、§5.2/§5.5/§5.6、§6（A = claude-fable-5-1 via anthropic，继承 R3 探活，未重探 bridge）
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md；其余五个 dirty 文件原样保留；git diff --check 见回复
```

---

# R4（2026-10-28，第四轮：B-09 / B-10 plan 补正定向复核；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD **`8bd1b31`**（与 R3 相同；本轮**无新提交**）。审核对象不是提交，而是固定基线 + 真实工作区 diff：启动时 `git status --porcelain` 为 ` M specs/README.md`、` M specs/workbench-interaction/checklist.md`、` M specs/workbench-interaction/plan.md`（三个未提交改动，**工作区不干净**，本轮如实记录；plan / README 的改动由本审核员原样保留、未触碰）。
- 冻结输入（审查前、写入前两次核对一致）：spec raw SHA256 `ed0f6c6c…942d9`（v1.1，未变）；plan raw SHA256 `981ecc25…81d21`（306 行 = 304 + 头部 2 行）；原 checklist（含 R3）raw SHA256 `0999eb21…ef35e`；`specs/README.md` raw SHA256 `8a1b5f0e…ca0b6`（只读）；`git diff --no-ext-diff --no-color HEAD -- specs/workbench-interaction/plan.md` 输出 SHA256 `24940ae4…8df68`。本审核员亲自读取该 diff 全文（12 个 hunk，+14/−12），未按调度摘要直接勾选。
- **行号口径**：plan 本轮仅在页首新增 2 行（:6 补正说明、:7 派工记录），其余均为行内替换、无增删行；因此 R3 / R2 引用的 plan 行号自第 5 行之后**一律 +2**（如 R3 的 plan:84 → 现 :86、:87 → :89、:81 → :83、:176 → :178、:196 → :198、:205 → :207）。下文行号均为当前 plan（306 行）行号。
- 重读：AGENTS.md、`docs/plan.md`、spec.md、plan.md（分段读完）、checklist.md（R3/R2/R1 分段读完）、`templates/checklist.md`、D-018（`docs/decisions/20261028-interaction-supplement.md`）、`docs/interaction.md` §3.4 / §3.5 / §3.7、`docs/designUI.md` §2.4 / §3.4 / §3.5 / §5.2、`specs/README.md`（只读）。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（继承 R3 探活证据，见页首；本轮未重探 bridge）。派工脱敏记录：角色 A / 任务 Checklist R4 / 基线 `8bd1b31` + 上述 diff 哈希 / provider `anthropic` / 继承失败类别 `claude-bridge` quota·rate·spend_limit（exit 1，R3 窗口）。Plan 补正者 claude-opus-5-5 via anthropic，独立会话。
- **未执行**：未安装依赖、未运行测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / docs / 状态表 / 其他 feature、未创建 tasks / review 或任何新文件、未 commit / push / merge / 切分支。唯一写入文件为本文件（新增 §R4、页首说明、把 §R3 的 24 个 `[x]` / `[ ]` 改为 ☑ / ☐ 文字；R3 内容未动）。

## 结论（R4）：**通过**（定向）

- **B-09 闭环、B-10 闭环**（逐项见下）；R2 的 B-01～B-08、D-018 的显式 / 二次确认 / 不自动定稿 / 不可撤销 / v1 只做①+派生标记、spec §2 非目标 scope **均未回退**（diff 12 个 hunk 全部落在 R3 列出的 B-09 / B-10 位置，未触及方法表、19 行矩阵、九场景行为表、rerun 迁移表、§4.5 / §4.7、§1.1 所有权、§3 持久化规则、§6～§8）。
- 本轮核的是**文档设计闭环**；未实现不计为 defect；未新增产品需求；未引入猜测性竞态复杂度（§4.6 的“同一次 mock 状态提交”只是把 R3 要求的“原子地”落到 R2 已定的“mock 层唯一可变状态”上，不加锁、不加状态机）。
- **允许进入 Tasks**。Implement 前置不变：(1) Tasks 头部登记 frontend-workbench v1 Handoff SHA；(2) Tasks 经 A 新会话复核（V-02）补勾；(3) Analyze 报告结论经 A 复核（I-01b）。AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍为外部阻塞，Converge 必报“未收敛（外部阻塞）”。S-11～S-17 仍**未关闭**（归 Tasks，非到期阻断）。

## 逐 B 复核（B-09 / B-10）

| # | R3 最小关闭要求 | 补正落点（当前 plan 行号；diff 核实） | 核实 | 判定 |
|---|---|---|---|---|
| **B-09** `SourceNote` 发布日期字段 | :84 改回 `publishedAt`（或明确表示来源发布日期的名字）；在日期类型说明处注明与定稿 `finalizedAt` 无关 | :86 `SourceNote` = `{purpose(非空), reliability(high/medium/low/unknown), publishedAt:null或日期（材料发布日期，不是定稿时间）, validUntil:null或日期, scopeNote:null或文本}`；:198 日期类型：`publishedAt` / `validUntil` 与作业日期用 `TradingDate`（`YYYY-MM-DD`），定稿时间 `finalizedAt`（`FinalSnapshot` 与 `Deliverable` 定稿元数据）为 ISO 8601 带偏移时间戳，并明写“`publishedAt` 指被投放材料自身的发布日期，与交付物定稿时间 `finalizedAt` 是不同概念，不互换、不同名”；:238 AC-003-3 payload 断言列出 `sourceNote.purpose/reliability/publishedAt/validUntil/scopeNote`；:266 AC-008-1 对拍含 `SourceNote.publishedAt` | 与 spec:74 “时效（发布日期 / 有效期）”语义一致；与 D-018 §3 剪藏 frontmatter `published_at` 同义；全文 grep `finalizedAt` 仅出现在 :89 / :92 / :178 / :198 / :207（均为交付物 / 快照语境），`SourceNote` 语境已无 `finalizedAt`；类型分离（日期 vs 时间戳）使两者在契约层不可混用；:194 持久化白名单仍含 `sourceNote`，:124 ingest payload 仍含 `sourceNote`，AC-003-3 的断言落点可用；无需改 spec | **闭环** |
| **B-10** 交付物 `draft / final` 独立字段 | `Deliverable` 增含 `final` 字面量的状态 + 快照 / 时间 / 版本锚；`DeliverableStatusLabel`（草稿 / 已定稿）；§4.6 `finalizeDeliverable` 成功时原子 `draft→final` + `job.delivered`；j-delivered 初始 `final`、其余 `draft`；定稿信息“已定稿 vN · 时间” | (a) :89 `Deliverable` 交付物级定稿元数据 `{deliverableStatus:'draft'或'final', finalSnapshotId:null或id, finalRevisionNumber:null或正整数, finalizedAt:null或时间戳}`，draft 时三锚均 null，final 时均非空且与对应 `FinalSnapshot` 一致；明写独立于 `JobStatus` 与 `Artifact` / `Block` 的 `status`，只由 `finalizeDeliverable` 改变，UI 与 mock 都不从 job.status 或快照存在推导。(b) :83 展示映射新增 `DeliverableStatusLabel`（draft=草稿 / final=已定稿），走同一“契约导出、徽标只消费”口径。(c) :166 样例规则：仅 j-delivered 初始 `final`，其余样例与 `createJob` 新建交付物初始 `draft`、锚为 null；:178 j-delivered 行写明三锚与该 snapshot 一致；:202 §4.1 createJob 初始交付物 `deliverableStatus=draft`、锚 null。(d) :207 §4.6：未决项 → `validation_error`，不生成快照、不改作业状态、**交付物保持 draft**（不局部修改）；成功时在同一次 mock 状态提交内原子完成：深拷贝 `FinalSnapshot` → `deliverableStatus draft→final` + 写入 `finalSnapshotId` / `finalRevisionNumber`（该 revision 的 number）/ `finalizedAt`（=快照 finalizedAt）→ `job.status→delivered` → 唯一一条 `finalize` 事件；“不存在只完成其中一部分的中间状态”。(e) :207 头部显示按 `DeliverableStatusLabel`：final 为“已定稿 vN · 时间”（N=finalRevisionNumber，时间=finalizedAt），draft 为“草稿”；只读交付物元数据、不从 job.status 推导、不新增组件。(f) :259 AC-006-7 落点改为“同一次提交内快照 + `deliverableStatus=final`（定稿锚与快照一致）+ delivered，头部‘已定稿 vN · 时间’+ 只读；未决项被拒时快照 / 交付物 draft / 作业状态均不变”；:266 AC-008-1 对拍含 `Deliverable` 定稿元数据与 `DeliverableStatusLabel` | 对照 spec:126（`draft → final`、置 delivered、显示定稿信息、只读、不自动定稿）、Q-013（契约标识符 `final`）、interaction §3.5 / §3.7（交付物另有 `draft / final`；不可撤销；v1 只做①）、designUI §5.2（元数据含定稿状态）/ §3.4（“已定稿 vN · 时间”）逐项有落点。`deliverableStatus` 命名避开 Block / Artifact 共同字段 `status`（draft/provisional/confirmed/conflict），AC-006-8 块级徽与交付物级头部不混淆。不可撤销：无任何反向方法，final 后含“重复定稿”在内的一切领域写方法在契约入口拒绝（:207 原文保留）；不自动：唯一入口 `finalizeDeliverable` 经 `FinalizeDialog` 二次确认，:216 rerun 成功终态仍“不自动 delivered”，cancelled 作业交付物不被置 final。null / non-null 不变量在 draft / final 两态都写死，e2e 可直接断言。`fai.jobs.v1`（:69）已含“交付物/定稿快照”，元数据随之持久化。无需改 spec、不动 docs | **闭环** |

## 未回退核对（B-01～B-08 与 D-018 scope）

| 对象 | 核对方式 | 结果 |
|---|---|---|
| B-01 方法集与动作矩阵 | diff 未触及 :98–:114 方法表、:122–:144 矩阵；`finalizeDeliverable` 仍为 kind `finalize` 的唯一方法，仍“一次确认只产生一条定稿事件”，§4.6 新文与 :142 矩阵行一致 | 未回退 |
| B-02 九场景行为表与样例 | diff 只改 :166 附加一句样例规则与 :178 j-delivered 说明列；九场景 × 读/写/快照表、其余八个样例行原样 | 未回退 |
| B-03 rerun 迁移表 | :211–:220 未在 diff 中 | 未回退 |
| B-04 类型表 | 仅 :83 / :86 / :89 三行按 B-09 / B-10 扩展，其余类型未动；camelCase 规则 :96 未动 | 未回退 |
| B-05 版本 / 定稿闭环 | :206 §4.5 accept / revert / resolve_conflict 未在 diff；:207 §4.6 的未决项拒绝 → validation_error、final 后领域写方法拒绝清单、cancelled 只读、快照与历史不可变等原文保留，仅插入原子提交与头部显示句 | 未回退 |
| B-06 所有权 / 基线 / blocked_by | §1.1、:16–:18、§6 回滚、§7、§8 未在 diff | 未回退 |
| B-07 持久化 / 隐私 | :194–:197 未在 diff（:198 仅日期类型说明） | 未回退 |
| B-08 角标 / 收件箱 | :68–:70、:93 未在 diff | 未回退 |
| D-018 §1 scope | 新文未加撤销 / 自动定稿 / 归档“未审阅”/ 效果②～⑥；v1 仍只做冻结 + 派生标记（spec §2 非目标未变） | 一致 |
| spec v1.1 | SHA256 与 R3 基线一致，46 AC 未变 | 未变 |

## S-11～S-17 状态（不阻断、不计入判定）

| # | 状态 |
|---|---|
| S-11 展示映射入 CONTRACT.md 的机制 | **未关闭**——`tasks.md` 不存在；B-10 的 `DeliverableStatusLabel` 走同一机制，Tasks A 组一并落实 |
| S-12 revision 载荷按 artifact kind 可辨识 | **未关闭**——Tasks 定义 |
| S-13 `getJob` 结果 `Job \| null` | **未关闭**——Tasks 定义 |
| S-14 run failed 以 `conflict` 呈现 + `job.reason` 说明 | **未关闭**——Tasks 定义 |
| S-15 抽屉普通追问是否设置 `activeRunId` | **未关闭**——Tasks 定义 + mock 状态机单测 |
| S-16 kind 为 v1 子集的 CONTRACT.md 注记 | **未关闭**——Tasks A 组 |
| S-17 `origin=derived` 来源徽文案“内部生成” | **未关闭**——Tasks 定义 |

七项均属 Tasks 落实事项，当前阶段未到期，不是阻断；不得以“计划将在 Tasks 落实”视为已完成。

## 新建议（R4；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-18 | plan:89 / :96 | `Deliverable` 定稿元数据的 draft→三锚 null、final→三锚非空不变量，建议在契约入口的一次 parse（:96 口径）用 zod refine 表达，而不是在组件内再检查；AC-008-1 的 schema 单测用 j-delivered 与 j-deliver 两个 fixture 各过一次 parse 即可覆盖。Tasks A 组写明即可。 |

## 当前有效检查项（R4 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 未变（SHA256 一致），46 条 AC 编号集合未变。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；本轮补正未引入新需求问题，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；补正未把 D-018 效果 ②～⑥ 或撤销 / 归档带入 v1。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** spec:126 “交付物状态 `draft → final`”现有 :83 / :89 / :166 / :178 / :202 / :207 / :259 落点（B-10 闭环）；其余 what 的落点沿用 R2（B-01～B-08 未回退）。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** spec:74 ↔ plan:86 / :198（B-09 闭环）；R2 消除的三处冲突与 R3 发现的两处均未复发；全文无残留同名异义。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** interaction §3.7 / designUI §5.2 的交付物 `draft / final` 已建模；D-018 §1 显式 / 二次确认 / 不自动 / 不可撤销 / v1 只做① 与 §4.6 一致；designUI §3.4 “已定稿 vN · 时间”落在 :207；D-018 §3 `published_at` 与 `SourceNote.publishedAt` 同义；D-018 §5 `/learning` 不改（:292）；S-16 / S-17 仍为非冲突备注。
- ☑ **I-03 前端基线事实核对。** 沿用 R2（本轮变更不涉及前端代码事实；未重读前端分支）。
- ☑ **I-04 文件边界与回滚一致。** 新增字段 / Label 均在 `contracts/**` 本 feature 所有权内；:16–:18 / :286 / spec §4 未变。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条映射沿用 R2（43 ✓ + 3 ◐ 外部阻塞）；R3 标 ✓* 的 AC-003-3 / AC-006-7 / AC-008-1 / AC-008-4 的断言字段名与状态字面量现已确定（:238 / :259 / :266），升为 ✓。
- ☑ **V-03 静态守卫声称与真实脚本一致。** plan:184 未变。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 补正只加 spec / docs 已要求的状态字段、Label 与原子提交说明；不加撤销、自动定稿、归档、锁或新状态机；S-18 为单点 refine 建议。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** :96 未变；:207 “只读交付物元数据，不从 job.status 推导”与之一致。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** :207 明写“不新增组件”，头部显示复用交付台现有头部。
- ☑ **P-5 自动生成文件不手改（§5.5）。** 未变；新 Label / 字段经 `contractSchemas` + 生成器进 CONTRACT.md（机制细节仍为 S-11）。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 未变。
- ☑ **P-7 按仓库现有流程（§5.7）。** 未变。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。**（B-06）未变；`specs/README.md` 本 feature 行已登记“R3 未通过 → plan 补正 → 待 R4”（只读核对，与本轮事实一致；R4 结论由实施侧更新该行）。
- ☑ **C-02 契约闭环。**（B-01）方法集与 19 行矩阵未变。
- ☑ **C-03 事件与状态闭环。**（B-02c / B-03 / B-05）未变。
- ☑ **C-04 场景定义足以稳定验证。**（B-02）九场景 × 九样例未变；新增的交付物初始状态规则覆盖全部样例与 createJob。
- ☑ **C-05 版本与定稿闭环。**（B-05 + B-10）accept / revert / resolve_conflict / 定稿检查点 / final 后只读未变；交付物级状态与三锚、原子提交、头部显示现已闭环。
- ☑ **C-06 隐私与本地持久化自洽。**（B-07）未变；`sourceNote.publishedAt` 为日期字符串，持久化子集不变。
- ☑ **C-07 视觉与工程纪律。** 未变；`DeliverableStatusLabel` 只提供文案，不新增色值；S-17 文案不新增色值。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 未变。

**合计**：24 项中 24 ☑、0 ☐。

### 阶段说明（不设复选框；与 R3 相同，本轮无新产物）

- **I-01b（Analyze）/ V-02（Tasks）**：`tasks.md` 仍不存在，阶段未到，不倒置流程；R4 通过后 Tasks 产出，再由 A 新会话复核补勾。
- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无。
- **Implement 前置**（累计，当前仅 (1) 满足）：(1) B-09 / B-10 修正后 R4 通过 ✓；(2) Tasks 经 A 复核补勾；(3) Tasks 头部登记 frontend-workbench v1 Handoff SHA；(4) Analyze 报告结论经 A 复核。

### 逐 AC 映射（R4 增量；未列出的 41 条沿用 R2 判定，plan 行号按本轮口径 +2）

| AC | R3 | R4 | 说明 |
|---|---|---|---|
| AC-003-3 | ✓* | ✓ | :86 / :124 / :194 / :238：`sourceNote` 五字段名确定，payload 断言可写 |
| AC-006-7 | ✓* | ✓ | :89 / :142 / :207 / :259：`deliverableStatus=final` + 三锚 + delivered + 头部文案 + 只读；未决项拒绝时三者均不变 |
| AC-006-8 | ✓ | ✓ | 块级徽不变；交付物级状态由头部按 `DeliverableStatusLabel` 显示，不与块徽混淆 |
| AC-008-1 / AC-008-4 | ✓* | ✓ | :266 对拍含新字段与 Label；CONTRACT.md 2.0.0 变更说明随之 |
| AC-003-1 / AC-005-5 / AC-007-4 | ◐ | ◐ | 外部阻塞（v2）不变；Converge 必报“未收敛（外部阻塞）” |

## 最小关闭要求与下一步

1. **R4 通过**；B-09 / B-10 关闭，无需再做 Plan 补正轮次。
2. 进入 **Tasks**：按 plan §8 A～H 分组；A 组一并落实 S-11～S-18；H 组显式 `blocked_by: frontend-workbench-v2`；头部登记 frontend-workbench v1 Handoff SHA（未登记则 Implement 不得开工）。
3. Tasks 产出后由 A（新开独立会话）复核 V-02 / I-01b 并在本文件补勾；Analyze 报告结论由 A 复核；均不得由本轮任何勾选代替。
4. Converge 口径不变：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项为外部阻塞；D-019 / 剪藏预览 / 复核结果不计入本 feature。
5. 实施侧更新 `specs/README.md` 本 feature 行（R4 通过 → 可进入 Tasks）；本审核员不改该文件。plan.md / specs/README.md 的工作区改动与本文件一并由实施侧提交（本审核员未 commit）。

## 结构核验证据（R4，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；无新提交）；启动时 git status: M plan.md / M checklist.md / M specs/README.md
SPEC      SHA256 ed0f6c6c…942d9（审查前后一致；v1.1，46 AC）
PLAN      SHA256 981ecc25…81d21（审查前后一致）；306 行 = 304 + 页首 2 行；R3/R2 行号自 :5 后 +2
DIFF      git diff HEAD -- plan.md 输出 SHA256 24940ae4…8df68；12 hunk，+14/−12：:6–7 头部、:83 Label、:86 SourceNote、
          :89 Deliverable、:166 样例规则、:178 j-delivered、:198 日期类型、:202 §4.1、:207 §4.6、:238 / :259 / :266 §5
TERMS     plan grep finalizedAt → :89 :92 :178 :198 :207（全部交付物/快照语境）；publishedAt → :6 :86 :198 :238 :266；
          残留“发布”仅 :86 / :198（材料发布日期，正确）；deliverableStatus/DeliverableStatusLabel → :6 :83 :89 :178 :202 :207 :259 :266
DOCS      D-018 §1 显式/二次确认/不自动/不可撤销/v1 只做①；§3 published_at；interaction §3.5/§3.7 draft/final；
          designUI §5.2 元数据含定稿状态、§3.4 “已定稿 vN · 时间”、§2.4 “内部生成”
AGENTS    §6：A 首选 claude-fable-5-1；R4 走 anthropic（继承 R3 探活，未重探 bridge）
PROBE     继承 R3：claude-bridge/claude-fable-5-1 exit 1（quota/rate/spend_limit 类）；anthropic/claude-fable-5-1 exit 0；本轮未新探
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md；plan.md / specs/README.md 工作区改动原样保留；git diff --check 见回复
```

---

# R3（2026-10-28，第三轮：spec v1.1 术语同步定向复核；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，审查提交 **`8bd1b31`**（HEAD；启动前 `git status --short` 为空，工作区干净）。本 worktree 由本会话串行独占 checklist 写权限；调度会话只读。
- 基线变化：`f944149`（R2 通过时提交）→ `c238bd8`（spec v1.1 术语同步 + plan 同步，Q-013）→ `8bd1b31`（Walter 批准，Gate 1 重新通过，v1.1 冻结）。比较 `git diff f944149 8bd1b31 -- specs/workbench-interaction/{spec,plan}.md`：spec +11/−9（205 行）、plan +26/−26（304 行，**仅行内替换、无增删行，R2 的 plan 行号全部仍有效**）。
- 同批次变更的只读参考：`AGENTS.md`（§6 模型路由）、`docs/plan.md`、`docs/interaction.md`、`docs/designUI.md`、`docs/decisions/20261028-interaction-supplement.md`（D-018）、`specs/README.md`；均已完整读取。`checklist-review-request.md` 为 R2 历史输入，不覆盖本轮指令。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（探活与切换原因见页首）。独立新会话，与实施隔离；本轮无实施会话并行写入本 worktree。派工脱敏记录：角色 A / 任务 Checklist R3 / 基线 `8bd1b31` / provider `anthropic` / 失败类别 `claude-bridge` quota·rate·spend_limit（exit 1）。
- **未执行**：未安装依赖、未运行测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / docs / 状态表 / 其他 feature、未 commit / push / merge / 切分支。唯一写入文件为本文件（含把 §R2 的 24 个 `[x]` 改为 ☑ 文字，内容未动）。

## 结论（R3）：**未通过**（定向；阻断 2 项，均为 plan 内一至三行的设计补全，不需回流 Clarify、不动 v1.1 spec）

- spec v1.1 的术语同步**本身合格**：46 条 AC 编号集合与 `f944149` 一致（46/46），仅 AC-006-7、AC-007-3 文字"发布→定稿"，语义不变；R-006 what 增加 D-018 §1 的定稿定义（`draft → final`、不自动定稿）；非目标"学习区→格物致知"；Q-001 / Q-008 措辞；新增 Q-013 并已裁定。spec 未误改其他领域：R-003:74 来源说明"时效（发布日期 / 有效期）"**正确保留**（此"发布"指来源文档的发布日期，与 D-018 定稿无关）。
- plan 的同步**有一处误改、一处遗漏**：
  - **B-09** plan:84 把来源说明 `SourceNote.publishedAt` 改成了 `finalizedAt`——这是来源文档的发布日期（spec:74；plan:196 仍写"发布日期/有效期"），不是定稿时间；属关键词替换误伤其他领域语义，并与 plan:90 `FinalSnapshot.finalizedAt` 同名异义。
  - **B-10** spec:126 / Q-013 新增的"交付物状态 `draft → final`"（契约标识符 `final`）在 plan 中没有任何落点：`Deliverable`（plan:87）无定稿状态字段，展示映射（plan:81）无对应 Label，`FinalSnapshot`（plan:90）只是快照对象；只读与"定稿信息"目前完全由 `job.status=delivered` + 快照存在推导。
- 其余 24 处 plan 改动（组件名 `FinalizeDialog`、`finalizeDeliverable`、kind `finalize`、`FinalSnapshot`/`finalizedAt`（快照）、场景与样例文案、人工验收 M-08、§7 导航"格物致知"（`/learning` 不改）、§8 F 组）均为同义替换，逐处核对与 spec v1.1 / D-018 §1·§5 / interaction §3.5·§3.7 / designUI §3.4·§5.2 一致，**未改变 R2 已闭环的方法 / 场景 / 状态迁移 / 版本语义**（B-01～B-08 不回退）。
- S-11～S-15 **未关闭**（见下节）；新建议 S-16、S-17 不阻断。
- **不允许进入 Tasks**，直到 B-09 / B-10 在 plan 内修正并由 A（新开会话）做 R4 定向复核。Implement 仍另需 v1 Handoff SHA 与 Tasks 复核（见阶段说明）。本轮不因"用户说已完成"放行任何未到期阶段。

## 术语变更逐处核对（`git diff f944149 8bd1b31`）

| 位置 | 变更 | 核对依据 | 判定 |
|---|---|---|---|
| spec:6–7 页首 | 新增 v1.1 记录与 D-018 来源 | AGENTS §2 第 8 步（回流 Clarify → 重过 Gate 1）；`8bd1b31` 提交信息 | ✓ |
| spec:24 / :31 | 目标"定稿快照"；非目标"格物致知" | D-018 §1 / §5；Q-013 | ✓（非目标仍排除学习循环产品区） |
| spec:126（R-006 what） | "定稿（D-018 §1）：…交付物状态 `draft → final`…v1 不自动定稿" | interaction §3.5 / §3.7；designUI §5.2 | ✓ 需求面；**plan 无落点 → B-10** |
| spec:135 AC-006-7、:143、:149 AC-007-3 | 发布→定稿 | 语义不变 | ✓ |
| spec:194 Q-001、:200 Q-008、:205 Q-013 | 措辞与新裁定 | Walter 2026-10-28 | ✓ |
| spec:74 R-003 | **未改**"时效（发布日期 / 有效期）" | 来源文档发布日期 ≠ 定稿；D-018 §3 剪藏 frontmatter 亦用 `published_at` | ✓ 正确保留 |
| plan:50 `FinalizeDialog`、:55 二次确认清单、:67 定稿快照、:111 `finalizeDeliverable`、:118 定稿未决项、:141–142 矩阵（kind `finalize`，附 D-018 §1）、:159–160 / :170 / :175–176 场景样例、:185–186 e2e 与 M-08、:204–206 §4.5–4.7、:214 / :216 迁移表、:257 / :261 §5、:302 §8 | publish→finalize / 发布→定稿 | 同义替换；B-01/B-02/B-03/B-05 的闭环内容逐字对照未变 | ✓ |
| plan:83 kind 列表 `publish`→`finalize` | 13 种数量不变 | interaction §3.4 示意表把"定稿"归 `approve`，本 feature 自 R1 起即以独立 kind 承载（R1 已接受"schema 以 feature spec 为准"） | ✓（S-16 备注） |
| plan:90 `PublishSnapshot{publishedAt}`→`FinalSnapshot{finalizedAt}` | 快照对象 | 定稿时间，语义正确 | ✓ |
| **plan:84 `SourceNote.publishedAt`→`finalizedAt`** | 来源说明时效字段 | spec:74、plan:196 均为"发布日期"；与 :90 同名异义 | **✗ B-09** |
| plan:290 §7 导航"学习"→"格物致知"（路由 `/learning`） | v2 前置变更描述 | D-018 §5；designUI §3.1 / §3.10；`specs/README.md` 跨 feature 待同步行 | ✓ |

## 阻断项（R3；均为设计补全，plan 内修正，不动 spec）

| # | 严重度 | 位置 | 问题 | 受影响 AC | 最小关闭要求 | 分类 |
|---|---|---|---|---|---|---|
| **B-09** | 中（会进入契约类型、`CONTRACT.md`、AC-003-3 的 payload 断言与持久化子集，命名与 `FinalSnapshot.finalizedAt` 冲突） | plan:84 | `SourceNote` 的时效字段被术语替换误改为 `finalizedAt`；spec:74 该字段语义为来源文档**发布日期**，plan:196 日期类型说明仍称"发布日期/有效期" | AC-003-3（payload 字段名）、AC-008-1 / AC-008-4（字段清单与文档） | plan:84 改回 `publishedAt`（或其他明确表示"来源发布日期"的名字，如 `sourcePublishedAt`），并在 :196 或 :94 命名对照处注明"来源说明的 publishedAt 为材料发布日期，与定稿 `finalizedAt` 无关" | 设计补全 |
| **B-10** | 中（需求 what 与 Q-013 承诺的契约标识符无实现落点；Tasks 无法确定是否建字段、e2e 无法断言"交付物状态 final"） | plan:81 / :87 / :90 / :176 / :205 | spec:126 要求"交付物状态 `draft → final`"、Q-013 要求契约标识符含 `final`、interaction §3.7 "交付物另有定稿状态 `draft / final`"、designUI §5.2 交付物元数据含定稿状态、§3.4 定稿后徽章"已定稿 vN · 时间"；plan 的 `Deliverable` 没有该状态字段，展示映射无 Label，只读/定稿信息由 `job.status` 与快照存在间接推导 | AC-006-7（定稿信息 / 只读的断言依据）、AC-006-8（交付台块级徽之外的交付物级状态显示）、AC-008-1 / AC-008-4 | plan:87 `Deliverable` 增加元数据 `{status:'draft'\|'final', finalSnapshotId:null\|id, finalizedAt:null\|ts, finalRevisionNumber?}`（命名由实施者定，但须含 `final` 字面量）；plan:81 增 `DeliverableStatusLabel`（草稿 / 已定稿）；§4.6 写明 `finalizeDeliverable` 成功时原子地 `draft→final` 与 `job.delivered`，j-delivered 样例为 `final`，其他样例为 `draft`；定稿信息显示"已定稿 vN · 时间"（designUI §3.4）。无需改 spec | 设计补全 |

## 新建议（R3；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-16 | plan:83；interaction §3.4 | interaction §3.4 经 D-018 §4 新增 `source_pref` / `value_fix`（处理台换源 / 手工修正值），且示意表把"定稿"归入 `approve`；本 feature 冻结 spec 的 R-004 不含换源 / 修正值（Q-013 不加 AC），plan 的 13 种 kind（含独立 `finalize`）是 v1 子集。建议 CONTRACT.md 的 kind 说明注明"v1 子集；`source_pref` / `value_fix` 归后续处理台 / data-layer 映射 feature"，避免 Review 时被当作 I-02 冲突。 |
| S-17 | plan:13 / :81 `SourceLabel`；designUI §2.4（v1.1） | designUI §2.4 现规定引用派生内容时来源徽文案为"**内部生成**"（根来源索引归 D-017 / 知识库 feature，非本 feature）。Tasks 中把 `origin=derived` 的来源徽文字定为"内部生成"（spec §4：界面细则以 designUI 为准），AC-005-1 / AC-006-8 的徽标断言据此写；不新增色值。 |

**知悉（非缺陷）**：同批 docs 还新增了 D-019 角色芯片 / 成本显示（designUI §3.6）、交付台"复核结果"（§3.4）、采集台"剪藏预览"（§3.4）。这些不在 v1.1 冻结 spec 内（Q-013 明确不加 AC），归后续 feature；本轮不计入本 feature 缺口，Converge 亦不应以此报未收敛。

## S-11～S-15 状态（R2 遗留；按实际产物判断）

| # | 依据行（本轮核对未变） | 状态 |
|---|---|---|
| S-11 展示映射入 CONTRACT.md 的机制 | plan:16 / :81 / :95 未变 | **未关闭**——`tasks.md` 不存在，无 A 组任务可核；维持"Tasks A 组写明机制"，由 A 在 Tasks 复核时验证。B-10 新增的 `DeliverableStatusLabel` 走同一机制 |
| S-12 revision 载荷按 artifact kind 可辨识 | plan:80 / :89 未变 | **未关闭**——同上，Tasks 中定义 |
| S-13 `getJob` 结果 `Job \| null`（empty 场景） | plan:115 / :153 未变 | **未关闭**——同上 |
| S-14 run failed 以 `conflict` 呈现 + `job.reason` 的文档说明 | plan:169 / :215 未变 | **未关闭**——同上；CONTRACT.md `StageStateLabel` 说明在 Tasks 落实 |
| S-15 抽屉普通追问 `send({jobContext})` 是否设置 `activeRunId` | plan:116 / :174 / :203 未变 | **未关闭**——同上；mock 状态机单测覆盖在 Tasks 落实 |

五项均不阻断、不改变本轮判定；不得以"计划将在 Tasks 落实"视为已完成，Tasks 产出后由 A 逐项核。

## 当前有效检查项（R3 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** v1.1 46 条 AC（5/5/6/5/6/8/5/4/2）编号集合与 v1.0 一致，验证形态未变。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；Q-013 融入位置（页首、§2、R-006、AC-006-7、R-007、AC-007-3、Q-001、Q-008）逐处核实存在。
- ☑ **N-03 目标与非目标边界清晰。** 非目标"格物致知"仍排除学习循环产品区；D-018 §1 效果 ②～⑥ 不在本 feature（spec:126 只要求快照 + delivered + 只读，与 interaction §3.5 "v1 只做 ①" 一致）。
- ☐ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 未满足：spec:126 "交付物状态 `draft → final`"无落点（**B-10**）。其余 what 的落点沿用 R2（B-01～B-08 内容未回退）。

### 一致性

- ☐ **I-01a spec ↔ plan 无冲突。** 未满足：plan:84 `SourceNote.finalizedAt` 与 spec:74 "时效（发布日期）"语义冲突（**B-09**）。R2 消除的三处冲突未复发。
- ☐ **I-02 与 docs/ 决策与 ADR 无冲突。** 未满足：interaction §3.7 / designUI §5.2 明确"交付物另有定稿状态 `draft / final`"，plan 未建模（**B-10**，与 N-04 同因）。其余：D-018 §1（显式定稿、二次确认、不自动定稿、v1 只做冻结）与 plan §4.6 一致；D-018 §5（路由 `/learning` 不改）与 plan:290 一致；S-16 / S-17 为非冲突备注。
- ☑ **I-03 前端基线事实核对。** 沿用 R2（本轮变更不涉及前端代码事实；未重读前端分支）。
- ☑ **I-04 文件边界与回滚一致。** 重命名均在 `frontend/src/jobs/**` 与 `contracts/**` 本 feature 所有权内；:16–18 / :289 / spec §4 未变。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条映射沿用 R2（43 ✓ + 3 ◐ 外部阻塞）；B-09 / B-10 影响的是断言所用字段名与状态字面量，不使 AC 失去测试落点，修正后 §5 行无需改动。
- ☑ **V-03 静态守卫声称与真实脚本一致。** plan:182 未变。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 未变；B-10 的最小修正只加 spec 已要求的状态字段，不加撤销 / 自动定稿（D-018 不可撤销、不自动）。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** plan:95 未变。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `FinalizeDialog` 为 `PublishDialog` 改名，职责未变。
- ☑ **P-5 自动生成文件不手改（§5.5）。** 未变。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 未变。
- ☑ **P-7 按仓库现有流程（§5.7）。** 未变。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。**（B-06）未变；`specs/README.md` 本 feature 行已更新为 v1.1 状态（只读核对）。
- ☑ **C-02 契约闭环。**（B-01）方法集与 19 行矩阵仅改名。
- ☑ **C-03 事件与状态闭环。**（B-02c / B-03 / B-05）未变。
- ☑ **C-04 场景定义足以稳定验证。**（B-02）九场景 × 九样例仅文案改名。
- ☑ **C-05 版本与定稿闭环。**（B-05）accept / revert / resolve_conflict / 定稿检查点 / delivered 只读未变；交付物级状态字段缺口记在 B-10（N-04 / I-02），不重复计。
- ☑ **C-06 隐私与本地持久化自洽。**（B-07）未变；B-09 只涉命名。
- ☑ **C-07 视觉与工程纪律。** 未变；S-17 文案不新增色值。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 未变；新增 D-018 / D-019 引用仅术语与知悉级。

**合计**：24 项中 21 ☑、3 ☐（N-04、I-01a、I-02，同因 B-09 / B-10）。

### 阶段说明（不设复选框；与 R2 相同，本轮无新产物）

- **I-01b（Analyze）/ V-02（Tasks）**：`tasks.md` 仍不存在，阶段未到，不倒置流程；R4 通过后 Tasks 产出，再由 A 复核补勾。
- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无。
- **Implement 前置**（累计，未满足）：(1) B-09 / B-10 修正后 R4 通过；(2) Tasks 经 A 复核补勾；(3) Tasks 头部登记 frontend-workbench v1 Handoff SHA。

### 逐 AC 映射（R3 增量；未列出的 41 条沿用 R2 判定与 plan 行号）

| AC | R2 | R3 | 说明 |
|---|---|---|---|
| AC-003-3 | ✓ | ✓* | 设计落点存在；payload 字段名受 B-09（`SourceNote` 时效字段）影响，修正后无需改 §5 |
| AC-006-7 | ✓ | ✓* | 定稿二次确认 → 快照 + delivered + 只读 的落点未变；"交付物状态 final" 的断言依据缺失（B-10） |
| AC-007-3 | ✓ | ✓ | 文字改名；五个破坏性动作清单不变（:55 / :261） |
| AC-008-1 / AC-008-4 | ✓ | ✓* | 字段清单与 CONTRACT.md 会随 B-09 / B-10 修正自动更新 |
| AC-003-1 / AC-005-5 / AC-007-4 | ◐ | ◐ | 外部阻塞（v2）不变；Converge 必报"未收敛（外部阻塞）" |

✓* = 设计可测，但依赖 B-09 / B-10 修正后的契约命名 / 状态字面量。

## 最小关闭要求与下一步

1. 实施侧（Plan 阶段模型）修正 plan:84（B-09）与 plan:81 / :87 / :205 / :176（B-10）；不改 spec、不改 docs；提交后 A **新开会话**做 R4 定向复核（只核两处与未回退）。
2. R4 通过前**不得进入 Tasks**；Tasks 的 A 组须一并落实 S-11～S-17；H 组 `blocked_by: frontend-workbench-v2`；头部登记 v1 Handoff SHA。
3. Converge 口径不变：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项为外部阻塞；D-019 / 剪藏预览 / 复核结果不计入本 feature。
4. 实施侧更新 `specs/README.md` 本 feature 行（R3 未通过 → 待 plan 修正与 R4）；本审核员不改该文件。

## 结构核验证据（R3，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；启动时 git status --short 为空）
SPEC      f944149→8bd1b31：+11/−9，205 行；"[ ] AC-" 计数 46 = f944149 的 46；R-001～R-009 编号连续
PLAN      f944149→8bd1b31：+26/−26，304 行；无增删行 → R2 引用的 plan 行号全部有效；§5 AC 行 46
TERMS     spec 余留"发布"仅 :74（来源发布日期，正确）；plan 余留"发布"仅 :196（日期类型说明，正确）→ 与 :84 finalizedAt 自相矛盾
          plan "学习/learn" 仅 :290 路由 /learning（正确）；spec 仅 :6 / :31（正确）
KINDS     plan:83 13 种（publish→finalize）；interaction §3.4 现 12 种示意（+source_pref/value_fix，定稿归 approve）→ S-16
DOCS      D-018 §1 定稿效果 v1 只做①；§5 /learning 不改；interaction §3.7 交付物 draft/final；designUI §5.2 元数据含定稿状态、§3.4 "已定稿 vN · 时间"、§2.4 "内部生成"
AGENTS    §6 新增模型路由；A 候选 claude-fable-5-1 → claude-opus-5-5 → gpt-6.1-sol；本轮用首选经 anthropic 通道
PROBE     claude-bridge/claude-fable-5-1 exit 1（quota/rate/spend_limit 类）；anthropic/claude-fable-5-1 exit 0（由调度会话执行，脱敏转记）
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md（git diff --name-only）；git diff --check 无空白问题
```

---

# R2（2026-10-28，第二轮定向复核）

## 基线与范围

- 稳定工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，审查提交 **`630e06f`**（HEAD；工作区干净）。
- 冻结 spec：`cfb6c66`。`git show 630e06f:specs/workbench-interaction/spec.md` 的 blob md5 `7c689362…` 与 `cfb6c66` 一致（工作区文件为 CRLF 检出，`git diff --quiet HEAD` 无差异）；**spec 未被修改**。
- 首轮报告归档 `1d6b54c`；本轮比较 `git diff d52e784 630e06f -- specs/workbench-interaction/plan.md`（plan.md +197/−52 行，304 行）。
- 前端地基 `D:/2030/Futures-AI-frontend` `feat/frontend-workbench`：审核期间该分支由 `5958e54`（T-09）推进到 `fd2d755`（T-11/T-13 合入）；本审核员只读核对了 `src/app/{router,nav}.ts`、`src/main.ts`、`src/contracts/{types,methods}.ts`、`src/contracts/mock/index.ts`、`src/contracts/mock/agent/{long,retry}.ts`、`src/agent/events.ts`、`scripts/contract-build.mjs`、`specs/frontend-workbench/{plan,tasks}.md`。分支移动不影响本轮判定——Plan §1.1 已把实现起点定为 v1 Handoff 后的 SHA，而非任一中间提交。
- `spec/frontend-workbench-v2` 草稿（最新 `150c392`）**未过 Gate 1**，不作为已交付依赖；本轮未读取其内容作为闭环证据。
- **未执行**：未安装依赖、未运行测试或应用、未启动其他 agent、未读用户凭证、未修改 spec / plan / docs / 前端分支、未 commit / push。唯一写入文件为本文件。

## 结论（R2）：**通过**

- 首轮阻断 **B-01～B-08 全部闭环**（逐项见下），建议 **S-01～S-10 全部已处理**；首轮已通过项**无回退**；修订未引入阻断级新矛盾。
- 新发现 **S-11～S-15** 均为建议（不阻断、不计入判定），应在 Tasks A 组（契约与骨架）任务中落实。
- 允许进入 **Tasks**。**Implement 仍阻塞**于 `frontend-workbench` v1 Handoff 合入 SHA（Plan §1.1，Tasks 头部登记后方可建实现分支）；**Converge** 在 v2 未 Gate 1 + 合入前，须将 AC-003-1（工作台入口）、AC-005-5（抽屉上下文标签）、AC-007-4（首页作业轨道角标）列为"未收敛（外部阻塞）"，不得报全量收敛。

## 逐 B 复核（B-01～B-08）

| # | 首轮最小关闭要求 | 修订落点（plan.md 行号） | 核实 | 判定 |
|---|---|---|---|---|
| **B-01** 契约闭环 | 增补写方法 + 动作→方法→kind→payload 矩阵覆盖 spec 全部介入动作 | :96–112 方法表新增 `submitIntervention / mergePending / removeUpload / cancelJob / replyBlockComment / resolveBlockComment / listInbox / markInboxRead / resetMockData`；:120–144 矩阵 19 行 | 五类分析动作各有唯一 `action` 与 kind：批注→framework、追问→ask_why/question、深挖→rewrite、删除→delete、否决→veto（AC-005-3 可逐一断言）；pin_rule 带 `state='candidate'`（AC-005-4）；块批注新建/回复/解决三方法（AC-006-3）；删除来源 / 取消作业有方法且进入二次确认清单（AC-007-3、AC-002-5）；矩阵用到 13 种 kind 全部，不新造 merge 类，`mergePending` 只改 outcome（:144）。`methods.ts` 的 `satisfies RequestMethods<…>` 会强制每个新方法登记语义（已核）。 | **闭环** |
| **B-02** 场景与驱动 | 场景×方法行为表、场景×作业样本表、pending-merge 驱动、合并记录形态、统一 :60/:123 | :146–162 九场景×读/写/快照表；:164–176 九个作业样本（status × 四阶段 × 产物）；:117 删除 `jobScript`，统一经 `send({jobContext})` + 既有 success/failure/retry/long 脚本；:178 终态由同一 runId 驱动；:65 与 :162/:196 统一为"非 normal 不读不写不清两个 key" | 互斥情景分属不同作业（j-running / j-human 分离，j-conflict / j-delivered 各自场景）；`empty/error/slow/boot-error` 对**全部新增读写方法**的返回/拒绝/延迟已定；合并结果 = 原事件 `outcome=merged`（:83、:144）；前端 mock `send` 为每次调用分配 uuid runId（`mock/index.ts:161`，已核），"仅匹配 pendingRunId 的终态才合并"可测；`?agentScript=long` 读取点存在（`mock/index.ts:192`）。 | **闭环** |
| **B-03** 事件与状态闭环 | rerunStage 迁移表；pendingMerge 两条清除路径；横幅目标字段 | :209–218 四行迁移表（无 run / 成功终态 / failed·aborted / 运行中排队）+ 串行执行规则；:206 有 run → 匹配 runId 的 `run.completed`，无 run → 显式 `mergePending`（运行中拒绝）；:201 横幅 = 固定顺序第一个 H（冲突样例第一个 C） | 迁移表给出阶段状态、job.status、revision 变化三列，AC-002-4 的"mock 状态迁移"可断言；AC-004-2 无 run 时仍返回 `pendingMerge=true`，清除路径确定；旧 revision 保留、overlay 不误标合并（R1/R2）；排队请求把 `pendingRunId` 转交后继 run，不丢人的 overlay。 | **闭环** |
| **B-04** 契约类型完整性 | 类型表逐项补字段；契约导出展示映射；chart 块载荷；命名规则 | :80 `Job.reason`；:81 `JobStatusLabel / StageLabel / StageStateLabel / ArtifactStatusLabel / SourceLabel` 由契约导出、徽标只消费；:83 `Intervention` 十字段 + outcome 枚举；:84 `Upload / SourceNote` 字段与 `pending_validation / ingested / quarantined`；:88 `ChartSpec` = designUI §5.1 三元组最小子集 + `SparkSeries` 绑定；:89 `Revision` 七字段 + `BlockComment` 线程/状态；:94 统一 camelCase 并登记 snake_case 对照；:95 schema 进 `contractSchemas` | (a)～(g) 七项均有落点；`SparkSeries` / `Figure` / `TradingDate` / 错误码枚举在基线 `types.ts` 存在（已核）；生成器按 `contractSchemas + methodSemantics` 表驱动（`contract-build.mjs:41–47`，已核），新 schema 注册即进 `schema.json` / CONTRACT.md。展示映射进 CONTRACT.md 的具体机制见 S-11（非阻断）。 | **闭环** |
| **B-05** 版本与发布 | accept/revert 语义；发布检查点对 conflict/pendingMerge 的处理；delivered 后只读的契约保证 | :204 accept → 新 confirmed revision；revert → 仅请求涉及块恢复至 baseRev、其他人工改动保留、两版不删；冲突候选不能直接 accept，走 `resolve_conflict`（:141）产新 confirmed revision；:205 `publishDeliverable` 遇未决项返回 `validation_error`（列目标块）、不生成快照；成功后一切领域写方法在契约入口拒绝，读/历史/diff/`markInboxRead` 可用；`PublishSnapshot` 深拷贝、读 API 返回副本（:90） | 符合 interaction §3.3 R1（不覆盖、可回滚）、R3（冲突只在发布检查点收口）与 designUI §3.5-3；`job-conflict` 场景有可验证收口行为（发布列未决项并拒绝）；AC-006-6 / AC-006-7 / AC-005-6 / AC-006-4 可测。 | **闭环** |
| **B-06** 前置依赖与所有权 | 实施起点 SHA；每个共享文件唯一修改者；blocked_by 与 Converge 口径 | :16–18 唯一修改者清单（本 feature：`jobs/**`、`contracts/**` 作业部分、`agent/events.ts` 可选字段、`main.ts` 路由注册；v2：`app/{nav,router,Rail,TopBar,AppShell}`、`WorkbenchPage`、`agent/{store,AgentDock,AgentDrawer,CotTimeline}`）；:22 实现起点 = v1 T-01～T-15 Handoff 合入后的 commit，Tasks 头部登记 SHA；:23 接线顺序；:24 blocked_by 清单 + "Converge 必报未收敛（外部阻塞）"；:36 `jobs/routes.ts` + `main.ts addRoute`，**不改 `app/router.ts`** | 已核基线 `router.ts` 由 `navItems` 生成具名路由、`main.ts` 为应用装配点，`addRoute` 具名记录可替换同名占位，方案可行且与 v2 无文件重叠；`main.ts` 在 v1 T-13 修改范围内，但本 feature 起点在 v1 Handoff 之后，为顺序关系而非并发冲突；§6 回滚块（:289）与所有权一致。 | **闭环** |
| **B-07** 隐私与本地持久化 | Upload 持久化子集；提示落点；唯一清空触发 | :191 粘贴正文只在草稿/提交参数中，不进 fixture / localStorage；File 只取元数据；:192 `fai.jobs.v1` Upload 白名单字段，事件 payload 不夹带原文；:193 512 KiB（UTF-8 字节）/ 配额异常 → 内存 + 共享非模态横幅，保留最后成功快照；损坏/版本不支持 → 本次用 fixture、保留原 key、不自动覆写；:194 / :162 唯一清空 = 显式 `resetMockData` 二次确认 | 界面文案明确"原文不保存，刷新后需重新投放原文"，与 AC-003-3（来源说明随记录提交）不冲突；横幅落点为列表/详情/投放抽屉顶部，不依赖已删除的 Toast；与 B-02d 统一后用户丢失本地状态的时点唯一且可预期。 | **闭环** |
| **B-08** 角标与收件箱 | 待处理项来源枚举与生成规则；角标位置归属；"清除"语义 | :68 四类生成规则（首次 needs_human / 首次 conflict / overlay 首次待合并 / agent 改稿待接受）且同目标同原因不重复；:69 `listInbox(jobId?)` 返回条目 + 作业/阶段计数（只数未读且未解决），`markInboxRead(ids)` 标已读保留条目，resolved 由 mock 层在收口时置位；角标位置 = 列表卡 + 详情阶段轨道（本 feature），首页作业轨道消费同一计数（v2）；:91 `InboxItem` 类型；`JobListItem.pendingCount` / 阶段 `pendingCount` 由契约提供 | 与 :186 "阶段状态不在前端推导"口径一致；designUI §3.9 "完成态不常驻角标"由 resolved 规则落实；AC-007-4 "查看收件箱后清除"= 本次展示 id 已读，可测。 | **闭环** |

## S-01～S-10 处理核实

| # | 核实 |
|---|---|
| S-01 | :12 改为"不承诺旧 bootstrap 通过新 literal，bootstrap 必须声明 2.0.0"，并给出升 MAJOR 理由（新增必实现方法 + 封闭场景枚举使旧 real 实现不再满足接口）✓ |
| S-02 | :61 `jobsStore` "不做轮询"，状态来自写回执 / agent 通知后重新读取 ✓ |
| S-03 | :182 明确状态/来源徽守卫由组件测试承担（AC-001-5 / 003-6 / 006-8），"不假称既有脚本具备该扫描" ✓ |
| S-04 | `specs/README.md:23` 依赖列已区分"实现硬前置：v1 Handoff / 壳集成：v2 Gate 1+交付 / api 仅后续真实集成" ✓（AGENTS §2 "依赖未满足不得进入 Plan" 与"硬前置为实现而非 Plan"的口径已在 spec §4 与 Gate 1 时由 Walter 接受，本轮不再提出） |
| S-05 | :115 `listJobs` 缺省 `updatedAt` 倒序 ✓ |
| S-06 | :85 submit → `pending_validation`，confirm → `ingested`/样例 `quarantined`，单位修正随 mapping 提交 ✓ |
| S-07 | :95 新 schema 进入 `contractSchemas` 注册表 ✓ |
| S-08 | :183 diff 单测期望用手写样例、不重写算法 ✓ |
| S-09 | :186 M-01～M-10 逐项主题 ✓ |
| S-10 | :24、:264、:302 blocked_by 清单与 Converge 外部阻塞口径 ✓ |

## 新发现（R2；均为建议 S，不阻断）

| # | 位置 | 建议 |
|---|---|---|
| S-11 | plan:81 / :95 / :16 | "展示映射由生成器进 CONTRACT.md"与 :16 "表驱动生成器无需修改"需二选一落实：要么把 `JobStatusLabel` 等映射以 zod 形式（枚举 `describe` 或 literal-object schema）放进 `contractSchemas`，要么允许本 feature 修改 `contract-build.mjs`（需加入 :16 所有权清单）。Tasks A 组写明机制，AC-001-5 / AC-008-1 据此断言。 |
| S-12 | plan:89 / :80 | `Revision.blocks` 对 `kind=dataset/recipe` 产物不自然（参数 overlay 的 revision 内容是什么）；建议 Tasks 中定义 revision 载荷按 artifact kind 可辨识（deliverable→blocks，recipe→params），不影响 AC-004-2 / AC-006-4。 |
| S-13 | plan:153 / :115 | `empty` 场景 `getJob` 对预置 id 返回 `null` 而未知 id 返回 `not_found`，要求 `getJob` 结果 schema 为 `Job \| null`；Tasks 中写明并让 AC-001-4 的空态断言用预置 id。 |
| S-14 | plan:215 / :169 | run `failed` 时"当前运行阶段→conflict"是把失败映射到 `StageState.conflict`（枚举无 failed）；可接受，但 CONTRACT.md 的 `StageStateLabel` 与 j-failed 样例说明应写明"失败以 conflict 呈现 + job.reason"，避免 Review 时被当作状态误标。 |
| S-15 | plan:116 / :174 / :203 | 抽屉经 `send({jobContext})` 的普通追问是否设置该作业的 `activeRunId`（从而使同期编辑进入 pendingMerge）未显式写出；按 :117 "作业运行统一经既有 send({jobContext})" 推断为是。Tasks 中一句话定清，并在 mock 状态机单测覆盖。 |

## 当前有效检查项（R2 勾选）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec 未变（R1 已核）。
- ☑ **N-02 无未澄清歧义。** spec §5 Q-001～Q-012 全部裁定；本轮无新需求问题，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** B-01 / B-03 / B-04 / B-08 关闭后，46 条 AC 全部有契约方法 / 场景 / 状态迁移 / 类型落点（逐 AC 表见下）。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** R1 三处冲突已消除：介入方法空指（:120 → :96–144）、非 normal 快照语义（:65 / :162 / :196 一致）、版本字面量（:12）。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** R1 已核项未回退；R1 未闭环的 interaction §3.3 R1/R3 与 designUI §3.5-3 现由 :204–:206 落实。D-016 结论 2/3/5/9 ✓；D-017 仅边界 ✓；D-015 未引用 ✓。
- ☑ **I-03 前端基线事实核对。** R1 结论维持；本轮补核：`router.ts` 具名路由由 `navItems` 生成、`main.ts` 为装配点（`addRoute` 方案可行）；mock `send` 分配 uuid runId；`?agentScript=` 读取点存在；`fai-dark` 为 frontend-workbench plan §2.6 / T-12 登记的主题名。T-12/T-13 已在 `fd2d755` 合入，但本 feature 仍以 Handoff SHA 为起点（Plan §1.1）。
- ☑ **I-04 文件边界与回滚一致。** :16–18 所有权 = :289 回滚块 = spec §4 "只改 frontend/"；新增 `main.ts` 路由注册在两处同时登记。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条中 43 条设计闭环可测；AC-003-1 / AC-005-5 / AC-007-4 各含一个 **外部阻塞子项**（v2），其余子项可测——这三条在 Converge 必须报外部阻塞，不计为本轮缺口（见逐 AC 表）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** R1 已核，未回退；:182 不再声称脚本具备徽标扫描。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 轮询已删（S-02）；新增方法均有 spec 行为来源；rerun 排队只用内存记录"不引调度器"（:218）；不引第三方 diff 库。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** :95 "只在契约输入、返回值和本地快照入口 parse 一次，内部组件不重复校验"。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** 新增组件（`PendingMergeChip` / `InboxDrawer` / `RuleCandidatePanel` / `RevisionRequestPanel`）均对应 designUI §6 / §3.5 具名概念；不复制第二套对话组件。
- ☑ **P-5 自动生成文件不手改（§5.5）。** :95 / :182 / :195。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** :178 "用既有脚本和时钟推进真实 mock 定时器，不凭 UI 手工造终态"；:183 手写期望。
- ☑ **P-7 按仓库现有流程（§5.7）。** 栈与命令未变。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。**（B-06）
- ☑ **C-02 契约闭环。**（B-01）
- ☑ **C-03 事件与状态闭环（R1–R6 旁路语义）。**（B-02c / B-03 / B-05）agent 始终用 `latestMergedRev`，不读 overlay（:206）；未用"等人确认才继续"替代旁路。
- ☑ **C-04 场景定义足以稳定验证。**（B-02）
- ☑ **C-05 版本与发布闭环。**（B-05）
- ☑ **C-06 隐私与本地持久化自洽。**（B-07）
- ☑ **C-07 视觉与工程纪律。** R1 已核，未回退。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 未回退。

### 阶段说明（不设复选框；后续由 A 独立复核）

- **I-01b spec / plan / tasks 无冲突（Analyze）**：tasks.md 尚不存在，Analyze 未发生。Tasks 产出后由 A 复核并在本文件补勾；Analyze 报告由实施侧产出、A 复核结论。
- **V-02 任务粒度与验证命令满足 tasks.md 模板要求**：Tasks 产出后由 A 复核——每条完成标准引用 AC 编号、验证命令一一对应、0.5–2 h、依赖无前向环、H 组任务显式 `blocked_by: frontend-workbench-v2`、头部登记 v1 Handoff SHA。
- **P-4 主函数只写正常流程（§5.4）**：代码级准则，Review 阶段核 `job-state.ts` 各方法与 `IntakeDrawer` 提交流程。
- **AC-009-1 命令输出 / AC-009-2 截图**：属 Implement / Handoff 证据，当前不声称。
- **Implement 前置**：本文件 §R2 当前有效复选框全部勾选，但 Implement 开工另需 (1) Tasks 经 A 复核补勾、(2) Tasks 头部登记 frontend-workbench v1 Handoff SHA（外部依赖未交付前不得以中间提交或空壳冒充）。

### 逐 AC 设计映射（46 条；R2 状态）

| AC | plan 落点 | R1 | R2 | 说明 |
|---|---|---|---|---|
| AC-001-1 | :46/:222 | ✓ | ✓ | |
| AC-001-2 | :61/:115/:223 | ✓ | ✓ | 排序已入契约语义（S-05） |
| AC-001-3 | :199/:224 | ✓ | ✓ | |
| AC-001-4 | :153–154/:225 | ✗ | ✓ | empty / error 对 `listJobs` / `getJob` / `getStageWorkspace` 行为已定（S-13 建议写明 null 形态） |
| AC-001-5 | :81/:226 | ✗ | ✓ | 映射由契约导出（S-11 定机制） |
| AC-002-1 | :47/:77/:227 | ✓ | ✓ | |
| AC-002-2 | :36–37/:228 | ✓ | ✓ | |
| AC-002-3 | :172/:201/:229 | ✗ | ✓ | j-human：status=needs_human、D,H,R,N，横幅定位第一个 H |
| AC-002-4 | :209–218/:230 | ✗ | ✓ | 迁移表三列可断言 |
| AC-002-5 | :80/:169/:231 | ✗ | ✓ | `reason` 必填；`cancelJob` 可置 cancelled |
| AC-003-1 | :24/:38/:232 | ◐ | ◐ | 列表 / 详情入口可测；**工作台入口外部阻塞（v2）** |
| AC-003-2 | :233 | ✓ | ✓ | |
| AC-003-3 | :84/:124/:192/:234 | ✗ | ✓ | `SourceNote` 字段 + ingest payload + 持久化子集已定 |
| AC-003-4 | :85/:235 | ✓ | ✓ | |
| AC-003-5 | :124/:200/:236 | ✓ | ✓ | |
| AC-003-6 | :84/:237 | ◐ | ✓ | 三状态枚举已登记 |
| AC-004-1 | :86/:238 | ✓ | ✓ | |
| AC-004-2 | :126/:206/:239 | ✓ | ✓ | kind=recipe；无 run 时 `pendingMerge=true` + `mergePending` |
| AC-004-3 | :86/:240 | ✓ | ✓ | |
| AC-004-4 | :137/:241 | ✓ | ✓ | |
| AC-004-5 | :153–154/:242 | ✗ | ✓ | |
| AC-005-1 | :243 | ✓ | ✓ | |
| AC-005-2 | :244 | ✓ | ✓ | |
| AC-005-3 | :127–131/:245 | ✗ | ✓ | 五动作 → framework / ask_why·question / rewrite / delete / veto |
| AC-005-4 | :132/:246 | ✗ | ✓ | `payload.state='candidate'` |
| AC-005-5 | :24/:55/:247 | ◐ | ◐ | mock 回放经 `send(jobContext)` 可测；**抽屉上下文标签外部阻塞（v2）** |
| AC-005-6 | :174/:248 | ✗ | ✓ | j-conflict 冲突分布已定 |
| AC-006-1 | :87–88/:249 | ✗ | ✓ | `ChartSpec` 样例 + `fai-dark`（v1 T-12 已在 Handoff 范围内） |
| AC-006-2 | :204/:250 | ✓ | ✓ | |
| AC-006-3 | :89/:108/:136/:251 | ✗ | ✓ | 新建 / 回复 / 解决三方法 + 线程状态 |
| AC-006-4 | :89/:109/:252 | ✓ | ✓ | `Revision` 七字段 |
| AC-006-5 | :253 | ✓ | ✓ | |
| AC-006-6 | :110/:141/:204/:254 | ✗ | ✓ | accept / revert / resolve_conflict 语义 |
| AC-006-7 | :111/:205/:255 | ✗ | ✓ | 未决项拒绝 + delivered 只读 |
| AC-006-8 | :256 | ✓ | ✓ | |
| AC-007-1 | :83/:94/:257 | ✓ | ✓ | camelCase 对照已登记 |
| AC-007-2 | :173/:178/:206/:258 | ✗ | ✓ | `requestRevision → send(long)`，同 runId 终态合并 |
| AC-007-3 | :55/:259 | ✗ | ✓ | 五个破坏性动作均有方法可挂确认 |
| AC-007-4 | :68–69/:91/:260 | ✗ | ◐ | 列表卡 / 阶段轨道角标与收件箱可测；**首页作业轨道外部阻塞（v2）** |
| AC-007-5 | :182/:261 | ✓ | ✓ | |
| AC-008-1 | :95/:262 | ✓ | ✓ | S-11 定展示映射入文档机制 |
| AC-008-2 | :146–176/:263 | ✗ | ✓ | 九场景行为与样本已定 |
| AC-008-3 | :264 | ✓ | ✓ | |
| AC-008-4 | :12/:265 | ✓ | ✓ | |
| AC-009-1 | :187/:266 | ✓ | ✓ | 实现时登记输出 |
| AC-009-2 | :186/:267 | ✓ | ✓ | 截图属 Handoff |

◐ = 设计闭环但含外部阻塞子项（Converge 必报"未收敛（外部阻塞）"）。

## 最小关闭要求与下一步

1. **R2 通过**，无需再做 Checklist 轮次；S-11～S-15 在 Tasks A 组任务中写明即可，不要求回 Plan 修订。
2. 进入 **Tasks**：按 Plan §8 A～H 分组；H 组显式 `blocked_by: frontend-workbench-v2`；头部登记 v1 Handoff SHA（未登记则 Implement 不得开工）。
3. Tasks 产出后由 A（新开独立会话）复核 V-02 / I-01b 并在本文件 §R2 补勾；Analyze 报告结论由 A 复核。
4. Converge 口径：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项在 v2 Gate 1 + 合入 + 壳方交付前为"未收敛（外部阻塞）"；`api` 不阻塞 mock 验收。
5. 实施侧更新 `specs/README.md` 本 feature 行（状态与最近更新）；本审核员不改该文件。

## 结构核验证据（R2，只读）

```text
HEAD      630e06f（spec/workbench-interaction，工作区干净）
SPEC      630e06f:spec.md blob md5 7c689362… == cfb6c66（未变；工作区 CRLF 检出，git diff --quiet HEAD 通过）
PLAN      git diff d52e784 630e06f -- plan.md：+197/−52；现 304 行
METHODS   §2.4 新增 DataClient 30 个（含 resetMockData）+ AgentClient.send(jobContext)；矩阵 19 行用满 13 种 kind
SCENARIO  9 场景 × 读/写/快照 行为表；9 个作业样本（status × 四阶段 × 产物）；jobScript 已删
FRONTEND  feat/frontend-workbench 审核期间 5958e54 → fd2d755（T-11/T-13 合入）；只读核对 router/nav/main/mock/events/types/contract-build
          mock send runId = mock-run-<uuid>（index.ts:161）；?agentScript 读取（:192）；scenario 封闭枚举（types.ts:68）
          generator 表驱动（contract-build.mjs:41–47）；fai-dark 为 fw plan §2.6 登记名
V2        spec/frontend-workbench-v2 @150c392 未 Gate 1，未作为依赖读取
```

---

# R1（2026-10-28，第一轮；历史快照，原样保留，复选框改为文字符号，不参与当前判定）

> **本轮性质**：Plan 后首轮 Checklist（第一轮）。**尚无 tasks.md**；凡涉及 Tasks / Analyze / 测试执行 / Handoff 截图的项目一律不勾选，只写阶段说明。
>
> **基线**：
> - 冻结 spec：`cfb6c66`（Walter 2026-10-28 Gate 1 批准；9 条需求 / 46 条 AC；Q-001～Q-012 已裁定）。审核时 `spec/workbench-interaction` 分支上的 `spec.md` 与 `cfb6c66` 版本 md5 一致（`7c689362…`）。
> - Plan：`d52e784`（= `spec/workbench-interaction` 分支 tip；`plan.md` md5 `4064e740…` 一致）。
> - 前端地基：`D:/2030/Futures-AI-frontend`，`feat/frontend-workbench` @ `fdaa7d8`（T-01～T-08 已合入；T-09～T-15 进行中）。只读。
> - `spec/frontend-workbench-v2` 草稿未经 Gate 1，**不作为已交付依赖**。
> - 审核期间本 worktree 被其他会话从 `spec/workbench-interaction` 切到 `feat/desktop-shell`（HEAD `71a80bd`）；本审核员**未切换分支**，后续行号均经 `git show spec/workbench-interaction:…` 读取；本文件以未跟踪文件写入指定路径，未暂存、未提交。
>
> **审查范围**：AGENTS.md、docs/plan.md、docs/interaction.md（§3.2/§3.3/§3.4/§3.5/§7）、docs/designUI.md（§2.4/§3/§5.2/§7）、docs/architecture.md、D-016 / D-017 / D-011、spec.md、plan.md、templates/checklist.md、前端 `specs/frontend-workbench/{spec,plan,tasks,checklist}.md`、前端真实代码 `frontend/src/contracts/{types,client,methods,index}.ts`、`contracts/mock/index.ts`、`contracts/real/index.ts`、`src/agent/events.ts`、`scripts/contract-build.mjs`、`scripts/check.mjs`、`src/app/{nav,router}.ts`、`AppShell.vue`、`TopBar.vue`、`src/stores/*`、`src/design/{glass.css,tokens.json}`、`package.json`。
> **未执行**：未安装依赖、未运行任何测试或应用、未启动其他 agent、未读用户凭证、未修改 spec / plan / docs、未 commit / push。
>
> **口径**：只在确认满足时勾选；未勾选项写原因与位置（文件 + 行号）。阻断项 **B-xx**（任一未闭环 = 未通过），建议项 **S-xx**（不阻断、不计入判定）。每项阻断标注"设计补全"（Plan 内闭环）或"需求变更"（回流 Clarify）。
>
> 注：以下 plan 行号均指 `d52e784` 版 plan.md。

## 结论（第一轮）：**未通过**

阻断 **B-01 ～ B-08**（全部为**设计补全**，无需求变更、不需回流 Clarify、不动冻结 spec）。Plan §5 的 46 行映射对 46 条 AC 全部"有一行"，但逐条核到契约方法、场景、状态迁移与版本语义时，**15 条 AC 的设计不闭环**（见"逐 AC 映射"表）。Plan 修订后需**第二轮定向复核**（仍由 A 独立会话执行），复核通过前不得进入 Tasks。

## 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec R-001～R-009 共 46 条 AC（5 / 5 / 6 / 5 / 6 / 8 / 5 / 4 / 2），编号连续，每条写明验证形态（组件 / 端到端 / 契约 / 静态 / 人工）。
- ☑ **N-02 无未澄清歧义。** spec §5 Q-001～Q-012 全部"按推荐（2026-10-28 Walter）"并给出融入位置；冻结后无新增问题。
- ☑ **N-03 目标与非目标边界清晰。** spec §2：交付作业对象 / 四阶段 / 四台 / 介入与不干扰 / 契约 v2 + mock / 可验收性；排除验证队列、学习区、闸门、协议、真实 api / agent / 解析、完整块编辑器、导出、导航与作业轨道本体（归 v2）。
- ☐ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 未满足。缺口集中在：spec 已写明的写行为没有契约写路径（B-01）、AC 直接依赖的契约声明 / 字段缺失（B-04）、重跑状态迁移未定义（B-03）、角标 / 收件箱语义未定义（B-08）。详见阻断表。

## 一致性

- ☐ **I-01 spec / plan / tasks 之间无冲突。** tasks 尚不存在（阶段说明，不勾选）。spec ↔ plan 已发现冲突：① plan:120 "批注/追问/教规则/否决 → 对应契约方法"，但 plan:80–91 方法表中没有任何分析介入方法（B-01）；② plan:60 "`scenario !== normal` 时不恢复本地状态"与 plan:123 "重置 mock 状态与本地快照"语义不一致（B-02d）；③ plan:11 "1.x 数据可解析"与前端 `types.ts:66` `contractVersion: z.literal(CONTRACT_VERSION)` 矛盾（S-01）。
- ☐ **I-02 与 docs/ 决策与 ADR 无冲突。** 已核无冲突项：D-016 结论 2/3/5/9（作业一等对象、旁路介入、块模型、三层玻璃）✓；designUI §2.4 状态徽文案 + 图标、不新增色值（plan:12–13）✓；§3.9 作业轨道 / 阶段轨道不新增玻璃层 ✓（plan 复用 `glass-*` 三类，`check.mjs:269` 强制）；§5.2 六类块 ✓；D-015 与主线 D-013 未混淆（plan 未引用）✓；D-017 仅作边界引用 ✓。**未闭环**：interaction §3.3 R1（编辑不覆盖、可回滚）与 R3（冲突只在发布检查点要求处理）、designUI §3.5-3（冲突芯片、发布检查点集中处理）在 plan §4.5 发布流程与 `resolveRevision` 语义中没有落点（B-05）。
- ☑ **I-03 前端基线事实核对（代替"组件存在"的推定）。** 已读真实代码：`contract-build.mjs:6–7/41/47` 由 `contractSchemas` + `methodSemantics` 表驱动，新方法只需进 `methods.ts`（plan:16 "如方法表驱动则无需改"成立；新 schema 须进 `contractSchemas` 注册表或改脚本）；`methods.ts:101/123` 的 `satisfies RequestMethods<…>` 会强制每个新 `DataClient` 方法有语义条目（利于 AC-008-1）；`check.mjs:269–278` glass 三类白名单真实存在（AC-007-5 继承成立）；`check.mjs:313–320` network 白名单只含 `src/contracts/real/`（AC-008-3 继承成立）；`mock/index.ts:56–58` `MockOverrides.fixtures` 为封闭键集、`types.ts:68` `scenario` 为封闭枚举（扩展场景须改 schema）。**基线上不存在**：`src/agent/{store.ts,AgentDrawer.vue,AgentDock.vue,CotTimeline.vue}`（T-13）、`src/design/theme.ts`（T-12）、`src/modules/`、`src/stores/{layout,badges}.ts`——plan:48 的"复用"与 plan:156 的"既有暗色主题"目前是**对未来产物的依赖**（B-06）。
- ☑ **I-04 文件边界与回滚一致。** spec §4 "只改 `frontend/`（+ `specs/README.md`、`.gitignore`）" = plan:14–17 所有权清单 = plan:189 回滚块；不碰 `backend/`、`docs/` 权威内容、冻结的 `specs/frontend-workbench/spec.md`。

## 可测试性

- ☐ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条中 31 条映射成立、15 条存在设计缺口（逐条见下表）。"有一行映射"不等于"可测"：AC-005-3 / AC-005-4 / AC-006-3 / AC-007-3 所断言的契约方法与事件 kind 在 plan 中不存在；AC-002-4 要求断言的"状态迁移"未定义；AC-007-2 / AC-008-2 依赖的场景驱动未定义。
- ☐ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 阶段不适用（尚无 tasks.md）。要求：Tasks 产出后由 A 独立复核——每条完成标准引用 AC 编号、完成标准与验证命令一一对应、0.5–2h、依赖无前向无环；v2 集成任务显式 `blocked_by`。
- ☑ **V-03 静态守卫声称与真实脚本一致。** AC-007-5 → `check --only glass`、AC-008-3 → `check --only network`、AC-008-1 → `check --only generated`（重生成 `contracts/*` 逐字节比对，`check.mjs:189–197`）均已对照真实脚本确认，不是"沿用"空话。spec R-009 what 中"状态徽不只靠颜色 / 来源徽覆盖"两项静态守卫在 plan 中以组件测试承担（S-03）。

### 逐 AC 设计映射（46 条；"✓" = 设计闭环可测，"✗" = 缺口，"◐" = 部分 / 受前置阻塞）

| AC | plan 落点 | 判定 | 说明 |
|---|---|---|---|
| AC-001-1 | plan:36/129 `JobListPage` + `JobCard`；fixtures | ✓ | |
| AC-001-2 | plan:54/130 `jobsStore.filter`、`listJobs(filter?)` | ✓ | 更新时间倒序建议写入 `listJobs` 语义（S-05） |
| AC-001-3 | plan:117/131 `createJob` → `/jobs/:id/collect` | ✓ | |
| AC-001-4 | plan:132 `scenario=empty/error` | ✗ | `empty` / `error` 对 `listJobs` / `getJob` 的行为未定义（B-02b） |
| AC-001-5 | plan:133 `JobStatusBadge` 映射单测 | ✗ | AC 要求"状态→文案映射**由契约声明**"，plan 的映射在组件内，契约无此声明（B-04a） |
| AC-002-1 | plan:37/69/134 `StageRail`、`StageState` | ✓ | |
| AC-002-2 | plan:30/135 `router.replace`、未知 stage 回落 | ✓ | |
| AC-002-3 | plan:136 `job-running` 含 `needs_human` | ✗ | 作业级 `status` 与四个 `StageState` 的组合规则未定义（哪一阶段 needs_human、其余阶段是否 running、横幅"对应阶段"如何确定）（B-02a） |
| AC-002-4 | plan:83/119/137 `rerunStage` → kind=rerun | ✗ | AC 要求断言"mock 状态迁移"；plan 未定义迁移到哪些 `StageState`、产物版本如何保留（B-03） |
| AC-002-5 | plan:138 failed/cancelled fixtures | ✗ | `Job` 类型（plan:71）无失败 / 取消原因字段；且无任何动作能把作业置为 cancelled（B-04b、B-01e） |
| AC-003-1 | plan:139 三处入口；工作台入口 blocked_by v2 | ◐ | 顶栏"任意页面可用"与工作台入口归 v2（plan:197）；v2 未过 Gate 1 → 本 AC 在 v2 合入前不可能全绿，Converge 不得报"已收敛"（B-06、S-10） |
| AC-003-2 | plan:140 三种投放 + 白名单 | ✓ | |
| AC-003-3 | plan:141 用途必填 + payload 断言 | ✗ | 来源说明字段（用途 / 可靠性 / 时效 / 口径）未进 `Upload` 类型定义（plan:74 只写"投放元数据、来源说明"）；payload 持久化子集未定（B-04e、B-07） |
| AC-003-4 | plan:142 `ExtractionPreview` / `MappingEditor`、`confirmIntake(uploadId, mapping)` | ✓ | 单位修正是否在 `mapping` 内、确认前状态值建议写明（S-06） |
| AC-003-5 | plan:143 `UnassignedPool` + `assignUpload` | ✓ | |
| AC-003-6 | plan:144 抽取状态徽 | ◐ | 待验证 / 已入库 / 隔离枚举未在类型表登记（并入 B-04e） |
| AC-004-1 | plan:145 `ProcessWorkspace` / `RecipeSteps` / 溯源 | ✓ | |
| AC-004-2 | plan:146 `updateParams` → 事件 + 待合并 | ✓ | kind（`recipe` / `map_fix`）须在 B-01 的动作→kind 矩阵中登记 |
| AC-004-3 | plan:147 `ReconciliationDiff` | ✓ | |
| AC-004-4 | plan:148 `markProvisional` → 下游徽 | ✓ | |
| AC-004-5 | plan:149 三态 | ✗ | `getStageWorkspace` 在 `empty` / `error` 下的返回未定义（B-02b） |
| AC-005-1 | plan:150 `ConclusionCard` | ✓ | |
| AC-005-2 | plan:151 `EvidenceChain` | ✓ | |
| AC-005-3 | plan:152 `InterventionComposer` 五类操作 | ✗ | **无契约方法**承载批注 / 追问 / 深挖 / 删除 / 否决；五动作 → kind 映射未给（"深挖""批注"在 13 种 kind 中无对应）（B-01a） |
| AC-005-4 | plan:153 `RuleCandidateDialog` + pin_rule | ✗ | 无契约方法；"candidate"标注落在哪个字段未定（B-01b） |
| AC-005-5 | plan:48/154 抽屉 `jobContext` 标签 | ◐ | `AgentDrawer.vue` / `agent/store.ts` 在基线不存在（T-13 未完成）；接线时机与所有权未定（B-06） |
| AC-005-6 | plan:155 三态 / 冲突场景 | ✗ | `job-conflict` 场景下结论卡 / 阶段 / 产物各自的 `conflict` 分布未定义（B-02a） |
| AC-006-1 | plan:156 六类块 + chart-spec + 主题 | ✗ | chart 块载荷形态（designUI §5.1 `{template_id, series_bindings, overrides}` 或编译后 option）未在类型表定义；`theme.ts` 基线不存在（B-04f、B-06） |
| AC-006-2 | plan:157 inline 编辑 → revision（来源=人） | ✓ | |
| AC-006-3 | plan:88/158 `createBlockComment` | ✗ | 只有"新建"；**回复、标记已解决无契约方法**；`BlockComment` 状态 / 线程结构未定（B-01c、B-04c） |
| AC-006-4 | plan:89/159 `listRevisions` / `getRevision` | ✓ | `Revision` 的版本号 / 作者 / 时间 / 摘要 / base 字段建议在类型表列明（并入 B-04d） |
| AC-006-5 | plan:46/160 `DiffView`、`diff.ts` | ✓ | |
| AC-006-6 | plan:90/121/161 `requestRevision` + 回放 + `resolveRevision` | ✗ | "回退"的语义未定义：按 R1 必须是新 revision 而非删除；`action` 枚举未给（B-05a） |
| AC-006-7 | plan:121/162 `publishDeliverable` | ✗ | 发布检查点对未解决 `conflict` / `pendingMerge` 的处理未定义（interaction R3、designUI §3.5-3）；发布后只读在契约层如何拒绝写方法未定（B-05b/c） |
| AC-006-8 | plan:163 块徽 | ✓ | |
| AC-007-1 | plan:73/164 `InterventionHistory` + 筛选 | ✓ | 字段命名（spec 为 snake_case，既有契约为 camelCase）须在契约中一次定清（并入 B-04g） |
| AC-007-2 | plan:122/165 `job-pending-merge` 场景 | ✗ | 运行如何开始未定义：mock `AgentClient` 只在 `send()` 后发事件（`mock/index.ts:137–166`），plan:95 的 `jobScript` 语义与触发点缺失（B-02c） |
| AC-007-3 | plan:166 删除 / 发布 / 取消二次确认 | ✗ | 无取消作业、无删除来源方法；"删除结论"也无方法 → 二次确认无动作可挂（B-01d/e） |
| AC-007-4 | plan:45/55/167 `inboxStore` | ✗ | "待处理介入"的产生规则、"轨道"指阶段轨道还是工作台作业轨道（后者归 v2）、收件箱条目来源均未定义（B-08） |
| AC-007-5 | plan:101/168 `check --only glass` | ✓ | 已核 `check.mjs:269–278` |
| AC-008-1 | plan:92/169 `contract-build` + 对拍单测 | ✓ | 已核生成器表驱动；新 schema 须加入 `contractSchemas`（S-07） |
| AC-008-2 | plan:96/170 场景清单单测 + e2e | ✗ | 九个场景中四个 `job-*` 的 fixture 组成与既有三个（empty / error / slow）对 v2 方法的行为未定义（B-02a/b） |
| AC-008-3 | plan:101/171 `check --only network` | ✓ | 已核 `check.mjs:313–320`；`File.text()` / URL 粘贴不触发网络（plan:110） |
| AC-008-4 | plan:11/172 CONTRACT.md 2.0.0 + 变更说明 | ✓ | 版本字面量与"1.x 可解析"措辞见 S-01 |
| AC-009-1 | plan:106/173 `pnpm test` | ✓ | 命令已定义；实现时登记输出 |
| AC-009-2 | plan:105/174 `manual-acceptance.md` M-01～M-10 | ✓ | 十项内容目前只有计数，建议在 plan 列出各项"看什么"（S-09）；截图属 Handoff，本轮不声称 |

## 工程准则（AGENTS §5）专项核查

- ☐ **P-1 不为猜测场景加复杂度、不悄悄扩大范围（§5.1）。** 基本符合：行级 diff 自实现 + 2000 行上限、512KB 降级、mock 单一可变状态层均有 AC 或风险依据，不引第三方 diff 库。**一处待去除**：plan:54 `jobsStore` "运行态轮询（mock 立即返回）"——状态变化全部来自契约方法返回值与 agent 事件流，轮询没有需求来源（S-02）。非阻断，Plan 修订时删或给依据后勾选。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** plan:57–58 契约 mock 层持有唯一可变状态、读写经契约方法；沿用 `methods.ts` 的 `validation` 约定（边界 parse 一次）；localStorage 损坏在 `persistence.ts` 边界重建（plan:46/102）。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `diff.ts` / `persistence.ts` 各有多处消费者（diff 视图 + 变更摘要；jobs + inbox 快照）；徽标三组件对应 designUI §6 具名概念；不复制第二套对话组件（plan:48）。`sessionStore`（plan:56）若仅为 `jobContext` 透传，Tasks 时可并入 `jobsStore`（信息级）。
- ☐ **P-4 主函数只写正常流程（§5.4）。** 代码级准则，Plan 阶段不适用；Review 阶段核 `job-state.ts` 各方法与 `IntakeDrawer` 提交流程。
- ☑ **P-5 自动生成文件不手改（§5.5）。** `contracts/{CONTRACT.md,schema.json}` 继续由 `contract-build.mjs` 生成、`check --only generated` 逐字节比对（plan:92/101/112）；本 feature 不新增生成物类别。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 组件 / e2e 测真实组件，数据经契约 mock 在系统边界注入（spec R-008 要求的形态）；`diff.ts` / `persistence.ts` 单测测真实函数；不 vi.mock 内部模块。提醒：diff 单测的期望值须手写样例，不得在测试里再实现一遍 LCS。
- ☑ **P-7 按仓库现有流程、不引入未在用工具（§5.7）。** 栈与命令全部沿用 frontend-workbench（`package.json` 已核：Vue 3.5 / Vite 8 / zod 4 / Vitest 5 / Playwright 1.64 / pnpm 11）；不升级工具链（plan:8）。

## 其他自定义项

- ☐ **C-01 前置依赖与职责边界清楚。** 未满足（B-06）：① plan:16 把 `router.ts` 列为"共享文件（需与 v2 协调）"，但 plan:29 又由本 feature 改它注册路由——没有唯一所有者；② plan:180 "本 feature 分支基于该 feature 完成后合并"未指明起始基线（frontend-workbench Handoff 后的 commit，还是当前 `fdaa7d8`）；③ plan:48/156 复用的 `AgentDrawer.vue` / `agent/store.ts` / `theme.ts` 在 `fdaa7d8` 不存在；④ `specs/README.md:23` 把 frontend-workbench v2 与 api 列为依赖，而 AGENTS §2 规定"依赖未满足不得进入 Plan"——spec §4 已把二者改写为"不阻塞 mock 验收"的软依赖，状态表应区分硬 / 软依赖（S-04）。
- ☐ **C-02 契约闭环（spec 行为 ↔ 契约写路径）。** 未满足（B-01）：已写入 spec 的行为中，分析台五类介入、教规则、块批注回复 / 解决、取消作业、删除来源 / 结论没有任何 `DataClient` 方法；plan:120 的"对应契约方法"是空指。`listInterventions` / `subscribe(jobContext)` / `resolveRevision` / `rerunStage` / `markProvisional` 的读 / 写路径存在。
- ☐ **C-03 事件与状态闭环（R1–R6 旁路语义）。** 部分满足：plan:122 人的编辑即时落 revision 并标 `pendingMerge`、agent 不被打断、`run.completed` 为检查点、`failed/aborted` 保持待合并并提示——符合 R2 / R3，没有用"等人确认才继续"替代旁路 ✓。**未满足**：重跑迁移（B-03）、未运行时参数修正的 `pendingMerge` 何时清除（无 run 则无 `run.completed`；B-03）、合并结果以何种契约可见形态记录（kind 列表无 merge 类；B-02c）、冲突与发布检查点（B-05b）。
- ☐ **C-04 场景定义足以稳定验证。** 未满足（B-02）：四个 `job-*` 场景各含哪些作业、每个作业的 `status` × 四个 `StageState` × 产物状态组合、是否与 `normal` 叠加、`empty/error/slow` 对 22 个新方法（含写方法）的行为、`job-pending-merge` 的运行驱动，均未写；plan:60 与 plan:123 对非 normal 场景是否清空 `fai.jobs.v1` 说法相反。
- ☐ **C-05 版本与发布闭环。** 未满足（B-05）：人改 / agent 改各产生 revision ✓（plan:121）；但回退语义、`PublishSnapshot` 不可变性（发布后写方法拒绝码）、发布检查点对 conflict / pendingMerge 的处理、历史版本只读在契约层的保证未定义。
- ☐ **C-06 隐私与本地持久化自洽。** 部分满足：fixtures 为合成样例、不读真实 PDF、不落盘文件本体、URL 不抓取（plan:110、network 守卫）✓。**未满足**（B-07）：文本粘贴正文与 URL 是否进入 `fai.jobs.v1`（plan:60 列"投放"入快照、plan:110 又称"不写私有文档"），一次大段粘贴即可触发 512KB 降级；降级 / 损坏"提示"的界面落点缺失（frontend-workbench 已删除 Toast）。
- ☑ **C-07 视觉与工程纪律。** 不新增颜色字面量与玻璃层级（plan:12–13）；状态徽 / 来源徽文案 + 图标，派生标记以来源徽 + 文字表达（designUI §2.4）；冲突徽对比度不足时"登记后继设计变更、不私加色值"（plan:185）；`accent.amber` / `text.*` 令牌在 `tokens.json:16–22` 存在。
- ☑ **C-08 D-015 / D-013 编号未混淆；D-017 仅边界引用。** plan 未引用 D-015；spec §4 引用 D-017 "仅关联"；前端分支的旧八项导航未被用来否定 D-016（plan:195 明确 9 项归 v2）。

---

## 阻断项（B-01 ～ B-08；全部为设计补全，不需回流 Clarify）

| # | 类别 | 问题与位置 | 受影响 AC | 最小关闭要求 |
|---|---|---|---|---|
| **B-01** | 契约闭环 | plan:80–91 方法表缺以下写路径，而 plan:120 / :152 / :153 / :158 / :166 均声称经"对应契约方法"：(a) 分析台批注 / 追问 / 深挖 / 删除 / 否决；(b) 教它一条规则（pin_rule，candidate 标注）；(c) 块批注回复、标记已解决；(d) 删除来源（spec:142）/ 删除结论（spec:110）；(e) 取消作业（spec:142/148）。13 种 kind（plan:73）与五类分析动作的对应关系未给（"批注""深挖"无 kind）。 | AC-005-3、AC-005-4、AC-006-3、AC-007-3、AC-002-5 | 在 plan §2.4 增补方法（如 `submitIntervention(jobId, input)` 承载 a/b/d 结论侧、`replyBlockComment` / `resolveBlockComment`、`cancelJob`、`removeUpload`；形态由实施者定，但须进 `methods.ts` 语义表与 CONTRACT.md），并给出一张 **动作 → 方法 → kind → payload 必填字段** 矩阵覆盖 spec 全部介入动作（含 AC-004-2 的参数修正、AC-006-6 的改稿、AC-002-4 的重跑、AC-006-7 的发布）。 |
| **B-02** | 场景与 mock 驱动 | (a) plan:95–96 / :119 / :136 / :155：四个 `job-*` 场景的 fixture 组成未定——每场景含哪些作业、各作业 `status` 与四个 `StageState`、产物 / 结论 / 块的状态分布；`needs_human` 作业的其他阶段是否 `running`（R3 下游继续）；避免单一作业同时承担互斥情景。(b) 既有 `empty / error / slow` 对 22 个新方法（含写方法）的行为未定（`mock/index.ts:70–76` 现只对 `moduleFixtures` 报错）。(c) plan:122 / :165 `job-pending-merge`："检查点事件"来自哪一次 run——mock `AgentClient` 只在 `send()` 后发事件（`mock/index.ts:137–166`），plan:95 `jobScript` 的触发点与语义缺失；合并结果以何种契约可见形态记录（kind 列表无 merge / checkpoint）。(d) plan:60 "不恢复本地状态"与 plan:123 "重置 mock 状态与本地快照"相反。 | AC-001-4、AC-002-3、AC-004-5、AC-005-6、AC-007-2、AC-008-2 | plan §2.4 增一张 **场景 × 方法行为表**（九个场景 × 读 / 写方法：返回 / 拒绝码 / 延迟）与 **场景 × 作业样本表**（每场景的作业 id、status、四个 StageState、关键产物状态）；明确 `job-pending-merge` 的驱动（推荐：用户在作业内经抽屉 `send({jobContext})` 走 `long` 脚本，不另造 `jobScript`；若保留 `jobScript`，定义其触发时机与是否绕过 `send`）；明确合并结果的记录形态（如原介入事件 `outcome` 更新为 `merged` / `pending`）；统一 plan:60 与 plan:123：非 normal 场景只读 fixture、**不写不清**用户的 `fai.jobs.v1`。 |
| **B-03** | 事件与状态闭环 | plan:83 / :119 / :137 `rerunStage` 只写"新介入事件"：未定义本阶段及下游 `StageState` 迁移（如 → `running`，再由何事件置 `done`）、作业级 `status` 同步、产物版本保留方式（按 R1 应为新 revision、旧 revision 可见）、运行中重跑与 `pendingMerge` 的关系；AC-002-4 明文要求断言"mock 状态迁移"。同类缺口：无 run 时（直接 `updateParams`）产物的 `pendingMerge` 何时、由谁清除（plan:122 只定义了有 run 的情况）；`needs_human` 横幅"对应阶段"取自哪一字段。 | AC-002-4、AC-004-2、AC-002-3 | plan §4.3 写明 `rerunStage` 的状态迁移表（本阶段与下游 StageState 前 → 后、job.status 前 → 后、产物 revision 变化），以及 `pendingMerge` 的两条清除路径（有 run：终态事件；无 run：即时合并或显式"检查点"动作，二选一并写明）；注明横幅目标 = `StageState === 'needs_human'` 的首个阶段。 |
| **B-04** | 契约类型完整性 | plan:66–76 类型表缺 AC 直接依赖的声明：(a) 状态 → 文案映射由契约声明（spec:51），现只在 `JobStatusBadge` 组件；(b) `Job` 无 failed / cancelled 原因字段（spec:66）；(c) `BlockComment` 无状态（未解决 / 已解决）与线程 / 回复结构（spec:130）；(d) `Revision` 的版本号 / 作者 / 时间 / 摘要 / base 未列（spec:131）；(e) `Upload` 的来源说明字段（用途 / 可靠性枚举 / 时效 / 口径）与状态枚举（待验证 / 已入库 / 隔离）未列（spec:72–73/83）；(f) chart 块载荷形态未定（spec:128 "契约 chart-spec"；基线契约无 chart-spec 类型，chart-templates 未交付）；(g) `Intervention` 字段命名：spec:140 为 snake_case（`job_id / base_rev / created_at`），既有契约与 plan:76 `JobContext` 为 camelCase，plan:113 又写 `created_at`。 | AC-001-5、AC-002-5、AC-003-3、AC-003-6、AC-006-1、AC-006-3、AC-006-4、AC-007-1 | plan §2.4 类型表逐项补齐字段（可引用 zod 名，不必写全 schema）；(a) 以契约导出的 `JobStatusLabel` / `StageStateLabel`（或 schema `describe` + CONTRACT.md 表）作为唯一映射来源，组件只消费；(f) 选定 chart 块载荷 = designUI §5.1 的 `{templateId, seriesBindings, overrides}` 最小子集或 `SparkSeries` 复用，并说明与 chart-templates 的衔接；(g) 定一条命名规则（建议 camelCase，CONTRACT.md 注明与 spec 字段的对应），AC-007-1 按该规则断言。 |
| **B-05** | 版本与发布 | (a) plan:90 / :121 / :161 `resolveRevision(action)`：`action` 枚举与"回退"语义未定；按 interaction §3.3 R1"编辑不覆盖、可回滚"，回退须产生新 revision 而非删除。(b) plan:121 / :162 发布：未定义发布检查点对未解决 `conflict` 与 `pendingMerge` 的处理（interaction §3.3 R3、designUI §3.5-3 "发布检查点集中处理"），`job-conflict` 场景因此无可验证的收口行为。(c) 发布后"只读"与"快照不可变"在契约层如何保证（写方法对 delivered 作业的拒绝码；`PublishSnapshot` 与 `Revision` 的关系）未写。 | AC-006-6、AC-006-7、AC-005-6（冲突场景）、AC-006-4 | plan §4.5 补三句：`resolveRevision` 的 `accept / revert` 各自产生什么 revision；`publishDeliverable` 在存在 `conflict` / `pendingMerge` 块时的行为（推荐：发布对话框列出未决项并拒绝，返回 `validation_error`；或要求逐项"接受当前版本"后方可发布——二选一）；delivered 后 `saveBlockText / createBlockComment / requestRevision / updateParams / rerunStage` 一律拒绝（给出 code），历史 revision 与快照只读。无需改 spec。 |
| **B-06** | 前置依赖与所有权 | plan:16 共享文件无唯一所有者（`router.ts` 同时被本 feature plan:29 与 v2 修改；`agent/store.ts` 列为共享但 plan:48 要复用、plan:198 又由 v2 改）；plan:180 "基于该 feature 完成后合并"未给基线；`AgentDrawer.vue` / `agent/store.ts` / `theme.ts` 在 `fdaa7d8` 尚不存在（frontend-workbench T-12 / T-13 未完成）；AC-003-1 / AC-005-5 / AC-006-1 / AC-007-4 的可验收性依赖这些未来产物与未过 Gate 1 的 v2。 | AC-003-1、AC-005-5、AC-006-1、AC-007-4 | plan §1 增"基线与所有权"小节：① 本 feature 实施起点 = frontend-workbench Handoff 合入后的 commit（或明确可接受的最小前置任务集 T-12 / T-13 完成的 commit）；② 每个共享文件只有一个修改者（建议：`router.ts` 路由追加归本 feature、`nav.ts` / `TopBar.vue` / `AppShell.vue` / `WorkbenchPage.vue` 归 v2、`agent/store.ts` 的 `jobContext` selector 归本 feature 且只做新增），并写明接线顺序；③ 明确哪些 AC 在 v2 合入前只能标 `blocked_by`，且 Converge 报告须把它们列为"未收敛（外部阻塞）"而非通过。 |
| **B-07** | 隐私与本地持久化 | plan:60 把"投放"整体纳入 `fai.jobs.v1`，plan:110 又称"不写私有文档到 localStorage"：文本粘贴正文与 URL 是否入快照未定，一次长粘贴即触发 plan:111 的 512KB 降级，导致全部作业状态失去持久化；"降级并提示""解析失败重置"（plan:111/183）的提示落点未定（基线无 Toast）；与 B-02d 的"重置本地快照"叠加后，用户何时会丢本地状态不可预期。 | AC-003-3、AC-008-2、AC-001-4（错误态） | plan §3 写明 `Upload` 的持久化子集（建议：元数据 + 来源说明 + 映射 + 状态；文本粘贴正文不持久化或截断到固定长度并标注"已截断"，URL 只存字符串）；提示落点定为页面内横幅或收件箱条目（复用 B-08 的收件箱）；写明清空 `fai.jobs.v1` 的唯一触发（显式"重置样例数据"动作），场景切换不清空。 |
| **B-08** | 角标与收件箱 | plan:45 / :55 / :120 / :167 只写 `inboxStore` 与 `fai.inbox.v1`：未定义什么事件构成"待处理介入"（候选：阶段 `needs_human`、`conflict`、待合并结果、agent 改稿待接受 / 回退、重跑完成）、条目由契约方法返回还是前端从 `listInterventions` / `StageState` 推导（plan:186 禁止前端推导阶段状态，角标是否同理）、"轨道"指详情页阶段轨道还是工作台作业轨道（spec:143/149；后者归 v2 plan:196）、"查看收件箱后清除"清的是角标还是条目。 | AC-007-4 | plan §2.2 / §2.3 补一段：待处理项的来源枚举与生成规则（推荐经契约 `listInbox(jobId?)` 或在 `Job` / `StageWorkspace` 上带 `pendingCount`，与 plan:186 口径一致）；角标出现位置 = 作业列表卡 + 详情页阶段轨道（本 feature），工作台作业轨道角标标 `blocked_by v2`；"清除" = 已读状态写 `fai.inbox.v1`，条目保留。 |

## 建议（S-xx；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-01 | plan:11；前端 `types.ts:66` | `Bootstrap.contractVersion` 是 `z.literal(CONTRACT_VERSION)`，升 2.0.0 后 1.0.0 的 bootstrap 不可解析；把"1.x 数据可解析"改为"既有字段与方法语义不变"，或将 literal 放宽为 `^1\.|^2\.`；同时说明为何纯新增走 MAJOR 而非 MINOR（若理由是"场景与 `SendMessage` 枚举扩展对 real 实现属破坏"，写一句即可）。 |
| S-02 | plan:54 | 删除 `jobsStore` 的"运行态轮询"或给出需求来源（§5.1）。 |
| S-03 | plan:101；spec:168 | spec R-009 what 列的"状态徽不只靠颜色 / 来源徽覆盖"两项静态守卫，plan 以组件测试承担（AC-001-5 / AC-003-6 / AC-006-8 均为组件测试，可接受）；在 plan §2.5 写明这一对应，避免 Converge 时被当作缺口。 |
| S-04 | `specs/README.md:23` | 依赖列区分硬依赖（frontend-workbench 地基完成）与软依赖（v2 Gate 1、api），与 spec §4 "不阻塞 mock 验收"一致；否则与 AGENTS §2 "依赖未满足不得进入 Plan"字面冲突。 |
| S-05 | plan:80 | `listJobs(filter?)` 语义表写明默认排序 = 更新时间倒序（spec R-001 what）。 |
| S-06 | plan:118 | 写明 `submitIntake` 后状态 = 待验证、`confirmIntake` 后 = 已入库 / 隔离（mock 规则），以及单位修正属于 `mapping` 的一部分。 |
| S-07 | plan:92；`contract-build.mjs:41` | 新 zod schema 须加入 `contractSchemas` 注册表（或在 `job-types.ts` 导出后合并），否则不会进入 `schema.json` / CONTRACT.md 字段清单。 |
| S-08 | plan:102 | `diff.ts` 单测用手写样例作期望，不在测试内重写 LCS（§5.6）。 |
| S-09 | plan:105 | 在 plan 列出 M-01～M-10 各项主题（如 M-01 状态徽、M-05 图表块主题等已被 §5 引用），便于 Tasks 一次写全。 |
| S-10 | plan:139 / :187 / :209 | AC-003-1（及 B-08 裁定后可能的 AC-007-4 轨道部分）在 v2 Gate 1 + 合入前无法全绿：Tasks 的 H 组任务显式 `blocked_by: frontend-workbench-v2`，Converge 报告把它们列为外部阻塞；需 Walter 知悉本 feature 的"完成"依赖 v2 的时间线。 |

## Gate / Walter 知悉事项（本阶段不要求裁决）

1. 本轮 8 项阻断均可在 plan 内闭环，**不需要回流 Clarify、不动冻结 spec**。
2. 本 feature 实际可开工时点受 frontend-workbench T-09～T-15（尤其 T-12 主题、T-13 对话抽屉与 agent store）进度约束；plan 修订时应写死基线（B-06）。
3. AC-003-1 的工作台入口与可能的 AC-007-4 作业轨道角标依赖 `spec/frontend-workbench-v2` 过 Gate 1 并合入；在此之前本 feature 的 Converge 不能报"已收敛"（S-10）。
4. 审核期间本 worktree 被切到 `feat/desktop-shell`；本文件以未跟踪文件写入 `specs/workbench-interaction/checklist.md`，由实施侧在 `spec/workbench-interaction` 分支上纳入提交。

## 结构核验证据（只读，未安装依赖、未运行项目测试）

```text
SPEC      cfb6c66 == spec/workbench-interaction:specs/workbench-interaction/spec.md（md5 7c689362…）
PLAN      d52e784 == spec/workbench-interaction tip（md5 4064e740…）
AC_COUNT  5+5+6+5+6+8+5+4+2 = 46；plan §5 行数 46；编号集合一致
METHODS   plan §2.4 列 21 个 DataClient 新方法 + AgentClient.send(jobContext)；
          spec 写入的写行为中无方法承载：分析介入×5、pin_rule、批注回复/解决、取消作业、删除来源/结论
KINDS     plan 13 种 vs interaction §3.4 示例 10 种：多 question/rerun/publish；缺 merge/checkpoint；"批注""深挖"无映射
SCENARIO  既有 5（normal/empty/error/slow/boot-error，types.ts:68 封闭枚举）+ 新 4（job-*）；对 22 新方法行为未定
BASELINE  fdaa7d8：存在 contracts/{types,client,methods,index}.ts、mock/index.ts、real/index.ts、agent/events.ts、
          scripts/{contract-build,check}.mjs、app/{nav,router}.ts、AppShell/TopBar/Rail/LoadingScreen.vue；
          不存在 agent/{store.ts,AgentDrawer.vue,CotTimeline.vue}、design/theme.ts、modules/、stores/{layout,badges}.ts
GUARDS    check.mjs: glass 白名单 3 类(L269) ✓；network 仅 src/contracts/real/(L313–320) ✓；
          generated 含 contracts/* 字节比对(L189–197) ✓；contract-build 由 contractSchemas+methodSemantics 驱动 ✓
CONFLICT  plan:60 ↔ plan:123（非 normal 场景本地快照）；plan:120 ↔ plan:80–91（介入方法）；plan:11 ↔ types.ts:66（版本字面量）
```

## 结论与下一步（R1）

1. **未通过**。阻断 B-01～B-08 全部为设计补全；Plan 修订后由 A（独立新会话）做第二轮定向复核，逐项核闭环且确认其余内容未回退；通过后方可进入 Tasks。
2. Tasks 产出后另需 A 复核 V-02（任务模板、AC 引用、命令对应、依赖 DAG、`blocked_by` 标注）；Analyze 报告与 Converge 结论不得由本轮任何勾选代替。
3. 本轮只写入本文件；未修改 spec / plan / tasks / docs / 前端分支，未安装依赖、未运行测试、未 commit / push。
