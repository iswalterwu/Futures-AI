# Feature: workbench-interaction 增量 Converge 报告 — T-B04a（R4-A 最小修复）（converge-batch4-r4a.md）

> **性质**：这是 AGENTS §2 第 9 步的**增量 Converge**，只看 T-B04a 一项：把真实代码 `80a1892..ae592ba -- frontend` 和 spec / plan r6.11 / tasks T-B04a 对比。它**不是** Review、审核结论、Gate 2 或 Handoff。本报告不勾 checklist、不改 spec，**不判 R4-A 已关闭**，**也不判第四批已通过**。这两件事只能由新会话审核员 A 的增量代码 Review 判定。
>
> **阶段记录（脱敏）**：
> - **角色与模型**：增量 Converge / Analyze 作者 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a188e8-c8fd-7213-8e90-b721dc6bf792`）。
> - **通道**：`claude-bridge` 在当前额度窗口已明确耗尽，按 AGENTS §6 规则 2 / 5 不重试。同模型官方通道调用成功。只换通道、不换模型，未改 provider / key / 路由 / 全局配置。
> - **派工人**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。
>
> **写入范围**：
> - 唯一可写 worktree：`D:/2030/Futures-AI-interaction-converge-batch4`（branch `docs/workbench-interaction-batch4-converge`）。固定起点 HEAD = `ae592ba23b086dd5887a269e842f80c96ad16fb2`，起始 clean。producer 已 ff-only 到同一 SHA。按用户“抑制目录堆积”的要求，本轮复用现有文档树，没有新建任何工作树。
> - 只写本文件、`specs/workbench-interaction/{tasks,analyze,implementation-log,interface-handoff}.md`，以及 `specs/README.md` 中本 feature 那一行。
> - **未改动**：代码、测试、fixture、spec、checklist。plan 也没动：实现与 §2.1 / §2.3【r6.11】逐字一致，没有新的精度要补。原 Review 原件（`review-batch4.md` 等）、原 Converge 报告（`converge-batch4.md` 等）、权威 docs、根 HANDOFF、其他 feature、其他 worktree 同样没动。
> - **未执行**：没有 commit / push / PR / merge，没有 resolve 冲突或清理目录，没有启动子 agent、服务或安装，**没有运行任何产品测试**。
> - **测试数字来源**：下文测试数字全部来自实施者执行，本会话没有重跑。来源是实施者回报 `astra-result.md` 和逐命令日志 `astra-red-unit.log` / `astra-red-e2e.log` / `astra-task{1,2,3}-green.log` / `astra-regressions.log` / `astra-precommit.log` / `astra-postcommit.log`，均在协调器 Temp `C:/Users/iswal/AppData/Local/Temp/wi-r4a-fix-01a18388-bdy5e3x0/`。本会话亲自执行的只有只读 git 命令和结构脚本（`converge-*`，同一 Temp，不是项目产物，不清理）。
>
> **日期**：2026-10-29（+04:00）。

## 0. 固定输入

| 项 | 值 |
|---|---|
| 任务 | **T-B04a**（tasks r6.11；0.5 h；依赖 T-B04、T-B03 在 `6c082fd` 的已实施代码；3 条标准对 3 条命令） |
| 授权 | `80a189264428f4b011279e4ebf1cc980e9656d14`（docs）：Walter 原话“**那就先修P2等全部工作完成后，再合入main**”，登记为 R4-A 最小修复的 AGENTS §5.1 单独批准（plan r6.11 生效、Analyze R19、implementation-log §17）。它**不是**风险接受，**不是**提前 Gate 2，也不批准删除目录 |
| 代码提交 | `ae592ba23b086dd5887a269e842f80c96ad16fb2`（父 = `80a1892`），`fix(jobs): skip stale detail canonical navigation (R4-A)` |
| 代码 diff | `80a1892..ae592ba -- frontend`：**3 个文件，+72 / −2**：`src/jobs/pages/JobDetailPage.vue`（+4 / −2，diff 共 6 行）、`tests/component/jobs/job-detail.spec.ts`（+54）、`e2e/jobs/detail-stage.spec.ts`（+14）。`80a1892..ae592ba` 全仓库同样只有这 3 个文件。`6c082fd..ae592ba -- frontend` 也只有这 3 个文件（本会话只读复核） |
| 有效 Checklist | **R10**，原件 `37e2f71`；本树 `checklist.md` blob = `4537c55f226f0bdc4f39b19e7c369731cf23abba`，26 勾 / 0 未勾，未改 |
| 审核依据 | `review-batch4.md`（原件 `9812f64`，blob `0c04f6ad…`）：本批未通过，唯一 P2 R4-A（§3：位置、Chrome 复现 2a～2d、最小方案），P3 R4-B～R4-E |
| 实施者 | openai/gpt-6-astra，新会话 `01a188e0-48c1-71df-a0b9-6c87a5b4c916`（会话日志只有这一个模型、无 error 停止，未回退），worktree `D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra` |
| 树位置（只读 `git worktree list` / `branch --contains`） | 实施树、生产方集成树 `integration/workbench-interaction`、本文档树三者 HEAD 都是 `ae592ba`。生产方集成树只作旁证，**不是** H-x ④ |
| 远端 | 本地远端跟踪 `origin/integration/workbench-interaction` = `e285ad2`（未 fetch；派工方报告 Draft PR #12 的 head 仍是 `e285ad2`，暂未更新）。本会话不操作远端 |
| v2 消费方 / 上游 | `integration/frontend-workbench-v2` = `3f63273`，不含 `5c00cf6`（只读核）。main `072bb12` 仍不是本树祖先，继续 pin `90187f7`，R2-D 流程不变 |

**本轮开始时重新读取**（不依赖会话记忆）：
- AGENTS.md（§2 / §5 / §6）、`docs/plan.md`；
- 冻结 spec（AC-002-2 / AC-008-2 / AC-009-1）；
- plan 页首 r6.11 草案行与生效行、§2.1 / §2.3【r6.11】；
- tasks：页首批准块、T-B04a 全文（状态 / 依赖 / 上下文 / 修改范围 / 3 标准 / 3 命令）、T-B04 状态行、T-G09、§5 AC-002-2 行、§6 r6.11 行；
- Checklist R10（只读）；analyze.md「Analyze R18」「Analyze R19」；
- `review-batch4.md` §1～§3（R4-A 全文、R4-B / R4-E 边界）、§5 / §6；
- implementation-log §16 / §17；interface-handoff 页首当前块；
- `git show 80a1892` 全文、`git diff 80a1892 ae592ba -- frontend` 全文，以及 `ae592ba` 上 `JobDetailPage.vue` 和两个测试文件的完整相关部分（含既有 harness：`beforeEach` / `afterEach` / `connect()` / `mountDetail()`）。

实施者回报只作为结果来源，本会话另逐份读了实施者的原始命令日志。两者都不能代替代码阅读。

## 1. diff 事实与所有权

- **生产代码**（`frontend/src/jobs/pages/JobDetailPage.vue` 第 21–29 行）：
  - `watch` 回调签名由 `async ([id]) =>` 改为 `async ([id], _old, onCleanup) =>`；
  - 回调开头、`await` 之前新增两行：`let stale = false` 与 `onCleanup(() => { stale = true })`；
  - canonical replace 的条件由 `stage === null && openedStage !== null` 改为 `!stale && stage === null && openedStage !== null`。
  - 其余字节不变：`openJob` 照常调用并等待；`selectStage`、模板、三态、详情头、`<style>`、imports 都不变；`{ immediate: true }` 也不变。本会话用 `git diff` 只读核对，实施者脚本 `astra-verify.py` 也断言了“基线只做这两处替换后与新文件逐字节相等”（`PRODUCTION EXACT EXPECTED DELTA`）。
  - 没有改 store，没有取消请求或清锚，没有请求序号、锁、比较去重，没有新增 helper，也没有透传 `route.query`（R4-B）或处理 store 迟到写入（R4-E）。
- **组件测试**（`frontend/tests/component/jobs/job-detail.spec.ts`）：
  - 只在文件末尾追加 describe `WI R4-A`，共 2 例（第 228–280 行）。
  - 原文件 12048 字节是新文件的**逐字节前缀**，SHA256 = `74d3fe50…20c4d`，本会话用 `git show` + `cmp` 复核。所以原 11 例、imports、helpers、`beforeEach` / `afterEach` 零改动。
  - harness 沿用既有设施：
    - 真实 Pinia；真实 memory router（`appRouter.options.routes` + `registerJobRoutes`）+ `RouterView`；
    - `connect('slow')` 只对 `contracts/index.ts` 的 `dataClient.getJob / getStageWorkspace / listJobs` 做透传 spy，属于系统边界；
    - `vi.spyOn(router, 'replace')` 是对真实 router 的透传 spy；
    - 假时钟由既有 `afterEach` 统一 `clearAllTimers` / `useRealTimers` / `restoreAllMocks`。
  - 没有 `vi.mock` 内部模块，没有窗口钩子，也没有把业务逻辑抄进测试（AGENTS §5.6）。
- **E2E**（`frontend/e2e/jobs/detail-stage.spec.ts`）：
  - 只在末尾追加 1 例（第 40–52 行），标题以 `WI R4-A` 开头。
  - 原文件 2266 字节是新文件的逐字节前缀，SHA256 = `1a3d5f4d…fe4d4`，本会话复核。原 4 例不变。
  - 没有改 `playwright.config.ts`，没有假时钟、新钩子或新包。
- **零差异**：`stores/**`、`routes.ts`、`session.ts`、`main.ts`、契约与生成物、`shared/**`、`app/**`、scripts、package / 锁、各类配置、specs、docs。`80a1892..ae592ba` 的 `--name-only` 只有上述 3 个文件。

## 2. 逐条完成标准（标准 → 真实代码证据 → 命令结果）

| 标准 | 真实代码证据 | 命令与结果（实施者执行，本会话未重跑） | 判定 |
|---|---|---|---|
| **1**（组件：`WI R4-A` 两例；整文件原 11 + 新 2，原例零删改；AC-002-2 最终，与 T-B04 共同承接） | **例 1“离开”**：slow 场景、假时钟下 `mountDetail('/jobs/j-process')`（无 stage），先断言 `loading`、`getJob` 恰一次；推进 1 ms 后 `router.push('/prices')`，断言详情区已卸载、路由在 `/prices`；推进 3500 ms 后断言：<br>• `getStageWorkspace` 恰一次为 `('j-process','process')`，即被弃回调的 `openJob` 照常完成；<br>• store 为 `ready`；路由仍是 `/prices`；<br>• `router.replace` **未被调用**。<br>**例 2“同作业选阶段”**：先 `/jobs/j-process/process` 读到 ready，离开到 `/prices`，再 `push('/jobs/j-process')`（无 stage）。此时：<br>• `getJob` 恰一次、`getStageWorkspace` 未调用、store 仍 ready、StageRail 可见，即同作业缓存路径；<br>• 推进 1 ms 后点 StageRail 第 4 个按钮“交付”，路由为 `/deliver`，`aria-pressed` 在“交付”；<br>• 推进 3500 ms 后：workspace 调用序列 = `[process, deliver]`；路由仍为 `/deliver`、`aria-pressed` 仍为“交付”；`router.replace` **恰一次**，参数为 `{name:'job-detail', params:{id:'j-process', stage:'deliver'}}`。这一次正是 `selectStage` 的用户选择，没有任何回到 `process` 的 canonical replace。<br>两例都直接对应源码：例 1 由组件卸载触发 `onCleanup`，例 2 由 `route.params.stage` 变化触发 `onCleanup`；`!stale` 挡住的就是 canonical replace，不影响 `openJob` | 命令 1 `test:unit tests/component/jobs/job-detail.spec.ts -t "WI R4-A" && test:unit tests/component/jobs/job-detail.spec.ts`：**2 passed**（11 skipped / 13）→ 整文件 **13 passed**（`astra-task1-green.log`）。<br>**先红后绿**（`astra-red-unit.log`，旧生产代码 + 同一组测试）：2 failed。例 1 在第 245 行，`expected '/jobs/j-process/process' to be '/prices'`；例 2 在第 276 行，`expected '/jobs/j-process/process' to be '/jobs/j-process/deliver'`。两条分别准确复现 R4-A 的 2a / 2c，且失败行号与提交后文件一致。修复时测试期望没有改动 | **满足** |
| **2**（E2E：`WI R4-A` 一例在真实 Chrome slow 通过；四份 E2E 原 29 + 新 1 全过，T-B04 原 `WI AC-002-2` 4 例不改） | 新例：打开 `/jobs?scenario=slow`，等 j-process 卡片可见后点击（`/jobs/j-process`，无 stage），断言阶段导航尚未出现（仍在读）；点侧栏“价格”到 `/prices`；按真实延迟 `waitForTimeout(3500)`，不装假时钟；断言 URL 仍为 `/prices`。对应 R4-A 2a（侧栏离开）。原 4 例是逐字节前缀，没有改动 | 命令 2 `test:e2e e2e/jobs/detail-stage.spec.ts -g "WI R4-A" && test:e2e e2e/shell.spec.ts e2e/agent.spec.ts e2e/jobs/detail-stage.spec.ts e2e/jobs/list-create.spec.ts`：**1 passed** → **30 passed**（1.1 min）。四份原例逐条可见：shell 17、agent 7、detail-stage 原 4 + 新 1、list-create 1（`astra-task2-green.log`）。<br>**先红后绿**（`astra-red-e2e.log`，旧生产代码）：1 failed，第 51 行，`Expected "/prices"`、`Received ".../jobs/j-process/process"`，真实复现 2a。<br>实施者只追加了 `--output <Temp>`，把 Playwright 产物放到独占 Temp。测试选择和配置不变，WebServer 由 Playwright 自管 | **满足** |
| **3**（全量单测原 1018 + 新 2 无删改；`6c082fd..HEAD -- frontend` 只含三文件；工程门；AC-009-1 部分前置） | 两个测试文件都是“原文件前缀 + 追加”，没有删改任何用例 | 命令 3 `test:unit && typecheck && lint && git diff --stat 6c082fd HEAD -- frontend`：<br>• **34 files / 1020 passed / 0 failed**（= 第四批 A 亲跑的 1018 + 新 2）；<br>• `vue-tsc --noEmit` 通过；`eslint . --max-warnings 0` 通过（`astra-task3-green.log`）；<br>• 提交后 `git diff --stat 6c082fd HEAD -- frontend` = 上述 3 个文件、+72 / −2（`astra-postcommit.log`），提交前用工作区 diff 得到同样结果。本会话对 `6c082fd..ae592ba -- frontend` 只读复核同数 | **满足** |

**回归**（不属于新增标准；实施者执行，本会话未重跑；`astra-regressions.log`）：
- `node scripts/check.mjs`：六守卫全部通过（generated / colors 24/24 正样本、0 负命中 / glass / updown / grid / network），tokens 156 / 5 artifacts match。
- `contract --check`：**24 methods / 10 events / 2 artifacts match**。
- `routes.spec` + `session-context.spec`：**17 passed**。
- `jobs-store.spec -t "WI H-2"`：**27 passed**（16 skipped）。
- `badges.spec` **48**、`job-list.spec` **12**（两文件合跑 60，`astra-precommit.log` 中又分别单跑）。
- 提交前后 `git diff --check` 通过。`astra-verify.py` 提交前后都 PASS，断言了：恰好三文件；两个测试文件原前缀逐字节一致，且追加的用例数为 2 / 1；生产代码只有预期的两处替换；冻结 spec（LF SHA256 `ed0f6c6c…942d9`）与 checklist（blob `4537c55…`，26 / 0）不变；没有未跟踪文件。
- 提交后 worktree clean，4173 端口无 LISTEN。

**未跑项**（如实登记，本轮也不补跑）：
- 其余 7 份 E2E、全量 `pnpm -C frontend test`（属 T-G09）、人工截图（属 T-G10）、后端测试；
- 任何 46 AC 的**最终**验收。

## 3. 实施 ↔ 规格对拍（是否偏离 / 是否需求变更）

| 规格要求（plan §2.1 / §2.3【r6.11】、tasks T-B04a） | 实施事实 | 判定 |
|---|---|---|
| 只改 `watch` 回调：第三参数 `onCleanup`；同次回调 `let stale = false` 并在 cleanup 中置 true；只在 canonical `router.replace` 前检查 `!stale`；约 3～5 行 | 签名 1 行 + 新增 2 行 + 条件 1 行，逐字如此。cleanup 注册在 `await` 之前 | 一致 |
| `openJob` 照常调用；`selectStage`、模板、三态、详情头不变 | 逐字节不变（§1） | 一致 |
| 不改 jobsStore（不清锚、不取消、无序号 / 锁 / 比较去重）；不加 `route.query`（R4-B）；不处理 R4-E；不做全局防乱序 | 零差异 | 一致（AGENTS §5.1 授权边界内） |
| 不改 routes / session / main / 契约 / shared / app / 配置 | 零差异 | 一致 |
| 组件测试只新增 `WI R4-A` 2 例：slow 离开、同作业读期间选“交付”；原 11 例不改；harness 同既有、无内部 mock | 如此（§1、§2 标准 1） | 一致 |
| E2E 只新增 1 例 `WI R4-A`：`/jobs?scenario=slow` → 点 j-process → 读完成前点侧栏“价格” → 真实等待 ≥ 3500 ms → 仍为 `/prices`；原 4 例与配置不改 | 如此（§2 标准 2）。`--output` 只是命令行产物目录，不是配置 | 一致 |
| plan §2.1【r6.9】“不加比较 / 去重 guard”只对这一处失效标志例外 | 只读 `git grep "onCleanup\|let stale"`：`80a1892` 的 `frontend/src` 中 0 处，`ae592ba` 中只有 `JobDetailPage.vue` 第 21–23 行这一处 | 一致 |

**结论**：实施没有偏离设计，不需要 r6.12 精度，plan / tasks 的设计文本不改。**这不是需求变更**，不回 Clarify / Gate 1，spec 46 AC 不变。不另开 Checklist R10.1（理由同 Analyze R19 §3，本轮没有出现新的 what / 参数 / 机制）。

## 4. 交给 A 的观察（不是缺口，不新增任务，不预设结论）

- **O-R4A-1（被弃回调的 store 写入照常发生）**：例 1 明确断言离开后 `getStageWorkspace('j-process','process')` 仍执行、store 变为 `ready`。这是 plan【r6.11】写明的“`openJob` 照常调用”。store 迟到写入属于 R4-E（P3，自愈，归 `api` feature），在本授权之外，没有顺手处理。
- **O-R4A-2（Back 2b / 换作业 2d 没有单独用例）**：任务把测试范围固定为 2 + 1 例（离开 / 同作业选阶段 / Chrome 侧栏离开）。2b（浏览器 Back 回列表会卸载详情）与例 1 走同一条 cleanup 路径（组件卸载）；2d（换作业，`params.id` 变化或卸载）与例 2 走同一机制（watch 源变化）。这只是机制推断，本会话没有实测。A 可判断现有证据是否足够。若 A 要求补例，属于范围变化，须按 AGENTS §2 / §5.1 处理，本报告不预设。
- **O-R4A-3（E2E 固定真实等待）**：新 E2E 用 `waitForTimeout(3500)` 是任务原文的要求（“真实等待 ≥ 3500 ms，不装假时钟”）。两次契约读共 3000 ms，从点卡片开始计时，所以余量大于 500 ms。旧代码下的红证明这个用例对缺陷敏感。是否需要更稳的等待写法由 A 判断，本轮不改。
- **O-R4A-4（例 2 的 `replace` 恰一次）**：断言计入的唯一一次 `router.replace` 来自 `selectStage`（用户选择，参数 `stage:'deliver'`），可以证明没有发生回到 `process` 的 canonical replace。这不是放宽断言。

## 5. 状态回写口径

- **T-B04a**：状态改为“**已实施，待 A 新会话增量 Review**”，登记 `ae592ba`、逐命令结果和红 → 绿留痕；原“未开始（可开码…）”保留为当时原文。**不写“已完成”，也不写“R4-A 已关闭”。** 标准 / 命令 / 工时 / 依赖不改。
- **进度**：70 个任务，约 104.5 h；**27 已实施** = 21 已完成（前三批 Review 通过）+ 第四批 5 项已实施（原批次 Review 未通过，不计完成）+ T-B04a 1 项已实施待 A；**43 未开始**。235 / 235；46 AC 最终验收 **0**；feature **未收敛**（43 项未实施 + 第四批与 T-B04a 待 A + H 组外部阻塞）。结构脚本复算见 analyze.md「Analyze R20」。
- **R4-A**：**代码已修，待 A 新会话增量 Review 判定是否关闭**；第四批 Review 维持“未通过”，直到 A 改判。
- **R2-C**：代码经第四批 A 核实，但按原件须本批通过后才能关闭，仍未关。
- **R4-B～R4-E、S-41、R3-B / R3-C 及前两批 P3**：未经风险接受，归属不变。
- **H-x**：
  - H-2·标签 ① 候选 `5c00cf6` 仍是候选，须新 A 复核本批通过后才可转为生产已核；
  - H-2·列表 ① 仍是 `af24c82`；
  - 所有切片 **④ 缺**，页面切片未交付。
  - T-B04a 不改 store，也不改任何交接接口。本修复**不是** v2 集成，也不是整个 feature 交付。
- **合并口径**：按 Walter 的选择，feature 全部完成后再合 main。本轮不 merge main、不 resolve 冲突、不清理目录；Draft PR #12 保持 Draft；main pin `90187f7` 与 R2-D 流程不变。

## 6. 真缺口与待办

- **本任务范围内的代码 / 规格缺口**：**无**。三条标准都有真实代码和实施者命令证据，没有新机制，没有扩范围，也不新增任务或需求。
- **流程待办（不是缺口，也不由本会话完成）**：
  1. **独立 A 增量代码 Review**：须新开会话，与实施者模型不同（按 AGENTS §6 选审核员候选）。固定审 `80a1892..ae592ba -- frontend` 的真实 diff 和本文档提交。重点：
     - R4-A 是否关闭：2a / 2b / 2c / 2d 路径，以及 §4 的 O-R4A-1～4；
     - 修复有没有越出 §5.1 授权；
     - 原 11 / 4 例零改动；
     - 第四批是否可以据此改判。
     下一步是 A 复核，**不需要**用户再次批准 §5.1。A 通过前，不得把 T-B04a / 第四批写成“已完成”，不得关闭 R4-A / R2-C，不得放行 H-2·标签 ①→已核。
  2. A 通过后，按集成人安排登记第四批改判；远端 / Root 文档同步（Root 规格树 `4f11611` 的 HANDOFF §15 备份等）由集成人处理，本轮不碰。
- **既有未决**（不变）：
  - R4-B～E / S-41 / R3-B / R3-C 等 P3；
  - main `072bb12` 同步按 R2-D；
  - H 组受 v2 外部闸门阻塞。

## 7. 结论

- **T-B04a**：实施与 plan §2.1 / §2.3【r6.11】、tasks T-B04a 逐条一致，3 / 3 标准有真实代码和实施者命令证据，旧代码下 2 例组件 + 1 例浏览器的先红后绿属实。**本任务增量已收口，待独立 A 增量 Review。** R4-A 代码已修、待复核，本会话不判关闭。
- **feature**：**未收敛**。27 已实施（21 已完成 + 5 第四批未过 + 1 待 A），43 未开始，46 AC 最终验收 0，H-x 没有一个“已交付”。
- 本报告**不是** Review、Gate 2 或 Handoff。
