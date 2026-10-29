# Feature: workbench-interaction 实施日志（implementation-log.md）

> **性质**：Implement 阶段的派工、授权、模型路由、真实基线与证据路径登记（AGENTS §6 规则 4 / 7 的“派工 / 回退简记”）。它**不是** Gate 2 Handoff、不是 `review.md`，也不是审核结论；正式 Handoff 仍按 AGENTS §2 第 11 步在 `review.md` 完成。
> **当前状态（2026-10-29 第三批独立代码 Review 后 + R3-A Converge 补修登记 r6.8；以本块为准，下一块 batch3 中的“4 项已实施、待第三批独立代码 Review / 20 / 67 / 47 未开始 / 下一可起步”为当时原文）**：
> - **进度**：**68 个任务、约 102.5 h**；**20 项已完成**（首批 `af95b66` 10 项、第二批 `f72a1a1` 6 项、第三批 `49edb7e` 4 项）；**48 项未开始**（原 47 项 + 新增 T-A22c）。46 AC 最终验收 0；feature **未收敛**（48 项未实施 + H 组外部阻塞）。
> - **第三批代码 Review**：审核员 A = claude-fable-5-1 via anthropic（新会话、独立 worktree，固定审文档 `e14ad25` + 代码 `0032fc6`），判**本批通过：0 P1 / P2，3 项 P3（R3-A～R3-C）**，另观察 O-R3-1～3；原件 `review-batch3.md` 由集成人原样提交于 `49edb7ebf7bd0fdb0ab9ea0767c33945b39e13cf`。A 亲跑全量单测 31 files / **951** / 0、19 条任务命令同数、既有 shell + agent E2E **24** / 0、六守卫 / contract / typecheck / lint、只读探针 8 例；R9 交代的隐私核对项经 A 认可。本记账不改 Review 结论。
> - **R3-A**：集成人决定现在修 → 新增 **T-A22c**（≤ 0.5 h，依赖 T-A22a，方案 b：`applyFilter(f)` 成功只写 `filter` / `filteredJobs`）。状态 = **修复任务已登记、待实施；实施后由新会话 A 做增量代码 Review 核 R3-A 关闭**（其他结论保留）。代码未修。派工准备见 §11。
> - **R3-B → T-C03 / T-A17，R3-C → T-G04**：留原归属，未修、未经 Walter 风险接受（§8 台账）。
> - **有效 Checklist**：仍为 R9 `ab742f5`（blob `74084c13…`，未改、不重勾）。T-A22c 是已审 Review 明确要求的 Converge 补修，不新增需求 / 机制，不另开 Checklist 轮次。
> - **H-x**：H-2·列表提供任务加 T-A22c；① `0032fc6` 含 R3-A、仍待修，**T-A22c 关闭前不放行 ④**；③ 5 / 4 / 7 / 9 现有 A 亲跑同数。H-6 仍缺 T-A21；H-5 / 页面切片未做。
> - **下一可起步**（脚本核）：**T-A22c**、T-A14 / T-A15 / T-A16、T-C01；T-B01 / T-B02 须待 T-A22c。
>
> 不是 Review / Gate 2 / Handoff。
>
> 【历史原文】**当前状态（2026-10-29 第三批实施后 Converge batch3；当时以本块为准，下列 r6.6.2 / r6.6.1 / r6.6 补记块中的进度与“下一步”为当时原文）**：
> - **进度**：**20 / 67 已实施**。前两批 **16 项已完成**（批次 Review 通过）；第三批 **4 项已实施、待第三批独立代码 Review**；**47 项未开始**。46 AC 最终验收 0；feature **未收敛**（尚未实施 + H 组外部阻塞）。
> - **第三批固定提交**（实施者 openai/gpt-6-astra，调用正常，未回退；代码 diff `ab742f5..0032fc6 -- frontend`，5 个前端提交，17 个文件）：
>   - T-A11 `c7ebccb`、T-A12 `742d6aa`、A12 test-fix `0a2d1a5`（r6.6.2）、T-A13 `a5ad11c`、T-A22a `0032fc6`；完整 SHA 见 §6 第三批表。
>   - 区间内另有两个纯文档补记 `e4031fa` / `1988463`，不计入源码提交数。
> - **集成**：集成人已 ff-only 并入生产方集成树 `integration/workbench-interaction` @ `0032fc6`（旁证，本会话只读核验）；v2 树与其他消费方树未写。
> - **Converge**（claude-opus-5-5 via anthropic）：本批**已收口、待第三批独立代码 Review**，未新增任务；观察项 O-B3-1～6 交 Review。见 `converge-batch3.md`、analyze.md「Analyze R13」。
> - **有效 Checklist**：R9 `ab742f5`（blob `74084c13…`，未改）。上游 main `072bb12` 不在祖先，继续 pin `90187f7`。
> - **H-x**：H-2·列表生产方 ①②③ 具备（③ 待本批 Review），④ 缺 → 待消费方集成（未交付）；H-6 仍缺 T-A21；H-5 / 页面切片未做。
> - **下一可起步**：T-A14 / T-A15 / T-A16、T-B01、T-C01（依赖已满足；批次由集成人决定）。
>
> 不是 Review / Gate 2 / Handoff。
>
> **当前状态补记（2026-10-29 r6.6.2 语义回归许可；以本块为准，下一块 r6.6.1 与再下一块 r6.6 其余内容仍有效）**：
> - **规范进度不变**：**16 / 67 已完成**、51 未开始（“已完成”= 批次代码 Review 通过）；46 AC 最终验收 0；feature 未收敛。
> - **第三批真实进展**（Astra 回报、协调器只读核对；本记账会话未跑任何测试）：实施树 `feat/workbench-interaction-astra` HEAD = `742d6aa3d671cee91c6cce856f657a103d510615`。
>   - **T-A11** `c7ebccb`、**T-A12** `742d6aa`：已实施、已提交，**待第三批正式批次 Review**。
>   - **T-A13**：已实现、定向命令通过，但**未提交**，工作区保留其改动；须待下述回归修好后再交付。
>   - T-A22a 未开始。
> - **停止原因**：A13 末轮全量 `test:unit` **925 pass / 1 fail**。唯一失败是 T-A11 的 `persistence.spec.ts` `WI non-normal` 参数化用例的 error 分支：它仍期待 error 下 `commit` 成功，而已批准的 A12 语义（plan §2.4【r6.6】）要求 error 在 commit 内、替换状态前拒绝。该文件不在 A12 / A13 写入清单，Astra 正确停下，未越权、未放宽生产规则。这是测试结果，不是模型调用失败，不回退。
> - **r6.6.2**：T-A12 修改范围只许改该用例的 error 分支（断言真实 commit 抛 adapter_error 且目标作业读回不变），其余断言全部保留；T-A13 对该文件无许可。任务 / 估时 / 依赖 / 224 ↔ 224 / 46 AC 不变。见 §10 与 analyze.md「Analyze R12.2」。
> - **下一步**：集成人提交本修订、定向同步三份文档到实施树（不动 A13 工作区改动）后，派 Astra 先做 A12 的 test-fix commit，再续 A13 交付与 T-A22a；不预写成功或“全绿”。
>
> **当前状态补记（2026-10-29 r6.6.1 范围精度；当时以本块为准，下一块 r6.6 其余内容仍有效）**：
> - **Checklist**：R9 通过（26 / 26，0 P1 / P2，P3 S-38～S-40），集成人提交 `ab742f5801628b15324fc998f03959482fd31d9d`（`checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`，本轮未改）。第三批当前有效 Checklist = **R9 `ab742f5`**；下一块“当前有效仍为 R8.1”为当时原文。
> - **Implement 开码前停止**：Astra（`openai/gpt-6-astra`，实施树 `feat/workbench-interaction-astra` @ `ab742f5`）在 T-A11 开码前按范围纪律停下。原因是确定的范围遗漏：`tests/unit/jobs/real-stubs.spec.ts` 的 `requests` 表以 `satisfies` 强制覆盖全部 `DataClient` 键，新增 `resetMockData` 必须加键，但该文件不在 r6.6 写入清单内。Astra 未改代码、未提交，**未运行本轮任何验证命令**。这**不是**模型调用失败（不触发回退），也**不是**产品测试红。
> - **r6.6.1**：T-A11 / A12 / A13 修改范围显式允许只在该 `requests` 表追加本任务新增方法的真实 stub 调用（A11 一键、A12 / A13 各四键）。67 任务 / 约 102 h / 224 ↔ 224 / 46 AC / 依赖 / 16 已完成 51 未开始均不变。见 §10 与 analyze.md「Analyze R12.1」。
> - **下一步**：集成人提交本修订并同步实施树后，派 Astra 继续 T-A11；不预写成功。
>
> **当前状态（2026-10-29 第三批派工准备 r6.6；以本块为准。下一块为第二批 Review 后记账原文，其进度数字仍然有效）**：
> - **进度**：仍为 **16 / 67 已完成**、**51 未开始**；46 AC 最终验收 0；feature **未收敛**。
> - **第三批**：**T-A11 → T-A12 → T-A13 → T-A22a**（4 项，约 7 h），开码前精度已补（plan §2.3 / §2.4 / §3【r6.6】，tasks 四个任务的【r6.6 精度】，analyze.md「Analyze R12」），**全部待实施**；完成后预计 20 / 67，不预写成功。派工范围、写权限与口径见 §10。
> - **结构**：67 任务 / 约 102 h / 224 ↔ 224 / 依赖不变；唯一改字的完成标准 = T-A11 标准 1（持久化白名单补列既有字段 `quarantineReason`）。
> - **需第三批 Review 明确核对**：持久化白名单补列 + 内部 `mappingHistory`（实质隐私边界不变）。开码前是否另做 A 定向复核，由 Walter / 集成人裁量。
> - **Checklist**：当前有效仍为 R8.1 `34d339e`（blob `99e096ad…`，未改）。
> - **上游**：main `072bb12` 仍不在祖先，继续 pin `90187f7`，不自动同步。R2-D 流程不变，不是本批的新人工门。
> - **H-x**：消费分支 `integration/frontend-workbench-v2` 仍 `3f63273`，四项 ④ 仍缺；本 feature 不写 v2 树。
>
> **当前状态（2026-10-29 第二批独立 Review 后记账；以本块为准，下列各“当前状态”块 / 行均为当时原文）**：
> - **进度**：**16 / 67 已完成**，**51 未开始**。“已完成”= 所在批次代码 Review 通过，**不表示 AC 最终验收**（46 AC 最终 0）。首批 10 项经 `af95b66`；第二批 6 项（T-A09b `75a1159`、T-A10 `1841029`、T-A22 `cc59e94`、T-A22b `b38cf43`、T-A23 `ebce4c8`、T-A24 `27e59e6`；代码固定 `27e59e610e2ab8c14e7c3db554609e52e40f5f76`）经独立 A 判**本批通过：0 P1 / P2，5 项 P3 R2-A～R2-E**。
> - **审核 artifact**：`review-batch2.md`，A = claude-fable-5-1 via anthropic（新会话、独立 worktree，固定审文档 `858025d` + 代码 `27e59e6`）；集成人原样提交于 `f72a1a187405e9f9dcba5bb22f47ad840141702d`，已 ff 到本文档树与生产方集成树 `integration/workbench-interaction`；只引用、不改写。A 亲跑证据见 §6 第二批补记。
> - **Checklist**：当前有效 = R8.1 `34d339eb1705310927f06d95aaf64bfc9bf4a5c3`（blob `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`，26 / 26，B-12 拆分已关）；R8 `7b91a2c` 未通过记录保留。
> - **feature**：**未收敛**（51 项未实施 + H 组 `blocked_by: frontend-workbench-v2`）。H-2·标签 / H-3 / H-4 / H-1 生产方 ①②③ 具备、**④ 均未取得**（待消费方集成，未交付）；H-2·列表 / H-6 / H-5 / 页面切片未交付。
> - **下一可起步**：T-A11（依赖 T-A10 已满足），之后按 tasks §6 DAG。Walter 授权（“允许”）在既有 tasks 内持续有效，不重复请求；仍逐批 Converge / 独立 Review，不替代全 feature Review / Gate 2。
> - **上游**：main `072bb12` 不在本批祖先，本批 pin `90187f7`；集成人决定本批不自动同步，后续同步须按 tasks §7 重核 → Analyze → A 定向复核，并与 v2 所有者协调 T-V2-09#4（R2-D）。不是 T-A11 的硬阻塞。
>
> 不是全 feature Review / Gate 2 / Handoff。
>
> 【历史原文】**当前状态（2026-10-29 第二批实施后 Converge batch2；当时以本行为准）**：
> - **进度**：**16 / 67 已实施**，**51 未开始**。首批 10 项（T-A01～T-A09、T-A09a）已完成，并经 `af95b66` 批次 Review，记录不改写。第二批 6 项**已实施、待本批独立代码 Review**：T-A09b `75a1159`、T-A10 `1841029`、T-A22 `cc59e94`、T-A22b `b38cf43`、T-A23 `ebce4c8`、T-A24 `27e59e6`。
> - **Checklist**：R8 未通过（`7b91a2c`，B-12 粒度）→ r6.4 拆出 T-A09b → **R8.1 通过**（`34d339eb1705310927f06d95aaf64bfc9bf4a5c3`，blob `99e096ad…`，26 / 26）。**当前有效 Checklist = R8.1 `34d339e`**（不是旧 R7 `9acf3de`）。
> - **集成**：集成人已 ff-only 并入生产方集成树 `integration/workbench-interaction` @ `27e59e6`（旁证）；未写 v2 树，H-x 的 ④ 全部缺。
> - **Converge 判定**（claude-opus-5-5 via anthropic）：本批**已收口、待独立 Review**，未新增任务。feature **未收敛**（51 项未实施 + H 组外部阻塞）；46 AC 最终验收 0。
> - **H-x 生产方证据**：H-2·标签 / H-3 / H-4 生产方具备 ①②③（③ 为待审核证据），④ 未取得 → “待消费方集成（未交付）”；H-1 维持原登记。
> - **上游**：main 已到 `072bb12`（v2 S0），本批仍 pin `90187f7`、未导入，见 `converge-batch2.md` §6。
>
> 不是全 feature Review / Gate 2 / Handoff；本行不预填本批独立 Review 结果。
> 【历史原文】**当前状态（2026-10-29 首批独立 Review 后记账；当时以本行为准，下一行“待独立 Review”为当时原文）**：**10 / 66 已完成**（T-A01～T-A09、T-A09a；代码固定 `13a3373`），**独立 A 本批 Review 通过（0 P1 / P2，6 项 P3 R-A～R-F）**，审核原件 `review-batch-a09a.md` 提交于 `af95b66505875609f7ed3f823e047cd16226a1c5`，已 ff 到本文档树与生产方集成树 `integration/workbench-interaction`；“已完成”= 本批代码 Review 通过，**不表示 AC 最终验收**：46 AC 最终 **0**，其余 **56 项未开始**，feature **未收敛**（尚未实施 + H 组外部阻塞）；H-1 ①②③ 具备（③ 现含 A 亲跑）、**④ 未取得**，其余 H-x 未交付。Walter 代码实施授权与集成人指定在既有 tasks 范围内持续有效，后续批次不需重复授权；本次在首批 10 项的清晰安全点收尾汇报（非用户暂停）。下一批入口按 tasks §6 DAG：T-A10 / T-A22 / T-A23 / T-A24。P3 后续定位见 §8。不是全 feature Review / Gate 2 / Handoff。
> 【历史原文】**当前状态（2026-10-29 Checklist R8 后 r6.4；当时以本行为准，下一行为当时原文）**：首批 10 / 67 已完成（不变；固定结果与 `af95b66` Review 不改写）。独立 A 的 **Checklist R8 未通过**（原件 `7b91a2c`；25 / 26，V-02 ☐；唯一 P2 = B-12 T-A10 粒度）。r6.4 只做 Tasks 层拆分：新增 **T-A09b**（R-B 种子校正，fixture-only，0.5 h，依赖 T-A08），T-A10 恢复核心 2 h（依赖 T-A09、T-A09b；标准 5 只保留真实 `getStageWorkspace` 读回 12 个种子空态）。**第二批 = T-A09b、T-A10、T-A22、T-A22b、T-A23、T-A24（6 项，约 7 h）**；任务 67 / 约 102 h，标准 / 命令 224 / 224。**blocked**：须 A 新会话 R8.1 增量复核关闭 B-12、补勾 V-02 并提交后才可开码；未写代码、未运行任何产品测试、无新 commit。R-B 落点改为 T-A09b（残留见 §8），R-D 口径不变，R-A / R-C / R-E / R-F 未处理。46 AC 最终 0；feature 未收敛；H-x 无一已交付。
> 【历史原文】**当前状态（2026-10-29 第二批派工准备 r6.3；当时以本行为准，下一行为当时原文）**：首批 10 / 66 已完成（不变）；**第二批 T-A10、T-A22、T-A22b、T-A23、T-A24 待实施**——派工范围、精度口径、命令与写权限见 §9；未写代码、未运行任何产品测试、无新 commit，不预写结果。R-B 已定案（fixture-only，归 T-A10）、R-D 口径已定（不加 refine、按构造保持），R-A / R-C / R-E / R-F 未处理（§8）。46 AC 最终 0；feature 未收敛；H-x 无一已交付。
> 【历史原文】**当前状态（2026-10-29 首批实施后 Converge；以本行为准）**：**10 / 66 已实施**（T-A01～T-A09、T-A09a，实施者 openai/gpt-6-astra，固定 commit 见 §6），已由集成人 ff-only 集成到生产方集成树 `integration/workbench-interaction` @ `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`；Converge（claude-opus-5-5 via anthropic）判本批范围**已收口、待独立 Review**，feature 整体**未收敛（尚未实施 56 项 + H 组外部阻塞）**；H-1 具备 ①②③、④ 未取得（未交付），其余 H-x 未交付。不是 Review / Gate 2 / Handoff。详见 `converge-batch-a09a.md`、analyze.md「Analyze R8」。
> 【历史原文】**当前状态（2026-10-28 建档）**：**尚未开码**。66 个任务全部“未开始”；没有实现提交、没有运行任何产品测试、没有集成 SHA。下文“证据”各栏均为待填，不预写任何成功结果。
> **建档者**：claude-opus-5-5 via anthropic（Plan / Tasks 精度修订与开工登记角色；bridge 本窗口已明确限额、未重试；未改 provider / key / 路由 / 全局配置）。本文件此后由集成人（见 §2）串行维护；实施者只回报，不直接改本文件以外的规格文档。

