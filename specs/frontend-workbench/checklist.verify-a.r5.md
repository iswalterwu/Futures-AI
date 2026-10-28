结论：11 项中闭环 8、未闭环 3（第 2 / 7 / 8 项；三处残留全部是 tasks.md 里一句话级的同步遗漏）。脚本核验全部通过（30 任务无前向依赖与环、45 AC 在完成标准 / 矩阵 / plan §5 三处全覆盖、任务号引用全部存在、工时 48 = 48）。第 11 项按条款文本判闭环，但该条款**不在本分支基线**（见 R5-NEW-A-01）。

# frontend-workbench 第五轮定向确认（审核员 A）

## 通道与基线

- **审核员**：A = `claude-fable-5-1` **via anthropic**（`--model anthropic/claude-fable-5-1`；会话内 `PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`）。**切换原因**：`claude-bridge` 通道因账户周额度耗尽不可用，按用户指示改走 Anthropic API 通道；同为 Claude 模型本身，只换接入路径，审核员身份不变。
- **基线**：分支 `feat/frontend-workbench`，HEAD **`c1eb518`**（整改提交，4 文件：D-013 +4、plan 10 处、tasks 14 处、B 第四轮原件新增）；工作区干净，`git log --oneline -6` = c1eb518 → d7d7494 → a469d77 → e19d64c → 5259fc3 → 1b5659d。冻结 spec 自 `1b5659d` 未动（blob `9e18344d…`，45 条 AC）。
- **本轮重读**：AGENTS.md（本分支版本；另读 `feat/settings-v1` 的 `e0eec7b` 版本以核第 11 项）；`checklist.verify-a.md`（A 第三轮 V3）、`checklist.verify-b.md`（B 第三轮 NEW-B）、`checklist.verify-b.r4.md`（B 第四轮）；当前 spec / plan / tasks；`docs/designUI.md`、`docs/decisions/20261027-updown-scope.md`、`docs/decisions/README.md`、`docs/plan.md` §3；`git show c1eb518 --stat` 与完整 diff。
- **口径**：二元判定；原关闭要求仍有遗漏即"未闭环"，并写明残留位置与修法。只核用户点名的 11 项，不重审清单。只读审核：未安装依赖、未运行项目测试、未 commit；只新建本文件。行号均为 c1eb518。

## 逐项判定

