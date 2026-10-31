# Feature: dev-harness-budget v1 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员 A 生成并勾选。只有 A 认为满足的检查标准才勾选；
> 勾选只代表**需求 / 设计质量**达标，**不代表**实施完成、测试通过或任何 AC 通过。实施者不勾选本文件。
> 审核员 A 单审，结论即审核结论；不做投票，也不要求第二名审核员形成共识。本轮 A 为新开独立会话，仅本轮；不与 R1 的 A 形成共识或投票。

## 头部记录

- **当前有效轮次**：**R2**（本文件）。审查固定提交 `57d0d84dc7754e97eb255488d8a6918eb9b50d98`（`D:/2030/Futures-AI` 分支 `workbench` 的提交，在新建的分离 Temp 工作树 `fai-docnav-20261030/budget-resume-r2-review-tree` 中 `git rev-parse HEAD` 核对一致，`git status` 开始时干净）。
- **轮次历史（分开记录，历史轮次不是当前有效结论）**：
  - R1：审查候选 `a261657`，A = `claude-opus-5-5 via anthropic`（回退 1），结论未通过（0 P1、4 P2、3 P3，16/23）。R1 原件已在本轮覆盖前**逐字节归档**为 [checklist-r1.md](checklist-r1.md)：归档字节 = `57d0d84` 中本文件的 Git blob `aef3138e23093ec673c076650e30af0c75dbda8c`，全文 LF SHA256 `dbe95b58fa4abf45ba79593716d823b643ea682c9380459a62f2cf52d7cb5dc3`（与 review.md / plan.md 记录的 R1 哈希一致；工作树因 `core.autocrlf=true` 以 CRLF 检出，LF 归一化后与归档逐字节相同）。归档只是历史，不再是当前有效轮次。
  - R2（本轮）：审查 Plan r2 候选（plan.md blob `6119535`），结论见下。
- **审核员 A（R2）**：`claude-fable-5-1 via anthropic`，即 [model-routing.md](../../docs/development/model-routing.md) 审核员 A 行的**首选模型**。
- **通道与切换原因（规则 2 / 5，只记脱敏摘要）**：据协调者核实，同一协调 pi 会话内 `claude-bridge` 当窗限额已耗尽、无重置证据，按规则 2 / 5 不重试、不重新探活、不改配置，改走官方 API 通道；官方通道正式调用前最小真实探活成功（协调者陈述，A 未独立复核）。换通道不是换模型。
- **为何本轮回到首选而非沿用 R1 的 Opus**：R1 由 `claude-opus-5-5` 承担，仅因当时 `claude-fable-5-1` 正式调用 420 秒超时且**没有产出任何清单或结论**（规则 1 / 6 的调用失败）。本轮 Plan 已修订、重新进入 Checklist 阶段，按规则 1“下一阶段重新从首选开始”回到首选；这是阶段策略，**不是**因 R1 未通过而换模型找“通过”（规则 6）。本轮结论即审核结论，**即使为未通过也是最终结论**；不得为求通过再换模型。
- **独立性披露（规则 3 / 7）**：新开会话，上下文中没有任何作者 / 协调者会话内容；在固定提交的分离 Temp 工作树中只读审查，未写主工作区，未做任何 Git 写操作（无 commit / 分支 / reset / push）、未联网、未安装、未派 agent，未读取真实 `~/.pi` 会话、作者 / actor 原始日志、JSONL 负载或试点数据。A 的模型（`claude-fable-5-1`）与 Spec / Plan 作者（`claude-opus-5-5`）不同，与拟定实施模型（`openai/gpt-6-astra` / `deepseek/deepseek-flash`）不同。尚未实施任何代码。
- **本轮产出限制**：只新建 `checklist-r1.md`（归档）并重写本文件；未改 spec / plan / review / tasks / 其他 feature 的任何文件。未运行产品单元测试（尚无实现可测）；下方“静态核对”均为本会话实际执行的只读检查，plan 中的未来命令一律未执行。本文件**不授权**实施、真实试点、Review 或 Gate 2；27 条 spec AC 保持未勾选。
- **阶段位置**：Checklist 在 Tasks / Analyze 之前；`tasks.md` 与 Analyze 报告**仍不存在**。C-05 / C-09 为后续阶段条件，本轮**不豁免、不预批、不删除**。

