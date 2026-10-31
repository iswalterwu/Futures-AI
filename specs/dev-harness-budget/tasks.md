# Feature: dev-harness-budget v1 任务清单（tasks.md）

> Tasks 阶段产物：每个任务 0.5–2 小时可完成，按依赖顺序执行（Implement 阶段）。
> 执行前置条件：有效 checklist.md 全部勾选。**r5 现状（2026-10-31）**：T-01～T-11、T-13～T-15 已实施（状态行见各任务），[Review R1](code-review-r1.md) 未通过（1 P2 / 3 P3）。新增 T-16～T-20 按 Plan r5 承接 R1 四项发现，**全部未开始**。当前有效 [Checklist R3](checklist.md)（23/23）只覆盖 Plan r4，**不覆盖 r5 改动的规则**：须先对包含本修订的新固定提交做 Analyze R3，再由独立 A 做 Checklist R4 且全部勾选，T-16 才能开始。
> 下文“未执行 / 未来”等措辞对 T-01～T-11 是成稿时的历史状态；T-16～T-20 的路径、函数、测试名与命令都是**未来**实施对象，本阶段未写代码、未运行测试，任何 AC 均未通过。

- **Tasks 作者**：`claude-opus-5-5 via anthropic`（计划类阶段首选模型；同一协调 PI 会话已确认 `claude-bridge` 当窗耗尽、无重置证据，按 [model-routing.md](../../docs/development/model-routing.md) 规则 2 / 5 不重试，改走官方通道；官方最小真实探活成功，为协调者陈述。换通道不是换模型）。协调者 = `openai/gpt-6.1-sol`（只做确定性集成）。
- **基线**：`dc5932d3553aa4880ed35fd98d20ec0791043943`（`D:/2030/Futures-AI`，分支 `workbench`，开始时工作区干净）。同阶段作者把 plan.md 修订为 r3（5 项 P3，待独立 A 复核）。
- **正式调用与接续**：作者调用在保存 Plan r3 与本文件后遇服务错误（672.93 秒，未超时；进程退出 0，但末次 assistant `stopReason=error`，不当作成功完成）。按真实调用失败回退，由 `openai/gpt-6.1-sol via openai` 仅接续保存与状态记账；未因设计质量或审查结果换模型。两件有效稿仍须独立 Analyze 与 A 审查，未实施、未测试。
- **r4 修订（按 Analyze R1，2026-10-30）**：作者 `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前最小真实调用成功），基线 `64e20e8489fbe18f81536bce4aac3a888891bba6`。只承接 Plan r4：P2-AN-1 → T-03 / T-04 / T-07 / T-11 与 AC 覆盖表；P3-AN-1 → T-11 验证命令 / 完成标准 10。上文头部“bridge 已确认耗尽”是旧记录，以 [review.md](review.md)“claude-bridge 路由更正与 Analyze R1”节为准。全部任务仍未开始；Checklist R2 仍 21/23；Analyze R1 未通过、待重跑；本修订不关闭任何发现。
- **r5 修订（按 Review R1，2026-10-31）**：作者 `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前最小真实调用成功，为协调者陈述），基线 `70291e3d13867fb7390202d964474b0d303cd081`。用户处置“全修，T-12同批完成，授权脱敏”。只承接 Plan r5：P2-CR-1 → T-16（读取与身份）、T-17（视图、去重与判定）；P3-CR-1 → T-18；P3-CR-2 → T-19；P3-CR-3 → T-20；T-12 由外部阻塞改为已授权、排在修复任务之后；AC 覆盖表相应行与“Review R1 发现的承接”表。T-01～T-15 的完成标准与验证命令未改。新任务全部未开始；Checklist R3 不覆盖 r5 规则（独立 A Checklist R4 待做）；Analyze R3 待做；本修订不关闭任何发现。
- **r6 补正（按 [Analyze R3](analyze-r3.md)，2026-10-31）**：作者 `claude-opus-5-5 via claude-bridge`，基线 `81c61761a8c45535b779d8686489ba9b74fd33c8`；只改 T-12 修改范围（P3-AN-R3-1）、T-19 修改范围 / 完成标准 2 / 验证命令 2（P3-AN-R3-2）、T-16 完成标准 1（P3-AN-R3-3），其余任务与 AC 覆盖表不变；未实施，是否关闭由 Analyze R4 判定。
- **r7 措辞补正（按 [Analyze R4](analyze-r4.md)，2026-10-31）**：作者 `claude-opus-5-5 via claude-bridge`，基线 `d4781fc61f6f7cd2d506ed100774d134d2c24e54`；只改 T-16 依赖（P3-AN-R4-1）与 T-12 状态行 / 完成标准 2 / 验证命令的 feature 名与执行顺序（P3-AN-R4-2），完成标准含义与一一对应不变。当前下一步为对新固定提交做 Analyze R5 → 独立 A Checklist R4（全部勾选后才可开始 T-16）；上文“r5 现状”、“Review R1 发现的承接”表标题与“阶段边界”第一条中的 Analyze R3 是 r5 时的历史文字。未实施，是否关闭由 Analyze R5 判定。
- **r8 追加（按 [Review R2](code-review-r2.md) P3 与 Checklist R4 P3-R4-1，2026-10-31）**：作者 `claude-opus-5-5 via claude-bridge`（协调者派工前最小真实调用成功，为协调者陈述），基线 `39fa979f8932603853df2fdf7d8580624a639efb`；用户处置“3项P3现在就修”。P3-CR2-1 / P3-CR2-2 → 新增 T-21（未开始），AC 覆盖表 AC-004-3 / AC-005-1 / AC-007-1 行加入其测试；P3-R4-1 → 下方输入清单补 r6 / r7 行（plan.md 同步）。T-01～T-20 不变；未实施，是否关闭由 Converge R6 与独立 A Review R3 判定。
- **未来实施路由**（本阶段未派工）：Implement 首选 `openai/gpt-6-astra`，按 model-routing 表回退；审核员 A 须新开会话、与实施模型不同。

输入清单：

```
AGENTS.md（ee8e4ab）、docs/development/model-routing.md（f980f5c）全文；docs/development/workflow.md（4aca344）总规则、Gate、第 6～8 步 @ dc5932d
templates/tasks.md（4b7f955）全文
specs/dev-harness-budget/spec.md（blob 4689093）全文；锚定 ^## 1\. 至文末 LF SHA256 a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823
specs/dev-harness-budget/plan.md r3（本阶段修订后全文；r2 blob d756f4b）；checklist.md R2（blob 40b0b87，SHA256 1a667287…）全文
specs/dev-harness-budget/review.md（cb44cf5）头部与 R2 节；HANDOFF.md（e39255f）、specs/README.md（8fa342c）全文；backend/README.md（5d6fa8f）工具表相关行
r4 @ 64e20e8：AGENTS.md（ee8e4ab）、model-routing.md（f980f5c）、templates/tasks.md（4b7f955）全文；workflow.md（4aca344）总规则、第 4 / 6 / 7 / 8 步、Gate
    spec.md（4689093）全文，锚定正文 SHA256 仍为 a504fed8…e823；plan.md（9afc846，r3；本阶段改为 r4）、tasks.md（9e8c9a4）、analyze.md（2caea51）、checklist.md R2（40b0b87）全文；
    review.md（4686eb8）头部与最后两节；pi 1.4.0 公开安装包源码核实见 plan.md §7 r4
r5 @ 70291e3：AGENTS.md（ee8e4ab）、model-routing.md（f980f5c）、templates/tasks.md（4b7f955）全文；workflow.md（4aca344）总规则、第 4 / 6 / 7 / 8 步、Gate
    spec.md（4689093）全文，锚定正文 SHA256 仍为 a504fed8…e823；plan.md（9c1c8bc，r4；本阶段改为 r5）、本文件（a474f2b）、code-review-r1.md（2272b21）、checklist.md R3（04fe4b1）、converge-r4.md（38b87a3）全文；
    review.md（1f79d39）头部、“Review R1”与“用户对 Review R1 的处置与试点授权”两节；backend/tools/dev_harness_budget.py（3d81548）相关函数与夹具 / 测试检索（见 plan.md 输入清单 r5）；
    pi 1.4.0 公开安装包源码核实见 plan.md §7 r5
r6 @ 81c6176：AGENTS.md（ee8e4ab）全文；workflow.md（4aca344）总规则、第 4 / 6 / 7 步；spec.md（4689093）全文，锚定正文 SHA256 a504fed8…e823；
    analyze-r3.md（e7fbc98）全文；plan.md（11a074e，r5）全文；本文件（9d20409）T-12、T-16～T-20、AC 覆盖表；review.md（b908e20）“用户对 Review R1 的处置与试点授权”“Analyze R3”两节；
    test_dev_harness_budget.py（3f9025a）530–700 行、dev_harness_budget_fixtures.py（ee1318c）`f5_sources` / `f8_sources`、dev_harness_budget.py（3d81548）`_lineage_partition` 与 `sources[]` 构造（只读）
r7 @ d4781fc：analyze-r4.md（0fb9a28）全文（P3-AN-R4-1～2）；本文件（941b9a6）T-12、T-16；plan.md（933c443，r6）头部、§5 AC-008-3 行、§7；review.md（1294cf5）“Analyze R4”节；
    AGENTS.md（ee8e4ab）、workflow.md（4aca344）、spec.md（4689093）在该提交未变
（r6 / r7 两行于 r8 按 Checklist R4 P3-R4-1 补记：blob 取自 Git 历史，章节取自 review.md“Plan r6 / Tasks 补正”“Tasks 补正 r7”两节所记的依据与修订位置。）
r8 @ 39fa979：AGENTS.md（ee8e4ab）全文；workflow.md（4aca344）第 6、8、9、10 步；templates/tasks.md（4b7f955）全文；spec.md（4689093），锚定正文 SHA256 a504fed8…e823（本会话实算）；
    code-review-r2.md（775dfdd）全文；checklist.md（3e7a7d6，R4）P3-R4-1；本文件（72db104）全文；plan.md（175fc2e，r7）头部与输入清单、§3.3、§4.3、§5；
    review.md（4109928）“Plan r6 / Tasks 补正”至文末；dev_harness_budget.py（e6b43e0）`build_report`、`_tool_counts`、`_partition_sources`、`_nested_partition`、`render_summary` 未确认来源行（只读）；
    test_dev_harness_budget.py（a6ab411）测试名与 `nested_events_not_persisted` / `unconfirmed_record_count` 断言检索、dev_harness_budget_fixtures.py（0d11992）`f5_sources` / `f8_sources`（只读）
```

## 通用约定（适用于所有任务）

