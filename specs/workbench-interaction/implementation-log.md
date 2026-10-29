# Feature: workbench-interaction 实施日志（implementation-log.md）

> **性质**：Implement 阶段的派工、授权、模型路由、真实基线与证据路径登记（AGENTS §6 规则 4 / 7 的“派工 / 回退简记”）。它**不是** Gate 2 Handoff、不是 `review.md`，也不是审核结论；正式 Handoff 仍按 AGENTS §2 第 11 步在 `review.md` 完成。
> **当前状态（2026-10-29 r6.12 第五批派工准备；未审核、未实施；以本块为准。下一块 R4-A 关闭块中的“70 个任务 / 104.5 h / 43 未开始 / 235 / 235”为当时原文，其完成记录与开放项仍有效）**：
> - **本批**：T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04（9 项，约 12 h，33 条命令）；逐任务文件所有权、模型、AC 与命令见 §20。
> - **进度**：73 个任务、约 107 h；**27 已完成 / 46 未开始**；245 / 245；46 AC 最终验收 **0**；feature 未收敛。
> - **开码前置**：独立 A 新会话 Checklist R11 定向复核通过并提交；R10 `37e2f71` 不自动覆盖新接口。T-A13a 是否属既有领域规则由 R11 判定。
> - 本块不是 Review / Gate 2 / Handoff；没有运行产品测试，不预写结果。

> **当前状态（2026-10-29 R4-A 关闭，第四批 5 项 + T-B04a 技术通过；以本块为准。下一块及 §16～§18 中的“Review 未通过”“待 §5.1 批准”“待 A”“R4-A 未关闭”“R2-C 不记关闭”“① 候选”均为当时原文）**：
> - **进度**：70 个任务、约 104.5 h；**27 / 70 已完成**（21 + 第四批 5 + T-B04a；已完成 = 批次 / 增量 Review 通过，非最终 AC）；**43 未开始**；235 / 235；46 AC 最终验收 **0**；feature **未收敛**。
> - **Review**：A 增量 Review `review-batch4-r4a.md`（原件 `46e8fbe`，claude-fable-5-1 via anthropic）判本增量通过（0 P1 / P2 / 0 新 P3）：**R4-A 关闭、R2-C 技术关闭、第四批 5 项 + T-B04a 技术通过**。原件 `9812f64` 的未通过结论原样保留（补修后复核闭环，不是翻票）。详见 §19。
> - **P3**：R4-B～R4-E、S-41、R3-B / R3-C 及前批未关项仍开放，**均未经风险接受**（§8【R4-A 关闭后更新】）。
> - **H-x**：H-2·标签 ① `5c00cf6` 转生产已核；H-2·列表 ① 仍 `af24c82`；页面切片 C 组未做 → 未交付；④ 全缺。
> - **合并**：Walter 已选全部工作完成后再合 main；Draft PR #12 保持 Draft；25 个目录保留复用，不删目录 / 分支。
>
> 不是全 feature Review / Gate 2 / Handoff。

> 【历史原文】**当前状态（2026-10-29 第四批 Review 未通过 + R4-A 工程审批等待 = 批次安全点；以本块为准。下一块 Converge batch4 中的“5 项已实施、待第四批独立代码 Review”“69 个任务、约 104 h”“232 / 232”“43 项未开始”“R2-C 待 A 确认关闭”为当时原文，其余记录仍有效）**：
> - **进度**：**70 个任务、约 104.5 h**。21 项已完成；**5 项已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）**，不计完成；**44 项未开始**（含草案 T-B04a，blocked_by Walter §5.1 批准）。235 / 235；46 AC 最终验收 **0**；feature **未收敛**。
> - **Review**：`review-batch4.md`（原件 `9812f64`，A = claude-fable-5-1 via anthropic）判**未通过：1 P2 R4-A + 4 P3 R4-B～R4-E**，结论不改。A 亲跑全量单测 34 / 1018 / 0、17 条任务命令同数、四份 E2E 29 / 0、六守卫 / typecheck / lint / contract 24 / 10 / 2，均为绿，但不改变判定。
> - **R4-A**：真实 Chrome slow 下复现——离开 / Back / 选“交付”后，迟到的 canonical replace 会把用户劫回 `/process` 并覆盖历史；请求按序完成，不是乱序，也不是伪影。修复草案 T-B04a（`onCleanup` 失效标志，约 3～5 行 + 2 例组件 + 1 例 E2E）**待 Walter 单独批准，未开码**；通用代码授权不覆盖。详见 §16。
> - **P3**：R2-C 代码经 A 核实，但关闭条件（本批通过）未满足，不记关闭；R4-B～R4-E、S-41、R3-B / R3-C 等均未经风险接受（§8）。
> - **H-x**：H-2·标签 ① 候选 `5c00cf6` 不转生产已核；H-2·列表 ① 仍 `af24c82`；页面切片未通过、C 组未做 → 未交付；④ 全缺。
> - 代码固定 `6c082fd`；有效 Checklist R10 `37e2f71`（未改）。
>
> 不是全 feature Review / Gate 2 / Handoff，也不是用户叫停；是 AGENTS §5.1 工程审批边界。

> 【历史原文】**当前状态（2026-10-29 第四批实施后 Converge batch4；以本块为准。下一块 r6.9 中的“21 / 69 已完成、48 未开始”“全部待实施”“当前未审核，不得开码”“最近有效 Checklist 仍为 R9”为当时原文，其余记录仍有效）**：
> - **进度**：**69 个任务、约 104 h**；**26 / 69 已实施** = 21 项已完成（四次批次 / 增量 Review）+ **第四批 5 项已实施、待第四批独立代码 Review**；**43 项未开始**；232 / 232；46 AC 最终验收 **0**；feature **未收敛**（43 项未实施 + H 组外部阻塞）。
> - **前置**：Checklist **R10 通过**（A = claude-fable-5-1 via anthropic，`01a187cd…`；26 / 26，0 P1 / P2，P3 S-41～S-43；原件 `37e2f71`，blob `4537c55…`，未改）。
> - **第四批固定提交**：T-B01 `5c00cf6` → T-B02 `0221a94` → T-A22d `ca7dca1` → T-B04 `cc6559d` → T-B03 `6c082fd`（diff `37e2f71..6c082fd -- frontend`，17 文件，+1870 / −11）；实施者 openai/gpt-6-astra 三个新会话，均未回退；集成人 ff-only 至 `integration/workbench-interaction` @ `6c082fd`。证据与失败留痕见 §15。
> - **Converge**：`converge-batch4.md` / analyze.md「Analyze R17」判本批**已收口、待独立 A 代码 Review**，不新增任务；精度记为 r6.10；观察 O-B4-1～6 交 A。
> - **P3**：R2-C 代码已修、**待 A 确认关闭**；R10 S-41 归本 feature（T-B05 开工前精度轮）、S-42 已落实、S-43 已在 plan 登记；R3-B / R3-C 等未关项不变（§8），均未经 Walter 风险接受。
> - **H-x**：H-2·标签 ① 候选 `5c00cf6`（待 Review）；H-2·列表 ① 仍 `af24c82`；页面切片缺 C 组，未交付；④ 全缺。
>
> 不是 Review / Gate 2 / Handoff。
>
> **当前状态（2026-10-29 第四批派工准备 r6.9；以本块为准。下一块“第三批安全点”中的“68 个任务、约 102.5 h”“47 项未开始”“下一可起步”为当时原文，其余记录仍有效）**：
> - **进度**：**69 个任务、约 104 h**（r6.9 新增 T-A22d 1 h；T-B01 1.5 → 2 h）；**21 / 69 已完成、48 未开始**；46 AC 最终验收 **0**；feature **未收敛**。
> - **第四批**：T-B01 → T-B02 → T-A22d → T-B04 → T-B03（约 7.5 h，17 条命令），开工前机制精度已补（plan / tasks【r6.9】，analyze.md「Analyze R16」），**全部待实施**。写权限、口径、命令与风险见 §14。
> - **开码前置**：独立 A 新会话 **Checklist R10 定向复核**通过并提交。**当前未审核，不得开码。** 最近有效 Checklist 仍为 R9 `ab742f5`（blob `74084c13…`，未改）。
> - **结构**：232 / 232；DAG 环检测无环，编号前向检查唯一有意回边 T-B03 → T-B04；AC 矩阵 46 行，部分前置均为最终任务的祖先。
> - **P3**：R2-C 归 T-B01（未修，待实施）；R3-B / R3-C 等其余未关项不变（§8），均未经 Walter 风险接受。
> - **H-x**：不变（H-2·列表 ①②③ 齐、④ 缺；页面切片未交付）。
>
> 不是 Review / Gate 2 / Handoff。
>
> **当前状态（2026-10-29 T-A22c 增量代码 Review 后状态登记 = 第三批安全点；以本块为准，下一块“T-A22c 实施后增量 Converge”中的“1 项待定向 Review / R3-A 代码已修待复核 / ④ 复核前不放行 / T-B01 是否等复核”为当时原文）**：
> - **进度**：**68 个任务、约 102.5 h**；**21 / 68 已完成**（首批 `af95b66` 10、第二批 `f72a1a1` 6、第三批 `49edb7e` 4、增量 `69faacc` 1 = T-A22c）；**47 项未开始**。“已完成”= 所在批次代码 Review 通过；46 AC 最终验收 **0**；feature **未收敛**（47 项未实施 + H 组外部阻塞）。
> - **T-A22c 增量代码 Review**：A = claude-fable-5-1 via anthropic（新会话 `01a1875e-96b8-7724-85fe-089647041c61`、独立 worktree，固定审 `eb91340` + diff `e7716a8..af24c82`）判**通过：0 P1 / P2、0 新 P3，R3-A 关闭**；原件 `review-batch3-cache-fix.md` 由集成人原样提交于 `69faacccabd8b089a9f240b28e6449a8fea90619`。A 亲跑与只读探针见 §13。
> - **P3**：R3-A **已关闭**；**R3-B（→ T-C03 / T-A17）、R3-C（→ T-G04）仍未修、未经 Walter 风险接受**；前两批 P3 状态不变（§8）。本记账不把任何 P3 写成已接受。
> - **代码固定**：生产代码 = `af24c826f41580d27f90ce611fb2f55fec44acbf`（`69faacc` 之后只有文档提交）。实施树仍在 `af24c82`，生产方集成树已到 `69faacc`；集成人提交本状态后再把三树 ff-only 到同一状态 SHA。
> - **H-x**：H-2·列表 ①②③ 生产方齐（① `af24c82`、② R9 `ab742f5`、③ 实施者 + A 亲跑），**④ 仍缺 → 待消费方集成（未交付）**；H-6 缺 T-A21；H-5 / 页面切片未做；H-1 / H-2·标签 / H-3 / H-4 保留历史登记、④ 缺。
> - **页面现状**：`/jobs` 与详情页仍是骨架，jobsStore 只被 `main.ts` 订阅、未被页面消费，写 API 大部分未接 UI。**不能称作业页面已完成**。
> - **下一可起步**：T-A14 / T-A15 / T-A16、T-B01（→ T-B02 / T-B04）、T-C01；T-B01 前按 §8 R2-C 核对徽标令牌映射。
> - 有效 Checklist：R9 `ab742f5`（blob `74084c13…`，未改）。
>
> 不是全 feature Review / Gate 2 / Handoff。
>
> 【历史原文】**当前状态（2026-10-29 T-A22c 实施后增量 Converge；当时以本块为准，下一块 r6.8 中的“20 已完成 / 48 未开始 / T-A22c 待实施 / 代码未修 / 下一可起步 T-A22c”为当时原文）**：
> - **进度**：**68 个任务、约 102.5 h**；**21 / 68 已实施** = 20 项已完成（首批 `af95b66` 10、第二批 `f72a1a1` 6、第三批 `49edb7e` 4）+ **1 项已实施、待定向 Review**（T-A22c）；**47 项未开始**。46 AC 最终验收 0；feature **未收敛**。
> - **排期决定**：集成人在 `e7716a8` 的 commit body 中接受 T-B01 依赖 T-A22c（AC-001-1 / 001-4 的祖先覆盖），这是任务排期，不是新的产品需求或人工门。
> - **T-A22c**：实施者 openai/gpt-6-astra（新会话 `01a1874b-4f8e-73e6-8b86-1adc1f7a9321`，首选，调用正常，未回退），基线 `e7716a8`，提交 `af24c826f41580d27f90ce611fb2f55fec44acbf`，只改两个授权文件。先红后绿属实；三条任务命令 2 / 27 / 工程门通过；末轮全量单测 31 / 953 / 0、六守卫、shell + agent E2E 24（证据见 §12）。
> - **增量 Converge**：`converge-batch3-cache-fix.md`（analyze.md「Analyze R15」）判与 r6.8 逐条一致、无规格差距，**待独立 A 增量 Review**。
> - **R3-A**：**代码已修、待 A 复核**（不由 Converge 判关闭）。**R3-B / R3-C**：未改，未经 Walter 风险接受（§8 台账）。
> - **有效 Checklist**：R9 `ab742f5`（blob `74084c13…`，未改）。
> - **H-x**：H-2·列表 ① 候选 `af24c82`、③ 新组 2 / 整文件 27（原四组 25）+ 工程门（实施者执行、待 A），**④ 仍缺，复核前不放行**；生产方集成树 `integration/workbench-interaction` @ `af24c82` 只是旁证。H-6 仍缺 T-A21；H-5 / 页面切片未做。
> - **下一可起步**（脚本核，以 21 项计入）：T-A14 / T-A15 / T-A16、T-B01、T-C01。R3-A 须在 T-B02 / H-2 ④ 之前关闭；T-B01 是否等 A 复核，由集成人决定。
>
> 不是 Review / Gate 2 / Handoff。
>
> 【历史原文】**当前状态（2026-10-29 第三批独立代码 Review 后 + R3-A Converge 补修登记 r6.8；当时以本块为准，下一块 batch3 中的“4 项已实施、待第三批独立代码 Review / 20 / 67 / 47 未开始 / 下一可起步”为当时原文）**：
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
| 第三批批次代码 Review（非全 feature Review、非 Gate 2） | **通过**：0 P1 / P2，3 项 P3（R3-A～R3-C，未经 Walter 风险接受，见 §8）（本行登记前曾为“待进行”） | A = claude-fable-5-1 via anthropic，新会话、独立 worktree，固定审文档 `e14ad25` + 代码 `0032fc6`（diff `ab742f5..0032fc6 -- frontend`）；审核原件 `review-batch3.md` 提交 `49edb7ebf7bd0fdb0ab9ea0767c33945b39e13cf`（只引用、不改写） |
| T-A22c 增量代码 Review（R3-A；非全 feature Review、非 Gate 2） | **通过**：0 P1 / P2、0 新 P3，**R3-A 关闭**；R3-B / R3-C 不在范围、仍未修 | A = claude-fable-5-1 via anthropic，新会话、独立 worktree，固定审文档 `eb91340` + 代码 diff `e7716a8..af24c82`；审核原件 `review-batch3-cache-fix.md` 提交 `69faacccabd8b089a9f240b28e6449a8fea90619`（只引用、不改写） |
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
| 第三批 Review 树（只读审查） | `D:/2030/Futures-AI-interaction-review-batch3` / `review/workbench-interaction-batch3-code`（起点 `e14ad25`；A 只写 `review-batch3.md`，由集成人原样提交 `49edb7e`） | 审核员 A（已结束）；不写代码 / checklist |
| T-A22c 实施（R3-A 补修） | 实施树 `feat/workbench-interaction-astra` 自 r6.8 `e7716a8` 起步，HEAD = `af24c826f41580d27f90ce611fb2f55fec44acbf`（clean；状态登记时只读 `worktree list` 核）；生产方集成树 `integration/workbench-interaction` 由集成人串行 ff-only，增量 Converge 时为 `af24c82`，状态登记时只读核为 `69faacc` | 实施会话 / 集成人（同上） |
| T-A22c 增量 Review 树（只读审查） | `D:/2030/Futures-AI-interaction-review-batch3-cache-fix` / `review/workbench-interaction-batch3-cache-fix`（起点 `eb91340`；A 只写 `review-batch3-cache-fix.md`，由集成人原样提交 `69faacc`） | 审核员 A（已结束）；不写代码 / checklist |
| 第三批安全点状态登记 | 同 batch3 Converge 文档树，HEAD `69faacc`（含两份 Review 原件；代码 = `af24c82`） | 记账会话只写 tasks / analyze / implementation-log / interface-handoff 与 README 本 feature 两行；不改代码 / plan / spec / checklist / Review / Converge 原件；不 commit（由集成人提交） |
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

