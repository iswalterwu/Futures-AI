# Feature: frontend-workbench 质量检查清单 — 第二轮复核（审核员 A：claude-fable-5-1）

> Checklist 阶段产物（第二轮），由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求 / 设计质量达标，不代表实施完成。实施者不勾选本文件。
> 审核员为独立会话（与实施隔离、不同模型）：A = claude-fable-5-1（本文件）、B = gpt-6.1-sol 并行复核，按共识取通过项，分歧项视为未通过。
> 第一轮 A 原件：`checklist.claude-fable-5-1.md`（不覆盖）；第一轮共识：`checklist.md`（86 项，通过 33 / 未通过 53）。
>
> **审核对象**：分支 `feat/frontend-workbench`，提交 `c9870e1`（2026-10-27，已变基到 main `97d080e`；第一轮引用的 `35865dc` 内容对应现 `ad0f1ab`）。
> **依据（本轮全部重新读取）**：AGENTS.md；docs/plan.md（§3 新增 D-013 行）、docs/architecture.md、docs/designUI.md（§2.1 玻璃边注、§2.2 作用域）；docs/decisions/ 全部 ADR（D-007 ~ D-012 未变；新增 20261027-updown-scope.md = D-013；README 规则）；
> specs/frontend-workbench/spec.md（45 条 AC，Q-015 ~ Q-022）、plan.md（第二版）、tasks.md（第二版，30 项）、checklist.md、checklist.gpt-6.1-sol.md、assets/palette-dark-candidates.html；specs/README.md 状态表；
> FTEngine 源条目 `D:\FTEngine\design\UI\*`（八份）与 `Graphs\Palette\PALETTE_CORE.md`（只读）；本机 pi 1.4.0 文档 `docs/json.md`、`docs/rpc.md`（只读，核 C-23）。
> **独立复算**：最不利卡面推导（.045 叠 `#1B1C1F` → `#252629`；.06 → `#292A2C`）、18 个颜色在中段 / 最不利卡面的 WCAG 对比度、区间带叠加对比度、序列七色 ΔE2000（暗 / 亮两版）、八份源条目的 `### #` 锚数量与名单、`main_scale` 键数、spec AC 数、plan §5 与 tasks 矩阵的 AC 覆盖、任务数与工时和、c9870e1 的 docs 改动范围与 D-011 未改动。
> 审核日期：2026-10-27。只读审核：未安装依赖、未运行项目测试、未 commit；只新建本文件。

## 0. 结论摘要

- **本清单 26 项：通过 18 / 未通过 8**。未通过中 **阻断 2 个根因**：① Gate 1 再批准尚未发生（C-1，流程）；② plan §2.7 的 mock 场景没有写明 `getModuleCatalog()` 在 `error` / `empty` / `slow` 下是否成功，按字面"各业务方法返回固定错误 / 列表为空"会让工作台无模块、模块错误态与空态不可达（R2-01，牵连 §2.1 / §3.1 / C-11 与 AC-004-4 / AC-007-2）。其余 6 项为建议级一行修订（R2-02 ~ R2-05）。
- **checklist.md 53 项未通过复核：闭环 47 / 未闭环 6**（C-01、I-01、V-01、V-02、AC-004-4、AC-007-2）。其中 I-01 / V-01 / AC-004-4 / AC-007-2 的未闭环主因都是 R2-01 同一处；V-02 为 T-28 依赖缺 T-22（R2-02）；C-01 为 Gate 1。详见附录 B。
- **第一轮 A 的 11 项未通过**：F-1 ~ F-18 全部闭环，残留只剩上述新编号项（附录 C）。**第一轮 33 项共识通过项**复核后全部维持（数值、任务形式、Q-015 贯穿等未因修订而失效）。
- **新增 4 条 AC**（AC-002-7 / AC-003-5 / AC-003-6 / AC-005-7）均有确定的验证方式与任务落点（C-10、附录 A）。
- **docs 与 ADR 改动合规**：D-013 按模板齐全、编号递增、以"补充 D-011 结论 6"方式新增而不改历史文件（git diff 证实 D-011 未变）；docs/plan.md §3 登记；designUI §2.2 / §2.1 同步（C-9）。
- **B 独有的"待补审"项**（C-19 / C-20 / C-21 / C-23 / C-24 已修订；C-22 / C-26 B 已通过）：A 独立复核后**全部通过**，数值复算与 pi 文档核实见 C-14。**A 独有待 B 补签项**（I-05 / I-07 / C-18）：A 维持通过，I-07 本轮补 86 锚逐名核实。
- **Q-015 ~ Q-022 修订**在 spec / plan / tasks / docs / 状态表中完整一致（C-2），grep 无旧表述作为现行要求残留；spec §1 背景与 §5 Q-004 的历史记述见 R2-07（信息级）。

## 1. 需求完整性