- **文件范围仅限**：`backend/tools/dev_harness_budget.py`、`backend/tests/test_dev_harness_budget.py`、`backend/tests/dev_harness_budget_fixtures.py`（均新建）+ T-11 中 `backend/README.md` 工具表一行。不 import `app` / `data` / `settings`，不改 `pyproject.toml`、`.gitignore`、打包脚本、AGENTS / workflow / model-routing；需要改其中任一项即**停止**回报（Plan §1）。
- **测试纪律**（AGENTS §5.6）：期望值以字面量写出，测试不复写聚合 / 去重 / 重试算法；只经 Plan §2 公开接口（`main`、`load_manifest`、`read_source`、`normalize_usage`、`build_report`、`render_summary`）调用真实实现；系统边界注入只限 Plan 声明处（`build_report` 的类型化 `SourceFacts`、文件系统写失败、审计钩子）。不提交 JSONL 数据文件，夹具在 `tmp_path` 写出，只含合成文本。
- **三层数据不混称**：F1～F14（F14 为 r5 新增）= 原生合成文件，经 `read_source` 读取（F1 只是 **token 度量** complete）；D1 = 归一化域样例，在 `build_report` 边界注入类型化事实，**不代表**任何原生读取器能产出；真实试点 = T-12（用户已于 2026-10-31 授权，修复任务完成后由协调者执行）。原生输入下 retries total 恒 unknown，因此 overall 恒 incomplete；退出 0 只表示产物写出且来源采集无缺口，不是整次观测完整，也不是验收（Plan §4.7）。
- **命令格式**：均在仓库根执行 `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "<表达式>"`；`-k` 表达式只用 Plan §5 中的测试名（含 r3 新增的 `test_stream_settled_tail_rule`、`test_lineage_net_new_before_nested_coverage` 、r4 新增的 `test_entry_appended_usage_records_counted`，以及 Converge 追加与 r5 新增、已登记在 Plan §5 的测试名），以 `or` 连接。不引入新工具或依赖。
- **完成标准与验证命令一一对应**：每个任务的完成标准各列一条，与同编号的验证命令对应；“部分满足”指该 AC 的其余断言由表中所列其他任务承担。

## 任务

### T-01 骨架、类型与清单入口校验

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：无
- **估时**：1.5–2h
- **上下文**：建立唯一的清单校验边界与类型化事实（Plan §1、§2、§3.1、§3.4 第 0 层）；后续任务都基于这些类型。
- **修改范围**：
  - `dev_harness_budget.py`：分节结构（入口校验 → 类型化事实 → 聚合 → 输出）；§2 的冻结 dataclass（`Manifest`、`SourceSpec`、`TimingAnnotation`、`ZeroRule`、`Link`、`Value`、`TokenCounts`、`UsageRecord`、`AttemptRecord`、`ToolCallRecord`、`RetryFacts`、`SourceFacts`）；`InputError(category, field_path)`；`load_manifest`：schema 与枚举、三类标签正则与路径形值拒绝、`unknown_field`、`baseline_commit` 7～40 hex、`duplicate_of` ∪ `nested_of` 并集图校验（缺目标、自环、任意环、同源双声明）。
  - `dev_harness_budget_fixtures.py`：清单 / JSONL（LF 分行）写出辅助；审计钩子一次注册 + active 标记（Plan §5，钩子不进生产模块）；F11 非法关系图清单。
  - `test_dev_harness_budget.py`：`test_relation_graph_rejected`。
- **完成标准**：
  1. 部分满足 AC-004-3：F11 六类非法图均为 `manifest_invalid` + 字段路径，不回显用户键名或取值。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_relation_graph_rejected"`

### T-02 读取框架、usage 归一与 session-v3 适配

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-01
- **估时**：2h
- **上下文**：只读打开选定文件、只抽取白名单字段（Plan §3.2 session 列、§3.3、§4.2 前半）。
- **修改范围**：
  - `read_source` 框架：`"rb"` + `b"\n"` 切分去 `\r`；坏行 / `truncated` → `partial`；`source_missing` / `source_unreadable` / `unsupported_format` / `unsupported_version` → `unavailable`；无用量归属记录 → `empty`；`content_sha256`、`session_ref`；provider / model / kind 校验失败 → `(无效标签)` + `invalid_label`。
  - `normalize_usage`：完成度、每维 known / partial / unknown、`confirmed_zero`、r3 对账规则（缺 `totalTokens` 不对账；无效 / 不符 → unreconciled；子集超父）。
  - `_read_pi_session_v3`：全文件全部 assistant 条目、compaction / branch_summary / 任意 kind 的 usage 条目 / 带 usage 的 toolResult、toolCall 块（type + id）、toolResult 身份与 owner（沿 `parentId`）、nestedCalls、header `parentSession`、`(type, id, timestamp)` 键集、`duplicate_entry_id`。
  - 夹具：F1、F1 旧时间戳副本、F6 文件类（v2 / 缺失 / 目录 / 坏 JSON / 只有 header）、F7（含 r3 缺 `totalTokens` 正例与无效 / 不符负例）。
  - 测试：`test_observation_failures_marked`、`test_historical_records_same_semantics`、`test_subset_fields_and_unreconciled`。
- **完成标准**：
  1. 部分满足 AC-001-4：F6 文件类来源各标对应原因类别与状态，不填 0。
  2. 满足 AC-001-2：历史副本与新记录同口径产出相同度量，审计无进程 / 网络事件。
  3. 满足 AC-003-2：子集只作子集；缺 `totalTokens` 不标 unreconciled；无效 / 不符 / 子集超父 → unreconciled；缺维度字段为 unknown（P3-R2-5 (i) 的作者修订规则，待 A）。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_observation_failures_marked"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_historical_records_same_semantics"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_subset_fields_and_unreconciled"`

### T-03 json-events 适配、收尾判据与重试标记抽取

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-02
- **估时**：2h
- **上下文**：Plan §3.2 json 列、§4.2 r3 收尾判据、§4.4 源码核实的事件顺序。
- **修改范围**：
  - `_read_pi_json_events`：header；assistant `message_start` / `message_end` 配对（completed / failed / aborted / inflight / terminal_only）；`message_update.usage` 只留最后快照并检查单调；最终值只取 `message_end`，`turn_end` / `agent_end` 不计；`tool_execution_*` 的 owner 序号身份与状态；toolResult `message_end` 的 usage 与 nestedCalls；`compaction_end`（成功 / 失败 / 中止）；`auto_retry_*`、`summarization_retry_*`、`agent_settled.aborted` 抽取为有序标记；`entry_appended.entry` 按 Plan r4 §4.2 白名单抽取（任意位置）：只取 type / id，`usage` 再取 kind / provider / model / usage 数值，`compaction` 再取 usage 数值，按 entry id 去重（重复记 `duplicate_entry_id`）；其他类型只检测顶层 `usage` 键→ `entry_unrecognized`；不读 summary / details / systemMessage / customType / data / content / note。
  - §4.2 收尾判据：末个 `agent_settled` 之后只允许 4 种非运行类记录；17 种运行活动类型或未知类型 → `partial` + `stream_not_settled`；不读 mtime / 时间戳。
  - 夹具：F2（§4.4 核实顺序正例 + 三负例）、F3 流部分、F4、F6 收尾正 / 负例、F12 events 部分。
  - 测试：`test_cumulative_snapshots_final_12`、`test_repeated_message_counted_once`、`test_stream_settled_tail_rule`。
- **完成标准**：
  1. 部分满足 AC-004-1：快照 6 / 10 / 12 → 12。
  2. 满足 AC-004-2：同一响应在 `message_end` / `turn_end` / `agent_end` 中只计一次；工具 end 与 toolResult 不重复。
  3. 部分满足 AC-001-4：收尾判据正例 → `loaded`，负例 → `stream_not_settled`（P3-R2-4 的作者修订规则，待 A）；尾随 `entry_appended` 仍不使来源 partial（其用量记录的计入由 T-04 验证）。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_cumulative_snapshots_final_12"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_repeated_message_counted_once"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_stream_settled_tail_rule"`

### T-04 token 聚合核心、完整总计与峰值

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-03
- **估时**：2h
- **上下文**：`build_report` 的 token 部分（Plan §3.3、§4.3、§3.6 `tokens` / `population` / `acquisition`）；本任务只处理单来源与 `disjoint`，关系分区在 T-05 / T-06 接入。
- **修改范围**：`build_report` 骨架；每维累加 known、单列 partial / unknown / invalid；组合已知小计；§4.3 完整总计三条件与原因列表；`empty` → “观测到的归属记录 0 条” + token 消耗 unknown；类别分解；峰值（r3 固定标签“主 assistant 尝试内的来源上报输入峰值”、操作记录不参与的注明、下界标记）；r4：`entry_appended` 抽取的 usage 条目 / compaction 作为操作记录计入已知小计与完整总计，`entry_unrecognized` 使完整总计 unknown（`entry_appended_usage_unrecognized`）。夹具 F13（Plan §5，a～d）。测试：`test_exclusive_dimensions_total_170`、`test_source_reported_input_peak_150`、`test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_nonfinal_partial_lower_bound_10`、`test_entry_appended_usage_records_counted`。
- **完成标准**：
  1. 满足 AC-003-1：F1 总计 170，非 175。
  2. 部分满足 AC-003-3：峰值 150 + r3 标签与注明，无“计费”字样（P3-R2-2，待 A）；摘要部分见 T-10。
  3. 满足 AC-003-4（零值部分）：默认 0 → unknown，规则匹配 → known 0（annotation），“已知小计 50、未知 1、完整总计未知”。
  4. 满足 AC-003-4（空来源部分）：只有 header → `empty`、归属记录 0 条、不显示“总计 0”。
  5. 部分满足 AC-001-4 / AC-003-4：有效 S1 + 缺失 S2 → S1 已知小计 170 保留、完整总计 unknown（`source_missing`）。
  6. 部分满足 AC-004-1：无 `message_end` → 非最终、partial 10、不入已知小计；不单调 → unknown。
  7. 部分满足 AC-003-4 / AC-005-3（r4，P2-AN-1）：F13 (a) settled 后 `cache_warm` → `loaded`、完整总计 210、tokens complete、峰值仍 150；(b) 边界 compaction（同 id 两次）+ 常规 `compaction_end` → compaction 记录 2 条、`duplicate_entry_id` 1、完整总计 212；(c) 带 `usage` 的未知类型 → 已知小计 170、完整总计 unknown（`entry_appended_usage_unrecognized`）、来源仍 `loaded`；二者均为操作记录、request_count unknown、不计主尝试。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_exclusive_dimensions_total_170"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_source_reported_input_peak_150"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_confirmed_zero_vs_placeholder"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_header_only_not_zero"`
  5. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_selected_source_gap_blocks_full_total"`
  6. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_nonfinal_partial_lower_bound_10"`
  7. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_entry_appended_usage_records_counted"`

