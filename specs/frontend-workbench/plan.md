# Feature: frontend-workbench 实施计划（plan.md）

> **当前状态（2026-10-28，G-02 已裁定、设计修订待复核）**：v1 正式 Handoff `43b6d79` 已合入。历史复核：R7 固定审 `217960d`，A R3（`claude-fable-5-1 via anthropic`）固定审 `b375b270a47d210823ae62da16438eeac17096db` 并通过，原样产物 `425c1fd6c639734b0c45ba7cf9259dbee4439074`。这两次结论只覆盖各自的固定提交。V2-S13 / S14 只改了 tasks 文字（`e84ee27`）。**G-02 人工裁定已满足**：小于 980 时九项单行，导航容器内部横向滚动，页面不横滚（见下行）。本次据此修改了 §7.2 / §7.4 / §7.11～§7.14，属于 §7 实质设计修改，所以闸门 2 / 4 对这部分增量重新打开：须经独立只读 Analyze R8，再由 A R4 定向复核（固定对象规则见 tasks §1.1）。复核前 T-V2-01 / 02 不开工；S1/S2 另缺 H-x 四项交接证据。下方“暂停 / 未审 / 未取得 / 待裁定”都是各自历史时点的记录，当前状态以本行、下行及 tasks §1.1 为准。
> **G-02 裁定落实（2026-10-28）**：协调器问“是否按推荐，采用导航内部横向滚动？”，Walter 本轮回复“可以”。协调器转述的裁定内容是：小于 980px 时九项顶部导航保持单行，导航容器内部横向滚动，页面本身不横滚。这是执行已采用的 `design/ui/UI_LAYOUT.md#narrow`“侧栏塌成顶栏横向滚动”规则的实现细节，不改产品形态、架构或 52 条 AC，不触发 ADR 或 Gate 1。Plan/Tasks = `claude-opus-5-5` via `anthropic`，由协调器 `openai/gpt-6.1-sol` 新派独立会话（不是 Implement，也不是 A）。同一限额窗口内 Opus bridge 的最小真实调用已返回额度 / 限流类失败，本会话未重试 bridge，未改配置。基线 `e84ee27de7baba055a92eb9d92d80ac76e5ab513`，分支 `docs/frontend-workbench-v2-g02`。只改本文件页首与 §7（§7.2、§7.4、§7.11、§7.12 M-09、§7.13、§7.14）；§1～§6 一字未改。spec、两份 Checklist、代码、`design/`、`docs/` 都没改；`UI_LAYOUT.md` 原样采用，`UI_NAV.md` 的适配文字由 T-V2-01 实施时先写资产、再写代码。

> Plan 阶段产物。需求在 spec.md（2026-10-27 Gate 1 批准冻结，45 条 AC），本文只写实现机制与验收落点。
> **2026-10-28 精简版**：按 AGENTS.md §5 工程准则重写——去掉为"将来可能需要"而建的东西（评审用中间件、守卫自检样例、跨字段校验、抽象层、逐锚盘点），保留能直接验证 spec 的部分。spec 未改动。
> **2026-10-28 Review 整改**：按 R1-01 补全变化量独立精度（§2.1 / §2.7），新增 T-16 / T-17；回写 T-01 实际 TypeScript 版本。修复冻结的数值展示需求，不新增用户行为、不修改 spec 或 Checklist。其余 P3 的后续归属见 tasks.md，未获 Gate 2 风险接受。
>
> **v2 Plan 追加（2026-10-28）**：新增 §7「v2 实施设计（v2.1 冻结需求）」。需求依据是 spec v2.1：Walter 已于 2026-10-28 批准 Gate 1，范围包括 Q-023～Q-031，52 条 AC 已冻结。§1～§6 原文保留，作为 v1 历史基线；v1 的 45 条 AC 设计没有废弃。§1～§6 与 §7 冲突时以 §7 为准，覆盖范围见 §7.1。本轮只更新本文件（页首记录与 §7）和 `specs/README.md` 本 feature 一行；没有修改 spec、tasks、checklist、产品 ADR 或代码。§7 中的新增令牌、文件和测试都只是计划，本轮不写入，也不授权实施。
> **v2 Plan 模型记录**：Plan = `claude-opus-5-5` via `anthropic`。`claude-bridge/claude-opus-5-5` 的最小真实调用因额度或限流失败；按规则只换通道、不换模型，当前限额窗口内不再重试 bridge。协调与落盘 = `openai/gpt-6.1-sol`，只负责读取和串行集成，不是审核员 A。任务 = frontend-workbench v2 Plan §7 文本收敛。基线 = `spec/frontend-workbench-v2` @ `fec355650f614ef42138f409afc748206e941ba1`。失败类别 = 通道额度或限流；本记录已脱敏，不含密钥、token 或原始鉴权报错。
> **v2 审核状态（Plan 时记录）**：§7 需要审核员 A 新开独立会话审核，并生成 v2 Checklist。A 首选 `claude-fable-5-1`：先测 bridge，不通再走 anthropic；模型回退按 AGENTS §6。现有 `checklist.md` 只证明 v1，不能授权 v2。§1～§6 未变部分能否复用，也要由 A 确认。本 Plan 的自检不是审核结论；文中对外部 feature checklist 的只读核对，也不是本 feature 的审核。
> **后续阶段记录—v2 Checklist R1（2026-10-28）**：A = `claude-fable-5-1` via `anthropic`，独立会话 / worktree；`claude-bridge` 最小真实探活因额度或限流不可用，同模型官方通道探活成功，未换模型。任务 = v2 Checklist 首轮，固定审查基线 `d2bf5a77902694e62747d49647194637a1d6b75b`，实际 diff = `fec3556..d2bf5a7`。**通过：0 项阻断、9 条建议（V2-S01～S09），允许进入 Tasks，不授权 Implement。** 当前有效 v2 清单为同目录 `checklist-v2.md`（审核员原样产物）；旧 `checklist.md` 不修改、不授权 v2。后续仍需 Tasks / Analyze 与 A 定向复核，实施前置以该清单和 §7.3 / §7.13 为准。
> **当前阶段补记—暂停交接（2026-10-28）**：Analyze R2 审 `6bda6c9`，F-01～F-07 全部关闭、无新增 F；A = `claude-fable-5-1` via `anthropic` 随后以全新独立会话审 `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`，Checklist R2 通过（0 阻断、I-01b / V-02 正式勾选），原样产物已提交为 `f1f755bad8e4bab7577c415f4aea3d297c9d37a8`。bridge 本窗口额度不可用，沿用同模型官方通道，未因审核结果换模型。下方草案 / 待审 / R1 修正措辞为当时历史。新增非阻断建议 V2-S10～S12 留待恢复；按用户暂停指令不再开新任务。外部 v1 Handoff 与 H-x 交接仍未登记，不授权 Implement；恢复入口为根 `HANDOFF.md`。
> **恢复修订 R3（2026-10-28，用户“按 HANDOFF.md 继续”）**：Plan/Tasks = `claude-opus-5-5` via `anthropic`（会话由用户以该通道启动；本会话未探 bridge、未改 provider / 路由 / 配置）；基线 `ded7161`，分支 `docs/frontend-workbench-v2-resume`。只做状态与事实更新，不改 §7 技术设计：(1) v1 Handoff 合入 main 的 SHA = `43b6d79681a49562f41751368b2ae00c24062f56`（PR #7 merge commit），已按其真实代码复核 §7.0 引用的壳文件事实，与 `0ffa15e` 一致（详见 tasks 1.1）；(2) 互动方当前已提交的有效审核为 `8af343f` 中的 Checklist R6（通过、仍 BLOCKED 于实施基线），但其 plan / Tasks r5 尚未吸收 §7.3 对 H-2 ①～⑤、H-3 路由切片先行、H-4、H-5、H-6 的新增要求，H-x 全部未交付；(3) 新发现待 Walter 裁定：§7.4“九项换行”与 `design/ui/UI_LAYOUT.md#narrow`“横向滚动”不一致（v1 P3 H-02 已登记），裁定前不改 §7.4。R3 未经 A 定向复核。
> **集成记录 R4（2026-10-28）**：`claude-opus-5-5` via `anthropic`（协调器指定的本次文档 merge 唯一执行者）以合并提交 `eb6ebd8` 把 v1 Handoff `43b6d79` 合入本分支：页首先放 Handoff 的“Review 整改”行；§1～§6 现为 Handoff 版本（TS 5.9.2、R1-01 变化量独立精度 / `deltaDecimals`、AC-007-4 / 风险表措辞），§7 逐字未变。§7.1 对 §2.1 / §2.7 的覆盖声明在 Handoff 版本上仍成立（v2 壳任务不碰 `shared/format.ts` 与契约），无语义冲突，见 `analyze-v2-r4.md`。不改 §7 技术设计。
> **R5 修正与更正（2026-10-28）**：Plan/Tasks = `claude-opus-5-5` via `anthropic`，由协调器 `openai/gpt-6.1-sol` 新开会话派出（不是 Implement，也不是审核员 A）。协调器已对 Opus bridge 做最小真实探活，返回额度 / 限流类失败，同模型 anthropic 正常；只换通道，未重试 bridge，未改 provider / 路由 / 配置。基线 `d4b1853`，分支 `docs/frontend-workbench-v2-resume-fixes`。按只读 Analyze R5（`analyze-v2-r5.md`，2 P2 / 3 P3）修正：(1) §7.2 增加一行：`design/ui/{UI_NAV.md,README.md}` 由壳写入，G-02 裁定保持换行时 `design/ui/UI_LAYOUT.md` 暗色适配段也由壳写入；§7.4 / §7.11 / §7.13 / §7.14 同步（F-02）。(2) A 恢复后的固定复核对象以 tasks 1.1 为唯一口径（F-01）。没有需求变化，不改 spec、Checklist、§1～§6 或产品 ADR。**通道更正（F-05）**：上方 R3 / R4 行“会话由用户以该通道启动；本会话未探 bridge”是作者当时的措辞；实际是协调器派出的会话，bridge 探活因额度 / 限流失败后才走 anthropic。**审核范围更正（F-04）**：§7.0“这些小改未经审核”和 R1 修正行“未经 A 定向复核”是 A R2 之前的历史状态。A R2（产物 `f1f755b`）已审到 `949a232`，包括这些小改；还没经 A 审的增量从 `d1c2133` 起（R3、R4 合并带入的 §1～§6 Handoff 版本、本行修正），由 A 按 tasks 1.1 登记的固定提交复核。
> **R6 修正（2026-10-28）**：Plan/Tasks = `claude-opus-5-5` via `anthropic`，由协调器新开会话派出（不是 Implement，也不是审核员 A）；协调器已对 bridge 最小真实探活，返回额度 / 限流类失败，anthropic 正常；只换通道，未重试 bridge，未改配置。基线 `43b97dd`，分支 `docs/frontend-workbench-v2-resume-fixes`。按只读 Analyze R6（`analyze-v2-r6.md`，0 P1/P2、2 P3）修 F-02：§7.2 `design/ui` 行备注的验证归属改为只落 AC-008-1 registry（与 §7.11 AC-008-1 行一致；登记依据是 spec R-008 正文与 §4 末条，AC-002-2 不管登记）。F-01（A 审查路径与范围外断言）只改 tasks 1.1。没有需求变化，不改 spec、Checklist、§1～§6、§7 技术设计或产品 ADR。
> **Analyze R1 后修正（2026-10-28，历史记录）**：修正 = `claude-opus-5-5` via `anthropic`（bridge 本窗口额度不可用，未重试、未换模型）；基线 `b364971a1a76fde96be6f924a7b7263ecb9cd447`，分支 `docs/frontend-workbench-v2-analyze-fixes`。按只读 Analyze R1（3 P2 / 4 P3，原文存同目录 `analyze-v2.md`）修 F-01～F-07：§7.2 加 `PlaceholderPage.vue` 最小派生修改（F-01）；§7.3 H-2⑤ 写明随交接交付的写 action（F-04），H-4 交接须登记公开设置方式并加条件依赖（F-05），H-6 `jobFixtures` 可替换整个作业样例集合（F-06）；§7.11 AC-002-2 / AC-003-7 / AC-003-9 与 §7.13 S0 / S1-ctx 同步（F-02、F-03、F-05）。无需求变化，不改 spec、checklist 或 §1～§6。**本修正未经 A 定向复核，也未重跑 Analyze**；R1 的 F 项须由下一轮独立只读 Analyze 确认后才算关闭。