- [x] 每条需求都有至少一条可验证的验收规则 —— R-001 ~ R-009 共 45 条 AC（6 / 7 / 6 / 6 / 7 / 4 / 4 / 3 / 2），每条指明验证形态；plan §5 全部 45 条有落点，tasks 矩阵 45 / 45。
- [x] what 中描述的每个行为都有对应验收规则 —— 第一轮 F-17 与 B N-02 的缺口已按 Q-021 补写：加载通知与启动失败重试 → AC-002-7；深链刷新停留 → AC-002-2；焦点带固定 → AC-003-6；两段 → AC-003-5；默认顺序与模块库可见 → AC-004-1；收起抽屉不中断 → AC-005-3；两档高度与运行中指示 → AC-005-7；已移除 / 不存在目标 → AC-005-5；模块库定义经契约 → plan §2.4 `getModuleCatalog()`（AC-007-3 / -4 契约测试覆盖）；分页 / 时间参数 → plan §2.7"参数与语义约定"写入 CONTRACT.md（AC-007-3 对拍）。
- [x] 无未澄清歧义 —— spec §5 Q-016 ~ Q-022 已登记并按推荐裁定（默认顺序、1240 归属、焦点带两段、KPI 字族、已移除目标、AC 补写、文件边界），与第一轮附录 C 建议的五个歧义一一对应并多补两项；本轮新发现的问题（R2-01 ~ R2-06）全部在 plan / tasks 层，无需求层歧义。形式闭环以 Walter 重过 Gate 1 为准（C-1）。
- [x] 目标与非目标边界清晰 —— §2 维持；§4 文件边界按 Q-022 列全共享文件（specs/README.md、.gitignore、docs/designUI.md、docs/decisions/、docs/plan.md §3）。

## 2. 一致性

- [ ] spec / plan / tasks 之间无冲突 —— 第一轮 F-1 ~ F-9 全部闭环（F-1 断点：spec R-002 / AC-002-6 与 plan §2.2 断点表一致；F-2 默认顺序：spec R-004 与 plan §2.4 `order` 1–7 同 designUI §3；F-3 模块库：plan §2.4 列全七项带状态；F-4 边界：spec §4 Q-022；F-5 来源：plan §2.1 三种形式 + UI_DARK_ADDITIONS；F-6 依赖：T-12 ← T-09、T-22 / T-23 ← T-08；F-7：bare-1fr 零豁免；F-8：AC-002-7 / AC-005-7；F-9：plan §1 目录树与头部基线）；B 的深链（plan §2.2 只在 `/` 跳转）与 T-04 ← T-03 亦闭环。**未通过原因 = 本轮新发现**：
  - **R2-01（阻断）**plan §2.7 mock 段：`error`（"bootstrap() 成功，其后各业务方法返回固定错误，模块错误态可达"）、`empty`（"列表为空"）、`slow` 未写明 `getModuleCatalog()` 的行为。目录是 `layoutStore` 默认布局的唯一来源（§2.4，hydrate 还丢弃目录外 id），目录失败或为空 → 工作台无模块 → "模块错误态可达"与 empty 用例的模块空态都不成立，AC-007-2 error 用例、AC-004-4 e2e 用例（T-28）不可确定。修法：§2.7 加一句"`bootstrap()` 与 `getModuleCatalog()` 在 normal / empty / error / slow 下均成功（empty 下目录完整、各模块数据为空；error 下目录完整、各模块数据方法返回错误）；只有 boot-error 让 `bootstrap()` 首次失败"，并以方法 × 场景矩阵写入 CONTRACT.md 或 `mock/index.ts` 头注；T-12 完成标准 3 同步。
  - **R2-02（建议）**tasks T-28 依赖 `T-16、T-17、T-20、T-23、T-25` 缺 **T-22**（market-board）：`semantics.spec` 断言 `.sem-market` 位于 `[data-module-id=market-board]` 容器内，`scenarios.spec` 四场景需要全部模块正文就位。修法：依赖加 T-22。
  - **R2-03（建议）**plan §2.1"涨跌色作用域"第 4 条静态部分："源码中硬编码 `'market'` 语义或 `sem-market` 类名只许出现在三处与 `Num.vue`"字面上不可满足：`src/contracts/types.ts`（zod 枚举 `'market' | 'analysis'`）、`src/contracts/methods.ts`（描述文字）必然含该字面量；`mock/fixtures/*.json` 若被 `src/**` 扫描也会命中（其规则已另由单测承担）；`Kpi.vue` 若用于焦点带数字卡并输出语义类，也在名单外。修法：守卫只扫 `.vue / .ts`、排除 `src/contracts/`（types / methods / mock），并写明 `Kpi` 组合 `Num` 或把 `Kpi.vue` 列入名单。
  - **R2-04（建议）**plan §2.1 配色表 / §2.9：界面三色（点睛红 `#DF5C4D`、琥珀 `#C69633`、链接蓝 `#6A9DD1`）既进 `design/charts/PALETTE_DARK.md`（"§2.1 配色表每个用途一个锚"），又在 `design/ui/UI_COLORS.md#status_colors` 暗色适配段登记（令牌 source 指向后者）。双份登记与 `values_once` 抵触，也与采用的 `UI_COLORS#ui_vs_chart_colors`（界面色不进 palette）抵触；`design-registry:palette` 子检查本就只核 palette-core 原色。修法：PALETTE_DARK 只收 palette-core 原色的暗色值，界面三色只在 UI_COLORS 暗色适配段登记（样张页展示不受影响）。
  - **R2-05（建议）**plan §2.3 FocusBand 只定义 `brief = null` → 空态；`error` 场景下 `getDailyBrief()` 返回错误时的呈现未定义（模块壳三态不覆盖焦点带）。修法：§2.3 加"错误 → 复用 `ErrorState`（含诊断）"，T-28 error 用例顺带断言；spec 不需改（R-003 只要求空态，错误态按 C-28 口径标注为 plan 行为）。
