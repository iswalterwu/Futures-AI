---
id: ui.navigation.ui_nav
kind: spec
object: 两台导航表
status: current
summary: 两台导航由注册表生成（柴油写回碎片、LPG_NAV 对拍）、组序、当前项
commodity: any
variant_of: null
page: null
nav_group: null
blocks: [page-contract.nav]
rules: [PG-NAV, DD-NAV-LIFECYCLE]
depends_on: [ui.layout.ui_layout]
anchors:
  - engine/web/shell/app.js::LPG_NAV
  - engine/web/shell/app.js::bindDesk
  - .agents/skills/ft-chart/scripts/new_page.py::render_nav
  - .agents/skills/ft-chart/scripts/nav_sync.py::sync_page
  - .agents/skills/ft-chart/scripts/nav_sync.py::registry_rewrite
  - engine/ftengine/harness/knowledge/nav.py::derive
  - engine/ftengine/harness/knowledge/nav.py::GROUPS
  - engine/tests/test_page_contract.py::chk_nav
tests: [test_page_contract::test_page_rule, test_page_contract::test_lpg_nav_targets_exist, test_page_contract::test_scaffold_drift_is_caught, test_docs_features::test_nav_lifecycle]
verified: 2026-10-06
source: D:/FTEngine/design/UI/Navigation/UI_NAV.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---

> 原文快照：保留原 id、规定 / 为什么 / 落点及历史碎片；旧工程路径与 `design:` 引用仅供溯源。
> Futures-AI 的采用范围与差异见文末「暗色适配」，运行时数值唯一来源为 `frontend/src/design/tokens.json`。
# 两台导航表

侧栏 `nav` 的内容。侧栏外壳（字标、双线、`.rfoot`、窄屏塌顶栏）见 design:ui.layout.ui_layout#rail，台切换钮见 design:ui.buttons.ui_buttons#desk_switch。W6（10-06）起两台导航由注册表按页面条目文件的身份生成（design:lint_rules.registry.tree_spec#nav_groups）：柴油台写回本条目文件碎片，各页 HTML 里的静态 `<nav>` 再由 nav_sync.py 从碎片整块重生成；LPG 台的 app.js LPG_NAV 仍手写，由守卫与推导逐项对拍。不逐页手改，也不手改碎片。

### #nav_table 导航由注册表生成，柴油台写回 page-contract.nav.diesel
规定：导航由注册表生成（engine/ftengine/harness/knowledge/nav.py）：页面条目文件（Features、Inprogress 下 page 非空的 kind spec 条目文件，Research 下 page 非空的研究条目文件）的每个 page 项出一项；组由条目文件身份定（#groups），组内按 nav_order 升序，文字取 nav_label（没写取页面 `<title>` 去掉「FTEngine · 」），属性取 nav_attrs；字段写法见 design:features.readme#page_nav。柴油台：`python .agents/skills/ft-chart/scripts/nav_sync.py --from-registry` 把推导写回 nav.diesel 与 nav.groups（碎片的 `_note` 注明手改无效），再把 nav.exempt_pages 之外的全部页（含 LPG 页）的 `<nav>` 整块重生成，保留各页自己的当前项，其余字节与行尾不动；`--check-registry` 只对拍不写，`--check` 只核各页。改导航（加页、换组、换序、改文字）只改条目文件：导航文字会变的要 Walter 点头（`--allow-label-change`），导航表里没有条目文件认领的页不悄悄拿掉（`--allow-drop`）。DD-NAV-LIFECYCLE 守推导与碎片、LPG_NAV 逐项全等，PG-NAV 守各页 `<nav>` 与碎片一致。新页不手抄导航，由 new_page.py 从契约生成；带 `attrs` 的项（数据状态）照登记的属性输出。
为什么：每页手抄曾漂移（10-04 核：us-forecast 缺「真实需求测算」，四页交易台末两项顺序反了，旧 new_page.py 的 live_nav 恰好从反序页抄，取导航项最多的页、并列取字母序首页 arb.html）；W4（10-06）起全站由同一份碎片生成，遗留页名单里的五条 PG-NAV 豁免同笔删除；W6 起碎片本身由条目文件身份推导，移一个条目文件就是改一次导航，组与顺序不再按页面上线时挂在哪组漂移。
落点：engine/ftengine/harness/knowledge/nav.py::derive；.agents/skills/ft-chart/scripts/nav_sync.py::registry_rewrite；.agents/skills/ft-chart/scripts/nav_sync.py::sync_page；.agents/skills/ft-chart/scripts/new_page.py::render_nav；page-contract.nav.diesel；PG-NAV；DD-NAV-LIFECYCLE

