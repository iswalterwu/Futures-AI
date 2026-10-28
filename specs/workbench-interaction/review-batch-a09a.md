# Feature: workbench-interaction 代码 Review — 首批 T-A01～T-A09a（review-batch-a09a.md）

> **性质**：AGENTS §2 第 10 步 Review 的**批次评审**，只审首批 10 项（T-A01～T-A09、T-A09a）。**不是**全 feature 最终 Review、**不是** Gate 2、**不是** Handoff；不勾 checklist、不改代码 / spec / plan / tasks；参照 `templates/review.md` 结构但不填 Gate 2 记录。
> **审核员 A（脱敏）**：`claude-fable-5-1` **via anthropic**（官方通道）。本协调限额窗口内 `claude-bridge` 真实探活（对象 opus）已为 quota / rate / spend_limit 类失败，按 AGENTS §6 规则 5 同通道不重试；本会话**未做** fable 的 bridge 探活、未改 provider / key / 路由 / 全局配置、未换模型找通过。新会话、独立 worktree，与 Implement（`openai/gpt-6-astra`）异模型。
> **固定输入**：worktree `D:/2030/Futures-AI-interaction-review-a09a`，branch `review/workbench-interaction-batch-a09a`，HEAD `b0b065fb799c52ae729c9bd6d45335b5e165a4d0`（起始 clean）。受审代码 = `git diff 8753fa9f65dae685f765f316b00e6287750f0cf7 13a3373f7ebd2075fb8bcfe32033127a916fa6b9 -- frontend`（12 提交、21 文件、+14471 / −26）；本批文档精度同步 = `13a3373..b0b065f`（7 个 specs 文件，`-- frontend` 零差异）。checklist R7 原件 `9acf3de`，本树 `checklist.md` blob `7c219c071607596c813af6a3ebc1b651e25cd8d0`（与原件相同，未改）。
> **重新读取**（不依赖会话记忆）：AGENTS.md、`docs/plan.md`、`docs/interaction.md` §3.5（D-018 定稿）、`docs/designUI.md` §5.1、冻结 spec v1.1、plan.md（r6.2）、tasks.md（页首、§0.0、§1、§2、§2a、§3、T-A01～T-A09a 全部标准与命令、T-A10 / T-A12 / T-A21）、checklist 页首与 R7 结论（只读）、implementation-log、interface-handoff、converge-batch-a09a.md、analyze.md「Analyze R8」。全部源码 / tests / 五份 fixtures 真实阅读；生成物按字段抽样对拍（见 §2）。
> **边界**：唯一改动文件 = 本文件。依赖安装与测试产物只落在本树 gitignore 目录（`node_modules/`、`frontend/test-results/`），锁文件未改；临时日志只写 `C:/Users/iswal/AppData/Local/Temp/wi-implement-01a18388-72nsu9xh/review-a09a-*`。未 commit / push / PR / merge，未开子 agent，未写其他 worktree。
> **日期**：2026-10-29（+04:00）。

## 0. 判定

**本批通过**（仅 P3，无 P1 / P2）。10 / 10 任务的完成标准在代码层面真实成立，命令由本会话亲跑且与实施者数字一致；三份既有契约测试只改硬编码、v1 语义保留；文件所有权与 AGENTS §5 工程纪律未越界；D-020～D-024 内容未混入（Block 仍六类且拒绝 `call`，`InterventionKind` 恰 13 值，测试显式拒绝 `basis`）。

**不改变的事实**：46 AC 最终验收仍为 0（本批全是“部分前置”）；feature 整体**未收敛**（56 项未开始 + H 组 `blocked_by: frontend-workbench-v2`）；H-1 生产方 ①②③ 具备、**④ 未取得**，生产方集成树 `13a3373` 只是旁证，本评审不代填 ④、不代其他 feature 签收。

## 1. 独立亲跑证据（本会话执行；日志在上述独占目录）

