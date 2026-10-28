# frontend-workbench v2 — 独立只读 Analyze（恢复后，HEAD `5ba40ad`）

> **模型与通道**：`claude-opus-5-5` via `anthropic`。协调器已做过最小真实调用探活：bridge 返回额度或限流类失败，同模型走 anthropic 返回正常。本会话只换了通道，没有重试 bridge，也没有改配置。
> **角色**：由协调器新开的独立会话。我不是审核员 A，不是 Plan/Tasks 作者，也不是 Implement 实施者。
> **只读**：没有写任何文件，没有提交或 push；没有安装依赖，也没有运行 pnpm、测试或应用。建议协调器把本报告原样存为 `specs/frontend-workbench/analyze-v2-r5.md`。

## 结论

**Analyze 不通过：有 2 个 P2、3 个 P3，现在还不能开始实施。** spec、plan、tasks 的结构是一致的，问题出在复核对象、设计资产和状态记录上。建议修完 F-01～F-05 后再跑一轮只读 Analyze，然后交给 A 定向复核。

## 已核实的内容

- **代码和权威文档没有被改动**：`frontend`、`design`、`docs`、`backend`、`AGENTS.md` 与 `43b6d79` 完全一致。
- **v1 Handoff 的位置正确**：`43b6d79` 已在 main / origin/main 上，main 之后没有新提交；`43b6d79`、`eb6ebd8`、`d1c2133`、`1642216` 都在 HEAD 的历史里。
- **spec 和两份清单都没动**：spec 与 `fec3556` 一致；`checklist.md`、`checklist-v2.md` 与 `f1f755b` 一致。
- **两个新工作树干净**：`feat/frontend-workbench-v2-s0` 和 `integration/frontend-workbench-v2` 都停在 `43b6d79`，没有未提交改动。
- **任务结构完整**：
  - 12 个任务，共 22.0 h，每项 1～2 h，依赖都指向更早的任务，没有环。
  - 每个任务的完成标准数和验证命令数一一对应（5/5、4/4、3/3、3/3、4/4、4/4、4/4、2/2、4/4、3/3、9/9、3/3）。
  - 完成标准引用的 AC 合起来正好是 spec 的 52 条，没有缺也没有多；矩阵 52 行，所有任务引用都有效。
- **tasks 描述的 v1 事实与代码相符**：`Rail.vue`、`stores/app.ts`、`PlaceholderPage.vue`、`shell.spec`、`agent.spec` 中与 research 相关的位置，以及窄窗用 `flex-wrap: wrap`，都和 `43b6d79` 一致。README 第 33 行的引用也有效。
- **`5ba40ad` 只改了记录**：HANDOFF、README 和 tasks 中的状态记账，没有改设计、任务内容或 AC 映射。`git diff --check` 通过。

## 发现

