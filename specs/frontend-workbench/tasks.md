# Feature: frontend-workbench 任务清单（tasks.md）

> Tasks 阶段产物：每个任务 0.5–2 小时可完成，按依赖顺序执行（Implement 阶段）。
> **状态：草案（2026-10-27 起草）——Checklist 通过后生效。** 执行前置条件：`checklist.md` 全部勾选。
> 依据：`spec.md`（Gate 1 冻结版）+ `plan.md`。完成标准引用 spec 的 AC 编号；一个 AC 由多个任务分担时，标注本任务负责的部分，AC 整体是否满足以 Converge 时相关任务全部完成为准。

## 约定

- **执行位置**：命令在 worktree 根目录 `D:\2030\Futures-AI-frontend` 执行，前端命令一律 `pnpm -C frontend …`
- **测试命名**：每个测试标题以所验证的 AC 编号开头（如 `AC-002-2 菜单八项顺序与地址`），验证命令用 `-t`（Vitest）/ `-g`（Playwright）按编号选取，保证"验证命令 ↔ 完成标准"可逐条执行
- **守卫**：`pnpm -C frontend guards <名>[:<子检查>]`；每个守卫先跑自身阳性 / 阴性 fixtures 自检，再扫真实文件，任一不符即非零退出（plan §2.8）
- **提交**：每完成一个任务提交一次，提交信息以任务号开头（如 `T-05 令牌源与生成器`）
- **边界**：只动 `frontend/`、`design/`、`specs/frontend-workbench/`、根 `.gitignore`（追加）与 `docs/designUI.md`（T-27 指针同步）；不碰 `backend/`

## 任务

### T-01 前端脚手架与依赖冒烟

- **上下文**：plan §1（栈与工具链）与 §6 首条风险（Node 25 / TS 7 / Vite 8 / Vitest 5 搭配未验证）。后续全部任务的前提。
- **修改范围**：新建 `frontend/`：`package.json`（`engines.node >= 22.12`；scripts：`dev` `build` `preview` `typecheck` `lint` `test:unit` `test:e2e` `tokens` `tokens:check` `contract` `contract:check` `guards` `test`，后五个先放占位，由后续任务填实）、`pnpm-lock.yaml`、`vite.config.ts`、`tsconfig.json` / `tsconfig.node.json`、`vitest.config.ts`（happy-dom）、`playwright.config.ts`（`channel: 'chrome'`，`webServer` = `vite --port 5299 --strictPort`）、`eslint.config.js`、`.prettierrc`（`endOfLine: lf`）、`.gitattributes`（`* text=auto eol=lf`）、`index.html`、`src/main.ts`、`src/App.vue`、`tests/unit/smoke.spec.ts`、`e2e/smoke.spec.ts`；根 `.gitignore` 追加 `node_modules/`、`frontend/dist/`、`frontend/test-results/`、`frontend/playwright-report/`、`frontend/coverage/`
- **依赖**：无　**预计**：1.5 h
- **完成标准**：
  1. 依赖可按 lockfile 复现安装（为 AC-009-1 打底）
  2. 构建、类型检查、lint 通过；若 vue-tsc 与 TS 7 不兼容则锁 TS 5.9.x，并把实际锁定版本回写 plan §1（为 AC-009-1 打底）
  3. 冒烟单元用例与端到端用例通过，Playwright 使用本机 Chrome（为 AC-009-1 打底）
- **验证命令**：
  1. `pnpm -C frontend install --frozen-lockfile`
  2. `pnpm -C frontend build && pnpm -C frontend typecheck && pnpm -C frontend lint`
  3. `pnpm -C frontend test:unit -t "SMOKE" && pnpm -C frontend test:e2e -g "SMOKE"`

### T-02 守卫运行器与 design-registry 守卫

