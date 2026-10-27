# Feature: frontend-workbench 任务清单（tasks.md）

> Tasks 阶段产物：每个任务 0.5–2 小时可完成，按依赖顺序执行（Implement 阶段）。
> **状态：草案第二版（2026-10-27）——Checklist 通过后生效。** 执行前置条件：`checklist.md` 全部勾选。
> 依据：`spec.md`（Clarify 回流 Q-015 ~ Q-022 修订版，2026-10-27 Gate 1 重新批准、已冻结；45 条 AC）+ `plan.md`（第三版）。第二版按 Checklist 第一轮双审重排：拆出新增值登记（T-05）、网络守卫（T-09）、agent 回放（T-13），新增 ac-coverage 守卫，补齐守卫依赖。
> 完成标准引用 spec 的 AC 编号；一个 AC 由多个任务分担时标注本任务负责的部分，AC 整体是否满足以 Converge 时相关任务全部完成为准。

## 约定

- **执行位置**：命令在 worktree 根目录 `D:\2030\Futures-AI-frontend` 执行，前端命令一律 `pnpm -C frontend …`
- **测试命名**：每个测试标题以所验证的 AC 编号开头（如 `AC-002-2 菜单八项顺序与地址`），验证命令用 `-t`（Vitest）/ `-g`（Playwright）按编号选取；**筛选未命中任何测试时命令须失败**（Vitest 默认行为；Playwright 配置 `forbidOnly` + 守卫 `ac-coverage` 兜底）
- **守卫**：`pnpm -C frontend guards <名>[:<子检查>]`；每个守卫先跑自身阳性 / 阴性 fixtures 自检，再扫真实文件，任一不符即非零退出（plan §2.8）
- **提交**：每完成一个任务提交一次，提交信息以任务号开头（如 `T-06 令牌源与生成器`）
- **边界**：只动 `frontend/`、`design/`、`specs/frontend-workbench/`、根 `.gitignore`（追加）、`specs/README.md`（本 feature 一行）与 `docs/designUI.md`（T-30 指针同步）；不碰 `backend/`（plan §1 文件边界）

## 任务

### T-01 前端脚手架与依赖冒烟

- **上下文**：plan §1（栈与工具链）与 §6 首条风险（Node 25 / TS 7 / Vite 8 / Vitest 5 搭配未验证）。后续全部任务的前提。
- **修改范围**：新建 `frontend/`：`package.json`（`engines.node >= 22.12`；scripts：`dev` `build` `preview` `typecheck` `lint` `test:unit` `test:e2e` `tokens` `tokens:check` `contract` `contract:check` `guards` `test`，后几个先放占位，由后续任务填实）、`pnpm-lock.yaml`、`vite.config.ts`、`tsconfig.json` / `tsconfig.node.json`、`vitest.config.ts`（happy-dom）、`playwright.config.ts`（`channel: 'chrome'`，`webServer` = `vite --port 5299 --strictPort`）、`eslint.config.js`（基础规则）、`.prettierrc`（`endOfLine: lf`）、`.gitattributes`（`* text=auto eol=lf`）、`index.html`（含空的 `<!-- fai:critical:start/end -->` 标记块）、`src/main.ts`、`src/App.vue`、`tests/unit/smoke.spec.ts`、`e2e/smoke.spec.ts`；根 `.gitignore` 追加五行（plan §1）
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

- **上下文**：plan §2.8（守卫清单与运行方式）、§2.9（条目文件格式与全锚覆盖）。守卫先于被守对象建立，移植任务用它验收。
- **修改范围**：`frontend/scripts/guards/run.mjs`（按名 / 子检查运行、fixtures 自检、`--self-test`、汇总后非零退出；读取各守卫声明的 `acs`）、`frontend/scripts/guards/design-registry.mjs`（子检查 `entries` / `required` / `palette` / `sources` / `docs`）、`frontend/scripts/guards/fixtures/design-registry/{positives,negatives}/`、`package.json` 的 `guards` 脚本
- **依赖**：T-01　**预计**：1.5 h
- **完成标准**：
  1. 运行器：无参跑全部守卫、带名跑指定守卫或子检查；每个守卫先自检 fixtures（阳性须全部命中、阴性须全部不中），为全部守卫类 AC（AC-001-1/2/3/5/6、AC-004-6、AC-006-1/2、AC-007-1/3、AC-008-1/2/3）提供执行机制
  2. design-registry 五个子检查按 plan §2.8 判定（含 `adopted ∪ not_adopted = source_anchors`、source 三种形式），fixtures 覆盖每个子检查的阳性与阴性（AC-008-1 / AC-008-2 / AC-008-3 的判定逻辑）
- **验证命令**：
  1. `pnpm -C frontend guards --self-test`
  2. `pnpm -C frontend guards design-registry --self-test`

### T-03 规范资产移植（一）：Foundations / Colors / Fonts / Layout

- **上下文**：plan §2.9 前四行；spec R-008。这四份为令牌 `source` 提供锚点（T-06 依赖）。源：`D:\FTEngine\design\UI\{Foundations,Colors,Fonts,Layout}`（共 41 个原锚）。
- **修改范围**：`design/ui/UI_FOUNDATIONS.md`、`design/ui/UI_COLORS.md`、`design/ui/UI_FONTS.md`、`design/ui/UI_LAYOUT.md`、`design/ui/README.md`
- **依赖**：T-02　**预计**：2 h
- **完成标准**：
  1. 四份条目按 plan §2.9 移植：原 front matter 与原 `id` 保留，追加 `source / source_verified / migrated / adaptation / source_anchors / adopted / not_adopted`；采用的锚保留"规定 / 为什么 / 落点"，不采用的锚保留标题 + 一行原因；末尾 `## 暗色适配` 段逐锚写差异；README 登记来源路径、移植日期与采用范围（AC-008-1，这四份与索引）
