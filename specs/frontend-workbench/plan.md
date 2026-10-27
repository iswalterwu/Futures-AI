# Feature: frontend-workbench 实施计划（plan.md）

> Plan 阶段产物：由 spec.md（2026-10-27 Gate 1 冻结版）生成的设计成果。需求在 spec.md（what/why），本文承载全部实现机制、契约细则与验收落点。
> §2.1 暗色配色表已按 spec Q-003 的方式由 Walter 确认（2026-10-27：采用 A 等亮，中性色调整一并确认），实现时直接登记为令牌。

## 1. 技术方案

- **栈**（D-008 / D-004）：Vue 3.5 + Vite 8 + TypeScript；状态 Pinia 4；路由 vue-router 5；图表 ECharts 6（经 vue-echarts 8 挂载）；契约 schema 用 zod 4（运行时校验示例数据 + 生成 JSON Schema 给后端）
- **测试**：Vitest 5 + @vue/test-utils + happy-dom（单元 / 组件）；Playwright 1.64（端到端，`channel: "chrome"` 复用本机 Chrome，不下载浏览器；备选 `msedge`）；ESLint 10 + eslint-plugin-vue + Prettier（`endOfLine: lf`）
- **工具链**：pnpm 11；Node ≥ 22.12（`engines` 声明；开发机 25.2.1）；确切版本在实施首任务（依赖安装冒烟）锁进 `pnpm-lock.yaml`
- **运行模式**：`VITE_DATA_MODE = mock | real`（默认 mock；real 为未实现桩）；mock 场景 `VITE_MOCK_SCENARIO = normal | empty | error | slow`，端到端测试可用 URL 参数 `?scenario=` 覆盖
- **不触碰** `backend/`；共享文件只有根 `.gitignore`（追加 `node_modules/`、`frontend/dist/`、`frontend/test-results/`、`frontend/playwright-report/`、`frontend/coverage/`）与 `specs/README.md`
- **目录**：

  ```
  frontend/
  ├── package.json / pnpm-lock.yaml / vite.config.ts / tsconfig*.json / playwright.config.ts / vitest.config.ts
  ├── .gitattributes            # * text=auto eol=lf（只约束 frontend/ 树）
  ├── index.html                # 含静态加载页骨架（挂载前即可见，无空白帧）
  ├── contracts/
  │   ├── CONTRACT.md           # 契约文档（由 zod schema 生成字段表，守卫对拍）
  │   └── schema.json           # JSON Schema（zod 4 toJSONSchema 生成；backend api feature 的输入）
  ├── scripts/
  │   ├── tokens-build.mjs      # tokens.json → generated/tokens.css + tokens.ts + echarts-theme.json
  │   ├── contract-build.mjs    # zod → CONTRACT.md + schema.json
  │   └── guards/               # 静态守卫（§2.8），每个守卫一个文件 + fixtures/
  ├── src/
  │   ├── main.ts / App.vue
  │   ├── app/                  # 外壳：AppShell.vue、Rail.vue、TopBar.vue、LoadingScreen.vue、router.ts、nav.ts（菜单注册表）
  │   ├── design/
  │   │   ├── tokens.json       # 令牌唯一来源（§2.1）
  │   │   ├── tokens.schema.json
  │   │   ├── glass.css         # 三层玻璃的唯一定义处
  │   │   ├── updown.css        # market 语义（红涨绿跌）颜色规则的唯一定义处
  │   │   ├── base.css          # 背景渐变、字体、数值规则、reset
  │   │   ├── generated/        # tokens.css / tokens.ts / echarts-theme.json（生成物，入库，守卫对拍）
  │   │   └── theme.ts          # registerTheme('fai-dark') + 样例图 option
  │   ├── workbench/            # WorkbenchPage.vue、FocusBand.vue、ModuleGrid.vue、ModuleLibrary.vue
  │   ├── modules/              # registry.ts + ModuleShell.vue + 每模块一目录（§2.4）
  │   ├── agent/                # AgentDock.vue（输入栏）、AgentDrawer.vue、CotTimeline.vue、store.ts、events.ts（事件契约）
  │   ├── contracts/            # types.ts（zod schema）、client.ts（接口）、mock/（fixtures + 场景 + 回放脚本）、real/（桩）
  │   ├── stores/               # app.ts（启动阶段）、layout.ts（模块布局）、ui.ts（侧栏/抽屉）、badges.ts
  │   ├── shared/               # format.ts（数值）、storage.ts（持久化接口）、components/（Badge、Chip、EmptyState、DataTable、BoardGrid、Spark）
  │   └── pages/                # 7 个占位页（Daily/Prices/Balance/Logistics/Research/Knowledge/Settings）
  ├── tests/                    # vitest：unit/ + component/
  └── e2e/                      # playwright：shell / workbench / modules / agent / breakpoints / theme
  design/
  ├── ui/                       # FTEngine UI 条目移植（§2.9）+ README.md 索引
  └── charts/                   # PALETTE_CORE.md（原件）+ PALETTE_DARK.md（暗色适配表）+ README.md
  ```

## 2. 模块设计

### 2.1 令牌与设计系统（R-001）

**令牌文件** `src/design/tokens.json`：扁平数组，每个令牌 `{name, value, source, status?, note?}`；`source` 必填且可解析（`docs/designUI.md#<节>`、`design/ui/<文件>#<锚>` 或 `spec:R-00x` 本 feature 新增）；`status: candidate` 标未确认值（AC-008-2 守卫核 source 可解析）。生成器 `scripts/tokens-build.mjs` 产出：

- `generated/tokens.css`：`:root { --fai-<name 的点换连字符>: <value> }`
- `generated/tokens.ts`：`export const T = {...} as const`（脚本侧取值只经它）
- `generated/echarts-theme.json`：主题对象（§2.6）