### T-05 来源关系去重：血缘、duplicate_of、双采集与不支持形状

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-04
- **估时**：1.5–2h
- **上下文**：Plan §3.4 第 1～5、7 层与第 2 层形状判定（嵌套覆盖校验在 T-06）。
- **修改范围**：弱连通分量与两种单层星形识别，其余形状 → `relation_shape_unsupported`（保留事实、不排除 token）；`duplicate_of` 生效条件、v3 键集核验、`duplicate_not_contained` / `duplicate_target_unavailable`、annotation + basis + 丢弃风险文案；血缘：`parentSession` 规范化字符串比较、复制件只由父计、r3 净新增记录集与复制件计数、`parent_not_selected`；同 `session_ref` 双采集未确认；`relations` 节。夹具 F5、F11 可通过校验的链式 / 混合分量。测试：`test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`、`test_relation_shapes_unsupported_retain_facts`。
- **完成标准**：
  1. 部分满足 AC-004-3：血缘可靠 → 复制条目只计一次，逐来源列复制件数（P3-R2-5 (ii) 前半，待 A）。
  2. 部分满足 AC-004-3：同会话双采集 / 冲突条目 → 各来源值保留、完整总计 unknown、标“未完全去重”。
  3. 部分满足 AC-004-3：`duplicate_of` 仅在 v3 键集包含且双方 loaded 时生效；否则双方值保留。
  4. 部分满足 AC-004-3：链式 / 混合分量 → `relation_shape_unsupported`，无来源被排除为 0。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_lineage_dedup_confirmed"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_ambiguous_overlap_not_deduplicated"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_duplicate_of_containment_and_unavailable_target"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_relation_shapes_unsupported_retain_facts"`

### T-06 嵌套工具用量覆盖（§3.4 第 6 层，r3）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-05
- **估时**：1–1.5h
- **上下文**：Plan §3.4 第 6 层 r3 文本（P3-R2-1 限定、P3-R2-5 (ii) 净新增集）。
- **修改范围**：单来源 toolResult 照计；多来源须 `all_nested_children_declared: true`，否则全部带 usage 的 toolResult 入未确认分区；(P, T) 分组与 (a)～(d) 前提，(d) 以子来源净新增集逐维比较，`parent_not_selected` / 血缘未确认 → `nested_coverage_unverifiable`；成立 → 子净新增 token 不入聚合；不成立 → P 与 G 入未确认分区并给原因类别。夹具 F8 全部（单子正例、五负例、两子逐维正 / 负、flag=false + 未声明子、血缘 + 嵌套正 / 负）。测试：`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage`。
- **完成标准**：
  1. 部分满足 AC-004-3 / AC-005-3：五负例与 flag=false + 未声明子 → 父子值各自保留、完整总计 unknown、无虚假已知小计；父结果无 usage 或 `complete=false` → 覆盖不成立（P3-R2-1，待 A）。
  2. 部分满足 AC-004-3：两子逐维和相等 → 只计父一次；仅四维合计相等或一子维 unknown → 未确认。
  3. 部分满足 AC-004-3：血缘 + 嵌套 → 先去复制件，净新增逐维相等即成立、不因原始和含历史被误拒；净新增不等 → 未确认（P3-R2-5 (ii)，待 A）。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_nested_link_negative_cases"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_nested_multi_children_per_dimension"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_lineage_net_new_before_nested_coverage"`

### T-07 尝试、工具、重试、返工与未观测路径

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-06
- **估时**：2h
- **上下文**：Plan §3.3 尝试 / 工具身份与视图、§4.4（r3 括号规则）、§3.6 `attempts` / `tool_calls` / `retries` / `unobserved_paths`。
- **修改范围**：主尝试按 5 种状态计数、`observed_total`、`run_total`；操作记录分类、`request_count` unknown、不与尝试相加；工具 `direct` / `proposed_only` / `nested_reported` / `all_total`、`tool_call_id_reused_in_scope`、`tool_owner_unresolved`，经 §3.4 分区；§4.4 括号：error → `auto_retry_start` → 括号内首个新 assistant `message_start` 计 confirmed（与重试结局无关），无新尝试 → `scheduled_unobserved`，`auto_retry_end` 只作终点，`total` 恒 unknown，session-v3 → unavailable，摘要重试标记单列；`rework` 标注；`unobserved_paths`（r4：删去“json 不暴露 usage 条目”，只留已核实盲区 branch summary、失败 / 中止的缓存预热请求、物理请求等）；`entry_appended` 的 usage 条目 / 边界 compaction 在类别分解中标“已覆盖”。测试：`test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views`、`test_attempt_states_and_operation_records`、`test_retry_requires_explicit_association`、`test_semantic_rework_annotation_only`、`test_covered_and_unobserved_paths`。
- **完成标准**：
  1. 部分满足 AC-005-1：工具调用不进尝试数。
  2. 满足 AC-005-1（身份部分）：`call_0` 两轮 → direct 2；同轮重复两次均计；proposed_only 不计；nested_reported 与 direct 不相加、`all_total` unknown；输出无 toolCallId。
  3. 部分满足 AC-005-3：inflight / terminal_only 计入观测尝试；session-v3 `run_total` unknown；操作记录 request_count unknown。
  4. 满足 AC-005-2：F2 正例尝试 2 / confirmed 1；链式重试 confirmed 2；取消 → scheduled_unobserved 1；`auto_retry_end(success:false)` 后的新尝试与 F4 无标记失败→成功均不计；total unknown（P3-R2-3，待 A）。
  5. 满足 AC-005-4：返工只来自标注、与传输重试分列，缺标注 unknown。
  6. 部分满足 AC-005-3：已覆盖 / 未观测路径分列：F13 的 `cache_warm` usage 条目与边界 compaction 标“已覆盖”；json 来源 `unobserved_paths` 含 branch summary、失败缓存预热与物理请求，不含 usage 条目或边界 compaction（r4）；文案“选定记录小计 ≠ 整次会话或平台账单”。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_tool_calls_separate_from_attempts"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_tool_identity_and_views"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_attempt_states_and_operation_records"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_retry_requires_explicit_association"`
  5. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_semantic_rework_annotation_only"`
  6. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_covered_and_unobserved_paths"`

### T-08 时间与执行结果

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-07（F8 覆盖关系来自 T-06；执行结果使用 T-03 的末个 `agent_settled`）
- **估时**：1–1.5h
- **上下文**：Plan §4.5、§3.5 时间与结局规则、§3.6 `timing`。时间只来自带出处标注，不用 mtime / 原生时间戳。
- **修改范围**：逐来源耗时（start + end、`observed_until` 下界、无效时间）；批次窗口与会话耗时合计（须所选会话边界齐全、带偏移且可比）；时间独立于来源采集状态与 token 分区；重复采集时间只计一次的条件；执行结果合并（原生中断 + 标注 timeout 不冲突、明确矛盾才“冲突 → 未知”）。测试：`test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source`、`test_timeout_known_duration_usage_unknown`。
- **完成标准**：
  1. 部分满足 AC-006-1：窗口 10 s、会话合计 20 s 分标签；边界缺失或无偏移 → 窗口 unknown。
  2. 部分满足 AC-006-1：父工具覆盖子 token 不删子会话时长（父 0–10、子 0–5 → 合计 15 s）。
  3. 部分满足 AC-006-1：来源文件缺失但 timing 合法 → 时长仍计入。
  4. 满足 AC-006-2：0→30 s 超时 → 耗时 30 known、时间 complete、结果 timeout、用量 unknown、overall incomplete；缺 end 不为 0；原生时间戳不出下界。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_parallel_window_10_sum_20"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_timing_independent_of_token_overlap"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_timing_kept_for_unavailable_source"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_timeout_known_duration_usage_unknown"`

### T-09 维度、标注、分组守恒与按度量完整性矩阵

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-08
- **估时**：1.5h
- **上下文**：Plan §3.5 维度出处与冲突、§4.3 分组守恒、§4.7 六项度量矩阵与 overall、§5 D1。
- **修改范围**：维度值带 origin（source / annotation），`annotation_conflict`；phase / role / model / channel 各自独立分组，含 `(未知)` 组，守恒只在已确认去重总体内；`observation` 节六项 complete / partial / unavailable + 单位 + 总体 + overall；D1 归一化域样例（测试中构造类型化 `SourceFacts` 注入 `build_report`，测试名与注释标明“不代表原生读取器能产出”）。测试：`test_missing_dimensions_unknown_group`、`test_annotation_origin_and_sources_untouched`、`test_group_conservation_per_dimension`、`test_all_known_aggregation_normalized_facts`。
- **完成标准**：
  1. 满足 AC-002-1：缺维度 → `(未知)` 独立组，不为空串 / 默认值。
  2. 满足 AC-002-2：维度带 origin；改标注后重跑源哈希不变、结果随标注变化；冲突计数。
  3. 满足 AC-002-3：每维各组（含未知）之和 = 已确认总体已知小计，未确认分区单列。
  4. 部分满足 AC-007-1：D1 → 6 项 complete、overall complete、完整总计为字面量。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_missing_dimensions_unknown_group"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_annotation_origin_and_sources_untouched"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_group_conservation_per_dimension"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_all_known_aggregation_normalized_facts"`

### T-10 摘要、CLI、写出与比较

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-09
- **估时**：2h
- **上下文**：Plan §2 CLI / 退出码 / 写出 / stdout / stderr、§3.6、§4.6、§4.7 四层状态。
- **修改范围**：`render_summary`（四层状态分列、单位与分母、r3 峰值标签与注明、“选定记录”文案、总体快照说明、非 loaded 来源、“非验收结论”、无事件回放）；`main`：`argparse` 错误 → `invalid_arguments`（不回显）；out-dir 须已存在且在仓库外；内存生成后按 `report.json` →（`records.json`）→ `summary.md` 用 `open(path, "x")` 独占创建，只清理本次创建的文件，残留时 `partial_artifacts_left=<n>`；退出码 0 / 3 / 2 / 1；固定 stdout 状态行与 stderr 类别；`--detail`；`--compare-with` 校验与投影、§4.6 可比性判定、无金额字段。测试：`test_summary_contents_units_denominators`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_comparability_flags_no_money`。
- **完成标准**：
  1. 满足 AC-007-1（摘要部分）与 AC-003-3（摘要标签部分）：已知小计 / 分组 / 覆盖计数 + 单位 + 分母、四层状态、证据标识、峰值标签同 §3.3、分母未知不出百分比。
  2. 部分满足 AC-001-4：F1 → 退出 0、`sources=ok`、overall incomplete；缺失 / 坏行 / 只有 header / 未 settled → 退出 3、`sources=gaps`，不出现“采集成功”或“观测完整”。
  3. 部分满足 AC-001-4：预先存在的目标与临时文件样名来源哈希不变、退出 2、无本次残留。
  4. 部分满足 AC-001-4：第二个产物写失败（文件系统边界注入）→ 只删本次文件；清理失败 → 退出 1 + 残留计数。
  5. 满足 AC-007-4：基线不同仅披露；模型 / 范围 / 口径变 → 不可直接比较；缺 → 未知；人工说明不移除警示；无 cost / 金额。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_summary_contents_units_denominators"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_exit_codes_separate_acquisition_from_coverage"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_existing_outputs_never_overwritten"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_write_failure_cleans_own_artifacts_only"`
  5. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_comparability_flags_no_money"`

