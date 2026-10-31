# Feature: dev-harness-budget v1 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员 A 生成并勾选。只有 A 认为满足的检查标准才勾选；
> 勾选只代表**需求 / 设计质量**达标，**不代表**实施完成、测试通过或任何 AC 通过。实施者不勾选本文件。
> 审核员 A 单审，结论即审核结论；不做投票，也不要求第二名审核员形成共识。本轮 A 为新开独立会话，仅本轮；不与 R1 / R2 的 A 形成共识或投票。

## 头部记录

- **当前有效轮次**：**R3**（本文件）。审查固定提交 `9f60aecd7a5b972deb0a13803db62db3b5be65c9`（`D:/2030/Futures-AI` 分支 `workbench` 的提交，在新建的分离 Temp 工作树 `fai-docnav-20261030/budget-r3-review-tree` 中 `git rev-parse HEAD` 核对一致，`git status --short` 开始时为空）。
- **轮次历史（分开记录，历史轮次不是当前有效结论）**：
  - R1：审查候选 `a261657`，A = `claude-opus-5-5 via anthropic`（回退 1），结论未通过（0 P1、4 P2、3 P3，16/23）。归档 [checklist-r1.md](checklist-r1.md)，Git blob `aef3138`，LF SHA256 `dbe95b58fa4abf45ba79593716d823b643ea682c9380459a62f2cf52d7cb5dc3`（本会话用 `git show HEAD:…/checklist-r1.md | sha256sum` 复算一致）。
  - R2：审查 `57d0d84`（Plan r2），A = `claude-fable-5-1 via anthropic`，结论通过但 21/23（C-05 / C-09 因 tasks / Analyze 不存在而未勾），新发现 P3-R2-1～5。R2 原件已在本轮覆盖前**逐字节归档**为 [checklist-r2.md](checklist-r2.md)：归档字节 = `9f60aec` 中本文件的 Git blob `40b0b87efb6038ac6536d412cac1608b42251ac5`，LF SHA256 `1a667287562a1d13c3ddac74fd0196e6d4ccacea88d8e98127f285dc25a63d0c`（本会话实算，`git hash-object` = `40b0b87`）。
  - R3（本轮）：审查 Plan r4（blob `9c1c8bc`）、Tasks（blob `873f55b`）、Analyze R1 / R2 与 `57d0d84..9f60aec` 真实 diff，结论见下。
- **审核员 A（R3）**：`claude-fable-5-1 via claude-bridge`，即 [model-routing.md](../../docs/development/model-routing.md) 审核员 A 行的**首选模型 + 首选通道**。协调者在派工前对 claude-bridge 做了一次最小真实调用成功（协调者陈述）。
- **路由说明（规则 2 / 5，只记脱敏摘要）**：Checklist R2 当时只走官方 `anthropic` 通道，原因是协调者沿用了未复测的“bridge 已耗尽”旧记录、未按规则 5 重新探活；该疏失已在 review.md“claude-bridge 路由更正与 Analyze R1”节记录更正。本轮回到首选通道。换通道不是换模型；R2 的结论内容不受影响。
- **结论约束（规则 6）**：本轮结论即审核结论，**即使为未通过也是最终结论**；不得为求通过再换模型，无投票或共识。
- **独立性披露（规则 3 / 7）**：新开会话，上下文中没有任何作者 / 协调者 / Analyze 会话内容；在固定提交的分离 Temp 工作树中只读审查，未写主工作区，未做任何 Git 写操作（无 commit / 分支 / reset / push）、未联网、未安装、未派 agent、未运行任何测试，未读取真实 `~/.pi` 会话、actor / agent 原始日志、Temp 负载或试点数据。A 的模型（`claude-fable-5-1`）与 Plan / Tasks / Analyze 作者（`claude-opus-5-5`）不同，与拟定实施模型（`openai/gpt-6-astra` / `deepseek/deepseek-flash`）不同。尚未实施任何代码。
- **本轮产出限制**：只新建 `checklist-r2.md`（归档）并重写本文件；未改 spec / plan / tasks / analyze* / review / checklist-r1 / HANDOFF / 索引 / 代码。下方“静态核对”均为本会话实际执行的只读检查，plan / tasks 中的未来命令一律未执行。本文件**不授权**实施开始以外的任何事项，尤其不授权真实试点、Review 或 Gate 2；27 条 spec AC 保持未勾选。

