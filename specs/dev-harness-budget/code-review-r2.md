# Feature: dev-harness-budget v1 实施评审 R2（code-review-r2.md）

> Review 阶段产物（[workflow.md 第 10 步](../../docs/development/workflow.md#step-10)）：审核员 A 依 spec + plan + tasks + 真实代码差异评审，按 bug / 架构风险 / 测试缺口 / 目标对齐出结论。
> **本文件不是 Gate 2，不构成任何 AC 的验收**；27 条 spec AC 保持未勾选。接受与否由用户在 Gate 2 决定，确认后才进入 Handoff。

## 头部记录

- **轮次**：Review **R2**（复审 [Review R1](code-review-r1.md) 四项发现的修复 + 全量实现再审 + T-12 试点记录判定）。
- **固定提交**：`5aebb038ffa13f74f8a1b063c9130ebea8a6b677`（分离 Temp 工作树 `fai-docnav-20261030/budget-code-review-r2-tree`，`git rev-parse HEAD` 一致，开始与结束时 `git status --porcelain` 均为空）。真实 diff 范围 `f5dbf63..HEAD`（R1 审的是 `f5dbf63`）：代码只改 3 个既有文件（工具 +115/−28、测试 +233/−2、夹具 +49/−6），其余为本 feature 文档与 HANDOFF / specs/README 状态行。
- **审核员 A**：`claude-fable-5-1 via claude-bridge`（[model-routing.md](../../docs/development/model-routing.md) 审核员 A 行首选模型 + 首选通道；协调者派工前最小真实调用成功，为协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置。
- **独立性披露（规则 3 / 7）**：新开会话，上下文中没有实施者、Plan / Tasks / Analyze / Converge 作者或协调者的会话内容。实施者 = `openai/gpt-6-astra`，Plan / Tasks / Analyze / Converge = `claude-opus-5-5`，均与本会话模型不同。只读审查固定提交与真实 diff；本会话唯一写入 = 新建本文件；无 Git 写操作、未联网、未安装、未派工；未读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据，T-12 只依 review.md 的脱敏记录判定。pi 1.4.0 公开安装包只做有界只读核实（`grep parentToolCallId` + 三个 js 文件哈希前缀），未打开任何 pi `.md`。合成复现脚本与数据放在系统 Temp 两个独立目录，用 `python -I` 运行，结束后删除。
- **结论约束（规则 6）**：本轮结论即审核结论，即使未通过也是最终结论；不为求通过换模型，无投票或共识。
- **日期**：2026-10-31。

输入清单（路径 @ 提交或 blob + 适用章节）：

```
AGENTS.md @ 5aebb03（blob ee8e4ab）全文
docs/development/workflow.md @ 5aebb03（blob 4aca344）全文（重点第 8～11 步、Review 判定规则、Gate 2）
docs/development/model-routing.md @ 5aebb03（blob f980f5c）全文
backend/README.md @ 5aebb03（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ 5aebb03（blob 4689093）全文；锚定 ^## 1\. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致；27 条 AC 均未勾选）
specs/dev-harness-budget/plan.md @ 5aebb03（blob 175fc2e，r7）全文（408 行，分 3 段）
specs/dev-harness-budget/tasks.md @ 5aebb03（blob 72db104）全文（496 行，分 2 段）
specs/dev-harness-budget/checklist.md @ 5aebb03（blob 3e7a7d6，Checklist R4，23/23）全文
specs/dev-harness-budget/analyze-r5.md @ 5aebb03（blob 45c4e77）全文
specs/dev-harness-budget/converge-r5.md @ 5aebb03（blob cf3d072，当前有效 Converge）全文
specs/dev-harness-budget/code-review-r1.md @ 5aebb03（blob 2272b21）全文
specs/dev-harness-budget/review.md @ 5aebb03（blob e86f1e2）自“Review R1”节至文末（含“用户对 Review R1 的处置与试点授权”“第 8 批”“T-12 真实试点记录”“Converge R5”）
真实 diff：git diff --stat f5dbf63..HEAD（15 文件）；git diff f5dbf63..HEAD -- backend 三个文件全文逐行阅读；git log 5aebb03 近 8 提交
backend/tools/dev_harness_budget.py @ 5aebb03（blob e6b43e0）全文 1832 行（分 4 段）
backend/tests/test_dev_harness_budget.py @ 5aebb03（blob a6ab411）diff 全文 + 定向检索（test_header_only_not_zero、no_usage_records_observed）
backend/tests/dev_harness_budget_fixtures.py @ 5aebb03（blob 0d11992）全文 459 行
pi-coding-agent 1.4.0 公开安装包（非本仓库，有界只读）：dist/core/nested-tool-calls.js（sha256 前缀 62a69500，与 plan §7 r5 一致）5 / 116 / 144 / 163 行；
  dist/core/agent-session.js 325–415 行 parentToolCallId 出现点；pi-agent-core dist/agent-loop.js（22ee81f9）无 parentToolCallId；dist/modes/json-event.js（5f375647）
```

## 结论（R2）

**通过**：P1 = 0，**P2 = 0**，P3 = 2。

- Review R1 的 P2-CR-1、P3-CR-1、P3-CR-2、P3-CR-3 **全部 CLOSED**（逐项证据见下表；R1 的复现形状已重跑）。
- 新发现 2 项 P3，都是披露层面的原因标签 / 计数失真，不产生虚假的已知小计、完整总计、覆盖率或退出码，可在 Gate 2 接受为后续任务。
- 未发现修复引入的回归：T-13～T-15 行为（含 T-14 全 loaded 摘要哈希断言）、隐私哨兵（新增 `parentToolCallId` 哨兵）、退出码 0 / 3 / 2 / 1、`duplicate_of` / 嵌套覆盖 / 血缘的 token 归属、完整总计三条件均保持；本轮实跑模块测试 **353 passed**（6.34 s）。
- **T-12 / AC-008-1 / AC-008-3**：依 review.md 的脱敏记录，tasks.md T-12 两条完成标准的文字要求**均满足**，记录中未见私有路径、会话 ID、提示词或报告原文；一处需用户在 Gate 2 确认的范围解释见“T-12 判定”节。本评审不接受任何 AC。

**本结论的含义**：按 workflow 第 10 步判定规则，仅 P3 = 通过。P3 是否修复或接受、AC-008-1 / AC-008-3 是否认可，由用户在 Gate 2 决定；本文件不授权 Handoff、PR / merge，也不改变 27 条 AC 的未勾选状态。

## Review R1 发现的关闭判定

| R1 发现 | 状态 | 证据（本会话实跑，固定提交 5aebb03） |
|---|---|---|
| P2-CR-1 嵌套执行事件（`parentToolCallId`）被计为 direct、tool_calls 标 complete、覆盖 100% | **CLOSED** | 代码：`_read_pi_json_events` 把 `parentToolCallId` 为非空字符串的 `tool_execution_start` / `end` 分派到 `_nested_event`（`backend/tools/dev_harness_budget.py:714`），记为 `NestedExecutionRecord`，不进 `tools`，不参与 proposed_only 匹配；父只在同一 owner 作用域解析，direct 恰一条优先，其次已解析嵌套子 id 恰一条，否则 `nested_parent_unresolved` 仍为嵌套；`call_ref` 与 `_nested` 对 `nestedCalls` 记录的构造一致。`_tool_counts` 新增 `nested_executed` / `nested_deduplicated`，direct 计数、分母、覆盖率只含 `tools`；`all_total` 在任何嵌套证据下 unknown。复现（R1 形状 = F14 (a)，经 `main`）：`direct={finished:1, observed_total:1}`，`nested_executed.observed_total=2`，`nested_deduplicated={2,2,0,0}`，tool_calls complete、分母 1 / 100%；R1 时的 direct 3 不再出现。源码核实：`nested-tool-calls.js` 116 / 144 / 163 行三类事件带 `parentToolCallId`，`agent-loop.js` 中模型发起调用的事件不带该字段，与实现的分派条件一致。夹具 F2 改为真实形状，F14 (a)～(f) 覆盖多层 / 父未解析 / 256 上限 / 并行 / 两轮复用；旧流 F12 各例 `nested_executions` 为空且 direct 计数不变有断言 |
| P3-CR-1 全部 loaded 但未确认去重时“分母 0 / 缺失 0”、误用 `no_usage_records_observed` | **CLOSED** | `build_report` 计算 `unconfirmed_tokens` / `unconfirmed_tools`，`_observation` 与 `_groups` 在未确认 > 0 时分母 / 缺失 / 覆盖率为 null 并另列 `unconfirmed_sources`（单位“来源”）；`_aggregate_tokens` 空集改记 `no_confirmed_records`，`no_usage_records_observed` 只经 `_source_gaps` 给 `empty` 来源。复现（F5 同会话双采集，均 loaded）：退出 0、`sources=ok`，tokens 分母 / 缺失 None、`unconfirmed_sources` 2，reasons = `no_confirmed_records, overlap_unconfirmed, same_session_unconfirmed`，整份报告无 `no_usage_records_observed` |
| P3-CR-2 血缘父已选入但不可用时子来源仍 `net_new_determined: true` | **CLOSED** | `_lineage_partition` 在形状检查后判父状态：非 `loaded` → 不做键集差，`lineage_parent_unavailable`、`net_new_determined: false`、`copied_entry_count: null`；父 `partial` 时父子入未确认分区。`sources[]` 对所有 `net_new_determined is False` 情形把复制件数 / 净新增数置 null，摘要显示“未知”。复现（父文件缺失）：退出 3，子来源 `lineage={parent:P, net_new_determined:false, copied_entry_count:null, reason:lineage_parent_unavailable}`，复制件 / 净新增 null，子 180 = 批次 180，不再出现“复制件由血缘父计” |
| P3-CR-3 `_groups` 用生产 `assert` 守恒 | **CLOSED** | `grep -c assert` 生产模块 = 0；`conserved` 为计算值，`build_report` 先算 groups 再算 observation，任一维 false → `group_conservation_failed`、完整总计 unknown、tokens complete → partial；`test_group_conservation_computed_not_asserted` 用 AST 守卫。失败分支按构造不可达，未对私有函数打桩（符合 AGENTS §5.6） |

T-16 / T-19 要求记录的既有断言改正，diff 中只有 `parent_not_selected` 与 `lineage_conflict` 两处 `copied_record_count == 0` 改为 `is None`（并新增净新增 null 断言），`double_capture` 保持 `== 0`；与 review.md“第 8 批”所列一致，未放宽任何计数断言。

## 审核发现（R2，新发现）

### P3-CR2-1 已确认集合中没有 json-events 来源时，`nested_executed` 给出错误原因 `nested_events_not_persisted`

- **位置**：`_tool_counts`（`backend/tools/dev_harness_budget.py:1076`～`1080`）：`observed_total` 与 `reasons` 以 `any(f.format == "pi-json-events" for f in facts)` 判定，而此处的 `facts` 是 `build_report` 传入的 `count_facts`（只含已确认来源）。
- **复现（合成，经 `main`）**：F5 同会话双采集（P = session-v3，C = json-events，均 loaded，均进入未确认分区）。输出 `tool_calls.nested_executed = {…, observed_total: null, reasons: ["nested_events_not_persisted"]}`，而选定来源中明明有一个 json-events 来源。
- **问题**：Plan §3.3 规定 `nested_events_not_persisted` 只用于“所选来源全部为 session-v3”；这里的真实原因是该 json-events 来源落入未确认分区（`same_session_unconfirmed`）。原因标签陈述了一个不成立的事实，与 R1 P3-CR-1 的“原因误用”同类。数值方向保守（unknown），`scope` 字段写明“已确认去重的 pi-json-events 来源”，故为 P3。Converge R5 观察 1 已注意到此情形但未处理。
- **修复方向**：用全部选定来源判定“是否存在 json-events”；已确认集合中没有 json-events 但选定中有时，reasons 改为 `overlap_unconfirmed`（或该来源的未确认原因），不用 `nested_events_not_persisted`。只改 `_tool_counts` 的两处表达式与一条测试断言，不改 Plan 规则。

### P3-CR2-2 `unconfirmed_sources`（tokens / 分组）把已被生效 `duplicate_of` 取代的来源也计入

- **位置**：`_nested_partition`（`backend/tools/dev_harness_budget.py:1530`～`1533`）对 `partition.net` 的**全部**来源登记 `tool_nested` 记录为 `uncertain_records`；`build_report`（`:949`）按 `uncertain[sid] or uncertain_records[sid]` 对所有 `by_id` 计数，未排除 `partition.replaced` / `partition.covered`。
- **复现（合成，经 `main`）**：三个 session-v3 来源：X（含一条带 usage 的 toolResult）、S `duplicate_of` X（键集被包含，链接生效，`replaced_by = X`）、O（无嵌套）；多来源且 `all_nested_children_declared` 缺省为 false。输出 `observation.metrics.tokens.unconfirmed_sources = {count: 2}`、各维 `groups.*.unconfirmed_sources.count = 2`，S 行 `unconfirmed_record_count = 1` 且 `replaced_by = "X"`。按 Plan §4.3“被生效 `duplicate_of` 取代或被嵌套覆盖的来源属于已确认去重，不计入”，应为 1。
- **问题**：只影响披露计数（多报 1 个来源）；S 的记录本就因被取代不进已知小计，X 自身也带 `nested_coverage_unverifiable`，所以完整总计、已知小计、分母 null 的结论都不变。P3。
- **修复方向**：`_nested_partition` 跳过 `partition.replaced` 中的来源（或 `build_report` 计数时排除 `replaced` / `covered` 的 sid）；补一条三来源断言。不改 Plan。

## 已核对、未发现问题的要点（有界结论，不是 AC 验收）

- **嵌套身份与边界**：多层（孙调用父 = 子 id）继承顶层 root；同一 owner 内 direct 父 id 复用（两条候选）→ `nested_parent_unresolved`、tool_calls partial、direct 仍按两次计（本会话复现：direct 2、嵌套 observed 1 / unresolved 1、去重后 2）；嵌套 end 落到下一条 assistant `message_end` 之后 → 新作用域 terminal_only + 父未解析（复现：finished 1 / unfinished 1 / terminal_only 1，reasons 含 `nested_execution_incomplete`、`nested_parent_unresolved`），方向保守，与 Checklist R4 观察 2 一致。`tool_execution_update` 不进入任何分支；`parentToolCallId` 只在 `_nested_event` 局部使用，`NestedExecutionRecord` 只存哈希与状态，`records.json` 不含嵌套。
- **token 口径未变**：嵌套 `tool_execution_end.result.usage`（夹具 999）不读；F14 (a) 已知小计 345 由测试守卫；父 toolResult usage 仍作一条操作记录。
- **未确认分区下的分母**：tokens / tool_calls 覆盖行、分组节、token 节在来源缺口**或**未确认分区下统一“未知”，`covered` 与已知小计照常；全部 loaded 且无未确认时输出逐字不变（T-14 哈希断言仍过）。tool_calls 只按来源级未确认计数（F8 `undeclared`：tokens 1 / tool_calls 0、分母 1），与 Plan §4.3 一致。
- **空集原因**：批次已确认集合为空 → `no_confirmed_records`；单来源只有 header 时批次 reasons = `no_confirmed_records, no_usage_records_observed`（前者是批次空集、后者是来源采集缺口，Plan §4.3 两段分别要求，不矛盾）；逐来源聚合对 `empty` / `unavailable` 不追加空集原因。
- **血缘**：父 `partial` → 父子入未确认分区、批次已知小计 null、“未完全去重”；父 `unavailable` / `empty` → 子全部记录留在已确认总体、完整总计因缺口 unknown；`lineage_usage_conflict` 与 `relation_shape_unsupported` 情形复制件 / 净新增 null；无血缘来源仍 0 / 全部；`_nested_failure` 对 `net_new_determined is False` 的子判 `nested_coverage_unverifiable`。
- **退出码与四层状态**：未改；复现中双采集退出 0 + `sources=ok` 同时分母未知，符合 §4.7 四层分列。
- **隐私**：`privacy_rows` 把 `parentToolCallId` 换为哨兵并断言输出不含；F14 / F2 测试断言输出不含 `parentToolCallId`、`toolCallId`、原始 id；`reasons` 只追加固定字符串；错误类别未变。
- **范围与工程准则**：改动只在 3 个既有文件；`git grep --untracked` 无产品包导入；无新依赖（测试用标准库 `ast`）；`_nested_event` 与 `_tool_event` 对称、代表可命名概念，无投机性复杂度；测试经公开接口、字面量期望、替身只在声明边界。
- **夹具真实性**：F2 / F14 事件顺序与 pi 1.4.0 `agent-loop.js` 顺序 / 并行执行路径及 `nested-tool-calls.js` 的 `parentToolCallId` 赋值一致；F14 nested `tool_execution_end` 带 `result` 与源码 157–165 行一致。

## T-12 / AC-008-1 / AC-008-3 判定（只依 review.md 脱敏记录 + Git 历史）

| tasks.md T-12 要求 | 记录 | 判定 |
|---|---|---|
| 经用户显式授权的真实批次 | 用户原话“全修，T-12同批完成，授权脱敏”；范围 = Temp 下本功能子会话的 `budget-*.jsonl` / `review-budget-*.jsonl`，不含协调者会话、`~/.pi`、其他项目、私有目录 | 满足。**需用户在 Gate 2 确认一点**：授权时 27 段，实跑 35 段；“修复循环新生成的同类捕获同属授权范围”是协调者在授权记录中写下的解释，不是用户原话 |
| 生成报告、不新增模型调用、不重跑任务 | 退出 3，`sources=gaps loaded=33 partial=2 …; metrics_complete=1/6; overall_observation=incomplete`，stderr 空；“报告本身不发起模型或网络调用，未为测量重跑任何任务” | 满足（离线性由 AC-001-3 的审计钩子测试证明） |
| 写明“仅证明可用、非基线、不证明节省” | “仅证明工具对真实开发批次可用；不是统计上充分的基线，也不证明任何节省” | 满足 |
| 使用修复后的最终代码 | 基线 `a868d25`；本会话核对 `git diff --stat a868d25..HEAD` 只有 converge-r5.md / review.md / tasks.md，三个代码文件 blob 未变 | 满足 |
| AC-008-3 前后核对一致、顺序“前 → 报告 → 后 → 写记录” | 记录写明两次 `git hash-object` + `git status` 一致，记录在“后”核对之后写入。本会话独立佐证：spec blob `4689093`、checklist blob `3e7a7d6` 在 `a868d25` 与 HEAD 相同 | 满足。记录中的“状态摘要 SHA256”未写构造方式，无法逐字复算，但 Git 历史独立支持结论 |
| 写明不构成该 feature 验收、不依赖 desktop-shell / WI | 两句均在 | 满足 |
| 脱敏：无私有路径、会话 ID、提示词、报告原文 | 本会话对该节做盘符 / `Users` / `AppData` / `tmp` / UUID 形 / `.jsonl` 检索，唯一命中是授权文件名模式本身；内容只有计数、状态、原因类别、阶段名与模型 / 通道名 | 满足 |

试点发现（OpenAI 通道 cacheWrite 恒 0 → Implement 阶段 208 条记录为 unknown、按阶段分组 Implement 已知小计未知）属已接受的保守口径（AC-003-4），不是代码缺陷；若要计入须由用户提供带出处的 `confirmed_zero` 规则。以上判定只说明记录满足 tasks.md 写明的标准，**AC-008-1 / AC-008-3 是否接受是用户的 Gate 2 决定**。

## 非阻塞观察（不是发现）

1. 同一条未解析嵌套执行的 start 与 end 各追加一次 `nested_parent_unresolved`（测试按 2 次断言），原因列表重复，不影响计数。
2. F14 每轮以 `agent_start` 开头而无对应 `agent_end`，与真实单次 agent run 内多轮的形状略有差别；读取器只把它当运行活动，不影响断言。
3. Checklist R4 的 P3-R4-1（plan / tasks 头部输入清单缺 r6 / r7 行）与 review.md 头部“当前状态”滞后仍未处理；过程记录缺口，不影响代码。
4. 峰值行“参与记录数 / 尝试总数”措辞（Converge R3～R5 观察）未变；改措辞须先过 Plan。
5. 后端全量回归本会话**未重跑**（时间预算内优先完成代码审查与复现）；Converge R5 实测 806 passed / 1 failed / 5 skipped、唯一失败为既有 netstat 基线，本轮未改代码，不另声称。

## 本会话实际运行的命令与结果

- `git rev-parse HEAD` = `5aebb038ffa13f74f8a1b063c9130ebea8a6b677`；`git status --porcelain` 开始与结束均为空（结束时仅多出本文件）；`git diff --stat f5dbf63..HEAD` 15 文件 +1503/−162；`git ls-tree HEAD` 取得输入清单 blob。
- 冻结 spec 正文 SHA256（`awk '/^## 1\./{p=1} p' | sha256sum`）= `a504fed8…e823`，一致。
- `cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → **353 passed**（6.34 s）。
- `grep -c assert backend/tools/dev_harness_budget.py` = 0；`git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出。
- 合成复现（`python -I`，脚本与数据分放系统 Temp 两个目录，经公开接口 `main`，结束后删除；不读任何真实数据）：(1) F14 (a) = R1 P2 形状 → direct 1 / complete / 分母 1；(2) F5 双采集 → P3-CR-1 关闭证据 + P3-CR2-1 输出；(3) F5 父缺失 → P3-CR-2 关闭证据；(4) X / S dup_of X / O 三来源 → P3-CR2-2 输出；(5) 嵌套 end 跨 owner；(6) direct 父 id 同作用域复用 + 嵌套；(7) 单来源只有 header 的批次 reasons 与摘要行；(8) F1 分组 `(未知)` 组。
- T-12 佐证：`git diff --stat a868d25..HEAD`；`git rev-parse a868d25:<spec|checklist> HEAD:<spec|checklist>` 相同；review.md 485–500 行私有信息形态检索。
- pi 1.4.0 公开包有界核实：`grep -rn parentToolCallId` 于 nested-tool-calls.js / agent-session.js / agent-loop.js；三个 js 的 sha256 前缀（62a69500 / 22ee81f9 / 5f375647）与 plan §7 r5 记录一致。

## 处置与边界

- 结论**通过**（0 P1 / 0 P2 / 2 P3）。P3-CR2-1 / P3-CR2-2 可由用户在 Gate 2 接受为后续任务或要求修复；两者都只改 `dev_harness_budget.py` 的计数 / 原因表达式与对应断言，不需回 Plan 或 Clarify。
- T-12 记录满足 tasks.md 写明的标准；27→35 段的范围解释请用户在 Gate 2 明示确认。
- 本文件不是 Gate 2，不授权 Handoff、PR / merge，不勾选、不接受任何 AC。