守卫 `tokens-sync` 重新生成并逐字对比三个生成物（AC-001-1）。

**令牌分组与来源**：

| 组 | 内容 | 来源 |
|---|---|---|
| color.bg | 渐变三段 `#1b1c1f → #121315 → #0f1012` | designUI §2.1 |
| color.glass | 面 `.035 / .045 / .06`（三层）、边 `.07 / .09 / .12`、模糊 18 / 18 / 28 px、抽屉面 `rgba(24,25,28,.82)` | designUI §2.1 |
| color.text | 主 `#e8e6e0`、次 `#9a9892`、弱 `#8f8d87` | designUI §2.1 |
| color.updown | 涨 `#C98A8F`、跌 `#8FB8A4` | designUI §2.2 / D-011 |
| color.accent / amber / link / status | 点睛红、琥珀、链接蓝、ok / warn / bad（§2.1 配色表） | design/ui/UI_COLORS#暗色适配 |
| color.chart.* | 序列 7 色、正负、类目、区间带、均值、模型线、轴线/网格（白透明 .28 / .08）、浮窗 | design/charts/PALETTE_DARK；轴线 = FTEngine chart_chrome 反相 |
| font.* | serif / sans / mono 三族栈（原值照搬） | design/ui/UI_FONTS#stacks |
| type.* | kpi 25、wordmark 24、h1 21、sec_title 17.5、body 13（行高 1.5）、nav 12.5、card_t 12.5、meta 12、tick 11、footnote 11、th 10.5、tag 10、ngroup 9.5；新增 timeline_step 12.5、ticker 12 | design/ui/UI_FONTS#main_scale；新增 = spec:R-005 |
| space.* | grid_gap 12、section_gap 26、content_pad_x 26、card_h_pad `9px 13px 7px` | design/ui/UI_LAYOUT#spacing |
| radius.* | base 2；例外：drawer 8、tooltip 8、pill 999 | design/ui/UI_LAYOUT#radius_exceptions（例外为本 feature 登记） |
| z.* | focus 10、module 1、drawer 50、dock 60、toast 70 | spec:R-001 |
| breakpoint.* | railCollapse 980、focusWide 1240、grid3 1400、grid4 1500；window.min 960；window.base 1440×900 | design/ui/UI_LAYOUT#narrow + spec Q-004 |

**三层玻璃**：`src/design/glass.css` 只定义 `.glass-focus`、`.glass-module`、`.glass-drawer` 三个类（各自引面 / 边 / 模糊令牌）；全树 `backdrop-filter` 只许出现在这个文件、且 ≤ 3 条规则（守卫 `glass-tiers`，AC-001-3）。

**字体三族与数值**：`base.css` 定义 `.t-serif / .t-sans / .t-mono`；数值统一类 `.num`（mono + `font-variant-numeric: tabular-nums` + 右对齐）。`shared/format.ts`：`fmtValue(v, {decimals, unit})`、`fmtDelta(v, {decimals, pct})`——先按显示位四舍五入再判零；空值 → `–`（U+2013）；差值正号；零中性（无号、无色、`-0` 归 0）；返回 `{text, tone: 'up'|'down'|'neutral'}`，组件按 `semantic` 选色（market → updown 令牌；analysis → chart.neg = 红、chart.pos = 青雀头黛亮化）。共享组件 `Num` 只输出语义类（`sem-market` / `sem-analysis` + `is-up` / `is-down` / `is-neutral`）；market 语义类的颜色规则只写在 `src/design/updown.css`（行情价格、关注列表、焦点带引入），analysis 语义类的颜色规则在共享样式中引 chart.pos / chart.neg。

**涨跌色作用域**（spec R-001，Q-015 修订）：涨跌令牌（`--fai-color-updown-*` / `T.color.updown`）只在 `src/design/updown.css` 中引用；`updown.css` 只许被登记的行情语义位置引入——`src/modules/market-board/`、`src/modules/watchlist/`、`src/workbench/FocusBand*`（焦点带只用于契约声明为 market 语义的数字，见 §2.3）；守卫 `updown-scope`（AC-001-5）；其他位置的方向色一律走 analysis 语义。

**暗色配色表（Q-003，2026-10-27 Walter 确认：A 等亮）**——方法：彩色在 OKLCH 空间保持色相、把明度抬到下限（序列 0.70、界面语义 0.64–0.70）、按需压或提色度；**有意退后的中性色反向处理**（白底上“浅 = 安静”，黑底上浅色反而最醒目，故改暗 / 降透明度，使其在黑底上同样退后）；D-011 已定的三个值直接采用。对比度按 WCAG 相对亮度、对图实际所在的卡面 `#1D1E20`（玻璃 .045 叠在 `#121315` 上）计。**阈值**：线条与色块（非文字图形，WCAG 1.4.11）≥ 3 : 1；会作文字用的颜色（涨、跌、链接、点睛红、琥珀）≥ 4.5 : 1；有意退后的中性色（其他、区间带）不设下限（白底版同样低于 3 : 1）。对照样张：`specs/frontend-workbench/assets/palette-dark-candidates.html`（白底原色 / 黑底候选并排，可切换单看；同一份数据画年份线、季节图常用形态、类目堆叠、正负柱、十大区）。

