# Feature: workbench-interaction Analyze 报告（analyze.md）

> Analyze 阶段产物（AGENTS §2 第 7 步）：只读报告 spec.md / plan.md / tasks.md 之间的冲突、差距与模糊之处。本报告**不修改** spec / plan / checklist；发现的 Tasks 可修正问题先在 R1 结束只读报告，再单独修订 tasks.md，然后重新读取输入、重跑（R2）。R1 的发现原样保留，不因修订而删除。
>
> **阶段记录（脱敏）**：角色 = Analyze；Analyze = **claude-opus-5-5 via anthropic**。通道说明同 tasks.md 页首：沿用本限额窗口 R3 的探活证据（`claude-bridge/claude-fable-5-1` 失败，quota / rate / spend_limit 类，exit 1；`anthropic/claude-opus-5-5` 已真实探活并完成 Plan 补正）；本阶段**未发起 claude-bridge 调用，也未单独探活 bridge-opus**，未改 provider / 路由 / 配置。
> **当前状态补记（2026-10-30 R5-A 关闭后；只是页首状态链接，不是新的 Analyze 轮次，R27 仍是最新 Analyze 索引，其正文原样保留）**：独立 A 增量 Review [review-batch5-r5a.md](review-batch5-r5a.md)（原件 `2c0d09d`，claude-fable-5-1 via anthropic）判**本增量通过（0 P1 / P2 / 0 新 P3）**，R5-A 技术关闭。tasks 状态改为 **37 已完成 + 37 未开始**；结构不变（74 / 107.5 h / 248 / 248 / 46 AC 双向；唯一回边 T-B03 → T-B04；无环）；46 AC 最终验收 0；feature 未收敛；R5-B / R5-C 仍待 Walter §5.1、未批准。见 tasks 页首、implementation-log §26。下一行“待 A”“37 已实施（36 + 1 待 A）”为 R27 当时原文。
> 【R27 当时原文】**当前结论（2026-10-30 T-C04a 已实施 + R5-A 增量 Converge）：见文末「Analyze R27」**（当前索引；只读，不是审核结论；下一行指向 R25 的页首块、以及 R26 / R25 正文为当时原文，不改；R26 当轮未加页首行）。T-C04a 代码 `f63ef7c`（3 文件 +82 / −2，`selectReceipt` 一行普通赋值、无 guard）3 / 3 标准有代码与实施者命令证据（先红 2 / 1，后 32 / 79 / 1130），本任务增量已收口、待独立 A 增量 Review；37 已实施（36 已完成 + T-C04a 待 A）/ 37 未开始；74 / 107.5 h / 248 / 248 / 46 AC 不变，唯一回边 T-B03 → T-B04、无环；R5-A 代码已修、未关闭。
> **当前结论（2026-10-30 r6.12.4：第五批 9 项实施后的批次 Converge）：见文末「Analyze R25」**（当前索引；只读，不是审核结论；下一行指向 R24 的页首块及 R24～R21 正文为当时原文，不改）。第五批 9 项（`f65d3c6` … `e609c2e`，代码 `b67a227..e609c2e -- frontend` 9 个前端提交 / 28 文件 / +3672 / −24）的标准逐条有代码与命令对应，实施者执行全过；两处 `intake.spec.ts` 例外与许可逐行相同；没有需按 §9 补的任务，定形只按精度登记（r6.12.4）；静读观察 O-B5-1～O-B5-9 交 A（O-B5-3 建议优先判定）。36 已实施（27 已完成 + 9 待第五批 Review）/ 37 未开始；73 / 107 h / 245 / 245 / 46 AC 不变，唯一回边 T-B03 → T-B04、无环；R3-B 代码已修、未关闭；下一步 = 独立 A 第五批代码 Review。
> **当前结论（2026-10-30 r6.12.3：T-C02 开码前第二次源检查停的最小 scope / 类型精度修正）：见文末「Analyze R24」**（当前索引；只读登记，结构无变化；下一行指向 R23 的页首块及 R23 / R22 正文为当时原文，不改）。T-C02 另获 C01a `collect renders all input kinds…` 第 528 行总按钮数断言 → “投放到本作业”入口恰 1 个的一行替换（C03 继承不再改），与 r6.12.2 首例例外合为两处已知阶段性测试约束纠正、不删除验收覆盖；扫描无第三处；内部只读 `previewTarget: DeepReadonly<Upload> | null` 补“同一投放重试”的类型 / 清理点精度。33 已实施 / 40 未开始；标准 / 命令 / 工时 / 依赖 / AC 不变，R11 原件只读、不重开 Checklist；可再派 Astra 做 T-C02。
> **当前结论（2026-10-30 r6.12.2：T-C02 / T-C03 开码范围冲突最小修正）：见文末「Analyze R23」**（当前索引；只读登记，结构无变化；下一行指向 R22 的页首块及 R22 / R21 正文为当时原文，不改）。第五批前 6 项已实施待 Review（`f65d3c6` … `6529f41`），33 已实施（27 已完成 + 6 待 Review）/ 40 未开始；T-C02 / T-C03 各获 `intake.spec.ts` 首例一条断言替换的唯一例外，标准 / 命令 / 工时 / 依赖 / AC 不变，R11 原件只读、不重开 Checklist；可再派 Astra 做 T-C02。
> **当前结论（2026-10-30 r6.12.1：Checklist R11 已通过 + P3 S-44～S-48 吸收）：见文末「Analyze R22」**（当前索引；只读登记，结构无变化）。Checklist R11 原件 `1f99f80`（A = claude-fable-5-1 via anthropic，blob `27a76aa6…`）通过 26 / 26、0 P1 / P2；第五批 9 项仍未实施，可按 R11 开码。下一行指向 R21 的页首块及 R21 正文中的“未审核”“须 R11 后才可开码”“R3-B 由 R11 判定 / 判为 §5.1 时其余 8 项照常推进”为当时原文，正文不改，其条件分支已由 R11 判定废止。本行不是审核结论。
> **当前结论（2026-10-29 r6.12 第五批派工准备）：见文末「Analyze R21」**（当前索引；下一行“R20 仍是最新 Analyze 索引”为当时原文，R20 及更早轮次正文不改）。第五批 = T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04（9 项，约 12 h，33 条命令）；结构 73 个任务 / 107 h / 245 / 245，27 已完成 / 46 未开始；唯一编号回边 T-B03 → T-B04，无环；AC 矩阵 46 行双向一致。**未审核、未实施**：须独立 A 新会话 Checklist R11 定向复核通过并提交后才可开码；R10 不自动覆盖新接口。本行不是审核结论。
> **当前状态补记（2026-10-29 R4-A 关闭后；只是页首状态链接，不是新的 Analyze 轮次，R20 仍是最新 Analyze 索引，其正文原样保留）**：独立 A 增量 Review [review-batch4-r4a.md](review-batch4-r4a.md)（原件 `46e8fbe`，claude-fable-5-1 via anthropic）判**本增量通过（0 P1 / P2 / 0 新 P3）**：R4-A 关闭，R2-C 技术关闭，第四批 5 项 + T-B04a 技术通过。tasks 状态改为 **27 已完成 + 43 未开始**；结构不变（70 / 104.5 h / 235 / 235 / 46 AC 双向；唯一回边 B03 → B04；无环）；46 AC 最终验收 0；feature 未收敛。见 tasks 页首、implementation-log §19。下一行“待 A”“21 + 6 已实施”为 R20 当时原文。
> 【R20 当时原文】**当前结论（2026-10-29 T-B04a 已实施、增量 Converge 已收口、待 A 新会话增量 Review）：见文末「Analyze R20」**（当前索引）。结构 70 / 104.5 h / 235 / 235；21 已完成 + 6 已实施（第四批 5 项未过 + T-B04a 待 A）+ 43 未开始；R4-A 代码已修、未关闭。下一行起指向 R18 的页首块，以及文末 R19，均为当时原文。
> 【当时原文】**当前结论（2026-10-29 第四批 Review 未通过 + R4-A 工程审批等待）：见文末「Analyze R18」**（当前索引；下方 R17 页首块及更早轮次为当时原文，正文不改）
> - **本轮**：第四批代码 Review（`review-batch4.md`，原件 `9812f64`）判**未通过**：1 P2 R4-A + 4 P3 R4-B～R4-E，结论原样保留。R4-A 修复草案 = tasks **T-B04a**（0.5 h）+ plan §2.1 / §2.3【r6.11 草案】，**blocked_by: Walter AGENTS §5.1 批准**；草案**不授权实施**。这不是需求变更，不重过 Gate 1；不是全 feature Gate 2 / Handoff。
> - **结构**：70 个任务 / 104.5 h；235 / 235；**21 已完成 + 5 已实施（第四批 Review 未通过）+ 44 未开始（其中 T-B04a 待工程批准）**；真实依赖图无环，唯一编号回边仍为 T-B03 → T-B04；AC 矩阵 46 行双向一致，部分前置都是最终任务的祖先（AC-002-2 最终 = T-B04 + T-B04a，v2 后 T-H04 回归）；46 AC 最终验收 0；feature **未收敛**。
> - **有效 Checklist**：R10 `37e2f71`（blob `4537c55…`，未改）。R2-C 代码经 A 核实，但关闭条件（本批通过）未满足；R4-B～R4-E、S-41、R3-B / R3-C 等均未经风险接受。
>
> 【历史原文（R17 撰写时）】**当前结论（2026-10-29 第四批实施后 Converge batch4 + r6.10）：见文末「Analyze R17」**（当前索引；下方 R16 页首块及更早轮次为当时原文，正文不改）
> - **本轮**：第四批 T-B01 / B02 / A22d / B04 / B03 已实施（代码 `37e2f71..6c082fd -- frontend`，5 提交 17 文件），Converge（`converge-batch4.md`）判**已收口、待第四批独立代码 Review**；无对冻结 AC 的明确违反，不新增任务；实施定形只是类型 / 读法精度（r6.10）。静读观察 O-B4-1～6 交 A。
> - **结构**：69 个任务 / 104 h；232 / 232；**21 已完成 + 5 已实施（待 Review）+ 43 未开始**；真实依赖图无环，唯一编号回边 T-B03 → T-B04（R10 已认可）；AC 矩阵 46 行祖先与双向一致；46 AC 最终验收 0；feature **未收敛**。
> - **有效 Checklist**：R10 `37e2f71`（blob `4537c55…`，未改）。R2-C 代码已修、待 A 确认关闭；R10 S-41 归 T-B05 开工前精度轮；S-42 已落实；S-43 已在 plan 登记。**不是** Review / Gate 2 / Handoff。
>
> 【历史原文（R16 撰写时）】**当前结论（2026-10-29 第四批开工前机制精度 r6.9）：见文末「Analyze R16」**（当前索引；下方 T-A22c 状态补记与 R15 及更早轮次为当时原文，正文不改）
> - **本轮**：只为第四批 T-B01 → T-B02 → T-A22d → T-B04 → T-B03（约 7.5 h）补既有 what / AC 内的机制精度：R2-C 令牌映射归 B01；B03 挂载点与依赖 B04（唯一有意编号回边，拓扑无环）；详情视图缓存接口自原 B04 拆为 T-A22d（1 h，B-12 先例）；harness 与写权限。spec / 46 AC 不变，不回 Clarify。
> - **结构**：69 个任务 / 104 h；232 / 232；21 / 69 已完成、48 未开始；AC 矩阵 46 行祖先与双向一致；46 AC 最终验收 0；feature **未收敛**。
> - **门槛**：r6.9 未审核，须独立 A 新会话 **Checklist R10** 定向复核通过并提交后才可开码；R9 `ab742f5` 未改。**不是** Review / Gate 2 / Handoff。
>
> **当前状态补记（2026-10-29 T-A22c 增量代码 Review 后；只是页首状态链接，不是新的 Analyze 轮次，R15 仍是最新 Analyze 索引，其正文原样保留）**：
> - 独立 A 增量代码 Review（[`review-batch3-cache-fix.md`](review-batch3-cache-fix.md)，A = claude-fable-5-1 via anthropic，原件提交 `69faacccabd8b089a9f240b28e6449a8fea90619`）判 T-A22c **通过：0 P1 / P2、0 新 P3，R3-A 关闭**。R15 正文中“待独立 A 增量 Review”“R3-A = 代码已修、待复核”“④ 复核前不放行”是 R15 当时的原文，本报告不改写。
> - 当前进度：68 个任务 / 102.5 h；**21 / 68 已完成**、47 未开始；227 / 227；DAG 与 46 行 AC 矩阵不变（状态登记时脚本复算，见 implementation-log §13）；46 AC 最终验收 0；feature **未收敛**。R3-B / R3-C 仍未修、未经 Walter 风险接受；H-2·列表 ④ 仍缺。有效 Checklist 仍为 R9 `ab742f5`。记账者 = claude-opus-5-5 via anthropic（bridge 本窗口已明确限额、未重试；未改配置）。**不是** Review / Gate 2 / Handoff。
>
> 【历史原文（R15 撰写时）】**当前结论（2026-10-29 T-A22c 实施后增量 Converge）：见文末「Analyze R15」**
> - **T-A22c**：已实施 `af24c82`（2 个文件；方案 b，只删 `applyFilter` 成功分支两次赋值，新增 `WI H-2 list status` 两例，filter 组一例改为“只有显式 refresh 清错”）。实施者执行的 3 条任务命令与回归全过，红 → 绿属实。增量 Converge（`converge-batch3-cache-fix.md`）判与 r6.8 逐条一致、无规格差距，**待独立 A 增量 Review**。
> - **R3-A**：代码已修、待 A 复核，不由本报告判关闭。R3-B / R3-C 未改。
> - **结构**：68 个任务 / 102.5 h；227 / 227；**21 / 68 已实施**（20 已完成 + 1 待定向 Review）、47 未开始；DAG 与 46 行 AC 矩阵不变；46 AC 最终验收 0；feature **未收敛**。spec 46 AC 不改。
> - **有效 Checklist**：R9 `ab742f5`（未改）。**不是** Review / Gate 2 / Handoff。
>
> 【历史原文】**当前结论（2026-10-29 第三批代码 Review 后 R3-A Converge 补修登记 r6.8）：见文末「Analyze R14」**
> - **第三批**：T-A11 / A12 / A13 / A22a 经独立代码 Review 通过（`review-batch3.md`，原件 `49edb7e`；0 P1 / P2，3 P3），记为已完成。
> - **R3-A**：集成人决定现在修 → 新增 **T-A22c**（≤ 0.5 h，依赖 T-A22a，方案 b，恢复 r6.6“`applyFilter(f)` 只写 `filter` / `filteredJobs`”的原意）。不回 Clarify，spec / 46 AC 不变。**修复任务已登记、待实施 / 待 A 增量复核**，代码未修。R3-B → T-C03 / T-A17、R3-C → T-G04，未修。
> - **结构**：68 个任务 / 102.5 h；完成标准 / 命令 227 / 227；20 已完成、48 未开始；46 AC 最终验收 0；feature **未收敛**。
> - **有效 Checklist**：R9 `ab742f5`（未改）。**不是** Review / Gate 2 / Handoff。
>
> 【历史原文】**当前结论（2026-10-29 第三批实施后 Converge batch3）：见文末「Analyze R13」**
> - **本批**：T-A11 / T-A12 / T-A13 / T-A22a 已实施（代码 `ab742f5..0032fc6 -- frontend`，5 个前端提交，含 A12 test-fix `0a2d1a5`）。Converge 判本批范围**已收口、待第三批独立代码 Review**，未新增任务；实施定形只是精度，已同步 plan / tasks / interface-handoff（r6.7）。
> - **feature 整体**：**20 / 67 已实施**（16 已完成 + 4 待审）、**47 未开始**，**未收敛**（尚未实施 + H 组外部阻塞）；46 AC 最终验收 0。H-2·列表生产方 ①②③ 具备、④ 缺；H-x 无一已交付。
> - **有效 Checklist**：R9 `ab742f5`（未改）。上游 main `072bb12` 未同步。
> - **不是** Review / Gate 2 / Handoff。
>
> 【历史原文】以下 r6.6.2 / r6.6.1 / r6.6 三条为第三批开工前的当时结论，其“本批 4 项待实施 / 16 / 67”已由 R13 取代。
> **当前结论补记（2026-10-29 r6.6.2 语义回归许可）：见文末「Analyze R12.2」**——只许 T-A12 改 `tests/unit/jobs/persistence.spec.ts` 中 `WI non-normal` 参数化用例的 error 分支，以符合已批准的 error 拒绝时机（commit 内、替换状态前）；T-A13 对该文件无许可；plan / 标准 / 命令 / 结构不变，R12 / R12.1 其余结论有效。
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

---

## Analyze R12.2（只读；第三批 r6.6.2 语义回归许可，2026-10-29；R12 / R12.1 的范围补记，不占后续 Converge 配套的 R13 编号；区别于 Checklist R9，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：Tasks 语义回归许可小补 + 本分析；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a186f6-6f87-759d-864d-cfa50e021625`）。
> - **通道**：`claude-bridge` 本窗口已明确 quota / rate 失败，按 AGENTS §6 规则 5 不重试；官方通道正常。未改 provider / key / 路由 / 全局配置。测试红与范围问题不是换模型理由。
> - **派工**：集成人协调会话 `01a18388`。Walter 的“允许”授权与集成人指定在既有 tasks 范围内持续有效，本轮不新增人工授权。
> - **性质**：只读报告，不勾选 checklist。当前有效审核 = **Checklist R9**（`ab742f5`，`checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`，本轮未改）。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-plan-batch3`（`docs/workbench-interaction-batch3-plan`，起点 `e4031fa`，起始 clean）。本轮只写 tasks.md（页首补记一段；T-A12 / T-A13 修改范围各一条【r6.6.2】）、本报告（本节）、implementation-log.md（页首补记、§7 四行、§10 一条）。
> - **只读核对**：实施树 `D:/2030/Futures-AI-interaction-implement`（HEAD `742d6aa3d671cee91c6cce856f657a103d510615`，`c7ebccb` 为其祖先；工作区有 T-A13 未提交改动）中的 `frontend/tests/unit/jobs/persistence.spec.ts` 与 `frontend/src/contracts/mock/job-state.ts` 的 `commit`，以及独占临时目录中的 Astra 回报与日志。**未写实施树**。
> - **未改动**：代码 / fixture / 测试 / spec / plan / checklist / interface-handoff / README / 审核原件 / 权威 docs / 其他 worktree。
> - **未执行**：未 commit / push / merge；未安装；未启动服务或子 agent；**未运行任何产品测试**。

### 1. 起因与输入

- **起因**：Astra（`openai/gpt-6-astra`，调用正常、未回退）提交 T-A11 `c7ebccb`、T-A12 `742d6aa` 后，实现了 T-A13 但未提交。A12 / A13 各自的定向命令、contract、typecheck、lint、real-stubs 均通过；A13 末轮全量 `test:unit` **925 pass / 1 fail**，六守卫通过。唯一失败：`persistence.spec.ts > WI non-normal … > error never gets, sets or removes either key, including reset from an old client`，抛出 `{ error: { code: 'adapter_error', … } }`。该文件不在 A12 / A13 写入清单，Astra 按范围纪律停下，未改测试、未放宽生产规则。
- **重新读取**：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`；本 feature plan §2.4【r6.6】（写方法时机句、九场景表 error 行）；tasks T-A11 / A12 / A13 全文（含【r6.6 精度】与【r6.6.1】）；implementation-log §7 / §10；本报告 R12（F-9 及写方法时机行）、R12.1；checklist R9 C-04（只读）。
- **真实代码**（实施树，只读）：
  - `job-state.ts` 的 `commit`：深拷贝 → mutator → `JobStateSchema.parse` → `state.scenario === 'error'` 时抛 adapter_error → 替换状态 → persistent 时保存。`742d6aa` 与当前工作区的该函数相同（A13 未改 commit）。
  - `persistence.spec.ts` `WI non-normal` 的 `test.each` 覆盖八个非 normal 场景：先建 normal client 写快照哨兵与 inbox 哨兵 → 挂四个 Storage spy → 切到当前场景（第 260 行）→ **第 261 行直接 `commit(…'memory edit')`**（Astra 回报定位 :262，同一用例）→ 旧 client 的 `resetMockData` resolve null → 场景 / 持久化状态断言 → error 下 `listJobs` 为 adapter_error → 四个 spy 零调用 → 两个哨兵不变。error 场景种子含 normal 作业，所以目标作业存在，能用 `getJob` 比对。

### 2. 差距判定

| # | 事实 | 判定 |
|---|---|---|
| G-5 | plan §2.4【r6.6】与 T-A12【r6.6 精度】已批准：error 拒绝放在 commit 内，在 mutator 与边界校验之后、替换状态之前（保证未知锚先 not_found、error 不产生部分修改）。T-A11 的 `WI non-normal` 用例按 A11 当时语义（commit 尚无 error 拒绝）写成 error 下直接 commit 成功 | **已批准语义下的旧测试预期过时**。A12 的实现符合 plan，测试的 error 分支须随之维护。不是需求变化、不是实现 bug、不是新 guard |
| G-6 | r6.6 / r6.6.1 的写入清单没有给 A12 / A13 改 `persistence.spec.ts` 的许可 | **Tasks 层范围遗漏**（与 R12.1 G-2 同类）。R12 F-9 与 R9 C-04 审过“error 在 commit 替换前拒绝”这一设计，但没有追到它对 T-A11 既有用例的影响；R12.1 只列了 `real-stubs.spec.ts`，**未预见此用例**。本节如实更正 |
| G-7 | A11 交付时全量 860 / 860，A12 定向命令全部通过，A13 末轮全量 1 fail | **没有伪绿**：A11 的绿是真实的（当时 commit 没有 error 拒绝）；A12 的任务命令都只跑 `job-state-intake.spec.ts`，不含该用例；按 §10 建议的批末全量回归如期暴露了冲突。推断（同一 commit 代码，未另行跑）：自 `742d6aa` 起 T-A11 命令 4（`-t "WI non-normal"`）的 error 分支即为红；全量红作为失败留痕保留 |

### 3. r6.6.2 落点

- **tasks T-A12**：修改范围加【r6.6.2 语义回归许可】，只允许改 `persistence.spec.ts` `WI non-normal` 参数化用例的 **error 分支**：断言真实 `commit` 抛 adapter_error，且目标作业经真实 job-state 同步读函数（如 `getJob`）读回不变；其余 7 个场景照旧直接 commit。明文保留该用例其余全部断言（error 下业务读失败、显式 reset 在 error 下允许、两个 key 零 get / set / remove、无 clear、normal 快照哨兵与 inbox 哨兵不变）以及文件内其他 describe / test（含 `normal override`）。禁止放宽生产规则、skip / 注释、把 error 移出场景列表、改成断言白名单或宽松匹配。可作为 A12 的独立 test-fix commit。
- **tasks T-A13**：加一条“对该文件无写入许可”，不扩到其他用例或文件。
- **tasks 页首**：补记 r6.6.1 / r6.6.2 的范围性质，状态行不改（由批次 Converge 回写）。
- **implementation-log**：页首补记真实进展与停止原因；§7 记 `e4031fa` 提交、A11 续做、A12 → A13 停止、本轮文档四行；§10 加 r6.6.2 写权限条。

### 4. 为何不改 plan、不需 R9 新设计复核

- 被维护的是测试预期，不是设计：error 拒绝时机原文就在 plan §2.4【r6.6】与九场景表 error 行（“所有新增业务写方法返回 adapter_error，不产生部分修改”），R9 C-04 已审过。**plan 不改**。
- 改后 error 分支仍验证 T-A11 标准 4（零 storage 访问、显式 reset 不拒绝），并与 T-A12 标准 4（error 下写入被拒、读回不变）一致。没有放宽任何断言，也没有新增标准、命令、guard、机制或流程。
- 所有权早已覆盖：`persistence.spec.ts` 由 T-A11 新建，属 tasks §1-5 / plan §1 的本 feature jobs 测试。
- 因此不需要另开 A 设计复核。第三批正式批次代码 Review 核真实 diff：该文件只在 error 分支有改动，其余断言原样，生产 `commit` 未因此改动。