### T-11 离线、隐私与仓库状态回归 + 工具登记

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-30，openai/gpt-6-astra）

- **依赖**：T-10
- **估时**：1.5–2h
- **上下文**：端到端的外部边界观测（审计钩子）、哨兵隐私检查与仓库状态（Plan §5 AC-001-1 / 001-3 / 001-4 / 007-2 / 007-3 / 008-2 行）。
- **修改范围**：测试 `test_only_selected_sources_opened`（F1 + F9）、`test_zero_model_and_network_attempts`（F1 + F2，清空凭证类环境变量）、`test_no_effect_on_observed_work`（F1 + 合成 `specs/demo/` 沙箱）、`test_privacy_sentinels_absent`（哨兵放于 Plan §5 所列禁止负载位置，含 r4 F13 (d)：`entry_appended` 的 custom customType / data、custom_message content、compaction summary / details / systemMessage、usage note）、`test_path_shaped_labels_rejected_not_echoed`（F9）、`test_repo_state_unchanged`（`git init` 临时沙箱 + 本仓库 out-dir 守卫）、`test_synthetic_categories_covered`；`backend/README.md` 工具表增一行 `tools/dev_harness_budget.py`（开发批次用量运行后观测；out-dir 须在仓库外；链接本 feature spec）。
- **完成标准**：
  1. 满足 AC-001-1：审计 `open` 路径 ⊆ 清单 + 选定来源 + out-dir；未选文件 / 私有目录未打开，其哨兵不在输出。
  2. 满足 AC-001-3：socket 连接 / 解析与进程事件计数 = 0，退出 0，产物按 schema 完整写出（不断言 overall complete）。
  3. 部分满足 AC-001-4：源与沙箱 spec / checklist / review 哈希前后一致；源只以 `rb` 打开；无 Popen / kill / system。
  4. 满足 AC-007-2：所有输出文件 / stdout / stderr（含失败与注入的内部错误）无哨兵（含 F13 `entry_appended` 负载哨兵），合法用量仍正确（F13 usage 条目 / 边界 compaction 照计，custom / custom_message 不计数）。
  5. 满足 AC-007-2（标签部分）：路径形标注 → `manifest_invalid` + 字段路径，路径形来源 provider / model → `(无效标签)`，原值不出现；合法 ID 保留。
  6. 满足 AC-007-3：运行前后 `git status --porcelain=v1 --untracked-files=all` 一致；out-dir 在仓库内 → 退出 2、无写出。
  7. 满足 AC-008-2：F1 / F2 / F3 分别覆盖三类情形，D1 标为归一化域样例，样例只含合成文本。
  8. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过。
  9. （非 AC，Plan §1 / AGENTS §4）后端全量回归不新增失败：HANDOFF 记录的既有基线（453 passed / 1 failed / 5 skipped，netstat 非空监听断言）**不属于本 feature**，不修复、不称已通过。
  10. （非 AC，Plan §1 / AGENTS §4）范围核对：新工具文件在未跟踪状态下也被检索（`--untracked`）且未 import 产品包；`pyproject.toml` / `.gitignore` 未变；变更只含 3 个新文件 + README 一行。
- **验证命令**（未执行）：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_only_selected_sources_opened"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_zero_model_and_network_attempts"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_no_effect_on_observed_work"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_privacy_sentinels_absent"`
  5. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_path_shaped_labels_rejected_not_echoed"`
  6. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_repo_state_unchanged"`
  7. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_synthetic_categories_covered"`
  8. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`
  9. `cd backend && python -m pytest tests/ -q`（与 HANDOFF 基线对比，只看是否新增失败）
  10. `git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py`（期望无输出；提交前后均有效）；`git diff --exit-code -- backend/pyproject.toml .gitignore`；`git status --porcelain=v1 --untracked-files=all`

### T-12 真实试点（已授权；在修复任务之后执行）

- **依赖**：T-11、T-13～T-15，以及 r5 修复任务 T-16～T-20（试点须使用修复后的最终代码）
- **估时**：0.5–1h
- **状态**：✅ 已执行（协调者，2026-10-31，基线 `a868d25`）：用户授权的 35 段子会话捕获，退出码 3、前后核对一致；脱敏记录见 review.md“T-12 真实试点记录”。AC-008-1 / AC-008-3 待 Review R2 与 Gate 2 判定。（原状态：**已授权，未开始**。用户原话“全修，T-12同批完成，授权脱敏”（2026-10-31，见 review.md“用户对 Review R1 的处置与试点授权”节）。授权范围：本功能各阶段子会话的 `pi --mode json` 事件捕获，即本机系统 Temp 下本功能临时工作目录中文件名为 `budget-*.jsonl` 与 `review-budget-*.jsonl` 者（修复循环新生成的同类捕获同属本功能子会话）；不含协调者自身会话、`~/.pi` 下的会话、其他项目或私有文档目录。执行约束：由协调者在 T-16～T-20 完成后以最终代码运行；清单与报告只放仓库外的系统 Temp；不新增模型调用、不重跑任务；review.md 只记脱敏计数与状态，不记路径、会话 ID、提示词或报告原文；运行前后核对被观测 feature（即本功能 `dev-harness-budget`，r7）的 spec / checklist / review 哈希与 `git status`。未执行并经 Review 前，不得判定 AC-008-1 / AC-008-3 通过。下列完成标准含义不变；r7 只在验证命令中写明 feature 名与执行顺序。）
- **上下文**：Plan §5 AC-008-1 / AC-008-3、§6 试点依赖。只证明可用性，不是统计基线，不证明节省。
- **修改范围**：无仓库代码改动。由协调者编写本地清单，`sources` 只列授权范围内的 `budget-*.jsonl` / `review-budget-*.jsonl` 捕获（不含协调者自身会话、`~/.pi` 下的会话、其他项目或私有文档目录）；清单与 out-dir 均放在本机系统 Temp 下本功能的临时工作目录（仓库外）。不新增模型调用、不付费重放、不重跑任务。`review.md` 只记脱敏元数据（退出码、`sources` 状态、`metrics_complete=<k>/6`、各度量状态与计数），不记路径、内容、会话 ID 或报告原文。
- **完成标准**：
  1. 满足 AC-008-1：对一个经用户授权的真实批次生成报告，无新增模型调用；记录写明“仅证明可用、非基线、不证明节省”。
  2. 满足 AC-008-3：被观测 feature（本功能 `dev-harness-budget`）的冻结 AC / checklist / 路由 / Gate 前后不变；记录写明不构成其验收，不以 desktop-shell / WI 完成为前提。
- **验证命令**（手动，未执行）。执行顺序（r7）：命令 2 的“前”核对 → 命令 1 的报告命令 → 命令 2 的“后”核对（须与“前”一致）→ 命令 1 的写入脱敏记录；试点记录本身不属于被比较的状态。
  1. `cd backend && python tools/dev_harness_budget.py report --manifest <用户本地清单> --out-dir <用户本地目录>`，确认退出 0 或 3 及状态行；命令 2 的“后”核对一致之后，才在 review.md 写入脱敏记录。
  2. 在报告命令之前与之后（写入试点记录之前）各执行一次 `git hash-object specs/dev-harness-budget/spec.md specs/dev-harness-budget/checklist.md specs/dev-harness-budget/review.md` 与 `git status --porcelain=v1 --untracked-files=all`，两次输出一致。

### T-13 覆盖分母：选定来源有缺口时，记录类度量的分母与百分比为未知（Converge R1 追加）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-11
- **估时**：0.5–1h
- **上下文**：Converge R1 在 `b8175f4` 复现：S1 已加载、S2 缺失时，`observation.metrics.tokens` 为“分母 1、已覆盖 1、缺失 0、覆盖率 100%”；S2 为坏行 / 截断（`partial`）时同样是 100%。缺口来源的记录数不可知，选定来源总体的分母实际未知。这与 spec AC-007-1（在声明的选定来源总体内给已覆盖 / 未覆盖 / 缺失计数；分母未知不给百分比）、Plan §3.3“单位与分母”和 §4.3 第 1 条（缺失 / 截断来源不产生记录，对空集说“全部 known”是空真）不符。本任务只让实现符合现有 Plan 规则，不改 Plan、不新增需求。
- **修改范围**：`dev_harness_budget.py` 的 `_observation`（`render_summary` 只在需要时改）：只要任一选定来源不是 `loaded`（`unavailable` / `partial` / `empty`），以记录为单位的两项度量（tokens = 用量归属记录；tool_calls = 来源内调用身份）的 `denominator` 与 `coverage_percent` 均为未知（null，摘要显示“未知”），`missing` 也为未知、不填 0；另用一个单独字段（如 `missing_sources`）、单位“来源”，披露非 loaded 的选定来源数，不与记录计数相加；`covered` 照常给出。全部来源 loaded 时行为不变；rework / timing（单位“来源”，分母 = 选定来源数）与 main_attempts / retries（分母取自 run_total / total）不变。测试：`test_dev_harness_budget.py` 新增 `test_coverage_denominator_unknown_with_source_gaps`，复用 F1 / F6 夹具与带 1 次 finished 工具调用的 session-v3 行；S1、S2 用不同会话 id。
- **完成标准**：
  1. 满足 AC-007-1（覆盖计数与分母部分）：经 `main` 生成报告。S1 = session-v3，含 1 条已知主尝试（170）和 1 次 finished 工具调用；S2 参数化为缺失、坏行（partial）、只有 header（empty）三种。每种情形下：`report.json` 中 tokens 与 tool_calls 的 `denominator`、`coverage_percent`、`missing` 均为 null；非 loaded 选定来源数 = 1，单位“来源”；`summary.md` 的 tokens / tool_calls 行，分母与覆盖率均显示“未知”，不含“100%”；退出码 3，`sources=gaps`。对照：只选 S1 时，tokens 行仍含 `| 1 | 1 | 0 | 100% |`。
  2. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过。
  3. （非 AC，Plan §1 / AGENTS §4）后端全量回归不新增失败。基线为 Converge R1 实测 760 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 监听断言，不属本 feature。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_coverage_denominator_unknown_with_source_gaps"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`
  3. `cd backend && python -m pytest tests/ -q`（与上述基线对比，只看是否新增失败）