| 用途 | 原色（PALETTE_CORE） | 暗色值 | 对比度 | 备注 |
|---|---|---|---|---|
| 主序列 / 主文字（墨） | `#16191D` | `#E8E6E0` | 13.4 | D-011 定值 |
| 序列 1 茹藘（上一年 / 负 / 红） | `#A35F65` | `#C98A8F` | 6.0 | D-011 定值（= 涨色） |
| 序列 2 沙饧 | `#BFA670` | `#BFA670` | 7.1 | 原值已够亮，不动 |
| 序列 3 苍艾 | `#5A4B3B` | `#97826C` | 4.5 | 明度只抬到 0.62、提色度，保住"深土"身份；不作文字用 |
| 序列 4 吐绶蓝 | `#4182A4` | `#6CA7C7` | 6.3 | |
| 序列 5 缥碧 | `#80A492` | `#8FB8A4` | 7.6 | D-011 定值（= 跌色） |
| 序列 6 碧落 | `#AED0EE` | `#B0D0EB` | 10.4 | 基本不动 |
| 正 / 类目 1 青雀头黛 | `#354E6B` | `#87A1BF` | 6.3 | |
| 分档 窃蓝 | `#88ABDA` | `#8BABD6` | 7.1 | |
| 大区 驼褐 | `#7C5B3E` | `#B08968` | 5.3 | |
| 其他 / 残差 明月珰 | `#D4D3CA` | `#54534B` | 2.2 | 有意退后：白底上浅灰安静（1.5），黑底上同一浅灰反而是堆叠柱里最亮的一块，改取暗灰（保持色相，L 0.44） |
| 五年区间带 霜地 | `#C7C6B6`（α .3） | `#C7C6B6`（α .16） | 1.4（叠加后） | 有意退后：白底叠加后 1.2；黑底若仍用 α .3 为 2.1，成一大块灰 |
| 均值 / 参照 绍衣 | `#A8A19C` | 不变 | 6.5 | 细点线，黑底上可辨不抢活 |
| 模型线 齐紫 | `#6C216D` | `#C478C3` | 5.4 | |
| 界面点睛红（朱） | `#C00000` | `#DF5C4D` | 4.6 | 只用于当前项竖条、编号、锁定环；与涨色 ΔE 11 |
| 界面琥珀（非实绩 / 待更新） | `#B8860B` | `#C69633` | 6.2 | |
| 链接蓝（藏蓝） | `#0F4C81` | `#6A9DD1` | 5.8 | |

**年份线层次（已裁定）**：白底上，茹藘（上一年，4.8）比沙饧 / 缥碧 / 碧落三条旧年份（2.4 / 2.7 / 1.6）醒目；黑底上这三条反而都比茹藘亮（7.1 / 7.6 / 10.4 对 6.0），上一年不如白底上突出。对照过两个方案：A 等亮（上表）与 B 递暗（只改有先后的序列线，rank 2–6 对比度逐档降到 3.0：沙饧 `#A98B49` · 苍艾 `#8D8175` · 吐绶蓝 `#2F84AD` · 缥碧 `#557F6B` · 碧落 `#516C84`，色度 ≤ 原色 1.2 倍，最小色差 8.1）。**2026-10-27 Walter 裁定采用 A**。取舍：A 一套值同时服务序列与类目（年份线缥碧与 D-011 跌色同值、令牌不分叉），最小色差 8.5 高于 B；代价是黑底上旧年份不递暗，主次靠线宽（2.6 / 1.8 / 1.4 / …）与主序列亮度区分。对照证据：样张页首“递暗版对照”三栏。

序列七色两两最小 ΔE（OKLab×100）= 8.5（沙饧 / 缥碧），低于 FTEngine 亮色版的 21.5——暗底压缩了可用明度区间，v1 接受，chart-templates feature 画出真实季节图后再复核。

**状态语义色**（badge / 状态点 / 灯）：ok = 吐绶蓝亮化、warn = 琥珀、bad = 点睛红、sample = 虚线边不着色、fresh = ok、stale = warn。**绿色全站只表示"跌"**（行情语义内），状态不用绿，避免与红涨绿跌互相串味。

### 2.2 应用外壳与导航（R-002）

- `AppShell.vue`：`.shell` 两栏网格（`var(--fai-rail-w) minmax(0,1fr)`，`.content { min-width: 0 }`，FTEngine PG-1FR 豁免同款）+ 顶栏 + 底部 `AgentDock` + `AgentDrawer`；`< 980px` 时切 `.shell--collapsed`：侧栏变顶部横向导航条（可横滚），`.content` 单列
- `LoadingScreen.vue`：`index.html` 内置同构静态骨架（logo 字标 + 进度文案），`main.ts` 挂载后 `appStore.phase` 为 `loading` 时继续渲染同一骨架，`dataClient.bootstrap()` 成功 → `ready` → 路由到 `/workbench`；失败 → `failed`（文案 + 重试）
- `nav.ts` 注册表：`[{id, path, zh, en, placeholderOwner?}]` 八项固定序：工作台 `/workbench`、日报 `/daily/:date?`、价格 `/prices`、平衡表 `/balance`、物流 `/logistics`、专题研究 `/research`（子项由 `dataClient.getResearchList()` 驱动，`/research/:id`）、知识库 `/knowledge`、设置 `/settings`；`/` 重定向 `/workbench`；占位页 `pages/PlaceholderPage.vue` 读 `placeholderOwner`（如 `daily-report`）渲染空态文案
- `Rail.vue`：字标（serif）、分组、当前项（加粗 + 左侧点睛红竖条；塌成顶栏时竖条移到底边）、折叠钮；状态经 `uiStore.railCollapsed` 持久化（key `fai.v1.ui.rail`）
- `TopBar.vue`：`NewsTicker`（CSS 平移动画循环，`prefers-reduced-motion` 时静止可横滚）+ `SourceStatus`（每源一点：fresh / stale 令牌 + 名称 + 截至时间）
- 断点来源唯一 = 令牌。不引 PostCSS 插件：CSS 中的 `@media` 宽度阈值写像素字面量，守卫 `tokens-sync:media` 扫描全部 `@media (min-width|max-width: Npx)`，要求 N ∈ 令牌断点集合（`max-width` 取断点 − 1，如 979）；脚本侧经 `tokens.ts` 常量 + `matchMedia`