### 5. 不变项核对（脚本 + diff，只读）

- **需求**：冻结 spec、46 AC、方法集、动作矩阵不变；不回 Clarify / Gate 1。
- **结构**（`analyze-r12-struct.py` 对本轮与 `e4031fa` 两版 tasks 复算，输出 `analyze-r122-structure.log` / `analyze-r122-structure-HEAD.log`）：67 个任务、102.0 h、16 × 已完成 / 51 × 未开始、完成标准 / 命令 **224 / 224**、依赖无环、AC 矩阵 46 行；第三批命令 19 条、7.0 h。
- **diff**：`git diff e4031fa -- tasks.md` 只落在页首补记与 T-A12 / T-A13 修改范围；状态行、完成标准、验证命令、预计、依赖、§5 矩阵、§6 DAG、§7 无 hunk。

### 6. 结论（Analyze R12.2）

- G-5 是已批准语义下的旧测试维护，G-6 是 tasks 写入范围遗漏，已由 r6.6.2 关闭；G-7 确认无伪绿，红作为失败留痕保留。第三批范围内 spec ↔ plan ↔ tasks ↔ implementation-log ↔ 真实代码在本补记后无冲突。R12 / R12.1 其余结论有效。
- **状态**：规范进度仍 16 / 67 已完成。T-A11 `c7ebccb`、T-A12 `742d6aa` 已实施，待正式批次 Review；T-A13 仍未提交（工作区改动保留），待 A12 test-fix 落地、全量回归后再交付；T-A22a 未开始。不预写 A13 成功，也不预写“本轮全绿”。
- **feature**：**未收敛**；46 AC 最终验收 0；H-x 无一已交付。本报告不是 Review / Gate 2 / Handoff。

---

## Analyze R13（只读；第三批 T-A11 / T-A12 / T-A13 / T-A22a 实施后的 Converge 配套分析，2026-10-29；当前索引；区别于 Checklist R9，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：Converge / 进度登记 + 本分析；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18715-bffa-74e9-8b0d-483f569eee2b`）。
> - **通道**：本轮协调器对 `claude-bridge/claude-opus-5-5` 的最小真实调用 exit 1，失败类别 = **quota / rate / spend_limit**；同模型官方通道成功。按 AGENTS §6 规则 2 / 5 只换通道、不换模型，本窗口不重试，未改 provider / key / 路由 / 全局配置。测试红不是换模型理由。
> - **派工**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter 的“允许”授权与集成人指定在既有 tasks 范围内持续有效。
> - **性质**：只读报告，不勾选 checklist。当前有效审核 = **Checklist R9**（`ab742f5`，本树 blob `74084c1337491a042c944096e1f290fe07aab324`，未改）。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-converge-batch3`（`docs/workbench-interaction-batch3-converge`，固定起点 `0032fc6`，起始 clean）。只写 plan / tasks / analyze / implementation-log / interface-handoff、新建 `converge-batch3.md`，以及 `specs/README.md` 本 feature 行。
> - **未改动**：代码 / 测试 / fixture / spec / checklist / 已有 Review 与 Converge 原件 / 权威 docs / 根 HANDOFF / 其他 worktree。
> - **未执行**：未 commit / push / merge；未安装；未启动服务或子 agent；**未运行任何产品测试**。
> - **只读脚本与日志**（非项目产物，不清理）：`C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/` 下：
>   - 沿用 `analyze-r12-struct.py`，本轮输出 `converge-r13-structure.log`（本轮 tasks）与 `converge-r13-structure-HEAD.log`（`0032fc6`）；
>   - `converge-stdcmd.py` → `converge-r13-std-cmd-diff.log`；
>   - `converge-ready.py`（依赖已满足的下一批任务）；
>   - `converge-a13-committed.patch`（A13 WIP 保全复算）。

### 1. 重新读取与输入

- **工作流与权威文档**：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`。
- **本 feature 规格**：冻结 spec.md、plan.md（§2.3 / §2.4 / §3【r6.6】）、tasks.md（页首 r6.6 / r6.6.1 / r6.6.2、§1、§2a、T-A10～T-A13、T-A22a、§5～§7）、checklist R9（只读）、本报告 R12 / R12.1 / R12.2、implementation-log、interface-handoff、`converge-batch2.md`、`review-batch2.md`、`review-batch-a09a.md`、`specs/README.md`。
- **真实代码（逐文件读）**：固定 diff `ab742f5..0032fc6 -- frontend` 的 17 个文件，即 `contracts/{client,methods,types}.ts`、`contracts/mock/{index,job-state}.ts`、`contracts/real/index.ts`、`jobs/persistence.ts`、`jobs/stores/jobs.ts`、`main.ts`、六份 jobs 测试，以及生成物的变更段。另读 `agent/events.ts` 的终态判别。
- **实施者回报**：四份脱敏回报只作结果来源，不代替代码阅读。
- **固定输入**：
  - spec / checklist / plan / interface-handoff / README / docs / AGENTS 在 `ab742f5..0032fc6` 中零差异；
  - 区间内纯文档提交 `e4031fa`、`1988463`，后者三份 blob 与来源 `8c4660f` 相同；
  - 生产方集成树 = `0032fc6`；main = `072bb12`，不是祖先；v2 消费分支 = `3f63273`，不含本批及前两批切片 ①。

### 2. 本批范围与结论

| 项 | 结果 |
|---|---|
| 范围 | T-A11、T-A12（+ test-fix `0a2d1a5`）、T-A13、T-A22a（4 项，约 7 h）；全部是“部分前置” |
| 代码 ↔ 完成标准 | 4 / 4 有对应实现（逐条证据见 `converge-batch3.md` §2）；19 条命令的 `-t` 标题全部存在，展开数与回报数一致（A11 6 / 3 / 4 / 13，A12 11 / 5 / 10 / 5，A13 15 / 4 / 8，A22a 5 / 4 / 7 / 9） |
| 命令结果 | **实施者执行、本会话未重跑**：逐任务原定命令全部通过。clean 全量依次为 `c7ebccb` 28 / 860 / 0、`a5ad11c` 30 / 926 / 0、`0032fc6` 31 / 951 / 0；六守卫；`contract --check` 24 / 10 / 2；既有 shell + agent E2E 24 / 0 |
| 失败留痕 | A11 新测试 spy / 类型问题（只修新测试）；A12 `jobId` typecheck；含 A13 WIP 的首次批量 925 / 1（旧 error 分支）→ 范围停止 → r6.6.2 → 单独 test-fix。`742d6aa` 与 `0a2d1a5` 都没有各自的 clean 全量，本报告不补造 |
| 所有权 | 逐提交文件清单与 implementation-log §10 写权限一致；fixture、v1 三份契约测试、`app` / `shared` / `agent` / `workbench`、scripts、package / 锁、配置、e2e 均零差异；test-fix 只动 error 分支；`real-stubs.spec.ts` 只增键（共 9 键） |
| 新增任务 | 无 |
| 本批判定 | **已收口，待第三批独立代码 Review** |
| feature 判定 | **未收敛（尚未实施 + H 组外部阻塞）**：20 / 67 已实施（16 已完成 + 4 待审）、47 未开始；46 AC 最终验收 0 |

### 3. 实施定形 ↔ 需求（是否变更）

| 实施事实 | 依据 | 判定 |
|---|---|---|
| `DataClient` 九个新方法的签名、`CreateJobInput`、`IntakeReceipt = WriteReceipt + {upload, preview}`；`dataMethods` 共 22 个，加 agent 2 个 = 24 methods | plan §2.4【r6.6】 | 一致（已审签名的落地） |
| title / subject / reason 由 zod trim 变换后保存 | plan §2.4【r6.6】“去空白非空” | 精度（plan §2.4【r6.7】一句） |
| 首次投放时，ingest 锚到同次新建的 dataset，baseRev 为 null | plan §2.4【r6.6】；R9 S-39 | 精度（落在 S-39 建议的读法；plan【r6.7】一句） |
| `persistence.ts` 导出与 plan §3 / T-A11【r6.6】一致；`mappingHistory` 在 A11 落地 | T-A11 / T-A12【r6.6 精度】 | 批内落点顺序差异，终态一致（O-B3-1，交 Review） |
| `useJobsStore()` 导出（只读视图 + 五个 action + `ListJobsFilter` 类型）；`applyFilter` 成功时置 ready | T-A22a【r6.6 精度】 | 一致；成功口径沿用 refresh（O-B3-4，交 Review） |

**结论**：都是已审设计的落地或名称 / 类型精度，**不是需求变更**，不回 Clarify / Gate 1。已以【r6.7 精度（Converge batch3 登记）】同步：plan 页首与 §2.4 一处；tasks 页首、四个状态行、T-A11 / A12 / A22a 修改范围注；interface-handoff 页首、§1 两行、§3 落地核对。没有新增要求、AC、标准、命令或机制。

### 4. 关键口径逐项核对（只读）

- **持久化业务子集**：`saveJobsSnapshot` 只按六个业务字段投影序列化；Upload 走 strict schema，任何正文 / File / 字节 / 完整 input 进 state 都会在 commit 边界被拒；快照入口也是 strict，多余运行时或正文字段一律按 unreadable 处理、原值保留。`mappingHistory` 条目 = `{uploadId, mapping, status, replacedAt}`；confirm 只接受 pending_validation，所以每条投放至多一条（测试中二次 confirm 被拒后长度仍为 1）。`quarantineReason` 读回不丢（测试断言恢复后记录逐字段相等）。R9 交代的“白名单补列 + `mappingHistory` 须在代码 Review 按真实 diff 核对”仍待第三批 Review，本报告不代判。
- **坏 key / 模式零访问**：坏 JSON、version 2、schema 不符、多余字段四类测试均保持原值，saveJobs 不写，reset 解除闩锁；八个非 normal 场景与 normal + 覆盖（两种）对两键 get / set / remove / clear 计数都为 0，包括旧 client reset。
- **R2-B**：工厂顺序为 scenario / override 各读一次 → 解析 → 建 state → 条件 hydrate，有测试在 getItem 回调中断言 state 已建好；没有加 guard。AgentClient 侧（T-A18）仍在后续。
- **R2-E**：新增读、reset、写都用 `jobState.getJobScenario()`；v1 十个方法的工厂闭包行为未改。
- **S-38 / S-40**：均已有断言（`converge-batch3.md` §4）。
- **R-A / R-C / R-E / R-F / R2-A / R2-C / R2-D**：本批未处理，未冒称关闭。R-D ②⑤ 已由写方法按构造保持，①③④ 仍归后续。
- **T-A17 只读门 / 定稿 / Agent 隔离**：未完成，本批只有 §4.6 既有规则的入口查询（`writableJob`）。
- **S-31（tasks §7）**：本批唯一已接入 UI 层的写路径是 `useJobsStore().createJob`，成功后恰一次 refresh、失败不刷新，有定向断言。其他 DataClient 写 API 目前没有 store / UI 调用方（只读 grep 核实），写后 refresh 由 T-C01 / C02 / C03 / B05 / G04 接入时逐条核对。**不能据此声称全部写管线已交付**，这也不是本批缺口。
- **观察项**（交第三批 Review 判定，不是缺口）：O-B3-1～O-B3-6，见 `converge-batch3.md` §5。

### 5. 状态回写与结构复核（tasks §1-8）

- **状态**：四个任务的状态行改为“**已实施（batch3，待第三批独立代码 Review；不表示 AC 最终验收）**”，附固定 commit、test-fix、逐命令结果与失败留痕，**不写“已完成 / 已验收”**。前两批 16 项的状态行不改。
- **页首**：新增“当前实施进度（Converge batch3）”块，写明 20 / 67 已实施、47 未开始、下一可起步任务。r6.6 块标为历史原文。
- **结构复算**（脚本作用于本轮 tasks 与 HEAD `0032fc6`）：
  - 67 个任务、编号唯一、排序正确；102.0 h（A 28 / 43、B 7 / 10.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）。
  - 完成标准 / 命令 **224 / 224**，problems = []；依赖无环；AC 矩阵 46 行，部分前置均为祖先，双向一致；第三批命令 19 条、7.0 h。
  - 两份结构日志的差异**只有**状态计数（16 × 已完成 / 51 × 未开始 → 16 × 已完成 / 4 × 已实施 / 47 × 未开始）和集合打印顺序。
- **逐任务文本比对**：预计 / 依赖 / 每条标准 / 每条命令，以及 §5～§7 全文均**无差异**（`converge-r13-std-cmd-diff.log` = “NO DIFF”）。`git diff` 的 hunk 只落在页首块、四个状态行和三处【r6.7】注。
- **下一可起步**（`converge-ready.py`，以 20 项计入）：T-A14 / T-A15 / T-A16、T-B01、T-C01。

### 6. 上游与 H-x

- **上游**：main `072bb12` 不在本树祖先，继续 pin `90187f7`。R2-D 同步流程不变，不新增人工门；本会话不写 v2 树。
- **H-2·列表**：提供任务 T-A01 / A02 / A10 / A12 / A22a 已齐。① 当前 `0032fc6`；② 当前有效 R9 `ab742f5`；③ `jobs-store.spec.ts -t "WI H-2 …"` 5 / 4 / 7 / 9 pass（实施者执行，待本批 Review）；④ 缺 → 待消费方集成（未交付）。
- **H-6**：T-A11 已提供覆盖只在内存 / normal 持久化，仍缺 T-A21，未交付。
- **H-5 / 页面切片**：未做。
- **H-1 / H-2·标签 / H-3 / H-4**：历史生产方证据保留，当前有效 Checklist 可并记 R9；④ 仍缺，不代填。

### 7. 结论（Analyze R13，当前索引）

- **一致性**：在第三批范围内，spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 真实代码**无冲突**；实施定形差距已按精度同步，没有需要回 Clarify 的歧义。R12 / R12.1 / R12.2 的开工前结论按当时原文保留。
- **本批**（4 项）：**已收口、待第三批独立代码 Review**。
- **feature**：**未收敛**（47 项未实施 + H 组外部阻塞）；46 AC 最终验收 0。
- **不是** Review 通过、Gate 2 或 Handoff；H-x 无一“已交付”。

---

## Analyze R14（只读；第三批代码 Review 后的 R3-A Converge 补修登记 r6.8，2026-10-29；当前索引，R13 历史保留；区别于 Checklist R9，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：Converge 补修任务登记 / Plan 精度 + 本分析；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a1873f-2338-7718-8e99-6609b56b7a8a`）。
> - **通道**：`claude-bridge` 本窗口已明确 quota / rate 限额，按 AGENTS §6 规则 2 / 5 不重复试；官方通道成功。只换通道、不换模型，未改 provider / key / 路由 / 全局配置。
> - **派工**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter 的代码 / 集成授权在既有 tasks 范围内持续有效，本轮不新增人工授权。
> - **性质**：只读报告，不勾选 checklist。当前有效审核 = **Checklist R9**（`ab742f5`，本树 `checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`，未改）。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-converge-batch3`（`docs/workbench-interaction-batch3-converge`，HEAD `49edb7ebf7bd0fdb0ab9ea0767c33945b39e13cf`，起始 clean）。只写 plan / tasks / analyze / implementation-log / interface-handoff 与 `specs/README.md` 本 feature 行。
> - **未改动**：代码 / 测试 / fixture / spec / checklist / 原 Review 原件（`review-batch3.md` 等）/ 各 converge 文件 / 根 HANDOFF / 权威 docs / 其他 worktree。
> - **未执行**：未 commit / push / merge；未安装；未启动服务或子 agent；**未运行任何产品测试**。
> - **只读脚本与日志**（非项目产物，不清理共享 tmp），在 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/` 下：
>   - `cache-fix-plan-struct.py`：由 `analyze-r12-struct.py` 派生，只把任务号正则扩到 `[abc]` 后缀，并把批次统计对象改为 T-A22c。输出 `cache-fix-plan-structure.log`（本轮 tasks）与 `cache-fix-plan-structure-HEAD.log`（`49edb7e`）。
>   - `cache-fix-plan-stdcmd.py` → `cache-fix-plan-std-cmd-diff.log`。
>   - `cache-fix-plan-ready.py`（以 20 项已完成计入的下一可起步）。

### 1. 重新读取与输入

- **工作流与权威**：AGENTS.md（§2 第 7 / 9 / 10 步、§5、§6）、`docs/plan.md`。
- **本 feature**：冻结 spec.md（AC-001-1 / 001-2 / 001-4 / 009-1）；plan.md §2.3（含 r6 / r6.6 / 写后统一刷新）；tasks.md 页首、§1、§2a H-2·列表、T-A22a 全文（含【r6.6】【r6.7】）、T-A22b、T-B01 / T-B02 / T-B04、§5～§7；checklist R9（只读）；本报告 R13；implementation-log 页首 / §7 / §8 / §10；interface-handoff 页首 / §1 / §2 H-2 行 / §3。
- **审核原件**：`review-batch3.md`（`49edb7e`）全文，重点 §0、§1、§4 探针 P1 / P2 / P3、§5 R3-A 的两种最小方案（a）/（b）与 O-R3-2、§6、§8。原 Review 结论（本批通过，0 P1 / P2，3 P3）只引用、不改写、不再找模型重判。
- **真实代码**（本树 frontend = `0032fc6`，只读）：`frontend/src/jobs/stores/jobs.ts`、`frontend/tests/unit/jobs/jobs-store.spec.ts`。

### 2. 源码事实（`0032fc6`，只读，精确到行）

- **初始状态**（`jobs.ts:11-15`）：`jobs=[]`、`listStatus='idle'`、`listError=null`、`filter=null`、`filteredJobs=null`。
- **`ensureJobs()`**（`:17-19`）：只在 `listStatus==='idle'` 时调 `refresh()`。
- **`refresh()`**（`:21-33`）：没有数据且不是 ready 时才置 loading；先 `listJobs()` 写 `jobs`，`filter` 非 null 再 `listJobs(filter)` 写 `filteredJobs`；成功 ready + 清错，失败 error + `listError`，两缓存保留。
- **`applyFilter(value)`**（`:35-49`）：先写 `filter`；`null` 时置空 `filteredJobs` 后返回，**不碰读状态**。非 null：成功写 `filteredJobs`（`:42`），并**写 `listStatus='ready'`（`:43`）与 `listError=null`（`:44`）**；失败写 `listError` 并置 error（`:46-47`），`filteredJobs` 保留。
- **测试**：`jobs-store.spec.ts:215-234` 的 “filter read errors resolve and retain both caches; the next filter read clears the error” 在 `:232-233` 断言切回 normal 后筛选成功会清错、回 ready，即固定了 `:43-44` 的行为。其余 `applyFilter` 成功都发生在 `ensureJobs()` 已 ready 之后（`:46`、`:151`、`:177`、`:192`、`:256`、`:270`、`:352` 起各例），删掉 `:43-44` 后这些例的状态断言不受影响。
- **筛选读状态的精确起点**（方案 b 之后，不是二选一）：全新 store 上 `applyFilter(f)` 成功后为 `filter=f`、`filteredJobs=listJobs(f)`、**`listStatus='idle'`、`listError=null`**、`jobs=[]`。随后 `ensureJobs()` 读调用依次为 `[f]`（筛选）、`[]`、`[f]`（refresh），终态 ready。base 已为 error 时，筛选成功后仍是 `error` + 原 `listError`，只有显式 `refresh()` 才回 ready。

### 3. 差距判定

| # | 事实 | 判定 |
|---|---|---|
| G-8 | T-A22a【r6.6 精度】原文是“`applyFilter(f)` **只写** `filter` / `filteredJobs`，失败口径同上”；plan §2.3 r6 与 interface-handoff §2 ① 把 `listStatus` / `listError` 写成**未筛选列表缓存**的读状态；`ensureJobs()` =“仅首次加载” | `0032fc6:43-44` 越出了已审设计。r6.7 当时把它登记为“沿用 refresh 成功口径（O-B3-4，交 Review）”，Review 判为 P3 R3-A，**不接受“未规定”**。这是实现与已审设计的差距，**不是需求变更** |
| G-9 | A 给出两种最小修复：(a) 成功分支只在非 idle 时置 ready / 清错；(b) 删去两行，只写两字段、错误只由 `refresh()` 清 | 集成人取 **(b)**：它与 r6.6“只写”原文逐字一致，不保留“筛选成功也清 base 错误”（即 P2 洗白），也不引入以 idle 为条件的分支。本报告只按 (b) 落定，不留“二选一” |
| G-10 | 方案 (b) 下，筛选失败造成的 error 也须显式 `refresh()` 清除（筛选成功不再清） | 这是“共享读状态、只由 refresh 恢复”的直接后果，与 S-38 既有口径一致：error 下 `ensureJobs()` 不重试、显式 refresh 恢复。T-B01 的错误重试本来就调 `refresh()`（tasks T-B01 修改范围），重读未筛选列表与当前筛选。不新增筛选专属状态（AGENTS §5.1） |
| G-11 | 筛选失败后 `filter` 已更新、`filteredJobs` 仍是旧结果（P3 / O-R3-2） | plan 原设计“已有数据保留”的直接后果，mock 下不可观察。按 A 建议只写精度（plan §2.3【r6.8】），不加 rollback / 锁 / 请求序号 |
| G-12 | R3-A 要求在 T-B02 / H-2 ④ 之前关闭；原件给出两种落点：“≤ 0.5 h 小任务”或“并入 T-B02 修改范围” | 集成人决定现在修，因此按 AGENTS §2 第 9 步追加独立任务，不并入已完成的 T-A22a（不改写已审任务），也不并入 T-B02 UI（避免把缺口藏进未来任务） |

### 4. r6.8 落点

- **tasks**：
  - 新增 **T-A22c**（0.5 h，依赖 T-A22a，位于 T-A22b 后、T-A23 前），3 条标准 ↔ 3 条命令：
    - 标准 1 ↔ 命令 1：`-t "WI H-2 list status"`，新增两例回归（P1 / P2 两条路径）。
    - 标准 2 ↔ 命令 2：整文件 `jobs-store.spec.ts`，原四组与 S-38 回归，以及按精度改断言的那一例。
    - 标准 3 ↔ 命令 3：typecheck、lint 与 `contract --check`。
    - 标准引用 AC-001-1 / 001-2 / 001-4 部分前置与 AC-009-1 工程门。命令都限定 `tests/unit/jobs/` 路径与 `WI` 标题。
  - **依赖**：T-B02 增依赖 T-A22c（R3-A 原件点名）。T-B01 也增依赖 T-A22c，理由见 §5。
  - **其他位置**：§2a H-2·列表加 T-A22c；§5 矩阵三行加 A22c；§6 加 r6.8 一条，并改排序规则、主干、UI 与 H-x 句。
  - **状态**：T-A11 / A12 / A13 / A22a 回写为已完成（`49edb7e`），原状态原文保留；T-A22a 的“待 Review 核对”后接 Review 判定，修改范围加【r6.8】，r6.7 原文保留；T-C03 / T-A17 / T-G04 状态行加 R3-B / R3-C 的阅读提示。
  - **页首**：新增 r6.8 块，batch3 块标为历史原文。
