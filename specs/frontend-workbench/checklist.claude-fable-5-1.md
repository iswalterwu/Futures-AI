# Feature: frontend-workbench 质量检查清单（审核员 A：claude-fable-5-1）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求质量达标，不代表实施完成。实施者不勾选本文件。
> 审核员为独立会话（与实施隔离、不同模型）：A = claude-fable-5-1（本文件）、B = gpt-6.1-sol（另文件）并行审核，
> 按共识取通过项，分歧项视为未通过；共识结果另汇成 `checklist.md`（tasks.md 的执行前置条件引用的是该文件名）。
>
> **审核对象**：分支 `feat/frontend-workbench`，提交 `35865dc`（2026-10-27，Q-015 回流后）。
> **依据**：AGENTS.md；docs/plan.md、docs/architecture.md、docs/designUI.md；docs/decisions/ 全部 ADR（D-007/008/009/010/011/012）；
> specs/frontend-workbench/{spec,plan,tasks}.md 与 assets/palette-dark-candidates.html；templates/checklist.md；specs/data-layer/{checklist,spec,plan}.md；
> FTEngine 源条目 `D:\FTEngine\design\UI\*` 与 `Graphs\Palette\PALETTE_CORE.md`（只读，核锚点与原值）。
> **独立复算**：plan §2.1 配色表 16 个对比度、区间带叠加对比度、序列七色最小 ΔE（OKLab×100）；卡面 `#1D1E20` 的推导；spec/plan/tasks 的 Q-015 残留 grep。
> 审核日期：2026-10-27。

## 0. 结论摘要

- 清单 20 项：**通过 9 / 未通过 11**（未通过中 **阻断 6**、建议 5）。41 条 AC 逐条核对（附录 A）：35 条可按 plan §5 的方式验证，4 条有条件（△），2 条按当前 plan 不可通过（✗）。
- **最重要的问题（阻断）**：
  1. spec 与 plan 在两处互相矛盾，按 plan 写出的测试会与 spec 冲突：模块库可见性与默认模块顺序（AC-004-1，一致性 F-2 / F-3）；栅格列数在 1240 处收缩（AC-002-6，F-1）。
  2. docs 权威冲突：designUI §2.2 / D-011 把涨跌专色限定为"行情模块专属、以模块为界、互不渗透"，而 spec R-001 / R-003 让焦点带同时并置行情（红 = 涨）与分析（红 = 负）两种语义的数字。按 AGENTS §0 / §4，docs 为准、先改 docs（F-10）。
  3. 两处 plan 机制会让 AC 不可达：mock `error` 场景覆盖 `bootstrap()` 使工作台不可达（AC-007-2 / AC-004-4，F-11）；index.html 首帧背景色与"零字面量"规则的矛盾未给出机制（AC-002-1 × AC-001-2，F-12）。
  4. 流程前置：Q-015 修订版 spec 尚待 Walter 再批准（Gate 1）；本审新发现的 5 处歧义（F-18）应一并登记 §5 并在再批准时裁定。
- Q-015 回流本身在 spec / plan / tasks / 状态表中完整且一致（附录 B），没有旧表述残留；但 docs（designUI §2.2）未同步，见 F-10。

## 1. 需求完整性

- [x] 每条需求都有至少一条可验证的验收规则 —— R-001~R-009 共 41 条 AC（6/6/4/6/6/4/4/3/2），每条都指明了验证形态（自动 / 组件 / 端到端 / 人工）。
- [ ] 目标与 what 中描述的每个行为都有对应验收规则（建议，再批准时顺手补）—— F-17：
  - R-005 what 的"两档高度 + 收起"（Q-009）与"输入栏显示运行中指示"没有 AC；tasks T-22 把前者挂在 AC-005-1 下，超出该 AC 文本。
  - R-003 what 的"焦点带固定（不可移除、不进模块库）"没有 AC。
  - R-004 what 的"默认布局 = 全部七个模块按登记顺序"没有 AC 断言顺序（AC-004-1 只断言数量）；"说明 / 默认尺寸档位"没有 AC。
  - R-002 what 的加载页"通知文案"没有 AC；plan §2.2 的启动失败 → `failed` + 重试是 spec 外行为，tasks T-13 却挂在 AC-002-1 下。
