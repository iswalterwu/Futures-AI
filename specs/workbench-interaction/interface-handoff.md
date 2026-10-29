# Feature: workbench-interaction 生产方接口交接（interface-handoff.md）

> **性质**：本 feature 作为“生产方 / 互动方”，对 frontend-workbench v2（“壳方”）交接切片 H-1～H-6 与页面切片的**设计对拍与交付登记**。它不是 v2 的规格副本，也不是 v2 会话的接收结论；v2 的需求与消费要求以 v2 自己的 spec / plan / tasks 为准，本文件只引用编号并写本 feature 的落点。
> **当前状态（2026-10-28 恢复轮 r6）**：所有切片 **未交付**。没有实现代码、没有定向测试输出、没有集成 SHA；本文件中的接口名称是 r6 设计，须经 A 新会话定向复核（Checklist R7）后才可作为实施依据。对比 v2 的只读接口不代表对方会话已人工接收，**不宣称双向已签收**。
> **当前状态（2026-10-28 r6.1；以本行为准，上一行“须经 R7 复核”为当时原文）**：r6 接口设计已经 A Checklist R7 通过（`9acf3de`）；r6.1 只吸收 R7 S-27 / S-29 / S-30 的措辞精度（§3 `MockOverrides.jobFixtures` 行、§5-7），接口名称与语义不变。IMPL-GATE-R6 三项已满足（Walter “允许”代码实施并指定协调会话为集成人；工作树见 §0），但**实现未开始**，所有切片仍**未交付**；生产方集成树 `integration/workbench-interaction` 的 SHA 只是生产方验证证据，**不等于** v2 接收方已集成或签收。
> **当前状态（2026-10-29 首批实施后 Converge batch-a09a；以本行为准，上两行为当时原文）**：T-A01～T-A09、T-A09a 已实施（实施者 openai/gpt-6-astra；代码 diff `8753fa9..13a3373`；生产方集成树 `integration/workbench-interaction` @ `13a3373`），待独立 Review。**H-1** 生产方已具备 ① 固定 commit `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`、② 有效 Checklist R7 `9acf3de`、③ 定向测试摘要（实施者执行、Converge 未重跑），**④ v2 消费方集成 SHA 未取得** → 状态“**待消费方集成（未交付）**”；其余七个切片**未交付**（H-2·标签只有契约 Label 常量、`JobStatusBadge` 未做；H-6 只有 fixture 形状与 `readJobFixtures()` 边界解析、状态层未做，边界 ≠ 状态层）。本文件不宣称任何切片已交付或已被 v2 签收。 Converge 作者 = claude-opus-5-5 via anthropic（bridge 本窗口已明确限额、未重试；未改配置）。
> **当前状态（2026-10-29 首批独立 Review 后记账；以本行为准，上三行为当时原文）**：首批 T-A01～T-A09a 经独立审核员 A（claude-fable-5-1 via anthropic，新会话、独立 worktree，固定审 `b0b065f` + 代码 `13a3373`）判**本批通过（0 P1 / P2，6 P3）**，审核原件 `review-batch-a09a.md` 提交于 `af95b66505875609f7ed3f823e047cd16226a1c5`。**H-1** ①②③ 具备，③ 现另有 A 亲跑证据（`agent-context-contract.spec.ts` 3 / 5 / 7、`contract-version.spec.ts -t "WI scenarios"` 15，均通过），**④ v2 消费方集成 SHA 仍未取得** → 仍为“**待消费方集成（未交付）**”；生产方集成树 `13a3373` / `b0b065f` / `af95b66` 都只是生产方旁证，**不是** v2 接收，不能代填 ④。其余七个切片仍**未交付**（H-2·标签缺 `JobStatusBadge`；H-6 缺真实状态层）。本行不宣称任何切片已交付或已被 v2 签收。记账者 = claude-opus-5-5 via anthropic（bridge 本窗口已明确限额、未重试；未改配置）。
> **当前状态（2026-10-29 第二批派工准备 r6.3；以本行为准，上四行为当时原文）**：第二批 T-A10 / T-A22 / T-A22b / T-A23 / T-A24 **待实施**（未写代码、未运行测试、不预写结果）。其完成后 H-3·路由切片（T-A22）、H-4（T-A22b）、H-2·标签（T-A01 + T-A23）的提供任务齐备，可形成生产方 ①③；**④ 仍须 v2 消费方集成后由其所有者登记**，八个切片当前仍全部未交付（H-1 维持“待消费方集成”）。r6.3 接口精度只有一处：H-4 的 `useSessionStore()` 增一个**生产路由绑定入口** `bindRouter(router)`，仅供 `registerJobRoutes` 调用以注册既有 `afterEach` 守卫，不接受任何 `JobContext`、不是 setter；H-4 “可在测试中使用的公开设置方式” 仍登记为**无**（见 §3、§5-8）。T-A23 的 `JobStatusBadge` 为自制组件、不导入 shared `Badge.vue`，props 不变。记账者 = claude-opus-5-5 via anthropic（本轮协调器最小真实调用 `claude-bridge/claude-opus-5-5` exit 1，provider / invocation error 类、非已确认限额；同模型 anthropic exit 0；只换通道、未改配置）。
> **当前状态（2026-10-29 Checklist R8 后 r6.4；以本行为准，上五行为当时原文）**：独立 A 的 Checklist R8 **未通过**（原件 `7b91a2c`；唯一 P2 = B-12 T-A10 任务粒度），r6.3 的 H-4 `bindRouter` 与 T-A23 自制徽标等接口 / 设计精度经 R8 判为设计通过、**本轮不动**。r6.4 只在 Tasks 层把 R-B 种子校正拆为 **T-A09b**（fixture-only，依赖 T-A08），T-A10 依赖增 T-A09b：凡依赖链经过 T-A10 的切片（H-2·列表、H-6、页面切片）多一个祖先，但 T-A09b **不是**任何切片的提供任务、不形成 ①～④ 任何一项；§1 各切片提供任务、公开接口名称与 §5 待确认项不变，八个切片仍**全部未交付**（H-1 维持“待消费方集成”）。第二批（T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24）在 A R8.1 增量复核通过并提交前不开码；② 届时以 R8.1 提交 SHA 为准（R8 未通过，不能作 ②）。记账者 = claude-opus-5-5 via anthropic（本轮协调器真实调用 `claude-bridge/claude-opus-5-5` 为 provider / invocation 失败、未确认 quota，官方通道成功；未改配置）。
> **当前状态（2026-10-29 第二批实施后 Converge batch2；以本行为准，上六行为当时原文）**：Checklist **R8.1 通过**（`34d339e`，26 / 26，B-12 关闭），第二批 T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24 已实施（openai/gpt-6-astra；代码 diff `34d339e..27e59e6 -- frontend`；集成人 ff-only 并入生产方集成树 `integration/workbench-interaction` @ `27e59e6`），**待本批独立代码 Review**。
> - **生产方已具备 ①②③（3 / 4）的切片**：H-2·标签（T-A01 + T-A23）、H-3·路由切片（T-A22）、H-4（T-A22b）。② = R8.1 `34d339e`；③ 为实施者执行的定向测试摘要，属于**待审核证据**（本批 Review 未进行，不是 reviewed / passed）；**④ v2 消费方集成 SHA 均未取得** → 状态均为“**待消费方集成（未交付）**”。
> - **H-1**：①②③ 保留首批原登记，可追溯（② R7 `9acf3de`、③ 含 A 亲跑），④ 仍缺。
> - **仍缺提供任务的切片**：H-2·列表缺 T-A12 / T-A22a；H-6 已有 T-A10 的真实读 API，但缺 T-A11 / T-A21（读 API 完成 ≠ H-6 交付）；H-5 未做；页面切片缺 B / C 组（T-A22 的两页只是骨架）。
> - **本批未做**：持久化、业务写、Agent 运行状态、页面功能。
> - **公开接口**：实际名称与本文件 §3 一致，另按精度补记 `jobRoutes` 导出名和 `context` 字段级只读，见 §3 落地核对。
> - **上游**：main 已到 `072bb12`（v2 S0 已合入，含 `/jobs` 壳占位），本 feature 未同步，见 §5-9。
>
> 本行不宣称任何切片已交付或已被 v2 签收。记账者 = claude-opus-5-5 via anthropic（本轮协调器最小真实调用 `claude-bridge/claude-opus-5-5` exit 1，provider / invocation error 类、未确认 quota；同模型官方通道 exit 0；只换通道、未改配置）。
> **当前状态（2026-10-29 第二批独立 Review 后记账；以本行为准，上七块为当时原文，其中“待本批独立代码 Review / 待审核证据”已过时）**：第二批 T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24 经独立审核员 A（claude-fable-5-1 via anthropic，新会话、独立 worktree，固定审文档 `858025d` + 代码 `27e59e6`）判**本批通过（0 P1 / P2，5 项 P3 R2-A～R2-E）**；审核原件 `review-batch2.md` 由集成人原样提交于 `f72a1a187405e9f9dcba5bb22f47ad840141702d`。**H-2·标签 / H-3·路由切片 / H-4** 生产方 ①②③ 齐：② = 当前有效 Checklist R8.1 `34d339e`；③ 除实施者执行外另有 **A 亲跑**同数通过（`WI labels` 10 / `WI status badges` 18；`WI routes` 7 / `WI register` 2、整文件 9；`WI H-4 enter` 4 / `leave same navigation` 3 / `readonly` 1；见 `review-batch2.md` §1 / §5）。**④ 均未取得**：只读核对 `integration/frontend-workbench-v2` = `3f63273`，`13a3373` / `ebce4c8` / `cc59e94` / `b38cf43` 均非其祖先 → 仍为“**待消费方集成（未交付）**”；生产方集成树 `f72a1a1` / `27e59e6` 只是旁证，不能填作 ④。H-1 保留首批登记（① `13a3373`、② 当时 R7 `9acf3de`、③ 含首批 A 亲跑），当前有效清单为 R8.1 `34d339e`，④ 仍缺。H-2·列表 / H-6 / H-5 / 页面切片仍未交付（提供任务未齐）。本行不宣称任何切片已交付或已被 v2 签收；④ 只能由 v2 集成树所有者登记，本 feature 不代填、不代 merge。上游 main `072bb12` 不在本批祖先，同步协调见 §5-9（R2-D）。记账者 = claude-opus-5-5 via anthropic（协调器对 `claude-bridge/claude-opus-5-5` 最小调用 exit 1 = provider / invocation error、未确认 quota；同模型官方通道成功；只换通道、未改配置）。
> **当前状态（2026-10-29 第三批派工准备 r6.6；以本行为准，上一块为第二批 Review 后原文、仍有效）**：
> - **本批**：T-A11 → T-A12 → T-A13 → T-A22a 的开码前精度已补，**全部待实施**；没有新代码，也没有新测试输出。
> - **完成后的生产方证据**：H-2·列表的提供任务（T-A01 / A02 / A10 / A12 / A22a）将齐备，可形成 ①③；H-6 仍缺 T-A21。八个切片的交付状态不变：H-2·标签 / H-3 / H-4 / H-1 为“待消费方集成（未交付）”，其余未交付。
> - **接口精度**（r6.6，见 §3 注）：`useJobsStore().createJob(input: CreateJobInput): Promise<Job>`；`DataClient` 新增写方法的签名与回执见 plan §2.4【r6.6】。
> - **④**：消费分支 `integration/frontend-workbench-v2` 仍 `3f63273`，四项 ④ 仍缺。本 feature 不写、不重建 v2 树。
> - **上游**：main `072bb12` 未同步（§5-9 流程不变）。
>
> 记账者 = claude-opus-5-5 via anthropic（协调器对 `claude-bridge/claude-opus-5-5` 最小调用 exit 1 = quota / rate / spend_limit 类；同模型官方通道 exit 0；本窗口不重试；未改配置）。
> **当前状态（2026-10-29 第三批实施后 Converge batch3；以本块为准，上一块 r6.6 中的“全部待实施 / 没有新代码”为当时原文）**：
> - **本批**：T-A11 `c7ebccb`、T-A12 `742d6aa`（+ test-fix `0a2d1a5`）、T-A13 `a5ad11c`、T-A22a `0032fc6` 已实施（openai/gpt-6-astra；代码 diff `ab742f5..0032fc6 -- frontend`）。集成人已 ff-only 并入生产方集成树 `integration/workbench-interaction` @ `0032fc6`。本批**待第三批独立代码 Review**。
> - **H-2·列表**：提供任务（T-A01 / A02 / A10 / A12 / A22a）已齐。生产方具备：① `0032fc6`；② 当前有效 Checklist R9 `ab742f5`；③ `jobs-store.spec.ts -t "WI H-2 …"` 5 / 4 / 7 / 9 pass（实施者执行，**待审核证据**，不是 reviewed / passed）。**④ 未取得** → “**待消费方集成（未交付）**”。
> - **H-6**：T-A11 已提供“有覆盖时只在内存 / normal 持久化”部分，仍缺 T-A21（收件箱种子 / 角标样例）→ 未交付。H-5 / 页面切片未做。
> - **H-1 / H-2·标签 / H-3 / H-4**：保留前两批登记（①②③，③ 含 A 亲跑）。② 当时为 R7 / R8.1，当前有效 Checklist 可并记 R9 `ab742f5`。④ 仍缺 → 待消费方集成（未交付）。
> - **消费分支**：`integration/frontend-workbench-v2` 仍为 `3f63273`（只读）；本批及前两批切片 ① 都不是其祖先。本 feature 不写、不重建、不代登记 v2 树。
> - **公开接口**：实际名称与 §3 一致，另按精度补记 jobsStore 实际导出与 `DataClient` 新方法，见 §3 batch3 落地核对。
> - **上游**：main `072bb12` 未同步（§5-9 流程不变）。
>
> 本块不宣称任何切片已交付或已被 v2 签收。记账者 = claude-opus-5-5 via anthropic（协调器对 `claude-bridge/claude-opus-5-5` 最小调用 exit 1 = quota / rate / spend_limit 类；同模型官方通道成功；本窗口不重试；未改配置）。
> **当前状态（2026-10-29 第三批独立代码 Review 后 + R3-A Converge 补修登记 r6.8；以本块为准，上一块 batch3 中的“待第三批独立代码 Review / ③ 待审核证据”为当时原文）**：
> - **第三批 Review**：`review-batch3.md`（审核员 A = claude-fable-5-1 via anthropic，固定审文档 `e14ad25` + 代码 `0032fc6`；原件由集成人提交于 `49edb7e`）判本批通过（0 P1 / P2，3 项 P3）。T-A11 / A12 / A13 / A22a 记为已完成；不表示 AC 最终验收。
> - **H-2·列表**：③ 现有 A 亲跑同数（`WI H-2 cache` 5 / `filter` 4 / `createJob refresh` 7 / `agent refresh` 9）。但 Review P3 **R3-A** 指出 ① `0032fc6` 的 `applyFilter(f)` 成功分支改写了 `listStatus` / `listError`：全新 store 先筛选后 `ensureJobs()` 不再加载，base 读错误被筛选成功清除。集成人决定现在修，新增 **T-A22c**（tasks r6.8，方案 b）并加入本切片提供任务。**① `0032fc6` 仍待修；T-A22c 关闭（含 A 增量代码 Review）前不放行 ④**，关闭后以其提交更新 ①③。
> - **接口**：对外成员 / 签名不变。只把 `listStatus` / `listError` 的归属写成精度：二者是未筛选列表 `jobs` 的读状态，只由 `refresh()`（含 `ensureJobs()` 首次加载）置 ready / 清错；筛选成功不改它们（plan §2.3【r6.8】）。
> - **其余切片**：H-6 仍缺 T-A21；H-5 / 页面切片未做；H-1 / H-2·标签 / H-3 / H-4 仍为待消费方集成（未交付）。消费分支 `integration/frontend-workbench-v2` 本轮未读未写；④ 只能由其所有者登记。
>
> 本块不宣称任何切片已交付或已被 v2 签收。记账者 = claude-opus-5-5 via anthropic（bridge 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置）。
> **当前状态（2026-10-29 T-A22c 实施后增量 Converge；以本块为准，上一块 r6.8 中的“T-A22c 未实施 / ① `0032fc6` 仍待修”为当时原文）**：
> - **T-A22c**：已实施 `af24c826f41580d27f90ce611fb2f55fec44acbf`（实施者 openai/gpt-6-astra，基线 `e7716a8`；只删 `applyFilter` 成功分支两次读状态赋值，并补测试）。增量 Converge（`converge-batch3-cache-fix.md`）判与 r6.8 一致，**待新会话 A 增量代码 Review**；R3-A = 代码已修、待复核。
> - **H-2·列表**：
>   - ① 候选 `af24c82`（待 A 增量复核）；
>   - ② R9 `ab742f5`；
>   - ③ `WI H-2 list status` 2 / 整文件 27（原四组 25）pass + 工程门，实施者执行、待 A；
>   - **④ 仍缺，T-A22c 复核前不放行**。生产方集成树 `integration/workbench-interaction` @ `af24c82` 只是旁证，不能填作 ④；`integration/frontend-workbench-v2` = `3f63273`，不含 `af24c82`（只读核）。
> - **接口**：对外成员 / 签名不变；`af24c82` 已按 §3【r6.8】口径实现（`listStatus` / `listError` 只由 `refresh()` 置 ready / 清错）。
> - **其余切片**：保留原登记。H-6 仍缺 T-A21；H-5 / 页面切片未做；H-1 / H-2·标签 / H-3 / H-4 仍为待消费方集成（未交付）。
>
> 本块不宣称任何切片已交付或已被 v2 签收。记账者 = claude-opus-5-5 via anthropic（bridge 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置）。
> **当前状态（2026-10-29 T-A22c 增量代码 Review 后状态登记 = 第三批安全点；以本块为准，上一块“T-A22c 实施后增量 Converge”中的“① 候选 / 待 A 增量复核 / ③ 待 A / T-A22c 复核前不放行 ④”为当时原文）**：
> - **T-A22c 增量 Review**：`review-batch3-cache-fix.md`（审核员 A = claude-fable-5-1 via anthropic，新会话、独立 worktree，固定审文档 `eb91340` + 代码 diff `e7716a8..af24c82`；原件由集成人提交于 `69faacccabd8b089a9f240b28e6449a8fea90619`）判**通过：0 P1 / P2、0 新 P3，R3-A 关闭**。T-A22c 记为已完成；不表示 AC 最终验收。
> - **H-2·列表**：
>   - ① `af24c826f41580d27f90ce611fb2f55fec44acbf`：由候选转为**生产已核**（A 增量 Review 读真实 diff 与全文核对；祖先含已审 `0032fc6`，`0032fc6` 作为含 R3-A 的已审历史证据保留，不作集成对象）；
>   - ② R9 `ab742f5`（`checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`，未改）；
>   - ③ 实施者执行 + **独立 A 亲跑同数**：`WI H-2 list status` 2、整文件 27（原四组 `cache` 5 / `filter` 4 / `createJob refresh` 7 / `agent refresh` 9）、`-t "WI H-2"` 27、typecheck / lint / `contract --check` 24 / 10 / 2；A 另跑全量 `test:unit` 31 files / 953 / 0 与 `e2e/shell.spec.ts` + `e2e/agent.spec.ts` 24 passed；
>   - 本方“T-A22c 复核前不放行 ④”的条件**已解除**；**④ 仍缺 → 待消费方集成（未交付）**。只读观察 `integration/frontend-workbench-v2` 仍为 `3f63273`、不含 `af24c82`；本 feature 不写、不重建、不 merge 该树，也不凭推测填 ④。生产方集成树 `integration/workbench-interaction` @ `69faacc` 只是旁证。
> - **接口**：对外成员 / 签名不变；§3【r6.8】口径已由代码与测试固定。
> - **其余切片**：H-6 仍缺 T-A21；H-5 / 页面切片未做（`/jobs` 两页仍为骨架、jobsStore 未被页面消费）；H-1 / H-2·标签 / H-3 / H-4 历史生产方证据保留，④ 仍缺 → 待消费方集成（未交付）。
>
> 本块不宣称任何切片已交付或已被 v2 签收。记账者 = claude-opus-5-5 via anthropic（PI_SESSION_ID `01a1876b-2420-709d-b58f-04d6eed0d36f`；bridge 本窗口已明确 quota / rate 限额，不重试；官方通道成功；未改配置）。
> **阶段记录（脱敏）**：作者 = claude-opus-5-5 via anthropic（Plan / Tasks / Analyze 角色；本窗口 `claude-bridge/claude-opus-5-5` 经协调器探活 exit 1，quota / rate / spend_limit 类，未重试；未改 provider / key / 全局配置）。

