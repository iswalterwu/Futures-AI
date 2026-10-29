# Feature: workbench-interaction 增量 Converge 报告 — T-A22c（R3-A 补修）（converge-batch3-cache-fix.md）

> **性质**：AGENTS §2 第 9 步的**增量 Converge**，只针对 T-A22c 一项：把真实代码 `e7716a8..af24c82` 与 spec / plan / tasks 对比。它**不是** Review、审核结论、Gate 2 或 Handoff；不勾 checklist、不改 spec；**不判 R3-A 已关闭**，关闭与否只由新会话审核员 A 的增量代码 Review 判定。
>
> **阶段记录（脱敏）**：
> - **角色与模型**：增量 Converge / Analyze 作者 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a18755-53bb-72b4-87fa-bcc8b067eba0`）。
> - **通道**：`claude-bridge` 本窗口已明确 quota / rate 限额，按 AGENTS §6 规则 2 / 5 不重试；同模型官方通道成功。只换通道、不换模型，未改 provider / key / 路由 / 全局配置。
> - **派工人**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter 的“允许”授权和集成人指定在既有 tasks 范围内持续有效。
>
> **写入范围**：
> - 唯一可写 worktree：`D:/2030/Futures-AI-interaction-converge-batch3`（branch `docs/workbench-interaction-batch3-converge`，固定起点 HEAD `af24c826f41580d27f90ce611fb2f55fec44acbf`，起始 clean）。
> - 只写本文件、`specs/workbench-interaction/{tasks,analyze,implementation-log,interface-handoff}.md`，以及 `specs/README.md` 中本 feature 的两行。
> - **未改动**：代码、测试、fixture、spec、checklist、plan（§2.3【r6.8】口径已准确，不需改）、原 Review 原件（`review-batch3.md` 等）、原 Converge 报告（`converge-batch3.md` 等）、权威 docs、根 HANDOFF、其他 feature、其他 worktree。
> - **未执行**：没有 commit / push / PR / merge；没有启动子 agent、服务或安装；**没有运行任何产品测试**。
> - **测试数字来源**：下文测试数字全部由实施者执行（实施者回报 `astra-cache-fix-result.md` 与其会话日志），本会话没有重跑。
> - **只读核对产物**：协调器独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/cache-fix-converge-*`（非项目产物，不清理）。
>
> **日期**：2026-10-29（+04:00）。

## 0. 固定输入

| 项 | 值 |
|---|---|
| 任务 | **T-A22c**（tasks r6.8；0.5 h；依赖 T-A22a；3 条标准 ↔ 3 条命令） |
| 规格提交 | `e7716a88297ed9f3fe3a642215bd970c3a326a37`（r6.8：T-A22c、plan §2.3【r6.8】、Analyze R14）。commit body 记录集成人决定：接受 T-B01 依赖 T-A22c（AC-001-1 / 001-4 的祖先覆盖），这是**任务排期**，不是新的产品需求或人工门 |
| 代码提交 | `af24c826f41580d27f90ce611fb2f55fec44acbf`（父 = `e7716a8`），`fix(jobs): preserve base list read status when filtering (T-A22c)` |
| 代码 diff | `e7716a8..af24c82`：**2 个文件，+67 / −3**：`frontend/src/jobs/stores/jobs.ts`（−2）、`frontend/tests/unit/jobs/jobs-store.spec.ts`（+67 / −1）。`git diff --check` 通过 |
| 有效 Checklist | **R9**，原件 `ab742f5`；本树 `checklist.md` blob = `74084c1337491a042c944096e1f290fe07aab324`，未改 |
| 审核依据 | `review-batch3.md`（原件 `49edb7e`）：本批通过，0 P1 / P2；P3 R3-A 方案 (b)、探针 P1 / P2；§8 第 2 条要求 R3-A 在 T-B02 / H-2 ④ 之前关闭 |
| 树位置（只读 `git worktree list` / `branch --contains`） | 实施树 `feat/workbench-interaction-astra`、生产方集成树 `integration/workbench-interaction`、本文档树三者 HEAD 都是 `af24c82`。生产方集成树只作旁证，**不是 ④** |
| v2 消费方 | `integration/frontend-workbench-v2` = `3f632739fc186396221482364cf16e3629b4b24f`，**不含** `af24c82`（只读核）。本会话不写、不代登记 v2 树 |
| 上游 | main `072bb12` 仍**不是**本树祖先，继续 pin `90187f7`；R2-D 流程不变 |

