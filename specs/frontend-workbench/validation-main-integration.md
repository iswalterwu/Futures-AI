# frontend-workbench S0 与 main 集成回归验证

> **验证角色**：Implement = `openai/gpt-6-astra via openai`。本会话实测 `PI_PROVIDER=openai`、`PI_MODEL=gpt-6-astra`；协调器新派验证会话，不是审核员 A，也不是 Opus 集成作者。前次真实调用成功（派工记录），本轮无回退、未改 provider / 路由 / 全局配置。
> **日期 / 时间**：2026-10-29，下文时间均为本机 `+04:00`。
> **唯一可写工作树 / 分支**：`D:/2030/Futures-AI-workbench-v2-implement` / `feat/frontend-workbench-v2-s0`。
> **固定验证对象**：`3f632739fc186396221482364cf16e3629b4b24f`。开工实测 HEAD 正确、index / worktree 干净；全部产品测试在该 HEAD 上执行，未修改源码或测试。
> **范围**：仅验证现有 S0 与最新集成 main 的共存结果；不是完整 v2 验收、独立 Review、Gate 2 或正式 Handoff。本报告不记录自身提交 SHA，可用 `git log -1 --format=%H -- specs/frontend-workbench/validation-main-integration.md` 查询。

## 1. 基线、授权与前置阅读

真实 merge 的两个父提交已用 `git show -s --format=%P HEAD` 核对：

| 父提交 | 完整 SHA | 内容 |
|---|---|---|
| 父 1 | `76abe9246fbd6b9bbf2573dbd3751fd8eb022cb7` | S0 实现、原审查与外部阻塞状态 |
| 父 2 | `cf8e11bc1c91149cac233a2f3b5ec6eed4e23caa` | main：H-01 样例图修复、T-19 证据、D-020～D-024 / docs 等 |

已重读本树 main 新版 `AGENTS.md`、`docs/plan.md`、feature `plan.md` 当前 §9 与主线编号迁移说明、`tasks.md` v2 段、`checklist-v2.md` 当前 R4、`review-v2-s0.md`、`merge-main-cleanup.md`、`handoff-v2-s0.md`，以及 main H-01 / M-08 的 plan 说明。R4-C01～C11 全部已勾、无阻断；这是既有 S0 设计闸门证据，不是本会话的审核结论。所有清单只读。

用户最新授权是把**现有 S0 阶段**合入 main 并由协调器清理本会话衍生目录；旧记录的暂停 / 不建议合入不是本轮验证阻塞。根 `HANDOFF.md` 属于 main 的 agent 工作流重塑交接，不作为本 feature 未授权阻塞。本会话仅执行回归与本地报告提交；未派 agent、未操作其他工作树、未 push / 开 PR / merge main / 删除目录或分支。

## 2. 本轮真实命令与结果

环境：Windows，Node `v25.2.1`，pnpm `11.21.0`，Vitest `5.0.5`，Vite `8.3.5`；浏览器由既有 Playwright 配置使用本机 Chrome，H-01 实际输出版本 `156.0.8078.49`。

| 命令 / 检查 | 开始 → 结束（2026-10-29，+04:00） | exit / 结果 |
|---|---|---|
| 端口与本树进程预检（PowerShell `Get-NetTCPConnection` / `Get-CimInstance Win32_Process`） | 08:40:16 起 | exit 0；4173 LISTEN = 0，本树路径匹配的 `node.exe` = 0 |
| `pnpm -C frontend install --frozen-lockfile` | 08:40:26 → 08:40:28（含版本查询） | exit 0；`Already up to date`，pnpm 安装耗时 362 ms；package / lock 未变 |
| `pnpm -C frontend test` | 08:40:37 → 08:42:13 | exit 0；六守卫、typecheck、lint、unit/component、E2E 全部通过 |
| `pnpm -C frontend build` | 08:42:21 → 08:42:28 | exit 0；类型检查与生产构建成功，828 modules transformed；Vite 构建 635 ms |
| 端口与本树进程收尾检查（同预检） | 08:42:43 起 | exit 0；4173 LISTEN = 0，本树路径匹配的 `node.exe` = 0 |
| Git 保护范围 / 归档 / 空白核查（只读 Python 调用 Git，内存断言） | 08:43:12 → 08:43:13 | exit 0；见 §4 |