- **plan**：页首 r6.8 条；§2.3 一条【r6.8 精度】，写明归属与恢复口径（O-R3-2 精度一并写入）。
- **implementation-log**：页首；§7 四行（batch3 Converge 提交、A Review、原件提交、本轮）；§8 第三批 P3 台账与观察；§11 T-A22c 派工准备。
- **interface-handoff**：页首；§1 H-2·列表行（提供任务、③ A 亲跑、① 待修、④ 不放行）；batch3 Review 后口径；§3 r6.8 接口精度（对外成员不变）。
- **README**：本 feature 状态行；跨 feature 交接行中 H-2·列表一句。
- **恢复原意而非新需求**：T-A22a 的标准 1 / 2 原本就要求“`ensureJobs()` 后 `jobs` 等于未筛选结果”与“`jobs` 保持未筛选全集”。T-A22c 只是在 filter-before-ensure 顺序下把它们固定下来。T-A22a 的标准与命令**不改字**。不新增需求、AC、公开成员、机制或流程；spec 不动，**不回 Clarify / Gate 1**。

### 5. DAG、矩阵与门槛

- **AC 祖先约束**：AC-001-1 的最终任务是 T-B01，AC-001-4 的最终任务是 T-B04（只依赖 T-B01），AC-001-2 的最终任务是 T-B02。T-A22c 的标准引用三者部分前置，§5 矩阵要求部分前置都是最终任务的祖先，所以 **T-B01 必须依赖 T-A22c**（B04 经 B01 继承）。语义上 T-B01 也是 `listStatus` / `listError` 的第一个页面消费者（挂载 `ensureJobs()`、错误态与重试），Review 要求 R3-A 在消费方接入前收口。T-B02 再按指令显式加 T-A22c（与经 B01 的传递依赖重复，无害）。
- **代价**：T-B01 原本可起步，现须等待 T-A22c（0.5 h）。若集成人更希望 B01 与 A22c 并行，替代做法是把 T-A22c 标准中的 AC-001-1 / 001-4 引用去掉、只保留 AC-001-2，这要再走一轮本文件修订。本轮按派工要求保留三个 AC 引用。
- **门槛**：
  - 有效 Checklist 仍为 R9，未改、不重勾。T-A22c 是已审 Review 明确要求的 Converge 补修：方案出自审核原件，不新增需求或机制，不需要重新设计 Checklist。
  - Implement 前置：集成人提交本 r6.8 文档。实施后由**新会话 A**（与实施异模型）做增量代码 Review，只核 R3-A 是否关闭；第三批其他结论保留。
  - H-2·列表：T-A22c 关闭前不放行 ④，① `0032fc6` 不作 ④ 的集成对象。
- **上游**：main `072bb12` 不在祖先，继续 pin `90187f7`；R2-D 流程不变。本轮未读写 v2 树。

### 6. 结构复算（脚本、只读，本轮 tasks 对比 HEAD `49edb7e`）

- 68 个任务，编号唯一，排序正确（T-A22b < T-A22c < T-A23）。合计 102.5 h：A 29 / 43.5、B 7 / 10.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4。T-A22c 为 0.5 h，在 0.5～2 h 粒度内。
- 完成标准 / 验证命令 **227 / 227**（HEAD 为 224 / 224；+3 全部来自 T-A22c），逐任务 1:1、编号连续，problems = []；依赖无环且全部前向。
- AC 矩阵 46 行；部分前置均为最终任务祖先（`PARTIAL-PREREQ NOT ANCESTOR` = []）；矩阵与任务 AC 双向一致（`BIDIR BAD` = []）；T-A22c 出现在 AC-001-1 / 001-2 / 001-4 三行。
- 状态：20 × 已完成、48 × 未开始（HEAD：16 已完成 / 4 已实施 / 47 未开始）。
- 命令路径：除 T-A09 命令 3 的三份 v1 契约测试（既有、已审）外，全部在 jobs 路径；`-t` / `-g` 命令 163 条、159 个不同标题（HEAD 162 / 158；+1 = `WI H-2 list status`）。整文件计数中的 2 处非 WI 标题是 §1 的 `<标题>` 占位符。
- **逐任务文本比对**（`cache-fix-plan-std-cmd-diff.log`）：差异只有 ① T-A22c 新增的预计 / 依赖、3 条标准与 3 条命令；② T-B01 / T-B02 依赖行；③ §5 三行；④ §6 四句改写与新增 r6.8 一条。**其他任务的预计、标准、命令均无变化**，T-A22a 的 5 条标准与 5 条命令不改字。
- **命令标题隔离**：新 describe `WI H-2 list status` 不含 `WI H-2 cache` / `filter` / `createJob refresh` / `agent refresh` 子串，T-A22a 命令 1～4 的匹配集合不扩大；命令 2 `WI H-2 filter` 仍为 4 例，其中 1 例按 r6.8 改断言。§2a 的 `-t "WI H-2"` 会包含新 describe，这正是 H-2·列表 ③ 需要的。
- **下一可起步**（`cache-fix-plan-ready.py`，以 20 项计入）：T-A14 / T-A15 / T-A16、**T-A22c**、T-C01；T-B01 须待 T-A22c。

### 7. 观察项与未解决项

- **R3-A**：修复任务已登记、待实施 / 待 A 增量复核，代码未修，**不得写成“已修”**。H-2·列表 ① `0032fc6` 仍待修，不放行 ④。
- **R3-B**（→ T-C03 / T-A17）、**R3-C**（→ T-G04）：未修，未经 Walter 风险接受；只在任务状态行加阅读提示，不新增标准。
- **O-R3-1**（→ T-A20 / T-B05 核）、**O-R3-3**（→ T-G06）：不处理；O-R3-2 已写入 plan 精度。
- **前两批 P3**（R-A～R-F、R2-A～R2-E）：状态不变（implementation-log §8）。
- **外部 / 流程**：H 组 v2 外部闸门；各切片 ④ 待 v2 所有者登记；main `072bb12` 同步决策；本树文档待集成人审阅提交。

### 8. 结论（Analyze R14，当前索引）

- **一致性**：spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 审核原件 ↔ 真实代码，在 R3-A 范围内**无未登记冲突**。实现与已审设计之间的差距（G-8）已由 T-A22c 登记为待修；方案 (b) 恢复 r6.6“只写 `filter` / `filteredJobs`”的原意，**不回 Clarify**。
- **任务 / 标准 / 命令 / 门槛**：T-A22c 3 ↔ 3，命令限定 jobs 路径与 WI 标题，标准引用 AC-001-1 / 001-2 / 001-4 部分前置与 AC-009-1；DAG 与 AC 祖先一致；Checklist R9 不变；实施后由新会话 A 增量代码 Review。
- **进度**：68 个任务 / 102.5 h；20 已完成、48 未开始（含 T-A22c）；46 AC 最终验收 0；feature **未收敛**（48 项未实施 + H 组外部阻塞）。
- **不是** Review、Gate 2 或 Handoff；H-x 无一“已交付”。

---

## Analyze R15（只读；T-A22c 实施后的增量 Converge 配套分析，2026-10-29；当前索引，R14 历史保留；区别于 Checklist R9，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：增量 Converge / 进度登记 + 本分析；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18755-53bb-72b4-87fa-bcc8b067eba0`）。
> - **通道**：`claude-bridge` 本窗口已明确 quota / rate 限额，按 AGENTS §6 规则 2 / 5 不重试；官方通道成功。只换通道、不换模型，未改 provider / key / 路由 / 全局配置。
> - **派工**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。
> - **性质**：只读报告，不勾选 checklist。当前有效审核 = **Checklist R9**（`ab742f5`，本树 blob `74084c1337491a042c944096e1f290fe07aab324`，未改）。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-converge-batch3`（`docs/workbench-interaction-batch3-converge`，HEAD `af24c826f41580d27f90ce611fb2f55fec44acbf`，起始 clean）。只写 tasks / analyze / implementation-log / interface-handoff、新建 `converge-batch3-cache-fix.md`，以及 `specs/README.md` 本 feature 两行。
> - **未改动**：代码 / 测试 / spec / plan / checklist / 原 Review 原件 / 原 Converge 报告 / 根 HANDOFF / 权威 docs / 其他 worktree。
> - **未执行**：未 commit / push / merge；未安装；未启动服务或子 agent；**未运行任何产品测试**。
> - **只读脚本与日志**（非项目产物，不清理共享 tmp），在 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/` 下：
>   - 沿用 `cache-fix-plan-struct.py`，输出 `cache-fix-converge-structure.log`（本轮 tasks）与 `cache-fix-converge-structure-HEAD.log`（`af24c82` 上的 tasks，副本 `cache-fix-converge-tasks-HEAD.md`）；
>   - 沿用 `cache-fix-plan-stdcmd.py` → `cache-fix-converge-std-cmd-diff.log`；
>   - `cache-fix-converge-ready.py`（以 21 项已实施计入）→ `cache-fix-converge-ready.log`。

### 1. 重新读取与输入

- AGENTS.md（§2 第 7 / 9 / 10 步、§5、§6）、`docs/plan.md`。
- 冻结 spec（AC-001-1 / 001-2 / 001-4 / 009-1）；plan 页首与 §2.3【r6.8】；tasks 页首 r6.8 块、§2a、T-A22a、T-A22c、T-B01 / T-B02、§5 / §6；checklist R9（只读）；本报告 R14。
- `review-batch3.md`（`49edb7e`）R3-A、P1 / P2 / P3、O-R3-2、§8。
- implementation-log 页首 / §7 / §8 / §11；interface-handoff 页首 / §1 / §3。
- `git show e7716a8`（含 commit body 的排期决定）；`git diff e7716a8 af24c82` 全文；`af24c82` 上两个文件的完整内容。
- 实施者回报 `astra-cache-fix-result.md` 与其会话日志（只读核对红 → 绿与命令输出），不代替代码阅读。

### 2. 本轮范围与结论

| 项 | 结果 |
|---|---|
| 范围 | 仅 T-A22c（0.5 h）。代码 `e7716a8..af24c82`：2 个文件，+67 / −3；`--name-status` 只有两个 `M`；`git diff --check` 通过 |
| 代码 ↔ 标准 | 3 / 3 有对应实现与测试（逐条见 `converge-batch3-cache-fix.md` §2） |
| 命令结果 | **实施者执行、本会话未重跑**：命令 1 = 2 pass；命令 2 = 27 pass（原四组 25 + 新 2；`WI H-2 filter` 仍 4）；命令 3 = typecheck / lint / `contract --check` 24 / 10 / 2。回归：全量 31 / 953 / 0、六守卫、shell + agent E2E 24 |
| 失败留痕 | 修复前命令 1 为 2 fail（`ready`≠`idle`、`ready`≠`error`），准确复现 P1 / P2；删两行后通过 |
| 所有权 | 只动 tasks 授权的两个文件；`main.ts`、契约 / 生成物、其他 jobs 源 / 测试、spec / checklist 均零差异 |
| 规格差距 | 无。不需要 r6.9，plan / tasks 设计文本不改 |
| 新增任务 / 需求 | 无 |
| 本任务判定 | **增量已收口，待独立 A 增量 Review**；R3-A = 代码已修、待复核（本报告不判关闭） |
| feature 判定 | **未收敛**：21 / 68 已实施（20 已完成 + 1 待定向 Review）、47 未开始；46 AC 最终验收 0 |

### 3. 排期决定的登记口径

`e7716a8` 的 commit body 记录：集成人接受 T-B01 依赖 T-A22c（AC-001-1 / 001-4 的祖先覆盖）。R14 §5 曾把它列为待集成人确认的代价；现已确认，**属于任务排期，不是新的产品需求或人工门**。tasks 中的依赖原样保留，不再列为待决项。

### 4. 状态回写与结构复核

- **状态回写**：
  - T-A22c 状态行改为“已实施（待定向 Review …）”，附 commit、逐命令结果、失败留痕与回归，“未开始”留作原文。
  - T-A22a 状态行只追加一句指向 T-A22c；标准、命令与 r6.7 / r6.8 原文都不改。
  - tasks 页首新增“T-A22c 实施后增量 Converge”块，r6.8 块标为历史原文。
- **结构复算**（本轮 tasks 对比 `af24c82`）：
  - 68 个任务、编号唯一、排序正确；102.5 h（A 29 / 43.5、B 7 / 10.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）。
  - 完成标准 / 命令 **227 / 227**，problems = []；依赖无环、全部前向；T-A22c ← T-A22a，T-B01 / T-B02 含 T-A22c。
  - AC 矩阵 46 行；`PARTIAL-PREREQ NOT ANCESTOR` = []；`BIDIR BAD` = []；T-A22c 仍在 AC-001-1 / 001-2 / 001-4 三行。
  - 状态：20 × 已完成、1 × 已实施、47 × 未开始（HEAD：20 / 0 / 48）。
  - 两份结构日志的差异只有三处：
    1. 状态计数；
    2. 集合打印顺序；
    3. 全文 `-t` / `-g` 出现次数 217 → 218（WI 215 → 216）。第 3 处是 T-A22c 状态行里引用了 `-t "WI H-2 filter"` 的补充结果，属于说明文字，不是新命令；任务命令仍为 163 条、159 个不同标题。
- **逐任务文本比对**（`cache-fix-converge-std-cmd-diff.log`）：预计 / 依赖 / 每条标准 / 每条命令，以及 §5～§7 全文均 **NO DIFF**。
- **下一可起步**（`cache-fix-converge-ready.py`，以 21 项已实施计入，沿用 batch3 “已实施即计入依赖”的口径）：T-A14 / T-A15 / T-A16、T-B01、T-C01。`review-batch3.md` §8 要求 R3-A 在 T-B02 / H-2 ④ 之前关闭；T-B01 是否等 A 复核后再派，由集成人决定。

### 5. H-x 与上游

- **H-2·列表**：
  - ① 候选 `af24c82`（T-A22c，祖先含 `0032fc6`），待 A 增量复核；
  - ② R9 `ab742f5`；
  - ③ `WI H-2 list status` 2、整文件 27（原四组 25）pass + 工程门（实施者执行，待 A）；
  - **④ 仍缺，T-A22c 复核前不放行**。生产方集成树 `integration/workbench-interaction` @ `af24c82` 只是旁证；`integration/frontend-workbench-v2` = `3f63273`，不含 `af24c82`（只读核）。
- **其他切片**：H-6 仍缺 T-A21；H-5 / 页面切片未做；H-1 / H-2·标签 / H-3 / H-4 保留原登记，仍待消费方集成（未交付）。
- **上游**：main `072bb12` 不在祖先，继续 pin `90187f7`；R2-D 流程不变。

### 6. 观察项与未解决项

- **R3-A**：代码已修、待新会话 A 增量代码 Review（固定审 `e7716a8..af24c82` 与本文档提交；只核 R3-A，第三批其他结论保留）。复核前不得写“已完成 / 已关闭”。
- **R3-B**（→ T-C03 / T-A17）、**R3-C**（→ T-G04）：未改，未经 Walter 风险接受。
- **O-R3-1 / O-R3-3**：不变；O-R3-2 仍只是 plan 精度。
- **前两批 P3**：状态不变（implementation-log §8）。
- **外部 / 流程**：各切片 ④ 待 v2 所有者登记；H 组 v2 外部闸门；main 同步决策；本树文档待集成人审阅提交。

### 7. 结论（Analyze R15，当前索引）

- **一致性**：在 T-A22c 范围内，spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 审核原件 ↔ 真实代码**无冲突、无差距**。spec 46 AC 不改，不回 Clarify。
- **任务**：T-A22c 已实施，3 / 3 标准有证据（实施者执行），增量已收口、**待独立 A 增量 Review**。
- **进度**：68 个任务 / 102.5 h；21 / 68 已实施（20 已完成 + 1 待定向 Review）、47 未开始；227 / 227；DAG 与 46 行矩阵不变；46 AC 最终验收 0；feature **未收敛**。
- **不是** Review、Gate 2 或 Handoff；H-x 无一“已交付”。

---

## Analyze R16（只读；第四批 T-B01 / T-B02 / T-A22d / T-B04 / T-B03 开工前机制精度 r6.9 之后，2026-10-29；当前索引，R15 及更早轮次历史保留；区别于 Checklist R9 / R10，**不是**审核结论）

> **阶段记录（脱敏）**：
> - **角色与模型**：Plan / Tasks 机制精度 + 本分析；实际模型 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a187b5-a3e7-75a6-a499-74d51c9f9bbd`）。
> - **通道**：`claude-bridge` 已由本协调窗口确认 quota / rate / spend_limit 耗尽，按 AGENTS §6 规则 2 / 5 不重试；本批官方通道最小真实调用 exit 0（协调器探活；本作者收尾时只读核对本批 Temp 的 `probe-opus-summary.json`：`anthropic/claude-opus-5-5`、exit 0、category success、bridge not retried）。只换通道不换模型，未改 provider / key / 路由 / 全局配置。
> - **派工**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter“允许”的代码 / 集成授权在既有 tasks 内持续有效；最新“继续”是继续指令，本轮不再询问授权。
> - **性质**：只读报告，不勾选 checklist。最近有效审核 = **Checklist R9**（`ab742f5`，本树 `checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`，未改）。r6.9 **未经审核**，须独立 A 做 Checklist R10 定向复核。
>
> **写入与执行边界**：
> - **可写范围**：唯一可写 worktree `D:/2030/Futures-AI-interaction-plan-batch4`（`docs/workbench-interaction-batch4-plan`，HEAD `6ba2a155d85d7495014eb5c2faff36cd542d3288`，起始 clean；frontend 与 `af24c82` 零差异）。只写本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff 与 `specs/README.md` 本 feature 行。
> - **未改动**：代码 / 测试 / fixture / spec / checklist / 旧 Review / converge 原件 / 根 HANDOFF / 权威 docs / 其他 worktree。
> - **未执行**：未 commit / push / merge；未启动服务或子 agent；**未运行任何产品测试**。
> - **只读脚本与日志**：均在 `C:/Users/iswal/AppData/Local/Temp/wi-batch4-01a18388-nzh9q1wh/prepare-*`，非项目产物，不清理共享 tmp。
>   - `prepare-struct.py`：由上批 `cache-fix-plan-struct.py` 派生，只做三处改动：任务号正则扩到 `[abcd]` 后缀；把“编号非前向”的依赖改记为 `BACKEDGES` 并另做环检测，不再当作 problem；批次统计对象改为本批 5 项。上批脚本中的“全部前向”假设没有被复制成隐藏依赖。
>   - 输出 `prepare-structure.log`（本轮）、`prepare-structure-HEAD.log`（`6ba2a15`）。
>   - `prepare-stdcmd.py` → `prepare-std-cmd-diff.log`；`prepare-ready.py`（以 21 项已完成计入）。

### 1. 重新读取与输入

- **工作流与权威**：AGENTS.md（§2 第 4～8 步、§3、§4、§5、§6）；`docs/designUI.md` §2.4 / §3.3 / §6；设计资产 `design/ui/UI_COLORS.md#status_colors` 与 `UI_COMPONENTS.md` 状态徽一节（状态不用绿；sample 须配虚线与「样例」文字；bad 只作非文字提示）；`docs/interaction.md` §7 界面映射行。
- **本 feature**：冻结 spec v1.1 全部 46 AC（重点 R-001 / R-002，AC-001-1～5、AC-002-1 / 2、AC-007-3）；plan 页首、§1、§2.1～§2.4、§5；tasks 页首、§0、§1、§2a、§3、T-A22a / A22b / A22c / A23、T-B01～T-B07、§5～§7；checklist R9（只读，26 / 26）；implementation-log 页首 / §8 / §13；`review-batch2.md` §4 R2-C；`review-batch3.md`；`review-batch3-cache-fix.md`；interface-handoff 页首 / §1 / §3。
- **真实代码**（本树 frontend = `af24c82`，只读）：
  - 源码：`jobs/{routes.ts, stores/jobs.ts, stores/session.ts, pages/*.vue, components/*.vue}`、`main.ts`、`contracts/{client.ts, index.ts, types.ts（Label / Job / CreateJobInput / StageWorkspace / ContractError）, mock/index.ts（readJobState）, mock/job-state.ts（getJob / getStageWorkspace / findJob）}`、`shared/components/{Badge, ErrorState, EmptyState, Loading}.vue`、`design/generated/tokens.css`、`app/Rail.vue`（当前项样式）。
  - 测试：`tests/unit/jobs/{jobs-store, routes}.spec.ts`、`tests/component/jobs/badges.spec.ts`、`tests/component/{focus-band, modules, timeline}.spec.ts`（harness 先例）、`vitest.config.ts`、`scripts/check.mjs`（glass 正则）。
  - fixture：`fixtures/jobs/jobs.json`。

### 2. 源码事实（`af24c82`，只读）

- **三个徽标**：根 class 的样式都是 `border: thin solid var(--fai-status-ok)`，无状态分支。文字色：JobStatus / Artifact 为 `--fai-text-secondary`，Source 为 `--fai-text-primary`。shared `Badge.vue` 以 `[data-badge='warn' | 'bad' | 'sample']` 改 `border-color`，sample 另加 dashed。
- **令牌**：`--fai-status-ok` = `#6CA7C7`（蓝），warn = 琥珀，bad = 点睛红，sample = 辅助灰（= text-muted）。中性边 `--fai-glass-module-border` 已被 `ErrorState` 按钮使用；`check --only glass` 的正则因 `(?<![\w-])` 不会把 `--fai-glass-module-border` 当作玻璃类。
- **页面**：`JobListPage.vue` / `JobDetailPage.vue` 仍是 T-A22 骨架，无创建入口、无数据。
- **jobsStore**：只有列表成员与 `ensureJobs` / `refresh` / `applyFilter` / `createJob` / `receiveAgentEvent`；`refresh` 单一 try，捕获后 resolve；store 经模块级 `dataClient`（`contracts/index.ts`）读取。
- **读方法语义**：`getJob` 未知 id → not_found（retryable=false）；empty 预置 id → null；error 场景对已知目标 → adapter_error（retryable=true）。`getStageWorkspace` 对 empty 预置 id 返回空工作区。
- **`CreateJobInput`**：strict；title / subject 由 trim 变换后保存，subject 仅空白会被拒，所以表单须先把空白主题映射为 null；goal 可为 `''`。
- **测试 harness 先例**：
  - 系统边界透传 spy：jobs-store.spec `connect()`、focus-band.spec。
  - 真实 memory router：timeline.spec 用 `appRouter.options.routes`。
  - SFC 样式断言：modules.spec 的 `styleRule`（`?raw` + `CSSStyleSheet`）。
  - clipboard 复制诊断：focus-band.spec。
- **`routes.spec.ts`**：只做 `router.push` 与解析，不挂载页面组件，因此页面开始导入 store / contracts 后不需要 Pinia。jobs-store.spec 已证明在 vitest 中导入 `contracts/index.ts` 无副作用问题。

### 3. 精度项逐条判定（最小设计 / 真实风险 / 范围）