### 2.3 工作台与焦点带（R-003）

- `WorkbenchPage.vue` = `FocusBand`（`.glass-focus`，sticky 顶部）+ `ModuleGrid`
- `FocusBand.vue`：读 `dataClient.getDailyBrief()` → `DailyBrief | null`；结论 ≤ 3 条（serif 标题 + sans 正文首句）、数字卡 4–6 个（`Figure`，§2.7）；`≥ 1240` 一行六卡，否则一行四卡（breakpoint.focusWide）；整带可点 → `router.push('/daily/' + brief.date)`；`null` → 空态（原因文案来自契约 `reason`）
- 数字卡取色：`figure.semantic === 'market'` → market 语义类（引入 `src/design/updown.css`；焦点带是登记的行情语义位置之一，spec R-001 已按 Q-015 修订为"只用于行情语义的数字"）；`analysis` → chart.pos / chart.neg

### 2.4 模块系统（R-004）

**注册表** `modules/registry.ts`：

| id | 中文 | 英文副标 | 默认跨列 | 深度（Q-001 = B） | 形态 |
|---|---|---|---|---|---|
| market-board | 行情价格 | Market Board | 2 | 完整 mock | `BoardGrid`：列 = 合约，行 = 日期 + 统计行；格 `{value, state: ok/holiday/pending/missing}` → `休` / `待`（琥珀）/ `–`；涨跌字色 |
| watchlist | 关注列表 | Watchlist | 1 | 完整 mock | `DataTable` + `Spark`（迷你折线，墨线 + 末点）；内容 = 关注的合约价格（最新价 / 涨跌 / 涨跌幅），market 语义、红涨绿跌（Q-015） |
| release-calendar | 数据发布日历 | Release Calendar | 1 | 完整 mock | 日程列表（日期 / 名称 / 来源 / 预计时间 / 新鲜度点） |
| supply-demand | 库存/供需指标 | Supply & Demand | 1 | 壳 + 占位 | `ModuleSummary`（标题行 + 示例指标 3 条 + "内容随 domain feature 交付"） |
| logistics-onwater | 物流在途 | Logistics | 1 | 壳 + 占位 | 同上 |
| positions | 当前头寸 | Positions | 1 | 壳 + 占位 | 同上（mock 不含真实头寸） |
| doc-catalog | 文档目录 | Documents | 1 | 壳 + 占位 | 同上 |

**栅格** `ModuleGrid.vue`：`grid-template-columns: repeat(var(--fai-grid-cols), minmax(0, 1fr))`；`--fai-grid-cols` 按断点 1 / 2 / 3 / 4（< 980 / ≥ 980 / ≥ 1400 / ≥ 1500）；模块 `grid-column: span min(跨列, 列数)`；固定顺序填入、不拖拽。

**布局 store** `stores/layout.ts`：`{enabled: string[], order: string[]}`，默认七个按注册表顺序；动作 `add(id)`（追加末尾）、`remove(id)`、`moveUp(id)`、`moveDown(id)`；经 `shared/storage.ts` 的 `StorageAdapter` 持久化（key `fai.v1.layout`，实现 = 浏览器本地存储；接口预留文件存储）。`ModuleLibrary.vue`：抽屉式列表，显示未启用模块 + 添加钮。

**模块壳 DOM 契约**（AC-004-3 守卫按注册表逐模块核）：

```
section.fai-module[data-module-id][data-state="loading|ready|empty|error"]
├── header.fai-module__head
│   ├── h3.fai-module__title            # 中文（sans，card_t）
│   ├── span.fai-module__en             # 可选：英文副标（大写宽字距，en_sub）
│   ├── span.fai-module__right          # 可选：单位 / 截至时间（mono）
│   ├── span.fai-module__badge[data-badge="ok|warn|bad|sample"]
│   ├── span.fai-module__ai[data-ai="none|running|done"]
│   └── nav.fai-module__actions          # 上移 / 下移 / 移除
└── div.fai-module__body                # 三态：Loading / EmptyState / ErrorState（含 <code> 可复制诊断）或模块内容
```

`ModuleShell.vue` 提供该结构与插槽；模块组件只填 body。错误态诊断 = `{moduleId, scenario, error.code, error.message, ts}` 文本 + 复制钮（剪贴板）。

### 2.5 AI 对话抽屉与 CoT 时间线（R-005）

- `AgentDock.vue`：固定底部输入栏（全页可见，`z.dock`）；运行中显示脉冲指示 + 中止钮
- `AgentDrawer.vue`：`.glass-drawer`，高度两档（`half` = 45vh、`tall` = 80vh）+ 收起；状态 `uiStore.drawer`（key `fai.v1.ui.drawer`）
- `CotTimeline.vue`：按 run 分组的步骤列表；每步一行（类型图标 + 摘要 + 时间）可展开详情（思考全文 / 工具参数与结果摘要 / 文本）；终态行（完成 / 失败 / 中止）
- `agent/store.ts`（Pinia）：`sessions`、`runs: Record<runId, Run>`、`steps`；**在 `main.ts` 订阅 `agentClient.subscribe()`（应用级，不随组件卸载）**，所以切页 / 收抽屉不影响事件接收（AC-005-3）；`badgesStore` 监听事件中的 `moduleId` → `running` / `done`，模块进入视口且用户展开或点击后 `clear(moduleId)`
- 引导跳转：`hint.navigate` 事件 → 时间线渲染入口按钮 → `router.push` + `badgesStore.highlight(moduleId, 1500ms)`（模块壳加 `data-highlight`）

