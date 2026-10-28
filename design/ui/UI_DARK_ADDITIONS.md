---
id: ui.dark.ui_dark_additions
kind: spec
object: 暗色工作台补充登记
status: current
summary: 背景、三层玻璃、工作台字号、圆角例外、层级与窗口布局
source: specs/frontend-workbench/plan.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---
# 暗色工作台补充登记

本文件是 Futures-AI 新增条目，不冒充 FTEngine 原件。依据 [plan §2.1–§2.5](../../specs/frontend-workbench/plan.md)、[designUI](../../docs/designUI.md) 与 T-02 已登记的 [tokens.json](../../frontend/src/design/tokens.json)，承接原 UI 条目没有的工作台角色。下表是令牌的设计说明；实现只消费生成的 `T` / `--fai-*`，不从 Markdown 或旧 `ui-tokens` 碎片读运行时值。

<a id="background"></a>

### #background 背景渐变

规定：背景三段取 `bg.top / bg.middle / bg.bottom`（来源为 designUI §2.1）；补充的渐变参数如下，不增加新的表面色。

| 令牌 | 值 | 用途 |
|---|---|---|
| `bg.angle` | `180deg` | 纵向渐变 |
| `bg.middle_stop` | `55%` | 中段位置 |

为什么：沿用 Q-003 确认样张的纵向暖灰渐变，避免深底变成整块纯黑。
落点：生成的基础背景与首帧 critical 样式。

<a id="glass"></a>

### #glass 三层玻璃映射

规定：玻璃只登记以下三层，同层复用；焦点带是内容区独立一行，不与模块区叠置。

| 令牌前缀 | `.surface` | `.border` | `.blur` | 使用位置 |
|---|---|---|---|---|
| `glass.focus` | `rgba(255,255,255,.035)` | `rgba(255,255,255,.07)` | `18px` | 焦点带、侧栏、顶栏 |
| `glass.module` | `rgba(255,255,255,.045)` | `rgba(255,255,255,.09)` | `18px` | 模块壳 |
| `glass.drawer` | `rgba(24,25,28,.82)` | `rgba(255,255,255,.12)` | `28px` | 对话抽屉、模块库 |

为什么：D-011 的暗色玻璃替代纸底白卡，三种表面足以区分信息层级；不为子卡或模块库增加第四层。焦点带与模块不重叠，图表对比度可按单层卡面核算。
落点：`frontend/src/design/glass.css` 的 `.glass-focus / .glass-module / .glass-drawer`，`backdrop-filter` 只在该文件定义。

<a id="type"></a>

### #type 工作台新增字号

规定：原 `main_scale` 全量保留，仅增加以下两个角色；字体三族仍按 [UI_FONTS](UI_FONTS.md#stacks) 分工。

| 令牌 | 值 | 用途 |
|---|---|---|
| `type.timeline_step` | `12px` | CoT 时间线步骤摘要 |
| `type.ticker` | `11px` | 顶栏等宽资讯 ticker |

为什么：时间线沿用元信息密度，ticker 用等宽小字为状态区留空间，不另建一套字号阶梯。
落点：`CotTimeline.vue` 与 `TopBar.vue`。

<a id="radius"></a>

### #radius 圆角例外

规定：基卡继续用 [UI_LAYOUT 的 `radius.base`](UI_LAYOUT.md#radius_exceptions)，例外限下表；不把浮窗圆角用于模块卡片。

| 令牌 | 值 | 原条目来源与采用范围 |
|---|---|---|
| `radius.control` | `4px` | 原 `radius.exceptions.railrf`；仅小控件 |
| `radius.popover` | `8px` | 原 `radius.exceptions.fcTip`；仅浮窗 |
| `radius.round` | `50%` | 原 `radius.exceptions.railTg`；仅圆形状态点与折叠钮 |

为什么：保留直角细框，同时把旧业务组件的零散例外收敛成具名角色，避免卡片变成大圆角控件。
落点：共享控件、状态点与浮层；全部经令牌引用。

<a id="z"></a>

### #z 工作台堆叠顺序

规定：以下是遮挡顺序，不是五种玻璃；模块库和抽屉仍共用第三层玻璃。

| 令牌 | 值 | 用途 |
|---|---|---|
| `z.content` | `0` | 内容区 |
| `z.chrome` | `10` | 侧栏 / 顶栏 |
| `z.dock` | `20` | 常驻输入栏 |
| `z.drawer` | `30` | 对话抽屉 |
| `z.library` | `40` | 模块库 |

为什么：原工程的季节图、船级抽屉与策略弹窗不在本 feature，不能把旧浮层 z 值当工作台的默认顺序；输入与选择面板要在内容之上。
落点：`AppShell.vue`、`AgentDock.vue`、`AgentDrawer.vue`、`ModuleLibrary.vue`。

<a id="window"></a>

### #window 窗口基准

规定：窗口验收尺寸以 CSS px 计，外壳取视口高度；断点值仍见 [UI_LAYOUT](UI_LAYOUT.md#narrow)。

| 令牌 | 值 | 用途 |
|---|---|---|
| `window.min_width` | `960` | 最小支持窗口宽度 |
| `window.width` | `1440` | 设计基准宽度 |
| `window.height` | `900` | 设计基准高度 |
| `layout.viewport_height` | `100vh` | 外壳视口高度 |

为什么：Q-004 固定桌面基准与窄窗验收范围，不能用移动端布局替代或允许横向页面溢出。
落点：应用外壳与断点端到端验收。

<a id="drawer"></a>

### #drawer 抽屉高度

规定：抽屉有 closed / half / tall 三态，只为两档展开态登记高度；closed 收起，不提供自由拖高。

| 令牌 | 值 | 用途 |
|---|---|---|
| `layout.drawer_half` | `45vh` | 常规展开 |
| `layout.drawer_tall` | `80vh` | 扩展阅读 |

为什么：Q-009 采用固定两档，保持内容可见与长时间线阅读之间的明确切换，不引入自由拖拽布局。
落点：`AgentDrawer.vue` 与 `fai.drawer` 持久化状态。

<a id="focus"></a>

### #focus 焦点带数字卡数量

规定：卡数由 `breakpoint.focus_expand` 切换；焦点带分「行情 | 指标」两段，数字不能跨语义段混排。

| 令牌 | 值 | 用途 |
|---|---|---|
| `layout.focus_compact` | `4` | 断点以下 |
| `layout.focus_expanded` | `6` | 达到断点后 |

为什么：Q-018 明确该断点只控制焦点带密度，不改变模块栅格；D-015 要求红涨和红负在不同区块表达。
落点：`FocusBand.vue`；焦点带不进入模块库、不可移除。

## 暗色适配

- **原值 → 新值**：原纸底 / 白卡替换为背景与三层玻璃；旧浮层层级替换为工作台堆叠顺序；新增时间线 / ticker、窗口基准、抽屉高度与焦点带卡数。这些值按 T-02 令牌登记，不改写上游规范。
- **不变**：原字体三族、主站字号、间距三档、直角基卡与列宽 `minmax(0, 1fr)` 原则；圆角例外只采用上述角色。
- **不采用**：第四层玻璃、自由拖高、亮色屏幕主题、旧业务浮窗与打印几何；原因是本 feature 的范围与 D-011 已明确，不能通过补充条目扩大产品需求。
- **落点**：`frontend/src/design/tokens.json` 为唯一运行时数值源，生成物不手改；此文件解释新增角色的来历、取舍与使用边界。