- [ ] 无未澄清歧义（阻断）—— spec §5 的 Q-001~Q-015 均已答复并融入（闭环 ✓）；但本审新发现 5 处未登记的歧义，须作为 Q-016~Q-020 登记 §5 并在再批准时裁定（F-18）：默认模块顺序、1240 断点归属、模块库是否显示已启用模块、焦点带内行情 / 分析数字的并置方式、本 feature 新增令牌的登记位置。
- [x] 目标与非目标边界清晰 —— §2 九项目标与 R-001~R-009 一一对应；非目标把真实后端、Electron、图表模板库、各 domain 页、亮色主题、拖拽、i18n/a11y 明确划出；与 data-layer 的接口只有 R-007 契约（data-layer spec §2 非目标互证）。

## 2. 一致性

- [ ] spec / plan / tasks 之间无冲突（阻断）—— 发现 9 处，按严重度：
  - **F-1（阻断）栅格 1240 断点**：spec R-002 what"栅格列数在 1240 / 1400 / 1500 处按登记收缩"、AC-002-6"各栅格断点上下各取一个视口…断言栅格列数" vs plan §2.1 断点表（`focusWide 1240` 只控焦点带卡数）与 §2.4（列数 1 / 2 / 3 / 4 在 < 980 / ≥ 980 / ≥ 1400 / ≥ 1500）。plan 的 1240 不改变栅格列数，e2e 在 1239 / 1241 断言列数将是恒等式。修法二选一：spec R-002 改为"栅格列数在 1400 / 1500 处、焦点带卡数在 1240 处按登记收缩"（推荐，spec 正待再批准）；或 plan §2.4 在 1240 增加一档。
  - **F-2（阻断）默认模块顺序**：spec R-004 列出的七模块顺序（行情价格、库存/供需指标、物流在途、当前头寸、文档目录、关注列表、数据发布日历，= designUI §3）且"默认布局 = 按登记顺序" vs plan §2.4 注册表顺序（market-board、watchlist、release-calendar、supply-demand、logistics-onwater、positions、doc-catalog）。无 AC 固定顺序。修法：spec R-004 明示默认顺序并在 AC-004-1 加"顺序 = 登记顺序"；plan 注册表照排。若要把三个完整 mock 模块排前，由 Walter 裁定并同步 designUI §3（或声明该列表不表示顺序）。
  - **F-3（阻断）模块库可见性**：AC-004-1"七个模块在模块库中可见并可添加/移除；默认布局为七个" vs plan §2.4"`ModuleLibrary.vue`：抽屉式列表，显示未启用模块 + 添加钮"。默认全启用时模块库为空，T-16 的 AC-004-1 用例不可通过。修法：plan 改为模块库列出全部七个（已添加者标状态，未启用者带添加钮）。
  - **F-4（阻断）共享文件边界**：spec §4"共享文件只有 specs/README.md 与 .gitignore" vs R-008 what（designUI.md 引用指向条目）、plan §2.9 末句（docs 改动在 Handoff 同 PR）、tasks 约定"边界"与 T-27（改 docs/designUI.md）。修法：spec §4 把 docs/designUI.md（限指针 / 引用同步）列入。
  - **F-5（阻断）AC-008-2 来源范围**：AC"每个值可追溯到条目文件或 designUI.md 条款" vs plan §2.1 允许 `spec:R-00x`（z.*、timeline_step、ticker、radius 例外、断点 Q-004），守卫 `design-registry:sources` 因而比 AC 宽。修法：A）本 feature 新增令牌登记进一份新条目文件（如 `design/ui/UI_DARK_ADDITIONS.md`，含锚与"为什么"），source 统一指向条目（推荐：符合 FTEngine `values_once` 与 docs/plan.md §4"每份规范只有一个权威作者位置"）；B）再批准时把 AC-008-2 改为"条目文件、designUI.md 条款或本 feature 登记"。
  - **F-6（阻断，tasks）守卫依赖缺失**：T-10 验证 4、T-19 验证 2、T-20 验证 4 调用 `guards network-scope` / `guards updown-scope`，但三者的依赖链（T-10←T-09←T-01；T-19 / T-20←T-15←T-08 / T-10）不含 T-07（守卫创建处）。修法：T-10、T-19、T-20 的依赖加 T-07。
  - **F-7（建议）bare-1fr 豁免冗余**：plan §2.8 与 T-07 完成标准 3"`.shell` 规则豁免并登记" vs plan §2.2 `.shell` 已写 `var(--fai-rail-w) minmax(0,1fr)`。豁免无必要，建议删除，守卫零豁免。
  - **F-8（建议）完成标准超出所引 AC**：T-13"bootstrap 失败显示文案与重试（AC-002-1）"、T-22"抽屉两档高度与收起可切换（AC-005-1）"。修法：再批准时把两条补进对应 AC，或在任务里标注"plan 行为，超出 AC"。
  - **F-9（信息）文件清单漂移**：plan §1 目录树 `shared/components/`（Badge、Chip、EmptyState、DataTable、BoardGrid、Spark）vs tasks（新增 Num、Kpi、ErrorState、Loading；Chip 无任务创建）；plan 头部仍写"Gate 1 冻结版"未注明 Q-015 基线（tasks 头部已注明）。
