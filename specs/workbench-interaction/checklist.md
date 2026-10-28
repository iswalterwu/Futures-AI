# Feature: workbench-interaction 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求 / 设计质量达标，不代表实施完成。实施者不勾选本文件。
>
> **审核员**：A = claude-fable-5-1 **via anthropic**（`--model anthropic/claude-fable-5-1`），独立新会话，与实施模型隔离。
> **R7 通道（2026-10-28，恢复轮 r6 定向复核）**：A = claude-fable-5-1 via anthropic，新开独立会话。本窗口协调器对 `claude-bridge/claude-opus-5-5` 的真实最小调用 exit 1（quota / rate / spend_limit 类，错误原文未记录），bridge 通道在本限额窗口已明确限额，按 AGENTS.md §6 规则 5 不重试；**fable 未单独重探 bridge，不声称 fable bridge 探活成功**；`anthropic/claude-fable-5-1` 最小真实调用 exit 0，本轮实际任务走该通道。被审作者 = claude-opus-5-5 via anthropic（Plan r6 / Tasks r6 / Analyze R6 / interface-handoff），与 A 异模型、隔离。未改任何 provider / key / 路由 / 全局配置，不因审核结果换模型。
> **R6 通道（2026-10-28）**：A = claude-fable-5-1 via anthropic。继承本限额窗口 R3 / R4 / R5 的可用通道证据（`claude-bridge` 对 fable 已为 quota / rate / spend_limit 类失败，exit 1；`anthropic/claude-fable-5-1` 成功），按 AGENTS.md §6 规则 5 **本轮未重探 bridge、未换模型、未改任何 provider / 路由 / 配置**。Tasks r5 / Analyze R5 作者为 claude-opus-5-5 via anthropic（独立会话、不同模型），与 A 隔离。只因正常审核结果修正文档，不换模型找通过。
> **R5 通道（2026-10-28）**：A = claude-fable-5-1 via anthropic。继承本限额窗口 R3 的探活证据（`claude-bridge/claude-fable-5-1` 失败：quota / rate / spend_limit 类，exit 1；`anthropic/claude-fable-5-1` 成功，exit 0；R4 亦经 anthropic 实际完成），按 AGENTS.md §6 规则 5 **本轮未重探 bridge、未换模型、未改任何 provider / 路由 / 配置**。Tasks / Analyze 作者为 claude-opus-5-5 via anthropic（独立会话、不同模型），与 A 隔离。
> **R4 通道（2026-10-28）**：A = claude-fable-5-1 via anthropic。继承本限额窗口 R3 调度会话的探活证据——`claude-bridge/claude-fable-5-1` 已失败（quota / rate / spend_limit 类，exit 1）、`anthropic/claude-fable-5-1` 成功（exit 0）；按 AGENTS.md §6 规则 5 不在同一限额窗口重试已耗尽通道，**本轮未再发起 claude-bridge 探活**，直接走 anthropic；只换通道不换模型，未改任何 provider / 路由 / 配置。Plan 补正者为 claude-opus-5-5 via anthropic（独立会话、不同模型），与 A 隔离。
> **切换原因**（R3，2026-10-28）：调度会话按 AGENTS.md §6 规则 2/5 做本轮最小真实探活——`claude-bridge/claude-fable-5-1` 失败（quota / rate / spend_limit 类，exit 1），`anthropic/claude-fable-5-1` 成功（exit 0）；按 §6 只换同一模型的接入通道，不换模型、不在本限额窗口内重试 bridge；审核员身份不变。（R2 时的切换原因同类，当时依据为 AGENTS.md §2 第 5 步旧文，现并入 §6。）
> **单审**（AGENTS.md §2 第 5 步、§6）：本文件结论即审核结论。
>
> **文件结构**：§R7 为**当前有效结论与勾选**（唯一参与 Implement 前置判定的复选框；审查对象固定为提交 `0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d`，覆盖 r6 接口精化与实施基线登记）；§R6、§R5、§R4、§R3、§R2、§R1 为历史快照（内容原样保留，其复选框均已改为 ☐ / ☑ 文字，**不参与**当前判定；R3 的 3 项 ☐ 表示 R3 当时未闭环的 B-09 / B-10，R4 已关闭；R5 的 1 项 ☐（P-1）表示 R5 当时未闭环的 B-11，R6 已关闭；R6 的 26 ☑ 只覆盖 r5 设计，其“`implementation_base_sha = PENDING` / Implement 不得开工直到合入 main 的 commit 登记”为 R6 时点原文，基线门已由 `43b6d79` 满足——以 §R7 为准）。
> 阶段不适用项（Tasks / Analyze / 代码级 / Handoff 截图）统一放在当前轮「阶段说明」，以文字说明而非复选框，避免未来项造成流程死锁；Tasks 产出后由 A 另开会话复核并补勾。

---

# R7（2026-10-28，第七轮：r6 接口精化 + 实施基线登记的定向复核）

## 基线与范围

- **审查对象（固定）**：`0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d`（`docs(workbench-interaction): register merged v1 base and H-x producer design`；唯一父提交 = R6 暂停快照 `8af343ff085c0f958068b6b50008a6985f51d170`）。本审核员工作树 `D:/2030/Futures-AI-interaction-review-r7`，分支 `review/workbench-interaction-resume-r7`，HEAD = 审查对象；启动时 `git status --short` 为空。真实 diff `git diff 8af343ff 0e37fbf9`：5 文件 +458 / −144——`specs/README.md`（本 feature 行 + 新增一条跨 feature 待同步行）、`plan.md`（7 处 hunk：页首 r6 记录、§1 唯一修改者行、§1.1 r6 基线登记、§2.1 缺省 stage 与 `registerJobRoutes` / `afterEach`、§2.3 三个 store 行 + “写后统一刷新”段 + fixture 初始条目、§2.4 `JobListItem` 固定字段 + `ActiveJobStatus` 行 + `jobFixtures` 语义、§6 回滚、§7 第 4 条状态更新 + 第 5 条）、`tasks.md`（页首当前状态块 / IMPL-GATE-R6 / H-x 状态 / r6 阶段与修订记录、§0.0 r6 基线审计表、§1-5 所有权与 §1-9 写后统一刷新、§2a 切片→任务表、§3 H-5 容器句、T-A01 / A02 / A07 / A09 / A10 / A11 / A18 / A21 / A22 / B01～B04 / C01～C04 / E03 / G02 / G04 精化、新增 T-A09a / A22a / A22b / C01a、§5 矩阵部分前置列、§6 / §7）、`interface-handoff.md`（新建 99 行）、`analyze.md`（追加 Analyze R6 节 + 页首当前结论）。**spec.md、本文件（含 R6）、`checklist-review-request.md`、HANDOFF.md、`docs/**`、AGENTS.md、`frontend/**`、`backend/**` 为 0 差异。**
- **只读参照 1（实施基线）**：`D:/2030/Futures-AI-interaction-base-43b6d79`，detached HEAD `43b6d79681a49562f41751368b2ae00c24062f56`。本审核员独立核实：该提交为 merge commit（父 `3bf6476` + `eba5002`，标题“Merge PR #7: frontend-workbench v1（Gate 2 已确认，Handoff）”，提交时间 2026-10-28 16:49:38 +04:00 = 12:49:38Z，与协调器所报 mergedAt 一致）；本工作树仓库 `origin/main` 恰为该 SHA，`git merge-base --is-ancestor 43b6d79 origin/main` 成功。本会话**未调用 `gh`、未 fetch**，`gh pr view 7` = MERGED 这一项沿用协调器记录。另核：审查对象 `0e37fbf` 与 `43b6d79` 的 merge-base 为 `3bf6476`，即规格分支**不含** `43b6d79`、main 也不含 `specs/workbench-interaction/**`（与 tasks 页首、interface-handoff §5-6 的说明一致）。
- **只读参照 2（消费方）**：`D:/2030/Futures-AI-interaction-v2-ref-ded7161`，detached HEAD `ded716100381fcd2b4b5d3481f4f56e44c9869fd`（`WIP: pause frontend-workbench v2 …`）。读 `specs/frontend-workbench/plan.md` §7.2 / §7.3 / §7.4 / §7.5 / §7.6 / §7.7 / §7.13、`tasks.md` v2 §1.1 / §1.2 / §3 / §4 / §5 与 T-V2-03 / 05 / 06 / 09 原文；v2.1 Gate 1 按已批准处理。
- **重读**（本轮开始时重新读取，不依赖任何会话记忆）：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md` 全文、spec.md 全文（v1.1，46 AC 独立计数：5+5+6+5+6+8+5+4+2）、plan.md 全文（r6）、tasks.md 全文（r6，分五段读完 1240 行）、analyze.md 全文（R1～R6）、interface-handoff.md 全文、本文件 R6 全文与 R1～R5 结构、`templates/tasks.md`、`docs/interaction.md` §3.3～§3.5、`docs/designUI.md` §3（:73 顶栏“投放”归壳层）、D-018 ADR（§1 定稿 draft/final、不自动、不可撤销；派生“内部生成”）。
- **实施基线真实代码（`43b6d79`，逐文件读）**：`frontend/src/main.ts`（`agentClient.subscribe(useAgentStore(pinia).receive)` 在 `app.use(pinia).use(router).mount` 之前，卸载 / HMR 解除——T-A22a 订阅先例成立）；`src/contracts/index.ts`（`dataClient` / `agentClient` 为**两个独立工厂各自创建的模块级单例**）；`mock/index.ts`（`MockOverrides{fixtures?,agentScript?}`，`fixtures` 每次请求读取整键替换；`readScenario()` 每个 client 创建时读一次；`send` 受理时经 `AgentRunSchema` 预算全部事件再按 `afterMs` 逐个 `setTimeout` 直投监听者；`delayScenario` 1500 ms）；`src/agent/events.ts`（十类事件共享 `eventFields`，从 `contracts/types.ts` 单向导入）；`src/agent/store.ts`（`send` 只传 `{sessionId,message}`；`receive` 对 `run.started` 追加 run）；`src/app/router.ts`（由 `navItems` 生成 + `/` + 兜底，无任何 `beforeEach`，**无 `jobs` 占位**）、`nav.ts`（八项，含 `research`）；`tests/unit/mock.spec.ts:15 / :34 / :94-99（按索引配对循环）/ :100（`'1.0.0'`）`、`contracts.spec.ts:248-253`、`contract-doc.spec.ts:63-64`；`tests/component/focus-band.spec.ts:108-111`（新建 client + 系统边界 spy 委托）；`package.json` 脚本与版本、`vitest.config.ts`（`clearMocks / restoreMocks`）、`tests/setup.ts`、`scripts/check.mjs`（glass 允许名单三类、network 只许 `src/contracts/real/`）、`src/design/glass.css`（`.glass-drawer` 存在）；`specs/frontend-workbench/review.md` 页首 / §8 / §9（Gate 2 确认、11 项 P3 接受未修复、M-01～M-08 为 AI 截图、H-01 / H-02 未经 Walter 处置）；`git diff 8af343f 43b6d79 -- AGENTS.md docs specs/README.md`（仅 `docs/plan.md` D-015、`designUI.md`、新 ADR `20261027-updown-scope.md`、README 两行）。tasks §0.0 B-1～B-11 逐项与真实文件一致，未发现作者漏记或误记。
- **审核员与通道**：A = **claude-fable-5-1 via anthropic**，新开独立会话，与作者（claude-opus-5-5 via anthropic）异模型、隔离。通道原因（脱敏）：本窗口协调器对 `claude-bridge/claude-opus-5-5` 的真实最小调用 exit 1（quota / rate / spend_limit 类，错误原文未记录），bridge 通道在本限额窗口已明确限额，按 AGENTS §6 规则 5 不重试；**fable 未单独重探 bridge，不声称 fable bridge 探活成功**；`anthropic/claude-fable-5-1` 最小真实调用 exit 0，本轮实际任务即走该通道。未改任何 provider / key / 路由 / 全局配置，不因审核结果换模型。
- **未执行**：未安装依赖、未运行应用 / 构建 / 任何产品测试、未启动子 agent / 服务 / 下载、未读凭证或全局配置、未 fetch / commit / push / PR / merge、未写入任何其他 worktree、未修改 plan / tasks / analyze / interface-handoff / spec / README / HANDOFF / docs / 代码。结构复算用 `python -` 标准输入一次性脚本只读完成；为避免长编辑被截断，在独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-resume-01a18388-dmiq93ec/` 写入 `r7-checklist-section.md`、`r7-tasks.pkl`、`r7-order.pkl` 三个 r7 命名片段（非项目产物、不入库、不清理）。唯一写入的仓库文件为本文件（新增 §R7、页首两处说明、把 §R6 的 26 个 `[x]` 改为 ☑ 文字并在其标题补“历史快照”；R6 其余内容未动）。

## 结论（R7）：**通过**（定向；r6 接口精化与基线登记的设计质量达标，26 / 26 有效项勾选；**无 P1 / P2**，6 项 P3 建议 S-27～S-32 不阻断）——**Implement 仍 BLOCKED**（IMPL-GATE-R6 的 (2) Walter 代码实施授权与 (3) 集成人 / 集成验证分支 / 实施 worktree 登记未取得；H 组另待 v2 壳方 S1 / S2）

本结论的边界（必须同时成立，不得单独引用）：

1. 通过 = r6 的 plan / tasks / analyze / interface-handoff **文档与设计质量**通过，且 r6 新增内容未越出冻结 spec v1.1 的需求边界。**不等于**可立即实施、不等于任何产品 AC 已验证、不等于 Handoff / Gate 2、不等于 H-1～H-6 / 页面切片任一已交付（四项登记全部“未取得”，作者如实登记，本轮核对无误）。没有任何测试被运行；“未写出来的测试”不是证据。
2. 本审核员**不代 Walter** 批准代码实施授权，不代 v2 接收方签收 interface-handoff §5 各项，不代 frontend-workbench 处置 H-01 / H-02 或签字人工截图。
3. 本轮只解除 IMPL-GATE-R6 的第 (1) 项（A 定向复核），且以本文件**被协调器 / 实施侧提交后的 SHA** 为准（本审核员不 commit）；(2)(3) 由 Walter / 集成人另行满足。

## 独立核验（不照单全收作者结论）

### 1. 实施基线与 §0 事实

| 项 | 作者声称 | 独立核实 | 判定 |
|---|---|---|---|
| `implementation_base_sha` | `43b6d79` = PR #7 merge commit，origin/main | 本地 `git log -1` 为双亲 merge、标题含“Merge PR #7”、时间 12:49:38Z；本仓库 `origin/main` == `43b6d79`；is-ancestor 成立 | ✓（`gh` 结果沿用协调器，本会话不调用） |
| 规格文档不在 main | `specs/workbench-interaction/**` 不在 `43b6d79` | `ls specs/` 于基线目录只有 README / data-layer / frontend-workbench / settings；merge-base(`0e37fbf`, `43b6d79`) = `3bf6476` | ✓ 集成人须带入规格（interface-handoff §5-6 已写） |
| B-7 唯一实质差异 | `mock.spec.ts:96-99` 按索引配对循环 | 真实行 :94-99：`for (const [index, method] of Object.values(dataMethods).entries()) expect(method.result.safeParse(results[index])…)`；方法数增加后第 11 个起 `results[index]` 为 `undefined` → 失败。T-A09 修改范围已写“只遍历 v1 十个方法键” | ✓ 真实差异、落点正确、仍在 S-20 所有权内 |
| B-10 `main.ts` 订阅先例 / 路由无 `jobs` 占位 | 如 §0.0 | 代码一致；`router.ts` 无 `beforeEach`（与 H-4 用 `afterEach` 的充分性相关，见 S-28 旁注） | ✓ |
| B-1 / B-11 v1 遗留与文档差异 | H-01 / H-02 未处置、AI 截图、11 P3；docs 仅 D-015 / ADR | review.md 页首 / §8 / §9、`git diff --stat` 一致 | ✓ 登记而不升级为本 feature 阻塞，口径正确 |
| 旧措辞区分 | “草案 r5 / PENDING / 待 Gate 1”为历史 | tasks 页首当前状态块、§0.1 “历史证据”标题、analyze 页首与 R6 节、plan §1.1 新增行均明示“以本块为准”；本文件 R6 的“PENDING / 不得开工直到…”为 R6 时点原文 | ✓ 已正确区分；本轮不改历史原文 |

### 2. 需求边界（是否需要 Clarify / 重过 Gate 1）

逐项独立判断 interface-handoff §2 的全部“缺口 → r6 落点”：

| r6 新增 | 归属判断 | 结论 |
|---|---|---|
| `ACTIVE_JOB_STATUSES` = JobStatus − {delivered, cancelled} | 对既有 9 状态的分组口径，供 v2 R-003 作业轨道消费；spec R-008“契约扩展”+ plan §1 既有“v2 的契约字段需求由本 feature 写入”；不新增状态、不改任何 AC 判据；领域只读门本就只封 delivered / cancelled（T-A17），failed 可经 rerunStage 继续（plan rerun 表）故计入“进行中”自洽 | 契约精度，不回流。`failed` 计入是产品可见的口径选择，已在 interface-handoff §5-4 交 v2 接收方知悉，妥当 |
| jobsStore `jobs / listStatus / listError / ensureJobs / refresh / applyFilter / filteredJobs / createJob / receiveAgentEvent` + §1-9 写后统一刷新 | plan §2.3 原文“写回执 / agent 通知后重新读取，不做轮询”的机制落地；本 feature 自身 AC-002-4 / 006-6 / 007-2 e2e 亦需要 | 机制精度，不回流 |
| `JobListItem` 固定字段（含 `subject` / `reason`） | 摘要字段固定，是 R-001 列表字段的子集 | 不回流 |
| `registerJobRoutes(router, pinia)` + `afterEach` 守卫、sessionStore 只读无 setter | plan §2.1 / §2.3 既有“sessionStore 提供当前上下文”的设置 / 清空时机 | 不回流 |
| intakeStore `open(jobId?)` 快照 / `close` / `isOpen` / `jobId`；IntakeDrawer `.glass-drawer` 填满容器、无 fixed / 遮罩 / `aria-modal` / 焦点锁、关闭不导航不调 agent | spec R-007 “无模态”与 plan §2.2 “非模态抽屉、无遮罩、无焦点锁”的容器约定精度 | 不回流 |
| 待归属池放在 IntakeDrawer 内 | spec R-003 只要求“进入待归属池，可从池中归入”，位置未定；AC-003-5 判据不变 | R-003 内位置精化，不回流 |
| `jobs.json` 按场景集合分键、`jobFixtures` 整文件替换、每 client 状态建立时读一次、有覆盖时只在内存 | R-008 mock 与场景机制 | 不回流（时机与 v1 `fixtures` 不同，见 S-27） |
| fixture 初始状态应用同一收件箱生成规则 | AC-007-4 本就需要“待处理介入角标出现”的样例；同一规则复用，无新机制 | 不回流（j-failed 口径见 S-29） |
| T-A18 拆出 T-A09a | 纯任务拆分；H-1 不再等状态层（S-22 原建议） | 不回流 |

**结论**：与作者 / Analyze R6 一致——**无需求变更，不需回流 Clarify / 重过 Gate 1**；这是本审核员独立核验后的结论，不是采信作者自报。

### 3. H-1～H-6 设计衔接（逐项）

- **H-1 / T-A09a**：依赖 A02（`JobContextSchema`）与 A09（`CONTRACT_VERSION='2.0.0'`，同文件 `mock/index.ts` 的 `jobFixtures` 解析先行）；不再依赖 A10～A17。`events.ts` 的 `eventFields` 是十类事件共享对象（真实代码核实），加一处即十类同得；`events.ts → contracts/types.ts` 单向导入，引用 `JobContextSchema` 不成环。mock `send` 预算事件后再投递，故“不带时不出现该键”“后一次 send 不改前一 run 已投递事件”在现有结构下自然成立；T-A18 命令 4 复跑 H-1 测试防回归。H-1 最早可交接点 = A09a（祖先 A01～A09，脚本核实）。**可实施、无矛盾**。
- **H-2·列表 / T-A22a**：缓存只读、`ensureJobs` 仅 idle、`refresh` 不回 loading、`applyFilter` 不覆盖、`createJob` 为随交付的写 action（符合 v2 tasks §1.2 F-04“不能用 inbox / intake 冒充”）、`receiveAgentEvent` 只对带 `jobContext` 的终态刷新、`main.ts` 一行订阅沿用先例、测试真实 Pinia + 真实 mock + 边界 spy（§5.6）。与 v2 §7.5 的壳用法（挂载 ensure、重试 refresh、`listError.code/message` 入诊断、集合 = 常量作用于 `jobs`）逐条对得上。“终态才刷新”的充分性：按 plan §4.7 / rerun 表 / S-15，状态层只在**写方法受理时**与**终态事件**改变作业摘要（送出 send 不改阶段态，“静态 R 与 activeRunId 不混淆”），终态时状态层先处理后通知，故刷新读到的是处理后状态；排队重跑亦在前一 run 终态处理后才启动。**成立，但该不变量目前只是推论**，见 S-28。
- **H-3 / T-A22**：只依赖 A01；`addRoute` 同名替换为 vue-router 既有语义；`43b6d79` 无 `jobs` 占位（v2 前为新增），T-A22 标准 2 用含占位的测试路由验证替换、用真实路由表验证新增无重复，覆盖两态。`registerJobRoutes` 在 `app.use(router)` 之前调用，使 `afterEach` 在初始导航前已注册（直达 `/jobs/:id/:stage` 刷新即能设置上下文）。**可实施**。
- **H-4 / T-A22b**：`context` 只读、无公开 setter、只由 `afterEach` 设置 / 清空；`afterEach` 在导航确认后同步执行、早于组件卸载，满足 v2“同一次导航内同步清空”；基线路由无 `beforeEach`，不存在导航被中止却按 `to` 设置的情形（不为猜测情形加 failure 分支，§5.1）。缺省 / 未知 stage 由 T-B04 `router.replace` 补齐后守卫再设置——与 plan §2.1 新增句一致；在此之前 context 为 null，与 T-A22b 标准 1 一致。无 setter → v2 T-V2-03 条件依赖 H-3·路由切片，v2 tasks §1.2 已预设此分支，interface-handoff §5-2 已登记。**无矛盾**。
- **H-5 / T-C01 + T-C01a**：`open(jobId?)` 快照、提交用快照、`close()` 不导航且 `agentClient.send` 透传 spy 0 次、根 `.glass-drawer` 填满父容器、无 fixed / 遮罩 / `aria-modal` / 焦点锁；v2 前两页互斥路由视图各自提供容器并挂载，v2 后 AppShell `.intake-slot` 挂载、T-H01 从本 feature 自有页面移除（R6 已接受的 B-11 (a) 结构未回退，双挂载窗口仍由集成人串行合并收口，不加运行时机制）。**无矛盾**。
- **H-6 / T-A07 + A09 + A10 + A11 + A21**：整集合替换（“+ 一项”“只含 delivered / cancelled”两例在 T-A09 标准 4 / T-A10 标准 2 分层断言，AR6-1 的依赖倒置已修正且本轮核实 T-A09 只断言解析结果）、每 client 读一次、有覆盖时不读写 `fai.jobs.v1` / `fai.inbox.v1`（T-A11 标准 4 Storage spy 计数为 0）、缺工作区样例返回带阶段空工作区、初始角标样例 j-human（job-running）/ j-conflict（job-conflict）由 T-A21 标准 5 断言。v2 T-V2-06 第二种空态（只含非进行中作业）与 T-V2-09 #2（`addInitScript` 注入新增一项）在“每 client 读一次”下可行；v2 组件测试若在 client 创建后才设置 `window.__FAI_MOCK__.jobFixtures`，须沿用新建 client + 边界 spy 的 v1 写法——这一点 interface-handoff §3 / §5-4 已写明。是否把 H-6 拆“场景 / 覆盖”与“角标样例”两批交接，作者正确地留给 v2 接收方（§5-3），未预设。**无矛盾**，细节见 S-27 / S-29。
- **页面切片**：B01 / B02 / B04 / C01 / C01a / C02 / C03 / C04；最早可交接点 = C04 之后（祖先含 A22a、C01a），与 §6 一致。

### 4. 工程准则（AGENTS §5）与所有权

- §5.1：r6 新增全部为最小机制——`refresh()` 单一入口、显式“不加请求序号 / 去抖 / 事件总线 / 单实例登记”、守卫约十行、intakeStore 快照一字段、种子复用既有生成规则；无未经 Walter 同意的猜测性防线。
- §5.2：`jobFixtures` 在状态建立时一次边界校验（validation_error）；表单复用契约 schema；组件不复校验（tasks §1-7 未变）。
- §5.3：`registerJobRoutes` 既供 `main.ts` 又供 v2 / 本 feature 测试（真实 router + 真实 routes）使用，是可复用入口，不是只用一次的提前抽象。
- §5.6：T-A22a / T-A22b / T-C01a 全部“真实 Pinia + 真实 mock client / 真实 memory-history router + 系统边界 spy”，不 `vi.mock` 内部模块，不造测试专用 setter。
- 所有权 / 回滚：`main.ts` 由“只加路由注册”扩为“路由 + 守卫 + jobsStore 订阅”，plan §1 / §6 同步，v2 §7.2 仍写“只负责 `addRoute`”——文件归本 feature，差异已在 interface-handoff §5-1 请 v2 知悉；`agent/events.ts` 只加可选字段；壳方文件零修改（任务修改范围脚本扫描：无 `src/app/**`、`WorkbenchPage`、agent store / UI、`contract-build.mjs`、`check.mjs`）。

### 5. 任务结构独立复算（脚本，只读；不照抄作者数字）

