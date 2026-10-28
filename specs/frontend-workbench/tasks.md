# Feature: frontend-workbench 任务清单（tasks.md）

> Tasks 阶段产物；每项 0.5–2 小时。**状态：已生效（Checklist 第四轮基线 `2c2fbc8`，70/70）；T-01 ~ T-17 已实施，独立 A 第二轮 Review 通过；Gate 2 已批准（Walter 2026-10-28 回复“确认”：接受 11 项 P3 为后续任务，未修复）；进入 Handoff。**
> 依据：`spec.md`（Gate 1 批准冻结，45 条 AC）+ `plan.md`（精简版）。
> 按 AGENTS.md §5 去掉了守卫样例自检（AC-001-2 明文要求的 `colors` 最小样例除外）、逐锚盘点、跨字段校验与单次使用的抽象层；15 个任务，约 25.5 小时。

> **v2 Tasks 追加（2026-10-28，草案）**：本文件末尾新增「## v2 任务（spec v2.1 / plan §7）」。**本声明优先于上方旧页首**：旧页首写的「45 条 AC / Checklist 通过后生效 / 15 个任务约 25.5 h」，连同 T-01～T-15 的正文、勾选状态和「AC 覆盖」表，都原样保留为 v1 历史基线，不再修改。与 v2 冲突的地方，按 v2 任务第 2 节的覆盖声明以 v2 为准。需求依据是冻结的 spec v2.1（52 条 AC，Gate 1 已通过，AC 集合与 `fec3556` 一致）加 plan §7。
> **模型记录**：Tasks = `claude-opus-5-5` via `anthropic`。`claude-bridge` 在本限额窗口已明确额度不可用，按 AGENTS §6 第 5 条不重复探活；只换了通道，没有换模型。协调 = `openai/gpt-6.1-sol`（只读，不是审核员 A，也不是实施者）；串行落盘 = 本 Tasks 会话（`claude-opus-5-5` via `anthropic`），按协调器限定的范围落盘，不是新设计。任务 = frontend-workbench v2 Tasks 起草。固定基线 = `a8ab444a28e8e6a9fd056401b55f63a1b25a2c4a`（工作树干净）。失败类别 = 通道额度；本记录已脱敏。
> **审核依据**：当前有效的 v2 清单是 `specs/frontend-workbench/checklist-v2.md`。审核员 A = `claude-fable-5-1` via `anthropic`，独立会话，审查对象 `d2bf5a7`，结论为通过：0 阻断、9 条建议，允许进入 Tasks，不授权 Implement。这个通过**只覆盖 `d2bf5a7` 的 plan §7**；本次 Tasks 以及随附的 plan §7 小改**都未经审核**。旧 `checklist.md` 只证明 v1，不修改，也不授权 v2。
> **状态**：v2 任务是草案。下一步先做 Analyze，再由 A 新开独立会话定向复核，并补勾 checklist-v2「阶段说明」里的 I-01b 和 V-02。**全部 v2 实施任务 blocked**，原因有两个：v1 完成 Review / Gate 2 / Handoff 并合入 main 的准确 SHA 未取得；H-1～H-6 没有任何已交付的实现 SHA。本清单不启动 Implement；在等外部前置的任务，不能视为已完成。
> **当前阶段补记—暂停交接（2026-10-28）**：Analyze R2 审 `6bda6c9`，F-01～F-07 全部关闭、无新增 F；随后 A = `claude-fable-5-1` via `anthropic` 新开独立会话审 `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`，Checklist R2 通过（0 阻断，I-01b / V-02 由 A 正式勾选），产物提交 `f1f755bad8e4bab7577c415f4aea3d297c9d37a8`。下方 Tasks 草案 / 待审 / R1 修正记录是当时历史；当前内部设计与任务质量已过审。新增非阻断建议 V2-S10～S12 尚未处理，见 `checklist-v2.md` R2 与根 `HANDOFF.md`；用户已要求暂停，不展开新工作。v1 Handoff 与对应 H-x 交接仍未登记，12 个实施任务全部 blocked，不授权 Implement。
> **R5 修正与更正（2026-10-28）**：Plan/Tasks = `claude-opus-5-5` via `anthropic`，由协调器 `openai/gpt-6.1-sol` 新开会话派出（不是 Implement，也不是审核员 A）。协调器已对 Opus bridge 做最小真实探活，返回额度 / 限流类失败，同模型 anthropic 正常；只换通道，未重试 bridge，未改 provider / 路由 / 配置。基线 `d4b1853`，分支 `docs/frontend-workbench-v2-resume-fixes`。按只读 Analyze R5（`analyze-v2-r5.md`，2 P2 / 3 P3）修 F-01～F-05：只改 plan / tasks，并在 R3 / R4 报告页首加更正注记；不改 spec、两份 Checklist、代码或 `design/`（`design/ui` 的修改由 T-V2-01 实施时写入）。**通道更正（F-05）**：下方 v2 段 R3 / R4 行中“会话由用户以该通道启动；本会话未探 bridge”是作者当时的措辞；实际情况是协调器派出的会话，bridge 探活因额度 / 限流失败后才走 anthropic。**审核范围更正（F-04）**：页首“本次 Tasks 以及随附的 plan §7 小改都未经审核”“v2 任务是草案”是 A R2 之前的历史状态。A R2（产物 `f1f755b`）已审到 `949a232`，包括 Tasks 和这些 §7 小改；还没经 A 审的增量从 `d1c2133` 起，A 的固定复核对象见 v2 第 1.1 节。
> **R6 修正（2026-10-28）**：Plan/Tasks = `claude-opus-5-5` via `anthropic`，由协调器新开会话派出（不是 Implement，也不是审核员 A）；协调器已对 bridge 最小真实探活，返回额度 / 限流类失败，anthropic 正常；只换通道，未重试 bridge，未改配置。基线 `43b97dd`，分支 `docs/frontend-workbench-v2-resume-fixes`。按只读 Analyze R6（`analyze-v2-r6.md`，0 P1/P2、2 P3）修：**F-01** 1.1「A 定向复核」行写明审查路径与范围外断言，闸门 2(a)、§9 第 3 步引用同一口径；**F-02** T-V2-01 标准 6 只引 AC-008-1（依据 spec R-008 / §4），矩阵 AC-002-2 行去掉 #6 及其命令，plan §7.2 备注同步。只改 plan / tasks，不改 spec、两份 Checklist、代码、`design/` 或任务结构（仍 12 项 / 22 h）。R6 O-1（T-V2-01 工时）留给 A 做 V-02 粒度复核时确认，本轮不拆任务。
> **Analyze R1 后修正（2026-10-28，历史记录）**：修正 = `claude-opus-5-5` via `anthropic`（bridge 本窗口额度不可用，未重试、未换模型）；基线 `b364971a1a76fde96be6f924a7b7263ecb9cd447`，分支 `docs/frontend-workbench-v2-analyze-fixes`。按只读 Analyze R1（3 P2 / 4 P3，原文存同目录 `analyze-v2.md`）修 v2 段：F-01 `PlaceholderPage.vue` 入第 4 节与 T-V2-02（加 typecheck 标准）；F-02 T-V2-01 明确迁移 `shell.spec` 旧八项 / research 深链用例，并用 `AC-002-2` 全前缀验证；F-03 `shell.spec` 写入链改为 01→02→09，由 T-V2-09 把 `/jobs` 占位子断言迁移为集成态；F-04 H-2·列表随交接登记一个写 action，T-V2-05#2 只调用它；F-05 T-V2-03 条件依赖 H-3·路由切片；F-06 H-6 `jobFixtures` 可替换整个作业样例集合；F-07 闸门 2 改为 A 定向复核 SHA 与明确通过记录。仍为 12 个任务、22 h；v1 正文、spec 和两份 checklist 未改。**本修正未经 A 定向复核，也未重跑 Analyze。**

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
| H-01 | Handoff 新发现（AI 视觉检查，2026-10-28，执行者初判 P3）；登记、未修复、**未经 Walter 处置** | 样例图图注“近 60 日收盘 · 样例”断成三行：图注内数字用了 `span.num`，被全局 `span.num { display: block }` 渲染为独立块；后续由 Implement 修正图注内联数字的样式，不改令牌与 spec | AC-001-4、AC-006-3、M-08；证据 `assets/handoff/m08-chart-1440.png`；修复后重采 M-08 截图 + `pnpm -C frontend test` |
| H-02 | Handoff 新发现（AI 视觉检查，2026-10-28，执行者初判 P3）；登记、未修复、**未经 Walter 处置** | 小于 980 的顶部横向导航中，专题研究子项纵向堆叠，导航区约 205 px；960 ~ 979×900 下模块区可视高度约 215 px，样例图不能一屏完整显示（可滚动、无重叠、无横向溢出）。与 UI_LAYOUT `#rail` 已采用的“塌成顶栏横向滚动”不一致；后续按该规定收紧窄窗导航（是否保留子项及其形态先请 Walter 裁定；v2 规格同样涉及导航，需协调） | AC-002-6、R-002、M-06；证据 `assets/handoff/m06-979.png`、`m06-960.png`；修复后补断点 e2e 对导航高度的断言并重采 M-06 |

## AC 覆盖

| AC | 任务 |
|---|---|
| AC-001-1 | T-02、T-14 |
| AC-001-2、AC-001-6 | T-03 |
| AC-001-3 | T-03；人工 M-01（T-15） |
| AC-001-4 | T-04、T-14、T-16 |
| AC-001-5 | T-03、T-04、T-11、T-14 |
| AC-002-1、AC-002-7 | T-08 |
| AC-002-2 ~ AC-002-5 | T-08 |
| AC-002-6 | T-14 |
| AC-003-1 ~ AC-003-4、AC-003-6 | T-10；T-16 补强 AC-003-1 / AC-003-4；AC-003-5 另有人工 M-03（T-15） |
| AC-004-1、AC-004-2 | T-09 |
| AC-004-3 | T-09、T-11 |
| AC-004-4 | T-09、T-14 |
| AC-004-5 | T-11、T-16；人工 M-04（T-15） |
| AC-004-6 | T-03 |
| AC-005-1 ~ AC-005-5、AC-005-7 | T-13 |
| AC-005-6 | T-06、T-07 |
| AC-006-1 ~ AC-006-3 | T-12；AC-006-4 另有人工 M-08（T-15） |
| AC-007-1 | T-03 |
| AC-007-2 | T-07、T-14 |
| AC-007-3 | T-06、T-07、T-16、T-17（验收证据） |
| AC-007-4 | T-06、T-07、T-16 |
| AC-008-1 | T-05、T-15 |
| AC-008-2 | T-02、T-05 |
| AC-008-3 | T-05 |
| AC-009-1 | T-01、T-15、T-17 |
| AC-009-2 | T-15、T-17 |

原始实施合计 15 个任务，预计约 25.5 小时。T-08 与 T-13 各承担 5–6 个 AC，若实施时超过 2 h，按 AGENTS §2 第 6 步拆成两项（各自更新矩阵与依赖），不改变本清单的覆盖。

Review 后新增 T-16 / T-17 共 2.5 小时，合计 17 项 / 28 小时；不新增 AC。Handoff 新发现 H-01 / H-02 只登记为后续候选，不是已批准的实施任务，不计工时；本阶段不改生产代码。T-16 补强 AC-001-4 / AC-003-1 / AC-003-4 / AC-004-5 / AC-007-3 / AC-007-4，T-17 补齐 AC-009-1 / AC-009-2 的收敛证据；P3 台账不是已获批准的实施任务，不计入上述工时。

## v2 任务（spec v2.1 / plan §7）

> **恢复状态（2026-10-28，协调集成登记；G-02 裁定前的历史快照，当前状态见下方“G-02 裁定落实”行）**：v1 正式基线 `43b6d79681a49562f41751368b2ae00c24062f56` 已由 `eb6ebd8` 合入，并已串行快进到主规格分支。S10～S12 已落实；12 项均未开始。集成人、集成验证树与独立实施树已按下表登记，但建立工作树不等于授权 Implement。合并后的独立只读 Analyze R5（`analyze-v2-r5.md`）判定不通过（2 P2 / 3 P3），F-01～F-05 已按页首“R5 修正与更正”行修正；复跑 R6（`analyze-v2-r6.md`）确认 R5 各项关闭，新发现 0 P1/P2、2 P3，已按页首“R6 修正”行修正。R7 定向复跑审 `217960d` 已确认 R6 的 F-01 / F-02 全部关闭、无新增 P1/P2/P3（原文 `analyze-v2-r7.md`），闸门 4 的内部子项满足。A R3 已独立复核固定 `b375b27` 并通过（0 阻断，原样产物 `425c1fd6c639734b0c45ba7cf9259dbee4439074`，见第 1.1 节），当时仍待 Walter 裁定 G-02 窄窗导航（现已裁定，见下方）。S1/S2 另缺 H-x 实现交付。下方 R3/R4 与页首“暂停 / 未取得”均为当时记录。

> **V2-S13 / S14 落实（2026-10-28，A R3 非阻断建议）**：Plan/Tasks = `claude-opus-5-5` via `anthropic`，由协调器 `openai/gpt-6.1-sol` 新派独立会话（不是 Implement，也不是审核员 A）；同一限额窗口内 Opus bridge 已有最小真实调用的额度 / 限流类失败，本会话按 AGENTS §6 第 5 条未重试 bridge、未改配置。基线 `79b5212`，worktree `D:/2030/Futures-AI-workbench-v2-g02`，分支 `docs/frontend-workbench-v2-g02`。只改 tasks 文字（A R3 结论第 2 条：不触发 spec 或 plan §7 设计变更，不要求重新 A 复核）：S13 在 T-V2-01 与第 9 节预登记超时拆分规则；S14 把 T-V2-03 / 04 / 05 / 07 / 09 的 blocked_by 收窄为未解除项，第 3 节写明已满足前置不再逐任务列出，第 1.2 节登记规则 1 补 `8af343f` R6。任务数、工时、依赖、完成标准、验证命令与 52 AC 矩阵都不变；G-02 与 H-x 前置不变，12 项仍 blocked，不授权 Implement。

