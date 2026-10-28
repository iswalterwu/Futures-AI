# Frontend-workbench 人工验收清单

依据：[spec R-009 / AC-009-2](spec.md)、[plan §5 验收对应](plan.md)，沿用 FTEngine PG-MAN 的人工视觉检查方式。本清单不替代自动化测试；**Handoff 状态（2026-10-28）**：M-01 ~ M-08 已由 Handoff 执行者（AI）在 Chrome 中实际操作并逐张看图，截图与采集元数据见 [assets/handoff/](assets/handoff/README.md)，各项下方“AI 辅助视觉验收”记录观察结果；这**不是** Walter 本人的人工验收，下列“人工验收通过”勾选框保持未勾选，待 Walter 复核后填写。Handoff 新发现 H-01 / H-02 已登记到 [tasks.md](tasks.md)「P3 后续台账」，未经 Walter 处置。

## 准备与记录

- 按 [frontend/README.md](../../frontend/README.md) 安装、启动，并先执行 `pnpm -C frontend test`；使用本机 Chrome 与默认 mock 数据，不接后端。
- 用新浏览器上下文打开 `/workbench?scenario=normal`，或仅删除当前站点的 `fai.rail` / `fai.drawer` / `fai.layout` 后刷新，以默认模块顺序、侧栏与抽屉状态起步。
- 基准视口取 [tokens.json](../../frontend/src/design/tokens.json) 的 `window.width` / `window.height`；尺寸以 CSS px 计。颜色、字号、玻璃、间距和断点均查令牌与 [designUI](../../docs/designUI.md)，不在本清单另记数值。
- 每项由验收人实际观察后勾选；Handoff 将该项的「待补」替换为可访问的截图链接，并记录提交号、浏览器版本、视口、场景 / 回放脚本、验收人和日期。动态行为另写观察结果，不能凭静态截图判定动画或后台连续性。
- 未通过时保持未勾选，注明实际表现和关联问题；不得用自动化通过替代视觉结论，也不得提交含私有数据的截图。

## M-01 玻璃层次

- 对应验收：AC-001-3。
- 操作：在基准工作台查看整页，分别打开模块库与对话抽屉，再收起。
- 看什么：暖灰暗底上焦点带、模块、抽屉三层清楚但不刺眼；侧栏与顶栏复用焦点层、模块库复用抽屉层，子卡不出现第四种玻璃面。焦点带是独立一行，不叠到模块正文；打开浮层后边界、文字和底部输入栏仍能辨认，没有混成一片或多层雾化。
- 截图证据：[m01-1440-workbench](assets/handoff/m01-1440-workbench.png)、[m01-1440-library-open](assets/handoff/m01-1440-library-open.png)、[m01-1440-drawer-half](assets/handoff/m01-1440-drawer-half.png)、[m01-1440-closed-again](assets/handoff/m01-1440-closed-again.png)。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：符合。焦点带 / 模块 / 抽屉三层玻璃层次清楚、不刺眼；侧栏与顶栏同焦点层，模块库与对话抽屉同抽屉层；焦点带是独立一行，不叠到模块正文；打开模块库或抽屉后边界、文字与底部输入栏仍可辨认，未见第四种玻璃面或多层雾化。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）

## M-02 字族与双语

- 对应验收：AC-001-4、R-001 双语层级。
- 操作：对照品牌字标、页标题、焦点带 KPI、模块壳、关注列表和 ticker；放大查看文字与数值局部。
- 看什么：品牌 / 页标题 / KPI 大数用衬线，模块壳标题 / 正文 / 导航 / 按钮 / 表格文字用无衬线；KPI 外的数值、单位、代码和 ticker 用等宽。数值字宽稳定、列内右对齐；中文主标题突出，英文副标全大写、小字号、加宽字距，不压过中文。空值为 en dash、差值带正号，显示为零时中性且无负零。
- 截图证据：[m02-rail-brand](assets/handoff/m02-rail-brand.png)、[m02-page-title-placeholder](assets/handoff/m02-page-title-placeholder.png)、[m02-focus-kpi](assets/handoff/m02-focus-kpi.png)、[m02-watchlist-table](assets/handoff/m02-watchlist-table.png)。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：符合。字标 / 页标题 / KPI 大数为衬线（KPI 用 Georgia 旧式数字，数字高低错落是该字形特征）；模块壳标题、正文、导航、按钮与表格文字为无衬线；关注列表价格 / 涨跌 / 涨跌幅为等宽且右对齐；中文主标题突出，英文副标全大写、小字号、宽字距；差值带正号，零值 `0` 中性无号。备注：样例图图注“近 60 日收盘 · 样例”中的 60 单独成行，图注断成三行（H-01，见 M-08）。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）

## M-03 焦点带两段

