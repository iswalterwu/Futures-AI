# Feature: workbench-interaction 任务清单（tasks.md）

> Tasks 阶段产物：每个任务 0.5–2 小时可完成，按依赖顺序执行（Implement 阶段）。
> 执行前置条件：checklist.md 当前有效轮次全部勾选，且本文件（V-02）与 Analyze 报告（I-01b）已由 A 在新会话复核并补勾。当前（Checklist R5）V-02 / I-01b 已勾、P-1 未勾（B-11），须待 A 在新会话 R6 定向复核后才可能补勾；本文件不自宣关闭。
>
> **状态：草案 r5，待 A 新会话 R6 定向复核。** 全部任务“未开始”，没有任务已完成或已验收；本文件不勾选任何检查项。Checklist R5（A = claude-fable-5-1 via anthropic）结论：V-02 / I-01b 已勾，唯一阻断 **B-11**（P-1 工程准则 §5.1 未勾）；S-11～S-18 判为 Tasks 层关闭（非实现完成）。r5 按 A 的 B-11 建议 (a) 修正，**不表示 B-11 已关闭**——关闭与否只由 A 在 R6 判定；本修订未请求、也未声称 Walter 批准任何机制。
> **修订记录**：r5（Checklist R5 之后，单独 Tasks 修订）= B-11 (a)：完全删除 IntakeDrawer 的“首个挂载者登记 / 单实例登记 / 卸载释放”运行时机制——§3 改为“v2 前 `JobListPage` / `JobDetailPage` 是互斥路由视图、各自挂载同一 IntakeDrawer；v2 AppShell 挂载落地后由 T-H01 从本 feature 自有的这两个页面文件移除页面级挂载，不改 `app/**`”；T-C01 标题 / 修改范围 / 完成标准 3 / 命令 3 去掉登记，只保留 metadata only 隐私断言，`stores/intake.ts` 不含实例登记；T-H01 修改范围加“移除两页临时挂载”，完成标准 1 同时断言只渲染一个抽屉，并补工程门（标准 2 / 命令 2）；H 组表述同步为“只清理本 feature 页面级挂载 + 集成验证、不改壳方”。同批落实 R5 非阻断建议：S-19（T-A09 `jobScenarios` 声明句 + T-G06 断言）、S-23（§2 S-15 与 T-A18 标准 3：activeRunId 终态后置 null、仍在跑的第二个带上下文 run 不接任）、S-24（T-A17 标准 2 写明经真实 `commit` + 测试 mutator / 真实边界校验失败 + 真实读 API 取证）、S-22（§7 增实施期超 2 h 拆分提醒，不重拆）；S-20 在 plan §1 所有权行与 §6 回滚块各补一处所有权 / 回滚文字（A 接受 O-3 后的所有权澄清，不是新需求，不改 spec / Gate 1，不改其他 Plan 设计）；S-21 在 analyze.md 新轮处理。任务数 62、依赖、AC、预估均不变（T-H01 仍 1 h）。r1 = 初稿（61 个任务）；r4 = 只更新 §0 外部依赖证据（前端分支在本会话期间前移到 `b991059`，Review 第二轮通过但 Gate 2 未批准、未合入 main），任务、依赖和 AC 都不变；r3 = Analyze R2 之后的单独修订：T-A17 只读门列举补“删除来源 / submitIntake 带封存作业 jobId”（TF-8），T-G06 补依赖 T-B02 / T-C04 / T-D03，使 G06 / G09 的收口排在全部实施任务之后（TF-9）；r2 = Analyze R1 之后的单独 Tasks 修订（同一角色与模型），只处理 analyze.md 的 TF-1～TF-7：把原 T-A05 拆成 T-A05 / T-A06，原 T-A06～T-A23 顺延为 T-A07～T-A24；给最终验收任务补足依赖，删除不相关的“部分前置”引用；明确 e2e 的取证途径（normal 场景 `fai.jobs.v1` + 介入历史界面，不新增窗口钩子）；T-B04 补缺省 stage；T-B07 写明假时钟；工程门 / 持久化完成标准补 AC 引用口径。需求、AC、plan 设计均未改变。
>
> **r5 阶段记录（脱敏）**：角色 = Tasks 修订 / Plan 微调（仅 S-20 两处）/ Analyze；任务 = 按 Checklist R5 真实结论修 B-11 与 S-19～S-24；基线 `8bd1b31`；实际模型 = **claude-opus-5-5 via anthropic**。继承本限额窗口前轮通道证据（`claude-bridge` quota / rate / spend_limit 类已耗尽，exit 1；`anthropic/claude-opus-5-5` 可用），按 AGENTS §6 规则 5 **未重探 bridge、未换模型、未改任何 provider / 路由 / 配置**。
> **阶段记录（脱敏）**：角色 = Tasks；任务 = 按冻结 spec v1.1 与已审 plan（Checklist R4 定向通过）起草可执行任务；Tasks = **claude-opus-5-5 via anthropic**。
> 通道说明：本限额窗口 R3 的真实探活中，`claude-bridge/claude-fable-5-1` 失败（quota / rate / spend_limit 类，exit 1），按 AGENTS §6 规则 5 不在本窗口重试已耗尽的 bridge 通道；`anthropic/claude-opus-5-5` 已真实探活，并实际完成了 Plan 补正（exit 0）。本阶段沿用这项证据：**未发起 claude-bridge 调用，也未单独探活 bridge-opus**，未改任何 provider / 路由 / 配置。只换通道，不换模型。
>
> **基线**：仓库 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD `8bd1b31cfe99aa687338f68f63bf7668a4abaa3b`（**没有新提交**；按 HEAD + 内容 hash 审查）。**r5 当前输入原文 SHA256**：spec.md `ed0f6c6c3e50b93166a02880df574e6f167a5773829ec0ab8d3ddcf269f942d9`（v1.1，46 条 AC，未变）；checklist.md（含当前 R5）`a6cf37f05beb93384ae02a21e0950aa21492806aa1dc7d9dfa8efb55509a5380`（只读，未改）；plan.md 修订前 `981ecc25eb62b41502187eb77fb31e879ba7ee889609336b0065531f9bb81d21` → 本轮 S-20 两处文字后 `2623f32ba54fe7d95c4b2247bc1356f952094e5fe1726dea0d6f69936ed09fc5`（完整 hash 同时登记于 analyze.md Analyze R5 节）。**历史输入（r1～r4 起草时）**：spec 同上；plan `981ecc25…81d21`；checklist（含 R4）`56181b02efcf4620dd821f95c26e12fbcf026dd9b855b8b888821db8f1ce5075`。plan / checklist / specs/README.md 的未提交改动与 tasks / analyze 两个未跟踪文件均原样保留。
>
> **implementation_base_sha: PENDING**（待 frontend-workbench v1 完成 Review、Gate 2 和 Handoff，以合入 main 的 commit 为准；不预填、不编造）。
> **外部闸门**：所有 A–H 实施任务均 `blocked_by: frontend-workbench-v1-handoff`；H 组另外 `blocked_by: frontend-workbench-v2`（其 Gate 1 获批、壳方交付且形成集成基线前不验收）。这只是**实施闸门**，不阻止当前的 Tasks / Analyze 文档工作。真实后端 `api` **不是** mock 验收的前置条件（spec §4 依赖条款）。

## 0. 外部依赖证据（只读核对：首次 2026-10-28T15:31+04:00，复核 15:56+04:00）

| 项 | 事实 | 结论 |
|---|---|---|
| 前端仓库（15:31） | `D:/2030/Futures-AI-frontend`，分支 `feat/frontend-workbench`，HEAD `0ffa15e78551db5669a38033a34f1fe161330f41` | 只是已读到的事实，**不是实施基线** |
| 合入情况（15:31） | `git branch -a --contains HEAD` 只有 `feat/frontend-workbench` 和对应的远端跟踪分支 `remotes/origin/feat/frontend-workbench`；HEAD 不是 `main`（`85c6cbb`）或 `origin/main`（`3bf6476`）的祖先 | v1 未合入 main |
| Review 报告（15:31） | `specs/frontend-workbench/review.md` 在 `git status` 中为 `??`（**未跟踪**）；页首写明“不是 Handoff；Gate 2 尚未批准”；结论“未通过”：P1=0、**P2=1（R1-01 KPI 百分比精度）**、P3=10；没有 Converge 报告 | 未获 Gate 2，不是 Handoff |
| 复核（15:56） | 本会话期间该分支已前移到 `b9910594bcb0fbc68a0f37139cfbe95a035d644a`（`923e238` T-16 修复 R1-01、`b19427a` T-17 Converge、`b991059` 提交 review 第二轮）。`review.md` 现已跟踪，第二轮结论“通过，新增 P1 = 0、P2 = 0”，但仍写明“**不是 Handoff；Gate 2 尚未批准**；未 PR / merge”，首轮 9 项 + 第二轮 2 项 P3 待 Gate 2 处置；`git branch -a --contains HEAD` 只有本地 `feat/frontend-workbench`，HEAD 仍不是 `main` / `origin/main` 的祖先；`CONTRACT_VERSION` 仍为 1.0.0，下列既有测试硬编码事实未变 | 闸门**仍未满足**：缺 Gate 2 批准和合入 main 的 Handoff commit |
| 局限 | 分支会继续移动，报告文件也会变化；以上两次核对只说明“到核对时 v1 Handoff 尚未满足”，不能作为唯一的依赖事实 | 是否解除闸门，以 v1 Handoff 合入 main 的 commit 为准，届时重新核对 |
| r5 说明 | r5 是纯文档修订，**未重新核对**前端仓库；上表仅为 15:31 / 15:56 两次核对时的事实（Checklist R5 的 A 只读核对时亦为 `b991059`：Review 第二轮通过，但 Gate 2 / Handoff 未批准、未合入 main）。文档修订不追逐移动中的分支 | 闸门结论不变：implementation_base_sha 仍 PENDING；Implement 开工时在该 SHA 重新核对 |

下表是在 `0ffa15e` 只读确认、`b991059` 复核未变的前端事实（Handoff 前可能变化，**Implement 开工时须在 implementation_base_sha 重新核对**；如有出入，先修订本文件并经 A 复核，不得边做边改）：

- `frontend/package.json` 脚本：`contract`（不是 contract-build）、`check`（支持 `--only generated|colors|glass|updown|grid|network`）、`typecheck`、`lint`、`test:unit`（`vitest run`）、`test:e2e`（`playwright test`）、`test`（= check && typecheck && lint && test:unit && test:e2e）。
- `vitest.config.ts` 的 include 为 `tests/**/*.spec.ts`，环境 happy-dom，setup 为 `tests/setup.ts`（每个用例前新建 Pinia）；`playwright.config.ts` 的 testDir 为 `./e2e`（递归），使用 Chrome 通道，baseURL 为 `127.0.0.1:4173`。
- `scripts/contract-build.mjs` 由 `contractSchemas`（types.ts）+ `methodSemantics` / `contractSemantics`（methods.ts）+ AgentEvent 表驱动：schema 的 `describe` 和 `const` / `enum` 会进入 CONTRACT.md 字段清单；`contractSemantics` 中的字符串项进入 §1 通用约定；**§4 Mock 和 §5 Agent 回放是生成器内的静态文案**（只写了 v1 的五个场景）。本 feature **不修改生成器**，新语义一律经 `describe` / `contractSemantics` 进入文档；§4 静态文案与 §1 `jobScenarios` 并存的口径由 T-A09 的声明句消解（S-19）。
- real 桩在 `src/contracts/real/index.ts`（NotImplementedError，没有网络调用）。mock fixture 测试用 `fixtures/*.json`（不递归）断言恰好 9 个文件；frontend-workbench 既有契约测试中硬编码了 `contractVersion: '1.0.0'`、方法数 12 和 `dataMethods` 键列表（`tests/unit/{mock,contracts,contract-doc}.spec.ts`）。
- 既有测试的 describe 用的是 frontend-workbench 自己的 AC 编号（如 `AC-007-4 fixtures`、`AC-009-1`）。与本 feature 的 AC 编号重名，因此本 feature 测试必须用路径前缀隔离（见 §1）。

## 1. 全局约定

