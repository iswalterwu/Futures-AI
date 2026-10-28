# frontend-workbench v1 Review 整改 · Analyze

- 日期：2026-10-28。
- 阶段：T-16 实施前的只读一致性分析；只记录结果，不修改冻结 spec / Checklist。
- 输入：重新读取 AGENTS.md、docs 三件套、spec.md、plan.md、tasks.md、checklist.md、review.md；当前分支 `feat/frontend-workbench`，HEAD `0ffa15e`，加本轮已登记的 plan / tasks 文档改动。
- 用户授权：Review 后“继续”，本轮仅关闭 R1-01 与补齐 R1-09 的流程文档；P3 非默认扩改，Gate 2 尚未批准。

## 结论

**无剩余 spec / plan / tasks 冲突、缺失 AC 或任务依赖问题，可进入 T-16 Implement。** R1-01 是已登记的实现 / 契约展示精度缺陷，不新增用户行为；本轮不改 spec，不需要重过 Gate 1。变化量默认精度是 plan 的实现细节，不改变既有“按显示位取整后判零、零中性”的需求。

## 发现与处理

| 项 | 分析 | 处理 |
|---|---|---|
| R1-01 | 价格与百分比变化量共用精度，已由独立 A 认定为 P2；原测试把错误显示固化为期望 | plan §2.1 / §2.7 登记 `deltaDecimals?` 与共享 `figureDeltaDecimals`；T-16 明确修改范围、回归用例、重生成与命令 |
| R1-09 | tasks 仍称草案；TS 5.9.2 未回写 plan §1；没有 Converge 证据 | 文档先补生效状态、原 15 项实施提交、实际 TS 版本；T-17 负责完成后的实测与 Converge |
| 其余 P3 | 首轮只有 P3；多数涉及未来真实 API / agent-runtime / 后续 UX，不应偷偷扩大本轮范围 | tasks 的 P3 台账逐项登记后续归属与 AC；“登记”不等于已修复 / 风险已接受，Gate 2 仍待用户确认 |
| 人工验收 | AC-009-2 允许 Handoff 附图，M-01 ~ M-08 尚未执行 | 保持原人工清单未勾选，不把自动化结果冒充视觉验收 |
| 生成物 | 可选精度字段进入公开契约，不能手改 CONTRACT.md / schema.json | T-16 只改 schema 源与消费代码，执行 `pnpm -C frontend contract`，再只读对拍 |

## 结构核验（实施前、只读 Node 内存脚本）

```text
SPEC_AC       45
PLAN_MISSING  []
TASKS_MISSING []
TASKS         T-01 ~ T-17（17 项）
HOURS         28 = 原 25.5 + T-16 1.5 + T-17 1
DEPENDENCIES  前向引用 []（全部依赖更小编号，无环）
CHECKLIST     70 checked / 0 unchecked（实施者未修改）
POLICY        plan 已登记 figureDeltaDecimals(figure) 与 deltaDecimals?
GIT_DIFF_CHECK 通过（仅仓库既有自动换行提示）
```

原 T-01 ~ T-15 的任务提交号已用 `git log --all --grep='^T-'` 核实。AC 集合来自冻结 spec 的 45 条编号，plan / tasks 展开编号区间后比对均无遗漏；未增加检查器、脚手架或工具流程。

## 后续

T-16：先跑针对真实实现的失败回归，再修复并重生成契约；T-17：全量测试 / 构建后写 Converge 证据，再由独立 A 定向复核。**本 Analyze 不代表实现已完成、已收敛或 Review 已通过。**

## Handoff 合并主线后的只读复查（2026-10-28）

- 执行者：Handoff = claude-opus-5-5 via anthropic（AGENTS §6 Handoff 首选；只读复查，不改冻结 spec / Checklist）。
- 起因：AGENTS §2 第 11 步——合并 `origin/main`（`3bf6476`）时有 5 处内容冲突（`.gitignore`、`AGENTS.md`、`docs/designUI.md`、`docs/plan.md`、`specs/README.md`），其中 designUI / plan 涉及设计语义，解决后回到 Analyze 复查。合并提交 `8920b06`。

