# Feature: frontend-workbench 任务清单（tasks.md）

> Tasks 阶段产物；每项 0.5–2 小时。**状态：草案（2026-10-28 精简版）—— Checklist 通过后生效。**
> 依据：`spec.md`（Gate 1 批准冻结，45 条 AC）+ `plan.md`（精简版）。
> 按 AGENTS.md §5 去掉了守卫样例自检、逐锚盘点、跨字段校验与单次使用的抽象层；15 个任务，约 25.5 小时。

## 约定

- 命令在 worktree 根执行：`pnpm -C frontend …`
- 测试标题以所验证的 AC 编号开头，验证命令用 `-t`（Vitest）/ `-g`（Playwright）按编号选取
- `pnpm -C frontend check` 跑 `scripts/check.mjs` 六项仓库检查（plan §2.8）
- 每完成一个任务提交一次，信息以任务号开头

## 任务

### T-01 脚手架与依赖冒烟

- **上下文**：确认 Vue 3.5 + Vite 8 + TS + Vitest + Playwright 在本机（Node 25）可用；后续任务的前提。
- **修改范围**：`frontend/` 下 `package.json`（`engines.node ≥ 22.12`，scripts：`dev/build/preview/typecheck/lint/test:unit/test:e2e/tokens/tokens:check/contract/check/test`）、`pnpm-lock.yaml`、`vite.config.ts`、`tsconfig.json`、`vitest.config.ts`、`playwright.config.ts`（本机 Chrome）、`eslint.config.js`、`.prettierrc`（lf）、`.gitattributes`（lf）、`index.html`、`src/main.ts`、`src/App.vue`、`tests/unit/smoke.spec.ts`、`e2e/smoke.spec.ts`；根 `.gitignore` 追加五行
- **依赖**：无　**预计**：1.5 h
- **完成标准**：
  1. 依赖按 lockfile 可复现安装（AC-009-1 打底）
  2. 构建 / 类型 / lint 通过；vue-tsc 与 TS 7 不兼容则锁 5.9.x 并回写 plan §1（AC-009-1 打底）
  3. 单元与端到端冒烟通过，Playwright 用本机 Chrome（AC-009-1 打底）
- **验证命令**：
  1. `pnpm -C frontend install --frozen-lockfile`
  2. `pnpm -C frontend build && pnpm -C frontend typecheck && pnpm -C frontend lint`
  3. `pnpm -C frontend test:unit -t "SMOKE" && pnpm -C frontend test:e2e -g "SMOKE"`

### T-02 令牌源与生成器

- **上下文**：plan §2.1（令牌分组、三层玻璃、Q-003 配色、字体与字号、断点）；代码只经令牌取值（AGENTS §5.5）。
- **修改范围**：`src/design/tokens.json`、`scripts/tokens-build.mjs`、`src/design/generated/{tokens.css,tokens.ts,echarts-theme.json,critical.css}`、`index.html` 首帧标记块、`package.json` 的 `tokens` / `tokens:check`
- **依赖**：T-01　**预计**：2 h
- **完成标准**：
  1. 生成物与令牌逐字一致，可重复生成（AC-001-1，静态部分）
  2. 令牌 `source` 指向 `design/ui/*`、`PALETTE_DARK` 或 `designUI.md` 的既有锚（AC-008-2 的数据前提）
- **验证命令**：
  1. `pnpm -C frontend tokens:check`
  2. `pnpm -C frontend tokens:check && git status --short src/design/generated`

### T-03 仓库检查脚本

- **上下文**：plan §2.8（六项检查合成一个 `scripts/check.mjs`，直接扫真实仓库，不写样例自检）。
- **修改范围**：`scripts/check.mjs`、`package.json` 的 `check` 脚本
- **依赖**：T-02　**预计**：1.5 h
- **完成标准**：
  1. `generated` / `colors` / `glass` / `updown` / `grid` / `network` 六项可单独与整体运行，非零退出表示违规（AC-001-2、AC-001-3、AC-001-5、AC-001-6、AC-004-6、AC-007-1）
- **验证命令**：
  1. `pnpm -C frontend check`

