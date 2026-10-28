# Feature: workbench-interaction Analyze 报告（analyze.md）

> Analyze 阶段产物（AGENTS §2 第 7 步）：只读报告 spec.md / plan.md / tasks.md 之间的冲突、差距与模糊之处。本报告**不修改** spec / plan / checklist；发现的 Tasks 可修正问题先在 R1 结束只读报告，再单独修订 tasks.md，然后重新读取输入、重跑（R2）。R1 的发现原样保留，不因修订而删除。
>
> **阶段记录（脱敏）**：角色 = Analyze；Analyze = **claude-opus-5-5 via anthropic**。通道说明同 tasks.md 页首：沿用本限额窗口 R3 的探活证据（`claude-bridge/claude-fable-5-1` 失败，quota / rate / spend_limit 类，exit 1；`anthropic/claude-opus-5-5` 已真实探活并完成 Plan 补正）；本阶段**未发起 claude-bridge 调用，也未单独探活 bridge-opus**，未改 provider / 路由 / 配置。
> **当前结论：见文末「Analyze R5（Tasks 修订 r5 之后；区别于 Checklist R5）」**——内部一致性通过，待 A 新会话 R6 定向复核；Implement BLOCKED：缺 frontend-workbench v1 Handoff SHA（另 P-1 待 R6）；未实施、未验收、未收敛。
> 下文 R1～R4 各节（含「1. 冲突 / 差距 / 歧义（最终状态）」与「最终结论（R4）」）是**当时的历史记录**，原文保留，不代表当前状态。R4 时页首原写：“最终结论（R4，详见文末）：无未解决的内部冲突，待 A 复核；Implement BLOCKED：缺 frontend-workbench v1 Handoff SHA；未实施、未验收、未收敛。”
> **本报告不是审核结论**：Analyze 结论须由 A 在新会话、以不同模型复核（checklist I-01b）；本会话不勾选 checklist。

## 基线与审查范围

- 仓库 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD `8bd1b31cfe99aa687338f68f63bf7668a4abaa3b`（无新提交；按 HEAD + 内容 hash 审查）。
- 输入原文 SHA256：spec.md `ed0f6c6c3e50b93166a02880df574e6f167a5773829ec0ab8d3ddcf269f942d9`；plan.md `981ecc25eb62b41502187eb77fb31e879ba7ee889609336b0065531f9bb81d21`；checklist.md `56181b02efcf4620dd821f95c26e12fbcf026dd9b855b8b888821db8f1ce5075`；tasks.md 在 R1 时为 `63299777af24e5ad4e6576ebe5ba70d5b55a433b8f27671da7cbfc02d994c90a`（R2 的 hash 见 R2 节）。
- **阶段开始时重新读取**（2026-10-28T15:47+04:00，不依赖 Tasks 阶段的会话记忆）：AGENTS.md（§2 工作流、§5 工程准则、§6 模型路由）、spec.md（R-001～R-009、46 条 AC、§4 约束、§5 歧义表）、plan.md（§1.1 基线、§2.1～§2.5、§3、§4 关键流程与 rerun 迁移表、§5 验收对应）、checklist.md 当前 §R4（结论、S-11～S-18、阶段说明、Implement 前置）、tasks.md 全文、docs/interaction.md §3.3～§3.5、docs/designUI.md §2.4 / §3.4 / §3.9。
- 前端地基事实沿用 tasks.md §0 的只读核对（2026-10-28T15:31+04:00，`D:/2030/Futures-AI-frontend` `feat/frontend-workbench` `0ffa15e`）；它们只用于判断命令与文件路径是否可行，不作为实施基线。
- **未执行**：未安装依赖、未运行应用或产品测试、未启动其他 agent、未读凭证或全局配置、未修改 spec / plan / checklist / docs / 代码 / 其他 feature、未 commit / push / merge / 切分支。结构检查（AC 集合、任务编号唯一性、依赖方向、预估合计、“部分前置”是否为最终任务的祖先）用一次性 Python 脚本只读完成，不属于产品测试。

---

## R1（只读；对 tasks.md `63299777…` 的发现）

### R1-1 冲突（spec ↔ plan ↔ tasks）

无。tasks.md 没有改变 spec 的行为或 AC，也没有改变 plan 的方法集、19 行动作矩阵、九场景行为表、rerun 迁移表、定稿原子提交和所有权边界；S-11～S-18 的取舍都落在 plan 已留给 Tasks 的位置（checklist R2 / R3 / R4 原话）。

### R1-2 Tasks 可修正问题（须先修订 tasks.md 再重跑）