**本轮开始时重新读取**（不依赖会话记忆）：
- AGENTS.md（§2 / §5 / §6）、`docs/plan.md`；
- 冻结 spec.md（AC-001-1 / 001-2 / 001-4 / 009-1）；plan.md 页首【r6.8】与 §2.3【r6.8】；
- tasks.md：页首 r6.8 块、§2a H-2·列表、T-A22a（含【r6.8】）、T-A22c 全文、T-B01 / T-B02、§5 / §6；
- checklist R9（只读）；analyze.md「Analyze R14」；
- `review-batch3.md` 全文（R3-A、P1 / P2 / P3、O-R3-2、§8）；
- implementation-log 页首 / §7 / §8 / §11；interface-handoff 页首 / §1 / §3；
- `git show e7716a8`（含 commit body）与 `git diff e7716a8 af24c82` 全文，以及 `af24c82` 上两个文件的完整内容。

实施者回报（`astra-cache-fix-result.md`）只作结果来源。本会话另读了实施者会话日志（`astra-cache-fix-session/*.jsonl`，只读）中的真实命令输出，用来核对红 → 绿留痕；两者都不能代替代码阅读。

## 1. diff 事实与所有权

- **生产代码**（`frontend/src/jobs/stores/jobs.ts`）：`applyFilter(value)` 的 try 分支在 `filteredJobs.value = await dataClient.listJobs(value)` 之后，**只删了** `listStatus.value = 'ready'` 和 `listError.value = null` 两行（`e7716a8` 第 43–44 行）。其余部分逐字未变：
  - catch 分支仍写 `listError` 并置 `error`，保留旧 `filteredJobs`；
  - `applyFilter(null)` 仍只置空 `filteredJobs`；
  - `ensureJobs` / `refresh` / `createJob` / `receiveAgentEvent` 未变；
  - 对外返回对象（5 个只读 computed + 5 个 action）与 `ListJobsFilter` 类型未变。
  - 没有新增字段、回滚、锁、请求序号或公开成员（AGENTS §5.1）。
- **测试**（`frontend/tests/unit/jobs/jobs-store.spec.ts`）：
  - 新增 describe `WI H-2 list status — AC-001-1 / AC-001-2 / AC-001-4 partial`，两例（第 150–211 行）。
  - `WI H-2 filter` 组中原 “… the next filter read clears the error” 一例改标题为 “… only an explicit refresh clears the error”。前半段原样；切回 normal 后新增三条断言（`listStatus` 仍 `error`、`listError.code` 仍 `adapter_error`、显式 `refresh()` resolve），原有的“清错后 `listError` null / `ready`”两条断言保留在 refresh 之后。**未删任何用例**。
  - 其余用例的 diff 为零。
- **零差异**：`main.ts`、`contracts/**` 与生成物、其他 jobs 源 / 测试、fixture、`app` / `shared` / `agent` / `workbench`、scripts、package / 锁、配置、e2e、specs、docs。`af24c82` 的 `--name-status` 只有上述两个 `M`。
- **测试真实性**：沿用文件既有的 `connect()` / `changeScenario()`：真实 Pinia，真实 `createMockDataClient()`，只对 `contracts/index.ts` 的 `dataClient.listJobs / createJob` 做透传 spy（系统边界）。期望值由真实 `client.listJobs()` / `client.listJobs(filter)` 计算，测试里没有复写筛选算法，也没有 `vi.mock` 内部模块（AGENTS §5.6）。
- **生产调用方**：`applyFilter` 在 `frontend/src` 中除定义处外没有调用方（只读 grep），本修复不影响任何现有页面。

## 2. 逐条完成标准（标准 → 真实代码证据 → 命令结果）