### T-14 分组节分母：选定来源有缺口时，分组的记录分母与缺失数为未知（Converge R2 追加）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-13
- **估时**：0.5–1h
- **上下文**：Converge R2 在 `b014e40` 复现：T-13 后，`observation.metrics` 的 tokens / tool_calls 行在来源缺口下已显示“分母 未知”，但同一份报告的分组节仍声明已知分母。S1（session-v3，F1 170，phase 标注 `Plan`）已加载、S2（同标 `Plan`）缺失时，`summary.md` 的 token 节写“记录单位：用量归属记录；分母 未知（选定且已确认去重的快照记录）”，`### phase` 节却写“单位：用量归属记录；分母 1；选定且已确认去重的快照记录”，分组行为 `| Plan | 170 | 1 | 0 | 1 |`（未覆盖 / 缺失 0、分母 1）。S2 为坏行（partial）或只有 header（empty）时同样如此。同一总体在同一报告内的分母自相矛盾；S2 的记录本应落入 `Plan` 组，但数量未知。这与 spec AC-007-1（覆盖计数须标明所依据的总体与分母，分母未知不得冒充已知）、Plan §3.3“单位与分母”和 §4.3 第 1 条不符，是 Converge R1 同类差距在分组节的残留。本任务只让实现符合现有 Plan，不改 Plan、不新增需求；分组守恒（AC-002-3）不变。
- **修改范围**：`dev_harness_budget.py` 的 `_groups` 与 `render_summary` 分组节（`build_report` 只在需要时传入非 loaded 选定来源数）。
  - `report.json`：`groups.<维度>` 增加 `denominator` 与 `missing_sources`（`{"count": n, "unit": "来源"}`，不与记录计数相加）。任一选定来源非 `loaded` 时 `denominator` 为 null；全部 loaded 时 `denominator` = 该维 `record_count`，`missing_sources.count` = 0。
  - `summary.md` 分组节：有缺口时，每维首行写“分母 未知”，各组行的“未覆盖 / 缺失记录”与“分母”两列显示“未知”；“已知小计（token）”“已覆盖记录”照常给出。
  - 不变：`known_subtotal`、`conserved`、各组已知小计、`groups.<维度>.record_count` 与各组对象内的观测记录计数；全部 loaded 时摘要逐字不变。
  - 测试：新增 `test_group_denominator_unknown_with_source_gaps`，复用 T-13 测试的构造（S1 = F1 改会话 id；S2 = F6 缺失 / 坏行 / 只有 header），两来源均标 `dimensions.phase = "Plan"`。
- **完成标准**：
  1. 满足 AC-007-1（分组节分母部分）：经 `main` 生成报告，S2 参数化为缺失、坏行（partial）、只有 header（empty）三种。每种情形下：退出码 3；`report.json` 中 phase / role / model / channel 四维的 `denominator` 均为 null，`missing_sources` = `{"count": 1, "unit": "来源"}`，`conserved` 为 true，`known_subtotal` 与 `tokens.known_subtotal` 相等；`summary.md` 每个 `### <维度>` 节首行含“分母 未知”，不含“分母 1”“分母 2”；`Plan` 组行为 `| Plan | <已知小计> | <已覆盖> | 未知 | 未知 |`（缺失：170 / 1；坏行：340 / 2；只有 header：170 / 1）。对照：只选 S1 时，`### phase` 节首行含“分母 1”，`Plan` 组行为 `| Plan | 170 | 1 | 0 | 1 |`，`denominator` = 1，`missing_sources.count` = 0。
  2. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过。
  3. （非 AC，Plan §1 / AGENTS §4）后端全量回归不新增失败。基线为 Converge R2 实测 764 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 监听断言，不属本 feature。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_group_denominator_unknown_with_source_gaps"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`
  3. `cd backend && python -m pytest tests/ -q`（与上述基线对比，只看是否新增失败）

### T-15 token 节未知记录数：选定来源有缺口时，摘要的未知用量归属记录数为未知（Converge R3 追加）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-14
- **估时**：0.5h
- **上下文**：Converge R3 在 `f3e3d18` 复现：T-13 / T-14 之后，覆盖表 tokens 行的“未覆盖 / 缺失”（取自 `tokens.unknown_records`）与分组节的缺失列在来源缺口下已显示“未知”，但同一份 `summary.md` 的 `### token` 节仍写“已确认去重；未知 0 条用量归属记录；原因：source_missing。”，维度表“未知记录”列为 0（S1 = F1 已加载，S2 缺失；S2 为坏行（partial）或只有 header（empty）时同样如此）。同一数量在同一报告内一处“未知”、一处“0”；“未知 0 条”即“全部已知”，正是 Plan §4.3 第 1 条所说的空真（缺失 / 截断来源不产生记录）。这与 spec AC-007-1（覆盖 / 缺失计数须依据声明的选定来源总体，分母未知不冒充已知）及 AC-001-4（观测失败时不填 0）不符，是 Converge R1 / R2 同类差距在 token 节的最后残留。本任务只改摘要渲染，不改 Plan、不新增需求。
- **修改范围**：`dev_harness_budget.py` 的 `render_summary` token 节（以已有的 `observation.metrics.tokens.missing_sources.count > 0` 为条件，不新增 JSON 字段，不改 `build_report`）。
  - 有缺口时：叙述行改为“`<去重标签>`；未知用量归属记录数 未知；原因：`<原因>`。”；维度表 6 行（4 个互斥维 + 2 个子集）的“未知记录”列显示“未知”。“已知小计”“已知记录”“部分观测值”“部分记录”“无效记录”列照常。
  - 不变：`report.json`（`tokens.unknown_records` 与各维 `unknown_records` 仍是观测记录计数，与 T-14 对 groups 的处理一致；选定总体的缺失数由 `observation.metrics.tokens.missing` = null 与 `missing_sources` 表达）；全部 loaded 时摘要逐字不变（T-14 测试中的摘要哈希继续成立）。
  - 测试：新增 `test_token_unknown_records_unknown_with_source_gaps`，复用 T-13 测试的构造（S1 = F1 改会话 id + 1 次 finished 工具调用；S2 = F6 缺失 / 坏行 / 只有 header；另加全部 loaded 对照）。
- **完成标准**：
  1. 满足 AC-007-1（token 节未知记录数部分）：经 `main` 生成报告。缺失 / 坏行 / 只有 header 三种情形：退出码 3；`summary.md` 含“已确认去重；未知用量归属记录数 未知；原因：source_missing。”/“……原因：bad_json。”/“……原因：no_usage_records_observed。”，不含“未知 0 条”；维度表行为 `| input | 100 | 1 | 未知 | 0 | 未知 | 0 |`（坏行：`| input | 200 | 2 | 未知 | 0 | 未知 | 0 |`）与 `| cache_write_1h（子集，不再计入总量） | 未知 | 0 | 未知 | 0 | 未知 | 0 |`，6 行都以 `| 未知 | 0 |` 结尾；`report.json` 中 `tokens.unknown_records` = 0、`tokens.dimensions.input.unknown_records` = 0、`tokens.subsets.cache_write_1h.unknown_records` = 1（坏行：2），`observation.metrics.tokens.missing` 为 null。对照：只选 S1 时退出 0，摘要仍含“已确认去重；未知 0 条用量归属记录；原因：无。”与 `| input | 100 | 1 | 未知 | 0 | 0 | 0 |`。
  2. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过（含 T-14 的全部 loaded 摘要哈希断言）。
  3. （非 AC，Plan §1 / AGENTS §4）后端全量回归不新增失败。基线为 Converge R3 实测 768 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 监听断言，不属本 feature。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_token_unknown_records_unknown_with_source_gaps"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`
  3. `cd backend && python -m pytest tests/ -q`（与上述基线对比，只看是否新增失败）

### T-16 嵌套工具执行事件的读取与身份（Review R1 P2-CR-1，前半）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-15；且对固定候选提交的最新一轮 Analyze（R5 或其后重跑）通过、有效 checklist（R4 或其后）全部勾选（r7：原写“Analyze R3 通过”，R3 未通过且不再改写，条件不可满足）
- **估时**：1.5–2h
- **上下文**：Review R1 P2-CR-1：pi 1.4.0 的工具内嵌套调用（`ctx.executeTool()`）在同一 json 流中发出带 `parentToolCallId` 的 `tool_execution_*`，现读取器把它们记为 direct。Plan r5 §2（`NestedExecutionRecord`、`SourceFacts.nested_executions`）、§3.2 两行、§3.3 r5 三条规则、§4.2 白名单、§5 F2 修正与 F14。本任务只改读取与夹具；视图、去重计数与判定在 T-17。
- **修改范围**：
  - `dev_harness_budget.py`：新增 `NestedExecutionRecord`（`owner_ref, call_ref, root_ref, state`）与 `SourceFacts.nested_executions`；`_read_pi_json_events` / `_tool_event` 白名单增读 `parentToolCallId`（非空字符串）。带父 id 的 start / end 不追加到 `tool_calls`，按 Plan §3.3 在同一 owner 作用域内解析顶层父（direct 恰一条 → 顶层；已解析嵌套子 id 恰一条 → 继承；否则 `nested_parent_unresolved`，仍为嵌套）；已解析者 `call_ref = _hash_ref("n", 顶层父 call_ref + "\0" + 子 id)`（与 `_nested` 对记录的构造相同）；同一身份内 start / end 配对为 finished / unfinished / terminal_only；raw id 只在读取器局部映射中。不读 `tool_execution_update`；不从 id 字符串推断父子。session-v3 读取不变。
  - `dev_harness_budget_fixtures.py`：按 Plan §5 r5 修正 F2（嵌套 id 改为 `call_0/1`、`call_0/2`，去掉重复记录，按核实顺序补嵌套执行事件，`call_0/2` 的 end 在父 toolResult 之后）；新增 F14 (a)～(f) 生成函数；`privacy_rows` 把 `parentToolCallId` 替换为哨兵（如 `PRIVATE_PARENT_TOOL_CALL_ID`）。
  - `test_dev_harness_budget.py`：新增 `test_nested_execution_events_read_as_nested`（经 `read_source`）；`test_privacy_sentinels_absent` 增加 `parentToolCallId` 哨兵检索。
  - **既有测试修正（明确）**：F2 是基线中唯一在 toolResult 上写 `nestedCalls` 的 json-events 夹具（`nestedCalls` 检索：`f2_rows` 一处；`f8_sources`、`f12_nested_sources` 与 `test_tool_identity_and_views` 内联行均为 session-v3，pi 不持久化嵌套事件，不改）。按 Plan，F2 修正后其 direct 计数（1）、`nested_reported.observed_total`（2）、记录状态（ok 1 / unfinished 1）与 tool_calls 状态（partial）不应改变；若任何既有断言因 F2 的真实形状而变化，须在本任务内改正，并在 review.md 逐条列出改前 / 改后与理由，不得为通过而放宽断言。“父调用内按 id 去重”的防御性断言继续由 session-v3 样例（`nested_identity` / `session_reused` / F12 nested sources）承担。