【2026-10-29 第三批独立 Review 与 T-A22c 补记（以本段为准；上表“已实施（待第三批 Review）”与“本批 Converge 报告待集成人提交”为 Converge batch3 时原文）】
- **Converge 提交**：`converge-batch3.md` 由集成人提交于 `e14ad25d525d319fee85e2fc34e4ebb972e42150`。
- **第三批独立 Review**：`review-batch3.md`（A = claude-fable-5-1 via anthropic，原件 `49edb7ebf7bd0fdb0ab9ea0767c33945b39e13cf`），**本批通过，0 P1 / P2，3 P3 R3-A～R3-C**。上表 T-A11 / T-A12（含 test-fix）/ T-A13 / T-A22a 自此记为“已完成（第三批 Review 通过 `49edb7e`，非 AC 最终验收）”。A 亲跑（引自原件 §1，本记账未跑测试）：全量 `test:unit` 31 files / **951** / 0；19 条任务命令用例数与上表逐条相同；v1 三份契约测试 88；real-stubs 23；六守卫、`contract --check` 24 / 10 / 2、typecheck、lint；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` **24** / 0；只读探针 8 例（R3-A～R3-C 依据）。未跑其余 7 份 E2E，无截图。
- **T-A22c**（R3-A 补修，规格 r6.8 `e7716a8`）：

| 任务 / 切片 | 实施 commit | 验证命令输出摘要 | 生产方集成 SHA（旁证） | v2 集成 SHA（④） | 状态 |
|---|---|---|---|---|---|
| T-A22c | `af24c826f41580d27f90ce611fb2f55fec44acbf` | 实施者：修复前命令 1 = 2 fail（红）→ 删两行后 `WI H-2 list status` 2 / 整文件 27 / 工程门 24 / 10 / 2；全量 31 / 953 / 0、六守卫、shell + agent E2E 24（证据见 §12）。**独立 A 增量亲跑同数**（`review-batch3-cache-fix.md` §1，`69faacc`），另 v1 契约 88、real-stubs 23、只读探针 6 例 | 增量 Converge 时 `af24c82`，状态登记时 `69faacc`（只读核） | **未取得** | 已完成（增量 Review 通过 `69faacc`，R3-A 关闭；非 AC 最终验收） |
| H-2·列表 | ① `af24c82`（祖先含已审 `0032fc6`、T-A12 `742d6aa`、T-A01 / A02 / A10） | ③ 实施者与 A 亲跑：`WI H-2 list status` 2、整文件 27（原四组 5 / 4 / 7 / 9）、`-t "WI H-2"` 27 + 工程门；② R9 `ab742f5` | `69faacc`（**旁证，不是 ④**） | **未取得** | **待消费方集成（未交付）**：生产方 ①②③ 齐（3 / 4） |

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
| 2026-10-29 | 集成人 | 提交 r6.8 文档（T-A22c 登记）并同步实施树；排期决定 | `49edb7e` | — | 提交 `e7716a88297ed9f3fe3a642215bd970c3a326a37`。commit body 记录：接受 T-B01 依赖 T-A22c（AC-001-1 / 001-4 的祖先覆盖），属于任务排期，不是新的产品需求或人工门 |
| 2026-10-29 | Implement（新会话，实施树 `feat/workbench-interaction-astra`） | T-A22c | `e7716a8` | `openai/gpt-6-astra`（首选，PI_SESSION_ID `01a1874b-4f8e-73e6-8b86-1adc1f7a9321`，调用正常，未回退） | 提交 `af24c826f41580d27f90ce611fb2f55fec44acbf`（只动两个授权文件）。修复前命令 1 为 2 fail（红），删两行后命令 1 / 2 / 3 依次为 2 / 27 / 工程门通过；末轮全量 31 / 953 / 0、六守卫、shell + agent E2E 24；4173 前后空闲；clean。测试红不是回退理由，未换模型 |
| 2026-10-29 | 集成人 | T-A22c 同步 | `e7716a8` → `af24c82` | — | 只读 `git worktree list` 核：生产方集成树 `integration/workbench-interaction` 与文档树 `docs/workbench-interaction-batch3-converge` 的 HEAD 均为 `af24c82`（旁证；未写 v2 树，④ 缺） |
| 2026-10-29 | 增量 Converge / 进度登记 + 只读 Analyze R15（非实施） | T-A22c 对比、状态回写（21 / 68）、新建 `converge-batch3-cache-fix.md`，并更新本日志 / 交接 / README 本 feature 两行 | 文档树 `docs/workbench-interaction-batch3-converge` @ `af24c82` | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a18755-53bb-72b4-87fa-bcc8b067eba0`；bridge 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置） | 增量已收口，待独立 A 增量 Review；未改代码 / 测试 / spec / plan / checklist / 原 Review / 原 Converge / 根 HANDOFF；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 集成人 | 提交增量 Converge 文档 | `af24c82` | — | 提交 `eb91340096a22f845c8511a370d6100262e939d4`（纯文档，`specs/**` 6 文件） |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-review-batch3-cache-fix`，只读审查） | T-A22c 增量代码 Review（只判 R3-A） | 文档 `eb91340`、代码 diff `e7716a8..af24c82` | `anthropic/claude-fable-5-1`（PI_SESSION_ID `01a1875e-96b8-7724-85fe-089647041c61`；协调器对 `claude-bridge` 的最小真实 probe 为 quota / rate 类，本窗口同通道不重试；未单独探 fable 的 bridge；只换通道、未改配置；与 Implement 异模型、与 Converge 隔离） | **本增量通过**：0 P1 / P2、0 新 P3，**R3-A 关闭**；亲跑 2 / 27 / 原四组 5 / 4 / 7 / 9 / 工程门 24 / 10 / 2、全量 31 / 953 / 0、六守卫、v1 契约 88、real-stubs 23、shell + agent E2E 24、只读探针 6 例；只写审核原件，未改代码 / checklist |
| 2026-10-29 | 集成人 | 原样提交增量审核原件 | `eb91340` | — | 提交 `69faacccabd8b089a9f240b28e6449a8fea90619`；生产方集成树与本文档树同到 `69faacc`，实施树仍 `af24c82`（代码相同）；只读核 v2 消费分支仍 `3f63273`、不含 `af24c82` |
| 2026-10-29 | 计划 / 分析类（第三批 + R3-A 补修安全点状态登记，非 Handoff、非 Gate 2） | T-A22c 记为已完成、页首块、本日志 §1 / §2 / §6 / §7 / §8 / §13、interface-handoff H-2·列表 ①②③、analyze 页首状态链接、README 本 feature 两行；临时 HANDOFF 恢复节草稿（不写根 HANDOFF） | 文档树 `docs/workbench-interaction-batch3-converge` @ `69faacc`（代码 = `af24c82`） | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a1876b-2420-709d-b58f-04d6eed0d36f`；bridge 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置） | 文档完成；未改代码 / 测试 / spec / plan / checklist / 两份 Review / 两份 Converge 原件 / 根 HANDOFF / docs；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 计划 / 分析类（第四批开工前机制精度 r6.9 + 只读 Analyze R16，非实施） | 第四批 T-B01 / B02 / A22d / B04 / B03 派工准备：R2-C 令牌映射归 B01、详情视图缓存接口（拆出 T-A22d）、B03 挂载点与依赖 B04、harness 范围；plan / tasks / analyze / 本日志 §14 / interface-handoff / README 本 feature 行 | 文档树 `docs/workbench-interaction-batch4-plan` @ `6ba2a15`（代码 = `af24c82`） | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a187b5-a3e7-75a6-a499-74d51c9f9bbd`；bridge 本窗口已确认 quota / rate / spend_limit 耗尽，不重试；官方通道最小真实调用 exit 0；未改配置） | 文档完成；待 A Checklist R10 定向复核；未改代码 / 测试 / fixture / spec / checklist / 旧 Review / converge / 根 HANDOFF / docs；未跑产品测试；未 commit（由集成人提交） |
| 2026-10-29 | 集成人 | 提交 r6.9 规格文档 | `6ba2a15` | — | 提交 `94f1f83d6871cdd9ef6ce1e57d13d505992fda70`（Checklist R10 的固定审查对象） |
| 2026-10-29 | 审核员 A（新会话、独立 worktree `D:/2030/Futures-AI-interaction-checklist-batch4`） | Checklist R10：第四批 r6.9 限定范围定向复核 | `94f1f83` | `anthropic/claude-fable-5-1`（PI_SESSION_ID `01a187cd-624c-71de-96e0-1767b222d743`；协调器官方通道最小真实调用 exit 0；bridge 本协调窗口已确认限额，未单独重探；与 Implement 异模型） | **通过**：26 / 26，0 P1 / P2，P3 S-41～S-43；集成人原样提交 `37e2f71aae5a625de7e39a3f4b2d9c0b1a9c7b38`（blob `4537c55…`） |
| 2026-10-29 | Implement（新会话，实施树 `feat/workbench-interaction-astra`） | T-B01 → T-B02 | `37e2f71` | `openai/gpt-6-astra`（首选，PI_SESSION_ID `01a187e0-ceb4-749f-ade2-e87d0badbfce`，调用正常，未回退） | 提交 `5c00cf6` / `0221a94`；命令 2 / 4 / 21 / 48、6 / 工程门通过；失败留痕（新测试 `''` vs undefined、border 简写序列化、单空格标题、2 条 lint）只修新代码 / 新测试；末轮 32 文件 986 / 0、shell + agent E2E 24。测试红不是回退理由 |
| 2026-10-29 | Implement（新会话，实施树） | T-A22d | `0221a94` | `openai/gpt-6-astra`（首选，PI_SESSION_ID `01a187ee-7b5a-77dc-8968-4d9b80dfdc2b`，调用正常，未回退） | 提交 `ca7dca1`；命令 4 / 6 / 6 / 43 + 工程门；open 组首跑 3 / 1 fail（新测试误断空 `artifacts[0]`）→ 修新测试；原 27 例与 `connect` / `changeScenario` hash 核对不变；32 文件 1002 / 0、E2E 24 |
| 2026-10-29 | Implement（新会话，实施树） | T-B04 → T-B03 | `ca7dca1` | `openai/gpt-6-astra`（首选，PI_SESSION_ID `01a187fa-ae0c-731f-a447-eecd5c07b350`，调用正常，未回退） | 提交 `cc6559d` / `6c082fd`；命令 6 / 4 / 9 / 工程门、4 / 1 / 1 + 工程门；失败留痕（离开详情锚重读的新测试期望、2 条 lint、新测试 TS18046 ×2 / TS2339）；`moduleId` 按 R10 已审原文 `job-create`（协调提示 `jobs-create` 为笔误，开码前已声明）；末轮 34 文件 1018 / 0、四份 E2E 29 |
| 2026-10-29 | 集成人 | 第四批 ff-only 集成 | `37e2f71` → `6c082fd` | — | `integration/workbench-interaction` 与本 Converge 文档树 `docs/workbench-interaction-batch4-converge` 均到 `6c082fd`（旁证）；peer / v2 / main 未写，④ 全缺 |
| 2026-10-29 | Converge / 进度登记 + 只读 Analyze R17（非实施） | 第四批 5 项对比、r6.10 精度、状态回写（26 / 69 已实施）、新建 `converge-batch4.md`，并更新本日志 / 交接 / README 本 feature 两行 | 文档树 `docs/workbench-interaction-batch4-converge` @ `6c082fd` | `anthropic/claude-opus-5-5`（PI_SESSION_ID `01a1880c-8385-70eb-96c3-75402937cefb`；bridge 本协调窗口已确认 quota / rate / spend_limit，不重试；官方通道真实调用成功；未改配置） | 本批已收口、待第四批独立代码 Review；不新增任务；feature 未收敛；未改代码 / 测试 / spec / checklist / 旧 Review / 旧 Converge / 根 HANDOFF / docs；未跑产品测试；未 commit（由集成人提交） |

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
| R3-A | jobsStore `applyFilter(f)` 成功分支写 `listStatus='ready'` / `listError=null`：全新 store 先筛选后 `ensureJobs()` 不再加载未筛选列表（探针 P1），base 读错误被筛选成功清除（P2） | 集成人决定**现在修**：T-A22c（r6.8，方案 b，≤ 0.5 h，依赖 T-A22a；T-B01 / T-B02 依赖它）；plan §2.3 / tasks T-A22a 补【r6.8】精度；H-2·列表 ④ 前必须关闭 | **修复任务已登记、待实施；待新会话 A 增量代码 Review 核关闭**；代码未修（r6.8 登记时原文；当前见表下【T-A22c 实施后更新】） |
| R3-B | 对已删除投放重复 `removeUpload`：已归属者每次追加相同 dataset 修订与 `remove_source` 事件，未归属者静默成功；与 confirm / assign 对已删除者拒绝不一致（探针 P4） | T-C03（删除确认的消费方）或 T-A17（只读门统一入口）；A 建议最小修复 + pool spec 一例，plan §2.4 remove 句补“已删除者拒绝” | 未修 |
| R3-C | `clearJobKeys` 的 `removeItem` 抛错时，`resetMockData` 以原始 `DOMException` 拒绝（非契约形态），状态停在 unreadable（探针 P5） | T-G04（横幅 / 重置按钮接入时）；A 建议按 degraded 处理或转 `adapter_error`，plan §3 补一句 | 未修 |

观察（不计入判定，供后续任务阅读）：O-R3-1（`cancelJob` 改写 failed 作业的原失败原因）→ T-A20 / T-B05 接入时核；O-R3-2（筛选失败后 `filter` 与 `filteredJobs` 暂不对应）→ 已随 R3-A 精度写入 plan §2.3【r6.8】；O-R3-3（`readJobFixtures()` 无生产调用方）→ T-G06 收口时决定。

【T-A22c 实施后更新（2026-10-29，`af24c82`；以本段为准，上表 R3-A“代码未修”为 r6.8 登记时原文）】
- **R3-A**：**代码已修、待 A 复核**。T-A22c `af24c82` 按方案 b 只删两行，P1 / P2 两条回归先红后绿；关闭与否只由新会话 A 的增量代码 Review 判定，复核前不放行 H-2 ④。
- **R3-B / R3-C**：未改，未经 Walter 风险接受，归属不变（T-C03 / T-A17、T-G04）。

【T-A22c 增量 Review 后更新（2026-10-29，`review-batch3-cache-fix.md` `69faacc`；以本段为准，上段“代码已修、待 A 复核”为当时原文）】
- **R3-A**：**已关闭**。依据 = 独立 A 增量 Review 原件 §0 / §4 / §6：探针 P1 / P2 在 `af24c82` 上不再复现，`WI H-2 list status` 两例在产品测试中固定，生产改动恰为方案 (b)；O-R3-2（筛选失败后 `filter` 与 `filteredJobs` 暂不对应）按 plan §2.3【r6.8】精度保留，A 探针 P3 印证、不记新发现。
- **R3-B**（→ T-C03 / T-A17）、**R3-C**（→ T-G04）：**仍未修、未经 Walter 风险接受**，不在增量 Review 范围。
- **前两批 P3 当前未关项**（只记事实，不重判）：R-A（`j-conflict` 当前视图规则，T-A16 / T-A19 前定案）；R-B 残留（done 阶段上游 draft 产物，不自动审批）；R-C / R2-A（契约描述中的 mock 语义，T-G06）；R-D ①③④（T-A14 / T-A17 / T-A20 按构造保持）；R-E（T-A17）；R-F（T-A21）；**R2-B** 只有 DataClient 侧初始化顺序已固定，AgentClient 侧归 T-A18；**R2-C**（三徽标统一 ok 边框令牌）须在首个消费徽标的页面任务（T-B01 / T-C04 / T-F01）或 T-G10 M-01 前核对，**T-B01 若下一批起步，即为首个消费点**；**R2-D**（新 main `072bb12` 同步后的路由 / shell E2E 断言迁移）按同步流程处理；R2-E 已登记精度、代码未改。观察 O-R3-1（→ T-A20 / T-B05）、O-R3-3（→ T-G06）不变。

【r6.9 第四批派工准备更新（2026-10-29；以本段为准，上段“R2-C … T-B01 若下一批起步，即为首个消费点”的待定归属已落定）】
- **R2-C**：归 **T-B01**（首个页面消费前修正；T-B01 预计 1.5 → 2 h、新增标准 / 命令 3 `WI badge tone`）。映射见 plan §1【r6.9】：ok / warn / bad 用既有 `--fai-status-*`，中性用 `--fai-glass-module-border`，SourceBadge 中性；`--fai-status-sample` 不用；文字色与契约文案 / 图标不变。**代码未修，待第四批实施**，关闭与否由第四批代码 Review 判定。
- 其余未关项（R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B AgentClient 侧、R2-D、R3-B、R3-C）不在第四批，状态不变，均未经 Walter 风险接受。

【第四批 Converge 更新（2026-10-29，代码 `37e2f71..6c082fd`，待第四批独立代码 Review；以本段为准，上段“R2-C 代码未修，待第四批实施”为当时原文）】
- **R2-C**：T-B01 `5c00cf6` 已按 plan §1【r6.9】表修正三个徽标的边框令牌（ok / warn / bad / 中性逐值核对，SourceBadge 中性、无 `data-status`，无 sample，文字色不变）。**代码已修、待独立 A 代码 Review 确认关闭**；Converge 不判关闭。
- 其余未关项（R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B AgentClient 侧、R2-D、R3-B、R3-C）本批不涉及、状态不变，均未经 Walter 风险接受。观察 O-R3-1（→ T-A20 / T-B05）、O-R3-3（→ T-G06）不变。

**Checklist R10 P3 台账**（审核原文以 `checklist.md` §R10 为准；只登记，**未经 Walter 风险接受**，不新增 AC / 标准 / 命令 / guard）：

| # | 摘要 | 归属 / 时点 | 当前状态 |
|---|---|---|---|
| S-41 | 冻结 spec §2 目标与 R-001 what 列“创建者（人 / 计划）”，46 AC 无一要求展示；T-B04 按已审 r6.9 不显示 createdBy，`JobListItem` 契约不含创建者，目前无任务承接 | **本 feature**：T-B05（作业级状态区）开工前先做最小展示精度轮（Tasks / Plan 写明位置与文案来源，候选 S-11 同机制契约映射；Analyze + A 定向复核）；超 2 h 按 B-12 先例拆分。不改 spec、不写成“v1 不展示”、不移交其他 feature、不回头扩已实施的 B04 | **未关**（归属已登记于 tasks T-B05 状态行） |
| S-42 | harness 优先经 `RouterView` 挂载详情页，避免直接挂载时 `watch` 以 `id=undefined` 调 `openJob` 的伪影 | T-B04 测试写法 | **已落实**：`job-detail.spec` / `job-create.spec` 经 `RouterView`；离开详情只有保留锚的一次 `getJob`，无 undefined 读、无 guard |
| S-43 | plan §2.3“按序完成”只是 mock 口径；真实 `api` 乱序属 `api` feature | plan 措辞 / 跨 feature 登记 | **已登记**：plan §2.3【r6.10】；本 feature 不加 guard（关联 Converge 观察 O-B4-2） |

**第四批 Converge 观察**（`converge-batch4.md` §5；交第四批 Review 判定，不预设严重度，未新增任务）：O-B4-1 应用内导航不带 `route.query`（`agentScript` 每次 send 重读 URL；非 normal 场景点击后 reload 回落 normal）——非 AC-002-2 / AC-008-2 明确违反，T-G01 / T-G05 加阅读提示，若须修按 ≤ 0.5 h 最小方案登记；O-B4-2 离开后迟到的 canonical replace（修需 guard，先报 Walter）；O-B4-3 创建提示初始即渲染；O-B4-4 同作业重开时旧错误短暂可见；O-B4-5 证据粒度；O-B4-6 R2-C 关闭待 A。

【第四批 Review 后更新（2026-10-29，`review-batch4.md` 原件 `9812f64`；以本段为准，上段“交第四批 Review 判定”为当时原文）】
- O-B4-2 → **R4-A（P2）**；O-B4-1 → R4-B；O-B4-3 → R4-C；O-B4-4 → R4-D（均 P3）；S-43 口径后果 → R4-E（P3）；O-B4-5 / O-B4-6 无发现。
- **R2-C**：代码修正经 A 逐值核实无误；原件把关闭条件定为“本批通过 / Gate 2”，本批未通过，**不记关闭**。
- **S-41**（→ T-B05 开工前精度轮）、S-42（已落实）、S-43（已登记，但 A 证实 R4-A 不属乱序口径）。其余未关项（R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B AgentClient 侧、R2-D、R3-B、R3-C）本批不涉及、归属不变。以上**均未经 Walter 风险接受**。

**第四批 Review 台账**（审核原文以 `review-batch4.md` §3 / §5 为准；不改 Review 结论）：

| # | 级别 | 摘要 | 归属 / 时点 | 当前状态 |
|---|---|---|---|---|
| R4-A | **P2** | `JobDetailPage` async watch 在离开 / 换阶段后仍执行迟到的 canonical `router.replace`：导航被劫持、历史被覆盖、用户的阶段选择被静默覆盖（slow 约 3000 ms 窗口确定性复现；请求按序完成） | 修复草案 **T-B04a**（plan §2.1 / §2.3【r6.11 草案】）；新增 guard 须 **Walter AGENTS §5.1 单独批准**；获准后 Implement → Converge → A 新会话增量 Review | **未修；blocked（待 Walter 批准）**；第四批 Review 维持未通过 |
| R4-B | P3 | 应用内四处导航不透传 `route.query`（非 normal 场景点击后 reload 回落；`agentScript` 每次 send 重读 URL） | T-G01 / T-G05 阅读提示（已登记）；壳级透传归 v2 Clarify / candidates | 开放 |
| R4-C | P3 | 创建面板两条 `role="alert"` 在展开时即渲染 | T-G10 M-01 记录 | 开放 |
| R4-D | P3 | 同作业重开时，先显示上一次的 `not_found` 错误（产品内实际不可达） | 下次 plan 精度一句 / T-B05 开工前 | 开放 |
| R4-E | P3 | store 迟到写入导致短暂错位（自愈） | `api` feature（plan §2.3【r6.10】） | 开放 |

【R4-A 关闭后更新（2026-10-29，`review-batch4-r4a.md` 原件 `46e8fbe`；以本段为准，上表 R4-A“未修；blocked”与上段“R2-C 不记关闭”为当时原文）】
- **R4-A**：**已关闭**。T-B04a `ae592ba` 修复；A 增量 Review 0 P1 / P2 / 0 新 P3，真实 Chrome 探针 2a / 2b / 2c / 2d 不再发生（§19）。
- **R2-C**：**技术关闭**（原件 §5 关闭条件“本批通过”已成立；这是批次技术闭合，不是 Gate 2）。
- **R4-B / R4-C / R4-D / R4-E**：仍开放、归属不变。R4-E 在 A 探针 P-2d 中仍可观察到约 17 ms 的 store 错位（自愈），本次**未修**，不写成已修。
- **S-41、R3-B / R3-C、R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B AgentClient 侧、R2-D**：本增量不涉及，归属不变。
- 以上开放项**均未经 Walter 风险接受**；Walter 的批准只覆盖 R4-A 最小修复。

【r6.12 第五批派工准备更新（2026-10-29；以本段为准，只登记落点，代码未改）】
- **R3-B**：落点由“T-C03 或 T-A17 二选一”定为新任务 **T-A13a**（0.5 h：`removeUpload` 对 `removed` 记录返回 validation_error，pool spec 新增 1 组 2 例；plan §2.4【r6.12】）。它是否属既有领域规则、而非 AGENTS §5.1 的新 guard，由 Checklist R11 判定；判为须 §5.1 时 blocked_by Walter。**未修、未经风险接受**。
- 其余未关项（R3-C、R4-B～R4-E、S-41、R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B AgentClient 侧、R2-D）不在第五批，归属不变。

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

## 11. R3-A Converge 补修派工准备（T-A22c，r6.8，2026-10-29；历史：已于 `af24c82` 实施、待 A 增量复核，见 §12；“待实施”为当时原文）

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

## 12. T-A22c 实施证据（2026-10-29；实施者执行，增量 Converge 未重跑；历史：独立 A 增量 Review 已通过 `69faacc`、R3-A 关闭，见 §13；“待独立 A 增量 Review”为当时原文）

- **派工与模型**：
  - 实施者 = `openai/gpt-6-astra`（Implement 首选；新会话 `01a1874b-4f8e-73e6-8b86-1adc1f7a9321`，实施树 `D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra`）；调用正常，未回退。
  - 基线 = `e7716a8`（r6.8 文档，clean；代码 = 已审 `0032fc6`）。派工 prompt 与回报只存协调器独占临时目录（`astra-cache-fix-*`），不入库。
- **提交**：`af24c826f41580d27f90ce611fb2f55fec44acbf`，`fix(jobs): preserve base list read status when filtering (T-A22c)`。
  - `frontend/src/jobs/stores/jobs.ts`：−2，只删 `applyFilter` 成功分支的 `listStatus = 'ready'` / `listError = null`。
  - `frontend/tests/unit/jobs/jobs-store.spec.ts`：+67 / −1。新增 `WI H-2 list status` 两例；`WI H-2 filter` 组一例改为“只有显式 refresh 清错”，未删测试。
- **红 → 绿**（会话日志原文摘要）：
  1. 先写测试，`-t "WI H-2 list status"` → `Tests 2 failed | 25 skipped (27)`，分别为 `expected 'ready' to be 'idle'`、`expected 'ready' to be 'error'`。
  2. 删两行后同一命令 → `2 passed | 25 skipped (27)`。
- **任务命令**（`pnpm -C frontend …`）：
  1. `test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 list status"` → 2 passed；
  2. `test:unit tests/unit/jobs/jobs-store.spec.ts` → 27 passed（原四组 25 + 新 2）；
  3. `typecheck && lint && contract --check` → 通过，`24 methods, 10 events, 2 artifacts match`。