- [ ] 与 docs/ 决策与 ADR 无冲突（阻断）——
  - **F-10 涨跌专色作用域**：designUI §2.2 标题"涨跌颜色（行情模块专属，D-011）"及"两套语义以模块为界，互不渗透"、D-011 结论 6"边界以模块划分" vs spec R-001（焦点带中声明为行情语义的数字用涨跌专色）与 R-003 / Q-013（焦点带同时承载行情与分析两类数字——同一个红在相邻数字卡上一个表示涨、一个表示减）。焦点带不是模块，spec 把"模块"改释为"行情语义位置"，这是对 D-011 边界规则的扩展；按 AGENTS §0"实现与 docs 冲突时以 docs 为准"与 §4"方案变更先改 docs"，须先改 docs。修法：designUI §2.2 增一句"焦点带中由契约声明为行情语义的数字同样使用涨跌专色，并与分析数字分组呈现（frontend-workbench Q-013 / Q-015）"；D-011 为 ADR 不改历史文件，补一份短 ADR（如 D-013：涨跌专色作用域 = 登记的行情语义位置）或由 Walter 在再批准记录中明示"按 spec 解释 D-011"。附带设计建议：焦点带内把行情数字与分析数字分组（如"行情 | 指标"两段），让"以区块为界"在视觉上成立；M-03 人工验收看这一点。Q-015 回流提交（35865dc）只改了 specs/，docs 未动。
  - 信息（既有 docs 漂移，非本 feature 造成）：D-011 结论 5"边 7–14% 白描边" vs designUI §2.1"玻璃边 .07–.12"；plan 取 .07 / .09 / .12 两边都满足，建议顺手对齐。
  - 其余核对无冲突：菜单八项与顺序（D-011 / designUI §3）、三层玻璃与值（designUI §2.1）、文字三级、涨跌值（D-011）、退役五色（designUI §2.3 / PALETTE_CORE `palette-retired`）、ECharts theme 注册（designUI §4.2）、Pinia（D-008）、不触碰 backend（D-002）、目录 `frontend/` 与 `design/`（docs/plan.md §5）、README 只索引不复制数值（docs/plan.md §4）、按需逐份搬运（designUI §8）。