输入清单（路径 @ 提交或 blob + 适用章节）：

```
AGENTS.md @ 9f60aec（blob ee8e4ab）全文
docs/development/model-routing.md @ 9f60aec（blob f980f5c）全文
docs/development/workflow.md @ 9f60aec（blob 4aca344）全文（总规则、第 5～8 步、Gate 1 / Gate 2 重点）
templates/checklist.md @ 9f60aec（blob 8da2b31）全文
templates/tasks.md @ 9f60aec（blob 4b7f955）全文
specs/dev-harness-budget/spec.md @ 9f60aec（blob 4689093，与 57d0d84 同 blob）全文；冻结正文核对：锚定行首 "## 1." 至文末、LF 归一化后 SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与头部批准记录一致）
specs/dev-harness-budget/plan.md @ 9f60aec（blob 9c1c8bc，Plan r4）全文（345 行分 3 段完整读取，§1～§7 含 r3 / r4 修订史与源码核实元数据）
specs/dev-harness-budget/tasks.md @ 9f60aec（blob 873f55b）全文（316 行）
specs/dev-harness-budget/analyze.md @ 9f60aec（blob 2caea51，Analyze R1，审 325e43b）全文
specs/dev-harness-budget/analyze-r2.md @ 9f60aec（blob b96ddab，Analyze R2，审 4132cc6）全文
specs/dev-harness-budget/checklist.md @ 9f60aec（blob 40b0b87，SHA256 1a667287…）R2 全文（现归档为 checklist-r2.md）
specs/dev-harness-budget/checklist-r1.md @ 9f60aec（blob aef3138）仅做哈希复算，未作为评审依据
specs/dev-harness-budget/review.md @ 9f60aec（blob d1143a9）头部，以及自“Checklist R2 与本地保存”至文末各节
真实 diff：git diff --stat 57d0d84..9f60aec（9 文件：HANDOFF.md、specs/README.md、analyze.md、analyze-r2.md、checklist-r1.md、checklist.md、plan.md、review.md、tasks.md；+878/−131，无代码）；HANDOFF.md / specs/README.md 逐行差异；git diff --check 退出 0
pi-coding-agent 1.4.0 公开安装包（非本仓库，有界只读佐证）：docs/json.md（sha256 f1031918…3543）全文；dist/core/agent-session.js（436e8be3…1162）740–800、1530–1560、3070–3110 行及 auto_retry_* / agent_settled / entry_appended / compaction_end 发射点检索；dist/core/cache-warmer.js（9c4b0009…7fc0）236–256 行；dist/core/session-manager.js 仅复算哈希（046b6a11…9d926）；pi-agent-core dist/agent.js 360–392 行（handleRunFailure）、dist/agent-loop.js message_start 发射点检索
```

## 结论（R3）

**Checklist R3 通过，有效清单 23/23**——P1 = 0，**P2 = 0**，P3 = 1（新发现 P3-R3-1，tasks.md 内部可追溯性小瑕疵，可作实施时的后续项，不阻塞）。R2 的 5 项 P3 经本轮按 Plan r4 实际文本、Tasks 与冻结 spec 独立核对，**全部 CLOSED**（逐项见“R2 发现复核”）。Analyze R1 的 P2-AN-1 / P3-AN-1 由 Analyze R2 判已解决，本轮独立复核同意（见 C-05）。真实 diff 中 HANDOFF.md / specs/README.md / review.md 的改动只是状态记账，与 Plan / Tasks / Analyze 内容一致，未发现回归。

**本结论的含义**：只代表需求 / 设计质量达标，满足 Implement 的“有效 checklist 全部勾选”前置条件。它**不是**实施、测试、任何 AC 完成、Review 或 Gate 2，**不授权**真实试点：T-12 / AC-008-1 / AC-008-3 仍须用户另行显式选定并授权文件（外部依赖，非质量缺陷）。27 条 spec AC 保持未勾选；Implement 仍须按 model-routing 派工、按 tasks.md 依赖顺序执行，并在过程中不改任何 checklist 文件。

