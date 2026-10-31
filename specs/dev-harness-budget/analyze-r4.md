# Feature: dev-harness-budget v1 Analyze 报告 R4（analyze-r4.md）

> Analyze 阶段产物（[workflow.md 第 7 步](../../docs/development/workflow.md#step-7)）：只读报告 spec / plan r6 / tasks 之间的冲突、差距与模糊处。
> 本报告**不修复**任何输入，不勾选 / 豁免任何 checklist 项，不授权 Implement；质量判定 ≠ 任务执行 / AC 完成 / Checklist 批准。[Analyze R1](analyze.md)、[R2](analyze-r2.md)、[R3](analyze-r3.md) 原文保留不动。

- **Analyze R4 = `claude-opus-5-5 via claude-bridge`**（计划类首选模型 + 首选通道）。协调者派工前在 claude-bridge 做了一次最小真实调用，成功（协调者陈述）；本会话未换模型，未改 provider / 路由 / key / 全局配置。新开会话，与 Plan r5 / r6 作者会话分离；是唯一有效的 Analyze R4。
- **固定提交**：`4acd8ddc2a3fbbb5a5c634efcdd46254fb6cf1da`（`D:/2030/Futures-AI`，分支 `workbench`；开始时 `git status --porcelain` 为空）。本会话唯一写入 = 新建本文件（派工说明“输出”节写作 `analyze-r2.md`，与边界节“只新建 analyze-r4.md、R1～R3 只读”冲突，按边界节执行）。无 Git 写操作、无网络、无安装、无派工、无测试，未 import 模块；未读真实 `~/.pi` 会话、actor / agent 日志、Temp 负载或试点数据。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ 4acd8dd（blob ee8e4ab）全文
docs/development/model-routing.md @ 4acd8dd（blob f980f5c）全文
docs/development/workflow.md @ 4acd8dd（blob 4aca344）全文（总规则、第 6～8 步、Gate 1 / Gate 2）
templates/tasks.md @ 4acd8dd（blob 4b7f955）全文
specs/dev-harness-budget/spec.md @ 4acd8dd（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算）
specs/dev-harness-budget/plan.md @ 4acd8dd（blob 933c443，r6）全文 403 行
specs/dev-harness-budget/tasks.md @ 4acd8dd（blob 941b9a6）全文 495 行
specs/dev-harness-budget/analyze.md（2caea51）、analyze-r2.md（b96ddab）、analyze-r3.md（e7fbc98）@ 4acd8dd 全文
specs/dev-harness-budget/checklist.md @ 4acd8dd（blob 04fe4b1，Checklist R3，只覆盖 r4）全文
specs/dev-harness-budget/code-review-r1.md @ 4acd8dd（blob 2272b21）全文；converge-r4.md（38b87a3）全文
specs/dev-harness-budget/review.md @ 4acd8dd（blob d39a269）头部，以及“Review R1”节至文末
真实 diff：git diff 70291e3..HEAD（analyze-r3 / plan / review / tasks，+335/−41）；git diff 81c6176..HEAD（plan / review / tasks，+36/−8）
现行代码（只读，判断可实施性）：backend/tools/dev_harness_budget.py（3d81548）544–575、654–810、1310–1470 行；
  backend/tests/dev_harness_budget_fixtures.py（ee1318c）f2_rows、tool_result_events、f5_sources、f8_sources；
  backend/tests/test_dev_harness_budget.py（3f9025a）150–175、373–381、530–566、660–745、1690–1715 行与断言检索
pi 1.4.0 公开安装包（有界只读，包相对路径）：复算 7 个文件 SHA256；nested-tool-calls.js parentToolCallId / 子 id / complete 检索；
  agent-session.js 708–727 行（未打开任何 .md 阅读内容）
```

## 结论

**NOT PASSED**：0 P1 / 0 P2 / **2 P3**。

Analyze R3 的三项 P3 均已由 r6 解决（见下表）；Review R1 四项发现仍在 plan + tasks 中有完整的设计承接，r6 未引入回归。冻结 spec 未变，27 条 AC 均未勾选；退出码 0 / 3 / 2 / 1 与六项度量矩阵仍与已接受设计一致。剩余两项 P3 都在 tasks 层：一项是 T-16 的过时闸门引用，另一项是 r5 改为“自观测”试点后 T-12 验证顺序的歧义。两项都不影响 Review R1 四项发现的设计正确性。按第 7 步，应修正后重跑 Analyze，或由用户决定按 P3 处置。

本结论只是一致性分析。它**不是**任务执行、AC 完成、Checklist 批准或 Implement 授权；C-05 / C-09 与 r5 / r6 规则只能由独立 A 在 Checklist R4 中判定。

## 发现

### P3-AN-R4-1 T-16 的闸门依赖引用了未通过、且不会再改的 Analyze R3

- **位置**：tasks.md T-16“依赖”（第 347 行）：“T-15；且 Analyze R3 通过、有效 checklist（R4）全部勾选”。同类过时文字：tasks.md 头部“r5 现状”（第 4 行）、“Review R1 发现的承接”表标题（第 481 行）、“阶段边界”第一条（第 492 行）仍写 Analyze R3 为下一步。
- **具体情形**：analyze-r3.md 的结论是 NOT PASSED，文件按规则不再改写，r6 之后的重跑是 Analyze R4。按字面，T-16 的前置条件永远无法满足；实施者要么卡住，要么自行把它解释成“最新一轮 Analyze”。这是闸门条件，不是历史记录。r6 只加了头部一行，没有更新这条依赖。
- **修复方向**：T-16 依赖改为“最新一轮 Analyze（R4 或其后重跑）通过，且有效 checklist（R4）全部勾选”。头部 / 承接表 / 阶段边界的 r5 文字可以保留为历史，但需加一句当前下一步为 Analyze R4 → Checklist R4。

### P3-AN-R4-2 自观测试点下，T-12 的前后哈希核对与写入试点记录的先后顺序不明

- **位置**：tasks.md T-12 完成标准 2 与验证命令 1 / 2（状态行写明“下列完成标准与验证命令不变”）；plan §5 AC-008-3 行。
- **具体情形**：r5 把试点批次定为“本功能各阶段子会话”的捕获，所以被观测 feature 就是 dev-harness-budget 本身。验证命令 1 包含“在 review.md 写入脱敏记录”；验证命令 2 要求“运行前后”对 `specs/<被观测 feature>/review.md` 做 `git hash-object`，同时比较 `git status`，并要求两次输出一致。如果按编号先完整执行命令 1（包括写入记录）再做“后”核对，`specs/dev-harness-budget/review.md` 的哈希和 `git status` 必然改变。结果要么误判 AC-008-3 不成立，要么核对者对差异自行解释。在 r4 时，试点对象由用户另选、通常是其他 feature，因此不存在这个问题。`<被观测 feature>` 占位符也没有落实。
- **修复方向**：T-12 只改文字，不改标准：把 `<被观测 feature>` 写明为 `dev-harness-budget`；写明顺序为“前”哈希 / status → 运行报告命令 → “后”哈希 / status → 再写脱敏记录（记录本身不属于被比较的状态）。plan §5 AC-008-3 行可以同步加一句。

## Analyze R3 发现的解决情况

| 发现 | 结论 | 理由（依据 4acd8dd 原文与 81c6176..HEAD diff） |
|---|---|---|
| P3-AN-R3-1 T-12 修改范围与授权冲突 | **已解决** | T-12 修改范围已改为由协调者编写清单，只列 `budget-*.jsonl` / `review-budget-*.jsonl`；清单与 out-dir 都放在系统 Temp 下本功能临时目录；删去 `%LOCALAPPDATA%` 示例与“用户编写清单”。与状态行、review.md 授权节一致。plan §2 的 `%LOCALAPPDATA%` 只是工具的一般建议，不约束试点，不冲突。验证顺序是新问题，见 P3-AN-R4-2 |
| P3-AN-R3-2 净新增不可确定时仍显示“复制件 0 条” | **已解决** | 采用方向 (a)。§3.4 第 4 层、§3.6 `sources[]`、§5 AC-004-3、T-19 已统一为：凡 `net_new_determined: false`（`parent_not_selected` / `lineage_parent_unavailable` / `lineage_usage_conflict` / 处于 `relation_shape_unsupported` 分量），复制件数与净新增数都为 null，摘要显示“未知”；无血缘来源仍为 0 / 全部。代码核对：`_lineage_partition` 在形状跳过时也会写入 `{parent, net_new_determined: False}`（1403–1405 行），所以 T-19 的“lineage 存在且为 false”条件覆盖全部四种情形；链式重复变体（C dup P、D dup C）的 targets 为 {P, C}，会判为不支持形状，C 180 / P 170 保留，与完成标准 2 的期望一致。既有断言中只有 542、565 两处依赖 0，T-19 已明列改正（565 只改 `lineage_conflict` 分支）；683 行与 F8 的 lineage 正例仍为 1 / 1，不受影响；F1 不带 `parentSession`，T-14 的摘要哈希不受影响。完成标准 2 ↔ 验证命令 2 一一对应 |
| P3-AN-R3-3 F2 的 matched 2 没有进入完成标准 | **已解决** | T-16 完成标准 1 已加入“F2 已解析嵌套执行 `call_ref` 集合 = 父 toolResult 记录 `call_ref` 集合（2 / 2）”，由验证命令 1 承接。可实施性：`f2_rows` 中 toolResult 之后依次是 `turn_end` / `agent_end` / `agent_settled`，中间没有新的 assistant `message_end`，所以 `call_0/2` 在父结果之后的 end 仍在同一 owner 作用域内，可以解析到 direct `call_0` 并配对为 finished；`_nested` 的记录身份是 `_hash_ref("n", tool.call_ref + "\0" + id)`（557–573、807 行），与 plan 的执行身份构造相同 |

## Review R1 发现的设计层解决情况（代码后续修复；是否关闭由 Review R2 判定）

| 发现 | plan + tasks | 依据 |
|---|---|---|
| P2-CR-1 嵌套执行计为 direct | **已承接** | §2 / §3.2 / §3.3 / §4.2 / §4.7 / §5 / §6 与 T-16、T-17 未被 r6 改动，Analyze R3 的核对仍然成立：白名单读取 `parentToolCallId`，但只在内部使用；嵌套执行永不进入 direct；在同一 owner 作用域内解析父调用，零个或多个候选时记 `nested_parent_unresolved`；身份与 `nestedCalls` 同法构造，并按 matched / executed_only / reported_only 去重；direct 的分母与覆盖率不含嵌套执行；`all_total` 保守处理；F2 改为真实形状；F14 (a)～(f) 已列出。本会话复核源码：nested-tool-calls.js 106 行子 id 为 `${callerId}/${n}`，116 / 144 / 163 行三类事件都带 `parentToolCallId`，76 行有 unfinished 时 `complete=false`（与 F2 的记录一致），153 行“Nested results are not persisted”；agent-session.js 714–723 行在 toolResult `message_start` 时 `takeRecord`，并合并 usage |
| P3-CR-1 未确认分区下“分母 0 / 缺失 0”、原因误用 | **已承接** | §4.3 两段与 T-18 未变。核对夹具：F5 `double_capture` 的两个来源同会话且都已加载 → tokens / tool_calls 的未确认来源均为 2，退出码 0；F8 `undeclared` 只在 P 上有记录级未确认 → tokens 为 1、tool_calls 为 0、direct 分母 1。期望可以由规则唯一推出 |
| P3-CR-2 血缘父已选入但不可用 | **已承接**，r6 已补齐同类情形 | §3.4 第 4 层 / 第 6 层 (d) 与 T-19；`_nested_failure` 现有的 `net_new_determined is False` 分支已经覆盖 (d)（1463–1464 行） |
| P3-CR-3 生产 `assert` | **已承接** | §4.3 与 T-20 未变；用 AST 检查无 `assert`，并在 `conserved` 为 false 时诚实降级 |

T-12：状态（已授权、未开始）、用户原话、授权范围、执行约束与依赖（T-11、T-13～T-20），都与 review.md“用户对 Review R1 的处置与试点授权”节一致；修改范围已对齐（见上表）。未执行并经 Review 前，不判定 AC-008-1 / 008-3 通过。唯一的新问题是 P3-AN-R4-2。

## 本会话实际执行的静态核对（未来测试命令一律未执行）

| 项 | 结果 |
|---|---|
| spec 冻结 | 锚定正文 SHA256 = `a504fed8…e823`；`- [ ] AC-` 27 条，`- [x]` 0 条；两段 diff 都不含 spec |
| 真实 diff | 70291e3..HEAD 只涉及 analyze-r3 / plan / review / tasks；81c6176..HEAD 只涉及 plan / review / tasks；`git diff --check 70291e3..HEAD` 退出 0；checklist.md 仍为 blob 04fe4b1；无代码改动（工具 / 测试 / 夹具 blob 与 R3 相同） |
| r6 范围 | plan 只改头部 r6 行、输入清单 r6 段、§3.4 第 4 层、§3.6 `sources[]`、§5 AC-004-3 行与 §7 r6 表；tasks 只改头部 r6 行、T-12 修改范围、T-16 完成标准 1，以及 T-19 修改范围 / 完成标准 2 / 验证命令 2。与作者声明一致 |
| AC 映射 | 脚本核对：spec AC 27 = plan §5 表 27 行 = tasks 覆盖表 27 行，集合相等 |
| 测试名 | tasks 与 plan §5 的 `test_*` 集合双向差集为空；60 条 `-k` 表达式中的名称都在 plan §5 中，名称之间没有子串碰撞；5 个 r5 新测试名在现有测试文件中出现 0 次（属未来测试） |
| 任务结构 | T-01～T-20 完成标准与验证命令条数逐任务相等（T-16～T-20 为 3/3/3/3/4）；非 AC 条目均标“（非 AC）”；依赖为 T-15→T-16→…→T-20，T-12 依赖 T-11、T-13～T-20，无环；估时 0.5–2h |
| 范围 / 工具 | 代码只在 3 个既有文件内；只用标准库（测试另用 `ast`）与既有 pytest / Git；无新依赖、功能、阈值或来源格式 |
| 三层数据 | F1～F14 为原生合成样例，D1 仍是归一化域样例，T-12 已授权但未当作已满足 |
| 退出码 / 六项度量 | §2 的 0 / 3 / 2 / 1 未改；§4.7 六项结构未改，r6 未触及 |
| 回归 | r6 只改变 null 与 0 的展示，不改变分区、已知小计或完整总计；§4.2 收尾判据、§4.4、§4.5、§3.4 第 0～3 / 5 / 7 层未改；T-13～T-15 的条件扩展（r5）未被 r6 改动 |
| 源码哈希 | 复算 nested-tool-calls.js `62a69500…`、agent-session.js `436e8be3…`、agent-loop.js `22ee81f9…`、json-event.js `5f375647…`、print-mode.js `bb070a05…`、extensions.md `46fc0bae…`、message-types.md `b832893f…`，均与 plan §7 r5 一致 |

## 非阻塞观察（不是发现）

1. T-19 完成标准 2 要求 `parent_not_selected` 与 `lineage_conflict` 的 `summary.md` 显示“未知”，但对应的既有测试经 `report_sources` 只得到 `build_report` 的结果，不生成摘要。修改范围只列了 JSON 断言的改正。实施时需要在这些测试或新测试中补调 `render_summary` 并断言摘要，不能只改 JSON 断言就认为满足该条。
2. review.md 头部“当前状态”和 tasks.md 头部仍停留在 r5 时的“待 Analyze R3”。这些是记账文字，按 P3-AN-R4-1 顺带更新即可。
3. Analyze R3 的非阻塞观察 1～4（`takeRecord` 后子 id 可能重复编号、`nested_execution_incomplete` 无专门样例、§4.3 空集括号措辞、`nested_executed` 混合范围的字段）仍然适用，r6 没有涉及。

## 外部条件与下一步

- 修正 P3-AN-R4-1 / R4-2（只改 tasks 文字，可选同步 plan §5 一句，不涉及需求变更，不回 Clarify）后，对新固定提交重跑 Analyze；或由用户决定这两项 P3 如何处置。之后由独立 A 做 Checklist R4（复核 r5 / r6 改动的规则，并判定 C-05 / C-09），全部勾选后才能开始 T-16。
- T-12 真实试点已授权，在 T-16～T-20 之后由协调者执行；本报告不读取、不运行试点数据。Implement、Review R2、Gate 2 均未授权。
