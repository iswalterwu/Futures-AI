# Feature: dev-harness-budget v1 Converge 报告 R2（converge-r2.md）

> Converge 阶段产物（[workflow.md 第 9 步](../../docs/development/workflow.md#step-9)），在 T-13 实施后逐项对比代码与冻结 spec、plan、tasks。
> 本报告**不是**独立 Review，**不是** Gate 2，也**不是** AC 验收；27 条 spec AC 仍全部未勾选。[Converge R1](converge.md) 原文不动。

- **Converge R2 = `claude-opus-5-5 via claude-bridge`**（计划 / 分析类首选模型 + 首选通道）。协调者派工前对 bridge 做过一次最小真实调用，成功（协调者陈述）。本会话没有换模型，也没有改 provider / 路由 / key / 全局配置。这是新开会话，未写过本 feature 的代码；实施者是 `openai/gpt-6-astra`。
- **固定提交**：`b014e401a836565765dd0060a4260334d35ba51d`（`D:/2030/Futures-AI`，分支 `workbench`），开始时工作区干净。
- **本会话写入**：只有两处——新建本文件；在 tasks.md 任务列表末尾（T-13 之后、AC 覆盖表之前）追加 T-14（git diff 显示 +20 / −0）。没有改动既有任务、spec / plan / checklist* / analyze* / converge.md / review.md / HANDOFF / 索引 / 代码；没有 Git 写操作、联网、安装或派工。没有读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。合成冒烟放在 Python `TemporaryDirectory` 中，自动清理。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ b014e40（blob ee8e4ab）全文
docs/development/workflow.md @ b014e40（blob 4aca344）全文（重点：第 8～11 步、Gate 1 / Gate 2）
docs/development/model-routing.md @ b014e40（blob f980f5c）全文
backend/README.md @ b014e40（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ b014e40（blob 4689093）全文；锚定 ^## 1. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致）
specs/dev-harness-budget/plan.md @ b014e40（blob 9c1c8bc，r4）全文
specs/dev-harness-budget/tasks.md @ b014e40（blob 4302082）全文
specs/dev-harness-budget/checklist.md @ b014e40（blob 04fe4b1，Checklist R3，23/23）全文
specs/dev-harness-budget/analyze-r2.md @ b014e40（blob b96ddab）全文
specs/dev-harness-budget/converge.md @ b014e40（blob 4c42339，Converge R1）全文
specs/dev-harness-budget/review.md @ b014e40（blob 7ac6e9e）“Analyze R2”至文末（含 Implement 全节、Converge R1、第 5 批）
真实 diff：git diff 7bd2e5b..HEAD -- backend（README +1、3 个新文件）；git diff b8175f4..HEAD -- backend specs/dev-harness-budget/tasks.md（T-13）
backend/tools/dev_harness_budget.py @ b014e40（blob 3d7c68e）全文 1737 行
backend/tests/test_dev_harness_budget.py @ b014e40（blob 0fc356d）全文 1786 行
backend/tests/dev_harness_budget_fixtures.py @ b014e40（blob ee1318c）全文 416 行
pi 1.4.0 公开安装包（非本仓库，只读）：pi-coding-agent docs/json.md（sha256 f1031918…3543）全文；dist/modes/json-event.js（5f375647…d606）全文；
  pi-agent-core dist/agent-loop.js（22ee81f9…1129）只读 emitToolResultMessage 677–680 行
```

## 结论

**未收敛**。

T-13 按其完成标准实施到位，Converge R1 差距在 `observation` 覆盖行已经关闭。但同一类差距仍残留在摘要 / 报告的**分组节**：选定来源有缺口时，分组节仍给出“已知”的记录分母和“缺失 0”，并且与同一报告中 token 行的“分母 未知”自相矛盾（见下节）。为此在 tasks.md 追加 **T-14**。T-14 实施后，须对新的固定提交重跑 Converge（R3）。

T-01～T-11、T-13 的 48 条 `-k` 验证命令全部通过；模块 311 passed；全量 764 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 基线。AC-008-1 / AC-008-3 依赖 T-12 真实试点，记为“待试点”，不是代码差距。

## T-13 是否真正关闭了 Converge R1 差距

| 核对项 | 结果 |
|---|---|
| 任一选定来源非 loaded 时，tokens / tool_calls 的 `denominator`、`coverage_percent`、`missing` 为 null | 是：`_observation` 中 `missing_sources` 非 0 时，这两项的分母与缺失置 None，百分比随之为 None；`covered` 照常给出 |
| 单独字段披露非 loaded 来源数，单位“来源”，不与记录相加 | 是：`metrics.tokens/tool_calls.missing_sources = {"count": n, "unit": "来源"}`；摘要另起一行“非 loaded 选定来源 n 来源；不与记录计数相加” |
| 摘要显示“未知”、不含百分比 | 是：覆盖表两行为 `| 未知 | <covered> | 未知 | 未知 |`；token 节“分母 未知” |
| 全部 loaded 时行为不变 | 是：对照用例断言 `| 1 | 1 | 0 | 100% |`；`test_summary_contents_units_denominators` 的完整行断言仍通过 |
| rework / timing / main_attempts / retries 不变 | 是：新测试逐项断言（来源单位分母 = 2；run_total / total 分母仍为 null） |
| 新测试经 `main` 断言 | 是：`test_coverage_denominator_unknown_with_source_gaps` 参数化 missing / bad_json / header / loaded；断言退出码 3 / 0、`sources=gaps|ok`、stderr 为空、S1 / S2 的 `session_ref` 不同、JSON 三字段为 null、`missing_sources`、摘要行与“无 %”，期望全部是字面量 |
| 文件头清理 | 是：第 4 批写回的“Implement batch 4 … 输入 @ 9db3c33 …”三行注释已删除，文件头只剩用途与用法 |
| tasks.md 覆盖表 AC-007-1 行列 T-13 | 是：任务列为 `T-09、T-10、T-13`。但测试列没有补 `test_coverage_denominator_unknown_with_source_gaps`，属可追溯性小瑕疵（见“非阻塞观察”） |

判定：T-13 自身**已收敛**。但它只覆盖了 `observation` 两行；同一 AC-007-1 / Plan §3.3 规则在分组节没有落实，见下节。

## 差距：选定来源有缺口时，分组节仍给出已知分母（→ T-14）

- **复现**（内存合成，`TemporaryDirectory`，经真实 `read_source` → `build_report` → `render_summary`）：S1 为已加载的 session-v3（F1，170），S2 为缺失的来源，两者都标注 `phase = Plan`。实际输出：
  - 覆盖表：`| tokens | partial | 用量归属记录 | 选定且已确认去重的快照记录 | 未知 | 1 | 未知 | 未知 | source_missing |`（T-13 已修）；
  - token 节：`记录单位：用量归属记录；分母 未知（选定且已确认去重的快照记录）。`
  - 分组节 `### phase`：`单位：用量归属记录；分母 1；选定且已确认去重的快照记录。`，以及 `| Plan | 170 | 1 | 0 | 1 |`（未覆盖 / 缺失 0、分母 1）；
  - `report.json` 的 `groups.phase.record_count` = 1，口径同为“选定且已确认去重的快照记录”。
  - S2 为坏行（partial）时：token 节“分母 未知”，分组节“分母 2”、`| Plan | 340 | 2 | 0 | 2 |`。S2 为只有 header（empty）时与缺失情形相同。
- **为什么是差距**：
  - 同一份报告对同一总体（“选定且已确认去重的快照记录”）给出了两个互相矛盾的分母：未知与 1。
  - S2 是选定来源，并且标注为 `Plan`，它的记录本应计入 `Plan` 组，但数量不可知。分组节的“缺失 0、分母 1”正是 R1 已认定的空真口径。
  - 这不符合 spec AC-007-1（默认摘要的分组与覆盖计数须标明所依据的总体与分母，分母未知不得冒充已知），也不符合 Plan §3.3“单位与分母（均限于选定且已确认去重的总体）”与 §4.3 第 1 条（缺失或截断的来源不产生记录，对空集说“全部 known”是空真）。
  - 分组节没有百分比，所以 T-13 的“无 %”断言覆盖不到它；`test_group_conservation_per_dimension` 的 `selection_gap` 用例只断言守恒，不断言分母。
- **不受影响**：分组守恒（各组已知小计之和 = 已确认总体已知小计，AC-002-3）在缺口情形下仍然成立且正确；全部 loaded 时分组节正确。
- **处置**：追加 **T-14**。T-14 只让分组节符合现有 Plan 规则，不改 Plan、不新增需求，也不需要回 Clarify。

## 任务表

| 任务 | 状态 | 证据（本会话） |
|---|---|---|
| T-01 骨架与清单校验 | 已收敛 | 分节结构与 §2 的 dataclass 齐备；`load_manifest` 含三类标签正则、路径形值拒绝、`unknown_field`、并集图迭代 DFS；命令 1 → 19 passed |
| T-02 读取框架与 session-v3 | 已收敛 | 用 `rb` 读取，按 `b"\n"` 切分并去掉 `\r`；四类 unavailable 原因、`empty`、`truncated`；r3 对账规则；命令 1～3 → 14 / 1 / 17 passed |
| T-03 json-events、收尾判据、重试标记 | 已收敛 | toolResult 只在 `message_end` 计；`message_update` 读顶层 `usage`；`entry_appended` 白名单；末个 settled 判据；命令 1～3 → 7 / 12 / 22 passed |
| T-04 token 聚合、完整总计、峰值 | 已收敛 | 完整总计三条件、峰值标签与注明、F13 a～d；命令 1～7 → 1 / 3 / 6 / 1 / 4 / 2 / 4 passed |
| T-05 来源关系去重 | 已收敛 | 两种单层星形、`duplicate_of` 的 v3 键集核验、血缘净新增、双采集；命令 1～4 → 3 / 2 / 8 / 3 passed |
| T-06 嵌套覆盖 | 已收敛 | 多来源须 flag；(P, T) 分组，(a)～(d) 逐维核对；命令 1～3 → 13 / 3 / 5 passed |
| T-07 尝试 / 工具 / 重试 / 返工 / 未观测 | 已收敛 | 命令 1～6 → 8 / 9 / 8 / 12 / 5 / 6 passed |
| T-08 时间与执行结果 | 已收敛 | 命令 1～4 → 9 / 7 / 4 / 13 passed |
| T-09 维度、守恒、六项矩阵、D1 | 已收敛 | 守恒正确；命令 1～4 → 2 / 2 / 4 / 8 passed（分母问题归 T-14，不涉守恒） |
| T-10 摘要、CLI、写出、比较 | 未收敛（→ T-14） | 退出码、固定 stdout / stderr、`open("x")`、只清理本次文件、可比性与无金额都符合。完成标准 1 的“分组 / 覆盖计数 + 单位 + 分母”在分组节仍会在来源缺口下给出已知分母；命令 1～5 → 5 / 12 / 3 / 4 / 15 passed |
| T-11 离线 / 隐私 / 仓库状态 + README | 已收敛 | 命令 1～7 → 1 / 2 / 3 / 7 / 6 / 1 / 1 passed；命令 8 → 311 passed；命令 9 → 764 / 1 / 5；命令 10 符合；README 工具表恰好一行 |
| T-12 真实试点 | BLOCKED（外部） | 用户未选定、未授权文件；本会话未运行、未读取任何真实数据 |
| T-13 覆盖分母（R1 追加） | 已收敛 | 见上文“T-13 是否真正关闭”；命令 1 → 4 passed，命令 2 → 311 passed，命令 3 → 764 / 1 / 5 |
| T-14 分组节分母（本轮追加） | 未开始 | 见“差距”；须 Implement 后重跑 Converge |

## AC 表（27 条）

“已收敛”只表示代码和测试与规格对上了，不是验收；验收由独立 Review 与 Gate 2 决定。

| AC | 实现位置（`dev_harness_budget.py`） | 测试 | 状态 |
|---|---|---|---|
| AC-001-1 | `load_manifest` / `read_source`（只打开清单列出的路径，不跟随 `parentSession`） | `test_only_selected_sources_opened`（审计到的 open 集合恰好等于清单 + 选定来源 + 3 个产物；`O_EXCL`） | 已收敛 |
| AC-001-2 | `read_source`（时间戳不进入语义） | `test_historical_records_same_semantics` | 已收敛 |
| AC-001-3 | 全模块只用标准库，无网络 / 进程代码 | `test_zero_model_and_network_attempts`（清空凭证环境变量；钩子先计数再拒绝；计数为 0、退出 0、产物完整） | 已收敛 |
| AC-001-4 | `read_source` 原因类别、收尾判据、`_source_gaps`、`main`、`_write_artifacts` | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work` | 已收敛 |
| AC-002-1 | `_dimension_values` / `_groups`（`(未知)` 独立成组） | `test_missing_dimensions_unknown_group` | 已收敛 |
| AC-002-2 | `_dimension_values`（origin、`annotation_conflict`） | `test_annotation_origin_and_sources_untouched` | 已收敛 |
| AC-002-3 | `_groups`（按维度守恒，只用已确认记录） | `test_group_conservation_per_dimension` | 已收敛 |
| AC-003-1 | `normalize_usage` / `_aggregate_tokens` | `test_exclusive_dimensions_total_170` | 已收敛 |
| AC-003-2 | `normalize_usage` | `test_subset_fields_and_unreconciled` | 已收敛 |
| AC-003-3 | `_aggregate_tokens` 中的 peak、`render_summary` | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` | 已收敛 |
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
| AC-007-1 | `_observation`、`_groups`、`render_summary` | `test_summary_contents_units_denominators`、`test_all_known_aggregation_normalized_facts`（D1）、`test_coverage_denominator_unknown_with_source_gaps`（T-13）；分组节在来源缺口下的分母没有测试覆盖 | **差距**（覆盖表已修；分组节 → T-14） |
| AC-007-2 | 白名单抽取、`_hash_ref`、标签正则、固定错误类别 | `test_privacy_sentinels_absent`、`test_path_shaped_labels_rejected_not_echoed` | 已收敛 |
| AC-007-3 | `_out_dir` | `test_repo_state_unchanged` | 已收敛 |
| AC-007-4 | `_load_comparison` / `_comparability` | `test_comparability_flags_no_money` | 已收敛 |
| AC-008-1 | 试点（非代码） | T-12 手动步骤 1 | 待试点（外部阻塞） |
| AC-008-2 | 夹具 F1 / F2 / F3 与 D1 | `test_synthetic_categories_covered` | 已收敛 |
| AC-008-3 | 试点流程 | T-12 手动步骤 2 | 待试点（外部阻塞） |

计数：已收敛 24、差距 1（AC-007-1）、待试点 2。

## plan 符合性抽查（测试可能漏掉的部分）

- **pi 1.4.0 事件形状**：`json-event.js` 的 `toJsonEvent` 只改写 `message_update`，改写后为 `{type, usage: message.usage, assistantMessageEvent}`；夹具与实现都使用顶层 `usage`。`agent-loop.js` 的 `emitToolResultMessage` 先发 `message_start`、再发 `message_end`；夹具用 `tool_result_events` 成对写出，实现只在 `message_end` 计数。json.md：`compaction_end` 中止时无 `result`、`aborted=true`，失败时无 `result`、`aborted=false`，实现两种都记为 interrupted、用量未知，一致。助手 `message_start` 的 `stopReason: "pending"` 视为非最终，一致。“Queue and state events”恰为 4 种，与 `NONRUN_EVENTS` 一致。
- **白名单投影**：summary、details、systemMessage、customType、data、content、note、arguments、errorMessage、cwd 都不进入任何类型。compaction / branch_summary 只投影 `usage`。`entry_unrecognized` 不读取数值。toolCallId、entry id 与 session id 只以 `sha256[:16]` 作内部引用；`parent_link` 与 `path` 在 dataclass 上设了 `repr=False`，不输出。records.json 只含类型化字段，不含调用 ID。
- **写出**：`open(path, "x")` 按 report.json →（records.json）→ summary.md 的顺序独占创建；失败时只删除本次创建的文件，清理失败给出 `partial_artifacts_left=<n>`。out-dir 必须已存在，且不在 `parents[2]` 之内。
- **退出码与错误类别**：0 / 3 / 2 / 1 与 plan §2 一致；argparse 错误转为 `invalid_arguments`；stderr 只输出固定类别。
- **离线**：生产模块只 import 标准库；审计钩子只在测试辅助模块。
- **测试纪律**：期望值都是字面量，经公开接口调用真实实现。替身只在声明的边界使用：文件系统写失败时 monkeypatch `Path.open` / `unlink`；D1 在 `build_report` 边界注入。
- **工程准则（AGENTS §5）**：T-13 的改动是 `_observation` 中的一条条件加一个字段，没有新增单次使用的抽象，也没有新依赖或新工具。入口校验仍集中在 `load_manifest` / `_read_*`。未发现投机性复杂度。

## 非阻塞观察（不是差距，未追加任务）

1. tasks.md 覆盖表 AC-007-1 行的测试列没有列出 `test_coverage_denominator_unknown_with_source_gaps`（T-13）；T-14 落地后也应补列 `test_group_denominator_unknown_with_source_gaps`。覆盖表不在本轮允许写入的范围内，由协调者在实施提交时处理。
2. R1 观察 2 仍然存在：`_groups` 用生产 `assert conserved`，在 `python -O` 下会被移除。Plan §4.3 原文就是“断言”，测试也另行核对了加和，不影响结论。

## 本会话实际运行的命令与结果

均在 `backend/` 下执行（命令 10 在仓库根）：

- 从 tasks.md 原文提取 T-01～T-11 与 T-13 的全部 `-k` 命令（48 条；排除“通用约定”中的模板行 `<表达式>`），**按原样**逐条运行，全部通过。各条计数见任务表，T-13 命令 1 → 4 passed。
- `python -m pytest tests/test_dev_harness_budget.py -q`（T-11 命令 8 / T-13 命令 2）→ **311 passed**（6.18 s）。
- `python -m pytest tests/ -q`（T-11 命令 9 / T-13 命令 3）→ **764 passed / 1 failed / 5 skipped**（173.74 s）。唯一失败是 `tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（netstat 非空监听断言），即既有基线。与 R1 实测的 760 / 1 / 5 相比，只多出 T-13 新增的 4 个通过用例，没有新增失败。
- T-11 命令 10：`git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出（退出 1）；`git diff --exit-code -- backend/pyproject.toml .gitignore` 退出 0，`7bd2e5b..HEAD` 区间内这两个文件也没有变化；开始时 `git status --porcelain=v1 --untracked-files=all` 为空。`git diff --name-only 7bd2e5b..HEAD` 只有 3 个新文件、README、tasks.md、review.md、converge.md；`git diff --check 7bd2e5b..HEAD` 退出 0。
- 冻结 spec 正文 SHA256 复算：`a504fed8…e823`，一致。
- pi 1.4.0 公开包核对：json.md、json-event.js、agent-loop.js 的 sha256 与 Plan §7 记录一致；内容核对见“plan 符合性抽查”。
- 内存合成冒烟（`python -B`，`TemporaryDirectory`，S2 = 缺失 / 坏行 / 只有 header / 不选）：结果见“差距”一节。
- 新测试名核对：`test_group_denominator_unknown_with_source_gaps` 与现有 48 个测试名之间不存在子串碰撞。

## 追加的任务

- **T-14 分组节分母：选定来源有缺口时，分组的记录分母与缺失数为未知**（tasks.md 中 T-13 之后）。完成标准 1 引用 AC-007-1，验证命令为 `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_group_denominator_unknown_with_source_gaps"`；完成标准 2、3 为模块与全量回归（非 AC），基线 764 / 1 / 5。

## 下一步与边界

- 按 model-routing 派 Implement 实施 T-14（首选 `openai/gpt-6-astra`，派工前先探活，同时补齐覆盖表 AC-007-1 行的测试列），再对新的固定提交重跑 Converge（R3），直到报告“已收敛（T-01～T-11、T-13、T-14 离线实现范围）”，之后才进入独立 A Review。
- 本报告不是独立 Review，不是 Gate 2，不是 AC 验收，也不授权真实试点。T-12 / AC-008-1 / AC-008-3 仍须用户另行显式选定并授权文件。
