---
id: ui.layout.ui_layout
kind: spec
object: 页面外壳与版式
status: current
summary: 外壳、侧栏、页头、章节、网格断点、间距圆角、浮层尺寸、页内覆盖三规
commodity: any
variant_of: null
page: null
nav_group: null
blocks: [ui-tokens.spacing, ui-tokens.radius, ui-tokens.grid, ui-tokens.popover, ui-tokens.rail_w, page-contract.skeleton, page-contract.pagehead, page-contract.section]
rules: [PG-1FR, PG-SECNO, PG-PREFIX, PG-MAN-RAIL, PG-MAN-PAGEHEAD, PG-MAN-SECHEAD, PG-MAN-NARROW, PG-MAN-PRINT]
depends_on: [ui.foundations.ui_foundations, ui.fonts.ui_fonts]
anchors:
  - engine/web/shell/site.css::.shell
  - engine/web/shell/site.css::--rail-w
  - engine/web/shell/site.css::.pagehead
  - engine/web/shell/site.css::.sec-head
  - engine/web/kit/ft-kit.js::secHead
tests: [test_design_tokens::test_css_vars_equal_site_css_root, test_design_tokens::test_tooltip_equals_runtime, test_page_contract::test_page_rule]
verified: 2026-10-05
source: D:/FTEngine/design/UI/Layout/UI_LAYOUT.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 页面外壳与版式

外壳、侧栏、页头、章节的结构与网格、间距、圆角、浮层尺寸。数值一律在 `ui-tokens` 碎片，结构选择器一律在 `page-contract` 碎片；条目只写类名与含义。导航见 design:ui.navigation.ui_nav，外壳上的各个钮见 design:ui.buttons.ui_buttons。

### #internal_geometry 组件内部几何留在 site.css
规定：组件内部几何（报头双线粗细、active 竖条宽、stub 宽、缩进、spark / rng 尺寸、stratcard 最小高等）不进令牌，真值留在 site.css 对应选择器；要改按本条目文件的页内覆盖三规走，不为一页改 site.css。
为什么：这些几何只属于单个组件、没有第二个读方，进令牌只会多一份要对拍的值。
落点：docs/assets/site.css

### #shell 外壳两栏
规定：每页同构：`.shell` 两栏网格（侧栏 + 内容），内容栏 `.content` 必须 `min-width:0`；DOM 骨架见 page-contract.skeleton。打印时侧栏隐藏、内容单列（grid.print）。
为什么：`.content` 的 `min-width:0` 是 `.shell` 自身那道裸 `1fr` 不撑破页面的原因，也是 PG-1FR 给 `.shell` 开的唯一豁免。
落点：page-contract.skeleton；ui-tokens.grid.print；engine/web/shell/site.css::.shell

<a id="rail"></a>

### #rail 侧栏 `.rail`
规定：纸色背景（不是白），右侧一道结构线，sticky 全高纵向排布：`.brand > .wordmark` 衬线粗体品牌字标（台切换钮注入在字标下）；`.rule` 上粗下细双线；`nav` 导航；`.rfoot` 两行「交易日 / 生成」，上方是刷新钮与步骤流。宽度只取 ui-tokens.rail_w（与 css_vars `--rail-w` 同值）。收起后 `.shell.railhid` 单列。
为什么：双线是研究纸的报头印记；纸色侧栏与白卡区分「导航」和「内容」（DNA 见 design:ui.foundations.ui_foundations#narrow_rail）。
落点：ui-tokens.rail_w；engine/web/shell/site.css::--rail-w；design:ui.buttons.ui_buttons#rail_toggle

<a id="narrow"></a>

### #narrow 窄屏断点
规定：窗口窄于 grid.breakpoints.shell_collapse 时，侧栏塌成顶栏横向滚动，`.rule / .ngroup / .rfoot` 隐藏，当前项竖条移到底边成横条，折叠球隐藏；各栅格类在此断点的列数见 grid.at_shell_collapse。其余断点（grid.breakpoints、grid.breakpoints_sel）只改列数，不改结构。
为什么：截图与窄窗都不许出现横向页面滚动条；断点集中登记，人工验收才有对照（PG-MAN-NARROW）。
落点：ui-tokens.grid.breakpoints；ui-tokens.grid.at_shell_collapse