- **验证命令**：
  1. `pnpm -C frontend guards design-registry:entries`

### T-04 规范资产移植（二）：Components / Cards / Tables / Nav 与图表配色

- **上下文**：plan §2.9 后续行；`PALETTE_CORE.md` 的 `palette-core` / `palette-retired` 块是 color-literals 与 theme-contrast 守卫的数据源；`PALETTE_DARK.md` 记录 Q-003 裁定（A 等亮）。
- **修改范围**：`design/ui/UI_COMPONENTS.md`、`design/ui/UI_CARDS.md`、`design/ui/UI_TABLES.md`、`design/ui/UI_NAV.md`、`design/ui/README.md`（补登四份）、`design/charts/PALETTE_CORE.md`（原件逐字复制 + 追加 front matter 字段与 `## 暗色适配` 指向 PALETTE_DARK）、`design/charts/PALETTE_DARK.md`（plan §2.1 配色表里 **palette-core 原色**的暗色值——每个用途一个 `### #<锚>`、方法、两个卡面的对比度、ΔE2000、Q-003 裁定记录、样张路径；界面三色不入此文件）、`design/charts/README.md`
- **依赖**：T-03　**预计**：2 h
- **完成标准**：
  1. 四份 UI 条目（共 45 个原锚全覆盖）与两份 charts 文件格式合规（AC-008-1）
  2. `PALETTE_DARK.md` 逐个列出 palette-core 原色的暗色值与对比度（AC-008-3）
- **验证命令**：
  1. `pnpm -C frontend guards design-registry:entries`
  2. `pnpm -C frontend guards design-registry:palette`

### T-05 暗色新增值登记

- **上下文**：plan §2.1（令牌 source 只许指向条目锚或 designUI 节号）、§2.9 末行。本 feature 新增的值先在条目里写明数值与理由，令牌再引用（AC-008-2 的前提）。
- **修改范围**：`design/ui/UI_DARK_ADDITIONS.md`（锚：glass_tiers、worst_surface、accent_non_text、type_additions、radius_additions、z_layers、window；每锚 规定 / 为什么 / 落点）、`design/ui/README.md`（登记）
- **依赖**：T-03、T-04　**预计**：0.5 h
- **完成标准**：
  1. 新增值条目合规，且 spec R-008 要求的条目集合（八份 UI + 新增值 + 两份 charts）齐备（AC-008-1）
- **验证命令**：
  1. `pnpm -C frontend guards design-registry:entries && pnpm -C frontend guards design-registry:required`

### T-06 令牌源、生成器与 tokens-sync 守卫（含首帧块）

- **上下文**：plan §2.1（令牌分组与来源、三层玻璃映射、Q-003 配色表）、§2.6（主题由令牌生成）、§2.2（首帧样式来自令牌）。
- **修改范围**：`frontend/src/design/tokens.json`、`frontend/src/design/tokens.schema.json`、`frontend/scripts/tokens-build.mjs`、`frontend/src/design/generated/{tokens.css,tokens.ts,echarts-theme.json,critical.css}`、`frontend/index.html`（首帧标记块由生成器写入）、`frontend/scripts/guards/tokens-sync.mjs`（子检查 `generated` / `media`）+ `fixtures/tokens-sync/`、`package.json` 的 `tokens` / `tokens:check`
- **依赖**：T-05　**预计**：2 h
- **完成标准**：
  1. 令牌按 plan §2.1 全量登记（含 `main_scale` 45 键全量、三层玻璃映射、Q-003 配色），全部生成物与 `index.html` 标记块与令牌逐字一致（AC-001-1，静态部分）
  2. 每个令牌的 `source` 符合三种形式且锚 / 节号可解析（AC-008-2）
  3. CSS `@media` 宽度阈值只取令牌断点的检查就位（AC-001-1，断点部分）
- **验证命令**：
  1. `pnpm -C frontend tokens:check && pnpm -C frontend guards tokens-sync:generated`
  2. `pnpm -C frontend guards design-registry:sources`
  3. `pnpm -C frontend guards tokens-sync:media`

### T-07 color-literals 守卫（含退役色）

- **上下文**：plan §2.8；FTEngine「不发明新色」（`design/ui/UI_COLORS.md#no_new_colors`）。
- **修改范围**：`frontend/scripts/guards/color-literals.mjs`（子检查 `literals` / `retired`）、`fixtures/color-literals/positives/`（`.vue` / `.ts` / `.css` / `index.html` 中的各种颜色函数与 `#hex`、`color: red` 具名色、`style=""` 与 `:style` 内联色、`index.html` 标记块外的退役色）、`fixtures/color-literals/negatives/`（`var(--fai-…)`、`T.color.…`、`transparent` / `currentColor`、注释与 URL 片段里的 `#`、正文里的颜色单词、标记块内的生成值）
- **依赖**：T-02、T-06　**预计**：1 h
- **完成标准**：
  1. 前端源码与 `index.html`（标记块除外）零未登记色值字面量，阳性样例全部命中、阴性样例全部不中（AC-001-2）
  2. 退役色 `#C00000` `#12264F` `#2E59A7` `#206864` `#A67EB7` 不出现在 tokens.json、生成物、`index.html` 与源码（AC-001-6）
