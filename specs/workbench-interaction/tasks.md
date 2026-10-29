# Feature: workbench-interaction 任务清单（tasks.md）

> **当前状态（r6.12 第五批派工准备 = 采集台闭环开工前机制精度，2026-10-29；未审核、未实施；以本块为准。下一块 R4-A 关闭块中的“70 个任务、约 104.5 h”“43 未开始”“235 / 235”“下一步可起 T-A14 / A15 / A16 / C01”为当时原文，其完成记录与开放项仍有效）**：
>
> - **范围与顺序**：第五批 = **T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04**（9 项，约 12 h，33 条命令），同一实施树串行。process / analyze / deliver 工作区仍是占位。**不在本批**：D–F 组、T-A14 / T-A15（分析写）/ T-A16～A21、T-B05 / T-B07、角标 / 收件箱、持久化横幅（T-G04）、v2 壳接线、D-020～D-024、真实解析 / URL 抓取 / agent。
> - **从代码推断的缺口与最小落点**（plan【r6.12】；analyze.md「Analyze R21」）：
>   1. **介入历史**：T-C04 标准 2 要核对介入历史展开内容，但原依赖不含 T-B06，而 T-B06 依赖的 `listInterventions` 捆在 T-A15 的分析写里。→ 拆出 **T-A15a**（只读 `listInterventions`，0.5 h；原 T-A15 标准 / 命令 4 **移交**），T-A15 预计 1.5 → 1 h、改为 4 条标准；**T-B06** 依赖改为 T-A15a / T-A01a，补 JobDetailPage 侧栏挂载权与“默认收起、展开才读、以 `currentJob` 替换为重读信号”（1.5 → 2 h，标准 2 → 3）；**T-C04** 增依赖 T-B06。
>   2. **采集区接线**：新增 `stages/CollectWorkspace.vue`，`StageWorkspace` 只对 collect 分发（**T-C01a**，1 → 1.5 h，标准 4 → 5，第 5 条为详情 / 列表回归）；预览 / 映射 / 确认挂在 IntakeDrawer（**T-C02**，1.5 → 2 h，标准数不变）；待归属池与删除确认（**T-C03**，工时与标准数不变）。逐任务允许写的文件见各任务修改范围与 implementation-log §20。
>   3. **intakeStore**：公开 H-5 成员 `open(jobId?) / close / isOpen / jobId` 与内部草稿 / 选中 / 池的状态与动作定型（plan §2.3【r6.12】）；可靠性四值中文文案拆为 **T-A01a**（契约 `ReliabilityLabel`，0.5 h；原 T-C01 已顶格 2 h）。
>   4. **R3-B**：拆为 **T-A13a**（已删除投放再次 `removeUpload` → validation_error，0.5 h），T-C03 依赖它。它是否属既有领域规则、而非 AGENTS §5.1 的新 guard，**由 A 的 Checklist R11 判定**；若判为须 §5.1，则 T-A13a `blocked_by: Walter §5.1 批准`、R3-B 维持开放，C03 不受影响。本作者不自称授权。
>   5. **既有隐含依赖显式化**：T-D02 / T-E03 / T-F03 的端到端标准写“介入历史出现…”，却不依赖 T-B06 → 各增依赖 T-B06（标准 / 工时不改）。
> - **结构**（脚本复算，analyze.md「Analyze R21」§5）：**73 个任务、约 107 h**（A 33 / 45.5、B 8 / 12、C 5 / 8.5，其余组不变）；完成标准 / 验证命令 **245 / 245**；**27 已完成 / 46 未开始**；46 AC 最终验收 **0**；feature **未收敛**。唯一编号回边仍为 T-B03 → T-B04，无新回边、无环；AC 矩阵 46 行，部分前置都是最终任务的祖先，任务标准与矩阵双向一致。
> - **开码前置**：独立 A 新会话做 **Checklist R11 定向复核**，通过并提交后才可派 Astra。有效 Checklist 仍为 R10 `37e2f71`（blob `4537c55…`），它**不自动覆盖** r6.12 的新接口；本作者不勾选、不预判。冻结 spec / 46 AC 不变，不是需求变更，不回 Clarify。
> - **授权**：Walter 已批准既有 feature 实施与集成人 `01a18388` 的集成安排，且已选全部完成后再合 main；本块不预写任何实施或测试结果。作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18917-d5b2-7520-921c-f26458a30be1`；bridge 本协调窗口已明确 quota、无重置证据，不重试；同模型官方通道近期成功；未改配置）。

> **当前状态（R4-A 已关闭；第四批 5 项 + T-B04a 技术通过，记为已完成，2026-10-29；以本块为准。下方各块中的“待 A 增量 Review”“第四批 Review 未通过 / 不计完成”“R4-A 未关闭”“R2-C 待本批通过”“① 仍是候选”均为当时原文，已由本块取代）**：
>
> - **依据**：独立 A 增量 Review [review-batch4-r4a.md](review-batch4-r4a.md)（原件 `46e8fbef925faf83ca7cc1509a1490df27394172`；A = claude-fable-5-1 via anthropic，新会话 `01a188f3…`）判**本增量通过：0 P1 / 0 P2 / 0 新 P3**。结论：**R4-A 关闭；R2-C 技术关闭；第四批 5 项 + T-B04a 可判技术通过**。第四批原 Review（`review-batch4.md` 原件 `9812f64`，未通过）原样保留；本次是补修后的复核闭环，不是翻票。
> - **链路**：授权 `80a1892`（Walter 原话“那就先修P2等全部工作完成后，再合入main”= R4-A 最小修复的 §5.1 批准；不是风险接受、不是提前 Gate 2、不是立即清理）→ 代码 `ae592ba`（3 文件 +72 / −2，生产 diff 6 行，先红后绿）→ 增量 Converge / Analyze R20 `11a467f`（当时判收口、待 A，原文不改）→ A `46e8fbe`。
> - **A 亲跑**（本节只引用）：命令 1 = 2 → 13；命令 2 = 1 → 四份 E2E 30 / 0；命令 3 = 34 files / 1020 / 0 + typecheck / lint + 三文件 scope。另有六守卫、contract 24 / 10 / 2、routes + session 17、H-2 27、badges 48、job-list 12、v1 契约 88、real-stubs 23。真实 Chrome 只读探针 6 / 6：2a / 2b / 2c / 2d 不再发生，合法 canonical 正常。探针不计入 30 条正式 E2E。**未跑**：其余 7 份 E2E、全量 `pnpm test`、人工截图、后端、46 AC 最终验收。
> - **进度**：70 个任务、约 104.5 h；**27 / 70 已完成** = 21 + 第四批 5 + T-B04a 1（“已完成”= 批次 / 增量 Review 通过，不是 AC 最终验收）；**43 未开始**；235 / 235；46 AC 最终验收 **0**；feature **未收敛**。标准 / 命令 / 工时 / DAG / 矩阵不变。
> - **仍开放**（均未经风险接受）：R4-B～R4-E 四项旧 P3、S-41（T-B05 开工前精度轮）、R3-B / R3-C、R-A 等前批 P3（implementation-log §8）。R4-E（store 迟到写入，自愈）A 探针仍能观察到，本次没有修。
> - **H-x**：H-2·标签 ① `5c00cf6` 转为生产已核；所有切片 ④ 仍缺；页面切片 C 组未做 → 未交付。
> - **下一步**：按 §6 DAG 可起 T-A14 / T-A15 / T-A16 / T-C01（T-A16 / T-A19 开工前须先定案 R-A）。Walter 已选择全部工作完成后再合 main，不再等待归档 / 清理决定。Draft PR #12 保持 Draft，不 merge、不处理 main 冲突、不删除目录或分支。文中残留的【r6.11 草案，待批】标记（T-G09、§5、§6）按已生效读。见 implementation-log §19。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188ff-3aaa-7144-8323-7c67c8018ae9`；bridge 本窗口已明确 quota，不重试；官方通道成功；未改配置）。

> 【历史原文，“待 A 新会话增量 Review”“R4-A 未关闭”“5 项不计完成”已由上方 R4-A 关闭块取代】**当前状态（T-B04a 已实施 + 增量 Converge 已收口，待 A 新会话增量 Review，2026-10-29；以本块为准。下一块批准块中的“T-B04a 可开码、尚未实施”“44 未开始”为当时原文）**：
>
> - **实施**：T-B04a 代码 `ae592ba23b086dd5887a269e842f80c96ad16fb2`（父 = 授权提交 `80a1892`），openai/gpt-6-astra 新会话，未回退。`80a1892..ae592ba -- frontend` 共 3 个文件 +72 / −2：`JobDetailPage.vue` 只改 `watch` 回调（签名加 `onCleanup`、`let stale`、cleanup 置 true、canonical replace 前 `!stale`）；两个测试文件只追加 `WI R4-A` 2 / 1 例，原文件是逐字节前缀。store / query / 其他源码零差异。
> - **证据**（实施者执行，Converge 未重跑）：旧代码下先红（组件 2 failed、Chrome 1 failed，都被拉回 `/process`），修复后同一测试变绿：命令 1 = 2 → 13；命令 2 = 1 → 30；命令 3 = 34 files / 1020 / 0 + typecheck / lint + `6c082fd..HEAD -- frontend` 只含三文件。另跑六守卫、contract 24 / 10 / 2、routes + session 17、H-2 27 / badges 48 / job-list 12。其余 E2E、全量 `pnpm test`、截图、最终 AC 未跑。
> - **Converge**：[converge-batch4-r4a.md](converge-batch4-r4a.md) 判**本任务增量已收口、待独立 A 增量 Review**，没有发现缺口，不新增任务，plan 不改（无 r6.12），不是需求变更。
> - **进度**：70 个任务、约 104.5 h；**27 已实施** = 21 已完成 + 第四批 5 项已实施（原批次 Review 未通过，不计完成）+ T-B04a 1 项已实施待 A；**43 未开始**；235 / 235；46 AC 最终验收 **0**；feature 未收敛。结构复算见 analyze.md「Analyze R20」。
> - **未变**：
>   - R4-A 代码已修，**未关闭**，待 A 判定；第四批 Review 维持未通过；
>   - R2-C 关闭仍待本批通过；R4-B～E / S-41 / R3-B / R3-C 等 P3 未经风险接受；
>   - H-2·标签 ① 候选 `5c00cf6` 仍是候选，所有切片 ④ 缺；
>   - Checklist R10 `37e2f71` 只读 26 / 26。
> - **下一步**：A 新会话增量代码 Review（固定 `80a1892..ae592ba -- frontend` + 本轮文档提交），不需要用户再次批准 §5.1。按 Walter 的选择，feature 全部完成后再合 main：Draft PR #12 保持 Draft（远端 head 仍是 `e285ad2`），不 merge、不 resolve、不清理目录；main pin `90187f7` 与 R2-D 流程不变。见 implementation-log §18。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188e8-c8fd-7213-8e90-b721dc6bf792`；bridge 当前额度窗口已明确耗尽，不重试；同模型官方通道成功；未改配置）。

> 【历史原文，“T-B04a 可开码、尚未实施”已由上方实施后块取代】**当前状态（R4-A 最小修复已获 Walter §5.1 批准，plan r6.11 生效；T-B04a 可开码，2026-10-29；以本块为准。下一块中的“Walter 尚未回复”“blocked_by: Walter §5.1 批准”“获准前不派 Astra”为当时原文）**：
>
> - **批准**：集成人报告 R4-A 与 `onCleanup` 约 3～5 行最小方案及归档选项后，Walter 原话回复：**“那就先修P2等全部工作完成后，再合入main”**。这是对 R4-A 最小修复的 §5.1 单独批准，并选定先修、feature 全部完成后再合 main。**不是**风险接受、**不是**提前 Gate 2，也不批准扩到 store 取消 / 锁 / 请求序号 / query。
> - **范围**（= plan §2.1【r6.11】原文，不扩）：只改 `JobDetailPage.vue` 的 `watch` 回调（`onCleanup` + `stale` + canonical replace 前 `!stale`）；`job-detail.spec.ts` 只新增 `WI R4-A` 2 例；`detail-stage.spec.ts` 只新增 1 例；原 11 / 4 例不改；其他源码、store、query 禁止。T-B04a 标准 / 命令 / 依赖 / 工时不变。
> - **进度不变**：70 个任务、约 104.5 h；21 已完成 + 5 已实施（第四批 Review 未通过，**不计完成**）+ 44 未开始（T-B04a 已解除 blocked、尚未实施）；235 / 235；46 AC 最终验收 **0**；feature 未收敛。批准 ≠ 修完，R4-A 未关闭，第四批仍判未通过。
> - **流程**：不另开 Checklist R10.1 设计轮——A 原件已点名同一最小修复与测试范围，设计与任务已登记，缺的只是 §5.1 许可，现已到位；无新 what / 参数 / 机制。R10 `37e2f71` 保持只读 26 / 26。必须走 **Implement（新会话，首选 openai/gpt-6-astra，复用现有实施 worktree）→ Converge → A 新会话增量代码 Review**，不跳审、不自勾。实施中若发现草案外的真实设计问题，停下报告，不扩 scope。
> - **未变**：R2-C 关闭仍待本批通过；R4-B～E / S-41 / R3-B / R3-C 等 P3 未经风险接受；H-2·标签 ① 候选 `5c00cf6` 仍待新 A 复核，④ 未放行；其余 43 项未开始。文中其他【r6.11 草案，待批】标记（T-G09、§2a、§5、§6）内容不变，按本块读作已生效。
> - **远端上下文**（只记录，本轮不操作）：Draft PR #12（head = integration @ `e285ad2`，Draft、未设 automerge、DIRTY）保持 Draft，不合 main、不强推；main 继续 pin `90187f7`，R2D 流程不变。见 implementation-log §17。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a188da-1d90-7009-9405-316722985a4e`；bridge 本窗口额度耗尽、无重置证据，不重试；官方通道近期成功；未改配置）。见 analyze.md「Analyze R19」。

> 【历史原文，§5.1 等待状态已由上方批准块取代】**当前状态（第四批 Review 未通过 + R4-A 工程审批等待 = 批次安全点，2026-10-29；以本块为准。下一块 Converge batch4 中的“5 项已实施、待第四批独立代码 Review”“69 个任务、约 104 h”“232 / 232”“43 项未开始”“下一步 = 独立 A 代码 Review”为当时原文）**：
>
> **性质**：AGENTS §5.1 **工程变更审批**的硬边界，**不是**全 feature Gate 2、**不是** Handoff、也不是用户叫停。第四批 Review 原件判**未通过**，其中唯一 P2 = R4-A；修复需要新增一处 plan 明确不做的生命周期检查，须 Walter 本人对这一项单独批准。协调器已在本轮 commentary 向 Walter 报告 R4-A、触发概率、约 3～5 行的 `watch` `onCleanup` 失效标志与最小回归方案，**Walter 尚未回复**。把情况报告给集成人 ≠ Walter 同意。Walter 的通用代码授权（“允许”）仍然有效，但不覆盖这项新增 guard。**获准前不派 Astra、不写 guard 代码。**
>
> **进度**：**70 个任务、约 104.5 h**（新增草案 T-B04a 0.5 h）。
> - **21 项已完成**（`af95b66` 10、`f72a1a1` 6、`49edb7e` 4、`69faacc` 1）。
> - **5 项已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）**：T-B01 / T-B02 / T-A22d / T-B04 / T-B03，**不计完成**。
> - **44 项未开始** = T-B04a（草案，`blocked_by: Walter §5.1 批准`）+ 原 43 项。
> - 完成标准 / 验证命令 **235 / 235**（+3，全部来自 T-B04a）。46 AC 最终验收 **0**；feature **未收敛**。
> - **代码固定** `6c082fd60570a329771727be16b494f81775f957`；`6c082fd..9812f64` 只有文档提交。
>
> **第四批代码 Review**（`review-batch4.md`，原件 `9812f64666f8c1f1d8283bf4d7ebd9ae94b4e018`，只引用、不改写）：
> - **审核员**：A = claude-fable-5-1 via anthropic，PI_SESSION_ID `01a1881e-0d52-740b-8dea-83fca258f12f`，新会话、独立 worktree。
> - **固定输入**：文档 `adede0c` + 代码 `37e2f71..6c082fd -- frontend`（5 提交、17 文件、+1870 / −11）。
> - **结论固定不改**：**未通过：1 P2（R4-A）+ 4 P3（R4-B～R4-E），0 P1**。
> - **A 亲跑全部通过**，但不改变判定：全量单测 34 files / 1018 / 0；17 条任务命令用例数与实施者逐条相同；四份 E2E 29 / 0；六守卫、typecheck、lint、`contract --check` 24 / 10 / 2；v1 契约 88、real-stubs 23、routes + session 17、`WI H-2` 27。
> - A 判 5 项任务的完成标准**在代码层均满足**；R4-A 是 plan 已登记的 async 入口的生命周期缺陷。
>
> **R4-A（P2）**：`JobDetailPage.vue` 的 async `watch` 在 `await openJob` 之后无条件执行 canonical `router.replace`。组件卸载或参数变化只会停止再触发，不会使已在等待中的回调失效。
> - **复现**：A 用真实 Chrome 的 `?scenario=slow` 复现（无 stage 入口共两次读，各 1500 ms，窗口约 3000 ms）。侧栏离开、浏览器 Back、同作业内点“交付”，三种情况都会在约 3000 ms 后被拉回 `/process`；`/prices` 或列表页那条历史记录被 replace 覆盖（Back 可退到 `about:blank`），用户选的阶段被静默覆盖、不自愈。
> - **定性**：请求按序完成，**不是**乱序 / 后发先至，也不是 harness 伪影；plan §2.3 不加 guard 所依据的“mock 同延迟、按序完成”前提覆盖不到这种情况。
> - **概率**：normal 场景不可达；slow 场景下确定性复现；接真实 `api` 后，JobCard 默认的无 stage 链接每次都会打开这个窗口。
> - **修复草案** = **T-B04a**（0.5 h，**blocked_by: Walter §5.1 批准**，【r6.11 待批，不生效】）：`watch` 回调使用第三参数 `onCleanup`，加失效标志，只在 canonical replace 前检查；新增 2 例组件回归、1 例真实 slow E2E；原测试不改。获准后走 Implement → Converge → **A 新会话增量 Review**，之后才能关闭 R4-A、判本批通过。
>
> **流程纠偏**（不改 A 原件，只说明当前状态以 AGENTS 为准）：A 原件 §3 / §7 中“Gate 2 待 Walter”“选 (b) 风险接受可改判通过”属于流程建议文字，不能创设批次 Gate 2，也不能抹掉 P2。当前只是 §5.1 工程审批；全 feature Gate 2 仍在后续。在 P2 修复并经新 A 技术复核之前，本批 Review 仍判未通过。集成人建议 Walter **只批准最小修复**，不请求用风险接受把 P2 当作 P3 放行。模型不因 Review 结论红而回退，也不重新找 A 求通过。
>
> **其余未关项**（均未经 Walter 风险接受）：
> - **R4-B**（应用内导航不带 query）→ T-G01 / T-G05 阅读提示；壳级透传归 v2 Clarify。
> - **R4-C**（创建提示初始即渲染）→ T-G10 M-01。
> - **R4-D**（同作业重开先显示旧错误）→ T-B05 开工前的 plan 精度。
> - **R4-E**（store 迟到写入，自愈）→ `api` feature。
> - **R2-C**：代码修正经 A 核实无误；关闭条件是本批最终通过，**当前未满足，不记关闭**。
> - S-41 → T-B05 开工前精度轮；R3-B / R3-C 及前两批未关项归属不变（implementation-log §8）。
>
> **H-x**：
> - H-2·标签 ① 候选 `5c00cf6`（**不转生产已核**）、② R10 `37e2f71`、③ A 亲跑 48 / 18 / 9 / 21、④ 缺。
> - H-2·列表 ① 仍 `af24c82`；其余切片历史登记不变。
> - 页面切片：本批未通过，C 组未做 → **未交付**。
> - main `072bb12` 不导入，继续 pin `90187f7`（R2-D 流程不变）。
>
> **有效 Checklist**：R10 `37e2f71`（blob `4537c55…`，本轮未改）。T-B04a 获准后，是否需要 A 先做设计定向复核，按 A 原件 §3 (a)“登记小任务 → Implement → A 定向复核”的建议登记（analyze.md「Analyze R18」§5）；本轮不调用。
>
> **下一步**：等待 Walter 对 R4-A 最小修复单独批复（获准内容以 plan §2.1【r6.11】与 T-B04a 的边界为限）；在此之前不派代码。T-B05、C 组等其余任务排期由集成人决定，与本批未通过的关系见 analyze.md「Analyze R18」§4。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18834-f443-750c-ae53-bba830191e22`；`claude-bridge` 本协调窗口已确认 quota / rate / spend_limit，不重试；官方通道成功；未改配置）。本块是批次安全点记账，不是 Review / Gate 2 / Handoff。

> 【历史原文，进度 / 五任务状态 / 结构 / 下一步已由上方第四批 Review 未通过块取代】**当前实施进度（第四批实施后 Converge batch4 + r6.10 精度登记，2026-10-29；以本块为准。下一块 r6.9 派工准备中的“21 / 69 已完成、48 未开始”“当前未审核，不得开码”“有效 Checklist 仍为 R9”为当时原文）**：
>
> **进度**：**69 个任务、约 104 h**；**26 / 69 已实施** = **21 项已完成**（四次批次 / 增量代码 Review 通过：`af95b66` 10、`f72a1a1` 6、`49edb7e` 4、`69faacc` 1）+ **5 项已实施、待第四批独立代码 Review**（T-B01 / T-B02 / T-A22d / T-B04 / T-B03）；**43 项未开始**（A 组 T-A14～T-A21 共 8、B 组 T-B05～T-B07 共 3、C 5、D 3、E 3、F 7、G 10、H 4）。完成标准 / 验证命令 **232 / 232**（本轮不改任何预计 / 标准 / 命令 / 依赖）。46 AC 最终验收 **0**；feature **未收敛**（43 项未实施 + H 组外部阻塞）。
>
> **前置与固定提交**：开码前置 Checklist **R10 通过**（独立 A = claude-fable-5-1 via anthropic，PI_SESSION_ID `01a187cd-624c-71de-96e0-1767b222d743`；26 / 26，0 P1 / P2，P3 S-41～S-43；原件提交 `37e2f71aae5a625de7e39a3f4b2d9c0b1a9c7b38`，`checklist.md` blob `4537c55f226f0bdc4f39b19e7c369731cf23abba`，本轮未改）。代码 diff `37e2f71..6c082fd -- frontend`：5 个前端提交、17 个文件、+1870 / −11；`frontend` 外零差异。T-B01 `5c00cf695235155c4cfa9efb9df1fee06a161189` → T-B02 `0221a94bbd9aefe4b7d482f61e3e9017d0a25710` → T-A22d `ca7dca175150652b1026a831f1447fb6830028e4` → T-B04 `cc6559d7bb0b5afb0e233b8295dbd55f1de41d9d` → T-B03 `6c082fd60570a329771727be16b494f81775f957`。实施者 = openai/gpt-6-astra（三个新会话 `01a187e0…`（B01 / B02）、`01a187ee…`（A22d）、`01a187fa…`（B04 / B03），均首选、调用正常、未回退）。集成人已 ff-only 并入 `integration/workbench-interaction` @ `6c082fd`（旁证，不是 ④）；peer / v2 / main 未写。
>
> **17 条任务命令**（实施者执行，Converge 未重跑；前缀 `pnpm -C frontend`）：B01 = `WI AC-001-1` 2 / `WI AC-001-4 list` 4 / `WI badge tone` 21 + colors + glass / badges 整文件 48 + typecheck + lint；B02 = `WI AC-001-2` 6 / typecheck + lint（job-list 整文件 12）；A22d = `WI detail cache open` 4 / `states` 6 / `refresh` 6 / 整文件 43 + typecheck + lint；B04 = `WI AC-002-1` 6 / e2e `WI AC-002-2` 4 / 两文件 `WI AC-001-4` 9 / typecheck + lint；B03 = `WI AC-001-3 validation` 4 / e2e `WI AC-001-3` 1 / `WI non-modal` 1 + typecheck + lint。**回归**：B02 后全量 unit 32 文件 986、A22d 后 32 / 1002、末轮 **34 文件 1018 pass / 0 fail**；末轮 `check` 六守卫、`contract --check` 24 methods / 10 events / 2 artifacts、typecheck / lint、routes + session 17、`jobs-store -t "WI H-2"` 27（原集合不变）、store 43、badges 48、job-list 12、**四份 E2E 29**（shell + agent 24 + detail-stage 4 + list-create 1）。**未跑**：其余 7 份 E2E、全量 `pnpm test`、人工截图；无最终 AC 验收、无 Gate 2。
>
> **失败留痕**（新测试 / 新模板问题，原测试未改；不是模型调用失败，不回退）：B01 缺省 stage 断言 `''` vs undefined、happy-dom `border` 简写序列化；B02 单空格标题误判（5 个 fixture 标题都含空格）、2 条 lint 换行；A22d 对未开始阶段空 `artifacts[0]` 误断只读（改在有产物的 process）；B04 离开详情后“不再 getJob”的新断言与设计的锚重读不符（改期望、未加 guard）、2 条 lint 换行；B03 新测试 TS18046 ×2 / TS2339。详见 `converge-batch4.md` §2。
>
> **Converge 判定**（`converge-batch4.md`，analyze.md「Analyze R17」）：本批 **已收口、待第四批独立代码 Review**；无对冻结 AC 的明确违反，**不新增任务**，结构不变。实施定形只是类型 / 读法精度，记为【r6.10 精度（Converge batch4 登记）】（T-B01 / B02 / A22d / B04 / B03 修改范围末、plan §2.1 / §2.3）。静读观察 O-B4-1～6 交 A：O-B4-1 应用内导航不带 `route.query`（`agentScript` 每次 send 重读 URL，非 normal 场景点击后 reload 回落 normal），判为下游 e2e 观察、非 AC-002-2 / AC-008-2 明确违反，T-G01 / T-G05 状态行加阅读提示，若须修按 converge §5 的 ≤ 0.5 h 最小方案登记；O-B4-2 离开后迟到的 canonical replace（修需 guard，先报 Walter）。
>
> **P3 / 风险**：**R2-C** 代码已于 B01 修正，**待独立 A 代码 Review 确认关闭**。R10 **S-41**（spec §2 / R-001 含创建者、B04 按已审 r6.9 不显示）**明确归本 feature**：T-B05 开工前先做最小展示精度轮（Tasks / Plan + Analyze + A 定向复核），不改 spec、不移交、不扩已实施的 B04、不代 Walter 风险接受（T-B05 状态行已加提示）；**S-42** 已在测试中经真实 RouterView 落实；**S-43** 在 plan §2.3【r6.10】登记“真实 api 乱序归 api feature 决定、本 feature 不加 guard”。R3-B / R3-C 与前两批未关项不变（implementation-log §8），均未经 Walter 风险接受。
>
> **H-x**：H-2·标签 ① 候选 `5c00cf6`（待 Review；已审历史 `ebce4c8` 并存）、② R10、③ 实施者 18 / 9 + tone 21、④ 缺；H-2·列表公开成员不变、① 仍 `af24c82`（详情缓存是内部成员，`ca7dca1` 只在 interface-handoff §3 登记）；页面切片 B01 / B02 / B04 已实施，C 组未做、④ 缺 → **未交付**。上游 main `072bb12` 不导入（R2-D 流程不变）。
>
> **页面现状**：`/jobs` 列表（三态 / 筛选 / 新建）与详情（三态 / 详情头 / 阶段轨道 / URL 阶段）已是功能页，但四阶段工作区仍为 C–F 占位；业务处理、投放、取消、重跑、角标 / 收件箱、创建者展示均未做，**不得计为完成**。
>
> **下一步**：集成人提交本文档 → 独立 A 第四批代码 Review（只读输入与重点见 `converge-batch4.md` §9）。以 26 项已实施计入，依赖已满足、未开始的任务：T-A14 / T-A15 / T-A16 / T-C01。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1880c-8385-70eb-96c3-75402937cefb`；`claude-bridge` 本协调窗口已确认 quota / rate / spend_limit，不重试；官方通道真实调用成功；未改配置）。本块是 Converge 批次记账，不是 Review / Gate 2 / Handoff。

> 【历史原文，进度 / 开码前置 / 有效 Checklist 已由上方 Converge batch4 块取代】**第四批派工准备（r6.9，2026-10-29；以本块为准。下一块“T-A22c 增量代码 Review 后状态登记”中的“68 个任务、约 102.5 h”“227 / 227”“47 项未开始”“下一可起步”为当时原文；其 21 项已完成、Review / P3 / H-x 记录仍有效）**：
>
> **范围与顺序**：第四批 = **T-B01 → T-B02 → T-A22d → T-B04 → T-B03**（5 项，约 7.5 h = 2 + 1 + 1 + 2 + 1.5），同一实施树串行。四阶段工作区内容仍是 C–F 的占位。**不在本批**：T-B05（横幅 / 失败取消 / 取消作业）、角标（T-G02）、投放（C 组）、API 14+、v2 集成、D-020～D-024；不同步 main `072bb12`（继续 pin `90187f7`）；不写壳文件或 peer 树。
>
> **r6.9 精度**（不改冻结 spec / 46 AC；不回 Clarify；plan §1 / §2.1 / §2.3【r6.9】）：
> 1. **R2-C 归 T-B01**：首个徽标消费页面开工前修正三个徽标的边框令牌，按 plan §1【r6.9】表只用既有令牌，SourceBadge 中性。T-B01 预计 1.5 → **2 h**，新增标准 / 命令 3（`WI badge tone`）。
> 2. **T-B03 挂载点**：允许在 `JobListPage.vue` 挂“新建作业”按钮与内联面板。表单映射：主题空 → `null`、目标可空 → `''`，类型无默认；成功后经既有 `createJob` 一次 refresh 并跳 `/jobs/:id/collect`；失败以原错误显示可复制诊断。
> 3. **T-B03 依赖 T-B04**：端到端须核对详情页回显，而详情页由 T-B04 提供。保留编号、标准与 AC，执行顺序改为 B04 先于 B03。这是 §6 编号前向规则的**唯一有意回边**，真实拓扑无环。
> 4. **详情视图缓存拆为 T-A22d**（1 h，依赖 T-A10 / T-A22a / T-A22c）：原 T-B04 的 store 部分加上页面 / 轨道 / 三态 / 端到端，已知超过 2 h，按 Checklist R8 B-12 先例在 Tasks 阶段拆分。T-B04 仍 2 h，只消费 store、不改 `stores/jobs.ts`。
> 5. **测试 harness**：`jobs-store.spec.ts` 既有 27 例与 `routes.spec.ts` 9 例不改断言（routes.spec 只解析不挂载页面，预计无需维护；若真实失败，停下回报，不改断言 / `app/**` / 壳 E2E 来讨绿）。新 `e2e/jobs/*.spec.ts` 不改 playwright 配置；T-B03 端到端只读 `fai.jobs.v1` 业务快照，不加窗口钩子。
>
> **结构**（脚本复算，见 analyze.md「Analyze R16」）：**69 个任务、约 104 h**（A 30 / 44.5、B 7 / 11，其余组不变）；完成标准 / 验证命令 **232 / 232**（+1 T-B01、+4 T-A22d）。进度仍为 **21 / 69 已完成、48 未开始**，46 AC 最终验收 **0**，feature **未收敛**。DAG 真实拓扑无环；编号前向检查只有 1 条有意回边（T-B03 → T-B04）。AC 矩阵 46 行，部分前置均为最终任务的祖先。
>
> **开码前置**：独立 A 新会话做 **Checklist R10 定向复核**（范围：本批 UI 缓存 / 范围 / 依赖精度），通过并提交后才可派 Astra 开码。**当前未审核，不得开码。** 有效 Checklist 仍为 R9 `ab742f5`（blob `74084c13…`，未改、不勾）。
>
> **授权**：Walter“允许”与集成人 `01a18388` 在既有 tasks 内持续有效；本块不预写任何实施或测试结果。作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a187b5-a3e7-75a6-a499-74d51c9f9bbd`；bridge 本窗口已确认限额，不重试；官方通道成功；未改配置）。

> **当前实施进度（T-A22c 增量代码 Review 后状态登记，2026-10-29；以本块为准。下方“T-A22c 实施后增量 Converge”块中的“1 项已实施、待定向 Review”“R3-A = 代码已修、待 A 复核”“④ T-A22c 复核前不放行”“T-B01 是否等 A 复核”等都是当时原文）**：
>
> **进度**：**68 个任务、约 102.5 h**。**21 / 68 已完成**（四次批次 / 增量代码 Review 通过：首批 `af95b66` 10 项、第二批 `f72a1a1` 6 项、第三批 `49edb7e` 4 项 = T-A11 / T-A12 / T-A13 / T-A22a、增量 `69faacc` 1 项 = T-A22c）；**47 项未开始**。“已完成”= 所在批次代码 Review 通过，**不表示任何 AC 最终验收**：46 AC 最终验收仍 **0**；feature **未收敛**（47 项未实施 + H 组外部阻塞）。
>
> **T-A22c 增量代码 Review**（`review-batch3-cache-fix.md`，集成人原样提交于 `69faacccabd8b089a9f240b28e6449a8fea90619`，只引用、不改写）：审核员 A = claude-fable-5-1 via anthropic（新会话、独立 worktree，固定审文档 `eb91340` + 代码 diff `e7716a8..af24c82`）。判**本增量通过：0 P1 / P2、0 新 P3；R3-A 关闭**（探针 P1 / P2 在 `af24c826f41580d27f90ce611fb2f55fec44acbf` 上不再复现）。A 亲跑：`WI H-2 list status` **2**、整文件 **27**（原四组 5 / 4 / 7 / 9 保持）、typecheck / lint / `contract --check` 24 / 10 / 2；全量 `test:unit` 31 files / **953** / 0；六守卫；v1 三份契约测试 88；real-stubs 23；既有 shell + agent E2E **24** / 0；只读探针 6 例。**未跑**：其余 7 份 E2E、全量 `pnpm test`；无截图。第三批原 Review `49edb7e`（0 P1 / P2、3 P3）结论不变。
>
> **P3 状态**：**R3-A 已关闭**（`69faacc`）。**R3-B**（→ T-C03 / T-A17）、**R3-C**（→ T-G04）**仍未修、未经 Walter 风险接受**；前两批 P3（R-A～R-F、R2-A～R2-E）状态不变，见 implementation-log §8。
>
> **结构**（脚本复算，见 implementation-log §13）：68 个任务、约 102.5 h；完成标准 / 验证命令 **227 / 227**；依赖与 DAG 不变、无环；AC 矩阵 46 行、部分前置均为最终任务祖先。本轮只改 T-A22c / T-A22a / T-B01 / T-B02 状态行、§2a H-2·列表备注与本块；所有任务的预计 / 标准 / 命令不改字。有效 Checklist 仍为 **R9**（`ab742f5`，blob `74084c13…`，未改）。
>
> **H-x**：
> - **H-2·列表**：① `af24c82`（经增量 Review 核对；已审历史 `0032fc6` 保留）；② R9 `ab742f5`；③ 实施者与 A 亲跑同数（2 / 27 + 工程门，全量 953、E2E 24）。本方“T-A22c 复核前不放行 ④”的条件已解除；**④ 仍缺 → 待消费方集成（未交付）**。消费分支 `integration/frontend-workbench-v2` 只读观察仍为 `3f63273`、不含 `af24c82`。
> - **H-6** 仍缺 T-A21；**H-5 / 页面切片**未做；H-1 / H-2·标签 / H-3 / H-4 保留历史生产方证据，仍为待消费方集成（未交付）。
> - **页面现状**：`/jobs` 与详情页仍是 T-A22 骨架，jobsStore 只被 `main.ts` 订阅、无页面消费；写 API 中只有 `createJob` 经 store 接入，且无 UI 调用方。不能称作业页面已完成。
>
> **下一可起步**（依赖已满足）：T-A14 / T-A15 / T-A16、**T-B01**（之后 T-B02 / T-B04）、T-C01。T-B01 是首个消费徽标的页面任务，开工前按 implementation-log §8 R2-C 核对状态边框令牌映射（不新增色值）。批次划分由集成人决定。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1876b-2420-709d-b58f-04d6eed0d36f`；`claude-bridge` 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置）。本块是批次记账，不是 Review / Gate 2 / Handoff。

> 【历史原文，进度 / T-A22c 状态 / H-2 ④ 放行条件已由上方增量 Review 后块取代】**当前实施进度（T-A22c 实施后增量 Converge，2026-10-29；当时以本块为准。下方 r6.8 块中的“20 项已完成、48 项未开始”“T-A22c 待实施 / 代码未修”“下一可起步 T-A22c”等都是当时原文）**：
>
> **进度**：**68 个任务、约 102.5 h**。**21 / 68 已实施** = **20 项已完成**（三批代码 Review 通过：`af95b66` 10 项、`f72a1a1` 6 项、`49edb7e` 4 项）+ **1 项已实施、待定向 Review**（**T-A22c**，`af24c826f41580d27f90ce611fb2f55fec44acbf`）；**47 项未开始**。46 AC 最终验收仍 **0**；feature **未收敛**（47 项未实施 + H 组外部阻塞 + T-A22c 待复核）。
>
> **T-A22c**（R3-A 方案 b；实施者 openai/gpt-6-astra，未回退；基线 `e7716a8`）：代码 diff `e7716a8..af24c82` 只有 2 个文件。`jobs/stores/jobs.ts` 只删 `applyFilter` 成功分支的 `listStatus` / `listError` 两次赋值；`jobs-store.spec.ts` 新增 `WI H-2 list status` 两例，并把 filter 组的一例改为“只有显式 refresh 清错”，未删测试。结果由实施者执行，增量 Converge 未重跑：
> - **先红后绿**：修复前新两例分别以 `idle → ready`、base `error → ready` 失败；删两行后通过。
> - **三条任务命令**：命令 1 `2` pass；命令 2 整文件 `27` pass（原四组 25 + 新 2，`WI H-2 filter` 仍 4）；命令 3 typecheck / lint / `contract --check` 24 / 10 / 2 均通过。
> - **回归**：末轮全量单测 31 files / **953** / 0；六守卫；既有 shell + agent E2E **24** pass；4173 前后空闲；clean commit。
>
> 增量 Converge（`converge-batch3-cache-fix.md`，analyze.md「Analyze R15」）判：实施与 r6.8 逐条一致，无规格差距，**本任务增量已收口、待独立 A 增量 Review**。**R3-A = 代码已修、待 A 复核**，不由 Converge 判定关闭。R3-B（→ T-C03 / T-A17）、R3-C（→ T-G04）未改，未经 Walter 风险接受。
>
> **结构**（脚本复算）：68 个任务、约 102.5 h；完成标准 / 验证命令 **227 / 227**；依赖与 DAG 不变、无环；AC 矩阵 46 行不变。本轮只改状态行与本块，所有任务的预计 / 标准 / 命令都不改字。有效 Checklist 仍为 **R9**（`ab742f5`，blob `74084c13…`，未改）。
>
> **H-x**：
> - **H-2·列表**：① 候选 `af24c82`（待 A 增量复核）；② R9 `ab742f5`；③ 新组 2 / 整文件 27（原四组 25）pass + 工程门（实施者执行，待 A）。**④ 仍缺，T-A22c 复核前不放行**；生产方集成树 `af24c82` 只是旁证。
> - **H-6** 仍缺 T-A21；**H-5 / 页面切片**未做；H-1 / H-2·标签 / H-3 / H-4 仍为待消费方集成（未交付）。
>
> **下一可起步**：按依赖链（以 21 项已实施计入，沿用 batch3 口径），可起步的是 T-A14 / T-A15 / T-A16、T-B01、T-C01。`review-batch3.md` §8 要求 R3-A 在 **T-B02 / H-2 ④** 之前关闭；T-B01 是否等 A 复核后再派，由集成人决定。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a18755-53bb-72b4-87fa-bcc8b067eba0`；`claude-bridge` 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置）。本块不是 Review / Gate 2 / Handoff。

> 【历史原文，进度 / T-A22c 状态 / 下一可起步已由上方 T-A22c 增量 Converge 块取代】**当前实施进度（第三批独立代码 Review 后 + R3-A Converge 补修登记 r6.8，2026-10-29；当时以本块为准。下方 batch3 块中的“4 项已实施、待第三批独立代码 Review”“20 / 67、47 未开始”“67 个任务 / 约 102 h / 224 / 224”“下一可起步 T-B01”等都是当时原文）**：
>
> **进度**：**68 个任务、约 102.5 h**。**20 项已完成**（批次代码 Review 通过：首批 `af95b66` 10 项、第二批 `f72a1a1` 6 项、第三批 `49edb7e` 4 项 = T-A11 / T-A12 / T-A13 / T-A22a）；**48 项未开始** = 原 47 项 + 本轮新增的 **T-A22c**（R3-A 补修，0.5 h，待实施）。“已完成”= 所在批次代码 Review 通过，**不表示任何 AC 最终验收**：46 AC 最终验收仍 **0**；feature **未收敛**（48 项未实施 + H 组外部阻塞）。
>
> **第三批代码 Review**（`review-batch3.md`，集成人原样提交于 `49edb7ebf7bd0fdb0ab9ea0767c33945b39e13cf`，只引用、不改写）：审核员 A = claude-fable-5-1 via anthropic（新会话、独立 worktree，固定审文档 `e14ad25` + 代码 `0032fc6`，diff `ab742f5..0032fc6 -- frontend`）。判**本批通过：0 P1 / P2，3 项 P3（R3-A～R3-C）**，另 3 项不计入判定的观察 O-R3-1～3。A 亲跑：全量 `test:unit` 31 files / **951 pass / 0 fail**；本批 19 条任务命令同数通过；v1 三份契约测试 88；real-stubs 23；六守卫、`contract --check` 24 / 10 / 2、typecheck、lint；既有 shell + agent E2E **24 pass / 0 fail**；只读探针 8 例。R9 交代的隐私核对项（`fai.jobs.v1` 六键业务子集、Upload strict 白名单含既有 `quarantineReason`、无原文持久化、`mappingHistory` 每条投放至多一条）经 A 按真实 diff 与探针核对认可。本记账不改 Review 结论，也不找模型重新判定。
>
> **P3 处置**（均**未经 Walter 风险接受**）：
> - **R3-A**（jobsStore `applyFilter(f)` 成功分支改写未筛选列表的 `listStatus` / `listError`；A 探针 P1 / P2 复现）：集成人决定**现在修**，以免拖到 H-2·列表消费。按 AGENTS §2 第 9 步新增 **T-A22c**（≤ 0.5 h，依赖 T-A22a，排在 T-A22b 后、T-A23 前），采用 A 原件最小方案 **(b)**：`applyFilter(f)` 成功只写 `filter` / `filteredJobs`，即恢复 T-A22a【r6.6 精度】“只写两字段”的原意，不回 Clarify。plan §2.3 与 T-A22a 修改范围补【r6.8】精度。当前状态：**修复任务已登记、待实施；实施后由新会话 A 增量代码 Review 核 R3-A 关闭（其他 Review 结论保留）**。代码**未修**。
> - **R3-B**（重复删除产生冗余修订 / 事件）→ 留原归属 T-C03 或 T-A17；**R3-C**（`removeItem` 异常时 reset 的错误形态）→ 留原归属 T-G04。二者均未修，只在对应任务状态行加阅读提示。
> - 前两批 P3（R-A～R-F、R2-A～R2-E）状态不变，见 implementation-log §8。
>
> **结构**（脚本复算，见 analyze.md「Analyze R14」）：68 个任务、约 102.5 h；完成标准 / 验证命令 **227 / 227**（+3 = T-A22c），逐任务 1:1；依赖无环、全部前向；AC 矩阵 46 行，T-A22c 进入 AC-001-1 / AC-001-2 / AC-001-4 的部分前置。**依赖变化**：T-A22c ← T-A22a；T-B01、T-B02 各增依赖 T-A22c（T-B01 是 AC-001-1 的最终任务、也是 AC-001-4 最终任务 T-B04 的前置，又是 `listStatus` / `listError` 的第一个页面消费者；T-B02 是 R3-A 原件点名的筛选消费点）。46 AC、冻结 spec 不变；其他任务的标准 / 命令 / 预计不变。
>
> **前置**：有效 Checklist 仍为 **R9**（`ab742f5`，blob `74084c13…`，26 / 26，未改、不重勾）。T-A22c 是已审 Review 明确要求的 Converge 补修，不新增需求或机制，不需要重新设计 Checklist。Walter 的代码实施授权与集成人指定在既有 tasks 范围内持续有效。
>
> **H-x**：
> - **H-2·列表**：提供任务改为 T-A01 / A02 / A10 / A12 / A22a / **A22c**。① `0032fc6` 已审通过但含 R3-A，**仍待修**；② R9 `ab742f5`；③ 5 / 4 / 7 / 9 现另有 A 亲跑同数。**④ 未取得；T-A22c 关闭前不放行 ④**，修复后以其提交更新 ①③。
> - **H-6** 仍缺 T-A21；**H-5 / 页面切片**未做；H-1 / H-2·标签 / H-3 / H-4 仍为待消费方集成（未交付）。
>
> **下一可起步**（依赖已满足，脚本核）：**T-A22c**（建议先做）、T-A14 / T-A15 / T-A16、T-C01；T-B01 须待 T-A22c。批次划分由集成人决定。
>
> 作者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1873f-2338-7718-8e99-6609b56b7a8a`；`claude-bridge` 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置）。本块不是 Review / Gate 2 / Handoff。

> 【历史原文，进度 / 结构 / 下一可起步已由上方 r6.8 块取代】**当前实施进度（第三批实施后 Converge batch3，2026-10-29；当时以本块为准。下方 r6.6 块中的“16 / 67 已完成、51 未开始 / 本批全部待实施”和第二批 Review 后块中的“下一可起步 T-A11”都是当时原文）**：
>
> **进度**：**20 / 67 已实施**，其中前两批 **16 项已完成**（批次 Review 通过：首批 `af95b66`、第二批 `f72a1a1`），本批 **4 项已实施、待第三批独立代码 Review**；**47 项未开始**（A 组 T-A14～T-A21 共 8 项，以及 B 7 / C 5 / D 3 / E 3 / F 7 / G 10 / H 4）。46 AC 最终验收仍为 **0**。
>
> **第三批固定提交**（代码 diff `ab742f5..0032fc6 -- frontend`：5 个前端提交，17 个文件，+2318 / −26）：
> - T-A11 `c7ebccb8f9e29350d5a815959be3b532191bdb95`
> - T-A12 `742d6aa3d671cee91c6cce856f657a103d510615`，另有 A12 test-fix `0a2d1a5e756b4a469996d2069996a256f16722b9`（r6.6.2，只改 `persistence.spec.ts` 中 `WI non-normal` 的 error 分支）
> - T-A13 `a5ad11c79cf08ca50ebb55ef0984beae952a7dad`
> - T-A22a `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc`
>
> 同一区间内另有两个纯文档补记：`e4031fa`（r6.6.1）、`1988463`（r6.6.2，自 `8c4660f` 定向导入三份文档，A13 WIP 无损）。它们不计入源码提交数。集成人已把五个前端提交 ff-only 并入生产方集成树 `integration/workbench-interaction` @ `0032fc6`（旁证）；v2 树与其他消费方树都没有写。
>
> **验证**（实施者执行，Converge 未重跑）：
> - 19 条任务命令全部通过：A11 为 6 / 3 / 4 / 13 + 工程门（16 methods）；A12 为 11 / 5 / 10 / 5 + 工程门（20 methods）；A13 为 15 / 4 / 8 + 工程门（24 methods）；A22a 为 5 / 4 / 7 / 9 + 工程门。
> - 末轮 clean 树：全量 `test:unit` **31 文件 951 pass / 0 fail**；`check` 六守卫通过；`contract --check` 24 methods / 10 events / 2 artifacts；typecheck / lint 通过；既有 shell + agent E2E 24 pass。
> - **失败留痕**：A12 → A13 之间，在含 A13 WIP 的树上首次批量为 925 pass / 1 fail，原因是 T-A11 的旧 error 分支仍期待 commit 成功。Astra 按范围停下，经 r6.6.2 许可后单独提交 test-fix，之后 `a5ad11c` clean 树全量为 926 / 0。`742d6aa` 当时没有跑 clean 全量，不补造。
>
> **Converge 判定**（claude-opus-5-5 via anthropic）：本批范围**已收口、待第三批独立代码 Review**，未新增任务。feature 整体**未收敛**（47 项未实施 + H 组外部阻塞）。观察项 O-B3-1～6 交给 Review 判定，见 `converge-batch3.md` §5 与 analyze.md「Analyze R13」。
>
> **结构不变**：67 个任务 / 约 102 h，完成标准 / 命令 224 / 224，依赖 DAG、预估、标准与命令文字都不变。实施定形只按精度写入 T-A11 / A12 / A22a 修改范围【r6.7 精度】，不新增需求或机制。
>
> **前置与上游**：有效 Checklist 为 **R9**（`ab742f5`，blob `74084c13…`，26 / 26，未改）。main `072bb12` 不在祖先，继续 pin `90187f7`，R2-D 流程不变。
>
> **H-x**：
> - **H-2·列表**：提供任务齐，生产方 ①②③ 具备（③ 待本批 Review），④ 缺 → 待消费方集成（未交付）。
> - **H-6**：仍缺 T-A21，未交付。
> - **H-5 / 页面切片**：未做。
>
> **下一可起步**（依赖已满足）：T-A14 / T-A15 / T-A16、T-B01、T-C01。批次划分由集成人决定。
>
> 本块不是 Review / Gate 2 / Handoff。

> 【历史原文，已由上方 batch3 块取代进度部分】**第三批派工准备（r6.6，2026-10-29；以本块为准；开码前精度澄清，未实施、不预写结果）**：
>
> **范围**：**T-A11 → T-A12 → T-A13 → T-A22a**（4 项，约 7 h = 2 + 2 + 1.5 + 1.5），同一实施树串行。T-A22a 的依赖 T-A09a / T-A10 / T-A12 / T-A22 在本批内满足。**不在本批**：T-A14～T-A18、T-A21、B 组、投放 UI（T-C 组）、持久化横幅（T-G04）。进度仍以下一块为准（16 / 67 已完成、51 未开始）；本批完成后预计 20 / 67，不预写成功。
>
> **r6.6 只补既有 what / AC 的机制与类型精度**（plan §2.3 / §2.4 / §3【r6.6】；T-A11 / A12 / A13 / A22a 修改范围【r6.6 精度】）：
> 1. 持久化：读写时机、降级、损坏、重置的确定语义，以及 `persistence.ts` 的 API。
> 2. 写方法：签名与回执（`CreateJobInput`、`IntakeReceipt`，复用 `WriteReceipt`）；slow / error 下的写入时机；以作业为目标的写在入口查一次只读。
> 3. 投放写入规则：合成预览；confirm 只从 pending 出发；未归属投放不写事件；assign 移动记录；内部 `mappingHistory`。
> 4. 当前列表投影的唯一位置。
> 5. jobsStore 的类型与刷新口径。
> 6. 既有 jobs 回归：A11 起 normal 会话会持久化，`job-state-read.spec.ts` 中两例按新语义改写（属本任务语义变更处）。
>
> **结构**：完成标准 / 命令 **224 / 224 不变**（T-A11 标准 1 只补列一个既有字段）；67 个任务 / 约 102 h / 依赖不变。
>
> **硬约束文字**：唯一触及处 = 持久化白名单补列既有可选字段 `quarantineReason`，另登记内部 `mappingHistory`。隐私边界实质不变，提请第三批独立代码 Review 明确核对。是否在开码前另做 A 定向复核，由 Walter / 集成人裁量，本文件不代定；Analyze R12 认为不必。checklist R8.1（blob `99e096ad…`）未改、未勾。
>
> **上游与 H-x**：main `072bb12` 仍不在本树祖先，本批继续 pin `90187f7`，不自动同步（R2-D 流程不变，不是本批的人工门）。消费分支 `integration/frontend-workbench-v2` 仍为 `3f63273`，四项 ④ 仍缺；本 feature 不写、不重建 v2 树。
>
> **作者**：claude-opus-5-5 via anthropic（本轮协调器对 `claude-bridge/claude-opus-5-5` 的最小真实调用 exit 1，quota / rate / spend_limit 类；同模型官方通道 exit 0；本窗口不重试已明确限额的通道，未改配置）。详见 analyze.md「Analyze R12」。
>
> **r6.6.1 / r6.6.2 范围补记**（只扩测试文件写入许可，不改需求 / 标准 / 命令 / 结构）：r6.6.1 允许 T-A11 / A12 / A13 在 `real-stubs.spec.ts` 的 `requests` 表追加本任务新增方法键（Analyze R12.1）；r6.6.2 允许 T-A12 只改 `persistence.spec.ts` 中 `WI non-normal` 参数化用例的 error 分支，以符合已批准的 error 拒绝时机，T-A13 对该文件无许可（Analyze R12.2）。实施进度见 implementation-log §7 / §10；任务状态行由批次 Converge 回写，本补记不改状态。

> **当前实施进度（第二批独立 Review 后记账，2026-10-29；本块为准，取代下方 Converge batch2 块中“6 项已实施、待本批独立代码 Review”等当时原文）**：
>
> **进度**：**16 / 67 已完成**，**51 未开始**。“已完成”= 所在批次代码 Review 通过，**不表示任何 AC 最终验收**：46 AC 最终验收仍 **0**（本批多为“部分前置”；T-A23 只完成 AC-001-5 的组件半项，人工 M-01 归 T-G10）。
> - 首批 **10 项**：T-A01～T-A09、T-A09a，`af95b66` 批次 Review 通过，固定 commit 与验证结果不改写。
> - 第二批 **6 项**：T-A09b `75a1159`、T-A10 `1841029`、T-A22 `cc59e94`、T-A22b `b38cf43`、T-A23 `ebce4c8`、T-A24 `27e59e6`（代码固定 `27e59e610e2ab8c14e7c3db554609e52e40f5f76`，diff `34d339e..27e59e6 -- frontend`）。独立审核员 A = claude-fable-5-1 via anthropic（新会话、独立 worktree，固定审文档 `858025d` + 代码 `27e59e6`）判**本批通过：0 P1 / P2，5 项 P3（R2-A～R2-E）**；审核原件 `review-batch2.md` 由集成人原样提交于 `f72a1a187405e9f9dcba5bb22f47ad840141702d`（只引用、不改写）。
>
> **A 亲跑证据**（引自 `review-batch2.md` §1；本记账会话未跑任何测试）：全量 `test:unit` 27 files / 833 pass / 0 fail；三份既有 v1 契约测试 88 pass；本批 21 条任务命令全部通过且用例数与实施者逐条相同；H-2 旁证 `WI labels` 10 pass；`test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` 24 pass（Playwright 自管 4173，结束后无 LISTEN）；`contract --check` 15 methods / 10 events / 2 artifacts；`check` 六守卫、typecheck、lint 通过。**未跑**：全量 `pnpm test` 中其余 7 份 E2E；无人工截图。
>
> **P3 归属**（均未修、未经 Walter 风险接受；只在对应任务状态行加阅读提示，不新增标准 / 命令 / guard / 机制；台账见 implementation-log §8）：
> - R2-A（方法 describe 混入 mock 实现语义）→ T-G06，与 R-C 一并收口。
> - R2-B（未初始化模块状态的错误形态）→ T-A11 / T-A18 按正常调用顺序实施并以测试固定，不加 guard。
> - R2-C（三个徽标统一 ok 边框令牌）→ 首个消费徽标的页面任务（T-B01 / T-C04 / T-F01）或 T-G10 M-01 前，用既有令牌映射核对；本记账不改代码。
> - R2-D（`routes.spec` 与 pin 基线耦合）→ 同步 main `072bb12` 时按 §7 重核、重跑 Analyze、经 A 定向复核后再派指定范围小任务；不能用本批旧基线的绿冒充新基线。
> - R2-E（新读方法场景来源与 v1 不同）→ plan §2.4 已补一句精度（不改代码 / 行为），T-A18 沿用同一来源。
> - 首批遗留：R-B 部分落实（done 阶段上游 draft 不自动审批，未关）；S-37 正向断言已落实；R-A 仍须 T-A16 / T-A19 前定案；R-C / R-D / R-E / R-F 见 implementation-log §8。
>
> **结构不变**：67 个任务 / 约 102 h，标准 / 命令 224 / 224，46 AC，依赖 DAG 不变。
>
> **下一可起步任务**：**T-A11**（依赖 T-A10 已满足），之后按 §6 DAG（T-A12 等）。Walter 的代码实施授权（原话“允许”）与集成人指定在既有 tasks 范围内持续有效，后续批次不再重复请求授权；但不跳过逐批 Converge / 独立 Review，也不替代全 feature Review / Gate 2。
>
> **上游**：main `072bb12`（含 v2 S0）**不在**本批祖先，本批 pin `90187f7`；集成人决定本批不自动同步。同步前须走 §7 重核 → Analyze → A 定向复核，并与 v2 所有者协调 T-V2-09#4。这不是 T-A11 起步的硬阻塞。
>
> **H-x**：H-2·标签 / H-3·路由切片 / H-4 的生产方 ①②③ 齐（③ 含 A 亲跑）；**④ 未取得**——只读核对 `integration/frontend-workbench-v2` = `3f63273`，四个切片 ① 都不是其祖先。因此仍为“待消费方集成（未交付）”。H-1 同此。H-2·列表 / H-6 / H-5 / 页面切片的提供任务未齐，未交付。本块不是全 feature Review / Gate 2 / Handoff。

> 【历史原文，已由上方第二批 Review 后块取代】**实施进度（Converge batch2，2026-10-29；当时以本块为准，取代下方 r6.4 块里的“状态：blocked / 第二批不得开码 / 57 未开始”。那些是 R8.1 之前的历史原文，保留以便追溯审查输入）**：
>
> **进度**：**16 / 67 已实施**，**51 未开始**。
> - 首批 **10 项已完成**：T-A01～T-A09、T-A09a。固定 commit、验证结果和 `af95b66` 批次 Review 均不改写。
> - 第二批 **6 项已实施、待本批独立代码 Review**：T-A09b `75a1159`、T-A10 `1841029`、T-A22 `cc59e94`、T-A22b `b38cf43`、T-A23 `ebce4c8`、T-A24 `27e59e6`。
>
> **前置与集成**：
> - 开码前置已满足：Checklist **R8.1 通过**（26 / 26，B-12 关闭，1 项 P3 S-37），原件提交 `34d339eb1705310927f06d95aaf64bfc9bf4a5c3`，`checklist.md` blob `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`，本轮未改。当前有效 Checklist = R8.1，不再是 R7 `9acf3de`。
> - 实施者 = openai/gpt-6-astra，新会话，未回退。代码 diff 为 `34d339e..27e59e6 -- frontend`（6 个提交、25 个文件）。
> - 集成人已 ff-only 并入生产方集成树 `integration/workbench-interaction` @ `27e59e610e2ab8c14e7c3db554609e52e40f5f76`（旁证）。v2 任何树未写，H-x 的 ④ 全部仍缺。
>
> **验证（实施者执行、Converge 未重跑）**：每个任务的原定命令都已执行并通过，本批 21 条命令共计。末轮结果：
> - 全量 `test:unit` 27 文件 833 pass / 0 fail；`check` 六守卫通过；`contract --check` = 15 methods / 10 events / 2 artifacts；typecheck / lint 通过。
> - 既有 `e2e/{shell,agent}.spec.ts` 24 pass。
>
> **Converge 判定**（claude-opus-5-5 via anthropic）：本批范围**已收口、待本批独立代码 Review**，未新增任务。feature 整体**未收敛（尚未实施 51 项 + H 组外部阻塞）**；46 AC 最终验收 0。
>
> **本批不含**：T-A11 持久化、领域写方法、Agent 运行关联、jobsStore（T-A22a）、B 组页面功能。
>
> **下一可起步任务**：T-A11（其余均依赖 T-A11 / T-A12 / T-A22a 链）。
>
> **精度同步**：实施中定形的最小接口，按精度写入 T-A10 / T-A22 / T-A22b / T-A24 的修改范围（标【r6.5 精度】），不改完成标准、命令、编号、依赖或预估。
>
> **上游**：main 已到 `072bb12`（PR #11 v2 S0，含 `nav.ts` 的 `jobs` 占位等前端改动）。本批继续 pin `90187f7`，不自动导入。若同步，须按 §7 重核，见 `converge-batch2.md` §6。
>
> 详见 `converge-batch2.md` 与 analyze.md「Analyze R11」。

> **第二批粒度修订（r6.4，2026-10-29；以本块为准，取代下方 r6.3 块中的批次范围、T-A10 预估 / R-B 落点与结构数字；未实施、不预写结果）**：独立 A 的 **Checklist R8 未通过**（审 `8ad5e28`，原件由集成人提交于 `7b91a2c`；25 / 26 ☑，唯一 ☐ = V-02；唯一 P2 = **B-12** T-A10 粒度：r6.3 把 R-B fixture 校正并入已顶格 2 h 的 T-A10 而不调预估）。r6.4 按 B-12 最小关闭要求做 Tasks 层拆分，不再以“实际超 2 h 再停下拆分”兜底：① 新增 **T-A09b R-B 种子校正（fixture-only，0.5 h，依赖 T-A08，排在 T-A09a 后、T-A10 前）**——12 个未开始 (作业, 阶段) 种子置空、j-cancelled `previews={}`、j-collect / j-cancelled `reconciliations=[]`、`fixtures.spec.ts` 三处全作业循环收窄到已开始阶段并新增 `WI not-started seeds`，只用 `fixtures.spec.ts` 验收、不需要 DataClient 运行；② **T-A10 恢复核心 2 h**（不再许改 fixture / `fixtures.spec.ts`），依赖改为 T-A09、T-A09b，标准 5 只保留“真实 `getStageWorkspace` 读回 12 个种子空态”，命令 5 只对 `job-state-read.spec.ts` 按 `WI not-started seeds` 标题过滤（两份 spec 各有一个同名前缀用例，命令均带文件路径；R8 S-34 随之消解），工程门仍为标准 6；③ 同步 T-A07 / T-A08 状态行旁注与修改范围注、§5 矩阵（A09b 进入 AC-002-5 / AC-004-5 / AC-005-6 / AC-006-7 / AC-007-1 部分前置）、§6 DAG / 合计、§7 一句；顺带吸收 R8 非阻断 S-33（designUI 引用改为 §6 :214）、S-35（R-B 的 done 阶段上游 draft 产物残留：产物 status 与阶段态是独立维度，阶段 done ≠ 产物 confirmed，留后续核对、不为关 P3 自动审批，见 implementation-log §8）、S-36（T-A24 摘要分支具名判别，仅实施提示）。H-4 `bindRouter`、T-A23 自制徽标、T-A24 边界、R-D 口径（R8 已判设计通过）原样不动。**本批 = T-A09b、T-A10、T-A22、T-A22b、T-A23、T-A24（6 项，约 7 h = 0.5 + 2 + 1 + 1 + 1.5 + 1）**，顺序 T-A09b → T-A10；T-A22 → T-A22b；T-A23 / T-A24 独立，同一实施树串行。结构（Analyze R10 脚本独立复算）：**67 个任务、约 102 h**；完成标准 / 验证命令 **224 / 224**（r6.3 为 221 / 221；+3 = T-A09b，T-A10 仍 6 / 6）；本批命令 21 条（A09b 3、A10 6、A22 3、A22b 3、A23 3、A24 3）；首批 **10 已完成不变**（固定 commit / 验证结果 / `af95b66` Review 不改写），**57 未开始**（本批 6 + 其余 51）；46 AC、冻结 spec、依赖方向规则均不变，46 AC 最终验收仍 0。**状态：blocked**——第二批任何任务（含与 B-12 无关的四项）在 A 新会话 **R8.1 增量复核**关闭 B-12、补勾 V-02 并提交前不得开码；本作者不自宣关闭、不勾 checklist（R8 原件未改）。作者 = claude-opus-5-5 via anthropic（与前轮同模型，不因审核未过换模型；本轮协调器真实调用 `claude-bridge/claude-opus-5-5` 为 provider / invocation 失败，未确认 quota，官方 anthropic 通道成功；未改配置）。详见 analyze.md「Analyze R10」。

> **第二批派工准备（r6.3，2026-10-29；以本块为准；开码前精度澄清，未实施、不预写结果）**：本批 = **T-A10、T-A22、T-A22b、T-A23、T-A24**（5 项，约 6.5 h = 2 + 1 + 1 + 1.5 + 1），按 §6 DAG：先 T-A10；T-A22 → T-A22b；T-A23 / T-A24 独立，同一实施树串行。**不在本批、不提前实现**：T-A11 持久化、T-A12 起的写方法、T-A18 Agent 运行关联、T-A22a、B 组页面及其后任务。本批完成后 H-3·路由切片（T-A22）、H-4（T-A22b，其依赖 T-A02 / T-A22 在本批内满足）、H-2·标签（T-A01 + T-A23）的提供任务齐备，可形成生产方 ①③ 证据；④ 仍须 v2 集成树所有者真正集成后登记，本 feature 不代写、不改其树；H-2·列表 / H-6 / 页面切片 / H-5 仍缺后续任务。其余 51 项未开始、46 AC 最终验收 0，不因本批冒称通过。**r6.3 精度**（不改冻结 spec / 46 AC / 行为 / 方法集 / 依赖 / 总工时）：① **R-B 定案**——fixture-only，归 T-A10：plan 样例表中 `not_started` 阶段的内置种子为空工作区（T-A10 修改范围末段、新增标准 5 / 命令 5，原工程门顺延为 6）；② **R-D 口径**——本批不新增五处跨字段 refine，各项由 T-A12 / T-A13 / T-A14 / T-A17 / T-A18 / T-A20 的写方法按构造保持（implementation-log §8）；③ T-A22b 只读上下文的**生产路由绑定入口** `bindRouter(router)`；④ T-A23 不导入 `shared/components/Badge.vue`（基线事实：固定文案、无插槽 / 文案 prop，且不属本 feature，见 §0.0 r6.3 复核）；⑤ T-A24 行数上限的边界口径。完成标准 220 → **221**、验证命令 220 → **221**（逐任务 1:1）；任务数 66、101.5 h、依赖不变。R-A（T-A16 / T-A19 前）、R-C（T-G06）、R-E（T-A17）、R-F（T-A21）仍未处理。上游：main 已到 `cf8e11b`，相对 `90187f7` 只改 `specs/README.md` 与 frontend-workbench 文档 / 截图证据（frontend / docs / AGENTS / backend / design 零差异），实施继续 pin `90187f7` upstream，正式 base 仍 `43b6d79`，不自动合入。checklist R7（blob `7c219c07…`）未改、未勾。**复核建议**：T-A10（R-B 即首批 A 自身建议的落法）/ T-A22 / T-A24 可直接开工；T-A23 的基线事实修正（§7 “§0 不符 → 修订 + 重跑 Analyze + 经 A 复核”一类）与 H-4 `bindRouter`（交接接口新增成员名，R7 只审过机制）建议先由 A 做限定范围定向复核再开码（以本批代码 Review 替代属 Walter / 集成人裁量，本文件不代定，不声称 R7 自动覆盖 r6.3）。作者 = claude-opus-5-5 via anthropic（本轮协调器最小真实调用 `claude-bridge/claude-opus-5-5` exit 1，provider / invocation error 类、非已确认限额；同模型 anthropic exit 0；只换通道、未改配置）。详见 analyze.md「Analyze R9」。

> **当前实施进度（首批独立 Review 后记账，2026-10-29；以本块为准，下方 Converge batch-a09a 块中“待独立 Review”为当时原文）**：**10 / 66 已完成**——T-A01～T-A09、T-A09a（openai/gpt-6-astra；代码 `8753fa9..13a3373`，12 个提交，固定于 `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`）。独立审核员 A（claude-fable-5-1 via anthropic，新会话、独立 worktree `D:/2030/Futures-AI-interaction-review-a09a`，固定审文档 `b0b065f` + 代码 `13a3373`）判**本批通过：0 P1 / P2，6 项 P3（R-A～R-F）**；审核原件 `review-batch-a09a.md` 由集成人提交于 `af95b66505875609f7ed3f823e047cd16226a1c5`（只引用、不改写）。A 亲跑：`install --frozen-lockfile`、`contract --check`、`check` 六守卫、typecheck、lint、全量 `test:unit` 21 文件 722 pass / 0 fail、三份既有契约测试 88 pass、本批 28 条 `-t` 标题命令全部匹配通过、另 `test:e2e e2e/agent.spec.ts` 8 pass；未跑全量 `pnpm test` / 全部 E2E。各任务状态行的“已完成”= **本批代码 Review 通过，不表示任何 AC 最终验收**：46 AC 最终验收仍 **0**；其余 **56 项未开始**；feature 整体**未收敛**（尚未实施 + H 组 `blocked_by: frontend-workbench-v2`）。这不是全 feature Review、不是 Gate 2 / Handoff。下一批可开工入口仍按 §6 DAG：**T-A10、T-A22、T-A23、T-A24**（本记账不开新代码任务）。Walter 的代码实施授权（原话“允许”）与集成人指定在既有 tasks 范围内持续有效，后续批次无需重复授权。**P3 后续观察**（未经 Walter 风险接受、本批不修、不新增标准 / 命令 / 机制，只在对应任务状态行加阅读指引）：R-A → T-A16 / T-A19 开工前先定 `Deliverable.blocks`“当前视图”不变量（T-F01 / T-F06 消费）；R-B → T-A10 消费工作区时核对未开始阶段 fixture 语义；R-C → T-G06 复核契约文档前瞻文案；R-D → 接管写入的 T-A10 / T-A12 / T-A14 / T-A17 / T-A20 决定入口 refine 还是“由状态层保证”（补校验前须按 AGENTS §5.1 先报 Walter 同意）；R-E → T-A17；R-F → T-A21 同时改写两处计数。详见 `implementation-log.md` §8。任务数 66、约 101.5 h、220 条标准 ↔ 220 条命令、46 AC、依赖均未变；checklist（R7 `9acf3de`，blob `7c219c07…`）未改、未勾。

> **当前实施进度（Converge batch-a09a，2026-10-29；以本块为准，取代下方 r6.1 块中“66 个任务全部仍为‘未开始’”一句——该句为开工时历史记录）**：**10 / 66 已实施**——T-A01～T-A09 与 T-A09a（openai/gpt-6-astra，新会话、独立实施树 `feat/workbench-interaction-astra`，未回退；授权规格种子 `8753fa9f65dae685f765f316b00e6287750f0cf7`，代码 diff `8753fa9..13a3373`；集成人 ff-only 集成到生产方集成树 `integration/workbench-interaction` @ `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`）。各任务状态行登记固定 commit 与验证依据；验证结果均为**实施者执行、Converge 会话未重跑**。Converge（claude-opus-5-5 via anthropic）判定：本批范围**已收口、待独立 Review**，未新增任务；feature 整体**未收敛（尚未实施 + H 组外部阻塞）**——其余 **56 项未开始**，依赖按 §6 DAG（依赖已满足、可起步：T-A10、T-A22、T-A23、T-A24），H 组仍 `blocked_by: frontend-workbench-v2`；46 AC 最终验收 0 条（本批全为“部分前置”）。实施中的字段定形已按精度同步到 T-A03 / T-A04 / T-A05 / T-A07 / T-A08 / T-A09 修改范围（标【r6.2 精度】，不改完成标准 / 命令 / 编号 / 依赖 / 预估）。详见 `converge-batch-a09a.md`、analyze.md「Analyze R8」、`implementation-log.md` §6。H-x 无一已交付（H-1 具备 ①②③、缺 ④）。checklist（R7 `9acf3de`，blob `7c219c07…`）未改、未勾。

> **当前开工状态（r6.1，2026-10-28；以本块为准，取代下方 r6 块中的“待 R7 / 未取得 / 未登记”）**：IMPL-GATE-R6 三项**均已满足**——(1) A 定向复核 = Checklist R7 **通过**（A = claude-fable-5-1 via anthropic，固定审 `0e37fbf`，26/26 当前有效项、0 P1/P2；审核原件提交 `9acf3de661187840ea5be6f6d6f78205872ac356`，`checklist.md` Git blob `7c219c071607596c813af6a3ebc1b651e25cd8d0`，本轮未改）；(2) **Walter 代码实施授权已取得**：协调会话问“是否允许开始代码实施，并由本会话担任集成人？”，Walter 回复原话“**允许**”——授权范围 = 本 feature 已审 tasks 内的代码实施 + 指定该协调会话为集成人；不代其他 feature 的 Gate 1 / Gate 2，不授权扩范围、不改冻结 spec / AC；(3) **集成人与工作树已登记**：集成人 = 协调会话 `PI_SESSION_ID=01a18388-a371-7746-8158-9fb15d55d819`（`openai/gpt-6.1-sol`），唯一串行写生产方集成验证树 `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`；实施树 `D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra`。两树均从 `43b6d79` 创建，随后 ff-only 同步到 main `90187f7d8907316e554d2441d846827468c5371f`（PR #8 H-01 修复 + PR #9 D-020～D-024 文档），clean、无本 feature 代码、尚无 `specs/workbench-interaction/**`。
> **基线口径**：`implementation_base_sha` **仍为 `43b6d79`**（v1 正式 Handoff，不以移动的 main 替代）；另登记 `upstream_start_sha = 90187f7`（实施 / 集成树实际起点）。`43b6d79..90187f7` 的前端差异只有 `src/modules/market-board/SampleChart.vue` 与 `e2e/theme.spec.ts`（H-01），契约 / types / mock / events / `main.ts` / `app/**` / 脚本 / 锁文件 / 配置 / 既有测试均零差异，§0.0 事实不失效（见 §0.0 末“r6.1 upstream 复核”）。
> **开码前置（集成人执行，未完成前不写代码）**：把包含本 r6.1 修订的规格文档提交带入实施分支（只导入 `specs/workbench-interaction/**`，不整文件覆盖 main 的 `docs/**`、`specs/README.md` 或其他 feature 规格）。首批 = **T-A01～T-A09 与 T-A09a**，按 §6 DAG 推进；Implement 首选 `openai/gpt-6-astra`（AGENTS §6）。
> **任务状态**：66 个任务**全部仍为“未开始”**；各任务行里的 `blocked_by: IMPL-GATE-R6` 是 r6 定稿时的闸门标签，现闸门已满足，**不得再读作“未获授权”**，开工顺序只受依赖 DAG 约束；H 组的 `frontend-workbench-v2` 外部闸门**不变**（壳方 S1 / S2 交付并集成前不验收）。H-x 八切片仍**全部未交付**；生产方集成树的 SHA 只是生产方验证证据，**不等于** v2 消费方接收，interface-handoff.md §1 ④ 须待 v2 集成树所有者真正集成后才登记。
> **r6.1 修订摘要（只吸收 R7 建议范围内的措辞 / 断言精度）**：S-27（T-A10 修改范围：模块级唯一共享会话状态；T-A18 共用）、S-29（T-A07：j-failed 分析产物 draft；T-A21 标准 5：j-failed / j-cancelled 初始计数 0）、S-28（T-A18 标准 4：非终态事件 / send 受理不改作业摘要）、S-30（T-E03 措辞，plan 动作矩阵与 interface-handoff §5-7）、S-31（§7 Converge 核对项）、S-32（T-A22 实施提示）。任务数 66、约 101.5 h、220 条标准 ↔ 220 条命令、46 AC、依赖与 AC 映射均不变；按 R7「下一步」2 不需重过 R7。作者 = claude-opus-5-5 via anthropic（bridge 本窗口已明确限额、未重试；未改配置）。

> **当前状态（r6，2026-10-28 恢复轮；待 A 新会话定向复核 = Checklist R7）**：66 个任务、约 101.5 h，**全部未开始**；没有实现分支、没有代码、没有运行任何产品测试。r6 只做两件事：① 在 frontend-workbench v1 合入 main 的真实提交上重核 §0 前端事实（见 §0 “r6 基线审计”）；② 与 frontend-workbench v2 的 H-1～H-6 / 页面切片消费要求对拍，把**既有需求内**的接口机制精化落到任务（见 §2a、interface-handoff.md）。冻结 spec v1.1（46 AC）未改，需求未变。
> **implementation_base_sha = `43b6d79681a49562f41751368b2ae00c24062f56`**（PR #7 “Merge PR #7: frontend-workbench v1（Gate 2 已确认，Handoff）”的 merge commit；v1 源交付提交 `eba50021466ab986df85473c74882a739bffa1ec`）。证据：协调器 2026-10-28 实查 `gh pr view 7` = MERGED（mergedAt 2026-10-28T12:49:38Z，mergeCommit = 该 SHA），`git fetch origin` 后 `git merge-base --is-ancestor <SHA> origin/main` 成功且 origin/main 正为该 SHA；本会话在只读目录 `D:/2030/Futures-AI-interaction-base-43b6d79`（detached HEAD = 该 SHA）读核。**这只表示“v1 Handoff 合入 main”这一基线门已满足**；它不代表已建立实现分支、已同步代码，也不授权开工。注意：`specs/workbench-interaction/**` 不在 `43b6d79` 中（本规格只在 `docs/workbench-interaction-resume-20261028` 分支），实现分支建立时须由集成人把本规格文档一并带入。
> **IMPL-GATE-R6（每个任务的 blocked_by）** = 以下全部满足前任何任务不得开始：(1) A 新开独立会话、与实施异模型，对 r6 的 plan / tasks / analyze / interface-handoff 做定向复核并以**已提交 SHA** 给出通过结论（Checklist R7；R6 的 26/26 只覆盖 r5 设计，不覆盖 r6 新增精化）；(2) Walter 明确的代码实施授权（本恢复轮授权仅限“恢复、基线、接口对拍”，不含实施）；(3) 登记指定集成人、集成验证分支、本 feature 实施 worktree / 分支（从 `43b6d79` 建立）。H 组另 `blocked_by: frontend-workbench-v2`（壳方 S1 / S2 交付并集成）。原 `frontend-workbench-v1-handoff` 闸门已由上述基线满足，不再列入。
> **H-x 交付状态**：H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-5、H-6 **全部“未交付”**——四项（生产实现固定 commit、已提交的有效 Checklist SHA、定向测试命令与输出摘要、集成验证分支上的集成 SHA）均未取得。已提交的 R6 SHA `8af343f` 只能作 r5 旧设计的审查证据；r6 新增要求须待 A 定向复核（R7）后生效。设计对拍通过不等于交接。
> **r6 阶段记录（脱敏）**：角色 = Plan / Tasks / Analyze；基线：规格分支起点 `8af343ff085c0f958068b6b50008a6985f51d170`，前端事实基线 `43b6d79`，v2 只读参照 `ded716100381fcd2b4b5d3481f4f56e44c9869fd`；实际模型 = **claude-opus-5-5 via anthropic**。本窗口协调器真实探活：`claude-bridge/claude-opus-5-5` exit 1（quota / rate / spend_limit 类，原文未保存），同模型 `anthropic` 最小调用 exit 0；按 AGENTS §6 规则 2 / 5 只换通道、不换模型，本窗口不重试 bridge，未改任何 provider / key / 全局配置。
> **r6 修订摘要**：新增 T-A09a（H-1：jobContext 契约与 mock 透传，从 T-A18 拆出）、T-A22a（H-2·列表：jobsStore 共享未筛选缓存 / ensure / refresh / 筛选不覆盖 / createJob action / agent 终态刷新）、T-A22b（H-4：sessionStore 只读上下文 + 路由守卫同次导航清空）、T-C01a（H-5：IntakeDrawer 非模态容器、关闭不导航、页面级挂载，从 T-C01 拆出）；精化 T-A01（`ACTIVE_JOB_STATUSES`）、T-A02（JobListItem 字段）、T-A07（jobs.json 按场景集合分键）、T-A09（jobFixtures 整文件替换语义 + 既有 mock.spec 按索引配对循环）、T-A10、T-A11（jobFixtures 覆盖时只在内存）、T-A18（缩为状态层关联，依赖 T-A09a）、T-A21（fixture 初始状态生成收件箱条目）、T-A22（只做路由切片，依赖改为 T-A01）、T-B01～T-B04、T-C01～T-C04、T-E03、T-G02、T-G04；§1 新增约定 9（写后统一刷新）；§5 矩阵、§6 DAG / 预估、§7 同步。r1～r5 原文与历史记录保留于下方，其中“草案 r5、待 R6”“implementation_base_sha: PENDING”等措辞是当时状态，以本块为准。

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
> 【r5 历史原文】**implementation_base_sha: PENDING**（待 frontend-workbench v1 完成 Review、Gate 2 和 Handoff，以合入 main 的 commit 为准；不预填、不编造）。→ r6 已登记为 `43b6d79`（见页首当前状态块）。
> **外部闸门**（r6 更新）：所有 A–H 实施任务均 `blocked_by: IMPL-GATE-R6`（定义见页首）；H 组另外 `blocked_by: frontend-workbench-v2`（v2.1 Gate 1 已批准；壳方 S1 / S2 交付并形成集成基线前不验收）。这只是**实施闸门**，不阻止文档工作。真实后端 `api` **不是** mock 验收的前置条件（spec §4 依赖条款）。

## 0. 外部依赖证据

### 0.0 r6 基线审计（只读，`D:/2030/Futures-AI-interaction-base-43b6d79` @ `43b6d79`，2026-10-28 恢复轮）

本节是 Implement 前须在 `implementation_base_sha` 上重核的前端事实的**当前版本**（tasks §7 要求）。逐项读真实文件，不以旧摘要代替；“差异”列只记与 r5 §0 / 任务文字的真实出入。

| # | 对象（真实文件） | `43b6d79` 事实 | 与 r5 的差异 → r6 处理 |
|---|---|---|---|
| B-1 | v1 评审与交接（`specs/frontend-workbench/review.md` §8 / §9、`tasks.md` P3 台账、`manual-acceptance.md`） | Gate 2：Walter 2026-10-28 “确认”，11 项 P3 接受为后续、未修复；Handoff：合并主线后 559 单测 + 66 e2e、build exit 0（v1 Handoff 会话记录，非本会话运行）；M-01～M-08 为 AI 执行的 60 张截图，人工勾选 8 项全部未勾；Handoff 新发现 **H-01**（图注 `span.num` 断行）/ **H-02**（<980 顶部导航约 205 px 高，960～979×900 模块区约 215 px）登记、**未经 Walter 处置**；PR #7 合入 | 无任务出入。H-01 / H-02、人工截图签字属 frontend-workbench 待办，本会话不代批、不升级为本 feature 硬阻塞；H-02 只作为 T-G07 / M-10（960 视口）截图观感的已知外部风险登记在 interface-handoff.md §6 |
| B-2 | `frontend/package.json` | 脚本 `dev / build / preview / typecheck / lint / test:unit（vitest run）/ test:e2e（playwright test）/ tokens / tokens:check / contract / check / test`；`test = pnpm check && pnpm typecheck && pnpm lint && pnpm test:unit && pnpm test:e2e`；TypeScript 5.9.2、vitest ^5.0.5、@playwright/test 1.64.1、zod ^4.6.7 | 与 r5 一致（另有 r5 未列的 `tokens` / `tokens:check` / `build` / `dev` / `preview`，本 feature 不用、不改） |
| B-3 | `scripts/check.mjs` | `--only generated / colors / glass / updown / grid / network` 六项；`generated` 先跑 `tokens-build --check`，再**重新生成**契约并比对（会写文件）；glass 只允许 `glass-focus / glass-module / glass-drawer`，`backdrop-filter` 只许在 `glass.css`；network 只许 `src/contracts/real/` | 一致。注：只读对拍仍用 `contract --check`（T-A01 等工程门不变） |
| B-4 | `vitest.config.ts` / `playwright.config.ts` / `tests/setup.ts` | happy-dom；include `tests/**/*.spec.ts`；`clearMocks / restoreMocks: true`；每用例新 Pinia。Playwright testDir `./e2e`、channel chrome、baseURL `127.0.0.1:4173`、webServer `pnpm dev --port 4173 --strictPort`（不复用） | 一致（`restoreMocks` 为新登记细节：系统边界 spy 每例自动还原） |
| B-5 | `scripts/contract-build.mjs` | 由 `contractSchemas` + `methodSemantics` / `contractSemantics` + AgentEvent 表驱动；`--check` 只读；§4 Mock / §5 Agent 回放为静态文案（五场景、九个 fixture 键） | 一致；S-19 声明句口径不变，本 feature 不改生成器 |
| B-6 | `src/contracts/{types,client,methods,index}.ts`、`real/index.ts`、`mock/index.ts` | `CONTRACT_VERSION='1.0.0'`；`BootstrapSchema.scenario` 五值；`SendMessageSchema{sessionId?,message}`；`DataClient` 10 方法、`AgentClient{send,subscribe}`；real 全部 `NotImplementedError`；`MockOverrides{fixtures?,agentScript?}`，fixture 覆盖“每次请求读取、整键替换、不深合并”；mock `send` 在受理时预算全部事件（`AgentRunSchema` 边界校验一次），再按 `afterMs` 逐个 `setTimeout` 直接投递给监听者；`readScenario()` 在 client 创建时读取一次 | 一致。r6 精化：jobFixtures 对有状态 mock 采用“每个 client 状态建立时读取一次”（T-A09 / T-A10），既有测试切场景的做法是**新建 `createMockDataClient()` 并在系统边界 spy 委托**（`tests/component/focus-band.spec.ts:108-111`），jobs 测试沿用 |
| B-7 | 既有契约测试硬编码 | `mock.spec.ts:15`（`fixtures/*.json` 不递归）、`:34`（恰 9 个）、**`:96-99`（`Object.values(dataMethods)` 与 `dataRequests(client)` 的十个结果按索引配对）**、`:100`（`contractVersion: '1.0.0'`）；`contracts.spec.ts:248-253`（`dataMethods` 键列表精确相等、`methodSemantics` 长度 12）；`contract-doc.spec.ts:63-64`（`x-methods` = `methodSemantics` 键且长度 12）；`contracts.spec.ts:173` 事件 10 类、`contract-doc.spec.ts:132-138` 场景名“包含”断言不受影响 | **真实差异**：r5 未点名 `mock.spec.ts:96-99` 的按索引配对循环——方法数增加后第 11 个起会以 `undefined` 失败。→ T-A09 修改范围补该循环（只遍历 v1 十个方法键），仍属 S-20 已登记的“三份既有契约测试中受 2.0.0 影响的硬编码断言”，不扩所有权 |
| B-8 | `src/agent/{events,store}.ts`、`mock/agent/*.ts` | `events.ts` 从 `contracts/types.ts` 导入，十类事件共享 `eventFields`（加公共可选字段只需一处）；store `send(message)` 只传 `{sessionId,message}`，`receive` 对未知 runId 硬断言（v1 R1-03，已接受 P3）；脚本 success（含 `step.text` 权威全文）/ failure / retry / long（12000 ms 终态）；无 abort 脚本 | 一致；`events.ts` 无反向导入，T-A09a 引用 `JobContextSchema` 不成环 |
| B-9 | `src/design/{theme.ts,glass.css}`、`shared/components/*` | `FAI_DARK_THEME='fai-dark'`；`.glass-drawer` 已存在；`Badge / Loading / EmptyState / ErrorState / Num / Kpi / Spark / DataTable` 均在 | 一致 |
| B-10 | `src/main.ts` / `app/{router,nav,AppShell}.ts(.vue)` | `main.ts` 在 mount 前 `app.use(pinia).use(router)`，并以 `agentClient.subscribe(useAgentStore(pinia).receive)` 建立应用级监听（卸载 / HMR 时解除）；router 由 `navItems` 生成 + `/` + 兜底 `/:pathMatch(.*)*`；nav 八项、含 `research`、无 `jobs`；AppShell 三行（TopBar / `main.route-view` / `footer.dock-slot`） | 一致。补充：v2 前 router 中**没有** `jobs` 占位，`addRoute` 为新增；同名替换只在 v2 后发生，T-A22 用含占位的测试路由验证。`main.ts` 的应用级监听写法是 T-A22a 订阅的既有先例 |
| B-11 | 文档差异（`8af343f` ↔ `43b6d79`） | AGENTS.md、`docs/architecture.md`、`docs/interaction.md` 相同；`docs/plan.md` D-015 预留行改为正式行 + 完成记录；`docs/designUI.md` §2.1 注、§2.2 D-015 作用域、§2.3 / §6 / §8 指针、§3.10 v1 地基注；新增 ADR `20261027-updown-scope.md`；main 的 `specs/README.md` 无本 feature 行，且仍有已完成的“D-018 → workbench-interaction 回 Clarify”待同步行 | 对本 feature 无设计影响（不用涨跌色、不新增玻璃 / 色值）；权威文档不在本分支改，合并由集成人处理（README 冲突需保留本 feature 行并删除已完成的 D-018 行，见 interface-handoff.md §5） |

**结论**：`43b6d79` 事实与 r5 §0 / 任务文字一致，唯一实质出入是 B-7 的 `mock.spec.ts:96-99`，已在 T-A09 落实；没有发现需要回流需求的差异。

**r6.1 upstream 复核（只读，`D:/2030/Futures-AI-interaction-main-ref-90187f7` @ `90187f7`，按 §7 “基线再变须重核”）**：实施 / 集成树已 ff-only 到 `90187f7`。`git diff 43b6d79 90187f7 -- frontend/` 只有 `src/modules/market-board/SampleChart.vue`（`figcaption .num { display: inline; }`，H-01）与 `e2e/theme.spec.ts`（H-01 回归，位于 `e2e/` 根、不在 `e2e/jobs/**`）；`src/contracts/**`、`src/agent/**`、`src/main.ts`、`src/app/**`、`src/design/**`、`scripts/**`、`package.json`、`pnpm-lock.yaml`、`vitest.config.ts`、`playwright.config.ts`、`tests/**` 零差异。B-1～B-11 中只有 B-1 的“H-01 未处置”过时（H-01 已经 PR #8 修复并完成该 feature 的 Gate 2 / Handoff；H-02 仍为 v2 事项），其余不变；对任务、命令与所有权无影响。docs 影响见 analyze.md「Analyze R7」§3。

**r6.3 第二批开工前复核（只读，本文档树 @ `0920004`，前端代码与受审 `13a3373` 相同）**：① upstream：main 已到 `cf8e11bc1c91149cac233a2f3b5ec6eed4e23caa`，`git diff --stat 90187f7 cf8e11b -- frontend docs AGENTS.md backend design` 为空（只改 `specs/README.md` 与 frontend-workbench 文档 / 截图证据）；实施树与生产方集成树 HEAD 均 `0920004`，继续 pin `90187f7` upstream，不自动合入无关 M-08 证据，`implementation_base_sha` 仍 `43b6d79`。② **B-9 补充（真实出入）**：`shared/components/Badge.vue` 只接受 `state: ok|warn|bad|sample`、渲染固定文案（正常 / 警告 / 异常 / 样例），无插槽、无文案 prop，无法承载契约文案；`shared/**` 也不属本 feature（§1-5）→ T-A23 修改范围据此修正（自制徽标、不导入 Badge.vue、只复用令牌），按 §7 已修订本文件并重跑 Analyze（R9）。③ B-10 补充：`main.ts` 在 `app.use(pinia)` 之前即以 `useAgentStore(pinia)` 显式传 pinia 取 store → T-A22b 在 `registerJobRoutes(router, pinia)` 内以 `useSessionStore(pinia)` 沿用同一写法。④ fixture 事实：十作业在 plan 样例表为 `not_started` 的 12 个 (作业, 阶段) 工作区仍带完整投放 / 配方 / 结论 / 交付内容（R-B）；`interventions.json` i-seed-1～6 的锚全部落在已开始阶段；工作区 schema 已接受空集合与 `deliverable=null` → T-A10 的 R-B 校正无需改 schema / 生成物（r6.4：该校正拆为 T-A09b，结论不变）。

### 0.1 r1～r5 历史证据（原文保留，不代表当前状态）

**原标题**：外部依赖证据（只读核对：首次 2026-10-28T15:31+04:00，复核 15:56+04:00）

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
5. **文件所有权**（plan §1）：本 feature 只改 `frontend/src/jobs/**`、`frontend/src/contracts/**`（作业类型 / 方法 / mock / real 桩 / 可选 `SendMessage.jobContext`）、`frontend/src/agent/events.ts`（可选 `jobContext`）、`frontend/src/main.ts`（只加作业注册：`registerJobRoutes(router, pinia)`（两条路由 + 会话上下文守卫，T-A22 / T-A22b）与 `jobsStore` 的应用级 agent 订阅（T-A22a，沿用既有 `useAgentStore(pinia).receive` 订阅写法），r6 精化）、上述 jobs 测试，以及 T-A09 指定的三份既有**契约**测试中受 v2 影响的断言（plan §1 所有权与 §6 回滚已登记，S-20）。T-H01 对壳方的唯一相关动作是移除本 feature 自有的 `frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 中的页面级 IntakeDrawer 挂载（仍在 `jobs/**` 内）。**不改** `frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue,AppShell.vue}`、`frontend/src/workbench/WorkbenchPage.vue`、`frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}`、`scripts/contract-build.mjs`、`scripts/check.mjs`、`backend/`、`docs/`、冻结的 spec。
6. **契约 schema 放置**：作业契约 schema 写在 `frontend/src/contracts/types.ts` 末尾的“作业契约 v2”段（plan §2.4 允许写在 types.ts）。不另建 `job-types.ts`，以免与 types.ts 循环导入（job schema 要用 `TimestampSchema` / `SparkSeriesSchema`，而生成器只从 types.ts 读取 `contractSchemas`）。
7. **入口只校验一次**（AGENTS §5.2）：契约输入、返回值和本地快照入口各 parse 一次；表单只复用契约导出的 schema / 常量给出即时提示，不另立规则；组件不重复校验契约数据。
8. **任务状态**：每个任务标“状态：未开始”与 blocked_by；Implement / Converge 只在任务真正完成后更新状态，A 复核前不改。
9. **写后统一刷新（r6，H-2 ⑤ / plan §2.3）**：一切领域写调用（作业、投放、介入、交付、收件箱已读、重置）都在生产方 store action 或组件的同一处写路径中完成，成功回执后**只调用一次 `useJobsStore().refresh()`**（同时重读未筛选列表、当前筛选结果、已打开的作业详情 / 工作区），不各自做局部重读、不轮询、不建事件总线；带 `jobContext` 的 agent 终态事件由 T-A22a 的订阅触发同一个 `refresh()`。写失败不刷新、不改缓存。

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

## 2a. H-x 交接切片 → 提供任务（r6；对 v2 plan §7.3 / tasks §1.2 的生产方落点）

每个切片只有在其“提供任务”全部完成后，才能以**固定 commit + 已提交有效 Checklist SHA + 定向测试命令与输出摘要 + 集成 SHA** 四项交接；当前四项全部“未取得”，状态全部**未交付**。完整对拍、公开接口与名称见 `interface-handoff.md`。

| 切片 | 提供任务（全部完成才可交接） | 定向测试（交付后执行；现在不执行） | 说明 |
|---|---|---|---|
| H-1 | T-A02（`JobContextSchema`）、T-A09（`CONTRACT_VERSION='2.0.0'`）、**T-A09a**（`SendMessage.jobContext?`、十类事件公共可选 `jobContext`、mock 透传） | `test:unit tests/unit/jobs/agent-context-contract.spec.ts`；`test:unit tests/unit/jobs/contract-version.spec.ts -t "WI scenarios"` | **T-A09 ≠ H-1**。r5 中 SendMessage / events / mock 透传都在 T-A18，H-1 须等 T-A18；r6 把这部分拆为 T-A09a（只依赖 T-A02 / T-A09），H-1 不再等待 mock 状态层。作业**运行关联**（activeRunId / overlay，S-15）仍在 T-A18，不属 H-1 交付，但 T-A18 命令 4 复跑 H-1 定向测试，保证不回归 |
| H-2·标签 | T-A01（`JobStatusLabel / StageLabel / StageStateLabel / JobTypeLabel` 等九张映射）、T-A23（`JobStatusBadge`） | `test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI labels"`；`test:unit tests/component/jobs/badges.spec.ts -t "WI status badges"` | 只要 `StageLabel` 的 S1-ctx 可只等 T-A01 |
| H-2·列表 | T-A01（`ACTIVE_JOB_STATUSES`）、T-A02（`JobListItem` 字段）、T-A10（`listJobs`）、T-A12（`createJob`）、**T-A22a**（jobsStore 共享未筛选缓存 ①～⑤、`createJob` action、agent 终态刷新、`main.ts` 订阅）、**T-A22c**（r6.8，R3-A 补修：`applyFilter` 成功不改写未筛选列表读状态） | `test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2"` | 可调用写 action = `useJobsStore().createJob(input)`；inbox / 投放 action 不算本切片。r6.8：T-A22c 关闭前不放行 ④（已于 `69faacc` 关闭；④ 仍待消费方） |
| H-3·路由切片 | **T-A22**（`jobs/routes.ts` 两条路由 + `registerJobRoutes` + `main.ts` 挂载前注册；依赖改为 T-A01） | `test:unit tests/unit/jobs/routes.spec.ts` | 不含页面功能；页面为骨架 |
| 页面切片 | T-B01、T-B02、T-B04（`/jobs` 列表与详情；r6.9：T-B04 依赖 T-A22d，A22d 是依赖、不单列为提供任务；r6.11 草案：第四批 Review 未通过，R4-A 修复 T-B04a 若获批亦须完成并经增量 Review）、T-C01、T-C01a、T-C02、T-C03、T-C04（IntakeDrawer 投放提交 / 确认 / 待归属池归入） | `test:e2e e2e/jobs/intake.spec.ts`；`test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-2"`；`test:unit tests/component/jobs/job-list.spec.ts` | 待归属池在 IntakeDrawer 内（T-C03），任何挂载点都能完成归属。【r6.12】T-C01a 新增 `CollectWorkspace`（详情页采集列表与入口），T-C04 增依赖 T-B06（介入历史展开取证）；T-B06 / T-A15a / T-A01a / T-A13a 是依赖，不单列为提供任务 |
| H-4 | **T-A22b**（`sessionStore.context` 只读 + `registerJobRoutes` 中的 `afterEach` 守卫） | `test:unit tests/unit/jobs/session-context.spec.ts -t "WI H-4"` | **无公开 setter**：只经路由守卫设置；壳 S1-ctx 因而条件依赖 H-3·路由切片（v2 tasks §1.2 已预设此分支） |
| H-5 | T-C01（`intakeStore.open(jobId?) / close / isOpen / jobId` 快照、submit 用快照并刷新）、**T-C01a**（`IntakeDrawer` 根 `.glass-drawer`、无 fixed / 遮罩 / `aria-modal` / 焦点锁、关闭不导航不调 agent） | `test:unit tests/component/jobs/intake.spec.ts -t "WI H-5"` | 确认 / 归属写后的刷新随页面切片（T-C02 / T-C03）。【r6.12】公开成员仍只有 `open(jobId?) / close() / isOpen / jobId`；草稿、选中、预览、待归属池与各写动作是本 feature 内部成员（plan §2.3【r6.12】），不进交接接口 |
| H-6 | T-A07（`jobs.json` 按场景集合分键）、T-A09（`jobFixtures` 整文件替换语义）、T-A10（`listJobs` 的 empty / error / slow；覆盖集合缺工作区样例时返回空工作区）、T-A11（有覆盖时只在内存）、**T-A21**（fixture 初始状态生成收件箱条目：job-running 的 j-human、job-conflict 的 j-conflict 初始带未读条目） | `test:unit tests/unit/jobs/contract-version.spec.ts -t "WI jobFixtures"`；`test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI scenarios read"`；`test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox seed"` | 角标样例依赖 T-A21（链路较深）；场景 / 覆盖部分在 T-A11 后即具备。是否分两批交接须 v2 接收方确认（interface-handoff.md §5），本文件不预设 |

（命令省略 `pnpm -C frontend` 前缀。）

## 3. 范围边界（实现不得越界）

- **只实现 spec 已有的行为**。不做：真实文件解析 / URL 抓取 / 剪藏预览、知识写入闸门、验证队列、格物致知、分析协议蒸馏 / 规则激活、D-019 角色芯片 / 模型档 / 成本、N+1 撤销 / 反定稿、自动定稿、未审阅归档、作业级“重试”的实际实现（AC-002-5 只显示归属说明占位）、导航 / 首页作业轨道 / 顶栏投放 / 抽屉上下文标签（归 v2）、真实后端。
- **六类块的 v1 编辑边界**：结论 / 备注可 inline 编辑；图表 / 表格 / 引用 / 待验证只读（待验证块只是只读文本，没有验证队列）；所有块都可批注；块顺序只读。
- **两种状态分开**：产物 / 块的 `status`（draft / provisional / confirmed / conflict）与交付物的 `deliverableStatus`（draft / final）相互独立；confirmed ≠ final。交付物状态只由 `finalizeDeliverable` 改变，不从 job.status 或“快照是否存在”推导。
- **定稿**：显式动作、二次确认；不自动定稿；不可撤销（定稿后没有反向方法，所有领域写方法都在契约入口拒绝）；v1 只做冻结和派生标记（D-018 §1 ①）。
- **IntakeDrawer 的挂载**（plan §2.1 / §4.2 没写明 v2 之前由谁挂载；r5 按 Checklist R5 B-11 建议 (a) 修订）：v2 之前由 `JobListPage` 和 `JobDetailPage` 各自挂载同一个 IntakeDrawer（二者是互斥的路由视图，同一时刻只有一个存在，不会双渲染）；v2 的 AppShell 挂载落地后，由 T-H01 从本 feature 自有的这两个页面文件中移除页面级挂载（不改 `app/**`，壳方代码不动）。不设任何“首个挂载者登记 / 单实例登记 / 卸载释放”运行时机制，`intakeStore` 不含实例登记。r6（H-5）：页面（v2 后为 AppShell 的 `.intake-slot`）提供容器，IntakeDrawer 根元素 `.glass-drawer` 填满容器、不自定位；待归属池放在抽屉内（T-C03）。

## 4. 任务

### A 契约与骨架

### T-A01 契约枚举与展示映射（S-11 / S-14 / S-16 / S-17）

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收）**｜commit `07ef7ccc3c889400dfb2354ceec22c94317c8813`（+ describe 回归修复 `1ed6ec15e5c4b8dfce51c0bf9f10b812c0c87cd1`）；验证（实施者执行）：命令 1～3 `WI enums` 2 / `WI labels` 10 / `WI contract notes` 1 pass，命令 4 contract `--check` / typecheck / lint 过｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1.5 h｜**依赖**：无
- **上下文**：plan §2.4 的枚举和“契约展示映射”；徽标只消费契约的文案 / 图标（AC-001-5“映射由契约声明”）。
- **修改范围**：`frontend/src/contracts/types.ts`（新增“作业契约 v2”段：`Stage`、`StageState`、`JobType`、`JobStatus`、`ArtifactKind`、`ArtifactStatus`、`Source`、`Origin`、`InterventionKind`、`InterventionOutcome`、`UploadStatus`、`DeliverableStatus` 枚举；按 §2 S-11 定义九张映射 schema 和同源常量；另定义 `ActiveJobStatusSchema = JobStatusSchema.exclude(['delivered','cancelled'])`（describe：“进行中 = 非终结；终结 = 领域只读门封存的 delivered / cancelled；failed 可经 rerunStage 继续、以 conflict 阶段呈现（S-14），计入进行中；draft 计入”）并导出同源常量 `ACTIVE_JOB_STATUSES`（r6，H-2·列表 ③）；全部并入 `contractSchemas`）；生成 `frontend/contracts/{CONTRACT.md,schema.json}`；新建 `frontend/tests/unit/jobs/contract-labels.spec.ts`。
- **完成标准**：
  1. 枚举值与 spec R-001 / plan §2.4 一致：9 种作业状态、4 个阶段、5 种阶段态、3 种类型、13 种 kind，不含 `source_pref` / `value_fix`；`ACTIVE_JOB_STATUSES` 恰为 JobStatus 去掉 delivered / cancelled 的 7 个值并进入 CONTRACT.md（AC-008-1 部分前置；S-16；r6 H-2·列表 ③）。
  2. 每张映射的键集合等于对应枚举 options，每个值都有非空 text 和 icon；`OriginLabel.derived.text = '内部生成'`；`DeliverableStatusLabel` 为 草稿 / 已定稿（AC-001-5、AC-003-6、AC-006-8 部分前置：映射由契约声明；S-11 / S-17）。
  3. S-14、S-16 的 describe 文案进入生成的 CONTRACT.md（AC-008-1 部分前置）。
  4. 生成物与源一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**（交付测试后执行，当前不执行）：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI enums"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI labels"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI contract notes"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A01a ReliabilityLabel：来源可靠性的契约展示映射（S-11 同机制；r6.12 新增，第五批首项）

- **状态**：未开始｜r6.12 新增；Checklist R11 定向复核通过并提交前不得开码
- **预计**：0.5 h｜**依赖**：T-A01
- **上下文**：spec R-003 来源说明“可靠性（高 / 中 / 低 / 未知）”。`SourceNoteSchema.reliability` 已是四值枚举（`high / medium / low / unknown`），但没有独立 schema，契约里也没有中文文案。投放表单（T-C01）、介入历史 ingest 摘要（T-B06）、采集端到端（T-C04）都要显示同一组文案；若在组件里各写一份，就是 §1-7 / S-11 所禁的“另建映射”。原 T-C01 已顶格 2 h，按 Checklist R8 B-12 先例单拆本任务，不把额外工作藏进 C01。
- **修改范围**：
  - `frontend/src/contracts/types.ts`：在既有九张映射旁新增 `ReliabilityLabel = {high: {text:'高', icon}, medium: {text:'中', icon}, low: {text:'低', icon}, unknown: {text:'未知', icon}} as const`（图标为非空、非颜色字符，由实施者选定），用既有 `labelSchema()` 生成 `ReliabilityLabelSchema`（带 describe），并入 `contractSchemas`。键集合与顺序 = `SourceNoteSchema.shape.reliability.options`。**不**新增 `ReliabilitySchema`、不改 `SourceNoteSchema`（字段已存在，只为一次引用再建 schema 没有必要），不升 `CONTRACT_VERSION`（2.0 内的增量展示映射）。
  - 生成物：执行 `pnpm -C frontend contract` 重新生成 `frontend/contracts/{CONTRACT.md,schema.json}`，不手改；生成器不改。
  - `frontend/tests/unit/jobs/contract-labels.spec.ts`：**只新增** describe `WI reliability label`。原 `WI enums`（2 例）、`WI labels`（9 张映射 `test.each` + 术语 1 例 = 10 例）、`WI contract notes`（1 例）不改不删；`mappings` 数组不加项，`-t "WI labels"` 仍为 10 例。
  - 一律不改：其余 schema、`methods.ts`、mock / real、`tests/unit/{contracts,contract-doc,mock}.spec.ts`。
- **完成标准**：
  1. `ReliabilityLabel` 的键集合与顺序等于 `SourceNoteSchema.shape.reliability.options`，文案依次为 高 / 中 / 低 / 未知，图标非空；常量能过 `ReliabilityLabelSchema`，任一文案改错即被拒（AC-003-3 部分前置：来源说明的可靠性文案由契约声明）。
  2. 生成的 CONTRACT.md 含 `ReliabilityLabel` 小节及四条文案 / 图标；`contract-labels.spec.ts` 整文件与 v1 `contracts.spec.ts` / `contract-doc.spec.ts` 通过，原 `WI labels` 仍为 10 例（AC-008-1 部分前置）。
  3. 生成物与源一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts -t "WI reliability label"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-labels.spec.ts tests/unit/contracts.spec.ts tests/unit/contract-doc.spec.ts`
  3. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A02 作业、阶段摘要、上下文与收件箱 schema（S-13 / S-14）

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；P3 R-D⑤ 后续由接管写入的状态层任务处理）**｜commit `ad4a8309d3e3a69d09a2b4745ce3e41e433a9b31`（+ `1ed6ec1`）；验证（实施者执行）：`WI job schema` 9 / `WI naming` 1 pass，工程门过｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1 h｜**依赖**：T-A01
- **上下文**：plan §2.4 的 Job / JobListItem / JobContext / InboxItem；camelCase 命名对照。
- **修改范围**：`types.ts`（`StageSummary{stage,state,pendingCount}`；`Job`：id/title/type/subject/goal/createdBy(human|schedule)/status/currentStage/updatedAt/parentJobId(null)/reason(string|null)/stages(四项)/pendingCount，refine 约束“stages 按固定顺序且四项各一”和“failed / cancelled 时 reason 非空”；`JobListItem`（摘要；字段固定为 `id/title/type/subject/status/currentStage/updatedAt/reason/stages(四项 StageSummary)/pendingCount`，r6 为 H-2·列表登记，不改语义）；`JobContext{jobId,stage}`；`InboxItem`（plan 字段，不适用的锚可为 null）；describe 写明 `getJob` 的 null 语义（S-13）与 snake_case → camelCase 对照）；生成物；新建 `tests/unit/jobs/contract-entities.spec.ts`。
- **完成标准**：
  1. 正例 parse 通过；反例被拒：stages 顺序错误或缺项、failed 没有 reason、缺必填字段（AC-001-1、AC-002-1、AC-002-5 部分前置）。
  2. 生成的文档登记 `job_id→jobId`、`artifact_id→artifactId`、`base_rev→baseRev`、`created_at→createdAt`（AC-007-1、AC-008-1 部分前置）。
  3. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI job schema"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-entities.spec.ts -t "WI naming"`
  3. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A03 采集 / 处理 / 分析内容 schema（文件白名单在契约）

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；P3 R-D② 后续由接管写入的状态层任务处理）**｜commit `8e81063a2102fe121069148347b9714601cb59ab`（+ `1ed6ec1`）；验证（实施者执行）：`WI intake schema` 12 / `WI process schema` 3 / `WI analysis schema` 1 pass，工程门过｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1.5 h｜**依赖**：T-A01
- **上下文**：plan §2.4 的 Upload / SourceNote / ExtractionPreview / FieldMapping / RecipeStep / ParamChange / ReconciliationDiff；分析台结论卡与证据链（spec R-005）。plan 类型表没有单列 Conclusion，这里按 spec R-005 与 interaction §3.2 定义最小形态，不加行为。
- **修改范围**：`types.ts`：`SourceNote`（purpose 非空、reliability 四档、`publishedAt` / `validUntil` 为 TradingDate|null、scopeNote 为 string|null）；`IntakeInput` 判别联合（file：`fileMeta{name,size,type,lastModified}`，扩展名白名单 pdf / docx / xlsx / md / csv 由 refine 约束并导出常量 `INTAKE_FILE_EXTENSIONS`；url：字符串；text：非空正文，只在提交参数中出现）；`Upload`（plan 字段 + removed + quarantineReason?）；`FieldMapping`、`ExtractionPreview`；`DataSourceRef` / `SeriesRef`；`RecipeStep`（输入 / 输出锚、单链；【r6.2 精度】实现为 `{id,label,input,output}`，input / output 为单个字符串锚）；`DerivedValue{value,unit,lineage:[observation 或 tableRow 锚]}`；`ParamSet` / `ParamChange`（unit / timezone / calendar / resample / aggregation）；`ReconciliationDiff`（两个来源，行含原值 / 差值 / differs，元数据复用 Figure 字段，空差异 = 空行集）；`EvidenceAnchor{kind:assertion|series|source,ref,label}`、`Conclusion{id,text,status,source,origin,evidence[],deleted?,vetoed?}`；生成物；新建 `tests/unit/jobs/contract-intake-process.spec.ts`。
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

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；P3 R-D③ 后续由接管写入的状态层任务处理）**｜commit `112c2838a4fb6b3b499928e28d9ff947acadf677`（+ `1ed6ec1`）；验证（实施者执行）：`WI blocks` 9 / `WI S-18` 5 / `WI generated deliverable` 1 pass，工程门过｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1.5 h｜**依赖**：T-A01、T-A03
- **上下文**：plan §2.4 的 Deliverable / Block / ChartSpec / BlockComment / FinalSnapshot；designUI §5.1 / §5.2。
- **修改范围**：`types.ts`：`Block` 以 type 为判别的六分支（conclusion / note 带 text；quote 带 text 和 source 锚；table 带 columns / rows / tableId；verification 带 question 和结论块锚；chart 带 chartSpec 和 seriesData，seriesData 复用 `SparkSeriesSchema`），共同字段 id / status / source / origin / anchors / comments；`ChartSpec{templateId:'line-sample',seriesBindings:{main},overrides:{title?}}`；`BlockCommentThread{threadId,blockId,status:open|resolved,comments[]}` 与 `BlockComment{id,threadId,parentId,author,text,createdAt}`；`Deliverable` 判别联合（S-18）；`FinalSnapshot{id,jobId,revisionId,finalizedAt,blocks}`；`DeliverWorkspace{deliverable,finalSnapshot|null,…}` 加一次 superRefine（S-18）；生成物；新建 `tests/unit/jobs/contract-deliverable.spec.ts`。【r6.2 精度（Converge batch-a09a 登记，不改标准）】`FinalSnapshot` 另含必填 `revisionNumber`（正整数，= revisionId 对应已合并修订的 number），即 §2 S-18 “快照的 revision number” 的承载字段；`DeliverWorkspace.deliverable` 可为 null（空工作区，此时 finalSnapshot 亦为 null）；表格块 `columns: string[]`、`rows: (string|number|null)[][]`。
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

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；P3 R-D① 后续由接管写入的状态层任务处理）**｜commit `581f434fcf9e167fd014dd21b533c98c71ea4e25`（+ `1ed6ec1`）；验证（实施者执行）：`WI revision` 6 / `WI artifact` 1 / `WI workspace` 7 pass，工程门过｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1.5 h｜**依赖**：T-A02、T-A03、T-A04
- **上下文**：plan §2.4 的 Artifact / Revision；“写回执包含已改变的作业 / 产物 / 版本 / 事件与 inbox 计数”。
- **修改范围**：`types.ts`：`Artifact`（id / kind / status / source / origin / latestMergedRev / overlayRev / pendingMerge / pendingRunId，无 overlay / run 时为 null；refine：`pendingMerge=true` 时 overlayRev 非空）；`Revision` 判别联合（S-12）；`StageWorkspace` 以 stage 为判别（collect：uploads + dataset 产物；process：sources / series / recipe 产物 / derivedValues；analyze：analysis 产物；deliver：`DeliverWorkspace`；【r6.2 精度】四个分支各带限定本阶段 kind 的 `artifacts[]` 与对应分支的 `revisions[]`，空态为空集合，deliver 空态 `deliverable=null`；`latestMergedRev` / `overlayRev` / `baseRev` 取值为 `Revision.id`，修订列表在工作区 `revisions[]`、不内嵌于 Artifact）；`WriteReceipt{jobs,artifacts,revisions,inbox:{unread,byStage}}`（`interventions` 字段在 T-A06 定义 Intervention 后补入）；生成物；扩充 `contract-entities.spec.ts`。
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

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；P3 R-D④ 后续由接管写入的状态层任务处理）**｜commit `e66ecd4e58f823466542f57dddca4a89990a63cd`；首次 A01～A06 联合回归 183 pass / 1 fail（新字段缺 `.describe()`，触发既有描述守卫）→ 修复 `1ed6ec15e5c4b8dfce51c0bf9f10b812c0c87cd1`（只补 describe、改源重生成，未改既有测试 / 生成器）后 7 文件 184 pass / 0 fail；验证（实施者执行）：`WI intervention kinds` 24 / `WI pin_rule candidate` 1 / `WI intervention fields` 3 pass，工程门过｜原 blocked_by: IMPL-GATE-R6（已满足）
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

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；fixture P3 R-B / R-F 后续见 T-A10 / T-A21）**｜commit `0f604480816c6372e847d29cf05bdc63e88371a3`（+ 场景集合字段 describe 修复 `7bb83f98da4d874542f5ad37fdd5a2b57bbf2826`）；验证（实施者执行）：`WI jobs fixtures` 14 / `WI list coverage` 1 pass，typecheck / lint 过｜原 blocked_by: IMPL-GATE-R6（已满足）｜r6.4 旁注：本批后续 T-A09b（fixture-only）将校正本任务交付的初始未开始阶段种子数据（R-B 落点由 T-A10 改为 T-A09b）；不改写本任务固定 commit、上列验证结果与首批 Review 结论
- **预计**：2 h｜**依赖**：T-A06
- **上下文**：plan §2.4 的场景样例表（normal：j-collect / j-process / j-deliver / j-failed / j-cancelled；job-running：j-running / j-human；job-pending-merge：j-merge；job-conflict：j-conflict；job-delivered：j-delivered）。
- **修改范围**：【r6.3】下述 job-detail 工作区内容要求对**已开始**阶段成立；plan 样例表中 `not_started` 阶段的种子由 T-A09b 校正为空工作区（R-B，fixture-only；r6.4 由原 T-A10 改为 T-A09b），本任务标准 / 命令不变。新建 `frontend/src/contracts/mock/fixtures/jobs/jobs.json`（按场景集合分键：`normal` / `job-running` / `job-pending-merge` / `job-conflict` / `job-delivered`，empty / error / slow / boot-error 取 `normal` 集合再按场景规则处理——r6 精化，是 H-6 整文件替换的前提；共十个作业，status / currentStage / 四阶段状态与 plan 表逐行一致；j-failed、j-cancelled 带 reason；j-failed 的 describe / 备注写明 S-14；j-failed 的分析产物 `status=draft`——只有分析**阶段态**为 conflict（运行失败的呈现）并带 reason，产物不写成 conflict，故 normal 场景不预置收件箱条目（r6.1，R7 S-29））、`fixtures/jobs/job-detail.json`（以作业 id 为键；collect / process / analyze 工作区：上传与预览、两个数据源两条序列、单链配方 ≥3 步、派生值 lineage、一条有差异和一条空差异的对账、分析结论 ≥3 条且证据锚三种都有；j-conflict 有 conflict 结论和可用的 provisional 快照）。放在 `fixtures/jobs/` 子目录，**不改变** `fixtures/*.json` 的 9 文件计数；新建 `tests/unit/jobs/fixtures.spec.ts`。合成样例，不含私有数据。【r6.2 精度】`jobs.json` 边界 schema = `JobCollections`（五集合各为 `Job[]`）；`job-detail.json` = 以作业 id 为键的 `{collect, process, analyze, previews（以 Upload.id 为键的 ExtractionPreview）, reconciliations（ReconciliationDiff[]）}`，三个工作区即 `StageWorkspace` 对应分支。
- **完成标准**：
  1. 两个文件全部通过对应的边界 schema；十个作业的 status / currentStage / 阶段状态与 plan 样例表一一相符（AC-008-2、AC-002-3、AC-002-5、AC-005-6 部分前置）。
  2. 列表样例覆盖三种类型和多种状态，updatedAt 互不相同，可以检验倒序（AC-001-1、AC-001-2 部分前置）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI jobs fixtures"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI list coverage"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A08 作业 fixtures（二）：deliverable / interventions / uploads

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；fixture P3 R-A / R-B / R-E 后续见 T-A16 / T-A19、T-A10、T-A17）**｜commit `320277af618d75d15ec3e5fefec13cb4291cdf5e`；验证（实施者执行）：`WI deliverable fixtures` 5 / `WI final only delivered` 1 / `WI interventions fixtures` 1 pass，工程门过｜原 blocked_by: IMPL-GATE-R6（已满足）｜r6.4 旁注：本批后续 T-A09b（fixture-only）将校正本任务交付的初始未开始阶段 deliver 种子（`deliverable=null` / `finalSnapshot=null`；R-B 落点由 T-A10 改为 T-A09b）；不改写本任务固定 commit、上列验证结果与首批 Review 结论
- **预计**：2 h｜**依赖**：T-A07
- **上下文**：交付台、介入历史、待归属池的样例；S-18 的正例。
- **修改范围**：新建 `fixtures/jobs/deliverable.json`（j-deliver：六类块按 结论 / 图表 / 表格 / 引用 / 待验证 / 备注 排列，两个历史版本（agent v1、human v2），一个 open 批注线程，deliverableStatus=draft；j-merge：结论块 + 至少一个备注块，初始无 overlay；j-conflict：一个 conflict 块，带人版和 agent 版修订；j-delivered：final，三锚与 FinalSnapshot 一致）、`fixtures/jobs/interventions.json`（跨阶段、跨 kind，供筛选测试）、`fixtures/jobs/uploads.json`（两条待归属、一条 quarantined 并附原因）；扩充 `fixtures.spec.ts`。【r6.2 精度】`deliverable.json` = 以作业 id 为键的 deliver 分支 `StageWorkspace`（含 artifacts / revisions，S-18 同一次边界校验）；`interventions.json` = `Intervention[]`；`uploads.json` = `{uploads: Upload[], previews: 以 Upload.id 为键的 ExtractionPreview}`（实现为两条待归属、其中一条 quarantined 附原因；与“三条”读法的取舍留独立 Review，见 converge-batch-a09a §4 O-1）。【r6.3】标准 2 “其余都是 draft” 指已有交付物的作业；deliver 未开始的样例（j-collect / j-process / j-failed / j-cancelled / j-running / j-human）由 T-A09b 校正为 `deliverable=null`、`finalSnapshot=null`（同样不是 final；R-B；r6.4 由原 T-A10 改为 T-A09b）；本任务标准 / 命令不变。
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

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收；文案 P3 R-C 后续见 T-G06）**｜commit `82c36e7b05ce286ebc0f9650e466695e394612ee`；验证（实施者执行）：`WI scenarios` 15 / `WI change note` 1 / 三份既有契约测试 88 / `WI jobFixtures` 14 pass，工程门过；全量单测 20 文件 707 pass / 0 fail。`readJobFixtures()` 边界解析已交付、尚未被状态层调用（接入归 T-A10）｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：2 h（r6：+jobFixtures 解析）｜**依赖**：T-A08
- **上下文**：plan §1 的契约版本、§2.4“场景与驱动”。生成器的 §4 是静态文案，因此场景和变更说明要经 describe / `contractSemantics` 进入文档。
- **修改范围**：`types.ts`（`CONTRACT_VERSION='2.0.0'`；`BootstrapSchema.scenario` 扩成九个值，describe 写明四个 job-* 场景，并说明 v1 的十个方法在 job-* 场景下按 normal 行为）；`methods.ts` 的 `contractSemantics` 增加字符串项 `contractChange`（2.0.0 变更说明：新增作业方法、封闭场景枚举扩展、可选 jobContext、为何升 MAJOR、旧 bootstrap 不兼容）和 `jobScenarios`（九场景行为摘要、作业样例 id；并明写声明句“CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准”（S-19，不改生成器））；`mock/index.ts` 的 `MockOverrides.jobFixtures` 与其解析（键为 `fixtures/jobs` 的文件名；**每个给出的键整体替换对应内置文件、不深合并**，`jobs` 与文件同形（按场景集合分键），因此“新增一项”= 原集合加该项后整体替换，“只含非进行中作业”= 以该集合整体替换；在每个 mock DataClient 的会话状态建立时读取一次并在边界校验，非法值 validation_error；`jobScenarios` 同时写明该语义及“切换覆盖值须新建 client，沿用 v1 测试在系统边界 spy 委托的做法”；不新增 `jobScript`——r6，H-6）；**只**修改既有契约测试 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受 v2 影响的硬编码断言（版本字面量改为引用 `CONTRACT_VERSION`；方法数与键列表改为“包含 v1 十个方法、总数等于 methodSemantics”；`mock.spec.ts:96-99` 把 `Object.values(dataMethods)` 与十个 `dataRequests` 结果按索引配对的循环改为只遍历 v1 十个方法键——r6 基线审计 B-7）。保留全部 v1 断言语义，不删 v1 用例。生成物；新建 `tests/unit/jobs/contract-version.spec.ts`。【r6.2 精度】`jobFixtures` 边界解析导出为 `readJobFixtures()`（按文件键浅合并到内置文件后以 strict 对象校验，未知键 / 非法值 validation_error）与 `jobFixtureSchemas`；为让未改的生成器展开 record 字段，`JobDetails` 的值提为具名 `JobDetailFixture` 并与 `JobCollections` / `JobDetails` / `DeliverableFixtures` / `UploadFixtures` 一并注册进 `contractSchemas`（不改生成器）。
- **完成标准**：
  1. bootstrap 返回 2.0.0；九个场景均可解析，未知场景返回 validation_error；`?scenario=` > `VITE_MOCK_SCENARIO` > normal 的优先级不变（AC-008-2、AC-008-4 部分前置）。
  2. CONTRACT.md 标题为 v2.0.0，§1 含变更说明和 job 场景说明，job 场景说明含 S-19 声明句（AC-008-4 部分前置）。
  3. frontend-workbench 既有单测在新契约下全部通过，被改的只有上述硬编码断言（plan §6“合并前跑其 pnpm test”；AC-009-1 部分前置：全量命令包含既有单测）。
  4. `jobFixtures` 解析（`mock/index.ts` 内供 T-A10 建状态使用的边界解析）：给出的键整体替换对应内置文件（不深合并）；`jobs` 覆盖为“原 normal 集合 + 一项”或“只含 delivered / cancelled 作业”时，解析得到的作业集合与覆盖值相同；未给出的键沿用内置文件；非法覆盖 validation_error（AC-008-2 部分前置；r6 H-6）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/contract-version.spec.ts -t "WI scenarios"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/contract-version.spec.ts -t "WI change note"`
  3. `pnpm -C frontend test:unit tests/unit/contracts.spec.ts tests/unit/contract-doc.spec.ts tests/unit/mock.spec.ts`
  4. `pnpm -C frontend test:unit tests/unit/jobs/contract-version.spec.ts -t "WI jobFixtures"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A09a H-1：jobContext 契约字段与 mock 事件透传（r6 新增）

- **状态**：**已完成（batch-a09a；本批代码 Review 通过 `af95b66`，不表示 AC 最终验收）**｜commit `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`；验证（实施者执行）：`WI H-1 schema` 3 / `WI H-1 legacy` 5 / `WI H-1 passthrough` 7 pass，命令 4 过；末轮全量单测 21 文件 722 pass / 0 fail，`check` 六守卫、`contract --check`、typecheck、lint、`git diff --check` 过。H-1 生产方 ①②③ 具备、④ 未取得（未交付）｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1 h｜**依赖**：T-A02、T-A09
- **上下文**：plan §2.4（`SendMessage.jobContext?` 与十类 AgentEvent 的公共可选字段，同 run 事件保留发送时上下文）；v2 plan §7.3 H-1。r6 从 T-A18 拆出（即 S-22 当初建议的拆法），使 H-1 不再等待 mock 状态层（T-A10～T-A17）；作业运行关联（activeRunId / overlay）仍在 T-A18。
- **修改范围**：`types.ts`：`SendMessageSchema` 增 `jobContext: JobContextSchema.optional()`（describe）；`frontend/src/agent/events.ts`：共享的 `eventFields` 增公共可选 `jobContext`（十类事件同得；不改事件种类与唯一终态）；`mock/index.ts` 的 `createMockAgentClient.send`：payload 带 `jobContext` 时把同一值写入该 run 的全部事件，不带时事件**不出现**该键；生成物；新建 `tests/unit/jobs/agent-context-contract.spec.ts`。
- **完成标准**：
  1. `SendMessage` 带 / 不带 `jobContext` 均通过，非法 stage 被拒；CONTRACT.md 中 SendMessage 与十类事件的字段清单含可选 `jobContext`（AC-005-5、AC-008-1 部分前置；H-1）。
  2. v1 原有十类事件样例与四份 agent 脚本（不带该字段）仍通过 `AgentEventSchema` / `AgentRunSchema`（AC-008-1 部分前置；H-1 旧 fixture 兼容）。
  3. 真实 mock `send({message, jobContext})` 回放的该 run 全部事件带与 payload 相同的 `jobContext`；不带时没有任何事件含该键；之后另一次带不同上下文的 send 不改变前一 run 已投递的事件（假时钟推进真实定时器）（AC-005-5 部分前置；H-1 透传）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/agent-context-contract.spec.ts -t "WI H-1 schema"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/agent-context-contract.spec.ts -t "WI H-1 legacy"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/agent-context-contract.spec.ts -t "WI H-1 passthrough"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A09b R-B 种子校正：未开始阶段内置工作区置空（fixture-only；r6.4 从 T-A10 拆出）

- **状态**：**已完成（batch2；本批代码 Review 通过 `f72a1a1`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收；R-B 仍部分落实、未关）**｜commit `75a115975b50d8078f159f2e41ce5c401318f0b7`；验证（实施者执行，Converge 未重跑）：命令 1 `WI not-started seeds` 1 pass；命令 2 `fixtures.spec.ts` 整文件 23 pass；命令 3 typecheck / lint 通过。Converge 只读脚本核对：12 个未开始种子为空；已开始阶段与 `34d339e` 逐一相等；`jobs.json` 未变；只有 j-cancelled `previews={}`、j-collect / j-cancelled `reconciliations=[]` 变化。R-B：本任务只校正 12 个未开始样例；done 阶段的上游 draft 产物照旧残留，未自动审批，R-B 仍“部分落实、未关”（implementation-log §8）｜原 blocked_by: IMPL-GATE-R6（已满足）｜开码前置 R8.1 已满足（`34d339e`）
- **预计**：0.5 h｜**依赖**：T-A08
- **上下文**：`review-batch-a09a.md` R-B（= Converge O-2）；plan §2.4【r6.3，R-B】种子口径；Checklist R8 B-12（R-B 与状态层零耦合、可独立用 `fixtures.spec.ts` 验收，故单列，不再并入 T-A10）。五份 `fixtures/jobs/*.json` 与 `fixtures.spec.ts` 已由 T-A07 / T-A08 交付（依赖 T-A08 即足）；本任务**不需要** T-A09 / T-A10 的状态层或任何 DataClient 运行状态。首批 T-A07 / T-A08 的固定 commit、验证结果与 Review 结论不改写，本任务是其后的独立 fixture 校正提交。
- **修改范围**（只改种子数据与对应测试断言；不是生产 guard、不是读侧推导；无代码 / schema / 类型 / 生成物改动）：只许修改 `frontend/src/contracts/mock/fixtures/jobs/{job-detail,deliverable}.json` 与 `frontend/tests/unit/jobs/fixtures.spec.ts`。以 plan §2.4 样例表（即 fixtures.spec 中手写的十行状态表）阶段态为 `not_started` 的 12 个 (作业, 阶段) 为准——j-collect 的 process / analyze / deliver、j-process 的 analyze / deliver、j-failed / j-running / j-human 的 deliver、j-cancelled 的四个阶段——把对应工作区改为空集合：collect `{stage, uploads:[], artifacts:[], revisions:[]}`；process `{stage, sources:[], series:[], artifacts:[], revisions:[], derivedValues:[]}`；analyze `{stage, artifacts:[], revisions:[]}`；deliver `{stage, artifacts:[], revisions:[], deliverable:null, finalSnapshot:null}`；collect 未开始的作业（j-cancelled）`previews={}`，process 未开始的作业（j-collect、j-cancelled）`reconciliations=[]`（不留指向不存在投放 / 序列的孤立样例）。**不改**：`jobs.json`（十个作业、ID、status / currentStage / 阶段态 / pendingCount）、`interventions.json`（i-seed-1～6 的锚全在已开始阶段，校正后仍可达）、`uploads.json`、已开始阶段的全部内容与 ID；done 阶段产物状态照旧（不把 draft 升为 confirmed，见 implementation-log §8 R-B 残留）；`types.ts` / 生成物 / plan 样例表 / 需求不变。`fixtures.spec.ts` 只做三处收窄——`test.each(Object.keys(details))` 的逐作业内容断言（两条投放与预览、两源两序列、≥3 步单链配方、lineage、两条对账、≥3 结论三种证据）只对**已开始**阶段；`WI deliverable fixtures` 中对全部作业的 deliver 循环（交付块锚可达）只对 deliver 已开始者；`WI final only delivered` 的“非 j-delivered 均为 draft 且三锚 null”改为“deliver 已开始者 draft 且三锚 null、deliver 未开始者 `deliverable=null` / `finalSnapshot=null`”——并新增 `WI not-started seeds` 用例断言上述 12 个空态与 previews / reconciliations（期望来自手写状态表，不从 fixture 推导）；不删用例、不改既有标题、不放宽对 schema 边界与已开始样例的任何断言。
- **完成标准**：
  1. 12 个未开始 (作业, 阶段) 的种子为上列规定空工作区，j-cancelled `previews={}`，j-collect / j-cancelled `reconciliations=[]`，由 `fixtures.spec.ts` 新增的 `WI not-started seeds` 依手写状态表断言（AC-002-5、AC-004-5、AC-005-6 部分前置；R-B）。
  2. `fixtures.spec.ts` 全文件通过：T-A07 / T-A08 既有五个标题（`WI jobs fixtures` / `WI list coverage` / `WI deliverable fixtures` / `WI final only delivered` / `WI interventions fixtures`）仍全部匹配并通过——已开始阶段内容断言、j-deliver / j-delivered 的 S-18 parse 与“只有 j-delivered 为 final”、i-seed-1～6 介入锚仍可达、真实边界 schema 对畸形文件与 S-18 反例的拒绝用例均保留且未放宽（AC-002-5、AC-005-6、AC-006-7、AC-007-1 部分前置；R-B 不回退首批断言）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts -t "WI not-started seeds"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/fixtures.spec.ts`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A10 mock 状态层核心与读方法（S-13）

- **状态**：**已完成（batch2；本批代码 Review 通过 `f72a1a1`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收；本批 P3 R2-A / R2-B / R2-E 的后续归属见页首，未修）**｜commit `1841029f5a948b53ef21cbc54967556dc04e0815`；验证（实施者执行，Converge 未重跑）：命令 1～5：`WI listJobs` 2 / `WI scenarios read` 33 / `WI slow` 3 / `real-stubs.spec.ts` 14 / `WI not-started seeds` 1 pass；命令 6：`contract --check`（15 methods / 10 events / 2 artifacts）/ typecheck / lint 通过；段末全量单测 23 文件 776 pass / 0 fail；**失败留痕**：场景组首跑 23 pass / 10 fail，原因是新测试的嵌套匹配器没有容纳错误对象里的 `message` 字段；只改新测试匹配器后 33 pass，未放宽生产代码或既有测试；S-37（Checklist R8.1 P3）：`job-state-read.spec.ts` 的 `WI not-started seeds read` 用例同时断言了非空正向样例（j-collect collect 等于原样例且有 2 条投放；j-deliver deliver 等于原样例，六类块按序）。**断言已落实**，本标准未改字；R-D：未新增 guard（`JobStateSchema` 只组合既有边界 schema）；状态按构造保持的策略留给后续写方法（implementation-log §8）。｜原 blocked_by: IMPL-GATE-R6（已满足）｜开码前置 R8.1 已满足（`34d339e`）
- **预计**：2 h｜**依赖**：T-A09、T-A09b
- **上下文**：plan §2.3“契约 mock 层持有唯一可变状态”，§2.4 九场景 × 读方法表。
- **修改范围**：新建 `frontend/src/contracts/mock/job-state.ts`（按场景从 fixture——或 T-A09 解析出的 `jobFixtures` 覆盖——建会话状态；该状态是**模块级唯一共享会话状态**：每次调用 `createMockDataClient()` 时建立 / 重建（读 scenario 与 `jobFixtures` 各一次），`createMockAgentClient()`（T-A18 接入）与所有 DataClient 实例共用当前这一份，不各持一份；因此 `jobFixtures` 为“建状态时读一次”，与既有 v1 `fixtures` 的“每次请求读取”时机不同（r6.1，R7 S-27，只定语义、无新机制）；单一 `commit(mutator)`：在深拷贝上修改 → 边界校验 → 整体替换，失败时不留部分修改；读 API 返回副本）；实现 `listJobs(filter?)`（状态 / 类型 / 标题子串组合筛选，缺省 updatedAt 倒序）、`getJob`（S-13）、`getStageWorkspace`；empty / error（业务读方法返回 adapter_error，bootstrap / 目录仍然成功）/ slow（每次调用延迟 1500ms）/ boot-error / job-* 的读行为；`client.ts` 的 `DataClient` 接口、`methods.ts` 的 `dataMethods` 语义、`real/index.ts` 的 NotImplementedError 桩（无网络）、`mock/index.ts` 接线。生成物；新建 `tests/unit/jobs/job-state-read.spec.ts`、`tests/unit/jobs/real-stubs.spec.ts`。本任务不实现持久化（T-A11）、写方法（T-A12 起）与 Agent 运行关联（T-A18）；`commit(mutator)` 本任务无生产调用方，其原子性由 T-A17 标准 2 经真实 commit 验证。
  【r6.4 R-B 读回（fixture 校正本身归 T-A09b；本任务**不改**任何 fixture 文件与 `fixtures.spec.ts`）】`getStageWorkspace` 原样返回状态层内容、**不按阶段态过滤**（rerunStage 后下游 `not_started` 仍保留旧修订与 draft 新修订，plan §4 迁移表），故“未开始 = 空”只是 T-A09b 落地的初始种子口径，不写进 schema、不做入口校验；`job-state-read.spec.ts` 新增 `WI not-started seeds` 用例，经真实 `getStageWorkspace` 读回 T-A09b 的 12 个空工作区（与 T-A09b 在 `fixtures.spec.ts` 中的同名前缀用例各一个、分属两份 spec，命令均带文件路径，互不误跑）。T-A12 `createJob` 的“初始空产物”（plan §4.1）不受影响；“无产物”的空工作区表达已由 S-13 / 覆盖缺样例场景引入，不是新 UI 状态。
  【r6.5 精度（Converge batch2 登记；只记实际接口，不改标准 / 命令）】
  - `DataClient.listJobs(filter?: {status?: JobStatus; type?: JobType; title?: string})`：契约参数为 strict 对象，未知键返回 validation_error。status / type 精确匹配；`title` 区分大小写做子串匹配，空串不限制；省略 filter 或传 `{}` 时返回全列表。
  - `getJob(jobId)` / `getStageWorkspace(jobId, stage)` 为位置参数，`jobId` 必须非空。
  - 未知锚在任何场景都返回 not_found；error 场景只对已知目标返回 adapter_error。
  - 状态在 `contracts/mock/job-state.ts` 内重建：`createMockDataClient()` 调用唯一的初始化入口；生产代码中唯一的写入口是 `commit(mutator)`。
- **完成标准**：
  1. 筛选组合、清空后恢复全量、倒序都正确（AC-001-2 部分前置）。
  2. empty：`listJobs` 返回 []，预置 id 时 `getJob` 返回 null，`getStageWorkspace` 返回带阶段的空集合；未知 id 在 normal / empty 下都是 not_found；error 时三个读方法（含 `listJobs`）都返回 adapter_error；存在 `jobFixtures` 覆盖时，会话状态在 client 创建时据覆盖建立一次，`listJobs` 返回覆盖集合（normal 下 + 一项即可见该项），覆盖集合中没有工作区样例的作业 `getStageWorkspace` 同样返回带阶段的空集合（r6，H-6）（AC-001-4、AC-004-5、AC-005-6 部分前置；S-13）。
  3. slow 在 1499ms 时尚未返回、1500ms 时返回（假时钟）（AC-008-2 部分前置）。
  4. real 桩覆盖 `DataClient` 的全部键，并抛出 NotImplementedError（AC-008-3 部分前置）。
  5. 【r6.4 R-B 读回】T-A09b 校正后的 12 个未开始 (作业, 阶段)（j-collect 的 process / analyze / deliver、j-process 的 analyze / deliver、j-failed / j-running / j-human 的 deliver、j-cancelled 的四个阶段）经真实 `getStageWorkspace`（normal / job-running 场景、新建 client）返回带阶段的空工作区（deliver 为 `deliverable=null`、`finalSnapshot=null`）（AC-002-5、AC-004-5、AC-005-6 部分前置；R-B）。
  6. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI listJobs"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI scenarios read"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI slow"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/real-stubs.spec.ts`
  5. `pnpm -C frontend test:unit tests/unit/jobs/job-state-read.spec.ts -t "WI not-started seeds"`
  6. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A11 本地持久化 persistence.ts 与 resetMockData

- **状态**：**已完成（batch3；第三批代码 Review 通过 `49edb7e`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收；P3 R3-C 归 T-G04，未修）**｜原状态行“已实施（batch3，待第三批独立代码 Review）”为 Converge 时原文｜commit `c7ebccb8f9e29350d5a815959be3b532191bdb95`；命令 4 的 error 分支后由 T-A12 test-fix `0a2d1a5e756b4a469996d2069996a256f16722b9` 按 r6.6.2 维护。
  - **验证**（实施者执行，Converge 未重跑）：命令 1～4 依次为 `WI whitelist` 6 / `WI degrade` 3 / `WI corrupt` 4 / `WI non-normal` 13 pass；命令 5 为 `contract --check`（16 methods / 10 events / 2 artifacts）、typecheck、lint，均通过；另 real-stubs 15 pass，`check` 六守卫通过。
  - **全量回归**：`c7ebccb` 提交时 clean 树 28 文件 860 pass / 0 fail。
  - **失败留痕**：首轮新测试有 Storage spy 漏记、跨例残留和两处类型错误，只修了新测试。
  - **R2-B**：初始化顺序是先建 state、再 hydrate，有测试固定，未加 guard。
  - **S-40**：已落实。
  - **待 Review 核对的落点**：`mappingHistory` 的 schema 与投影在本提交即已落地（`converge-batch3.md` §5 O-B3-1）。→ Review 判定（`review-batch3.md` §5）：O-B3-1 可接受、非缺口；隐私边界经 A 核对认可。
  - 原 blocked_by: IMPL-GATE-R6（已满足）；开码前置 R9 已满足（`ab742f5`）。
- **预计**：2 h｜**依赖**：T-A10
- **上下文**：plan §2.3 / §3 的持久化规则。plan 没写横幅如何得知持久化状态，本任务由 `persistence.ts` 提供只读状态订阅（`getPersistenceStatus()` / `onPersistenceStatus(cb)`，取值 `ok|degraded|unreadable`），供 T-G04 的横幅使用；不经业务契约。
- **修改范围**：新建 `frontend/src/jobs/persistence.ts`（`fai.jobs.v1` = `{version:1,data}`；`fai.inbox.v1` = 已读 id；UTF-8 字节数用 TextEncoder 计算，上限 512 KiB；配额异常时降级）；`job-state.ts` 接入：只有 normal 场景且没有 `jobFixtures` 覆盖时读写（r6，H-6：注入的样例不污染本机快照）；每次成功 commit 后保存；`resetMockData`（normal：删除两个 key 并重建 fixture；其他场景：只重建内存）；`DataClient` / `methods.ts` / real 桩加 `resetMockData`。生成物；新建 `tests/unit/jobs/persistence.spec.ts`。
  【r6.6 精度（机制见 plan §2.3 / §3【r6.6】；不改标准编号与命令）】
  - **`jobs/persistence.ts` 导出**：
    - `JOBS_KEY='fai.jobs.v1'`、`INBOX_KEY='fai.inbox.v1'`；
    - `PersistedJobDataSchema` / `PersistedJobData`：本任务 = `{jobs, details, deliverables, interventions, uploads}`，用既有契约 schema 组合，内部用、不进 `contractSchemas`；
    - `loadJobsSnapshot(): PersistedJobData | null`、`saveJobsSnapshot(data): void`、`clearJobKeys(): void`；
    - `resetPersistenceStatus(): void`（只置 ok，不碰 storage）、`getPersistenceStatus()`、`onPersistenceStatus(cb): () => void`。
    - `fai.inbox.v1` 只定 key 与格式（`string[]`），在重置时删除；已读 id 的读写函数随 T-A21（有消费方时）引入。
  - **`job-state.ts`**：
    - `JobStateSchema` = `PersistedJobDataSchema` + `scenario` / `emptyJobIds`；模块另记当前会话 `{seeds, persistent}`。
    - `initializeJobState(scenario, seeds, persistent)`：先建状态；persistent 时 `loadJobsSnapshot()` 非 null 则覆盖可持久化字段；非持久时 `resetPersistenceStatus()`。
    - `commit`：替换状态后，若 persistent，则 `saveJobsSnapshot(可持久化字段)`。
    - 新增 `resetJobState()`：用会话记录的 seeds / scenario 重建；persistent 时依次 `clearJobKeys()` → 重建 → `saveJobsSnapshot`。
  - **`mock/index.ts`**：
    - 工厂把 `window.__FAI_MOCK__?.jobFixtures` 只读一次到局部变量，交给私有解析 helper；`readJobFixtures()` 改为同一 helper 对 getter 的薄包装，返回形状不变。
    - `persistent = scenario === 'normal' && override === undefined`。
    - `resetMockData`：按当前共享状态的 scenario 延迟（slow）；error 下不拒绝；调用 `resetJobState()` 后返回 null。
  - **契约**：`DataClient.resetMockData(): Promise<null>`；`methods.ts` 描述保持实现中立（R2-A：mock 场景句不写进方法描述）；real 桩；生成物。
  - **既有 jobs 回归（属语义变更处，允许改）**：`job-state-read.spec.ts` 增加 `beforeEach(() => localStorage.clear())`。`WI scenarios read` 中两例按新语义改写：
    - “real commit…”一例：末句的新 normal client 改为读回已持久化的提交；“重建即丢弃”改用非持久场景验证。
    - “this batch stays entirely in memory…”一例：改为“非 normal 与有覆盖时零访问；normal 无覆盖时只 getItem 一次 `fai.jobs.v1`，不写、不删”。
    - 不改 v1 三份契约测试（`tests/unit/{mock,contracts,contract-doc}.spec.ts`；不含本 feature 自有的 `tests/unit/jobs/real-stubs.spec.ts`）、生成器、工具链、壳 UI。
  - **【r6.6.1 范围精度】`tests/unit/jobs/real-stubs.spec.ts` 只追加一键**（T-A10 交付，属 §1-5 jobs 测试所有权）：
    - 依据：该文件 `requests` 表以 `satisfies { [Method in keyof DataClient]: () => ReturnType<DataClient[Method]> }` 约束，并断言 `requests` / `dataMethods` / `dataClient` 的键严格相等；新增 `DataClient` 方法时必须同步加键，否则 typecheck 与该测试必然失败。
    - 允许改动：只在 `requests` 表追加 `resetMockData: () => dataClient.resetMockData()` 一行。
    - 不改：既有 13 键、`satisfies` 约束、两条断言与 describe / test 行为；不改成动态枚举，不弱化校验。
    - 性质：T-A10 “real 桩覆盖全部 DataClient 键”的自然维护，不新增标准 / 命令。回归由标准 5 的 typecheck（`satisfies` 全键）与批末全量 `test:unit` 覆盖，也可加跑 T-A10 命令 4。见 analyze.md「Analyze R12.1」。
  - **测试提示**（对应既有标准，不新增）：
    - 本任务尚无写方法，持久化测试经真实 `commit(mutator)` 制造写入（同 T-A17 标准 2 口径）。
    - 超限：用 mutator 写入超长 `goal`。配额异常：在系统边界 `vi.spyOn(Storage.prototype, 'setItem')` 抛错。
    - 每例前 `localStorage.clear()`、`delete window.__FAI_MOCK__`。
    - R2-B：总是先建 client 再观察；不测未初始化路径，不加 guard。
  - **【r6.7 精度（Converge batch3 登记；只记实际落点，不改标准 / 命令）】**
    - `PersistedJobDataSchema` 在本任务提交 `c7ebccb` 中已含 `mappingHistory`（`.default([])`），快照即为六键；T-A12 因此没有改 `persistence.ts`。终态与 plan §2.3【r6.6】一致，批内落点顺序交第三批 Review 核对（`converge-batch3.md` §5 O-B3-1）。
    - 状态类型 `'ok'|'degraded'|'unreadable'` 只作为函数签名出现，未单独导出类型名。
    - `loadJobsSnapshot` 把 getItem 异常也归入 unreadable；`clearJobKeys` 的 removeItem 异常未捕获（plan 未规定，未加防御，O-B3-3）。
- **完成标准**（正负向齐全）：
  1. normal 下保存后新建 client 能读回；持久化子集为白名单：Upload 只含 id / jobId / inputKind / fileMeta / url / sourceNote / mapping / status / createdAt / removed（另含既有可选结构化字段 `quarantineReason`，即 fixture 合成的隔离判定说明、非投放原文；r6.6 补列，见 plan §3），不含粘贴正文和 File 对象（spec §4 持久化；AC-003-3 部分前置）。
  2. 超过 512 KiB 或 setItem 抛异常 → 状态 degraded，内存继续可用，**最后一次成功的快照仍在、未被删除**（spec §4 持久化约束，无独立 AC；随 AC-009-1 全量回归）。
  3. 内容损坏或版本不支持 → 本次用 fixture，状态 unreadable，**原 key 保留**，本会话不自动覆写；只有 resetMockData 才删除（spec §4 持久化约束，无独立 AC；随 AC-009-1 全量回归）。
  4. 八个非 normal 场景、以及 normal 下存在 `jobFixtures` 覆盖时（r6，H-6），对两个 key 一律不 getItem / setItem / removeItem（Storage spy 计数为 0）；切场景不清空；`fai.rail` / `fai.drawer` / `fai.layout` 不受影响（AC-008-2 部分前置）。
  5. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI whitelist"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI degrade"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI corrupt"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/persistence.spec.ts -t "WI non-normal"`
  5. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A12 写方法：createJob 与投放主流程

- **状态**：**已完成（batch3；第三批代码 Review 通过 `49edb7e`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收）**｜原状态行“已实施（batch3，待第三批独立代码 Review）”为 Converge 时原文｜commit `742d6aa3d671cee91c6cce856f657a103d510615`，另有语义回归 test-fix `0a2d1a5e756b4a469996d2069996a256f16722b9`（r6.6.2：只改 `persistence.spec.ts` `WI non-normal` 的 error 分支）。
  - **验证**（实施者执行，Converge 未重跑）：命令 1～4 依次为 `WI createJob` 11 / `WI confirm` 5 / `WI intake validation` 10 / `WI scenario writes` 5 pass；命令 5 为 `contract` / `contract --check`（20 methods）、typecheck、lint，均通过；real-stubs 19 pass。
  - **失败留痕**：
    - ① 首次 typecheck 发现新建交付物漏填 `jobId`，已补齐。
    - ② `742d6aa` 提交时**没有跑 clean 全量**。在含 A13 WIP 的树上首次批量 `test:unit` 为 925 pass / 1 fail，唯一失败是 T-A11 旧 error 分支仍期待 commit 成功。Astra 按范围停下；r6.6.2 许可后提交独立 test-fix。test-fix 后的验证在含 A13 WIP 的树上完成（三文件 96 pass），首个 clean 全量见 T-A13（926 / 0）。
  - **R-D**：②⑤ 由写方法按构造保持，未加 refine。
  - **S-39**：落在“ingest 总锚 dataset（含新建）”这一读法。
  - 原 blocked_by: IMPL-GATE-R6（已满足）；开码前置 R9 已满足（`ab742f5`）。
- **预计**：2 h｜**依赖**：T-A11
- **上下文**：plan §4.1 / §4.2；矩阵中的 ingest / map_fix。
- **修改范围**：`job-state.ts` + 接口 / 方法表 / real 桩 / mock 接线：`createJob(input)`（写入 collecting / collect，阶段为 R,N,N,N；初始空产物；交付物 draft，定稿锚为 null）、`submitIntake(input)`（jobId 在提交时确定，没有作业则进入待归属；返回 pending_validation 的预览；有作业时写 ingest 事件）、`getIntakePreview(uploadId)`、`confirmIntake(uploadId, mapping)`（默认 ingested；fixture 判定的样例为 quarantined 并附原因；写 map_fix 事件，保留修正前的 mapping）。error 场景不产生部分修改；slow 在提交前延迟。生成物；新建 `tests/unit/jobs/job-state-intake.spec.ts`。
  【r6.6 精度（机制见 plan §2.4 / §3【r6.6】；不改标准与命令）】
  - **`types.ts`**（本任务必要的契约精度，生成物随之更新）：
    - 新增 `CreateJobInputSchema`、`IntakeReceiptSchema`（`WriteReceiptSchema` + `upload` / `preview`），注册进 `contractSchemas`；
    - 每个字段带 describe（既有描述守卫，见首批失败留痕）；
    - 方法签名按 plan §2.4【r6.6】。
  - **`persistence.ts`**：`PersistedJobDataSchema` 增加 `mappingHistory: {uploadId, mapping, status, replacedAt}[]`，在快照入口默认 `[]`（version 仍为 1）；`JobState` 同步。
  - **`mock/index.ts`**：
    - 读方法 `getIntakePreview` 沿用 `readJobState`。
    - 写方法共用一个写包装：入口 parse → 按当前共享 scenario 做 slow 延迟 → 调用 job-state 写函数 → 结果边界 parse。
    - error 的拒绝放在 `commit` 内（mutator 与边界校验之后、替换状态之前），以保持未知锚 not_found（plan §2.4 场景表“查无 id 独立”）。
  - **job-state 内只抽会复用的 helper**：
    - `writableJob`：查作业，并拒绝 delivered / cancelled；
    - `findUpload`：在池或各作业 collect 中查找；
    - 追加 dataset 修订：本任务的 submit / confirm 使用，T-A13 的 assign / remove 复用；
    - 回执收件箱计数：T-A21 前为 0，由 T-A21 接管。
  - **生成规则**：
    - id 用 `j-` / `u-` / `i-` + `crypto.randomUUID()`；修订 id 为 `<artifactId>-r<n>`，n = 该产物已有修订数 + 1。
    - 时间戳 `new Date().toISOString()`；修订摘要文字自定，不作断言。
  - **合成预览（固定值，不由文件名 / URL / 文本推断）**：
    - `detectedType`：file = `合成文件预览（未解析正文）`；url = `合成链接预览（未抓取）`；text = `合成文本预览（正文不保存）`。
    - `fields = [{sourceField:'合成列 1', targetField:'待映射', unit:'待确认'}]`，`unit = null`，`timeRange = null`。
  - **测试提示**（对应既有标准）：
    - 标准 2 “quarantined 样例可复现”：经 `jobFixtures.uploads`（或 `job-detail`）覆盖注入一条 pending_validation 且带 `quarantineReason` 的投放，再 confirm。这属系统边界注入，走真实实现；有覆盖的会话不持久化。
    - 修正前 mapping：已归属投放看 `getStageWorkspace` collect 的旧修订；未归属投放看 normal 快照中的 `mappingHistory`。
    - 标准 3：normal 下 submit 文本后，`fai.jobs.v1` 不含正文字符串；ingest payload 的 sourceNote 五字段原样。
    - 标准 4：slow / error 下的读方法本身也延迟或报错，因此“未提交 / 读回不变”经 job-state 的同步读函数观察。
    - 每例前清 `localStorage`。
  - **【r6.6.1 范围精度】`tests/unit/jobs/real-stubs.spec.ts`**：规则同 T-A11 该条，只在 `requests` 表追加本任务四键的真实 stub 调用，参数按实际输入类型给最小合法值。示例（非强制）：
    - `createJob({ title: '样例作业', type: 'daily', subject: null, goal: '样例目标' })`
    - `submitIntake({ jobId: null, inputKind: 'url', url: 'https://example.invalid/sample', sourceNote: { purpose: '样例', reliability: 'unknown', publishedAt: null, validUntil: null, scopeNote: null } })`
    - `getIntakePreview('u-unassigned-file')`、`confirmIntake('u-unassigned-file', [])`
    - 既有键、`satisfies` 约束、断言与 describe / test 不改，不新增标准 / 命令。
  - **【r6.6.2 语义回归许可】`tests/unit/jobs/persistence.spec.ts` 只改一处**（T-A11 交付，属 §1-5 jobs 测试所有权）：
    - 依据：本任务【r6.6 精度】与 plan §2.4【r6.6】规定 error 拒绝放在 `commit` 内（mutator 与边界校验之后、替换状态之前）。因此 error 场景下真实 `commit` 必然抛 adapter_error。T-A11 的 `WI non-normal` 参数化用例（`test.each([...八个非 normal 场景])`）在切到当前场景后直接 `commit(...'memory edit')` 并期待成功，其 error 分支与已批准语义冲突（实施树 `742d6aa` 起该分支红；A13 末轮全量唯一失败即此例）。
    - 允许改动：**只改该参数化用例的 error 分支**——error 时断言真实 `commit` 抛 `{ error: { code: 'adapter_error' } }`，且目标作业经真实 job-state 同步读函数（如 `getJob`）读回与调用前相同；其余 7 个场景照旧直接 commit、不抛。
    - 不改：该用例其余全部断言（error 下业务读 `listJobs` 仍为 adapter_error；旧 client 的 `resetMockData` 在 error 下也照常 resolve null；`getJobScenario()` / `getPersistenceStatus()`；两个 key 的 getItem / setItem / removeItem 零调用、无 `clear`；normal 快照哨兵与 inbox 哨兵不变）；文件内其他 describe / test（含 `normal override`）、spy 方式与场景列表。
    - 禁止：放宽生产规则（error 拒绝时机、写包装）、`skip` / 注释掉用例、把 error 移出场景列表、改成断言白名单或宽松匹配。
    - 性质：A12 已批准 error 语义的旧测试维护（T-A11 标准 4 / 命令 4 随之恢复），可作为 A12 的独立 test-fix commit；不新增标准 / 命令 / guard，不改估时、依赖与总数。原全量红（925 pass / 1 fail）作为失败留痕，见 analyze.md「Analyze R12.2」。
  - **不做**：真实解析 / 抓取 / 模型 / 启发式隔离；T-A13 的池、归入、删除与取消；不宣称 T-A17 的只读门已完成。
  - **【r6.7 精度（Converge batch3 登记；只记实际落点，不改标准 / 命令）】**
    - `CreateJobInputSchema` 的 title / subject 用 zod `.trim().min(1)`，写入的是去掉两端空白后的值。
    - 首次投放到无 dataset 的作业时，同一次写内建立 `<jobId>-dataset`；ingest 的 `artifactId` 指向它，`baseRev` 为 null（Checklist R9 S-39 的建议读法，plan §2.4【r6.7】）。
    - 本任务未改 `persistence.ts`（`mappingHistory` 已随 T-A11 落地）。
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

- **状态**：**已完成（batch3；第三批代码 Review 通过 `49edb7e`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收；P3 R3-B 归 T-C03 / T-A17，未修）**｜原状态行“已实施（batch3，待第三批独立代码 Review）”为 Converge 时原文｜commit `a5ad11c79cf08ca50ebb55ef0984beae952a7dad`。
  - **验证**（实施者执行，Converge 未重跑）：命令 1～3 依次为 `WI assign` 15 / `WI removeUpload` 4 / `WI cancelJob` 8 pass；命令 4 为 `contract --check`（24 methods / 10 events / 2 artifacts）、typecheck、lint，均通过；real-stubs 23 pass。
  - **全量回归**：提交后 clean 树 30 文件 926 pass / 0 fail，`check` 六守卫通过。
  - **WIP 保全**：A13 WIP 在 scope 停止前后的 tracked diff 与 pool spec 的 SHA256 相同，Converge 已独立复算。
  - **范围**：对 `persistence.spec.ts` 无改动。
  - **R-D ⑤**：cancel 按 plan 保留阶段快照，未加 refine。
  - **待 Review 核对**：重复删除语义（`converge-batch3.md` §5 O-B3-2）。→ Review 判定：R3-B（P3），归 T-C03 或 T-A17，未修、未经风险接受。
  - 原 blocked_by: IMPL-GATE-R6（已满足）。
- **预计**：1.5 h｜**依赖**：T-A12
- **上下文**：plan §4.2（assign 时补作业内的 ingest 事件；removeUpload 只移除当前关联）；矩阵中的 remove_source / cancel_job。
- **修改范围**：`listUnassignedUploads()`、`assignUpload(uploadId, jobId)`、`removeUpload(uploadId, reason)`（kind=delete，action=remove_source；从当前视图移除，历史锚保留）、`cancelJob(jobId, reason)`（cancelled + reason，kind=delete，action=cancel_job）；接口 / 方法表 / real 桩 / 接线；生成物；新建 `tests/unit/jobs/job-state-pool.spec.ts`。
  【r6.6 精度（规则见 plan §2.4【r6.6】；不改标准与命令）】
  - **规则**：assign 把池中记录（连同预览）移入目标作业；remove 只置 `removed=true`；cancel 保留阶段 / 产物快照；未归属投放的 remove 不写事件。
  - **前置**：assign 的投放须在池中且未删除，否则 validation_error；未知投放 / 作业返回 not_found。
  - **复用**：T-A12 的 `writableJob` / `findUpload` / dataset 修订 helper。
  - **投影**：本任务在 job-state 的两个读函数中落地“当前列表”——`listUnassignedUploads` 过滤；`getStageWorkspace` 的 collect.uploads 去掉 removed。同时把 `getStageWorkspace` 方法描述补一句（实现中立）。commit 与快照不过滤。
  - **测试提示**（对应既有标准）：
    - 标准 2：本批没有 listInterventions（T-A15）。“介入历史和原锚仍可查”经以下真实输出验证：回执中的 remove_source 事件；normal 快照中的事件与 removed 记录；`getStageWorkspace` collect 旧修订中的 uploadId；`getIntakePreview`。T-A15 / T-B06 再经读 API 覆盖。
    - 标准 3：cancel 后 `getJob` 的 currentStage / stages 与取消前一致，各阶段工作区内容不变。本批没有 run 关联，“不 abort”只作实现约束（晚到事件隔离见 T-A18 标准 5）。
    - 每例前清 `localStorage`。
  - **【r6.6.1 范围精度】`tests/unit/jobs/real-stubs.spec.ts`**：规则同 T-A11 该条，只在 `requests` 表追加本任务四键的真实 stub 调用，参数按实际类型给最小合法值。示例（非强制）：`listUnassignedUploads()`、`assignUpload('u-unassigned-file', 'j-collect')`、`removeUpload('u-unassigned-file', '样例删除')`、`cancelJob('j-collect', '样例取消')`。既有键、`satisfies` 约束、断言与 describe / test 不改，不新增标准 / 命令。
  - **【r6.6.2】`tests/unit/jobs/persistence.spec.ts`**：本任务对该文件**无写入许可**。唯一许可的改动（`WI non-normal` 参数化用例的 error 分支）归 T-A12 语义回归（见 T-A12【r6.6.2】），不得扩到其他用例或文件。
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

### T-A13a R3-B：已删除投放再次 removeUpload 被拒（领域前置；r6.12 新增，第五批）

- **状态**：未开始｜r6.12 新增；Checklist R11 定向复核通过并提交前不得开码。**R11 须判定**：本项是否属既有领域规则（与 `confirmIntake` / `assignUpload` 对已删除投放 validation_error 一致），而不是 AGENTS §5.1 意义上的新 guard。若判为须 §5.1，则本任务改 `blocked_by: Walter §5.1 批准`，R3-B 维持开放，T-C03 照常实施（其依赖中的本任务按“未关闭 P3”处理，由集成人登记）；本作者不自称授权，R4-A 的批准不覆盖本项
- **预计**：0.5 h｜**依赖**：T-A13
- **上下文**：`review-batch3.md` §5 R3-B（探针 P4）；implementation-log §8 原归属“T-C03 或 T-A17 二选一”。现状（`ae592ba` 的 `job-state.ts` `removeUpload`）不检查 `removed`：已归属投放每次重复删除都会再追加一条相同的 dataset 修订与 `remove_source` 事件（冗余台账、改写 `updatedAt`），未归属投放静默成功；而 `confirmIntake` / `assignUpload` 对已删除者已返回 validation_error。plan §2.4【r6.6】的 remove 句只写“置 `removed=true`”，没写重复删除。T-C03 的删除确认 UI 是首个消费方，故在它之前单列，不并入 C03（C03 已 1.5 h）。
- **修改范围**：
  - `frontend/src/contracts/mock/job-state.ts` 的 `removeUpload`：在 `findUpload`（未知 → not_found）与已归属时的 `writableJob`（终结作业 → validation_error）之后、任何写入之前，`upload.removed === true` → 抛 `{error: {code: 'validation_error', message: '投放已删除。', retryable: false}}`。沿用既有错误形态与 commit 内的拒绝时机，不产生部分修改。其他方法一律不动。
  - `frontend/src/contracts/methods.ts`：`removeUpload.description` 补一句“已删除的投放返回 validation_error”（实现中立）；重新生成 `frontend/contracts/{CONTRACT.md,schema.json}`。
  - `frontend/tests/unit/jobs/job-state-pool.spec.ts`：**只新增** describe `WI R3-B repeated remove`（2 例：已归属 / 未归属）。标题不含 `WI removeUpload`，以免改变 T-A13 命令 2 的用例集合；原 `WI assign` / `WI removeUpload` / `WI cancelJob` 用例不改不删。
  - **不做**：锁、幂等键、请求去重、通用“已处理”框架；不改 confirm / assign / cancel / submit；不借 R4-A 的批准扩到其他安全 / 竞态 guard。
- **完成标准**：
  1. 已归属投放（`j-collect`）第一次删除成功后再删 → validation_error；与第二次调用前相比，`getStageWorkspace('j-collect','collect')` 的修订数、`fai.jobs.v1` 中的 `interventions` 与 `mappingHistory`、该作业 `updatedAt` 都不变；第一次的 `remove_source` 事件与旧修订仍在，`getIntakePreview` 仍返回原预览。未归属池投放重复删除同样 validation_error，快照不变（AC-007-3 部分前置；R3-B）。
  2. `job-state-pool.spec.ts` 整文件通过，原用例零删改，`-t "WI removeUpload"` 仍为原 4 例（AC-007-3 部分前置：T-A13 删除语义不回归）。
  3. `removeUpload` 方法描述含“已删除返回 validation_error”，生成物与源一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-pool.spec.ts -t "WI R3-B repeated remove"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-pool.spec.ts`
  3. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A14 写方法：处理台（参数、无 run 手动合并、对账、暂定）

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前读 `review-batch-a09a.md` R-D（P3 后续观察，非新增标准）；r6.3 口径：R-D ①（overlayRev ⇔ pendingMerge，无 run 部分）由本任务写方法按构造保持、以既有读回断言覆盖，不加 refine（如认为必须加，按 AGENTS §5.1 先报 Walter）
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

### T-A15 写方法：分析介入与介入历史读取（r6.12：介入历史读取已移交 T-A15a，本任务只剩分析写）

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜**r6.12**：`listInterventions` 及原标准 4 / 命令 4 移交 **T-A15a**（第五批），本任务预计 1.5 → 1 h，标准 / 命令 5 → 4（原 5 顺延为 4）；不在第五批
- **预计**：1 h｜**依赖**：T-A11
- **上下文**：矩阵中的 annotate / ask_why / what_if / deepen / delete_conclusion / veto / pin_rule。
- **修改范围**：`submitIntervention(jobId, input)`（分析动作；delete_conclusion 用 tombstone 产生新 analysis 修订、不删旧内容；pin_rule 只记录 candidate，不激活、不蒸馏）；接口 / 方法表 / real 桩（`real-stubs.spec.ts` 只追加本任务新键，同 r6.6.1 规则）；生成物；新建 `tests/unit/jobs/job-state-analysis.spec.ts`。【r6.12】`listInterventions(jobId, filter?)`（按阶段 / kind 筛选、按时间排序）已移交 T-A15a；本任务的事件可经 T-A15a 已交付的 `listInterventions` 读回，但不再承担其筛选 / 十字段验收。
  - 【r6.12 移交原文（保留可追溯，不再计入本任务）】原标准 4：“筛选结果正确；十个字段齐全（AC-007-1 部分前置）。”原命令 4：`pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI listInterventions"`。→ 现为 T-A15a 标准 1 / 命令 1（文件改为 `job-state-history.spec.ts`，避免与本任务的 `job-state-analysis.spec.ts` 交叉写入）。
- **完成标准**：
  1. 五类动作分别产生 framework / ask_why 或 question / rewrite / delete / veto，payload 字段与矩阵一致（AC-005-3 部分前置）。
  2. pin_rule 产生 kind=pin_rule、`payload.state='candidate'`，没有任何“激活”副作用（AC-005-4 部分前置）。
  3. delete_conclusion 之后旧修订仍可读，新修订带 tombstone（AC-005-3 部分前置；S-12）。
  4. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI analysis kinds"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI pin_rule"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-analysis.spec.ts -t "WI tombstone"`
  4. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A15a 介入历史读取：listInterventions（r6.12 自 T-A15 拆出，第五批）

- **状态**：未开始｜r6.12 自 T-A15 拆出：原 T-A15 标准 4 / 命令 4（`listInterventions` 筛选与十字段）**移交本任务**，原文保留在 T-A15；Checklist R11 定向复核通过并提交前不得开码
- **预计**：0.5 h｜**依赖**：T-A13
- **上下文**：T-B06 渲染介入历史、T-C04 标准 2 核对介入历史展开内容，二者都只需要**读**。原 T-A15 把这个读方法与七个分析写动作捆在一起；为一个读接口提前做完整分析写没有必要。拆出后 T-A15 只剩 `submitIntervention`。依赖 T-A13：本任务追加 `real-stubs.spec.ts` 键时以 T-A13 之后的 22 键（该文件 23 例 = 22 个桩调用 + 1 个键集合断言）为前缀，标准 1 也要用 ingest / remove_source 的真实事件取证。
- **修改范围**（规则见 plan §2.4【r6.12】）：
  - `frontend/src/contracts/client.ts`：`listInterventions(jobId: string, filter?: {stage?: Stage; kind?: InterventionKind}): Promise<Intervention[]>`。
  - `frontend/src/contracts/methods.ts`：`dataMethods.listInterventions`。params = `[jobId 非空, filter（strict：stage? / kind?，均可省略）可省略]`；result = `z.array(InterventionSchema)`。描述实现中立：读取作业介入事件副本，按 `createdAt` 升序（同刻保持记录顺序），stage / kind 可组合筛选、省略即不限制，未知作业 not_found。复用 `StageSchema` / `InterventionKindSchema` / `InterventionSchema`，**不新增注册 schema**，不升 `CONTRACT_VERSION`。
  - `frontend/src/contracts/real/index.ts`：`NotImplementedError` 桩。
  - `frontend/src/contracts/mock/index.ts`：`listInterventions` 走既有 `readJobState(() => jobState.listInterventions(id, query), dataMethods.listInterventions.result)`，场景延迟 / error / not_found 与既有读方法同源（R2-E）。
  - `frontend/src/contracts/mock/job-state.ts`：新增 `listInterventions(jobId, filter)`：先 `findJob(jobId)`（未知 → not_found；empty 预置 id 得 null，继续），再按 jobId / stage / kind 过滤 `state.interventions`，按 `Date.parse(createdAt)` 升序稳定排序，返回副本。
  - 生成物：重新生成。
  - `frontend/tests/unit/jobs/real-stubs.spec.ts`：**只在 `requests` 表追加一键** `listInterventions: () => dataClient.listInterventions('j-collect', { stage: 'collect', kind: 'ingest' })`。既有 22 键、`satisfies` 约束、两条断言与 describe / test 不改（同 r6.6.1 规则；追加后该文件为 24 例）。
  - 新建 `frontend/tests/unit/jobs/job-state-history.spec.ts`。
  - **不做**：`submitIntervention` 与分析七动作（仍归 T-A15）、UI（T-B06）、分页、store 成员。
- **完成标准**：
  1. normal 下 `listInterventions('j-collect')` 只含该作业事件，且按 `createdAt` 升序；stage / kind 单项与组合筛选结果与手写期望一致（覆盖 `interventions.json` 的跨阶段 / kind 种子，以及本测试经真实 `submitIntake`（带 jobId）与 `removeUpload` 产生的 ingest / remove_source）；每条十个字段齐全并过 `InterventionSchema`；未知作业 not_found；empty 场景的预置 id 返回 `[]`；修改返回值后再读不变（AC-007-1 部分前置；原 T-A15 标准 4 移交）。
  2. error 场景下已知作业 adapter_error、未知作业仍 not_found；slow 在 1499 ms 未返回、1500 ms 返回（假时钟）；real 桩覆盖新键并抛 `NotImplementedError`（AC-008-2、AC-008-3 部分前置）。
  3. 生成物与源一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-history.spec.ts -t "WI listInterventions"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-history.spec.ts -t "WI history scenarios" && pnpm -C frontend test:unit tests/unit/jobs/real-stubs.spec.ts`
  3. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A16 写方法：块编辑、批注、版本读取（历史不可变）

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前须先定案 `review-batch-a09a.md` R-A（`Deliverable.blocks` 当前视图规则；P3，非新增标准）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前读 `review-batch-a09a.md` R-D、R-E（P3 后续观察，非新增标准）；r6.3 口径：R-D ③（final 快照与交付物 jobId / blocks 一致）与 ⑤（delivered）由本任务的同一次 commit 按构造保持、以既有读回断言覆盖，不加 refine（如认为必须加，按 AGENTS §5.1 先报 Walter）；R-E 仍在本任务处理｜另读 `review-batch3.md` R3-B（P3，与 T-C03 二选一落点；未修、未经风险接受）｜r6.12：R3-B 落点定为 T-A13a（第五批），本任务不再承接；依赖增 T-A15a，标准 / 命令 / 工时不变
- **预计**：1.5 h｜**依赖**：T-A12、T-A13、T-A14、T-A15、T-A16、T-A15a（r6.12：标准 2 经真实 `listInterventions` 读回，该方法已移交 T-A15a）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜r6.3 R-D 口径：①（有 run 时 overlayRev ⇔ pendingMerge）由本任务写方法按构造保持，不加 refine（implementation-log §8）｜开工前读 `review-batch2.md` R2-B / R2-E（P3 后续观察，非新增标准）：AgentClient 不自行初始化状态，调用顺序以测试固定、不加 guard；场景延迟 / 错误沿用 plan §2.4 登记的同一来源，不另立第三套
- **预计**：1.5 h（r6：契约字段与透传拆到 T-A09a）｜**依赖**：T-A09a、T-A14、T-A16、T-A17
- **上下文**：plan §2.4（mock DataClient 与 AgentClient 共享 job-state，状态层先处理、再通知）；§4.7 旁路与检查点；§2 S-15 规则。
- **修改范围**：（r6：`SendMessage.jobContext?` 字段、事件公共字段与 mock 透传已由 T-A09a 交付，本任务不再改 `events.ts`；`types.ts` 只给 `SendMessageSchema.jobContext` 的 describe 补 S-23 口径）`mock/index.ts` 的 `createMockAgentClient` 接入 job-state（共用 T-A10 的当前模块级会话状态，r6.1 S-27；受理时登记 runId→上下文；每个定时器回调先交状态层处理、再投递给订阅者）；`job-state.ts`：activeRunId 规则（§2 S-15 / S-23：终态后置 null，仍在运行的第二个带上下文 run 不接任；该口径一句写进 `SendMessageSchema.jobContext` 的 describe，不加调度 / 接任逻辑）；有 run 时 saveBlockText / updateParams 产生 overlay 修订和 pending 事件，agent 只读 latestMergedRev；只有 pendingRunId 匹配的 run.completed 才合并（原事件 outcome=merged）；failed / aborted 保留 overlay 和 pending；cancelled / delivered 作业的晚到事件只进时间线。生成物；新建 `tests/unit/jobs/job-state-agent.spec.ts`（aborted 用 AgentRunSchema 合法的合成事件序列，从系统边界注入状态层，**不新增 abort 脚本**）。
- **完成标准**（正负向齐全）：
  1. 带 jobContext 的 send 之后作业有 activeRunId，同期编辑进入 overlay（pendingMerge=true）；同一 run 的 run.completed 合并 overlay，原事件 outcome=merged（AC-007-2 部分前置；S-15）。
  2. failed（`agentScript=failure`）和合成的 aborted 都**不合并、不清 overlay**；**其他作业或其他 run** 的终态不代为合并（AC-007-2 部分前置）。
  3. 没有 jobContext 的 send 不改变任何作业；已有 activeRunId 时第二个带上下文的 send 不替换 activeRunId；首个 run 终态后 activeRunId 为 null，仍在运行的第二个 run 不接任，其终态不合并 overlay（AC-005-5、AC-007-2 部分前置；S-15 / S-23）。
  4. 接入状态层后：每个事件先经状态层处理、再投递给订阅者，且只投递一次；已登记 run 的上下文不因之后携带其他 jobContext 的 send 改变；非终态事件的处理前后、以及不经领域写方法的带 jobContext 的 `send` 受理前后，`listJobs()` / `getJob()` 返回的作业摘要（`JobListItem` 固定字段）不变（r6.1，R7 S-28：T-A22a 只对终态刷新的前提）；H-1 定向测试（T-A09a）保持通过（AC-005-5 部分前置；S-15；H-1 不回归）。
  5. 取消作业之后，已有 run 不被 abort，其后续事件不改变产物（AC-002-5 部分前置）。
  6. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI overlay same run"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI failed aborted other run"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI no context"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI context stable" && pnpm -C frontend test:unit tests/unit/jobs/agent-context-contract.spec.ts`
  5. `pnpm -C frontend test:unit tests/unit/jobs/job-state-agent.spec.ts -t "WI cancelled late events"`
  6. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A19 改稿请求、候选接受 / 回退与冲突裁定

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前须先定案 `review-batch-a09a.md` R-A（同 T-A16；P3，非新增标准）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前读 `review-batch-a09a.md` R-D（P3 后续观察，非新增标准）；r6.3 口径：R-D ④（rerun.affectedStages 顺序 / 含 stage）与 ⑤（status / currentStage 映射与 stages[]）由本任务写方法按构造保持、由标准 1 / 2 的逐列读回覆盖，不加 refine（如认为必须加，按 AGENTS §5.1 先报 Walter）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前读 `review-batch-a09a.md` R-F（P3 后续观察，非新增标准）
- **预计**：2 h（r6：+初始条目）｜**依赖**：T-A19、T-A20
- **上下文**：plan §2.3 的待处理项规则。
- **修改范围**：`job-state.ts`：在已有的状态迁移处生成 InboxItem（阶段首次 needs_human、产物首次 conflict、overlay 首次待合并、agent 候选待处理；同一目标、同一原因不重复，修订号变化时可以新生成）；在离开 H、冲突裁定、overlay 合并、候选 accept / revert 时标记 resolved；`JobListItem.pendingCount` / 阶段 `pendingCount` 只计未读且未解决的条目；状态建立时对 fixture 初始状态应用同一生成规则（预置的 H 阶段 / conflict 产物各生成一条未读条目），使 job-running 的 j-human、job-conflict 的 j-conflict 初始 pendingCount>0（r6：H-6 角标样例，亦是 T-G02 的前提）；`listInbox(jobId?)`、`markInboxRead(ids)`（normal 下已读 id 写入 `fai.inbox.v1`）；接口 / 方法表 / real 桩；生成物；新建 `tests/unit/jobs/job-state-inbox.spec.ts`。
- **完成标准**（正负向齐全）：
  1. 四类触发各生成一条，重复触发不重复生成（AC-007-4 部分前置）。
  2. markInboxRead 只把传入的 id 标为已读，条目和介入历史保留；之后新来的条目仍为未读；已读 ≠ 已解决（AC-007-4 部分前置）。
  3. 四类收口都标记 resolved，计数归零；完成态不保留角标计数（AC-007-4 部分前置）。
  4. 非 normal 场景已读状态只在内存中（AC-008-2 部分前置）。
  5. fixture 初始状态即带条目：job-running 下 j-human 的 `JobListItem.pendingCount` ≥1 且其 process 阶段 `pendingCount` ≥1，job-conflict 下 j-conflict 同理；normal 下 j-collect / j-process / j-deliver 的 `pendingCount` 为 0，j-failed / j-cancelled 的初始 `pendingCount` 亦为 0（j-failed 仅阶段态 conflict、分析产物 draft，r6.1 R7 S-29）（AC-007-4 部分前置；r6 H-6）。
  6. 生成物一致；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox generate"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox read"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox resolve"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox non-normal"`
  5. `pnpm -C frontend test:unit tests/unit/jobs/job-state-inbox.spec.ts -t "WI inbox seed"`
  6. `pnpm -C frontend contract --check && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A22 作业路由切片：routes.ts、registerJobRoutes 与页面骨架（H-3·路由切片）

- **状态**：**已完成（batch2；本批代码 Review 通过 `f72a1a1`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收；P3 R2-D：同步 main `072bb12` 时 `routes.spec` 真实路由表用例须按 §7 重核 / Analyze / A 定向复核后再派指定范围小任务，未修）**｜commit `cc59e946df2d08178b03e3b37928ab34517067d7`；验证（实施者执行，Converge 未重跑）：命令 1 `WI routes` 7 pass；命令 2 `WI register` 2 pass；命令 3 typecheck / lint 通过。S-32：暂未使用的 `pinia` 在本提交中用行内 eslint-disable 处理，签名不变，T-A22b 已撤销。H-3·路由切片的生产方 ①②③ 已具备（③ 含 A 亲跑，`review-batch2.md` §1 / §5），④ 未取得｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1 h｜**依赖**：T-A01（r6：视图 store 移出后不再依赖 T-A10）
- **上下文**：plan §2.1（`jobs/routes.ts` + `main.ts` 在挂载前注册，不改 `app/router.ts`）；v2 plan §7.3 H-3 只要求路由定义与注册、不含页面功能。r6 把原“视图 store 骨架”拆到 T-A22a（jobsStore）、T-A22b（sessionStore）、T-C01（intakeStore）、T-G02（inboxStore），本任务只交付路由切片。`43b6d79` 的路由表里没有 `jobs` 占位（§0 B-10），v2 前为新增、v2 后为同名替换。
- **修改范围**：新建 `frontend/src/jobs/routes.ts`（导出两条记录：name `jobs`（`/jobs`）/ `job-detail`（`/jobs/:id/:stage?`），meta 为 `{title, en, navId:'jobs'}`；导出 `registerJobRoutes(router, pinia)`，本任务内只对两条记录调用 `router.addRoute`；实施提示（R7 S-32）：本任务阶段 `pinia` 尚未使用，若 `eslint --max-warnings 0` 报未用参数，按仓库既有 eslint 规则处理（如 `_pinia`），不改签名、不加逻辑）；`frontend/src/main.ts`（在 `app.use(pinia).use(router).mount` 之前调用 `registerJobRoutes(router, pinia)`，不改其他装配）；`frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 骨架（不读数据）；新建 `tests/unit/jobs/routes.spec.ts`。【r6.5 精度（Converge batch2 登记）】两条记录的导出名为 `jobRoutes: RouteRecordRaw[]`，注册函数签名为 `registerJobRoutes(router: Router, pinia: Pinia): void`。标准 2 中“对真实路由表执行时为新增”以 pin 的 `90187f7` 为准；main `072bb12` 已有 `jobs` 壳占位，同步时按 §7 重核（`converge-batch2.md` §6）。
- **完成标准**：
  1. `/jobs` 与 `/jobs/:id/:stage?` 解析到对应具名路由，`meta.navId='jobs'`；未知路径仍落到既有兜底页（AC-001-1 部分前置：列表路由可直达；AC-002-2 部分前置）。
  2. 对含同名 `jobs` 占位的测试路由执行 `registerJobRoutes` 后，`router.getRoutes()` 中名为 `jobs` 的记录恰好一条且指向本 feature 页面；对 `app/router.ts` 的真实路由表执行时为新增、无重复；`app/router.ts` 无改动（AC-002-2 部分前置；H-3）。
  3. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/routes.spec.ts -t "WI routes"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/routes.spec.ts -t "WI register"`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A22a jobsStore：共享未筛选列表缓存、刷新、createJob action 与 agent 终态刷新（H-2·列表；r6 新增）

- **状态**：**已完成（batch3；第三批代码 Review 通过 `49edb7e`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收；P3 R3-A 的修复已登记为 T-A22c（r6.8），待实施 / 增量复核，H-2·列表 ④ 前须关闭）**｜T-A22c 增量 Converge 后：修复已实施 `af24c82`，待 A 增量复核（以 T-A22c 状态行为准）｜增量 Review 后：R3-A 已关闭（`69faacc`；以 T-A22c 状态行为准）｜原状态行“已实施（batch3，待第三批独立代码 Review）”为 Converge 时原文｜commit `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc`。
  - **验证**（实施者执行，Converge 未重跑）：命令 1～4 依次为 `WI H-2 cache` 5 / `WI H-2 filter` 4 / `WI H-2 createJob refresh` 7 / `WI H-2 agent refresh` 9 pass；命令 5 为 typecheck、lint，均通过；本轮无失败。
  - **末轮 clean 树**：全量 `test:unit` 31 文件 951 pass / 0 fail；`check` 六守卫通过；`contract --check` 24 / 10 / 2；既有 `e2e/{shell,agent}.spec.ts` 24 pass（4173 自管，结束后无监听）。
  - **S-38**：已落实（`refresh` 自身 resolve，真实 error 场景下无 unhandled rejection）。
  - **范围**：本批只有 createJob 一条已接入 UI 层的写路径，写后恰一次 refresh；其他写路径由各自任务接入。H-2·列表生产方 ①②③ 已具备，④ 缺。
  - **待 Review 核对**：`applyFilter` 的成功口径（`converge-batch3.md` §5 O-B3-4）。→ Review 判定：R3-A（P3，探针 P1 / P2 复现）；集成人决定现在修，修复任务 T-A22c（方案 b）。本任务的完成标准与命令不改。
  - 原 blocked_by: IMPL-GATE-R6（已满足）。
- **预计**：1.5 h｜**依赖**：T-A09a、T-A10、T-A12、T-A22
- **上下文**：plan §2.3 “写回执 / agent 通知后重新读取，不做轮询”的机制落地（本 feature 的详情页、重跑、改稿、待合并 e2e 同样依赖它）；v2 plan §7.3 H-2 ①～⑤ 与 v2 tasks §1.2 H-2·列表；§1-9。
- **修改范围**：新建 `frontend/src/jobs/stores/jobs.ts`（`useJobsStore`）：只读 `jobs: JobListItem[]`（`listJobs()` 未筛选结果）、`listStatus: 'idle'|'loading'|'ready'|'error'`、`listError: ContractError | null`；`ensureJobs()`（仅 idle 时加载）；`refresh()`（重读未筛选列表；有筛选时重读 `filteredJobs`；T-B04 起同时重读已打开的作业详情；已有数据时保持 ready、不回到 loading；失败置 error 并保留 `listError`）；`applyFilter(filter | null)`（`listJobs(filter)` 的结果存为 `filteredJobs`，不写 `jobs`）；`createJob(input)`（`dataClient.createJob` 成功后 `refresh()`，返回新作业）；`receiveAgentEvent(event)`（仅对带 `jobContext` 的终态事件调用 `refresh()`）；`frontend/src/main.ts` 增一行 `agentClient.subscribe(useJobsStore(pinia).receiveAgentEvent)`，与既有 agent store 订阅一样在卸载 / HMR 时解除（§0 B-10 先例）。store 不直接访问 localStorage、不推导业务状态，“进行中”只用契约常量 `ACTIVE_JOB_STATUSES`、不另建判定或 selector；不加请求序号等竞态防护（AGENTS §5.1）。新建 `tests/unit/jobs/jobs-store.spec.ts`（真实 Pinia + 真实 mock client；按 §0 B-6 的既有做法在系统边界新建 client 并用透传 spy 计数，不 `vi.mock` 内部模块）。
  【r6.6 精度（不改标准与命令；导出名与方法名保持 plan / interface-handoff 已审名称）】
  - **类型**：`filter: ListJobsFilter | null`（`ListJobsFilter = NonNullable<Parameters<DataClient['listJobs']>[0]>`，不另建 schema）；`filteredJobs: JobListItem[] | null`；`createJob(input: CreateJobInput): Promise<Job>`，返回回执的 `jobs[0]`。
  - **`refresh()`**：先 `listJobs()` 写 `jobs`；`filter` 非 null 时再 `listJobs(filter)` 写 `filteredJobs`。成功 → ready、`listError=null`；任一失败 → error + `listError`，已有 `jobs` / `filteredJobs` 保留。本批不读详情（`openJob` 与详情重读归 T-B04）。
  - **`applyFilter`**：`applyFilter(null)` 不发请求，置空 `filter` / `filteredJobs`；`applyFilter(f)` 只写 `filter` / `filteredJobs`，失败口径同上。
  - **`createJob`**：契约失败时以原 ErrorResponse 拒绝，不 refresh、不改缓存；成功后恰好一次 `refresh()`，再返回新作业。
  - **`receiveAgentEvent`**：仅当事件为 `run.completed` / `run.failed` / `run.aborted` 且带 `jobContext` 时，调用一次 `refresh()`。
  - **标准 4 的验证方式**：T-A18 尚未接线，状态层不随事件改变，因此只验证“真实 mock AgentClient 回放的终态触发一次重读”。测试新建 `createMockAgentClient()` 并订阅 `store.receiveAgentEvent`，执行 `send({message, jobContext})`，用假时钟推进到终态，对 `dataClient.listJobs` 的透传 spy 计数。不加生产故障开关或注入 setter，不在测试里复写业务逻辑。
  - **`main.ts`**：在 agent store 订阅之后增加 `agentClient.subscribe(useJobsStore(pinia).receiveAgentEvent)`，返回值同样交给 `app.onUnmount` 与 `import.meta.hot?.dispose` 解除。
  - **范围**：本批只有 createJob 一条写路径接入“写后恰一次 refresh”。其余写路径由各自任务接入（§1-9；§7 S-31 核对表），本任务不宣称覆盖全部写管线。
  - **测试卫生**：每例前清 `localStorage`（normal 会话自 T-A11 起会持久化）。标准 1 的“store 不调用 localStorage”只在读 action（ensure / refresh / applyFilter）期间以 Storage spy 断言；createJob 成功后由 mock 契约层写快照属契约实现层，不计为 store 访问。
  - **【r6.7 精度（Converge batch3 登记；只记实际导出，不改标准 / 命令）】**
    - `useJobsStore()` 对外为只读 `jobs` / `listStatus` / `listError` / `filter` / `filteredJobs`（`computed` + `readonly`，元素层也只读），以及 `ensureJobs` / `refresh` / `applyFilter` / `createJob` / `receiveAgentEvent`；另导出类型 `ListJobsFilter`。
    - `refresh` / `applyFilter` 捕获读失败、自身 resolve（R9 S-38）。`applyFilter(f)` 成功时置 ready 并清 `listError`，沿用 refresh 的成功口径（O-B3-4，交 Review）。
    - 本批没有 `openJob`（归 T-B04）。
  - **【r6.8 精度（第三批 Review R3-A 后的 Converge 补修登记；不改本任务标准 / 命令，不抹上方 r6.7 实施事实）】**
    - 上一条 r6.7 记的是 `0032fc6` 的实际行为。第三批 Review 判其为 P3 R3-A：成功分支改写 `listStatus` / `listError` 越出了本任务 r6.6 的“`applyFilter(f)` 只写 `filter` / `filteredJobs`”。
    - 修复不在本任务内改写，另立 **T-A22c**（方案 b）：删去成功分支的这两次赋值，以恢复 r6.6 原意。归属口径见 plan §2.3【r6.8】：`listStatus` / `listError` 是未筛选列表缓存的读状态，只有 `refresh()` 能置 ready 并清错；`applyFilter(f)` 失败时仍把共享读状态置 error 并保留旧 `filteredJobs`（O-R3-2）。
    - 本任务原标准 2 中的“`jobs` 保持未筛选全集”在 filter-before-ensure 顺序下也由 T-A22c 的回归测试固定。
- **完成标准**：
  1. `ensureJobs()` 后 `jobs` 等于 `listJobs()` 的未筛选结果（updatedAt 倒序），状态 idle → loading → ready；重复 `ensureJobs()` 不重读；error 场景状态为 error、`listError.code='adapter_error'`，`refresh()` 可重试成功；已有数据时 `refresh()` 期间不回到 loading；store 不调用 localStorage（AC-001-1、AC-008-3 部分前置；H-2 ①②）。
  2. `applyFilter` 后 `filteredJobs` 为筛选结果，而 `jobs` 保持未筛选全集；清除筛选后 `filteredJobs` 为 null（AC-001-2 部分前置；H-2 ④）。
  3. `createJob(input)` 后无需手动重读：`jobs` 含新作业（collecting / collect）且其状态属于 `ACTIVE_JOB_STATUSES`；校验失败时缓存不变（AC-001-3 部分前置；H-2 ③⑤；H-2·列表随交付的可调用写 action）。
  4. `receiveAgentEvent`：带 `jobContext` 的终态事件触发一次 `refresh()`（透传 spy 计 `listJobs` 调用），非终态事件与不带 `jobContext` 的事件不触发；`main.ts` 订阅的端到端效果由 T-B07 / T-F06 / T-G01 的 e2e 承担（AC-002-4、AC-006-6、AC-007-2 部分前置；H-2 ⑤）。
  5. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 cache"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 filter"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 createJob refresh"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 agent refresh"`
  5. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A22b sessionStore 只读上下文与路由守卫（H-4；r6 新增）

- **状态**：**已完成（batch2；本批代码 Review 通过 `f72a1a1`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收）**｜commit `b38cf43f602390d7645cc84514d0da9860a7e0b7`；验证（实施者执行，Converge 未重跑）：命令 1 `WI H-4 enter` 4 pass；命令 2 `WI H-4 leave same navigation` 3 pass；命令 3 `WI H-4 readonly` 1 pass，且 typecheck / lint 通过；`routes.spec.ts` 整文件回归 9 pass。H-4 的生产方 ①②③ 已具备（③ 含 A 亲跑，`review-batch2.md` §1 / §5），④ 未取得，公开设置方式 = 无｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1 h｜**依赖**：T-A02、T-A22
- **上下文**：plan §2.3 的 sessionStore（“当前作业 / 阶段上下文，供抽屉、介入事件使用”）未写设置与清空时机；v2 plan §7.3 H-4：只读，进入详情 / 切阶段时设置，离开 `job-detail` 时在同一次导航内同步清空，不从 lastRun 推导。
- **修改范围**：新建 `frontend/src/jobs/stores/session.ts`（`useSessionStore`：只读 `context: JobContext | null`，**不导出公开 setter**，写入只由守卫进行）；`routes.ts` 的 `registerJobRoutes` 增加 `router.afterEach`：`to.name === 'job-detail'` 且 `stage` 参数属于 `Stage` 时置 `{jobId, stage}`，否则置 null（缺省 / 未知 stage 由 T-B04 的 `router.replace` 补齐后再设置）；新建 `tests/unit/jobs/session-context.spec.ts`（真实 memory-history router + `registerJobRoutes` + 真实 Pinia，只经导航改变上下文）。【r6.3 精度（H-4 机制与行为不变）】`session.ts` 为 setup store：私有 `ref<JobContext | null>`，对外只暴露 `context`（computed / getter，类型层只读）与唯一的**生产路由绑定入口** `bindRouter(router: Router): void`——它只调用一次 `router.afterEach` 注册上述守卫（目标判定在 `session.ts` 内），不接受任何 `JobContext` 参数，不是 setter；`registerJobRoutes(router, pinia)` 在 addRoute 之后调用 `useSessionStore(pinia).bindRouter(router)`（`pinia` 由此被使用，T-A22 的 S-32 临时 `_pinia` 随之撤销）。不在模块顶层调用 `useStore`；不用模块级 WeakMap / 注册表 / provide 等隐藏写权限；不改 `app/router.ts`；`session.ts` 不导入 `routes.ts` 或 `agent/**`（只用 `vue` / `pinia` / `vue-router` 类型与契约 `JobContext` / `StageSchema`）；不做 navigation failure / 重复注册 / 竞态兜底（应用内无中止导航的守卫）。壳与测试都不直接调用 `bindRouter`，测试只经 `registerJobRoutes` + 真实 router 导航改变上下文；标准 3 的 `@ts-expect-error` 写入放在不执行的函数体内（只验类型层）。【r6.5 精度（Converge batch2 登记）】`context` 返回深只读对象，字段同样不可写；`bindRouter(router: Router): void`；store 的 `$state` 不暴露上下文。
- **完成标准**：
  1. 导航到 `/jobs/j-collect/collect` 时 context 为 `{jobId:'j-collect', stage:'collect'}`；切到 `/jobs/j-collect/process` 时更新；`/jobs/j-collect`（无 stage）或未知 stage 时为 null（AC-005-5 部分前置；H-4）。
  2. 从 `job-detail` 导航到 `/jobs` 或兜底页时在同一次导航内已清空：测试在 `registerJobRoutes` 之后注册的 `afterEach` 中读到 null（AC-005-5 部分前置；H-4 同次导航清空）。
  3. 只读：store 不暴露 setter（类型层以 `@ts-expect-error` 断言写入被拒），不读取 agent store / run；工程门通过（AC-009-1 部分前置；H-4）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/session-context.spec.ts -t "WI H-4 enter"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/session-context.spec.ts -t "WI H-4 leave same navigation"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/session-context.spec.ts -t "WI H-4 readonly" && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A22c R3-A 补修：applyFilter 成功不改写未筛选列表读状态（H-2·列表；r6.8 Converge 补修新增）

- **状态**：**已完成（增量代码 Review 通过 `69faacccabd8b089a9f240b28e6449a8fea90619`：0 P1 / P2、0 新 P3，R3-A 关闭；A 亲跑本任务命令同数通过；不表示 AC 最终验收）**｜原状态行“已实施（待定向 Review …；R3-A 代码已修、未判关闭）”为增量 Converge 时原文｜原状态行“未开始”为 r6.8 登记时原文｜commit `af24c826f41580d27f90ce611fb2f55fec44acbf`（父 `e7716a8`；只改 `jobs/stores/jobs.ts` −2 与 `jobs-store.spec.ts` +67 / −1）。
  - **增量 Review**（`review-batch3-cache-fix.md`，A = claude-fable-5-1 via anthropic，固定审 `eb91340` + diff `e7716a8..af24c82`）：A 亲跑命令 1 = 2、命令 2 = 27（原四组 5 / 4 / 7 / 9）、命令 3 通过（24 / 10 / 2）；全量 31 files / 953 / 0、六守卫、v1 契约 88、real-stubs 23、shell + agent E2E 24；只读探针 P1 / P2 不再复现。未跑其余 7 份 E2E，无截图。R3-B / R3-C 不在范围、仍未修。
  - 以下“验证 / 失败留痕 / 末轮回归 / 增量 Converge”四条为增量 Converge 时登记原文：
  - **验证**（实施者执行，增量 Converge 未重跑）：命令 1 `WI H-2 list status` 2 pass；命令 2 整文件 27 pass（原四组 25 + 新 2；`-t "WI H-2 filter"` 仍 4）；命令 3 typecheck、lint、`contract --check`（24 / 10 / 2）均通过。
  - **失败留痕**：修复前命令 1 为 2 fail（`expected 'ready' to be 'idle'`、`expected 'ready' to be 'error'`），复现 R3-A P1 / P2；删两行后通过。
  - **末轮回归**：全量 `test:unit` 31 文件 953 pass / 0 fail；`check` 六守卫通过；既有 `e2e/{shell,agent}.spec.ts` 24 pass（4173 前后空闲）；提交前 diff / 暂存范围检查通过，clean。
  - **增量 Converge**：`converge-batch3-cache-fix.md`，判与 r6.8 逐条一致、无规格差距、待独立 A 增量 Review；R3-A 是否关闭由 A 判定。
  - Converge 补修（AGENTS §2 第 9 步），对应第三批代码 Review `49edb7e` 的 P3 R3-A；第三批其他 Review 结论保留｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：0.5 h｜**依赖**：T-A22a
- **上下文**：`review-batch3.md` §5 R3-A、§4 探针 P1 / P2、§8 第 2 条。`0032fc6` 中 `jobs/stores/jobs.ts` 的 `applyFilter(f)` 成功分支（第 43–44 行）写 `listStatus='ready'` / `listError=null`；`ensureJobs()` 只在 `listStatus==='idle'` 时加载（第 17–19 行）。后果有二：全新 store 若先 `applyFilter` 再 `ensureJobs()`，`jobs` 从未加载却显示 ready，且之后 ensure 不再加载（P1）；未筛选列表读失败后，一次筛选成功会把错误“洗白”（P2）。集成人采用 A 原件最小方案 **(b)**，即恢复 T-A22a【r6.6 精度】“`applyFilter(f)` 只写 `filter` / `filteredJobs`”的原意：不是需求变更，不回 Clarify，spec / 46 AC 不变。口径见 plan §2.3【r6.8】；O-R3-2 的精度一并登记。
- **修改范围**：
  - `frontend/src/jobs/stores/jobs.ts`：只删 `applyFilter(f)` 成功分支中给 `listStatus` / `listError` 赋值的两行。成功后只更新 `filter` / `filteredJobs`：store 初始 idle 不会被筛选洗成 ready，既有的未筛选读错误也不会被筛选成功清除；只有 `refresh()`（含 `ensureJobs()` 首次加载）成功才回 ready 并清错。
  - 以下保持不变：失败分支（保留旧 `filteredJobs`、把共享读状态置 error、写 `listError`；此时 `filter` 与 `filteredJobs` 可能暂不对应，UI 按 error 呈现，O-R3-2）；`applyFilter(null)`；`ensureJobs` / `refresh` / `createJob` / `receiveAgentEvent`；读失败的捕获与自身 resolve（S-38）；类型签名与对外成员。
  - 不新增筛选专属状态字段、回滚、锁、请求序号或公开成员（AGENTS §5.1）。
  - `frontend/tests/unit/jobs/jobs-store.spec.ts`：
    - 新增 describe `WI H-2 list status`，两例，对应标准 1 的两条路径。沿用真实 Pinia、真实 mock client 与既有的系统边界透传 spy，不在测试里抄算法。
    - 只改 `WI H-2 filter` 组中“filter read errors resolve and retain both caches; the next filter read clears the error”一例：标题末段改为“… only an explicit refresh clears the error”。前半段（失败时保留两份缓存、写入 `filter`、置 error）原样；切回 normal 后，`applyFilter` 成功改为断言 `filteredJobs` 已更新、`jobs` 引用不变、`listStatus` 仍为 error、`listError.code` 仍为 `adapter_error`，再显式 `refresh()` 才回 ready 并清错。不删除该例。
    - 其余用例不改、不删。
  - 不改 `main.ts`、契约 / 生成物、其他 jobs 文件、spec / checklist；不提前实现 T-B02 的筛选条 UI。
- **完成标准**：
  1. 全新 normal store 上 `applyFilter(f)` 成功后：`filter` / `filteredJobs` 为该筛选及其结果，`listStatus` 仍为 `idle`，`listError` 为 null，`jobs` 仍为空。随后 `ensureJobs()` 仍会加载：读调用依次为 `[f]`、`[]`、`[f]`，`jobs` 等于 `listJobs()` 的未筛选结果，`filteredJobs` 等于 `listJobs(f)`，状态为 ready。另一条路径：error 场景 `ensureJobs()` 置 error 后切回 normal，`applyFilter(f)` 成功只更新 `filteredJobs`，`listStatus` 仍为 error、`listError.code='adapter_error'`、`jobs` 引用不变；`ensureJobs()` 不重读；只有显式 `refresh()` 才回 ready 并清错（AC-001-1、AC-001-2、AC-001-4 部分前置；H-2 ①②④；R3-A 探针 P1 / P2 路径）。
  2. `jobs-store.spec.ts` 整个文件通过：`WI H-2 filter` 组原有的“筛选成功清错”断言已改为“筛选成功保留错误、显式 refresh 清错”，该组用例数不变；`WI H-2 cache` / `WI H-2 filter` / `WI H-2 createJob refresh` / `WI H-2 agent refresh` 四组的其余用例原样通过，包括 S-38 终态回放无 unhandled rejection、清空筛选不发请求、筛选失败保留旧 `filteredJobs`（AC-001-1、AC-001-2、AC-001-4 部分前置；H-2 ①～⑤ 不回归）。
  3. 工程门通过，契约生成物零漂移（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 list status"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts`
  3. `pnpm -C frontend typecheck && pnpm -C frontend lint && pnpm -C frontend contract --check`

### T-A22d jobsStore 详情视图缓存与统一刷新（r6.9 自 T-B04 拆出；第四批）

- **状态**：**已完成（原 Review + 增量 Review 联合依据，非最终 AC）**（原件 `9812f64` 判本任务标准满足；增量 Review 原件 `46e8fbe` 关闭 R4-A，第四批改判技术通过；R4-E 仍开放）｜【R4-A 关闭前原文】已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）（`review-batch4.md` 原件 `9812f64`：本任务标准经 A 判满足，A 亲跑命令 1～4 = 4 / 6 / 6 / 43；本批因 R4-A（P2，位于 T-B04 页面）未通过，不计完成；R4-E store 迟到写入为 P3，归 `api` feature，本任务不改）｜原状态行“已实施（第四批；待批次独立代码 Review）”为 Converge 时原文｜commit `ca7dca175150652b1026a831f1447fb6830028e4`（父 `0221a94`；只改 `jobs/stores/jobs.ts` +43 / −1 与 `jobs-store.spec.ts` +363 / −0）。验证（实施者 openai/gpt-6-astra 会话 `01a187ee…` 执行，Converge 未重跑）：命令 1 `WI detail cache open` 4；命令 2 `states` 6；命令 3 `refresh` 6；命令 4 整文件 43（原 27 + 新 16）+ typecheck / lint 通过。原 447 行、27 例、`connect` / `changeScenario` 与原列表块 / 四个既有 action 经 hash 核对不变。**失败留痕**：命令 1 首跑 3 pass / 1 fail（新测试对未开始 analyze 阶段的空 `artifacts[0]` 断言只读），改在有产物的 process 后通过。末轮回归见页首 Converge batch4 块｜原状态行“未开始（r6.9 新增；…R10 前不得开码）”为派工准备时原文｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1 h｜**依赖**：T-A10、T-A22a、T-A22c
- **上下文**：plan §2.3【r6.9】（详情视图缓存）、§2.3 写后统一刷新、§1-9；原 T-B04 修改范围中的“`stores/jobs.ts` 增加当前作业 / 阶段工作区视图缓存（`openJob(id, stage)`）并纳入 `refresh()`”。原 T-B04 已到 2 h 上限，再加上 store 的确定字段与单测，已知超额，按 Checklist R8 B-12 先例在 Tasks 阶段拆出本任务。T-B04 改为只消费，不再改 store。本任务不属 H-2·列表交接切片，新成员不进 interface-handoff 交接接口。
- **修改范围**：
  - `frontend/src/jobs/stores/jobs.ts`：按 plan §2.3【r6.9】增加：
    - 只读 `currentJob: Job | null`、`currentStageWorkspace: StageWorkspace | null`、`detailStatus: 'idle'|'loading'|'ready'|'error'`、`detailError: ContractError | null`，均为 `computed` + `readonly`，元素层也只读，写法同既有成员；
    - action `openJob(jobId: string, stage: Stage | null): Promise<Stage | null>`；
    - 私有锚 `{jobId, stage: Stage | null}`，不导出；
    - `openJob` 与 `refresh` 共用的一个私有读函数：`getJob`，job 非 null 时再 `getStageWorkspace(jobId, 入参 stage ?? job.currentStage)`。
  - **`openJob` 口径**：
    - 先置锚；只有 `currentJob` 不是同一 jobId（含 null）时才置 loading。
    - job 为 null（empty 预置 id）时 `currentStageWorkspace=null`，返回 null。
    - 成功：锚的 stage 定为有效阶段，置 ready、清 `detailError`，返回有效阶段。
    - 失败：保留旧缓存，置 error、写原 `ErrorResponse.error`，resolve null，不抛出（S-38 同口径）。
  - **`refresh()`**：既有列表 / 筛选块原样，之后锚非 null 时在独立 try 中重读详情。不置 loading；只写 `detailStatus` / `detailError`；不读写 `listStatus` / `listError`。列表失败不跳过详情，详情失败也不影响列表。
  - **不变**：`ensureJobs` / `applyFilter` / `createJob` / `receiveAgentEvent` 的语义与签名（`createJob` 与带 `jobContext` 的终态经同一 `refresh()` 自动带上详情）。
  - **不做**：`closeJob`、离开页面清锚、请求序号、锁、去重 guard、轮询、事件总线、测试 setter、fallback。离开详情后，`refresh()` 仍重读最近打开的详情，这是可接受的额外读取。
  - `frontend/tests/unit/jobs/jobs-store.spec.ts`：**只新增** describe `WI detail cache open` / `WI detail cache states` / `WI detail cache refresh`。可在新组内基于既有 `connect()` 追加 `getJob` / `getStageWorkspace` 的透传 spy（系统边界，同 §0 B-6 做法）。不改既有 `connect` / `changeScenario` 与原 27 例；标题不含 `WI H-2`，§2a 的 H-2 定向集合不变。
  - **一律不改**：`main.ts`、契约 / 生成物、页面、fixture、其他测试。
  - **【r6.10 精度（Converge batch4 登记；只记实际类型，不改标准 / 命令）】** 对外 `currentJob` / `currentStageWorkspace` 在类型层为 `DeepReadonly<Job> | null` / `DeepReadonly<StageWorkspace> | null`（与既有 `jobs` 的 `computed(readonly)` 写法一致，元素层只读）；`openJob(jobId: string, stage: Stage | null): Promise<Stage | null>` 与 r6.9 相同；锚与共用读函数为闭包私有（测试断言 store 上无 `anchor` / `readDetail` / `closeJob`）。不属 H-2·列表交接接口。
- **完成标准**：
  1. **打开**（normal）：`openJob('j-process', 'analyze')`：状态 idle → loading → ready；`currentJob` 等于 `getJob` 结果；`currentStageWorkspace.stage='analyze'`，且等于 `getStageWorkspace` 结果；返回 `'analyze'`；成员只读；读期间不调用 localStorage。`openJob('j-process', null)`：返回 `'process'`（= currentStage），工作区为 process。同作业再开另一阶段：不经过 loading（AC-002-1、AC-002-2 部分前置）。
  2. **三态与错误语义**：slow：首次打开可观测 loading，推进假时钟后 ready。empty：`openJob('j-collect', 'collect')` → ready、`currentJob=null`、`currentStageWorkspace=null`、返回 null。error：error + `detailError.code='adapter_error'`、retryable。未知 id `j-missing`：error + `not_found`、`retryable=false`。以上均 resolve、无 unhandled rejection；列表读状态保持原值（AC-001-4 部分前置）。
  3. **统一刷新**：打开后每次 `refresh()`：`listJobs` 按既有口径调用，`getJob` / `getStageWorkspace` 各 1 次（按锚），已有数据时详情保持 ready、不回 loading。`createJob` 成功后的那一次 refresh 同样重读一次详情（带 `jobContext` 的终态走同一 `refresh()`，不另测）。打开 `j-missing` 后 refresh：`listStatus='ready'`、`listError=null`，而 `detailStatus='error'`（not_found）。切到 error 场景再 refresh：两份读状态各自写入自己的错误；切回 normal 再 refresh，两者均恢复 ready（AC-001-4、AC-002-2 部分前置）。
  4. `jobs-store.spec.ts` 整文件通过（原 27 例不改不删，含 `WI H-2` 五组与 S-38）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI detail cache open"`
  2. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI detail cache states"`
  3. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI detail cache refresh"`
  4. `pnpm -C frontend test:unit tests/unit/jobs/jobs-store.spec.ts && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A23 徽标组件（S-11 / S-17）

- **状态**：**已完成（batch2；本批代码 Review 通过 `f72a1a1`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收，AC-001-5 只有组件半项；P3 R2-C 归属见页首，未修）**｜commit `ebce4c85b1422a62b883117f75459a1fdee81b80`；验证（实施者执行，Converge 未重跑）：命令 1 `WI status badges` 18 pass；命令 2 `WI source badge` 9 pass；命令 3 `check --only colors` / `check --only glass` / typecheck / lint 通过；H-2·标签旁证 `contract-labels.spec.ts -t "WI labels"` 10 pass。三个徽标为自制组件，未导入 shared `Badge.vue`。**失败留痕**：首跑 16 fail / 2 pass，原因是新测试选择器把根 `<span>` 算进了索引；只修新测试选择器后全部通过。AC-001-5 的组件部分具备，人工部分 M-01 仍归 T-G10。H-2·标签的生产方 ①②③ 已具备（③ 含 A 亲跑，`review-batch2.md` §1 / §5），④ 未取得｜原 blocked_by: IMPL-GATE-R6（已满足）｜r6.9：R2-C 的边框令牌修正归 T-B01（本任务标准 / 命令不改；props / 文案 / 图标不变）
- **预计**：1.5 h｜**依赖**：T-A01
- **上下文**：plan §2.2 徽标体系；designUI §2.4（状态徽不能只靠颜色）。
- **修改范围**：新建 `frontend/src/jobs/components/{JobStatusBadge,ArtifactStatusBadge,SourceBadge}.vue`（复用既有的 `shared/components/Badge.vue` 和令牌；文案 / 图标只来自契约常量；SourceBadge 按 S-17 处理 derived；上传状态用 ArtifactStatusBadge 的同一渲染方式消费 `UploadStatusLabel`，不新建组件）；新建 `tests/component/jobs/badges.spec.ts`。【r6.3 基线事实修正（§0.0 r6.3 复核 ②）】`shared/components/Badge.vue` 只接受 `state` 并渲染固定文案（正常 / 警告 / 异常 / 样例），无插槽 / 文案 prop，且 `shared/**` 不属本 feature（§1-5），无法承载契约文案；故上句“复用既有 Badge.vue”改读为：三个徽标是 `jobs/components/` 内的自制 SFC（designUI §6（:214“新增组件（D-016）”；r6.4 按 Checklist R8 S-33 更正，r6.3 误写 §8）“来源徽、状态徽……移植 / 自制决策随实施登记”，此处登记为自制），**不导入、不修改** Badge.vue，只复用其令牌与样式写法（`var(--fai-*)` 边框 / 文字令牌、`--fai-type-tag` 等），点睛红只作边 / 图标、不作文字（plan §1）；文案 / 图标仍只来自契约常量；标准 / 命令不变。
- **完成标准**：
  1. 九种作业状态、四种产物状态、三种上传状态逐一渲染出契约文案和图标；把颜色样式去掉后文案仍可区分（AC-001-5 **最终（组件部分）**，人工部分见 T-G10 M-01；AC-001-1、AC-003-6、AC-006-8 部分前置）。
  2. origin=derived 时显示“内部生成”，并保留 source 次文案；origin=source 时显示 SourceLabel（AC-005-1、AC-006-8 部分前置；S-17）。
  3. 没有新增颜色字面量或玻璃类（AC-007-5 部分前置）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/badges.spec.ts -t "WI status badges"`
  2. `pnpm -C frontend test:unit tests/component/jobs/badges.spec.ts -t "WI source badge"`
  3. `pnpm -C frontend check --only colors && pnpm -C frontend check --only glass && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-A24 行级 diff 工具

- **状态**：**已完成（batch2；本批代码 Review 通过 `f72a1a1`，0 P1 / P2，A 亲跑本任务命令同数通过；不表示 AC 最终验收）**｜commit `27e59e610e2ab8c14e7c3db554609e52e40f5f76`；验证（实施者执行，Converge 未重跑）：命令 1 `WI lcs` 6 pass；命令 2 `WI limit` 7 pass；命令 3 typecheck / lint 通过；依赖与锁文件未改｜原 blocked_by: IMPL-GATE-R6（已满足）
- **预计**：1 h｜**依赖**：无
- **上下文**：plan §2.2 / §6：自实现 LCS 行级 diff，上限 2000 行，超出时只给变更摘要；不引入第三方库。
- **修改范围**：新建 `frontend/src/jobs/diff.ts`；新建 `tests/unit/jobs/diff.spec.ts`（期望结果用手写样例，不在测试里重写算法）。【r6.3 精度】输入按 `'\n'` 切行，空串视为 0 行；两侧行数均 ≤ 2000 时返回逐行结果（每行 equal / add / remove 与文本）；任一侧 > 2000 时直接返回摘要（两侧行数），不进入 LCS、不返回逐行结果；标准 2 以 2000 / 2001 行两个边界各一例断言返回形态，不以耗时断言。不引入第三方库、不改依赖。实施提示（r6.4，Checklist R8 S-36；不新增机制 / 标准 / 命令）：返回类型可给逐行与摘要两个分支一个具名判别（如 `kind: 'lines' | 'summary'`），便于 T-F05 消费时不靠长度判断。【r6.5 精度（Converge batch2 登记）】实际导出为 `diffLines(before: string, after: string): LineDiffResult`，结构如下：
  - `LineDiffResult = {kind:'lines'; lines: DiffLine[]} | {kind:'summary'; beforeLineCount: number; afterLineCount: number}`；
  - `DiffLine = {kind:'equal'|'add'|'remove'; text: string}`。
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

- **状态**：**已完成（原 Review + 增量 Review 联合依据，非最终 AC）**（原件 `9812f64` 判本任务标准满足；增量 Review 原件 `46e8fbe` 关闭 R4-A，第四批改判技术通过；**R2-C 技术关闭**，A 复跑 badges 48 / colors / glass）｜【R4-A 关闭前原文】已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）（`review-batch4.md` 原件 `9812f64`：本任务标准经 A 判满足，A 亲跑命令 1～4 = 2 / 4 / 21 / 48（其中 `WI status badges` 18、`WI source badge` 9）；本批因 R4-A P2 未通过，不计完成；R2-C 代码经 A 核实无误，但关闭以本批最终通过为条件，当前不记关闭）｜原状态行“已实施（第四批首项；待批次独立代码 Review；R2-C 代码已修、待 A 确认关闭）”为 Converge 时原文｜commit `5c00cf695235155c4cfa9efb9df1fee06a161189`（父 `37e2f71`；7 个授权文件）。验证（实施者 openai/gpt-6-astra 会话 `01a187e0…` 执行，Converge 未重跑）：命令 1 `WI AC-001-1` 2；命令 2 `WI AC-001-4 list` 4；命令 3 `WI badge tone` 21 + `check --only colors` / `glass` 通过；命令 4 badges 整文件 48（原 `WI status badges` 18 / `WI source badge` 9 不变）+ typecheck / lint 通过。**失败留痕**：命令 1 首跑 1 fail（新测试把缺省 `params.stage` 断言为 `''`，实为 undefined）；命令 3 首跑 1 fail（happy-dom 把 `border` 简写序列化为 `thin solid`，改为断言解析后的 `border-color` 与真实 SFC 基础声明原文）；均只修新测试后通过｜以下为派工准备时原文：未开始｜blocked_by: IMPL-GATE-R6｜开工前读 `review-batch2.md` R2-C（P3 后续观察，非新增标准）：消费徽标前用既有 `--fai-status-*` 令牌核对状态边框映射，不新增色值｜r6.8：依赖增 T-A22c（R3-A 补修须先于列表读状态的首个页面消费者）｜T-A22c 已完成、R3-A 已关闭（`69faacc`），依赖已满足｜**r6.9：R2-C 归本任务**（首个页面消费前修正，新增标准 / 命令 3，预计 1.5 → 2 h；上句“非新增标准”为当时原文）；第四批首项，Checklist R10 定向复核通过并提交前不得开码
- **预计**：2 h｜**依赖**：T-A10、T-A22、T-A22a、T-A22c、T-A23
- **上下文**：spec R-001；plan §2.2；plan §1【r6.9】（R2-C 令牌表）；`review-batch2.md` R2-C；implementation-log §8。
- **修改范围**：`jobs/pages/JobListPage.vue`（数据取自 `useJobsStore()` 的未筛选缓存，挂载时 `ensureJobs()`，错误重试 `refresh()`——r6，T-A22a）、新建 `jobs/components/JobCard.vue`（标题、类型、状态徽、当前阶段、更新时间；角标位预留给 T-G02）；三态复用 `Loading` / `EmptyState` / `ErrorState`（错误态含可复制诊断）；新建 `tests/component/jobs/job-list.spec.ts`。
  【r6.9 精度（不改 AC；第四批）】
  - **列表页**：按 `listStatus` 呈现：`idle` / `loading` → `Loading`；`error` → `ErrorState`（`moduleId='jobs-list'`、`error=listError`、`@retry` → `refresh()`；已有数据时也按 error 呈现，r6.8 O-R3-2）；`ready` 且为空 → `EmptyState`（文案“暂无作业。”）；`ready` 有数据 → `JobCard` 列表，顺序即 store 返回顺序，不在前端重排。只读取 store，不直接调用 `dataClient`、不碰 localStorage。
  - **JobCard**：props `job: JobListItem`。标题为指向 `{name:'job-detail', params:{id}}` 的 `RouterLink`，不带 stage，由 T-B04 补齐。类型用 `JobTypeLabel` 图标 + 文案，状态用 `JobStatusBadge`，当前阶段用 `StageLabel[currentStage]`；`<time :datetime="updatedAt">` 原样显示契约时间，不新建日期格式化工具。不渲染 `pendingCount` 角标（归 T-G02）。
  - **R2-C**（plan §1【r6.9】表）：
    - `JobStatusBadge.vue` / `ArtifactStatusBadge.vue`：根元素加 `:data-status="status"`；基础规则边框改为 `var(--fai-glass-module-border)`；按表用 `[data-status=…]` 规则设 `border-color` 为 `--fai-status-ok` / `-warn` / `-bad`。
    - `SourceBadge.vue`：只把边框改为 `var(--fai-glass-module-border)`，不加 `data-status`。
    - 三者的文字色、模板文案 / 图标、props、class 名不变。不用 `--fai-status-sample`，不新增颜色字面量、令牌、schema、状态枚举、TS 映射常量或 helper。
  - `tests/component/jobs/badges.spec.ts`：只新增 describe `WI badge tone`，原 `WI status badges` 18 例与 `WI source badge` 9 例不改不删。
  - **测试 harness**（job-list.spec）：真实 Pinia；真实 memory-history router（`appRouter.options.routes` + `registerJobRoutes(router, pinia)`，`push('/jobs')`）；真实 mock client，按 jobs-store.spec 的 `connect` 做法在系统边界用透传 spy 切场景；slow 用假时钟；复制诊断按 `focus-band.spec.ts` 先例读 clipboard。不 `vi.mock` 内部模块。
  - **一律不改**：`shared/**`、`app/**`、`stores/jobs.ts`、`main.ts`、契约 / 生成物、`routes.spec.ts`。
  - **【r6.10 精度（Converge batch4 登记；只记实际类型，不改标准 / 命令）】** `JobCard` 的 props 实际为 `job: DeepReadonly<JobListItem>`（store 对外元素层只读的直接结果，上文“`job: JobListItem`”按此读）；标题链接不带 stage，也不带当前 `route.query`（见 `converge-batch4.md` §5 O-B4-1，交 Review）。
- **完成标准**：
  1. 渲染 mock 作业的标题、类型、状态徽、当前阶段、更新时间，并按 updatedAt 倒序（AC-001-1 **最终**）。【r6.9】normal 5 张卡片顺序等于 `listJobs()` 结果；类型 / 状态 / 阶段文案与图标取自契约常量；`time[datetime]` 等于 `updatedAt`；标题链接 href 为 `/jobs/<id>`。
  2. 列表的加载 / 空（empty 场景）/ 错误（error 场景，含可复制诊断）三态可以触发（AC-001-4 部分：列表侧）。【r6.9】slow 首读显示 `Loading`；empty 显示“暂无作业。”；error 显示 `ErrorState`，诊断 JSON 为 `{moduleId:'jobs-list', code:'adapter_error', message, ts}` 且可复制。切回 normal 后点“重试”经 `refresh()` 显示列表。
  3. 【r6.9，R2-C】`WI badge tone`：9 / 4 / 3 个枚举值逐一挂载，根 `data-status` 等于该值；SourceBadge 根无 `data-status`。按 `modules.spec.ts` 的 `styleRule` 先例（`?raw` + `CSSStyleSheet`）解析三个真实 SFC 样式：基础规则边框为 `var(--fai-glass-module-border)`；表中 ok / warn / bad 列每个值命中的规则 `border-color` 恰为对应 `--fai-status-*`；中性值没有专属规则。三个 SFC 都不出现 `--fai-status-sample`，任何 `color` 声明都不取 `--fai-status-*` / `--fai-accent-red`；SourceBadge 样式不含任何 `--fai-status-`。`check --only colors` / `glass` 通过（AC-001-5 部分前置：人工 M-01 的视觉线索；组件部分已由 T-A23 最终）。
  4. 工程门通过（AC-009-1 部分前置）。【r6.9】`badges.spec.ts` 整文件通过（原 27 例 + 新组）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-1"`
  2. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-4 list"`
  3. `pnpm -C frontend test:unit tests/component/jobs/badges.spec.ts -t "WI badge tone" && pnpm -C frontend check --only colors && pnpm -C frontend check --only glass`
  4. `pnpm -C frontend test:unit tests/component/jobs/badges.spec.ts && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B02 筛选、搜索与清空

- **状态**：**已完成（原 Review + 增量 Review 联合依据，非最终 AC）**（原件 `9812f64` 判本任务标准满足；增量 Review 原件 `46e8fbe` 关闭 R4-A，第四批改判技术通过；A 复跑 job-list 12）｜【R4-A 关闭前原文】已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）（`review-batch4.md` 原件 `9812f64`：本任务标准经 A 判满足，A 亲跑 `WI AC-001-2` 6、job-list 整文件 12、工程门通过；本批因 R4-A P2 未通过，不计完成）｜原状态行“已实施（第四批第 2 项；待批次独立代码 Review）”为 Converge 时原文｜commit `0221a94bbd9aefe4b7d482f61e3e9017d0a25710`（父 `5c00cf6`；只改 `JobListPage.vue` 与追加 `WI AC-001-2` 组）。验证（实施者会话 `01a187e0…` 执行，Converge 未重跑）：命令 1 `WI AC-001-2` 6；命令 2 typecheck / lint 通过；job-list 整文件 12。**失败留痕**：命令 1 首跑 1 fail（新测试误以为单空格标题无匹配，实际 5 个 fixture 标题都含空格）；lint 首跑 2 条 `vue/multiline-html-element-content-newline` 警告；均只修新代码 / 新测试后通过｜以下为派工准备时原文：未开始｜blocked_by: IMPL-GATE-R6｜r6.8：依赖增 T-A22c（`review-batch3.md` R3-A 要求在本任务 / H-2 ④ 之前关闭）｜R3-A 已于 `69faacc` 关闭；本任务仍须待 T-B01｜r6.9：第四批第 2 项（R10 前不得开码）
- **预计**：1 h｜**依赖**：T-B01、T-A22c
- **上下文**：spec R-001（状态 / 类型筛选、标题搜索）。
- **修改范围**：`JobListPage.vue` 的筛选条（选项文案来自 `JobStatusLabel` / `JobTypeLabel`）、经 T-A22a 的 `applyFilter(filter)`（调用 listJobs(filter)，结果单独存为 `filteredJobs`、不覆盖未筛选缓存，不在前端重新筛选）；扩充 `job-list.spec.ts`。
  【r6.9 精度（不改 AC；第四批）】
  - **控件**：状态 `<select>`（“全部” + 九状态）、类型 `<select>`（“全部” + 三类型）、标题 `<input>`、“清空”按钮。
  - **筛选组装**：任一控件变化即组装一次 filter：选中的 status / type 原值；title 非空串时原样放入（不 trim，契约 title 区分大小写子串）。三项全空 → `applyFilter(null)`，否则 `applyFilter(filter)`。
  - **清空**：复位三控件并 `applyFilter(null)`（不发请求）。
  - **展示**：列表展示 `filteredJobs ?? jobs`。筛选结果为空时显示 `EmptyState`（“暂无符合筛选的作业。”，与“暂无作业。”区分）。三态仍按 `listStatus`；筛选失败按 r6.8 共享读状态呈现 error，筛选成功不清除该错误，“重试”经 `refresh()` 恢复。
  - **不做**：前端重筛 / 排序、防抖、请求序号；不改 `stores/jobs.ts`；不改 `badges.spec.ts` 与 B01 已有用例。
  - **【r6.10 精度（Converge batch4 登记）】** 三个控件的初值取 store 只读 `filter`（回到列表页时保持上次筛选，不额外请求）；这是既有成员的消费，不新增状态或机制。
- **完成标准**：
  1. 状态、类型、标题子串三者组合生效；清空后恢复全量（AC-001-2 **最终**）。【r6.9】透传 spy 记录的 `listJobs` 参数等于组装的 filter；卡片集合等于真实 `listJobs(filter)` 结果；清空不发请求、恢复未筛选全集；空结果显示“暂无符合筛选的作业。”。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-2"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B03 新建作业面板与跳转

- **状态**：**已完成（原 Review + 增量 Review 联合依据，非最终 AC）**（原件 `9812f64` 判本任务标准满足；增量 Review 原件 `46e8fbe` 关闭 R4-A，第四批改判技术通过；R4-B / R4-C 仍开放）｜【R4-A 关闭前原文】已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）（`review-batch4.md` 原件 `9812f64`：本任务标准经 A 判满足，A 亲跑命令 1～3 = 4 / 1 / 1 + 工程门；本批因 R4-A P2 未通过，不计完成；R4-B（导航不带 query）、R4-C（提示初始即渲染）为 P3，归属见页首）｜原状态行“已实施（第四批末项；待批次独立代码 Review）”为 Converge 时原文｜commit `6c082fd60570a329771727be16b494f81775f957`（父 `cc6559d`；4 个授权文件）。验证（实施者会话 `01a187fa…` 执行，Converge 未重跑）：命令 1 `WI AC-001-3 validation` 4；命令 2 e2e `WI AC-001-3` 1；命令 3 `WI non-modal` 1 + typecheck / lint 通过。**失败留痕**：命令 3 的 typecheck 首跑新测试 TS18046 ×2（`catch` 变量为 unknown）与 TS2339（`getComponent(...).exists()`），只修新测试类型 / 改用 `findComponent` 后通过。诊断 `moduleId` 按 R10 已审原文为 `job-create`（协调提示中的 `jobs-create` 是笔误，实施者开码前已声明，不改）｜以下为派工准备时原文：未开始｜blocked_by: IMPL-GATE-R6｜**r6.9：依赖增 T-B04**（端到端须核对详情页回显；第四批末项，排在 T-B04 之后执行；这是 §6 编号前向规则的唯一有意回边，拓扑无环）；R10 前不得开码
- **预计**：1.5 h｜**依赖**：T-B01、T-A12、T-B04
- **上下文**：spec R-001“新建作业”；非模态的内联面板。
- **修改范围**：新建 `jobs/pages/JobCreatePanel.vue`（标题必填、类型必选、品种 / 主题可选、目标说明多行；表单提示复用契约 schema；提交调用 T-A22a 的 `useJobsStore().createJob(input)`，成功后跳转）；新建 `tests/component/jobs/job-create.spec.ts`、`e2e/jobs/list-create.spec.ts`（normal 场景：读取 mock 契约的持久记录 `localStorage["fai.jobs.v1"]` 中新作业的参数，并核对详情页回显；不新增窗口钩子或测试专用记录器）。
  【r6.9 精度（不改 AC；第四批）】
  - **挂载点**：允许修改 `jobs/pages/JobListPage.vue`：增加“新建作业”按钮（`aria-expanded`），点击后在列表上方内联展开 / 收起 `JobCreatePanel`。面板是普通 `<section>`，不用 `role="dialog"`、`aria-modal`、遮罩、`position: fixed`、`inert` 或焦点锁；展开时列表与筛选仍可操作。
  - **表单 → `CreateJobInput`**：
    - `title` 原值，空白由契约 trim；即时提示用 `CreateJobInputSchema.shape.title.safeParse`。
    - `type` 必选，初始为空占位“请选择类型”，选项来自 `JobTypeLabel`，不设默认值；即时提示用 `JobTypeSchema.safeParse`。
    - `subject` 去空白后为空 → `null`，否则原值。
    - `goal` 多行原值，可为 `''`。
    - 校验失败时不调用 `createJob`；不猜 recipe / 阶段参数，不加其他字段。
  - **成功**：经既有 `useJobsStore().createJob(input)`（其内部恰一次 `refresh()`，不再另行刷新），再 `router.push({name:'job-detail', params:{id: job.id, stage:'collect'}})`。
  - **失败**：`createJob` 以原 `ErrorResponse` 拒绝时，在面板内显示 `ErrorState`（`moduleId='job-create'`、`error` 原样；`@retry` 以同一输入再提交一次）；表单值保留，不导航、不关闭面板。不新建通用故障框架。
  - **不做**：取消作业（T-B05）、草稿保存、重复提交锁。
  - **测试 harness**：组件测试同 T-B01；端到端 normal 场景，Playwright 自管 4173，不改 `playwright.config.ts`。
  - **一律不改**：`stores/jobs.ts`、契约、`shared/**`、`app/**`、B01 / B02 / B04 已有用例。
  - **【r6.10 精度（Converge batch4 登记）】** 面板为 `<section aria-label="新建作业">` + `<form novalidate>`；两条校验提示（`role="alert"`）在面板展开时即按当前值渲染（见 `converge-batch4.md` §5 O-B4-3）；失败诊断 `moduleId='job-create'`；成功跳转的路由对象不带当前 `route.query`（O-B4-1）。
- **完成标准**：
  1. 标题为空或未选类型时给出提示且不提交（AC-001-3 部分前置）。【r6.9】仅空白的标题、未选类型各自给出提示，且 `createJob` 透传 spy 为 0 次；subject 仅空白时提交 `null`、goal 为空时提交 `''`；error 场景下契约拒绝 `adapter_error` 时，面板内显示可复制诊断（`moduleId='job-create'`），表单值保留、路由不变。
  2. 端到端：创建后进入 `/jobs/:id/collect`，阶段=提取、状态=collecting，createJob 参数被记录（AC-001-3 **最终**）。【r6.9】先空提交，断言出现提示、URL 仍为 `/jobs`；再填写标题 / 类型“专题” / 空主题 / 多行目标并提交，URL 变为 `/jobs/<id>/collect`；`localStorage["fai.jobs.v1"]` 中该 id 的记录为 `{title, type:'research', subject:null, goal, status:'collecting', currentStage:'collect', createdBy:'human'}`；详情页回显标题、“专题”、状态徽“提取中”，阶段轨道“提取”为 `aria-current="step"`。
  3. 面板没有遮罩和焦点锁（AC-007-3 部分前置）；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-create.spec.ts -t "WI AC-001-3 validation"`
  2. `pnpm -C frontend test:e2e e2e/jobs/list-create.spec.ts -g "WI AC-001-3"`
  3. `pnpm -C frontend test:unit tests/component/jobs/job-create.spec.ts -t "WI non-modal" && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B04 作业详情、阶段轨道与 URL 阶段参数

- **状态**：**已完成（原 Review + 增量 Review 联合依据，非最终 AC）**（原件 `9812f64` 判四条标准满足；本任务页面上的 R4-A 由 T-B04a `ae592ba` 修复，增量 Review 原件 `46e8fbe` 关闭 R4-A、第四批改判技术通过；A 复跑 job-detail 13 / detail-stage 5；R4-D 仍开放）｜【R4-A 关闭前原文】已实施，第四批 Review 未通过（R4-A 待 §5.1 批准 / 修复）（`review-batch4.md` 原件 `9812f64`：本任务四条标准的字面经 A 判满足，A 亲跑命令 1～4 = 6 / 4 / 9 / 工程门，job-detail 整文件 11；**P2 R4-A 位于本任务的 `JobDetailPage.vue` async watch**：离开或选阶段后，迟到的 canonical replace 会劫持导航并覆盖历史，在 slow 场景可确定复现。修复草案 = **T-B04a**（blocked_by Walter §5.1 批准，获准前不得开码；**2026-10-29 已获批，T-B04a 解除 blocked**，见页首）；本任务标准 / 命令 / 工时不改，不计完成）｜原状态行“已实施（第四批第 4 项；待批次独立代码 Review）”为 Converge 时原文｜commit `cc6559d7bb0b5afb0e233b8295dbd55f1de41d9d`（父 `ca7dca1`；5 个授权文件，未改 store / routes / session）。验证（实施者会话 `01a187fa…` 执行，Converge 未重跑）：命令 1 `WI AC-002-1` 6；命令 2 e2e `WI AC-002-2` 4；命令 3 两文件 `WI AC-001-4` 9；命令 4 typecheck / lint 通过；详情组件整文件 11。**失败留痕**：命令 1 首跑 2 fail（新测试期待离开详情后不再 `getJob`，实际列表 `ensureJobs → refresh` 按 plan §2.3【r6.9】重读保留锚；只改新测试期望，未加页面 / store guard，经 RouterView 无 `undefined` 读 = R10 S-42 落实）；lint 首跑 2 条模板换行警告，修模板后通过｜以下为派工准备时原文：未开始｜blocked_by: IMPL-GATE-R6｜**r6.9：store 部分拆至 T-A22d，依赖增 T-A22d；本任务不改 `stores/jobs.ts`**；第四批第 4 项（R10 前不得开码）
- **预计**：2 h｜**依赖**：T-B01、T-A22d
- **上下文**：spec R-002；plan §2.1（`router.replace`，未知 stage 回落到当前阶段）、§4.3（阶段状态只读契约，不推导）。
- **修改范围**：`jobs/pages/JobDetailPage.vue`、新建 `jobs/components/{StageRail,StageWorkspace}.vue`（各阶段工作区占位，由 C–F 填充）；`stores/jobs.ts` 增加当前作业 / 阶段工作区视图缓存（`openJob(id, stage)`）并纳入 `refresh()`（§1-9）；`/jobs/:id` 缺省或未知 stage 时用 `router.replace` 补成作业 currentStage，T-A22b 的守卫随之设置会话上下文（r6）；详情三态（S-13：empty + 预置 id 时显示“暂无作业”）；新建 `tests/component/jobs/job-detail.spec.ts`、`e2e/jobs/detail-stage.spec.ts`。
  【r6.9 精度（不改 AC；第四批；上句中 `stores/jobs.ts` 部分已移交 T-A22d，本任务只消费其成员）】
  - **`JobDetailPage.vue`**（plan §2.1【r6.9】）：
    - `watch([route.params.id, route.params.stage], …, {immediate: true})`。stage 合法 → `openJob(id, stage)`；缺省 / 未知 → `openJob(id, null)`，返回非 null 时 `router.replace` 到该 stage 一次（随后的再次 `openJob` 是可接受的多读，不加比较 / 去重 guard）。
    - 按 `detailStatus` 呈现，与列表的 `listStatus` 无关，页面不调用 `ensureJobs`：`idle` / `loading` → `Loading`；`error` → `ErrorState`（`moduleId='job-detail'`、`error=detailError`、`@retry` → `refresh()`；not_found 的 `retryable=false`，按既有组件不显示重试）；`ready` 且 `currentJob=null` → `EmptyState`“暂无作业。”；`ready` 有作业 → 详情头 + `StageRail` + `StageWorkspace`。
    - **详情头**：标题、`JobTypeLabel` 图标 + 文案、`JobStatusBadge`、subject（null 时不渲染）、goal（空串时不渲染，多行保留换行）。不显示 createdBy（契约无其展示映射，不新建）；failed / cancelled 的原因区归 T-B05。
  - **`StageRail.vue`**：
    - props `{stages: readonly StageSummary[]; currentStage: Stage; viewedStage: Stage | null}`，emit `select(stage)`。
    - 按 `stages` 原顺序渲染 4 个 `<button type="button">`，各显示 `StageLabel` 与 `StageStateLabel` 的图标 + 文案，不推导状态。
    - `currentStage` 项 `aria-current="step"`，并以既有令牌边线高亮（参照 `app/Rail.vue` 当前项写法，不新增色值 / 玻璃类）；`viewedStage` 项 `aria-pressed="true"`。
    - 不渲染 `pendingCount` 角标（T-G02）、重跑入口（T-B07）。页面收到 `select` 后 `router.replace({name:'job-detail', params:{id, stage}})`。
  - **`StageWorkspace.vue`**：props `{stage: Stage}`，只渲染带 `aria-label="<阶段名>工作区"` 的占位与一句“由后续任务提供”的说明。不消费工作区数据、不虚构 C–F 功能，`currentStageWorkspace` 由 C–F 消费。
  - **测试 harness**：同 T-B01（真实 router + `registerJobRoutes`，以 RouterView 或在 push 后挂载页面）；端到端 normal 场景，不加窗口钩子，不改 playwright 配置。
  - **一律不改**：`stores/jobs.ts`、`routes.ts`、`session.ts`、`main.ts`、契约、`shared/**`、`app/**`、`routes.spec.ts`（预计无需维护；若真实失败，停下回报）。
  - **【r6.10 精度（Converge batch4 登记；只记实际写法，不改标准 / 命令）】** `StageRail` props 实为 `{stages: readonly StageSummary[]; currentStage: Stage; viewedStage: Stage | null}`、emit `select`；`aria-pressed` 绑定布尔（未查看项为 `"false"`），查看项的视觉线索为阶段名下划线；当前阶段边线 = `border-inline-start-color: var(--fai-accent-red)`（同 `app/Rail.vue`）。`StageWorkspace` 占位文本为“工作区内容由后续任务提供。”，`currentStageWorkspace` 尚无页面消费者（C–F）。详情头不显示 createdBy（R10 S-41，归属见 T-B05 状态行）。canonical / 选阶段的 `router.replace` 不带当前 `route.query`（O-B4-1）；async watch 在离开后仍可能执行迟到的 replace（O-B4-2）——两者交第四批 Review，不在本任务内加 guard。
- **完成标准**：
  1. 轨道按 提取 → 处理 → 分析 → 交付 的固定顺序渲染，五种阶段态取自契约文案，当前阶段高亮（AC-002-1 **最终**）。【r6.9】`/jobs/j-failed/analyze` 与 job-running 场景的 `/jobs/j-human/process` 合起来覆盖五种阶段态，文案与图标取自契约。`/jobs/j-process/collect`：`aria-current="step"` 在“处理”（业务 currentStage），`aria-pressed="true"` 在“提取”（查看）。点“分析”后路由 stage 变为 `analyze`（replace），并以该阶段 `openJob`。详情头显示 j-process 的标题、“专题”、状态徽“处理中”与品种主题（AC-001-3 部分前置：供 T-B03 端到端核对回显）。
  2. 端到端：点击阶段时 URL 更新；直接打开带阶段的地址并刷新后仍停在该阶段；`/jobs/:id` 缺省 stage 时取作业 currentStage；未知 stage 回落到当前阶段（AC-002-2 **最终**）。【r6.9】样例用 normal 的 j-process：`/jobs/j-process` 与 `/jobs/j-process/bogus` 都被 replace 为 `/jobs/j-process/process`；`/jobs/j-process/analyze` reload 后 `aria-pressed` 仍在“分析”；点“交付”后 URL 为 `/jobs/j-process/deliver`。
  3. 详情的加载 / 空 / 错误三态可以触发，错误态含可复制诊断；与 T-B01 的列表三态一起构成完整 AC（AC-001-4 **最终**，两个组件测试文件一起运行）。【r6.9】slow 首次进入显示 `Loading`，推进后 ready。`/jobs/j-collect/collect?scenario=empty`（S-13）显示“暂无作业。”、无轨道。error 场景：`ErrorState` 诊断 `{moduleId:'job-detail', code:'adapter_error', …}` 可复制，切回 normal 点“重试”经 `refresh()` 恢复。normal `/jobs/j-missing/collect`：`not_found`、无重试按钮、`listStatus` 不变为 error。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-1"`
  2. `pnpm -C frontend test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-2"`
  3. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts tests/component/jobs/job-detail.spec.ts -t "WI AC-001-4"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B04a R4-A 最小修复：离开详情或切换阶段后不再执行迟到的 canonical replace（第四批 Review R4-A；r6.11，已获 Walter §5.1 批准）

- **状态**：**已完成（原 Review + 增量 Review 联合依据，非最终 AC）**（增量 Review `review-batch4-r4a.md` 原件 `46e8fbe`：0 P1 / P2 / 0 新 P3，**R4-A 关闭**，3 条标准满足、在批准范围内；A 亲跑命令 1～3 = 2 → 13 / 1 → 30 / 34 files 1020 / 0 + 工程门；只读 Chrome 探针 6 / 6 不计入正式 E2E）｜【A 前原文】已实施，待 A 新会话增量 Review（R4-A 代码已修、未关闭；第四批 Review 维持未通过；不计完成）｜commit `ae592ba23b086dd5887a269e842f80c96ad16fb2`（父 `80a1892`；openai/gpt-6-astra 新会话 `01a188e0…`，未回退），只有 3 个授权文件 +72 / −2，原 11 / 4 例为逐字节前缀，store / query 零差异。验证（实施者执行，Converge 未重跑）：命令 1 = `WI R4-A` 2 → 整文件 13；命令 2 = `WI R4-A` 1 → 四份 E2E 30；命令 3 = 全量单测 34 files / 1020 / 0 + typecheck / lint + `6c082fd..HEAD -- frontend` 只含三文件。**先红后绿**：旧生产代码下同一组测试组件 2 failed（被拉回 `/process`，分别出自 `/prices` 与 `/deliver`）、Chrome 1 failed（被拉回 `/jobs/j-process/process`），修复时测试期望没有改。增量 Converge 见 `converge-batch4-r4a.md`（已收口、无缺口）｜以下为批准登记时原文：未开始（**可开码**：2026-10-29 Walter 原话“那就先修P2等全部工作完成后，再合入main”批准本项最小修复，plan r6.11 生效；范围严格按下方修改范围，不扩）｜原状态行“草案，blocked_by: Walter §5.1 批准；【r6.11 待批，不生效】；获准前不得开码、不派 Astra”为草案时原文，下文“为什么要单独批准”保留为背景
  - **性质**：不是需求变更（spec / 46 AC 不变，不回 Clarify / Gate 1）。这是第四批 Review 唯一 P2 R4-A 的 Converge 补修草案（AGENTS §2 第 9 步）。
  - **为什么要单独批准**：修复会新增一处 plan 明确不做的生命周期检查——plan §2.1【r6.9】写明“不加比较 / 去重 guard”，§2.3【r6.10】写明“任何新增 guard 按 AGENTS §5.1 先报 Walter”。因此须 Walter 本人对本项单独批准；他的通用代码授权不覆盖这一项。
  - **获准后的流程**：Implement（新会话，首选 openai/gpt-6-astra）→ Converge → **A 新会话增量 Review**。增量 Review 通过后才关闭 R4-A、改判第四批。
  - 原 blocked_by: IMPL-GATE-R6（已满足）。
- **预计**：0.5 h｜**依赖**：T-B04、T-B03
  - 依赖的是二者在 `6c082fd` 的**已实施代码**，不表示二者已通过 Review：修复对象是 B04 的 `JobDetailPage.vue`；回归命令要跑 B03 的 `list-create` E2E 与 `job-create` 组件测试。
- **上下文**：
  - `review-batch4.md` §3 R4-A：位置 `JobDetailPage.vue` :21–27；真实 Chrome 复现 2a～2d；§5.1 三项依据；最小方案。
  - plan §2.1【r6.11 草案】；Converge O-B4-2。
  - Checklist R10 S-42 / S-43：S-43 的“乱序”口径不覆盖本缺陷，本缺陷在请求按序完成时就会发生。
- **修改范围**（范围确定、没有可选项；基线 = 代码固定点 `6c082fd`）：
  - **`frontend/src/jobs/pages/JobDetailPage.vue`**：只改 `watch([...], async (...) => {...}, {immediate: true})` 的回调，约 3～5 行：
    - 使用回调第三参数 `onCleanup`；
    - 同一次回调内先 `let stale = false`，再 `onCleanup(() => { stale = true })`（回调再次触发或组件卸载时由 Vue 调用）；
    - 只在 canonical `router.replace` 之前加 `!stale` 条件。
    - `openJob` 仍照常调用并等待；`selectStage`、模板、三态、详情头都不改。
  - **不做**：
    - 不改 `stores/jobs.ts`：不清锚、不取消请求、不加请求序号 / 锁 / 比较去重；
    - 不处理 R4-E 的 store 迟到写入（归 `api` feature），不做全局防乱序机制；
    - 不给任何导航加 `route.query`（R4-B）；
    - 不改 `routes.ts` / `session.ts` / `main.ts` / 契约 / `shared/**` / `app/**` / 任何配置。
  - **`frontend/tests/component/jobs/job-detail.spec.ts`**：**只新增** describe `WI R4-A`，共 2 例。harness 同既有用例：真实 Pinia、真实 memory router + `registerJobRoutes` + `RouterView`、真实 mock client 的系统边界 spy；slow 场景用假时钟；不 `vi.mock` 内部模块。
    1. **离开**：slow 下 push `/jobs/j-process`，读完成前 push `/prices`，推进 ≥ 3000 ms → 当前路由仍为 `/prices`，没有被 replace 回 `job-detail`。
    2. **同作业选阶段**：slow 下先打开 j-process 到 ready，离开后再 push `/jobs/j-process`（无 stage；同作业缓存使轨道可见）；读完成前经 StageRail 选“交付”，推进 ≥ 3000 ms → 路由仍为 `/jobs/j-process/deliver`，`aria-pressed` 在“交付”。
    - 原 11 例（`WI AC-002-1` / `WI AC-001-4 detail`）不改、不删。
  - **`frontend/e2e/jobs/detail-stage.spec.ts`**：**只新增** 1 例，标题以 `WI R4-A` 开头，不改 `playwright.config.ts`、不加窗口钩子。步骤：
    - 打开 `/jobs?scenario=slow`，点 j-process 卡片（`/jobs/j-process`）；
    - 读完成前点侧栏“价格”离开；
    - 按真实 slow 延迟实际等待 ≥ 3500 ms（不装假时钟）→ URL 仍为 `/prices`。
    - 原 4 例不改。
- **完成标准**：
  1. 组件：`WI R4-A` 两例通过（离开详情后不被拉回；同作业读期间选的阶段不被改回）；`job-detail.spec.ts` 整文件通过（原 11 + 新 2），原例零删改（AC-002-2 **最终**，R4-A 延迟路径，与 T-B04 共同承接；R4-A）。
  2. 端到端：`WI R4-A` 一例在真实 Chrome 的 slow 场景通过（SPA 内离开后 URL 不被拉回详情）；四份 E2E（`shell` / `agent` / `jobs/detail-stage` / `jobs/list-create`）全部通过（原 29 + 新 1），T-B04 原 `WI AC-002-2` 4 例不改（AC-002-2 **最终**，与 T-B04 共同承接；R4-A）。
  3. 全量单测通过（原 1018 + 新 2，无删改）；`6c082fd..HEAD -- frontend` 只含上述三个文件；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/job-detail.spec.ts -t "WI R4-A" && pnpm -C frontend test:unit tests/component/jobs/job-detail.spec.ts`
  2. `pnpm -C frontend test:e2e e2e/jobs/detail-stage.spec.ts -g "WI R4-A" && pnpm -C frontend test:e2e e2e/shell.spec.ts e2e/agent.spec.ts e2e/jobs/detail-stage.spec.ts e2e/jobs/list-create.spec.ts`
  3. `pnpm -C frontend test:unit && pnpm -C frontend typecheck && pnpm -C frontend lint && git diff --stat 6c082fd HEAD -- frontend`

### T-B05 待人工确认横幅、失败 / 取消展示与取消作业确认

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜**开工前先承接 Checklist R10 S-41（P3，未关、未经 Walter 风险接受）**：冻结 spec §2 目标与 R-001 what 均含“创建者（人 / 计划）”，已实施的 T-B04 按已审 r6.9 未显示（`JobListItem` 契约也不含创建者）。本任务开工前须先做一次最小展示精度轮（Tasks / Plan 写明展示位置与文案来源，候选为 S-11 同机制的契约展示映射；重跑 Analyze 并经 A 定向复核），若因此超 2 h 按 B-12 先例拆小任务；不改 spec / AC、不写成“v1 不展示”、不移交其他 feature、不回头扩已实施的 B04（Converge batch4 登记，本行不改本任务标准 / 命令）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6（已满足）｜**r6.12：第五批第 4 项**。依赖 T-A15 改为 **T-A15a**（只读）并增 T-A01a；补 JobDetailPage 侧栏挂载权与写后刷新口径；预计 1.5 → 2 h，新增标准 / 命令 2（原标准 / 命令 2 顺延为 3）。Checklist R11 定向复核通过并提交前不得开码
- **预计**：2 h｜**依赖**：T-B04、T-A15a、T-A01a（r6.12：原依赖 T-A15 改为只读的 T-A15a）
- **上下文**：spec R-007“作业详情侧栏‘介入历史’按时间展示，可按阶段 / 类型筛选”；plan §2.2、§2.3【r6.12】。原范围只新建组件，漏了两件事：谁把它挂进 `JobDetailPage`；同一作业写入新事件后，历史如何看到它（只在 mounted 或 jobId 变化时读会过期）。T-C04 的取证要展开这里的内容。
- **修改范围**：
  - 新建 `frontend/src/jobs/components/InterventionHistory.vue`：
    - props `{job: DeepReadonly<Job>}`；根 `<aside aria-label="介入历史">`，标题用 `<h2>`。
    - “展开介入历史 / 收起介入历史”按钮（`aria-expanded`）。**默认收起，收起时不发任何读请求**。
    - 展开后调用 `dataClient.listInterventions(job.id, filter)`；filter 只放已选项。阶段 `<select aria-label="按阶段筛选">`：全部 + `StageLabel`；类型 `<select aria-label="按类型筛选">`：全部 + 13 个 `InterventionKind` 契约值原样。读状态是组件本地状态（同既有模块直接读 `dataClient` 的写法）：loading → `Loading`；error → `ErrorState`（`moduleId='intervention-history'`，重试即重读）；空 → `EmptyState`“暂无介入记录。”。
    - 每条显示 `<time :datetime>` createdAt、`StageLabel`、kind、outcome（kind / outcome 用契约值原样，不新建映射）；条目内原生 `<details>` 展开 id / jobId / artifactId / baseRev / reason（null 显示“无”）与 payload 摘要。
  - **payload 摘要**：按 `InterventionPayload` 的 `action` 判别收窄，不 `JSON.stringify`，也不按任意 JSON 遍历键。总显示 `action`；`ingest` 显示 sourceNote 五项（用途；可靠性 = `ReliabilityLabel` 文案；发布日期 / 有效期为 null 时显示“未知”；口径为 null 时显示“无”）；`map_fix` 显示 mapping 行（源字段 → 目标字段 · 单位）；`remove_source` / `cancel_job` / `delete_conclusion` / `veto` 显示 reason；其余分支只显示 action（后续台面任务按需扩展）。
  - **重读信号**（plan §2.3【r6.12】）：`watch([() => props.job, 阶段筛选, 类型筛选, 展开状态], …)`，仅在展开时重读。`props.job` 就是 `jobsStore.currentJob` 的只读引用；jobsStore 每次详情读成功（`openJob` / `refresh`，包括所有写后统一 `refresh()`）都会换成新对象，所以同一作业写入新事件后，展开中的历史会随那次 refresh 重读。**不**新增 store 成员、事件总线、轮询、请求序号或比较 guard；并发重读沿用“mock 按序完成”口径（S-43）。
  - `frontend/src/jobs/pages/JobDetailPage.vue`（**挂载权**）：只改 ready 且有作业的分支——把既有 `StageRail` + `StageWorkspace` 包进主列，`<InterventionHistory :job="jobsStore.currentJob" />` 作为右侧栏常驻（DOM 顺序在主列之后）。两列 grid 用 `minmax(0, …)` 写法（过 `check --only grid`），窄窗沿用仓库既有断点写法堆叠为单列；只用既有令牌，不新增颜色 / 玻璃类。`watch` / `selectStage` / 三态 / 详情头 / 其他分支不改。
  - 新建 `frontend/tests/component/jobs/intervention-history.spec.ts`：真实 Pinia、真实 memory router + `registerJobRoutes` + `RouterView`、真实 mock client；在系统边界对 `dataClient.listInterventions` / `getJob` / `getStageWorkspace` / `listJobs` 做透传 spy；不 `vi.mock` 内部模块。
  - **避免既有断言歧义**：新组件不渲染 `h1`、`.job-*` 类名、`aria-current` / `aria-pressed`、`JobStatusBadge`；按钮名不含“侧栏”；可访问名称不与“作业详情 / X工作区 / 作业阶段”重名。
  - **一律不改**：`stores/jobs.ts`、`StageRail.vue`、`StageWorkspace.vue`、契约 / 生成物、`shared/**`、`app/**`、`main.ts`；既有 `job-detail.spec.ts`（13 例）、`e2e/jobs/detail-stage.spec.ts`（5 例）、`e2e/jobs/list-create.spec.ts`（1 例）的用例。
- **完成标准**：
  1. 渲染 mock 事件，十个字段（id / jobId / stage / artifactId / baseRev / kind / payload 摘要 / reason / outcome / createdAt）可见或可展开；按阶段和 kind 筛选生效（AC-007-1 **最终**；AC-002-4 部分前置：重跑事件在介入历史可见）。【r6.12】筛选时 `listInterventions` 的参数等于所选条件，列表等于真实结果；ingest 条目展开后按上述规则显示 sourceNote 五项（null 不伪造）。
  2. 【r6.12】详情页挂载与刷新：进入 `/jobs/j-collect/collect` 时历史默认收起，`listInterventions` 调用 0 次；展开后读当前作业。随后在同一页面经真实契约写入（如 `dataClient.submitIntake({jobId: 'j-collect', …})`）并调用一次 `jobsStore.refresh()`：展开中的历史无需手动操作即出现新的 ingest 事件。切到另一作业的详情后只显示该作业的事件（AC-007-1 **最终**的组成部分；AC-003-3 部分前置：T-C04 取证所需的展开内容）。
  3. 详情页既有回归：`job-detail.spec.ts` 整文件（13 例）、`detail-stage` 与 `list-create` 两份 E2E 通过，原例零删改；工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/intervention-history.spec.ts -t "WI AC-007-1"`
  2. `pnpm -C frontend test:unit tests/component/jobs/intervention-history.spec.ts -t "WI history refresh"`
  3. `pnpm -C frontend test:unit tests/component/jobs/job-detail.spec.ts && pnpm -C frontend test:e2e e2e/jobs/detail-stage.spec.ts e2e/jobs/list-create.spec.ts && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-B07 重跑确认与迁移展示

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

### T-C01 投放面板：三种输入、白名单、来源说明与 intakeStore 公开接口（H-5）

- **状态**：未开始｜blocked_by: IMPL-GATE-R6（已满足）｜**r6.12：第五批第 5 项**；依赖增 T-A01a（可靠性文案）；store 成员 / 草稿形状 / 提交签名按 plan §2.3【r6.12】定型（不改标准数、命令与工时）。Checklist R11 定向复核通过并提交前不得开码
- **预计**：2 h｜**依赖**：T-A22、T-A12、T-A22a、T-A01a
- **上下文**：spec R-003；plan §2.2 / §3（文件只取元数据；粘贴正文只在草稿中）；v2 plan §7.3 H-5（`open(jobId?)` / `close()` / `isOpen` / `jobId` 为打开时快照，提交使用快照，写后刷新共享缓存）。r6：IntakeDrawer 容器、页面级挂载与非模态断言移到 T-C01a。
- **修改范围**：新建 `jobs/stages/IntakePanel.vue`（文件拖入 / 选择、URL、文本，三选一必填；来源说明表单；提示“本地样例记录；原文不保存，刷新后需重新投放原文”）；新建 `stores/intake.ts`（`useIntakeStore`：`open(jobId?)` 记录打开时的 `jobId` 快照，此后路由变化不改写；`close()`；只读 `isOpen` / `jobId`；当前草稿；`submit(input)` 以快照 jobId 调用 `submitIntake`（快照为空则进入待归属），成功后调用 `useJobsStore().refresh()`；**不含实例登记**）；新建 `tests/component/jobs/intake.spec.ts`。
  【r6.12 精度（plan §2.3【r6.12】；不改标准数 / 命令）】
  - **`frontend/src/jobs/stores/intake.ts`**（setup store；私有 ref，对外 `computed` + `readonly`，写法同 jobsStore）：
    - H-5 公开成员：`open(jobId?: string): void`——每次调用都置 `isOpen=true`，并把快照写成 `jobId ?? null`（覆盖上次快照；store 不读 route，之后路由变化不改写）；`close(): void`——只置 `isOpen=false`，不导航、不调用 agent、不清草稿与快照；只读 `isOpen: boolean`、`jobId: string | null`。
    - 本 feature 内部成员（不属 H-5 交接）：只读 `draft: DeepReadonly<IntakeDraft>`；`updateDraft(patch: Partial<IntakeDraft>)`；`resetDraft()`；`submit(submission: IntakeSubmission): Promise<IntakeReceipt>`。
    - `IntakeDraft = {inputKind: IntakeInput['inputKind']; fileMeta: IntakeFileMeta | null; url: string; text: string; purpose: string; reliability: SourceNote['reliability']; publishedAt: string; validUntil: string; scopeNote: string}`；初值：`inputKind='file'`、`fileMeta=null`、各字符串 `''`、`reliability='unknown'`（未选时不伪造可靠性）。
    - `IntakeSubmission` = 按 `inputKind` **分配**的 `Omit<…, 'jobId'>`：`{[K in IntakeInput['inputKind']]: Omit<Extract<IntakeInput, {inputKind: K}>, 'jobId'>}[IntakeInput['inputKind']]`（不是非分配的 `Omit<IntakeInput, 'jobId'>`）。调用方因此不能用外来 jobId 覆盖打开时的快照。
    - `submit`：调用 `dataClient.submitIntake({...submission, jobId: <快照>})`。成功 → `resetDraft()` → `await useJobsStore().refresh()` **恰一次** → resolve 回执。失败 → 以原 `ErrorResponse` reject，不 refresh、不清草稿（同已审 `createJob` 口径；调用方 await + catch，无 unhandled）。store 内不再 parse（契约边界已 parse）。
    - store 不持有 File 对象，不读写 localStorage，不调用 agent；不含实例登记 / 首个挂载者 / 卸载释放机制。草稿只在内存中，跨页面挂载保留，刷新即丢失（plan §3）。
  - **`frontend/src/jobs/stages/IntakePanel.vue`**（根 `<section aria-label="投放表单">`，普通流式内容，不 fixed、无遮罩 / dialog / 焦点锁；只用既有令牌）：
    - 输入种类单选（文件 / 链接 / 文本），只提交当前种类。
    - 文件：`<input type="file" accept=".pdf,.docx,.xlsx,.md,.csv">` + 拖入区（`dragover.prevent` / `drop`）。只取 `files[0]` 的 `name / size / type / lastModified` 组成候选元数据，用 `IntakeFileMetaSchema.safeParse` 校验：失败 → 显示“只接受 pdf / docx / xlsx / md / csv 文件”（由 `INTAKE_FILE_EXTENSIONS` 拼出），草稿 `fileMeta` 保持 null；成功 → `updateDraft({fileMeta})`。**禁止**调用 `File.text / arrayBuffer / stream / slice`、`FileReader`、`URL.createObjectURL` 或任何解析。
    - 链接：`<input type="url">`，只存字符串、不访问；文本：`<textarea>`，正文只进 store 内存草稿。
    - 来源说明：用途（必填）；可靠性 `<select>`（选项按 `ReliabilityLabel` 键序与文案，默认“未知”）；发布日期 / 有效期 `<input type="date">`（空 → null）；口径备注（空 → null）。
    - 提交：组装候选后做**一次**外部校验——`SourceNoteSchema.safeParse(note)` 加当前种类的输入字段（`IntakeFileMetaSchema` / `IntakeInputSchema.options[1].shape.url` / `IntakeInputSchema.options[2].shape.text`）。失败 → 显示对应提示，不调用 store；成功 → 把确定类型的 `IntakeSubmission` 交给 `intake.submit`。契约错误在面板内显示 `ErrorState`（`moduleId='intake-submit'`，原 error 原样；重试以同一提交再调一次）。
  - **测试 harness**（`intake.spec.ts`）：真实 Pinia + 真实 memory router + 真实 mock client，在系统边界对 `dataClient.submitIntake` / `listJobs` / `getJob` / `getStageWorkspace` 做透传 spy（同 jobs-store.spec 的 `connect` 做法）；File 用 `new File([...], name, {type, lastModified})` 构造，并在系统边界 spy `File.prototype.{text,arrayBuffer,stream,slice}` 与 `FileReader.prototype.readAs*`；不 `vi.mock` 内部模块。
  - **一律不改**：`stores/jobs.ts`、契约 / 生成物、页面文件（页面挂载归 T-C01a）、`shared/**`、`app/**`。
- **完成标准**（正负向）：
  1. 三种投放都能提交；白名单外的文件给出可操作提示（列出允许的扩展名），且不提交（AC-003-2 **最终**；AC-003-1 部分前置：同一投放流程组件）。
  2. 用途为空时有必填提示、不提交；可靠性 / 时效 / 口径随表单提交（AC-003-3 部分前置）。【r6.12】可靠性选项文案来自 `ReliabilityLabel`，默认 unknown；未填的日期 / 口径以 null 提交（透传 spy 断言 `submitIntake` 参数）。
  3. 不调用任何文件正文读取 API（File 只取 name / size / type / lastModified）（spec §4 持久化 / 隐私约束，无独立 AC；随 AC-009-1 全量回归）。【r6.12】上述 File / FileReader spy 均为 0 次；文本投放提交后 `localStorage["fai.jobs.v1"]` 不含正文字符串。
  4. `open('j-collect')` 后 `jobId='j-collect'`，随后 `router.push` 到其他路由也不改写；提交使用该快照；`open()` 后提交进入待归属池；`close()` 后 `isOpen=false`；提交成功后共享缓存经 `refresh()` 更新（AC-003-1、AC-003-5 部分前置；H-5）。【r6.12】`submit` 的参数类型不含 `jobId`（类型层 `@ts-expect-error` 断言）；成功时 `refresh` 恰一次（透传 spy 计 `listJobs`）、草稿复位；error 场景下 `submit` 以原 `ErrorResponse` reject、`refresh` 0 次、草稿保留；`close()` 后再 `open()`，未提交的草稿仍在。
  5. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI AC-003-2"`
  2. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI purpose required"`
  3. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI metadata only"`
  4. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI H-5 store"`
  5. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-C01a IntakeDrawer 非模态容器与页面级挂载（H-5；r6 从 T-C01 拆出）

- **状态**：未开始｜blocked_by: IMPL-GATE-R6（已满足）｜**r6.12：第五批第 6 项**。补采集区接线：新增 `CollectWorkspace.vue`，`StageWorkspace` 只对 collect 分发；依赖增 T-B04；预计 1 → 1.5 h，新增标准 / 命令 5（详情 / 列表回归）。Checklist R11 定向复核通过并提交前不得开码
- **预计**：1.5 h｜**依赖**：T-C01、T-B04
- **上下文**：plan §2.1 / §2.2（IntakeDrawer 为非模态抽屉，无遮罩、无焦点锁）；§3 挂载约定；v2 plan §7.3 H-5（根元素 `.glass-drawer`、填满壳提供的容器；不自设 `position: fixed`、遮罩、`aria-modal` 或焦点锁；关闭不导航、不调用 agent）。【r6.12】`ae592ba` 的 `StageWorkspace.vue` 只接收 `stage` 并渲染占位，详情页没有采集列表，也没有“详情页采集阶段”的入口；原 C01a 只写了“详情页采集阶段调用 `open(job.id)`”，没说入口和列表放在哪个组件。
- **修改范围**：新建 `jobs/stages/IntakeDrawer.vue`（根元素 `.glass-drawer`，宽高填满父容器；内含 IntakePanel，T-C02 / T-C03 再放入预览与待归属池；关闭按钮调用 `intakeStore.close()`）；`JobListPage` / `JobDetailPage` 各自在页面布局内提供容器，在 `isOpen` 时挂载 IntakeDrawer（互斥路由视图，§3）；投放入口：列表页调用 `open()`，详情页采集阶段调用 `open(job.id)`；扩充 `tests/component/jobs/intake.spec.ts`。
  【r6.12 精度（plan §2.1 / §2.2【r6.12】；逐文件写入许可）】
  - **`frontend/src/jobs/stages/IntakeDrawer.vue`**（新建）：根 `<aside class="glass-drawer intake-drawer" aria-label="投放抽屉">`，`width: 100%`、`height: 100%`、`min-width: 0`，内边距用既有间距令牌；不设 `position: fixed`、遮罩、`role="dialog"`、`aria-modal`、`inert` 或焦点锁。头部：`<h2>投放</h2>`；目标说明——快照为 null 时显示“未指定作业：提交后进入待归属池”，否则“目标作业：<jobId>”；“关闭”按钮 → `close()`。主体：`IntakePanel`。
  - **`frontend/src/jobs/pages/JobListPage.vue`**：在“新建作业”按钮旁加“投放”按钮 → `intake.open()`；`intake.isOpen` 时在页面 grid 内（筛选条之前）渲染 `<div class="intake-slot"><IntakeDrawer /></div>`。不改筛选 / 三态 / 创建面板逻辑。
  - **`frontend/src/jobs/pages/JobDetailPage.vue`**：根 section 内、状态分支之前（不随 `detailStatus` 变化）在 `isOpen` 时渲染同样的 `.intake-slot`；给 `StageWorkspace` 多传 `job` 与 `workspace` 两个 props。`watch` / `selectStage` / 三态 / 详情头 / T-B06 侧栏不改。
  - **`frontend/src/jobs/components/StageWorkspace.vue`**：props 改为 `{stage: Stage; job: DeepReadonly<Job>; workspace: DeepReadonly<StageWorkspace> | null}`。根 section、`aria-label="<阶段名>工作区"`、`<h2>` 不变。
    - `stage==='collect' && workspace?.stage==='collect'` → 渲染 `<CollectWorkspace :job :workspace>`；
    - `stage==='collect'` 但工作区尚未切到 collect（同作业切阶段的读取窗口）→ 只显示 `<p role="status">读取中…</p>`，不用 shared `Loading`，以免改变既有详情三态断言；
    - process / analyze / deliver 照旧显示占位文案“工作区内容由后续任务提供。”，不实现 D–F。
  - **`frontend/src/jobs/stages/CollectWorkspace.vue`**（新建）：props `{job: DeepReadonly<Job>; workspace: Extract<DeepReadonly<StageWorkspace>, {readonly stage: 'collect'}>}`，只读、不改写。
    - “投放到本作业”按钮 → `intake.open(job.id)`；
    - 采集列表 `<ul aria-label="采集列表">`，按 `workspace.uploads` 原序（契约已去掉 removed）每行显示：输入种类（文件 / 链接 / 文本）、文件名 / URL / “文本投放（正文未保存）”、用途、`ArtifactStatusBadge`（上传状态）；空列表显示“暂无投放。”。T-C02 / T-C03 再加预览与删除入口。
  - **避免既有断言歧义**：新组件不渲染 `h1`、`.job-*` 类名、`aria-current` / `aria-pressed`；按钮 / 区域名称不与“新建作业 / 作业详情 / X工作区 / 作业阶段 / 状态 / 类型 / 标题”重名或包含“侧栏”。
  - **一律不改**：`stores/jobs.ts`、`stores/intake.ts` 的已交付语义（本任务只消费）、`StageRail.vue`、契约 / 生成物、`shared/**`、`app/**`（AppShell / TopBar / nav / Rail）、`agent/**`、`main.ts`、`routes.ts`；既有 `job-list.spec.ts`（12）/ `job-detail.spec.ts`（13）/ `job-create.spec.ts`（5）/ `detail-stage` E2E（5）/ `list-create` E2E（1）用例。
- **完成标准**：
  1. 根元素带 `.glass-drawer`；组件自身不设 `position: fixed`、不渲染遮罩、没有 `aria-modal`、不锁焦点（AC-007-3 部分前置；H-5 容器约定）。
  2. `close()` 后当前路由不变，`agentClient.send` 的透传 spy 调用 0 次（AC-007-3 部分前置；H-5 关闭不导航、不调 agent）。
  3. 列表页与详情页采集阶段的入口按上述参数调用 `open`，抽屉渲染在页面容器内（AC-003-1 部分前置：本地入口）。【r6.12】详情页的入口在 `CollectWorkspace`；`StageWorkspace` 只对 collect 分发，process / analyze / deliver 仍为原占位；采集列表按 `workspace.uploads` 渲染种类 / 名称或 URL / 用途 / 状态徽，空列表显示“暂无投放。”；抽屉打开后从列表页导航到详情页（互斥路由重新挂载），抽屉仍显示打开时的 `jobId` 快照与未提交草稿，不变成新路由的上下文（AC-003-5 部分前置：采集列表）。
  4. 抽屉打开时页面其他区域仍可交互；工程门通过（AC-007-3、AC-009-1 部分前置）。
  5. 【r6.12】页面回归：`job-list.spec.ts`（12）、`job-detail.spec.ts`（13）、`job-create.spec.ts`（5）与 `detail-stage` / `list-create` 两份 E2E 全部通过，原例零删改（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI H-5 container"`
  2. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI H-5 close"`
  3. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI page mount"`
  4. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts -t "WI non-modal" && pnpm -C frontend typecheck && pnpm -C frontend lint`
  5. `pnpm -C frontend test:unit tests/component/jobs/job-list.spec.ts tests/component/jobs/job-detail.spec.ts tests/component/jobs/job-create.spec.ts && pnpm -C frontend test:e2e e2e/jobs/detail-stage.spec.ts e2e/jobs/list-create.spec.ts`

### T-C02 抽取预览、映射修正与抽取状态徽

- **状态**：未开始｜blocked_by: IMPL-GATE-R6（已满足）｜**r6.12：第五批第 7 项**。补接线：预览 / 映射挂在 IntakeDrawer，选中与确认经 intakeStore；依赖增 T-C01a；预计 1.5 → 2 h；命令 4 增 `intake.spec.ts` 回归（标准数不变）。Checklist R11 定向复核通过并提交前不得开码
- **预计**：2 h｜**依赖**：T-C01、T-C01a、T-A23
- **上下文**：spec R-003“修正后确认才入库”；plan §2.4 FieldMapping。【r6.12】原范围只列 `ExtractionPreview` / `MappingEditor` 两个新组件与测试，没写谁把预览挂进抽屉、谁调 `getIntakePreview`、确认后哪些视图怎样更新。代码事实：`confirmIntake` 回执里的 `upload` 已是确认后的记录（mapping = 修正值，status = ingested / quarantined），而 `preview.fields` 始终是提交时的合成字段；`getStageWorkspace` 的采集列表随 `jobsStore.refresh()` 重读。
- **修改范围**：新建 `jobs/stages/{ExtractionPreview,MappingEditor}.vue`；采集列表用 `UploadStatusLabel` 显示三种状态；新建 `tests/component/jobs/extraction-preview.spec.ts`。
  【r6.12 精度（plan §2.3【r6.12】；逐文件写入许可）】
  - **`frontend/src/jobs/stores/intake.ts`**（扩充，内部成员，不属 H-5）：
    - 只读 `selection: DeepReadonly<IntakeSelection> | null`、`previewStatus: 'idle'|'loading'|'ready'|'error'`、`previewError: ContractError | null`。`IntakeSelection = {upload: Upload; preview: ExtractionPreview; mapping: {sourceField: string; targetField: string; unit: string}[]}`，其中 `mapping` 是编辑中的映射草稿，**初值复制自 `upload.mapping`（当前已保存映射），不是 `preview.fields`**。
    - `submit` 成功时（在那一次 refresh 之前）写 `selection = {upload: 回执.upload, preview: 回执.preview, mapping: 复制回执.upload.mapping}`；`open()` 另清空 `selection` 与预览读状态（草稿不清）。
    - `selectUpload(upload: DeepReadonly<Upload>): Promise<void>`：置 `previewStatus='loading'` → `getIntakePreview(upload.id)` → 成功时一次写入 `selection`（upload 复制 + 预览 + mapping 复制）并置 ready；失败写 `previewError`（原 error）并置 error，自身 resolve（S-38 口径）。不加请求序号。
    - `editMapping(index: number, patch: Partial<{targetField: string; unit: string}>): void`（只改映射草稿）。
    - `confirm(mapping: FieldMapping): Promise<IntakeReceipt>`：`dataClient.confirmIntake(selection.upload.id, mapping)`。成功 → 先把 `selection` 换成回执的 `{upload, preview, mapping: 复制回执.upload.mapping}`（选中项立即显示 ingested / quarantined，不会停在旧的 pending）→ `await useJobsStore().refresh()` **恰一次** → resolve。失败 → 以原 `ErrorResponse` reject，`selection` 与映射草稿不变，不 refresh。
  - **`frontend/src/jobs/stages/ExtractionPreview.vue`**（新建）：读 `intake.selection`；显示识别类型、识别字段（`preview.fields`：源字段 → 目标字段 · 单位）、整体单位、时间范围（null 均显示“未知”，不伪造）、上传状态 `ArtifactStatusBadge`，有 `quarantineReason` 时显示“隔离原因：…”。
  - **`frontend/src/jobs/stages/MappingEditor.vue`**（新建）：编辑 `selection.mapping`（源字段只读，目标字段 / 单位为输入，经 `editMapping`）。“确认入库”按钮**只在** `upload.status === 'pending_validation' && !upload.removed` 时出现；点击时先 `FieldMappingSchema.safeParse(selection.mapping)` 一次（失败提示、不调用），成功 → `intake.confirm(解析结果)`；契约错误显示 `ErrorState`（`moduleId='intake-confirm'`）。非 pending 时只读显示已保存映射与状态徽 / 原因。
  - **`frontend/src/jobs/stages/IntakeDrawer.vue`**：在 `IntakePanel` 下方，`previewStatus` 为 loading → `Loading`、error → `ErrorState`（`moduleId='intake-preview'`，重试即对同一投放再 `selectUpload`）；`selection` 非 null → `ExtractionPreview` + `MappingEditor`。
  - **`frontend/src/jobs/stages/CollectWorkspace.vue`**：每行加“预览 / 修正”按钮 → 先 `intake.open(job.id)` 再 `intake.selectUpload(upload)`；状态徽旁显示 `quarantineReason`。
  - 新建 `frontend/tests/component/jobs/extraction-preview.spec.ts`（harness 同 T-C01；需要“mapping 与 `preview.fields` 不同的待验证投放”或 quarantined 样例时，经 `window.__FAI_MOCK__.jobFixtures` 在系统边界注入，覆盖会话只在内存）。
  - **不做**：待归属池 / 归入 / 删除（T-C03）、真实解析、启发式隔离、批量确认。
  - **一律不改**：`stores/jobs.ts`、契约 / 生成物、`StageWorkspace.vue` 的分发规则、页面文件、`shared/**`、`app/**`；T-C01 / T-C01a 已有用例。
- **完成标准**：
  1. 预览展示识别类型、字段 / 列映射、单位、时间范围；修改映射和单位之后，只有点击确认才调用 confirmIntake，之前状态保持为待验证（AC-003-4 **最终**）。【r6.12】null 单位 / 时间范围显示“未知”；编辑器初值等于 `upload.mapping`（以注入的、mapping 与 `preview.fields` 不同的待验证投放断言）；确认前 `confirmIntake` 透传 spy 为 0 次，确认时恰 1 次且参数为编辑后的映射。
  2. 待验证 / 已入库 / 隔离三种状态有文案和图标，隔离显示原因；去掉颜色后仍可区分（AC-003-6 **最终**）。【r6.12】采集列表行与预览两处都按 `UploadStatusLabel` 显示；非 pending 的投放没有“确认入库”按钮。
  3. 确认成功后经 `useJobsStore().refresh()` 刷新，采集列表与共享缓存中该作业摘要随之更新（AC-003-4 **最终**的组成部分；r6 H-2 ⑤）。【r6.12】成功：`selection.upload.status` 立即为 ingested（或注入样例的 quarantined）、`refresh` 恰一次（透传 spy 计 `listJobs` / `getJob`）、采集列表该行状态随之更新；再次选中该投放时编辑器显示已保存映射而非 `preview.fields`。失败（error 场景）：reject、`refresh` 0 次、`selection` 不变、面板显示可复制诊断。
  4. 工程门通过（AC-009-1 部分前置）。【r6.12】`intake.spec.ts` 整文件（T-C01 / T-C01a 用例）不回归。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-4"`
  2. `pnpm -C frontend test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-6"`
  3. `pnpm -C frontend test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI confirm refresh"`
  4. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-C03 待归属池、归入作业与删除来源确认

- **状态**：未开始｜blocked_by: IMPL-GATE-R6（已满足）｜开工前读 `review-batch3.md` R3-B（P3 后续观察，非新增标准；未修、未经风险接受）：对已删除投放再次 `removeUpload` 会重复追加 dataset 修订与 `remove_source` 事件，与 confirm / assign 对已删除者拒绝不一致；A 建议的最小修复与本任务或 T-A17 二选一落点，由实施时按 AGENTS §2 处理｜**r6.12：第五批第 8 项**。R3-B 落点定为 **T-A13a**（本任务依赖它；上句“二选一”为当时原文），本任务不改 `job-state.ts`；补池 / 删除接线与 store 动作；工时与标准数不变，命令 4 增回归。Checklist R11 定向复核通过并提交前不得开码
- **预计**：1.5 h｜**依赖**：T-C02、T-A13、T-C01a、T-A13a
- **上下文**：spec R-003 待归属池；plan §4.2 removeUpload 需要二次确认。【r6.12】代码事实：`listUnassignedUploads` 只返回未归属且未删除的记录；`getStageWorkspace` 的采集列表不含 removed；二者都不随 `jobsStore.refresh()` 之外的路径更新——池不在 jobsStore 内，须单独重读。
- **修改范围**：新建 `jobs/stages/UnassignedPool.vue`（列表、选择作业后归入；r6：挂在 IntakeDrawer 内、IntakePanel 下方，使任何挂载点（含 v2 AppShell）都能完成归属；可选作业取 `useJobsStore().jobs` 中状态属于 `ACTIVE_JOB_STATUSES` 者；归入 / 删除来源经 `intakeStore` action，成功后 `refresh()`）；采集列表中的删除来源入口和二次确认面板；新建 `tests/component/jobs/unassigned-pool.spec.ts`。
  【r6.12 精度（plan §2.3【r6.12】；逐文件写入许可）】
  - **`frontend/src/jobs/stores/intake.ts`**（扩充，内部成员）：
    - 只读 `pool: DeepReadonly<Upload[]>`、`poolStatus: 'idle'|'loading'|'ready'|'error'`、`poolError: ContractError | null`。
    - `loadPool(): Promise<void>`：`listUnassignedUploads()`；失败写 `poolError`、置 error，自身 resolve。
    - `assign(uploadId: string, jobId: string): Promise<WriteReceipt>`、`remove(uploadId: string, reason: string): Promise<WriteReceipt>`：失败以原 `ErrorResponse` reject，不刷新、不改缓存；成功时若 `selection?.upload.id === uploadId` 则清空 `selection`。
    - **写后刷新统一口径**（`submit` / `confirm` / `assign` / `remove` 四个写动作）：成功后 `await useJobsStore().refresh()` **恰一次**；随后若 `poolStatus !== 'idle'`（池已被加载过）再 `await loadPool()` 一次——池单独正常重读，不并入 jobsStore、不建事件总线 / 轮询 / 请求序号。
  - **`frontend/src/jobs/stages/UnassignedPool.vue`**（新建）：在 `IntakeDrawer` 中放在面板 / 预览之后；根 `<section aria-label="待归属池">`。挂载时 `useJobsStore().ensureJobs()`（详情页直达时也有作业可选）与 `intake.loadPool()`。每行：种类、名称 / URL、用途、状态徽（隔离显示原因）、`<select aria-label="归入作业">`（选项 = `jobsStore.jobs` 中 `status ∈ ACTIVE_JOB_STATUSES` 的作业，显示标题）、“归入”按钮（未选作业时禁用）→ `intake.assign`；读 / 写错误用 `ErrorState`（`moduleId='intake-pool'`）；空池显示“待归属池为空。”。
  - **`frontend/src/jobs/stages/IntakeDrawer.vue`**：挂入 `UnassignedPool`。
  - **`frontend/src/jobs/stages/CollectWorkspace.vue`**：每行加“删除来源”按钮 → 行内非模态 `<section aria-label="确认删除来源">`：理由 `<textarea>` 默认“来源不再适用”、可修改；“确认删除” / “取消”。理由校验复用契约 `dataMethods.removeUpload.params` 中的 reason schema（不另立规则）；确认 → `intake.remove(id, reason)`；取消 → 关闭面板，零调用；失败显示 `ErrorState`（`moduleId='intake-remove'`）。被删除的行在 refresh 后从当前列表消失（契约当前投影），历史仍保留 `remove_source`。
  - 新建 `frontend/tests/component/jobs/unassigned-pool.spec.ts`（harness 同 T-C01；透传 spy 覆盖 `listUnassignedUploads` / `assignUpload` / `removeUpload` / `listJobs` / `getJob`）。
  - **一律不改**：`job-state.ts` / 契约 / 生成物（R3-B 已归 T-A13a）、`stores/jobs.ts`、`StageWorkspace.vue`、页面文件、`shared/**`、`app/**`；T-C01 / C01a / C02 已有用例。
- **完成标准**：
  1. 池中列出未归属的投放，归入后从池中消失（AC-003-5 部分前置）。【r6.12】“归入作业”只列 `ACTIVE_JOB_STATUSES` 中的作业（normal 下不含 j-cancelled，含 j-failed）；详情页直达打开抽屉时同样可选作业。
  2. 删除来源：先取消确认 → 不调用 removeUpload；再确认 → 调用并带理由（AC-007-3 部分前置）。【r6.12】确认时 `removeUpload` 恰 1 次、参数为 (uploadId, 默认或修改后的理由)；成功后该行从采集列表消失，`listInterventions(jobId)` 仍含对应 `remove_source`（历史保留）。
  3. 归入或删除来源成功后经 `refresh()` 更新共享缓存：被归入作业在 `jobs` 中的摘要（`updatedAt` 与列表顺序）随之变化，无需手动重读（AC-003-5 部分前置；r6 H-2 ⑤）。【r6.12】每次成功写 `refresh` 恰一次、池随之单独重读一次；失败（error 场景）reject，`refresh` 与池重读均为 0 次。
  4. 工程门通过（AC-009-1 部分前置）。【r6.12】`intake.spec.ts`、`extraction-preview.spec.ts` 与 `job-state-pool.spec.ts` 整文件不回归。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/component/jobs/unassigned-pool.spec.ts -t "WI pool assign"`
  2. `pnpm -C frontend test:unit tests/component/jobs/unassigned-pool.spec.ts -t "WI remove confirm"`
  3. `pnpm -C frontend test:unit tests/component/jobs/unassigned-pool.spec.ts -t "WI assign refresh"`
  4. `pnpm -C frontend test:unit tests/component/jobs/intake.spec.ts tests/component/jobs/extraction-preview.spec.ts tests/unit/jobs/job-state-pool.spec.ts && pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-C04 采集端到端：页面入口、payload、待归属

- **状态**：未开始｜blocked_by: IMPL-GATE-R6（已满足）｜开工前读 `review-batch2.md` R2-C（P3 后续观察，非新增标准；若 R2-C 尚未在前序页面任务处理）｜R2-C 已于第四批技术关闭（`46e8fbe`）｜**r6.12：第五批末项**。依赖增 **T-B06**（标准 2 的介入历史展开取证）；只写 E2E，不写任何生产文件；标准 / 命令 / 工时不变。Checklist R11 定向复核通过并提交前不得开码
- **预计**：1.5 h｜**依赖**：T-C03、T-B04、T-B06（r6.12：增 T-B06）
- **上下文**：AC-003-1 的工作台入口和顶栏全局入口属于 v2（T-H01）；本任务只覆盖本 feature 的页面入口。【r6.12】原依赖不含 T-B06，而标准 2 要“核对介入历史展开内容”——这是本批要补的唯一隐含依赖；历史展开内容由 T-B06 的 `InterventionHistory` 提供，读方法由 T-A15a 提供。
- **修改范围**：新建 `e2e/jobs/intake.spec.ts`。
  【r6.12 精度】只新建该 E2E 文件；normal 场景，Playwright 自管 4173，不改 `playwright.config.ts`，不加窗口钩子 / 测试专用记录器；取证只读 `localStorage["fai.jobs.v1"]` 业务快照与页面可见内容。若 E2E 暴露生产缺陷，停下回报，不在本任务改生产文件或既有用例。
- **完成标准**：
  1. 端到端：作业列表和作业详情（采集阶段）的投放入口打开同一个 IntakePanel 流程，提交都走 submitIntake（AC-003-1 **本地子项**；工作台 / 顶栏子项 `blocked_by: frontend-workbench-v2`，由 T-H01 最终验收）。【r6.12】列表页“投放”打开的抽屉目标为“未指定作业”，提交后快照 `uploads.uploads` 新增该投放；`/jobs/j-collect/collect` 的“投放到本作业”打开同一抽屉、目标为 j-collect，提交后 `details['j-collect'].collect.uploads` 新增该投放并有对应 ingest 事件。
  2. 端到端：用途为空被拦下；正常提交后断言契约 payload 的 `sourceNote.purpose / reliability / publishedAt / validUntil / scopeNote`（取证途径：normal 场景 `fai.jobs.v1` 中 ingest 介入与 Upload 记录，并核对介入历史展开内容；不新增窗口钩子）（AC-003-3 **最终**）。【r6.12】空用途时出现必填提示、快照不新增投放；经详情页（j-collect）投放后，ingest 事件 `payload.sourceNote` 与 Upload 记录的 `sourceNote` 五项都等于输入；展开详情页“介入历史”并展开该 ingest 条目，可见用途、可靠性中文文案（`ReliabilityLabel`）、发布日期 / 有效期 / 口径（未填时显示“未知” / “无”，不伪造）。
  3. 端到端：在列表页无作业投放 → 进入待归属池 → 归入某作业 → 出现在该作业的采集列表（AC-003-5 **最终**）。【r6.12】归入后该投放从待归属池消失；进入 `/jobs/j-collect/collect` 时其采集列表含该投放与状态徽。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-1 local"`
  2. `pnpm -C frontend test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-3"`
  3. `pnpm -C frontend test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-5"`

### D 处理台

### T-D01 处理台渲染、来源回溯与三态

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
- **预计**：2 h｜**依赖**：T-D01、T-B06（r6.12：标准 1 断言“介入历史出现 kind=recipe”，显式依赖介入历史界面；标准 / 工时不变）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
- **预计**：1.5 h｜**依赖**：T-E02、T-A18、T-A22b、T-B06（r6.12：标准 2 断言“介入历史只多一条事件”，显式依赖介入历史界面；标准 / 工时不变）
- **上下文**：spec R-005；S-15。抽屉上下文标签归 v2（T-H02）。
- **修改范围**：新建 `jobs/stages/RuleCandidatePanel.vue`（非模态；提交 pin_rule）；`InterventionComposer` 的追问在 submitIntervention 之后调用 `agentClient.send({message, jobContext})`（只从 `contracts/index.ts` 导入；不带 sessionId，基线 mock 为其分配独立 mock session，抽屉时间线仍回放——r6.1，R7 S-30，只是措辞对齐，不改行为）；上下文读取 T-A22b 的只读 `useSessionStore().context`（本 feature 的 jobs 代码不导入 `agent/store.ts`）；新建 `tests/component/jobs/rule-candidate.spec.ts`，扩充 `e2e/jobs/analyze.spec.ts`。
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前读 `review-batch2.md` R2-C（P3 后续观察，非新增标准；若 R2-C 尚未在前序页面任务处理）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
- **预计**：1.5 h｜**依赖**：T-F01、T-B06（r6.12：标准 1 断言“介入历史出现三条 framework 事件”，显式依赖介入历史界面；标准 / 工时不变）
- **上下文**：spec R-006 块批注（线程，未解决 / 已解决）。
- **修改范围**：新建 `jobs/stages/BlockCommentThread.vue`；新建 `e2e/jobs/deliver-comments.spec.ts`。
- **完成标准**：
  1. 端到端：新建批注 → 回复 → 标记已解决，线程状态由“未解决”变为“已解决”，介入历史出现三条 framework 事件（AC-006-3 **最终**）。
  2. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/deliver-comments.spec.ts -g "WI AC-006-3"`
  2. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-F04 版本历史与历史版本只读查看

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜阅读提示（Converge batch4 观察 O-B4-1，待第四批 Review 判定，非新增标准）：JobCard / 详情 canonical 与选阶段的路由对象不带当前 query，而 mock `agentScript` 在每次 send 时重读 URL；e2e 宜直开带 stage 的深链或用 `window.__FAI_MOCK__.agentScript`，避免先应用内导航再 send 时脚本静默回落
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
- **预计**：2 h｜**依赖**：T-A21、T-B04
- **上下文**：plan §2.3（角标在列表卡 + 详情阶段轨道；首页作业轨道归 v2）。
- **修改范围**：新建 `jobs/components/InboxDrawer.vue`（非模态；打开前请求、打开后对本次展示的 id 一次性 markInboxRead）；`stores/inbox.ts`（`markRead(ids)` 成功后 `useJobsStore().refresh()`，§1-9）；JobCard 和 StageRail 的角标（计数取自契约）；新建 `tests/component/jobs/inbox.spec.ts`、`e2e/jobs/inbox.spec.ts`。
- **完成标准**（正负向）：
  1. 端到端（job-running 的 j-human）：列表卡和阶段轨道出现角标；打开收件箱后角标清除，条目仍可见；之后新产生的条目仍为未读（AC-007-4 **本地子项**；**首页作业轨道角标** `blocked_by: frontend-workbench-v2`，由 T-H03 最终验收）。
  2. 组件：已读但未解决的条目，其冲突 / 待合并状态徽仍然显示（AC-007-4 部分前置）。
  3. `markRead` 成功后共享缓存中该作业的 `pendingCount` 经 `refresh()` 更新，无需手动重读（AC-007-4 部分前置；r6 H-2 ⑤）。
  4. 工程门通过（AC-009-1 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/inbox.spec.ts -g "WI AC-007-4 local"`
  2. `pnpm -C frontend test:unit tests/component/jobs/inbox.spec.ts -t "WI read not resolved"`
  3. `pnpm -C frontend test:unit tests/component/jobs/inbox.spec.ts -t "WI markRead refresh"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

### T-G03 非模态与破坏性确认审计

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜开工前读 `review-batch3.md` R3-C（P3 后续观察，非新增标准；未修、未经风险接受）：`removeItem` 抛错时 `resetMockData` 以非契约形态拒绝，横幅“重置样例”按 `ErrorResponse` 处理前须先定口径（A 建议按 degraded 或转 `adapter_error`，plan §3 补一句）
- **预计**：1.5 h｜**依赖**：T-A11、T-B01、T-B04、T-C01a
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜阅读提示（Converge batch4 观察 O-B4-1，待第四批 Review 判定，非新增标准）：应用内导航不透传 `?scenario=`，会话内场景不变，但点击后 reload 会回落 normal；遍历用例以直开 + 断言为主，若 Review 判为须修则以其登记的补修任务为准
- **预计**：1.5 h｜**依赖**：T-G01、T-G02、T-G04、T-B05、T-E01、T-F07
- **上下文**：AC-008-2 要求场景切换可用，并被端到端测试使用。
- **修改范围**：新建 `e2e/jobs/scenarios.spec.ts`。
- **完成标准**：
  1. 端到端：normal / empty（含 `/jobs/j-collect/collect` 显示“暂无作业”）/ error（含可复制诊断）/ slow（先见加载态）/ boot-error（重试后进入作业页）/ job-running / job-pending-merge / job-conflict / job-delivered 各打开一次，断言该场景的关键界面（AC-008-2 **最终**；单测部分见 T-A09 / T-A10）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/scenarios.spec.ts -g "WI AC-008-2"`

### T-G06 静态守卫与契约文档对拍收口

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜收口时复核 `review-batch-a09a.md` R-C 与 `review-batch2.md` R2-A（P3 后续观察，非新增标准；把方法 describe 中的 mock 场景句迁回 `jobScenarios`）
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
- **预计**：1 h｜**依赖**：T-G03
- **上下文**：spec §4 环境基准（1440×900，断点 960 / 980 / 1240 / 1400 / 1500）；plan e2e“窄窗口不回归”；为 M-10 人工验收准备。
- **修改范围**：新建 `e2e/jobs/layout.spec.ts`（作业列表 / 详情四个阶段在 960 与 1440×900 下没有水平溢出，阶段轨道和侧栏可见或可达）。
- **完成标准**：
  1. 端到端：两种视口下没有水平滚动条，关键控件可达（AC-009-1 部分前置；为 M-10 准备）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/layout.spec.ts`

### T-G08 人工验收清单 manual-acceptance.md

- **状态**：未开始｜blocked_by: IMPL-GATE-R6
- **预计**：1 h｜**依赖**：T-G07
- **上下文**：plan §2.5 M-01～M-10；AC-009-2 要求清单存在，每项有“看什么”。本任务**只写清单，不声称已有截图**。
- **修改范围**：新建 `specs/workbench-interaction/manual-acceptance.md`（M-01～M-10，每项写：关联 AC、前置（场景 / 视口 / 路由）、操作步骤、看什么、截图输出路径 `specs/workbench-interaction/assets/manual/M-xx-<slug>.png`（**待 Handoff 生成**）、结果栏（空））；新建 `tests/unit/jobs/manual-acceptance.spec.ts`（结构校验：十项齐全、每项有“看什么”和截图路径）。
- **完成标准**：
  1. 清单存在，十项都有可执行步骤和“看什么”；结果栏为空，不含伪造截图（AC-009-2 部分前置）。
- **验证命令**：
  1. `pnpm -C frontend test:unit tests/unit/jobs/manual-acceptance.spec.ts -t "WI AC-009-2"`

### T-G09 一条命令全量自动化检查

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜【r6.11 草案，待 Walter §5.1 批准】依赖增 T-B04a：全量检查及其后的 T-H04 复验，须等 R4-A 修复完成后再执行；本行不改本任务标准 / 命令 / 工时
- **预计**：1 h｜**依赖**：T-G06、T-G07、T-G08、T-B04a（r6.11 草案）
- **上下文**：AC-009-1；沿用 frontend-workbench 的 `pnpm test`，不新增命令或工具。
- **修改范围**：不改 `package.json` 的脚本（`test` 已串起全部检查）；把执行输出摘要（检查项 / 单测数 / e2e 数 / exit code）登记到后续 Converge / Handoff 记录（`specs/workbench-interaction/review.md`，Handoff 阶段创建）。
- **完成标准**：
  1. `pnpm -C frontend test` exit 0，覆盖 check（六项）、typecheck、lint、全部单测（含 frontend-workbench 既有用例）和全部 e2e（AC-009-1 **最终**；v2 集成之后由 T-H04 复跑）。
- **验证命令**：
  1. `pnpm -C frontend test`

### T-G10 人工验收执行与截图（Handoff 阶段）

- **状态**：未开始｜blocked_by: IMPL-GATE-R6｜M-01 前确认 `review-batch2.md` R2-C 已处理或登记（P3 后续观察，非新增标准）
- **预计**：2 h｜**依赖**：T-G09；另需工作流闸门：Converge 报告、Review、Gate 2（AGENTS §2；spec AC-009-2“Handoff 附截图”）
- **上下文**：v2 未交付时能否分阶段 Handoff，由 Walter 在 Gate 2 决定；本文件不预设。
- **修改范围**：按 manual-acceptance.md 执行 M-01～M-10，截图保存到 `specs/workbench-interaction/assets/manual/`，并填写结果栏；在 review.md 引用截图。
- **完成标准**：
  1. 十项都有截图和结论（AC-009-2 **最终**；AC-001-5 / AC-006-1 的人工部分 M-01 / M-05 在此验收）。
- **验证命令**：
  1. 手动：逐项对照清单检查“看什么”；`ls specs/workbench-interaction/assets/manual/` 应列出 M-01～M-10 的截图；复跑 `pnpm -C frontend test:unit tests/unit/jobs/manual-acceptance.spec.ts`。

### H v2 集成验证（只清理本 feature 页面级抽屉挂载 + 集成验证，不改壳方代码）

### T-H01 全局投放入口集成验证

- **状态**：未开始｜blocked_by: IMPL-GATE-R6、**frontend-workbench-v2**
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

- **状态**：未开始｜blocked_by: IMPL-GATE-R6、**frontend-workbench-v2**
- **预计**：1 h｜**依赖**：T-E03、T-G09
- **上下文**：v2 在 agent store / 抽屉中消费 jobContext。
- **修改范围**：扩充 `e2e/jobs/integration-v2.spec.ts`（抽屉部分）。
- **完成标准**：
  1. 端到端：在作业内发起追问后，对话抽屉显示作业 id / 标题和阶段的上下文标签；mock 事件流可以回放；切页后同一 run 的标签不漂移（AC-005-5 **最终**）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-005-5"`

### T-H03 首页作业轨道角标集成验证

- **状态**：未开始｜blocked_by: IMPL-GATE-R6、**frontend-workbench-v2**
- **预计**：1 h｜**依赖**：T-G02、T-G09
- **上下文**：v2 的首页作业轨道消费同一套 listInbox 计数。
- **修改范围**：扩充 `e2e/jobs/integration-v2.spec.ts`（首页轨道部分）。
- **完成标准**：
  1. 端到端：首页作业轨道出现待处理角标，数量与列表卡一致；查看收件箱后清除（AC-007-4 **最终**）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-007-4"`

### T-H04 v2 集成后路由共存与全量回归

- **状态**：未开始｜blocked_by: IMPL-GATE-R6、**frontend-workbench-v2**
- **预计**：1 h｜**依赖**：T-H01、T-H02、T-H03
- **上下文**：plan §2.1（具名 `jobs` 记录替换壳方由导航生成的同名占位，不能出现双路由）。
- **修改范围**：扩充 `e2e/jobs/integration-v2.spec.ts`（导航到 `/jobs` 的路由共存）；复跑全量。
- **完成标准**：
  1. 端到端：从 v2 导航的“作业”进入的是本 feature 的列表页，`/jobs` 只有一条路由记录（AC-002-2 回归）。
  2. 全量检查复跑 exit 0，Converge 可据此解除外部阻塞（AC-009-1 复验）。
- **验证命令**：
  1. `pnpm -C frontend test:e2e e2e/jobs/integration-v2.spec.ts -g "WI routes coexist"`
  2. `pnpm -C frontend test`

## 5. AC 覆盖矩阵（46 条；r6 / r6.9 更新部分前置列，最终任务与命令不变；【r6.11 草案，待 Walter §5.1 批准】AC-002-2 最终列增 T-B04a，原 T-B04 承接与命令保留）

【r6.12（第五批派工准备）】只改部分前置列，最终任务与最终命令不变：AC-003-3 增 A01a / B06；AC-003-5 增 C01a；AC-007-1 的 A15 换为 A15a（原 T-A15 标准 4 移交）；AC-007-3 增 A13a；AC-008-1 增 A01a；AC-008-2 / AC-008-3 增 A15a。上方标题中的“【r6.11 草案，待批】”已于 r6.11 生效。

“部分前置”= 为该 AC 提供契约 / 状态层 / 组件前提，不单独构成验收；“最终”= 该 AC 的验收任务与命令。外部阻塞子项未解除前，Converge 必须报“未收敛（外部阻塞）”。

| AC | 部分前置任务 | 最终验收任务 | 最终验证命令 | 外部阻塞子项 |
|---|---|---|---|---|
| AC-001-1 | A02、A07、A22、A22a、A22c、A23 | T-B01 | `test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-1"` | — |
| AC-001-2 | A07、A10、A22a、A22c | T-B02 | `test:unit tests/component/jobs/job-list.spec.ts -t "WI AC-001-2"` | — |
| AC-001-3 | A12、A22a、B04 | T-B03 | `test:e2e e2e/jobs/list-create.spec.ts -g "WI AC-001-3"` | — |
| AC-001-4 | A05、A10、A22c、A22d、B01 | T-B04 | `test:unit tests/component/jobs/job-list.spec.ts tests/component/jobs/job-detail.spec.ts -t "WI AC-001-4"` | — |
| AC-001-5 | A01、B01 | T-A23（组件）+ T-G10（M-01 人工） | `test:unit tests/component/jobs/badges.spec.ts -t "WI status badges"`；M-01 | — |
| AC-002-1 | A02、A22d | T-B04 | `test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-1"` | — |
| AC-002-2 | A22、A22d | T-B04 + T-B04a（r6.11 草案：R4-A 延迟路径，与 B04 共同承接；v2 后由 T-H04 回归） | `test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-2"`；R4-A：`test:unit tests/component/jobs/job-detail.spec.ts -t "WI R4-A"`、`test:e2e e2e/jobs/detail-stage.spec.ts -g "WI R4-A"` | — |
| AC-002-3 | A07 | T-B05 | `test:e2e e2e/jobs/detail-stage.spec.ts -g "WI AC-002-3"` | — |
| AC-002-4 | A20、A22a、B06 | T-B07 | `test:e2e e2e/jobs/rerun.spec.ts -g "WI AC-002-4"` | — |
| AC-002-5 | A02、A07、A09b、A10、A13、A17、A18、A20 | T-B05 | `test:unit tests/component/jobs/job-detail.spec.ts -t "WI AC-002-5"` | — |
| AC-003-1 | C01、C01a、C04（本地子项） | **T-H01** | `test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-003-1"` | 工作台入口 / 顶栏全局投放（v2） |
| AC-003-2 | A03、A12 | T-C01 | `test:unit tests/component/jobs/intake.spec.ts -t "WI AC-003-2"` | — |
| AC-003-3 | A01a、A03、A11、A12、B06、C01 | T-C04 | `test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-3"` | — |
| AC-003-4 | A12 | T-C02 | `test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-4"` | — |
| AC-003-5 | A13、C01、C01a、C03 | T-C04 | `test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-5"` | — |
| AC-003-6 | A01、A12、A23 | T-C02 | `test:unit tests/component/jobs/extraction-preview.spec.ts -t "WI AC-003-6"` | — |
| AC-004-1 | A03 | T-D01 | `test:unit tests/component/jobs/process.spec.ts -t "WI AC-004-1"` | — |
| AC-004-2 | A05、A14 | T-D02 | `test:e2e e2e/jobs/process.spec.ts -g "WI AC-004-2"` | — |
| AC-004-3 | A03、A14 | T-D03 | `test:unit tests/component/jobs/reconciliation.spec.ts -t "WI AC-004-3"` | — |
| AC-004-4 | A14 | T-D03 | `test:unit tests/component/jobs/reconciliation.spec.ts -t "WI AC-004-4"` | — |
| AC-004-5 | A05、A09b、A10 | T-D01 | `test:unit tests/component/jobs/process.spec.ts -t "WI AC-004-5"` | — |
| AC-005-1 | A03、A23 | T-E01 | `test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-1"` | — |
| AC-005-2 | A03 | T-E01 | `test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-2"` | — |
| AC-005-3 | A06、A15 | T-E02 | `test:e2e e2e/jobs/analyze.spec.ts -g "WI AC-005-3"` | — |
| AC-005-4 | A06、A15 | T-E03 | `test:unit tests/component/jobs/rule-candidate.spec.ts -t "WI AC-005-4"` | — |
| AC-005-5 | A09a、A18、A22b、E03（本地子项） | **T-H02** | `test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-005-5"` | 抽屉作业 / 阶段上下文标签（v2） |
| AC-005-6 | A05、A07、A09b、A10 | T-E01 | `test:unit tests/component/jobs/analyze.spec.ts -t "WI AC-005-6"` | — |
| AC-006-1 | A04 | T-F01（自动）+ T-G10（M-05 人工） | `test:unit tests/component/jobs/deliver-blocks.spec.ts -t "WI AC-006-1"`；M-05 | — |
| AC-006-2 | A16 | T-F02 | `test:unit tests/component/jobs/block-editor.spec.ts -t "WI AC-006-2"` | — |
| AC-006-3 | A16 | T-F03 | `test:e2e e2e/jobs/deliver-comments.spec.ts -g "WI AC-006-3"` | — |
| AC-006-4 | A05、A16 | T-F04 | `test:e2e e2e/jobs/deliver-history.spec.ts -g "WI AC-006-4"` | — |
| AC-006-5 | A24 | T-F05 | `test:unit tests/component/jobs/diff-view.spec.ts -t "WI AC-006-5"` | — |
| AC-006-6 | A19、A22a | T-F06 | `test:e2e e2e/jobs/deliver-revision.spec.ts -g "WI AC-006-6"` | — |
| AC-006-7 | A04、A08、A09b、A17、A19、A20、F01 | T-F07 | `test:e2e e2e/jobs/deliver-finalize.spec.ts -g "WI AC-006-7"`（finalize + pending reject） | — |
| AC-006-8 | A01、A23 | T-F01 | `test:unit tests/component/jobs/deliver-blocks.spec.ts -t "WI AC-006-8"` | — |
| AC-007-1 | A02、A06、A08、A09b、A15a | T-B06 | `test:unit tests/component/jobs/intervention-history.spec.ts -t "WI AC-007-1"` | — |
| AC-007-2 | A05、A14、A18、A20、A22a、D02 | T-G01 | `test:e2e e2e/jobs/pending-merge.spec.ts -g "WI AC-007-2"` | — |
| AC-007-3 | A13、A13a、B03、B05、C01a、C03、D02、E02、F02 | T-G03 | `test:e2e e2e/jobs/confirm-modal.spec.ts -g "WI AC-007-3"` | — |
| AC-007-4 | A21、G02（本地子项） | **T-H03** | `test:e2e e2e/jobs/integration-v2.spec.ts -g "WI AC-007-4"` | 首页作业轨道角标（v2） |
| AC-007-5 | A23 | T-G06 | `check --only glass` | — |
| AC-008-1 | A01、A01a、A02、A04、A06、A08、A09a | T-G06 | `test:unit tests/unit/jobs/contract-doc.spec.ts` | — |
| AC-008-2 | A07、A09、A10、A11、A12、A15a、A21、G04 | T-G05 | `test:e2e e2e/jobs/scenarios.spec.ts -g "WI AC-008-2"` | — |
| AC-008-3 | A10、A15a、A22a | T-G06 | `check --only network` | — |
| AC-008-4 | A09 | T-G06 | `contract --check && check --only generated && test:unit tests/unit/jobs/contract-version.spec.ts` | — |
| AC-009-1 | G07；以及每个任务的工程门（typecheck / lint / 生成物一致） | T-G09（v2 后 H04 复验） | `pnpm -C frontend test` | — |
| AC-009-2 | G08 | T-G10（Handoff） | 手动截图 + `test:unit tests/unit/jobs/manual-acceptance.spec.ts` | — |

（表中命令省略了 `pnpm -C frontend` 前缀；完整写法见各任务。schema / 单测只作为“部分前置”，不冒充端到端验收。）

## 6. 依赖 DAG 与预估

- 组序：A（T-A01→T-A24）→ B → C → D → E → F → G → H；r6 新增任务用字母后缀插在其依赖之后（T-A09a 在 T-A09 后、T-A22a / T-A22b 在 T-A22 后、T-C01a 在 T-C01 后；r6.4 的 T-A09b 在 T-A09a 后、T-A10 前），排序规则为“T-Xnn < T-Xnna < T-Xnnb < T-Xnnc < T-X(nn+1)”（r6.8：T-A22c 在 T-A22b 后、T-A23 前）；每个任务只依赖排序在它之前的任务，无环（Analyze R6 用脚本复核）。【r6.9】排序规则扩为“… < T-Xnnc < T-Xnnd < T-X(nn+1)”，T-A22d 在 T-A22c 后、T-A23 前。上句“每个任务只依赖排序在它之前的任务”自 r6.9 起有**唯一一条有意回边**：T-B03 → T-B04（T-B03 端到端须核对 T-B04 的详情页回显；保留编号，执行顺序 B04 先于 B03）。真实拓扑仍无环，脚本按依赖图做环检测，不以编号前向冒充无环（Analyze R16）。
- 主干：A01 → A02/A03 → A04 → A05 → A06 → A07 → A08 → A09 → {A09a, A10} → A11 → {A12→A13, A14, A15, A16} → A17 → A18（另依赖 A09a）→ {A19, A20} → A21；A22 依赖 A01（r6，原依赖 A10）；A22a 依赖 A09a / A10 / A12 / A22；A22b 依赖 A02 / A22；A22c 依赖 A22a（r6.8）；A23 依赖 A01；A24 无依赖。r6.4：A09b 依赖 A08（fixture-only，与状态层无耦合），A10 依赖 A09 / A09b（即主干为 A08 → {A09, A09b}、A09 → A09a、{A09, A09b} → A10）。
- UI：B01 依赖 A10 / A22 / A22a / A22c / A23；B02 依赖 B01 / A22c（r6.8）；【r6.9】A22d 依赖 A10 / A22a / A22c，B04 依赖 B01 / A22d，B03 依赖 B01 / A12 / B04（有意回边）；C01 依赖 A22 / A12 / A22a，C01a 依赖 C01，C03 另依赖 C01a；E03 另依赖 A22b；G04 依赖 C01a；C、D、E、F 都以 B04 为入口；G03 / G05 / G06 收口；H 只依赖 C04 / E03 / G02 / G09，外加 v2 外部闸门；H 组只清理本 feature 页面级抽屉挂载（T-H01）并做集成验证，不改壳方。
- H-x 切片最早可交接点（仅指依赖链，仍须 IMPL-GATE-R6 与四项交接登记）：H-2·标签 = A01 + A23；H-3·路由切片 = A22（只依赖 A01）；H-1 = A09a；H-4 = A22b；H-2·列表 = A22a + A22c（r6.8）；H-5 = C01 + C01a；H-6 场景 / 覆盖部分 = A11 之后、角标样例 = A21 之后；页面切片 = C04 之后。r6.4：T-A10 新增祖先 T-A09b，凡依赖链经过 A10 的切片（H-2·列表、H-6、页面切片）随之多一个祖先；A09b 不是任何切片的提供任务、不形成 ①～④ 任何一项，各切片交付状态不变（仍全部未交付，H-1 维持“待消费方集成”）。
- r6.3：T-A10 增标准 / 命令 5（R-B），原工程门顺延为 6；合计完成标准 / 验证命令 **221 / 221**（r6.2 为 220 / 220）；任务数、工时、依赖不变。第二批 = T-A10 → {T-A22 → T-A22b}、T-A23、T-A24（同一实施树串行）。
- r6.4（Checklist R8 B-12）：新增 T-A09b（0.5 h，3 条标准 / 命令）；T-A10 仍 6 / 6、2 h，只改依赖（+T-A09b）与标准 / 命令 5 的内容；合计完成标准 / 验证命令 **224 / 224**（脚本复算，见 analyze.md「Analyze R10」）。第二批 = T-A09b → T-A10；T-A22 → T-A22b；T-A23、T-A24（6 项，约 7 h；同一实施树串行）。
- r6.8（第三批 Review R3-A 的 Converge 补修，AGENTS §2 第 9 步）：新增 T-A22c（0.5 h，3 条标准 / 命令，依赖 T-A22a），B01 / B02 各增依赖 T-A22c；T-A22c 进入 AC-001-1 / AC-001-2 / AC-001-4 部分前置，是三者最终任务（B01 / B02 / B04）的祖先。合计 **68 个任务、约 102.5 h**（A 29 个 43.5 h，其余组不变）；完成标准 / 验证命令 **227 / 227**（脚本复算，见 analyze.md「Analyze R14」）。下行 r6.4 合计为当时原文。
- r6.9（第四批开工前精度）：新增 T-A22d（1 h，4 条标准 / 命令，依赖 A10 / A22a / A22c；自原 T-B04 的 store 部分拆出），T-B01 预计 1.5 → 2 h 并增标准 / 命令 3（R2-C），T-B03 增依赖 T-B04，T-B04 依赖改为 B01 / A22d（预计仍 2 h）。矩阵：A22d 进入 AC-001-4 / AC-002-1 / AC-002-2 部分前置，B04 进入 AC-001-3，B01 进入 AC-001-5。合计 **69 个任务、约 104 h**（A 30 个 44.5 h / B 7 个 11 h，其余组不变）；完成标准 / 验证命令 **232 / 232**（脚本复算，见 analyze.md「Analyze R16」）。第四批 = T-B01 → T-B02 → T-A22d → T-B04 → T-B03（5 项，约 7.5 h，17 条命令）。上行 r6.8 与下行 r6.4 的合计为当时原文。
- 【r6.11 草案，待 Walter §5.1 批准，不生效】第四批 Review（`review-batch4.md` 原件 `9812f64`）未通过，唯一 P2 = R4-A。新增 **T-B04a**（0.5 h，3 条标准 / 命令，依赖 T-B04 / T-B03 的已实施代码，`blocked_by: Walter §5.1 批准`），排在 T-B04 之后、T-B05 之前；编号前向（T-B04a 在 T-B04 后、T-B05 前），不新增回边。T-B04a 与 T-B04 共同作为 AC-002-2 的最终任务（原 B04 的正常路径承接与命令保留）；T-G09 增依赖 T-B04a，使全量检查与 T-H04 复验都在修复之后执行。原 5 个任务的标准 / 命令 / 工时不改。合计 **70 个任务、约 104.5 h**（A 30 / 44.5、B 8 / 11.5，其余组不变）；完成标准 / 验证命令 **235 / 235**；唯一有意编号回边仍为 T-B03 → T-B04（见 analyze.md「Analyze R18」）。上行 r6.9 的合计为当时原文。
- 【r6.12（第五批开工前机制精度；未审核、未实施）】新增 **T-A01a**（0.5 h，3 条标准 / 命令，依赖 A01）、**T-A13a**（0.5 h，3 条，依赖 A13）、**T-A15a**（0.5 h，3 条，依赖 A13；自 T-A15 拆出，原 A15 标准 / 命令 4 移交）。T-A15 1.5 → 1 h、标准 / 命令 5 → 4；T-B06 1.5 → 2 h、2 → 3，依赖 T-A15 → T-A15a + T-A01a；T-C01 依赖 + T-A01a；T-C01a 1 → 1.5 h、4 → 5，依赖 + T-B04；T-C02 1.5 → 2 h，依赖 + T-C01a；T-C03 依赖 + T-A13a；T-C04 依赖 + T-B06；T-A17 依赖 + T-A15a；T-D02 / T-E03 / T-F03 依赖 + T-B06（其标准已引用介入历史）。排序：T-A01a 在 A01 后、A02 前；T-A13a 在 A13 后、A14 前；T-A15a 在 A15 后、A16 前。所有新依赖都按编号前向，**不新增回边**（T-A15 不依赖 T-A15a）；唯一有意回边仍为 T-B03 → T-B04，真实拓扑无环。合计 **73 个任务、约 107 h**（A 33 / 45.5、B 8 / 12、C 5 / 8.5，其余组不变）；完成标准 / 验证命令 **245 / 245**（脚本复算，见 analyze.md「Analyze R21」）。第五批 = T-A01a → T-A13a → T-A15a → T-B06 → T-C01 → T-C01a → T-C02 → T-C03 → T-C04（9 项，约 12 h，33 条命令）。上行 r6.11 与下行 r6.4 的合计为当时原文。
- 合计 **67 个任务、约 102 h**（r6.4；A 28 个 43 h / B 7 个 10.5 h / C 5 个 7.5 h / D 3 个 5 h / E 3 个 5.5 h / F 7 个 12 h / G 10 个 14.5 h / H 4 个 4 h）。r5 为 62 个 / 96.5 h；r6 增量：新增 T-A09a 1 h、T-A22a 1.5 h、T-A22b 1 h、T-C01a 1 h；T-A09 1.5→2 h、T-A21 1.5→2 h、T-A18 2→1.5 h；T-A22、T-C01 预估不变（拆出部分与新增部分相当）。r6.4 增量：新增 T-A09b 0.5 h（r6～r6.3 为 66 个 / 101.5 h）。所有任务 `blocked_by: IMPL-GATE-R6`；H 组（4 个任务、4 h）另 `blocked_by: frontend-workbench-v2`。

## 7. Converge 口径

- AC-003-1、AC-005-5、AC-007-4 的 v2 子项（T-H01～T-H03）未解除之前，Converge 必须报“**未收敛（外部阻塞）**”，不得报全量完成。
- D-019 的角色 / 成本、剪藏预览、复核结果、验证队列不计入本 feature。
- 实施期粒度（S-22）：T-A18 / T-A19 / T-A20 等顶格 2 h 任务若实际超过 2 h，按 AGENTS §2 第 9 步在本文件追加拆分任务并记录原因（如把 T-A18 拆为“上下文登记 + 事件投递”与“overlay / 终态合并”），不硬塞；拆分不改 AC 与范围，若涉及需求变化则回 Clarify。当前全部任务未开始，r5 不预先重拆。r6.4（Checklist R8 B-12）：本条只是实施期**兜底**，不得用来预先吸收 Tasks 阶段已知的超额——已知超额须在 Tasks 阶段拆分（如 R-B 由 T-A10 拆出为 T-A09b），不以“超 2 h 再停下”代替。
- 如果 implementation_base_sha 下前端的实际情况与 §0 不符（脚本名、生成器结构、既有测试的硬编码），先修订本文件、重跑 Analyze，并经 A 复核；不得直接在实施中偷换。r6 已在 `43b6d79` 完成该重核（§0.0）；实现分支建立时若基线再变（例如集成人带入其他提交），须再次按本条重核。
- H-x 交接（r6）：某切片的提供任务全部完成后，由本 feature 实施者给出生产实现固定 commit 与定向测试命令 / 输出摘要，引用当时已提交的有效 Checklist SHA，经集成人集成后登记集成 SHA，四项齐全才在 interface-handoff.md §1 标“已交付”；任一项缺失即“未交付”。设计对拍通过、任务完成或本地测试绿都不等于已交付。Converge 不以 H-x 交付状态替代本 feature 自身 AC 的验收。
- 写后统一刷新核对（r6.1，R7 S-31；Converge 核对项，不新增任务或机制）：Converge 时逐写路径核对“成功后恰一次 `refresh()`、失败不刷新”——除已有定向断言的 T-C01（submit）/ T-C02（confirm）/ T-C03（assign / remove）/ T-G02（markRead）/ T-A22a（createJob）外，逐一核对 `submitIntervention`（T-E02 / E03；v2 H-2 ⑤ 点名）、`updateParams` / `mergePending`（T-D02）、`markProvisional`（T-D03）、`saveBlockText` / 批注三方法 / `requestRevision` / `resolveRevision` / `finalizeDeliverable`（T-F02 / F03 / F06 / F07）、`cancelJob` / `rerunStage`（T-B05 / B07）、`resetMockData`（T-G04）；发现缺口按 AGENTS §2 第 9 步在本文件追加任务。
- 实施期粒度提醒（S-22）的 T-A18 拆分已在 r6 以 T-A09a 落实；其余顶格 2 h 任务（T-A09、T-A19、T-A20、T-A21、T-B04、T-C01、T-G02 等）仍按该条处理。