## 1. 授权与闸门

| 项 | 状态 | 依据 |
|---|---|---|
| spec v1.1 Gate 1 | 已过（冻结，未改） | spec.md 页首 |
| IMPL-GATE-R6 (1) A 定向复核 | **已满足**：Checklist R7 通过（26/26、0 P1/P2） | 审核原件提交 `9acf3de661187840ea5be6f6d6f78205872ac356`；`checklist.md` blob `7c219c071607596c813af6a3ebc1b651e25cd8d0` |
| IMPL-GATE-R6 (2) Walter 代码实施授权 | **已取得** | 协调会话问“是否允许开始代码实施，并由本会话担任集成人？”，Walter 回复原话“允许”。范围 = 本 feature 已审 tasks 内的代码实施 + 指定该协调会话为集成人；**不**代其他 feature 的 Gate 1 / Gate 2，**不**授权扩范围或改冻结 spec / AC |
| IMPL-GATE-R6 (3) 集成人 / 集成验证分支 / 实施 worktree | **已登记**（§2） | 协调器已实际创建两树 |
| r6.1 精度修订 | 已完成（文档） | 只吸收 R7 S-27～S-32 的措辞 / 断言精度；按 R7「下一步」2 不需重过 R7（analyze.md「Analyze R7」§2） |
| 开码前置：实施分支带入本规格 | **已登记本次导入**（由集成人提交并将实施树 ff-only 到本日志所在导入提交后生效） | 来源 `1ad796330997d3d4990ac513428ad7b2427d0422`；只导入 `specs/workbench-interaction/**`，README 只新增本 feature 行及自己的队列行 / 删除已完成的本 feature D-018 行；main 的权威 docs、H-01 修复、其他 feature 状态与规格全部保留。实施者开工前须确认本日志与来源规格已在实施树 |
| 授权规格种子（开码前置完成） | **已完成** | 定向导入提交 `8753fa9f65dae685f765f316b00e6287750f0cf7`（源 `1ad7963`；只含 `specs/workbench-interaction/**` 与 README 本 feature 行 / 跨 feature 行，`90187f7` 为其祖先，前端代码 = `90187f7`）。实施树、生产方集成树均自该提交起步；本批代码 diff 以 `8753fa9..13a3373` 为准 |
| 首批批次代码 Review（非全 feature Review、非 Gate 2） | **通过**：0 P1 / P2，6 项 P3（R-A～R-F，未经 Walter 风险接受，见 §8） | A = claude-fable-5-1 via anthropic，新会话、独立 worktree，固定审 `b0b065f` + 代码 `13a3373`；审核原件提交 `af95b66505875609f7ed3f823e047cd16226a1c5`（只引用、不改写） |
| 第二批开码前置：Checklist R8 → R8.1 | **已满足**：R8 未通过（审 `8ad5e28`，原件 `7b91a2c`；唯一 P2 B-12 = T-A10 粒度）→ r6.4 拆出 T-A09b、Analyze R10（`8bf56b8`）→ **R8.1 通过**（26 / 26，B-12 关闭，1 项 P3 S-37） | A = claude-fable-5-1 via anthropic，新会话、独立 worktree；R8.1 原件提交 `34d339eb1705310927f06d95aaf64bfc9bf4a5c3`，`checklist.md` blob `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`。**当前有效 Checklist = R8.1** |
| 第二批批次代码 Review（非全 feature Review、非 Gate 2） | **通过**：0 P1 / P2，5 项 P3（R2-A～R2-E，未修、未经 Walter 风险接受，见 §8）（本行登记前曾为“待进行”） | A = claude-fable-5-1 via anthropic，新会话、独立 worktree，固定审文档 `858025d` + 代码 `27e59e6`（diff `34d339e..27e59e6 -- frontend`）；审核原件 `review-batch2.md` 提交 `f72a1a187405e9f9dcba5bb22f47ad840141702d`（只引用、不改写） |
| 第三批开码前置：Checklist R9 | **已满足**：R9 通过（26 / 26，0 P1 / P2，P3 S-38～S-40；S-38 / S-39 / S-40 已在本批实施中落实，见 `converge-batch3.md` §4） | A = claude-fable-5-1 via anthropic，新会话、独立 worktree；原件提交 `ab742f5801628b15324fc998f03959482fd31d9d`，`checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`。**当前有效 Checklist = R9** |
| 第三批批次代码 Review（非全 feature Review、非 Gate 2） | **待进行**（Converge batch3 判本批已收口） | 审核员 A 须新会话、与实施异模型；固定审 `converge-batch3.md` 所在文档提交 + 代码 `0032fc6`（diff `ab742f5..0032fc6 -- frontend`） |
| H 组外部闸门 `frontend-workbench-v2` | **阻塞**（不变） | v2 壳方 S1 / S2 交付并集成前，T-H01～T-H04 不验收；Converge 对 AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项必报“未收敛（外部阻塞）” |

## 2. 基线、分支与工作树

| 项 | 值 | 写权限 |
|---|---|---|
| `implementation_base_sha` | `43b6d79681a49562f41751368b2ae00c24062f56`（frontend-workbench v1 正式 Handoff，PR #7 merge commit） | —（不以移动的 main 替代） |
| `upstream_start_sha` | `90187f7d8907316e554d2441d846827468c5371f`（main：PR #8 H-01 修复 + PR #9 D-020～D-024 文档）；`43b6d79` 为其祖先 | — |
| 43b6d79 → 90187f7 前端差异 | 仅 `frontend/src/modules/market-board/SampleChart.vue`、`frontend/e2e/theme.spec.ts`（H-01）；契约 / types / mock / events / `main.ts` / `app/**` / 脚本 / 锁文件 / 配置 / 既有 tests 零差异（tasks §0.0 末“r6.1 upstream 复核”） | — |
| 规格写入树 | `D:/2030/Futures-AI-interaction-resume` / `docs/workbench-interaction-resume-20261028`（本轮起点 `5e9e1f4`） | 规格作者（本轮）；不写代码 |
| 实施树 | `D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra`（自 `43b6d79` 建立，ff-only 到 `90187f7`；已于 `8753fa9` 导入规格、首批代码为 `13a3373`，随后由集成人同步批次 Review 与记账文档；准确 HEAD 用该树 `git log -1` 查询） | 实施会话（Implement 模型，见 §3）；只写 tasks 修改范围内的文件 |
| 生产方集成验证树 | `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`（同上起点，clean） | **仅**集成人串行写 |
| 集成人 | 协调会话 `PI_SESSION_ID=01a18388-a371-7746-8158-9fb15d55d819`（`openai/gpt-6.1-sol`） | 串行合并、证据登记；不代做产品决策、代码实施或 A 勾选 |
| Converge 文档树（batch-a09a） | `D:/2030/Futures-AI-interaction-converge-a09a` / `docs/workbench-interaction-batch-a09a`，起点 `13a3373`（与实施 / 生产集成树代码相同） | Converge 会话只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff / `converge-batch-a09a.md` 与 README 本 feature 两行；不改代码、不 commit（由集成人提交） |
| 首批 Review 树（batch-a09a，只读审查） | `D:/2030/Futures-AI-interaction-review-a09a` / `review/workbench-interaction-batch-a09a`（起点 `b0b065f`，审核员 A 只写 `review-batch-a09a.md`，由集成人提交 `af95b66`） | 审核员 A（已结束）；不写代码 / checklist |
| 本批记账（Review 后） | 同 Converge 文档树，HEAD `af95b66`（已含审核原件） | 记账会话只写 tasks / implementation-log / interface-handoff 与 README 本 feature 两行；不 commit（由集成人提交） |
| 第二批实施（batch2） | 实施树 `feat/workbench-interaction-astra` 自 R8.1 `34d339e` 起步，HEAD = `27e59e610e2ab8c14e7c3db554609e52e40f5f76`（clean）；生产方集成树 `integration/workbench-interaction` 由集成人 ff-only 到同一 SHA（本轮只读 `rev-parse` 核验，clean） | 实施会话 / 集成人（同上） |
| Converge 文档树（batch2） | `D:/2030/Futures-AI-interaction-converge-batch2` / `docs/workbench-interaction-batch2-converge`，固定起点 `27e59e6`（与实施 / 生产集成树代码相同） | Converge 会话只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff / `converge-batch2.md` 与 README 本 feature 两行；不改代码、不 commit（由集成人提交） |
| 第二批 Review 树（只读审查） | `D:/2030/Futures-AI-interaction-review-batch2` / `review/workbench-interaction-batch2-code`（起点 `858025d`；审核员 A 只写 `review-batch2.md`，由集成人原样提交 `f72a1a1`） | 审核员 A（已结束）；不写代码 / checklist |
| 本批记账（第二批 Review 后） | 同 batch2 Converge 文档树，HEAD `f72a1a1`（已含审核原件；实施树仍 `27e59e6`，代码相同） | 记账会话只写 tasks / implementation-log / interface-handoff / plan（R2-E 一句）与 README 本 feature 两行；不 commit（由集成人提交） |
| 第三批实施（batch3） | 实施树 `feat/workbench-interaction-astra` 自 R9 `ab742f5` 起步（中途定向导入 `e4031fa` / `1988463` 文档），HEAD = `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc`（clean）；生产方集成树 `integration/workbench-interaction` 由集成人 ff-only 到同一 SHA（本轮只读 `rev-parse` / `worktree list` 核验） | 实施会话 / 集成人（同上） |
| Converge 文档树（batch3） | `D:/2030/Futures-AI-interaction-converge-batch3` / `docs/workbench-interaction-batch3-converge`，固定起点 `0032fc6`（与实施 / 生产集成树代码相同） | Converge 会话只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff / `converge-batch3.md` 与 README 本 feature 行；不改代码、不 commit（由集成人提交） |
| 只读参照 | main `D:/2030/Futures-AI-interaction-main-ref-90187f7`；旧基线 `D:/2030/Futures-AI-interaction-base-43b6d79`；v2 `D:/2030/Futures-AI-interaction-v2-ref-79b5212`（`79b5212`） | 禁止写 |
| v2 自有树（他人所有） | `D:/2030/Futures-AI-workbench-v2-integration`（`integration/frontend-workbench-v2`）及其实施树，归另一协调会话 | **严禁写 / 代 merge**；H-x 的 ④ 集成 SHA 只能由其所有者登记 |

