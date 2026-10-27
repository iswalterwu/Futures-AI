# Feature: frontend-workbench 实施计划（plan.md）

> Plan 阶段产物：由 spec.md 生成的设计成果。需求在 spec.md（what/why），本文承载全部实现机制、契约细则与验收落点。
> **基线**：spec.md = Gate 1 冻结版 + Clarify 回流 Q-015 ~ Q-022 修订版（2026-10-27，**待 Walter 重过 Gate 1**）；docs 配套变更 D-013、designUI §2.1 / §2.2 已随本次修订提交。
> **修订记录**：2026-10-27 第二版——落实 Checklist 第一轮双审（`checklist.md`，共识 33 / 86）的全部阻断项与建议项；§2.1 暗色配色值（Q-003，A 等亮）不变。

## 1. 技术方案

- **栈**（D-008 / D-004）：Vue 3.5 + Vite 8 + TypeScript；状态 Pinia 4；路由 vue-router 5；图表 ECharts 6（经 vue-echarts 8 挂载）；契约 schema 用 zod 4（运行时校验示例数据 + 生成 JSON Schema 给后端）
- **测试**：Vitest 5 + @vue/test-utils + happy-dom（单元 / 组件）；Playwright 1.64（端到端，`channel: "chrome"` 复用本机 Chrome，不下载浏览器；备选 `msedge`）；ESLint 10 + eslint-plugin-vue + Prettier（`endOfLine: lf`）
- **工具链**：pnpm 11；Node ≥ 22.12（`engines` 声明；开发机 25.2.1）；确切版本在实施首任务（依赖安装冒烟）锁进 `pnpm-lock.yaml` 并回写本节
- **运行模式**：`VITE_DATA_MODE = mock | real`（默认 mock；real 为未实现桩）；数据场景 `normal | empty | error | slow | boot-error`，agent 回放脚本 `success | failure | long | retry | abort`（选择规则见 §2.7）
- **文件边界**（spec §4，Q-022）：不触碰 `backend/`。共享文件与改动范围：
  - `.gitignore`：追加 `node_modules/`、`frontend/dist/`、`frontend/test-results/`、`frontend/playwright-report/`、`frontend/coverage/`；不移除既有锚点（注意既有 `lib/` 规则会忽略任何 `frontend/**/lib/`，目录树不使用 `lib/` 名）
  - `specs/README.md`：只维护本 feature 一行状态
  - `docs/designUI.md`：§2.1 玻璃边范围注、§2.2 涨跌色作用域（已随本次修订提交）；§2.3 / §6 / §8 移植条目指针同步（T-30）
  - `docs/decisions/20261027-updown-scope.md`（D-013，新增）；`docs/plan.md` §3 决策表追加 D-013 一行（均已提交）
- **目录**：

  ```
  frontend/
  ├── package.json / pnpm-lock.yaml / vite.config.ts / tsconfig*.json / playwright.config.ts / vitest.config.ts / eslint.config.js
  ├── .gitattributes            # * text=auto eol=lf（只约束 frontend/ 树）
  ├── index.html                # 静态加载页骨架 + 首帧样式生成块（<!-- fai:critical:start/end -->，由 tokens-build 写入）
  ├── contracts/
  │   ├── CONTRACT.md           # 契约文档（由 zod schema + 方法语义表生成，守卫对拍）
  │   └── schema.json           # JSON Schema（zod 4 toJSONSchema 生成；backend api feature 的输入）
  ├── scripts/
  │   ├── tokens-build.mjs      # tokens.json → generated/{tokens.css,tokens.ts,echarts-theme.json,critical.css} + index.html 首帧块
  │   ├── contract-build.mjs    # zod + 方法语义表 → CONTRACT.md + schema.json
  │   └── guards/               # 静态守卫（§2.8），每个守卫一个文件 + fixtures/<名>/{positives,negatives}
  ├── src/
  │   ├── main.ts / App.vue
  │   ├── app/                  # AppShell.vue、Rail.vue、TopBar.vue、LoadingScreen.vue、router.ts、nav.ts（菜单注册表）
  │   ├── design/
  │   │   ├── tokens.json       # 令牌唯一来源（§2.1）
  │   │   ├── tokens.schema.json
  │   │   ├── glass.css         # 三层玻璃的唯一定义处
  │   │   ├── updown.css        # market 语义（红涨绿跌）颜色规则的唯一定义处，只写 color
  │   │   ├── base.css          # 背景渐变、字体、数值规则、reset
  │   │   ├── generated/        # tokens.css / tokens.ts / echarts-theme.json / critical.css（生成物，入库，守卫对拍）
  │   │   └── theme.ts          # registerTheme('fai-dark')
  │   ├── workbench/            # WorkbenchPage.vue、FocusBand.vue、ModuleGrid.vue、ModuleLibrary.vue
  │   ├── modules/              # registry.ts（id → 组件映射）+ ModuleShell.vue + 每模块一目录（§2.4）
  │   ├── agent/                # AgentDock.vue、AgentDrawer.vue、CotTimeline.vue、store.ts、events.ts（事件契约）
  │   ├── contracts/            # types.ts（zod）、client.ts（接口）、methods.ts（方法语义表）、mock/（fixtures + 场景 + 回放脚本）、real/（桩）
  │   ├── stores/               # app.ts（启动阶段）、layout.ts（模块布局）、ui.ts（侧栏 / 抽屉 / 视口）、badges.ts、toast.ts
  │   ├── shared/               # format.ts、storage.ts、num.css、components/（Num、Kpi、Badge、EmptyState、ErrorState、Loading、Toast、DataTable、BoardGrid、Spark）
  │   └── pages/                # PlaceholderPage.vue（7 个占位路由共用）
  ├── tests/                    # vitest：unit/ + component/
  └── e2e/                      # playwright：shell / tokens / workbench / modules / agent / breakpoints / theme / scenarios
  design/
  ├── ui/                       # FTEngine UI 条目移植（八份）+ UI_DARK_ADDITIONS.md（本 feature 新增值登记）+ README.md
  └── charts/                   # PALETTE_CORE.md（原件）+ PALETTE_DARK.md（暗色适配表）+ README.md
  ```

## 2. 模块设计

### 2.1 令牌与设计系统（R-001）

**令牌文件** `src/design/tokens.json`：扁平数组，每个令牌 `{name, value, source, note?}`。**`source` 只允许三种形式**（AC-008-2）：`design/ui/<文件>.md#<锚>`、`design/charts/<文件>.md#<锚>`（锚 = 文件内 `### #<锚>` 标题）、`docs/designUI.md#<节号>`（如 `#2.1`，按标题 `^#{2,3} 2\.1[ .]` 解析）。本 feature 新增的值（层级 z、`timeline_step` / `ticker` 字号、圆角例外、窗口基准 / 最小宽、三层玻璃映射、最不利卡面规则、点睛红非文字规则）先登记进 `design/ui/UI_DARK_ADDITIONS.md` 的锚，再被令牌引用；不允许 `spec:R-00x` 之类只证明需求存在、不证明数值来历的来源。

生成器 `scripts/tokens-build.mjs` 产出：

- `generated/tokens.css`：`:root { --fai-<name 的点换连字符>: <value> }`
- `generated/tokens.ts`：`export const T = {...} as const`（脚本侧取值只经它）
- `generated/echarts-theme.json`：主题对象（§2.6）
- `generated/critical.css` + 写入 `index.html` 标记块 `<!-- fai:critical:start -->…<!-- fai:critical:end -->`：首帧所需的背景渐变、文字色与加载骨架样式（只含令牌值，AC-002-1 / AC-001-2）

**令牌对拍两层**（AC-001-1）：① 静态——守卫 `tokens-sync:generated` 重新生成并逐字对比全部生成物与 `index.html` 标记块；② 运行时——端到端 `e2e/tokens.spec.ts` 在工作台页遍历 `tokens.ts` 的全部 CSS 令牌，读 `getComputedStyle(document.documentElement).getPropertyValue('--fai-…')`，按类型规范化（颜色 → rgba、长度 → px、数字去空白）后与令牌值比较；同一用例先注入一段覆盖某个变量的 `<style>`，断言检查函数能报出该变量（阳性自检，防"生成正确但未加载 / 被覆盖"）。

