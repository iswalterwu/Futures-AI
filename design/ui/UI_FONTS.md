---
id: ui.fonts.ui_fonts
kind: spec
object: 字体栈与字号阶梯
status: current
summary: 三族字体栈、图内与浮窗与水印字体、主站与子页字号阶梯
commodity: any
variant_of: null
page: null
nav_group: null
blocks: [ui-tokens.fonts, ui-tokens.type_scale]
rules: [CK-FONT]
depends_on: [ui.foundations.ui_foundations]
anchors:
  - engine/web/shell/site.css::--serif
  - engine/web/shell/app.js::FONT
  - engine/web/kit/ft-kit.js::FS
  - engine/web/shell/app.js::drawCopyWatermark
  - engine/ftengine/delivery/charting/runtime.py::JS_SEASONAL
  - .agents/skills/ft-chart/scripts/new_page.py::render_html
tests: [test_design_tokens::test_fonts, test_design_tokens::test_band_tint_and_type_scale]
verified: 2026-10-05
source: D:/FTEngine/design/UI/Fonts/UI_FONTS.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 字体栈与字号阶梯

三族字体各管哪些元素是 DNA（design:ui.foundations.ui_foundations#three_families）；本条目文件只管栈与字号，数值全在碎片里。

<a id="stacks"></a>

### #stacks 三族字体栈
规定：衬线 / 无衬线 / 等宽三族的栈只有 fonts.serif / sans / mono 一份，与 css_vars 的 `--serif` `--sans` `--mono` 同值；页面与组件引变量，不另写栈。
为什么：栈写两处就会漂；守卫同时对拍 site.css :root 与同一块内的两处。
落点：ui-tokens.fonts；engine/web/shell/site.css::--serif

### #special_stacks 图内、浮窗、水印字体
规定：Plotly 图内字体用 fonts.plot（即 app.js FONT.family，也是 chart-spec.plot_base.font.family）；两种自绘浮窗 `#ft-tip` 与 `.wb-tip` 共用 fonts.tip；复制水印用 fonts.watermark。`#ft-tip` 的字体写在 ft-runtime.js 里，那是产物：真源是 engine/ftengine/delivery/charting/runtime.py 的 JS_SEASONAL 段，改字体改 runtime.py 再重出（做法见 design:graphs.copy.chart_copy#true_source）。
为什么：图内、浮窗、水印由三份代码画（app.js、ft-runtime.js、site.css），登记成令牌才能对拍成同一套；直接改 ft-runtime.js 会在下一次 ftengine.delivery.desk.diesel 时被覆盖。
落点：engine/web/shell/app.js::FONT；engine/web/kit/ft-runtime.js::ft-tip；engine/ftengine/delivery/charting/runtime.py::JS_SEASONAL；engine/web/shell/app.js::drawCopyWatermark

<a id="main_scale"></a>

### #main_scale 主站字号阶梯
规定：主站（台面页与 site.css）各元素字号只取 type_scale.main 的键——KPI、字标、页标题、章节号与标题、正文与行高、导航、卡头、浮窗标题、图内字与刻度、盘面与表格、脚注、角标等；改字号先改键，再改 site.css。
为什么：页面之间字号一致是研究纸观感的一半；阶梯集中登记才看得出谁越级。
落点：ui-tokens.type_scale.main；docs/assets/site.css；engine/web/shell/app.js::FONT

### #subpage_scale 子页大一档
规定：脚手架生成的子页用 type_scale.subpage：正文、元信息、节注、脚注、卡头、图内字、刻度、轴标题、标注、柱上字、图例与默认图高都比主站大一档；它写在 new_page.py 模板的页内 `<style>` 与 ft-kit.js（FS / font / LEG）里，不改 site.css 的主站阶梯。
为什么：子页信息密度低、读者更广，大一档更好读；按页内覆盖三规写，只随本页生效（design:ui.layout.ui_layout#page_override_specificity）。
落点：ui-tokens.type_scale.subpage；engine/web/kit/ft-kit.js::FS；.agents/skills/ft-chart/scripts/new_page.py::render_html