- 对应验收：AC-003-1、AC-003-3、AC-003-4、AC-003-5、AC-003-6。
- 操作：查看正常工作台的结论与数字，增删模块后再查看焦点带；点击焦点带检查日报入口，再直接打开 `/workbench?scenario=empty`。
- 看什么：「行情 | 指标」两段有清晰的双语段标与分隔；行情数字只在行情段红涨绿跌，指标段保持红 = 负 / 减，不让相邻卡的同色含义混淆。结论、数字、单位与变化量易读；模块布局变化不挤走焦点带，模块库不提供焦点带的增删；日报入口保留当日标识，无日报时明确说明原因而非留白。
- 截图证据：[m03-focus-normal](assets/handoff/m03-focus-normal.png)、[m03-after-layout-change](assets/handoff/m03-after-layout-change.png)、[m03-daily-entry](assets/handoff/m03-daily-entry.png)、[m03-focus-empty](assets/handoff/m03-focus-empty.png)。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：符合。「行情 | 指标」有双语段标与竖线分隔；行情段 +1.50% / +0.60% 为涨色、−0.46% 为跌色，指标段 −35 为分析红、+0.8 为分析正色、0 中性，相邻卡未出现同色异义；移除 / 上移模块后焦点带仍固定在顶部，模块库中没有焦点带；点击进入 `/daily/2026-10-28`，日报占位页显示该日期；empty 场景显示“今日日报尚未生成。”。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）

## M-04 模块壳与形态

- 对应验收：AC-004-3、AC-004-4、AC-004-5。
- 操作：滚动查看全部模块、打开模块库；分别直接进入 `/workbench?scenario=slow`、`/workbench?scenario=empty`、`/workbench?scenario=error` 查看三态。
- 看什么：各壳的中文标题、英文副标（有时）、右注、状态徽、AI 角标位和操作区位置统一；样例态同时有「样例」文字与虚线，不靠颜色区分。行情盘面含正常数值与「休 / 待 / –」三态格；关注列表价格 / 涨跌 / 涨跌幅等宽右对齐，红涨绿跌只涂字不涂底，迷你折线清楚；日历按日期时间升序且来源 / 新鲜度清楚。其余模块明确为示例占位；加载 / 空 / 错误态不留白，错误诊断与复制入口可辨认。
- 截图证据：[m04-market-board](assets/handoff/m04-market-board.png)、[m04-board-grid](assets/handoff/m04-board-grid.png)、[m04-watchlist](assets/handoff/m04-watchlist.png)、[m04-release-calendar](assets/handoff/m04-release-calendar.png)、[m04-placeholder-supply-demand](assets/handoff/m04-placeholder-supply-demand.png)、[m04-placeholder-positions](assets/handoff/m04-placeholder-positions.png)、[m04-library-dialog](assets/handoff/m04-library-dialog.png)、[m04-library-dialog-bottom](assets/handoff/m04-library-dialog-bottom.png)、[m04-slow](assets/handoff/m04-slow.png)、[m04-empty](assets/handoff/m04-empty.png)、[m04-error](assets/handoff/m04-error.png)、[m04-error-detail](assets/handoff/m04-error-detail.png)。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：符合。各壳标题 / 英文副标 / 右注 / 状态徽 / AI 角标位 / 操作区位置统一；样例态是虚线框加“样例”文字；盘面含正常数值与 `待 / – / 休` 三态格；关注列表数值等宽右对齐，红涨绿跌只涂字色，迷你折线清楚；日历按日期时间升序，来源与新鲜度点清楚；四个占位模块注明“内容随 domain feature 交付”，头寸不含真实数据；模块库列出七项且均标“已在工作台”；slow / empty / error 三态不留白，错误态诊断 JSON 与“复制诊断 / 重试”可辨认。已知项：右注为原样 ISO 时间（R1-06，已接受为后续）；错误态左侧强调竖条与居中文案不对齐，属轻微外观备注。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）

## M-05 抽屉与时间线