**令牌分组与来源**：

| 组 | 内容 | 来源 |
|---|---|---|
| color.bg | 渐变三段 `#1b1c1f → #121315 → #0f1012` | `docs/designUI.md#2.1` |
| color.glass | 见下方三层映射表 | `docs/designUI.md#2.1`；映射 `design/ui/UI_DARK_ADDITIONS.md#glass_tiers` |
| color.text | 主 `#e8e6e0`、次 `#9a9892`、弱 `#8f8d87` | `docs/designUI.md#2.1` |
| color.updown | 涨 `#C98A8F`、跌 `#8FB8A4` | `docs/designUI.md#2.2`（D-011 / D-013） |
| color.accent / amber / link / status | 点睛红、琥珀、链接蓝、ok / warn / bad | `design/ui/UI_COLORS.md#status_colors`（暗色适配段） |
| color.chart.* | 序列 7 色、正负、类目、区间带、均值、模型线、轴线 / 网格（白透明 .28 / .08）、浮窗 | `design/charts/PALETTE_DARK.md#<用途锚>`；轴线 = `design/ui/UI_COLORS.md#chart_chrome` 反相 |
| font.* | serif / sans / mono 三族栈（原值照搬） | `design/ui/UI_FONTS.md#stacks` |
| type.* | `main_scale` 全量照搬（45 个键）+ 新增 `timeline_step 12.5`、`ticker 12` | `design/ui/UI_FONTS.md#main_scale`；新增 `design/ui/UI_DARK_ADDITIONS.md#type_additions` |
| space.* | grid_gap 12、section_gap 26、content_pad_x 26、card_h_pad `9px 13px 7px` | `design/ui/UI_LAYOUT.md#spacing` |
| radius.* | base 2；例外 drawer 8、tooltip 8、pill 999 | base = `design/ui/UI_LAYOUT.md#radius_exceptions`；例外 = `design/ui/UI_DARK_ADDITIONS.md#radius_additions` |
| z.* | module 1、focus 10、drawer 50、dock 60、toast 70 | `design/ui/UI_DARK_ADDITIONS.md#z_layers` |
| breakpoint.* | railCollapse 980、focusWide 1240、grid3 1400、grid4 1500；window.min 960、window.base 1440×900 | 断点 = `design/ui/UI_LAYOUT.md#narrow`；窗口 = `design/ui/UI_DARK_ADDITIONS.md#window` |

**三层玻璃映射**（AC-001-3；"层"是层级，不是组件）：

| 层 | 类名 | 面 | 边 | 模糊 | 用于 |
|---|---|---|---|---|---|
| 一层 | `.glass-focus` | `rgba(255,255,255,.035)` | `rgba(255,255,255,.07)` | 18px | 今日焦点带、侧栏、顶栏 |
| 二层 | `.glass-module` | `rgba(255,255,255,.045)` | `rgba(255,255,255,.09)` | 18px | 模块壳 |
| 三层 | `.glass-drawer` | `rgba(24,25,28,.82)` | `rgba(255,255,255,.12)` | 28px | 对话抽屉、模块库面板、Toast |

designUI §2.1 允许的面透明度上限 .06 不使用（最不利卡面上弱文字色会降到 4.3，见下）。`src/design/glass.css` 只定义这三个类；全树 `backdrop-filter` 只许出现在该文件且 ≤ 3 条规则（守卫 `glass-tiers`）。

**字体三族与数值**（Q-019）：`base.css` 定义 `.t-serif / .t-sans / .t-mono`。衬线：品牌字标、页标题、KPI 大数（`Kpi.vue`，KPI 大数是"数值等宽"的唯一例外）；无衬线：正文、导航、按钮、表格文字、模块壳标题（卡头规则，`type.card_t`）；等宽：其余一切数值（统一类 `.num` = mono + `font-variant-numeric: tabular-nums` + 右对齐）、代码、单位、ticker。`shared/format.ts`：`fmtValue(v, {decimals, unit})`、`fmtDelta(v, {decimals, kind: 'abs'|'pct'})`——先按显示位四舍五入再判零；空值（null）→ `–`（U+2013）；差值正号；零中性（无号、无色、`-0` 归 0）；返回 `{text, tone: 'up'|'down'|'neutral'}`。共享组件 `Num` 只输出语义类（`sem-market` / `sem-analysis` + `is-up` / `is-down` / `is-neutral`）：analysis 语义类的颜色规则在 `shared/num.css`（正 = chart.pos 青雀头黛亮化、负 = chart.neg 茹藘）；market 语义类的颜色规则只在 `src/design/updown.css`。

**涨跌色作用域**（spec R-001，D-013）——四道防线，守卫 `updown-scope` + 测试（AC-001-5）：

1. 涨跌令牌（`--fai-color-updown-*` / `T.color.updown`）只在 `src/design/updown.css` 中被引用；定义处（`tokens.json`、`generated/*`）豁免
2. `updown.css` 中引用涨跌令牌的声明只能是 `color` 属性（不得用于 background / border / fill / box-shadow 等）
3. `updown.css` 只许被登记的行情语义位置引入：`src/modules/market-board/`、`src/modules/watchlist/`、`src/workbench/FocusBand*`
4. 行情语义的来源受控：fixtures 中 `semantic: 'market'` 只许出现在 `daily-brief.json`、`market-board.json`、`watchlist.json`（单元测试）；`sem-market` 类名与 `'market'` 字面量在 `.vue` / `.ts` 中只许出现在三个行情模块目录、`src/workbench/FocusBand*`、以及 `Num.vue` / `Kpi.vue`（`Kpi` 组合 `Num`；守卫不扫 `src/contracts/`——zod 枚举与 mock 数据必须写该字面量，其约束分别由 AC-007-4 类型测试与上一条 fixtures 单测承担）；端到端断言页面上每个 `.sem-market` 元素都位于登记容器内（`[data-module-id=market-board]`、`[data-module-id=watchlist]`、`.fai-focus__seg--market`），且其计算后的 `background-color` 不等于涨跌色

**暗色配色表（Q-003，2026-10-27 Walter 确认：A 等亮；数值不变）**——方法：彩色在 OKLCH 空间保持色相、把明度抬到下限（序列 0.70、界面语义 0.64–0.70）、按需压或提色度；**有意退后的中性色反向处理**（白底上"浅 = 安静"，黑底上浅色反而最醒目，故改暗 / 降透明度）；D-011 已定的三个值直接采用。

对比度按 WCAG 相对亮度计，列两个卡面：**中段卡面** `#1D1E20`（模块玻璃 .045 叠在渐变中段 `#121315`）与**最不利卡面** `#252629`（模块玻璃 .045 叠在渐变顶端 `#1B1C1F`，是带文字卡面中最亮的一块）。**阈值以最不利卡面为准**：线条与色块（非文字图形，WCAG 1.4.11）≥ 3 : 1；作文字用的颜色（涨、跌、正、负、琥珀、链接蓝、文字三级）≥ 4.5 : 1；点睛红只作非文字指示（当前项竖条、锁定环、状态点 / 边框），按 3 : 1 判定；有意退后的中性色（其他、区间带）不设下限（白底版同样低于 3 : 1）。对照样张：`specs/frontend-workbench/assets/palette-dark-candidates.html`。