| 检查 | 结果 |
|---|---|
| 冻结 spec / Checklist / plan | `git diff b991059 8920b06` 对 `spec.md`、`checklist.md`、`plan.md` 均为空；45 条 AC 与 Checklist 70/70 未动 |
| 代码与规范资产 | `git diff b991059 8920b06 -- frontend design` 为空；合并未改任何实现 |
| 主线权威文件 | `backend/`、`AGENTS.md`、`docs/interaction.md`、`docs/architecture.md`、D-016 ~ D-019、`specs/data-layer`、`specs/settings`、`templates/` 与 `origin/main` 逐字一致（AGENTS §6 模型路由未回退） |
| D-015 | plan §3 预留行换成正式行并记完成；ADR、spec / plan / tasks、designUI §2.2、`design/` 7 个文件均为 D-015；历史评审记录保留 D-013 + 勘误说明——与主线“编号说明”四步一致 |
| designUI 合并结果 | 保留主线 §1 新原则、§2.4 状态与来源、§3 双区 / 作业 / 介入界面、§5.2 块模型、§6 新增组件、§8 新登记规则；保留本分支 §2.1 玻璃边注、§2.2 D-015 作用域、§2.3 / §6 / §8 指向已移植条目；§3.10 加注“v1 为已交付地基，9 项菜单 / 作业轨道等由 v2 与 workbench-interaction 规格承载” |
| v1 spec 与新交互文档的关系 | D-016 / D-018 把菜单改为 9 项并新增作业轨道，与冻结 v1 的 R-002 / R-003 不同；按 D-016“影响”与 plan §9 的批准记录，这由 `frontend-workbench` v2（独立分支，另过 Gate 1）承载，v1 不回改——不构成 v1 的 spec / plan / tasks 冲突 |
| 令牌来源与文档指针 | `tokens.json` 引用的 designUI §2.1 / §2.2 在合并后各唯一存在；§2.3 / §6 / §8 指针仍指向真实条目（`pnpm -C frontend test` 中 AC-008-1 / AC-008-2 通过） |

**结论：无新增冲突、缺口或歧义；不需要新增 v1 实现任务。** Handoff 视觉检查新发现的 H-01 / H-02 是实现外观问题，已登记到 tasks.md「P3 后续台账」，与本次合并无关。

## 恢复：H-01 修复（T-18）实施前的只读一致性分析（2026-10-28）

- 执行者：Analyze = claude-opus-5-5 via anthropic（claude-bridge 最小探活额度耗尽，换通道不换模型）；只读分析，不改 spec / Checklist / manual-acceptance。
- 输入：重新读取 AGENTS.md、docs/plan.md、docs/designUI.md、本 feature 的 spec / plan / tasks / checklist / review / analyze / converge / manual-acceptance、`assets/handoff/README.md`、`design/ui/UI_FONTS.md` / `UI_FOUNDATIONS.md` / `UI_TABLES.md` 中的数值字族条目，以及真实源码 `SampleChart.vue`、`shared/num.css`、`PlaceholderPage.vue`、`AppShell.vue`、`e2e/theme.spec.ts`、`e2e/tokens.spec.ts`、`playwright.config.ts`。
- 基线：`fix/frontend-workbench-visual` @ `43b6d79`，加本轮 plan §7 / T-18 / review §10 / 状态表的文档改动。

### 结论

**无 spec / plan / tasks 冲突、缺失 AC 或依赖问题；T-18 可进入 Implement。不需要改冻结需求，不需要重过 Gate 1，不需要新 ADR。** 本结论不代表 T-18 已实施、已收敛或 Review 已通过；本次修复的 Gate 2 未批准。

### 发现与处理