## 需求完整性

- [x] C-01 每条需求都有至少一条可验证的验收规则：8 组 R、27 条 AC（4+3+4+3+4+2+4+3）均含可测断言或数值示例（170 / 150 / 12 / 10 s / 20 s / 30 s、“已知小计 50、未知 1”）。本轮按冻结正文（哈希一致）重核，未变。
- [x] C-02 无未澄清歧义：spec §5 Q-001～Q-020 闭环；唯一产品层待决项（真实试点批次选择）已定义为执行前须用户显式授权，不阻塞。Plan r3 / r4 的全部修订（括号规则、收尾判据、净新增集、`entry_appended` 抽取）都是在冻结 AC 之内的设计细化，未改任何 what；Analyze R1 / R2 亦判不需回 Clarify，本轮同意。
- [x] C-03 目标与非目标边界清晰：只观测、不约束；与产品运行时预算（D-019 / D-022 / D-023）无关；不计费；无常驻服务；不改全局规则或被观测批次；不为采样额外调用模型。Plan r4 与 Tasks 未越界：仍是 3 个新文件 + README 一行，无全局计费、无采集器、无阈值、无新来源格式。
- [x] C-04 冻结完整性：锚定正文 SHA256 仍为 `a504fed8…e823`（本会话实算）；spec.md 自 `57d0d84` 起 blob 不变（4689093）；27 条 AC 逐字未变且均未勾选。Plan §5 与 tasks AC 覆盖表均为 27 行、编号集合与 spec 相等（本会话脚本核对）。

## 一致性

- [x] C-05 spec / plan / tasks 之间无冲突（Analyze 报告无遗留问题）：**Analyze R2（审 `4132cc6`）判 PASS，0 P1 / 0 P2 / 0 P3**；`4132cc6..9f60aec` 只改 HANDOFF / specs/README / review 与新增 analyze-r2.md，plan / tasks blob 不变，故 Analyze R2 的输入即本轮受审 Plan r4 / Tasks。本轮独立复核 Analyze R1 两项发现的解决：P2-AN-1——Plan §3.2 / §4.2 / §4.3 第 3 条 / §4.7 / §5 F13 已把 `entry_appended` 中 usage 条目与 compaction 的用量按白名单抽取并计入已知小计与完整总计，未识别类型带 `usage` → `entry_unrecognized` 使完整总计 unknown；本会话在公开源码检索 `compaction_end` 发射点（2323 / 2337 / 2450 / 2609 / 2626）均不在 `_commitBoundaryDrafts`（635–640），与“边界压缩只经 `entry_appended`、常规压缩只经 `compaction_end`、互不重叠”一致，不再有“已暴露用量被排除却报完整总计”的虚假完整；与 spec 术语“完整总计”、AC-003-4、AC-005-3 一致。P3-AN-1——T-11 验证命令 10 已改 `git grep --untracked`。本轮逐条核对 spec AC ↔ Plan §5 ↔ tasks 完成标准语义（见 C-07 / C-08），未发现冲突；唯一新发现为 tasks 内部可追溯性小瑕疵 P3-R3-1，不构成 spec / plan / tasks 语义冲突。
- [x] C-06 与 docs/ 决策与 ADR 无冲突：落点仍为既有 `backend/tools/` 脚本目录，标准库 + 仓库已有 pytest / Git；不进 wheel、不改打包 / `.gitignore` / AGENTS / workflow / model-routing / provider / 路由 / 全局 pi 配置；无预算上限或干预；“无需 ADR”理由成立并写明“需改即停止回报”。r3 / r4 新增内容（括号规则、收尾判据、`entry_appended` 白名单）均在脚本内部。真实 diff 中 HANDOFF / specs/README / review 只改状态文字，与 D-025 工作区纪律一致。
- [x] C-07 Plan 对 27 条 AC 的映射在语义上与 spec 一致：重点复核 r3 / r4 触及的映射——AC-003-3：标签“主 assistant 尝试内的来源上报输入峰值”含 spec 原词，操作记录不参与并注明，符合“峰值同样标明覆盖范围”；AC-003-4 / AC-005-3：F13 (a)(b)(c) 的 210 / 212 / “已知小计 170、完整总计 unknown”可由 §4.3 规则唯一推出，已暴露用量“计入并标已覆盖”、未识别用量不冒充完整；AC-005-2：括号内新 `message_start` = “两次尝试均实际观测”，`total` 恒 unknown = “重试数标为未知”，`auto_retry_end` 不计数 = 不从成败推断；AC-004-3：第 4 层先于第 6 层、净新增集逐维比较、多来源 flag=false 全部入未确认分区，均落在“缺可靠关联则标未完全去重、数值未知、各来源已知值保留”之内；AC-001-4：`stream_not_settled` 只标 partial 并给原因，不填 0。无 AC 被 Plan 改写含义。
- [x] C-08 每条验收规则都能映射到确定的测试期望或手动验收步骤：Plan §5 每行给出测试名、样例与字面量期望；tasks 中全部 `test_*` 与 Plan §5 的集合双向相等（Plan 多出的 `test_app_packaging` 是既有仓库测试引用），48 条 `-k` 表达式全部为 Plan §5 测试名且名称间无子串碰撞（本会话脚本核对）；F1 = token 度量 complete、D1 = `build_report` 边界注入、T-12 = 手动步骤，三层数据不混称；AC-008-1 / 008-3 为手动验收且明确“待定 / 外部阻塞”。