- **完成标准**：
  1. 部分满足 AC-005-1（嵌套标识部分）：经 `read_source` 读取 F14 (a)～(f) 与 F2：带 `parentToolCallId` 的执行全部在 `nested_executions`、无一进入 `tool_calls`；`tool_calls` 中非 `proposed_only` 记录数 = 模型发起调用数（(a)～(d)：1；(e)：2；(f)：2；F2：1）；已解析嵌套执行的 `call_ref` 集合与父 toolResult `nestedCalls` 记录的 `call_ref` 集合关系为：(a) 2 / 2 相等；(b) 3 / 3 相等（含 `call_1/1/1`，其 `root_ref` 与 `call_1/1` 相同）；(d) 交集 1、只见执行 1；(e) `call_A/1`、`call_B/1` 各与自己父结果的记录相等且 `root_ref` 不同；(f) 两轮的 `call_0/1` 的 `call_ref` 不相等；(c) 额外那条 `root_ref` 为 None、来源原因含 `nested_parent_unresolved`；F2 两条嵌套执行均为 finished，其已解析 `call_ref` 集合与父 toolResult `nestedCalls` 记录的 `call_ref` 集合 2 / 2 相等（即 Plan §5 的 matched 2；记录中 `call_0/2` 为 unfinished、`complete=false`，r6）；无 `parentToolCallId` 的 F12 各例 `nested_executions` 为空。
  2. 满足 AC-007-2（嵌套字段部分）：F2 隐私样例中 `parentToolCallId` 与 toolCallId 的哨兵不出现在任何输出文件、stdout、stderr；合法用量仍按原期望统计。
  3. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过（含 F2 修正后的既有测试）。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_nested_execution_events_read_as_nested"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_privacy_sentinels_absent"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`

### T-17 嵌套视图、去重计数与 tool_calls 判定（Review R1 P2-CR-1，后半）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-16
- **估时**：1–1.5h
- **上下文**：Plan r5 §3.3（视图、对 direct 完整性的影响、`all_total` 保守）、§3.6 `tool_calls`、§4.7 tool_calls 行与分母说明。目标：direct = 模型发起调用数，嵌套单列且去重，嵌套证据不使 direct 看似完整、也不抬高其分母。
- **修改范围**：`dev_harness_budget.py` 的 `_count_metrics` / `_tool_counts`：新增 `nested_executed`（finished / unfinished / terminal_only / parent_unresolved / observed_total；只计 json-events，全部为 session-v3 时 observed_total 为 null、原因 `nested_events_not_persisted`）与 `nested_deduplicated`（observed_total / matched / executed_only / reported_only，按 Plan §3.3 逐来源计算后相加）；`nested_parent_unresolved` 与嵌套 unfinished / terminal_only（`nested_execution_incomplete`）加入 tool_calls 原因；direct 计数与 `_observation` 中 tool_calls 的分母 / 已覆盖 / 缺失不变（只含 direct）；`build_report` 与 `_tool_counts` 中 `all_total` 的判定改为“存在任何嵌套证据（记录或执行）→ unknown（`nested_overlap_unresolved`）”。`render_summary`：仅当存在嵌套证据时，在“工具 direct”行后加一行“嵌套工具调用（不计入 direct、不与 direct 相加）：执行事件 N（父未解析 U）；nestedCalls 记录 R；按标识去重后 M（两者均见 K）。”，无嵌套证据时摘要逐字不变。`records.json` 只含用量记录，不变。测试：新增 `test_nested_views_dedup_and_direct_coverage`（经 `main`）。
- **完成标准**：
  1. 满足 AC-005-1（视图与去重部分）：经 `main` 生成报告，F14 (a)：`tool_calls.direct` = `{finished: 1, unfinished: 0, terminal_only: 0, observed_total: 1}`，`nested_executed.finished` 2、`observed_total` 2、`parent_unresolved` 0，`nested_reported.observed_total` 2，`nested_deduplicated` = `{observed_total: 2, matched: 2, executed_only: 0, reported_only: 0}`，`all_total` 为 unknown（`nested_overlap_unresolved`），`attempts.main_assistant.observed_total` 2，`tool_calls.status` complete、`reasons` 为空；(b) 嵌套 3、matched 3、direct 1；(c) `parent_unresolved` 1、direct 1、`nested_deduplicated.observed_total` 3（matched 2、executed_only 1）、`reasons` 含 `nested_parent_unresolved`、status partial；(d) `nested_deduplicated.observed_total` 2（matched 1、executed_only 1）、`reasons` 含 `nested_incomplete`；(e) direct 2、嵌套 2、matched 2；(f) direct 2、`nested_deduplicated.observed_total` 2、`reasons` 不含 `tool_call_id_reused_in_scope`；F12 `two_owners`（无嵌套证据）→ `all_total` = 2、`nested_executed.observed_total` 0；F12 nested sources（session-v3）→ `nested_executed.observed_total` 为 null（`nested_events_not_persisted`）、`nested_deduplicated` = `{observed_total: 2, matched: 0, executed_only: 0, reported_only: 2}`、direct 3 不变。
  2. 部分满足 AC-007-1（direct 分母部分）：F14 (a) 的 `summary.md` 含 `| tool_calls | complete | 来源内调用身份 | 选定且已确认去重的 direct 视图 | 1 | 1 | 0 | 100% | 无 |` 与嵌套说明行；(c) 的 tool_calls 行状态为 partial、分母仍为 1；`observation.metrics.tool_calls.denominator` 在 (a)～(d) 均为 1；只选 F1 的摘要逐字不变（T-14 测试中的摘要哈希断言照过）。
  3. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_nested_views_dedup_and_direct_coverage"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_nested_views_dedup_and_direct_coverage or test_group_denominator_unknown_with_source_gaps"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`

### T-18 未确认分区下的覆盖分母与空集原因（Review R1 P3-CR-1）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-17
- **估时**：1–1.5h
- **上下文**：Review R1 P3-CR-1：全部 loaded 但同会话双采集时，覆盖行与分组节给出“分母 0 / 缺失 0”，并误用 `no_usage_records_observed`。Plan r5 §4.3“空集原因”“未确认分区下的分母”两段、§3.6、§4.7 分母说明。与 T-13～T-15 的来源缺口同样处理，只是触发条件扩展到未确认分区。
- **修改范围**：`dev_harness_budget.py`：`build_report` 计算两个来源计数——tokens / 分组 = `partition.uncertain` 或 `partition.uncertain_records` 非空的来源数，tool_calls = `partition.uncertain` 非空的来源数（被生效 `duplicate_of` 取代或被嵌套覆盖的来源不计）；`_observation`：tokens / tool_calls 在 `missing_sources` 或各自的未确认来源数 > 0 时分母、缺失、覆盖率为 null，另列 `unconfirmed_sources`（`{"count": n, "unit": "来源"}`）；`_groups`：同条件下 `denominator` 为 null，另列 `unconfirmed_sources`；`_aggregate_tokens`：不再因记录集为空追加 `no_usage_records_observed`，空集按 Plan §4.3 追加 `no_confirmed_records`（逐来源聚合中来源本身为 `empty` / `unavailable` 时不追加）；`render_summary`：token 节“未知用量归属记录数 未知”与维度表“未知记录”列的条件扩展为“来源缺口或 tokens 未确认来源数 > 0”，并在有未确认来源时加一行“tokens：未确认去重来源 n 来源；tool_calls：m 来源；不与记录计数相加。”。全部 loaded 且无未确认分区时输出不变。测试：新增 `test_unconfirmed_partition_denominators_unknown`（参数化：F5 `double_capture`、F8 `undeclared`、只选 F1 的对照）。若既有测试断言了因聚合追加的 `no_usage_records_observed`（非 `empty` 来源情形）或未确认情形下的“分母 0”，须在本任务内改正并在 review.md 列出。
- **完成标准**：
  1. 满足 AC-007-1（未确认分区部分）：经 `main`，F5 `double_capture`：退出码 0、stdout 含 `sources=ok`；`observation.metrics.tokens` 与 `tool_calls` 的 `denominator`、`missing`、`coverage_percent` 均为 null，`unconfirmed_sources` = `{"count": 2, "unit": "来源"}`；四维 `groups.<维度>.denominator` 为 null、`unconfirmed_sources.count` 2、`conserved` 为 true；`summary.md` 的 tokens 行含 `| 未知 | 0 | 未知 | 未知 |`，不含“分母 0”，每个 `### <维度>` 节首行含“分母 未知”，token 节含“未完全去重；未知用量归属记录数 未知；”。F8 `undeclared`：tokens `unconfirmed_sources.count` 1、`denominator` 为 null；tool_calls `unconfirmed_sources.count` 0、`denominator` 为 1。对照只选 F1：退出 0，摘要逐字不变（T-14 摘要哈希断言照过）。
  2. 满足 AC-003-4（空集原因部分）：F5 `double_capture` 的 `tokens.reasons` 含 `no_confirmed_records`、不含 `no_usage_records_observed`；只有 header 的单来源仍含 `no_usage_records_observed`（`test_header_only_not_zero` 照过）；T-15 的只有 header 情形摘要仍为“……原因：no_usage_records_observed。”。
  3. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过（含 T-13～T-15 测试）。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_unconfirmed_partition_denominators_unknown"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_header_only_not_zero or test_token_unknown_records_unknown_with_source_gaps"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`

### T-19 血缘父已选入但不可用：不做键集差（Review R1 P3-CR-2）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-18
- **估时**：0.5–1h
- **上下文**：Review R1 P3-CR-2：血缘父已选入但缺失 / 部分时，子来源仍标 `net_new_determined: true`、“复制件由血缘父计”。Plan r5 §3.4 第 4 层、第 6 层 (d)、§3.6 `sources[]`。
- **修改范围**：`dev_harness_budget.py` 的 `_lineage_partition`：在形状检查之后，若血缘父 `status != "loaded"`，不做键集差，`lineage` = `{parent, reason: "lineage_parent_unavailable", net_new_determined: false, copied_entry_count: null, note: "血缘父未完整加载，无法区分复制件。"}`；父为 `partial` 时把原因加入父与子的未确认分区；`build_report` 的 `sources[]`：`lineage` 存在且 `net_new_determined` 为 false 时（`parent_not_selected`、`lineage_parent_unavailable`、`lineage_usage_conflict`、父或子在 `relation_shape_unsupported` 分量内而跳过键集差；Plan r6 §3.4 第 4 层）`copied_record_count` 与 `net_new_record_count` 为 null，无血缘来源不变（0 / 全部记录）；`render_summary` 对 null 显示“未知”。夹具：F5 `lineage` 的变体，父文件分别为缺失、只有 header、原内容末尾追加一行坏 JSON；另加链式重复变体（r6：C `duplicate_of` P，并新增另一会话的单条 assistant 来源 D `duplicate_of` C，使血缘对 C→P 落入 `relation_shape_unsupported` 分量）。测试：新增 `test_lineage_parent_unavailable_not_determined`（参数化上述四种变体）。**既有测试修正（明确）**：(1) `test_lineage_dedup_confirmed` 的 `parent_not_selected` 分支（约 542 行）把 `copied_record_count == 0` 改为 `is None`，并新增 `net_new_record_count is None`；(2) r6：`test_ambiguous_overlap_not_deduplicated`（约 565 行）的 `report["sources"][1]["copied_record_count"] == 0` 按 case 拆分——`lineage_conflict` 改为 `copied_record_count is None` 且 `net_new_record_count is None`（现行为 0 / 2），`double_capture`（子来源无血缘）保持 `== 0`。其余断言不变，并在 review.md 逐条记录改前 / 改后。
- **完成标准**：
  1. 部分满足 AC-004-3（血缘父不可用部分）：三种变体经 `main`：子来源 `lineage.reason` = `lineage_parent_unavailable`、`net_new_determined` 为 false、`copied_entry_count`、`copied_record_count`、`net_new_record_count` 均为 null，`summary.md` 不含“复制件由血缘父计”；`tokens.reasons` 含 `lineage_parent_unavailable`、完整总计为 null。父缺失 / 只有 header：子来源 `tokens.known_subtotal` 180，批次 `tokens.known_subtotal` 180。父坏行：父 170、子 180 各自单列，批次 `known_subtotal` 为 null、`deduplication_label` 为“未完全去重”。
  2. 部分满足 AC-004-3（`net_new_determined: false` 一致性，r6 扩展）：`parent_not_selected`、F5 `lineage_conflict` 与链式重复变体中的子来源 C：`lineage.net_new_determined` 为 false，`copied_record_count` 与 `net_new_record_count` 均为 null，`summary.md` 中该来源的复制件数与净新增记录数显示“未知”、不含“复制件 0 条”；其余照旧——`parent_not_selected` 子来源 180 与原因 `parent_not_selected`，`lineage_conflict` 子来源 181 与原因 `lineage_usage_conflict`，链式变体子来源已知值 180 保留、`tokens.reasons` 含 `relation_shape_unsupported`、完整总计为 null。对照：F5 `double_capture` 的 `copied_record_count` 仍为 0，F5 `lineage` 仍为复制件 1 / 净新增 1。
  3. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_lineage_parent_unavailable_not_determined"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_lineage_dedup_confirmed or test_ambiguous_overlap_not_deduplicated or test_lineage_parent_unavailable_not_determined or test_lineage_net_new_before_nested_coverage"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`