- **验证命令**：
  1. `pnpm -C frontend guards color-literals:literals`
  2. `pnpm -C frontend guards color-literals:retired`

### T-08 范围守卫：玻璃层级 / 涨跌色 / 裸 1fr

- **上下文**：plan §2.1（三层玻璃映射、涨跌色四道防线）、§2.4（栅格）、§2.8。先立守卫，后续代码在守卫下生长。
- **修改范围**：`frontend/scripts/guards/{glass-tiers,layering,updown-scope,bare-1fr}.mjs` 与各自 `fixtures/<名>/{positives,negatives}/`
- **依赖**：T-02　**预计**：1.5 h
- **完成标准**：
  1. `backdrop-filter` 只在 `src/design/glass.css` 且 ≤ 3 条规则（扫描 CSS、`<style>`、内联样式、主题 JSON 字符串值），玻璃类名只许三个（AC-001-3，静态部分）
  2. updown-scope 四个子检查（refs 定义处豁免、color-only、imports 限三处、usage 限三处与 `Num.vue`）按 plan §2.1 判定（AC-001-5，静态部分）
  3. `grid-template-columns` 不含未包 `minmax()` 的 `1fr`，零豁免（AC-004-6）
  4. layering：带 `backdrop-filter` 的 sticky / fixed 元素只许是登记的三层容器；玻璃容器不得嵌套（带文字元素不得位于两层玻璃之上，plan §2.1 叠层约束）（AC-001-3 / AC-006-2）
- **验证命令**：
  1. `pnpm -C frontend guards glass-tiers`
  2. `pnpm -C frontend guards updown-scope`
  3. `pnpm -C frontend guards bare-1fr`
  4. `pnpm -C frontend guards layering`

### T-09 network-scope 守卫（ESLint 语法级）

- **上下文**：plan §2.8 network-scope 行。文本模式匹配会被别名、计算属性与第三方客户端绕过，改用 ESLint 规则做语法级检查。
- **修改范围**：`frontend/eslint.config.js`（`no-restricted-globals` / `no-restricted-properties` / `no-restricted-syntax` / `no-restricted-imports`，`src/contracts/real/**` 例外）、`frontend/scripts/guards/network-scope.mjs`（经 ESLint API 只跑这组规则）+ `fixtures/network-scope/`（阳性：直接调用、`const f = fetch` 别名、`window['fetch']`、`globalThis.fetch`、`navigator.sendBeacon`、导入 axios / ws；阴性：`src/contracts/real/` 内的调用、同名局部变量）
- **依赖**：T-01、T-02　**预计**：1 h
- **完成标准**：
  1. 网络调用只能出现在 `src/contracts/real/`，各类绕过写法的阳性样例全部命中（AC-007-1）
- **验证命令**：
  1. `pnpm -C frontend guards network-scope`

### T-10 基础样式与数值格式化

- **上下文**：plan §2.1（三层玻璃映射、字体三族与 KPI 例外、`.num`、`format.ts`、`Num` 只输出语义类、`updown.css` 只写 color）。所有界面组件的样式与数字显示都经这里。
- **修改范围**：`frontend/src/design/base.css`、`frontend/src/design/glass.css`、`frontend/src/design/updown.css`、`frontend/src/shared/num.css`、`frontend/src/shared/format.ts`、`frontend/src/shared/components/{Num.vue,Kpi.vue}`、`frontend/tests/unit/format.spec.ts`、`frontend/tests/component/typography.spec.ts`
- **依赖**：T-06、T-08　**预计**：1.5 h
- **完成标准**：
  1. `fmtValue` / `fmtDelta`：空值 en dash、差值正号、先按显示位取整再判零、零中性、无负零、pct 为百分数值（AC-001-4，格式化部分）
  2. KPI 大数用衬线类、模块壳标题与正文用无衬线类、其余数值用 `.num`（等宽 + 等宽数字 + 右对齐）（AC-001-4，字族部分）
  3. `Num` 按 semantic 输出语义类：analysis 负值类映射到"红 = 负"令牌（chart.neg）；market 语义类颜色规则只在 `updown.css` 且只写 color（AC-001-5，组件部分）
  4. `glass.css` 按三层映射定义三个类（AC-001-3）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-001-4 format"`
  2. `pnpm -C frontend test:unit -t "AC-001-4 typography"`
  3. `pnpm -C frontend test:unit -t "AC-001-5 num" && pnpm -C frontend guards updown-scope`
  4. `pnpm -C frontend guards glass-tiers`

### T-11 契约类型、方法语义表与事件契约