## 可测试性

- [x] C-09 任务粒度与验证命令满足 tasks.md 模板要求：12 项任务均有依赖 / 估时 / 上下文 / 修改范围 / 完成标准 / 验证命令；估时均在 0.5～2h 内（T-02 / T-03 / T-04 / T-07 / T-10 为 2h 满载，见观察 1）；完成标准与验证命令条数逐任务相等（1/3/3/7/4/3/6/4/4/5/10/2，本会话脚本核对）且逐条同编号对应；完成标准均引用 AC 编号，T-11 第 8～10 条为全量回归 / 基线对比 / 范围核对（见 P3-R3-1 (ii)，不影响本项：其 1～7 条已覆盖该任务全部 AC，8～10 条对应 AGENTS §4“提交前跑测试”与 Plan §1 范围约束）；T-01→T-11 线性无环，T-12 依赖 T-11 + 外部授权；文件范围仅 3 个新文件 + README 一行。

## 本 feature 自定义项

- [x] D-01 范围与工具约束：单文件标准库脚本 + 测试 / 夹具辅助模块，不进 wheel；无新框架、新产品功能、路由或预算上限；回滚 = 删除新增文件。r3 / r4 与 Tasks 未扩大文件集合或依赖；T-11 命令 10 只用仓库已有 Git。
- [x] D-02 支持的两种格式与原生缺口如实写明（r4 重核）：§3.2 能力矩阵与 pi 1.4.0 公开文档 / 源码一致——json.md：`message_end` 权威、`message_update.usage` 累计且可为 0、`agent_end`≠settled、`auto_retry_*` / `summarization_retry_*` 形状、`tool_execution_end.durationMs`、“Queue and state events”恰为 `queue_update` / `entry_appended` / `session_info_changed` / `thinking_level_changed` 4 种（本会话全文核对）；源码：`entry_appended` 发射点 186 / 476 / 639 / 868 / 2787，`cache-warmer.js` 247–251 仅非 error / aborted 时 `appendUsage("cache_warm")`，与“失败 / 中止的缓存预热请求不留条目 → `unobserved_paths`”一致。r4 已把 `entry_appended` 的 usage 条目 / 边界 compaction 从“未观测”改为“已覆盖并抽取”，删去不准确的“json 不暴露 usage 条目”，只保留已核实盲区（branch summary、失败预热、物理请求、session-v3 的进行中尝试 / 重试 / 工具耗时）。json.md 对 `entry_appended` 的描述窄于源码，Plan §7 r4 已注明以源码为准。
- [x] D-03 隐私与零调用 / 只读边界的测试设计：审计钩子只在被测接口调用期间计数 socket / 进程 / kill / system / open；源只 `rb` 打开；源与沙箱 spec 状态前后哈希比对；控制动作单独观测；钩子只在测试辅助模块。r3 / r4 与 Tasks（T-11）未削弱，F13 (d) 把哨兵扩至 `entry_appended` 负载字段。
- [x] D-04 选定总体完整性：缺失 / 不可读 / 不支持 / 截断 / 坏行 / 只有 header（`empty`）/ `stream_not_settled` 均阻止完整总计（§4.3 第 1 条）；空集不推出“全部已知”；有效来源已知值保留；无假“完整总计 0”。r4 新增第 3 条：`entry_unrecognized` 出现即完整总计 unknown，不静默丢弃；`empty` 在 §2 退出码、§3.6、§4.2、§4.3、§4.7 与 AC-003-4 映射中定义一致。
- [x] D-05 累计快照取最终值，非最终只作下界：6/10/12 → 12；无 `message_end` → 非最终、下界 10 不入已知小计；不单调 → unknown；json 按归属事件去重，`turn_end` / `agent_end` 不重复计；`entry_appended` 内按 entry id 去重，边界 compaction 同 id 两次只计一次（F13 (b)）。
- [x] D-06 零值、出处与估计值（峰值标签重核）：默认 0 → unknown，只有带出处的 `confirmed_zero` 才记已知 0；`totalTokens` 只对账且缺失不标 unreconciled；不读 `cost`；不展示 `tokensBefore` / `estimatedTokensAfter`；峰值固定标签“主 assistant 尝试内的来源上报输入峰值”（含 spec 原词），附“参与记录数 / 尝试总数”与“操作记录输入不参与、非单请求值”的注明，有未知记录时标下界；不另设操作记录峰值。R2 的 P3-R2-2 已关闭。
- [x] D-07 来源关系图的去重语义完整（r3 重核）：第 0 层并集图校验不变；第 2 层只接受两种单层星形；**第 4 层血缘去重先于第 6 层**，(d) 以子来源净新增集逐维比较，复制件不参与 Σ 与完整性要求，`parent_not_selected` / 血缘未确认 → `nested_coverage_unverifiable`；第 6 层末句限定为“仅单来源或 `all_nested_children_declared: true` 时未引用的 toolResult 用量照计”，多来源且 flag=false / 缺省 → 全部带 usage 的 toolResult 入未确认分区。本轮用 R2 P3-R2-1 反例（P、C 两来源，C 未声明 `nested_of`，flag=false）重走：P 的 toolResult 用量进入未确认分区、C 的记录保留单列、完整总计 unknown，不再出现重复计入的“已知小计”。用 P3-R2-5 (ii) 反例（C 复制 P 前若干条目且是 `nested_of` 子来源）重走：先去复制件，净新增逐维和 = 父 usage 即成立，不因原始和含历史被误拒。工具计数按 owner 命名空间身份、`direct` 与 `nested_reported` 永不相加不变。
- [x] D-08 计数口径诚实（括号规则按公开源码核实）：尝试 / 操作记录分列、request_count 恒 unknown、`total` 恒 unknown 不变。§4.4 括号规则：`auto_retry_start` 开启括号，止于下一个 `auto_retry_start` / `auto_retry_end` / `agent_settled`；括号前最近 assistant `message_end` 为 error 且括号内观测到新 assistant `message_start` → `confirmed +1`。本会话在公开源码核对：`auto_retry_start` 在 `_prepareRetry`（3103）退避前发出；`auto_retry_end{success:true}` 在 `_handleAgentEvent` **转发新尝试的 `message_end` 之后**（753 → 778–787）发出；`auto_retry_end{success:false}` 由 `_handlePostAgentRun`（1552，超上限或不可重试）与 `_finishCancelledRetry`（3080，取消）发出；`agent_settled` 于 689–690。因此新尝试的 `message_start` 恒在括号内，规则与实际顺序一致。另核对 pi-agent-core `handleRunFailure`（agent.js 368–384）：运行前失败合成的 assistant error 消息同样先发 `message_start` 再发 `message_end`，故不存在“重试尝试只有 `message_end` 而漏算 confirmed”的路径；其 usage 为全 0，按 §3.3 记 unknown 而非实际 0。R2 的 P3-R2-3 已关闭。
- [x] D-09 时间口径：原生时间戳不作耗时 / 下界 / 运行边界；确认墙钟只来自带出处标注；超时可有已知耗时；时间独立于 token 去重分区与来源采集状态；不丢弃时间未知的会话来凑窗口；无偏移不跨来源比较。r3 / r4 未改 §4.5。
- [x] D-10 按度量的完整性判定与可达性、夹具可行性（收尾判据重核）：§4.7 六项度量单位 / 总体 / complete / partial / unavailable 不变，overall 对原生输入恒 incomplete 如实承认；退出码 0 / 3 / 2 / 1 仅表达产物写出与来源采集。§4.2 收尾判据：存在 `agent_settled` 且末个 settled 之后只有 4 种非运行类记录（与 json.md 一致）才 settled；17 种运行活动类型（agent 2 + turn 2 + message 3 + tool_execution 3 + compaction 2 + auto_retry 2 + summarization_retry 3，本会话计数 = 17）或未知类型出现在末个 settled 之后 → `partial` + `stream_not_settled`；不用 mtime / 时间戳；多 prompt 只看末个。该判据可逐记录判定，不会把合法尾随 `queue_update` / `session_info_changed` / `entry_appended` 误判为缺口；r4 后尾随 `entry_appended` 的用量照计入已知小计与完整总计，判据本身只看类型与顺序。F13 (a)(b)(c) 期望（210 complete / 212 / 170 + unknown + tokens partial + 退出 0）可由 §2、§4.3、§4.7 唯一推出，与 Analyze R2 的推导一致。R2 的 P3-R2-4 已关闭。
- [x] D-11 安全投影与固定错误（白名单含 r4 新字段）：`entry_appended.entry` 只取 type / id，`usage` 再取 kind / provider / model / usage 数值，`compaction` 只再取 usage 数值；明确禁读 summary / details / systemMessage / firstKeptEntryId / customType / data / content / note；其他类型只检测顶层 `usage` 键、不读值、不输出类型名；provider / model / kind 经 §3.1 正则且拒绝路径形值；entry id 只作内部去重，不进入输出；argparse 错误转固定 `invalid_arguments`；未知键报 `unknown_field`；stdout / stderr 不含路径或异常文本；比较报告只投影必要元数据。F13 (d) 与 T-11 `test_privacy_sentinels_absent` 覆盖新字段的哨兵。
- [x] D-12 写出安全：out-dir 须已存在且在仓库外；`open(..., "x")` 独占创建；只清理本次成功创建的文件；不覆盖既有路径 / 选定来源 / 既有产物；清理失败如实给残留计数；外部替换竞态按 AGENTS §5.1 不加防护并写明。r3 / r4 未改。
- [x] D-13 可比性、分组与单位：基线不同只披露；模型 / 配置 / 范围 / 口径 / 格式差异标“不可直接比较”；条件缺失 → 未知；人工说明不移除警示；分组按维度各自守恒、只在已确认去重总体内；单位与分母逐项标明（r4 把 json 来源经 `entry_appended` 抽取的记录纳入“用量归属记录”单位）；无金额；不对单样本下节省结论。
- [x] D-14 真实试点依赖定义清楚：T-12 标 BLOCKED（外部），AC-008-1 / AC-008-3 待用户显式选择并授权，“继续”不构成授权；未被伪称满足；选定前 Review 不得判这两条通过；不阻塞 T-01～T-11 离线实施。外部依赖，非需求质量缺陷。

