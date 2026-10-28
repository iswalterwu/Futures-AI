# Feature: frontend-workbench v1 评审记录（review.md）

> **当前状态（2026-10-28，T-19 独立 Review）**：独立 A（claude-fable-5-1 via anthropic）对 `167b337` 定向 Review **通过**（0 P1 / 0 P2 / 1 P3，A-M08-P3-1 待 Walter 裁定），原件 [review-m08.md](review-m08.md)、记录 §17；**本轮 Gate 2 待 Walter 明确批准**，未 Handoff；A-H01-P3-1 已补采、待 Walter 复核 M-08，未关闭。M-01 ~ M-08 仍待 Walter 人工复核；H-02 留待 v2、未修复。

> **（Converge 时点指针）当前状态（2026-10-28，M-08 整图证据补采）**：T-19 已补采修复后 1440 整图（`bf04f69`），Converge 判定 T-19 证据补采范围已收敛（§16、[converge.md §10](converge.md)）；**待独立 A Review，本轮 Gate 2 未发生**；A-H01-P3-1 未关闭。M-01 ~ M-08 仍待 Walter 人工复核；H-02 留待 v2、未修复。

> **（规划时点指针）当前状态（2026-10-28，M-08 整图证据补采 in-progress）**：H-01 已经 PR #8 合并（§13 ~ §14，历史已批准）；本轮 T-19 只补采修复后 1440 整图（A-H01-P3-1），已规划、未采集（§15）；本轮 Gate 2 未发生。M-01 ~ M-08 仍待 Walter 人工复核；H-02 留待 v2、未修复。

