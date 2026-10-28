# frontend-workbench v1 · Converge（Review 整改后）

- 日期：2026-10-28；执行者：实施会话（非独立审核员）。
- 输入：本阶段重读 AGENTS.md、docs 三件套、冻结 spec、更新后的 plan / tasks、Checklist 状态、第一轮 review 与 Analyze；核对实际源代码差异、契约生成物及本轮测试输出。
- 代码基线：`923e238`（T-16）；原 v1 完工基线 `b7da4fe`；第一轮报告原件提交 `e282c56`。本报告及完成状态由 T-17 提交。
- 范围：原 T-01 ~ T-15 + Review 整改 T-16 / T-17；不包含 v2 原型或 D-018 术语变更。

## 1. 结论

**已收敛（v1 实现与自动化验证范围）。** 冻结 spec 的 45 条 AC 均有实现 / 自动检查或已交付人工清单的落点，R1-01 已修复并有失败到通过的回归证据，未发现还需追加 Implement 的阻断性缺口。

此结论**不表示独立 Review 已通过、Gate 2 已批准或人工视觉验收已完成**。第一轮 P3 已逐项登记；R1-09 的文档缺口已补齐、待 A 复核，其余 9 项未修复且尚未获用户风险接受。M-01 ~ M-08 保持待人工验收，按 spec 在 Handoff 附图。

## 2. R1-01 收敛证据

- `frontend/src/contracts/types.ts`：`decimals` 明确为主数值精度；新增可选非负整数 `deltaDecimals`，描述缺省策略与显式 0。旧 fixture 不变，未用改数据绕过缺陷。
- `frontend/src/shared/format.ts`：`figureDeltaDecimals(figure)` 统一解析（显式值优先；缺省 pct 两位，abs / 未指定口径沿用主值精度），供真实 `Kpi.vue` 与 `BoardGrid.vue` 复用；原 `fmtValue` / `fmtDelta` 的取整与判零逻辑未改。
- 默认焦点带变化量现在为 `['+1.50%', '-0.46%', '+0.60%', '-35', '+0.8', '0']`；主数值仍为 `['512.6', '4,320', '3,018', '2,460', '76.8', '820']`；LPG 为跌色，不再中性。
- 显式 `deltaDecimals: 0` 仍显示中性 `0%`；三位精度可显示 `-0.004%`，缺省两位时同一小变化为中性 `0.00%`；abs 可独立指定精度；空值仍为 en dash、负零不带号不着色。
- `contracts/CONTRACT.md` / `schema.json` 均由 `pnpm -C frontend contract` 重生成；公开字段为可选项，契约版本保留未 Handoff 的 v1 `1.0.0`。
- 新增 21 条单元 / 组件用例（契约 5、KPI 10、盘面 6）与 1 条浏览器用例；修正原组件 / E2E 中的错误期望；e2e 不再通过把 LPG 的价格精度手改成两位来验证跌色。

## 3. 本轮命令与实际结果

证据目录：本机 `%TEMP%/frontend-workbench-v1-fix.2AB5QW/`；日志不入库，以下为可留库的输出摘要。没有私有文档、头寸或凭证。

| 命令 | 实际结果 |
|---|---|
| 修复前 `pnpm -C frontend test:unit -t R1-01` | **exit 1（预期失败）**；14 failed / 7 passed / 538 skipped。真实旧实现分别输出 `0%` / `+1%`、将盘面低幅变化判中性、丢弃独立精度字段；日志 `red.log` |
| `pnpm -C frontend contract` | exit 0；12 methods / 10 events / 2 artifacts generated |
| `pnpm -C frontend check --only generated` | exit 0；156 tokens / 5 token artifacts match；契约重生成一致 |
| `pnpm -C frontend typecheck` | exit 0 |
| `pnpm -C frontend test:unit -t 'R1-01\|AC-001-4\|AC-001-5 num\|AC-003-1\|AC-003-4\|AC-004-5 board\|AC-007-3\|AC-007-4'` | exit 0；7 文件 / **128 passed**、431 skipped（合计 559） |
| `pnpm -C frontend test` | **exit 0**；六项守卫全绿（colors 24/24 阳性、0 阴性）；typecheck / lint 通过；Vitest 14 文件 / **559 passed**（2.57s）；本机 Chrome Playwright **66 passed**（1.1m）；日志 `tests.log` / `tests.exit` |
| `pnpm -C frontend build` | **exit 0**；828 modules，构建 503ms；JS 780.57 kB / gzip 263.31 kB；仅 >500 kB chunk 提示，非构建失败；日志 `build.log` / `build.exit` |
| `git diff --check` | 通过；无尾随空白错误 |

