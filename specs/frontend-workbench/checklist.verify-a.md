# Feature: frontend-workbench — 第三轮定向复核（审核员 A：claude-fable-5-1）

> 只核一件事：第二轮双审指出的 15 个问题（A 的 R2-01 ~ R2-05、B 的 R2-F-01 ~ R2-F-10）在当前 HEAD 是否闭环。不重审全部清单。
> **审核对象**：分支 `feat/frontend-workbench`，HEAD `a469d77`（= 整改提交 `e19d64c` 之上只多一笔添加两份第二轮审核原件的提交；spec / plan / tasks / docs 内容与 e19d64c 相同）。整改链：`1b5659d`（Gate 1 再批准，只改 spec 头部与状态表）→ `5259fc3`（R2-01 ~ R2-05）→ `e19d64c`（R2-F-01 ~ R2-F-10，改 D-013 / plan / tasks 三份文件）。
> **本轮重读**：AGENTS.md；`checklist.claude-fable-5-1.r2.md`、`checklist.gpt-6.1-sol.r2.md`（只读）；当前 spec / plan / tasks；`docs/decisions/20261027-updown-scope.md`、`docs/decisions/README.md`、`docs/designUI.md`；三笔整改提交的完整 diff。
> **独立核验**：叠层合成面与对比度（.035 + .045 叠渐变顶端、.06 单层、抽屉叠模块）；30 个任务的依赖图（前向依赖 / 环 / 祖先集合）；新增机制（normalize、pi-raw 样本、source_anchors.json、layering 守卫）的任务归属；spec 自 1b5659d 后是否被改动（`git diff 1b5659d HEAD -- spec.md` 为空）。
> 审核日期：2026-10-27。只读审核：未安装依赖、未运行项目测试、未 commit；只新建本文件。

**结论：15 条中闭环 8、部分闭环 7、未闭环 0。** 7 个"部分"全部是整改把设计写进了 plan、但遗漏了配套同步（docs 一处、plan 内部三处矛盾、任务归属三处）；没有需求层问题，spec 冻结内容未被改动。闭环：R2-01、R2-02、R2-03、R2-04、R2-05、R2-F-01、R2-F-08、R2-F-10。部分：R2-F-02、R2-F-03、R2-F-04、R2-F-05、R2-F-06、R2-F-07、R2-F-09。

## 逐条判定