| 用途 | 原色（PALETTE_CORE） | 暗色值 | 对比度（中段 / 最不利） | 备注 |
|---|---|---|---|---|
| 主序列 / 主文字（墨） | `#16191D` | `#E8E6E0` | 13.4 / 12.1 | D-011 定值 |
| 序列 1 茹藘（上一年 / 负 / 涨） | `#A35F65` | `#C98A8F` | 6.0 / 5.4 | D-011 定值（= 涨色） |
| 序列 2 沙饧 | `#BFA670` | `#BFA670` | 7.1 / 6.4 | 原值已够亮，不动 |
| 序列 3 苍艾 | `#5A4B3B` | `#97826C` | 4.5 / 4.1 | 明度只抬到 0.62、提色度，保住"深土"身份；不作文字用 |
| 序列 4 吐绶蓝 | `#4182A4` | `#6CA7C7` | 6.3 / 5.8 | |
| 序列 5 缥碧 | `#80A492` | `#8FB8A4` | 7.6 / 6.9 | D-011 定值（= 跌色） |
| 序列 6 碧落 | `#AED0EE` | `#B0D0EB` | 10.4 / 9.4 | 基本不动 |
| 正 / 类目 1 青雀头黛 | `#354E6B` | `#87A1BF` | 6.3 / 5.7 | |
| 分档 窃蓝 | `#88ABDA` | `#8BABD6` | 7.1 / 6.4 | |
| 大区 驼褐 | `#7C5B3E` | `#B08968` | 5.3 / 4.8 | |
| 其他 / 残差 明月珰 | `#D4D3CA` | `#54534B` | 2.2 / 2.0 | 有意退后：白底上浅灰安静（1.5），黑底上同一浅灰反而是堆叠柱里最亮的一块，改取暗灰（保持色相，L 0.44） |
| 五年区间带 霜地 | `#C7C6B6`（α .3） | `#C7C6B6`（α .16） | 1.4 / 1.5（叠加后） | 有意退后：白底叠加后 1.2；黑底若仍用 α .3 为 2.1，成一大块灰 |
| 均值 / 参照 绍衣 | `#A8A19C` | 不变 | 6.5 / 5.9 | 细点线，黑底上可辨不抢活 |
| 模型线 齐紫 | `#6C216D` | `#C478C3` | 5.4 / 4.9 | |
| 界面点睛红（朱） | `#C00000` | `#DF5C4D` | 4.6 / 4.2 | 界面色，登记在 `design/ui/UI_COLORS.md#status_colors` 暗色适配段、不进 PALETTE_DARK；只作非文字指示（当前项竖条、锁定环、bad 状态点与边框）；与涨色 ΔE 11 |
| 界面琥珀（非实绩 / 待更新） | `#B8860B` | `#C69633` | 6.2 / 5.6 | 界面色，登记在 UI_COLORS 暗色适配段，不进 PALETTE_DARK |
| 链接蓝（藏蓝） | `#0F4C81` | `#6A9DD1` | 5.8 / 5.3 | 界面色，登记在 UI_COLORS 暗色适配段，不进 PALETTE_DARK |

文字三级（designUI §2.1 定值）：主 `#E8E6E0` 13.4 / 12.1、次 `#9A9892` 5.8 / 5.2、弱 `#8F8D87` 5.0 / 4.6——在最不利卡面上全部 ≥ 4.5（这正是不使用 .06 玻璃面的原因：.06 叠在渐变顶端为 `#292A2C`，弱文字色只有 4.3）。

**年份线层次（已裁定）**：白底上，茹藘（上一年，4.8）比沙饧 / 缥碧 / 碧落三条旧年份（2.4 / 2.7 / 1.6）醒目；黑底上这三条反而都比茹藘亮（7.1 / 7.6 / 10.4 对 6.0），上一年不如白底上突出。对照过 A 等亮（上表）与 B 递暗（只改有先后的序列线，rank 2–6 对比度逐档降到 3.0：沙饧 `#A98B49` · 苍艾 `#8D8175` · 吐绶蓝 `#2F84AD` · 缥碧 `#557F6B` · 碧落 `#516C84`）。**2026-10-27 Walter 裁定采用 A**。取舍：A 一套值同时服务序列与类目（年份线缥碧与 D-011 跌色同值、令牌不分叉）、色差更大；代价是黑底上旧年份不递暗，主次靠线宽（2.6 / 1.8 / 1.4 / …）与主序列亮度区分。对照证据：样张页首"递暗版对照"三栏。

**色差**：序列七色两两最小色差 **ΔE2000 = 13.2**（吐绶蓝 / 碧落）；FTEngine 亮色版同口径为 21.5（墨 / 苍艾，本 feature 复算与 PALETTE_CORE §二.1 的记录一致）——两者可直接比较，暗底压缩了可用明度区间，v1 接受，chart-templates feature 画出真实季节图后复核。（OKLab×100 口径的最小值 8.5（沙饧 / 缥碧）只作参考，与 ΔE2000 不可直接比较。）

**状态色与绿色**：ok = 吐绶蓝亮化、warn = 琥珀、bad = 点睛红（只作圆点 / 边框，徽章文字用文字色）、sample = 虚线边不着色、fresh = ok、stale = warn。**状态色一律不用绿色**；绿色的含义按位置区分——行情语义位置中绿 = 跌（D-013）；分析图表中的缥碧（旧年份、前苏联大区）保持色板身份，不受限制。

### 2.2 应用外壳与导航（R-002）

- `AppShell.vue`：`.shell` 两栏网格（`var(--fai-rail-w) minmax(0,1fr)`，`.content { min-width: 0 }`，无需任何 `1fr` 豁免）+ 顶栏 + 底部 `AgentDock` + `AgentDrawer`；`< 980px` 时切 `.shell--collapsed`：侧栏变顶部横向导航条（可横滚），`.content` 单列
- **启动与深链**（AC-002-1 / -2 / -7）：`index.html` 内置与 `LoadingScreen.vue` 同构的静态骨架，首帧样式来自 `index.html` 标记块（tokens-build 生成，不手写颜色）；`main.ts` 挂载后 `appStore.phase` 为 `loading` 时继续渲染同一骨架（字标 + 进度文案 + 通知文案位，文案来自 `bootstrap()` 的 `notice` 字段或默认文案）；`bootstrap()` 成功 → `ready`：**只有当前地址为 `/` 时才跳 `/workbench`**，其他合法地址原样保留（路由守卫在 `ready` 前挂起导航、不改地址）；失败 → `failed`：显示原因（错误码 + 消息）与"重试"按钮，重试调用 `bootstrap()`，成功后按同一规则进入
- `nav.ts` 注册表：`[{id, path, zh, en, placeholderOwner?}]` 八项固定序：工作台 `/workbench`、日报 `/daily/:date?`、价格 `/prices`、平衡表 `/balance`、物流 `/logistics`、专题研究 `/research`（子项由 `dataClient.getResearchList()` 驱动，`/research/:id`）、知识库 `/knowledge`、设置 `/settings`；`/` 重定向 `/workbench`；占位页 `pages/PlaceholderPage.vue` 读 `placeholderOwner`（如 `daily-report`）渲染空态文案
- `Rail.vue`：字标（serif）、分组、当前项（加粗 + `aria-current="page"` + 左侧点睛红竖条；塌成顶栏时竖条移到底边）、折叠钮；状态经 `uiStore.railCollapsed` 持久化（key `fai.v1.ui.rail`）
- `TopBar.vue`：`NewsTicker`（CSS 平移动画循环，`prefers-reduced-motion` 时静止可横滚）+ `SourceStatus`（每源一点：fresh / stale 令牌类 + 名称 + 截至时间）
- **断点表**（Q-018；令牌唯一来源，CSS `@media` 写像素字面量，守卫 `tokens-sync:media` 要求阈值 ∈ 令牌断点、`max-width` 取断点 − 1；脚本侧经 `tokens.ts` + `matchMedia`）：

| 对象 | 区间 → 取值 |
|---|---|
| 侧栏形态 | `< 980` 顶部横向导航；`≥ 980` 左侧栏 |
| 模块栅格列数 | `< 980` 1 列；`980–1399` 2 列；`1400–1499` 3 列；`≥ 1500` 4 列 |
| 焦点带数字卡数量 | `< 1240` 4 张（行情 ≤ 2 + 指标 ≤ 2）；`≥ 1240` 6 张（行情 ≤ 3 + 指标 ≤ 3） |
| 支持宽度 | 最小 960；设计基准 1440×900 |

