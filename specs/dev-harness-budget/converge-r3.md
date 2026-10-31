# Feature: dev-harness-budget v1 Converge 报告 R3（converge-r3.md）

> Converge 阶段产物（[workflow.md 第 9 步](../../docs/development/workflow.md#step-9)）。T-14 实施后，逐项对比代码与冻结 spec、plan、tasks。
> 本报告**不是**独立 Review，**不是** Gate 2，也**不是** AC 验收；27 条 spec AC 仍全部未勾选。[Converge R1](converge.md)、[Converge R2](converge-r2.md) 原文不动。

- **Converge R3 = `claude-opus-5-5 via claude-bridge`**，即计划 / 分析类首选模型 + 首选通道。协调者派工前对 bridge 做过一次最小真实调用，成功（协调者陈述）。本会话没有换模型，也没有改 provider / 路由 / key / 全局配置。这是新开会话，未写过本 feature 的代码；实施者是 `openai/gpt-6-astra`。
- **固定提交**：`f3e3d18482a2e6d560e1d84011e88e5200420abd`（`D:/2030/Futures-AI`，分支 `workbench`），开始时 `git status --porcelain=v1 --untracked-files=all` 为空。
- **本会话写入**：只有两处——新建本文件；在 tasks.md 任务列表末尾（T-14 之后、AC 覆盖表之前）追加 T-15（git diff +19 / −0）。没有改动既有任务、spec / plan / checklist* / analyze* / converge.md / converge-r2.md / review.md / HANDOFF / 索引 / 代码。没有 Git 写操作、联网、安装或派工。没有读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。合成冒烟放在 Python `TemporaryDirectory` 中，结束时自动清理。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ f3e3d18（blob ee8e4ab）全文
docs/development/workflow.md @ f3e3d18（blob 4aca344）全文（重点：第 8～11 步、Gate 1 / Gate 2）
docs/development/model-routing.md @ f3e3d18（blob f980f5c）全文
backend/README.md @ f3e3d18（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ f3e3d18（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致）
specs/dev-harness-budget/plan.md @ f3e3d18（blob 9c1c8bc，r4）全文
specs/dev-harness-budget/tasks.md @ f3e3d18（blob 4c5a8c1）全文
specs/dev-harness-budget/checklist.md @ f3e3d18（blob 04fe4b1，Checklist R3，23/23）全文
specs/dev-harness-budget/analyze-r2.md @ f3e3d18（blob b96ddab）全文
specs/dev-harness-budget/converge.md @ f3e3d18（blob 4c42339，Converge R1）全文
specs/dev-harness-budget/converge-r2.md @ f3e3d18（blob 2f2889a，Converge R2）全文
specs/dev-harness-budget/review.md @ f3e3d18（blob 4902947）“Implement”节至文末（含第 1～6 批、Converge R1 / R2、第 6 批只读扫描）
真实 diff：git diff 7bd2e5b..HEAD -- backend（README +1、3 个新文件）；git diff 812c1c1..HEAD -- backend specs/dev-harness-budget/tasks.md（T-14）
backend/tools/dev_harness_budget.py @ f3e3d18（blob 043858c）全文 1742 行
backend/tests/test_dev_harness_budget.py @ f3e3d18（blob e7cd80c）全文 1848 行
backend/tests/dev_harness_budget_fixtures.py @ f3e3d18（blob ee1318c，自 b8175f4 起未变）全文 416 行
```

本轮未重读 pi 1.4.0 安装包：夹具 blob 自 R1 起未变，R1 / R2 已按 json.md、json-event.js、agent-loop.js 核对过夹具的事件形状。本机全局 npm 中只找到另一工具内嵌的 pi-coding-agent 0.49.3。1.4.0 安装位于 `~/.pi` 之下，本会话按约束不进入该目录。

## 结论

**未收敛**。

T-14 按完成标准实施到位，Converge R2 指出的分组节差距已关闭；T-13 仍然成立。按派工要求对整份报告做了一次同类扫描，结果发现**最后 1 处同类残留**：选定来源有缺口时，`summary.md` 的 `### token` 节仍写“未知 0 条用量归属记录”，维度表“未知记录”列仍为 0。同一报告中，覆盖表 tokens 行把同一数量（`tokens.unknown_records`）显示为“未知”（见下节）。为此追加 **T-15**。除此之外没有发现其他同类位置，见“同类扫描”。T-15 实施后，须对新的固定提交重跑 Converge（R4）。

T-01～T-11、T-13、T-14 的 49 条 `-k` 验证命令全部通过；模块 315 passed；全量 768 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 基线。AC-008-1 / AC-008-3 依赖 T-12 真实试点，记为“待试点”，不是代码差距。

## T-14 是否真正关闭 Converge R2 差距

| 核对项 | 结果 |
|---|---|
| 任一选定来源非 loaded 时，`groups.<维度>.denominator` 为 null（四维） | 是：`_groups` 得到 `build_report` 中只计算一次的 `missing_sources`，非 0 时 `denominator` 为 None |
| 另列非 loaded 来源数，单位“来源”，不与记录计数相加 | 是：`groups.<维度>.missing_sources = {"count": n, "unit": "来源"}` |
| 摘要分组节首行“分母 未知”，组行“未覆盖 / 缺失记录”“分母”两列为“未知” | 是：`render_summary` 按 `group["denominator"]` 是否为 None 渲染；冒烟中缺失 / 坏行两种情形均为 `### phase` →“分母 未知” |
| 已知小计、已覆盖记录、守恒不变 | 是：`known_subtotal`、`conserved`、各组 `known_subtotal` / `known_records` 不变；测试断言 `conserved` 为 true，且四维各组之和 = `tokens.known_subtotal` |
| 全部 loaded 时输出不变 | 是：对照用例断言摘要字节 SHA256 等于 `812c1c1` 下同一输入的输出（`b9884b1e…c554`），以及 `| Plan | 170 | 1 | 0 | 1 |`、`denominator` = 1、`missing_sources.count` = 0 |
| 新测试经 `main` 断言 | 是：`test_group_denominator_unknown_with_source_gaps` 参数化 missing / bad_json / header / loaded；断言退出码 3 / 0、`sources=gaps|ok`、stderr 为空、S1 / S2 的 `session_ref` 不同、四维 JSON 字段、各维节首行与全部组行；期望值都是字面量（170 / 340、1 / 2） |
| T-13 仍成立 | 是：同一测试同时断言 `observation.metrics.tokens/tool_calls` 的 `denominator`、`missing` 为 null；T-13 命令 1 → 4 passed |
| tasks.md 覆盖表 AC-007-1 行 | 是：任务列 `T-09、T-10、T-13、T-14`，测试列含 `test_coverage_denominator_unknown_with_source_gaps` 与 `test_group_denominator_unknown_with_source_gaps`（R2 非阻塞观察 1 已处理） |

判定：T-13、T-14 均**已收敛**。

## 差距：选定来源有缺口时，token 节仍写“未知 0 条”（→ T-15）

- **复现**：内存合成，`TemporaryDirectory`，经 `main` → 真实 `read_source` / `build_report` / `render_summary`。S1 为已加载的 F1（改会话 id，170），S2 依次为缺失 / 坏行 / 只有 header。三种情形的实际输出：
  - 覆盖表：`| tokens | partial | 用量归属记录 | 选定且已确认去重的快照记录 | 未知 | 1 | 未知 | 未知 | source_missing |`（T-13 已修；这里的“未覆盖 / 缺失”取自 `tokens.unknown_records`）；
  - `### token` 节：`已确认去重；未知 0 条用量归属记录；原因：source_missing。`（坏行：`原因：bad_json`；只有 header：`原因：no_usage_records_observed`）；
  - 维度表：`| input | 100 | 1 | 未知 | 0 | 0 | 0 |`，“未知记录”列为 0（坏行：`| input | 200 | 2 | 未知 | 0 | 0 | 0 |`）；
  - 紧接着的下一行写：`记录单位：用量归属记录；分母 未知（选定且已确认去重的快照记录）。`
- **为什么是差距**：
  - 同一份摘要对同一数量（选定且已确认去重的用量归属记录中未知者的条数）一处写“未知”，一处写“0”，自相矛盾。这与 R2 分组节的问题形态相同。
  - “未知 0 条”就是“全部已知”。S2 属于选定来源总体，其记录条数与用量都不可知。Plan §4.3 第 1 条明确规定：缺失或截断的来源不产生记录，对空集说“全部 known”是空真。
  - 不符 spec AC-007-1（缺失计数须基于声明的选定来源总体，分母未知不冒充已知），也与 AC-001-4 的“观测失败时不填 0”相悖。
  - 测试没有发现：T-13 / T-14 的测试只断言覆盖表和分组节；`test_summary_contents_units_denominators` 的单来源缺口用例只断言其他文案。
- **不受影响**：已知小计、完整总计 unknown、原因列表、“已知记录”“部分记录”“无效记录”列，以及 `report.json`。`tokens.unknown_records` 在 JSON 中是观测记录计数，这与 T-14 对 groups JSON 的既定处理一致；选定总体的缺失数在 JSON 中已由 `observation.metrics.tokens.missing` = null 与 `missing_sources` 表达。全部 loaded 时输出正确。
- **处置**：追加 T-15，只改摘要渲染，不改 Plan、不新增需求，也不需要回 Clarify。

## 同类扫描（整份报告，来源有缺口时）

逐项检查“对选定总体给出已知的记录单位分母 / 总数 / 缺失 0”的位置：

| 位置 | 来源有缺口时的输出 | 判定 |
|---|---|---|
| 覆盖表 tokens / tool_calls 行 | 分母、缺失、百分比均为“未知”，另列来源缺口数 | 已关闭（T-13） |
| 覆盖表 main_attempts / retries 行 | 分母取 run_total / total，缺口时为未知（`count_blockers` 含来源缺口原因） | 不属此类 |
| 覆盖表 rework / timing 行 | 单位“来源”，分母 = 选定来源数，已知 | 不属此类 |
| 分组节首行与组行 | “分母 未知”，缺失 / 分母列“未知” | 已关闭（T-14） |
| `### token` 叙述行“未知 N 条用量归属记录” | “未知 0 条” | **差距 → T-15** |
| `### token` 维度表“未知记录”列 | 0 | **差距 → T-15**（同一数量的分维度形式） |
| 维度表“已知记录”“部分记录”“无效记录”列 | 观测计数 | 不属此类：都是正向观测计数，0 不意味着“全部已知”，与 T-13 / T-14 保留“已覆盖”同理 |
| “记录单位 … 分母” | “分母 未知” | 已关闭（T-13） |
| 峰值行“参与记录数 / 尝试总数：1 / 1” | 缺口时标“已知记录中的峰值（下界）” | 不属此类：措辞取自 Plan §3.3 原文，所在行已标下界；即使全部 loaded，它与“运行内总数：未知”也是两个不同口径，问题与来源缺口无关（见非阻塞观察 1） |
| 尝试行“观测到的主 assistant 尝试：N；运行内总数：未知” | 标“观测到的”，总数未知 | 不属此类 |
| 工具行“工具 direct：N；… 全部总数：未知” | `all_total` 在缺口下为 unknown（`overlap_unconfirmed`） | 不属此类 |
| 重试行 | 已确认小计标“下界”，总数未知 | 不属此类 |
| 操作记录行“操作记录 X：N 条；已覆盖” | 观测记录计数，请求数未知 | 不属此类 |
| 逐来源行“观测到的归属记录 N 条”、`population`、stdout 状态行 | 标“观测到的”，或以来源为单位 | 不属此类 |
| `report.json` 的 `tokens.record_count` / `unknown_records`、`groups.*.record_count` | 观测记录计数；同一报告的 `observation.metrics.tokens.denominator/missing` 与 `groups.*.denominator` 为 null | 不属此类（与 T-14 的既定 JSON 口径一致，见非阻塞观察 2） |

实施者第 6 批的只读扫描（review.md）报告了两处候选。对照本表：(1) token 节“未知 0 条”及各维 `unknown_records` 0，判为差距，**仅限摘要渲染**；JSON 保持观测计数。(2) 峰值“尝试总数”措辞判为不属此类。

## 任务表

| 任务 | 状态 | 证据（本会话） |
|---|---|---|
| T-01 骨架与清单校验 | 已收敛 | 分节结构与 §2 的 dataclass 齐备；`load_manifest` 含三类标签正则、路径形值拒绝、`unknown_field`、并集图迭代 DFS；命令 1 → 19 passed |
| T-02 读取框架与 session-v3 | 已收敛 | 以 `rb` 读取，按 `b"\n"` 切分并去掉 `\r`；四类 unavailable 原因、`empty`、`truncated`；r3 对账规则；命令 1～3 → 14 / 1 / 17 passed |
| T-03 json-events、收尾判据、重试标记 | 已收敛 | toolResult 只在 `message_end` 计；`message_update` 读顶层 `usage`；`entry_appended` 白名单；`NONRUN_EVENTS` 4 种；命令 1～3 → 7 / 12 / 22 passed |
| T-04 token 聚合、完整总计、峰值 | 已收敛 | 完整总计三条件、峰值标签与注明、F13 a～d；命令 1～7 → 1 / 3 / 6 / 1 / 4 / 2 / 4 passed |
| T-05 来源关系去重 | 已收敛 | 命令 1～4 → 3 / 2 / 8 / 3 passed |
| T-06 嵌套覆盖 | 已收敛 | 命令 1～3 → 13 / 3 / 5 passed |
| T-07 尝试 / 工具 / 重试 / 返工 / 未观测 | 已收敛 | 命令 1～6 → 8 / 9 / 8 / 12 / 5 / 6 passed |
| T-08 时间与执行结果 | 已收敛 | 命令 1～4 → 9 / 7 / 4 / 13 passed |
| T-09 维度、守恒、六项矩阵、D1 | 已收敛 | 命令 1～4 → 2 / 2 / 4 / 8 passed |
| T-10 摘要、CLI、写出、比较 | 未收敛（→ T-15） | 退出码、固定 stdout / stderr、`open("x")`、只清理本次文件、可比性、无金额均符合；覆盖表与分组节已由 T-13 / T-14 修正；完成标准 1 的“覆盖计数 + 单位 + 分母”在 token 节仍有“未知 0 条”残留；命令 1～5 → 5 / 12 / 3 / 4 / 15 passed |
| T-11 离线 / 隐私 / 仓库状态 + README | 已收敛 | 命令 1～7 → 1 / 2 / 3 / 7 / 6 / 1 / 1 passed；命令 8 → 315 passed；命令 9 → 768 / 1 / 5；命令 10 符合；README 工具表恰好一行 |
| T-12 真实试点 | BLOCKED（外部） | 用户未选定、未授权文件；本会话未运行、未读取任何真实数据 |
| T-13 覆盖分母（R1 追加） | 已收敛 | 命令 1 → 4 passed；命令 2 → 315 passed；命令 3 → 768 / 1 / 5 |
| T-14 分组节分母（R2 追加） | 已收敛 | 见上文“T-14 是否真正关闭”；命令 1 → 4 passed；命令 2 → 315 passed；命令 3 → 768 / 1 / 5（基线 764 + 新增 4，无新增失败） |
| T-15 token 节未知记录数（本轮追加） | 未开始 | 见“差距”；须 Implement 后重跑 Converge |

## AC 表（27 条）

“已收敛”只表示代码和测试与规格对上了，不是验收；验收由独立 Review 与 Gate 2 决定。

| AC | 实现位置（`dev_harness_budget.py`） | 测试 | 状态 |
|---|---|---|---|
| AC-001-1 | `load_manifest` / `read_source`（只打开清单列出的路径，不跟随 `parentSession`） | `test_only_selected_sources_opened`（审计到的 open 集合恰好是清单 + 选定来源 + 3 个产物；写出带 `O_EXCL`） | 已收敛 |
| AC-001-2 | `read_source`（时间戳不进入语义） | `test_historical_records_same_semantics` | 已收敛 |
| AC-001-3 | 全模块只用标准库，无网络 / 进程代码 | `test_zero_model_and_network_attempts`（清空凭证环境变量；钩子先计数再拒绝；计数为 0、退出 0、产物键集完整） | 已收敛 |
| AC-001-4 | `read_source` 原因类别、收尾判据、`_source_gaps`、`main`、`_write_artifacts` | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work` | 已收敛（token 节“未知 0 条”的“不填 0”问题按 AC-007-1 计入 T-15） |
| AC-002-1 | `_dimension_values` / `_groups`（`(未知)` 独立成组） | `test_missing_dimensions_unknown_group` | 已收敛 |
| AC-002-2 | `_dimension_values`（origin、`annotation_conflict`） | `test_annotation_origin_and_sources_untouched` | 已收敛 |
| AC-002-3 | `_groups`（按维度守恒，只用已确认记录；T-14 未改动守恒） | `test_group_conservation_per_dimension`、`test_group_denominator_unknown_with_source_gaps`（缺口下 `conserved`） | 已收敛 |
| AC-003-1 | `normalize_usage` / `_aggregate_tokens` | `test_exclusive_dimensions_total_170` | 已收敛 |
| AC-003-2 | `normalize_usage` | `test_subset_fields_and_unreconciled` | 已收敛 |
| AC-003-3 | `_aggregate_tokens` 的 peak、`render_summary` | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` | 已收敛 |
| AC-003-4 | `_usage_value`、`confirmed_zero`、`_appended_entry`、`_aggregate_tokens` | `test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-004-1 | `_read_pi_json_events`、`_nonmonotonic` | `test_cumulative_snapshots_final_12`、`test_nonfinal_partial_lower_bound_10` | 已收敛 |
| AC-004-2 | 归属者规则（`turn_end` / `agent_end` 不计；toolResult 只计 `message_end`；不读 `tool_execution_end.result.usage`） | `test_repeated_message_counted_once` | 已收敛 |
| AC-004-3 | `_validate_relations`、`_partition_sources`、`_lineage_partition`、`_nested_partition` | `test_relation_graph_rejected` 等 8 项 | 已收敛 |
| AC-005-1 | `_tool_event` / `_event_tool_result` / `_tool_counts` | `test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views` | 已收敛 |
| AC-005-2 | `_retry_brackets` | `test_retry_requires_explicit_association` | 已收敛 |
| AC-005-3 | `_count_metrics` 中的 `model_operations`、`_unobserved_paths`、`_nested_failure` | `test_covered_and_unobserved_paths`、`test_attempt_states_and_operation_records`、`test_nested_link_negative_cases`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-005-4 | `_rework` | `test_semantic_rework_annotation_only` | 已收敛 |
| AC-006-1 | `_source_timing` / `_aggregate_timing` | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source` | 已收敛 |
| AC-006-2 | `_source_timing` / `_outcome` | `test_timeout_known_duration_usage_unknown` | 已收敛 |
| AC-007-1 | `_observation`、`_groups`、`render_summary` | `test_summary_contents_units_denominators`、`test_all_known_aggregation_normalized_facts`（D1）、`test_coverage_denominator_unknown_with_source_gaps`（T-13）、`test_group_denominator_unknown_with_source_gaps`（T-14）；token 节未知记录数在缺口下没有测试覆盖 | **差距**（覆盖表、分组节已修；token 节 → T-15） |
| AC-007-2 | 白名单抽取、`_hash_ref`、标签正则、固定错误类别 | `test_privacy_sentinels_absent`、`test_path_shaped_labels_rejected_not_echoed` | 已收敛 |
| AC-007-3 | `_out_dir` | `test_repo_state_unchanged` | 已收敛 |
| AC-007-4 | `_load_comparison` / `_comparability` | `test_comparability_flags_no_money` | 已收敛 |
| AC-008-1 | 试点（非代码） | T-12 手动步骤 1 | 待试点（外部阻塞） |
| AC-008-2 | 夹具 F1 / F2 / F3 与 D1 | `test_synthetic_categories_covered` | 已收敛 |
| AC-008-3 | 试点流程 | T-12 手动步骤 2 | 待试点（外部阻塞） |

计数：已收敛 24、差距 1（AC-007-1）、待试点 2。

## plan 符合性抽查（测试可能漏掉的部分）

- **pi 1.4.0 事件形状**：夹具自 R1 起未变（blob `ee1318c`）。`message_update` 用顶层 `usage`；toolResult 由 `tool_result_events` 写成 `message_start` + `message_end` 一对，实现只在 `message_end` 计数；`compaction_end` 无 `result` 时记为 interrupted、用量未知；助手 `message_start` 的 `pending` 视为非最终。R1 / R2 已对照公开安装包核对，本轮未重读（原因见输入清单下方说明）。
- **白名单投影**：输出只来自类型化事实。toolCallId、entry id、session id 只以 `sha256[:16]` 引用；`path` / `parent_link` 带 `repr=False`、不进入输出；records.json 只含类型化字段。T-14 只新增整数 / 固定字符串字段，没有引入新的投影来源。
- **写出**：`open(path, "x")` 按 report.json →（records.json）→ summary.md 的顺序独占创建；失败时只删除本次创建的文件，清理失败给出 `partial_artifacts_left=<n>`。out-dir 须已存在，且不在 `parents[2]` 之内。
- **退出码与错误类别**：0 / 3 / 2 / 1 与 plan §2 一致；argparse 错误转为 `invalid_arguments`；stderr 只输出固定类别。
- **离线**：生产模块只 import 标准库（第 6～18 行）；审计钩子只在测试辅助模块。
- **测试纪律**：T-14 测试经 `main` 调用真实实现，期望值是字面量，没有复写分母逻辑；全部 loaded 时用固定摘要哈希防回归。
- **工程准则（AGENTS §5）**：T-14 的改动是 `build_report` 中只计算一次的 `missing_sources`、`_groups` 多一个参数与两个字段、`render_summary` 两处条件渲染；没有新增单次使用的抽象，没有新依赖或新工具，`main` 仍只写正常流程。未发现投机性复杂度。

## 非阻塞观察（不是差距，未追加任务）

1. 峰值行“参与记录数 / 尝试总数”的“尝试总数”是 Plan §3.3 原词，实际含义是已确认集合中观测到的主尝试记录数；摘要另有“运行内总数：未知”，两者是不同口径。缺口下该行已标“已知记录中的峰值（下界）”。是否改为“观测到的尝试数”之类措辞，由 Review 判断；改动须先过 Plan。
2. `report.json` 的 `tokens.record_count` / `unknown_records` 与各维计数、`groups.*.record_count` 都是观测记录计数；选定总体的分母 / 缺失由同一报告的 `observation.metrics.*` 与 `groups.*.denominator` 表达。这是 T-14 已写明的口径，T-15 不改变它。
3. R1 / R2 观察仍然存在：`_groups` 在生产代码中用 `assert conserved`，`python -O` 下会被移除。Plan §4.3 原文即“断言”，测试也另行核对了加和。

## 本会话实际运行的命令与结果

均在 `backend/` 下执行（命令 10 与 Git 核对在仓库根执行）：

- 从 tasks.md 原文“## 任务”节提取 T-01～T-11、T-13、T-14 的全部 `-k` 命令，共 **49 条**（“通用约定”的模板行不在该节内，T-12 为手动命令），**按原样**逐条运行，全部通过。各条计数见任务表；T-14 命令 1 → 4 passed。
- `python -m pytest tests/test_dev_harness_budget.py -q`（T-11 命令 8、T-13 / T-14 命令 2）→ **315 passed**（5.70 s）。
- `python -m pytest tests/ -q`（T-11 命令 9、T-13 / T-14 命令 3）→ **768 passed / 1 failed / 5 skipped**（166.37 s）。唯一失败是 `tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（netstat 非空监听断言），即既有基线。与 R2 实测的 764 / 1 / 5 相比，只多出 T-14 新增的 4 个通过用例，没有新增失败。review.md 记载的实施者结果（768 / 1 / 5）与此一致。
- T-11 命令 10：`git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出（退出 1）；`git diff --exit-code -- backend/pyproject.toml .gitignore` 退出 0，`7bd2e5b..HEAD` 区间内两者也无变化；开始时 `git status --porcelain=v1 --untracked-files=all` 为空。`git diff --name-only 7bd2e5b..HEAD` 只有 3 个新文件、`backend/README.md`（工具表恰好 +1 行）、tasks.md、review.md、converge.md、converge-r2.md；`git diff --check 7bd2e5b..HEAD` 退出 0。
- 冻结 spec 正文 SHA256 复算：`a504fed8…e823`，一致。
- 内存合成冒烟（`python -B`，`TemporaryDirectory`；S2 = 缺失 / 坏行 / 只有 header / 不选，分别构造“分组”与“T-13 构造”两套输入）：结果见“差距”和“同类扫描”。
- 新测试名核对：`test_token_unknown_records_unknown_with_source_gaps` 与现有 49 个测试名之间不存在子串碰撞。追加后 `git diff --check` 退出 0，tasks.md diff 为 +19 / −0。

## 追加的任务

- **T-15 token 节未知记录数：选定来源有缺口时，摘要的未知用量归属记录数为未知**（tasks.md 中 T-14 之后）。完成标准 1 引用 AC-007-1，期望值是字面量（三种缺口的叙述行、`input` / `cache_write_1h` 行，以及全部 loaded 的对照行），验证命令为 `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_token_unknown_records_unknown_with_source_gaps"`。完成标准 2、3 为模块与全量回归（非 AC），全量基线 768 / 1 / 5。只改 `render_summary`，`report.json` 与全部 loaded 时的摘要不变。
- 覆盖表 AC-007-1 行不在本轮允许写入的范围内。T-15 落地时，应补列 T-15 与新测试名，由实施者 / 协调者在实施提交中处理。

## 下一步与边界

- 按 model-routing 派 Implement 实施 T-15（首选 `openai/gpt-6-astra`，派工前先探活，同时补齐覆盖表 AC-007-1 行）。之后对新的固定提交重跑 Converge（R4），直到报告“已收敛（T-01～T-11、T-13～T-15 离线实现范围）”，再进入独立 A Review。
- 本报告不是独立 Review，不是 Gate 2，不是 AC 验收，也不授权真实试点。T-12 / AC-008-1 / AC-008-3 仍须用户另行显式选定并授权具体文件。
