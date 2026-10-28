# Feature: frontend-workbench 实施计划（plan.md）

> Plan 阶段产物。需求在 spec.md（2026-10-27 Gate 1 批准冻结，45 条 AC），本文只写实现机制与验收落点。
> **2026-10-28 精简版**：按 AGENTS.md §5 工程准则重写——去掉为"将来可能需要"而建的东西（评审用中间件、守卫自检样例、跨字段校验、抽象层、逐锚盘点），保留能直接验证 spec 的部分。spec 未改动。

## 1. 技术方案

- **栈**：Vue 3.5 + Vite 8 + TypeScript、Pinia、vue-router、ECharts 6（D-008 / D-004）；契约 schema 用 zod 4
- **测试**：Vitest + @vue/test-utils（单元 / 组件）、Playwright（端到端，复用本机 Chrome）
- **工具链**：pnpm；Node ≥ 22.12；ESLint（换行统一交 `.gitattributes`，不另引 Prettier）；版本在 T-01 冒烟后锁进 `pnpm-lock.yaml`
- **文件边界**（spec §4）：不碰 `backend/`；共享文件为 `.gitignore`（追加）、`specs/README.md`（本 feature 一行）、`docs/designUI.md`（引用指针）、`docs/decisions/`（D-013）、`docs/plan.md` §3（D-013 行）
- **目录**：

  ```
  frontend/
  ├── package.json  pnpm-lock.yaml  vite.config.ts  tsconfig.json  vitest.config.ts  playwright.config.ts  eslint.config.js  .gitattributes
  ├── index.html                    # 静态加载骨架；首帧样式由 tokens-build 写入标记块
  ├── contracts/{CONTRACT.md,schema.json}          # 生成物，入库
  ├── scripts/{tokens-build.mjs,contract-build.mjs,check.mjs}
  ├── src/
  │   ├── main.ts  App.vue
  │   ├── app/          AppShell.vue  Rail.vue  TopBar.vue  LoadingScreen.vue  router.ts  nav.ts
  │   ├── design/       tokens.json  glass.css  updown.css  base.css  generated/  theme.ts
  │   ├── workbench/    WorkbenchPage.vue  FocusBand.vue  ModuleGrid.vue  ModuleLibrary.vue
  │   ├── modules/      registry.ts  ModuleShell.vue  market-board/  watchlist/  release-calendar/  summary/
  │   ├── agent/        AgentDock.vue  AgentDrawer.vue  CotTimeline.vue  store.ts  events.ts
  │   ├── contracts/    types.ts  client.ts  methods.ts  mock/  real/
  │   ├── stores/       app.ts  layout.ts  ui.ts  badges.ts
  │   ├── shared/       format.ts  num.css  components/（Num、Kpi、Badge、空 / 错 / 载三态、DataTable、BoardGrid、Spark）
  │   └── pages/        PlaceholderPage.vue
  ├── tests/            unit/  component/
  └── e2e/
  design/
  ├── ui/               UI_FOUNDATIONS / UI_COLORS / UI_FONTS / UI_LAYOUT / UI_COMPONENTS / UI_CARDS / UI_TABLES / UI_NAV / UI_DARK_ADDITIONS + README.md
  └── charts/           PALETTE_CORE.md（原件）+ PALETTE_DARK.md（暗色值表）+ README.md
  ```

## 2. 模块设计

### 2.1 令牌与设计系统（R-001）

**唯一来源** `src/design/tokens.json`：`{name, value, source, note?}` 数组；`source` 指向 `design/ui/<文件>.md#<锚>`、`design/charts/PALETTE_DARK.md#<锚>` 或 `docs/designUI.md#<节号>`（三种形式，单测校验可解析）。

`scripts/tokens-build.mjs` 生成：`generated/tokens.css`（`:root { --fai-* }`）、`generated/tokens.ts`（`T`，脚本侧唯一取值入口）、`generated/echarts-theme.json`、`generated/critical.css`（首帧样式，写入 `index.html` 的 `<!-- fai:critical:start/end -->` 块）。生成物入库，不手改（AGENTS §5.5）。