| 项 | 分析 | 处理 |
|---|---|---|
| 修复是否触及需求 | R-001 / AC-001-4 要求 KPI 外的数值等宽 + tabular，并且“表格与卡内数值右对齐”；UI_FOUNDATIONS / UI_TABLES 的右对齐针对数值格 / 数值列，用于竖向比对。图注里嵌在句中的计数是行内文字。修复只把该元素的 `display` 改为行内，字族、tabular、nowrap 与计算值 `text-align` 都不变；既有 `tokens.spec` 的 AC-001-4 断言（读计算 `text-align` 为 `right`）继续成立 | 属实现纠偏，不改 AC 文字或判据；plan §7.2 写明理由 |
| 修复面最小性 | 根因在全局 `span.num { display:block }` 与 flex 块化的组合。改全局会影响盘面 / 关注列表 / KPI 变化量等全部 `span.num`；局部 scoped 规则特异度（0,2,1）> 全局（0,1,1），仓库已有 `.placeholder-page .num` 先例 | T-18 限定 `SampleChart.vue` 一条 scoped 规则 + `e2e/theme.spec.ts`；回归要求断言图注以外的 `span.num` 仍为块级 |
| 测试有效性 | 旧 e2e 只断言 `textContent`，旧实现本来就能通过。新回归要读真实计算样式与 Range 几何；三段分居三行时竖向区间没有交集，旧实现必然失败。不用“顶边相等”判定，避免等宽 / 无衬线字体内容区高度不同造成误判 | plan §7.3 定义判据；T-18 完成标准 1 要求先红后绿，并记录失败摘要 |
| 视口与魔数 | 两档取 `T.window.width` / `T.window.min_width` × `T.window.height`，均为已登记令牌；不新增视口常量 | 已写入 plan §7.3 与 T-18 |
| 截图证据 | 测试先截图后断言，所以红跑也能出修复前图；Playwright 输出到已被 `.gitignore` 忽略的 `frontend/test-results/`，每次运行会清空，需要在红跑后、绿跑前复制。960 下模块区需要滚动（H-02 现状），截图前显式滚动到位 | T-18 验证命令 1 / 2 写明复制时机；新目录 `assets/h01-fix-20261028/`，不碰 `assets/handoff/` |
| 无横向溢出条款 | 引用 AC-002-6 只用于“无横向溢出”一项回归，不涉及 H-02 的窄窗导航高度；H-02 仍留待 v2 | T-18 / plan §7.4 已注明 |
| `span.num` 遍历范围 | 加载页的 `span.num` 由 `v-if` 移除，工作台就绪后不在 DOM 中，不会干扰“图注以外仍为块级”的断言 | 无需处理 |
| 范围外事项 | H-02、11 项已接受 P3（含 R2-01 头部计数）、拆包、v2 均未进入 T-18 | 保持现状；tasks 头部历史计数不改，末尾追加合计 |

### 结构核验（只读 Node 内存脚本 + git）

```text
SPEC_AC        45（冻结 spec，未改）
T18_AC         AC-001-4, AC-006-3, AC-002-6, AC-006-4, AC-009-1, AC-009-2 —— 全部存在于 spec
PLAN7_AC       AC-006-3, AC-001-4, AC-002-6, AC-009-1, AC-009-2 —— 全部存在于 spec
TASKS          T-01 ~ T-18（18 项）
HOURS          29 = 原 25.5 + T-16 1.5 + T-17 1 + T-18 1
FORWARD_DEPS   []（T-18 依赖 T-04、T-12）
T-18           完成标准 5 条 ↔ 验证命令 5 条，一一对应
CHECKLIST      70 checked / 0 unchecked（未改）
MANUAL         0 checked / 8 unchecked（未改）
FROZEN         git diff --quiet 43b6d79 -- spec.md checklist.md manual-acceptance.md converge.md assets/ frontend/ design/ docs/ AGENTS.md backend/ → exit 0
HISTORY        plan.md / review.md 相对基线只有新增行；tasks.md 只改 H-01 / H-02 台账状态与 4 行 AC 覆盖映射（追加 T-18），其余为新增
```

首次分析未发现需要回修的 plan / tasks 问题，因此没有重复运行。

## Converge 时的只读一致性复查：H-01 截图证据口径（2026-10-28）

- 执行者：Converge = claude-opus-5-5 via anthropic（bridge 本窗口额度耗尽，不重复试）；只读复查，不改 spec / Checklist / manual-acceptance / 上节历史。
- 起因：plan §7.3 步骤 2 规划的是 `figure` 截图，实施实际取 `figcaption` 特写（960 下 H-02 使整图被模块区裁切）。plan 已追加 §7.6 校准截图口径。

