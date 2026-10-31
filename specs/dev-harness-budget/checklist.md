# Feature: dev-harness-budget v1 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员 A 生成并勾选。只有 A 认为满足的检查标准才勾选；
> 勾选只代表**需求 / 设计质量**达标，**不代表**实施完成、测试通过或任何 AC 通过。实施者不勾选本文件。
> 审核员 A 单审，结论即审核结论；不做投票，也不要求第二名审核员形成共识。本轮 A 为新开独立会话，仅本轮；不与 R1 / R2 / R3 的 A 形成共识或投票。

## 头部记录

- **当前有效轮次**：**R4**（本文件）。审查固定提交 `ecd0bd6c93e17a5cbe5eb26aa0aac5fdb8fb8a7f`（在新建的分离 Temp 工作树 `fai-docnav-20261030/budget-r4-review-tree` 中 `git rev-parse HEAD` 核对一致，`git status --short` 开始时为空）。
- **轮次历史（分开记录，历史轮次不是当前有效结论）**：
  - R1：审查候选 `a261657`，A = `claude-opus-5-5 via anthropic`（回退 1），结论未通过（0 P1、4 P2、3 P3，16/23）。归档 [checklist-r1.md](checklist-r1.md)，Git blob `aef3138`，LF SHA256 `dbe95b58fa4abf45ba79593716d823b643ea682c9380459a62f2cf52d7cb5dc3`。
  - R2：审查 `57d0d84`（Plan r2），A = `claude-fable-5-1 via anthropic`，结论通过但 21/23。归档 [checklist-r2.md](checklist-r2.md)，blob `40b0b87`，LF SHA256 `1a667287562a1d13c3ddac74fd0196e6d4ccacea88d8e98127f285dc25a63d0c`。
  - R3：审查 `9f60aec`（Plan r4 + Tasks），A = `claude-fable-5-1 via claude-bridge`，结论通过 23/23（0 P1 / 0 P2 / 1 P3）。R3 原件已在本轮覆盖前**逐字节归档**为 [checklist-r3.md](checklist-r3.md)：归档字节 = `ecd0bd6` 中本文件的 Git blob `04fe4b1`，LF SHA256 `222a97e2e2d07bb373b62a7ec4322cc849031eddce8a5cbbbb8b5c63defdd34a`（本会话用 `git show HEAD:specs/dev-harness-budget/checklist.md > checklist-r3.md` 后 `sha256sum` 实算一致）。R3 只覆盖 Plan r4，不覆盖 r5～r7 改动的规则。
  - R4（本轮）：审查 Plan r7（blob `175fc2e`；r7 = r5 规则 + Analyze R3 / R4 的 r6 / r7 修正）、Tasks（blob `771c9b5`，T-01～T-20）、Analyze R5（有效）与 `9f60aec..ecd0bd6` 真实 diff，结论见下。
- **审核员 A（R4）**：`claude-fable-5-1 via claude-bridge`，即 [model-routing.md](../../docs/development/model-routing.md) 审核员 A 行的**首选模型 + 首选通道**。协调者在派工前对 claude-bridge 做了一次最小真实调用成功（协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局 pi 配置。
- **结论约束（规则 6）**：本轮结论即审核结论，**即使为未通过也是最终结论**；不得为求通过再换模型，无投票或共识。
- **独立性披露（规则 3 / 7）**：新开会话，上下文中没有任何作者 / 协调者 / Analyze / 实施者会话内容；在固定提交的分离 Temp 工作树中只读审查，未写主工作区，未做任何 Git 写操作（无 commit / 分支 / reset / push）、未联网、未安装、未派 agent、未运行任何测试或 Python 模块导入（只用 `python -I` 的独立脚本做文本哈希与计数），未读取真实 `~/.pi` 会话、actor / agent 原始日志、Temp 负载或试点数据。A 的模型（`claude-fable-5-1`）与 Plan / Tasks / Analyze 作者（`claude-opus-5-5`）不同，与已实施 T-01～T-15 及拟实施 T-16～T-20 的模型（`openai/gpt-6-astra` / `deepseek/deepseek-flash`）不同。本轮只判 plan r7 + tasks 的需求 / 设计质量，不评审代码（代码由 Review R2 评审）；现行代码只做了两处 `grep`（`known_subtotal` 空集为 None、`no_usage_records_observed` 两处追加点），用于核对 T-18 / T-19 期望与现行行为的衔接，不是代码评审。
- **本轮产出限制**：只新建 `checklist-r3.md`（归档）并重写本文件；未改 spec / plan / tasks / analyze* / converge* / code-review* / review / checklist-r1 / checklist-r2 / HANDOFF / 索引 / 代码。下方“静态核对”均为本会话实际执行的只读检查，plan / tasks 中的未来命令一律未执行。本文件**不授权**实施开始以外的任何事项，尤其不授权 Review R2 或 Gate 2；T-12 真实试点的授权来自用户（review.md），不来自本文件；27 条 spec AC 保持未勾选。

输入清单（路径 @ 提交或 blob + 适用章节）：

