# Feature: dev-harness-budget v1 Converge 报告 R7（converge-r7.md）

> Converge 阶段产物（[workflow.md 第 9 步](../../docs/development/workflow.md#step-9)）：在 T-22（Converge R6 差距）之后，逐项对比代码与冻结 spec、plan r7、tasks。
> 本报告**不是**独立 Review，**不是** Gate 2，也**不是** AC 验收；27 条 spec AC 仍全部未勾选。[Converge R1](converge.md)～[R6](converge-r6.md) 原文不动。

- **Converge R7 = `claude-opus-5-5 via claude-bridge`**（计划 / 分析类首选模型 + 首选通道）。协调者派工前在 claude-bridge 做了一次最小真实调用，成功（协调者陈述）。本会话没有换模型，没有改 provider / 路由 / key / 全局配置。新开会话，未写过本 feature 的代码；实施者是 `openai/gpt-6-astra`。
- **固定提交**：`2d84e7b7508b3d09767fc2f4da0ab2fd4c4c28b6`（`D:/2030/Futures-AI`，分支 `workbench`）。本 feature 的文件在工作区中与 HEAD 一致。工作区另有其他会话（workflow-runtime）的未提交改动：`specs/README.md`、`docs/architecture.md`、`docs/interaction.md`、`docs/plan.md`，以及未跟踪的 `docs/decisions/20261031-workflow-runtime-v1.md`、`specs/workflow-runtime/spec.md`。这些不属于本 feature，本会话没有读取、修改，也没有作为输入；范围核对时已排除。
- **本会话写入**：只新建本文件。没有追加任务（无差距），没有改 tasks.md、spec / plan / checklist* / analyze* / code-review* / converge.md～converge-r6.md / review.md / HANDOFF / 索引 / 代码。没有 Git 写操作、联网、安装或派工。没有读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据；T-12 只依据 review.md 的脱敏记录与 Git 历史判断。合成冒烟在系统 Temp 的两个独立目录中用 `python -I` 运行（脚本与数据分开存放），结束后已删除。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ 2d84e7b（blob ee8e4ab）全文
docs/development/workflow.md @ 2d84e7b（blob 4aca344）全文（重点：第 8～11 步、Gate 1 / Gate 2）
docs/development/model-routing.md @ 2d84e7b（blob f980f5c）全文
backend/README.md @ 2d84e7b（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ 2d84e7b（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致；未勾选 AC 27 条、已勾选 0 条）
specs/dev-harness-budget/plan.md @ 2d84e7b（blob d416e3a，r7 + 头部记账补正）全文
specs/dev-harness-budget/tasks.md @ 2d84e7b（blob 61a4ec6，T-01～T-22）全文
specs/dev-harness-budget/checklist.md @ 2d84e7b（blob 3e7a7d6，Checklist R4，23/23，文件 SHA256 879141f4…9d5c）全文
specs/dev-harness-budget/analyze-r5.md（45c4e77）、code-review-r1.md（2272b21）、code-review-r2.md（775dfdd）、converge-r5.md（cf3d072）、converge-r6.md（db84203）@ 2d84e7b 全文
specs/dev-harness-budget/review.md @ 2d84e7b（blob e0b4c89）“Review R1”节至文末（含用户对 R1 / R2 的处置、第 8～10 批、T-12 试点记录与重跑记录、Converge R6）
真实 diff：git diff 5aebb03..HEAD -- backend（工具 +18/−10、测试 +103；只涉 2 个既有文件）；git diff 915a145..HEAD（T-22：工具 +2/−1、测试 +39/−1、tasks.md T-22 状态行、review.md +6）
backend/tools/dev_harness_budget.py @ 2d84e7b（blob ccf325f）全文 1840 行
backend/tests/test_dev_harness_budget.py @ 2d84e7b（blob 9ffd5e2）全文 2235 行
backend/tests/dev_harness_budget_fixtures.py @ 2d84e7b（blob 0d11992，自 5aebb03 未变）全文 459 行
```

未读 pi 1.4.0 安装包：本批夹具未变，T-22 测试只内联 session-v3 行（header + `parentSession`、复制条目、追加 assistant），形状与 plan §3.4 第 4 层及 §7 已核实的 fork 复制方式一致，无需再核。

## 结论

**已收敛（T-01～T-11、T-13～T-22 的离线实现，并含 T-12 试点及重跑记录）**，未追加任务。

- **G-R6-1 已关闭**：T-22 让 tool_calls 的未确认来源数与 tokens 一样排除被生效 `duplicate_of` 取代、被嵌套覆盖的来源。R6 的复现形状已作为 `test_unconfirmed_sources_exclude_replaced_and_covered[replaced_lineage_partial]` 守卫，结果 tokens / tool_calls / 四维分组均为 2。同类计数已一次扫完，没有残留（见“同类扫描”）。
- Review R2 的 P3-CR2-1、P3-CR2-2 已由 T-21 修复，无回归；P3-R4-1 已记录在 plan / tasks 头部输入清单中。Review R1 的 P2-CR-1、P3-CR-1～3 的修复仍在，T-13～T-15 无回归。
- tasks.md 中 T-01～T-11、T-13～T-22 的 63 条 `-k` 验证命令逐条按原文运行，全部通过。整模块 **357 passed**。后端全量 **810 passed / 1 failed / 5 skipped**：唯一失败是既有 netstat 监听断言；810 = 基线 809 + T-22 新增参数 1（模块 356 → 357），无新增失败。
- T-12：首次试点与 T-21 后的重跑记录满足 T-12 两条完成标准的文字要求，不含私有信息；试点范围 35 段已由用户确认。
- AC 计数：已收敛 25；试点记录符合完成标准、待 Review R3 / Gate 2 判定 2（AC-008-1 / AC-008-3）；差距 0。
- 下一步：独立 A Review R3 → Gate 2。

## Converge R6 差距与同类扫描

### G-R6-1（T-22）在代码中的核对

- **代码**：`build_report` 中 `unconfirmed_tools = sum(bool(partition.uncertain[sid]) for sid in by_id if sid not in partition.replaced and sid not in partition.covered)`，排除条件与 `unconfirmed_tokens` 相同。逐来源 `unconfirmed_reasons` 未变（T-22 修改范围要求保留逐来源事实）。tool_calls 仍只计来源级未确认，按构造是 tokens 计数（来源级或记录级）的子集。
- **测试**：`replaced_lineage_partial` 参数逐项断言 T-22 完成标准 1：退出 3、stderr 空、`relations[0].effective` 为 true、S `replaced_by` = X、tokens 与 tool_calls `unconfirmed_sources` 均为 `{"count": 2, "unit": "来源"}`、四维分组均为 2、tool_calls 分母 null、摘要含“tokens：未确认去重来源 2 来源；tool_calls：2 来源；”。另断言三来源 `unconfirmed_reasons` 都是 `lineage_parent_unavailable`、已知值 170 / 180 / 180 单列、批次已知小计与完整总计为 null。`duplicate_replaced` / `nested_covered` 两个既有参数的断言未改（`git diff 915a145..HEAD` 对测试文件只改了 parametrize 行，并在函数开头新增该分支）。

### 同类扫描：report.json 与 summary.md 中的全部未确认 / 缺失来源计数

| 计数 | 来源 | 是否排除被取代 / 被覆盖来源 | 结论 |
|---|---|---|---|
| `observation.metrics.tokens.unconfirmed_sources` | `unconfirmed_tokens` | 是（T-21） | 一致 |
| `observation.metrics.tool_calls.unconfirmed_sources` | `unconfirmed_tools` | 是（T-22） | 一致 |
| `groups.<维度>.unconfirmed_sources`、`unconfirmed_excluded` | `unconfirmed_tokens` | 是 | 一致 |
| `tokens.deduplication` / `deduplication_label` | `unconfirmed_tokens > 0` | 是 | 一致 |
| tokens / tool_calls / 分组的 `denominator`、`missing`、`coverage_percent` | `missing_sources` 或上述两个计数 | 是 | 一致 |
| `sources[].unconfirmed_record_count` | `partition.uncertain_records`（只由 `_nested_partition` 写入） | 是（T-21 跳过 replaced / covered） | 一致 |
| `missing_sources`（tokens / tool_calls / 分组，单位“来源”） | `status != "loaded"` 的来源数 | 不需要：`duplicate_of` 生效要求双方 `loaded`，嵌套覆盖前提 (a) 要求全部成员 `loaded`，被取代 / 被覆盖来源按构造不会是非 loaded | 一致 |
| summary.md 的“tokens：未确认去重来源 n 来源；tool_calls：m 来源”行、“非 loaded 选定来源 n 来源”行、token 节“未知用量归属记录数 未知”条件、分组节“分母 未知” | 全部取自 `observation.metrics.*` 与 `groups.*.denominator` | 继承上述排除 | 一致 |
| `sources[].unconfirmed_reasons` | 逐来源事实 | 有意不排除（plan §3.4 第 3 层：被取代来源的逐来源事实保留） | 符合 plan |
| `retries.semantic_rework.missing_sources`、`timing.known_sources` / `partial_sources` | 返工标注 / 时间标注，与去重无关；plan §4.5 规定时间不服从 token 去重分区 | 不适用 | 符合 plan |

合成冒烟（经 `main`）：(1) 血缘父 P 与子 C 都被逐字副本取代（P `duplicate_of` Y、C `duplicate_of` X，C 与 P 的复制条目用量冲突）→ tokens / tool_calls / 四维分组未确认来源数均为 1（只计未被取代的 X），分母 null，“未完全去重”；(2) F8 `equal`（C1 被嵌套覆盖）再加一个坏行来源 → 未确认来源数 0、`missing_sources` 1、tokens / tool_calls 分母 null、已知小计 380；(3) F5 `double_capture` 的 json-events 来源 `duplicate_of` P 且链接生效 → 未确认来源数 0、退出 0。三例都与 plan §4.3 的口径一致。

## Review R2 / R1 发现在代码中的核对

| 发现 | 是否按 plan 修复 | 证据（本会话） |
|---|---|---|
| P3-CR2-1 `nested_executed` 误报 `nested_events_not_persisted` | 是 | `build_report` 以全部选定来源计算 `selected_has_json_events`，传入 `_count_metrics` → `_tool_counts`；已确认集合中没有 json-events、但选定中有时记 `overlap_unconfirmed`，只有选定来源全部为 session-v3 时才记 `nested_events_not_persisted`；逐来源调用传 `fact.format == "pi-json-events"`，行为等价。`test_nested_executed_reason_uses_selection` 与 `test_nested_views_dedup_and_direct_coverage[session]` 通过 |
| P3-CR2-2 tokens / 分组未确认来源数计入被取代来源 | 是 | `_nested_partition` 未声明分支跳过 replaced / covered；`unconfirmed_tokens` 排除这两类。`[duplicate_replaced]` / `[nested_covered]` 通过（tokens 1 / 0、tool_calls 0、S 未确认记录 0、X 为 1、已知小计 340 / 完整总计 210） |
| P3-R4-1 plan / tasks 头部输入清单缺 r6 / r7 | 已记录 | plan.md 输入清单代码块内有 r6、r7 行与“记账补正 @ 39fa979”行；tasks.md 输入清单有 r6 / r7 / r8 行。T-22 批未改 plan.md |
| P2-CR-1 嵌套执行计为 direct | 仍已修复 | T-22 未触及 `_read_pi_json_events` / `_nested_event` / direct 计数；T-16 / T-17 命令 15 / 7 / 11 / 15 passed，F14 (a) direct 1、tool_calls complete、分母 1 / 100% |
| P3-CR-1 未确认分区分母与空集原因 | 仍已修复 | T-18 命令 3 / 5 passed |
| P3-CR-2 血缘父不可用 | 仍已修复 | T-19 命令 4 / 14 passed |
| P3-CR-3 生产 `assert` | 仍已修复 | `grep -n assert` 生产模块无输出；T-20 命令 5 passed |

第 10 批记录写的是“既有断言无改动”。`git diff 915a145..HEAD -- backend/tests` 只改了 parametrize 行（加入新参数），并在函数开头新增 `replaced_lineage_partial` 分支；另两个参数的断言逐字未变，与记录一致。

## 任务表

| 任务 | 状态 | 证据（`-k` 命令实际 passed 数） |
|---|---|---|
| T-01 | 已收敛 | 19 |
| T-02 | 已收敛 | 14 / 1 / 17 |
| T-03 | 已收敛 | 7 / 12 / 22 |
| T-04 | 已收敛 | 1 / 3 / 6 / 1 / 4 / 2 / 4 |
| T-05 | 已收敛 | 3 / 2 / 8 / 3 |
| T-06 | 已收敛 | 13 / 3 / 5 |
| T-07 | 已收敛 | 8 / 9 / 8 / 12 / 5 / 6 |
| T-08 | 已收敛 | 9 / 7 / 4 / 13 |
| T-09 | 已收敛 | 2 / 2 / 4 / 8 |
| T-10 | 已收敛 | 5 / 12 / 3 / 4 / 15 |
| T-11 | 已收敛 | 命令 1～7：1 / 2 / 3 / 7 / 6 / 1 / 1；命令 8：357；命令 9：810 / 1 / 5；命令 10 符合；README 工具表一行未变（blob fcc2619） |
| T-12 | 记录符合完成标准（待 Review R3 / Gate 2） | 见“T-12 核对” |
| T-13 / T-14 / T-15 | 已收敛 | 各 4（T-14 全 loaded 摘要哈希断言照过）；整模块 / 全量同上 |
| T-16 | 已收敛 | 15 / 7；整模块 357 |
| T-17 | 已收敛 | 11 / 15；整模块 357 |
| T-18 | 已收敛 | 3 / 5；整模块 357 |
| T-19 | 已收敛 | 4 / 14；整模块 357 |
| T-20 | 已收敛 | 5；整模块 357；全量 810 / 1 / 5；命令 4 符合 |
| T-21 | 已收敛 | 1 / 3 / 27（命令 2 现含 T-22 新参数，故为 3）；整模块 357；全量 810 / 1 / 5 |
| T-22 | 已收敛 | 命令 1 → 3；命令 2 → 357；命令 3 → 810 / 1 / 5（基线 809 / 1 / 5，无新增失败）。完成标准 1～3 均满足 |

文件范围：`git diff --name-only 5aebb03..HEAD -- backend` 只有 `tools/dev_harness_budget.py` 与 `tests/test_dev_harness_budget.py`，符合 T-21 / T-22 的修改范围（夹具文件“只在需要时修改”，未改）。

## T-12 核对（只依据 review.md 脱敏记录与 Git 历史；未读取任何试点输入或输出）

| 完成标准 / 约束 | 记录 | 判定 |
|---|---|---|
| 1. AC-008-1：经用户授权的真实批次 | 用户原话“全修，T-12同批完成，授权脱敏”；Review R2 后用户原话“……试点范围扩大35”确认 35 段 | 符合 |
| 1. 生成报告、无新增模型调用、不重跑任务 | 首次运行与重跑均退出 3，状态行相同（`sources=gaps loaded=33 partial=2 …; metrics_complete=1/6; overall_observation=incomplete`），stderr 空；记录写明报告本身不发起模型或网络调用、未重跑任务 | 符合（离线性另由 AC-001-3 测试证明） |
| 1. 写明“仅证明可用、非基线、不证明节省” | 两节均写明 | 符合 |
| 使用最终代码 | 首次在 `a868d25`（T-16～T-20 之后），重跑在 `de3180a`（T-21 之后）。T-22 之后未再重跑：T-22 只改 tool_calls 的未确认来源计数；记录写明试点“去重已确认（无跨来源重叠）”，此时被取代 / 被覆盖来源的排除不改变任何记录数字。这是依据代码与记录做的推断，本会话未运行试点 | 符合 T-12 写明的依赖（T-16～T-20）；是否要求在 T-22 后再重跑，由 Review R3 / Gate 2 决定 |
| 2. AC-008-3：前后核对一致，顺序“前 → 报告 → 后 → 写记录” | 两次运行都记录前后 `git hash-object` 与 `git status` 一致，记录写于“后”核对之后。本会话独立佐证：spec blob `4689093`、checklist blob `3e7a7d6` 在 `a868d25`、`de3180a`、HEAD 三处相同；`a868d25..HEAD` 对 review.md 只有追加（+74 / −0），spec / checklist 无改动 | 符合 |
| 2. 不构成该 feature 的验收；不以 desktop-shell / WI 完成为前提 | 首次记录两句都有；重跑节写“结论不变……不构成任何 feature 的验收” | 符合 |
| 脱敏 | 对两节检索盘符路径、`/Users/`、`AppData`、`/tmp/`、`\Temp\`、UUID 形 id、`.jsonl`、`~/`：只命中授权文件名模式与“不含 `~/.pi`”这句排除说明 | 符合 |

## AC 表（27 条）

“已收敛”只表示代码与测试同规格对得上，不是验收。

| AC | 实现位置（`dev_harness_budget.py`） | 测试 / 手动步骤 | 状态 |
|---|---|---|---|
| AC-001-1 | `load_manifest` / `read_source`（只打开清单所列路径，不跟随 `parentSession`） | `test_only_selected_sources_opened`（审计 open 集合恰为清单 + 选定来源 + 产物） | 已收敛 |
| AC-001-2 | `read_source`（时间戳不进入语义） | `test_historical_records_same_semantics` | 已收敛 |
| AC-001-3 | 全模块只用标准库，无网络 / 进程代码 | `test_zero_model_and_network_attempts`（先计数再拒绝；计数 0；产物键集完整） | 已收敛 |
| AC-001-4 | 原因类别、收尾判据、`_source_gaps`、`main`、`_write_artifacts` | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work` | 已收敛 |
| AC-002-1 | `_dimension_values` / `_groups`（`(未知)` 独立成组） | `test_missing_dimensions_unknown_group` | 已收敛 |
| AC-002-2 | `_dimension_values`（origin、`annotation_conflict`） | `test_annotation_origin_and_sources_untouched` | 已收敛 |
| AC-002-3 | `_groups`（逐维计算 `conserved`）、`build_report` 降级分支 | `test_group_conservation_per_dimension`、`test_group_conservation_computed_not_asserted` | 已收敛（降级分支按构造不可达，无打桩，符合 plan） |
| AC-003-1 | `normalize_usage` / `_aggregate_tokens` | `test_exclusive_dimensions_total_170` | 已收敛 |
| AC-003-2 | `normalize_usage`（子集、`totalTokens` 对账） | `test_subset_fields_and_unreconciled` | 已收敛 |
| AC-003-3 | `_aggregate_tokens` peak、`render_summary` | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` | 已收敛 |
| AC-003-4 | `_usage_value`、`_appended_entry`、`_aggregate_tokens`（`no_confirmed_records`）、`_source_gaps` | `test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_entry_appended_usage_records_counted`、`test_unconfirmed_partition_denominators_unknown` | 已收敛 |
| AC-004-1 | `_read_pi_json_events`（最终值只取 `message_end`）、`_nonmonotonic` | `test_cumulative_snapshots_final_12`、`test_nonfinal_partial_lower_bound_10` | 已收敛 |
| AC-004-2 | 归属者规则（`turn_end` / `agent_end` 不计；toolResult 只在 `message_end`；嵌套 `result.usage` 不读） | `test_repeated_message_counted_once`；F14 (a) 已知小计 345 | 已收敛 |
| AC-004-3 | `_validate_relations`、`_partition_sources`、`_lineage_partition`、`_nested_partition` / `_nested_failure` | `test_relation_graph_rejected`、`test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`、`test_relation_shapes_unsupported_retain_facts`、`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage`、`test_lineage_parent_unavailable_not_determined`、`test_unconfirmed_sources_exclude_replaced_and_covered` | 已收敛 |
| AC-005-1 | `_tool_event`、`_nested_event`、`_event_tool_result`、`_nested`、`_tool_counts`（`selected_has_json_events`） | `test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views`、`test_nested_execution_events_read_as_nested`、`test_nested_views_dedup_and_direct_coverage`、`test_nested_executed_reason_uses_selection` | 已收敛 |
| AC-005-2 | `_retry_brackets` | `test_retry_requires_explicit_association`（12 种情形，`total` 恒 unknown） | 已收敛 |
| AC-005-3 | `_count_metrics` 的 `model_operations`、`_unobserved_paths`、`_nested_failure` | `test_covered_and_unobserved_paths`、`test_attempt_states_and_operation_records`、`test_nested_link_negative_cases`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-005-4 | `_rework`（只取标注） | `test_semantic_rework_annotation_only` | 已收敛 |
| AC-006-1 | `_source_timing` / `_aggregate_timing` | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source` | 已收敛 |
| AC-006-2 | `_source_timing` / `_outcome` | `test_timeout_known_duration_usage_unknown` | 已收敛 |
| AC-007-1 | `_observation`、`_groups`、`render_summary`、`build_report` 的 `unconfirmed_tokens` / `unconfirmed_tools`（T-21 / T-22 均排除 replaced / covered） | `test_summary_contents_units_denominators`、`test_all_known_aggregation_normalized_facts`（D1）、`test_coverage_denominator_unknown_with_source_gaps`、`test_group_denominator_unknown_with_source_gaps`、`test_token_unknown_records_unknown_with_source_gaps`、`test_nested_views_dedup_and_direct_coverage`、`test_unconfirmed_partition_denominators_unknown`、`test_unconfirmed_sources_exclude_replaced_and_covered`（含 `replaced_lineage_partial`） | 已收敛（G-R6-1 已关闭） |
| AC-007-2 | 白名单抽取、`_hash_ref`、标签正则、固定错误类别 | `test_privacy_sentinels_absent`、`test_path_shaped_labels_rejected_not_echoed` | 已收敛 |
| AC-007-3 | `_out_dir` | `test_repo_state_unchanged` | 已收敛 |
| AC-007-4 | `_load_comparison` / `_comparability` | `test_comparability_flags_no_money` | 已收敛 |
| AC-008-1 | 试点（非代码） | T-12 手动步骤 1；review.md 试点记录与重跑记录 | 记录符合 T-12 完成标准 1；待 Review R3 / Gate 2 判定 |
| AC-008-2 | 夹具 F1 / F2 / F3 与 D1 | `test_synthetic_categories_covered` | 已收敛 |
| AC-008-3 | 试点流程 | T-12 手动步骤 2；review.md 记录 + 本会话 Git 佐证 | 记录符合 T-12 完成标准 2；待 Review R3 / Gate 2 判定 |

计数：已收敛 25，待 Review 判定 2，差距 0。

## plan 符合性抽查与工程准则

- **T-22 对 plan §4.3 的落实**：末句“被生效 `duplicate_of` 取代或被嵌套覆盖的来源属于已确认去重，不计入”现在同时作用于 tokens 与 tool_calls；“tool_calls 只计来源级未确认”不变。`covered` 排除是防御性条件：嵌套覆盖生效时 `_nested_failure` 已要求成员无未确认原因，现有路径下不会改变输出。
- **工程准则（AGENTS §5）**：T-22 只给一个求和式加了与 T-21 相同的排除条件，没有新函数、新依赖或投机性复杂度。测试经 `main` 调用真实实现，期望为字面量，没有替身。`git grep --untracked` 无产品包导入；`pyproject.toml` / `.gitignore` 未变（工作区与 `5aebb03..HEAD` 均退出 0）；`git diff --check 5aebb03..HEAD` 退出 0。
- **夹具真实性**：T-22 测试内联的 session-v3 行与 F5 lineage 夹具同形（子 header 带 `parentSession`，复制条目保留 `id` / `timestamp`），符合 plan §3.4 第 4 层所依据的 1.4.0 fork 复制方式。

## 非阻塞观察（不是差距，未追加任务）

1. **被取代来源的未确认原因仍进入批次原因列表**：被取代来源的 `partition.uncertain` 原因（如 `lineage_usage_conflict`）照常进入 `tokens.reasons` 与 tool_calls 原因，并阻止完整总计。在现有可达路径中，血缘冲突 / 血缘父 partial 总会同时标记一个未被取代的来源，计数与原因不会互相矛盾（冒烟 (1)）。只有在清单把血缘双方都指向“同条目、不同 header”的人造副本时，才可能出现未确认来源数 0 而原因列表仍含血缘原因；方向保守，属于 plan §3.4 第 3 层“断言正确性由断言者负责”的范围。
2. **延续 R6 观察 1**：json-events 来源被生效 `duplicate_of` 取代时，批次 `nested_executed` 仍为 null + `overlap_unconfirmed`（T-22 未触及此路径；plan 未规定该情形的原因标签）。数值为 unknown，方向保守；建议 Review R3 一并判断。
3. **试点未在 T-22 后重跑**：见“T-12 核对”“使用最终代码”一行。
4. 延续 R5 / R6 / Review R2 的观察：未解析嵌套执行的原因在 start / end 各追加一次；F14 多一组 `agent_start` / `turn_start`；T-12 状态摘要 SHA256 的构造方式未记录（Git 历史已独立佐证）；峰值行“参与记录数 / 尝试总数”的措辞。均未变化。

## 本会话实际运行的命令与结果

验证命令在 `backend/` 下按 tasks.md 原文执行（脚本从 tasks.md“## 任务”节提取命令文本，去掉前缀 `cd backend && ` 后在 `backend/` 运行）；Git 命令在仓库根执行。

- 提取 T-01～T-11、T-13～T-22 的全部 pytest 验证命令，共 81 条：`-k` 命令 63 条（文本去重后 61 条：T-11 命令 4 与 T-16 命令 2 相同，T-21 命令 2 与 T-22 命令 1 相同）、整模块命令 11 条（文本相同）、全量命令 7 条（文本相同）。T-12 是手动命令，不在其中。63 条 `-k` 命令**按原样**运行，全部通过，0 failed（计数见任务表）。
- `cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → **357 passed**（6.73 s）；11 条相同文本的命令共用这次结果。
- `cd backend && python -m pytest tests/ -q` → **810 passed / 1 failed / 5 skipped**（161.92 s）。唯一失败：`tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（既有 netstat 基线）。7 条相同文本的命令共用这次结果。
- `git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出（退出 1）；`git diff --exit-code -- backend/pyproject.toml .gitignore` 退出 0，`5aebb03..HEAD` 区间也退出 0；`git status --porcelain=v1 --untracked-files=all` 只列出其他会话的路径（见头部），本 feature 路径无改动（写入本报告之前）。
- `git diff --check 5aebb03..HEAD` 退出 0；`grep -n assert backend/tools/dev_harness_budget.py` 无输出；`git diff --name-only 5aebb03..HEAD -- backend` 共 2 个文件；`git diff 915a145..HEAD -- tasks.md` 只改 T-22 状态行。
- 冻结 spec 正文 SHA256 复算为 `a504fed8…e823`，一致；未勾选 AC 27 条、已勾选 0 条。checklist.md SHA256 `879141f4…9d5c`（R4，未变）。
- T-12 佐证：`git rev-parse` 对比 `a868d25` / `de3180a` / HEAD 的 spec、checklist blob；`git diff --numstat a868d25..HEAD` 对 review.md 为 +74 / −0，spec / checklist 无改动；对 review.md 两节试点记录做私有形态检索。
- 合成冒烟（`python -I`，脚本与数据分放在系统 Temp 两个目录，经公开接口 `main`，结束后删除）：见“同类扫描”的三例。

## 追加的任务

无。本轮没有发现代码与 spec / plan / tasks 之间的差距，tasks.md 未改动。

## 下一步与边界

- 按 model-routing，由独立审核员 A（新开会话，与实施隔离、与实施模型不同，首选 `claude-fable-5-1`，先测 bridge）依 spec + plan + tasks + 真实 diff 做 Review R3，判定 Review R2 两项 P3 与 G-R6-1 是否关闭，以及 AC-008-1 / AC-008-3 的试点证据是否接受（含试点是否需在 T-22 后重跑）。观察 1、2 可一并判断。Review 后由用户确认结论（Gate 2），才可 Handoff。
- 本报告**不是**独立 Review，**不是** Gate 2，**不是** AC 验收，也不授权 Handoff、PR 或 merge；27 条 spec AC 保持未勾选。