带入规格的口径：只把 `specs/workbench-interaction/**`（及本 feature 在 `specs/README.md` 的行 / 本 feature 跨 feature 行）定向导入实施分支；**不得**整文件覆盖 main 的 `docs/**`、`specs/README.md`、`HANDOFF.md` 或其他 feature 规格（interface-handoff §5-6）。规格来源提交 SHA：`1ad796330997d3d4990ac513428ad7b2427d0422`。本次定向导入提交可用 `git log -1 --format=%H -- specs/workbench-interaction/spec.md` 查询；集成人将实施树 ff-only 同步至该提交，并在首批派工记录中登记准确 SHA（避免在提交内硬编码自身）。

## 3. 角色与模型候选计划（AGENTS §6；只有调用失败才回退）

| 角色 | 首选 | 回退 | 备注 |
|---|---|---|---|
| Implement（写代码、跑测试、修 bug） | `openai/gpt-6-astra` | `deepseek/deepseek-flash` | 新会话、在实施树内工作；与 A 异模型 |
| 审核员 A（Review；如需 Checklist 定向复核） | `claude-fable-5-1` | `claude-opus-5-5` → `openai/gpt-6.1-sol` | 先测 `claude-bridge/<model>`，不通再 `anthropic/<model>`；本限额窗口 bridge 已明确限额时不重试；新会话、只读固定提交 |
| 计划 / 分析类（Converge、Handoff、文档修订） | `claude-opus-5-5` | `openai/gpt-6.1-sol` → `deepseek/deepseek-flash` | 同上通道规则 |
| 集成人 | 协调会话（`openai/gpt-6.1-sol`） | — | 由 Walter 指定，不因模型回退变更 |

测试变红、Converge 发现差距、Review 未通过都是正常结果，不是换模型理由；所有候选不可用 → 标 blocked 并报告。

## 4. 首批派工范围（历史：已于 batch-a09a 执行完毕；“待开码前置完成后执行”为当时原文）

- **任务**：T-A01 → T-A02 / T-A03 → T-A04 → T-A05 → T-A06 → T-A07 → T-A08 → T-A09 → T-A09a（严格按 tasks §6 DAG；T-A09a 依赖 T-A02 / T-A09）。每个任务的修改范围、完成标准（引用 AC）与验证命令以 tasks.md 原文为准，不在本文件复述或改写。
- **文件所有权**（tasks §1-5）：只改 `frontend/src/contracts/**`（作业契约 v2 段、方法表、mock、real 桩、可选 `SendMessage.jobContext`）、`frontend/src/agent/events.ts`（可选 `jobContext`，T-A09a）、`frontend/contracts/{CONTRACT.md,schema.json}`（只经 `pnpm -C frontend contract` 生成）、`frontend/tests/unit/jobs/**`，以及 T-A09 指定的三份既有契约测试中受 2.0.0 影响的断言。**不改** `app/**`、`workbench/**`、`agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}`、`scripts/{contract-build,check}.mjs`、`package.json` / 锁文件、`backend/`、`docs/`、冻结 spec。
- **回报要求**（每个任务完成时）：实施树上的固定 commit SHA；该任务全部验证命令的实际输出摘要（通过 / 失败条数、失败原文脱敏摘要）；若实际耗时超 2 h 或发现 §0.0 事实与真实代码不符，先停并回报，由规格作者按 tasks §7 修订、必要时重跑 Analyze / A 定向复核，不在实施中偷换。
- **H-x 生产方证据**：H-1 最早在 T-A09a 后具备 ① commit + ③ 定向测试摘要（`agent-context-contract.spec.ts`、`contract-version.spec.ts -t "WI scenarios"`）；② = R7 `9acf3de`；④ 须 v2 集成树所有者集成后登记。生产方集成树 SHA 只记作旁证（§6），不得填作 ④。

## 5. 实施提示（不新增逻辑）

- **S-32**：T-A22 阶段 `registerJobRoutes(router, pinia)` 的 `pinia` 尚未使用，若 `eslint --max-warnings 0` 报错，按仓库既有规则处理（如 `_pinia`），不改签名、不加逻辑。
- **S-27**：`job-state.ts` 是模块级唯一共享会话状态；每次 `createMockDataClient()` 重建（scenario / `jobFixtures` 各读一次），AgentClient 共用；测试切换覆盖值须新建 client 并在系统边界 spy 委托（tasks §0.0 B-6）。
- **main 新文档不扩本 feature 契约**：实施分支含 main `90187f7` 的 `docs/interaction.md` §3.4（`basis`、`slot_fix` / `decision` / `interview`）、§3.5 calls、designUI §5.2 三类新块及 D-021～D-024。按 D-020 ADR“`workbench-interaction`（已冻结）不加 AC”与 main `docs/plan.md` §9，本 feature 契约维持冻结 spec R-007 十字段与 13 种 kind，**不得**自行加入；后续承接见 analyze.md「Analyze R7」§3。
- 全量 `pnpm -C frontend test`（T-G09 / T-H04）会包含 main 新增的 `e2e/theme.spec.ts`，属既有回归，不是本 feature 测试。
- 既有 vitest 配置 `restoreMocks: true`：系统边界 spy 每例自动还原（tasks §0.0 B-4）。

## 6. 证据登记（首批已记录；后续随实施更新）

【2026-10-29 首批登记】下表“验证命令输出摘要”均为**实施者在实施树执行**（openai/gpt-6-astra，新会话，未回退），**Converge 会话未重跑**；来源 = 实施者两份脱敏回报（协调器临时目录 `astra-A01-A06-result.md`、`astra-A07-A09a-result.md`），并经 Converge 对固定代码 diff 逐项核对（`converge-batch-a09a.md` §2）。每个任务提交前另执行并通过 `pnpm -C frontend contract`、`contract --check`、`typecheck`、`lint`、`git diff --check`。依赖安装：首次 `pnpm -C frontend install --frozen-lockfile` 成功，`package.json` / 锁文件未改。

| 任务 / 切片 | 实施 commit | 验证命令输出摘要（实施者执行） | 生产方集成 SHA（旁证） | v2 集成 SHA（④） | 状态 |
|---|---|---|---|---|---|
| T-A01 | `07ef7ccc3c889400dfb2354ceec22c94317c8813` | `WI enums` 2 / `WI labels` 10 / `WI contract notes` 1 pass | `13a3373`（ff-only） | — | 已完成（本批 Review 通过 `af95b66`，非 AC 最终验收） |
| T-A02 | `ad4a8309d3e3a69d09a2b4745ce3e41e433a9b31` | `WI job schema` 9 / `WI naming` 1 pass | `13a3373` | — | 同上 |
| T-A03 | `8e81063a2102fe121069148347b9714601cb59ab` | `WI intake schema` 12 / `WI process schema` 3 / `WI analysis schema` 1 pass | `13a3373` | — | 同上 |
| T-A04 | `112c2838a4fb6b3b499928e28d9ff947acadf677` | `WI blocks` 9 / `WI S-18` 5 / `WI generated deliverable` 1 pass | `13a3373` | — | 同上 |
| T-A05 | `581f434fcf9e167fd014dd21b533c98c71ea4e25` | `WI revision` 6 / `WI artifact` 1 / `WI workspace` 7 pass | `13a3373` | — | 同上 |
| T-A06 | `e66ecd4e58f823466542f57dddca4a89990a63cd` | `WI intervention kinds` 24 / `WI pin_rule candidate` 1 / `WI intervention fields` 3 pass | `13a3373` | — | 同上 |
| A01～A06 回归修复 | `1ed6ec15e5c4b8dfce51c0bf9f10b812c0c87cd1` | **失败留痕**：首次联合回归 `test:unit tests/unit/jobs tests/unit/{contracts,contract-doc,mock}.spec.ts` = 183 pass / 1 fail（新字段缺 `.describe()`，触发既有契约描述守卫）→ 只补源 schema describe 并重新生成（未改既有测试 / 生成器）→ 7 文件 184 pass / 0 fail | `13a3373` | — | 修复已并入 |
| T-A07 | `0f604480816c6372e847d29cf05bdc63e88371a3` | `WI jobs fixtures` 14 / `WI list coverage` 1 pass | `13a3373` | — | 已完成（同上） |
| T-A07 描述修复 | `7bb83f98da4d874542f5ad37fdd5a2b57bbf2826` | **失败留痕**：既有描述守卫发现 `JobCollections` 五个集合字段缺 describe → 补 describe 并重新生成 | `13a3373` | — | 修复已并入 |
| T-A08 | `320277af618d75d15ec3e5fefec13cb4291cdf5e` | `WI deliverable fixtures` 5 / `WI final only delivered` 1 / `WI interventions fixtures` 1 pass | `13a3373` | — | 已完成（同上） |
| T-A09 | `82c36e7b05ce286ebc0f9650e466695e394612ee` | `WI scenarios` 15 / `WI change note` 1 / 三份既有契约测试 88 / `WI jobFixtures` 14 pass；全量单测 20 文件 707 pass / 0 fail | `13a3373` | — | 同上 |
| T-A09a | `13a3373f7ebd2075fb8bcfe32033127a916fa6b9` | `WI H-1 schema` 3 / `WI H-1 legacy` 5 / `WI H-1 passthrough` 7 pass；末轮全量单测 21 文件 722 pass / 0 fail；`check` 六守卫、`contract --check`、typecheck、lint、`git diff --check` 过；未跑 E2E（本批无 UI） | `13a3373` | — | 同上 |
| H-1 | ① `13a3373`（含 T-A02 / T-A09 / T-A09a） | ③ `agent-context-contract.spec.ts` 3 / 5 / 7 pass；`contract-version.spec.ts -t "WI scenarios"` 15 pass（实施者执行；**独立 A 亲跑同数通过**，见 `review-batch-a09a.md` §1 / §5，`af95b66`）；② R7 `9acf3de` | `13a3373`（**旁证，不是 ④**） | **未取得** | **待消费方集成（未交付）**：生产方已具备 ①②③（3 / 4） |
| H-2·标签 / H-6 | 部分前置（T-A01；T-A07 / T-A09） | 部分定向测试 | — | 未取得 | 未交付（Badge T-A23、状态层 T-A10 / T-A11 / T-A21 未实施） |
| 其余任务（56 项） | 未取得 | 未运行 | 未取得 | — | 未开始 |

（其余任务按实施进度追加行；Converge 报告与 Review 结论另存，不写进本表冒充。本批 Converge 报告 = `converge-batch-a09a.md`（`b0b065f`）。）

【2026-10-29 独立 Review 后补记】本批独立 Review = `review-batch-a09a.md`（A = claude-fable-5-1 via anthropic，审核原件提交 `af95b66`，**本批通过，0 P1 / P2，6 P3**）。A 在独立 worktree 亲跑（日志在协调器独占临时目录 `review-a09a-*`，结论以已提交审核原件为准）：`install --frozen-lockfile` exit 0（锁文件未改）；`contract --check` `12 methods, 10 events, 2 artifacts match`；`check` 六守卫全过且重新生成后 clean；typecheck / lint 过；全量 `test:unit` **21 files / 722 passed / 0 failed**；三份既有契约测试 88 passed；T-A01～T-A09a 全部 28 条 `-t` 标题命令匹配并通过（数字与上表实施者一致）；另 `test:e2e e2e/agent.spec.ts` 8 passed（先核 4173 空闲，webServer 由测试自管）。**未跑**：全量 `pnpm -C frontend test`、全部 E2E（归 T-G09 / T-H04）；无截图、无 Gate 2。上表“已完成”只指本批代码 Review 通过，46 AC 最终验收仍为 0。