### #pagehead 页头 `.pagehead`
规定：左 `.pgtitle`：衬线中文 `h1` + 全大写宽字距淡灰英文 `.en`，基线对齐。右 `.pgright`：纵排右对齐两行——上 `.meta#pageMeta`（「交易日 **YYYY-MM-DD**」或「数据至 …」），下整页复制钮。整行垂直居中。选择器见 page-contract.pagehead。
为什么：标题块与右侧两行垂直居中、交易日在上复制钮在下，是 07-24 定的版式（UI-20260724-pagehead）。
落点：page-contract.pagehead；engine/web/shell/site.css::.pagehead；design:ui.buttons.ui_buttons#page_copy

### #section 章节
规定：每个模块一个 `<section>`：`.sec-head`（`.sec-no` 两位编号、`.sec-title` 衬线中文、`.sec-en` 英文小字幕、可选 `.sec-note` 右推说明、模块复制钮）+ `.sec-body`。编号从 section.consecutive_from 起连续、永远存在，用界面红衬线。新页用 `FTK.secHead(no, zh, en, noteId)` 生成同一结构。`data-sid`（section.sid_attr，章节固定身份）已写进契约，代码尚未使用，随图表身份路线一起落。
为什么：编号是口头与复制件里「第几节」的锚，跳号即失准（PG-SECNO）；结构统一，周报与复制才能按节认亲。
落点：page-contract.section；engine/web/shell/site.css::.sec-head；engine/web/kit/ft-kit.js::secHead；design:ui.buttons.ui_buttons#module_copy

<a id="grid"></a>

### #grid 栅格
规定：现有栅格类登记在 grid.classes（含子页默认 `.<pfx>-g`），卡间距 grid.gap；列宽单位一律 grid.col，`grid-template-columns` 禁裸 `1fr`（PG-1FR，`.shell` 豁免见 #shell）。site.css 自身仍有裸 `1fr`（grid.bare_1fr_examples 举例、bare_1fr_examples_note 记数目，以 grep 为准）。
为什么：图卡的 min-content 会把裸 `1fr` 列撑破容器（07-27 报修，UI-20260727-minmax）。
落点：ui-tokens.grid；PG-1FR

<a id="spacing"></a>

### #spacing 间距三档
规定：间距只用三档：卡间 spacing.grid_gap、模块间 spacing.section_gap、内容左右 spacing.content_pad_x，不另起间距；spacing 的其余键是外壳与组件内部的现值登记，供对照，不作新间距的来源。
为什么：间距一多，页面之间的节奏就对不齐；三档足够表达「卡 / 节 / 页边」。
落点：ui-tokens.spacing

<a id="radius_exceptions"></a>

### #radius_exceptions 圆角例外
规定：圆角取 radius.base；只有 radius.exceptions 列名的控件（侧栏刷新钮、频率标、平衡表滚条、各类浮窗、船级状态标、分位游标、折叠球）可以用别的圆角，新例外先登记。
为什么：直角细框是 DNA（design:ui.foundations.ui_foundations#square_corners），例外不登记就会悄悄长回「卡海」。
落点：ui-tokens.radius

### #popover_sizes 浮层尺寸与层级
规定：悬浮季节图、策略弹窗、平衡表格浮窗、船级明细抽屉、折叠球的尺寸、阴影、时长与层级（z）登记在 popover 的对应键。浮层的行为见 design:ui.components.ui_components。
为什么：几种浮层会同屏出现，层级与尺寸登记在一处才可查、可对拍（原文 popover 块只登记现值，没写取舍理由）；`#seasonPop` 的图高由 JS 显式定像素，尺寸取自这里。
落点：ui-tokens.popover；engine/web/shell/app.js::_fitPp

### #page_override_prefix 页内覆盖一：类名带页前缀
规定：页面专属样式只写在页内 `<style>`，类名全部带页前缀（规则见 page-contract.prefix_rule；现有前缀如 `rt- / px- / op- / wl-`）。
为什么：裸类名会全站串味（PG-PREFIX）。
落点：page-contract.prefix_rule；PG-PREFIX

### #page_override_specificity 页内覆盖二：提特异度，不改 site.css
规定：覆盖站内值靠提特异度（例 `.<pfx>.chartcard .plot` 压默认图高），不动 site.css，更不为迁就一页改 site.css。
为什么：site.css 是全站共用资产，一改升全量体检；为一页改它会把别的页带偏。
落点：docs/assets/site.css；design:ui.cards.ui_cards#card_height