| # | 项 | 判定 | 依据 / 残留 |
|---|---|---|---|
| 1 | NEW-B-01 回滚整文件恢复的前置条件 | **闭环** | plan §6 回滚表 `:435`：**前置** = `git diff <feature 开工前提交> HEAD -- docs/designUI.md` 只含本 feature 改动时才可整文件 `git checkout`，否则只回退三个块（§2.1 玻璃边注、§2.2 作用域段、T-30 指针）、不用整文件恢复；`:436–437` 对 docs/plan §3 的 D-013 行统一"保留 + 标 superseded + 指向后继 ADR"，与 `docs/plan.md:40` 该行存在一致。B 第四轮两点要求均满足。 |
| 2 | NEW-B-03 / V3-07 SparkSeries 同步（plan §2.7 总则、§5、T-11、T-23 输入链） | **未闭环** | 已改三处：plan §2.7 `:295` 总则"凡业务数值都经 `Figure` / `BoardCell.figure` / `SparkSeries` 三种形态"；`:300` refine + 缺任一元数据 / semantic / seriesId 不一致 → parse 失败；§5 `:408` 反例含 SparkSeries；tasks T-11 完成标准 1 `:152` 改为三种形态并列出 SparkSeries 不一致反例。**残留**：T-23（`:323–336`）上下文 / 修改范围 / 完成标准 1 仍只写"DataTable + Spark、迷你折线墨线 + 末点"，未写明 `Spark.vue` / `Watchlist.vue` 的输入为契约 `SparkSeries`（非裸 `number[]`）——B 三轮 NEW-B-03"统一 Spark 输入解析链"与 B 四轮"T-23 也未明确新输入链"均点名此处，c1eb518 未触碰 T-23。修法：T-23 完成标准 1 加半句"Spark 输入为 `WatchlistTable.rows[].spark: SparkSeries`（plan §2.7），不另造裸数组入口"。 |
| 3 | NEW-B-05 T-21 顶部 / 中段 / 底部三处采样 | **闭环** | tasks T-21 完成标准 5 `:302`："滚动过程中分顶部 / 中段 / 底部三个采样位置，按可见裁剪区判定（模块壳矩形 ∩ 滚动容器矩形），断言与焦点带矩形不相交"，验证命令 5 `-g "AC-001-3 layering"`；与 plan §2.1 `:99`"滚动过程中"、§2.3 `:161` 独立行非 sticky、`:97` / `:134` 的 4.3 一致。NEW-B-05 全部关闭要求（裁剪语义、代表位置、sticky 描述、对比度笔误）已满足。plan `:99` 括注措辞未带"可见裁剪区"，信息级，见 R5-NEW-A-03。 |
| 4 | V3-11 行情模块目录数量与 updown 名单措辞 | **闭环** | plan §2.1 防线 4 `:108`："两个行情模块目录（`market-board/`、`watchlist/`）、`src/workbench/FocusBand*`、`Num.vue` / `Kpi.vue`…守卫不扫 `src/contracts/`"；tasks T-08 完成标准 2 `:111`："imports 限两处行情模块目录 + 焦点带行情段、usage 按 plan §2.1 防线 4：含 `Num.vue` / `Kpi.vue`、排除 `src/contracts/`"。两处名单与防线 3 / 4 同义，不再各给一份。 |
| 5 | V3-12 plan §5 跨列措辞与 §2.4 一致 | **闭环** | plan §5 AC-004-1 / -2 行 `:391`："默认跨列取 `min(defaultSpan, 当前列数)`（断言 `grid-column` 计算值）"；与 §2.4 `:179` `grid-column: span min(跨列, 列数)` 及 tasks T-19 完成标准 2 `:261` 三处同义，"截断为剩余列数"已删。 |
| 6 | V3-13 D-013 勘误记录 | **闭环** | D-013 `:43–45` 新增 `## 勘误`：日期、**编辑性**定性、改动位置（结论 1 与影响末条）、原因（与 README"不修改历史文件"相抵）、决策内容不变、不构成对 D-011 结论 6 的重新裁定、于 Checklist 复核指出并"在 Gate 2 前如实记录"；状态 `:4` 仍 accepted（无取代，正确）。满足 B 三轮"明确记录的勘误"形式；**Walter 在 Gate 2 对该勘误的知悉 / 确认是人工动作**，文档侧已无缺口。勘误文字"四个位置的清单"与结论 1 / designUI §2.2 / docs/plan.md §3 的三个位置不符，留痕级，见 R5-NEW-A-02。 |
| 7 | R4-NEW-B-01 锚集合等式只取原锚 + 新锚 `new: true` 另核 | **未闭环** | plan §2.8 design-registry `:327` 已补"**集合等式只取原锚**：`{x | x ∈ adopted ∪ not_adopted, !x.new} = source_anchors`，新锚另核 `new: true` 与正文对应，不得写进 86 条原锚清单凑等式"——plan 侧闭环。**残留**：B 同时点名的 tasks T-02 完成标准 2 `:39` 未同步，仍写无过滤的"正向 `adopted ∪ not_adopted = source_anchors`"（按字面实现即 B 的反例：合法新锚进入 adopted 后等式必败），且 fixtures 列表只有"同步漏锚""正文漏分类"两个阳性样例，缺 B 要求的"合法新增锚（`new: true`）通过"阴性样例；c1eb518 未触碰 T-02。修法：`:39` 等式改为"未带 `new: true` 的项 = source_anchors（plan §2.8）"，fixtures 加一条阴性"含合法新锚的条目通过"。 |
| 8 | R4-NEW-B-02 T-13 完成标准 4 / T-20 完成标准 7 的 AC 标注、T-03 矩阵映射 | **未闭环** | 已改两处：T-13 完成标准 4 `:185` 加"（AC-005-6，abort 边界）"，与验证命令 4 `-t "AC-005-6 abort"` 对应；T-20 完成标准 7 `:282` 加"落 AC-003-3 的空 / 错误态分支，AC-003-3 仍只要求空态文案"，保留"plan 行为，非 spec 要求"。**残留**：T-03 → AC-008-2 的映射未入矩阵 AC-008-2 行——`:466` 仍为 `T-02、T-06`；c1eb518 只在 AC-008-1 行 `:465` 末尾追加括注"（AC-008-1 / AC-008-2 双向核）"，括注落在另一行、也未指明属于哪个任务，按行读矩阵仍得不到 T-03 ↔ AC-008-2（脚本 CRITERIA_VS_MATRIX 报出 `('T-03','AC-008-2')`）。修法：`:466` 改为 `T-02、T-03、T-06`，`:465` 括注可删。 |
| 9 | R4-NEW-B-03 工时汇总与逐项合计一致 | **闭环** | tasks 末行 `:471`"合计 30 个任务，预计约 48 小时"；脚本逐项求和 = 48.0 h（T-13 为 2 h），30 项全部在 0.5–2 h 内。 |
| 10 | D-013 勘误新增段与 `docs/decisions/README.md` 规则相容 | **闭环（相容）** | README `:9`"决策变更 = 新 ADR，不修改历史文件"针对**决策变更**；勘误段明示决策内容不变、状态仍 accepted、未取代任何编号，模板必含节（背景 / 备选 / 结论 / 取舍 / 影响 / 日期）齐全，README 未禁止追加节。它把 e19d64c 那次原地编辑从"无记录改动"变为"自述改动"，比无记录更符合"历史可追溯"的目的；另开一份 ADR 记一处措辞更正反而不合比例。信息级：README 没有定义"编辑性勘误"机制，建议后续在 README 补一句（见 R5-NEW-A-04，docs 维护，非本 feature 阻断）。 |
| 11 | AGENTS.md 审核员通道条款清晰、可执行、与本次执行一致 | **闭环（条款文本）** | 条款文本（`feat/settings-v1` 提交 `e0eec7b`，AGENTS.md `:52–55`）：优先 `claude-bridge/claude-fable-5-1`，不可用（额度耗尽、鉴权失败、launcher 异常等）改走 `anthropic/claude-fable-5-1`，同为 Claude 模型、身份不变，每轮 checklist 头部记录实际通道与切换原因——触发条件、两条命令行、记录格式都可直接执行；本会话 `PI_PROVIDER=anthropic` / `PI_MODEL=claude-fable-5-1`、切换原因 = 周额度耗尽，本文件头部已按格式记录，**与条款一致**。**但本分支基线 c1eb518 的 AGENTS.md 无此条款**（`git diff HEAD feat/settings-v1 -- AGENTS.md` 显示该段只在 e0eec7b；e0eec7b 不是 HEAD 祖先），本分支上"每步重读 AGENTS.md"读不到它，见 R5-NEW-A-01。 |

