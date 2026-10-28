# Feature: frontend-workbench 任务清单（tasks.md）

> Tasks 阶段产物；每项 0.5–2 小时。**状态：已生效（Checklist 第四轮基线 `2c2fbc8`，70/70）；T-01 ~ T-17 已实施，独立 A 第二轮 Review 通过；Gate 2 已批准（Walter 2026-10-28 回复“确认”：接受 11 项 P3 为后续任务，未修复）；进入 Handoff。**
> 依据：`spec.md`（Gate 1 批准冻结，45 条 AC）+ `plan.md`（精简版）。
> 按 AGENTS.md §5 去掉了守卫样例自检（AC-001-2 明文要求的 `colors` 最小样例除外）、逐锚盘点、跨字段校验与单次使用的抽象层；15 个任务，约 25.5 小时。
> **2026-10-28 恢复（H-01）**：Tasks = claude-opus-5-5 via anthropic（claude-bridge 探活额度耗尽）。追加 T-18（H-01 图注内联数字最小样式修复，1 h），状态**已授权待修复、未实施**；H-02 留待 v2、未修复；11 项已接受 P3 不扩改；以上头部历史计数保留不改（R2-01 仍为已接受的后续项）。
> **2026-10-28 Converge（H-01）**：上行“未实施”为规划时点记录。T-18 已实施（代码 `771f2af`，截图 `f4ff7be`），Converge = claude-opus-5-5 via anthropic 判定 H-01 修复的实现与自动化验证范围已收敛（converge §9）；待独立 A Review，本次修复 Gate 2 未批准；H-02 留待 v2、未修复；M-01 ~ M-08 仍待 Walter 人工复核。

## 约定

- 命令在 worktree 根执行：`pnpm -C frontend …`
- 测试标题以所验证的 AC 编号开头，验证命令用 `-t`（Vitest）/ `-g`（Playwright）按编号选取
- `pnpm -C frontend check [--only <name>]` 跑 `scripts/check.mjs` 六项仓库检查（generated / colors / glass / updown / grid / network）
- **文件边界**：只动 `frontend/`、`design/`、`specs/frontend-workbench/`、根 `.gitignore`（追加）、`specs/README.md`（本 feature 一行）、`docs/designUI.md`（引用指针）；不碰 `backend/`
- 每完成一个任务提交一次，信息以任务号开头

## 任务

### T-01 脚手架与依赖冒烟

- **上下文**：确认 Vue 3.5 + Vite 8 + TS + Vitest + Playwright 在本机（Node 25）可用；后续任务的前提。
- **修改范围**：`frontend/` 下 `package.json`（`engines.node ≥ 22.12`，scripts：`dev/build/preview/typecheck/lint/test:unit/test:e2e/tokens/tokens:check/contract/check/test`）、`pnpm-lock.yaml`、`vite.config.ts`、`tsconfig.json`、`vitest.config.ts`、`playwright.config.ts`（本机 Chrome）、`eslint.config.js`、`.gitattributes`（`* text=auto eol=lf`）、`index.html`、`src/main.ts`、`src/App.vue`、`tests/unit/smoke.spec.ts`、`e2e/smoke.spec.ts`；根 `.gitignore` 追加四行（`node_modules/`、`frontend/test-results/`、`frontend/playwright-report/`、`frontend/coverage/`；`dist/` 根文件已有）
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
  2. 令牌 `source` 按 plan §2.1 的三种形式填写（`design/ui/*#锚`、`PALETTE_DARK#锚`、`designUI.md#节号`）；此时条目尚未建立，可解析性由 T-05 校验（AC-008-2 的数据前提）
- **验证命令**：
  1. `pnpm -C frontend tokens:check`
  2. `pnpm -C frontend tokens:check`（令牌 `source` 能否解析由 T-05 验证）

### T-03 仓库检查脚本

- **上下文**：plan §2.8（六项检查合成一个 `scripts/check.mjs`，直接扫真实仓库；仅 `colors` 按 AC-001-2 先跑最小样例）。
- **修改范围**：`scripts/check.mjs`、`scripts/check-samples/colors/{positive,negative}.css`、`package.json` 的 `check` 脚本
- **依赖**：T-02　**预计**：1.5 h
- **完成标准**：
  1. `generated` / `colors` / `glass` / `updown` / `grid` / `network` 六项可单独与整体运行，非零退出表示违规（AC-001-2、AC-001-3、AC-001-5、AC-001-6、AC-004-6、AC-007-1）
  2. `colors` 先核 `check-samples/colors/{positive,negative}.css`（阳性全部命中、阴性不中），再扫真实仓库（AC-001-2 的样例要求）