### 2.3 工作台与焦点带（R-003）

- `WorkbenchPage.vue` = `FocusBand`（`.glass-focus`，sticky 顶部）+ `ModuleGrid`
- `FocusBand.vue`：读 `dataClient.getDailyBrief()` → `{brief, reason}`；错误 → 复用 `ErrorState`（含诊断，与模块壳同款，属 plan 行为，spec R-003 只要求空态）；结论 ≤ 3 条（serif 标题 + sans 正文首句）；数字卡按 `figure.semantic` 分入**"行情 | 指标"两段**（Q-016，D-013）：行情段（`.fai-focus__seg--market`，引入 `src/design/updown.css`，红涨绿跌）在左，指标段（`.fai-focus__seg--analysis`，红 = 负）在右，两段之间用玻璃边色竖线分隔，各带双语段标（行情 MARKET / 指标 INDICATORS）；每段张数按 §2.2 断点表截取（超出不挤占另一段）；整带可点 → `router.push('/daily/' + brief.date)`；`brief = null` → 空态（文案 = 契约 `reason`）
- **焦点带固定**（AC-003-6）：不在模块注册表与模块目录中，模块库不显示、不可移除；`layoutStore` 的任何变更不触及焦点带

### 2.4 模块系统（R-004）

**模块目录经契约读取**（R-007）：`dataClient.getModuleCatalog()` 返回 `ModuleDef[] = {id, zh, en, description, defaultSpan: 1|2, order}`；`modules/registry.ts` 只做 `id → 组件` 映射（目录里有、注册表里没有的 id 在模块库显示为"不可用"并记录告警）。v1 mock 目录（顺序 = 默认布局顺序，Q-017，同 designUI §3）：

| order | id | 中文 | 英文副标 | 说明 | 默认跨列 | 深度（Q-001 = B） | 形态 |
|---|---|---|---|---|---|---|---|
| 1 | market-board | 行情价格 | Market Board | 主力与关注合约的盘面网格 | 2 | 完整 mock | `BoardGrid`：列 = 合约，行 = 日期 + 统计行；格见 §2.7 `BoardCell`：`ok` 显示数值（红涨绿跌字色）、`holiday` → `休`、`pending` → `待`（琥珀）、`missing` → `–`；头部样例折线（§2.6） |
| 2 | supply-demand | 库存/供需指标 | Supply & Demand | 库存、开工与供需平衡指标 | 1 | 壳 + 占位 | `ModuleSummary`（标题行 + 示例指标 3 条 + "内容随 domain feature 交付"） |
| 3 | logistics-onwater | 物流在途 | Logistics | 在途船货与到港 | 1 | 壳 + 占位 | 同上 |
| 4 | positions | 当前头寸 | Positions | 持仓与盈亏概览 | 1 | 壳 + 占位 | 同上（mock 不含真实头寸） |
| 5 | doc-catalog | 文档目录 | Documents | 已授权文档与解析状态 | 1 | 壳 + 占位 | 同上 |
| 6 | watchlist | 关注列表 | Watchlist | 关注合约的最新价与涨跌 | 1 | 完整 mock | `DataTable` + `Spark`（迷你折线，墨线 + 末点）；行 = 关注合约（最新价 / 涨跌 / 涨跌幅，market 语义、红涨绿跌，Q-015） |
| 7 | release-calendar | 数据发布日历 | Release Calendar | 近期数据发布时间表 | 1 | 完整 mock | 日程列表（日期 / 时间 / 名称 / 来源 / 新鲜度点），按日期、时间升序 |

**栅格** `ModuleGrid.vue`：`grid-template-columns: repeat(var(--fai-grid-cols), minmax(0, 1fr))`；列数见 §2.2 断点表；模块 `grid-column: span min(跨列, 列数)`；固定顺序填入、不拖拽。

**布局 store** `stores/layout.ts`：`{order: string[]}`（启用模块的有序列表），默认 = 目录按 `order` 排序的全部七个；动作 `add(id)`（追加末尾）、`remove(id)`、`moveUp(id)`、`moveDown(id)`、`has(id)`；经 `shared/storage.ts` 的 `StorageAdapter` 持久化（key `fai.v1.layout`，实现 = 浏览器本地存储；接口预留文件存储）；hydrate 时丢弃目录中不存在的 id。

**模块库** `ModuleLibrary.vue`（AC-004-1）：`.glass-drawer` 面板，**列出目录中全部七个模块**：名称 + 说明 + 状态——已在工作台的显示"已在工作台"（添加钮禁用，提供移除）；不在的显示"添加"。

**模块壳 DOM 契约**（AC-004-3；由组件测试逐注册模块检查 + 端到端页面遍历检查，属自动化结构检查）：

```
section.fai-module[data-module-id][data-state="loading|ready|empty|error"]
├── header.fai-module__head
│   ├── h3.fai-module__title            # 中文（sans，type.card_t）
│   ├── span.fai-module__en             # 可选：英文副标（大写宽字距，type.en_sub）
│   ├── span.fai-module__right          # 可选：单位 / 截至时间（mono）
│   ├── span.fai-module__badge[data-badge="ok|warn|bad|sample"]
│   ├── span.fai-module__ai[data-ai="none|running|done"]
│   └── nav.fai-module__actions          # 上移 / 下移 / 移除
└── div.fai-module__body                # 三态：Loading / EmptyState / ErrorState（含 <code> 可复制诊断）或模块内容
```

`ModuleShell.vue` 提供该结构与插槽；模块组件只填 body。错误态诊断 = `{moduleId, scenario, error.code, error.message, ts}` 文本 + 复制钮（剪贴板）。高亮：`data-highlight` 持续 1500 ms。

### 2.5 AI 对话抽屉与 CoT 时间线（R-005）

- `AgentDock.vue`：固定底部输入栏（全页可见，`z.dock`）；运行中显示运行中指示（脉冲点 + "运行中"）与中止钮，运行进入终态后指示消失（AC-005-7）
- `AgentDrawer.vue`：`.glass-drawer`，三态 `closed / half（45vh）/ tall（80vh）`，提交消息时若为 `closed` 自动展开到 `half`；状态 `uiStore.drawer` 持久化（key `fai.v1.ui.drawer`，AC-005-7）
- `CotTimeline.vue`：按 run 分组的步骤列表；每步一行（类型图标 + 摘要 + 时间）可展开详情（思考全文 / 工具参数与结果摘要 / 文本 / 错误）；终态行（完成 / 失败 / 中止）
- `agent/store.ts`（Pinia）：`sessions`、`runs: Record<runId, Run>`、`steps`（按 `stepId` 去重合并）；**在 `main.ts` 订阅 `agentClient.subscribe()`（应用级，不随组件卸载）**，所以切页或收起抽屉都不影响事件接收（AC-005-3）；`badgesStore` 监听事件中的 `moduleId` → `running` / `done`，用户点击该模块后 `clear(moduleId)`（AC-005-4）
- **引导跳转**（AC-005-5，Q-020）：`hint.navigate` → 时间线渲染入口按钮；点击后：
  - 目标模块在布局中 → `router.push('/workbench')` + 滚动到模块 + `data-highlight`
  - 目标模块在目录中但已被移除 → 不改布局，Toast"该模块不在工作台"+"添加回工作台"按钮（点击后 `layout.add(id)` 再高亮）
  - 目标不在目录 / 页面不存在 → Toast"目标不存在"，不跳转
  - 目标为页面且存在 → `router.push(path)`

**事件契约** `agent/events.ts`（zod，10 种）：