- **66 个任务**、编号唯一、排序满足 “T-Xnn < T-Xnna/b < T-X(nn+1)”；每项预估 1～2 h（≤2 h：0 例外）；合计 **101.5 h**（A 27·42.5 / B 7·10.5 / C 5·7.5 / D 3·5 / E 3·5.5 / F 7·12 / G 10·14.5 / H 4·4）——与作者数字相同。
- 依赖（剔除括号内“不再依赖 T-A10”一类说明文字后）全部指向排序更早的任务：0 例外、无环。T-A22 实依赖仅 A01；T-A18 依赖 A09a / A14 / A16 / A17；T-A22a 依赖 A09a / A10 / A12 / A22；T-A22b 依赖 A02 / A22；T-C01a 依赖 C01；T-C03 另依赖 C01a；T-E03 另依赖 A22b；T-G04 另依赖 C01a。
- 66 / 66 “状态：未开始”，66 / 66 `blocked_by: IMPL-GATE-R6`；H 4 / 4 另带 `frontend-workbench-v2`，非 H 0。
- 完成标准 **220** 条 ↔ 验证命令 **220** 条，逐任务 1:1（0 例外）；每条完成标准含 AC 引用或“spec §4 约束 / 随 AC-009-1”口径（0 例外）。
- §5 矩阵 46 行，AC 集合 == spec 46 条（独立从 spec 提取比对，差集为空）；“部分前置”均为最终任务的祖先（0 例外）；任务正文引用的 AC 与矩阵行、矩阵列出的任务与其正文引用**双向一致**（0 例外；AC-009-1 工程门按矩阵说明处理）；T-G06 / T-G09 以全部 A～F 任务为祖先；T-G10 以 T-G09 为祖先；T-H04 以 H01～H03 为祖先。
- spec 标“端到端”的 AC 共 **18** 条，最终命令全部为 `test:e2e e2e/jobs/…`（Analyze R6 已订正 R6 的“17”为计数笔误，本轮独立计数亦为 18）。
- `-t` / `-g` 标题 **213** 处 = 211 处 `WI` 开头 + 2 处 §1 命令形态 `<标题>` 占位符；单测 / e2e 路径全部限定 `tests/{unit,component}/jobs/**`、`e2e/jobs/**`，唯一例外仍是 T-A09 命令 3 有意整文件跑 `tests/unit/{contracts,contract-doc,mock}.spec.ts`。
- interface-handoff §1 / tasks §2a 的切片 → 任务映射与定向测试标题逐项对拍：H-1（A02 / A09 / A09a；`agent-context-contract.spec`、`contract-version.spec -t "WI scenarios"`）、H-2·标签（A01 / A23）、H-2·列表（A01 / A02 / A10 / A12 / A22a；`-t "WI H-2"` 命中 4 条）、H-3（A22）、页面切片（8 任务）、H-4（A22b；`-t "WI H-4"` 命中 3 条）、H-5（C01 / C01a；`-t "WI H-5"` 命中 3 条）、H-6（A07 / A09 / A10 / A11 / A21；三条命令标题均存在）——两表一致，标题均真实存在于对应任务命令中。§6 “最早可交接点”六项与祖先集合一致。
- 最终全量：T-G09 `pnpm -C frontend test`（v2 后 T-H04 复跑）；T-G10 截图归 Handoff；Converge 口径“未收敛（外部阻塞）”未变。

### 6. 未回退核对（D-018 与旧闭环）

diff 的删除行中无一落在 plan §2.4 `Deliverable` / `FinalSnapshot` / `Revision` / `InboxItem`、§3 持久化、§4.5～§4.7、rerun 迁移表、动作矩阵、九场景表、十样例表，或 tasks §3 范围边界、T-A17、T-F01、T-F07、T-G06（仅 T-A18 标准 4 拆分改写、T-A21 预估 / 标准 5 新增）。独立核对：定稿 draft / final 三锚（`finalSnapshotId / finalRevisionNumber / finalizedAt`）与 `FinalSnapshot` 一致、`publishedAt`（材料发布日期）≠ `finalizedAt`（定稿时间）、同一次 commit 原子提交与未决项拒绝、定稿 / 取消后领域只读且无反向方法、`OriginLabel.derived.text='内部生成'`、六类块与编辑边界、有 activeRunId 时的 overlay / 仅匹配 `pendingRunId` 的终态才合并、S-15 / S-23 不接任口径、B-11 (a) 无登记机制——**全部原样**。R6 的 S-25（基线后刷新 §0）已由 §0.0 落实；S-26 为 R5 算术笔误说明，不涉及本轮。

## 阻断项（R7）

**无。** 未发现 P1 / P2 级设计问题；下列 P3 建议不阻断、不计入判定，可作为后续 Tasks 层微调或 Converge 核对项，由作者自行决定是否吸收（本审核员不替作者修设计）。

## 非阻断建议（R7；均为 P3）

| # | 位置 | 说明 | 建议归类 |
|---|---|---|---|
| S-27 | plan §2.4 `jobFixtures` 句、tasks T-A10 / T-A18 修改范围、interface-handoff §3 `MockOverrides.jobFixtures` 行 | r6 新句“在每个 mock DataClient 的会话状态建立时读取一次”与 plan §2.3 “契约 mock 层持有唯一可变状态”、§2.4 “mock DataClient 与 AgentClient 共享 `job-state.ts`”同时成立的唯一方式，是 `job-state.ts` 为**模块级单例会话状态**：`createMockDataClient()` 调用时重建该单例（读 scenario / `jobFixtures` 各一次），`createMockAgentClient()` 与所有 DataClient 实例共用当前单例（基线 `contracts/index.ts` 中两者是独立工厂创建的单例，无相互引用）。现文字可被读成“每个 DataClient 实例各持一份状态”，到 T-A18 接入 AgentClient 时才会发现无法共享。建议在 T-A10 修改范围写明上述一句（无新机制，仅定语义）。同一处顺带点明：`jobFixtures` 为“建状态时读一次”，与 v1 `fixtures` “每次请求读取”**时机不同**，消费方组件测试须新建 client + 边界 spy（§5-4 已登记，此处只是把差异写进接口行） | Tasks 层措辞 |
| S-28 | tasks T-A18 / T-A22a 标准 4；plan §4.7 | “只对带 `jobContext` 的终态事件刷新”足够的前提是：状态层只在**写方法受理**与**终态事件**两处改变作业摘要（阶段态 / `status` / `updatedAt` / `pendingCount` / 顺序），非终态事件与 send 受理不改摘要。现设计满足这一点，但它只是从 plan §4.7 / rerun 表 / S-15 推出的隐含不变量，没有任何一条标准断言它。建议 T-A18 标准 4 补半句“非终态事件处理前后 `listJobs()` / `getJob()` 结果不变”，或 plan §4.7 加一句不变量；二选一即可。旁注：基线路由无 `beforeEach`，H-4 `afterEach` 不处理 `failure` 参数是正确的最小实现，不要为此加分支 | Tasks 层（测试断言） |
| S-29 | plan §2.3 fixture 种子句、tasks T-A07 / T-A21 标准 5、interface-handoff §5-3 | normal 的 j-failed 四阶段为 D,D,**C**,N；种子规则为“预置的 H 阶段 / conflict **产物**各一条未读条目”。若 T-A07 把 j-failed 的分析产物也写成 `conflict`，normal 场景就会预置角标，与 §5-3 “normal 场景不预置”矛盾；若只是阶段态 conflict（S-14：运行失败以 conflict 呈现）而产物为 draft，则不矛盾。建议 T-A07 明写 j-failed 的分析产物 status（建议 draft，仅阶段态 conflict + reason），T-A21 标准 5 顺带列出 j-failed / j-cancelled 的 `pendingCount` 期望值，消除歧义 | Tasks 层（fixture 口径） |
| S-30 | plan 动作矩阵“追问”行（“同时由抽屉 send 保留上下文”）、tasks T-E03、interface-handoff §4 | r6 在 §4 明确“jobs 代码不导入 `agent/store.ts`，分析台追问经 `contracts/index.ts` 的 `agentClient.send({message, jobContext})`”。后果：这类 send 不带 `sessionId`，基线 mock 会为每次 send 分配新 `mock-session-*`，与 v2 §7.7 “会话 ID 沿用 v1 的单会话”不同轨；壳的 `running` 由 runs 派生仍能禁发，时间线仍回放（T-E03 标准 2 成立），S-15 已覆盖并发第二 run。属 r5 既有设计（R6 已过），本轮只指出两处措辞应对齐：矩阵“由抽屉 send”改为“经 `agentClient.send` 直接发送、不带 sessionId”，并在 interface-handoff §5 加一条让 v2 知悉“作业内追问是独立 mock session”。不要求改行为 | Plan 措辞 + 交接登记 |
| S-31 | tasks §1-9 与各写任务 | 写后统一刷新的定向断言只在 T-C01（submit）/ T-C02（confirm）/ T-C03（assign / remove）/ T-G02（markRead）/ T-A22a（createJob）；`submitIntervention`（T-E02 / E03）、`updateParams` / `mergePending`（T-D02）、`markProvisional`（T-D03）、`saveBlockText` / 批注 / `requestRevision` / `resolveRevision` / `finalizeDeliverable`（T-F02 / F03 / F06 / F07）、`cancelJob` / `rerunStage`（T-B05 / B07）、`resetMockData`（T-G04）只靠 e2e 间接覆盖。v2 H-2 ⑤ 点名 `submitIntervention` 必须刷新。建议 Converge 时逐写路径核对“成功后恰一次 `refresh()`”，或在 T-G05 场景遍历中对 `listJobs` 透传计数做一次全局断言；不新增机制 | Converge 核对项 |
| S-32 | tasks T-A22 | `registerJobRoutes(router, pinia)` 在 T-A22 阶段 `pinia` 参数尚未使用（T-A22b 才用于守卫），而工程门 `eslint --max-warnings 0` 可能把未用参数报为错误。实施细节，由实施者按仓库 eslint 规则处理（如 `_pinia` 或在 A22 即把参数传入守卫占位），不改设计、不改签名 | 实施提示 |

## 当前有效检查项（R7 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- [x] **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 零 diff（`git diff 8af343ff 0e37fbf9 -- spec.md` 为空），46 条 AC 独立计数无误；tasks r6 矩阵 46 / 46（独立脚本比对，差集为空）。
- [x] **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；r6 九项新增（§“独立核验” 2）逐项判定为既有需求与既有 plan 意图内的接口 / 机制精度，无一改变 AC 判据或 §2 目标 / 非目标；无需回流 Clarify。S-27～S-32 为措辞 / 断言精度，不是需求歧义。
- [x] **N-03 目标与非目标边界清晰。** spec §2 未变；tasks §3 只加 H-5 容器句（非模态约定的精化）；未把导航 / 首页轨道 / 顶栏投放 / 抽屉标签（v2）或 D-017 / D-019 / 验证队列带入。
- [x] **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R4 / R6；plan r6 只在既有落点上补机制（§2.1 / §2.3 / §2.4 / §6），§5 验收对应表未改。

### 一致性

- [x] **I-01a spec ↔ plan 无冲突。** plan r6 七处 hunk 逐处核对：全部是机制精度或状态登记，无一与 R-001～R-009 / 46 AC 相悖。
- [x] **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核 Analyze R6 §4 八项一致性检查成立；AR6-1（T-A09 ↔ T-A10 断言分层）、AR6-2（§2a / §3 恢复）在最终文本中确已修正（§3 标题与原文完整、T-A09 标准 4 只断言解析结果）；interface-handoff §1 / §2 / §3 与 tasks §2a / §6 一致（本轮逐行对拍）。S-27～S-29 是精度建议，不构成冲突。
- [x] **I-02 与 docs/ 决策与 ADR 无冲突。** D-018 §1（draft / final、不自动、不可撤销）/ §2（内部生成）原样（§“未回退核对”）；interaction §3.3 R1～R6 旁路口径与 S-15 / S-23 / §4.7 一致；designUI §3:73 顶栏“投放”归壳层与 tasks §3 / T-C01a / T-H01 一致；`43b6d79` 的 docs 差异（D-015 正式行、涨跌作用域 ADR、designUI 指针）对本 feature 无设计影响（不用涨跌色、不新增色值 / 玻璃），作者判断属实。
- [x] **I-03 前端基线事实核对。** 本轮在 `43b6d79` 真实文件逐项核对 tasks §0.0 B-1～B-11（见“基线与范围”），全部属实；唯一实质差异 B-7（`mock.spec.ts:94-99`）已落 T-A09。这是实施基线上的核对，不再是“核对时刻事实”；实现分支建立时若基线再变，按 tasks §7 重核。
- [x] **I-04 文件边界与回滚一致。** plan §1 唯一修改者行与 §6 回滚块同步为“`main.ts` 的作业注册（路由、守卫与 jobsStore 订阅）”；tasks §1-5、interface-handoff §3 末行一致；与 v2 §7.2 “`main.ts` 只负责 `addRoute`”的差异已在 §5-1 请对方知悉（文件归本 feature，不需对方批准）；任务修改范围无壳方文件；仍在 spec §4 “只改 frontend/”之内。

### 可测试性

- [x] **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 矩阵 46 条映射未改（43 ✓ + 3 ◐ 外部阻塞子项 AC-003-1 / 005-5 / 007-4 → T-H01～H03）；r6 新增 T-A09a / A22a / A22b / C01a 均只作“部分前置”，不冒充最终验收；18 条 e2e AC 最终命令均为 e2e。
- [x] **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 独立复算：66 任务 / 101.5 h / 每项 1～2 h / 排序规则成立 / 依赖全部向前（去括号说明后 0 例外）/ 220↔220 逐任务 1:1 / 每条标准含 AC / 46 = 46 / 部分前置均为最终任务祖先 / 任务↔矩阵双向一致 / G06·G09 祖先覆盖 A～F / 213 标题 = 211 WI + 2 占位 / 路径隔离 / 真实脚本名 / 66×IMPL-GATE-R6、H 4×v2 / `implementation_base_sha` 已登记为真实 merge commit。a / b 后缀任务排序清晰、依赖最小（A09a 不等状态层、A22 只依赖 A01、A22b 只依赖 A02 / A22、C01a 只依赖 C01）。
- [x] **V-03 静态守卫声称与真实脚本一致。** `43b6d79` 的 `check.mjs`：`--only generated / colors / glass / updown / grid / network` 六项、glass 允许名单 `glass-focus / glass-module / glass-drawer`、network 只许 `src/contracts/real/`；T-A23 / T-C01a / T-G06 命令与之一致；徽标守卫由组件测试承担（未假称脚本具备）。

### 工程准则（AGENTS §5）

- [x] **P-1 不为猜测场景加复杂度（§5.1）。** r6 新增机制逐项为最小必要（§“独立核验” 4）：单一 `refresh()`、显式拒绝请求序号 / 去抖 / 事件总线、守卫十行、快照一字段、种子复用既有规则；B-11 (a) 的“无登记机制”未回退；S-28 旁注明确不为 `afterEach` 加 failure 分支。无待 Walter 批准的机制残留。
- [x] **P-2 外部数据只在入口层校验（§5.2）。** `jobFixtures` 在状态建立时一次边界校验并对非法值返回 validation_error（T-A09 标准 4）；`SendMessage.jobContext` 非法 stage 在契约边界被拒（T-A09a 标准 1）；表单复用契约 schema；组件不复校验（tasks §1-7 未变）。
- [x] **P-3 不提前抽只用一次的抽象（§5.3）。** `registerJobRoutes` 服务 `main.ts` 与双方测试，可复用；未新增 selector（“进行中”用常量）、未新增 store 以外的层；`ensureJobs` / `refresh` / `applyFilter` 各对应一个真实调用点集合。
- [x] **P-5 自动生成文件不手改（§5.5）。** `ACTIVE_JOB_STATUSES` / `JobContext` / 场景 describe 经 `contractSchemas` / `contractSemantics` 进生成物，`contract --check` 对拍；`contract-build.mjs` / `check.mjs` 不改（interface-handoff §4 明示）。
- [x] **P-6 测试测真实实现、少用 mock（§5.6）。** T-A22a（真实 Pinia + 真实 mock client + 边界透传 spy、不 `vi.mock`）、T-A22b（真实 memory-history router + `registerJobRoutes`，只经导航改变上下文，类型层 `@ts-expect-error` 断只读）、T-C01a（`agentClient.send` 透传 spy 0 次）、T-A09a（假时钟推进真实定时器）；S-24 真实 `commit` 取证未回退。
- [x] **P-7 按仓库现有流程（§5.7）。** 命令全部沿用 `pnpm -C frontend {contract,check,typecheck,lint,test:unit,test:e2e,test}`；`main.ts` 订阅沿用既有 `useAgentStore(pinia).receive` 写法；不新增工具 / 依赖 / 脚本。

### 其他自定义项

- [x] **C-01 前置依赖与职责边界清楚。** tasks 页首 IMPL-GATE-R6 三项、H 组 v2 闸门、H-x 四项交付登记（全部“未取得 / 未交付”）、“R6 26/26 只覆盖 r5”均如实；`specs/README.md` 本 feature 行与跨 feature 待同步行与上述一致（只读核对；R7 结论由实施侧更新该行）。
- [x] **C-02 契约闭环。** 30 方法仍各有实现任务与单测；新增 `ActiveJobStatusSchema` / `ACTIVE_JOB_STATUSES`（T-A01）、`JobListItem` 固定字段（T-A02）、`SendMessage.jobContext?` 与十类事件可选字段（T-A09a）、`MockOverrides.jobFixtures` 解析（T-A09）均有正反例与生成物对拍；real 桩覆盖全部键（T-A10 标准 4）。
- [x] **C-03 事件与状态闭环。** T-A09a（透传）→ T-A18（受理登记 / 先处理后通知 / 只投递一次 / S-15·S-23）→ T-A22a（终态刷新）链路衔接无矛盾；旁路 / 终态合并 / 排队重跑 / 收件箱生成 - 已读 - 已解决未回退；S-28 只是把隐含不变量显式化的建议。
- [x] **C-04 场景定义足以稳定验证。** 九场景 × 读 / 写行为表未变；`jobs.json` 按场景集合分键 + 整文件替换 + 每 client 读一次 + 有覆盖只在内存，使 v2 两例（“+ 一项”“只含终结态”）与本 feature T-G05 遍历都可稳定复现；S-27 / S-29 为措辞精度。
- [x] **C-05 版本与定稿闭环。** T-A16 不可变历史、T-A19 accept / revert / resolve_conflict、T-A17 原子定稿 + 未决项拒绝 + delivered / cancelled 只读门、T-F01 头部“已定稿 vN · 时间”、T-F07 正负向 e2e、无反向方法——diff 零触及，独立核对原样。
- [x] **C-06 隐私与本地持久化自洽。** T-A11 白名单 / 512 KiB / 损坏保留原 key 未变，并新增“有 `jobFixtures` 覆盖时对两个 key 零访问”（注入样例不污染本机快照）；T-C01 标准 3 File 只取元数据；fixture 合成样例。
- [x] **C-07 视觉与工程纪律。** T-A23 / T-D03 / T-C01a 不新增色值与玻璃类，IntakeDrawer 复用既有 `.glass-drawer`（`43b6d79` 真实存在）；差异行 / 徽标文字 + 图标。
- [x] **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** r6 文字未引用 D-015（基线 docs 的 D-015 / 涨跌 ADR 对本 feature 无影响）；D-017 仅在 S-17 作边界引用。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，代码未实施，不声称任何 AC 已通过、不假绿。
- **Implement 前置（IMPL-GATE-R6）**：(1) A 对 r6 的定向复核 = **本 §R7 通过**，以本文件被提交后的 SHA 为准（本审核员不 commit）；(2) **Walter 代码实施授权：未取得**（本恢复轮授权仅限恢复 / 基线 / 接口对拍）；(3) **指定集成人、集成验证分支、本 feature 实施 worktree / 分支（从 `43b6d79` 建立并带入 `specs/workbench-interaction/**`）：未登记**。(2)(3) 任一未满足，**任何任务不得开始**。H 组另待 v2 壳方 S1 / S2 交付并集成。
- **H-x 交接**：H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-5、H-6 全部**未交付**；本轮通过只解除“生产方已提交的有效 Checklist SHA / 轮次”这一项对 r6 设计的审核前提（届时填本文件提交 SHA），其余三项（生产实现固定 commit、定向测试输出摘要、集成 SHA）仍须在实现后由实施者 / 集成人取得。设计对拍通过 ≠ 交接，也 ≠ v2 接收方已签收 interface-handoff §5 各项。
- **frontend-workbench 遗留**：H-01 / H-02 处置、M-01～M-08 人工截图签字、11 项 P3 属该 feature，本审核员不代批，也不升级为本 feature 阻塞。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项（T-H01～T-H03）未解除前必报“未收敛（外部阻塞）”；D-019 / 剪藏预览 / 复核结果 / 验证队列不计入本 feature；S-22 顶格 2 h 任务的实施期拆分提醒继续有效。

## 下一步

1. 实施侧（非本审核员）提交本文件，并在 `specs/README.md` 本 feature 行登记“Checklist R7 通过（26/26，SHA 待填）；Implement 待 Walter 代码授权 + 集成人 / worktree 登记”。
2. 作者可按需吸收 S-27～S-32（S-27 / S-29 建议在建实现分支前以一次 Tasks 层措辞修订落实，不需重过 R7；若改动超出措辞 / 断言精度，按 AGENTS §2 第 7 步重跑 Analyze 并再请 A 定向复核）。
3. Walter 决定是否给出代码实施授权；集成人登记集成验证分支与实施 worktree；v2 接收方对 interface-handoff §5 各项给出确认（含 H-6 是否分批）。
4. 实现分支从 `43b6d79` 建立时，按 tasks §7 复核 §0.0 是否因集成人带入其他提交而变化。

## 结构核验证据（R7，只读）

```text
TARGET    0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d（parent 8af343ff085c0f958068b6b50008a6985f51d170）；worktree D:/2030/Futures-AI-interaction-review-r7 @ review/workbench-interaction-resume-r7；启动 git status --short 为空
DIFF      git diff 8af343ff 0e37fbf9 --stat：specs/README.md | analyze.md | interface-handoff.md(new) | plan.md | tasks.md；5 files, +458 −144；spec / checklist / checklist-review-request / HANDOFF / docs / AGENTS / frontend / backend 0 diff
BASE      43b6d79 = merge(3bf6476, eba5002) “Merge PR #7: frontend-workbench v1（Gate 2 已确认，Handoff）” 2026-10-28 16:49:38+04:00；origin/main == 43b6d79；is-ancestor ✓；merge-base(0e37fbf, 43b6d79) = 3bf6476；base 的 specs/ 无 workbench-interaction
          真实文件核对：main.ts 订阅先例 ✓ / contracts/index.ts 独立单例 ✓ / mock/index.ts fixtures 每请求读·readScenario 每 client 读·send 预算+setTimeout ✓ / events.ts eventFields 共享·单向导入 ✓ / router.ts 无 beforeEach·无 jobs ✓ nav 八项含 research ✓ / mock.spec.ts:94-99 索引配对·:100 '1.0.0' ✓ contracts.spec.ts:248-253 ✓ contract-doc.spec.ts:63-64 ✓ / focus-band.spec.ts:108-111 新建 client+spy ✓ / check.mjs glass 三类·network real/ ✓ / glass.css .glass-drawer ✓ / package.json 脚本·TS 5.9.2·vitest ^5.0.5·playwright 1.64.1·zod ^4.6.7 ✓ / vitest restoreMocks ✓ / review.md §8 §9 H-01 H-02 ✓
V2REF     ded716100381fcd2b4b5d3481f4f56e44c9869fd；plan §7.2 §7.3 §7.5 §7.6 §7.7 §7.13；tasks §1.1 §1.2 §3 §4 §5、T-V2-03 / 05 / 06 / 09（jobFixtures 用法：addInitScript 注入、只含非进行中集合）
TASKS     66 任务 / 唯一 / 排序 T-Xnn<T-Xnna<T-X(nn+1) ✓ / 101.5 h（A27·42.5 B7·10.5 C5·7.5 D3·5 E3·5.5 F7·12 G10·14.5 H4·4）/ 每项 1–2 h / 依赖全部向前（去括号说明后 0 例外，无环）
          66×未开始 / 66×IMPL-GATE-R6 / H 4×v2（非 H 0）；标准 220 ↔ 命令 220 逐任务 1:1（0 例外）；标准含 AC 0 例外
          矩阵 46 = spec 46（差集 ∅）；部分前置均为最终任务祖先（0 例外）；任务↔矩阵 AC 引用双向一致（0 例外）；G06 / G09 祖先覆盖全部 A–F；e2e AC 18 条均 test:e2e e2e/jobs
          -t/-g 213 = 211 WI + 2 占位符；非 jobs 路径仅 T-A09 命令 3 的三份既有契约测试
          H-x 映射：interface-handoff §1 ≡ tasks §2a；定向测试标题均存在；最早可交接点 ≡ 祖先集合（A22←A01；A09a←A01..A09；A22b←A02,A22；A22a←..A12,A22；C01a←C01；A21←..A20）
DOCS      D-018 §1 / §2；interaction §3.3 R1–R6；designUI §3:73 顶栏投放归壳层；docs 差异(8af343f↔43b6d79) 仅 D-015 / updown ADR / designUI 指针 / README
AGENTS    §5.1–§5.3 / §5.5–§5.7 逐项核；§6 通道：A = claude-fable-5-1 via anthropic（bridge 本窗口限额 exit 1 于 opus 探活；fable 未重探 bridge；anthropic/fable exit 0）
WRITE     唯一改动仓库文件 specs/workbench-interaction/checklist.md；临时片段 3 个在独占 Temp/wi-resume-01a18388-dmiq93ec/（r7-*）；git diff --check 见回复；不 commit
```

---