上表带 `\|` 的单元测试选择器是 Markdown 表格转义；终端执行时为普通 `|`，与实际命令一致。T-16 的三个验证命令涵盖的用例均包含在定向 / 全量运行中；未把“被跳过”算为通过。

## 4. 45 条 AC 的实现与验证对拍

下列测试路径均相对 `frontend/`；守卫均为真实 `scripts/check.mjs`。`自动通过 + 人工待验` 表示自动部分通过，不等于整条视觉 AC 已验收。全部自动结果来自本轮 §3，不是旧计数的转述。

| AC | 实现 / 验证证据 | 收敛状态 |
|---|---|---|
| AC-001-1 | tokens-build / generated；e2e/tokens.spec.ts 对拍运行时 156 个根变量 | 自动通过 |
| AC-001-2 | colors 守卫：阳性 / 阴性样例与真实源码扫描 | 自动通过 |
| AC-001-3 | glass 守卫只准三层；glass.css 三类 | 自动通过；M-01 人工待验 |
| AC-001-4 | format / typography 单测与运行时字体；T-16 验证独立精度、零 / 负零 / 缺数 | 自动通过；M-02 人工待验 |
| AC-001-5 | updown 守卫、Num / 焦点带 / 模块语义测试、e2e 登记容器与背景检查 | 自动通过；R1-07 的机制改进仍待处理 |
| AC-001-6 | colors 退役色扫描、theme.spec.ts | 自动通过 |
| AC-002-1 | AppShell / LoadingScreen / 静态骨架；shell.spec.ts 骨架交接无空白 | 自动通过 |
| AC-002-2 | nav / router / Rail / 占位页；shell.spec.ts 八项、深链及刷新 | 自动通过 |
| AC-002-3 | 契约研究列表注入；shell.spec.ts 新增子项 | 自动通过 |
| AC-002-4 | TopBar；topbar.spec.ts、shell.spec.ts ticker / 状态点 | 自动通过；M-07 人工待验 |
| AC-002-5 | ui store 的 rail 持久化；shell.spec.ts 收起 / 展开 / 刷新 | 自动通过 |
| AC-002-6 | ui viewport / 栅格 / 焦点带；breakpoints.spec.ts 十视口、精确阈值与双向 resize | 自动通过；M-06 人工待验 |
| AC-002-7 | app store 与 boot-error mock；shell.spec.ts 进度、notice、失败重试 / 深链 | 自动通过（mock）；R1-02 real 桩路径仍待处理 |
| AC-003-1 | FocusBand / Kpi；focus-band.spec.ts 与 workbench.spec.ts；默认 LPG `-0.46%`、FU `+0.60%` | 自动通过（R1-01 已修复） |
| AC-003-2 | 整带 RouterLink；组件 + e2e 点击 / 键盘携带日期 | 自动通过 |
| AC-003-3 | 契约 reason 与空态；组件 + e2e | 自动通过 |
| AC-003-4 | market / analysis 分色、delta 显示精度与零中性；组件 + e2e | 自动通过 |
| AC-003-5 | 焦点带两段及双语段标；组件 / workbench.spec.ts 语义隔离 | 自动通过；M-03 人工待验 |
| AC-003-6 | 焦点带不属于模块目录；workbench.spec.ts 增删移 / 刷新仍固定 | 自动通过 |
| AC-004-1 | 契约目录 / 布局 / 模块库；modules.spec.ts 七模块、说明 / 状态 / 跨列 | 自动通过 |
| AC-004-2 | layout store；modules.spec.ts 移位 / 移除 / 末尾添加 / 清空与持久化 | 自动通过 |
| AC-004-3 | ModuleShell DOM 契约；逐模块组件 + 页面遍历；四壳占位 | 自动通过；M-04 人工待验 |
| AC-004-4 | 加载 / 空 / 错误与真实剪贴板诊断；组件 + scenarios.spec.ts | 自动通过 |
| AC-004-5 | modules.spec.ts 盘面三态格 / 关注列表 / 日程；T-16 盘面独立精度取色 | 自动通过；M-04 人工待验 |
| AC-004-6 | grid 守卫（minmax 外无裸 1fr） | 自动通过 |
| AC-005-1 | AgentDock 全局槽位；agent.spec.ts 八路由输入与提交 | 自动通过 |
| AC-005-2 | CotTimeline；timeline.spec.ts success / failure / retry、详情与终态 | 自动通过；M-05 人工待验 |
| AC-005-3 | 应用级订阅 / agent store；long 脚本切页及收起后步骤连续、不重启不重复 | 自动通过（v1 mock 顺序契约） |
| AC-005-4 | badges store / ModuleShell；running → done → viewed 清除 | 自动通过 |
| AC-005-5 | CotTimeline 引导；布局内 / 已移除加回 / 页面 / 不存在分支 | 自动通过；R1-10 的偏好副作用仍待处理 |
| AC-005-6 | 十种事件 schema、四份脚本各唯一终态、契约文档 | 自动通过 |
| AC-005-7 | ui drawer 持久化、运行中指示；agent.spec.ts 两档 / 收起 / 刷新 | 自动通过 |
| AC-006-1 | 由令牌生成主题；theme.spec.ts 对拍 / 退役色 | 自动通过 |
| AC-006-2 | theme.spec.ts WCAG 阈值与登记豁免 | 自动通过 |
| AC-006-3 | SampleChart 注册主题 / 样例序列；theme.spec.ts 浏览器实例读取、resize / dispose | 自动通过 |
| AC-006-4 | 主题背景透明；e2e 断言 | 自动通过；M-08 人工待验 |
| AC-007-1 | network 守卫：契约 real 层以外无直接网络调用 | 自动通过 |
| AC-007-2 | mock 五场景单元测试；normal / empty / error / slow e2e | 自动通过 |
| AC-007-3 | schemas + methods 生成文档 / JSON Schema，对拍字段 / 可选性 / 方法；新增 deltaDecimals 已重生成 | 自动通过 |
| AC-007-4 | 三种数值形态、fixtures、缺元数据反例；deltaDecimals 可选 / 0 / 非法值边界验证 | 自动通过 |
| AC-008-1 | design-registry.spec.ts front matter / 暗色适配段 / designUI 实际指针 | 自动通过 |
| AC-008-2 | design-registry.spec.ts 每个 token 的 source 可解析 | 自动通过 |
| AC-008-3 | design-registry.spec.ts PALETTE_DARK 覆盖原色 / 亮化 / 对比度 | 自动通过 |
| AC-009-1 | package.json 的 test 链；本轮 559 + 66、守卫 / 类型 / lint 全绿 | 自动通过 |
| AC-009-2 | manual-acceptance.spec.ts 核对 M-01 ~ M-08 结构与“看什么” | 清单已交付；人工勾选与截图尚待 Handoff |