## R2 发现复核（逐项 CLOSED / OPEN，由本轮 A 判定；作者与 Analyze 的陈述不是关闭）

| R2 发现 | 状态 | 核对位置（plan.md r4 / tasks.md） | 理由 |
|---|---|---|---|
| P3-R2-1 未引用 toolResult“照计”缺限定 | **CLOSED** | plan §3.4 第 6 层末句；§5 F8 负例与 AC-004-3 行；tasks T-06 完成标准 1 | 限定为“仅单来源或 flag=true”；多来源 flag=false / 缺省 → 全部带 usage 的 toolResult 入未确认分区、各来源值单列、完整总计 unknown；F8 已含“flag=false + 选入未声明子来源”负例并由 `test_nested_link_negative_cases` 承接；反例重走无重复计入 |
| P3-R2-2 峰值范围未写明 | **CLOSED** | plan §3.3 来源上报输入、§3.6 `tokens`、§5 AC-003-3 / AC-007-1；tasks T-04 完成标准 2、T-10 完成标准 1 | 固定标签“主 assistant 尝试内的来源上报输入峰值”含 spec 原词；操作记录不参与并注明“非单请求值、请求数 unknown”；未新增可选操作记录峰值（R2 修复方向中的可选项未采纳，不影响关闭） |
| P3-R2-3 重试关联依赖未核实的事件顺序 | **CLOSED** | plan §4.4 括号规则与“源码核实的顺序”、§7 r3 源码核实元数据、§5 F2 正例 + 三负例；tasks T-03 抽取、T-07 完成标准 4 | 按 1.4.0 公开源码核实 `message_start` 恒在 `auto_retry_start` 之后、`auto_retry_end` 之前（本会话复核一致，见 D-08）；规则改写为可判定括号；补了取消、链式重试、`auto_retry_end(false)` 后新 prompt 三类负例；失效方向仍只会少计，`total` 恒 unknown 不变 |
| P3-R2-4 “未以 settled 收尾”需记录级判据 | **CLOSED** | plan §3.2 执行结果行、§4.2 收尾判据、§4.7 main_attempts、§5 F6 / AC-001-4；tasks T-03 完成标准 3 | 末个 `agent_settled` 之后无 17 种运行活动、只允许 4 种非运行类记录（与 json.md 一致）；未知尾随类型 / 新运行未 settled / 无 settled → `stream_not_settled`；不用时间戳；新增 `test_stream_settled_tail_rule`；退出码定义不变 |
| P3-R2-5 (i) 缺 `totalTokens` 对账、(ii) 第 4 / 6 层交互 | **CLOSED** | (i) plan §3.3 总量、§5 F7 / AC-003-2，tasks T-02 完成标准 3；(ii) plan §3.4 第 4 层“本层先于第 6 层”与第 6 层 (d)、§5 F8 / AC-004-3，tasks T-05 完成标准 1、T-06 完成标准 3 | (i) 缺 `totalTokens` → 不对账、不标 unreconciled（符合 AC-003-2 不假设来源提供全部字段）；存在但无效 / 不符 → unreconciled；F7 含正负例。(ii) 第 4 层先执行，净新增集参与 (d) 的逐维 Σ 与完整性要求，复制件不参与；`parent_not_selected` / 血缘未确认 → unverifiable；新增 `test_lineage_net_new_before_nested_coverage` |