### #page_override_singletons 页内覆盖三：单例元素可页内改字号
规定：全站单例元素（如 `#ft-tip`）的字号覆盖可以写在页内 `<style>`——只随本页 CSS 生效，不污染别页。子页「大一档」就是按这三规写在 new_page.py 模板的页内 `<style>` 里的（design:ui.fonts.ui_fonts#subpage_scale）。
为什么：单例元素没有页前缀可挂，页内覆盖是唯一不碰 site.css 的办法。
落点：.agents/skills/ft-chart/scripts/new_page.py::render_html

```json ui-tokens.rail_w
198
```

```json ui-tokens.spacing
{
  "grid_gap": 12,
  "section_gap": 26,
  "content_pad": "0 26px 60px",
  "content_pad_x": 26,
  "rail_pad": "22px 0 16px",
  "rail_x": 18,
  "nitem_pad": "7px 18px",
  "pagehead_pad": "14px 0 10px",
  "sec_head_gap": 12,
  "sec_head_pb": 7,
  "sec_body_mt": 12,
  "secbtn_gap": 8,
  "card_h_pad": "9px 13px 7px",
  "card_h_gap": 10,
  "plotwrap_pad": "5px 3px 2px",
  "footnote_mt": 10
}
```

```json ui-tokens.radius
{
  "base": 2,
  "exceptions": {
    "railrf": 4,
    "fqb": 3,
    "gbal_scroll_thumb": 6,
    "fcTip": 8,
    "cvTip": 10,
    "wb_tip": 11,
    "gship_st": 8,
    "rng_mark": 1,
    "railTg": "50%"
  }
}
```

```json ui-tokens.grid
{
  "col": "minmax(0,1fr)",
  "gap": 12,
  "classes": {
    "g2": { "cols": 2, "css": "1fr 1fr" },
    "g3": { "cols": 3, "css": "repeat(3,1fr)", "sel": ".g.g3" },
    "g4": { "cols": 4, "css": "repeat(4,minmax(0,1fr))" },
    "g5": { "cols": 5, "css": "repeat(5,minmax(0,1fr))" },
    "g-bal": { "cols": 2, "css": "7fr 5fr" },
    "qsd-grid": { "cols": 2, "css": "minmax(0,1fr) minmax(0,1fr)", "sel": ".g.qsd-grid" },
    "subpage_default": { "cols": 2, "css": "repeat(2,minmax(0,1fr))", "sel": ".<pfx>-g" }
  },
  "breakpoints": {
    "qsd_grid_1": 1720,
    "g3_2": 1500,
    "g5_3": 1400,
    "op_pulse": 1300,
    "g4_2": 1240,
    "subpage_1": 1240,
    "pricing_forecast_1": 1240,
    "shell_collapse": 980,
    "gship_charts_1": 700,
    "overview_2": 760
  },
  "breakpoints_sel": {
    "pricing_forecast_1": "site.css @media(max-width:1240px)：.drvgrid → 2 列；.fcmain / .replay / .sensgrid / .pxrow / .px-row → 1 列"
  },
  "at_shell_collapse": { "g5": 2, "g2": 1, "g4": 1, "g-bal": 1, "shell": 1 },
  "print": { "rail": "hidden", "shell": 1 },
  "bare_1fr_examples": [".shell", ".g2", ".g.g3", "@1240 .g4", "@980 .g5", "@980 .g2/.g4/.g-bal", ".fcharts", ".stratgrid"],
  "bare_1fr_examples_note": "非完整清单；site.css 中裸 1fr 的 grid-template-columns 约 29 处（2026-10-04 grep），以 grep 为准"
}
```

```json ui-tokens.popover
{
  "season_pop": {
    "w": 560,
    "place_h": 330,
    "wide_w": 772,
    "wide_place_h": 338,
    "pp_h": 284,
    "pp_wtbl_h": 292,
    "table_col": 206,
    "pp_min_h": 160,
    "pinned_min": [430, 250],
    "pinned_max": ["94vw", "84vh"],
    "pin_edge_margin": 14,
    "cursor_offset": [18, 20],
    "show_delay_ms": 150,
    "ring_ms": 1250,
    "ring_size": 16,
    "ring_stroke": 2.5,
    "close_cooldown_ms": 450,
    "shadow": "0 10px 34px rgba(20,20,15,.16)",
    "pinned_shadow": "0 14px 44px rgba(20,20,15,.22)",
    "z": 90
  },
  "strat_modal": { "panel_w": 660, "overlay": "rgba(22,25,29,.36)", "shadow": "0 18px 60px rgba(15,18,22,.32)", "row_cols": "118px 1fr", "z": 120 },
  "gpop": { "min_w": 176, "shadow": "0 8px 26px rgba(20,20,15,.16)", "z": 95 },
  "gship": { "w": "min(760px,96vw)", "shadow": "-10px 0 34px rgba(20,20,15,.16)", "z": 94 },
  "rail_toggle": { "size": 26, "z": 60, "shadow": "0 1px 5px rgba(22,25,29,.12)" }
}
```