- [x] 与 data-layer 契约对齐 —— plan §2.7 错误码集合（not_found / unauthorized / validation_error / internal / adapter_error / rate_limited）与 specs/data-layer/plan.md 错误契约六码完全一致；`Figure.seriesId` 对齐 data-layer 序列 ID（architecture §6 溯源）。备注：WatchlistTable 行应携带含 contract 的 seriesId（D-012 第 1 条描述符含可选 contract），见 C-5 c。
- [x] Q-003 配色裁定登记一致且数值可复算 —— plan §2.1 配色表 17 行与样张页 `THEMES.dark.c` 逐值相同；样张页首已标"已裁定 A 等亮"；独立复算 16 个对比度（对 `#1D1E20`）与 plan 表逐一吻合（四舍五入到 0.1），区间带 α .16 叠加后 1.44（表 1.4），序列七色最小 ΔE 8.5（沙饧 / 缥碧）与表一致；卡面 `#1D1E20` = 玻璃 .045 叠 `#121315` 推导正确；文字用色五个均 ≥ 4.5（点睛红 4.59 为最低），序列七色均 ≥ 3（苍艾 4.55 为最低）。
- [x] FTEngine 条目锚点可追溯 —— plan §2.9 列出的全部"采用 / 不采用"锚（UI_FOUNDATIONS 12 个、UI_COLORS 7 个、UI_FONTS 3 个、UI_LAYOUT 9 个、UI_COMPONENTS 10 个、UI_CARDS 4 个、UI_TABLES 8 个、UI_NAV 3 个）在 `D:\FTEngine\design\UI\*` 源文件中都存在；字号阶梯、间距、圆角、断点（980 / 1240 / 1400 / 1500）、字体栈、退役五色与源碎片原值一致。不采用清单不全的问题见 C-3 b。

## 3. 可测试性

- [ ] 每条验收规则可映射到自动测试或人工验收步骤（阻断）—— plan §5 为 41 条 AC 都给了实现位置与验证方式（附录 A）；但其中 2 条按当前 plan 不可通过、4 条有条件：
  - **F-11（阻断）mock `error` 场景与启动**：plan §2.7"error = 每方法返回固定错误"含 `bootstrap()` → 应用停在 `failed` 加载页，T-25 的 error 用例（模块错误态含诊断，AC-007-2）与 AC-004-4 的 `scenario=error` 路径到不了工作台。修法：plan 明确 error 场景下 `bootstrap()` 成功；若要覆盖启动失败路径另设 `boot-error` 场景。
  - **F-12（阻断）index.html 首帧与零字面量**：plan §2.2 要求 index.html 静态骨架"挂载前即可见、无空白帧"，骨架在 CSS 加载前必须有背景色；写成内联样式即为令牌外字面量（AC-001-2"前端源码（样式与脚本）"），而 `color-literals` 只扫 `src/**`，index.html 漏网。修法：`tokens-build` 额外产出 `generated/critical.css`，构建时内联进 index.html（Vite 插件或模板注入），`color-literals` 扫描范围加入 index.html 并以生成块标记为允许名单。
  - 有条件：AC-001-2（范围缺 index.html，同上）；AC-002-1（"无空白帧"以首帧背景 + 骨架存在近似，可接受，须在测试里写明近似口径）；AC-002-6（F-1）；AC-008-2（F-5）；AC-004-1（F-2 / F-3）。
- [ ] 任务粒度与验证命令满足 tasks.md 模板要求（阻断，三处小修即过）—— 27 个任务均在 0.5–2 h（合计 41 h 复算无误），每个任务含上下文 / 修改范围 / 依赖 / 完成标准（引用 AC 编号）/ 验证命令，验证命令与完成标准条数一一对应（27/27），测试标题以 AC 编号开头的约定使 `-t` / `-g` 可逐条执行；AC 覆盖矩阵 41/41 且与任务正文互证。未通过原因：F-6（三处守卫依赖缺 T-07）、F-8（两处完成标准超出所引 AC）。
- [x] 人工验收项有清单载体且与 spec 对应 —— spec R-009 列的七项（层次 / 字族与双语 / 焦点带 / 模块壳 / 抽屉与时间线 / 窄窗口 / ticker）+ 图表主题 = plan §5 M-01~M-08；AC-001-3 / AC-004-5 / AC-006-4 的人工部分分别挂 M-01 / M-04 / M-08；T-26 产出 `manual-acceptance.md` 并用单元测试核"看什么"字段存在（AC-009-2）。