## 1. 技术方案

- **栈**：Vue 3.5 + Vite 8 + TypeScript **5.9.2**（T-01 冒烟后锁定，未采用 TS 7）、Pinia、vue-router、ECharts 6（D-008 / D-004）；契约 schema 用 zod 4
- **测试**：Vitest + @vue/test-utils（单元 / 组件）、Playwright（端到端，复用本机 Chrome）
- **工具链**：pnpm；Node ≥ 22.12；ESLint（换行统一交 `.gitattributes`，不另引 Prettier）；版本在 T-01 冒烟后锁进 `pnpm-lock.yaml`
- **文件边界**（spec §4）：不碰 `backend/`；共享文件为 `.gitignore`（追加）、`specs/README.md`（本 feature 一行）、`docs/designUI.md`（引用指针）、`docs/decisions/`（D-015）、`docs/plan.md` §3（D-015 行）
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

**变化量独立精度（R1-01）**：`Figure.decimals` 只控制主数值；可选 `deltaDecimals` 是非负整数，控制变化量。缺省时 `deltaKind='pct'` 用两位，`abs` / 未指定口径沿用 `decimals`；显式 `0` 必须生效。`shared/format.ts` 的 `figureDeltaDecimals(figure)` 统一解析，供 `Kpi` 与 `BoardGrid` 复用（盘面字色也按变化量的精度判方向）。`fmtValue` / `fmtDelta` 的取整、空态与零中性规则不变；小于变化量显示精度的正负数仍中性，不能改成“所有非零原值都着色”。契约字段描述为后端的精度约定来源，文档 / schema 只经生成器更新；v1 尚未 Handoff，契约保留 `1.0.0`，新增字段可缺省、旧 fixture 无需迁移。

**涨跌色作用域**（D-015）：涨跌令牌只在 `updown.css` 引用；`updown.css` 只被 `modules/market-board/`、`modules/watchlist/`、`workbench/FocusBand.vue` 引入（`check.mjs` 三条 grep）。

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

- 数值三类形态（AC-007-4）：`Figure = {label, value, unit, decimals, freq, delta?, deltaKind?, deltaDecimals?, semantic, asOf, seriesId?}`；`BoardCell = {state, figure}`（`ok ⇔ figure ≠ null`）；`SparkSeries = {points, unit, freq, semantic, asOf, seriesId}`
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
| AC-007-4 | unit：fixtures 全部过 schema；Figure 缺元数据、`BoardCell` ok 缺 figure、`SparkSeries` 缺元数据 → 失败；T-16 验证可选 `deltaDecimals`（含显式 0）、拒绝无效精度，组件 / e2e 验证百分比与价格精度独立（R1-01） |
| AC-008-1、AC-008-2、AC-008-3 | unit `design-registry.spec`：条目 front matter 齐备、令牌 `source` 可解析、PALETTE_DARK 覆盖 14 个 palette-core 原色（按不同 hex 计） |
| AC-009-1 | `pnpm test` 退出码 0 |
| AC-009-2 | `manual-acceptance.md`（M-01 ~ M-08）+ Handoff 截图 |

## 6. 风险

| 风险 | 对策 |
|---|---|
| Node 25 非 LTS；后续工具链升级的兼容性 | T-01 已锁 TS 5.9.2；当前组合已通过冒烟与完整测试，升级时重跑 `pnpm test` / `pnpm build` |
| Playwright 找不到本机 Chrome | `channel` 回退 `msedge`，再不行 `playwright install chromium` |
| happy-dom 无 `matchMedia` / 计算样式 | 断点与计算样式只在 Playwright 验 |
| 暗色序列色区分度（ΔE2000 13.2） | 接受并登记；chart-templates 画出真实季节图后复核 |
| 生成物漂移 | `pnpm check --only generated` 在 `pnpm test` 首位，覆盖 `design/generated`、首帧块与 `contracts/*` |

**回滚**：删除 `frontend/`、`design/`、`specs/frontend-workbench/`；去掉 `.gitignore` 追加行与 `specs/README.md` 本 feature 行；`docs/designUI.md` 只回退本 feature 改的引用指针（用 `git checkout <起点> -- docs/designUI.md`，回退前确认该文件无其他改动）；`docs/decisions/20261027-updown-scope.md` 不删除（ADR 历史），在 `docs/plan.md` §3 标 superseded 并另写后继 ADR。