- **上下文**：plan §2.8（守卫清单与运行方式）、§2.9（条目文件格式）。守卫先于被守对象建立，移植任务（T-03 / T-04）用它验收。
- **修改范围**：`frontend/scripts/guards/run.mjs`（按名 / 子检查运行、fixtures 自检、`--self-test`、汇总后非零退出）、`frontend/scripts/guards/design-registry.mjs`（子检查 `entries` / `required` / `palette` / `sources` / `docs`）、`frontend/scripts/guards/fixtures/design-registry/{positives,negatives}/`、`package.json` 的 `guards` 脚本
- **依赖**：T-01　**预计**：1.5 h
- **完成标准**：
  1. 运行器：无参跑全部守卫、带名跑指定守卫或子检查；每个守卫先自检 fixtures（阳性须全部命中、阴性须全部不中），为全部守卫类 AC（AC-001-1/2/3/5/6、AC-004-6、AC-006-1/2、AC-007-1/3、AC-008-1/2/3）提供执行机制
  2. design-registry 五个子检查按 plan §2.8 判定，fixtures 覆盖每个子检查的阳性与阴性（AC-008-1 / AC-008-2 / AC-008-3 的判定逻辑）
- **验证命令**：
  1. `pnpm -C frontend guards --self-test`
  2. `pnpm -C frontend guards design-registry --self-test`

### T-03 规范资产移植（一）：Foundations / Colors / Fonts / Layout

- **上下文**：plan §2.9 前四行；spec R-008。这四份为令牌 `source` 提供锚点（T-05 依赖）。源：`D:\FTEngine\design\UI\{Foundations,Colors,Fonts,Layout}`。
- **修改范围**：`design/ui/UI_FOUNDATIONS.md`、`design/ui/UI_COLORS.md`、`design/ui/UI_FONTS.md`、`design/ui/UI_LAYOUT.md`、`design/ui/README.md`
- **依赖**：T-02　**预计**：2 h
- **完成标准**：
  1. 四份条目按 plan §2.9 的采用 / 不采用清单移植：原 front matter 与原 `id` 保留，追加 `source / source_verified / migrated / adaptation / adopted / not_adopted`，正文末尾有 `## 暗色适配` 段逐锚写"原值 → 新值 / 不变 / 不采用 + 为什么"；`design/ui/README.md` 登记每份文件的来源路径、移植日期与采用范围（AC-008-1，这四份与索引）
- **验证命令**：
  1. `pnpm -C frontend guards design-registry:entries`（README 登记了却缺失、存在却未登记、格式不合规均报错）

### T-04 规范资产移植（二）：Components / Cards / Tables / Nav 与图表配色

- **上下文**：plan §2.9 后六行；spec R-008。`PALETTE_CORE.md` 的 `palette-core` / `palette-retired` 块是 color-literals 与 theme-contrast 守卫的数据源；`PALETTE_DARK.md` 记录 Q-003 裁定（A 等亮）。
- **修改范围**：`design/ui/UI_COMPONENTS.md`、`design/ui/UI_CARDS.md`、`design/ui/UI_TABLES.md`、`design/ui/UI_NAV.md`、`design/ui/README.md`（补登四份）、`design/charts/PALETTE_CORE.md`（原件逐字复制 + 追加 front matter 字段与 `## 暗色适配` 指向 PALETTE_DARK）、`design/charts/PALETTE_DARK.md`（plan §2.1 配色表、方法、阈值、ΔE、Q-003 裁定记录、样张路径）、`design/charts/README.md`
- **依赖**：T-02　**预计**：2 h
- **完成标准**：
  1. spec R-008 列名的八份 UI 条目与两份 charts 文件齐备且格式合规（AC-008-1）
  2. `PALETTE_DARK.md` 逐个列出 palette-core 原色的暗色值与对比度（AC-008-3）
- **验证命令**：
  1. `pnpm -C frontend guards design-registry:entries && pnpm -C frontend guards design-registry:required`
  2. `pnpm -C frontend guards design-registry:palette`

### T-05 令牌源、生成器与 tokens-sync 守卫

- **上下文**：plan §2.1（令牌分组、来源、Q-003 已确认配色表）、§2.6（主题由令牌生成）。代码只经令牌取值的基础。
- **修改范围**：`frontend/src/design/tokens.json`、`frontend/src/design/tokens.schema.json`、`frontend/scripts/tokens-build.mjs`、`frontend/src/design/generated/{tokens.css,tokens.ts,echarts-theme.json}`、`frontend/scripts/guards/tokens-sync.mjs`（子检查 `generated` / `media`）+ `fixtures/tokens-sync/`、`package.json` 的 `tokens` / `tokens:check`
- **依赖**：T-03、T-04　**预计**：2 h
- **完成标准**：
  1. 令牌按 plan §2.1 全量登记（色、玻璃三层、字体三族、字号、间距、圆角、层级、断点），生成物与令牌逐字一致（AC-001-1）
  2. 每个令牌的 `source` 指向存在的条目锚点、designUI 章节或 `spec:R-00x`（AC-008-2）
  3. CSS `@media` 宽度阈值只取令牌断点（`max-width` 取断点 − 1）的检查就位（AC-001-1，断点部分）