输入清单（路径 @ 提交或 blob + 适用章节）：

```
AGENTS.md @ 57d0d84（blob ee8e4ab）全文
docs/development/model-routing.md @ 57d0d84（blob f980f5c）全文
docs/development/workflow.md @ 57d0d84（blob 4aca344）全文（总规则、第 4～8 步、Gate 1 / Gate 2、功能目录约定重点）
templates/checklist.md @ 57d0d84（blob 8da2b31）全文
specs/dev-harness-budget/spec.md @ 57d0d84（blob 4689093，与 037d616 同 blob）全文；冻结正文核对：锚定 re.search(rb'^## 1\.', re.M) 至文末、LF 归一化后 SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（与头部批准记录一致）
specs/dev-harness-budget/plan.md @ 57d0d84（blob 6119535，Plan r2 候选）全文（1～287 行分段完整读取，含 §1～§7）
specs/dev-harness-budget/checklist.md @ 57d0d84（blob aef3138，SHA256 dbe95b58…）R1 全文（现归档为 checklist-r1.md）
specs/dev-harness-budget/review.md @ 57d0d84（blob 01b82a9）：git diff 037d616..57d0d84 新增“用户恢复与 Plan R2 修订”节与头部状态
真实 diff：git diff --stat 037d616..57d0d84（4 文件：HANDOFF.md、specs/README.md、plan.md、review.md，+174/−70，无代码）；plan.md 逐行差异全文
pi-coding-agent 1.4.0 安装包文档（非本仓库，有界佐证）：docs/json.md（sha256 f1031918…3543）全文；docs/message-types.md（b832893f…5ff5db）stopReason / pending / nestedCalls 行；docs/session-format.md（4f8fc421…512a4a）UsageEntry / parentSession 行。未做 SDK 源码考古。
```

## 结论（R2）

**Spec / Plan 质量定向复核：通过**——P1 = 0，**P2 = 0**，P3 = 5（新发现，均可作为 Tasks / Analyze 或实施时的后续项，不阻塞）。R1 的 4 项 P2 与 3 项 P3 经本轮按实际 Plan r2 文本与冻结 spec 独立核对，**全部关闭**（逐项见“R1 发现复核”）。真实 diff 中 HANDOFF.md / specs/README.md / review.md 的改动只是状态记账，与 Plan 内容一致，未发现回归。

**但整体“Implement 就绪”= 否**：勾选统计 23 项中 **21 项已勾选、2 项未勾选（C-05、C-09）**。两项都是后续阶段条件（需要实际存在的 tasks.md 与 Analyze 报告），不是功能缺陷，也不能因流水线顺序而豁免。按根规则，Implement 前须有效 checklist 全部勾选，因此仍须：Tasks → Analyze 产出后由独立 A 复核 C-05 / C-09，才可能进入 Implement。本轮未勾选 spec 的任何 AC；AC-008-1 / AC-008-3 的真实试点仍须用户另行显式授权；无实现、无功能测试、无 Review、无 Gate 2。

## 需求完整性

- [x] C-01 每条需求都有至少一条可验证的验收规则：8 组 R、27 条 AC（4+3+4+3+4+2+4+3）均含可测断言或数值示例（170 / 150 / 12 / 10 s / 20 s / 30 s、“已知小计 50、未知 1”）。本轮按冻结正文重核，未变。
- [x] C-02 无未澄清歧义：spec §5 Q-001～Q-020 闭环；唯一产品层待决项（真实试点批次选择）已定义为执行前须用户显式授权，不阻塞。AC-001-3“完整报告”= 报告产物按 schema 完整写出（R1 已接受此解读），Plan r2 §4.7 已明文写出，且未把它扩大为“度量覆盖完整”；不构成 spec 语义变更，无需回 Clarify。
- [x] C-03 目标与非目标边界清晰：只观测、不约束；与产品运行时预算（D-019 / D-022 / D-023）无关；不计费；无常驻服务；不改全局规则或被观测批次；不为采样额外调用模型。Plan r2 未越界（无全局计费、无物理追踪采集器、无阈值）。
- [x] C-04 冻结完整性：锚定正文 SHA256 仍为 `a504fed8…e823`（本会话实算）；037d616..57d0d84 对 spec.md 无改动（同 blob 4689093）；27 条 AC 逐字未变且均未勾选。Plan r2 §5 仍为 27 行映射、编号集合一致（本会话用正则计数 = 27）。