**分组**：背景渐变三段、玻璃三层（面 / 边 / 模糊）、文字三级、涨跌两色、点睛红 / 琥珀 / 链接蓝、图表色（序列 7、正负、类目、区间带、均值、模型线、轴线网格）、字体三栈、字号（`main_scale` 45 键全量 + `timeline_step`、`ticker`）、间距三档、圆角（2 + 三个例外）、层级 z、断点与窗口基准。

**三层玻璃**（AC-001-3）：`.glass-focus`（.035 / .07 / 18px，焦点带、侧栏、顶栏）、`.glass-module`（.045 / .09 / 18px，模块壳）、`.glass-drawer`（`rgba(24,25,28,.82)` / .12 / 28px，抽屉、模块库）。只在 `src/design/glass.css` 定义。**焦点带是内容区里的独立一行，不与模块区重叠**，因此文字只落在一层玻璃上，对比度按单层卡面判定。

**双语层级**（R-001）：中文作主标题，英文作副标——全大写、`type.en_sub` 字号、加宽字距（`letter-spacing`）伴随主标题。

**字体三族**（Q-019）：衬线 = 品牌字标、页标题、KPI 大数（"数值等宽"的唯一例外）；无衬线 = 正文、导航、按钮、表格文字、模块壳标题；等宽 = 其余数值（`.num`：mono + `tabular-nums` + 右对齐）、代码、单位、ticker。

**数值**（`shared/format.ts`）：`fmtValue(v, {decimals, unit})`、`fmtDelta(v, {decimals, kind})`——先按显示位取整再判零；空值 `–`；差值正号；零中性；返回 `{text, tone}`。`Num` 只输出语义类（`sem-market` / `sem-analysis` + `is-up` / `is-down` / `is-neutral`）：analysis 的颜色在 `shared/num.css`（chart.pos / chart.neg），market 的颜色只在 `src/design/updown.css`，且只写 `color`。

**涨跌色作用域**（D-013）：涨跌令牌只在 `updown.css` 引用；`updown.css` 只被 `modules/market-board/`、`modules/watchlist/`、`workbench/FocusBand.vue` 引入（`check.mjs` 三条 grep）。

**暗色配色**（Q-003 已确认：A 等亮）。对比度对单层最不利卡面 `#252629`（模块玻璃 .045 叠渐变顶端 `#1B1C1F`）计算；阈值：线条 / 色块 ≥ 3，会当文字用的色 ≥ 4.5，点睛红只作非文字指示（≥ 3），有意退后的中性色不设下限。

| 用途 | 原色 | 暗色值 | 对比度 |
|---|---|---|---|
| 主序列 / 主文字（墨） | `#16191D` | `#E8E6E0` | 12.1 |
| 序列 1 茹藘（上一年 / 负 / 涨） | `#A35F65` | `#C98A8F` | 5.4 |
| 序列 2 沙饧 | `#BFA670` | `#BFA670` | 6.4 |
| 序列 3 苍艾 | `#5A4B3B` | `#97826C` | 4.1 |
| 序列 4 吐绶蓝 | `#4182A4` | `#6CA7C7` | 5.8 |
| 序列 5 缥碧（跌） | `#80A492` | `#8FB8A4` | 6.9 |
| 序列 6 碧落 | `#AED0EE` | `#B0D0EB` | 9.4 |
| 正 / 类目 1 青雀头黛 | `#354E6B` | `#87A1BF` | 5.7 |
| 分档 窃蓝 | `#88ABDA` | `#8BABD6` | 6.4 |
| 大区 驼褐 | `#7C5B3E` | `#B08968` | 4.8 |
| 其他 / 残差 明月珰 | `#D4D3CA` | `#54534B` | 2.0（有意退后） |
| 五年区间带 霜地 | `#C7C6B6`（α .3） | 同色 α .16 | 1.5（有意退后） |
| 均值 / 参照 绍衣 | `#A8A19C` | 不变 | 5.9 |
| 模型线 齐紫 | `#6C216D` | `#C478C3` | 4.9 |
| 界面点睛红 | `#C00000` | `#DF5C4D` | 4.2（只作非文字） |
| 界面琥珀 | `#B8860B` | `#C69633` | 5.6 |
| 链接蓝 | `#0F4C81` | `#6A9DD1` | 5.3 |

