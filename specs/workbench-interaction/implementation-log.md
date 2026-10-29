# Feature: workbench-interaction 实施日志（implementation-log.md）

> **性质**：Implement 阶段的派工、授权、模型路由、真实基线与证据路径登记（AGENTS §6 规则 4 / 7 的“派工 / 回退简记”）。它**不是** Gate 2 Handoff、不是 `review.md`，也不是审核结论；正式 Handoff 仍按 AGENTS §2 第 11 步在 `review.md` 完成。
> **当前状态（2026-10-29 第二批实施后 Converge batch2；以本行为准，下列各“当前状态”行为当时原文）**：
> - **进度**：**16 / 67 已实施**，**51 未开始**。首批 10 项（T-A01～T-A09、T-A09a）已完成，并经 `af95b66` 批次 Review，记录不改写。第二批 6 项**已实施、待本批独立代码 Review**：T-A09b `75a1159`、T-A10 `1841029`、T-A22 `cc59e94`、T-A22b `b38cf43`、T-A23 `ebce4c8`、T-A24 `27e59e6`。
> - **Checklist**：R8 未通过（`7b91a2c`，B-12 粒度）→ r6.4 拆出 T-A09b → **R8.1 通过**（`34d339eb1705310927f06d95aaf64bfc9bf4a5c3`，blob `99e096ad…`，26 / 26）。**当前有效 Checklist = R8.1 `34d339e`**（不是旧 R7 `9acf3de`）。
> - **集成**：集成人已 ff-only 并入生产方集成树 `integration/workbench-interaction` @ `27e59e6`（旁证）；未写 v2 树，H-x 的 ④ 全部缺。
> - **Converge 判定**（claude-opus-5-5 via anthropic）：本批**已收口、待独立 Review**，未新增任务。feature **未收敛**（51 项未实施 + H 组外部阻塞）；46 AC 最终验收 0。
> - **H-x 生产方证据**：H-2·标签 / H-3 / H-4 生产方具备 ①②③（③ 为待审核证据），④ 未取得 → “待消费方集成（未交付）”；H-1 维持原登记。
> - **上游**：main 已到 `072bb12`（v2 S0），本批仍 pin `90187f7`、未导入，见 `converge-batch2.md` §6。
>
> 不是全 feature Review / Gate 2 / Handoff；本行不预填本批独立 Review 结果。
> **当前状态（2026-10-29 首批独立 Review 后记账；以本行为准，下一行“待独立 Review”为当时原文）**：**10 / 66 已完成**（T-A01～T-A09、T-A09a；代码固定 `13a3373`），**独立 A 本批 Review 通过（0 P1 / P2，6 项 P3 R-A～R-F）**，审核原件 `review-batch-a09a.md` 提交于 `af95b66505875609f7ed3f823e047cd16226a1c5`，已 ff 到本文档树与生产方集成树 `integration/workbench-interaction`；“已完成”= 本批代码 Review 通过，**不表示 AC 最终验收**：46 AC 最终 **0**，其余 **56 项未开始**，feature **未收敛**（尚未实施 + H 组外部阻塞）；H-1 ①②③ 具备（③ 现含 A 亲跑）、**④ 未取得**，其余 H-x 未交付。Walter 代码实施授权与集成人指定在既有 tasks 范围内持续有效，后续批次不需重复授权；本次在首批 10 项的清晰安全点收尾汇报（非用户暂停）。下一批入口按 tasks §6 DAG：T-A10 / T-A22 / T-A23 / T-A24。P3 后续定位见 §8。不是全 feature Review / Gate 2 / Handoff。
> **当前状态（2026-10-29 Checklist R8 后 r6.4；以本行为准，下一行为当时原文）**：首批 10 / 67 已完成（不变；固定结果与 `af95b66` Review 不改写）。独立 A 的 **Checklist R8 未通过**（原件 `7b91a2c`；25 / 26，V-02 ☐；唯一 P2 = B-12 T-A10 粒度）。r6.4 只做 Tasks 层拆分：新增 **T-A09b**（R-B 种子校正，fixture-only，0.5 h，依赖 T-A08），T-A10 恢复核心 2 h（依赖 T-A09、T-A09b；标准 5 只保留真实 `getStageWorkspace` 读回 12 个种子空态）。**第二批 = T-A09b、T-A10、T-A22、T-A22b、T-A23、T-A24（6 项，约 7 h）**；任务 67 / 约 102 h，标准 / 命令 224 / 224。**blocked**：须 A 新会话 R8.1 增量复核关闭 B-12、补勾 V-02 并提交后才可开码；未写代码、未运行任何产品测试、无新 commit。R-B 落点改为 T-A09b（残留见 §8），R-D 口径不变，R-A / R-C / R-E / R-F 未处理。46 AC 最终 0；feature 未收敛；H-x 无一已交付。
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
| 第二批批次代码 Review（非全 feature Review、非 Gate 2） | **待进行**（不预填结果） | 只读输入见 `converge-batch2.md` §10；代码 diff `34d339e..27e59e6 -- frontend` |
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

## 4. 首批派工范围（待开码前置完成后执行）

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

**本批证据均为“待本批独立代码 Review”**，不是审核结论。