| 标准 | 真实代码证据 | 命令与结果（实施者执行，本会话未重跑） | 判定 |
|---|---|---|---|
| **1**（P1 / P2 两条路径；AC-001-1 / 001-2 / 001-4 部分前置） | **路径 P1**（第 151–174 行）：全新 normal store 先 `applyFilter({type:'daily'})`，随后断言：<br>• reads = `[[f]]`；`filter` = f；`filteredJobs` = `listJobs(f)`；<br>• `jobs` = `[]`、`listStatus` = `idle`、`listError` = null；<br>• 再 `ensureJobs()` 后 reads = `[[f], [], [f]]`、`jobs` = `listJobs()`、`filteredJobs` 不变、`ready`、无错误；<br>• 另先断言筛选结果非空且少于未筛选全集，排除空集退化。<br>**路径 P2**（第 176–210 行）：error 场景 `ensureJobs()` 置 error 后切回 normal，`applyFilter(f)`：<br>• 只读一次 `[f]`；`filteredJobs` 更新；<br>• `jobs` 引用不变；`listStatus` 仍 `error`；`listError` 引用不变、`code='adapter_error'`；<br>• `ensureJobs()` 不重读；<br>• 显式 `refresh()` 后 reads `[[f], [], [f]]`，两视图恢复，`ready` 且无错误。<br>两条路径都直接对应源码：成功分支不再写读状态，`ensureJobs()` 只看 idle | 命令 1 `test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 list status"`：**2 passed**（25 skipped / 27）。**先红后绿**（会话日志）：生产修复前同一命令 2 failed，分别为 `expected 'ready' to be 'idle'` 与 `expected 'ready' to be 'error'`（第 195 行），即准确复现 R3-A 的 P1 / P2；删两行后 2 passed | **满足** |
| **2**（整文件；`WI H-2 filter` 组用例数不变；四组其余原样；H-2 ①～⑤ 不回归） | 整文件 27 例 = 原四组 25（`cache` 5 / `filter` 4 / `createJob refresh` 7 / `agent refresh` 9，与已审 `0032fc6` 的 A 亲跑同数）+ 新 2。被改一例按 r6.8 断言“筛选成功保留错误、显式 refresh 清错”。S-38、清空筛选不发请求、筛选失败保留旧 `filteredJobs` 等原例 diff 为零。新 describe 标题不含 `WI H-2 filter` 子串 | 命令 2 `test:unit tests/unit/jobs/jobs-store.spec.ts`：**27 passed**。补充：`-t "WI H-2 filter"` **4 passed**（23 skipped），组数不变 | **满足** |
| **3**（工程门、契约零漂移；AC-009-1 部分前置） | 两文件都不涉及契约源或生成物 | 命令 3 `typecheck && lint && contract --check`：均 exit 0；`contract:check: 24 methods, 10 events, 2 artifacts match.` | **满足** |

**回归**（不是新增标准；实施者执行，本会话未重跑）：
- 全量 `pnpm -C frontend test:unit`：**31 files / 953 passed / 0 failed**（= 已审 951 + 新 2）。
- `pnpm -C frontend check`：六守卫全部通过（generated / colors 24/24 正样本、0 负命中 / glass / updown / grid / network）。
- `test:e2e e2e/shell.spec.ts e2e/agent.spec.ts`：**24 passed**（1.0 min）。实施者回报 4173 前后空闲、服务自管后退出（会话日志末次 netstat 只有 TIME_WAIT，无 LISTEN）。
- 提交前 `git diff --check`、暂存 `--check`，以及“暂存恰为两个授权文件、无未暂存改动”的脚本检查通过。提交后 clean，Checklist blob 不变。

**未跑项**：其余 7 份 E2E（本任务无 UI）；没有人工截图。

## 3. 实施 ↔ 规格对拍（是否偏离 / 是否需求变更）