- **上下文**：plan §2.7（DataClient / AgentClient、Figure、BoardCell、WatchlistTable、ModuleDef、参数语义）、§2.5（十种事件、终态唯一）。界面与后端之间唯一的接口。
- **修改范围**：`frontend/src/contracts/types.ts`（zod，字段带 `.describe()`）、`frontend/src/contracts/client.ts`、`frontend/src/contracts/methods.ts`（`CONTRACT_METHODS`）、`frontend/src/agent/events.ts`、`frontend/tests/unit/contracts.spec.ts`
- **依赖**：T-01　**预计**：1.5 h
- **完成标准**：
  1. 业务数值统一用 `Figure`（四项元数据必填）；`BoardCell` 满足 `state = ok ⇔ figure ≠ null`；缺任一元数据或 `ok` 缺 figure 的反例被拒（AC-007-4，类型部分）
  2. AgentEvent 十种事件类型与字段按 plan §2.5 定义并可校验（AC-005-6，类型部分）
  3. DataClient / AgentClient 每个方法在 `CONTRACT_METHODS` 有语义条目，每个 schema 字段有描述（AC-007-3，语义源部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-007-4 types"`
  2. `pnpm -C frontend test:unit -t "AC-005-6 types"`
  3. `pnpm -C frontend test:unit -t "AC-007-3 methods"`

### T-12 数据 mock（fixtures / 场景 / 注入 / real 桩）

- **上下文**：plan §2.7 mock 段（五种场景、error 场景下 bootstrap 成功、boot-error、测试注入）、§3（mock 数据不含真实头寸、凭证、私有文档）。
- **修改范围**：`frontend/src/contracts/mock/fixtures/`（`module-catalog.json`、`daily-brief.json`、`market-board.json`、`watchlist.json`、`release-calendar.json`、`module-summaries.json`、`news.json`、`sources.json`、`research.json`）、`frontend/src/contracts/mock/index.ts`（MockDataClient：场景选择 URL `?scenario=` > `VITE_MOCK_SCENARIO` > normal；读取 `window.__FAI_MOCK__` 覆盖）、`frontend/src/contracts/real/index.ts`（NotImplementedError 桩）、`frontend/src/contracts/index.ts`（按 `VITE_DATA_MODE` 选实现）、`frontend/tests/unit/mock.spec.ts`
- **依赖**：T-09、T-11　**预计**：2 h
- **完成标准**：
  1. 全部 fixtures 通过 zod 校验；关注列表为关注的合约价格（AC-007-4，示例数据部分）
  2. `semantic: 'market'` 只出现在 `daily-brief.json`、`market-board.json`、`watchlist.json`（AC-001-5，数据来源部分）
  3. 五种场景可经配置切换，按 plan §2.7 场景 × 方法矩阵逐格成立（`bootstrap()` 与 `getModuleCatalog()` 在 normal / empty / error / slow 下均成功且目录含七个；empty 空数据、error 业务方法报错、slow 延迟、boot-error 首次失败重试成功）（AC-007-2，单元部分）
  4. real 实现只有桩，网络调用只出现在 `src/contracts/real/`（AC-007-1）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-007-4 fixtures"`
  2. `pnpm -C frontend test:unit -t "AC-001-5 fixtures"`
  3. `pnpm -C frontend test:unit -t "AC-007-2"`
  4. `pnpm -C frontend guards network-scope`

### T-13 agent 回放脚本与 MockAgentClient

- **上下文**：plan §2.5 mock 回放段（五个脚本、选择规则、终态唯一）。为时间线、后台运行与跳转用例提供确定的输入。
- **修改范围**：`frontend/src/contracts/mock/agent/{success,failure,long,retry,abort}.ts`、`frontend/src/contracts/mock/agent/index.ts`（MockAgentClient：脚本选择 URL `?agentScript=` > `window.__FAI_MOCK__.agentScript` > success）、`frontend/tests/unit/agent-mock.spec.ts`
- **依赖**：T-11　**预计**：1 h
- **完成标准**：
  1. 五个脚本的每个事件通过 AgentEvent 校验，每个脚本恰好一个终态；long ≥ 20 步、跨 ≥ 15 s（AC-005-6，脚本部分）
  2. 脚本可经 URL 参数与注入对象选择，未知脚本名报错（为 AC-005-3 等端到端用例提供确定入口）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-005-6 scripts"`
  2. `pnpm -C frontend test:unit -t "AC-005-3 selection"`

### T-14 契约文档生成与 contract-doc 守卫

- **上下文**：plan §2.7 文档生成段与参数语义约定（交易日、时区、闭区间、不分页、百分数口径）。CONTRACT.md 与 schema.json 是 backend api feature 的输入。
- **修改范围**：`frontend/scripts/contract-build.mjs`、`frontend/contracts/CONTRACT.md`、`frontend/contracts/schema.json`、`frontend/scripts/guards/contract-doc.mjs` + `fixtures/contract-doc/`、`frontend/tests/unit/contract-doc.spec.ts`、`package.json` 的 `contract` / `contract:check`
- **依赖**：T-02、T-11　**预计**：1.5 h
- **完成标准**：
  1. 由 zod 与 `CONTRACT_METHODS` 生成契约文档（方法表、字段表、语义约定、错误码表、`contractVersion`）与 JSON Schema，文档与类型逐项一致（AC-007-3）
  2. 文档包含十种 agent 事件及其字段与"终态唯一"约定（AC-005-6，文档部分）
- **验证命令**：
  1. `pnpm -C frontend contract:check && pnpm -C frontend guards contract-doc`
  2. `pnpm -C frontend test:unit -t "AC-005-6 doc"`

### T-15 外壳：路由、菜单、侧栏、占位页与深链

