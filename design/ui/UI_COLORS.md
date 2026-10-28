---
id: ui.colors.ui_colors
kind: spec
object: 界面色令牌
status: current
summary: CSS 变量、表面灰、盘面灰、分组带色、状态色、图周边界面色
commodity: any
variant_of: null
page: null
nav_group: null
blocks: [ui-tokens.css_vars, ui-tokens.surface, ui-tokens.board, ui-tokens.band_tint, ui-tokens.status, ui-tokens.chart_chrome]
rules: [PG-HEX]
depends_on: [ui.foundations.ui_foundations]
anchors:
  - engine/web/shell/site.css::--ink3
  - engine/web/shell/app.js::BAND_TINT
  - engine/web/shell/app.js::bandTint
  - engine/web/shell/app.js::AX
  - engine/web/kit/ft-runtime.js::CP_FRAME
  - engine/ftengine/delivery/charting/runtime.py::CP_FRAME
  - engine/ftengine/delivery/charting/runtime.py::JS_SEASONAL
tests: [test_design_tokens::test_css_vars_equal_site_css_root, test_design_tokens::test_band_tint_and_type_scale, test_design_tokens::test_chart_chrome_equals_code, test_design_tokens::test_tooltip_equals_runtime, test_design_tokens::test_design_prose_has_no_hex]
verified: 2026-10-05
source: D:/FTEngine/design/UI/Colors/UI_COLORS.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 界面色令牌

界面色是页面外壳与图周边（轴线、浮窗、复制相框）的颜色；图上的数据色只在 PALETTE_CORE（`palette-core`）。色值只在下面的碎片里，散文写键名。

<a id="css_var_semantics"></a>

### #css_var_semantics CSS 变量的语义
规定：`--ink` 墨色正文 / 最新期；`--ink2` 次级文字；`--ink3` 辅助灰（说明、单位、占位）；`--hair` 卡内细线；`--hair2` 结构线（章节底线、表头线、控件边）；`--up` / `--down` 涨跌；`--link` 藏蓝链接；`--red` / `--amber` 的语义见 design:ui.foundations.ui_foundations#ui_red 与 #ui_amber。css_vars 逐个对应 site.css 的 :root，多一个少一个都由守卫拦。
为什么：页面引变量不引色值，换色只改一处；变量按语义命名，读样式就知道用途。
落点：ui-tokens.css_vars；engine/web/shell/site.css::--ink3

### #blue_null `--blue` 不存在
规定：css_vars 里 `--blue` 记为 null：:root 从未定义它，全站不得再引用 `var(--blue)`。
为什么：原唯一引用 `.fqb.W` 引了一个不存在的变量，10-04 改为 `var(--ink3)`；键留作「禁止再引用」的记号，守卫扫全站 css / js / html。
落点：ui-tokens.css_vars；engine/tests/test_design_tokens.py::test_css_vars_equal_site_css_root

### #ui_vs_chart_colors 界面色不进 palette-core
规定：界面色（本条目文件六个碎片）与图表数据色（palette-core）分两处登记；轴线灰、浮窗底、复制纸底与相框色归 chart_chrome，不进 palette-core。
为什么：chart_lint 把 palette-core 里的每个色值都当图表核心色；界面色混进去，体检就分不清数据色与界面色。
落点：ui-tokens.chart_chrome；palette-core

### #no_new_colors 不发明新色
规定：界面色只从本条目文件碎片取，图表色只从 palette-core 取；页面脚本不写色值字面量（名单外页由 PG-HEX 拦），页内 `<style>` 也引变量；确需新色先登记进碎片再用。
为什么：子页各抄一套色常量，抄一次漂一点（ft-kit.js 头注：同一个 ICE 有三个色值）。
落点：PG-HEX；engine/web/kit/ft-kit.js::FTK.PAL

### #surface 表面灰
规定：导航悬停、数据表行线与悬停、芯片选中底、工具条底、平衡表表头 / 主行 / 占比行 / 滚条、季度表 E 列底等纸色系表面的现值登记在 surface 的键。
为什么：表面灰是纸风的层次，登记成碎片才查得到每一种灰用在哪；原文 surface 块只登记现值，没写取舍理由。
落点：ui-tokens.surface