- **验证命令**：
  1. `pnpm -C frontend check`
  2. `pnpm -C frontend check --only colors`（该检查内部先核样例、再扫仓库）

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
- **修改范围**：`design/ui/` 八份条目 + `UI_DARK_ADDITIONS.md` + `README.md`；`design/charts/PALETTE_CORE.md`（原件）、`PALETTE_DARK.md`（暗色值表 + 方法 + 对比度）、`README.md`；`tests/unit/design-registry.spec.ts`
- **依赖**：T-02　**预计**：1.5 h
- **完成标准**：
  1. 每份保留原 `id`，front matter 含 `source / source_verified / migrated / adaptation`，末尾有 `## 暗色适配` 段（AC-008-1）
  2. `PALETTE_DARK.md` 列出 14 个 palette-core 原色（按不同 hex 计）的暗色值与对比度（AC-008-3）
  3. `tokens.json` 每个 `source` 可解析到本任务条目锚或 designUI 节号（AC-008-2）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-008-1 registry"`
  2. `pnpm -C frontend test:unit -t "AC-008-3 palette"`
  3. `pnpm -C frontend test:unit -t "AC-008-2 sources"`

### T-06 契约类型、方法语义与事件

- **上下文**：plan §2.5（10 种事件、唯一终态）、§2.7（DataClient、三种数值形态、参数语义）。
- **修改范围**：`src/contracts/{types.ts,client.ts,methods.ts}`、`src/agent/events.ts`、`tests/unit/contracts.spec.ts`
- **依赖**：T-01　**预计**：1.5 h
- **完成标准**：
  1. 数值只取 `Figure` / `BoardCell` / `SparkSeries`；缺元数据或 `ok` 缺 figure 的反例被拒（AC-007-4，类型部分）
  2. 十种事件可校验，终态唯一约束有断言（AC-005-6，类型部分）
  3. `DataClient`（10 个方法）与 `AgentClient`（`send` / `subscribe`）每个方法在语义表有条目、每个字段有描述（AC-007-3 的数据前提）
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
  3. 四份 agent 脚本（success / failure / retry / long）每份恰好一个终态（AC-005-6，脚本部分）
  4. CONTRACT.md 覆盖全部方法、错误形态 `{error:{code,message,retryable}}` 与十种事件（AC-007-3）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-007-4 fixtures"`
  2. `pnpm -C frontend test:unit -t "AC-007-2"`
  3. `pnpm -C frontend test:unit -t "AC-005-6 scripts"`
  4. `pnpm -C frontend contract && pnpm -C frontend check --only generated && pnpm -C frontend test:unit -t "AC-007-3 doc"`

### T-08 外壳、加载页与顶栏

- **上下文**：plan §2.2（路由与八项菜单、占位页、侧栏折叠、启动与深链、失败重试、顶栏）。工作台页骨架在此建立，供后续任务接入。
- **修改范围**：`src/app/{router.ts,nav.ts,AppShell.vue,Rail.vue,TopBar.vue,LoadingScreen.vue}`、`src/pages/PlaceholderPage.vue`、`src/workbench/WorkbenchPage.vue`（骨架：焦点带占位 + 模块区容器）、`src/stores/{app.ts,ui.ts}`、`src/main.ts`、`index.html`（静态骨架标记）、`tests/component/topbar.spec.ts`、`e2e/shell.spec.ts`
- **依赖**：T-04、T-07　**预计**：2 h
- **完成标准**：
  1. 八项菜单固定顺序、当前项 `aria-current`、占位页注明归属 feature、直接打开非工作台地址刷新仍停留（AC-002-2）
  2. 首帧骨架可见 → 就绪进入工作台页；加载页显示进度与 `notice` 通知文案；`boot-error` 显示原因并可重试，重试成功进入工作台（AC-002-1、AC-002-7）
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

- **上下文**：plan §2.3（两段、固定、空 / 错态、跳转）；D-015。
- **修改范围**：`src/workbench/{FocusBand.vue,WorkbenchPage.vue}`、`tests/component/focus-band.spec.ts`、`e2e/workbench.spec.ts`
- **依赖**：T-09　**预计**：1.5 h
- **完成标准**：
  1. 渲染 mock 摘要：结论条目（≤ 3 条，超出截断）、数字、方向色（AC-003-1）
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
  1. 盘面四态格 `休 / 待 / –` 与数值分工，数值等宽右对齐，红涨绿跌（AC-004-5 盘面部分；AC-001-5 引入位置部分）
  2. 关注列表数值对齐与千分位、涨跌只涂字色，`Spark` 输入为 `SparkSeries`（AC-004-5，数据表部分）
  3. 日程按日期时间升序（AC-004-5，日程部分）
  4. 四个壳模块显示占位与"内容随 domain feature 交付"（AC-004-3，占位部分）
  5. 关注列表与盘面的涨跌色经 `src/design/updown.css` 取色（AC-001-5，模块引入位置部分）
