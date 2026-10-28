---
id: ui.foundations.ui_foundations
kind: spec
object: 研究纸风 DNA
status: current
summary: 研究纸风、三族字体分工、界面红与琥珀语义、空与零中性
commodity: any
variant_of: null
page: null
nav_group: null
blocks: [ui-tokens._meta]
rules: [CK-BG, CK-FONT, PG-MAN-PAPER, PG-MAN-PLOTLANG]
depends_on: []
anchors:
  - engine/web/shell/site.css::--paper
  - engine/web/shell/site.css::--amber
  - engine/web/shell/app.js::zeroShown
  - engine/web/shell/app.js::bindDesk
tests: [test_design_tokens::test_blocks_parse, test_design_tokens::test_css_vars_equal_site_css_root]
verified: 2026-10-05
source: D:/FTEngine/design/UI/Foundations/UI_FOUNDATIONS.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 研究纸风 DNA

整站像一份可交互的卖方研究纸或交易日报，不是 dashboard。本条目文件只写原则与理由：界面色、字体栈、尺寸的数值在 `ui-tokens` 各碎片里（Colors / Fonts / Layout / Cards 条目文件），图表数据色在 PALETTE_CORE。

### #paper_style 浅色机构研究纸风
规定：页面按研究纸排版——纸底、墨字、衬线题字、等宽数字；不做深底大色块的仪表盘风。
为什么：Walter 每天把页面截图贴进 PPT、周报和群聊，读者是交易员和老板；纸面风贴进白底文档后仍像一份正式研究件，深底仪表盘贴进去刺眼，也会把注意力从数字拉到装饰上。
落点：ui-tokens.css_vars（`--paper` `--card` `--ink`）；engine/web/shell/site.css::--paper

<a id="paper_not_white"></a>

### #paper_not_white 纸底不铺白、画布透明
规定：页面是暖米白纸色（css_vars `--paper`），只有卡片是白（`--card`）；Plotly 画布一律透明，让纸或卡底透上来。
为什么：白卡浮在纸上就是唯一的层次；图底若是白块盖在纸上，层次就破了（体检 CK-BG 查画布不透明）。
落点：ui-tokens.css_vars；chart-spec.plot_base；CK-BG

### #shadow_overlays_only 阴影只给浮层
规定：卡片不用阴影堆层次；阴影只给浮层——浮窗、悬浮季节图、弹窗、抽屉（各自的 shadow 键在 ui-tokens.popover 与 ui-tokens.chart_chrome.tooltip_*）。
为什么：圆角加阴影的「卡海」是 dashboard 的签名，这里不用。
落点：ui-tokens.popover；ui-tokens.chart_chrome

### #square_corners 直角细框
规定：圆角只有一档（ui-tokens.radius.base）；浮窗与少数小控件是明确列名的例外（radius.exceptions），不另加档。
为什么：同上，圆角是「卡海」语言；例外列在令牌里才可查、可对拍。
落点：ui-tokens.radius

### #three_families 三族字体各司其职
规定：衬线只用于品牌字标、页标题、章节编号与标题、组标题、KPI 大数、弹窗标题；无衬线用于正文、导航、卡头、按钮、表格文字列和图内文字；等宽用于一切数值、代码与符号、单位注、期号、ticker、微标签。数字一律等宽加 tabular-nums、右对齐，竖着能对小数点。
为什么：衬线题字给研究纸的正式感，等宽对齐让一列数字能竖着比；三族各管一类元素，页面之间才不漂。
落点：ui-tokens.fonts（栈与字号见 design:ui.fonts.ui_fonts）；CK-FONT

<a id="bilingual"></a>

### #bilingual 双语层级
规定：中文为主标题，英文以全大写小字号加宽字距作副标伴随。图内文字：主站台面图用英文缩写（Cum / YoY / YTD / LY / Lvl / wk）；巴西、印度、真实需求等子页图内用中文；同一页不混用。图内语言的细则见 design:graphs.formats.chart_formats#lang（原文指向的 ft-chart 技能「数字、日期、单位、口径」节，规则正文 10-04 已迁入 Graphs 各条目文件，技能里已无此节）。
为什么：台面图密度高、缩写短而稳；子页给更广的读者，中文更直接；一页之内混用读起来像拼贴。
落点：design:graphs.formats.chart_formats#lang；PG-MAN-PLOTLANG

