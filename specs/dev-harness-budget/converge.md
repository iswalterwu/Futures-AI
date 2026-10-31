# Feature: dev-harness-budget v1 Converge 报告 R1（converge.md）

> Converge 阶段产物（[workflow.md 第 9 步](../../docs/development/workflow.md#step-9)）：逐项对比代码库与冻结 spec、plan、tasks。
> 本报告**不是**独立 Review，**不是** Gate 2，也**不是** AC 验收。27 条 spec AC 仍全部未勾选。

- **Converge R1 = `claude-opus-5-5 via claude-bridge`**，即计划 / 分析类阶段的首选模型和首选通道。协调者在派工前对 bridge 做过一次最小真实调用，成功（协调者陈述）。本会话没有换模型，没有改 provider / 路由 / key / 全局配置。这是新开会话，未写过本 feature 的代码；实施者是 `openai/gpt-6-astra`。
- **固定提交**：`b8175f473aaa46cde9c4eb71358daada5bbd6210`（`D:/2030/Futures-AI`，分支 `workbench`），开始时工作区干净。
- **本会话写入**：只有两处——新建本文件；在 tasks.md 任务列表末尾（T-12 之后、AC 覆盖表之前）追加 T-13。没有改动任何既有任务、spec / plan / checklist* / analyze* / review / HANDOFF / 索引 / 代码，没有 Git 写操作，没有联网、安装或派工。没有读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。合成冒烟只在内存中进行，不写任何文件。
- **日期**：2026-10-31。

输入清单：

```
AGENTS.md @ b8175f4（blob ee8e4ab）全文
docs/development/workflow.md @ b8175f4（blob 4aca344）全文（重点：第 8～11 步、Gate 1 / Gate 2）
docs/development/model-routing.md @ b8175f4（blob f980f5c）全文
backend/README.md @ b8175f4（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ b8175f4（blob 4689093）全文；锚定 ^## 1. 至文末、LF 归一化后 SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致）
specs/dev-harness-budget/plan.md @ b8175f4（blob 9c1c8bc，r4）全文
specs/dev-harness-budget/tasks.md @ b8175f4（blob 721db0b）全文
specs/dev-harness-budget/checklist.md @ b8175f4（blob 04fe4b1，Checklist R3，23/23）全文
specs/dev-harness-budget/analyze-r2.md @ b8175f4（blob b96ddab）全文
specs/dev-harness-budget/review.md @ b8175f4（blob e225a26）“Analyze R2”至文末（含 Implement 全节）
真实 diff：git diff 7bd2e5b..HEAD（6 个文件：backend/README.md +1、3 个新文件、tasks.md 状态行与 P3-R3-1、review.md）
backend/tools/dev_harness_budget.py @ b8175f4（blob dd1653f）全文 1731 行
backend/tests/test_dev_harness_budget.py @ b8175f4（blob 028289f）全文 1723 行
backend/tests/dev_harness_budget_fixtures.py @ b8175f4（blob ee1318c）全文 416 行
pi 1.4.0 公开安装包（非本仓库，只读）：pi-coding-agent docs/json.md（sha256 f1031918…3543）全文；dist/modes/json-event.js（5f375647…d606）全文；
  pi-agent-core dist/agent-loop.js 只复算哈希（22ee81f9…1129）
```

## 结论

**未收敛**。T-01～T-11 的文件范围、任务完成标准与 plan 基本一致：47 条任务验证命令全部通过，范围核对全部符合。但有 **1 个真实差距**：选定来源存在缺口时，tokens / tool_calls 的覆盖行给出了“已知”的分母和百分比（见下节）。为此在 tasks.md 追加了 **T-13**。T-13 实施完成后，须对新的固定提交重跑 Converge。

AC-008-1 / AC-008-3 依赖 T-12 真实试点。试点仍外部阻塞，需等用户选定并授权具体文件，因此记为“待试点”，不算代码差距。

## 差距：选定来源有缺口时，覆盖分母被当成已知（→ T-13）

- **协调者观察的独立复核**：在内存中构造清单：S1 为已加载的 session-v3，含 1 条已知主尝试；S2 指向一个不存在的路径，经真实 `read_source` 得到 `unavailable` / `source_missing`。`build_report` + `render_summary` 的实际结果：
  - tokens 度量 = `partial`、分母 1、已覆盖 1、`missing` 0、`coverage_percent` 100.0，原因 `source_missing`；
  - 摘要行 `| tokens | partial | 用量归属记录 | 选定且已确认去重的快照记录 | 1 | 1 | 0 | 100% | source_missing |`；
  - 把 S2 换成坏行 / 截断（`partial`）来源，结果同样是“分母 2、缺失 0、100%”；
  - tool_calls 用同一口径（分母 = 已加载来源中观测到的 direct 调用数）：只要 S1 含工具调用，也会出现 100%。
- **为什么判为差距**：
  - spec AC-007-1 要求：“每项度量在声明的选定来源总体内的已覆盖 / 未覆盖 / 缺失计数 …… 百分比只在分母已知时给出，否则标为未知”。S2 属于选定来源总体，但它的用量归属记录数不可知（缺失文件没有快照，截断文件可能有被隐藏的记录），所以该总体的记录分母实际**未知**。报告却给出“缺失 0、覆盖率 100%”。
  - Plan §3.3 规定分母“均限于选定且已确认去重的总体”。§3.4 把“已确认去重总体”定义为“未落入任何未确认分区的来源 / 记录”，缺失来源并没有被排除在外。§4.3 第 1 条明确：“缺失或截断的来源不产生记录，对空集说‘全部 known’是空真”。
  - 现有实现只把已加载来源中观测到的记录当作分母，相当于对已观测子集给出 100%，正是上述空真口径。
- **测试为何没有发现**：`test_summary_contents_units_denominators` 的 missing 用例只有一个来源（分母 0，百分比本来就是未知）。D1 和 complete_tokens 用例全部 loaded。所有测试都没有覆盖“有效来源 + 缺口来源”组合下的覆盖行。
- **不受影响的部分**：rework / timing 以“来源”为单位，分母取选定来源数，在 S2 缺失时仍正确（timing 显示分母 2、已覆盖 0）。main_attempts / retries 的分母取自 run_total / total，未知时已经不给百分比。tokens 的完整总计、状态 partial、原因列表本身都正确，问题只在覆盖行。
- **处置**：追加 T-13（引用 AC-007-1，验证命令一一对应）。修复只让实现符合现有 Plan 规则，不改 Plan、不新增需求，也不需要回 Clarify。

## 任务表

| 任务 | 状态 | 证据（本会话） |
|---|---|---|
| T-01 骨架与清单校验 | 已收敛 | 3 个文件分节结构与 §2 的 dataclass 齐备；`load_manifest` 覆盖三类标签正则、路径形值拒绝、`unknown_field`、并集图 DFS（缺目标 / 自环 / 环 / 同源双声明）；命令 1 → 19 passed |
| T-02 读取框架与 session-v3 | 已收敛 | 用 `rb` 读取，按 `b"\n"` 切分并去掉 `\r`（U+2028 不拆行，有测试断言）；四类 unavailable 原因、`empty`、`truncated`；`normalize_usage` 实现 r3 对账规则；命令 1～3 → 14 / 1 / 17 passed |
| T-03 json-events、收尾判据、重试标记 | 已收敛 | toolResult 只在 `message_end` 处理，`message_start` 忽略（与 1.4.0 双事件一致）；`message_update` 读取顶层 `usage`（与 json-event.js `toJsonEvent` 一致）；`entry_appended` 白名单抽取；4 种非运行类记录与末个 settled 判据；命令 1～3 → 7 / 12 / 22 passed |
| T-04 token 聚合、完整总计、峰值 | 已收敛（覆盖行问题归 T-13） | 完整总计三条件、`empty` 不填 0、峰值标签与注明、F13 a～c 的 210 / 212 / 170 + unknown；命令 1～7 → 1 / 3 / 6 / 1 / 4 / 2 / 4 passed |
| T-05 来源关系去重 | 已收敛 | 两种单层星形、其余形状 → `relation_shape_unsupported`；`duplicate_of` 的 v3 键集核验；血缘净新增；同会话双采集；命令 1～4 → 3 / 2 / 8 / 3 passed |
| T-06 嵌套覆盖 | 已收敛 | 多来源须 flag 才计；(P, T) 分组，(a)～(d) 逐维核对，第 4 层先于第 6 层；命令 1～3 → 13 / 3 / 5 passed |
| T-07 尝试 / 工具 / 重试 / 返工 / 未观测 | 已收敛 | 五态尝试；操作记录 request_count unknown；工具三视图不相加；括号规则与源码顺序一致；`total` 恒 unknown；命令 1～6 → 8 / 9 / 8 / 12 / 5 / 6 passed |
| T-08 时间与执行结果 | 已收敛 | 时间只用标注；`observed_until` 作下界；无偏移的时间不可比；时间独立于 token 分区；结局冲突 → unknown；命令 1～4 → 9 / 7 / 4 / 13 passed |
| T-09 维度、守恒、六项矩阵、D1 | 已收敛 | 维度带 origin、记录冲突；各维独立守恒；D1 只在 `build_report` 边界注入；命令 1～4 → 2 / 2 / 4 / 8 passed |
| T-10 摘要、CLI、写出、比较 | 未收敛（→ T-13） | 退出码、固定 stdout / stderr、`open("x")`（测试断言 O_EXCL）、只清理本次文件、可比性与无金额均符合；但摘要覆盖行在来源缺口下给出“已知”的分母和百分比，不满足完成标准 1 中 AC-007-1 的“分母未知不出百分比”；命令 1～5 → 5 / 12 / 3 / 4 / 15 passed（现有测试没有覆盖该组合） |
| T-11 离线 / 隐私 / 仓库状态 + README | 已收敛 | 命令 1～7 → 1 / 2 / 3 / 7 / 6 / 1 / 1 passed；命令 8 → 307 passed；命令 9 → 760 / 1 / 5（见下）；命令 10 符合；README 工具表恰好一行；P3-R3-1 已按 A 的建议修正 |
| T-12 真实试点 | BLOCKED（外部） | 用户未选定、未授权文件；本会话未运行、未读取任何真实数据 |
| T-13 覆盖分母（本轮追加） | 未开始 | 见上节；须 Implement 后重跑 Converge |

## AC 表（27 条）

“已收敛”只表示代码与测试和规格对上了，不是验收；验收由独立 Review 与 Gate 2 决定。

| AC | 实现位置（`dev_harness_budget.py`） | 测试 | 状态 |
|---|---|---|---|
| AC-001-1 | `load_manifest` / `read_source`（只打开清单列出的路径，不跟随 `parentSession`） | `test_only_selected_sources_opened`（审计到的 open 集合恰好等于清单 + 选定来源 + 3 个产物） | 已收敛 |
| AC-001-2 | `read_source`（不使用时间戳语义） | `test_historical_records_same_semantics` | 已收敛 |
| AC-001-3 | 全模块只用标准库，无网络 / 进程代码 | `test_zero_model_and_network_attempts`（清空凭证环境变量；审计钩子先计数再拒绝 socket / 进程事件；计数为 0、退出 0、产物完整） | 已收敛 |
| AC-001-4 | `read_source` 原因类别、收尾判据、`_source_gaps`、`main`、`_write_artifacts` | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work`（哈希 / 业务状态 / 控制动作三项分别观测） | 已收敛 |
| AC-002-1 | `_dimension_values` / `_groups`（`(未知)` 独立成组） | `test_missing_dimensions_unknown_group` | 已收敛 |
| AC-002-2 | `_dimension_values`（origin、`annotation_conflict`） | `test_annotation_origin_and_sources_untouched` | 已收敛 |
| AC-002-3 | `_groups`（按维度守恒，只用已确认记录） | `test_group_conservation_per_dimension` | 已收敛 |
| AC-003-1 | `normalize_usage` / `_aggregate_tokens` | `test_exclusive_dimensions_total_170` | 已收敛 |
| AC-003-2 | `normalize_usage`（子集、`totalTokens` 对账） | `test_subset_fields_and_unreconciled` | 已收敛 |
| AC-003-3 | `_aggregate_tokens` 中的 peak、`render_summary` | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` | 已收敛 |
| AC-003-4 | `_usage_value`（默认 0 → unknown）、`confirmed_zero`、`_appended_entry`、`_aggregate_tokens` | `test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-004-1 | `_read_pi_json_events`（最终值只取 `message_end`；非最终只作下界；`_nonmonotonic`） | `test_cumulative_snapshots_final_12`、`test_nonfinal_partial_lower_bound_10` | 已收敛 |
| AC-004-2 | 归属者规则（`turn_end` / `agent_end` 不计，toolResult 只取 `message_end`，不读 `tool_execution_end.result.usage`） | `test_repeated_message_counted_once`（含 `tool_result_pair` 与 999 哨兵） | 已收敛 |
| AC-004-3 | `_validate_relations`、`_partition_sources`、`_lineage_partition`、`_nested_partition` | `test_relation_graph_rejected`、`test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`、`test_relation_shapes_unsupported_retain_facts`、`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage` | 已收敛 |
| AC-005-1 | `_tool_event` / `_event_tool_result` / `_tool_counts` | `test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views` | 已收敛 |
| AC-005-2 | `_retry_brackets` | `test_retry_requires_explicit_association`（12 种情形，`total` 恒 unknown） | 已收敛 |
| AC-005-3 | `_count_metrics` 中的 `model_operations`、`_unobserved_paths`、`_nested_failure` | `test_covered_and_unobserved_paths`、`test_attempt_states_and_operation_records`、`test_nested_link_negative_cases`、`test_entry_appended_usage_records_counted` | 已收敛 |
| AC-005-4 | `_rework`（只取标注） | `test_semantic_rework_annotation_only` | 已收敛 |
| AC-006-1 | `_source_timing` / `_aggregate_timing` | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source` | 已收敛 |
| AC-006-2 | `_source_timing` / `_outcome` | `test_timeout_known_duration_usage_unknown` | 已收敛 |
| AC-007-1 | `_observation` / `render_summary` | `test_summary_contents_units_denominators`、`test_all_known_aggregation_normalized_facts`；但没有测试覆盖“有效来源 + 缺口来源”下的覆盖行 | **差距**（→ T-13） |
| AC-007-2 | 白名单抽取、`_hash_ref`、标签正则、固定错误类别 | `test_privacy_sentinels_absent`、`test_path_shaped_labels_rejected_not_echoed` | 已收敛 |
| AC-007-3 | `_out_dir`（在仓库内 → 退出 2） | `test_repo_state_unchanged`（`git init` 沙箱 + 本仓库 `git status --porcelain=v1 --untracked-files=all` 前后一致） | 已收敛 |
| AC-007-4 | `_load_comparison`（只投影元数据）、`_comparability` | `test_comparability_flags_no_money` | 已收敛 |
| AC-008-1 | 试点（非代码） | T-12 手动步骤 1 | 待试点（外部阻塞） |
| AC-008-2 | 夹具模块 F1 / F2 / F3 与 D1 | `test_synthetic_categories_covered` | 已收敛 |
| AC-008-3 | 试点流程 | T-12 手动步骤 2 | 待试点（外部阻塞） |

计数：已收敛 24、差距 1（AC-007-1）、待试点 2。

## plan 符合性抽查（测试可能漏掉的部分）

- **pi 1.4.0 事件形状**：`json-event.js` 的 `toJsonEvent` 只改写 `message_update`，改写后为 `{type, usage: message.usage, assistantMessageEvent}`；夹具的 `message_update` 使用顶层 `usage`，一致。toolResult 在夹具中是 `message_start` + `message_end` 成对出现，实现只在 `message_end` 计数，一致。`compaction_end` 失败或中止时没有 `result`，实现记为 interrupted、用量未知，与 json.md 一致。助手 `message_start` 的 `stopReason: "pending"` 被视为非最终，一致。`tool_execution_end.result` 中的 usage（夹具值 999）不被读取。
- **白名单投影**：summary、details、systemMessage、customType、data、content、note 都不进入任何类型；compaction / branch_summary 只取 `usage`；`entry_unrecognized` 不读取数值。toolCallId 与 entry id 只以 `sha256[:16]` 作内部引用；`parent_link` 不输出；records.json 只含类型化字段。
- **写出**：`open(path, "x")` 按 report.json →（records.json）→ summary.md 的顺序独占创建；失败时只删除本次创建的文件，清理失败给出 `partial_artifacts_left=<n>`。out-dir 必须已存在，且不在 `Path(__file__).resolve().parents[2]` 之内。
- **退出码与错误类别**：0 / 3 / 2 / 1 与 plan §2 一致；argparse 错误转为 `invalid_arguments`；stderr 只输出固定类别，不含路径。
- **离线**：生产模块只 import 标准库；审计钩子只在测试辅助模块。
- **测试纪律**：期望值都写成字面量（170 / 150 / 12 / 10 / 210 / 212 / 197 等），通过公开接口调用真实实现。替身只在声明过的边界使用：文件系统写失败时 monkeypatch `Path.open` / `unlink`；D1 在 `build_report` 边界注入。
- **工程准则（AGENTS §5）**：没有新依赖或新工具；入口校验集中在 `load_manifest` / `_read_*`；`main` 只写正常流程。未发现投机性复杂度。

## 非阻塞观察（不是差距，供 Review 参考；未追加任务）

1. `dev_harness_budget.py` 第 8～10 行注释记录了实施批次、模型和输入提交（`Implement batch 4 … 输入 @ 9db3c33 …`）。review.md 记载，第 2 批已按仓库惯例把文件头清理为只写用途与用法，第 4 批又重新加入了这段过程信息，且内容已过时。这不是 spec / plan / tasks 的要求，也不涉及隐私；是否清理由 Review / 协调者决定。
2. `_groups` 在生产代码中用 `assert conserved`。按构造，等式恒成立；但在 `python -O` 下这条断言会被移除。Plan §4.3 写的是“断言”，测试也独立核对了加和，不影响结论。

## 本会话实际运行的命令与结果

均在 `backend/` 下执行（命令 10 在仓库根执行）：

- tasks.md 中 T-01～T-11 的 47 条 `-k` 验证命令：先在一次循环中逐条运行（附加了 `-p no:cacheprovider`），再从 tasks.md 原文提取命令，**按原样**逐条运行；两次全部通过。各条计数见任务表。提取时还匹配到“通用约定”中的模板行 `-k "<表达式>"`，它不是任务命令，运行结果为 no tests ran，已忽略。`.pytest_cache` / `__pycache__` 已被 `.gitignore` 忽略。
- T-11 命令 8 `python -m pytest tests/test_dev_harness_budget.py -q` → **307 passed**（5.80 s）。
- T-11 命令 9 `python -m pytest tests/ -q` → **760 passed / 1 failed / 5 skipped**（175 s）。唯一失败是 `tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（netstat 非空监听断言），即既有基线。基线 453 + 本模块 307 = 760，没有新增失败。与 review.md 中协调者的记录一致。
- T-11 命令 10：`git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出（退出 1）；`git diff --exit-code -- backend/pyproject.toml .gitignore` 退出 0，`7bd2e5b..HEAD` 区间内这两个文件也没有变化；`git status --porcelain=v1 --untracked-files=all` 为空。`git diff --name-only 7bd2e5b..HEAD` 只有 3 个新文件、README、tasks.md、review.md；`git diff --check` 退出 0。
- 冻结 spec 正文 SHA256 复算：`a504fed8…e823`，与冻结值一致。
- 内存合成冒烟（`python -B`，不写文件；S2 指向 Temp 下不存在的目录，只做一次失败的 open）：结果见“差距”一节。

## 追加的任务

- **T-13 覆盖分母：选定来源有缺口时，记录类度量的分母与百分比为未知**（tasks.md 中 T-12 之后）。完成标准 1 引用 AC-007-1，验证命令 `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_coverage_denominator_unknown_with_source_gaps"`；完成标准 2、3 为模块与全量回归（非 AC）。已核对新测试名与现有测试名之间不存在子串碰撞。
- 未修改 tasks.md 的 AC 覆盖表（它不在本轮允许写入的范围内）。AC-007-1 行是否补列 T-13，由协调者在实施提交时处理。

## 下一步与边界

- 按 model-routing 派 Implement 实施 T-13（首选 `openai/gpt-6-astra`，派工前先探活），然后对新的固定提交重跑 Converge（R2），直到报告“已收敛”，之后才进入独立 A Review。
- 本报告不是独立 Review，不是 Gate 2，不是 AC 验收，也不授权真实试点。T-12 / AC-008-1 / AC-008-3 仍须用户另行显式选定并授权文件。