- **上下文**：plan §2.2（`nav.ts` 八项、`Rail`、`PlaceholderPage`、就绪后只有 `/` 才跳工作台、持久化 key `fai.v1.ui.rail`）。
- **修改范围**：`frontend/src/app/{router.ts,nav.ts,AppShell.vue,Rail.vue}`、`frontend/src/pages/PlaceholderPage.vue`、`frontend/src/workbench/WorkbenchPage.vue`（骨架：焦点带占位 + 模块区容器，供 T-16 的启动用例有页面可达；T-19 再填入真实栅格与模块库）、`frontend/src/stores/{app.ts,ui.ts}`（启动阶段与就绪跳转规则；railCollapsed）、`frontend/src/shared/storage.ts`（StorageAdapter，命名空间 `fai.v1.`）、`frontend/src/App.vue`、`frontend/e2e/shell.spec.ts`
- **依赖**：T-10、T-12　**预计**：2 h
- **完成标准**：
  1. 八项菜单固定顺序与地址、当前项指示（`aria-current` + 点睛红竖条）、占位页注明归属 feature；直接打开非工作台地址并刷新仍停留该页（AC-002-2）
  2. 侧栏收起 / 展开状态持久化（AC-002-5）
  3. `/workbench` 路由可渲染工作台页骨架（焦点带占位 + 模块区容器），为 T-16 / T-19 提供页面承接（AC-002-1 / AC-002-2）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-2"`
  2. `pnpm -C frontend test:e2e -g "AC-002-5"`
  3. `pnpm -C frontend test:e2e -g "AC-002-1 skeleton"`

### T-16 加载页、首帧与启动失败重试

- **上下文**：plan §2.2 启动段（`index.html` 静态骨架与 `LoadingScreen` 同构、首帧样式来自令牌生成块、通知文案、失败原因与重试）、§4 流程 1。
- **修改范围**：`frontend/index.html`（骨架结构，标记块仍由生成器维护）、`frontend/src/app/LoadingScreen.vue`、`frontend/src/stores/app.ts`（failed + 重试 + notice）、`frontend/src/main.ts`、`frontend/e2e/shell.spec.ts`
- **依赖**：T-06、T-15（工作台页骨架由 T-15 提供）　**预计**：1.5 h
- **完成标准**：
  1. 首帧即加载骨架（主脚本延迟加载时也可见），就绪后进入工作台页（T-15 骨架，含焦点带占位与模块区容器），期间无空白帧（AC-002-1）
  2. 加载页显示进度与通知文案；`boot-error` 场景下显示原因与重试，重试成功后进入工作台（AC-002-7）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-1"`
  2. `pnpm -C frontend test:e2e -g "AC-002-7"`

### T-17 顶栏与专题研究动态子项

- **上下文**：plan §2.2（`TopBar`：NewsTicker + SourceStatus；专题研究子项由 `getResearchList()` 驱动）、§2.7（测试注入）。
- **修改范围**：`frontend/src/app/TopBar.vue`、`frontend/src/app/Rail.vue`、`frontend/tests/component/topbar.spec.ts`、`frontend/e2e/shell.spec.ts`
- **依赖**：T-15　**预计**：1.5 h
- **完成标准**：
  1. 专题研究子项由研究列表驱动，经 `window.__FAI_MOCK__` 注入一项后菜单多出该项（AC-002-3）
  2. ticker 与数据源状态渲染 mock 数据，状态点 fresh / stale 取对应令牌类（AC-002-4）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-3"`
  2. `pnpm -C frontend test:unit -t "AC-002-4"`

### T-18 模块壳、组件注册表与模块目录

- **上下文**：plan §2.4（目录经 `getModuleCatalog()` 读取、`registry.ts` 只做 id → 组件映射、模块壳 DOM 契约、三态与诊断）。模块正文在 T-22 / T-23 填入，此前用占位正文。
- **修改范围**：`frontend/src/modules/registry.ts`、`frontend/src/modules/ModuleShell.vue`、`frontend/src/shared/components/{Badge,EmptyState,ErrorState,Loading}.vue`、`frontend/tests/component/module-shell.spec.ts`
- **依赖**：T-10、T-12　**预计**：1.5 h
- **完成标准**：
  1. 目录中的每个模块经模块壳渲染出 plan §2.4 的 DOM 契约（组件级逐模块检查）；目录有而注册表无的 id 标为不可用（AC-004-3，组件部分）
  2. 加载 / 空 / 错误三态可触发；错误态 `<code>` 含 moduleId 与错误码，复制钮写剪贴板（AC-004-4，组件部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-3"`
  2. `pnpm -C frontend test:unit -t "AC-004-4"`

### T-19 模块栅格、布局与模块库

- **上下文**：plan §2.4（栅格列数、layoutStore 默认 = 目录顺序、模块库列出全部七个并标状态、`.glass-drawer` 面板、持久化 key `fai.v1.layout`）、§4 流程 2。
- **修改范围**：`frontend/src/workbench/{WorkbenchPage.vue,ModuleGrid.vue,ModuleLibrary.vue}`（WorkbenchPage 由 T-15 的骨架改为装配 FocusBand + ModuleGrid）、`frontend/src/stores/layout.ts`、`frontend/e2e/modules.spec.ts`
- **依赖**：T-15、T-18　**预计**：2 h
- **完成标准**：
  1. 默认布局为七个模块且顺序 = 目录顺序；模块库列出全部七个并标明是否已在工作台，可添加（追加到末尾）与移除（AC-004-1）
  2. 模块库每项显示目录中的 `description` 文案；模块默认跨列取目录 `defaultSpan`，列数不足时截断为剩余列数（断言 `grid-column` 计算值）（AC-004-1）
  3. 上移 / 下移 / 移除 / 添加后刷新页面，布局保持（AC-004-2）
  4. 工作台上全部模块的 DOM 符合模块壳契约（页面级遍历）（AC-004-3，页面部分）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-004-1"`
  2. `pnpm -C frontend test:e2e -g "AC-004-1 catalog"`
  3. `pnpm -C frontend test:e2e -g "AC-004-2"`
  4. `pnpm -C frontend test:e2e -g "AC-004-3"`