- **验证命令**：
  1. `pnpm -C frontend tokens:check && pnpm -C frontend guards tokens-sync:generated`
  2. `pnpm -C frontend guards design-registry:sources`
  3. `pnpm -C frontend guards tokens-sync:media`

### T-06 color-literals 守卫（含退役色）

- **上下文**：plan §2.8；FTEngine「不发明新色」（`design/ui/UI_COLORS.md#no_new_colors`）。
- **修改范围**：`frontend/scripts/guards/color-literals.mjs`（子检查 `literals` / `retired`）、`fixtures/color-literals/positives/`（`.vue` / `.ts` / `.css` 中的 `#hex`、`rgb(a)`、`hsl(a)`、`oklch`）、`fixtures/color-literals/negatives/`（`var(--fai-…)`、`T.color.…`、注释与 URL 片段里的 `#`）
- **依赖**：T-02、T-05　**预计**：1 h
- **完成标准**：
  1. 前端源码零未登记色值字面量，阳性样例全部命中、阴性样例全部不中（AC-001-2）
  2. 退役色 `#C00000` `#12264F` `#2E59A7` `#206864` `#A67EB7` 不出现在 tokens.json、生成物与源码（AC-001-6）
- **验证命令**：
  1. `pnpm -C frontend guards color-literals:literals`
  2. `pnpm -C frontend guards color-literals:retired`

### T-07 范围守卫：玻璃层级 / 涨跌色 / 裸 1fr / 网络调用

- **上下文**：plan §2.1（三层玻璃、涨跌色作用域）、§2.4（栅格）、§2.7（网络调用只在 real 实现）。先立守卫，后续代码在守卫下生长。
- **修改范围**：`frontend/scripts/guards/{glass-tiers,updown-scope,bare-1fr,network-scope}.mjs` 与各自 `fixtures/<名>/{positives,negatives}/`
- **依赖**：T-02　**预计**：1.5 h
- **完成标准**：
  1. `backdrop-filter` 只在 `src/design/glass.css` 且 ≤ 3 条规则，玻璃类名只许 `.glass-focus / .glass-module / .glass-drawer`（AC-001-3，静态部分）
  2. 涨跌令牌（`--fai-color-updown-*` / `T.color.updown`）引用只在 `src/modules/market-board/` 与 `src/workbench/FocusBand*`（AC-001-5，静态部分）
  3. `grid-template-columns` 不含未包 `minmax()` 的 `1fr`，`.shell` 规则豁免并在守卫内登记（AC-004-6）
  4. `fetch(` / `XMLHttpRequest` / `WebSocket` / `EventSource` 只在 `src/contracts/real/`（AC-007-1）
- **验证命令**：
  1. `pnpm -C frontend guards glass-tiers`
  2. `pnpm -C frontend guards updown-scope`
  3. `pnpm -C frontend guards bare-1fr`
  4. `pnpm -C frontend guards network-scope`

### T-08 基础样式与数值格式化

- **上下文**：plan §2.1（三层玻璃、字体三族、`.num`、`format.ts`、`Num` 只输出语义类）。所有界面组件的样式与数字显示都经这里。
- **修改范围**：`frontend/src/design/base.css`、`frontend/src/design/glass.css`、`frontend/src/shared/format.ts`、`frontend/src/shared/components/Num.vue`、`frontend/src/shared/components/Kpi.vue`、`frontend/src/shared/num.css`（analysis 语义类引 chart.pos / chart.neg）、`frontend/tests/unit/format.spec.ts`、`frontend/tests/component/typography.spec.ts`
- **依赖**：T-05　**预计**：1.5 h
- **完成标准**：
  1. `fmtValue` / `fmtDelta`：空值 en dash、差值正号、先按显示位取整再判零、零中性、无负零（AC-001-4，格式化部分）
  2. KPI / 标题 / 正文 / 数值元素的字族类正确，数值等宽数字且右对齐（AC-001-4，字族部分）
  3. `Num` 按 semantic 输出语义类：analysis 的负值类映射到"红 = 负"令牌（chart.neg），market 只输出类、颜色规则不在共享层（AC-001-5，组件部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-001-4 format"`
  2. `pnpm -C frontend test:unit -t "AC-001-4 typography"`
  3. `pnpm -C frontend test:unit -t "AC-001-5 num"`