## 4. 其他自定义项

- [ ] C-1 Gate 1 再批准（阻断，流程）—— spec 头部"待 Walter 重新批准（重过 Gate 1）"尚未发生；AGENTS §2 第 8 步的顺序是"更新 spec → 重过 Gate 1 → 更新 plan/tasks"，本次 plan / tasks 已先行同步（标为草案），可接受，但若 Walter 否决 Q-015 则须回退 plan §2.1 / §2.3 / §2.4 / §2.8 / §5 与 tasks T-07 / T-08 / T-10 / T-17 / T-19 / T-20 / 矩阵。再批准时应一并裁定 F-18 的五个新歧义与 F-17 的 AC 补写。
- [x] C-2 Q-015 修订在 spec / plan / tasks / 状态表中完整一致 —— 见附录 B：spec 头部、R-001 色语义、AC-001-5、R-004 两处、AC-004-5、§5 Q-015 行；plan §1 目录树（updown.css）、§2.1 三处、§2.3、§2.4 watchlist 行、§2.8 updown-scope、§5 两行；tasks 头部、T-07 / T-08 / T-10 / T-17 / T-19 / T-20、矩阵；specs/README 状态表。grep 无"唯一使用涨跌""只在行情模块""market-board/updown.css"残留；AC-001-5 的"登记位置"三处口径（spec / plan 守卫 / tasks）一致。
- [ ] C-3 守卫定义精度（建议，写入 plan §2.8 后随 T-02 / T-07 落地）—— F-13：
  - a）`updown-scope`：涨跌令牌的**定义处**（tokens.json、generated/tokens.css、generated/tokens.ts、echarts-theme.json 若含）须豁免，只查引用；plan 未写。
  - b）`design-registry:entries`：须核 `adopted ∪ not_adopted` = 条目正文全部 `### #anchor`，否则 R-008"未采用的规定明确标注"无机器保证。plan §2.9 的不采用清单本身不全：UI_FOUNDATIONS 漏 shadow_overlays_only / square_corners（实际采用）；UI_COMPONENTS 漏 legend / caret / zpill / pxlight / triage_card / fqb / toolbars / footnote / tip_shells；UI_LAYOUT 漏 internal_geometry / rail；UI_NAV 漏 nav_table / lpg_nav / exempt；UI_CARDS 漏 card_family；UI_TABLES 漏 gbal_edit。
  - c）tokens `source = docs/designUI.md#<节>` 的锚解析规则未定义（标题为中文）；建议用节号（`#2.1`）并由守卫按 `^#{2,3} 2\.1` 解析。
  - d）`glass-tiers` 只扫 CSS 的 `backdrop-filter`；`generated/echarts-theme.json` 的 tooltip `extraCssText` 与 `.vue` 内联 `style=` 可绕过，应纳入扫描。
  - e）`color-literals` 范围不含 index.html / scripts / e2e；至少 index.html 应纳入（F-12）。