| # | 项 | 判定 | 依据 / 残留 |
|---|---|---|---|
| 1 | R2-01 mock 场景 × 方法矩阵 | **闭环** | plan §2.7 mock 段新增「场景 × 方法矩阵」：`bootstrap()` 与 `getModuleCatalog()` 在 normal / empty / error / slow 下全部成功、目录始终七个，empty / error / slow 各方法行为逐一写明，只有 boot-error 让 `bootstrap()` 首次失败（5259fc3）；tasks T-12 完成标准 3 改为"按矩阵逐格成立"；T-28 完成标准 1 / 2 据此可达。 |
| 2 | R2-02 T-28 依赖含 T-22 | **闭环** | tasks T-28「依赖：T-16、T-17、T-20、T-22、T-23、T-25」（5259fc3）；祖先集合复算含 T-22。 |
| 3 | R2-03 updown-scope 允许名单可满足 | **闭环** | plan §2.1 防线 4（第 108 行）：`sem-market` / `'market'` 字面量只许在行情模块目录、`src/workbench/FocusBand*`、`Num.vue` / `Kpi.vue`（Kpi 组合 Num）；守卫不扫 `src/contracts/`，zod 枚举与 mock 的约束改由 AC-007-4 类型测试与 fixtures 单测承担。规则现在可满足。残留两处措辞漂移见 V3-11（不影响判定）。 |
| 4 | R2-04 界面三色不入 PALETTE_DARK | **闭环** | plan §2.1 配色表点睛红 / 琥珀 / 链接蓝三行备注"登记在 `UI_COLORS.md#status_colors` 暗色适配段，不进 PALETTE_DARK"；§2.9 PALETTE_DARK 行改为"只收 palette-core 原色"并写明理由（`ui_vs_chart_colors`、`values_once`）；tasks T-04 修改范围同步（5259fc3）。令牌 source 表仍指向 UI_COLORS，一致。 |
| 5 | R2-05 焦点带错误态 | **闭环** | plan §2.3：`getDailyBrief()` 错误 → 复用 `ErrorState`（含诊断，标注"属 plan 行为，spec R-003 只要求空态"）；tasks T-28 完成标准 2 增"同一场景下焦点带显示错误态"（5259fc3）。信息级：T-20 完成标准未列错误态实现、T-28 把它挂在 AC-004-4 下未标"plan 行为"，见 V3-14。 |
| 6 | R2-F-01 plan / tasks 头部同步 Gate 1 | **闭环** | plan 第 4 行「2026-10-27 Walter 重新批准（Gate 1 通过），spec 已冻结（45 条 AC）」；tasks 第 5 行「2026-10-27 Gate 1 重新批准、已冻结；45 条 AC」（e19d64c）；与 spec 头部、`specs/README.md` 状态行一致。残留：tasks 第 4 行仍写"草案第二版"、无第三版修订记录，见 V3-10（留痕级）。 |
| 7 | R2-F-02 D-013 改为"后继 ADR"规则 | **部分** | 已改：D-013 结论 1（第 26 行）"新增位置须先新增一份后继 ADR…本文件为 accepted 历史记录，不被后续直接改写"；影响末条（第 41 行）"新增后继 ADR…本 ADR 保持原样"；与 `docs/decisions/README.md` 第 9 行"决策变更 = 新 ADR，不修改历史文件"一致。**未改**：`docs/designUI.md` 第 33 行仍为"新增位置先修订 D-013"（B 的 R2-F-02 明列此位置；e19d64c 未触碰 designUI）。两份 docs 现在互相矛盾，见 V3-01。信息级：此修正本身是对已 accepted 的 D-013 原地编辑（编辑性、决策内容不变、同日、未实现），见 V3-13。 |
| 8 | R2-F-03 回滚改为按文件 / 改动块 | **部分** | plan §6 回滚改为逐文件表（第 430–437 行），明示"不用提交级 revert"、designUI 只回退三个位置、D-013 不删除——方向正确。**残留矛盾**：第 436 行「`docs/plan.md` §3：删除 D-013 那一行」与第 437 行「D-013 不删除；在 `docs/plan.md` §3 把该行标为 superseded」对同一行给出相反动作，见 V3-02。 |
| 9 | R2-F-04 SparkSeries 四项元数据 + 与行级 Figure 一致 | **部分** | plan §2.7：`SparkSeries = {points, unit, freq, semantic, asOf, seriesId}`，zod `refine` 要求 `spark.semantic === last.semantic`、`spark.seriesId === seriesId`，并规定数值字段只许 Figure / BoardCell / SparkSeries 三种形态（e19d64c）——契约层闭环。**验证映射未同步**：plan §5 AC-007-4 行（第 408 行）仍只列 Figure 缺元数据与 BoardCell 反例；tasks T-11 完成标准 1（第 150 行）仍写"业务数值统一用 Figure"，无 SparkSeries 缺元数据 / refine 不一致的反例；B 的关闭要求明确包含这些失败样例。见 V3-07。 |
| 10 | R2-F-05 任务依赖图闭合 | **部分** | 列举四点全部成立：T-15 修改范围增 `WorkbenchPage.vue` 骨架 + 完成标准 3 + 验证命令 `AC-002-1 skeleton`（第 201 行）；T-16 依赖 T-06、T-15；T-24 依赖 T-06、T-19、T-22、T-23 且修改范围含 `MarketBoard.vue` 接线；脚本复算 30 个任务无前向 / 自依赖、无环，T-24 祖先含 T-19 / T-23，T-28 祖先含 T-22。**残留同类缺口**：T-19 修改范围（第 251 行）写 WorkbenchPage"改为装配 FocusBand + ModuleGrid"，但 `FocusBand.vue` 由 T-20 创建（第 267 行），而 T-20 依赖 T-19——合法拓扑序下 T-19 执行时 FocusBand 不存在，T-20 修改范围又不含 WorkbenchPage.vue，无人在 FocusBand 就位后接线。见 V3-08。 |
| 11 | R2-F-06 锚清单固定文件 + 双向核 | **部分** | plan §2.8 design-registry（第 327 行）：正向 + 反向双向核，锚清单以 `design/ui/source_anchors.json` 为准（记录源路径、锚名、数量、核对日期；86 锚），不依赖 `D:\FTEngine`；新适配锚须带 `new: true`——机制闭环。**任务归属缺失**：T-02 / T-03 / T-04 / T-05 修改范围均不含 `design/ui/source_anchors.json`（tasks 全文无此文件名）；T-02 完成标准 2 仍只写正向"`adopted ∪ not_adopted = source_anchors`"，无反向核与固定清单；plan §1 目录树 `design/ui/` 未列该文件；`new: true` 标记写在何处未定。见 V3-06。 |
| 12 | R2-F-07 叠层约束 + layering 守卫 + 几何断言 | **部分** | 已到位：plan §2.1 叠层约束段（第 99 行，数值独立复算一致：.035 + .045 叠渐变顶端 = `#2D2E31`，plan 写 `#2D2E30` 为逐层舍入差；弱文字 4.10、文字次 4.71、涨 4.86、跌 6.19；抽屉叠模块 `#1A1B1E`）；§2.2 工作台路由区拆"焦点带行 + 可滚动模块区"、焦点带"不是 position: sticky 覆盖层"（第 145 行）；§2.8 新增 `layering` 守卫（第 328 行）并由 T-08 承接（修改范围 / 完成标准 4 / 验证命令 4）；T-21 完成标准 5 几何断言 + 验证命令 `AC-001-3 layering`。**残留三处矛盾**：① §2.3 第 161 行仍写 `FocusBand（.glass-focus，sticky 顶部）`，与 §2.2 直接相反；② layering 守卫允许名单把"焦点带行"列为可 sticky / fixed 的玻璃容器，与"不是 sticky 覆盖层"矛盾，静态层面重新放行了约束要排除的叠层（几何 e2e 仍能兜住）；③ 第 97 行被改为".06 … 弱文字色会降到 4.6"——数值错误：4.6 是弱文字在 .045 最不利卡面 `#252629` 上的值，在 .06 的 `#292A2C` 上为 4.33，与同节第 134 行"只有 4.3"自相矛盾（e19d64c 引入的回归）。见 V3-03、V3-04。 |
| 13 | R2-F-08 已移除目标从非工作台加回 | **闭环** | plan §2.5 已移除分支：顺序固定为 `layout.add(id)` → 不在工作台则 `router.push('/workbench')` → 等待挂载（超时 2 s Toast）→ 滚动 → `data-highlight`，"可在任意路由发起，包括 `/prices`"；在布局分支同样补了"不在工作台先跳转 + 等挂载"；plan §5 AC-005-5 行写明 e2e 从 `/prices` 起点验证（e19d64c）；T-27 验证命令 `-g "AC-005-5"` 覆盖。信息级：T-27 完成标准 3（第 376 行）文字未提非工作台起点，见 V3-14。 |
| 14 | R2-F-09 pi 原始事件归约 + 六份样本 + abort 边界 | **部分** | plan §2.5「归约实现与离线验证」（第 248 行起）：`src/agent/normalize.ts` 纯函数、`tests/fixtures/pi-raw/*.jsonl` 六份样本（plain-success / retry-then-success / retry-exhausted / aborted / compaction-recovery / nested-paths）各带期望快照、断言唯一终态与 stepId 单调、MockAgentClient 运行中 `abort()` 边界；对照表 `willRetry` 补 `compaction_end.willRetry = true`（e19d64c）——设计闭环。**任务归属缺失**：tasks 全文无 `normalize`、`pi-raw`、`compaction`、`abort()` 字样；T-11 / T-13 / T-26 修改范围与完成标准均未新增这些文件与用例；plan §1 目录树 `agent/` 与 `tests/` 未列 `normalize.ts`、`fixtures/pi-raw/`；plan §5 AC-005-6 行（第 401 行）未纳入归约测试。按现任务执行，这套验证不会被任何任务产出，`ac-coverage` 也无对应标题。见 V3-05。 |
| 15 | R2-F-10 模块说明与默认跨列断言 | **闭环** | plan §5 AC-004-1 / -2 行（第 391 行）：模块库每项显示目录 `description`、默认跨列按 `defaultSpan` 生效、断言 `grid-column` 计算值；tasks T-19 完成标准 2 + 验证命令 2 `-g "AC-004-1 catalog"`（第 255 行）（e19d64c）。信息级：措辞"列数不足时截断为剩余列数"与 §2.4 `span min(跨列, 列数)` 不同义，见 V3-12。 |