```ts
type AgentEvent =
  | { type: 'run.started';     runId; sessionId; ts; prompt: string }
  | { type: 'step.thinking';   runId; stepId; ts; text: string; done: boolean }
  | { type: 'step.text';       runId; stepId; ts; text: string; done: boolean }
  | { type: 'step.tool.call';  runId; stepId; ts; toolCallId; toolName; argsSummary: string; args?: object; moduleId?: string }
  | { type: 'step.tool.result';runId; stepId; ts; toolCallId; isError: boolean; resultSummary: string; durationMs?: number; moduleId?: string }
  | { type: 'step.error';      runId; stepId; ts; message: string; willRetry: boolean }   // 非终态：一次尝试失败
  | { type: 'hint.navigate';   runId; stepId; ts; target: { kind: 'module' | 'page'; id: string }; reason?: string }
  | { type: 'run.completed';   runId; ts; moduleIds: string[] }
  | { type: 'run.failed';      runId; ts; error: { code: string; message: string; retryable: boolean } }
  | { type: 'run.aborted';     runId; ts }
// ts = ISO 8601 带时区偏移；stepId 在 run 内单调；text 类事件 done=false 为增量、done=true 为权威全文（替换）
// 一次 run 恰好一个终态事件（run.completed / run.failed / run.aborted），之后不再有该 run 的事件
```

**与 pi RPC 事件的对照**（Q-014；依据 pi 1.4.0 文档 `docs/json.md`、`docs/rpc.md`，本机路径 `~/.pi/agent/install/releases/1.4.0/node_modules/@earendil-works/pi-coding-agent/docs/`，2026-10-27 核对；本 feature 不接 pi，映射由 agent-runtime feature 实现，本表与归约规则保证可映射）：

| 本契约 | pi 事件 |
|---|---|
| run.started | 一次 prompt 后的第一个 `agent_start` |
| step.thinking | `message_update.assistantMessageEvent` = `thinking_delta`（done=false）/ `thinking_end`（done=true，content 替换） |
| step.text | 同上 `text_delta` / `text_end` |
| step.tool.call | `tool_execution_start`（toolCallId / toolName / args） |
| step.tool.result | `tool_execution_end`（result / isError / durationMs） |
| step.error | assistant `message_end.stopReason = "error"`（errorMessage）；`willRetry` 取后续是否出现 `auto_retry_start` |
| run.completed / run.failed / run.aborted | 只在 `agent_settled` 时归约发出一次（见下） |
| hint.navigate | 无直接对应；候选 = 专用 MCP 工具（如 `ui_navigate_hint`）的 `tool_execution_end`，由 agent-runtime 决定 |
| moduleId | Backend 按工具名 / 参数映射（如 `fetch_series` 的 series_id → 绑定它的模块） |
| stepId | `${assistantMessageIndex}.${contentIndex}` |

**终态归约规则**：`agent_settled.aborted = true` → `run.aborted`；否则若最后一条助手消息 `stopReason = "error"`，或出现过 `auto_retry_end.success = false` → `run.failed`（error.message = 最后一次 errorMessage，retryable 按错误分类）；否则 → `run.completed`。中间的失败尝试只产生 `step.error`。

**mock 回放** `contracts/mock/agent/`：`success`、`failure`（尝试失败 → 重试 → 最终失败 → `run.failed`）、`long`（≥ 20 步、跨 ≥ 15 s，供切页 / 收起测试）、`retry`（尝试失败 → 重试成功 → `run.completed`）、`abort`（运行中中止 → `run.aborted`）——`[{afterMs, event}]`；脚本选择：URL `?agentScript=<名>` > `window.__FAI_MOCK__.agentScript` > `success`；`MockAgentClient.send()` 返回 runId 并按所选脚本用定时器推送；`abort()` 推 `run.aborted`。

### 2.6 图表暗色主题（R-006）

- `tokens-build` 从 `color.chart.*` 生成 `generated/echarts-theme.json`：`backgroundColor: 'transparent'`、`color: [序列 7 色]`、`textStyle / axisLine / splitLine / tooltip` 取界面令牌（tooltip 不用 `extraCssText` 写 `backdrop-filter`）；`theme.ts` 调 `echarts.registerTheme('fai-dark', theme)`
- 样例图：`market-board` 模块头部一张 ECharts 折线（主力合约近 60 日收盘，mock 序列）作为主题基线（AC-006-3）；`watchlist` 的 `Spark` 为 canvas 自绘，不冒充样例图；chart-templates feature 的 14 种 kind 以此主题为起点
- 测试读取图实例：仅在 mock 模式下，`SampleChart.vue` 把实例登记到 `window.__FAI_TEST__.charts[<id>]`（生产构建不含此钩子），端到端经它读 `getOption()`
- 守卫 `theme-contrast`：`retired` 主题序列色 ∩ 退役色（`design/charts/PALETTE_CORE.md` 的 `palette-retired` 块）= ∅（AC-006-1）；`contrast` 按 §2.1 阈值对**最不利卡面** `#252629` 判定：序列 / 类目色 ≥ 3、文字用色 ≥ 4.5、点睛红 ≥ 3（非文字），中性退后色豁免并在守卫内登记（AC-006-2）

### 2.7 数据访问契约与 mock（R-007）

`contracts/client.ts`：