| # | 位置 | 问题 | 修正方向 |
|---|---|---|---|
| TF-1 | T-A05 | 一个任务包含两个相互独立的增量：①Artifact / Revision（S-12）/ StageWorkspace / WriteReceipt；②23 种 action 的 payload 联合与 kind↔action 约束。合在一起达到 2 h 上限而且偏紧，不符合“按真正独立的增量拆解、不粗塞单个 2 h 任务”的要求 | 拆成两个任务，各自 ≤1.5 h |
| TF-2 | §5 矩阵与依赖 | 脚本检查发现若干“部分前置”任务不是“最终验收任务”的祖先：AC-002-5（A16 / A17 / A19 ↛ B05）、AC-003-6（**A22 ↛ C02**：C02 用 A22 的徽标渲染上传状态，属真实缺失依赖）、AC-005-6（A18、F06 ↛ E01；其中 F06 排在 E01 之后，且两者与分析台四态无关）、AC-006-7（A19 ↛ F07）、AC-007-2（A19 ↛ G01）、AC-007-3（B03 / D02 / G04 ↛ G03；G04 排在 G03 之后，横幅与该 AC 无关）、AC-008-2（G04 ↛ G05） | 给最终任务补依赖；删除不相关的“部分前置”引用（A18 / F06 对 AC-005-6、G04 对 AC-007-3），并同步修改各任务完成标准中的 AC 引用 |
| TF-3 | T-B03、T-C04、T-G03 | e2e 要断言“mock 契约记录创建参数 / 契约 payload / 未调用对应方法”，但 T-B03 写的“用 page.evaluate 读取 mock 状态层”没有可用途径（plan 未暴露窗口钩子，也不应为测试新增），T-C04 / T-G03 也没写取证途径 | 改为读取 normal 场景下 mock 契约的持久记录 `fai.jobs.v1`（作业 / 介入 payload）以及介入历史界面；不新增窗口钩子 |
| TF-4 | T-E03 | e2e 要求“经 `agentClient.subscribe` 断言事件带 jobContext”，e2e 没有订阅途径 | 事件携带 jobContext 由 T-A17 单测断言（已有）；e2e 只断言回放可见、介入历史只多一条 |
| TF-5 | T-B04 | 没覆盖 plan §2.1“`/jobs/:id` 缺省 stage 时取作业当前阶段” | 加入完成标准与 e2e |
| TF-6 | T-B07 | 重跑后会立即用 success 脚本发起 run，脚本时长内就会完成；要断言“s 运行中、下游未开始”须冻结 / 推进时钟，原文未写 | 写明使用 Playwright 内置的 `page.clock` |
| TF-7 | 各任务的工程门；T-A10 / T-C01 / T-G04 的持久化完成标准 | AGENTS §2 第 6 步要求完成标准引用 AC 编号：工程门没有 AC 引用；持久化（spec §4 约束，没有独立 AC）也没写明这一点 | 工程门标“AC-009-1 部分前置”（全量命令包含 typecheck / lint / 生成物一致）；持久化标准写明“spec §4 持久化约束，无独立 AC；随 AC-009-1 全量回归”，与 AC-008-2 / AC-003-3 相关的部分保留引用 |

### R1-3 差距 / 歧义（plan 未写明、Tasks 已在 plan 意图内定案；不改 plan，待 A 确认）

| # | 来源 | 情况 | Tasks 的处理 |
|---|---|---|---|
| O-1 | plan §2.4 展示映射列表 | 只列了六张；AC-003-6（上传状态文案）、S-17（派生“内部生成”）、AC-001-1（类型文案）需要的映射没列，而 plan 又要求“徽标只消费契约文案，不另建映射” | 按同一机制补 `UploadStatusLabel` / `OriginLabel` / `JobTypeLabel`，不增加行为（T-A01） |
| O-2 | plan §2.4 类型表 | 没有单列分析结论 / 证据锚、派生值 lineage、阶段工作区结果、写回执的类型 | 按 spec R-004 / R-005 与 plan 已写的语义定义最小形态（T-A03 / T-A05） |
| O-3 | plan §1 所有权 vs §6 风险 | 所有权没有列出 frontend-workbench 既有的三份契约测试；但 §6 要求合并前其 `pnpm test` 通过，而这些测试硬编码了 v1 的版本号、方法数和键列表，契约 v2 必然使其失败 | T-A08 只改这三份测试中受 v2 影响的硬编码断言，保留全部 v1 语义——**需 A 确认这一最小解释是否在所有权内** |
| O-4 | plan §2.1 / §4.2 | 写了“页面入口或 v2 顶栏打开同一 IntakeDrawer”，但没写 v2 之前由谁挂载；v2 的 AppShell 也挂载后，作业页面会出现两个抽屉 | v2 之前由作业页面挂载，intakeStore 登记首个挂载的实例，只渲染一个（约 10 行；这是确定会发生的重复渲染，不是猜测的竞态）。§5.1 是否需要报 Walter，交 A 判断 |
| O-5 | plan §3 | 要求共享横幅显示持久化降级 / 不可读，但没写横幅如何得知状态 | `jobs/persistence.ts`（plan 指定的位置）提供只读状态订阅，不经业务契约（T-A10 / T-G04） |
| O-6 | plan §2.4 场景表 | 只定义了新增方法；v1 的十个方法在 job-* 场景下的行为没写 | 按 normal 行为（现有 mock 代码路径本来就如此），在 scenario 的 describe 中登记（T-A08） |
| O-7 | plan §2.4 / §4.7 | 作业已有 activeRunId 时又来一个带上下文的 send，如何处理没写（只写了 j-merge “期间不切换 runId”） | 不替换 activeRunId，其终态不合并 overlay（S-15，T-A17 正反例） |
| O-8 | spec §4 文件边界 vs plan §1 / §2.5 | spec 写“实现只改 frontend/（另有 README / .gitignore）”，plan 把 manual-acceptance.md 放在 `specs/workbench-interaction/` | checklist R2 I-04 已接受 plan 的所有权；Tasks 沿用（T-G08 / T-G10），不视为冲突 |
| O-9 | plan §4.7 | 要求 aborted 不合并，但前端没有 abort 脚本，也不应新增 | 单测在系统边界向状态层注入 AgentRunSchema 合法的合成 aborted 序列（T-A17） |
| O-10 | plan §2.4 “types.ts 或 job-types.ts” | 若另建 job-types.ts，会与 types.ts 循环导入（生成器只从 types.ts 读 `contractSchemas`） | 选 types.ts（tasks §1-6） |