### #ui_red 界面红只点睛
规定：站点变量里的红（css_vars `--red`）只用在界面：章节编号、导航当前项竖条、悬浮图锁定环、重置类按钮的悬停。图上「上一期 / 上年线 / 负值」的红是茹藘（palette-core.red），归 PALETTE_CORE，不是这个红。
为什么：10-02 配色定版「墨 + 黛驼」，旧铁律「深红 = 上年线」作废（UI-20261002-palette）；界面红与图表红分开，图上一色一义才守得住。
落点：ui-tokens.css_vars（`--red`）；palette-core.red

### #up_down 涨跌专色只涂字
规定：涨跌另有专色（css_vars `--up` / `--down`），只涂数值字色，不涂背景、不作装饰。
为什么：涨跌是金融语义，铺成底色或当装饰用会把语义稀释掉。
落点：ui-tokens.css_vars；engine/web/shell/app.js::cls

### #ui_amber 界面琥珀 = 非实绩
规定：css_vars `--amber` 在界面上表示「模型 / 可编辑 / 未结算」：平衡表可编辑格的下划线与笔形提示、预测列 E 角标、公式块左边框、盘面「待」格、数据状态的待更新点。图上的推演线不是琥珀，是 palette-core.model。
为什么：一眼分出实绩与「Walter 的手改层 + 模型」；10-02 配色定版「墨 + 黛驼」起，图上的推演线改用模型线齐紫（PALETTE_CORE §一，UI-20261002-palette），琥珀只留在界面。
落点：ui-tokens.status.edit；ui-tokens.status.board_cell；palette-core.model

### #empty_zero 空与零
规定：空值铺 en dash；差值与同比带正号；按显示位取整后为零的数一律中性——不印负零、不带正号、不着涨跌色。
为什么：「−0.0」与着了色的零会让人以为有变化（UI-20261002-zero）。
落点：engine/web/shell/app.js::zeroShown（fmt / sgn / cls 共用）；chart-spec.formats.zero_neutral

### #narrow_rail 窄边栏
规定：左侧一条固定宽度的纸色侧栏（宽见 ui-tokens.rail_w），字标下一道上粗下细的双线作研究纸的报头印记；侧栏可收起，窄屏塌成顶栏。
为什么：内容区要尽量宽给 48 列盘面和平衡表，导航只需一眼扫到各组。
落点：design:ui.layout.ui_layout#rail；design:ui.buttons.ui_buttons#rail_toggle

### #two_desks 一站双台
规定：一个站承载柴油台与 LPG 台：字标下一枚切换钮把整条侧栏换成另一张台的导航，页面本身不跳；外壳上的台位差别只在导航表、`body[data-desk]` 与复制水印声明里。
为什么：两张台共用外壳、令牌与渲染器，分站会让外壳分叉（UI-20260731-tabs）。
落点：design:ui.buttons.ui_buttons#desk_switch；design:ui.navigation.ui_nav#lpg_nav

### #values_once 数值只在碎片里出现一次
规定：尺寸、字号、色值只写在 `ui-tokens` / `page-contract` 碎片里，散文写字段名（如 ui-tokens.grid.breakpoints.shell_collapse）；碎片与代码由守卫测试逐位对拍：ui-tokens 现阶段只证明碎片 == 现行代码（site.css / app.js 还不读碎片，令牌生成器是第二期）；page-contract 由 new_page.py 与 test_page_contract 经装配器直接读。碎片是规格：对拍红了改代码去对齐碎片；有意改数值先改碎片再改代码、同一笔提交；令牌生成器落地后代码从碎片生成。图表侧 chart-spec 同一口径（design:graphs.base.chart_base#code_wins），全树只此一种（本条目文件 #precedence_json_vs_code）。
为什么：数值抄进散文就有第二份，改一处漂一处；对拍测试把漂移变成红灯。
落点：engine/tests/test_design_tokens.py；ui-tokens._meta

本条目文件的碎片只有令牌元信息（核对日期、对拍过的代码文件、`--blue` 记号的说明）：