---

## 7. v2 实施设计（v2.1 冻结需求）

### 7.0 阶段、闸门、基线与依据

- **当前阶段**：Plan（v2）。Gate 1 已通过：spec v2.1 由 Walter 于 2026-10-28 批准，52 条 AC 已冻结。各需求的 AC 数为：R-001～R-009 分别 6/8/9/6/9/4/5/3/2。后续流程：A 独立做 v2 Checklist → Tasks（追加 v2 任务）→ Analyze → Implement。
- **本节不做的事**：不修改 spec、tasks、checklist、产品 ADR 或代码；不授权实施。**Tasks 阶段补充（2026-10-28）**：Tasks = `claude-opus-5-5` via `anthropic`（bridge 本限额窗口额度不可用，未换模型）。为落实 checklist-v2 建议 V2-S02～S07、S09，并修正两处依赖表述，对 §7.0、§7.1、§7.3、§7.5、§7.7、§7.11、§7.13 做了实施细节小改；没有需求变化，不改 spec，也不改产品 ADR。这些小改**未经审核**：A 的通过只针对 `d2bf5a7`，须由 A 新开独立会话定向复核后，才能作为实施依据。（R5 更正：上一句是当时状态。A R2 已审到 `949a232`，包括这些小改，结论为通过；还没审的增量从 `d1c2133` 起，复核对象见 tasks 1.1。）
- **设计依据**：
  - AGENTS §2/§4/§5/§6；
  - `docs/interaction.md` §2.4、§3.3、§7.2；
  - `docs/designUI.md` §2.1、§2.2、§3.1、§3.2、§3.6、§3.9、§3.10；
  - D-015：涨跌色作用域不变；
  - D-016：九项菜单、作业轨道，对话只是接口之一；
  - D-018：使用“格物致知 / 定稿”，路由 `/learning` 不变；
  - D-019：运行时角色芯片、模型档和成本不属于本次冻结的 52 条 AC 增量，Plan 不顺手扩入。开发流程的模型路由仍按 AGENTS §6。
- **文档状态**：docs 增量已通过 `54570b8` 合入当前树。spec 页首“尚未同步”是旧描述，不再列为未完成依赖。
- **视觉基准**：只以 designUI.md 的文字和令牌为准。未经批准的原型位于 `D:/2030/Futures-AI-frontend/specs/frontend-workbench/assets/workbench-v2`，它不作为视觉基准；本 Plan 不读取、不引用其内容。
- **外部设计输入**：workbench-interaction（下称“互动方”）只作只读参考，固定设计基线为 `D:/2030/Futures-AI-interaction` @ `8bd1b31`。
  - 2026-10-28 只读核对：它的 spec v1.1 已通过 Gate 1。
  - 它的 `checklist.md` 当前有效轮次是 **R3**，审查对象为 `8bd1b31`，结论为**未通过**。阻断项有两个：
    - B-09：`SourceNote` 的来源发布日期被误改为 `finalizedAt`；
    - B-10：`Deliverable` 的 `draft/final` 定稿状态没有设计落点。
  - 这两项由互动方修 Plan，再经 A 做 R4 复核；壳方不代修，也不消费这些错误字段或推导。
  - 结论：**外部交接未就绪**，必须以互动方最新有效审核为准，不能以旧的 R2 通过为准。外部 checklist 可能被并行会话更新；本 Plan 的固定设计基线仍是 `8bd1b31`，核对结果也不是本 feature 的审核结论。
  - 互动方分支后续移动，不算已交付证据。§7.3 各交接项须按其规则交付后，壳方对应任务才能开启。
  - **R3 状态补记（2026-10-28）**：互动方已提交 `8af343f`，其中 Checklist R6 通过（B-09 / B-10 / B-11 关闭），实施仍 BLOCKED 于 v1 基线；其 plan / Tasks r5 尚未吸收本节 §7.3 的 H-2 ①～⑤、H-3 路由切片先行、H-4 同次导航清空、H-5 快照与容器约定、H-6 整集合替换等新增要求。上面的 R3 / R4 描述是 Plan 时的历史状态。
- **实施起点（硬前置）**：Tasks 头部必须登记 v1 完成 Review、Gate 2、Handoff 并合入 main 的准确 SHA。双方都以它作为实施起点，v2 实现分支也从这个 SHA 建立。
  - `fdaa7d8`（本分支前端快照）不能作为开工基线。
  - `0ffa15e`（Plan 与 A 核对时使用的 v1 实施分支固定历史参照，不是当前 HEAD，尚未 Handoff）也不能作为开工基线。v1 实施分支其后的移动（如 `b19427a`）只是只读元信息，同样不代表 Handoff，也不能作为开工基线。
  - 本节引用的 v1 文件以 Handoff SHA 的实际内容为准，包括 `agent/store.ts`、`AgentDock.vue`、`AgentDrawer.vue`、`CotTimeline.vue`、`app/AppShell.vue`、`workbench/*` 和 `stores/{app,ui,badges,layout}.ts`。Tasks 起草时必须重新读取。
  - 当前只读参照的是 v1 实施 worktree `D:/2030/Futures-AI-frontend`，它尚未 Handoff：
    - `AgentDrawer` 位于底栏 `.agent-dock` 内，样式为 `position:absolute; inset-inline:0; bottom:100%`；
    - `AppShell .content` 有三行：顶栏、`main.route-view`、`footer.dock-slot`；
    - `agent/store.ts` 中的 `AgentRun` 由 `run.started` 创建。
  - 本轮只做设计，不用占位宣称任何集成已经完成。

### 7.1 对旧节的覆盖（只改增量）

| 旧节 | v2 处理 |
|---|---|
| §1 目录 | 新增 `src/workbench/JobTrack.vue`。`src/jobs/**` 归互动方，不属于本 feature |
| §2.2 导航 | 八项菜单加专题研究子项，改为九项菜单（§7.4）。壳不再调用 `getResearchList`；`stores/app.ts` 只做最小派生修改 |
| §2.3 工作台 | 由 `FocusBand + ModuleGrid` 改为 `FocusBand → JobTrack → ModuleGrid`（§7.5） |
| §2.5 对话 | 新增作业上下文的捕获、绑定、展示和按作业查看（§7.7）。两档高度、时间线、模块角标、引导跳转和唯一终态不变 |
| §2.7 契约 | 契约从 1.0.0 升到 2.0.0，只由互动方执行（§7.8）。壳不改 schema、version 或 mock，也不新增 schema 方法 |
| §3 存储 | 不变（§7.9） |
| §5 验收 | 新增 7 条 AC。AC-002-2/002-3/002-4/002-7/005-1 的验收落点由 §7.11 取代；其余沿用旧落点，并加入 v2 回归。其余各条的回归与扩充（如 AC-001-x、AC-002-6、AC-003-6、AC-004-x、AC-007-x、AC-008-2、AC-009-2）见 §7.11，以 §7.11 为准 |
| §6 风险末尾的回滚段 | 旧的“删除 `frontend/`”对 v2 不适用，改用 §7.12 的精确回滚 |

§2.1、§2.4、§2.6、§2.8、§2.9 全部沿用；v1 的 45 条 AC 不废弃。

### 7.2 文件唯一写入者

