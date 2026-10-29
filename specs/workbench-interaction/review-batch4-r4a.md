# Feature: workbench-interaction 增量代码 Review — T-B04a（R4-A 最小修复）（review-batch4-r4a.md）

> **性质**：AGENTS §2 第 10 步 Review 的**定向增量评审**，只审 T-B04a 一项、只判 **R4-A 是否关闭**以及第四批 5 项任务是否可据此改判。**不是**全 feature 最终 Review、**不是** Gate 2、**不是** Handoff；不勾 checklist、不改代码 / 测试 / fixture / spec / plan / tasks / 旧 Review（`review-batch4.md` 原件 `9812f64`，本树 blob `0c04f6ad11830aa458ff8b6d33d317d9d61fe947`，保持 immutable）/ Converge / docs / README / HANDOFF；不替作者修代码、不代 Walter 做风险接受、不代 v2 接收方签收 ④、不造“小批 Gate 2”。原件 §0 / §7 中“Gate 2 待 Walter 三选一”的程序建议已由当前 docs（plan r6.11 生效行、Analyze R19、implementation-log §17）按 §5.1 工程审批口径纠偏，本评审按纠偏后的口径工作，不修改原件。
> **审核员 A（脱敏）**：`claude-fable-5-1` **via anthropic**（官方通道；`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`、PI_SESSION_ID `01a188f3-5e82-71d7-950a-7cdff74d3042`）。本协调窗口 bridge 已确认额度耗尽且无重置证据，按 AGENTS §6 规则 2 / 5 不重试；**fable 未单独探 bridge，不声称探过**；官方通道近期 probe 与实际任务均成功，本评审全程走官方通道。只换通道、不换模型；未改 provider / key / 路由 / 全局配置；不因测试结果或判定换模型。新会话（旧 A 会话 `01a1881e…` 早已结束），与 Implement（`openai/gpt-6-astra`，会话 `01a188e0…`，会话日志只含该模型）异模型，与 Converge（`claude-opus-5-5`，`01a188e8…`）隔离。
> **固定输入**：复用只读审核工作树 `D:/2030/Futures-AI-interaction-review-batch4`，branch `review/workbench-interaction-batch4-code`，HEAD `11a467fba775e1f3448fa306056e0fc2aeba0fb6`（起始 `git status --short` 为空）。受审代码 = `git diff 80a189264428f4b011279e4ebf1cc980e9656d14..ae592ba23b086dd5887a269e842f80c96ad16fb2 -- frontend`：**3 文件、+72 / −2**（`src/jobs/pages/JobDetailPage.vue` +4 / −2；`tests/component/jobs/job-detail.spec.ts` +54；`e2e/jobs/detail-stage.spec.ts` +14），`git diff --check` 通过；`ae592ba..11a467f -- frontend` **零差异**（本会话核；该区间只有 6 个 specs 文档 +270 / −5）。`git diff --stat 6c082fd HEAD -- frontend` 亦只含这 3 个文件 +72 / −2。授权提交 `80a1892`（Walter 原话“那就先修P2等全部工作完成后，再合入main”= R4-A 最小修复的 AGENTS §5.1 单独批准；不是风险接受、不是提前 Gate 2）。有效 Checklist **R10** 原件 `37e2f71`，本树 `checklist.md` blob = `4537c55f226f0bdc4f39b19e7c369731cf23abba`（26 / 26，只读未改，不另开 R10.1）。冻结 spec blob `102af73…`，LF 归一化 SHA256 `ed0f6c6c3e50b931…`（与 Analyze 登记一致）。
> **重新读取**（不依赖会话记忆）：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`；冻结 spec（AC-002-2 / AC-008-2 / AC-009-1）；plan.md 页首 r6.11 草案行 + 生效行、§2.1【r6.11】、§2.3【r6.11】；tasks.md 页首当前块、**T-B04a 全文（状态 / 性质 / 依赖 / 上下文 / 修改范围 / 3 条完成标准 / 3 条验证命令原文）**、T-B04 状态行、T-G09、§5 AC-002-2 行、§6 r6.11 行；checklist.md R10（只读）；analyze.md「Analyze R19」「Analyze R20」；implementation-log §17 / §18；interface-handoff 页首；`review-batch4.md` 全文（R4-A §3 位置 / Chrome 复现 2a～2d / §5.1 三项依据 / 最小方案；R4-B～R4-E；§5 R2-C 条件；§2 其余四任务判定）；`converge-batch4-r4a.md` 全文（含 O-R4A-1～4）；`git show 80a1892`、`git diff 80a1892 ae592ba -- frontend` 全文；`ae592ba` 上 `JobDetailPage.vue` 全文、`job-detail.spec.ts` 既有 harness（`beforeEach` / `afterEach` / `connect()` / `mountDetail()`）、`detail-stage.spec.ts` 原 4 例、`stores/jobs.ts` `openJob` / `readDetail` / `refresh`、`jobs/routes.ts`、`contracts/mock/index.ts` `delayScenario`（1500 ms）只读作旁证；`@vue/reactivity@3.5.44` 的 `watch` cleanup 实现（`cleanup = effect.onStop = …`，只读核 onCleanup 在 stop / 重跑两条路径均被调用）。实施者原始日志 `astra-red-unit.log` / `astra-red-e2e.log` / `astra-session` 只读核对红证据。
> **边界**：唯一改动文件 = 本文件（`?? specs/workbench-interaction/review-batch4-r4a.md`）。本树原有 `frontend/node_modules/`（gitignore）直接复用，未安装、未改锁 / config、未下载浏览器（用本机既有 `channel: 'chrome'`）。E2E 产物与只读浏览器探针只写 `C:/Users/iswal/AppData/Local/Temp/wi-r4a-fix-01a18388-bdy5e3x0/review-e2e-results/` 与 `review-probe/`（`playwright.config.ts` 导入本树配置、`testDir` 指向 Temp、`webServer.cwd` 指向本树 frontend；`probe.spec.ts`；`probe-results.log`；**非产品测试，不计入 30 条正式 E2E**）。不清理共享 tmp、不记凭证。未 commit / push / PR / merge，未派生 agent，未写其他 worktree，未保留服务（每次 E2E / 探针前后 4173 均无 LISTEN）。
> **日期**：2026-10-29（+04:00）。

## 0. 判定

**本增量通过**（0 P1 / 0 P2 / **0 新 P3**；无新发现）。**R4-A 关闭**：原件 §3 点名的三条关键路径（2a 侧栏离开、2b 浏览器 Back、2c 同作业缓存下选“交付”）以及 2d 换作业，在 `ae592ba` 上经本会话真实 Chrome 独立重现，**均不再发生**（§4）；修复恰为原件 §3 给出的约 3～5 行 `onCleanup` 失效标志，没有越出 Walter §5.1 批准与 plan §2.1【r6.11】的范围（§2）；两例组件回归 + 一例真实 slow E2E 在旧生产代码下确有红证据、修复后期望未改（§3）。

**据此改判**：第四批 Review（`review-batch4.md` 原件 `9812f64`）的唯一 P2 已修并经独立复核，原件 §2 对 T-B01 / T-B02 / T-A22d / T-B04 / T-B03 五项完成标准“代码层全部成立”的判定未被本增量改变（这五项的代码 `6c082fd` 自原 Review 后未改，`6c082fd..ae592ba -- frontend` 只含本修复 3 文件），按 AGENTS §2 第 10 步规则（仅 P3 = 通过），**第四批 5 项 + T-B04a 补修可判技术通过**；原 4 项 P3（R4-B～R4-E）依旧开放、承接不变、未经风险接受。**R2-C**：原件 §5 的关闭条件为“本批通过”，现条件成立，**R2-C 按实际技术关闭**（代码修正已由原 A 逐值核实，本会话复跑 badges 48 / colors / glass 通过）；这是批次技术闭合，**不是** Gate 2，全 feature 最终 Review / Gate 2 仍在未来。

**不改变的事实**：46 AC 最终验收仍 **0**；feature **未收敛**。本结论生效后可由集成人记 **27 / 70 已完成**（21 + 第四批 5 + T-B04a 1）、43 未开始、235 / 235，本会话不改其它 docs。四阶段工作区 C–F 仍为占位，页面功能未全完成；B05 / B07 / A14+ / A18 / A21 / G02 / G04 均未实现，不冒称完整。S-41（创建者展示，T-B05 开工前承接）、R3-B / R3-C 及前批 P3 **未经风险接受**、不在此假关。所有 H-x **④ 仍缺**；H-2·标签 ①候选 `5c00cf6` ② R10 `37e2f71` ③ 本会话复跑 badges 48 等 — 本批通过后 ① 可转“生产已核”，但 ④ 消费方集成 SHA 仍未取得，**不等于交付**。合 main / 清目录 / Draft PR #12 / main pin `90187f7` 与 R2-D 同步边界不在本评审范围，均不动。

## 1. 独立亲跑证据（本会话执行，固定代码 `ae592ba` 的前端树 = HEAD 前端树）

| 命令 | 本会话结果 | 实施者数字（tasks T-B04a 状态行 / converge-r4a §2） | 一致 |
|---|---|---|---|
| **命令 1** `test:unit tests/component/jobs/job-detail.spec.ts -t "WI R4-A"` → 整文件 | **2 passed**（11 skipped / 13）→ **13 passed**（原 11 + 新 2） | 2 → 13 | ✓ |
| **命令 2** `test:e2e e2e/jobs/detail-stage.spec.ts -g "WI R4-A"` → 四份 E2E `shell / agent / jobs/detail-stage / jobs/list-create` | **1 passed**（8.8 s，真实 Chrome slow）→ **30 passed / 0 failed**（1.0 min；shell 17、agent 7、detail-stage 原 4 + 新 1、list-create 1；Playwright 自管 4173，前后无 LISTEN；只加 `--output <本 Temp>`，配置不变） | 1 → 30 | ✓ |
| **命令 3** `test:unit && typecheck && lint && git diff --stat 6c082fd HEAD -- frontend` | **34 files / 1020 passed / 0 failed**；`vue-tsc --noEmit` exit 0；`eslint . --max-warnings 0` exit 0；diff --stat = 上述 3 文件 +72 / −2 | 34 / 1020 / 0；通过；三文件 | ✓ |
| `pnpm check`（六守卫） | tokens 156 / 5 artifacts match；contract 24 / 10 / 2 generated；generated / colors（24 / 24 正样本、0 负命中）/ glass / updown / grid / network 全 passed；之后 `git status` 仍 clean | 通过 | ✓ |
| `pnpm contract --check` | `24 methods, 10 events, 2 artifacts match` | 24 / 10 / 2 | ✓ |
| `tests/unit/jobs/routes.spec.ts` + `session-context.spec.ts` | **17 passed** | 17 | ✓ |
| `jobs-store.spec.ts -t "WI H-2"` | **27 passed**（16 skipped） | 27 | ✓ |
| `badges.spec.ts` / `job-list.spec.ts` | **48** / **12** | 48 / 12 | ✓ |
| v1 三份契约 `contracts / contract-doc / mock.spec.ts` | **88 passed**（可选重跑） | 第四批 A 88 | ✓ |
| `real-stubs.spec.ts` | **23 passed**（可选重跑） | 第四批 A 23 | ✓ |
| `git diff --check 80a1892 ae592ba` | exit 0 | 通过 | ✓ |

**未跑**（如实登记）：其余 7 份 E2E、全量 `pnpm -C frontend test`（属 T-G09）、人工截图（T-G10）、后端测试；任何 46 AC 的**最终**验收。本会话没有在旧生产代码上重跑红例（会改动只读树），红证据取自实施者原始日志并逐行核对（§3）。

## 2. 逐条完成标准 → 真实代码 → 亲跑（T-B04a）

| 标准 | 真实代码证据（本会话读 `ae592ba`） | 亲跑 | 判定 |
|---|---|---|---|
| **1** 组件：`WI R4-A` 两例通过（离开后不被拉回；同作业读期间选的阶段不被改回）；整文件原 11 + 新 2，原例零删改 | 例 1：`connect('slow')` + 假时钟，`mountDetail('/jobs/j-process')` 后 `loading`、`getJob` 恰一次；推进 1 ms 后 `router.push('/prices')` 经 RouterView 卸载详情；推进 3500 ms 后断言 `getStageWorkspace('j-process','process')` 恰一次（被弃回调的 `openJob` 照常完成）、store `ready`、路由仍 `/prices`、`router.replace` **未调用**。例 2：先 `/jobs/j-process/process` 到 ready → 离开 → 再 push `/jobs/j-process`（`getJob` 一次、`getStageWorkspace` 零次、仍 ready、StageRail 可见 = 缓存路径）→ 1 ms 后点第 4 个按钮“交付”→ `/deliver` + `aria-pressed` 交付 → 推进 3500 ms 后 workspaces 序列 `[process, deliver]`、路由仍 `/deliver`、pressed 仍交付、`replace` **恰一次且参数为 `stage:'deliver'`**（来自 `selectStage`，不是 canonical）。原 12048 字节为新文件逐字节前缀（本会话 `git show` + `cmp`，SHA256 `74d3fe50…20c4d`） | 2 / 13 | **满足** |
| **2** 端到端：`WI R4-A` 一例真实 Chrome slow 通过；四份 E2E 原 29 + 新 1；原 4 例不改 | 新例：`/jobs?scenario=slow` → 等卡片可见后点 j-process（`/jobs/j-process`）→ 断言阶段导航尚未出现（仍在读）→ 点侧栏“价格”→ `/prices` → `waitForTimeout(3500)`（任务原文要求真实等待 ≥ 3500 ms、不装假时钟）→ 仍 `/prices`。等待的是 SPA 内离开，不是整页 reload 销毁 realm；两次契约读从点卡片起共 3000 ms，等待从到达 `/prices` 之后起算，余量 ≥ 500 ms。原 2266 字节为逐字节前缀（SHA256 `1a3d5f4d…fe4d4`）；`playwright.config.ts` 未改、无窗口钩子 | 1 / 30 | **满足** |
| **3** 全量单测原 1018 + 新 2 无删改；`6c082fd..HEAD -- frontend` 只含三文件；工程门 | 两测试文件均为“原前缀 + 追加”；`git grep "onCleanup\|let stale" ae592ba -- frontend/src` 只命中 `JobDetailPage.vue` :21–23 | 34 / 1020 / 0；typecheck / lint / check / contract 通过；diff --stat 三文件 | **满足** |

**授权范围核**（§5.1 批准 = plan §2.1【r6.11】原文）：生产 diff 共 6 行 — 签名 `async ([id]) =>` → `async ([id], _old, onCleanup) =>`；`await` **之前**同步新增 `let stale = false` 与 `onCleanup(() => { stale = true })`；canonical replace 条件前加 `!stale`。`openJob` 仍无条件调用并等待；`selectStage`、模板、三态、详情头、`<style>`、imports、`{ immediate: true }` 逐字节不变。store（不清锚 / 不取消 / 无序号 / 锁 / 比较去重）、query 透传（R4-B）、R4-E 迟到写入、routes / session / main / 契约 / shared / app / 配置均零差异。**在批准范围内，非 scope 扩张**。

**机制核**（只读 `@vue/reactivity@3.5.44`）：`onCleanup` 注册的函数在两条路径被调用 — watcher 因源变化重跑前（`cleanup()`）与 watcher 停止时（`effect.onStop`，组件卸载触发 scope stop）。因此离开详情（卸载）、Back（卸载）、同作业换 stage（`params.stage` 变）、换作业（`params.id` 变或卸载）四种情形都会置 `stale`。**不会误抑制合法 canonical**：源比较逐值 `hasChanged`，同值重导航 / 仅 query 变化不触发重跑；首次 `immediate` 调用同样拿到 `onCleanup`，无人离开时 `stale` 保持 false；canonical replace 本身触发的再跑只会对已完成的回调置标志，无副作用。

## 3. 红 → 绿证据（实施者原始日志，本会话逐行核对）

- `astra-red-unit.log`（旧生产代码 + 新测试）：`job-detail.spec.ts (13 tests | 2 failed | 11 skipped)`；:245 `expected '/jobs/j-process/process' to be '/prices'`（= 2a）；:276 `expected '/jobs/j-process/process' to be '/jobs/j-process/deliver'`（= 2c）。行号与 `ae592ba` 文件一致。
- `astra-red-e2e.log`：`detail-stage.spec.ts:40:1 › WI R4-A …` 1 failed，:51 `Expected "…/prices"`、`Received "…/jobs/j-process/process"`（= 2a，真实 Chrome）。
- `astra-session/*.jsonl` 只含 `"model":"gpt-6-astra"`（26 处），无其它模型。
- 修复后同一组测试在本会话亲跑全绿（§1），测试期望未改（前缀 + 追加核对）。三条红证据分别准确对应原件 §3 的 2a / 2c / 2a，证明测试对缺陷敏感、不是假绿。

## 4. 只读浏览器探针（真实 Chrome，本 Temp `review-probe/`，6 / 6 通过；完整时间线 `probe-results.log`）

| 探针 | 原件路径 | 本会话观察（`ae592ba`） | 结论 |
|---|---|---|---|
| P-2a 侧栏离开 | 2a | 点卡片（`/jobs/j-process`，history 3）→ +63 ms 点“价格”（`/prices`，history 4）→ 等 4000 ms：**URL 仍 `/prices`、history 仍 4、无任何 `/jobs/j-process/process` 导航事件**；Back → 回到 `/jobs/j-process`（历史记录完好，未被 replace 覆盖） | 不再发生 |
| P-2b 浏览器 Back | 2b | 点卡片 → +15 ms Back → `/jobs?scenario=slow`，history 3 → 等 4000 ms：**URL 仍为列表、无迟到导航**；Forward → `/jobs/j-process` → ~3 s 后 canonical `/process`（**新实例的合法 canonical 未被误抑制**）；再 Back → `/jobs?scenario=slow`（**不再弹到 `about:blank`**） | 不再发生 |
| P-2c 同作业缓存选“交付” | 2c | 首次进入到 `/process` ready → Back → 再点卡片（`/jobs/j-process`，轨道 < 500 ms 即可见 = 缓存）→ 点“交付”→ `/deliver`；采样 7000 ms：**状态始终 `/deliver | pressed=交付`，零次出现 `/process`**；结束时 `aria-pressed` 交付、`aria-current` 处理、“交付工作区”可见 | 不再发生 |
| P-2d 换作业 | 2d | j-process（无 stage）→ Back → 点 j-failed → `/jobs/j-failed` → +3 s canonical `/jobs/j-failed/analyze`；**无 `/jobs/j-process/process` 导航事件**；中间 ~17 ms 采样到 `/jobs/j-failed | h1=j-process 标题`（被弃回调的 store 迟到写入，随后自愈）= 原件 **R4-E（P3，已登记，自愈）**，不是新发现、本修复按授权不处理 | 劫持不再发生；R4-E 依旧 |
| P-legit slow 深链 `/jobs/j-process?scenario=slow` | 合法首次 canonical | +6.4 s（含启动）canonical 到 `/process`、pressed 处理 | 未被误抑制 |
| P-legit normal 点阶段 + reload + Back | AC-002-2 正常路径 | 点“分析”→ `/analyze` → reload 仍 `/analyze` pressed 分析 → Back → `/jobs` | 正常 |

探针不是产品测试，不写入仓库，不计入正式 30 条 E2E；Back / 换作业两条路径按 Converge O-R4A-2 的机制推断由本会话实测确认，不要求补产品用例（补例属范围变化，本评审不提出）。

## 5. 发现

**无新发现**（0 P1 / 0 P2 / 0 新 P3）。以下为核过、**不记为发现**的点：

- **O-R4A-1**（被弃回调仍写 store）：按 plan【r6.11】“`openJob` 照常调用”与授权“不改 store”，属 R4-E 既有 P3；mock 同延迟下先发先完成、自愈；真实 `api` 乱序归 `api` feature（plan §2.3【r6.10】）。不借本修复 codefix。
- **O-R4A-3**（E2E 固定 3500 ms 真实等待）：为 tasks T-B04a 原文明定；时序分析见 §2 标准 2；旧代码下红证明其敏感。接受。
- **O-R4A-4**（例 2 `replace` 恰一次来自 `selectStage`）：断言精确到参数 `stage:'deliver'`，可区分用户选择与 canonical，不是放宽。
- 回调中的 `_old` 未用参数：lint `--max-warnings 0` 通过，为 Vue watch 签名所需，不是问题。
- 架构风险 / 目标对齐：修复只在页面回调内加“完成后检查自身是否仍有效”的最小边界，未引入全局机制；与冻结 spec v1.1（46 AC 不变）、plan r6.11、tasks T-B04a 一致；AGENTS §5：复杂度有具体出错方式 / 概率 / 代码量依据且经 Walter 批准（§5.1），无提前抽象（§5.3），未引入新工具（§5.7），测试用真实 Pinia / router / mock client 边界 spy（§5.6）。

## 6. P3 台账（本评审不改归属；均未经风险接受）

| 项 | 状态 | 承接 |
|---|---|---|
| **R2-C**（review-batch2） | **技术关闭**（条件“本批通过”已成立） | — |
| **R4-A**（P2） | **关闭**（T-B04a `ae592ba`，本评审） | — |
| R4-B（query 不透传） | 开放 | T-G01 / T-G05 阅读提示；壳级透传归 v2 Clarify / candidates |
| R4-C（创建面板初始 alert） | 开放 | T-G10 M-01 |
| R4-D（同作业旧错误先显示） | 开放 | 下次 plan 精度 / T-B05 开工前 |
| R4-E（store 迟到写入，自愈；本会话 P-2d 再次观察到 ~17 ms） | 开放 | `api` feature（plan §2.3【r6.10】） |
| S-41（创建者展示） | 开放 | T-B05 开工前精度轮 |
| R2-D / R2-E / R3-B / R3-C、R-A～R-F 残留 | 本增量不涉及 | 归属不变（implementation-log §8） |

## 7. H-x（只记录，不签收）

- **H-2·标签**：① 候选 `5c00cf6`（`ebce4c8` 并存）；② R10 `37e2f71`（blob `4537c55…`）；③ 本评审亲跑 badges 整文件 48 / colors / glass / typecheck / lint 通过（原第四批 A 另有 18 / 9 / 21 分组证据）；**本批通过后 ① 可转“生产已核”**；④ **缺**（待消费方集成登记）。
- **H-2·列表**：① 仍 `af24c82`；`WI H-2` 27 本评审复跑通过；④ 缺。
- **页面切片**：T-B01 / B02 / B04 / B03 本批技术通过；C 组未开始、`intake.spec.ts` 不存在 → **未交付**。
- H-1 / H-3 / H-4 历史证据保留；H-5 未做；H-6 缺 T-A21。所有切片 ④ 全缺。

## 8. 结论与下一步

1. **判定：本增量通过（0 P1 / 0 P2 / 0 新 P3）。R4-A 关闭；R2-C 技术关闭；第四批 5 项 + T-B04a 可判技术通过**（原件 `9812f64` 不改，其对其余四任务的判定与 4 项 P3 原样保留）。
2. 集成人可据此记 27 / 70 已完成、43 未开始；回写 tasks / README / implementation-log / interface-handoff 由集成人完成，本会话不改。H-2·标签 ① 可转生产已核，④ 仍缺。
3. 本评审**不是** Gate 2 / Handoff；46 AC 最终验收仍 0；feature 未收敛；合 main 按 Walter 选择等全部工作完成后再做；Draft PR #12 保持 Draft；不清目录。
4. 本评审未 commit；本树 `git status --short` 仅 `?? specs/workbench-interaction/review-batch4-r4a.md`；`ae592ba..11a467f -- frontend` 零差异；`git diff --check` 通过；探针与 E2E 产物只在本 Temp；4173 无遗留 LISTEN。

## 验收证据（本增量）

- 测试命令输出摘要：§1（命令 1 = 2 → 13；命令 2 = 1 → 30 / 0；命令 3 = 34 / 1020 / 0 + typecheck + lint + 三文件 diff；六守卫 / contract 24 / 10 / 2；routes + session 17；H-2 27；badges 48；job-list 12；v1 契约 88；real-stubs 23）。
- 红证据：§3（实施者日志：组件 2 failed :245 / :276、Chrome 1 failed :51；期望未改）。
- 浏览器探针：§4（2a / 2b / 2c / 2d 不再发生；合法 canonical / 阶段点击 / reload 正常；R4-E 仍可观察、自愈）。
- Converge 报告结论：`converge-batch4-r4a.md` 判“本任务增量已收口、待独立 A 增量 Review”；本评审核对其 §1 diff 事实（前缀 SHA、三文件、零差异）、§2 三标准证据、§3 对拍成立；§4 O-R4A-1～4 独立判定均不构成发现。
- Gate 2 记录：**不适用**（本评审为批次增量 Review，非 Gate 2）。