### #board_greys 盘面灰阶
规定：盘面网格表（`.card.board`）用自己一套中性灰（board 各键：卡底、卡头、表头 stub、行线、分组界、悬停、列高亮、统计行、分位条轨道），不用纸色系。
为什么：盘面是日报式灰底网格，和纸色白卡分开，一眼分出「行情表」与「研究卡」。
落点：ui-tokens.board；design:ui.tables.ui_tables#board

### #band_tint 分组带色
规定：盘面分组头的底色与字色成对取自 band_tint.pairs：组名按 startsWith 匹配、按对象键序取第一个命中，都不中取 fallback；families 登记六个色族，pairs 现有各对都取自这六族。
为什么：匹配按键序取第一个命中，键序本身就是语义，所以守卫连 app.js BAND_TINT 的键序一起对拍。
落点：ui-tokens.band_tint；engine/web/shell/app.js::BAND_TINT；engine/web/shell/app.js::bandTint

<a id="status_colors"></a>

### #status_colors 状态色
规定：z 分位胶囊、状态徽、状态灯、侧栏刷新钮与步骤流、新鲜度点与待更新点、盘面三态格、晨间分诊卡、净出口 lint 格、稀缺态横幅、频率标、船级明细钮、可编辑格的颜色都只取 status 的对应键；变量能表达的写 `var(...)`。
为什么：同一状态全站同色才读得懂；zpill 的 rich / cheap 与同页 z 柱同色（PALETTE_CORE §四）。
落点：ui-tokens.status；design:ui.components.ui_components

<a id="chart_chrome"></a>

### #chart_chrome 图周边界面色
规定：图内字色、轴线 / 网格 / 刻度色、原生悬停框、零线、端标箭头、两套浮窗配色（tooltip_light / tooltip_dark）、复制纸底兜底与相框、复制钮图标、水印 RGB 都取 chart_chrome；尺寸、时长、线宽等非颜色参数在 chart-spec。ft-runtime.js 是产物，复制相框色与 `#ft-tip` 浮窗配色的真源是 engine/ftengine/delivery/charting/runtime.py（JS_CHROME 段的 CP_FRAME、JS_SEASONAL 段的 `#ft-tip` 样式）；改这两处改 runtime.py，再重出 ft-runtime.js（做法见 design:graphs.copy.chart_copy#true_source）。
为什么：这些是界面色不是数据色（#ui_vs_chart_colors），但分散在 app.js / ft-kit.js / ft-runtime.js 三处常量里，只有登记成碎片才能逐位对拍；直接改 ft-runtime.js 会在下一次 ftengine.delivery.desk.diesel 时被覆盖。
落点：ui-tokens.chart_chrome；engine/web/shell/app.js::AX；engine/web/kit/ft-runtime.js::CP_FRAME；engine/ftengine/delivery/charting/runtime.py::CP_FRAME；engine/ftengine/delivery/charting/runtime.py::JS_SEASONAL

## 待裁定条目

### #paper_values 纸底三值归一（待裁定）
规定：待裁定（Q-UI-paper）：站点纸色 css_vars `--paper`、复制纸底兜底 chart_chrome.copy.card_paper_fallback、mock 页另用的第三个纸色，三选一或维持；裁定前各处按现值，不顺手改。选项：三选一 / 维持。
为什么：同一张「纸」在站点、复制兜底与 mock 里是三个值，10-04 摸底时发现（2026-10-04 提出）；裁定权在 Walter。
落点：ui-tokens.css_vars；ui-tokens.chart_chrome.copy

```json ui-tokens.css_vars
{
  "--paper": "#f6f5f1",
  "--card": "#ffffff",
  "--ink": "#16191d",
  "--ink2": "#4d545c",
  "--ink3": "#878d95",
  "--hair": "#e5e2da",
  "--hair2": "#d3cfc5",
  "--up": "#0d7a43",
  "--down": "#bb2c1f",
  "--link": "#0f4c81",
  "--red": "#C00000",
  "--amber": "#b8860b",
  "--serif": "Georgia,\"Times New Roman\",\"Source Serif Pro\",\"Songti SC\",SimSun,serif",
  "--sans": "\"Segoe UI\",-apple-system,\"PingFang SC\",\"Microsoft YaHei\",Arial,sans-serif",
  "--mono": "Consolas,\"SF Mono\",Menlo,\"Courier New\",monospace",
  "--rail-w": "198px",
  "--blue": null
}
```