> **G-02 裁定落实（2026-10-28，当前状态）**：协调器问“是否按推荐，采用导航内部横向滚动？”，Walter 本轮回复“可以”。协调器转述的裁定内容：小于 980px 时九项顶部导航保持单行，导航容器内部横向滚动，页面本身不横滚。**G-02 人工裁定已满足。** Plan/Tasks = `claude-opus-5-5` via `anthropic`，由协调器 `openai/gpt-6.1-sol` 新派独立会话（不是 Implement，也不是 A）；同一限额窗口内 Opus bridge 的最小真实调用已返回额度 / 限流类失败，本会话未重试 bridge、未改配置。基线 `e84ee27de7baba055a92eb9d92d80ac76e5ab513`。本次改动是对已采用的 `UI_LAYOUT.md#narrow` 规则的实现细节，不改 spec / 52 AC / 产品形态，不触发 ADR 或 Gate 1。但它属于 plan §7.4 的实质设计修改，所以闸门 2 / 4 对这部分增量重新打开：先由独立只读 Analyze R8 复核，再由 A R4 定向复核（固定对象规则见第 1.1 节“A 定向复核”行的当前口径）。改动范围：plan 页首、§7.2 / §7.4 / §7.11 / §7.12 M-09 / §7.13 / §7.14；本节第 1.1、1.2、2、3、4、5 节，T-V2-01 / 02 及各任务状态行，第 7 节矩阵 AC-002-6 / AC-008-1，第 8、9 节。任务仍为 12 项 / 22 h，依赖不变。v1 正文、spec、两份 Checklist、代码、`design/`、`docs/` 都未改，历史报告原件未改。**当前阻塞**：T-V2-01 / 02 只等 Analyze R8 与 A R4；T-V2-03～12 另缺 H-x 四项交接（第 1.2 节全部未交付）。

> **恢复修订 R3（2026-10-28，用户“按 HANDOFF.md 继续”后）**：Plan/Tasks = `claude-opus-5-5` via `anthropic`（会话由用户以该通道启动；本会话未探 bridge、未改 provider / 路由 / 配置）。基线 `ded7161`，分支 `docs/frontend-workbench-v2-resume`。内容：登记 v1 Handoff SHA `43b6d79` 并按其真实代码复核 v1 事实；落实 A R2 非阻断建议 V2-S10～S12；按 Handoff 代码消解 T-V2-01 对 `AppShell.vue` 的条件写入。无需求变化、不改 spec / 两份 Checklist / v1 任务正文。**R3 修订未经 A 定向复核**（闸门 2 须 A 对 R3 基线重新确认），定向 Analyze 见 `analyze-v2-r3.md`。
> **集成记录 R4（2026-10-28，G-03 关闭）**：本次文档 merge 执行者 = `claude-opus-5-5` via `anthropic`（协调器 `openai/gpt-6.1-sol` 指定为唯一执行者，仅限本次串行文档集成；不是 Implement，也不是审核员 A）。合并提交 `eb6ebd8` 把 v1 Handoff `43b6d79` 合入本分支，4 处冲突按“v1 段取 Handoff 版本、v2 段原样保留”解决；本节（v2 段）合并时逐字未变，合并后只补本行和 1.1 / §9 / T-V2-01 状态行。冲突均非语义冲突，定向 Analyze 见 `analyze-v2-r4.md`。上方 v1 段现为 Handoff 版本（T-01～T-17、P3 台账），v2 页首所称“15 个任务 / 25.5 h”指 v1 原始基线，T-16 / T-17 与 v2 的关系见第 2 节 R3 补充。
>
> 本节是 v2 唯一有效的任务清单。A R2 已审到 `949a232`；从 `d1c2133` 起的增量（R3、R4 合并、集成登记、R5 修正、R6 修正）已由 R7 确认无内部未解决项，并经 A R3 定向复核通过（固定对象 `b375b27`，产物 SHA 见第 1.1 节）。`79b5212` 之后的增量（`e84ee27` 的 S13 / S14 文字落实、本次 G-02 落实）**尚未复核**，按第 1.1 节当前口径由 Analyze R8 与 A R4 复核。**所有任务都未开始，状态都是 blocked。** 本节列出的测试文件、测试标题和 fixture 用法都是计划，要到实施后才能执行；本轮没有运行任何命令，所以不是验收证据。

### 1. 固定基线与交接登记

#### 1.1 基线与开工登记

| 项 | 值 | 说明 |
|---|---|---|
| 冻结需求 | spec v2.1，共 52 条 AC。R-001～R-009 分别为 6 / 8 / 9 / 6 / 9 / 4 / 5 / 3 / 2 条；AC 集合与 `fec3556` 一致 | Q-023～Q-031 已在 spec 页首的批准记录里闭环。spec §5 裁定表里残留的“待 Walter 确认”字样，以页首批准记录为准（V2-S09）。spec 已冻结，不改 |
| 设计依据 | plan §7（A R1 审 `d2bf5a7` 后通过）；Tasks 阶段的 §7 小改已由 A R2 审到 `949a232`（通过） | 还没经 A 审的增量从 `d1c2133` 起：R3 状态与事实更新、R4 合并带入的 plan §1～§6 Handoff 版本、R5 修正（plan §7.2 增加 `design/ui` 写入行、§7.4 / §7.11 / §7.13 / §7.14 同步）、R6 修正（§7.2 备注的 AC 归属）。这部分已由 A R3 复核 `b375b27` 通过（历史）。**当前未审增量（起点 `79b5212`）**：`e84ee27` 的 S13 / S14 tasks 文字，以及本次 G-02 落实（plan 页首、§7.2 / §7.4 / §7.11 / §7.12 M-09 / §7.13 / §7.14，tasks 对应各节）。由 Analyze R8 与 A R4 按下方“A 定向复核”行的当前口径复核 |
| 当前有效清单 | `specs/frontend-workbench/checklist-v2.md` | 旧 `checklist.md` 不改，也不授权 v2 |
| Tasks 起草基线 | `a8ab444a28e8e6a9fd056401b55f63a1b25a2c4a` | 只读 |
| **v1 Review / Gate 2 / Handoff 合入 main 的 SHA** | **`43b6d79681a49562f41751368b2ae00c24062f56`**（R3 登记） | PR #7「Merge PR #7: frontend-workbench v1（Gate 2 已确认，Handoff）」的 merge commit；`gh pr view 7` = MERGED、`mergeCommit.oid` 同值；`git merge-base --is-ancestor 43b6d79 main` 与 `… origin/main` 均成立。双方实施起点都是它。不得改填 `fdaa7d8`、`0ffa15e`、`b19427a` 或 `8920b06`。**v1 事实复核**：`git diff 0ffa15e 43b6d79 -- frontend` 只有 12 个文件（R1-01 变化量精度：`contracts/{types.ts,CONTRACT.md,schema.json}`、`shared/{format.ts,components/Kpi.vue,components/BoardGrid.vue}` 及 6 个测试），`design/` 无差异；第 4 节壳文件中只有 `e2e/workbench.spec.ts` 变化（新增一条 `AC-003-1 R1-01` 用例，T-V2-06 在其上追加、不改它）。plan §7 以 `0ffa15e` 核对的壳文件事实（`AppShell` 三行、`AgentDrawer` 定位、`agent/store.ts` 建 run、`stores/app.ts` 4 步、`Rail.vue` / `PlaceholderPage.vue` 的 research 依赖）在 `43b6d79` 上逐字不变。契约仍为 `1.0.0`，新增可选 `Figure.deltaDecimals`（归契约拥有者，壳不涉）。窄窗顶部导航样式在 `Rail.vue`（`.rail[data-viewport-collapsed='true'] .nav-list { flex-wrap: wrap }`），不在 `AppShell.vue` |
| 壳 v2 实施 worktree / 分支 | `D:/2030/Futures-AI-workbench-v2-implement` / `feat/frontend-workbench-v2-s0` | 已从正式 v1 Handoff `43b6d79` 创建，并已由集成人串行快进到规格提交 `79b521207a93567c4da8651e5f6e53c665e3d098`（2026-10-28 只读核对 `git rev-parse`）。当前尚无 v2 实现提交；S0 开工前还要再快进到 A R4 复核过的规格提交；开工前只由指定壳实施会话（按 AGENTS §6 路由）同步通过复核的规格及集成基线，其他会话不并写。G-03 已由合并提交 `eb6ebd8` 解除；创建工作树不解除其他闸门 |
| 集成验证分支名 | `integration/frontend-workbench-v2`，worktree `D:/2030/Futures-AI-workbench-v2-integration` | 已从 `43b6d79` 创建，已快进到 `79b5212`；由下行集成人串行快进本轮规格/审核产物及已获交接的 H-x，其他会话只读。没有 H-x 实现已集成 |
| 指定集成人 | 本协调会话 `openai/gpt-6.1-sol`（本次恢复串行协调 / 集成） | 负责真实提交的串行合并与证据登记，不代做产品决策、代码实施或 A 勾选。文档语义由 `claude-opus-5-5 via anthropic` 产出，本次 v1 合并执行者亦为 Opus；实施与 A 各用独立 worktree / 会话。`gpt-6.1-sol` 也是 A 的回退 2：如果 A 回退到 Sol，就和集成人同模型。这不违反 AGENTS §6 第 3 条（只要求与实施模型不同），但发生时要在 A 产物头部和 review.md 记录 |
| 最近一轮 Analyze | **历史：R7**（独立只读定向复跑，固定 `217960dafc85bbbf201fb16c4d1ec176ead2b7ec`，原文 `analyze-v2-r7.md`）。**当前：R8 待做**（只读，审本次 G-02 落实提交及 `e84ee27`，范围按下方“A 定向复核”行当前口径） | R7：R6 两项 P3 全部关闭，无新增 P1/P2/P3；R5 五项已由 R6 关闭。R7 的结论只覆盖 `217960d`，不覆盖 `79b5212` 之后的 G-02 设计修改；R8 报告落盘并确认无未解决项前，闸门 4 对该增量不满足 |
| Analyze 历史（以下结论限其当时固定提交） | **R6**（独立只读复跑 R5，HEAD `516b520`，`analyze-v2-r6.md`）：R5 的 F-01～F-05 全部关闭；新发现 0 P1/P2、2 P3（F-01 A 审查范围按字面会带入整套 v1；F-02 `design/ui` 登记误挂 AC-002-2），已按页首“R6 修正”行修正，**待定向复跑只读 Analyze 确认关闭**。此前：**R5**（独立只读，HEAD `5ba40ad`，`analyze-v2-r5.md`）：**不通过**，2 P2（F-01 A 复核对象不一致、F-02 `design/ui` 导航条目与 v2 冲突且无任务负责）/ 3 P3（F-03～F-05 状态记录），F-01～F-05 已按页首“R5 修正与更正”行修正，经 R6 确认关闭。R4（定向，`eb6ebd8` 合并，`analyze-v2-r4.md`）；R3（定向，`d1c2133`，`analyze-v2-r3.md`）；R2 固定 `6bda6c910343b887fad2ffede062fe241f034752`，索引 `analyze-v2.md`，作者原文 `analyze-v2-r2.md` | R2：R1 的 F-01～F-07 全部关闭，无新增 F。R3 / R4 是定向报告；R5 是合并后的独立报告，结论为不通过；R6 是其复跑，有 2 个 P3 未解决。定向复跑确认 R6 的 F-01 / F-02 关闭、且无新增未解决项前，第 5 节闸门 4 不满足 |
| A 对 Tasks（及 plan §7 小改）定向复核产物的已提交 SHA | R2（历史）：`f1f755bad8e4bab7577c415f4aea3d297c9d37a8`（审 `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`）；**恢复后 A R3：`425c1fd6c639734b0c45ba7cf9259dbee4439074`，固定审查对象 `b375b270a47d210823ae62da16438eeac17096db`，通过 / 0 阻断** | 当前 A R3 = `claude-fable-5-1 via anthropic`，独立 worktree / 新会话，R3-C01～C08 正式勾选；以本格已登记的 `b375b27` 为本轮固定对象，`425c1fd` 为已提交原样审核产物。新增 V2-S13 / S14 非阻断建议已由 Tasks 作者按 A R3 结论第 2 条只改 tasks 文字落实（见 v2 段首“V2-S13 / S14 落实”行与第 8 节）；S15 的产物 SHA / 固定对象 / 状态同步已完成。R2（审 `949a232`）为历史通过记录。<br>**当前口径（G-02 落实 → Analyze R8 → A R4；闸门 2(a)、§9 引用本口径）**：<br>• 固定对象：先有本次 Plan/Tasks 提交（`docs(frontend-workbench): apply approved G-02 horizontal navigation plan`），再做独立只读 Analyze R8。R8 报告落盘的提交就是 A R4 的固定对象；该提交只放报告和索引 / 状态行。如果 R8 触发修正，就顺延到最后一次“修正 + 复跑报告”落盘的提交。该 SHA 由集成人在报告落盘后登记在本格，A R4 产物 SHA 也登记在本格。<br>• 审查范围：`git diff 79b5212 <固定对象>`（`79b5212` 是固定对象的直接祖先，中间没有合并，所以不带路径的 diff 不会带入 v1）。`git diff --name-only 79b5212 <固定对象>` 只能出现这些路径：`specs/frontend-workbench/plan.md`、`specs/frontend-workbench/tasks.md`、`specs/frontend-workbench/analyze-v2*.md`、`specs/README.md`、`HANDOFF.md`。范围包含 `e84ee27` 的 S13 / S14 文字落实。<br>• 范围外断言（均应无输出）：`git diff 43b6d79 <固定对象> -- frontend design docs backend AGENTS.md specs/frontend-workbench/assets specs/frontend-workbench/review.md specs/frontend-workbench/converge.md specs/frontend-workbench/manual-acceptance.md specs/frontend-workbench/checklist.md specs/frontend-workbench/analyze.md`；`git diff fec3556 <固定对象> -- specs/frontend-workbench/spec.md`；`git diff 425c1fd <固定对象> -- specs/frontend-workbench/checklist-v2.md`（当前有效清单以 A R3 原样产物 `425c1fd` 为准，不再用历史 `f1f755b`）。<br>**历史口径（A R3 已按此执行，审 `b375b27`；不再用于当前复核）**：<br>**恢复后 A 的固定复核对象（F-01，当时唯一口径）**：R5 / R6 修正落盘、并经复跑只读 Analyze 确认无未解决项的那个提交，以复跑报告落盘的提交为准；如果复跑又触发修正，就顺延到最后一次“修正 + 复跑报告”落盘的提交。审查的增量起点是 `ded7161`（A R2 审到 `949a232`，`949a232..ded7161` 只有暂停记账），包括：R3（`d1c2133`）；R4 合并 `eb6ebd8`（plan §1～§6 换成 Handoff 版本，含 `deltaDecimals`；v1 任务段换成 T-16 / T-17 和含 H-02 的 P3 台账）及其记账 `1642216`；集成人与工作树登记 `5ba40ad`；R5 报告 `d4b1853` 与 R5 修正 `71a21ad`；R6 报告 `43b97dd` 与 R6 修正。<br>**审查路径与范围外（R6 F-01；当时由闸门 2(a)、§9 第 3 步引用，现已由上方当前口径取代）**：(a) 审查路径只限 `specs/frontend-workbench/plan.md`、`specs/frontend-workbench/tasks.md`、`specs/frontend-workbench/analyze-v2*.md`、`specs/README.md`、`HANDOFF.md`，审查命令为 `git diff ded7161 <该提交> -- specs/frontend-workbench/plan.md specs/frontend-workbench/tasks.md 'specs/frontend-workbench/analyze-v2*.md' specs/README.md HANDOFF.md`；其中 R4 带入的 plan §1～§6 与 tasks v1 段 Handoff 版本只核对是否与 v2 段冲突（plan §7.1 覆盖声明），不重审 v1 设计。(b) 范围外：v1 代码与截图（`frontend/`、`specs/frontend-workbench/assets/`）及 v1 的 `review.md` / `converge.md` / `manual-acceptance.md` 已由 v1 Review / Gate 2 覆盖；`session-artifacts/` 是原样归档；`spec.md` 与两份 checklist 只作依据。范围外不变由三条断言证明，均应无输出：`git diff 43b6d79 <该提交> -- frontend design docs backend AGENTS.md specs/frontend-workbench/assets specs/frontend-workbench/review.md specs/frontend-workbench/converge.md specs/frontend-workbench/manual-acceptance.md specs/frontend-workbench/checklist.md`；`git diff fec3556 <该提交> -- specs/frontend-workbench/spec.md`；`git diff f1f755b <该提交> -- specs/frontend-workbench/checklist-v2.md`。`git log ded7161..<该提交>` 和不带路径的 `git diff ded7161 <该提交>` 会带入全部 v1 提交（合并基 `3bf6476` 早于 v1 完成），不作为审查清单。**不得以 `d1c2133` 或任何更早的提交代替。** 该提交号由集成人在复跑报告落盘后登记在本格，A 复核产物 SHA 也登记在本格；实施者不改清单 |
| 本 Tasks 落盘提交 SHA | `b364971`（初稿）；`6bda6c9`（按 F-01～F-07 修正）；R3 恢复修订见 `git log -1 --format=%H -- specs/frontend-workbench/analyze-v2-r3.md`（不在文件内写自身提交号） | Analyze R2 审查 `6bda6c9`；R5 审查 `5ba40ad`。A 恢复后的复核对象只按上方“A 定向复核”行确定，不固定到 R3 落盘提交 |
| G-02 窄窗导航形态（R3 新发现，不改需求）——**已裁定** | **人工裁定已满足（2026-10-28，来源：本轮用户回复）**：协调器问“是否按推荐，采用导航内部横向滚动？”，Walter 回复“可以”。协调器转述的内容：小于 980px 时九项顶部导航单行，导航容器内部横向滚动，页面本身不横滚。这就是 `design/ui/UI_LAYOUT.md#narrow`“侧栏塌成顶栏横向滚动”的原有规则，`UI_LAYOUT.md` 原样采用、不写入。 | 两种做法原本都满足 spec R-002 / AC-002-6（文档级无横向溢出），本裁定不改 52 AC、不触发 ADR / Gate 1。按本行原登记的“改为横向滚动”路径执行：已改 plan §7.4 / §7.2（以及 §7.11 / §7.12 M-09 / §7.13 / §7.14），以及 T-V2-01 的修改范围、标准 4 和标准 6；`UI_NAV.md` 暗色适配段由 T-V2-01 写为单行加容器内横滚。下一步是 Analyze R8 与 A R4 定向复核（上方“A 定向复核”行当前口径），复核前 T-V2-01 不开工。原“保持换行”路径（写 `UI_LAYOUT.md` 的“不采用 + 原因”）已作废。v1 P3 台账 H-02 原文不改，这里不宣称 H-02 已关闭、v1 截图已补齐或视觉验收已完成；v2 删除专题子项、改为单行，只是去掉 H-02 所述成因的计划，要等 T-V2-01 实施并验证后才有证据 |

