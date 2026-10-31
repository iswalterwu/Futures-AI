# Feature: dev-harness-budget v1 Converge 报告 R6（converge-r6.md）

> Converge 阶段产物（[workflow.md 第 9 步](../../docs/development/workflow.md#step-9)）：在 T-21（Review R2 的 P3）与 T-12 试点重跑之后，逐项对比代码与冻结 spec、plan r7、tasks。
> 本报告**不是**独立 Review，**不是** Gate 2，也**不是** AC 验收；27 条 spec AC 仍全部未勾选。[Converge R1](converge.md)～[R5](converge-r5.md) 原文不动。

- **Converge R6 = `claude-opus-5-5 via claude-bridge`**（计划 / 分析类首选模型 + 首选通道）。协调者派工前在 claude-bridge 做了一次最小真实调用，成功（协调者陈述）。本会话没有换模型，也没有改 provider / 路由 / key / 全局配置。新开会话，未写过本 feature 的代码；实施者是 `openai/gpt-6-astra`。
- **固定提交**：`afb95c96eed36b46990098ffc73bf9b717e7759f`（`D:/2030/Futures-AI`，分支 `workbench`）。本 feature 的文件在工作区中与 HEAD 一致。工作区里另有其他会话的未提交改动：`specs/README.md`、`specs/workflow-runtime/`、`docs/decisions/20261031-workflow-runtime-v1.md`，以及运行期间新出现的 `docs/architecture.md`、`docs/interaction.md`、`docs/plan.md` 修改。这些都不属于本 feature，本会话没有读取、没有修改，也没有作为输入。
- **本会话写入**：新建本文件；在 tasks.md 任务列表末尾追加 T-22（纯追加，+19 / −0，未改任何既有任务）。其余文件均未改动：spec / plan / checklist* / analyze* / code-review* / converge.md～converge-r5.md / review.md / HANDOFF / 索引 / 代码。没有 Git 写操作、联网、安装或派工。没有读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据；T-12 只依据 review.md 的脱敏记录与 Git 历史判断。合成冒烟在系统 Temp 的独立目录中用 `python -I` 运行（脚本与数据分开存放），结束后已删除。
- **派工输出名**：派工说明“输出”节写的是 `converge-r5.md`，与边界节“新建 converge-r6.md、converge-r5.md 原文不动”冲突，且 converge-r5.md 是已有的 R5 报告。本会话按边界节执行。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ afb95c9（blob ee8e4ab）全文
docs/development/workflow.md @ afb95c9（blob 4aca344）全文（重点：第 8～11 步、Gate 1 / Gate 2）
docs/development/model-routing.md @ afb95c9（blob f980f5c）全文
backend/README.md @ afb95c9（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ afb95c9（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致；未勾选 AC 27 条、已勾选 0 条）
specs/dev-harness-budget/plan.md @ afb95c9（blob d416e3a，r7 + 头部记账补正）全文
specs/dev-harness-budget/tasks.md @ afb95c9（blob f12a349，r8，T-01～T-21）全文
specs/dev-harness-budget/checklist.md @ afb95c9（blob 3e7a7d6，Checklist R4，23/23，SHA256 879141f4…9d5c）全文
specs/dev-harness-budget/analyze-r5.md（45c4e77）、code-review-r1.md（2272b21）、code-review-r2.md（775dfdd）、converge-r5.md（cf3d072）@ afb95c9 全文
specs/dev-harness-budget/review.md @ afb95c9（blob 2957c5c）“Review R1”节至文末（含用户对 R1 / R2 的处置、第 8 / 9 批、T-12 试点记录与重跑记录）
真实 diff：git diff 5aebb03..HEAD -- backend（工具 +14/−11、测试 +66；只涉 2 个既有文件）；git diff 5aebb03..HEAD -- specs/dev-harness-budget/plan.md；git diff --stat de3180a..afb95c9
backend/tools/dev_harness_budget.py @ afb95c9（blob 692384e）全文 1839 行
backend/tests/test_dev_harness_budget.py @ afb95c9（blob 41d4ef2）全文 2198 行
backend/tests/dev_harness_budget_fixtures.py @ afb95c9（blob 0d11992，自 5aebb03 未变）全文 459 行
```

未读 pi 1.4.0 安装包：本轮夹具未变，只有 T-21 测试内联的 session-v3 行，夹具真实性按 plan §5 / §7 已记录的格式比对即可。

## 结论

**未收敛**：存在 1 项代码与 plan 的差距，已追加任务 T-22。其余部分已收敛，包括 T-01～T-11、T-13～T-21 的离线实现和 T-12 试点及重跑记录。

- **差距 G-R6-1**（披露计数，严重度相当于 P3）：tool_calls 的 `unconfirmed_sources` 会把已被生效 `duplicate_of` 取代的来源计入。这种情况只在该来源同时因血缘进入来源级未确认分区时出现，与 plan §4.3“被生效 `duplicate_of` 取代或被嵌套覆盖的来源属于已确认去重，不计入”不符。复现与修复见“差距与追加任务”。已知小计、完整总计、分母结论与退出码都不受影响。
- Review R2 的 P3-CR2-1、P3-CR2-2 已由 T-21 在代码中按 plan 修复，有字面量测试守卫，无回归。P3-R4-1 已在 plan / tasks 头部输入清单中补记。Review R1 的 P2-CR-1、P3-CR-1～3 的修复仍在，无回归。
- tasks.md 中 T-01～T-11、T-13～T-21 的 62 条 `-k` 验证命令逐条按原文运行，全部通过。整模块 **356 passed**。后端全量 **809 passed / 1 failed / 5 skipped**：唯一失败是既有 netstat 监听断言；809 = 806 + 本批新增 3（模块 353 → 356），没有新增失败。
- T-12：首次试点与 T-21 后的重跑记录满足 T-12 两条完成标准的文字要求，不含私有信息；用户已确认试点范围为 35 段。
- AC 计数：已收敛 24；有差距 1（AC-007-1，T-22）；试点记录符合完成标准、待 Review / Gate 2 判定 2（AC-008-1 / AC-008-3）。
- 下一步：Implement T-22 → 重跑 Converge（R7）→ 独立 A Review R3 → Gate 2。

## 差距与追加任务

### G-R6-1 tool_calls 未确认来源数计入被取代来源 → T-22

- **位置**：`build_report` 中 `unconfirmed_tools = sum(bool(reasons) for reasons in partition.uncertain.values())`，没有排除 `partition.replaced` / `partition.covered`。T-21 只给 `unconfirmed_tokens` 加了这两项排除。
- **可达路径**：生效的 `duplicate_of` 要求双方都是 `loaded` 且键集包含，所以被取代来源 S 只可能经由第 4 层血缘进入 `partition.uncertain`：S 是 X 的副本、带同一 `parentSession`，血缘父 P 已选入但为 `partial`（`lineage_parent_unavailable`），或者用量冲突（`lineage_usage_conflict`）。
- **复现**（合成，经 `main`，`python -I`，Temp）：P = session-v3（1 条已知主尝试 + 末尾坏 JSON → partial）；X = header `parentSession` 指向 P，含 P 的 `p1` 副本和 1 条新 assistant；S = X 的逐字副本，`duplicate_of: X`。实际输出：退出 3；`relations[0].effective` = true；S `replaced_by` = X、`unconfirmed_reasons` = `["lineage_parent_unavailable"]`；tokens 与四维分组 `unconfirmed_sources.count` = 2，**tool_calls = 3**；摘要为“tokens：未确认去重来源 2 来源；tool_calls：3 来源；”。tool_calls 只计来源级未确认，按定义应是 tokens（来源级或记录级）的子集，3 > 2 本身就是矛盾。
- **影响**：只多报 1 个来源。S 的记录本已因被取代不进入聚合，P、X 仍在未确认分区，tool_calls 分母已经是 null，已知小计 / 完整总计 / 退出码不变。
- **追加**：tasks.md **T-22**（依赖 T-21，引用 AC-007-1，3 条完成标准与 3 条验证命令一一对应）。修法是让 `unconfirmed_tools` 与 T-21 对 `unconfirmed_tokens` 一样排除 replaced / covered；测试在既有的 `test_unconfirmed_sources_exclude_replaced_and_covered` 中增加参数 `replaced_lineage_partial`，不新增测试名，AC 覆盖表不变。不改 Plan，不回 Clarify。

## Review R2 / R1 发现在代码中的核对

| 发现 | 是否按 plan 修复 | 证据（本会话） |
|---|---|---|
| P3-CR2-1 `nested_executed` 误报 `nested_events_not_persisted` | 是 | `build_report` 把 `selected_has_json_events = any(f.format == "pi-json-events" for f in facts)` 传入 `_count_metrics` → `_tool_counts`，其中 `facts` 为全部选定来源。已确认集合有 json-events 时照旧计数；选定中有、已确认集合中没有时，`observed_total` 为 null、`reasons` = `["overlap_unconfirmed"]`；只有选定来源全部为 session-v3 时才用 `nested_events_not_persisted`。逐来源调用传 `fact.format == "pi-json-events"`，与原行为等价。守卫：`test_nested_executed_reason_uses_selection`（F5 `double_capture`：批次 null + `overlap_unconfirmed`，整份 tool_calls 不含 `nested_events_not_persisted`，C 行 0 / []，tokens 未确认 2）；`test_nested_views_dedup_and_direct_coverage[session]` 中全部为 session-v3 时仍为 `nested_events_not_persisted` |
| P3-CR2-2 tokens / 分组 `unconfirmed_sources` 计入被取代来源 | 是（tokens / 分组；tool_calls 的同类残留见 G-R6-1） | `_nested_partition` 的未声明分支跳过 `replaced` / `covered`；`unconfirmed_tokens` 排除这两类。守卫：`test_unconfirmed_sources_exclude_replaced_and_covered[duplicate_replaced]`（tokens 1、四维 1、tool_calls 0、S `replaced_by` X 且未确认记录 0、X 为 1、已知小计 340、完整总计 null、含 `nested_coverage_unverifiable`、摘要行字面量）与 `[nested_covered]`（子来源 `token_covered_by` P、0、完整总计 210）。既有断言（F5 `double_capture` 2、F8 `undeclared` 父 1）照过 |
| P3-R4-1 plan / tasks 头部输入清单缺 r6 / r7 | 已记录 | plan.md 输入清单代码块内含 r6、r7 行、补正说明与“记账补正 @ 39fa979”行，头部有“头部记账补正”一行；tasks.md 输入清单有 r6 / r7 / r8 行。`git diff 5aebb03..HEAD -- plan.md` 只涉及头部、输入清单与 §5 三行测试名登记，规则正文未动 |
| P2-CR-1 嵌套执行计为 direct | 仍已修复 | 本轮 diff 未触及 `_read_pi_json_events` / `_nested_event` / direct 计数。T-16 / T-17 命令（15 / 7 / 11 / 15 passed）照过：F14 (a) direct 1、tool_calls complete、分母 1 / 100% |
| P3-CR-1 未确认分区分母与空集原因 | 仍已修复 | T-18 命令 3 / 5 passed；`test_unconfirmed_partition_denominators_unknown` 三个参数照过 |
| P3-CR-2 血缘父不可用 | 仍已修复 | T-19 命令 4 / 14 passed |
| P3-CR-3 生产 `assert` | 仍已修复 | `grep -n assert` 生产模块无输出；T-20 命令 5 passed |

第 9 批记录写的是“既有断言无改动”。`git diff 5aebb03..HEAD -- backend/tests` 只有新增行（+66 / −0），与记录一致。

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
| T-11 | 已收敛 | 命令 1～7：1 / 2 / 3 / 7 / 6 / 1 / 1；命令 8：356；命令 9：809 / 1 / 5；命令 10 符合；README 工具表一行未变 |
| T-12 | 记录符合完成标准（待 Review R3 / Gate 2） | 见“T-12 核对” |
| T-13 / T-14 / T-15 | 已收敛 | 各 4（T-14 全 loaded 摘要哈希断言照过）；整模块 / 全量同上 |
| T-16 | 已收敛 | 15 / 7；整模块 356 |
| T-17 | 已收敛 | 11 / 15；整模块 356 |
| T-18 | 已收敛 | 3 / 5；整模块 356 |
| T-19 | 已收敛 | 4 / 14；整模块 356 |
| T-20 | 已收敛 | 5；整模块 356；全量 809 / 1 / 5；命令 4 符合 |
| T-21 | 已收敛（本任务范围） | 1 / 2 / 27；整模块 356；全量 809 / 1 / 5（基线 806 / 1 / 5，无新增失败）。完成标准 1～5 均由测试字面量覆盖。tool_calls 计数的同类残留不在 T-21 写明的范围内，另列为 G-R6-1 |
| T-22 | **新增，未开始** | Converge R6 追加，见上 |

文件范围：`git diff --name-only 5aebb03..HEAD -- backend` 只有 `tools/dev_harness_budget.py` 与 `tests/test_dev_harness_budget.py`，符合 T-21 的修改范围（夹具文件“只在需要时”修改，本批未改）。

## T-12 核对（只依据 review.md 脱敏记录与 Git 历史；未读取任何试点输入或输出）

| 完成标准 / 约束 | 记录 | 判定 |
|---|---|---|
| 1. AC-008-1：经用户授权的真实批次 | 用户原话“全修，T-12同批完成，授权脱敏”；Review R2 后用户原话“……试点范围扩大35”确认 35 段 | 符合 |
| 1. 生成报告、无新增模型调用、不重跑任务 | 首次运行与重跑均退出 3，状态行相同（`sources=gaps loaded=33 partial=2 …; metrics_complete=1/6; overall_observation=incomplete`），stderr 为空；记录写明报告本身不发起模型或网络调用、未重跑任务 | 符合（离线性另由 AC-001-3 测试证明） |
| 1. 写明“仅证明可用、非基线、不证明节省” | 两节均写明 | 符合 |
| 使用最终代码 | 重跑在 T-21 后进行（清单 baseline_commit 为 `de3180a`）；三个代码文件 blob 在 `de3180a` 与 HEAD 相同（692384e / 41d4ef2 / 0d11992） | 符合 |
| 2. AC-008-3：前后核对一致，顺序为“前 → 报告 → 后 → 写记录” | 两次运行都记录了前后 `git hash-object` 与 `git status` 一致，记录写于“后”核对之后。本会话独立佐证：spec blob `4689093`、checklist blob `3e7a7d6` 在 `a868d25`、`de3180a`、HEAD 三处相同；`de3180a..afb95c9` 只给 review.md 追加 6 行（无删除） | 符合 |
| 2. 不构成该 feature 的验收；不以 desktop-shell / WI 完成为前提 | 首次记录两句都有；重跑节写明“不构成任何 feature 的验收” | 符合 |
| 脱敏 | 对两节检索盘符路径、`/Users/`、`AppData`、`/tmp/`、`\Temp\`、UUID 形 id、`.jsonl`、`~/`：只命中授权文件名模式和“不含 `~/.pi`”这句排除说明 | 符合 |

## AC 表（27 条）

“已收敛”只表示代码与测试同规格对得上，不是验收。

| AC | 实现位置（`dev_harness_budget.py`） | 测试 / 手动步骤 | 状态 |
|---|---|---|---|
| AC-001-1 | `load_manifest` / `read_source`（只打开清单所列路径） | `test_only_selected_sources_opened` | 已收敛 |
| AC-001-2 | `read_source` | `test_historical_records_same_semantics` | 已收敛 |
| AC-001-3 | 全模块只用标准库，无网络 / 进程代码 | `test_zero_model_and_network_attempts`（先计数再拒绝；计数 0） | 已收敛 |
| AC-001-4 | 原因类别、收尾判据、`_source_gaps`、`main`、`_write_artifacts` | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work` | 已收敛 |
| AC-002-1 | `_dimension_values` / `_groups` | `test_missing_dimensions_unknown_group` | 已收敛 |
| AC-002-2 | `_dimension_values` | `test_annotation_origin_and_sources_untouched` | 已收敛 |
| AC-002-3 | `_groups`（计算 `conserved`）、`build_report` 降级分支 | `test_group_conservation_per_dimension`、`test_group_conservation_computed_not_asserted` | 已收敛（降级分支按构造不可达） |
| AC-003-1 | `normalize_usage` / `_aggregate_tokens` | `test_exclusive_dimensions_total_170` | 已收敛 |
| AC-003-2 | `normalize_usage` | `test_subset_fields_and_unreconciled` | 已收敛 |
| AC-003-3 | `_aggregate_tokens` peak、`render_summary` | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` | 已收敛 |
| AC-003-4 | `_usage_value`、`_appended_entry`、`_aggregate_tokens`、`_source_gaps` | `test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_entry_appended_usage_records_counted`、`test_unconfirmed_partition_denominators_unknown` | 已收敛 |
| AC-004-1 | `_read_pi_json_events`、`_nonmonotonic` | `test_cumulative_snapshots_final_12`、`test_nonfinal_partial_lower_bound_10` | 已收敛 |
| AC-004-2 | 归属者规则 | `test_repeated_message_counted_once`；F14 (a) 已知小计 345 | 已收敛 |
| AC-004-3 | `_validate_relations`、`_partition_sources`、`_lineage_partition`、`_nested_partition`（T-21：跳过 replaced / covered）/ `_nested_failure` | `test_relation_graph_rejected`、`test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`、`test_relation_shapes_unsupported_retain_facts`、`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage`、`test_lineage_parent_unavailable_not_determined`、`test_unconfirmed_sources_exclude_replaced_and_covered` | 已收敛（去重归属正确；G-R6-1 只涉披露计数，归 AC-007-1） |
| AC-005-1 | `_tool_event`、`_nested_event`、`_event_tool_result`、`_nested`、`_tool_counts`（T-21：`selected_has_json_events`） | `test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views`、`test_nested_execution_events_read_as_nested`、`test_nested_views_dedup_and_direct_coverage`、`test_nested_executed_reason_uses_selection` | 已收敛 |
| AC-005-2 | `_retry_brackets` | `test_retry_requires_explicit_association` | 已收敛 |
| AC-005-3 | `model_operations`、`_unobserved_paths`、`_nested_failure` | `test_covered_and_unobserved_paths`、`test_attempt_states_and_operation_records`、`test_nested_link_negative_cases`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-005-4 | `_rework` | `test_semantic_rework_annotation_only` | 已收敛 |
| AC-006-1 | `_source_timing` / `_aggregate_timing` | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source` | 已收敛 |
| AC-006-2 | `_source_timing` / `_outcome` | `test_timeout_known_duration_usage_unknown` | 已收敛 |
| AC-007-1 | `_observation`、`_groups`、`render_summary`、`build_report` 的 `unconfirmed_tokens` / `unconfirmed_tools` | `test_summary_contents_units_denominators`、`test_all_known_aggregation_normalized_facts`（D1）、`test_coverage_denominator_unknown_with_source_gaps`、`test_group_denominator_unknown_with_source_gaps`、`test_token_unknown_records_unknown_with_source_gaps`、`test_nested_views_dedup_and_direct_coverage`、`test_unconfirmed_partition_denominators_unknown`、`test_unconfirmed_sources_exclude_replaced_and_covered` | **差距（G-R6-1 → T-22）**：tool_calls `unconfirmed_sources` 计入被取代来源；其余部分已收敛 |
| AC-007-2 | 白名单抽取、`_hash_ref`、标签正则、固定错误类别 | `test_privacy_sentinels_absent`、`test_path_shaped_labels_rejected_not_echoed` | 已收敛 |
| AC-007-3 | `_out_dir` | `test_repo_state_unchanged` | 已收敛 |
| AC-007-4 | `_load_comparison` / `_comparability` | `test_comparability_flags_no_money` | 已收敛 |
| AC-008-1 | 试点（非代码） | T-12 手动步骤 1；review.md 试点记录与重跑记录 | 记录符合 T-12 完成标准 1；待 Review R3 / Gate 2 判定 |
| AC-008-2 | 夹具 F1 / F2 / F3 与 D1 | `test_synthetic_categories_covered` | 已收敛 |
| AC-008-3 | 试点流程 | T-12 手动步骤 2；review.md 记录 + 本会话 Git 佐证 | 记录符合 T-12 完成标准 2；待 Review R3 / Gate 2 判定 |

计数：已收敛 24，有差距 1，待 Review 判定 2。

## plan 符合性抽查与工程准则

- **T-21 对 plan §3.3 / §4.3 的落实**：`nested_events_not_persisted` 只在全部选定来源为 session-v3 时出现；tokens / 分组的未确认来源数排除 replaced / covered；tool_calls 的排除缺失见 G-R6-1。`covered` 与 `_nested_partition` 未声明分支互斥（嵌套覆盖要求已声明），排除条件属于 plan 写明的防御，不改变现有路径的输出。
- **工程准则（AGENTS §5）**：T-21 只给两个函数加了一个仅限关键字的参数，并加了两处排除条件，没有新抽象、新依赖或投机性复杂度。测试经 `main` 调用真实实现，期望为字面量，没有替身。`git grep --untracked` 无产品包导入；`pyproject.toml` / `.gitignore` 未变（工作区与 `5aebb03..HEAD` 均退出 0）；`git diff --check 5aebb03..HEAD` 退出 0。
- **夹具**：本批未改 fixtures。T-21 测试内联的 X 中，toolResult 挂在 `stopReason=stop` 且没有 toolCall 块的 assistant 之下，与真实 pi 形状略有出入，但不影响被断言的分区与计数行为（见观察 3）。

## 非阻塞观察（不是差距，未追加任务）

1. **被取代的 json-events 来源的原因标签**：合成复现中，F5 `double_capture` 的 C 加上 `duplicate_of: P`（链接生效，去重“已确认”，tokens / tool_calls 未确认来源数均为 0），批次 `nested_executed` 为 null + `overlap_unconfirmed`。数值为 unknown，方向保守。T-21 写的“选定中有 json-events 但已确认集合中没有 → `overlap_unconfirmed`”按字面成立，但这里 json-events 来源是“被取代”，不是“未确认”，标签与报告其余部分的去重状态不一致。plan 没有规定这种情形的原因标签，所以不算代码差距。建议 Review R3 判断是否改为单独原因，或在 Gate 2 接受。
2. **唯一的 json-events 来源缺失时**：批次 `nested_executed.observed_total` = 0、`reasons` = []（缺失来源仍在已确认计数集合中；T-21 之前已是如此）。缺口已在 tool_calls 层披露：`reasons` 含 `source_missing`、状态 partial、`missing_sources` 1，与 direct 视图对缺失来源的处理一致。
3. T-21 测试 `duplicate_replaced` 中 X 的形状不完全真实（见上节），不影响断言。
4. 延续 R5 / Review R2 的观察：未解析嵌套执行的原因在 start / end 各追加一次；F14 多一组 `agent_start` / `turn_start`；T-12 状态摘要 SHA256 的构造方式未记录（Git 历史已独立佐证）；峰值行“参与记录数 / 尝试总数”的措辞。均未变化。

## 本会话实际运行的命令与结果

验证命令在仓库根按 tasks.md 原文（含 `cd backend &&`）执行。

- 从 tasks.md“## 任务”节提取 T-01～T-11、T-13～T-21 的全部 pytest 验证命令，共 78 条：`-k` 命令 62 条、整模块命令 10 条（文本相同）、全量命令 6 条（文本相同）。T-12 是手动命令，不在其中。62 条 `-k` 命令**逐条按原样**运行，全部通过，0 failed（计数见任务表）。
- `cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → **356 passed**（7.05 s）；10 条相同文本的命令共用这次结果。
- `cd backend && python -m pytest tests/ -q` → **809 passed / 1 failed / 5 skipped**（167.15 s）。唯一失败是 `tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（既有 netstat 基线）。6 条相同文本的命令共用这次结果。
- `git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出（退出 1）；`git diff --exit-code -- backend/pyproject.toml .gitignore` 退出 0，`5aebb03..HEAD` 区间也退出 0；`git status --porcelain=v1 --untracked-files=all` 只列出其他会话的路径（见头部），本 feature 路径无改动（写入本报告与 T-22 之前）。
- `git diff --check 5aebb03..HEAD` 退出 0；`grep -n assert backend/tools/dev_harness_budget.py` 无输出；`git diff --name-only 5aebb03..HEAD -- backend` 共 2 个文件。
- 冻结 spec 正文 SHA256 复算为 `a504fed8…e823`，一致；未勾选 AC 27 条、已勾选 0 条。checklist.md SHA256 `879141f4…9d5c`（R4，未变）。
- T-12 佐证：`git rev-parse` 对比 `a868d25` / `de3180a` / HEAD 的 spec、checklist 与三个代码文件 blob；`git diff --stat de3180a..afb95c9`（review.md +6）；对 review.md 两节试点记录做私有形态检索。
- 合成冒烟（`python -I`，脚本与数据分放在系统 Temp 两个目录，经公开接口 `main`，结束后删除）：(1) G-R6-1 复现，tokens 2 / tool_calls 3；(2) F5 `double_capture` → `nested_executed` null + `overlap_unconfirmed`，与 T-21 一致；(3) 唯一的 json-events 来源缺失 → 观察 2；(4) json-events 来源被取代 → 观察 1。

## 追加的任务

- **T-22** tool_calls 未确认来源数排除被取代来源（依赖 T-21；部分满足 AC-007-1；3 条完成标准与 3 条验证命令一一对应）。

## 下一步与边界

- 按 model-routing，Implement T-22（首选 `openai/gpt-6-astra`，先探活）→ Converge R7（重新对比，直到“已收敛”）→ 独立审核员 A Review R3（新开会话，与实施模型不同，首选 `claude-fable-5-1`，先测 bridge）→ 用户确认 Gate 2 后才可 Handoff。观察 1 可在 Review R3 中一并判断。
- 本报告**不是**独立 Review，**不是** Gate 2，**不是** AC 验收，也不授权 Handoff、PR 或 merge；27 条 spec AC 保持未勾选。
