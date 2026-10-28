# 图表规范资产索引

本次仅移植配色，为 chart-templates 预留；不迁入完整图型、浮窗、复制或体检实现。设计权威为 [designUI](../../docs/designUI.md)，实施机制见 [frontend-workbench plan](../../specs/frontend-workbench/plan.md) §2.1 / §2.9。索引不复制配色数值。

| 条目文件 | 来源路径（只读） | 移植日期 | 采用范围 |
|---|---|---|---|
| [PALETTE_CORE](PALETTE_CORE.md) | `D:/FTEngine/design/Graphs/Palette/PALETTE_CORE.md` | 2026-10-28 | 逐字原件：核心色身份、色序、语义与退役清单，保留原 id / JSON / 历史理由 |
| [PALETTE_DARK](PALETTE_DARK.md) | 上述原件 + `specs/frontend-workbench/plan.md` §2.1 + `frontend/src/design/tokens.json` | 2026-10-28 | Q-003 确认的暗色映射、对比度算法与阈值、序列 / 正负 / 类目 / 分档 / 大区 / 参照来源锚 |

## 原件与适配边界

- `PALETTE_CORE.md` 保持来源文件全部字节不变，包括 front matter、退役色与历史语义；为保留原件，不向它追加移植元信息或暗色段。本索引记录来源和日期；2026-10-28 已核读原件，`PALETTE_DARK.md` 的 front matter 记录同次核读与适配。
- 原文声称的旧工程权威范围、Plotly、纸底、白描边、界面绿涨红跌和「深色另议」均是历史记录；Futures-AI 的实际采用边界看 `PALETTE_DARK.md` 文末「暗色适配」与 [UI 适配](../ui/README.md)，不以原件覆盖 D-011 / D-015。
- 暗色值表按原件 `palette-core` JSON 块的不同 hex 去重覆盖全部颜色；不统计 `palette-retired`、正文示例或界面色。透明区间带按合成后的颜色核对比度，残差与区间带的豁免有明确理由。
- 活跃数值来自 [tokens.json](../../frontend/src/design/tokens.json)，代码只用生成物；原件仅作溯源，不直接作为暗色主题输入。序列顺序与色差取舍见 [series](PALETTE_DARK.md#series)，计算方法见 [contrast](PALETTE_DARK.md#contrast)。

## 验证入口

在仓库根执行 `pnpm -C frontend test:unit -t "AC-008-3 palette"`，读取本仓库原件与暗色表，核对原色完整覆盖、令牌值、透明度与对比度；执行 `pnpm -C frontend test:unit -t "AC-008-2 sources"` 验证令牌引用的章节锚。测试不访问 FTEngine 源目录。