- [x] 与 docs/ 决策与 ADR 无冲突 —— 第一轮 F-10 / B F-13 / F-21 闭环：D-013 新增并在 docs/plan.md §3 登记，designUI §2.2 改为"登记的行情语义位置专属（D-011 / D-013）"并写明焦点带两段与"状态色不用绿色"；designUI §2.1 注明玻璃边 .07–.12 是 D-011 7–14% 的子范围（C-30）；plan §2.1 把绿色表述限定为"状态色不用绿；行情语义位置绿 = 跌；分析图表缥碧保持色板身份"；令牌 source 不再允许 `spec:R-00x`。D-011 未被修改（`git diff 97d080e HEAD -- docs/decisions/20261026-ui-visual-system.md` 为空）。信息级：R2-06（designUI §8 / docs/plan.md §4 把 design/ui 描述为 FTEngine 移植资产，T-30 补一句"另含本产品新增值条目 UI_DARK_ADDITIONS"）、R2-07（spec §1 背景"红涨绿跌限行情模块"与 §5 Q-004"栅格断点 1240 / 1400 / 1500"为历史记述，再批准时可加"后由 D-013 / Q-018 扩展"）。
- [x] 与 data-layer 契约对齐（A 维持，待 B 补签）—— plan §2.7 错误码六码 = specs/data-layer/plan.md 错误契约；`Figure.seriesId` 与 `WatchlistTable.rows[].seriesId` 对齐含可选 contract 的描述符派生 ID（D-012 第 1 条）；`getReleaseCalendar(from, to)` 闭区间与 data-layer range 闭区间一致。
- [x] Q-003 配色裁定登记一致且数值可复算 —— 配色值与样张 `THEMES.dark.c` 17 项相同、A 等亮裁定未变；**本轮新增数值全部独立复算一致**：最不利卡面 `#252629`（.045 叠 `#1B1C1F`）、中段 `#1D1E20`；18 个颜色（含文字三级）在两卡面的对比度与 plan 表逐值吻合（四舍五入 0.1）；`.06` 叠顶端 `#292A2C` 上弱文字 4.33（plan 4.3）；区间带 α .16 叠加后 1.44 / 1.45（plan 1.4 / 1.5）；序列七色最小 ΔE2000 = 13.2（吐绶蓝 / 碧落），FTEngine 亮色版同口径 21.5（墨 / 苍艾）；文字用色（涨 5.4、跌 6.9、正 5.7、负 5.4、琥珀 5.6、链接 5.3、文字三级 12.1 / 5.2 / 4.6）在最不利卡面均 ≥ 4.5，点睛红 4.2 已改为只作非文字指示（≥ 3），序列七色均 ≥ 3（苍艾 4.1 最低）。样张页 bad 徽章已改为文字色 + 点睛红圆点（c9870e1）。
- [x] FTEngine 条目锚点全覆盖且名单一致 —— 八份源条目 `### #` 锚数 14 / 10 / 4 / 13 / 22 / 5 / 10 / 8 = 86，与 plan §2.9 括号数一致；逐名核对 plan 的"采用 ∪ 不采用"= 源文件全部锚（无遗漏、无多出）；T-03（41）/ T-04（45）分组数相符；`main_scale` 45 键与 plan"全量照搬 45 个键"一致；断点 980 / 1240 / 1400 / 1500、字体栈、间距、圆角、退役五色与源碎片原值一致。

## 3. 可测试性

- [ ] 每条验收规则可映射到自动测试或人工验收步骤 —— 45 条中 43 条 ✓；**2 条有条件**：AC-004-4（e2e 部分）、AC-007-2（error / empty 用例）依赖 R2-01 的一句话修订。第一轮 F-11（error 覆盖 bootstrap）主体已闭环（plan §2.7 `bootstrap()` 成功 + `boot-error` 场景），F-12（首帧字面量）闭环（`generated/critical.css` 写入 `index.html` 标记块，`tokens-sync:generated` 对拍，`color-literals` 扫 `index.html` 标记块除外）。逐条见附录 A。
- [ ] 任务粒度与验证命令满足 tasks.md 模板要求 —— 30 项均 0.5–2 h，工时和 47 h 复算一致；每任务含上下文 / 修改范围 / 依赖 / 引 AC 的完成标准 / 一一对应的验证命令；"筛选未命中须失败"已写入约定；第一轮 F-6 / F-8 与 B F-17 闭环（T-04 ← T-03；T-12 ← T-09；T-22 / T-23 ← T-08；T-14 持有 `contract-doc.spec.ts`；T-13 提供脚本选择入口）。**未通过原因**：R2-02（T-28 缺 T-22 依赖）。
- [x] 人工验收项有清单载体且与 spec 对应 —— M-01 ~ M-08 含焦点带两段（M-03，AC-003-5）；T-29 产出 `manual-acceptance.md` 并以单测核"看什么"字段（AC-009-2）。

