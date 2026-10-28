---
id: ui.components.ui_components
kind: spec
object: 组件目录
status: current
summary: 胶囊、徽章、灯、芯片、页签、脚注、浮层与浮窗外壳、空态
commodity: any
variant_of: null
page: null
nav_group: null
blocks: []
rules: [CK-H450, CK-TIPSTD, PG-MAN-FOOTNOTE, PG-MAN-SEASONPOP]
depends_on: [ui.colors.ui_colors, ui.layout.ui_layout]
anchors:
  - engine/web/shell/site.css::.zpill
  - engine/web/shell/site.css::.op-badge
  - engine/web/shell/site.css::.pxlight
  - engine/web/shell/site.css::.footnote
  - engine/web/shell/site.css::.wb-tip
  - engine/web/shell/app.js::_fitPp
tests: []
verified: 2026-10-05
source: D:/FTEngine/design/UI/Components/UI_COMPONENTS.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 组件目录

站内组件的唯一目录：新页先在这里找现成的类，颜色一律取 ui-tokens.status / css_vars，尺寸取 ui-tokens.popover；页面专属变体按页内覆盖三规带页前缀（design:ui.layout.ui_layout#page_override_prefix）。按钮类（`.secbtn` `.pgbtn` `.btn.primary` `.btn.ghost`）见 design:ui.buttons.ui_buttons。

### #spark_rng 迷你折线与分位条
规定：`.spark` 迷你折线：墨线 + 末点实心 + 零线用结构线色。`.rng` / `.rng-track` / `.rng-mark` / `.rng-p` 分位条：轨道 + 墨色游标 + 右侧百分数；盘面内用缩小版 `.rng.sm`。
为什么：表格里只放得下一行高的图形，墨色单线与单游标不和数据色抢眼。
落点：engine/web/shell/site.css::.spark；engine/web/shell/site.css::.rng；ui-tokens.surface.rng_track

### #legend 图例芯片与图例行
规定：`.lgc` / `.lgc2` 图例芯片（点线年用虚线上边框模拟）；`.chip27` 是 2027E 显隐开关，off 态灰显划线；`.legend-row` / `.lg-it` 是卡外图例行。
为什么：年份图例要和年线同色同线型，芯片模拟线型比文字说明直观；推演年能一键藏起。
落点：engine/web/shell/site.css::.lgc；engine/web/shell/site.css::.chip27

<a id="fresh_dots"></a>

### #fresh_dots 新鲜度点与待更新点
规定：`.dot`（新鲜）/ `.dot.stale`（过期）表示数据新鲜度；`.warn-dot` 是导航「数据状态」项上的待更新点；色与尺寸取 status.fresh_dot / status.warn_dot。
为什么：新鲜度是看盘前的第一件事，点比文字更快扫到（导航上的锚法见 design:ui.navigation.ui_nav#fresh_dot）。
落点：ui-tokens.status.fresh_dot；ui-tokens.status.warn_dot；engine/web/shell/site.css::.dot

### #tag_chips 来源小标与信息胶囊
规定：`.tag` 数据源小标（等宽细边小胶囊）；`.chips` / `.chip` 信息胶囊组。
为什么：来源与口径是研究纸的脚注级信息，做成小胶囊不占正文。
落点：engine/web/shell/site.css::.tag；engine/web/shell/site.css::.chips

### #tabs 页签与芯片
规定：`.gtab` / `.mchip` / `.scen` / `.subtabs` / `.memtg` 都是直角细边小钮；选中态两式：反白（墨底白字）或描墨（浅底加粗）。
为什么：直角细边与研究纸的直角细框同一语言（design:ui.foundations.ui_foundations#square_corners）；两式选中态是现存写法的登记，原 UI_SYSTEM §4.7 组件表没写取舍理由。
落点：engine/web/shell/site.css::.gtab；ui-tokens.surface.chip_on_bg

### #caret 折叠箭头
规定：`.caret` / `.car` 折叠箭头，▸ 旋转表示展开；没有明细的行留同宽占位。
为什么：留占位才能让有无明细的行文字对齐。
落点：engine/web/shell/site.css::.caret

### #pxfx 公式块
规定：`.pxfx` 公式块：等宽 + 左侧琥珀边，是「模型口径」的视觉签名。
为什么：琥珀 = 非实绩（design:ui.foundations.ui_foundations#ui_amber），公式块一眼可知是模型口径。
落点：engine/web/shell/site.css::.pxfx；ui-tokens.surface.pxfx_bg