| # | 最小设计（r6.9） | 真实风险（不加时会怎样出错） | 范围 / 判定 |
|---|---|---|---|
| P-1 R2-C | ok / warn / bad 映射既有 `--fai-status-*`，中性 = `--fai-glass-module-border`，SourceBadge 中性；以根 `data-status` + 属性选择器实现，沿用 shared Badge 写法；不用 sample；文字色不变 | failed / conflict / quarantined 现带 ok 边框，语义反向，M-01 人工验收可能判“视觉语义错位”（R2-C 原文） | 归 T-B01（原 Review 给出的“首个消费页面”归属），1.5 → 2 h，+1 标准 / 命令；不新增色值 / 令牌 / schema / 枚举 / TS 映射 / helper。**精度，不是需求变更** |
| P-2 B03 挂载点 | 允许在 `JobListPage.vue` 挂“新建作业”按钮 + 内联面板；表单 subject 空白 → null、goal 可 `''`、type 无默认；成功经既有 `createJob`（一次 refresh）后 push `/jobs/:id/collect`；失败显示原错误的 `ErrorState` | 原修改范围只列 `JobCreatePanel`，而骨架页没有入口，实施者必须越权或猜测；仅空白的 subject 原样提交会被契约拒绝 | 只写 tasks 范围；不新增取消作业 / 锁 / 遮罩 |
| P-3 B03 ↔ B04 | B03 依赖 B04，执行顺序 B04 先于 B03，保留编号 / 标准 / AC。编号前向检查记 1 条有意回边，环检测无环 | 原 B03 端到端要核对详情页回显，但详情页由 B04 提供；按原顺序 B03 无法真实通过，只能删覆盖或伪造回显 | 依赖变化同步进矩阵：AC-001-3 部分前置加 B04，B04 标准 1 引用 AC-001-3 部分前置（详情头）。冻结 AC 不变 |
| P-4 详情视图缓存 | 成员、`openJob(jobId, stage | null): Promise<Stage | null>`、私有锚、换作业才置 loading、job=null 不读工作区、失败 resolve null；`refresh` 独立 try 重读锚，不回 loading、不改写列表读状态；离开不清锚；URL 为查看阶段唯一来源，缺省 / 未知 → replace 一次；Rail 区分业务 currentStage（`aria-current="step"`）与查看（`aria-pressed`） | 原 plan 只有 `currentJob` / `currentStageWorkspace` / `openJob(id, stage)` 三个名字。实施者须自行决定 loading / error 字段、缺省 stage 如何拿 currentStage、刷新锚、详情错误会不会污染已审的 H-2 列表读状态（R3-A 刚关闭）、“当前阶段高亮”指哪一个 | 落为新任务 **T-A22d**（1 h）。原 T-B04 已到 2 h，加入 store 单测与确定字段后已知超额，按 Checklist R8 B-12 先例在 Tasks 阶段拆分，不用“超 2 h 再停”兜底。不新增 `closeJob` / 请求序号 / 锁 / guard / 轮询 / 总线 / setter / fallback。缺省 stage 路径多读一次、离开后刷新仍读旧锚，都显式登记为可接受代价 |
| P-5 harness / 回归 | `jobs-store.spec.ts` 只新增三组，原 27 例与 helper 不改；badges.spec 只新增一组；`routes.spec` / `session-context.spec` 不改，预计无需维护，失败即停报；新 e2e 不改 playwright 配置；B03 端到端只读 `fai.jobs.v1` | 写权限不明会导致实施者停下（r6.6.1 / r6.6.2 先例），或改既有断言来讨绿 | 只写 tasks / §14 |

**需求是否变更**：五项都在 spec R-001 / R-002 / R-009 与 plan §1 / §2.1～§2.3 的既有意图内，补的只是机制、字段名、文件许可与执行顺序。详情头字段（标题 / 类型 / 状态 / subject / goal）来自 spec §2“作业列表与详情（类型、状态、当前阶段、创建者、目标说明…）”与 AC-001-3 的回显需要；createdBy 因契约没有展示映射而不显示，不新建映射。**不回 Clarify / Gate 1**，spec 与 46 AC 不变。

### 4. 一致性（spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 代码）

- **plan ↔ tasks**：plan §1【r6.9】映射表与 T-B01 修改范围逐值一致；plan §2.1【r6.9】与 T-B04 一致；plan §2.3【r6.9】与 T-A22d 一致（成员、签名、loading / 失败 / 锚 / 离开口径）。
- **与已审口径**：
  - plan §2.3【r6.8】“`listStatus` / `listError` 只由 `refresh()` 列表块置 ready / 清错”不变；T-A22d 的详情块只写详情字段。
  - S-38 “读失败落在视图状态、自身 resolve” 扩展到 `openJob`。
  - §1-9 写后统一刷新不变（`createJob` 仍恰一次 `refresh()`，该次自动带上详情）。
- **interface-handoff**：交接成员与签名不变；新成员登记为内部（§3 r6.9 段）；H-2·标签 props 不变，① 是否随 B01 更新交集成人。
- **代码**：方案所需的组件 / 令牌 / harness 均已存在于 `af24c82`；不需要改 `shared/**` / `app/**` / 契约 / 生成物。

### 5. 本批任务 1:1（标准 ↔ 命令，均带 jobs 路径与 WI 标题）

| 任务 | 标准 → AC | 命令 |
|---|---|---|
| T-B01 | 1 AC-001-1 最终；2 AC-001-4 列表侧；3 R2-C → AC-001-5 部分前置；4 工程门 + badges 整文件 → AC-009-1 | 1 `job-list -t "WI AC-001-1"`；2 `-t "WI AC-001-4 list"`；3 `badges -t "WI badge tone"` + colors + glass；4 `badges` 整文件 + typecheck + lint |
| T-B02 | 1 AC-001-2 最终；2 工程门 | 1 `job-list -t "WI AC-001-2"`；2 typecheck + lint |
| T-A22d | 1 打开 → AC-002-1 / 002-2 部分前置；2 三态 → AC-001-4 部分前置；3 统一刷新 → AC-001-4 / 002-2 部分前置；4 整文件 + 工程门 → AC-009-1 | 1～3 `jobs-store -t "WI detail cache open / states / refresh"`；4 `jobs-store` 整文件 + typecheck + lint |
| T-B04 | 1 AC-002-1 最终 + AC-001-3 部分前置；2 AC-002-2 最终；3 AC-001-4 最终；4 工程门 | 原 4 条命令不改字 |
| T-B03 | 1 AC-001-3 部分前置（校验 + 契约拒绝）；2 AC-001-3 最终（e2e，读 `fai.jobs.v1` + 详情回显）；3 AC-007-3 部分前置 + 工程门 | 原 3 条命令不改字 |

合计 17 条命令（4 + 2 + 4 + 4 + 3），与 17 条标准逐条对应。

**标题隔离**：
- `WI badge tone` 不含 `WI status badges` / `WI source badge`，H-2·标签定向集合（18）不变。
- `WI detail cache *` 不含 `WI H-2`，H-2·列表定向集合（27）与 T-A22a / A22c 各命令的匹配集合不变。
- `-t "WI AC-001-4"` 同时匹配 `… list` 与 `… detail`，这正是 B04 命令 3 需要的。
- T-A22c 命令 2（`jobs-store.spec.ts` 整文件）今后的计数会大于 27，这是新增用例，不是回归。

### 6. 结构复算（脚本、只读，本轮 tasks 对比 HEAD `6ba2a15`）

- **任务与工时**：69 个任务，编号唯一，排序正确（T-A22c < T-A22d < T-A23）。合计 **104 h**：A 30 / 44.5、B 7 / 11、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4。本批 B01 2 / B02 1 / A22d 1 / B04 2 / B03 1.5，均在 0.5～2 h 粒度内。
- **标准 / 命令**：完成标准 / 验证命令 **232 / 232**（HEAD 227 / 227；+1 B01、+4 A22d），逐任务 1:1、编号连续，problems = []。
- **依赖**：环检测 `CYCLE False`；编号前向检查 `BACKEDGES = [(T-B03, T-B04)]`，是唯一的有意回边，已在 tasks 页首 / §6 / T-B03 状态行如实登记，不冒充全前向。
- **AC 矩阵**：46 行；`PARTIAL-PREREQ NOT ANCESTOR` = []；`BIDIR BAD` = []。
  - A22d 出现在 AC-001-4 / 002-1 / 002-2 三行；B04 出现在 AC-001-3（部分前置）及其最终的 001-4 / 002-1 / 002-2；B01 出现在 AC-001-1（最终）/ 001-4 / 001-5（部分前置）。
  - AC-001-5 的最终任务为 T-A23 + T-G10，B01 经 G10 → G09 → G06 → G03 → B03 → B01 成为其祖先。
- **状态**：21 × 已完成、48 × 未开始（HEAD 21 / 47）。
- **命令路径**：除 T-A09 命令 3 的三份 v1 契约测试（既有、已审）外，全部在 jobs 路径；`-t` / `-g` 任务命令 167 条、163 个不同标题（HEAD 163 / 159；+4 = `WI badge tone` 与 `WI detail cache open / states / refresh`；B01 命令 4 与 A22d 命令 4 为整文件运行、不带标题）。
- **逐任务文本比对**（`prepare-std-cmd-diff.log`）：预计 / 标准 / 命令的差异只在以下位置：
  - T-A22d 新增；
  - T-B01 预计、标准 1～4、命令 3 / 4；
  - T-B02 标准 1 追加【r6.9】；
  - T-B03 依赖与标准 1 / 2 追加；
  - T-B04 依赖与标准 1～3 追加；
  - §5 五行与标题；§6 三句改写 / 新增。

  **其他 64 个任务的预计 / 标准 / 命令无变化**；B02 / B03 / B04 的命令不改字。另外改了 tasks 页首、§2a 页面切片一格、T-A23 状态行阅读提示（不改其标准 / 命令）。
- **下一可起步**（`prepare-ready.py`，以 21 项计入）：T-A14 / T-A15 / T-A16、**T-A22d**、**T-B01**、T-C01。本批内部依次为 B01 → B02，A22d → B04（需 B01）→ B03。

### 7. 观察项与未解决项

- **R2-C**：已定归属与映射，**代码未修**；关闭由第四批代码 Review 判定。
- **已登记的可接受代价**（不加 guard，AGENTS §5.1）：缺省 stage 路径多读一次；离开详情后 `refresh()` 仍重读最近打开的详情；`resetMockData` 后若锚指向已消失的会话新建作业，会置 not_found（列表页不可见，再次打开即换锚），留 T-G04 接入时知悉。
- **T-B01 / T-B04 顶格 2 h**：实施中若超时，按 tasks §7 停下回报，不硬塞。
- **H-2·标签 ①**：B01 改了 `JobStatusBadge` 的样式，交接接口不变；① 是否更新由集成人决定，本报告不代填。
- **不在本批**：R3-B（→ T-C03 / T-A17）、R3-C（→ T-G04）及前两批未关 P3，均未经 Walter 风险接受；O-R3-1（→ T-A20 / T-B05）。
- **外部 / 流程**：H 组 v2 外部闸门；各切片 ④ 待 v2 所有者登记；main `072bb12` 不同步（R2-D 流程）；本树文档待集成人审阅提交。

### 8. 建议的 Checklist R10 定向复核范围（供独立 A；本作者不勾选、不预判）

1. **R2-C**：映射表是否只用既有令牌、是否符合 `UI_COLORS.md#status_colors`（状态不绿、sample 专用、红不作文字），SourceBadge 中性是否合理；`WI badge tone` 的样式断言是否测真实 SFC，而不是复写映射。
2. **详情视图缓存**：成员 / 签名 / loading 规则 / 失败口径 / 锚 / 离开不清锚 / 与 r6.8 列表读状态的隔离，是否构成新增机制或越出 AGENTS §5.1。
3. **URL 入口定型与 Rail 两种标记**：是否与 spec AC-002-1 / 002-2 和 plan §2.1 一致；缺省路径多读一次是否可接受。
4. **T-A22d 拆分**：工时 1 h 与 T-B04 2 h 是否合理（对照 R8 B-12 先例）；T-B03 → T-B04 有意回边是否如实登记，且不破坏 AC 祖先。
5. **写权限**：五任务许可是否最小、充分；harness 是否能真实运行（`routes.spec` 不需维护的判断）；B03 端到端是否无窗口钩子。
6. **结构**：标准 / 命令 1:1、232 / 232、46 行矩阵、69 / 104 h。

### 9. 结论（Analyze R16，当前索引）

- **一致性**：spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 真实代码，在第四批范围内**无未登记冲突**。五项精度都属既有需求内的机制、文件许可与执行顺序，**不回 Clarify**。
- **结构**：69 个任务 / 104 h；232 / 232；DAG 无环（1 条有意编号回边已登记）；AC 矩阵 46 行，祖先与双向一致。
- **门槛**：r6.9 **未审核**。须独立 A 新会话 Checklist R10 定向复核通过并由集成人提交后，才可派 Astra 开码；当前不得开码。R9 未改、未勾。
- **进度**：21 / 69 已完成、48 未开始；第四批 5 项全部待实施；46 AC 最终验收 0；feature **未收敛**（48 项未实施 + H 组外部阻塞）。
- **不是** Review、Gate 2 或 Handoff；H-x 无一“已交付”。本报告不宣称本批任何内容已测或已完成。

## Analyze R17（只读；第四批实施后 Converge batch4 配套分析，2026-10-29；当前索引，R16 及更早轮次历史保留；区别于 Checklist R10，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1880c-8385-70eb-96c3-75402937cefb`；`claude-bridge` 本协调窗口已确认 quota / rate / spend_limit，不重试；官方通道真实调用成功；未改配置）。本轮**没有运行任何产品测试**；测试数字全部来自实施者日志。只读脚本 `converge-struct.py`（由 Checklist R10 审核员自写脚本改为读取工作树并区分“已实施”状态）、`prepare-stdcmd.py` 及其日志 `converge-structure*.log`、`converge-std-cmd-diff.log` 在协调器 Temp，非项目产物。

### 1. 重新读取与输入

- AGENTS.md、`docs/plan.md`；冻结 spec.md（LF SHA256 `ed0f6c6c…942d9`，与历次一致，46 AC）；plan.md r6.9；tasks.md r6.9（五个任务完整修改范围 / 标准 / 命令、§1 / §2a / §3 / §5～§7）；checklist.md §R10（commit `37e2f71`，blob `4537c55f226f0bdc4f39b19e7c369731cf23abba`，LF SHA256 `53285183…a115b`；只读）；analyze R16；implementation-log §8 / §14；interface-handoff §1 / §3；Review 风险台账（R-A～R-F、R2-A～R2-E、R3-A～R3-C）。
- 代码：`37e2f71..6c082fd -- frontend` 17 个文件逐一读过；fixture `jobs.json` 只读核对阶段态覆盖；`mock/index.ts` 只读核对 `readScenario` / `readAgentScript` 的读取时机。

### 2. spec ↔ plan ↔ tasks ↔ 代码 一致性

| 检查 | 结果 |
|---|---|
| 五任务完成标准是否都有代码证据 | 是（`converge-batch4.md` §2 逐条） |
| 17 条命令标题是否存在、展开数是否与回报一致 | 是：2 / 4 / 21 / 48；6 / 工程门；4 / 6 / 6 / 43；6 / 4 / 9 / 工程门；4 / 1 / 1 |
| 写权限 / 文件所有权 | 与 implementation-log §14 表一致；禁止路径零差异；`git diff --check` 通过 |
| 冻结 spec / checklist 是否被改 | 否（spec LF hash 不变、`git log` 末次仍为种子 `8753fa9`；checklist blob = R10 原件） |
| 是否越出 r6.9 机制（guard / 序号 / 锁 / closeJob / 轮询 / setter / fallback / 新契约） | 否 |
| 实施定形 | 6 处类型 / 读法精度（JobCard `DeepReadonly` props、详情缓存类型层只读、StageRail props 与查看线索、StageWorkspace 占位文本、`moduleId='job-create'`、筛选控件初值取 store `filter`），写入 tasks / plan【r6.10】，不是需求变更 |
| 冲突 | 无 |

### 3. 差距与歧义（不新增任务的理由）

- **O-B4-1（导航不透传 query）**：AC-002-2 两项字面要求与 AC-008-2（`?scenario=` 直开可用、e2e 使用）在静读下都满足；plan / tasks / checklist 从未要求透传 query；v1 壳 Rail 同样不带 query。但 `agentScript` 每次 send 重读 URL，使该行为对下游 e2e（T-G01 等）有具体影响。判为**下游观察，非明确违反**，不新增任务，T-G01 / T-G05 状态行加阅读提示；交 A 实测定严重度，若须修按 `converge-batch4.md` §5 的 ≤ 0.5 h 最小方案经 §2 第 9 步登记（只改四处路由对象 + 一例回归，不改导航壳、不加 fallback）。
- **O-B4-2（迟到 canonical replace）**：修复需新增 guard，按 AGENTS §5.1 与 plan r6.9 须先报 Walter；只登记、与 S-43 一并交 A。
- **S-41（创建者展示）**：冻结 spec 目标含创建者，46 AC 不要求；本轮只登记归属（本 feature、T-B05 开工前精度轮），不改 spec / AC / 已实施任务。
- O-B4-3～6 为 UX / 证据 / 关闭确认类观察，不构成差距。

### 4. 结构复算（脚本，只读，作用于本轮最终工作树文本；HEAD = `6c082fd` 对照）

- 69 个任务，编号唯一、排序正确；104 h（A 30 / 44.5、B 7 / 11、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）；每任务 0.5～2 h。
- 状态：**21 已完成 + 5 已实施（T-A22d / B01 / B02 / B03 / B04）+ 43 未开始**；`OTHER` 0。HEAD 对照为 21 / 0 / 48。
- 完成标准 / 命令 **232 / 232**，逐任务 1:1，`MISSING_AC` = []，`PROBLEMS` = []。
- 依赖：`UNKNOWN_DEP` = []；真实依赖图 DFS `CYCLE None`；编号前向检查 `BACKEDGES` = [(T-B03, T-B04)]（唯一有意回边，R10 已认可）。
- AC：spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR` = []；`BIDIR_BAD` = []。
- 第四批：5 项 7.5 h、17 条命令，依赖与 HEAD 相同。
- 逐任务预计 / 标准 / 命令与 §5～§7：相对 HEAD `6c082fd` **NO DIFF**；§5 起全文相同。逐任务导出只在五个任务的 status 一列不同（todo → impl）。
- 依赖已满足、未开始（已完成或已实施均计入）：T-A14 / T-A15 / T-A16 / T-C01；只计已完成时结果相同。

### 5. 状态与门槛

- 46 AC 最终验收 **0**（本批 6 个最终 AC 的命令已绿，但须 Review → 全 feature Review / Gate 2）。
- H-x：H-2·标签 ① 候选 `5c00cf6` 待 Review；H-2·列表 ① 仍 `af24c82`；页面切片缺 C 组；④ 全缺。
- 外部阻塞：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除 → feature 只能报“未收敛（外部阻塞）”。
- 上游 main `072bb12` 不导入（R2-D）。

### 6. 结论（Analyze R17，当前索引）

spec / plan / tasks / 代码之间**无冲突**；第四批 5 项**已收口、待第四批独立代码 Review**；无须新增任务，结构不变（69 / 104 h / 232 / 232）。实施定形登记为 r6.10 精度。R2-C 关闭、O-B4-1～6 严重度、H-2·标签 ① 是否转生产已核，均由独立 A 判定。feature **未收敛**。本报告不是审核结论，不勾选 checklist。

## Analyze R18（只读；第四批 Review 未通过后的状态登记与 R4-A 补修草案，2026-10-29；工程审批 blocked，草案不授权实施；当前索引，R17 及更早轮次历史保留；区别于 Checklist R10，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18834-f443-750c-ae53-bba830191e22`；`claude-bridge` 本协调窗口已确认 quota / rate / spend_limit，不重试；官方通道真实调用成功；未改配置）。派工 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。
> 本轮**没有运行任何产品测试**，也没有写代码 / 测试 / fixture；测试数字全部引自 A 原件 `review-batch4.md` 与实施者日志。只读脚本 `status-blocked-struct.py`（基于 Converge batch4 的 `converge-struct.py`，只把 T-B04a 加进批次统计，并加了祖先 / 依赖打印）及其日志 `status-blocked-structure*.log`、`status-blocked-std-cmd-diff.log` 放在协调器 Temp，不是项目产物。

### 0. 性质与边界

- **不是需求变更**：冻结 spec v1.1 与 46 AC 不变，不回 Clarify，不重过 Gate 1。
- **不是全 feature Gate 2 / Handoff**，也不是用户叫停。当前只是 AGENTS §5.1 的**工程变更审批**硬边界。
- **草案的状态**：plan【r6.11】与 tasks T-B04a 都标“待批，不生效”。本报告只做静态审查：说明草案和 R17 的差异、风险、授权与结构是否一致，**不宣称已可实施**。
- **A 原件不改**：`review-batch4.md`（原件 `9812f64`，blob `0c04f6ad11830aa458ff8b6d33d317d9d61fe947`）的结论固定为**未通过：1 P2 R4-A + 4 P3 R4-B～R4-E**。

### 1. 重新读取与输入

- 规则与方案：AGENTS.md §2 / §5.1 / §6；`docs/plan.md`。
- 冻结 spec：LF SHA256 `ed0f6c6c…942d9`，末次提交仍为种子 `8753fa9`；46 AC；R-002 / AC-002-2；R-008 的“延迟”场景。
- plan：r6.9 / r6.10，§2.1 / §2.3。
- tasks：当前 69 项；T-B01 / B02 / A22d / B04 / B03 的全部状态、修改范围、标准与命令；T-B05 / G09 / H04；§1、§2a、§5～§7。
- Checklist R10 节（只读）：S-41～S-43、O-B4-2 句。blob `4537c55f226f0bdc4f39b19e7c369731cf23abba`，LF SHA256 `53285183…a115b`。
- analyze R17；implementation-log §8 / §14 / §15；interface-handoff。
- **`review-batch4.md` 全文**；`converge-batch4.md`（blob `2e4ea2c4…`，只读）；A 的只读探针日志 `review-probe/probe-results.log`（Temp）。
- 代码：只读 `JobDetailPage.vue` :21–27，以及 `job-detail.spec.ts` / `detail-stage.spec.ts` 的用例标题（11 / 4）。

### 2. 草案相对 R17 的差异

| 位置 | 变化 | 是否改动既有标准 / 命令 / 工时 |
|---|---|---|
| tasks 页首 | 新增“第四批 Review 未通过 + R4-A 工程审批等待”块；Converge batch4 块标为历史 | — |
| T-B01 / B02 / A22d / B04 / B03 状态行 | 改为“**已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）**”，附 A 亲跑数字；原状态行作为原文保留 | 否（标准 / 命令 / 工时 / 依赖逐字不变，脚本 dump 对比无差异） |
| **T-B04a**（新增，B04 后、B05 前） | R4-A 最小修复草案：0.5 h，依赖 T-B04 / T-B03 的已实施代码，3 条标准 / 3 条命令，`blocked_by: Walter §5.1 批准` | 新任务 |
| T-G09 | 依赖增 T-B04a（状态行注明 r6.11 草案） | 标准 / 命令 / 工时不变 |
| §5 AC-002-2 | 最终列 = T-B04 + T-B04a（原 B04 承接与命令保留），命令列追加 `WI R4-A` 两条；表头加 r6.11 注 | 其余 45 行不变 |
| §6 | 追加 r6.11 结构条目 | — |
| §2a 页面切片 | 加注：本批未通过；若 T-B04a 获批，也须完成并经增量 Review | 提供任务列表不变 |
| plan | 页首 r6.11 行；§2.1【r6.11 草案】；§2.3 S-43 句后【r6.11 草案】 | 不改 r6.9 / r6.10 原文；r6.9“不加 guard”在获批前继续有效 |

### 3. 风险与授权

- **授权边界**：
  - R4-A 的修复本质上是“异步回调完成后检查自己是否仍有效”，与 plan §2.1【r6.9】“不加比较 / 去重 guard”字面冲突；§2.3【r6.10】又写明任何新增 guard 都要按 §5.1 先报 Walter。因此 T-B04a 在 Walter 对**这一项**单独批准之前不得开码。
  - 协调器已在本轮 commentary 报告 §5.1 要求的三项依据（怎么出错 / 概率 / 代码量），但 Walter **尚未回复**。向集成人报告不等于 Walter 同意；Walter 的通用代码授权仍然有效，但不覆盖 plan 明确不做的新机制。
  - 本草案不使用“清理回调不是 guard”之类的说法来绕开授权。
- **流程纠偏**：
  - A 原件 §3 / §7 中“Gate 2 待 Walter”“选 (b) 风险接受可改判通过”属于流程建议文字。按 AGENTS §2，Gate 2 是全 feature Review 之后的人工闸门，批次 Review 不另设 Gate 2，所以这些文字不创设批次 Gate 2，也不降低 P2。
  - 当前状态以 AGENTS 为准：**Review 未通过**，直到 P2 修复并经 A 新会话增量技术复核。
  - 集成人建议 Walter 只批准最小修复，不请求以风险接受把 P2 当作 P3 放行。
  - 不因 Review 结论红而换模型，也不另找 A 求通过。