**事件契约** `agent/events.ts`（zod）：

```ts
type AgentEvent =
  | { type: 'run.started';     runId; sessionId; ts; prompt: string }
  | { type: 'step.thinking';   runId; stepId; ts; text: string; done: boolean }
  | { type: 'step.text';       runId; stepId; ts; text: string; done: boolean }
  | { type: 'step.tool.call';  runId; stepId; ts; toolCallId; toolName; argsSummary: string; args?: object; moduleId?: string }
  | { type: 'step.tool.result';runId; stepId; ts; toolCallId; isError: boolean; resultSummary: string; durationMs?: number; moduleId?: string }
  | { type: 'hint.navigate';   runId; stepId; ts; target: { kind: 'module' | 'page'; id: string }; reason?: string }
  | { type: 'run.completed';   runId; ts; moduleIds: string[] }
  | { type: 'run.failed';      runId; ts; error: { code: string; message: string; retryable: boolean } }
  | { type: 'run.aborted';     runId; ts }
// ts = ISO 8601；stepId 在 run 内单调；text 类事件 done=false 为增量、done=true 为权威全文（替换）
```

**与 pi RPC 事件的对照**（Q-014；本 feature 不接 pi，映射由 agent-runtime feature 实现，本表保证可映射）：

| 本契约 | pi 事件（docs/json.md） |
|---|---|
| run.started | `agent_start`（prompt 响应 `disposition: started` 之后） |
| step.thinking | `message_update.assistantMessageEvent` = `thinking_delta`（done=false）/ `thinking_end`（done=true，content 替换） |
| step.text | 同上 `text_delta` / `text_end` |
| step.tool.call | `tool_execution_start`（toolCallId / toolName / args） |
| step.tool.result | `tool_execution_end`（result / isError / durationMs） |
| run.completed | `agent_settled`（aborted=false） |
| run.aborted | `agent_settled`（aborted=true） |
| run.failed | assistant `message_end.stopReason = "error"`（errorMessage） |
| hint.navigate | 无直接对应；候选 = 专用 MCP 工具（如 `ui_navigate_hint`）的 `tool_execution_end`，由 agent-runtime 决定 |
| moduleId | Backend 按工具名 / 参数映射（如 `fetch_series` 的 series_id → 绑定它的模块） |
| stepId | `${assistantMessageIndex}.${contentIndex}` |

**mock 回放** `contracts/mock/agent/`：`success.ts`、`failure.ts`、`long.ts`（≥ 20 步、跨 15 s，供切页测试）——`[{afterMs, event}]`；`MockAgentClient.send()` 返回 runId 并按脚本用定时器推送；`abort()` 推 `run.aborted`。

### 2.6 图表暗色主题（R-006）

- `tokens-build` 从 `color.chart.*` 生成 `generated/echarts-theme.json`：`backgroundColor: 'transparent'`、`color: [序列 7 色]`、`textStyle / axisLine / splitLine / tooltip` 取界面令牌；`theme.ts` 调 `echarts.registerTheme('fai-dark', theme)`
- 样例图：`watchlist` 模块内 `Spark`（canvas 自绘，不经 ECharts）之外，`market-board` 模块头部放一张 ECharts 折线（主力合约近 60 日收盘，mock 序列）作为主题基线（AC-006-3）；chart-templates feature 的 14 种 kind 以此主题为起点
- 守卫 `theme-contrast`：主题序列色 ∩ 退役色（design/charts/PALETTE_CORE 的 `palette-retired` 块）= ∅（AC-006-1）；每个序列 / 类目色对暗色卡面 `#1D1E20` 的 WCAG 对比度 ≥ 3（非文字图形）、作文字用的色（涨、跌、链接、点睛红、琥珀）≥ 4.5，有意退后的中性色（其他、区间带）豁免并登记（AC-006-2）；端到端读取图实例 `getOption().color` 与 `T.color.chart.series` 一致（AC-006-3）、`backgroundColor` 透明（AC-006-4）

### 2.7 数据访问契约与 mock（R-007）

`contracts/client.ts`：

```ts
interface DataClient {
  bootstrap(): Promise<BootstrapInfo>                       // {appVersion, contractVersion, mode, scenario, dataDirReady}
  getDailyBrief(date?: string): Promise<DailyBrief | null>  // null + reason 经 getDailyBriefStatus()
  getDailyBriefStatus(date?: string): Promise<{available: boolean; reason?: string}>
  getMarketBoard(): Promise<MarketBoard>                    // 行情价格
  getWatchlist(): Promise<WatchlistTable>
  getReleaseCalendar(from: string, to: string): Promise<CalendarEntry[]>
  getModuleSummary(moduleId: string): Promise<ModuleSummary> // 壳模块占位内容
  getNewsTicker(): Promise<NewsItem[]>
  getSourceStatus(): Promise<SourceStatus[]>
  getResearchList(): Promise<ResearchItem[]>
}
interface AgentClient {
  send(input: { sessionId?: string; message: string }): Promise<{ runId: string; sessionId: string }>
  abort(runId: string): Promise<void>
  subscribe(handler: (e: AgentEvent) => void): () => void
  getHistory(sessionId: string): Promise<AgentEvent[]>
}
```