| 路径 | 唯一写入者 | 备注 |
|---|---|---|
| `frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue,AppShell.vue}` | 壳（本 feature） | 只有 AppShell 挂载全局采集抽屉 |
| `design/ui/{UI_NAV.md,README.md}` | 壳（T-V2-01） | R5 F-02。`docs/designUI.md` §3.1 把 `UI_NAV` 指为导航登记处，但移植时写入的暗色适配段仍是“八项 + `getResearchList()` 研究子项”，README 索引行写的是“八项路由与研究扩展”。v2 只改 `UI_NAV` 暗色适配段（九项；窄窗为单行，导航容器内部横向滚动，页面不横滚）和 README 的 UI_NAV 索引行；原文快照与 JSON 碎片不改。**G-02 已裁定（2026-10-28）**：`UI_LAYOUT.md` 的 `#narrow`“侧栏塌成顶栏横向滚动”正是本裁定，原样采用，本 feature 不写入该文件。R5 时“保持换行才写 `UI_LAYOUT.md`”的条件已作废。验证落在 AC-008-1 registry（登记依据 spec R-008 / §4；AC-002-2 不含登记，R6 F-02） |
| `frontend/src/stores/app.ts` | 壳（最小派生修改） | spec §4 的 v2 壳文件清单没有列出此文件。修改它是因为 AC-002-2 删除了专题子项，属于派生改动，需由 A 确认。只做三处改动：去掉 `getResearchList` 调用和 `research` ref 及其导出；加载步骤从 4 改为 3（`progress` 分母和“加载完成”判定）；状态文案从“正在加载资讯、数据源与研究列表…”改为“正在加载资讯与数据源…”。回归落在 AC-002-7 |
| `frontend/src/pages/PlaceholderPage.vue` | 壳（最小派生修改） | 与 `stores/app.ts` 同源的派生改动：v1 中它按 `route.meta.navId === 'research'` 读取 `app.research` 取标题，删除 `research` 导出后不改就无法通过类型检查。只删除这条 research 标题分支，标题直接取 `route.meta.title`；占位文案、`data-placeholder-owner` 和 daily 日期展示不变。不在 spec §4 壳文件清单内，需由 A 定向复核确认（对照 checklist-v2 I-01）。验证落在 `pnpm -C frontend typecheck`（AC-002-7 派生修改、AC-009-1 类型打底） |
| `frontend/src/workbench/{WorkbenchPage.vue,JobTrack.vue}` | 壳 | FocusBand、ModuleGrid、ModuleLibrary 不改 |
| `frontend/src/agent/{store.ts,AgentDock.vue,AgentDrawer.vue,CotTimeline.vue}` | 壳 | 只消费上下文、负责展示，并做双抽屉避让 |
| `frontend/src/design/tokens.json`、`design/ui/UI_DARK_ADDITIONS.md`（源）；`src/design/generated/*`（生成物） | 壳 | 计划只新增 `layout.intake_width` 一项（§7.6）。生成物只能通过 `pnpm -C frontend tokens` 再生成，不手改 |
| 壳测试：既有文件修改 `tests/component/{topbar,timeline}.spec.ts`、`tests/unit/manual-acceptance.spec.ts`、`e2e/{shell,workbench,modules,breakpoints,agent}.spec.ts` | 壳 | e2e 文件名以 v1 Handoff SHA 的实际文件为准 |
| 壳测试：计划新增 `tests/component/job-track.spec.ts`、`tests/unit/agent-context.spec.ts`、`e2e/integration-v2.spec.ts` | 壳 | 目前都不存在，本轮不创建 |
| `specs/frontend-workbench/**`（含 `manual-acceptance.md`） | 壳 | — |
| `frontend/src/jobs/**`：页面、`routes.ts`、`jobsStore/intakeStore/sessionStore/inboxStore`、`IntakeDrawer.vue`、徽标组件，以及 jobs 测试 | 互动方 | 壳只导入，不写入 |
| `frontend/src/contracts/**`、`frontend/src/agent/events.ts`、`scripts/contract-build.mjs` | 互动方 | 契约 2.0.0 的拥有者；契约中旧的 `getResearchList`、`ResearchItem`、`research.json`、`MockOverrides.fixtures.research` 保留 |
| `frontend/contracts/{CONTRACT.md,schema.json}` 生成物 | 互动方 | 只改源，再执行 `pnpm -C frontend contract` 生成；任何一方都不手改 |
| `tests/unit/{contracts,mock,contract-doc}.spec.ts` | 互动方 | 承载 AC-007-5 的生产方证据 |
| `frontend/src/main.ts` | 互动方 | 只负责 `addRoute` 注册；壳不改 |
| `frontend/package.json`、lock 文件、工具链配置 | 两方都不改 | 如需修改，先登记 |
| `specs/README.md` | 两方各改本 feature 一行 | 由协调集成人串行合并 |
| `backend/`、`docs/` 权威文件 | 不改 | — |

### 7.3 契约与 store 交接要求（生产方 → 壳）

**交接单元**：互动方在自己最新有效 A 审核授权的 plan、Checklist、Tasks 下实现，并交付：

- 一个固定 commit；
- 该交接项的定向测试命令和输出摘要。

Plan 时互动方的有效审核是 R3 未通过；R3 恢复修订时已提交的有效轮次为 `8af343f` 中的 R6 通过，但它不含本节新增要求，交接仍以覆盖这些要求的、已提交的有效 Checklist 为准。指定集成人把交接单元串行集成到仅由集成人可写的集成验证分支，分支名在 Tasks 登记；壳方任务基于集成后的 SHA 开启。双方开发者仍各自在独立 worktree / 分支写各自拥有的文件，不共享可写目录；其他会话只读集成验证分支。

- 不要求互动方整个 feature 先完成 Review、Gate 2、Handoff 并合入 main。它的 H 组集成验证本来就依赖壳 S1，如果要求先合 main，会形成循环依赖。
- 互动方的 A～G 组可以按可用切片交接。共享的契约、schema、mock、路由、stores 和 `IntakeDrawer`，按壳方实际用到的组分批解锁（§7.13）。
- 完整集成后，双方仍要各自完成 Review、Gate 2、Handoff。壳 v2 合入 main 时，所依赖的生产方提交必须先于壳方或在同一批合入 main，顺序由集成人安排。
- 壳方实际使用的字段、方法和导出名，以交接 SHA 为准；如有差异，Tasks 照实更新。壳方不自行兜底，也不复制实现。

| # | 生产方需落实的内容（尚未存在的部分已标出） | 解锁的壳任务 |
|---|---|---|
| H-1 | `CONTRACT_VERSION = '2.0.0'`，并导出 `JobContext = {jobId, stage}`。`SendMessage.jobContext?` 和十类 `AgentEvent` 都带公共可选字段 `jobContext`。mock `send` 把 payload 中的上下文原样写入该 run 的全部事件。原十类事件和旧 fixtures 不带该字段时仍能解析 | S1-ctx：AC-005-8 单元部分、AC-005-9 |
| H-2 | **数据**：`listJobs(filter?)` 返回 `JobListItem[]`，至少含 `id/title/type/status/currentStage/stages[4]{stage,state,pendingCount}/pendingCount/updatedAt`，默认按 `updatedAt` 倒序。契约导出 `JobStatusLabel/StageLabel/StageStateLabel`，带文案和图标。<br>**共享列表缓存（尚不存在）**：互动方 plan §2.3 的 `jobsStore` 目前只写了“当前作业、阶段工作区视图缓存”。需要在 `jobsStore` 中补充：<br>① 一个只读的**未筛选**作业列表视图缓存，以及它的读状态（加载中）和错误；<br>② 共享的 ensure/load action 和 refresh action，方法名由生产方确定；<br>③ “进行中”判定：可以是 selector，也可以是 `ACTIVE_JOB_STATUSES` 一类契约常量。壳的最低期望：等待人工确认的作业、存在冲突待介入的作业必须在集合内，终结态作业不在；具体枚举由生产方用契约常量定义并登记进 CONTRACT.md，壳不自定；<br>④ 列表页筛选用 selector 派生，或单独保存筛选结果，不能覆盖未筛选缓存；<br>⑤ 互动方已有“写回执 / agent 通知后重读”的机制，这个机制必须刷新同一份缓存。凡是会改变作业摘要的写操作都要覆盖，包括投放提交、确认、归属、`createJob`、`submitIntervention`、`markInboxRead` 等；agent 通知也要覆盖（mock 状态层先处理事件，再通知 UI）。**随 H-2·列表交接**至少交付一个可调用、会改变作业摘要的生产方写 action（例如 `createJob` 在 store 层的 action），连同它的 store 归属、公开导出和“调用后刷新同一份缓存”的定向测试；名称以交接 SHA 登记进 Tasks 1.2 节。这是对互动方既有写方法的交付范围要求，壳不新造业务方法；inbox（`markInboxRead`）或 H-5 投放归属的 action 不算 H-2 交付。<br>**还缺**：`JobTypeLabel`；以及轨道复用的作业状态徽标组件 `JobStatusBadge`（属于 §7.2 中互动方的徽标组件），随本交接单元交付。<br>以上由互动方在其 Plan/Tasks 中落实；对方拒绝时报 Walter 裁决，壳不自建映射、缓存或刷新机制。标签导出与 `JobStatusBadge` 可以和列表缓存分批交接 | S1-track：AC-003-7～AC-003-9（需要全部内容）；S1-ctx 的 chip 只需要其中的 `StageLabel` 导出 |
| H-3 | `jobs/routes.ts` 导出 `jobs`（`/jobs`）和 `job-detail`（`/jobs/:id/:stage?`）两条路由。`stage ∈ collect/process/analyze/deliver`，`meta = {title, en, navId:'jobs'}`。`main.ts` 在 mount 前调用 `addRoute`，用同名记录替换壳的 `jobs` 占位 | S2：AC-002-2 集成部分、AC-002-3、AC-003-7 集成部分。其中“路由定义与 `main.ts` 注册”这一切片（不含列表/详情页面功能）先解锁 S1-track 的卡片跳转（AC-003-7 组件部分） |
| H-4 | `sessionStore.context: JobContext \| null`，只读。进入作业详情或切换阶段时设置；离开 `job-detail` 时，必须在同一次路由导航内同步清空，例如在路由守卫中清空。这个值不能从 lastRun 推导。交接登记须写明是否含可在测试中使用的公开设置方式；如果 context 只能由路由守卫设置，消费它的 S1-ctx 条件依赖 H-3 路由切片（§7.13）。壳不为此新增测试专用 setter 或抽象，也不写 sessionStore | S1-ctx、S1-intake：AC-005-8 |
| H-5 | `intakeStore` 提供 `open(jobId?: string)`、`close()`、`isOpen` 和 `jobId`；`jobId` 是打开时的快照，提交时使用该快照。`IntakeDrawer.vue` 根元素用 `.glass-drawer`，填满壳提供的容器。它不能自设 `position: fixed`、遮罩、`aria-modal` 或焦点锁；关闭时不导航，也不调用 agent。它的写操作按 H-2 ⑤ 刷新共享列表缓存 | S1-intake：AC-002-8 |
| H-6 | 场景 `empty`、`error`、`slow` 覆盖 `listJobs`；`jobFixtures` 覆盖项可以替换整个作业样例集合（新增一项即以原集合加该项替换；只含非进行中作业的集合也用替换实现）；fixtures 中至少有一个进行中作业带未读待处理项，供角标测试使用 | S1-track：AC-003-9；S2：AC-002-3 |