### T-20 分组守恒改为计算 + 修复批次收尾回归（Review R1 P3-CR-3）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-19
- **估时**：0.5–1h
- **上下文**：Review R1 P3-CR-3：`_groups` 用生产 `assert conserved`。Plan r5 §4.3“分组守恒不用生产断言”。本任务同时做 T-16～T-20 的收尾回归与范围核对。
- **修改范围**：`dev_harness_budget.py`：删除 `_groups` 中的 `assert`，`conserved` 为计算值；`build_report` 先算分组再算 `observation`，任一维 `conserved` 为 false 时 `tokens.reasons` 加 `group_conservation_failed`、`complete_total` 置 unknown、status 由 complete 降为 partial。测试：新增 `test_group_conservation_computed_not_asserted`：用 `ast` 解析生产模块源码，断言没有 `ast.Assert` 节点；F1 + F2 报告四维 `conserved` 均为 true、`tokens.reasons` 不含 `group_conservation_failed`。失败分支按构造不可达，不对私有函数打桩（AGENTS §5.6）。
- **完成标准**：
  1. 满足 AC-002-3（守恒计算部分）：生产模块无 `assert` 语句；正常路径每维 `conserved` 为 true，无 `group_conservation_failed`；`test_group_conservation_per_dimension` 照过。
  2. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过。
  3. （非 AC，Plan §1 / AGENTS §4）后端全量回归不新增失败。基线为 Converge R4 / Review R1 实测 772 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 监听断言，不属本 feature；本批新增测试只增加通过数。
  4. （非 AC，Plan §1 / AGENTS §4）范围核对：未 import 产品包；`pyproject.toml` / `.gitignore` 未变；本批代码改动只在 3 个既有文件内。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_group_conservation_computed_not_asserted or test_group_conservation_per_dimension"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`
  3. `cd backend && python -m pytest tests/ -q`（与上述基线对比，只看是否新增失败）
  4. `git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py`（期望无输出）；`git diff --exit-code -- backend/pyproject.toml .gitignore`；`git status --porcelain=v1 --untracked-files=all`

### T-21 嵌套执行原因与未确认来源计数（Review R2 P3-CR2-1 / P3-CR2-2）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-20
- **估时**：0.5–1h
- **上下文**：[Review R2](code-review-r2.md) 两项 P3，都是披露层的原因 / 计数失真，不影响已知小计、完整总计、分母结论与退出码。(1) P3-CR2-1：`_tool_counts` 以传入的已确认来源判定“是否存在 json-events”，唯一的 json-events 来源落入未确认分区时（F5 `double_capture`），`nested_executed` 误报 `nested_events_not_persisted`；Plan §3.3 只把该原因用于“所选来源全部为 session-v3”。(2) P3-CR2-2：`_nested_partition` 对全部来源登记未确认的嵌套 toolResult 记录，`build_report` 的 tokens / 分组 `unconfirmed_sources` 按全部来源计数，把被生效 `duplicate_of` 取代的来源也计入；Plan §4.3“未确认分区下的分母”写明“被生效 `duplicate_of` 取代或被嵌套覆盖的来源属于已确认去重，不计入”。本任务只让实现符合现有 Plan，不改 Plan 规则、不新增需求。
- **修改范围**：
  - `dev_harness_budget.py`：(1) 批次级 `nested_executed` 以**全部选定来源**判定是否存在 `pi-json-events`（由 `build_report` 把该判定传入 `_count_metrics` / `_tool_counts`；逐来源调用仍以该来源自身为选定，行为不变）。选定来源全部为 session-v3 → `observed_total` null、`reasons` = `["nested_events_not_persisted"]`（不变）；已确认集合中有 json-events → 照旧计数；选定中有 json-events 但已确认集合中没有 → `observed_total` null、`reasons` = `["overlap_unconfirmed"]`，不用 `nested_events_not_persisted`。(2) `_nested_partition` 的未声明分支不为被生效 `duplicate_of` 取代（`partition.replaced`）或被生效嵌套链接覆盖（`partition.covered`）的来源登记未确认记录；`build_report` 计算 tokens / 分组 `unconfirmed_sources` 时排除这两类来源。tool_calls 的未确认来源计数、已知小计、完整总计与全部 loaded 且无未确认分区时的输出不变。
  - `dev_harness_budget_fixtures.py`：只在需要时新增三来源构造（见完成标准 2）。
  - `test_dev_harness_budget.py`：新增 `test_nested_executed_reason_uses_selection`（经 `main`，F5 `double_capture`）与 `test_unconfirmed_sources_exclude_replaced_and_covered`（经 `main`，参数化 `duplicate_replaced` / `nested_covered`）。若既有断言因此变化，须在本任务内改正并在 review.md 逐条列出改前 / 改后与理由，不得为通过而放宽。
- **完成标准**：
  1. 部分满足 AC-005-1（嵌套未暴露路径的原因部分）：`double_capture`（F5，P = session-v3、C = json-events，均 loaded）经 `main`：退出 0；批次 `tool_calls.nested_executed.observed_total` 为 null、`reasons` = `["overlap_unconfirmed"]`，整份 `report["tool_calls"]` 不含 `nested_events_not_persisted`；C 行 `sources[1].tool_calls.nested_executed` 的 `observed_total` = 0、`reasons` = `[]`；tokens `unconfirmed_sources.count` 仍为 2。
  2. 部分满足 AC-007-1 / AC-004-3（未确认来源计数部分）：`duplicate_replaced` = 三个 session-v3 来源，X（F1 主调用 170 + 一条带 usage 40 的 toolResult）、S（X 的逐字副本，`duplicate_of: X`，键集包含、链接生效）、O（F1 改会话 id，170，无嵌套），`all_nested_children_declared` 缺省。经 `main`：`observation.metrics.tokens.unconfirmed_sources` = `{"count": 1, "unit": "来源"}`，四维 `groups.<维度>.unconfirmed_sources.count` 均为 1，`tool_calls.unconfirmed_sources.count` 0；S 行 `replaced_by` = `"X"`、`unconfirmed_record_count` = 0，X 行 `unconfirmed_record_count` = 1；批次 `tokens.known_subtotal` = 340、完整总计 null、`tokens.reasons` 含 `nested_coverage_unverifiable`；`summary.md` 含“tokens：未确认去重来源 1 来源；tool_calls：0 来源；”。`nested_covered` = F8 `equal`（链接生效）：子来源 `token_covered_by` = `"P"`、`unconfirmed_record_count` = 0，tokens `unconfirmed_sources.count` = 0。
  3. （非 AC，Plan §1 / AGENTS §4）既有相关断言不变：F5 `double_capture` 的 `unconfirmed_sources` 2、F8 `undeclared` 父来源 `unconfirmed_record_count` 1、F12 nested sources（全部 session-v3）批次 `nested_executed.reasons` 仍为 `["nested_events_not_persisted"]`。
  4. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过（含 T-14 的全部 loaded 摘要哈希断言）。
  5. （非 AC，Plan §1 / AGENTS §4）后端全量回归不新增失败。基线为 Converge R5 实测 806 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 监听断言，不属本 feature。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_nested_executed_reason_uses_selection"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_unconfirmed_sources_exclude_replaced_and_covered"`
  3. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_unconfirmed_partition_denominators_unknown or test_nested_link_negative_cases or test_nested_views_dedup_and_direct_coverage"`
  4. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`
  5. `cd backend && python -m pytest tests/ -q`（与上述基线对比，只看是否新增失败）

### T-22 tool_calls 未确认来源数排除被取代来源（Converge R6 追加）

- **状态**：✅ 已实施，本任务验证命令全部通过（2026-10-31，openai/gpt-6-astra）
- **依赖**：T-21
- **估时**：0.5h
- **上下文**：Converge R6 在 `afb95c9` 复现（合成，经 `main`）：P = session-v3（1 条已知主尝试，末尾追加一行坏 JSON → `partial`）；X = session-v3，header `parentSession` 指向 P，复制 P 的 `p1` 条目并另有 1 条新 assistant；S = X 的逐字副本，`duplicate_of: X`（键集包含，链接生效，`replaced_by` = `X`）。X 与 S 都因血缘父 partial 记 `lineage_parent_unavailable`，进入来源级未确认分区。输出：tokens 与四维分组的 `unconfirmed_sources` = 2（P、X），tool_calls 的 `unconfirmed_sources` = 3（P、X、S），摘要为“tokens：未确认去重来源 2 来源；tool_calls：3 来源；”。Plan §4.3“未确认分区下的分母”末句写明“被生效 `duplicate_of` 取代或被嵌套覆盖的来源属于已确认去重，不计入”，该句同时约束 tokens 与 tool_calls；另外，tool_calls 只计来源级未确认，应是 tokens（来源级或记录级）的子集，现结果 3 > 2，与同段口径矛盾。T-21 只修了 tokens / 分组的计数（其修改范围写“tool_calls 的未确认来源计数不变”，当时没有覆盖这一情形）。本差距只影响披露计数：S 的记录本已因被取代不进聚合，P、X 仍在未确认分区，tool_calls 分母仍为 null；已知小计、完整总计与退出码不变。本任务只让实现符合现有 Plan，不改 Plan、不新增需求。
- **修改范围**：
  - `dev_harness_budget.py`：`build_report` 计算 `unconfirmed_tools` 时排除 `partition.replaced` 与 `partition.covered` 中的来源（与 T-21 对 `unconfirmed_tokens` 的条件相同）。逐来源事实（如来源行 `unconfirmed_reasons`）不变。
  - `test_dev_harness_budget.py`：在既有 `test_unconfirmed_sources_exclude_replaced_and_covered` 中增加参数 `replaced_lineage_partial`（构造见上下文，用既有夹具辅助函数内联写出），不新增测试名；AC 覆盖表不变（该测试名已在 AC-004-3 / AC-007-1 行）。
  - `dev_harness_budget_fixtures.py`：只在需要时修改。
- **完成标准**：
  1. 部分满足 AC-007-1（未确认来源计数部分）：`replaced_lineage_partial` 经 `main` 运行：退出码 3，stderr 为空；`relations[0]` 的 `effective` 为 true；S 行 `replaced_by` = `"X"`；`observation.metrics.tokens.unconfirmed_sources` 与 `observation.metrics.tool_calls.unconfirmed_sources` 均为 `{"count": 2, "unit": "来源"}`；四维 `groups.<维度>.unconfirmed_sources.count` 均为 2；`observation.metrics.tool_calls.denominator` 为 null；`summary.md` 含“tokens：未确认去重来源 2 来源；tool_calls：2 来源；”。`duplicate_replaced` / `nested_covered` 两个既有参数的断言不变。
  2. （非 AC，Plan §1 / AGENTS §4）本 feature 模块全部测试通过（含 T-14 全 loaded 摘要哈希、T-18、T-21 断言）。
  3. （非 AC，Plan §1 / AGENTS §4）后端全量回归不新增失败。基线为 Converge R6 实测 809 passed / 1 failed / 5 skipped，唯一失败是既有 netstat 监听断言，不属本 feature。
- **验证命令**：
  1. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k "test_unconfirmed_sources_exclude_replaced_and_covered"`
  2. `cd backend && python -m pytest tests/test_dev_harness_budget.py -q`
  3. `cd backend && python -m pytest tests/ -q`（与上述基线对比，只看是否新增失败）