文字三级（designUI §2.1）：主 12.1、次 5.2、弱 4.6。序列七色两两最小色差 ΔE2000 = 13.2（亮色原版同口径 21.5）。状态色不用绿；绿在行情语义位置表示跌，分析图表的缥碧保持色板身份。

### 2.2 应用外壳与导航（R-002）

- `AppShell.vue`：`.shell` 两栏（侧栏 + `.content`，`.content { min-width: 0 }`）+ `.content` 内三行（顶栏 / 路由区 / 底部输入栏）；`< 980px` 窗口切顶部横向导航、单列
- **启动**：`index.html` 静态骨架（首帧样式来自生成块）→ 挂载后同构骨架（显示加载进度与 `bootstrap()` 返回的 `notice` 通知文案）→ `bootstrap()` 成功：地址为 `/` 才跳 `/workbench`，其余地址原样保留；失败：显示原因 + 重试
- `nav.ts`：八项固定序（工作台 / 日报 / 价格 / 平衡表 / 物流 / 专题研究 / 知识库 / 设置）；专题研究子项由 `getResearchList()` 驱动；除工作台外为占位页（`PlaceholderPage.vue` 读 `placeholderOwner`）
- `Rail.vue`：字标（衬线）、当前项加粗 + `aria-current` + 左侧点睛红竖条、折叠钮（localStorage `fai.rail`）
- `TopBar.vue`：资讯 ticker（CSS 平移，`prefers-reduced-motion` 静止可横滚）+ 数据源状态点（fresh / stale 令牌类）
- **断点**（令牌唯一来源，CSS `@media` 写像素值、`check.mjs` 校验阈值 ∈ 令牌）：侧栏 `< 980` 塌顶；模块栅格 `< 980` 1 列、`980–1399` 2 列、`1400–1499` 3 列、`≥ 1500` 4 列；焦点带数字卡 `< 1240` 4 张、`≥ 1240` 6 张；最小宽 960，基准 1440×900

### 2.3 工作台与焦点带（R-003）

- `WorkbenchPage.vue` = `FocusBand`（独立行）+ `ModuleGrid`（唯一滚动区）
- `FocusBand.vue`：`getDailyBrief()` → `{brief, reason}`；结论 ≤ 3 条；数字卡按 `semantic` 分"行情 | 指标"两段（行情段引入 `updown.css`，红涨绿跌；指标段红 = 负），段间用玻璃边色竖线分隔，各带双语段标；按断点表截取张数；整带可点 → `/daily/<date>`；`brief = null` → 空态（文案 = reason）；读失败 → 错误态（含诊断）
- 焦点带不在模块目录、不可移除

### 2.4 模块系统（R-004）

`getModuleCatalog()` 返回 `{id, zh, en, description, defaultSpan, order}[]`；`modules/registry.ts` 只做 `id → 组件` 映射。v1 目录（顺序即默认布局，同 designUI §3）：

| order | id | 名称 | 跨列 | 深度 | 形态 |
|---|---|---|---|---|---|
| 1 | market-board | 行情价格 | 2 | 完整 mock | 盘面网格：格 `{state, figure}`，`ok` 显示数值（红涨绿跌）、`holiday` → `休`、`pending` → `待`、`missing` → `–`；头部样例折线 |
| 2 | supply-demand | 库存/供需指标 | 1 | 壳 + 占位 | `ModuleSummary` |
| 3 | logistics-onwater | 物流在途 | 1 | 壳 + 占位 | 同上 |
| 4 | positions | 当前头寸 | 1 | 壳 + 占位 | 同上（不含真实头寸） |
| 5 | doc-catalog | 文档目录 | 1 | 壳 + 占位 | 同上 |
| 6 | watchlist | 关注列表 | 1 | 完整 mock | `DataTable` + `Spark`：关注合约的最新价 / 涨跌 / 涨跌幅（market 语义），`spark` 为 `SparkSeries` |
| 7 | release-calendar | 数据发布日历 | 1 | 完整 mock | 日程列表（日期 / 时间 / 名称 / 来源 / 新鲜度点），升序 |

