# Feature: workbench-interaction Converge 报告 — 首批 T-A01～T-A09a（converge-batch-a09a.md）

> **性质**：AGENTS §2 第 9 步 Converge 的**批次报告**：只读对比本批真实代码与 spec / plan / tasks。**不是** Review、不是审核结论、不是 Gate 2、不是 Handoff；不勾选 checklist，不改 spec。
> **阶段记录（脱敏）**：Converge / 状态记账 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18440-f6ab-76d5-8ed7-409aec13d42b`）。`claude-bridge` 本限额窗口已明确 quota / rate / spend_limit 类失败，按 AGENTS §6 规则 5 本轮不重试；官方通道同模型实际调用成功。只换通道、未换模型，未改 provider / key / 路由 / 全局配置。派工人 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。
> **写入范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-converge-a09a`（branch `docs/workbench-interaction-batch-a09a`，起点 `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`，起始 clean）；只写 `specs/workbench-interaction/{plan,tasks,analyze,implementation-log,interface-handoff,converge-batch-a09a}.md` 与 `specs/README.md` 本 feature 两行。未改代码 / 测试 / 生成器 / spec / checklist / review / docs / 其他 feature / root HANDOFF；未 commit / push / PR / merge；未启动子 agent / 服务 / 安装；**未运行任何产品测试**（下文测试结果全部为实施者执行、本会话未重跑）。
> **日期**：2026-10-29（+04:00）。

## 0. 固定输入

| 项 | 值 |
|---|---|
| `implementation_base_sha` | `43b6d79681a49562f41751368b2ae00c24062f56`（v1 Handoff，不变） |
| `upstream_start_sha` | `90187f7d8907316e554d2441d846827468c5371f`（main） |
| 授权规格种子 | `8753fa9f65dae685f765f316b00e6287750f0cf7`（源 `1ad796330997d3d4990ac513428ad7b2427d0422`；只含 `specs/workbench-interaction/**` 与 README 本 feature 行 / 跨 feature 行；`90187f7` 为其祖先） |
| 本批代码 diff | `8753fa9..13a3373`（12 个提交，21 个文件） |
| 有效 Checklist | R7，原件 `9acf3de661187840ea5be6f6d6f78205872ac356`；本树 `checklist.md` `git hash-object` = `7c219c071607596c813af6a3ebc1b651e25cd8d0`（与原件 blob 相同，只读未改） |
| 生产方集成树 | `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`，HEAD = `13a3373`（只读 `rev-parse` 核验；旁证，不是 ④） |
| v2 消费方集成 | 未取得（本会话不写、不代登记） |