- 数值字段统一 `Figure = { label, value: number | null, unit, decimals, freq: '1d'|'1w'|'1m', delta?: number | null, deltaKind?: 'abs'|'pct', semantic: 'market'|'analysis', asOf: string, seriesId?: string }`（单位 / 频率 / 语义 / 截至时间四项必填，AC-007-4）——`seriesId` 对齐 data-layer 的序列 ID（溯源）；`MarketBoard.cells[][]` = `{ value, state }`；错误形态 `{ error: { code, message, retryable } }`，code 集合与 data-layer 对齐（not_found / unauthorized / validation_error / internal / adapter_error / rate_limited）
- `contracts/types.ts` 全部用 zod 定义；`mock/fixtures/*.json` 在单元测试里逐个 `schema.parse`（AC-007-4）；`contract-build.mjs` 由 schema 生成 `contracts/CONTRACT.md`（方法表 + 字段表 + 语义说明 + 错误码表 + `contractVersion`）与 `schema.json`，守卫 `contract-doc` 重生成后 diff（AC-007-3）
- `mock/index.ts`：场景 `normal / empty / error / slow`（slow = 每次调用延迟 1500 ms；error = 每方法返回固定错误）；选择顺序 URL `?scenario=` > `VITE_MOCK_SCENARIO` > normal；测试注入：mock 模式下若存在 `window.__FAI_MOCK__`（Playwright `addInitScript` 写入）则按其覆盖对应 fixtures（如研究列表追加一项，AC-002-3）
- `real/index.ts`：所有方法 `throw new NotImplementedError('api feature')`；守卫 `network-scope` 只允许 `src/contracts/real/` 出现 `fetch(` / `XMLHttpRequest` / `WebSocket` / `EventSource`（AC-007-1）

### 2.8 静态守卫清单（`pnpm guards`，全部在 `scripts/guards/`）

| 守卫 | 检查 | AC |
|---|---|---|
| tokens-sync | `generated`：重新生成 tokens.css / tokens.ts / echarts-theme.json 并逐字 diff；`media`：CSS `@media` 宽度阈值 ∈ 令牌断点（max-width 取断点 − 1） | AC-001-1 |
| color-literals | `literals`：扫 `src/**/*.{vue,ts,css}` 的 `#hex`、`rgb(a)`、`hsl`、`oklch` 字面量，允许名单 = `tokens.json`、`generated/`；`retired`：退役色（五个 hex）不在 tokens.json、生成物与源码 | AC-001-2、AC-001-6 |
| glass-tiers | `backdrop-filter` 只在 `glass.css` 且 ≤ 3 规则；类名只许三个 | AC-001-3 |
| updown-scope | `--fai-color-updown-*` / `T.color.updown` 只在 `src/design/updown.css` 中引用；`updown.css` 只被 `src/modules/market-board/`、`src/modules/watchlist/`、`src/workbench/FocusBand*` 引入 | AC-001-5 |
| bare-1fr | `grid-template-columns` 含未包 `minmax()` 的 `1fr`（`.shell` 规则豁免并登记） | AC-004-6 |
| network-scope | 网络 API 只在 `src/contracts/real/` | AC-007-1 |
| contract-doc | zod → CONTRACT.md / schema.json 重生成 diff | AC-007-3 |
| design-registry | `entries`：README 登记的 `design/ui/*.md`、`design/charts/*.md` front matter 含 `id / source / migrated / adaptation / adopted / not_adopted`，正文含 `## 暗色适配`；`required`：spec R-008 列名的八份 UI 条目与两份 charts 文件齐备；`palette`：PALETTE_DARK 逐个列出 palette-core 原色的暗色值与对比度；`sources`：tokens.json 每个 `source` 可解析到文件 + 锚；`docs`：designUI.md 中 `design/ui/`、`design/charts/` 下的引用路径全部存在 | AC-008-1、AC-008-2、AC-008-3 |
| theme-contrast | `retired`：主题不含退役色；`contrast`：序列 / 类目色对卡面 ≥ 3、文字用色 ≥ 4.5（中性退后色豁免登记） | AC-006-1、AC-006-2 |

运行方式：`pnpm guards`（全部）、`pnpm guards <名>`、`pnpm guards <名>:<子检查>`；每个守卫先跑自身 `fixtures/<名>/{positives,negatives}` 自检（阳性须全部命中、阴性须全部不中），再扫真实文件；`--self-test` 只跑自检。

`pnpm test` = `tokens --check && guards && typecheck（vue-tsc）&& lint && test:unit（vitest run）&& test:e2e（playwright）`，一条命令全绿（AC-009-1）。

### 2.9 规范资产移植（R-008）

| 目标文件 | 来源（D:\FTEngine\design\） | 采用的锚 | 不采用（原因） |
|---|---|---|---|
| design/ui/UI_FOUNDATIONS.md | UI/Foundations/UI_FOUNDATIONS.md | three_families、bilingual、ui_red、up_down（改为红涨绿跌限行情）、ui_amber、empty_zero、values_once、precedence_json_vs_code | paper_style、paper_not_white（D-011 改暗色玻璃）、narrow_rail 的纸色（结构保留）、two_desks（单品种 v1） |
| design/ui/UI_COLORS.md | UI/Colors/UI_COLORS.md | css_var_semantics、no_new_colors、status_colors（语义保留，值替换）、chart_chrome（反相） | surface / board / band_tint 纸色值（登记原值，标"亮色模式待映射"） |
| design/ui/UI_FONTS.md | UI/Fonts/UI_FONTS.md | stacks、main_scale（子集） | subpage_scale（无子页） |
| design/ui/UI_LAYOUT.md | UI/Layout/UI_LAYOUT.md | shell、narrow、grid（PG-1FR）、spacing、radius_exceptions、page_override 三规（改为组件作用域样式 + 前缀 `fai-`） | pagehead、section（工作台无章节编号）、popover_sizes（随图表 feature） |
| design/ui/UI_COMPONENTS.md | UI/Components/UI_COMPONENTS.md | spark_rng、fresh_dots、tag_chips、tabs、op_badge、empty_states | season_pop、strat_modal、gpop_gship、pxfx / pxtri / pxscar / nxwarn（业务组件） |
| design/ui/UI_CARDS.md | UI/Cards/UI_CARDS.md | base_card（→ 模块壳）、chart_card_contract 的"结构契约 + 守卫"思想（→ 模块壳契约）、card_height（显式像素，不 flex 分高） | ftk_card（无 FTK） |
| design/ui/UI_TABLES.md | UI/Tables/UI_TABLES.md | number_rules、table_data、board + board_three_state、mini | gbal / qsdt / baltbl（平衡表 feature） |
| design/ui/UI_NAV.md | UI/Navigation/UI_NAV.md | groups（固定序）、active_item、fresh_dot（属性锚法） | 注册表生成、LPG 台 |
| design/charts/PALETTE_CORE.md | Graphs/Palette/PALETTE_CORE.md | 整份原件（palette-core / palette-retired 块是守卫数据源） | — |
| design/charts/PALETTE_DARK.md | 本 feature 新建 | §2.1 配色表 + 方法 + 对比度 + ΔE 矩阵 + Q-003 裁定记录（A 等亮采用、B 递暗未采用及取舍）+ 对照样张路径 | — |