### T-09 契约类型与事件契约

- **上下文**：plan §2.7（DataClient / AgentClient / Figure / 错误形态）、§2.5（AgentEvent 与 pi RPC 对照）。界面与后端之间唯一的接口。
- **修改范围**：`frontend/src/contracts/types.ts`（zod：BootstrapInfo、DailyBrief、Figure、MarketBoard、WatchlistTable、CalendarEntry、ModuleSummary、NewsItem、SourceStatus、ResearchItem、ApiError）、`frontend/src/contracts/client.ts`、`frontend/src/agent/events.ts`、`frontend/tests/unit/contracts.spec.ts`
- **依赖**：T-01　**预计**：1.5 h
- **完成标准**：
  1. 数值字段统一用 `Figure`，单位 / 频率 / 语义 / 截至时间四项必填，缺任一项的反例被拒（AC-007-4，类型部分）
  2. AgentEvent 九种事件类型与字段按 plan §2.5 定义并可校验（AC-005-6，类型部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-007-4 types"`
  2. `pnpm -C frontend test:unit -t "AC-005-6 types"`

### T-10 mock 实现

- **上下文**：plan §2.7（场景切换、测试注入）、§2.5（回放脚本）、§3（mock 数据不含真实头寸、凭证、私有文档）。
- **修改范围**：`frontend/src/contracts/mock/fixtures/`（`daily-brief.json`、`market-board.json`、`watchlist.json`、`release-calendar.json`、`module-summaries.json`、`news.json`、`sources.json`、`research.json`）、`frontend/src/contracts/mock/index.ts`（MockDataClient：场景 normal / empty / error / slow，选择顺序 URL `?scenario=` > `VITE_MOCK_SCENARIO` > normal；读取 `window.__FAI_MOCK__` 覆盖）、`frontend/src/contracts/mock/agent/{success,failure,long}.ts` + MockAgentClient、`frontend/src/contracts/real/index.ts`（NotImplementedError 桩）、`frontend/src/contracts/index.ts`（按 `VITE_DATA_MODE` 选实现）、`frontend/tests/unit/mock.spec.ts`
- **依赖**：T-09　**预计**：2 h
- **完成标准**：
  1. 全部 fixtures 通过 zod 校验，关注列表 fixture 只含分析类序列（AC-007-4，示例数据部分）
  2. 四种场景可经配置切换，行为符合 plan §2.7（AC-007-2，单元部分）
  3. 三个回放脚本的每个事件通过 AgentEvent 校验，long 脚本 ≥ 20 步、跨 15 s（AC-005-6，脚本部分）
  4. real 实现只有桩，网络调用只出现在 `src/contracts/real/`（AC-007-1）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-007-4 fixtures"`
  2. `pnpm -C frontend test:unit -t "AC-007-2"`
  3. `pnpm -C frontend test:unit -t "AC-005-6 scripts"`
  4. `pnpm -C frontend guards network-scope`

### T-11 契约文档生成与 contract-doc 守卫

- **上下文**：plan §2.7（`contract-build.mjs` 生成 CONTRACT.md 与 schema.json，作为 backend api feature 的输入）。
- **修改范围**：`frontend/scripts/contract-build.mjs`、`frontend/contracts/CONTRACT.md`、`frontend/contracts/schema.json`、`frontend/scripts/guards/contract-doc.mjs` + `fixtures/contract-doc/`、`package.json` 的 `contract` / `contract:check`
- **依赖**：T-02、T-09　**预计**：1.5 h
- **完成标准**：
  1. 由 zod 生成契约文档（方法表、字段表、语义说明、错误码表、`contractVersion`）与 JSON Schema，文档与类型逐项一致（AC-007-3）
  2. 文档包含九种 agent 事件及其字段（AC-005-6，文档部分）
- **验证命令**：
  1. `pnpm -C frontend contract:check && pnpm -C frontend guards contract-doc`
  2. `pnpm -C frontend test:unit -t "AC-005-6 doc"`