```json ui-tokens.surface
{
  "nitem_hover": "#efede7",
  "data_row_line": "#efede7",
  "data_row_hover": "#fbfaf7",
  "mini_row_line": "#f2f0ea",
  "chip_on_bg": "#f1efe9",
  "toolbar_bg": "#f1efe9",
  "col_guide_bg": "#f7f6f2",
  "rng_track": "#e8e5dd",
  "ring_track": "#e8e5dd",
  "pxfx_bg": "#f6f5f0",
  "pxtri_mkt_bg": "#faf9f5",
  "gbal_head": "#f1efe9",
  "gbal_colh": "#f6f4ef",
  "gbal_rmain": "#EAE8E1",
  "gbal_rmain_hover": "#e2dfd6",
  "gbal_pct_row": "#F6F5F1",
  "gbal_sub_hover": "#f7f5ef",
  "gbal_mem_rmain": "#F0EEE8",
  "gbal_scroll_track": "#f1efe9",
  "gbal_scroll_thumb": "#c6c0b2",
  "gbal_scroll_thumb_hover": "#a89f8d",
  "qsdt_est_val_bg": "#fdfaf0",
  "baltbl_blk_row": "#ece9e1",
  "railTg_hover_border": "#b7b1a6",
  "boardseas_band_fallback": "#d3cfc5"
}
```

```json ui-tokens.board
{
  "card_bg": "#f6f6f6",
  "card_head": "#ebebeb",
  "card_head_line": "#dedede",
  "th_stub": "#efefef",
  "row_line": "#e9e9e9",
  "stub_right": "#dedede",
  "th_line": "#d9d9d9",
  "band_left": "#dcdcdc",
  "row_hover": "#ececec",
  "col_hl": "#e7e7e7",
  "sum_row": "#f0f0f0",
  "rng_track": "#e2e2e2"
}
```

```json ui-tokens.band_tint
{
  "pairs": {
    "原油": ["#e9edf4", "#3d5a78"],
    "柴油": ["#f4eedd", "#7d5c10"],
    "裂解": ["#f5ebe4", "#7a4a33"],
    "ULSD": ["#e9edf4", "#3d5a78"],
    "Gasoil": ["#f4eedd", "#7d5c10"],
    "Sing 10ppm": ["#f2ece0", "#7a6233"],
    "区域差": ["#f5ebe4", "#7a4a33"],
    "现货基差": ["#f4eedd", "#7d5c10"],
    "管道": ["#e9edf4", "#3d5a78"],
    "Freight": ["#e9edf4", "#3d5a78"],
    "Bio": ["#f4eedd", "#7d5c10"],
    "Others": ["#efece6", "#5c564a"],
    "丙烷盘面": ["#e9edf4", "#3d5a78"],
    "丁烷": ["#f2ece0", "#7a6233"],
    "月差": ["#f4eedd", "#7d5c10"],
    "品种差": ["#f5ebe4", "#7a4a33"],
    "油气比价": ["#e9edf4", "#3d5a78"],
    "石化替代": ["#efece6", "#5c564a"],
    "运费": ["#e9edf4", "#3d5a78"],
    "套利经济": ["#f5ebe4", "#7a4a33"],
    "另类数据": ["#e6efe9", "#3f6b52"]
  },
  "fallback": ["#f1efe9", "#4d545c"],
  "families": {
    "blue": ["#e9edf4", "#3d5a78"],
    "yellow": ["#f4eedd", "#7d5c10"],
    "brown": ["#f5ebe4", "#7a4a33"],
    "sand": ["#f2ece0", "#7a6233"],
    "grey": ["#efece6", "#5c564a"],
    "green": ["#e6efe9", "#3f6b52"]
  },
  "match": "startsWith(key)，按对象键序取第一个命中"
}
```