| 命令 | 结果 | 日志 |
|---|---|---|
| `pnpm -C frontend install --frozen-lockfile` | exit 0（锁文件未改） | `review-a09a-install.log` |
| `pnpm -C frontend contract --check` | exit 0：`12 methods, 10 events, 2 artifacts match` | `review-a09a-contract-check.log` |
| `pnpm -C frontend check`（六守卫；`generated` 会重新生成并比对） | exit 0：generated / colors / glass / updown / grid / network 全 passed；之后 `git status` 仍 clean ⇒ 生成物与源一致 | `review-a09a-check.log` |
| `pnpm -C frontend typecheck` / `lint` | exit 0 / exit 0（`--max-warnings 0`） | `review-a09a-typecheck.log` / `review-a09a-lint.log` |
| `pnpm -C frontend test:unit`（全量） | **21 files / 722 passed / 0 failed**（与实施者末轮一致） | `review-a09a-unit.log` |
| 三份既有契约测试 `contracts / contract-doc / mock.spec.ts` | 3 files / 88 passed | `review-a09a-v1-contract-tests.log` |
| tasks T-A01～T-A09a 全部 28 条 `-t` 标题命令 | 全部匹配并通过：enums 2 / labels 10 / contract notes 1；job schema 9 / naming 1 / revision 6 / artifact 1 / workspace 7 / intervention kinds 24 / pin_rule 1 / intervention fields 3；intake 12 / process 3 / analysis 1；blocks 9 / S-18 5 / generated deliverable 1；jobs fixtures 14 / list coverage 1 / deliverable fixtures 5 / final only delivered 1 / interventions fixtures 1；scenarios 15 / change note 1 / jobFixtures 14；H-1 schema 3 / legacy 5 / passthrough 7 | `review-a09a-task-titles.log` |
| `pnpm -C frontend test:e2e e2e/agent.spec.ts`（先核 127.0.0.1:4173 空闲，由 webServer 自管） | **8 passed**（既有全局输入 / 回放不回归） | `review-a09a-e2e-agent.log` |
| 边界探针（只读 node 脚本，对 `types.ts` / `events.ts` 直接 parse，非产品测试） | 见 §4 R-D | `review-a09a-probe.mts` / `.log` |
| `git diff --check` / `git status` | 通过 / clean（写本文件前） | — |

**未跑项**：全量 `pnpm test`（含全部 e2e）——本批无 UI，tasks 首批命令不含 e2e，归 T-G09 / T-H04；未重装浏览器、未动全局配置。

## 2. 生成物与源对拍（抽字段，非风格总结）

- `CONTRACT.md` 标题 `v2.0.0`；§1 含 `contractChange` / `jobScenarios` 全文（含 S-19 声明句）；`### ActiveJobStatus` 枚举恰 7 值并带 S-14 describe；`JobStatusLabel.failed` = `"失败"` / `"×"`；`Deliverable` 段 `$.oneOf[0].deliverableStatus = "draft"`、`$.oneOf[1].deliverableStatus = "final"` 且 final 三锚为 string / integer / Timestamp、draft 三锚为 null；`FinalSnapshot.revisionNumber` 必填；`SendMessage` 与十类事件段均有 `| $.jobContext | 否 |`。
- `schema.json`：`x-contract-version = 2.0.0`，`$defs` 106 项，`x-methods` 12；`Bootstrap.scenario` 九值闭枚举；`Deliverable.oneOf` 长度 2；`StageWorkspace.oneOf` 4；`InterventionKind` 13；`InterventionPayload` 23 分支；`SendMessage.required = ['message']`。
- 源与生成物一致性由 `check:generated`（重新生成后 `git status` clean）与 `contract --check` 双重确认；生成器 `contract-build.mjs` / `check.mjs`、`package.json`、锁文件、九个 v1 顶层 fixtures、agent 脚本、`app/**`、`main.ts`、`agent/store.ts`、`real/`、`client.ts` 相对 `8753fa9` 零差异。

## 3. 逐任务核对（完成标准 → 代码证据 → 本会话命令结果）