### T-12 外壳：路由、菜单、侧栏、占位页

- **上下文**：plan §2.2（`nav.ts` 八项、`Rail`、`PlaceholderPage`、持久化 key `fai.v1.ui.rail`）。
- **修改范围**：`frontend/src/app/{router.ts,nav.ts,AppShell.vue,Rail.vue}`、`frontend/src/pages/PlaceholderPage.vue`、`frontend/src/stores/ui.ts`（railCollapsed）、`frontend/src/shared/storage.ts`（StorageAdapter，命名空间 `fai.v1.`）、`frontend/src/App.vue`、`frontend/e2e/shell.spec.ts`
- **依赖**：T-08、T-10　**预计**：2 h
- **完成标准**：
  1. 八项菜单固定顺序与地址、当前项指示（`aria-current` + 点睛红竖条）、刷新后停留当前页、占位页注明归属 feature（AC-002-2）
  2. 侧栏收起 / 展开状态持久化（AC-002-5）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-2"`
  2. `pnpm -C frontend test:e2e -g "AC-002-5"`

### T-13 加载页与启动流程

- **上下文**：plan §2.2（`index.html` 静态骨架与 `LoadingScreen` 同构）、§4 流程 1。
- **修改范围**：`frontend/index.html`、`frontend/src/app/LoadingScreen.vue`、`frontend/src/stores/app.ts`（phase：loading / ready / failed + 重试）、`frontend/src/main.ts`、`frontend/e2e/shell.spec.ts`
- **依赖**：T-12　**预计**：1 h
- **完成标准**：
  1. 首帧即加载页，bootstrap 完成后进入工作台，期间无空白帧；bootstrap 失败显示文案与重试（AC-002-1）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-1"`

### T-14 顶栏与专题研究动态子项

- **上下文**：plan §2.2（`TopBar`：NewsTicker + SourceStatus；专题研究子项由 `getResearchList()` 驱动）、§2.7（测试注入）。
- **修改范围**：`frontend/src/app/TopBar.vue`、`frontend/src/app/Rail.vue`、`frontend/tests/component/topbar.spec.ts`、`frontend/e2e/shell.spec.ts`
- **依赖**：T-12　**预计**：1.5 h
- **完成标准**：
  1. 专题研究子项由研究列表驱动，经 `window.__FAI_MOCK__` 注入一项后菜单多出该项（AC-002-3）
  2. ticker 与数据源状态渲染 mock 数据，状态点 fresh / stale 取对应令牌类（AC-002-4）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-3"`
  2. `pnpm -C frontend test:unit -t "AC-002-4"`

### T-15 模块壳与注册表

- **上下文**：plan §2.4（注册表七模块、模块壳 DOM 契约、三态与诊断）。模块正文在 T-19 / T-20 填入，此前用占位正文。
- **修改范围**：`frontend/src/modules/registry.ts`、`frontend/src/modules/ModuleShell.vue`、`frontend/src/shared/components/{Badge,EmptyState,ErrorState,Loading}.vue`、`frontend/tests/component/module-shell.spec.ts`
- **依赖**：T-08、T-10　**预计**：1.5 h
- **完成标准**：
  1. 每个注册模块经模块壳渲染出 plan §2.4 的 DOM 契约（组件级逐模块检查）（AC-004-3，组件部分）
  2. 加载 / 空 / 错误三态可触发；错误态 `<code>` 含 moduleId 与错误码，复制钮写剪贴板（AC-004-4）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-3"`
  2. `pnpm -C frontend test:unit -t "AC-004-4"`

### T-16 模块栅格、布局与模块库

- **上下文**：plan §2.4（栅格列数、layoutStore、ModuleLibrary、持久化 key `fai.v1.layout`）、§4 流程 2。
- **修改范围**：`frontend/src/workbench/{WorkbenchPage.vue,ModuleGrid.vue,ModuleLibrary.vue}`、`frontend/src/stores/layout.ts`、`frontend/e2e/modules.spec.ts`
- **依赖**：T-12、T-15　**预计**：2 h
- **完成标准**：
  1. 默认布局为七个模块；模块库可添加（追加到末尾）与移除（AC-004-1）
  2. 上移 / 下移 / 移除 / 添加后刷新页面，布局保持（AC-004-2）
  3. 工作台上全部模块的 DOM 符合模块壳契约（页面级遍历）（AC-004-3，页面部分）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-004-1"`
  2. `pnpm -C frontend test:e2e -g "AC-004-2"`
  3. `pnpm -C frontend test:e2e -g "AC-004-3"`