| # | 级别 | 位置 | 发现 | 建议修法 |
|---|---|---|---|---|
| F-01 | **P2** | tasks 1.1「A 定向复核」行、§9 第 3 步、§5 闸门 2(a)；对照 T-V2-01 状态行、README 第 24 行、HANDOFF、v2 页首 | **A 该复核哪个提交，文档里说法不一。** 1.1 和 §9 写的是「A R3 固定到 R3 落盘提交」，也就是 `d1c2133`；状态行写的却是「恢复修订与 v1 合并后」。`d1c2133` 不包含三样东西：<br>• `eb6ebd8` 的合并：plan §1～§6 换成了 Handoff 版本（含 `deltaDecimals`），v1 任务段换成了 T-16 / T-17 和 P3 台账（含 H-02）；<br>• R4 的记账；<br>• `5ba40ad` 的集成人和工作树登记。<br>如果 A 按 1.1 去审 `d1c2133`，闸门 2 可能用一份过时的复核放行。 | 三处统一改为：A 固定复核「本轮 Analyze 修正落盘后的提交」，范围是 `ded7161..该提交`，含 R3、R4、`5ba40ad` 和本轮修正。闸门 2(a) 的「本轮」改成写明具体对象。 |
| F-02 | **P2** | `design/ui/UI_NAV.md:116`（暗色适配段）、`design/ui/README.md:16`；对照 `docs/designUI.md` §3.1 和第 198 行、plan §7.2、tasks §4 | **移植的导航条目和 v2 冲突，而且没有任务负责改。** `UI_NAV.md` 仍写「固定八项…专题研究子项来自 `getResearchList()`」，README 写「八项路由与研究扩展」。权威的 designUI 写的是九项，并且把 UI_NAV 指为导航的登记处。plan §7.2 和 tasks §4 在 `design/ui` 下只登记了 `UI_DARK_ADDITIONS.md`。spec R-008 / §4 要求视觉决定登记到条目中；AGENTS 规定方案变更先改文档再动实现。<br>另外，1.1 的 G-02 行只写了「改为横向滚动时改 plan」。如果 Walter 裁定保持换行，也需要在 `UI_LAYOUT.md` 暗色适配段为 `#narrow`「横向滚动」登记「不采用 + 原因」。 | plan §7.2 加一行：`design/ui/{UI_NAV.md,README.md}` 由壳写入；G-02 裁定保持换行时，`UI_LAYOUT.md` 暗色适配段也由壳写入。T-V2-01 的修改范围和完成标准同步补上（引用 AC-002-2 / AC-008-1）。G-02 行写明两种裁定各自要做什么。属于 plan 小改，要随 F-01 一起交 A 复核。 |
| F-03 | P3 | tasks §5 闸门 4、1.1「最近一轮 Analyze」行 | 闸门 4 仍把 R2 当作最近一轮，没提 R3 / R4，也没写 T-V2-01 要求的「合并后独立 Analyze」；1.1 只登记到 R3。 | 登记本轮 R5 和复跑结论。闸门 4 改为「R5 的 F 项关闭，并经复跑确认」。 |
| F-04 | P3 | tasks 1.1「设计依据」行写 §7 小改「未审」；plan §7.0 写「这些小改未经审核」；v2 页首写「草案，需等 Analyze 和 A 定向复核」 | 这些说法已经过时：A R2（`f1f755b`）已审过 `949a232`，其中包括这些小改。留着会让 A 搞错复核范围。 | 补一句：A R2 已审到 `949a232`，还没审的增量从 `d1c2133` 起。 |
| F-05 | P3 | plan 页首和 tasks v2 页首的 R3 / R4 行；`analyze-v2-r3/r4` 页首 | 这些记录写着「会话由用户以该通道启动；本会话未探 bridge」。实际情况是协调器派出的会话，而且 bridge 探活因额度或限流失败。AGENTS §6 第 4 条要求在产物头部记录实际通道和切换原因，目前只有 HANDOFF 改正了。 | 在 plan 和 tasks 的 v2 页首各加一行更正（脱敏写法）。历史报告不改原文，可以加一条指向更正的注记。 |

## 观察（不计入判定）

- **O-1**：实施树和集成树都建在 `43b6d79` 上，还不含 v2 规格文件。这符合 plan §7.0「实现分支从 Handoff SHA 建立」。S0 开工前，需要先同步到 A 复核过的规格提交；`43b6d79` 在 HEAD 的历史里，可以快进。
- **O-2**：集成人 `gpt-6.1-sol` 也是 A 的第二回退模型。如果 A 回退到 Sol，就和集成人同模型。这不违反 §6 第 3 条（只要求与实施模型不同），但发生时应记录下来。
- **O-3**：根目录的 `HANDOFF.md` 在 main 上没有。v2 Handoff 合入 main 时，要决定它是保留还是移走，以免和其他 feature 冲突。
- **O-4**：G-01 仍未解除：互动方两个工作树都停在 `8af343f`，H-1～H-6 和页面切片都还没交付。S1 / S2 继续 blocked，外部阻塞不解除时 Converge 只能报「未收敛（外部阻塞）」。

## 下一步

1. Plan/Tasks 作者修 F-01～F-05：只改文档，spec 不动。其中 F-02 是 plan §7.2 加一行加 T-V2-01 扩范围，属于小改。
2. 再跑一轮只读 Analyze，确认这些问题都已关闭。
3. A 新开独立会话，复核 F-01 定下的那个固定提交。
4. Walter 裁定 G-02。
5. 以上都满足后才能开始 S0（T-V2-01 → T-V2-02）。