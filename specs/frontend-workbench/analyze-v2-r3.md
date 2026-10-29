# frontend-workbench v2 — Analyze R3（定向，恢复修订）

> **模型与通道**：Analyze = `claude-opus-5-5` via `anthropic`。会话由用户以该通道启动；本会话没有探 bridge，也没有改 provider、路由或配置。本会话同时是 R3 修订的 Plan/Tasks 作者，所以本报告只是作者的定向自查，**不代替审核员 A**；A 要新开独立会话复核 R3 落盘提交。
> **更正注记（R5 F-05，2026-10-28；原文不改）**：上行“会话由用户以该通道启动；本会话没有探 bridge”是作者当时的措辞。实际是协调器派出的会话，Opus bridge 最小真实探活因额度 / 限流失败，同模型走 anthropic。另：A 的复核对象不再是“R3 落盘提交”，以 tasks.md v2 第 1.1 节“A 定向复核”行为准。详见 plan.md / tasks.md 页首“R5 修正与更正”行。
> **基线**：`ded7161`（暂停 WIP）加上 R3 修订。R3 修订与本报告在同一提交落盘，提交号用 `git log -1 --format=%H -- specs/frontend-workbench/analyze-v2-r3.md` 查询。
> **范围**：只看 R3 修订，即 tasks.md v2 段、plan.md 页首 / §7.0 / §7.3 / §7.14 的状态补记，以及 `specs/README.md` 本 feature 一行。另外按 v1 正式 Handoff 的真实代码复核外部前置。R2 已关闭的 F-01～F-07 不重审。
> **只读参照**：v1 Handoff = `43b6d79681a49562f41751368b2ae00c24062f56`；互动方 = `8af343f`（已提交的 WIP，含 Checklist R6）；`design/ui/UI_LAYOUT.md`。
> **未执行**：没有安装依赖，没有运行 pnpm / vitest / playwright 或应用，没有启动其他 agent，没有 push。

## 1. 重读的文件

`HANDOFF.md`、`AGENTS.md`、`docs/plan.md`、本 feature 的 spec（页首和 R-002）、plan §7、tasks.md（v2 段全文）、checklist-v2.md（R1 和 R2）、analyze-v2.md / analyze-v2-r2.md 页首、`specs/README.md`。

外部只读核对：`43b6d79` 的 review.md §9 和 tasks.md（T-16、T-17、P3 台账）；`git diff 0ffa15e 43b6d79 -- frontend design`；`43b6d79` 的 `Rail.vue`、`AppShell.vue`、`stores/app.ts`、`PlaceholderPage.vue`、`eslint.config.js`；`8af343f` 的 `HANDOFF.md`、checklist.md（R6 页首）和 plan / tasks 中的关键词。

## 2. 外部前置复核

| 项 | 事实 | 结论 |
|---|---|---|
| v1 Handoff SHA | 只读核对：`gh pr view 7` 显示 MERGED，`mergeCommit.oid` = `43b6d79…`；`git merge-base --is-ancestor 43b6d79 main` 和 `… origin/main` 都成立 | tasks §5 闸门 1 的 SHA 子项已满足，已登记进 tasks 1.1 |
| v1 壳文件事实 | `0ffa15e..43b6d79` 的 frontend 改动只有 12 个文件，都属于 R1-01 精度修复；`design/` 没有差异。v2 第 4 节的壳文件里，只有 `e2e/workbench.spec.ts` 新增了一条用例 | plan §7 以 `0ffa15e` 核对的壳文件事实仍然成立，不需要改设计 |
| 互动方交接 | `8af343f` 的 Checklist R6 通过，但实施仍 BLOCKED。H-x 一项都没交付；plan / Tasks r5 中“未筛选”、`open(jobId`、“同一次导航”、“路由切片”、`ACTIVE_JOB` 的命中数都是 0 | S1 / S2 继续 blocked。见 G-01 |
| 互动方记录的前端事实 | 它的 R6 按 `8920b06` 核对前端；`git diff --quiet 8920b06 43b6d79 -- frontend design` 成立 | 它记录的前端事实在 Handoff SHA 上仍然成立（只作信息，不替互动方判定） |

## 3. 发现