**工作树规则**：
- 壳方和互动方各用独立的 worktree / 分支，只写自己拥有的文件（见第 4 节）。
- 壳方的 S1 / S2 任务开启前，先把壳实施分支同步到集成验证分支上“对应 H-x 已集成”的那个 SHA。同步只读拉取，不向集成分支写入。
- 壳的提交由集成人串行合入集成验证分支。
- 任何会话都不在对方分支上提交、reset 或强推。

#### 1.2 生产方交接登记（按消费切片，不要求互动方全量 Handoff）

| 交接单元（plan §7.3） | 内容 | 消费的壳任务 | 生产方固定 commit | 生产方已提交的有效 Checklist SHA / 轮次 | 定向测试命令与输出摘要 | 集成验证分支上的集成 SHA | 状态 |
|---|---|---|---|---|---|---|---|
| H-1 | `CONTRACT_VERSION='2.0.0'`；`JobContext`；`SendMessage.jobContext?`；十类事件都带可选 `jobContext`；mock 把 payload 的上下文原样写入该 run 的全部事件；旧事件和旧 fixture 仍能解析 | T-V2-03、T-V2-04、T-V2-09；AC-007-5 的生产方证据（T-V2-11） | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-2·标签 | `JobStatusLabel / StageLabel / StageStateLabel / JobTypeLabel`，以及徽标组件 `JobStatusBadge`（V2-S07） | T-V2-04（只用 `StageLabel`）、T-V2-05、T-V2-06 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-2·列表 | `listJobs`；`jobsStore` 共享未筛选缓存 ①～⑤（读状态和错误、ensure/load/refresh、筛选不覆盖缓存、写回执和 agent 通知刷新同一份缓存）；“进行中”口径，用契约常量或 selector 表达，并登记进 CONTRACT.md（V2-S02）；**随交接至少交付一个可调用、会改变作业摘要的生产方写 action**（如 `createJob` 在 store 层的 action），连同它的 store 归属、公开导出和“调用后刷新同一份缓存”的定向测试，名称以交接 SHA 登记在本行（F-04）；inbox 或 H-5 的 action 不算本单元交付 | T-V2-05、T-V2-06 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-3·路由切片 | `jobs/routes.ts` 里的 `jobs` 和 `job-detail` 两条路由，以及 `main.ts` 在 mount 前调用 `addRoute`；**不含页面功能**（V2-S04） | T-V2-05、T-V2-06、T-V2-09；条件消费：T-V2-03（H-4 只经路由守卫设置 context 时，F-05） | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| 页面切片 | 互动方的 `/jobs` 列表页、作业详情页，以及 `IntakeDrawer` 的投放提交和归属流程（plan §7.13 S2） | T-V2-09、T-V2-10 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-4 | 只读的 `sessionStore.context`；离开 `job-detail` 时在同一次导航内同步清空；交接登记须写明是否含可在测试中使用的公开设置方式（只经路由守卫设置时，T-V2-03 条件依赖 H-3·路由切片；壳不加测试专用 setter 或抽象，也不写 sessionStore，F-05） | T-V2-03、T-V2-07、T-V2-09 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-5 | `intakeStore.open(jobId?) / close / isOpen / jobId`，`jobId` 是打开时的快照；`IntakeDrawer` 根元素用 `.glass-drawer`，无 fixed 定位、遮罩、`aria-modal` 或焦点锁，关闭时不导航；它的写操作按 H-2 ⑤ 刷新缓存 | T-V2-07、T-V2-08、T-V2-10 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |
| H-6 | `empty / error / slow` 三个场景覆盖 `listJobs`；`jobFixtures` 覆盖项可以替换整个作业样例集合（新增一项即以原集合加该项替换；只含非进行中作业的集合也用替换实现，F-06）；至少有一个进行中作业带未读待处理项 | T-V2-05、T-V2-06、T-V2-09 | 未取得 | 未取得 | 未取得 | 未取得 | 未交付 |

**登记规则**：
1. 外部 `8bd1b31` 里已提交的旧 R2（审查对象 `630e06f`）不覆盖 H-2、H-4、H-5、H-6 的新增要求；已提交的 `8af343f` 中的 Checklist R6 同样不含 plan §7.3 的新增要求（plan §7.3 末段），也不作为交接证据（V2-S14）。外部 worktree 里未提交的 R3 / R4 修改，以及只含设计文字、没有实现的后续提交，不能作为交接证据。互动方此后已提交的设计与审核记录，包括 `0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d`（v1 基线与 H-x 生产方设计）、`9acf3de661187840ea5be6f6d6f78205872ac356`（其独立 A R7 Checklist 原样产物）、`5e9e1f4e99e7d5d7c4dfbf682a7fd92bd7dff796`（R7 通过与剩余实施闸门记录），**只作为生产方设计授权的参考**，不是任何 H-x 的四项交付。2026-10-28 只读核对：这三个提交都不含 `frontend/src/jobs`，也没有固定实现 commit、定向测试摘要或集成 SHA。所以下表各行仍为“未交付”。生产方的有效授权，以登记进来的“已提交的有效 Checklist SHA”为准。
2. 每个交接单元都必须同时满足四项：有固定 commit、有已提交的有效 Checklist SHA、有定向测试命令和输出摘要、已由集成人集成。四项都满足后，消费它的任务才解除对应的 blocked_by。缺任何一项，任务就继续 blocked。
3. 按消费切片解锁，不等互动方全量完成 Review / Gate 2 / Handoff 合入 main，所以没有循环依赖：
   - 互动方 A～G 组只依赖 v1；
   - 壳 S1 只依赖对应的交接切片；
   - 互动方 H 组的集成验证依赖壳 S1；
   - 壳 S2 依赖全部 S1，加上 H-3 和页面切片。
   - 完整集成后，双方各自走 Review / Gate 2 / Handoff。壳合入 main 时，生产方的依赖提交要先于壳或与壳同批合入，顺序由集成人安排。
4. 字段名、方法名和导出名以交接 SHA 为准。如果与 plan 有差异，回到 Analyze 更新 Tasks；壳不兜底，也不复制实现。生产方拒绝某项要求时，报 Walter 裁决。
5. 跨 feature 的新增要求已在 `specs/README.md` 的「跨 feature 待同步事项」第 33 行登记（V2-S01）。本 Tasks 的三点交接细化（`JobStatusBadge` 随 H-2 交付；H-2 标签可先交付给 S1-ctx；H-3 路由切片可先交付给 S1-track、不等页面功能）已随本 Tasks 落盘补入同一行。Analyze R1 后又补入三点（F-04 / F-05 / F-06）：H-2·列表随交接登记一个会改变作业摘要的写 action；H-4 交接登记写明是否含可测试的公开设置方式；H-6 `jobFixtures` 可替换整个作业样例集合。

### 2. 对 v1 历史任务的覆盖声明（原文不改）

| v1 位置 | 与 v2 冲突的内容 | v2 处理（以 v2 条款为准） |
|---|---|---|
| 旧页首「45 条 AC」「Checklist 通过后生效」「15 个任务约 25.5 h」 | v1 基线说明 | 保留为历史。v2 的前置是 checklist-v2 加第 5 节的开工闸门，不是旧 `checklist.md` |
| 约定「文件边界：只动 frontend/、design/…」 | v1 的边界比较宽 | v2 按第 4 节的文件唯一写入者执行，范围更窄 |
| T-08 上下文里的「路由与八项菜单」、完成标准 1「八项菜单固定顺序」、验证命令 1 | 八项菜单 | 以 T-V2-01 标准 1（九项，AC-002-2 v2）为准；`shell.spec` 中对应的旧八项物理用例也由 T-V2-01 迁移，不残留 |
| T-08 完成标准 5「专题研究子项由研究列表驱动」、验证命令 5 `-g "AC-002-3"` | 专题子项 | v2 中作废：旧用例由 T-V2-01 删除；AC-002-3 的 v2 语义由 T-V2-09 标准 2 验收 |
| T-08 修改范围中的 `src/stores/app.ts`（研究列表加载、4 步进度、含“研究列表”的文案）以及完成标准 2 的进度部分 | 4 步加载 | 以 T-V2-02 标准 1（3 步，文案不含“研究列表”）为准 |
| T-08、T-13 修改范围中的 `src/main.ts` | v1 时由壳写入 | v2 壳不改 `main.ts`，它归互动方（H-3 的 `addRoute`） |
| T-13 完成标准 1「八路由输入栏可见」、验证命令 1 | 八个路由 | 以 T-V2-01 标准 2（九个路由）为准 |
| T-14 完成标准 1（十个视口） | 没有覆盖轨道和双抽屉 | 保留，由 T-V2-01 标准 4 和 T-V2-08 扩充 |
| T-09 完成标准 3～5、T-10 完成标准 4 | 没有覆盖轨道 | 保留，由 T-V2-06 标准 3、4 扩充 |
| T-15 完成标准 1「`pnpm test` 全绿」 | v1 证据 | v2 只认集成验证分支上的全量结果（T-V2-12 标准 1） |
| T-15 完成标准 2「M-01～M-08 八项」、验证命令 2 | 八项人工清单 | 以 M-01～M-12 为准：文本在 T-V2-02 标准 3，截图在 T-V2-12 标准 3 |
| T-06、T-07（契约类型、事件、mock、real、contract-build、CONTRACT.md） | 契约写入任务 | v2 不重做。契约 2.0.0、可选 `jobContext`、作业方法 / 类型 / mock 和契约生成物，都由互动方唯一写入（H-1、H-2、H-6）。壳只导入和跑回归，不接管 schema、mock 或 `main.ts` |
| T-01（脚手架、package、lock、工具链） | — | v2 不改 |
| 旧「AC 覆盖」表（45 条）、尾注「T-08 / T-13 超过 2 h 就拆分」 | v1 矩阵 | 保留为历史；v2 以第 7 节的 52 条矩阵为准 |