```
AGENTS.md @ ecd0bd6（blob ee8e4ab）全文
docs/development/model-routing.md @ ecd0bd6（blob f980f5c）全文
docs/development/workflow.md @ ecd0bd6（blob 4aca344）全文（总规则、第 5～10 步、Gate 1 / Gate 2 重点）
templates/checklist.md @ ecd0bd6（blob 8da2b31）全文
templates/tasks.md @ ecd0bd6（blob 4b7f955）全文
specs/dev-harness-budget/spec.md @ ecd0bd6（blob 4689093，自 57d0d84 起不变）全文；冻结正文核对：锚定行首 "## 1." 至文末、LF 归一化后 SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算）；`- [ ] AC-` 27 条、`- [x]` 0 条
specs/dev-harness-budget/plan.md @ ecd0bd6（blob 175fc2e，r7）全文（408 行分 3 段完整读取：头部与输入清单、§1～§7 含 r3～r7 修订史与源码核实元数据）
specs/dev-harness-budget/tasks.md @ ecd0bd6（blob 771c9b5）全文（496 行分 2 段）
specs/dev-harness-budget/analyze-r5.md @ ecd0bd6（blob 45c4e77，Analyze R5，有效）全文
specs/dev-harness-budget/analyze.md（2caea51）、analyze-r2.md（b96ddab）结论节；analyze-r3.md（e7fbc98）、analyze-r4.md（0fb9a28）输入清单、结论、发现与解决表（历史，用于追溯 r6 / r7 的修订来源）
specs/dev-harness-budget/code-review-r1.md @ ecd0bd6（blob 2272b21）全文
specs/dev-harness-budget/converge-r4.md @ ecd0bd6（blob 38b87a3）头部与结论节
specs/dev-harness-budget/checklist.md @ ecd0bd6（blob 04fe4b1，SHA256 222a97e2…）R3 全文（现归档为 checklist-r3.md）
specs/dev-harness-budget/review.md @ ecd0bd6（blob 72cbed9）头部，以及自“Checklist R3 与实施前状态”至文末各节
真实 diff：git diff --stat 9f60aec..HEAD（19 文件，+5807/−147：代码 3 新文件 + backend/README.md 一行、HANDOFF / specs/README 状态行、本 feature 的 analyze-r3～r5 / converge* / code-review-r1 / checklist-r2 / checklist / plan / review / tasks）；plan.md +109 行级差、tasks.md +232 行级差逐段阅读；git diff --check 9f60aec..HEAD 退出 0；spec.md 不在 diff 中
现行代码（只读 grep，非评审）：backend/tools/dev_harness_budget.py（3d81548）`known_subtotal`（1248 行空集为 None）与 `no_usage_records_observed`（1229 / 1261）出现行
pi-coding-agent 1.4.0 公开安装包（非本仓库，有界只读佐证，未打开任何 .md）：dist/core/nested-tool-calls.js（SHA256 62a69500…c034，与 plan §7 r5 一致）5、106、116、125–135、144、160–178 行；dist/core/agent-session.js（436e8be3…1162，与 plan §7 r3～r5 一致）384–414 行 emit 接线、708–727 行 toolResult `message_start` 时 `takeRecord` 并合并 usage
```

## 结论（R4）

**Checklist R4 通过，有效清单 23/23**——P1 = 0，**P2 = 0**，P3 = 1（新发现 P3-R4-1：plan / tasks 头部输入清单未按 workflow 总规则第 5 条补记 r6 / r7 行，纯过程记录缺口，不阻塞）。Review R1 的 P2-CR-1 与 P3-CR-1～3 经本轮按 Plan r7 实际文本、Tasks T-16～T-20 与冻结 spec 独立核对，**在设计层面已解决**（逐项见“Review R1 发现的设计层复核”；代码是否修好由实施后的 Review R2 判定，本轮不替代）。Analyze R3 / R4 的 5 项 P3 由 Analyze R5 判已解决，本轮独立复核同意（见 C-05）。R3 的 P3-R3-1 已在第 4 批实施中修正（AC-001-1 行只列 T-11；T-11 完成标准 8～10 标“非 AC”），本会话核对 tasks.md 现文一致，CLOSED。真实 diff 中 HANDOFF / specs/README / review 的改动只是状态记账，与 Plan / Tasks / Analyze 内容一致，未发现回归。

**本结论的含义**：只代表需求 / 设计质量达标，满足 Implement T-16～T-20 的“有效 checklist 全部勾选”前置条件（T-16 依赖行所要求的“最新一轮 Analyze 通过 + 有效 checklist R4 全部勾选”自此两项均成立）。它**不是**实施、测试、任何 AC 完成、Review 或 Gate 2，**不授权**真实试点：T-12 的授权与范围由用户在 review.md 给出，本文件只核对其状态与依赖记录一致。27 条 spec AC 保持未勾选；Implement 仍须按 model-routing 派工、按 tasks.md 依赖顺序执行，并在过程中不改任何 checklist 文件。

## 需求完整性