## AC 覆盖表（27 条；映射 ≠ 通过）

| AC | 任务 | 测试 / 手动步骤（未来，未编写、未执行） |
|---|---|---|
| AC-001-1 | T-11 | `test_only_selected_sources_opened` |
| AC-001-2 | T-02 | `test_historical_records_same_semantics` |
| AC-001-3 | T-11 | `test_zero_model_and_network_attempts` |
| AC-001-4 | T-02、T-03、T-04、T-10、T-11 | `test_observation_failures_marked`、`test_stream_settled_tail_rule`、`test_selected_source_gap_blocks_full_total`、`test_exit_codes_separate_acquisition_from_coverage`、`test_existing_outputs_never_overwritten`、`test_write_failure_cleans_own_artifacts_only`、`test_no_effect_on_observed_work` |
| AC-002-1 | T-09 | `test_missing_dimensions_unknown_group` |
| AC-002-2 | T-09 | `test_annotation_origin_and_sources_untouched` |
| AC-002-3 | T-09、T-20 | `test_group_conservation_per_dimension`、`test_group_conservation_computed_not_asserted` |
| AC-003-1 | T-04 | `test_exclusive_dimensions_total_170` |
| AC-003-2 | T-02 | `test_subset_fields_and_unreconciled` |
| AC-003-3 | T-04、T-10 | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` |
| AC-003-4 | T-04、T-18 | `test_confirmed_zero_vs_placeholder`、`test_header_only_not_zero`、`test_selected_source_gap_blocks_full_total`、`test_entry_appended_usage_records_counted`、`test_unconfirmed_partition_denominators_unknown` |
| AC-004-1 | T-03、T-04 | `test_cumulative_snapshots_final_12`、`test_nonfinal_partial_lower_bound_10` |
| AC-004-2 | T-03 | `test_repeated_message_counted_once` |
| AC-004-3 | T-01、T-05、T-06、T-19、T-21 | `test_relation_graph_rejected`、`test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`、`test_relation_shapes_unsupported_retain_facts`、`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage`、`test_lineage_parent_unavailable_not_determined`、`test_unconfirmed_sources_exclude_replaced_and_covered` |
| AC-005-1 | T-07、T-16、T-17、T-21 | `test_tool_calls_separate_from_attempts`、`test_tool_identity_and_views`、`test_nested_execution_events_read_as_nested`、`test_nested_views_dedup_and_direct_coverage`、`test_nested_executed_reason_uses_selection` |
| AC-005-2 | T-07 | `test_retry_requires_explicit_association` |
| AC-005-3 | T-04、T-06、T-07 | `test_entry_appended_usage_records_counted`、`test_nested_link_negative_cases`、`test_attempt_states_and_operation_records`、`test_covered_and_unobserved_paths` |
| AC-005-4 | T-07 | `test_semantic_rework_annotation_only` |
| AC-006-1 | T-08 | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`、`test_timing_kept_for_unavailable_source` |
| AC-006-2 | T-08 | `test_timeout_known_duration_usage_unknown` |
| AC-007-1 | T-09、T-10、T-13、T-14、T-15、T-17、T-18、T-21 | `test_all_known_aggregation_normalized_facts`（D1）、`test_summary_contents_units_denominators`、`test_coverage_denominator_unknown_with_source_gaps`、`test_group_denominator_unknown_with_source_gaps`、`test_token_unknown_records_unknown_with_source_gaps`、`test_nested_views_dedup_and_direct_coverage`、`test_unconfirmed_partition_denominators_unknown`、`test_unconfirmed_sources_exclude_replaced_and_covered` |
| AC-007-2 | T-11、T-16 | `test_privacy_sentinels_absent`、`test_path_shaped_labels_rejected_not_echoed` |
| AC-007-3 | T-11 | `test_repo_state_unchanged` |
| AC-007-4 | T-10 | `test_comparability_flags_no_money` |
| AC-008-1 | T-12 | 手动步骤 1（已授权，修复任务完成后由协调者执行） |
| AC-008-2 | T-11 | `test_synthetic_categories_covered` |
| AC-008-3 | T-12 | 手动步骤 2（已授权，修复任务完成后由协调者执行） |

25 条由合成样例 / 受控边界验证（T-01～T-11、T-13～T-20），AC-008-1 / AC-008-3 依赖 T-12 真实试点（已授权，排在 T-16～T-20 之后）。r5 新增测试只加入既有行，仍为 27 行。r8：T-21 的两条测试只加入 AC-004-3 / AC-005-1 / AC-007-1 既有行，仍为 27 行；合成样例验证任务范围相应为 T-01～T-11、T-13～T-21。

## Checklist R2 新发现 P3 的承接（作者修订设计，待 A 复核；未实施，不是用户风险接受）

| R2 发现 | Plan r3 修订位置 | 承接任务 | 测试（未来） |
|---|---|---|---|
| P3-R2-1 | §3.4 第 6 层末句 | T-06 | `test_nested_link_negative_cases`（F8 flag=false + 未声明子） |
| P3-R2-2 | §3.3、§3.6、§5 | T-04、T-10 | `test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` |
| P3-R2-3 | §4.4（已按公开源码核实顺序）、§5 F2 | T-03、T-07 | `test_retry_requires_explicit_association` |
| P3-R2-4 | §4.2 收尾判据、§4.7 | T-03 | `test_stream_settled_tail_rule` |
| P3-R2-5 | §3.3 总量、§3.4 第 4 / 6 层 | T-02、T-05、T-06 | `test_subset_fields_and_unreconciled`、`test_lineage_net_new_before_nested_coverage` |

## Analyze R1 发现的承接（r4 作者修订，待 Analyze R2；未实施）

| Analyze 发现 | Plan r4 修订位置 | 承接任务 | 测试 / 命令（未来） |
|---|---|---|---|
| P2-AN-1 | §2、§3.2、§3.3、§3.6、§4.2、§4.3、§4.7、§5 F13、§6 | T-03（抽取）、T-04（计入 / 完整总计）、T-07（已覆盖 / 未观测）、T-11（隐私哨兵） | `test_entry_appended_usage_records_counted`、`test_covered_and_unobserved_paths`、`test_privacy_sentinels_absent` |
| P3-AN-1 | —（只涉 Tasks） | T-11 | 验证命令 10（`git grep --untracked`） |

## Review R1 发现的承接（r5 作者修订，待 Analyze R3 与独立 A Checklist R4；未实施）

| Review 发现 | Plan r5 修订位置 | 承接任务 | 测试 / 命令（未来） |
|---|---|---|---|
| P2-CR-1 | §2、§3.2、§3.3、§3.6、§4.2、§4.7、§5 F2 修正与 F14、§6 | T-16（读取、身份、F2 / F14、隐私）、T-17（视图、去重、判定、摘要） | `test_nested_execution_events_read_as_nested`、`test_privacy_sentinels_absent`、`test_nested_views_dedup_and_direct_coverage` |
| P3-CR-1 | §3.6、§4.3、§4.7 | T-18 | `test_unconfirmed_partition_denominators_unknown` |
| P3-CR-2 | §3.4 第 4 / 6 层、§3.6 | T-19 | `test_lineage_parent_unavailable_not_determined` |
| P3-CR-3 | §4.3 | T-20 | `test_group_conservation_computed_not_asserted` |

## Review R2 发现的承接（r8，不改 Plan 规则；未实施）

| Review 发现 | 依据的现有 Plan 规则 | 承接任务 | 测试（未来） |
|---|---|---|---|
| P3-CR2-1 | §3.3 嵌套身份、状态与去重（`nested_events_not_persisted` 只用于所选来源全部为 session-v3） | T-21 | `test_nested_executed_reason_uses_selection` |
| P3-CR2-2 | §4.3 未确认分区下的分母（被取代 / 被覆盖的来源不计入） | T-21 | `test_unconfirmed_sources_exclude_replaced_and_covered` |
| P3-R4-1 | —（只涉头部记录） | 本文件与 plan.md 输入清单 r6 / r7 行 | — |

## 阶段边界

- 下一步（r8，2026-10-31）：Implement T-21 → 协调者用同一份 35 段清单重跑试点 → Converge R6 → 独立 A Review R3 → Gate 2。下一条及其后是历史记录。

- 下一步（r5，2026-10-31）：对包含 Plan r5 / 本文件的新固定提交做只读 Analyze R3（报告写 `analyze-r3.md`，R1 / R2 原文保留）→ 独立 A Checklist R4（复核 r5 改动的规则）且全部勾选 → Implement T-16～T-20 → T-12 真实试点（协调者，已授权）→ Converge → 独立 A Review R2 → 本 feature Gate 2。有效 checklist（R4）全部勾选前不得开始 T-16。
- （历史，r4 时）对 Plan r4 的 Analyze R2 与 Checklist R3 已完成，见 review.md。
- 不新增人工 Plan 审批，不重复 Gate 1。Gate 2 只在真实实施、Converge 与独立 Review 之后。
- 需求变化回 Clarify 并重过 Gate 1，不直接改本文件偷跑。