- **栅格**：`repeat(var(--fai-grid-cols), minmax(0, 1fr))`，模块 `grid-column: span min(defaultSpan, 当前列数)`
- **布局**：`layoutStore` 持有 `order[]`，默认 = 目录顺序；`add`（追加末尾）/ `remove` / `moveUp` / `moveDown`；localStorage `fai.layout`
- **模块库**：`.glass-drawer` 面板，列出全部七个模块并标明是否已在工作台
- **模块壳 DOM 契约**（AC-004-3）：`section.fai-module[data-module-id][data-state]` > `header`（`h3.title` / `span.en` / `span.right` / `span.badge[data-badge="ok|warn|bad|sample"]` / `span.ai[data-ai="none|running|done"]` / `nav.actions`）+ `div.body`（三态或内容）；样例态用虚线边 + 文字"样例"（不靠颜色区分）；错误态 `<code>` 含 `{moduleId, code, message, ts}` 与复制钮；`data-highlight` 持续 1500ms

### 2.5 AI 对话抽屉与 CoT 时间线（R-005）

- `AgentDock.vue`：底部输入栏（全页可见），运行中显示脉冲点
- `AgentDrawer.vue`：`.glass-drawer`，`closed / half(45vh) / tall(80vh)`，localStorage `fai.drawer`；提交时若为 `closed` 自动展开到 `half`
- `CotTimeline.vue`：按 run 分组；步骤行（类型图标 + 摘要 + 时间）可展开详情；终态行（完成 / 失败 / 中止）
- `agent/store.ts`：`main.ts` 里订阅 `agentClient.subscribe()`（应用级），切页 / 收抽屉不中断；`badgesStore` 按事件的 `moduleId` 置 running / done，用户点击模块后清除
- **引导跳转**（AC-005-5）：目标为模块且在工作台 → 不在工作台先 `router.push('/workbench')` → 等挂载 → 滚动 → 高亮；目标模块已移除 → 时间线内联提示 + "添加回工作台"按钮（点击后加回 → 导航 → 等挂载 → 滚动 → 高亮），不改布局；目标为页面且存在 → `router.push(path)`；目标不存在 → 提示且不跳转
- **事件契约**（zod，10 种）：`run.started{runId, sessionId, ts, prompt}`、`step.thinking{stepId, ts, text, done}`、`step.text{同前}`、`step.tool.call{stepId, ts, toolCallId, toolName, argsSummary, moduleId?}`、`step.tool.result{stepId, ts, toolCallId, isError, resultSummary, durationMs?, moduleId?}`、`step.error{stepId, ts, message, willRetry}`（非终态）、`hint.navigate{stepId, ts, target{kind, id}, reason?}`、`run.completed{ts, moduleIds}`、`run.failed{ts, error{code, message, retryable}}`、`run.aborted{ts}`；一次 run 恰好一个终态。`ts` 为 ISO 8601 带偏移，`stepId` 在 run 内单调，文本类 `done=false` 为增量、`done=true` 为权威全文
- **与 pi 的映射**（本 feature 不接 pi，留给 agent-runtime）：`agent_start` → run.started；`message_update.assistantMessageEvent` 的 `thinking_delta/end`、`text_delta/end` → step.thinking / step.text；`tool_execution_start/end` → step.tool.call / result；`message_end.message.stopReason = "error"` → step.error（`willRetry` 由后续 `auto_retry_start` 或 `compaction_end.willRetry` 判定）；`agent_settled` 时归约唯一终态（aborted → aborted；最后一次 `stopReason=error` 或 `auto_retry_end.success=false` → failed；否则 completed）。依据 pi 1.4.0 `docs/json.md`、`docs/rpc.md`。`run.aborted` 只作为事件类型存在（对应 pi 的 `agent_settled.aborted`），v1 不做中止交互
- **mock 回放**：`success / failure / retry / long` 四份脚本，`[{afterMs, event}]`；选择 `?agentScript=` > `window.__FAI_MOCK__.agentScript` > success

### 2.6 图表暗色主题（R-006）

`tokens-build` 生成主题（`backgroundColor: 'transparent'`、序列色、文字与轴线取界面令牌），`theme.ts` 注册 `fai-dark`。样例图：`market-board` 头部一张 ECharts 折线（近 60 日收盘 mock 序列），mock 模式把实例挂 `window.__FAI_TEST__.charts` 供 e2e 读取。`Spark` 为 canvas 自绘，不冒充 ECharts。