- [x] C-01 每条需求都有至少一条可验证的验收规则：8 组 R、27 条 AC（4+3+4+3+4+2+4+3）均含可测断言或数值示例（170 / 150 / 12 / 10 s / 20 s / 30 s、“已知小计 50、未知 1”）。本轮按冻结正文（哈希一致）重核，未变。
- [x] C-02 无未澄清歧义：spec §5 Q-001～Q-020 闭环；唯一产品层待决项（真实试点批次选择）已由用户 2026-10-31 显式授权（review.md“用户对 Review R1 的处置与试点授权”节，原话“全修，T-12同批完成，授权脱敏”，范围取窄解释）。r5～r7 的全部修订（嵌套执行事件视图、未确认分区分母、血缘父不可用、守恒计算、T-12 文字）都是冻结 AC 之内的设计细化：AC-005-1 原文已要求“来源暴露的嵌套工具调用按其标识纳入并去重”，r5 只是补上真实事件形状，未改任何 what；Analyze R3～R5 亦判不需回 Clarify，本轮同意。
- [x] C-03 目标与非目标边界清晰：只观测、不约束；与产品运行时预算（D-019 / D-022 / D-023）无关；不计费；无常驻服务；不改全局规则或被观测批次；不为采样额外调用模型。Plan r7 与 Tasks 未越界：T-16～T-20 仍只改 3 个既有文件，无新依赖（测试另用标准库 `ast`）、无新来源格式、无阈值；T-12 不新增模型调用、不重跑任务，清单与报告只放仓库外 Temp。
- [x] C-04 冻结完整性：锚定正文 SHA256 仍为 `a504fed8…e823`（本会话实算）；spec.md 自 `57d0d84` 起 blob 不变（4689093），不在 `9f60aec..HEAD` diff 中；27 条 AC 逐字未变且均未勾选。Plan §5 与 tasks AC 覆盖表均为 27 行、编号集合与 spec 相等、无重复（本会话脚本核对）。

## 一致性

- [x] C-05 spec / plan / tasks 之间无冲突（Analyze 报告无遗留问题）：**Analyze R5（审 `e467c89`）判 PASS，0 P1 / 0 P2 / 0 P3**；`e467c89..ecd0bd6` 未改 plan / tasks（blob 175fc2e / 771c9b5 与 Analyze R5 输入清单一致），故 Analyze R5 的输入即本轮受审 Plan r7 / Tasks。本轮独立复核 Analyze R3 / R4 五项 P3 的解决：P3-AN-R3-1（T-12 修改范围改为协调者编写清单、只列 `budget-*.jsonl` / `review-budget-*.jsonl`、清单与 out-dir 均在系统 Temp，与 review.md 授权节一致）；P3-AN-R3-2（§3.4 第 4 层、§3.6 `sources[]`、§5 AC-004-3、T-19 统一为“凡 `net_new_determined: false` 的血缘情形复制件数与净新增数为 unknown”，T-19 明列 542 / 565 行既有断言改正并只改 `lineage_conflict` 分支）；P3-AN-R3-3（T-16 完成标准 1 含 F2 已解析嵌套 `call_ref` 集合 = 记录集合 2 / 2）；P3-AN-R4-1（T-16 依赖改为“最新一轮 Analyze（R5 或其后）通过 + 有效 checklist（R4 或其后）全部勾选”，可满足；其他任务不以 Analyze R3 为闸门，本会话逐任务核对依赖行）；P3-AN-R4-2（T-12 被观测 feature 写明为 `dev-harness-budget`，顺序“前核对 → 报告命令 → 后核对 → 写记录”，plan §5 AC-008-3 行同步）。本轮逐条核对 spec AC ↔ Plan §5 ↔ tasks 完成标准语义（见 C-07 / C-08），未发现冲突；唯一新发现 P3-R4-1 是过程记录缺口，不构成 spec / plan / tasks 语义冲突。
- [x] C-06 与 docs/ 决策与 ADR 无冲突：落点仍为既有 `backend/tools/` 脚本目录，标准库 + 仓库已有 pytest / Git；不进 wheel、不改打包 / `.gitignore` / AGENTS / workflow / model-routing / provider / 路由 / 全局 pi 配置；无预算上限或干预；“无需 ADR”理由成立并写明“需改即停止回报”。r5～r7 新增内容（嵌套执行视图、未确认分区分母、血缘父不可用、守恒计算）均在脚本内部。T-12 试点按 D-025 把清单 / 报告放系统 Temp、只记脱敏计数，与 AGENTS §4 隐私规则一致。真实 diff 中 HANDOFF / specs/README / review 只改状态文字。
- [x] C-07 Plan 对 27 条 AC 的映射在语义上与 spec 一致：重点复核 r5～r7 触及的映射——**AC-005-1**：spec 要求“来源暴露的嵌套工具调用按其标识纳入并去重；未暴露的嵌套路径覆盖状态标为未知”。Plan §3.3 把带 `parentToolCallId` 的执行记为 `NestedExecutionRecord`、永不进入 direct；嵌套身份 = (来源, 顶层父调用身份, 子 toolCallId)，与父 toolResult `nestedCalls` 记录同法构造并按身份去重为 `nested_deduplicated`（matched / executed_only / reported_only）——这正是“按其标识纳入并去重”；session-v3 不持久化嵌套事件 → `nested_executed` unknown（`nested_events_not_persisted`）、`complete=false` → `nested_incomplete`，对应“未暴露路径覆盖状态未知”；`all_total` 在存在任何嵌套证据时 unknown，不新增已知值路径，符合 AC-004-3“未去重相加不称精确总计”。**AC-007-1**：“每项度量在声明的选定来源总体内的已覆盖 / 未覆盖 / 缺失计数……分母未知时百分比为未知”。Plan §4.3 / §4.7 把未确认分区与来源缺口同样处理：tokens / tool_calls 覆盖行、分组节分母与缺失数、token 节未知记录数为 unknown，另列 `unconfirmed_sources`（单位“来源”，不与记录数相加）；tool_calls 的分母只含 direct（嵌套执行不是模型发起的调用，不属于该视图声明的总体）且只计来源级未确认（记录级未确认只涉 toolResult 用量、不影响调用身份）——分母定义与声明总体一致，不冒充。**AC-004-3**：血缘父已选入但非 `loaded` → 不做键集差、`net_new_determined: false`、复制件数未知；父 `partial` 时父子入未确认分区（避免已确认小计重复计入）、各来源值单列、“未完全去重”；父 `unavailable` / `empty` 时父不贡献记录、子全部记录留在已确认总体、完整总计因缺口 unknown——均落在“缺可靠关联则各来源已知值保留、去重汇总未知”之内，未改写 AC。**AC-002-3**：守恒按维度分别计算并写入 `conserved`，只在已确认去重总体内，不跨维相加；失败时如实降级（`group_conservation_failed`、完整总计 unknown、tokens partial），与“等式只在已确认去重的同一总体内成立”一致，不以生产断言中断报告。**AC-003-4**：空的已确认集合用 `no_confirmed_records`，`no_usage_records_observed` 只属于 `empty` 来源；已知小计对空集为 unknown（现行代码 1248 行亦为 None），不显示“总计 0”。无 AC 被 Plan 改写含义。
- [x] C-08 每条验收规则都能映射到确定的测试期望或手动验收步骤：Plan §5 每行给出测试名、样例与字面量期望；tasks 中全部 `test_*` 与 Plan §5 的集合双向相等（本会话脚本核对，差集为空）；60 条 `-k` 表达式中的名称全部为 Plan §5 测试名且名称间无子串碰撞；T-16～T-20 的字面量（F14 (a) direct 1 / `nested_executed` 2 / `nested_deduplicated` 2 matched 2 / 分母 1 / 100%；(c) 去重后 3 = matched 2 + executed_only 1、partial；(d) 2 = matched 1 + executed_only 1、`nested_incomplete`；F5 `double_capture` 分母 unknown、`unconfirmed_sources` 2、`no_confirmed_records`、退出 0；F8 `undeclared` tokens 未确认 1 / tool_calls 0 / 分母 1；父缺失 / 只有 header → 子 180 = 批次 180、父坏行 → 170 / 180 单列、批次 null）均可由 §3.3 / §3.4 / §4.3 / §4.7 规则唯一推出，本会话逐条重算一致。F1 = token 度量 complete、D1 = `build_report` 边界注入、T-12 = 手动步骤，三层数据不混称；AC-008-1 / 008-3 为手动验收，“已授权、执行并经 Review 前不判通过”写明。