## 一致性

- [ ] C-05 spec / plan / tasks 之间无冲突（Analyze 报告无遗留问题）——**后续阶段条件，保持未勾选**：`tasks.md` 与 Analyze 报告在 `57d0d84` 中不存在（`specs/dev-harness-budget/` 仅 spec / plan / review / checklist）。spec 与 plan r2 之间本轮未发现冲突（见 C-07），但本项按模板要求必须以实际 tasks.md 与 Analyze 报告为输入，不能预批。
- [x] C-06 与 docs/ 决策与 ADR 无冲突：落点仍为既有 `backend/tools/` 脚本目录，标准库 + 仓库已有 pytest；不进 wheel、不改打包 / `.gitignore` / AGENTS / workflow / model-routing / provider / 路由 / 全局 pi 配置；无预算上限或干预；“无需 ADR”理由成立并写明“需改即停止回报”。r2 新增内容（关系图校验、按度量矩阵、四层状态）均在脚本内部，不触及上述任何项。真实 diff 中 HANDOFF / specs/README / review 只改状态文字，与 D-025 工作区纪律一致。
- [x] C-07 Plan 对 27 条 AC 的映射在语义上与 spec 一致：R1 指出的 AC-004-3 / AC-005-1 / AC-005-2 / AC-005-3 / AC-007-1 缺口已由 §3.3 / §3.4 / §4.4 / §4.7 / §5 补齐（见 P2-2～P2-4 复核）。重点核对：AC-005-2 的“尝试 2、重试 1”对应 `confirmed=1`（spec 术语“重试”= 有可靠关联的重试，`confirmed` 即其已知小计），无关联时 `total=unknown` 对应 spec“重试数标为未知”；AC-003-4 / AC-004-1 的未知 ≠ 0、下界不入已知小计；AC-006-1 / 006-2 的窗口 / 合计 / 超时 / 部分耗时；AC-007-1 的单位、分母、四层状态。无 AC 被 Plan 改写含义。
- [x] C-08 每条验收规则都能映射到确定的测试期望或手动验收步骤：R1 的阻塞点（按度量完整性与退出码期望无法确定）已由 §4.7 矩阵消除——每条测试的期望值（退出码 0 / 3 / 2 / 1、`sources=ok|gaps`、各度量 complete / partial / unavailable、overall incomplete、完整总计 known / unknown）均可由 Plan 规则唯一推出；F1 = token 度量 complete、D1 = 全部已知路径在 `build_report` 边界注入、真实试点 = 手动步骤，三层数据不混称。AC-008-1 / 008-3 为手动验收且明确“待定”。

## 可测试性

- [ ] C-09 任务粒度与验证命令满足 tasks.md 模板要求——**后续阶段条件，保持未勾选**：`tasks.md` 尚不存在，无法判定；不得因流水线顺序预批。

## 本 feature 自定义项