- **回归**：
  - `test:unit` → 31 files / 953 passed / 0 failed；
  - `check` → 六守卫全过；
  - `test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` → 24 passed（1.0 min；4173 前后无 LISTEN，自管服务已退出）；
  - `-t "WI H-2 filter"` → 4 passed。
- **提交纪律**：提交前 `git diff --check`、暂存 `--check`，以及“暂存恰为两个授权文件、无未暂存改动”的脚本检查通过；提交后 clean；Checklist blob `74084c13…` 不变。未 push / PR / merge。
- **增量 Converge**：`converge-batch3-cache-fix.md`（analyze.md「Analyze R15」）。判定：与 r6.8 逐条一致、无规格差距，本任务增量已收口，**待独立 A 增量 Review**；R3-A = 代码已修、待复核。
- **待办**（不在本记账内执行）：
  - 新会话 A（与实施异模型，按 AGENTS §6 审核员候选）固定审 `e7716a8..af24c82` 与本文档提交，只核 R3-A 是否关闭；
  - 通过后 T-A22c 才可记“已完成”，H-2·列表 ① 才由候选转正；
  - ④ 仍只能由 `integration/frontend-workbench-v2` 所有者登记。

## 13. T-A22c 增量 Review 与第三批安全点状态（2026-10-29；批次记账与恢复摘要，不是全 feature Handoff / Gate 2）