本 feature 不复制 `Job`、`Stage` 或 schema，不另建 mock，不另升契约版本，不推进阶段，也不持有作业业务状态。

### 7.4 导航与路由（R-002）

- **`nav.ts` 九项固定顺序**：

  | id | path | 标题 | en | placeholderOwner |
  |---|---|---|---|---|
  | `workbench` | `/workbench` | 工作台 | Workbench | — |
  | `jobs` | `/jobs` | 作业 | Jobs | `workbench-interaction` |
  | `daily` | `/daily` | 日报 | Daily report | `daily-report` |
  | `prices` | `/prices` | 价格 | Prices | `prices` |
  | `balance` | `/balance` | 平衡表 | Balance sheet | `balance-sheet` |
  | `logistics` | `/logistics` | 物流 | Logistics | `logistics` |
  | `learning` | `/learning` | 格物致知 | Inquiry | `learning` |
  | `knowledge` | `/knowledge` | 知识库 | Knowledge base | `knowledge-base` |
  | `settings` | `/settings` | 设置 | Settings | `settings` |

  删除 `research` 项。
- **`router.ts`**：
  - 路由仍由 `navItems` 生成。
  - 保留 `daily` 的 `/daily/:date?`；删除 `research` 的 `/research/:id?` 特例。
  - `jobs` 生成名为 `jobs` 的占位路由。壳不定义 `job-detail`，作业路由只由 H-3 提供。
  - 旧的 `/research/*` 落到既有兜底页，不承诺旧 URL 迁移。
- **`Rail.vue`**：
  - 删除专题研究子列表及其样式。
  - 当前项判定改为 `route.meta.navId === item.id`。如果同时 `route.name === item.id`，设 `aria-current="page"`；否则设 `aria-current="location"`，例如作业详情页高亮“作业”。
  - 全局同一时刻只有一个 `aria-current`。
  - **窄窗（G-02 已裁定，2026-10-28）**：窄于 980（沿用 `breakpoint.shell_collapse` 与现有 `ui.viewport.collapsed`）时，九项顶部导航**保持单行、不换行**，溢出只发生在导航容器内部，文档不横向溢出。只需要以下最小 CSS 约束：
    - 去掉现有 `.nav-list` 的 `flex-wrap: wrap`，改为单行；
    - 导航项不收缩（`flex: none`），标签不折行（`white-space: nowrap`）；
    - 导航容器 `nav.rail-navigation` 设 `min-width: 0` 和 `overflow-x: auto`，纵向不滚。

    包含链的前两环已经存在：`.shell` 窄窗为 `minmax(0, 1fr)`，`.rail` 有 `min-width: 0`。实现只补第三环和单行规则。九项放得下时不出现滚动条，也不强求溢出。断点和令牌不变；当前项底边红条、折叠钮隐藏沿用 v1。不新增状态、令牌、overlay、JS 监听或自动滚动（不对当前项 `scrollIntoView`）。
- **规范登记（R5 F-02）**：导航决定同步登记到 `design/ui/UI_NAV.md` 暗色适配段（九项、无专题子项、窄窗单行加容器内横向滚动）和 `design/ui/README.md` 索引行，由 T-V2-01 先写资产、再写代码。`UI_LAYOUT.md#narrow` 原样采用，不写入（§7.2）。
- **`stores/app.ts`**：按 §7.2 的最小派生修改执行。契约侧的旧方法、类型、fixture 和覆盖项都保留，不删除，它们归契约拥有者。

### 7.5 工作台作业轨道（R-003）

- **页面结构**：`WorkbenchPage.vue` 依次为页头、`FocusBand`、`JobTrack`、`ModuleGrid`。`ModuleGrid` 仍是唯一的纵向滚动区。
- **轨道属性**：`JobTrack` 不是模块，不进入模块目录或 layout，也没有移除、排序或 AI 角标操作。
  - designUI §3.2 提到的“验证提醒”属于 spec 非目标（真实验证提醒），本轮不显示。
- **`JobTrack.vue` 结构**：
  - 容器是透明行，不加新的玻璃样式。
  - 卡片复用 `.glass-module`，保证文字只落在一层玻璃上。
  - 卡片列表横向排列，在轨道内部 `overflow-x: auto`；页面本身不出现横向滚动条。
  - 高度固定为一行。
  - 不引用 `updown.css`，不新增颜色字面量。
- **数据来源**：轨道和作业列表消费互动方 `jobsStore` 中的同一份未筛选列表缓存（H-2）。
  - 卡片集合 = H-2 的“进行中”selector 或常量作用在这份缓存上的结果。
  - 不从阶段状态推断进度。
  - 轨道不持有业务数据副本，本地只有展示用的 computed 派生。
  - 不持久化。
- **卡片内容**：
  - 显示标题和类型文案（`JobTypeLabel`）。
  - 四阶段固定按提取 → 处理 → 分析 → 交付排列。每段显示 `StageLabel`，再加 `StageStateLabel` 的图标和文案；运行中、待人工确认和冲突必须有文字。
  - `pendingCount > 0` 时显示“待介入 N”角标。
  - 作业状态复用互动方随 H-2 交接的 `JobStatusBadge`；未交接前 S1-track 保持 blocked，壳不用 `JobStatusLabel` 文案直出替代，也不维护第二份映射。
- **点击行为**：执行 `router.push({name:'job-detail', params:{id, stage: item.currentStage}})`。壳不推进阶段，也不改作业状态。具名路由 `job-detail` 只由 H-3 提供，未注册时 push 会抛错；壳不加 `hasRoute` 兜底，也不改为按 path 跳转。因此 S1-track 依赖 H-3 的“路由定义与 `main.ts` 注册”切片，但不等列表/详情页面功能：该切片集成前卡片不可点，S1-track 保持 blocked，也不提前演示未集成的界面。
- **三种状态**（读取 store 的读状态和错误）：
  - 加载：沿用 v1 的 Loading。
  - 空：按共享未筛选缓存区分两种静态文案，都提供 `/jobs` 链接。缓存为空时显示“暂无作业”，原因“还没有创建任何作业”；缓存非空但进行中集合为空时显示“暂无进行中的作业”，原因“现有作业均不在进行中”。原因由这两种情形静态给出，不为此在契约中加 `reason` 字段。
  - 错误：沿用 v1 的 ErrorState，诊断信息为 `{source:'job-track', code, message, ts}`；`code` 和 `message` 取自 store 错误，`ts` 是这次失败的时间；可以复制诊断。重试调用共享 refresh action。
  - 三种状态都不影响焦点带和模块区独立渲染。