## 4. 其他自定义项

- [ ] C-1 Gate 1 再批准（阻断，流程）—— spec 头部仍为"待 Walter 重新批准（重过 Gate 1）"；plan / tasks 头部已改为"Gate 1 冻结版 + 回流修订版，待重过 Gate 1"（B F-01 的误导表述闭环）；specs/README.md 状态行一致。Walter 批准后统一三件套头部与状态表即可，无其他待办。
- [x] C-2 Q-015 ~ Q-022 修订在 spec / plan / tasks / docs / 状态表中完整一致 —— spec：头部、R-001（Q-019 字族、D-013 作用域）、R-002（Q-018 断点、Q-021 启动）、R-003（Q-016 两段）、R-004（Q-017 顺序、模块库）、R-005（Q-020）、§4（Q-022）、§5 七行；plan：§1 基线与边界、§2.1 字族 / 作用域 / 断点表、§2.3 两段、§2.4 目录与顺序、§2.5 Q-020、§2.7、§5；tasks：头部、T-15 / T-16 / T-19 / T-20 / T-25 / T-27；docs：D-013、designUI §2.2、docs/plan.md §3。grep 无"唯一使用涨跌 / 只在行情模块 / 以模块为界"作为现行要求残留（命中仅 §5 历史引述）。
- [ ] C-3 守卫定义精度 —— 第一轮 a–e 全部闭环：a `updown-scope:refs` 定义处豁免；b `design-registry:entries` 核 `adopted ∪ not_adopted = source_anchors`；c `docs/designUI.md#<节号>` 按 `^#{2,3} 2\.1[ .]` 解析；d `glass-tiers` 扫 CSS / `<style>` / 内联 / 主题 JSON 字符串值，主题 tooltip 不用 `extraCssText`；e `color-literals` 纳入 `index.html` 与具名色。**未通过原因**：R2-03（`updown-scope:usage` 允许名单字面不可满足）。
- [x] C-4 涨跌语义的运行时防线 —— plan §2.1 第 4 道防线：fixtures 单测（market 只在三个 fixture）+ e2e `.sem-market` 只在登记容器内且背景色非涨跌色（T-12 / T-28）；`updown.css` 只写 `color`（`color-only` 子检查）。
- [x] C-5 plan 细节补齐 —— a `type.*` 全量 45 键 + 2 新增；b 三层玻璃映射表（面 / 边 / 模糊 / 用途）；c `WatchlistTable` 行结构含 contract / seriesId / 三个 Figure / spark；d `ModuleDef.description`；e 模块库复用 `.glass-drawer`；f §2.8 末段说明模块壳检查归类；g 参数与语义约定（交易日 / 时区 / 闭区间 / 不分页 / pct 百分数值）；h `window.__FAI_TEST__.charts` 仅 mock；i pi 1.4.0 + 本机文档路径 + 核对日期。
- [x] C-6 隐私 / 安全 / 文件边界 / 回滚 —— mock 不含真实头寸、凭证、私有文档；网络只在 `src/contracts/real/`；`.gitignore` 只追加五行并注明 `lib/` 既有规则影响；plan §6 回滚改为逐类（含 designUI `git revert`、D-013 按 ADR 规则以取代 ADR 处理、docs/plan.md §3 随之）。
- [x] C-7 AC 覆盖的机械核验 —— `ac-coverage` 守卫（从 spec 抽 AC，扫测试标题与守卫 `acs` 声明，缺失即红）+ T-29 验证命令。
- [x] C-8 spec 去技术化程度可接受（A 维持，待 B 补签）—— AC-004-6 / Q-007 的轻度技术表述为可验证规则，Walter 未要求改写。
- [x] C-9 D-013 ADR 合规 —— 文件名 `20261027-updown-scope.md` 符合 `YYYYMMDD-<slug>`；编号 D-013 全局递增；含日期 / 状态 accepted / 关系（补充 D-011 结论 6，不取代）/ 背景 / 备选三项 / 结论四条 / 取舍 / 影响（列 designUI §2.2、spec R-001 / R-003 / R-004、plan 守卫与 updown.css、后续 feature 修订路径）；不修改历史 ADR；docs/plan.md §3 决策表登记；designUI §2.2 同步；spec §5 Q-016 记录 Walter 按推荐裁定；先于任何代码实现（符合 AGENTS §4"决策先写 ADR 再改代码"）。
- [x] C-10 新增 4 条 AC 可测 —— AC-002-7：`?scenario=boot-error` 首次失败 → 原因 + 重试 → 工作台（T-16，e2e/shell.spec）；AC-003-5：组件断言 market 只在 `.fai-focus__seg--market`、涨跌类只在行情段 + M-03（T-20）；AC-003-6：e2e 模块库无焦点带、无移除钮、增删模块后仍在（T-20）；AC-005-7：e2e closed / half / tall 切换 + reload 保持 + 运行中指示出现 / 终态消失（T-25）。
- [ ] C-11 mock 场景 × 方法行为矩阵明确（阻断）—— R2-01，见 §2 第 1 项。
- [ ] C-12 数值只登记一次（values_once）—— R2-04：界面三色在 PALETTE_DARK 与 UI_COLORS 暗色适配段双份登记（建议级）。
- [ ] C-13 焦点带错误态定义 —— R2-05（建议级）。
- [x] C-14 B 独有项与"待补审"项的独立结论 —— **C-19**：plan 已改为以最不利卡面 `#252629` 判定并列两列对比度，点睛红降为非文字指示（3:1），文字三级在最不利卡面 ≥ 4.5 且说明不用 .06 玻璃面的原因；A 复算全部一致 → 通过。**C-20**：plan 改用 ΔE2000（13.2 vs 21.5，同口径），OKLab 8.5 只作参考；A 复算两值一致 → 通过。**C-21**：绿色表述限定为状态色不用绿 + 行情语义位置绿 = 跌 + 缥碧保持色板身份，并由 D-013 结论 3 与 designUI §2.2 背书 → 通过。**C-22**（B 通过、A 补签）：plan §2.8 运行方式 + tasks 约定规定每个守卫先跑 `fixtures/<名>/{positives,negatives}` 自检、任一失败非零退出、`--self-test` 只跑自检，T-02 `run.mjs` 承载并读取 `acs` 声明；机制明确 → A 通过（样例充分性随各守卫任务验收）。**C-23**：plan §2.5 新增 `step.error`（非终态，`willRetry`）、终态只在 `agent_settled` 归约发出一次、规则"aborted → run.aborted；最后助手消息 stopReason=error 或出现 `auto_retry_end.success=false` → run.failed；否则 run.completed"，并增 `retry` / `abort` 脚本；A 核本机 pi 1.4.0 `docs/json.md`："`agent_settled` = Pi 不再自动继续（含重试 / 压缩恢复 / 排队消息）"、"最终失败时 `auto_retry_end` 为 `success:false` 并带 `finalError`"、"`agent_end` 之后仍可能有重试"——归约规则与文档语义一致 → 通过。**C-24**：AC-005-3 文本含"收起抽屉 → 重新展开"，plan §5 与 T-27 分别断言两种情况同一 runId、步骤增加、无重复 → 通过。**C-26**（B 通过、A 补签）：plan §1 / §6 与 T-01 规定首任务冒烟（install / build / typecheck / lint / 单测 / e2e）、vue-tsc 不兼容 TS 7 则锁 5.9.x 并回写 plan、Playwright 复用本机 Chrome 的回退链、ECharts / vue-echarts peer 不匹配的回退 → 责任与回退路径明确，A 通过（本审核未安装依赖）。