- **验证命令**：
  1. `pnpm -C frontend test:unit -t "AC-004-5 board"`
  2. `pnpm -C frontend test:unit -t "AC-004-5 watchlist"`
  3. `pnpm -C frontend test:unit -t "AC-004-5 calendar"`
  4. `pnpm -C frontend test:unit -t "AC-004-3 summary"`
  5. `pnpm -C frontend check --only updown`

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
  3. 回放 success / failure / retry：步骤可展开、`step.error` 呈现、唯一终态行（AC-005-2）
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
  4. 四场景端到端：normal / empty / error / slow；error 场景下模块错误态可达、诊断可复制（AC-007-2 端到端部分；AC-004-4 端到端部分）
- **验证命令**：
  1. `pnpm -C frontend test:e2e -g "AC-002-6"`
  2. `pnpm -C frontend test:e2e -g "AC-001-1"`
  3. `pnpm -C frontend test:e2e -g "AC-001-5"`
  4. `pnpm -C frontend test:e2e -g "AC-007-2" && pnpm -C frontend test:e2e -g "AC-004-4"`

### T-15 一条命令、人工验收清单与文档指针

- **上下文**：plan §2.8（`pnpm test` 串联）、spec R-009、docs/plan.md §5（目录 README）。
- **修改范围**：`frontend/package.json` 的 `test` 脚本、`specs/frontend-workbench/manual-acceptance.md`（M-01 ~ M-08）、`frontend/README.md`、`docs/designUI.md`（§2.3 / §6 / §8 指向已移植条目）、`tests/unit/manual-acceptance.spec.ts`、`tests/unit/design-registry.spec.ts`（在 T-05 已建的文件上追加 docs 指针断言）
- **依赖**：T-01 ~ T-14　**预计**：1 h
- **完成标准**：
  1. `pnpm test` 一条命令全绿（AC-009-1）
  2. 人工清单八项各写"看什么"：M-01 玻璃层次、M-02 字族与双语、M-03 焦点带两段、M-04 模块壳与形态、M-05 抽屉与时间线、M-06 窄窗口、M-07 ticker、M-08 图表主题（AC-009-2）
  3. designUI 的移植引用指向真实条目（AC-008-1，引用部分）
- **验证命令**：
  1. `pnpm -C frontend test`
  2. `pnpm -C frontend test:unit -t "AC-009-2"`
  3. `pnpm -C frontend test:unit -t "AC-008-1 docs"`

## 原任务实施记录（2026-10-28 补录）

原任务均已实施；下列提交可由 `git show <commit>` 查验修改范围，完整自动化证据见 review.md §1（538 单元 / 组件 + 65 e2e）；这不是人工视觉验收完成记录。

| 任务 | 实施提交 | 状态 |
|---|---|---|
| T-01 | `9d6204b` | 已实施；实际锁定 TS 5.9.2，T-17 已回写 plan §1 |
| T-02 | `0f885c9` | 已实施 |
| T-03 | `fcdc325` | 已实施 |
| T-04 | `8ee432c` | 已实施；变化量精度由 T-16 修正 |
| T-05 | `65b998f` | 已实施 |
| T-06 | `7b2cc70` | 已实施；变化量精度由 T-16 补全 |
| T-07 | `7ebd17b` | 已实施 |
| T-08 | `2a5785b` | 已实施 |
| T-09 | `5958e54` | 已实施 |
| T-10 | `96e348f` | 已实施；变化量精度由 T-16 修正 |
| T-11 | `32f9fb9` | 已实施；盘面变化量精度由 T-16 修正 |
| T-12 | `4ad46f1` | 已实施 |
| T-13 | `5fdba62` | 已实施 |
| T-14 | `6eeae3b` | 已实施 |
| T-15 | `0b819d4` | 已实施；人工清单存在；M-01 ~ M-08 已在 Handoff 由 AI 实际执行并附截图（见 manual-acceptance.md），人工勾选待 Walter 复核 |

## Review 整改任务（原 15 项之后追加，不变更冻结 spec）

### T-16 R1-01 变化量独立精度与回归