- **刷新**：
  - 壳只在挂载时调用共享 ensure/load，并在错误重试时调用共享 refresh。
  - 其他更新都由互动方的“写回执 / agent 通知后重读”机制刷新同一份缓存，轨道随响应式更新。这包括轨道仍挂载时，在工作台打开采集抽屉完成投放归属的情况。
  - 壳不 watch agent store，不轮询，不建事件总线，不建第二套状态机。

### 7.6 全局投放（R-002）

- **入口**：`TopBar.vue` 新增文字按钮“投放”，点击时发出 `intake` 事件。`TopBar` 仍只接收 props，便于组件测试。
- **打开流程**：AppShell 处理 `intake` 事件，调用 `intake.open(session.context?.jobId)`。
  - 打开时对 `jobId` 做一次快照。
  - 在作业列表或其他非作业页面打开时，`jobId` 为 `undefined`。
  - 打开后路由变化不会改写这个快照。
- **挂载位置**：AppShell 第二行改为 `.route-area { position: relative; min-height: 0 }`，里面包含 `<main class="route-view">` 和 `<aside class="intake-slot" v-if="intake.isOpen">`。
  - `.intake-slot` 绝对定位，覆盖 `.route-area` 右侧整高。
  - 宽度为 `min(var(--fai-layout-intake-width), 50%)`；`z-index` 用已有的 `--fai-z-drawer`。
  - 不加遮罩，不加焦点锁，不设 `aria-modal`。
  - 打开时焦点移入 slot（`tabindex="-1"`）；关闭时焦点回到“投放”按钮。
  - 整个应用只有这一处挂载点。底部输入栏仍是全局固定件，不被 slot 覆盖。
- **与 AgentDrawer 共存（最小避让）**：
  - 投放打开时，AppShell 在 `.content` 上设置局部 CSS 变量 `--shell-intake-offset`，值等于 slot 宽度。这个变量沿 DOM 继承到底栏内的 `AgentDrawer`。
  - `AgentDrawer` 把 `inset-inline: 0` 改为 `inset-inline: 0 var(--shell-intake-offset, 0)`，让出右侧空间。
  - 两个面板都用 `.glass-drawer`，各自独立开关、并排显示，不新增第四层玻璃。
  - 不改 `ui.drawer` 或 `fai.drawer`，不新增配色，也不引入 overlay 管理器。
  - 支持的最小宽度是 960，这时两个面板仍能并排；`50%` 上限保证不溢出。三层玻璃和 v1 断点保持不变。
- **关闭**：执行 `intake.close()`。路由不变；壳不碰 agent store，后台 run 不会重启。
- **技术尺寸登记建议**：新增几何令牌 `layout.intake_width`，用于避免两个面板互相遮挡，直接服务 AC-002-8 和支持宽度。值在实施时确定，建议 `24rem`。
  - 实施时一次登记源 `tokens.json`，并在 `UI_DARK_ADDITIONS.md` 增加条目；`source` 指向 `design/ui/UI_DARK_ADDITIONS.md#drawer`。
  - 然后经 `pnpm -C frontend tokens` 再生成，不手改生成物。
  - 本轮不写入。

### 7.7 对话的作业上下文（R-005）

- **发送时捕获**：`agent/store.ts` 的 `send(message)` 在第一个 `await` 之前，同步读取 `useSessionStore().context` 的快照。`useSessionStore()` 只在 `send` 函数体内调用，不在模块顶层求值：互动方的 `jobs/**` 也导入 `agent/store.ts`，顶层调用会在模块初始化时形成循环；不为此新增抽象。
  - 有上下文时，调用 `agentClient.send({sessionId, message, jobContext})`。
  - 没有上下文时，payload 不出现 `jobContext` 键，形状与 v1 一致。
  - 不读 lastRun，也不读路由。
- **run 绑定**：`AgentRun` 增加 `jobContext?`。收到 `run.started` 时，把事件中的上下文写入 run；此后这个 run 的归属不再变化。切页、切阶段或清空 sessionStore，都不改写历史 run。
- **接收事件**：`receive` 原样接收并处理全部事件，不按作业过滤，也不丢弃任何事件。
- **不变规则**：模块角标（`badges.markRunning/settle`）、`running` 指示和“每个 run 恰好一个终态”的规则都不变，并且全局有效，不按作业拆分。
- **查看筛选（最小 API）**：store 提供 `runsFor(jobId?: string)`。
  - `undefined` 表示全部，包括无上下文的 run。
  - 传入 `jobId` 时，只返回绑定该作业的 run。
  - 不额外提供“仅全局”筛选。
  - AgentDrawer 页头新增“查看：全部 / 作业 X”选择器，选项来自当前 runs 中出现过的不同 `jobId`。选择结果只存在组件本地 ref，不持久化。
  - 筛选只影响展示，不影响 `receive`、角标或 `running`。
- **展示**：
  - 输入栏显示当前上下文 chip：有上下文时为“作业 {jobId} · {StageLabel}”，没有时为“全局”。
  - 每个 run 头部也显示它绑定的 chip；无上下文的 run 显示“全局”。
- **单次发送**：会话 ID 沿用 v1 的单会话。运行中禁止再次发送的规则不变，不扩展成多路并行发送。多作业交错只在 store 层验证（AC-005-9）。
- **上下文不带来新能力**：上下文不能让 agent 推进阶段，也不能让 agent 覆盖产物。

### 7.8 契约（R-007）

- **版本**：只由互动方统一升级到 2.0.0。只新增可选 `jobContext`，以及作业相关的方法和类型；原十类事件、v1 字段语义和唯一终态不变。
- **生成物**：只改生成源，再重新生成；生成和提交都由契约拥有者负责。
- **壳的使用范围**：壳只导入类型、`dataClient/agentClient`，以及 §7.3 已交接的 store 和组件。壳不改 schema、`CONTRACT_VERSION`、mock、fixtures 或契约测试，也不新增 schema 方法。
- **AC-007-5 证据**：生产方证据来自互动方的契约测试。壳只在 S1、S2 跑全量回归，作为参与证据，不代为勾选。

### 7.9 数据与存储

- 不新增 localStorage 键。
- 作业列表视图缓存属于互动方 `jobsStore`，只在内存中，壳不复制。run 不写入壳的持久化存储，对话历史和 v1 一样只在内存。
- `fai.rail`、`fai.drawer`、`fai.layout` 不迁移，也不改格式。
- `fai.jobs.v1` 和 `fai.inbox.v1` 属于互动方，壳不读也不写。

### 7.10 关键时序

1. **投放**：点击“投放”→ 快照 `session.context?.jobId` → `intake.open(jobId)` → `.intake-slot` 渲染 `IntakeDrawer`，AgentDrawer 让出右侧 → 用户关闭时调用 `intake.close()`，焦点回到按钮。路由和 run 都不受影响。
2. **工作台内投放写入**：轨道保持挂载 → 在采集抽屉中提交、确认或归属到作业 X → 互动方写回执 → 刷新 `jobsStore` 共享缓存 → 轨道卡片顺序和角标更新，并且与 `/jobs` 一致。整个过程中没有 run 终态，也没有手动重读。
3. **作业内发送**：从输入栏提交 → 同步捕获上下文 → 调用 `send` → mock 回放带 `jobContext` 的 `run.started` → `receive` 创建 run 并绑定归属 → 后续事件按 `runId` 归入 → 唯一终态。互动方 mock 状态层先处理事件再通知，并由 agent 通知重读同一份缓存，轨道和列表同步更新。
4. **离开作业**：路由离开 `job-detail` → sessionStore 在同一次导航内置为 `null`（H-4）→ 下一次发送不带 `jobContext`，chip 显示“全局”。

### 7.11 验收对应（52 条）

S0、S1-*、S2 的定义见 §7.13。`blocked_by` 表示：要等对应的生产方交接单元集成后才能验证。