# R6（2026-10-28，第六轮：B-11 修正定向复核 + 未回退核对；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD **`8bd1b31`**（与 R3～R5 相同；本轮**无新提交**）。启动时 `git status --porcelain`：` M specs/README.md`、` M specs/workbench-interaction/checklist.md`、` M specs/workbench-interaction/plan.md`、`?? specs/workbench-interaction/analyze.md`、`?? specs/workbench-interaction/tasks.md`——五个文件仍为未提交 / 未跟踪状态，本审核员原样保留、未暂存、未提交；审查前后 `git status` 一致。
- 冻结输入（审查前、写入前两次核对一致）raw SHA256：spec `ed0f6c6c…942d9`（v1.1，46 AC，R3 起未变）；plan `2623f32b…09fc5`（r5：R4 版 `981ecc25…81d21` + S-20 两处）；tasks.md（r5）`2d1f5508…77f39`（**全文 1108 行分四段读完**）；analyze.md `79471e67…86476`（221 行读完）；原 checklist（含 R5）`a6cf37f0…09380`；`specs/README.md` `18f95dba…b0385`（只读）。全部与调度给出的 hash 一致，未移动。
- 重读：AGENTS.md（§2 / §5 / §6）、`docs/plan.md` 全文、spec.md 全文、plan.md 全文、checklist.md §R5 全文（B-11 / O-4 / S-19～S-24 / P-1 / 最小关闭要求；R1～R4 按需）、`templates/tasks.md`、tasks.md 全文、analyze.md 全文、`docs/interaction.md` §3.3–§3.5 / §3.7、`docs/designUI.md` §3（顶栏全局“投放”入口归壳层，:73）。不以作者摘要或 hash 代替阅读。
- **plan 真实 diff（`git diff HEAD -- plan.md`，只读）**：14 个 hunk、+15/−13。其中 12 个 hunk 落在 R4 已核实的 B-09 / B-10 位置（:6–7 页首两行、:83、:86、:89、:166、:178、:198、:202、:207、:238、:259、:266），内容与 R4 逐项引用的文字一致；**新增的 2 个 hunk 仅为 :18（§1 唯一修改者清单）与 :286（§6 回滚块）**，各加入一处“frontend-workbench 既有 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受契约 2.0.0 影响的硬编码断言（仅 T-A09，保留 v1 语义 / 恢复 v1 原断言）”——即 S-20 原文范围，未触及方法表、矩阵、场景表、迁移表、§4.5～§4.7、§3 持久化、§1.1、§7、§8。R4 版 plan 未曾提交，无法按字节重放其 diff，本轮以 R4 记录的 hunk 位置与引用文字做内容比对。
- **前端基线只读核对**（`D:/2030/Futures-AI-frontend`，核对时 HEAD **`8920b06`**，分支 `feat/frontend-workbench`；自 R5 的 `b991059` 又前移 2 个提交：`beb5b75` 记录 Walter 2026-10-28 Gate 2 确认、`8920b06` “Merge origin/main into feat/frontend-workbench（Handoff 合并主线）”）：`git merge-base --is-ancestor HEAD main` / `origin/main` → **均不是** `main`（`85c6cbb`）/ `origin/main`（`3bf6476`）的祖先；review.md 页首现写“Gate 2 已批准 … 进入 Handoff”，但 §8 原文授权“PR 并 merge 到 main”尚未体现为 main 上的提交。→ **frontend-workbench v1 Handoff 合入 main 的 commit 仍不存在**，plan §1.1“实现起点 = 经 Review / Gate 2 / Handoff 合入后的 commit”未满足，`implementation_base_sha = PENDING` 如实。另在 `8920b06` 抽查 tasks §0 事实：`package.json` 脚本 `contract` / `check` / `typecheck` / `lint` / `test:unit` / `test:e2e` / `test` ✓；`CONTRACT_VERSION` 仍 `'1.0.0'` ✓；`mock.spec.ts:15`（`fixtures/*.json` glob 不递归）/ `:100`（`contractVersion: '1.0…'`）、`contracts.spec.ts:248`（`dataMethods` 键列表）、`contract-doc.spec.ts:64`（`x-methods` 长度 12）✓；`fixtures/*.json` 恰 9 个 ✓；`nav.ts` 无 `jobs` ✓。以上均为**核对时刻事实**，不是实施基线；Implement 开工时仍须按 tasks §7 在 `implementation_base_sha` 重核。本轮未 fetch、未改该仓库任何引用。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（见页首 R6 通道）。派工脱敏记录：角色 A / 任务 Checklist R6（B-11 定向 + 未回退）/ 基线 `8bd1b31` + 上述六个输入 hash / provider `anthropic` / 继承失败类别 `claude-bridge` quota·rate·spend_limit（exit 1，R3 窗口；本轮未重试）。
- **未执行**：未安装依赖、未运行任何产品测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / tasks / analyze / docs / README / 代码 / 前端分支、**未在仓库内外创建、修改或删除任何临时文件**（结构复算只用 `python - <<'PY'` 标准输入一次性脚本，不落盘）、未 commit / push / merge / 切分支。唯一写入文件为本文件（新增 §R6、页首两处说明、把 §R5 的 25 个 `[x]` 与 1 个 `[ ]` 改为 ☑ / ☐ 文字；R5 其余内容未动）。

## 结论（R6）：**通过**（定向；B-11 关闭，P-1 补勾；Tasks r5 + Analyze R5 文档质量通过；**Implement 仍 BLOCKED（外部基线）**）

- **B-11 关闭（按 R5 最小关闭要求 (a)）**：作者**删除**了登记机制而非规避 AGENTS §5.1，tasks 页首明写“未请求、也未声称 Walter 批准任何机制”，§3 / T-C01 / T-H01 逐项与 (a) 一致（见下表）；运行时复杂度净减少，无新增机制；不改 plan / spec。→ **P-1 ☑**。
- **S-19～S-24 处置**：S-19 / S-22 / S-23 / S-24 在 tasks 以一句口径或测试写法落实、S-20 在 plan §1 / §6 各一行、S-21 在 analyze 以“历史注 + 现编号状态表”落实；均**未引入新机制**（见下表）。
- **未回退**：V-02 结构项独立复算与 R5 相同（62 任务 / 96.5 h / 46=46 AC / 无环 / 1:1 / 全部引用 AC / 62×v1 闸门、H 4×v2 闸门）；I-01b 独立复核 spec ↔ plan ↔ tasks 仍无冲突；B-09 / B-10、S-11～S-18、D-018 scope、壳方文件零修改均未回退。
- **外部闸门**：`implementation_base_sha = PENDING` 为真实外部阻塞（见“基线与范围”）；本审核员**不能代 Walter 批准任何 Gate**，Gate 2 已批准是 frontend-workbench 的事实、不是本 feature 的 Handoff commit。**Implement 不得开工**，直到合入 main 的 Handoff commit 登记为 `implementation_base_sha` 并按 tasks §7 重核 §0 事实。AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍为外部阻塞，Converge 必报“未收敛（外部阻塞）”。

## B-11 逐项核对（R5 最小关闭要求 (a) → r5 落点）

| 要求 | r5 落点（tasks 行号） | 核实 | 判定 |
|---|---|---|---|
| §3 该条改为“v2 之前由两页挂载（互斥路由视图）；v2 AppShell 挂载后由 T-H01 移除页面级挂载” | :67 原文：v2 之前 `JobListPage` / `JobDetailPage` 各自挂载同一 IntakeDrawer（互斥路由视图，同一时刻仅一个），v2 AppShell 落地后由 T-H01 从本 feature 自有的这两个页面文件移除（不改 `app/**`）；并明写“不设任何首个挂载者登记 / 单实例登记 / 卸载释放运行时机制，`intakeStore` 不含实例登记” | plan §2.1 两条路由记录（`jobs` / `job-detail`）为同一 `<RouterView>` 下的并列顶层记录、非嵌套 → 互斥成立；与 plan §1.1 接线顺序、§4.2“页面入口或 v2 顶栏打开同一 IntakeDrawer”、designUI §3 顶栏入口归壳层一致 | ✓ |
| T-C01 删“单实例登记”；`stores/intake.ts` 不含实例登记；标准 3 改为 metadata only；命令 3 标题同步 | :595 标题“页面级抽屉挂载”；:601 修改范围 `stores/intake.ts`“**不含实例登记**”、两页各自挂载；:606 标准 3 “不调用任何文件正文读取 API（File 只取 name / size / type / lastModified）（spec §4 … 随 AC-009-1）”；:611 命令 3 `-t "WI metadata only"`；标准↔命令 4:4 | 全文残留扫描：“单实例 / 首个挂载 / 卸载释放”仅出现于 :7（修订记录的删除说明）与 :67（否定句）；“实例登记”仅 :7 / :67 / :601（均为否定或删除说明）；“single drawer”0 处 | ✓ |
| T-H01 修改范围加“移除两页的 IntakeDrawer 挂载（不改 `app/**`）”；标准 1 保留“同一页面只渲染一个抽屉”作集成断言 | :1035–:1046：修改范围“移除 `frontend/src/jobs/pages/{JobListPage,JobDetailPage}.vue` 中的页面级 IntakeDrawer 挂载（本 feature 自有文件）… 不改 `app/**` 和 `workbench/**`”；标准 1 三处入口同一流程 + “同一页面只渲染一个抽屉”（AC-003-1 最终）；新增标准 2 / 命令 2 工程门（`typecheck && lint`，AC-009-1 部分前置）——因 T-H01 现改 Vue 文件，按 tasks §1-4 自身规则必须补工程门；2:2；依赖 T-C04 / T-G09、预估 1 h、`blocked_by: v2` 不变；上下文写明页面内投放按钮保留、经 `intakeStore` 开同一抽屉，T-C04 本地 e2e 由 T-H04 全量复跑回归 | H 组标题 / §6 DAG 说明同步为“只清理本 feature 页面级抽屉挂载 + 集成验证，不改壳方”；仍在 `jobs/**` 内，不触碰壳方文件 | ✓ |
| 不走 (b)：无 Walter 批准、不保留待批登记机制 | 页首 r5 说明“不请求、也不声称 Walter 批准任何机制”；`specs/README.md` 本 feature 行亦写“删除 IntakeDrawer 首个挂载者登记”、“B-11 尚未经 A 复核关闭” | 删除即不再触发 §5.1“先报 Walter”的前提；A 未代批任何机制 | ✓ |
| 不改 plan / spec | spec hash 未变；plan 仅 S-20 两处（见“基线与范围”） | — | ✓ |

附带观察（接受，不加防线）：Analyze R5 §1 指出“v2 壳方挂载合入集成分支 → T-H01 完成”之间存在短暂双挂载窗口。这是集成顺序问题，由 plan §1.1 接线顺序与 AGENTS §6 规则 7（集成人串行合并）收口，T-H01 标准 1 断言最终状态；**不为此窗口增加任何运行时逻辑**，与 §5.1 一致。

## S-19～S-24 处置核对

| # | 落点 | 核实 | 判定 |
|---|---|---|---|
| S-19 | T-A09 修改范围 `contractSemantics.jobScenarios` 明写声明句“CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准”（:210）；T-A09 标准 2 / 命令 2 `WI change note`；T-G06 `contract-doc.spec` 断言该句（:933）；§0 生成器条目指向 S-19 | 静态 v1 文案口径声明 + 文档断言；**不改生成器** | 已落实 |
| S-20 | plan :18 所有权清单、:286 回滚块各一处（见 plan diff 核对） | 只补 T-A09 的三份既有契约测试硬编码断言范围；无其他 plan 改动；I-04“所有权 = 回滚块”在该文件集上成立 | 已落实 |
| S-21 | analyze.md 页首改指向“Analyze R5”；R3「1. 冲突 / 差距 / 歧义（最终状态）」与「最终结论（R4）」下各插一行【r5 注】标历史；新增 Analyze R5 §3 当前状态表用现编号（O-3 / O-6 → T-A09、O-5 → T-A11、O-7 / O-9 → T-A18）；R1～R4 原文保留 | 历史未删、现状可读 | 已落实 |
| S-22 | tasks §7（:1107）：实施期顶格 2 h 任务若超时按 AGENTS §2 第 9 步追加拆分任务并记录，不改 AC / 范围；r5 不预先重拆 | 只是提醒，不是新机制；62 任务不变 | 已落实 |
| S-23 | §2 S-15（:56）与 T-A18 修改范围（:371）/ 标准 3（:375）：activeRunId 终态后置 null；仍在运行的第二个带上下文 run **不接任**、其终态不合并 overlay；一句写入 `SendMessageSchema.jobContext` describe；命令 3 `WI no context` 承担正反例 | 与 plan §4.7“仅匹配 pendingRunId 的终态才合并”、interaction §3.3 R2 旁路一致；无调度 / 接任逻辑 | 已落实 |
| S-24 | T-A17 标准 2（:357）：原子性测试走 T-A10 的**真实 `commit(mutator)`**——测试 mutator 先改 working copy 再抛错，或写入不合 schema 的值触发真实边界校验失败；随后经真实读 API（`getJob` / `getStageWorkspace` / `listInterventions`）断言原状态不变；不复制 commit 算法、**不加生产故障开关或注入框架** | 符合 AGENTS §5.6（测真实实现、在系统边界注入） | 已落实 |

## 未回退核对

| 对象 | 核对方式 | 结果 |
|---|---|---|
| V-02 结构项 | 独立脚本复算（stdin，不落盘）：62 任务 / 编号唯一 / 96.5 h（A 24·38.5 h，B 7·10.5，C 4·6.5，D 3·5，E 3·5.5，F 7·12，G 10·14.5，H 4·4）/ 每项 1～2 h / 依赖全部指向更早编号 / 62×“未开始”/ 62×`blocked_by: frontend-workbench-v1-handoff` / H 4×`frontend-workbench-v2`（非 H 0）/ 完成标准↔验证命令逐任务 1:1（0 例外；T-C01 4:4、T-H01 2:2）/ 每条标准含 AC 引用（0 例外）/ 矩阵 46 行 = spec 46 AC / “部分前置”均为最终任务祖先（0 例外）/ T-G06 与 T-G09 以全部 A～F 任务为祖先 / spec 标“端到端”的 17 条 AC 最终命令均为 `test:e2e e2e/jobs/…` / `-t`·`-g` 标题 184 条中 182 条以 `WI` 开头、另 2 条为 §1 命令形态的 `<标题>` 占位符（R5 记“184 条全部 WI”系未扣占位符，不影响结论）/ 修改范围中无壳方文件（`src/app/**`、`WorkbenchPage`、agent store / UI、`contract-build.mjs`、`check.mjs`）| 未回退 |
| I-01b | tasks r5 未改 spec 行为 / AC；未改 plan 30 方法 + `send(jobContext)`、19 行矩阵、九场景、十样例、rerun 迁移表、§4.5～§4.7、§3 持久化；tasks §3“plan §2.1 / §4.2 没写明 v2 之前由谁挂载”属实（plan 只写“由 shell 的投放按钮打开 / 页面入口或 v2 顶栏打开同一 IntakeDrawer”），r5 填补方式与 plan §1.1 接线顺序一致，不构成冲突；Analyze R5 结论“无内部冲突、新发现无”经独立复核成立 | 未回退 |
| B-09 / B-10 | plan :86 / :198 / :238 / :266（publishedAt）、:83 / :89 / :166 / :178 / :202 / :207 / :259 / :266（Deliverable 判别 + 三锚 + `DeliverableStatusLabel` + 原子定稿 + “已定稿 vN · 时间”）与 R4 引用一致；tasks T-A03 / T-C04 / T-G06、T-A04 / T-A08 / T-A17 / T-F01 / T-F07 / T-G06 落点未动 | 未回退 |
| S-11～S-18 | tasks §2 八行与落点任务未动（S-15 仅增 S-23 一句） | 未回退 |
| D-018 scope | tasks §3：不自动定稿、无反向方法、v1 只做①+派生标记、不做验证队列 / 格物致知 / 蒸馏 / D-019 角色成本 | 一致 |
| spec v1.1 / checklist（R5） | hash 与调度给出一致，未变 | 未变 |

## 新观察（R6；不阻断、不计入判定）

| # | 位置 | 说明 |
|---|---|---|
| S-25 | tasks §0 外部依赖证据表 | 前端分支已前移到 `8920b06`（Gate 2 已批准、Handoff 进行中、**未合入 main**）。§0 表仍记 `b991059` 时点事实并已声明“仅核对时事实”，不算 Tasks 缺陷；登记 `implementation_base_sha` 时按 tasks §7 刷新 §0（含 `8920b06` 合入主线后 AGENTS §6 / D-015 等变动对 §0 事实的影响）。本轮抽查的 §0 前端事实在 `8920b06` 仍成立。 |
| S-26 | checklist §R5 “合计” | R5 原文“25 项中 24 ☑、1 ☐”为算术笔误：R5 实际复选框 26 项（N 4、I 5、V 3、P 6、C 8），25 ☑ / 1 ☐（P-1）。R5 结论不变、原文不改；本轮按真实复选框重算。 |

## 当前有效检查项（R6 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 未变（SHA256 与 R3～R5 一致），46 条 AC；tasks r5 矩阵 46 / 46（独立复算）。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；r5 修订（B-11 删除、S-19～S-24）均为任务 / 口径层，未引入新需求问题，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；tasks §3 范围边界未扩（B-11 条改为纯接线安排）。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R4；plan 仅 S-20 两处文字，落点未动。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** spec 未变；plan 变更仅 S-20 所有权 / 回滚文字，不涉行为。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核（见“未回退核对”）：Analyze R5 “无内部冲突、新发现无”成立；B-11 已从 §5.1 范围问题转为无机制的接线安排，不再挂 P-1。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** 沿用 R5 映射（D-018 §1 / §2 / §5、interaction §3.3–§3.4 / §3.7、designUI §2.4 / §3.4 / §3.9 / §5.2）；S-23 口径与 interaction §3.3 R2 旁路一致；designUI §3 顶栏“投放”入口归壳层与 tasks §3 / T-H01 一致。
- ☑ **I-03 前端基线事实核对。** R5 在 `b991059` 全量核对属实；本轮在 `8920b06` 抽查 tasks §0 关键事实（脚本名、`CONTRACT_VERSION` 1.0.0、三处硬编码行、fixture 9 个、glob 不递归、`nav.ts` 无 jobs）仍成立；均为核对时刻事实，Implement 开工时按 tasks §7 重核。
- ☑ **I-04 文件边界与回滚一致。** plan :18 所有权与 :286 回滚块已含 T-A09 三份既有契约测试（S-20 闭环）；tasks §1-5 与之一致；T-H01 只改 `jobs/pages/**`，H 组零壳方文件；在 spec §4“只改 frontend/”之内。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 沿用 R4 / R5；矩阵 46 条映射未改（43 ✓ + 3 ◐ 外部阻塞）。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 独立复算与 R5 一致（62 / 96.5 h / 无环 / 1:1 / 引用 AC / e2e 层级 / `WI` + jobs 路径隔离 / 真实脚本名 / 闸门齐全 / `implementation_base_sha: PENDING` 如实）；r5 改动后 T-C01 4:4、T-H01 2:2；H 组表述更新为“只清理本 feature 页面级挂载 + 集成验证，不改壳方”（R5 原话“只写集成测试”对应 r4 文本，本轮按 r5 口径确认）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** `check --only {glass,network,generated,colors,updown,grid}` 六项与 `check.mjs` 一致（R5 核；`8920b06` 脚本名未变）；徽标守卫由组件测试承担。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** **B-11 关闭**：`intakeStore` 实例登记 / 卸载释放机制已整体删除，替代为零运行时逻辑的接线安排（两页互斥挂载 → T-H01 移除），未请求、未声称 Walter 批准，无待批机制残留；r5 其余改动（S-23 守卫口径、S-24 测试写法、S-19 / S-20 文字）均不新增运行时机制；Analyze 提到的双挂载过渡窗口由集成顺序收口、不加防线。其余 R5 已核项（commit 原子替换、持久化状态订阅、S-15 守卫、rerun 内存排队）来源不变。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** tasks §1-7 未变；S-18 refine 在契约边界。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** 沿用 R5；r5 未新增抽象（删除了一个只为未来场景服务的 store 机制）。
- ☑ **P-5 自动生成文件不手改（§5.5）。** tasks §1-4 未变；S-19 经 `contractSemantics` 进文档、不改生成器。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** S-24 以真实 `commit` + 测试 mutator / 真实校验失败 + 真实读 API 取证，不造生产故障开关；其余沿用 R5（normal 场景持久记录取证、aborted 系统边界注入、`page.clock` 推进真实定时器、diff 期望手写）。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令全部沿用 frontend 既有脚本；T-H01 新增工程门亦为既有 `typecheck` / `lint`；不新增工具 / 依赖。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** tasks 头部与 §0 如实（PENDING、点时事实声明）；本轮第四次核对外部闸门：Gate 2 已批准但未合入 main，闸门未解除；`specs/README.md` 本 feature 行“待 A R6 定向复核 / B-11 尚未经 A 复核关闭 / Implement 外部基线 blocked”与 R6 前事实一致（只读核对；R6 结论由实施侧更新该行）。
- ☑ **C-02 契约闭环。** 30 方法在 T-A10～T-A21 各有实现任务与单测；T-A06 23 个 action 判别联合；r5 未改。
- ☑ **C-03 事件与状态闭环。** T-A14 / T-A18 / T-A19 / T-A20 / T-A21 覆盖未变；S-23 使 `job-state-agent.spec` 反例口径唯一。
- ☑ **C-04 场景定义足以稳定验证。** T-A07 / T-A08 十样例、T-A09 九场景（含 S-19 声明句）、T-G05 遍历、非 normal 不触碰两个 key 的 Storage spy 断言未变。
- ☑ **C-05 版本与定稿闭环。** T-A16 不可变历史、T-A19 accept / revert / resolve_conflict、T-A17 原子定稿（S-24 真实 commit 取证）+ 未决项拒绝 + final / cancelled 只读门、T-F07 正负向 e2e、无反向方法。
- ☑ **C-06 隐私与本地持久化自洽。** T-A11 白名单 / 512 KiB / 损坏保留原 key；T-C01 标准 3 File 只取元数据（`WI metadata only`）；T-G04 e2e；fixture 合成样例。
- ☑ **C-07 视觉与工程纪律。** T-A23 / T-D03 不新增色值与玻璃类；差异行 / 徽标文字 + 图标；r5 未改。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** tasks / analyze 未引用 D-015；D-017 仅在 S-17 作边界引用。

**合计**：26 项中 26 ☑、0 ☐。

### 阶段说明（不设复选框）

- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，代码未实施，不声称任何 AC 已通过、不假绿。
- **Implement 前置**（累计）：(1) R4 ✓；(2) Tasks 复核：V-02 ✓、**P-1 ✓（R6）**；(3) `implementation_base_sha` = **PENDING**——frontend-workbench v1 Handoff **合入 main 的 commit** 出现后登记（`8920b06` 是 Gate 2 已批准、Handoff 进行中的分支提交，**不是** main 上的合入提交，不得用其或任何中间提交替代）；(4) Analyze 复核 I-01b ✓。**Implement 不得开工**（唯一剩余阻塞为 (3)，属外部，A 不能代批）。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项在 v2 Gate 1 + 壳方交付 + T-H01～T-H03 前**必须报“未收敛（外部阻塞）”**；D-019 / 剪藏预览 / 复核结果 / 验证队列不计入本 feature。

## 下一步

1. 实施侧更新 `specs/README.md` 本 feature 行（R6 通过：B-11 关闭、checklist 26/26；Implement 等待 v1 Handoff 合入 main 的 commit）；plan / README / tasks / analyze 的工作区改动与本文件一并由实施侧提交（本审核员未 commit）。
2. v1 Handoff commit 合入 main 后：在 tasks 头部登记 `implementation_base_sha`，按 tasks §7 重核 §0 前端事实（S-25）；如有出入先修 tasks 并重跑 Analyze，再由 A 定向复核；无出入则按 checklist 前置条件（本 §R6 全部 ☑）进入 Implement。
3. S-22 拆分提醒、S-25 刷新属 Implement / Converge 期事项，不是现在的阻断。

