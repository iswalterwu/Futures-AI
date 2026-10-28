# Feature: workbench-interaction 实施日志（implementation-log.md）

> **性质**：Implement 阶段的派工、授权、模型路由、真实基线与证据路径登记（AGENTS §6 规则 4 / 7 的“派工 / 回退简记”）。它**不是** Gate 2 Handoff、不是 `review.md`，也不是审核结论；正式 Handoff 仍按 AGENTS §2 第 11 步在 `review.md` 完成。
> **当前状态（2026-10-28 建档）**：**尚未开码**。66 个任务全部“未开始”；没有实现提交、没有运行任何产品测试、没有集成 SHA。下文“证据”各栏均为待填，不预写任何成功结果。
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
| H 组外部闸门 `frontend-workbench-v2` | **阻塞**（不变） | v2 壳方 S1 / S2 交付并集成前，T-H01～T-H04 不验收；Converge 对 AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项必报“未收敛（外部阻塞）” |

## 2. 基线、分支与工作树

| 项 | 值 | 写权限 |
|---|---|---|
| `implementation_base_sha` | `43b6d79681a49562f41751368b2ae00c24062f56`（frontend-workbench v1 正式 Handoff，PR #7 merge commit） | —（不以移动的 main 替代） |
| `upstream_start_sha` | `90187f7d8907316e554d2441d846827468c5371f`（main：PR #8 H-01 修复 + PR #9 D-020～D-024 文档）；`43b6d79` 为其祖先 | — |
| 43b6d79 → 90187f7 前端差异 | 仅 `frontend/src/modules/market-board/SampleChart.vue`、`frontend/e2e/theme.spec.ts`（H-01）；契约 / types / mock / events / `main.ts` / `app/**` / 脚本 / 锁文件 / 配置 / 既有 tests 零差异（tasks §0.0 末“r6.1 upstream 复核”） | — |
| 规格写入树 | `D:/2030/Futures-AI-interaction-resume` / `docs/workbench-interaction-resume-20261028`（本轮起点 `5e9e1f4`） | 规格作者（本轮）；不写代码 |
| 实施树 | `D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra`（自 `43b6d79` 建立，ff-only 到 `90187f7`，clean；尚无 `specs/workbench-interaction/**`） | 实施会话（Implement 模型，见 §3）；只写 tasks 修改范围内的文件 |
| 生产方集成验证树 | `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`（同上起点，clean） | **仅**集成人串行写 |
| 集成人 | 协调会话 `PI_SESSION_ID=01a18388-a371-7746-8158-9fb15d55d819`（`openai/gpt-6.1-sol`） | 串行合并、证据登记；不代做产品决策、代码实施或 A 勾选 |
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

## 6. 证据登记（实施后由集成人填写；当前全部未发生）

| 任务 / 切片 | 实施 commit | 验证命令输出摘要 | 生产方集成 SHA（`integration/workbench-interaction`，旁证） | v2 集成 SHA（④，由 v2 所有者登记） | 状态 |
|---|---|---|---|---|---|
| T-A01～T-A09、T-A09a | 未取得 | 未运行 | 未取得 | — | 未开始 |
| H-1 | 未取得 | 未运行 | 未取得 | 未取得 | 未交付 |

（其余任务按实施进度追加行；Converge 报告与 Review 结论另存，不写进本表冒充。）

## 7. 派工 / 回退记录（脱敏；只记角色、任务、基线、实际 provider/model、失败类别）

| 时间 | 角色 | 任务 | 基线 | 实际 provider/model | 结果 / 失败类别 |
|---|---|---|---|---|---|
| 2026-10-28 | Plan / Tasks 精度修订 + 开工登记 + Analyze R7 | r6.1（S-27～S-32）、tasks 页首开工状态、upstream 影响核验、本日志建档 | 规格分支 `5e9e1f4` | `anthropic/claude-opus-5-5`（`claude-bridge` 本窗口已明确 quota / rate / spend_limit 限额，按 §6 规则 5 不重试） | 文档完成；未 commit（由协调器提交）；未写代码、未跑产品测试 |
