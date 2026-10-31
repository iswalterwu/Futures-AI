# Feature: dev-harness-budget v1 Analyze 报告 R5（analyze-r5.md）

> Analyze 阶段产物（[workflow.md 第 7 步](../../docs/development/workflow.md#step-7)）：只读报告 spec / plan r7 / tasks 之间的冲突、差距与模糊处。
> 本报告**不修复**任何输入，不勾选、不豁免任何 checklist 项，不授权 Implement；质量判定 ≠ 任务执行 / AC 完成 / Checklist 批准。[Analyze R1](analyze.md)、[R2](analyze-r2.md)、[R3](analyze-r3.md)、[R4](analyze-r4.md) 原文保留不动。

- **Analyze R5 = `claude-opus-5-5 via claude-bridge`**（计划类首选模型 + 首选通道）。协调者派工前在 claude-bridge 做了一次最小真实调用，成功（协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置。新开会话，与 Plan r5 / r6 / r7 作者会话分离；是唯一有效的 Analyze R5。
- **固定提交**：`e467c89c953dc29aabe9f93392a642ff6320a2ef`（`D:/2030/Futures-AI`，分支 `workbench`；开始时 `git status --porcelain` 为空）。本会话唯一写入 = 新建本文件。派工说明“输出”节写作 `analyze-r2.md`，与边界节“只新建 analyze-r5.md、R1～R4 只读”冲突，且 `analyze-r2.md` 是已有的 Analyze R2，故按边界节执行。无 Git 写操作、无网络、无安装、无派工、无测试，未 import 模块；未读真实 `~/.pi` 会话、actor / agent 日志、Temp 负载或试点数据。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ e467c89（blob ee8e4ab）全文
docs/development/model-routing.md @ e467c89（blob f980f5c）全文
docs/development/workflow.md @ e467c89（blob 4aca344）全文（总规则、第 6～8 步、Gate 1 / Gate 2）
templates/tasks.md @ e467c89（blob 4b7f955）全文
specs/dev-harness-budget/spec.md @ e467c89（blob 4689093）全文；锚定行首 "## 1." 至文末 SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算）
specs/dev-harness-budget/plan.md @ e467c89（blob 175fc2e，r7）全文 408 行
specs/dev-harness-budget/tasks.md @ e467c89（blob 771c9b5）全文 496 行
specs/dev-harness-budget/analyze.md（2caea51）、analyze-r2.md（b96ddab）、analyze-r3.md（e7fbc98）、analyze-r4.md（0fb9a28）@ e467c89 全文
specs/dev-harness-budget/checklist.md @ e467c89（blob 04fe4b1，Checklist R3，只覆盖 r4）全文
specs/dev-harness-budget/code-review-r1.md（2272b21）、converge-r4.md（38b87a3）@ e467c89 全文
specs/dev-harness-budget/review.md @ e467c89（blob 6659702）头部，以及“Review R1”节至文末
真实 diff：git diff 70291e3..HEAD（r5～r7 累计：analyze-r3 / analyze-r4 / plan / review / tasks，+457/−46）；
  git diff 81c6176..d4781fc（r6：analyze-r4 / plan / review / tasks）；git diff d4781fc..HEAD（r7：plan +6/−1、review +7、tasks +7/−6）
现行代码（只读，只核对 blob 未变）：backend/tools/dev_harness_budget.py（3d81548）、backend/tests/test_dev_harness_budget.py（3f9025a）、
  backend/tests/dev_harness_budget_fixtures.py（ee1318c）
pi 1.4.0 公开安装包（有界只读，包相对路径）：复算 nested-tool-calls.js、agent-session.js、agent-loop.js、json-event.js、print-mode.js 的 SHA256；
  nested-tool-calls.js 的 parentToolCallId / 子 id / complete 检索与 66–80、164–178 行；agent-session.js 708–727 行（未打开任何 .md）
```

## 结论

**PASS**：本轮未发现 spec / plan r7 / tasks 之间的冲突、差距或歧义（0 P1 / 0 P2 / 0 P3）。

Analyze R4 的两项 P3 已由 r7 解决，Analyze R3 的三项 P3 在 r6 中的解决仍然成立（见下表）。Review R1 的四项发现在 plan + tasks 中的设计承接完整，r7 没有改动它们。冻结 spec 未变，27 条 AC 均未勾选。退出码 0 / 3 / 2 / 1 与六项度量矩阵仍是 R2 接受的设计。r7 只改措辞，没有引入回归。

PASS 只表示本轮一致性分析没有发现问题。它**不是**任务执行、AC 完成、Checklist 批准或 Implement 授权。Checklist R3 只覆盖 Plan r4；C-05 / C-09 以及 r5～r7 改动的规则（§3.3 / §3.4 / §4.2 / §4.3 / §4.7、T-16～T-20、T-12）只能由独立 A 在 Checklist R4 中判定。T-16 的前置条件还要求有效 checklist（R4 或其后）全部勾选。

## Analyze R4 / R3 发现的解决情况

| 发现 | 结论 | 理由（依据 e467c89 原文与 d4781fc..HEAD diff） |
|---|---|---|
| P3-AN-R4-1 T-16 依赖引用未通过的 Analyze R3 | **已解决** | T-16 依赖改为“对固定候选提交的最新一轮 Analyze（R5 或其后重跑）通过、有效 checklist（R4 或其后）全部勾选”，条件可以满足；本报告即为该轮。其他任务都不以 Analyze R3 作闸门（逐任务检查依赖行）。tasks 头部 r7 行写明：“r5 现状”、承接表标题和“阶段边界”第一条中的 Analyze R3 是历史文字，当前下一步是 Analyze R5 → Checklist R4 |
| P3-AN-R4-2 自观测试点的核对顺序不明 | **已解决** | T-12 状态行、完成标准 2 与验证命令 2 都把被观测 feature 写明为 `dev-harness-budget`，`<被观测 feature>` 占位符已去掉。执行顺序写为：命令 2“前”核对 → 命令 1 报告命令 → 命令 2“后”核对（须与“前”一致）→ 写入脱敏记录。命令 1 / 2 也各自重复了这一顺序，并注明记录本身不属于被比较的状态。两次核对之间只运行报告命令，而报告只写到仓库外的 Temp（out-dir 守卫，§2），所以“两次输出一致”可以实际达到。plan §5 AC-008-3 行已同步。完成标准 1 ↔ 命令 1、2 ↔ 2 的对应不变 |
| P3-AN-R3-1 T-12 修改范围与授权冲突 | **仍已解决** | r7 未改 T-12 修改范围：仍为协调者编写清单，只列 `budget-*.jsonl` / `review-budget-*.jsonl`，清单与 out-dir 都在系统 Temp，与 review.md 授权节一致 |
| P3-AN-R3-2 净新增不可确定时仍显示“复制件 0 条” | **仍已解决** | §3.4 第 4 层、§3.6 `sources[]`、§5 AC-004-3、T-19 仍统一为：`net_new_determined: false` 的全部血缘情形，复制件数与净新增数都为 null；r7 未触及这些位置 |
| P3-AN-R3-3 F2 的 matched 2 未进完成标准 | **仍已解决** | T-16 完成标准 1 仍含“F2 已解析 `call_ref` 集合 = 记录 `call_ref` 集合（2 / 2）”，r7 只改了 T-16 依赖行 |

## Review R1 发现的设计层解决情况（代码后续修复；是否关闭由实施后的 Review R2 判定）

| 发现 | plan + tasks | 依据 |
|---|---|---|
| P2-CR-1 嵌套执行计为 direct | **已承接** | 白名单增读 `parentToolCallId`，只在读取器内部用于判定与哈希，不输出（§4.2）。带父 id 的执行记为 `NestedExecutionRecord`，永不进入 direct，也不参与 proposed_only 匹配（§2、§3.3）。父调用在同一 owner 作用域内解析：先找 direct，再找已解析的嵌套子 id；零个或多个候选时记 `nested_parent_unresolved`，仍按嵌套处理，不从 id 字符串推断。嵌套身份与 `nestedCalls` 记录同法构造并去重（matched / executed_only / reported_only）。direct 的计数、分母与覆盖率都不含嵌套；`nested_parent_unresolved` / `nested_execution_incomplete` 阻止 tool_calls 判 complete；`all_total` 保守为 unknown。F2 已改为真实形状，F14 (a)～(f) 覆盖多层、父未解析、256 上限、并行和两轮复用；既有断言改正规则见 T-16。由 T-16 / T-17 承接，完成标准中的字面量可由规则唯一推出。本会话有界复核：nested-tool-calls.js 106 行子 id 为 `${callerId}/${n}`；116 / 144 / 163 行三类事件都带 `parentToolCallId`；76 行有 unfinished 时 `complete=false`；`takeRecord`（168–175 行）返回 `{calls: snapshot, usage}`。agent-session.js 714–723 行在 toolResult `message_start` 时附加 `nestedCalls` 并合并 usage。作者的说法成立 |
| P3-CR-1 未确认分区下“分母 0 / 缺失 0”、原因误用 | **已承接** | §4.3“空集原因”和“未确认分区下的分母”两段、§3.6、§4.7 分母说明，由 T-18 承接。tokens / 分组按来源级或记录级未确认计数，tool_calls 只按来源级计数；`no_usage_records_observed` 只属于 `empty` 来源，空的已确认集合用 `no_confirmed_records`；全部 loaded 且无未确认分区时输出不变 |
| P3-CR-2 `lineage_parent_unavailable` | **已承接** | §3.4 第 4 层：父已选入但不是 `loaded` 时不做键集差，记 `net_new_determined: false`，复制件数未知；父为 `partial` 时父子进入未确认分区。第 6 层 (d) 随之不成立。由 T-19 承接，含缺失、只有 header、坏行与链式重复四种变体 |
| P3-CR-3 计算守恒，不用生产 `assert` | **已承接** | §4.3：`conserved` 由计算得出，为 false 时记 `group_conservation_failed`，完整总计 unknown，tokens 降为 partial，报告照常写出；先算分组再算 observation。由 T-20 承接，用 AST 检查生产模块无 `assert`，不对私有函数打桩 |

T-12：状态（已授权、未开始）、用户原话“全修，T-12同批完成，授权脱敏”、授权范围（Temp 下本功能临时目录的 `budget-*.jsonl` / `review-budget-*.jsonl`，修复循环新增的同类捕获也算在内；不含协调者会话、`~/.pi`、其他项目或私有文档目录）、执行约束（协调者在 T-16～T-20 之后用最终代码运行，不新增模型调用、不重跑任务，只记脱敏计数）以及依赖（T-11、T-13～T-20），都与 review.md“用户对 Review R1 的处置与试点授权”节一致。AC-008-1 / AC-008-3 在执行并经 Review 前不判通过，plan §5 与 tasks 覆盖表都这样写。

## 本会话实际执行的静态核对（未来测试命令一律未执行）

| 项 | 结果 |
|---|---|
| spec 冻结 | 锚定正文 SHA256 = `a504fed8…e823`；`- [ ] AC-` 27 条，`- [x]` 0 条；`git diff --name-only 70291e3..HEAD` 不含 spec.md |
| 真实 diff | 70291e3..HEAD 只涉及 analyze-r3 / analyze-r4 / plan / review / tasks；`git diff --check 70291e3..HEAD` 退出 0；checklist.md 仍为 blob 04fe4b1；三个代码文件 blob 仍为 3d81548 / 3f9025a / ee1318c（无代码改动） |
| r7 范围 | plan：头部 r7 行、§5 AC-008-3 行一句、§7 r7 段；tasks：头部 r7 行、T-12 状态行 / 完成标准 2 / 验证命令、T-16 依赖；review.md：只追加“Tasks 补正 r7”一节。与作者声明一致，规则正文未动 |
| AC 映射 | 脚本核对：spec AC 27 = plan §5 表 27 行 = tasks 覆盖表 27 行，集合相等、无重复 |
| 测试名 | tasks 与 plan §5 的 `test_*` 集合双向差集为空；60 条 `-k` 表达式中的名称都在 plan §5 中，名称之间没有子串碰撞 |
| 任务结构 | T-01～T-20 完成标准与验证命令条数逐任务相等（T-12：2/2；T-16～T-20：3/3/3/3/4）；每条完成标准都引用 AC 编号或标“（非 AC）”；依赖为 T-01→…→T-11→T-13→…→T-20，T-12 依赖 T-11、T-13～T-20，无环；估时都在 0.5–2h 内 |
| 范围 / 工具 | 代码只改 3 个既有文件；只用标准库（测试另用 `ast`）与既有 pytest / Git；没有新依赖、功能、阈值或来源格式 |
| 离线 / 字面量 / 隐私 | 审计钩子设计未变；新完成标准的期望值都是字面量；`parentToolCallId` 哨兵由 T-16 完成标准 2 承接 |
| 三层数据 | F1～F14 为原生合成样例，经 `read_source`；D1 仍是 `build_report` 边界的归一化域样例，并标明“不代表原生读取器能产出”；T-12 已授权，但没有被当作已满足 |
| 退出码 / 六项度量 | §2 的 0 / 3 / 2 / 1 与状态行未改；§4.7 六项结构未改，r5 只给 tool_calls 的 complete 条件增加了两个阻断原因，属于同向收紧 |
| 回归 | r7 没有改动任何规则；§4.2 收尾判据、§4.4 括号、§4.5 时间、§3.4 第 0～3 / 5 / 7 层、r3 / r4 修复、T-13～T-15 的条件都与 Analyze R4 审过的版本逐字相同 |
| 源码哈希 | 复算 nested-tool-calls.js `62a69500…`、agent-session.js `436e8be3…`、agent-loop.js `22ee81f9…`、json-event.js `5f375647…`、print-mode.js `bb070a05…`，均与 plan §7 r5 一致 |

## 非阻塞观察（不是发现）

1. **输入清单记录**：plan.md 的“输入清单”中，r6 一行写在代码块之外，而且没有 r7 行；tasks.md 的输入清单止于 r5，没有 r6 / r7 行。r6 / r7 的基线与依据已经写在两份文件的头部修订行和 review.md 对应节，但这些不是 workflow 总规则第 5 条要求的“路径 @ SHA + 章节”清单。这是过程记录上的缺口，不是 spec / plan / tasks 之间的语义不一致，所以不计为本报告的发现。是否补记由协调者决定，Checklist R4 的 A 也可以自行判断。
2. T-12 状态行写“r7 只在验证命令中写明 feature 名与执行顺序”，但完成标准 2 也加了 feature 名。含义没有改变，只是说法不完全准确。
3. review.md 头部“当前状态”仍写“待 Analyze R3 → …”（r5 时的文字）。文末各节已经记到 r7 与 Analyze R5，属于记账滞后（同 Analyze R4 观察 2）。
4. `nested_executed` 中的 `parent_unresolved` 与 finished / unfinished / terminal_only 是否相互重叠，plan 没有写明。T-17 只在 (a) 中同时断言 finished 2 / observed_total 2 / parent_unresolved 0，在 (c) 中不断言 finished，所以两种理解都不会被测试判错。实施者选一种并在 report.json 中保持一致即可。
5. Analyze R3 的非阻塞观察 1～4 与 Analyze R4 的观察 1 仍然适用，r7 没有涉及：`takeRecord` 之后子 id 可能重复编号；`nested_execution_incomplete` 没有专门样例；§4.3 空集括号的措辞；混合来源下 `nested_executed` 的范围字段；T-19 完成标准 2 需要补调 `render_summary` 并断言摘要。

## 外部条件与下一步

- 下一步由独立 A（新开会话，与实施模型不同，按 model-routing 先测 bridge）对包含本报告的固定提交做 Checklist R4：复核 r5～r7 改动的规则，并判定 C-05 / C-09。Checklist R4 全部勾选之前不得开始 T-16。
- T-12 真实试点已授权，在 T-16～T-20 之后由协调者执行；本报告不读取、不运行任何试点数据。Implement、Converge、Review R2 与 Gate 2 均未授权；27 条 AC 仍全部未勾选。不需要回 Clarify，没有需求变更。
