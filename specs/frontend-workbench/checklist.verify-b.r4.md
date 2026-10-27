结论：21 条中闭环 14 条、未闭环 7 条（NEW-B：3 / 3；V3：11 / 4）；不能确认本轮整改已全部闭环。

# frontend-workbench 第四轮定向确认（审核员 B）

## 基线与口径

- 审核员：`openai/gpt-6.1-sol`；分支 `feat/frontend-workbench`，固定 HEAD **`d7d7494eb28fa1492d1c8536d0531c592c23f643`**。已读取 `git show d7d7494 --stat` 及完整 diff（5 文件，257 insertions / 34 deletions），不以提交说明代替正文核验。
- 已重新读取 `AGENTS.md`、`docs/plan.md`、`docs/architecture.md`、`docs/designUI.md`、D-013 与 ADR README、`specs/README.md`、本 feature 的 spec / plan / tasks，以及两份第三轮复核原件。A 原件只读；不重审原 90 项，不改共识清单。
- 以下 `plan.md` / `tasks.md` / `spec.md` 均位于 `specs/frontend-workbench/`；D-013 指 `docs/decisions/20261027-updown-scope.md`。行号均为当前基线，不沿用第三轮旧行号。
- 二元判定：原关闭要求仍有遗漏即为“未闭环”；“闭环”仅签该编号原具体缺口的设计 / 任务修订，不代表实施完成或项目测试通过。整改新引入的问题在末节另列，不增加 21 条分母。本文不代表 A/B 新共识，不授权 Implement。

## 逐项判定（每项一行）