## 0. 固定参照

| 项 | 值 |
|---|---|
| 本 feature 规格分支 | `docs/workbench-interaction-resume-20261028`，起点 `8af343ff085c0f958068b6b50008a6985f51d170`（R6 暂停快照） |
| 实施基线 | `implementation_base_sha = 43b6d79681a49562f41751368b2ae00c24062f56`（PR #7 merge commit，已在 origin/main；v1 源交付 `eba5002`）。基线门已满足；实现分支未建立 |
| v2 只读参照 | `D:/2030/Futures-AI-interaction-v2-ref-ded7161` @ `ded716100381fcd2b4b5d3481f4f56e44c9869fd`：spec v2.1（Gate 1 已批准，52 AC）、plan §7.2（文件唯一写入者）/ §7.3（H-1～H-6）/ §7.13（分阶段依赖）、tasks v2 §1.2（交接登记）/ §5（开工闸门）；v2 A Checklist R2 产物 `f1f755bad8e4bab7577c415f4aea3d297c9d37a8`（审 `949a232`） |
| 本 feature 审核证据 | Checklist R6（26/26）已提交于 `8af343f`，**只覆盖 r5 设计**；r6 新增的接口精化须 R7 复核后生效。【r6.1】**Checklist R7 通过**：原件提交 `9acf3de661187840ea5be6f6d6f78205872ac356`（审 `0e37fbf`，26/26、0 P1/P2）；r6.1 精度修订按 R7「下一步」2 不需重审 |
| 实施 / 生产方集成（r6.1 登记） | 实施树 `D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra`；生产方集成验证树 `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`，唯一串行写入者 = 协调会话 `01a18388-a371-7746-8158-9fb15d55d819`（`openai/gpt-6.1-sol`）。两树自 `43b6d79` 建立、ff-only 到 main `90187f7`（`upstream_start_sha`；`implementation_base_sha` 仍为 `43b6d79`）；尚未带入本规格、无实现代码 |
| v2 最新只读参照（r6.1） | `D:/2030/Futures-AI-interaction-v2-ref-79b5212` @ `79b521207a93567c4da8651e5f6e53c665e3d098`：相对 `ded7161` 的 plan §7.3 / tasks §1.2 只增状态补记、V2-S11 / V2-S12 与集成登记，H-1～H-6 / 页面切片的消费要求未变。v2 自有集成树 `D:/2030/Futures-AI-workbench-v2-integration`（`integration/frontend-workbench-v2`）与实施树归另一协调会话所有，本 feature **只读、不写、不代 merge** |
| 首批独立 Review（2026-10-29，batch-a09a） | `review-batch-a09a.md`（A = claude-fable-5-1 via anthropic；审 `b0b065f` + 代码 `13a3373`），**本批通过 0 P1 / P2、6 P3**；原件提交 `af95b66505875609f7ed3f823e047cd16226a1c5`（只引用、不改写）。非全 feature Review、非 Gate 2，不构成 v2 接收 |
| 第二批独立 Review（2026-10-29，batch2） | `review-batch2.md`（A = claude-fable-5-1 via anthropic；审 `858025d` + 代码 `27e59e6`，diff `34d339e..27e59e6`），**本批通过 0 P1 / P2、5 P3（R2-A～R2-E）**；原件提交 `f72a1a187405e9f9dcba5bb22f47ad840141702d`（只引用、不改写）。当前有效 Checklist = R8.1 `34d339e`。非全 feature Review、非 Gate 2，不构成 v2 接收 |
| 首批实施（2026-10-29，batch-a09a） | 授权规格种子 `8753fa9f65dae685f765f316b00e6287750f0cf7`（源 `1ad7963`）；实施 commit：T-A01 `07ef7cc`、T-A02 `ad4a830`、T-A03 `8e81063`、T-A04 `112c283`、T-A05 `581f434`、T-A06 `e66ecd4`、回归修复 `1ed6ec1`、T-A07 `0f60448`、T-A08 `320277a`、描述修复 `7bb83f9`、T-A09 `82c36e7`、T-A09a `13a3373`（完整 SHA 见 implementation-log §6）；生产方集成树 HEAD `13a3373`（旁证）。v2 自有集成树未写、未代 merge |