v1 Handoff 合入 main 后，本文件和 v1 版本 tasks.md 的合并由集成人处理：v1 段以 Handoff 版本为准，v2 段原样保留。如果出现语义冲突，回到 Analyze。

**R3 补充（按 `43b6d79` 的 v1 段核对）**：Handoff 版 v1 段新增的 T-16（R1-01 变化量独立精度）和 T-17（R1-09 流程文档）只涉及契约、`shared/` 和 specs，与 v2 任务无冲突，v2 不覆盖它们。P3 台账（R1-02～R1-11、R2-01、R2-02、H-01、H-02）不属于 v2 范围，v2 任务不修复其中任何一项，也不宣称修复；其中 H-02 与 T-V2-01 相关：G-02 已由 Walter 于 2026-10-28 裁定（第 1.1 节 G-02 行），但 H-02 台账原文不改，v2 不宣称已关闭 H-02、已补齐 v1 截图或已完成视觉验收。

### 3. 约定

- 命令都在 worktree 根目录执行，格式为 `pnpm -C frontend …`。
- **测试标题**格式为 `<AC 编号> <v2 主题标签> <描述>`，用 `test:unit -t` / `test:e2e -g` 按前缀选取。主题标签和任务的对应关系：
  - T-V2-01：`v2-nav`
  - T-V2-02：`v2-boot`、`v2-topbar`、`v2-manual`
  - T-V2-03：`v2-ctx-store`
  - T-V2-04：`v2-ctx-ui`
  - T-V2-05：`v2-track`
  - T-V2-06：`v2-track-state`
  - T-V2-08：`v2-bp`
  - T-V2-09：`v2-int-nav`、`v2-int-ctx`
  - T-V2-10：`v2-int-intake`、`v2-int-track`
  - v1 原有测试标题不加标签，按 AC 编号回归。
- 测试使用真实实现：真实 Pinia、互动方真实交付的 store / routes，以及真实 mock `dataClient` / `agentClient`。只在系统边界注入，也就是 `?scenario=`、`window.__FAI_MOCK__` 和 `jobFixtures` 覆盖。不要用 `vi.mock` 替换内部模块，也不要把“进行中”判定之类的业务逻辑抄进测试。
- 每个任务完成后提交一次，提交信息以 `T-V2-xx` 开头。
- 每个任务开工前，要重读第 1 节登记表和第 5 节闸门。blocked_by 没有全部解除的任务不得开始。
- 各任务的 blocked_by 只列尚未解除的前置（V2-S14）。已满足的 v1 Handoff 前置在每个任务状态行统一标“已满足 `43b6d79`”，不算阻塞项。闸门 1～4 仍按第 5 节在开工前逐项人工核对。**当前**：本次 G-02 落实属于实质修改 Plan / Tasks，闸门 2 / 4 对这部分增量重新打开。A R3 / R7 只覆盖 `b375b27` / `217960d`，是历史结论。所以 12 个任务都共同等待 Analyze R8 与 A R4（第 1.1 节当前口径），各状态行写作“全体共同前置”。

### 4. 文件唯一写入者（v2 任务内；同一文件被多个任务修改时串行）

| 文件 | 写入任务（按顺序） |
|---|---|
| `frontend/src/app/{nav.ts,router.ts,Rail.vue}` | T-V2-01 |
| `design/ui/{UI_NAV.md,README.md}`（只改暗色适配段与索引行）。`design/ui/UI_LAYOUT.md` 不写：G-02 已裁定为横向滚动，`#narrow` 原样采用 | T-V2-01（F-02；G-02） |
| `frontend/src/app/AppShell.vue` | T-V2-07（R3：`43b6d79` 中窄窗顶部导航样式在 `Rail.vue`，T-V2-01 不写本文件） |
| `frontend/src/stores/app.ts`、`frontend/src/pages/PlaceholderPage.vue`（最小派生修改）、`frontend/src/app/TopBar.vue`、`frontend/tests/component/topbar.spec.ts` | T-V2-02 |
| `frontend/e2e/shell.spec.ts` | T-V2-01（含新增 `AC-002-6 v2-nav` 窄窗导航用例）→ T-V2-02 → T-V2-09（只把 `/jobs` 壳占位子断言迁移为集成态） |
| `frontend/e2e/agent.spec.ts` | T-V2-01 |
| `specs/frontend-workbench/manual-acceptance.md`、`frontend/tests/unit/manual-acceptance.spec.ts` | T-V2-02 |
| `frontend/src/agent/store.ts`、`frontend/tests/unit/agent-context.spec.ts`（新建） | T-V2-03 |
| `frontend/src/agent/{AgentDock.vue,CotTimeline.vue}`、`frontend/tests/component/timeline.spec.ts` | T-V2-04 |
| `frontend/src/agent/AgentDrawer.vue` | T-V2-04（选择器）→ T-V2-07（避让） |
| `frontend/src/workbench/WorkbenchPage.vue` | T-V2-05 |
| `frontend/src/workbench/JobTrack.vue`（新建）、`frontend/tests/component/job-track.spec.ts`（新建） | T-V2-05 → T-V2-06 |
| `frontend/e2e/{workbench,modules}.spec.ts` | T-V2-06 |
| `frontend/src/design/tokens.json`、`design/ui/UI_DARK_ADDITIONS.md`；生成物 `frontend/src/design/generated/*`、`frontend/index.html` 首帧块 | T-V2-07；生成物只能用 `pnpm -C frontend tokens` 重新生成 |
| `frontend/e2e/breakpoints.spec.ts` | T-V2-08（T-V2-01 只用 `-g "AC-002-6"` 运行它的原断言作回归，不写入） |
| `frontend/e2e/integration-v2.spec.ts`（新建） | T-V2-09（创建）→ T-V2-10（追加） |

**v2 任务都不修改**：`frontend/package.json`、lock 文件、工具链配置、`frontend/src/contracts/**`、`frontend/contracts/*`、`frontend/scripts/contract-build.mjs`、`frontend/src/agent/events.ts`、`frontend/src/jobs/**`、`frontend/src/main.ts`、`tests/unit/{contracts,mock,contract-doc}.spec.ts`、`backend/`、`docs/` 下的权威文件、旧 `checklist.md`、spec.md。`specs/README.md` 只由协调集成人改本 feature 那一行。

### 5. 开工闸门（Implement 前逐项核对；任何一项没满足，所有任务都 blocked）

1. v1 Handoff SHA 已登记，并且在 main 上：`git merge-base --is-ancestor <v1HandoffSHA> main`（没填真实 SHA 之前，这条命令无法执行，即闸门未过）。**R3 状态**：已登记 `43b6d79681a49562f41751368b2ae00c24062f56`，`git merge-base --is-ancestor 43b6d79 main` 成立（2026-10-28 R3 只读核对），本闸门的 SHA 子项满足；实施分支从该 SHA 建立的要求见 1.1。
2. checklist-v2 当前有效，且 A 已对新的 Plan / Tasks 完成定向复核。证据三项，均由人工核对并登记：(a) A 定向复核产物的**已提交 SHA**，其审查对象必须是第 1.1 节“A 定向复核”行**当前口径**登记的固定提交（G-02 落实后 Analyze R8 报告落盘的提交），审查范围与范围外断言也按该当前口径（`79b5212..<固定对象>`，只允许文档路径，checklist-v2 对 `425c1fd`）；A R3 时用的历史口径（R5 / R6 修正 + 复跑提交、`ded7161` 起点、checklist-v2 对 `f1f755b`）已执行完毕，不再套用，也不能是 `d1c2133` 或更早的提交；(b) 该产物或 checklist-v2 中 I-01b 与 V-02 的**明确通过记录**（或 A 补设的正式复选框已由 A 勾选）；(c) checklist-v2 的当前有效状态（无阻断、未被后续轮次推翻）。不能用 `git grep "^- \[ \]"` 无输出代替：「阶段说明」不设复选框，审核没发生时同样无输出。A 补记前本闸门未过；实施者不改清单。**当前登记**：A R3 审 `b375b27`，原样产物已提交为 `425c1fd6c639734b0c45ba7cf9259dbee4439074`，R3-C01～C08 全部勾选、0 阻断，是 `b375b27` 的 A 复核证据（历史）。**当前（G-02 落实后）**：本闸门对 `79b5212` 之后的增量重新打开，要等 A R4 按第 1.1 节当前口径审完固定对象（Analyze R8 报告落盘的提交）并提交原样产物后才满足。A R3 证据不覆盖 G-02 设计修改；H-x 前置另计。
3. 本任务用到的每个交接单元都已集成：`git merge-base --is-ancestor <H-x commit> <集成验证分支>`，并且第 1.2 节该行四项登记齐全。
4. Analyze 报告已产出，且内部没有未解决项（人工核对报告结论）。**当前状态：R7**（`analyze-v2-r7.md`，固定审 `217960dafc85bbbf201fb16c4d1ec176ead2b7ec`）确认 R6 的 F-01 / F-02 全部关闭，无新增 P1/P2/P3；R5 的 F-01～F-05 已由 R6 确认关闭。内部分析子项满足。R3 / R4 是作者自查，R5～R7 是恢复合并后的独立只读报告。若后续实质修改 Plan / Tasks，重新 Analyze；本结论不代替闸门 1～3 或 A 定向复核，不授权 Implement。**当前（G-02 落实后）**：R7 只覆盖 `217960d`。本闸门对本次 G-02 设计修改重新打开，要等只读 Analyze R8 报告落盘、并确认没有未解决项后才满足。

### 6. 任务

#### T-V2-01 九项导航、路由与侧栏（S0）

- [ ] **状态**：blocked。blocked_by：G-02 落实修订的 Analyze R8 与 A R4 定向复核（第 5 节闸门 4 / 2，第 1.1 节当前口径）。已满足前置：G-02 人工裁定（2026-10-28，用户本轮回复“可以”）、v1 Handoff `43b6d79`、G-03 主线合并、工作树 / 集成人登记（实施树与集成树均在 `79b5212`），不能再把它们当作未取得的证据。A R3（审 `b375b27`）与 Analyze R7（审 `217960d`）是历史结论，不覆盖本次修改
- **上下文**：
  - 依据：plan §7.4、§7.1；spec R-002、Q-023、Q-027。
  - 作业详情路由只由 H-3 提供，壳只生成名为 `jobs` 的占位路由。
  - 格物致知占位要能追溯归属（V2-S08），但不增加页面功能。
  - 导航的视觉 / 结构决定登记在 `design/ui/UI_NAV.md`（`docs/designUI.md` §3.1 / 第 198 行指定的导航登记处；spec R-008 / §4；AGENTS §4 先改文档再动实现）。移植时写入的暗色适配段仍是 v1 的“八项 + 研究子项”，由本任务同步（F-02）。
- **修改范围**：
  - `design/ui/UI_NAV.md` 暗色适配段：第一条“规定”改为九项（顺序与 plan §7.4 一致：工作台、作业、日报、价格、平衡表、物流、格物致知、知识库、设置），删除“专题研究子项来自 `getResearchList()`”，“为什么”改为“九项固定菜单由 spec R-002 v2 冻结（D-016 / D-018）”；第二条写明窄窗顶部导航为单行，导航容器内部横向滚动，页面不横滚；注明采用 `UI_LAYOUT.md#narrow` 原规则，并写明 Walter 2026-10-28 的 G-02 裁定；“不采用”的原因中“mock 研究列表”改为九项路由；“落点”补 plan §7.4。上方原文快照与 JSON 碎片不改。
  - `design/ui/README.md`：UI_NAV 一行的采用范围改为“旧双台改九项路由（作业 / 格物致知，无专题子项）”。
  - `design/ui/UI_LAYOUT.md`：**不改**。G-02 已裁定为横向滚动，`#narrow`“侧栏塌成顶栏横向滚动”原样采用（原“保持换行时登记不采用”的条件已作废）。
  - `nav.ts`：按 plan §7.4 写九项表；删除 `research`；`learning` 项加一行归属注释：“格物致知 = 学习循环产品区，docs/plan.md §8 Phase 2C；仓库暂无同名 feature；路由 `/learning` 不改”。
  - `router.ts`：仍由 `navItems` 生成；保留 `/daily/:date?`；删除 `/research/:id?` 特例；不定义 `job-detail`。
  - `Rail.vue`：删除专题子列表及其样式，连带删除因此失效的导入与局部变量（`43b6d79` 中 `useAppStore` 导入和 `app` 常量只服务子列表；V2-S10）。当前项判定为 `route.meta.navId === item.id`：同时 `route.name === item.id` 时设 `aria-current="page"`，否则设 `"location"`；全局同一时刻只有一个 `aria-current`。窄于 980 时（plan §7.4，G-02）：把现有 `.rail[data-viewport-collapsed='true'] .nav-list` 的 `flex-wrap: wrap` 改为单行；导航项 `flex: none`，标签 `white-space: nowrap`；`nav.rail-navigation` 设 `min-width: 0`、`overflow-x: auto`，纵向不滚。断点、令牌、当前项底边红条和折叠钮隐藏都不变；不加状态、令牌、overlay、JS 监听或自动滚动。
  - `e2e/shell.spec.ts`：
    - 物理八项菜单表（v1 的 `menu` 常量）改为九项：按 plan §7.4，含 `/jobs`（owner `workbench-interaction`）和 `/learning`（owner `learning`），删除 `/research`。
    - 以该表为参数的旧 `AC-002-2` 菜单用例和直达 / 刷新用例**全部迁移**为九项口径（标题改为 `AC-002-2 v2-nav …`，计数 8 改 9）；不能只新增 v2-nav 用例而保留旧八项用例。
    - 旧「daily 与 research 详情深链」用例：删除 research 部分，保留 daily 深链部分（标题改为 `AC-002-2 v2-nav …`）。
    - 删除 v1 用研究列表注入验证的旧 `AC-002-3` 用例；随之不再使用的 `research.json` 导入一并删除（契约侧 fixture 本身保留，归互动方）。
  - `e2e/shell.spec.ts`（同一文件，新增）：`AC-002-6 v2-nav` 窄窗导航用例，覆盖标准 4。视口宽取令牌 `window.min_width` 与 `breakpoint.shell_collapse - 1`（即 960 / 979），写法同 `breakpoints.spec` 的令牌取值。本任务**不写** T-V2-08 拥有的 `breakpoints.spec.ts`。它现有的窄窗断言（`.nav-list` 为 flex、首末 `.full-label` 可见、文档无横向溢出）不依赖换行，应原样通过。若实施时发现它与单行横滚不兼容，不得在本任务改该文件，要回 Analyze 登记。
  - `e2e/agent.spec.ts`：AC-005-1 的路由集改成九项，标题加 `v2-nav`。