### R1-4 覆盖、DAG 与命令层级（R1 状态）

- 46 / 46 条 AC 都在矩阵中，各有最终验收任务；三条外部阻塞（AC-003-1 / AC-005-5 / AC-007-4）的本地子项与 v2 子项分开写（C04 / E03 / G02 与 H01～H03）。
- 61 个任务、编号唯一、依赖全部指向更早的编号（无环）；全部带 v1 Handoff 外部闸门，H 组另带 v2 闸门；预估 96 h，单任务 1～2 h。
- 层级：schema / 状态层单测都只标“部分前置”；凡 spec 写“端到端”的 AC，最终命令都是 e2e；组件类 AC 用组件测试；静态类用 `check --only`；AC-009-2 的截图放在 Handoff 阶段的 T-G10，T-G08 只写清单。
- S-11～S-18 在 tasks §2 各有取舍、落点任务和验证；第 §3 节写明了范围边界。

### R1 结论

存在 7 项 Tasks 可修正问题（TF-1～TF-7），**R1 不通过**；先单独修订 tasks.md，再重新读取输入、重跑 Analyze。O-1～O-10 不需要改 plan / spec，作为待 A 确认的事项保留。

---

## Tasks 修订 r2（Analyze R1 之后，单独进行）

在 Tasks 角色（同一模型）下只处理 TF-1～TF-7，不改 spec / plan / checklist：原 T-A05 拆成 T-A05 / T-A06，原 T-A06～T-A23 顺延为 T-A07～T-A24；补依赖（B05←A17 / A20，C02←A23，F07←A20，G01←A20，G03←B03 / D02，G05←G04）；删除不相关的“部分前置”（A19 / F06 对 AC-005-6，G04 对 AC-007-3）；e2e 取证改为 normal 场景 `fai.jobs.v1` + 介入历史界面；E03 的 jobContext 断言改由 T-A18 单测承担；B04 补缺省 stage；B07 写明 `page.clock`；工程门与持久化标准补 AC 引用口径；矩阵“部分前置”与各任务的引用对齐。修订后 tasks.md SHA256 = `8c5c3e4a1c8fbaa7084a84aeb6305a8ace2803befb178ba1cdb868f462d022de`。

## R2（重新读取后重跑；对 tasks.md `8c5c3e4a…` 的发现）

- **重新读取**（2026-10-28，R2 开始时）：AGENTS.md §2、spec.md 全文、plan.md §1.1～§4（含方法表、动作矩阵、场景表、rerun 迁移表）、checklist.md §R4 结论、tasks.md r2 全文。
- **复核 TF-1～TF-7**：全部按修正方向落实。脚本复核：62 个任务、编号唯一、依赖无环；每个“部分前置”都是最终任务的祖先；每条完成标准都引用了 AC（或写明是 spec §4 无独立 AC 的约束）；完成标准与验证命令条数一一对应；单任务 1～2 h；全部带 v1 闸门，H 组另带 v2 闸门。
- **新发现（Tasks 可修正）**：

| # | 位置 | 问题 | 修正方向 |
|---|---|---|---|
| TF-8 | T-A17 完成标准 3 | 领域只读门的列举漏掉了“删除来源（removeUpload）”；plan §4.6 写的是“一切领域写方法”，列举不全会导致测试漏项 | 列举中补上删除来源，并写明 submitIntake 带已封存作业的 jobId 同样被拒 |
| TF-9 | T-G06 / T-G09 依赖 | 祖先检查发现 G06（静态与文档收口）和 G09（AC-009-1 最终全量）不以 T-B02、T-C04、T-D03 为祖先，“最终全量”可能被排在这些任务完成之前 | 给 T-G06 补依赖 T-B02、T-C04、T-D03（G09 经 G06 继承） |

