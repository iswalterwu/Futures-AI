---
id: graphs.palette.palette_dark
kind: spec
object: 墨与黛驼的暗色玻璃适配
status: current
summary: palette-core 的全部原色映射、透明度、对比度算法与使用边界
source: D:/FTEngine/design/Graphs/Palette/PALETTE_CORE.md
source_verified: 2026-10-28
migrated: 2026-10-28
adaptation: dark-glass
---
# 黛驼暗色配色登记

依据 [plan §2.1](../../specs/frontend-workbench/plan.md) 的 Q-003「A 等亮」确认结果与 T-02 [tokens.json](../../frontend/src/design/tokens.json)。[PALETTE_CORE](PALETTE_CORE.md) 是逐字保留的 FTEngine 原件；这里仅记录暗色差异，不改原色身份与色序。实现只读取生成的 `T` / CSS 变量，本文不是第二个运行时配色源。

## 原色 → 暗色值

下表覆盖原件 **`palette-core` JSON 块中 14 个不同 hex**（不是原文件全篇出现的色值，也不包括 `palette-retired`）。同一原色的各语义角色共用映射，不重复算颜色数量。α 是暗色实际绘制透明度；对比度在合成后计算，保留两位小数。

| 传统色名 | 原色 | 暗色令牌 | 暗色值 | α | 对比度 | 使用限制 |
|---|---|---|---|---|---|---|
| 墨 | `#16191D` | `chart.line_0` | `#E8E6E0` | 1 | 12.12 | 主序列；与主文字同值 |
| 茹藘 | `#A35F65` | `chart.line_1` | `#C98A8F` | 1 | 5.41 | 上一年 / 次序列；分析负值 |
| 沙饧 | `#BFA670` | `chart.line_2` | `#BFA670` | 1 | 6.42 | 原值不变，已足够亮 |
| 苍艾 | `#5A4B3B` | `chart.line_3` | `#97826C` | 1 | 4.13 | 只作线条 / 色块，不作文字 |
| 吐绶蓝 | `#4182A4` | `chart.line_4` | `#6CA7C7` | 1 | 5.76 | 序列 / 类目 / 大区 |
| 缥碧 | `#80A492` | `chart.line_5` | `#8FB8A4` | 1 | 6.89 | 图表内保持色板身份，不表示状态健康 |
| 碧落 | `#AED0EE` | `chart.line_6` | `#B0D0EB` | 1 | 9.42 | 序列末位 / 类目 |
| 青雀头黛 | `#354E6B` | `chart.pos` | `#87A1BF` | 1 | 5.68 | 分析正值 / 首类目 |
| 窃蓝 | `#88ABDA` | `chart.ord_2` | `#8BABD6` | 1 | 6.41 | 有序分档 / 地中海 |
| 驼褐 | `#7C5B3E` | `chart.region.in` | `#B08968` | 1 | 4.77 | 印度大区 |
| 明月珰 | `#D4D3CA` | `chart.other` | `#54534B` | 1 | 1.96 | 其他 / 残差，有意退后、豁免下限，不作文字 |
| 霜地 | `#C7C6B6` | `chart.band` | `#C7C6B6` | 0.16 | 1.45 | 区间带，有意退后、豁免下限，不作文字 |
| 绍衣 | `#A8A19C` | `chart.mean` | `#A8A19C` | 1 | 5.94 | 均值 / 参照，原值不变 |
| 齐紫 | `#6C216D` | `chart.model` | `#C478C3` | 1 | 4.92 | 独立模型 / 推演线 |

<a id="contrast"></a>

### #contrast 对比度方法与阈值

规定：采用 WCAG 相对亮度对比度算法，不用 HSL 明度差或色差代替对比度。基准与阈值均已登记为令牌：

| 令牌 | 值 | 含义 |
|---|---|---|
| `chart.contrast_background` | `#252629` | `glass.module.surface` 叠在 `bg.top` 的最不利单层卡面 |
| `chart.contrast_graphic` | `3` | 线条 / 色块的最小对比度 |
| `chart.contrast_text` | `4.5` | 会作文字使用的颜色的最小对比度 |

计算步骤：

1. 使用 sRGB 通道做透明度合成：`C = round(alpha × foreground + (1 − alpha) × background)`，每通道取最接近的八位整数。先合成模块玻璃与渐变顶端得到上述背景；区间带再按 `chart.band_alpha` 合成到该背景，**不能把霜地的实色对比度当作区间带结果**。
2. 每通道除以 255 得到 `s`；当 `s ≤ 0.04045` 时 `linear = s / 12.92`，否则 `linear = ((s + 0.055) / 1.055) ^ 2.4`。
3. 相对亮度 `L = 0.2126 × Rlinear + 0.7152 × Glinear + 0.0722 × Blinear`。
4. 对比度 `ratio = (max(Lforeground, Lbackground) + 0.05) / (min(Lforeground, Lbackground) + 0.05)`；内部不提前舍入，表格最终保留两位小数，阈值判断用未舍入值。

为什么：焦点带与模块是独立行，文字只落在一层玻璃上；用模块玻璃叠渐变顶端覆盖单层最不利背景，不为不存在的叠层另建模型。点睛红 `accent.red` 及同值 `status.bad` 只作非文字指示；苍艾也不可作文字。明月珰与霜地有意让位数据主体，豁免下限不代表可用来排正文。
落点：`tests/unit/design-registry.spec.ts` 复算本表；图表主题阈值验收由 T-12 的 `theme.spec.ts` 承担。