- **性质与作者**：Implement / Converge 批次记账，作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1876b-2420-709d-b58f-04d6eed0d36f`；`claude-bridge` 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改 provider / key / 路由 / 全局配置）。派工 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。本节**没有运行任何产品测试**，下列测试数字全部来自实施者与审核员 A 的真实执行。
- **R3-A 处置链**（不是需求变更）：第三批 A 原件 `49edb7e` 判 P3 R3-A（冷 store 先筛选会把 idle 洗成 ready，阻止首次 base 加载；base 读错误被筛选成功清除）→ 集成人决定先修再供 H-2，r6.8 登记 T-A22c + Analyze R14，方案 (b)，规格提交 `e7716a88297ed9f3fe3a642215bd970c3a326a37`（commit body：集成人接受 T-B01 也依赖 T-A22c 以保 AC 矩阵祖先，属任务排期）→ T-A22c 实施 `af24c826f41580d27f90ce611fb2f55fec44acbf`（openai/gpt-6-astra，未回退）→ 增量 Converge / Analyze R15 `eb91340096a22f845c8511a370d6100262e939d4`（T-A22c 本身收口、feature 未收敛、不判 R3-A 关闭）→ 新会话 A 增量 Review 原件 `69faacccabd8b089a9f240b28e6449a8fea90619`：**通过，0 P1 / P2、0 新 P3，明确 R3-A 关闭**。
- **代码事实**（A 原件 §2）：`e7716a8..af24c82` 只有 2 个文件；生产只删 `applyFilter` 成功分支两次赋值；测试新增 2 例顺序用例、旧例按 plan §2.3【r6.8】改精度（断言数增加、不删用例）；无删覆盖、无新状态机 / 请求序号 / 锁 / 新公开成员。先红（2 fail）后绿属实，红的证据来自实施者会话日志。
- **独立 A 亲跑**（`review-batch3-cache-fix.md` §1）：命令 1 `WI H-2 list status` **2**；命令 2 整文件 **27**；原四组 `cache` 5 / `filter` 4 / `createJob refresh` 7 / `agent refresh` 9；typecheck / lint / `contract --check` 24 methods / 10 events / 2 artifacts；全量 `test:unit` **31 files / 953 passed / 0 failed**；六守卫（之后树仍 clean）；v1 三份契约测试 **88**；real-stubs **23**；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` **24 passed**（4173 前后无 LISTEN）。只读探针 6 例：P1 / P2 不再复现，同 tick 并发与 slow 加载中筛选均得到正确终态。**未跑**：其余 7 份 E2E、全量 `pnpm test`；无截图；无最终 AC 验收。
- **进度与结构**（本节状态登记后脚本复算，只读脚本沿用 `cache-fix-plan-struct.py` / `cache-fix-plan-stdcmd.py` / `cache-fix-converge-ready.py`，日志在协调器独占临时目录 `status-structure*.log`、`status-std-cmd-diff.log`，非项目产物）：68 个任务、编号唯一、排序正确；102.5 h（A 29 / 43.5、B 7 / 10.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）；状态 **21 × 已完成、47 × 未开始**；完成标准 / 命令 **227 / 227**，problems = []；依赖无环、全部前向；AC 矩阵 46 行，`PARTIAL-PREREQ NOT ANCESTOR` = []，`BIDIR BAD` = []；逐任务预计 / 标准 / 命令与 §5～§7 全文对比 `69faacc` **NO DIFF**。**46 AC 最终验收 0**；feature **未收敛**。
- **页面现状**：`/jobs` 列表与详情页仍是 T-A22 骨架（不读数据）；jobsStore 只由 `main.ts` 订阅 agent 终态，无页面消费；九个写 API 中只有 `createJob` 经 store 接入，且无 UI 调用方；投放 / 归属 / 删除 / 取消 / 重置均未挂 UI。**不能称作业页面已完成**。
- **H-x**：H-2·列表 ① `af24c82`（生产已核）、② R9 `ab742f5`、③ 实施者与 A 亲跑 → 本方“T-A22c 复核前不放行 ④”的条件已解除；**④ 仍缺 → 待消费方集成（未交付）**，只能由 `integration/frontend-workbench-v2` 所有者真正集成后登记（只读观察该分支仍 `3f63273`、不含 `af24c82`；不凭推测填写）。H-6 仍缺 T-A21；H-5 / 页面切片未做；H-1 / H-2·标签 / H-3 / H-4 历史生产方证据保留、④ 缺。
- **树分工**：实施树 `feat/workbench-interaction-astra` 仍 `af24c82`；生产方集成树 `integration/workbench-interaction` 与本文档树当前 `69faacc`；代码固定 `af24c82`（其后只有文档提交）。集成人提交本状态后再把三树 ff-only 到同一状态 SHA。规格树 `D:/2030/Futures-AI-interaction`（`spec/workbench-interaction`）只定向同步本 feature 文档、README 本 feature 行与 HANDOFF 新恢复节，不铺代码。
- **剩余风险与下一步**：
  - R3-B（→ T-C03 / T-A17）、R3-C（→ T-G04）未修、未经 Walter 风险接受；前两批未关项见 §8【T-A22c 增量 Review 后更新】。
  - 上游 main `072bb12` 不在祖先，继续 pin `90187f7`；同步按 R2-D 流程（tasks §7 重核 → Analyze → A 定向复核 → 指定范围小任务），并与 v2 所有者协调 T-V2-09#4。
  - 下一可起步：T-A14 / T-A15 / T-A16、T-B01（→ T-B02 / T-B04）、T-C01。T-B01 是首个消费徽标的页面，派工前先按 §8 R2-C 确认令牌映射的处理归属（在 T-B01 内核对，或明确留到 T-G10），不新增色值。
  - 正式全 feature Review / Gate 2 / Handoff、PR / merge 仍在后续；本节不替代。

## 14. 第四批派工准备（r6.9，2026-10-29；待 Checklist R10 定向复核，未实施，不预写结果）