- [x] D-01 范围与工具约束：单文件标准库脚本 + 测试 / 夹具辅助模块，不进 wheel；无新框架、新产品功能、路由或预算上限；回滚 = 删除新增文件（r2 未扩大文件集合）。
- [x] D-02 支持的两种格式与原生缺口如实写明：§3.2 能力矩阵与 pi 1.4.0 文档一致（本轮核对 json.md：`message_end` 权威、`message_update.usage` 累计且可为 0、`agent_end`≠settled、`auto_retry_*` / `summarization_retry_*` 形状、`tool_execution_end.durationMs`；message-types.md：`pending` 不持久化、`stopReason` 含 `deferred`、`nestedCalls.complete`、toolResult `usage` 为嵌套工作；session-format.md：`UsageEntry.kind` 任意、`parentSession`）。r2 新增披露：session-v3 无进行中尝试、json-events 不暴露独立 usage 条目与 branch summary，均列入 `unobserved_paths`。
- [x] D-03 隐私与零调用 / 只读边界的测试设计：审计钩子只在被测接口调用期间计数 socket / 进程 / kill / system / open；源只 `rb` 打开；源与沙箱 spec 状态前后哈希比对；控制动作单独观测；钩子只在测试辅助模块。r2 未削弱。
- [x] D-04 选定总体完整性：缺失 / 不可读 / 不支持 / 截断 / 坏行 / 只有 header（r2 定为 `empty`）/ 流未 settled 均阻止完整总计（§4.3 第 1 条）；空集不推出“全部已知”；有效来源已知值保留；无假“完整总计 0”。`empty` 在 §2 退出码、§3.6 population、§4.2、§4.3、§4.7 与 AC-003-4 映射中定义一致。
- [x] D-05 累计快照取最终值，非最终只作下界：6/10/12 → 12；无 `message_end` → 非最终、下界 10 不入已知小计；不单调 → unknown；json 按归属事件去重，`turn_end` / `agent_end` 不重复计。
- [x] D-06 零值、出处与估计值：默认 0 → unknown，只有带出处的 `confirmed_zero` 才记已知 0；`totalTokens` 只对账；不读 `cost`；不展示 `tokensBefore` / `estimatedTokensAfter`；峰值只称“来源上报输入峰值”并给覆盖（范围标注的精度见 P3-R2-2，不影响本项）。
- [x] D-07 来源关系图的去重语义完整（R1 P2-4 关闭）：§3.4 第 0 层在 `load_manifest` 对 duplicate / nested **并集图**拒绝目标未声明、自环、任意环（含混合环）与同源双声明；第 2 层只接受重复星形 / 嵌套星形，链式 / 混合分量整体进入未确认分区且**保留全部来源事实、不排除任何 token**；第 6 层按 (P, T) 分组、四维**逐维**求和、子维 unknown / partial 不跳过直接判不成立、`complete=false` 判不成立；任一不成立 → P 与 G 全部进入未确认分区。本轮用 R1 反例（A→B(T1)、B→A(T2) 嵌套环）重走规则：第 0 层直接 `manifest_invalid`，不再出现“两来源都被排除又不触发分区”的假完整总计。工具计数按 owner 命名空间身份、`direct` 与 `nested_reported` 永不相加、存在 nestedCalls 时跨来源总数 unknown，同一工具不会在两视图中被合并计两次。
- [x] D-08 计数口径诚实（R1 P2-2 / P2-3 关闭）：尝试 = “观测到的主 assistant 尝试”，按 completed / failed / aborted / inflight / terminal_only 分列，只有 start 的也计入；compaction / branch_summary / usage 条目 / 带 usage 的 toolResult 为“其他模型操作记录”，一条记录 ≠ 一次请求、request_count 恒 unknown、不与尝试相加；格式盲区显式入 `unobserved_paths`；摘要固定写“选定记录小计 ≠ 整次会话或平台账单”。重试度量改名“观测到的 pi 自动重试（assistant 循环级）”，`confirmed` 要求失败尝试的 `message_end(error)`、`auto_retry_start`、**以及新尝试的 `message_start`** 三者都观测到（两次尝试均实际观测）；只有排程无新尝试 → `scheduled_unobserved`，不计 confirmed；`total` 对一切原生来源恒 unknown（有无标记对称），不从先后顺序或成败推断；provider / SDK / HTTP 重试入 `unobserved_paths`；摘要重试标记单列；语义返工只来自标注且与传输重试分列。
- [x] D-09 时间口径：原生时间戳不作耗时 / 下界 / 运行边界；确认墙钟只来自带出处标注；超时可有已知耗时；时间独立于 token 去重分区与来源采集状态（r2 §4.5 明文）；不丢弃时间未知的会话来凑窗口；无偏移不跨来源比较。
- [x] D-10 按度量的完整性判定与可达性、夹具可行性（R1 P2-1 关闭）：§4.7 对 tokens / main_attempts / tool_calls / retries / rework / timing 逐项定义单位、总体与 complete / partial / unavailable；overall = 6 项全 complete，并**如实承认**原生来源下 retries 恒非 complete → overall 恒 incomplete，不另造来源或开关；退出码只表达“产物写出”与“来源采集”（0 = 写出且全 loaded；3 = 写出但有 unavailable / partial / empty），与度量覆盖、执行结果、业务验收四层分开；F1 断言 token 度量 complete 而非整体完整；D1 以类型化 `SourceFacts` 注入已声明的 `build_report` 边界验证全部已知路径，并标明“不代表原生读取器能产出”。本轮逐条核对 §2 / §3.6 / §4.2 / §4.3 / §4.5 / §4.7 / §5 对退出码、`empty`、只有 header、来源无效、未 settled、时间独立的表述一致，无矛盾；未改变 spec 语义（AC-001-3 / AC-008-2 的解读与 R1 C-02 一致）。
- [x] D-11 安全投影与固定错误：白名单抽取；argparse 错误转固定 `invalid_arguments`；未知键报 `unknown_field`；路径形标签拒绝且不回显（r2 扩至 `basis`、`tool_call_id` 字段，均有正则）；比较报告只投影必要元数据；stdout / stderr 不含路径或异常文本；不要求通用 DLP。
- [x] D-12 写出安全：out-dir 须已存在且在仓库外；`open(..., "x")` 独占创建；只清理本次成功创建的文件；不覆盖既有路径 / 选定来源 / 既有产物；清理失败如实给残留计数；外部替换竞态按 §5.1 不加防护并写明。
- [x] D-13 可比性、分组与单位：基线不同只披露；模型 / 配置 / 范围 / 口径 / 格式差异标“不可直接比较”；条件缺失 → 未知；人工说明不移除警示；分组按维度各自守恒、只在已确认去重总体内；单位与分母逐项标明；无金额；不对单样本下节省结论。
- [x] D-14 真实试点依赖定义清楚：AC-008-1 / AC-008-3 待用户显式选择并授权，当前“待定”，未被伪称满足；选定前 Review 不得判这两条通过。外部依赖，非需求质量缺陷。

