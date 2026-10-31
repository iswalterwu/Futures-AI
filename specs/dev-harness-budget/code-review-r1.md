# Feature: dev-harness-budget v1 实施评审 R1（code-review-r1.md）

> Review 阶段产物（[workflow.md 第 10 步](../../docs/development/workflow.md#step-10)）：审核员 A 依 spec + plan + tasks + 真实代码差异评审，按 bug / 架构风险 / 测试缺口 / 目标对齐出结论。
> **本文件不是 Gate 2，不构成任何 AC 的验收**；27 条 spec AC 保持未勾选。结论须由用户在 Gate 2 确认后才进入 Handoff。

## 头部记录

- **轮次**：Review **R1**（本 feature 首轮实施评审）。
- **固定提交**：`f5dbf6390aeacc7a7fc40f931f60ab6aec218aac`（分离 Temp 工作树 `fai-docnav-20261030/budget-code-review-tree`，`git rev-parse HEAD` 一致，开始时 `git status --short` 为空）。真实 diff 范围 `7bd2e5b..HEAD`：代码只有 3 个新文件 + `backend/README.md` 工具表 1 行，其余为本 feature 的 tasks / review / converge 文档。
- **审核员 A**：`claude-fable-5-1 via claude-bridge`（[model-routing.md](../../docs/development/model-routing.md) 审核员 A 行首选模型 + 首选通道；协调者派工前最小真实调用成功，为协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置。
- **独立性披露（规则 3 / 7）**：新开会话，上下文中没有实施者、Plan / Tasks / Analyze / Converge 作者或协调者的会话内容。实施者 = `openai/gpt-6-astra`，Plan / Tasks / Analyze / Converge = `claude-opus-5-5`，均与本会话模型不同。只读审查固定提交与真实 diff；本会话唯一写入 = 新建本文件；无 Git 写操作、未联网、未安装、未派工；未读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。pi 1.4.0 公开安装包只做有界只读核实（见输入清单）。合成复现脚本放在系统 Temp，结束后删除。
- **结论约束（规则 6）**：本轮结论即审核结论，即使未通过也是最终结论；不为求通过换模型，无投票或共识。
- **日期**：2026-10-31。

输入清单（路径 @ 提交或 blob + 适用章节）：

```
AGENTS.md @ f5dbf63（blob ee8e4ab）全文
docs/development/workflow.md @ f5dbf63（blob 4aca344）全文（重点第 8～11 步、Review 判定规则、Gate 2）
docs/development/model-routing.md @ f5dbf63（blob f980f5c）全文
backend/README.md @ f5dbf63（blob fcc2619）全文 + git diff 7bd2e5b..HEAD（+1 行）
specs/dev-harness-budget/spec.md @ f5dbf63（blob 4689093）全文；锚定 ^## 1\. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致；27 条 AC 均未勾选）
specs/dev-harness-budget/plan.md @ f5dbf63（blob 9c1c8bc，r4）全文（345 行，分 2 段）
specs/dev-harness-budget/tasks.md @ f5dbf63（blob a474f2b）全文（393 行，分 2 段）
specs/dev-harness-budget/checklist.md @ f5dbf63（blob 04fe4b1，Checklist R3，23/23）全文
specs/dev-harness-budget/analyze-r2.md @ f5dbf63（blob b96ddab）全文
specs/dev-harness-budget/converge.md（4c42339）、converge-r2.md（2f2889a）、converge-r3.md（bcf7e4a）、converge-r4.md（38b87a3，当前有效：已收敛）@ f5dbf63 全文
specs/dev-harness-budget/review.md @ f5dbf63（blob c054a9c）“Implement”节至文末
真实 diff：git diff --stat 7bd2e5b..HEAD（10 文件，+4885/−6）；git log 7bd2e5b..HEAD（11 提交）
backend/tools/dev_harness_budget.py @ f5dbf63（blob 3d81548）全文 1745 行（分 3 段）
backend/tests/test_dev_harness_budget.py @ f5dbf63（blob 3f9025a）全文 1901 行（分 3 段）
backend/tests/dev_harness_budget_fixtures.py @ f5dbf63（blob ee1318c）全文 416 行
pi-coding-agent 1.4.0 公开安装包（非本仓库，有界只读）：docs/json.md 全文（226 行）；dist/modes/json-event.js 全文；dist/modes/print-mode.js 75–110；
  dist/core/agent-session.js 380–415、405–415、649–660、683–706、3050–3068、3238–3248 及 `_emit({ type: … })` 发射类型枚举；
  dist/core/nested-tool-calls.js 16–21、95–170；docs/message-types.md 165–200（NestedToolCalls / NestedToolCallRecord）
pi-agent-core 1.4.0：dist/agent-loop.js 40–70、110–130、265–345、670–685；dist/agent.js 360–392（handleRunFailure）
```

## 结论（R1）

**未通过**：P1 = 0，**P2 = 1**，P3 = 3。

- P2-CR-1：pi 1.4.0 真实事件形状下，工具内嵌套调用（`ctx.executeTool()`）的 `tool_execution_*` 事件带 `parentToolCallId` 进入同一 json 流，读取器把它们计为 **direct** 工具调用，`direct` 计数虚高、`tool_calls` 度量仍标 complete、覆盖率 100%（AC-005-1 / AC-007-1）。
- 其余三项为 P3（措辞 / 原因类别 / 生产断言），可作后续任务。

本轮**实际运行**：`cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → **319 passed**（5.55 s）。另用合成输入经公开接口 / `main` 做了 5 组定向复现（见各发现），均在系统 Temp 中进行。未重跑后端全量回归（Converge R4 已实测 772 / 1 / 5，唯一失败为既有 netstat 基线；本轮未改代码，不另声称）。

**T-12 / AC-008-1 / AC-008-3**：真实试点仍外部阻塞（用户未显式选定并授权文件）。这不是代码缺陷，但这两条 AC **本轮不予接受**；本评审只针对 T-01～T-11、T-13～T-15 的离线实现。

**本结论的含义**：存在 P2 即未通过（workflow 第 10 步判定规则）。按 Gate 2 规则，由用户确认处置（修复 P2 后重开 Review；P3 可接受为后续任务）。本文件不授权 Handoff、PR / merge 或真实试点，也不改变 27 条 AC 的未勾选状态。

## 审核发现

### P2-CR-1 嵌套工具执行事件（`parentToolCallId`）被计为 direct 工具调用，计数虚高且标 complete

- **位置**：`backend/tools/dev_harness_budget.py` `_tool_event`（`backend/tools/dev_harness_budget.py:765`）与 `_read_pi_json_events` 的 `tool_execution_start` / `tool_execution_end` 分支；`_tool_counts`（同文件 996 行）；白名单 `§4.2` 未含 `parentToolCallId`。
- **事实依据（pi 1.4.0 公开源码，只读）**：`dist/core/nested-tool-calls.js` 111–163：工具通过 `ctx.executeTool()` 发起的嵌套调用，id 为 `<callerId>/<n>`，其 `tool_execution_start` / `tool_execution_update` / `tool_execution_end` 均带 `parentToolCallId: callerId`，经 `host.emit` → `agent-session.js` 412 `this._emit(event)` 进入同一会话事件流；`print-mode.js` 84–87 逐条写出，`json-event.js` 只改写 `message_update`，因此这些事件原样进入 `pi --mode json` 捕获。同时父调用的 toolResult `nestedCalls.calls[].id` 记录的正是同一批 `<callerId>/<n>`（`nested-tool-calls.js` 16–21 `recorder.start` 记 `toolCall.id`）。嵌套结果不持久化为 toolResult 消息（源码注释“Nested results are not persisted”），只在父结果的 `nestedCalls` 中出现。pi-codemode 随本 pi 安装包一起分发，这不是理论路径。
- **缺陷**：读取器不读 `parentToolCallId`，把每个嵌套执行事件按 `(owner, toolCallId)` 身份追加为一条 **direct** 调用（owner = 最近一条 assistant `message_end`），再把父 toolResult 的 `nestedCalls` 计入 `nested_reported`。同一批嵌套调用被 direct 视图“按执行证据”计了一次、又被 nested 视图计了一次；摘要写“两视图不相加”，但 direct 已经含嵌套。
- **复现（合成 1.4.0 形状流，经 `main`）**：1 条 assistant `toolUse` 发起 `call_1`，`call_1` 内嵌套 `call_1/1`、`call_1/2`（各带 `parentToolCallId`），父 toolResult `nestedCalls` 列出这两条且 `complete: true`，随后第二次 assistant `stop`，`agent_settled`。实际输出：

  ```
  tool_calls.direct = {finished: 3, unfinished: 0, terminal_only: 0, observed_total: 3}
  tool_calls.nested_reported.observed_total = 2
  tool_calls.status = "complete", reasons = []
  observation.metrics.tool_calls: denominator 3, covered 3, missing 0, coverage_percent 100.0
  summary: "| tool_calls | complete | 来源内调用身份 | 选定且已确认去重的 direct 视图 | 3 | 3 | 0 | 100% | 无 |"
           "工具 direct：3；仅提议：0；nested_reported：2；两视图不相加；全部总数：未知。"
  ```

  真实的模型发起（direct）调用只有 1 条；`all_total` 虽为 unknown（`nested_overlap_unresolved`），但 direct 计数 3 是错误的精确值，`tool_calls` 度量被标为 complete、覆盖 100%。
- **与 spec / plan 的关系**：spec AC-005-1 要求“来源暴露的嵌套工具调用按其标识纳入并去重”；本来源**已暴露**嵌套身份（`parentToolCallId` + `<callerId>/<n>`），实现既未去重也未与 direct 分开。AC-007-1 要求覆盖计数依据声明的总体——“direct 视图”的分母被嵌套执行污染。Plan §3.2 / §3.3 只写了 `tool_execution_start / end` 与 `nestedCalls`，没有覆盖同流嵌套执行事件（Plan §3.3 的“nested id 与子会话直接调用 id 没有可靠对应”讲的是跨来源子会话，不是本情形）。因此这是 Plan 的真实形状盲点在实现中的体现，不是需求变更，不需回 Clarify；需按 Plan §1 / §6 先修 Plan 再改实现。
- **为何测试未发现**：夹具 F2 / F12 在 toolResult 上写了 `nestedCalls`，但流中没有对应的嵌套 `tool_execution_*` 事件；1.4.0 中 `nestedCalls` 只在发生嵌套执行时填充，而嵌套执行必然发事件，所以夹具与 1.4.0 形状不一致，`test_tool_identity_and_views("nested_partial")` 等断言的 direct 数只在这种不一致的输入下成立。
- **修复方向（最小）**：在 `_tool_event` 白名单中增读 `parentToolCallId`（与 `toolCallId` 同样只做哈希、不输出）；带父 id 的执行事件归入独立的 `nested_executed` 视图（或按父调用身份 + 子 id 与该父 toolResult 的 `nestedCalls` 记录去重），**不计入 direct**；direct 的 complete 判据不变。Plan §3.2 / §3.3 / §4.2 对应补一行，夹具 F2 / F12 / F13 按真实次序补嵌套事件，新增断言“direct = 模型发起调用数、nested 视图单列、无 `parentToolCallId` 的旧流行为不变”。不新增依赖或格式。

### P3-CR-1 全部 loaded 但去重未确认时，tokens 覆盖行给出“分母 0 / 缺失 0”，并附错误原因 `no_usage_records_observed`

- **位置**：`_aggregate_tokens`（`backend/tools/dev_harness_budget.py:1261`）与 `_observation`（tokens 分母取 `tokens["record_count"]`）。
- **复现**：同一会话的 session-v3 文件 + json 捕获各 1 条已知主尝试（170），均 loaded，无 `duplicate_of`。输出：`| tokens | partial | … | 0 | 0 | 0 | 未知 | no_usage_records_observed, overlap_unconfirmed, same_session_unconfirmed |`，token 节“分母 0”，分组节“分母 0”。
- **问题**：实际观测到 2 条归属记录（逐来源行已列出），`no_usage_records_observed` 在 Plan §4.3 / §4.7 中专指 `empty` 来源（“观测到的归属记录 0 条”），此处属误用；“缺失 0”在未去重情形下与 Converge R1～R3 反复清理的空真口径同形。Converge R4 把“分母 0”判为符合 Plan 对“已确认去重总体”的定义，本轮同意数值定义成立，但原因类别是错的，且用户读到的仍是“缺失 0”。不产生虚假完整总计（`complete_total` 为 unknown），故为 P3。
- **修复方向**：区分“已确认集合为空”（如 `no_confirmed_records`）与“来源无归属记录”；`uncertain` 为真时 tokens / tool_calls 与分组节的分母、缺失按 T-13 / T-14 同样置为未知。只改聚合 / 渲染，不改 Plan 语义。

### P3-CR-2 血缘父已选入但不可用 / 部分时，子来源仍标 `net_new_determined: true`、“复制件由血缘父计”

- **位置**：`_lineage_partition`（`backend/tools/dev_harness_budget.py:1393`）：只在 `sid in unsupported or target in unsupported` 时跳过，不检查父来源状态。
- **复现**：子 header `parentSession` 指向已选入但文件缺失的 P。输出子来源 `lineage = {parent: "P", net_new_determined: true, copied_entry_count: 0, note: "复制件由血缘父计。"}`，子 180 全部按净新增计入已知小计。
- **问题**：父文件缺失 / 截断时，哪些条目是复制件无法判定，“由血缘父计”不成立（父未计任何东西）。数值上不会重复计（父不贡献记录），完整总计也已因 `source_missing` 为 unknown，所以只是披露失真；但 `nested_of` 的 (d) 前提依赖 `net_new_determined`，这里靠 `_nested_failure` 的“成员均 loaded”前置兜住，属偶然而非设计。
- **修复方向**：父来源非 `loaded` 时不做键集差，标 `lineage_parent_unavailable`、`net_new_determined: false`（与 `parent_not_selected` 同处理），复制件数显示未知。

### P3-CR-3 `_groups` 用生产 `assert conserved` 守恒

- **位置**：`backend/tools/dev_harness_budget.py:1193`。
- **问题**：按构造恒成立，但若将来任何改动破坏它，生产路径会以 `AssertionError` → `internal_error` 退出 1，且 `python -O` 下断言被静默移除。JSON 已输出 `conserved` 字段，测试也独立核对加和。Converge R1～R4 均已观察到，未处理。
- **修复方向**：删除 `assert`，保留 `conserved` 字段并在为 false 时把 `tokens.reasons` 加 `group_conservation_failed`、tokens 度量降为 partial。

## 已核对、未发现问题的要点（有界结论，不是 AC 验收）

- **未知不为 0 / 无虚假完整总计**：默认 0 → `default_zero` unknown，仅 `confirmed_zero` 规则匹配且 final 才 known 0（annotation）；选定来源缺口、未确认分区、`parent_not_selected`、`entry_unrecognized`、unreconciled、nonfinal 均使 `complete_total` 为 unknown；`empty` 来源“归属记录 0 条、消耗未知”。以 1.4.0 真实形状的单来源流（用户消息、`message_update` 顶层 `usage`、toolResult `message_start`+`message_end` 对、`turn_end` / `agent_end` 重复、settled 后 `cache_warm` `entry_appended`）复现：loaded，主尝试 2 / 工具 1，已知小计 = 完整总计 490，峰值 250，toolResult 与 `turn_end` 未重复计。
- **累计快照与归属**：`message_update` 只留最后快照并检查单调，最终值只取 `message_end`；`tool_execution_end.result.usage` 不读；`entry_appended` 内按 entry id 去重，常规压缩经 `compaction_end`、边界压缩经 `entry_appended` 各计一次；`handleRunFailure` 合成的 error 消息按 1.4.0 源码确为 `message_start` + `message_end`，计 1 次尝试、用量 unknown。每次 assistant 尝试恰发一次 `message_start`（`agent-loop.js` 292 / 323 / 336 三处互斥），不会双计。
- **重试括号**：`auto_retry_start` 开括号，止于下一 `auto_retry_start` / `auto_retry_end` / `agent_settled`；括号前最近 assistant `message_end` 为 error 且括号内观测到新 `message_start` 才 confirmed；`auto_retry_end` 只作终点；原生 `total` 恒 unknown（json：`retry_total_not_provable`，session：`retry_markers_not_persisted`）。12 种情形测试字面量与源码顺序一致。
- **收尾判据**：末个 `agent_settled` 后只允许 4 种非运行类记录（与 json.md “Queue and state events”一致）；本会话枚举 `agent-session.js` 的 `_emit` 类型，json 模式不会在 settled 后发出表外的非运行类型（`bash_execution_update` / `extension_error` 为 RPC-only）。
- **时间**：只来自带出处的 `timing` 标注；原生时间戳 / mtime 不出下界（测试含 `os.utime` 后报告相等）；窗口须全部会话边界 known、带偏移、可比；并行 0–10 / 0–10 → 窗口 10、合计 20；0→30 超时 → 耗时 30 known、时间 complete、用量 unknown、overall incomplete；时间独立于 token 分区与采集状态。
- **退出码与四层状态**：0 / 3 / 2 / 1 与 Plan §2 一致（`--help` → 0；无子命令 / 未知子命令 → `invalid_arguments` 2）；stdout 只有固定状态行，stderr 只有固定类别；`output_exists` 2、`write_failed` 1 且只删本次创建文件，清理失败给 `partial_artifacts_left=<n>`。
- **安全与隐私**：输出只经类型化事实投影；toolCallId / entry id / session id 只以 `sha256[:16]` 引用；`path` / `parent_link` 带 `repr=False`，不输出；provider / model / kind 经 MODEL_LABEL 正则并拒绝 `//`、盘符；标签类拒绝 `:` `/` `\`；异常文本、traceback、路径不进任何输出；`_load_comparison` 只投影元数据且校验失败不回显。源文件只以 `rb` 打开（审计 O_BINARY、无写标志）；写出 `open("x")`（审计 O_EXCL|O_CREAT）；out-dir 须已存在且不在 `parents[2]` 内；生产模块只 import 标准库，无网络 / 进程代码。
- **可比性**：基线不同只披露；模型 / 配置 / 范围 / 口径 / 格式差异 → “条件不同、不可直接比较”；缺失 → 未知；人工说明不移除警示；无 `cost` / 金额字段（测试逐字检索）。
- **工程准则与范围（AGENTS §5 / Plan §1）**：3 个新文件 + README 1 行；无产品包导入（`git grep --untracked` 无输出，Converge R4 复核）；`pyproject.toml` / `.gitignore` 未变；入口校验集中在 `load_manifest` / `_read_*`；`main` 只写正常流程；未见只用一次的提前抽象或投机性竞态防护。测试经公开接口调用真实实现，期望为字面量，替身只在声明边界（`Path.open` / `unlink` 写失败注入、D1 在 `build_report` 注入）。
- **AC-001-3 的证据强度**：审计钩子先计数再拒绝 `socket.*` / `subprocess.Popen` / `os.system` / `os.kill` 等，并清空凭证类环境变量；满足 spec “在外部调用边界观测到的尝试次数为 0”的要求。

## 非阻塞观察（不是发现）

1. 夹具中 assistant `message_start` 的 `stopReason: "pending"` 与 json.md 示例一致；`agent-loop.js` 实际传的是 provider 的 partial 消息，字段可能不同，但实现以显式 `finality="nonfinal"` 处理，不依赖该值。
2. 峰值要求 input / cacheRead / cacheWrite 三维均 known；pi Usage 恒带数值默认 0，因此无缓存的 provider 在用户未写 `confirmed_zero` 规则时峰值与已知小计都会是 unknown / 下界。这是 R2 已接受的保守口径（Checklist R3 观察 3），真实试点前应在试点指引中提醒用户准备 `confirmed_zero` 与 `timing` 标注。
3. `_source_gaps` 对 `partial` 来源把全部 `fact.reasons`（含 `invalid_label`、`tool_owner_unresolved` 等非采集缺口）并入 `tokens.reasons` 与计数阻断；方向保守，仅使原因列表偏长。
4. 峰值行“参与记录数 / 尝试总数”的“尝试总数”与同节“运行内总数：未知”是两个口径（Converge R3 / R4 观察 1），改措辞须先过 Plan。

## 本会话实际运行的命令与结果

- `git rev-parse HEAD` = `f5dbf6390aeacc7a7fc40f931f60ab6aec218aac`；`git status --short` 开始时为空；`git diff --stat 7bd2e5b..HEAD` 10 文件 +4885/−6；`git ls-tree HEAD` 取得输入清单中的 blob。
- 冻结 spec 正文 SHA256（锚定 `^## 1\.`，LF 归一化）= `a504fed8…e823`。
- `cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → **319 passed**（5.55 s）。
- 合成复现（`python -I`，系统 Temp 临时目录，结束后删除；不读任何真实数据）：(1) 1.4.0 真实形状单来源流 → loaded、490 complete；(2) 同会话双采集（全部 loaded）→ 见 P3-CR-1 输出；(3) 血缘父选入但缺失 → 见 P3-CR-2 输出；(4) 嵌套执行事件带 `parentToolCallId` → 见 P2-CR-1 输出；(5) `main([])` / `main(["frobnicate"])` → 退出 2 + `invalid_arguments`。
- pi 1.4.0 公开包有界核实：`json-event.js`（`toJsonEvent` 只改写 `message_update` 为 `{type, usage, assistantMessageEvent}`）、`print-mode.js` 84–101（header 先写、逐条写出）、`agent-loop.js`（单次 `message_start`；toolResult 成对事件）、`agent.js` 368–384、`agent-session.js` 412 / 649–660 / 683–706 与 `_emit` 类型枚举、`nested-tool-calls.js` 16–21 / 95–170、`json.md` 全文。

## 处置与边界

- P2-CR-1 须修复后重开 Review（R2）。修复路径：Plan §3.2 / §3.3 / §4.2 补“带 `parentToolCallId` 的嵌套执行事件”一行（设计修订，不是需求变更，不回 Clarify），追加任务到 tasks.md（引用 AC-005-1 / AC-007-1，验证命令一一对应），实施后重跑 Converge，再由独立 A Review。
- P3-CR-1～3 可由用户在 Gate 2 接受为后续任务。
- T-12 / AC-008-1 / AC-008-3 继续外部阻塞，须用户显式选定并授权文件；本文件不授权试点，不是 Gate 2，不授权 Handoff。