## 审核发现（R3，新发现；仅 P3，不阻塞）

### P3-R3-1 tasks.md 内部可追溯性两处小瑕疵

- **(i) 位置**：tasks.md“AC 覆盖表”AC-001-1 行列出任务 `T-02、T-11`，但 T-02 的 3 条完成标准只引用 AC-001-4 / AC-001-2 / AC-003-2，未引用 AC-001-1；`test_only_selected_sources_opened` 只在 T-11。其余 26 行的任务列均与所列任务的完成标准引用一致（本会话逐行核对）。
- **反例逻辑**：按覆盖表追溯 AC-001-1 到 T-02 时，找不到对应的完成标准与验证命令，“完成标准与验证命令一一对应、必须引用 AC 编号”的追溯在这一行断开；Implement 时若只按 T-02 勾任务，无法据此判断 AC-001-1 的哪一部分已覆盖。
- **修复方向**：二选一：覆盖表 AC-001-1 行改为只列 `T-11`（T-02 只是实现位置，不是验证位置）；或在 T-02 加一条“部分满足 AC-001-1：`read_source` 只打开清单列出的文件”并配套一条验证命令。不改 Plan，不触及冻结 spec。
- **(ii) 位置**：T-11 完成标准 8～10（模块全部测试通过、后端全量回归不新增失败、范围核对）未引用 AC 编号。
- **说明**：这三条是仓库纪律（AGENTS §4“提交前跑测试”、Plan §1 / §6 范围与回滚约束）而非 AC 断言，Analyze R1 / R2 已指出并接受；1～7 条已覆盖 T-11 全部 AC，不影响 C-09。
- **修复方向**：在三条前加“（非 AC，Plan §1 / AGENTS §4）”标注，避免被误读为 AC 覆盖；可在实施提交时顺带修正。