【2026-10-29 第二批登记（Converge batch2）】下表“验证命令输出摘要”的来源如下：
- **执行者**：实施者在实施树执行（openai/gpt-6-astra，新会话，未回退），**Converge 会话未重跑**。
- **结果来源**：实施者两份脱敏回报，即协调器临时目录中的 `astra-state-result.md`、`astra-ui-result.md`。
- **核对方式**：Converge 对固定代码 diff `34d339e..27e59e6 -- frontend` 逐项核对过（`converge-batch2.md` §1～§2）。
- **每任务附加检查**：每个任务提交前另跑 typecheck、lint、`git diff --check` 和 staged diff 检查，均通过。
- **未改动项**：未安装依赖，`package.json` / 锁文件未改。

**本批证据登记时均为“待本批独立代码 Review”**（当时原文，不是审核结论；Review 结论与 A 亲跑见表后补记）。

| 任务 / 切片 | 实施 commit | 验证命令输出摘要（实施者执行） | 生产方集成 SHA（旁证） | v2 集成 SHA（④） | 状态 |
|---|---|---|---|---|---|
| T-A09b | `75a115975b50d8078f159f2e41ce5c401318f0b7` | `WI not-started seeds` 1 / `fixtures.spec.ts` 整文件 23 pass；typecheck / lint 过 | `27e59e6`（ff-only） | — | 已完成（本批 Review 通过 `f72a1a1`，非 AC 最终验收；登记时为“待本批 Review”） |
| T-A10 | `1841029f5a948b53ef21cbc54967556dc04e0815` | `WI listJobs` 2 / `WI scenarios read` 33 / `WI slow` 3 / `real-stubs.spec.ts` 14 / `WI not-started seeds` 1 pass；`contract` 生成后 `contract --check` = 15 methods / 10 events / 2 artifacts；typecheck / lint 过；段末全量单测 23 文件 776 pass / 0 fail，`check` 六守卫过。**失败留痕**：场景组首跑 23 pass / 10 fail（新测试嵌套匹配器未容纳 `message` 字段）→ 只修新测试匹配器 → 33 pass | `27e59e6` | — | 同上 |
| T-A22 | `cc59e946df2d08178b03e3b37928ab34517067d7` | `WI routes` 7 / `WI register` 2 pass；typecheck / lint 过 | `27e59e6` | — | 同上 |
| T-A22b | `b38cf43f602390d7645cc84514d0da9860a7e0b7` | `WI H-4 enter` 4 / `WI H-4 leave same navigation` 3 / `WI H-4 readonly` 1 pass；typecheck / lint 过；`routes.spec.ts` 整文件 9 pass | `27e59e6` | — | 同上 |
| T-A23 | `ebce4c85b1422a62b883117f75459a1fdee81b80` | `WI status badges` 18 / `WI source badge` 9 pass；`check --only colors` / `glass`、typecheck / lint 过；`contract-labels.spec.ts -t "WI labels"` 10 pass（H-2 旁证）。**失败留痕**：首跑 16 fail / 2 pass（新测试选择器把根 `<span>` 纳入索引）→ 只修新测试选择器 → 全过 | `27e59e6` | — | 同上 |
| T-A24 | `27e59e610e2ab8c14e7c3db554609e52e40f5f76` | `WI lcs` 6 / `WI limit` 7 pass；typecheck / lint 过；依赖未改 | `27e59e6` | — | 同上 |
| 本批末轮联合回归 | `27e59e6` | 全量 `test:unit` **27 文件 833 pass / 0 fail**；`check` 六守卫过；`contract --check` 15 / 10 / 2；typecheck、lint（0 warning）过；`test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` **24 pass / 0 fail**（先确认 4173 空闲，Playwright 自管 webServer，结束后空闲；未下载浏览器）；保护目录零差异 | `27e59e6` | — | — |
| H-2·标签 | ① `ebce4c8`（含 T-A01 `07ef7cc`） | ③ `WI labels` 10、`badges.spec.ts -t "WI status badges"` 18 pass（实施者执行；**独立 A 亲跑同数通过**，`review-batch2.md` §1 / §5，`f72a1a1`）；② R8.1 `34d339e` | `27e59e6`（**旁证，不是 ④**） | **未取得** | **待消费方集成（未交付）**：生产方 3 / 4 |
| H-3·路由切片 | ① `cc59e94` | ③ `routes.spec.ts` 7 / 2 pass（实施者执行；**独立 A 亲跑同数通过**，整文件 9，`f72a1a1`）；② R8.1 `34d339e` | `27e59e6`（旁证） | **未取得** | **待消费方集成（未交付）**：生产方 3 / 4；页面为骨架 |
| H-4 | ① `b38cf43` | ③ `session-context.spec.ts` 4 / 3 / 1 pass（实施者执行；**独立 A 亲跑同数通过**，`f72a1a1`）；② R8.1 `34d339e` | `27e59e6`（旁证） | **未取得** | **待消费方集成（未交付）**：生产方 3 / 4 |
| H-2·列表 / H-6 / H-5 / 页面切片 | 部分前置（T-A10 读 API 等） | 部分 | — | 未取得 | 未交付：H-2·列表缺 T-A12 / T-A22a；H-6 缺 T-A11 / T-A21；H-5 未做；页面切片缺 B / C 组 |
| 其余任务（51 项） | 未取得 | 未运行 | 未取得 | — | 未开始 |

本批 Converge 报告 = `converge-batch2.md`，集成人提交于 `858025d0b75f529e160b973ba5bda10848889228`（判本批收口、feature 未收敛）。H-1 行保持上表首批登记不变。

【2026-10-29 第二批独立 Review 后补记】本批独立 Review = `review-batch2.md`（A = claude-fable-5-1 via anthropic，审核原件提交 `f72a1a187405e9f9dcba5bb22f47ad840141702d`，**本批通过，0 P1 / P2，5 P3 R2-A～R2-E**）。以下为 **A 在独立 worktree 亲跑**的结果（引自审核原件 §1，日志在协调器独占临时目录 `review-b2-*`，结论以已提交原件为准；**本记账会话未跑任何测试**）：
- `install --frozen-lockfile` exit 0（锁文件未改）；`contract --check` = `15 methods, 10 events, 2 artifacts match`；`check` 六守卫全过、之后仍 clean；`check --only colors` / `glass`、typecheck、lint 过。
- 全量 `test:unit` **27 files / 833 passed / 0 failed**；三份既有 v1 契约测试 **88 passed**。
- 本批 21 条任务命令全部 exit 0，用例数与上表实施者逐条相同；H-2 旁证 `WI labels` 10 passed。
- `test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` **24 passed / 0 failed**（先核 4173 无监听，Playwright 自管 webServer，结束后无 LISTEN）。
- **未跑**：全量 `pnpm test` 中其余 7 份 E2E（breakpoints / modules / scenarios / smoke / theme / tokens / workbench，归 T-G09 / T-H04）；无人工截图、无 Gate 2。46 AC 最终验收仍 0。
- A 的只读边界探针（独占目录，非产品测试）支撑 R2-B / R2-C 判定，不改受控代码 / 测试。

【2026-10-29 第三批登记（Converge batch3）】下表“验证命令输出摘要”的来源如下：
- **执行者**：实施者在实施树执行（openai/gpt-6-astra，新会话，调用正常，未回退），**Converge 会话未重跑**。
- **结果来源**：实施者四份脱敏回报，即协调器临时目录 `wi-batch3-01a18388-0yit2j1a/` 中的 `astra-persistence-resume-result.md`、`astra-intake-result.md`、`astra-intake-resume-result.md`、`astra-store-result.md`，以及同目录的 `astra-*-*.log`。
- **核对方式**：Converge 逐文件读过固定代码 diff `ab742f5..0032fc6 -- frontend`（`converge-batch3.md` §1～§2）。
- **未改动项**：未安装依赖，`package.json` / 锁文件未改。

**本批证据登记时均为“待第三批独立代码 Review”**，不是审核结论。

| 任务 / 切片 | 实施 commit | 验证命令输出摘要（实施者执行） | 生产方集成 SHA（旁证） | v2 集成 SHA（④） | 状态 |
|---|---|---|---|---|---|
| T-A11 | `c7ebccb8f9e29350d5a815959be3b532191bdb95` | `WI whitelist` 6 / `WI degrade` 3 / `WI corrupt` 4 / `WI non-normal` 13 pass；`contract --check` 16 methods / 10 events / 2 artifacts、typecheck、lint 通过；real-stubs 15；persistence + read 定向 65 / 65；提交时 clean 全量 **28 文件 860 / 0**；`check` 六守卫通过。**失败留痕**：首轮新测试出现 Storage spy 漏记、跨例残留和两处类型错误，只修了新测试 | `0032fc6`（ff-only） | — | 已实施（待第三批 Review） |
| T-A12 | `742d6aa3d671cee91c6cce856f657a103d510615` | `WI createJob` 11 / `WI confirm` 5 / `WI intake validation` 10 / `WI scenario writes` 5 pass；`contract` / `contract --check` 20 methods、typecheck、lint 通过；real-stubs 19。**失败留痕**：① 首次 typecheck 漏填交付物 `jobId`，已补；② 提交时**没有跑 clean 全量** | `0032fc6` | — | 同上 |
| A12 test-fix（r6.6.2） | `0a2d1a5e756b4a469996d2069996a256f16722b9` | 只改 `persistence.spec.ts` `WI non-normal` 的 error 分支（+9 / −1）。**失败留痕**：在含 A13 WIP 的树上，首次批量 `test:unit` 为 **925 pass / 1 fail**，唯一失败即此 error 分支 → Astra 按范围停下 → r6.6.2 → 本 test-fix。之后在仍含 A13 WIP 的树上：三文件定向 96 pass，A12 命令 11 / 5 / 10 / 5，gates 通过。**不表述为 test-fix 单独干净树的结果** | `0032fc6` | — | 同上 |
| T-A13 | `a5ad11c79cf08ca50ebb55ef0984beae952a7dad` | `WI assign` 15 / `WI removeUpload` 4 / `WI cancelJob` 8 pass；`contract --check` 24 methods / 10 events / 2 artifacts、typecheck、lint 通过；real-stubs 23。提交后 clean 全量 **30 文件 926 / 0**；`check` 六守卫、`git diff --check` 通过。A13 WIP 停止前后的 tracked diff 与 pool spec SHA256 相同（Converge 独立复算） | `0032fc6` | — | 同上 |
| T-A22a | `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc` | `WI H-2 cache` 5 / `WI H-2 filter` 4 / `WI H-2 createJob refresh` 7 / `WI H-2 agent refresh` 9 pass；typecheck、lint 通过；本轮无失败 | `0032fc6` | — | 同上 |
| 本批末轮联合回归 | `0032fc6` | clean 全量 `test:unit` **31 文件 951 pass / 0 fail**；`check` 六守卫通过；`contract --check` 24 / 10 / 2；typecheck、lint 通过；`test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` **24 pass / 0 fail**（4173 运行前后均无监听，Playwright 自管 webServer）；`git diff --check`、暂存差异检查通过 | `0032fc6` | — | — |
| H-2·列表 | ① `0032fc6`（含 T-A12 `742d6aa`、T-A22a；祖先含 T-A01 / A02 / A10） | ③ `jobs-store.spec.ts -t "WI H-2 …"` 5 / 4 / 7 / 9 pass（实施者执行，**待第三批 Review**）；② R9 `ab742f5` | `0032fc6`（**旁证，不是 ④**） | **未取得** | **待消费方集成（未交付）**：生产方 3 / 4，③ 待审核 |
| H-6 | 部分：T-A07 / A09 / A10 / **T-A11 `c7ebccb`**（有覆盖时只在内存、normal 持久化） | 部分：`WI non-normal` 13 等；`job-state-inbox.spec.ts` 尚不存在 | — | 未取得 | 未交付（缺 T-A21） |
| H-5 / 页面切片 | 未实施 | — | — | 未取得 | 未交付 |
| 其余任务（47 项） | 未取得 | 未运行 | 未取得 | — | 未开始 |

本批 Converge 报告 = `converge-batch3.md`（待集成人提交）。H-1 / H-2·标签 / H-3 / H-4 行保持前两批登记不变；当前有效 Checklist 可并记 R9 `ab742f5`，④ 仍缺。

## 7. 派工 / 回退记录（脱敏；只记角色、任务、基线、实际 provider/model、失败类别）