```json ui-tokens._meta
{
  "date": "2026-10-04",
  "verified_against": ["engine/web/shell/site.css", "engine/web/shell/app.js", "engine/web/kit/ft-kit.js", "engine/web/kit/ft-runtime.js", "engine/ftengine/delivery/charting/runtime.py", ".agents/skills/ft-chart/scripts/new_page.py", "engine/web/**/*.html"],
  "note": "css_vars 逐个抄 site.css :root；--blue = null：:root 从未定义，原唯一引用 .fqb.W 已于 10-04 改为 var(--ink3)，此键留作「禁止再引用」的记号"
}
```

### #precedence_json_vs_code 碎片与代码对拍不一致时以碎片为准
规定：设计碎片（ui-tokens / page-contract / chart-spec）与代码对拍不一致时以碎片为准，全树一种口径：测试红 = 代码漂了，改代码去对齐碎片；有意的数值改动先改碎片、再改代码，同一笔提交（只改代码会被守卫拦下）；令牌生成器（第二期）落地后代码从碎片生成，是这条路的终点。图表侧 design:graphs.base.chart_base#code_wins 同此。
为什么：两份原文本就冲突——UI_SYSTEM 头注「两个块与代码不一致时，以 JSON 为准、由测试逐位对拍代码」，CHART_SYSTEM 头注「本文与代码冲突时以代码为准并回来改本文」；拆成条目文件后两句分落本条目文件 #values_once 与 design:graphs.base.chart_base#code_wins，同一个对拍测试（test_design_tokens）红了，修哪一端取决于读的是哪一份条目文件（10-06 核实员报告指出）。以代码为准时，代码里的意外改动会被当成新规格抄进碎片，守卫只剩「记录变化」；以碎片为准，并行会话或手误改了代码会被拦住。2026-10-07 Walter 裁定（原 Q-UI-precedence，2026-10-06 提出）：采纳 A 以碎片为准（测试红时改代码）。
落点：engine/tests/test_design_tokens.py；design:graphs.base.chart_base#code_wins；ui-tokens._meta

## 暗色适配

- **规定**：纸底 / 白卡 → `bg.*` 渐变与三层玻璃，采用 [UI_DARK_ADDITIONS](UI_DARK_ADDITIONS.md#glass)；`paper_not_white` 的画布透明原则不变，对应 `chart.canvas`，由 ECharts 透明画布透出底层。**为什么**：D-011 已选择暗色玻璃，数据第一与层次克制保留，不把旧纸面底色带入运行时。
- **规定**：三族分工不变，但按 Q-019 明确 KPI 大数用 `font.serif`，是数值等宽的唯一例外；模块壳标题用 `font.sans`，其他数值用 `font.mono`、tabular-nums、右对齐。双语层级不变，英文副标取 `type.en_sub` 与 `tracking.en_sub`；后者由 T-02 登记加宽字距，原条目只有原则，不声称旧碎片已包含该值。**为什么**：消除原文「一切数值等宽」与 KPI 衬线的冲突，保持中文主、英文辅。
- **规定**：空值 en dash、差值正号、按显示位判零且零中性不变；点睛红 → `accent.red`，只作非文字指示，琥珀 → `accent.amber`，仍表示非实绩 / 可编辑 / 待更新。涨跌 → `updown.up / updown.down`，只涂字色，且仅限行情价格、关注列表、焦点带行情段；分析负值取 `chart.neg`，状态不用绿。**为什么**：D-013 分隔行情红涨与分析红负，点睛红未达到文字对比度阈值。
- **规定**：直角细框、卡片不堆阴影、窄侧栏可收起不变；圆角只取 `radius.*` 登记例外。碎片与代码对拍 → `tokens.json` 生成 CSS / TS / 主题，生成物不手改。**为什么**：保留克制的形态和单一数值来源，避免维护第二套旧工程令牌。
- **不采用**：浅色研究纸作为屏幕主题、双台切换、柴油 / LPG 页内语言约定和旧工程复制链路；原因是本 feature 为品种无关暗色工作台，亮色导出归日报导出，图表细则归 chart-templates，不移植旧站导航与 Plotly 实现。
- **落点**：[设计权威](../../docs/designUI.md)、[实施机制](../../specs/frontend-workbench/plan.md) §2.1 / §2.2，`frontend/src/design/`、`frontend/src/shared/format.ts`；本文件原文不直接作为运行时样式输入。