- **R2 结论**：TF-8 / TF-9 未解决，**R2 不通过**；再单独修订 tasks.md（r3）后重跑。

---

## Tasks 修订 r3（Analyze R2 之后，单独进行）

只处理 TF-8 / TF-9：T-A17 完成标准 3 的只读门列举补“删除来源”和“submitIntake 带已封存作业的 jobId”；T-G06 补依赖 T-B02 / T-C04 / T-D03。修订后 tasks.md SHA256 = `fededb1b090823d63d342c01c36951ac3977bd96aa52f4cb7efd97262dd3a49f`。

## R3（重新读取后重跑；对 tasks.md r3 `fededb1b…`）

- **重新读取与校验**（2026-10-28T15:54+04:00）：spec / plan / checklist 原文 hash 与基线一致（`ed0f6c6c…` / `981ecc25…` / `56181b02…`）；tasks.md r3 页首修订记录、T-A17、T-G06 改动处；`git diff HEAD --stat` 只显示原有的 plan / checklist / README 三个未提交改动（README 只改了本 feature 一行），tasks.md / analyze.md 为新建的未跟踪文件。
- **复核 TF-8 / TF-9**：已落实。祖先检查：除 G07～G10 和 H 组外，所有实施任务都是 T-G06 与 T-G09 的祖先；T-G10 以 T-G09 为祖先；T-H04 以 T-H01～T-H03 为祖先。
- **全量结构检查（脚本、只读）**：62 个任务，编号唯一，依赖全部指向更早编号（无环）；46 / 46 条 AC 在矩阵中，与 spec 的 AC 集合完全相同；每个“部分前置”都是最终任务的祖先，矩阵与各任务的 AC 引用一致（AC-009-1 的工程门引用按矩阵说明处理）；每条完成标准都引用 AC 或写明“spec §4 约束、无独立 AC”；完成标准与验证命令条数一一对应；单任务 1～2 h，合计 96.5 h；62 / 62 带 `blocked_by: frontend-workbench-v1-handoff`，H 组 4 / 4 另带 `frontend-workbench-v2`；没有任务被标记完成或勾选。
- **新发现**：无。

### 1. 冲突 / 差距 / 歧义（最终状态）

> 【r5 注，新增于原文之外】本节为 R3 当时的状态（历史，原文保留；所引 T-A08 等为 r2 顺延前旧号，O-4 已被 A 否决并在 r5 移除）。当前状态与现编号见文末 Analyze R5。

| 类别 | 状态 |
|---|---|
| spec ↔ plan ↔ tasks 冲突 | **无** |
| Tasks 可修正问题 | TF-1～TF-9 已在 r2 / r3 修正并复核（发现过程见 R1 / R2，未删除） |
| plan 留白、由 Tasks 在 plan 意图内定案 | O-1～O-10（见 R1-3），不需改 plan / spec；**其中 O-3（T-A08 修改 frontend-workbench 既有三份契约测试中的硬编码断言）和 O-4（IntakeDrawer 单实例登记）请 A 明确确认** |

### 2. 46 条 AC 映射

- 43 条：本 feature 内有最终验收任务与命令（组件 / e2e / 静态，按 spec 写明的测试类型）；其中 AC-001-5、AC-006-1 的人工部分（M-01 / M-05）和 AC-009-2 的截图在 Handoff 阶段的 T-G10 完成，T-G08 只交付清单。
- 3 条含外部阻塞子项：AC-003-1（本地 C01 / C04 → 最终 T-H01）、AC-005-5（本地 A18 / E03 → 最终 T-H02）、AC-007-4（本地 A21 / G02 → 最终 T-H03）。v2 未解除前 Converge 必须报“未收敛（外部阻塞）”。
- schema / 状态层单测只作为“部分前置”，没有冒充 e2e；spec 写明“端到端”的 AC（001-3、002-2 / 3 / 4、003-1 / 3 / 5、004-2、005-3 / 5、006-3 / 4 / 6 / 7、007-2 / 3 / 4、008-2）的最终命令都是 `test:e2e e2e/jobs/...`。

### 3. 任务 DAG 与命令层级

- A（契约 / mock 状态层 / 路由 / 徽标 / diff，24 个）→ B / C / D / E / F（界面，24 个）→ G（收口，10 个）→ H（v2 集成验证，4 个）。
- 命令全部使用 frontend 的真实脚本名（`contract` / `check --only` / `typecheck` / `lint` / `test:unit` / `test:e2e` / `test`），测试路径限定在 `tests/{unit,component}/jobs/**` 和 `e2e/jobs/**`，标题前缀 `WI AC-…`，避免与 frontend-workbench 同编号 AC 混跑。T-A09 故意运行三份既有契约测试的全文件，用来证明 v2 没有破坏 v1。
- 全量 `pnpm -C frontend test`（T-G09）与人工验收执行（T-G10，Handoff 阶段）分开；T-G08 的清单只写步骤和截图输出路径，不声称已有截图。

### 4. 边界与 S-11～S-18