- **草案本身的技术风险**（静态，不是实测）：
  - Vue 3.5 的 `watch` 第三参数 `onCleanup` 在回调再次触发前和 watcher 停止（组件卸载）时都会调用，正好覆盖 A 的 2a（侧栏离开）、2b（Back）、2c（同作业选阶段）、2d（换作业）四条路径。
  - `selectStage` 是同步 replace，不受影响。合法 stage 入口不经 canonical 分支，行为不变。
  - 草案不取消 `openJob`，因此离开后仍有一次可接受的额外读，store 的迟到写入 R4-E 仍在（P3，自愈，归 `api` feature）。
  - 新 E2E 依赖真实 slow 延迟（实际等待 ≥ 3500 ms）。只要窗口 > 3000 ms 就能确定性断言，不需要改配置。
  - 组件第 2 例必须先让同作业进入缓存（轨道可见）才能在读期间点阶段，草案已写明这一前置。
- **未选的替代方案**：A 列出的 (b) 风险接受、(c) 改设计（JobCard 默认带 stage）都不在本草案内；是否采用由 Walter 决定，本报告不代做。
- **范围确定性**：只改三个文件——`JobDetailPage.vue`、`job-detail.spec.ts`（只新增 `WI R4-A` 2 例）、`detail-stage.spec.ts`（只新增 1 例 `WI R4-A`）。原 11 例组件测试与原 4 例 E2E 不改。API / 契约 / 输入 / 私有存储均无变化。标准 3 用 `git diff --stat 6c082fd HEAD -- frontend` 固定文件白名单。

### 4. 结构复算（脚本，只读，作用于本轮最终工作树；HEAD = `9812f64` 对照）

- **任务与工时**：70 个任务，编号唯一、排序正确（T-B04a 在 T-B04 后、T-B05 前）；104.5 h（A 30 / 44.5、B 8 / 11.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）；每项 0.5～2 h。HEAD 对照为 69 / 104 h。
- **状态**：**21 已完成 + 5 已实施（Review 未通过）+ 44 未开始**；`OTHER` 0。HEAD 对照为 21 / 5 / 43。
- **标准 / 命令**：**235 / 235**，逐任务 1:1；`MISSING_AC` = []，`PROBLEMS` = []。
- **依赖**：`UNKNOWN_DEP` = []；真实依赖图 DFS 结果 `CYCLE None`。编号前向检查 `BACKEDGES` = [(T-B03, T-B04)]，仍是唯一有意回边；T-B04a 的两个依赖都在它之前，不新增回边。
- **AC**：spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR` = []；`BIDIR_BAD` = []。
  - AC-002-2 最终 = [T-B04, T-B04a, T-H04]，部分前置 A22 / A22d 都是 T-B04a 的祖先。
  - T-B04a 标准 1 / 2 引用 AC-002-2，标准 3 引用 AC-009-1（工程门）。
- **执行顺序**：T-G09 依赖 = [G06, G07, G08, **B04a**]，且 T-B04a ∈ ancestors(T-H04)，所以全量检查与 v2 复验都排在修复之后。
- **逐任务对比 HEAD**（`status-blocked-std-cmd-diff.log`）：只有新增的 T-B04a 一节和 T-G09 的 deps 一列不同。其余 69 项的预计 / 依赖 / 状态 / 标准 / 命令逐字相同；§1、§3、§7 全文相同。
- **依赖已满足、未开始的任务**：
  - 已完成和已实施都计入时：T-A14 / T-A15 / T-A16 / **T-B04a** / T-C01。其中 T-B04a 只是结构上可起步，受 Walter §5.1 批准外部阻塞。
  - 只计已完成时：T-A14 / T-A15 / T-A16 / T-C01。
  - 以第四批未通过任务为前提的下游（如 T-B05 / T-B06 / T-G02 / T-G04 与 C–F 的 B04 入口），是否在 R4-A 处置前派工由集成人决定。**本轮按协调指令不派任何代码。**
- 第四批 + 草案合计：6 项 8 h、20 条命令（原 5 项 7.5 h / 17 条 + T-B04a 0.5 h / 3 条）。

### 5. Checklist 与复核路径

- 有效 Checklist 仍是 **R10** `37e2f71`（blob `4537c55…`），本轮未改、未勾。R10 审的是 r6.9，r6.11 草案还没有经过 A 审查。
- A 原件 §3 (a) 建议的路径是“登记小任务 → Implement → A 定向复核”，复核对象为 `JobDetailPage.vue` diff、新回归用例、`job-detail.spec` 整文件与四份 E2E，即**实施后的增量 Review**，并没有要求开码前另开一轮 Checklist。
- 本报告据此登记：获批后按该路径执行。开码前是否再加一次 A 设计定向复核（Checklist R10.1），由 Walter / 集成人在批准时一并决定，本轮不调用 A，也不预设。

### 6. 状态、台账与固定值核对

- **代码固定**：`6c082fd`；`6c082fd..9812f64` 只有文档。
- **固定值核对**：
  - 冻结 spec、`checklist.md`、`review-batch4.md` 与 R10 原件 / Review 原件逐字相同（blob 见 §0 / §1）。
  - 旧 Review / Converge 原件与 `9812f64` 零差异。
  - 本轮禁止路径（`frontend/`、`backend/`、`docs/`、`templates/`、AGENTS.md、根 HANDOFF、spec / checklist / 各 review / converge、其他 feature）零差异，`git diff --check` 通过。
- **P3 与未关项**（均未经风险接受）：
  - R2-C 代码经 A 核实，关闭条件（本批通过）未满足，不记关闭。
  - R4-B～R4-E 按 A 原件 §5 的承接登记。
  - S-41 仍归 T-B05 开工前精度轮；R3-B / R3-C 及前两批未关项归属不变。
- **H-x**：H-2·标签 ① 候选 `5c00cf6` **不转生产已核**（② R10、③ A 亲跑 48 / 18 / 9 / 21、④ 缺）；H-2·列表 ① 仍 `af24c82`；页面切片未通过、C 组未做 → 未交付。main `072bb12` 不导入，继续 pin `90187f7`。
- **验收与收敛**：46 AC 最终验收 **0**；feature **未收敛**（第四批未通过 + 44 项未实施 + H 组外部阻塞）。

### 7. 结论（Analyze R18，当前索引）

- spec / plan / tasks / 代码之间没有新的冲突。第四批 Review 的 P2 R4-A 已登记为**待批的最小补修草案 T-B04a**：结构一致（70 / 104.5 h / 235 / 235，无环，AC 双向一致且祖先可达），原 5 项的标准 / 命令 / 工时未削减。
- 草案处于 **blocked（等待 Walter AGENTS §5.1 单独批准）**，不授权实施。获批后按 Implement → Converge → A 新会话增量 Review 的顺序执行，通过后才关闭 R4-A、改判第四批。
- 在此之前，第四批 Review 维持**未通过**，feature **未收敛**。
- 本报告不是审核结论，不勾选 checklist。

## Analyze R19（只读；R4-A 最小修复获 Walter §5.1 批准、plan r6.11 生效后的开码前登记，2026-10-29；当前索引，R18 及更早轮次原文不改；区别于 Checklist R10，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188da-1d90-7009-9405-316722985a4e`；`claude-bridge` 本协调窗口已确认额度耗尽、无重置证据，不重试；同模型官方通道近期成功；未改配置）。派工 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。本轮**没有运行任何产品测试**，也没有写代码 / 测试；结构复算脚本 `approve-struct.py`（复用 R18 的 `status-blocked-struct.py`，未改逻辑）与日志在协调器 Temp `approve-01a188da/`，不是项目产物。

### 1. 输入与授权事实

- 重读：AGENTS.md §2 / §5.1 / §6；`docs/plan.md`；冻结 spec（LF SHA256 `ed0f6c6c…942d9`，末次提交 `8753fa9`，46 AC）；plan r6.11 草案；tasks T-B04a 全文；Checklist R10（`37e2f71`，blob `4537c55f226f0bdc4f39b19e7c369731cf23abba`，26 勾 / 0 未勾）；`review-batch4.md` R4-A（原件 `9812f64`，blob `0c04f6ad…`）；本文件 R18；implementation-log §16；interface-handoff。代码固定 `6c082fd`，`6c082fd..e285ad2` 只有文档。
- **授权已到**：集成人报告 R4-A、`onCleanup` 约 3～5 行最小方案与归档选项后，Walter 原话回复：“**那就先修P2等全部工作完成后，再合入main**”。据此判定：这是对 R4-A 最小修复的 §5.1 单独批准，并选定 feature 全部完成后再合 main。它**不是**风险接受（P2 不降级）、**不是**提前 Gate 2，也不批准扩到 store 取消 / 锁 / 请求序号 / query 或立即清理现有目录。R18 §3 的授权缺口由此关闭；本轮不再就此或通用代码授权追问。

### 2. 一致性（spec ↔ plan ↔ tasks）

- plan 页首新增“r6.11 生效”行；§2.1 / §2.3【r6.11】标记改为已生效，草案正文原样保留。生效范围 = §2.1【r6.11】原文：只改 `JobDetailPage.vue` 的 `watch` 回调（`onCleanup` + `stale` + canonical replace 前 `!stale`）；`job-detail.spec.ts` 只新增 `WI R4-A` 2 例；`detail-stage.spec.ts` 只新增 1 例；原 11 / 4 例不改；其他源码、store、query 禁止。§2.1【r6.9】“不加比较 / 去重 guard”只对这一处失效标志例外。
- tasks：页首新增批准块（原 §5.1 等待块标为历史）；T-B04a 标题 / 状态改为“已获批、可开码”；T-B04 状态行只追加“T-B04a 解除 blocked”一句。T-G09、§2a、§5、§6 中的【r6.11 草案】标记**内容不改**（G09 依赖原文保持），按页首块读作已生效。
- spec / 46 AC 不变，不是需求变更，不回 Clarify / Gate 1；与 plan / tasks 无冲突、无新缺口。
- **依赖说明**：T-B04a 依赖 T-B04 / T-B03 在 `6c082fd` 的**已实施代码**；二者仍是“已实施、第四批 Review 未通过”，不伪称已过 Review。

### 3. Checklist 与复核路径（集成人决定）

- **不另开 Checklist R10.1 设计轮**：A 原件 §3 (a) 已点名同一最小修复与测试范围；设计（plan §2.1【r6.11】）与任务（T-B04a）已登记；唯一缺的 §5.1 许可现已到位；没有新的 what / 参数 / 机制扩展。R10 保持只读 26 / 26。
- **不跳审**：必须走 Implement（新会话，首选 openai/gpt-6-astra）→ Converge → **A 新会话增量代码 Review**；通过后才关闭 R4-A、改判第四批。实施中如发现不属于草案的真实设计问题，停下报告，不扩大范围。

### 4. 结构复算（脚本只读，作用于本轮最终工作树；HEAD = `e285ad2` 对照）

- 70 个任务，编号唯一、排序正确；104.5 h（A 30 / 44.5、B 8 / 11.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h。
- 状态 **21 已完成 + 5 已实施（Review 未通过）+ 44 未开始**，`OTHER` 0。
- 标准 / 命令 **235 / 235**，逐任务 1:1；`MISSING_AC` = []，`PROBLEMS` = []。
- `UNKNOWN_DEP` = []；`CYCLE None`；`BACKEDGES` = [(T-B03, T-B04)]，仍是唯一有意编号回边。
- spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR` = []；`BIDIR_BAD` = []；AC-002-2 最终 = [T-B04, T-B04a, T-H04]，部分前置 A22 / A22d 均为 T-B04a 祖先；T-G09 依赖 = [G06, G07, G08, B04a]，T-B04a ∈ ancestors(T-H04)。
- 逐任务 dump（预计 / 依赖 / 状态 / 标准 / 命令）与 HEAD **逐字相同**：本轮只改状态说明文字，不改任何标准、命令、依赖、工时。
- 依赖已满足的未开始任务：已完成 + 已实施计入时 T-A14 / A15 / A16 / **B04a** / C01；T-B04a 的外部阻塞已解除。

### 5. 状态与未关项

- R4-A **未关闭**（已批准、未修），第四批 Review 维持未通过；原 5 项不计完成。R2-C 关闭仍以本批通过为条件。R4-B～E、S-41、R3-B / R3-C 及前两批 P3 均未经风险接受，归属不变。
- H-2·标签 ① 候选 `5c00cf6` 须等新 A 复核本批通过后才可转已核生产；④ 未放行；页面切片未交付。46 AC 最终验收 **0**；feature **未收敛**。
- 固定值：冻结 spec、`checklist.md`、各 review / converge 原件与 HEAD 零差异；本轮无代码 diff。

### 6. 结论（Analyze R19，当前索引）

- §5.1 授权已到；spec / plan / tasks 一致，结构不变（70 / 104.5 h / 235 / 235 / 21 + 5 + 44 / 46 AC 双向）。**可按 T-B04a 开码**，范围以 plan §2.1【r6.11】与 T-B04a 修改范围为限，不改冻结 spec 46 AC。
- 实施后须 Converge + A 新会话增量 Review；在此之前不得记 R4-A 关闭或第四批通过。本报告不是审核结论，不勾选 checklist。

## Analyze R20（只读；T-B04a 实施后的增量 Converge 一致性登记，2026-10-29；当前索引，R19 / R18 及更早轮次原文不改；区别于 Checklist R10，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188e8-c8fd-7213-8e90-b721dc6bf792`）。`claude-bridge` 在当前额度窗口已明确耗尽，不重试；同模型官方通道成功；未改配置。派工 = 集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。
>
> 本轮**没有运行任何产品测试**，也没有写代码 / 测试。测试数字都来自实施者（见 `converge-batch4-r4a.md` §2）。结构复算脚本 `converge-struct.py` 复用 R19 的 `approve-struct.py`，逻辑未改；脚本与日志在协调器 Temp `wi-r4a-fix-01a18388-bdy5e3x0/converge-*`，不是项目产物。

### 1. 输入

- 重读：
  - AGENTS.md §2 / §5 / §6；`docs/plan.md`；
  - 冻结 spec（blob `102af73…`，LF SHA256 `ed0f6c6c…942d9`，46 AC）；plan r6.11（已生效，本轮未改）；
  - tasks T-B04a 全文与旧 T-B04；Checklist R10（`37e2f71`，blob `4537c55f226f0bdc4f39b19e7c369731cf23abba`，26 / 0）；
  - 本文件 R19；implementation-log §17；interface-handoff；`review-batch4.md` R4-A。
- 代码：固定 diff `80a1892..ae592ba -- frontend`，3 个文件 +72 / −2（`converge-batch4-r4a.md` §1）。

### 2. 一致性（spec ↔ plan ↔ tasks ↔ 代码）

- 代码与 plan §2.1 / §2.3【r6.11】、T-B04a 修改范围逐条一致：
  - 回调签名 + `stale` + cleanup + `!stale`；
  - 测试只追加 2 + 1 例，原 11 / 4 例为逐字节前缀；
  - store / query / 其他源码零差异。
- 没有冲突，没有差距，也没有模糊处需要补精度。plan 不改（无 r6.12）；spec / 46 AC 不变；不是需求变更，不回 Clarify / Gate 1；不另开 Checklist R10.1。
- T-B04a 的 3 条标准都有真实代码和实施者命令证据，旧代码下有先红记录（组件 2 / 浏览器 1）。判定见 `converge-batch4-r4a.md` §2。

### 3. 状态回写（只改状态说明文字）

- **tasks**：页首新增“T-B04a 已实施 + 增量 Converge 已收口”块，原批准块标为历史原文。T-B04a 状态改为“已实施，待 A 新会话增量 Review”，原状态行保留为批准登记时原文。T-B04a 的标准 / 命令 / 工时 / 依赖与其他任务一律不动。
- **implementation-log** 新增 §18；**interface-handoff** 新增当前块；**README** 只改本 feature 一行；本文件页首新增一行指向本轮的当前结论（原指向 R18 的页首块标为当时原文，内容不改）。

### 4. 结构复算（脚本只读；作用于本轮最终工作树，与 HEAD `ae592ba` 对照）

- 70 个任务，编号唯一、排序正确；104.5 h（A 30 / 44.5、B 8 / 11.5、C 5 / 7.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h。
- 状态：**21 已完成 + 6 已实施 + 43 未开始**，`OTHER` 0。6 项已实施 = 第四批 T-A22d / B01 / B02 / B03 / B04（原批次 Review 未通过，不计完成）+ T-B04a（待 A）。**合计 27 已实施**。
- 标准 / 命令 **235 / 235**，逐任务 1:1；`MISSING_AC` = []，`PROBLEMS` = []。
- `UNKNOWN_DEP` = []；`CYCLE None`；`BACKEDGES` = [(T-B03, T-B04)]，仍是唯一有意编号回边。
- AC 覆盖：
  - spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR` = []；`BIDIR_BAD` = []。
  - AC-002-2 最终 = [T-B04, T-B04a, T-H04]。
  - T-G09 依赖 = [G06, G07, G08, B04a]；T-B04a ∈ ancestors(T-H04)。
- 与 HEAD 的逐任务 dump（预计 / 依赖 / 状态 / 标准 / 命令）**只有 1 行差异**：T-B04a 的 `status` 由 todo 变为 impl。原标准命令、矩阵 46 行、依赖与工时逐字不变。
- 依赖已满足的未开始任务（已完成 + 已实施计入）：T-A14 / A15 / A16 / C01。

### 5. 状态与未关项

- **R4-A**：代码已修，**未关闭**，待 A 新会话增量 Review 判定；第四批 Review 维持未通过。
- **R2-C**：关闭仍以本批通过为条件。
- **R4-B～E、S-41、R3-B / R3-C 及前两批 P3**：未经风险接受，归属不变。
- **H-x**：
  - H-2·标签 ① 候选 `5c00cf6` 仍是候选；H-2·列表 ① 仍 `af24c82`；
  - 所有切片 ④ 缺，页面切片未交付；
  - 本修复不是 v2 集成，也不是整个 feature 交付。
- 46 AC 最终验收 **0**；feature **未收敛**。
- **固定值**：冻结 spec、`checklist.md`（R10）、`plan.md`、各 review / converge 原件，与 HEAD 零差异；本轮无代码 diff。
- **远端**：Draft PR #12 远端 head 仍为 `e285ad2`。按 Walter 的选择，feature 全部完成后再合 main；本轮不 merge / resolve / cleanup；main pin `90187f7` 与 R2-D 流程不变。

### 6. 结论（Analyze R20，当前索引）

- spec / plan / tasks / 代码一致，结构不变（70 / 104.5 h / 235 / 235 / 46 AC 双向；唯一回边 B03 → B04；无环）。状态为 21 + 6 + 43（27 已实施）。
- **T-B04a 增量已收口，待独立 A 增量 Review**。下一步是 A 复核，不需要用户再次批准。在 A 判定之前，不得记 R4-A 关闭、第四批通过或 T-B04a 已完成。
- 本报告不是审核结论，不勾选 checklist。

## Analyze R21（只读；第五批采集台闭环 T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04 开工前机制精度 r6.12 之后，2026-10-29；当前索引，R20 / R19 / R18 及更早轮次原文不改；区别于 Checklist R10 / R11，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18917-d5b2-7520-921c-f26458a30be1`）。`claude-bridge` 本协调窗口已明确 quota、无重置证据，不重试；同模型官方通道近期成功；未改配置，不因任务结果换模型。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。
>
> 本轮**没有运行任何产品测试**，没有写代码 / 测试 / fixture，没有改 spec / checklist / 旧 Review / 旧 Converge / docs。结构复算脚本 `prepare-struct.py` 以 R10 审核员脚本（`status-struct.py`）为底，只改仓库路径、批次名单与打印项，判定逻辑未改；脚本、HEAD / WT dump 与日志在协调器 Temp `wi-batch5-01a18388-q7s7olxl/prepare-*`，不是项目产物。

### 0. 性质与边界

- 这是 Tasks / Plan 精度补正后的只读一致性报告。它不授权开码：**须独立 A 新会话做 Checklist R11 定向复核通过并提交后，才可派 Astra**。R10（`37e2f71`，blob `4537c55f226f0bdc4f39b19e7c369731cf23abba`，26 / 26）只覆盖 r6.11 及以前的设计，**不自动覆盖** r6.12 的新接口（intakeStore 成员、`listInterventions`、`ReliabilityLabel`、`CollectWorkspace` 接线、R3-B 规则）。本作者不勾选、不预判 R11。
- 冻结 spec v1.1 / 46 AC 不变；不新增 what，不混入 D-020～D-024、真实解析、URL 抓取或 agent 接入；不是需求变更，不回 Clarify / Gate 1。

### 1. 重新读取与代码事实

- **文档**：AGENTS.md；`docs/plan.md`；`docs/designUI.md` §2.4 / §3 / §6；`docs/interaction.md` §3 / §7；冻结 spec（46 AC）；plan r6.11；tasks §0 / §1 / §2a / §3 / §5 / §6 / §7 及 T-A12 / A13 / A15 / A17 / A22a / A22d / B04 / B04a / B06 / C01～C04 / D02 / E03 / F03；Checklist R10；本文件 R20；implementation-log §8 / §19；interface-handoff；`review-batch3.md` R3-B；`review-batch4.md` / `review-batch4-r4a.md`。
- **代码（`ae592ba`，只读）**：
  1. `jobs/components/StageWorkspace.vue` 只接收 `stage`、只渲染占位；`JobDetailPage.vue` 没有采集列表、投放入口或介入历史；`stores/intake.ts`、`IntakeDrawer` / `IntakePanel` 不存在。
  2. `jobs/stores/jobs.ts` 的私有 `readDetail` 每次成功都把 `currentJob` 换成新的契约对象，对外 `computed(readonly)` 的引用随之变化；`refresh()` 在锚非空时重读详情。
  3. `contracts/client.ts` 的 `DataClient` 没有 `listInterventions`；`tests/unit/jobs/real-stubs.spec.ts` 的 `requests` 表现有 22 键（`satisfies` 全键约束 + 键集合断言，共 23 例）。
  4. `contracts/mock/job-state.ts`：`removeUpload` 不检查 `removed`（R3-B）；`confirmIntake` 回执的 `upload` 是确认后的记录，`previews[uploadId]` 不随确认改变；`getStageWorkspace` 的 collect 列表去掉 removed，`listUnassignedUploads` 只给未归属未删除者；待归属池不在 jobsStore 内。
  5. `contracts/types.ts`：`SourceNoteSchema.reliability` 是内联四值枚举，九张展示映射里没有它的文案；`labelSchema()` 可直接复用。
  6. 已审测试的约束：`job-detail.spec.ts` 以全局选择器取 `h1`、`.job-type`、`.job-status-badge`、`.job-subject`、`[aria-current="step"]`、`[aria-pressed="true"]`，且慢场景用例断言 ready 后**不存在** `Loading`；`list-create` / `detail-stage` E2E 以 Playwright 严格模式取 `heading level 1`、`.job-status-badge`、`X工作区` 区域；`job-list.spec.ts` 以 `select[aria-label="状态" / "类型"]` 取筛选项。

### 2. 缺口 → 最小合法落点（逐条理由；没有删减已有验收覆盖）