### 2.7 数据访问契约与 mock（R-007）

```
bootstrap() -> {appVersion, contractVersion, mode, scenario, notice?}
getModuleCatalog() -> ModuleDef[]
getDailyBrief(date?) -> {brief: DailyBrief | null, reason?: string}
getMarketBoard() -> MarketBoard
getWatchlist() -> WatchlistTable
getReleaseCalendar(from, to) -> CalendarEntry[]
getModuleSummary(moduleId) -> ModuleSummary
getNewsTicker() / getSourceStatus() / getResearchList()
send({sessionId?, message}) / subscribe(cb)
```

- 数值三类形态（AC-007-4）：`Figure = {label, value, unit, decimals, freq, delta?, deltaKind?, semantic, asOf, seriesId?}`；`BoardCell = {state, figure}`（`ok ⇔ figure ≠ null`）；`SparkSeries = {points, unit, freq, semantic, asOf, seriesId}`
- 参数语义（写入 CONTRACT.md）：`date` = 交易日 `YYYY-MM-DD`；`asOf` / `ts` = ISO 8601 带偏移；`getReleaseCalendar(from, to)` 闭区间、升序；v1 全部列表一次返回不分页；`deltaKind='pct'` 时 `delta` 是百分数值
- 校验只在边界：mock / real 实现对自己返回的数据做一次 `parse`（AGENTS §5.2），内部组件直接消费已确定类型的值
- `contract-build.mjs` 由 zod + 方法语义表生成 `contracts/CONTRACT.md` 与 `schema.json`（backend `api` feature 的输入），生成物入库、不手改（`pnpm check --only generated` 重生成后比对）
- **错误形态**（spec R-007 "错误形态"的落点）：统一 `{error: {code, message, retryable}}`，`code` 集合 = mock 实际使用的值（`not_found / validation_error / rate_limited / adapter_error / internal`），写入 CONTRACT.md；模块错误态与 `run.failed` 复用此形态
- **实现切换**（R-007）：`VITE_DATA_MODE = mock | real`，默认 mock；`src/contracts/index.ts` 按此选实现
- **mock 场景**：`normal`；`empty`（模块数据空、`brief=null`）；`error`（`bootstrap()` 与 `getModuleCatalog()` 成功，模块数据方法返回固定错误）；`slow`（延迟 1500ms）；`boot-error`（`bootstrap()` 首次失败、重试成功）。选择 `?scenario=` > `VITE_MOCK_SCENARIO` > normal；`window.__FAI_MOCK__` 可覆盖 fixture 或选脚本
- `real/index.ts` 全部方法抛 `NotImplementedError`；网络调用只许出现在 `src/contracts/real/`（`check.mjs` 一条 grep）

### 2.8 仓库检查（`pnpm check`，`scripts/check.mjs` 一个文件）

| 检查 | 规则 | AC |
|---|---|---|
| generated | 重新生成 `src/design/generated/*`、`index.html` 首帧块与 `contracts/{CONTRACT.md,schema.json}`，与仓库内容逐字比对；`@media` 宽度阈值 ∈ 令牌断点（`max-width` 取断点 − 1） | AC-001-1、AC-007-3 |
| colors | `src/**` 与 `index.html`（首帧块除外）不得出现 `#hex`、`rgb()/hsl()/oklch()` 等颜色函数与 CSS 具名色（只在样式声明值位置识别；`transparent / currentColor / inherit` 除外）；登记处 `src/design/tokens.json` 与 `src/design/generated/*` 豁免；**先跑 `scripts/check-samples/colors/{positive,negative}.css`**（阳性全部命中、阴性不中）；退役色五值不得出现在令牌、生成物与源码 | AC-001-2、AC-001-6 |
| glass | `backdrop-filter` 只出现在 `src/design/glass.css`，`.glass-*` 只有三个类 | AC-001-3 |
| updown | 涨跌令牌只在 `updown.css`；`updown.css` 内引用涨跌令牌的声明只能是 `color:`（不得用于背景 / 边框 / 填充）；`updown.css` 只被 `market-board/`、`watchlist/`、`FocusBand.vue` 引入 | AC-001-5 |
| grid | `grid-template-columns` 不得用裸 `1fr`（须 `minmax()`） | AC-004-6 |
| network | `fetch(` / `XMLHttpRequest` / `WebSocket` / `EventSource` / `axios` 只在 `src/contracts/real/` | AC-007-1 |