### T-20 今日焦点带（行情 | 指标两段、固定）

- **上下文**：plan §2.3（结论 ≤ 3 条、数字卡按语义分两段、行情段引入 `updown.css`、空态、跳转、焦点带固定）；D-013。
- **修改范围**：`frontend/src/workbench/FocusBand.vue`、`frontend/tests/component/focus-band.spec.ts`、`frontend/e2e/workbench.spec.ts`
- **依赖**：T-19　**预计**：2 h
- **完成标准**：
  1. 渲染 mock 日报摘要：结论条目、数字卡、方向色（AC-003-1）
  2. 点击焦点带跳转 `/daily/<date>`（AC-003-2）
  3. `brief = null` 时空态显示契约给出的原因（AC-003-3）
  4. market 语义数字用涨跌色、analysis 语义用"红 = 负"（AC-003-4）
  5. 行情数字只在行情段、分析数字只在指标段，涨跌色只出现在行情段（AC-003-5）
  6. 焦点带不在模块库、无移除钮，增删模块后仍在（AC-003-6）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-003-1"`
  2. `pnpm -C frontend test:e2e -g "AC-003-2"`
  3. `pnpm -C frontend test:unit -t "AC-003-3"`
  4. `pnpm -C frontend test:unit -t "AC-003-4"`
  5. `pnpm -C frontend test:unit -t "AC-003-5"`
  6. `pnpm -C frontend test:e2e -g "AC-003-6"`

### T-21 断点、窄窗口与运行时令牌对拍

- **上下文**：plan §2.2 断点表（Q-018）、§2.1 运行时对拍与字体族、§4 流程 5。
- **修改范围**：`frontend/src/stores/ui.ts`（viewport：collapsed / cols / focusCards，`matchMedia` 监听令牌断点）、`frontend/src/app/{AppShell.vue,Rail.vue}`、`frontend/src/workbench/{ModuleGrid.vue,FocusBand.vue}`、`frontend/e2e/breakpoints.spec.ts`、`frontend/e2e/tokens.spec.ts`
- **依赖**：T-19、T-20　**预计**：2 h
- **完成标准**：
  1. 视口 960 / 979 / 981 / 1239 / 1241 / 1399 / 1401 / 1499 / 1501 与 1440×900 下，侧栏形态、模块栅格列数、焦点带卡数符合断点表，文档无横向溢出（AC-002-6）
  2. 运行时逐令牌对拍通过，且覆盖某变量的阳性自检被检出（AC-001-1，运行时部分）
  3. CSS 媒体查询阈值全部来自令牌断点（AC-001-1，断点部分）
  4. KPI 大数、模块壳标题、正文、数值的计算字体族首项正确（AC-001-4，运行时部分）
  5. 滚动到模块区底部，任何模块壳的 `getBoundingClientRect()` 与焦点带矩形都不相交（焦点带不重叠内容，plan §2.1 叠层约束；AC-001-3）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-6"`
  2. `pnpm -C frontend test:e2e -g "AC-001-1"`
  3. `pnpm -C frontend guards tokens-sync:media`
  4. `pnpm -C frontend test:e2e -g "AC-001-4 computed"`
  5. `pnpm -C frontend test:e2e -g "AC-001-3 layering"`

### T-22 行情价格模块（盘面网格）

- **上下文**：plan §2.4（market-board：BoardGrid、BoardCell 四态）、§2.1（引入 `src/design/updown.css`）。v1 使用涨跌专色的两个模块之一（另一个是关注列表，Q-015）。
- **修改范围**：`frontend/src/modules/market-board/MarketBoard.vue`、`frontend/src/shared/components/BoardGrid.vue`、`frontend/tests/component/market-board.spec.ts`
- **依赖**：T-08、T-18　**预计**：1.5 h
- **完成标准**：
  1. 盘面网格四态格分开显示：`ok` 数值、休市 `休`、待结算 `待`（琥珀）、缺数 `–`；数值等宽右对齐（AC-004-5，盘面部分）
  2. 涨跌只涂字色，红涨绿跌经 `updown.css` 取色（AC-001-5，盘面部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-5 board"`
  2. `pnpm -C frontend test:unit -t "AC-001-5 board" && pnpm -C frontend guards updown-scope`

### T-23 关注列表、数据发布日历与四个占位模块