- **依赖**：无（v2 首任务）　**预计**：2 h
- **超时拆分规则（V2-S13，预登记，未触发）**：本任务已到 2 h 上限。实施中如果超过 2 h，把 `design/ui` 登记（修改范围前两项，即 `UI_NAV.md`、`README.md`；`UI_LAYOUT.md` 按 G-02 不改；完成标准 6 / 验证命令 6）拆为 T-V2-01b：0.5 h，依赖 T-V2-01，阻塞项同 T-V2-01；第 4 节 `design/ui` 写入行、第 7 节矩阵 AC-008-1 行、第 9 节工时表同步改指 T-V2-01b。T-V2-02 仍只依赖 T-V2-01。拆分按 AGENTS §2 第 6 步执行（与 v1 尾注同口径），属任务结构变更，须先走定向 Analyze（第 7 步）再继续，不在实施中直接改 tasks 偷跑（第 8 步）；未拆分时本条不生效
- **完成标准**：
  1. 九项顺序和 href 正确；`aria-current` 全局唯一；`/jobs` 占位页的 owner 为 `workbench-interaction`，`/learning` 占位页的 owner 文案含 `learning`；直接打开 `/jobs`、`/learning`、`/prices` 并刷新后仍停留在原页；`/daily/:date` 深链保留；页面中没有 `.research-link`；`shell.spec` 中不再有八项表、旧八项菜单 / 直达用例或 research 深链用例，`AC-002-2` 全前缀选中的用例全部是九项口径且全绿。**其中 `/jobs` 的壳占位 owner 子断言仅作 S0 证据**：H-3 集成后由 T-V2-09#4 迁移为集成态，不再期待壳 owner。满足 AC-002-2 的壳部分；集成部分见 T-V2-09。
  2. 九个导航路由上输入栏都可见；提交后抽屉展开并显示用户消息。满足 AC-005-1。
  3. 加载页到工作台之间无空白帧、侧栏折叠持久化，都没有回归。对应 AC-002-1、AC-002-5 回归。
  4. 在 960 和 979 宽度（窄窗）下：九个 `.fixed-link` 位于同一行，按几何判断（各项 `getBoundingClientRect().top` 相同），不引入导航高度数值；导航容器 `nav.rail-navigation` 计算样式 `overflow-x` 为 `auto`；把容器滚到末端后，最后一项“设置”的矩形落在容器可视矩形内，点击可进入 `/settings`；如果 `scrollWidth > clientWidth`，滚动后 `scrollLeft > 0`；九项放得下时不强制断言溢出；文档无横向溢出（`documentElement.scrollWidth <= clientWidth`、`body.scrollWidth <= innerWidth`）。`breakpoints.spec` 原有各视口断言不回归。对应 AC-002-6（窄窗导航，G-02）。
  5. 派生删除后没有残留的无用导入或局部变量，类型检查和 lint 都通过。对应 AC-009-1（静态打底，不等于全量验收；V2-S10）。
  6. `design/ui/UI_NAV.md` 暗色适配段与 `README.md` 索引行写的是九项导航，不再出现“八项”、`getResearchList`、“研究扩展”或“研究列表”；`UI_NAV.md` 暗色适配段写明窄窗为单行、导航容器内部横向滚动、页面不横滚（G-02，2026-10-28）；`UI_LAYOUT.md` 与 `43b6d79` 相同（未写入）；条目元信息与结构检查不回归。满足 AC-008-1（导航条目登记；依据 spec R-008 正文与 §4 末条“视觉决定登记为令牌与条目”；R5 F-02 / R6 F-02）。
- **验证命令**（1、2 是修改后的测试，实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-2"`（全前缀：同时选中迁移后的用例和任何残留的旧用例）
  2. `pnpm -C frontend test:e2e -g "AC-005-1 v2-nav"`
  3. `pnpm -C frontend test:e2e -g "AC-002-1|AC-002-5"`
  4. `pnpm -C frontend test:e2e -g "AC-002-6"`（全前缀：同时选中 `breakpoints.spec` 的原断点用例和 `shell.spec` 新增的 `AC-002-6 v2-nav` 用例）
  5. `pnpm -C frontend typecheck && pnpm -C frontend lint`
  6. `pnpm -C frontend test:unit -t "AC-008-1"`，再执行 `git grep -nE "八项|getResearchList|研究扩展|研究列表" -- design/ui`（应无输出）和 `git diff --exit-code 43b6d79 -- design/ui/UI_LAYOUT.md`（应无差异）；`UI_NAV.md` 的窄窗形态文字按 1.1 G-02 行人工核对

#### T-V2-02 加载步骤派生修改、顶栏「投放」与人工清单文本（S0）

- [ ] **状态**：blocked。blocked_by：T-V2-01 的全部 blocked_by，即 Analyze R8 / A R4，经 T-V2-01 依赖传递。已满足前置：v1 Handoff `43b6d79`、G-02 人工裁定
- **上下文**：
  - 依据：plan §7.2 中 `stores/app.ts` 的最小派生修改（checklist-v2 I-01 已确认），以及同源的 `PlaceholderPage.vue` 最小派生修改（Analyze R1 F-01 补入，待 A 定向复核确认）、§7.6 入口、§7.12 M-09～M-12。
  - 本任务只让按钮发出 `intake` 事件，**不宣称满足 AC-002-8**。
- **修改范围**：
  - `stores/app.ts`，只做三处修改：
    - 去掉 `getResearchList` 调用和 `research` ref 及其导出；
    - 加载步骤从 4 改为 3，进度分母和“加载完成”的判定同步改；
    - 状态文案改为“正在加载资讯与数据源…”。
    - 以上三处修改的连带清理：删除因此失效的导入（`43b6d79` 中 `ResearchItem` 类型导入；V2-S10），不算第四处修改。
  - `TopBar.vue`：新增文字按钮“投放”，点击时发出 `intake` 事件，组件仍只接收 props。
  - `tests/component/topbar.spec.ts`。
  - `e2e/shell.spec.ts`：AC-002-7 的进度和文案断言按 3 步更新。
  - `manual-acceptance.md`：M-01～M-08 原样保留；追加 M-09～M-12。其中 M-09 写明“格物致知（learning，Phase 2C）占位注明归属”，以及“窄窗（960）九项单行、在导航内部横滚、页面不横滚”（plan §7.12，G-02）。
  - `tests/unit/manual-acceptance.spec.ts`。
  - `pages/PlaceholderPage.vue`：只删除按 `route.meta.navId === 'research'` 读取 `app.research` 的标题分支，标题直接取 `route.meta.title`；连带删除因此失效的 `useAppStore` 导入和 `app` 常量（V2-S10）；占位文案、`data-placeholder-owner` 和 daily 日期展示不变。
- **依赖**：T-V2-01　**预计**：2 h
- **完成标准**：
  1. 加载进度按 3 步计算，状态文案不含“研究列表”；`boot-error` 的重试路径不变。满足 AC-002-7。
  2. 原有的 ticker 和状态点断言保留；“投放”按钮可见、文案为“投放”、点击发出 `intake` 事件。满足 AC-002-4。
  3. 人工清单有 M-01～M-12，每项都写了“看什么”，测试与清单同步。满足 AC-009-2 的文本部分。
  4. `PlaceholderPage.vue` 的 research 标题分支已删除（标题直接取 `route.meta.title`，占位文案与 daily 日期展示不变）；删掉 `app.research` 导出后，没有残留的无用导入，类型检查和 lint 都通过。对应 AC-002-7（派生修改）与 AC-009-1（静态打底，不等于全量验收）；A R2 已确认这项派生修改（R2-C02 F-01），lint 部分按 V2-S10 补入。
- **验证命令**（都要实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-7"`
  2. `pnpm -C frontend test:unit -t "AC-002-4"`
  3. `pnpm -C frontend test:unit -t "AC-009-2"`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

#### T-V2-03 对话上下文：store 捕获、绑定与按作业查看（S1-ctx）

- [ ] **状态**：blocked。blocked_by：H-1、H-4；条件依赖 H-3·路由切片（H-4 交接登记写明 context 只能由路由守卫设置时）。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：plan §7.7、§7.10 第 3、4 条；V2-S06。
- **修改范围**：
  - `agent/store.ts`：
    - `send` 在第一个 `await` 之前，同步读取 `useSessionStore().context` 的快照。`useSessionStore()` **只在 `send` 函数体内调用**，不在模块顶层调用，以免与 `jobs/**` 互相导入时形成初始化循环；不为此加抽象。
    - 有上下文时 payload 带 `jobContext`；没有时 payload 里不出现这个键。
    - `AgentRun.jobContext?` 由 `run.started` 事件写入，之后不再变化。
    - `receive` 不过滤、不丢弃事件。
    - 新增 `runsFor(jobId?)`。
    - 模块角标、`running` 指示和“每个 run 恰好一个终态”的规则都不变。
  - 新建 `tests/unit/agent-context.spec.ts`：
    - 用真实 Pinia、真实 mock `agentClient` 和 fake timers。
    - `sessionStore` 只用 H-4 交接的公开方式设置；如果它只能由路由守卫设置，就用真实 router 加互动方的 routes 导航来设置（此时本任务条件依赖 H-3·路由切片）。不添加测试专用 setter 或抽象，壳不写 sessionStore。
    - payload 只在系统边界对 `agentClient.send` 做透传 spy：调用原实现、不改返回值。
    - 交错回放时直接调用三次 mock `agentClient.send`（作业 A、作业 B、无上下文各一次），不改动 store 的“运行中禁止再发”规则。
- **依赖**：T-V2-02　**预计**：2 h
- **完成标准**：
  1. 发送时取到快照；没有上下文时（包括 `sessionStore` 从某个作业变成 null 之后），payload 里没有 `jobContext` 键；run 的归属来自 `run.started`；之后 `sessionStore` 变化不影响已有的 run；同时导入 store 和 jobs 模块时不出现循环。满足 AC-005-8 的单元部分。
  2. 交错回放作业 A、作业 B 和无上下文 run：`runsFor('A')` 只含 A 的 run，`runsFor()` 含全部 run；`receive` 收到全部事件；模块角标不变；每个 run 恰好一个终态。满足 AC-005-9 的 store 部分。
  3. success / failure / retry / long 四份无上下文脚本和事件契约都照旧通过。对应 AC-005-6 回归；契约测试由互动方维护，壳只运行。
- **验证命令**（1、2 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-005-8 v2-ctx-store"`
  2. `pnpm -C frontend test:unit -t "AC-005-9 v2-ctx-store"`
  3. `pnpm -C frontend test:unit -t "AC-005-6"`

#### T-V2-04 对话上下文展示：chip 与“查看”选择器（S1-ctx）

- [ ] **状态**：blocked。blocked_by：H-1、H-4、H-2·标签（只需 `StageLabel`）；经 T-V2-03 继承 H-3·路由切片的条件依赖（H-4 交接登记写明 context 只能由路由守卫设置时；V2-S12）。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：plan §7.7 的展示部分。两档高度和 `fai.drawer` 都不变。
- **修改范围**：
  - `AgentDock.vue`：输入栏 chip。有上下文时显示“作业 {jobId} · {StageLabel}”，没有时显示“全局”。
  - `CotTimeline.vue`：每个 run 头部显示 chip，全局 run 显示“全局”。
  - `AgentDrawer.vue`：页头新增“查看：全部 / 作业 X”选择器。选项来自 runs 中出现过的 `jobId`；选择结果只存在组件本地 ref，不持久化；通过 `runsFor` 实现，只影响展示。
  - `tests/component/timeline.spec.ts`。
- **依赖**：T-V2-03　**预计**：2 h
- **完成标准**：
  1. 输入栏 chip 和 run 头 chip 正确，全局 run 显示“全局”；选择器的选项、筛选结果和“不持久化”都正确；筛选不影响 `receive`、模块角标和 `running`。满足 AC-005-9 的展示部分。
  2. 时间线的展开 / 收起、`step.error` 和唯一终态行都没有回归。对应 AC-005-2 回归。
  3. 后台运行、模块角标、引导跳转、抽屉两档高度和运行中指示都没有回归。对应 AC-005-3、AC-005-4、AC-005-5、AC-005-7 回归。
- **验证命令**（1 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-005-9 v2-ctx-ui"`
  2. `pnpm -C frontend test:unit -t "AC-005-2"`
  3. `pnpm -C frontend test:e2e -g "AC-005-3|AC-005-4|AC-005-5|AC-005-7"`

#### T-V2-05 作业轨道：卡片、共享缓存与跳转（S1-track）

- [ ] **状态**：blocked。blocked_by：H-2·标签（含 `JobTypeLabel`、`JobStatusBadge`）、H-2·列表（含随交接登记的写 action）、H-3·路由切片、H-6。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：
  - 依据：plan §7.5；V2-S02、S04、S07。
  - 具名路由 `job-detail` 要等 H-3 路由切片集成后才存在。在此之前本任务 blocked，不加 `hasRoute` 兜底，也不演示未集成的界面。
- **修改范围**：
  - 新建 `workbench/JobTrack.vue`：
    - 容器是透明行；卡片复用 `.glass-module`，不用 `section.fai-module`；卡片在轨道内 `overflow-x: auto`；高度固定一行；不引用 `updown.css`；不写颜色字面量。
    - 卡片显示标题和 `JobTypeLabel`；四阶段按固定顺序排列，每段显示 `StageLabel` 加 `StageStateLabel` 的图标和文案；`pendingCount > 0` 时显示“待介入 N”；作业状态复用 `JobStatusBadge`。
    - 卡片集合 = H-2 的“进行中”selector 或常量作用在未筛选缓存上的结果；不从阶段状态推断，不持有数据副本。
    - 挂载时调用共享 ensure/load。
    - 点击执行 `router.push({name:'job-detail', params:{id, stage: currentStage}})`。
  - `WorkbenchPage.vue`：顺序为页头 → FocusBand → JobTrack → ModuleGrid，ModuleGrid 仍是唯一纵向滚动区。
  - 新建 `tests/component/job-track.spec.ts`：用真实 Pinia、互动方真实 `jobsStore`、真实 mock `dataClient`，加上真实 router 和互动方的 routes。