### #groups 分组与组序
规定：`.ngroup` 组标题（全大写宽字距淡灰）+ `a.nitem` 导航项；组与组序只取 nav.groups，每一项的 group 必须在其中。六组固定序：交易台、基本面、全球数据、进行中、深度研究、系统（design:lint_rules.registry.tree_spec#nav_groups；nav.py 的 GROUPS），系统恒在末位。一页归哪组由认领它的条目文件身份决定：Features 页面条目文件自填交易台、基本面、全球数据、系统之一（nav_group）；Inprogress/Pages 的在建页一律进行中；Research/Studies 的研究页一律深度研究。组内顺序取各条目文件的 nav_order。
为什么：组序固定，读者凭位置找页；组名只在碎片里写一次，改组只改一处；组跟着条目文件身份走，移一个条目文件就是改一次导航，不再按页面上线时挂在哪组漂移。
落点：page-contract.nav.groups；engine/ftengine/harness/knowledge/nav.py::GROUPS；engine/web/shell/site.css::.ngroup；design:lint_rules.registry.tree_spec#nav_groups

### #active_item 当前项
规定：当前页的导航项用 nav.active_class：加粗墨色 + 左侧界面红竖条（css_vars `--red`）；窄屏时竖条移到底边成横条。
为什么：界面红只点睛（design:ui.foundations.ui_foundations#ui_red），当前项是它的四个用处之一。
落点：page-contract.nav.active_class；engine/web/shell/site.css::.nitem

### #fresh_dot 待更新点挂在属性上
规定：「数据状态」项带 `data-fresh-dot`；有源待更新时 boot 往所有带此属性的项里注入 `.warn-dot`。锚用属性不用 id。
为什么：柴油与 LPG 两张 nav 同时在 DOM 里（一张 hidden），用 id 会撞（08-24 LPG 数据状态页上线时改）。
落点：features.desk.desk_freshness 的 nav_attrs（推导进 page-contract.nav.diesel 数据状态项的 attrs 与 LPG_NAV 的 fresh）；engine/web/shell/app.js::boot；design:ui.components.ui_components#fresh_dots

### #lpg_nav LPG 台导航由 LPG_NAV 注入，与注册表对拍
规定：LPG 台导航不写在各页 HTML 里，由 app.js `LPG_NAV` 生成注入（nav.lpg 指向它）。LPG_NAV 仍手写，但内容必须与注册表推导的 LPG 台逐项全等（href、文字、组、顺序、fresh；DD-NAV-LIFECYCLE）：条目文件 commodity lpg、或 page 项带 `#desk=lpg`、或 commodity any 而页面 body 声明 LPG 台的，进 LPG 台。新增或改动 LPG 页先改条目文件（page、nav_group、nav_order，必要时 nav_label），再照 `nav_sync.py --from-registry` 打印的整段手工替换 LPG_NAV。LPG 页在 body 上声明 nav.lpg_desk_attr；守卫核 LPG_NAV 的每个目标页都存在。LPG 页 HTML 里的静态 `<nav>` 仍是柴油台那份（bindDesk 要它当锚），同样由 nav_sync.py 重生成。
为什么：LPG 台上线时还在搭，一张表生成比逐页改 HTML 稳；nav_sync.py 不自动写 app.js，因为改 app.js 要推 `?v=`（AGENTS §10）；台判定见 design:ui.buttons.ui_buttons#desk_switch。
落点：engine/web/shell/app.js::LPG_NAV；page-contract.nav.lpg；engine/ftengine/harness/knowledge/nav.py::parse_lpg_nav；engine/tests/test_page_contract.py::test_lpg_nav_targets_exist；engine/tests/test_docs_features.py::test_nav_lifecycle