## R1 发现复核（逐项 CLOSED / OPEN）

| R1 发现 | 状态 | 核对位置（plan.md r2） | 理由 |
|---|---|---|---|
| P2-1 按度量完整性未定义、整体完整 / 退出 0 不可达 | **CLOSED** | §2 退出码与状态行；§3.6 `population` / `acquisition` / `observation`；§4.2 `empty`；§4.3 第 1～3 条；§4.7 全节；§5 三层样例与 AC-001-3 / 001-4 / 007-1 / 008-2 映射 | 6 项度量各有可判定的 complete / partial / unavailable；退出 0 不再要求整体完整，F1 的退出码（0）与 token complete、overall incomplete 可唯一推出；D1 在声明边界验证全部已知聚合；原生 overall 不可达被如实声明而非掩盖；AC-001-3“完整报告”= 产物完整已写明，未改 spec 含义 |
| P2-2 重试总数超出可观测范围、判定不对称 | **CLOSED** | §3.2“pi 自动重试”行；§3.6 `retries`；§4.4；§4.7 retries 行；§5 AC-005-2 | 度量范围改为 assistant 循环级 pi 自动重试；`total` 对原生来源恒 unknown（有无标记一致）；`confirmed` 要求两次尝试均观测（含新 `message_start`），仅排程不计；provider / SDK / HTTP 入 `unobserved_paths`；摘要重试单列；无失败→成功推断 |
| P2-3 尝试数漏掉非 assistant 模型工作且未披露 | **CLOSED** | §3.2“主 assistant 尝试”“其他模型操作记录”行；§3.3“尝试与操作记录分开”“单位与分母”；§3.6 `attempts` / `unobserved_paths`；§4.7 main_attempts 行；§5 AC-005-3 | 主尝试按五种状态分列（含 inflight / terminal_only）；操作记录分类、带 usage 计数、request_count unknown；json 不暴露 usage 条目与 branch summary、session 无 inflight 均显式披露；元数据 / 出处 / 覆盖单位齐全，不只是改名 |
| P2-4 关系图校验不完整（成环、链式、多子、工具重复计数） | **CLOSED** | §3.1 schema（`basis`）；§3.3 工具身份与视图；§3.4 第 0 / 2 / 3 / 6 层；§5 F8 / F11 / F12 与 AC-004-3 / 005-1 | 并集图入口拒绝全部环与非法边；只支持两种单层星形，其余整体入未确认分区并保留事实；(P, T) 分组逐维求和、未知不跳过；父 `complete=false` 判不成立；工具身份按 owner 命名空间，direct / nested_reported 不相加；用 R1 反例重走无假完整总计、无事实被压制 |
| P3-1 快照总体提示未进报告文案 | **CLOSED** | §3.6 `population`；§5 AC-007-1 | 摘要与 report.json 写明总体 = `content_sha256` 快照中的记录、不证明运行已结束，并列出非 loaded 来源 |
| P3-2 不可用 / 部分来源的合法 timing 仍应计入 | **CLOSED** | §4.5“时间独立于来源采集状态与 token 去重”；§5 F6 与 AC-006-1 | 明文规定并有夹具 `test_timing_kept_for_unavailable_source` |
| P3-3 `duplicate_of` 应标为人工包含断言并披露风险 | **CLOSED** | §3.1 `duplicate_of.basis`；§3.4 第 3 层；§3.6 `relations`（`v3_keyset|unverified`）；§6 | 标 annotation + basis + 断言者责任 + 尾部丢弃风险；session-v3 做 `(type, id, timestamp)` 键集包含核验，json-events 标未经核验；目标不可用时双方事实保留、不压制有效数据 |