## 附录 A：AC 逐条可测试性核对（45 条）

判定：✓ 可按 plan §5 验证；△ 有条件（R2 编号为修订位置）。相较第一轮：原 △ / ✗ 的 AC-001-2、AC-002-1、AC-002-6、AC-008-2、AC-004-1、AC-007-2 中前五条转 ✓；AC-007-2 与 AC-004-4 因 R2-01 仍 △。

| AC | 验证方式（plan §5） | 任务 | 判定 | 备注 |
|---|---|---|---|---|
| AC-001-1 | tokens-sync（generated / media）+ e2e/tokens.spec 运行时逐令牌对拍 + 覆盖阳性自检 | T-06、T-21 | ✓ | B F-06 闭环 |
| AC-001-2 | color-literals（`src/**` + `index.html` 标记块除外；含具名色、内联样式） | T-07 | ✓ | F-12 / B F-07 闭环 |
| AC-001-3 | glass-tiers（CSS / `<style>` / 内联 / 主题 JSON）+ M-01 | T-08、T-10、T-29 | ✓ | |
| AC-001-4 | format.spec + typography.spec（类）+ tokens.spec 计算字体族首项 | T-10、T-21 | ✓ | Q-019 消除冲突 |
| AC-001-5 | updown-scope 四子检查 + fixtures 单测 + 组件 + e2e 容器 / 背景 | T-08、T-10、T-12、T-22、T-23、T-28 | ✓ | R2-03 为守卫允许名单精度，不影响可测性 |
| AC-001-6 | color-literals:retired + theme-contrast:retired（含 index.html） | T-07、T-24 | ✓ | |
| AC-002-1 | 首帧标记块 + 拦截主脚本延迟加载 + 采样判据 | T-16 | ✓ | 判据已写明 |
| AC-002-2 | 八项 / aria-current / 直接打开 `/prices`、`/research/<id>`、`/daily/<date>` 刷新停留 | T-15 | ✓ | B F-03 闭环 |
| AC-002-3 | `__FAI_MOCK__` 注入 N → N+1 | T-17 | ✓ | |
| AC-002-4 | component ticker / fresh-stale 类 | T-17 | ✓ | |
| AC-002-5 | e2e 折叠 → reload | T-15 | ✓ | |
| AC-002-6 | 十个视口；侧栏 / `--fai-grid-cols` 1-2-3-4 / 焦点带 4-6 卡 / 无横向溢出 | T-21 | ✓ | Q-018 断点表 |
| AC-002-7 | boot-error 场景：原因 + 重试 → 工作台；进度与通知文案 | T-16 | ✓ | 新增 |
| AC-003-1 | component | T-20 | ✓ | |
| AC-003-2 | e2e → `/daily/<date>` | T-20 | ✓ | |
| AC-003-3 | component `brief = null` → reason | T-20 | ✓ | `getDailyBrief` 一次返回 `{brief, reason}` |
| AC-003-4 | component 语义类 | T-20 | ✓ | |
| AC-003-5 | component 两段归属 + M-03 | T-20、T-29 | ✓ | 新增 |
| AC-003-6 | e2e 模块库无焦点带 / 无移除钮 / 增删后仍在 | T-20 | ✓ | 新增 |
| AC-004-1 | e2e 默认七个且顺序 = 目录顺序；模块库七项带状态 | T-19 | ✓ | F-2 / F-3 闭环 |
| AC-004-2 | e2e 增删移 → reload | T-19 | ✓ | |
| AC-004-3 | component 逐模块 + e2e 遍历 | T-18、T-19、T-23 | ✓ | |
| AC-004-4 | component 三态 + 剪贴板；e2e `?scenario=error` 模块错误态与诊断 | T-18、T-28 | △ | e2e 部分依赖 R2-01（目录在 error 下须成功） |
| AC-004-5 | component 三模块 + M-04 | T-22、T-23、T-29 | ✓ | |
| AC-004-6 | bare-1fr 零豁免 | T-08 | ✓ | F-7 闭环 |
| AC-005-1 | e2e 八路由输入栏 / 提交展开 | T-25 | ✓ | |
| AC-005-2 | component success / failure / retry / abort；唯一终态行 | T-26 | ✓ | |
| AC-005-3 | e2e `?agentScript=long` 切页 + 收起抽屉两种 | T-13、T-27 | ✓ | B F-22 闭环 |
| AC-005-4 | e2e running → done → 点击 → none | T-27 | ✓ | "查看 = 点击"仍只在 plan（信息） |
| AC-005-5 | e2e 在布局 / 已移除（Toast + 添加回）/ 不存在（Toast 不跳） | T-27 | ✓ | Q-020 |
| AC-005-6 | unit 五脚本 parse + 恰好一个终态；CONTRACT.md 十种事件 | T-11、T-13、T-14 | ✓ | |
| AC-005-7 | e2e 三态切换 + reload；运行中指示出现 / 消失 | T-25 | ✓ | 新增 |
| AC-006-1 | theme-contrast:retired + tokens-sync | T-24 | ✓ | |
| AC-006-2 | theme-contrast:contrast（最不利卡面；3 / 4.5；豁免登记） | T-24 | ✓ | 数值复算一致 |
| AC-006-3 | e2e 经 `window.__FAI_TEST__.charts` 读 `getOption().color` | T-24 | ✓ | |
| AC-006-4 | e2e backgroundColor 透明 + M-08 | T-24、T-29 | ✓ | |
| AC-007-1 | network-scope（ESLint 语法级：全局 / 别名 / 计算属性 / 客户端库导入） | T-09、T-12 | ✓ | B F-09 闭环 |
| AC-007-2 | unit 五场景；e2e normal / empty / error / slow | T-12、T-28 | △ | R2-01：error / empty 下目录行为未写明 |
| AC-007-3 | contract-doc + unit 方法语义条目 / 字段描述 | T-11、T-14 | ✓ | |
| AC-007-4 | unit fixtures parse；Figure 缺元数据反例；BoardCell `ok ⇔ figure` | T-11、T-12 | ✓ | B F-11 闭环 |
| AC-008-1 | design-registry entries / required / docs | T-02、T-03、T-04、T-05、T-30 | ✓ | |
| AC-008-2 | design-registry:sources（三种形式） | T-02、T-06 | ✓ | F-5 / B F-13 闭环 |
| AC-008-3 | design-registry:palette | T-02、T-04 | ✓ | R2-04 只影响登记位置，不影响可测性 |
| AC-009-1 | `pnpm test` 退出码 0 + ac-coverage | T-01、T-29 | ✓ | |
| AC-009-2 | manual-acceptance.md + unit | T-29 | ✓ | |