- **性质与作者**：开工前机制精度 + 派工准备，作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a187b5-a3e7-75a6-a499-74d51c9f9bbd`）。
  - 通道：`claude-bridge` 已由本协调窗口确认 quota / rate / spend_limit 耗尽，不重试；本批官方通道最小真实调用 exit 0（协调器探活）。只换通道不换模型，未改 provider / key / 路由 / 全局配置。
  - 派工：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。
  - 本节**没有运行任何产品测试**，也没有写代码。
- **基线**：
  - 本规格写入树 `D:/2030/Futures-AI-interaction-plan-batch4` / `docs/workbench-interaction-batch4-plan`，起点 `6ba2a155d85d7495014eb5c2faff36cd542d3288`，clean。
  - 代码与 `af24c826f41580d27f90ce611fb2f55fec44acbf` 相同（`git diff --stat af24c82 HEAD -- frontend` 为空）。
  - upstream 继续 pin `90187f7`，main `072bb12` 不导入（R2-D 流程不变）。
- **范围**：**T-B01 → T-B02 → T-A22d → T-B04 → T-B03**（5 项，约 7.5 h = 2 + 1 + 1 + 2 + 1.5），同一实施树串行。完成标准、AC 引用与命令以 tasks.md 原文为准，本节只摘口径。
  - 四阶段工作区内容仍为 C–F 占位。
  - **不在本批**：T-B05～T-B07、角标 / 收件箱（T-G02）、投放（C 组）、T-A14～T-A21、API 14+、v2 集成、D-020～D-024、壳文件、peer 树。
- **为何是这 5 项、这个顺序**（tasks 页首 r6.9 块；analyze.md「Analyze R16」）：
  1. **R2-C 归 T-B01**：T-B01 是首个消费徽标的页面，令牌修正在页面消费前完成。原 Review 的归属是“首个消费页面或 G10”，因此不另立任务；T-B01 预计 1.5 → 2 h，新增标准 / 命令 3。
  2. **T-A22d 自 T-B04 拆出**：原 T-B04 已到 2 h，又要承担详情视图缓存的确定字段与 store 单测，已知超额。按 Checklist R8 B-12 先例在 Tasks 阶段拆分；T-A22d 1 h，在 A 组 store 任务序列内，依赖全部前向。
  3. **T-B03 依赖 T-B04**：B03 端到端必须核对详情页回显（不删这项覆盖），故执行顺序为 B04 先于 B03。这是 tasks §6 编号前向规则的唯一有意回边，真实拓扑无环。
- **写权限 / 文件所有权**（逐任务；tasks §1-5 之内；同一树串行，后序任务可在前序文件上继续改）：

  | 任务 | 允许新建 / 修改 | 只许新增、不改既有用例 |
  |---|---|---|
  | T-B01 | `jobs/pages/JobListPage.vue`、新建 `jobs/components/JobCard.vue`；`jobs/components/{JobStatusBadge,ArtifactStatusBadge,SourceBadge}.vue`（只改 R2-C：根 `data-status` + 边框令牌）；新建 `tests/component/jobs/job-list.spec.ts` | `tests/component/jobs/badges.spec.ts`：只新增 `WI badge tone` 组 |
  | T-B02 | `jobs/pages/JobListPage.vue`（筛选条） | `job-list.spec.ts`：新增 `WI AC-001-2` 组 |
  | T-A22d | `jobs/stores/jobs.ts`（详情视图缓存与 `refresh` 扩展） | `tests/unit/jobs/jobs-store.spec.ts`：只新增 `WI detail cache open / states / refresh` 三组，原 27 例与 `connect` / `changeScenario` 不改 |
  | T-B04 | `jobs/pages/JobDetailPage.vue`；新建 `jobs/components/{StageRail,StageWorkspace}.vue`；新建 `tests/component/jobs/job-detail.spec.ts`、`e2e/jobs/detail-stage.spec.ts` | — |
  | T-B03 | 新建 `jobs/pages/JobCreatePanel.vue`；`jobs/pages/JobListPage.vue`（“新建作业”按钮与内联面板挂载）；新建 `tests/component/jobs/job-create.spec.ts`、`e2e/jobs/list-create.spec.ts` | — |

  - **一律不改**：`shared/**`、`app/**`、`workbench/**`、`agent/**`、`main.ts`、`routes.ts`、`session.ts`、`persistence.ts`、`contracts/**` 与生成物、fixture、`scripts/**`、`package.json` / 锁 / `vite` / `vitest` / `playwright` 配置、v1 测试、`routes.spec.ts` / `session-context.spec.ts` 等既有 jobs 测试（上表“只许新增”的两份除外）、`backend/`、`docs/`、spec / checklist / 审核原件 / converge 原件 / 根 HANDOFF。
  - 不写 v2 任何树或 peer 树。
  - T-B04 不改 `stores/jobs.ts`（由 T-A22d 完成）。
- **口径摘要**（原文见 plan §1 / §2.1 / §2.3【r6.9】与 tasks 五个任务的【r6.9 精度】）：
  1. **R2-C**：
     - ok = `--fai-status-ok`（蓝色，非绿色）：作业 collecting / processing / analyzing / delivering / delivered；产物 confirmed；上传 ingested。
     - warn = `--fai-status-warn`：needs_human、provisional、pending_validation。
     - bad = `--fai-status-bad`：failed、conflict、quarantined。
     - 中性 = `--fai-glass-module-border`（基础规则）：draft、cancelled，以及 SourceBadge 全部。
     - `--fai-status-sample` 不用；文字色不变、红只作边；不新增色值 / 令牌 / schema / 枚举 / TS 映射 / helper。
     - 测试沿用 `modules.spec.ts` 的 `styleRule` 先例（`?raw` + `CSSStyleSheet`），解析真实 SFC 样式。
  2. **列表页**：三态由 `listStatus` 驱动，复用 `Loading` / `EmptyState` / `ErrorState`（`moduleId='jobs-list'`，重试 = `refresh()`）。JobCard 标题链接 `job-detail`（不带 stage），`<time datetime>` 原样显示；不渲染角标。
  3. **筛选**：任一控件变化组装一次 filter（title 非空原样、不 trim），全空则 `applyFilter(null)`；清空不发请求；展示 `filteredJobs ?? jobs`；空结果单独文案。R3-A 已关口径不变：筛选成功不清除共享读错误。
  4. **详情视图缓存（T-A22d）**：
     - 成员：只读 `currentJob` / `currentStageWorkspace` / `detailStatus` / `detailError`，以及 `openJob(jobId, stage | null): Promise<Stage | null>`；私有锚；不新增 `closeJob`。
     - 读取：`openJob` 只在换作业时置 loading；job 为 null 时不读工作区；失败保留缓存、置 error、resolve null。
     - 刷新：`refresh()` 在列表块之后，以独立 try 按锚重读详情，不置 loading，与 `listStatus` / `listError` 互不改写。离开详情不清锚。
     - 不加请求序号 / 锁 / guard / 轮询 / 总线 / setter / fallback。
  5. **详情页（T-B04）**：
     - 入口：`watch([id, stage], immediate)`。合法 stage → `openJob`；缺省 / 未知 → `openJob(id, null)` 后 `router.replace` 一次（之后多读一次可接受）。
     - 三态由 `detailStatus` 驱动（`moduleId='job-detail'`，not_found 无重试），与列表状态无关。
     - StageRail：业务 currentStage = `aria-current="step"` + 既有令牌边线；查看 = `aria-pressed`；点击只 `router.replace`。
     - 详情头：标题 / 类型 / 状态徽 / subject / goal；不显示 createdBy；StageWorkspace 为占位。
  6. **新建（T-B03）**：在 JobListPage 挂按钮 + 内联面板（无 dialog / 遮罩 / fixed / inert / 焦点锁）。
     - 表单：subject 空白 → `null`、goal 可 `''`，type 无默认。
     - 提交：经 `createJob`（内部一次 refresh）后 `router.push` 到 `/jobs/:id/collect`；失败显示 `ErrorState`（`moduleId='job-create'`，重试 = 同一输入再提交），表单保留、不导航。
     - 端到端只读 `fai.jobs.v1`，核对详情页回显。
- **验证命令**（17 条，均带 jobs 路径与 `WI` 标题；以 tasks 原文为准）：
  - **T-B01**（4）：
    1. `test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-1"`
    2. `… -t "WI AC-001-4 list"`
    3. `test:unit tests/component/jobs/badges.spec.ts -t "WI badge tone" && check --only colors && check --only glass`
    4. `test:unit tests/component/jobs/badges.spec.ts && typecheck && lint`
  - **T-B02**（2）：
    1. `test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-2"`
    2. `typecheck && lint`
  - **T-A22d**（4）：
    1. `test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI detail cache open"`
    2. `… -t "WI detail cache states"`
    3. `… -t "WI detail cache refresh"`
    4. `test:unit tests/unit/jobs/jobs-store.spec.ts && typecheck && lint`
  - **T-B04**（4）：
    1. `test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-1"`
    2. `test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-2"`
    3. `test:unit tests/component/jobs/job-list.spec.ts tests/component/jobs/job-detail.spec.ts -t "WI AC-001-4"`
    4. `typecheck && lint`
  - **T-B03**（3）：
    1. `test:unit tests/component/jobs/job-create.spec.ts -t "WI AC-001-3 validation"`
    2. `test:e2e e2e/jobs/list-create.spec.ts -g "WI AC-001-3"`
    3. `test:unit tests/component/jobs/job-create.spec.ts -t "WI non-modal" && typecheck && lint`
  - **建议回归**（非新增标准）：每任务提交前 `git diff --check`。批末跑：
    - 全量 `pnpm -C frontend test:unit`、`pnpm -C frontend check`；
    - `test:unit tests/unit/jobs/routes.spec.ts tests/unit/jobs/session-context.spec.ts`（页面开始导入 store 后应仍为 9 + 8，不改断言）；
    - `test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2"`（H-2 定向集合仍 27）；
    - `test:unit tests/component/jobs/badges.spec.ts -t "WI status badges"`（H-2·标签仍 18）；
    - `test:e2e e2e/shell.spec.ts e2e/agent.spec.ts`（既有 24）。
  - 完整命令前缀为 `pnpm -C frontend`。
- **AC 落点**：
  - **最终**：AC-001-1（B01）、AC-001-2（B02）、AC-001-3（B03）、AC-001-4（B04，与 B01 列表侧合跑）、AC-002-1（B04）、AC-002-2（B04；v2 后由 H04 回归）。
  - **部分前置**：AC-001-5（B01 R2-C，人工 M-01 仍归 T-G10）、AC-007-3（B03 非模态，最终 T-G03）、AC-001-3（B04 详情头回显）、AC-001-4 / AC-002-1 / AC-002-2（A22d）、AC-009-1（各工程门）。
  - 本批完成**不等于**这些 AC 已最终验收：最终验收仍须本批 Converge → 独立 A 代码 Review → 全 feature Review / Gate 2。
- **DAG**：A22d ← {A10, A22a, A22c}（已完成）；B01 ← {A10, A22, A22a, A22c, A23}（已完成）；B02 ← {B01, A22c}；B04 ← {B01, A22d}；B03 ← {B01, A12, B04}。环检测为无环；编号前向检查只报一条有意回边 B03 → B04。本批启动时依赖已满足的任务：T-A22d、T-B01（另有 T-A14 / T-A15 / T-A16 / T-C01，不在本批）。
- **结构**（`prepare-struct.py` 复算；日志在本批协调器 Temp `prepare-structure*.log`，非项目产物）：69 个任务 / 104 h；232 / 232；21 已完成 / 48 未开始；46 行矩阵祖先与双向一致；逐任务预计 / 标准 / 命令与 HEAD 的差异只在 A22d / B01 / B02 / B03 / B04 与 §5 / §6。
- **模型**：Implement 首选 `openai/gpt-6-astra`（新会话、实施树），回退 `deepseek/deepseek-flash`；只有调用失败才回退（AGENTS §6）。
- **开码前置（硬）**：独立 A 新会话（与实施异模型；首选 claude-fable-5-1，Claude 通道规则按 AGENTS §6）对本 r6.9 文档做 **Checklist R10 定向复核**。
  - 复核范围：R2-C 映射与测试、详情缓存接口、离开 / 刷新口径、T-B03 → T-B04 回边、T-A22d 拆分与工时、写权限、命令 1:1、AC 祖先。
  - R10 通过并由集成人提交后，才可派 Astra。**当前未审核，不得开码。**
  - 本作者不改 checklist、不勾选；R9 `ab742f5`（blob `74084c13…`）仍为最近有效轮次。
- **回报要求**：同 §4（固定 commit、逐命令输出摘要、失败原文脱敏摘要）。以下情况先停下回报，不在实施中偷换：
  - 任一任务实际超过 2 h（T-B01 / T-B04 已到上限）；
  - `routes.spec.ts` / `session-context.spec.ts` 因页面导入 store 而失败；
  - 需要改上表以外的文件；
  - 发现与 plan / tasks 精度不符。
- **H-x 影响**：
  - **页面切片**：本批完成后，B01 / B02 / B04 具备；仍缺 C 组，未交付。
  - **H-2·标签**：交接接口（props、文案、图标）不变；B01 只改 `JobStatusBadge` 的边框令牌与根 `data-status`。是否以 B01 提交更新 ①（须复跑 `WI status badges` 18）由集成人决定。④ 仍缺。
  - **H-2·列表**：对外成员不变（详情缓存是内部成员）；`-t "WI H-2"` 集合不扩大。
  - 本节不宣称任何切片已交付。
- **剩余风险**：
  - 离开详情后 `refresh()` 仍重读最近打开的详情（额外读）。若 `resetMockData` 后锚指向已不存在的会话新建作业，详情会置 not_found，但列表页不可见，再次打开即换锚。这是 T-G04 接入重置时的已知口径，不加 guard。
  - 缺省 stage 路径会多读一次。
  - R3-B / R3-C 与前两批未关 P3 不在本批（§8）。

## 15. 第四批实施证据与 Converge（2026-10-29；实施者执行，Converge 未重跑；待第四批独立代码 Review）

- **性质与作者**：Converge / 进度登记，作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1880c-8385-70eb-96c3-75402937cefb`；bridge 本协调窗口已确认限额，不重试；官方通道成功；未改 provider / key / 路由 / 全局配置）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。本节**没有运行任何产品测试**，数字全部来自实施者原始日志：`C:/Users/iswal/AppData/Local/Temp/astra-list-01a187e0/`（B01 / B02 详版，实施者独占，不清理）、协调器 Temp `wi-batch4-01a18388-nzh9q1wh/astra-detail-cache-*`（A22d）与 `astra-detail-create-logs/`（B04 / B03）。
- **前置**：Checklist R10 `37e2f71`（blob `4537c55…`）实施前后均经实施者核对未改、26 勾 / 0 未勾。
- **固定提交与范围**（每个任务提交前 `git diff --check` 与精确文件白名单核对通过；文件清单见 `converge-batch4.md` §1）：

  | 任务 | commit | 文件 | 任务命令（实施者执行） |
  |---|---|---|---|
  | T-B01 | `5c00cf695235155c4cfa9efb9df1fee06a161189` | 7 | `WI AC-001-1` 2；`WI AC-001-4 list` 4；`WI badge tone` 21 + colors + glass；badges 整文件 48 + typecheck + lint |
  | T-B02 | `0221a94bbd9aefe4b7d482f61e3e9017d0a25710` | 2 | `WI AC-001-2` 6；typecheck + lint |
  | T-A22d | `ca7dca175150652b1026a831f1447fb6830028e4` | 2 | `WI detail cache open` 4；`states` 6；`refresh` 6；整文件 43 + typecheck + lint |
  | T-B04 | `cc6559d7bb0b5afb0e233b8295dbd55f1de41d9d` | 5 | `WI AC-002-1` 6；e2e `WI AC-002-2` 4；`WI AC-001-4`（两文件）9；typecheck + lint |
  | T-B03 | `6c082fd60570a329771727be16b494f81775f957` | 4 | `WI AC-001-3 validation` 4；e2e `WI AC-001-3` 1；`WI non-modal` 1 + typecheck + lint |

- **回归**：B02 后全量 unit 32 文件 986 / 0、routes + session 17、H-2 27、原徽标 18 + 9、shell + agent E2E 24；A22d 后 32 / 1002、job-list 12、badges 48；末轮 `6c082fd` clean：**34 文件 1018 / 0**、`check` 六守卫（tokens 156 / 5，colors 24 / 24 正样本、0 负命中）、`contract --check` 24 / 10 / 2、typecheck / lint、routes + session 17、H-2 27、store 43、badges 48、job-list 12、detail 11、**四份 E2E 29**；4173 每次前后空闲。**未跑**：其余 7 份 E2E、全量 `pnpm test`、人工截图。
- **失败留痕**（两组：B01 / B02 会话与 B04 / B03 会话；另 A22d 一处；全部是新测试 / 新模板问题，原测试未改，不放宽覆盖，不是调用失败）：见 tasks 五个任务状态行与 `converge-batch4.md` §2。
- **Converge 判定**：5 / 5 完成标准有代码证据，17 条命令标题存在且通过；**本批已收口、待第四批独立代码 Review**；无对冻结 AC 的明确违反，不新增任务；精度 r6.10（tasks 五任务修改范围末、plan §2.1 / §2.3）。观察 O-B4-1～6 交 A（§8 末）。
- **进度与结构**（Converge 后脚本复算，只读脚本与日志在协调器 Temp `converge-*`，非项目产物）：69 个任务、104 h（A 30 / 44.5、B 7 / 11、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）；状态 21 已完成 + 5 已实施 + 43 未开始；232 / 232；真实依赖图无环，编号前向唯一回边 T-B03 → T-B04（Checklist R10 已认可）；AC 矩阵 46 行，部分前置均为最终任务祖先、双向一致；逐任务预计 / 标准 / 命令与 §5～§7 相对 `6c082fd` 无差异（见 analyze.md「Analyze R17」）。
- **页面现状**：列表 / 筛选 / 新建 / 详情头 / 阶段轨道 / URL 阶段已是功能页；四阶段工作区仍为 C–F 占位；业务处理、投放、取消、重跑、角标 / 收件箱、创建者展示未做，**不得计为完成**。
- **H-x**：H-2·标签 ① 候选 `5c00cf6`（待 Review，`ebce4c8` 并存）、② R10、③ 实施者 18 / 9 + tone 21、④ 缺；H-2·列表 ① 仍 `af24c82`（详情缓存为内部成员）；页面切片缺 C 组，未交付；H-1 / H-3 / H-4 历史证据保留；H-5 未做；H-6 缺 T-A21。生产方集成树 `6c082fd` 不是 ④。
- **下一步**：集成人提交本文档 → 独立 A 第四批代码 Review（输入与重点见 `converge-batch4.md` §9）→ Review 后按结论记账（R2-C 是否关闭、O-B4-1～6 处置、H-2·标签 ① 是否转生产已核）。依赖已满足、未开始：T-A14 / T-A15 / T-A16 / T-C01。T-B05 开工前先做 S-41 精度轮。main `072bb12` 不导入（R2-D 流程不变）。

## 16. 第四批 Review 未通过与 R4-A 工程审批等待（2026-10-29；批次安全点，§5.1 审批硬边界，不是全 feature Gate 2 / Handoff）

- **性质与作者**：本节是状态登记与 Converge 补修草案，作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18834-f443-750c-ae53-bba830191e22`；bridge 本协调窗口已确认限额，不重试；官方通道成功；未改 provider / key / 路由 / 全局配置）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。本节**没有运行任何产品测试**，也没有写代码；数字来自 A 原件与实施者日志。
- **第四批实施事实**（与 §15 相同，此处只汇总）：

  | 任务 | commit | Astra 会话（openai/gpt-6-astra，首选、调用正常、未回退） |
  |---|---|---|
  | T-B01 | `5c00cf695235155c4cfa9efb9df1fee06a161189` | `01a187e0…` |
  | T-B02 | `0221a94bbd9aefe4b7d482f61e3e9017d0a25710` | `01a187e0…` |
  | T-A22d | `ca7dca175150652b1026a831f1447fb6830028e4` | `01a187ee…` |
  | T-B04 | `cc6559d7bb0b5afb0e233b8295dbd55f1de41d9d` | `01a187fa…` |
  | T-B03 | `6c082fd60570a329771727be16b494f81775f957` | `01a187fa…` |

  - **失败留痕**：全部是新测试 / 新模板的问题，原测试未改，也不是调用失败。
    - B01：缺省 stage 的断言写成 `''`，实际为 undefined；happy-dom 把 `border` 简写序列化。
    - B02：误以为单空格标题无匹配；2 条 lint 换行。
    - A22d：对未开始阶段的空 `artifacts[0]` 误断只读。
    - B04：新断言期待离开后不再 `getJob`，与设计的锚重读不符，改期望、未加 guard；2 条 lint 换行。
    - B03：TS18046 ×2 / TS2339。
  - **代码固定** `6c082fd`；`6c082fd..9812f64` 只有文档提交（Converge `adede0c`、Review 原件 `9812f64`）。
- **第四批代码 Review**（`review-batch4.md`，集成人原样提交于 `9812f64666f8c1f1d8283bf4d7ebd9ae94b4e018`，只引用、不改写）：
  - **审核员**：A = claude-fable-5-1 via anthropic，PI_SESSION_ID `01a1881e-0d52-740b-8dea-83fca258f12f`，新会话、独立 worktree `-review-batch4`；与 Implement（openai/gpt-6-astra）异模型，与 Converge（claude-opus-5-5）隔离。
  - **固定输入**：`adede0c` + 代码 `37e2f71..6c082fd -- frontend`。
  - **结论（固定不改）**：**未通过：1 P2（R4-A）+ 4 P3（R4-B～R4-E），0 P1**。A 同时判 5 项任务的完成标准在代码层都满足。
  - **A 亲跑**（全部通过，但不改变判定）：

    | 项 | 结果 |
    |---|---|
    | 安装与工程门 | `pnpm install --frozen-lockfile --offline` exit 0；typecheck / lint exit 0 |
    | `check` 六守卫 | tokens 156 / 5；contract 24 / 10 / 2；colors 24 / 24 正样本、0 负命中；glass / updown / grid / network passed；之后树仍 clean |
    | `contract --check` | 24 methods / 10 events / 2 artifacts |
    | 全量单测 | **34 files / 1018 passed / 0 failed** |
    | 定向回归 | v1 三份契约 88；real-stubs 23；routes + session 17；`WI H-2` 27（16 skipped）；`WI labels` 10 |
    | T-B01 命令 | 2 / 4 / 21 + colors + glass / 48（`WI status badges` 18、`WI source badge` 9） |
    | T-B02 命令 | 6；job-list 12 |
    | T-A22d 命令 | 4 / 6 / 6 / 43 |
    | T-B04 命令 | 6 / e2e 4 / 9；job-detail 11 |
    | T-B03 命令 | 4 / e2e 1 / 1 |
    | 四份 E2E | shell + agent + detail-stage + list-create **29 / 0**（1.1 min，4 workers，4173 前后无 LISTEN） |

    17 条任务命令的用例数与实施者逐条相同。**未跑**：其余 7 份 E2E、全量 `pnpm test`、人工截图。
  - **只读浏览器探针**：A 在 Temp `review-probe/` 跑了 9 个只读探针（Chrome，slow / job-running / normal；不是产品测试），复现了 O-B4-1 / O-B4-2 / O-B4-4。
  - **R4-A（P2）**：
    - **触发窗口**：无 stage 入口 = `getJob` + `getStageWorkspace` 两次读，各 1500 ms，共 **3000 ms**。
    - **复现**（真实 Chrome，`?scenario=slow`）：
      - 2a：点卡片后 +30 ms 点侧栏“价格”→ +3000 ms 被拉回 `/jobs/j-process/process`，`/prices` 的历史记录被覆盖（history.length 4）。
      - 2b：Back 回列表 → +3000 ms 变 `/process`，列表那条历史被覆盖，再 Back → `about:blank`。
      - 2c：同作业已缓存，点“交付”→ +3000 ms 被改回 `/process`、`aria-pressed` 回到“处理”，之后不自愈。
      - 2d：换作业后先被拉到被遗弃作业，约 50 ms 后再被改回；这是偶然自愈，不是机制保证。
    - **定性**：请求按序完成，**不是**乱序 / 后发先至，也**不是** harness 伪影。
    - **概率**：normal 不可达；slow 确定性复现；接真实 `api` 后，JobCard 默认的无 stage 链接每次都会打开这个窗口。
    - **代码量**：A 估算约 3 行（`onCleanup` 失效标志）+ 1 例组件回归。
  - **4 项 P3** 见 §8【第四批 Review 后更新】。**R2-C** 的代码修正经 A 逐值核实无误，但原件把关闭条件定为“本批通过”，**当前不记关闭**。
- **工程审批边界**：
  - 协调器已在本轮 commentary 向 Walter 报告 R4-A、触发概率、约 3～5 行的 `watch` `onCleanup` 失效标志与最小回归方案。**Walter 尚未回复这项专门审批。**
  - Walter 的通用代码授权（“允许”）仍然有效，但不覆盖 plan 明确不做的新生命周期 guard（plan §2.1【r6.9】、§2.3【r6.10】）。
  - 因此本轮**不派 Astra、不写 guard 代码**，只登记草案与 blocked 状态；把情况报告给集成人不等于 Walter 同意。
- **流程纠偏**：
  - A 原件中“Gate 2 待 Walter”“选 (b) 风险接受可改判通过”属于流程建议文字，不创设批次 Gate 2，也不抹掉 P2。原件不改，当前状态以 AGENTS 为准：这是 §5.1 工程变更审批；全 feature Gate 2 仍在后续。
  - 在 P2 修复并经新 A 技术复核之前，Review 维持未通过。
  - 集成人建议**只批准最小修复**，不请求以风险接受把 P2 当 P3 过关。
  - 不因 Review 结论红而回退模型，也不重新找 A 求通过。
- **补修草案**：
  - **tasks T-B04a**（0.5 h，依赖 T-B04 / T-B03 的已实施代码，blocked_by Walter §5.1 批准，排在 B04 后、B05 前）+ **plan §2.1 / §2.3【r6.11 草案，待批，不生效】**。
  - **改法**：只在 `JobDetailPage.vue` 的 `watch` 回调中使用第三参数 `onCleanup`：同一次回调内 `let stale = false`，`onCleanup` 里置 true，只在 canonical `router.replace` 前检查 `!stale`，约 3～5 行。
  - **测试**：`job-detail.spec.ts` 只新增 `WI R4-A` 2 例（slow 离开；同作业读期间选“交付”）；`detail-stage.spec.ts` 只新增 1 例 `WI R4-A`（真实 slow，SPA 离开后不被拉回）。原 11 例组件测试与原 4 例 E2E 不改；回归跑四份 E2E 与全量单测。
  - **不做**：不改 store、不取消请求、不加序号 / 锁、不清锚、不给导航加 query，也不做 R4-E 的全局防乱序。API / 输入 / 私有存储无变化。
  - **获准后**：Implement → Converge → **A 新会话增量 Review**，通过后才关闭 R4-A、判本批通过。
  - 开码前是否另做 A 设计定向复核（Checklist R10.1），按 A 原件 §3 (a) 的路径登记：该路径是 Implement 后的定向复核，原件未要求开码前另开一轮；由 Walter / 集成人在批准时一并决定，本轮不调用（analyze.md「Analyze R18」§5）。
- **进度与结构**（本节状态登记后脚本复算；只读脚本 `status-blocked-struct.py` 与日志在协调器 Temp，不是项目产物）：
  - 70 个任务、104.5 h（A 30 / 44.5、B 8 / 11.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）。
  - 状态 **21 已完成 + 5 已实施（第四批 Review 未通过）+ 44 未开始**（其中 T-B04a 待工程批准，其余 43 项）。
  - 235 / 235；真实依赖图无环，唯一编号回边 T-B03 → T-B04。
  - AC 矩阵 46 行双向一致、部分前置均为祖先；AC-002-2 最终 = T-B04 + T-B04a（v2 后 T-H04 回归）；T-G09 依赖 T-B04a。
  - 逐任务对比 `9812f64`：只多出 T-B04a，T-G09 只多一个依赖；原 5 项的标准 / 命令 / 工时未削。
  - 46 AC 最终验收 **0**；feature **未收敛**。
- **页面现状**：列表 / 筛选 / 新建 / 详情头 / 阶段轨道 / URL 阶段的代码已在，但本批 Review **未通过**（R4-A 的导航劫持未修）。四阶段工作区仍为 C–F 占位，不得计为完成，也不算交付。
- **H-x**：
  - **H-2·标签**：① 候选 `5c00cf6`（`ebce4c8` 已审历史并存），因本批未通过**不转生产已核**；② R10 `37e2f71`；③ A 亲跑 48 / 18 / 9 / 21；④ 仍缺。
  - **H-2·列表**：① 仍 `af24c82`（详情缓存是内部成员）。
  - **页面切片**：本批未通过，C 组未做 → **未交付**。
  - 其他切片的历史登记不变。生产方集成树里有候选代码，但没有 push / PR / main，**不能称已交付**。
- **树分工**：
  - 实施树 `feat/workbench-interaction-astra` @ `6c082fd`；生产方集成树 `integration/workbench-interaction` 与本文档树 @ `9812f64`。本状态提交后，由集成人把需要的树 ff-only 到状态 SHA。
  - 规格树 `D:/2030/Futures-AI-interaction`（`spec/workbench-interaction` @ `ec80388`）仍只同步文档、不铺代码。
  - main `072bb12` 不在祖先、不导入，继续 pin `90187f7`（R2-D 流程不变）。
  - 未 push、未开 PR、未 merge。
- **下一步**：先等 Walter 对 R4-A 最小修复的单独批复。批准范围以 plan §2.1【r6.11 草案】与 T-B04a 为限，不扩到 store / query / 全局防乱序。在此之前不派代码、不写 v2 / main。其余未关项按 §8 原归属处理。

## 17. R4-A 最小修复获 Walter §5.1 批准，T-B04a 可开码（2026-10-29；只登记，未实施、无产品验证）

- **作者**：claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188da-1d90-7009-9405-316722985a4e`；bridge 本窗口额度耗尽、无重置证据，不重试；官方通道近期成功；未改配置）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。
- **用户批复**（原话）：“**那就先修P2等全部工作完成后，再合入main**”。集成人在报告 R4-A、`onCleanup` 约 3～5 行最小方案与归档选项之后收到。判定 = R4-A 最小修复的 §5.1 单独批准 + 选定 feature 全部完成后再合 main；**不是**风险接受、**不是**提前 Gate 2，不批准扩到 store 取消 / 锁 / 请求序号 / query，也不是立即删除现有 25 个目录（保留；复用现有 worktree，phase 结束后按后续指令清理）。
- **范围**（= plan §2.1【r6.11】，已生效）：只改 `JobDetailPage.vue` 的 `watch` 回调（`onCleanup` / `stale` / `!stale` 条件）+ `job-detail.spec.ts` 新增 2 例 + `detail-stage.spec.ts` 新增 1 例；原 11 / 4 例不改；其他源码、store、query 禁止。T-B04a 标准 / 命令 / 依赖 / 工时与 70 任务 / 235 对不变。
- **流程**：不另开 Checklist R10.1（理由见 analyze.md「Analyze R19」§3），R10 `37e2f71` 保持 26 / 26 只读。下一步：Implement（新会话，首选 openai/gpt-6-astra，复用现有实施 worktree `feat/workbench-interaction-astra` @ `6c082fd`）→ Converge → A 新会话增量代码 Review。发现草案外的真实设计问题即停报。
- **待测试**：T-B04a 三条命令（`WI R4-A` 组件 2 例 + 整文件 13；`WI R4-A` E2E 1 例 + 四份 E2E 30；全量单测 1020 + typecheck / lint + `git diff --stat 6c082fd HEAD -- frontend` 只含三文件）均**未运行**；本节只登记，没有任何产品验证。
- **状态**：21 已完成 + 5 已实施（第四批 Review 未通过，不计完成）+ 44 未开始；R4-A 未关闭；R2-C 待本批通过；其余 P3 未经风险接受；46 AC 最终验收 0；feature 未收敛。
- **远端上下文**（只记录，本轮不操作远端 / Root）：用户上轮备份已 push 3 个分支；Draft PR https://github.com/iswalterwu/Futures-AI/pull/12（head = integration @ `e285ad2`；isDraft = true，automerge = null，DIRTY）。Root 规格树 spec @ `4f11611766a12092758145910042a08fb5f9a524` 有 HANDOFF §15 备份记录；本树没有 §15，不从别树整体 merge。PR 继续 Draft，不合 main、不强推，不写 v2 树；main pin `90187f7` 与 R2-D 同步流程不变。功能尚未完成；Root 文档定向同步 / 恢复 §16 由集成人后续处理。

## 18. T-B04a 已实施（R4-A 最小修复）与增量 Converge（2026-10-29；实施者执行，Converge 未重跑；待 A 新会话增量 Review）

- **作者**：claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188e8-c8fd-7213-8e90-b721dc6bf792`）。bridge 当前额度窗口已明确耗尽，不重试；同模型官方通道成功；未改配置。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。本轮复用现有文档树 `D:/2030/Futures-AI-interaction-converge-batch4`（起点 `ae592ba`、clean），没有新建工作树。
- **授权**：`80a1892`（§17）。Walter 原话“那就先修P2等全部工作完成后，再合入main”= R4-A 最小修复的 §5.1 单独批准。它不是风险接受，不是提前 Gate 2，也不删目录。实施严格在这一授权内。
- **代码**：
  - commit `ae592ba23b086dd5887a269e842f80c96ad16fb2`，`fix(jobs): skip stale detail canonical navigation (R4-A)`，父 `80a1892`。
  - 实施者 = openai/gpt-6-astra，新会话 `01a188e0-48c1-71df-a0b9-6c87a5b4c916`；会话日志只有这一个模型、无 error 停止，未回退。
  - 实施树 `feat/workbench-interaction-astra`；集成人 ff-only 后，`integration/workbench-interaction` 和本文档树都在 `ae592ba`（旁证，不是 ④）。
- **diff**（`80a1892..ae592ba -- frontend`，全仓也只有这些）：3 个文件，+72 / −2。
  - `src/jobs/pages/JobDetailPage.vue`：diff 共 6 行。回调签名加 `_old, onCleanup`；`await` 前新增 `let stale = false` 和 `onCleanup(() => { stale = true })`；canonical replace 条件前加 `!stale`。其他字节不变。
  - `tests/component/jobs/job-detail.spec.ts`：+54，只追加 describe `WI R4-A` 2 例。原 12048 字节是逐字节前缀，SHA256 `74d3fe502e9a49304faf864888263483a3a79c11778aef1f30703ceaeff20c4d`；新文件 blob `3d5d242`。
  - `e2e/jobs/detail-stage.spec.ts`：+14，只追加 1 例。原 2266 字节是逐字节前缀，SHA256 `1a3d5f4d7cb2a2ceb7f2622138bc077136a7beede382af6e7e4df6cdf76fe4d4`；新文件 blob `031634c`。
  - 两份前缀已由本会话用 `git show` + `cmp` 复核。store / routes / session / query / 契约 / 配置 零差异。
- **红 → 绿**（实施者执行；日志在协调器 Temp `wi-r4a-fix-01a18388-bdy5e3x0/astra-*`）：
  - 旧生产代码 + 新测试：组件 `WI R4-A` **2 failed**，第 245 行 `/jobs/j-process/process` ≠ `/prices`，第 276 行 `/jobs/j-process/process` ≠ `/jobs/j-process/deliver`；Chrome `WI R4-A` **1 failed**，第 51 行收到 `/jobs/j-process/process`。三条都是真实缺陷复现。
  - 生产修复后，同一批测试期望不变，全部变绿。
- **输出数字**（实施者执行，本会话未重跑）：
  - 命令 1：`WI R4-A` 2 passed → `job-detail.spec.ts` 整文件 13 passed。
  - 命令 2：`WI R4-A` E2E 1 passed → 四份 E2E（shell / agent / jobs/detail-stage / jobs/list-create）30 passed。只追加了 `--output <独占 Temp>`，配置不变。
  - 命令 3：全量单测 34 files / 1020 passed / 0 failed；typecheck、lint 通过；`git diff --stat 6c082fd HEAD -- frontend` 只含三文件。
  - 回归：六守卫通过；contract 24 / 10 / 2；routes + session 17；`WI H-2` 27；badges 48；job-list 12；提交前后 `git diff --check` 与 `astra-verify.py` PASS（冻结 spec / R10 blob `4537c55…` 26 / 0 不变）；提交后 clean，4173 无 LISTEN。
- **未跑**：其余 7 份 E2E、全量 `pnpm -C frontend test`、人工截图、后端测试、任何 46 AC 最终验收。
- **增量 Converge**：`converge-batch4-r4a.md` 判**本任务增量已收口、待独立 A 增量 Review**。3 / 3 标准满足；无缺口；不新增任务；plan 不改（无 r6.12）；不是需求变更。交 A 的观察 O-R4A-1～4：被弃回调的 store 写入照常发生（R4-E 边界）；Back / 换作业没有单独用例；E2E 用固定真实等待；例 2 中 `replace` 恰一次来自 `selectStage`。Analyze R20 结构复算：70 / 104.5 h / 235 / 235；21 已完成 + 6 已实施 + 43 未开始；回边仍只有 T-B03 → T-B04；无环；46 AC 双向一致。
- **未关项**：
  - **R4-A**：代码已修，**待 A 判定是否关闭**；第四批 Review 维持未通过。
  - **R2-C**：代码已核，但按原件须本批通过后才关闭。
  - **R4-B～R4-E**（四项旧 P3）、S-41、R3-B / R3-C 及前两批 P3：都没有经过风险接受，本轮不动。
  - **H-x**：H-2·标签 ① `5c00cf6` 仍是候选；H-2·列表 ① 仍 `af24c82`；所有切片 ④ 缺。本修复不是 v2 集成，也不是整个 feature 交付。
- **状态**：27 已实施 = 21 已完成 + 第四批 5 项已实施（原批次未过）+ T-B04a 1 项待 A；43 未开始；46 AC 最终验收 0；feature 未收敛。
- **远端与合并**（只记录，本轮不操作）：
  - Draft PR https://github.com/iswalterwu/Futures-AI/pull/12 的远端 head 仍是 `e285ad2`，暂未更新（本地远端跟踪 ref 同值，未 fetch）。
  - Root 规格树 `spec/workbench-interaction` @ `4f11611` 有 HANDOFF §15 备份。
  - 按 Walter 的选择，feature 全部完成后再合 main。本轮不 merge main、不 resolve 冲突、不清理目录、不写 v2 树；core pin `90187f7` 与 main `072bb12` 的 R2-D 流程不变。
- **下一步**：A 新会话增量代码 Review。固定审 `80a1892..ae592ba -- frontend` 与本轮文档提交，只核 R4-A 及第四批是否可以改判。下一步是 A 复核，不需要用户再次批准 §5.1。A 通过前，不写“已完成”，不关闭 R4-A / R2-C，不把 H-2·标签 ① 转为已核。

## 19. R4-A 关闭：A 增量 Review 通过，第四批 5 项 + T-B04a 技术通过（2026-10-29；状态登记，不是全 feature Review / Gate 2 / Handoff）

- **作者**：claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188ff-3aaa-7144-8323-7c67c8018ae9`）。bridge 本窗口已明确 quota，不重试；官方通道成功；未改配置，也没有因为 Review 结果换模型。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。复用本文档树（起点 `46e8fbe`、clean），没有新建工作树。本节**没有运行产品测试**，数字全部引自 A 原件与实施者日志。
- **授权 → 实施 → 收口 → 复核链**：

  | 步骤 | 提交 | 角色 / 模型（会话） | 结论 |
  |---|---|---|---|
  | Walter §5.1 批准 | `80a189264428f4b011279e4ebf1cc980e9656d14` | 记账 claude-opus-5-5 via anthropic（`01a188da…`） | 原话“那就先修P2等全部工作完成后，再合入main”= 批准 R4-A 最小修复，并选定全部完成后再合 main；**不是**风险接受、**不是**提前 Gate 2、**不是**立即清理 |
  | T-B04a 实施 | `ae592ba23b086dd5887a269e842f80c96ad16fb2` | openai/gpt-6-astra（`01a188e0…`，首选、未回退） | 3 文件 +72 / −2，生产 diff 6 行；旧代码先红（组件 2 / Chrome 1），修复后同一测试变绿；没有扩大范围 |
  | 增量 Converge / Analyze R20 | `11a467fba775e1f3448fa306056e0fc2aeba0fb6` | claude-opus-5-5 via anthropic（`01a188e8…`） | 当时判“本任务增量已收口、待 A”（原文不改） |
  | A 增量 Review | `46e8fbef925faf83ca7cc1509a1490df27394172` | claude-fable-5-1 via anthropic（`01a188f3-5e82-71d7-950a-7cdff74d3042`，新会话、只读审核树） | **本增量通过：0 P1 / 0 P2 / 0 新 P3**；R4-A 关闭；R2-C 技术关闭；第四批 5 项 + T-B04a 可判技术通过 |

  A 与 Implement 异模型，与 Converge 隔离；只换通道、不换模型（A 未单独探 bridge，原件已如实登记）。
- **A 亲跑证据**（`review-batch4-r4a.md` §1 / §4，本节只引用）：
  - 任务命令：命令 1 = 2 → 13；命令 2 = 1 → 四份 E2E 30 / 0；命令 3 = 34 files / 1020 / 0 + typecheck / lint + `6c082fd..HEAD -- frontend` 只含三文件（scope 无扩大）。
  - 回归：六守卫；contract 24 methods / 10 events / 2 artifacts；routes + session 17；`WI H-2` 27；badges 48；job-list 12；v1 契约 88；real-stubs 23。
  - 真实 Chrome 只读探针 6 / 6：侧栏离开后等 4 s 仍在 `/prices`；Back 后历史完整、不再退到 `about:blank`，Forward 时合法 canonical 正常；同作业缓存下选“交付”，7 s 内从未回到 `/process`；换作业不再被遗弃 id 劫持（只观察到 R4-E 约 17 ms 的 store 错位，随后自愈）；slow 首次 canonical 与 normal 点阶段 + reload 正常。**探针不计入 30 条正式 E2E。**
  - **未跑**：其余 7 份 E2E、全量 `pnpm -C frontend test`、人工截图、后端测试、任何 46 AC 的最终验收。
- **判定与状态回写**：
  - 第四批原 Review（`9812f64`，未通过）原样保留、不改。本次是补修后的复核闭环，不是翻票。T-B01 / B02 / A22d / B04 / B03 / B04a 记为“已完成（原 Review + 增量 Review 联合依据，非最终 AC）”。
  - **27 / 70 已完成，43 未开始**；70 个任务 / 104.5 h；235 / 235；46 AC 最终验收 **0**；feature **未收敛**。标准 / 命令 / 工时 / DAG / 矩阵均未改。
  - 开放 P3 见 §8【R4-A 关闭后更新】：R4-B～R4-E、S-41、R3-B / R3-C 及其他前批项均未经风险接受。后台 store 时序（R4-E）本次没有修。
- **H-x**：H-2·标签 ① `5c00cf6` 转**生产已核**；H-2·列表 ① 仍 `af24c82`；页面切片 B01 / B02 / B04 / B04a 已完成，但 C 组未做 → 未交付；H-5 未做；H-6 缺 T-A21；**④ 全缺**。生产方集成树 SHA 不能填作 ④。
- **结构复算**（只读脚本 `status-struct.py`，在协调器 Temp，复用 R20 逻辑）：70 个任务 / 104.5 h；done 27、todo 43、impl 0；235 / 235；46 AC 矩阵双向一致，部分前置都是祖先；无环，唯一编号回边 T-B03 → T-B04。与 HEAD 逐任务对比，只有这六项的状态从 impl 变为 done。
- **工作树、远端与合并**：
  - Walter 已选择继续开发（全部完成后再合 main），所以不再是“等用户决定归档清理”。现有 25 个本 feature worktree 保留并复用，没有新建 D:/2030 目录。
  - Draft PR #12 保持 Draft，不开 auto-merge、不转 ready；本轮不 merge、不处理 main 冲突、不删除任何目录或分支。本状态提交后，由集成人按常规 push 备份 integration / spec 分支（远端 head 当前仍是 `e285ad2`）。
  - main pin `90187f7` 与 R2-D 同步流程不变；不写 v2 树。
- **下一步**：依赖已满足、可起步的有 T-A14 / T-A15 / T-A16 / T-C01。T-A16 / T-A19 开工前须先定案 R-A；T-B05 开工前先做 S-41 精度轮。下一批由集成人按既有流程起步（开工前精度 → Analyze → A Checklist 定向复核 → Implement → Converge → A Review），**不再重复询问通用代码授权**。全部任务完成、经全 feature Converge / Review / Gate 2 后才合 main。

## 20. 第五批派工准备（r6.12，2026-10-29；采集台闭环开工前机制精度；未审核、未实施，不预写任何实施或测试结果）

- **作者 / 通道**：Plan / Tasks / Analyze = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18917-d5b2-7520-921c-f26458a30be1`）。`claude-bridge` 在本协调窗口已明确 quota、无重置证据，本轮不重试；同模型官方通道近期成功；只换通道不换模型，未改任何 provider / key / 全局配置。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。
- **工作树**：复用计划树 `D:/2030/Futures-AI-interaction-plan-batch4`（分支 `docs/workbench-interaction-batch4-plan`，起点 `4bc66273ab20ddbf819813bc017ee794643a6941`、clean；代码仍为 `ae592ba`），没有新建 D:/2030 目录。本轮只写 `specs/workbench-interaction/{plan,tasks,analyze,implementation-log,interface-handoff}.md` 与 `specs/README.md` 本 feature 两行；不写源码 / 测试 / fixture / spec / checklist / 旧 Review / 旧 Converge / docs；没有运行产品测试，没有 commit / push / merge，没有派子 agent。结构复算脚本与日志在协调器 Temp `wi-batch5-01a18388-q7s7olxl/prepare-*`，不是项目产物。
- **重读输入**：AGENTS.md；`docs/plan.md`；`docs/designUI.md` §2.4 / §3 / §6；`docs/interaction.md` §3 / §7；冻结 spec（46 AC）；plan r6.11 全文；tasks §0 / §1 / §2a / §3 / §5 / §6 / §7 与 T-A12 / A13 / A15 / A17 / A22a / A22d / B04 / B06 / C01～C04 / D02 / E03 / F03；Checklist R10（`37e2f71`，blob `4537c55…`，26 / 26）；analyze R20；本文件 §8 / §19；interface-handoff；`review-batch3.md` R3-B；`review-batch4.md` / `review-batch4-r4a.md`。
- **真读代码（`ae592ba`）得到的事实**：
  - `StageWorkspace.vue` 只接收 `stage`、只渲染占位；`JobDetailPage.vue` 无采集列表、无投放入口、无介入历史；`stores/intake.ts`、`IntakeDrawer` / `IntakePanel` 都不存在。
  - `jobsStore.readDetail` 每次成功都把 `currentJob` 换成新的契约对象（`computed(readonly)` 引用随之变化），可作重读信号。
  - `DataClient` 没有 `listInterventions`；`real-stubs.spec.ts` 的 `requests` 表现有 22 键（23 例）。
  - `job-state.ts` 的 `removeUpload` 不检查 `removed`（R3-B）；`confirmIntake` 回执中的 `upload` 已是确认后的记录，而 `preview.fields` 始终是提交时的合成字段；`getStageWorkspace` 的采集列表随 `jobsStore.refresh()` 重读，待归属池不在 jobsStore 内。
  - `SourceNoteSchema.reliability` 是内联四值枚举，契约没有其中文文案。
  - 既有断言中 `job-detail.spec.ts` 用全局选择器取 `h1`、`.job-*`、`[aria-current="step"]`、`[aria-pressed="true"]`，`list-create` / `detail-stage` E2E 以严格模式取 `heading level 1`、`X工作区` 区域；慢场景测试断言 ready 后无 `Loading` → 新组件须默认不读、不渲染上述元素。
- **最小调度与缺口落点**：见 analyze.md「Analyze R21」§2～§4、tasks 页首 r6.12 块、plan【r6.12】。

### 20.1 批次范围、顺序与模型

| 序 | 任务 | 预计 | 依赖 | 标准 / 命令 | 最终 / 部分 AC |
|---|---|---|---|---|---|
| 1 | T-A01a ReliabilityLabel | 0.5 h | A01 | 3 / 3 | AC-003-3、AC-008-1 部分前置 |
| 2 | T-A13a R3-B 重复删除拒绝 | 0.5 h | A13 | 3 / 3 | AC-007-3 部分前置（**R11 判定领域规则；判为 §5.1 则 blocked**） |
| 3 | T-A15a listInterventions | 0.5 h | A13 | 3 / 3 | AC-007-1、AC-008-2、AC-008-3 部分前置 |
| 4 | T-B06 介入历史侧栏 | 2 h | B04、A15a、A01a | 3 / 3 | AC-007-1 **最终**；AC-002-4、AC-003-3 部分前置 |
| 5 | T-C01 投放面板 + intakeStore（H-5） | 2 h | A22、A12、A22a、A01a | 5 / 5 | AC-003-2 **最终**；AC-003-1 / 003-3 / 003-5 部分前置 |
| 6 | T-C01a 抽屉容器 + 页面挂载 + CollectWorkspace | 1.5 h | C01、B04 | 5 / 5 | AC-003-1 / 003-5 / 007-3 部分前置 |
| 7 | T-C02 预览 / 映射 / 确认 | 2 h | C01、C01a、A23 | 4 / 4 | AC-003-4、AC-003-6 **最终** |
| 8 | T-C03 待归属池 / 归入 / 删除确认 | 1.5 h | C02、A13、C01a、A13a | 4 / 4 | AC-003-5 / 007-3 部分前置 |
| 9 | T-C04 采集端到端 | 1.5 h | C03、B04、B06 | 3 / 3 | AC-003-1 本地子项；AC-003-3、AC-003-5 **最终** |

合计 9 项、约 12 h、33 条命令；同一实施树串行，每项一个提交。**Implement** 首选 `openai/gpt-6-astra`（回退 `deepseek/deepseek-flash`，只在调用失败时回退）；**审核员 A**（Checklist R11 / 批次 Review）首选 `claude-fable-5-1`，先 `claude-bridge` 后 `anthropic`，回退 `claude-opus-5-5` → `openai/gpt-6.1-sol`，须新会话、与实施隔离、与实施模型不同（AGENTS §6）。测试变红、Analyze 有差距、Review 未通过都不是换模型的理由。

### 20.2 逐任务文件所有权（只许写下列文件；其余一律不写，超出即停下回报）

| 任务 | 生产文件 | 测试文件（新建 / 追加） | 生成物 |
|---|---|---|---|
| T-A01a | `frontend/src/contracts/types.ts`（只加 `ReliabilityLabel` + schema + 注册） | `tests/unit/jobs/contract-labels.spec.ts`（只新增 `WI reliability label` 组） | `frontend/contracts/{CONTRACT.md,schema.json}`（只经 `pnpm -C frontend contract`） |
| T-A13a | `frontend/src/contracts/mock/job-state.ts`（只改 `removeUpload`）、`frontend/src/contracts/methods.ts`（只改 `removeUpload.description`） | `tests/unit/jobs/job-state-pool.spec.ts`（只新增 `WI R3-B repeated remove` 组） | 同上 |
| T-A15a | `contracts/client.ts`、`contracts/methods.ts`、`contracts/real/index.ts`、`contracts/mock/index.ts`、`contracts/mock/job-state.ts`（均只加 `listInterventions`） | 新建 `tests/unit/jobs/job-state-history.spec.ts`；`tests/unit/jobs/real-stubs.spec.ts`（只在 `requests` 表追加一键） | 同上 |
| T-B06 | 新建 `frontend/src/jobs/components/InterventionHistory.vue`；`frontend/src/jobs/pages/JobDetailPage.vue`（只改 ready 有作业分支的布局与挂载） | 新建 `tests/component/jobs/intervention-history.spec.ts` | — |
| T-C01 | 新建 `frontend/src/jobs/stores/intake.ts`、`frontend/src/jobs/stages/IntakePanel.vue` | 新建 `tests/component/jobs/intake.spec.ts` | — |
| T-C01a | 新建 `frontend/src/jobs/stages/IntakeDrawer.vue`、`frontend/src/jobs/stages/CollectWorkspace.vue`；`frontend/src/jobs/pages/JobListPage.vue`（投放按钮 + `.intake-slot`）、`frontend/src/jobs/pages/JobDetailPage.vue`（`.intake-slot` + 给 `StageWorkspace` 传两个 props）、`frontend/src/jobs/components/StageWorkspace.vue`（props 与 collect 分发） | `tests/component/jobs/intake.spec.ts`（追加 `WI H-5 container` / `WI H-5 close` / `WI page mount` / `WI non-modal` 组） | — |
| T-C02 | `frontend/src/jobs/stores/intake.ts`（追加选中 / 预览 / 确认）、新建 `frontend/src/jobs/stages/{ExtractionPreview,MappingEditor}.vue`、`frontend/src/jobs/stages/IntakeDrawer.vue`、`frontend/src/jobs/stages/CollectWorkspace.vue` | 新建 `tests/component/jobs/extraction-preview.spec.ts` | — |
| T-C03 | `frontend/src/jobs/stores/intake.ts`（追加池 / 归入 / 删除与写后池重读）、新建 `frontend/src/jobs/stages/UnassignedPool.vue`、`IntakeDrawer.vue`、`CollectWorkspace.vue` | 新建 `tests/component/jobs/unassigned-pool.spec.ts` | — |
| T-C04 | **无**（只写 E2E） | 新建 `e2e/jobs/intake.spec.ts` | — |

**全批禁止写**：`frontend/src/app/**`、`frontend/src/shared/**`、`frontend/src/agent/**`、`frontend/src/workbench/**`、`frontend/src/main.ts`、`frontend/src/jobs/routes.ts`、`frontend/src/jobs/stores/{jobs,session}.ts`、`frontend/src/jobs/persistence.ts`、`frontend/src/contracts/mock/fixtures/**`、`scripts/**`、`package.json` / 锁文件 / `vitest.config.ts` / `playwright.config.ts` / 其他配置、`docs/**`、`specs/**`（实施会话不改规格）、`backend/**`。R4-A 的 6 行生产修复（`JobDetailPage.vue` 的 `watch` 回调）原样保留，T-B06 / T-C01a 改该文件时不动它。

**旧用例不改**（只允许在上表点名的文件中新增组）：`jobs-store.spec.ts`（27 例 `WI H-2` + 详情缓存组，整文件 43）、`routes.spec.ts` + `session-context.spec.ts`（17）、`job-list.spec.ts`（12）、`job-detail.spec.ts`（13）、`job-create.spec.ts`（5）、`badges.spec.ts`（48）、v1 三份契约测试（88）的期望与断言；`real-stubs.spec.ts` 只追加一键。若某既有用例因本批改动真实失败，停下回报，不改其断言、不 skip、不放宽生产规则来讨绿。

### 20.3 逐任务验证命令（1:1，原文以 tasks.md 为准；前缀 `pnpm -C frontend`）

- T-A01a：`test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI reliability label"`；`test:unit tests/unit/jobs/contract-labels.spec.ts tests/unit/contracts.spec.ts tests/unit/contract-doc.spec.ts`；`contract --check && typecheck && lint`。
- T-A13a：`test:unit tests/unit/jobs/job-state-pool.spec.ts -t "WI R3-B repeated remove"`；`test:unit tests/unit/jobs/job-state-pool.spec.ts`；`contract --check && typecheck && lint`。
- T-A15a：`test:unit tests/unit/jobs/job-state-history.spec.ts -t "WI listInterventions"`；`… -t "WI history scenarios" && test:unit tests/unit/jobs/real-stubs.spec.ts`；`contract --check && typecheck && lint`。
- T-B06：`test:unit tests/component/jobs/intervention-history.spec.ts -t "WI AC-007-1"`；`… -t "WI history refresh"`；`test:unit tests/component/jobs/job-detail.spec.ts && test:e2e e2e/jobs/detail-stage.spec.ts e2e/jobs/list-create.spec.ts && typecheck && lint`。
- T-C01：`intake.spec.ts` 的 `WI AC-003-2` / `WI purpose required` / `WI metadata only` / `WI H-5 store`；`typecheck && lint`。
- T-C01a：`intake.spec.ts` 的 `WI H-5 container` / `WI H-5 close` / `WI page mount` / `WI non-modal && typecheck && lint`；`test:unit tests/component/jobs/job-list.spec.ts tests/component/jobs/job-detail.spec.ts tests/component/jobs/job-create.spec.ts && test:e2e e2e/jobs/detail-stage.spec.ts e2e/jobs/list-create.spec.ts`。
- T-C02：`extraction-preview.spec.ts` 的 `WI AC-003-4` / `WI AC-003-6` / `WI confirm refresh`；`test:unit tests/component/jobs/intake.spec.ts && typecheck && lint`。
- T-C03：`unassigned-pool.spec.ts` 的 `WI pool assign` / `WI remove confirm` / `WI assign refresh`；`test:unit tests/component/jobs/intake.spec.ts tests/component/jobs/extraction-preview.spec.ts tests/unit/jobs/job-state-pool.spec.ts && typecheck && lint`。
- T-C04：`test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-1 local"` / `-g "WI AC-003-3"` / `-g "WI AC-003-5"`。

**批末回归**（Converge 前由实施者执行并登记，不是任务标准）：`test:unit`（当前基线 34 files / 1020 / 0，加本批新增）；`check`（六守卫）；`contract --check`（当前 24 methods / 10 events / 2 artifacts，本批后预计 25 methods）；`typecheck && lint`；`test:e2e e2e/shell.spec.ts e2e/agent.spec.ts e2e/jobs/detail-stage.spec.ts e2e/jobs/list-create.spec.ts e2e/jobs/intake.spec.ts`（当前四份 30 + 本批新增）；回归集合：`jobs-store.spec.ts -t "WI H-2"` 27、routes + session 17、badges 48、job-list 12、job-detail 13、job-create 5、v1 契约 88、real-stubs 24（22 个桩 + 新键 1 + 键集合断言 1）。其余 E2E、全量 `pnpm test`、人工截图、46 AC 最终验收**不在本批**。以上数字是预期口径，不是结果。

### 20.4 闸门、交接与未关项

- **开码前置**：独立 A 新会话 **Checklist R11 定向复核**通过并提交（建议范围见 analyze.md「Analyze R21」§7）。R10 不覆盖 r6.12 的新接口；本作者不勾选、不预判。R11 之前不派 Astra。
- **R3-B**：T-A13a 的合法性（领域规则还是 §5.1 guard）由 R11 判定。若判为须 §5.1，本任务 blocked_by Walter；集成人可先做其余 8 项，T-C03 对 T-A13a 的依赖届时按“R3-B 未关、未经风险接受”登记处理，不得自称获批。
- **H-x**（预期，不是结果）：本批完成后，H-5 的提供任务 T-C01 / T-C01a 齐备，可形成生产方 ①③；页面切片的 C 组齐备；④ 仍须 v2 消费方所有者集成后登记。H-6 仍缺 T-A21。
- **仍开放、本批不处理**（均未经 Walter 风险接受）：R4-B～R4-E、S-41（T-B05 前）、R3-C（T-G04）、R-A / R-B 残留 / R-C / R2-A / R-D ①③④ / R-E / R-F / R2-B AgentClient 侧 / R2-D。
- **合并**：Walter 已选全部工作完成后再合 main；Draft PR #12 保持 Draft、不开 auto-merge；25 个本 feature 目录保留复用；main `072bb12` 不导入、继续 pin `90187f7`，R2-D 流程不变；不写 v2 树。