### T-17 今日焦点带

- **上下文**：plan §2.3（结论 ≤ 3 条、数字卡、语义取色、空态、跳转）。焦点带是 market-board 之外唯一允许引用涨跌令牌的位置（经 `updown.css`）。
- **修改范围**：`frontend/src/workbench/FocusBand.vue`、`frontend/tests/component/focus-band.spec.ts`、`frontend/e2e/workbench.spec.ts`
- **依赖**：T-16　**预计**：1.5 h
- **完成标准**：
  1. 渲染 mock 日报摘要：结论条目、数字卡、方向色（AC-003-1）
  2. 点击焦点带跳转 `/daily/<date>`（AC-003-2）
  3. 无日报时空态显示契约给出的原因（AC-003-3）
  4. market 语义数字用涨跌色、analysis 语义用"红 = 负"（AC-003-4）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-003-1"`
  2. `pnpm -C frontend test:e2e -g "AC-003-2"`
  3. `pnpm -C frontend test:unit -t "AC-003-3"`
  4. `pnpm -C frontend test:unit -t "AC-003-4"`

### T-18 断点与窄窗口

- **上下文**：plan §2.2（< 980 塌顶栏）、§2.3（≥ 1240 六卡否则四卡）、§2.4（栅格 1 / 2 / 3 / 4 列）、§4 流程 4；spec Q-004。
- **修改范围**：`frontend/src/stores/ui.ts`（viewport：cols / collapsed / focusWide，`matchMedia` 监听令牌断点）、`frontend/src/app/{AppShell.vue,Rail.vue}`、`frontend/src/workbench/{ModuleGrid.vue,FocusBand.vue}`、`frontend/e2e/breakpoints.spec.ts`
- **依赖**：T-16、T-17　**预计**：1.5 h
- **完成标准**：
  1. 视口 960 / 979 / 981 / 1239 / 1241 / 1399 / 1401 / 1499 / 1501 与 1440×900 下，侧栏形态、栅格列数、焦点带卡数符合登记，文档无横向溢出（AC-002-6）
  2. CSS 媒体查询阈值全部来自令牌断点（AC-001-1，断点部分）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-6"`
  2. `pnpm -C frontend guards tokens-sync:media`

### T-19 行情价格模块（盘面网格）

- **上下文**：plan §2.4（market-board：BoardGrid、三态格）、§2.1（`updown.css` 是 market 语义颜色规则的唯一定义处）。v1 唯一使用涨跌专色的模块。
- **修改范围**：`frontend/src/modules/market-board/{MarketBoard.vue,updown.css}`、`frontend/src/shared/components/BoardGrid.vue`、`frontend/tests/component/market-board.spec.ts`
- **依赖**：T-15　**预计**：1.5 h
- **完成标准**：
  1. 盘面网格三态格分开显示：休市 `休`、待结算 `待`（琥珀）、缺数 `–`；数值等宽右对齐（AC-004-5，盘面部分）
  2. 涨跌只涂字色，涨跌令牌只在本模块引用（AC-001-5，盘面部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-5 board"`
  2. `pnpm -C frontend test:unit -t "AC-001-5 board" && pnpm -C frontend guards updown-scope`

### T-20 关注列表、数据发布日历与四个占位模块

- **上下文**：plan §2.4（watchlist：DataTable + Spark，v1 只含分析类序列；release-calendar；四个壳模块共用 ModuleSummary）。
- **修改范围**：`frontend/src/modules/watchlist/Watchlist.vue`、`frontend/src/shared/components/{DataTable.vue,Spark.vue}`、`frontend/src/modules/release-calendar/ReleaseCalendar.vue`、`frontend/src/modules/summary/ModuleSummary.vue`（supply-demand / logistics-onwater / positions / doc-catalog 共用）、`frontend/src/modules/registry.ts`（挂上真实正文）、`frontend/tests/component/modules.spec.ts`
- **依赖**：T-15　**预计**：2 h
- **完成标准**：
  1. 关注列表：数值等宽右对齐、千分位，方向色走 analysis 语义（正 / 负令牌）；迷你折线墨线 + 末点（AC-004-5，数据表部分）
  2. 数据发布日历：按时间排序的日程列表，含来源与新鲜度点（AC-004-5，日程部分）
  3. 四个占位模块渲染模块壳 + 示例占位与"内容随 domain feature 交付"说明（AC-004-3，占位模块部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-5 watchlist"`
  2. `pnpm -C frontend test:unit -t "AC-004-5 calendar"`
  3. `pnpm -C frontend test:unit -t "AC-004-3 summary"`