| AC | 类型 | 落点与验证 | 阶段 |
|---|---|---|---|
| AC-001-1、AC-001-2、AC-001-3、AC-001-4、AC-001-5、AC-001-6 | 不变 | 沿用旧 §5。`pnpm -C frontend check` 自动覆盖 `JobTrack`、chip 和 slot：colors 检查；glass 只允许三类；updown 中轨道不得引用；`layout.intake_width` 纳入 generated 对拍 | S0/S1 |
| AC-002-1 | 不变 | 旧 §5；`e2e/shell.spec.ts` 回归 | S0 |
| AC-002-2 | 修改；部分集成 | **壳部分**：`shell.spec` 验证九项顺序、href、`aria-current`；格物致知占位 owner 为 `learning`，作业占位 owner 为 `workbench-interaction`；直达和刷新（含 `/jobs`、`/learning`）；没有 `.research-link`。v1 的八项菜单表及以它为参数的 `AC-002-2` 菜单 / 直达用例整体迁移为九项，删除 research 深链用例、保留 daily 深链，不留旧八项用例。<br>**S0 与 S2 的断言迁移**：`shell.spec` 中 `/jobs` 的壳占位子断言（owner / 占位文案）只是 S0 证据；H-3 集成后同名路由替换占位，由 S2（T-V2-09）把它迁移为集成态断言（`/jobs` 由互动方列表页渲染，不再期待壳 owner），以免全量运行时与集成态冲突。<br>**集成部分**：`integration-v2` 验证 `/jobs/:id/:stage` 直达、刷新后仍高亮“作业”，且名为 `jobs` 的路由只有一条。集成部分 blocked_by H-3 | S0 / S2 |
| AC-002-3 | 修改；集成 | `integration-v2`：通过 `jobFixtures` 新增一项，经 `/jobs` 可见并能进入详情。整项 blocked_by H-3/H-6。“无专题子项”并入 AC-002-2 壳部分 | S2 |
| AC-002-4 | 修改 | `topbar.spec`：保留原有 ticker 和状态点断言；新增“投放”按钮可见、文案为“投放”、点击发出 `intake` 事件 | S0 |
| AC-002-5 | 不变 | `shell.spec` | S0 |
| AC-002-6 | 不变 + 回归 | **S0 窄窗导航（G-02 已裁定）**：T-V2-01 在它拥有的 `e2e/shell.spec.ts` 新增 `AC-002-6 v2-nav` 用例。在 960 / 979 下按几何验证：九项位于同一行，不写导航高度数值；导航容器 `overflow-x` 为 `auto`，内部可横滚，最后一项可达；文档不横滚。T-V2-01 不写 `breakpoints.spec`，只用 `-g "AC-002-6"` 全前缀回归其原断言。<br>`breakpoints.spec`（T-V2-08）：10 个视口不变（960/979/981/1239/1241/1399/1401/1499/1501/1440×900）。新增断言：轨道存在且没有横向溢出；在 960 和 1440×900 下同时打开投放和对话，仍没有溢出 | S0 / S1-track、S1-intake / S2 |
| AC-002-7 | 不变（回归更新） | `shell.spec`：进度断言按 3 个加载步骤更新实测值，状态文案不含“研究列表”（`stores/app.ts` 最小派生修改）；`boot-error` 重试路径不变 | S0 |
| AC-002-8 | 新增；集成 | `integration-v2`：在工作台、`/jobs`、作业详情和 `/prices` 点“投放”，都进入同一个 `.intake-slot`。作业详情页的快照 `jobId` 等于当前作业，其他页面为 `undefined`。在 `long` run 运行中关闭投放后：URL 不变，`runId` 不变，步骤继续增加且不重复。blocked_by H-4/H-5 和 `IntakeDrawer` 页面交接 | S2 |
| AC-003-1、AC-003-2、AC-003-3、AC-003-4、AC-003-5 | 不变 | 旧 §5：`focus-band.spec` / `workbench.spec` | S0 |
| AC-003-6 | 不变 + 回归 | `workbench.spec`：增删模块后，焦点带和轨道都还在 | S1-track |
| AC-003-7 | 新增；部分集成 | **组件部分**（`job-track.spec`）：使用真实 Pinia、互动方真实 `jobsStore` 和真实 mock `dataClient`，只在系统边界通过 mock 覆盖或场景注入，不 `vi.mock` 内部模块，不抄业务逻辑。验证：名称、类型文案、四阶段顺序、状态文案和图标、待介入角标。**关键用例**：轨道保持挂载，`agent.runs` 中没有任何终态，调用随 H-2·列表交付并登记的那个写 action（§7.3 H-2⑤，名称以交接 SHA 为准）→ “待介入 N”、卡片集合或顺序自动变化，且与该 store 列表 selector 中同一作业的值一致；测试不调用任何手动重读。<br>**集成部分**（`integration-v2`）：在工作台打开投放，完成到进行中作业的归属，期间轨道不卸载 → 轨道更新 → 进入 `/jobs`，进行中项的集合、顺序和待介入数都与轨道一致 → 点击卡片进入 `/jobs/:id/<currentStage>`。集成部分 blocked_by H-3/H-5 | S1-track / S2 |
| AC-003-8 | 新增 | `workbench.spec` 和 `modules.spec`：DOM 顺序为 Focus → Track → Grid；模块库中没有轨道；轨道没有移除、上移或下移操作；增删、移动模块并刷新后，轨道位置不变 | S1-track |
| AC-003-9 | 新增 | `job-track.spec`：`slow` 触发加载态；`empty` 触发“暂无作业”空态；用 `jobFixtures` 覆盖为只含非进行中作业时，触发“暂无进行中的作业”空态（依赖 H-6 的替换能力；未交付则 S1-track 对应任务整体 blocked）；两种空态都提供 `/jobs` 入口；`error` 触发错误态，可复制诊断，重试调用共享 refresh。三种状态下焦点带和模块区都能独立渲染 | S1-track |
| AC-004-1、AC-004-2、AC-004-3、AC-004-4、AC-004-5、AC-004-6 | 不变 | 旧 §5。AC-004-1、AC-004-2 的回归与 AC-003-8 共用 | S0/S1 |
| AC-005-1 | 修改（路由数） | `agent.spec`：九个导航路由上输入栏都可见；提交后抽屉展开并显示用户消息 | S0 |
| AC-005-2、AC-005-3、AC-005-4、AC-005-5、AC-005-6、AC-005-7 | 不变 | 旧 §5：`timeline.spec` / `agent.spec`。v1 的无上下文脚本全部照旧通过 | S1-ctx |
| AC-005-8 | 新增；部分集成 | **单元部分**（`agent-context.spec`）：发送时捕获快照；无上下文时 payload 中没有该键；归属由 `run.started` 绑定；sessionStore 变化不改已有 run。<br>**端到端部分**（`integration-v2`）：在 `/jobs/:id/analyze` 用 `long` 发送，chip 显示该作业和阶段；切到 `deliver`，再切到 `/prices`，原 run 的 chip 不变。之后等原 `long` run 出现唯一终态、输入栏运行中指示消失（运行中禁止再发，所以须显式等待，不用固定延时），再做全局发送：新 run 显示“全局”，且不带 `jobContext`。H-1 的 mock 会把 payload 上下文原样写进事件，所以新 run 没有上下文，就证明 payload 没有沿用旧上下文；payload 中没有该键由单元部分直接断言。端到端部分 blocked_by H-1/H-3/H-4 | S1-ctx / S2 |
| AC-005-9 | 新增 | `agent-context.spec`：使用真实 mock `AgentClient` 和 fake timers，交错回放作业 A、作业 B 和无上下文 run。`runsFor('A')` 只含 A 的 run，`runsFor()` 包含全部 run（含无上下文）；`receive` 收到全部事件；模块角标不变；每个 run 恰好一个终态。`timeline.spec` 补充选择器和 chip 断言（全局 run 显示“全局”） | S1-ctx |
| AC-006-1、AC-006-2、AC-006-3、AC-006-4 | 不变 | 旧 §5 | S0 |
| AC-007-1、AC-007-2、AC-007-3、AC-007-4 | 不变 | 旧 §5。network 守卫纳入新文件；壳侧 e2e 继续使用 normal、empty、error、slow 场景。2.0.0 文档由生产方重新生成，壳只跑 `check --only generated` 作为回归 | S1 |
| AC-007-5 | 新增；生产方证据 | 由互动方契约测试证明三点：可选上下文已声明；旧消息和 fixtures 能解析；新上下文能透传。壳跑全量回归只作参与证据；没看到生产方证据前不得勾选 | S1/S2 |
| AC-008-1、AC-008-2、AC-008-3 | 不变；AC-008-1 加导航条目同步 | 旧 §5。新令牌的 `source` 必须能解析（AC-008-2）。S0：`design/ui/UI_NAV.md` 暗色适配段与 README 索引行改为九项，`UI_NAV` 的窄窗形态写为单行、导航容器内部横向滚动（G-02 已裁定）；`UI_LAYOUT.md` 原样采用、不写入；registry 测试不回归，`design/ui` 中不再出现“八项 / getResearchList / 研究扩展 / 研究列表”（R5 F-02） | S0、S1-intake |
| AC-009-1 | 不变 | `pnpm -C frontend test` 全绿；只有集成后的全量结果才算 v2 证据 | S2 |
| AC-009-2 | 不变 + 扩充 | `manual-acceptance.md` 保留 M-01～M-08，新增 M-09～M-12；`manual-acceptance.spec` 同步；Handoff 时附截图 | S0 文本 / S2 截图 |