| 编号 | 判定 | 当前依据与残留 |
|---|---|---|
| NEW-B-01 | **未闭环** | `plan.md` §6 `:435–437` 已统一保留 D-013 登记并标 superseded，但 `:435` 仍允许无适用前提的整文件 checkout；末尾“不得带回其他提交修改”未使该命令具备块级保留能力。须限定“确认无其他改动才可整文件恢复”，否则只恢复本 feature 的块。 |
| NEW-B-02 | **闭环** | `tasks.md` T-03 `:47–54` 创建固定清单的 41 锚，T-04 `:59–67` 补余下 45 锚；T-13 `:178–190` 明确生产 normalize.ts、六份 pi-raw、期望快照及归约 / 运行中 abort 用例，并给定向命令；目录树见 `plan.md` §1 `:45,50,53`。 |
| NEW-B-03 | **未闭环** | `plan.md` §2.7 `:300`、§5 `:408` 已补 SparkSeries 失败例，但 `:295` 仍规定业务数值全部经 Figure；`tasks.md` T-11 `:152` 仍是 Figure-only，未要求 Spark 缺元数据或 semantic / seriesId 不一致的反例，T-23 `:323–336` 也未明确新输入链。 |
| NEW-B-04 | **闭环** | `tasks.md` T-15 `:207` 提供焦点占位，T-19 `:257–258` 只装配栅格并保留占位，T-20 `:273–274` 拥有 WorkbenchPage.vue 的真实组件替换；依赖是 T-20 → T-19，而非相互依赖，脚本确认无环。 |
| NEW-B-05 | **未闭环** | `tasks.md` T-21 `:302` 已改用模块矩形与滚动容器的可见交集；`plan.md` `:97,134,145,161,328` 已修对比度与 sticky 矛盾。但 T-21 仍只要求滚到底部，未覆盖 §2.1 `:99`“滚动过程中”的代表位置，尚需明确顶部 / 中段 / 底部等采样。 |
| NEW-B-06 | **闭环** | 原点名的索引已同步：`plan.md` §5 `:377,401,403,408` 纳入 layering / 几何 / 归约 / Spark；`tasks.md` 矩阵 `:434,459,457,464` 对应 T-21 / T-08 / T-13 / T-11、T-12。新增 T-03 明细映射遗漏另见 R4-NEW-B-02，不把本项签作全库索引无缺陷。 |
| V3-01 | **闭环** | `docs/designUI.md` §2.2 `:33` 已改为新增后继 ADR 并同步本节，与 D-013 `:26,41` 及 `docs/decisions/README.md:9` 的后继规则一致；历史编辑的留痕问题单列 V3-13。 |
| V3-02 | **闭环** | `plan.md` §6 `:436–437` 对 docs/plan §3 的同一 D-013 行现统一要求保留、标 superseded 并指向后继 ADR，不再同时要求删除；本项不替代 NEW-B-01 的受限恢复检查。 |
| V3-03 | **闭环** | `plan.md` §2.1 `:97,134` 两处均为 .06 面上弱文字约 4.3，与第三轮复算的 4.3286 一致；没有改动已批准色值。 |
| V3-04 | **闭环** | `plan.md` §2.3 `:161` 明确独立行、非 sticky 覆盖层；§2.8 `:328` 的 sticky / fixed 玻璃允许名单只留 glass-drawer 面板 / 抽屉 / Toast，并明确焦点带、顶栏不得 sticky 或 fixed。 |
| V3-05 | **闭环** | `tasks.md` T-13 `:178–190` 已纳入纯归约、六原始样本 / 快照、归约单测、两类 willRetry 与 abort 边界，估时改为 2h；`plan.md` §1 `:45,50`、§5 `:401` 同步，生产者和验证入口不再缺失。 |
| V3-06 | **闭环** | `tasks.md` T-02 `:39` 明列固定 JSON、双向核、“同步漏锚 / 正文漏分类”反例；T-03 / T-04 `:47–59` 分阶段生产 41 + 45 锚；`plan.md` `:53,327` 列入目录树并明确 new:true 位于 front matter 的 adopted 项。新集合规则问题另见 R4-NEW-B-01。 |
| V3-07 | **未闭环** | `plan.md` §5 `:408` 已有 SparkSeries 缺元数据 / 一致性失败例，但 `tasks.md` T-11 完成标准 1 `:152` 完全未同步，仍写“业务数值统一用 Figure”；此项要求的两处修订只完成一处。 |
| V3-08 | **闭环** | `tasks.md` T-19 `:257` 明确保留 T-15 占位，T-20 `:273` 明确修改 WorkbenchPage.vue 以真实 FocusBand 替换；T-19 不再提前导入 T-20 的产物，没有通过反向依赖制造循环。 |
| V3-09 | **闭环** | `tasks.md` AC 矩阵 `:434,438,459` 已分别为 AC-001-3 补 T-21、AC-002-1 补 T-15、AC-006-2 补 T-08，原点名的三个任务映射均存在。 |
| V3-10 | **闭环** | `tasks.md:4–5` 已标“草案第三版”，补归约 / 锚清单 / 几何 / 组件交接的修订记录，仍保留 Checklist 全勾才生效的闸门及已重新批准的 spec 依据。 |
| V3-11 | **未闭环** | `plan.md` §2.1 防线 4 `:108` 仍写“三个行情模块目录”；`tasks.md` T-08 `:111` 仍写 usage 限三处与 Num.vue，未同步 Kpi.vue 与 contracts 排除。详细 plan 已允许二者，不应让任务括注继续给出另一份名单。 |
| V3-12 | **未闭环** | `tasks.md` T-19 `:261` 已改为 min(defaultSpan, 当前列数)，但 `plan.md` §5 `:391` 仍写“截断为剩余列数”，与 §2.4 `:179` 的列数上限不同义；验收索引尚未统一。 |
| V3-13 | **未闭环** | D-013 `:4,26,41` 仍是 accepted 的原位编辑结果；本次只归档 `checklist.verify-a.md:49,56` 的“可接受勘误 / 建议 Walter 知悉”，未见后继记录或明确批准的勘误记录（B 三轮 `checklist.verify-b.md:26` 的收束要求）。此为历史留痕 / 风险接受待确认，不是重新要求 Gate 1 批准既有 spec。 |
| V3-14 | **闭环** | `tasks.md` T-20 `:282,290` 已列焦点带错误态及验证命令；T-27 `:384` 已明确非工作台起点的添加 / 导航 / 等挂载 / 滚动 / 高亮；T-28 `:397` 已把焦点带错误态注明为 plan 行为。 |
| V3-15 | **闭环** | `plan.md` §6 `:430` 表头已由“対象”改为“对象”。 |

## 一次只读脚本核验

