# Feature: dev-harness-budget v1 实施评审 R3（code-review-r3.md）

> Review 阶段产物（[workflow.md 第 10 步](../../docs/development/workflow.md#step-10)）：审核员 A 依 spec + plan + tasks + 真实代码差异评审，按 bug / 架构风险 / 测试缺口 / 目标对齐出结论。
> **本文件不是 Gate 2，不构成任何 AC 的验收**；27 条 spec AC 保持未勾选。接受与否由用户在 Gate 2 决定，确认后才进入 Handoff。

## 头部记录

- **轮次**：Review **R3**（复审 [Review R2](code-review-r2.md) 两项 P3 的修复 T-21 / T-22 与 P3-R4-1 的记录 + 全量实现再审 + T-12 试点记录与重跑记录判定）。
- **固定提交**：`120f473f1f690c116dd7af1cfca39ad2540d11cf`（分离 Temp 工作树 `fai-docnav-20261030/budget-code-review-r3-tree`，`git rev-parse HEAD` 一致，开始时 `git status --porcelain` 为空）。真实 diff 范围 `5aebb03..HEAD`（R2 审的是 `5aebb03`）：代码只改 2 个既有文件（工具 +18/−10、测试 +103/−0），夹具未变；其余为本 feature 文档与 HANDOFF / specs/README 状态行。整段修复史 `f5dbf63..HEAD` 只涉 3 个既有代码文件。
- **审核员 A**：`claude-fable-5-1 via claude-bridge`（[model-routing.md](../../docs/development/model-routing.md) 审核员 A 行首选模型 + 首选通道；协调者派工前最小真实调用成功，为协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置。
- **独立性披露（规则 3 / 7）**：新开会话，上下文中没有实施者、Plan / Tasks / Analyze / Converge 作者或协调者的会话内容。实施者 = `openai/gpt-6-astra`，Plan / Tasks / Analyze / Converge = `claude-opus-5-5`，均与本会话模型不同。只读审查固定提交与真实 diff；本会话唯一写入 = 新建本文件；无 Git 写操作、未联网、未安装、未派工；未读取真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据，T-12 只依 review.md 的脱敏记录与 Git 历史判定。本轮**未打开** pi 1.4.0 安装包（本批 diff 不涉及事件形状，夹具未变）。合成复现脚本与数据放在系统 Temp 两个独立目录，用 `python -I` 运行，结束后已删除。
- **结论约束（规则 6）**：本轮结论即审核结论，即使未通过也是最终结论；不为求通过换模型，无投票或共识。
- **日期**：2026-10-31。

输入清单（路径 @ 提交或 blob + 适用章节）：

```
AGENTS.md @ 120f473（blob ee8e4ab）全文（项目指令形式注入，全文可见）
docs/development/workflow.md @ 120f473（blob 4aca344）全文（重点第 8～11 步、Review 判定规则、Gate 2）
docs/development/model-routing.md @ 120f473（blob f980f5c）全文
backend/README.md @ 120f473（blob fcc2619）全文
specs/dev-harness-budget/spec.md @ 120f473（blob 4689093）全文；锚定行首 ^## 1\. 至文末 LF SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结值一致；`- [ ] AC-` 27 条）
specs/dev-harness-budget/plan.md @ 120f473（blob d416e3a，r7 + 头部记账补正）全文（412 行，分 4 段）
specs/dev-harness-budget/tasks.md @ 120f473（blob 61a4ec6，T-01～T-22）全文（559 行，分 3 段）
specs/dev-harness-budget/checklist.md @ 120f473（blob 3e7a7d6，Checklist R4，23/23）全文
specs/dev-harness-budget/analyze-r5.md @ 120f473（blob 45c4e77）全文
specs/dev-harness-budget/converge-r7.md @ 120f473（blob 70017ff，当前有效 Converge）全文；converge-r6.md（blob db84203）头部与结论、G-R6-1 节
specs/dev-harness-budget/code-review-r1.md（blob 2272b21）、code-review-r2.md（blob 775dfdd）@ 120f473 全文
specs/dev-harness-budget/review.md @ 120f473（blob fb876a2）自“Review R1”节至文末（含用户对 R1 / R2 的处置、第 8～10 批、T-12 真实试点记录、T-12 试点重跑、Converge R5～R7）
真实 diff：git diff --stat 5aebb03..HEAD（10 文件）；git diff 5aebb03..HEAD -- backend 两个文件全文逐行阅读；git log 5aebb03..HEAD（8 提交）；git diff --stat f5dbf63..HEAD -- backend（3 文件 +514/−42）；git diff --check 5aebb03..HEAD 退出 0
backend/tools/dev_harness_budget.py @ 120f473（blob ccf325f）全文 1840 行（分 4 段）
backend/tests/test_dev_harness_budget.py @ 120f473（blob 9ffd5e2）全文 2235 行（分 3 段 + diff 覆盖新增的两条测试）
backend/tests/dev_harness_budget_fixtures.py @ 120f473（blob 0d11992，自 5aebb03 未变）全文 459 行
```

## 结论（R3）

**通过**：P1 = 0，**P2 = 0**，P3 = 2。

- Review R2 的 P3-CR2-1、P3-CR2-2 **CLOSED**（T-21 修复，T-22 补齐 tool_calls 计数；R2 的两个复现形状本会话重跑确认），P3-R4-1 **CLOSED（已记录）**。Review R1 的 P2-CR-1、P3-CR-1～3 **仍关闭**（R1 的 P2 形状与 P3-CR-2 形状重跑确认，`assert` 计数仍为 0）。
- 新发现 2 项 P3，都是 `nested_executed` / `nested_deduplicated` 披露层的计数 / 原因失真；不影响 direct 计数、已知小计、完整总计、分母结论、覆盖率或退出码，可在 Gate 2 接受为后续任务或要求修复。
- 未发现修复引入的回归：T-13～T-15 行为（含 T-14 全 loaded 摘要哈希断言）、隐私哨兵、退出码 0 / 3 / 2 / 1、去重归属、完整总计三条件均保持；本轮实跑模块测试 **357 passed**（6.62 s），R1 / R2 / T-13～T-22 相关 `-k` 子集 54 passed。后端全量回归本会话**未重跑**（时间预算内优先代码审查与复现；Converge R7 实测 810 / 1 / 5、唯一失败为既有 netstat 基线，本轮未改代码，不另声称）。
- **T-12 / AC-008-1 / AC-008-3**：依 review.md 的脱敏记录（首次 + T-21 后重跑）与用户对 R2 的处置（35 段已确认），tasks.md T-12 两条完成标准的文字要求**均满足**，记录中未见私有路径、会话 ID、提示词或报告原文（见“T-12 判定”节）。本评审不接受任何 AC。

**本结论的含义**：按 workflow 第 10 步判定规则，仅 P3 = 通过。P3 是否修复或接受、AC-008-1 / AC-008-3 是否认可，由用户在 Gate 2 决定；本文件不授权 Handoff、PR / merge，也不改变 27 条 AC 的未勾选状态。

## Review R2 发现的关闭判定

| R2 发现 | 状态 | 证据（本会话实跑，固定提交 120f473） |
|---|---|---|
| P3-CR2-1 已确认集合中没有 json-events 时 `nested_executed` 误报 `nested_events_not_persisted` | **CLOSED** | 代码：`build_report` 以全部选定来源计算 `selected_has_json_events` 并传入 `_count_metrics` → `_tool_counts`（`backend/tools/dev_harness_budget.py:954`、`:1080`～`:1086`）；已确认集合有 json-events → 照旧计数，选定有而已确认无 → `observed_total` null + `["overlap_unconfirmed"]`，全部 session-v3 → `nested_events_not_persisted`；逐来源调用传 `fact.format == "pi-json-events"`，行为等价。复现（R2 形状 = F5 `double_capture`，经 `main`）：退出 0，批次 `nested_executed.observed_total` null、`reasons = ["overlap_unconfirmed"]`，tokens / tool_calls `unconfirmed_sources` 2；`test_nested_executed_reason_uses_selection` 通过；F12 nested sources（全 session-v3）仍为 `nested_events_not_persisted`（`test_nested_views_dedup_and_direct_coverage[session]`） |
| P3-CR2-2 tokens / 分组 `unconfirmed_sources` 计入被生效 `duplicate_of` 取代的来源 | **CLOSED**（T-21 + T-22） | 代码：`_nested_partition` 未声明分支跳过 `partition.replaced` / `partition.covered`（`:1515`）；`unconfirmed_tokens` 与 `unconfirmed_tools` 同条件排除（`:944`～`:947`）。复现（R2 形状 = X / S `duplicate_of` X / O，经 `main`）：tokens `unconfirmed_sources` 1、tool_calls 0、四维分组 1，S `replaced_by = X` 且 `unconfirmed_record_count` 0，X 为 1，已知小计 340、完整总计 null——R2 时的“2”不再出现。Converge R6 发现的 tool_calls 残留（G-R6-1）由 T-22 修复，`[replaced_lineage_partial]` 参数断言 tokens = tool_calls = 四维 = 2，本会话通过 |
| P3-R4-1 plan / tasks 头部输入清单缺 r6 / r7 行 | **CLOSED（已记录）** | plan.md 输入清单代码块内含 r6、r7 行、补正说明与“记账补正 @ 39fa979”行；tasks.md 输入清单含 r6 / r7 / r8 行（blob 与章节俱全）。只改头部记录，规则正文未动 |

**Review R1 再确认（一行）**：P2-CR-1（F14 (a) 形状经 `main`：direct 1 / complete / 分母 1 / 100%、`nested_executed` 2、`nested_deduplicated` 2 matched 2、已知小计 345）、P3-CR-1（F5 双采集：分母 / 缺失 null、`no_confirmed_records`、整份报告无 `no_usage_records_observed`）、P3-CR-2（血缘父缺失：`lineage_parent_unavailable`、`net_new_determined: false`、复制件 / 净新增 null、子 180 = 批次 180）、P3-CR-3（`grep -c assert` = 0，AST 测试通过）本会话重跑均**仍 CLOSED**。

T-21 / T-22 要求记录的既有断言改正：两批 diff 对测试文件只新增两个测试函数并在既有 parametrize 行加入一个参数（新增分支在函数开头，另两个参数的断言逐字未变），与 review.md“第 9 批”“第 10 批”所记“既有断言无改动”一致，未放宽任何计数断言。

## 审核发现（R3，新发现）

### P3-CR3-1 json-events 来源不可用 / 部分时，`nested_executed` 与 `nested_deduplicated` 仍给出“0 条、无原因”，未按来源可用性门控

- **位置**：`_tool_counts`（`backend/tools/dev_harness_budget.py:1080`～`:1094`）：`observed_total = len(executions) if confirmed_has_json_events else None`，`reasons = []`；`deduplicated` 四项直接累加。两者都不看 `available`，也不看来源 `status`；同函数中 `direct["observed_total"]` 则按 `available` 门控为 None。
- **复现（合成，经 `main`）**：S1 = session-v3（F1，170）、S2 = json-events 但文件缺失。输出：退出 3、`sources=gaps`；S2 行 `status = unavailable`、`tool_calls.direct.observed_total = null`、`tool_calls.status = unavailable`，但同一行 `tool_calls.nested_executed = {…, observed_total: 0, reasons: []}`、`nested_deduplicated = {observed_total: 0, …}`；批次 `tool_calls.nested_executed.observed_total = 0`、`reasons = []`（批次 tool_calls 的 status partial、reasons `source_missing` 仍在）。S2 为只有 header 的 json-events（`partial` + `stream_not_settled`）时同样为 0 / `[]`。
- **问题**：来源未被读到任何事件，却以“观测到 0 条嵌套执行”陈述，且原因为空；与同一行 direct 的 `null` / `unavailable` 自相矛盾。这与 AC-001-4“观测失败时标不完整 / 不可用并说明原因，不填 0”和 AC-003-4“占位或默认 0 不是实际 0”的精神不符（Checklist R4 D-06 只认可“已读到的 json-events 来源无嵌套事件”为实际 0，并未覆盖来源缺失）。影响只在披露层：direct 计数、分母（因 `missing_sources` 已为 null）、覆盖率、退出码与 token 均不受影响，故为 P3。
- **修复方向**：`nested_executed.observed_total` 与 `nested_deduplicated.observed_total` 按与 direct 相同的 `available` / 来源 `status` 门控：来源非 `loaded` / `partial` 且无事实时置 null 并给固定原因（如沿用该来源的采集原因或 `no_usable_source`）；批次级在 json-events 来源全部不可用时同样 null。补一条 S1 loaded + S2 json-events 缺失 / 只有 header 的断言。不改 Plan 规则（Plan §3.3 只写“只计 json-events 来源”，未要求对不可用来源报 0）。

### P3-CR3-2 json-events 来源被生效 `duplicate_of` 取代时，批次 `nested_executed` 原因标为 `overlap_unconfirmed`，但该重叠已由人工链接确认

- **位置**：`_tool_counts`（`:1085`～`:1086`）：已确认集合无 json-events 而选定中有时，一律用 `overlap_unconfirmed`。
- **复现（合成，经 `main`）**：F5 `double_capture` 的 json-events 来源 C 加 `duplicate_of: P`（P = session-v3，跨格式 → `unverified` 但生效）。输出：`relations[0].effective = true`、C `replaced_by = P`、tokens `unconfirmed_sources` 0（去重已确认），但批次 `tool_calls.nested_executed = {observed_total: null, reasons: ["overlap_unconfirmed"]}`。
- **问题**：原因标签陈述“重叠未确认”，而报告其他部分同时陈述“已确认去重、按人工链接被 P 取代”；与 R2 P3-CR2-1 同属原因标签误用，只是方向相反。数值为 unknown、保守；T-21 完成标准 1 的文字确实只覆盖“未确认”情形，Converge R7 观察 2 已指出但未处理。P3。
- **修复方向**：该分支按来源实际落入的分区给原因——json-events 来源被取代 → 固定原因如 `replaced_by_duplicate_of`，落入未确认分区 → 保留 `overlap_unconfirmed`；只改 `_tool_counts` 一处表达式（需 `build_report` 传入“选定 json-events 来源是否全被取代”或等价信息）并补一条断言。不改 Plan 规则。

## 已核对、未发现问题的要点（有界结论，不是 AC 验收）

- **T-21 / T-22 的范围与语义**：`selected_has_json_events` 为关键字限定参数，仅在 `build_report` 两处调用（逐来源传自身格式、批次传全部选定来源），D1 注入路径照常；`_nested_partition` 跳过 `replaced` / `covered` 时 `covered` 尚为空集（嵌套链接在该分支之后判定，且未声明时任何链接都不生效），该条件是无害的防御项，不改变输出；`unconfirmed_tools` 按构造仍是 `unconfirmed_tokens` 的子集。被取代来源的 `partition.uncertain` 原因仍进入 `tokens.reasons` 并阻止完整总计（Converge R7 观察 1），方向保守；在可达的真实形状中（血缘冲突 / 父 partial 总同时标记未被取代的一方）计数与原因不矛盾。
- **嵌套身份与 direct 隔离未变**：`_nested_event` / `_tool_event` 分派条件（`parentToolCallId` 非空字符串）、父解析只在同一 owner 作用域、`call_ref` 与 `_nested` 的记录身份同法构造、嵌套 `tool_execution_end.result.usage` 不读（F14 (a) 已知小计 345 由测试守卫）均与 R2 审过的版本相同；F2 / F14 夹具未变。
- **退出码与四层状态**：未改；双采集退出 0 + `sources=ok` 同时分母未知，仍符合 §4.7 四层分列。
- **隐私**：新增代码只追加固定字符串原因，`records.json` 不含嵌套；`test_privacy_sentinels_absent` 含 `parentToolCallId` 哨兵照过；stderr 固定类别未变。
- **范围与工程准则（AGENTS §5 / Plan §1）**：`git diff --name-only 5aebb03..HEAD -- backend` 只有工具与测试两个文件；`pyproject.toml` / `.gitignore` / `backend/README.md` 在该区间无改动（`git diff --exit-code` 退出 0）；`git grep --untracked` 无产品包导入；生产模块无 `assert`；T-21 / T-22 没有新函数、新依赖或投机性复杂度；测试经 `main` 调用真实实现、期望为字面量。
- **夹具真实性**：T-22 内联的 session-v3 行（子 header 带 `parentSession`、复制条目保留 `id` / `timestamp`、末尾坏行）与 F5 lineage 夹具同形，符合 Plan §3.4 第 4 层依据的 1.4.0 fork 复制方式。

## T-12 / AC-008-1 / AC-008-3 判定（只依 review.md 脱敏记录 + Git 历史 + 代码阅读）

| tasks.md T-12 要求 | 记录 | 判定 |
|---|---|---|
| 经用户显式授权的真实批次 | 用户原话“全修，T-12同批完成，授权脱敏”；Review R2 后用户原话“……试点范围扩大35”——35 段范围由用户确认（review.md“用户对 Review R2 的处置”） | 满足；R2 要求用户明示确认的范围解释已得到确认 |
| 生成报告、不新增模型调用、不重跑任务 | 首次（基线 `a868d25`）与重跑（`de3180a`）均退出 3，状态行相同（`loaded=33 partial=2 …; metrics_complete=1/6; overall_observation=incomplete`），stderr 空；记录写明报告本身不发起模型或网络调用、未重跑任务；timing 标注来自调度器记录（`origin=external`） | 满足（离线性由 AC-001-3 审计钩子测试证明） |
| 写明“仅证明可用、非基线、不证明节省” | 首次记录与重跑节均写明 | 满足 |
| 使用修复后的最终代码 | 重跑在 T-21 之后（`de3180a`），T-22 之后未再重跑。本会话按代码判断：T-22 只改 `unconfirmed_tools` 的求和式（排除 `replaced` / `covered`），该和在 `partition.uncertain` 全空时恒为 0；记录写明试点“去重已确认（无跨来源重叠）”，即无未确认分区，故 T-22 不可能改变任何记录数字。这是依代码与记录的推断，本会话未运行试点 | 满足 T-12 写明的依赖（T-16～T-20）；是否要求在 T-22 后再重跑，由用户在 Gate 2 决定，A 不认为有必要 |
| AC-008-3 前后核对一致、顺序“前 → 报告 → 后 → 写记录” | 两次运行都记录前后 `git hash-object` 与 `git status` 一致，记录写于“后”核对之后。本会话独立佐证：spec blob `4689093`、checklist blob `3e7a7d6` 在 `a868d25`、`de3180a`、HEAD 相同（`git ls-tree`） | 满足。记录中的“状态摘要 SHA256”构造方式仍未写明，无法逐字复算，但 Git 历史独立支持结论 |
| 写明不构成该 feature 验收、不依赖 desktop-shell / WI | 首次记录两句都有；重跑节写“结论不变……不构成任何 feature 的验收” | 满足 |
| 脱敏：无私有路径、会话 ID、提示词、报告原文 | 本会话对两节检索盘符 / `Users` / `AppData` / `Temp` / `tmp` / UUID 形 / `.jsonl` / `~/`：唯一命中是授权文件名模式与“不含 `~/.pi`”排除句；内容只有计数、状态、原因类别、阶段名与模型 / 通道名 | 满足 |

以上判定只说明记录满足 tasks.md 写明的标准，**AC-008-1 / AC-008-3 是否接受是用户的 Gate 2 决定**。

## 非阻塞观察（不是发现）

1. 未解析嵌套执行的 `nested_parent_unresolved` 在 start / end 各追加一次（R2 观察 1）；F14 每轮多一组 `agent_start` / `turn_start`（R2 观察 2）；峰值行“参与记录数 / 尝试总数”措辞（Converge R3～R7 观察）均未变，改措辞须先过 Plan。
2. review.md 头部“当前状态”仍是 r5 时文字（Analyze R4 / R5、Checklist R4 均已指出），属记账滞后，不在本轮写限范围内。
3. 后端全量回归本会话未重跑（见结论节）。

## 本会话实际运行的命令与结果

- `git rev-parse HEAD` = `120f473f1f690c116dd7af1cfca39ad2540d11cf`；`git status --porcelain` 开始时为空（结束时仅多出本文件）；`git diff --stat 5aebb03..HEAD` 10 文件 +746/−22；`git log --oneline 5aebb03..HEAD` 8 提交；`git ls-tree HEAD` 取得输入清单 blob；`git diff --check 5aebb03..HEAD` 退出 0。
- 冻结 spec 正文 SHA256（锚定行首 `## 1.`，LF 归一化）= `a504fed8…e823`，一致；`- [ ] AC-` 27 条。
- `cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → **357 passed**（6.62 s）；R1 / R2 / T-13～T-22 相关 11 个测试名的 `-k` 子集 → 54 passed。
- `grep -c assert backend/tools/dev_harness_budget.py` = 0；`git grep --untracked -nE "^(from|import) (app|data|settings)([ .]|$)" -- backend/tools/dev_harness_budget.py` 无输出；`git diff --exit-code 5aebb03..HEAD -- backend/pyproject.toml .gitignore backend/README.md` 退出 0。
- 合成复现（`python -I`，脚本与数据分放系统 Temp 两个目录，经公开接口 `main`，结束后删除；不读任何真实数据）：(A) F5 双采集 → P3-CR2-1 关闭证据；(B) X / S dup_of X / O → P3-CR2-2 关闭证据；(C) F14 (a) → R1 P2 关闭证据；(D) json-events 来源 `duplicate_of` session-v3 生效 → P3-CR3-2 输出；(E) S1 loaded + S2 json-events 缺失 / 只有 header → P3-CR3-1 输出；(F) 血缘父缺失 → R1 P3-CR-2 关闭证据；(G) 双采集且 json-events 来源含嵌套事件 → 批次 null + `overlap_unconfirmed`、逐来源 2，与 T-21 一致。
- T-12 佐证：`git ls-tree` 对比 `a868d25` / `de3180a` / HEAD 的 spec、checklist blob；review.md 试点两节私有信息形态检索。

## 处置与边界

- 结论**通过**（0 P1 / 0 P2 / 2 P3）。P3-CR3-1 / P3-CR3-2 可由用户在 Gate 2 接受为后续任务或要求修复；两者都只改 `_tool_counts`（及 `build_report` 传参）的计数 / 原因表达式与对应断言，不需回 Plan 或 Clarify。
- T-12 记录满足 tasks.md 写明的标准；35 段范围已由用户确认；T-22 后未重跑一事依代码推断不影响记录数字，是否需要重跑由用户在 Gate 2 决定。
- 本文件不是 Gate 2，不授权 Handoff、PR / merge，不勾选、不接受任何 AC。