## 非阻塞观察（不是发现，不要求回 Plan / Tasks）

1. **估时满载**：T-02 / T-03 / T-04 / T-07 / T-10 均为 2h 上限，T-04 含 7 条标准与 F13 夹具，T-11 含 7 个端到端测试 + README；仍在模板的 0.5～2h 内，但实施者若超时应按工作流拆分任务（在 tasks.md 追加子任务）而不是压缩测试，不构成本轮缺陷。
2. **json.md 与源码范围差**：json.md 把 `entry_appended` 描述为“扩展通过 `pi.appendEntry()` 追加的 custom 条目”，源码实际还经该事件发出缓存预热 usage 条目与边界草稿 compaction；Plan §7 r4 已注明以源码为准，§6 已写明版本漂移须回 Plan。实施者构造 F13 时应按 §5 的事件顺序安排（Analyze R2 观察已指出）。
3. **error 结局的用量只作下界**：§3.3 把 `stopReason=error` 的正数用量记为 partial（下界），因此含任何失败尝试的批次 tokens 永不 complete。这是 R2 已接受的保守口径，与 AC-003-4 / AC-004-1 一致，本轮不重开。

## 静态核对（本会话实际执行，均为只读；不是功能测试）

- `git rev-parse HEAD` = `9f60aecd7a5b972deb0a13803db62db3b5be65c9`；`git status --short` 开始时为空。
- `git diff --stat 57d0d84..HEAD`：9 个 Markdown 文件，+878/−131，无代码；`git diff --check 57d0d84..HEAD` 退出码 0；spec.md 不在 diff 中（blob 4689093 不变）。
- 冻结 spec 锚定正文 SHA256（LF 归一化）= `a504fed8…e823`。
- R2 归档：`git show HEAD:specs/dev-harness-budget/checklist.md > checklist-r2.md`，SHA256 = `1a667287…63d0c`，`git hash-object` = `40b0b87`，与 R2 原件 blob 相同；R1 归档 blob 哈希复算 = `dbe95b58…5dc3`。
- spec AC 集合 27 = Plan §5 表 27 行 = tasks 覆盖表 27 行；tasks `test_*` 集合 = Plan §5 集合（Plan 另含既有 `test_app_packaging`）；48 条 `-k` 表达式全为 Plan 测试名，无子串碰撞；12 项任务完成标准 / 验证命令条数相等；T-01～T-11 依赖线性无环。
- pi 1.4.0 公开安装包哈希与 Plan §7 r3 / r4、Analyze R1 / R2 记录一致（agent-session.js 436e8be3…、cache-warmer.js 9c4b0009…、session-manager.js 046b6a11…、json.md f1031918…）；源码顺序与发射点核对结果见 D-08 / D-02 / C-05。

## 后续条件

- 有效清单 23/23 已满足 Implement 的 checklist 前置；Implement 仍须：按 [model-routing.md](../../docs/development/model-routing.md) 派工（首选 `openai/gpt-6-astra`，先探活）、按 tasks.md 依赖顺序执行 T-01～T-11、过程中不改任何 checklist 文件；P3-R3-1 可在实施提交中顺带修正，不要求再开 Checklist 轮次，除非修订触及 Plan §3.4 / §4.2 / §4.4 / §4.7 的规则本身。
- T-12 / AC-008-1 / AC-008-3 须用户另行显式选定并授权文件；本文件不授权真实试点、Review 或 Gate 2，不改变 27 条 AC 的未勾选状态。