## 一次只读脚本核验（`python -B` 内存脚本，不写文件）

任务按 `### T-xx` 切块；依赖展开 T-29 的 `T-01 ~ T-28` 区间并去重，做位置比较 + DFS；AC 只从各任务"完成标准"段抽取；矩阵与 plan §5 展开区间（`AC-003-1 ~ AC-003-6`）与简写（`AC-004-1 / -2`）；任务号引用与 30 个任务比对；工时逐项求和与末行比对。

```text
BASELINE c1eb51865f3c0e375f13fce344760a1f45480555
SPEC_AC count=45 (blob 9e18344d…, unchanged since 1b5659d)
TASK_DAG tasks=30 unique_edges=81 missing=[] forward=[] self=[] cycles=[]
FOCUS_HANDOFF T-15 deps=[T-10,T-12]; T-19 deps=[T-15,T-18]; T-20 deps=[T-19]; T-21 deps=[T-19,T-20]
ANCESTORS T-24 ⊇ {T-19,T-22,T-23}=True; T-28 ∋ T-22=True; T-29 ancestors=28
AC_CRITERIA unique=45 missing=[] extra=[]        # 完成标准
NEW_UNANNOTATED_CRITERIA []                       # 每条完成标准都引用了 AC（T-13.4 / T-20.7 已标注）
AC_MATRIX rows=38 expanded_unique=45 missing=[] extra=[]
AC_PLAN5 rows=37 unique=45 missing=[] extra=[]
PLAN5_TASK_REFS [T-08,T-15,T-21,T-28] unknown=[]; PLAN_ALL_TASK_REFS [T-08,T-12,T-15,T-21,T-28,T-30] unknown=[]
MATRIX_TASK_REFS unique=30 unknown=[]
CRITERIA_VS_MATRIX (task→AC 在完成标准出现、矩阵该 AC 行缺任务号): [('T-03','AC-008-2')] + T-02 的运行器"提供执行机制"类引用 4 条（AC-001-1 / 004-6 / 006-1 / 007-1，矩阵一贯只把 T-02 归 AC-008-x，非本轮问题）
TASK_HOURS actual=48.0 footer_tasks=30 footer_hours=48 per_task_range=[0.5,2.0] out_of_range=[]
DOCUMENT_STRUCTURE_CHECK PASS（文档结构核验，不是项目测试；未安装 / 构建）
```