### T-21 图表暗色主题与样例图

- **上下文**：plan §2.6（主题由令牌生成、`registerTheme('fai-dark')`、market-board 头部样例折线、theme-contrast 守卫）；Q-003 已确认 A 等亮。
- **修改范围**：`frontend/src/design/theme.ts`、`frontend/src/modules/market-board/SampleChart.vue`（ECharts 折线，mock 近 60 日序列）、`frontend/scripts/guards/theme-contrast.mjs`（子检查 `retired` / `contrast`）+ `fixtures/theme-contrast/`、`frontend/e2e/theme.spec.ts`
- **依赖**：T-05、T-19　**预计**：1.5 h
- **完成标准**：
  1. 主题对象与令牌一致，不含退役色（AC-006-1）
  2. 序列 / 类目色对卡面 ≥ 3、文字用色 ≥ 4.5，中性退后色豁免并登记（AC-006-2）
  3. 样例图实例的序列色与令牌一致（AC-006-3）
  4. 画布背景透明（AC-006-4，自动部分）
- **验证命令**：
  1. `pnpm -C frontend tokens:check && pnpm -C frontend guards theme-contrast:retired`
  2. `pnpm -C frontend guards theme-contrast:contrast`
  3. `pnpm -C frontend test:e2e -g "AC-006-3"`
  4. `pnpm -C frontend test:e2e -g "AC-006-4"`

### T-22 对话输入栏与抽屉

- **上下文**：plan §2.5（AgentDock、AgentDrawer 两档 + 收起、应用级订阅）、§4 流程 3。
- **修改范围**：`frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue}`、`frontend/src/stores/ui.ts`（drawer：closed / half / tall，key `fai.v1.ui.drawer`）、`frontend/src/main.ts`（订阅 `agentClient`）、`frontend/src/app/AppShell.vue`、`frontend/e2e/agent.spec.ts`
- **依赖**：T-12、T-10　**预计**：1.5 h
- **完成标准**：
  1. 输入栏在全部八个路由可见；提交后抽屉展开并显示用户消息；抽屉两档高度与收起可切换（AC-005-1）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-005-1"`

### T-23 CoT 时间线

- **上下文**：plan §2.5（步骤类型、增量合并与 `done` 替换、终态行）。
- **修改范围**：`frontend/src/agent/CotTimeline.vue`、`frontend/src/agent/store.ts`、`frontend/tests/component/timeline.spec.ts`
- **依赖**：T-22　**预计**：1.5 h
- **完成标准**：
  1. 回放 success / failure 脚本：步骤数正确，每步可展开 / 收起详情，终态（完成 / 失败）显示（AC-005-2）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-005-2"`

### T-24 模块角标、引导跳转与后台运行

- **上下文**：plan §2.5（badgesStore、`hint.navigate`、`data-highlight`、订阅在应用级）。
- **修改范围**：`frontend/src/stores/badges.ts`、`frontend/src/modules/ModuleShell.vue`（`data-ai`、`data-highlight`）、`frontend/src/agent/CotTimeline.vue`（跳转入口）、`frontend/e2e/agent.spec.ts`
- **依赖**：T-16、T-23　**预计**：1.5 h
- **完成标准**：
  1. long 脚本运行中切到其他页面再返回，时间线包含切走期间产生的步骤且无重复（AC-005-3）
  2. 带 moduleId 的事件使模块角标 running → done，用户查看后清除（AC-005-4）
  3. `hint.navigate` 生成入口，点击后导航并高亮目标模块（AC-005-5）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-005-3"`
  2. `pnpm -C frontend test:e2e -g "AC-005-4"`
  3. `pnpm -C frontend test:e2e -g "AC-005-5"`