## 可测试性

- [x] C-09 任务粒度与验证命令满足 tasks.md 模板要求：20 项任务均有依赖 / 估时 / 上下文 / 修改范围 / 完成标准 / 验证命令；估时均在 0.5～2h 内（T-16 1.5–2h、T-17 / T-18 1–1.5h、T-19 / T-20 0.5–1h、T-12 0.5–1h）；完成标准与验证命令条数逐任务相等（T-12 2/2；T-16～T-20 3/3/3/3/4，本会话脚本核对）且逐条同编号对应：T-17 命令 2 用 `or` 同时跑嵌套测试与 T-14 分组分母测试，对应完成标准 2 的“只选 F1 摘要逐字不变（T-14 哈希断言照过）”；T-18 命令 2 跑 `test_header_only_not_zero` + T-15 测试，对应完成标准 2 的“`empty` 来源仍为 `no_usage_records_observed`”；T-19 命令 2 把四个血缘测试一起跑，对应完成标准 2 的 `net_new_determined: false` 一致性与 F8 lineage 1 / 1 对照。每条完成标准都引用 AC 编号或标“（非 AC，Plan §1 / AGENTS §4）”，本会话脚本核对无遗漏；覆盖表 27 行中每个任务的完成标准都引用了该行 AC（脚本核对无 MISMATCH，R3 的 P3-R3-1 (i) 已修）。依赖 T-01→…→T-11→T-13→…→T-20 线性无环；T-12 依赖 T-11、T-13～T-15、T-16～T-20，状态“已授权，未开始”，与 review.md 授权节、plan §5 / §6、Analyze R5 记录一致。T-16 / T-19 明列既有测试修正规则（F2 真实形状后 direct 1 / `nested_reported` 2 / partial 不变；542 / 565 行改 `is None`），并要求逐条记入 review.md、不得为通过放宽断言。文件范围仍为 3 个代码文件（“通用约定”写“均新建”是 r3 时文字，T-20 标准 4 已写“3 个既有文件”，含义一致）。

## 本 feature 自定义项