1. **测试路径隔离**：本 feature 的测试只放在 `frontend/tests/unit/jobs/**`、`frontend/tests/component/jobs/**`、`frontend/e2e/jobs/**`；describe / test 标题以 `WI AC-xxx-x` 开头。验证命令**总是带上 jobs 路径**，需要细分时再加 `-t` / `-g "WI AC-…"`，避免误跑 frontend-workbench 中同编号的 AC 而产生假阳性。
2. **命令形态**（在仓库根执行）：`pnpm -C frontend test:unit <路径> [-t "<标题>"]` 即 `vitest run`；`pnpm -C frontend test:e2e <路径> [-g "<标题>"]` 即 `playwright test`；`pnpm -C frontend contract` 生成，`pnpm -C frontend contract --check` 只读对拍；`pnpm -C frontend check --only <name>`；`pnpm -C frontend typecheck`；`pnpm -C frontend lint`；`pnpm -C frontend test` 跑全量。
3. **当前不执行**：下列测试文件全部是**计划新建**，现在还不存在。每条验证命令在对应实施任务交付测试后执行；本文件的任何命令都不表示已经运行或已经通过。
4. **工程门**：凡改动 TS / Vue 的任务，最后一条完成标准都是“类型检查 + lint 通过”（命令：`pnpm -C frontend typecheck && pnpm -C frontend lint`）；凡改动 contracts schema 或方法表的任务，还须执行 `pnpm -C frontend contract` 后用 `pnpm -C frontend contract --check` 对拍，生成物只靠生成更新，不手改（AGENTS §5.5）。
5. **文件所有权**（plan §1）：本 feature 只改 `frontend/src/jobs/**`、`frontend/src/contracts/**`（作业类型 / 方法 / mock / real 桩 / 可选 `SendMessage.jobContext`）、`frontend/src/agent/events.ts`（可选 `jobContext`）、`frontend/src/main.ts`（只加作业路由注册）、上述 jobs 测试，以及 T-A09 指定的三份既有**契约**测试中受 v2 影响的断言（plan §1 所有权与 §6 回滚已登记，S-20）。T-H01 对壳方的唯一相关动作是移除本 feature 自有的 `frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 中的页面级 IntakeDrawer 挂载（仍在 `jobs/**` 内）。**不改** `frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue,AppShell.vue}`、`frontend/src/workbench/WorkbenchPage.vue`、`frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}`、`scripts/contract-build.mjs`、`scripts/check.mjs`、`backend/`、`docs/`、冻结的 spec。
6. **契约 schema 放置**：作业契约 schema 写在 `frontend/src/contracts/types.ts` 末尾的“作业契约 v2”段（plan §2.4 允许写在 types.ts）。不另建 `job-types.ts`，以免与 types.ts 循环导入（job schema 要用 `TimestampSchema` / `SparkSeriesSchema`，而生成器只从 types.ts 读取 `contractSchemas`）。
7. **入口只校验一次**（AGENTS §5.2）：契约输入、返回值和本地快照入口各 parse 一次；表单只复用契约导出的 schema / 常量给出即时提示，不另立规则；组件不重复校验契约数据。
8. **任务状态**：每个任务标“状态：未开始”与 blocked_by；Implement / Converge 只在任务真正完成后更新状态，A 复核前不改。

## 2. S-11～S-18 设计取舍与落点

| # | 取舍（Tasks 定案，不改生成器 / plan / spec） | 落点任务 | 验证 |
|---|---|---|---|
| S-11 | 每张展示映射写成 **zod literal-object schema**：`z.object({<枚举值>: z.object({text: z.literal(…), icon: z.literal(…)})}).describe(…)`，与运行时常量**同源**（schema 由同一个 `as const` 对象生成），注册进 `contractSchemas`。现有生成器把 `const` 渲染进 CONTRACT.md 的字段清单，无需修改 `contract-build.mjs`。映射共九张：`JobStatusLabel`、`StageLabel`、`StageStateLabel`、`ArtifactStatusLabel`、`UploadStatusLabel`（AC-003-6 要求文案，plan 的 Label 列表未列，按同一机制补齐）、`DeliverableStatusLabel`、`SourceLabel`、`OriginLabel`（S-17）、`JobTypeLabel`。徽标组件只 import 这些常量 | T-A01、T-A23、T-G06 | `contract-labels.spec`（键集合 = 枚举 options；常量过 schema）；`contract-doc.spec`（CONTRACT.md 含每条 text）；`badges.spec` |
| S-12 | `Revision` 写成 `z.discriminatedUnion('artifactKind', …)`，四个分支共用 `{id,artifactId,number,baseRev,author,createdAt,summary,changeSummary}`：**dataset** → `uploads:[{uploadId,mapping,status}]`（入库摘要，不含原文）；**recipe** → `params:ParamSet` + `steps:RecipeStep[]`；**analysis** → `conclusions:Conclusion[]`（删除 / 否决以 tombstone 字段保留）；**deliverable** → `blocks:Block[]`（与 plan 的 `Revision.blocks` 同名同位，兼容 `FinalSnapshot.blocks` 快照）。历史不可变：提交时深拷贝入库，读 API 返回副本 | T-A05（schema），T-A14 / T-A15 / T-A16（各 kind 产生修订），T-A16（不可变性单测） | `contract-entities.spec` 正反例；`job-state-deliverable.spec`（修改读取结果后再读不变） |
| S-13 | `getJob` 的结果 schema = `JobSchema.nullable()`。null **只**出现在 empty 场景下查询 fixture 预置 id 时（界面显示“暂无作业”）；任何场景下的未知 id 都返回 `not_found`。empty 场景的 `getStageWorkspace` 对预置 id 返回带阶段的空集合。AC-001-4 的空态断言用预置 id（`/jobs/j-collect/collect?scenario=empty`） | T-A02（describe），T-A10（实现），T-B04（组件 / 断言） | `job-state-read.spec`（null / not_found 两分支）；`job-detail.spec` |
| S-14 | `StageState` 不新增 failed：run 失败时当前运行阶段置 `conflict`，`job.status=failed`，`job.reason` 必填（Job schema 用 refine 约束 failed / cancelled 时 reason 非空）。`StageStateLabel.conflict` 和 `JobStatus` 的 describe 写明“运行失败以 conflict 呈现，原因见 Job.reason”；j-failed 样例也写明 | T-A01、T-A02、T-A07、T-A20、T-B05、T-G06 | `contract-labels.spec`、`job-state-rerun.spec`、`job-detail.spec`、`contract-doc.spec` |
| S-15 | **任何带 jobContext 的 send**（抽屉 / 分析台追问、改稿、重跑）在受理后由状态层登记 `runId→{jobId,stage}`：若该作业没有 activeRunId 且不是 cancelled / delivered，则把 activeRunId 设为该 runId，直到它的终态；**终态后 activeRunId 置 null**。作业已有 activeRunId 时，新 run 只登记上下文，事件照样带上下文，**但不替换 activeRunId，其终态也不合并 overlay**（重跑请求按 T-A20 排队）；首个 run 终态后，这个仍在运行的第二个带上下文 run **不接任** activeRunId（其终态仍不合并 overlay），只有此后新受理的带上下文 send 才可能成为 activeRunId（S-23：只是一句规则口径，不加运行时调度 / 接任机制）。**不带 jobContext 的 send 不登记、不改任何作业**。事件的 jobContext 取登记时（发送时）的值，不随页面改变。状态层先处理事件、再通知订阅者，每个事件只投递一次，不重放、不复制。ask_why / what_if 只由 submitIntervention 记一条介入，send 不再追加 | T-A18（规则与正反例），T-E03，T-G01 | `job-state-agent.spec`；`e2e/jobs/analyze.spec.ts`；`e2e/jobs/pending-merge.spec.ts` |
| S-16 | `InterventionKind` 正好 13 个值（含独立的 `finalize`）。describe 写明“v1 子集；interaction §3.4 的 `source_pref` / `value_fix` 归后续处理台 / data-layer 映射 feature；定稿在 interaction 示意表中归 approve，本契约用独立的 finalize 承载”。本 feature 不实现换源 / 手工修正值 | T-A01、T-G06 | `contract-labels.spec`（不含两种后续 kind）；`contract-doc.spec`（含注记） |
| S-17 | `origin=derived` 的来源徽文案为“**内部生成**”，并保留 `source`（人 / agent / 混合）作为次文案（如“内部生成 · agent”）和作者信息；`origin=source` 时用 `SourceLabel`。文案来自 `OriginLabel`（同 S-11 机制）。根来源索引和“推断”标记归 D-017 / 知识库 feature，本 feature 不实现。不新增色值 | T-A01、T-A23、T-E01、T-F01 | `badges.spec`；`analyze.spec`（AC-005-1）；`deliver-blocks.spec`（AC-006-8） |
| S-18 | `Deliverable` 写成**可导出的判别联合** `z.discriminatedUnion('deliverableStatus', [draft: 三锚 z.null(), final: finalSnapshotId 非空 / finalRevisionNumber 正整数 / finalizedAt 为 Timestamp])`，在 JSON Schema 中是 oneOf，能进入 CONTRACT.md。交付台工作区结果 schema（同时携带 deliverable 和 finalSnapshot）上再加**一次** superRefine：final 的三锚必须与快照的 id / revision number / finalizedAt 一致；draft 时 finalSnapshot 必须为 null。两者都在契约边界 parse 一次，组件不做二次校验。正例：j-deliver（draft）、j-delivered（final）；反例：draft 带非空锚、final 缺锚、final 锚与快照不一致、draft 却带快照 | T-A04（schema），T-A08（fixtures），T-A17（定稿写入），T-G06 | `contract-deliverable.spec` 正反例；`fixtures.spec` |

## 3. 范围边界（实现不得越界）

- **只实现 spec 已有的行为**。不做：真实文件解析 / URL 抓取 / 剪藏预览、知识写入闸门、验证队列、格物致知、分析协议蒸馏 / 规则激活、D-019 角色芯片 / 模型档 / 成本、N+1 撤销 / 反定稿、自动定稿、未审阅归档、作业级“重试”的实际实现（AC-002-5 只显示归属说明占位）、导航 / 首页作业轨道 / 顶栏投放 / 抽屉上下文标签（归 v2）、真实后端。
- **六类块的 v1 编辑边界**：结论 / 备注可 inline 编辑；图表 / 表格 / 引用 / 待验证只读（待验证块只是只读文本，没有验证队列）；所有块都可批注；块顺序只读。
- **两种状态分开**：产物 / 块的 `status`（draft / provisional / confirmed / conflict）与交付物的 `deliverableStatus`（draft / final）相互独立；confirmed ≠ final。交付物状态只由 `finalizeDeliverable` 改变，不从 job.status 或“快照是否存在”推导。
- **定稿**：显式动作、二次确认；不自动定稿；不可撤销（定稿后没有反向方法，所有领域写方法都在契约入口拒绝）；v1 只做冻结和派生标记（D-018 §1 ①）。
- **IntakeDrawer 的挂载**（plan §2.1 / §4.2 没写明 v2 之前由谁挂载；r5 按 Checklist R5 B-11 建议 (a) 修订）：v2 之前由 `JobListPage` 和 `JobDetailPage` 各自挂载同一个 IntakeDrawer（二者是互斥的路由视图，同一时刻只有一个存在，不会双渲染）；v2 的 AppShell 挂载落地后，由 T-H01 从本 feature 自有的这两个页面文件中移除页面级挂载（不改 `app/**`，壳方代码不动）。不设任何“首个挂载者登记 / 单实例登记 / 卸载释放”运行时机制，`intakeStore` 不含实例登记。

## 4. 任务

### A 契约与骨架

### T-A01 契约枚举与展示映射（S-11 / S-14 / S-16 / S-17）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：无
- **上下文**：plan §2.4 的枚举和“契约展示映射”；徽标只消费契约的文案 / 图标（AC-001-5“映射由契约声明”）。
- **修改范围**：`frontend/src/contracts/types.ts`（新增“作业契约 v2”段：`Stage`、`StageState`、`JobType`、`JobStatus`、`ArtifactKind`、`ArtifactStatus`、`Source`、`Origin`、`InterventionKind`、`InterventionOutcome`、`UploadStatus`、`DeliverableStatus` 枚举；按 §2 S-11 定义九张映射 schema 和同源常量；全部并入 `contractSchemas`）；生成 `frontend/contracts/{CONTRACT.md,schema.json}`；新建 `frontend/tests/unit/jobs/contract-labels.spec.ts`。
- **完成标准**：
  1. 枚举值与 spec R-001 / plan §2.4 一致：9 种作业状态、4 个阶段、5 种阶段态、3 种类型、13 种 kind，不含 `source_pref` / `value_fix`（AC-008-1 部分前置；S-16）。
  2. 每张映射的键集合等于对应枚举 options，每个值都有非空 text 和 icon；`OriginLabel.derived.text = '内部生成'`；`DeliverableStatusLabel` 为 草稿 / 已定稿（AC-001-5、AC-003-6、AC-006-8 部分前置：映射由契约声明；S-11 / S-17）。
  3. S-14、S-16 的 describe 文案进入生成的 CONTRACT.md（AC-008-1 部分前置）。
  4. 生成物与源一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**（交付测试后执行，当前不执行）：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI enums"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI labels"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI contract notes"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A02 作业、阶段摘要、上下文与收件箱 schema（S-13 / S-14）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：T-A01
- **上下文**：plan §2.4 的 Job / JobListItem / JobContext / InboxItem；camelCase 命名对照。
- **修改范围**：`types.ts`（`StageSummary{stage,state,pendingCount}`；`Job`：id/title/type/subject/goal/createdBy(human|schedule)/status/currentStage/updatedAt/parentJobId(null)/reason(string|null)/stages(四项)/pendingCount，refine 约束“stages 按固定顺序且四项各一”和“failed / cancelled 时 reason 非空”；`JobListItem`（摘要）；`JobContext{jobId,stage}`；`InboxItem`（plan 字段，不适用的锚可为 null）；describe 写明 `getJob` 的 null 语义（S-13）与 snake_case → camelCase 对照）；生成物；新建 `tests/unit/jobs/contract-entities.spec.ts`。
- **完成标准**：
  1. 正例 parse 通过；反例被拒：stages 顺序错误或缺项、failed 没有 reason、缺必填字段（AC-001-1、AC-002-1、AC-002-5 部分前置）。
  2. 生成的文档登记 `job_id→jobId`、`artifact_id→artifactId`、`base_rev→baseRev`、`created_at→createdAt`（AC-007-1、AC-008-1 部分前置）。
  3. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI job schema"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI naming"`
  3. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A03 采集 / 处理 / 分析内容 schema（文件白名单在契约）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A01
- **上下文**：plan §2.4 的 Upload / SourceNote / ExtractionPreview / FieldMapping / RecipeStep / ParamChange / ReconciliationDiff；分析台结论卡与证据链（spec R-005）。plan 类型表没有单列 Conclusion，这里按 spec R-005 与 interaction §3.2 定义最小形态，不加行为。
- **修改范围**：`types.ts`：`SourceNote`（purpose 非空、reliability 四档、`publishedAt` / `validUntil` 为 TradingDate|null、scopeNote 为 string|null）；`IntakeInput` 判别联合（file：`fileMeta{name,size,type,lastModified}`，扩展名白名单 pdf / docx / xlsx / md / csv 由 refine 约束并导出常量 `INTAKE_FILE_EXTENSIONS`；url：字符串；text：非空正文，只在提交参数中出现）；`Upload`（plan 字段 + removed + quarantineReason?）；`FieldMapping`、`ExtractionPreview`；`DataSourceRef` / `SeriesRef`；`RecipeStep`（输入 / 输出锚、单链）；`DerivedValue{value,unit,lineage:[observation 或 tableRow 锚]}`；`ParamSet` / `ParamChange`（unit / timezone / calendar / resample / aggregation）；`ReconciliationDiff`（两个来源，行含原值 / 差值 / differs，元数据复用 Figure 字段，空差异 = 空行集）；`EvidenceAnchor{kind:assertion|series|source,ref,label}`、`Conclusion{id,text,status,source,origin,evidence[],deleted?,vetoed?}`；生成物；新建 `tests/unit/jobs/contract-intake-process.spec.ts`。
- **完成标准**：
  1. 白名单外的扩展名（如 `.exe`、`.png`、无扩展名）、空 purpose、非法 reliability、`publishedAt` 用时间戳（而非日期）都被拒；五种合法扩展名和三种输入都能通过（AC-003-2、AC-003-3 部分前置）。
  2. `ReconciliationDiff` 接受空行集；`DerivedValue` 的 lineage 至少一项（AC-004-1、AC-004-3 部分前置）。
  3. `Conclusion` 的证据数由 `evidence` 数组决定，不另设计数字段（AC-005-1、AC-005-2 部分前置）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-intake-process.spec.ts -t "WI intake schema"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-intake-process.spec.ts -t "WI process schema"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/contract-intake-process.spec.ts -t "WI analysis schema"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A04 交付物、块、批注与定稿快照 schema（S-18）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A01、T-A03
- **上下文**：plan §2.4 的 Deliverable / Block / ChartSpec / BlockComment / FinalSnapshot；designUI §5.1 / §5.2。
- **修改范围**：`types.ts`：`Block` 以 type 为判别的六分支（conclusion / note 带 text；quote 带 text 和 source 锚；table 带 columns / rows / tableId；verification 带 question 和结论块锚；chart 带 chartSpec 和 seriesData，seriesData 复用 `SparkSeriesSchema`），共同字段 id / status / source / origin / anchors / comments；`ChartSpec{templateId:'line-sample',seriesBindings:{main},overrides:{title?}}`；`BlockCommentThread{threadId,blockId,status:open|resolved,comments[]}` 与 `BlockComment{id,threadId,parentId,author,text,createdAt}`；`Deliverable` 判别联合（S-18）；`FinalSnapshot{id,jobId,revisionId,finalizedAt,blocks}`；`DeliverWorkspace{deliverable,finalSnapshot|null,…}` 加一次 superRefine（S-18）；生成物；新建 `tests/unit/jobs/contract-deliverable.spec.ts`。
- **完成标准**：
  1. 六类块正例全部通过；chartSpec 的 templateId 不是 `line-sample`、或传入任意 ECharts option 时被拒（AC-006-1 部分前置）。
  2. S-18 正例（draft 三锚为 null、final 三锚非空且与快照一致）通过；四个反例被拒（AC-006-7、AC-008-1 部分前置）。
  3. 生成的 schema.json 中 Deliverable 是 oneOf，CONTRACT.md 中可见 draft / final 两个分支（AC-008-1 部分前置）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-deliverable.spec.ts -t "WI blocks"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-deliverable.spec.ts -t "WI S-18"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/contract-deliverable.spec.ts -t "WI generated deliverable"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A05 产物、版本（S-12）、阶段工作区结果与写回执

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A02、T-A03、T-A04
- **上下文**：plan §2.4 的 Artifact / Revision；“写回执包含已改变的作业 / 产物 / 版本 / 事件与 inbox 计数”。
- **修改范围**：`types.ts`：`Artifact`（id / kind / status / source / origin / latestMergedRev / overlayRev / pendingMerge / pendingRunId，无 overlay / run 时为 null；refine：`pendingMerge=true` 时 overlayRev 非空）；`Revision` 判别联合（S-12）；`StageWorkspace` 以 stage 为判别（collect：uploads + dataset 产物；process：sources / series / recipe 产物 / derivedValues；analyze：analysis 产物；deliver：`DeliverWorkspace`）；`WriteReceipt{jobs,artifacts,revisions,inbox:{unread,byStage}}`（`interventions` 字段在 T-A06 定义 Intervention 后补入）；生成物；扩充 `contract-entities.spec.ts`。
- **完成标准**：
  1. Revision 四分支正例通过；分支与内容不匹配时被拒（如 recipe 分支带 blocks）（AC-004-2、AC-006-4 部分前置；S-12）。
  2. Artifact 的 `pendingMerge=true` 而 overlayRev 为空时被拒（AC-004-2、AC-007-2 部分前置）。
  3. 四种 StageWorkspace 正例通过，stage 与内容不匹配时被拒（AC-001-4、AC-004-5、AC-005-6 部分前置）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI revision"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI artifact"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI workspace"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A06 介入事件与 payload 联合（动作矩阵）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：T-A05
- **上下文**：plan §2.4 Intervention 十字段与“动作 → 方法 → kind”19 行矩阵；从 T-A05 拆出的独立增量（Analyze R1 TF-1）。
- **修改范围**：`types.ts`：`InterventionPayload` 以 action 为判别，覆盖矩阵全部 action（ingest、map_fix、recipe、annotate、ask_why、what_if、deepen、delete_conclusion、veto、pin_rule(state='candidate')、remove_source、cancel_job、edit_block、revise_blocks、block_comment、reply_comment、resolve_comment、mark_provisional、rerun、accept、revert、resolve_conflict、finalize）；`Intervention`（十个必有字段；作业级事件 artifactId / baseRev 可为 null；refine 约束 action 与 kind 的对应关系和矩阵一致）；给 `WriteReceipt` 补 `interventions: Intervention[]`；生成物；扩充 `contract-entities.spec.ts`。
- **完成标准**：
  1. 每个 action 都有正例；kind 与 action 不匹配时被拒（如 `annotate` + `veto`）（AC-005-3、AC-007-1 部分前置）。
  2. pin_rule 缺 `state='candidate'` 时被拒（AC-005-4 部分前置）。
  3. 十个字段齐全；payload 不接受任意 JSON（多余的 action 被拒）（AC-007-1、AC-008-1 部分前置）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI intervention kinds"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI pin_rule candidate"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI intervention fields"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A07 作业 fixtures（一）：jobs / job-detail

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A06
- **上下文**：plan §2.4 的场景样例表（normal：j-collect / j-process / j-deliver / j-failed / j-cancelled；job-running：j-running / j-human；job-pending-merge：j-merge；job-conflict：j-conflict；job-delivered：j-delivered）。
- **修改范围**：新建 `frontend/src/contracts/mock/fixtures/jobs/jobs.json`（十个作业，status / currentStage / 四阶段状态与 plan 表逐行一致；j-failed、j-cancelled 带 reason；j-failed 的 describe / 备注写明 S-14）、`fixtures/jobs/job-detail.json`（collect / process / analyze 工作区：上传与预览、两个数据源两条序列、单链配方 ≥3 步、派生值 lineage、一条有差异和一条空差异的对账、分析结论 ≥3 条且证据锚三种都有；j-conflict 有 conflict 结论和可用的 provisional 快照）。放在 `fixtures/jobs/` 子目录，**不改变** `fixtures/*.json` 的 9 文件计数；新建 `tests/unit/jobs/fixtures.spec.ts`。合成样例，不含私有数据。
- **完成标准**：
  1. 两个文件全部通过对应的边界 schema；十个作业的 status / currentStage / 阶段状态与 plan 样例表一一相符（AC-008-2、AC-002-3、AC-002-5、AC-005-6 部分前置）。
  2. 列表样例覆盖三种类型和多种状态，updatedAt 互不相同，可以检验倒序（AC-001-1、AC-001-2 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI jobs fixtures"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI list coverage"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A08 作业 fixtures（二）：deliverable / interventions / uploads

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A07
- **上下文**：交付台、介入历史、待归属池的样例；S-18 的正例。
- **修改范围**：新建 `fixtures/jobs/deliverable.json`（j-deliver：六类块按 结论 / 图表 / 表格 / 引用 / 待验证 / 备注 排列，两个历史版本（agent v1、human v2），一个 open 批注线程，deliverableStatus=draft；j-merge：结论块 + 至少一个备注块，初始无 overlay；j-conflict：一个 conflict 块，带人版和 agent 版修订；j-delivered：final，三锚与 FinalSnapshot 一致）、`fixtures/jobs/interventions.json`（跨阶段、跨 kind，供筛选测试）、`fixtures/jobs/uploads.json`（两条待归属、一条 quarantined 并附原因）；扩充 `fixtures.spec.ts`。
- **完成标准**：
  1. 三个文件全部过边界 schema；j-deliver 和 j-delivered 各过一次 S-18 parse（AC-006-7、AC-008-1 部分前置）。
  2. 只有 j-delivered 为 final，其余都是 draft（AC-006-7 部分前置）。
  3. 介入样例的十个字段齐全，且至少覆盖两个阶段、三种 kind（AC-007-1 部分前置）。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI deliverable fixtures"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI final only delivered"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI interventions fixtures"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A09 契约版本 2.0.0、九场景、变更说明与既有契约测试对齐

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A08
- **上下文**：plan §1 的契约版本、§2.4“场景与驱动”。生成器的 §4 是静态文案，因此场景和变更说明要经 describe / `contractSemantics` 进入文档。
- **修改范围**：`types.ts`（`CONTRACT_VERSION='2.0.0'`；`BootstrapSchema.scenario` 扩成九个值，describe 写明四个 job-* 场景，并说明 v1 的十个方法在 job-* 场景下按 normal 行为）；`methods.ts` 的 `contractSemantics` 增加字符串项 `contractChange`（2.0.0 变更说明：新增作业方法、封闭场景枚举扩展、可选 jobContext、为何升 MAJOR、旧 bootstrap 不兼容）和 `jobScenarios`（九场景行为摘要、作业样例 id；并明写声明句“CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准”（S-19，不改生成器））；`mock/index.ts` 的 `MockOverrides.jobFixtures`（键为 `fixtures/jobs` 的文件名，在边界校验；不新增 `jobScript`）；**只**修改既有契约测试 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受 v2 影响的硬编码断言（版本字面量改为引用 `CONTRACT_VERSION`；方法数与键列表改为“包含 v1 十个方法、总数等于 methodSemantics”）。保留全部 v1 断言语义，不删 v1 用例。生成物；新建 `tests/unit/jobs/contract-version.spec.ts`。
- **完成标准**：
  1. bootstrap 返回 2.0.0；九个场景均可解析，未知场景返回 validation_error；`?scenario=` > `VITE_MOCK_SCENARIO` > normal 的优先级不变（AC-008-2、AC-008-4 部分前置）。
  2. CONTRACT.md 标题为 v2.0.0，§1 含变更说明和 job 场景说明，job 场景说明含 S-19 声明句（AC-008-4 部分前置）。
  3. frontend-workbench 既有单测在新契约下全部通过，被改的只有上述硬编码断言（plan §6“合并前跑其 pnpm test”；AC-009-1 部分前置：全量命令包含既有单测）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-version.spec.ts -t "WI scenarios"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-version.spec.ts -t "WI change note"`
  3. `pnpm -C frontend test:unit tests/unit/contracts.spec.ts tests/unit/contract-doc.spec.ts tests/unit/mock.spec.ts`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A10 mock 状态层核心与读方法（S-13）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A09
- **上下文**：plan §2.3“契约 mock 层持有唯一可变状态”，§2.4 九场景 × 读方法表。
- **修改范围**：新建 `frontend/src/contracts/mock/job-state.ts`（按场景从 fixture 建会话状态；单一 `commit(mutator)`：在深拷贝上修改 → 边界校验 → 整体替换，失败时不留部分修改；读 API 返回副本）；实现 `listJobs(filter?)`（状态 / 类型 / 标题子串组合筛选，缺省 updatedAt 倒序）、`getJob`（S-13）、`getStageWorkspace`；empty / error（业务读方法返回 adapter_error，bootstrap / 目录仍然成功）/ slow（每次调用延迟 1500ms）/ boot-error / job-* 的读行为；`client.ts` 的 `DataClient` 接口、`methods.ts` 的 `dataMethods` 语义、`real/index.ts` 的 NotImplementedError 桩（无网络）、`mock/index.ts` 接线。生成物；新建 `tests/unit/jobs/job-state-read.spec.ts`、`tests/unit/jobs/real-stubs.spec.ts`。
- **完成标准**：
  1. 筛选组合、清空后恢复全量、倒序都正确（AC-001-2 部分前置）。
  2. empty：预置 id 时 `getJob` 返回 null，`getStageWorkspace` 返回带阶段的空集合；未知 id 在 normal / empty 下都是 not_found；error 时三个读方法都返回 adapter_error（AC-001-4、AC-004-5、AC-005-6 部分前置；S-13）。
  3. slow 在 1499ms 时尚未返回、1500ms 时返回（假时钟）（AC-008-2 部分前置）。
  4. real 桩覆盖 `DataClient` 的全部键，并抛出 NotImplementedError（AC-008-3 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI listJobs"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI scenarios read"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI slow"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/real-stubs.spec.ts`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A11 本地持久化 persistence.ts 与 resetMockData

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A10
- **上下文**：plan §2.3 / §3 的持久化规则。plan 没写横幅如何得知持久化状态，本任务由 `persistence.ts` 提供只读状态订阅（`getPersistenceStatus()` / `onPersistenceStatus(cb)`，取值 `ok|degraded|unreadable`），供 T-G04 的横幅使用；不经业务契约。
- **修改范围**：新建 `frontend/src/jobs/persistence.ts`（`fai.jobs.v1` = `{version:1,data}`；`fai.inbox.v1` = 已读 id；UTF-8 字节数用 TextEncoder 计算，上限 512 KiB；配额异常时降级）；`job-state.ts` 接入：只有 normal 场景读写；每次成功 commit 后保存；`resetMockData`（normal：删除两个 key 并重建 fixture；其他场景：只重建内存）；`DataClient` / `methods.ts` / real 桩加 `resetMockData`。生成物；新建 `tests/unit/jobs/persistence.spec.ts`。
- **完成标准**（正负向齐全）：
  1. normal 下保存后新建 client 能读回；持久化子集为白名单：Upload 只含 id / jobId / inputKind / fileMeta / url / sourceNote / mapping / status / createdAt / removed，不含粘贴正文和 File 对象（spec §4 持久化；AC-003-3 部分前置）。
  2. 超过 512 KiB 或 setItem 抛异常 → 状态 degraded，内存继续可用，**最后一次成功的快照仍在、未被删除**（spec §4 持久化约束，无独立 AC；随 AC-009-1 全量回归）。
  3. 内容损坏或版本不支持 → 本次用 fixture，状态 unreadable，**原 key 保留**，本会话不自动覆写；只有 resetMockData 才删除（spec §4 持久化约束，无独立 AC；随 AC-009-1 全量回归）。
  4. 八个非 normal 场景对两个 key 一律不 getItem / setItem / removeItem（Storage spy 计数为 0）；切场景不清空；`fai.rail` / `fai.drawer` / `fai.layout` 不受影响（AC-008-2 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI whitelist"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI degrade"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI corrupt"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI non-normal"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A12 写方法：createJob 与投放主流程

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A11
- **上下文**：plan §4.1 / §4.2；矩阵中的 ingest / map_fix。
- **修改范围**：`job-state.ts` + 接口 / 方法表 / real 桩 / mock 接线：`createJob(input)`（写入 collecting / collect，阶段为 R,N,N,N；初始空产物；交付物 draft，定稿锚为 null）、`submitIntake(input)`（jobId 在提交时确定，没有作业则进入待归属；返回 pending_validation 的预览；有作业时写 ingest 事件）、`getIntakePreview(uploadId)`、`confirmIntake(uploadId, mapping)`（默认 ingested；fixture 判定的样例为 quarantined 并附原因；写 map_fix 事件，保留修正前的 mapping）。error 场景不产生部分修改；slow 在提交前延迟。生成物；新建 `tests/unit/jobs/job-state-intake.spec.ts`。
- **完成标准**：
  1. createJob 校验必填（标题非空、类型合法），回执和读回均为 collecting / collect，交付物 draft（AC-001-3 部分前置）。
  2. submit 后状态为 pending_validation，**confirm 之后才是 ingested**；quarantined 样例可复现；map_fix payload 带修正后的 mapping，原记录保留（AC-003-4、AC-003-6 部分前置）。
  3. 空 purpose / 白名单外文件被拒（validation_error），且无副作用；ingest payload 含完整 sourceNote 五字段（AC-003-2、AC-003-3 部分前置）。
  4. error 场景写入被拒且读回不变；slow 场景在 1500ms 前没有提交（AC-008-2 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-intake.spec.ts -t "WI createJob"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-intake.spec.ts -t "WI confirm"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-intake.spec.ts -t "WI intake validation"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-intake.spec.ts -t "WI scenario writes"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A13 写方法：待归属池、归入、删除来源与取消作业

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A12
- **上下文**：plan §4.2（assign 时补作业内的 ingest 事件；removeUpload 只移除当前关联）；矩阵中的 remove_source / cancel_job。
- **修改范围**：`listUnassignedUploads()`、`assignUpload(uploadId, jobId)`、`removeUpload(uploadId, reason)`（kind=delete，action=remove_source；从当前视图移除，历史锚保留）、`cancelJob(jobId, reason)`（cancelled + reason，kind=delete，action=cancel_job）；接口 / 方法表 / real 桩 / 接线；生成物；新建 `tests/unit/jobs/job-state-pool.spec.ts`。
- **完成标准**：
  1. 待归属的投放出现在池中；assign 之后从池中消失、出现在该作业的采集列表，并追加一条作业内 ingest 事件；assign 到未知作业返回 not_found（AC-003-5 部分前置）。
  2. removeUpload 之后当前视图不再显示该投放，但介入历史和原锚仍可查（AC-007-3 部分前置）。
  3. cancelJob 置 cancelled，reason 必填，空 reason 被拒（AC-002-5、AC-007-3 部分前置）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-pool.spec.ts -t "WI assign"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-pool.spec.ts -t "WI removeUpload"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-pool.spec.ts -t "WI cancelJob"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A14 写方法：处理台（参数、无 run 手动合并、对账、暂定）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A11
- **上下文**：plan §4.7“无 activeRunId 的参数修正仍先返回 pendingMerge=true”；矩阵中的 recipe / mark_provisional。
- **修改范围**：`updateParams(jobId, changes)`（产生 overlay recipe 修订和 kind=recipe、outcome=pending 的事件，pendingMerge=true，pendingRunId=null）、`mergePending(jobId, artifactId)`（没有 run 时生成合并修订、把原事件 outcome 改为 merged、清除 pendingMerge；pendingRunId 非空时返回 validation_error“等待本 run 检查点”）、`getReconciliation(jobId, seriesId)`、`markProvisional(jobId, artifactId)`（kind=approve，新修订，状态向下游产物透传为 provisional）；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-process.spec.ts`。
- **完成标准**：
  1. updateParams 之后 pendingMerge=true，事件 kind=recipe、outcome=pending；旧修订保留（AC-004-2 部分前置）。
  2. 无 run 时 mergePending 生成新修订，**原事件只改 outcome**，不新增“人工 merge”事件；pendingRunId 非空时被拒（AC-004-2、AC-007-2 部分前置）。
  3. markProvisional 之后下游产物状态变为 provisional（AC-004-4 部分前置）；对账返回差异行和空差异两种情况（AC-004-3 部分前置）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-process.spec.ts -t "WI updateParams"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-process.spec.ts -t "WI mergePending"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-process.spec.ts -t "WI provisional and reconciliation"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A15 写方法：分析介入与介入历史读取

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A11
- **上下文**：矩阵中的 annotate / ask_why / what_if / deepen / delete_conclusion / veto / pin_rule。
- **修改范围**：`submitIntervention(jobId, input)`（分析动作；delete_conclusion 用 tombstone 产生新 analysis 修订、不删旧内容；pin_rule 只记录 candidate，不激活、不蒸馏）、`listInterventions(jobId, filter?)`（按阶段 / kind 筛选、按时间排序）；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-analysis.spec.ts`。
- **完成标准**：
  1. 五类动作分别产生 framework / ask_why 或 question / rewrite / delete / veto，payload 字段与矩阵一致（AC-005-3 部分前置）。
  2. pin_rule 产生 kind=pin_rule、`payload.state='candidate'`，没有任何“激活”副作用（AC-005-4 部分前置）。
  3. delete_conclusion 之后旧修订仍可读，新修订带 tombstone（AC-005-3 部分前置；S-12）。
  4. 筛选结果正确；十个字段齐全（AC-007-1 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI analysis kinds"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI pin_rule"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI tombstone"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI listInterventions"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A16 写方法：块编辑、批注、版本读取（历史不可变）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A11
- **上下文**：plan §4.5；矩阵中的 edit_block / block_comment / reply_comment / resolve_comment。
- **修改范围**：`saveBlockText(jobId, blockId, text)`（只允许 conclusion / note，其他块返回 validation_error；没有 run 时直接合并成作者为 human 的新修订，块来源改为 human；有 run 时的 overlay 由 T-A18 接入）、`createBlockComment` / `replyBlockComment` / `resolveBlockComment`（kind=framework，产生新修订，块正文的来源不变）、`listRevisions(jobId)`、`getRevision(jobId, revisionId)`（深拷贝，读取历史不改变当前版本）；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-deliverable.spec.ts`。
- **完成标准**：
  1. 编辑结论或备注后出现新修订，作者为 human，块来源为 human；编辑图表 / 表格 / 引用 / 待验证块被拒且无副作用（AC-006-2 部分前置）。
  2. 批注的新建、回复、解决都产生 framework 事件，线程状态 open → resolved，正文来源不变（AC-006-3 部分前置）。
  3. 修改 `getRevision` / `listRevisions` 的返回对象后再次读取，内容不变；读取历史不改变当前修订号（AC-006-4 部分前置；S-12 不可变）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-deliverable.spec.ts -t "WI saveBlockText"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-deliverable.spec.ts -t "WI comments"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-deliverable.spec.ts -t "WI immutable history"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A17 写方法：定稿（原子、未决项拒绝）与领域只读门

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A12、T-A13、T-A14、T-A15、T-A16
- **上下文**：plan §4.6；D-018 §1（显式、不可撤销、v1 只做①）。
- **修改范围**：`finalizeDeliverable(jobId)`（先检查当前的 conflict / pendingMerge / 未接受的 agent 候选；有未决项则返回 validation_error 并列出目标块；成功时在**同一次 commit** 内完成：从 latestMergedRev 深拷贝出 FinalSnapshot → deliverableStatus 从 draft 变为 final 并写入三锚 → job.status=delivered → 写入唯一一条 finalize 事件）；`job-state.ts` 的领域写入口统一检查 delivered / cancelled → validation_error（覆盖目前已有的全部领域写方法；后续 T-A18～T-A20 新增的方法也须接入并各自测试）；读 / 历史 / diff / markInboxRead 不受影响；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-finalize.spec.ts`。
- **完成标准**：
  1. 有未决项时被拒，且快照、deliverableStatus=draft、job.status 三者均不变；未决项处理后定稿成功（AC-006-7 部分前置）。
  2. 成功后三锚与快照一致、job=delivered、finalize 事件恰好一条；原子性测试走 T-A10 的**真实 `commit(mutator)`**：以测试 mutator 先改 working copy（如写入快照、deliverableStatus=final、job.status=delivered）再抛错，或让 mutator 写入不合 schema 的值触发真实边界校验失败；随后经真实读 API（`getJob` / `getStageWorkspace` / `listInterventions`）验证上述状态全部保持原样。不在测试中复制 commit 算法，不加生产故障开关或额外注入框架（AC-006-7 部分前置；S-18；S-24）。
  3. delivered / cancelled 作业的每个领域写方法（投放归属（含 submitIntake 带该作业 jobId 与 assignUpload）、删除来源、编辑、批注三种、介入、参数、暂定、合并、取消、重复定稿）都被拒，读取正常；**不存在任何反向（撤销）方法**（AC-006-7、AC-002-5 部分前置）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-finalize.spec.ts -t "WI pending reject"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-finalize.spec.ts -t "WI atomic"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-finalize.spec.ts -t "WI read-only"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A18 Agent 关联：jobContext、activeRunId 与旁路合并（S-15）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A14、T-A16、T-A17
- **上下文**：plan §2.4（mock DataClient 与 AgentClient 共享 job-state，状态层先处理、再通知）；§4.7 旁路与检查点；§2 S-15 规则。
- **修改范围**：`types.ts` 的 `SendMessageSchema.jobContext?`；`frontend/src/agent/events.ts` 的公共可选字段 `jobContext`（不改十类事件和唯一终态）；`mock/index.ts` 的 `createMockAgentClient` 接入 job-state（登记 runId、给事件附上登记的上下文、状态层先处理再通知）；`job-state.ts`：activeRunId 规则（§2 S-15 / S-23：终态后置 null，仍在运行的第二个带上下文 run 不接任；该口径一句写进 `SendMessageSchema.jobContext` 的 describe，不加调度 / 接任逻辑）；有 run 时 saveBlockText / updateParams 产生 overlay 修订和 pending 事件，agent 只读 latestMergedRev；只有 pendingRunId 匹配的 run.completed 才合并（原事件 outcome=merged）；failed / aborted 保留 overlay 和 pending；cancelled / delivered 作业的晚到事件只进时间线。生成物；新建 `tests/unit/jobs/job-state-agent.spec.ts`（aborted 用 AgentRunSchema 合法的合成事件序列，从系统边界注入状态层，**不新增 abort 脚本**）。
- **完成标准**（正负向齐全）：
  1. 带 jobContext 的 send 之后作业有 activeRunId，同期编辑进入 overlay（pendingMerge=true）；同一 run 的 run.completed 合并 overlay，原事件 outcome=merged（AC-007-2 部分前置；S-15）。
  2. failed（`agentScript=failure`）和合成的 aborted 都**不合并、不清 overlay**；**其他作业或其他 run** 的终态不代为合并（AC-007-2 部分前置）。
  3. 没有 jobContext 的 send 不改变任何作业；已有 activeRunId 时第二个带上下文的 send 不替换 activeRunId；首个 run 终态后 activeRunId 为 null，仍在运行的第二个 run 不接任，其终态不合并 overlay（AC-005-5、AC-007-2 部分前置；S-15 / S-23）。
  4. 同一 run 的全部事件都带发送时的 jobContext，中途“切页”（更改 sessionStore）不会改变它；每个事件只投递给订阅者一次；不带 jobContext 的旧事件 fixture 仍可解析（AC-005-5 部分前置；S-15）。
  5. 取消作业之后，已有 run 不被 abort，其后续事件不改变产物（AC-002-5 部分前置）。
  6. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI overlay same run"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI failed aborted other run"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI no context"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI context stable"`
  5. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI cancelled late events"`
  6. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A19 改稿请求、候选接受 / 回退与冲突裁定

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A18
- **上下文**：plan §4.5；矩阵中的 revise_blocks / accept / revert / resolve_conflict。
- **修改范围**：`requestRevision(jobId, blockIds, instruction)`（记录 baseRev / blockIds / 指令，写 rewrite 事件，再调用 `send({jobContext})`；成功终态时先处理人的 overlay，再以最新已合并快照为底，从该 run 的权威 step.text 只对指定块生成作者为 agent 的候选修订；同一块在 baseRev 之后被人改过 → 保留两版并标 conflict）、`resolveRevision(jobId, revisionId, action)`（accept：涉及的块确认为新修订；revert：只把涉及的块恢复到 baseRev，其他块的后续人工改动保留，候选和原版本都不删除；冲突候选不能直接 accept）、`submitIntervention(action='resolve_conflict')`（选人版或 agent 版，产生新的 confirmed 修订，正文来源沿用选中版）；新方法接入领域只读门；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-revision.spec.ts`。
- **完成标准**（正负向齐全）：
  1. 成功的 run 产生候选，只改指定块、这些块来源为 agent；failed 的 run 不产生候选（AC-006-6 部分前置）。
  2. accept 后形成新修订；revert 只恢复目标块，**非目标块的人工改动保留**（AC-006-6 部分前置）。
  3. 同一块冲突时保留两版、不覆盖人版；直接 accept 冲突候选被拒；resolve_conflict 两种选择都产生 confirmed 修订（AC-006-6 部分前置）。
  4. delivered / cancelled 作业调用这两个方法被拒（AC-006-7 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-revision.spec.ts -t "WI candidate"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-revision.spec.ts -t "WI accept revert"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-revision.spec.ts -t "WI conflict"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-revision.spec.ts -t "WI revision read-only"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A20 阶段重跑状态迁移与排队（S-14）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A18
- **上下文**：plan §4“rerunStage 状态迁移”表与串行排队规则。
- **修改范围**：`rerunStage(jobId, stage)`（无 activeRunId 时：上游不变，s 置 running、下游置 not_started，currentStage / status 按映射，s 与下游各生成以旧已合并版为底的 draft 修订，写一条 rerun 事件，再调用 `send({jobContext})`；成功终态：s 与下游 done，status=delivering、currentStage=deliver，**不自动 delivered**；failed：job=failed + reason，当前运行阶段置 conflict（S-14）；aborted：保留阶段快照并说明；已有 activeRunId 时：请求先 pending，等当前 run 终态后按提交顺序串行启动，失败或中止时把人的 overlay 的 pendingRunId 转交给后继 run，原 baseRev 和介入 id 不变）；接入领域只读门；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-rerun.spec.ts`。
- **完成标准**（正负向齐全）：
  1. 无 run 的迁移逐列（阶段状态 / job.status / 修订）与 plan 表相符，旧修订全部保留，rerun 事件恰好一条（AC-002-4 部分前置）。
  2. 成功终态不会把作业置 delivered；failed 时阶段为 conflict 且 reason 非空；aborted 时阶段快照保留（AC-002-4、AC-002-5 部分前置；S-14）。
  3. 运行中的请求排队、不 abort 当前 run；两个请求按顺序串行执行；overlay 的 pendingRunId 转交给后继 run，并在其检查点合并（AC-002-4、AC-007-2 部分前置）。
  4. delivered / cancelled 作业的 rerunStage 被拒（AC-006-7 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-rerun.spec.ts -t "WI rerun idle"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-rerun.spec.ts -t "WI rerun terminal"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-rerun.spec.ts -t "WI rerun queue"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-rerun.spec.ts -t "WI rerun read-only"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A21 收件箱：生成、已读与已解决

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A19、T-A20
- **上下文**：plan §2.3 的待处理项规则。
- **修改范围**：`job-state.ts`：在已有的状态迁移处生成 InboxItem（阶段首次 needs_human、产物首次 conflict、overlay 首次待合并、agent 候选待处理；同一目标、同一原因不重复，修订号变化时可以新生成）；在离开 H、冲突裁定、overlay 合并、候选 accept / revert 时标记 resolved；`JobListItem.pendingCount` / 阶段 `pendingCount` 只计未读且未解决的条目；`listInbox(jobId?)`、`markInboxRead(ids)`（normal 下已读 id 写入 `fai.inbox.v1`）；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-inbox.spec.ts`。
- **完成标准**（正负向齐全）：
  1. 四类触发各生成一条，重复触发不重复生成（AC-007-4 部分前置）。
  2. markInboxRead 只把传入的 id 标为已读，条目和介入历史保留；之后新来的条目仍为未读；已读 ≠ 已解决（AC-007-4 部分前置）。
  3. 四类收口都标记 resolved，计数归零；完成态不保留角标计数（AC-007-4 部分前置）。
  4. 非 normal 场景已读状态只在内存中（AC-008-2 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox generate"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox read"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox resolve"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox non-normal"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A22 作业路由、页面骨架与视图 store

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：T-A10
- **上下文**：plan §2.1（`jobs/routes.ts` + `main.ts` 中 addRoute，不改 `app/router.ts`）、§2.3 的四个 store。
- **修改范围**：新建 `frontend/src/jobs/routes.ts`（name 为 `jobs` / `job-detail`，meta 为 title / en / navId:'jobs'）、`frontend/src/main.ts`（挂载前 addRoute，不改其他装配）、`frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 骨架、`frontend/src/jobs/stores/{jobs,intake,inbox,session}.ts`（只做视图缓存，写操作后以回执或重新读取刷新，不轮询，不直接落盘）；新建 `tests/unit/jobs/routes.spec.ts`。
- **完成标准**：
  1. `/jobs` 和 `/jobs/:id/:stage?` 可以解析（AC-001-1 部分前置：列表路由可直达）；具名 `jobs` 记录替换壳方的同名占位，没有重复路由；`app/router.ts` 无改动（AC-002-2 部分前置）。
  2. store 不直接调用 localStorage，也不在内部推导业务状态（AC-008-3 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/routes.spec.ts -t "WI routes"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/routes.spec.ts -t "WI stores"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A23 徽标组件（S-11 / S-17）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A01
- **上下文**：plan §2.2 徽标体系；designUI §2.4（状态徽不能只靠颜色）。
- **修改范围**：新建 `frontend/src/jobs/components/{JobStatusBadge,ArtifactStatusBadge,SourceBadge}.vue`（复用既有的 `shared/components/Badge.vue` 和令牌；文案 / 图标只来自契约常量；SourceBadge 按 S-17 处理 derived；上传状态用 ArtifactStatusBadge 的同一渲染方式消费 `UploadStatusLabel`，不新建组件）；新建 `tests/component/jobs/badges.spec.ts`。
- **完成标准**：
  1. 九种作业状态、四种产物状态、三种上传状态逐一渲染出契约文案和图标；把颜色样式去掉后文案仍可区分（AC-001-5 **最终（组件部分）**，人工部分见 T-G10 M-01；AC-001-1、AC-003-6、AC-006-8 部分前置）。
  2. origin=derived 时显示“内部生成”，并保留 source 次文案；origin=source 时显示 SourceLabel（AC-005-1、AC-006-8 部分前置；S-17）。
  3. 没有新增颜色字面量或玻璃类（AC-007-5 部分前置）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/badges.spec.ts -t "WI status badges"`
  2. `pnpm -C frontend test:unit tests/component/jobs/badges.spec.ts -t "WI source badge"`
  3. `pnpm -C frontend check --only colors && pnpm -C frontend check --only glass && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A24 行级 diff 工具

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：无
- **上下文**：plan §2.2 / §6：自实现 LCS 行级 diff，上限 2000 行，超出时只给变更摘要；不引入第三方库。
- **修改范围**：新建 `frontend/src/jobs/diff.ts`；新建 `tests/unit/jobs/diff.spec.ts`（期望结果用手写样例，不在测试里重写算法）。
- **完成标准**：
  1. 新增 / 删除 / 未变的行与手写期望一致；空文本和相同文本都覆盖（AC-006-5 部分前置）。
  2. 超过 2000 行时退化为摘要，不计算完整 LCS（AC-006-5 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/diff.spec.ts -t "WI lcs"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/diff.spec.ts -t "WI limit"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### B 作业对象

### T-B01 作业列表渲染与三态

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A10、T-A22、T-A23
- **上下文**：spec R-001；plan §2.2。
- **修改范围**：`jobs/pages/JobListPage.vue`、新建 `jobs/components/JobCard.vue`（标题、类型、状态徽、当前阶段、更新时间；角标位预留给 T-G02）；三态复用 `Loading` / `EmptyState` / `ErrorState`（错误态含可复制诊断）；新建 `tests/component/jobs/job-list.spec.ts`。
- **完成标准**：
  1. 渲染 mock 作业的标题、类型、状态徽、当前阶段、更新时间，并按 updatedAt 倒序（AC-001-1 **最终**）。
  2. 列表的加载 / 空（empty 场景）/ 错误（error 场景，含可复制诊断）三态可以触发（AC-001-4 部分：列表侧）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-1"`
  2. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-4 list"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B02 筛选、搜索与清空

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：T-B01
- **上下文**：spec R-001（状态 / 类型筛选、标题搜索）。
- **修改范围**：`JobListPage.vue` 的筛选条（选项文案来自 `JobStatusLabel` / `JobTypeLabel`）、`stores/jobs.ts` 的筛选参数（调用 listJobs，不在前端重新筛选）；扩充 `job-list.spec.ts`。
- **完成标准**：
  1. 状态、类型、标题子串三者组合生效；清空后恢复全量（AC-001-2 **最终**）。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-2"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B03 新建作业面板与跳转

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-B01、T-A12
- **上下文**：spec R-001“新建作业”；非模态的内联面板。
- **修改范围**：新建 `jobs/pages/JobCreatePanel.vue`（标题必填、类型必选、品种 / 主题可选、目标说明多行；表单提示复用契约 schema）；新建 `tests/component/jobs/job-create.spec.ts`、`e2e/jobs/list-create.spec.ts`（normal 场景：读取 mock 契约的持久记录 `localStorage["fai.jobs.v1"]` 中新作业的参数，并核对详情页回显；不新增窗口钩子或测试专用记录器）。
- **完成标准**：
  1. 标题为空或未选类型时给出提示且不提交（AC-001-3 部分前置）。
  2. 端到端：创建后进入 `/jobs/:id/collect`，阶段=提取、状态=collecting，createJob 参数被记录（AC-001-3 **最终**）。
  3. 面板没有遮罩和焦点锁（AC-007-3 部分前置）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-create.spec.ts -t "WI AC-001-3 validation"`
  2. `pnpm -C frontend test:e2e e2e/jobs/list-create.spec.ts -g "WI AC-001-3"`
  3. `pnpm -C frontend test:unit tests/component/jobs/job-create.spec.ts -t "WI non-modal" && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B04 作业详情、阶段轨道与 URL 阶段参数

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-B01
- **上下文**：spec R-002；plan §2.1（`router.replace`，未知 stage 回落到当前阶段）、§4.3（阶段状态只读契约，不推导）。
- **修改范围**：`jobs/pages/JobDetailPage.vue`、新建 `jobs/components/{StageRail,StageWorkspace}.vue`（各阶段工作区占位，由 C–F 填充）；详情三态（S-13：empty + 预置 id 时显示“暂无作业”）；新建 `tests/component/jobs/job-detail.spec.ts`、`e2e/jobs/detail-stage.spec.ts`。
- **完成标准**：
  1. 轨道按 提取 → 处理 → 分析 → 交付 的固定顺序渲染，五种阶段态取自契约文案，当前阶段高亮（AC-002-1 **最终**）。
  2. 端到端：点击阶段时 URL 更新；直接打开带阶段的地址并刷新后仍停在该阶段；`/jobs/:id` 缺省 stage 时取作业 currentStage；未知 stage 回落到当前阶段（AC-002-2 **最终**）。
  3. 详情的加载 / 空 / 错误三态可以触发，错误态含可复制诊断；与 T-B01 的列表三态一起构成完整 AC（AC-001-4 **最终**，两个组件测试文件一起运行）。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-1"`
  2. `pnpm -C frontend test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-2"`
  3. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts tests/component/jobs/job-detail.spec.ts -t "WI AC-001-4"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B05 待人工确认横幅、失败 / 取消展示与取消作业确认

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-B04、T-A13、T-A17、T-A20
- **上下文**：plan §4.3（横幅目标取固定顺序中的第一个 H；冲突样例取第一个 C）；spec R-002 作业级状态展示；S-14。
- **修改范围**：`JobDetailPage.vue` 的横幅与作业级状态区（failed / cancelled 显示原因；“重试”入口只是占位，说明归属后续 feature；取消作业要经二次确认面板，默认理由可修改）；扩充 `job-detail.spec.ts` 和 `e2e/jobs/detail-stage.spec.ts`。
- **完成标准**：
  1. 端到端（`?scenario=job-running` 的 j-human）：显示横幅和处理入口，点击后跳到 process；其他阶段仍可查看（AC-002-3 **最终**）。
  2. j-failed / j-cancelled 显示原因和占位动作说明，不出现空白；j-failed 的 conflict 阶段与 reason 同时可见（AC-002-5 **最终**；S-14）。
  3. 取消作业：确认前不调用 cancelJob，取消确认后也不调用（AC-007-3 部分前置）。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-3"`
  2. `pnpm -C frontend test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-5"`
  3. `pnpm -C frontend test:unit tests/component/jobs/job-detail.spec.ts -t "WI cancel confirm"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B06 介入历史侧栏与筛选

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-B04、T-A15
- **上下文**：spec R-007 介入历史；plan §2.2。
- **修改范围**：新建 `jobs/components/InterventionHistory.vue`（详情右侧常驻；按时间排列；按阶段 / kind 筛选，调用 listInterventions）；新建 `tests/component/jobs/intervention-history.spec.ts`。
- **完成标准**：
  1. 渲染 mock 事件，十个字段（id / jobId / stage / artifactId / baseRev / kind / payload 摘要 / reason / outcome / createdAt）可见或可展开；按阶段和 kind 筛选生效（AC-007-1 **最终**；AC-002-4 部分前置：重跑事件在介入历史可见）。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/intervention-history.spec.ts -t "WI AC-007-1"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B07 重跑确认与迁移展示

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-B06、T-A20
- **上下文**：spec R-002“重跑本阶段及下游”；plan rerunStage 迁移表。
- **修改范围**：`StageRail.vue` / `JobDetailPage.vue` 的重跑入口和二次确认面板（列出受影响阶段）；新建 `e2e/jobs/rerun.spec.ts`（用 Playwright 内置 `page.clock` 在页面加载前安装假时钟，确认后先断言迁移，再推进到 run 终态断言 done / delivering，不新增工具）。
- **完成标准**：
  1. 端到端（假时钟冻结）：先取消确认 → 无 rerun 事件；再确认 → 阶段 s 为运行中、下游为未开始；介入历史出现 kind=rerun；旧版本可查；推进到终态后 s 与下游为已完成、作业未自动交付（AC-002-4 **最终**）。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/rerun.spec.ts -g "WI AC-002-4"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### C 采集台

### T-C01 投放面板：三种输入、白名单、来源说明、页面级抽屉挂载

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A22、T-A12
- **上下文**：spec R-003；plan §2.2 / §3（文件只取元数据；粘贴正文只在草稿中）；§3 关于 IntakeDrawer 挂载的约定。
- **修改范围**：新建 `jobs/stages/IntakePanel.vue`（文件拖入 / 选择、URL、文本，三选一必填；来源说明表单；提示“本地样例记录；原文不保存，刷新后需重新投放原文”）、`jobs/stages/IntakeDrawer.vue`（非模态，包裹 IntakePanel，可带 jobId）；`stores/intake.ts`（抽屉开关与当前草稿；**不含实例登记**）；`JobListPage` / `JobDetailPage` 各自挂载 IntakeDrawer（互斥路由视图，§3），投放入口在列表页和详情页的采集阶段；新建 `tests/component/jobs/intake.spec.ts`。
- **完成标准**（正负向）：
  1. 三种投放都能提交；白名单外的文件给出可操作提示（列出允许的扩展名），且不提交（AC-003-2 **最终**；AC-003-1 部分前置：同一投放流程组件）。
  2. 用途为空时有必填提示、不提交；可靠性 / 时效 / 口径随表单提交（AC-003-3 部分前置）。
  3. 不调用任何文件正文读取 API（File 只取 name / size / type / lastModified）（spec §4 持久化 / 隐私约束，无独立 AC；随 AC-009-1 全量回归）。
  4. 抽屉没有遮罩和焦点锁（AC-007-3 部分前置）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI AC-003-2"`
  2. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI purpose required"`
  3. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI metadata only"`
  4. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI non-modal" && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-C02 抽取预览、映射修正与抽取状态徽

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-C01、T-A23
- **上下文**：spec R-003“修正后确认才入库”；plan §2.4 FieldMapping。
- **修改范围**：新建 `jobs/stages/{ExtractionPreview,MappingEditor}.vue`；采集列表用 `UploadStatusLabel` 显示三种状态；新建 `tests/component/jobs/extraction-preview.spec.ts`。
- **完成标准**：
  1. 预览展示识别类型、字段 / 列映射、单位、时间范围；修改映射和单位之后，只有点击确认才调用 confirmIntake，之前状态保持为待验证（AC-003-4 **最终**）。
  2. 待验证 / 已入库 / 隔离三种状态有文案和图标，隔离显示原因；去掉颜色后仍可区分（AC-003-6 **最终**）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-4"`
  2. `pnpm -C frontend test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-6"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-C03 待归属池、归入作业与删除来源确认

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-C02、T-A13
- **上下文**：spec R-003 待归属池；plan §4.2 removeUpload 需要二次确认。
- **修改范围**：新建 `jobs/stages/UnassignedPool.vue`（列表、选择作业后归入）；采集列表中的删除来源入口和二次确认面板；新建 `tests/component/jobs/unassigned-pool.spec.ts`。
- **完成标准**：
  1. 池中列出未归属的投放，归入后从池中消失（AC-003-5 部分前置）。
  2. 删除来源：先取消确认 → 不调用 removeUpload；再确认 → 调用并带理由（AC-007-3 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/unassigned-pool.spec.ts -t "WI pool assign"`
  2. `pnpm -C frontend test:unit tests/component/jobs/unassigned-pool.spec.ts -t "WI remove confirm"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-C04 采集端到端：页面入口、payload、待归属

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-C03、T-B04
- **上下文**：AC-003-1 的工作台入口和顶栏全局入口属于 v2（T-H01）；本任务只覆盖本 feature 的页面入口。
- **修改范围**：新建 `e2e/jobs/intake.spec.ts`。
- **完成标准**：
  1. 端到端：作业列表和作业详情（采集阶段）的投放入口打开同一个 IntakePanel 流程，提交都走 submitIntake（AC-003-1 **本地子项**；工作台 / 顶栏子项 `blocked_by: frontend-workbench-v2`，由 T-H01 最终验收）。
  2. 端到端：用途为空被拦下；正常提交后断言契约 payload 的 `sourceNote.purpose / reliability / publishedAt / validUntil / scopeNote`（取证途径：normal 场景 `fai.jobs.v1` 中 ingest 介入与 Upload 记录，并核对介入历史展开内容；不新增窗口钩子）（AC-003-3 **最终**）。
  3. 端到端：在列表页无作业投放 → 进入待归属池 → 归入某作业 → 出现在该作业的采集列表（AC-003-5 **最终**）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-1 local"`
  2. `pnpm -C frontend test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-3"`
  3. `pnpm -C frontend test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-5"`

### D 处理台

### T-D01 处理台渲染、来源回溯与三态

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-B04、T-A14
- **上下文**：spec R-004；配方只读（单链）。
- **修改范围**：新建 `jobs/stages/{ProcessWorkspace,RecipeSteps}.vue`（数据源 / 序列 / 配方步骤；派生值点击后打开来源回溯（观测或表行））；新建 `tests/component/jobs/process.spec.ts`。
- **完成标准**：
  1. 渲染数据源、序列和配方步骤；派生值能打开 lineage（AC-004-1 **最终**）。
  2. 无数据（empty）、配方为空、错误（error）三态都可以显示（AC-004-5 **最终**）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/process.spec.ts -t "WI AC-004-1"`
  2. `pnpm -C frontend test:unit tests/component/jobs/process.spec.ts -t "WI AC-004-5"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-D02 参数修正、待合并与“应用到检查点”

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-D01
- **上下文**：plan §4.7（没有 run 时显示非模态的“应用到检查点”；运行中该按钮不可执行）。
- **修改范围**：新建 `jobs/stages/ParamEditor.vue`、`jobs/components/PendingMergeChip.vue`（文案“待合并 / 已合并”，带图标）；新建 `tests/component/jobs/param-editor.spec.ts`、`e2e/jobs/process.spec.ts`。
- **完成标准**（正负向）：
  1. 端到端（j-process，无 run）：提交参数修正后介入历史出现 kind=recipe，产物显示“待合并”；点击“应用到检查点”后变为“已合并”，原事件 outcome=merged（AC-004-2 **最终**）。
  2. 组件：pendingRunId 非空时按钮不可执行，并说明“等待本次运行检查点”（AC-004-2、AC-007-2 部分前置）。
  3. 编辑面板没有模态（AC-007-3 部分前置）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/process.spec.ts -g "WI AC-004-2"`
  2. `pnpm -C frontend test:unit tests/component/jobs/param-editor.spec.ts -t "WI running disabled"`
  3. `pnpm -C frontend test:unit tests/component/jobs/param-editor.spec.ts -t "WI non-modal" && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-D03 对账 diff 与暂定透传

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-D01
- **上下文**：spec R-004 对账 diff、“标记暂定”。
- **修改范围**：新建 `jobs/stages/ReconciliationDiff.vue`（表格；差异行用既有令牌加文字 / 图标高亮，不新增色值；空差异时给出说明）；处理台的“标记暂定”入口（调用 markProvisional）；新建 `tests/component/jobs/reconciliation.spec.ts`。
- **完成标准**：
  1. 展示两个来源的差异，差异行高亮（不只靠颜色）；空差异时有说明（AC-004-3 **最终**）。
  2. 标记暂定后，下游（分析 / 交付）产物的状态徽显示“暂定”（AC-004-4 **最终**）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/reconciliation.spec.ts -t "WI AC-004-3"`
  2. `pnpm -C frontend test:unit tests/component/jobs/reconciliation.spec.ts -t "WI AC-004-4"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### E 分析台

### T-E01 分析台：结论卡、证据链与四态

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-B04、T-A15、T-A23
- **上下文**：spec R-005；S-17。
- **修改范围**：新建 `jobs/stages/{AnalyzeWorkspace,ConclusionCard,EvidenceChain}.vue`；新建 `tests/component/jobs/analyze.spec.ts`。
- **完成标准**：
  1. 结论卡显示文本、证据链数量（= evidence 长度）、状态徽和来源徽；派生结论显示“内部生成”（AC-005-1 **最终**；S-17）。
  2. 打开证据链后可见 断言 / 序列 / 来源 三种锚，点击触发跳转到来源锚（路由或定位）（AC-005-2 **最终**）。
  3. 加载 / 空 / 错误 / 冲突（j-conflict）四态可以显示（AC-005-6 **最终**）。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-1"`
  2. `pnpm -C frontend test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-2"`
  3. `pnpm -C frontend test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-6"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-E02 分析介入动作

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-E01
- **上下文**：矩阵中的五类分析动作；删除结论属破坏性动作，要二次确认。
- **修改范围**：新建 `jobs/stages/InterventionComposer.vue`（批注、追问“依据？/如果…”、深挖、删除（确认）、否决；内联、无模态）；新建 `tests/component/jobs/intervention-composer.spec.ts`、`e2e/jobs/analyze.spec.ts`。
- **完成标准**：
  1. 端到端：批注 / 追问（两种）/ 深挖 / 删除 / 否决分别生成对应 kind 的事件，断言 kind 和 payload（AC-005-3 **最终**）。
  2. 删除结论：取消确认 → 不调用；其他动作不出现确认（AC-007-3 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/analyze.spec.ts -g "WI AC-005-3"`
  2. `pnpm -C frontend test:unit tests/component/jobs/intervention-composer.spec.ts -t "WI delete confirm"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-E03 “教它一条规则”与作业上下文追问回放

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-E02、T-A18
- **上下文**：spec R-005；S-15。抽屉上下文标签归 v2（T-H02）。
- **修改范围**：新建 `jobs/stages/RuleCandidatePanel.vue`（非模态；提交 pin_rule）；`InterventionComposer` 的追问在 submitIntervention 之后调用 `agentClient.send({message, jobContext})`（只从 `contracts/index.ts` 导入）；`stores/session.ts` 提供当前上下文；新建 `tests/component/jobs/rule-candidate.spec.ts`，扩充 `e2e/jobs/analyze.spec.ts`。
- **完成标准**：
  1. 教规则只生成一条 pin_rule 事件，payload.state=candidate，并标注“候选”（AC-005-4 **最终**）。
  2. 端到端：在分析台追问后，v1 抽屉时间线回放了这次 run（可见 prompt 与完成终态），介入历史只多一条事件；事件携带同一个 `{jobId, stage}` 由 T-A18 单测断言，不在 e2e 订阅（AC-005-5 **本地子项**；抽屉中的作业 / 阶段**上下文标签** `blocked_by: frontend-workbench-v2`，由 T-H02 最终验收；S-15）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/rule-candidate.spec.ts -t "WI AC-005-4"`
  2. `pnpm -C frontend test:e2e e2e/jobs/analyze.spec.ts -g "WI AC-005-5 local"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### F 交付台

### T-F01 交付台六类块、图表样例、块徽与头部定稿状态

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-B04、T-A16、T-A23
- **上下文**：spec R-006；plan §2.4 ChartSpec（只编译 line-sample，使用地基主题 `fai-dark`）、§4.6（头部按 `DeliverableStatusLabel` 显示，不新增组件）。
- **修改范围**：新建 `jobs/stages/{DeliverWorkspace,DeliverableBlock,BlockChart,BlockTable}.vue`；新建 `tests/component/jobs/deliver-blocks.spec.ts`。
- **完成标准**：
  1. 六类块按契约顺序渲染；图表块由契约的 chart-spec 编译，使用 `fai-dark` 主题（断言主题名和序列绑定）（AC-006-1 **自动部分最终**；暗色视觉由 M-05 人工验收，见 T-G10）。
  2. 每个块都有来源徽和状态徽，派生块显示“内部生成”（AC-006-8 **最终**；S-17）。
  3. 头部：draft 显示“草稿”，final 显示“已定稿 vN · 时间”，N 和时间取自交付物元数据，不读 job.status（AC-006-7 部分前置）。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/deliver-blocks.spec.ts -t "WI AC-006-1"`
  2. `pnpm -C frontend test:unit tests/component/jobs/deliver-blocks.spec.ts -t "WI AC-006-8"`
  3. `pnpm -C frontend test:unit tests/component/jobs/deliver-blocks.spec.ts -t "WI header status"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-F02 结论 / 备注 inline 编辑

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-F01
- **上下文**：spec R-006 编辑边界（§3）。
- **修改范围**：新建 `jobs/stages/BlockTextEditor.vue`（只挂在 conclusion / note 上；保存时调用 saveBlockText）；新建 `tests/component/jobs/block-editor.spec.ts`。
- **完成标准**：
  1. 编辑结论或备注后生成新修订，来源徽变为“人”；图表 / 表格 / 引用（以及待验证）块没有编辑入口（AC-006-2 **最终**）。
  2. 编辑不弹模态（AC-007-3 部分前置）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/block-editor.spec.ts -t "WI AC-006-2"`
  2. `pnpm -C frontend test:unit tests/component/jobs/block-editor.spec.ts -t "WI non-modal" && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-F03 块批注线程

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-F01
- **上下文**：spec R-006 块批注（线程，未解决 / 已解决）。
- **修改范围**：新建 `jobs/stages/BlockCommentThread.vue`；新建 `e2e/jobs/deliver-comments.spec.ts`。
- **完成标准**：
  1. 端到端：新建批注 → 回复 → 标记已解决，线程状态由“未解决”变为“已解决”，介入历史出现三条 framework 事件（AC-006-3 **最终**）。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/deliver-comments.spec.ts -g "WI AC-006-3"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-F04 版本历史与历史版本只读查看

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-F01
- **上下文**：spec R-006 版本历史。
- **修改范围**：新建 `jobs/stages/RevisionHistory.vue`（版本号 / 作者 / 时间 / 摘要；打开历史版本为只读视图）；新建 `e2e/jobs/deliver-history.spec.ts`。
- **完成标准**：
  1. 端到端：列表显示四个字段；打开历史版本时没有编辑入口，当前版本号不变（AC-006-4 **最终**）。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/deliver-history.spec.ts -g "WI AC-006-4"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-F05 两版本 diff 视图

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-F04、T-A24
- **上下文**：spec R-006 diff；按块展示。
- **修改范围**：新建 `jobs/stages/DiffView.vue`（选两个版本；按块展示文本差异和 changeSummary；超过上限显示摘要）；新建 `tests/component/jobs/diff-view.spec.ts`。
- **完成标准**：
  1. 按块显示新增 / 删除 / 未变的文本与变更摘要，未变的块可以识别（AC-006-5 **最终**）。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/diff-view.spec.ts -t "WI AC-006-5"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-F06 改稿指令、候选接受 / 回退与冲突裁定界面

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-F05、T-A19
- **上下文**：plan §4.5；冲突只在定稿时要求收口，不阻塞其他阶段。
- **修改范围**：新建 `jobs/stages/RevisionRequestPanel.vue`（非模态：选块 + 指令 → requestRevision；显示候选的 diff 和 接受 / 回退；冲突芯片旁可选“用人版 / 用 agent 版”）；新建 `tests/component/jobs/revision-request.spec.ts`、`e2e/jobs/deliver-revision.spec.ts`（用 Playwright 内置的 `page.clock` 推进 mock 脚本定时器，不引入新工具）。
- **完成标准**（正负向）：
  1. 端到端：发出改稿指令后出现 rewrite 事件；run 成功后出现作者为 agent 的新版本，涉及块的来源徽为 agent；接受可用；另一次回退之后非目标块的人工改动仍在（AC-006-6 **最终**）。
  2. 组件（j-conflict）：冲突候选没有“接受”按钮，只能裁定人版或 agent 版；裁定后块状态为“已确认”（AC-006-6 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/deliver-revision.spec.ts -g "WI AC-006-6"`
  2. `pnpm -C frontend test:unit tests/component/jobs/revision-request.spec.ts -t "WI conflict resolve"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-F07 定稿面板、未决项拒绝与只读

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-F06、T-A17、T-A20
- **上下文**：spec AC-006-7；plan §4.6；D-018（不自动、不可撤销）。
- **修改范围**：新建 `jobs/stages/FinalizeDialog.vue`（二次确认面板，先列出未决项）；只读视图（定稿后所有编辑 / 批注 / 改稿入口隐藏或禁用，并说明原因）；新建 `tests/component/jobs/finalize.spec.ts`、`e2e/jobs/deliver-finalize.spec.ts`。
- **完成标准**（正负向）：
  1. 端到端（j-deliver）：定稿需要二次确认；确认后生成快照，作业为 delivered，头部显示“已定稿 vN · 时间”，视图只读；页面上没有撤销入口（AC-006-7 **最终**：正向）。
  2. 端到端（j-conflict）：定稿被拒并列出目标块；快照、草稿状态和作业状态都不变（AC-006-7 **最终**：负向）。
  3. 组件：任何页面加载或数据刷新都不会触发 finalizeDeliverable（不自动定稿）（AC-006-7 部分前置）。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/deliver-finalize.spec.ts -g "WI AC-006-7 finalize"`
  2. `pnpm -C frontend test:e2e e2e/jobs/deliver-finalize.spec.ts -g "WI AC-006-7 pending reject"`
  3. `pnpm -C frontend test:unit tests/component/jobs/finalize.spec.ts -t "WI no auto finalize"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### G 不干扰与收口

### T-G01 运行中待合并端到端（job-pending-merge）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-F02、T-F06、T-D02、T-A18、T-A20
- **上下文**：plan §2.4 j-merge 驱动方式和 AC-007-2 的落点；不依赖全局输入栏自动绑定上下文。
- **修改范围**：新建 `e2e/jobs/pending-merge.spec.ts`（`?scenario=job-pending-merge&agentScript=long`；用 `page.clock` 推进）；交付块上接入 PendingMergeChip。
- **完成标准**（正负向）：
  1. 端到端：在作业改稿面板对结论块 requestRevision → 等到 run.started → 编辑另一个备注块，块上出现“待合并” → 推进到同一 run 的 run.completed → 变为“已合并”（AC-007-2 **最终**：正向）。
  2. 端到端：用 `agentScript=failure` 重复上述流程，终态后仍为“待合并”，overlay 不丢（AC-007-2 **最终**：负向；“其他 run 不代合并”由 T-A18 单测覆盖）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/pending-merge.spec.ts -g "WI AC-007-2 merge"`
  2. `pnpm -C frontend test:e2e e2e/jobs/pending-merge.spec.ts -g "WI AC-007-2 failure keeps overlay"`

### T-G02 收件箱与角标（本地子项）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-A21、T-B04
- **上下文**：plan §2.3（角标在列表卡 + 详情阶段轨道；首页作业轨道归 v2）。
- **修改范围**：新建 `jobs/components/InboxDrawer.vue`（非模态；打开前请求、打开后对本次展示的 id 一次性 markInboxRead）；`stores/inbox.ts`；JobCard 和 StageRail 的角标（计数取自契约）；新建 `tests/component/jobs/inbox.spec.ts`、`e2e/jobs/inbox.spec.ts`。
- **完成标准**（正负向）：
  1. 端到端（job-running 的 j-human）：列表卡和阶段轨道出现角标；打开收件箱后角标清除，条目仍可见；之后新产生的条目仍为未读（AC-007-4 **本地子项**；**首页作业轨道角标** `blocked_by: frontend-workbench-v2`，由 T-H03 最终验收）。
  2. 组件：已读但未解决的条目，其冲突 / 待合并状态徽仍然显示（AC-007-4 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/inbox.spec.ts -g "WI AC-007-4 local"`
  2. `pnpm -C frontend test:unit tests/component/jobs/inbox.spec.ts -t "WI read not resolved"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-G03 非模态与破坏性确认审计

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-B03、T-B05、T-B07、T-D02、T-C03、T-E02、T-E03、T-F02、T-F03、T-F06、T-F07
- **上下文**：spec R-007“无模态”；plan AC-007-3 落点。
- **修改范围**：新建 `e2e/jobs/confirm-modal.spec.ts`。
- **完成标准**：
  1. 端到端：编辑 / 批注 / 投放 / 教规则 / 改稿全程不出现模态（无遮罩、无焦点锁、页面其他区域可交互）（AC-007-3 **最终**：正向）。
  2. 端到端：删除来源 / 删除结论 / 定稿 / 取消作业 / 重跑都先出现二次确认；取消确认时，`fai.jobs.v1` 快照与介入历史都没有出现对应事件或状态变化（AC-007-3 **最终**：负向）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/confirm-modal.spec.ts -g "WI AC-007-3 non-modal"`
  2. `pnpm -C frontend test:e2e e2e/jobs/confirm-modal.spec.ts -g "WI AC-007-3 destructive"`

### T-G04 持久化横幅与重置样例

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-A11、T-B01、T-B04、T-C01
- **上下文**：plan §3（共享的非模态横幅；只有显式重置才会清空）；spec §4 持久化。
- **修改范围**：新建 `jobs/components/PersistenceBanner.vue`（订阅 `persistence.ts` 的状态；挂在列表、详情、投放抽屉的顶部）；“重置样例数据”入口和二次确认；新建 `tests/component/jobs/persistence-banner.spec.ts`、`e2e/jobs/persistence.spec.ts`。
- **完成标准**（正负向）：
  1. 端到端：预置损坏的 `fai.jobs.v1` → 显示“原快照无法读取，可重置样例”，执行操作后该 key 的原值不变；确认重置后 key 被重建（spec §4 持久化约束，无独立 AC；随 AC-009-1 全量回归）。
  2. 端到端：保存超过 512 KiB 的备注文本 → 显示“本次修改未持久化，刷新会丢失”，key 中仍是上一次成功的快照（spec §4 持久化约束，无独立 AC；随 AC-009-1 全量回归）。
  3. 端到端：`?scenario=job-conflict` 下预置哨兵值，执行写操作后哨兵不变，页面显示 fixture 数据（AC-008-2 部分前置）。
  4. 组件：横幅为非模态（plan §3 共享非模态横幅；spec §4 持久化约束，无独立 AC）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/persistence.spec.ts -g "WI corrupt keeps key"`
  2. `pnpm -C frontend test:e2e e2e/jobs/persistence.spec.ts -g "WI over limit"`
  3. `pnpm -C frontend test:e2e e2e/jobs/persistence.spec.ts -g "WI non-normal untouched"`
  4. `pnpm -C frontend test:unit tests/component/jobs/persistence-banner.spec.ts && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-G05 场景切换端到端遍历

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-G01、T-G02、T-G04、T-B05、T-E01、T-F07
- **上下文**：AC-008-2 要求场景切换可用，并被端到端测试使用。
- **修改范围**：新建 `e2e/jobs/scenarios.spec.ts`。
- **完成标准**：
  1. 端到端：normal / empty（含 `/jobs/j-collect/collect` 显示“暂无作业”）/ error（含可复制诊断）/ slow（先见加载态）/ boot-error（重试后进入作业页）/ job-running / job-pending-merge / job-conflict / job-delivered 各打开一次，断言该场景的关键界面（AC-008-2 **最终**；单测部分见 T-A09 / T-A10）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/scenarios.spec.ts -g "WI AC-008-2"`

### T-G06 静态守卫与契约文档对拍收口

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1.5 h｜**依赖**：T-G03、T-G04、T-G05、T-B02、T-C04、T-D03
- **上下文**：AC-007-5 / AC-008-1 / AC-008-3 / AC-008-4；S-11 / S-14 / S-16 / S-18 在文档中的落点。
- **修改范围**：新建 `tests/unit/jobs/contract-doc.spec.ts`（逐个 job schema 对拍 schema.json 与 zod，CONTRACT.md 含每个 job 方法的小节、每条 Label 文案、S-14 / S-16 注记、Deliverable 的两个分支、`SourceNote.publishedAt`、2.0.0 变更说明，以及 `jobScenarios` 中 S-19 声明句“CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准”）。
- **完成标准**：
  1. 玻璃层级 ≤3（本 feature 没有新增玻璃类）（AC-007-5 **最终**）。
  2. 契约文档的字段清单与类型定义对拍一致，包含上述项（AC-008-1 **最终**）。
  3. 界面层零直接网络调用，允许名单只有 `src/contracts/real/`（AC-008-3 **最终**）。
  4. CONTRACT.md 版本为 2.0.0 并有变更说明；生成物已重新生成并入库（AC-008-4 **最终**）。
  5. 颜色 / 涨跌 / 栅格守卫继承通过（R-009 无裸颜色字面量继承；AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend check --only glass`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-doc.spec.ts`
  3. `pnpm -C frontend check --only network`
  4. `pnpm -C frontend contract --check && pnpm -C frontend check --only generated && pnpm -C frontend test:unit tests/unit/jobs/contract-version.spec.ts`
  5. `pnpm -C frontend check --only colors && pnpm -C frontend check --only updown && pnpm -C frontend check --only grid`

### T-G07 最小窗口与基准布局不回归（端到端）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：T-G03
- **上下文**：spec §4 环境基准（1440×900，断点 960 / 980 / 1240 / 1400 / 1500）；plan e2e“窄窗口不回归”；为 M-10 人工验收准备。
- **修改范围**：新建 `e2e/jobs/layout.spec.ts`（作业列表 / 详情四个阶段在 960 与 1440×900 下没有水平溢出，阶段轨道和侧栏可见或可达）。
- **完成标准**：
  1. 端到端：两种视口下没有水平滚动条，关键控件可达（AC-009-1 部分前置；为 M-10 准备）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/layout.spec.ts`

### T-G08 人工验收清单 manual-acceptance.md

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：T-G07
- **上下文**：plan §2.5 M-01～M-10；AC-009-2 要求清单存在，每项有“看什么”。本任务**只写清单，不声称已有截图**。
- **修改范围**：新建 `specs/workbench-interaction/manual-acceptance.md`（M-01～M-10，每项写：关联 AC、前置（场景 / 视口 / 路由）、操作步骤、看什么、截图输出路径 `specs/workbench-interaction/assets/manual/M-xx-<slug>.png`（**待 Handoff 生成**）、结果栏（空））；新建 `tests/unit/jobs/manual-acceptance.spec.ts`（结构校验：十项齐全、每项有“看什么”和截图路径）。
- **完成标准**：
  1. 清单存在，十项都有可执行步骤和“看什么”；结果栏为空，不含伪造截图（AC-009-2 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/manual-acceptance.spec.ts -t "WI AC-009-2"`

### T-G09 一条命令全量自动化检查

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：1 h｜**依赖**：T-G06、T-G07、T-G08
- **上下文**：AC-009-1；沿用 frontend-workbench 的 `pnpm test`，不新增命令或工具。
- **修改范围**：不改 `package.json` 的脚本（`test` 已串起全部检查）；把执行输出摘要（检查项 / 单测数 / e2e 数 / exit code）登记到后续 Converge / Handoff 记录（`specs/workbench-interaction/review.md`，Handoff 阶段创建）。
- **完成标准**：
  1. `pnpm -C frontend test` exit 0，覆盖 check（六项）、typecheck、lint、全部单测（含 frontend-workbench 既有用例）和全部 e2e（AC-009-1 **最终**；v2 集成之后由 T-H04 复跑）。
- **验证命令**：
  1. `pnpm -C frontend test`

### T-G10 人工验收执行与截图（Handoff 阶段）

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff
- **预计**：2 h｜**依赖**：T-G09；另需工作流闸门：Converge 报告、Review、Gate 2（AGENTS §2；spec AC-009-2“Handoff 附截图”）
- **上下文**：v2 未交付时能否分阶段 Handoff，由 Walter 在 Gate 2 决定；本文件不预设。
- **修改范围**：按 manual-acceptance.md 执行 M-01～M-10，截图保存到 `specs/workbench-interaction/assets/manual/`，并填写结果栏；在 review.md 引用截图。
- **完成标准**：
  1. 十项都有截图和结论（AC-009-2 **最终**；AC-001-5 / AC-006-1 的人工部分 M-01 / M-05 在此验收）。
- **验证命令**：
  1. 手动：逐项对照清单检查“看什么”；`ls specs/workbench-interaction/assets/manual/` 应列出 M-01～M-10 的截图；复跑 `pnpm -C frontend test:unit tests/unit/jobs/manual-acceptance.spec.ts`。

### H v2 集成验证（只清理本 feature 页面级抽屉挂载 + 集成验证，不改壳方代码）

### T-H01 全局投放入口集成验证

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff、**frontend-workbench-v2**
- **预计**：1 h｜**依赖**：T-C04、T-G09
- **上下文**：v2 在 TopBar 增加“投放”、在 AppShell 挂载本 feature 的 IntakeDrawer；本 feature 只清理自有页面的临时挂载（§3，B-11 (a)）并写集成测试，不改壳方。页面内投放按钮保留，仍经 `intakeStore` 打开同一抽屉；T-C04 本地 e2e 由 T-H04 全量复跑回归。
- **修改范围**：移除 `frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 中的页面级 IntakeDrawer 挂载（本 feature 自有文件）；新建 `e2e/jobs/integration-v2.spec.ts`（投放部分）。不改 `app/**` 和 `workbench/**`。
- **完成标准**：
  1. 端到端：顶栏的投放入口在作业列表、作业详情、工作台都可用，进入同一个 IntakePanel 流程，且同一页面只渲染一个抽屉（AC-003-1 **最终**）。
  2. 工程门通过（AC-009-1 部分前置；v2 后由 T-H04 全量复验）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-003-1"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-H02 抽屉作业上下文标签集成验证

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff、**frontend-workbench-v2**
- **预计**：1 h｜**依赖**：T-E03、T-G09
- **上下文**：v2 在 agent store / 抽屉中消费 jobContext。
- **修改范围**：扩充 `e2e/jobs/integration-v2.spec.ts`（抽屉部分）。
- **完成标准**：
  1. 端到端：在作业内发起追问后，对话抽屉显示作业 id / 标题和阶段的上下文标签；mock 事件流可以回放；切页后同一 run 的标签不漂移（AC-005-5 **最终**）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-005-5"`

### T-H03 首页作业轨道角标集成验证

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff、**frontend-workbench-v2**
- **预计**：1 h｜**依赖**：T-G02、T-G09
- **上下文**：v2 的首页作业轨道消费同一套 listInbox 计数。
- **修改范围**：扩充 `e2e/jobs/integration-v2.spec.ts`（首页轨道部分）。
- **完成标准**：
  1. 端到端：首页作业轨道出现待处理角标，数量与列表卡一致；查看收件箱后清除（AC-007-4 **最终**）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-007-4"`

### T-H04 v2 集成后路由共存与全量回归

- **状态**：未开始｜blocked_by: frontend-workbench-v1-handoff、**frontend-workbench-v2**
- **预计**：1 h｜**依赖**：T-H01、T-H02、T-H03
- **上下文**：plan §2.1（具名 `jobs` 记录替换壳方由导航生成的同名占位，不能出现双路由）。
- **修改范围**：扩充 `e2e/jobs/integration-v2.spec.ts`（导航到 `/jobs` 的路由共存）；复跑全量。
- **完成标准**：
  1. 端到端：从 v2 导航的“作业”进入的是本 feature 的列表页，`/jobs` 只有一条路由记录（AC-002-2 回归）。
  2. 全量检查复跑 exit 0，Converge 可据此解除外部阻塞（AC-009-1 复验）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/integration-v2.spec.ts -g "WI routes coexist"`
  2. `pnpm -C frontend test`

## 5. AC 覆盖矩阵（46 条）

“部分前置”= 为该 AC 提供契约 / 状态层 / 组件前提，不单独构成验收；“最终”= 该 AC 的验收任务与命令。外部阻塞子项未解除前，Converge 必须报“未收敛（外部阻塞）”。

| AC | 部分前置任务 | 最终验收任务 | 最终验证命令 | 外部阻塞子项 |
|---|---|---|---|---|
| AC-001-1 | A02、A07、A22、A23 | T-B01 | `test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-1"` | — |
| AC-001-2 | A07、A10 | T-B02 | `test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-2"` | — |
| AC-001-3 | A12 | T-B03 | `test:e2e e2e/jobs/list-create.spec.ts -g "WI AC-001-3"` | — |
| AC-001-4 | A05、A10、B01 | T-B04 | `test:unit tests/component/jobs/job-list.spec.ts tests/component/jobs/job-detail.spec.ts -t "WI AC-001-4"` | — |
| AC-001-5 | A01 | T-A23（组件）+ T-G10（M-01 人工） | `test:unit tests/component/jobs/badges.spec.ts -t "WI status badges"`；M-01 | — |
| AC-002-1 | A02 | T-B04 | `test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-1"` | — |
| AC-002-2 | A22 | T-B04（v2 后由 T-H04 回归） | `test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-2"` | — |
| AC-002-3 | A07 | T-B05 | `test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-3"` | — |
| AC-002-4 | A20、B06 | T-B07 | `test:e2e e2e/jobs/rerun.spec.ts -g "WI AC-002-4"` | — |
| AC-002-5 | A02、A07、A13、A17、A18、A20 | T-B05 | `test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-5"` | — |
| AC-003-1 | C01、C04（本地子项） | **T-H01** | `test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-003-1"` | 工作台入口 / 顶栏全局投放（v2） |
| AC-003-2 | A03、A12 | T-C01 | `test:unit tests/component/jobs/intake.spec.ts -t "WI AC-003-2"` | — |
| AC-003-3 | A03、A11、A12、C01 | T-C04 | `test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-3"` | — |
| AC-003-4 | A12 | T-C02 | `test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-4"` | — |
| AC-003-5 | A13、C03 | T-C04 | `test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-5"` | — |
| AC-003-6 | A01、A12、A23 | T-C02 | `test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-6"` | — |
| AC-004-1 | A03 | T-D01 | `test:unit tests/component/jobs/process.spec.ts -t "WI AC-004-1"` | — |
| AC-004-2 | A05、A14 | T-D02 | `test:e2e e2e/jobs/process.spec.ts -g "WI AC-004-2"` | — |
| AC-004-3 | A03、A14 | T-D03 | `test:unit tests/component/jobs/reconciliation.spec.ts -t "WI AC-004-3"` | — |
| AC-004-4 | A14 | T-D03 | `test:unit tests/component/jobs/reconciliation.spec.ts -t "WI AC-004-4"` | — |
| AC-004-5 | A05、A10 | T-D01 | `test:unit tests/component/jobs/process.spec.ts -t "WI AC-004-5"` | — |
| AC-005-1 | A03、A23 | T-E01 | `test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-1"` | — |
| AC-005-2 | A03 | T-E01 | `test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-2"` | — |
| AC-005-3 | A06、A15 | T-E02 | `test:e2e e2e/jobs/analyze.spec.ts -g "WI AC-005-3"` | — |
| AC-005-4 | A06、A15 | T-E03 | `test:unit tests/component/jobs/rule-candidate.spec.ts -t "WI AC-005-4"` | — |
| AC-005-5 | A18、E03（本地子项） | **T-H02** | `test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-005-5"` | 抽屉作业 / 阶段上下文标签（v2） |
| AC-005-6 | A05、A07、A10 | T-E01 | `test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-6"` | — |
| AC-006-1 | A04 | T-F01（自动）+ T-G10（M-05 人工） | `test:unit tests/component/jobs/deliver-blocks.spec.ts -t "WI AC-006-1"`；M-05 | — |
| AC-006-2 | A16 | T-F02 | `test:unit tests/component/jobs/block-editor.spec.ts -t "WI AC-006-2"` | — |
| AC-006-3 | A16 | T-F03 | `test:e2e e2e/jobs/deliver-comments.spec.ts -g "WI AC-006-3"` | — |
| AC-006-4 | A05、A16 | T-F04 | `test:e2e e2e/jobs/deliver-history.spec.ts -g "WI AC-006-4"` | — |
| AC-006-5 | A24 | T-F05 | `test:unit tests/component/jobs/diff-view.spec.ts -t "WI AC-006-5"` | — |
| AC-006-6 | A19 | T-F06 | `test:e2e e2e/jobs/deliver-revision.spec.ts -g "WI AC-006-6"` | — |
| AC-006-7 | A04、A08、A17、A19、A20、F01 | T-F07 | `test:e2e e2e/jobs/deliver-finalize.spec.ts -g "WI AC-006-7"`（finalize + pending reject） | — |
| AC-006-8 | A01、A23 | T-F01 | `test:unit tests/component/jobs/deliver-blocks.spec.ts -t "WI AC-006-8"` | — |
| AC-007-1 | A02、A06、A08、A15 | T-B06 | `test:unit tests/component/jobs/intervention-history.spec.ts -t "WI AC-007-1"` | — |
| AC-007-2 | A05、A14、A18、A20、D02 | T-G01 | `test:e2e e2e/jobs/pending-merge.spec.ts -g "WI AC-007-2"` | — |
| AC-007-3 | A13、B03、B05、C01、C03、D02、E02、F02 | T-G03 | `test:e2e e2e/jobs/confirm-modal.spec.ts -g "WI AC-007-3"` | — |
| AC-007-4 | A21、G02（本地子项） | **T-H03** | `test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-007-4"` | 首页作业轨道角标（v2） |
| AC-007-5 | A23 | T-G06 | `check --only glass` | — |
| AC-008-1 | A01、A02、A04、A06、A08 | T-G06 | `test:unit tests/unit/jobs/contract-doc.spec.ts` | — |
| AC-008-2 | A07、A09、A10、A11、A12、A21、G04 | T-G05 | `test:e2e e2e/jobs/scenarios.spec.ts -g "WI AC-008-2"` | — |
| AC-008-3 | A10、A22 | T-G06 | `check --only network` | — |
| AC-008-4 | A09 | T-G06 | `contract --check && check --only generated && test:unit tests/unit/jobs/contract-version.spec.ts` | — |
| AC-009-1 | G07；以及每个任务的工程门（typecheck / lint / 生成物一致） | T-G09（v2 后 H04 复验） | `pnpm -C frontend test` | — |
| AC-009-2 | G08 | T-G10（Handoff） | 手动截图 + `test:unit tests/unit/jobs/manual-acceptance.spec.ts` | — |

（表中命令省略了 `pnpm -C frontend` 前缀；完整写法见各任务。schema / 单测只作为“部分前置”，不冒充端到端验收。）

## 6. 依赖 DAG 与预估

- 组序：A（T-A01→T-A24）→ B → C → D → E → F → G → H；每个任务只依赖编号在它之前的任务，无环（Tasks 起草时已用脚本核对依赖都指向更早编号；Analyze 复核）。
- 主干：A01 → A02/A03 → A04 → A05 → A06 → A07 → A08 → A09 → A10 → A11 → {A12→A13, A14, A15, A16} → A17 → A18 → {A19, A20} → A21；A22 依赖 A10；A23 依赖 A01；A24 无依赖。
- UI：B01 依赖 A10 / A22 / A23；C、D、E、F 都以 B04 为入口；G03 / G05 / G06 收口；H 只依赖 C04 / E03 / G02 / G09，外加 v2 外部闸门；H 组只清理本 feature 页面级抽屉挂载（T-H01）并做集成验证，不改壳方。
- 合计 **62 个任务、约 96.5 h**（A 24 个 38.5 h / B 7 个 10.5 h / C 4 个 6.5 h / D 3 个 5 h / E 3 个 5.5 h / F 7 个 12 h / G 10 个 14.5 h / H 4 个 4 h）。所有任务都 `blocked_by: frontend-workbench-v1-handoff`；H 组（4 个任务、4 h）另 `blocked_by: frontend-workbench-v2`。

## 7. Converge 口径

- AC-003-1、AC-005-5、AC-007-4 的 v2 子项（T-H01～T-H03）未解除之前，Converge 必须报“**未收敛（外部阻塞）**”，不得报全量完成。
- D-019 的角色 / 成本、剪藏预览、复核结果、验证队列不计入本 feature。
- 实施期粒度（S-22）：T-A18 / T-A19 / T-A20 等顶格 2 h 任务若实际超过 2 h，按 AGENTS §2 第 9 步在本文件追加拆分任务并记录原因（如把 T-A18 拆为“上下文登记 + 事件投递”与“overlay / 终态合并”），不硬塞；拆分不改 AC 与范围，若涉及需求变化则回 Clarify。当前全部任务未开始，r5 不预先重拆。
- 如果 implementation_base_sha 下前端的实际情况与 §0 不符（脚本名、生成器结构、既有测试的硬编码），先修订本文件、重跑 Analyze，并经 A 复核；不得直接在实施中偷换。