## 审核发现（R2，新发现，均为 P3；不阻塞）

### P3-R2-1 §3.4 第 6 层末句缺少限定，可能被误读为无条件计入未引用的 toolResult 用量

- **位置**：plan.md §3.4 第 6 层末句“未被任何 `nested_of` 引用的 toolResult 用量照计”。
- **反例逻辑**：两来源 P、C，C 是 P 的子会话但清单未声明 `nested_of`，`all_nested_children_declared=false`。主规则要求全部带 usage 的 toolResult 入未确认分区（正确，完整总计 unknown）；若实施者把末句读作无条件规则，P 的 toolResult 用量与 C 的全部记录会同时进入已确认总体，形成重复计入的“已知小计”。
- **修复方向**：末句改为“在单来源、或 `all_nested_children_declared: true` 时，未被任何 `nested_of` 引用的 toolResult 用量照计”；F8 补一条“flag=false + 未声明子来源被选入”负例，断言完整总计 unknown 且 toolResult 用量在未确认分区。

### P3-R2-2 “来源上报输入峰值”的范围只含主 assistant 尝试，标签应写明

- **位置**：§3.3“来源上报输入 … 峰值只在主 assistant 尝试记录上取”。
- **说明**：compaction / branch summary 的单次请求输入通常是会话内最大的；把它们排除在峰值之外合乎 spec（AC-003-3 允许标明覆盖范围），但当前标签“来源上报输入峰值 + 参与记录数 / 尝试总数”只隐含范围。
- **修复方向**：摘要固定写“主 assistant 尝试内的来源上报输入峰值”，并在 `unobserved_paths` 或峰值旁注明“操作记录（compaction / usage 条目 / 嵌套工具）的单请求输入不参与峰值”；可选单列操作记录中已知的最大输入，仍不相加。

### P3-R2-3 §4.4 已确认关联依赖 `auto_retry_end` 与新尝试 `message_start` 的相对顺序，而 json.md 未明文规定