| 任务 | 核对要点（真实读源） | 结论 |
|---|---|---|
| T-A01 | 枚举 9 / 4 / 5 / 3 / 13；`labelSchema()` 由同一 `as const` 常量生成 literal schema（九张）；`OriginLabel.derived='内部生成'`、`DeliverableStatusLabel` 草稿 / 已定稿；`ActiveJobStatusSchema = exclude(['delivered','cancelled'])`，`ACTIVE_JOB_STATUSES` 与 `.options` 同一引用；S-14 / S-16 describe 进文档 | 满足 |
| T-A02 | `jobSummaryFields` 共享；`JobListItem` 恰 r6 十字段（探针确认 parse 全量 Job 时剥掉 goal / createdBy / parentJobId）；stages 定长 4 + 顺序 refine；failed / cancelled reason refine（含空白串）；`JobContext`；`InboxItem` 锚 nullable；camelCase 对照与 getJob null 语义在 describe 并进文档 | 满足 |
| T-A03 | `SourceNote` strict，`publishedAt` / `validUntil` 为 TradingDate；`INTAKE_FILE_EXTENSIONS` + 大小写不敏感 refine（`sample.pdf.exe` 拒）；`IntakeInput` 三分支，text 只在输入；`Upload` 三分支且 text 分支无正文（strict 拒 `text`）；`DerivedValue.lineage.min(1)`；`ReconciliationDiff` 复用 Figure 五元数据、空行集合法；`Conclusion.evidence` 为唯一计数（拒 `evidenceCount`） | 满足 |
| T-A04 | 六分支 strict `Block`；`ChartSpec.templateId` literal `line-sample`、`seriesBindings` / `overrides` strict（拒任意 option / 多余槽位）；`Deliverable` 判别联合；`DeliverWorkspace.superRefine` 一次校验三锚且 draft / null 不带快照；`FinalSnapshot.revisionNumber`；schema.json oneOf | 满足 |
| T-A05 | `Artifact` refine（pendingMerge ⇒ overlayRev）；`Revision` 四分支 strict；`StageWorkspace` 四分支用 `safeExtend` 限定 kind——测试实证 refine / superRefine 在 union 内仍生效（collect 工作区中 `pendingMerge:true` 被拒、deliver 分支三锚不一致被拒）；`WriteReceipt` + `InboxCounts` | 满足 |
| T-A06 | 23 个 strict payload；`interventionKindByAction` `satisfies` 全量映射且逐项与 plan 矩阵一致（annotate / block_comment / reply / resolve→framework，deepen / edit_block / revise_blocks / revert→rewrite，remove_source / cancel_job / delete_conclusion→delete，mark_provisional / accept / resolve_conflict→approve，what_if→question）；refine 实测拒 `ask_why`+`question`；`pin_rule.state` literal；测试期望表手写、不导入实现映射 | 满足 |
| T-A07 | `jobs.json` 五集合十作业；本会话 node 打印核对 status / currentStage / 四阶段态与 plan 样例表逐行一致；j-failed 仅阶段态 conflict、分析产物 draft（S-29）、reason 写明 S-14；三类型齐、updatedAt 十个互异（均 UTC Z，字典序 = 时间序）；`job-detail.json` 十作业各 2 投放 / 2 源 / 2 序列 / 3 步单链 / lineage 回链对账行 / 一有差异一空差异 / ≥3 结论且三种证据锚；j-conflict 分析 r1 provisional 快照 + r2 人版 / r3 agent 版 conflict | 满足 |
| T-A08 | j-deliver 六块按 结论 / 图表 / 表格 / 引用 / 待验证 / 备注，r1 agent / r2 human（备注块来源 agent→human，可作 AC-006-2 样例），一个 open 线程；j-merge 结论 + 备注、无 overlay；j-conflict conflict 块 + 人 / agent 修订；j-delivered final，`finalSnapshotId / finalRevisionNumber(1) / finalizedAt` = 快照，快照 `revisionId` = `latestMergedRev`，blocks 全 confirmed，finalize 事件 `createdAt` = `finalizedAt`；`interventions.json` 6 条、4 阶段、6 kind、十字段齐、锚全部可达；`uploads.json` 两条待归属（其一 quarantined 附原因），无正文 | 满足（O-1 见 §4） |
| T-A09 | `CONTRACT_VERSION='2.0.0'`、九场景、优先级 query > env > normal（实测含“同一 client 固定、未知值 validation_error”）；job-* 下 v1 十方法结果与 normal 全等；`contractChange` / `jobScenarios` 入文档；`readJobFixtures()`：`z.preprocess` 只按**文件键**浅覆盖 + `strictObject` ⇒ 整文件替换、不深合并（`{jobs:{normal:[]}}` 拒）、未知键拒、null / 数组 / 非法值 validation_error、每次读取返回独立副本；三份既有测试只改版本字面量、方法键 containment、方法数、`mock.spec.ts:96-99` 索引配对循环 | 满足（`readJobFixtures` 尚未被调用，符合标准 4“供 T-A10”） |
| T-A09a | `SendMessageSchema.jobContext?`；`events.ts` 共享 `eventFields` 增公共可选字段（十类同得，种类 / 终态不变）；mock `send` 在 `await delayScenario` **之前**同步 parse 输入（slow 场景 1500ms 前即捕获，调用方随后改对象不影响）；仅 `message.jobContext !== undefined` 时展开该键（无上下文时事件 `Object.hasOwn` 为 false，非 undefined 键）；测试覆盖四脚本 × 带 / 不带上下文、事件次数 / 顺序 / 唯一终态与脚本一致、后续不同上下文 send 与页面路径变动不改前一 run 已投递与未投递事件、非法 stage 在排定任何定时器前拒绝、结束时定时器归零 | 满足 |

## 4. 发现（全部 P3；本批不阻断）

