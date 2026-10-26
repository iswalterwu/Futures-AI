# Futures-AI 全局设计理念（designUI.md）

> 设计语言的权威入口。规范细节（数值、规则）以 `specs/` 移植资产为准；本文只定义理念与组织方式。

## 1. 设计原则

1. **数据第一**：界面是数据的载体，装饰不抢数据；每个数字可追溯出处
2. **克制**：颜色不刺眼、最大色块不抢戏、整份报告统一（源自 FTEngine 配色定版要求）
3. **中国色 DNA**：配色出自《中国传统色：故宫里的色彩美学》，核心体系「墨 + 黛驼」
4. **品种无关的设计语言 + 品种定制内容**：底座 UI 与图表语法跨品种统一，油品内容在语言之上定制

## 2. 配色系统（移植自 FTEngine PALETTE_CORE，2026-10-02 定版）

### 2.1 核心令牌（节选，完整以 specs/ 为准）

| 令牌 | 色值 | 色名 | 用途 |
|---|---|---|---|
| ink | `#16191D` | 墨 | 主序列线、正文 |
| red | `#A35F65` | 茹藘 | 公司红：负值/减、重点点缀，不铺大面积 |
| pos | `#354E6B` | 青雀头黛 | 正值/增、类目首色 |
| line 序列 | 墨 → 茹藘 → 沙饧 `#BFA670` → 苍艾 `#5A4B3B` → 吐绶蓝 `#4182A4` → 缥碧 `#80A492` → 碧落 `#AED0EE` | — | 多序列排位 |
| band | `#C7C6B6` | 霜地 | 区间带（α 0.3） |
| mean | `#A8A19C` | 绍衣 | 均值参考（点线） |
| model | `#6C216D` | 齐紫 | 模型/推演线 |

### 2.2 使用规则

- 全站黛驼基调、序列墨领头、红用茹藘、填色一律不透明
- 退役色禁用：朱 `#C00000`、骐驎 `#12264F`、群青 `#2E59A7`、石绿 `#206864`、茈藐 `#A67EB7`
- 分档色阶（ord/heat）、区域色（region）随 specs 移植

## 3. 图表系统

### 3.1 kind 枚举（14 种，完整定义随 specs 移植）

season-daily（日/周度年份叠线）· season-monthly（月度年份叠线）· season-phase（合约年相位）· line（非年份时间序列）· dual（双 y 轴）· bar（全正值柱）· hbar（横条排序）· bar-signed（正负柱）· stack（类目堆叠柱）· area（堆叠面积）· scatter-fit（散点+拟合）· band（区间带）· heat（热力格）· table（四式表格）

### 3.2 ECharts 实现约定

- 每 kind 一个渲染函数（对应 FTEngine FTK 的 plot/season/monthly，按 ECharts 重写）
- 图内字体/浮窗/格式（日期、数字、单位）规范随 specs/charts 移植
- 两级浮窗、复制钮、整卡截图沿用 FTEngine 交互规范
- 图表体检规则（CK 前缀）移植为 ECharts 版 chart_lint

### 3.3 期货交易图表

- K 线等金融图表优先 ECharts candlestick + dataZoom；盘口级需求再引入 KLineChart（同设计语言）

## 4. chart-spec 声明式模型

- 图表 = `{template_id, series_bindings, overrides}`；编译产物 = ECharts option JSON
- **v1 固定模板**：模板库只读，绑定数据即出图
- **v2 用户自定义**：编辑器改 overrides（轴、配色、格式、叠加序列），spec 可保存/共享
- agent 生成图表 = 产出 spec；溯源 = spec 中每个 series_id 可查

## 5. UI 组件与布局（移植自 FTEngine design/UI）

- 卡片家族与图卡契约、卡高档位
- 表格四式：通用表、盘面网格、卡内小表、大平衡表/季度表
- 组件：胶囊、徽章、灯、芯片、页签、脚注、浮层、空态
- 界面色令牌（CSS 变量）、字体栈（三族分工）、字号阶梯、间距圆角
- 桌面适配：侧栏导航、窗口/托盘、设置页、日报页

## 6. 日报设计理念

- **个性化呈现**：按用户关注点 + 用户自己的分析逻辑组织，而非供应商通稿；结论先行 → 图表证据 → 数据溯源
- v1 固定模板（版式、栏目、图表位）；v2 用户可配（栏目增删、逻辑顺序、图表属性）
- 每条结论可追溯到系列数据与来源（溯源是设计元素，不是隐藏元数据）

## 7. 规范资产移植计划

- `design/charts/`：FTEngine design/Graphs 各条目文件（Base/Kinds/Palette/Seasonal/Tooltip/Formats/Copy/Lint_Rules）
- `design/ui/`：FTEngine design/UI 各条目文件（Layout/Cards/Tables/Colors/Fonts/Components/Foundations）
- 原则：实现对应模块时按需逐份搬运并登记，不一次性搬空；每份保留原条目 id 与"为什么"
- 注：`specs/` 目录留给功能规格（spec-driven 工作流，见 AGENTS.md §2），规范资产统一放 `design/`