**本轮开始时重新读取**（不依赖会话记忆）：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`、冻结 spec.md（v1.1，46 AC）、plan.md、tasks.md（含 §0.0、§2、§2a、§4 首批 10 项与 §5～§7）、analyze.md（R7）、checklist.md 页首与 R7 结论（只读）、implementation-log.md、interface-handoff.md、`specs/README.md`；实施者两份脱敏回报（`astra-A01-A06-result.md`、`astra-A07-A09a-result.md`，只作结果来源，不以摘要代替代码核对）。

## 1. diff 事实与所有权

- `git diff --stat 8753fa9..13a3373`：21 文件、+14471 / −26。逐提交 `git show --name-only`：只涉及 `frontend/src/contracts/{types.ts,methods.ts,mock/index.ts}`、`frontend/src/contracts/mock/fixtures/jobs/*.json`（5 个新文件）、`frontend/src/agent/events.ts`、`frontend/contracts/{CONTRACT.md,schema.json}`（生成物）、`frontend/tests/unit/jobs/*.spec.ts`（7 个新文件）与 T-A09 指定的三份既有契约测试 `tests/unit/{contracts,contract-doc,mock}.spec.ts`。
- **零差异**（`git diff --stat 8753fa9..HEAD --` 为空）：`specs/**`、`docs/**`、`HANDOFF.md`、`AGENTS.md`、`frontend/scripts/**`（含 `contract-build.mjs` / `check.mjs`）、`package.json`、`pnpm-lock.yaml`、九个 v1 顶层 `fixtures/*.json`、`mock/agent/*` 脚本。`app/**`、`workbench/**`、`agent/{store,AgentDock,AgentDrawer,CotTimeline}`、`main.ts`、`real/index.ts`、`client.ts` 未改（本批不需要）。
- 三份既有契约测试只改硬编码：版本字面量 → `CONTRACT_VERSION`；方法键 `toEqual` → `arrayContaining(v1 十键)`；`methodSemantics` 长度 → `dataMethods + agentMethods`；`x-methods` 长度与 `--check` 输出中的方法数 → `methodSemantics` 计数；`mock.spec.ts` 按索引配对循环 → 只遍历 v1 十个方法键（B-7）。未删 v1 用例、未放宽 v1 语义。
- 两个修复提交只补 `.describe()`（`1ed6ec1` 补 A01～A06 新字段；`7bb83f9` 补 `JobCollections` 五个集合字段），去掉 describe 后的行为差异为零；触发原因是既有“每个字段有描述”守卫，修复方式是改源并重新生成，未改既有测试 / 生成器。
- `82c36e7` 把 `JobDetails` 的 record 值提为具名 `JobDetailFixtureSchema` 并注册进 `contractSchemas`，使未改的表驱动生成器能展开 record 字段（工程手段，不改语义）。

## 2. 逐任务核对（完成标准 → 代码证据 → 命令）

“命令结果”列 = **实施者在独立实施树执行、本会话未重跑**（openai/gpt-6-astra，新会话，未回退）。“标题存在”= 本会话读测试源确认 tasks 命令的 `-t` 标题在对应文件中存在且可匹配。

| 任务 | 固定 commit | 完成标准要点 → 代码证据 | 标题存在 | 命令结果（实施者执行） | 判定 |
|---|---|---|---|---|---|
| T-A01 | `07ef7ccc3c889400dfb2354ceec22c94317c8813`（+`1ed6ec1` describe） | 9 / 4 / 5 / 3 / 13 枚举，无 `source_pref` / `value_fix`；九张映射由 `labelSchema()` 从同一 `as const` 常量生成 literal schema；`OriginLabel.derived='内部生成'`、`DeliverableStatusLabel` 草稿 / 已定稿；`ActiveJobStatusSchema = exclude(delivered,cancelled)` + `ACTIVE_JOB_STATUSES`；S-14 / S-16 describe 入文档 | `WI enums` / `WI labels` / `WI contract notes` | 2 / 10 / 1 pass；contract、`--check`、typecheck、lint、`git diff --check` 过 | 本批完成标准满足 |
| T-A02 | `ad4a8309d3e3a69d09a2b4745ce3e41e433a9b31` | `StageSummary`；`Job` / `JobListItem` 共享 `jobSummaryFields`（列表字段恰为 r6 固定 10 项），stages 定长 4 + 顺序 refine，failed / cancelled reason refine；`JobContext`；`InboxItem` 锚可 null；camelCase 对照与 `getJob` null 语义在 describe | `WI job schema` / `WI naming` | 9 / 1 pass；工程门过 | 满足 |
| T-A03 | `8e81063a2102fe121069148347b9714601cb59ab` | `SourceNote`（strict，`publishedAt` 为 TradingDate）；`INTAKE_FILE_EXTENSIONS` + 扩展名 refine；`IntakeInput` / `Upload` 按 `inputKind` 判别、text 不入 Upload；`DerivedValue.lineage.min(1)`；`ReconciliationDiff` 复用 Figure 元数据、空行集合法；`Conclusion.evidence` 为唯一计数源 | `WI intake schema` / `WI process schema` / `WI analysis schema` | 12 / 3 / 1 pass；工程门过 | 满足 |
| T-A04 | `112c2838a4fb6b3b499928e28d9ff947acadf677` | 六分支 `Block`（strict）；`ChartSpec.templateId` literal、overrides strict；`Deliverable` 判别联合（draft 三锚 null / final 三锚非空）；`DeliverWorkspace.superRefine` 一次校验三锚；`FinalSnapshot` 含 `revisionNumber`（见 §3） | `WI blocks` / `WI S-18` / `WI generated deliverable` | 9 / 5 / 1 pass；工程门过 | 满足 |
| T-A05 | `581f434fcf9e167fd014dd21b533c98c71ea4e25` | `Artifact` refine（pendingMerge ⇒ overlayRev）；`Revision` 四分支（S-12）；`StageWorkspace` 按 stage 判别、各分支限定 kind 的 `artifacts[]` / `revisions[]`；`WriteReceipt` + `InboxCounts` | `WI revision` / `WI artifact` / `WI workspace` | 6 / 1 / 7 pass；工程门过 | 满足 |
| T-A06 | `e66ecd4e58f823466542f57dddca4a89990a63cd`（+`1ed6ec1`） | 23 个 action 的 strict payload 联合；`interventionKindByAction` `satisfies` 全量映射 + refine；`pin_rule.state` literal `candidate`；十字段；`WriteReceipt.interventions` | `WI intervention kinds` / `WI pin_rule candidate` / `WI intervention fields` | 24 / 1 / 3 pass；首次联合回归 183 pass / 1 fail（缺 describe）→ `1ed6ec1` 后 184 pass / 0 fail | 满足 |
| T-A07 | `0f604480816c6372e847d29cf05bdc63e88371a3`（+`7bb83f9` describe） | `jobs.json` 五集合分键、十作业；本会话以 node 只读打印核对 status / currentStage / 四阶段态与 plan 样例表**逐行一致**（j-human D,H,R,N；j-conflict D,D,C,R；j-failed D,D,C,N 且分析产物 draft，S-29）；三种类型、updatedAt 互异；`job-detail.json` 十作业各含 2 投放 / 2 源 / 2 序列 / 3 步配方 / lineage / 一有差异一空差异对账 / ≥3 结论且三种证据锚；j-conflict 分析产物 conflict 且 latestMergedRev 为 provisional 快照 | `WI jobs fixtures` / `WI list coverage` | 14 / 1 pass；typecheck、lint 过 | 满足 |
| T-A08 | `320277af618d75d15ec3e5fefec13cb4291cdf5e` | `deliverable.json`：j-deliver 六块按序、v1 agent / v2 human、一个 open 线程、draft；j-merge 结论 + 备注、无 overlay；j-conflict conflict 块 + 人 / agent 修订；j-delivered final，三锚 = 快照（id、revisionNumber=1、finalizedAt）且快照 revisionId = 产物 latestMergedRev；`interventions.json` 6 条、4 阶段、6 种 kind；`uploads.json` 两条待归属（其一 quarantined 附原因，见 §4 O-1） | `WI deliverable fixtures` / `WI final only delivered` / `WI interventions fixtures` | 5 / 1 / 1 pass；工程门过 | 满足 |
| T-A09 | `82c36e7b05ce286ebc0f9650e466695e394612ee` | `CONTRACT_VERSION='2.0.0'`；scenario 九值；`contractSemantics.contractChange` / `jobScenarios`（含 S-19 声明句、jobFixtures 整文件替换 / 建状态读一次 / 新建 client 语义）；`MockOverrides.jobFixtures` + `readJobFixtures()` 边界解析（浅合并到文件键、strict 拒绝未知键、非法 validation_error）；三份既有测试只改硬编码 | `WI scenarios` / `WI change note` / `WI jobFixtures`；三份既有测试整文件 | 15 / 1 / 14 pass；既有三份 88 pass；全量单测 20 文件 707 pass / 0 fail；工程门过 | 满足（`readJobFixtures()` 尚未被状态层调用，接入归 T-A10，符合标准 4 “供 T-A10 建状态使用”） |
| T-A09a | `13a3373f7ebd2075fb8bcfe32033127a916fa6b9` | `SendMessageSchema.jobContext?`；`events.ts` 共享 `eventFields` 增可选 `jobContext`（十类同得，事件种类不变）；mock `send` 仅在 payload 带上下文时展开该键（无上下文时键不存在）；旧事件 / 四脚本不带该键仍可解析 | `WI H-1 schema` / `WI H-1 legacy` / `WI H-1 passthrough` | 3 / 5 / 7 pass；末轮全量单测 **21 文件 722 pass / 0 fail**；`check` 六守卫（generated / colors / glass / updown / grid / network）、`contract --check`、typecheck、lint、`git diff --check` 过 | 满足 |

**未运行 E2E**：本批无 UI，tasks 首批命令不含 e2e；全量 `pnpm -C frontend test`（含 e2e）属 T-G09 / T-H04，后续仍须执行。

**结论（本批）**：10 / 10 任务的完成标准在代码层面有对应实现，命令标题存在且实施者执行结果全部通过；**未发现需要新增修复任务的缺口**。按 AGENTS §2 第 9 步，本批范围记为“**已收口（待独立 Review）**”。这些全是 schema / fixture / 边界解析 / 透传的**部分前置**，不构成任何 AC 的最终验收。

## 3. 实施中的字段定形：是否需求变更

| 实施事实 | 原 plan / tasks 文本 | 判定 | 同步位置 |
|---|---|---|---|
| `FinalSnapshot.revisionNumber`（必填正整数） | plan `{id,jobId,revisionId,finalizedAt,blocks}`；tasks §2 S-18 已要求“final 三锚与快照的 id / **revision number** / finalizedAt 一致” | 精度：S-18 既有比较对象需快照携带版本号；不扩行为 | plan §2.4 `FinalSnapshot` 行；T-A04 修改范围 |
| `StageWorkspace` 各分支 `artifacts[]` / `revisions[]` 限定 kind；deliver 空态 `deliverable=null`、`finalSnapshot=null` | T-A05：collect = uploads + dataset 产物等；S-13：empty 返回“带阶段的空集合” | 精度：容器形态与空态表达；S-13 语义不变 | plan §2.4 `Artifact` 行注；T-A05 修改范围 |
| `latestMergedRev` / `overlayRev` / `baseRev` = `Revision.id`；`Artifact` 不内嵌 `revisions`（修订列表在工作区 `revisions[]`） | plan `Artifact` 列有 `revisions`；T-A05 的 Artifact 字段已不含 `revisions` | 精度：plan 与 tasks 既有差异按 tasks 落地；锚的取值域写明 | plan §2.4 `Artifact` 行 |
| `RecipeStep{id,label,input,output}`（单字符串锚、单链） | “输入 / 输出锚、单链” | 精度 | plan §2.4；T-A03 修改范围 |
| 表格块 `columns: string[]`、`rows: (string\|number\|null)[][]` | “table 带 columns / rows / tableId” | 精度 | plan §2.4；T-A04 修改范围 |
| `job-detail.json` = 以 jobId 为键的 `{collect, process, analyze, previews(按 uploadId), reconciliations}`；`deliverable.json` = 以 jobId 为键的 deliver 工作区；`uploads.json` = `{uploads, previews}` | T-A07 / T-A08 写明内容与“以作业 id 为键”，未写对象形状 | 精度：fixture 文件形状 | plan §2.4 fixture 句；T-A07 / T-A08 修改范围 |
| 具名 `JobCollections` / `JobDetails` / `JobDetailFixture` / `DeliverableFixtures` / `UploadFixtures` 注册进 `contractSchemas` | plan“fixtures 校验与生成文档”；生成器不改 | 精度：为让未改的生成器展开 record 字段 | plan §2.4 fixture 句；T-A09 修改范围 |

**判定**：全部是既有需求内的类型 / 形状精度；方法集、动作矩阵、九场景、样例表、定稿语义、46 AC、任务编号 / 依赖 / 预估 / 命令均未变；**不是需求变更**，无需回 Clarify / Gate 1，也不需另起 A 定向复核（独立代码 Review 会核这些 diff）。同步文字以【r6.2 精度（Converge batch-a09a 登记）】标注。

## 4. 给独立 Review 的观察项（非缺口、未新增任务；由 A 判定是否为 P3）

- **O-1**（T-A08 读法）：tasks“`uploads.json`（两条待归属、一条 quarantined 并附原因）”，实现为**两条**待归属、其中一条 quarantined；另一种读法是三条。两种读法都满足 AC-003-6 的样例前提（T-A12 标准 2 另要求 confirm 后 quarantined 可复现）。
- **O-2**（fixture 均匀化）：`job-detail.json` 十个作业的采集 / 处理 / 分析内容同形（如 j-cancelled 四阶段 N 仍有 2 条 ingested 投放与 3 条结论；j-delivered 的 dataset / recipe / analysis 产物为 draft）。plan 样例表只约束 status / currentStage / 阶段态 / 关键产物，未违反；是否影响 B / D / E 组界面可信度留 Review 与后续 UI 任务判断。
- **O-3**（契约文档前瞻文字）：`contractChange` 写“新增作业方法”、`jobScenarios` 描述 empty / error / slow / job-* 的作业读写行为与持久化，但本批 `methodSemantics` 仍为 12、状态层未实现；两段均带“随状态层任务逐项接入 / 由后续状态层任务接入”的限定。后续批次 Converge 须复核文字与实现一致（T-G06 / AC-008-4 收口）。
- **O-4**（前向约束）：`Artifact.latestMergedRev` 非空，意味着每个产物至少有一个已合并修订；T-A12 `createJob` 的“初始空产物”应落为空 `artifacts[]` / `revisions[]`（或带初版修订），由 T-A12 实施与 Review 核对。
- **O-5**（H-6 边界）：`readJobFixtures()` 已导出但未被调用；`jobFixtures` 尚不影响任何读方法。H-6 交付另需 T-A10 / T-A11 / T-A21。
- **O-6**：`contractSchemas` 增加 fixture 形状 schema，CONTRACT.md 体量显著增大（生成物，无手改）。

## 5. AC 与 Converge 核对项

- **46 AC 最终验收：0 / 46**。本批覆盖的只是矩阵“部分前置”列中的 A01～A09a 项；schema / 单测不冒充端到端验收（tasks §5 表注）。
- tasks §7 “写后统一刷新核对”（S-31）：本批无领域写路径、无 store，**不适用**；从 T-A12 / T-A22a 起逐写路径核对。
- tasks §7 实施期粒度：首批无任务回报超 2 h，未触发拆分。
- 基线：`8753fa9` 的前端代码 = `90187f7`（种子只加 specs / README），tasks §0.0 事实未变。

## 6. H-x 交接状态（四项齐全才“已交付”）

| 切片 | ① | ② | ③ | ④ | 状态 |
|---|---|---|---|---|---|
| H-1 | `13a3373`（含 T-A02 `ad4a830`、T-A09 `82c36e7`、T-A09a） | R7 `9acf3de` | 实施者执行：`agent-context-contract.spec.ts` 三标题 3 / 5 / 7 pass；`contract-version.spec.ts -t "WI scenarios"` 15 pass（本会话未重跑） | **未取得**（须 `integration/frontend-workbench-v2` 所有者真正集成后登记；生产方集成树 `13a3373` 只是旁证） | **待消费方集成（未交付）** |
| H-2·标签 | 部分：T-A01 `07ef7cc` 的 Label 常量 / `ACTIVE_JOB_STATUSES`；`JobStatusBadge`（T-A23）未实施 | R7 | 部分（`WI labels`）；`badges.spec` 不存在 | 未取得 | 未交付 |
| H-6 | 部分：T-A07 `0f60448` / T-A09 `82c36e7` 的 fixture 形状与边界解析；状态层 T-A10 / T-A11 / T-A21 未实施 | R7 | 部分（`WI jobFixtures`）；`job-state-read` / `job-state-inbox` 不存在 | 未取得 | 未交付 |
| H-2·列表、H-3、H-4、H-5、页面切片 | 提供任务未实施 | R7 | 无 | 未取得 | 未交付 |

## 7. 结论

- **本批（T-A01～T-A09a，10 项）**：已收口，**待独立 Review**；未发现需修代码或新增任务的缺口；字段定形仅为精度，已同步 plan / tasks。
- **feature 整体**：**未收敛（尚未实施 + H 组外部阻塞）**——10 / 66 已实施，56 项未开始（T-A10～T-A21、T-A22、T-A22a、T-A22b、T-A23、T-A24、B 7、C 5、D 3、E 3、F 7、G 10、H 4）；46 AC 最终验收 0；H 组仍 `blocked_by: frontend-workbench-v2`，AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项按 tasks §7 必报外部阻塞。
- **不是** Review 通过、不是 Gate 2、不是 Handoff；未写 `review.md`；H-x 无一“已交付”。

## 8. 下一步

1. **独立代码 Review（审核员 A，新会话、与实施异模型，模型按 AGENTS §6：`claude-fable-5-1` 先 bridge 后 anthropic）**，只读输入：spec.md（冻结）+ plan.md / tasks.md（含本轮 r6.2 精度同步）+ 本报告 + analyze.md「Analyze R8」+ 固定代码 diff `8753fa9..13a3373`（逐提交见 §2）；重点：§3 字段定形是否确为精度、§4 O-1～O-6、三份既有契约测试改动是否只限硬编码、H-1 透传语义（无上下文不出现键、发送时上下文不被改写）。A 可亲跑首批命令；本报告的测试结果均为实施者执行。
2. Review 后按 DAG 派第二批（依赖已满足、可并行的起点：T-A10、T-A22、T-A23、T-A24；随后 T-A11 → T-A12…）；H-1 ④ 待 v2 所有者集成后由其登记。
3. 本 worktree 的文档改动由集成人审阅后提交（本会话不 commit）。