| # | 级别 | 位置 | 发现 | 处理 |
|---|---|---|---|---|
| G-01 | 外部阻塞（不是本 feature 文档缺陷） | plan §7.3；README“跨 feature 待同步事项”第一行；互动方 `8af343f` | 互动方的 plan / Tasks r5 还没有落实壳方的新增要求：H-2 ①～⑤（共享未筛选缓存、ensure/refresh、进行中口径、写 action 交接）、H-3 路由切片先行、H-4 同一次导航内清空、H-5 `open(jobId?)` 快照与容器约定、H-6 整集合替换。`JobTypeLabel`、`JobStatusBadge` 和 `CONTRACT_VERSION='2.0.0'` 已在其 Tasks 中 | 壳不代写。由互动方按其流程回到 Plan/Tasks 并经其 A 复核；拒绝某项要求时报 Walter 裁决。已写入 tasks §9 和 plan §7.0 补记 |
| G-02 | 待 Walter 裁定（阻断 T-V2-01 开工） | plan §7.4“九项换行”；`design/ui/UI_LAYOUT.md#narrow`；v1 P3 H-02 | `#narrow` 规定窄于 980 时“侧栏塌成顶栏横向滚动”。v1 用的是 `flex-wrap: wrap`，plan §7.4 沿用了换行。v1 Handoff 已把这一点登记为 H-02，没有经过 Walter 处置，并注明“v2 规格同样涉及导航，需协调”。spec R-002 / AC-002-6 对两种做法都成立 | 列为 tasks 1.1“待 Walter 裁定”。裁定前不改 §7.4。如果改为横向滚动，属于实质设计修改，要改 plan §7.4 和 T-V2-01，重跑 Analyze，再由 A 复核 |
| G-03 | 集成前置（属于集成人职责） | tasks 1.1、§2 末段 | v2 规格分支还没有合入 `43b6d79`。`git merge-tree --write-tree HEAD 43b6d79` 预演出 4 处冲突：`.gitignore`、`specs/README.md`、`plan.md`、`tasks.md` | 由指定集成人合并：v1 段取 Handoff 版本，v2 段原样保留。涉及语义的冲突解决后回到 Analyze。S0 实施分支必须建在含 `43b6d79` 的基线上 |
| O-1 | 观察 | v1 P3 台账 | H-01（图注断行）和 R1-02～R2-02 都不在 v2 范围内，v2 任务不修也不宣称修复；T-16 / T-17 与 v2 不冲突 | 已写入 tasks §2 R3 补充 |

**本 feature 内部文档**：没有新增 F。

## 4. R3 修订的内部一致性（结构复算，用内存脚本，不落盘）

- spec 相对 `fec3556` 没有改动；`checklist.md`、`checklist-v2.md`、`frontend/`、`backend/`、`design/`、`docs/`、`AGENTS.md` 相对 `ded7161` 都没有改动；tasks.md v1 段（`## v2 任务` 之前）逐字不变。
- 12 个任务，共 22.0 h，每项都在 1～2 h 之间。依赖都指向编号更早的任务，没有前向依赖，也没有环。
- 完成标准数 / 验证命令数：`5/5, 4/4, 3/3, 3/3, 4/4, 4/4, 4/4, 2/2, 4/4, 3/3, 9/9, 3/3`。T-V2-01 新增的标准 5 和命令 5 是 `typecheck && lint`，对应 AC-009-1 的静态打底。
- 每条完成标准都引用 AC。完成标准的 AC 并集为 52 条，missing 和 extra 都为空；矩阵 52 行；矩阵中每个 `T-V2-xx#n` 引用都指向确实写有该 AC 的标准（bad refs 为空）。
- **V2-S10**：已按 `43b6d79` 核实位置——`Rail.vue` 的 `useAppStore` 和 `app`、`stores/app.ts` 的 `ResearchItem`、`PlaceholderPage.vue` 的 `useAppStore` 和 `app`。`eslint.config.js` 启用了 `tseslint.configs.recommended`，所以 T-V2-01 和 T-V2-02 都要跑 lint。已关闭。
- **V2-S11**：T-V2-09 上下文已写明“已知红”的记录要求，窗口开启和关闭由集成人负责。已关闭。
- **V2-S12**：T-V2-04 和 T-V2-07 已显式写出条件依赖。已关闭。
- **AppShell 条件写入**：`43b6d79` 中窄窗导航样式在 `Rail.vue`（`.rail[data-viewport-collapsed='true'] .nav-list`），`AppShell.vue` 只负责 shell 的单列网格。T-V2-01 不写 `AppShell.vue`，它只由 T-V2-07 写。§4 已同步，没有出现新的多写者。
- `git diff --check` 通过。

## 5. 结论

- R3 修订内部一致，没有新增 F。v1 Handoff SHA 已登记并经核验。
- **仍不得 Implement。** S0 还缺四项：A 对 R3 落盘提交的定向复核（闸门 2）；G-02 的 Walter 裁定；集成人、集成验证分支和实施 worktree 的登记；G-03 的合并。S1 / S2 还要等 G-01 解除，并且 H-x 按四项登记完成集成。
- 外部阻塞未解除时，Converge 只能报“未收敛（外部阻塞）”。