### 2.1 全量 test 的实际计数

原有脚本原样执行 `check && typecheck && lint && test:unit && test:e2e`，未传过滤条件、未跳守卫、未修改 expect / 测试 / 配置：

- **六守卫**：generated、colors、glass、updown、grid、network 全部 passed。
  - generated：156 tokens / 5 artifacts 对拍一致；契约 12 methods / 10 events / 2 artifacts，后续 Git 检查确认生成物未变。
  - colors：24/24 positive samples、0 negative hits。
- **typecheck / lint**：`vue-tsc --noEmit`、`eslint . --max-warnings 0` 均成功。
- **unit/component：14/14 文件，564/564 tests passed**，Vitest 报告耗时 5.20 s。既有 `tests/**/*.spec.ts` 全量 include，包含 `design-registry.spec.ts` 的 UI_NAV / registry 检查；没有另写或替代 registry 测试。
- **E2E：70/70 passed**，9 workers，Playwright 报告耗时 1.2 min；无 failed / skipped 报告。

### 2.2 main H-01 与 S0 在同一轮实际合跑

不是由历史计数推算：本轮 `test.log` 明确列出下列成功结果。

| 范围 | 实际输出中的通过用例 |
|---|---|
| main H-01 | `theme.spec.ts:62:3`：`AC-001-4 AC-006-3 H-01 caption stays inline without changing other numeric layouts at 1440` 和 `... at 960`，**两条均 passed**；实际 capture 输出分别为 1440×900、960×900、mock normal、figcaption |
| S0 导航 | `shell.spec.ts` 九项顺序与 owner、八个非工作台路由直达 / 刷新、daily 深链；`agent.spec.ts` 九路由底栏可见 |
| S0 窄窗 | `AC-002-6 v2-nav 960` 与 `979` 两条 passed（nowrap、single row、contained overflow、reachable settings）；既有 breakpoints 用例同跑通过 |
| S0 加载 | `AC-002-7 v2-boot loading displays three-step progress...` 及两条 boot-error / retry 路径 passed |
| 既有样例图 / 主题 | 60-day series、resize / dispose、transparent background 用例同跑通过 |

旧 `implementation-v2-s0.md` 的 **564 + 68** 只是旧 S0 证据；本轮亲跑结果是 **564 + 70**。本轮不重新制造 red/green、不补人工验收，也不把本次 H-01 测试生成的图注截图当作 T-19 整图补采或 Walter 人工签字。

### 2.3 build 告警

输出：HTML 2.42 kB（gzip 1.15 kB）、CSS 31.23 kB（gzip 5.83 kB）、JS **779.98 kB（gzip 263.11 kB）**。唯一构建告警为 minification 后部分 chunk 超过 500 kB；没有调整阈值或拆包。构建成功不代表该告警已解决。

## 3. 服务与产物边界

- 预检用 `Get-NetTCPConnection -State Listen` 过滤 `LocalPort -eq 4173`；无监听才执行安装 / 测试。未杀任何进程，未复用他人服务。
- Playwright 原配置未变：`pnpm dev --port 4173 --strictPort`、`reuseExistingServer: false`、`127.0.0.1:4173`。Vite 服务只由测试框架启停，本会话没有另启开发服务器。
- 收尾以相同端口查询，并用 `Get-CimInstance Win32_Process` 过滤 `node.exe` 且 CommandLine 包含本工作树名：两项均为 0。本树没有 Vite / Playwright Node 残留，未停止其他会话进程。
- `git status --short --ignored` 仅有三个 ignored 目录：`frontend/node_modules/`、`frontend/dist/`、`frontend/test-results/`。它们保持 ignored，不入库、不由本会话删除；H-01 自动图注截图留在测试输出目录。
- 原始日志仅放本会话独占 Temp：`C:/Users/iswal/AppData/Local/Temp/futures-fw-main-validation-01a185f4/`（`preflight.log`、`install.log`、`test.log`、`build.log`、`postflight.log`、`invariants.log`、`historical-whitespace.log`）。仓库只存本摘要，不复制完整日志。