### T-25 mock 四场景端到端

- **上下文**：plan §2.7（场景 normal / empty / error / slow，URL `?scenario=` 覆盖）。
- **修改范围**：`frontend/e2e/scenarios.spec.ts`
- **依赖**：T-14、T-16、T-17、T-22　**预计**：1 h
- **完成标准**：
  1. 四个场景各一用例：normal 正常渲染、empty 空态、error 错误态（含诊断）、slow 先见加载态后就绪（AC-007-2，端到端部分）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-007-2"`

### T-26 一条命令全绿、人工验收清单与前端 README

- **上下文**：plan §2.8（`pnpm test` 串联顺序）、§5（AC-009-1 / AC-009-2）；docs/plan.md §5（代码目录配 README：职责 / 入口 / 验证）。
- **修改范围**：`frontend/package.json`（`test` = `tokens:check` → `guards` → `typecheck` → `lint` → `test:unit` → `test:e2e`）、`specs/frontend-workbench/manual-acceptance.md`（M-01~M-08，每项写"看什么"，覆盖 AC-001-3 / AC-004-5 / AC-006-4 的人工部分）、`frontend/README.md`、`frontend/tests/unit/manual-acceptance.spec.ts`
- **依赖**：T-01 ~ T-25　**预计**：1 h
- **完成标准**：
  1. `pnpm -C frontend test` 一条命令跑完全部自动化检查并全绿（AC-009-1）
  2. 人工验收清单 M-01~M-08 齐备，每项有"看什么"描述；截图在 Handoff 附（AC-009-2）
- **验证命令**：
  1. `pnpm -C frontend test`（退出码 0）
  2. `pnpm -C frontend test:unit -t "AC-009-2"`

### T-27 docs 指针同步

- **上下文**：spec R-008（designUI.md 的细则引用指向移植条目）；plan §2.9（docs 改动随 Handoff 同一 PR）。
- **修改范围**：`docs/designUI.md` §2.3 / §6 / §8 中"随 design/ 移植定稿"一类字样改为指向 `design/ui/*.md`、`design/charts/*.md` 的具体条目；核对 `design/ui/README.md`、`design/charts/README.md` 索引
- **依赖**：T-03、T-04　**预计**：0.5 h
- **完成标准**：
  1. designUI.md 的移植引用指向已移植条目，引用路径全部存在（AC-008-1，索引与引用部分）
- **验证命令**：
  1. `pnpm -C frontend guards design-registry:docs`

## AC 覆盖矩阵

| AC | 任务 |
|---|---|
| AC-001-1 | T-05、T-18 |
| AC-001-2 | T-06 |
| AC-001-3 | T-07（静态）、T-26（人工 M-01） |
| AC-001-4 | T-08 |
| AC-001-5 | T-07（静态）、T-08、T-19 |
| AC-001-6 | T-06 |
| AC-002-1 | T-13 |
| AC-002-2 | T-12 |
| AC-002-3 | T-14 |
| AC-002-4 | T-14 |
| AC-002-5 | T-12 |
| AC-002-6 | T-18 |
| AC-003-1 ~ AC-003-4 | T-17 |
| AC-004-1 | T-16 |
| AC-004-2 | T-16 |
| AC-004-3 | T-15（组件）、T-16（页面）、T-20（占位模块） |
| AC-004-4 | T-15 |
| AC-004-5 | T-19、T-20、T-26（人工 M-04） |
| AC-004-6 | T-07 |
| AC-005-1 | T-22 |
| AC-005-2 | T-23 |
| AC-005-3 ~ AC-005-5 | T-24 |
| AC-005-6 | T-09、T-10、T-11 |
| AC-006-1 ~ AC-006-3 | T-21 |
| AC-006-4 | T-21、T-26（人工 M-08） |
| AC-007-1 | T-07、T-10 |
| AC-007-2 | T-10（单元）、T-25（端到端） |
| AC-007-3 | T-11 |
| AC-007-4 | T-09、T-10 |
| AC-008-1 | T-02、T-03、T-04、T-27 |
| AC-008-2 | T-02、T-05 |
| AC-008-3 | T-02、T-04 |
| AC-009-1 | T-01（打底）、T-26 |
| AC-009-2 | T-26 |

合计 27 个任务，预计约 41 小时。