### T-04 基础样式与数值

- **上下文**：plan §2.1（字体三族、KPI 例外、`.num`、`format.ts`、`updown.css` 只写 color）。
- **修改范围**：`src/design/{base.css,glass.css,updown.css}`、`src/shared/{num.css,format.ts}`、`src/shared/components/{Num.vue,Kpi.vue}`、`tests/unit/format.spec.ts`、`tests/component/typography.spec.ts`
- **依赖**：T-03　**预计**：1.5 h
- **完成标准**：
  1. `fmtValue` / `fmtDelta`：空值 `–`、差值正号、按显示位取整后判零、零中性、无负零、pct 为百分数值（AC-001-4，格式化部分）
  2. KPI 大数衬线、模块壳标题与正文无衬线、数值等宽 + tabular + 右对齐（AC-001-4，字族部分）
  3. `Num` 只输出语义类；market 的颜色规则只在 `updown.css`（AC-001-5，组件部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-001-4 format"`
  2. `pnpm -C frontend test:unit -t "AC-001-4 typography"`
  3. `pnpm -C frontend test:unit -t "AC-001-5 num" && pnpm -C frontend check --only updown`

### T-05 规范资产移植

- **上下文**：plan §2.9；spec R-008。令牌 `source` 与后端 `api` feature 都要引用这些条目。
- **修改范围**：`design/ui/` 八份条目 + `UI_DARK_ADDITIONS.md` + `README.md`；`design/charts/PALETTE_CORE.md`（原件）、`PALETTE_DARK.md`（暗色值表 + 方法 + 对比度）、`README.md`
- **依赖**：T-02　**预计**：1.5 h
- **完成标准**：
  1. 每份保留原 `id`，front matter 含 `source / source_verified / migrated / adaptation`，末尾有 `## 暗色适配` 段（AC-008-1）
  2. `PALETTE_DARK.md` 列出 16 个 palette-core 原色的暗色值与对比度（AC-008-3）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-008-1 registry"`
  2. `pnpm -C frontend test:unit -t "AC-008-3 palette"`

### T-06 契约类型、方法语义与事件

- **上下文**：plan §2.5（10 种事件、唯一终态）、§2.7（DataClient、三种数值形态、参数语义）。
- **修改范围**：`src/contracts/{types.ts,client.ts,methods.ts}`、`src/agent/events.ts`、`tests/unit/contracts.spec.ts`
- **依赖**：T-01　**预计**：1.5 h
- **完成标准**：
  1. 数值只取 `Figure` / `BoardCell` / `SparkSeries`；缺元数据或 `ok` 缺 figure 的反例被拒（AC-007-4，类型部分）
  2. 十种事件可校验，终态唯一约束有断言（AC-005-6，类型部分）
  3. 每个方法在语义表有条目、每个字段有描述（AC-007-3 的数据前提）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-007-4 types"`
  2. `pnpm -C frontend test:unit -t "AC-005-6 types"`
  3. `pnpm -C frontend test:unit -t "AC-007-3 methods"`

### T-07 mock、real 桩与契约文档

- **上下文**：plan §2.7（五种场景、`window.__FAI_MOCK__`、real 桩、CONTRACT.md 由 schema 生成）。
- **修改范围**：`src/contracts/mock/fixtures/*.json`、`src/contracts/mock/{index.ts,agent/*.ts}`、`src/contracts/real/index.ts`、`src/contracts/index.ts`、`scripts/contract-build.mjs`、`contracts/{CONTRACT.md,schema.json}`、`tests/unit/mock.spec.ts`、`tests/unit/contract-doc.spec.ts`
- **依赖**：T-06　**预计**：2 h
- **完成标准**：
  1. fixtures 全部通过 schema；关注列表为合约价格（AC-007-4，数据部分）
  2. 五种场景按 plan 行为可切换（error 下 `bootstrap` 与目录成功、模块数据报错）（AC-007-2，单元部分）
  3. 五份 agent 脚本每份恰好一个终态（AC-005-6，脚本部分）
  4. CONTRACT.md 覆盖全部方法与十种事件（AC-007-3）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-007-4 fixtures"`
  2. `pnpm -C frontend test:unit -t "AC-007-2"`
  3. `pnpm -C frontend test:unit -t "AC-005-6 scripts"`
  4. `pnpm -C frontend contract && pnpm -C frontend test:unit -t "AC-007-3 doc"`