## 附录 B：checklist.md 53 项未通过的逐项复核

判定：✓ 已闭环（附依据位置）；✗ 未闭环（附原因）。

| 项 | 判定 | 依据位置 / 原因 |
|---|---|---|
| N-02 | ✓ | spec AC-002-7 / AC-003-5 / AC-003-6 / AC-005-7 新增；AC-002-2 / AC-004-1 / AC-005-3 / AC-005-5 修订；plan §2.4 `getModuleCatalog()`；plan §2.7 参数与语义约定 |
| N-03 | ✓ | spec §5 Q-016 ~ Q-022 登记并裁定 |
| I-01 | ✗ | 第一轮 F-1 ~ F-9 与 B 深链 / 契约闭环；残留 R2-01（阻断）、R2-02 ~ R2-05（建议），见 §2 第 1 项 |
| I-02 | ✓ | D-013；designUI §2.2 / §2.1；docs/plan.md §3；plan §2.1 绿色限定与 source 纪律；D-011 未改 |
| I-04 | ✓ | spec §4（Q-022）；plan §1 文件边界；plan §6 逐类回滚；tasks 约定边界含 specs/README.md、docs/designUI.md |
| I-05 | ✓ | A 维持（plan §2.7 六码 + seriesId 含 contract）；待 B 补签 |
| I-07 | ✓ | A 维持并本轮核实 86 锚逐名一致；待 B 补签 |
| I-08 | ✓ | spec R-004 默认顺序 + AC-004-1；plan §2.4 `order`；T-19 |
| V-01 | ✗ | AC-004-4 / AC-007-2 依赖 R2-01 |
| V-02 | ✗ | T-04 ← T-03、T-14 持有 contract-doc.spec、T-13 选择入口、未命中失败约定均闭环；残留 R2-02（T-28 缺 T-22） |
| AC-001-1 | ✓ | plan §2.1 两层对拍；§5；T-06 / T-21 |
| AC-001-2 | ✓ | plan §2.8 color-literals 范围与语法；T-07 |
| AC-001-4 | ✓ | spec Q-019；plan §2.1 / §5；T-10 / T-21 |
| AC-001-5 | ✓ | plan §2.1 四道防线；T-08 / T-10 / T-12 / T-22 / T-23 / T-28 |
| AC-001-6 | ✓ | plan §2.8 retired 含 index.html；T-07 |
| AC-002-1 | ✓ | plan §2.2 首帧标记块 + §5 判据；T-06 / T-16 |
| AC-002-2 | ✓ | plan §2.2 深链规则；§5；T-15 |
| AC-002-6 | ✓ | spec R-002 / AC-002-6（Q-018）；plan §2.2 断点表；T-21 |
| AC-004-1 | ✓ | plan §2.4 模块库全七 + 默认顺序；T-19 |
| AC-004-4 | ✗ | 组件部分 ✓；e2e 部分依赖 R2-01 |
| AC-005-5 | ✓ | spec Q-020；plan §2.5 四种情况 + Toast；T-27 |
| AC-007-1 | ✓ | plan §2.8 ESLint 语法级；T-09 |
| AC-007-2 | ✗ | R2-01 |
| AC-007-4 | ✓ | plan §2.7 BoardCell / WatchlistTable / Figure 必填 + 反例；T-11 / T-12 |
| AC-008-2 | ✓ | plan §2.1 source 三形式 + UI_DARK_ADDITIONS；T-05 / T-06 |
| C-01 | ✗ | Gate 1 再批准待 Walter；头部表述已修正 |
| C-03 | ✓ | D-013；designUI §2.2；spec R-003 / AC-003-5；plan §2.3 两段；M-03 |
| C-04 | ✓ | plan §2.1 第 1 条 / §2.8 `updown-scope:refs` 定义处豁免 |
| C-05 | ✓ | plan §2.9 86 锚全归类；`design-registry:entries` 核 `adopted ∪ not_adopted = source_anchors`；A 逐名核实 |
| C-06 | ✓ | plan §2.1 `docs/designUI.md#<节号>` 解析规则 |
| C-07 | ✓ | plan §2.8 glass-tiers 扫描范围；§2.6 tooltip 不用 extraCssText |
| C-08 | ✓ | plan §2.1 `main_scale` 全量 45 键 + 2 新增 |
| C-09 | ✓ | plan §2.1 三层玻璃映射表 |
| C-10 | ✓ | plan §2.7 `WatchlistTable` 行结构含 contract / seriesId |
| C-11 | ✓ | plan §2.4 ModuleLibrary `.glass-drawer` |
| C-12 | ✓ | plan §2.8 末段归类说明 |
| C-13 | ✓ | plan §2.7 参数与语义约定 + `CONTRACT_METHODS`；T-11 / T-14 |
| C-14 | ✓ | plan §2.6 `window.__FAI_TEST__.charts` 仅 mock |
| C-15 | ✓ | plan §2.5 pi 1.4.0 + 本机路径 + 核对日期 |
| C-17 | ✓ | plan §2.8 ac-coverage；T-29 |
| C-18 | ✓ | A 维持；待 B 补签 |
| C-19 | ✓ | plan §2.1 最不利卡面 + 点睛红非文字 + 文字三级；A 复算一致 |
| C-20 | ✓ | plan §2.1 ΔE2000 13.2 / 21.5；A 复算一致 |
| C-21 | ✓ | plan §2.1 状态色与绿色段；D-013 结论 3；designUI §2.2 |
| C-22 | ✓ | A 独立通过（plan §2.8 运行方式；tasks 约定；T-02） |
| C-23 | ✓ | plan §2.5 终态归约 + step.error + retry / abort；pi 文档核实 |
| C-24 | ✓ | spec AC-005-3 含收起抽屉；plan §5；T-27 |
| C-25 | ✓ | plan §2.4 `getModuleCatalog()` + `ModuleDef.description`；registry 仅映射 |
| C-26 | ✓ | A 独立通过（plan §1 / §6；T-01） |
| C-27 | ✓ | plan §2.2 `.shell` 用 `minmax(0,1fr)`；§2.8 bare-1fr 零豁免 |
| C-28 | ✓ | spec AC-002-7 / AC-005-7 覆盖原 plan 补充行为；T-16 / T-25 完成标准与 AC 对齐 |
| C-29 | ✓ | plan §1 目录树（Num / Kpi / Badge / EmptyState / ErrorState / Loading / Toast / DataTable / BoardGrid / Spark，Chip 已删）与 T-10 / T-18 / T-22 / T-23 / T-27 所有权一致 |
| C-30 | ✓ | designUI §2.1 玻璃边子范围注 |

