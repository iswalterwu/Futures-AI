# UI 规范资产索引

本目录按 [frontend-workbench 的移植规则](../../specs/frontend-workbench/plan.md) §2.9 建立，产品设计权威为 [designUI](../../docs/designUI.md)。只导航，不复制令牌数值。

## 来源与采用范围

| 条目文件 | 来源路径（只读） | 移植日期 | 本 feature 采用范围 |
|---|---|---|---|
| [UI_FOUNDATIONS](UI_FOUNDATIONS.md) | `D:/FTEngine/design/UI/Foundations/UI_FOUNDATIONS.md` | 2026-10-28 | 数据第一、三族分工、双语、空与零、颜色语义、单一来源；纸底改暗色玻璃 |
| [UI_COLORS](UI_COLORS.md) | `D:/FTEngine/design/UI/Colors/UI_COLORS.md` | 2026-10-28 | 界面 / 图表分色、点睛 / 琥珀 / 链接、状态与图周边暗色映射 |
| [UI_FONTS](UI_FONTS.md) | `D:/FTEngine/design/UI/Fonts/UI_FONTS.md` | 2026-10-28 | 三族字体栈、全量主站字号、KPI 唯一例外与字重角色 |
| [UI_LAYOUT](UI_LAYOUT.md) | `D:/FTEngine/design/UI/Layout/UI_LAYOUT.md` | 2026-10-28 | 侧栏宽、断点、模块栅格、三档间距、基准圆角；无裸列宽豁免 |
| [UI_COMPONENTS](UI_COMPONENTS.md) | `D:/FTEngine/design/UI/Components/UI_COMPONENTS.md` | 2026-10-28 | 迷你折线、新鲜度点、四态徽章与加载 / 空 / 错误态 |
| [UI_CARDS](UI_CARDS.md) | `D:/FTEngine/design/UI/Cards/UI_CARDS.md` | 2026-10-28 | 基卡结构、标题 / 副标 / 右注、CK-CARD 思路迁为模块壳契约 |
| [UI_TABLES](UI_TABLES.md) | `D:/FTEngine/design/UI/Tables/UI_TABLES.md` | 2026-10-28 | 通用表、盘面网格、三态格、数字对齐与语义分区 |
| [UI_NAV](UI_NAV.md) | `D:/FTEngine/design/UI/Navigation/UI_NAV.md` | 2026-10-28 | 当前项与单一导航来源原则；旧双台改九项路由（作业 / 格物致知，无专题子项） |
| [UI_DARK_ADDITIONS](UI_DARK_ADDITIONS.md) | `specs/frontend-workbench/plan.md` + `frontend/src/design/tokens.json`（本 feature 新增） | 2026-10-28 | 背景、玻璃、补充字号、圆角例外、层级、窗口、抽屉与焦点带 |

## 阅读与追溯约定

- 八份移植条目保留原 `id`、`verified`、原文「规定 / 为什么 / 落点」和 JSON 碎片；新增 front matter 的 `source` 为实际只读来源，`source_verified` 为本次核读日期，`migrated` 为移植日期，`adaptation` 标记暗色玻璃适配。原工程的 `anchors / tests / depends_on` 与 `design:` 引用是历史索引，不声称这些实现存在于本仓库。
- **本 feature 只采用文末「暗色适配」声明的范围**；未采用项及原因同段列出。旧纸底、Plotly、静态 HTML 导航与生成碎片是原文快照，不能直接导入运行时，也不在此继续生成或手改旧产物。
- `### #条目名` 保留上游语义锚名；被令牌 `source` 引用的条目前另有同名 HTML 锚，兼顾原编号与 Markdown 跳转。补充条目也使用具名锚。`docs/designUI.md#节号` 按该文件的编号标题解析，不要求改写产品文档的锚。
- 活跃数值唯一来源：[tokens.json](../../frontend/src/design/tokens.json)，实现消费生成的 `T` / `--fai-*`。原值与适配理由在条目留档；不得从原碎片重新生成一套运行时令牌。
- 图表数据色单独见 [图表资产索引](../charts/README.md)，不把界面色混入 `palette-core`。

## 验证入口

在仓库根执行 `pnpm -C frontend test:unit -t "AC-008-1 registry"` 核对条目元信息、结构与索引；执行 `pnpm -C frontend test:unit -t "AC-008-2 sources"` 逐条解析真实令牌来源。测试只依赖仓库内资产，不要求安装 FTEngine 或访问原机路径。