- 范围边界见 tasks §3：不做真实解析 / 抓取 / 闸门 / 验证队列 / 格物致知 / 蒸馏 / D-019 角色与成本 / N+1 撤销 / 自动定稿；六类块的 v1 编辑边界；产物 confirmed 与交付物 final 分开；定稿不自动、不可撤销。壳方文件（app/{nav,router,Rail,TopBar,AppShell}、WorkbenchPage、agent UI / store）没有任何任务修改；H 组只写集成测试。
- S-11～S-18 在 tasks §2 各有确定取舍、落点任务和正反例验证：S-11 literal-object 映射 schema（不改生成器）；S-12 按 artifactKind 判别的修订载荷（deliverable 保留 `blocks`）；S-13 `Job|null` 与 not_found 分开；S-14 失败以 conflict + reason 呈现；S-15 带上下文的 send 关联 activeRunId，不带上下文不改作业，上下文不漂移，事件不重复；S-16 kind 为 v1 子集并注记；S-17 派生来源徽“内部生成”并保留来源 / 作者；S-18 判别联合 + 一次 superRefine，在契约边界完成。S-11～S-18 是否“关闭”由 A 判定。

### 5. 依赖闸门结论

- **implementation_base_sha: PENDING**。frontend-workbench v1 在 2026-10-28T15:31+04:00 首次只读核对时：HEAD `0ffa15e` 只在 `feat/frontend-workbench`（及其远端跟踪分支）上，未合入 main / origin/main；`review.md` 未跟踪，结论“未通过”（P2 R1-01），Gate 2 未批准，不是 Handoff。15:56 复核（见 R4）：分支已前移到 `b991059`，Review 第二轮通过（无 P1 / P2），但 Gate 2 仍未批准、未 PR / merge、未合入 main。该证据有局限（分支会移动、报告会变化），只说明“当前未满足”。
- frontend-workbench v2：Gate 1 未批准，没有壳方交付，H 组不能验收。
- `api` 不是 mock 验收的前置条件。

## 最终结论（R4）

> 【r5 注，新增于原文之外】这是 R4 当时的结论（历史，原文保留），已被 Checklist R5 的 B-11 与本报告 Analyze R5 取代；当前结论见文末。

- **文档一致性**：spec v1.1 / plan / tasks r3 之间**没有未解决的内部冲突**；R1 / R2 的 9 项 Tasks 可修正问题已在 r2 / r3 修正并复核；O-1～O-10 为 plan 留白在 Tasks 中的定案，待 A 复核（尤其 O-3、O-4）。**待 A 复核。**
- **可开工**：**否。Implement BLOCKED：缺 frontend-workbench v1 Handoff SHA**（implementation_base_sha = PENDING）；另需 A 在新会话复核 tasks.md（V-02）与本报告（I-01b）并补勾 checklist。H 组另被 frontend-workbench-v2 阻塞。
- **已实施 / 已验收**：**均为否**。没有写代码，没有运行任何产品测试，没有截图；本报告不表示任何 AC 已通过，也不表示已收敛。

---

## Tasks 修订 r4 与 R4 复核（外部证据更新）

- **触发**：R3 收尾核对时发现前端仓库在本会话期间前移（15:56 只读复核）：`feat/frontend-workbench` HEAD `b9910594bcb0fbc68a0f37139cfbe95a035d644a`（T-16 修复 R1-01、T-17 Converge、提交 review 第二轮）；`review.md` 现已跟踪，第二轮结论“通过，新增 P1 = 0、P2 = 0”，但页首仍写“不是 Handoff；Gate 2 尚未批准”，未 PR / merge；HEAD 不是 `main`（`85c6cbb`）或 `origin/main`（`3bf6476`）的祖先；`CONTRACT_VERSION` 仍为 1.0.0，tasks §0 所列的既有测试硬编码事实（方法数 12、fixture 9 个、`contractVersion: '1.0.0'`）未变。
- **r4 修订**（Tasks 角色）：只更新 tasks §0 的证据表（标注两次核对时间，新增“复核（15:56）”一行），任务、依赖、AC 和命令都不变。修订后 tasks.md SHA256 = `98d080d3c4a92d767568eed93a204dd2ed73b19a9d341a86b2731c35fa4740fc`（r4，**本报告的最终审查对象**；与 r3 只差 §0 证据表）。
- **R4 复核**：重新读取 tasks §0 与页首修订记录；结构脚本复跑结果与 R3 相同（62 个任务、无环、46 / 46 AC、部分前置均为最终任务的祖先、完成标准均引用 AC、条数一一对应、闸门齐全）；spec / plan / checklist hash 未变。新发现：无。依赖闸门结论不变：**仍缺 Gate 2 批准与合入 main 的 Handoff commit**，implementation_base_sha 保持 PENDING。

---

## Tasks 修订 r5（Checklist R5 之后，单独进行）