- **上下文**：review.md R1-01（P2）；plan §2.1 / §2.7 已登记精度解析机制；不改取整后判零规则，不扩大到其他 P3 或 v2。
- **修改范围**：`frontend/src/contracts/types.ts`、`frontend/src/shared/format.ts`、`frontend/src/shared/components/{Kpi,BoardGrid}.vue`；`frontend/tests/unit/{contracts,contract-doc}.spec.ts`、`frontend/tests/component/{typography,focus-band,modules}.spec.ts`、`frontend/e2e/workbench.spec.ts`；仅经 `pnpm contract` 更新 `frontend/contracts/{CONTRACT.md,schema.json}`。
- **依赖**：T-04、T-06、T-07、T-10、T-11　**预计**：1.5 h　**状态**：已完成（独立 A 第二轮确认 R1-01 闭环，见 review.md §7）
- **完成标准**：
  1. 契约接收可选非负整数 `deltaDecimals`（含 0），拒绝负数 / 小数 / 字符串 / null，旧 fixture 仍合法；文档与 schema 重生成一致（AC-007-3、AC-007-4）。
  2. KPI 与盘面共用精度解析：缺省 pct 两位、abs 沿用主值精度、显式精度优先；默认 LPG 显示 `-0.46%` 且为跌、FU 显示 `+0.60%`；主值精度不变；空值、按显示位为零与负零仍中性（AC-001-4、AC-003-1、AC-003-4、AC-004-5）。
  3. 浏览器验证默认百分比与显式精度（含 0）在宽 / 窄视口仍正确，旧断言不再固化 `0%` / `+1%` 的错误输出（AC-003-1、AC-003-4）。
- **验证命令**：
  1. `pnpm -C frontend contract && pnpm -C frontend check --only generated && pnpm -C frontend test:unit -t "AC-007-3|AC-007-4"`
  2. `pnpm -C frontend test:unit -t "AC-001-4|AC-001-5 num|AC-003-1|AC-003-4|AC-004-5 board"`
  3. `pnpm -C frontend test:e2e -g "AC-003-1|AC-003-5"`
- **实施证据**：修复前 `test:unit -t R1-01` 为 14 failed / 7 passed；修复后相关定向单元 / 组件 128 passed；全量 `pnpm test` 为 559 passed + 66 e2e passed，`pnpm build` exit 0。完整收敛记录由 T-17 写入 `converge.md`，此状态不是审核通过。

### T-17 R1-09 流程文档补齐与 Converge

- **上下文**：review.md R1-09（P3）与 AGENTS §2 第 9 步。只补齐完成证据、TS 锁定与收敛记录；其余 P3 登记为后续候选，不以“继续”代替 Gate 2 风险接受。
- **修改范围**：`specs/frontend-workbench/{plan,tasks,analyze,converge}.md`、`specs/README.md` 本 feature 行；审核员报告在 Review 复核后追加，不改写第一轮历史；不改 `spec.md` / `checklist.md` / `manual-acceptance.md` 的冻结需求或人工勾选。
- **依赖**：T-01 ~ T-16　**预计**：1 h　**状态**：已完成（独立 A 第二轮确认 R1-09 闭环，见 review.md §7）
- **完成标准**：
  1. plan 回写 TS 5.9.2、tasks 补原任务实施证据与逐项 P3 后续归属；Analyze 无剩余冲突 / 漏映射；无新增需求（AC-009-1 的验收证据、AC-007-3 的契约精度落点）。
  2. 一条命令全绿且生产构建通过，Converge 对全部 45 AC 给出实现 / 测试 / 人工待验的对应证据；自动化实现范围“已收敛”，不声称人工项已通过（AC-009-1、AC-009-2）。
  3. 原 M-01 ~ M-08 仍待人工验收，P3 未获风险接受；状态表如实进入待独立 Review 复核，Gate 2 未批准（AC-009-2）。
- **验证命令**：
  1. `git diff -- specs/frontend-workbench/plan.md specs/frontend-workbench/tasks.md`（核对版本、状态、精度机制与 P3 台账）；只读 Analyze 证据见 `analyze.md`。
  2. `pnpm -C frontend test && pnpm -C frontend build`
  3. `git diff --check && git diff -- specs/README.md specs/frontend-workbench/manual-acceptance.md`；对照 `converge.md` 的人工待验与 Gate 2 记录。
- **实施证据**：`analyze.md` 无剩余冲突；`converge.md` 覆盖 45 条 AC、结论为 v1 实现与自动验证范围“已收敛”；全量 559 单元 / 组件 + 66 e2e 与 build 全绿；原 spec / Checklist / 8 项人工清单 / v2 草稿不变。R1-09 的文档缺口已补，独立 A 第二轮已确认闭环（review.md §7）。

### P3 后续台账（Gate 2 已处置：Walter 2026-10-28 确认接受 11 项 P3 为后续任务；接受 ≠ 已修复，v1 未实施）