运行：`pnpm check [--only <name>]`（name ∈ generated / colors / glass / updown / grid / network）。`pnpm test` = `check` + `typecheck` + `lint` + `test:unit` + `test:e2e`（AC-009-1）。**除 AC-001-2 明定的最小样例外不写样例自检**：其余检查直接对真实仓库运行（AGENTS §5.6）。

### 2.9 规范资产移植（R-008）

从 `D:\FTEngine\design\` 逐份搬八份 UI 条目到 `design/ui/`，另建 `UI_DARK_ADDITIONS.md`（本 feature 新增值：三层玻璃映射、z 层级、两个新增字号、圆角例外、窗口基准）与 `design/charts/{PALETTE_CORE,PALETTE_DARK}.md`。

每份：保留原 `id` 与结构，front matter 追加 `source`（原路径）、`source_verified`、`migrated`（日期）、`adaptation: dark-glass`；正文末尾 `## 暗色适配` 段写"原值 → 新值 / 不变 + 为什么"，未采用的规定在段内一句说明原因（不逐锚列表）。`design/*/README.md` 登记文件、来源、日期、采用范围。

## 3. 数据与存储

- 无服务端数据、不写用户数据目录（归 desktop-shell / settings feature）
- 浏览器本地存储三个键：`fai.rail`、`fai.drawer`、`fai.layout`（直接 `localStorage` + 前缀，不做抽象层）
- mock 数据在 `src/contracts/mock/fixtures/*.json`（含 `module-catalog`、`daily-brief`、`market-board`、`watchlist`、`release-calendar`、`module-summaries`、`news`、`sources`、`research`），不含真实头寸 / 凭证 / 私有文档
- 生成物入库：`src/design/generated/*`、`index.html` 首帧块、`contracts/{CONTRACT.md,schema.json}`

## 4. 关键流程

1. **启动**：静态骨架 → 挂载 → `bootstrap()` → `/` 才跳 `/workbench`；失败显示原因 + 重试
2. **布局变更**：模块库添加 / 模块壳上移下移移除 → `layoutStore` → `localStorage` → 刷新还原（丢弃目录外 id）
3. **一次 agent 运行**：提交 → `send()` → 事件流（增量合并、`done` 替换、按 stepId 去重）→ 唯一终态；`moduleId` 同步角标；切页 / 收抽屉不影响
4. **窄窗口**：`matchMedia` 监听令牌断点 → 侧栏 / 栅格 / 焦点带卡数切换

## 5. 验收对应

