# Feature: workbench-interaction Analyze 报告（analyze.md）

> Analyze 阶段产物（AGENTS §2 第 7 步）：只读报告 spec.md / plan.md / tasks.md 之间的冲突、差距与模糊之处。本报告**不修改** spec / plan / checklist；发现的 Tasks 可修正问题先在 R1 结束只读报告，再单独修订 tasks.md，然后重新读取输入、重跑（R2）。R1 的发现原样保留，不因修订而删除。
>
> **阶段记录（脱敏）**：角色 = Analyze；Analyze = **claude-opus-5-5 via anthropic**。通道说明同 tasks.md 页首：沿用本限额窗口 R3 的探活证据（`claude-bridge/claude-fable-5-1` 失败，quota / rate / spend_limit 类，exit 1；`anthropic/claude-opus-5-5` 已真实探活并完成 Plan 补正）；本阶段**未发起 claude-bridge 调用，也未单独探活 bridge-opus**，未改 provider / 路由 / 配置。
> **当前结论补记（2026-10-29 r6.6.1 范围精度）：见文末「Analyze R12.1」**——只补 T-A11 / A12 / A13 对本 feature 自有 `tests/unit/jobs/real-stubs.spec.ts` 的“`requests` 表追加本任务新增方法键”写入许可；需求 / 方法 / 标准 / 命令 / 结构不变，R12 其余结论有效。
> **当前结论（2026-10-29 第三批开工前精度澄清 r6.6）：见文末「Analyze R12」**
> - **本轮**：只为第三批 T-A11 → T-A12 → T-A13 → T-A22a（4 项，约 7 h）补既有 what / AC 的机制与类型精度（plan §2.3 / §2.4 / §3【r6.6】，四个任务的修改范围【r6.6 精度】）。冻结 spec / 46 AC / 方法集 / 动作矩阵不变，不回 Clarify；67 个任务 / 约 102 h / 224 ↔ 224 / 依赖不变。
> - **硬约束文字**：唯一触及处 = 持久化白名单补列既有可选字段 `quarantineReason`，另新增内部 `mappingHistory`。隐私边界实质不变，提请第三批独立代码 Review 明确核对。
> - **进度**：16 / 67 已完成、51 未开始，本批 4 项仍待实施；feature **未收敛**；46 AC 最终验收 0；H-x 无一已交付。
> - **不是** Review / Gate 2 / Handoff。
>
> 【历史原文】**当前结论（2026-10-29 第二批实施后 Converge batch2）：见文末「Analyze R11」**
> - **前置**：Checklist R8.1 已通过（`34d339e`），第二批据此开码。
> - **本批**：T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24 已实施（代码 `34d339e..27e59e6 -- frontend`）。Converge 判本批范围**已收口、待本批独立代码 Review**；实施中定形的最小接口只是精度，已同步 plan / tasks / interface-handoff（r6.5），不是需求变更，未新增任务。
> - **feature 整体**：**16 / 67 已实施、51 未开始**，**未收敛**（尚未实施 + H 组外部阻塞）；46 AC 最终验收 0；H-x 无一已交付（H-2·标签 / H-3 / H-4 具备 ①②③ 中的 3 / 4，③ 待审核；H-1 维持原登记）。
> - **上游**：main 已到 `072bb12`（v2 S0），本批仍 pin `90187f7`、未导入，需按 tasks §7 决定是否重核。
> - **不是** Review / Gate 2 / Handoff。
> 【历史原文】**当前结论（2026-10-29 Checklist R8 后 r6.4）：见文末「Analyze R10」**——按 Checklist R8 唯一 P2 B-12 拆出 T-A09b（R-B fixture-only，0.5 h），T-A10 恢复核心 2 h；67 任务 / 约 102 h、224 / 224；需求未变、无新机制；第二批 6 项约 7 h，待 A 新会话 R8.1 增量复核前 blocked；本报告不宣布 B-12 关闭。R9（r6.3）为历史记录。
> 【历史原文】**当前结论（2026-10-29 首批实施后）：见文末「Analyze R8」**——首批 T-A01～T-A09a（10 / 66）已实施（代码 diff `8753fa9..13a3373`），Converge 判本批范围已收口、待独立 Review；实施中的字段定形只是既有需求内的类型精度，已同步 plan / tasks（r6.2），不是需求变更；feature 整体**未收敛（尚未实施 56 项 + H 组外部阻塞）**；46 AC 最终验收 0；H-1 具备 ①②③、④ 未取得（未交付），其余 H-x 未交付；不是 Review / Gate 2 / Handoff。
> 【历史原文】**当前结论（2026-10-28 r6.1 开工前）：见文末「Analyze R7」**——r6.1 只吸收 Checklist R7 建议范围内的措辞 / 断言精度（S-27～S-32），需求与结构不变，内部一致性通过；IMPL-GATE-R6 三项已满足（R7 `9acf3de`、Walter“允许”、集成人 / 工作树登记），实现分支带入本规格后即可按 DAG 开工首批 T-A01～T-A09 / T-A09a；H-x 全部未交付；未实施、未验收、未收敛。
> 【历史原文】**当前结论（2026-10-28 恢复轮）：见文末「Analyze R6」**——r6 内部一致性通过，待 A 新会话定向复核（Checklist R7）；`implementation_base_sha = 43b6d79`（v1 Handoff 合入 main 的基线门已满足）；Implement 仍 BLOCKED（IMPL-GATE-R6：A R7、Walter 代码授权、集成人 / worktree 登记）；H-1～H-6 / 页面切片全部未交付；未实施、未验收、未收敛。
> 【历史原文】当前结论：见文末「Analyze R5（Tasks 修订 r5 之后；区别于 Checklist R5）」——内部一致性通过，待 A 新会话 R6 定向复核；Implement BLOCKED：缺 frontend-workbench v1 Handoff SHA（另 P-1 待 R6）；未实施、未验收、未收敛。（R6 已于其后通过，见 checklist §R6。）
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

---

## Analyze R6（只读；plan r6 / Tasks r6 / interface-handoff.md 之后，2026-10-28 恢复轮；区别于已通过的 Checklist R6；待 A R7）

> **阶段记录（脱敏）**：角色 = Analyze；Analyze = **claude-opus-5-5 via anthropic**。本窗口协调器真实探活：`claude-bridge/claude-opus-5-5` exit 1（quota / rate / spend_limit 类，原文未保存），同模型 `anthropic` 最小调用 exit 0；按 AGENTS §6 规则 2 / 5 只换通道、本窗口不重试 bridge，未改 provider / key / 全局配置。本报告**不改设计、不是审核结论**，不勾选 checklist；R6 的 26/26 只覆盖 r5 设计，r6 新增内容须 A 新会话定向复核（R7）。
> **历史措辞与当前状态**：本文件页首与 R1～R5 各节中的“待 A R6”“implementation_base_sha = PENDING”“v2 待 Gate 1”等，以及 tasks.md §0.1 / 旧页首、plan.md §1.1 / §7 原文中的同类措辞，均为当时原文，**以本节与 tasks.md 页首“当前状态（r6）”块为准**。

### 1. 重新读取与输入