- [x] D-01 范围与工具约束：单文件标准库脚本 + 测试 / 夹具辅助模块，不进 wheel；无新框架、新产品功能、路由或预算上限；回滚 = 删除新增文件。r5～r7 与 T-16～T-20 未扩大文件集合或依赖（AST 检查用标准库 `ast`，只在测试中）；T-12 无仓库代码改动。
- [x] D-02 支持的两种格式与原生缺口如实写明（r5 重核，含嵌套执行事件）：§3.2 能力矩阵新增的两行与 pi 1.4.0 公开源码一致——本会话核对 `nested-tool-calls.js`：106 行子 id 为 `` `${callerId}/${n}` ``；116 / 144 / 163 行 `tool_execution_start` / `update` / `end` 均带 `parentToolCallId: callerId`；125–135 行以子 toolCall.id 为键新建作用域并共享同一 `recorder`（故孙调用的 `callerId` = 子调用 id、各深度记入同一顶层记录，与 §3.2“任意深度的 `parentToolCallId` 都是直接调用者”“各深度嵌套调用的有界记录”一致）；72–78 行 `snapshot` 有 unfinished 则 `complete=false`（与 F2 记录状态一致）；168–175 行 `takeRecord` 返回 `{calls, usage}`。`agent-session.js` 384–414 行 `_executeNestedToolCall` 的 `emit` 经 `_extensionRunner.emit` 后 `this._emit(event)` 进入会话事件流；708–727 行在 toolResult `message_start` 时 `takeRecord` 写入 `nestedCalls` 并 `combineUsage` 进 `message.usage`，`agent_end` 时清空——与 §3.2“嵌套 usage 已并入父 toolResult、嵌套 `tool_execution_end.result.usage` 不读、不重复计”一致，token 口径无需改动的结论成立。json 流原样写出（json-event.js 只改写 `message_update`，Review R1 与 Analyze R5 已核实、哈希一致）。session-v3 列“嵌套执行事件不持久化、只有记录视图”与 153 行“Nested results are not persisted”一致。r4 的 `entry_appended` 行与 R3 核对结论未变。已核实盲区（branch summary、失败预热、物理请求、session-v3 的进行中尝试 / 重试 / 工具耗时 / 嵌套事件）与 `unobserved_paths` 一致。
- [x] D-03 隐私与零调用 / 只读边界的测试设计：审计钩子只在被测接口调用期间计数 socket / 进程 / kill / system / open；源只 `rb` 打开；源与沙箱 spec 状态前后哈希比对；控制动作单独观测；钩子只在测试辅助模块。r5～r7 与 T-16～T-20 未削弱；T-16 把 `parentToolCallId` 哨兵加入 `privacy_rows` 并由 `test_privacy_sentinels_absent` 检索（T-16 完成标准 2 / 命令 2）。T-12 试点以“前核对 → 报告 → 后核对 → 写记录”顺序核对被观测 feature 哈希与 `git status`，记录不属于被比较状态，AC-001-4 (a)(b) 口径不被自观测破坏。
- [x] D-04 选定总体完整性：缺失 / 不可读 / 不支持 / 截断 / 坏行 / `empty` / `stream_not_settled` 均阻止完整总计（§4.3 第 1 条）；`entry_unrecognized` 出现即 unknown（第 3 条）；r5 第 2 条扩展：`lineage_parent_unavailable` 与 `parent_not_selected` 同为选择 / 关系缺口，完整总计 unknown；空的已确认集合用 `no_confirmed_records`、已知小计 unknown（不填 0），`no_usage_records_observed` 只属于 `empty` 来源；守恒失败 → 完整总计 unknown。空集不推出“全部已知”；有效来源已知值保留；无假“完整总计 0”。
- [x] D-05 累计快照取最终值，非最终只作下界：6/10/12 → 12；无 `message_end` → 非最终、下界 10 不入已知小计；不单调 → unknown；json 按归属事件去重，`turn_end` / `agent_end` 不重复计；toolResult 只在 `message_end` 归属（第 2 批先修，Plan §3.2 原文）；`entry_appended` 内按 entry id 去重；r5 嵌套执行事件不携带用量进入 token 聚合，不会重复计入父 toolResult 已合并的嵌套 usage。
- [x] D-06 零值、出处与估计值：默认 0 → unknown，只有带出处的 `confirmed_zero` 才记已知 0；`totalTokens` 只对账且缺失不标 unreconciled；不读 `cost`；不展示 `tokensBefore` / `estimatedTokensAfter`；峰值固定标签“主 assistant 尝试内的来源上报输入峰值”含 spec 原词，操作记录不参与并注明；r5～r7 未改。`nested_executed.observed_total` 对 json-events 来源无嵌套事件时为 0，是事件计数（确认观测到 0 个此类事件），不是用量值，与 AC-003-4 的“未知 ≠ 0”不冲突；session-v3 全选时如实为 unknown。
- [x] D-07 来源关系图的去重语义完整（r5 / r6 重核：血缘父不可用）：第 0 层并集图校验、第 2 层两种单层星形、第 4 层先于第 6 层、第 6 层 (d) 净新增逐维比较不变。新增：父已选入但非 `loaded` → 不做键集差、`lineage_parent_unavailable`、`net_new_determined: false`、复制件数 / 净新增数 unknown；父 `partial` → 父子另入未确认分区（父已读到的记录可能在子中有复制件，若两者都留在已确认总体会重复计入——本轮用 T-19“父坏行”情形重走：父 170、子 180 各自单列，批次已知小计 null、“未完全去重”，无重复）；父 `unavailable` / `empty` → 父零记录、子全部记录留在已确认总体（与 `parent_not_selected` 同理，不存在重复计入的另一方），完整总计因缺口 unknown；第 6 层 (d) 对 `lineage_parent_unavailable` 子来源直接判 `nested_coverage_unverifiable`。r6 把 `lineage_usage_conflict` 与落入 `relation_shape_unsupported` 分量的血缘对也统一为复制件数 / 净新增数 unknown，消除了 Analyze R3 指出的 §3.4 / §3.6 / T-19 口径不一；无血缘来源的 0 / 全部记录明确“不表示未知”。工具计数按 owner 命名空间身份不变。
- [x] D-08 计数口径诚实（r5 重核：direct 与嵌套视图）：尝试 / 操作记录分列、request_count 恒 unknown、重试 `total` 恒 unknown、§4.4 括号规则不变（R3 已按源码核实）。新增：`direct` 只含不带 `parentToolCallId` 的执行证据（源码核实模型发起的调用由 agent-loop `emitToolExecutionEnd` 发出、不带父 id）；带父 id 者记为 `NestedExecutionRecord`，父调用只在同一 owner 作用域内解析（direct 恰一条 → 顶层；已解析嵌套子 id 恰一条 → 继承；零或多候选 → `nested_parent_unresolved`，仍为嵌套、不改判 direct）；不从 id 字符串推断父子；嵌套身份与 `nestedCalls` 记录同法构造并按身份去重；`direct` 与任何嵌套视图永不相加；`nested_parent_unresolved` / `nested_execution_incomplete` / `nested_incomplete` 阻止 tool_calls complete 但不改变 direct 计数、分母与覆盖率；`all_total` 存在任何嵌套证据即 unknown。本轮用 Review R1 的复现（1 条 direct `call_1`、嵌套 `call_1/1`、`call_1/2`、记录 2 条 `complete=true`）按 r5 规则重走：direct 1、`nested_executed` finished 2、`nested_reported` 2、`nested_deduplicated` 2（matched 2）、tool_calls complete、分母 1 / 100%、`all_total` unknown——与 T-17 (a) 期望一致，P2-CR-1 的“direct 3 / 100%”不再出现。F2 中 `call_0/2` 的 end 在父 toolResult 之后：toolResult 不是 assistant `message_end`，owner 作用域不变，可配对为 finished（Analyze R4 已核对夹具顺序，本轮同意）；若真实流中嵌套 end 落在下一条 assistant `message_end` 之后，会成为新作用域内父未解析的 terminal_only → `nested_parent_unresolved`、tool_calls partial，方向保守、只会少判 complete，不会抬高 direct。
- [x] D-09 时间口径：原生时间戳不作耗时 / 下界 / 运行边界；确认墙钟只来自带出处标注；超时可有已知耗时；时间独立于 token 去重分区与来源采集状态；不丢弃时间未知的会话来凑窗口；无偏移不跨来源比较。r5～r7 未改 §4.5。
- [x] D-10 按度量的完整性判定与可达性、夹具可行性（r5 重核：未确认分区下的分母）：§4.7 六项度量单位 / 总体不变；tool_calls 行 complete 条件同向收紧（新增 `nested_parent_unresolved` / `nested_execution_incomplete` 两个阻断原因），分母只含 direct；覆盖计数分母在“任一来源非 loaded **或**存在未确认分区”时为 unknown，百分比随之不给——与 T-13～T-15 的来源缺口口径同构，Review R1 P3-CR-1 的“分母 0 / 缺失 0”不再出现；`covered` 与已知小计照常给出；全部 loaded 且无未确认分区时输出不变（T-14 摘要哈希断言作为回归守卫，T-17 / T-18 命令 2 显式复跑）。tokens 与分组按来源级或记录级未确认计数、tool_calls 只按来源级，三者单位“来源”、不与记录数相加。守恒改为计算后 tokens 状态须在分组计算之后进入 `observation`（T-20），顺序可实施。退出码 0 / 3 / 2 / 1 不变：F5 `double_capture` 全部 loaded → 退出 0、`sources=ok`，同时分母 unknown——四层状态分列的设计使这不矛盾（采集无缺口 ≠ 度量覆盖已知）。F14 (a)～(f) 的事件顺序按 agent-loop 380–470 行（顺序 / 并行执行）构造，可行。
- [x] D-11 安全投影与固定错误（白名单含 r5 新字段）：§4.2 白名单新增 `tool_execution_start` / `tool_execution_end` 的 `parentToolCallId`，明确“只用于嵌套判定与内部身份哈希，不输出、不进入 records.json”；`tool_execution_update` 仍不读；raw id 只存在于 `_read_pi_json_events` 局部映射；`call_ref` / `root_ref` 为哈希引用，输出不含 toolCallId / parentToolCallId（T-16 完成标准 1、T-17 完成标准 1 均断言“输出不含”）；`nested_parent_unresolved` 为固定原因类别，不回显 id。T-16 把 `parentToolCallId` 哨兵加入 F2 隐私样例并由 `test_privacy_sentinels_absent` 检索（完成标准 2）。摘要新增的嵌套说明行只含计数。r4 的 `entry_appended` 白名单与禁读字段不变。
- [x] D-12 写出安全：out-dir 须已存在且在仓库外；`open(..., "x")` 独占创建；只清理本次成功创建的文件；不覆盖既有路径 / 选定来源 / 既有产物；清理失败如实给残留计数；外部替换竞态按 AGENTS §5.1 不加防护并写明。r5～r7 未改；守恒失败时报告照常写出（不中断、不 `internal_error`），与“产物是否写出”层语义一致。
- [x] D-13 可比性、分组与单位（r5 重核）：基线不同只披露；模型 / 配置 / 范围 / 口径 / 格式差异标“不可直接比较”；条件缺失 → 未知；人工说明不移除警示；无金额；不对单样本下节省结论；§4.6 未改。分组按维度各自守恒、只在已确认去重总体内，守恒结果为计算值 `conserved`，失败如实降级；分组节分母在来源缺口或未确认分区下为 unknown，另列 `missing_sources` / `unconfirmed_sources`（单位“来源”）；各组已知小计与已覆盖记录照常给出；单位与分母逐项标明。嵌套工具视图不进入分组或 token 分母。
- [x] D-14 真实试点依赖定义清楚（r5～r7 重核）：T-12 状态“已授权，未开始”，用户原话、授权范围（Temp 下本功能临时目录的 `budget-*.jsonl` / `review-budget-*.jsonl`，含修复循环新增同类捕获；不含协调者会话、`~/.pi`、其他项目或私有文档目录）、执行约束（协调者在 T-16～T-20 之后以最终代码运行、不新增模型调用、不重跑任务、只记脱敏计数）与依赖（T-11、T-13～T-20）在 tasks.md、plan §5 / §6、review.md 授权节、Analyze R5 四处一致；修改范围已对齐（无 `%LOCALAPPDATA%`、由协调者编写清单）；被观测 feature 写明为本功能，核对顺序明确，记录不属于被比较状态。AC-008-1 / AC-008-3 在执行并经 Review 前不判通过；27 条 AC 均未勾选。本文件不授权试点，只核对记录一致。