### T-08 外壳、加载页与顶栏

- **上下文**：plan §2.2（路由与八项菜单、占位页、侧栏折叠、启动与深链、失败重试、顶栏）。工作台页骨架在此建立，供后续任务接入。
- **修改范围**：`src/app/{router.ts,nav.ts,AppShell.vue,Rail.vue,TopBar.vue,LoadingScreen.vue}`、`src/pages/PlaceholderPage.vue`、`src/workbench/WorkbenchPage.vue`（骨架：焦点带占位 + 模块区容器）、`src/stores/{app.ts,ui.ts}`、`src/main.ts`、`e2e/shell.spec.ts`
- **依赖**：T-04、T-07　**预计**：2 h
- **完成标准**：
  1. 八项菜单固定顺序、当前项 `aria-current`、占位页注明归属 feature、直接打开非工作台地址刷新仍停留（AC-002-2）
  2. 首帧骨架可见 → 就绪进入工作台页；`boot-error` 显示原因并可重试（AC-002-1、AC-002-7）
  3. 侧栏折叠持久化（AC-002-5）
  4. 顶栏 ticker 与状态点渲染 mock，状态类取令牌（AC-002-4）
  5. 专题研究子项由研究列表驱动，注入一项后菜单多一项（AC-002-3）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-2"`
  2. `pnpm -C frontend test:e2e -g "AC-002-1" && pnpm -C frontend test:e2e -g "AC-002-7"`
  3. `pnpm -C frontend test:e2e -g "AC-002-5"`
  4. `pnpm -C frontend test:unit -t "AC-002-4"`
  5. `pnpm -C frontend test:e2e -g "AC-002-3"`

### T-09 模块壳、栅格、布局与模块库

- **上下文**：plan §2.4（目录经契约、注册表、栅格、layoutStore、模块库、模块壳契约）。
- **修改范围**：`src/modules/{registry.ts,ModuleShell.vue}`、`src/workbench/{ModuleGrid.vue,ModuleLibrary.vue,WorkbenchPage.vue}`、`src/stores/layout.ts`、`src/shared/components/{Badge,EmptyState,ErrorState,Loading}.vue`、`tests/component/module-shell.spec.ts`、`e2e/modules.spec.ts`
- **依赖**：T-08　**预计**：2 h
- **完成标准**：
  1. 模块壳 DOM 契约逐模块成立（AC-004-3，组件部分）
  2. 三态可触发、错误态诊断含 moduleId 与错误码且可复制（AC-004-4，组件部分）
  3. 默认七个且按目录顺序；模块库列出七项带状态与 `description`；`grid-column` 取 `min(defaultSpan, 列数)`（AC-004-1）
  4. 增删移后刷新保持（AC-004-2）
  5. 工作台页面遍历每个模块符合契约（AC-004-3，页面部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-3 shell"`
  2. `pnpm -C frontend test:unit -t "AC-004-4"`
  3. `pnpm -C frontend test:e2e -g "AC-004-1"`
  4. `pnpm -C frontend test:e2e -g "AC-004-2"`
  5. `pnpm -C frontend test:e2e -g "AC-004-3 page"`

### T-10 今日焦点带

- **上下文**：plan §2.3（两段、固定、空 / 错态、跳转）；D-013。
- **修改范围**：`src/workbench/{FocusBand.vue,WorkbenchPage.vue}`、`tests/component/focus-band.spec.ts`、`e2e/workbench.spec.ts`
- **依赖**：T-09　**预计**：1.5 h
- **完成标准**：
  1. 渲染 mock 摘要：结论数、数字、方向色（AC-003-1）
  2. market 只在行情段、analysis 只在指标段，涨跌色只在行情段（AC-003-4、AC-003-5）
  3. 空态文案 = 契约 reason（AC-003-3）；点击 → `/daily/<date>`（AC-003-2）
  4. 焦点带不出现在模块库、无移除钮，增删模块后仍在（AC-003-6）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-003-1"`
  2. `pnpm -C frontend test:unit -t "AC-003-4" && pnpm -C frontend test:unit -t "AC-003-5"`
  3. `pnpm -C frontend test:unit -t "AC-003-3" && pnpm -C frontend test:e2e -g "AC-003-2"`
  4. `pnpm -C frontend test:e2e -g "AC-003-6"`