- **本阶段开始时重新读取**（不依赖 Plan / Tasks 修订时的会话记忆）：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`、HANDOFF.md、spec.md 全文（v1.1，46 AC）、plan.md 全文（r6）、tasks.md 全文（r6，分段读取 + 脚本复算）、checklist.md 页首与 §R6、本报告全文、新建 `interface-handoff.md`、`docs/interaction.md` §3.2～§3.7 / §7、`docs/designUI.md` §2.4 / §3、D-018。
- **实施基线只读目录** `D:/2030/Futures-AI-interaction-base-43b6d79`（detached HEAD `43b6d79681a49562f41751368b2ae00c24062f56`）：`specs/frontend-workbench/review.md` §0 / §4～§9、`tasks.md` P3 台账（H-01 / H-02）、`manual-acceptance.md` 勾选状态；`frontend/package.json`、`vitest.config.ts`、`playwright.config.ts`、`tests/setup.ts`、`scripts/{check,contract-build}.mjs`、`src/contracts/{types,client,methods,index}.ts`、`real/index.ts`、`mock/index.ts`、`mock/agent/*.ts`、`src/agent/{events,store}.ts`、`src/design/{theme.ts,glass.css}`、`src/main.ts`、`src/app/{router,nav}.ts`、`AppShell.vue`、`tests/unit/{mock,contracts,contract-doc}.spec.ts` 相关行、`tests/component/focus-band.spec.ts` 场景切换写法；`git diff 8af343f 43b6d79 -- AGENTS.md docs specs/README.md`。
- **v2 只读参照** `D:/2030/Futures-AI-interaction-v2-ref-ded7161`（`ded716100381fcd2b4b5d3481f4f56e44c9869fd`）：HANDOFF.md、`specs/frontend-workbench/plan.md` §7.0～§7.14、`tasks.md` v2 §1.1 / §1.2 / §2～§5 与 T-V2-01～T-V2-09、`specs/README.md` 状态行与跨 feature 行。Gate 1 按 v2.1 已批准处理，不采信历史“待批”字样。
- **输入指纹**（LF 归一化 SHA256，避免 autocrlf 造成的原始字节差异；审查以协调器提交后的固定 SHA 与真实 diff 为准）：spec.md `ed0f6c6c3e50b93166a02880df574e6f167a5773829ec0ab8d3ddcf269f942d9`（与 R6 相同；`git diff 8af343f -- spec.md` 为空）；checklist.md `ae78b657221dbbaf3612a7ae83a5489f705c4b98562d23546ba9e5d30cac30e0`（与 R6 相同、未改）；plan / tasks / interface-handoff / specs/README 的 r6 指纹见交付回复（本报告不含自身指纹）。
- **未执行**：未安装依赖、未运行应用 / 构建 / 产品测试、未启动服务或其他 agent、未下载、未读凭证或全局配置；未改 spec / checklist / HANDOFF / docs / frontend / backend / shell / 其他 feature 或其他 worktree；未 commit / push / PR / merge。结构复算用 `python -` 标准输入一次性脚本只读完成；为避免长命令被截断，Tasks / Plan 修订时在本会话独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-resume-01a18388-dmiq93ec/` 写过几份替换片段（非项目产物，不入库）。

### 2. 实施基线审计（详表见 tasks §0.0 B-1～B-11）

- `43b6d79` 是 PR #7 的 merge commit（父提交 `3bf6476` + `eba5002`），本会话目录 HEAD 与之一致；协调器实查 MERGED 且为 origin/main 祖先（即 origin/main 本身）。**v1 Handoff 合入 main 的基线门已满足**，已登记 `implementation_base_sha`；实现分支尚未建立、代码未同步，这不等于可开工。
- 前端事实与 r5 §0 / 任务文字一致：脚本名与 `test` 串联、`check --only` 六项、vitest / playwright 配置、生成器表驱动与 §4 / §5 静态文案、real 桩、fixture 9 个且 glob 不递归、`CONTRACT_VERSION='1.0.0'`、`events.ts` 共享 `eventFields`、mock `send` 预算事件后逐个 `setTimeout` 直接投递、`fai-dark` 主题、`.glass-drawer`、`main.ts` 应用级订阅写法、nav 无 `jobs`。
- **唯一实质差异**：`tests/unit/mock.spec.ts:96-99` 把 `Object.values(dataMethods)` 与十个 `dataRequests` 结果按索引配对，方法数增加后会失败；r5 未点名。已在 T-A09 修改范围落实（仍属 S-20 登记的三份既有契约测试硬编码断言，不扩所有权）。另登记两项非差异细节：`restoreMocks: true`；`43b6d79` 路由表无 `jobs` 占位（v2 前 `addRoute` 为新增）。
- v1 遗留：H-01 / H-02 未经 Walter 处置、M-01～M-08 人工勾选未签字、11 项 P3 接受为后续——按要求只登记（interface-handoff.md §6），不代批、不升级为本 feature 硬阻塞；H-02 只影响 960 视口截图观感，不改变本 feature AC 判据。
- 文档：AGENTS / architecture / interaction 相同；`docs/plan.md` D-015 正式行、`designUI.md` D-015 作用域与指针、新 ADR `20261027-updown-scope.md` 对本 feature 无设计影响（不用涨跌色、不新增色值 / 玻璃）。未改权威文档。

### 3. 需求是否变更

- spec.md 无改动；46 条 AC、R-001～R-009 行为、§2 非目标、§4 文件边界均未触及。
- 逐项对拍（interface-handoff.md §2）把 v2 的消费要求分为“已覆盖 / 缺口”。全部缺口都落在既有需求与既有 plan 意图内：jobsStore 共享缓存与统一刷新是 plan §2.3 “写回执 / agent 通知后重新读取”的机制落地（本 feature 自己的待合并、重跑、改稿 e2e 本就依赖）；`ACTIVE_JOB_STATUSES` 是对既有 `JobStatus` 的分组口径，属 R-008 契约扩展与 plan §1 “v2 契约字段需求由本 feature 写入”；sessionStore 守卫、intakeStore 接口、IntakeDrawer 容器、待归属池位置、`jobFixtures` 语义、fixture 初始收件箱条目都是对已有组件 / 方法的机制精度。
- **结论：无需求变更，无需回流 Clarify / 重过 Gate 1，没有 blocked 待协调器上报的需求问题。** 需要 A 判断的设计取舍集中在：T-A18 拆出 T-A09a（H-1 不再等状态层）、`failed` / `draft` 计入进行中、H-4 无公开 setter、`jobFixtures` 有覆盖时不读写本地快照、`main.ts` 增加 jobsStore 订阅、jobsStore 只对带 `jobContext` 的终态事件刷新。

### 4. 一致性（spec ↔ plan ↔ tasks ↔ interface-handoff）

| 检查 | 结果 |
|---|---|
| plan §2.3 jobsStore / intakeStore / sessionStore 行与写后统一刷新段 ↔ tasks §1-9、T-A22a / T-A22b / T-C01 / T-C01a / T-C02 / T-C03 / T-G02 | 一致（方法名、刷新时机、写失败不刷新、无竞态防护） |
| plan §2.1 `registerJobRoutes` + `afterEach` ↔ T-A22（路由）/ T-A22b（守卫）/ T-B04（缺省 stage 用 `router.replace`） | 一致 |
| plan §2.4 `ActiveJobStatus` 行 ↔ T-A01 标准 1；`JobListItem` 字段 ↔ T-A02 | 一致 |
| plan §2.4 `jobFixtures` 语义 ↔ T-A07（按场景集合分键）/ T-A09（解析）/ T-A10（建状态、缺工作区 → 空工作区）/ T-A11（有覆盖时只在内存） | 一致 |
| plan §2.3 初始收件箱条目 ↔ T-A21 标准 5 ↔ T-G02 e2e 前提 | 一致 |
| plan §1 / §6 `main.ts` 作业注册内容 ↔ tasks §1-5 ↔ interface-handoff §3 | 一致 |
| tasks §2a 切片 → 任务映射 ↔ interface-handoff §1 / §2 ↔ §6 “最早可交接点” | 一致；T-A09 单独不等于 H-1（已明写）；H-1 由 T-A09a 提供，T-A18 复跑 H-1 测试 |
| interface-handoff §3 公开接口 ↔ v2 plan §7.3 / tasks §1.2 字面要求 | 覆盖全部条目；“名称以交付 commit 为准”保留 v2 自己的规则 |

**本轮修订过程中自查发现并已修正（修正后重新复算）**：

- AR6-1（依赖倒置）：T-A09 新增的 `jobFixtures` 标准起初断言“会话列表含该项”，而 `listJobs` 要到 T-A10 才存在。已改为 T-A09 断言解析结果、T-A10 标准 2 断言 `listJobs` 返回覆盖集合。
- AR6-2（编辑事故）：Tasks 修订时一次替换把 §2a 表格截断并吞掉了 §3 标题，已立即用完整内容恢复；复算确认 §0～§7 标题与 §3 原文完整。

### 5. 结构复算（脚本、只读，作用于 r6 最终文本）

- **66 个任务**、编号唯一、排序规则“T-Xnn < T-Xnna/b < T-X(nn+1)”成立，依赖全部指向排序更早的任务（0 例外，无环）；合计 **101.5 h**（A 27·42.5 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4），每项 1～2 h。
- 66 / 66 状态“未开始”且 `blocked_by: IMPL-GATE-R6`；H 组 4 / 4 另带 `frontend-workbench-v2`，非 H 组 0。
- 完成标准 220 条 ↔ 验证命令 220 条，逐任务 1:1（0 例外）；每条完成标准含 AC 引用（0 例外）；编号连续。
- 矩阵 46 行，AC 集合 = spec；“部分前置”均为最终任务祖先（0 例外）；各任务完成标准中以“部分前置 / 最终”引用的 AC 均出现在矩阵对应行（AC-009-1 工程门按矩阵说明除外，0 例外）；T-G06 / T-G09 以全部 A～F 任务为祖先。
- spec 标“端到端”的 AC 共 **18 条**，最终命令全部为 `test:e2e e2e/jobs/…`（与 R3 列举的集合相同；R6 记作 17 条系计数笔误，不影响结论）。
- `-t` / `-g` 标题 213 处 = 211 处 `WI` 开头 + 2 处 §1 `<标题>` 占位符；单测 / e2e 命令全部限定 jobs 路径，唯一例外仍是 T-A09 命令 3 有意整文件跑三份既有契约测试。
- 任务修改范围无壳方文件（`src/app/**`、`WorkbenchPage`、agent store / UI、`contract-build.mjs`、`check.mjs`）被列为修改对象（T-E03 仅以否定句提及 `agent/store.ts`）。
- `git diff 8af343f` 只含 `specs/README.md`（本 feature 行 + 新增一条跨 feature 行）、`plan.md`、`tasks.md`，另新建 `interface-handoff.md`；spec / checklist / checklist-review-request / HANDOFF / docs / AGENTS / frontend / backend / shell 为 0 差异；`git diff --check` 通过（仅 LF / CRLF 提示）。

### 6. 外部闸门与交付状态

- **已满足**：v1 Handoff 合入 main（`implementation_base_sha = 43b6d79`）。
- **未满足（IMPL-GATE-R6）**：(1) A 新会话对 r6 的定向复核（Checklist R7，以已提交 SHA 给出结论）；(2) Walter 代码实施授权；(3) 集成人、集成验证分支、实施 worktree 登记（实现分支从 `43b6d79` 建立并带入本规格文档）。H 组另待 v2 壳方 S1 / S2。
- **H-x**：H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-5、H-6 **全部未交付**（四项均未取得）。R6 SHA `8af343f` 只是 r5 设计的审查证据。本报告对 v2 只读接口的对比**不是**对方会话的人工接收，不宣称双向签收。
- Converge 口径不变：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前必报“未收敛（外部阻塞）”；H-x 交付状态不替代本 feature 自身 AC 验收。

### 7. 结论（Analyze R6）

- **新发现**：两项（AR6-1、AR6-2），均已在本轮修正并复算通过；修正后 spec v1.1 / plan r6 / tasks r6 / interface-handoff **无未解决的内部冲突、差距或歧义**。**内部一致性通过，待 A 新会话定向复核（R7）**；本报告不自宣审核通过。
- **需求**：未变更；无需回流 Clarify / Gate 1。
- **可开工**：**否**——基线门已满足，但 IMPL-GATE-R6 三项未满足。
- **未解决项（均为外部 / 人工）**：① A R7 定向复核；② Walter 代码授权与集成人 / worktree 登记；③ v2 接收方对 interface-handoff.md §5 各项的确认（含 H-6 是否分批交接），本会话不代对方接收；④ frontend-workbench 的 H-01 / H-02 处置与人工截图签字（不属本 feature）；⑤ 合并时 `specs/README.md` 与本规格目录的处理（interface-handoff.md §5-6）。
- **已实施 / 已验收**：**均为否**。没有代码、没有运行任何产品测试、没有截图。

---

## Analyze R7（只读；plan / tasks / interface-handoff 的 r6.1 精度修订与开工登记之后，2026-10-28；区别于已通过的 Checklist R7）

> **阶段记录（脱敏）**：角色 = Plan / Tasks 精度修订与开工登记作者 + Analyze；实际模型 = **claude-opus-5-5 via anthropic**。本限额窗口协调器对 `claude-bridge` 的真实最小调用已返回 quota / rate / spend_limit 类失败（exit 1），按 AGENTS §6 规则 5 本轮不重试 bridge；同模型 `anthropic` 最小调用与正式文档任务 exit 0。未换模型、未改 provider / key / 路由 / 全局配置。本报告**不是审核结论**，不勾选 checklist；Checklist R7（`9acf3de`）为当前有效审核结论，本轮未改其任何内容。
> **授权与边界**：Walter 对“是否允许开始代码实施，并由本会话担任集成人？”回复原话“允许”。本轮据此只做开工前文档（精度修订、开工登记、upstream 影响核验、本报告），不写代码、不跑产品测试、不 commit / push / merge、不写其他 worktree；不代其他 feature 的 Gate 1 / Gate 2，不扩范围。

### 1. 重新读取与输入

- **本轮开始时重新读取**（不依赖会话记忆）：AGENTS.md、`docs/plan.md`（规格分支版）、冻结 spec.md（v1.1，46 AC）、plan.md（r6）、tasks.md（r6）、本报告（R1～R6）、checklist.md §R7 全文与页首、interface-handoff.md、HANDOFF.md §9、`specs/README.md`。修订后再次重读 plan / tasks / interface-handoff 的修改处与上下文，并以脚本复算结构（§5）。
- **固定输入**：规格分支 `docs/workbench-interaction-resume-20261028` HEAD `5e9e1f4e99e7d5d7c4dfbf682a7fd92bd7dff796`，起始 clean；`checklist.md` 工作区内容的 `git hash-object` = `7c219c071607596c813af6a3ebc1b651e25cd8d0`，与 `9acf3de` 中的 blob 相同（未改）；spec.md 相对 HEAD 零差异。
- **只读参照**：v1 基线 `D:/2030/Futures-AI-interaction-base-43b6d79`（`43b6d79`）；main 参照 `D:/2030/Futures-AI-interaction-main-ref-90187f7`（`90187f7d8907316e554d2441d846827468c5371f`）；v2 最新参照 `D:/2030/Futures-AI-interaction-v2-ref-79b5212`（`79b521207a93567c4da8651e5f6e53c665e3d098`）。实施树 `D:/2030/Futures-AI-interaction-implement`（`feat/workbench-interaction-astra`）与生产方集成树 `D:/2030/Futures-AI-interaction-integration`（`integration/workbench-interaction`）只做 `rev-parse` / `status` / `diff --stat` 只读核验：HEAD 均为 `90187f7`、clean、`43b6d79` 为祖先、尚无 `specs/workbench-interaction/**`。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试、未启动子 agent / 服务 / 下载、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写任何其他 worktree；未改 spec / checklist / docs / frontend / backend / shell / design。结构复算脚本放在本会话独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-implement-01a18388-72nsu9xh/`（非项目产物、不入库、不清理）。

### 2. r6.1 改动是否只在 R7 建议的精度范围内

| R7 建议 | r6.1 落点 | 判断 |
|---|---|---|
| S-27（Tasks 层措辞） | T-A10 修改范围：`job-state.ts` = 模块级唯一共享会话状态，`createMockDataClient()` 时建立 / 重建（scenario 与 `jobFixtures` 各读一次），`createMockAgentClient()` 与所有 DataClient 共用当前状态；`jobFixtures` 建状态时读一次 vs v1 `fixtures` 每请求读一次。T-A18 修改范围补“共用 T-A10 当前状态”；plan §2.4 `jobFixtures` 句与 interface-handoff §3 `MockOverrides.jobFixtures` 行补同一语义 | 只定语义、无新机制；R7 原文即此句。未新增完成标准 / 命令 |
| S-29（fixture 口径） | T-A07 修改范围：j-failed 分析产物 `status=draft`，只有分析阶段态 conflict + reason；T-A21 标准 5 补“normal 下 j-failed / j-cancelled 初始 `pendingCount` 为 0”；plan §2.3 种子句注明“conflict 产物”指产物 status | 采用 R7 建议值（draft），与 S-14、interface-handoff §5-3 “normal 不预置”一致；标准 5 只扩展同一断言的枚举对象，命令不变 |
| S-28（测试断言，二选一） | T-A18 标准 4 补半句：非终态事件处理前后、及不经领域写方法的带 jobContext 的 `send` 受理前后，`listJobs()` / `getJob()` 的作业摘要（JobListItem 固定字段）不变 | 选 R7 给出的 tasks 方案（不改 plan §4.7）；仍由命令 4 的同一标题覆盖；断言的是既有设计推论，不改行为 |
| S-30（Plan 措辞 + 交接登记） | plan 动作矩阵“追问”行改为经 `contracts/index.ts` 的 `agentClient.send({message, jobContext})` 直接发送、不带 sessionId、独立 mock session；T-E03 修改范围同句；interface-handoff 新增 §5-7 供 v2 知悉 | R7 明示“不要求改行为”；与 r6 §4（jobs 不导入 `agent/store.ts`）一致 |
| S-31（Converge 核对项） | tasks §7 新增一条：Converge 逐写路径核对“成功后恰一次 `refresh()`、失败不刷新”，列出 R7 点名的写路径；缺口按 §2 第 9 步追加任务 | 不新增任务 / 机制 |
| S-32（实施提示） | T-A22 修改范围加提示：A22 阶段 `pinia` 未用时按仓库 eslint 规则处理（如 `_pinia`），不改签名、不加逻辑 | 不改设计 |

**结论**：r6.1 全部为措辞 / 断言精度与状态登记；行为、方法集、动作矩阵语义、九场景、样例表、rerun 迁移表、定稿语义、46 AC、任务数、依赖、工时、命令均未变。按 R7「下一步」2，**不需重过 R7**，也不需为精度文字另起 A。

### 3. 新 upstream（main `90187f7`）影响核验

**前端代码**：`git diff 43b6d79 90187f7 -- frontend/` 仅 2 文件——`src/modules/market-board/SampleChart.vue`（`figcaption .num { display: inline; }`）与 `e2e/theme.spec.ts`（新增回归，位于 `e2e/` 根）。契约 / types / mock / events / `main.ts` / `app/**` / `design/**` / 脚本 / `package.json` / `pnpm-lock.yaml` / vitest 与 playwright 配置 / 既有 `tests/**` 零差异，tasks §0.0 B-2～B-10 事实仍成立；B-1 中“H-01 未处置”已过时（H-01 经 PR #8 修复并完成该 feature Gate 2 / Handoff），H-02 仍为 frontend-workbench v2 事项；B-11 的文档差异见下。`e2e/theme.spec.ts` 不在 `e2e/jobs/**`，本 feature 定向命令不受影响；T-G09 / T-H04 的全量 `pnpm -C frontend test` 将包含它（属既有回归）。已在 tasks §0.0 末追加“r6.1 upstream 复核”。

**文档（PR #9，D-020～D-024 与 AGENTS / interaction / architecture / designUI / plan / candidates / README 同步）**：

- D-020 ADR《真值锚与结果校准》“影响”末条原文：“在飞 spec：`workbench-interaction`（已冻结）不加 AC；三类新块由后续 feature（交付物 / 验证队列）承载”。main `specs/README.md` 跨 feature 行同口径。
- main `docs/plan.md` §8 保留 **Phase 1.5 协作交付骨架**原文（本 feature 的承载阶段不变）；§9 第三轮记录明写“本轮为产品设计与文档同步批准，**不是其他 feature 的 Gate 1 / Gate 2**；冻结 spec / AC 不在本轮修改范围”。
- main `docs/interaction.md` §3.4 新增介入字段 `basis ∈ {public, private}` 与 kind `slot_fix` / `decision` / `interview`，§3.5 定稿效果 ④ 增加 calls 抽取，designUI §5.2 新增观点 / call / 决策三类块；D-021～D-024 新增世界模型、常驻研究台 / 自主度、多主体、协议冷启动。AGENTS §2 / §5 / §6 未变（只增 §0 两行、文档地图一行与 §3 五条决策摘要）。
- **判定**：本 feature **不加** calls / `basis=private` / 三类新块 / 世界模型槽位与 `slot_fix` / 常驻作业与晨间议程 / 多主体 / 协议冷启动访谈等，契约维持冻结 spec R-007 的十字段与 S-16 的 13 种 kind（“v1 子集”口径），只登记由后续 feature 承接（交付物 / 验证队列、world-model、standing desk、multi-persona、`playbook-bootstrap`、settings）。这与 main 文档自身的承接口径一致，不构成“实现与 docs 冲突”。实施提示（已写入 implementation-log）：实施分支含 main 新 docs，实施者不得因 interaction §3.4 新字段 / kind 扩展本 feature 契约；若 Review 认为 `InterventionKind` 的 describe 需追加列举后续 kind，按 P3 措辞处理，不在本轮改（会改变 T-A01 标准 1 的断言范围，超出 R7 授权的精度修订）。
- **集成口径**：本轮不把 main merge 进规格分支、不改权威 docs。后续由集成人把本规格目录定向导入 `90187f7` 起点的实施分支，**不得**整文件覆盖 main 的 `docs/**`、`specs/README.md`（README 只增 / 改本 feature 行与本 feature 的跨 feature 行，保留 main 的 D-020～D-024 行；main 上已完成的“D-018 → workbench-interaction 回 Clarify”行按 interface-handoff §5-6 删除）或其他 feature 规格。

**v2 最新参照 `79b5212`**：相对 `ded7161`，plan §7.3 / tasks §1.2 只增状态补记、V2-S11（H-3 集成至 T-V2-09#4 期间 v2 侧 `shell.spec` `/jobs` 占位子断言“已知红”由其集成人记账）/ V2-S12（条件依赖显式化）与其集成树登记；H-1～H-6 / 页面切片的消费要求未变，interface-handoff §2 / §3 仍成立。v2 页面仍写“互动方 r5 未吸收新增要求”属对方文档时点，由其所有者更新，本 feature 不写。

### 4. 一致性（r6.1 修改处）

| 检查 | 结果 |
|---|---|
| plan §2.4 `jobFixtures` 句 ↔ T-A09（每 client 建状态读一次）↔ T-A10（模块级共享状态、`createMockDataClient()` 重建）↔ T-A18（AgentClient 共用）↔ interface-handoff §3 / §5-4 | 一致；“每个 client 读一次”与“每次 `createMockDataClient()` 重建共享状态”同义，T-A10 标准 2 “client 创建时据覆盖建立一次”不变 |
| plan §2.3 种子句 ↔ plan §2.4 样例表（j-failed D,D,C,N）↔ S-14 ↔ T-A07 ↔ T-A21 标准 5 ↔ interface-handoff §5-3 | 一致；normal 场景零预置条目 |
| T-A18 标准 4（S-28）↔ plan §4.7 / rerun 表 / S-15 ↔ T-A22a 标准 4（只对终态刷新） | 一致；断言的是既有不变量，未引入新状态变化点 |
| plan 动作矩阵“追问”行 ↔ T-E03 ↔ interface-handoff §4 / §5-7 ↔ S-15（send 不追加介入） | 一致 |
| tasks 页首开工状态 ↔ README 本 feature 行 ↔ HANDOFF §10 ↔ implementation-log | 一致：三门满足、全部未开始、首批 T-A01～T-A09 / T-A09a、H 组外部阻塞不变、H-x 未交付 |

### 5. 结构复算（脚本、只读，作用于 r6.1 最终文本）

- **66 个任务**、编号唯一、排序规则成立；合计 **101.5 h**（A 27·42.5 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4），每项 1～2 h；依赖（去括号说明）全部指向更早任务，0 例外、无环。
- 66 / 66 状态“未开始”；62 × `blocked_by: IMPL-GATE-R6`、H 组 4 × 另带 `frontend-workbench-v2`（原标签保留，页首说明闸门已满足、不再读作未授权）。
- 完成标准 **220** ↔ 验证命令 **220**，逐任务 1:1（0 例外）；每条完成标准含 AC 引用或 spec §4 口径（0 例外）。
- 矩阵 46 行 = spec 46 AC（差集为空）；“部分前置”均为最终任务祖先（0 例外）；任务正文 AC 引用 ↔ 矩阵行双向一致（AC-009-1 工程门除外，0 例外）；T-G06 / T-G09 以全部 A～F 为祖先，T-H04 以 H01～H03 为祖先。
- spec 标“端到端”的 AC **18** 条，最终命令均为 `test:e2e e2e/jobs/…`。`-t` / `-g` 标题 **213** = 211 `WI` + 2 个 §1 占位符；测试路径全部限定 `tests/{unit,component}/jobs/**`、`e2e/jobs/**`，唯一例外仍是 T-A09 命令 3 有意整文件跑三份既有契约测试。
- 关键依赖复核：T-A09a ← A02 / A09；T-A22 ← A01；T-A22a ← A09a / A10 / A12 / A22；T-A22b ← A02 / A22；T-C01a ← C01；T-A18 ← A09a / A14 / A16 / A17；T-A21 ← A19 / A20；T-E03 ← E02 / A18 / A22b——均与 r6 相同。

### 6. 闸门与交付状态

- **IMPL-GATE-R6**：(1) Checklist R7 通过（`9acf3de`）；(2) Walter 原话“允许”（代码实施 + 本协调会话为集成人）；(3) 集成人 = 协调会话 `01a18388-a371-7746-8158-9fb15d55d819`（`openai/gpt-6.1-sol`），生产方集成树 `integration/workbench-interaction`，实施树 `feat/workbench-interaction-astra`——**三项均已满足**。`implementation_base_sha = 43b6d79` 不变，`upstream_start_sha = 90187f7` 另登记。
- **开码前置（未完成）**：集成人把含 r6.1 的规格提交定向带入实施分支；在此之前不写代码。
- **H 组**：`frontend-workbench-v2` 外部闸门不变；AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前 Converge 必报“未收敛（外部阻塞）”。
- **H-x 八切片**：全部未交付；② 有效 Checklist = R7 `9acf3de`，①③ 待实现，④ 须 v2 集成树所有者真正集成后登记；生产方集成树 SHA 不能填作 ④。interface-handoff §5 仍未经 v2 接收方确认。

### 7. 结论（Analyze R7）

- **新发现**：无实质新问题。r6.1 修改未引入冲突、差距或歧义；§0 基线事实未因 upstream `90187f7` 失效（仅 B-1 的 H-01 状态过时，已登记）；main 新文档对本 feature 冻结需求无影响，后续能力只登记承接。
- **需求**：未变更；无需回流 Clarify / Gate 1；无需另起 A（精度文字在 R7 授权范围内）。
- **可开工**：闸门已满足；**实施分支带入本规格后**可按 DAG 开工首批 T-A01～T-A09 / T-A09a。
- **未解决项（外部 / 人工 / 流程）**：① 集成人把规格带入实施分支（开码前置）；② v2 接收方确认 interface-handoff §5（含 §5-3 H-6 是否分批、§5-7 独立 mock session）；③ H 组外部 v2 S1 / S2；④ 合入 main 时按 §3 定向导入，不覆盖他人文件。
- **已实施 / 已验收**：**均为否**。没有代码、没有运行任何产品测试、没有截图；任务内的测试命令都是未来命令。（R7 当时状态；首批实施后见 R8）

---

## Analyze R8（只读；首批 T-A01～T-A09a 实施后的 Converge 配套分析，2026-10-29；区别于 Checklist，**不是** Checklist R8）

> **阶段记录（脱敏）**：角色 = Converge / 状态记账（含本分析）；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18440-f6ab-76d5-8ed7-409aec13d42b`）。`claude-bridge` 本限额窗口已明确 quota / rate / spend_limit 类失败，按 AGENTS §6 规则 5 不重试；官方同模型实际调用成功；未换模型、未改 provider / key / 路由 / 全局配置。派工 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`（Walter 已授权代码实施并指定其为集成人）。本报告**不是审核结论**，不勾选 checklist；有效审核仍为 Checklist R7（`9acf3de`，本树 blob `7c219c071607596c813af6a3ebc1b651e25cd8d0` 未改）。
> **写入与执行边界**：唯一可写 worktree `D:/2030/Futures-AI-interaction-converge-a09a`（`docs/workbench-interaction-batch-a09a` @ `13a3373`，起始 clean）；只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff、新建 `converge-batch-a09a.md`，以及 `specs/README.md` 本 feature 两行。未改代码 / 测试 / 生成器 / spec / checklist / review / docs / 其他 feature / root HANDOFF；未 commit / push / PR / merge；未启动子 agent / 服务 / 安装；**未运行任何产品测试**（结构复算为只读脚本，放在独占临时文件 `C:/Users/iswal/AppData/Local/Temp/wi-implement-01a18388-72nsu9xh/converge-a09a-struct.py`，非项目产物、不清理）。

### 1. 重新读取与输入

- **本轮开始时重新读取**：AGENTS.md、`docs/plan.md`、冻结 spec.md、plan.md、tasks.md、本报告（R7）、checklist.md 页首与 R7 结论（只读）、implementation-log.md、interface-handoff.md、`specs/README.md`；实施者两份脱敏回报（只作结果来源）。
- **固定输入**：正式 base `43b6d79`；上游 `90187f7`；授权规格种子 `8753fa9f65dae685f765f316b00e6287750f0cf7`（源 `1ad7963`，只含规格目录与 README 本 feature 行，`90187f7` 为祖先）；本批代码 diff `8753fa9..13a3373`（逐提交与文件见 `converge-batch-a09a.md` §1～§2）；生产方集成树 HEAD = `13a3373`（只读核验，旁证）。spec.md / checklist.md / docs / scripts / package / 锁文件相对 `8753fa9` 零差异。
- D-020 及 main 后续文档不加本 feature AC（R7 §3 口径不变）；本批代码未引入 `basis` / `slot_fix` / calls 等后续字段（`InterventionKindSchema` 恰 13 值）。

### 2. 本批范围与结论

| 项 | 结果 |
|---|---|
| 范围 | T-A01～T-A09、T-A09a（10 项），全部是“部分前置”（schema / fixture / 边界解析 / 透传） |
| 代码 ↔ 完成标准 | 10 / 10 有对应实现；tasks 命令的 `-t` 标题均在对应测试文件中存在；fixture 十作业与 plan 样例表逐行一致（本会话只读打印核对） |
| 命令结果 | **实施者执行、本会话未重跑**：逐任务定向命令全部通过；A01～A06 首次联合回归 183 / 1（缺 describe）→ `1ed6ec1` 后 184 / 0；A09 全量 20 文件 707 / 0；A09a 后全量 21 文件 722 / 0、六守卫、`contract --check`、typecheck、lint、`git diff --check` 过；未跑 E2E（本批无 UI） |
| 所有权 | 只改 tasks §1-5 / implementation-log §4 授权的文件；生成器、check、package / 锁、v1 顶层 fixtures、agent 脚本、`app/**`、`main.ts` 均未改 |
| 新增任务 | 无（未发现需修代码的缺口） |
| 本批判定 | **已收口，待独立 Review** |
| feature 判定 | **未收敛（尚未实施 + H 组外部阻塞）**：10 / 66 已实施、56 未开始；46 AC 最终验收 0；H 组 `blocked_by: frontend-workbench-v2` 不变 |

### 3. 实施字段定形 ↔ 需求（是否变更）

| 实施事实 | 依据 | 判定 |
|---|---|---|
| `FinalSnapshot.revisionNumber` 必填 | tasks §2 S-18 已要求 final 三锚与“快照的 id / revision number / finalizedAt”一致——比较对象本就需要快照携带版本号；plan 类型行漏列 | 精度（补齐既有比较对象的承载字段） |
| `StageWorkspace` 各分支 `artifacts[]` / `revisions[]` 限定 kind；deliver 空态 `deliverable=null` | T-A05 已写“按 stage 判别、各阶段对应产物”；S-13 “带阶段的空集合” | 精度（容器形态与空态表达） |
| 修订锚 = `Revision.id`；Artifact 不内嵌 `revisions` | plan `Artifact` 行列有 `revisions`，T-A05 字段表已不含；实现按 tasks，修订列表由工作区携带 | 精度（消解 plan ↔ tasks 既有措辞差异，语义同为“产物可取其修订”） |
| `RecipeStep` 单字符串 input / output | “输入 / 输出锚、单链” | 精度 |
| 表格块 `columns: string[]`、`rows` 标量二维数组 | “columns / rows / tableId” | 精度 |
| `job-detail.json` / `deliverable.json` / `uploads.json` / `interventions.json` 形状；具名 fixture schema 注册进 `contractSchemas` | T-A07 / T-A08 内容约束；plan “fixtures 校验与生成文档”；生成器不改 | 精度 |

**结论**：均为既有需求（R-001 / R-003～R-008）内的类型精度，不扩行为、不增 AC、不改方法集 / 动作矩阵 / 九场景 / 样例表 / 定稿语义 / 任务编号 / 依赖 / 预估 / 命令；**不是需求变更**，无需回 Clarify / Gate 1。已以【r6.2 精度】同步 plan §2.4（页首加 r6.2 记录）与 tasks T-A03 / A04 / A05 / A07 / A08 / A09 的修改范围；独立代码 Review 会核实这些 diff。

### 4. 状态回写口径（tasks §1-8）

- 10 项状态改为“**已实施（batch-a09a，待独立 Review）**”并带固定 commit 与“实施者执行”的验证摘要；**不写“完成 / 已验收”**——tasks §1-8 “A 复核前不改”按此理解为：A 复核前不宣称验收，状态行只登记实施事实。原 `blocked_by: IMPL-GATE-R6` 标注为“已满足”保留。
- 页首新增“当前实施进度”块（10 / 66 已实施、56 未开始、可起步 T-A10 / T-A22 / T-A23 / T-A24）；r6.1 块中“66 个任务全部仍为未开始”保留为开工时历史。

### 5. 结构复算（脚本、只读，作用于本轮最终 tasks.md 并与 `8753fa9` 版本对比）

- 66 个任务，编号与顺序同 `8753fa9`；每个任务的“预计 / 依赖”行、完成标准正文、验证命令正文与 `8753fa9` **逐字相同**（只改状态行与修改范围的【r6.2】追加文字）。
- 完成标准 **220** ↔ 验证命令 **220**，逐任务 1:1；合计 **101.5 h**。
- 状态：10 × “已实施（batch-a09a，待独立 Review）”（T-A01～T-A09、T-A09a），56 × “未开始”，无其他值。
- AC 矩阵（§5）、DAG（§6）、Converge 口径（§7）未改；46 AC 行不变。

### 6. 未解决项与观察项

- **观察项（交独立 Review 判定，非缺口）**：O-1 `uploads.json` “两条待归属、一条 quarantined”的读法（实现为两条、其一隔离）；O-2 十作业工作区内容同形（如 j-cancelled 四阶段 N 仍有 ingested 投放 / 结论）；O-3 `contractChange` / `jobScenarios` 文案前瞻描述尚未实现的作业方法与场景行为（带“后续任务接入”限定），T-G06 收口前须复核；O-4 `latestMergedRev` 非空对 T-A12 “初始空产物”的约束；O-5 `readJobFixtures()` 尚未被调用（H-6 未交付）；O-6 fixture 形状 schema 进入 CONTRACT.md。详见 `converge-batch-a09a.md` §4。
- **S-31 写后统一刷新核对**：本批无写路径，不适用。
- **外部 / 流程**：① 独立代码 Review（审核员 A，新会话、异模型）；② H-1 ④ 须 `integration/frontend-workbench-v2` 所有者真正集成后登记，本 feature 生产方集成树 `13a3373` 只作旁证；③ interface-handoff §5 仍未经 v2 接收方确认；④ H 组外部 v2 S1 / S2；⑤ 本 worktree 文档由集成人审阅后提交。

### 7. 结论（Analyze R8）

- spec ↔ plan ↔ tasks ↔ 代码：本批范围内**无冲突**；字段定形差距已按精度同步；无歧义需回 Clarify。
- 本批（10 项）**已收口、待独立 Review**；feature **未收敛（尚未实施 + H 组外部阻塞）**。
- **不是** Review 通过、Gate 2 或 Handoff；H-x 无一“已交付”（H-1 = ①②③ 具备、④ 未取得 → “待消费方集成（未交付）”）。

---

## Analyze R9（只读；第二批开工前精度澄清 r6.3 之后，2026-10-29；区别于 Checklist R7，**不是** Checklist R9）

> **阶段记录（脱敏）**：角色 = Plan / Tasks 精度修订 + Analyze（第二批派工准备）；实际模型 = **claude-opus-5-5 via anthropic**。本轮（跨 UTC 日后）协调器对 `claude-bridge/claude-opus-5-5` 的最小真实调用 exit 1，失败类别 = **provider / invocation error（不是已确认的 quota）**；同模型 `anthropic` 最小调用 exit 0；按 AGENTS §6 规则 2 只换通道、不换模型，未改 provider / key / 路由 / 全局配置。派工 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`（Walter 既有授权覆盖代码实施与其集成人身份）。本报告**不是审核结论**，不勾选 checklist；有效审核仍为 Checklist R7（`9acf3de`）。
> **写入与执行边界**：唯一可写 worktree `D:/2030/Futures-AI-interaction-plan-batch2`（`docs/workbench-interaction-batch2-plan`，起点 `0920004b1daed2721f81834de76c067931ab2350`，起始 clean）；只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff 与 `specs/README.md` 本 feature 行。未改代码 / fixture / 测试 / spec / checklist / 审核原件 / 根 HANDOFF / 权威 docs / 其他 feature；未写实施树、生产方集成树、v2 任何树；未 commit / push / merge；未安装、未启动服务或子 agent、**未运行任何产品测试**。只读核验脚本在本会话独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/`（非项目产物、不清理共享 tmp）。

### 1. 重新读取与输入

- **本轮开始时重新读取**（不依赖会话记忆）：AGENTS.md、`docs/plan.md`（Phase 1.5）、`docs/interaction.md`（§3.2 重跑口径）、`docs/architecture.md`（作业层边界）、`docs/designUI.md`（§2.4 徽语义、§8 组件自制登记）、冻结 spec.md、plan.md（r6.2）、tasks.md（页首、§0.0、§1、§2、§2a、T-A07～T-A24、§5～§7）、checklist 页首与 R7（只读）、本报告 R8、implementation-log、interface-handoff、`converge-batch-a09a.md`、`review-batch-a09a.md`（`af95b66` 原件）、`specs/README.md`。修订后重读全部修改处与上下文，并以脚本复算结构（§5）。
- **固定输入**：本树 HEAD `0920004`；`git diff 13a3373 0920004 -- frontend` 为空（代码 = 受审 `13a3373`）；`checklist.md` 的 `git hash-object` = `7c219c071607596c813af6a3ebc1b651e25cd8d0`（未改）；spec.md 相对 HEAD 零差异。实施树 / 生产方集成树只读 `rev-parse`：均 `0920004`。main `cf8e11bc1c91149cac233a2f3b5ec6eed4e23caa`：`git diff --stat 90187f7 cf8e11b -- frontend docs AGENTS.md backend design` 为空（11 个文件全在 `specs/README.md` 与 `specs/frontend-workbench/**`）；实施继续 pin `90187f7` upstream，正式 base 仍 `43b6d79`，只记录、不合入。v2 `D:/2030/Futures-AI-workbench-v2` @ `76abe92` 只读核对 HANDOFF H-x 行、plan §7.3 H-4（“交接登记须写明是否含可在测试中使用的公开设置方式”）与 tasks T-V2-03（`useSessionStore()` 只在 `send` 体内调用、只用 H-4 公开方式或真实 router + 互动方 routes 导航设置），未复制其规格、未写入。
- **只读事实核验**（脚本 / 读源，不跑产品测试）：① plan 样例表中 `not_started` 的 (作业, 阶段) 共 12 个，当前 fixture 全部带完整内容；② `interventions.json` i-seed-1～6 的锚全部落在已开始阶段（j-collect collect、j-process process、j-running analyze、j-deliver deliver×2、j-delivered deliver）；③ `StageWorkspace` 各分支与 `JobDetailFixture.previews / reconciliations` 均接受空集合，deliver 接受 `deliverable=null`；④ `shared/components/Badge.vue` 只有 `state` prop、固定文案、无插槽；⑤ `main.ts` 在 `app.use(pinia)` 前以 `useAgentStore(pinia)` 取 store。

### 2. 精度项逐条判定

| # | 落点 | 性质 | 需求回流 | 新机制 |
|---|---|---|---|---|
| R-B | plan §2.4【r6.3】；T-A10 修改范围末段 + 新标准 5 / 命令 5（原工程门顺延为 6）；T-A07 / T-A08 修改范围【r6.3】注；矩阵 AC-002-5 部分前置加 A10 | **fixture-only 数据校正 + 测试断言收窄**：12 个未开始工作区种子置空，`fixtures.spec.ts` 内容断言只对已开始阶段，新增 `WI not-started seeds`。选定唯一路径的理由：读侧按阶段态规范化会与 plan §4 rerun 迁移表冲突（重跑后下游 `not_started` 仍保留旧修订与 draft 新修订），即“未开始 = 空”不是运行期不变量，只能是种子口径 | 否（plan 样例表只约束 status / currentStage / 阶段态 / 关键产物，均不变；S-13 “未开始 = 空集合”表达本就存在） | 否（无 schema / 生成物 / 方法变化；跨字段关系只是测试断言，不是生产 guard） |
| R-D | implementation-log §8；T-A10 / A12 / A13 / A14 / A17 / A18 / A20 状态行 | **口径登记**：不新增五处跨字段 refine，各项由对应写方法按构造保持、以既有读回断言覆盖；T-A10 不接管领域写入 | 否 | 否（明确不扩防御面；若后续要加，按 AGENTS §5.1 先报 Walter） |
| H-4 | plan §2.1 / §2.3【r6.3】；T-A22b 修改范围【r6.3】；interface-handoff §3 行、§5-8 | **接口精度**：`useSessionStore()` 唯一额外成员 `bindRouter(router)` 只注册既有 `afterEach` 守卫、不接受 `JobContext`；`context` 为 getter；不顶层 useStore、不用 WeakMap / 注册表 / provide、不改 `app/router.ts`、不导入 `agent/**` / `routes.ts`；不加 failure / 竞态兜底。H-4“公开设置方式”仍登记为无，v2 条件依赖 H-3 成立 | 否（行为、守卫时机、只读语义均为 r6 已审设计） | **新增一个公开成员名**（机制不变）。R7 审过“registerJobRoutes 注册 afterEach、无公开 setter”，**未审该名称**；不声称 R7 自动覆盖 |
| T-A23 | tasks §0.0 r6.3 复核 ②；T-A23 修改范围【r6.3】；plan §1【r6.3】 | **基线事实修正**：原文“复用既有 Badge.vue”不可行（固定文案、无插槽 / 文案 prop、`shared/**` 不属本 feature）→ 自制徽标、只复用令牌与样式写法（designUI §8 自制登记） | 否（AC-001-5 / 003-6 / 006-8 的文案 + 图标、契约同源要求不变） | 否；但属 tasks §7 “基线实况与任务文字不符”一类 |
| T-A24 | T-A24 修改范围【r6.3】 | **边界口径**：`'\n'` 切行、空串 0 行；任一侧 > 2000 行直接返回摘要；以 2000 / 2001 边界断言返回形态、不以耗时断言 | 否（plan §6 “上限 2000 行，超出显示变更摘要”） | 否 |
| T-A10 预估 | T-A10 预计行 | 维持 2 h，注明 R-B 机械校正约 0.3～0.5 h 并入；实际超 2 h 按 §7 S-22 停下回报、追加拆分 | 否 | 否 |

### 3. 一致性（spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log）

| 检查 | 结果 |
|---|---|
| plan §2.4 R-B 句 ↔ T-A10 范围 / 标准 5 ↔ T-A07 / T-A08 注 ↔ S-13 空工作区表达 ↔ plan §4 rerun 迁移表 ↔ T-A12 `createJob` 初始空产物 | 一致。“无产物”的空工作区（种子 / empty 场景 / 覆盖缺样例）与 `createJob` 的“空产物”并存，两者均为既有设计，R-B 不新增 UI 状态 |
| T-A08 标准 2 “其余都是 draft” ↔ R-B deliver 未开始 → `deliverable=null` | 一致：标准意图是“仅 j-delivered 为 final”；deliver 未开始的样例无交付物，同样不是 final（T-A08 注已写明读法，标准 / 命令文字未改） |
| interventions / uploads / jobs fixture ↔ R-B | 不受影响（锚全在已开始阶段；`WI interventions fixtures` 断言不改） |
| 矩阵 AC-002-5 ↔ T-A10 标准 5 的 AC 引用 | 已加 A10；A10 是最终任务 T-B05 的祖先（B05 ← B04 ← B01 ← A10） |
| H-4：plan §2.1 / §2.3 ↔ T-A22b ↔ interface-handoff §3 / §5-8 ↔ v2 plan §7.3 H-4 / tasks T-V2-03 | 一致：公开设置方式 = 无；只经导航；`session.ts` 不导入 `agent/**`，与 v2 `send` 体内 `useSessionStore()` 不成环 |
| T-A23 ↔ plan §1 令牌约束 ↔ designUI §2.4 / §8 ↔ tasks §1-5 所有权 | 一致 |
| R-D ↔ implementation-log §8 ↔ 各写任务状态行 ↔ AGENTS §5.1 / §5.2 | 一致；未加校验、未申请扩面 |
| main D-020～D-024 ↔ 本 feature | 不加 AC（R7 §3 口径不变）；`cf8e11b` 无 frontend / docs 变化 |
| tasks 页首 ↔ README 本 feature 行 ↔ implementation-log 页首 / §9 ↔ interface-handoff 页首 | 一致：第二批 5 项待实施；首批 10 / 66 不变；46 AC 最终 0；H-x 无一已交付 |

### 4. 第二批 DAG 与开工门槛

- DAG：T-A10 ← T-A09 ✓；T-A22 ← T-A01 ✓；T-A22b ← T-A02 ✓、T-A22（本批先行）；T-A23 ← T-A01 ✓；T-A24 无依赖。执行顺序 A10 → A22 → A22b，A23 / A24 独立、同实施树串行。
- 门槛：IMPL-GATE-R6 三项已满足；Walter 授权在既有 tasks 范围内持续有效；Implement 前置“checklist 当前有效轮次全部勾选”= R7 26/26 成立（未改）。不在本批：T-A11、T-A12 起写方法、T-A18、T-A22a、B 组及其后。
- 本批每任务 1:1 命令共 18 条（A10 6、A22 3、A22b 3、A23 3、A24 3），全部限定 `tests/{unit,component}/jobs/**` 与 `WI` 标题。
- H-x：本批完成可形成 H-3·路由切片、H-4、H-2·标签的生产方 ①③；② 当前有效 R7 `9acf3de`；④ 只能由 v2 集成树所有者登记。

### 5. 结构复算（脚本、只读，作用于本轮最终 tasks.md 并与 HEAD `0920004` 版本对比）

- 66 个任务，编号 / 顺序与 HEAD 相同；合计 **101.5 h**；依赖全部指向更早任务（0 例外）。
- 完成标准 **221** ↔ 验证命令 **221**，逐任务 1:1、编号连续（0 例外）；每条完成标准含 AC 引用或 spec §4 口径（0 例外）。
- 与 HEAD 对比：完成标准 / 命令文字只有 T-A10 变化（新增标准 5 / 命令 5、原 5 顺延为 6）；T-A12 / A13 / A14 / A17 / A18 / A20 / A22 / A22b / A23 / A24 只改状态行；T-A07 / T-A08 / T-A22b / T-A23 / T-A24 另有修改范围【r6.3】追加文字；预计 / 依赖行均未变。
- 状态：10 × 已完成（首批）、56 × 未开始，无其他值。
- 矩阵 46 行 = spec 46 AC（差集空）；“部分前置”均为最终任务祖先（0 例外）；任务正文 AC 引用 ↔ 矩阵双向一致（AC-009-1 工程门除外，0 例外）。

### 6. 观察项与未解决项

- **O-R9-1（预估）**：T-A10 维持 2 h 顶格并入 R-B；超时按 §7 S-22 处理，未预先拆任务。
- **O-R9-2（覆盖时点）**：T-A10 的 `commit(mutator)` 本任务无生产调用方，原子性由 T-A17 标准 2 经真实 commit 验证；读 API 返回副本由 T-A16 标准 3 验证。均为既有安排，未加标准。
- **O-R9-3（复核建议）**：T-A23（tasks §7 基线不符类）与 H-4 `bindRouter`（交接接口新增成员名）建议由审核员 A 做限定范围定向复核后再开码；T-A10 / T-A22 / T-A24 可直接开工。以本批代码 Review 替代属 Walter / 集成人裁量，本报告不代定。
- **不变的未解决项**：R-A（T-A16 / T-A19 前定案）、R-C（T-G06）、R-E（T-A17）、R-F（T-A21）；H-1 ④ 及其余 H-x 交付；interface-handoff §5 待 v2 接收方确认（含新增 §5-8）；H 组 v2 外部闸门；本树文档待集成人审阅提交。

### 7. 结论（Analyze R9）

- spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log：r6.3 修改**无冲突**；R-B 只选定一条可验收路径（fixture-only），无残留二选一。
- **需求**：未变更；冻结 spec / 46 AC / 行为 / 方法集 / 动作矩阵 / 九场景 / 样例表 / 迁移表 / 定稿语义不变；无需回流 Clarify / Gate 1，无新产品裁定。
- **新机制**：无新运行时机制、无新校验；唯一新增的公开名称是 H-4 的 `bindRouter(router)`（已审机制内的绑定入口，如实报告、未声称 R7 覆盖）；T-A23 为基线事实修正。
- **任务**：未新增任务；任务数 66 / 101.5 h / 依赖不变；标准 / 命令 221 / 221。
- **开工**：第二批可派工；建议顺序 T-A10 → T-A22 → T-A24 先行，T-A22b / T-A23 待 A 限定范围定向复核（见 O-R9-3）。
- **已实施 / 已验收**：第二批**均为否**；本轮未写代码、未运行任何产品测试。

---

## Analyze R10（只读；Checklist R8 B-12 粒度修订 r6.4 之后，2026-10-29；区别于 Checklist R8 / R8.1，**不是**审核结论）

> **阶段记录（脱敏）**：角色 = Tasks 粒度修订 + Analyze；实际模型 = **claude-opus-5-5 via anthropic**（与 r6.3 / Analyze R9 同模型；不因审核未过换模型）。本轮协调器对 `claude-bridge/claude-opus-5-5` 的真实调用为 **provider / invocation 失败（未确认 quota，不编造限额证据）**，官方 anthropic 通道成功；按 AGENTS §6 规则 2 只换通道，未改 provider / key / 路由 / 全局配置。本报告不勾选 checklist、不宣布 B-12 关闭；关闭与否只由 A 新会话 R8.1 判定。
> **写入与执行边界**：唯一可写 worktree `D:/2030/Futures-AI-interaction-plan-batch2`（`docs/workbench-interaction-batch2-plan`，起点 HEAD `7b91a2c3b5bdfd1147aeee7fbeb23d043c439b98`，起始 clean）；只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff 与 `specs/README.md` 本 feature 行。未改 spec / checklist（R8 原件）/ 旧 Review 原件 / converge 报告 / 代码 / fixtures / tests / 权威 docs / 根 HANDOFF / 其他 worktree；未 commit / push / merge；未启动子 agent / 服务、未安装、**未运行任何产品测试**。结构复算脚本与日志在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/`（`struct_r10.py`、`struct-r10.log`，非项目产物，不清理）。

### 1. 重新读取与输入

- **本轮开始时重新读取**（不依赖会话记忆）：AGENTS.md（§2 第 6～8 步、§5、§6）、`docs/plan.md`、`docs/designUI.md`（§6 :214、§8 标题）、冻结 spec.md、plan.md（r6.3 全部【r6.3】处、§2.4 R-B 句）、tasks.md 全文、checklist.md 页首与 **§R8 全文**（结论、独立核验、B-12 最小关闭要求、S-33～S-36、当前有效 26 项、下一步、结构证据）、本报告 R9、implementation-log 全文、interface-handoff（页首、§1、§3、§5-8）、`specs/README.md` 本 feature 行。修订后重读全部修改处与上下文，并以脚本复算（§4）。
- **固定输入**：HEAD `7b91a2c`（= R8 审查对象 `8ad5e28` + 集成人原样提交的 R8 原件）；`checklist.md` 相对 HEAD 零差异（`git hash-object` = `d81759864122457b337c9041ee897ab13bb66734`，即 R8 原件）；`spec.md`、`review-batch-a09a.md`、`converge-batch-a09a.md`、`frontend/**`、`docs/**`、`AGENTS.md` 相对 HEAD 零差异（`git diff --quiet` exit 0）；代码仍 = 首批受审 `13a3373`。
- **只读事实复核**：`jobs.json` 中阶段态 `not_started` 的 (作业, 阶段) 仍恰 12 个，与 T-A09b / T-A10 标准 5 列表同集合；`fixtures.spec.ts` 现有五个顶层标题（`WI jobs fixtures` / `WI deliverable fixtures` / `WI final only delivered` / `WI interventions fixtures` / `WI list coverage`）与 `test.each(Object.keys(details))`、deliverable 全作业循环、final-only 断言三处收窄点属实（与 R8“基线与范围”一致）；`docs/designUI.md` “移植 / 自制决策随实施登记”在 §6 :214，§8 为“规范资产移植计划”。

### 2. B-12 最小关闭要求 → r6.4 落点（逐条；作者自报，不代 A 判定）

| R8 B-12 要求 | r6.4 落点 | 核对 |
|---|---|---|
| (1) 新增 fixture-only 任务，0.5 h，依赖 T-A08，无代码 / schema / 生成物改动；修改范围 = 原 T-A10【r6.3 R-B】段 | 新增 **T-A09b**（排在 T-A09a 后、T-A10 前；依赖 T-A08）；修改范围只许 `fixtures/jobs/{job-detail,deliverable}.json` 与 `fixtures.spec.ts`，内容为原 R-B 段（12 个空工作区四形、j-cancelled `previews={}`、j-collect / j-cancelled `reconciliations=[]`、不改 jobs / interventions / uploads / ID / 已开始内容 / done 阶段产物状态、`fixtures.spec.ts` 三处收窄 + 新增 `WI not-started seeds`）；明写不需要 T-A09 / T-A10 状态层或 DataClient 运行 | ✓ 原 R-B 段内容整体迁入，未扩写；T-A10 修改范围中该段已删除（不保留可误读为许可的“历史原文”） |
| 完成标准 ① 种子空态 + `WI not-started seeds`；② 工程门；命令 = `fixtures.spec.ts` 与 `typecheck && lint` | T-A09b 标准 / 命令 **3 / 3**：① `WI not-started seeds`（12 空态 + previews / reconciliations；AC-002-5 / 004-5 / 005-6 部分前置）↔ `fixtures.spec.ts -t "WI not-started seeds"`；② 全文件通过、T-A07 / T-A08 五个既有标题仍匹配、已开始内容 / S-18 / final 唯一 / 介入锚可达 / 真实 schema 反例拒绝未放宽（AC-002-5 / 005-6 / 006-7 / 007-1 部分前置）↔ `fixtures.spec.ts`（无 `-t`）；③ 工程门 ↔ `typecheck && lint` | ✓ 在 A 建议的 2 条基础上把“种子空态”与“首批断言不回退”拆成两条，使协调器要求的“具体覆盖 12 空态 / started 内容与介入锚仍可达 / 真实 schema 未放宽”各有独立标准与命令；仍 1:1、≤ 2 h、命令全在 `tests/unit/jobs/**` 且带 `WI` 标题或整文件 |
| (2) T-A10 恢复 r6.1 范围，只保留“原样返回、不按阶段态过滤”，依赖 T-A09、T-A09b，预计 2 h 不带并入说明 | T-A10 预计 = “2 h”（无并入 / 超时兜底文字）；依赖 = T-A09、T-A09b；状态行与修改范围写明 fixture 校正已移交 T-A09b、本任务**不改**任何 fixture 与 `fixtures.spec.ts`；保留“原样返回、不按阶段态过滤、种子口径不入 schema / 入口校验、`createJob` 初始空产物不受影响” | ✓ |
| 标准 5 收窄为真实 `getStageWorkspace` 读回；命令 5 = `job-state-read.spec.ts -t "WI not-started seeds"` | 标准 5 = T-A09b 校正后的 12 个 (作业, 阶段) 经真实 `getStageWorkspace`（normal / job-running、新建 client）返回带阶段的空工作区；命令 5 只跑 `job-state-read.spec.ts -t "WI not-started seeds"`；工程门仍为标准 6 | ✓ 按协调器口径“标准 5 仅读回 12 种子空态”（未保留 A 建议中的“已开始阶段返回原样例”一句；已开始内容由 T-A09b 标准 2 在 fixture 层覆盖）。两份 spec 各一个同名前缀用例，命令均带文件路径；S-34 随拆分消解 |
| (3) T-A07 / T-A08 注、plan §2.4 句尾、implementation-log §8 / §9、页首 r6.3 块与 §6、矩阵同步 | T-A07 / T-A08 状态行追加 r6.4 旁注（后续 T-A09b 校正初始未开始阶段数据，不改写首批 commit / 验证结果 / Review）与修改范围注（T-A10 → T-A09b）；§0.0 r6.3 复核 ④ 句尾注；plan §2.4 R-B 句尾补“由 T-A09b 落地、T-A10 读回验证”+ 页首 r6.4 记录；implementation-log 页首、§7 两行、§8 R-B 行（落点 + S-35 残留）与【r6.4 更新】、§9 范围 / 写权限 / 口径 / 命令数 / 回报 / ② / 复核状态；tasks 页首 r6.4 块、§6 组序 / 主干 / H-x / r6.4 行 / 合计、§7 S-22 兜底一句；矩阵 AC-002-5 / 004-5 / 005-6 / 006-7 / 007-1 加 A09b；interface-handoff 页首 + §1 表后口径；README 本 feature 行 | ✓ 首批 10 项“已完成”判定与固定 SHA 未改；r6.3 块与 R9 作历史保留 |
| (4) 重跑 Analyze 并复算结构，如实登记 | 本节 §4（脚本独立复算，不沿用 A 的预期数字） | ✓ 224 / 224 |
| (5) A 新会话 R8.1 增量复核补勾 V-02 | 未执行（不属本角色）；文档维持 blocked | — |

### 3. 一致性（spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ README）

| 检查 | 结果 |
|---|---|
| 冻结 spec / 46 AC ↔ r6.4 | 零差异；r6.4 只改任务切分，不改任何 AC 判据、行为、方法集、样例表、迁移表、定稿语义 → **无需求变更，不回流 Clarify / Gate 1** |
| plan §2.4 R-B 句 ↔ T-A09b 修改范围 ↔ T-A10 标准 5 ↔ plan §4 迁移表 / §4.1 | 一致：种子口径由 T-A09b 落地；T-A10 原样返回、不过滤；`createJob` 初始空产物不变 |
| T-A09b 标准 2 ↔ T-A07 / T-A08 既有标准 | 一致：首批五个标题保留、只收窄到已开始阶段；T-A08 标准 2 “其余都是 draft” 的读法注已改指 T-A09b |
| 矩阵 ↔ 任务正文 AC 引用 | 双向一致（脚本 0 例外）；A09b 进入 5 条 AC 的部分前置，均为最终任务祖先（A09b 是 A10 的祖先，A10 → B01 → B04 → {B05、D01、E01、B06、F01 → … → F07}） |
| H-x：tasks §6 ↔ interface-handoff 页首 / §1 口径 ↔ implementation-log §9 | 一致：A09b 只是 A10 的新祖先，不是任何切片提供任务、不形成 ①～④；八切片仍未交付，H-1 维持“待消费方集成”；② 不得用未通过的 R8，届时用 R8.1 提交 SHA |
| R8 已判通过项（H-4 `bindRouter`、T-A23 自制徽标、T-A24 边界、R-D 口径） | 设计 / 标准 / 命令未动；只有 T-A23 修改范围的 designUI 章节号更正（S-33）与 T-A24 修改范围一句实施提示（S-36，非机制、非标准） |
| S-35（R-B 残留） | 已在 implementation-log §8 R-B 行登记：产物 status 与阶段态独立、阶段 done ≠ 产物 confirmed；j-delivered 等 done 阶段上游 draft 产物留后续核对（T-A20 / R-A 定案时），**不为关 P3 自动审批**，R-B 保持“部分定案、未关” |
| tasks 页首 r6.4 ↔ README ↔ implementation-log 页首 / §9 ↔ interface-handoff 页首 | 一致：第二批 6 项约 7 h、67 / 102 h、224 / 224、首批 10 已完成、57 未开始、blocked 待 R8.1 |

### 4. 结构复算（脚本、只读，作用于本轮最终 tasks.md 并与 HEAD `7b91a2c` 版本对比）

- **67 个任务**（HEAD 66，新增 T-A09b，无删除）；编号唯一、排序规则 “T-Xnn < T-Xnna < T-Xnnb < T-X(nn+1)” 成立；合计 **102 h**（A 28·43 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4）；每项 0.5～2 h（max 2.0 / min 0.5）；依赖全部向前、无环（0 例外）。
- 完成标准 **224** ↔ 验证命令 **224**，逐任务 1:1、编号连续（0 例外）；每条标准含 AC 引用或 spec §4 口径（0 例外）。相对 HEAD（221 / 221）：+3 = T-A09b；T-A10 仍 6 / 6。
- 与 HEAD 的任务级差异：仅 T-A07 / T-A08（状态行旁注）、T-A09b（新增）、T-A10（依赖、标准 5、命令 5、状态行）；另 T-A07 / T-A08 / T-A23 / T-A24 修改范围有文字注（不在标准 / 命令中）。其余任务预计 / 依赖 / 标准 / 命令 / 状态零变化。
- 状态：**10 × 已完成**（T-A01～T-A09、T-A09a，未改）、**57 × 未开始**，无其他值；H 4 / 4 另带 `frontend-workbench-v2`。
- 矩阵 46 行 = spec 46 AC（差集空）；“部分前置”均为最终任务祖先（0 例外）；任务正文 AC 引用 ↔ 矩阵双向一致（AC-009-1 工程门除外，0 例外）。
- `-t` / `-g` 标题（与 R8 同口径，全文件计）**215** = 213 `WI` + 2 个 §1 占位符（R8 时 214 = 212 + 2；+1 = T-A09b 命令 1）；任务命令中的标题 162（HEAD 161）。单测 / e2e 路径全部在 `tests/{unit,component}/jobs/**` / `e2e/jobs/**`，唯一例外仍是 T-A09 命令 3 的三份既有契约测试（有意整文件跑）。
- 第二批 6 项：T-A09b 0.5 h·3、T-A10 2 h·6、T-A22 1 h·3、T-A22b 1 h·3、T-A23 1.5 h·3、T-A24 1 h·3 = **约 7 h、21 条命令**。

### 5. 观察项与未解决项

- **O-R10-1（标准 5 范围）**：T-A10 标准 5 按协调器口径只断言 12 个种子空态的真实读回，未纳入 A 建议的“已开始阶段返回原样例”；已开始样例由 T-A09b 标准 2 在 fixture 层覆盖，T-A10 的读 API 原样返回状态层副本、不按阶段态过滤。是否足够由 A R8.1 判断，本报告不代判。
- **O-R10-2（T-A09b 估时）**：0.5 h 采用 A 在 B-12 中给出的估值；按 S-22，实施实际超 2 h 仍须停下回报（远低于上限，仅兜底）。
- **不变的未解决项**：B-12 是否关闭、V-02 补勾（A R8.1）；R-A（T-A16 / T-A19 前）、R-C（T-G06）、R-E（T-A17）、R-F（T-A21）未处理、未经 Walter 风险接受；R-B 残留（S-35）留后续核对；R-D 口径已定、未修；H-1 ④ 与其余 H-x 交付；interface-handoff §5（含 §5-8）待 v2 接收方确认；H 组 v2 外部闸门；本树文档待集成人审阅提交。

### 6. 结论（Analyze R10）

- B-12 最小关闭要求的五个落点中，(1)～(4) 已在 Tasks / 记账文档落实，结构独立复算通过；(5) 待 A 新会话 R8.1 增量复核——**本作者不宣布 B-12 关闭、不勾 V-02**。
- spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ README：r6.4 修改**无冲突**；需求未变更，无新机制、无新校验、无新公开接口名。
- **任务**：67 个 / 约 102 h；标准 / 命令 224 / 224；首批 10 已完成不变、57 未开始。
- **开工**：第二批（T-A09b → T-A10；T-A22 → T-A22b；T-A23、T-A24；6 项约 7 h）在 R8.1 通过并提交前 **blocked**，不开码。
- **已实施 / 已验收**：第二批均为否；本轮未写代码、未运行任何产品测试。

---

## Analyze R11（只读；第二批 T-A09b～T-A24 实施后的 Converge 配套分析，2026-10-29；区别于 Checklist R8.1，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：Converge / 状态记账（含本分析）；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18625-c9a1-76a3-aa8d-fefefec99096`）。
> - **通道**：本轮协调器对 `claude-bridge/claude-opus-5-5` 的最小真实调用 exit 1，失败类别 = **provider / invocation error（未确认为 quota）**；同模型官方通道最小调用 exit 0，正式任务也由官方通道完成。按 AGENTS §6 规则 2 只换通道、不换模型，未改 provider / key / 路由 / 全局配置。
> - **派工**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter 的“允许”授权和本轮“继续”持续有效。
> - **性质**：本报告不勾选 checklist；当前有效审核 = Checklist R8.1（`34d339e`，本树 blob `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`，未改）。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-converge-batch2`（`docs/workbench-interaction-batch2-converge` @ `27e59e6`，起始 clean）；只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff，新建 `converge-batch2.md`，以及 `specs/README.md` 本 feature 两行。
> - **未改动**：代码 / 测试 / fixture / spec / checklist / 已有 Review 原件 / 首批 Converge 报告 / 权威 docs / 根 HANDOFF / 其他 worktree。
> - **未执行**：未 commit / push / merge；未安装；未启动服务或子 agent；**未运行任何产品测试**。
> - **只读脚本**：`C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/converge-fixture-check.py`（非项目产物，不清理）。

### 1. 重新读取与输入

- **本轮开始时重新读取**：
  - 工作流与权威文档：AGENTS.md、`docs/plan.md`、`docs/interaction.md` §3.2、`docs/designUI.md` §2.4 / §6。
  - 本 feature 规格：冻结 spec.md、plan.md、tasks.md、checklist.md R8.1 节（只读）、本报告 R10、implementation-log、interface-handoff、`converge-batch-a09a.md`、`review-batch-a09a.md`、`specs/README.md`。
  - 实施者两份脱敏回报（只作结果来源）。
- **固定输入**：
  - 代码 diff `34d339e..27e59e6 -- frontend`：6 个提交、25 个文件，非 frontend 零差异。
  - spec.md / checklist.md 相对 `34d339e` 零差异。
  - 生产方集成树 HEAD = `27e59e6`（只读核验，旁证）。
  - main：`cf8e11b` 相对 `90187f7` 的 frontend / docs / AGENTS / backend / design 零差异；本地 `main` 与 `origin/main` 现为 `072bb12`（PR #11 v2 S0），相对 `90187f7` 有 12 个前端 / 设计文件差异。本批 pin `90187f7`，不导入（见 §5）。

### 2. 本批范围与结论

| 项 | 结果 |
|---|---|
| 范围 | T-A09b、T-A10、T-A22、T-A22b、T-A23、T-A24（6 项，约 7 h）；全部是“部分前置”，T-A23 另对 AC-001-5 为“组件部分最终”（人工 M-01 归 T-G10） |
| 代码 ↔ 完成标准 | 6 / 6 有对应实现；21 条命令的 `-t` 标题全部存在，用例展开数与回报数一致；T-A09b 的 fixture 校正经只读脚本证实：12 空 / 已开始未变 / `jobs.json` 未变 |
| 命令结果 | **实施者执行、本会话未重跑**：逐任务原定命令全部通过；末轮全量单测 27 文件 833 / 0、六守卫、`contract --check` 15 / 10 / 2、typecheck、lint、既有 shell + agent E2E 24 / 0。两次新增测试的首跑失败（A10 匹配器、A23 选择器）都只修了新测试 |
| 所有权 | 只改 tasks 修改范围内的文件；`app/**`、`shared/**`、`agent/**`、`workbench/**`、`scripts/**`、package / 锁、`types.ts`、三份既有契约测试、`jobs` / `interventions` / `uploads.json`、e2e 均零差异 |
| 新增任务 | 无 |
| 本批判定 | **已收口，待本批独立代码 Review** |
| feature 判定 | **未收敛（尚未实施 + H 组外部阻塞）**：16 / 67 已实施（10 已完成 + 6 待审）、51 未开始；46 AC 最终验收 0 |

### 3. 实施接口定形 ↔ 需求（是否变更）

| 实施事实 | 依据 | 判定 |
|---|---|---|
| `listJobs(filter?: {status?, type?, title?})`；strict；title 区分大小写子串、空串不限制 | plan §2.4 / T-A10 “状态 / 类型 / 标题子串组合筛选” | 精度 |
| 未知锚在任何场景都返回 not_found，error 场景只对已知目标返回 adapter_error | S-13 / T-A10 标准 2 / plan “未知锚 not_found” | 精度（先后顺序；读法差异作为观察项交给 Review，`converge-batch2.md` §5 O-B2-2） |
| `jobRoutes: RouteRecordRaw[]` + `registerJobRoutes(router, pinia)` | plan §2.1 “导出两条记录” | 精度（导出名） |
| `useSessionStore().context` 深只读 + `bindRouter(router): void` | plan §2.1 / §2.3【r6.3】 | 精度（只读覆盖到字段层） |
| `diffLines(before, after): LineDiffResult`（`lines` / `summary` 具名判别） | plan §2.2 / §6；T-A24【r6.3】+ S-36 | 精度 |

**结论**：都是既有需求内的名称 / 类型精度，**不是需求变更**，不回 Clarify / Gate 1。已以【r6.5 精度】同步 plan（页首、§2.1、§2.2 工具行、§2.4 `listJobs` 句）、tasks（T-A10 / A22 / A22b / A24 修改范围）、interface-handoff §3 两行与落地核对段。不复制实现算法，不增加要求 / AC / 机制。

### 4. 状态回写与结构复核（tasks §1-8）

- 6 项状态改为“**已实施（batch2，待本批独立代码 Review；不表示 AC 最终验收）**”，并带固定 commit 与“实施者执行”的验证摘要；**不写“已完成 / 已验收”**。首批 10 项的状态行不改。
- 页首新增“当前实施进度（Converge batch2）”块：16 / 67 已实施，51 未开始，下一可起步任务 T-A11。r6.4 块中“blocked / 57 未开始”保留为 R8.1 之前的历史原文，以便追溯审查输入。
- **结构**：只改了上述 6 条状态行，以及 T-A10 / A22 / A22b / A24 修改范围中的【r6.5】追加文字。67 个任务的编号 / 顺序 / 预计 / 依赖 / 完成标准 / 验证命令均未改；标准 ↔ 命令仍为 **224 ↔ 224**，合计约 102 h；§5 矩阵 / §6 DAG / §7 口径未改。状态值共三种：10 × 已完成、6 × 已实施（batch2，待本批 Review）、51 × 未开始。
- P3 / 精度项：
  - **S-37**：断言已落实（标准未改字）。
  - **R-B**：12 个样例已校正并读回；done 阶段上游 draft 残留保留，不自动审批，仍部分落实、未关。
  - **R-D**：未加新 guard，待后续写方法按构造保持。
  - **R-A / R-C / R-E / R-F**：未处理、未冒称关闭。

### 5. 上游移动（main `072bb12`）

- **事实**：PR #11 把 frontend-workbench v2 S0（T-V2-01 / 02）阶段性合入 main。`app/nav.ts` 新增 `jobs` 壳占位（`placeholderOwner: 'workbench-interaction'`），`router.ts` 去掉 research 深链，v2 `e2e/shell.spec.ts` 断言 `/jobs` 为该 owner 的占位页（v2 tasks 写明这只是 S0 证据，由 T-V2-09#4 在 H-3 集成后迁移）。`main.ts`、`contracts/**`、`agent/**`、`shared/**`、脚本、依赖零差异。
- **对本 feature 的影响**（尚未发生，本批 pin `90187f7`）：同步后：
  - ① `routes.spec.ts` 中“真实路由表新增两条、原表无 `jobs`”的断言会失效（同名替换路径已由占位替换用例覆盖）；
  - ② 本 feature 集成树里的 v2 shell E2E 在 `/jobs` 处会因同名替换而失败，直到 T-V2-09#4 迁移。
- **口径**：这是基线变化，不是本批相对 pin 基线的缺口。按 tasks §7（“基线再变须重核”）：集成人若要同步，须先修订 tasks §0.0 并重跑 Analyze，经 A 复核后，再派任务调整测试，并与 v2 所有者协调迁移时点。本报告**不新增任务、不导入、不代改 v2 文件**，交集成人 / Walter 决定。

### 6. 观察项与未解决项

- **观察项**（交本批独立 Review 判定，不是缺口）：O-B2-1～O-B2-6，见 `converge-batch2.md` §5。
  - O-B2-1：状态共享时机。
  - O-B2-2：error 场景下的未知锚。
  - O-B2-3：模块状态在 client 创建前未初始化，需 T-A18 核对。
  - O-B2-4：徽标统一 ok 边色。
  - O-B2-5：S-32 用行内 eslint-disable。
  - O-B2-6：真实路由表断言只适用于当前基线。
- **S-31 写后统一刷新核对**：本批没有领域写路径，不适用。
- **外部 / 流程**：
  - ① 本批独立代码 Review（审核员 A，新会话、异模型）；
  - ② H-2·标签 / H-3 / H-4 / H-1 的 ④ 须 `integration/frontend-workbench-v2` 所有者真正集成后登记，生产方集成树 `27e59e6` 只是旁证；
  - ③ interface-handoff §5（含新增 §5-9）待 v2 接收方确认 / 集成人协调；
  - ④ H 组 v2 外部闸门；
  - ⑤ main `072bb12` 同步决策；
  - ⑥ 本树文档待集成人审阅提交。

### 7. 结论（Analyze R11）

- **一致性**：spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 代码，在本批范围内**无冲突**；接口定形差距已按精度同步；没有需要回 Clarify 的歧义。
- **本批**（6 项）：**已收口、待本批独立代码 Review**。
- **feature**：**未收敛（尚未实施 51 项 + H 组外部阻塞）**；46 AC 最终验收 0。
- **不是** Review 通过、不是 Gate 2、不是 Handoff；H-x 无一“已交付”。

## Analyze R12（只读；第三批 T-A11 / T-A12 / T-A13 / T-A22a 开工前精度澄清 r6.6 之后，2026-10-29；区别于 Checklist R8.1，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：第三批 Plan / Tasks 精度准备 + 本分析；实际模型 = **claude-opus-5-5 via anthropic**。
> - **通道**：本轮协调器对 `claude-bridge/claude-opus-5-5` 的最小真实调用 exit 1，失败类别 = **quota / rate / spend_limit**；同模型官方通道 exit 0。按 AGENTS §6 规则 2 / 5 只换通道、不换模型，本窗口不重试已明确限额的通道，未改 provider / key / 路由 / 全局配置。
> - **派工**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`；用户本轮“继续”，Walter 的“允许”授权与集成人指定在既有 tasks 范围内持续有效。
> - **性质**：只读报告；不勾选 checklist。当前有效审核 = Checklist R8.1（`34d339e`，本树 blob `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`，未改）。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-plan-batch3`（`docs/workbench-interaction-batch3-plan`，起点 `f1b7c06bc7202685fdd3786d74c294cac6ae406e`，起始 clean）；只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff 与 `specs/README.md` 本 feature 行。
> - **未改动**：代码 / fixture / 测试 / spec / checklist / 已有 Review 与 Converge 原件 / 权威 docs / 根 HANDOFF / 其他 worktree。
> - **未执行**：未 commit / push / merge；未安装；未启动服务或子 agent；**未运行任何产品测试**。
> - **只读脚本**（非项目产物，不清理）：`C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/` 下 `analyze-r12-struct.py`、`analyze-r12-structure.log`（本轮）/ `analyze-r12-structure-HEAD.log`（`f1b7c06`）、`analyze-r12-std-cmd-diff.log`。

### 1. 重新读取与输入

- **工作流与权威文档**：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`、`docs/interaction.md` §3.2 / §3.4（ingest / map_fix）/ §5 源材料、`docs/architecture.md` §3（投放路径与来源说明）/ §4.7 / works 目录。
- **本 feature 规格**：冻结 spec.md（R-001 / R-003 / R-007 / R-008、§4 持久化）、plan.md、tasks.md（页首、§1、§2a、T-A10～T-A13、T-A17 / T-A18 / T-A21 / T-A22a、B03 / B04、C01～C04、G04、§5～§7）、checklist.md R8.1（只读）、本报告 R11、implementation-log、interface-handoff、`review-batch2.md`、`specs/README.md`。
- **真实代码（本树 = 代码 `27e59e6`，逐文件读，不以摘要代替）**：
  - `contracts/mock/job-state.ts`、`contracts/mock/index.ts`、`contracts/{types,client,methods,index}.ts`、`contracts/real/index.ts`、`main.ts`、`agent/events.ts`（终态类型）、`stores/layout.ts`（既有 localStorage 写法）。
  - fixtures `jobs/{uploads,job-detail,interventions,jobs,deliverable}.json`（用 node 只读汇总）。
  - 测试：`tests/setup.ts`、`tests/unit/jobs/{job-state-read,contract-version,real-stubs}.spec.ts`、v1 `tests/unit/{mock,contracts}.spec.ts` 的相关段。
- **固定输入**：spec.md / checklist.md 相对 HEAD 零差异；main 仍 `072bb12`（协调器 ls-remote 实查），本批 pin `90187f7`；消费分支 `integration/frontend-workbench-v2` 仍 `3f63273`。

### 2. 决定精度的代码事实

| # | 事实（文件:行为） | 影响 |
|---|---|---|
| F-1 | `mock/index.ts` 的 `readJobFixtures()` 在函数内读 `window.__FAI_MOCK__?.jobFixtures` getter；工厂调用它一次 | A11 若再判“有无覆盖”会读第二次 → 工厂先取局部值，私有 helper 共用（`readJobFixtures()` 形状不变） |
| F-2 | `JobState = {scenario, jobs, details, deliverables, interventions, uploads, emptyJobIds}`，无运行时控制；`commit` = clone → mutate → `JobStateSchema.parse` → 替换 | 快照子集 = 去掉 scenario / emptyJobIds；save 挂在 commit 替换之后 |
| F-3 | `state.uploads` 只有 `{uploads, previews}`；`InterventionSchema.jobId` 必填 | 未归属投放的确认 / 删除无法写事件；修正前 mapping 需要别处承载 |
| F-4 | `UploadSchema` 已含可选 `quarantineReason`；`uploads.json` 的隔离样例带原因；plan §3 白名单原文未列 | 不补列则恢复后隔离原因丢失（AC-003-6 “隔离显示原因”） |
| F-5 | 现有 fixture 中没有“pending_validation + quarantineReason”的投放 | T-A12 标准 2 的隔离样例经 `jobFixtures` 覆盖注入（系统边界），不改 fixture |
| F-6 | `WriteReceiptSchema` 已存在并注册；`DataClient` 只有 13 个方法 | 新写方法回执复用它；只需 `CreateJobInput` / `IntakeReceipt` 两个新 schema |
| F-7 | `job-state-read.spec.ts` 的 `WI scenarios read` 中，“this batch stays entirely in memory…”断言 normal 也零 storage；“real commit…”末句断言新 normal client 丢弃提交 | A11 起两例语义必然变化（属本任务语义变更处，允许改写） |
| F-8 | `tests/setup.ts` 不清 localStorage；v1 `mock.spec.ts` 的 `dataRequests` 是显式十方法清单；`contracts.spec` / `real-stubs.spec` 按 `dataMethods` 动态比较 | 新 spec 自清 localStorage；新增方法不破 v1 三份契约测试 |
| F-9 | 读方法的场景来源 = `jobState.getJobScenario()`（R2-E）；未知锚先于 error | 写方法沿用同一来源；error 拒绝放在 commit 替换前，以保持“未知锚独立 not_found” |
| F-10 | `main.ts` 已有 agent store 的应用级订阅 + `onUnmount` / HMR 解除 | T-A22a 订阅照抄先例 |

### 3. 精度项逐条判定

| 精度项 | 依据（既有 what / AC / plan） | 判定 | 是否触及既有硬约束 |
|---|---|---|---|
| 持久化读时机：normal 且无覆盖才读一次 `fai.jobs.v1`；getter 只读一次 | plan §2.3 / §3、T-A11 标准 4、H-6 | 精度 | 否（落实既有约束） |
| `persistence.ts` API 与状态订阅 | T-A11 上下文（`getPersistenceStatus` / `onPersistenceStatus`、`ok/degraded/unreadable`） | 精度（只补函数名与回调口径） | 否 |
| 512 KiB / setItem 异常 → degraded，业务成功、每次尝试、每 key 承诺 | plan §3、T-A11 标准 2 | 精度（“转内存”读作该次未写；无跨 key 事务） | 否 |
| 损坏 / version≠1 → unreadable、不覆写直到重置 | plan §3、T-A11 标准 3 | 精度 | 否 |
| 重置：会话 seeds / scenario；删两 key → 重建 → 重写 `fai.jobs.v1` | plan §2.4 场景段、T-G04 标准 1（“key 被重建”）、R2-E | 精度（统一 plan “删除并重建”与 T-G04 “key 被重建”两种表述） | 否 |
| 快照白名单补列 `quarantineReason` | F-4；AC-003-6 | 精度，但**改动 plan §3 白名单与 T-A11 标准 1 的文字** | **是（文字）**：字段为既有契约字段、fixture 合成文本，非投放原文；实质隐私边界不变 |
| 内部 `mappingHistory {uploadId, mapping, status, replacedAt}` | plan 矩阵 map_fix “原记录与修正前 mapping 保留”；F-3 | 精度（未归属投放没有其他载体时的最小承载；不是公开 API / 新产物 / 新流程） | 新增一项**持久化内容**（结构化映射，非原文）；与上项同请 Review 核对 |
| 写方法签名与回执；`CreateJobInput` / `IntakeReceipt` | plan §2.4 方法表与“写回执包含…”；T-A12 / A13 修改范围 | 精度（本任务契约本来要定的类型） | 否 |
| 回执 `inbox` = 全局计数，A21 前为真实 0 | `WriteReceiptSchema.inbox`；plan §2.3 收件箱 | 精度 | 否 |
| slow 延迟后执行；error 在 commit 替换前拒绝，未知锚仍 not_found | plan §2.4 场景表；T-A12 标准 4 | 精度 | 否 |
| createJob：human、collecting / collect、R,N,N,N、交付侧初始空产物；不预建 recipe / analysis；dataset 首投放时建 | plan §4.1、T-A12 标准 1、R-D ⑤ | 精度（“初始空产物”的最小具体化，不猜业务参数） | 否 |
| 合成预览固定值；confirm 只从 pending；fixture 预置原因 → quarantined | plan §2.4 `ExtractionPreview` 行、§3 “mock 预览由输入类型 + 人工映射驱动”、T-A12 标准 2、R-D ② | 精度 | 否 |
| 未归属投放的 confirm / remove 不写事件；assign 只补一条 ingest、移动记录 | plan 矩阵 ingest 行、§4.2；F-3 | 精度（不伪造 jobId、不新增 kind、不重放） | 否 |
| 以作业为目标的写在入口查一次 delivered / cancelled | plan §4.6、场景表 job-delivered 行 | 精度（既有领域规则；全方法只读门仍归 T-A17） | 否（非 R-D 新 guard） |
| 当前列表投影只在 `listUnassignedUploads` 与 collect.uploads | spec R-003 / AC-003-5、plan 矩阵 remove_source “只从当前视图移除” | 精度（与“不按阶段态过滤”不冲突：按 removed 标记，不按阶段态） | 否 |
| cancel 保留阶段 / 产物快照、不 abort | plan 矩阵 cancel_job、§4.6 | 精度 | 否 |
| jobsStore 类型、refresh / applyFilter / createJob / receiveAgentEvent 口径与测试方式 | plan §2.3 r6、T-A22a、H-2 ①～⑤ | 精度 | 否 |
| `job-state-read.spec.ts` 两例改写 + 清 localStorage | F-7 | 本任务语义变更处的回归调整（不改 v1 三份契约测试） | 否 |

**结论**：全部是既有需求与既有设计内的机制 / 类型精度；**没有冻结需求变化，不回 Clarify / Gate 1**；未新增任务、标准或命令；方法集与动作矩阵不变。

### 4. 一致性（spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log）

- **spec**：§4 持久化（浏览器本地、真实持久化归 `api`）与 R-003 的“待归属池 / 修正后确认才入库 / 三种状态”均被覆盖；未引入 spec 非目标（真实解析 / 抓取 / 闸门 / 验证队列）。
- **plan ↔ tasks**：plan §2.3 / §2.4 / §3【r6.6】是机制权威；四个任务的【r6.6 精度】只引用并给落地 / 测试提示，没有第二套口径。T-A11 标准 1 的补列与 plan §3 同句同义。
- **跨任务口径**：
  - T-A17 标准 3 仍是逐方法只读拒绝的验收处；本批入口检查不冒称已完成。
  - T-A18 承接“不 abort / 晚到事件隔离”；T-A21 承接收件箱条目、已读 id 读写、回执计数来源。
  - T-B04 承接 `openJob` / 详情重读；T-G04 承接横幅。
  - 以上衔接无矛盾。
- **既有下游断言**：
  - T-B03 e2e 取 `fai.jobs.v1` 中新作业参数：快照含 jobs，满足。
  - T-C04 e2e 取 ingest 事件与 Upload 记录：快照含两者，满足。
  - T-C02 “隔离显示原因”：`quarantineReason` 持久化后仍可显示。
  - T-C03 “归入后 `updatedAt` 与顺序变化”：以作业为目标的写更新 updatedAt，满足。
- **interface-handoff / implementation-log / README**：只同步当前状态、§3 公开接口精度（`useJobsStore().createJob` 返回 `Job`）与第三批派工登记；H-x 交付状态不变（H-2·列表 / H-6 仍缺提供任务，未交付）。

### 5. DAG 与开工门槛

- 依赖链：T-A11（依赖 T-A10，已完成）→ T-A12（依赖 T-A11）→ T-A13（依赖 T-A12）；T-A22a 依赖 T-A09a / T-A10 / T-A22（均已完成）与 T-A12（本批）。按批内串行顺序全部满足；脚本复核无环、全部前向依赖。
- 门槛：Checklist R8.1 仍为当前有效且 26 / 26；Walter 授权与集成人指定持续有效；r6.6 不改 checklist 覆盖的结构（任务 / 依赖 / 工时 / 标准与命令数），不需要新 Checklist 轮次。
- 上游：main `072bb12` 不在本树祖先，本批继续 pin `90187f7`，不自动同步。R2-D 同步流程（§7 重核 → Analyze → A 定向复核）保持不变，但**不是本批的新人工门**。
- 消费分支 `integration/frontend-workbench-v2` = `3f63273`，四个已具备 ①②③ 的切片 ④ 仍缺；本 feature 不写、不重建 v2 树。

### 6. 结构复算（脚本、只读，作用于本轮最终 tasks.md 并与 HEAD `f1b7c06` 对比）

- 67 个任务、编号唯一、排序正确；合计 102.0 h（A 28 / 43、B 7 / 10.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）。
- 完成标准 / 验证命令 **224 / 224**，逐任务 1:1、编号连续；problems = []；依赖无环且全部前向。
- AC 矩阵 46 行；部分前置均为最终任务祖先；矩阵 ↔ 任务 AC 双向一致。
- 状态：16 × 已完成、51 × 未开始。本批 4 项命令 5 + 5 + 4 + 5 = **19 条**，工时 7.0 h。
- 与 HEAD 对比：结构日志除集合打印顺序外完全相同。标准 / 命令 / 预计逐任务文本比对后，**只有 T-A11 标准 1 的一处文字补列**（`quarantineReason`），无其他标准、命令或预计变化。

### 7. 观察项与未解决项

- **粒度**：T-A12 已到 2 h 上限，工作量为 4 个方法、2 个 schema、`mappingHistory`、dataset 修订 helper 和 4 组测试。r6.6 的作用主要是减少临时猜测，判断不属于已知超额，因此不预先拆分；若实际超过 2 h，按 tasks §7 S-22 停下并报告，不硬塞。T-A11 同样到上限（含两例既有回归改写）。
- **未关的 P3**：以下均不属本批。
  - R-A：T-A16 / T-A19 开工前定案。
  - R-B：残留项未关。
  - R-C / R2-A：归 T-G06。本批新增方法的描述沿用实现中立写法，mock 场景句不写进方法描述。
  - R2-C：首个消费徽标的页面任务或 T-G10 前处理。
  - R-E：归 T-A17。
  - R-F：归 T-A21。
  - 与本批相关的两项：R2-B 由本批测试固定调用顺序，不加 guard；R-D 的 ② / ⑤ 由本批写方法按构造保持，不加 refine。
- **`mappingHistory` 无读 API**：有意为之，不新增公开历史 API。本批经 normal 快照验证；后续若需展示，须走需求流程。
- **未归属投放的删除理由不持久化**：没有 jobId 就没有事件载体，理由只作确认输入。这是既有契约（`Intervention.jobId` 必填）的直接结果，不是遗漏。
- **外部 / 流程**：
  - H 组的 v2 外部闸门；
  - 四个切片的 ④ 待 v2 所有者登记；
  - main `072bb12` 的同步决策；
  - 本树文档待集成人审阅提交。

### 8. 结论（Analyze R12）

- **一致性**：在第三批范围内，spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 真实代码**无冲突**。先前会让实施者临时猜测的点已经定案：F-1 / F-3 / F-4 / F-5 / F-7 / F-9，以及回执、预览和投影。
- **是否需要 A 定向复核**：
  - 绝大多数是任务字段 / 类型精度和正常流程，**不自动触发新的 A 轮次**。
  - 唯一触及既有硬约束文字的是持久化白名单：补列 `quarantineReason`，另增内部 `mappingHistory`。实质隐私边界不变。
  - 建议由第三批独立代码 Review 明确核对这一点。是否在开码前另做限定范围的 A 定向复核，由 Walter / 集成人裁量；本报告不代定，也不声称 R8.1 自动覆盖 r6.6。
- **第三批**：4 项（T-A11 → T-A12 → T-A13 → T-A22a，约 7 h）**全部待实施**。完成并通过本批 Review 后预计为 20 / 67，现在不预写成功。
- **feature**：16 / 67 已完成，51 未开始，**未收敛**；46 AC 最终验收 0；H-x 无一已交付。本报告不是 Review / Gate 2 / Handoff。

---

## Analyze R12.1（只读；第三批 r6.6.1 范围精度，2026-10-29；R12 的范围补记，不占后续 Converge 配套的 R13 编号；区别于 Checklist R9，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：Tasks 范围小补 + 本分析；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a186d0-43c8-7219-9857-eadff71941bb`）。
> - **通道**：`claude-bridge` 本窗口已明确 quota / rate / spend_limit，按 AGENTS §6 规则 5 不重试；官方通道正常。未改 provider / key / 路由 / 全局配置。
> - **派工**：集成人协调会话 `01a18388`。Walter 的“允许”授权与集成人指定在既有 tasks 范围内持续有效，本轮不新增人工授权。
> - **性质**：只读报告，不勾选 checklist。当前有效审核 = **Checklist R9**（集成人提交 `ab742f5801628b15324fc998f03959482fd31d9d`，`checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`，26 / 26，本轮未改）。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-plan-batch3`（`docs/workbench-interaction-batch3-plan`，起点 `ab742f5`，起始 clean）。本轮只写 tasks.md（T-A11 / A12 / A13 修改范围）、本报告（页首补记一行 + 本节）、implementation-log.md（页首补记、§7 四行、§10）。
> - **未改动**：代码 / fixture / 测试 / spec / plan / checklist / interface-handoff / README / 审核原件 / 权威 docs / 其他 worktree。
> - **未执行**：未 commit / push / merge；未安装；未启动服务或子 agent；**未运行任何产品测试**。
> - **只读脚本**（不清理）：沿用 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/analyze-r12-struct.py`，本轮输出 `analyze-r121-structure.log`（本轮 tasks）/ `analyze-r121-structure-HEAD.log`（`ab742f5`）。

### 1. 起因与输入

- **起因**：Implement（Astra，`openai/gpt-6-astra`，实施树 `feat/workbench-interaction-astra` @ `ab742f5`，clean）在 T-A11 开码前按范围纪律停下，回报了一个**确定的**范围遗漏，未改代码、未提交、未运行本轮验证命令。这不是模型调用失败（不触发 §6 回退），也不是产品测试红。
- **重新读取**：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`；本 feature plan §1（文件边界）/ §2.4【r6.6】签名；tasks §1-5、T-A10（修改范围 / 标准 4 / 命令 4）、T-A11 / T-A12 / T-A13 全文；implementation-log §10；本报告 R12（尤其 F-6 / F-8）；checklist §R9 的代码事实段与 C-02 / 第 107 行。
- **真实代码**（本树 = 第二批受审代码 `27e59e6` 起未变）：
  - `frontend/tests/unit/jobs/real-stubs.spec.ts`：`requests` 是 13 个显式条目，用 `satisfies { [Method in keyof DataClient]: () => ReturnType<DataClient[Method]> }` 约束。第一条测试断言 `Object.keys(dataClient)` 等于 `Object.keys(dataMethods)`，且 `Object.keys(requests)` 等于 `Object.keys(dataClient)`；第二条 `test.each(Object.entries(requests))` 逐键断言 `NotImplementedError`。
  - `frontend/src/contracts/client.ts`：`DataClient` 恰 13 个方法。

### 2. 差距判定

| # | 事实 | 判定 |
|---|---|---|
| G-1 | `satisfies` 映射类型要求 `requests` 的键与 `keyof DataClient` 完全一致（缺键或多键都是类型错误）。键集相等断言要求运行时也一致 | A11 加 `resetMockData`、A12 加四个方法、A13 加四个方法之后，若不同步加键，**typecheck（各任务工程门）与该测试都必然失败**。这是确定缺口，不是猜测 |
| G-2 | r6.6 的 T-A11 修改范围与 implementation-log §10 写权限只列了 `job-state-read.spec.ts` 两例改写。A12 / A13 也没有提这个文件 | **Tasks 层范围遗漏**。R9 代码事实段已写“real 桩须加键（在 T-A11 范围）”，但审核意见不构成实施者的写权限，Astra 停下是正确的 |
| G-3 | R12 F-8 把 `real-stubs.spec` 写成“按 `dataMethods` 动态比较”，与“新增方法不破 v1 三份契约测试”并列 | **R12 表述不精确（本节更正）**：键集比较是动态的，但 `requests` 表是显式清单且受 `satisfies` 约束，需要逐任务维护。F-8 对 v1 三份契约测试（`tests/unit/{mock,contracts,contract-doc}.spec.ts`）的结论不变 |
| G-4 | checklist §R9 第 107 行把 `real-stubs.spec` 列进“v1 三份契约测试”的括号里 | 只是措辞归类：该文件由 T-A10 新建在 `tests/unit/jobs/`，属本 feature jobs 测试，不是 v1 契约测试（tasks T-A09 的非 jobs 路径只有那三份）。不影响 R9 结论；checklist 不改，tasks T-A11 的“不改 v1 三份”句补列文件名以消歧 |

### 3. r6.6.1 落点与是否属于自然维护

- **tasks**：T-A11 / A12 / A13 的修改范围各加一条【r6.6.1 范围精度】，只允许在 `requests` 表追加本任务新增的 `DataClient` 方法的真实 stub 调用：A11 只加 `resetMockData`；A12 加 `createJob` / `submitIntake` / `getIntakePreview` / `confirmIntake`；A13 加 `listUnassignedUploads` / `assignUpload` / `removeUpload` / `cancelJob`。参数按实际输入类型给最小合法值，示例非强制。明文保留既有 13 键、`satisfies` 约束、两条断言与 describe / test 行为；**不改成动态枚举、不弱化校验**；v1 三份契约测试仍不改。
- **implementation-log §10**：三任务写权限各加一条；“一律不改”的 v1 三份契约测试补列文件名；补记 Astra 的停止原因与定性；建议（非新增标准）A11～A13 加跑 T-A10 命令 4。
- **自然维护的依据**：
  - T-A10 标准 4 / 命令 4 已经要求“real 桩覆盖全部 DataClient 键”，并由 `real-stubs.spec.ts` 验证；新方法加键就是维护这一条既有约束。
  - 加的是新方法的 real 桩调用，不是新行为、新 guard、新机制或新流程。
  - 所有权早已覆盖该文件：tasks §1-5“上述 jobs 测试”与 plan §1“相应 jobs 测试”一直归本 feature。**plan 设计不变、不改 plan**。

### 4. 不变项核对（脚本 + diff，只读）

- **需求**：冻结 spec、46 AC、方法集（plan §2.4【r6.6】签名）、动作矩阵均不变。不回 Clarify / Gate 1。
- **结构**（`analyze-r12-struct.py` 对本轮与 `ab742f5` 两版 tasks 复算）：67 个任务、编号唯一、排序正确；102.0 h；状态 16 × 已完成 / 51 × 未开始；完成标准 / 命令 **224 / 224**，problems = []；依赖无环；AC 矩阵 46 行，部分前置均为祖先、双向一致；第三批命令 5 + 5 + 4 + 5 = 19、7.0 h。两版日志**只在集合的打印顺序上不同**。
- **diff**：`git diff ab742f5 -- tasks.md` 共 3 个 hunk，全部落在 T-A11 / A12 / A13 的修改范围内（+12 / −1，那一处 −1 是“不改 v1 三份契约测试”句补列文件名）。状态行、完成标准、验证命令、预计、依赖、§5 矩阵、§6 DAG、§7 均无 hunk。
- **工程门与回归**：新键由各任务既有工程门的 typecheck（`satisfies` 全键）把关，运行时由 `real-stubs.spec.ts` 覆盖（T-A10 命令 4、批末全量 `test:unit`）。不新增标准 / 命令。

### 5. 是否需要 A 复核

- **不需要另开 A 设计复核**。本轮只把一条既有约束（T-A10 全键覆盖）的维护写进写权限：不改需求、设计、方法、标准、命令或结构，也没有触及 R9 判定过的任何设计点。R9 自己在代码事实中已把这件事判为“在 T-A11 范围”。
- 第三批独立代码 Review 仍会核真实 diff：`real-stubs.spec.ts` 应只增不改，既有键 / `satisfies` / 断言原样。

### 6. 结论（Analyze R12.1）

- 第三批范围内 spec ↔ plan ↔ tasks ↔ implementation-log ↔ 真实代码**无冲突**，G-1 / G-2 已由 r6.6.1 关闭，G-3 / G-4 是表述更正（不改 R9 结论，不改 checklist）。R12 其余结论有效。
- **状态**：第三批 4 项（T-A11 → T-A12 → T-A13 → T-A22a）**仍全部待实施**。集成人提交本修订并同步实施树后，再派 Astra 从 T-A11 继续；现在不预写成功。
- **feature**：16 / 67 已完成、51 未开始，**未收敛**；46 AC 最终验收 0；H-x 无一已交付。本报告不是 Review / Gate 2 / Handoff。