- **触发**：Checklist R5（A = claude-fable-5-1 via anthropic，新会话）结论“未通过（定向）”：V-02 / I-01b 已勾；唯一阻断 **B-11**（P-1 / AGENTS §5.1：tasks 中 IntakeDrawer 的“首个挂载实例登记 / 卸载释放”是未经 Walter 同意的运行时复杂度，且有零逻辑替代）；O-3 接受（附 S-20），**O-4 否决**；S-11～S-18 判为 Tasks 层关闭（非实现）；另有非阻断建议 S-19～S-24。
- **r5 修订**（Tasks 角色；plan 仅 S-20 两处）：按 A 建议 (a)，**不请求、也不声称 Walter 批准**——完全删除登记机制：tasks §3 改为“v2 前 `JobListPage` / `JobDetailPage` 互斥路由视图各自挂载同一 IntakeDrawer；v2 AppShell 挂载后由 T-H01 从这两个本 feature 自有页面文件移除页面级挂载，不改 `app/**`”；T-C01 标题 / 修改范围 / 完成标准 3 / 命令 3 去登记，只留 metadata only 隐私断言，`stores/intake.ts` 不含实例登记；T-H01 修改范围加移除两页临时挂载，标准 1 断言只渲染一个抽屉，补工程门（标准 2 / 命令 2）；H 组标题、T-H01 上下文、§6 DAG 说明改为“只清理本 feature 页面级挂载 + 集成验证、不改壳方”。同批：S-19（T-A09 `jobScenarios` 声明句 + T-A09 标准 2 + T-G06 断言）、S-20（plan §1 唯一修改者行、§6 回滚块各补“既有 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受契约 2.0.0 影响的硬编码断言（仅 T-A09，保留 v1 语义）”）、S-22（tasks §7 实施期超 2 h 拆分提醒）、S-23（§2 S-15、T-A18 修改范围与标准 3）、S-24（T-A17 标准 2）；§0 增“r5 说明”行（未重新核对前端，仅核对时事实）。S-21 在本报告处理（见下）。修订后 tasks.md SHA256 = `2d1f550862efb62912d977e3d574be76afe85972ad4da79b454775b85b777f39`；plan.md `981ecc25…81d21` → `2623f32ba54fe7d95c4b2247bc1356f952094e5fe1726dea0d6f69936ed09fc5`。

## Analyze R5（只读；Tasks 修订 r5 之后的分析，区别于 Checklist R5；待 A R6）

> **阶段记录（脱敏）**：角色 = Analyze；Analyze = **claude-opus-5-5 via anthropic**；基线 `8bd1b31`（无新提交）。继承本限额窗口前轮通道证据（`claude-bridge` quota / rate / spend_limit 类已耗尽，exit 1；`anthropic/claude-opus-5-5` 可用），**未重探 bridge、未换模型、未改 provider / 路由 / 配置**。本报告**不改设计、不是审核结论**，不勾选 checklist。

### 重新读取与输入

- **Analyze 阶段开始时重新读取**（2026-10-28T16:19+04:00，Tasks 修订完成之后另起本阶段，不依赖修订时的会话记忆）：AGENTS.md（§2 第 6～11 步、§5）、`docs/interaction.md` §3.3（旁路 / 检查点，核 S-23 口径）、`docs/plan.md`（本会话 Tasks 修订开始时已全文重读，本阶段只核 hash 未变）、spec.md（R-001～R-009、46 条 AC、§4 文件边界）、plan.md（§1 所有权 / §6 回滚的 S-20 两处及其上下文、§1.1、§2.1、§4.6 / §4.7）、checklist.md 当前 §R5（结论、B-11、O-1～O-10 裁定、S-11～S-18 复核、S-19～S-24、P-1、最小关闭要求）、tasks.md r5（页首 / §0～§3 / T-A09 / T-A17 / T-A18 / T-C01 / T-G06 / H 组 / §5～§7，结构项全文脚本复算）、本报告全文。
- **输入原文 SHA256**：spec.md `ed0f6c6c3e50b93166a02880df574e6f167a5773829ec0ab8d3ddcf269f942d9`（未变）；plan.md `2623f32ba54fe7d95c4b2247bc1356f952094e5fe1726dea0d6f69936ed09fc5`（仅 S-20 两处）；checklist.md（当前 R5）`a6cf37f05beb93384ae02a21e0950aa21492806aa1dc7d9dfa8efb55509a5380`（只读、未改）；tasks.md r5 `2d1f550862efb62912d977e3d574be76afe85972ad4da79b454775b85b777f39`；specs/README.md `18f95dba08eec8d9a42c8fc75a1c8e513f09cd9377cc15cf6e8f1647fe1b0385`（仅本 feature 行）；AGENTS.md `9072b401…12a16`、docs/plan.md `f01b1f58…8439c`、docs/interaction.md `8c5ed00a…a18`（只读）。本报告追加前 `c97f6cad…2259b`（本报告自身的新 hash 见交付回复）。
- **未执行**：未安装依赖、未运行应用或产品测试、未启动其他 agent、未读凭证或全局配置、未改 spec / checklist / docs / 代码 / 其他 feature、未 commit / push / merge / 切分支；未重新核对前端仓库（tasks §0“r5 说明”）。结构复算用一次性 Python 脚本只读完成，不是产品测试。