### T-11 三个代表模块与四个占位模块

- **上下文**：plan §2.4 模块表；三个完整 mock（盘面 / 关注 / 日历）+ 四个壳模块。
- **修改范围**：`src/modules/market-board/MarketBoard.vue`、`src/modules/watchlist/Watchlist.vue`、`src/modules/release-calendar/ReleaseCalendar.vue`、`src/modules/summary/ModuleSummary.vue`、`src/shared/components/{DataTable,BoardGrid,Spark}.vue`、`src/modules/registry.ts`、`tests/component/modules.spec.ts`
- **依赖**：T-09　**预计**：2 h
- **完成标准**：
  1. 盘面四态格 `休 / 待 / –` 与数值分工，数值等宽右对齐，红涨绿跌（AC-004-5，盘面部分）
  2. 关注列表数值对齐与千分位、涨跌只涂字色，`Spark` 输入为 `SparkSeries`（AC-004-5，数据表部分）
  3. 日程按日期时间升序（AC-004-5，日程部分）
  4. 四个壳模块显示占位与"内容随 domain feature 交付"（AC-004-3，占位部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-5 board"`
  2. `pnpm -C frontend test:unit -t "AC-004-5 watchlist"`
  3. `pnpm -C frontend test:unit -t "AC-004-5 calendar"`
  4. `pnpm -C frontend test:unit -t "AC-004-3 summary"`

### T-12 图表暗色主题与样例图

- **上下文**：plan §2.6（主题由令牌生成、`fai-dark`、样例折线、测试钩子）。
- **修改范围**：`src/design/theme.ts`、`src/modules/market-board/{SampleChart.vue,MarketBoard.vue}`、`tests/unit/theme.spec.ts`、`e2e/theme.spec.ts`
- **依赖**：T-11　**预计**：1.5 h
- **完成标准**：
  1. 主题与令牌一致、不含退役色（AC-006-1）
  2. 序列 / 类目色对卡面 ≥ 3、文字用色 ≥ 4.5，中性退后色豁免登记（AC-006-2）
  3. 样例图实例颜色与令牌一致（AC-006-3）、背景透明（AC-006-4，自动部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-006-1"`
  2. `pnpm -C frontend test:unit -t "AC-006-2"`
  3. `pnpm -C frontend test:e2e -g "AC-006-3" && pnpm -C frontend test:e2e -g "AC-006-4"`

### T-13 对话输入栏、抽屉与时间线

- **上下文**：plan §2.5（Dock、Drawer 三态、CotTimeline、应用级订阅、角标、引导跳转）。
- **修改范围**：`src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}`、`src/stores/{ui.ts,badges.ts}`、`src/modules/ModuleShell.vue`、`src/main.ts`、`tests/component/timeline.spec.ts`、`e2e/agent.spec.ts`
- **依赖**：T-09、T-07　**预计**：2 h
- **完成标准**：
  1. 八路由输入栏可见、提交后抽屉展开显示用户消息（AC-005-1）
  2. 抽屉三态切换 + reload 保持；运行中指示出现、终态消失（AC-005-7）
  3. 回放 success / failure / retry / abort：步骤可展开、`step.error` 呈现、唯一终态行（AC-005-2）
  4. `long` 脚本下切页与收抽屉都不中断，同一 run、无重复步骤（AC-005-3）
  5. 角标 running → done → 点击后清除（AC-005-4）；跳转三种情形按 plan 走（AC-005-5）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-005-1"`
  2. `pnpm -C frontend test:e2e -g "AC-005-7"`
  3. `pnpm -C frontend test:unit -t "AC-005-2"`
  4. `pnpm -C frontend test:e2e -g "AC-005-3"`
  5. `pnpm -C frontend test:e2e -g "AC-005-4" && pnpm -C frontend test:e2e -g "AC-005-5"`