## 5. 计划、任务、边界与历史顺手项

- Analyze 结构复核：45 AC 在 plan / tasks 中无漏项；17 项 / 28 小时；依赖全部指向更小编号；Checklist 70/70，未被实施者改动。
- T-01 ~ T-15 的提交已补录 tasks；T-16 为 `923e238`。T-17 补 plan 的 TS 5.9.2 锁定、Analyze / 本 Converge、任务状态与 P3 台账。任务状态不再称“草案”。
- 用 `git diff --quiet HEAD -- backend AGENTS.md docs design specs/frontend-workbench/spec.md specs/frontend-workbench/checklist.md specs/frontend-workbench/manual-acceptance.md specs/frontend-workbench/assets` 核对无本轮改动（exit 0）；原 v1 之后的前端差异仅为 T-16 列出的 12 个文件。v2 仍暂停，不接真实后端、不修改涨跌作用域登记、不新增 UI 功能。
- Checklist 历史顺手项：S-08（目录树无 .prettierrc）、S-15（check 写法）、S-16（T-15 已列 design-registry 测试归属）在当前 plan / tasks 中均已落实；S-17 在 checkGenerated 中保留“契约生成器尚未交付则跳过”的分支。Checklist 历史正文不改写。
- 没有遗留的未登记 P1/P2 实现任务；这不是审核员判定，最终是否关闭 R1-01 / R1-09 由独立 A 复核。

## 6. 尚未完成 / 剩余风险

1. **独立 A 定向 Review 复核**：R1-01、R1-09、本 Converge 证据与实际 diff；本报告不能替代独立审查。
2. **9 项 P3**：R1-02 / 03 / 04 / 05 / 06 / 07 / 08 / 10 / 11 已逐项登记 tasks 后续候选台账；未实施、未获风险接受。真实 API 与 agent-runtime 的异常序列不在本轮虚构实现；无需为推测性场景添加静默防御。
3. **M-01 ~ M-08**：8 项人工清单保持未勾选、无截图，未做任何“已通过人工验收”声明。
4. **打包体积**：当前仅有 780.57 kB JS chunk 提示，未引入未经批准的拆包优化；随后续图表模板工作关注。
5. **Gate 2 未批准**：复核通过后仍须 Walter 确认整改与 P3 处置，再按流程进入 Handoff；本轮没有 PR / push / merge。