| 发现 | 当前处理 | 后续归属 / 进入条件 | 验收引用与后续验证 |
|---|---|---|---|
| R1-02 | 已接受为后续（用户 2026-10-28 确认），未修复 | `api` 接线前处理 real 桩的启动失败展示，不在本轮实现真实客户端 | AC-002-7、R-007；real 模式启动应见原因与重试，补 `AC-002-7 real` 测试 |
| R1-03 | 已接受为后续（用户 2026-10-28 确认），未修复、未扩加防御 | `agent-runtime` 明确重连 / 事件顺序契约后再设计；遵守 AGENTS §5.1，非本轮推测性加固 | AC-005-3；按真实入口注入事件序列，验证 run 连续且不崩溃 |
| R1-04 | 已接受为后续（用户 2026-10-28 确认），未修复 | `api` / 日历 domain feature 定义真实查询窗口时处理 | AC-004-5、R-007；契约窗口边界测试 + 日历 e2e |
| R1-05 | 已接受为后续（用户 2026-10-28 确认），未修复、未删预留字段 | 摘要 domain feature / `api` 确定 `figures` 消费前同步契约 | AC-007-3；契约文档对拍 + 摘要组件测试 |
| R1-06 | 已接受为后续（用户 2026-10-28 确认），未修复、未改时间显示 | `chart-templates` Formats 移植 / 真实 API 接线时统一时间展示 | AC-002-4、AC-004-5；含 UTC / 偏移的显示用例 |
| R1-07 | 已接受为后续（用户 2026-10-28 确认），未修复、未扩改选择器 | 单独守卫改进任务（需用户同意），不新增 D-015 登记位置 | AC-001-5；登记容器与非登记容器的浏览器字色测试 |
| R1-08 | 已接受为后续（用户 2026-10-28 确认），未修复、未删脚手架 | 后续清理真实根组件冒烟入口 | AC-009-1；`pnpm -C frontend test:unit -t SMOKE` + e2e SMOKE |
| R1-09 | T-17 补齐；独立 A 第二轮确认闭环（不属 11 项接受范围） | 原任务状态 / TS 版本 / Analyze / Converge；M-01 ~ M-08 截图在 Handoff 收集（见 manual-acceptance.md） | AC-009-1、AC-009-2；T-17 验证命令 |
| R1-10 | 已接受为后续（用户 2026-10-28 确认），未修复、未改 UX | 抽屉偏好与跳转 UX 专项，须先明确临时收起是否保留原档位 | AC-005-5、AC-005-7；导航后重开 / 刷新验证档位 |
| R1-11 | 已接受为后续（用户 2026-10-28 确认），未修复、未改卡片分配 | 日报 / 焦点带后续 spec 明确按段分配，再按 Gate 1 变更规则实施 | AC-002-6、AC-003-5；单一语义排序与紧凑断点测试 |
| R2-01 | 第二轮 P3；已接受为后续（用户 2026-10-28 确认），未修复 | 后续编辑性修订：限定头部“15 项 / 25.5 h”为原实施计数，或只保留末尾合计，避免与当前 17 项 / 28 h 混淆 | AC-009-1 的任务证据；核对 tasks 头尾计数 |
| R2-02 | 第二轮 P3；已接受为后续（用户 2026-10-28 确认），未修复、未加强 | 后续 e2e 强度改进：精度回归注入六个数字，明确宽窗六卡 / 窄窗四卡，或收窄标题承诺；现有精度断言有效 | AC-003-1、AC-002-6；`pnpm -C frontend test:e2e -g "AC-003-1"` |
| H-01 | Handoff 新发现（AI 视觉检查，2026-10-28，执行者初判 P3）；登记、未修复、**未经 Walter 处置**。→ 2026-10-28 恢复：用户回复“继续”，协调会话按其“H-01 做最小样式修复”的建议执行；**已授权待修复**，见 T-18（未实施；不属 11 项 P3，修复的 Gate 2 未批准）。→ 2026-10-28 实施后：**T-18 已实施**（`771f2af`），红→绿两档回归与全量 559 + 68 / build 通过，Converge 已收敛（实现与自动化验证范围，converge §9）；修复前后图注特写见 `assets/h01-fix-20261028/`（M-08 整图未重采，`m08-chart-1440.png` 仍为修复前原件）；**待独立 A Review、本次修复 Gate 2 未批准、M-08 人工未勾**。→ 2026-10-28 独立 A（claude-fable-5-1 via anthropic）对 `869cb71` 定向 Review **通过**（无 P1/P2；新增 P3-1 见下方 A-H01-P3-1），原件 [review-h01.md](review-h01.md)、review §12；**待 Walter Gate 2** | 样例图图注“近 60 日收盘 · 样例”断成三行：图注内数字用了 `span.num`，被全局 `span.num { display: block }` 渲染为独立块；后续由 Implement 修正图注内联数字的样式，不改令牌与 spec | AC-001-4、AC-006-3、M-08；证据 `assets/handoff/m08-chart-1440.png`；修复后重采 M-08 截图 + `pnpm -C frontend test` |
| H-02 | Handoff 新发现（AI 视觉检查，2026-10-28，执行者初判 P3）；登记、未修复、**未经 Walter 处置**。→ 2026-10-28 恢复：按同一建议“随 v2 导航统一处理”，**留待 v2、v1 未修复**；尚未写入 v2 规格，未转交、未完成，v2 仍需在其自身流程（Clarify / Gate 1）中承接 | 小于 980 的顶部横向导航中，专题研究子项纵向堆叠，导航区约 205 px；960 ~ 979×900 下模块区可视高度约 215 px，样例图不能一屏完整显示（可滚动、无重叠、无横向溢出）。与 UI_LAYOUT `#rail` 已采用的“塌成顶栏横向滚动”不一致；后续按该规定收紧窄窗导航（是否保留子项及其形态先请 Walter 裁定；v2 规格同样涉及导航，需协调） | AC-002-6、R-002、M-06；证据 `assets/handoff/m06-979.png`、`m06-960.png`；修复后补断点 e2e 对导航高度的断言并重采 M-06 |