<a id="series"></a>

### #series 序列色序

规定：`chart.line_0` 至 `chart.line_6` 按墨 → 茹藘 → 沙饧 → 苍艾 → 吐绶蓝 → 缥碧 → 碧落排列，分别对应原 `palette-core.line` 的同序位置；墨亮化后与 `text.primary` 同值。序列色不透明，区间带除外。
为什么：保持最新年 / 上一年与主次序列的稳定身份，不能为暗底重新排序。Q-003 已接受七色两两最小 ΔE2000 为 13.2（亮色原版同口径 21.5）的取舍；这是色差而非对比度，chart-templates 绘制真实季节图后复核区分度。
落点：生成的 ECharts 暗色主题 `color`；至少一张样例折线使用该主题。

<a id="signed"></a>

### #signed 分析正负

规定：`chart.pos` 对应原 `pos` 青雀头黛；`chart.neg` 对应原 `neg` 茹藘，与 `chart.line_1` 同值。分析元素仍是红 = 负 / 减；取整为零时中性、不带号。
为什么：行情红涨只在 D-013 登记位置成立，不能渗透到供需、平衡表等分析语义。颜色值相同不意味着令牌作用域相同。
落点：分析数值用 `chart.pos / chart.neg`；行情价格、关注列表、焦点带行情段独立使用 `updown.*`，且只涂字色。

<a id="categories"></a>

### #categories 类目与残差

规定：`chart.cat_0` 至 `chart.cat_5` 对应原 `cat`：青雀头黛、茹藘、沙饧、吐绶蓝、苍艾、碧落；`chart.other` 对应原 `other` 明月珰。一名一色与「其他」有意退后的规则不变。
为什么：类目色序与序列色序不同，不能直接拿序列数组替代；最大类目不变成最刺眼的红色，残差不抢主体。
落点：令牌及 ECharts 主题扩展数据，为 chart-templates 保留；具体类目排名、跳红与合并规则仍由模板 feature 实现。

<a id="ordinal"></a>

### #ordinal 有序分档

规定：`chart.ord_0` 至 `chart.ord_3` 对应原 `ord`：青雀头黛、吐绶蓝、窃蓝、碧落；按表中暗色值映射，不重排身份。
为什么：分档靠同一组蓝系建立顺序，与无先后类目不同。
落点：`chart.ord_*` 登记，具体分档图归 chart-templates。

<a id="regions"></a>

### #regions 大区固定色

规定：`chart.region.*` 对应原 `region` 的同名键（令牌键用小写）；具名大区固定，不按值大小重排。

| 令牌后缀 | 原键 | 原色身份 |
|---|---|---|
| `na` | NA | 青雀头黛 |
| `latam` | LATAM | 碧落 |
| `nwe` | NWE | 吐绶蓝 |
| `med` | MED | 窃蓝 |
| `fsu` | FSU | 缥碧 |
| `me` | ME | 沙饧 |
| `afr` | AFR | 苍艾 |
| `in` | IN | 驼褐 |
| `cn` | CN | 茹藘 |
| `apx` | APX | 明月珰 |
| `eur` | EUR | 同 NWE |
| `ap` | AP | 同 APX |

为什么：同名大区在柱、面积、线和页签中必须认得出；EUR / AP 是原有别名，不增加两种原色。明月珰与苍艾的使用限制同上表。
落点：`chart.region.*`；本 feature 只登记映射，不实现大区业务图。

<a id="reference"></a>

### #reference 区间带、均值与模型线

规定：`chart.band` 对应原 `band` 霜地，实色不变，透明度由原 `band_alpha` 改为 `chart.band_alpha`（见值表 α）；`chart.mean / chart.ref` 对应原 `mean / ref` 绍衣，不变；`chart.model` 对应原 `model` 齐紫，亮化。模型线不取界面琥珀。
为什么：区间带在暗底必须退后，均值原值已有足够对比度；独立推演需要保留紫色身份，避免与「可编辑 / 待更新」的界面琥珀混义。
落点：图表令牌与生成主题；原均值点线、模型虚线等模板语法留给 chart-templates，图例透明度等未登记参数不在本 feature 擅自引入。

## 暗色适配

- **原值 → 新值 / 不变**：完整映射见唯一值表，保持原色身份；霜地通过降低 α 退后，明月珰主动压暗，其他需要的色提高亮度。主序列不再画近黑墨线。
- **不采用**：原文的浅纸底、白色中点 / 白描边与界面表格绿涨红跌作为暗色默认；原因是 D-011 / D-013 已确定暗色玻璃与行情语义分区。轴线和网格使用界面令牌，画布取 `chart.canvas` 透明。
- **不采用**：原文「深色模式另议」的搁置状态；原因是本 feature 已按 Q-003 确认等亮方案。其余图型、线型、年份循环、热力格和复制导出不在本任务实现范围，只保留原文供后续模板 feature 使用。
- **禁用不变**：退役五色仍只在原件的历史清单保留，不进入暗色值列、运行时令牌、主题或源码。UI 点睛色历史值也不获豁免。
- **落点**：`frontend/src/design/tokens.json` → 生成主题；`PALETTE_CORE.md` 不改写，本文、UI 暗色说明与产品设计文档共同限定采用范围。