```json ui-tokens.fonts
{
  "serif": "Georgia,\"Times New Roman\",\"Source Serif Pro\",\"Songti SC\",SimSun,serif",
  "sans": "\"Segoe UI\",-apple-system,\"PingFang SC\",\"Microsoft YaHei\",Arial,sans-serif",
  "mono": "Consolas,\"SF Mono\",Menlo,\"Courier New\",monospace",
  "plot": "\"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",Arial,sans-serif",
  "tip": "-apple-system,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif",
  "watermark": "\"Microsoft YaHei\",\"Noto Sans SC\",\"PingFang SC\",sans-serif"
}
```

```json ui-tokens.type_scale
{
  "main": {
    "kpi": 25,
    "wordmark": 24,
    "h1": 21,
    "pulse": 20,
    "sec_title": 17.5,
    "modal_title": 14.5,
    "sec_no": 14,
    "body": 13,
    "body_lh": 1.5,
    "loading": 13,
    "nav": 12.5,
    "card_t": 12.5,
    "pop_title": 12.5,
    "tip_title": 12.5,
    "plot": 12,
    "meta": 12,
    "board_stub": 12,
    "board_td": 12,
    "btn": 12,
    "sec_note": 11.5,
    "pgbtn": 11.5,
    "board_colh_cn": 11.5,
    "secbtn": 11,
    "card_sub": 11,
    "card_r": 11,
    "tick": 11,
    "footnote": 11,
    "footnote_lh": 1.7,
    "mini_td": 11,
    "th": 10.5,
    "en_sub": 10.5,
    "unit": 10.5,
    "rfoot": 10.5,
    "tag": 10,
    "board_band": 10,
    "lgc2": 10,
    "fnotes_en": 10,
    "ngroup": 9.5,
    "deskbtn": 9.5,
    "tsrow": 9.5,
    "mini_th": 9.5,
    "board_colh_cs": 9.5,
    "col_guide": 9,
    "lgc": 8.5,
    "e_badge": 8.5
  },
  "subpage": {
    "content": 14,
    "meta": 12.5,
    "sec_note": 12,
    "footnote": 12.5,
    "footnote_lh": 1.78,
    "card_t": 13.5,
    "card_sub": 12,
    "card_r": 12,
    "plot_font": 13,
    "tick": 12,
    "axtitle": 12,
    "ann": 11.5,
    "bartext": 10,
    "legend": 11,
    "plot_h": 300
  }
}
```

## 暗色适配

- **规定**：`fonts.serif / sans / mono` → `font.serif / font.sans / font.mono`，三栈原值不变；KPI 大数衬线，模块壳标题无衬线，其余数值等宽并 tabular-nums、右对齐。**为什么**：暗色不改变字体 DNA，Q-019 明确大数例外与卡头分工。
- **规定**：`type_scale.main` 全部键 → 同名 `type.*`，字号值不变，长度写为 CSS px；`body_lh / footnote_lh` 保留无单位行高。`main_scale` 在本 feature 还承接 `weight.regular / weight.emphasis / weight.strong` 的常规 / 强调 / 加粗三级登记，数值读取 T-02 令牌；这些字重是本次补充，不是原 JSON 字号块已有的键。**为什么**：保留主站密度，同时让原文隐含的字重角色也经令牌统一。
- **规定**：时间线摘要与 ticker 新增字号只取 [UI_DARK_ADDITIONS 的 type](UI_DARK_ADDITIONS.md#type)；英文副标字距取 `tracking.en_sub`。**为什么**：新增工作台元素不另建第二套字号阶梯。
- **不采用**：`type_scale.subpage` 大一档策略、Plotly / 自绘浮窗 / 水印的独立字体栈与旧生成器改写方式；原因是本 feature 各非工作台页仅占位，图表使用 ECharts，复制与完整图表模板不在范围内。
- **落点**：`frontend/src/design/tokens.json`、生成的 `T` / `--fai-*`，`frontend/src/shared/components/{Num,Kpi}.vue`；保留的原碎片只作来源证明，不再维护第二套运行时值。