每份文件：保留原 front matter（原 `id` 不改）并追加 `source`（原路径）、`source_verified`（原 `verified`）、`migrated`（日期）、`adaptation: dark-glass`、`adopted: [...]`、`not_adopted: [{anchor, reason}]`；正文末尾加 `## 暗色适配` 段（逐锚写"原值 → 新值 / 不变 / 不采用 + 为什么"）。`design/ui/README.md`、`design/charts/README.md` 作索引（文件、来源、日期、采用范围）。`docs/designUI.md` §2.3 / §6 的"随 design/ 移植定稿"字样改为指向这些文件（docs 改动在 Handoff 同 PR）。

## 3. 数据与存储

- 无服务端数据；无用户数据目录写入（desktop-shell / settings feature 接管后迁移）
- 浏览器本地持久化（经 `StorageAdapter`，命名空间 `fai.v1.`）：`ui.rail`、`ui.drawer`、`layout`；版本号变更时整体重置
- mock 数据：`src/contracts/mock/fixtures/`（`daily-brief.json`、`market-board.json`、`watchlist.json`、`release-calendar.json`、`module-summaries.json`、`news.json`、`sources.json`、`research.json`）+ `mock/agent/*.ts` 回放脚本；全部经 zod 校验；不含任何真实头寸、凭证或私有文档
- 生成物入库：`src/design/generated/*`、`contracts/CONTRACT.md`、`contracts/schema.json`（守卫保证与来源一致）

## 4. 关键流程

1. **启动**：`index.html` 静态加载骨架 → `main.ts`：注册主题、创建 store、订阅 `agentClient`、挂载 → `appStore.bootstrap()` 调 `dataClient.bootstrap()` → `ready` → 路由 `/workbench` → `FocusBand` 与各模块并行拉数（各自三态）
2. **模块布局变更**：`ModuleLibrary.add(id)` / 壳上 `moveUp / moveDown / remove` → `layoutStore` 变更 → `StorageAdapter.set('layout')` → 刷新后 `layoutStore.hydrate()` 还原
3. **一次 agent 运行**：`AgentDock.submit(text)` → `agentClient.send()` → store 建 run → 事件流：`run.started` → `step.*`（增量合并、`done` 替换）→ `hint.navigate`（渲染入口）→ `run.completed` / `failed` / `aborted`；`moduleId` 事件同步 `badgesStore`；期间路由切换不影响（订阅在应用级）
4. **窄窗口**：`matchMedia` 监听断点令牌 → `uiStore.viewport`（`cols`、`collapsed`、`focusWide`）→ 栅格列数 / 侧栏形态 / 焦点带卡数切换；CSS 媒体查询与 store 用同一组数值（守卫对拍）
5. **Q-003 已确认**（2026-10-27，Plan 阶段）：实现 T-02 直接按 §2.1 登记令牌（无 `candidate` 状态），并写 design/charts/PALETTE_DARK.md → `tokens-build` 生成 → 守卫全绿

## 5. 验收对应

