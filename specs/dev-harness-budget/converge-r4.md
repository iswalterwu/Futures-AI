# Feature: dev-harness-budget v1 Converge 报告 R4（converge-r4.md）

> Converge 阶段产物（[workflow.md 第 9 步](../../docs/development/workflow.md#step-9)）。T-15 实施后，逐项对比代码与冻结 spec、plan、tasks。
> 本报告**不是**独立 Review，**不是** Gate 2，也**不是** AC 验收；27 条 spec AC 仍全部未勾选。[Converge R1](converge.md)、[R2](converge-r2.md)、[R3](converge-r3.md) 原文不动。

- **Converge R4 = `claude-opus-5-5 via claude-bridge`**，即计划 / 分析类首选模型 + 首选通道。协调者派工前对 bridge 做过一次最小真实调用，成功（协调者陈述）。本会话没有换模型，没有改 provider / 路由 / key / 全局配置。新开会话，未写过本 feature 的代码；实施者是 `openai/gpt-6-astra`。
- **固定提交**：`f2f8fb53a4c47b77105cecf1b1a13c6d6b8b0a09`（`D:/2030/Futures-AI`，分支 `workbench`），开始时 `git status --porcelain=v1 --untracked-files=all` 为空。
- **本会话写入**：只新建本文件。未追加任务（无差距），未改 tasks.md、spec / plan / checklist* / analyze* / converge*.md（R1～R3）/ review.md / HANDOFF / 索引 / 代码；无 Git 写操作、联网、安装或派工；未读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。合成冒烟在系统 Temp 下的临时目录中进行，结束后已删除。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ f2f8fb5（blob ee8e4ab）全文
docs/development/workflow.md @ f2f8fb5（blob 4aca344）全文（重点：第 8～11 步、Gate 1 / Gate 2）
docs/development/model-routing.md @ f2f8fb5（blob f980f5c）全文
backend/README.md @ f2f8fb5（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ f2f8fb5（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致）
specs/dev-harness-budget/plan.md @ f2f8fb5（blob 9c1c8bc，r4）全文
specs/dev-harness-budget/tasks.md @ f2f8fb5（blob a474f2b）全文
specs/dev-harness-budget/checklist.md @ f2f8fb5（blob 04fe4b1，Checklist R3，23/23）全文
specs/dev-harness-budget/analyze-r2.md @ f2f8fb5（blob b96ddab）全文
specs/dev-harness-budget/converge.md（blob 4c42339）、converge-r2.md（blob 2f2889a）、converge-r3.md（blob bcf7e4a，含同类扫描表）@ f2f8fb5 全文
specs/dev-harness-budget/review.md @ f2f8fb5（blob f8f2996）“Implement”节至文末（第 1～7 批、Converge R1～R3）
真实 diff：git diff 7bd2e5b..HEAD -- backend（README +1、3 个新文件）；git diff f3e3d18..HEAD -- backend（T-15：工具 +5/−2，测试 +53）
backend/tools/dev_harness_budget.py @ f2f8fb5（blob 3d81548）全文 1745 行
backend/tests/test_dev_harness_budget.py @ f2f8fb5（blob 3f9025a）全文 1901 行
backend/tests/dev_harness_budget_fixtures.py @ f2f8fb5（blob ee1318c，自 b8175f4 起未变）全文 416 行
对照：backend/tools/dev_harness_budget.py @ f3e3d18（blob 043858c，T-15 前）仅用于冒烟对比
```

本轮未重读 pi 1.4.0 安装包：夹具 blob 自 R1 起未变，R1 / R2 已按公开 json.md、json-event.js、agent-loop.js 核对过夹具事件形状；1.4.0 安装位于 `~/.pi` 之下，本会话不进入该目录（同 R3）。

## 结论

**已收敛（T-01～T-11、T-13～T-15 离线实现范围）**。

T-15 按完成标准实施到位，Converge R3 的 token 节差距已关闭；T-13、T-14 仍然成立。对 R3 同类扫描表逐项复核，并对 5 种来源缺口逐行扫描摘要，未发现剩余同类位置。50 条 `-k` 验证命令全部通过；模块 319 passed；全量 772 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 基线，无新增失败。AC 计数：已收敛 25，待试点 2（AC-008-1 / AC-008-3，T-12 外部阻塞，不是代码差距），差距 0。下一步可进入独立 A Review。

## T-15 是否真正关闭 Converge R3 差距

| 核对项 | 结果 |
|---|---|
| 来源缺口时叙述行写“未知用量归属记录数 未知” | 是：`render_summary` 以 `observation.metrics.tokens.missing_sources.count > 0` 为条件（`dev_harness_budget.py` 1678–1682）；冒烟中缺失 / 坏行 / 只有 header / v2 / 未 settled 五种缺口均为“已确认去重；未知用量归属记录数 未知；原因：…。” |
| 维度表 6 行“未知记录”列显示“未知” | 是：同一条件下逐行置 None 后经 `_display` 渲染（1684–1688）；五种缺口下 6 行全部为 `| 未知 | 0 |` 结尾，其余列照常（如坏行 `| input | 200 | 2 | 未知 | 0 | 未知 | 0 |`） |
| `report.json` 不变 | 是：`build_report` 未改动；冒烟对同一输入分别运行当前模块与 `f3e3d18` 模块，7 种情形的 `report.json` 序列化完全相同 |
| 全部 loaded 时摘要逐字不变 | 是：冒烟中全部 loaded 与“全部 loaded 但同会话双采集”两种情形，新旧摘要字节相同；T-14 测试中钉在 `812c1c1` 的摘要 SHA256 断言照过 |
| 新测试经 `main` 断言 | 是：`test_token_unknown_records_unknown_with_source_gaps` 参数化 missing / bad_json / header / loaded；断言退出码 3 / 0、`sources=gaps|ok`、stderr 为空、S1 / S2 的 `session_ref` 不同、叙述行、“未知 0 条”不出现、`input` 与 `cache_write_1h` 字面行、6 行结尾、JSON 计数（`unknown_records` 0、`cache_write_1h` 1 / 2）与 `missing` null；对照用例断言原文案。期望值均为字面量，未复写分母逻辑 |
| T-13 / T-14 仍成立 | 是：两者命令 1 各 4 passed；冒烟中覆盖表 tokens / tool_calls 行与各分组节在缺口下仍为“未知” |
| tasks.md 覆盖表 AC-007-1 行 | 是：任务列 `T-09、T-10、T-13、T-14、T-15`，测试列含 `test_token_unknown_records_unknown_with_source_gaps` |

判定：T-13、T-14、T-15 均**已收敛**。

## 同类扫描复核（R3 表 + 本轮补充）

冒烟输入：S1 = F1（改会话 id，含 1 次 finished 工具调用，phase 标注 `Plan`），S2 依次为缺失、坏行、只有 header、v2（unsupported_version）、未 settled 的 json-events 流；另加全部 loaded 与“两来源同会话、均 loaded”对照。对每份摘要抓取所有含 0 计数或数字分母的行逐一判定。

| 位置 | 来源有缺口时的当前输出 | 判定 |
|---|---|---|
| 覆盖表 tokens / tool_calls 行 | 分母、缺失、百分比“未知”，另列来源缺口数 | 已关闭（T-13） |
| 覆盖表 main_attempts / retries 行 | 分母取 run_total / total，缺口下“未知”；retries 行“已覆盖 0”是已确认重试小计（下界） | 不属此类 |
| 覆盖表 rework / timing 行 | 单位“来源”，分母 = 选定来源数 2，已知 | 不属此类 |
| 分组节首行与组行 | “分母 未知”，缺失 / 分母列“未知”；`(未知)` 组的“已覆盖记录 0”是观测计数 | 已关闭（T-14） |
| `### token` 叙述行 | “未知用量归属记录数 未知” | 已关闭（T-15） |
| `### token` 维度表“未知记录”列 | “未知” | 已关闭（T-15） |
| 维度表“已知记录 / 部分记录 / 无效记录”列 | 观测计数 | 不属此类（正向观测计数，0 不意味“全部已知”） |
| “记录单位 … 分母” | “分母 未知” | 已关闭（T-13） |
| 峰值行 | 缺口下标“已知记录中的峰值（下界）” | 不属此类（R3 已判，见非阻塞观察 1） |
| 尝试 / 工具 / 重试 / 摘要重试 / 操作记录行 | 均标“观测到的”或“下界”，总数“未知” | 不属此类 |
| 逐来源行“观测到的归属记录 N 条” | 以来源为单位、标“观测到的” | 不属此类 |
| `report.json` 的观测记录计数 | 与 T-14 / T-15 既定口径一致；选定总体的分母 / 缺失由 `observation.metrics.*` 与 `groups.*.denominator` 表达 | 不属此类 |
| **本轮补充**：全部 loaded、但两来源同会话（未确认分区）时，token 节“未完全去重；未知 0 条”、覆盖表与分组节“分母 0” | 所有来源已读完，被排除的记录是已观测记录，在逐来源行照常列出；Plan §3.3 / §3.4 末段把分母限定为“选定且已确认去重的总体”，该总体按定义是确定的（此例为空集），且摘要同行标明“未完全去重”与原因 | 不属此类（不是来源缺口导致的记录数不可知；T-15 前后输出相同） |

结论：没有剩余的同类位置。

## 任务表

| 任务 | 状态 | 证据（本会话） |
|---|---|---|
| T-01 骨架与清单校验 | 已收敛 | 分节结构与 Plan §2 dataclass 齐备；`load_manifest` 三类标签正则、路径形值拒绝、`unknown_field`、并集图迭代 DFS；命令 1 → 19 passed |
| T-02 读取框架与 session-v3 | 已收敛 | `rb` 读取、按 `b"\n"` 切分去 `\r`；四类 unavailable 原因、`empty`、`truncated`；r3 对账规则；命令 1～3 → 14 / 1 / 17 passed |
| T-03 json-events、收尾判据、重试标记 | 已收敛 | toolResult 只在 `message_end` 计；`message_update` 读顶层 `usage`；`entry_appended` 白名单；`NONRUN_EVENTS` 4 种；命令 1～3 → 7 / 12 / 22 passed |
| T-04 token 聚合、完整总计、峰值 | 已收敛 | 命令 1～7 → 1 / 3 / 6 / 1 / 4 / 2 / 4 passed |
| T-05 来源关系去重 | 已收敛 | 命令 1～4 → 3 / 2 / 8 / 3 passed |
| T-06 嵌套覆盖 | 已收敛 | 命令 1～3 → 13 / 3 / 5 passed |
| T-07 尝试 / 工具 / 重试 / 返工 / 未观测 | 已收敛 | 命令 1～6 → 8 / 9 / 8 / 12 / 5 / 6 passed |
| T-08 时间与执行结果 | 已收敛 | 命令 1～4 → 9 / 7 / 4 / 13 passed |
| T-09 维度、守恒、六项矩阵、D1 | 已收敛 | 命令 1～4 → 2 / 2 / 4 / 8 passed |
| T-10 摘要、CLI、写出、比较 | 已收敛 | 覆盖表、分组节、token 节在来源缺口下均不再给出已知分母 / 缺失 0（T-13～T-15）；退出码、固定 stdout / stderr、`open("x")`、只清理本次文件、可比性、无金额均符合；命令 1～5 → 5 / 12 / 3 / 4 / 15 passed |
| T-11 离线 / 隐私 / 仓库状态 + README | 已收敛 | 命令 1～7 → 1 / 2 / 3 / 7 / 6 / 1 / 1 passed；命令 8 → 319 passed；命令 9 → 772 / 1 / 5；命令 10 符合；README 工具表恰好 +1 行 |
| T-12 真实试点 | BLOCKED（外部） | 用户未选定、未授权文件；本会话未运行、未读取任何真实数据 |
| T-13 覆盖分母（R1 追加） | 已收敛 | 命令 1 → 4 passed；命令 2 → 319 passed；命令 3 → 772 / 1 / 5 |
| T-14 分组节分母（R2 追加） | 已收敛 | 命令 1 → 4 passed；命令 2、3 同上；全部 loaded 摘要哈希断言照过 |
| T-15 token 节未知记录数（R3 追加） | 已收敛 | 见“T-15 是否真正关闭”；命令 1 → 4 passed；命令 2 → 319 passed；命令 3 → 772 / 1 / 5（R3 基线 768 + 新增 4，无新增失败） |

文件范围：`git diff --name-only 7bd2e5b..HEAD` 中代码只有 3 个新文件与 `backend/README.md`（+1 行），其余为本 feature 的 tasks / review / converge 文档；T-15 只改 `render_summary` 与新增一个测试，符合其修改范围。

## AC 表（27 条）

“已收敛”只表示代码和测试与规格对上了，不是验收；验收由独立 Review 与 Gate 2 决定。

| AC | 实现位置（`dev_harness_budget.py`） | 测试 | 状态 |
|---|---|---|---|
| AC-001-1 | `load_manifest` / `read_source`（只打开清单列出的路径，不跟随 `parentSession`） | `test_only_selected_sources_opened`（审计 open 集合恰为清单 + 选定来源 + 3 个产物；写出带 `O_EXCL`） | 已收敛 |
| AC-001-2 | `read_source`（时间戳不进入语义） | `test_historical_records_same_semantics` | 已收敛 |
| AC-001-3 | 全模块只 import 标准库（6～18 行），无网络 / 进程代码 | `test_zero_model_and_network_attempts`（清空凭证环境变量；钩子先计数再拒绝；计数 0、退出 0、产物键集完整） | 已收敛 |
| AC-001-4 | `read_source` 原因类别、收尾判据、`_source_gaps`、`main`、`_write_artifacts`；摘要缺口下不填 0（T-13～T-15） | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work`（哈希 / 业务状态 / 控制动作分别观测） | 已收敛 |
| AC-002-1 | `_dimension_values` / `_groups`（`(未知)` 独立成组） | `test_missing_dimensions_unknown_group` | 已收敛 |
| AC-002-2 | `_dimension_values`（origin、`annotation_conflict`） | `test_annotation_origin_and_sources_untouched` | 已收敛 |
| AC-002-3 | `_groups`（按维度守恒，只用已确认记录） | `test_group_conservation_per_dimension`、`test_group_denominator_unknown_with_source_gaps` | 已收敛 |
| AC-003-1 | `normalize_usage` / `_aggregate_tokens` | `test_exclusive_dimensions_total_170` | 已收敛 |
| AC-003-2 | `normalize_usage`（子集、`totalTokens` 对账） | `test_subset_fields_and_unreconciled` | 已收敛 |
| AC-003-3 | `_aggregate_tokens` 的 peak、`render_summary` | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` | 已收敛 |
| AC-003-4 | `_usage_value`、`confirmed_zero`、`_appended_entry`、`_aggregate_tokens` | `test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-004-1 | `_read_pi_json_events`（最终值只取 `message_end`）、`_nonmonotonic` | `test_cumulative_snapshots_final_12`、`test_nonfinal_partial_lower_bound_10` | 已收敛 |
| AC-004-2 | 归属者规则（`turn_end` / `agent_end` 不计；toolResult 只计 `message_end`；不读 `tool_execution_end.result.usage`） | `test_repeated_message_counted_once` | 已收敛 |
| AC-004-3 | `_validate_relations`、`_partition_sources`、`_lineage_partition`、`_nested_partition` / `_nested_failure` | `test_relation_graph_rejected`、`test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`、`test_relation_shapes_unsupported_retain_facts`、`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage` | 已收敛 |
| AC-005-1 | `_tool_event` / `_event_tool_result` / `_tool_counts` | `test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views` | 已收敛 |
| AC-005-2 | `_retry_brackets` | `test_retry_requires_explicit_association`（12 种情形，`total` 恒 unknown） | 已收敛 |
| AC-005-3 | `_count_metrics` 的 `model_operations`、`_unobserved_paths`、`_nested_failure` | `test_covered_and_unobserved_paths`、`test_attempt_states_and_operation_records`、`test_nested_link_negative_cases`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-005-4 | `_rework`（只取标注） | `test_semantic_rework_annotation_only` | 已收敛 |
| AC-006-1 | `_source_timing` / `_aggregate_timing` | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source` | 已收敛 |
| AC-006-2 | `_source_timing` / `_outcome` | `test_timeout_known_duration_usage_unknown` | 已收敛 |
| AC-007-1 | `_observation`、`_groups`、`render_summary`（覆盖表、分组节、token 节） | `test_summary_contents_units_denominators`、`test_all_known_aggregation_normalized_facts`（D1）、`test_coverage_denominator_unknown_with_source_gaps`、`test_group_denominator_unknown_with_source_gaps`、`test_token_unknown_records_unknown_with_source_gaps` | 已收敛 |
| AC-007-2 | 白名单抽取、`_hash_ref`、标签正则、固定错误类别 | `test_privacy_sentinels_absent`、`test_path_shaped_labels_rejected_not_echoed` | 已收敛 |
| AC-007-3 | `_out_dir`（在仓库内 → 退出 2） | `test_repo_state_unchanged` | 已收敛 |
| AC-007-4 | `_load_comparison`（只投影元数据）/ `_comparability` | `test_comparability_flags_no_money` | 已收敛 |
| AC-008-1 | 试点（非代码） | T-12 手动步骤 1 | 待试点（外部阻塞） |
| AC-008-2 | 夹具 F1 / F2 / F3 与 D1 | `test_synthetic_categories_covered` | 已收敛 |
| AC-008-3 | 试点流程 | T-12 手动步骤 2 | 待试点（外部阻塞） |

计数：已收敛 25、待试点 2、差距 0。

## plan 符合性抽查（测试可能漏掉的部分）

- **pi 1.4.0 事件形状**：夹具 blob 未变。`message_update` 用顶层 `usage`；toolResult 由 `tool_result_events` 成对写出 `message_start` + `message_end`，实现只在 `message_end` 计数（`_read_pi_json_events` 只把 assistant 的 `message_start` 当尝试）；`compaction_end` 无 `result` 时为 interrupted、用量未知；助手 `message_start` 的 `pending` 为非最终。
- **白名单投影**：compaction / branch_summary 只投影 `usage`；`entry_appended` 只取 type / id，usage 条目另取 kind / provider / model / usage，其他类型只检测顶层 `usage` 键；toolCallId、entry id、session id 只以 `sha256[:16]` 引用；`path` / `parent_link` 带 `repr=False` 且不输出；records.json 只含类型化字段。T-15 只改渲染，不引入新投影来源。
- **写出**：内存生成后按 report.json →（records.json）→ summary.md 用 `open(path, "x")` 独占创建；失败只删本次创建的文件，清理失败给 `partial_artifacts_left=<n>`。out-dir 须已存在且不在 `parents[2]` 之内，均在写出前检查。
- **退出码与错误类别**：0 / 3 / 2 / 1 与 Plan §2 一致；argparse 错误转 `invalid_arguments`；stderr 只输出固定类别。
- **离线**：生产模块只 import 标准库；审计钩子只在测试辅助模块；`test_zero_model_and_network_attempts` 先记后拒外部尝试。
- **测试纪律**：经公开接口调用真实实现，期望值为字面量；替身只在声明边界（文件系统写失败的 `Path.open` / `unlink`；D1 在 `build_report` 边界注入）。
- **工程准则（AGENTS §5）**：T-15 只在 `render_summary` 中加一个局部标签变量与一处条件，无新抽象、新依赖或新工具，`main` 仍只写正常流程；入口校验仍集中在 `load_manifest` / `_read_*`。未发现投机性复杂度。

## 非阻塞观察（不是差距，未追加任务）

1. 峰值行“参与记录数 / 尝试总数”中的“尝试总数”是 Plan §3.3 原词，实为已确认集合中观测到的主尝试记录数；摘要另有“运行内总数：未知”。缺口下该行已标下界。是否改措辞由 Review 判断，改动须先过 Plan（同 R3 观察 1）。
2. `_groups` 在生产代码中用 `assert conserved`，`python -O` 下会被移除。Plan §4.3 原文即“断言”，测试另行核对加和（同 R1～R3）。
3. 同类扫描中补充的“全部 loaded、同会话双采集”情形：摘要写“未完全去重；未知 0 条”“分母 0”。这是 Plan 对“选定且已确认去重的总体”的定义所致，被排除的记录已逐来源列出，不是来源缺口；如 Review 认为文案易误读，属 Plan 层措辞问题。

## 本会话实际运行的命令与结果

`-k` 命令按 tasks.md 原文（含 `cd backend &&`）在仓库根执行；Git 核对在仓库根执行。

- 从 tasks.md“## 任务”节提取 T-01～T-11、T-13～T-15 的全部 `-k` 命令，共 **50 条**（T-12 为手动命令；“通用约定”模板行不在该节内），**按原样**逐条运行，全部通过。各条计数见任务表；T-15 命令 1 → 4 passed。
- `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`（T-11 命令 8、T-13～T-15 命令 2）→ **319 passed**（5.40 s）。
- `cd backend && python -m pytest tests/ -q`（T-11 命令 9、T-13～T-15 命令 3）→ **772 passed / 1 failed / 5 skipped**（160.88 s）。唯一失败 `tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（netstat 非空监听断言），即既有基线。相对 R3 实测 768 / 1 / 5，只多出 T-15 新增的 4 个通过用例；与 review.md 第 7 批记录的实施者结果一致。
- T-11 命令 10：`git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出（退出 1）；`git diff --exit-code -- backend/pyproject.toml .gitignore` 退出 0，`7bd2e5b..HEAD` 区间两者也无变化；`git status --porcelain=v1 --untracked-files=all` 开始与结束时均为空。`git diff --check 7bd2e5b..HEAD` 退出 0。
- 冻结 spec 正文 SHA256 复算：`a504fed8…e823`，一致。
- 合成冒烟（`python -B`，系统 Temp 临时目录，结束后删除）：`git show f3e3d18:backend/tools/dev_harness_budget.py` 作对照模块，对 7 种输入（全部 loaded；S2 缺失 / 坏行 / 只有 header / v2 / 未 settled；同会话双采集）分别经两版 `load_manifest` → `read_source` → `build_report` → `render_summary`。结果：`report.json` 7 种全部相同；摘要在全部 loaded 与同会话双采集两种情形下字节相同，5 种缺口情形只在 token 节叙述行与“未知记录”列不同（见上文）。

## 追加的任务

无。本轮未发现代码与 spec / plan / tasks 之间的差距，tasks.md 未改动。

## 下一步与边界

- 按 model-routing 由独立审核员 A（新开会话、与实施隔离、与实施模型不同，首选 `claude-fable-5-1`，先测 bridge）依 spec + plan + tasks + 真实 diff 做 Review；Review 后由用户确认结论（Gate 2），才可 Handoff。
- 本报告**不是**独立 Review，**不是** Gate 2，**不是** AC 验收，也不授权真实试点。T-12 / AC-008-1 / AC-008-3 仍须用户另行显式选定并授权具体文件；未完成前 Review 不得判这两条通过。