- [ ] C-4 涨跌语义的运行时防线（建议）—— F-14：AC-001-5 的静态守卫只约束 `updown.css` 的引入位置；该文件一旦被 market-board 引入即全局生效，任何渲染 `sem-market` 类的组件都会得到涨跌色，而"行情语义"由 fixture 的 `semantic` 字段声明，守卫管不到。建议加一条单元测试：除 `market-board.json` / `watchlist.json` / `daily-brief.json` 外的 fixtures 不得含 `semantic: 'market'`；CONTRACT.md 写明哪些方法的 Figure 允许 market 语义。
- [ ] C-5 plan 细节补齐（建议，Analyze 前补）—— F-15：
  - a）type.* 登记子集缺 §2.4 用到的 `en_sub 10.5`，以及模块壳 / 盘面 / 小表会用的 `card_sub 11`、`card_r 11`、`board_td / board_stub 12`、`mini_td 11`、`unit 10.5`、`btn 12`；T-05"按 §2.1 全量登记"口径不清，建议改为"main_scale 全量照搬 + 新增两项"。
  - b）三层玻璃 alpha 映射未写明（.035 / .045 / .06 分别归焦点带 / 模块 / 抽屉？抽屉面另有 `rgba(24,25,28,.82)`），建议表格化：focus / module / drawer × surface / border / blur。
  - c）`WatchlistTable` 行结构未定义；建议 `{contract, seriesId, last: Figure, change: Figure, changePct: Figure, spark: number[]}`，seriesId 与 data-layer 含 contract 的描述符一致（D-012 第 1 条）。
  - d）注册表缺 R-004 要求的"说明"字段（模块库展示用）。
  - e）`ModuleLibrary`"抽屉式列表"应复用三层之一（建议 `.glass-drawer`），避免第四层玻璃。
  - f）spec R-009 把"模块壳结构"列为静态守卫，plan 以组件 / e2e 测试实现（AC-004-3 的"自动检查"可满足），建议 plan §2.8 注明归类差异。
  - g）R-007 what 要求的"分页与时间参数约定"：v1 无分页应在 CONTRACT.md 明示；`getReleaseCalendar(from, to)` 的闭开区间与时区约定应写明（对齐 data-layer range end 闭区间）。
  - h）AC-006-3 e2e 读取图实例的途径未写（建议 mock 模式下 SampleChart 把实例挂到 `window.__FAI_CHARTS__[id]`）。
  - i）plan §2.5 pi 事件对照引用 pi 仓库的 `docs/json.md`，本仓库内不可核验；建议登记 pi 版本号与文档路径。
- [x] C-6 隐私 / 安全 / 文件边界 —— mock 数据声明不含真实头寸、凭证、私有文档（plan §3；positions 模块"mock 不含真实头寸"）；网络 API 只许在 `src/contracts/real/`（守卫）；`.gitignore` 只追加五行、不移除锚点；不触碰 `backend/`；回滚路径清楚（plan §6）。提醒：根 `.gitignore` 是 Python 模板，已含 `dist/`（`frontend/dist/` 已被覆盖，追加无害）、`lib/`（会吞掉任何 `frontend/**/lib/` 目录，plan 目录树未用，T-01 留意）、`*.spec`（不匹配 `.spec.ts`，无影响）。
- [ ] C-7 AC 覆盖的机械核验（建议）—— F-16：验证命令可逐条执行的前提是"每个 AC 至少有一个以其编号开头的测试 / 守卫标题"，plan 没有守卫保证。建议 T-26 加 `scripts/guards/ac-coverage.mjs`：从 spec.md 抽 AC 列表，扫 tests/、e2e/ 标题与 guards 的 AC 注记，缺失即红，作为 Converge 的机械证据。
- [x] C-8 spec 去技术化程度可接受（信息）—— AC-004-6 含 CSS `1fr`、Q-007"浏览器本地持久化"等轻度技术表述；均为可验证规则且已过 Gate 1，不作阻断。若 Walter 要求与 data-layer 同一口径，再批准时可改写为行为描述（如"栅格列不得被内容撑破"）。

## 附录 A：AC 逐条可测试性核对（41 条）

判定：✓ 可按 plan §5 验证；△ 有条件（需先修对应 F 项或补口径）；✗ 按当前 plan 不可通过。