| 时间 | 角色 | 任务 | 基线 | 实际 provider/model | 结果 / 失败类别 |
|---|---|---|---|---|---|
| 2026-10-28 | Plan / Tasks 精度修订 + 开工登记 + Analyze R7 | r6.1（S-27～S-32）、tasks 页首开工状态、upstream 影响核验、本日志建档 | 规格分支 `5e9e1f4` | `anthropic/claude-opus-5-5`（`claude-bridge` 本窗口已明确 quota / rate / spend_limit 限额，按 §6 规则 5 不重试） | 文档完成；未 commit（由协调器提交）；未写代码、未跑产品测试 |
| 2026-10-29 | 集成人（协调会话 `01a18388`，`openai/gpt-6.1-sol`） | 开码前置：规格定向导入 | `90187f7` | — | 提交 `8753fa9`（源 `1ad7963`），实施树 / 集成树 ff-only 至此 |
| 2026-10-29 | Implement（新会话，实施树） | T-A01～T-A06 | `8753fa9` | `openai/gpt-6-astra`（首选，未回退） | 6 个任务 commit + 回归修复 `1ed6ec1`；首次联合回归 1 fail（缺 describe，正常任务结果，非换模型理由）→ 修复后 0 fail |
| 2026-10-29 | Implement（新会话，实施树） | T-A07～T-A09、T-A09a | `1ed6ec1` | `openai/gpt-6-astra`（首选，未回退） | 4 个任务 commit + 描述修复 `7bb83f9`；全部定向与全量单测通过；停在 A09a，未进入 A10 |
| 2026-10-29 | 集成人 | 首批 ff-only 集成 | `8753fa9` | — | `integration/workbench-interaction` @ `13a3373`（旁证；未写 v2 集成树） |
| 2026-10-29 | Converge / 状态记账 + Analyze R8 | 首批 10 项对比、字段精度同步、状态回写、本日志与交接登记 | `13a3373`（文档树 `docs/workbench-interaction-batch-a09a`） | `anthropic/claude-opus-5-5`（`claude-bridge` 本窗口已明确 quota / rate / spend_limit 限额，按 §6 规则 5 不重试；官方通道实际调用成功） | 本批已收口、待独立 Review；feature 未收敛；未改代码、未跑产品测试、未 commit |
| 2026-10-29 | 集成人 | 提交 Converge 文档 | `13a3373` | — | 提交 `b0b065fb799c52ae729c9bd6d45335b5e165a4d0` |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-review-a09a`，只读审查） | 首批 T-A01～T-A09a 批次代码 Review | 文档 `b0b065f`、代码 `13a3373`（diff `8753fa9..13a3373`） | `anthropic/claude-fable-5-1`（本窗口 `claude-bridge` 真实探活（对象 opus）已明确 quota / rate / spend_limit 类，按 §6 规则 5 同通道不重试，未单独探 fable 的 bridge；与 Implement 异模型；未换模型找通过） | **本批通过**：0 P1 / P2，6 P3（R-A～R-F）；亲跑命令见 §6 补记；只写审核原件，未改代码 / checklist |
| 2026-10-29 | 集成人 | 原样提交审核原件并 ff | `b0b065f` | — | 提交 `af95b66505875609f7ed3f823e047cd16226a1c5`；ff 到本文档树、生产方集成树 `integration/workbench-interaction`；实施树仍 `13a3373`（代码相同） |
| 2026-10-29 | 计划 / 分析类（Review 后纯文档记账，非 Handoff） | tasks 10 项状态同步、本日志 / interface-handoff / README 记账、P3 后续定位（§8）、交接摘要 | 文档树 HEAD `af95b66` | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a1845a-d44c-77c7-b732-4525c9bba119`；`claude-bridge` 本窗口已明确 quota / rate / spend_limit 限额，不重试；官方同模型调用成功；未改配置） | 文档完成；未改代码 / 测试 / spec / checklist / plan / analyze / converge / 审核原件；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 计划 / 分析类（第二批开工前精度澄清 + Analyze R9，非实施） | 第二批 T-A10 / A22 / A22b / A23 / A24 派工准备：R-B 定案、R-D 口径、H-4 `bindRouter`、T-A23 Badge 基线事实、T-A24 边界；本日志 §9、tasks / plan / interface-handoff / README 记账 | 文档树 `docs/workbench-interaction-batch2-plan` @ `0920004`（代码 = `13a3373`） | `anthropic/claude-opus-5-5`（本轮协调器跨 UTC 日后最小真实调用 `claude-bridge/claude-opus-5-5` exit 1，**provider / invocation error 类，非已确认 quota**；同模型 anthropic 最小调用 exit 0；只换通道不换模型、未改配置） | 文档完成；未改代码 / fixture / 测试 / spec / checklist / 权威 docs / 审核原件；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch2`） | Checklist R8：第二批 r6.3 限定范围定向复核 | `8ad5e28` | `anthropic/claude-fable-5-1`（bridge 本轮 provider / invocation error、未确认 quota；只换通道） | **未通过**：25 / 26，V-02 ☐；P2 B-12（T-A10 粒度）；P3 S-33～S-36；集成人原样提交 `7b91a2c` |
| 2026-10-29 | 计划 / 分析类（Tasks 粒度修订 r6.4 + Analyze R10，非实施） | 按 B-12 最小关闭要求拆出 T-A09b、T-A10 恢复 2 h，同步 plan 两处 / 本日志 / interface-handoff / README；吸收 S-33 / S-35 / S-36（S-34 随拆分消解） | 文档树 `docs/workbench-interaction-batch2-plan` @ `7b91a2c`（代码 = `13a3373`） | `anthropic/claude-opus-5-5`（与前轮同模型，不因审核未过换模型；本轮协调器真实调用 `claude-bridge/claude-opus-5-5` 为 provider / invocation 失败、未确认 quota，官方通道成功；未改配置） | 文档完成；未改代码 / fixture / 测试 / spec / checklist / 旧 Review 原件 / 权威 docs；未跑产品测试；未 commit（由集成人提交）；B-12 是否关闭待 A R8.1 |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch2-r81`） | Checklist R8.1：r6.4 拆分增量复核 | `8bf56b8` | `anthropic/claude-fable-5-1`（bridge 对 fable 本轮 exit 1 = provider / invocation error、未确认 quota；只换通道） | **通过**：26 / 26，B-12 关闭，V-02 补勾；P3 S-37；集成人原样提交 `34d339e` |
| 2026-10-29 | Implement（新会话，实施树） | T-A09b → T-A10 | `34d339e` | `openai/gpt-6-astra`（首选，未回退） | 2 个任务 commit（`75a1159`、`1841029`）；A10 场景组首跑 10 fail（新测试匹配器，正常任务结果，非换模型理由）→ 修新测试后全过；段末全量单测 23 文件 776 / 0 |
| 2026-10-29 | Implement（新会话，实施树） | T-A22 → T-A22b → T-A23 → T-A24 | `1841029` | `openai/gpt-6-astra`（首选，未回退） | 4 个任务 commit（`cc59e94`、`b38cf43`、`ebce4c8`、`27e59e6`）；A23 首跑 16 fail（新测试选择器，正常任务结果）→ 修新测试后全过；末轮全量单测 27 文件 833 / 0、六守卫、既有 shell + agent E2E 24 / 0 |
| 2026-10-29 | 集成人 | 第二批 ff-only 集成 | `34d339e` | — | `integration/workbench-interaction` @ `27e59e6`（旁证；未写 v2 集成树，④ 全缺） |
| 2026-10-29 | Converge / 状态记账 + Analyze R11 | 第二批 6 项对比、最小接口精度同步（r6.5）、状态回写、本日志 / 交接 / README 登记 | `27e59e6`（文档树 `docs/workbench-interaction-batch2-converge`） | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a18625-c9a1-76a3-aa8d-fefefec99096`；本轮协调器最小真实调用 `claude-bridge/claude-opus-5-5` exit 1，provider / invocation error 类、**未确认 quota**；同模型官方通道 exit 0；只换通道、未改配置） | 本批已收口、待独立 Review；feature 未收敛；未改代码 / 测试 / spec / checklist / 已有 Review 原件；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 集成人 | 提交 batch2 Converge 文档 | `27e59e6` | — | 提交 `858025d0b75f529e160b973ba5bda10848889228` |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-review-batch2`，只读审查） | 第二批 T-A09b / A10 / A22 / A22b / A23 / A24 批次代码 Review | 文档 `858025d`、代码 `27e59e6`（diff `34d339e..27e59e6`） | `anthropic/claude-fable-5-1`（PI_SESSION_ID `01a18636-553d-77ae-afbd-b5a736447a7a`；协调器对 `claude-bridge/claude-fable-5-1` 最小调用 exit 1 = **provider / invocation error，未确认 quota**；同模型官方通道成功；只换通道、未改配置；与 Implement 异模型、与 Converge 隔离） | **本批通过**：0 P1 / P2，5 P3（R2-A～R2-E）；亲跑见 §6 补记；只写审核原件，未改代码 / checklist |
| 2026-10-29 | 集成人 | 原样提交审核原件并 ff | `858025d` | — | 提交 `f72a1a187405e9f9dcba5bb22f47ad840141702d`；ff 到本文档树与生产方集成树 `integration/workbench-interaction`；实施树仍 `27e59e6`（代码相同） |
| 2026-10-29 | 计划 / 分析类（第二批 Review 后纯文档记账，非 Handoff、非 Gate 2） | tasks 六项状态 + 页首、本日志、interface-handoff、plan §2.4 R2-E 一句精度、README 本 feature 两行；临时目录交接摘要 | 文档树 HEAD `f72a1a1` | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a18647-6186-7141-8ea5-ad1a1da07c72`；协调器对 `claude-bridge/claude-opus-5-5` 最小调用 exit 1 = provider / invocation error，未确认 quota；同模型官方通道成功；只换通道、未改配置） | 文档完成；未改代码 / 测试 / spec / checklist / 旧 Review / converge / analyze / 审核原件 / 根 HANDOFF / docs；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 计划 / 分析类（第三批开工前精度澄清 r6.6 + Analyze R12，非实施） | 第三批 T-A11 / A12 / A13 / A22a 派工准备：持久化语义与 API、写方法签名 / 回执 / 时机、投放写入规则与 `mappingHistory`、当前列表投影、jobsStore 精度；plan / tasks / analyze / 本日志 / interface-handoff / README 本 feature 行 | 文档树 `docs/workbench-interaction-batch3-plan` @ `f1b7c06`（代码 = `27e59e6`） | `anthropic/claude-opus-5-5`（本轮协调器对 `claude-bridge/claude-opus-5-5` 最小真实调用 exit 1 = **quota / rate / spend_limit 类**；同模型官方通道 exit 0；本窗口不重试已明确限额通道；未改配置） | 文档完成；未改代码 / fixture / 测试 / spec / checklist / 旧 Review / 根 HANDOFF / 权威 docs；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 集成人 | 提交 r6.6 规格文档 | `f1b7c06` | — | 提交 `ef64c1853f79ea1e18e99a7b0ff22de2152de40c` |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch3`） | Checklist R9：第三批 r6.6 限定范围定向复核 | `ef64c18` | `anthropic/claude-fable-5-1`（协调器对 `claude-bridge/claude-opus-5-5` 的最小调用 exit 1 = quota / rate / spend_limit 类，本窗口不重试；未单独探 fable 的 bridge；只换通道） | **通过**：26 / 26，0 P1 / P2，P3 S-38～S-40；集成人原样提交 `ab742f5` |
| 2026-10-29 | Implement（新会话，实施树 `feat/workbench-interaction-astra`） | T-A11（第三批首项） | `ab742f5` | `openai/gpt-6-astra`（首选，调用正常，未回退） | **开码前停止**：确定的范围遗漏（`real-stubs.spec.ts` 的 `requests` 表须为 `resetMockData` 加键，但不在 r6.6 写入清单）；未改代码、未提交、未运行本轮验证命令。不是模型调用失败，也不是测试红 |
| 2026-10-29 | 计划 / 分析类（Tasks 范围小补 r6.6.1 + 只读 Analyze R12.1，非实施） | T-A11 / A12 / A13 修改范围允许 `real-stubs.spec.ts` 的 `requests` 表按本任务新增方法加键；同步本日志 §10 所有权 | 文档树 `docs/workbench-interaction-batch3-plan` @ `ab742f5` | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a186d0-43c8-7219-9857-eadff71941bb`；bridge 本窗口已明确 quota / rate / spend_limit，不重试；官方通道正常；未改配置） | 文档完成；只改 tasks / analyze / 本日志；未改代码 / 测试 / spec / plan / checklist；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 集成人 | 提交 r6.6.1 文档并同步实施树 | `ab742f5` | — | 提交 `e4031fae9ca31d090f2bec4ed4b09793ff3dea56`；实施树自此续做 |
| 2026-10-29 | Implement（新会话，实施树） | T-A11（续） | `e4031fa` | `openai/gpt-6-astra`（首选，调用正常，未回退） | 提交 `c7ebccb`；5 条任务命令通过（非 normal 组 13 pass）；末轮全量单测 28 文件 860 / 0、六守卫通过；首轮新测试的 spy / 类型问题为正常任务结果，已修 |
| 2026-10-29 | Implement（新会话，实施树） | T-A12 → T-A13 | `c7ebccb` | `openai/gpt-6-astra`（首选，调用正常，未回退） | T-A12 提交 `742d6aa`（任务命令 / contract / typecheck / lint / real-stubs 通过）；T-A13 定向命令 / contract / typecheck / lint / real-stubs 通过但**未提交**（工作区保留）。末轮全量单测 **925 pass / 1 fail**，唯一失败 = T-A11 `persistence.spec.ts` `WI non-normal` 的 error 分支（与已批准的 A12 error 时机冲突；该文件不在 A12 / A13 写入清单）→ **按范围纪律停下**；六守卫通过。测试结果，非调用失败，不回退 |
| 2026-10-29 | 计划 / 分析类（Tasks 语义回归许可 r6.6.2 + 只读 Analyze R12.2，非实施） | T-A12 修改范围允许只改上述用例的 error 分支；T-A13 明确无许可；同步本日志 §7 / §10 | 文档树 `docs/workbench-interaction-batch3-plan` @ `e4031fa`（只读核对实施树 `742d6aa` 与工作区） | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a186f6-6f87-759d-864d-cfa50e021625`；bridge 本窗口已明确 quota / rate，不重试；官方通道正常；未改配置） | 文档完成；只改 tasks / analyze / 本日志；未写实施树；未改代码 / 测试 / spec / plan / checklist；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 集成人 | 提交 r6.6.2 文档（文档树 `8c4660f`）并定向导入实施树 | `742d6aa`（实施树含 A13 WIP） | — | 实施树提交 `198846383e23910e17e0a48a24d9d80c4cb213fe`：从 `8c4660fe9121610b2bd85a13cfd7ea97d7f7c75e` 定向导入 analyze / tasks / implementation-log 三份文档（blob 与来源相同）；未 reset / stash / 覆盖 frontend，A13 WIP 保留 |
| 2026-10-29 | Implement（新会话，实施树） | A12 test-fix → T-A13 交付 | `1988463`（含 A13 WIP） | `openai/gpt-6-astra`（首选，调用正常，未回退） | test-fix `0a2d1a5`（只改获批的 error 分支）→ T-A13 `a5ad11c`；A13 WIP 停止前后 hash 相同；提交后 clean 全量 30 文件 926 / 0、六守卫通过 |
| 2026-10-29 | Implement（新会话，实施树） | T-A22a | `a5ad11c` | `openai/gpt-6-astra`（首选，调用正常，未回退） | 提交 `0032fc6`（只动授权的 3 个文件）；任务命令 5 / 4 / 7 / 9 + 工程门通过；末轮 clean 全量 31 文件 951 / 0、六守卫、`contract --check` 24 / 10 / 2、既有 shell + agent E2E 24 / 0；本轮无失败 |
| 2026-10-29 | 集成人 | 第三批 ff-only 集成 | `ab742f5` → `0032fc6` | — | `integration/workbench-interaction` @ `0032fc6`（旁证；未写 v2 集成树，④ 全缺） |
| 2026-10-29 | Converge / 进度登记 + Analyze R13 | 第三批 4 项对比、精度同步（r6.7）、状态回写、本日志 / 交接 / README 登记 | `0032fc6`（文档树 `docs/workbench-interaction-batch3-converge`） | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a18715-bffa-74e9-8b0d-483f569eee2b`；本轮协调器对 `claude-bridge/claude-opus-5-5` 最小真实调用 exit 1 = **quota / rate / spend_limit 类**，同模型官方通道成功；本窗口不重试；未改配置） | 本批已收口、待第三批独立 Review；feature 未收敛；未改代码 / 测试 / spec / checklist / 旧 Review / 旧 Converge；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 集成人 | 提交 batch3 Converge 文档 | `0032fc6` | — | 提交 `e14ad25d525d319fee85e2fc34e4ebb972e42150` |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-review-batch3`，只读审查） | 第三批 T-A11 / A12 / A13 / A22a 批次代码 Review | 文档 `e14ad25`、代码 `0032fc6`（diff `ab742f5..0032fc6`） | `anthropic/claude-fable-5-1`（PI_SESSION_ID `01a1872c-7882-7448-9b7d-17c75c6101cc`；协调器对 bridge / opus 的最小真实 probe 为 quota / rate / spend_limit 类，本窗口同通道不重试；未单独探 fable 的 bridge；只换通道、未改配置；与 Implement 异模型、与 Converge 隔离） | **本批通过**：0 P1 / P2，3 P3（R3-A～R3-C）、3 观察；亲跑全量单测 951 / 0、19 条任务命令、E2E 24 / 0、只读探针 8 例；只写审核原件，未改代码 / checklist |
| 2026-10-29 | 集成人 | 原样提交审核原件 | `e14ad25` | — | 提交 `49edb7ebf7bd0fdb0ab9ea0767c33945b39e13cf`；决定现在修 R3-A，R3-B / R3-C 留原归属 |
| 2026-10-29 | 计划 / 分析类（Converge 补修任务登记 r6.8 + 只读 Analyze R14，非实施） | 新增 T-A22c（R3-A 方案 b）、plan §2.3 / T-A22a 精度、四项状态回写为已完成、B01 / B02 依赖、§5 / §6、本日志 / 交接 / README 本 feature 行 | 文档树 `docs/workbench-interaction-batch3-converge` @ `49edb7e`（代码 = `0032fc6`） | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a1873f-2338-7718-8e99-6609b56b7a8a`；bridge 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置） | 文档完成；未改代码 / 测试 / spec / checklist / 原 Review / converge / 根 HANDOFF；未跑产品测试；未 commit（由集成人提交） |

## 8. 首批 Review P3 后续定位（只登记，不改规范机制；**均未经 Walter 风险接受**，本批不修代码）

审核原文以 `review-batch-a09a.md` §4 为准（此处只摘定位，不改写结论）。下列各项均非本批阻断，不新增 AC / 完成标准 / 验证命令 / 校验机制；处理须在对应任务内按既有流程进行，若需改需求或扩机制则按 AGENTS §2 回 Clarify / Gate 1 或按 §5.1 先报 Walter 同意。

| # | 摘要 | 需先定案 / 核对的时点 | 关联任务（只加阅读指引） | 当前状态 |
|---|---|---|---|---|
| R-A | `j-conflict` 的 `Deliverable.blocks` 既不等于 `latestMergedRev` 也不等于最新修订，“当前视图”规则未定 | **T-A16 / T-A19 开工前**定一条不变量（A 建议二选一，见原文），j-conflict fixture 随之对齐；T-F01 / T-F06 消费 | T-A16、T-A19 | 未定案、未修 |
| R-B | 未开始阶段的 fixture 仍带配方 / 结论 / 交付产物等语义（= Converge O-2） | T-A10 消费工作区时核对（或另由集成人报告是否单列 fixture-only 小修） | T-A09b（校正）、T-A10（读回） | **r6.4：落点改为 T-A09b（fixture-only，0.5 h；Checklist R8 B-12 拆分），T-A10 只经真实 `getStageWorkspace` 读回 12 个种子空态；待实施、未关闭。残留（R8 S-35，R-B 原文另一半）：done 阶段上游产物仍为 `status=draft`（如 j-delivered 上游三产物）——产物 status 与阶段态是两个独立维度，阶段 done 不等于产物 confirmed；本 feature 不为关闭该 P3 自动把 draft 升为 confirmed（那等于代人审批），是否调整留后续核对（T-A20 成功终态定义产物状态、或 T-A16 / T-A19 前 R-A 定案时一并看），R-B 在台账中保持“部分定案、未关”。** 以下为 r6.3 原文：**r6.3 已定案、待 T-A10 实施**：fixture-only，plan 样例表 `not_started` 的 12 个 (作业, 阶段) 种子改为空工作区（deliver 为 `deliverable=null` / `finalSnapshot=null`；j-cancelled `previews={}`；j-collect / j-cancelled `reconciliations=[]`），`fixtures.spec.ts` 内容断言收窄到已开始阶段；不改 jobs / interventions / uploads、ID、schema；不做读侧过滤（rerun 后下游 not_started 仍有修订）；未单列任务（T-A10 标准 5 / 命令 5） |
| R-C | `contractChange` / `jobScenarios` 前瞻文案（“新增作业方法”）与当前 12 方法不一致（= O-3） | T-G06 收口时复核文案与 `methodSemantics` 一致 | T-G06 | 过渡态，未处理 |
| R-D | 五处跨字段不变量 schema 未约束（Artifact overlayRev⇔pendingMerge、quarantined 缺原因、final 快照与交付物 jobId / blocks、rerun.affectedStages、Job status / currentStage 与 stages[]） | 由接管写入的任务（T-A10 / T-A12 / T-A14 / T-A17 / T-A20）决定入口补 refine 还是明示“由状态层保证”；**按 AGENTS §5.1，补校验前须先报 Walter 并获同意**；本轮未加校验、未修 | T-A10、T-A12、T-A14、T-A17、T-A20 | **r6.3 口径已定、未修**：不加 schema refine / 入口跨字段校验（未向 Walter 申请扩防御面）；各项由写方法按构造保持、以既有读回断言覆盖——① T-A14（无 run）/ T-A18（有 run）；② T-A12；③ T-A17；④ T-A20；⑤ T-A12（createJob）/ T-A13（cancel）/ T-A17（delivered）/ T-A20（rerun 映射）。T-A10 不接管任何领域写入，不承接 R-D。R-B 的跨字段检查只是 fixture 测试关系，不是生产 guard |
| R-E | `i-seed-6` finalize 事件 `outcome='merged'`，语义上更应为 `recorded` | T-A17 定义 finalize 事件 outcome 后对齐 fixture | T-A17 | 未处理 |
| R-F | 投放样例全为 url；`pendingCount` 在 j-human / j-conflict 为 0（设计使然） | T-A21 须**同时**改写 `Job.pendingCount` 与 `stages[].pendingCount`；file 样例可随 T-C 组补 | T-A21 | 未处理 |

【r6.3 更新】R-A（T-A16 / T-A19 开工前）、R-C（T-G06）、R-E（T-A17）、R-F（T-A21）仍未处理，第二批不涉及。

【r6.4 更新】R-B 的种子校正落点由 T-A10 改为 T-A09b（T-A10 读回验证），done 阶段上游 draft 产物残留见上表、留后续核对；R-D 口径不变；R-A / R-C / R-E / R-F 仍未处理、未经 Walter 风险接受。

【batch2 更新（Converge batch2，待本批独立代码 Review）】
- **R-B**：12 个未开始种子的校正已实施（T-A09b `75a1159`），并已经真实 `getStageWorkspace` 读回（T-A10 `1841029`，标准 5）。done 阶段上游 draft 产物照旧残留，未自动审批；R-B 仍为“**部分落实、未关**”。
- **R-D**：T-A10 未新增任何跨字段 guard（`JobStateSchema` 只组合既有边界 schema）；“按构造保持”的策略仍待 T-A12 / A13 / A14 / A17 / A18 / A20 的写方法落实，**未修**。
- **S-37**（Checklist R8.1 P3）：非空正向样例的断言已在 `job-state-read.spec.ts` 落实（tasks 标准未改字）。
- **R-C**：`methodSemantics` 现为 15 条（本批接入 3 个读方法），前瞻文案仍待 T-G06 复核。
- **R-A / R-E / R-F**：仍未处理，未经 Walter 风险接受。

【batch2 Review 后更新（`review-batch2.md` `f72a1a1`；以本段为准，上一段“待本批独立代码 Review”为当时原文）】
- **R-B**：仍“**部分落实、未关**”。A 独立复算：12 / 12 未开始种子为空，已开始阶段 0 改动；但 done 阶段上游产物仍为 `status=draft`（A 列出 17 个），本 feature 不自动审批。
- **S-37**：正向 workspace 断言已落实，并经 A 核对。
- **R-D**：未新增 guard。A 的探针证实 ⑤ 仍可提交，“按构造保持”待写方法任务落实，**未修**。
- **R-A**：仍须 T-A16 / T-A19 开工前定案。
- **R-C / R-E / R-F**：本批不涉及、未处理；R-C 与 R2-A 同归 T-G06。

**第二批 Review P3 台账**（审核原文以 `review-batch2.md` §4 为准；全部 P3 只登记，**未修、未经 Walter 风险接受**，不新增 AC / 完成标准 / 命令 / guard / 机制）：

| # | 摘要 | 归属 / 时点 | 当前状态 |
|---|---|---|---|
| R2-A | `listJobs` / `getJob` / `getStageWorkspace` 的方法 describe 混入 mock 实现语义（empty / error / slow、共享会话状态、预置 normal 集合），进入 CONTRACT.md 成为 real 实现义务；关联首批 R-C | T-G06 收口时与 R-C 一并把 mock 场景句迁回 `jobScenarios`；接入写方法的任务沿用 v1 实现中立写法 | 未修 |
| R2-B | 未经 `createMockDataClient()` 初始化即访问模块状态会得到 `TypeError` / 裸 `ZodError`，不是契约错误（= Converge O-B2-3）；当前无生产调用方，不可触发 | T-A11 / T-A18 按正常调用顺序接入（状态由 DataClient 工厂建立，AgentClient 不自行初始化），并以测试固定；**不在此加 guard**（AGENTS §5.1） | 未修 |
| R2-C | 三个自制徽标统一用 `--fai-status-ok` 边框，`failed` / `conflict` / `quarantined` 语义反向（= O-B2-4）；AC-001-5 已靠文案 + 图标满足 | 首个消费徽标的页面任务（T-B01 / T-C04 / T-F01）或 T-G10 M-01 前，以既有令牌映射核对；不新增色值、不改契约；本记账不改代码 | 未修 |
| R2-D | `routes.spec.ts` 真实路由表用例与 pin `90187f7` 基线耦合；main `072bb12` 的 `nav.ts` 已有 `jobs` 占位，同步后该用例与 v2 `shell.spec` 的 `/jobs` owner 占位断言已知会红（= O-B2-6） | 集成人决定同步时：按 tasks §7 重核 §0.0 → 重跑 Analyze → A 定向复核 → 派指定范围小任务改写用例；与 v2 所有者协调 T-V2-09#4；不能用本批旧基线的绿冒充新基线；不代改壳测试 | 未修（后续同步风险，非本批缺陷） |
| R2-E | 新读方法的场景延迟 / error 跟随当前共享状态的 scenario，v1 十方法仍按工厂闭包捕获的 scenario（= O-B2-1）；A 判为 S-27 设计的推论，生产只有一个 client，不可观察 | plan §2.4 已按 A 建议补一句精度（本轮登记）；T-A18 沿用同一来源；不改代码 / 行为，不是新需求 | 已登记精度；代码未改 |

【batch3 更新（Converge batch3，待第三批独立代码 Review；不改上表结论，均未经 Walter 风险接受）】
- **R2-B**：DataClient 侧已按口径固定。初始化顺序为先建 state、再 hydrate，有测试固定；未加 guard。AgentClient 侧（T-A18）仍在后续。
- **R2-E**：新增的读、reset、写都用当前共享 scenario；v1 十个方法的工厂闭包行为未改。
- **R-D**：② quarantined 必带原因（只来自 fixture）、⑤ createJob R,N,N,N 与 cancel 保留阶段快照，均由写方法按构造保持，未加 refine；①③④ 仍归 T-A14 / T-A17 / T-A20，**未修**。
- **R2-A / R-C**：本批新方法描述保持实现中立；三个旧读方法的 mock 场景句仍在，归 T-G06。
- **R-A / R-B 残留 / R-E / R-F / R2-C / R2-D**：本批不涉及，未处理。
- **Checklist R9 P3**：S-38（refresh 自身 resolve）、S-39（ingest 锚 dataset 的读法）、S-40（corrupt 后 reset 解除闩锁）均已在实施中落实；tasks 标准未改字，plan 补一句 S-39 精度（r6.7）。
- **新观察项**：O-B3-1～O-B3-6 交第三批 Review 判定是否算 P3（`converge-batch3.md` §5）。

【batch3 Review 后更新（`review-batch3.md` `49edb7e`；以本段为准，上一段“交第三批 Review 判定”为当时原文）】
- **R2-B**：DataClient 侧由 A 核对确认（先建 state 再 hydrate，测试固定、无 guard）；AgentClient 侧（T-A18）未做。
- **R2-E / R2-A / R-C / R-D ②⑤**：A 核对与上段一致；R-D ①③④ 仍归 T-A14 / T-A17 / T-A20。
- **R-A / R-B 残留 / R-E / R-F / R2-C / R2-D**：本批不涉及、未处理、未经风险接受。
- O-B3-1 / O-B3-5 / O-B3-6：A 判无发现；O-B3-2 / O-B3-3 / O-B3-4 → 下表 R3-B / R3-C / R3-A。

**第三批 Review P3 台账**（审核原文以 `review-batch3.md` §5 为准；均**未经 Walter 风险接受**，不改 Review 结论）：

| # | 摘要 | 归属 / 时点 | 当前状态 |
|---|---|---|---|
| R3-A | jobsStore `applyFilter(f)` 成功分支写 `listStatus='ready'` / `listError=null`：全新 store 先筛选后 `ensureJobs()` 不再加载未筛选列表（探针 P1），base 读错误被筛选成功清除（P2） | 集成人决定**现在修**：T-A22c（r6.8，方案 b，≤ 0.5 h，依赖 T-A22a；T-B01 / T-B02 依赖它）；plan §2.3 / tasks T-A22a 补【r6.8】精度；H-2·列表 ④ 前必须关闭 | **修复任务已登记、待实施；待新会话 A 增量代码 Review 核关闭**；代码未修 |
| R3-B | 对已删除投放重复 `removeUpload`：已归属者每次追加相同 dataset 修订与 `remove_source` 事件，未归属者静默成功；与 confirm / assign 对已删除者拒绝不一致（探针 P4） | T-C03（删除确认的消费方）或 T-A17（只读门统一入口）；A 建议最小修复 + pool spec 一例，plan §2.4 remove 句补“已删除者拒绝” | 未修 |
| R3-C | `clearJobKeys` 的 `removeItem` 抛错时，`resetMockData` 以原始 `DOMException` 拒绝（非契约形态），状态停在 unreadable（探针 P5） | T-G04（横幅 / 重置按钮接入时）；A 建议按 degraded 处理或转 `adapter_error`，plan §3 补一句 | 未修 |

观察（不计入判定，供后续任务阅读）：O-R3-1（`cancelJob` 改写 failed 作业的原失败原因）→ T-A20 / T-B05 接入时核；O-R3-2（筛选失败后 `filter` 与 `filteredJobs` 暂不对应）→ 已随 R3-A 精度写入 plan §2.3【r6.8】；O-R3-3（`readJobFixtures()` 无生产调用方）→ T-G06 收口时决定。

【首批记账时原文】**下一步（不在本记账内执行）**：集成人按 tasks §6 DAG 派第二批（入口 T-A10 / T-A22 / T-A23 / T-A24；Implement 首选 `openai/gpt-6-astra`，新会话、实施树），开工前读本节对应项；H-1 ④ 待 `integration/frontend-workbench-v2` 所有者真正集成后由其登记，本 feature 不代写。

## 9. 第二批派工准备（r6.3，2026-10-29；r6.4 按 Checklist R8 B-12 拆分后更新；历史：已实施，并经 `f72a1a1` 批次 Review 通过；“待实施”为当时原文）

- **范围（r6.4）**：T-A09b → T-A10；T-A22 → T-A22b；T-A23、T-A24 独立；同一实施树串行（6 项，约 7 h = 0.5 + 2 + 1 + 1 + 1.5 + 1；r6.3 为 5 项约 6.5 h）。**开码前置**：A 新会话 R8.1 增量复核关闭 B-12、补勾 V-02 并提交（当前 Checklist R8 未通过 = blocked）。每个任务的修改范围、完成标准（引用 AC）与验证命令以 tasks.md 原文为准，本节只摘口径，不改写。**不在本批**：T-A11（持久化）、T-A12 起的写方法、T-A18（Agent 运行关联）、T-A22a、B 组页面与其后任务——不提前实现；其余 51 项未开始（全 feature 67 项中 57 项未开始），46 AC 最终验收不因本批冒称通过。
- **基线**：实施树 / 生产方集成树 HEAD `0920004`（代码 = 受审 `13a3373`），upstream 继续 pin `90187f7`，正式 base `43b6d79`；main `cf8e11b` 相对 `90187f7` 只改 `specs/README.md` 与 frontend-workbench 文档 / 截图（frontend / docs / AGENTS / backend / design 零差异），只记录、不自动合入。
- **模型**：Implement 首选 `openai/gpt-6-astra`（新会话、实施树），回退 `deepseek/deepseek-flash`；只有调用失败才回退（AGENTS §6）。
- **写权限 / 所有权**（tasks §1-5，按任务细化）：
  - T-A10：新建 `frontend/src/contracts/mock/job-state.ts`；改 `contracts/{client.ts,methods.ts,mock/index.ts,real/index.ts}`，生成物只经 `pnpm -C frontend contract`；新建 `tests/unit/jobs/{job-state-read,real-stubs}.spec.ts`；（r6.4）**不再**改任何 fixture 文件与 `fixtures.spec.ts`（已移交 T-A09b）。不改 `jobs.json` / `interventions.json` / `uploads.json`、schema（`types.ts` 本任务不需改动）、v1 顶层 fixtures、三份既有契约测试。
  - T-A09b（r6.4 新增，fixture-only）：只改 `contracts/mock/fixtures/jobs/{job-detail,deliverable}.json` 与 `tests/unit/jobs/fixtures.spec.ts`（只做 tasks T-A09b 所列最小校正）；不改 `jobs.json` / `interventions.json` / `uploads.json`、`types.ts` / 生成物、任何源码与其他测试。
  - T-A22：新建 `frontend/src/jobs/routes.ts`、`jobs/pages/{JobListPage,JobDetailPage}.vue`（骨架、不读数据）、`tests/unit/jobs/routes.spec.ts`；`frontend/src/main.ts` 只加挂载前 `registerJobRoutes(router, pinia)`。
  - T-A22b：新建 `frontend/src/jobs/stores/session.ts`、`tests/unit/jobs/session-context.spec.ts`；改 `jobs/routes.ts`（调用 `useSessionStore(pinia).bindRouter(router)`）。
  - T-A23：新建 `frontend/src/jobs/components/{JobStatusBadge,ArtifactStatusBadge,SourceBadge}.vue`、`tests/component/jobs/badges.spec.ts`；不导入 / 不改 `shared/components/Badge.vue`。
  - T-A24：新建 `frontend/src/jobs/diff.ts`、`tests/unit/jobs/diff.spec.ts`。
  - 一律不改：`app/**`、`workbench/**`、`agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}`、`shared/**`、`scripts/**`、`package.json` / 锁文件、`backend/`、`docs/`、spec / checklist / 审核原件；不写 v2 任何树。
- **r6.3 精度口径（摘要；原文见 tasks 对应任务与 plan【r6.3】）**：
  1. **R-B（r6.4：T-A09b 校正、T-A10 读回）**：fixture-only——`not_started` 种子为空工作区；`getStageWorkspace` 原样返回、不按阶段态过滤；不加生产 guard；`createJob` 初始空产物不变；`fixtures.spec.ts` 只收窄到已开始阶段并新增 `WI not-started seeds`，不删用例、不放宽 schema。
  2. **R-D**：本批不新增五处跨字段 refine；由后续写方法按构造保持（§8 表）。T-A10 只落实 `commit(mutator)` 的深拷贝 → 既有边界 schema 校验 → 整体替换，与读 API 返回副本。
  3. **H-4（T-A22b）**：`context` 为 getter；唯一额外成员 `bindRouter(router)` 只注册 `afterEach`、不接受上下文；不顶层 `useStore`、不用 WeakMap / 注册表 / provide、不改 `app/router.ts`、不导入 `agent/**` / `routes.ts`；测试只经 `registerJobRoutes` + 真实 memory-history router + 真实 Pinia 导航，`@ts-expect-error` 只验类型层；不加 failure / 竞态兜底。
  4. **T-A23**：自制徽标，复用令牌、不导入 Badge.vue（基线事实见 tasks §0.0 r6.3 复核 ②）。
  5. **T-A24**：`'\n'` 切行、空串 0 行；任一侧 > 2000 行直接返回摘要，以 2000 / 2001 边界断言返回形态。
- **验证命令**：逐任务按 tasks 原文执行（r6.4：T-A09b 3 条、T-A10 6 条、T-A22 3 条、T-A22b 3 条、T-A23 3 条、T-A24 3 条，共 21 条；r6.3 为 18 条；均带 jobs 路径 / `WI` 标题），另建议每任务提交前跑 `pnpm -C frontend contract --check`（仅 T-A10 改契约）、`git diff --check`，批末跑全量 `pnpm -C frontend test:unit` 与 `pnpm -C frontend check` 防回归（非新增标准）。测试用真实 Pinia / router / mock client，不 `vi.mock` 内部模块。
- **回报要求**：同 §4（固定 commit、逐命令输出摘要、失败原文脱敏摘要）；任一任务实际超 2 h 或发现与 tasks §0.0 不符，先停并回报（r6.4：S-22 只是兜底，已知超额已在 Tasks 阶段拆出 T-A09b）。
- **H-x 生产方证据（完成后可形成，现均未取得）**：H-3·路由切片 = T-A22 commit + `routes.spec.ts`；H-4 = T-A22b commit + `session-context.spec.ts -t "WI H-4"`；H-2·标签 = T-A01 + T-A23 commit + `contract-labels.spec.ts -t "WI labels"` / `badges.spec.ts -t "WI status badges"`；② 当前有效 = R7 `9acf3de`（r6.4：A 已对 r6.3 做 Checklist R8 但**未通过**（`7b91a2c`），不能作 ②；R8.1 通过并提交后以其 SHA 为准）；④ 只能由 `integration/frontend-workbench-v2` 所有者登记。
- **复核状态（r6.4，以本句为准）**：A 已按下句建议做 Checklist R8（限定范围定向复核）：T-A23 / H-4 `bindRouter` / R-B 落法 / R-D / T-A24 设计通过，唯一阻断 B-12（粒度）→ r6.4 拆分 → A 新会话 R8.1 只核增量（拆分落点 / 新任务 1:1 / AC 祖先 / 依赖 / 结构数字）并补勾 V-02；在此之前第二批 6 项均不得开码（下句“T-A10 / T-A22 / T-A24 可先开工”已失效）。
- **复核与实施状态（batch2，以本句为准）**：R8.1 已通过并提交（`34d339e`），第二批据此开码；6 项已实施（`75a1159` → `27e59e6`），并已集成到生产方集成树 `27e59e6`。② 当前有效 = **R8.1 `34d339e`**。本批独立代码 Review 待进行。上面“blocked / 待 R8.1”的表述是当时原文。
- **Review 状态（第二批 Review 后，以本句为准）**：本批独立代码 Review 已完成并**通过**（`review-batch2.md`，`f72a1a1`，0 P1 / P2，5 P3 R2-A～R2-E，见 §8）；上句“待进行”为当时原文。
- **复核建议（r6.3 原文）**：R-B（A 首批 Review 自身建议的落法）、R-D（不扩机制）、T-A22 / T-A24 不需开码前另行 A 复核；T-A23（tasks §7 所指“基线事实与任务文字不符”一类）与 H-4 `bindRouter`（交接接口新增公开成员名；R7 审过机制、未审该名称）建议由审核员 A（新会话、异模型）对 r6.3 文档 diff 做一次**限定范围定向复核**（只审这两处 + R-B 落点）并提交 SHA 后，再开 T-A22b / T-A23 的代码；T-A10 / T-A22 / T-A24 可先开工。若要以本批代码 Review 替代该定向复核，属 Walter / 集成人裁量，本文件不代定；不声称 R7 自动覆盖 r6.3。

## 10. 第三批派工准备（r6.6，2026-10-29；待实施，不预写结果）

- **范围**：T-A11 → T-A12 → T-A13 → T-A22a，同一实施树串行（4 项，约 7 h = 2 + 2 + 1.5 + 1.5）。每个任务的修改范围、完成标准（引用 AC）与验证命令以 tasks.md 原文为准，本节只摘口径。
  - **不在本批**：T-A14～T-A18、T-A21、B 组页面、投放 UI（T-C 组）、持久化横幅（T-G04）。不提前实现，也不冒称已覆盖全部写后刷新管线。
- **基线**：
  - 实施树 / 生产方集成树代码 = `27e59e6`（第二批 Review 通过，`f72a1a1`）；本规格修订起点 `f1b7c06`。
  - upstream 继续 pin `90187f7`，正式 base 仍 `43b6d79`。
  - main `072bb12` 不导入（R2-D 同步流程不变，不是本批人工门）。
- **模型**：Implement 首选 `openai/gpt-6-astra`（新会话、实施树），回退 `deepseek/deepseek-flash`；只有调用失败才回退（AGENTS §6）。
- **写权限 / 所有权**（tasks §1-5，按任务细化）：
  - **T-A11**：
    - 新建 `frontend/src/jobs/persistence.ts`、`tests/unit/jobs/persistence.spec.ts`。
    - 改 `contracts/{mock/job-state.ts, mock/index.ts, client.ts, methods.ts, real/index.ts}`；生成物只经 `pnpm -C frontend contract`。
    - 只在语义变更处改 `tests/unit/jobs/job-state-read.spec.ts`：增加 `beforeEach` 清 localStorage，并改写 `WI scenarios read` 中的两例（tasks T-A11【r6.6 精度】）。
    - 【r6.6.1】`tests/unit/jobs/real-stubs.spec.ts`：只在 `requests` 表追加 `resetMockData` 一键。既有键、`satisfies`、断言与 describe / test 不改。
  - **T-A12**：
    - 改 `contracts/types.ts`（只加 `CreateJobInputSchema` / `IntakeReceiptSchema` 并注册），以及 `jobs/persistence.ts`（`mappingHistory`）、`contracts/{mock/job-state.ts, mock/index.ts, client.ts, methods.ts, real/index.ts}`；生成物。
    - 新建 `tests/unit/jobs/job-state-intake.spec.ts`。
    - 【r6.6.1】`tests/unit/jobs/real-stubs.spec.ts`：只在 `requests` 表追加 `createJob` / `submitIntake` / `getIntakePreview` / `confirmIntake` 四键（参数取最小合法值），其余不改。
  - **T-A13**：
    - 改 `contracts/{mock/job-state.ts, mock/index.ts, client.ts, methods.ts, real/index.ts}`；生成物。
    - 新建 `tests/unit/jobs/job-state-pool.spec.ts`。
    - 【r6.6.1】`tests/unit/jobs/real-stubs.spec.ts`：只在 `requests` 表追加 `listUnassignedUploads` / `assignUpload` / `removeUpload` / `cancelJob` 四键（参数取最小合法值），其余不改。
  - **T-A22a**：
    - 新建 `frontend/src/jobs/stores/jobs.ts`、`tests/unit/jobs/jobs-store.spec.ts`。
    - `frontend/src/main.ts` 只加 jobsStore 的应用级订阅与解除。
  - **一律不改**：
    - fixture 文件；v1 三份契约测试（`tests/unit/{mock,contracts,contract-doc}.spec.ts`；`real-stubs.spec.ts` 属本 feature jobs 测试，按上列 r6.6.1 只追加键）；`scripts/**`；`package.json` / 锁文件。
    - `app/**`、`workbench/**`、`shared/**`、`agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}`。
    - `backend/`、`docs/`、spec / checklist / 审核原件；不写 v2 任何树。
- **r6.6 口径摘要**（原文见 plan §2.3 / §2.4 / §3【r6.6】与 tasks 四个任务的【r6.6 精度】）：
  1. **持久化**：
     - 只有 normal 且无覆盖时读一次 `fai.jobs.v1`；getter 只读一次。
     - 快照 = `{version:1, data}`，data 为业务子集；Upload 白名单 + 既有 `quarantineReason`；内部 `mappingHistory`。
     - 保存失败（> 512 KiB 或 setItem 异常）只置 degraded，业务成功，每次 commit 照常尝试。
     - 损坏时为 unreadable，不覆写，直到重置。
     - 重置用会话 seeds：删两 key → 重建 → 重写 `fai.jobs.v1`；非持久会话零访问。
     - `persistence.ts` 只读状态订阅；不导入 job-state；不加 guard（R2-B）。
  2. **写方法**：
     - 签名与回执：`CreateJobInput`、`IntakeReceipt`，复用 `WriteReceipt`；回执 inbox 在 T-A21 前为真实 0。
     - 时机：slow 延迟后执行；error 在 commit 替换前拒绝，未知锚仍 not_found。
     - 以作业为目标的写在入口查一次 delivered / cancelled（既有领域规则；全方法只读门归 T-A17）。
  3. **投放**：
     - 合成预览为固定值；confirm 只从 pending 出发，fixture 预置原因 → quarantined。
     - 未归属投放不写事件；assign 移动记录并只补一条 ingest；remove 只置 `removed`；cancel 保留快照、不 abort。
  4. **投影**：`listUnassignedUploads` 与 collect.uploads 是唯一的“当前列表”位置；状态层与快照不过滤。
  5. **jobsStore**：
     - `refresh` 只重读未筛选列表与筛选副本；`createJob` 成功后恰一次 refresh，失败不动缓存。
     - 只有带 `jobContext` 的三种终态触发 refresh；`main.ts` 应用级订阅，卸载 / HMR 时解除。
     - 测试用真实 mock AgentClient 回放，不加生产注入。
- **验证命令**：逐任务按 tasks 原文执行，共 19 条（T-A11 5 / T-A12 5 / T-A13 4 / T-A22a 5），均带 jobs 路径与 `WI` 标题。
  - 另建议（非新增标准）：每任务提交前跑 `git diff --check`；改契约的任务跑 `contract --check`；A11 / A12 / A13 加跑 `pnpm -C frontend test:unit tests/unit/jobs/real-stubs.spec.ts`（即 T-A10 命令 4，r6.6.1）；批末跑全量 `pnpm -C frontend test:unit` 与 `pnpm -C frontend check` 防回归。
  - A11 起 normal 会话会持久化，新 spec 每例前清 localStorage。
- **回报要求**：同 §4（固定 commit、逐命令输出摘要、失败原文脱敏摘要）。任一任务实际超过 2 h（T-A11 / T-A12 已到上限），或发现与 tasks / plan 精度不符，先停并回报，不在实施中偷换。
- **H-x**：本批完成后，H-2·列表的提供任务（T-A01 / A02 / A10 / A12 / A22a）齐备，可形成生产方 ①③；H-6 仍缺 T-A21。② = 当时已提交的有效 Checklist（现为 R9 `ab742f5`；r6.6 撰写时为 R8.1 `34d339e`）；④ 只能由 `integration/frontend-workbench-v2` 所有者登记。
- **r6.6.1 范围精度（2026-10-29，以本条为准）**：
  - **起因**：Astra 在 T-A11 开码前按范围纪律停下（实施树 @ `ab742f5`，clean，未改代码、未提交、未运行本轮验证命令）。`real-stubs.spec.ts` 的 `requests` 表以 `satisfies { [Method in keyof DataClient]: … }` 强制全键，并断言 `requests` / `dataMethods` / `dataClient` 键严格相等，所以 A11 / A12 / A13 新增的 9 个方法都必须加键，而 r6.6 写入清单漏列了该文件。
  - **定性**：这是 r6.6 的范围遗漏，不是模型调用失败（Astra 调用正常、不回退），也不是产品测试红。R9 已注明“real 桩须加键（在 T-A11 范围）”，但这不构成实施者的写权限，因此须在 tasks 显式写明。
  - **修订**：上列三任务所有权各加一条，tasks 三任务修改范围加【r6.6.1 范围精度】。不改需求、方法、标准、命令、任务数、估时或 AC；plan §1 的“jobs 测试归本 feature”不变。
  - **后续**：集成人提交并同步实施树后，Astra 从 T-A11 继续。
- **r6.6.2 语义回归许可（2026-10-29，以本条为准）**：
  - **起因**：T-A11 `c7ebccb`、T-A12 `742d6aa` 已提交；T-A13 已实现但未提交（实施树工作区保留其改动）。A13 末轮全量 `test:unit` 925 pass / 1 fail，唯一失败 = `tests/unit/jobs/persistence.spec.ts` `WI non-normal` 参数化用例的 error 分支：该例在切到当前场景后直接 `commit(...'memory edit')` 并期待成功，而 A12 按已批准语义（plan §2.4【r6.6】、T-A12【r6.6 精度】）在 commit 内、边界校验后、替换状态前抛 adapter_error。A12 的写入清单不含该文件，Astra 停下正确。
  - **定性**：已批准语义下旧测试预期的维护，不是需求变更、不是新 guard，也不是调用失败（不回退）。全量红作为失败留痕保留。
  - **写权限**：
    - **T-A12** 加一条：`tests/unit/jobs/persistence.spec.ts` 只改该参数化用例的 error 分支——断言真实 commit 抛 adapter_error，且目标作业经真实 job-state 读函数读回不变；其余 7 场景照旧 commit。保留 error 业务读失败、显式 reset 允许、两 key 零访问、无 clear、normal 快照与 inbox 哨兵不变等全部既有断言；不放宽生产规则、不 skip / 注释、不改场景列表或断言白名单。可作 A12 的独立 test-fix commit。
    - **T-A13**：对该文件无额外许可，不扩到其他用例 / 文件。
  - **不变**：任务数、估时、依赖、完成标准 / 命令（224 ↔ 224）、46 AC、R9（blob `74084c1…`）；plan 不改。
  - **后续**：集成人提交并定向同步三份文档到实施树（保留 A13 工作区改动，不 reset / stash / 覆盖 frontend 文件）后，Astra 先提交 A12 test-fix，再跑全量回归、交付 A13，继续 T-A22a。批次 Review 核真实 diff。
- **复核建议**：见 analyze.md「Analyze R12」§8。不自动触发新的 A 轮次；持久化白名单补列与 `mappingHistory` 提请第三批独立代码 Review 明确核对；开码前是否另做限定范围的 A 定向复核，由 Walter / 集成人裁量。
- **实施状态（Converge batch3，以本条为准；本节上文“待实施 / 后续”为当时原文）**：
  - 四项已按上列写权限实施：T-A11 `c7ebccb`、T-A12 `742d6aa`（+ test-fix `0a2d1a5`）、T-A13 `a5ad11c`、T-A22a `0032fc6`，并 ff-only 集成到生产方集成树 `0032fc6`。
  - Converge 逐提交核对文件清单，未越出写权限：r6.6.1 只追加 9 个 `requests` 键；r6.6.2 只改 error 分支；T-A13 未碰 `persistence.spec.ts`。
  - 唯一的落点顺序差异：T-A12 对 `persistence.ts` 的写权限没有用到，因为 `mappingHistory` 已随 T-A11 落地（O-B3-1）。
  - 两次范围停止（r6.6.1 开码前、r6.6.2 A13 前）都按纪律处理，不是调用失败、不回退。
  - 本批**已收口、待第三批独立代码 Review**；不是 Review / Gate 2 / Handoff。

## 11. R3-A Converge 补修派工准备（T-A22c，r6.8，2026-10-29；待实施，不预写结果）

- **起因**：第三批代码 Review（`review-batch3.md`，原件 `49edb7e`）判本批通过（0 P1 / P2），P3 R3-A 要求在 T-B02 / H-2 ④ 之前关闭。集成人决定现在修，以免拖到 H-2·列表消费；R3-B / R3-C 留原归属。按 AGENTS §2 第 9 步追加任务，不并入已完成的 T-A22a，也不并入 B 组 UI。
- **范围**：仅 T-A22c（≤ 0.5 h，依赖 T-A22a，已满足）。完成标准与命令以 tasks.md 原文为准（3 / 3）：
  1. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 list status"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint && pnpm -C frontend contract --check`
- **方案**：A 原件 R3-A 最小方案 **(b)**。只删 `jobs/stores/jobs.ts` 中 `applyFilter(f)` 成功分支写 `listStatus` / `listError` 的两行；失败分支、`applyFilter(null)`、其余 action、S-38 自身 resolve、类型与对外成员不变。不加筛选状态机 / 回滚 / 锁 / 请求序号 / 新公开成员（AGENTS §5.1）。
- **写权限**：
  - `frontend/src/jobs/stores/jobs.ts`：只改上述两行。
  - `frontend/tests/unit/jobs/jobs-store.spec.ts`：新增 describe `WI H-2 list status`（两例）；只改 `WI H-2 filter` 组的 “… the next filter read clears the error” 一例（标题末段与切回 normal 之后的断言改为“筛选成功保留错误、显式 refresh 清错”），不删测试；其余用例不改。
  - **一律不改**：`main.ts`、`contracts/**` 与生成物、其他 jobs 源 / 测试、fixture、`app/**` / `shared/**` / `agent/**` / `workbench/**`、scripts、package / 锁 / 配置、e2e、spec / checklist / 审核原件 / docs；不写 v2 任何树。
- **基线与模型**：实施树代码 = `0032fc6`（第三批已审代码）；规格以集成人提交本 r6.8 文档后的 SHA 为准。Implement 首选 `openai/gpt-6-astra`（新会话、实施树），回退 `deepseek/deepseek-flash`；只有调用失败才回退（AGENTS §6）。
- **建议回归**（非新增标准）：提交前 `git diff --check`；批末全量 `pnpm -C frontend test:unit` 与 `pnpm -C frontend check` 防回归。T-A22a 命令 2 `-t "WI H-2 filter"` 的用例数应仍为 4（新 describe 标题不含该子串），断言按 r6.8 变化。
- **复核**：有效 Checklist 仍为 R9（不改、不重勾）。实施后由新会话 A（与实施异模型）做**增量代码 Review**，只核 R3-A 是否关闭与本任务 diff；第三批其他结论保留，不再找模型重新判定通过。
- **H-x**：T-A22c 关闭并经 A 增量复核后，H-2·列表的 ① 改登记为 T-A22c 提交，③ 补 `WI H-2` 新输出；④ 仍只能由 `integration/frontend-workbench-v2` 所有者登记。关闭前不放行 ④。