- 对应验收：AC-005-1、AC-005-2、AC-005-3、AC-005-4、AC-005-5、AC-005-7。
- 操作：直接打开 `/workbench?agentScript=success` 并发送一条消息，展开步骤，切换「半高 / 加高 / 收起」并刷新核对档位；分别以 `failure`、`retry` 重开页面后发送消息，再以 `long` 回放观察运行中切页、收起和重新展开。点击建议跳转与关联模块查看角标。
- 看什么：输入栏全局可见，提交后用户消息与时间线出现；两档抽屉层次明确，长详情可滚动且不挡输入。思考摘要、工具调用、工具结果、文本输出与终态可区分，详情展开不重叠；失败与重试过程表达清楚，不把非终态错误误画成结束。长运行期间切页 / 收起后步骤连续、不重复，输入栏运行中指示在终态后消失；模块角标从运行中变完成、查看后清除，建议跳转的目标高亮可见。
- 截图证据：[m05-success-half](assets/handoff/m05-success-half.png)、[m05-success-steps-expanded](assets/handoff/m05-success-steps-expanded.png)、[m05-success-tall](assets/handoff/m05-success-tall.png)、[m05-failure](assets/handoff/m05-failure.png)、[m05-retry](assets/handoff/m05-retry.png)、[m05-long-running-badge](assets/handoff/m05-long-running-badge.png)、[m05-long-completed](assets/handoff/m05-long-completed.png)、[m05-long-done-badge](assets/handoff/m05-long-done-badge.png)、[m05-long-badge-cleared](assets/handoff/m05-long-badge-cleared.png)、[m05-hint-highlight](assets/handoff/m05-hint-highlight.png)；后台连续性与档位持久化的实测记录见 [截图索引](assets/handoff/README.md#动态行为观察脚本实际执行)。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：符合。输入栏全局可见，提交后出现用户消息与时间线；半高 / 加高层次明确，加高后长详情在抽屉内滚动、不挡输入；思考摘要 / 工具调用 / 工具结果 / 文本输出 / 建议跳转 / 终态各有图标与标签，展开详情不重叠；failure 的失败工具结果与步骤错误带红色强调，终态为“运行失败”；retry 的非终态步骤错误之后继续运行并完成，没有被画成结束；long 运行收起抽屉并切页后同一运行连续完成（步骤 1–7 不重复），运行中指示在终态后消失；行情价格角标“AI 运行中”→“AI 已完成”→ 点击后清除；建议跳转后高亮可见。加高与收起档位刷新后保持。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）

## M-06 窄窗口

- 对应验收：AC-002-6。
- 操作：从基准视口缩到 `window.min_width`，在 `breakpoint.shell_collapse`、`breakpoint.focus_expand`、`breakpoint.grid_three`、`breakpoint.grid_four` 各阈值两侧检查，再放回基准。具体视口与预期对照 [plan §5](plan.md) 和 [breakpoints.spec.ts](../../frontend/e2e/breakpoints.spec.ts)，高度使用 `window.height`；窄窗中也打开抽屉与模块库。
- 看什么：侧栏在登记断点下变顶部横向导航，菜单可读、当前项明确；模块栅格列数与焦点带数字卡数量按各自断点变化，不把焦点断点误当栅格断点。卡头、双语段标、数字、图表与底部输入不挤压、裁切或互相覆盖；所有支持宽度都没有横向页面滚动条，返回宽窗后布局恢复。
- 截图证据：[m06-1440](assets/handoff/m06-1440.png)、[m06-1501](assets/handoff/m06-1501.png)、[m06-1499](assets/handoff/m06-1499.png)、[m06-1401](assets/handoff/m06-1401.png)、[m06-1399](assets/handoff/m06-1399.png)、[m06-1241](assets/handoff/m06-1241.png)、[m06-1239](assets/handoff/m06-1239.png)、[m06-981](assets/handoff/m06-981.png)、[m06-979](assets/handoff/m06-979.png)、[m06-960](assets/handoff/m06-960.png)、[m06-1440-restored](assets/handoff/m06-1440-restored.png)、[m06-960-library](assets/handoff/m06-960-library.png)、[m06-960-drawer](assets/handoff/m06-960-drawer.png)、[m06-960-watchlist](assets/handoff/m06-960-watchlist.png)。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：清单判据满足，另有一项外观问题待 Walter 裁定。侧栏形态、栅格列数（1501→4，1499 / 1401→3，1399 ~ 981→2，979 / 960→1）与焦点卡数（≥1241 为 6，≤1239 为 4）各按其断点变化，未把焦点断点误当栅格断点；卡头、段标、数字、图表与底部输入不互相覆盖；所有视口无横向页面滚动条，放回 1440 后恢复；窄窗模块库与抽屉可读。**H-02（新发现）**：小于 980 时，顶部横向导航里“专题研究”的两个子项纵向堆叠在导航行下方，顶部导航区高约 205 px，“专题研究”与“知识库”之间留出空白；960 ~ 979×900 下模块区可视高度只有约 215 px，样例图无法一屏完整显示（可滚动、不重叠）。这与 UI_LAYOUT `#rail` 中已采用的“塌成顶栏横向滚动”不一致。另见 ≤1239 时焦点带为“行情 3 + 指标 1”（R1-11，已接受为后续）。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）

## M-07 ticker

- 对应验收：AC-002-4、AC-009-2。
- 操作：正常工作台观察资讯滚动一轮，鼠标悬停或聚焦资讯区；在 Chrome 开发者工具 Rendering 中模拟 `prefers-reduced-motion: reduce`，再查看 `/workbench?scenario=empty`。
- 看什么：资讯使用等宽字体，时间 / 标题 / 来源易辨认，滚动连续且速度可读，不挤压右侧数据源状态；悬停或聚焦可暂停。减少动态效果时静止且可在资讯区横向查看内容，不带出页面横滚。新鲜 / 待更新状态点与文案一致，不用行情绿色表达状态；无资讯 / 无数据源时有说明，不留下突兀空洞。
- 截图证据：[m07-ticker-t0](assets/handoff/m07-ticker-t0.png)、[m07-ticker-t3s](assets/handoff/m07-ticker-t3s.png)、[m07-ticker-hover-paused](assets/handoff/m07-ticker-hover-paused.png)、[m07-ticker-reduced](assets/handoff/m07-ticker-reduced.png)、[m07-ticker-reduced-scrolled](assets/handoff/m07-ticker-reduced-scrolled.png)、[m07-ticker-empty](assets/handoff/m07-ticker-empty.png)；滚动、暂停与横向查看的实测记录见 [截图索引](assets/handoff/README.md#动态行为观察脚本实际执行)。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：符合。时间 / 标题 / 来源可辨认（时间与拉丁字符为等宽，中文落回系统 CJK 字形），滚动连续（约 19 px/s），不挤压右侧数据源状态；悬停与聚焦时暂停；模拟减少动态时静止，可在资讯区内横向查看，页面无横滚；新鲜为蓝点、待更新为琥珀点，与文案一致，未用绿色；empty 场景显示“暂无资讯 / 暂无数据源状态”。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）

## M-08 图表主题

- 对应验收：AC-006-1、AC-006-2、AC-006-3、AC-006-4。
- 操作：在正常场景查看行情价格模块的样例折线，悬停查看浮窗，并在基准与窄窗口对照 [PALETTE_DARK](../../design/charts/PALETTE_DARK.md) 和 [tokens.json](../../frontend/src/design/tokens.json)。
- 看什么：图表画布透明、与模块玻璃底连续，没有白底块；主序列、轴字、刻度和网格层次分明，不因暗底而糊成一片；线条、文字和浮窗可读且不被卡片裁切。主题保持黛驼亮化身份、不使用退役色；完整色板 / 对比度以自动化对拍为准，不把单序列样例当作全部图型的人工验证。
- 截图证据：[m08-chart-1440](assets/handoff/m08-chart-1440.png)、[m08-chart-1440-tooltip](assets/handoff/m08-chart-1440-tooltip.png)、[m08-chart-960-scrolled](assets/handoff/m08-chart-960-scrolled.png)、[m08-chart-960-scrolled-tooltip](assets/handoff/m08-chart-960-scrolled-tooltip.png)（[m08-chart-960](assets/handoff/m08-chart-960.png)、[m08-chart-960-tooltip](assets/handoff/m08-chart-960-tooltip.png) 为未滚动到位的局部，被模块区边界裁切，只作 H-02 佐证）。
- 截图证据补充（T-19）：[H-01 修复后 1440×900 样例图整图](assets/h01-fix-20261028/after-1440x900-full.png)、[程序生成的采集溯源与几何](assets/h01-fix-20261028/capture-full-1440.json)、[采集步骤](assets/h01-fix-20261028/README.md)。以上旧图保留作历史对照。
- AI 辅助视觉验收（Handoff = claude-opus-5-5 via anthropic，2026-10-28，代码 `8920b06`，Chrome 156；AI 浏览器操作与看图，不是 Walter 人工验收）：符合（附 H-01）。画布透明，与模块玻璃底连续，无白底块；主序列线、轴字、刻度与网格层次分明；浮窗（日期 + 收盘价）在 1440 与 960 下完整、未被卡片裁切，960 靠右悬停时浮窗翻到左侧；主序列为主文字亮色，未见退役色。**H-01（新发现）**：图注“近 60 日收盘 · 样例”断成三行（数字 60 单独成行并右对齐），可读但版式不当。
- 采集补充记录（T-19，2026-10-28，Implement = openai/gpt-6-astra via openai）：已补采修复后的整个 figure（图注 + 单位 + SVG 曲线与坐标轴），来源 HEAD `44845c8`、frontend 树 `03fda1deaef016793033c29f79ffce5b901f83a4`；Chrome 156.0.8078.49 / Playwright 1.64.1，1440×900、deviceScaleFactor 1、mock normal。脚本实测 figure 完整位于 viewport 与模块可视区、图注同行、60 点数据及主题一致、背景 transparent；实际 bounds 与 PNG SHA256 见 JSON。**本轮仅 AI 采集与自动断言，未作看图结论，不是 Walter 人工验收**；A-H01-P3-1 已补采、待 Walter 人工复核 M-08，不宣称关闭。旧观察保留为历史，H-02 未修复，人工框不改。
- [ ] 人工验收通过（Walter 待复核；验收人 / 日期：待填写）