结构核验通过只说明集合层面齐全；第 8 项的 `('T-03','AC-008-2')` 正是脚本抓到的唯一明细遗漏。

## 整改新引入或直接暴露的问题（R5 编号，不计入 11 项）

| # | 级别 | 位置 | 问题 | 修法 |
|---|---|---|---|---|
| R5-NEW-A-01 | 建议（流程留痕） | 本分支 `AGENTS.md` §2 第 5 步 | 审核员接入通道条款只在 `feat/settings-v1` 的 `e0eec7b`（另一 worktree `D:/2030/Futures-AI`），`feat/frontend-workbench` 基线 c1eb518 的 AGENTS.md 仍是 `318a822` 版本、无该段；本分支按"每步重读 AGENTS.md"得不到通道规则，本轮记录通道依据的是用户指示 | 把 `e0eec7b` cherry-pick 到本分支，或等其经 main 合入后 rebase；本分支未改 AGENTS.md，无冲突风险 |
| R5-NEW-A-02 | 留痕 | D-013 `:45` 勘误段 | "决策内容（**四个**位置的清单与语义划分）不变"——D-013 结论 1、designUI §2.2 `:33`、docs/plan.md §3 `:40` 登记的都是**三个**位置（行情价格模块、关注列表、焦点带行情段） | 改"三个位置"（勘误自身是留痕记录，数字应准确；属编辑性，可随下次 docs 提交） |
| R5-NEW-A-03 | 信息 | plan §2.1 `:99` 括注 | "T-21：滚动过程中任何模块壳与焦点带矩形不相交"未带 T-21 `:302` 已采用的"可见裁剪区"判据；按括注字面实现会落回 B 的原始矩形反例 | 括注加"（按可见裁剪区，见 T-21）" |
| R5-NEW-A-04 | 信息（docs 维护） | `docs/decisions/README.md` | 规则只写"决策变更 = 新 ADR，不修改历史文件"，没有编辑性勘误的合规形式；D-013 的勘误段是本仓库首例，后续无章可循 | 加一句"编辑性更正（不改决策内容与状态）在原文件末尾追加「勘误」段，注明日期、位置、原因"；非本 feature 范围 |

## 复核结论与下一步

1. 11 项中闭环 8、未闭环 3。三处未闭环都是 c1eb518 修了 plan 侧 / 一处而漏了 tasks 侧的同步：T-23 完成标准 1（SparkSeries 输入链）、T-02 完成标准 2（过滤等式 + 合法新锚阴性样例）、矩阵 AC-008-2 行（补 T-03）。均为一句话修订，不涉及需求与设计变更，spec 冻结内容未动，无需重过 Gate 1。
2. 修订后由 A / B 对同一基线做最后一次定向确认（范围只限这三处 + R5-NEW-A-02 可顺手改），再合并共识 `checklist.md`，按 AGENTS §2 进入 Analyze。Gate 2 前需 Walter 知悉 D-013 勘误（第 6 项）；AGENTS.md 通道条款须先进入本分支（R5-NEW-A-01）再作为本 feature 后续审核的依据。
3. 本会话只新建 `specs/frontend-workbench/checklist.verify-a.r5.md`；未修改任何既有文件，未安装依赖、未运行项目测试、未 commit。