## Review R1 发现的设计层复核（由本轮 A 判定；作者与 Analyze 的陈述不是关闭；代码是否修好由 Review R2 判定）

| Review R1 发现 | 设计层状态 | 核对位置（plan.md r7 / tasks.md） | 理由 |
|---|---|---|---|
| P2-CR-1 嵌套执行事件（`parentToolCallId`）被计为 direct、tool_calls 标 complete、覆盖 100% | **设计层已解决** | plan §2 `NestedExecutionRecord` / `SourceFacts.nested_executions`；§3.2 工具执行证据 / 嵌套工具调用两行；§3.3 三条 r5 规则；§3.6 `tool_calls`；§4.2 白名单；§4.7 tool_calls 行与分母说明；§5 F2 修正、F14、AC-005-1 / AC-007-1 / AC-007-2 行；§6；tasks T-16 / T-17 | 带父 id 的执行永不进入 direct；父在同一 owner 作用域内解析，零 / 多候选 → `nested_parent_unresolved` 仍为嵌套；嵌套身份与 `nestedCalls` 同法构造并去重；direct 计数 / 分母 / 覆盖率不含嵌套；嵌套原因阻止 complete；`all_total` 保守。源码核实（本轮复核 nested-tool-calls.js 106 / 116 / 125–135 / 144 / 163、agent-session.js 384–414 / 708–727）支持规则前提。用 R1 复现重走得 direct 1 / complete / 分母 1，与 T-17 (a) 一致。F2 / F14 夹具按真实顺序构造，旧流（F12）计数不变有断言守卫 |
| P3-CR-1 全部 loaded 但未确认去重时“分母 0 / 缺失 0”，误用 `no_usage_records_observed` | **设计层已解决** | plan §4.3“空集原因”“未确认分区下的分母”两段；§3.6 `observation` / `tokens` / `groups`；§4.7 分母说明；§5 AC-003-4 / AC-007-1 行；tasks T-18 | 存在未确认分区 → tokens / tool_calls / 分组 / token 节分母、缺失、未知记录数 unknown，另列 `unconfirmed_sources`；`no_confirmed_records` 与 `no_usage_records_observed` 语义分开；全部 loaded 且无未确认分区时输出不变。T-18 的 F5 / F8 字面量可由规则唯一推出 |
| P3-CR-2 血缘父已选入但不可用 / 部分时子来源仍 `net_new_determined: true` | **设计层已解决**（r6 补齐同类情形） | plan §3.4 第 4 层、第 6 层 (d)；§3.6 `sources[]`；§5 AC-004-3 行；tasks T-19 | 父非 `loaded` → 不做键集差、`lineage_parent_unavailable`、复制件数 / 净新增数 unknown；父 `partial` 时父子入未确认分区；(d) 随之不成立；全部 `net_new_determined: false` 情形统一为 unknown；既有断言改正明列 |
| P3-CR-3 `_groups` 用生产 `assert` 守恒 | **设计层已解决** | plan §4.3“分组守恒不用生产断言”段；§3.6 `tokens` / `groups`；§5 AC-002-3 行；tasks T-20 | 守恒为计算值，false → `group_conservation_failed`、完整总计 unknown、tokens 降 partial、报告照常写出；AST 检查无 `assert`；不对私有函数打桩 |