```ts
interface DataClient {
  bootstrap(): Promise<BootstrapInfo>                                  // {appVersion, contractVersion, mode, scenario, notice?}
  getModuleCatalog(): Promise<ModuleDef[]>                             // 模块目录（§2.4）
  getDailyBrief(date?: string): Promise<{ brief: DailyBrief | null; reason?: string }>
  getMarketBoard(): Promise<MarketBoard>
  getWatchlist(): Promise<WatchlistTable>
  getReleaseCalendar(from: string, to: string): Promise<CalendarEntry[]>
  getModuleSummary(moduleId: string): Promise<ModuleSummary>          // 壳模块占位内容
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

**数值与结构**（AC-007-4：凡业务数值都经 `Figure`，四项元数据必填）：

- `Figure = { label, value: number | null, unit, decimals, freq: '1d'|'1w'|'1m', delta?: number | null, deltaKind?: 'abs'|'pct', semantic: 'market'|'analysis', asOf: string, seriesId?: string }`；`seriesId` 对齐 data-layer 序列 ID（含可选 contract 的描述符派生，D-012 第 1 条）
- `MarketBoard = { columns: {contract, name, seriesId}[]; rows: {date, cells: BoardCell[]}[]; stats: {label, cells: BoardCell[]}[] }`，`BoardCell = { state: 'ok'|'holiday'|'pending'|'missing'; figure: Figure | null }`，zod 约束 `state = ok ⇔ figure ≠ null`；行情数值 `semantic = 'market'`
- `WatchlistTable = { rows: {contract, name, seriesId, last: Figure, change: Figure, changePct: Figure, spark: number[]}[] }`，三个 Figure 均为 market 语义
- `DailyBrief = { date, conclusions: {title, text}[], figures: Figure[] }`
- 错误形态 `{ error: { code, message, retryable } }`，code 集合与 data-layer 对齐（not_found / unauthorized / validation_error / internal / adapter_error / rate_limited）

**参数与语义约定**（写入 CONTRACT.md）：`date` = 交易日 `YYYY-MM-DD`（交易所本地日期；v1 mock 全为 Asia/Shanghai）；`asOf` / `ts` = ISO 8601 带时区偏移（如 `2026-10-27T15:00:00+08:00`）；`getReleaseCalendar(from, to)` = 闭区间 `[from, to]`（与 data-layer range 的闭区间一致），返回按日期、时间升序；**v1 所有列表方法一次返回全部、不分页**（需要分页时 `contractVersion` 升级）；`deltaKind = 'pct'` 时 `delta` 为百分数值（1.25 表示 +1.25%），不是比例；`value = null` 表示缺数（显示 en dash）。

**文档生成**（AC-007-3）：zod schema 每个字段带 `.describe()`；`contracts/methods.ts` 的 `CONTRACT_METHODS` 登记每个方法的参数语义、返回、错误码；`contract-build.mjs` 合并生成 `contracts/CONTRACT.md`（方法表 + 字段表 + 语义约定 + 错误码表 + 事件类型表 + `contractVersion`）与 `schema.json`；守卫 `contract-doc` 重生成后 diff；单元测试断言 DataClient / AgentClient 每个方法都有语义条目、每个 schema 字段都有描述。

**mock**（`mock/index.ts`）：

- 数据场景：`normal`；`empty`；`error`；`slow`（每次调用延迟 1500 ms）；`boot-error`（`bootstrap()` 首次失败、重试成功，供 AC-002-7）。选择：URL `?scenario=` > `VITE_MOCK_SCENARIO` > `normal`
- **场景 × 方法矩阵**（写入 `mock/index.ts` 头注与 CONTRACT.md；T-12 用例逐格断言）：`bootstrap()` 与 `getModuleCatalog()` 在 `normal` / `empty` / `error` / `slow` 下**全部成功**（目录始终返回七个模块，否则工作台无模块、错误态与空态都不可达）；`empty` 下各模块数据方法返回空集、`getDailyBrief` 返回 `brief = null` 带原因；`error` 下各模块数据方法返回固定错误（模块壳错误态可达）、`getDailyBrief` 返回错误；`slow` 下两者均延迟 1500 ms 后成功；只有 `boot-error` 让 `bootstrap()` 首次失败
- 测试注入：mock 模式下若存在 `window.__FAI_MOCK__`（Playwright `addInitScript` 写入），按其覆盖对应 fixtures 或选择回放脚本（如研究列表追加一项，AC-002-3）
- fixtures 中 `semantic: 'market'` 只许出现在 `daily-brief.json`、`market-board.json`、`watchlist.json`（单元测试，§2.1 防线 4）
- `real/index.ts`：所有方法 `throw new NotImplementedError('api feature')`；网络调用只许出现在 `src/contracts/real/`（守卫 `network-scope`，§2.8）

### 2.8 静态守卫清单（`pnpm guards`，全部在 `scripts/guards/`）

| 守卫 | 子检查与规则 | AC |
|---|---|---|
| tokens-sync | `generated`：重新生成全部生成物与 `index.html` 首帧标记块并逐字 diff；`media`：全部 `@media` 宽度阈值 ∈ 令牌断点（`max-width` 取断点 − 1） | AC-001-1 |
| color-literals | `literals`：扫描 `src/**/*.{vue,ts,css}`（含 `<style>`、`style=""`、`:style` 字符串值）与 `index.html`（首帧标记块除外），识别 `#hex`（3 / 4 / 6 / 8 位）、`rgb(a)()`、`hsl(a)()`、`hwb()`、`lab()`、`lch()`、`oklab()`、`oklch()`、`color()` 与 CSS 具名颜色（`color: red` 一类；仅在样式声明上下文识别，`transparent` / `currentColor` / `inherit` / `initial` / `unset` 允许）；允许名单 = `tokens.json`、`generated/*`；`retired`：五个退役 hex 不在 tokens.json、生成物、`index.html` 与源码中 | AC-001-2、AC-001-6 |
| glass-tiers | `backdrop-filter` 只在 `src/design/glass.css` 且 ≤ 3 条规则（扫描 CSS、`.vue` `<style>`、内联 `style` / `:style`、`echarts-theme.json` 的字符串值）；`.glass-*` 类名只许三个 | AC-001-3 |
| updown-scope | `refs`（定义处豁免）、`color-only`、`imports`、`usage` 四个子检查，规则见 §2.1"涨跌色作用域"1–4 条中的静态部分 | AC-001-5 |
| bare-1fr | `grid-template-columns` 中不得出现未包 `minmax()` 的 `1fr`，**零豁免** | AC-004-6 |
| network-scope | 以 ESLint 规则做语法级检查（守卫用 ESLint API 只跑这组规则）：`src/**`（`src/contracts/real/**` 除外）禁止引用全局 `fetch` / `XMLHttpRequest` / `WebSocket` / `EventSource`（`no-restricted-globals`，含 `const f = fetch` 一类别名）、`window.fetch` / `globalThis.fetch` / `navigator.sendBeacon` 及其计算属性写法（`no-restricted-properties` + `no-restricted-syntax`）、导入 HTTP / WebSocket 客户端库（`no-restricted-imports`：axios、ky、ofetch、undici、node-fetch、cross-fetch、ws、socket.io-client 等） | AC-007-1 |
| contract-doc | zod + `CONTRACT_METHODS` → CONTRACT.md / schema.json 重生成 diff | AC-007-3 |
| design-registry | `entries`：README 登记的条目文件 front matter 含 `id / source / migrated / adaptation / source_anchors / adopted / not_adopted`，正文含 `## 暗色适配`；`adopted ∪ not_adopted = source_anchors`，且每个锚在文件中有 `### #<锚>` 标题（不采用的锚保留标题 + 一行原因）；`required`：八份 UI 条目、`UI_DARK_ADDITIONS.md` 与两份 charts 文件齐备；`palette`：PALETTE_DARK 逐个列出 palette-core 原色的暗色值与对比度；`sources`：tokens.json 每个 `source` 符合 §2.1 三种形式且锚 / 节号可解析；`docs`：designUI.md 中 `design/ui/`、`design/charts/` 下的引用路径全部存在 | AC-008-1、AC-008-2、AC-008-3 |
| theme-contrast | `retired`、`contrast`（对最不利卡面，阈值见 §2.1） | AC-006-1、AC-006-2 |
| ac-coverage | 从 spec.md 抽取全部 AC 编号；扫描 `tests/**`、`e2e/**` 的测试标题与各守卫声明的 `acs`；每个 AC 至少一处，缺失即红（Converge 的机械证据） | 全部 AC（AC-009-1 的一部分） |

运行方式：`pnpm guards`（全部）、`pnpm guards <名>`、`pnpm guards <名>:<子检查>`；每个守卫先跑自身 `fixtures/<名>/{positives,negatives}` 自检（阳性须全部命中、阴性须全部不中），再扫真实文件；`--self-test` 只跑自检；任一失败非零退出。spec R-009 列为"静态守卫"的模块壳结构检查，本 plan 以组件测试（逐注册模块）+ 端到端遍历实现——同属自动化检查，结构以渲染结果判定比文本扫描更可靠。

`pnpm test` = `tokens:check → guards → typecheck（vue-tsc）→ lint → test:unit（vitest run）→ test:e2e（playwright）`，一条命令全绿（AC-009-1）。

### 2.9 规范资产移植（R-008）

八份 UI 条目共 86 个原锚，全部归入"采用"或"不采用"（守卫 `design-registry:entries` 核对）：

