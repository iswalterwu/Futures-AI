---
id: ui.cards.ui_cards
kind: spec
object: 卡片家族与图卡契约
status: current
summary: 基卡、图卡结构铁律、卡高档位、其他卡族
commodity: any
variant_of: null
page: null
nav_group: null
blocks: [ui-tokens.card_heights, page-contract.chart_card]
rules: [CK-CARD, CK-H450, PG-CID, PG-NEWPLOT, PG-NOPLOT, PG-MAN-CARD]
depends_on: [ui.layout.ui_layout, ui.colors.ui_colors]
anchors:
  - engine/web/shell/site.css::.chartcard
  - engine/web/shell/site.css::.plotwrap
  - engine/web/shell/site.css::.scroll-x
  - engine/web/shell/site.css::.boardseas-card
  - engine/web/kit/ft-kit.js::card
tests: [test_page_contract::test_page_rule, test_chart_kit::test_chartkit_page_passes_lint]
verified: 2026-10-05
source: D:/FTEngine/design/UI/Cards/UI_CARDS.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 卡片家族与图卡契约

白卡浮在纸上是全站唯一的层次（design:ui.foundations.ui_foundations#paper_not_white）。图卡里面的出图规格（底座、浮窗、每图复制钮）归 Graphs；本条目文件管卡的结构、卡头与卡高。

### #base_card 基卡 `.card`
规定：白底、细边、直角、无阴影；横向溢出的表卡加 `.scroll-x`。卡头 `.card-h`：`.card-t` 中文标题、`.card-sub` 副标（可截断）、`.card-r` 右注（单位 / 截至日期）。
为什么：卡是研究纸上的一块版面，不是浮起的控件；卡头三件固定，复制出去的图自带标题、口径与单位。
落点：engine/web/shell/site.css::.card-h；page-contract.chart_card.head

### #chart_card_contract 图卡契约（铁律）
规定：一切 Plotly 图必须是 `.card.chartcard > .card-h + .plotwrap > .plot`（选择器见 page-contract.chart_card）；使用 #ftk_card 已定的 chips:true 时，标题与绘图区之间可有且仅有一个 chart_card.chips 年份图例直属子节点，其他插层或倒序不合格；老卡族（策略卡、曲线卡等）在体检里降为 WARN，新图一律走图卡。
为什么：复制钮的左下角定位挂在 `.chartcard .plotwrap .modebar-container` 上，整卡复制按 `.card / .chartcard` 找边界——结构不对，钮就浮在图中、截图截不全：全球库存四卡 07-28 首修，US LPG 平衡页 08-24 又踩一次，巴西页正式化时返工（UI-20260830-card）。
落点：page-contract.chart_card；engine/web/shell/site.css::.chartcard；CK-CARD

### #ftk_card 新页用 FTK.card
规定：新页用 `FTK.card({...})` 生成图卡，它同时写 `data-cid`（chart_card.cid_attr，图的固定身份）；`chips:true` 在卡头下留一行年份图例。老页跟原文件的写法走。
为什么：周报、晨间页、MCP 按 cid 找图（PG-CID）；手写卡结构是 CK-CARD 事故的来源。
落点：engine/web/kit/ft-kit.js::card；PG-CID；PG-NEWPLOT

### #card_height 图高档位
规定：默认图高见 card_heights.chartcard_default；改图高必须在页内 `<style>` 提特异度压过默认（例 `.<pfx>.chartcard .plot`），不改 site.css。已用档位全在 card_heights（seen_page_overrides 是各页现用的覆盖值登记）。图高要显式给像素，不靠 flex 分高。
为什么：flex_fallback_forbidden 是 Plotly 量不到容器高时的回退画布高，出现即说明用了 flex 分高——瞬态里量不到高，回退画布被裁（CK-H450，07-27 两轮报修）。
落点：ui-tokens.card_heights；CK-H450；design:ui.layout.ui_layout#page_override_specificity

### #card_family 其他卡族
规定：`.curvecard`（期限结构，卡头单行不折行，`.sub-label` 底注）；`.stratcard`（策略卡，`.sstats` 统计脚栏）；`.boardseas-card`（盘面季节网格卡，顶部分组色条取 `--band`，兜底见 surface.boardseas_band_fallback）；KPI 卡由页内实现（例零售页 `.rt-kpi`：大写小标 / 衬线大数 / 淡灰注）。
为什么：这些卡族早于图卡契约，各有自己的结构；体检对它们按老卡族降级处理（CK-CARD），新图不走这条路。
落点：engine/web/shell/site.css::.curvecard；engine/web/shell/site.css::.stratcard；engine/web/shell/site.css::.boardseas-card

```json ui-tokens.card_heights
{
  "chartcard_default": 238,
  "board_seas": 206,
  "stock_bal_inline": 236,
  "px_main": 250,
  "px_z": 70,
  "fc_small": 190,
  "drv_mini": 96,
  "qsd_chart": 290,
  "subpage_default": 300,
  "retail_elastic": 340,
  "retail_anchor": 460,
  "replay_min": 150,
  "waterfall_min": 170,
  "flex_fallback_forbidden": 450,
  "seen_page_overrides": [120, 200, 250, 260, 300, 320, 330, 340, 360, 380, 420, 430, 460, 520]
}
```

```json page-contract.chart_card
{
  "sel": ".card.chartcard",
  "head": ".card-h",
  "title": ".card-t",
  "sub": ".card-sub",
  "right": ".card-r",
  "chips": "[data-chips]",
  "wrap": ".plotwrap",
  "plot": ".plot",
  "cid_attr": "data-cid"
}
```

## 暗色适配

- **规定**：白底基卡 → `glass.module.*`，直角细框与无卡片阴影不变，圆角用 `radius.base`；中文标题 / 可选英文副标 / 右注的角色不变，卡头标题取 `font.sans`，英文副标全大写、`type.en_sub` 与 `tracking.en_sub`。**为什么**：D-011 改变底色而不改变数据卡的可识别结构，Q-019 不把卡头误做衬线页标题。
- **规定**：图卡 CK-CARD 的结构统一原则 → 模块壳契约 `section.fai-module[data-module-id][data-state] > header + div.body`；header 固定包含 `h3.title / span.en / span.right / span.badge / span.ai / nav.actions`，徽章与 AI 角标各有状态属性；body 承载内容或加载 / 空 / 错误态。**为什么**：七个模块要共享结构与状态，不能把 Plotly 的复制定位 DOM 原封不动移到 Vue / ECharts。
- **规定**：KPI 的小标 / 衬线大数 / 弱注分工不变；样例徽章保留虚线边并附「样例」文字，异常诊断可复制。模块默认跨列与排序取契约目录，玻璃层级不随嵌套卡增加。**为什么**：身份与状态不能只靠颜色，布局持久化应跟稳定模块 id 而不是图卡 cid 走。
- **不采用**：`FTK.card`、Plotly 的 `.plotwrap / .plot` 专属 DOM、年份 chips 节点、图复制定位、旧 cid 注册流程、图高档位及 Plotly 的回退高度规则、旧曲线卡 / 策略卡 / 盘面季节卡家族；原因是完整图表模板与复制交互归 chart-templates，本 feature 只提供统一模块壳与样例折线，不照搬旧渲染器。
- **落点**：`frontend/src/modules/ModuleShell.vue`、`frontend/src/workbench/ModuleGrid.vue`、`frontend/src/shared/components/Kpi.vue`；模块壳的现行结构以 [plan §2.4](../../specs/frontend-workbench/plan.md) 为准。