- **依赖**：T-V2-02　**预计**：2 h
- **完成标准**：
  1. 卡片的名称、类型文案、四阶段顺序、状态文案和图标、“待介入”角标都正确，状态不只靠颜色区分。按 V2-S02 的最低口径：fixture 里“等待人工确认”和“存在冲突待介入”的作业在轨道中，终结态作业不在；具体枚举以生产方 CONTRACT.md 的登记为准，用明确的 fixture id 断言，不在测试里重写判定逻辑。满足 AC-003-7 的组件部分（卡片）。
  2. 关键用例：轨道保持挂载，`agent.runs` 中没有终态，调用随 H-2·列表交付、在第 1.2 节登记的那个写 action（名称以交接 SHA 为准；不调用 inbox 或 H-5 的 action；未交付则本任务 blocked）后，“待介入 N”、卡片集合或顺序自动变化，并与 store 列表 selector 中同一作业的值一致；测试不调用手动重读。满足 AC-003-7 的组件部分（共享缓存）。
  3. 点击卡片后，路由跳到 `job-detail`，参数为 `{id, currentStage}`；壳不推进阶段，也不改作业状态。满足 AC-003-7 的组件部分（跳转）。
  4. 仓库六项检查都通过，并覆盖新文件：colors、glass、updown、grid、network、generated。对应 AC-001-2、AC-001-3、AC-001-5、AC-004-6、AC-007-1 回归。
- **验证命令**（1～3 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-003-7 v2-track card"`
  2. `pnpm -C frontend test:unit -t "AC-003-7 v2-track shared"`
  3. `pnpm -C frontend test:unit -t "AC-003-7 v2-track nav"`
  4. `pnpm -C frontend check`

#### T-V2-06 作业轨道：三态与固定件位置（S1-track）

- [ ] **状态**：blocked。blocked_by：同 T-V2-05（其中 H-6 须含 `jobFixtures` 替换整个作业样例集合的能力）。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：plan §7.5 的三种状态；V2-S03。
- **修改范围**：
  - `JobTrack.vue`：
    - 加载态沿用 v1 的 Loading。
    - 空态分两种静态文案，不加 `reason` 字段：
      - 缓存为空时显示“暂无作业”，原因“还没有创建任何作业”；
      - 缓存非空但没有进行中作业时显示“暂无进行中的作业”，原因“现有作业均不在进行中”；
      - 两种都提供“前往作业”链接到 `/jobs`。
    - 错误态沿用 ErrorState，诊断信息为 `{source:'job-track', code, message, ts}`，可以复制；重试调用共享 refresh。
  - `job-track.spec.ts`（追加）。
  - `e2e/workbench.spec.ts`、`e2e/modules.spec.ts`。
  - 第二种空态的测试：用 H-6 交付的 `jobFixtures` 替换能力，把作业样例集合整体替换为只含非进行中作业的列表。替换能力未交付时，本任务整体 blocked（同 T-V2-05 的 H-6 依赖）；壳不自建或代写 fixture。
- **依赖**：T-V2-05　**预计**：2 h
- **完成标准**：
  1. `slow` 场景出现加载态；两种空态的文案正确，都有 `/jobs` 入口；`error` 场景的诊断可以复制，重试调用共享 refresh；三种状态下焦点带和模块区都能独立渲染。满足 AC-003-9。
  2. DOM 顺序为 Focus → Track → Grid；模块库中没有轨道；轨道没有移除、上移或下移操作；增删、移动模块并刷新后，轨道位置不变。满足 AC-003-8。
  3. 增删模块后，焦点带和轨道都还在。对应 AC-003-6 回归扩充。
  4. 默认七个模块、模块库、顺序持久化都没有回归；页面遍历时不把轨道卡片当成模块。对应 AC-004-1、AC-004-2、AC-004-3（页面部分）回归。
- **验证命令**（1、2 是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:unit -t "AC-003-9 v2-track-state"`
  2. `pnpm -C frontend test:e2e -g "AC-003-8 v2-track-state"`
  3. `pnpm -C frontend test:e2e -g "AC-003-6"`
  4. `pnpm -C frontend test:e2e -g "AC-004-1|AC-004-2|AC-004-3 page"`

#### T-V2-07 全局投放挂载、几何令牌与对话抽屉避让（S1-intake）

- [ ] **状态**：blocked。blocked_by：H-4、H-5；另外因为和 T-V2-04 同写 `AgentDrawer.vue` 而串行，继承 H-1 和 H-2·标签，并经 T-V2-04 → T-V2-03 继承 H-3·路由切片的条件依赖（V2-S12）。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：plan §7.6、§7.10 第 1 条。
- **修改范围**：
  - `tokens.json`：新增 `layout.intake_width`，值在实施时确定（建议 `24rem`），`source` 为 `design/ui/UI_DARK_ADDITIONS.md#drawer`。
  - `UI_DARK_ADDITIONS.md`：在 `#drawer` 段补一条记录。
  - 运行 `pnpm -C frontend tokens` 重新生成 `generated/*` 和 index.html 首帧块，不手改生成物。
  - `AppShell.vue`：
    - 第二行改为 `.route-area { position: relative; min-height: 0 }`，里面放 `main.route-view` 和 `aside.intake-slot v-if="intake.isOpen"`。
    - `.intake-slot` 绝对定位在右侧整高，宽度 `min(var(--fai-layout-intake-width), 50%)`，`z-index` 用 `var(--fai-z-drawer)`；不加遮罩、焦点锁或 `aria-modal`。
    - 用 `tabindex="-1"`：打开时焦点移入 slot，关闭时焦点回到“投放”按钮。
    - 处理 `intake` 事件：调用 `intake.open(session.context?.jobId)`，打开时快照一次。
    - 在 `.content` 上设置 `--shell-intake-offset`。
    - 整个应用只有这一个挂载点；不碰 agent store。
  - `AgentDrawer.vue`：只把定位改为 `inset-inline: 0 var(--shell-intake-offset, 0)`。不改 `ui.drawer` 和 `fai.drawer`，不引入 overlay 管理器。
- **依赖**：T-V2-02、T-V2-04　**预计**：2 h
- **完成标准**：
  1. 新令牌已登记，重新生成后与生成物一致。对应 AC-001-1。
  2. 新令牌的 `source` 能解析到条目锚点。对应 AC-008-2。
  3. slot 不带玻璃样式，没有第四层玻璃，没有颜色字面量。对应 AC-001-2、AC-001-3。
  4. 为 AC-002-8 提供唯一挂载点的实现，类型检查和 lint 通过。**本任务不宣称满足 AC-002-8**：AC-002-8 在 T-V2-10 验收，双抽屉几何在 T-V2-08 验证。
- **验证命令**：
  1. `pnpm -C frontend tokens && pnpm -C frontend check --only generated`
  2. `pnpm -C frontend test:unit -t "AC-008-2"`
  3. `pnpm -C frontend check --only glass && pnpm -C frontend check --only colors`
  4. `pnpm -C frontend typecheck && pnpm -C frontend lint`

#### T-V2-08 断点回归：轨道与双抽屉（S1 汇合）

- [ ] **状态**：blocked。blocked_by：T-V2-06 和 T-V2-07 的全部 blocked_by 合并。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：plan §7.11 AC-002-6；M-10、M-11。
- **修改范围**：`e2e/breakpoints.spec.ts`。
- **依赖**：T-V2-06、T-V2-07　**预计**：1 h
- **完成标准**：
  1. 在 960、979、981、1239、1241、1399、1401、1499、1501 和 1440×900 这 10 个视口下，原来对侧栏、栅格和焦点带卡数的断言不变；轨道都存在，且文档没有横向溢出。对应 AC-002-6（轨道部分）。
  2. 在 960 和 1440×900 下同时打开投放抽屉和对话抽屉：两个面板并排，没有溢出，底部输入栏始终可见。对应 AC-002-6（双抽屉部分）。
- **验证命令**（都是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-6 v2-bp track"`
  2. `pnpm -C frontend test:e2e -g "AC-002-6 v2-bp dual"`

#### T-V2-09 集成 e2e（一）：作业路由、列表与对话上下文（S2）

- [ ] **状态**：blocked。blocked_by：H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-6（另经依赖继承 H-5）。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：plan §7.11 中 AC-002-2、AC-002-3、AC-005-8 的集成部分；V2-S05；Analyze R1 F-03。
  - `shell.spec` 中 `/jobs` 的壳占位子断言（T-V2-01#1）在 H-3 路由切片集成后失效，由本任务迁移。H-3 集成到本任务完成之间，不以 `-g "AC-002-2"` 全前缀或全量运行作为证据。
  - 这个窗口内，集成验证分支上的每次提交信息，以及 Converge 报告、review.md，都要写一句“已知红：`shell.spec` `/jobs` 占位子断言，待 T-V2-09 迁移”，不能把它当作回归或证据（V2-S11）。窗口由集成人在 H-3 集成时开启，在本任务的标准 4 通过后关闭。
- **修改范围**：
  - 新建 `e2e/integration-v2.spec.ts`，本任务是创建者，T-V2-10 之后串行追加。
  - `e2e/shell.spec.ts`：只把 `/jobs` 的壳占位子断言（owner、占位文案和占位标题）迁移为集成态断言：`/jobs` 由互动方列表页渲染（标题与内容以交接 SHA 的实际页面为准），“作业”项 `aria-current="page"`，不再期待壳 owner。其余菜单、直达刷新和 daily 深链断言不动。
- **依赖**：T-V2-08　**预计**：2 h
- **完成标准**：
  1. 直接打开 `/jobs/:id/:stage` 并刷新，“作业”项为 `aria-current="location"`。名为 `jobs` 的路由只有一条：用 v1 Handoff SHA 中已有的 mock 测试钩子读取 router；如果钩子不暴露 router，就以“`/jobs` 渲染的是互动方列表、且没有壳占位的 owner 文案”作为等价断言。不为此修改 `main.ts`，也不新增钩子。满足 AC-002-2 的集成部分。
  2. 通过 `window.__FAI_MOCK__` 的 `jobFixtures` 新增一项作业，它在 `/jobs` 可见，并能进入详情。满足 AC-002-3。
  3. 按以下步骤验证上下文：
     - 用 addInitScript 固定 `agentScript=long`，打开 `/jobs/:id/analyze` 并发送；输入栏 chip 和 run 头 chip 都显示该作业和“分析”。
     - 切到 `deliver`，再切到 `/prices`；原 run 的 chip 和 runId 都不变。
     - **显式等待原 `long` run 出现唯一终态、输入栏运行中指示消失**；超时设为脚本时长加余量，不用固定 sleep。
     - 做一次全局发送；输入栏 chip 和新 run 头 chip 都显示“全局”，新 run 不带作业标识。H-1 的 mock 会把 payload 上下文原样写进事件，所以新 run 没有上下文，就证明 payload 没有沿用旧的 `jobContext`；payload 中没有该键由 T-V2-03 直接断言。

     满足 AC-005-8 的端到端部分。
  4. `shell.spec` 的 `/jobs` 子断言已迁移为集成态（互动方列表页渲染、“作业”项 `aria-current="page"`、不再期待壳占位 owner）；旧 `AC-002-2` 全前缀（`shell.spec` 的九项菜单 / 直达 / daily 深链用例，加 `integration-v2` 的集成用例）在集成验证分支上全绿。对应 AC-002-2（壳部分集成态回归 + 集成部分）。
- **验证命令**（1～3 是新增测试，4 是迁移后的回归；都要实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-2 v2-int-nav"`
  2. `pnpm -C frontend test:e2e -g "AC-002-3 v2-int-nav"`
  3. `pnpm -C frontend test:e2e -g "AC-005-8 v2-int-ctx"`
  4. `pnpm -C frontend test:e2e -g "AC-002-2"`

#### T-V2-10 集成 e2e（二）：全局投放与轨道一致性（S2）

- [ ] **状态**：blocked。blocked_by：同 T-V2-09，另加 H-5 和页面切片中的 `IntakeDrawer` 流程。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：plan §7.11 中 AC-002-8、AC-003-7 的集成部分；§7.10 第 2 条。
- **修改范围**：`e2e/integration-v2.spec.ts`（追加）。
- **依赖**：T-V2-09　**预计**：2 h
- **完成标准**：
  1. 在 `/workbench`、`/jobs`、`/jobs/:id/:stage` 和 `/prices` 点“投放”，都出现同一个 `.intake-slot`，且只有一个。在作业详情页打开时，`IntakeDrawer` 显示的归属是当前作业（按 H-5 交接时登记的可见标识断言）；在其他页面打开时没有归属。在 `long` run 运行中打开再关闭投放：URL 不变，runId 不变，步骤继续增加且不重复，焦点回到按钮。满足 AC-002-8。
  2. 在工作台打开投放，把材料归属到一个进行中的作业，期间轨道不卸载。之后：
     - 轨道的角标和顺序更新；
     - `/jobs` 里进行中项的集合、顺序和待介入数与轨道一致；
     - 在列表页应用筛选后回到工作台，轨道仍一致（H-2 ④）；
     - 点击卡片进入 `/jobs/:id/<currentStage>`。

     满足 AC-003-7 的集成部分。
  3. 整个集成文件一起运行时用例互不干扰。对应 AC-002-2、AC-002-3、AC-002-8、AC-003-7、AC-005-8 的集成部分合跑。
- **验证命令**（都是新增测试，实施后才能执行）：
  1. `pnpm -C frontend test:e2e -g "AC-002-8 v2-int-intake"`
  2. `pnpm -C frontend test:e2e -g "AC-003-7 v2-int-track"`
  3. `pnpm -C frontend test:e2e e2e/integration-v2.spec.ts`

#### T-V2-11 静态、运行时与 52 条 AC 回归（含 AC-007-5 参与证据）