## H-01 修复任务（2026-10-28 恢复，追加；不变更冻结 spec）

### T-18 H-01 样例图图注内联数字

- **上下文**：review.md §10、plan §7。用户回复“继续”，协调会话按其建议仅授权 H-01 最小样式修复。根因：`SampleChart.vue` 图注“近 <span class="num">60</span> 日收盘 · 样例”的数字命中全局 `span.num { display: block }`，标签被切成三行。只为既有 AC-001-4、AC-006-3 与 M-08 做实现样式纠偏；不改 spec / 令牌 / 契约 / 主题 / 全局数值样式 / 其他组件，不需要新 ADR 或 Gate 1。旧 e2e 只断言文字（文字本来正确），新回归必须测浏览器计算样式与 Range 几何。
- **修改范围**：生产代码只改 `frontend/src/modules/market-board/SampleChart.vue`（`<style scoped>` 增 `figcaption .num { display: inline; }` 或等价的单条局部规则）；浏览器回归只改 `frontend/e2e/theme.spec.ts`；新建 `specs/frontend-workbench/assets/h01-fix-20261028/`（4 张 PNG + `README.md`）；`tasks.md` 只更新本任务的状态与实施证据。不改 `frontend/src/shared/`、`frontend/src/design/`、`frontend/contracts/`、spec / checklist / manual-acceptance、`assets/handoff/` 的 60 张旧图。
- **依赖**：T-04（`num.css`）、T-12（`SampleChart.vue`、`e2e/theme.spec.ts`）　**预计**：1 h　**状态**：已实施、自动化通过（2026-10-28）；尚未 Converge / 独立 Review / 本次修复 Gate 2。→ Converge 已收敛（H-01 实现与自动化验证范围，converge §9；Converge = claude-opus-5-5 via anthropic）；尚未独立 Review / 本次修复 Gate 2。→ 独立 A Review 通过（`869cb71`，[review-h01.md](review-h01.md)；P3-1 待 Walter 裁定）；本次修复 Gate 2 未批准。
- **执行**：Implement 按 AGENTS §6（首选 `openai/gpt-6-astra`，回退 `deepseek/deepseek-flash`），在本分支 `fix/frontend-workbench-visual` 上做，基线 `43b6d79`；提交信息以 `T-18` 开头。
- **完成标准**：
  1. 回归先红：只加 plan §7.3 的 e2e（`T.window.width` / `T.window.min_width` × `T.window.height` 两档，各一个测试，标题以 `AC-001-4 AC-006-3 H-01` 开头，先截图后断言），在基线 `SampleChart.vue` 上两档都在“图注文字与数字同一行”的 Range 几何断言失败；记录失败摘要，复制两张修复前截图（AC-001-4、AC-006-3）。
  2. 最小修复后转绿：两档视口下图注“近 / 数字 / 日收盘 · 样例”各一个矩形、竖向区间有交集、水平顺序正确；数字计算字体首项为 `T.font.mono` 首项且含 `tabular-nums`；单位文本正确、宽高 > 0、在图注内且与标签同行不重叠（AC-001-4、AC-006-3）；页面与图注无横向溢出（AC-002-6 的无横向溢出条款，不涉及 H-02 导航高度）；图注以外的 `span.num`（至少含盘面、关注列表、焦点带）计算 `display` 仍为 `block`、等宽与 tabular 不变（AC-001-4）；既有 AC-006-3 / AC-006-4 / AC-001-4 浏览器用例仍通过。
  3. 全量自动化与构建全绿，无空白错误；不为 780 kB chunk 提示做拆包（AC-009-1）。
  4. 改动边界：`frontend/` 相对基线只改上述两个文件；全局数值样式、令牌、生成物、契约、冻结 spec、Checklist 与人工清单零改动（AC-001-4 全局部分；AC-009-2 人工证据不被覆盖）。
  5. 截图证据：`assets/h01-fix-20261028/` 含 `before-1440x900.png`、`before-960x900.png`、`after-1440x900.png`、`after-960x900.png`（宽窄均已滚动到位，仅内置 mock normal）与 `README.md`（基线与修复提交、视口来自 `T.window`、Chrome / Playwright 版本、数据、执行者模型；视觉判断由 AI 完成，不是 Walter 人工验收）；`assets/handoff/` 60 张旧图与 manual-acceptance.md 8 个未勾选框不变（M-08、AC-009-2）。