## R3 发现复核

| R3 发现 | 状态 | 核对位置 | 理由 |
|---|---|---|---|
| P3-R3-1 (i) 覆盖表 AC-001-1 行列 T-02 但 T-02 未引用；(ii) T-11 完成标准 8～10 未标非 AC | **CLOSED** | tasks.md AC 覆盖表 AC-001-1 行（只列 T-11）；T-11 完成标准 8～10（“（非 AC，Plan §1 / AGENTS §4）”） | 第 4 批实施中按 R3 修复方向修正（review.md 第 4 批记录）；本会话脚本核对覆盖表 27 行所列任务均引用该 AC，无 MISMATCH；T-13～T-15、T-16～T-20 新增的非 AC 条目沿用同一标注 |

## 审核发现（R4，新发现；仅 P3，不阻塞）

### P3-R4-1 plan / tasks 头部输入清单未按 workflow 总规则第 5 条补记 r6 / r7

- **位置**：plan.md 输入清单代码块止于 r5；r6 一行写在代码块之外（紧随其后），没有 r7 行。tasks.md 输入清单止于 r5，没有 r6 / r7 行。
- **反例逻辑**：workflow.md 总规则第 5 条要求“阶段产物头部以纯文本记录一份小输入清单：每行‘路径 @ 提交 SHA 或文件 hash + 适用章节’”。r6 / r7 的基线提交与依据分别写在两份文件的头部修订行和 review.md“Plan r6 / Tasks 补正”“Tasks 补正 r7”两节，但那里只有基线 SHA 和改动摘要，不是“路径 @ hash + 章节”的输入清单；读者无法仅凭 plan / tasks 头部确定 r7 作者读的 analyze-r4.md / tasks.md 是哪个 blob。Analyze R5 已把这一点列为非阻塞观察 1，本轮判为 P3：它是过程记录缺口，不是 spec / plan / tasks 之间的语义不一致，不影响任何规则或 AC 映射。
- **修复方向**：在 plan.md 输入清单代码块内补 r6（移入代码块）与 r7 两行、在 tasks.md 补 r6 / r7 两行（各列 analyze-r3.md / analyze-r4.md、plan.md、tasks.md、review.md 的 blob 与章节），只改头部记录，不触及规则正文；可在 T-16 实施提交时顺带补记，不要求再开 Checklist 轮次。