| 目标文件 | 来源（`D:\FTEngine\design\`） | 采用的锚 | 不采用的锚（原因） |
|---|---|---|---|
| design/ui/UI_FOUNDATIONS.md | UI/Foundations/UI_FOUNDATIONS.md（14） | shadow_overlays_only、square_corners、three_families（KPI 例外按 Q-019 写明）、bilingual、ui_red（改为只作非文字指示）、up_down（改为红涨绿跌限登记位置，D-013）、ui_amber、empty_zero、narrow_rail（结构采用，纸色改暗色玻璃）、values_once、precedence_json_vs_code | paper_style、paper_not_white（D-011 改暗色玻璃）、two_desks（v1 单一工作台） |
| design/ui/UI_COLORS.md | UI/Colors/UI_COLORS.md（10） | css_var_semantics（变量改 `--fai-` 前缀）、ui_vs_chart_colors、no_new_colors、status_colors（语义保留，值替换为暗色）、chart_chrome（反相） | blue_null（FTEngine 站内变量史）、surface / board_greys / band_tint（纸色系值；原值登记为"亮色主题待映射"）、paper_values（FTEngine 待裁定条目，与本产品无关） |
| design/ui/UI_FONTS.md | UI/Fonts/UI_FONTS.md（4） | stacks、main_scale（全量） | special_stacks（Plotly / 浮窗 / 水印字体，随 chart-templates）、subpage_scale（无子页） |
| design/ui/UI_LAYOUT.md | UI/Layout/UI_LAYOUT.md（13） | internal_geometry（组件内部几何留在组件样式）、shell、rail（结构采用，暗色玻璃）、narrow、grid（PG-1FR）、spacing、radius_exceptions、page_override_prefix / page_override_specificity / page_override_singletons（改为组件作用域样式 + `fai-` 前缀） | pagehead、section（工作台无章节编号）、popover_sizes（随 chart-templates） |
| design/ui/UI_COMPONENTS.md | UI/Components/UI_COMPONENTS.md（22） | spark_rng、fresh_dots、tag_chips、tabs、op_badge、empty_states | legend、toolbars、tip_shells、season_pop（图表组件，随 chart-templates）；caret（v1 无折叠树表）；zpill（v1 无 z 分位）；pxfx、pxtri、pxlight、pxscar、nxwarn、strat_modal、gpop_gship（定价 / 平衡表业务组件）；triage_card（v1 无数据状态页）；fqb（随平衡表 feature）；footnote（随日报 feature） |
| design/ui/UI_CARDS.md | UI/Cards/UI_CARDS.md（5） | base_card（→ 模块壳）、chart_card_contract（"结构契约 + 自动检查"思想 → 模块壳契约）、card_height（显式像素，不 flex 分高） | ftk_card（无 FTK）、card_family（老卡族不迁移） |
| design/ui/UI_TABLES.md | UI/Tables/UI_TABLES.md（10） | number_rules、table_data、board、board_three_state、mini | gbal、gbal_edit、qsdt、baltbl（随平衡表 feature）、wide_table_overflow（FTEngine 待裁定条目） |
| design/ui/UI_NAV.md | UI/Navigation/UI_NAV.md（8） | groups（固定序思想）、active_item、fresh_dot（属性锚法） | nav_table（注册表生成机制）、lpg_nav、exempt（FTEngine 多台站点）、nav_order、usforecast_realdem（FTEngine 待裁定条目） |
| design/ui/UI_DARK_ADDITIONS.md | 本 feature 新建 | glass_tiers、worst_surface、accent_non_text、type_additions、radius_additions、z_layers、window（每锚含 规定 / 为什么 / 落点） | — |
| design/charts/PALETTE_CORE.md | Graphs/Palette/PALETTE_CORE.md | 整份原件（`palette-core` / `palette-retired` 块是守卫数据源） | — |
| design/charts/PALETTE_DARK.md | 本 feature 新建 | **只收 palette-core 原色**的暗色值（每个用途一个 `### #<锚>`）+ 方法 + 两个卡面的对比度 + ΔE2000 + Q-003 裁定记录（A 采用、B 未采用及取舍）+ 样张路径 | 界面三色（点睛红 / 琥珀 / 链接蓝）不进本文件——它们不是图表数据色（`UI_COLORS#ui_vs_chart_colors`），按 `values_once` 只在 UI_COLORS 的暗色适配段登记（样张页仍展示它们，仅作对照） |

每份移植文件：保留原 front matter（原 `id` 不改）并追加 `source`（原路径）、`source_verified`（原 `verified`）、`migrated`（日期）、`adaptation: dark-glass`、`source_anchors`（原文全部锚）、`adopted`、`not_adopted: [{anchor, reason}]`；采用的锚保留"规定 / 为什么 / 落点"结构，不采用的锚保留标题与一行原因；正文末尾 `## 暗色适配` 段逐锚写"原值 → 新值 / 不变 / 不采用 + 为什么"。`design/ui/README.md`、`design/charts/README.md` 作索引（文件、来源、移植日期、采用范围）。`docs/designUI.md` §2.3 / §6 / §8 的"随 design/ 移植"字样改为指向具体条目（T-30）。

## 3. 数据与存储

- 无服务端数据；无用户数据目录写入（desktop-shell / settings feature 接管后迁移）
- 浏览器本地持久化（经 `StorageAdapter`，命名空间 `fai.v1.`）：`ui.rail`、`ui.drawer`、`layout`；命名空间版本号变更时整体重置
- mock 数据：`src/contracts/mock/fixtures/`（`module-catalog.json`、`daily-brief.json`、`market-board.json`、`watchlist.json`、`release-calendar.json`、`module-summaries.json`、`news.json`、`sources.json`、`research.json`）+ `mock/agent/{success,failure,long,retry,abort}.ts`；全部经 zod 校验；不含任何真实头寸、凭证或私有文档
- 生成物入库：`src/design/generated/*`、`index.html` 首帧标记块、`contracts/CONTRACT.md`、`contracts/schema.json`（守卫保证与来源一致）

## 4. 关键流程

1. **启动**：`index.html` 静态骨架（首帧样式来自令牌生成块）→ `main.ts`：注册主题、创建 store、订阅 `agentClient`、挂载 → `appStore.bootstrap()` → 成功：地址为 `/` 时跳 `/workbench`，否则停留原地址 → 焦点带与各模块并行拉数（各自三态）；失败：加载页显示原因 + 重试
2. **模块布局变更**：模块库 `add(id)` / 壳上 `moveUp / moveDown / remove` → `layoutStore` → `StorageAdapter.set('layout')` → 刷新后 `hydrate()` 还原（丢弃目录外 id）；焦点带不参与
3. **一次 agent 运行**：`AgentDock.submit(text)` → `agentClient.send()` → store 建 run，输入栏显示运行中 → 事件流：`run.started` → `step.*`（增量合并、`done` 替换；`step.error` 记为失败尝试）→ `hint.navigate`（渲染入口）→ 恰好一个终态；`moduleId` 同步 `badgesStore`；切页或收起抽屉不影响（订阅在应用级）
4. **引导跳转**：入口点击 → 按 §2.5 四种情况处理（在布局 / 已移除 / 不存在 / 页面）
5. **窄窗口**：`matchMedia` 监听令牌断点 → `uiStore.viewport`（`collapsed`、`cols`、`focusCards`）→ 侧栏形态 / 栅格列数 / 焦点带卡数切换；CSS 媒体查询与 store 用同一组数值（守卫对拍）

## 5. 验收对应