### 7.12 测试命令、人工验收与回滚

- **现有命令**：
  - `pnpm -C frontend check [--only <name>]`
  - `pnpm -C frontend typecheck`
  - `pnpm -C frontend test:unit -t "AC-005-9"`
  - `pnpm -C frontend test:e2e -g "AC-003-8"`
  - `pnpm -C frontend test:e2e e2e/integration-v2.spec.ts`
  - 全量：`pnpm -C frontend test`，即 `check + typecheck + lint + test:unit + test:e2e`
- **证据边界**：上面的命令和新增文件都是计划，本轮没有运行，也不是验收证据。
- **人工验收**：
  - M-09 导航：九项菜单；作业详情高亮“作业”；没有专题子项；格物致知占位页注明归属；窄窗（960）下九项单行、在导航内部横滚，页面不横滚（G-02）。
  - M-10 轨道：位置正确；没有新增玻璃层；四阶段和状态不只靠颜色区分；三种状态都能看到；在 1440×900 下不挤压；工作台投放后轨道当场更新。
  - M-11 投放：非模态；与对话抽屉并排；在 960 下不溢出；关闭后回到原页面；底栏输入栏始终可见。
  - M-12 上下文：chip 正确；可按作业查看；离开作业后发送为全局。
  - 视口沿用 10 个，与 AC-002-6 相同。
- **精确回滚**：只撤销 v2 补丁本身。
  - 优先对已隔离的 v2 壳方提交执行 `git revert`。
  - 如果与后续功能有共享行冲突，只按最小 hunk 人工回退，然后重跑 `pnpm -C frontend test` 复验。
  - **禁止**用 `git checkout <SHA> -- <文件>` 整文件覆盖，因为会冲掉后续功能。
  - 新令牌通过修改源文件、再重新生成来撤销。
  - 同时撤回 M-09～M-12 和新增测试。
  - `specs/README.md` 只改本 feature 一行。
  - 禁止使用旧 §6 的删除整个 `frontend/`；禁止撤销互动方的 jobs、契约或 `main.ts` 修改。
  - 撤销壳侧改动后，依赖壳的互动方 H 组 AC 恢复为 blocked。

### 7.13 分阶段依赖（实施依赖与设计输入分开）

| 阶段 | 内容 | 依赖（交接单元按 §7.3 集成） | 可验证 | 说明 |
|---|---|---|---|---|
| S0 壳独立 | nav、router、Rail、`stores/app.ts` 与 `PlaceholderPage.vue` 最小派生修改；`design/ui` 导航条目同步（§7.2）；TopBar 按钮；M-09～M-12 文本 | v1 Handoff SHA（已满足 `43b6d79`）；G-02 裁定（已满足，2026-10-28：单行 + 容器内横滚）；本次 G-02 设计修改须经 Analyze R8 与 A R4 定向复核 | AC-002-2 壳部分、AC-002-4、AC-002-6 窄窗导航、AC-002-7、AC-005-1、AC-008-1 导航条目，以及不变项回归 | 未接线的按钮不能宣称满足 AC-002-8；S0 不单独 Handoff |
| S1-ctx | agent 上下文：store、chip、`runsFor`、选择器 | S0 + H-1、H-4；chip 另外需要 H-2 中的 `StageLabel` 导出（不需要等共享列表缓存）；条件依赖 H-3 路由切片（H-4 只经路由守卫设置 context 时） | AC-005-8 单元部分、AC-005-9、AC-005-2～AC-005-7 回归 | 可以独立开启 |
| S1-track | `JobTrack` | S0 + H-2（含 `JobTypeLabel`、`JobStatusBadge`）、H-3 的路由定义与注册切片（不含页面功能）、H-6 | AC-003-7 组件部分、AC-003-8、AC-003-9、AC-003-6 和 AC-002-6 回归 | 可以独立开启；H-2 共享缓存、`JobStatusBadge` 或 H-3 路由切片任一未交接时保持 blocked |
| S1-intake | AppShell slot、令牌、AgentDrawer 避让 | S0 + H-4、H-5 | AC-008-2 新令牌、AC-002-6 双抽屉回归 | 从依赖上看可以独立开启；但它和 S1-ctx 都要写 `AgentDrawer.vue`，Tasks 按文件唯一写入者串行（先做 S1-ctx 的选择器，再做 S1-intake 的避让），所以实际排期会继承 S1-ctx 的交接前置 |
| S2 集成 | `integration-v2`、全量命令、人工截图 | 全部 S1-* + H-3 + 互动方页面和 `IntakeDrawer` 已集成 | 集成部分：AC-002-2、AC-002-3、AC-002-8、AC-003-7、AC-005-8；AC-009-1；AC-009-2 截图 | 外部阻塞未解除时，Converge 必须报告“未收敛（外部阻塞）” |

**依赖链是单向的**：

- 双方都从 v1 Handoff SHA 起步。
- 互动方 A～G 组只依赖 v1，不依赖壳。
- 壳的各 S1 子阶段只依赖互动方对应的交接单元，交接单元不要求互动方先 Handoff 合入 main。
- 互动方 H 组集成验证依赖壳 S1。
- 双方都不需要等对方全量完成，因此没有循环依赖。完整集成后，双方仍各自走 Review、Gate 2、Handoff。

### 7.14 风险

| 风险 | 对策 |
|---|---|
| 生产方接口名或字段与设计输入不一致 | 任务以 §7.3 交接单元的 SHA 为前提开启；有差异就更新 Tasks，壳不兜底 |
| 互动方 R3 未通过，后续审核继续推迟（R3 补记：R6 已通过，但未吸收 §7.3 新增要求） | 相关 S1/S2 保持 blocked；壳不修 B-09/B-10，不把旧 R2 或不含新增要求的 R6 当成依赖已完成 |
| H-2 的共享未筛选缓存、刷新覆盖面、进行中判定或 `JobTypeLabel` 缺失 | 由互动方在其 Plan/Tasks 中补齐；对方拒绝时报 Walter 裁决。壳不自建缓存、映射、轮询或 watch 终态 |
| 列表筛选覆盖共享缓存，导致轨道与列表不一致 | H-2 ④ 约束；AC-003-7 集成部分在筛选后返回工作台复验 |
| `addRoute` 同名替换失败，出现双路由 | 在 `integration-v2` 中断言名为 `jobs` 的路由只有一条 |
| sessionStore 清空时机滞后 | 由 H-4 约束为同一次导航内同步清空，并由 AC-005-8 端到端部分覆盖 |
| 投放与对话抽屉在窄宽下互相遮挡 | 在 960 和 1440 下同时打开两者，跑 breakpoints 断言，并做 M-11 人工验收 |
| 轨道挤压 900 高度的视口 | 轨道固定一行，由 AC-002-6 和 M-10 验证 |
| 契约 2.0.0 使 v1 测试变红 | 壳只更新与壳语义相关的测试；契约测试由互动方修复 |
| v1 Handoff 延迟 | 整体 blocked，不用 `fdaa7d8` 或 `0ffa15e` 提前开工（R3：已解除，Handoff SHA = `43b6d79`） |
| 窄窗导航形态与 `UI_LAYOUT.md#narrow` 不一致（R3 新发现；v1 P3 H-02） | **已裁定（Walter 2026-10-28 回复“可以”）**：采用横向滚动，即九项单行、导航容器内部横滚、页面不横滚，按 `UI_LAYOUT.md#narrow` 原规则执行，不写入该文件。§7.2 / §7.4 / §7.11 / §7.13 已据此修改，须经 Analyze R8 与 A R4 定向复核后 T-V2-01 才开工。T-V2-01#4 用几何断言防回退为换行，并验证文档不横滚。v1 P3 台账 H-02 原文不改；本 Plan 不宣称 H-02 已关闭、v1 截图已补齐或视觉验收已完成 |