- [ ] **状态**：blocked。blocked_by：全部交接单元，以及 T-V2-10。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：
  - 依据：plan §7.11 中“不变 + v2 回归”的各条。
  - 只在集成验证分支的 SHA 上运行。
  - 默认不改代码。回归失败时：如果在壳的文件里，只能在第 4 节已列的壳文件内修复，并在 review.md 记录；如果在生产方文件里，退回生产方，壳不代修。
- **修改范围**：没有新增修改；修复限于第 4 节的壳文件。
- **依赖**：T-V2-10　**预计**：1.5 h
- **完成标准**：
  1. 六项仓库检查全部通过，新文件和新令牌都已纳入。对应 AC-001-1、AC-001-2、AC-001-3、AC-001-5、AC-001-6、AC-004-6、AC-007-1、AC-007-3（generated 对拍）。
  2. 运行时令牌对拍、计算字体族、`.sem-market` 的位置都没有回归。对应 AC-001-1、AC-001-4、AC-001-5 的运行时部分。
  3. 格式化、字族和 `Num` 语义类都没有回归。对应 AC-001-4、AC-001-5 的单元 / 组件部分。
  4. 焦点带的结论、跳转、空态、取色和两段分隔都没有回归。对应 AC-003-1、AC-003-2、AC-003-3、AC-003-4、AC-003-5。
  5. 模块壳结构、三态和代表模块的形态都没有回归。对应 AC-004-3、AC-004-4、AC-004-5。
  6. 主题、对比度、样例图颜色和透明背景都没有回归。对应 AC-006-1、AC-006-2、AC-006-3、AC-006-4。
  7. 场景切换、契约文档和数值元数据都没有回归；2.0.0 生成物由生产方重新生成，壳只回归。对应 AC-007-2、AC-007-3、AC-007-4。
  8. AC-007-5：第 1.2 节 H-1 行的生产方证据齐全，包括已提交的有效 Checklist SHA 和定向测试摘要；在集成 SHA 上，生产方的三份契约测试全绿，作为壳的参与回归。**壳不代做、不代勾**；证据缺失时本项 blocked。
  9. 规范资产登记、令牌来源和暗色配色表都没有回归。对应 AC-008-1、AC-008-2、AC-008-3。
- **验证命令**：
  1. `pnpm -C frontend check`
  2. `pnpm -C frontend test:e2e -g "AC-001-1|AC-001-4|AC-001-5"`
  3. `pnpm -C frontend test:unit -t "AC-001-4|AC-001-5"`
  4. `pnpm -C frontend test:unit -t "AC-003-1|AC-003-3|AC-003-4|AC-003-5" && pnpm -C frontend test:e2e -g "AC-003-2"`
  5. `pnpm -C frontend test:unit -t "AC-004-3|AC-004-4|AC-004-5" && pnpm -C frontend test:e2e -g "AC-004-4"`
  6. `pnpm -C frontend test:unit -t "AC-006-1|AC-006-2" && pnpm -C frontend test:e2e -g "AC-006-3|AC-006-4"`
  7. `pnpm -C frontend test:unit -t "AC-007-2|AC-007-3|AC-007-4" && pnpm -C frontend test:e2e -g "AC-007-2"`
  8. `pnpm -C frontend test:unit tests/unit/contracts.spec.ts tests/unit/mock.spec.ts tests/unit/contract-doc.spec.ts`
  9. `pnpm -C frontend test:unit -t "AC-008-1|AC-008-2|AC-008-3"`

#### T-V2-12 全量命令与人工验收截图收口

- [ ] **状态**：blocked。blocked_by：同 T-V2-11。已满足前置：v1 Handoff `43b6d79`（V2-S14）。全体共同前置：G-02 增量的 Analyze R8 / A R4（第 5 节闸门 2 / 4）
- **上下文**：
  - 依据：plan §7.12；spec R-009。
  - 只有集成验证分支上的全量结果才算 v2 证据。
  - 证据摘要和截图交给 Handoff 时的 review.md；截图的存放路径沿用 v1 Handoff 时的约定。
- **修改范围**：截图证据文件。不改 manual-acceptance.md 正文：如果发现文本与实现不符，回 Analyze 另行登记。
- **依赖**：T-V2-11　**预计**：1.5 h
- **完成标准**：
  1. 一条命令跑完 `check + typecheck + lint + test:unit + test:e2e`，全部通过。对应 AC-009-1。
  2. 人工清单与测试同步，共 M-01～M-12。对应 AC-009-2 的文本部分。
  3. 在 10 个视口下，按 M-01～M-12 逐项截图，作为 AC-009-2 的截图证据。截图同时覆盖：
     - AC-001-3（M-01）、AC-003-5（M-03）、AC-004-5（M-04）、AC-006-4（M-08）的人工部分；
     - M-09 导航（AC-002-2）、M-10 轨道（AC-003-7、AC-003-8、AC-003-9、AC-002-6）、M-11 投放（AC-002-8、AC-002-6）、M-12 上下文（AC-005-8、AC-005-9）的视觉检查。
- **验证命令**：
  1. `pnpm -C frontend test`
  2. `pnpm -C frontend test:unit -t "AC-009-2"`
  3. 人工：执行 `pnpm -C frontend dev`，然后按 `specs/frontend-workbench/manual-acceptance.md` 的 M-01～M-12 逐项截图

### 7. 52 条 AC 的任务 / 验证矩阵

命令前缀 `pnpm -C frontend` 已省略；“T-V2-xx#n”表示该任务的第 n 条完成标准及其对应的验证命令。类型说明：
- **复用+回归**：沿用 v1 实现，v2 只做回归；
- **修改**、**新增**：需要 v2 实现；
- **集成**：需要互动方交接后才能验证；
- **生产方证据**：由互动方提供，壳不代勾。

| AC | 类型 | 任务#标准 | 验证命令 |
|---|---|---|---|
| AC-001-1 | 复用+回归（新令牌纳入对拍） | T-V2-07#1；T-V2-11#1、#2 | `tokens && check --only generated`；`check`；`test:e2e -g "AC-001-1\|AC-001-4\|AC-001-5"` |
| AC-001-2 | 复用+回归（扫描覆盖新文件） | T-V2-05#4；T-V2-07#3；T-V2-11#1 | `check`；`check --only glass && check --only colors`；`check` |
| AC-001-3 | 复用+回归；人工 M-01 | T-V2-05#4；T-V2-07#3；T-V2-11#1；T-V2-12#3 | `check`；`check --only glass && …`；`check`；人工截图 |
| AC-001-4 | 复用+回归 | T-V2-11#2、#3 | `test:e2e -g "AC-001-1\|AC-001-4\|AC-001-5"`；`test:unit -t "AC-001-4\|AC-001-5"` |
| AC-001-5 | 复用+回归（轨道不得引用 updown） | T-V2-05#4；T-V2-11#1、#2、#3 | `check`；同上两条 |
| AC-001-6 | 复用+回归 | T-V2-11#1 | `check` |
| AC-002-1 | 复用+回归 | T-V2-01#3 | `test:e2e -g "AC-002-1\|AC-002-5"` |
| AC-002-2 | 修改；部分集成 | T-V2-01#1（壳部分，S0）；T-V2-09#1（集成部分）、T-V2-09#4（`/jobs` 子断言迁移为集成态 + 全前缀回归）；T-V2-10#3；人工 M-09 | `test:e2e -g "AC-002-2"`；`test:e2e -g "AC-002-2 v2-int-nav"`；`test:e2e -g "AC-002-2"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-002-3 | 修改；集成 | T-V2-09#2；T-V2-10#3 | `test:e2e -g "AC-002-3 v2-int-nav"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-002-4 | 修改（新增按钮） | T-V2-02#2 | `test:unit -t "AC-002-4"` |
| AC-002-5 | 复用+回归 | T-V2-01#3 | `test:e2e -g "AC-002-1\|AC-002-5"` |
| AC-002-6 | 复用+回归扩充；S0 窄窗导航单行 + 容器内横滚（G-02） | T-V2-01#4（`shell.spec` 新增 `AC-002-6 v2-nav`，并回归 `breakpoints.spec` 原断言）；T-V2-08#1、#2；人工 M-09、M-10、M-11 | `test:e2e -g "AC-002-6"`；`test:e2e -g "AC-002-6 v2-bp track"`；`test:e2e -g "AC-002-6 v2-bp dual"` |
| AC-002-7 | 复用，回归更新为 3 步 | T-V2-02#1；T-V2-02#4（`PlaceholderPage.vue` 派生修改的类型检查与 lint） | `test:e2e -g "AC-002-7"`；`typecheck && lint` |
| AC-002-8 | 新增；集成 | T-V2-07#4（只提供实现，不验收）；T-V2-10#1、#3；人工 M-11 | `typecheck && lint`；`test:e2e -g "AC-002-8 v2-int-intake"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-003-1 | 复用+回归 | T-V2-11#4 | `test:unit -t "AC-003-1\|AC-003-3\|AC-003-4\|AC-003-5" && test:e2e -g "AC-003-2"` |
| AC-003-2 | 复用+回归 | T-V2-11#4 | 同上 |
| AC-003-3 | 复用+回归 | T-V2-11#4 | 同上 |
| AC-003-4 | 复用+回归 | T-V2-11#4 | 同上 |
| AC-003-5 | 复用+回归；人工 M-03 | T-V2-11#4；T-V2-12#3 | 同上；人工截图 |
| AC-003-6 | 复用+回归扩充（轨道仍在） | T-V2-06#3 | `test:e2e -g "AC-003-6"` |
| AC-003-7 | 新增；部分集成 | T-V2-05#1、#2、#3（组件部分）；T-V2-10#2、#3（集成部分）；人工 M-10 | `test:unit -t "AC-003-7 v2-track card"`；`… shared`；`… nav`；`test:e2e -g "AC-003-7 v2-int-track"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-003-8 | 新增 | T-V2-06#2；人工 M-10 | `test:e2e -g "AC-003-8 v2-track-state"` |
| AC-003-9 | 新增 | T-V2-06#1；人工 M-10 | `test:unit -t "AC-003-9 v2-track-state"` |
| AC-004-1 | 复用+回归 | T-V2-06#4 | `test:e2e -g "AC-004-1\|AC-004-2\|AC-004-3 page"` |
| AC-004-2 | 复用+回归 | T-V2-06#4 | 同上 |
| AC-004-3 | 复用+回归（轨道卡片不算模块） | T-V2-06#4；T-V2-11#5 | 同上；`test:unit -t "AC-004-3\|AC-004-4\|AC-004-5" && test:e2e -g "AC-004-4"` |
| AC-004-4 | 复用+回归 | T-V2-11#5 | 同上 |
| AC-004-5 | 复用+回归；人工 M-04 | T-V2-11#5；T-V2-12#3 | 同上；人工截图 |
| AC-004-6 | 复用+回归（覆盖轨道样式） | T-V2-05#4；T-V2-11#1 | `check` |
| AC-005-1 | 修改（九个路由） | T-V2-01#2 | `test:e2e -g "AC-005-1 v2-nav"` |
| AC-005-2 | 复用+回归 | T-V2-04#2 | `test:unit -t "AC-005-2"` |
| AC-005-3 | 复用+回归 | T-V2-04#3 | `test:e2e -g "AC-005-3\|AC-005-4\|AC-005-5\|AC-005-7"` |
| AC-005-4 | 复用+回归 | T-V2-04#3 | 同上 |
| AC-005-5 | 复用+回归 | T-V2-04#3 | 同上 |
| AC-005-6 | 复用+回归 | T-V2-03#3 | `test:unit -t "AC-005-6"` |
| AC-005-7 | 复用+回归 | T-V2-04#3 | `test:e2e -g "AC-005-3\|AC-005-4\|AC-005-5\|AC-005-7"` |
| AC-005-8 | 新增；部分集成 | T-V2-03#1（单元部分）；T-V2-09#3、T-V2-10#3（端到端部分）；人工 M-12 | `test:unit -t "AC-005-8 v2-ctx-store"`；`test:e2e -g "AC-005-8 v2-int-ctx"`；`test:e2e e2e/integration-v2.spec.ts` |
| AC-005-9 | 新增 | T-V2-03#2；T-V2-04#1；人工 M-12 | `test:unit -t "AC-005-9 v2-ctx-store"`；`test:unit -t "AC-005-9 v2-ctx-ui"` |
| AC-006-1 | 复用+回归 | T-V2-11#6 | `test:unit -t "AC-006-1\|AC-006-2" && test:e2e -g "AC-006-3\|AC-006-4"` |
| AC-006-2 | 复用+回归 | T-V2-11#6 | 同上 |
| AC-006-3 | 复用+回归 | T-V2-11#6 | 同上 |
| AC-006-4 | 复用+回归；人工 M-08 | T-V2-11#6；T-V2-12#3 | 同上；人工截图 |
| AC-007-1 | 复用+回归（network 守卫覆盖新文件） | T-V2-05#4；T-V2-11#1 | `check` |
| AC-007-2 | 复用+回归 | T-V2-11#7 | `test:unit -t "AC-007-2\|AC-007-3\|AC-007-4" && test:e2e -g "AC-007-2"` |
| AC-007-3 | 复用；2.0.0 文档由生产方重新生成，壳回归 | T-V2-11#1、#7 | `check`；同上 |
| AC-007-4 | 复用；fixture 由生产方维护，壳回归 | T-V2-11#7 | 同上 |
| AC-007-5 | 新增；**生产方证据** | 第 1.2 节 H-1 行登记；T-V2-11#8（参与回归，不代勾） | `test:unit tests/unit/contracts.spec.ts tests/unit/mock.spec.ts tests/unit/contract-doc.spec.ts` |
| AC-008-1 | 复用+回归；`design/ui` 导航条目同步（`UI_NAV` 九项 + 窄窗单行内部横滚；`UI_LAYOUT` 不改） | T-V2-01#6；T-V2-11#9 | `test:unit -t "AC-008-1"` + `git grep`（应无输出）+ `git diff --exit-code 43b6d79 -- design/ui/UI_LAYOUT.md`；`test:unit -t "AC-008-1\|AC-008-2\|AC-008-3"` |
| AC-008-2 | 复用+v2（新令牌的 source） | T-V2-07#2；T-V2-11#9 | `test:unit -t "AC-008-2"`；同上 |
| AC-008-3 | 复用+回归 | T-V2-11#9 | 同上 |
| AC-009-1 | 复用（只认集成后的全量结果） | T-V2-01#5、T-V2-02#4（静态打底，不算验收）；T-V2-12#1 | `typecheck && lint`；`typecheck && lint`；`test` |
| AC-009-2 | 复用+扩充（M-09～M-12） | T-V2-02#3；T-V2-12#2、#3 | `test:unit -t "AC-009-2"`；人工截图 |