## 4. 不变性与空白检查

测试 / build 完成后、写本报告之前实测 `git status --porcelain` 为空，`git diff --exit-code 3f632739fc186396221482364cf16e3629b4b24f -- .` exit 0：**所有已有 tracked 文件（含源码、测试、锁定件、生成物与文档）均未变**。随后仅新增本报告。

额外对 merge 固定对象的只读检查全部通过：

1. **main 保护路径**与 `cf8e11b` 一致：`SampleChart.vue`、`e2e/theme.spec.ts`、`docs/`（含 D-020～D-024）、`backend/`、`AGENTS.md`、`.gitignore`、根 `HANDOFF.md`、`frontend/package.json`、`frontend/pnpm-lock.yaml`、feature `assets/`（含 T-19 整图 / 元数据）、`review-h01.md`、`review-m08.md`。
2. **历史原件**与 `76abe92` 一致：冻结 `spec.md`、两份 checklist、三份 S0 原报告 `implementation-v2-s0.md` / `converge-v2-s0.md` / `review-v2-s0.md`、`session-artifacts/`；自然也与开工 `3f63273` 一致。
3. `git diff --name-only cf8e11b HEAD -- frontend design` 正好是已登记的 **12 个 S0 路径**。在这 12 路径内对比 `76abe92`，只有 `design/ui/UI_NAV.md` 一对增删行；内存逐行验证仅将 `§7.4` 改为 `§9.4`。其余 11 路径未变。main 带来的 H-01 产品代码 / 测试保持原样，不误称整个 frontend 相对父 1 无变化。
4. `git diff --check` exit 0；`git diff --check cf8e11b HEAD -- . ':(exclude)specs/frontend-workbench/session-artifacts/**'` exit 0。
5. 为明确排除边界，另跑未过滤的 `git diff --check cf8e11b HEAD`：exit 2，恰 **3 个既有 trailing whitespace**，全部在原样归档：`20261028-pause/futures-fw-v2-analyze-fixes-opus-20261028.md:16`、`futures-fw-v2-tasks-opus-20261028.md:351,371`。归档已证明与父 1 完全一致，未修剪原件；这不是本轮新引入的空白问题。

## 5. 结论与仍未闭环事项

**通过：固定 merge `3f63273` 上现有 S0 与 main H-01 的全量前端集成回归 / build；仅此证据范围。** 本轮没有失败后换模型、修改实现、删除测试、换 expect 或绕过守卫。

- H-x 八个交接单元仍未交付；T-V2-03～12 仍 blocked，完整 v2 仍为“未收敛（外部阻塞）”。本结果不能代替 T-V2-11 / T-V2-12 或 52 条 AC 全量验收；未接线的投放按钮不宣称满足 AC-002-8。
- S0 **P3-1 加载百分比长小数**仍未修复、未获最终风险接受；v1 P3 / H-02 不在本轮关闭。构建大 chunk 告警仍保留。
- M-01～M-12 人工勾选未改；没有补拍人工验收截图，没有代 Walter 批准。
- 本会话不是独立集成 Analyze / Converge 或 A 复核，不给这些阶段预写结论；v2 最终 Review / Gate 2 / 正式 Handoff 均未完成。
- 全部规定验证成功后，只允许为本报告创建本地提交 `test(frontend-workbench): verify S0 integration with latest main`。后续独立复核、PR / merge 与目录清理由协调器安排，本会话不执行。
