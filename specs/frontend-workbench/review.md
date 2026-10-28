# Feature: frontend-workbench v1 评审记录（review.md）

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