| AC | 实现位置 | 验证方式 |
|---|---|---|
| AC-001-1 | tokens.json + tokens-build + tokens.css 加载 | 守卫 tokens-sync（generated / media）；e2e/tokens.spec（运行时逐令牌对拍 + 覆盖阳性自检） |
| AC-001-2 / AC-001-6 | 全部源码与 index.html | 守卫 color-literals（literals / retired，阳性 / 阴性 fixtures 覆盖具名色、内联样式、index.html） |
| AC-001-3 | glass.css | 守卫 glass-tiers；人工验收 M-01 |
| AC-001-4 | base.css + Kpi / Num + format.ts | unit/format.spec（en dash / 正号 / 零中性 / -0）；component/typography.spec（各元素的字族类与 `.num`：KPI 大数 serif、模块壳标题与正文 sans、其余数值 mono + tabular + 右对齐）；e2e/tokens.spec 在真实浏览器中断言上述元素计算样式的字体族首项（happy-dom 不可靠解析 CSS 变量中的字体） |
| AC-001-5 | updown.css + 三个登记位置 | 守卫 updown-scope（refs / color-only / imports / usage）；unit：fixtures market 语义位置；component：market 语义数字带涨跌类、analysis 不带；e2e：`.sem-market` 只在登记容器内且背景不为涨跌色 |
| AC-002-1 | index.html 首帧块 + LoadingScreen + appStore | e2e/shell.spec：首帧（拦截主脚本延迟加载时）骨架与背景即存在 → 就绪后工作台出现；判据 = 每个采样时刻骨架或应用至少其一可见且 body 背景为令牌渐变 |
| AC-002-2 | nav.ts + router + PlaceholderPage + 启动规则 | e2e/shell.spec：八项顺序、逐项点击地址与 `aria-current`；直接打开 `/prices`、`/research/<id>`、`/daily/<date>` 并刷新，仍停留原页；占位页文案含归属 feature |
| AC-002-3 | getResearchList + Rail | e2e：研究列表 N 项 → 菜单 N 子项；`__FAI_MOCK__` 注入一项 → N+1 |
| AC-002-4 | TopBar | component：ticker 渲染 fixture 条目；状态点类与 fresh / stale 令牌对应 |
| AC-002-5 | uiStore.rail + storage | e2e：折叠 → reload → 仍折叠 |
| AC-002-6 | AppShell + ModuleGrid + FocusBand + 断点表 | e2e/breakpoints.spec：视口 960 / 979 / 981 / 1239 / 1241 / 1399 / 1401 / 1499 / 1501 / 1440×900；断言侧栏形态、`--fai-grid-cols` 计算值（1 / 2 / 3 / 4）、焦点带卡数（4 / 6）、`scrollWidth <= clientWidth` |
| AC-002-7 | LoadingScreen + appStore + boot-error 场景 | e2e：加载页显示进度与通知文案；`?scenario=boot-error` → 原因 + 重试 → 进入工作台 |
| AC-003-1 / -3 / -4 | FocusBand | component：结论数 / 数字 / 方向类；`brief = null` → 空态文案 = reason；market vs analysis 类名 |
| AC-003-2 | FocusBand + router | e2e：点击 → `/daily/<date>` |
| AC-003-5 | FocusBand 两段 | component：market 数字只在 `.fai-focus__seg--market`、analysis 只在 `--analysis`，涨跌类只出现在行情段；人工验收 M-03 |
| AC-003-6 | FocusBand 不在目录 / 布局外 | e2e：模块库无焦点带、焦点带无移除钮；增删模块后焦点带仍在 |
| AC-004-1 / -2 | catalog + layoutStore + ModuleLibrary | e2e/modules.spec：默认七个且顺序 = 目录顺序；模块库列出七项与状态；移除 / 添加（末尾）/ 上移下移 → reload 保持 |
| AC-004-3 | ModuleShell | component：逐注册模块结构；e2e：页面遍历每个模块 DOM 符合契约 |
| AC-004-4 | ModuleShell 三态 + error 场景 | component：loading / empty / error 三态与诊断复制；e2e（T-28）：`?scenario=error` 下工作台可达、模块显示错误态与诊断 |
| AC-004-5 | market-board / watchlist / release-calendar | component：盘面三态格 `休 / 待 / –`、涨跌字色；关注列表数值右对齐、千分位、红涨绿跌；日程升序；人工验收 M-04 |
| AC-004-6 | 全部 CSS | 守卫 bare-1fr（零豁免） |
| AC-005-1 | AgentDock + AgentDrawer | e2e/agent.spec：八个路由输入栏可见；提交 → 抽屉展开 → 用户消息出现 |
| AC-005-2 | CotTimeline + store | component：回放 success / failure / retry / abort → 步骤数、展开详情、step.error 呈现、唯一终态行 |
| AC-005-3 | store 应用级订阅 | e2e：`?agentScript=long`：切到 `/prices` 再返回、以及收起抽屉再展开，两种情况下步骤数增加、同一 runId、无重复 stepId |
| AC-005-4 | badgesStore + ModuleShell | e2e：带 moduleId 的事件 → `data-ai=running` → `done` → 点击模块 → `none` |
| AC-005-5 | hint.navigate + Toast | e2e：在布局 → 导航 + `data-highlight`；已移除 → Toast + "添加回工作台"、布局未变，点击后加回并高亮；不存在 → Toast、地址不变 |
| AC-005-6 | events.ts + mock/agent + CONTRACT.md | unit：五个脚本每个事件 `AgentEvent.parse` 通过且恰好一个终态；文档含十种事件 |
| AC-005-7 | AgentDrawer + AgentDock + uiStore.drawer | e2e：closed / half / tall 切换并 reload 保持；运行中指示出现、终态后消失 |
| AC-006-1 / -2 | echarts-theme.json | 守卫 theme-contrast（retired / contrast，最不利卡面） |
| AC-006-3 / -4 | theme.ts + 样例图 | e2e/theme.spec：经测试钩子读 `getOption().color` 与 `T.color.chart.series` 相等、`backgroundColor` 透明；人工验收 M-08 |
| AC-007-1 | contracts/real + ESLint 规则 | 守卫 network-scope（含别名、计算属性、客户端库导入的阳性样例） |
| AC-007-2 | mock/index.ts | unit：五种场景切换；e2e（T-28）：normal / empty / error / slow 各一用例（error 下模块错误态可达）；boot-error 见 AC-002-7 |
| AC-007-3 | contract-build + methods.ts | 守卫 contract-doc；unit：每个方法有语义条目、每个字段有描述 |
| AC-007-4 | types.ts + fixtures | unit：每个 fixture `parse` 通过；Figure 缺 unit / freq / semantic / asOf 任一项、BoardCell `ok` 缺 figure 的反例 `parse` 失败 |
| AC-008-1 / -2 / -3 | design/ui、design/charts、tokens.json | 守卫 design-registry（entries / required / palette / sources / docs） |
| AC-009-1 | package.json scripts + ac-coverage | `pnpm test` 退出码 0（Handoff 附输出摘要）；守卫 ac-coverage 全 AC 覆盖 |
| AC-009-2 | specs/frontend-workbench/manual-acceptance.md | 清单 M-01~M-08（层次 / 字族与双语 / 焦点带两段 / 模块壳 / 抽屉与时间线 / 窄窗口 / ticker / 图表主题），Handoff 附截图 |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| Node 25（非 LTS）/ TypeScript 7 / Vite 8 + Vitest 5 搭配 | 实施首任务 = 依赖安装冒烟（`pnpm install` + `vite build` + `vitest run` 空用例 + `vue-tsc`）；vue-tsc 不兼容 TS 7 则锁 TS 5.9.x；`engines` 只声明下限 |
| Playwright 找不到本机 Chrome 或版本过旧 | `channel: 'chrome'` 失败回退 `msedge`，再不行 `playwright install chromium`（一次性下载） |
| happy-dom 不支持 `matchMedia` / `backdrop-filter` / 计算样式 | 组件测试注入 `matchMedia` stub；断点、计算样式与玻璃效果只在 Playwright 验 |
| CRLF 污染（本机 `core.autocrlf`） | `frontend/.gitattributes` `* text=auto eol=lf`；Prettier `endOfLine: lf`；守卫比对前统一换行 |
| `index.html` 首帧块被手改 | 标记块由 tokens-build 写入，`tokens-sync:generated` 逐字对拍；块外不允许颜色字面量（color-literals） |
| 网络守卫被绕过 | 语法级 ESLint 规则 + 别名 / 计算属性 / 库导入阳性样例；新增 HTTP 库时补规则 |
| 暗色序列色区分度（ΔE2000 13.2，亮色 21.5） | v1 接受并登记；chart-templates feature 画真实季节图后复核，必要时按同一方法调 L / C 并走令牌变更 |
| mock 与未来后端漂移 | `schema.json` 入库作契约；backend api feature 用它校验响应；`contractVersion` 递增 |
| ECharts 6 与 vue-echarts 8 peer 不匹配 | 冒烟任务核 peer 警告；不匹配则直接用 `echarts.init`（不依赖 vue-echarts） |
| 生成物入库漂移 | 守卫 tokens-sync / contract-doc 在 `pnpm test` 前段，漂移即红 |

**回滚**（逐类）：新增的 `frontend/`、`design/`、`specs/frontend-workbench/` 直接删除；`.gitignore` 删除追加的五行；`specs/README.md` 删除本 feature 一行；`docs/designUI.md` 用 `git revert` 撤回本 feature 的提交（§2.1 注、§2.2 作用域、T-30 指针）；`docs/decisions/20261027-updown-scope.md` 不删除，按 ADR 规则新增一份取代它的 ADR；`docs/plan.md` §3 的 D-013 行随取代 ADR 更新。不影响 `backend/` 与任何用户数据。