- **位置**：§4.4“在对应 `auto_retry_end` / 下一个 `auto_retry_start` 之前又观测到新的 assistant 尝试”。
- **说明**：pi 1.4.0 json.md 只给出 `auto_retry_start{attempt:1}` → `auto_retry_end{success:true, attempt:2}` 的形状，未写明重试后的 `message_start` 位于 `auto_retry_end` 之前还是之后。若真实顺序为 start → end → message_start，当前规则会把所有重试记为 `scheduled_unobserved`，`confirmed` 恒 0。失效方向是**少计**（下界更低、total 仍 unknown），不会伪造重试，故不阻塞。
- **修复方向**：在 Plan 或 Tasks 中把该顺序记为“待实施时按真实事件序列核实的假设”；F2 夹具按核实后的顺序构造；若顺序为 end 在前，规则改为“`auto_retry_end(success=true)` 之后、下一个 `auto_retry_start` 或 `agent_settled` 之前的首个新 assistant 尝试”，并补负例：`auto_retry_end(success=false)` 后出现的新尝试不计 confirmed。

### P3-R2-4 §4.2“没有以 `agent_settled` 收尾”需精确到可判定的记录级规则

- **位置**：§4.2 `stream_not_settled`。
- **说明**：若实施为“最后一条记录必须是 `agent_settled`”，则其后出现 `session_info_changed`、`queue_update` 等非运行类记录的合法流会被判 partial（退出 3），虽偏保守但会把无缺口来源报告为“采集有缺口”。
- **修复方向**：定义为“存在 `agent_settled`，且其后没有 `agent_start` / `message_*` / `tool_execution_*` / `compaction_*` / `auto_retry_*` 记录”；或明确采用严格末记录规则并在摘要原因中写明。

### P3-R2-5 两处口径细节未写明（不影响保守性）

- **位置**：§3.3“总量”对账；§3.4 第 4 层与第 6 层 (d) 的交互。
- **说明**：(i) 来源缺少 `totalTokens` 字段时是否算 `unreconciled` 未写（spec AC-003-2 要求不假设每个来源提供全部字段，应为“不对账、不标 unreconciled”）；(ii) 子来源 C 同时经第 4 层血缘去重（复制自 P 的条目只由 P 计）又是 `nested_of` 子来源时，(d) 的 Σ 应取 C 去重后的记录集，当前未写明；按现文两种读法都只会导致“判不成立 → 未确认分区”，不会产生假总计。
- **修复方向**：各补一句规则，并在 F7 / F8 各加一例。

## 静态核对（本会话实际执行，均为只读；不是功能测试）

- `git rev-parse HEAD` = `57d0d84dc7754e97eb255488d8a6918eb9b50d98`；`git status --short` 开始时为空。
- `git diff --stat 037d616..HEAD`：仅 4 个 Markdown 文件；`git diff --check 037d616..HEAD` 退出码 0。
- 冻结 spec 锚定正文 SHA256（LF 归一化）= `a504fed8…e823`；spec.md blob 在 037d616 与 57d0d84 相同（4689093）。
- R1 归档：`git show HEAD:specs/dev-harness-budget/checklist.md > checklist-r1.md`，`cmp` 与 blob 逐字节相同，SHA256 = `dbe95b58…5dc3`，`git hash-object` = `aef3138`。
- plan.md：§5 `| AC-xxx-x |` 行数 = 27；文内相对链接目标全部存在；度量矩阵为 6 项，与 stdout `metrics_complete=<k>/6` 一致。
- pi 1.4.0 文档哈希与 plan / R1 输入清单记录一致（json.md f1031918…、message-types.md b832893f…、session-format.md 4f8fc421…）。

## 后续条件（不在本轮勾选范围）

- **C-05 / C-09**：待 Tasks（符合 templates/tasks.md，完成标准引用 AC 编号、验证命令一一对应）与 Analyze 报告（无遗留冲突）实际产出后，由独立 A 复核勾选；Implement 前须 23/23。
- 5 项 P3 可在 Tasks 中登记为任务或在 Analyze 中一并修订 Plan，不要求再次 Checklist 轮次，除非修订触及 §3.4 / §4.4 / §4.7 的规则本身。
- AC-008-1 / AC-008-3 须用户另行授权真实试点；Implement、Review、Gate 2 均未授权。本文件不改变 27 条 AC 的未勾选状态。