## 非阻塞观察（不是发现，不要求回 Plan / Tasks）

1. **`nested_executed` 状态是否互斥**：plan 未写明 `parent_unresolved` 与 finished / unfinished / terminal_only 是否重叠（Analyze R5 观察 4）；T-17 (a) 同时断言 finished 2 / observed_total 2 / parent_unresolved 0，(c) 不断言 finished，两种理解都能通过。实施者选一种并在 report.json 中保持一致即可；若选“重叠”，摘要行“执行事件 N（父未解析 U）”已能表达。
2. **嵌套 end 跨 owner 作用域**：真实流中未被等待的嵌套调用若在下一条 assistant `message_end` 之后才结束，会在新作用域中成为父未解析的 terminal_only（见 D-08），tool_calls 判 partial。方向保守，符合“不从 id 字符串推断”的设计选择；真实试点若常见此形状，可在 Review R2 后作为后续观察，不改本轮结论。
3. **review.md 头部“当前状态”仍是 r5 时文字**（“待 Analyze R3 → …”），文末各节已记到 Analyze R5；属记账滞后（Analyze R4 / R5 均已指出），不在本轮写限范围内。
4. **tasks.md“通用约定”“均新建”**：三个代码文件现已存在，T-16～T-20 为修改既有文件；T-20 标准 4 已用“既有文件”，含义一致，无需改。

## 静态核对（本会话实际执行，均为只读；不是功能测试）

- `git rev-parse HEAD` = `ecd0bd6c93e17a5cbe5eb26aa0aac5fdb8fb8a7f`；`git status --short` 开始时为空。
- R3 归档：`git show HEAD:specs/dev-harness-budget/checklist.md > checklist-r3.md`，SHA256 = `222a97e2e2d07bb373b62a7ec4322cc849031eddce8a5cbbbb8b5c63defdd34a`，与派工说明给定值一致。
- 冻结 spec 锚定正文 SHA256（LF 归一化）= `a504fed8…e823`；`- [ ] AC-` 27、`- [x] AC-` 0。
- `git diff --stat 9f60aec..HEAD`：19 文件，+5807/−147；`git diff --check 9f60aec..HEAD` 退出码 0；spec.md 不在 diff 中。
- spec AC 集合 27 = Plan §5 表 27 行 = tasks 覆盖表 27 行（集合相等、无重复）；tasks `test_*` 集合 = Plan §5 集合（双向差集为空）；60 条 `-k` 表达式全为 Plan 测试名，无子串碰撞；20 项任务完成标准 / 验证命令条数相等（1/3/3/7/4/3/6/4/4/5/10/2/3/3/3/3/3/3/3/4）；每条完成标准引用 AC 或标“非 AC”；覆盖表所列任务均引用该行 AC；依赖 T-01→…→T-11→T-13→…→T-20 线性无环，T-12 依赖 T-11、T-13～T-20。
- pi 1.4.0 公开安装包哈希：nested-tool-calls.js `62a69500…c034`、agent-session.js `436e8be3…1162`，与 Plan §7 r5 / Analyze R5 记录一致；源码行核对结果见 D-02 / D-08。

## 后续条件

- 有效清单 23/23 已满足 Implement T-16～T-20 的 checklist 前置；Implement 仍须：按 [model-routing.md](../../docs/development/model-routing.md) 派工（首选 `openai/gpt-6-astra`，先探活）、按 tasks.md 依赖顺序执行 T-16→T-20、过程中不改任何 checklist 文件、既有断言改正逐条记入 review.md。P3-R4-1 可在实施提交中顺带补记，不要求再开 Checklist 轮次，除非后续修订触及 Plan §3.3 / §3.4 / §4.2 / §4.3 / §4.4 / §4.7 的规则本身。
- T-12 由协调者在 T-16～T-20 之后按已记录授权执行；本文件不授权试点、Review R2 或 Gate 2，不改变 27 条 AC 的未勾选状态；AC-008-1 / AC-008-3 在试点执行并经 Review 前不判通过。