```json ui-tokens.status
{
  "zpill": {
    "rich": { "bg": "#e8edf3", "fg": "#354E6B" },
    "cheap": { "bg": "#f4eaeb", "fg": "#A35F65" },
    "flat": { "bg": "#f0efe9", "fg": "var(--ink2)" },
    "min_w": 52
  },
  "op_badge": {
    "base": { "bg": "#fbfaf7", "border": "var(--hair2)", "fg": "var(--ink2)", "dot": "var(--ink3)" },
    "good": { "dot": "var(--up)" },
    "warn": { "bg": "#faf7ea", "border": "#dfd1a5", "fg": "#7d5c10", "dot": "var(--amber)" },
    "bad": { "bg": "#f7ece9", "border": "#dcb8b0", "fg": "#8a3b28", "dot": "var(--down)" },
    "sample": { "border_style": "dashed", "fg": "var(--ink3)" }
  },
  "pxlight": { "size": 9, "off": "#c9c5bb", "on": "var(--up)", "on_glow": "0 0 4px rgba(13,122,67,.5)" },
  "railrf": {
    "idle": { "bg": "#fbfaf7", "border": "var(--hair2)", "fg": "var(--ink2)" },
    "hover": { "bg": "#f2efe8", "border": "#b7b1a6", "fg": "var(--link)" },
    "disabled": { "fg": "var(--ink3)" },
    "busy": { "bg": "#f4eedd", "border": "#d8c99a", "fg": "#7d5c10" },
    "err": { "bg": "#f7ece9", "border": "#dcb8b0", "fg": "#8a3b28" }
  },
  "rfsteps": { "bad": "#8a3b28", "skip": "#a8a29a", "skip_mark": "#c0bab0", "good_mark": "#4a7a4a" },
  "fresh_dot": { "size": 7, "fresh": "var(--up)", "stale": "var(--amber)" },
  "warn_dot": { "size": 6, "color": "var(--amber)" },
  "board_cell": { "hol": "var(--ink3)", "unset": "var(--amber)", "missing": "–" },
  "triage": { "ok": "#2f8f5b", "warn": "#c98a1a", "down": "#b23a3a", "tag_fg": "#0f4c81", "tag_bg": "#e8f0f9" },
  "nxwarn": { "bg": "#fdf6e8", "mark": "#b8860b" },
  "pxscar": { "bg": "#faf6ea", "border": "#d9c58a", "left": "var(--amber)", "fg": "#4a4438", "strong": "#7a5b12" },
  "fqb": { "W": "var(--ink3)", "M": "var(--ink2)", "fg": "#fff" },
  "gpop_ship_btn": { "fg": "var(--link)", "border": "#c9d6e3", "bg": "#f2f6fa" },
  "edit": { "editable_hint": "var(--amber)", "edited_underline": "var(--amber)", "replay_dotted": "var(--amber)", "input_border": "var(--amber)" }
}
```

```json ui-tokens.chart_chrome
{
  "_note": "图表周边的界面色（非数据色，不进 palette-core）；尺寸、时长、线宽等非颜色参数在 CHART_SYSTEM chart-spec",
  "plot_font_color": "#4d545c",
  "axis": { "grid": "rgba(0,0,0,.07)", "line": "rgba(0,0,0,.28)", "tick": "rgba(0,0,0,.28)", "tickfont": "#6b7178" },
  "hoverlabel": { "bg": "#ffffff", "border": "#d3cfc5", "font": "#16191d" },
  "zero_line": "rgba(0,0,0,.35)",
  "end_label_arrow": "rgba(0,0,0,.4)",
  "tooltip_light": {
    "bg": "rgba(255,255,255,.78)",
    "fg": "#1a1d21",
    "border": "rgba(0,0,0,.05)",
    "shadow": "0 12px 36px rgba(20,24,30,.16)",
    "title": "#0d0f12",
    "year": "#70757a",
    "rate_yoy": "#8a9099",
    "unit": "#9aa0a6",
    "hl_row": "rgba(192,0,0,.055)",
    "cvtip_bg": "rgba(255,255,255,.86)"
  },
  "tooltip_dark": { "bg": "rgba(24,27,32,.82)", "fg": "#E8EAED", "border": "rgba(255,255,255,.08)", "shadow": "0 12px 36px rgba(0,0,0,.5)", "title": "#fff", "muted": "#9AA0A6", "hl_row": "rgba(255,255,255,.07)" },
  "copy": { "card_paper_fallback": "#fdfcfa", "frame": "#878d95", "page_bg": "#f6f5f1", "icon_fill": "rgba(68,68,68,0.6)", "watermark_rgb": "22, 25, 29", "modebar_standalone_bg": "rgba(255,255,255,.72)" }
}
```