## 1. 交付登记（四项齐全才“已交付”）

四项 = ① 生产实现固定 commit；② 生产方已提交的有效 Checklist SHA / 轮次；③ 定向测试命令与输出摘要；④ 集成验证分支上的集成 SHA（由指定集成人登记）。设计对拍、任务完成、本地测试绿都不等于交付。

【r6.1 口径】④ 指 **v2 消费方**集成验证分支（`integration/frontend-workbench-v2`）上的集成 SHA，由该分支所有者在真正集成后登记；本 feature 的 `integration/workbench-interaction` 只做生产方串行验证 / 集成，其 SHA 可作为 ①③ 的旁证记入 `implementation-log.md`，**不能填作 ④**。生产方先形成 ①②③ 三项可消费证据即可；② 当前有效轮次为 R7 `9acf3de`（若实施中触发新一轮 A 复核，以交接时已提交的有效轮次为准）。

| 切片 | 提供任务（tasks §2a） | 定向测试（交付时执行） | ① commit | ② Checklist SHA | ③ 测试摘要 | ④ 集成 SHA | 状态 |
|---|---|---|---|---|---|---|---|
| H-1 | T-A02、T-A09、T-A09a | `agent-context-contract.spec.ts`；`contract-version.spec.ts -t "WI scenarios"` | `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`（含 T-A02 `ad4a830`、T-A09 `82c36e7`、T-A09a） | `9acf3de`（R7，H-1 交接时有效；当前有效清单 = R8.1 `34d339e`） | 实施者执行（Converge 未重跑）：`agent-context-contract.spec.ts` `WI H-1 schema` 3 / `WI H-1 legacy` 5 / `WI H-1 passthrough` 7 pass；`contract-version.spec.ts -t "WI scenarios"` 15 pass；同提交全量单测 21 文件 722 pass / 0 fail。【独立 A 亲跑】同上 3 / 5 / 7、15 pass，全量单测 21 文件 722 / 0 fail（`review-batch-a09a.md` §1 / §5，`af95b66`） | **未取得**（生产方集成树 `13a3373` 只是旁证，不能填作 ④） | **待消费方集成（未交付）** |
| H-2·标签 | T-A01、T-A23 | `contract-labels.spec.ts -t "WI labels"`；`badges.spec.ts -t "WI status badges"` | `ebce4c85b1422a62b883117f75459a1fdee81b80`（T-A23；祖先含 T-A01 `07ef7ccc3c889400dfb2354ceec22c94317c8813`） | `34d339e`（R8.1，当前有效） | 实施者执行：`WI labels` 10 pass（首批 A 亲跑同数）；`badges.spec.ts -t "WI status badges"` 18 pass；同批末轮全量单测 27 文件 833 pass / 0 fail。【独立 A 亲跑】`WI labels` 10、`WI status badges` 18 pass，全量单测 27 files / 833 / 0 fail（`review-batch2.md` §1 / §5，`f72a1a1`） | 未取得（生产方集成树 `27e59e6` 只是旁证） | **待消费方集成（未交付）**：生产方 3 / 4 |
| H-2·列表 | T-A01、T-A02、T-A10、T-A12、T-A22a、**T-A22c**（r6.8，R3-A 补修；已完成 `af24c82`，增量 Review 通过 `69faacc`，R3-A 关闭） | `jobs-store.spec.ts -t "WI H-2"` | **生产已核** `af24c826f41580d27f90ce611fb2f55fec44acbf`（T-A22c；增量 Review `69faacc` 核对；祖先含已审 `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc` T-A22a、T-A12 `742d6aa3d671cee91c6cce856f657a103d510615`、T-A01 / T-A02 / T-A10 `1841029`）。已审历史证据 `0032fc6` 含 R3-A，保留追溯、不作集成对象 | `ab742f5`（R9，当前有效；blob `74084c13…`） | 【T-A22c，实施者执行 + 独立 A 亲跑同数（`review-batch3-cache-fix.md` §1，`69faacc`）】`WI H-2 list status` 2 pass；`jobs-store.spec.ts` 整文件 27 pass（原四组 `cache` 5 / `filter` 4 / `createJob refresh` 7 / `agent refresh` 9 = 25 + 新 2）；`-t "WI H-2"` 27；typecheck / lint / `contract --check` 24 / 10 / 2 通过；全量单测 31 files / 953 / 0；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` 24 passed（A 另跑 v1 契约 88、real-stubs 23）。【历史：`0032fc6` 已审】实施者与独立 A 亲跑 5 / 4 / 7 / 9，全量 31 / 951 / 0（`review-batch3.md` §1 / §6，`49edb7e`） | **未取得**（生产方集成树 `69faacc` 只是旁证，不能填作 ④；只读观察 v2 消费分支仍 `3f63273`、不含 `af24c82`） | **待消费方集成（未交付）**：生产方 ①②③ 齐（3 / 4），R3-A 已关闭、本方放行条件已满足，④ 待 `integration/frontend-workbench-v2` 所有者登记；可调用写 action = `useJobsStore().createJob(input)` |
| H-3·路由切片 | T-A22 | `routes.spec.ts` | `cc59e946df2d08178b03e3b37928ab34517067d7`（T-A22；`b38cf43` 后路由整文件回归仍通过） | `34d339e`（R8.1，当前有效） | 实施者执行：`routes.spec.ts` `WI routes` 7 / `WI register` 2 pass；T-A22b 后整文件 9 pass。【独立 A 亲跑】同数通过、整文件 9（`review-batch2.md` §1 / §5，`f72a1a1`）；pin `90187f7` 基线，同步 `072bb12` 需按 R2-D 重核 | 未取得（生产方集成树 `27e59e6` 只是旁证） | **待消费方集成（未交付）**：生产方 3 / 4；只是路由切片，两页为骨架，不含页面功能 |
| 页面切片 | T-B01、T-B02、T-B04、T-C01、T-C01a、T-C02、T-C03、T-C04 | `e2e/jobs/intake.spec.ts`；`detail-stage.spec.ts -g "WI AC-002-2"`；`job-list.spec.ts` | 未取得 | `34d339e`（R8.1，当前有效） | 未取得 | 未取得 | 未交付 |
| H-4 | T-A22b | `session-context.spec.ts -t "WI H-4"` | `b38cf43f602390d7645cc84514d0da9860a7e0b7`（T-A22b） | `34d339e`（R8.1，当前有效） | 实施者执行：`WI H-4 enter` 4 / `WI H-4 leave same navigation` 3 / `WI H-4 readonly` 1 pass。【独立 A 亲跑】同数通过（`review-batch2.md` §1 / §5，`f72a1a1`） | 未取得（生产方集成树 `27e59e6` 只是旁证） | **待消费方集成（未交付）**：生产方 3 / 4；公开设置方式 = 无（§5-8） |
| H-5 | T-C01、T-C01a | `intake.spec.ts -t "WI H-5"` | 未取得 | `34d339e`（R8.1，当前有效） | 未取得 | 未取得 | 未交付 |
| H-6 | T-A07、T-A09、T-A10、T-A11、T-A21 | `contract-version.spec.ts -t "WI jobFixtures"`；`job-state-read.spec.ts -t "WI scenarios read"`；`job-state-inbox.spec.ts -t "WI inbox seed"` | 部分：T-A07 `0f604480816c6372e847d29cf05bdc63e88371a3`、T-A09 `82c36e7b05ce286ebc0f9650e466695e394612ee`、T-A10 `1841029f5a948b53ef21cbc54967556dc04e0815`、**T-A11 `c7ebccb8f9e29350d5a815959be3b532191bdb95`**（有 `jobFixtures` 覆盖时会话只在内存、两 key 零访问；normal 无覆盖时持久化）；T-A21（收件箱种子）未实施 | `ab742f5`（R9，当前有效） | 部分：`WI jobFixtures` 14 pass（首批，A 亲跑同数）；`WI scenarios read` 33 pass（第二批，A 亲跑同数）；T-A11 `WI non-normal` 13 pass（实施者执行；登记时待第三批 Review，后经 A 亲跑同数，`49edb7e`）；`job-state-inbox.spec.ts` 尚不存在 | 未取得 | 未交付（缺 T-A21；读 API + 持久化完成 ≠ H-6 交付） |

（测试文件均在 `frontend/tests/{unit,component}/jobs/` 或 `frontend/e2e/jobs/`；命令前缀 `pnpm -C frontend test:unit|test:e2e`。）

【r6.4 口径】上表“提供任务”列不变；T-A10 新增依赖 T-A09b（R-B fixture-only 种子校正），H-2·列表 / H-6 的依赖链随之多一个祖先，T-A09b 本身不登记为提供任务、不产生 ①～④；内置种子中未开始阶段的工作区为空（plan §2.4 R-B），这是既有 S-13 空工作区表达，不是新接口或新 UI 状态。

【batch2 口径（Converge batch2，2026-10-29）】② 列已改为当前有效轮次 **R8.1 `34d339e`**（R7 `9acf3de` 是首批 / H-1 当时的有效轮次，H-1 行保留原登记以便追溯；R8 `7b91a2c` 未通过，不作 ②）。H-2·标签 / H-3 / H-4 的 ③ 是**待审核证据**：实施者执行，Converge 未重跑，本批独立代码 Review 尚未进行；不得写成“reviewed / passed”。Review 若有发现，按其结论回修后再更新本表。④ 只能由 `integration/frontend-workbench-v2` 的所有者登记；生产方集成树 `27e59e6` 只是旁证。

【batch2 Review 后口径（2026-10-29，`f72a1a1`；以本段为准，上段“待审核证据”为当时原文）】H-2·标签 / H-3 / H-4 的 ③ 已有独立 A 亲跑证据，A 判本批通过；④ 仍须 `integration/frontend-workbench-v2` 所有者真正集成后登记（只读核对 `3f63273` 不含四个切片的 ①），状态不变：待消费方集成（未交付）。H-1 行 ② 保留 R7 `9acf3de` 作历史追溯，当前有效清单为 R8.1 `34d339e`。其余切片不变。

【batch3 口径（Converge batch3，2026-10-29）】H-2·列表的 ① / ③ 已按本批固定提交登记，③ 为**待审核证据**（实施者执行，Converge 未重跑，第三批独立代码 Review 尚未进行）。② 列：H-2·列表 / H-6 改为当前有效 R9 `ab742f5`；H-2·标签 / H-3 / H-4 / H-5 / 页面切片行的“R8.1 `34d339e`（当前有效）”是第二批时的原文，当前有效 Checklist 为 R9 `ab742f5`，可并记；H-1 保留 R7 追溯。④ 只能由 `integration/frontend-workbench-v2` 的所有者登记；生产方集成树 `0032fc6` 只是旁证。

【batch3 Review 后 + r6.8 口径（2026-10-29，`49edb7e`；以本段为准，上段“③ 为待审核证据”为当时原文）】H-2·列表的 ③ 已有独立 A 亲跑；A 的 P3 R3-A 由新增提供任务 T-A22c 修复（方案 b，tasks r6.8）。T-A22c 实施并经新会话 A 增量代码 Review 核 R3-A 关闭后，① 改登记为 T-A22c 提交、③ 补 `WI H-2`（含 `WI H-2 list status`）输出；此前 ① `0032fc6` 只作已审历史证据，不作 ④ 的集成对象。其他切片不变。

【T-A22c 实施后增量 Converge 口径（2026-10-29，`af24c82`；以本段为准，上段“T-A22c 实施并经 A 复核后 ① 改登记”的前半已发生、后半待 A）】H-2·列表 ① 先登记为**候选** `af24c82`，③ 补实施者执行的 `WI H-2`（含 `WI H-2 list status`）输出。二者在新会话 A 增量代码 Review 核 R3-A 关闭前都是待审核证据，不是 reviewed / passed；④ 仍缺、复核前不放行。其他切片保留原登记。

【T-A22c 增量 Review 后口径（2026-10-29，`69faacc`；以本段为准，上段“候选 / 待审核证据 / 复核前不放行”为当时原文）】H-2·列表 ① `af24c82` 由候选转为生产已核，③ 已有独立 A 亲跑同数（含新组 `WI H-2 list status` 与全量 953、E2E 24）；原“待 A22c 复核”的本方条件解除。④ 仍只能由 `integration/frontend-workbench-v2` 所有者真正集成后登记，当前**仍缺 → 待消费方集成（未交付）**。H-6（缺 T-A21）、H-5 / 页面切片（未做）、H-1 / H-2·标签 / H-3 / H-4（历史生产方证据保留、④ 缺）不变。

## 2. 逐项对拍（v2 要求 → r5 状态 → r6 落点）

“r5 状态”按已审 r5 plan / tasks 原文判断；“需求回流”判断是否改变本 feature 冻结 spec。

| v2 要求（plan §7.3 / tasks §1.2） | r5 状态 | r6 落点 | 需求回流 |
|---|---|---|---|
| H-1：`CONTRACT_VERSION='2.0.0'` | 已覆盖（T-A09） | 不变；**T-A09 单独不等于 H-1** | 否 |
| H-1：导出 `JobContext={jobId,stage}` | 已覆盖（T-A02） | 不变 | 否 |
| H-1：`SendMessage.jobContext?`、十类事件公共可选 `jobContext`、mock 把 payload 上下文原样写入该 run 全部事件、旧事件 / fixture 仍可解析 | 已覆盖，但全部在 T-A18（依赖 mock 状态层 A10～A17），H-1 须等 T-A18 | 拆为 **T-A09a**（只依赖 A02 / A09）；无上下文时事件不出现该键；T-A18 保留状态层关联（activeRunId / overlay）并复跑 H-1 测试 | 否（S-22 原拆法） |
| H-2·标签：`JobStatusLabel / StageLabel / StageStateLabel / JobTypeLabel`（文案 + 图标） | 已覆盖（T-A01，S-11 九张映射含 `JobTypeLabel`） | 不变 | 否 |
| H-2·标签：`JobStatusBadge` 组件 | 已覆盖（T-A23） | 公开接口登记见 §3 | 否 |
| H-2·列表：`listJobs` 返回含 `stages[4]{stage,state,pendingCount}` / `pendingCount` 的摘要、默认 updatedAt 倒序 | 已覆盖（T-A10；字段在 plan 写作“摘要”） | T-A02 固定 `JobListItem` 字段 | 否 |
| ① 只读未筛选列表缓存 + 读状态 / 错误 | **缺口**（plan §2.3 的 jobsStore 只写“当前作业、工作区视图缓存”） | T-A22a：`jobs` / `listStatus` / `listError` | 否（落实 plan §2.3 既有“写回执 / 通知后重读”） |
| ② 共享 ensure / load 与 refresh action | 缺口 | `ensureJobs()` / `refresh()` | 否 |
| ③ “进行中”判定（契约常量或 selector，登记进 CONTRACT.md） | 缺口 | T-A01：`ActiveJobStatusSchema` + `ACTIVE_JOB_STATUSES` = 去掉 delivered / cancelled 的 7 个状态；不另建 selector | 否（R-008 契约扩展、plan §1 “v2 契约字段需求由本 feature 写入”；不改任何 AC） |
| ④ 筛选不覆盖未筛选缓存 | 缺口（T-B02 写“stores/jobs.ts 的筛选参数”，未区分） | `applyFilter()` 结果存 `filteredJobs`（T-A22a / T-B02） | 否 |
| ⑤ 所有改变摘要的写回执 + agent 通知后刷新同一份缓存 | 部分（plan §2.3 有原则，无机制；本 feature 自己的待合并 / 重跑 / 改稿 e2e 同样需要） | tasks §1-9：写成功后只调用一次 `refresh()`；T-A22a `receiveAgentEvent` 对带 `jobContext` 的终态事件刷新，`main.ts` 订阅；T-C01 / T-C02 / T-C03 / T-G02 各有写后刷新定向测试 | 否 |
| ⑤ 随 H-2·列表交付一个可调用、会改变摘要的写 action（不能用 inbox / intake 冒充） | 缺口 | `useJobsStore().createJob(input)`（T-A22a 标准 3） | 否 |
| H-3：`jobs/routes.ts` 两条路由、`meta.navId='jobs'`、`main.ts` 挂载前 `addRoute`、同名替换壳占位 | 已覆盖（T-A22），但 T-A22 依赖 T-A10 且混有 store 骨架 | T-A22 只做路由切片（依赖改为 T-A01）；`registerJobRoutes(router, pinia)`；含占位的测试路由验证同名替换 | 否 |
| H-4：`sessionStore.context` 只读；进入详情 / 切阶段设置；离开 `job-detail` 同次导航内同步清空；不从 lastRun 推导；登记是否有公开设置方式 | 缺口（plan 只写“当前上下文”） | T-A22b：`afterEach` 守卫设置 / 清空；**无公开 setter**（壳 S1-ctx 因而条件依赖 H-3·路由切片，v2 tasks §1.2 已预设此分支） | 否 |
| H-5：`intakeStore.open(jobId?) / close / isOpen / jobId`，jobId 为打开时快照、提交用快照 | 部分（T-C01 只写“抽屉开关与当前草稿”） | T-C01 标准 4 | 否 |
| H-5：`IntakeDrawer` 根 `.glass-drawer`、填满壳容器、无 fixed / 遮罩 / `aria-modal` / 焦点锁；关闭不导航、不调 agent | 部分（plan 有“非模态、无遮罩、无焦点锁”） | T-C01a | 否 |
| H-5：写操作按 ⑤ 刷新 | 缺口 | T-C01（submit）、T-C02（confirm）、T-C03（assign / remove） | 否 |
| 页面切片：`/jobs` 列表、详情、IntakeDrawer 投放提交与归属 | 已覆盖（B / C 组），但待归属池位置未定 | T-C03：待归属池放在 IntakeDrawer 内，任何挂载点（含 v2 AppShell 的 `.intake-slot`，例如在工作台）都能完成归属 | 否（R-003 内的位置精化） |
| H-6：empty / error / slow 覆盖 `listJobs` | 已覆盖（T-A10 场景表） | T-A10 标准 2 明写 `listJobs` | 否 |
| H-6：`jobFixtures` 可整集合替换 | 部分（T-A09 只写“键为文件名、边界校验”） | T-A07 `jobs.json` 按场景集合分键；T-A09 整文件替换、每 client 状态建立时读一次；T-A10 缺工作区样例 → 空工作区；T-A11 有覆盖时只在内存 | 否 |
| H-6：至少一个进行中作业带未读待处理项 | 部分（T-G02 e2e 隐含需要，生成规则只写“状态迁移时”） | T-A21：状态建立时对 fixture 初始状态应用同一生成规则；样例为 job-running 的 j-human、job-conflict 的 j-conflict | 否 |

**结论**：全部缺口都是既有需求（spec R-001 / R-003 / R-005 / R-007 / R-008）与既有 plan 意图（§2.3 写后重读、§2.4 契约扩展）内的接口机制精度；**没有需要回流 Clarify / 重过 Gate 1 的需求变更**，不阻塞、不需要 Walter 改需求。

## 3. 公开接口清单（r6 设计；名称以交付 commit 为准，若有出入回到 Analyze 更新本表）

| 来源文件（本 feature 唯一写入） | 导出 / 成员 | 语义 |
|---|---|---|
| `frontend/src/contracts/types.ts` | `CONTRACT_VERSION`（`'2.0.0'`）、`JobContextSchema` / `JobContext`、`SendMessageSchema.jobContext?` | H-1 |
| `frontend/src/agent/events.ts` | 十类事件公共可选 `jobContext` | H-1；无上下文时不出现该键 |
| `frontend/src/contracts/types.ts` | `JobStatusLabel`、`StageLabel`、`StageStateLabel`、`JobTypeLabel`（及其余五张映射）：`{[值]: {text, icon}}` | H-2·标签；壳只消费，不建第二份映射 |
| `frontend/src/contracts/types.ts` | `ActiveJobStatusSchema`、`ACTIVE_JOB_STATUSES` | H-2 ③；= JobStatus − {delivered, cancelled} |
| `frontend/src/jobs/components/JobStatusBadge.vue` | props：`status: JobStatus`（只读 props，不读 store） | H-2·标签；文案 + 图标来自 `JobStatusLabel` |
| `frontend/src/jobs/stores/jobs.ts` | `useJobsStore()`：只读 `jobs: JobListItem[]`、`listStatus: 'idle'\|'loading'\|'ready'\|'error'`、`listError: ContractError \| null`；`ensureJobs()`、`refresh()`、`createJob(input)`；（本 feature 内部另有 `filteredJobs` / `applyFilter()` / `openJob()` / `receiveAgentEvent()`） | H-2·列表；进行中集合 = `jobs` 中 status ∈ `ACTIVE_JOB_STATUSES` |
| `frontend/src/jobs/routes.ts` | 两条路由记录（`jobs`、`job-detail`）；`registerJobRoutes(router, pinia)`；【batch2 落地】两条记录的导出名为 `jobRoutes: RouteRecordRaw[]`，签名为 `registerJobRoutes(router: Router, pinia: Pinia): void` | H-3（+ H-4 守卫）；`main.ts` 在挂载前调用 |
| `frontend/src/jobs/stores/session.ts` | `useSessionStore()`：只读 `context: JobContext \| null`；【r6.3】生产路由绑定入口 `bindRouter(router)`（只由 `registerJobRoutes` 调用，注册 `afterEach` 守卫；不接受 `JobContext`）；【batch2 落地】`context` 返回深只读对象，字段也不可写；签名为 `bindRouter(router: Router): void` | H-4；无公开 setter，只经导航改变；壳与测试不调用 `bindRouter` |
| `frontend/src/jobs/stores/intake.ts` | `useIntakeStore()`：`open(jobId?)`、`close()`、只读 `isOpen`、`jobId` | H-5；jobId 为打开时快照 |
| `frontend/src/jobs/stages/IntakeDrawer.vue` | 无必需 props；根元素 `.glass-drawer`，填满父容器 | H-5；v2 前由本 feature 两个页面挂载，v2 后由 AppShell `.intake-slot` 挂载并由 T-H01 移除页面级挂载 |
| `frontend/src/contracts/mock/index.ts` | `MockOverrides.jobFixtures`：键 = `fixtures/jobs` 文件名，值整体替换；`jobs` 按场景集合分键 | H-6；每个 client 状态建立时读取一次；切换覆盖值需新建 client（沿用 v1 测试在系统边界 spy 委托的做法）。r6.1（R7 S-27）：`job-state.ts` 为模块级唯一共享会话状态，每次 `createMockDataClient()` 时据 scenario / `jobFixtures` 重建，AgentClient 与各 DataClient 共用当前状态；`jobFixtures` “建状态时读一次”，与 v1 `fixtures` “每次请求读取”时机不同 |
| `frontend/src/main.ts` | `registerJobRoutes(router, pinia)`；`agentClient.subscribe(useJobsStore(pinia).receiveAgentEvent)` | 本 feature 写入；壳不改 |

【2026-10-29 batch-a09a 落地核对（Converge 只读）】在 `13a3373` 中已按本表名称落地：`CONTRACT_VERSION='2.0.0'`、`JobContextSchema` / `JobContext`、`SendMessageSchema.jobContext?`、`events.ts` 共享 `eventFields` 的可选 `jobContext`（无上下文时事件不出现该键）、九张 Label 常量与 schema、`ActiveJobStatusSchema` / `ACTIVE_JOB_STATUSES`、`MockOverrides.jobFixtures`（另导出内部用 `readJobFixtures()` / `jobFixtureSchemas`，供 T-A10 建状态时调用，尚未接线）。`JobStatusBadge`、`useJobsStore`、`routes.ts` / `registerJobRoutes`、`useSessionStore`、`useIntakeStore`、`IntakeDrawer`、`main.ts` 注册均**未实施**。名称无出入，本表无需改。

【2026-10-29 batch2 落地核对（Converge 只读；代码 `34d339e..27e59e6`，待本批独立代码 Review）】以下名称已按本表落地：
- `JobStatusBadge`：props `status: JobStatus`，自制组件，不导入 shared `Badge.vue`，文案和图标来自 `JobStatusLabel`。本 feature 内部另有 `ArtifactStatusBadge{status: ArtifactStatus | UploadStatus}` 与 `SourceBadge{origin, source}`，不属于交接接口。
- `routes.ts`：`jobRoutes` 与 `registerJobRoutes`。
- `useSessionStore`：`context` 与 `bindRouter`。
- `main.ts`：挂载前调用 `registerJobRoutes(router, pinia)`。
- `MockOverrides.jobFixtures`：已由 T-A10 的共享状态在 `createMockDataClient()` 时读取一次。
- `DataClient`：增加 `listJobs(filter?: {status?, type?, title?})`、`getJob(jobId)`、`getStageWorkspace(jobId, stage)`。

以下仍**未实施**：`useJobsStore`、`useIntakeStore`、`IntakeDrawer`、`main.ts` 的 jobsStore 订阅（T-A22a）。上表两行只按精度补了导出名和字段级只读，机制与语义不变。

【2026-10-29 r6.6 接口精度（第三批派工准备，未实施）】
- `useJobsStore()`：
  - `createJob(input: CreateJobInput): Promise<Job>`，返回写回执中的 `jobs[0]`；失败以原 ErrorResponse 拒绝，不刷新缓存。
  - 本 feature 内部的 `filter: ListJobsFilter | null`、`filteredJobs: JobListItem[] | null` 只作精度登记，不属交接接口。
- `CreateJobInput = {title, type, subject: string | null, goal}`（strict）进 `contractSchemas`；`DataClient.createJob` 返回 `WriteReceipt`。
- 投放相关写方法（`IntakeReceipt` 等）属页面切片 / H-5 的下游，签名见 plan §2.4【r6.6】，不改 §1 的切片划分。
- 名称在交付 commit 时以实际导出为准；若有出入，回到 Analyze 更新本表。

【2026-10-29 batch3 落地核对（Converge 只读；代码 `ab742f5..0032fc6`，待第三批独立代码 Review）】以下名称已按本表与 plan §2.4【r6.6】落地：
- **`useJobsStore()`**（`jobs/stores/jobs.ts`）：
  - 对外只读视图 `jobs` / `listStatus` / `listError`（交接接口），以及本 feature 内部的 `filter` / `filteredJobs`；均为 `computed` + `readonly`，元素层也只读。
  - action：`ensureJobs()` / `refresh()` / `createJob(input: CreateJobInput): Promise<Job>`（交接接口），以及内部的 `applyFilter(filter | null)` / `receiveAgentEvent(event)`。
  - 另导出类型 `ListJobsFilter`。
  - `refresh` 自身总是 resolve，失败落在 `listStatus='error'` + `listError`。
  - `openJob()` 未实施（归 T-B04）。
- **`main.ts`**：在 agent store 订阅之后加 `agentClient.subscribe(useJobsStore(pinia).receiveAgentEvent)`，并交 `app.onUnmount` / `import.meta.hot?.dispose` 解除（§5-1 所述新增订阅已落地）。
- **`DataClient` 新方法**：
  - `resetMockData(): Promise<null>`；
  - `createJob(input: CreateJobInput): Promise<WriteReceipt>`；
  - `submitIntake(input: IntakeInput): Promise<IntakeReceipt>`、`getIntakePreview(uploadId): Promise<ExtractionPreview>`、`confirmIntake(uploadId, mapping: FieldMapping): Promise<IntakeReceipt>`；
  - `listUnassignedUploads(): Promise<Upload[]>`；
  - `assignUpload(uploadId, jobId)` / `removeUpload(uploadId, reason)` / `cancelJob(jobId, reason)`，均返回 `Promise<WriteReceipt>`。
  - `CreateJobInput = {title, type, subject: string | null, goal}`（strict，title / subject trim 后保存）；`IntakeReceipt = WriteReceipt + {upload, preview}`；两者进 `contractSchemas`。
  - 投放写方法属 H-5 / 页面切片下游，不改 §1 的切片划分。
- **本地持久化**（`jobs/persistence.ts`，私有，不属交接接口、不进产品契约，只登记）：
  - key：`fai.jobs.v1` = `{version:1, data:{jobs, details, deliverables, interventions, uploads, mappingHistory}}`；`fai.inbox.v1` 本批只在 reset 时删除。
  - 状态 API：`getPersistenceStatus()` / `onPersistenceStatus(cb)`，取值 `ok | degraded | unreadable`（供 T-G04 横幅）。
  - 初始化顺序：`createMockDataClient()` 先建 state，再在 normal 且无覆盖时 hydrate。

名称无出入；本表上方各行无需改。

【2026-10-29 r6.8 接口精度（第三批 Review R3-A；落地任务 T-A22c，未实施）】`useJobsStore()` 的对外成员与签名不变。只登记一条归属口径：`listStatus` / `listError` 是未筛选列表 `jobs` 的读状态，只由 `refresh()`（含 `ensureJobs()` 首次加载、写后 / agent 终态刷新）置 ready 并清错。本 feature 内部的 `applyFilter(f)` 成功只写 `filter` / `filteredJobs`，失败才把共享读状态置 error。因此壳按 `ensureJobs()` + `jobs` / `listStatus` 消费时，不会因列表页先应用筛选而得到“ready 且为空”的视图。`0032fc6` 尚不满足这一点，由 T-A22c 修复（plan §2.3【r6.8】）。【T-A22c 实施后补记】`af24c82` 已按本口径实现，对外成员与签名不变；是否关闭 R3-A 待新会话 A 增量代码 Review。【增量 Review 后补记】A 判 R3-A 关闭（`review-batch3-cache-fix.md`，`69faacc`），本口径由代码与 `WI H-2 list status` 两例固定。

## 4. 不做的事（生产方边界）

- 不为壳兜底实现：不写 `app/**`、`workbench/**`、`agent/{store,AgentDock,AgentDrawer,CotTimeline}`；不提供“仅供测试”的 setter、窗口钩子或 `hasRoute` 兜底。
- 不加猜测性的竞态 / 安全防线（请求序号、去抖、单实例登记等，AGENTS §5.1）；不另建“进行中” selector（常量即契约）。
- 不改 `scripts/contract-build.mjs`（v2 plan §7.2 记为本 feature 所有，但本 feature 不需要修改它）、`check.mjs`、`package.json`。
- 本 feature 的 jobs 代码不导入 `agent/store.ts`（分析台追问经 `contracts/index.ts` 的 `agentClient.send({message, jobContext})`），因此不存在 v2 plan §7.7 所防范的初始化循环；壳的防范写法无害。

## 5. 待 v2 接收方确认 / 集成人处理（未签收，不代办）

1. `main.ts` 除 `addRoute` 外新增守卫注册与 jobsStore 订阅（本 feature 文件，壳不改），与 v2 plan §7.2 “只负责 addRoute 注册”的描述不同，需 v2 会话知悉。
2. H-4 无公开 setter → v2 T-V2-03 的条件依赖（H-3·路由切片）成立。
3. H-6 的角标样例在 job-running（j-human）/ job-conflict（j-conflict）场景，normal 场景不预置；其交付依赖 T-A21（链路较深）。是否把 H-6 拆成“场景 / 覆盖”与“角标样例”两批交接，须 v2 接收方同意，本 feature 不预设。
4. `jobFixtures` 的形状（`jobs` 按场景集合分键）与“每 client 读一次”语义；`failed` 计入进行中、`draft` 计入。
5. 待归属池位于 IntakeDrawer 内。
6. 合并注意（集成人）：`43b6d79` 不含 `specs/workbench-interaction/**`；main 的 `specs/README.md` 无本 feature 行，且仍有已完成的“D-018 → workbench-interaction 回 Clarify”待同步行（本分支已于 `c238bd8` / `8bd1b31` 完成），合并时保留本 feature 行并删除该已完成行；v2 参照分支 README 中对本 feature 的待同步行，在交付完成前保留。【r6.1】main 已前进到 `90187f7`：其 `specs/README.md` 仍无本 feature 行、仍有已完成的 D-018 行，并新增 D-020 等跨 feature 行（含“`workbench-interaction` 冻结 spec 不加 AC”）；带入时只定向导入本规格目录与本 feature 行，不整文件覆盖 main 的 `docs/**`、README 或其他 feature 规格。
7. 【r6.1，R7 S-30，仅知悉】作业内分析台追问经 `contracts/index.ts` 的 `agentClient.send({message, jobContext})` 直接发送，不经 `agent/store.ts`、不带 `sessionId`；基线 mock 为每次这样的 send 分配新的 `mock-session-*`，即**独立 mock session**，与 v2 plan §7.7 “会话 ID 沿用 v1 单会话”不同轨。壳的 `running` 由 runs 派生仍能禁发，时间线仍回放；本 feature 不改该行为，请 v2 接收方知悉。
8. 【r6.3，H-4 登记，仅知悉】H-4 的公开设置方式 = **无**：`context` 只经 `registerJobRoutes` 注册的路由守卫在导航时设置 / 清空；`useSessionStore()` 另有的 `bindRouter(router)` 只供 `registerJobRoutes` 绑定生产 router（注册守卫、不接受上下文），壳不调用、测试不以它代替导航。因此 v2 T-V2-03 / S1-ctx 对 H-3·路由切片的条件依赖成立（v2 plan §7.3 H-4 / F-05 口径）；`session.ts` 不导入 `agent/**` 与 `routes.ts`，与 v2 `send` 体内调用 `useSessionStore()` 不成环。
9. 【batch2，仅知悉 / 待集成人与 v2 所有者协调】main 已前进到 `072bb12`（PR #11，v2 S0 阶段性合入），带来三处交点：
   - `app/nav.ts` 新增名为 `jobs` 的壳占位（`placeholderOwner: 'workbench-interaction'`）。
   - v2 `e2e/shell.spec.ts` 断言 `/jobs` 为该 owner 的占位页。v2 tasks 已写明这只是 S0 证据，H-3 集成后由 T-V2-09#4 迁移为集成态。
   - 本 feature 的 `registerJobRoutes` 按 H-3 / plan §2.1 同名替换该占位。本 feature 的 `routes.spec.ts` 真实路由表用例按 pin `90187f7` 断言“新增两条、原表无 `jobs`”，同步 `072bb12` 后需按 tasks §7 重核并调整。

   本 feature 未同步该 main，不代改 v2 壳文件 / 测试；同步时点、T-V2-09#4 迁移与本 feature 测试调整的先后，由集成人与 v2 所有者协调（`converge-batch2.md` §6）。

## 6. 已登记的外部风险（不升级为本 feature 新硬阻塞）

- 【r6.1 更新】H-01 已经 PR #8 修复并完成该 feature 的 Gate 2 / Handoff（main `90187f7`；只改 `SampleChart.vue` 与 `e2e/theme.spec.ts`，对本 feature 无影响）；H-02 仍为 frontend-workbench v2 事项。下句为 r6 原文：
- frontend-workbench v1 Handoff 新发现 H-01（图注断行）/ H-02（<980 顶部导航过高，960～979×900 模块区约 215 px）未经 Walter 处置；H-02 可能影响本 feature T-G07 / M-10 在 960 视口的截图观感（T-G07 只断言无横向溢出、关键控件可达），不改变本 feature 的 AC。
- v1 M-01～M-08 为 AI 截图，人工勾选未签字；11 项 P3 已接受为后续、未修复（含 R1-03：agent store 对未知 runId 硬断言）。本会话不代批。