- **上下文**：plan §2.4（watchlist：DataTable + Spark，关注合约价格、红涨绿跌，Q-015；release-calendar；四个壳模块共用 ModuleSummary）。
- **修改范围**：`frontend/src/modules/watchlist/Watchlist.vue`、`frontend/src/shared/components/{DataTable.vue,Spark.vue}`、`frontend/src/modules/release-calendar/ReleaseCalendar.vue`、`frontend/src/modules/summary/ModuleSummary.vue`、`frontend/src/modules/registry.ts`（挂上真实正文）、`frontend/tests/component/modules.spec.ts`
- **依赖**：T-08、T-18　**预计**：2 h
- **完成标准**：
  1. 关注列表：数值等宽右对齐、千分位，涨跌只涂字色；迷你折线墨线 + 末点（AC-004-5，数据表部分）
  2. 数据发布日历：按日期、时间升序的日程列表，含来源与新鲜度点（AC-004-5，日程部分）
  3. 四个占位模块渲染模块壳 + 示例占位与"内容随 domain feature 交付"说明（AC-004-3，占位模块部分）
  4. 关注列表的涨跌按红涨绿跌取色（引入 `updown.css`），引入位置在 updown-scope 登记范围内（AC-001-5，关注列表部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-5 watchlist"`
  2. `pnpm -C frontend test:unit -t "AC-004-5 calendar"`
  3. `pnpm -C frontend test:unit -t "AC-004-3 summary"`
  4. `pnpm -C frontend test:unit -t "AC-001-5 watchlist" && pnpm -C frontend guards updown-scope`

### T-24 图表暗色主题与样例图

- **上下文**：plan §2.6（主题由令牌生成、`registerTheme('fai-dark')`、market-board 头部样例折线、mock 模式测试钩子、theme-contrast 对最不利卡面）；Q-003 已确认 A 等亮。
- **修改范围**：`frontend/src/design/theme.ts`、`frontend/src/modules/market-board/{SampleChart.vue,MarketBoard.vue}`（在盘面卡头部接入样例图）、`frontend/scripts/guards/theme-contrast.mjs`（子检查 `retired` / `contrast`）+ `fixtures/theme-contrast/`、`frontend/e2e/theme.spec.ts`
- **依赖**：T-06、T-19、T-22、T-23（页面、市场模块组件与注册表挂载齐备后才有已渲染的图可断言）　**预计**：1.5 h
- **完成标准**：
  1. 主题对象与令牌一致，不含退役色（AC-006-1）
  2. 在最不利卡面 `#252629` 上：序列 / 类目色 ≥ 3、文字用色 ≥ 4.5、点睛红 ≥ 3，中性退后色豁免并登记（AC-006-2）
  3. 样例图实例的序列色与令牌一致（AC-006-3）
  4. 画布背景透明（AC-006-4，自动部分）
- **验证命令**：
  1. `pnpm -C frontend tokens:check && pnpm -C frontend guards theme-contrast:retired`
  2. `pnpm -C frontend guards theme-contrast:contrast`
  3. `pnpm -C frontend test:e2e -g "AC-006-3"`
  4. `pnpm -C frontend test:e2e -g "AC-006-4"`

### T-25 对话输入栏与抽屉

- **上下文**：plan §2.5（AgentDock 运行中指示、AgentDrawer 三态持久化、应用级订阅）、§4 流程 3。
- **修改范围**：`frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue}`、`frontend/src/stores/ui.ts`（drawer：closed / half / tall，key `fai.v1.ui.drawer`）、`frontend/src/main.ts`（订阅 `agentClient`）、`frontend/src/app/AppShell.vue`、`frontend/e2e/agent.spec.ts`
- **依赖**：T-13、T-15　**预计**：1.5 h
- **完成标准**：
  1. 输入栏在全部八个路由可见；提交后抽屉展开并显示用户消息（AC-005-1）
  2. 抽屉 closed / half / tall 可切换并刷新后保持；运行中输入栏显示运行中指示、终态后消失（AC-005-7）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-005-1"`
  2. `pnpm -C frontend test:e2e -g "AC-005-7"`

### T-26 CoT 时间线与终态呈现

- **上下文**：plan §2.5（步骤类型含 step.error、增量合并与 `done` 替换、按 stepId 去重、终态唯一）。
- **修改范围**：`frontend/src/agent/CotTimeline.vue`、`frontend/src/agent/store.ts`、`frontend/tests/component/timeline.spec.ts`
- **依赖**：T-25　**预计**：1.5 h
- **完成标准**：
  1. 回放 success / failure / retry / abort 脚本：步骤数正确、每步可展开 / 收起详情、失败尝试显示为 step.error、终态（完成 / 失败 / 中止）恰好一行（AC-005-2）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-005-2"`

### T-27 模块角标、引导跳转（含已移除模块）与后台运行

- **上下文**：plan §2.5（badgesStore、`hint.navigate` 四种情况、Toast、`data-highlight`、订阅在应用级）；Q-020。
- **修改范围**：`frontend/src/stores/{badges.ts,toast.ts}`、`frontend/src/shared/components/Toast.vue`（`.glass-drawer`）、`frontend/src/modules/ModuleShell.vue`（`data-ai`、`data-highlight`）、`frontend/src/agent/CotTimeline.vue`（跳转入口）、`frontend/e2e/agent.spec.ts`
- **依赖**：T-19、T-26　**预计**：2 h
- **完成标准**：
  1. long 脚本运行中切到其他页面再返回、收起抽屉再展开，两种情况下时间线都包含期间产生的步骤，同一 runId、无重复步骤（AC-005-3）
  2. 带 moduleId 的事件使模块角标 running → done，用户点击模块后清除（AC-005-4）
  3. 引导跳转：目标在布局 → 导航并高亮；已移除 → Toast + "添加回工作台"、布局不变，点击后加回并高亮；不存在 → Toast 且地址不变（AC-005-5）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-005-3"`
  2. `pnpm -C frontend test:e2e -g "AC-005-4"`
  3. `pnpm -C frontend test:e2e -g "AC-005-5"`

### T-28 mock 场景端到端与行情语义运行时检查

