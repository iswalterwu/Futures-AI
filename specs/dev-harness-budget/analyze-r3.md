# Feature: dev-harness-budget v1 Analyze 报告 R3（analyze-r3.md）

> Analyze 阶段产物（[workflow.md 第 7 步](../../docs/development/workflow.md#step-7)）：只读报告 spec / plan r5 / tasks 之间的冲突、差距与模糊处。
> 本报告**不修复**任何输入，不勾选 / 豁免任何 checklist 项，不授权 Implement；质量判定 ≠ 任务执行 / AC 完成 / Checklist 批准。[Analyze R1](analyze.md)、[R2](analyze-r2.md) 原文保留不动。

- **Analyze R3 = `claude-opus-5-5 via claude-bridge`**（计划类首选模型 + 首选通道）。协调者派工前在 claude-bridge 做了一次最小真实调用，成功（协调者陈述）；本会话未换模型，未改 provider / 路由 / key / 全局配置。新开会话，与 Plan r5 作者会话分离；是唯一有效的 Analyze R3。
- **固定提交**：`42d15069ddb8ef8bd2c4eb227d5d172a87b128f7`（`D:/2030/Futures-AI`，分支 `workbench`；开始时 `git status --short` 为空）。本会话唯一写入 = 新建本文件（派工说明“输出”节写作 `analyze-r2.md`，与边界节“只新建 analyze-r3.md、R1 / R2 只读”冲突，按边界节执行）。无 Git 写操作、无网络、无安装、无派工、无测试，未 import 模块；未读真实 `~/.pi` 会话、actor / agent 日志、Temp 负载或试点数据。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ 42d1506（blob ee8e4ab）全文
docs/development/model-routing.md @ 42d1506（blob f980f5c）全文
docs/development/workflow.md @ 42d1506（blob 4aca344）全文（总规则、第 6～8 步、Gate 1 / Gate 2）
templates/tasks.md @ 42d1506（blob 4b7f955）全文
specs/dev-harness-budget/spec.md @ 42d1506（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算）
specs/dev-harness-budget/plan.md @ 42d1506（blob 11a074e，r5）全文 388 行
specs/dev-harness-budget/tasks.md @ 42d1506（blob 9d20409）全文 494 行
specs/dev-harness-budget/analyze.md（2caea51）、analyze-r2.md（b96ddab）@ 42d1506 全文
specs/dev-harness-budget/checklist.md @ 42d1506（blob 04fe4b1，Checklist R3，只覆盖 r4）全文
specs/dev-harness-budget/code-review-r1.md @ 42d1506（blob 2272b21；文件 SHA256 9e88d8ec…，与 review.md 记录一致）全文
specs/dev-harness-budget/converge-r4.md @ 42d1506（blob 38b87a3）全文
specs/dev-harness-budget/review.md @ 42d1506（blob 072fdb5）头部，以及“Review R1”节至文末
真实 diff：git diff 70291e3..HEAD（plan.md / review.md / tasks.md 三个文件，+201/−40；无代码、spec、checklist、analyze 改动）
现行代码（只读，判断可实施性）：backend/tools/dev_harness_budget.py @ 42d1506 第 340–420、451–575、654–840、852–1031、1183–1475、1659–1745 行；
  backend/tests/dev_harness_budget_fixtures.py 的 entry / f2_rows / f5_sources / f8_sources / f12_events / f12_nested_sources / privacy_rows；
  backend/tests/test_dev_harness_budget.py 第 455–570、695–790、1400–1430 行与断言检索
pi 1.4.0 公开安装包（有界只读，包相对路径）：pi-coding-agent dist/core/nested-tool-calls.js 全文；dist/core/agent-session.js 380–418、700–760 行及
  executeTool / _nestedToolCalls 检索；pi-agent-core dist/agent-loop.js 378–470、640–685 行；另复算 json-event.js、print-mode.js、docs/extensions.md、
  docs/message-types.md 的 SHA256（未打开这两份 .md 阅读内容）
```

## 结论

**NOT PASSED**：0 P1 / 0 P2 / **3 P3**。

Plan r5 与 T-16～T-20 在设计层面承接了 Review R1 的全部四项发现（见下方解决表）；有界源码核实支持作者关于 `parentToolCallId`、子 id 赋值、共享记录器与嵌套 usage 合并的说法。冻结 spec 未变，27 条 AC 均未勾选。退出码与六项度量结构未变，r3 / r4 与 T-13～T-15 的已接受修复未见回归。剩余 3 项 P3 都是 tasks 内部或 plan → tasks 的小缺口，不影响 Review R1 四项发现的设计正确性。按第 7 步，需修正后重跑 Analyze（或由用户决定按 P3 处置）。

本结论只是一致性分析。它**不是**任务执行、AC 完成、Checklist 批准或 Implement 授权；C-05 / C-09 与 r5 规则只能由独立 A 在 Checklist R4 中判定。

## 发现

### P3-AN-R3-1 T-12 的“修改范围”与已记录的试点授权约束相冲突

- **位置**：tasks.md T-12“修改范围”（“用户在仓库外编写本地清单……out-dir 在仓库外（如 `%LOCALAPPDATA%/FuturesAI-dev/harness-budget/<batch_id>/`）”）与同任务“状态”行、review.md“用户对 Review R1 的处置与试点授权”节（“由协调者……运行；清单与报告只放仓库外的系统 Temp”）。
- **具体情形**：状态行只声明“完成标准与验证命令不变”，修改范围保留了 r4 的旧文字。如果执行者照修改范围的示例操作，真实派生报告会写到 `%LOCALAPPDATA%`。这超出用户授权的存放位置，而且 D-025 的 Temp 回收也不会清理它。谁来编写清单（用户还是协调者）也前后不一致。
- **修复方向**：把 T-12 修改范围改成与授权一致：清单由协调者编写，只列授权范围内的 `budget-*.jsonl` / `review-budget-*.jsonl`；清单与 out-dir 均放在系统 Temp 的本功能临时目录；删除 `%LOCALAPPDATA%` 示例。验证命令占位符可以保留。

### P3-AN-R3-2 血缘净新增集不可确定的其他情形仍显示“复制件 0 条”（P3-CR-2 的同类残留）

- **位置**：plan §3.4 第 4 层（r5 只把 `parent_not_selected` / `lineage_parent_unavailable` 的复制件数与净新增数改为 unknown）、§3.6 `sources[]`（“净新增集不可确定时为 unknown”）；tasks T-19；test_dev_harness_budget.py 565 行。
- **具体情形**：F5 `lineage_conflict` 中，子来源 a1 与父来源 a1 的 `(type, id, timestamp)` 相同（夹具时间戳固定），但用量不同。现行代码给出 `lineage.net_new_determined: false`、`copied_record_count: 0`、`net_new_record_count: 2`，摘要写“复制件 0 条；净新增记录 2 条”。实际复制件数是 0 还是 1 无法判定，按 AC-003-4 不应显示为 0。血缘对落入 `relation_shape_unsupported` 时同样跳过键集差，却显示 0。§3.6 的通用措辞会使这些情形也为 unknown，但 §3.4 与 T-19 只点名两种原因；T-19 也没有把 565 行列为需要改正的既有断言。实施者无论按哪一处执行，都与另一处冲突。数值上没有重复计入（这对来源都在未确认分区），所以是 P3。
- **修复方向**：二选一。(a) §3.4 / §3.6 / T-19 统一为“`net_new_determined: false` 的全部血缘情形，复制件数与净新增数都为 unknown”，并在 T-19 中列出 565 行的改正。(b) 收窄 §3.6 措辞，只覆盖这两种原因，并为冲突 / 不支持形状写明 0 的含义（如“已去除的复制件”）及摘要文案。

### P3-AN-R3-3 Plan §5 中 F2 的嵌套去重断言没有进入任何任务的完成标准

- **位置**：plan §5 AC-005-1 行（“F2 → direct 1、`nested_executed` finished 2、matched 2”）；tasks T-16 完成标准 1（F2 只断言 direct 1 与两条嵌套执行均为 finished）、T-17 完成标准 1（只列 F14 与 F12）。
- **具体情形**：F2 是唯一一个“嵌套调用在父 toolResult 之后才结束、记录状态为 unfinished、`complete=false`”的样例，最贴近 Review R1 指出的真实形状。但“matched 2”（执行身份与记录身份相等）不在任何完成标准或验证命令里。因此实施时 F2 的身份构造即使与记录不一致，也不会有测试失败。
- **修复方向**：在 T-16 完成标准 1 中加入“F2 两条已解析嵌套执行的 `call_ref` 集合 = 父 toolResult 记录的 `call_ref` 集合”，或在 T-17 完成标准 1 中加入“F2 → `nested_deduplicated` = {observed_total 2, matched 2, executed_only 0, reported_only 0}”。验证命令不变。

## Review R1 发现的设计层解决情况（代码后续修复；是否关闭由 Review R2 判定）

| 发现 | Plan r5 + Tasks | 依据 |
|---|---|---|
| P2-CR-1 嵌套执行计为 direct | **已在设计中承接** | 白名单增读 `parentToolCallId`，只在读取器内部使用，不输出（§4.2）；带父 id 的执行记为 `NestedExecutionRecord`，永不进入 direct，也不参与 proposed_only 匹配（§2、§3.3）。父调用只在同一 owner 作用域内解析：先找 direct，再找已解析的嵌套子 id；零条或多条候选 → `nested_parent_unresolved`，仍按嵌套处理，不从 id 字符串推断父子关系。嵌套身份 `_hash_ref("n", root_ref+"\0"+子 id)` 与现行 `_nested(…, tool.call_ref)` 的构造相同（核对代码 557–573、807 行），所以执行与 `nestedCalls` 记录能按身份去重（matched / executed_only / reported_only）。direct 的计数、分母和覆盖率都不含嵌套；`nested_parent_unresolved` / `nested_execution_incomplete` 会阻止 tool_calls 判 complete。只要存在任何嵌套证据，`all_total` 就保守地记为 unknown。F2 已按真实形状修正（`call_0/n`、无重复记录、补嵌套事件）；F14 (a)～(f) 覆盖多层、父未解析、256 上限、并行、两轮复用。T-16 写明了既有断言改正的规则；旧流（F12）计数不变 |
| P3-CR-1 未确认分区下“分母 0 / 缺失 0”与原因误用 | **已在设计中承接** | §4.3 新增两段：存在未确认分区时，tokens / tool_calls 覆盖行、分组节、token 节的分母、缺失数与未知记录数都为 unknown，另列 `unconfirmed_sources`；tool_calls 只计来源级未确认，与“记录级未确认只涉 toolResult 用量”一致。`no_usage_records_observed` 只经 `empty` 来源的缺口给出，已确认集合为空时用 `no_confirmed_records`。T-18 的 F5 `double_capture` / F8 `undeclared` 期望可由规则唯一推出（核对 `_partition_sources` / `_nested_partition` / `_observation`）；全部 loaded 时摘要哈希断言照过（组原因不渲染，`render_summary` 1659–1738 行） |
| P3-CR-2 血缘父已选入但不可用 | **已在设计中承接**（同类残留见 P3-AN-R3-2） | §3.4 第 4 层：父非 `loaded` 时不做键集差，记 `lineage_parent_unavailable`、`net_new_determined: false`，复制件数为 unknown；父为 `partial` 时父子进入未确认分区。第 6 层 (d) 随之不成立（现行 `_nested_failure` 的 `net_new_determined is False` 分支已覆盖）。T-19 的 180 / null 期望与 F5 构造一致，并列出了 `parent_not_selected` 既有断言（542 行）的改正 |
| P3-CR-3 生产 `assert` | **已在设计中承接** | §4.3：改为计算 `conserved`，为 false 时记 `group_conservation_failed`、完整总计 unknown、tokens 降为 partial，报告照常写出；T-20 调整计算顺序（先算分组再算 observation），并用 AST 测试检查。本会话 AST 实测：生产模块唯一的 `Assert` 在 1193 行 |

T-12：状态（已授权、未开始）、用户原话、授权范围（`budget-*.jsonl` / `review-budget-*.jsonl`，修复循环新增的同类文件也算在内；不含协调者会话、`~/.pi`、其他项目）、执行约束与依赖（T-11、T-13～T-20），都与 review.md 的处置节一致；未执行并经 Review 前，不判定 AC-008-1 / 008-3 通过。唯一不一致是修改范围的旧文字（P3-AN-R3-1）。

## 本会话实际执行的静态核对（未来测试命令一律未执行）

| 项 | 结果 |
|---|---|
| spec 冻结 | 锚定正文 SHA256 = `a504fed8…e823`；`- [ ] AC-` 27 条、`- [x]` 0 条；diff 不含 spec |
| 真实 diff | 只涉及 plan / review / tasks；`git diff --check 70291e3..HEAD` 退出 0；checklist.md 仍为 blob 04fe4b1（R3，未改） |
| AC 映射 | 脚本核对：spec AC 集合 27 = plan §5 表 27 行 = tasks 覆盖表 27 行，三者相等 |
| 测试名 | tasks 与 plan §5 的 `test_*` 集合双向差集为空；59 条 `-k` 表达式的名称都在 plan §5 中，与现有及新增测试名之间无子串碰撞；5 个新名称在现有测试文件中均不存在（属未来测试） |
| 任务结构 | T-16～T-20 完成标准与验证命令条数相等（3/3/3/3/4）；非 AC 条目均标“（非 AC）”；依赖 T-15→T-16→…→T-20 线性，T-12 依赖 T-11、T-13～T-20，无环；估时 0.5–2h（T-16 为 1.5–2h，满载） |
| 范围 / 工具 | 代码只在 3 个既有文件内；只用标准库（测试多用 `ast`）与既有 pytest / Git；无新依赖、功能、阈值或来源格式 |
| 三层数据 | F1～F14 原生合成，D1 仍是归一化域样例，T-12 已授权但未当作满足 |
| 退出码 / 六项度量 | §2 的 0 / 3 / 2 / 1 未改；§4.7 六项结构未改，只有 tool_calls 的 complete 条件多了两个阻断原因（与既有 `nested_incomplete` 同向收紧）；`nested_parent_unresolved` 不改变来源状态（`read_source` 的状态只取决于坏行 / 未 settled / 有无记录），所以不影响退出码 |
| 回归 | §4.2 收尾判据、§4.4 括号、§4.5 时间、§3.4 第 0～3 / 5 / 7 层未改；T-13～T-15 的条件只是从“来源缺口”扩展到“来源缺口或未确认分区”，全部 loaded 时输出不变 |
| 源码哈希 | 本会话复算 nested-tool-calls.js `62a69500…c034`、agent-session.js `436e8be3…1162`、agent-loop.js `22ee81f9…1129`、json-event.js `5f375647…d606`、print-mode.js `bb070a05…f13d`、extensions.md `46fc0bae…353c`、message-types.md `b832893f…5ff5db`，均与 plan §7 r5 一致 |
| 源码事实 | nested-tool-calls.js 106 行子 id `${callerId}/${n}`；111–117 / 138–145 / 156–164 行三类事件都带 `parentToolCallId`；129–133 行子 id 作为新作用域、共用同一记录器；36–38 行超过 256 条丢弃并记 `complete=false`；153–155 行嵌套结果不持久化，usage 只经记录器累加。agent-session.js 714–723 行在 toolResult `message_start` 时 `takeRecord`，附加 `nestedCalls` 并合并 usage，412 行 `_emit` 进入会话事件流。agent-loop.js 680–683 行 `message_start` / `message_end` 是同一个对象，所以 `message_end` 带 `nestedCalls`；417–466 行并行执行时先发出各父 start，最后依次发 toolResult |

## 非阻塞观察（不是发现）

1. 源码中 `takeRecord` 会删除父作用域（168–170 行）。如果工具在返回后仍调用 `ctx.executeTool()`，新作用域的编号从 `/1` 重新开始，同一父调用下可能出现重复的子 id。Plan 没有定义同一嵌套身份出现多次 start 时怎么处理（F2 注释写“记录器不产生重复 id”）。这种路径要求工具在返回后继续发起调用，可能性低；如果在实施中遇到，应按“配对不明 → 阻止 complete”的保守方向回报，不静默合并。
2. `nested_execution_incomplete` 没有专门的样例。在 1.4.0 的语义下，未完成的嵌套执行通常也会让记录 `complete=false`，从而由 `nested_incomplete` 阻断，所以风险低。
3. §4.3“空集原因”段中“净新增集为空（……被 `duplicate_of` 取代、被嵌套覆盖……）”这一括号说明，与第 4 层“净新增集 = 去除血缘复制件后”的定义不完全一致。T-18 的实现说明（在 `_aggregate_tokens` 处理空集）可以执行，Plan 措辞可以顺带收紧。
4. Plan 说 `nested_executed` 在混合来源下“注明范围”，但没有给出字段，T-17 也未涉及；由实施者选择最小表达即可。

## 外部条件与下一步

- 修正 P3-AN-R3-1～3（tasks / plan 文字，不涉及需求变更，不回 Clarify）后，对新固定提交重跑 Analyze；或由用户决定这些 P3 如何处置。之后由独立 A 做 Checklist R4（复核 r5 改动的 §3.3 / §3.4 / §4.2 / §4.3 / §4.7 规则，并判定 C-05 / C-09），全部勾选后才能开始 T-16。
- T-12 真实试点已授权，在 T-16～T-20 之后由协调者执行；本报告不读取、不运行试点数据。Implement、Review R2、Gate 2 均未授权。