### 8. V2-S01～S09 落实

| 建议 | 处理 | 落实位置 |
|---|---|---|
| V2-S01 | 接受 | 第 1.2 节登记表要求填固定 commit、已提交的有效 Checklist SHA 和定向测试摘要；不以 `8bd1b31` 的旧 R2 或移动工作树中的 R3/R4 作为证据。README 第 33 行已登记 H-2/H-4/H-5/H-6 的新增要求。本 Tasks 新细化了三点：`JobStatusBadge` 随 H-2 交付；H-2 标签可先供 S1-ctx；H-3 路由切片可先供 S1-track。这三点是交接范围的细化，已随本 Tasks 落盘补入 README 同一行 |
| V2-S02 | 接受 | plan §7.3 H-2 ③ 小改；T-V2-05#1：“等待人工确认”和“存在冲突待介入”的作业在集合内，终结态不在；具体枚举由生产方的契约常量定义并登记进 CONTRACT.md |
| V2-S03 | 接受 | plan §7.5 空态和 §7.11 AC-003-9 小改；T-V2-06：两种静态文案，不加 `reason` 字段 |
| V2-S04 | 接受，采用“列依赖”方案，不改成按 path 跳转 | plan §7.5 点击行为、H-3 解锁列和 §7.13 S1-track 小改；T-V2-05/06 的 blocked_by 加 H-3 路由切片（不等页面功能）；不加 `hasRoute`；切片集成前卡片不可点、不演示 |
| V2-S05 | 接受 | plan §7.11 AC-005-8 小改；T-V2-09#3：显式等待原 run 终态后再全局发送，并通过新 run 没有上下文推出 payload 没有旧上下文；T-V2-03#1 直接断言 payload 中没有该键 |
| V2-S06 | 接受 | plan §7.7 小改；T-V2-03 修改范围和第 1 条完成标准：`useSessionStore()` 只在 `send` 函数体内调用，不加抽象 |
| V2-S07 | 接受 | plan §7.5、H-2、§7.13 小改：“优先复用”改为“复用”；T-V2-05/06 的 blocked_by 加 H-2·标签（含 `JobStatusBadge`）；没交接就 blocked，不用文案直出替代 |
| V2-S08 | 接受，不增加页面功能 | T-V2-01：在 `nav.ts` 加归属注释，`AC-002-2 v2-nav` 断言 owner 文案；T-V2-02：M-09 写“格物致知（learning，Phase 2C）” |
| V2-S09 | 接受，spec 不改 | 页首声明和第 1.1 节：以 spec 页首批准记录为准；plan §7.1 小改，补“其余回归见 §7.11” |
| V2-S10（A R2） | 接受（R3） | T-V2-01 `Rail.vue` 与 T-V2-02 `stores/app.ts`、`PlaceholderPage.vue` 的修改范围写明连带删除失效导入和局部变量（已按 `43b6d79` 核实位置）；T-V2-01 新增标准 5 / 命令 5 `typecheck && lint`；T-V2-02 标准 4 / 命令 4 改为 `typecheck && lint`；矩阵 AC-002-7、AC-009-1 同步 |
| V2-S11（A R2） | 接受（R3） | T-V2-09 上下文：H-3 集成到 T-V2-09#4 通过之间的窗口内，提交信息、Converge、review.md 都写明“已知红”，窗口的开启与关闭由集成人负责 |
| V2-S12（A R2） | 接受（R3） | T-V2-04、T-V2-07 的 blocked_by 显式写出经 T-V2-03 继承 H-3·路由切片的条件依赖 |
| R3 自查（不是 A 的建议） | 一并送 A 复核 | 按 `43b6d79` 真实代码消解 T-V2-01 对 `AppShell.vue` 的条件写入（窄窗导航样式在 `Rail.vue`），第 4 节改为 `AppShell.vue` 只由 T-V2-07 写；T-V2-02 的 blocked_by 改为继承 T-V2-01；新增“待 Walter 裁定”的窄窗导航形态 |
| Analyze R5 F-01～F-05（不是 A 的建议） | 接受（R5 修正），一并送 A 复核 | F-01：1.1“A 定向复核”行、“本 Tasks 落盘提交”行、第 5 节闸门 2(a)、§9 第 3 步统一为同一个固定对象；F-02：plan §7.2 加 `design/ui` 写入行，第 4 节、T-V2-01 修改范围 / 标准 6 / 命令 6、1.1 G-02 两种裁定、矩阵 AC-002-2 / AC-008-1 同步；F-03：1.1“最近一轮 Analyze”与闸门 4 登记 R5；F-04 / F-05：页首“R5 修正与更正”行，以及 plan 页首和 §7.0 的更正 |
| Analyze R6 F-01 / F-02（不是 A 的建议） | 接受（R6 修正），一并送 A 复核 | F-01：1.1“A 定向复核”行补“审查路径与范围外”口径（审查路径 + 三条范围外断言），闸门 2(a)、§9 第 3 步引用该口径；F-02：T-V2-01 标准 6 只引 AC-008-1（依据 R-008 / §4），矩阵 AC-002-2 行去掉 T-V2-01#6 及其命令（AC-008-1 行保留），plan §7.2 备注改为只落 AC-008-1 registry，与 plan §7.11 一致。O-1（T-V2-01 工时）不改任务结构，留 A 做 V-02 时确认；O-2（固定对象提交只放报告和索引 / 状态行）由集成人落盘时遵守 |
| V2-S13（A R3） | 接受（只改 tasks 文字，按 A R3 结论第 2 条不要求重新 A 复核） | T-V2-01 新增“超时拆分规则”（预登记 T-V2-01b，0.5 h，依赖 T-V2-01，受 G-02 阻塞；第 4 / 7 / 9 节同步规则；触发时走定向 Analyze）；第 9 节工时段补一句。未触发，任务数与工时不变 |
| V2-S14（A R3） | 接受（同上） | T-V2-03 / 04 / 05 / 07 / 09 的 blocked_by 删去已满足的“v1 Handoff SHA”；第 3 节新增约定：blocked_by 只列未解除前置，已满足的闸门 1 / 2 / 4 仍按第 5 节开工前人工核对；第 1.2 节登记规则 1 补 `8af343f` R6 不含 plan §7.3 新增要求，与 plan §7.3 末段一致 |
| V2-S14 补充（G-02 落实轮） | 接受 | 各任务状态行统一标“已满足前置：v1 Handoff `43b6d79`”，第 3 节同步；第 1.2 节登记规则 1 补互动方 `0e37fbf` / `9acf3de` / `5e9e1f4` 只作设计授权参考，不是 H-x 交付，H 表仍未交付 |
| G-02 裁定落实（Walter 2026-10-28“可以”；不是 A 的建议） | 接受；属于 plan §7.4 实质修改，送 Analyze R8 / A R4 | plan §7.2 / §7.4 / §7.11 / §7.12 M-09 / §7.13 / §7.14；第 1.1 节 G-02 行改为已裁定，“A 定向复核”行新增当前口径（`79b5212..` 固定对象，`checklist-v2` 对 `425c1fd`），旧口径标为历史；第 3、4、5 节；T-V2-01 修改范围 / 标准 4 / 标准 6 / 命令 4 / 命令 6 和拆分规则；T-V2-02 的 M-09；矩阵 AC-002-6 / AC-008-1。新增的窄窗用例放在 T-V2-01 拥有的 `shell.spec`，不写 T-V2-08 的 `breakpoints.spec`；`UI_LAYOUT.md` 不改。任务数、工时和依赖不变 |
| Tasks 自查补充（不是 A 的建议） | 一并送 A 复核 | plan §7.13：S1-ctx 的 chip 需要 H-2 的 `StageLabel`；S1-intake 和 S1-ctx 同写 `AgentDrawer.vue`，因此串行；§7.0 中 `0ffa15e` 的表述改为“固定历史参照” |

### 9. 工时、依赖与下一步

| 任务 | 阶段 | 依赖 | 预计 |
|---|---|---|---|
| T-V2-01 | S0 | — | 2 h |
| T-V2-02 | S0 | T-V2-01 | 2 h |
| T-V2-03 | S1-ctx | T-V2-02 | 2 h |
| T-V2-04 | S1-ctx | T-V2-03 | 2 h |
| T-V2-05 | S1-track | T-V2-02 | 2 h |
| T-V2-06 | S1-track | T-V2-05 | 2 h |
| T-V2-07 | S1-intake | T-V2-02、T-V2-04 | 2 h |
| T-V2-08 | S1 汇合 | T-V2-06、T-V2-07 | 1 h |
| T-V2-09 | S2 | T-V2-08 | 2 h |
| T-V2-10 | S2 | T-V2-09 | 2 h |
| T-V2-11 | 回归 | T-V2-10 | 1.5 h |
| T-V2-12 | 收口 | T-V2-11 | 1.5 h |
| **合计** | | | **22 h（12 个任务）** |

- 依赖都只指向编号更早的任务，没有前向依赖，也没有环。
- T-V2-01 已到 2 h 上限；超时按 T-V2-01 的“超时拆分规则”拆出 T-V2-01b（V2-S13），拆分后依赖仍无前向、无环，触发时走定向 Analyze。目前只是预登记，没有实际拆分。G-02 落实后，T-V2-01 少写 `UI_LAYOUT.md`，多一条 `shell.spec` 窄窗用例和几行 Rail CSS，工时仍按 2 h 计。
- 关键路径为 01 → 02 → 03 → 04 → 07 → 08 → 09 → 10 → 11 → 12，共 18 h。05 → 06 可以和 03 → 04 并行，前提是两边的交接都已到位。
- **当前顺序（G-02 落实后，2026-10-28；取代下方 R3 列表中已完成或已变化的项）**：
  1. 已完成：G-02 人工裁定（Walter 本轮回复“可以”）；本次 Plan/Tasks 落实提交（`docs(frontend-workbench): apply approved G-02 horizontal navigation plan`，不在文件内写自身提交号）。
  2. 独立只读 Analyze R8：审 `79b5212..` 本次提交，含 `e84ee27` 的 S13 / S14 与 G-02 落实；报告落盘的提交只放报告和索引 / 状态行。R8 触发修正时，修正后再复跑。
  3. 集成人把 R8 落盘提交登记为第 1.1 节当前口径的 A R4 固定对象；A 新开独立会话定向复核（范围 `79b5212..<固定对象>`，只允许文档路径，范围外断言用 `425c1fd` 对 checklist-v2），并登记原样产物 SHA。本作者不代 A，也不宣称 A 已通过。
  4. 壳实施树从 `79b5212` 快进到 A R4 复核过的规格提交，按第 5 节逐项核对闸门后，S0（T-V2-01 → T-V2-02）才能开工。
  5. S1 / S2 仍等互动方 H-x 四项交付（第 1.2 节全部未交付；`0e37fbf` / `9acf3de` / `5e9e1f4` 只是设计授权参考）。
- **R3 恢复后的顺序（历史；其中第 4 步“Walter 裁定窄窗导航形态”已于 2026-10-28 完成，走“改为横向滚动”路径）**：
  1. 已完成：v1 Handoff SHA 登记（`43b6d79`）、V2-S10～S12 落实、R3 定向 Analyze（`analyze-v2-r3.md`）、R4 合并（`eb6ebd8`，`analyze-v2-r4.md`）、合并后独立 Analyze R5（`analyze-v2-r5.md`，不通过）及其 F-01～F-05 修正；复跑 R6（`analyze-v2-r6.md`，R5 各项关闭，新 2 P3）及其 F-01 / F-02 修正。
  2. 定向复跑只读 Analyze，确认 R6 的 F-01 / F-02 关闭、无新增未解决项（闸门 4）；报告落盘后，集成人把该提交登记为 1.1 中 A 的固定复核对象。
  3. A 新开独立会话，定向复核 1.1“A 定向复核”行登记的固定提交（增量起点 `ded7161`，含 R3、R4、`5ba40ad`、R5 / R6 修正；审查路径与范围外断言按该行口径；不是 `d1c2133`），并把复核产物 SHA 登记进 1.1（闸门 2）。
  4. Walter 裁定窄窗导航形态（1.1「待 Walter 裁定」，两种裁定的后续动作见该行）；如果改为横向滚动，先改 plan §7.4 / T-V2-01，再重跑 Analyze 并由 A 复核。集成人、集成验证分支和从 `43b6d79` 创建的壳实施 worktree 已登记（第 1.1 节），但不以建立工作树代替放行；S0 开工前，壳实施树要先快进到 A 复核过的规格提交。
  5. 以上都满足后，S0（T-V2-01 → T-V2-02）可以开工，因为它不依赖任何 H-x。S1 / S2 仍要等互动方交付 H-x：互动方 `8af343f` 的 plan / Tasks r5 还没有吸收 README「跨 feature 待同步事项」第一行的新增要求（共享未筛选缓存与 ensure/refresh、进行中口径、写 action 交接、H-3 路由切片先行、`sessionStore` 同一次导航内清空、`intakeStore.open(jobId?)` 快照与容器约定、`jobFixtures` 整集合替换）。这一项由互动方按其流程处理，壳不代写。
- **本清单不启动实施。** 暂停前列出的后续顺序（历史）：
  1. Tasks 落盘；
  2. Analyze：R1（`analyze-v2.md`）发现 3 P2 / 4 P3，文档已修，待下一轮复跑。只读，重新读取 spec / plan / tasks 后出报告，发现问题就修复并重跑；
  3. A 新开独立会话，定向复核 Tasks 和 plan §7 小改，并补勾 checklist-v2「阶段说明」；
  4. 外部前置齐备：v1 Handoff SHA 已登记且在 main 上，所需的 H-x 已交付并集成，第 5 节闸门通过；
  5. 按依赖顺序 Implement；
  6. Converge：外部阻塞未解除时，必须报“未收敛（外部阻塞）”；
  7. Review → Gate 2 → Handoff。