在根目录用一次 `python -B` 内存脚本解析当前文档：任务号按 `### T-xx` 提取；展开 T-29 的区间依赖、去重后进行位置比较与 DFS；仅抽取各任务“完成标准”而非全文来核 AC；矩阵展开区间及 AC 简写；plan §5 与矩阵逐一核对任务引用。

```text
BASELINE d7d7494eb28fa1492d1c8536d0531c592c23f643
TASK_DAG tasks=30 unique_edges=81 missing=0 forward=0 self=0 cycles=0
FOCUS_HANDOFF T-19 dependencies=T-15,T-18; T-20 dependencies=T-19
AC_CRITERIA unique=45 missing=[] extra=[]
AC_MATRIX rows=38 expanded_unique=45 missing=[] extra=[]
AC_PLAN5 unique=45 missing=[] extra=[]
PLAN5_TASK_REFS T-08,T-15,T-21,T-28 unknown=[]
MATRIX_TASK_REFS unique=30 unknown=[]
PRODUCERS fixed_manifest=True normalize/pi-raw/snapshots=True
SPARK_NEGATIVE_SYNC plan5=True T-11=False
NEW_UNANNOTATED_CRITERIA [('T-13', 185), ('T-20', 282)]
TASK_HOURS actual=48.0 footer=47
APPROVED_SPEC unchanged=True blob=9e18344dce0af43485c312b6339ceccddb7863ac
DOCUMENT_STRUCTURE_CHECK PASS (not project tests; no installation/build)
```

**结构检查通过不等于整改全闭环**：45 条 AC 的集合均全覆盖，不能证明每个子断言或 AC→任务明细均已同步。固定清单与归约资产已有明确生产者，焦点带交接无循环；Spark 反例仍缺 T-11 落实。冻结 spec 与 `1b5659d` 批准版内容相同，无需为本轮设计 / 任务修订重开 Gate 1。

本会话只新建本报告；未修改既有文件，未安装依赖，未运行项目测试 / 构建，未 commit；`checklist.md` 与 A/B 原件保持不动。

## 整改新引入或直接暴露的问题（不另计 21 条）

### R4-NEW-B-01：新锚进入 adopted 后，源锚集合等式缺少过滤规则

- **位置**：`plan.md` §2.8 `:327`；`tasks.md` T-02 `:39`。
- **问题**：本次明确新适配锚放在 adopted 内，却同时要求全量 `adopted ∪ not_adopted = source_anchors`，右侧仍为固定的原锚清单。例如原锚只有 `{a}`、新增 `{b, new:true}` 时，合规登记的 adopted 为 `{a,b}`，全量并集就不再等于 `{a}`。标记放置已定，但集合算法仍未说明排除新锚。
- **关闭要求**：明确仅原锚投影参与与固定清单的等式，新锚另核 new:true 与正文对应，并补“合法新增锚通过、原锚缺失仍失败”的守卫自检；不要把新锚写进原始 86 锚以凑等式。

### R4-NEW-B-02：新完成标准与 AC 明细索引仍有小范围遗漏

- **位置**：`tasks.md` T-13 `:185,190`、T-20 `:282,290`、T-03 `:51`、矩阵 `:466`；约束见 `AGENTS.md` §2 第 6 步。
- **问题**：本次新增的 T-13 完成标准 4、T-20 完成标准 7 自身未引用 AC，虽对应命令分别筛选 AC-005-6 / AC-003-1；新增 T-03 完成标准 2 已引用 AC-008-2，矩阵该行却仍只有 T-02 / T-06。
- **关闭要求**：给两项标准注明既有 AC 的计划扩展 / 边界部分，保持“焦点错误态不是新增 spec 要求”的说明，并把 T-03 的新映射补入矩阵。这里没有缺失整条 AC，也不要求新增产品 AC。

### R4-NEW-B-03：估时汇总未随 T-13 扩展更新（信息级）

- **位置**：`tasks.md` T-13 `:180` 与末尾 `:471`。
- **问题 / 修法**：T-13 从 1h 改为 2h 后，30 项逐项合计为 **48h**，末尾仍为约 47h；同步汇总即可。所有单项仍在 0.5–2h 范围内，此项不影响已核的 DAG / AC 集合结论。