### #exempt 不核导航的页
规定：nav.exempt_pages 列的页（效果图页、图表样板间）不核导航，nav_sync.py 也不碰它们；未进导航的正式页（W5 起没有了：brief.html 已进「进行中」组）照样同步全站导航，只是没有当前项。
为什么：效果图页与样板间不进导航，也不当正式页用；未进导航的正式页仍要能跳到全站各页。
落点：page-contract.nav.exempt_pages；.agents/skills/ft-chart/scripts/nav_sync.py::sync_page

## 待裁定条目

### #nav_order 交易台末两项顺序（W4 后已不存在，待关闭）
规定：原待裁定 Q-UI-nav-order（少数页「曲线估值分析 → 跨区套利」、契约「跨区套利 → 曲线估值分析」二选一）：W4（10-06，Walter 放行 W4–W6）按 design:lint_rules.registry.tree_spec#nav_groups 把曲线估值分析移进深度研究组，交易台末项只剩跨区套利，两项不再相邻，分歧随之消失；全站已按契约重生成。本条（原 DECISIONS Q-UI-nav-order）建议关闭，关闭权在 Walter。选项：契约顺序 / 少数页顺序。
为什么：顺序分歧来自旧脚手架从反序页抄导航；W4 的分组调整让它不再需要裁定（2026-10-04 提出）。裁定权在 Walter。
落点：page-contract.nav.diesel

### #usforecast_realdem us-forecast 缺「真实需求测算」（W4 已补，待关闭）
规定：原待裁定 Q-UI-usforecast-realdem（us-forecast.html 的 `<nav>` 缺 realdem.html 一项）：DESIGN_TREE_PLAN（已归档，Backup/Plans/）的导航节与 W4 行定为全站导航重生成、删掉遗留页名单里的五条 PG-NAV 豁免（含 us-forecast 这条），Walter 10-06 放行 W4，us-forecast 的导航随全站重生成补上该项（今在深度研究组）。本条（原 DECISIONS Q-UI-usforecast-realdem）建议关闭，关闭权在 Walter。选项：补 / 维持。
为什么：每页手抄导航漂移的现存实例（架构评审缺陷 A5，见已归档 design/Backup/Narratives/ARCHITECTURE_REVIEW.md §1.4），全站由同一份碎片生成后不再单独存在（2026-10-04 提出）。裁定权在 Walter。
落点：engine/tests/legacy_pages.json；PG-NAV