| # | 缺口（可从代码 / 文档推断） | 选定落点 | 不选的方案与理由 |
|---|---|---|---|
| G1 | T-C04 标准 2 要“核对介入历史展开内容”，但原依赖只有 C03 / B04；介入历史 UI（T-B06）依赖 T-A15，而 `listInterventions` 与七个分析写动作捆在 T-A15 里 | 拆 **T-A15a**（只读 `listInterventions`，0.5 h，原 A15 标准 / 命令 4 移交并在 A15 内保留原文）；T-A15 1.5 → 1 h（总工时不因拆分增加）；**T-B06** 依赖 A15a + A01a；**T-C04** 依赖 B06。历史展开断言原样保留并细化 | ① 整个 A15 + B06 纳入本批：多做 submitIntervention / tombstone / pin_rule，约 +1 h，且与采集闭环无关；② C04 后置：采集闭环与 AC-003-3 最终留空，且只是把隐含依赖往后推 |
| G1′ | 原 B06 范围只建组件：没有 JobDetailPage 挂载权；只在 mounted / jobId 变化时读会在同一作业写入后过期 | B06 增挂载权（右侧栏，spec R-007“详情侧栏”）；重读信号 = `jobsStore.currentJob` 引用替换（每次详情读成功都会替换，含所有写后统一 refresh）；**默认收起、收起时不读** | `updatedAt` 比较（同毫秒写入不变、本质是比较 guard）；事件总线 / 轮询 / 请求号（AGENTS §5.1、plan §2.3 明确不做）；挂载即读（会让已审慢场景用例在 ready 后看到 `Loading`，见 §1-6） |
| G2 | `StageWorkspace` 只有占位；原 C02 / C03 没写谁渲染 `collect.uploads`、谁调 `getIntakePreview`、预览挂在哪 | **T-C01a** 新增 `CollectWorkspace.vue`（采集列表 + “投放到本作业”入口），`StageWorkspace` 改 props `{stage, job, workspace}` 只对 collect 分发，读取窗口显示“读取中…”（不用 shared `Loading`），其余阶段原占位；**T-C02** 预览 / 映射挂在 IntakeDrawer，选中经 `selectUpload`；**T-C03** 池在抽屉内、删除确认在采集列表行内。逐任务写入许可列在任务与 implementation-log §20.2 | 预览内联在详情页：抽屉之外再开一处确认 UI，列表页的待归属投放无处预览；把 CollectWorkspace 放进 C02：C02 将超 2 h（R8 B-12 先例要求 Tasks 阶段拆分） |
| G3 | intakeStore 只写了 H-5 四个名字，草稿形状、提交签名、读写错误、跨页面保留、可靠性中文文案都要 Astra 猜 | plan §2.3【r6.12】定型：H-5 公开 `open(jobId?: string)`（每次覆盖快照为 `jobId ?? null`，不读 route）/ `close()`（只关、不清）/ 只读 `isOpen` / `jobId`；内部 `draft` / `submit(IntakeSubmission)`（分配式 `Omit<…,'jobId'>`）/ selection / pool；写失败 reject 原 `ErrorResponse`（同已审 createJob），读失败写状态并 resolve（S-38）；草稿与 File 元数据只在内存。可靠性文案拆 **T-A01a**（`ReliabilityLabel`，S-11 同机制，键 = 既有枚举，不新建 schema） | 组件内写中文映射：3 处消费方各写一份即“另建映射”（S-11 / §1-7）；新建 `ReliabilitySchema`：字段已存在，只为一次引用 |
| G4 | 写后视图：confirm 后当前回执仍是旧 pending；映射编辑器若取 `preview.fields` 会覆盖已保存映射；池不随 jobsStore 刷新 | confirm 成功以回执替换 selection（状态立即更新）；映射草稿初值 = `upload.mapping`；四个写动作成功后 `jobsStore.refresh()` 恰一次，池已加载则另 `loadPool()` 一次；只有 pending 且未删除才显示“确认入库”；归入选项只取 `ACTIVE_JOB_STATUSES`；删除确认带默认可改理由，取消零调用；removed 当前隐藏、历史保留 `remove_source` | 把池并入 jobsStore：跨域扩大 store；局部重读各列表：违背 §1-9“写后统一 refresh” |
| G5 | R3-B（重复删除产生冗余修订 / 事件）原归 C03 / A17 二选一，C03 是首个消费方 | 单列 **T-A13a**（0.5 h，只在 `removeUpload` 对 removed 记录 validation_error + 一组两例）；C03 依赖它 | 并入 C03：C03 需改契约层与 pool spec，越出其页面 scope；留给 A17：C03 的删除确认 UI 先上线会暴露冗余台账 |
| G6 | 新增 DataClient 方法会触发 `real-stubs.spec` 的 `satisfies` 全键约束（旧批次曾因此停机） | T-A15a 只在 `requests` 表追加一键，旧键 / 断言 / `satisfies` 不改；方法描述实现中立；复用既有 schema，不新增注册；不升 major | 动态枚举或放宽断言：弱化既有校验 |
| G7 | 范围与回归：旧用例、壳文件、R4-A 修复不得被改；本批之外的 UI 不提前做 | 全批禁写名单与旧用例清单见 implementation-log §20.2；改页面的任务各带一条回归标准 / 命令（B06、C01a），其后任务命令带前序 spec 回归（C02、C03）；C04 只写 E2E | — |
| O1 | 既有隐含依赖：T-D02 / T-E03 / T-F03 的端到端标准写“介入历史出现…”，却不依赖 T-B06 | 三者各增依赖 T-B06（编号前向，不改标准 / 工时 / 矩阵） | 不处理：留下与 G1 同类的隐含依赖 |

**R3-B 授权说明**：A 在 `review-batch3.md` 把最小修复描述为与 confirm / assign 一致的领域规则；本作者据此登记为领域前置，但**不自称已获授权**，也不借 R4-A 的 §5.1 批准。是否须 Walter 另批，由 Checklist R11 按真实领域边界判定；判为须 §5.1 时，T-A13a blocked_by Walter、R3-B 维持开放，其余 8 项可照常推进（T-C03 对它的依赖届时由集成人登记）。

### 3. 一致性（spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 代码）

- **spec**：未改。r6.12 只落实 R-003（三种投放、来源说明、预览修正、待归属池、状态展示）、R-007（详情侧栏介入历史、无模态、删除二次确认）与 R-008（契约扩展）的既有 what。
- **plan**：页首 r6.12 行；§2.1 / §2.2 / §2.3 / §2.4 / §3 / §5 各一处【r6.12】，与 tasks 修改范围逐条对应：页面容器与分发（T-C01a）、侧栏挂载与重读信号（T-B06）、store 成员与语义（T-C01 / C02 / C03）、`listInterventions`（T-A15a）、R3-B（T-A13a）、`ReliabilityLabel`（T-A01a）。
- **tasks**：页首 r6.12 块；三个新任务；T-A15 / A17 / B06 / C01 / C01a / C02 / C03 / C04 / D02 / E03 / F03 的状态行、依赖、范围或标准按上表修改；§2a 页面切片 / H-5 行补注；§5 矩阵 7 行部分前置更新（最终任务与最终命令不变）；§6 增 r6.12 段。
- **interface-handoff**：页首预期块（不预写结果）、§1 r6.12 口径、§3 r6.12 接口精度。H-5 的交接成员只有四项，内部成员不进交接；所有切片仍未交付。
- **implementation-log**：页首块、§8 R3-B 落点更新、§20（范围 / 模型 / 文件所有权 / 命令 / 闸门）。
- **代码**：本轮零差异；§1 的代码事实已逐条反映在 plan / tasks 精度中。
- **H-x**：H-5 的提供任务仍为 T-C01 / T-C01a；页面切片提供任务不变。T-B06 / A15a / A01a / A13a 只是依赖，不形成 ①～④。

### 4. 本批任务 1:1（标准 ↔ 命令；均带 jobs 路径与 WI 标题）

| 任务 | 标准 → 命令 | AC |
|---|---|---|
| T-A01a | 1 → `contract-labels -t "WI reliability label"`；2 → contract-labels + v1 `contracts` / `contract-doc` 整文件；3 → `contract --check && typecheck && lint` | AC-003-3、AC-008-1 部分前置；AC-009-1 |
| T-A13a | 1 → `job-state-pool -t "WI R3-B repeated remove"`；2 → `job-state-pool` 整文件；3 → 生成物 + 工程门 | AC-007-3 部分前置；AC-009-1 |
| T-A15a | 1 → `job-state-history -t "WI listInterventions"`；2 → `-t "WI history scenarios"` + `real-stubs`；3 → 生成物 + 工程门 | AC-007-1、AC-008-2、AC-008-3 部分前置；AC-009-1 |
| T-B06 | 1 → `intervention-history -t "WI AC-007-1"`；2 → `-t "WI history refresh"`；3 → `job-detail` 整文件 + `detail-stage` / `list-create` E2E + 工程门 | AC-007-1 最终；AC-002-4、AC-003-3 部分前置；AC-009-1 |
| T-C01 | 1～4 → `intake -t "WI AC-003-2" / "WI purpose required" / "WI metadata only" / "WI H-5 store"`；5 → 工程门 | AC-003-2 最终；AC-003-1 / 003-3 / 003-5 部分前置 |
| T-C01a | 1～4 → `intake -t "WI H-5 container" / "WI H-5 close" / "WI page mount" / "WI non-modal"`（4 带工程门）；5 → job-list / job-detail / job-create + 两份 E2E | AC-003-1 / 003-5 / 007-3 部分前置；AC-009-1 |
| T-C02 | 1～3 → `extraction-preview -t "WI AC-003-4" / "WI AC-003-6" / "WI confirm refresh"`；4 → `intake` 整文件 + 工程门 | AC-003-4、AC-003-6 最终 |
| T-C03 | 1～3 → `unassigned-pool -t "WI pool assign" / "WI remove confirm" / "WI assign refresh"`；4 → intake / extraction-preview / job-state-pool + 工程门 | AC-003-5 / 007-3 部分前置 |
| T-C04 | 1～3 → `e2e/jobs/intake -g "WI AC-003-1 local" / "WI AC-003-3" / "WI AC-003-5"` | AC-003-1 本地子项；AC-003-3、AC-003-5 最终 |

新标题与既有标题不冲突：`WI reliability label` 不匹配 `-t "WI labels"`；`WI R3-B repeated remove` 不匹配 `-t "WI removeUpload"`；`WI H-5` 前缀集合（store / container / close）即 §2a H-5 定向命令的范围。

### 5. 结构复算（脚本只读；作用于本轮最终工作树，与 HEAD `4bc6627` 对照）

- **WT**：73 个任务，编号唯一、排序正确；**107 h**（A 33 / 45.5、B 8 / 12、C 5 / 8.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h；状态 **27 done / 46 todo / 0 impl / 0 other**；标准 / 命令 **245 / 245**，逐任务 1:1，`MISSING_AC` = []，`PROBLEMS` = []；`UNKNOWN_DEP` = []；`CYCLE None`；`BACKEDGES` = [(T-B03, T-B04)]（唯一有意回边，未新增）；spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR` = []；`BIDIR_BAD` = []。
- **本批**：9 项、12 h、33 条命令；`T-B06 ∈ ancestors(T-C04)`、`T-A15a ∈ ancestors(T-A17)` 均为真。依赖已满足、可立即起步的未开始任务：T-A01a / T-A13a / T-A14 / T-A15 / T-A15a / T-A16（T-C01 现须先有 T-A01a）。
- **与 HEAD 逐任务 dump 的差异**（预计 / 依赖 / 状态 / 标准 / 命令）只在以下任务：新增 T-A01a / T-A13a / T-A15a；T-A15（1.5 → 1 h，标准 5 → 4）；T-A17（依赖 + A15a）；T-B06（1.5 → 2 h，依赖改 A15a + A01a，标准 2 → 3）；T-C01（依赖 + A01a，标准文字补精度）；T-C01a（1 → 1.5 h，依赖 + B04，标准 4 → 5）；T-C02（1.5 → 2 h，依赖 + C01a，命令 4 增回归）；T-C03（依赖 + A13a，命令 4 增回归）；T-C04（依赖 + B06）；T-D02 / T-E03 / T-F03（依赖 + B06）。已完成的 27 项与其余未开始任务逐字不变。
- **复算**：235 + 3（A01a）+ 3（A13a）+ 3（A15a）− 1（A15）+ 1（B06）+ 1（C01a）= **245**；104.5 + 0.5 × 3 − 0.5 + 0.5 × 3 = **107 h**。
- **矩阵**：AC-003-3 增 A01a / B06；AC-003-5 增 C01a；AC-007-1 的 A15 换为 A15a；AC-007-3 增 A13a；AC-008-1 增 A01a；AC-008-2 / AC-008-3 增 A15a。最终任务与最终命令 46 行不变，原最终覆盖没有丢失。

### 6. 观察与留给 R11 的判断点（不预设结论）

- **O-R21-1（R3-B 合法性）**：T-A13a 是领域规则还是 §5.1 guard，见 §2 授权说明。
- **O-R21-2（历史默认收起）**：侧栏常驻，内容在展开时读取。理由是避免挂载即读改变已审慢场景断言、避免无人看时的额外读；spec R-007 的“侧栏 / 按时间展示 / 可筛选”与 AC-007-1“可见或可展开”都满足。是否接受由 R11 判断。
- **O-R21-3（kind / outcome 原样显示）**：契约没有 `InterventionKind` / `InterventionOutcome` 的展示映射；B06 按契约值原样显示，不新建映射。AC-007-1 只要求字段齐全，不要求中文文案。
- **O-R21-4（写动作 reject 而非 resolve）**：intakeStore 的四个写动作失败时以原 `ErrorResponse` reject，调用组件 await + catch 显示 `ErrorState`，与已审 `jobsStore.createJob` / `JobCreatePanel` 同口径；读动作失败写状态并 resolve（S-38）。
- **O-R21-5（额外读）**：同作业切阶段也会替换 `currentJob`，展开中的历史会多读一次；这属于可接受的额外读，不加比较 guard（同 r6.9 口径）。
- **O-R21-6（选中的迟到写入）**：慢场景下连续选中两条投放，最后到达的响应生效（mock 按序完成，不会错位）；真实 `api` 乱序归 `api` feature（S-43 / R4-E 同类），本批不加请求序号。
- **O-R21-7（粒度）**：T-B06 / T-C01 / T-C02 顶格 2 h。若实施中真实超出，按 tasks §7 兜底条款登记拆分，不改 AC。

### 7. 建议的 Checklist R11 定向复核范围（供独立 A；本作者不勾选、不预判）

1. G1 / G1′：T-A15a 的拆分与移交是否完整（原 A15 标准 4 的语义无损）；T-B06 的挂载权、默认收起与 `currentJob` 替换作为重读信号是否满足 R-007 / AC-007-1，且未引入 §5.1 意义上的新 guard。
2. G2：`StageWorkspace` props 与 collect 分发、`CollectWorkspace` / `IntakeDrawer` 的接线与逐任务写入许可是否足以让实施者不越界。
3. G3 / G4：intakeStore 公开 / 内部成员、草稿与快照语义、写后刷新与池重读、选中替换、映射初值、错误口径是否在既有 what 内且无猜测空间；`ReliabilityLabel` 是否属 S-11 同机制的必要契约增量。
4. G5：T-A13a 是领域规则还是须 Walter §5.1 批准。
5. G6 / G7：`real-stubs.spec` 只追加一键的许可；旧用例与壳文件保护；回归命令覆盖。
6. O1：T-D02 / T-E03 / T-F03 增依赖 T-B06 是否正确。
7. §5 结构：73 / 107 h / 245 / 245；矩阵双向一致、部分前置为祖先、无新回边。

### 8. 结论（Analyze R21，当前索引）

- spec / plan / tasks / interface-handoff / implementation-log 一致；结构 73 个任务 / 107 h / 245 / 245 / 46 AC 双向一致，唯一回边 T-B03 → T-B04，无环；27 已完成 / 46 未开始，46 AC 最终验收 0，feature 未收敛。
- 本批 9 项（约 12 h，33 条命令）的接口、挂载、刷新与文件所有权已定型；所有缺口都落在既有 what / AC 内，没有删除或弱化任何已有验收，隐含依赖已显式化。
- **下一步**：独立 A 新会话 Checklist R11 定向复核，通过并提交后才可派 Astra（首选 openai/gpt-6-astra）。本报告不是审核结论，不勾选 checklist。

## Analyze R22（只读；Checklist R11 通过后的 P3 S-44～S-48 措辞 / 实施提示吸收 r6.12.1，2026-10-30；当前索引，R21 及更早轮次正文不改；区别于 Checklist R11，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1894d-29db-730d-9090-8d4c26c5575f`）。`claude-bridge` 本窗口既有限额、无重置证据，不重试；官方同模型调用成功；未改配置。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。工作树 = 计划树 `D:/2030/Futures-AI-interaction-plan-batch4`，起点 HEAD `1f99f80f547a53c5e996964907b533751e4cf804`（clean），没有新建 D:/2030 目录。本轮没有运行产品测试，没有写代码 / 测试 / fixture，没有改 spec / checklist / 旧 Review / 旧 Converge / docs，没有 commit。结构脚本 `refine-struct.py` 由本作者自写（依赖行先剥括注再取任务号，另报括注内的非依赖任务号），脚本、HEAD / WT dump 与日志在协调器 Temp `wi-batch5-01a18388-q7s7olxl/refine-work/`，不是项目产物。

### 1. 输入与性质

- 重读：AGENTS.md；`docs/plan.md`；Checklist R11 当前原件（`1f99f80`，`checklist.md` blob `27a76aa6c3e4adcb817fed5d9b6512e1853061dd`）的结论、「非阻断建议」S-44～S-48 全文与「阶段说明」；本文件 R21；plan / tasks 的【r6.12】全部段落；implementation-log 页首 / §8 / §20；interface-handoff 页首 / §1 / §3 r6.12 段；README 本 feature 两行。R10 是历史快照，勾选不动。
- R11 判**通过**（26 ☑ / 0 ☐，0 P1 / 0 P2），S-44～S-48 为 P3，明写“由作者 / 实施者自行决定是否吸收、不需重过 Checklist”。本轮只把这五项落成措辞 / 实施提示 / 登记，不改任何标准编号、命令、工时、依赖。

### 2. 吸收结论（逐项）

| # | 落点 | 结论 |
|---|---|---|
| S-44 | tasks T-B06 依赖行删去括注（依赖仍 T-B04 / T-A15a / T-A01a，说明已在状态行）；§6 UI 句标“r6.9 口径，现行依赖【r6.12 见下】”；T-B06 payload 摘要句与 implementation-log §20.5 写明 D / E / F 扩展 `InterventionHistory.vue` 须先显式写权限 | 已吸收；未预扩任何其他任务写入范围 |
| S-45 | tasks 页首 r6.12 第 4 点、T-A13a 状态行；plan 页首 r6.12.1 行与 §2.4【r6.12】R3-B 句；implementation-log 页首、§8 r6.12 段、§20.1 第 2 行、§20.4；interface-handoff 页首契约增量；README 本 feature 行 | “若须 §5.1 则 C03 照常 / 按未关闭 P3 处理 / 先做其余 8 项”的条件句全部删除或标废止，替换为 **R11 判定：T-A13a 属既有领域规则，可在现有授权内实施，不需 Walter 另批；R3-B 维持开放、未修，待第五批代码 Review**。依赖纪律写明：任一依赖未满足即阻塞。未借 R4-A 许可，未改任何 A 原件；R21 §2 / §6 / §7 中的同类原文按本轮要求不改正文，由页首说明其已废止 |
| S-46 | tasks T-C01 IntakePanel 提交句；plan §2.3 校验位置句 | File 元数据在选择 / 拖入边界 `safeParse` 一次；提交时只判 `fileMeta !== null`；url / text 原串与来源说明各 parse 一次；契约入口 parse 不变；标准 3 隐私断言不削减 |
| S-47 | implementation-log §20.5 派工提醒 ①～④ | happy-dom 原型 / spy / drop 可行性、种子取 j-deliver 同刻多 kind（不假定 j-collect 跨阶段）、`removeUpload.params.def.items[1]`、`jobFixtures` 注入 mapping 差异样例；只作实施提示，不增测试标准 |
| S-48 | tasks T-B06 修改范围、T-G08 / T-G10 上下文；implementation-log §20.5 | 登记 v1 侧栏常驻、内容默认收起、展开才读及其理由与人工看点（M-02 / M-09，以清单编号为准）；提示性，非新增硬 AC / 工程门；不加新颜色、不加默认展开机制 |

另：页首状态（tasks / implementation-log / README / interface-handoff / plan）由“待 R11”改为“R11 已通过（原件 `1f99f80`），第五批可开码、仍未实施，27 已完成 / 46 未开始”。

### 3. 结构复算（脚本只读；WT 对照 HEAD `1f99f80`）

- **WT = HEAD**：73 个任务，约 107 h（A 33 / 45.5、B 8 / 12、C 5 / 8.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h；状态 27 done / 46 todo / 0 other；完成标准 / 验证命令 245 / 245，逐任务 1:1、编号连续、每条标准含 AC（`PROBLEMS = []`）；`UNKNOWN_DEP = []`；`CYCLE None`；`BACKEDGES = [(T-B03, T-B04)]`（唯一有意回边，未新增）；spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR = []`；`BIDIR_BAD = []`（AC-009-1 的“每个任务的工程门”行按约定排除）。
- **第五批**：9 项 / 12 h / 33 条命令，依赖与 R11 核定一致；`T-B06 ∈ ancestors(T-C04)`、`T-A15a ∈ ancestors(T-A17)` 为真，`T-A15a ∉ deps(T-A15)`。
- **逐任务 dump**（预计 / 依赖 / 状态 / 每条标准与命令的全文）HEAD 与 WT **逐字相同**：没有任何标准或命令被删减、放宽或改写；改动全部落在状态行、上下文、修改范围、页首与 §6 说明句。
- **括注内非依赖任务号**：HEAD 为 T-A22（“原依赖 T-A10”）与 T-B06（“原依赖 T-A15”）两处；WT 只剩 T-A22。T-A22 是已完成任务、T-A10 也已完成，不影响调度，按“已完成任务不改”保留，只在此登记。

### 4. 保护面

- `spec.md` blob `102af73bb448224fda5002430842868632b5b66a`、`checklist.md` blob `27a76aa6c3e4adcb817fed5d9b6512e1853061dd` 与 HEAD 相同；`git diff --stat` 只涉及 `specs/README.md` 与本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff；`frontend` / `backend` / `docs` / `AGENTS.md` / `HANDOFF.md` / 旧 Review / 旧 Converge 零差异。
- 冻结 spec / 46 AC 不变；方法集、契约、动作矩阵、九场景、样例表、迁移表、定稿语义不变；不是需求变更，不回 Clarify / Gate 1。

### 5. 结论（Analyze R22，当前索引）

- 五项 P3 已按 R11 授权吸收，均为措辞 / 实施提示 / 登记，**没有新机制**、没有新 guard / 写权限扩展 / 测试标准；结构 73 / 107 h / 245 / 245 / 46 AC 与唯一回边 T-B03 → T-B04 不变，无环。
- 原 R11 结论（通过，26 / 26）覆盖本轮，**按原 R11 可开码**，不再找 A 重新投票：第五批自 T-A01a 起按 tasks §6 DAG 串行实施（Implement 首选 openai/gpt-6-astra，新会话、实施树），任一依赖未满足即阻塞；派工提醒见 implementation-log §20.5。完成后走 Converge → 独立 A 代码 Review（R3-B 关闭与否由其判定）。
- 本报告不是审核结论，不勾选 checklist，不填 Gate 1 / Gate 2。

## Analyze R23（只读；第五批前 6 项实施后、T-C02 开码前的测试权限冲突最小范围修正 r6.12.2，2026-10-30；当前索引，R22 / R21 及更早轮次正文不改；区别于 Checklist R11，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1897e-0511-7342-b84e-b11df7e9957e`；通道同前轮，未改配置）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。工作树 = 计划树 `D:/2030/Futures-AI-interaction-plan-batch4`，起点 HEAD `6529f41833cb82a802824808cda1a37ecca427a8`（clean），没有新建 D:/2030 目录。本轮没有运行产品测试，没有写代码 / 测试 / fixture，没有改 spec / checklist / 旧 Review / 旧 Converge / docs / HANDOFF，没有 commit。结构脚本 `scope-fix-struct.py`（复制自 R22 的 `refine-struct.py`，逻辑未改）、HEAD / WT dump 与日志在协调器 Temp `wi-batch5-01a18388-q7s7olxl/scope-fix-work/`，不是项目产物。