| # | 严重度 | 位置 / 复现 | 说明 | 受影响 AC | 最小修复归属 |
|---|---|---|---|---|---|
| R-A | P3（数据语义精度） | `deliverable.json` → `j-conflict`：`deliverable.blocks` = r2（人版，conclusion 块 `status=conflict, source=human`），而 `artifacts[0].latestMergedRev` = r1（全 provisional）、最新编号为 r3（agent）；j-deliver / j-delivered 的 `deliverable.blocks` 则等于 `latestMergedRev` 的块 | `Deliverable.blocks`（describe“当前版本”）在冲突态下既不等于 latestMergedRev 也不等于最新编号修订，“当前版本”规则未定；schema 不约束，本批无错，但 T-A16 / T-A19 / T-F01 / T-F06 必须先定一条不变量（建议：`Deliverable.blocks` ≡ `revisions[latestMergedRev].blocks`，冲突由块 `status` + 两版修订呈现；或显式定义“当前视图 = 人版 overlay”），再让 j-conflict fixture 与之对齐。另 j-conflict 交付产物 `source=agent` 而块含人版（j-deliver 同形用 `mixed`） | AC-006-6 / AC-006-8 / AC-007-2（后续） | 后续（T-A16 / T-A19 定义，fixture 随之调整） |
| R-B | P3（fixture 可信度，= Converge O-2） | `job-detail.json` / `deliverable.json`：j-cancelled 四阶段 `not_started` 却有 2 条 ingested 投放、配方、3 条结论与交付初稿；j-collect（process / analyze 未开始）已有配方与结论；j-running / j-human / j-failed 的 deliver 未开始却有交付产物 r1；j-delivered 上游三产物仍 draft | 与 plan 样例表不冲突（只约束 status / currentStage / 阶段态 / 关键产物），但与 `StageState=not_started` 语义和 S-13“未开始 = 空集合”的表达相抵触；会削弱 B / D / E 组界面与 M-02 / M-04 人工验收的可信度（“未开始”阶段显示完整配方 / 结论） | AC-002-5 / AC-004-5 / AC-005-6（后续组件与人工验收） | 后续：首个消费这些工作区的任务（T-A10）或一次 fixture-only 小修：未开始阶段改为空 `artifacts[] / revisions[]`（deliver 空态 `deliverable=null`），不改本批标准 |
| R-C | P3（文档前瞻，= O-3） | `methods.ts` `contractChange` 写“新增作业方法”，CONTRACT.md §2 仍只有 12 个方法；`jobScenarios` 描述尚未实现的读写 / 持久化 / 收件箱行为 | 两段均带“随状态层任务逐项接入 / 由后续状态层任务接入”限定，AC-008-4 的变更说明可接受为过渡态；但 `real` 实现者按“2.0.0”读文档时看不到作业方法 | AC-008-4 | 后续：T-G06 收口时复核文案与 `methodSemantics` 一致；状态层任务接入方法后不得遗留前瞻句 |
| R-D | P3（不变量只在一侧 / 未跨字段） | 探针实测（`review-a09a-probe.log`）：① `Artifact` `overlayRev` 非空但 `pendingMerge=false` 通过；② `Upload` `status=quarantined` 无 `quarantineReason` 通过；③ `DeliverWorkspace` final 时 `finalSnapshot.jobId ≠ deliverable.jobId`、`finalSnapshot.blocks ≠ deliverable.blocks` 通过；④ `rerun.affectedStages` 乱序 / 不含 `stage` 通过；⑤ `Job.currentStage` / `status` 与 `stages[]` 状态不交叉校验（如 status=collecting、currentStage=deliver 通过） | 均不在 T-A02～T-A06 完成标准内，fixture 测试已在样例层覆盖 ③；但 `jobFixtures` 覆盖与状态层写入都经同一边界，按 AGENTS §5.2“入口校验一次”，这些是入口可低成本封死的口径 | AC-004-2 / AC-007-2（①）、AC-003-6（②）、AC-006-7（③）、AC-002-4（④）、AC-002-1（⑤） | 后续：由接管写入的任务（T-A10 / T-A12 / T-A14 / T-A17 / T-A20）在同一 schema 上补 refine，或在 tasks 明确“由状态层保证”；不建议本批回改 |
| R-E | P3（fixture 语义） | `interventions.json` `i-seed-6`（finalize）`outcome='merged'` | plan 把 `merged` 定义为 overlay 经检查点 / `mergePending` 合并的结果；定稿无合并，更应为 `recorded`。`i-seed-4` edit_block=merged 合理（非运行文本编辑直接合并） | AC-007-1（筛选 / 展示文案） | 后续：T-A17 定义 finalize 事件 outcome 后对齐 fixture |
| R-F | P3（样例覆盖） | `job-detail.json` 十作业 20 条投放全部 `inputKind=url`；`file` / `text` 仅见于 `uploads.json` 待归属池；`pendingCount` 在 j-human / j-conflict 为 0 | 前者对 AC-003-2 组件测试无影响（由输入驱动），但采集列表展示三种投放的样例只能靠 e2e 自造；后者是设计使然（T-A21 在建状态时生成条目并改写 `Job.pendingCount` 与 `stages[].pendingCount`），但 T-A21 须**同时**改写两处计数，否则列表卡 / 轨道角标读到 0 | AC-003-2（人工）、AC-007-4 | 后续：T-A21 实施与 Review 核对；file 样例可随 T-C 组补 |
| O-1 | 无发现 | `uploads.json` 两条待归属、其一 quarantined | “两条待归属、一条 quarantined 并附原因”读作“两条待归属，其中一条隔离”成立；AC-003-5 仍有一条非隔离待归属可归入 | — | 不需修复 |
| O-4 / O-5 / O-6 | 无发现 | `latestMergedRev` 必填 ⇒ 每产物至少一修订（fixture 已有空块 r1 先例，T-A12 可沿用）；`readJobFixtures` 未接线属 T-A10；fixture 形状 schema 进 CONTRACT.md 为生成物 | — | 不需修复 |