| AC | 验证方式（plan §5） | 任务 | 判定 | 备注 |
|---|---|---|---|---|
| AC-001-1 | 守卫 tokens-sync（generated / media） | T-05、T-18 | ✓ | |
| AC-001-2 | 守卫 color-literals（阳性 / 阴性 fixtures） | T-06 | △ | 范围缺 index.html（F-12、C-3 e） |
| AC-001-3 | 守卫 glass-tiers + M-01 | T-07、T-26 | ✓ | 建议扩到 theme JSON / 内联 style（C-3 d） |
| AC-001-4 | unit format + component typography | T-08 | ✓ | 组件测试只能断言类名；计算样式留 M-02 |
| AC-001-5 | 守卫 updown-scope + 组件测试 | T-07、T-08、T-19、T-20 | ✓ | 守卫须豁免定义处（C-3 a）；运行时防线建议（C-4） |
| AC-001-6 | color-literals:retired + theme-contrast:retired | T-06、T-21 | ✓ | 五个退役 hex 与 PALETTE_CORE 一致 |
| AC-002-1 | e2e 首帧骨架 → 工作台 | T-13 | △ | 首帧背景令牌来源未定（F-12）；失败路径超出 AC（F-8） |
| AC-002-2 | e2e 八项 / aria-current / 刷新 / 占位 | T-12 | ✓ | |
| AC-002-3 | e2e + `window.__FAI_MOCK__` 注入 | T-14 | ✓ | |
| AC-002-4 | component ticker / 状态点类 | T-14 | ✓ | |
| AC-002-5 | e2e 折叠 → reload | T-12 | ✓ | |
| AC-002-6 | e2e 十个视口 | T-18 | △ | 1240 处栅格列数不变，与 spec 文字冲突（F-1） |
| AC-003-1 | component | T-17 | ✓ | |
| AC-003-2 | e2e → `/daily/<date>` | T-17 | ✓ | |
| AC-003-3 | component 空态 | T-17 | ✓ | reason 经第二次调用取，建议并入返回体 |
| AC-003-4 | component 语义类 | T-17 | ✓ | docs 冲突见 F-10（不影响可测性） |
| AC-004-1 | e2e 模块库 / 默认七个 | T-16 | ✗ | plan 模块库只显示未启用模块（F-3）；默认顺序无断言（F-2） |
| AC-004-2 | e2e 上下移 / 移除 / 添加 → reload | T-16 | ✓ | |
| AC-004-3 | component 逐模块 + e2e 遍历 | T-15、T-16、T-20 | ✓ | |
| AC-004-4 | component 三态 + 剪贴板 mock | T-15 | ✓ | error 场景需 bootstrap 可达（F-11） |
| AC-004-5 | component 三模块 + M-04 | T-19、T-20、T-26 | ✓ | |
| AC-004-6 | 守卫 bare-1fr | T-07 | ✓ | `.shell` 豁免冗余（F-7） |
| AC-005-1 | e2e 每页输入栏 / 抽屉展开 | T-22 | ✓ | T-22 两档高度超出 AC（F-8） |
| AC-005-2 | component 回放 success / failure | T-23 | ✓ | |
| AC-005-3 | e2e long 脚本切页 | T-24 | ✓ | |
| AC-005-4 | e2e data-ai running → done → none | T-24 | ✓ | "查看"定义为点击，建议写进 AC |
| AC-005-5 | e2e 入口 → 路由 + data-highlight | T-24 | ✓ | |
| AC-005-6 | unit 三脚本 parse + contract-doc | T-09、T-10、T-11 | ✓ | |
| AC-006-1 | tokens-sync + theme-contrast:retired | T-21 | ✓ | |
| AC-006-2 | theme-contrast:contrast（3 / 4.5，豁免登记） | T-21 | ✓ | 数值已独立复算 |
| AC-006-3 | e2e getOption().color | T-21 | ✓ | 实例获取途径待写（C-5 h） |
| AC-006-4 | e2e backgroundColor + M-08 | T-21、T-26 | ✓ | |
| AC-007-1 | 守卫 network-scope | T-07、T-10 | ✓ | |
| AC-007-2 | unit + e2e 四场景 | T-10、T-25 | ✗ | error 场景覆盖 bootstrap（F-11） |
| AC-007-3 | 守卫 contract-doc | T-11 | ✓ | |
| AC-007-4 | unit fixtures parse + 反例 | T-09、T-10 | ✓ | |
| AC-008-1 | design-registry entries / required / docs | T-02、T-03、T-04、T-27 | ✓ | 覆盖完整性待加（C-3 b） |
| AC-008-2 | design-registry:sources | T-02、T-05 | △ | `spec:R-00x` 超出 AC 允许的来源（F-5） |
| AC-008-3 | design-registry:palette | T-02、T-04 | ✓ | |
| AC-009-1 | `pnpm -C frontend test` 退出码 0 | T-01、T-26 | ✓ | |
| AC-009-2 | manual-acceptance.md + unit 检查 | T-26 | ✓ | |