```json page-contract.skeleton
[
  "body",
  "body > div.shell",
  "div.shell > aside.rail",
  "aside.rail > div.brand > span.wordmark",
  "aside.rail > div.rule",
  "aside.rail > nav",
  "aside.rail > div.rfoot#railFoot",
  "div.shell > div.content",
  "div.content > header.pagehead",
  "div.content > main#main",
  "main#main section"
]
```

```json page-contract.pagehead
{
  "sel": "header.pagehead",
  "title": ".pgtitle > h1",
  "en": ".pgtitle > .en",
  "right": ".pgright",
  "meta": ".pgright > .meta#pageMeta",
  "copy_page": ".pgright > button.pgbtn#copyPage"
}
```

```json page-contract.section
{
  "sel": "main#main section",
  "head": ".sec-head",
  "no": ".sec-head > .sec-no",
  "no_pattern": "^\\d{2}$",
  "consecutive_from": "01",
  "require": [".sec-no", ".sec-title", ".secbtn.scopy"],
  "optional": [".sec-en", ".sec-note"],
  "body": ".sec-body",
  "sid_attr": "data-sid"
}
```

## 暗色适配

- **规定**：纸色侧栏 → `glass.focus.*`，侧栏宽沿用 `rail_w` → `layout.rail_width`；两栏外壳与 `.content { min-width: 0 }` 不变，内容改为顶栏 / 路由区 / 输入栏三行。**为什么**：工作台要容纳常驻资讯与全局 AI 输入，同时为数据内容留足宽度。
- **规定**：`narrow` 的断点值不变，含义按 Q-018 映射如下；`grid` 的列数取 `layout.grid_*`，不用旧 `.g2 / .g3 / .g4 / .g5` 的固定类表。**为什么**：模块系统只有一套自动填充栅格，焦点带的卡数变化不能误改模块列数。

| 原断点键 | 本 feature 令牌 | 行为 |
|---|---|---|
| `shell_collapse` | `breakpoint.shell_collapse` | 下方侧栏塌顶栏、模块取 `layout.grid_narrow`；达到后取 `layout.grid_default` |
| `g4_2` | `breakpoint.focus_expand` | 只切焦点带 `layout.focus_compact / layout.focus_expanded` |
| `g5_3` | `breakpoint.grid_three` | 达到后模块取 `layout.grid_three` |
| `g3_2` | `breakpoint.grid_four` | 达到后模块取 `layout.grid_four` |

- **规定**：`spacing.grid_gap / section_gap / content_pad_x` → 同名 `space.*`，原值不变；`radius.base` 不变，例外收窄为 [新增登记](UI_DARK_ADDITIONS.md#radius) 的三个语义角色。**为什么**：保留三档节奏与直角细框，避免把旧业务组件所有例外带进工作台。
- **规定**：`grid.col` 的 `minmax(0, 1fr)` 原则不变，**不采用原 `.shell` 的裸 `1fr` 豁免**；焦点带是独立行，不与模块玻璃叠置。**为什么**：图卡 min-content 撑破列的问题同样存在，单层卡面也是对比度计算的前提。
- **不采用**：内部几何留在 site.css 而不入令牌的旧规则；原因是本 feature 尺寸统一由 `tokens.json` 登记。也不采用旧报头双线 / 刷新步骤区、连续章节编号与复制钮、业务页断点、打印布局、旧浮层尺寸与 z 值、旧 `page-contract` DOM 和页内覆盖三规；原因是 Vue 模块壳 / 路由替代旧静态页，打印、复制与业务浮层归后续 feature，组件样式不得借全局单例串页。
- **落点**：`frontend/src/app/AppShell.vue`、`frontend/src/workbench/{FocusBand,ModuleGrid}.vue`；新窗口、抽屉与层级见 [UI_DARK_ADDITIONS](UI_DARK_ADDITIONS.md)，所有断点与尺寸只从 `T` / `--fai-*` 取值。