| AC | 位置与验证 |
|---|---|
| AC-001-1 | `tokens-build` + `check --only generated`（含 `@media` 阈值） |
| AC-001-2、AC-001-6 | `check --only colors` |
| AC-001-3 | `check --only glass`；M-01 人工看层次 |
| AC-001-4 | `format.spec`、`typography.spec`（类）；`tokens.spec` 浏览器内读计算字体族 |
| AC-001-5 | `check --only updown`；组件测试：market 带涨跌类、analysis 不带；e2e：`.sem-market` 只在登记容器且背景非涨跌色 |
| AC-002-1 | e2e：首帧骨架可见 → 工作台（骨架由 T-08 提供） |
| AC-002-2 | e2e：八项顺序、`aria-current`、直接打开非工作台地址并刷新仍停留 |
| AC-002-3 | e2e：`__FAI_MOCK__` 注入研究项 → 菜单多一项 |
| AC-002-4 | 组件：ticker 条目、状态点类 |
| AC-002-5 | e2e：折叠 → reload 仍折叠 |
| AC-002-6 | e2e：960 / 979 / 981 / 1239 / 1241 / 1399 / 1401 / 1499 / 1501 / 1440×900，断言侧栏形态、栅格列数、焦点带卡数、无横向溢出 |
| AC-002-7 | e2e：`boot-error` 显示原因 → 重试 → 进入工作台 |
| AC-003-1、AC-003-3、AC-003-4 | 组件：结论数、空态文案、market / analysis 取色 |
| AC-003-2 | e2e：点击 → `/daily/<date>` |
| AC-003-5 | 组件：market 只在行情段、analysis 只在指标段；M-03 |
| AC-003-6 | e2e：模块库无焦点带、无移除钮；增删模块后仍在 |
| AC-004-1、AC-004-2 | e2e：默认七个且按目录顺序、模块库七项带状态与 `description`、`grid-column` 取 `min(defaultSpan, 列数)`；增删移 → reload 保持 |
| AC-004-3 | 组件逐模块 + e2e 页面遍历结构契约 |
| AC-004-4 | 组件三态 + 剪贴板；e2e：`error` 场景模块错误态可达 |
| AC-004-5 | 组件：盘面三态格、关注列表数值与红涨绿跌、日程升序；M-04 |
| AC-004-6 | `check --only grid` |
| AC-005-1 | e2e：八路由输入栏可见、提交 → 抽屉展开显示用户消息 |
| AC-005-2 | 组件：success / failure / retry 回放，step.error 呈现、唯一终态行 |
| AC-005-3 | e2e：`long` 脚本切页与收抽屉两种，同一 run、步骤增加、无重复 |
| AC-005-4 | e2e：running → done → 点击 → none |
| AC-005-5 | e2e：布局内 → 高亮；已移除（从 `/prices` 发起）→ 提示 + 加回后完成四步；不存在 → 提示且不跳 |
| AC-005-6 | unit：四份脚本与事件契约校验、恰好一个终态；CONTRACT.md 含十种事件 |
| AC-005-7 | e2e：三态切换 + reload 保持；运行中指示出现 / 终态消失 |
| AC-006-1、AC-006-2 | unit：主题不含退役色；序列 / 类目色对卡面 ≥ 3、文字用色 ≥ 4.5（中性退后色豁免登记） |
| AC-006-3、AC-006-4 | e2e：`getOption().color` 与令牌一致、`backgroundColor` 透明；M-08 |
| AC-007-1 | `check --only network` |
| AC-007-2 | unit：五种场景；e2e：normal / empty / error / slow |
| AC-007-3 | `check --only generated`（重生成并比对）+ unit：CONTRACT.md 覆盖全部方法、错误形态与字段描述 |
| AC-007-4 | unit：fixtures 全部过 schema；Figure 缺元数据、`BoardCell` ok 缺 figure、`SparkSeries` 缺元数据 → 失败 |
| AC-008-1、AC-008-2、AC-008-3 | unit `design-registry.spec`：条目 front matter 齐备、令牌 `source` 可解析、PALETTE_DARK 覆盖 14 个 palette-core 原色（按不同 hex 计） |
| AC-009-1 | `pnpm test` 退出码 0 |
| AC-009-2 | `manual-acceptance.md`（M-01 ~ M-08）+ Handoff 截图 |

## 6. 风险

| 风险 | 对策 |
|---|---|
| Node 25 / TS 7 / Vite 8 / Vitest 5 组合未验证 | T-01 冒烟；vue-tsc 不兼容则锁 TS 5.9.x |
| Playwright 找不到本机 Chrome | `channel` 回退 `msedge`，再不行 `playwright install chromium` |
| happy-dom 无 `matchMedia` / 计算样式 | 断点与计算样式只在 Playwright 验 |
| 暗色序列色区分度（ΔE2000 13.2） | 接受并登记；chart-templates 画出真实季节图后复核 |
| 生成物漂移 | `pnpm check --only generated` 在 `pnpm test` 首位，覆盖 `design/generated`、首帧块与 `contracts/*` |

**回滚**：删除 `frontend/`、`design/`、`specs/frontend-workbench/`；去掉 `.gitignore` 追加行与 `specs/README.md` 本 feature 行；`docs/designUI.md` 只回退本 feature 改的引用指针（用 `git checkout <起点> -- docs/designUI.md`，回退前确认该文件无其他改动）；`docs/decisions/20261027-updown-scope.md` 不删除（ADR 历史），在 `docs/plan.md` §3 标 superseded 并另写后继 ADR。