### 1. B-11 移除核对

| 位置 | r5 状态 | 判定 |
|---|---|---|
| tasks §3 IntakeDrawer 挂载 | v2 前两页互斥路由视图各自挂载；v2 后 T-H01 移除页面级挂载；明写“不设任何首个挂载者登记 / 单实例登记 / 卸载释放运行时机制，`intakeStore` 不含实例登记” | 与 A 建议 (a) 一致 |
| T-C01 | 标题改“页面级抽屉挂载”；修改范围无“单实例登记”，`stores/intake.ts` 注明不含实例登记；标准 3 只剩 metadata only 隐私断言（spec §4 约束，随 AC-009-1）；命令 3 = `-t "WI metadata only"` | 与 (a) 一致；标准↔命令仍 4:4 |
| T-H01 | 修改范围含移除 `frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 的页面级挂载（本 feature 自有，`jobs/**` 内），明写不改 `app/**` / `workbench/**`；标准 1 断言三处入口同一流程且同一页面只渲染一个抽屉（AC-003-1 最终）；标准 2 工程门（AC-009-1 部分前置，v2 后 T-H04 复验）；命令 1 e2e、命令 2 `typecheck && lint` | 与 (a) 一致；2:2；依赖 / 预估 1 h 不变 |
| H 组表述 | 标题、T-H01 上下文、§6 DAG 说明 = “只清理本 feature 页面级抽屉挂载 + 集成验证，不改壳方”；H02～H04 范围不变（只扩 e2e / 复跑） | 未扩范围 |
| 残留扫描 | 任务正文（§4）中“单实例 / 首个挂载 / 卸载释放 / single drawer”0 处；§3 只在“不设任何……运行时机制”否定句中出现；“实例登记”只出现在否定句（§3、T-C01“不含实例登记”）；修订记录 / 阶段记录中的提及均为删除说明 | 已清除 |

运行时复杂度净减少（删除约 10 行登记逻辑），未新增任何机制。附带观察（非问题）：v2 壳方挂载合入集成分支到 T-H01 完成之间会有一段双挂载窗口，按 plan §1.1 接线顺序与 AGENTS §6 规则 7（集成人串行合并）由 T-H01 收口，T-H01 标准 1 断言最终状态；不为此加任何防线。Checklist R5 V-02 中“H 组只写集成测试”一语对应的是 r4 文本；r5 的 H01 页面清理正是 A 在 B-11 (a) 中指定的改动，留待 A R6 确认。

### 2. S-19～S-24 核对

| # | 落点 | 判定 |
|---|---|---|
| S-19 | T-A09 修改范围：`jobScenarios` 明写“CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准”（不改生成器）；T-A09 标准 2 含该句（命令 2 `WI change note`）；T-G06 修改范围断言该句（标准 2 / 命令 2 `contract-doc.spec`）；tasks §0 生成器条目指向 S-19 | 已落实，不改生成器 |
| S-20 | plan §1 唯一修改者行、§6 回滚块各补一处；tasks §1-5 引用 S-20；未动 plan 其他机制、页首或其他段落 | 已落实；所有权 = 回滚块在该文件集上成立；属 A 接受 O-3 后的所有权澄清，不是新需求，不影响 spec / Gate 1 |
| S-21 | 本节下方“当前状态表”用现编号；R1-3 / R3 / R4 原文保留，仅在「最终状态」「最终结论（R4）」下各插一行历史注、页首改指向本轮 | 已落实 |
| S-22 | tasks §7 增实施期超 2 h 拆分提醒（按 AGENTS §2 第 9 步追加任务并记录，不改 AC / 范围），不预先重拆 | 已落实；62 任务不变 |
| S-23 | tasks §2 S-15 与 T-A18：activeRunId 终态后置 null，仍在运行的第二个带上下文 run 不接任、其终态不合并 overlay；一句写入 `SendMessageSchema.jobContext` describe；T-A18 标准 3 / 命令 3（`WI no context`）承担正反例 | 已落实；与 plan §4.7“仅匹配 pendingRunId 的终态才合并”、interaction §3.3 旁路一致；无调度 / 接任逻辑 |
| S-24 | T-A17 标准 2：原子性测试调用 T-A10 的真实 `commit(mutator)`，测试 mutator 先改 working copy 再抛错，或写入不合 schema 的值触发真实边界校验失败，随后经 `getJob` / `getStageWorkspace` / `listInterventions` 验证原状态不变；不复制 commit 算法、不加生产故障开关 / 注入框架 | 已落实；符合 AGENTS §5.6 |

### 3. 当前状态表（现编号；取代 R3「最终状态」中的旧号）

| 项 | A 裁定（Checklist R5） | 当前落点（现编号） |
|---|---|---|
| O-1 Label 补齐 | 接受 | T-A01 / T-A23 |
| O-2 最小形态 | 接受 | T-A03 / T-A05 / T-A06 |
| O-3 既有三份契约测试硬编码（R1 写作 T-A08） | 接受（附 S-20） | **T-A09**；plan §1 / §6 已登记 |
| O-4 IntakeDrawer 单实例登记 | **否决 → B-11** | **已移除**：tasks §3 / T-C01 / T-H01 按 (a) |
| O-5 持久化状态订阅（R1 写作 T-A10） | 接受 | **T-A11** / T-G04 |
| O-6 v1 十方法在 job-* 场景按 normal（R1 写作 T-A08） | 接受 | **T-A09** describe |
| O-7 第二个上下文 send 不替换（R1 写作 T-A17） | 接受（附 S-23） | **T-A18** + §2 S-15 |
| O-8 manual-acceptance 位置 | 接受 | T-G08 / T-G10 |
| O-9 aborted 系统边界注入（R1 写作 T-A17） | 接受 | **T-A18** |
| O-10 schema 放 types.ts | 接受 | tasks §1-6 |
| TF-1～TF-9 | — | r2 / r3 已修正（历史见 R1 / R2；R1 TF-4 所称 T-A17 即现 T-A18） |
| S-11～S-18 | Tasks 层关闭（非实现） | §2 各行与落点任务未回退（S-15 仅增 S-23 一句） |
| B-11 | 阻断（P-1 未勾） | r5 已按 (a) 修正，**待 A R6 判定是否关闭**（本报告不判） |

### 4. 结构复算（脚本、只读）

- 62 个任务、编号唯一、合计 96.5 h、单项 1～2 h；依赖全部指向更早编号（0 例外，无环）；62 / 62 状态“未开始”、带 `blocked_by: frontend-workbench-v1-handoff`；H 组 4 / 4 另带 `frontend-workbench-v2`，非 H 组 0。
- 完成标准↔验证命令逐任务条数 1:1（0 例外；T-H01 2:2、T-C01 4:4）；每条完成标准含 AC 引用（0 例外）。
- 矩阵 46 行，AC 集合与 spec 完全相同；“部分前置”均为最终任务祖先（0 例外）；T-G06 / T-G09 以全部 A～F 任务为祖先；矩阵未改（AC-003-1 仍 C01 / C04 → T-H01；T-H01 工程门按矩阵 AC-009-1“每个任务的工程门”口径，由 T-H04 复验）。
- spec 标“端到端”的 AC 最终命令全部为 `test:e2e e2e/jobs/…`；`-t` / `-g` 标题 182 条均以 `WI` 开头（另 2 处为 §1 命令形态占位符）；单测 / e2e 命令全部限定 jobs 路径，唯一例外仍是 T-A09 命令 3 有意整文件跑三份既有契约测试。
- 任务修改范围中无壳方文件（`src/app/**`、`WorkbenchPage`、agent store / UI）被列为修改对象。

### 5. 未回退核对

- spec / checklist hash 未变；plan 只多 S-20 两处文字，方法集、动作矩阵、九场景表、样例表、rerun 迁移表、§4.5～§4.7、§3 持久化规则、§1.1 基线均未动。
- tasks 未改 spec 行为 / AC；B-09（`SourceNote.publishedAt`：T-A03 / T-C04 / T-G06）、B-10（`Deliverable` 判别联合 + 三锚 + `DeliverableStatusLabel` + 原子定稿 + 头部“已定稿 vN · 时间”：T-A04 / T-A08 / T-A17 / T-F01 / T-F07 / T-G06）原样；D-018 scope（不自动定稿、无反向方法、v1 只做①、不做验证队列 / 格物致知 / 蒸馏 / D-019）原样。
- 未新增未经批准的运行时复杂度或猜测性安全防线：B-11 是删除；S-23 是规则口径；S-24 不加生产开关；S-19 / S-20 是文档 / 所有权文字。

### 6. 结论（Analyze R5）

- **新发现**：无。spec v1.1 / plan（S-20 后）/ tasks r5 之间**无内部冲突、差距或歧义**；Checklist R5 的 B-11 已按 A 建议 (a) 在 Tasks 层修正，S-19～S-24 已最小落实，S-11～S-18 未回退。**内部一致性通过，待 A 新会话 R6 定向复核**（B-11 是否关闭、P-1 是否补勾由 A 判定，本报告不自宣关闭）。
- **可开工**：**否。Implement BLOCKED：缺 frontend-workbench v1 Handoff SHA**（implementation_base_sha = PENDING；最后核对事实为前端 `b991059` Review 第二轮通过但 Gate 2 / Handoff 未批准、未合入 main，仅核对时事实）；另需 R6 补勾 P-1。H 组另被 frontend-workbench-v2 阻塞；AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项解除前 Converge 必报“未收敛（外部阻塞）”。
- **已实施 / 已验收**：**均为否**。没有代码、没有运行任何产品测试、没有截图。