小计：53 项中闭环 47、未闭环 6（C-01、I-01、V-01、V-02、AC-004-4、AC-007-2）。第一轮共识通过的 33 项复核后维持（N-01 按 45 条、V-03 按 30 项 / 47 h、I-06 数值不变、C-02 贯穿、C-16 边界、26 条 AC 验证映射均未受修订影响）。

## 附录 C：第一轮 A 的 11 项未通过 → 本轮状态

| 第一轮项 | 第一轮问题 | 对应共识项 | 本轮 |
|---|---|---|---|
| §1 第 2 项 | F-17 what 无 AC | N-02 | ✓ |
| §1 第 3 项 | F-18 五个新歧义 | N-03 | ✓（Q-016 ~ Q-020 + Q-021 / Q-022） |
| §2 第 1 项 | F-1 ~ F-9 | I-01 | F-1 ~ F-9 全部闭环；残留 R2-01 ~ R2-05（新） |
| §2 第 2 项 | F-10 docs 作用域冲突 | I-02 / C-03 | ✓（D-013） |
| §3 第 1 项 | F-11 error 覆盖 bootstrap；F-12 首帧字面量 | V-01 | F-12 ✓；F-11 主体 ✓，残留 R2-01（目录） |
| §3 第 2 项 | F-6 守卫依赖；F-8 完成标准超 AC | V-02 / C-28 | F-6 / F-8 ✓；残留 R2-02 |
| C-1 | Gate 1 再批准 | C-01 | ✗（待 Walter） |
| C-3 a–e | 守卫定义精度 | C-04 ~ C-07、AC-001-2 / -6 | a–e ✓；残留 R2-03 |
| C-4 | 涨跌运行时防线 | AC-001-5 | ✓ |
| C-5 a–i | plan 细节 | C-08 ~ C-15、C-25 | ✓ 全部 |
| C-7 | AC 覆盖机械核验 | C-17 | ✓ |

