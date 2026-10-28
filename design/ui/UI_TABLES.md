---
id: ui.tables.ui_tables
kind: spec
object: 表格四式
status: current
summary: 通用数据表、盘面网格表、卡内小表、大平衡表与季度表、美国平衡表
commodity: any
variant_of: null
page: null
nav_group: null
blocks: []
rules: [CK-TABLEOVF, PG-MAN-NUMBER]
depends_on: [ui.foundations.ui_foundations, ui.colors.ui_colors, ui.fonts.ui_fonts, ui.cards.ui_cards, ui.components.ui_components]
anchors:
  - engine/web/shell/site.css::table.data
  - engine/web/shell/site.css::table.mini
  - engine/web/shell/site.css::table.gbal
  - engine/web/shell/site.css::.baltbl
  - engine/web/shell/app.js::cls
tests: []
verified: 2026-10-05
source: D:/FTEngine/design/UI/Tables/UI_TABLES.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 表格四式

站内表格只有四式加两个变体。颜色取 ui-tokens（board / surface / status），配色色阶归 PALETTE_CORE；本条目文件只写结构与语义。

### #number_rules 数字规则（四式通用）
规定：数值等宽 tabular-nums、右对齐（首列左对齐）、千分位；差值带正号；空值 en dash；涨跌只涂数值字色 `.up / .down`，零与空 `.dim`；取整为零的数按中性处理。
为什么：表格是拿来竖着比数的，对齐与符号规则一旦按页漂，读者就得逐页重新学（空与零见 design:ui.foundations.ui_foundations#empty_zero）。
落点：engine/web/shell/app.js::cls；PG-MAN-NUMBER

### #table_data 通用数据表 `table.data`
规定：白卡内的通用表：表头全大写淡灰、细行线、行悬停浅底；数值格 `.num`，名称列 `.name`，来源小标 `.tag`（等宽细边小胶囊）。
为什么：多数子页的明细表都是这一式，统一后复制到 PPT 的观感一致。
落点：engine/web/shell/site.css::table.data；ui-tokens.surface

### #board 盘面网格表 `.card.board`
规定：日报式灰底网格（列 = 标的，行 = 日期 + 统计），灰阶全套取 ui-tokens.board。首列 `.stub` 左吸；分组头 `th.band` 左侧分界线，分组左界 `.bl`；列头 `th.colh` 两行（`.cn` 中文名 + `.cs` 等宽 ticker，`.pend` 未结算列 ticker 用琥珀）；列高亮 `.colhl`。附属行：`.sum` 统计行、`.pct` 分位行、`.tsrow` 时间戳行、`.rng-row` 分位条行。分组头底色与字色按 band_tint 取。
为什么：盘面是交易台最密的一张表，灰底网格与研究卡分开；分组色让多品种并排时一眼分组（design:ui.colors.ui_colors#band_tint）。
落点：ui-tokens.board；ui-tokens.band_tint；engine/web/shell/site.css::.board

### #board_three_state 三态格（铁律）
规定：盘面格的三种「没有数」必须分开显示：`休`（`.hol`，假日休市）、`待`（`.unset`，琥珀，未结算）、`–`（丢数）；三态的颜色取 status.board_cell。
为什么：休市不是丢数，未结算也不是丢数；合成一种，读者会把正常的空格当成数据断档去查。
落点：ui-tokens.status.board_cell；engine/web/shell/site.css::.unset

### #mini 卡内小表 `table.mini`
规定：卡内紧凑表（浮窗里的近十二周表、信号面板）：小表头、等宽小字、浅行线；悬浮图里当前行 `tr.cur` 加粗加底。
为什么：小表跟着图走，字号与行距要服从卡内空间，不能用通用表的尺寸。
落点：engine/web/shell/site.css::table.mini；ui-tokens.surface.mini_row_line

### #gbal 大平衡表 `table.gbal`
规定：横向滚动 + sticky stub + 折叠树：外包 `.gbal-wrap` 自绘滚条；年份带头 `th.yband` 可点折叠（▸ 旋转）；月列头 `th.colh`，年列 `.ycol` 加粗，预测列 `.fc` 带琥珀 E 角标。行级：主行 `tr.rmain`（底色加深、加粗、顶线）、子行 `tr.sub` 缩进、占比行 `tr.sub.pct` 斜体纸色底、二级折叠 `tr.t2 / tr.sub2`、成员行 `tr.mem`、印度子行 `tr.subx`、外推月 `td.est` 斜体淡灰。船级明细格 `td.v.shp` 角上小锚；大区页签 `.gtab`（选中反白，前置大区色点）。
为什么：平衡表是系统核心，行级语义（主 / 子 / 占比 / 成员 / 外推）必须一眼可分，否则手改与模型会被读错。
落点：engine/web/shell/site.css::table.gbal；ui-tokens.surface（gbal_* 键）