## 暗色适配

- **规定**：`css_vars` 的纸 / 卡 / 墨字 → `bg.* / glass.* / text.*`，由 [designUI §2.1](../../docs/designUI.md) 与 [三层玻璃登记](UI_DARK_ADDITIONS.md#glass) 承接。原 `--up / --down` 的绿涨红跌 → `updown.up / updown.down` 的红涨绿跌，限 D-013 三个行情位置的字色；分析正负仍取 `chart.pos / chart.neg`。**为什么**：暗色主题和国内行情阅读习惯已冻结，不能把旧站表格的方向规则照抄到分析区。

`css_var_semantics` 的点睛与辅助色对应如下；暗色值均取自 T-02 令牌，原值来自上方 `css_vars`。对比度按 [PALETTE_DARK 的统一算法](../charts/PALETTE_DARK.md#contrast)。

| 原键 | 暗色令牌 | 暗色值 | 对比度（约） | 采用理由与限制 |
|---|---|---|---|---|
| `--red` | `accent.red` | `#DF5C4D` | 4.2 | 点睛用途不变；仅非文字指示，不能作章节号或异常文案字色 |
| `--amber` | `accent.amber` | `#C69633` | 5.6 | 亮化后保留非实绩 / 可编辑 / 待更新语义 |
| `--link` | `accent.link` | `#6A9DD1` | 5.3 | 暗底提升可读性，仍只表示可跳转链接 |

- **规定**：`status_colors` 的状态体系不借用涨跌令牌；对应关系见下表。**为什么**：绿在行情位置表示跌，不能同时表示数据健康；弱样例色还需要文字与虚线表达身份。

| 原状态 | 暗色令牌 | 取色依据 | 限制 |
|---|---|---|---|
| good / fresh 的绿 | `status.ok / status.fresh` | `chart.line_4` 同值的亮化蓝 | 正常 / 新鲜，不是行情方向 |
| warn / stale 的琥珀 | `status.warn / status.stale` | `accent.amber` 同值 | 警告 / 待更新 |
| bad 的红 | `status.bad` | `accent.red` 同值 | 仅点 / 边框，文案用 `text.primary` |
| sample 的辅助灰 | `status.sample` | `text.muted` 同值 | 配虚线边与「样例」文字 |

- **规定**：`chart_chrome` 的字色 → `text.*`，原黑色轴线 / 刻度 → `chart.axis_line / chart.axis_tick`，原黑色网格 → `chart.grid`（白色低透明度）；具体值从令牌生成主题，不在这里另起第二套。**为什么**：透明图面要透出玻璃，暗底上的结构线需亮化但不能压过数据线。
- **规定**：不发明页面色、界面色与图表色分开、禁止不存在的 `--blue` 引用等纪律不变；旧 `ui-tokens` 碎片仅存档，不再消费。**为什么**：唯一运行时登记已迁至 `tokens.json`，生成物可重建对拍。
- **不采用**：纸色三值待裁定事项、旧 `surface / board / band_tint` 的浅底与多色分组带、旧状态族的业务特例、复制相框 / 水印 / 两级浮窗值；原因是本 feature 只交付暗色工作台的代表形态，不提供亮色主题、完整业务表或复制导出。需要灰阶时复用已有玻璃边与文字令牌，不追加底色族。
- **落点**：`frontend/src/design/{tokens.json,glass.css,updown.css}` 与生成的 ECharts 主题；完整图表原色亮化另见 [PALETTE_DARK](../charts/PALETTE_DARK.md)。