| 检查 | 结果 |
|---|---|
| 与 T-18 完成标准 5 是否一致 | 标准 5 只要求四个文件名、宽窄均滚动到位、仅 mock normal、README 元数据与“AI 视觉非人工验收”声明，未限定 figure / figcaption；图注特写满足其全部条款 |
| 与 T-18 验证命令是否一致 | 命令 1 / 2 复制的是 `test-results/**/sample-chart-*.png`，与实际产物名一致；口径校准不改命令 |
| 与 plan §7.4 / AC 是否冲突 | 不冲突：AC-001-4 / AC-006-3 的自动判据是浏览器计算样式与 Range 几何，截图只是 M-08 / AC-009-2 的辅助证据；未改 AC 文字或判据，不需回流 Clarify / Gate 1 |
| 是否越过 H-02 边界 | 否：§7.6 明确特写不证明 960 下整图一屏完整；H-02 仍留待 v2、未修复 |
| 冻结件 | `git diff --exit-code 43b6d79 -- specs/frontend-workbench/{spec,checklist,manual-acceptance}.md specs/frontend-workbench/assets/handoff` → exit 0；Checklist 70/70、人工 0/8 勾选未动 |

**结论：证据口径与 T-18 一致，无新增冲突、缺口或歧义；不需新增任务。**

## M-08 整图证据补采（T-19）实施前的只读一致性分析（2026-10-28）

- 执行者：Analyze = claude-opus-5-5 via anthropic（bridge 本窗口额度耗尽，不重复探活）；只读，不改 spec / Checklist / manual-acceptance。
- 输入：重新读取 AGENTS.md、docs/plan.md、docs/designUI.md、冻结 spec、plan §7 ~ §8、tasks T-18 / T-19 / 台账、checklist 状态、review §12 ~ §15、`review-h01.md` P3-1、converge §9、manual M-08、`assets/h01-fix-20261028/README.md`；只读源码 `SampleChart.vue`、`ModuleGrid.vue`（滚动容器 `.modules-container`）、`e2e/theme.spec.ts`、`playwright.config.ts`、`tests/unit/manual-acceptance.spec.ts`。基线 `docs/frontend-workbench-m08-evidence` @ `44845c8`。

| 检查 | 结果 |
|---|---|
| 需求 / 范围 | T-19 只补 AC-009-2 / M-08 的截图证据，不改实现、不改 AC 文字或判据；不需要回流 Clarify / Gate 1 / ADR |
| AC 对应 | T-19 引用 AC-009-2、AC-006-3、AC-006-4、AC-001-4、M-08，全部存在于冻结 spec；AC 覆盖表 AC-009-2 行已追加 T-19 |
| 标准 ↔ 命令 | 完成标准 4 条 ↔ 验证命令 4 条一一对应；依赖 T-18（已合并），无前向依赖；合计 19 项 / 29.5 h |
| manual 改动风险 | `manual-acceptance.spec.ts` 校验 M-01 ~ M-08 顺序、每节含 AC 与“操作 / 看什么 / 截图证据”字段及勾选行；T-19 只在 M-08 现有行追加链接与补充记录，验证命令 2 复跑该单测兜底 |
| 证据完整性 | plan §8.2 采集前断言覆盖可视完整（viewport + `.modules-container`）、图注 + SVG 完整、图注一行、透明与实例来源；§8.3 元数据含来源 HEAD / frontend 树 / 版本 / bounds / SHA256 / AI 非人工 |
| 边界 | 不改 `frontend/` 及冻结件；旧 60 图与 4 张图注特写由验证命令 3 的 `--exit-code` 保护；960 整图不采（H-02），H-02 / v2 / 旧 11 项 P3 不在范围 |
| Checklist / 人工 | Checklist 70 checked / 0 unchecked（未改）；manual 0 checked / 8 unchecked（未改） |

**结论：无 spec / plan / tasks 冲突、缺口或歧义，T-19 可进入 Implement。** 首次分析未发现需回修项，未重复运行。本结论不代表已采集、已收敛或 Review 通过。