```json page-contract.nav
{
  "_note": "W6（2026-10-06）起由注册表生成，手改无效：diesel 数组与 groups 由 .agents/skills/ft-chart/scripts/nav_sync.py --from-registry 按页面条目文件 front matter 的 page、nav_group、nav_order、nav_label、nav_attrs 推导写回（推导口径 engine/ftengine/harness/knowledge/nav.py，守卫 DD-NAV-LIFECYCLE）。组由条目文件身份定：Features 条目文件自填交易台、基本面、全球数据、系统之一，Inprogress 条目文件一律进行中，Research 条目文件一律深度研究；组序固定，组内按 nav_order。改导航只改条目文件，再跑 nav_sync.py --from-registry 写回本碎片并同步全站 <nav>。项按显示顺序排，test_page_contract 的 PG-NAV 按本数组顺序逐项比",
  "groups": ["交易台", "基本面", "全球数据", "进行中", "深度研究", "系统"],
  "diesel": [
    { "href": "index.html", "label": "柴油工作台", "group": "交易台" },
    { "href": "news.html", "label": "柴油日度新闻", "group": "交易台" },
    { "href": "window.html", "label": "现货窗口", "group": "交易台" },
    { "href": "global-balance.html", "label": "全球供需平衡", "group": "基本面" },
    { "href": "india.html", "label": "印度炼厂 PPAC", "group": "基本面" },
    { "href": "us-balance.html", "label": "美国柴油平衡", "group": "基本面" },
    { "href": "us-forecast.html", "label": "美柴平衡推演", "group": "基本面" },
    { "href": "refinery-map.html", "label": "全球炼厂地图", "group": "全球数据" },
    { "href": "tankers.html", "label": "全球油轮信息", "group": "全球数据" },
    { "href": "onwater.html", "label": "水上库存", "group": "全球数据" },
    { "href": "pricing.html", "label": "柴油定价", "group": "进行中" },
    { "href": "arb.html", "label": "跨区套利", "group": "进行中" },
    { "href": "brazil.html", "label": "巴西柴油需求", "group": "进行中" },
    { "href": "oil-prices.html", "label": "油品价格概览", "group": "进行中" },
    { "href": "brief.html", "label": "晨间页", "group": "进行中" },
    { "href": "curves.html", "label": "曲线估值分析", "group": "深度研究" },
    { "href": "heating.html", "label": "美国取暖需求", "group": "深度研究" },
    { "href": "retail.html", "label": "全球零售价格", "group": "深度研究" },
    { "href": "padd1-marketable.html", "label": "PADD 1 可售库存", "group": "深度研究" },
    { "href": "realdem.html", "label": "真实需求测算", "group": "深度研究" },
    { "href": "nehhor.html", "label": "NEHHOR 储备", "group": "深度研究" },
    { "href": "freshness.html", "label": "数据状态", "group": "系统", "attrs": ["id=\"nav-fresh\"", "data-fresh-dot"] }
  ],
  "lpg": "app.js LPG_NAV",
  "active_class": "nitem active",
  "lpg_desk_attr": "body[data-desk=\"lpg\"]",
  "exempt_pages": ["*-mock.html", "chartkit.html"]
}
```

## 暗色适配

- **规定**：两台导航表 → 单一 Vue 路由导航；固定九项顺序为工作台、作业、日报、价格、平衡表、物流、格物致知、知识库、设置，无专题子项。不逐页手抄导航的原则不变。**为什么**：产品底座品种无关，九项固定菜单由 spec R-002 v2 冻结（D-016 / D-018），不随旧站页面身份生成。
- **规定**：当前项加粗与点睛指示不变，墨字 → `text.primary`，竖条 → `accent.red`，并标记 `aria-current`；窄窗口塌为单行顶部横向导航，标签不折行、页面不横滚，仅空间不足时在导航容器内部横向滚动；采用 [UI_LAYOUT.md#narrow](UI_LAYOUT.md#narrow) 原规则（Walter 2026-10-28 的 G-02 裁定）。阈值用 `breakpoint.shell_collapse`，侧栏收起状态持久化。**为什么**：高亮要同时可见且可测，点睛色只用于非文字指示，不作导航背景。
- **规定**：导航旁的待更新提醒 → 顶栏数据源新鲜度点，取 `status.fresh / status.stale`；原绿正常态改蓝。**为什么**：资讯与数据源状态是全局顶栏职责，不依赖旧「数据状态」页面或双 nav 注入。
- **不采用**：六组旧组序、柴油 / LPG 导航内容、双台切换、`nav_sync.py` 与 `LPG_NAV` 流程、历史豁免页、旧待裁定问题及 `data-fresh-dot` 注入机制；原因是本 feature 的九项路由已明确，旧静态页同步与后端注册表不属于前端实施范围。上方生成的 `page-contract.nav` 只保留原件，不手改其内容或继续生成旧导航。
- **落点**：`frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue}`；页面地址稳定、直接打开与刷新停留行为按 [plan §2.2 / §7.4](../../specs/frontend-workbench/plan.md) 实现（v2 导航以 §7.4 为准）。