**本批 bug**：无。**架构风险**：无新增（仅 R-A / R-B 的语义精度需在状态层前定案）。**测试缺口**：本批测试不是实现逻辑的复写——期望值手写（动作矩阵表、plan 十行样例表）、正反例齐全、跨文件锚可达性与 S-18 在 union 内的保留均有断言；H-1 透传以真实 mock + 假时钟驱动真实定时器验证，未验孤立 schema。**目标对齐**：与冻结 spec v1.1 / plan r6.2 / tasks 一致；D-020～D-024 未混入；Converge §3 六项字段定形确为既有需求内的精度（`FinalSnapshot.revisionNumber` 是 S-18 既有比较对象的承载；修订列表由工作区持有与 T-A05 字段表一致；`RecipeStep` / 表格块 / fixture 形状均为容器形态），不构成需求变更。

## 5. H-x 交接与 feature 状态（本评审不代填）

| 切片 | 状态（本评审核对后） |
|---|---|
| H-1 | ① `13a3373` ✓；② R7 `9acf3de` ✓；③ 本会话亲跑 `agent-context-contract.spec.ts` 3 / 5 / 7、`contract-version.spec.ts -t "WI scenarios"` 15 ✓；**④ 未取得**——须 `integration/frontend-workbench-v2` 所有者集成后由其登记；生产方 `13a3373` 只是旁证 → **待消费方集成（未交付）** |
| H-2·标签 / H-6 | 部分前置（T-A01；T-A07 / T-A09）；T-A23、T-A10 / T-A11 / T-A21 未实施 → 未交付 |
| 其余 | 提供任务未实施 → 未交付 |

feature：10 / 66 已实施、56 未开始；46 AC 最终验收 0；H 组外部阻塞不变；**未收敛**。

## 6. 下一步（建议，不替作者改）

1. 集成人确认本结论后，按 tasks §6 DAG 派第二批（起点 T-A10 / T-A22 / T-A23 / T-A24）。
2. R-A（`Deliverable.blocks` 不变量）在 T-A16 / T-A19 开工前以一句精度登记到 plan §2.4（非需求变更），j-conflict fixture 随之对齐；R-B 可在 T-A10 消费工作区时顺手修 fixture（空态），或登记为独立 0.5 h fixture 任务。
3. R-C / R-E 在 T-G06 / T-A17 收口时复核；R-D 由接管写入的状态层任务决定在入口补 refine 还是在 tasks 明示“由状态层保证”。
4. H-1 ④ 待 v2 集成树所有者登记；本 feature 不代写。

## 验收证据（本批）

- 测试命令输出摘要：见 §1（21 files / 722 passed；三份既有契约测试 88 passed；28 条任务标题命令全部通过；`check` 六守卫 / `contract --check` / typecheck / lint 过；`e2e/agent.spec.ts` 8 passed）。
- Converge 报告结论：`converge-batch-a09a.md` 判本批“已收口、待独立 Review”，本评审核对其 §2 逐任务证据与 §3 精度判定成立；§4 O-1～O-6 独立判定见 §4。
- Gate 2 确认记录：**不适用**（本批不是正式 Review / Handoff；Gate 2 待全 feature 最终 Review）。