另核三项用户点名的风险：**spec 冻结内容未被改动**（`git diff 1b5659d HEAD -- specs/frontend-workbench/spec.md` 为空；docs/plan.md、docs/decisions/README.md 亦未改）；**新增守卫均有任务**（layering → T-08，ac-coverage → T-29）；**plan §5 / §2.x 引用的任务号**（T-12、T-21、T-28、T-30）均存在且内容对应。

## 整改引入或暴露的新问题（V3 编号）

| # | 级别 | 位置 | 问题 | 修法（均一处改动） |
|---|---|---|---|---|
| V3-01 | 阻断（R2-F-02 残留） | `docs/designUI.md` 第 33 行 | "新增位置先修订 D-013"与 D-013 结论 1 / 影响的"新增后继 ADR、本 ADR 保持原样"矛盾 | 改为"新增位置先新增后继 ADR（取代 D-013 的位置清单）并同步本节" |
| V3-02 | 阻断（R2-F-03 残留） | plan §6 回滚表第 436 / 437 行 | `docs/plan.md` §3 的 D-013 行既要"删除"又要"标为 superseded" | 删去第 436 行的"删除 D-013 那一行"，统一为"标为 superseded 并指向后继 ADR" |
| V3-03 | 阻断（R2-F-07 残留，数值回归） | plan §2.1 第 97 行 | ".06 … 弱文字色会降到 4.6"错误；正确为 4.3（`#8F8D87` 对 `#292A2C` = 4.33），与第 134 行"只有 4.3"矛盾 | 回改为 4.3 |
| V3-04 | 阻断（R2-F-07 残留） | plan §2.3 第 161 行；§2.8 layering 第 328 行 | "sticky 顶部"与 §2.2"不是 sticky 覆盖层"矛盾；守卫允许名单含"焦点带行" | §2.3 删"sticky 顶部"；layering 允许名单只留 `.glass-drawer` 面板 / 抽屉 / Toast，焦点带行注明"独立行、非 sticky" |
| V3-05 | 阻断（R2-F-09 残留） | tasks T-11 / T-13 / T-26；plan §1 目录树、§5 AC-005-6 | `normalize.ts`、`tests/fixtures/pi-raw/*.jsonl`、归约单测、abort 边界用例无归属任务 | 扩 T-13（修改范围 + 完成标准 3"六份样本归约、唯一终态、stepId 单调、abort 边界"+ 验证命令 `-t "AC-005-6 normalize"`）或新增 T-13b；plan §1 / §5 同步 |
| V3-06 | 阻断（R2-F-06 残留） | tasks T-02 / T-03；plan §1 目录树 | `design/ui/source_anchors.json` 无归属任务；T-02 完成标准 2 无反向核与固定清单；`new: true` 标记落点未定 | T-03 修改范围加该 json（86 锚 + 核对日期）；T-02 完成标准 2 加"双向核 + 以 json 为准 + 反向漏锚阳性样例"；plan §2.8 写明 `new: true` 放条目 front matter 的 `adopted` 项 |
| V3-07 | 建议（R2-F-04 残留） | plan §5 AC-007-4 第 408 行；tasks T-11 第 150 行 | SparkSeries 缺元数据 / refine 不一致的反例未列入验证；T-11"统一用 Figure"措辞过时 | 两处各加一句：SparkSeries 缺任一元数据、`semantic` / `seriesId` 与行级不一致 → parse 失败；T-11 改"统一用 Figure / BoardCell / SparkSeries 三种形态" |
| V3-08 | 建议（R2-F-05 残留） | tasks T-19 第 251 行；T-20 第 267 行 | T-19 "装配 FocusBand + ModuleGrid"早于 FocusBand.vue 的创建者 T-20 | T-19 改"装配 ModuleGrid（焦点带保留 T-15 占位）"；T-20 修改范围加 `WorkbenchPage.vue`（以 FocusBand 替换占位） |
| V3-09 | 建议 | tasks AC 覆盖矩阵 | AC-002-1 漏 T-15（skeleton 用例）；AC-001-3 漏 T-21（layering 几何）；AC-006-2 漏 T-08（layering 守卫） | 三行补任务号 |
| V3-10 | 留痕 | tasks 第 4–5 行 | 仍写"草案第二版"，无第三版修订记录（plan 已写"第三版"） | 改"草案第三版"并补一句修订记录 |
| V3-11 | 留痕 | plan §2.1 第 108 行；tasks T-08 第 109 行 | "三个行情模块目录"实为两个目录 + FocusBand；T-08 括注"usage 限三处与 `Num.vue`"未同步 Kpi.vue 与 contracts 排除 | 分别改"两个行情模块目录"、"usage 按 plan §2.1 防线 4（含 Kpi.vue、排除 src/contracts/）" |
| V3-12 | 留痕 | plan §5 第 391 行；tasks T-19 第 255 行 | "截断为剩余列数"与 §2.4 `span min(跨列, 列数)` 不同义（CSS grid 遇剩余列不足是换行而非截断） | 统一为"跨列取 min(defaultSpan, 当前列数)" |
| V3-13 | 信息 | `docs/decisions/20261027-updown-scope.md`（e19d64c） | 为落实"不改历史 ADR"而原地编辑了已 accepted 的 D-013（第 26 / 41 行）；编辑性、决策内容不变、同日、未实现，B 的 R2-F-02 明确要求如此 | 可接受为勘误；建议 Walter 在 Gate 2 前知悉；另"取代本 ADR 的位置清单"属局部取代，README 模板只有整体 `superseded by`，后继 ADR 落地时按 README 口径写状态即可 |
| V3-14 | 信息 | tasks T-20、T-27 第 376 行、T-28 完成标准 2 | T-20 完成标准未列焦点带错误态；T-27 完成标准 3 未提非工作台起点；T-28 把焦点带错误态挂在 AC-004-4 下未标"plan 行为" | 各补半句；不影响验证命令 |
| V3-15 | 信息 | plan §6 第 430 行 | 表头"対象"为日文汉字 | 改"对象" |

## 复核结论与下一步

1. 15 条中 8 条闭环、7 条部分；未出现"未闭环"。7 个部分项都是 plan 已写对设计、但遗漏同步：docs 一处（V3-01）、plan 内部矛盾三处（V3-02 / V3-03 / V3-04）、任务归属两处（V3-05 / V3-06）、验证映射一处（V3-07）；加上 V3-08 的提供者顺序，共 8 处一句话级修订。
2. 修订后由 A / B 对同一基线做最后一轮定向确认，再合并共识 `checklist.md`；此后按 AGENTS §2 进入 Analyze / Implement。Gate 1 已批准，无需再请 Walter 签字；V3-13 建议在 Gate 2 前让 Walter 知悉。
3. 本会话只新建 `specs/frontend-workbench/checklist.verify-a.md`；未修改任何既有文件，未安装依赖、未运行项目测试、未 commit。