- **验证命令**：
  1. 修复前（基线 `SampleChart.vue` + 新测试）：`pnpm -C frontend test:e2e -g "H-01"` → 预期 exit 1，两档失败于同一行断言；随后把 `frontend/test-results/**/sample-chart-*.png` 复制为 `before-*`
  2. 修复后：`pnpm -C frontend test:e2e -g "H-01" && pnpm -C frontend test:e2e -g "AC-006-3|AC-006-4|AC-001-4"` → exit 0；随后复制 `after-*`
  3. `pnpm -C frontend test && pnpm -C frontend build && git diff --check`
  4. `git diff --name-only 43b6d79 -- frontend`（只列两文件）`&& git diff --exit-code 43b6d79 -- frontend/src/shared frontend/src/design frontend/contracts specs/frontend-workbench/spec.md specs/frontend-workbench/checklist.md`
  5. `git ls-files specs/frontend-workbench/assets/h01-fix-20261028`（4 张 PNG + README）`&& git diff --exit-code 43b6d79 -- specs/frontend-workbench/assets/handoff specs/frontend-workbench/manual-acceptance.md`
- **实施证据（2026-10-28）**：Implement = **openai/gpt-6-astra via openai**（环境 `PI_PROVIDER` / `PI_MODEL` 核实，首选，无回退）；基线 `43b6d79681a49562f41751368b2ae00c24062f56`，分支 `fix/frontend-workbench-visual`。前置 Checklist 实核 70 checked / 0 unchecked，Analyze 允许 T-18 实施。
  - 生产改动仅 `SampleChart.vue` scoped `figcaption .num { display: inline; }`；回归仅 `e2e/theme.spec.ts`。新增两档真实浏览器测试：文本节点 Range 每段单矩形、竖向共同交集与水平顺序，计算 display / mono / tabular / 右对齐，单位同行且不重叠、页面与图注无横滚；图注以外全部 `span.num` 仍 block，集合含盘面、关注列表与焦点带。
  - `pnpm -C frontend test:e2e -g "H-01"`：旧生产代码 **2 failed / exit 1**，两档均失败于“caption text and number share one line”；仅加局部规则后 **2 passed / exit 0**。
  - `pnpm -C frontend test:e2e -g "AC-006-3|AC-006-4|AC-001-4"`：**6 passed / exit 0**；`pnpm -C frontend test`：六项守卫 / typecheck / lint 通过，**14 文件 559 单元与组件 + 68 E2E passed / exit 0**（本轮实跑，新增 2 E2E）；`pnpm -C frontend build`：**exit 0**，828 模块，JS 780.57 kB，仅 chunk 大小提示；`git diff --check`：**exit 0**。
  - 日志与各自 exit：`C:/Users/iswal/AppData/Local/Temp/fw-h01-resume.fw1YK3/h01-{red,green,related,tests,build,diff-check}.{log,exit}`；红跑 Playwright 产物另存该目录 `h01-red-results/`，不入库。
  - 截图：`assets/h01-fix-20261028/{before,after}-{1440,960}x900.png`，均为真实 Chrome 156.0.8078.49 / Playwright 1.64.1 的 mock normal **图注特写**；按本轮指示先滚动图注到可视区域，再截图（不截图被 H-02 裁切的整图）。这是 AI 执行采集，**本轮未做看图结论或人工验收**，协调会话后续原生视觉复核；元数据见同目录 README。
  - 边界核对：`frontend/` 相对基线只改上述两个文件；shared / design / contracts、冻结 spec / Checklist、manual-acceptance 与旧 60 张截图均零差异。H-02、11 项旧 P3 未修复，M-01 ~ M-08 未勾选。测试服务由 Playwright 自启停，4173 已释放，未启动独立服务或其他 agent。