### 1. 输入与性质

- 重读：AGENTS.md；`docs/plan.md`；spec（blob `102af73bb448224fda5002430842868632b5b66a`）；plan §2.3【r6.12 / r6.12.1】；tasks 页首与 T-C01 / T-C01a / T-C02 / T-C03 原文；Checklist R11（`1f99f80`，blob `27a76aa6c3e4adcb817fed5d9b6512e1853061dd`，26 ☑ / 0 ☐）；本文件 R22；implementation-log §20；真读 `frontend/tests/component/jobs/intake.spec.ts:252-283`、`frontend/src/jobs/stores/intake.ts` 与实施者摘要 `astra-drawer-preview-summary.md`。
- 事实：第五批前 6 项已由 Astra 实施并提交（`f65d3c6` / `e1cd4d4` / `a2efb98` / `0d09748` / `4af80e8` / `6529f41`），未经 Converge / Review。Astra 在 T-C02 开码前**按源读取**停下：T-C01 首例第 260 / 261 行 `expect(store).not.toHaveProperty('selection' | 'pool')` 与 T-C02 只读 `selection`（初值 null）/ T-C03 只读 `pool`（初值 `[]`）必然冲突，而 T-C02 / T-C03 修改范围写着“T-C01 / C01a 已有用例不改”。无 C02 WIP、无红测声明。
- 性质：tasks 内部的**阶段性断言与后续任务权限冲突**（tasks 自身缺口），不是 spec ↔ plan 冲突，不是新需求，不是模型调用失败。现有 `intake.ts` 以私有 ref + 对外 `computed` 暴露 `isOpen` / `jobId` / `draft`，同用例的 `Object.keys(store.$state)` 为 `[]` 断言因此对 C02 / C03 也可满足，无需放宽。

### 2. 修正（tasks / implementation-log；逐项）

| 落点 | 内容 | 结论 |
|---|---|---|
| tasks T-C02 修改范围 | “一律不改”句加注；新增【r6.12.2】唯一例外：首例标题改为 `starts closed with readonly H-5 state and internal view caches; DTO excludes jobId`，`not.toHaveProperty('selection')` → `expect(store.selection).toBeNull()`，`assertTypes` 内可加 selection 只读 `@ts-expect-error`；pool 行不动 | 负断言换成正向初值 + 类型层只读，**加强**而非删除 |
| tasks T-C03 修改范围 | 同上加注；`not.toHaveProperty('pool')` → `expect(store.pool).toEqual([])` + `expect(isReadonly(store.pool)).toBe(true)`，`assertTypes` 内可加 pool 只读 `@ts-expect-error`；标题沿用 C02 版 | 同上；`isReadonly` 已在既有 imports |
| 两例外共同保护面 | 该用例其余全部正向检查（isOpen / jobId / draft + readonly / `$state` 空 / 原 4 条只读 ts-expect-error / jobId 不可覆盖 / 分配 DTO 三输入）、其余用例、C01a 13 例、imports、helpers、describe 名、用例数、全部业务与隐私断言逐字保留；禁止 skip / only / todo、删移用例、Proxy / 不可枚举 / 惰性属性隐藏；以 `git diff` 限定行核对 | 不削减 AC-003-2 / 隐私 / 快照 / 刷新覆盖 |
| tasks 页首 | 新增 r6.12.2 当前块：6 项已实施待 Review、33 已实施（27 + 6）/ 40 未开始、停止点、修正、下一步 | 6 项状态行保留派工原文“未开始”，以页首为准 |
| implementation-log | 页首 r6.12.2 块；§20.2 旧用例保护段加唯一例外指针；新增 §21（停止点 / 实施者实测摘要 / 范围许可 / 待验证） | 实施者数字只引用，不冒称亲跑 |

命令覆盖：T-C02 命令 4、T-C03 命令 4 均跑 `intake.spec.ts` 整文件，覆盖例外；T-C01 命令 4 `-t "WI H-5 store"` 经 describe 名仍选中该用例，新标题不命中其他 `-t` 选择器（`WI AC-003-2` / `WI purpose required` / `WI metadata only` / `WI H-5 container` / `WI H-5 close` / `WI page mount` / `WI non-modal`）。plan 不需改（纯范围修正，selection / pool 设计未变）；interface-handoff 不改（H-5 公开成员不变，交付状态待 Review 后登记）。

### 3. 结构复算（脚本只读；WT 对照 HEAD `6529f41`）

- **WT = HEAD**：73 个任务，约 107 h（A 33 / 45.5、B 8 / 12、C 5 / 8.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h；完成标准 / 验证命令 245 / 245，逐任务 1:1，`PROBLEMS = []`；`UNKNOWN_DEP = []`；`CYCLE None`；`BACKEDGES = [(T-B03, T-B04)]`（唯一有意回边）；spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR = []`；`BIDIR_BAD = []`。第五批 9 项 / 12 h / 33 条命令，依赖不变。
- **逐任务 dump**（预计 / 依赖 / 状态 / 每条标准与命令全文）HEAD 与 WT **逐字相同**（`cmp` 一致）：没有标准或命令被删减、放宽或改写；改动只在页首与 T-C02 / T-C03 修改范围。
- **状态口径**：脚本按状态行计 27 done / 46 todo / 0 other，因第五批 6 项状态行按指示保留派工原文；真实进度以页首为准 = **33 已实施（27 已完成 + 6 已实施待 Review）/ 40 未开始**，46 AC 最终验收 0。

### 4. 保护面

- spec blob `102af73…`、checklist blob `27a76aa6…`（= R11 原件 `1f99f80`，26 ☑ / 0 ☐）与 HEAD 相同；`git diff --stat` 只涉及本 feature 的 tasks / analyze / implementation-log 与 `specs/README.md` 本 feature 行；`frontend` / `backend` / `docs` / `AGENTS.md` / `HANDOFF.md` / plan / interface-handoff / 旧 Review / 旧 Converge 零差异；`git diff --check` 无告警。

### 5. 结论（Analyze R23，当前索引）

- 冲突已按最小范围修正：只给 T-C02 / T-C03 各一条 `intake.spec.ts` 首例断言替换许可，负断言换为正向初值 + 只读断言；结构 73 / 107 h / 245 / 245 / 46 AC、唯一回边 T-B03 → T-B04、无环均不变。不是需求变更，不回 Clarify / Gate 1；R11 已审 selection / pool 机制未变，原 R11 覆盖，不重开 Checklist / 投票。
- **下一入口**：再派 Astra（openai/gpt-6-astra，新会话，实施树自 `6529f41`）按 DAG 做 T-C02 → T-C03 → T-C04，按 implementation-log §21.3 核对例外 diff；批末 Converge → 独立 A 第五批代码 Review（须核例外未削减业务 / 隐私断言并判 R3-B）。
- 本报告不是审核结论，不勾选 checklist，不填 Gate 1 / Gate 2。

## Analyze R24（只读；T-C02 开码前第二次源检查停后的最小 scope / 类型精度修正 r6.12.3，2026-10-30；当前索引，R23 / R22 及更早轮次正文不改；区别于 Checklist R11，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18989-2181-70b0-8a2d-5f03380ff6aa`；bridge 本窗口既有限额不重试，官方同模型调用成功；未改配置）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。工作树 = 计划树 `D:/2030/Futures-AI-interaction-plan-batch4`，起点 HEAD `af31ddaba357600235de5abf4ab0d138766eb1fb`（clean，= 实施树），没有新建 D:/2030 目录。本轮没有运行产品测试，没有写代码 / 测试 / fixture，没有改 spec / checklist / 旧 Review / 旧 Converge / docs / HANDOFF / interface-handoff，没有 commit。结构脚本（复制自 R23 的 `scope-fix-struct.py`，逻辑未改）、HEAD / WT dump 与日志在协调器 Temp `wi-batch5-01a18388-q7s7olxl/scope-fix2-work/`，不是项目产物。

### 1. 输入与性质

- 重读：AGENTS.md；`docs/plan.md`；spec（blob `102af73bb448224fda5002430842868632b5b66a`）；plan §2.3【r6.12 / r6.12.1】；tasks 页首与 T-C01 / T-C01a / T-C02 / T-C03（r6.12.2）；Checklist R11（`1f99f80`，blob `27a76aa6c3e4adcb817fed5d9b6512e1853061dd`，26 ☑ / 0 ☐）；本文件 R23；implementation-log §20 / §21；真读 `intake.spec.ts` 全 614 行、`stores/intake.ts`、`IntakeDrawer.vue`、`CollectWorkspace.vue`，及其他已运行 jobs 组件 / E2E 测试中的相关断言；实施者停止记录 `astra-preview-pool-summary.md`。
- 事实：Astra 第二次在 T-C02 开码前按源读取停下（无 WIP、无红测、未回退）：C01a 用例 `collect renders all input kinds in contract order and consumes readonly caches without modifying them` 第 528 行 `expect(collect.findAll('button')).toHaveLength(1)` 与 T-C02 每行“预览 / 修正”、T-C03 每行“删除来源”必然冲突；r6.12.2 例外只覆盖 `WI H-5 store` 首例。
- 另一个精度缺口（Plan 自查）：r6.12 要求预览读失败时 `ErrorState` 重试同一投放，但 `selection` 只在读成功后写入，失败时 Drawer 拿不到目标。
- 性质：tasks 内部的**阶段性测试约束与后续任务权限冲突** + 已审机制的类型 / 清理点精度；不是 spec ↔ plan 冲突、不是新需求、不是模型调用失败；两次停止都是正常范围结果，不换模型。

### 2. 修正（逐项）

| 落点 | 内容 | 结论 |
|---|---|---|
| tasks T-C02 修改范围 | 【r6.12.3】第二处已知例外：只把第 528 行整行替换为 `expect(collect.findAll('button').filter(button => button.text() === '投放到本作业')).toHaveLength(1)`；该用例标题 / setup / 其余断言与其他旧例逐字不动；禁止链接化 / 隐藏 / 条件渲染新按钮 | 从“阶段总数”纠正为“入口唯一”，入口点击 → `open(job.id)` 由同 describe 另两例真实覆盖；行级按钮由 C02 / C03 新测覆盖；**不删除验收覆盖** |
| tasks T-C02 / T-C03 | “一律不改”句与 r6.12.2 条加注“两处已知例外”；r6.12.2 首例例外内容原样保留；T-C03 继承第 528 行替换、不再改，仍只有 pool 行权限 | 例外仍逐行枚举，可用 `git diff` 限定核对 |
| tasks T-C02 只读扫描结论 | 无第三处冲突；列出须照常满足的既有断言（入口为首个 button、行首 `aria-hidden` 为状态徽图标且不嵌 `li`、默认无 `role="status"`、抽屉根类名 / 首 `h2` / 头部首按钮 / 非模态源码禁词 / 无 router 可挂载、`$state` 为空、T-C01a 全局选择器规则） | 只列确定冲突，不泛化“旧测试都可修” |
| plan §2.3 + tasks T-C02 / T-C03 store | 内部只读 `previewTarget: DeepReadonly<Upload> \| null`（初值 null，私有 ref + `computed`）：`selectUpload` 读前写副本；成功 `selection.mapping` 仍取 `upload.mapping`；`open()` 一并清；Drawer error 分支以它重试；C03 `assign` / `remove` 成功同 id（selection 或 previewTarget）清两者并复位 `previewStatus='idle'` / `previewError=null` | 类型精度，非新机制：H-5 四项、方法数、`selectUpload` / `confirm` / `submit` / 写后刷新语义不变；无通用 retry / 序号 / 取消 / guard |
| tasks 页首 / implementation-log / README | 页首 r6.12.3 块；implementation-log 页首 + §20.2 指针 + §22；README 本 feature 行 | 记账 |

**扫描范围与结果**：`intake.spec.ts` 中严格 DOM 总数类断言只有第 528 行冲突（第 488 / 499 / 611 行数抽屉实例）；`not.toHaveProperty` 只有第 260 / 261 行（R23 已处理）；`Object.keys` 两处不冲突（`$state` 为 `[]` 要求新字段含 `previewTarget` 走私有 ref + `computed`）。`job-detail` / `job-list` / `job-create` / `intervention-history` 组件测试与 `detail-stage` / `list-create` E2E 的相关断言或限定在子树、或不涉及采集区新元素、或已由 T-C01a 既有规则覆盖。**无第三处**。

**未做 / 不扩**：未改 `submit` / `confirm` 对 `previewTarget` / 预览读状态的处理（原语义未要求，按最小原则不扩）；`interface-handoff.md` 内部成员列举未补 `previewTarget`（不在本轮写入范围，H-5 交接成员不变，交付登记时同步）；未改 Checklist；R11 已审“同一投放重试”机制未改语义，由第五批代码 Review 核实际类型。

### 3. 结构复算（脚本只读；WT 对照 HEAD `af31dda`）

日志 Temp `scope-fix2-work/scope-fix2-verify.log`：

- **WT = HEAD**：73 个任务，约 107 h（A 33 / 45.5、B 8 / 12、C 5 / 8.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h；完成标准 / 验证命令 245 / 245，逐任务 1:1，`PROBLEMS = []`；`UNKNOWN_DEP = []`；`CYCLE None`；`BACKEDGES = [(T-B03, T-B04)]`（唯一有意回边）；spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR = []`；`BIDIR_BAD = []`。第五批 9 项 / 12 h / 33 条命令，依赖不变（C02 ← C01 / C01a / A23；C03 ← C02 / A13 / C01a / A13a；C04 ← C03 / B04 / B06）。
- **逐任务 dump**（预计 / 依赖 / 状态 / 每条标准与命令全文）HEAD 与 WT **逐字相同**（`cmp` 一致），结构日志亦相同：没有标准或命令被删减、放宽或改写；改动只在页首与 T-C02 / T-C03 修改范围。
- 脚本按状态行计 27 done / 46 todo（6 项状态行保留派工原文，未 Converge 回写，历史状态）；真实进度以页首为准 = **33 已实施（27 已完成 + 6 已实施待 Review）/ 40 未开始**，46 AC 最终验收 0。

### 4. 保护面

- spec blob `102af73…`、checklist blob `27a76aa6…`（= R11 原件 `1f99f80`，26 ☑ / 0 ☐）与 HEAD 相同；改动只涉及本 feature 的 plan / tasks / analyze / implementation-log 与 `specs/README.md` 本 feature 行；`frontend` / `backend` / `docs` / `AGENTS.md` / `HANDOFF.md` / interface-handoff / 旧 Review / 旧 Converge 零差异；R23 / R22 正文不改。
- 两处已知例外都是**阶段性测试约束纠正**，不是删除验收覆盖：AC-003-2 白名单、必填、metadata only（File / FileReader / `createObjectURL` 0 次）、`fai.jobs.v1` 不含正文、快照 / 刷新恰一次 / 失败不刷新、采集列表行序 / 种类 / 用途 / 状态徽 / 正文不显示 / 缓存不改等业务与隐私断言全部不动。

### 5. 结论（Analyze R24，当前索引）

- 第二处冲突已按最小范围修正：T-C02 只多一行断言替换许可（C03 继承），连同 r6.12.2 首例例外共两处，均逐行枚举、可 diff 核对；`previewTarget` 只补类型 / 清理点精度。结构 73 / 107 h / 245 / 245 / 46 AC、唯一回边 T-B03 → T-B04、无环均不变（以 §3 日志为准）。不是需求变更，不回 Clarify / Gate 1；R11 维持只读，不重开 Checklist / 投票。
- **下一入口**：再派 Astra（openai/gpt-6-astra，新会话，实施树）按 DAG 做 T-C02 → T-C03 → T-C04，按 implementation-log §21.3 / §22.5 核对例外 diff；批末 Converge → 独立 A 第五批代码 Review（核两处例外、`previewTarget` 实际类型与清理点，并判 R3-B）。
- 本报告不是审核结论，不勾选 checklist，不填 Gate 1 / Gate 2。

## Analyze R25（只读；第五批 9 项实施后的批次 Converge 一致性报告 r6.12.4，2026-10-30；当前索引，R24 / R23 / R22 / R21 及更早轮次正文不改；区别于 Checklist R11 与第五批代码 Review，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a189ab-7934-721a-8701-82b717fd3a18`；`claude-bridge` 本窗口既有限额、无重置证据，不重试；官方同模型调用成功；未改配置，不因任务结果换模型）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。工作树 = 复用 `D:/2030/Futures-AI-interaction-converge-batch4`（`docs/workbench-interaction-batch4-converge`，起点 HEAD `e609c2e54e02ba1d11912c5c10cf229ada025cba`，clean），没有新建 D:/2030 目录。本轮**没有运行任何产品测试**，没有写代码 / 测试 / fixture，没有改 spec / checklist / 旧 Review / 旧 Converge / docs / HANDOFF，没有 commit。结构脚本 `converge-struct.py`（复制自 R24 的 `scope-fix2-struct.py`，只增加“已实施”状态类与可起步清单，判定逻辑未改）、HEAD / WT dump 与日志在协调器 Temp `wi-batch5-01a18388-q7s7olxl/converge-work/`，不是项目产物。

### 1. 输入与性质

- 重读：AGENTS.md；`docs/plan.md`；`docs/interaction.md` §3.1 / §3.3 / §3.4 / §7.1；`docs/designUI.md` §1 / §2.4 / §3.3 / §3.5；冻结 spec（blob `102af73…`，46 AC）；plan 页首 r6.12～r6.12.3 与各【r6.12*】段；tasks 页首、§0 / §1 / §2a / §3、第五批 9 项完整原文、§5 / §6 / §7；Checklist R11 当前原件 `1f99f80`（blob `27a76aa6c3e4adcb817fed5d9b6512e1853061dd`，26 / 26，0 P1 / P2）；本文件 R21～R24；implementation-log §8 / §19～§22；interface-handoff；`review-batch3.md` R3-B、`review-batch4-r4a.md`（R4-A 关闭）。
- **代码**：固定 diff `b67a227..e609c2e -- frontend`（9 个前端提交，28 个文件，+3672 / −24），逐文件真读，不只看摘要；另外两个提交 `af31dda` / `19228ce` 只改文档，不计前端提交。
- **实测来源**：全部由 Implement（openai/gpt-6-astra）执行，本作者不亲跑；逐命令日志见 converge-batch5.md 页首。
- **性质**：AGENTS §2 第 9 步 Converge 的只读 Analyze。它比对实施后的代码与 spec / plan / tasks 是否一致，判断是否需要按 §9 补任务；不替代第五批独立代码 Review。

### 2. 逐任务 1:1（标准 ↔ 代码 ↔ 命令；命令原文不变）

| 任务 | 标准数 = 命令数 | 代码落点（摘要，详见 converge-batch5 §2） | 实施者结果 | 结论 |
|---|---|---|---|---|
| T-A01a | 3 = 3 | `types.ts` `ReliabilityLabel` / schema / 注册；生成物 | 2 / 72 / 门 | 满足 |
| T-A13a | 3 = 3 | `removeUpload` 在 `findUpload` / `writableJob` 后加 removed → validation_error；描述 | 2 / 29 / 门 | 满足；R3-B 待 A |
| T-A15a | 3 = 3 | 五处只加 `listInterventions`；strict filter；稳定升序；副本 | 9 / 3 + 24 / 门 | 满足 |
| T-B06 | 3 = 3 | `InterventionHistory.vue`（默认收起、展开才读、`props.job` 替换即重读、typed 摘要）；详情页两列挂载 | 8 / 2 / 13 + E2E 6 + 门 | 满足 |
| T-C01 | 5 = 5 | `IntakePanel.vue`（三输入、白名单、来源说明、一次校验、`intake-submit`）；`intake.ts`（H-5 四成员 + 草稿 / submit） | 13 / 4 / 2 / 6 / 门 | 满足 |
| T-C01a | 5 = 5 | `IntakeDrawer` / `CollectWorkspace` / `StageWorkspace` 分发 / 两页 `.intake-slot` | 1 / 1 / 10 / 1 + 门 / 30 + E2E 6 | 满足 |
| T-C02 | 4 = 4 | store 选中 / `previewTarget` / 预览读 / confirm；`ExtractionPreview` / `MappingEditor`；抽屉子区；行内“预览 / 修正” | 5 / 4 / 4 / 38 + 门 | 满足 |
| T-C03 | 4 = 4 | store 池 / assign / remove / `clearPreview` / `refreshViews`；`UnassignedPool`；行内删除确认 | 5 / 4 / 21 / 80 + 门 | 满足 |
| T-C04 | 3 = 3 | 新建 `e2e/jobs/intake.spec.ts`（只读快照与页面） | 1 / 2 / 1；五份 E2E 34 | 满足 |

合计 9 项 / 12 h / 33 条命令：标题全部存在，`test.each` 展开数与日志一致，新测试中没有 `skip` / `only` / `todo`。

### 3. 一致性（spec ↔ plan ↔ tasks ↔ interface-handoff ↔ implementation-log ↔ 代码）

- **spec**：未改（blob 与 SHA256 同 §1）。代码只落实 R-003（三种投放、来源说明、预览修正、待归属池、状态展示）、R-007（详情侧栏介入历史、无模态、删除二次确认）与 R-008（契约 +1 读方法 +1 展示映射）的既有 what；没有混入真实解析、URL 抓取、agent、D-020～D-024 或 v2 壳接线。
- **plan**：代码与 §2.1 / §2.2 / §2.3 / §2.4 / §3 的【r6.12 / r6.12.1 / r6.12.3】逐条一致。本轮只补【r6.12.4 精度（Converge batch5 登记）】，内容是实际类型 / 名称 / 写法：`ReliabilityLabel` 图标与方法数 25；`listInterventions` 的排序读法与 strict filter；`removeUpload` 的检查顺序；intakeStore 公开（H-5 四项）与内部成员（draft / selection / previewTarget / pool 及读写状态）的实际类型，以及源码中确认的类型别名 `IntakeDraft` / `IntakeSubmission` / `IntakeSelection`；`selectReceipt` 不改 `previewTarget` 的事实（引出 O-B5-3）；`StageWorkspace` / `CollectWorkspace` / 页面布局的实际写法（含只读 `useUiStore` 断点）。不改设计语义。
- **tasks**：9 项状态行回写为“已实施（第五批第 N 项；待第五批独立代码 Review）”，派工原文保留；页首 r6.12.4 块；§6 r6.12.4 行；T-B05 / T-F07 状态行末各加一条观察 O-B5-5 的阅读提示（非新增标准、不改范围 / 命令）。
- **interface-handoff**：页首 batch5 块、§1 batch5 口径、§3 batch5 落地核对（补上 r6.12.3 留待交付登记时同步的 `previewTarget`）。H-5 ① 候选 `e609c2e`、② R11、③ 待 A、④ 缺；页面切片同此；不拿 `6529f41` 当完整切片，不代 peer 签收。
- **implementation-log**：页首 r6.12.4 块；新增 §23（代码写权限、两次 scope 停止与两处明示例外、真实验证来源、派工模型 / 父基线、④ 未取得）。
- **README**：只改本 feature 两行。

### 4. 范围、需求与类型精度

- **范围**：逐提交文件 = tasks 修改范围 = implementation-log §20.2 写权限；禁写路径零差异（converge-batch5 §1）；`git diff --check` 通过。
- **需求**：没有超出 spec 的行为，也没有删减已审验收覆盖。两处测试例外是阶段性约束纠正，与 r6.12.2 / r6.12.3 许可逐行相同，正向断言没有被削减（converge-batch5 §3）。
- **类型精度**：已同步到 plan / interface【r6.12.4】，都是已审设计的落地，没有新增交接成员、方法或机制。H-5 交接仍只有 `open(jobId?) / close() / isOpen / jobId`。

