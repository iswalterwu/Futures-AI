# Feature: workbench-interaction Converge 报告 — 第五批采集台闭环 T-A01a / T-A13a / T-A15a / T-B06 / T-C01 / T-C01a / T-C02 / T-C03 / T-C04（converge-batch5.md）

> **性质**：AGENTS §2 第 9 步 Converge 的**批次报告**。本报告只读对比本批真实代码与 spec / plan / tasks，不是 Review、审核结论、Gate 2 或 Handoff；不勾选 checklist，不改 spec。
>
> **阶段记录（脱敏）**：
> - **角色与模型**：Converge / 进度登记 / Analyze R25 作者 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a189ab-7934-721a-8701-82b717fd3a18`）。
> - **通道**：本协调窗口 `claude-bridge` 的限额早已确认，没有重置证据，按 AGENTS §6 规则 2 / 5 不重试；官方通道同模型真实调用成功。只换通道、不换模型，未改 provider / key / 路由 / 全局配置。测试结果不是换模型的理由。
> - **派工人**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter 的“允许”授权与集成人指定在既有 tasks 内持续有效；Walter 已选“全部工作完成后再合 main”。
>
> **写入范围**：
> - 唯一可写 worktree：复用 `D:/2030/Futures-AI-interaction-converge-batch4`（branch `docs/workbench-interaction-batch4-converge`，固定起点 `e609c2e54e02ba1d11912c5c10cf229ada025cba`，起始 clean）。没有新建 D:/2030 目录。
> - 只写 `specs/workbench-interaction/{plan,tasks,analyze,implementation-log,interface-handoff}.md`、新建本文件，以及 `specs/README.md` 中本 feature 的两行。
> - **未改动**：源码、测试、fixture、生成物、spec、checklist、已有 Review 原件、旧 Converge 报告、权威 docs、根 HANDOFF、其他 feature、其他 worktree。
> - **未执行**：没有 commit / push / PR / merge；没有启动子 agent、服务或安装；**没有运行任何产品测试**。
> - **测试数字来源**：下文测试数字全部由实施者执行，本会话没有重跑。来源是协调器 Temp `C:/Users/iswal/AppData/Local/Temp/wi-batch5-01a18388-q7s7olxl/` 下的 `astra-core-result.md`、`astra-history-form-*.log`（`astra-history-form-result.md` 被 harness 摘要覆盖，以逐命令日志为准）、`astra-drawer-preview-summary.md` + `astra-drawer-preview-logs/`、`astra-preview-pool-summary.md`（第二次停止，零写入）、`astra-preview-pool-resume-summary.md` + `astra-preview-pool-resume-logs/`、`astra-e2e-summary.md` + `astra-e2e-logs/`。本会话的只读脚本、dump 与日志在同目录 `converge-work/`（非项目产物，不清理共享 tmp）。
>
> **日期**：2026-10-30（+04:00）。

## 0. 固定输入

| 项 | 值 |
|---|---|
| `implementation_base_sha` | `43b6d79681a49562f41751368b2ae00c24062f56`（v1 Handoff，不变） |
| `upstream_start_sha` | `90187f7d8907316e554d2441d846827468c5371f`（继续 pin）。main / `origin/main` = `072bb12`，**不是**本树祖先（只读核验）；不导入，R2-D 流程不变 |
| 有效 Checklist | **R11** 当前原件 `1f99f80f547a53c5e996964907b533751e4cf804`；本树 `checklist.md` blob = `27a76aa6c3e4adcb817fed5d9b6512e1853061dd`（与原件相同，只读未改）；26 ☑ / 0 ☐，0 P1 / P2，P3 S-44～S-48 已在 r6.12.1 吸收 |
| 冻结 spec | v1.1，46 AC；blob `102af73bb448224fda5002430842868632b5b66a`；LF 归一化 SHA256 `ed0f6c6c3e50b93166a02880df574e6f167a5773829ec0ab8d3ddcf269f942d9`（与历次登记相同；`git log` 最后改动仍是种子 `8753fa9`） |
| 本批代码 diff | `b67a2279cb8ed94f71b4df5144a226bf321e27fd..e609c2e54e02ba1d11912c5c10cf229ada025cba -- frontend`：**9 个前端提交，28 个文件，+3672 / −24**。同区间另有两个纯文档提交 `af31dda`（r6.12.2）/ `19228ce`（r6.12.3），只改 `specs/**`，不含 frontend，不计前端提交。每个文件都逐行读过（§1 / §2） |
| 逐提交（父链连续） | T-A01a `f65d3c6` → T-A13a `e1cd4d4` → T-A15a `a2efb98` → T-B06 `0d09748` → T-C01 `4af80e8` → T-C01a `6529f41` →（`af31dda` → `19228ce` 文档）→ T-C02 `d4e3fb6` → T-C03 `7b802d4` → T-C04 `e609c2e`；顺序即 tasks §6 DAG |
| 生产方集成树 | `integration/workbench-interaction` = `e609c2e`（集成人 ff-only；本会话只读 `worktree list` 核验）。只是旁证，**不是** ④ |
| v2 消费方集成 | `integration/frontend-workbench-v2` = `3f63273`（只读）；`e609c2e` **不是**其祖先。本会话不写、不代登记 v2 / peer / main 树 |

**本轮开始时重新读取**（不依赖会话记忆）：
- 工作流与权威：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`；`docs/interaction.md` §3.1 / §3.3（R4 只对破坏性动作确认）/ §3.4 / §7.1；`docs/designUI.md` §1 / §2.4 / §3.3（右侧常驻介入历史）/ §3.5。
- 本 feature 规格：冻结 spec（R-003 / R-007 / R-008、46 AC）；plan 页首 r6.12～r6.12.3、§2.1 / §2.2 / §2.3 / §2.4 / §3 的【r6.12】【r6.12.1】【r6.12.3】段；tasks 页首 r6.12～r6.12.3、§0 / §1 / §2a / §3、第五批 9 项完整状态 / 范围 / 标准 / 命令、§5 / §6 / §7。
- 审核与分析：Checklist R11 当前原件（26 / 26，0 P1 / P2；S-44～S-48）；analyze.md R21 / R22 / R23 / R24。
- 记账与交接：implementation-log §8 / §19～§22、interface-handoff 页首 / §1 / §3 / §5；`review-batch3.md` R3-B、`review-batch4.md` / `review-batch4-r4a.md`（R4-A 关闭、R4-B～E 开放）；`specs/README.md`。
- 实施者回报与原始日志（只作结果来源，不替代代码阅读），见页首“测试数字来源”。

## 1. diff 事实与所有权

逐提交文件清单（`git show --stat`）与 tasks 修改范围、implementation-log §20.2 写权限表逐一一致：

| 提交 | 文件 | 对照写权限 |
|---|---|---|
| A01a `f65d3c6`（4） | `contracts/types.ts` +7；`contracts/{CONTRACT.md,schema.json}`；`tests/unit/jobs/contract-labels.spec.ts` +21 / −0 | 只加 `ReliabilityLabel` / schema / 注册；生成物经 `contract`；测试只在末尾新增 `WI reliability label` 组 |
| A13a `e1cd4d4`（5） | `mock/job-state.ts` +1；`methods.ts` 描述 1 行；生成物；`job-state-pool.spec.ts` +39 / −0 | 只改 `removeUpload`；新增组标题不含 `WI removeUpload` |
| A15a `a2efb98`（9） | `client.ts` / `methods.ts` / `real/index.ts` / `mock/index.ts` / `mock/job-state.ts`（各只加 `listInterventions`）；生成物；新建 `job-state-history.spec.ts`；`real-stubs.spec.ts` +1 | 一致；`real-stubs` 只追加一键，`satisfies` 与断言未改 |
| B06 `0d09748`（3） | 新建 `jobs/components/InterventionHistory.vue`；`jobs/pages/JobDetailPage.vue`；新建 `tests/component/jobs/intervention-history.spec.ts` | 页面只改 imports 与 ready 有作业分支；`watch`（含 R4-A 6 行）、`selectStage`、三态、详情头未改 |
| C01 `4af80e8`（3） | 新建 `jobs/stores/intake.ts`、`jobs/stages/IntakePanel.vue`、`tests/component/jobs/intake.spec.ts` | 一致 |
| C01a `6529f41`（6） | 新建 `stages/IntakeDrawer.vue` / `stages/CollectWorkspace.vue`；`pages/JobListPage.vue`、`pages/JobDetailPage.vue`、`components/StageWorkspace.vue`；`intake.spec.ts` +203 / −0 | 一致；原 25 例为字节前缀 |
| C02 `d4e3fb6`（7） | `stores/intake.ts`；新建 `stages/ExtractionPreview.vue` / `stages/MappingEditor.vue` / `tests/component/jobs/extraction-preview.spec.ts`；`IntakeDrawer.vue`；`CollectWorkspace.vue`；`intake.spec.ts` −3 / +3 | 一致；`intake.spec.ts` 只有两处许可替换（§3） |
| C03 `7b802d4`（6） | `stores/intake.ts`；新建 `stages/UnassignedPool.vue` / `tests/component/jobs/unassigned-pool.spec.ts`；`IntakeDrawer.vue`；`CollectWorkspace.vue`；`intake.spec.ts` −1 / +2 | 一致；只有 pool 行许可替换 |
| C04 `e609c2e`（1） | 新建 `e2e/jobs/intake.spec.ts` | 无生产文件 |

**零差异**（`git diff --stat b67a227..e609c2e -- <路径>` 为空）：`frontend/src/{app,shared,agent,workbench,stores}/**`、`main.ts`、`jobs/routes.ts`、`jobs/stores/{jobs,session}.ts`、`jobs/persistence.ts`、`contracts/mock/fixtures/**`、`frontend/scripts/**`、`package.json`、`pnpm-lock.yaml`、`vitest.config.ts`、`playwright.config.ts`、`docs/**`、AGENTS.md、HANDOFF.md、`backend/**`。`git diff --check b67a227..e609c2e` 通过。`InterventionHistory.vue` 在本区间只被 `0d09748` 写过（S-44）。

**只读消费的既有模块**：`JobDetailPage.vue` 新导入 `src/stores/ui.ts` 的 `useUiStore()`，只读 `viewport.collapsed` 并写在 `data-viewport-collapsed` 属性上，用作窄窗断点；`app/AppShell.vue` 与 `app/Rail.vue` 已有同样写法。`stores/ui.ts` 未改，也不在禁写清单内。这一写法登记为观察 O-B5-8，请 A 确认它属于 T-B06 所说的“仓库既有断点写法”。

## 2. 逐任务核对（完成标准 → 代码证据 → 命令）

- **命令结果**列：实施者在实施树执行（openai/gpt-6-astra，各新会话，均为首选、调用正常、未回退），本会话没有重跑。
- **标题存在**列：本会话读过测试源，确认 tasks 命令的 `-t` / `-g` 标题存在，`test.each` 展开数与日志用例数对得上；新测试中没有 `skip` / `only` / `todo`。

| 任务 | 完成标准 → 代码证据 | 标题存在 | 命令结果（实施者执行） | 判定 |
|---|---|---|---|---|
| T-A01a | **①** `ReliabilityLabel = {high:{高,↑}, medium:{中,＝}, low:{低,↓}, unknown:{未知,?}} as const`；`ReliabilityLabelSchema = labelSchema(...)` 带 describe；键序断言等于 `SourceNoteSchema.shape.reliability.options`；逐键改错文案被拒。**②** 注册进 `contractSchemas`；CONTRACT.md 新增小节，含四条 text / icon；原 `WI labels` 的 `mappings` 未加项。**③** 未新增 Reliability 枚举 schema、未改 `SourceNoteSchema`、未升 `CONTRACT_VERSION` | ✓（2） | 命令 1 **2**；命令 2 三文件 **72**；命令 3 通过；旧 `WI labels` **10**。首跑全过 | 满足 |
| T-A13a | **①** `removeUpload` 在 `findUpload`（未知 → not_found）与已归属时 `writableJob`（终结作业 → validation_error）之后、写入之前：`upload.removed` → `{code:'validation_error', message:'投放已删除。', retryable:false}`；在 `commit` 内抛出，不留部分写入。测试：已归属 / 未归属两例，第二次删除被拒后快照、`fai.jobs.v1` 原串、`interventions`、`mappingHistory`、工作区、`updatedAt` 都不变，第一次的 `remove_source` 与旧修订仍在，`getIntakePreview` 仍返回原预览。**②** 原 `WI removeUpload` 4 例不变。**③** 描述补“已删除的投放返回 validation_error”，生成物同步 | ✓（`test.each` 2） | 命令 1 **2**；命令 2 **29**；命令 3 通过；旧 `WI removeUpload` **4**。首跑全过 | 满足（R3-B 是否关闭由 A 判） |
| T-A15a | **①** `listInterventions(jobId, filter?)`：先 `findJob`（未知 → not_found；empty 预置 id 得 null 后继续）；按 jobId / stage / kind 过滤后按 `Date.parse(createdAt)` 升序，`Array.prototype.sort` 稳定，同刻保持记录顺序；返回 `structuredClone`。测试覆盖 j-deliver 同刻种子、真实 `submitIntake` / `removeUpload` 时间序（假时钟）、单项 / 组合筛选、带时区的同一时刻、修改返回值后再读不变、empty `[]`、strict filter 拒绝多余键 / null。**②** error：已知作业 adapter_error、未知作业 not_found；slow 1499 / 1500 ms；`real-stubs` 24。**③** params strict、复用既有 schema、不新增注册 schema | ✓（listInterventions 9；scenarios 3） | 命令 1 **9**；命令 2 **3** + real-stubs **24**；命令 3 通过（25 methods / 10 events / 2 artifacts）；另跑 `job-state-read` **39** | 满足 |
| T-B06 | **①** `<aside aria-label="介入历史">` + `<h2>`；切换按钮带 `aria-expanded`，默认收起；`watch([props.job, stage, kind, expanded])` 只在展开时 `load()`；filter 只放已选项（全空传 `{}`）；本地读状态：Loading / `ErrorState(moduleId='intervention-history')` 重试 / “暂无介入记录。”；每条 `<time :datetime>`、`StageLabel`、kind / outcome 原值，`<details>` 内有 id / jobId / artifactId / baseRev / reason（null 显示“无”）与按 `payload.action` 收窄的摘要（ingest 五项，可靠性用 `ReliabilityLabel`，日期 null 显示“未知”、口径 null 显示“无”；map_fix 行；remove_source / cancel_job / delete_conclusion / veto 显示 reason）。**②** 挂载在 ready 有作业分支：`.detail-columns`（`minmax(0, 2fr) minmax(0, 1fr)`），主列是 StageRail + StageWorkspace，侧栏在主列之后；测试证明收起时 0 读，展开后同页“真实 `submitIntake` + 一次 `refresh()`”使新 ingest 出现，换作业后只剩该作业事件。**③** 不渲染 `h1` / `.job-*` / `aria-current` / `aria-pressed` / `JobStatusBadge`；未新增 store 成员、序号或轮询 | ✓（AC-007-1 8；refresh 2） | 命令 1 **8**；命令 2 **2**；命令 3 job-detail **13** + E2E **6** + typecheck / lint（首跑 lint 4 条新模板换行警告，只改新组件格式后同命令重跑通过） | 满足 |
| T-C01 | **①** `IntakePanel` 根 `<section aria-label="投放表单">`，带“本地样例记录；原文不保存，刷新后需重新投放原文”提示；三种输入单选，只提交当前种类；文件取 `files[0]` 的四项元数据，经 `IntakeFileMetaSchema.safeParse`，失败时提示“只接受 pdf / docx / xlsx / md / csv 文件”、草稿 `fileMeta=null`；拖入只取首个文件。**②** 用途必填（含纯空白）；可靠性选项来自 `ReliabilityLabel`，默认 unknown；空日期 / 口径以 null 提交。**③** File / FileReader / `createObjectURL` 的 spy 都是 0 次；`fai.jobs.v1` 不含正文；不抓取 URL。**④** H-5：`open(jobId?)` 每次覆盖快照，路由变化不改写；`close()` 只关；`submit` 的参数类型不含 jobId（`@ts-expect-error`）；成功时 refresh 恰一次、草稿复位，失败时以原 ErrorResponse reject、不刷新、保留草稿；面板 `ErrorState(moduleId='intake-submit')` 用同一提交重试。提交时 file 种类只判 `fileMeta !== null`（S-46） | ✓（AC-003-2 13；purpose 4；metadata 2；H-5 store 6） | 命令 1～4 **13 / 4 / 2 / 6**；命令 5 通过。首跑 1 fail：新 URL 测试误期待 `type=url` 保留首尾空格，实际被 happy-dom 规范化；只改新测试后重跑 13 | 满足 |
| T-C01a | **①** `IntakeDrawer` 根 `<aside class="glass-drawer intake-drawer" aria-label="投放抽屉">`，宽高 100%；无 fixed / 遮罩 / dialog / aria-modal / inert / 焦点锁。**②** “关闭” → `close()`：路由不变，agent `send` 0 次。**③** 列表页“投放” → `open()`，`.intake-slot` 在筛选条之前；详情页 `.intake-slot` 在状态分支之前；`StageWorkspace` 收到 `{stage, job, workspace}`，只对 collect 分发到 `CollectWorkspace`；collect 但缓存不匹配时显示 `<p role="status">读取中…</p>`；其他阶段保持原占位。`CollectWorkspace` 有“投放到本作业” → `open(job.id)`，按 `workspace.uploads` 原序显示种类 / 名称或 URL /“文本投放（正文未保存）”/ 用途 / 状态徽，空列表显示“暂无投放。”；跨页面重挂载后快照与草稿保留。**④** 抽屉打开时筛选、新建、焦点、阶段导航都可用。**⑤** 页面回归 | ✓（container 1；close 1；page mount 10；non-modal 1） | 命令 1～4 **1 / 1 / 10 / 1** + typecheck / lint；命令 5 组件 **30** + E2E **6**。首跑：命令 3 有 1 例新测试误读 `WriteReceipt.job.id`（契约为 `jobs[0].id`），命令 4 有 26 条新模板 lint 警告；只修新增部分后同命令重跑通过 | 满足 |
| T-C02 | **①** `selectUpload` 在读之前写 `previewTarget` 副本，成功后一次写入 `selection`，其中 `mapping` 复制自 `upload.mapping`（注入的差异样例 `saved_inventory · 吨` ≠ `preview.fields` 的 `inventory · kt`）；编辑只改草稿；确认前 `confirmIntake` 0 次，确认时 1 次，参数为编辑后的映射；`FieldMappingSchema.safeParse` 失败时不调用。null 单位 / 范围显示“未知”。**②** 采集行与预览两处用 `ArtifactStatusBadge`（`UploadStatusLabel`）显示三种状态；隔离时显示原因；非 pending 或 removed 时没有“确认入库”。**③** 确认成功：`selection` 立刻换成回执（ingested / quarantined）→ `refresh` 恰一次 → 列表行更新；再选中时显示已保存映射。失败：reject、不刷新、`selection` 不变、`ErrorState(moduleId='intake-confirm')`。读失败：`ErrorState(moduleId='intake-preview')` 以 `previewTarget` 重试。**④** `intake.spec.ts` 整文件 38 | ✓（AC-003-4 5；AC-003-6 4；confirm refresh 4） | 命令 1～3 **5 / 4 / 4**；命令 4 intake **38** + typecheck / lint。首跑全过 | 满足 |
| T-C03 | **①** `UnassignedPool` 挂载时 `ensureJobs()` + `loadPool()`；归入选项 = `jobs` 中状态属于 `ACTIVE_JOB_STATUSES` 的作业（含 j-failed，不含 j-cancelled / j-delivered）；未选作业时按钮禁用；归入后该行离开池；详情页直达时同样可选。**②** 删除来源：行内 `<section aria-label="确认删除来源">`，默认理由“来源不再适用”可改；理由经 `removeUpload.params.def.items[1]` 校验；取消 0 调用，确认 1 次并带理由；成功后该行从采集列表消失，`listInterventions` 仍有 `remove_source`。**③** 四个写动作成功后经私有 `refreshViews`：`await jobsStore.refresh()` 恰一次，池已加载（`poolStatus !== 'idle'`）时再 `loadPool()` 一次；失败 reject，refresh 与池重读都是 0；`clearPreview(id)` 在 `selection.upload.id` 或 `previewTarget.id` 等于该 id 时清两者并复位 idle / null，失败不动。**④** 三文件回归 | ✓（pool assign 5；remove confirm 4；assign refresh 21） | 命令 1～3 **5 / 4 / 21**；命令 4 **80** + typecheck / lint。首跑：命令 3（当时 26 例）1 fail，新测试的假时钟早于其他种子 `updatedAt`；命令 4 typecheck TS2345 ×4，新 helper 参数类型不兼容。只修新测试 / helper，补 4 例（共 30）后全链重跑通过 | 满足 |
| T-C04 | **①** 列表“投放” → 抽屉显示“未指定作业…”→ 合成空 CSV（内存 Buffer）提交后，`uploads.uploads` 从 2 变 3（`jobId:null`、四项 fileMeta）；进入 j-collect 后“投放到本作业” → 显示“目标作业：j-collect”→ URL 提交后 `details['j-collect'].collect.uploads` +1，ingest 事件恰 1 条，未归属集合不变。**②** 用途空时出现“请填写用途。”，快照仍为 null、列表仍 2 条；两种样例（五项齐全；unknown + null）下 Upload 与 ingest 的 `sourceNote` 都等于输入，文本 Upload 无 `text` 字段，原串不含正文；展开“介入历史”与该条 `<details>` 后，逐字段可见（可靠性显示“高” / “未知”，null 显示“未知” / “无”）。**③** 列表投放进入池 → 预览（未知单位 / 范围）→ 只改草稿时快照不变 → 确认后显示“已入库”→ 选择 active 的 j-collect（不含 j-cancelled / j-delivered，含 j-failed）→ 归入后离池（池回到 2 条），快照中同 id 只改 jobId → 进入 j-collect 后列表含该投放与同状态徽 | ✓（1；2；1） | 命令 1～3 **1 / 2 / 1**；五份 E2E **34 / 0**。首跑全过 | 满足 |

**批次回归时间线**（实施者执行，本会话未重跑；只登记真实发生的运行）：

| 时点 | 树 | 结果 |
|---|---|---|
| A15a `a2efb98` 后 | clean | 全量 `test:unit` **35 files / 1037 / 0**；六守卫；contract 25 / 10 / 2；typecheck / lint；`WI H-2` 27；routes + session 17；v1 契约 88；旧四份 E2E **30** |
| C01 `4af80e8` 后 | clean | 全量 **37 files / 1072 / 0**；六守卫；contract 25 / 10 / 2；typecheck / lint；17 / 27 / badges 48 / job-list 12 / job-detail 13 / job-create 5（4 文件 78）/ v1 88 / real-stubs 24；旧四份 E2E 30 |
| C01a `6529f41` 后 | clean | 全量 **37 files / 1085 / 0**；六守卫；25 / 10 / 2；typecheck / lint；intake 38；78；27；17；旧四份 E2E 30 |
| C03 `7b802d4` 前（同一最终源码） | clean | 全量 **39 files / 1128 / 0**；六守卫；25 / 10 / 2；typecheck / lint；17 / 27 / 48 / 12 / 13 / 5 / 88 / 24；旧四份 E2E 30 |
| C04 `e609c2e` 后（末轮） | clean | 全量 **39 files / 1128 / 0**；`check` 六守卫（colors 24 / 24、负命中 0）；contract **25 methods / 10 events / 2 artifacts**；typecheck / lint（新 E2E 文件在 vue-tsc 文件清单内，单独 eslint 0 警告）；routes + session **17**；`WI H-2` **27**；badges / job-list / job-detail / job-create **78**（48 + 12 + 13 + 5）；v1 契约 **88**；real-stubs **24**；**五份 E2E 34 / 0**（shell + agent + detail-stage + list-create = 30，intake 4） |

**两次源检查停止**（正常范围结果，不是 C02 红测，也不是调用失败）：
1. `6529f41` 后（`astra-drawer-preview-summary.md`）：`intake.spec.ts:260-261` 的 `not.toHaveProperty('selection' | 'pool')` 与 C02 / C03 已审的只读 `selection` / `pool` 冲突；零写入、无 C02 WIP → r6.12.2（`af31dda`）给出首例替换许可。
2. `af31dda` 后（`astra-preview-pool-summary.md`）：`intake.spec.ts:528` 的总按钮数 = 1 与 C02 / C03 新增行级按钮冲突；零写入、HEAD 不变、clean → r6.12.3（`19228ce`）给出第二处许可，并定名 `previewTarget`。

**失败留痕汇总**（以原始日志为准；都是测试结果，不触发回退；旧测试未被改来讨绿）：B06 lint 4；C01 新 URL 测试误期待保留空格；C01a 新测试误读 `job` / lint 26；C03 新测试时钟 / VTU 类型 TS2345 ×4。另有实施者保留性核对脚本的 GBK / CRLF 对照问题（`astra-history-form-final-preservation*.log`，脚本问题，复跑通过）。A01a / A13a / A15a / C02 / C04 首跑全过。

**未执行**：其余 7 份 E2E、全量 `pnpm -C frontend test`、人工截图、后端、46 AC 最终验收。实施者回报每项均未超 2 h，未触发 §7 拆分。

**本批结论**：9 / 9 任务的完成标准在代码中都有对应实现，33 条原定命令的标题都存在，实施者执行全部通过；失败留痕真实，修的都是新测试或新模板。绿测试不等于无缺陷，§5 列出本会话静读得到的 9 项观察，交独立 A 实测判定。

## 3. 两处 `intake.spec.ts` 例外的核对（不削减覆盖、不放过越权）

- `git diff 6529f41 d4e3fb6 -- frontend/tests/component/jobs/intake.spec.ts` 只有：
  - 首例标题 → `starts closed with readonly H-5 state and internal view caches; DTO excludes jobId`；
  - `expect(store).not.toHaveProperty('selection')` → `expect(store.selection).toBeNull()`；
  - 第 528 行 → `expect(collect.findAll('button').filter(button => button.text() === '投放到本作业')).toHaveLength(1)`。
- `git diff d4e3fb6 7b802d4 -- 同文件` 只有：`expect(store).not.toHaveProperty('pool')` → `expect(store.pool).toEqual([])` + `expect(isReadonly(store.pool)).toBe(true)`。
- 可选的 assertTypes 行没有加。selection / previewTarget / pool 的只读类型断言放在新测试文件里（如 `extraction-preview.spec.ts` 首例）。
- 保持不变的内容：该用例其余正向检查（`isOpen` / `jobId` / `draft` 只读 / `Object.keys(store.$state)` 为 `[]` / 原 4 条 `@ts-expect-error` / DTO 不含 jobId / 分配 DTO 三输入）、其余 36 例、imports、helpers、describe 名和用例数（38），以及 AC-003-2 白名单、必填、metadata only、正文不入快照、快照、刷新恰一次、失败不刷新、行序 / 种类 / 用途 / 状态徽 / 缓存不改等业务与隐私断言。
- store 新增的 `selection` / `previewTarget` / `previewStatus` / `previewError` / `pool` / `poolStatus` / `poolError` 都是私有 ref 加对外 `computed`，不进 `$state`；没有用 Proxy / `defineProperty` / 不可枚举或惰性属性隐藏字段。新按钮是真实 `<button>`，没有被改成链接、隐藏或条件渲染。

## 4. 实施中的定形与 P3 / 风险台账（只记事实，不冒称关闭）

**类型 / 名称定形**（同步到 plan【r6.12.4】与 interface-handoff §3 batch5 落地核对；都是已审设计的落地或读法精度，不是需求变更）：

| 实施事实（源码确认） | 原 plan / tasks | 判定 |
|---|---|---|
| `ReliabilityLabel` 图标 = `↑` / `＝` / `↓` / `?`；契约方法数 24 → **25**（只增 `listInterventions`），事件 10、artifacts 2 不变 | r6.12：图标由实施者选非颜色字符 | 精度 |
| `listInterventions` 以 `Date.parse` 升序 + 稳定排序，带时区的同一时刻按记录顺序；filter 为 `z.strictObject` 且 `.optional()`（显式 `null` 被拒） | plan §2.4【r6.12】 | 一致；补读法 |
| `removeUpload` 的 removed 检查位于 `findUpload` / `writableJob` 之后：对终结作业的已删除投放，先返回“已定稿或取消的作业只读。”，再轮到“投放已删除。”（两者都是 validation_error） | tasks T-A13a 已写此顺序 | 一致 |
| intakeStore 导出类型别名：`IntakeDraft`、`IntakeSubmission`（分配式）、`IntakeSelection = {upload: Upload; preview: ExtractionPreview; mapping: FieldMapping}`（plan 写作 `{sourceField,targetField,unit}[]`，即契约 `FieldMapping`） | plan §2.3【r6.12】 | 精度：只按源码登记，不新增名字 |
| 对外：`draft: DeepReadonly<IntakeDraft>`、`selection: DeepReadonly<IntakeSelection> \| null`、`previewTarget: DeepReadonly<Upload> \| null`、`pool: DeepReadonly<Upload[]>`、`previewError` / `poolError: DeepReadonly<ContractError> \| null`、`previewStatus` / `poolStatus: 'idle'\|'loading'\|'ready'\|'error'`；方法 `open / close / updateDraft / resetDraft / submit / selectUpload / editMapping(index, Partial<Pick<FieldMapping[number],'targetField'\|'unit'>>) / confirm / loadPool / assign / remove`；私有 `selectReceipt` / `clearPreview` / `refreshViews` 不在实例上 | plan §2.3【r6.12 / r6.12.3】 | 一致 |
| `submit` / `confirm` 成功经私有 `selectReceipt` 写 `selection` 并置预览 ready / 清错，**不改 `previewTarget`** | r6.12.3 明写“未改 submit / confirm 对 previewTarget 的处理” | 与文档一致；由此引出观察 O-B5-3 |
| `CollectWorkspace` 每行三按钮“预览 / 修正”“删除来源”（及确认面板中的“确认删除”“取消”）；单个 `removeTarget`，同时只开一个确认面板 | T-C02 / T-C03 | 一致 |
| JobListPage 把“新建作业”和“投放”放进 `.intake-actions` 弹性容器；JobDetailPage 用 `useUiStore().viewport.collapsed` 堆叠两列 | T-C01a / T-B06 | 写法精度（O-B5-8） |

**P3 / 风险台账**：

| 项 | 本批事实 | 状态 |
|---|---|---|
| **R3-B**（`review-batch3.md`） | `e1cd4d4` 按 R11 判定的既有领域规则修复（§2 T-A13a）；未借 R4-A 许可，未扩到其他 guard | **代码已修，待第五批独立 A 代码 Review 判定是否关闭**；Converge 不判关闭 |
| R4-A / R2-C | 本批未改 R4-A 的 6 行 `watch` 修复；徽标令牌未动 | 维持已关闭（`46e8fbe`） |
| R11 **S-44** | `InterventionHistory.vue` 只由 B06 写；B06 依赖仍为 B04 / A15a / A01a | 已落实 |
| R11 **S-45** | 提交父链即 DAG 顺序；C03（`7b802d4`）在 A13a（`e1cd4d4`）之后；两次冲突都停下回报，没有“照常实施” | 已落实 |
| R11 **S-46** | `IntakePanel.validateSubmission` 的 file 分支只判 `fileMeta !== null`；元数据在选择 / 拖入边界 parse 一次 | 已落实 |
| R11 **S-47** | 测试 spy 了 `File.prototype.{text,arrayBuffer,stream,slice}`、`FileReader.prototype.readAs*`、`URL.createObjectURL`；理由 schema 取 `params.def.items[1]`；差异样例经 `jobFixtures` 注入；同刻种子取 j-deliver | 已按提示落实 |
| R11 **S-48** | 侧栏常驻、默认收起、展开才读；人工看点仍在 T-G08 / T-G10 | 代码已落实；人工验收未做 |
| R10 S-43（真实 api 乱序 / 旧缓存迟到写入） | 本批不加序号 / 锁 / guard；预览、历史、池的并发都按“mock 按序完成”口径 | 维持 P3 归属，不借本批加防线 |
| R4-B～R4-E、S-41、R3-C、R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B（AgentClient 侧）、R2-D | 本批不涉及 | **未处理**，未经 Walter 风险接受；归属不变 |

## 5. 给第五批独立代码 Review 的观察项（静读所得；不预设严重度，不新增任务，不写防护）

- **O-B5-1（慢提交窗口内的草稿输入保全）**：
  - **事实**：`IntakePanel` 的所有输入都直接绑定 store 草稿（`updateDraft`）。提交期间表单与“提交投放”按钮都没有禁用。`intake.submit` 在 `await dataClient.submitIntake(...)` 返回后**无条件** `resetDraft()`，随后还要 `await refreshViews()`。
  - **静读推演**：slow 场景（mock 写同样延迟 1500 ms）或真实 `api` 延迟下，用户提交 A 后在窗口内开始输入 B（例如粘贴另一段正文、改用途），A 成功时 `resetDraft()` 会把 B 清空。按 plan §3，粘贴正文只存在于内存草稿，不会持久化，清空后无法恢复，用户只能重新粘贴。同类情形：① 窗口内再点一次“提交投放”会产生第二条投放（两条都合法，需要用户手动删一条）；② `ErrorState` 重试会发送上一次提交（已审语义），重试成功同样会清掉用户在报错后改过的草稿。normal 场景中 mock 无延迟，窗口约为 0。
  - **对照**：AC-003-2 / AC-003-3 的字面（能提交、必填、字段随提交）都满足；plan r6.12 定义了“成功后复位草稿”，没有讨论提交中继续编辑的情况。这是具体的用户输入保全问题，不是 API 乱序。
  - **Converge 判定**：不判为对冻结 AC 的明确违反，不新增任务。**交 A 用真实 Chrome 在 `?scenario=slow` 下实测**（提交 A 后 1500 ms 内输入 B，确认 B 是否被清；双击提交是否产生两条投放），并判严重度。可能的修法（提交中禁用、比较草稿后再复位、提交锁等）都属于 AGENTS §5.1 新增的竞态 / 生命周期防线，**须先报 Walter 批准**，本会话不预写方案任务。
- **O-B5-2（迟到回执写入全局 selection）**：`submit` / `confirm` 成功时，`selectReceipt` 无条件把 `selection` 写成回执，并置预览 ready。若窗口内用户已调用 `open(otherJob)`（例如点了另一作业的“投放到本作业”，或关闭后重新打开），`open()` 会先清空 selection，随后迟到的回执又把旧投放写回，抽屉就会在“目标作业：other”下显示上一目标的预览和映射编辑器。若用户在窗口内点了另一行“预览 / 修正”，按 mock 按序完成，最后到达的那次读取生效（S-43 / O-R21-6 口径）。这只是视图错位，写入仍使用提交时的快照（`jobId` 在调用时同步取值）。**交 A 实测**；任何修法同样属于 §5.1。
- **O-B5-3（`previewTarget` 不随 submit / confirm 同步，导致另一 id 的写入误清当前 selection）**：
  - **事实**：`selectReceipt` 不改 `previewTarget`（与 r6.12.3 原文一致）；`clearPreview(id)` 的条件是 `selection.upload.id === id || previewTarget.id === id`，满足时同时清两者。
  - **静读推演**（normal 场景即可确定复现，不依赖慢速或乱序）：详情页 j-collect，在行 A 点“预览 / 修正”（`previewTarget = A`，`selection = A`）→ 在同一抽屉提交新投放 B（`selection = B`，`previewTarget` 仍为 A）→ 对行 A 点“删除来源”并确认 → `clearPreview(A)` 因 `previewTarget` 命中，把 B 的预览和映射编辑器一起清掉，用户在 B 上尚未确认的映射修改随之丢失。这与 tasks T-C03【r6.12.3】“其他 id 不动”的意图冲突，但代码符合同一段的字面规则；文档自身在“selection 与 previewTarget 指向不同 id”时没有给出一致答案。
  - **测试缺口**：`unassigned-pool.spec.ts` 的 `of another id preserves selection and target` 只覆盖 selection 与 previewTarget 指向同一个“其他 id”的情形，没有覆盖两者不一致的情形。
  - **Converge 判定**：代码与 plan / tasks 字面一致，问题出在设计精度，因此本报告不单方面加任务。**建议 A 优先判定**。若判须修，最小方案（约 0.5 h，按 AGENTS §2 第 9 步登记，须同步改 plan §2.3【r6.12.3】那句“未改 submit / confirm 对 previewTarget 的处理”并重跑 Analyze）：`selectReceipt` 同时把 `previewTarget` 置为回执 upload 的副本（或 null），使两者恒指向同一投放；补 1～2 例组件测试。这是状态一致性修正，不是请求序号、锁或生命周期 guard。
- **O-B5-4（选中视图与采集列表的同步、并发预览）**：`selection` 是选中当时的副本。本批唯一改变投放状态的路径是 `confirm`，它会以回执同步 selection；assign / remove 按规则清理（例外见 O-B5-3）；读失败以同一 `previewTarget` 重试，已实现。slow 下连点两行时：先成功后失败 → `selection` 停在 A，同时显示“重试 B”的错误；先失败后成功 → 最终一致。mock 按序，属 S-43 / O-R21-6 / R4-E 同类，本批不加防线。另：确认请求进行中继续编辑映射，成功后会被回执映射替换并转为只读（确认的是点击时的映射）；slow 下双击“确认入库”时，第二次被领域层以 validation_error 拒绝；此时表单已因状态变为非 pending 而隐藏，这次错误不可见。请 A 判断是否需要记录。
- **O-B5-5（封存作业的采集入口）**：intakeStore 不持有目标作业的只读状态。`/jobs/j-delivered/collect` 或 `/jobs/j-cancelled/collect` 中，“投放到本作业”“预览 / 修正”“删除来源”与抽屉内“确认入库”仍会显示，提交时由 `writableJob` 返回 validation_error 并以 `ErrorState` 呈现，数据不变（领域只读门对这些写已生效；待归属池的归入选项已排除 delivered / cancelled）。冻结 spec 把“视图只读”放在 AC-006-7（最终 T-F07：定稿后所有编辑入口隐藏或禁用并说明原因），把“可执行动作”放在 AC-002-5（最终 T-B05）；第五批 9 项的标准都没有要求按作业状态隐藏采集入口。**不判为本批缺口**，已在 T-B05 / T-F07 状态行加阅读提示（非新增标准），由其开工前按原 spec 边界判断；请 A 确认归属。
- **O-B5-6（原生文件输入在复位后不清空）**：`resetDraft()` 把 `fileMeta` 置 null，但没有绑定的 `<input type="file">` 仍显示上次选的文件名（“已选：…”行已消失）。此时不重新选择直接提交，会看到“请选择文件。”。属于 UX 观察。
- **O-B5-7（可靠性图标与涨跌语义）**：`ReliabilityLabel` 用 `↑` / `↓` 表示高 / 低。designUI §2.2 只限定涨跌**颜色**的作用域，`check --only updown` 已通过。在期货场景下箭头是否会被读成涨跌，请 A 判断是否需要记录（不改契约）。
- **O-B5-8（实现写法确认）**：T-B06 以只读 `useUiStore().viewport.collapsed` 作为窄窗断点（`stores/ui.ts` 未改，同 AppShell / Rail 写法）；T-C01a 把列表页两个入口按钮放进 `.intake-actions`。请 A 确认这两种写法在授权范围内，且没有改变既有列表 / 创建测试的语义（job-list 12 / job-create 5 已过）。
- **O-B5-9（证据粒度）**：H-5 定向命令 `intake.spec.ts -t "WI H-5"` 没有以这个形式单独执行过；其覆盖集合（`WI H-5 store` 6 + `container` 1 + `close` 1 = 8）由 C01 命令 4（`4af80e8`，例外替换之前）与 C01a 命令 1 / 2 分别跑过，例外替换后只在 C02 / C03 的整文件 38 / 80 中跑过。请 A 在 `e609c2e` 亲跑 `-t "WI H-5"`（预期 8），作为 H-5 ③ 的复核证据。各次首跑失败原文只在 Temp 日志中（§2 末）。

## 6. 上游与 H-x（只记录，不导入、不代登记）

- **上游**：main `072bb12` 不在祖先，继续 pin `90187f7`；R2-D 同步流程不变；Draft PR #12 保持 Draft、不合。本会话不写 v2 / peer / main 任何树，不扩 guard 范围。
- **H-5**：提供任务 T-C01 / T-C01a 已实施（待本批 Review）。
  - ① **候选** `e609c2e54e02ba1d11912c5c10cf229ada025cba`（第五批最终 producer；生产代码最后一次改动在其父 `7b802d4`，`e609c2e` 只多一份 E2E）。不得拿 `6529f41`（只有部分抽屉）当作当前完整切片。
  - ② R11 `1f99f80`（blob `27a76aa…`）。
  - ③ 实施者执行、待 A：`WI H-5 store` 6（`4af80e8`）、`WI H-5 container` 1 / `WI H-5 close` 1（`6529f41`）、整文件 38（`d4e3fb6` / `7b802d4`）；单独的 `-t "WI H-5"` 未跑（O-B5-9）。
  - ④ **仍缺** → **待消费方集成（未交付）**。
- **页面切片**：提供任务 T-B01 / B02 / B04（第四批已完成，含 B04a）+ T-C01 / C01a / C02 / C03 / C04（本批已实施、待 Review）。
  - ① 候选 `e609c2e`；② B 组历史为 R10 `37e2f71`，C 组为 R11 `1f99f80`。
  - ③ 实施者执行、待 A：`e2e/jobs/intake.spec.ts` 4（1 / 2 / 1）、`detail-stage.spec.ts` 在五份 E2E 34 中全过（其中 `-g "WI AC-002-2"` 4 例）、`job-list.spec.ts` 12。
  - ④ **仍缺** → **待消费方集成（未交付）**；四阶段中 process / analyze / deliver 仍是占位（D–F 未做）。
- **H-1 / H-2·标签（① `5c00cf6`）/ H-2·列表（① `af24c82`）/ H-3 / H-4**：历史生产方证据保留，可并记当前有效 R11；④ 全缺。**H-6** 缺 T-A21；D–F 未做，不冒称完成。H 组（T-H01～T-H04）仍受 v2 外部阻塞。
- **H-2·列表**：交接成员（`jobs` / `listStatus` / `listError` / `ensureJobs` / `refresh` / `createJob`）零差异（`stores/jobs.ts` 本批未改）；`-t "WI H-2"` 27 在末轮复跑通过。
- 生产方集成树 `e609c2e` 只是旁证，不能填作 ④；本会话不代 peer 签收。

## 7. AC 与 Converge 核对项

- **46 AC 最终验收：0 / 46**。本批涉及的最终 AC（AC-007-1 B06；AC-003-2 C01；AC-003-4 / 003-6 C02；AC-003-3 / 003-5 C04；AC-003-1 本地子项 C04）都已实施、命令绿，但最终验收须本批 Review → 全 feature Review / Gate 2，此处不宣称。AC-003-1 的工作台 / 顶栏子项仍 `blocked_by: frontend-workbench-v2`（T-H01）。
- **页面现状**：采集区与介入历史现为功能区；处理 / 分析 / 交付工作区、取消 / 重跑 / 横幅 / 角标 / 收件箱 / 创建者展示 / 持久化横幅都**未做**，不得计为完成。
- **tasks §7 写后统一刷新（S-31）**：本批新增 UI 写路径共四个，都经 `intakeStore` 私有 `refreshViews`：`submit`（IntakePanel）、`confirm`（MappingEditor）、`assign`（UnassignedPool）、`remove`（CollectWorkspace）。成功时 `refresh()` 恰一次，池已加载时再读一次池；失败时不刷新、不改缓存。`unassigned-pool.spec.ts` 的 `WI assign refresh` 对四个动作逐一断言。InterventionHistory 只读，不写。其他写 API 仍没有 UI 调用方，由 T-B05 / D02 / D03 / E02 / E03 / F02 / F03 / F06 / F07 / G02 / G04 接入时核对。
- **tasks §7 外部阻塞**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除 → 必须报“未收敛（外部阻塞）”。

## 8. 结论

- **本批（9 项）**：**已收口，待第五批独立代码 Review**。没有发现对冻结 AC / plan / tasks 的明确违反，不新增修复任务；类型 / 名称定形只是精度（plan / interface【r6.12.4】）；两处测试例外与许可逐行相同。O-B5-1～O-B5-9 交 A 判定：O-B5-1 / O-B5-2 的任何修法都须先报 Walter（§5.1）；O-B5-3 建议 A 优先判定，若须修按 §5 最小方案经 §2 第 9 步登记。
- **feature 整体**：**未收敛（37 项未实施 + H 组外部阻塞）**。73 个任务 / 约 107 h：**36 项已实施** = 27 项已完成 + 本批 9 项待 Review；**37 项未开始**；完成标准 / 命令 245 / 245；46 AC 最终验收 0。
- **不是** Review 通过、Gate 2 或 Handoff；没有写 `review.md`；H-x 无一“已交付”。

## 9. 下一步（第五批独立 A Review 前要做 / 要看的）

1. **集成人**：审阅并提交本 worktree 的文档改动（本会话不 commit），再派审核员 A。
2. **第五批独立代码 Review**（AGENTS §2 第 10 步）：A 新会话、与实施异模型、与实施隔离；首选 `claude-fable-5-1`（先 bridge，限额已确认则走 anthropic）。
   - **只读输入**：冻结 spec；plan / tasks（r6.12～r6.12.4）；Checklist R11 `1f99f80`；本报告与 analyze.md「Analyze R25」；固定代码 diff `b67a227..e609c2e -- frontend`（逐提交见 §0）。
   - **重点**：R3-B 是否可关闭；两处例外没有削减覆盖（§3）；`previewTarget` 的实际类型与清理点，以及 O-B5-3 的不一致状态；O-B5-1 / O-B5-2 在真实 Chrome `?scenario=slow` 下实测；O-B5-4～O-B5-8；侧栏“默认收起、展开才读”；隐私（File 不读、正文不入快照）；非模态审计。
   - 可亲跑本批 33 条命令、`intake.spec.ts -t "WI H-5"`、全量 unit、五份 E2E；其余 7 份 E2E 与全量 `pnpm test` 是否跑由 A 决定，但不得以本报告代替。
3. **依赖链**：依赖全为已完成、可立即起步的未开始任务是 T-A14 / T-A15 / T-A16（T-A16 开工前先定案 R-A）；T-G04 依赖含已实施待审的 T-C01a，须等本批 Review 通过。批次划分由集成人决定。