### #gbal_edit 可编辑格 = 琥珀
规定：可编辑格 `.edok` 悬停出琥珀笔形、已改 `.ed` 加粗加琥珀下划线、重放 `.rp` 琥珀点线、行内 `<input>` 琥珀边；颜色取 status.edit。
为什么：琥珀即「这是 Walter 的手改层」（AGENTS §6），与实绩区分（design:ui.foundations.ui_foundations#ui_amber）。
落点：ui-tokens.status.edit

### #qsdt 季度供需表 `table.qsdt`
规定：大平衡表的变体，分同比 / 环比两节：每区两行（Δ 主行 + `tr.sub.val` 当期值行）、`.yc` 年度列、`.est` E 列、`.wrow` 世界行；同比 % 不占行，只留在格提示里；两节都不带 `.footnote` 口径块。格底色阶的颜色归 PALETTE_CORE §二.8。
为什么：同比 % 当主行被纠正过一次，口径块「没人看」被删（UI-20260929-qsd）。
落点：engine/web/shell/site.css::qsdt；ui-tokens.surface.qsdt_est_val_bg

### #baltbl 美国平衡表 `.baltbl`
规定：美国柴油 / LPG 平衡表（一份渲染器喂两台）：频率标 `.fqb`（周 / 月，见 design:ui.components.ui_components#fqb）、块标题行 `tr.blk`、PADD 折叠 `.caret`。
为什么：周频与月频混排，没有频率标读者会把月值当周值比。
落点：engine/web/shell/site.css::.baltbl；ui-tokens.status.fqb

## 待裁定条目

### #wide_table_overflow 横滚容器里的宽表算不算溢出（待裁定）
规定：待裁定（Q-UI-tableovf）：体检 CK-TABLEOVF 对 `.scroll-x` 横滚容器里的宽表也报 ERR，与「横向溢出的表卡加 `.scroll-x`」相抵；选项：横滚容器内豁免，或一律报 ERR。裁定前两边都不改。
为什么：截图与复制会丢滚动区外的列，所以体检报；但横滚本身是现行的表卡写法（2026-10-04 提出）。裁定权在 Walter。
落点：CK-TABLEOVF；design:ui.cards.ui_cards#base_card

## 暗色适配

- **规定**：通用表与盘面网格结构保留，白卡 / 灰卡 / 纸色行线 → `glass.module.*` 与登记的文字 / 边框令牌；不另铺浅底或把涨跌色作行底。**为什么**：工作台只有三层玻璃，表格不能长出第四种表面；涨跌只表示数值方向。
- **规定**：千分位、等宽数字、tabular-nums、数值右对齐、名称左对齐、差值正号、空值 en dash、取整后零中性不变；旧 `.up / .down` 通用样式 → `Num` 的 `sem-market / sem-analysis` 语义类。关注列表与盘面用 `updown.*` 字色，分析元素用 `chart.pos / chart.neg`。**为什么**：同一红色在行情与分析区含义相反，D-013 要求按登记区块隔离而非沿用全站涨跌类。
- **规定**：盘面的三种无数状态不变：`holiday` → 休、`pending` → 待、`missing` → en dash；正常 `ok` 显示数值。休 / 缺取弱文字，待取 `accent.amber`。关注列表采用通用表 + `SparkSeries` 迷你折线。**为什么**：假日休市、尚未结算、数据缺失不是同一种故障，不能合并成一个空格。
- **不采用**：原盘面全套分组带 / 统计 / 分位 / 时间戳附属行、卡内小表、大平衡表与编辑 / 重放、季度表、美国平衡表变体，以及宽表复制溢出的旧待裁定项；原因是本 feature 只实现代表性 mock 形态，完整业务表、用户数据编辑与截图导出由各自 feature 负责。
- **落点**：`frontend/src/shared/components/{Num,DataTable,BoardGrid,Spark}.vue`、`frontend/src/modules/{market-board,watchlist}/`；数值格式统一走 `frontend/src/shared/format.ts`。