## 结构核验证据（R6，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；无新提交）；git status: M README / M checklist / M plan / ?? analyze.md / ?? tasks.md（审查前后一致）
INPUTS    spec ed0f6c6c…942d9 | plan 2623f32b…09fc5 | checklist(含R5) a6cf37f0…09380 | tasks 2d1f5508…77f39 | analyze 79471e67…86476 | README 18f95dba…b0385（写入前复核一致）
PLAN DIFF 14 hunks / +15 −13：12 个在 R4 核实的 B-09 / B-10 位置（:6–7, :83, :86, :89, :166, :178, :198, :202, :207, :238, :259, :266）+ 2 个新 hunk :18 / :286 = S-20
TASKS     62 任务 / 62 唯一 / 96.5 h / 每项 1–2 h / 依赖全部指向更早编号 / 62×未开始 / 62×blocked_by v1 / H 4×blocked_by v2
          标准↔命令 1:1（0 例外；C01 4:4、H01 2:2）；每条标准含 AC（0 例外）；46/46 AC = spec；部分前置均为最终任务祖先（0 例外）；G06 / G09 祖先覆盖全部 A–F
          17 条 e2e AC 最终命令均 test:e2e e2e/jobs/…；-t/-g 184 条 = 182 WI + 2 个 §1 <标题> 占位符；修改范围无壳方文件
          B-11 残留：“单实例 / 首个挂载 / 卸载释放”仅 :7（删除说明）/ :67（否定句）；“实例登记”仅 :7 / :67 / :601（否定）；“single drawer”0
          S-19 句 :210 / :933；S-23“不接任” :56 / :371 / :375；S-24 真实 commit(mutator) :357；S-22 :1107；T-H01 “不改 app/**” :1041
FRONTEND  D:/2030/Futures-AI-frontend @ 8920b06（feat/frontend-workbench；beb5b75 = Gate 2 确认，8920b06 = merge origin/main 入分支）；非 main(85c6cbb)/origin/main(3bf6476) 祖先 → 未合入 main
          §0 抽查仍成立：scripts ✓ / CONTRACT_VERSION 1.0.0 / mock.spec:15,100 / contracts.spec:248 / contract-doc.spec:64 / fixtures 9 / nav 无 jobs
DOCS      D-018 §1/§2/§5；interaction §3.3–§3.5/§3.7；designUI §3（:73 顶栏投放归壳层）
AGENTS    §5.1（B-11 关闭依据：机制已删除，无待批项）、§5.6（S-24）、§6（A = claude-fable-5-1 via anthropic，继承探活，未重探 bridge）
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md；仓库内外未创建 / 修改 / 删除任何其他文件；git diff --check 见回复
```

---

# R5（2026-10-28，第五轮：Tasks（V-02）/ Analyze（I-01b）质量复核；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD **`8bd1b31`**（与 R3 / R4 相同；本轮**无新提交**）。启动时 `git status --porcelain`：` M specs/README.md`、` M specs/workbench-interaction/checklist.md`、` M specs/workbench-interaction/plan.md`、`?? specs/workbench-interaction/analyze.md`、`?? specs/workbench-interaction/tasks.md`——**工作区不干净**，五个文件均为未提交 / 未跟踪状态，本审核员原样保留、未暂存、未提交；不伪称任何提交已完成。
- 冻结输入（审查前、写入前两次核对一致）raw SHA256：spec `ed0f6c6c…942d9`（v1.1，46 AC，与 R3 / R4 相同）；plan `981ecc25…81d21`（与 R4 相同，**本轮无改动**）；原 checklist（含 R4）`56181b02…b5075`；tasks.md（r4，未跟踪新文件，**全文 1103 行分三段读完**）`98d080d3…740fc`；analyze.md（未跟踪新文件，138 行读完）`c97f6cad…2259b`；`specs/README.md` `66376f8e…dc55e`（只读）。`git diff HEAD --stat` 仅 plan / checklist / README 三处既有改动，与 R4 记录一致；tasks / analyze 为新文件，按 hash 核对后整篇审读（未漏审）。
- 重读：AGENTS.md（§2 / §5 / §6）、`docs/plan.md`、spec.md、plan.md、checklist.md §R4（R1～R3 按需）、`templates/tasks.md`、tasks.md 全文、analyze.md 全文、`docs/interaction.md` §3.3–§3.5 / §3.7 / §7、`docs/designUI.md` §2.4 / §3.4 / §3.5 / §3.9 / §5.1 / §5.2、D-018 全文、`specs/README.md`（只读）。
- **前端基线只读核对**（`D:/2030/Futures-AI-frontend`，审查时 HEAD **`b991059`**，分支 `feat/frontend-workbench`；该分支会继续移动，本轮只记录核对时刻）：`git merge-base --is-ancestor HEAD main` → **不是** `main`（`85c6cbb`）/ `origin/main`（`3bf6476`）的祖先；`git branch -a --contains HEAD` 仅本地 `feat/frontend-workbench`；`specs/frontend-workbench/review.md` 页首明写“**不是 Handoff；Gate 2 尚未批准**，未进入 PR / merge”。→ **frontend-workbench v1 Handoff SHA 仍不存在**，Implement 外部闸门未解除；该 review.md 只是外部状态证据，不是 Handoff。另核对 tasks §0 所引事实：`package.json` 脚本 `contract` / `check` / `typecheck` / `lint` / `test:unit`（vitest run）/ `test:e2e`（playwright test）/ `test`（= check && typecheck && lint && test:unit && test:e2e）✓；`vitest.config.ts` include `tests/**/*.spec.ts`、happy-dom、`tests/setup.ts` ✓；`playwright.config.ts` testDir `./e2e`、Chrome 通道、`127.0.0.1:4173` ✓；`@playwright/test` 1.64.1（`page.clock` 可用）✓；`contract-build.mjs` 由 `contractSchemas` + `methodSemantics` / `contractSemantics`（字符串项进 §1）驱动、字段清单渲染 `const` / `enum`、§4 / §5 为静态文案（仅 v1 五场景、九个 fixture 键）✓；`contract --check` / `check --only {generated,colors,glass,updown,grid,network}` 存在 ✓；既有硬编码：`tests/unit/contracts.spec.ts:248–253`（十个 dataMethods 键、`methodSemantics` 长度 12）、`contract-doc.spec.ts:64`（`x-methods` 长度 12）、`mock.spec.ts:100`（`contractVersion: '1.0.0'`）、`mock.spec.ts:15/34`（`import.meta.glob('…/fixtures/*.json')` **不递归**、恰好 9 个）✓；`schema.json` 中 `AgentEvent`（discriminatedUnion）生成为 `oneOf`、`AgentRun`（superRefine）正常入 `$defs` → S-11 / S-12 / S-18 的 literal-object / 判别联合 / refine 与现生成器相容 ✓；`src/shared/components/{Badge,Loading,EmptyState,ErrorState}.vue`、`src/agent/{store,AgentDrawer,…}`、`mock/agent/{success,failure,retry,long}.ts`（long 含 done=true 的 `step.text`、12000ms `run.completed`；failure 1200ms `run.failed`）、mock `send` 以 `setTimeout` 相对 `Date.now()` 回放（假时钟可控）、`main.ts` 为装配点且 `app/router.ts` 由 `navItems` 生成（无 `jobs` 项）、`real/index.ts` 为逐方法 NotImplementedError 桩 ✓。`spec/frontend-workbench-v2` 未过 Gate 1，未作为依赖读取。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（见页首 R5 通道）。派工脱敏记录：角色 A / 任务 Checklist R5（V-02 + I-01b）/ 基线 `8bd1b31` + 上述六个输入 hash / provider `anthropic` / 继承失败类别 `claude-bridge` quota·rate·spend_limit（exit 1，R3 窗口；本轮未重试）。
- **未执行**：未安装依赖、未运行任何产品测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / tasks / analyze / docs / README / 代码 / 前端分支、未创建任何新文件、未 commit / push / merge / 切分支。结构核验（任务数 / 依赖方向 / 祖先关系 / 标准↔命令计数 / AC 集合 / `-t`·`-g` 标题前缀）由本审核员用一次性 Python 只读脚本**独立复算**，不采信 Analyze 的脚本结论；这是文档结构检查，不是产品测试。唯一写入文件为本文件（新增 §R5、页首两处说明、把 §R4 的 24 个 `[x]` 改为 ☑ 文字；R4 内容未动）。

## 结论（R5）：**未通过**（定向；阻断 1 项 **B-11**，为 Tasks 层最小修正或 Walter 批准二选一；不回流 Plan / Clarify、不动冻结 spec、不改 docs）

- **V-02（Tasks 质量）**：62 个任务、编号唯一、依赖全部指向更早编号（无环）；每项 1～2 h（合计 96.5 h）；每项含上下文 / 修改范围 / 完成标准 / 验证命令；**每条完成标准均引用 AC**（spec §4 持久化约束无独立 AC 者以“随 AC-009-1 全量回归”引用，可接受）；完成标准与验证命令**逐任务条数 1:1**（独立复算 0 例外）；46 / 46 AC 在矩阵中、与 spec 集合完全相同；矩阵“部分前置”均为最终任务的祖先，T-G06 / T-G09 以全部 A～F 任务为祖先；62 / 62 `blocked_by: frontend-workbench-v1-handoff`，H 组 4 / 4 另 `blocked_by: frontend-workbench-v2` 且只写集成测试、不改壳方文件；spec 标“端到端”的 17 条 AC 最终命令均为 `test:e2e e2e/jobs/…`，schema / 状态层单测只作“部分前置”，**没有用 schema 代替 e2e**；184 条 `-t` / `-g` 标题全部以 `WI` 开头且路径限定 `tests/{unit,component}/jobs/**`、`e2e/jobs/**`（仅 T-A09 命令 3 有意整文件跑三份既有契约测试，用于证明 v2 不破坏 v1），不会误匹配 frontend-workbench 同编号 AC；命令使用真实脚本名、真实 flag（已对照前端基线）。各任务按增量可落地（A 契约 → mock 状态层 → 路由 / 徽标 / diff → B～F 界面 → G 收口 → H 集成）。**V-02 勾选**。
- **I-01b（Analyze 结论）**：独立对 spec → plan → tasks 做一致性复核：tasks 未改 spec 行为 / AC、未改 plan 方法集（30 个 DataClient 方法 + `send(jobContext)`）、19 行动作矩阵、九场景 × 读 / 写 / 快照行为、十个作业样例、rerun 迁移表、§4.5 版本 / 冲突语义、§4.6 定稿原子提交与 final 后只读门、§4.7 旁路 / 检查点、§3 持久化白名单与 512 KiB / 损坏规则、§1.1 基线与 blocked_by；R4 关闭的 **B-09（`SourceNote.publishedAt` 为 TradingDate，T-A03 / T-C04 / T-G06）与 B-10（`Deliverable` 判别联合 + 三锚 + `DeliverableStatusLabel` + 原子 `finalizeDeliverable` + 头部“已定稿 vN · 时间”，T-A04 / T-A08 / T-A17 / T-F01 / T-F07 / T-G06）均未回退**；D-018 scope 守住（tasks §3：不自动定稿、无撤销 / 反向方法、v1 只做①+派生标记、不做验证队列 / 格物致知 / 蒸馏 / D-019 角色成本）。Analyze 自查四轮（TF-1～TF-9 修正留痕）结构可信，但本轮**不按其“无内部冲突”自动通过**：其留给 A 的 O-3 / O-4 经独立裁定——O-3 **接受**（见下），O-4 **不接受**（→ B-11）。spec ↔ plan ↔ tasks 之间**无内部冲突**，**I-01b 勾选**；O-4 属 AGENTS §5.1 未经批准的范围扩大，记在 **P-1**（未勾）。
- **S-11～S-18**：在 Tasks 层**全部已确定且可验证**（逐项见下），本轮判为“Tasks 层关闭”；这只是设计 / 任务落实，不是实现完成。
- **Implement 前置**：(1) R4 ✓；(2) Tasks 复核 → 本轮 V-02 ✓ 但 **P-1 ☐（B-11）**，需 B-11 关闭后 R6 定向补勾；(3) Tasks 头部 `implementation_base_sha` = **PENDING**（外部闸门未解除，本轮核实）；(4) Analyze 复核 → I-01b ✓。**Implement 仍 BLOCKED**（外部基线 + B-11）。AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍为外部阻塞，Converge 必报“未收敛（外部阻塞）”。

## 阻断项（R5）

| # | 严重度 | 位置 | 问题 | 受影响 AC | 最小关闭要求 | 分类 |
|---|---|---|---|---|---|---|
| **B-11** | 中（AGENTS §5.1 程序性违规 + 永久死代码：v2 之后 AppShell 先于路由视图挂载，“首个挂载者渲染”规则会让页面级挂载永远不渲染，登记逻辑随之成为常驻无用分支） | tasks.md §3 末条“IntakeDrawer 的挂载”；T-C01 修改范围（“单实例登记”）、完成标准 3（“同时挂载两个 IntakeDrawer 只渲染一个”）、验证命令 3（`WI single drawer and metadata only`）；T-H01 完成标准 1（“同一页面只渲染一个抽屉”）；analyze.md O-4 | 为“v2 的 AppShell 也挂载 IntakeDrawer 后会出现两个抽屉”在 `intakeStore` 加**首个挂载实例登记 / 卸载释放**（约 10 行运行时逻辑）。AGENTS §5.1：即使能说清怎么出错、概率与代码量，也“**必须先报给 Walter 并得到同意**”；Analyze 明写“§5.1 是否需要报 Walter，交 A 判断”——**A 不是 Walter，不能代批**。且存在零运行时逻辑的既定接线安排：v2 之前 `JobListPage` / `JobDetailPage` 各自挂载（二者是互斥的路由视图，同一时刻只有一个存在，不会双渲染）；v2 的 AppShell 挂载落地时，由本 feature 在 T-H01（本就 `blocked_by: v2`，且只改本 feature 自有文件 `jobs/pages/**`，不碰壳方代码）移除页面级挂载——这正是 plan §1.1 “v2 壳方接投放 → 本 feature 集成验证”的接线顺序，无需任何登记机制 | AC-003-1（本地子项与 v2 子项）、AC-007-3（抽屉非模态）间接 | **二选一**：(a) **Tasks 最小修正**（推荐）：tasks §3 该条改为“v2 之前由 `JobListPage` / `JobDetailPage` 挂载（互斥路由视图，同一时刻仅一个实例）；v2 AppShell 挂载后由 T-H01 移除页面级挂载（本 feature 自有文件）”；T-C01 修改范围删“单实例登记”、`stores/intake.ts` 不含实例登记，完成标准 3 改为“不调用任何文件正文读取 API（File 只取 name / size / type / lastModified）”并同步命令 3 标题（如 `WI metadata only`）；T-H01 修改范围加“移除 `jobs/pages/{JobListPage,JobDetailPage}.vue` 的 IntakeDrawer 挂载（不改 `app/**`）”，完成标准 1 保留“同一页面只渲染一个抽屉”作为集成断言。或 (b) 保留登记机制，但须 **Walter 书面同意**并在 tasks §3 与 `specs/README.md` 本 feature 行记录批准（A 不代批）。两者均不改 plan / spec。修正后由 A 新开会话做 **R6 定向复核**（只核 B-11 与未回退） | Tasks 可修正（或 Walter 批准） |

## O-1～O-10 独立裁定（不按“作者说在 plan 意图内”接受）

| # | 裁定 | 依据 |
|---|---|---|
| O-1 补 `UploadStatusLabel` / `OriginLabel` / `JobTypeLabel` | 接受 | AC-003-6 / AC-001-1 / S-17 要求的文案必须有来源，plan §2.4 口径“徽标只消费契约文案、不另建映射”决定了只能补在契约；同一机制、零行为 |
| O-2 补 `Conclusion` / `EvidenceAnchor` / `DerivedValue` / `StageWorkspace` / `WriteReceipt` 最小形态 | 接受 | spec R-004 / R-005 what 与 plan “写回执包含…” 已给语义；Tasks 只定字段，不加行为 |
| **O-3** T-A09 修改 frontend-workbench 既有三份契约测试的硬编码断言 | **接受（附 S-20）** | 本审核员核实硬编码真实存在（`contracts.spec.ts:248–253`、`contract-doc.spec.ts:64`、`mock.spec.ts:100`）；`CONTRACT_VERSION` 升 2.0.0 与方法数增加后这些断言**必然失败**，plan §6 又要求“合并前跑其 `pnpm test`”——不改则 plan §6 不可满足，删用例更差，故“只改受 v2 影响的硬编码、保留 v1 语义”是唯一且最小的解；v2 已被 plan §1 排除在契约 / schema 修改之外，不存在并发写者冲突；`mock.spec.ts:34` 的 9 文件断言因 glob 不递归**不受** `fixtures/jobs/` 影响（tasks §0 判断正确）。plan §1 / §6 未列这三份文件 → 记 S-20 要求补一行所有权与回滚说明（非阻断） |
| **O-4** IntakeDrawer 首个挂载实例登记 | **不接受 → B-11** | 见阻断表 |
| O-5 `persistence.ts` 提供只读状态订阅供横幅 | 接受 | plan §3 明确要求横幅显示降级 / 不可读，横幅必须有状态来源；订阅是最小机制且不经业务契约 |
| O-6 v1 十个方法在 job-* 场景按 normal 行为 | 接受 | 现 mock 代码路径本就如此；只在 describe 登记，不加分支 |
| O-7 已有 activeRunId 时第二个带上下文的 send 不替换、其终态不合并 overlay | 接受（附 S-23） | 是 A 在 R2 S-15 主动要求“一句话定清”的事项；与 plan “仅匹配 pendingRunId 的终态才合并”“j-merge 期间不切换 runId”一致，是一个守卫条件而非新机制；替换 activeRunId 的替代方案会使 overlay 失去归属，更差。边界“首个 run 终态后第二个仍在跑的 run 是否接任 activeRunId”未写 → S-23 在 describe 写明“不接任”，不加逻辑 |
| O-8 `manual-acceptance.md` 放 `specs/workbench-interaction/` | 接受 | R2 I-04 已接受 |
| O-9 aborted 用合成合法事件序列从系统边界注入 | 接受 | plan §4.7 要求 aborted 行为；不新增脚本；AGENTS §5.6 在系统边界注入 |
| O-10 schema 写在 `types.ts`，不建 `job-types.ts` | 接受 | plan §2.4 允许二选一；生成器只读 `types.ts` 的 `contractSchemas`，核实属实 |

## S-11～S-18 复核（Tasks 层关闭；非实现完成）

| # | Tasks 落点 | 可验证 | 判定 |
|---|---|---|---|
| S-11 展示映射入 CONTRACT.md | §2：九张 literal-object schema 与 `as const` 常量同源，注册 `contractSchemas`，不改生成器；T-A01 / T-A23 / T-G06 | 生成器 `fieldRows` 渲染 `const`（`contract-build.mjs:148`）已核；`contract-labels.spec` / `contract-doc.spec` 正反例 | 关闭 |
| S-12 revision 载荷按 kind 可辨识 | §2：`z.discriminatedUnion('artifactKind', …)` 四分支，deliverable 保留 `blocks`；T-A05 / T-A14～T-A16 | discriminatedUnion → `oneOf` 已核；`contract-entities.spec` 分支不匹配被拒；不可变性单测 | 关闭 |
| S-13 `getJob` → `Job \| null` | §2：null 只在 empty 场景预置 id；未知 id 一律 not_found；T-A02 / T-A10 / T-B04 | `job-state-read.spec` 两分支；AC-001-4 空态用预置 id | 关闭 |
| S-14 失败以 conflict + reason 呈现 | §2：schema refine + describe + j-failed 样例；T-A01 / A02 / A07 / A20 / B05 / G06 | `contract-labels.spec`、`job-state-rerun.spec`、`job-detail.spec`、`contract-doc.spec` | 关闭 |
| S-15 普通追问与 activeRunId | §2：带上下文的 send 在无 activeRunId 时登记并设为 active；不带上下文不改作业；上下文取发送时值；事件只投递一次；T-A18 / T-E03 / T-G01 | `job-state-agent.spec` 正反例 | 关闭（附 S-23） |
| S-16 kind v1 子集注记 | §2：13 种，不含 `source_pref` / `value_fix`，describe 注记定稿用独立 finalize；T-A01 / T-G06 | `contract-labels.spec`、`contract-doc.spec` | 关闭 |
| S-17 派生来源徽“内部生成” | §2：`OriginLabel.derived.text='内部生成'` + source 次文案，不新增色值；T-A01 / A23 / E01 / F01 | `badges.spec`、`analyze.spec`、`deliver-blocks.spec` | 关闭 |
| S-18 Deliverable 不变量在契约入口一次 parse | §2：判别联合（draft 三锚 null / final 三锚非空）+ `DeliverWorkspace` 一次 superRefine 对齐快照；T-A04 / A08 / A17 / G06 | superRefine 与生成器相容已核（`AgentRun` 先例）；`contract-deliverable.spec` 四反例、`fixtures.spec` j-deliver / j-delivered | 关闭 |

## 新建议（R5；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-19 | tasks §0 / T-A09；`contract-build.mjs:117–139` | 生成器 §4 “Mock 与实现选择”/ §5 是静态文案（只列 v1 五场景、九个 fixture 键、`window.__FAI_MOCK__.fixtures`），2.0.0 文档中将与 §1 的 `jobScenarios` 并存且不提 `jobFixtures`。不改生成器可接受，但 T-A09 的 `contractSemantics.jobScenarios` 应明写“§4 所列为 v1 五场景与 fixture 键；job-* 场景与 `__FAI_MOCK__.jobFixtures` 以本条为准”，T-G06 `contract-doc.spec` 断言该句存在，避免 Review 时被当作文档自相矛盾。 |
| S-20 | plan §1 所有权清单（:16）、§6 回滚块 | 补一行：“frontend-workbench 既有 `tests/unit/{contracts,contract-doc,mock}.spec.ts` 中受契约 2.0.0 影响的硬编码断言（仅 T-A09，保留 v1 语义）”进所有权与回滚范围，使 I-04 的“所有权 = 回滚块”在 Tasks 新增的这一文件集上继续成立。一行 plan 微调，可与 B-11 修正同批提交，不需 Plan 轮次。 |
| S-21 | analyze.md “最终状态” §1 与 R1-3 O-3 / O-5 / O-7 / O-9 | 任务编号为 r2 顺延前的旧号（T-A08 → 现 T-A09；T-A10 → T-A11；T-A17 → T-A18）。R1 表作为历史可保留，但“最终状态”段落应用现编号；Converge 时顺手改。 |
| S-22 | T-A18 / T-A19 / T-A20（各 2 h，均在上限且内容密集） | Implement 时若单项超 2 h，按 AGENTS §2 第 9 步在 tasks.md 追加拆分任务（如 A18 拆“上下文登记 + 事件投递”与“overlay / 终态合并”），不要硬塞。 |
| S-23 | tasks §2 S-15；T-A18 | 写明“activeRunId 在其终态后置 null，不由仍在运行的第二个带上下文 run 接任”（describe 一句，不加逻辑），使 `job-state-agent.spec` 的反例口径唯一。 |
| S-24 | T-A17 完成标准 2 “向 commit 注入失败” | 写明注入方式（如 mutator 在部分修改后抛错 / 边界校验失败）以保证测试测的是真实 `commit` 的回滚路径，而非测试自造的状态。 |

## 当前有效检查项（R5 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 未变（SHA256 与 R4 一致），46 条 AC；tasks 矩阵 46 / 46。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；Tasks / Analyze 未引入新需求问题；O-1～O-10 均为 plan 留白的落实而非需求变更，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；tasks §3 范围边界与之一致，未把 D-018 效果 ②～⑥ / 撤销 / 自动定稿 / 验证队列 / 格物致知 / D-019 带入。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 沿用 R4；tasks 未改 plan 落点。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** 两者 SHA256 与 R4 一致，未变。
- ☑ **I-01b spec / plan / tasks 之间无冲突（Analyze）。** 独立复核：tasks 未改 spec 行为 / AC、未改 plan 方法集 / 矩阵 / 场景 / 迁移表 / 版本与定稿语义 / 持久化规则 / 所有权；B-09 / B-10 未回退；Analyze R1～R4 结论“无内部冲突”经复核成立。O-4 不是 spec / plan / tasks 间冲突，是 §5.1 范围问题，记于 P-1。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** D-018 §1（显式 / 二次确认 / 不自动 / 不可撤销 / v1 只做①）→ tasks §3 + T-A17 / T-F07；D-018 §2 / designUI §2.4 “内部生成” → S-17；D-018 §5 `/learning` 不改（tasks 不涉及）；interaction §3.3 R1–R6 → T-A16 / T-A18 / T-A19 / T-G01 / T-G03；§3.4 kind v1 子集 → S-16 注记；§3.7 / designUI §5.2 `draft / final` → S-18；designUI §3.4 “已定稿 vN · 时间” → T-F01；§3.9 完成态不常驻角标 → T-A21。
- ☑ **I-03 前端基线事实核对。** 本轮重读 `D:/2030/Futures-AI-frontend` @ `b991059`：tasks §0 所列脚本名、配置、生成器结构、既有硬编码、fixture glob 不递归、`page.clock` 可用、mock 回放用 `setTimeout`、组件 / 脚本存在性**全部属实**（明细见“基线与范围”）。
- ☑ **I-04 文件边界与回滚一致。** tasks §1-5 所有权与 plan §1 一致，且 H 组不改壳方文件；新增的三份既有契约测试（O-3）在 spec §4 “只改 frontend/” 之内，plan §1 / §6 需补一行（S-20，非阻断）。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 沿用 R4；tasks 矩阵把 46 条映射到具体文件与标题（43 ✓ + 3 ◐ 外部阻塞）。
- ☑ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 62 任务 / 1～2 h / 无环 / 上下文·范围·标准·命令齐全 / 标准引用 AC / 标准↔命令 1:1 / 端到端 AC 用 e2e / `WI` 前缀 + jobs 路径隔离 / 真实脚本名 / H 组 `blocked_by: v2` / 头部 `implementation_base_sha: PENDING` 如实登记（独立复算与基线对照见结论）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** `check --only {glass,network,generated,colors,updown,grid}` 六项与 `check.mjs:8–14` 一致；T-G06 / T-A23 引用正确；徽标守卫由组件测试承担（未假称脚本具备）。

### 工程准则（AGENTS §5）

- ☐ **P-1 不为猜测场景加复杂度（§5.1）。** **未满足：B-11**——`intakeStore` 首个挂载实例登记是为 v2 之后的双挂载预先加的运行时逻辑，未经 Walter 同意，且有零逻辑的接线安排可替代。其余：commit 原子替换（plan §4.6 / §2.4 error 不产生部分修改要求）、持久化状态订阅（plan §3 横幅要求）、S-15 守卫、rerun 内存排队（plan 既定）均有 spec / plan 来源，不算猜测。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** tasks §1-7：契约输入 / 返回值 / 本地快照各 parse 一次；S-18 refine 在契约边界；表单复用契约 schema 提示，组件不重复校验。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `UploadStatus` 复用 `ArtifactStatusBadge` 渲染不新建组件；头部定稿状态不新增组件；`PersistenceBanner` 三处复用；`diff.ts` / `persistence.ts` 多消费者。
- ☑ **P-5 自动生成文件不手改（§5.5）。** tasks §1-4：生成物只靠 `contract` 生成、`contract --check` 对拍；不改生成器。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** e2e 取证走 normal 场景持久记录 + 介入历史界面，不加窗口钩子；aborted 从系统边界注入合法事件；diff 期望手写；`page.clock` 推进真实 mock 定时器。
- ☑ **P-7 按仓库现有流程（§5.7）。** 命令全部沿用 frontend-workbench 脚本；不新增工具 / 依赖；`pnpm test` 不改。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。** tasks 头部外部闸门如实；§0 两次核对 + 本轮第三次核对均为“v1 未 Handoff”；`specs/README.md` 本 feature 行“待 A 复核 / Implement 外部基线 blocked”与事实一致（只读核对；R5 结论由实施侧更新该行）。
- ☑ **C-02 契约闭环。** 30 个方法在 T-A10～T-A21 各有实现任务与单测；矩阵 23 个 action 在 T-A06 以判别联合建模并约束 kind。
- ☑ **C-03 事件与状态闭环。** T-A14 / T-A18 / T-A19 / T-A20 / T-A21 覆盖 pendingMerge 两条清除路径、同 run 匹配、failed / aborted 保留、排队与 pendingRunId 转交、inbox 生成 / 已读 / resolved；T-G01 e2e 正负向。
- ☑ **C-04 场景定义足以稳定验证。** T-A07 / T-A08 十个样例逐行对照 plan 表；T-A09 九场景；T-A10 / T-A11 / T-A12 场景读写行为；T-G05 遍历九场景 e2e；非 normal 不触碰两个 key 有 Storage spy 断言。
- ☑ **C-05 版本与定稿闭环。** T-A16 不可变历史；T-A19 accept / revert / resolve_conflict；T-A17 原子定稿 + 未决项拒绝 + final / cancelled 只读门（含删除来源与带封存作业 jobId 的 submitIntake）；T-F07 正负向 e2e；无反向方法。
- ☑ **C-06 隐私与本地持久化自洽。** T-A11 白名单（不含粘贴正文 / File）、512 KiB / 配额降级保留最后快照、损坏保留原 key；T-C01 File 只取元数据；T-G04 e2e；fixture 合成样例。
- ☑ **C-07 视觉与工程纪律。** T-A23 / T-D03 不新增色值与玻璃类，`check --only colors/glass` 纳入；差异行 / 徽标用文字 + 图标。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** tasks / analyze 未引用 D-015；D-017 仅在 S-17 作边界引用。

**合计**：25 项中 24 ☑、1 ☐（P-1，因 B-11）。（R6 注：R5 实际复选框为 26 项、25 ☑ / 1 ☐，原文算术笔误，结论不变；见 R6 S-26。）

### 阶段说明（不设复选框）

- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无；本轮未运行任何产品测试，不声称任何 AC 已通过。
- **Implement 前置**（累计）：(1) R4 ✓；(2) Tasks 复核：V-02 ✓、**P-1 ☐（B-11）→ 需 R6 定向补勾**；(3) `implementation_base_sha` = PENDING（frontend-workbench v1 Gate 2 + Handoff 合入 main 后登记，不得用 `b991059` 等中间提交替代）；(4) Analyze 复核 I-01b ✓。**Implement 不得开工**。
- **Converge 口径**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项在 v2 Gate 1 + 壳方交付 + T-H01～T-H03 前**必须报“未收敛（外部阻塞）”**；D-019 / 剪藏预览 / 复核结果 / 验证队列不计入本 feature。

## 最小关闭要求与下一步

1. 实施侧（Tasks 角色）按 B-11 (a) 修正 tasks.md §3 / T-C01 / T-H01（或走 (b) 取得 Walter 书面同意并登记）；建议同批处理 S-20（plan §1 / §6 各一行）、S-23 / S-24（tasks 一句话）、S-21（analyze 最终状态编号）；S-19 / S-22 可留到 Implement。修正后 A **新开会话** R6 定向复核：只核 B-11 关闭与 V-02 / I-01b 未回退，补勾 P-1。
2. R6 通过后 Implement 仍须等 frontend-workbench v1 Handoff 合入 main 的 commit 登记为 `implementation_base_sha`；届时按 tasks §0 / §7 重新核对前端事实，如有出入先修 tasks 并重跑 Analyze。
3. 实施侧更新 `specs/README.md` 本 feature 行（R5 未通过 → 待 B-11 修正与 R6）；本审核员不改该文件。plan / README / tasks / analyze 的工作区改动与本文件一并由实施侧提交（本审核员未 commit）。

## 结构核验证据（R5，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；无新提交）；git status: M README / M checklist / M plan / ?? analyze.md / ?? tasks.md（审查前后一致）
INPUTS    spec ed0f6c6c…942d9 | plan 981ecc25…81d21 | checklist(含R4) 56181b02…b5075 | tasks 98d080d3…740fc | analyze c97f6cad…2259b | README 66376f8e…dc55e（写入前复核一致）
TASKS     62 任务 / 62 唯一 / 96.5 h / 每项 0.5–2 h / 依赖全部指向更早编号 / 状态均“未开始” / 62×blocked_by v1 / H 4×blocked_by v2
          完成标准↔验证命令条数 1:1（0 例外）；每条标准含 AC 引用（0 例外）；46/46 AC = spec 集合；矩阵 46 行
          “部分前置”均为最终任务祖先（0 例外）；T-G06 / T-G09 的祖先覆盖全部 A–F 任务；184 条 -t/-g 标题均以 WI 开头
FRONTEND  D:/2030/Futures-AI-frontend @ b991059（feat/frontend-workbench）；非 main(85c6cbb)/origin/main(3bf6476) 祖先；review.md“不是 Handoff；Gate 2 尚未批准”
          scripts contract/check/typecheck/lint/test:unit/test:e2e/test ✓；vitest include tests/**/*.spec.ts ✓；playwright testDir ./e2e ✓；@playwright/test 1.64.1 ✓
          硬编码 contracts.spec:248–253 / contract-doc.spec:64 / mock.spec:100；mock.spec:15 glob fixtures/*.json 不递归（9 个）✓
          contract-build: contractSemantics 字符串→§1；fieldRows const/enum；§4/§5 静态五场景；AgentEvent→oneOf；AgentRun(superRefine)∈$defs ✓
          shared/components/{Badge,Loading,EmptyState,ErrorState}.vue ✓；agent/{store,AgentDrawer}.vue ✓；nav.ts 无 jobs 项；real/index.ts 逐方法桩 ✓
DOCS      D-018 §1/§2/§5；interaction §3.3–§3.5/§3.7/§7；designUI §2.4/§3.4/§3.5/§3.9/§5.1/§5.2
AGENTS    §5.1（B-11 依据）、§5.2/§5.5/§5.6、§6（A = claude-fable-5-1 via anthropic，继承 R3 探活，未重探 bridge）
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md；其余五个 dirty 文件原样保留；git diff --check 见回复
```

---

# R4（2026-10-28，第四轮：B-09 / B-10 plan 补正定向复核；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，HEAD **`8bd1b31`**（与 R3 相同；本轮**无新提交**）。审核对象不是提交，而是固定基线 + 真实工作区 diff：启动时 `git status --porcelain` 为 ` M specs/README.md`、` M specs/workbench-interaction/checklist.md`、` M specs/workbench-interaction/plan.md`（三个未提交改动，**工作区不干净**，本轮如实记录；plan / README 的改动由本审核员原样保留、未触碰）。
- 冻结输入（审查前、写入前两次核对一致）：spec raw SHA256 `ed0f6c6c…942d9`（v1.1，未变）；plan raw SHA256 `981ecc25…81d21`（306 行 = 304 + 头部 2 行）；原 checklist（含 R3）raw SHA256 `0999eb21…ef35e`；`specs/README.md` raw SHA256 `8a1b5f0e…ca0b6`（只读）；`git diff --no-ext-diff --no-color HEAD -- specs/workbench-interaction/plan.md` 输出 SHA256 `24940ae4…8df68`。本审核员亲自读取该 diff 全文（12 个 hunk，+14/−12），未按调度摘要直接勾选。
- **行号口径**：plan 本轮仅在页首新增 2 行（:6 补正说明、:7 派工记录），其余均为行内替换、无增删行；因此 R3 / R2 引用的 plan 行号自第 5 行之后**一律 +2**（如 R3 的 plan:84 → 现 :86、:87 → :89、:81 → :83、:176 → :178、:196 → :198、:205 → :207）。下文行号均为当前 plan（306 行）行号。
- 重读：AGENTS.md、`docs/plan.md`、spec.md、plan.md（分段读完）、checklist.md（R3/R2/R1 分段读完）、`templates/checklist.md`、D-018（`docs/decisions/20261028-interaction-supplement.md`）、`docs/interaction.md` §3.4 / §3.5 / §3.7、`docs/designUI.md` §2.4 / §3.4 / §3.5 / §5.2、`specs/README.md`（只读）。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（继承 R3 探活证据，见页首；本轮未重探 bridge）。派工脱敏记录：角色 A / 任务 Checklist R4 / 基线 `8bd1b31` + 上述 diff 哈希 / provider `anthropic` / 继承失败类别 `claude-bridge` quota·rate·spend_limit（exit 1，R3 窗口）。Plan 补正者 claude-opus-5-5 via anthropic，独立会话。
- **未执行**：未安装依赖、未运行测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / docs / 状态表 / 其他 feature、未创建 tasks / review 或任何新文件、未 commit / push / merge / 切分支。唯一写入文件为本文件（新增 §R4、页首说明、把 §R3 的 24 个 `[x]` / `[ ]` 改为 ☑ / ☐ 文字；R3 内容未动）。

## 结论（R4）：**通过**（定向）

- **B-09 闭环、B-10 闭环**（逐项见下）；R2 的 B-01～B-08、D-018 的显式 / 二次确认 / 不自动定稿 / 不可撤销 / v1 只做①+派生标记、spec §2 非目标 scope **均未回退**（diff 12 个 hunk 全部落在 R3 列出的 B-09 / B-10 位置，未触及方法表、19 行矩阵、九场景行为表、rerun 迁移表、§4.5 / §4.7、§1.1 所有权、§3 持久化规则、§6～§8）。
- 本轮核的是**文档设计闭环**；未实现不计为 defect；未新增产品需求；未引入猜测性竞态复杂度（§4.6 的“同一次 mock 状态提交”只是把 R3 要求的“原子地”落到 R2 已定的“mock 层唯一可变状态”上，不加锁、不加状态机）。
- **允许进入 Tasks**。Implement 前置不变：(1) Tasks 头部登记 frontend-workbench v1 Handoff SHA；(2) Tasks 经 A 新会话复核（V-02）补勾；(3) Analyze 报告结论经 A 复核（I-01b）。AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项仍为外部阻塞，Converge 必报“未收敛（外部阻塞）”。S-11～S-17 仍**未关闭**（归 Tasks，非到期阻断）。

## 逐 B 复核（B-09 / B-10）

| # | R3 最小关闭要求 | 补正落点（当前 plan 行号；diff 核实） | 核实 | 判定 |
|---|---|---|---|---|
| **B-09** `SourceNote` 发布日期字段 | :84 改回 `publishedAt`（或明确表示来源发布日期的名字）；在日期类型说明处注明与定稿 `finalizedAt` 无关 | :86 `SourceNote` = `{purpose(非空), reliability(high/medium/low/unknown), publishedAt:null或日期（材料发布日期，不是定稿时间）, validUntil:null或日期, scopeNote:null或文本}`；:198 日期类型：`publishedAt` / `validUntil` 与作业日期用 `TradingDate`（`YYYY-MM-DD`），定稿时间 `finalizedAt`（`FinalSnapshot` 与 `Deliverable` 定稿元数据）为 ISO 8601 带偏移时间戳，并明写“`publishedAt` 指被投放材料自身的发布日期，与交付物定稿时间 `finalizedAt` 是不同概念，不互换、不同名”；:238 AC-003-3 payload 断言列出 `sourceNote.purpose/reliability/publishedAt/validUntil/scopeNote`；:266 AC-008-1 对拍含 `SourceNote.publishedAt` | 与 spec:74 “时效（发布日期 / 有效期）”语义一致；与 D-018 §3 剪藏 frontmatter `published_at` 同义；全文 grep `finalizedAt` 仅出现在 :89 / :92 / :178 / :198 / :207（均为交付物 / 快照语境），`SourceNote` 语境已无 `finalizedAt`；类型分离（日期 vs 时间戳）使两者在契约层不可混用；:194 持久化白名单仍含 `sourceNote`，:124 ingest payload 仍含 `sourceNote`，AC-003-3 的断言落点可用；无需改 spec | **闭环** |
| **B-10** 交付物 `draft / final` 独立字段 | `Deliverable` 增含 `final` 字面量的状态 + 快照 / 时间 / 版本锚；`DeliverableStatusLabel`（草稿 / 已定稿）；§4.6 `finalizeDeliverable` 成功时原子 `draft→final` + `job.delivered`；j-delivered 初始 `final`、其余 `draft`；定稿信息“已定稿 vN · 时间” | (a) :89 `Deliverable` 交付物级定稿元数据 `{deliverableStatus:'draft'或'final', finalSnapshotId:null或id, finalRevisionNumber:null或正整数, finalizedAt:null或时间戳}`，draft 时三锚均 null，final 时均非空且与对应 `FinalSnapshot` 一致；明写独立于 `JobStatus` 与 `Artifact` / `Block` 的 `status`，只由 `finalizeDeliverable` 改变，UI 与 mock 都不从 job.status 或快照存在推导。(b) :83 展示映射新增 `DeliverableStatusLabel`（draft=草稿 / final=已定稿），走同一“契约导出、徽标只消费”口径。(c) :166 样例规则：仅 j-delivered 初始 `final`，其余样例与 `createJob` 新建交付物初始 `draft`、锚为 null；:178 j-delivered 行写明三锚与该 snapshot 一致；:202 §4.1 createJob 初始交付物 `deliverableStatus=draft`、锚 null。(d) :207 §4.6：未决项 → `validation_error`，不生成快照、不改作业状态、**交付物保持 draft**（不局部修改）；成功时在同一次 mock 状态提交内原子完成：深拷贝 `FinalSnapshot` → `deliverableStatus draft→final` + 写入 `finalSnapshotId` / `finalRevisionNumber`（该 revision 的 number）/ `finalizedAt`（=快照 finalizedAt）→ `job.status→delivered` → 唯一一条 `finalize` 事件；“不存在只完成其中一部分的中间状态”。(e) :207 头部显示按 `DeliverableStatusLabel`：final 为“已定稿 vN · 时间”（N=finalRevisionNumber，时间=finalizedAt），draft 为“草稿”；只读交付物元数据、不从 job.status 推导、不新增组件。(f) :259 AC-006-7 落点改为“同一次提交内快照 + `deliverableStatus=final`（定稿锚与快照一致）+ delivered，头部‘已定稿 vN · 时间’+ 只读；未决项被拒时快照 / 交付物 draft / 作业状态均不变”；:266 AC-008-1 对拍含 `Deliverable` 定稿元数据与 `DeliverableStatusLabel` | 对照 spec:126（`draft → final`、置 delivered、显示定稿信息、只读、不自动定稿）、Q-013（契约标识符 `final`）、interaction §3.5 / §3.7（交付物另有 `draft / final`；不可撤销；v1 只做①）、designUI §5.2（元数据含定稿状态）/ §3.4（“已定稿 vN · 时间”）逐项有落点。`deliverableStatus` 命名避开 Block / Artifact 共同字段 `status`（draft/provisional/confirmed/conflict），AC-006-8 块级徽与交付物级头部不混淆。不可撤销：无任何反向方法，final 后含“重复定稿”在内的一切领域写方法在契约入口拒绝（:207 原文保留）；不自动：唯一入口 `finalizeDeliverable` 经 `FinalizeDialog` 二次确认，:216 rerun 成功终态仍“不自动 delivered”，cancelled 作业交付物不被置 final。null / non-null 不变量在 draft / final 两态都写死，e2e 可直接断言。`fai.jobs.v1`（:69）已含“交付物/定稿快照”，元数据随之持久化。无需改 spec、不动 docs | **闭环** |

## 未回退核对（B-01～B-08 与 D-018 scope）

| 对象 | 核对方式 | 结果 |
|---|---|---|
| B-01 方法集与动作矩阵 | diff 未触及 :98–:114 方法表、:122–:144 矩阵；`finalizeDeliverable` 仍为 kind `finalize` 的唯一方法，仍“一次确认只产生一条定稿事件”，§4.6 新文与 :142 矩阵行一致 | 未回退 |
| B-02 九场景行为表与样例 | diff 只改 :166 附加一句样例规则与 :178 j-delivered 说明列；九场景 × 读/写/快照表、其余八个样例行原样 | 未回退 |
| B-03 rerun 迁移表 | :211–:220 未在 diff 中 | 未回退 |
| B-04 类型表 | 仅 :83 / :86 / :89 三行按 B-09 / B-10 扩展，其余类型未动；camelCase 规则 :96 未动 | 未回退 |
| B-05 版本 / 定稿闭环 | :206 §4.5 accept / revert / resolve_conflict 未在 diff；:207 §4.6 的未决项拒绝 → validation_error、final 后领域写方法拒绝清单、cancelled 只读、快照与历史不可变等原文保留，仅插入原子提交与头部显示句 | 未回退 |
| B-06 所有权 / 基线 / blocked_by | §1.1、:16–:18、§6 回滚、§7、§8 未在 diff | 未回退 |
| B-07 持久化 / 隐私 | :194–:197 未在 diff（:198 仅日期类型说明） | 未回退 |
| B-08 角标 / 收件箱 | :68–:70、:93 未在 diff | 未回退 |
| D-018 §1 scope | 新文未加撤销 / 自动定稿 / 归档“未审阅”/ 效果②～⑥；v1 仍只做冻结 + 派生标记（spec §2 非目标未变） | 一致 |
| spec v1.1 | SHA256 与 R3 基线一致，46 AC 未变 | 未变 |

## S-11～S-17 状态（不阻断、不计入判定）

| # | 状态 |
|---|---|
| S-11 展示映射入 CONTRACT.md 的机制 | **未关闭**——`tasks.md` 不存在；B-10 的 `DeliverableStatusLabel` 走同一机制，Tasks A 组一并落实 |
| S-12 revision 载荷按 artifact kind 可辨识 | **未关闭**——Tasks 定义 |
| S-13 `getJob` 结果 `Job \| null` | **未关闭**——Tasks 定义 |
| S-14 run failed 以 `conflict` 呈现 + `job.reason` 说明 | **未关闭**——Tasks 定义 |
| S-15 抽屉普通追问是否设置 `activeRunId` | **未关闭**——Tasks 定义 + mock 状态机单测 |
| S-16 kind 为 v1 子集的 CONTRACT.md 注记 | **未关闭**——Tasks A 组 |
| S-17 `origin=derived` 来源徽文案“内部生成” | **未关闭**——Tasks 定义 |

七项均属 Tasks 落实事项，当前阶段未到期，不是阻断；不得以“计划将在 Tasks 落实”视为已完成。

## 新建议（R4；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-18 | plan:89 / :96 | `Deliverable` 定稿元数据的 draft→三锚 null、final→三锚非空不变量，建议在契约入口的一次 parse（:96 口径）用 zod refine 表达，而不是在组件内再检查；AC-008-1 的 schema 单测用 j-delivered 与 j-deliver 两个 fixture 各过一次 parse 即可覆盖。Tasks A 组写明即可。 |

## 当前有效检查项（R4 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec v1.1 未变（SHA256 一致），46 条 AC 编号集合未变。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；本轮补正未引入新需求问题，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变；补正未把 D-018 效果 ②～⑥ 或撤销 / 归档带入 v1。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** spec:126 “交付物状态 `draft → final`”现有 :83 / :89 / :166 / :178 / :202 / :207 / :259 落点（B-10 闭环）；其余 what 的落点沿用 R2（B-01～B-08 未回退）。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** spec:74 ↔ plan:86 / :198（B-09 闭环）；R2 消除的三处冲突与 R3 发现的两处均未复发；全文无残留同名异义。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** interaction §3.7 / designUI §5.2 的交付物 `draft / final` 已建模；D-018 §1 显式 / 二次确认 / 不自动 / 不可撤销 / v1 只做① 与 §4.6 一致；designUI §3.4 “已定稿 vN · 时间”落在 :207；D-018 §3 `published_at` 与 `SourceNote.publishedAt` 同义；D-018 §5 `/learning` 不改（:292）；S-16 / S-17 仍为非冲突备注。
- ☑ **I-03 前端基线事实核对。** 沿用 R2（本轮变更不涉及前端代码事实；未重读前端分支）。
- ☑ **I-04 文件边界与回滚一致。** 新增字段 / Label 均在 `contracts/**` 本 feature 所有权内；:16–:18 / :286 / spec §4 未变。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条映射沿用 R2（43 ✓ + 3 ◐ 外部阻塞）；R3 标 ✓* 的 AC-003-3 / AC-006-7 / AC-008-1 / AC-008-4 的断言字段名与状态字面量现已确定（:238 / :259 / :266），升为 ✓。
- ☑ **V-03 静态守卫声称与真实脚本一致。** plan:184 未变。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 补正只加 spec / docs 已要求的状态字段、Label 与原子提交说明；不加撤销、自动定稿、归档、锁或新状态机；S-18 为单点 refine 建议。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** :96 未变；:207 “只读交付物元数据，不从 job.status 推导”与之一致。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** :207 明写“不新增组件”，头部显示复用交付台现有头部。
- ☑ **P-5 自动生成文件不手改（§5.5）。** 未变；新 Label / 字段经 `contractSchemas` + 生成器进 CONTRACT.md（机制细节仍为 S-11）。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 未变。
- ☑ **P-7 按仓库现有流程（§5.7）。** 未变。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。**（B-06）未变；`specs/README.md` 本 feature 行已登记“R3 未通过 → plan 补正 → 待 R4”（只读核对，与本轮事实一致；R4 结论由实施侧更新该行）。
- ☑ **C-02 契约闭环。**（B-01）方法集与 19 行矩阵未变。
- ☑ **C-03 事件与状态闭环。**（B-02c / B-03 / B-05）未变。
- ☑ **C-04 场景定义足以稳定验证。**（B-02）九场景 × 九样例未变；新增的交付物初始状态规则覆盖全部样例与 createJob。
- ☑ **C-05 版本与定稿闭环。**（B-05 + B-10）accept / revert / resolve_conflict / 定稿检查点 / final 后只读未变；交付物级状态与三锚、原子提交、头部显示现已闭环。
- ☑ **C-06 隐私与本地持久化自洽。**（B-07）未变；`sourceNote.publishedAt` 为日期字符串，持久化子集不变。
- ☑ **C-07 视觉与工程纪律。** 未变；`DeliverableStatusLabel` 只提供文案，不新增色值；S-17 文案不新增色值。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 未变。

**合计**：24 项中 24 ☑、0 ☐。

### 阶段说明（不设复选框；与 R3 相同，本轮无新产物）

- **I-01b（Analyze）/ V-02（Tasks）**：`tasks.md` 仍不存在，阶段未到，不倒置流程；R4 通过后 Tasks 产出，再由 A 新会话复核补勾。
- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无。
- **Implement 前置**（累计，当前仅 (1) 满足）：(1) B-09 / B-10 修正后 R4 通过 ✓；(2) Tasks 经 A 复核补勾；(3) Tasks 头部登记 frontend-workbench v1 Handoff SHA；(4) Analyze 报告结论经 A 复核。

### 逐 AC 映射（R4 增量；未列出的 41 条沿用 R2 判定，plan 行号按本轮口径 +2）

| AC | R3 | R4 | 说明 |
|---|---|---|---|
| AC-003-3 | ✓* | ✓ | :86 / :124 / :194 / :238：`sourceNote` 五字段名确定，payload 断言可写 |
| AC-006-7 | ✓* | ✓ | :89 / :142 / :207 / :259：`deliverableStatus=final` + 三锚 + delivered + 头部文案 + 只读；未决项拒绝时三者均不变 |
| AC-006-8 | ✓ | ✓ | 块级徽不变；交付物级状态由头部按 `DeliverableStatusLabel` 显示，不与块徽混淆 |
| AC-008-1 / AC-008-4 | ✓* | ✓ | :266 对拍含新字段与 Label；CONTRACT.md 2.0.0 变更说明随之 |
| AC-003-1 / AC-005-5 / AC-007-4 | ◐ | ◐ | 外部阻塞（v2）不变；Converge 必报“未收敛（外部阻塞）” |

## 最小关闭要求与下一步

1. **R4 通过**；B-09 / B-10 关闭，无需再做 Plan 补正轮次。
2. 进入 **Tasks**：按 plan §8 A～H 分组；A 组一并落实 S-11～S-18；H 组显式 `blocked_by: frontend-workbench-v2`；头部登记 frontend-workbench v1 Handoff SHA（未登记则 Implement 不得开工）。
3. Tasks 产出后由 A（新开独立会话）复核 V-02 / I-01b 并在本文件补勾；Analyze 报告结论由 A 复核；均不得由本轮任何勾选代替。
4. Converge 口径不变：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项为外部阻塞；D-019 / 剪藏预览 / 复核结果不计入本 feature。
5. 实施侧更新 `specs/README.md` 本 feature 行（R4 通过 → 可进入 Tasks）；本审核员不改该文件。plan.md / specs/README.md 的工作区改动与本文件一并由实施侧提交（本审核员未 commit）。

## 结构核验证据（R4，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；无新提交）；启动时 git status: M plan.md / M checklist.md / M specs/README.md
SPEC      SHA256 ed0f6c6c…942d9（审查前后一致；v1.1，46 AC）
PLAN      SHA256 981ecc25…81d21（审查前后一致）；306 行 = 304 + 页首 2 行；R3/R2 行号自 :5 后 +2
DIFF      git diff HEAD -- plan.md 输出 SHA256 24940ae4…8df68；12 hunk，+14/−12：:6–7 头部、:83 Label、:86 SourceNote、
          :89 Deliverable、:166 样例规则、:178 j-delivered、:198 日期类型、:202 §4.1、:207 §4.6、:238 / :259 / :266 §5
TERMS     plan grep finalizedAt → :89 :92 :178 :198 :207（全部交付物/快照语境）；publishedAt → :6 :86 :198 :238 :266；
          残留“发布”仅 :86 / :198（材料发布日期，正确）；deliverableStatus/DeliverableStatusLabel → :6 :83 :89 :178 :202 :207 :259 :266
DOCS      D-018 §1 显式/二次确认/不自动/不可撤销/v1 只做①；§3 published_at；interaction §3.5/§3.7 draft/final；
          designUI §5.2 元数据含定稿状态、§3.4 “已定稿 vN · 时间”、§2.4 “内部生成”
AGENTS    §6：A 首选 claude-fable-5-1；R4 走 anthropic（继承 R3 探活，未重探 bridge）
PROBE     继承 R3：claude-bridge/claude-fable-5-1 exit 1（quota/rate/spend_limit 类）；anthropic/claude-fable-5-1 exit 0；本轮未新探
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md；plan.md / specs/README.md 工作区改动原样保留；git diff --check 见回复
```

---

# R3（2026-10-28，第三轮：spec v1.1 术语同步定向复核；历史快照，复选框已改为文字符号，不参与当前判定）

## 基线与范围

- 工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，审查提交 **`8bd1b31`**（HEAD；启动前 `git status --short` 为空，工作区干净）。本 worktree 由本会话串行独占 checklist 写权限；调度会话只读。
- 基线变化：`f944149`（R2 通过时提交）→ `c238bd8`（spec v1.1 术语同步 + plan 同步，Q-013）→ `8bd1b31`（Walter 批准，Gate 1 重新通过，v1.1 冻结）。比较 `git diff f944149 8bd1b31 -- specs/workbench-interaction/{spec,plan}.md`：spec +11/−9（205 行）、plan +26/−26（304 行，**仅行内替换、无增删行，R2 的 plan 行号全部仍有效**）。
- 同批次变更的只读参考：`AGENTS.md`（§6 模型路由）、`docs/plan.md`、`docs/interaction.md`、`docs/designUI.md`、`docs/decisions/20261028-interaction-supplement.md`（D-018）、`specs/README.md`；均已完整读取。`checklist-review-request.md` 为 R2 历史输入，不覆盖本轮指令。
- **审核员与通道**：A = claude-fable-5-1 via anthropic（探活与切换原因见页首）。独立新会话，与实施隔离；本轮无实施会话并行写入本 worktree。派工脱敏记录：角色 A / 任务 Checklist R3 / 基线 `8bd1b31` / provider `anthropic` / 失败类别 `claude-bridge` quota·rate·spend_limit（exit 1）。
- **未执行**：未安装依赖、未运行测试或应用、未启动其他 agent、未读凭证或全局配置、未改 provider / 路由、未修改 spec / plan / docs / 状态表 / 其他 feature、未 commit / push / merge / 切分支。唯一写入文件为本文件（含把 §R2 的 24 个 `[x]` 改为 ☑ 文字，内容未动）。

## 结论（R3）：**未通过**（定向；阻断 2 项，均为 plan 内一至三行的设计补全，不需回流 Clarify、不动 v1.1 spec）

- spec v1.1 的术语同步**本身合格**：46 条 AC 编号集合与 `f944149` 一致（46/46），仅 AC-006-7、AC-007-3 文字"发布→定稿"，语义不变；R-006 what 增加 D-018 §1 的定稿定义（`draft → final`、不自动定稿）；非目标"学习区→格物致知"；Q-001 / Q-008 措辞；新增 Q-013 并已裁定。spec 未误改其他领域：R-003:74 来源说明"时效（发布日期 / 有效期）"**正确保留**（此"发布"指来源文档的发布日期，与 D-018 定稿无关）。
- plan 的同步**有一处误改、一处遗漏**：
  - **B-09** plan:84 把来源说明 `SourceNote.publishedAt` 改成了 `finalizedAt`——这是来源文档的发布日期（spec:74；plan:196 仍写"发布日期/有效期"），不是定稿时间；属关键词替换误伤其他领域语义，并与 plan:90 `FinalSnapshot.finalizedAt` 同名异义。
  - **B-10** spec:126 / Q-013 新增的"交付物状态 `draft → final`"（契约标识符 `final`）在 plan 中没有任何落点：`Deliverable`（plan:87）无定稿状态字段，展示映射（plan:81）无对应 Label，`FinalSnapshot`（plan:90）只是快照对象；只读与"定稿信息"目前完全由 `job.status=delivered` + 快照存在推导。
- 其余 24 处 plan 改动（组件名 `FinalizeDialog`、`finalizeDeliverable`、kind `finalize`、`FinalSnapshot`/`finalizedAt`（快照）、场景与样例文案、人工验收 M-08、§7 导航"格物致知"（`/learning` 不改）、§8 F 组）均为同义替换，逐处核对与 spec v1.1 / D-018 §1·§5 / interaction §3.5·§3.7 / designUI §3.4·§5.2 一致，**未改变 R2 已闭环的方法 / 场景 / 状态迁移 / 版本语义**（B-01～B-08 不回退）。
- S-11～S-15 **未关闭**（见下节）；新建议 S-16、S-17 不阻断。
- **不允许进入 Tasks**，直到 B-09 / B-10 在 plan 内修正并由 A（新开会话）做 R4 定向复核。Implement 仍另需 v1 Handoff SHA 与 Tasks 复核（见阶段说明）。本轮不因"用户说已完成"放行任何未到期阶段。

## 术语变更逐处核对（`git diff f944149 8bd1b31`）

| 位置 | 变更 | 核对依据 | 判定 |
|---|---|---|---|
| spec:6–7 页首 | 新增 v1.1 记录与 D-018 来源 | AGENTS §2 第 8 步（回流 Clarify → 重过 Gate 1）；`8bd1b31` 提交信息 | ✓ |
| spec:24 / :31 | 目标"定稿快照"；非目标"格物致知" | D-018 §1 / §5；Q-013 | ✓（非目标仍排除学习循环产品区） |
| spec:126（R-006 what） | "定稿（D-018 §1）：…交付物状态 `draft → final`…v1 不自动定稿" | interaction §3.5 / §3.7；designUI §5.2 | ✓ 需求面；**plan 无落点 → B-10** |
| spec:135 AC-006-7、:143、:149 AC-007-3 | 发布→定稿 | 语义不变 | ✓ |
| spec:194 Q-001、:200 Q-008、:205 Q-013 | 措辞与新裁定 | Walter 2026-10-28 | ✓ |
| spec:74 R-003 | **未改**"时效（发布日期 / 有效期）" | 来源文档发布日期 ≠ 定稿；D-018 §3 剪藏 frontmatter 亦用 `published_at` | ✓ 正确保留 |
| plan:50 `FinalizeDialog`、:55 二次确认清单、:67 定稿快照、:111 `finalizeDeliverable`、:118 定稿未决项、:141–142 矩阵（kind `finalize`，附 D-018 §1）、:159–160 / :170 / :175–176 场景样例、:185–186 e2e 与 M-08、:204–206 §4.5–4.7、:214 / :216 迁移表、:257 / :261 §5、:302 §8 | publish→finalize / 发布→定稿 | 同义替换；B-01/B-02/B-03/B-05 的闭环内容逐字对照未变 | ✓ |
| plan:83 kind 列表 `publish`→`finalize` | 13 种数量不变 | interaction §3.4 示意表把"定稿"归 `approve`，本 feature 自 R1 起即以独立 kind 承载（R1 已接受"schema 以 feature spec 为准"） | ✓（S-16 备注） |
| plan:90 `PublishSnapshot{publishedAt}`→`FinalSnapshot{finalizedAt}` | 快照对象 | 定稿时间，语义正确 | ✓ |
| **plan:84 `SourceNote.publishedAt`→`finalizedAt`** | 来源说明时效字段 | spec:74、plan:196 均为"发布日期"；与 :90 同名异义 | **✗ B-09** |
| plan:290 §7 导航"学习"→"格物致知"（路由 `/learning`） | v2 前置变更描述 | D-018 §5；designUI §3.1 / §3.10；`specs/README.md` 跨 feature 待同步行 | ✓ |

## 阻断项（R3；均为设计补全，plan 内修正，不动 spec）

| # | 严重度 | 位置 | 问题 | 受影响 AC | 最小关闭要求 | 分类 |
|---|---|---|---|---|---|---|
| **B-09** | 中（会进入契约类型、`CONTRACT.md`、AC-003-3 的 payload 断言与持久化子集，命名与 `FinalSnapshot.finalizedAt` 冲突） | plan:84 | `SourceNote` 的时效字段被术语替换误改为 `finalizedAt`；spec:74 该字段语义为来源文档**发布日期**，plan:196 日期类型说明仍称"发布日期/有效期" | AC-003-3（payload 字段名）、AC-008-1 / AC-008-4（字段清单与文档） | plan:84 改回 `publishedAt`（或其他明确表示"来源发布日期"的名字，如 `sourcePublishedAt`），并在 :196 或 :94 命名对照处注明"来源说明的 publishedAt 为材料发布日期，与定稿 `finalizedAt` 无关" | 设计补全 |
| **B-10** | 中（需求 what 与 Q-013 承诺的契约标识符无实现落点；Tasks 无法确定是否建字段、e2e 无法断言"交付物状态 final"） | plan:81 / :87 / :90 / :176 / :205 | spec:126 要求"交付物状态 `draft → final`"、Q-013 要求契约标识符含 `final`、interaction §3.7 "交付物另有定稿状态 `draft / final`"、designUI §5.2 交付物元数据含定稿状态、§3.4 定稿后徽章"已定稿 vN · 时间"；plan 的 `Deliverable` 没有该状态字段，展示映射无 Label，只读/定稿信息由 `job.status` 与快照存在间接推导 | AC-006-7（定稿信息 / 只读的断言依据）、AC-006-8（交付台块级徽之外的交付物级状态显示）、AC-008-1 / AC-008-4 | plan:87 `Deliverable` 增加元数据 `{status:'draft'\|'final', finalSnapshotId:null\|id, finalizedAt:null\|ts, finalRevisionNumber?}`（命名由实施者定，但须含 `final` 字面量）；plan:81 增 `DeliverableStatusLabel`（草稿 / 已定稿）；§4.6 写明 `finalizeDeliverable` 成功时原子地 `draft→final` 与 `job.delivered`，j-delivered 样例为 `final`，其他样例为 `draft`；定稿信息显示"已定稿 vN · 时间"（designUI §3.4）。无需改 spec | 设计补全 |

## 新建议（R3；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-16 | plan:83；interaction §3.4 | interaction §3.4 经 D-018 §4 新增 `source_pref` / `value_fix`（处理台换源 / 手工修正值），且示意表把"定稿"归入 `approve`；本 feature 冻结 spec 的 R-004 不含换源 / 修正值（Q-013 不加 AC），plan 的 13 种 kind（含独立 `finalize`）是 v1 子集。建议 CONTRACT.md 的 kind 说明注明"v1 子集；`source_pref` / `value_fix` 归后续处理台 / data-layer 映射 feature"，避免 Review 时被当作 I-02 冲突。 |
| S-17 | plan:13 / :81 `SourceLabel`；designUI §2.4（v1.1） | designUI §2.4 现规定引用派生内容时来源徽文案为"**内部生成**"（根来源索引归 D-017 / 知识库 feature，非本 feature）。Tasks 中把 `origin=derived` 的来源徽文字定为"内部生成"（spec §4：界面细则以 designUI 为准），AC-005-1 / AC-006-8 的徽标断言据此写；不新增色值。 |

**知悉（非缺陷）**：同批 docs 还新增了 D-019 角色芯片 / 成本显示（designUI §3.6）、交付台"复核结果"（§3.4）、采集台"剪藏预览"（§3.4）。这些不在 v1.1 冻结 spec 内（Q-013 明确不加 AC），归后续 feature；本轮不计入本 feature 缺口，Converge 亦不应以此报未收敛。

## S-11～S-15 状态（R2 遗留；按实际产物判断）

| # | 依据行（本轮核对未变） | 状态 |
|---|---|---|
| S-11 展示映射入 CONTRACT.md 的机制 | plan:16 / :81 / :95 未变 | **未关闭**——`tasks.md` 不存在，无 A 组任务可核；维持"Tasks A 组写明机制"，由 A 在 Tasks 复核时验证。B-10 新增的 `DeliverableStatusLabel` 走同一机制 |
| S-12 revision 载荷按 artifact kind 可辨识 | plan:80 / :89 未变 | **未关闭**——同上，Tasks 中定义 |
| S-13 `getJob` 结果 `Job \| null`（empty 场景） | plan:115 / :153 未变 | **未关闭**——同上 |
| S-14 run failed 以 `conflict` 呈现 + `job.reason` 的文档说明 | plan:169 / :215 未变 | **未关闭**——同上；CONTRACT.md `StageStateLabel` 说明在 Tasks 落实 |
| S-15 抽屉普通追问 `send({jobContext})` 是否设置 `activeRunId` | plan:116 / :174 / :203 未变 | **未关闭**——同上；mock 状态机单测覆盖在 Tasks 落实 |

五项均不阻断、不改变本轮判定；不得以"计划将在 Tasks 落实"视为已完成，Tasks 产出后由 A 逐项核。

## 当前有效检查项（R3 勾选；唯一参与 Implement 前置判定）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** v1.1 46 条 AC（5/5/6/5/6/8/5/4/2）编号集合与 v1.0 一致，验证形态未变。
- ☑ **N-02 无未澄清歧义。** Q-001～Q-013 全部裁定；Q-013 融入位置（页首、§2、R-006、AC-006-7、R-007、AC-007-3、Q-001、Q-008）逐处核实存在。
- ☑ **N-03 目标与非目标边界清晰。** 非目标"格物致知"仍排除学习循环产品区；D-018 §1 效果 ②～⑥ 不在本 feature（spec:126 只要求快照 + delivered + 只读，与 interaction §3.5 "v1 只做 ①" 一致）。
- ☐ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 未满足：spec:126 "交付物状态 `draft → final`"无落点（**B-10**）。其余 what 的落点沿用 R2（B-01～B-08 内容未回退）。

### 一致性

- ☐ **I-01a spec ↔ plan 无冲突。** 未满足：plan:84 `SourceNote.finalizedAt` 与 spec:74 "时效（发布日期）"语义冲突（**B-09**）。R2 消除的三处冲突未复发。
- ☐ **I-02 与 docs/ 决策与 ADR 无冲突。** 未满足：interaction §3.7 / designUI §5.2 明确"交付物另有定稿状态 `draft / final`"，plan 未建模（**B-10**，与 N-04 同因）。其余：D-018 §1（显式定稿、二次确认、不自动定稿、v1 只做冻结）与 plan §4.6 一致；D-018 §5（路由 `/learning` 不改）与 plan:290 一致；S-16 / S-17 为非冲突备注。
- ☑ **I-03 前端基线事实核对。** 沿用 R2（本轮变更不涉及前端代码事实；未重读前端分支）。
- ☑ **I-04 文件边界与回滚一致。** 重命名均在 `frontend/src/jobs/**` 与 `contracts/**` 本 feature 所有权内；:16–18 / :289 / spec §4 未变。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条映射沿用 R2（43 ✓ + 3 ◐ 外部阻塞）；B-09 / B-10 影响的是断言所用字段名与状态字面量，不使 AC 失去测试落点，修正后 §5 行无需改动。
- ☑ **V-03 静态守卫声称与真实脚本一致。** plan:182 未变。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 未变；B-10 的最小修正只加 spec 已要求的状态字段，不加撤销 / 自动定稿（D-018 不可撤销、不自动）。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** plan:95 未变。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `FinalizeDialog` 为 `PublishDialog` 改名，职责未变。
- ☑ **P-5 自动生成文件不手改（§5.5）。** 未变。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 未变。
- ☑ **P-7 按仓库现有流程（§5.7）。** 未变。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。**（B-06）未变；`specs/README.md` 本 feature 行已更新为 v1.1 状态（只读核对）。
- ☑ **C-02 契约闭环。**（B-01）方法集与 19 行矩阵仅改名。
- ☑ **C-03 事件与状态闭环。**（B-02c / B-03 / B-05）未变。
- ☑ **C-04 场景定义足以稳定验证。**（B-02）九场景 × 九样例仅文案改名。
- ☑ **C-05 版本与定稿闭环。**（B-05）accept / revert / resolve_conflict / 定稿检查点 / delivered 只读未变；交付物级状态字段缺口记在 B-10（N-04 / I-02），不重复计。
- ☑ **C-06 隐私与本地持久化自洽。**（B-07）未变；B-09 只涉命名。
- ☑ **C-07 视觉与工程纪律。** 未变；S-17 文案不新增色值。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 未变；新增 D-018 / D-019 引用仅术语与知悉级。

**合计**：24 项中 21 ☑、3 ☐（N-04、I-01a、I-02，同因 B-09 / B-10）。

### 阶段说明（不设复选框；与 R2 相同，本轮无新产物）

- **I-01b（Analyze）/ V-02（Tasks）**：`tasks.md` 仍不存在，阶段未到，不倒置流程；R4 通过后 Tasks 产出，再由 A 复核补勾。
- **P-4**：代码级，Review 阶段核。
- **AC-009-1 命令输出 / AC-009-2 截图**：Implement / Handoff 证据，当前无。
- **Implement 前置**（累计，未满足）：(1) B-09 / B-10 修正后 R4 通过；(2) Tasks 经 A 复核补勾；(3) Tasks 头部登记 frontend-workbench v1 Handoff SHA。

### 逐 AC 映射（R3 增量；未列出的 41 条沿用 R2 判定与 plan 行号）

| AC | R2 | R3 | 说明 |
|---|---|---|---|
| AC-003-3 | ✓ | ✓* | 设计落点存在；payload 字段名受 B-09（`SourceNote` 时效字段）影响，修正后无需改 §5 |
| AC-006-7 | ✓ | ✓* | 定稿二次确认 → 快照 + delivered + 只读 的落点未变；"交付物状态 final" 的断言依据缺失（B-10） |
| AC-007-3 | ✓ | ✓ | 文字改名；五个破坏性动作清单不变（:55 / :261） |
| AC-008-1 / AC-008-4 | ✓ | ✓* | 字段清单与 CONTRACT.md 会随 B-09 / B-10 修正自动更新 |
| AC-003-1 / AC-005-5 / AC-007-4 | ◐ | ◐ | 外部阻塞（v2）不变；Converge 必报"未收敛（外部阻塞）" |

✓* = 设计可测，但依赖 B-09 / B-10 修正后的契约命名 / 状态字面量。

## 最小关闭要求与下一步

1. 实施侧（Plan 阶段模型）修正 plan:84（B-09）与 plan:81 / :87 / :205 / :176（B-10）；不改 spec、不改 docs；提交后 A **新开会话**做 R4 定向复核（只核两处与未回退）。
2. R4 通过前**不得进入 Tasks**；Tasks 的 A 组须一并落实 S-11～S-17；H 组 `blocked_by: frontend-workbench-v2`；头部登记 v1 Handoff SHA。
3. Converge 口径不变：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项为外部阻塞；D-019 / 剪藏预览 / 复核结果不计入本 feature。
4. 实施侧更新 `specs/README.md` 本 feature 行（R3 未通过 → 待 plan 修正与 R4）；本审核员不改该文件。

## 结构核验证据（R3，只读）

```text
HEAD      8bd1b31（spec/workbench-interaction；启动时 git status --short 为空）
SPEC      f944149→8bd1b31：+11/−9，205 行；"[ ] AC-" 计数 46 = f944149 的 46；R-001～R-009 编号连续
PLAN      f944149→8bd1b31：+26/−26，304 行；无增删行 → R2 引用的 plan 行号全部有效；§5 AC 行 46
TERMS     spec 余留"发布"仅 :74（来源发布日期，正确）；plan 余留"发布"仅 :196（日期类型说明，正确）→ 与 :84 finalizedAt 自相矛盾
          plan "学习/learn" 仅 :290 路由 /learning（正确）；spec 仅 :6 / :31（正确）
KINDS     plan:83 13 种（publish→finalize）；interaction §3.4 现 12 种示意（+source_pref/value_fix，定稿归 approve）→ S-16
DOCS      D-018 §1 定稿效果 v1 只做①；§5 /learning 不改；interaction §3.7 交付物 draft/final；designUI §5.2 元数据含定稿状态、§3.4 "已定稿 vN · 时间"、§2.4 "内部生成"
AGENTS    §6 新增模型路由；A 候选 claude-fable-5-1 → claude-opus-5-5 → gpt-6.1-sol；本轮用首选经 anthropic 通道
PROBE     claude-bridge/claude-fable-5-1 exit 1（quota/rate/spend_limit 类）；anthropic/claude-fable-5-1 exit 0（由调度会话执行，脱敏转记）
WRITE     唯一改动文件 specs/workbench-interaction/checklist.md（git diff --name-only）；git diff --check 无空白问题
```

---

# R2（2026-10-28，第二轮定向复核）

## 基线与范围

- 稳定工作目录 `D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`，审查提交 **`630e06f`**（HEAD；工作区干净）。
- 冻结 spec：`cfb6c66`。`git show 630e06f:specs/workbench-interaction/spec.md` 的 blob md5 `7c689362…` 与 `cfb6c66` 一致（工作区文件为 CRLF 检出，`git diff --quiet HEAD` 无差异）；**spec 未被修改**。
- 首轮报告归档 `1d6b54c`；本轮比较 `git diff d52e784 630e06f -- specs/workbench-interaction/plan.md`（plan.md +197/−52 行，304 行）。
- 前端地基 `D:/2030/Futures-AI-frontend` `feat/frontend-workbench`：审核期间该分支由 `5958e54`（T-09）推进到 `fd2d755`（T-11/T-13 合入）；本审核员只读核对了 `src/app/{router,nav}.ts`、`src/main.ts`、`src/contracts/{types,methods}.ts`、`src/contracts/mock/index.ts`、`src/contracts/mock/agent/{long,retry}.ts`、`src/agent/events.ts`、`scripts/contract-build.mjs`、`specs/frontend-workbench/{plan,tasks}.md`。分支移动不影响本轮判定——Plan §1.1 已把实现起点定为 v1 Handoff 后的 SHA，而非任一中间提交。
- `spec/frontend-workbench-v2` 草稿（最新 `150c392`）**未过 Gate 1**，不作为已交付依赖；本轮未读取其内容作为闭环证据。
- **未执行**：未安装依赖、未运行测试或应用、未启动其他 agent、未读用户凭证、未修改 spec / plan / docs / 前端分支、未 commit / push。唯一写入文件为本文件。

## 结论（R2）：**通过**

- 首轮阻断 **B-01～B-08 全部闭环**（逐项见下），建议 **S-01～S-10 全部已处理**；首轮已通过项**无回退**；修订未引入阻断级新矛盾。
- 新发现 **S-11～S-15** 均为建议（不阻断、不计入判定），应在 Tasks A 组（契约与骨架）任务中落实。
- 允许进入 **Tasks**。**Implement 仍阻塞**于 `frontend-workbench` v1 Handoff 合入 SHA（Plan §1.1，Tasks 头部登记后方可建实现分支）；**Converge** 在 v2 未 Gate 1 + 合入前，须将 AC-003-1（工作台入口）、AC-005-5（抽屉上下文标签）、AC-007-4（首页作业轨道角标）列为"未收敛（外部阻塞）"，不得报全量收敛。

## 逐 B 复核（B-01～B-08）

| # | 首轮最小关闭要求 | 修订落点（plan.md 行号） | 核实 | 判定 |
|---|---|---|---|---|
| **B-01** 契约闭环 | 增补写方法 + 动作→方法→kind→payload 矩阵覆盖 spec 全部介入动作 | :96–112 方法表新增 `submitIntervention / mergePending / removeUpload / cancelJob / replyBlockComment / resolveBlockComment / listInbox / markInboxRead / resetMockData`；:120–144 矩阵 19 行 | 五类分析动作各有唯一 `action` 与 kind：批注→framework、追问→ask_why/question、深挖→rewrite、删除→delete、否决→veto（AC-005-3 可逐一断言）；pin_rule 带 `state='candidate'`（AC-005-4）；块批注新建/回复/解决三方法（AC-006-3）；删除来源 / 取消作业有方法且进入二次确认清单（AC-007-3、AC-002-5）；矩阵用到 13 种 kind 全部，不新造 merge 类，`mergePending` 只改 outcome（:144）。`methods.ts` 的 `satisfies RequestMethods<…>` 会强制每个新方法登记语义（已核）。 | **闭环** |
| **B-02** 场景与驱动 | 场景×方法行为表、场景×作业样本表、pending-merge 驱动、合并记录形态、统一 :60/:123 | :146–162 九场景×读/写/快照表；:164–176 九个作业样本（status × 四阶段 × 产物）；:117 删除 `jobScript`，统一经 `send({jobContext})` + 既有 success/failure/retry/long 脚本；:178 终态由同一 runId 驱动；:65 与 :162/:196 统一为"非 normal 不读不写不清两个 key" | 互斥情景分属不同作业（j-running / j-human 分离，j-conflict / j-delivered 各自场景）；`empty/error/slow/boot-error` 对**全部新增读写方法**的返回/拒绝/延迟已定；合并结果 = 原事件 `outcome=merged`（:83、:144）；前端 mock `send` 为每次调用分配 uuid runId（`mock/index.ts:161`，已核），"仅匹配 pendingRunId 的终态才合并"可测；`?agentScript=long` 读取点存在（`mock/index.ts:192`）。 | **闭环** |
| **B-03** 事件与状态闭环 | rerunStage 迁移表；pendingMerge 两条清除路径；横幅目标字段 | :209–218 四行迁移表（无 run / 成功终态 / failed·aborted / 运行中排队）+ 串行执行规则；:206 有 run → 匹配 runId 的 `run.completed`，无 run → 显式 `mergePending`（运行中拒绝）；:201 横幅 = 固定顺序第一个 H（冲突样例第一个 C） | 迁移表给出阶段状态、job.status、revision 变化三列，AC-002-4 的"mock 状态迁移"可断言；AC-004-2 无 run 时仍返回 `pendingMerge=true`，清除路径确定；旧 revision 保留、overlay 不误标合并（R1/R2）；排队请求把 `pendingRunId` 转交后继 run，不丢人的 overlay。 | **闭环** |
| **B-04** 契约类型完整性 | 类型表逐项补字段；契约导出展示映射；chart 块载荷；命名规则 | :80 `Job.reason`；:81 `JobStatusLabel / StageLabel / StageStateLabel / ArtifactStatusLabel / SourceLabel` 由契约导出、徽标只消费；:83 `Intervention` 十字段 + outcome 枚举；:84 `Upload / SourceNote` 字段与 `pending_validation / ingested / quarantined`；:88 `ChartSpec` = designUI §5.1 三元组最小子集 + `SparkSeries` 绑定；:89 `Revision` 七字段 + `BlockComment` 线程/状态；:94 统一 camelCase 并登记 snake_case 对照；:95 schema 进 `contractSchemas` | (a)～(g) 七项均有落点；`SparkSeries` / `Figure` / `TradingDate` / 错误码枚举在基线 `types.ts` 存在（已核）；生成器按 `contractSchemas + methodSemantics` 表驱动（`contract-build.mjs:41–47`，已核），新 schema 注册即进 `schema.json` / CONTRACT.md。展示映射进 CONTRACT.md 的具体机制见 S-11（非阻断）。 | **闭环** |
| **B-05** 版本与发布 | accept/revert 语义；发布检查点对 conflict/pendingMerge 的处理；delivered 后只读的契约保证 | :204 accept → 新 confirmed revision；revert → 仅请求涉及块恢复至 baseRev、其他人工改动保留、两版不删；冲突候选不能直接 accept，走 `resolve_conflict`（:141）产新 confirmed revision；:205 `publishDeliverable` 遇未决项返回 `validation_error`（列目标块）、不生成快照；成功后一切领域写方法在契约入口拒绝，读/历史/diff/`markInboxRead` 可用；`PublishSnapshot` 深拷贝、读 API 返回副本（:90） | 符合 interaction §3.3 R1（不覆盖、可回滚）、R3（冲突只在发布检查点收口）与 designUI §3.5-3；`job-conflict` 场景有可验证收口行为（发布列未决项并拒绝）；AC-006-6 / AC-006-7 / AC-005-6 / AC-006-4 可测。 | **闭环** |
| **B-06** 前置依赖与所有权 | 实施起点 SHA；每个共享文件唯一修改者；blocked_by 与 Converge 口径 | :16–18 唯一修改者清单（本 feature：`jobs/**`、`contracts/**` 作业部分、`agent/events.ts` 可选字段、`main.ts` 路由注册；v2：`app/{nav,router,Rail,TopBar,AppShell}`、`WorkbenchPage`、`agent/{store,AgentDock,AgentDrawer,CotTimeline}`）；:22 实现起点 = v1 T-01～T-15 Handoff 合入后的 commit，Tasks 头部登记 SHA；:23 接线顺序；:24 blocked_by 清单 + "Converge 必报未收敛（外部阻塞）"；:36 `jobs/routes.ts` + `main.ts addRoute`，**不改 `app/router.ts`** | 已核基线 `router.ts` 由 `navItems` 生成具名路由、`main.ts` 为应用装配点，`addRoute` 具名记录可替换同名占位，方案可行且与 v2 无文件重叠；`main.ts` 在 v1 T-13 修改范围内，但本 feature 起点在 v1 Handoff 之后，为顺序关系而非并发冲突；§6 回滚块（:289）与所有权一致。 | **闭环** |
| **B-07** 隐私与本地持久化 | Upload 持久化子集；提示落点；唯一清空触发 | :191 粘贴正文只在草稿/提交参数中，不进 fixture / localStorage；File 只取元数据；:192 `fai.jobs.v1` Upload 白名单字段，事件 payload 不夹带原文；:193 512 KiB（UTF-8 字节）/ 配额异常 → 内存 + 共享非模态横幅，保留最后成功快照；损坏/版本不支持 → 本次用 fixture、保留原 key、不自动覆写；:194 / :162 唯一清空 = 显式 `resetMockData` 二次确认 | 界面文案明确"原文不保存，刷新后需重新投放原文"，与 AC-003-3（来源说明随记录提交）不冲突；横幅落点为列表/详情/投放抽屉顶部，不依赖已删除的 Toast；与 B-02d 统一后用户丢失本地状态的时点唯一且可预期。 | **闭环** |
| **B-08** 角标与收件箱 | 待处理项来源枚举与生成规则；角标位置归属；"清除"语义 | :68 四类生成规则（首次 needs_human / 首次 conflict / overlay 首次待合并 / agent 改稿待接受）且同目标同原因不重复；:69 `listInbox(jobId?)` 返回条目 + 作业/阶段计数（只数未读且未解决），`markInboxRead(ids)` 标已读保留条目，resolved 由 mock 层在收口时置位；角标位置 = 列表卡 + 详情阶段轨道（本 feature），首页作业轨道消费同一计数（v2）；:91 `InboxItem` 类型；`JobListItem.pendingCount` / 阶段 `pendingCount` 由契约提供 | 与 :186 "阶段状态不在前端推导"口径一致；designUI §3.9 "完成态不常驻角标"由 resolved 规则落实；AC-007-4 "查看收件箱后清除"= 本次展示 id 已读，可测。 | **闭环** |

## S-01～S-10 处理核实

| # | 核实 |
|---|---|
| S-01 | :12 改为"不承诺旧 bootstrap 通过新 literal，bootstrap 必须声明 2.0.0"，并给出升 MAJOR 理由（新增必实现方法 + 封闭场景枚举使旧 real 实现不再满足接口）✓ |
| S-02 | :61 `jobsStore` "不做轮询"，状态来自写回执 / agent 通知后重新读取 ✓ |
| S-03 | :182 明确状态/来源徽守卫由组件测试承担（AC-001-5 / 003-6 / 006-8），"不假称既有脚本具备该扫描" ✓ |
| S-04 | `specs/README.md:23` 依赖列已区分"实现硬前置：v1 Handoff / 壳集成：v2 Gate 1+交付 / api 仅后续真实集成" ✓（AGENTS §2 "依赖未满足不得进入 Plan" 与"硬前置为实现而非 Plan"的口径已在 spec §4 与 Gate 1 时由 Walter 接受，本轮不再提出） |
| S-05 | :115 `listJobs` 缺省 `updatedAt` 倒序 ✓ |
| S-06 | :85 submit → `pending_validation`，confirm → `ingested`/样例 `quarantined`，单位修正随 mapping 提交 ✓ |
| S-07 | :95 新 schema 进入 `contractSchemas` 注册表 ✓ |
| S-08 | :183 diff 单测期望用手写样例、不重写算法 ✓ |
| S-09 | :186 M-01～M-10 逐项主题 ✓ |
| S-10 | :24、:264、:302 blocked_by 清单与 Converge 外部阻塞口径 ✓ |

## 新发现（R2；均为建议 S，不阻断）

| # | 位置 | 建议 |
|---|---|---|
| S-11 | plan:81 / :95 / :16 | "展示映射由生成器进 CONTRACT.md"与 :16 "表驱动生成器无需修改"需二选一落实：要么把 `JobStatusLabel` 等映射以 zod 形式（枚举 `describe` 或 literal-object schema）放进 `contractSchemas`，要么允许本 feature 修改 `contract-build.mjs`（需加入 :16 所有权清单）。Tasks A 组写明机制，AC-001-5 / AC-008-1 据此断言。 |
| S-12 | plan:89 / :80 | `Revision.blocks` 对 `kind=dataset/recipe` 产物不自然（参数 overlay 的 revision 内容是什么）；建议 Tasks 中定义 revision 载荷按 artifact kind 可辨识（deliverable→blocks，recipe→params），不影响 AC-004-2 / AC-006-4。 |
| S-13 | plan:153 / :115 | `empty` 场景 `getJob` 对预置 id 返回 `null` 而未知 id 返回 `not_found`，要求 `getJob` 结果 schema 为 `Job \| null`；Tasks 中写明并让 AC-001-4 的空态断言用预置 id。 |
| S-14 | plan:215 / :169 | run `failed` 时"当前运行阶段→conflict"是把失败映射到 `StageState.conflict`（枚举无 failed）；可接受，但 CONTRACT.md 的 `StageStateLabel` 与 j-failed 样例说明应写明"失败以 conflict 呈现 + job.reason"，避免 Review 时被当作状态误标。 |
| S-15 | plan:116 / :174 / :203 | 抽屉经 `send({jobContext})` 的普通追问是否设置该作业的 `activeRunId`（从而使同期编辑进入 pendingMerge）未显式写出；按 :117 "作业运行统一经既有 send({jobContext})" 推断为是。Tasks 中一句话定清，并在 mock 状态机单测覆盖。 |

## 当前有效检查项（R2 勾选）

### 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec 未变（R1 已核）。
- ☑ **N-02 无未澄清歧义。** spec §5 Q-001～Q-012 全部裁定；本轮无新需求问题，无需回流 Clarify。
- ☑ **N-03 目标与非目标边界清晰。** spec §2 未变。
- ☑ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** B-01 / B-03 / B-04 / B-08 关闭后，46 条 AC 全部有契约方法 / 场景 / 状态迁移 / 类型落点（逐 AC 表见下）。

### 一致性

- ☑ **I-01a spec ↔ plan 无冲突。** R1 三处冲突已消除：介入方法空指（:120 → :96–144）、非 normal 快照语义（:65 / :162 / :196 一致）、版本字面量（:12）。
- ☑ **I-02 与 docs/ 决策与 ADR 无冲突。** R1 已核项未回退；R1 未闭环的 interaction §3.3 R1/R3 与 designUI §3.5-3 现由 :204–:206 落实。D-016 结论 2/3/5/9 ✓；D-017 仅边界 ✓；D-015 未引用 ✓。
- ☑ **I-03 前端基线事实核对。** R1 结论维持；本轮补核：`router.ts` 具名路由由 `navItems` 生成、`main.ts` 为装配点（`addRoute` 方案可行）；mock `send` 分配 uuid runId；`?agentScript=` 读取点存在；`fai-dark` 为 frontend-workbench plan §2.6 / T-12 登记的主题名。T-12/T-13 已在 `fd2d755` 合入，但本 feature 仍以 Handoff SHA 为起点（Plan §1.1）。
- ☑ **I-04 文件边界与回滚一致。** :16–18 所有权 = :289 回滚块 = spec §4 "只改 frontend/"；新增 `main.ts` 路由注册在两处同时登记。

### 可测试性

- ☑ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条中 43 条设计闭环可测；AC-003-1 / AC-005-5 / AC-007-4 各含一个 **外部阻塞子项**（v2），其余子项可测——这三条在 Converge 必须报外部阻塞，不计为本轮缺口（见逐 AC 表）。
- ☑ **V-03 静态守卫声称与真实脚本一致。** R1 已核，未回退；:182 不再声称脚本具备徽标扫描。

### 工程准则（AGENTS §5）

- ☑ **P-1 不为猜测场景加复杂度（§5.1）。** 轮询已删（S-02）；新增方法均有 spec 行为来源；rerun 排队只用内存记录"不引调度器"（:218）；不引第三方 diff 库。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** :95 "只在契约输入、返回值和本地快照入口 parse 一次，内部组件不重复校验"。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** 新增组件（`PendingMergeChip` / `InboxDrawer` / `RuleCandidatePanel` / `RevisionRequestPanel`）均对应 designUI §6 / §3.5 具名概念；不复制第二套对话组件。
- ☑ **P-5 自动生成文件不手改（§5.5）。** :95 / :182 / :195。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** :178 "用既有脚本和时钟推进真实 mock 定时器，不凭 UI 手工造终态"；:183 手写期望。
- ☑ **P-7 按仓库现有流程（§5.7）。** 栈与命令未变。

### 其他自定义项

- ☑ **C-01 前置依赖与职责边界清楚。**（B-06）
- ☑ **C-02 契约闭环。**（B-01）
- ☑ **C-03 事件与状态闭环（R1–R6 旁路语义）。**（B-02c / B-03 / B-05）agent 始终用 `latestMergedRev`，不读 overlay（:206）；未用"等人确认才继续"替代旁路。
- ☑ **C-04 场景定义足以稳定验证。**（B-02）
- ☑ **C-05 版本与发布闭环。**（B-05）
- ☑ **C-06 隐私与本地持久化自洽。**（B-07）
- ☑ **C-07 视觉与工程纪律。** R1 已核，未回退。
- ☑ **C-08 D-015 / D-013 未混淆；D-017 仅边界引用。** 未回退。

### 阶段说明（不设复选框；后续由 A 独立复核）

- **I-01b spec / plan / tasks 无冲突（Analyze）**：tasks.md 尚不存在，Analyze 未发生。Tasks 产出后由 A 复核并在本文件补勾；Analyze 报告由实施侧产出、A 复核结论。
- **V-02 任务粒度与验证命令满足 tasks.md 模板要求**：Tasks 产出后由 A 复核——每条完成标准引用 AC 编号、验证命令一一对应、0.5–2 h、依赖无前向环、H 组任务显式 `blocked_by: frontend-workbench-v2`、头部登记 v1 Handoff SHA。
- **P-4 主函数只写正常流程（§5.4）**：代码级准则，Review 阶段核 `job-state.ts` 各方法与 `IntakeDrawer` 提交流程。
- **AC-009-1 命令输出 / AC-009-2 截图**：属 Implement / Handoff 证据，当前不声称。
- **Implement 前置**：本文件 §R2 当前有效复选框全部勾选，但 Implement 开工另需 (1) Tasks 经 A 复核补勾、(2) Tasks 头部登记 frontend-workbench v1 Handoff SHA（外部依赖未交付前不得以中间提交或空壳冒充）。

### 逐 AC 设计映射（46 条；R2 状态）

| AC | plan 落点 | R1 | R2 | 说明 |
|---|---|---|---|---|
| AC-001-1 | :46/:222 | ✓ | ✓ | |
| AC-001-2 | :61/:115/:223 | ✓ | ✓ | 排序已入契约语义（S-05） |
| AC-001-3 | :199/:224 | ✓ | ✓ | |
| AC-001-4 | :153–154/:225 | ✗ | ✓ | empty / error 对 `listJobs` / `getJob` / `getStageWorkspace` 行为已定（S-13 建议写明 null 形态） |
| AC-001-5 | :81/:226 | ✗ | ✓ | 映射由契约导出（S-11 定机制） |
| AC-002-1 | :47/:77/:227 | ✓ | ✓ | |
| AC-002-2 | :36–37/:228 | ✓ | ✓ | |
| AC-002-3 | :172/:201/:229 | ✗ | ✓ | j-human：status=needs_human、D,H,R,N，横幅定位第一个 H |
| AC-002-4 | :209–218/:230 | ✗ | ✓ | 迁移表三列可断言 |
| AC-002-5 | :80/:169/:231 | ✗ | ✓ | `reason` 必填；`cancelJob` 可置 cancelled |
| AC-003-1 | :24/:38/:232 | ◐ | ◐ | 列表 / 详情入口可测；**工作台入口外部阻塞（v2）** |
| AC-003-2 | :233 | ✓ | ✓ | |
| AC-003-3 | :84/:124/:192/:234 | ✗ | ✓ | `SourceNote` 字段 + ingest payload + 持久化子集已定 |
| AC-003-4 | :85/:235 | ✓ | ✓ | |
| AC-003-5 | :124/:200/:236 | ✓ | ✓ | |
| AC-003-6 | :84/:237 | ◐ | ✓ | 三状态枚举已登记 |
| AC-004-1 | :86/:238 | ✓ | ✓ | |
| AC-004-2 | :126/:206/:239 | ✓ | ✓ | kind=recipe；无 run 时 `pendingMerge=true` + `mergePending` |
| AC-004-3 | :86/:240 | ✓ | ✓ | |
| AC-004-4 | :137/:241 | ✓ | ✓ | |
| AC-004-5 | :153–154/:242 | ✗ | ✓ | |
| AC-005-1 | :243 | ✓ | ✓ | |
| AC-005-2 | :244 | ✓ | ✓ | |
| AC-005-3 | :127–131/:245 | ✗ | ✓ | 五动作 → framework / ask_why·question / rewrite / delete / veto |
| AC-005-4 | :132/:246 | ✗ | ✓ | `payload.state='candidate'` |
| AC-005-5 | :24/:55/:247 | ◐ | ◐ | mock 回放经 `send(jobContext)` 可测；**抽屉上下文标签外部阻塞（v2）** |
| AC-005-6 | :174/:248 | ✗ | ✓ | j-conflict 冲突分布已定 |
| AC-006-1 | :87–88/:249 | ✗ | ✓ | `ChartSpec` 样例 + `fai-dark`（v1 T-12 已在 Handoff 范围内） |
| AC-006-2 | :204/:250 | ✓ | ✓ | |
| AC-006-3 | :89/:108/:136/:251 | ✗ | ✓ | 新建 / 回复 / 解决三方法 + 线程状态 |
| AC-006-4 | :89/:109/:252 | ✓ | ✓ | `Revision` 七字段 |
| AC-006-5 | :253 | ✓ | ✓ | |
| AC-006-6 | :110/:141/:204/:254 | ✗ | ✓ | accept / revert / resolve_conflict 语义 |
| AC-006-7 | :111/:205/:255 | ✗ | ✓ | 未决项拒绝 + delivered 只读 |
| AC-006-8 | :256 | ✓ | ✓ | |
| AC-007-1 | :83/:94/:257 | ✓ | ✓ | camelCase 对照已登记 |
| AC-007-2 | :173/:178/:206/:258 | ✗ | ✓ | `requestRevision → send(long)`，同 runId 终态合并 |
| AC-007-3 | :55/:259 | ✗ | ✓ | 五个破坏性动作均有方法可挂确认 |
| AC-007-4 | :68–69/:91/:260 | ✗ | ◐ | 列表卡 / 阶段轨道角标与收件箱可测；**首页作业轨道外部阻塞（v2）** |
| AC-007-5 | :182/:261 | ✓ | ✓ | |
| AC-008-1 | :95/:262 | ✓ | ✓ | S-11 定展示映射入文档机制 |
| AC-008-2 | :146–176/:263 | ✗ | ✓ | 九场景行为与样本已定 |
| AC-008-3 | :264 | ✓ | ✓ | |
| AC-008-4 | :12/:265 | ✓ | ✓ | |
| AC-009-1 | :187/:266 | ✓ | ✓ | 实现时登记输出 |
| AC-009-2 | :186/:267 | ✓ | ✓ | 截图属 Handoff |

◐ = 设计闭环但含外部阻塞子项（Converge 必报"未收敛（外部阻塞）"）。

## 最小关闭要求与下一步

1. **R2 通过**，无需再做 Checklist 轮次；S-11～S-15 在 Tasks A 组任务中写明即可，不要求回 Plan 修订。
2. 进入 **Tasks**：按 Plan §8 A～H 分组；H 组显式 `blocked_by: frontend-workbench-v2`；头部登记 v1 Handoff SHA（未登记则 Implement 不得开工）。
3. Tasks 产出后由 A（新开独立会话）复核 V-02 / I-01b 并在本文件 §R2 补勾；Analyze 报告结论由 A 复核。
4. Converge 口径：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项在 v2 Gate 1 + 合入 + 壳方交付前为"未收敛（外部阻塞）"；`api` 不阻塞 mock 验收。
5. 实施侧更新 `specs/README.md` 本 feature 行（状态与最近更新）；本审核员不改该文件。

## 结构核验证据（R2，只读）

```text
HEAD      630e06f（spec/workbench-interaction，工作区干净）
SPEC      630e06f:spec.md blob md5 7c689362… == cfb6c66（未变；工作区 CRLF 检出，git diff --quiet HEAD 通过）
PLAN      git diff d52e784 630e06f -- plan.md：+197/−52；现 304 行
METHODS   §2.4 新增 DataClient 30 个（含 resetMockData）+ AgentClient.send(jobContext)；矩阵 19 行用满 13 种 kind
SCENARIO  9 场景 × 读/写/快照 行为表；9 个作业样本（status × 四阶段 × 产物）；jobScript 已删
FRONTEND  feat/frontend-workbench 审核期间 5958e54 → fd2d755（T-11/T-13 合入）；只读核对 router/nav/main/mock/events/types/contract-build
          mock send runId = mock-run-<uuid>（index.ts:161）；?agentScript 读取（:192）；scenario 封闭枚举（types.ts:68）
          generator 表驱动（contract-build.mjs:41–47）；fai-dark 为 fw plan §2.6 登记名
V2        spec/frontend-workbench-v2 @150c392 未 Gate 1，未作为依赖读取
```

---

# R1（2026-10-28，第一轮；历史快照，原样保留，复选框改为文字符号，不参与当前判定）

> **本轮性质**：Plan 后首轮 Checklist（第一轮）。**尚无 tasks.md**；凡涉及 Tasks / Analyze / 测试执行 / Handoff 截图的项目一律不勾选，只写阶段说明。
>
> **基线**：
> - 冻结 spec：`cfb6c66`（Walter 2026-10-28 Gate 1 批准；9 条需求 / 46 条 AC；Q-001～Q-012 已裁定）。审核时 `spec/workbench-interaction` 分支上的 `spec.md` 与 `cfb6c66` 版本 md5 一致（`7c689362…`）。
> - Plan：`d52e784`（= `spec/workbench-interaction` 分支 tip；`plan.md` md5 `4064e740…` 一致）。
> - 前端地基：`D:/2030/Futures-AI-frontend`，`feat/frontend-workbench` @ `fdaa7d8`（T-01～T-08 已合入；T-09～T-15 进行中）。只读。
> - `spec/frontend-workbench-v2` 草稿未经 Gate 1，**不作为已交付依赖**。
> - 审核期间本 worktree 被其他会话从 `spec/workbench-interaction` 切到 `feat/desktop-shell`（HEAD `71a80bd`）；本审核员**未切换分支**，后续行号均经 `git show spec/workbench-interaction:…` 读取；本文件以未跟踪文件写入指定路径，未暂存、未提交。
>
> **审查范围**：AGENTS.md、docs/plan.md、docs/interaction.md（§3.2/§3.3/§3.4/§3.5/§7）、docs/designUI.md（§2.4/§3/§5.2/§7）、docs/architecture.md、D-016 / D-017 / D-011、spec.md、plan.md、templates/checklist.md、前端 `specs/frontend-workbench/{spec,plan,tasks,checklist}.md`、前端真实代码 `frontend/src/contracts/{types,client,methods,index}.ts`、`contracts/mock/index.ts`、`contracts/real/index.ts`、`src/agent/events.ts`、`scripts/contract-build.mjs`、`scripts/check.mjs`、`src/app/{nav,router}.ts`、`AppShell.vue`、`TopBar.vue`、`src/stores/*`、`src/design/{glass.css,tokens.json}`、`package.json`。
> **未执行**：未安装依赖、未运行任何测试或应用、未启动其他 agent、未读用户凭证、未修改 spec / plan / docs、未 commit / push。
>
> **口径**：只在确认满足时勾选；未勾选项写原因与位置（文件 + 行号）。阻断项 **B-xx**（任一未闭环 = 未通过），建议项 **S-xx**（不阻断、不计入判定）。每项阻断标注"设计补全"（Plan 内闭环）或"需求变更"（回流 Clarify）。
>
> 注：以下 plan 行号均指 `d52e784` 版 plan.md。

## 结论（第一轮）：**未通过**

阻断 **B-01 ～ B-08**（全部为**设计补全**，无需求变更、不需回流 Clarify、不动冻结 spec）。Plan §5 的 46 行映射对 46 条 AC 全部"有一行"，但逐条核到契约方法、场景、状态迁移与版本语义时，**15 条 AC 的设计不闭环**（见"逐 AC 映射"表）。Plan 修订后需**第二轮定向复核**（仍由 A 独立会话执行），复核通过前不得进入 Tasks。

## 需求完整性

- ☑ **N-01 每条编号需求至少有一条可验证的验收规则。** spec R-001～R-009 共 46 条 AC（5 / 5 / 6 / 5 / 6 / 8 / 5 / 4 / 2），编号连续，每条写明验证形态（组件 / 端到端 / 契约 / 静态 / 人工）。
- ☑ **N-02 无未澄清歧义。** spec §5 Q-001～Q-012 全部"按推荐（2026-10-28 Walter）"并给出融入位置；冻结后无新增问题。
- ☑ **N-03 目标与非目标边界清晰。** spec §2：交付作业对象 / 四阶段 / 四台 / 介入与不干扰 / 契约 v2 + mock / 可验收性；排除验证队列、学习区、闸门、协议、真实 api / agent / 解析、完整块编辑器、导出、导航与作业轨道本体（归 v2）。
- ☐ **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 未满足。缺口集中在：spec 已写明的写行为没有契约写路径（B-01）、AC 直接依赖的契约声明 / 字段缺失（B-04）、重跑状态迁移未定义（B-03）、角标 / 收件箱语义未定义（B-08）。详见阻断表。

## 一致性

- ☐ **I-01 spec / plan / tasks 之间无冲突。** tasks 尚不存在（阶段说明，不勾选）。spec ↔ plan 已发现冲突：① plan:120 "批注/追问/教规则/否决 → 对应契约方法"，但 plan:80–91 方法表中没有任何分析介入方法（B-01）；② plan:60 "`scenario !== normal` 时不恢复本地状态"与 plan:123 "重置 mock 状态与本地快照"语义不一致（B-02d）；③ plan:11 "1.x 数据可解析"与前端 `types.ts:66` `contractVersion: z.literal(CONTRACT_VERSION)` 矛盾（S-01）。
- ☐ **I-02 与 docs/ 决策与 ADR 无冲突。** 已核无冲突项：D-016 结论 2/3/5/9（作业一等对象、旁路介入、块模型、三层玻璃）✓；designUI §2.4 状态徽文案 + 图标、不新增色值（plan:12–13）✓；§3.9 作业轨道 / 阶段轨道不新增玻璃层 ✓（plan 复用 `glass-*` 三类，`check.mjs:269` 强制）；§5.2 六类块 ✓；D-015 与主线 D-013 未混淆（plan 未引用）✓；D-017 仅作边界引用 ✓。**未闭环**：interaction §3.3 R1（编辑不覆盖、可回滚）与 R3（冲突只在发布检查点要求处理）、designUI §3.5-3（冲突芯片、发布检查点集中处理）在 plan §4.5 发布流程与 `resolveRevision` 语义中没有落点（B-05）。
- ☑ **I-03 前端基线事实核对（代替"组件存在"的推定）。** 已读真实代码：`contract-build.mjs:6–7/41/47` 由 `contractSchemas` + `methodSemantics` 表驱动，新方法只需进 `methods.ts`（plan:16 "如方法表驱动则无需改"成立；新 schema 须进 `contractSchemas` 注册表或改脚本）；`methods.ts:101/123` 的 `satisfies RequestMethods<…>` 会强制每个新 `DataClient` 方法有语义条目（利于 AC-008-1）；`check.mjs:269–278` glass 三类白名单真实存在（AC-007-5 继承成立）；`check.mjs:313–320` network 白名单只含 `src/contracts/real/`（AC-008-3 继承成立）；`mock/index.ts:56–58` `MockOverrides.fixtures` 为封闭键集、`types.ts:68` `scenario` 为封闭枚举（扩展场景须改 schema）。**基线上不存在**：`src/agent/{store.ts,AgentDrawer.vue,AgentDock.vue,CotTimeline.vue}`（T-13）、`src/design/theme.ts`（T-12）、`src/modules/`、`src/stores/{layout,badges}.ts`——plan:48 的"复用"与 plan:156 的"既有暗色主题"目前是**对未来产物的依赖**（B-06）。
- ☑ **I-04 文件边界与回滚一致。** spec §4 "只改 `frontend/`（+ `specs/README.md`、`.gitignore`）" = plan:14–17 所有权清单 = plan:189 回滚块；不碰 `backend/`、`docs/` 权威内容、冻结的 `specs/frontend-workbench/spec.md`。

## 可测试性

- ☐ **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条中 31 条映射成立、15 条存在设计缺口（逐条见下表）。"有一行映射"不等于"可测"：AC-005-3 / AC-005-4 / AC-006-3 / AC-007-3 所断言的契约方法与事件 kind 在 plan 中不存在；AC-002-4 要求断言的"状态迁移"未定义；AC-007-2 / AC-008-2 依赖的场景驱动未定义。
- ☐ **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 阶段不适用（尚无 tasks.md）。要求：Tasks 产出后由 A 独立复核——每条完成标准引用 AC 编号、完成标准与验证命令一一对应、0.5–2h、依赖无前向无环；v2 集成任务显式 `blocked_by`。
- ☑ **V-03 静态守卫声称与真实脚本一致。** AC-007-5 → `check --only glass`、AC-008-3 → `check --only network`、AC-008-1 → `check --only generated`（重生成 `contracts/*` 逐字节比对，`check.mjs:189–197`）均已对照真实脚本确认，不是"沿用"空话。spec R-009 what 中"状态徽不只靠颜色 / 来源徽覆盖"两项静态守卫在 plan 中以组件测试承担（S-03）。

### 逐 AC 设计映射（46 条；"✓" = 设计闭环可测，"✗" = 缺口，"◐" = 部分 / 受前置阻塞）

| AC | plan 落点 | 判定 | 说明 |
|---|---|---|---|
| AC-001-1 | plan:36/129 `JobListPage` + `JobCard`；fixtures | ✓ | |
| AC-001-2 | plan:54/130 `jobsStore.filter`、`listJobs(filter?)` | ✓ | 更新时间倒序建议写入 `listJobs` 语义（S-05） |
| AC-001-3 | plan:117/131 `createJob` → `/jobs/:id/collect` | ✓ | |
| AC-001-4 | plan:132 `scenario=empty/error` | ✗ | `empty` / `error` 对 `listJobs` / `getJob` 的行为未定义（B-02b） |
| AC-001-5 | plan:133 `JobStatusBadge` 映射单测 | ✗ | AC 要求"状态→文案映射**由契约声明**"，plan 的映射在组件内，契约无此声明（B-04a） |
| AC-002-1 | plan:37/69/134 `StageRail`、`StageState` | ✓ | |
| AC-002-2 | plan:30/135 `router.replace`、未知 stage 回落 | ✓ | |
| AC-002-3 | plan:136 `job-running` 含 `needs_human` | ✗ | 作业级 `status` 与四个 `StageState` 的组合规则未定义（哪一阶段 needs_human、其余阶段是否 running、横幅"对应阶段"如何确定）（B-02a） |
| AC-002-4 | plan:83/119/137 `rerunStage` → kind=rerun | ✗ | AC 要求断言"mock 状态迁移"；plan 未定义迁移到哪些 `StageState`、产物版本如何保留（B-03） |
| AC-002-5 | plan:138 failed/cancelled fixtures | ✗ | `Job` 类型（plan:71）无失败 / 取消原因字段；且无任何动作能把作业置为 cancelled（B-04b、B-01e） |
| AC-003-1 | plan:139 三处入口；工作台入口 blocked_by v2 | ◐ | 顶栏"任意页面可用"与工作台入口归 v2（plan:197）；v2 未过 Gate 1 → 本 AC 在 v2 合入前不可能全绿，Converge 不得报"已收敛"（B-06、S-10） |
| AC-003-2 | plan:140 三种投放 + 白名单 | ✓ | |
| AC-003-3 | plan:141 用途必填 + payload 断言 | ✗ | 来源说明字段（用途 / 可靠性 / 时效 / 口径）未进 `Upload` 类型定义（plan:74 只写"投放元数据、来源说明"）；payload 持久化子集未定（B-04e、B-07） |
| AC-003-4 | plan:142 `ExtractionPreview` / `MappingEditor`、`confirmIntake(uploadId, mapping)` | ✓ | 单位修正是否在 `mapping` 内、确认前状态值建议写明（S-06） |
| AC-003-5 | plan:143 `UnassignedPool` + `assignUpload` | ✓ | |
| AC-003-6 | plan:144 抽取状态徽 | ◐ | 待验证 / 已入库 / 隔离枚举未在类型表登记（并入 B-04e） |
| AC-004-1 | plan:145 `ProcessWorkspace` / `RecipeSteps` / 溯源 | ✓ | |
| AC-004-2 | plan:146 `updateParams` → 事件 + 待合并 | ✓ | kind（`recipe` / `map_fix`）须在 B-01 的动作→kind 矩阵中登记 |
| AC-004-3 | plan:147 `ReconciliationDiff` | ✓ | |
| AC-004-4 | plan:148 `markProvisional` → 下游徽 | ✓ | |
| AC-004-5 | plan:149 三态 | ✗ | `getStageWorkspace` 在 `empty` / `error` 下的返回未定义（B-02b） |
| AC-005-1 | plan:150 `ConclusionCard` | ✓ | |
| AC-005-2 | plan:151 `EvidenceChain` | ✓ | |
| AC-005-3 | plan:152 `InterventionComposer` 五类操作 | ✗ | **无契约方法**承载批注 / 追问 / 深挖 / 删除 / 否决；五动作 → kind 映射未给（"深挖""批注"在 13 种 kind 中无对应）（B-01a） |
| AC-005-4 | plan:153 `RuleCandidateDialog` + pin_rule | ✗ | 无契约方法；"candidate"标注落在哪个字段未定（B-01b） |
| AC-005-5 | plan:48/154 抽屉 `jobContext` 标签 | ◐ | `AgentDrawer.vue` / `agent/store.ts` 在基线不存在（T-13 未完成）；接线时机与所有权未定（B-06） |
| AC-005-6 | plan:155 三态 / 冲突场景 | ✗ | `job-conflict` 场景下结论卡 / 阶段 / 产物各自的 `conflict` 分布未定义（B-02a） |
| AC-006-1 | plan:156 六类块 + chart-spec + 主题 | ✗ | chart 块载荷形态（designUI §5.1 `{template_id, series_bindings, overrides}` 或编译后 option）未在类型表定义；`theme.ts` 基线不存在（B-04f、B-06） |
| AC-006-2 | plan:157 inline 编辑 → revision（来源=人） | ✓ | |
| AC-006-3 | plan:88/158 `createBlockComment` | ✗ | 只有"新建"；**回复、标记已解决无契约方法**；`BlockComment` 状态 / 线程结构未定（B-01c、B-04c） |
| AC-006-4 | plan:89/159 `listRevisions` / `getRevision` | ✓ | `Revision` 的版本号 / 作者 / 时间 / 摘要 / base 字段建议在类型表列明（并入 B-04d） |
| AC-006-5 | plan:46/160 `DiffView`、`diff.ts` | ✓ | |
| AC-006-6 | plan:90/121/161 `requestRevision` + 回放 + `resolveRevision` | ✗ | "回退"的语义未定义：按 R1 必须是新 revision 而非删除；`action` 枚举未给（B-05a） |
| AC-006-7 | plan:121/162 `publishDeliverable` | ✗ | 发布检查点对未解决 `conflict` / `pendingMerge` 的处理未定义（interaction R3、designUI §3.5-3）；发布后只读在契约层如何拒绝写方法未定（B-05b/c） |
| AC-006-8 | plan:163 块徽 | ✓ | |
| AC-007-1 | plan:73/164 `InterventionHistory` + 筛选 | ✓ | 字段命名（spec 为 snake_case，既有契约为 camelCase）须在契约中一次定清（并入 B-04g） |
| AC-007-2 | plan:122/165 `job-pending-merge` 场景 | ✗ | 运行如何开始未定义：mock `AgentClient` 只在 `send()` 后发事件（`mock/index.ts:137–166`），plan:95 的 `jobScript` 语义与触发点缺失（B-02c） |
| AC-007-3 | plan:166 删除 / 发布 / 取消二次确认 | ✗ | 无取消作业、无删除来源方法；"删除结论"也无方法 → 二次确认无动作可挂（B-01d/e） |
| AC-007-4 | plan:45/55/167 `inboxStore` | ✗ | "待处理介入"的产生规则、"轨道"指阶段轨道还是工作台作业轨道（后者归 v2）、收件箱条目来源均未定义（B-08） |
| AC-007-5 | plan:101/168 `check --only glass` | ✓ | 已核 `check.mjs:269–278` |
| AC-008-1 | plan:92/169 `contract-build` + 对拍单测 | ✓ | 已核生成器表驱动；新 schema 须加入 `contractSchemas`（S-07） |
| AC-008-2 | plan:96/170 场景清单单测 + e2e | ✗ | 九个场景中四个 `job-*` 的 fixture 组成与既有三个（empty / error / slow）对 v2 方法的行为未定义（B-02a/b） |
| AC-008-3 | plan:101/171 `check --only network` | ✓ | 已核 `check.mjs:313–320`；`File.text()` / URL 粘贴不触发网络（plan:110） |
| AC-008-4 | plan:11/172 CONTRACT.md 2.0.0 + 变更说明 | ✓ | 版本字面量与"1.x 可解析"措辞见 S-01 |
| AC-009-1 | plan:106/173 `pnpm test` | ✓ | 命令已定义；实现时登记输出 |
| AC-009-2 | plan:105/174 `manual-acceptance.md` M-01～M-10 | ✓ | 十项内容目前只有计数，建议在 plan 列出各项"看什么"（S-09）；截图属 Handoff，本轮不声称 |

## 工程准则（AGENTS §5）专项核查

- ☐ **P-1 不为猜测场景加复杂度、不悄悄扩大范围（§5.1）。** 基本符合：行级 diff 自实现 + 2000 行上限、512KB 降级、mock 单一可变状态层均有 AC 或风险依据，不引第三方 diff 库。**一处待去除**：plan:54 `jobsStore` "运行态轮询（mock 立即返回）"——状态变化全部来自契约方法返回值与 agent 事件流，轮询没有需求来源（S-02）。非阻断，Plan 修订时删或给依据后勾选。
- ☑ **P-2 外部数据只在入口层校验（§5.2）。** plan:57–58 契约 mock 层持有唯一可变状态、读写经契约方法；沿用 `methods.ts` 的 `validation` 约定（边界 parse 一次）；localStorage 损坏在 `persistence.ts` 边界重建（plan:46/102）。
- ☑ **P-3 不提前抽只用一次的抽象（§5.3）。** `diff.ts` / `persistence.ts` 各有多处消费者（diff 视图 + 变更摘要；jobs + inbox 快照）；徽标三组件对应 designUI §6 具名概念；不复制第二套对话组件（plan:48）。`sessionStore`（plan:56）若仅为 `jobContext` 透传，Tasks 时可并入 `jobsStore`（信息级）。
- ☐ **P-4 主函数只写正常流程（§5.4）。** 代码级准则，Plan 阶段不适用；Review 阶段核 `job-state.ts` 各方法与 `IntakeDrawer` 提交流程。
- ☑ **P-5 自动生成文件不手改（§5.5）。** `contracts/{CONTRACT.md,schema.json}` 继续由 `contract-build.mjs` 生成、`check --only generated` 逐字节比对（plan:92/101/112）；本 feature 不新增生成物类别。
- ☑ **P-6 测试测真实实现、少用 mock（§5.6）。** 组件 / e2e 测真实组件，数据经契约 mock 在系统边界注入（spec R-008 要求的形态）；`diff.ts` / `persistence.ts` 单测测真实函数；不 vi.mock 内部模块。提醒：diff 单测的期望值须手写样例，不得在测试里再实现一遍 LCS。
- ☑ **P-7 按仓库现有流程、不引入未在用工具（§5.7）。** 栈与命令全部沿用 frontend-workbench（`package.json` 已核：Vue 3.5 / Vite 8 / zod 4 / Vitest 5 / Playwright 1.64 / pnpm 11）；不升级工具链（plan:8）。

## 其他自定义项

- ☐ **C-01 前置依赖与职责边界清楚。** 未满足（B-06）：① plan:16 把 `router.ts` 列为"共享文件（需与 v2 协调）"，但 plan:29 又由本 feature 改它注册路由——没有唯一所有者；② plan:180 "本 feature 分支基于该 feature 完成后合并"未指明起始基线（frontend-workbench Handoff 后的 commit，还是当前 `fdaa7d8`）；③ plan:48/156 复用的 `AgentDrawer.vue` / `agent/store.ts` / `theme.ts` 在 `fdaa7d8` 不存在；④ `specs/README.md:23` 把 frontend-workbench v2 与 api 列为依赖，而 AGENTS §2 规定"依赖未满足不得进入 Plan"——spec §4 已把二者改写为"不阻塞 mock 验收"的软依赖，状态表应区分硬 / 软依赖（S-04）。
- ☐ **C-02 契约闭环（spec 行为 ↔ 契约写路径）。** 未满足（B-01）：已写入 spec 的行为中，分析台五类介入、教规则、块批注回复 / 解决、取消作业、删除来源 / 结论没有任何 `DataClient` 方法；plan:120 的"对应契约方法"是空指。`listInterventions` / `subscribe(jobContext)` / `resolveRevision` / `rerunStage` / `markProvisional` 的读 / 写路径存在。
- ☐ **C-03 事件与状态闭环（R1–R6 旁路语义）。** 部分满足：plan:122 人的编辑即时落 revision 并标 `pendingMerge`、agent 不被打断、`run.completed` 为检查点、`failed/aborted` 保持待合并并提示——符合 R2 / R3，没有用"等人确认才继续"替代旁路 ✓。**未满足**：重跑迁移（B-03）、未运行时参数修正的 `pendingMerge` 何时清除（无 run 则无 `run.completed`；B-03）、合并结果以何种契约可见形态记录（kind 列表无 merge 类；B-02c）、冲突与发布检查点（B-05b）。
- ☐ **C-04 场景定义足以稳定验证。** 未满足（B-02）：四个 `job-*` 场景各含哪些作业、每个作业的 `status` × 四个 `StageState` × 产物状态组合、是否与 `normal` 叠加、`empty/error/slow` 对 22 个新方法（含写方法）的行为、`job-pending-merge` 的运行驱动，均未写；plan:60 与 plan:123 对非 normal 场景是否清空 `fai.jobs.v1` 说法相反。
- ☐ **C-05 版本与发布闭环。** 未满足（B-05）：人改 / agent 改各产生 revision ✓（plan:121）；但回退语义、`PublishSnapshot` 不可变性（发布后写方法拒绝码）、发布检查点对 conflict / pendingMerge 的处理、历史版本只读在契约层的保证未定义。
- ☐ **C-06 隐私与本地持久化自洽。** 部分满足：fixtures 为合成样例、不读真实 PDF、不落盘文件本体、URL 不抓取（plan:110、network 守卫）✓。**未满足**（B-07）：文本粘贴正文与 URL 是否进入 `fai.jobs.v1`（plan:60 列"投放"入快照、plan:110 又称"不写私有文档"），一次大段粘贴即可触发 512KB 降级；降级 / 损坏"提示"的界面落点缺失（frontend-workbench 已删除 Toast）。
- ☑ **C-07 视觉与工程纪律。** 不新增颜色字面量与玻璃层级（plan:12–13）；状态徽 / 来源徽文案 + 图标，派生标记以来源徽 + 文字表达（designUI §2.4）；冲突徽对比度不足时"登记后继设计变更、不私加色值"（plan:185）；`accent.amber` / `text.*` 令牌在 `tokens.json:16–22` 存在。
- ☑ **C-08 D-015 / D-013 编号未混淆；D-017 仅边界引用。** plan 未引用 D-015；spec §4 引用 D-017 "仅关联"；前端分支的旧八项导航未被用来否定 D-016（plan:195 明确 9 项归 v2）。

---

## 阻断项（B-01 ～ B-08；全部为设计补全，不需回流 Clarify）

| # | 类别 | 问题与位置 | 受影响 AC | 最小关闭要求 |
|---|---|---|---|---|
| **B-01** | 契约闭环 | plan:80–91 方法表缺以下写路径，而 plan:120 / :152 / :153 / :158 / :166 均声称经"对应契约方法"：(a) 分析台批注 / 追问 / 深挖 / 删除 / 否决；(b) 教它一条规则（pin_rule，candidate 标注）；(c) 块批注回复、标记已解决；(d) 删除来源（spec:142）/ 删除结论（spec:110）；(e) 取消作业（spec:142/148）。13 种 kind（plan:73）与五类分析动作的对应关系未给（"批注""深挖"无 kind）。 | AC-005-3、AC-005-4、AC-006-3、AC-007-3、AC-002-5 | 在 plan §2.4 增补方法（如 `submitIntervention(jobId, input)` 承载 a/b/d 结论侧、`replyBlockComment` / `resolveBlockComment`、`cancelJob`、`removeUpload`；形态由实施者定，但须进 `methods.ts` 语义表与 CONTRACT.md），并给出一张 **动作 → 方法 → kind → payload 必填字段** 矩阵覆盖 spec 全部介入动作（含 AC-004-2 的参数修正、AC-006-6 的改稿、AC-002-4 的重跑、AC-006-7 的发布）。 |
| **B-02** | 场景与 mock 驱动 | (a) plan:95–96 / :119 / :136 / :155：四个 `job-*` 场景的 fixture 组成未定——每场景含哪些作业、各作业 `status` 与四个 `StageState`、产物 / 结论 / 块的状态分布；`needs_human` 作业的其他阶段是否 `running`（R3 下游继续）；避免单一作业同时承担互斥情景。(b) 既有 `empty / error / slow` 对 22 个新方法（含写方法）的行为未定（`mock/index.ts:70–76` 现只对 `moduleFixtures` 报错）。(c) plan:122 / :165 `job-pending-merge`："检查点事件"来自哪一次 run——mock `AgentClient` 只在 `send()` 后发事件（`mock/index.ts:137–166`），plan:95 `jobScript` 的触发点与语义缺失；合并结果以何种契约可见形态记录（kind 列表无 merge / checkpoint）。(d) plan:60 "不恢复本地状态"与 plan:123 "重置 mock 状态与本地快照"相反。 | AC-001-4、AC-002-3、AC-004-5、AC-005-6、AC-007-2、AC-008-2 | plan §2.4 增一张 **场景 × 方法行为表**（九个场景 × 读 / 写方法：返回 / 拒绝码 / 延迟）与 **场景 × 作业样本表**（每场景的作业 id、status、四个 StageState、关键产物状态）；明确 `job-pending-merge` 的驱动（推荐：用户在作业内经抽屉 `send({jobContext})` 走 `long` 脚本，不另造 `jobScript`；若保留 `jobScript`，定义其触发时机与是否绕过 `send`）；明确合并结果的记录形态（如原介入事件 `outcome` 更新为 `merged` / `pending`）；统一 plan:60 与 plan:123：非 normal 场景只读 fixture、**不写不清**用户的 `fai.jobs.v1`。 |
| **B-03** | 事件与状态闭环 | plan:83 / :119 / :137 `rerunStage` 只写"新介入事件"：未定义本阶段及下游 `StageState` 迁移（如 → `running`，再由何事件置 `done`）、作业级 `status` 同步、产物版本保留方式（按 R1 应为新 revision、旧 revision 可见）、运行中重跑与 `pendingMerge` 的关系；AC-002-4 明文要求断言"mock 状态迁移"。同类缺口：无 run 时（直接 `updateParams`）产物的 `pendingMerge` 何时、由谁清除（plan:122 只定义了有 run 的情况）；`needs_human` 横幅"对应阶段"取自哪一字段。 | AC-002-4、AC-004-2、AC-002-3 | plan §4.3 写明 `rerunStage` 的状态迁移表（本阶段与下游 StageState 前 → 后、job.status 前 → 后、产物 revision 变化），以及 `pendingMerge` 的两条清除路径（有 run：终态事件；无 run：即时合并或显式"检查点"动作，二选一并写明）；注明横幅目标 = `StageState === 'needs_human'` 的首个阶段。 |
| **B-04** | 契约类型完整性 | plan:66–76 类型表缺 AC 直接依赖的声明：(a) 状态 → 文案映射由契约声明（spec:51），现只在 `JobStatusBadge` 组件；(b) `Job` 无 failed / cancelled 原因字段（spec:66）；(c) `BlockComment` 无状态（未解决 / 已解决）与线程 / 回复结构（spec:130）；(d) `Revision` 的版本号 / 作者 / 时间 / 摘要 / base 未列（spec:131）；(e) `Upload` 的来源说明字段（用途 / 可靠性枚举 / 时效 / 口径）与状态枚举（待验证 / 已入库 / 隔离）未列（spec:72–73/83）；(f) chart 块载荷形态未定（spec:128 "契约 chart-spec"；基线契约无 chart-spec 类型，chart-templates 未交付）；(g) `Intervention` 字段命名：spec:140 为 snake_case（`job_id / base_rev / created_at`），既有契约与 plan:76 `JobContext` 为 camelCase，plan:113 又写 `created_at`。 | AC-001-5、AC-002-5、AC-003-3、AC-003-6、AC-006-1、AC-006-3、AC-006-4、AC-007-1 | plan §2.4 类型表逐项补齐字段（可引用 zod 名，不必写全 schema）；(a) 以契约导出的 `JobStatusLabel` / `StageStateLabel`（或 schema `describe` + CONTRACT.md 表）作为唯一映射来源，组件只消费；(f) 选定 chart 块载荷 = designUI §5.1 的 `{templateId, seriesBindings, overrides}` 最小子集或 `SparkSeries` 复用，并说明与 chart-templates 的衔接；(g) 定一条命名规则（建议 camelCase，CONTRACT.md 注明与 spec 字段的对应），AC-007-1 按该规则断言。 |
| **B-05** | 版本与发布 | (a) plan:90 / :121 / :161 `resolveRevision(action)`：`action` 枚举与"回退"语义未定；按 interaction §3.3 R1"编辑不覆盖、可回滚"，回退须产生新 revision 而非删除。(b) plan:121 / :162 发布：未定义发布检查点对未解决 `conflict` 与 `pendingMerge` 的处理（interaction §3.3 R3、designUI §3.5-3 "发布检查点集中处理"），`job-conflict` 场景因此无可验证的收口行为。(c) 发布后"只读"与"快照不可变"在契约层如何保证（写方法对 delivered 作业的拒绝码；`PublishSnapshot` 与 `Revision` 的关系）未写。 | AC-006-6、AC-006-7、AC-005-6（冲突场景）、AC-006-4 | plan §4.5 补三句：`resolveRevision` 的 `accept / revert` 各自产生什么 revision；`publishDeliverable` 在存在 `conflict` / `pendingMerge` 块时的行为（推荐：发布对话框列出未决项并拒绝，返回 `validation_error`；或要求逐项"接受当前版本"后方可发布——二选一）；delivered 后 `saveBlockText / createBlockComment / requestRevision / updateParams / rerunStage` 一律拒绝（给出 code），历史 revision 与快照只读。无需改 spec。 |
| **B-06** | 前置依赖与所有权 | plan:16 共享文件无唯一所有者（`router.ts` 同时被本 feature plan:29 与 v2 修改；`agent/store.ts` 列为共享但 plan:48 要复用、plan:198 又由 v2 改）；plan:180 "基于该 feature 完成后合并"未给基线；`AgentDrawer.vue` / `agent/store.ts` / `theme.ts` 在 `fdaa7d8` 尚不存在（frontend-workbench T-12 / T-13 未完成）；AC-003-1 / AC-005-5 / AC-006-1 / AC-007-4 的可验收性依赖这些未来产物与未过 Gate 1 的 v2。 | AC-003-1、AC-005-5、AC-006-1、AC-007-4 | plan §1 增"基线与所有权"小节：① 本 feature 实施起点 = frontend-workbench Handoff 合入后的 commit（或明确可接受的最小前置任务集 T-12 / T-13 完成的 commit）；② 每个共享文件只有一个修改者（建议：`router.ts` 路由追加归本 feature、`nav.ts` / `TopBar.vue` / `AppShell.vue` / `WorkbenchPage.vue` 归 v2、`agent/store.ts` 的 `jobContext` selector 归本 feature 且只做新增），并写明接线顺序；③ 明确哪些 AC 在 v2 合入前只能标 `blocked_by`，且 Converge 报告须把它们列为"未收敛（外部阻塞）"而非通过。 |
| **B-07** | 隐私与本地持久化 | plan:60 把"投放"整体纳入 `fai.jobs.v1`，plan:110 又称"不写私有文档到 localStorage"：文本粘贴正文与 URL 是否入快照未定，一次长粘贴即触发 plan:111 的 512KB 降级，导致全部作业状态失去持久化；"降级并提示""解析失败重置"（plan:111/183）的提示落点未定（基线无 Toast）；与 B-02d 的"重置本地快照"叠加后，用户何时会丢本地状态不可预期。 | AC-003-3、AC-008-2、AC-001-4（错误态） | plan §3 写明 `Upload` 的持久化子集（建议：元数据 + 来源说明 + 映射 + 状态；文本粘贴正文不持久化或截断到固定长度并标注"已截断"，URL 只存字符串）；提示落点定为页面内横幅或收件箱条目（复用 B-08 的收件箱）；写明清空 `fai.jobs.v1` 的唯一触发（显式"重置样例数据"动作），场景切换不清空。 |
| **B-08** | 角标与收件箱 | plan:45 / :55 / :120 / :167 只写 `inboxStore` 与 `fai.inbox.v1`：未定义什么事件构成"待处理介入"（候选：阶段 `needs_human`、`conflict`、待合并结果、agent 改稿待接受 / 回退、重跑完成）、条目由契约方法返回还是前端从 `listInterventions` / `StageState` 推导（plan:186 禁止前端推导阶段状态，角标是否同理）、"轨道"指详情页阶段轨道还是工作台作业轨道（spec:143/149；后者归 v2 plan:196）、"查看收件箱后清除"清的是角标还是条目。 | AC-007-4 | plan §2.2 / §2.3 补一段：待处理项的来源枚举与生成规则（推荐经契约 `listInbox(jobId?)` 或在 `Job` / `StageWorkspace` 上带 `pendingCount`，与 plan:186 口径一致）；角标出现位置 = 作业列表卡 + 详情页阶段轨道（本 feature），工作台作业轨道角标标 `blocked_by v2`；"清除" = 已读状态写 `fai.inbox.v1`，条目保留。 |

## 建议（S-xx；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-01 | plan:11；前端 `types.ts:66` | `Bootstrap.contractVersion` 是 `z.literal(CONTRACT_VERSION)`，升 2.0.0 后 1.0.0 的 bootstrap 不可解析；把"1.x 数据可解析"改为"既有字段与方法语义不变"，或将 literal 放宽为 `^1\.|^2\.`；同时说明为何纯新增走 MAJOR 而非 MINOR（若理由是"场景与 `SendMessage` 枚举扩展对 real 实现属破坏"，写一句即可）。 |
| S-02 | plan:54 | 删除 `jobsStore` 的"运行态轮询"或给出需求来源（§5.1）。 |
| S-03 | plan:101；spec:168 | spec R-009 what 列的"状态徽不只靠颜色 / 来源徽覆盖"两项静态守卫，plan 以组件测试承担（AC-001-5 / AC-003-6 / AC-006-8 均为组件测试，可接受）；在 plan §2.5 写明这一对应，避免 Converge 时被当作缺口。 |
| S-04 | `specs/README.md:23` | 依赖列区分硬依赖（frontend-workbench 地基完成）与软依赖（v2 Gate 1、api），与 spec §4 "不阻塞 mock 验收"一致；否则与 AGENTS §2 "依赖未满足不得进入 Plan"字面冲突。 |
| S-05 | plan:80 | `listJobs(filter?)` 语义表写明默认排序 = 更新时间倒序（spec R-001 what）。 |
| S-06 | plan:118 | 写明 `submitIntake` 后状态 = 待验证、`confirmIntake` 后 = 已入库 / 隔离（mock 规则），以及单位修正属于 `mapping` 的一部分。 |
| S-07 | plan:92；`contract-build.mjs:41` | 新 zod schema 须加入 `contractSchemas` 注册表（或在 `job-types.ts` 导出后合并），否则不会进入 `schema.json` / CONTRACT.md 字段清单。 |
| S-08 | plan:102 | `diff.ts` 单测用手写样例作期望，不在测试内重写 LCS（§5.6）。 |
| S-09 | plan:105 | 在 plan 列出 M-01～M-10 各项主题（如 M-01 状态徽、M-05 图表块主题等已被 §5 引用），便于 Tasks 一次写全。 |
| S-10 | plan:139 / :187 / :209 | AC-003-1（及 B-08 裁定后可能的 AC-007-4 轨道部分）在 v2 Gate 1 + 合入前无法全绿：Tasks 的 H 组任务显式 `blocked_by: frontend-workbench-v2`，Converge 报告把它们列为外部阻塞；需 Walter 知悉本 feature 的"完成"依赖 v2 的时间线。 |

## Gate / Walter 知悉事项（本阶段不要求裁决）

1. 本轮 8 项阻断均可在 plan 内闭环，**不需要回流 Clarify、不动冻结 spec**。
2. 本 feature 实际可开工时点受 frontend-workbench T-09～T-15（尤其 T-12 主题、T-13 对话抽屉与 agent store）进度约束；plan 修订时应写死基线（B-06）。
3. AC-003-1 的工作台入口与可能的 AC-007-4 作业轨道角标依赖 `spec/frontend-workbench-v2` 过 Gate 1 并合入；在此之前本 feature 的 Converge 不能报"已收敛"（S-10）。
4. 审核期间本 worktree 被切到 `feat/desktop-shell`；本文件以未跟踪文件写入 `specs/workbench-interaction/checklist.md`，由实施侧在 `spec/workbench-interaction` 分支上纳入提交。

## 结构核验证据（只读，未安装依赖、未运行项目测试）

```text
SPEC      cfb6c66 == spec/workbench-interaction:specs/workbench-interaction/spec.md（md5 7c689362…）
PLAN      d52e784 == spec/workbench-interaction tip（md5 4064e740…）
AC_COUNT  5+5+6+5+6+8+5+4+2 = 46；plan §5 行数 46；编号集合一致
METHODS   plan §2.4 列 21 个 DataClient 新方法 + AgentClient.send(jobContext)；
          spec 写入的写行为中无方法承载：分析介入×5、pin_rule、批注回复/解决、取消作业、删除来源/结论
KINDS     plan 13 种 vs interaction §3.4 示例 10 种：多 question/rerun/publish；缺 merge/checkpoint；"批注""深挖"无映射
SCENARIO  既有 5（normal/empty/error/slow/boot-error，types.ts:68 封闭枚举）+ 新 4（job-*）；对 22 新方法行为未定
BASELINE  fdaa7d8：存在 contracts/{types,client,methods,index}.ts、mock/index.ts、real/index.ts、agent/events.ts、
          scripts/{contract-build,check}.mjs、app/{nav,router}.ts、AppShell/TopBar/Rail/LoadingScreen.vue；
          不存在 agent/{store.ts,AgentDrawer.vue,CotTimeline.vue}、design/theme.ts、modules/、stores/{layout,badges}.ts
GUARDS    check.mjs: glass 白名单 3 类(L269) ✓；network 仅 src/contracts/real/(L313–320) ✓；
          generated 含 contracts/* 字节比对(L189–197) ✓；contract-build 由 contractSchemas+methodSemantics 驱动 ✓
CONFLICT  plan:60 ↔ plan:123（非 normal 场景本地快照）；plan:120 ↔ plan:80–91（介入方法）；plan:11 ↔ types.ts:66（版本字面量）
```

## 结论与下一步（R1）

1. **未通过**。阻断 B-01～B-08 全部为设计补全；Plan 修订后由 A（独立新会话）做第二轮定向复核，逐项核闭环且确认其余内容未回退；通过后方可进入 Tasks。
2. Tasks 产出后另需 A 复核 V-02（任务模板、AC 引用、命令对应、依赖 DAG、`blocked_by` 标注）；Analyze 报告与 Converge 结论不得由本轮任何勾选代替。
3. 本轮只写入本文件；未修改 spec / plan / tasks / docs / 前端分支，未安装依赖、未运行测试、未 commit / push。