> **（H-01 Handoff 时点指针）当前状态（2026-10-28，H-01 修复 Handoff）**：Walter 2026-10-28 对本轮 Gate 2 回复“好的”——**本次 H-01 修复 Gate 2 已批准**，A-H01-P3-1（1440 整图补采）接受为后续、尚未补采（§13）；Handoff 记录见 §14，PR：[iswalterwu/Futures-AI#8](https://github.com/iswalterwu/Futures-AI/pull/8)。M-01 ~ M-08 仍待 Walter 人工复核；H-02 留待 v2、未修复；11 项旧 P3 未修复。

> **（Review 时点指针）当前状态（2026-10-28，H-01 修复 Review）**：独立审核员 A（claude-fable-5-1 via anthropic）对固定目标 `869cb71` 定向 Review **判定通过**（无 P1 / P2，1 项 P3-1 待 Walter 处置），原件见 [review-h01.md](review-h01.md)、记录见 §12；**本次修复 Gate 2 未批准，待 Walter 明确批准**；P3-1 未补采、未被接受为后续；H-02 留待 v2、未修复；M-01 ~ M-08 仍待 Walter 人工复核。未进入 Handoff。

> **（Converge 时点指针）**：T-18 已实施（`771f2af`），Converge 判定 H-01 修复的实现与自动化验证范围已收敛（§11、[converge.md §9](converge.md)）；**待独立 A Review，本次修复 Gate 2 未批准**；H-02 留待 v2、未修复；M-01 ~ M-08 仍待 Walter 人工复核。以下原有状态行均为当时时点记录，不改写。

> **当前状态（2026-10-28，Handoff）**：独立 A 第二轮定向复核 **通过，无新增 P1/P2**，R1-01 / R1-09 已闭环（§7）。**Gate 2 已批准**：Walter 2026-10-28 回复“确认”，接受 11 项 P3（R1-02/03/04/05/06/07/08/10/11 + R2-01/02）为后续任务——接受 ≠ 已修复（§8）。Handoff 记录、实测证据、截图索引与合并说明见 §9：合并主线后 559 + 66 全绿、构建通过；M-01 ~ M-08 已由 AI 实际执行并附 60 张截图（不是 Walter 人工验收，人工勾选待复核）；Handoff 新发现 H-01 / H-02 已登记、未经 Walter 处置。
> §0 ~ §6 为第一轮历史原件、§7 为第二轮原件，均保留原文，其中“Gate 2 未批准 / 未 Handoff”是当时的时点记录。

> **（第二轮时点原文）最新结论（2026-10-28）**：独立 A 第二轮定向复核 **通过，无新增 P1/P2**；R1-01 / R1-09 已闭环。首轮剩余 9 项 P3 + 第二轮新增 2 项 P3 均尚待 Gate 2 处置，人工 M-01 ~ M-08 未验收。详见 §7；§0 ~ §6 保留第一轮历史原件，不代表最新结论。

> **阶段**：Review（AGENTS.md §2 第 10 步）。本文件是审核报告，**不是 Handoff**；**Gate 2 尚未批准**，未进入 PR / merge。
> **审核员**：A = claude-fable-5-1 **via anthropic**（`--model anthropic/claude-fable-5-1`）。
> **回退原因**：先实际尝试 `claude-bridge/claude-fable-5-1`，返回 code 1：Claude quota exceeded / rate limit (seven_day) / monthly spend limit（weekly limit resets Oct 30 6pm Asia/Dubai）。按 AGENTS §2 第 5 步改走 Anthropic API 通道，同一 Claude 模型、身份不变。
> **前提**：spec.md 为 `1b5659d` Gate 1 重新批准的冻结版（45 条 AC；本轮核实 `git diff --numstat 1b5659d b7da4fe -- specs/frontend-workbench/spec.md` 为 9+/8−，全部为 ADR 编号 `D-013 → D-015` 的编辑性勘误及其勘误说明行，需求条目与 45 条 AC 的内容未变）；Checklist 单审 A 第四轮通过（70/70，基线 `2c2fbc8`）；Analyze 修复 `a410bea`。
> **基线与差异范围**：分支 `feat/frontend-workbench`；merge-base `97d080e5`；v1 完工提交 `b7da4fe4`；实际评审 diff = `git diff 97d080e5...b7da4fe4`（134 文件，+18539 / −16；按 `git diff --numstat` 分项：`frontend/` 109 文件 +15254/−0，`design/` 13 文件 +1842/−0，`specs/` 7 文件 +1355/−0，`docs/` 3 文件 +63/−11（`designUI.md`、`plan.md`、ADR `20261027-updown-scope.md`），根目录 2 文件 +25/−5（`AGENTS.md`、`.gitignore`））。当前 HEAD `0ffa15e7` 相对 `b7da4fe4` 仅增加 `specs/frontend-workbench/assets/workbench-v2/` 原型草稿与 `specs/README.md` 状态文字；本轮以 `git diff --quiet b7da4fe HEAD -- frontend design docs AGENTS.md specs/frontend-workbench/{spec,plan,tasks,checklist,manual-acceptance}.md` 自行核实 exit 0，审核输入与代码未变。v2 草稿、D-018 术语均未作为依据。
> **审核日期**：2026-10-28。只读审核：未修改仓库任何文件、未勾 checklist、未 commit / push / merge；临时验证脚本只放在系统临时目录（`%TEMP%\fw-review\`），复现用的临时 dev server（端口 4197）已清理。

## 0. 结论

**未通过（存在 1 项 P2）。** P1 = 0，**P2 = 1**，P3 = 10。

- 唯一阻断项 R1-01：焦点带 KPI 的百分比变化量沿用价格的 `decimals` 取整，默认 mock 场景下把 LPG −0.46% 显示为中性 "0%"、FU2701 +0.6% 显示为 "+1%"，与同一条带上的结论文字"LPG 合约小幅回落"自相矛盾；单测与 e2e 把错误输出写成了期望值。属数字语义缺陷（spec R-001 数值规则 / AC-003-1 / AC-007-4），修复面小（契约字段 + Kpi + fixture + 测试）。
- 其余为 P3：`real` 切换路径崩溃在加载页之前、store 对未知 runId 的硬断言、日历查询哨兵区间、契约字段未消费、时间显示未本地化、`updown.css` 引入守卫在运行时为装饰性、脚手架残留、Converge 缺证据等，均可作为后续任务。
- 实现与 v1 目标对齐良好：九条需求的落点都在、非目标边界守住（`backend/` 零改动，无 Electron / 真实网络 / 图表模板 / 亮色主题），本轮实测 `pnpm -C frontend test` 与 `pnpm -C frontend build` 退出码均为 0。

## 1. 本轮实测证据

| 项 | 命令 | 结果 |
|---|---|---|
| 一条命令全量检查（协调会话在本 cwd 重跑，证据目录 `…\frontend-workbench-v1-review.Uolw7J\tests.log`） | `pnpm -C frontend test` | **exit 0**。`tokens:check: 156 tokens, 5 artifacts match`；`check:generated / colors(24/24 阳性, 0 阴性) / glass / updown / grid / network` 全部 passed；`vue-tsc --noEmit` 通过；`eslint --max-warnings 0` 通过；Vitest **14 文件 / 538 用例通过**（3.29s）；Playwright **65 通过**（1.2m，本机 Chrome） |
| 生产构建（同上，`build.log`） | `pnpm -C frontend build` | **exit 0**。828 模块，`dist/assets/index-*.js` 780 kB（> 500 kB chunk 提示，非错误） |
| 审核员额外复现 ① | `node --experimental-strip-types %TEMP%\fw-review\fmt.mjs`（直接调用真实 `src/shared/format.ts`） | `fmtDelta(-0.46,{decimals:0,kind:'pct'})` → `{"text":"0%","tone":"neutral"}`；`fmtDelta(0.6,{decimals:0,kind:'pct'})` → `{"text":"+1%","tone":"up"}`；对照 `fmtDelta(-0.46,{decimals:2,kind:'pct'})` → `-0.46% / down`。见 R1-01 |
| 审核员额外复现 ② | `VITE_DATA_MODE=real pnpm dev --port 4197 --strictPort` + playwright-core 打开 `/workbench` | `pageerror: "真实数据接口 subscribe 尚未实现；请使用 VITE_DATA_MODE=mock。"`；页面停在静态骨架 `0% / 正在启动本地工作台…`，无"启动失败"文案、无重试按钮（`loading-screen=1, retry=0`）。见 R1-02 |

未并发重跑整套 e2e；没有把既有的 538/65 摘要当作本轮证据。

## 2. 发现（R1-xx）

### R1-01 · P2 · 数字语义/格式 · 关联 spec R-001（数值规则）、AC-003-1、AC-003-4、AC-007-4；plan §2.1 数值 / §2.7 `deltaKind='pct'`；tasks T-06、T-10

- **位置**：`frontend/src/shared/components/Kpi.vue:22-30`（把 `figure.decimals` 原样传给 delta 的 `Num`，`kind=figure.deltaKind`）；`frontend/src/shared/format.ts:20-29, 31-42`；契约 `frontend/src/contracts/types.ts:22-25`（`decimals` 定义为"显示小数位数；方向与零值按此精度取整后判定"，`delta` pct 为百分数值，但没有独立精度）；fixture `frontend/src/contracts/mock/fixtures/daily-brief.json:10-12`；测试把错误值写成期望：`frontend/tests/component/focus-band.spec.ts:70`、`frontend/e2e/workbench.spec.ts:19-21`。
- **触发条件（已复现）**：默认 `/workbench?scenario=normal`，视口 ≥ 1240（6 张卡）或 < 1240（4 张卡，LPG 仍在前 3 张）。本轮 e2e `AC-003-1 focus renders the mock brief…` 通过即证明 DOM 输出为 `['+1.5%','0%','+1%','-35','+0.8','0']`；另以真实 `format.ts` 复算一致。
- **预期 vs 实际**：LPG PG2612 `delta=-0.46, deltaKind='pct', decimals=0` 应显示 `-0.46%`、跌色；实际 `0%`、中性。FU2701 `+0.6%` 实际 `+1%`。
- **用户影响**：首页焦点带（产品"每日认知"的核心位置）把一个 −0.46% 的下跌显示为零变化、把 +0.6% 夸大为 +1%，与同带结论"LPG 合约小幅回落"直接矛盾；该契约语义将被 backend `api` feature 原样继承（`frontend/contracts/CONTRACT.md:163` 同口径）。关注列表之所以正确，是因为 fixture 为 `changePct` 单独配了 `decimals: 2`（`watchlist.json`），说明"价格精度 ≠ 百分比精度"在实现中已被意识到但未反映到 `Figure` 契约。
- **最小修复建议**：契约层为百分比变化量给独立精度——`Figure` 增加 `deltaDecimals?: int`（缺省：abs 沿用 `decimals`，pct 固定 2），`frontend/src/shared/components/Kpi.vue:26` / `frontend/src/shared/components/BoardGrid.vue:15` 的 `fmtDelta` 改用该精度；`pnpm -C frontend contract` 重生成 `contracts/{CONTRACT.md,schema.json}`；fixture 不必改；更新两处测试期望为 `-0.46%` / `+0.60%`（或保持 fixture 口径的等价值）。不改 `format.ts` 的"按显示位取整后判零"规则。
- **缺失测试**：对"非零 pct 变化量在契约精度下不得渲染为中性零"的断言；`AC-007-4` 增加"pct delta 带独立精度"的 schema 用例。
- **应验证命令**：`pnpm -C frontend contract && pnpm -C frontend check --only generated`；`pnpm -C frontend test:unit -t "AC-003-1"`；`pnpm -C frontend test:unit -t "AC-007-4"`；`pnpm -C frontend test:e2e -g "AC-003-1"`。

### R1-02 · P3 · 启动流程 / 契约切换 · 关联 R-007（"通过配置切换，默认 mock"）、AC-002-7 精神；plan §2.7 实现切换；tasks T-07、T-08

- **位置**：`frontend/src/main.ts:14`（挂载 `:17` 之前同步调用 `agentClient.subscribe(...)`）；`frontend/src/contracts/real/index.ts:30`（`subscribe()` 同步抛 `NotImplementedError`）；`frontend/src/app/AppShell.vue:16-27` `start()` 的失败分支因此不可达。
- **触发（已复现，端口 4197）**：`VITE_DATA_MODE=real` 启动，打开任意地址 → 未捕获异常，`app.mount` 未执行，页面永远停在 `index.html` 静态骨架 `0%`，没有原因、没有重试。
- **预期**：按 plan §2.2，`bootstrap()` 失败应在加载页显示原因并可重试——`real.bootstrap()` 本身会抛可展示的 `NotImplementedError`，只是被更早的 `subscribe` 抢先炸掉。
- **影响**：v1 不交付 real，但"可切换"是 R-007 的 what；现在切换的结果是白屏式卡死而不是设计好的 boot-error 路径，后续 `api` feature 第一次接线时会先撞上它。
- **最小修复**：`real.subscribe` 返回空操作的 `Unsubscribe`（或 `main.ts` 把订阅放到 `mount` 之后并捕获），让错误从 `bootstrap()` 走加载页。
- **缺失测试**：无任何测试覆盖 `VITE_DATA_MODE=real`。建议 unit：以 real client 驱动 `useAppStore().bootstrap()` 得 `phase==='error'` 且 `error.message` 含"尚未实现"。
- **验证**：`VITE_DATA_MODE=real pnpm -C frontend dev` 手动打开应见"启动失败 + 重试"；新增单测 `-t "AC-002-7 real"`。

### R1-03 · P3 · 状态归约健壮性 · 关联 R-005 事件流、AC-005-3；plan §4 流程 3；tasks T-13

- **位置**：`frontend/src/agent/store.ts:46` `runs.value.find(run => run.runId === event.runId)!`。
- **代码路径确认**：任何不以 `run.started` 开头的事件（runId 未知）会在订阅回调里抛 TypeError。mock 下不可达（`send()` 先校验 `AgentRunSchema` 再按序定时投递），但该 store 是 agent-runtime / 真实订阅的归约层，断线重连、页面刷新后迟到的事件都会命中。
- **建议**：未知 runId 的事件忽略（或建一条占位 run）并加一个 unit 用例；不扩大范围。

### R1-04 · P3 · 契约使用 · 关联 R-007、AC-004-5（日程）；plan §2.7 `getReleaseCalendar(from,to)` 闭区间；tasks T-11

- **位置**：`frontend/src/modules/release-calendar/ReleaseCalendar.vue:19-20` 以哨兵区间 `'0001-01-01'..'9999-12-31'` 调用；注释承认是为了让固定 fixture 不落在区间外。
- **影响**：界面实际绕过了契约的时间参数语义；真实实现会收到一个万年区间。v1 mock 无可见问题。
- **建议**：要么把日程窗口定义进契约（如"今日起 N 日"或参数可缺省），要么 fixture 相对今日生成；在 CONTRACT.md 注明前端的调用口径，留给 `api` feature。

### R1-05 · P3 · 契约字段无消费者 · 关联 R-007、AC-007-3；AGENTS §5.3

- **位置**：`frontend/src/contracts/types.ts:129` `ModuleSummarySchema.figures`、`frontend/contracts/CONTRACT.md:309-310`、fixture `frontend/src/contracts/mock/fixtures/module-summaries.json` 含两条带 delta 的 `Figure`；`frontend/src/modules/summary/ModuleSummary.vue:38-46` 只渲染 `text`（`:42`），`figures` 从未使用。
- **影响**：契约文档对后端承诺了一个前端不读的字段；若保留，应有理由（如预留给 domain feature）并在文档说明，否则删除以免 `api` feature 白做。

### R1-06 · P3 · 时间显示语义 · 关联 R-004 右注"截至时间"、AC-002-4、AC-004-5

- **位置**：右注原样输出 ISO 串：`frontend/src/modules/market-board/MarketBoard.vue:37`、`frontend/src/modules/watchlist/Watchlist.vue:52`、`frontend/src/modules/summary/ModuleSummary.vue:34`（`截至 2026-10-28T15:00:00+08:00`）；`frontend/src/app/TopBar.vue:34`、`frontend/src/modules/release-calendar/ReleaseCalendar.vue:53-54` 用 `ts.slice(11,16)` 取"源偏移下的 HH:MM"，不换算本地时区、不标偏移。
- **代码路径确认**：契约 `Timestamp` 明示允许 `Z`（UTC）；一旦后端返回 UTC，日历与 ticker 会把 UTC 小时当作本地时间展示。`frontend/contracts/CONTRACT.md:71` 已把"日界按各条 ts 的偏移确定"写成契约，所以日期切片与契约一致，仅时间显示与可读性存在问题。v1 mock 全为 +08:00，不可见。
- **建议**：一个共享的 `fmtAsOf` / `fmtClock`（本地时区 + 简短格式）；属 FTEngine Formats 规范的范畴，可随 chart-templates 的 Formats 移植一并处理。

### R1-07 · P3 · 架构风险（守卫有效性）· 关联 AC-001-5；plan §2.1 / §2.8 `updown`

- **位置**：`frontend/scripts/check.mjs:283-296` `checkUpdown`（`:291-293` "`updown.css` 只被三处引入"）；`frontend/src/design/updown.css`（全局选择器 `.sem-market.is-up/.is-down`）；`frontend/src/shared/components/Num.vue`。
- **代码路径确认**：Vite 把 CSS 打成全局样式，引入位置不构成运行时作用域——任何位置只要 `Num` 收到 `semantic='market'` 就会取涨跌色。真实作用域由"契约声明 semantic + 该组件是否放在登记容器"决定，而 e2e `AC-001-5` 只对当前 fixture 生效。守卫目前满足 spec 字面（静态检查引用范围），但对"新增位置必须改登记"的 D-015 登记制保障弱。
- **建议（最小）**：把 `updown.css` 的选择器限定在登记容器下（`.fai-module[data-module-id="market-board"]`、`[data-module-id="watchlist"]`、`.focus-segment[data-semantic="market"]`），让守卫与运行时一致；或在 `Num` 外不再允许直接写 `sem-market` 类（`frontend/src/modules/watchlist/Watchlist.vue:66-70`、`frontend/src/shared/components/BoardGrid.vue:64-68` 目前手写 `sem-${semantic}` 类）。

### R1-08 · P3 · 脚手架残留 · 关联 T-01

- **位置**：`frontend/src/App.vue`（"前端脚手架已就绪"）不被 `main.ts` 使用，仅 `frontend/tests/unit/smoke.spec.ts:4` 挂载它；单测 SMOKE 因而没有测真实应用根。
- **建议**：删除 `App.vue`，SMOKE 改挂 `AppShell`（或删除冗余单测，保留 e2e SMOKE）。

### R1-09 · P3 · 流程 / 文档收敛 · 关联 AGENTS §2 第 9 步、T-01 完成标准 2、AC-009-2

- **事实**：① **无 Converge 报告**：`specs/README.md`（`b7da4fe`）写"待 Review / Converge"，仓库内没有"已收敛"结论；本轮 Review 在 Converge 之前进行。② `tasks.md` 头部仍为"状态：草案…Checklist 通过后生效"，无逐任务完成标记（每任务一提交的纪律已由 git 历史满足：T-01~T-15 各有提交）。③ T-01 完成标准 2"vue-tsc 与 TS 7 不兼容则锁 5.9.x 并回写 plan §1"：`package.json` 已锁 `typescript 5.9.2`，plan §1 未回写（仅 §6 风险行提及）。④ 人工清单 M-01 ~ M-08 全部"待补"，按 spec 允许在 Handoff 补齐，本身不升级。
- **影响**：不构成实现缺陷，但 Gate 2 前必须补 Converge（含 R1-01 修复后的再比对）与 plan §1 回写。

### R1-10 · P3 · 跳转副作用 · 关联 AC-005-5、AC-005-7；plan §2.5

- **位置**：`frontend/src/agent/CotTimeline.vue:65-74` `showModule()` 在导航时 `ui.setDrawer('closed')`（`:68`），该调用会把 `fai.drawer=closed` 持久化。
- **代码路径确认**：plan §2.5 的四步（导航 → 等挂载 → 滚动 → 高亮）未包含"收起抽屉并覆盖用户的档位偏好"；注释说明是为避免加高抽屉遮住高亮目标。
- **建议**：收起但不持久化（临时态），或滚动时考虑抽屉高度。UX 级，可接受为后续任务。

### R1-11 · P3 · 焦点带截取顺序 · 关联 AC-002-6 / AC-003-5；plan §2.3

- **位置**：`frontend/src/workbench/FocusBand.vue:18-24` 先 `slice(0, focusCards)` 再按 semantic 分段。
- **代码路径确认**：< 1240 时默认 fixture 变为"行情 3 + 指标 1"；若日报前 4 个数字都是行情，指标段会只剩标题和空网格。当前 fixture 下视觉可接受，e2e 只断言卡总数。
- **建议**：按段各自截取（如 compact 2+2、expanded 3+3）或至少保证每段 ≥1，并在 plan §2.3 写明口径。

## 3. 验收对齐 / 覆盖简表（45 条 AC）

状态口径：**自动✓** = 本轮 `pnpm -C frontend test` 中对应测试 / 检查通过并经代码核对；**人工待验** = spec 要求人工项，M-xx 尚未执行（Handoff 补截图）；**关联** = 存在 finding。

| 需求 | AC | 落点（核对的真实测试 / 守卫） | 状态 |
|---|---|---|---|
| R-001 设计系统 | AC-001-1 | `tokens:check`（156 令牌、5 生成物逐字）+ `check:generated` `@media` 阈值 ∈ 令牌；e2e `tokens.spec` 逐令牌读 `:root` 计算值并验证注入覆盖可被发现 | 自动✓ |
| | AC-001-2 | `check:colors`（24/24 阳性命中、阴性 0；真实仓库 0 命中；`tokens.json` / `generated/` 豁免、首帧块豁免） | 自动✓ |
| | AC-001-3 | `check:glass`（`backdrop-filter` 仅 `glass.css`，`.glass-*` 仅三类）；代码核对：Rail/TopBar/FocusBand = focus，模块 = module，抽屉/模块库 = drawer，dock 为实色非玻璃 | 自动✓；人工待验 M-01 |
| | AC-001-4 | unit `format.spec`（en dash / 正号 / 取整后判零 / 无负零 / pct）、`typography.spec`；e2e `tokens.spec` 计算字体族（KPI 衬线、壳标题/正文无衬线、数值等宽 tabular 右对齐） | 自动✓（但 pct 精度问题见 R1-01） |
| | AC-001-5 | `check:updown` 三条规则；组件 `Num` 只出语义类；e2e `.sem-market` 仅在三个登记容器、背景非涨跌色 | 自动✓；关联 R1-07（守卫有效性） |
| | AC-001-6 | `check:colors` 退役五值扫描含令牌/生成物；unit `theme.spec` 主题无退役色 | 自动✓ |
| R-002 外壳 | AC-002-1 | e2e `shell.spec` 首帧静态骨架 → 挂载加载页 → 工作台，无空白帧 | 自动✓ |
| | AC-002-2 | e2e 八项顺序/地址/`aria-current`/占位页 owner；7 个直达地址刷新保留 path+query+hash；`/daily/:date`、`/research/:id` 深链 | 自动✓ |
| | AC-002-3 | e2e `__FAI_MOCK__` 注入研究项 → 菜单多一项 | 自动✓ |
| | AC-002-4 | 组件 `topbar.spec`（条目、fresh/stale 令牌类）；e2e 滚动与 reduced-motion | 自动✓；关联 R1-06（时间切片）；人工待验 M-07 |
| | AC-002-5 | e2e 折叠 → 导航 → reload 保持 | 自动✓ |
| | AC-002-6 | e2e `breakpoints.spec` 十个视口（960/979/981/1239/1241/1399/1401/1499/1501/1440×900）侧栏形态、列数、焦点卡数、无横向溢出 + 双向实时缩放 | 自动✓；人工待验 M-06；关联 R1-11 |
| | AC-002-7 | e2e 进度/`notice`；`boot-error` 原因 → 重试成功；深链重试不跳回 | 自动✓；关联 R1-02（real 路径绕过加载页） |
| R-003 焦点带 | AC-003-1 | 组件 + e2e 结论 ≤3、数字、方向类；读失败 → 错误态 | 自动✓，但期望值固化了错误显示 → **关联 R1-01** |
| | AC-003-2 | e2e 点击整带/结论/数字 → `/daily/2026-10-28`，键盘可达 | 自动✓ |
| | AC-003-3 | 组件 + e2e 空态文案 = 契约 `reason` | 自动✓ |
| | AC-003-4 | 组件 market → `updown-*`、analysis → `chart-pos/neg`、零 → `text-primary` | 自动✓（零判定本身正确；精度见 R1-01） |
| | AC-003-5 | 组件 + e2e 两段隔离、双语段标、玻璃边分隔 | 自动✓；人工待验 M-03 |
| | AC-003-6 | e2e 模块库无焦点带、无移除钮、增删移 + reload 后仍在 | 自动✓ |
| R-004 模块 | AC-004-1 | e2e 默认七个按目录序、模块库七项带 `description` 与状态、`grid-column=min(span,列数)` | 自动✓ |
| | AC-004-2 | e2e 上移/下移/移除/追加 → reload；清空 → 空态 → 加回 | 自动✓ |
| | AC-004-3 | 组件 `module-shell.spec` 逐模块 DOM 契约 + e2e 页面遍历；四壳模块占位文案 | 自动✓；人工待验 M-04 |
| | AC-004-4 | 组件三态 + 剪贴板；e2e `error` 场景七模块错误态可达、剪贴板内容按语义比对 | 自动✓ |
| | AC-004-5 | 组件盘面三态格 `休/待/–`、关注列表对齐/千分位/只涂字色/`SparkSeries`、日程升序 | 自动✓；人工待验 M-04；关联 R1-04 |
| | AC-004-6 | `check:grid`（`minmax` 之外的 `1fr` 零命中） | 自动✓ |
| R-005 对话 | AC-005-1 | e2e 八路由输入栏可见、提交后抽屉展开显示用户消息 | 自动✓ |
| | AC-005-2 | 组件 `timeline.spec` success/failure/retry：展开/收起、`step.error` 非终态、唯一终态行 | 自动✓ |
| | AC-005-3 | e2e `long` 脚本切页 / 收抽屉，同一 runId、7 步无重复、终态后指示消失 | 自动✓；关联 R1-03（归约健壮性） |
| | AC-005-4 | e2e running → done → 点击清除、切页后保持 none | 自动✓ |
| | AC-005-5 | e2e 布局内从 `/prices` 发起 → 高亮；已移除 → 提示 + 加回四步、不自动改布局；页面目标跳转；不存在 → 提示不跳 | 自动✓；关联 R1-10 |
| | AC-005-6 | unit 十种事件 schema、终态唯一 superRefine、四份脚本各恰好一个终态；`contract-doc.spec` CONTRACT.md 含十种事件 | 自动✓ |
| | AC-005-7 | e2e half/tall/closed + reload 保持；运行中指示出现/消失 | 自动✓ |
| R-006 主题 | AC-006-1 | unit `theme.spec` 主题 ↔ 令牌对拍、无退役色 | 自动✓ |
| | AC-006-2 | unit WCAG 对 `#252629`：图形 ≥3、文字 ≥4.5、退后色豁免登记 | 自动✓ |
| | AC-006-3 | e2e `__FAI_TEST__.charts` `getOption().color` = 令牌、60 点序列、resize、离开释放 | 自动✓ |
| | AC-006-4 | e2e `backgroundColor` 透明 | 自动✓；人工待验 M-08 |
| R-007 契约 | AC-007-1 | `check:network`（`fetch/XHR/WebSocket/EventSource/axios` 仅 `src/contracts/real/`） | 自动✓ |
| | AC-007-2 | unit 五场景；e2e normal/empty/error/slow | 自动✓（mock 侧）；**real 切换路径无测试 → R1-02** |
| | AC-007-3 | `check:generated` 重生成 `contracts/*` 逐字比对 + `contract-doc.spec` | 自动✓；关联 R1-05 |
| | AC-007-4 | unit 三形态反例被拒、fixtures 全过 schema | 自动✓；**pct 精度缺口 → R1-01** |
| R-008 资产 | AC-008-1 | unit `design-registry.spec`：九份 `design/ui/*` + `PALETTE_DARK` front matter（source / source_verified / migrated / adaptation）与 `## 暗色适配` 段；designUI 指针指向真实条目 | 自动✓ |
| | AC-008-2 | unit 156 个 `source` 可解析到条目锚 / designUI 节号 | 自动✓ |
| | AC-008-3 | unit PALETTE_DARK 覆盖 14 个 palette-core 原色与对比度 | 自动✓ |
| R-009 可验收 | AC-009-1 | `pnpm -C frontend test` exit 0（本轮实测） | 自动✓ |
| | AC-009-2 | `manual-acceptance.md` M-01~M-08 各有"看什么"，`manual-acceptance.spec` 校验结构 | 清单✓；**截图/勾选全部待 Handoff**（允许） |

## 4. 非目标边界与未实现项

- 守住的边界：`backend/` 零改动（`git diff --stat -- backend` 为空）；无 Electron；网络调用仅允许在 `src/contracts/real/` 且该目录全部为 `NotImplementedError` 桩；图表仅一张样例折线 + 主题；七个占位页 + 四个壳模块按 Q-001 B；无亮色主题；无拖拽。这些不计缺陷。
- 文件边界：spec §4 / Q-022 列出的共享文件外，`AGENTS.md` 也在 feature diff 内（`2789ef7` 审核通道、`df0b1ec` 引用"新 AGENTS.md" §5 工程准则）。这是用户主导的治理变更而非实现偏差，如实记录。
- 未实现 / 未闭环：Converge 报告与 tasks 状态（R1-09）；plan §1 的 TS 版本回写（R1-09）；人工 M-01~M-08；`real` 切换的优雅失败（R1-02）。

## 5. 只读审查限制、剩余风险与 Converge 证据

- **方法**：通读 AGENTS.md、docs 三件套、D-007/008/011/015、spec/plan/tasks/checklist/manual-acceptance、`design/` 索引与 front matter；逐文件阅读 `src/` 全部组件 / store / 契约 / mock / 守卫脚本与各测试标题及关键断言；两项定向复现（§1）。未执行人工视觉项。
- **Converge 证据**：**不存在**。本表 §3 是审核员的独立对齐核对，可作 Converge 的输入但不替代它；R1-01 修复后应重跑 Converge 并更新 tasks.md。
- **剩余风险**：① 契约层的数值精度语义（R1-01）若不在 v1 修正，会固化进 `api` feature；② 守卫 `updown` 的运行时有效性（R1-07）依赖纪律而非机制；③ 事件归约对异常序列无防护（R1-03）——按 AGENTS §5.1 可待 agent-runtime 接入时再加，但应登记；④ 暗色序列色 ΔE2000 13.2 由 Checklist 已知悉；⑤ 780 kB 单 chunk 对桌面壳无阻塞，chart-templates 引入更多 ECharts 组件后需关注。

## 6. 下一步与 Gate 2

1. **修 R1-01**（契约 `deltaDecimals` 或等价方案 → 重生成契约 → 改 Kpi/BoardGrid → 修正两处测试期望），然后 `pnpm -C frontend test` 全绿。
2. 补 **Converge**：按 spec/plan/tasks 逐项比对并把 R1-02 ~ R1-11 中接受为后续任务的项登记进 `tasks.md`（新增任务或"后续 feature"注记），回写 plan §1 的 TS 锁定；更新 `specs/README.md` 状态。
3. 修复后 **Review 复核**（可定向：R1-01 + Converge 结论），再由 Walter 过 **Gate 2**。
4. Gate 2 批准后才进入 Handoff：执行 M-01 ~ M-08 并附截图，更新本文件，提交 PR 并 merge 到 main。

**Gate 2 待用户决定；本轮未批准、未进入 PR / merge / Handoff。**

## 7. 第二轮定向复核（2026-10-28）

> **审核员**：A = claude-fable-5-1 **via anthropic**（`--model anthropic/claude-fable-5-1`）。
> **回退原因**：本轮先实际运行 `claude-bridge/claude-fable-5-1`，返回 code 1：Claude quota exceeded / rate limit (seven_day) / monthly spend limit（weekly reset Oct 30 6pm Asia/Dubai）。按 AGENTS §2 第 5 步改走 Anthropic API 通道，同一模型、身份不变。
> **性质**：独立定向复核（R1-01 + R1-09 + Converge），新开会话、与实施隔离；不重做首轮全面 Review。实施者摘要未作为证据，以下全部为本人核对。
> **基线**：分支 `feat/frontend-workbench`，HEAD `b19427a`（T-17）；T-16 代码 `923e238`；首轮原件 `e282c56`；复核 diff = `git diff e282c56..b19427a`（17 文件 +344/−26；其中 `frontend/` 12 文件全部在 `923e238`，`b19427a` 只动 `specs/`）。本人核实 `git diff --stat e282c56..HEAD -- spec.md checklist.md manual-acceptance.md backend docs design AGENTS.md assets` 为空；`git diff --numstat 1b5659d HEAD -- spec.md` 仍为 9+/8−（D-013→D-015 勘误），45 条 AC 未动；`git diff --quiet 923e238 HEAD -- frontend` 通过；工作区干净。只读审核：未改仓库文件、未勾 Checklist、未 commit / push / merge；临时探针脚本放在证据目录 `r2tmp/` 并已删除。

### 7.1 结论

**通过。** 新增 P1 = 0、P2 = 0、P3 = 2（R2-01、R2-02，均为编辑性 / 测试强度备注，可作后续）。首轮剩余 P3 仍为 9 项（R1-02 ~ R1-08、R1-10、R1-11），本轮只登记、未修复、**未获用户风险接受**——这与实施者记录一致，不构成冒充。

- **R1-01 闭环**：契约、解析函数、两个消费组件、生成物、测试五处同步；默认 mock 下 LPG `-0.46%` 跌色、FU `+0.60%` 涨色，主值精度不变；零中性 / 负零 / 空值规则未被改成"非零即着色"。修复为冻结 spec R-001 数值规则的实现纠偏，不是需求变更，无需回流 Gate 1。
- **R1-09 闭环**：tasks 状态、15 条原任务提交号、plan §1 TS 5.9.2 回写、Analyze、Converge 45 条对拍均已落地；人工 M-01 ~ M-08 与 Gate 2 均如实标为未完成。
- Gate 2 仍待 Walter 确认；人工验收未做；未 PR / merge。

### 7.2 R1-01 核验（真实文件行号）

| 要求 | 证据 | 判定 |
|---|---|---|
| 可选 `deltaDecimals` 入口 schema 与文档 | `frontend/src/contracts/types.ts:26` `z.int().nonnegative().optional()`；`:22` `decimals` 描述改为"主数值…不决定百分比变化量精度"；生成物 `frontend/contracts/CONTRACT.md:167`、`schema.json:248-253`（`integer, minimum 0`，不在 required）；本人运行 `pnpm -C frontend check --only generated` exit 0，证明生成物未手改 | ✓ |
| 共享解析，Kpi 与 BoardGrid 同源 | `frontend/src/shared/format.ts:33-35` `figureDeltaDecimals = deltaDecimals ?? (deltaKind==='pct' ? 2 : decimals)`；`Kpi.vue:26`、`BoardGrid.vue:15`（盘面字色按变化量精度判向，`:17` 主值为零 / 缺数仍中性）。`rg` 确认不存在第三处自行拼精度的消费者；`Watchlist.vue:26-27,75,83` 的 `change` / `changePct` 是独立 `Figure`、`value` 即变化量，用自身 `decimals` 正确，不属本缺陷 | ✓ |
| pct 缺省两位、abs 沿用 decimals、显式 0 / 其他精度生效、主值不变、空值 / 显示零 / 负零中性 | 本人以 `node --experimental-strip-types` 直接调用 `e282c56` 旧 `format.ts` 与当前 `format.ts` 对拍 11 组用例：`-0.46 pct` 旧 `0%/neutral` → 新 `-0.46%/down`；`0.6 pct` 旧 `+1%` → 新 `+0.60%`；`-0.004 pct` 缺省 → `0.00%/neutral`，`deltaDecimals:3` → `-0.004%/down`；`deltaDecimals:0` → `0%/neutral`；`abs -0.46` 缺省 `0/neutral`、`deltaDecimals:2` → `-0.46/down`；`-0` → `0.00%/neutral`；`null` → `–`。fixture `daily-brief.json:10-15` 未改 | ✓ |
| 新增回归真实有效、不是只改期望 | `red.log`（修复前）14 failed / 7 passed，失败点为 `typography.spec.ts:112`、`contracts.spec.ts:93/:100` 等真实断言；新增用例：`tests/unit/contracts.spec.ts:89-101`（含 0 / 2 / 3 通过，−1 / 1.5 / "2" / null 拒绝）、`contract-doc.spec.ts:95-97`、`tests/component/typography.spec.ts:96-115`（10 组）、`modules.spec.ts:114-130`（盘面 6 组）、`focus-band.spec.ts:70-73`（加 `is-down` / `is-up` 类断言）、`e2e/workbench.spec.ts:26-49`；旧期望 `e2e/workbench.spec.ts:19-21` 改为 `-0.46%` 跌色；`:137` 去掉了首轮点名的"把 LPG decimals 手改成 2"绕法 | ✓ |

本人实测（HEAD，端口 4173 空闲）：`pnpm -C frontend test:unit -t "R1-01|AC-003-1|AC-003-4|AC-007-4|AC-001-4|AC-004-5 board"` → 6 文件 103 passed，exit 0；`pnpm -C frontend test:e2e -g "AC-003-1|AC-003-5"` → 5 passed（含 R1-01 浏览器用例），exit 0。

### 7.3 R1-09 核验

- `tasks.md:3` 状态"已生效（基线 `2c2fbc8`，70/70）；T-01 ~ T-17 已实施，待独立 Review 定向复核；Gate 2 未批准"——不再称草案。
- `tasks.md:245-262` 原 15 任务提交表：本人逐一 `git log -1` 核实 `9d6204b … 0b819d4` 均存在且以对应任务号开头；`923e238` / `b19427a` 同。
- `plan.md:9` 回写 TypeScript **5.9.2**（`frontend/package.json:41` 确为 `"typescript": "5.9.2"`）；`plan.md:236` 风险行同步；`plan.md:5/:57/:148/:227` 登记精度机制与 AC-007-4 落点。
- `analyze.md` 结构核验（45 AC、17 任务、无前向依赖、Checklist 70/0 未动）；`converge.md:8-12` 结论限定为"实现与自动化验证范围已收敛"，`:14-38` R1-01 证据，`:40-90` 45 条逐项，`:90` AC-009-2 明写"人工勾选与截图尚待 Handoff"，`:100-105` 列 Gate 2 未批准。
- `tasks.md:299-312` P3 台账：10 行均标"登记、未修复 / 未风险接受"或"本轮 T-17 补齐"，无一处写成已接受；`specs/README.md:23` 状态 `in-progress`、明示 9 项 P3 未风险接受、M-01 ~ M-08 待验、Gate 2 未批准。
- 人工清单：`manual-acceptance.md` 自 `e282c56` 零改动，8 项仍未勾选、截图"待补"。

### 7.4 测试证据

- 证据目录三组日志本人读取：`red.exit=1`（预期红）、`tests.exit=0`（守卫六项 / typecheck / lint / Vitest 14 文件 559 / Playwright 66，本机 Chrome）、`build.exit=0`（仅 780 kB chunk 提示）。`tests.log` 时间 15:38–15:39 早于 `923e238` 提交时间 15:40:13，但 `frontend/` 在 `923e238` 与 HEAD 逐字一致，且本人在 HEAD 复跑的定向用例全绿，可采信。
- 本轮新增 21 单元 / 组件 + 1 e2e 与首轮 538 / 65 的差额一致（559 / 66）。未重跑整套，未把协调会话结果冒称亲跑。

### 7.5 新发现

- **R2-01 · P3 · 编辑性**：`specs/frontend-workbench/tasks.md:5` 头部仍写"15 个任务，约 25.5 小时"，与同文件 `:345-347`"合计 17 项 / 28 小时"并存。影响：读者在头部得到过时计数。最小修复：头部改为"原 15 项 25.5 h + 整改 2 项 2.5 h"，或删去头部数字只留末行。
- **R2-02 · P3 · 测试强度备注**：`frontend/e2e/workbench.spec.ts:26-49` 标题称"宽 / 窄视口"，但注入 4 个数字，`T.window.width`（6 卡上限）与 `min_width`（4 卡上限）下都只渲染 4 卡，视口维度没有触及 1240 断点截取逻辑；精度与溢出断言本身有效（对旧实现会以 `-0.46%` vs `0%` 失败）。建议后续用 6 个数字跑两档，或把标题改为"最小宽度下不溢出"。不影响 R1-01 判定。

两项均不触及 spec、Checklist，不阻断。

### 7.6 Converge 可信度与边界

- Converge 由实施会话执行、自述非审核员判定，这在 AGENTS §2 第 9 步允许；本人抽核其 §4 中与本轮相关的 AC-001-4 / 003-1 / 003-4 / 004-5 / 007-3 / 007-4 行，证据路径与真实测试文件、守卫一致；其余行与首轮 §3 本人独立对齐表无矛盾。
- 可信边界：① "自动通过 + 人工待验"不等于视觉 AC 已验收（M-01 ~ M-08 全未做）；② R1-02 / R1-03 / R1-07 等涉及真实后端、agent-runtime 与守卫机制的风险仍在，Converge 未声称关闭；③ 未接真实后端、Electron、domain 内容、完整图表库、v2 草稿、D-018 均不在本轮范围，未作为依据。
- 契约版本保留 `1.0.0` 且新增可选字段、`decimals` 描述语义收窄，因 v1 尚未 Handoff 可接受（plan §2.1 已登记）；`api` feature 接线时须以当前 `CONTRACT.md` 为准。

### 7.7 Gate 2 状态

R1-01 与 R1-09 已闭环，本轮判定**通过**（无 P1 / P2）。待 Walter 在 Gate 2 决定：① 接受本轮整改；② 对 9 项首轮 P3 + 2 项本轮 P3 作"修 / 接受为后续任务"处置；③ 批准后进入 Handoff（执行 M-01 ~ M-08 附图、更新 review.md、PR 并 merge 到 main）。本轮未 PR / merge / Handoff，未执行人工验收。

## 8. Gate 2 用户确认记录（2026-10-28）

- **提问**（协调会话 gpt-6.1-sol 转达）：“Gate 2：是否接受这 11 项 P3 作为后续任务，并进入 Handoff？”
- **Walter 回复**：“确认”。
- **处置**：
  1. 接受第二轮整改（R1-01 P2、R1-09 已由独立 A 第二轮确认闭环）。
  2. 11 项 P3——R1-02、R1-03、R1-04、R1-05、R1-06、R1-07、R1-08、R1-10、R1-11、R2-01、R2-02——**接受为后续任务，v1 未修复**；后续归属与验证引用见 [tasks.md](tasks.md)「P3 后续台账」。
  3. 授权进入完整 Handoff（更新交接证据、PR 并 merge 到 main）。
- **边界**：Gate 2 是对评审结论的确认，不是截图签字或人工视觉验收；M-01 ~ M-08 的执行与结论见 §9 与 [manual-acceptance.md](manual-acceptance.md)。

## 9. Handoff 记录（2026-10-28）

> **执行者**：Handoff = claude-opus-5-5 **via anthropic**（AGENTS §6：Handoff 首选 Opus）。本会话是本阶段唯一写入者；分支 `feat/frontend-workbench`，起点 `b991059`（干净）。
> **通道说明（脱敏）**：claude-bridge 在当前限额窗口已明确 seven_day / monthly 用量耗尽（与 §7 记录一致），按 §6 规则 5 本窗口不重复探测；协调会话对 `anthropic/claude-opus-5-5` 做了一次最小真实调用，返回 READY，因此直接使用 Anthropic API 通道。没有改动全局 pi / provider 配置。
> **派工**：协调会话（openai/gpt-6.1-sol）只派工、读状态，不并行写仓库。本阶段没有修改生产代码，所以没有委派 Implement（gpt-6-astra）。

### 9.1 完成项

1. **Gate 2 记录**（`beb5b75`）：见 §8；tasks.md 的 P3 台账改为“已接受为后续（用户 2026-10-28 确认），未修复”；Checklist 勾选与冻结 spec 未动。
2. **合并主线**（`8920b06`，合入 `origin/main@3bf6476`）：5 处内容冲突逐一解决，处理方式见 §9.4；`frontend/` 无冲突、无改动。
3. **只读复查**：[analyze.md](analyze.md) 末节与 [converge.md §8](converge.md)。结论：无新增冲突，合并后仍收敛（v1 实现与自动化验证范围）。
4. **自动化实测**（§9.2）：合并后的 HEAD 上 559 单元 / 组件 + 66 e2e 全部通过，生产构建通过。
5. **M-01 ~ M-08 截图证据**：在 Chrome 156 中实际执行全部操作，采集 60 张截图 + 元数据，见 [assets/handoff/README.md](assets/handoff/README.md)；每张都由执行者看过，AI 视觉结论写在 [manual-acceptance.md](manual-acceptance.md)。
6. **PR 与合并**：见 §9.7。

### 9.2 实测摘要（HEAD `8920b06`）

| 命令 | 结果 |
|---|---|
| `pnpm -C frontend install --frozen-lockfile` | exit 0 |
| `pnpm -C frontend test` | **exit 0**。`tokens:check` 156 令牌 / 5 生成物一致；`contract` 12 方法 / 10 事件；generated / colors（样例 24/24 阳性、0 阴性）/ glass / updown / grid / network 全部通过；`vue-tsc --noEmit`、`eslint --max-warnings 0` 通过；Vitest 5.0.5：14 文件 **559 passed**（2.74s）；Playwright（本机 Chrome，4173 端口自启停）**66 passed**（1.2m） |
| `pnpm -C frontend build` | **exit 0**。JS 780.57 kB / gzip 263.31 kB，CSS 31.02 kB；仅 >500 kB chunk 提示 |
| `git diff b991059 8920b06 -- frontend design` | 空（合并未改实现与规范资产） |
| `git diff origin/main 8920b06 -- backend AGENTS.md` | 空（不反向覆盖主线 backend / settings；AGENTS §6 未回退） |

计数与 Review 时相同，但都是本轮在合并后的代码上重新运行得到的。日志放在系统临时目录，不入库。

### 9.3 Converge 结论

**已收敛（v1 实现与自动化验证范围），合并主线后复查仍成立。** 45 条 AC 的自动部分全部通过；人工部分已有 AI 执行的截图证据，但还没有 Walter 的人工复核。

### 9.4 合并冲突处理

| 文件 | 处理 |
|---|---|
| `.gitignore` | 取并集：保留主线新增的用户数据 / 凭证兜底锚点与 backend 构建产物，追加本分支四行前端忽略项；没有移除任何锚点 |
| `AGENTS.md` | 整份采用主线版本（含 §5 工程准则与 §6 模型路由）。本分支原有的“单审 A / 接入通道 / §5”改动已被主线以更新形式包含，没有需要保留的独有内容 |
| `docs/plan.md` | §3 采用主线决策表（D-013、D-014、D-016 ~ D-019），并按主线“编号说明”第 4 步把 D-015 预留行换成正式行，追加完成记录 |
| `docs/designUI.md` | 以主线为底（双区结构、作业轨道、介入界面、§2.4 状态与来源、§5.2 块模型、§6 新增组件、§8 登记规则），保留本分支的 §2.1 玻璃边注、§2.2 D-015 作用域、§2.3 / §6 / §8 已移植条目指针；§3.10 加注 v1 是已交付的旧导航 / 抽屉地基，新形态由 v2 / workbench-interaction 规格承载。**没有为了对齐新 docs 去改 v1 UI** |
| `specs/README.md` | 保留主线 data-layer、settings 两行与“跨 feature 待同步事项”（含 v2 的待办），只更新本 feature 一行 |

D-015 的其余同步（ADR 标题、活文档引用、`design/` 7 个文件）在合并前已经完成；`checklist.md` 等历史评审记录保留 D-013，并带“即 D-015”的勘误说明。

### 9.5 截图索引与 AI / 人工区分

- 索引与元数据：[assets/handoff/README.md](assets/handoff/README.md)、[capture-log.json](assets/handoff/capture-log.json)、[capture-log-supplement.json](assets/handoff/capture-log-supplement.json)。
- 60 张截图覆盖：整体 / 模块库 / 抽屉；字族、KPI 与表格；焦点带两段与空态；七个模块与三态；success / failure / retry / long、角标、步骤详情；各断点两侧、最小 960、基准 1440×900，以及窄窗抽屉 / 模块库；ticker 正常 / 减少动态 / 空态；图表基准 / 窄窗 / 浮窗。
- **身份限制**：浏览器操作与看图都由 AI（本 Handoff 会话）完成，不是 Walter 本人逐图验收；manual-acceptance.md 的“人工验收通过”勾选框全部保持未勾选。Gate 2 是对评审结论的确认，不等于截图签字。

### 9.6 未完成项、风险与下一步

**未完成项**

1. **Walter 人工复核 M-01 ~ M-08**：截图与 AI 结论已提交，人工勾选待填写。
2. **H-01 / H-02 处置**（Handoff 新发现，执行者初判 P3，未经 Walter 处置；见 tasks.md「P3 后续台账」）：
   - H-01：样例图图注“近 60 日收盘 · 样例”断成三行（`span.num` 被全局样式设成块级）。
   - H-02：小于 980 时顶部横向导航里专题研究子项纵向堆叠，导航区约 205 px；960 ~ 979×900 下模块区可视高度约 215 px，样例图不能一屏完整显示。与 UI_LAYOUT `#rail` 的“塌成顶栏横向滚动”不一致。两项都没有违反 45 条 AC 的自动判据，也不产生横向溢出或元素重叠，因此本阶段没有改代码、没有阻断合并。
3. **11 项已接受 P3**（R1-02/03/04/05/06/07/08/10/11、R2-01/02）：按 tasks.md 台账归属后续 feature，v1 未修复。

**风险**

- 契约 `1.0.0` 含可选 `deltaDecimals`，backend `api` feature 接线时以当前 `contracts/CONTRACT.md` 为准；`real` 模式启动失败路径（R1-02）仍未处理。
- `frontend-workbench` v2 的规格分支（`spec/frontend-workbench-v2`）此前基于 `fdaa7d8` 分叉，v1 合入 main 后，v2 要先合并 main 再继续，并会改到同一组规格文件；本阶段不动 v2 分支或工作树。
- 本分支自 Clarify 阶段起带有 v2 交互原型草稿 `assets/workbench-v2/`（`0dc2497`，README 写明“不是已批准的正式实现”）。它随本 PR 原样进入 main，不是 v1 交付物，也不作为任何依据；本阶段没有新增或修改 v2 内容。
- 单个 780 kB JS chunk 只有提示；chart-templates 引入更多 ECharts 组件后需要关注。

**下一步**

1. Walter 复核 manual-acceptance.md 的截图与 AI 结论，填写人工勾选；决定 H-01 / H-02 是修复还是接受为后续。若要修复，按 AGENTS §6 由 Implement（gpt-6-astra）在新分支上处理，引用对应 AC，修复后重采受影响的截图。
2. v2 规格分支合并 main 后继续它自己的流程。
3. 11 项 P3 随 `api` / `agent-runtime` / `chart-templates` / 日报等后续 feature 处理。

### 9.7 PR 与合并

- PR：[iswalterwu/Futures-AI#7](https://github.com/iswalterwu/Futures-AI/pull/7)（`feat/frontend-workbench` → `main`，普通 merge commit；创建时 mergeable = CLEAN，仓库没有配置 CI 检查）。
- merge 提交号在 merge 后才产生，记在 Handoff 结果文件和 PR 页面上，不再为此另提交一次。

## 10. 恢复：H-01 最小修复的 Plan / Tasks / Analyze（2026-10-28，追加）

> §0 ~ §9 为历史原件，不改写。本节只记录暂停后的恢复处置与本轮规划产物；**本轮没有修改生产代码、没有运行测试或采集截图、没有提交 / push / PR / merge。**
> **执行者**：Plan / Tasks / Analyze = claude-opus-5-5 **via anthropic**。本会话是本阶段唯一写入者，协调会话不同时写。
> **通道（脱敏）**：本新会话对 `claude-bridge/claude-opus-5-5` 做了一次最小真实探活，失败（quota exceeded / seven_day / monthly spend limit）；按 AGENTS §6 规则 2 / 5 改走 Anthropic API 通道，最小探活 READY。同一模型，只换通道；当前限额窗口内不再重试 bridge；未改全局 provider / 配置。
> **分支与基线**：`fix/frontend-workbench-visual`，基线 `43b6d79681a49562f41751368b2ae00c24062f56`（PR #7 在 main 的 merge commit）；开始时工作区干净。暂停归档 `wip/frontend-workbench-pause-20261028@022f038` 的 HANDOFF.md 只用 `git show` 只读参考，没有合入本分支。

### 10.1 用户原话与上下文

- 恢复暂停任务时，协调会话先只读检查，然后询问处置。上一条回复原话：「建议 H-01 做最小样式修复，H-02 随 v2 导航统一处理。请确认是否采用，或指定其他处置；此前接受的 11 项 P3 不包含 H-01/H-02。」
- 用户随后回复：「继续」。
- 协调会话把这句回复理解为采用上述建议并据此派工：仅 H-01 做最小修复；H-02 留待 v2；M-01 ~ M-08 继续等 Walter 人工复核，不代勾。
- **边界**：这句回复不是逐项签字，不是对本次修复的 Gate 2 批准，不是 v2 实施授权，也不是对 M-01 ~ M-08 的人工验收；不扩大 Gate 2 已接受的 11 项 P3 的范围（H-01 / H-02 本来就不在其中）。

### 10.2 范围与处置状态

| 项 | 状态 |
|---|---|
| H-01 | **已授权待修复**：tasks.md 追加 T-18（1 h），范围限 `SampleChart.vue` 与 `e2e/theme.spec.ts`，加新目录截图证据；未实施 |
| H-02 | **留待 v2、未修复**；没有写入 v2 规格，没有转交，也没有完成；v2 需要在自己的流程（Clarify / Gate 1）里承接 |
| 11 项已接受 P3 | 不变，未修复，不顺手扩改（含 R2-01：tasks 头部旧计数保留为历史） |
| M-01 ~ M-08 | 仍待 Walter 人工复核；manual-acceptance.md 8 个勾选框未动 |
| Checklist | 70 已勾 / 0 未勾，核对后保留，未改 |
| 冻结 spec | 零改动；不需要重过 Gate 1，不需要新 ADR |

### 10.3 根因核实与修复方案（摘要，详见 plan §7）

- `figcaption` 为 flex，标签外层 `<span>` 作为 flex 项被块化；内层数字命中全局 `span.num { display: block }`（`frontend/src/shared/num.css`），标签被切成“近 / 60 / 日收盘 · 样例”三个匿名块行，`text-align: right` 再把 60 推到右侧。
- 修复：`SampleChart.vue` 的 `<style scoped>` 增 `figcaption .num { display: inline; }`。特异度（0,2,1）高于（0,1,1），只作用于本组件；等宽、tabular、nowrap 与计算值 `text-align` 不变。仓库已有同口径先例 `PlaceholderPage.vue` 的 `.placeholder-page .num`。
- 验证：e2e 在 `T.window.width` / `T.window.min_width` × `T.window.height` 两档读取真实浏览器计算样式与 Range 几何（文字与数字各一个矩形、竖向区间相交、顺序正确；等宽 / tabular；单位同行不重叠；无横向溢出；图注以外的 `span.num` 仍为块级）。先在旧实现跑红，再修复跑绿；截图先拍后断言，修复前后各两张复制到 `assets/h01-fix-20261028/`，不覆盖 `assets/handoff/` 的 60 张。

### 10.4 派工 / 模型记录

| 角色 | 任务 | 基线 | provider / model | 状态 / 失败类别 |
|---|---|---|---|---|
| Plan / Tasks / Analyze | plan §7、T-18、analyze 追加节、本节、状态表 | `43b6d79` | anthropic / claude-opus-5-5 | 完成（本轮）；bridge：额度耗尽 |
| Implement | T-18 | `43b6d79` | 首选 openai/gpt-6-astra，回退 deepseek/deepseek-flash | 未开始；由协调会话另行派工 |
| Converge | 实施后对照 spec / plan / tasks 追加记录 | T-18 提交 | claude-opus-5-5（先 bridge 后 anthropic） | 未开始 |
| 审核员 A | 定向 Review T-18 真实 diff | T-18 提交 | claude-fable-5-1（先 bridge 后 anthropic），回退按 §6 | 未开始；须新会话，与实施模型不同 |

### 10.5 Gate 状态与下一步

- **本次修复的 Gate 2：未批准。** 需要在 Implement → Converge → 独立 A Review 之后，由 Walter 确认。
- 下一步：① 协调会话按 §6 派 Implement 执行 T-18（先红后绿、全量测试、构建、截图证据）；② Converge 追加记录；③ 独立 A 定向 Review；④ Walter Gate 2；⑤ 再按流程 PR / merge。M-01 ~ M-08 的人工复核与 H-02 的 v2 承接各自独立进行。

## 11. H-01 修复（T-18）实施与收敛记录（2026-10-28，追加）

> §0 ~ §10 为历史原件，不改写（§10 中“未实施 / 未开始”是规划时点记录）。**本节不是 Review 结论**：独立 A 尚未开始，本次修复 Gate 2 未批准。

### 11.1 实施（Implement）

- 执行者：Implement = **openai/gpt-6-astra via openai**（AGENTS §6 首选，无回退；实施会话自报经 `PI_PROVIDER` / `PI_MODEL` 核实）。前置：Checklist 70 checked / 0 unchecked，Analyze 允许实施。
- 提交：`771f2af`（`SampleChart.vue` scoped `figcaption .num { display: inline; }` + `e2e/theme.spec.ts` 两档回归 + tasks 实施记录）、`f4ff7be`（`assets/h01-fix-20261028/` 4 张图注特写 + README）。目标代码 = `771f2af9d3254c3b2596554f53216e4be9732320`。
- 实测（日志与 exit 留本机临时目录，不入库）：旧生产代码 + 新回归 `-g "H-01"` **2 failed / exit 1**（两档均失败于同行几何断言）→ 修复后 **2 passed / exit 0**；相关 `-g "AC-006-3|AC-006-4|AC-001-4"` **6 passed**；`pnpm -C frontend test` **559 单元 / 组件 + 68 E2E passed，exit 0**；`build` exit 0（仅既知 780.57 kB 提示）；`git diff --check` exit 0。
- 截图口径：图注 `figcaption` 特写（960 下 H-02 使整图被模块区裁切），plan §7.6 已校准，analyze 末节确认与 T-18 一致。

### 11.2 收敛（Converge）

- 执行者：Converge = **claude-opus-5-5 via anthropic**（bridge 本窗口额度耗尽，不重复试；官方探活 READY）。未重跑测试，以真实代码 / git 元数据 / 文件边界 / 日志静态对拍；本会话原生视觉读 4 张图：修复前两档三行、修复后两档同行且单位在右（AI 观察，非人工验收）。
- 结论：**已收敛（H-01 修复的实现与自动化验证范围）**；T-18 五条完成标准均有真实证据，无新增任务。细节与限定见 [converge.md §9](converge.md)。

### 11.3 派工 / 模型记录（脱敏）

| 角色 | 任务 | 基线 / 输入 | provider / model | 状态 / 失败类别 |
|---|---|---|---|---|
| Plan / Tasks / Analyze | plan §7、T-18、analyze、§10 | `43b6d79` | anthropic / claude-opus-5-5 | 完成（`ef11610`）；bridge：额度耗尽 |
| Implement | T-18 | `43b6d79` → `771f2af` / `f4ff7be` | openai / gpt-6-astra | 完成；无回退 |
| Converge | converge §9、plan §7.6、analyze 末节、本节、tasks / 状态表、证据 README 追记 | `f4ff7be`（代码 `771f2af`） | anthropic / claude-opus-5-5 | 完成（本文档提交）；bridge：额度耗尽，本窗口不重试 |
| 审核员 A | 定向 Review `43b6d79..771f2af` frontend diff + 本轮文档 | 本文档提交 | claude-fable-5-1（先 bridge 后 anthropic；anthropic 通道已最小探活 READY），回退按 §6 | **未开始**；须新会话，与实施模型不同 |

### 11.4 未完成 / 风险

1. **独立 A Review**：未开始；Converge 不替代审核。
2. **本次修复 Gate 2**：未批准；用户“继续”只授权 H-01 最小修复范围，不是 Gate 2 或人工签字。
3. **M-01 ~ M-08**：8 项人工勾选仍未勾（含 M-08）；新截图只是图注特写，`assets/handoff/` M-08 整图仍为修复前原件。
4. **H-02**：留待 v2、未修复，未写入 v2 规格、未转交；960 下整图一屏完整性未验证。
5. **11 项已接受 P3**：未修复、未扩改。
6. 日志产生于提交前工作树（行号与提交逐一一致、之后未改 `frontend/`）；未 push / PR / merge。

## 12. H-01 修复（T-18）独立 Review 记录（2026-10-28，追加）

> §0 ~ §11 为历史原件，不改写（§11 中“A 未开始”为 Converge 时点记录）。**本节由集成人落盘，不是 A 的结论本身**；A 原件逐字归档于 [review-h01.md](review-h01.md)（与临时报告 `review-h01-result.md` sha256 `5368e34c…` 一致），结论以原件为准。
> **集成人**：claude-opus-5-5 via anthropic（规划 / 文档类；非审核员 A）。bridge 本窗口额度耗尽，不重复试。

### 12.1 固定目标与审核员

- **固定目标**：`869cb71dce6d6553727fe30e4380e640cf25621b`（分支 `fix/frontend-workbench-visual`）；基线 `43b6d79681a49562f41751368b2ae00c24062f56`；审查 diff `43b6d79..869cb71`（13 文件 +426 / −7，`frontend/` 仅 2 文件）。代码等价于 `771f2af`（`frontend/` 树 `03fda1de…` 相同）。§11.3 写的输入 `43b6d79..771f2af` 为时点描述，A 实际按 `869cb71` 全量审阅（原件 §2.4 已说明不构成问题）。
- **审核员**：A = **claude-fable-5-1 via anthropic**；独立新会话，与 Implement（openai/gpt-6-astra）不同模型。通道：bridge 本窗口共享 account 额度实测耗尽（seven_day / monthly spend limit），按 AGENTS §6 规则 5 不重复试；Fable 官方通道最小真实探活 READY。审核会话 exit 0，审前审后工作树干净、HEAD 不变，未改 tracked 文件。

### 12.2 结论

**通过**（P1 = 0，P2 = 0，P3 = 1）。A 原件写“P3-1 可接受为后续”是审核员建议；**是否接受为后续或要求补采，待 Walter 裁定**，集成人不代为接受。

- **P3-1**：`assets/handoff/m08-chart-1440.png` 仍为修复前原件，1440 不受 H-02 影响，本可补采修复后整图；建议 Walter 复核 M-08 前补采到新目录（不覆盖旧图），或在 Gate 2 材料中明确看图路径为 `assets/h01-fix-20261028/after-1440x900.png` / `after-960x900.png`（图注特写）。关联 AC-009-2 / M-08。登记为 tasks 中 **A-H01-P3-1**，状态“未补采，待 Walter 决定修 / 接受为后续”。
- 观察（非发现）：`theme.spec.ts:74` 的 `console.log` 可改为 annotations，纯偏好。

### 12.3 A 亲跑 vs 查阅日志

| 类别 | 内容 | 结果 |
|---|---|---|
| A 亲跑（`869cb71`） | `pnpm -C frontend test:e2e -g "H-01"` | **2 passed / exit 0** |
| A 亲跑 | `test:e2e -g "AC-006-3\|AC-006-4\|AC-001-4\|AC-002-6"` | **22 passed / exit 0** |
| A 亲跑 | `check --only generated` | **exit 0**（156 令牌 / 5 生成物；契约 12 方法 10 事件） |
| A 亲跑 | `git diff --check 43b6d79..869cb71`、冻结件 `--exit-code` | exit 0 |
| A 亲核 | 截图 sha256：after 与 A 绿跑产物逐字节相同；before 与归档红跑产物逐字节相同；原生视觉看 4 张图 | 一致（AI 观察，非人工验收） |
| 查阅非亲跑 | Implement 红跑 2 failed / exit 1 → 绿 2 passed；相关 6 passed；全量 `pnpm -C frontend test` **559 + 68 passed / exit 0**；`build` exit 0；diff-check exit 0 | A 未亲跑全量与 build、未复现红跑（需改 tracked 文件），以日志 + 逐字节相同的 before 图 + error-context 互证 |

A 亲跑日志在本机临时目录 `reviewer-{h01-e2e,h01-related-e2e,check-generated}.{log,exit}`，不入库。集成人核对：三项 exit 均为 0，日志尾部计数与原件一致。

### 12.4 集成时边界核对

- `git diff --quiet 869cb71..HEAD -- frontend design specs/frontend-workbench/spec.md specs/frontend-workbench/checklist.md` → exit 0（Review 后实现未变）。
- Checklist 70 / 0；manual-acceptance 0 checked / 8 unchecked；`assets/handoff/` 未动。
- 本阶段未新跑测试，未改生产 / 测试 / 令牌 / 契约 / 冻结 spec。

### 12.5 待办与 Gate

1. **本次 H-01 修复 Gate 2：未批准**——需 Walter 在本 Review 之后明确批准（并处置 P3-1）；用户先前“继续”只授权修复，不是对 Review 的提前批准。
2. **A-H01-P3-1**：未补采，待 Walter 决定。
3. **M-01 ~ M-08**：仍待 Walter 人工复核（8 项未勾）。
4. **H-02**：留待 v2、未修复；11 项旧 P3 未扩改。
5. 未进入 Handoff；未 push / PR / merge。

## 13. 本轮 Gate 2 用户确认记录（2026-10-28，追加）

> §0 ~ §12 为历史原件，不改写（其中“Gate 2 未批准 / 待 Walter”为当时时点记录）。

- **协调会话的完整 Gate 2 问题**：「Gate 2：是否确认本轮修复，并接受“1440 整图补采”为后续任务，随后进入 PR / 合并？」
- **Walter 原话**：「好的」（2026-10-28）。
- **批准范围**：① 本轮 H-01 修复（T-18，代码 `771f2af`）及独立 A Review 结论（[review-h01.md](review-h01.md)，通过）；② A-H01-P3-1（原件 P3-1，1440 修复后整图补采）**接受为后续任务，尚未补采**；③ 进入 PR / 合并。
- **不包含**：M-01 ~ M-08 人工签字（8 项仍未勾）；H-02 修复或 v2 实施授权；旧 11 项 P3 已修复（仍为已接受后续、未修复）。

## 14. H-01 修复 Handoff 记录（2026-10-28，追加）

> **执行者**：Handoff = claude-opus-5-5 via anthropic（AGENTS §6 首选；bridge 本窗口 account 额度耗尽，不重复探活）。本阶段只做记录与发布，未写代码 / 测试 / 截图，未重跑测试（生产代码自 A 审查目标起未变）。

### 14.1 完成项

- T-18：`SampleChart.vue` scoped `figcaption .num { display: inline; }`（`771f2af`），图注“近 60 日收盘 · 样例”在 1440 / 960 两档恢复单行、单位同行在右；全局数值样式、令牌、契约、冻结 spec 均未改。
- 回归：`e2e/theme.spec.ts` 两档真实 Chrome 计算样式 + Range 几何测试（先红后绿）。
- 证据：[assets/h01-fix-20261028/](assets/h01-fix-20261028/README.md) 修复前后图注特写 4 张 + README。
- 流程：Plan / Tasks / Analyze（`ef11610`）→ Implement（`771f2af`、`f4ff7be`）→ Converge（`869cb71`）→ 独立 A Review 通过（`fa954fc` 归档原件）→ Gate 2 已批准（§13）→ 本 Handoff。

### 14.2 验收证据摘要（引用既有实测，Handoff 未重跑）

| 来源 | 内容 | 结果 |
|---|---|---|
| Implement（日志 `h01-*`，本机临时目录 `fw-h01-resume.fw1YK3/`，不入库） | 旧代码 + 新回归 `-g "H-01"` | 2 failed / exit 1（同行几何断言） |
| Implement | 修复后 `-g "H-01"`；相关 `AC-006-3\|AC-006-4\|AC-001-4` | 2 passed；6 passed |
| Implement | `pnpm -C frontend test` | exit 0：守卫 / typecheck / lint 通过，Vitest 14 文件 **559 passed**，Playwright **68 passed** |
| Implement | `pnpm -C frontend build`；`git diff --check` | exit 0（仅 780.57 kB chunk 提示）；exit 0 |
| 独立 A 亲跑（`869cb71`） | `-g "H-01"`；`AC-006-3\|AC-006-4\|AC-001-4\|AC-002-6`；`check --only generated` | 2 passed；22 passed；exit 0 |
| Converge | 结论 | 已收敛（**仅限 H-01 修复的实现与自动化验证范围**），[converge.md §9](converge.md) |
| Review 原件 | [review-h01.md](review-h01.md) sha256 `5368e34ca44b5d71223b325eabd2d28d81f307f961e966fa92fdfbe789a06908` | 通过，P1 = 0 / P2 = 0 / P3 = 1 |

Handoff 核对：`frontend/` 树 `03fda1de…` 与 A 审查目标 `869cb71` 相同；`git diff --quiet 869cb71..HEAD -- frontend design spec.md checklist.md manual-acceptance.md review-h01.md assets/handoff` → exit 0；Checklist 70/70；manual-acceptance 0 checked / 8 unchecked。`origin/main` 仍为基线 `43b6d79`，无需合入主线。

### 14.3 未完成项、风险与下一步

1. **A-H01-P3-1**：1440 修复后整图补采——已接受为后续、未补采；当前 M-08 看图路径为 `assets/h01-fix-20261028/after-*.png`（仅图注特写），`assets/handoff/m08-chart-1440.png` 仍为修复前原件。
2. **M-01 ~ M-08**：仍待 Walter 人工复核（8 项未勾）。
3. **H-02**：留待 v2、未修复，未写入 v2 规格；960 下整图一屏完整性未验证。
4. **旧 11 项 P3**：已接受为后续、未修复、未扩改。
5. 打包体积 780.57 kB 提示未处理（既有）。

### 14.4 PR 与合并

- PR：[iswalterwu/Futures-AI#8](https://github.com/iswalterwu/Futures-AI/pull/8)（`fix/frontend-workbench-visual` → `main`，普通 merge commit；仓库没有配置 CI 检查）。
- merge 提交号在 merge 后才产生，记在 PR 页面与 Handoff 结果文件上，不再为此另提交一次。

## 15. M-08 修复后 1440 整图证据补采：授权与计划（2026-10-28，追加）

> §0 ~ §14 为历史原件，不改写；H-01 的 Gate 2 保持历史已批准（§13），PR #8 已合并。
> **执行者**：Plan / Tasks / Analyze = claude-opus-5-5 via anthropic（bridge 本窗口 account 额度耗尽，不重复探活）；本阶段唯一写入者。分支 `docs/frontend-workbench-m08-evidence`，基线 `origin/main@44845c8`。

- **授权上下文**：H-01 合并报告列出待办（首项：补采修复后 1440 整图；其余 H-02 留 v2、M-01 ~ M-08 Walter 本人复核、旧 11 项 P3 后续）后，用户回复「继续」。协调会话明确限定本轮**只补采修复后 1440×900 样例图整图**，补齐 A-H01-P3-1，新增截图 / 溯源 / 验收入口，不改功能、不代签。这不是对本轮尚未产生的 Review / Gate 2 的批准，也不是逐图人工签字。
- **计划**：plan §8；任务 T-19（0.5 h，AC-009-2 / M-08）；Analyze 无冲突。
- **派工**：Implement = 首选 openai/gpt-6-astra（回退 deepseek/deepseek-flash），未开始；其后 Converge、独立 A 定向 Review（claude-fable-5-1，先 bridge 后 anthropic）、Walter Gate 2。
- **边界**：不改 `frontend/` / 冻结 spec / Checklist（70/70）/ `review-h01.md` / 旧 60 图 / 4 张图注特写；manual 勾选保持 0 / 8；H-02 与 v2（独立负责会话，当前 blocked）不接管、不变更；旧 11 项 P3 不扩改。

## 16. T-19 实施与收敛简报（2026-10-28，追加）

> §0 ~ §15 为历史，不改写。本节不是 Review 结论。

| 角色 | 产物 | provider / model | 结果 |
|---|---|---|---|
| Plan / Tasks / Analyze | `3c9d714`（plan §8、T-19、analyze、§15） | anthropic / claude-opus-5-5 | 完成；bridge 额度耗尽 |
| Implement | `bf04f69`（整图 PNG、生成 JSON、README / manual M-08 / tasks 记录） | openai / gpt-6-astra | 完成，无回退；采集首跑 exit 1（截图前断言写法，未出图）→ 修正后 exit 0；定向 e2e 6 passed、AC-009-2 单元 9 passed / 550 skipped |
| Converge | converge §10、本节、tasks / 状态表、证据 README 追记 | anthropic / claude-opus-5-5 | **T-19 证据补采范围已收敛**；未跑测试 |
| 审核员 A | 定向 Review `44845c8..` 本轮提交 | claude-fable-5-1（先 bridge 后 anthropic），回退按 §6 | **未开始**；须新会话、与实施模型不同 |

- 证据：[after-1440x900-full.png](assets/h01-fix-20261028/after-1440x900-full.png)（sha256 `15c08282…a678`）、[capture-full-1440.json](assets/h01-fix-20261028/capture-full-1440.json)；来源 HEAD / 代码基线 `44845c8`，`frontend` 树 `03fda1de…`，与基线零差异。
- AI 看图（Converge，不是人工验收）：整个 figure，图注单行、曲线与双轴完整、无裁切、无白底。
- 待办：独立 A Review → Walter 本轮 Gate 2；Walter 人工复核 M-01 ~ M-08（含 M-08，8 项未勾）；H-02 留待 v2；旧 11 项 P3 未扩改。

## 17. T-19 独立 Review 记录（2026-10-28，追加）

> §0 ~ §16 为历史，不改写（§16 中“A 未开始”为 Converge 时点记录）。本节由集成人（claude-opus-5-5 via anthropic，非 A）落盘；A 原件逐字归档于 [review-m08.md](review-m08.md)（与临时 `review-m08-result.md` sha256 `aa9e1ed6…6ed6` 一致），结论以原件为准。

- **固定目标**：`167b337f516c5e55a9c24355eddf0c36fdbad2b8`（基线 `44845c8`；diff 10 文件全部在 `specs/`；`frontend` 树 `03fda1de…` = 基线 = H-01 审查代码树）。
- **审核员**：A = **claude-fable-5-1 via anthropic**，全新会话，与 Implement（openai/gpt-6-astra）不同；bridge 本窗口 account 额度耗尽、不重复探活。会话 exit 0，审前审后工作树干净、HEAD 不变，自启 Vite / 浏览器已退出，4173 / 4191 无监听。
- **结论：通过**（P1 = 0，P2 = 0，P3 = 1）。T-19 四条完成标准**满足**，A-H01-P3-1 的证据缺口已补齐（修复后 1440 整图）。
- **A-M08-P3-1**（原件 P3-1，证据链可读性）：JSON 中 `provenance.frontendDiffExit`、`frontendUntrackedFiles` 与 `checks.*` 是断言守卫后写出的字面常量，不是计算结果；数据真实（独立复采一致），仅只读 JSON 无法区分。本轮无须返工、不新增实施任务；若临时脚本将来沉淀为通用工具再考虑计算值化。A 原件写“可接受为后续”是审核员建议，**是否接受待 Walter 裁定**，集成人不代接受；不混入旧 11 项 P3 或 A-H01-P3-1。

| 类别 | 内容 | 结果 |
|---|---|---|
| A 亲看 | 原生视觉读新整图，并对照修复前 `m08-chart-1440.png` 与图注特写 | 整个 figure、图注单行、轴与折线完整、无裁切 / 白底（AI 观察，非人工验收） |
| A 亲跑 | `test:e2e -g "AC-006-3\|AC-006-4\|AC-001-4"` | **6 passed / exit 0** |
| A 亲跑 | `test:unit -t "AC-009-2"` | **9 passed / 550 skipped / exit 0**（skipped 不计通过） |
| A 独立复采 | 原脚本副本（仅 `assetDir` 改为临时子目录） | exit 0；PNG 与入库**逐字节相同**（`15c08282…a678`）；JSON 仅 executor / sourceHead / workingTreeStatus / scriptSha256 / capturedAt 预期差异 |
| A 亲核 | 边界 `--exit-code`、`git diff --check`、manual 0 / 8、checklist 70 / 0、脚本 hash = JSON | 全部通过 |
| A 只查日志 | Implement 采集首跑 exit 1（截图前断言口径）、成功采集、定向 e2e 6 / 单元 9、boundary | 一致 |
| 旧证据 | H-01 全量 559 + 68、build | 非本轮重跑 |

集成核对：审后实现与证据未变（`git diff --quiet 167b337..HEAD -- frontend design backend docs AGENTS.md spec checklist manual-acceptance 新 PNG / JSON` → exit 0）；`review-h01.md`、旧 60 图与 4 张图注特写未变；manual 0 checked / 8 unchecked。

**待办**：Walter 本轮 Gate 2（含是否接受 A-M08-P3-1）；Walter 人工复核 M-01 ~ M-08；H-02 留待 v2；旧 11 项 P3 未扩改。用户“继续”只授权补采，不是对本 Review 的提前批准。