### 5. 真缺口判断（按 §9 是否补任务）

- **结论：没有需要 Converge 按 §9 补的任务**。9 项标准逐条有代码与命令对应，没有发现代码偏离 spec / plan / tasks 的地方。
- **静读观察**（converge-batch5 §5，交 A，不预设严重度、不写防护）：O-B5-1 慢提交窗口内草稿被复位（含重复提交）；O-B5-2 迟到回执写入全局 selection；O-B5-3 `previewTarget` 不随 submit / confirm 同步，导致另一 id 的写入误清当前 selection（normal 下可确定复现；代码符合 tasks T-C03【r6.12.3】的字面规则，但与同段“其他 id 不动”的意图冲突，属设计精度缺口，建议 A 优先判定，最小修正方案已列出）；O-B5-4 选中快照与并发预览；O-B5-5 封存作业的采集入口（归 T-B05 / T-F07 边界）；O-B5-6 原生文件输入；O-B5-7 可靠性箭头图标；O-B5-8 断点 / 按钮容器写法；O-B5-9 H-5 定向命令粒度。
- **为什么不在本轮给 O-B5-3 加任务**：修正需要改 plan r6.12.3 明文（“未改 submit / confirm 对 previewTarget 的处理”）。它属于设计精度问题，不是“代码没按计划做”；先由 A 在代码 Review 中判定严重度，再按 §2 第 9 步登记（约 0.5 h，1 行 + 1～2 例），可以避免未审先改。O-B5-1 / O-B5-2 的任何修法都属 AGENTS §5.1，须先报 Walter。

### 6. 结构复算（脚本只读；WT 对照 HEAD `e609c2e`）

- **WT**：73 个任务，约 107 h（A 33 / 45.5、B 8 / 12、C 5 / 8.5、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h；状态 **27 done / 9 impl / 37 todo / 0 other**；完成标准 / 验证命令 **245 / 245**，逐任务 1:1、编号连续、每条标准含 AC（`PROBLEMS = []`）；`UNKNOWN_DEP = []`；`CYCLE None`；`BACKEDGES = [(T-B03, T-B04)]`（唯一有意回边）；spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR = []`；`BIDIR_BAD = []`；括注内非依赖任务号只有 T-A22（“原依赖 T-A10”，同 R22 登记）。
- **第五批**：9 项 / 12 h / 33 条命令，状态全部 impl，依赖不变；`T-B06 ∈ ancestors(T-C04)`、`T-A15a ∈ ancestors(T-A17)` 为真，`T-A15a ∉ deps(T-A15)`。
- **逐任务 dump**（预计 / 依赖 / 每条标准与命令全文）HEAD 与 WT 除 9 项 `status=todo → impl` 外**逐字相同**：没有任何标准或命令被删减、放宽或改写。
- **可起步**：依赖全部已完成的未开始任务 = T-A14 / T-A15 / T-A16；若把已实施待审也算作满足，另有 T-G04（依赖 T-C01a），按纪律须等本批 Review 通过。

### 7. 保护面

- spec blob `102af73…`、checklist blob `27a76aa6…`（= R11 原件 `1f99f80`）与 HEAD 相同；改动只涉及本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff、新建 converge-batch5.md 与 `specs/README.md` 本 feature 两行；`frontend` / `backend` / `docs` / AGENTS.md / HANDOFF.md / 旧 Review / 旧 Converge / checklist / spec 零差异；R24～R21 正文不改；`git diff --check` 无告警。
- 25 个本 feature 目录保留复用、不新建；main `072bb12` 未导入，继续 pin `90187f7`，R2-D 流程不变；Draft PR #12 保持 Draft、不合；不写 v2 树。

### 8. 结论（Analyze R25，当前索引）

- 第五批 9 项**已收口，待第五批独立 A 代码 Review**；没有发现对冻结 AC / plan / tasks 的明确违反，不新增任务；定形只是精度（r6.12.4）。结构 73 / 107 h / 245 / 245 / 46 AC、唯一回边 T-B03 → T-B04、无环均不变。
- 进度：**36 已实施（27 已完成 + 9 待 Review）/ 37 未开始**；46 AC 最终验收 0；feature 未收敛（含 H 组外部阻塞）。R3-B 代码已修、未关闭；R4-A / R2-C 维持关闭；其余 P3 未经风险接受。
- **下一入口**：集成人提交本轮文档 → A 新会话第五批代码 Review（固定 `b67a227..e609c2e -- frontend`，重点见 converge-batch5 §9）。本报告不是审核结论，不勾选 checklist，不填 Gate 1 / Gate 2。

## Analyze R26（只读；第五批 Review 通过后的 R5-A 普通业务一致性补修 r6.13 一致性报告，2026-10-30；当前索引，R25 及更早轮次正文不改；区别于 Checklist R11 与第五批代码 Review，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a189d7-be3b-715b-9d9c-7387dc6926eb`；`claude-bridge` 本窗口既有限额、无重置证据，不重试；官方同模型调用成功；未改配置；不因测试或审核结论换模型，也没有另找审核投票）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。工作树 = 计划树 `D:/2030/Futures-AI-interaction-plan-batch4`，起点 HEAD `fe9c2c92ac4d6778b0c7117a23b94919b2b71232`（clean），没有新建 D:/2030 目录。本轮**没有运行产品测试**，没有写代码 / 测试，没有改 spec / checklist / 原 Review / 原 Converge / docs / HANDOFF / 其他树，没有 commit。结构脚本 `r5a-struct.py` 复制自 R25 的 `converge-struct.py`，只增加 T-C04a 的祖先 / 后代打印，判定逻辑未改；脚本、HEAD / WT dump 与日志都在协调器 Temp `wi-batch5-01a18388-q7s7olxl/r5a-plan-work/`，不是项目产物。

### 1. 输入与性质

- **重读**：AGENTS.md；`docs/plan.md`；冻结 spec（blob `102af73…`，46 AC）；plan 页首 r6.12.3 / r6.12.4 与 §2.3【r6.12】【r6.12.3】【r6.12.4】；tasks 页首、T-C02 / T-C03 / T-C04 全文、T-B04a（补修先例）、T-G09 / T-H04、§5 / §6；Checklist R11（`1f99f80`，blob `27a76aa6…`，26 / 26，只读）；本文件 R24 / R25；implementation-log §22 / §23；interface-handoff 页首 / §1 / §3；`converge-batch5.md` §5 O-B5-3；**`review-batch5.md` 全文**（原件 `fe9c2c9`）。
- **真读源码与测试**（`fe9c2c9`，代码 = `e609c2e`）：
  - `stores/intake.ts` 全文：`selectReceipt` 只写 `selection` / `previewStatus` / `previewError`；`clearPreview` 的条件是 `selection.upload.id === id || previewTarget.id === id`；`submit` / `confirm` 成功都只经 `selectReceipt`。
  - `IntakeDrawer.vue`：只在 error 分支读 `previewTarget`。
  - `unassigned-pool.spec.ts` 全文（30 例）、`extraction-preview.spec.ts` 中的 `previewTarget` 断言、`intake.spec.ts`、`e2e/jobs/intake.spec.ts` 全文（4 例与 helpers）。
- **性质**：
  - 第五批 Review 判通过（0 P1 / 0 P2 / 5 P3），R3-B 技术关闭。
  - R5-A 由 A 明判为普通业务流程一致性问题、非 §5.1 防线，可按 AGENTS §2 第 9 步登记；集成人选择现在只修 R5-A。
  - 本轮 = 该补修的 Task / Plan 一致性分析。不是需求变更，不是新机制，不改审核结论。

### 2. 修正（逐项）

| 落点 | 内容 | 结论 |
|---|---|---|
| plan 页首 r6.13 + §2.3【r6.13 成功回执同步】 | 私有 `selectReceipt` 写 `selection` 时同时写 `previewTarget` = 回执 upload 的 `structuredClone` 副本，submit / confirm 共享、自然同步；成功回执后 `selection.upload` 与 `previewTarget` 是同一个当前投放；`clearPreview` 条件不变 → 删除 / 归入另一 id 不误清；r6.12.3“`previewTarget` 不变”只指 `selectUpload` 读成功路径、仍有效；r6.12.3 页首 / R24“未改 submit / confirm 对 previewTarget 的处理”与【r6.12.4】事实登记自 r6.13 起失效（原文保留，r6.12.4 句末加注） | 是 R11 已审“当前预览目标”语义的一致落实；普通成功路径中的一次赋值，不加序号 / 锁 / 比较 / 禁用 / guard，不改 UI / 契约 / jobsStore / query / H-5 |
| plan §5 AC-003-4 行 | 补 R5-A 落点（T-C04a，与 T-C02 共同承接） | 验收落点与 tasks 矩阵一致 |
| tasks 新 **T-C04a** | 0.5 h；依赖 T-C03 / T-C04（均已完成，Review 过代码）；排 C04 后、D01 前；修改范围确定 3 文件；3 条标准 / 3 条命令，均引用 AC（AC-003-4 最终 ×2、AC-009-1 部分前置） | 编号前向、无新回边；不新增冻结 AC |
| tasks 9 项状态行 | “已实施（待第五批 Review）”→“**已完成（第五批 Review 通过，非最终 AC）**（`fe9c2c9`）”，【A 前原文】保留；A13a 记 R3-B 技术关闭；C01 记 R5-B / R5-D 未修；C02 / C03 记 R5-A → T-C04a（待实施、未关闭）、R5-C 未修 | 状态记账，标准 / 命令 / 工时 / 依赖不改 |
| tasks T-G09 | 依赖增 T-C04a（r6.13）；标准 / 命令 / 工时不改 | 全量检查与 T-H04 复验必经修复 |
| tasks §5 / §6 / 页首 | AC-003-4 最终 = T-C02 + T-C04a，增两条 R5-A 命令；原 C02 标准与命令保留不削；§6 r6.13 行；页首 r6.13 块 | 记账 |
| implementation-log / interface-handoff / README | 页首块 + §24（派工、模型、写权限表、前置、命令期望）；H-5 / 页面切片“候选 `e609c2e` 生产已核但已知 R5-A 待修，修后更新 ①，④ 缺”；README 本 feature 两行 | 记账；不填 ④，不代 v2 消费 |

### 3. scope 与源码可行性（精确到行）

- **生产**：`intake.ts` 的 `selectReceipt` 一行。`toRaw` / `structuredClone` 写法在 `selectUpload` 已有，无需新 import。修复后 `previewTarget` 只在 error 分支被 UI 读取，所以不改任何渲染路径。失败路径不调用 `selectReceipt`，`WI assign refresh` / `%s failure …` 等失败例不受影响。
- **组件测试**：`unassigned-pool.spec.ts` 追加 `WI R5-A` 2 例（`test.each(['assign','remove'])`）。正常业务链为 loadPool → selectUpload A → submit 文本 B（`jobId` null）→ 正断言同步 → editMapping B → assign / remove A → B 的选中 / 草稿 / target 保持 → confirm → target 与 selection 的 status / mapping 等于回执。B 的合成映射 `{合成列 1, 待映射, 待确认}` 合法，改 `targetField` 即可确认。现有 imports（`toRaw` 等）与 `connect` / `note` 足够。
- **唯一旧例冲突（源读取确认）**：`%s clears a receipt-only selection without a preview target`（第 452–461 行）第 456 行断言 submit 后 `previewTarget` 为 null，这正是 R5-A 缺陷状态，修复后必红。tasks 只许改该例 3 行：标题；第 456 行改为正断言；写后追加 `previewTarget` 为 null。用例数不变，文件仍是 30 + 2 = 32。
  - 其他 `previewTarget` 断言都不受影响：第 260 / 342 / 383 / 475 行是同 id 写成功后为 null；第 356–364 / 393–397 / 437–447 行是失败或其他 id 下保持同一引用，均不经 `selectReceipt`；第 379 行是读失败后的 target。
  - `extraction-preview.spec.ts` 第 140 行在 submit 之前、第 156 行在 `open()` 之后；`intake.spec.ts` 与全部 E2E 没有相关断言。**没有第二处**。
  - 偏离说明：派工口径原写“原 30 例逐字保留”，按“以真实源码与测试可行为准”如实登记这 1 例 3 行，交 A 增量 Review 核对。
- **E2E**：`e2e/jobs/intake.spec.ts` 追加 1 例 `WI R5-A…`。真实 UI 链在 normal 下运行：预览 A（`j-collect-source-1`）→ 同抽屉提交 B → 记 B 已保存的 mapping → 编辑“目标字段 1” → 快照不变 → 删除 A → 预览仍为 B、输入框仍为编辑值、快照仍为原值 → 确认 → 快照为编辑值、状态“已入库”。复用 `snapshot` / `fillText` 与现有 imports，不改原 4 例；不用窗口钩子 / fixture / 直接 API 写。
- **期望数字**（来自 A 亲跑基线 + 增量；实际以实施者与 A 亲跑为准）：组件 2 / 32；E2E 1 / 79（78 + 1）；全量 39 files / 1130 / 0；contract 25 / 10 / 2；`git diff --stat e609c2e HEAD -- frontend` 只有 3 个文件（`e609c2e..fe9c2c9` 没有 frontend 差异，本轮也只改文档）。

### 4. 结构复算（脚本只读；WT 对照 HEAD `fe9c2c9`）

日志 Temp `r5a-plan-work/{HEAD,WT}.struct.log`：

- **HEAD**：73 / 107 h / 245 / 245；27 done / 9 impl / 37 todo（= R25）。
- **WT**：
  - 规模：**74 个任务，约 107.5 h**（A 33 / 45.5、B 8 / 12、**C 6 / 9**、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4），每项 0.5～2 h；状态 **36 done / 0 impl / 38 todo / 0 other**。
  - 标准 / 命令：完成标准 / 验证命令 **248 / 248**，逐任务 1:1、编号连续、每条标准含 AC（`PROBLEMS = []`）。
  - 依赖与矩阵：`UNKNOWN_DEP = []`；`CYCLE None`；`BACKEDGES = [(T-B03, T-B04)]`（唯一有意回边，T-C04a 无回边）；spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR = []`；`BIDIR_BAD = []`；括注内非依赖任务号仍只有 T-A22（“原依赖 T-A10”）。
  - T-C04a：0.5 h，依赖 [T-C03, T-C04]，3 条标准，todo。`T-C04a ∈ deps(T-G09)`，且是 T-G09 / T-G10 / T-H01～T-H04 的祖先；其他 46 行矩阵的祖先关系未变。
- **逐任务 dump**：HEAD 与 WT 的差异只有三类，其余任务的预计 / 依赖 / 标准 / 命令全文**逐字相同**：
  - 9 项 `status=impl → done`；
  - 新增 T-C04a 一节；
  - T-G09 依赖 + T-C04a。
  没有任何旧标准或命令被删减、放宽或改写。
- **可起步**（依赖全部已完成的未开始任务）：T-A14 / T-A15 / T-A16 / **T-C04a** / T-G04。

### 5. 保护面

- 以下 blob 与 HEAD 相同，本轮未改：spec `102af73…`；checklist `27a76aa6…`（= R11 原件 `1f99f80`，只读不勾）；`review-batch5.md` `61bff89…`；`converge-batch5.md` `1f5c95d…`；`review-batch4.md` / `review-batch4-r4a.md` 及更早 Review / Converge。
- 改动范围：只有本 feature 的 plan / tasks / analyze / implementation-log / interface-handoff，以及 `specs/README.md` 本 feature 两行。`frontend` / `backend` / `docs` / AGENTS.md / HANDOFF.md 零差异；本文件 R25 及更早正文不改（只在末尾追加 R26）；`git diff --check` 无告警。
- **未扩**：
  - R5-B / R5-C 的任何防线（§5.1，须 Walter 本人决定，本轮不请求）；
  - R5-D（file 输入 / `inputKind`）、R5-E（图标），以及并发 state、R4-B～R4-E、S-41、R3-C 等旧 P3：均未经风险接受，也不借 R4-A 许可。
- **合并策略不变**：Draft PR #12 保持 Draft；main `072bb12` 不导入；不写 v2 树。

### 6. 结论（Analyze R26，当前索引）

- spec ↔ plan r6.13 ↔ tasks T-C04a ↔ implementation-log §24 ↔ interface-handoff 一致，无冲突或歧义残留。
  - 现在生效的口径是 r6.13“成功回执同步”；r6.12.3 原句只作历史追溯。
  - scope 确定为 3 文件，含 1 处源读取确认的旧例冲突（3 行）。
  - 结构 74 / 107.5 h / 248 / 248 / 46 AC，唯一回边 T-B03 → T-B04，无环。
  - 进度：**36 已完成 / 38 未开始**；46 AC 最终验收 0；feature 未收敛（含 H 组外部阻塞）。
- 不是需求变更，不回 Clarify / Gate 1。R11 仍有效，不重开 Checklist、不另设 Checklist。
- **下一入口**：集成人提交本轮文档 → Implement（openai/gpt-6-astra，新会话）做 T-C04a → Converge → A 新会话代码增量 Review（对象 `e609c2e..<T-C04a 提交> -- frontend`，重点核：一行修复、旧例 3 行例外、无第二处、无 guard）。本报告不是审核结论，不勾选 checklist，不填 Gate 1 / Gate 2。

## Analyze R27（只读；T-C04a 实施后的 R5-A 增量 Converge 一致性报告，2026-10-30；当前索引，R26 / R25 及更早轮次正文不改；区别于 Checklist R11 与第五批 / R5-A 代码 Review，**不是**审核结论）

> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a189eb-e03e-755d-b516-41616d94c44c`；`claude-bridge` 本窗口既有限额、无重置证据，不重试；官方同模型调用成功；未改配置；不因测试或审核结论换模型）。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。工作树 = `D:/2030/Futures-AI-interaction-converge-batch4`，起点 HEAD `f63ef7c62f273626e4ee72f94d16bfa53b52f148`（clean），没有新建 D:/2030 目录。本轮**没有运行产品测试**，没有写代码 / 测试，没有改 spec / plan / checklist / 旧 Review / 旧 Converge / docs / HANDOFF / 其他树，没有 commit。结构脚本 `r5a-converge-struct.py` 原样复制自 R26 的 `r5a-struct.py`（判定逻辑未改），脚本、HEAD / WT dump 与日志在 Temp `wi-batch5-01a18388-q7s7olxl/r5a-converge-work/`，不是项目产物。

### 1. 输入与性质

- **重读**：AGENTS.md；`docs/plan.md`；冻结 spec（blob `102af73…`）；plan 页首 r6.13 与 §2.3【r6.13 成功回执同步】、§5 AC-003-4 行；tasks 页首 r6.13、T-C04a 全文（3 标准 / 3 命令）、T-G09、§5 AC-003-4；Checklist R11（`1f99f80`，blob `27a76aa6…`，26 / 26，只读）；本文件 R26；implementation-log §24；interface-handoff r6.13 块；`review-batch5.md` §4 R5-A～R5-E 与 §7。
- **真读代码**：`git diff a2a2cdd f63ef7c` 全文（3 文件 +82 / −2）、`f63ef7c` 的 `stores/intake.ts` 全文、`src` 中 `previewTarget` 全部读点、两个测试的改动段与 harness；E2E 原 205 行字节前缀由本会话 `git show` + `cmp` 复核。测试数字只引用实施者日志（`astra-r5a-summary.md` + `astra-r5a-logs/`）。
- **性质**：T-C04a 实施后的增量 Converge（`converge-batch5-r5a.md`）。不是需求变更、不是新机制，不改任何审核结论。

### 2. 一致性（spec ↔ plan r6.13 ↔ tasks T-C04a ↔ 代码）

| 落点 | 代码事实 | 结论 |
|---|---|---|
| plan §2.3【r6.13】“`selectReceipt` 同时写 `previewTarget` = 回执 upload 副本；`clearPreview` 条件不变；不加 guard” | `selectReceipt` 首行 `previewTarget.value = structuredClone(receipt.upload)`；其余源码逐字不变；无序号 / 锁 / 比较 / 禁用 | 一致；plan 无需新版本 |
| tasks T-C04a 修改范围（3 文件；旧例恰 3 行；E2E 只追加） | 3 文件；旧例 hunk 恰标题 / 正断言 / 写后为 null 三行，用例数不变；E2E 原 205 行前缀 + 1 例 | 一致，无第二处冲突 |
| 标准 1 / 2 / 3 | 组件 2 → 32；E2E 1 → 79；39 files / 1130 / 0 + 工程门 + 三文件 diff（实施者执行；先红 2 / 1） | 3 / 3 满足（见 converge-batch5-r5a §2） |
| §5.1 边界 | R5-B / R5-C（待 Walter、未审批）、R5-D / R5-E 均未触及 | 授权内 |

### 3. 结构复算（脚本只读；WT 对照 HEAD `f63ef7c`）

- **HEAD**：74 / 107.5 h / 248 / 248；36 done / 0 impl / 38 todo（= R26 WT）。
- **WT**：74 个任务、约 107.5 h（A 33 / 45.5、B 8 / 12、C 6 / 9、D 3 / 5、E 3 / 5.5、F 7 / 12、G 10 / 14.5、H 4 / 4）；状态 **36 done / 1 impl（T-C04a）/ 37 todo / 0 other**；248 / 248，`PROBLEMS = []`；`UNKNOWN_DEP = []`；`CYCLE None`；`BACKEDGES = [(T-B03, T-B04)]`；spec 46 = 矩阵 46；`PARTIAL_NOT_ANCESTOR = []`；`BIDIR_BAD = []`；括注非依赖仍只有 T-A22（“原依赖 T-A10”）。T-C04a 仍 ∈ deps(T-G09)，后代 = T-G09 / T-G10 / T-H01～T-H04。
- **逐任务 dump**：HEAD 与 WT 只差 1 行——T-C04a `status=todo → impl`；所有任务的预计 / 依赖 / 标准 / 命令全文逐字相同。
- **可起步**（依赖全已完成的未开始任务）：T-A14 / T-A15 / T-A16 / T-G04。

### 4. 保护面

- 与 HEAD 相同、本轮未改：spec `102af73…`；checklist `27a76aa6…`（R11 原件，只读不勾）；plan；`review-batch5.md` `61bff89…`；`converge-batch5.md` `1f5c95d…`；更早 Review / Converge。`frontend` / `backend` / `docs` / AGENTS.md / HANDOFF.md 零差异；本文件 R26 / R25 及更早正文不改（页首加一行索引、末尾追加 R27）；`git diff --check` 无告警。
- 未扩、未经风险接受：R5-B / R5-C（§5.1）、R5-D / R5-E、R4-B～R4-E、S-41、R3-C 等旧 P3。R3-B 技术关闭（`fe9c2c9`）不变。

### 5. 结论（Analyze R27，当前索引）

- spec ↔ plan r6.13 ↔ tasks T-C04a ↔ 代码 `f63ef7c` ↔ implementation-log §25 ↔ interface-handoff 一致，无冲突或歧义残留；本任务无缺口、不新增任务。
- 结构 74 / 107.5 h / 248 / 248 / 46 AC，唯一回边 T-B03 → T-B04，无环。进度：**37 已实施 = 36 已完成 + T-C04a 1 项待 A**；**37 未开始**；46 AC 最终验收 0；feature **未收敛**。
- R5-A 代码已修、**未关闭**。不回 Clarify / Gate 1；R11 仍有效，不另开 Checklist。
- **下一入口**：集成人提交本轮文档 → 独立 A 新会话增量代码 Review（`a2a2cdd..f63ef7c -- frontend`，= `e609c2e..f63ef7c -- frontend`）。本报告不是审核结论，不勾选 checklist，不填 Gate 1 / Gate 2。