### #pxtri 联立四值条
规定：`.pxtri` 联立四值条，细边分格；`.pull` 用琥珀表示模型改动量，`.mkt` 市场格浅底。
为什么：市场值与模型改动量并排时，颜色区分「市场给的」与「模型拉的」。
落点：engine/web/shell/site.css::.pxtri；ui-tokens.surface.pxtri_mkt_bg

### #zpill z 分位胶囊
规定：`.zpill` 三态 rich / cheap / flat，色与最小宽取 status.zpill。
为什么：胶囊与同页 z 柱同色（PALETTE_CORE §四），读表与读图是同一个颜色语言。
落点：ui-tokens.status.zpill；engine/web/shell/site.css::.zpill

### #op_badge 状态徽
规定：`.op-badge` 四态 good / warn / bad / sample；sample 用虚线边表示样例数据；色取 status.op_badge。
为什么：样例数据必须一眼可辨，虚线边是唯一不靠颜色的区分。
落点：ui-tokens.status.op_badge；engine/web/shell/site.css::.op-badge

### #pxlight 状态灯
规定：`.pxlight` 亮 = 套利在跑，灭 = 结构性梗阻；尺寸与亮灭色取 status.pxlight。
为什么：只有两态，灯比文字更快。
落点：ui-tokens.status.pxlight；engine/web/shell/site.css::.pxlight

### #pxscar 稀缺态横幅
规定：`.pxscar` R11 稀缺态横幅：琥珀底细边，读作制度切换披露而非告警；色取 status.pxscar。
为什么：稀缺态是模型口径的切换，不是数据出错，用告警红会被误读。
落点：ui-tokens.status.pxscar；engine/web/shell/site.css::.pxscar

### #nxwarn 净出口方向 lint 格
规定：`td.nxwarn` 标出净出口同比方向与缺口不一致的格（缺口与净出口讲的不是同一个故事）；色取 status.nxwarn。
为什么：提醒读者这格的两个数在讲相反的故事，而不是替他改数。
落点：ui-tokens.status.nxwarn；engine/web/shell/site.css::nxwarn

### #triage_card 晨间分诊卡
规定：`section.triage`（数据状态页第零节）用 ok / warn / down 三态左边条与圆点；色取 status.triage。
为什么：分诊结论要在页首一眼看清哪类失联，三态对应规则判决的三档。
落点：ui-tokens.status.triage；engine/web/shell/site.css::section.triage

### #fqb 频率标
规定：`.fqb` 周 / 月频率标（W / M），色取 status.fqb；只用变量，不引 `--blue`（见 design:ui.colors.ui_colors#blue_null）。
为什么：美国平衡表周频与月频混排，频率标防止拿月值比周值（design:ui.tables.ui_tables#baltbl）。
落点：ui-tokens.status.fqb；engine/web/shell/site.css::.fqb

### #toolbars 工具条
规定：`.seas-toolbar` / `.op-toolbar`：浅底细边，衬线小标签 + 芯片组 + 右推图例。
为什么：工具条是卡外的控制区，浅底把它与卡内数据分开。
落点：engine/web/shell/site.css::.seas-toolbar；ui-tokens.surface.toolbar_bg

### #footnote 口径脚注
规定：`.footnote` 是正文式长中文口径注，关键结论用 `<b>`；双语口径注走 `ol.fnotes`（编号 + `.cn` 一行 + `.en` 淡灰一行）；季度供需两节不带 `.footnote` 口径块。
为什么：双语编号脚注是 07-27 定的（UI-20260727-minmax）；季度供需两节的口径块「没人看」被删（UI-20260929-qsd）。
落点：engine/web/shell/site.css::.footnote；engine/web/shell/site.css::fnotes；PG-MAN-FOOTNOTE

### #season_pop 悬浮季节图 `#seasonPop`
规定：盘面 / 平衡表行悬停出图，锁定环转满即钉住可交互；钉住态可拖右下角调大小；Esc / × / 点窗外关闭并短冷却防复弹；带近十二周表的平衡行加宽成图左表右；图高由 JS `_fitPp` 显式定像素，绝不 flex 分高。尺寸与时长取 popover.season_pop。
为什么：可拖调大小是 07-26 定的（UI-20260726-responsive）；flex 分高时 Plotly 量不到容器高、回退画布被裁，是 07-27 两轮报修的根因（UI-20260727-minmax，CK-H450）。
落点：ui-tokens.popover.season_pop；engine/web/shell/app.js::_fitPp；PG-MAN-SEASONPOP