- **实施后流程（不属本任务）**：Converge 追加记录 → 独立 A Review（新会话、与实施不同模型）→ Walter Gate 2。M-08 人工勾选仍由 Walter 复核。

### 本次 H-01 Review 新增后续候选（2026-10-28；不属原 11 项已接受 P3，不是已批准的实施任务，不计工时）

| 发现 | 当前处理 | 内容 / 建议 | 验收引用 |
|---|---|---|---|
| A-H01-P3-1（原件编号 P3-1） | **未补采，待 Walter 决定修 / 接受为后续** | `assets/handoff/m08-chart-1440.png` 仍为修复前原件，1440 不受 H-02 影响；建议 Walter 复核 M-08 前补采修复后 1440×900 整图到新目录（不覆盖旧图），或在 Gate 2 材料中明确当前看图路径为 `assets/h01-fix-20261028/after-1440x900.png` / `after-960x900.png`（图注特写）。来源：[review-h01.md §3](review-h01.md) | AC-009-2、M-08 |

## AC 覆盖

| AC | 任务 |
|---|---|
| AC-001-1 | T-02、T-14 |
| AC-001-2、AC-001-6 | T-03 |
| AC-001-3 | T-03；人工 M-01（T-15） |
| AC-001-4 | T-04、T-14、T-16、T-18（H-01 图注，已实施 `771f2af`、自动化通过；待独立 Review） |
| AC-001-5 | T-03、T-04、T-11、T-14 |
| AC-002-1、AC-002-7 | T-08 |
| AC-002-2 ~ AC-002-5 | T-08 |
| AC-002-6 | T-14；T-18（仅无横向溢出回归，已实施 `771f2af`、自动化通过；不涉及 H-02） |
| AC-003-1 ~ AC-003-4、AC-003-6 | T-10；T-16 补强 AC-003-1 / AC-003-4；AC-003-5 另有人工 M-03（T-15） |
| AC-004-1、AC-004-2 | T-09 |
| AC-004-3 | T-09、T-11 |
| AC-004-4 | T-09、T-14 |
| AC-004-5 | T-11、T-16；人工 M-04（T-15） |
| AC-004-6 | T-03 |
| AC-005-1 ~ AC-005-5、AC-005-7 | T-13 |
| AC-005-6 | T-06、T-07 |
| AC-006-1 ~ AC-006-3 | T-12；AC-006-4 另有人工 M-08（T-15）；T-18 回归 AC-006-3 图注版式（已实施 `771f2af`、自动化通过；待独立 Review） |
| AC-007-1 | T-03 |
| AC-007-2 | T-07、T-14 |
| AC-007-3 | T-06、T-07、T-16、T-17（验收证据） |
| AC-007-4 | T-06、T-07、T-16 |
| AC-008-1 | T-05、T-15 |
| AC-008-2 | T-02、T-05 |
| AC-008-3 | T-05 |
| AC-009-1 | T-01、T-15、T-17；T-18（全量回归 559 + 68 / build 通过，`771f2af`） |
| AC-009-2 | T-15、T-17 |

原始实施合计 15 个任务，预计约 25.5 小时。T-08 与 T-13 各承担 5–6 个 AC，若实施时超过 2 h，按 AGENTS §2 第 6 步拆成两项（各自更新矩阵与依赖），不改变本清单的覆盖。

Review 后新增 T-16 / T-17 共 2.5 小时，合计 17 项 / 28 小时；不新增 AC。Handoff 新发现 H-01 / H-02 只登记为后续候选，不是已批准的实施任务，不计工时；本阶段不改生产代码。T-16 补强 AC-001-4 / AC-003-1 / AC-003-4 / AC-004-5 / AC-007-3 / AC-007-4，T-17 补齐 AC-009-1 / AC-009-2 的收敛证据；P3 台账不是已获批准的实施任务，不计入上述工时。

2026-10-28 恢复追加 T-18（H-01，1 小时，已授权待修复、未实施），合计 18 项 / 29 小时；不新增 AC，不改冻结 spec。H-02 留待 v2、未修复，不计工时；11 项已接受 P3 不在 T-18 范围内。

2026-10-28 Converge：上句“未实施”为规划时点记录；T-18 已实施（`771f2af` / `f4ff7be`），Converge 已收敛（H-01 实现与自动化验证范围，converge §9），未新增任务，合计仍 18 项 / 29 小时；待独立 A Review 与本次修复 Gate 2。