| AC | 实现位置 | 验证方式 |
|---|---|---|
| AC-001-1 | tokens.json + tokens-build | 守卫 tokens-sync（重生成 diff） |
| AC-001-2 / AC-001-6 | 全部源码 | 守卫 color-literals（含阳性 / 阴性 fixtures、退役色清单） |
| AC-001-3 | glass.css | 守卫 glass-tiers；人工验收 M-01（整页截图层次） |
| AC-001-4 | base.css + format.ts | tests/unit/format.spec.ts（en dash / 正号 / 零中性 / -0）；tests/component/typography.spec.ts（KPI serif、正文 sans、数值 mono + tabular + 右对齐） |
| AC-001-5 | `src/design/updown.css`（market-board / watchlist / FocusBand 引入） | 守卫 updown-scope；component 测试：market 语义数字带涨跌类、analysis 语义数字不带 |
| AC-002-1 | LoadingScreen + appStore | e2e/shell.spec：加载骨架可见 → 工作台可见；期间截帧无空白（body 背景与骨架存在） |
| AC-002-2 | nav.ts + router + PlaceholderPage | e2e/shell.spec：八项顺序、逐项点击地址与 `aria-current`、刷新保持、占位页文案含归属 feature |
| AC-002-3 | getResearchList + Rail | e2e：`?scenario=normal` 研究列表 N 项 → 菜单 N 子项；fixture 增一项（测试内注入）→ N+1 |
| AC-002-4 | TopBar | component：ticker 渲染 fixture 条目；状态点 class 与 fresh/stale 令牌对应 |
| AC-002-5 | uiStore.rail + storage | e2e：折叠 → reload → 仍折叠 |
| AC-002-6 | AppShell + ModuleGrid + tokens | e2e/breakpoints.spec：视口 960 / 979 / 981 / 1239 / 1241 / 1399 / 1401 / 1499 / 1501 / 1440×900；断言 `.shell--collapsed`、`--fai-grid-cols` 计算值、焦点带卡数、`document.scrollingElement.scrollWidth <= clientWidth` |
| AC-003-1 / -3 / -4 | FocusBand | component：fixture 渲染结论数 / 数字 / 方向类；`null` → 空态文案；market vs analysis 类名 |
| AC-003-2 | FocusBand + router | e2e：点击 → `/daily/<date>` |
| AC-004-1 / -2 | registry + layoutStore + ModuleLibrary | e2e/modules.spec：默认七个；移除 / 添加（末尾）/ 上移下移 → reload 保持 |
| AC-004-3 | ModuleShell | e2e：遍历注册表，每个模块 DOM 符合 §2.4 契约（选择器逐项存在、data-state 合法） |
| AC-004-4 | ModuleShell 三态 | component：`scenario=slow/empty/error` 下 loading / empty / error；错误态 `<code>` 文本含 moduleId + code；复制钮调用剪贴板（mock） |
| AC-004-5 | market-board / watchlist / release-calendar | component：盘面三态格文本 `休 / 待 / –` 与类、涨跌字色；关注列表数值右对齐、千分位与红涨绿跌字色；日程排序；人工验收 M-04 |
| AC-004-6 | 全部 CSS | 守卫 bare-1fr |
| AC-005-1 | AgentDock + AgentDrawer | e2e/agent.spec：每页输入栏可见；提交 → 抽屉展开 → 用户消息出现 |
| AC-005-2 | CotTimeline + store | component：回放 success / failure 脚本 → 步骤数、展开详情、终态行 |
| AC-005-3 | store 应用级订阅 | e2e：`long` 脚本启动 → 切到 /prices → 等 5 s → 返回 → 步骤数增加且无重复 |
| AC-005-4 | badgesStore + ModuleShell | e2e：事件带 moduleId → `data-ai=running` → `done` → 点击模块 → `none` |
| AC-005-5 | hint.navigate | e2e：入口按钮 → 路由 / 模块 `data-highlight` |
| AC-005-6 | events.ts + mock/agent | unit：三脚本每个事件 `AgentEvent.parse` 通过；守卫 contract-doc 覆盖事件类型表 |
| AC-006-1 / -2 | echarts-theme.json | 守卫 theme-contrast |
| AC-006-3 / -4 | theme.ts + market-board 样例图 | e2e/theme.spec：`getOption().color` 与 `T.color.chart.series` 相等；`backgroundColor` 透明；人工验收 M-08（图表主题） |
| AC-007-1 | contracts/real | 守卫 network-scope |
| AC-007-2 | mock/index.ts | e2e：四场景各一用例（normal 渲染 / empty 空态 / error 错误态 / slow loading 态可见） |
| AC-007-3 | contract-build | 守卫 contract-doc |
| AC-007-4 | types.ts + fixtures | unit：每个 fixture `parse` 通过；Figure 缺 unit / semantic / asOf 的反例 `parse` 失败 |
| AC-008-1 / -2 / -3 | design/ui、design/charts、tokens.json | 守卫 design-registry |
| AC-009-1 | package.json scripts | `pnpm test` 退出码 0（Handoff 附输出摘要） |
| AC-009-2 | specs/frontend-workbench/manual-acceptance.md | 清单 M-01~M-08（层次 / 字族与双语 / 焦点带 / 模块壳 / 抽屉与时间线 / 窄窗口 / ticker / 图表主题），Handoff 附截图 |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| Node 25（非 LTS）/ TypeScript 7 / Vite 8 + Vitest 5 搭配 | 实施首任务 = 依赖安装冒烟（`pnpm install` + `vite build` + `vitest run` 空用例 + `vue-tsc`）；vue-tsc 不兼容 TS 7 则锁 TS 5.9.x；`engines` 只声明下限 |
| Playwright 找不到本机 Chrome 或版本过旧 | `channel: 'chrome'` 失败回退 `msedge`，再不行 `playwright install chromium`（一次性下载） |
| happy-dom 不支持 `matchMedia` / `backdrop-filter` | 单元 / 组件测试注入 `matchMedia` stub；断点行为只在 Playwright 验 |
| CRLF 污染（本机 `core.autocrlf`） | `frontend/.gitattributes` `* text=auto eol=lf`；Prettier `endOfLine: lf`；守卫比对前统一换行 |
| 暗色序列色区分度（min ΔE 8.5） | v1 接受并登记；chart-templates feature 画真实季节图后复核，必要时按同一方法调 L / C 并走令牌变更 |
| mock 与未来后端漂移 | `schema.json` 入库作契约；backend api feature 用它校验响应；`contractVersion` 递增 |
| ECharts 6 与 vue-echarts 8 peer 不匹配 | 冒烟任务核 peer 警告；不匹配则直接用 `echarts.init`（不依赖 vue-echarts） |
| 生成物入库漂移 | 守卫 tokens-sync / contract-doc 在 `pnpm test` 首位，漂移即红 |

回滚：本 feature 只新增 `frontend/`、`design/`、`specs/frontend-workbench/` 与根 `.gitignore` 追加行；删除这些目录与追加行即回到实施前状态，不影响 `backend/` 与任何用户数据。