### T-14 断点、运行时样式与场景端到端

- **上下文**：plan §2.2 断点表、§2.1 运行时令牌与字体、§2.7 场景。
- **修改范围**：`src/stores/ui.ts`（viewport）、`src/app/{AppShell.vue,Rail.vue}`、`src/workbench/{ModuleGrid.vue,FocusBand.vue}`、`e2e/{breakpoints.spec.ts,tokens.spec.ts,scenarios.spec.ts}`
- **依赖**：T-10、T-11、T-13　**预计**：2 h
- **完成标准**：
  1. 十个视口下侧栏形态、栅格列数、焦点带卡数符合断点表，无横向溢出（AC-002-6）
  2. 浏览器内逐令牌对拍、计算字体族正确（AC-001-1 运行时部分、AC-001-4 运行时部分）
  3. `.sem-market` 只在登记容器内且背景非涨跌色（AC-001-5 运行时部分）
  4. 四场景端到端：normal / empty / error / slow（AC-007-2 端到端部分）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-6"`
  2. `pnpm -C frontend test:e2e -g "AC-001-1"`
  3. `pnpm -C frontend test:e2e -g "AC-001-5"`
  4. `pnpm -C frontend test:e2e -g "AC-007-2"`

### T-15 一条命令、人工验收清单与文档指针

- **上下文**：plan §2.8（`pnpm test` 串联）、spec R-009、docs/plan.md §5（目录 README）。
- **修改范围**：`frontend/package.json` 的 `test` 脚本、`specs/frontend-workbench/manual-acceptance.md`（M-01 ~ M-08）、`frontend/README.md`、`docs/designUI.md`（§2.3 / §6 / §8 指向已移植条目）、`tests/unit/manual-acceptance.spec.ts`
- **依赖**：T-01 ~ T-14　**预计**：1 h
- **完成标准**：
  1. `pnpm test` 一条命令全绿（AC-009-1）
  2. 人工清单八项各写"看什么"，含 M-01 层次、M-03 两段、M-04 模块形态、M-08 图表主题（AC-009-2）
  3. designUI 的移植引用指向真实条目（AC-008-1，引用部分）
- **验证命令**：
  1. `pnpm -C frontend test`
  2. `pnpm -C frontend test:unit -t "AC-009-2"`
  3. `pnpm -C frontend test:unit -t "AC-008-1 docs"`

## AC 覆盖

| AC | 任务 |
|---|---|
| AC-001-1 | T-02、T-14 |
| AC-001-2、AC-001-6 | T-03 |
| AC-001-3 | T-03；人工 M-01（T-15） |
| AC-001-4 | T-04、T-14 |
| AC-001-5 | T-03、T-04、T-11、T-14 |
| AC-002-1、AC-002-7 | T-08 |
| AC-002-2 ~ AC-002-5 | T-08 |
| AC-002-6 | T-14 |
| AC-003-1 ~ AC-003-6 | T-10 |
| AC-004-1、AC-004-2 | T-09 |
| AC-004-3 | T-09、T-11 |
| AC-004-4 | T-09、T-14 |
| AC-004-5 | T-11；人工 M-04（T-15） |
| AC-004-6 | T-03 |
| AC-005-1 ~ AC-005-5、AC-005-7 | T-13 |
| AC-005-6 | T-06、T-07 |
| AC-006-1 ~ AC-006-4 | T-12 |
| AC-007-1 | T-03 |
| AC-007-2 | T-07、T-14 |
| AC-007-3 | T-06、T-07 |
| AC-007-4 | T-06、T-07 |
| AC-008-1 | T-05、T-15 |
| AC-008-2 | T-02 |
| AC-008-3 | T-05 |
| AC-009-1 | T-01、T-15 |
| AC-009-2 | T-15 |

合计 15 个任务，预计约 25.5 小时。