### #strat_modal 策略弹窗 `#stratModal`
规定：遮罩 + 白面板，行 = 标签列 + 内容列，虚线分隔；尺寸、遮罩与阴影取 popover.strat_modal。
为什么：弹窗是浮层，按 DNA 只有浮层带阴影（design:ui.foundations.ui_foundations#shadow_overlays_only）。
落点：ui-tokens.popover.strat_modal；engine/web/shell/site.css::stratModal

### #gpop_gship 平衡表格浮窗与船级明细抽屉
规定：`#gpop` 平衡表格浮窗、`#gship` 船级明细右侧抽屉；尺寸、阴影与层级取 popover.gpop / popover.gship，抽屉入口钮色取 status.gpop_ship_btn。
为什么：格浮窗与抽屉会同时出现，层级登记在令牌里才不会互相遮挡。
落点：ui-tokens.popover.gpop；ui-tokens.popover.gship；engine/web/shell/site.css::#gship

### #tip_shells 自绘浮窗外壳
规定：`#cvTip` / `.wb-tip` / `#ft-tip` 三个自绘浮窗共用一套外观：颜色取 chart_chrome.tooltip_light（深色版 tooltip_dark），字体取 fonts.tip；尺寸、时长与两级标准归 Graphs（chart-spec.tooltip）。`.wb-tip` 的 CSS 在 site.css，与 app.js 的 wbTip 成对使用。
为什么：全站只许两级浮窗（CK-TIPSTD）；外壳色登记在界面色里才能与 ft-runtime / site.css 对拍；只搬 JS 不搬 CSS 时浮窗会静默消失（08-20 巴西页）。
落点：ui-tokens.chart_chrome.tooltip_light；engine/web/shell/site.css::.wb-tip；CK-TIPSTD

### #empty_states 空态
规定：`.loading` / `.plot-empty` / `.balph` / `.fcempty` / `.err` 用同一语言：留白居中灰字；`.err` 卡内带可复制命令的 `code` 块。
为什么：空态长得一样，读者才不会把「还没数据」当成「页面坏了」；`.err` 直接给出补数命令。
落点：engine/web/shell/site.css::.loading；engine/web/shell/site.css::.err；engine/web/shell/app.js::boot

## 暗色适配

- **规定**：迷你折线的墨线 / 末点 → `chart.line_0`，零线 → `chart.axis_line`，仍只用单线与末点，不涂涨跌底色。**为什么**：暗色亮化保留微图不抢眼的语法，关注列表的方向语义由数值字色承担。
- **规定**：新鲜度点尺寸沿用原 `status.fresh_dot.size`，登记为 `status.dot_size`；fresh / stale → `status.fresh / status.stale`（蓝 / 琥珀），不采用原绿色正常态。状态徽 good / warn / bad / sample → 模块壳 ok / warn / bad / sample，取 `status.*`；sample 的虚线边保留并加「样例」文字，bad 色只作非文字提示。**为什么**：D-013 禁止状态绿与行情跌色混淆，非文字与文字阈值不同，样例态不能只靠颜色。
- **规定**：加载 / 空 / 错误三态沿用留白、居中、弱文字；错误的补数命令 → 可复制的诊断 `{moduleId, code, message, ts}`。模块库与对话抽屉共用 `glass.drawer.*`，不创建第四层玻璃。**为什么**：本 feature 不执行旧站补数命令，但必须让故障有可追查信息。
- **不采用**：分位条、年份图例芯片、来源胶囊完整变体、页签族、折叠箭头族、公式块、联立四值条、z 胶囊、套利灯、稀缺横幅、净出口 lint、晨间分诊卡、频率标、工具条、长口径脚注以及季节图 / 策略 / 平衡表 / 船级 / 自绘浮窗；原因是它们依赖各 domain 或 chart-templates 的完整内容，不能借移植目录提前实现。原浮层尺寸、层级与交互也不进入工作台。
- **落点**：`frontend/src/shared/components/` 的 `Spark / Badge / EmptyState / ErrorState / Loading`，`frontend/src/app/TopBar.vue`、`frontend/src/modules/ModuleShell.vue`；数值与配色读取令牌。