| 任务 / 切片 | 实施 commit | 验证命令输出摘要（实施者执行） | 生产方集成 SHA（旁证） | v2 集成 SHA（④） | 状态 |
|---|---|---|---|---|---|
| T-A09b | `75a115975b50d8078f159f2e41ce5c401318f0b7` | `WI not-started seeds` 1 / `fixtures.spec.ts` 整文件 23 pass；typecheck / lint 过 | `27e59e6`（ff-only） | — | 已实施（待本批 Review） |
| T-A10 | `1841029f5a948b53ef21cbc54967556dc04e0815` | `WI listJobs` 2 / `WI scenarios read` 33 / `WI slow` 3 / `real-stubs.spec.ts` 14 / `WI not-started seeds` 1 pass；`contract` 生成后 `contract --check` = 15 methods / 10 events / 2 artifacts；typecheck / lint 过；段末全量单测 23 文件 776 pass / 0 fail，`check` 六守卫过。**失败留痕**：场景组首跑 23 pass / 10 fail（新测试嵌套匹配器未容纳 `message` 字段）→ 只修新测试匹配器 → 33 pass | `27e59e6` | — | 同上 |
| T-A22 | `cc59e946df2d08178b03e3b37928ab34517067d7` | `WI routes` 7 / `WI register` 2 pass；typecheck / lint 过 | `27e59e6` | — | 同上 |
| T-A22b | `b38cf43f602390d7645cc84514d0da9860a7e0b7` | `WI H-4 enter` 4 / `WI H-4 leave same navigation` 3 / `WI H-4 readonly` 1 pass；typecheck / lint 过；`routes.spec.ts` 整文件 9 pass | `27e59e6` | — | 同上 |
| T-A23 | `ebce4c85b1422a62b883117f75459a1fdee81b80` | `WI status badges` 18 / `WI source badge` 9 pass；`check --only colors` / `glass`、typecheck / lint 过；`contract-labels.spec.ts -t "WI labels"` 10 pass（H-2 旁证）。**失败留痕**：首跑 16 fail / 2 pass（新测试选择器把根 `<span>` 纳入索引）→ 只修新测试选择器 → 全过 | `27e59e6` | — | 同上 |
| T-A24 | `27e59e610e2ab8c14e7c3db554609e52e40f5f76` | `WI lcs` 6 / `WI limit` 7 pass；typecheck / lint 过；依赖未改 | `27e59e6` | — | 同上 |
| 本批末轮联合回归 | `27e59e6` | 全量 `test:unit` **27 文件 833 pass / 0 fail**；`check` 六守卫过；`contract --check` 15 / 10 / 2；typecheck、lint（0 warning）过；`test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` **24 pass / 0 fail**（先确认 4173 空闲，Playwright 自管 webServer，结束后空闲；未下载浏览器）；保护目录零差异 | `27e59e6` | — | — |
| H-2·标签 | ① `ebce4c8`（含 T-A01 `07ef7cc`） | ③ `WI labels` 10、`badges.spec.ts -t "WI status badges"` 18 pass（待审核证据）；② R8.1 `34d339e` | `27e59e6`（**旁证，不是 ④**） | **未取得** | **待消费方集成（未交付）**：生产方 3 / 4 |
| H-3·路由切片 | ① `cc59e94` | ③ `routes.spec.ts` 7 / 2 pass（待审核证据）；② R8.1 | `27e59e6`（旁证） | **未取得** | **待消费方集成（未交付）**：生产方 3 / 4；页面为骨架 |
| H-4 | ① `b38cf43` | ③ `session-context.spec.ts` 4 / 3 / 1 pass（待审核证据）；② R8.1 | `27e59e6`（旁证） | **未取得** | **待消费方集成（未交付）**：生产方 3 / 4 |
| H-2·列表 / H-6 / H-5 / 页面切片 | 部分前置（T-A10 读 API 等） | 部分 | — | 未取得 | 未交付：H-2·列表缺 T-A12 / T-A22a；H-6 缺 T-A11 / T-A21；H-5 未做；页面切片缺 B / C 组 |
| 其余任务（51 项） | 未取得 | 未运行 | 未取得 | — | 未开始 |

本批 Converge 报告 = `converge-batch2.md`（由集成人提交后以其 SHA 为准）。H-1 行保持上表首批登记不变。

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

**下一步（不在本记账内执行）**：集成人按 tasks §6 DAG 派第二批（入口 T-A10 / T-A22 / T-A23 / T-A24；Implement 首选 `openai/gpt-6-astra`，新会话、实施树），开工前读本节对应项；H-1 ④ 待 `integration/frontend-workbench-v2` 所有者真正集成后由其登记，本 feature 不代写。

## 9. 第二批派工准备（r6.3，2026-10-29；r6.4 按 Checklist R8 B-12 拆分后更新；待实施，不预写结果）

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
- **复核建议（r6.3 原文）**：R-B（A 首批 Review 自身建议的落法）、R-D（不扩机制）、T-A22 / T-A24 不需开码前另行 A 复核；T-A23（tasks §7 所指“基线事实与任务文字不符”一类）与 H-4 `bindRouter`（交接接口新增公开成员名；R7 审过机制、未审该名称）建议由审核员 A（新会话、异模型）对 r6.3 文档 diff 做一次**限定范围定向复核**（只审这两处 + R-B 落点）并提交 SHA 后，再开 T-A22b / T-A23 的代码；T-A10 / T-A22 / T-A24 可先开工。若要以本批代码 Review 替代该定向复核，属 Walter / 集成人裁量，本文件不代定；不声称 R7 自动覆盖 r6.3。