| 规格要求（tasks T-A22c / plan §2.3【r6.8】） | 实施事实 | 判定 |
|---|---|---|
| 只删成功分支两次赋值，恢复 r6.6“`applyFilter(f)` 只写 `filter` / `filteredJobs`” | 逐字如此（§1） | 一致 |
| 失败分支、`applyFilter(null)`、其他 action、S-38、签名与公开成员不变 | diff 为零 | 一致 |
| 不加筛选状态机 / 回滚 / 锁 / 请求序号 / 新公开成员 | 无 | 一致（AGENTS §5.1） |
| 测试：新增 `WI H-2 list status` 两例；只改 filter 组一例（标题末段 + 切回 normal 后断言），不删 | 如此；原两条清错断言移到显式 refresh 之后 | 一致 |
| O-R3-2（筛选失败时 `filter` 与 `filteredJobs` 可能暂不对应）只登记精度，不重设计 | 未改 | 一致 |
| `listStatus` / `listError` 只由 `refresh()` 置 ready / 清错 | 源码中只有 `refresh()` 写 `ready` 和 `listError = null` | 一致 |

**结论**：没有实施定形差距，不需要 r6.9 精度，plan / tasks 的设计文本不改；**不是需求变更**，不回 Clarify / Gate 1；spec 46 AC 不变。

## 4. 状态回写口径

- **T-A22c**：状态改为“**已实施（待定向 Review：新会话 A 增量代码 Review 只核 R3-A；不表示 AC 最终验收）**”，登记 `af24c82`、逐命令结果、红 → 绿留痕。原“未开始”留作 r6.8 登记时原文。**不写“已完成 / R3-A 已关闭”**。
- **进度**：68 个任务、约 102.5 h；**21 / 68 已实施** = 20 已完成（三批 Review 通过）+ 1 已实施待定向 Review（T-A22c）；**47 未开始**。46 AC 最终验收仍 **0**；feature **未收敛**（47 项未实施 + H 组外部阻塞 + T-A22c 待复核）。
- **结构**：完成标准 / 命令 227 / 227；依赖、AC 矩阵 46 行、DAG 均不变（脚本复算见 analyze.md「Analyze R15」）。
- **R3-A**：**代码已修，待 A 增量复核**；R3-B（→ T-C03 / T-A17）、R3-C（→ T-G04）未改，未经 Walter 风险接受。
- **H-2·列表**：
  - ① 候选 `af24c82`（T-A22c；祖先含 `0032fc6`），待 A 增量复核；
  - ② R9 `ab742f5`；
  - ③ 新组 2、整文件 27（原四组 25）pass + 工程门，实施者执行、待 A；
  - **④ 仍缺**，T-A22c 复核前不放行。生产方集成树 `af24c82` 只是旁证，不能填作 ④。
  - 其余切片保留原登记；H-6 仍缺 T-A21。

## 5. 真缺口与待办

- **本任务范围内的代码 / 规格缺口**：**无**。两行删除已满足方案 (b)，没有新机制，不扩范围，不新增任务或需求。
- **流程待办（不是缺口，也不由本会话完成）**：
  1. **独立 A 增量代码 Review**：新会话、与实施异模型（按 AGENTS §6 审核员候选），固定审 `e7716a8..af24c82` 的真实 diff 与本文档提交。只核 R3-A 是否关闭（P1 / P2 路径、方案 (b) 无副作用、被改用例未放宽覆盖），第三批其他结论保留。复核前不得把 T-A22c 写成“已完成”，也不得放行 H-2 ④。
  2. **H-2 ④**：只能由 `integration/frontend-workbench-v2` 所有者在真正集成后登记。
  3. **排期提示（交集成人决定）**：按依赖链，T-B01 在 T-A22c 已实施后可起步。`review-batch3.md` §8 第 2 条要求 R3-A 在 **T-B02 / H-2 ④** 之前关闭；T-B01 是否等 A 复核后再派，由集成人决定，本报告不代定。
- **既有未决**（不变）：R3-B / R3-C 未修；前两批 P3 状态不变；main `072bb12` 同步按 R2-D；H 组 v2 外部闸门。

## 6. 结论

- **T-A22c**：实施与 tasks / plan【r6.8】逐条一致，3 / 3 标准有真实代码与实施者命令证据，红 → 绿留痕属实。**本任务增量已收口，待独立 A 增量 Review**；R3-A **代码已修、待复核**，不由本会话判定关闭。
- **feature**：**未收敛**；21 / 68 已实施（20 已完成 + 1 待定向 Review）、47 未开始；46 AC 最终验收 0；H-x 无一“已交付”。
- **不是** Review、Gate 2 或 Handoff。