## 附录 B：Q-015 回流修订核对

| 位置 | 修订内容 | 核对 |
|---|---|---|
| spec 头部 | 回流记录 + 待再批准 | ✓ |
| spec R-001 色语义 | 涨跌专色 → 行情语义的数字（行情价格、关注列表、焦点带声明） | ✓ |
| spec AC-001-5 | 引用范围 → 登记的行情语义位置三处 | ✓ |
| spec R-004 内容深度 / 末条 | 关注列表 = 合约价格、红涨绿跌；v1 用涨跌专色的模块 = 行情价格 + 关注列表 | ✓ |
| spec AC-004-5 | "数据表涨跌字色" → "关注列表…红涨绿跌字色" | ✓ |
| spec §5 | Q-015 行（含发现背景与裁定日期） | ✓ |
| plan §1 目录树 | `src/design/updown.css` 唯一定义处 | ✓ |
| plan §2.1 | 字体与数值段、涨跌色作用域段、状态语义色"行情语义内" | ✓ |
| plan §2.3 | 焦点带引入 `src/design/updown.css` | ✓ |
| plan §2.4 | watchlist 行 = 合约价格、market 语义 | ✓ |
| plan §2.8 | updown-scope 守卫定义（引用 + 引入两级） | ✓ |
| plan §5 | AC-001-5、AC-004-5 两行 | ✓ |
| tasks 头部 / T-07 / T-08 / T-10 / T-17 / T-19 / T-20 / 矩阵 | 依据、守卫口径、updown.css 落点、fixture 语义、关注列表取色与新增验证 4 | ✓ |
| specs/README.md 状态表 | 回流记录 | ✓ |
| docs/designUI.md §2.2 / D-011 | 未同步（提交 35865dc 不含 docs） | ✗ 见 F-10 |

未发现旧表述残留（grep"唯一使用涨跌 / 只在行情模块 / 行情模块专属 / 仅 market-board / market-board/updown"仅命中 Q-015 行的历史引述）。

## 附录 C：待登记的新歧义（建议编号）

| # | 问题 | 来源 | 建议 |
|---|---|---|---|
| Q-016 | 默认模块顺序：designUI §3 / spec R-004 列表顺序，还是 plan 注册表顺序（完整 mock 三模块在前）？ | F-2 | 由 Walter 裁定；spec 明示并加 AC 断言 |
| Q-017 | 1240 断点归属：栅格列数还是仅焦点带卡数？ | F-1 | 推荐改 spec 文字，plan 保持 |
| Q-018 | 模块库是否列出已启用模块？ | F-3 | 推荐列全七个带状态 |
| Q-019 | 焦点带内行情与分析数字是否分组呈现？docs 如何登记作用域扩展？ | F-10 | 推荐分组 + designUI §2.2 一句 + 短 ADR |
| Q-020 | 本 feature 新增令牌（z、timeline_step、ticker、radius 例外）的登记位置 | F-5 | 推荐新条目文件 |

## 复核条件

1. Walter 对 Q-015 修订版 spec 再批准（Gate 1），并裁定 Q-016~Q-020；F-4 / F-17 / F-8 涉及的 spec 文字一并修订。
2. docs 先行同步：designUI §2.2 涨跌作用域一句（+ 短 ADR 或再批准记录明示）；可选对齐 D-011 结论 5 与 designUI §2.1 的玻璃边范围。
3. plan 修订：F-1（若选 plan 侧）、F-3、F-5、F-7、F-11、F-12；C-3 / C-5 按建议补齐；plan 头部注明 Q-015 基线。
4. tasks 修订：F-6（T-10 / T-19 / T-20 依赖加 T-07）、F-8、C-7（可选）。
5. 以上完成后重跑本清单；与审核员 B 的结果按共识汇成 `checklist.md`，方可按 AGENTS §2 进入 Analyze / Implement。