- **上下文**：plan §2.7（场景 normal / empty / error / slow，URL `?scenario=` 覆盖）、§2.1 涨跌色第 4 道防线的运行时部分。
- **修改范围**：`frontend/e2e/scenarios.spec.ts`、`frontend/e2e/semantics.spec.ts`
- **依赖**：T-16、T-17、T-20、T-22、T-23、T-25　**预计**：1.5 h
- **完成标准**：
  1. 四个场景各一用例：normal 正常渲染、empty 空态、error 工作台可达且模块显示错误态、slow 先见加载态后就绪（AC-007-2，端到端部分）
  2. error 场景下模块错误态的诊断信息可见可复制；同一场景下焦点带显示错误态（AC-004-4，端到端部分）
  3. 页面上每个 `.sem-market` 元素都在登记容器内，且计算后的背景色不是涨跌色（AC-001-5，运行时部分）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-007-2"`
  2. `pnpm -C frontend test:e2e -g "AC-004-4"`
  3. `pnpm -C frontend test:e2e -g "AC-001-5"`

### T-29 一条命令全绿、AC 覆盖守卫、人工验收清单与前端 README

- **上下文**：plan §2.8（`pnpm test` 串联顺序、ac-coverage 守卫）、§5（AC-009-1 / AC-009-2）；docs/plan.md §5（代码目录配 README：职责 / 入口 / 验证）。
- **修改范围**：`frontend/package.json`（`test` = `tokens:check` → `guards` → `typecheck` → `lint` → `test:unit` → `test:e2e`）、`frontend/scripts/guards/ac-coverage.mjs` + fixtures、`specs/frontend-workbench/manual-acceptance.md`（M-01~M-08，每项写"看什么"，覆盖 AC-001-3 / AC-003-5 / AC-004-5 / AC-006-4 的人工部分）、`frontend/README.md`、`frontend/tests/unit/manual-acceptance.spec.ts`
- **依赖**：T-01 ~ T-28　**预计**：2 h
- **完成标准**：
  1. `pnpm -C frontend test` 一条命令跑完全部自动化检查并全绿（AC-009-1）
  2. spec 的 45 条 AC 每条至少有一个以其编号开头的测试或守卫声明（AC-009-1，覆盖证据）
  3. 人工验收清单 M-01~M-08 齐备，每项有"看什么"描述；截图在 Handoff 附（AC-009-2）
- **验证命令**：
  1. `pnpm -C frontend test`（退出码 0）
  2. `pnpm -C frontend guards ac-coverage`
  3. `pnpm -C frontend test:unit -t "AC-009-2"`

### T-30 docs 指针同步

- **上下文**：spec R-008（designUI.md 的细则引用指向移植条目）、§4 文件边界（Q-022）；plan §2.9。
- **修改范围**：`docs/designUI.md` §2.3 / §6 / §8 中"随 design/ 移植"一类字样改为指向 `design/ui/*.md`、`design/charts/*.md` 的具体条目；核对 `design/ui/README.md`、`design/charts/README.md` 索引
- **依赖**：T-03、T-04、T-05　**预计**：0.5 h
- **完成标准**：
  1. designUI.md 的移植引用指向已移植条目，引用路径全部存在（AC-008-1，索引与引用部分）
- **验证命令**：
  1. `pnpm -C frontend guards design-registry:docs`

## AC 覆盖矩阵

| AC | 任务 |
|---|---|
| AC-001-1 | T-06、T-21 |
| AC-001-2 | T-07 |
| AC-001-3 | T-08（静态）、T-10、T-29（人工 M-01） |
| AC-001-4 | T-10、T-21 |
| AC-001-5 | T-08（静态）、T-10、T-12、T-22、T-23、T-28 |
| AC-001-6 | T-07 |
| AC-002-1 | T-16 |
| AC-002-2 | T-15 |
| AC-002-3 | T-17 |
| AC-002-4 | T-17 |
| AC-002-5 | T-15 |
| AC-002-6 | T-21 |
| AC-002-7 | T-16 |
| AC-003-1 ~ AC-003-6 | T-20（AC-003-5 另有人工 M-03） |
| AC-004-1 | T-19 |
| AC-004-2 | T-19 |
| AC-004-3 | T-18（组件）、T-19（页面）、T-23（占位模块） |
| AC-004-4 | T-18（组件）、T-28（端到端） |
| AC-004-5 | T-22、T-23、T-29（人工 M-04） |
| AC-004-6 | T-08 |
| AC-005-1 | T-25 |
| AC-005-2 | T-26 |
| AC-005-3 | T-13（脚本入口）、T-27 |
| AC-005-4 | T-27 |
| AC-005-5 | T-27 |
| AC-005-6 | T-11、T-13、T-14 |
| AC-005-7 | T-25 |
| AC-006-1 ~ AC-006-3 | T-24 |
| AC-006-4 | T-24、T-29（人工 M-08） |
| AC-007-1 | T-09、T-12 |
| AC-007-2 | T-12（单元）、T-28（端到端） |
| AC-007-3 | T-11、T-14 |
| AC-007-4 | T-11、T-12 |
| AC-008-1 | T-02、T-03、T-04、T-05、T-30 |
| AC-008-2 | T-02、T-06 |
| AC-008-3 | T-02、T-04 |
| AC-009-1 | T-01（打底）、T-29 |
| AC-009-2 | T-29 |

合计 30 个任务，预计约 47 小时。