## 附录 D：本轮新发现（R2 编号）

| # | 级别 | 位置 | 问题 | 修法 |
|---|---|---|---|---|
| R2-01 | 阻断 | plan §2.7 mock 段；T-12 完成标准 3；T-28 | `error` / `empty` / `slow` 下 `getModuleCatalog()` 行为未写明；按字面目录失败或为空 → 工作台无模块 → AC-007-2 error / empty 用例与 AC-004-4 e2e 不可达 | 一句话：`bootstrap()` 与 `getModuleCatalog()` 在四个数据场景均成功（empty 下目录完整、模块数据为空；error 下目录完整、模块数据方法失败），仅 boot-error 让 `bootstrap()` 首次失败；方法 × 场景矩阵入 CONTRACT.md 或 mock 头注 |
| R2-02 | 建议 | tasks T-28 依赖 | 缺 T-22（market-board） | 依赖加 T-22 |
| R2-03 | 建议 | plan §2.1 作用域第 4 条静态部分；§2.8 `updown-scope:usage`；T-08 | `'market'` / `sem-market` 允许名单字面上被 `contracts/types.ts`、`methods.ts`、fixtures、`Kpi.vue` 违反 | 守卫只扫 `.vue / .ts`、排除 `src/contracts/`；写明 Kpi 组合 Num 或入名单 |
| R2-04 | 建议 | plan §2.1 配色表 / §2.9 PALETTE_DARK；T-04 | 界面三色双份登记（PALETTE_DARK + UI_COLORS 暗色适配段），抵触 values_once 与 ui_vs_chart_colors | PALETTE_DARK 只收 palette-core 原色 |
| R2-05 | 建议 | plan §2.3 FocusBand；T-20 / T-28 | `getDailyBrief()` 错误时焦点带呈现未定义 | 复用 ErrorState（含诊断），标注为 plan 行为 |
| R2-06 | 信息 | docs/designUI.md §8、docs/plan.md §4；T-30 | design/ui 将含非 FTEngine 条目 UI_DARK_ADDITIONS，与"FTEngine 移植资产"描述略有出入 | T-30 同步指针时补一句 |
| R2-07 | 信息 | spec §1 背景；§5 Q-004 回答 | "红涨绿跌限行情模块"、"栅格断点 1240 / 1400 / 1500"为历史记述，已被 D-013 / Q-018 扩展 | 再批准时加括注即可，不改裁定记录本身 |

## 复核条件

1. **Walter 重过 Gate 1**（spec 修订版含 Q-016 ~ Q-022；D-013 已登记）；批准后统一 spec / plan / tasks 头部与 specs/README.md 状态（C-1）。
2. **plan 修订**：R2-01（必须）；R2-03、R2-04、R2-05（建议，均一处改动）；T-12 完成标准 3 与 CONTRACT.md 同步矩阵。
3. **tasks 修订**：R2-02（T-28 依赖加 T-22）。
4. **docs**：R2-06 随 T-30 处理；R2-07 随再批准顺带。
5. 审核员 B 对 A 独有通过项（I-05、I-07、C-18）补签；A 已对 B 独有项（C-19 ~ C-24、C-26）给出通过结论（C-14）。双方一致后汇成共识 `checklist.md`，再按 AGENTS §2 进入 Analyze / Implement。
