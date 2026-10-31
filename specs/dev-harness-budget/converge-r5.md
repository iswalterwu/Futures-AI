# Feature: dev-harness-budget v1 Converge 报告 R5（converge-r5.md）

> Converge 阶段产物（[workflow.md 第 9 步](../../docs/development/workflow.md#step-9)）。在 Review R1 修复任务 T-16～T-20 与 T-12 真实试点之后，逐项对比代码与冻结 spec、plan r7、tasks。
> 本报告**不是**独立 Review，**不是** Gate 2，也**不是** AC 验收；27 条 spec AC 仍全部未勾选。[Converge R1](converge.md)～[R4](converge-r4.md) 原文不动。

- **Converge R5 = `claude-opus-5-5 via claude-bridge`**（计划 / 分析类首选模型 + 首选通道）。协调者派工前在 claude-bridge 做了一次最小真实调用，成功（协调者陈述）。本会话没有换模型，没有改 provider / 路由 / key / 全局配置。新开会话，未写过本 feature 的代码；实施者是 `openai/gpt-6-astra`。
- **固定提交**：`e037e898f3eb4da51951d8d733342d5ab7a3f794`（`D:/2030/Futures-AI`，分支 `workbench`）。开始时 `git status --porcelain=v1 --untracked-files=all` 为空；全部测试、范围核对与冒烟结束时仍为空。写本文件前后，工作区出现两处**不是本会话写入**的改动：`specs/README.md` +1 行，以及未跟踪的 `specs/workflow-runtime/spec.md`（mtime 2026-10-31 10:51–10:52）。两者都不属于本 feature，本会话未读取、未修改，也未把它们作为输入；本报告的全部结论基于固定提交与此前的干净工作区。
- **本会话写入**：只新建本文件。没有追加任务（无差距），没有改 tasks.md、spec / plan / checklist* / analyze* / code-review* / converge*.md（R1～R4）/ review.md / HANDOFF / 索引 / 代码。没有 Git 写操作、联网、安装或派工。没有读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。pi 1.4.0 安装在 `~/.pi` 之下，本会话不进入该目录（同 R3 / R4），夹具真实性改按 plan §5 / §7 r5 已记录的源码核实顺序比对。合成冒烟在系统 Temp 的临时目录中进行，结束后已删除。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ e037e89（blob ee8e4ab）全文
docs/development/workflow.md @ e037e89（blob 4aca344）全文（重点：第 8～11 步、Gate 1 / Gate 2）
docs/development/model-routing.md @ e037e89（blob f980f5c）全文
backend/README.md @ e037e89（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ e037e89（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致；`- [ ] AC-` 27、`- [x] AC-` 0）
specs/dev-harness-budget/plan.md @ e037e89（blob 175fc2e，r7）全文
specs/dev-harness-budget/tasks.md @ e037e89（blob 72db104）全文（T-01～T-20）
specs/dev-harness-budget/checklist.md @ e037e89（blob 3e7a7d6，Checklist R4，23/23，文件 SHA256 879141f4…9d5c）全文
specs/dev-harness-budget/analyze-r5.md @ e037e89（blob 45c4e77）全文
specs/dev-harness-budget/code-review-r1.md @ e037e89（blob 2272b21）全文
specs/dev-harness-budget/converge-r4.md @ e037e89（blob 38b87a3）全文（含同类扫描表）
specs/dev-harness-budget/review.md @ e037e89（blob 4a776f6）自“Review R1”节至文末（含“第 8 批”“T-12 真实试点记录”）
真实 diff：git diff f5dbf63..HEAD -- backend（numstat：工具 +115/−28、测试 +233/−2、夹具 +49/−6；只涉 3 个既有文件）；git diff a868d25..HEAD（试点后只改 review.md +16、tasks.md T-12 状态行）
backend/tools/dev_harness_budget.py @ e037e89（blob e6b43e0）全文 1832 行；对照 f5dbf63（blob 3d81548）
backend/tests/test_dev_harness_budget.py @ e037e89（blob a6ab411）全文 2132 行；对照 f5dbf63（blob 3f9025a）
backend/tests/dev_harness_budget_fixtures.py @ e037e89（blob 0d11992）全文 459 行；对照 f5dbf63（blob ee1318c）
```

## 结论

**已收敛（T-01～T-11、T-13 及以后的离线实现，并含 T-12 试点记录）**。

- Review R1 的 P2-CR-1 与 P3-CR-1～3 已按 plan r7 在代码中修复，并有字面量测试守卫（逐项见下表）。T-13～T-15 无回归，T-14 的全 loaded 摘要哈希断言照过。
- tasks.md 中 T-01～T-11、T-13～T-20 的 59 条 `-k` 验证命令按原文逐条运行，全部通过。整模块 353 passed。后端全量 806 passed / 1 failed / 5 skipped：唯一失败是既有 netstat 监听断言；806 = 基线 772 + 本批新增 34（353 − 319），无新增失败。
- T-12 试点记录满足 T-12 两条完成标准的文字要求，且不含私有路径、会话 ID、提示词或报告原文。AC-008-1 / AC-008-3 是否接受，留给独立 A Review R2 与 Gate 2。
- AC 计数：已收敛 25；试点记录符合完成标准、待 Review 判定 2（AC-008-1 / AC-008-3）；差距 0。下一步可进入独立 A Review R2。

## Review R1 发现在代码中的修复核对

| 发现 | 代码位置（`dev_harness_budget.py`） | 是否按 plan r7 修复 | 证据 |
|---|---|---|---|
| P2-CR-1 嵌套执行计为 direct | `_read_pi_json_events` 分派：`parentToolCallId` 为非空字符串 → `_nested_event`，否则 → `_tool_event`；`_nested_event`；`NestedExecutionRecord` / `SourceFacts.nested_executions`；`_tool_counts` 的 `nested_executed` / `nested_deduplicated` 与两个新原因；`build_report` / `_tool_counts` 的 `all_total` 判定；`render_summary` 嵌套说明行 | 是 | 带父 id 的执行不追加到 `tools`，不进 direct，不参与 proposed_only 匹配（proposals 在循环后只对 `tools` 匹配）。父调用只在同一 owner 内解析：direct 恰一条优先；否则已解析嵌套子 id 恰一条，继承其 root；零条或多条 → root None + `nested_parent_unresolved`，仍按嵌套处理。不从 id 字符串推断。已解析者 `call_ref = _hash_ref("n", root + "\0" + 子 id)`，与 `_nested` 对记录的构造相同（root = 父 toolResult 所配对 direct 记录的 `call_ref`）。同一身份内 start / end 配对为 finished / unfinished / terminal_only。不读 `tool_execution_update`，raw id 只在读取器局部使用。direct 计数、分母与覆盖率只含 direct。`all_total` 在存在任何嵌套证据时为 unknown。夹具 F2 已改为真实形状（`call_0/1`、`call_0/2`，记录不重复，`call_0/2` 的 end 在父 toolResult 之后），F14 (a)～(f) 齐全。Review R1 的复现形状即 F14 (a)：direct 1、complete、分母 1 / 100% |
| P3-CR-1 未确认分区下“分母 0 / 缺失 0”与原因误用 | `build_report` 的 `unconfirmed_tokens` / `unconfirmed_tools`；`_observation`；`_groups`；`_aggregate_tokens(empty_reason=…)`；`render_summary` | 是 | tokens / 分组按来源级或记录级未确认计数，tool_calls 只按来源级计数；被生效 `duplicate_of` 取代、被嵌套覆盖的来源不进入 `uncertain`，因此不计入。有未确认分区时，分母 / 缺失 / 覆盖率为 null，另列 `unconfirmed_sources`（单位“来源”）。聚合不再追加 `no_usage_records_observed`，空的已确认集合改用 `no_confirmed_records`；逐来源聚合中，`empty` / `unavailable` 来源不追加这个空集原因。`no_usage_records_observed` 只经 `_source_gaps` 给 `empty` 来源 |
| P3-CR-2 血缘父已选入但非 loaded | `_lineage_partition`；`build_report` 的 `sources[]` | 是 | 先做形状检查，再判父状态：父非 `loaded` 时不做键集差，记 `lineage_parent_unavailable`、`net_new_determined: false`、`copied_entry_count: null`；父为 `partial` 时父子都进入未确认分区。凡 `net_new_determined is False`（`parent_not_selected`、`lineage_parent_unavailable`、`lineage_usage_conflict`、不支持形状），`copied_record_count` / `net_new_record_count` 为 null，摘要显示“未知”；无血缘来源仍为 0 / 全部。`_nested_failure` 对 `net_new_determined is False` 的子来源判 `nested_coverage_unverifiable` |
| P3-CR-3 生产 `assert` | `_groups`、`build_report` | 是 | `grep assert` 无输出（生产模块无 `assert`）。`conserved` 为计算值；先算 `groups` 再算 `observation`；false 时记 `group_conservation_failed`，完整总计置 unknown，tokens 由 complete 降为 partial，报告照常写出 |

T-16 / T-19 要求逐条记录的既有断言改正：`git diff f5dbf63..HEAD` 中测试文件只删了两行旧断言——`parent_not_selected` 与 `lineage_conflict` 的 `copied_record_count == 0`，改为 `is None` 并新增净新增 null 断言；`double_capture` 分支仍为 `== 0`。这与 review.md“第 8 批”所列一致，没有放宽断言。F2 修正后，direct 1、`nested_reported` 2、状态 partial 的既有期望不变（`test_tool_identity_and_views[nested_partial]` 照过）。

## 任务表

| 任务 | 状态 | 证据（本会话；计数为 `-k` 命令实际 passed 数） |
|---|---|---|
| T-01 骨架与清单校验 | 已收敛 | 命令 1 → 19 |
| T-02 读取框架与 session-v3 | 已收敛 | 命令 1～3 → 14 / 1 / 17 |
| T-03 json-events、收尾判据、重试标记 | 已收敛 | 命令 1～3 → 7 / 12 / 22 |
| T-04 token 聚合、完整总计、峰值 | 已收敛 | 命令 1～7 → 1 / 3 / 6 / 1 / 4 / 2 / 4 |
| T-05 来源关系去重 | 已收敛 | 命令 1～4 → 3 / 2 / 8 / 3 |
| T-06 嵌套覆盖 | 已收敛 | 命令 1～3 → 13 / 3 / 5 |
| T-07 尝试 / 工具 / 重试 / 返工 / 未观测 | 已收敛 | 命令 1～6 → 8 / 9 / 8 / 12 / 5 / 6（F2 改为真实形状后照过） |
| T-08 时间与执行结果 | 已收敛 | 命令 1～4 → 9 / 7 / 4 / 13 |
| T-09 维度、守恒、六项矩阵、D1 | 已收敛 | 命令 1～4 → 2 / 2 / 4 / 8 |
| T-10 摘要、CLI、写出、比较 | 已收敛 | 命令 1～5 → 5 / 12 / 3 / 4 / 15 |
| T-11 离线 / 隐私 / 仓库状态 + README | 已收敛 | 命令 1～7 → 1 / 2 / 3 / 7 / 6 / 1 / 1；命令 8 → 353；命令 9 → 806 / 1 / 5；命令 10 符合（见“命令”节）；README 工具表一行自 f5dbf63 未变 |
| T-12 真实试点 | 记录符合完成标准（待 Review R2 / Gate 2） | 见“T-12 试点记录核对” |
| T-13 覆盖分母（来源缺口） | 已收敛 | 命令 1 → 4；命令 2 → 353；命令 3 → 806 / 1 / 5 |
| T-14 分组节分母（来源缺口） | 已收敛 | 命令 1 → 4（全 loaded 摘要 SHA256 断言照过）；命令 2、3 同上 |
| T-15 token 节未知记录数 | 已收敛 | 命令 1 → 4（header 情形仍为“原因：no_usage_records_observed。”）；命令 2、3 同上 |
| T-16 嵌套执行读取与身份 | 已收敛 | 命令 1 → 15（F14 a～f、F2、8 个 F12 例；完成标准 1 的各集合关系逐条断言：(b) `root_ref` 相同、(c) root None 且原因计 2 次、(e)(f) `call_ref` 不同、F2 2 / 2 相等）；命令 2 → 7（F2 隐私样例含 `PRIVATE_PARENT_TOOL_CALL_ID` 哨兵，输出无哨兵，F2 已知小计 17）；命令 3 → 353 |
| T-17 嵌套视图、去重、判定 | 已收敛 | 命令 1 → 11（完成标准 1 字面量全部断言，含 session-v3 `nested_executed` null + `nested_events_not_persisted`、`{2,0,0,2}`、direct 3；另加 unfinished / terminal_only 两例覆盖 `nested_execution_incomplete`）；命令 2 → 15（F14 (a) 覆盖行与嵌套说明行字面量；(c) partial、分母 1；T-14 哈希照过）；命令 3 → 353 |
| T-18 未确认分区分母与空集原因 | 已收敛 | 命令 1 → 3（`double_capture` 退出 0、`sources=ok`、分母 / 缺失 / 百分比 null、`unconfirmed_sources` 2、四维分母未知、`no_confirmed_records`，整份报告无 `no_usage_records_observed`；`undeclared` tokens 1 / tool_calls 0、分母 1；F1 对照无未确认行）；命令 2 → 5；命令 3 → 353 |
| T-19 血缘父不可用 | 已收敛 | 命令 1 → 4（缺失 / 只有 header → 子 180 = 批次 180、“已确认去重”；坏行 → 170 / 180 单列、批次 null、“未完全去重”；链式 → `relation_shape_unsupported`；四例都不含“复制件由血缘父计”，C 段显示“复制件 未知 条；净新增记录 未知 条”）；命令 2 → 14；命令 3 → 353 |
| T-20 守恒改为计算 + 收尾回归 | 已收敛 | 命令 1 → 5（AST 无 `ast.Assert`；F1 + F2 四维 `conserved` true、187、无 `group_conservation_failed`）；命令 2 → 353；命令 3 → 806 / 1 / 5；命令 4 符合 |

文件范围：`git diff --name-only f5dbf63..HEAD -- backend` 只有 `tools/dev_harness_budget.py`、`tests/test_dev_harness_budget.py`、`tests/dev_harness_budget_fixtures.py` 三个既有文件，符合 T-16～T-20 的修改范围与 T-20 完成标准 4。

## T-12 试点记录核对（只依据 review.md 的脱敏记录与 Git 历史；未读取任何试点输入或输出）

| T-12 完成标准 / 约束 | 记录内容 | 判定 |
|---|---|---|
| 1. AC-008-1：经用户授权的真实批次 | 用户原话“全修，T-12同批完成，授权脱敏”。选入 `budget-*.jsonl` / `review-budget-*.jsonl` 共 35 段，即该范围内的全部文件；授权时为 27 段，节内已写明修复循环新生成的同类捕获同属授权范围。不含协调者会话与 `~/.pi` 下的会话 | 符合 |
| 1. 生成报告 | 退出 3；状态行 `sources=gaps loaded=33 partial=2 …; metrics_complete=1/6; overall_observation=incomplete`；stderr 空。T-12 验证命令 1 允许退出 0 或 3 | 符合 |
| 1. 无新增模型调用、不重跑任务 | “报告本身不发起模型或网络调用，未为测量重跑任何任务” | 符合（离线性另由 AC-001-3 测试证明） |
| 1. 写明“仅证明可用、非基线、不证明节省” | “仅证明工具对真实开发批次可用；不是统计上充分的基线，也不证明任何节省” | 符合 |
| 使用最终代码 | 基线 `a868d25`；三个代码文件 blob 自 `a868d25` 至 HEAD 不变（`git diff a868d25..HEAD` 只有 review.md / tasks.md） | 符合 |
| 2. AC-008-3：冻结 AC / checklist / 路由 / Gate 前后不变 | 报告前后 `git hash-object`（spec / checklist / review）与 `git status` 两次一致，记有状态摘要 SHA256。本会话独立佐证：spec blob `4689093`、checklist blob `3e7a7d6`（SHA256 `879141f4…`，即 Checklist R4）在 `a868d25` 与 HEAD 相同；`a868d25..HEAD` 只追加 review.md 16 行（无删除行）并改 tasks.md T-12 状态行 | 符合；该摘要的构造方式未记录，本会话无法逐字复算，但 Git 历史与记录一致 |
| 2. 顺序“前核对 → 报告 → 后核对 → 写记录” | 记录写明本记录与 T-12 状态行都在“后”核对之后写入 | 符合 |
| 2. 写明不构成该 feature 的验收、不以 desktop-shell / WI 完成为前提 | 两句均在记录中 | 符合 |
| 脱敏 | 记录只有计数、状态、原因类别、阶段名与模型 / 通道名；对 `[A-Za-z]:\`、`/Users/`、`AppData`、`/tmp/`、UUID 形 id 检索无命中，`.jsonl` 只出现在授权文件名模式中 | 符合 |

记录中的试点发现（OpenAI 通道 cacheWrite 恒报 0，未经 `confirmed_zero` 标注时记 unknown，因此 Implement 阶段不计入已知小计）属于 plan 已接受的保守口径（AC-003-4），不是代码差距。

## AC 表（27 条）

“已收敛”只表示代码和测试与规格对得上，不是验收；验收由独立 Review 与 Gate 2 决定。

| AC | 实现位置（`dev_harness_budget.py`） | 测试 / 手动步骤 | 状态 |
|---|---|---|---|
| AC-001-1 | `load_manifest` / `read_source`（只打开清单所列路径，不跟随 `parentSession`） | `test_only_selected_sources_opened`（审计 open 集合恰为清单 + 选定来源 + 3 个产物） | 已收敛 |
| AC-001-2 | `read_source`（时间戳不进入语义） | `test_historical_records_same_semantics` | 已收敛 |
| AC-001-3 | 全模块只用标准库，无网络 / 进程代码 | `test_zero_model_and_network_attempts`（F1 + 新形状 F2；先计数再拒绝，计数 0，退出 0，产物键集完整） | 已收敛 |
| AC-001-4 | `read_source` 原因类别、收尾判据、`_source_gaps`、`main`、`_write_artifacts` | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work` | 已收敛 |
| AC-002-1 | `_dimension_values` / `_groups`（`(未知)` 独立成组） | `test_missing_dimensions_unknown_group` | 已收敛 |
| AC-002-2 | `_dimension_values`（origin、`annotation_conflict`） | `test_annotation_origin_and_sources_untouched` | 已收敛 |
| AC-002-3 | `_groups`（逐维计算 `conserved`）、`build_report` 降级分支 | `test_group_conservation_per_dimension`、`test_group_conservation_computed_not_asserted` | 已收敛（降级分支按构造不可达，无测试打桩，符合 plan） |
| AC-003-1 | `normalize_usage` / `_aggregate_tokens` | `test_exclusive_dimensions_total_170` | 已收敛 |
| AC-003-2 | `normalize_usage`（子集、`totalTokens` 对账） | `test_subset_fields_and_unreconciled` | 已收敛 |
| AC-003-3 | `_aggregate_tokens` peak、`render_summary` | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` | 已收敛 |
| AC-003-4 | `_usage_value`、`confirmed_zero`、`_appended_entry`、`_aggregate_tokens`（`no_confirmed_records`）、`_source_gaps` | `test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_entry_appended_usage_records_counted`、`test_unconfirmed_partition_denominators_unknown` | 已收敛 |
| AC-004-1 | `_read_pi_json_events`（最终值只取 `message_end`）、`_nonmonotonic` | `test_cumulative_snapshots_final_12`、`test_nonfinal_partial_lower_bound_10` | 已收敛 |
| AC-004-2 | 归属者规则（`turn_end` / `agent_end` 不计；toolResult 只在 `message_end`；嵌套 `tool_execution_end.result.usage` 不读） | `test_repeated_message_counted_once`；`test_nested_views_dedup_and_direct_coverage[a]` 已知小计 345（嵌套结果中的 999 不计） | 已收敛 |
| AC-004-3 | `_validate_relations`、`_partition_sources`、`_lineage_partition`（含 `lineage_parent_unavailable`）、`_nested_partition` / `_nested_failure` | `test_relation_graph_rejected`、`test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`、`test_relation_shapes_unsupported_retain_facts`、`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage`、`test_lineage_parent_unavailable_not_determined` | 已收敛 |
| AC-005-1 | `_tool_event`、`_nested_event`、`_event_tool_result`、`_nested`、`_tool_counts` | `test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views`、`test_nested_execution_events_read_as_nested`、`test_nested_views_dedup_and_direct_coverage` | 已收敛 |
| AC-005-2 | `_retry_brackets` | `test_retry_requires_explicit_association`（12 种情形，`total` 恒 unknown） | 已收敛 |
| AC-005-3 | `_count_metrics` 的 `model_operations`、`_unobserved_paths`、`_nested_failure` | `test_covered_and_unobserved_paths`、`test_attempt_states_and_operation_records`、`test_nested_link_negative_cases`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-005-4 | `_rework`（只取标注） | `test_semantic_rework_annotation_only` | 已收敛 |
| AC-006-1 | `_source_timing` / `_aggregate_timing` | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source` | 已收敛 |
| AC-006-2 | `_source_timing` / `_outcome` | `test_timeout_known_duration_usage_unknown` | 已收敛 |
| AC-007-1 | `_observation`（来源缺口 / 未确认分区下分母 null，`missing_sources` / `unconfirmed_sources`）、`_groups`、`render_summary` | `test_summary_contents_units_denominators`、`test_all_known_aggregation_normalized_facts`（D1）、`test_coverage_denominator_unknown_with_source_gaps`、`test_group_denominator_unknown_with_source_gaps`、`test_token_unknown_records_unknown_with_source_gaps`、`test_nested_views_dedup_and_direct_coverage`、`test_unconfirmed_partition_denominators_unknown` | 已收敛 |
| AC-007-2 | 白名单抽取（`parentToolCallId` 只用于判定与哈希）、`_hash_ref`、标签正则、固定错误类别 | `test_privacy_sentinels_absent`（含 `PRIVATE_PARENT_TOOL_CALL_ID`）、`test_path_shaped_labels_rejected_not_echoed`；`test_nested_views_dedup_and_direct_coverage` 检索输出中无 `parentToolCallId` / 原始 id | 已收敛 |
| AC-007-3 | `_out_dir`（在仓库内 → 退出 2） | `test_repo_state_unchanged` | 已收敛 |
| AC-007-4 | `_load_comparison`（只投影元数据）/ `_comparability` | `test_comparability_flags_no_money` | 已收敛 |
| AC-008-1 | 试点（非代码） | T-12 手动步骤 1；review.md“T-12 真实试点记录” | 记录符合 T-12 完成标准 1；待 Review R2 / Gate 2 判定 |
| AC-008-2 | 夹具 F1 / F2 / F3 与 D1 | `test_synthetic_categories_covered` | 已收敛 |
| AC-008-3 | 试点流程 | T-12 手动步骤 2；review.md“T-12 真实试点记录” + 本会话 Git 佐证 | 记录符合 T-12 完成标准 2；待 Review R2 / Gate 2 判定 |

计数：已收敛 25，待 Review 判定 2，差距 0。

## plan 符合性抽查（测试可能漏掉的部分）

- **白名单与投影（§4.2）**：`parentToolCallId` 只在 `tool_execution_start` / `tool_execution_end` 分派时读取；`tool_execution_update` 不进入任何分支。`NestedExecutionRecord` 只存哈希引用与状态；`records.json`（`_detail_records`）只输出用量记录，与 T-17“不变”一致。
- **夹具形状（§5 F2 / F14，按 §7 r5 记录的源码顺序）**：F2 的“父 start → 嵌套 `call_0/1` start / end → 嵌套 `call_0/2` start → 父 end → toolResult start / end（`call_0/1` ok、`call_0/2` unfinished、`complete=false`）→ 嵌套 `call_0/2` end”与 plan §5 逐项一致。F14 (b) 的孙调用 `parentToolCallId = call_1/1`，记录按开始顺序三条；(e) 两个父 start 先发，嵌套事件交错；(f) 两轮各一个 `call_0/1`。均与 plan 一致。
- **边界冒烟（`python -I`，Temp，已删除）**：(1) F14 (a) 中把 `call_1/2` 的 end 移到下一条 assistant `message_end` 之后（跨 owner 作用域）→ direct 仍为 1，`nested_executed` 为 finished 1 / unfinished 1 / terminal_only 1 / 父未解析 1，tool_calls 降为 partial（`nested_execution_incomplete`、`nested_parent_unresolved`），分母 1。方向保守，与 Checklist R4 观察 2 的预期一致。(2) json-events F14 (a) 与带 `nestedCalls` 的 session-v3 父混选 → `nested_executed.observed_total` 2（只计 json-events），`nested_deduplicated` 逐来源相加为 3（matched 2、reported_only 1），direct 2。与 §3.3“混合时只计 json-events 并注明范围”一致。
- **工程准则（AGENTS §5）**：入口一次性校验（`parentToolCallId` 只判非空字符串）；`_nested_event` 与 `_tool_event` 对称，代表可命名的概念；守恒降级只是一个分支，没有新抽象；没有新依赖或工具（测试另用标准库 `ast`）；测试经公开接口调用真实实现，期望是字面量，替身只在声明的边界；未发现投机性复杂度。

## 非阻塞观察（不是差距，未追加任务）

1. `nested_executed.observed_total` 与 `nested_events_not_persisted` 按已确认计数集合判定。极端情况下（json-events 来源全部落入未确认分区、已确认集合只剩 session-v3），会显示“未持久化”。`scope` 字段已写明“选定且已确认去重的 pi-json-events 来源”，口径有披露。
2. 同一条未解析嵌套执行的 start 与 end 各在来源 `reasons` 中追加一次 `nested_parent_unresolved`（T-16 测试按 2 次断言）。只是原因列表有重复，不影响计数。
3. F14 在第二个 assistant 轮次前多写了一组 `agent_start` / `turn_start`，前面没有对应的 `agent_end`。读取器只把这些当运行活动、不计数，不影响任何断言；与真实流在形状上有细微差别。
4. Checklist R4 的 P3-R4-1（plan / tasks 头部输入清单缺 r6 / r7 行）仍未补：plan.md blob 自 R4 起未变。这是过程记录缺口，不是代码与规格之间的差距。review.md 头部“当前状态”文字滞后，同 Analyze R4 / R5 的观察。
5. T-12 记录中的“状态摘要 SHA256”没有写明构造方式，无法逐字复算；不过 spec / checklist blob 不变与 `a868d25..HEAD` 只追加记录这两点，已由 Git 历史独立佐证。
6. 峰值行“参与记录数 / 尝试总数”的措辞问题（Converge R3 / R4 观察 1）未变；改措辞须先过 Plan。

## 本会话实际运行的命令与结果

验证命令按 tasks.md 原文（含 `cd backend &&`）在仓库根执行；Git 命令在仓库根执行。

- 从 tasks.md“## 任务”节提取 T-01～T-11、T-13～T-20 的全部 pytest 验证命令，共 73 条：`-k` 命令 59 条，整模块命令 9 条（文本相同），全量命令 5 条（文本相同）。T-12 是手动命令，不在其中。59 条 `-k` 命令**按原样逐条**运行，全部通过，无 failed（各条计数见任务表）。
- `cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → **353 passed**（6.45 s，退出 0）。9 条文本相同的命令共用这次结果。
- `cd backend && python -m pytest tests/ -q` → **806 passed / 1 failed / 5 skipped**（157.73 s）。唯一失败：`tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（netstat 非空监听断言），即既有基线。相对 Converge R4 / Review R1 实测的 772 / 1 / 5，多出的 34 个通过用例全部来自本批（模块 319 → 353）。5 条文本相同的命令共用这次结果。
- T-11 命令 10 / T-20 命令 4：`git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出（退出 1）；`git diff --exit-code -- backend/pyproject.toml .gitignore` 退出 0，`f5dbf63..HEAD` 区间也退出 0；`git status --porcelain=v1 --untracked-files=all` 在开始时、以及全部测试与冒烟之后均为空（之后出现的两处他人改动见头部）。
- `git diff --check f5dbf63..HEAD` 退出 0；`grep -n assert backend/tools/dev_harness_budget.py` 无输出。
- 冻结 spec 正文 SHA256 复算：`a504fed8…e823`，一致；AC 未勾选 27、已勾选 0。
- T-12 佐证：`git rev-parse a868d25:<path>` 与 `HEAD:<path>` 对比 spec / checklist / review / tasks；`git diff --stat a868d25..HEAD`（review.md +16、tasks.md ±1，review.md 无删除行）；`sha256sum specs/dev-harness-budget/checklist.md` = `879141f4…9d5c`；对 review.md 试点节做私有路径 / id 形态检索。
- 合成冒烟：`python -I`，脚本与数据分放在系统 Temp 的两个临时目录，经公开接口 `load_manifest` → `read_source` → `build_report` 运行两种边界输入（见“plan 符合性抽查”），结束后删除。

## 追加的任务

无。本轮没有发现代码与 spec / plan / tasks 之间的差距，tasks.md 未改动。

## 下一步与边界

- 按 model-routing，由独立审核员 A（新开会话，与实施隔离、与实施模型不同，首选 `claude-fable-5-1`，先测 bridge）依 spec + plan + tasks + 真实 diff 做 Review R2，判定 Review R1 四项发现是否关闭，以及 AC-008-1 / AC-008-3 的试点证据是否接受。Review 后由用户确认结论（Gate 2），才可 Handoff。
- 本报告**不是**独立 Review，**不是** Gate 2，**不是** AC 验收，也不授权 Handoff、PR 或 merge；27 条 spec AC 保持未勾选。
