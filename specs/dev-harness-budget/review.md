# Feature: dev-harness-budget 记录（review.md）—— 规格与 Plan 阶段记录

> 本文件记录 Spec / Clarify 历史、Gate 1 批准与当前 Plan 派工（[model-routing.md 规则 4](../../docs/development/model-routing.md#rule-4)）；不是独立 Review 或 Handoff。
> **它不是独立 Review、不是 Checklist、不是 Handoff 记录**：尚无 Review、无测试、无 Converge、无 Gate 2。Review / Handoff 阶段到来时，再按 [templates/review.md](../../templates/review.md) 补写对应内容。
> **当前状态（2026-10-31，Gate 2 已确认，Handoff 进行中）**：Review R3 通过（0 P1 / 0 P2 / 2 P3），用户确认 Gate 2 并同意交付；交付记录见文末“Handoff 交付记录（2026-10-31）”节。交付 PR 与合并由协调者执行，**尚未发生**。上两行及本行以下文字是早期阶段的历史状态，以各节记录为准。历史（r5 时）：Review R1 未通过；用户已定“全修 + T-12 同批”；Plan r5 与追加任务 T-16～T-20 已写，当时待 Analyze R3 → 独立 A Checklist R4 → Implement → T-12 试点 → Converge → 独立 A Review R2 → Gate 2。更早：实施按 tasks.md 依赖分四批由 `openai/gpt-6-astra via openai` 执行，协调者每批复跑测试后提交；记录见文末“Implement”节。以下为实施开始时的状态：Gate 1 已批准，spec 正文保持冻结。最新有效 [Checklist R3](checklist.md)（`claude-fable-5-1 via claude-bridge`，审 `9f60aec`）：**通过，23/23，0 P1 / 0 P2 / 1 P3**；R2 的 5 项 P3 由 A 判全部关闭。[Analyze R2](analyze-r2.md) PASS。Tasks 12 项全部未开始，T-12 真实试点外部阻塞；P3-R3-1 未修、未风险接受。**claude-bridge 路由更正见文末**：此前各节“bridge 已确认耗尽、无重置证据”的表述是未复测的旧记录。无实现、无本 feature 功能测试、无 AC 通过、无最终 Review / Gate 2。
> Spec / Clarify 时状态（历史）：spec 草案已写，并完成 Clarify 第 2 轮修订，**Gate 1 待用户显式批准**。

## 派工与路由

| 项 | 记录 |
|---|---|
| 日期 | 2026-10-30 |
| 角色 / 阶段 | Spec / Clarify 作者（唯一串行写入者） |
| 任务 | 起草 `specs/dev-harness-budget/spec.md`，澄清可由仓库推断的歧义；在 `specs/README.md` 状态表新增一行 |
| 基线提交 | `d260c64f170407ed62d6205b2e6da54045fbcf79`（`D:/2030/Futures-AI`，分支 `workbench`，起稿时工作区干净） |
| 实际 provider / model | `claude-opus-5-5 via anthropic`（计划与分析类阶段首选模型） |
| 通道与切换原因 | `claude-bridge` 已在同一协调会话中确认当窗限额 / 限流耗尽（失败类别：额度 / 限流），无重置证据，按规则 5 不重试；按规则 2 改走官方通道，官方最小真实探活成功。换通道不是换模型 |
| 协调者 | `openai/gpt-6.1-sol`，只做确定性集成 |
| 权限范围 | 只写三个路径：本文件、`spec.md`、`specs/README.md` 新增一行；不派 agent、不安装、不额外调用模型、不做 Git 写操作 / 提交 / 分支 / 推送 / PR / merge，不读私有数据或真实私有会话 |
| 未改动 | provider / 路由 / API key / 全局 pi 配置；AGENTS.md、docs/、`.gitignore`、其他 feature 的 spec / 冻结 AC / checklist / 路由 / Gate |

### Clarify 第 2 轮修订（同日）

| 项 | 记录 |
|---|---|
| 触发 | 协调者静态检出 10 项需求歧义（AC 口径过度声明或含糊），**不是通道故障**；同一模型 `claude-opus-5-5 via anthropic`、同一健康通道继续，未换模型，未提前调用独立审核员 A |
| 权限范围 | 只改 `spec.md` 与本文件；`specs/README.md` 状态行不动；不建 plan / tasks / checklist，不写代码 / ADR，不做 Git 操作，不派 agent，不安装，不调用其他模型，不联网，不改配置 |
| 修订要点 | AC-001-3 改为外部边界观测请求尝试为 0；AC-001-4 拆分文件哈希、业务状态、控制动作三项观测；AC-002-3 按维度分别守恒，只限已确认去重总体；AC-003-3 改称“来源上报输入峰值”（例：150 / 170），不承诺账单；AC-003-4、AC-004-1 增加“部分观测值（下界）”且不入已知小计；AC-004-3 缺关联时保留各来源值、去重汇总未知；AC-005-2 重试需可靠关联；AC-006-1/6-2 定义批次观测墙钟窗口，区分测量完整性与执行结果，超时有确认结束即为已知耗时；AC-007-1 覆盖改为选定总体内计数、分母未知不给百分比；AC-007-2 只禁原始负载、允许声明过的统计元数据；AC-007-3 同时检查已跟踪文件修改与新的未忽略文件；AC-007-4 基线不同只披露，条件变化才不可直接比较；非目标“不新增 ADR”仅指本次起草 |
| 结构变化 | 在 §3 新增“术语与口径”小节；需求仍为 8 组、AC 仍为 27 条，全部未勾选；Q-004/005/007/008/009/010/013/014 更新，新增 Q-018～Q-020 |

## 实际输入

```
AGENTS.md @ d260c64（blob ee8e4ab）全文
docs/development/workflow.md @ d260c64（blob 4aca344）总规则、第 2～3 步、Gate 1、功能目录约定、状态表
docs/development/model-routing.md @ d260c64（blob f980f5c）全文
templates/spec.md @ d260c64（blob d75d224）全文
templates/review.md @ d260c64（blob b927e01）全文
specs/README.md @ d260c64（blob 6a8c9f7）全文
docs/plan.md @ d260c64（blob 707e0cb）§4 文档纪律、§7.2
docs/architecture.md @ d260c64（blob 5c0dc17）§5.4～§5.6
pi 1.4.0 安装包文档（非本仓库文件）docs/json.md、docs/message-types.md：用量相关段落（协调者已核对，本会话以检索复核关键句）
用户本轮指示：dev-harness-budget v1 范围、度量语义与试点要求（只观测、不约束）
第 2 轮追加：spec.md 第 1 轮草案全文；协调者第 2 轮澄清指示（10 项需求歧义）
```

未读取：大型实施历史、真实私有会话、其他项目目录。

## 已完成（草案，不是实现）

- `spec.md` 草案：8 组需求（R-001～R-008）、27 条验收规则，全部未勾选；歧义记录 Q-001～Q-020 已融入正文（第 2 轮新增 Q-018～Q-020）；无阻塞性 what 歧义，未向用户提出技术选型问题。
- `specs/README.md` 状态表新增 `dev-harness-budget` 一行（in-progress：Spec / Clarify，待 Gate 1）。

## 未完成 / 未实施

- Gate 1 未批准；spec 未冻结。
- 未创建 plan.md / tasks.md / checklist.md；无任何实现代码、测试、ADR 或流程规则变更。
- 无独立 Review、无 Converge、无 Gate 2、无 Handoff。

## 风险

- 来源能覆盖的范围（如重试、压缩、嵌套调用、物理请求次数）取决于实际可用元数据，可能小于需求列出的度量；spec 已要求未覆盖部分如实标注，具体限制须在 Plan 中核实，不得事先承诺完整覆盖。
- 试点需要一个经授权、带可用用量的真实开发批次；若历史记录缺少用量，试点只能报告“不完整 / 不可用”，仍须如实记录。
- 真实元数据与私有内容处于同一来源记录中，实施时须特别防止内容泄漏到报告、日志或仓库（AC-007-2 / AC-007-3）。

## 下一步

- 用户审阅 `spec.md` 并显式决定是否批准 Gate 1；批准前停止，不进入 Plan。
- Gate 1 批准后：Plan（模型按 model-routing.md 重新从首选开始）→ 独立审核员 A 生成 Checklist → Tasks → Analyze → Implement。

## 验收证据

- 静态文档自检（作者自查，不是独立审核）：spec 五个大节齐全；8 组需求、27 条 AC 编号唯一且全部未勾选；三份文件内相对链接目标均存在；`git status` 仅见 `specs/README.md` 修改与本目录新增。
- 第 2 轮：协调者静态检查检出 10 项需求歧义，已按上表修订；作者对修订后的 spec 做静态自检（五个大节、8 组需求、27 条 AC 编号唯一且全部未勾选、Q 编号连续）。这只是作者自查，**不是**独立审核，未执行任何测试，任何 AC 均未判定通过。
- 最终澄清：明确了覆盖 / 缺失计数的计数单位与所依据的总体，以及测量完整性按度量分别判定（时间完整不代表用量或整体完整）；仍为 8 组需求、27 条 AC，无任何 AC 判定通过，无独立 Review。协调者已执行的静态检查（不是测试）：改动范围恰为 3 个文件；五个大节齐全；8 组需求、27 条 AC 编号唯一且全部未勾选，每组需求均有 AC；`specs/README.md` 除新增 1 行外未变；26 个相对链接目标均存在；`git diff --check` 通过。
- 测试命令输出摘要：无（未实施）。
- Converge 报告结论：无（未到该阶段）。
- Gate 2 确认记录：无（未到该阶段）。

## Gate 1 批准与 Plan 阶段（2026-10-30）

### Gate 1

- 协调者询问“是否批准此 spec，通过 Gate 1 并进入 Plan？”，用户答复“批准”。spec 冻结对象：`specs/dev-harness-budget/spec.md` @ `ab7f246081c25b521361b633fe83276daea42d4c`，Git blob `092338a91f930943f7402d0fd1e84cd6620e0d00`，全文 LF SHA256 `a9974be4…528e4c`，`## 1.` 至文末 LF SHA256 `a504fed8…e922e823`。
- 本阶段只在 spec `## 1.` 之前的头部补记批准 / 冻结状态，并注明起草时状态与 Q-017 为历史；修改后重算 `## 1.` 至文末哈希仍为 `a504fed8…e922e823`，正文、Q 表与 27 条未勾选 AC 逐字不变。
- 批准只授权 Plan；**不授权**实施、本 feature Gate 2，也不授权选择或读取真实试点批次。

### 派工与路由

| 项 | 记录 |
|---|---|
| 角色 / 阶段 | Plan 作者（唯一串行写入者） |
| 任务 | 新建 `plan.md`；spec 只改头部元数据；本文件追加本节；`specs/README.md` 只更新本 feature 一行 |
| 基线提交 | `ab7f246081c25b521361b633fe83276daea42d4c`（`D:/2030/Futures-AI`，分支 `workbench`） |
| 实际 provider / model | `claude-opus-5-5 via anthropic`（计划类阶段首选；本阶段重新从首选开始选定） |
| 通道与切换原因 | `claude-bridge` 已在同一协调窗口确认限额耗尽（失败类别：额度 / 限流），无重置证据，按规则 5 不重试、不重新探活；按规则 2 走官方通道，本阶段新做的最小真实探活成功。换通道不是换模型 |
| 协调者 | `openai/gpt-6.1-sol`，只做确定性集成 |
| 权限范围 | 只写 4 个路径（spec 头部、新 plan.md、本文件、specs/README.md 本行）；不派 agent、不安装、不额外调用模型、不联网、不做 Git 写操作 / 提交 / 分支 / 推送 / PR / merge；不写业务代码、tasks、checklist、ADR；不读真实 `~/.pi` 会话或 Temp 中的既往日志 |
| 未改动 | provider / 路由 / API key / 全局 pi 配置；AGENTS.md、docs/、`.gitignore`、`backend/`、其他 feature 的 spec / AC / checklist / 路由 / Gate |

### 实际输入

```
AGENTS.md @ ab7f246（blob ee8e4ab）全文
docs/development/workflow.md @ ab7f246（blob 4aca344）总规则、第 4～8 步、Gate 1
docs/development/model-routing.md @ ab7f246（blob f980f5c）全文
specs/dev-harness-budget/spec.md @ ab7f246（blob 092338a）全文；review.md @ ab7f246（blob b65fc4a）全文
templates/plan.md @ ab7f246（blob 22bd037）全文；specs/README.md @ ab7f246（blob 53e3f13）全文
docs/architecture.md（blob 5c0dc17）§5.1～§5.5、§9；docs/plan.md（blob 707e0cb）§4、§5、§7.2
backend/README.md（blob 5d6fa8f）、backend/pyproject.toml（blob 8015e26）、.gitignore（blob 9245637）、
backend/tests/conftest.py（blob 98d37da）、backend/tools/build_backend.py（blob db00ae0）及 tools/*.py 文件头
pi-coding-agent 1.4.0 安装包：docs/json.md、message-types.md、session-format.md、sessions.md 全文；
dist/core/session-manager.d.ts 片段；dist/core/session-manager.js fork / 分支会话复制片段（sha256 见 plan.md 输入清单）
```

### 已完成（设计，不是实现）

- `plan.md`：六大节；落点 `backend/tools/dev_harness_budget.py`（标准库单文件，不进 wheel / 打包，不 import 产品包）+ `backend/tests/test_dev_harness_budget.py` + `backend/tests/dev_harness_budget_fixtures.py`（合成样例在 `tmp_path` 生成）；确定 CLI、清单 schema、退出码 0 / 1 / 2 / 3、固定错误类别、来源能力矩阵、零值 / 去重 / 标注冲突 / 分母 / 可比性口径；27 条 AC 均有映射（25 条合成 / 受控边界验证，AC-008-1、AC-008-3 待真实试点）。
- 判定无需 ADR（仅在既有仓库脚本目录新增开发工具，不改产品架构或全局规则）；实施中若需改打包、`.gitignore`、全局规则或导入产品包，须停止回报。

### 未完成 / 未实施

- Checklist 未生成：待协调者另行派**独立审核员 A**（新会话、与实施隔离、不同模型）生成并勾选；本作者不创建、不勾选。
- Tasks / Analyze / Implement / Converge / Review / Gate 2 / Handoff 均未开始；无代码、无测试、无 AC 判定通过。
- 真实试点批次未选择、未读取；须由用户另行显式选择与授权（AC-008-1）。

### 风险（来源限制）

- pi 原生记录没有可信的会话 / 批次结束时间：JSON 事件无时间戳，`message.timestamp` 是创建时间，`agent_settled` 无时间；会话 v3 条目时间是追加时间且无关闭条目。Plan 初稿曾把原生日志时间跨度当作耗时下界，精修已移除：这些跨度不证明执行时长；确认墙钟或部分耗时只来自带出处的 `timing` / `observed_until` 标注。
- pi Usage 恒带数值默认值：0 默认不视为确认的 0（需带出处的 `confirmed_zero` 规则），真实报告多为“观测不完整”。
- session 源无重试标记与工具耗时；物理 HTTP 请求数对所有来源不可得；嵌套子会话无法自动识别，多来源时嵌套用量默认“未确认去重”。
- 会话 v1 / v2 不支持（不迁移、不改文件）；fork 复制保留条目 id 的去重依据只对 pi 1.4.0 验证。
- 试点若选到缺用量的历史批次，只能如实报告“不完整 / 不可用”。

### 下一步

- 协调者派独立审核员 A 依冻结 spec + plan 生成 Checklist；全部勾选后再进入 Tasks（计划类模型重新从首选开始）→ Analyze → Implement。
- 用户在试点执行前另行显式选择并授权真实历史批次；未选定前 AC-008-1 / AC-008-3 保持待定。

### 验收证据（本阶段）

- 作者静态自检（不是独立审核、不是测试）：plan 六大节齐全，第 5 节恰有 27 行 AC 映射且与 spec AC 编号集合一致；spec `## 1.` 至文末 LF SHA256 修改后仍为 `a504fed8…e922e823`。
- plan 中的测试与 CLI 命令均为**设计**，本阶段未执行；测试命令输出摘要：无。Converge / Gate 2：无（未到该阶段）。

## Plan 精修与接续（同日）

- 初稿正式调用 `anthropic/claude-opus-5-5` 成功；随后仍由同一健康模型 / 通道精修，针对来源缺口、嵌套覆盖、私有路径标签、无依据的时间下界与文件覆写问题补正技术方案。精修正式任务在 **300 秒超时**，由协调者停止所属进程树；有效 Plan partial 已保留，未丢弃或回退需求。
- 按模型路由的调用失败条件，Plan 余下接续由 `openai/gpt-6.1-sol via openai` 完成。回退原因是正式任务超时，不是设计或静态检查结果；下一阶段仍从该阶段首选重新选择。没有因此更换审核员以寻求通过。
- 接续核对：冻结 spec 正文（锚定行首 `## 1.` 至文末）的 SHA256 仍为 `a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823`。最初一个临时检查误中了头部行内引用的同名字符串，已改为行首定位；那是检查定位错误，不是 spec 正文发生变更。
- 已保留并补齐：所选来源不完整 / 没有用量记录不能因空真条件而报精确 0；`nested_of` 需对应具体且确已覆盖的父工具用量；无效路径形标签不回显；不再从原生记录时间戳猜执行时长；新文件用独占创建，清理仅限本次产物，不覆盖既有路径。
- 接续另明确：时间汇总基于所选会话，不复用 token 去重的排除集合；一般中断事实不自动判为人为取消，允许明确超时原因补充；比较报告只读必要且已校验的元数据；CLI / 错误字段不回显用户值；测试审计钩子采用一次注册与 active 计数标记，不虚构不存在的卸载 API。
- 该接续时点仍只是 **Plan 成稿**。27 条 AC 有设计映射，不是实施通过；当时独立 A / Checklist、Tasks / Analyze、实现与真实试点均未进行。其后实际 Checklist 与暂停状态见下节。本次不选择或读取真实会话，也不新增产品或全局规则。

## Checklist R1 与暂停检查点（2026-10-30）

### 审核路由与原件

- 审查对象：`a2616573a1c780707cfe424d8dde9965ceee0486`；批准的 spec 正文仍为 `ab7f246`，正文 SHA256 `a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823`。
- 首选 A `claude-fable-5-1 via anthropic` 正式任务 **420 秒超时**；协调者确认没有清单文件、没有审核结论，不是判未通过后改投其他模型。
- 按既定回退顺序，由新会话 A = `claude-opus-5-5 via anthropic` 在隔离固定 Temp 工作树接审并产出 R1（现逐字节归档为 [checklist-r1.md](checklist-r1.md)）。A 如实披露其与 Plan 初稿同模型；审核与作者会话隔离，且与拟定实施候选 `openai/gpt-6-astra` / `deepseek/deepseek-flash` 不同，未实施任何代码。只做单审，不投票。
- 清单原件 SHA256：`dbe95b58fa4abf45ba79593716d823b643ea682c9380459a62f2cf52d7cb5dc3`。协调者仅逐字节复制到本目录，**未编辑清单内容或勾选状态**。
- 结论：**未通过，0 P1、4 P2、3 P3；23 项质量检查中 16 项已勾、7 项未勾**。Spec 原 27 条 AC 仍全部未勾选。具体依据、位置与修复建议以 A 原件为准；没有代码或功能测试通过结论。

### 未完成项与恢复顺序

1. **先修 Plan 四项 P2**，不改冻结需求：P2-1 按度量的完整性 / 退出码与完整夹具可达性；P2-2 重试统计范围与无标记情况的一致性；P2-3 非 assistant 模型工作及其请求次数 / JSON 来源缺口披露；P2-4 关系图成环、链式 / 多子 / 混合关联与工具重复计数。
2. 由独立 A 对修订后的固定 Plan 出新有效轮次，作者与协调者均不得代勾。R1 原件保留，不能为了过关删除必要项或改需求。
3. 按既有流程生成 Tasks / Analyze；R1 中 C-05、C-09 是后续产物条件，须有实际 Tasks / Analyze 后由 A 判定，不得虚构已满足。**Implement 前必须有效清单全部勾选且其余前置条件完成**。
4. 真实试点 AC-008-1 / AC-008-3 仍需用户另行明确选择与授权真实批次；恢复网络或继续修 Plan不等于授权读取真实日志。
5. P3 为源文件快照口径、不可用来源的时间标注保留、`duplicate_of` 包含断言的披露；尚未修复，也没有用户风险接受记录。其他 feature 的审批、风险、进度与 D-026 已完成的主线文档交付均不变。

### 暂停与本地保存

用户原话：**“请在合适的时候暂停任务，我要先断网一下”**。当前正处在 Checklist 未通过、实现未开的安全点，按此暂停。

- 本轮已发出的 Plan / Checklist 派工均已结束；暂停后不再发起网络、模型或业务任务，也不做 push / PR / merge。不操作用户其他会话或进程。
- 本次只本地保存 A 原件、状态索引和恢复入口；这不是进入 Handoff，不新增模型路由回退、不声明实施、Converge、Review 或 Gate 2 通过。
- 恢复时先读本段、冻结 spec、当前 Plan 与 Checklist R1；待用户表示可继续后，按模型路由从相应阶段首选恢复。Gate 1 不重复请求；只有实际需求变化才回 Clarify / 重新 Gate 1。
- 本地保存时核对：A 原件字节哈希、冻结正文哈希、仅文档改动与 `git diff --check`；这些只属静态保存核对，不是功能测试。临时审核工作树在原件已提交并确认可恢复后清理，不据旧记录重建。

## 用户恢复与 Plan R2 修订（2026-10-30）

### 恢复记录

- 用户在上节“断网暂停”后答复 **“继续”**。上节暂停点写明的恢复顺序是：先修 Plan 的四项 P2，再由独立 A 复核，之后才是 Tasks / Analyze 等实施前置条件。因此本轮从“修 Plan”恢复；上节暂停记录保留为**历史**，不再是当前限制。
- 恢复只允许网络 / 模型调用，**不授权**选择或读取真实试点批次、真实私有会话或试点日志。Gate 1 不重复申请；spec 正文与 checklist.md 一律不改。

### 派工与路由

| 项 | 记录 |
|---|---|
| 角色 / 阶段 | Plan 作者（R1 修订，唯一串行写入者） |
| 任务 | 按 checklist R1 的 P2-1～P2-4 修订 plan.md，力所能及时一并处理 3 项 P3；更新本文件、`specs/README.md` 本 feature 一行、`HANDOFF.md` 本 feature 当前点 |
| 基线提交 | `037d61668391631d6b4a370125b464022d3784c2`（`D:/2030/Futures-AI`，分支 `workbench`，开始时工作区干净） |
| 实际 provider / model | `claude-opus-5-5 via anthropic`（计划类阶段，本阶段重新从首选开始） |
| 通道与切换原因 | 同一协调 PI 会话此前已确认 `claude-bridge` 当窗耗尽（失败类别：额度 / 限流），无重置证据，按规则 2 / 5 不重试、不重新探活；官方通道本阶段最小真实探活成功（协调者陈述）。换通道不是换模型 |
| 权限范围 | 只写 4 个路径：plan.md、本文件、`specs/README.md` 本行、`HANDOFF.md` 本 feature 当前点；不改 spec / checklist，不写 tasks / 代码 / ADR，不派 agent、不安装、不做 Git 写操作，不读真实会话或试点日志 |

### 实际输入

```
AGENTS.md（ee8e4ab）、docs/development/workflow.md（4aca344）、docs/development/model-routing.md（f980f5c）@ 037d616 全文
specs/dev-harness-budget/spec.md @ 037d616（blob 4689093）全文；锚定正文 SHA256 a504fed8…e922e823
specs/dev-harness-budget/plan.md @ 037d616（blob 45395ad，即 R1 审查的候选）全文
specs/dev-harness-budget/checklist.md @ 037d616（blob aef3138，SHA256 dbe95b58…）R1 全文
本文件 @ 037d616 全文；HANDOFF.md、specs/README.md @ 037d616 全文；templates/plan.md（22bd037）
pi 1.4.0 docs/json.md、message-types.md、session-format.md：重试 / message_start / tool_execution / pending / NestedToolCalls / UsageEntry 有界检索
```

### 已完成（设计修订，不是实现）

- plan.md r2 按 R1 逐项修订（对照表见 plan.md §7）：P2-1 按度量完整性、退出码与覆盖解耦、四层状态、F1 / D1 / 真实试点三层样例；P2-2 重试改为“观测到的 pi 自动重试（assistant 循环级）”，原生总数恒 unknown；P2-3 主尝试按状态分列、操作记录与尝试分开、格式盲区披露；P2-4 并集关系图校验、两种单层形状、(P, T) 逐维校验、工具身份命名空间与视图不相加。P3-1～P3-3 一并处理。
- 27 条 AC 映射仍为 27 行，与 spec AC 编号集合一致；无新需求、新阈值、新模式或新来源格式。spec 与 checklist 未改。

### 未完成 / 待办

- **R1 仍是唯一有效结论（未通过，4 P2 / 3 P3，16/23）**。r2 修订须由新开独立 A 会话审查固定候选后出新轮次；R1 原件保留，是否归档由 A 处理，作者与协调者均不勾选、不改清单。
- Tasks / Analyze / Implement / Converge / Review / Gate 2 均未开始；无代码、无测试、无 AC 通过。真实试点仍须用户另行选择与授权。

### 风险

- 原生来源下 overall 观测恒为 incomplete（重试总数不可证明），退出 0 只表示产物写出且来源采集无缺口；这是对来源能力的如实披露，若 A 认为与冻结 spec 的解读不符，须回 Clarify，不在 Plan 中改需求。
- 关系图只支持单层星形，链式 / 混合关系整体进入未确认分区；`duplicate_of` 是作者断言，json-events 无法核验。

### 验收证据（静态，不是测试）

- 作者静态自检：plan 第 5 节 27 行 AC 映射，编号集合与 spec 一致；plan 内相对链接目标存在；spec 锚定正文 SHA256 仍为 `a504fed8…e922e823`；checklist.md 字节 SHA256 仍为 `dbe95b58…`。本 feature 测试命令输出摘要：无（未实施）。
- 协调者保存前核对：`git diff --check` 通过，仅上列 4 个 Markdown 路径变化；冻结正文与 R1 原件哈希完全一致。按提交前测试约定，运行现有文档回归命令 `cd frontend && pnpm exec vitest run tests/unit/contract-doc.spec.ts`：1 个文件、7/7 tests passed。这只证明既有文档契约回归未失败，**不是本 feature 的功能验证或 AC 通过**。
- 正式 Plan 修订任务调用正常结束（707.33 秒，未超时），没有再因调用错误回退。固定候选后重新进入 Checklist 阶段，按该阶段首选 `claude-fable-5-1 via anthropic` 派独立 A；本阶段官方最小真实探活成功，bridge 沿用同会话耗尽记录且无重置证据。此处按阶段重新从首选开始，不是因 R1 未通过而另找模型寻求通过。

## Checklist R2 与本地保存（2026-10-30）

### 派工、输入与结论

- 固定受审提交：`57d0d84dc7754e97eb255488d8a6918eb9b50d98`（Plan blob `6119535`；相对 `037d616` 仅 4 个 Markdown 文件，+174/−70）。A 在新建的 Temp 分离工作树审查，不共享作者会话；实际模型 / 通道 = **`claude-fable-5-1 via anthropic`**，与 Plan 作者及拟定实施模型不同。官方最小真实探活成功，bridge 同会话已耗尽、无重置证据而未重试；本阶段没有回退。正式任务正常结束（495.65 秒，未超时）。
- A 的实际输入清单见 [当前有效清单头部](checklist.md)：根规则、workflow、model-routing、模板、冻结 spec、完整 Plan、R1 原件与真实 diff；只做有限的 pi 安装包公开文档佐证。未读任何真实私有会话、actor 原始日志或试点数据，未运行未来的功能测试。
- **A 单审结论**：Spec / Plan 质量定向复核通过；**P1=0、P2=0、新发现 P3=5**。R1 的 **4 项 P2、3 项 P3 均 CLOSED**。清单 **21/23**，只有 C-05 / C-09 保持未勾选，因实际 Tasks / Analyze 尚不存在。不是实施完成、功能验收或 Gate 2；27 条 spec AC 全部未勾选。
- A 只生成当前 `checklist.md` 与历史 `checklist-r1.md`。协调者逐字节复制两件产物，**未编辑任何清单内容或标记**。R2 原件 SHA256 = `1a667287562a1d13c3ddac74fd0196e6d4ccacea88d8e98127f285dc25a63d0c`；R1 归档 SHA256 仍为 `dbe95b58fa4abf45ba79593716d823b643ea682c9380459a62f2cf52d7cb5dc3`。Temp 检出受 `core.autocrlf=true` 影响可能为 CRLF，A 归档采用 Git blob 的 LF 原始字节；归档与旧主工作区原件完全一致。
- 评后 Plan 只追加一条头部状态记账，说明原文的“未经复核 / R1 唯一”是作者成稿时的历史状态；从行首 `## 1.` 至文末的设计正文仍与受审 `57d0d84` 逐字一致。不借记账修设计或消除 A 的新发现。

### 新发现 P3（均未修复、未风险接受）

| A 编号 | 待处理内容 | 后续要求 |
|---|---|---|
| P3-R2-1 | 未被 `nested_of` 引用的 toolResult“照计”须受单来源 / `all_nested_children_declared=true` 的前提约束 | 补限定语与 flag=false 的负例，避免把未确认用量算入小计 |
| P3-R2-2 | 峰值标签须显式限定为主 assistant 尝试，操作记录的单请求输入不参与 | 摘要与覆盖说明一致，不把局部峰值说成所有请求的峰值 |
| P3-R2-3 | 自动重试标记与新尝试的事件先后顺序尚待公开实现核实 | 先核实公开 pi 1.4.0 实现，不读真实会话、不构造虚假完整夹具；若改 §4.4 规则，再交 A 复核 |
| P3-R2-4 | `agent_settled`“收尾”的精确记录级判据 | 明确尾随非运行事件的处理与原因，不误称真实来源有采集缺口 |
| P3-R2-5 | 缺 `totalTokens` 的对账行为；血缘去重与嵌套分组求和的先后 | 各补明确规则与反例；如触及 §3.4 规则，再交 A 复核 |

### 下一步与边界

1. 按计划类路由生成 `tasks.md`（0.5～2h / 项、上下文 / 修改范围 / 引用 AC 的完成标准 / 对应验证命令），登记上述 5 项 P3，不把它们写成已修复或已接受。
2. 运行只读 Analyze，核对冻结 spec、受审 Plan 与实际 Tasks；发现差距先修相应产物，再重跑。对计量 / 去重 / 重试规则的实质修订须交独立 A 复核，不更改冻结 what。
3. 由独立 A 据真实 Tasks / Analyze 补审 C-05 / C-09。有效清单全部勾选且其他前置完成前，仍不得 Implement；不新增人工 Plan 审批，不重复 Gate 1。
4. 真实试点仍待用户另行显式选择与授权；当前没有读取许可，不为取样新增模型调用。此处只是保存 Plan / Checklist 阶段检查点，不是正式 Handoff，不 push / PR / merge；其他在研功能状态不变。

### 保存核对

- 协调者核对 A 两件产物的原件哈希、冻结正文哈希、27 条 AC 未勾选、当前清单 21/23、设计正文与受审版本相同、仅本 feature 文档与两处导航变化；`git diff --check` 通过。
- 提交前复跑既有文档契约回归（7/7）；仅作仓库文档回归，不是本 feature 功能测试。清单已保存且确认可恢复后，回收本轮 Temp 审核工作树，不留下新分支；模型请求 / 静态核对记录留在本机 Temp，不入库。

## Plan r3 与 Tasks 候选（2026-10-30）

- **用户指示**：再答“继续”，承接 R2 后的 Tasks → Analyze → A 补审，不授权选择或读取任何真实批次。
- **阶段 / 作者**：Plan r3 的 5 项 P3 修订与 Tasks = `claude-opus-5-5 via anthropic`；基线 `dc5932d3553aa4880ed35fd98d20ec0791043943`。同一协调 PI 会话的 bridge 已确认耗尽、无重置证据，不重试；官方最小真实探活成功。派工只允许 Plan / Tasks / review 及两处本 feature 导航，唯一串行写入者；未授权改 spec 或任何 checklist。
- **调用失败与接续**：正式任务运行 672.93 秒，未超时；进程虽退出 0，末次 assistant 为 `stopReason=error`（脱敏类别：provider error），故不能按命令退出码声称成功。已经保存完整 Plan r3 与 Tasks 有效稿；未改其他三个路径。按路由表回退 1，由 `openai/gpt-6.1-sol via openai` 接续确定性集成、核对与状态记账，未修改作者的技术方案、未因质量问题换模型；下一阶段重新从首选开始。没有读取或记录完整鉴权 / 服务错误。
- **实际输入**：根规则、路由、workflow 与 Tasks 模板；冻结 spec / Plan / Checklist R2 全文与最新 review；HANDOFF / specs 索引。作者按包相对路径记录公开 pi 1.4.0 文档与源码的哈希、方法、行号，见 Plan §7 r3；没有读取真实私有会话、actor 日志或试点负载。
- **有效稿内容**：Plan 对 5 项 P3 作限定语、峰值范围、公开源码重试顺序、settled 尾随判据、可选总数字段与血缘净新增覆盖修订；另据源码纠正 JSON `entry_appended` 可携带 usage 的事实（当前候选选择不抽取，作为未观测披露，是否符合冻结 AC 留待 Analyze，不能只凭作者声明通过）。27 行 AC 映射保留。
- **Tasks**：12 项，每项 0.5～2h、含依赖 / 上下文 / 文件范围 / 引用 AC 的完成标准 / 对应验证命令；27 条 AC 均有映射。所有任务未开始；T-12 依赖用户另行选定并授权文件，不阻塞离线任务但阻塞本 feature 最终验收。全部测试命令都是未来命令，未编写、未执行；不把既有后端 netstat 基线失败称为已修。
- **尚待**：只读 Analyze 必须以真实完整的 spec / Plan r3 / Tasks 为输入；发现差距先回 Plan / Tasks 修复再重跑。随后独立 A 对固定提交重新审改动规则，并依据实际 Analyze / Tasks 复核 C-05 / C-09；R2 仍为 21/23，作者与协调者未改清单，也不声明 5 P3 已关闭。
- **边界**：无实现、无功能测试、无 AC 通过；不改其他 feature 或全局配置；不增加人工 Plan 审批，不重复 Gate 1；无 Gate 2、push / PR / merge。

## claude-bridge 路由更正与 Analyze R1（2026-10-30）

### bridge 复测与更正

- 用户问“claude-bridge 应该可以用吧？”。协调者 23:00（+04:00）对 `claude-bridge` 各做一次最小真实调用：`claude-opus-5-5`、`claude-fable-5-1` 均成功。
- **更正**：此前各节的“bridge 当窗耗尽、无重置证据”沿用的是断网暂停前的旧记录；用户恢复后数小时，协调者未按 [规则 5](../../docs/development/model-routing.md#rule-5)（新会话或窗口重置后再测）复测。故恢复以来 Plan r2、Checklist R2、Plan r3 / Tasks 三个阶段都直接走了官方 `anthropic` 通道；彼时 bridge 是否可用已无法查证。这是协调者的路由执行疏失；各产物内容与审查结论不受影响，但其中关于 bridge 的表述以本节为准。
- **首次 Analyze 派工作废**：官方通道最小探活失败后，协调者在未测 bridge 的前提下回退到 `openai/gpt-6.1-sol`；规则 2 要求两条通道都不通才回退模型，前提不成立。该运行已自行结束并写出草稿；协调者在**未读结论**时将草稿原样移出仓库，存于本机 Temp（12,568 字节，SHA256 `f2fba72fc89038e84d582df7e6d17639b18fb6b84d66fe5f2ffda6ea22d52e4a`），不作有效结论。这是路由纠正，不是择优。
- 自此 Claude 各阶段一律先测 bridge，每阶段派工前做最小真实调用，不沿用旧记录；不改 provider / key / 路由 / 全局配置。

### Analyze R1

- **角色 / 路由**：Analyze R1 = `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道），新会话、只写 [analyze.md](analyze.md)；固定提交 `325e43b57b890eea30fce0d9e7915214caa3404b`。正式任务正常结束（335.05 秒，未超时，末次 `stopReason=stop`）。输入清单见报告头部；未读真实私有会话或试点数据。
- **结论：未通过**。P2-AN-1：JSON 事件流中 `entry_appended` 可携带来源已暴露的用量记录（settled 后的 `cache_warm` usage 条目；扩展在边界提交、不经 `compaction_end` 的 compaction），Plan r3 不抽取却仍可报完整总计与 tokens complete，与 spec“完整总计”术语、AC-003-4、AC-005-3 冲突。P3-AN-1：T-11 验证命令 10 的 `git grep` 对未跟踪新文件恒为空。其余核对无冲突：27 条 AC 双向映射、任务依赖无环、退出码与六项度量同 R2；5 项 P3-R2 作者修订均有落点，待 A。
- 不需回 Clarify：Analyze 认定可在冻结 AC 内修正 Plan / Tasks。协调者只保存报告原文，未改其内容。
- **下一步**：Plan r4 / Tasks 修订（计划类首选，先测 bridge）→ 对新固定提交重跑 Analyze，新报告写 `analyze-r2.md`，R1 原文保留（沿用 frontend-workbench 的按轮存档先例）→ 独立 A Checklist R3。有效清单 23/23 前不得开始 T-01。

## Plan r4 与 Tasks 修订（Analyze R1）（2026-10-30）

- **角色 / 路由**：Plan / Tasks 修订作者 = `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前对 bridge 做最小真实调用成功）。唯一串行写入者；只写 plan.md、tasks.md 与本文件（追加本节 + 头部状态行）。未改 spec、任何 checklist、analyze.md、HANDOFF.md、specs/README.md；无 Git 写、网络、安装、派工；未读真实 `~/.pi` 会话、actor / agent 日志、Temp 负载或试点数据。
- **基线**：`64e20e8489fbe18f81536bce4aac3a888891bba6`（分支 `workbench`，开始时干净）。
- **实际输入**：AGENTS.md（ee8e4ab）、model-routing.md（f980f5c）、templates/tasks.md（4b7f955）全文；workflow.md（4aca344）总规则、第 4 / 6 / 7 / 8 步与 Gate；spec.md（4689093）全文，锚定正文 SHA256 实算仍为 `a504fed8…e823`；plan.md r3（9afc846）、tasks.md（9e8c9a4）、analyze.md（2caea51）、checklist.md R2（40b0b87）全文；本文件（4686eb8）头部与最后两节。pi 1.4.0 公开安装包有界只读核实（包相对路径、哈希与行号见 plan.md §7 r4）。
- **改了什么（作者修订的设计，未实施、未测试）**：
  - P2-AN-1：按 Analyze 修复方向 (a)，`pi-json-events` 白名单抽取 `entry_appended.entry` 中的 usage 条目（type / id / kind / provider / model / usage 数值）与 compaction（type / id / usage 数值），与 session-v3 同口径计为“其他模型操作记录”（已覆盖、request_count unknown、非主尝试、不参与峰值），不论在 settled 之前或之后。源码核实：`entry_appended` 共 5 个发射点，带 usage 的只有缓存预热 usage 条目与扩展边界草稿 compaction；常规压缩只经 `compaction_end`、边界压缩只经 `entry_appended`，各自唯一归属，`entry_appended` 内按 entry id 去重。其他类型不读内容，带顶层 `usage` 键 → `entry_unrecognized`，完整总计 unknown（`entry_appended_usage_unrecognized`），不静默丢弃。`unobserved_paths` 只留已核实盲区（json 的 branch summary、失败的缓存预热请求等）。新增夹具 F13 与测试 `test_entry_appended_usage_records_counted`；隐私哨兵扩至 `entry_appended` 的 custom / custom_message / compaction 负载。Tasks 同步 T-03 / T-04 / T-07 / T-11 与 AC 覆盖表（仍 27 行）。
  - P3-AN-1：T-11 验证命令 10 改为 `git grep --untracked …`，完成标准 10 同步。
  - plan.md 头部加 r4 行与“bridge 耗尽”旧表述过时的指引（不改写历史）；§7 新增 r4 表与源码核实元数据。退出码、六项度量矩阵、收尾判据的类型 / 顺序规则与其余 R2 已接受方案未改。
- **未完成 / 待办**：对包含本修订的新固定提交重跑只读 Analyze（写 `analyze-r2.md`，R1 原文保留）；P2-AN-1 / P3-AN-1 是否关闭由 Analyze R2 判定。之后由独立 A 做 Checklist R3，复核 r3 / r4 规则改动与 P3-R2-1～5，并依据实际 Tasks / Analyze 判 C-05 / C-09；Checklist R2 仍 21/23，有效清单 23/23 前不得开始 T-01。全部任务未开始；T-12 真实试点仍外部阻塞。
- **边界**：不需要回 Clarify（修订在冻结 AC 内）；无实现、无功能测试、无 AC 通过、无 Gate 2；本节不是关闭声明，也不是风险接受。
- **协调者集成**：作者会话正常结束（485.36 秒，未超时，末次 `stopReason=stop`）。协调者静态核对受保护文件未变、27 行 AC 双向映射、12 项任务无环且完成标准 / 验证命令逐项等数、测试名一致、仅 3 个允许路径变化，并复跑既有文档契约回归（7/7，不是本 feature 功能测试），提交为 `4132cc6`。

## Analyze R2（2026-10-30）

- **角色 / 路由**：Analyze R2 = `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；派工前最小真实调用成功），新开会话、与 Plan r4 作者会话分离，只写 [analyze-r2.md](analyze-r2.md)；固定提交 `4132cc66054f52a9892f3e8c640839f12d5851a4`。正式任务正常结束（276.72 秒，未超时，末次 `stopReason=stop`）。[Analyze R1](analyze.md) 原文未动。
- **结论：PASS（0 P1 / 0 P2 / 0 P3）**。P2-AN-1（`entry_appended` 白名单抽取、单一归属无重计、未识别用量保守回退、披露与隐私）与 P3-AN-1（`git grep --untracked`）均已解决，并做了有界公开源码复核；r4 未引入回归，退出码与六项度量未变。另有 4 条非阻塞观察（F13 夹具的组织与事件顺序、只检测顶层 `usage` 的版本漂移边界、T-11 正则只匹配顶层 import、“json-events 无条目 id”的措辞），供实施者与 A 参考，不要求回 Plan。
- PASS 只是一致性分析结论，不是任务执行、AC 完成、Checklist 批准或 Implement 授权；C-05 / C-09、r3 / r4 规则与 P3-R2-1～5 只由独立 A 判定。
- **下一步**：独立 A = `claude-fable-5-1 via claude-bridge` 在 Temp 分离工作树对固定提交做 Checklist R3（先逐字节归档 R2 为 `checklist-r2.md`）。有效清单 23/23 前不得开始 T-01；T-12 真实试点仍待用户另行授权。

## Checklist R3 与实施前状态（2026-10-30）

- **审核员 / 路由**：A = `claude-fable-5-1 via claude-bridge`（A 首选模型 + 首选通道；派工前最小真实调用成功），新开会话，在 Temp 分离工作树只读审查固定提交 `9f60aecd7a5b972deb0a13803db62db3b5be65c9`；正式任务正常结束（459.84 秒，未超时，末次 `stopReason=stop`）。A 与 Plan / Tasks / Analyze 作者（opus）及拟定实施模型（astra / deepseek）均不同；单审，结论即审核结论。
- **产物**：A 先将 R2 逐字节归档为 [checklist-r2.md](checklist-r2.md)（SHA256 `1a667287562a1d13c3ddac74fd0196e6d4ccacea88d8e98127f285dc25a63d0c`），再写当前有效 [checklist.md](checklist.md) R3（SHA256 `222a97e2e2d07bb373b62a7ec4322cc849031eddce8a5cbbbb8b5c63defdd34a`）。协调者逐字节复制两件产物，**未编辑任何清单内容或标记**。
- **结论**：**Checklist R3 通过，有效清单 23/23**；P1 = 0、P2 = 0、P3 = 1。P3-R3-1：tasks.md 覆盖表 AC-001-1 行列了 T-02，而 T-02 的完成标准未引用该 AC；T-11 完成标准 8～10 为非 AC 纪律项、未标注。R2 的 P3-R2-1～5 由 A 判全部 CLOSED；Analyze R1 两项发现经 A 独立复核同意已解决。另有 3 条非阻塞观察（估时满载时应拆分任务、json.md 描述窄于源码、error 结局的用量只作下界）。
- **含义**：只代表需求 / 设计质量达标，满足 Implement 的 checklist 前置；不是实施、测试、AC 完成、Review 或 Gate 2。Spec 27 条 AC 仍全部未勾选；T-12 / AC-008-1 / AC-008-3 仍待用户另行选定并授权真实批次。
- **未修**：P3-R3-1 未修复、未风险接受。A 建议在实施提交中顺带修正；只要不触及 Plan §3.4 / §4.2 / §4.4 / §4.7 的规则，不需新的 Checklist 轮次。
- **下一步**：Implement T-01～T-11（按 model-routing：首选 `openai/gpt-6-astra`，派工前探活；按 tasks.md 依赖顺序；实施过程中不改任何 checklist 文件）→ Converge → 独立 A Review → 本 feature Gate 2。T-12 待用户选定并授权。尚未派实施工。

## Implement（2026-10-30 起）

### 前置核对与派工方式

- 前置：有效 [Checklist R3](checklist.md) 23/23（SHA256 `222a97e2…d34a`）；Tasks 与 [Analyze R2](analyze-r2.md)（PASS）齐备；冻结 spec 正文哈希一致。实施开始时 27 条 AC 全部未勾选。
- 路由：Implement 首选 `openai/gpt-6-astra via openai`，派工前最小真实调用成功。实施者是唯一串行写入者，只写计划规定的 3 个新文件、tasks.md 状态行（第 4 批另可改 `backend/README.md` 一行与 P3-R3-1）；不做 Git 写操作，由协调者复跑测试、核对范围后提交。协调者不改 checklist。
- 分批（按 tasks.md 依赖顺序）：第 1 批 T-01～T-03；第 2 批 T-04～T-06；第 3 批 T-07～T-09；第 4 批 T-10～T-11。T-12 真实试点仍外部阻塞。

### 第 1 批：T-01～T-03

- 实施者 `openai/gpt-6-astra via openai`，基线 `7bd2e5b`；正式任务正常结束（642.41 秒，未超时）。新增 `backend/tools/dev_harness_budget.py`、`backend/tests/test_dev_harness_budget.py`、`backend/tests/dev_harness_budget_fixtures.py`，并在 tasks.md 三个任务下加状态行。
- 协调者复跑：模块测试 `python -m pytest tests/test_dev_harness_budget.py -q` → 90 passed；T-01～T-03 的 7 条验证命令逐条通过（19 / 14 / 1 / 17 / 7 / 10 / 22 项）；`git grep --untracked` 检查无产品包导入。
- **协调者发现（待第 2 批先修，属实施偏差，不涉需求或设计）**：pi 1.4.0 对每条 toolResult 先发 `message_start` 再发 `message_end`（公开安装包 `pi-agent-core/dist/agent-loop.js` 677–679 `emitToolResultMessage`，文件 SHA256 `22ee81f9…1129`）。现读取器两者都处理，真实事件流中同一工具结果的用量会计两次并多出一条“仅终态”工具记录；Plan §3.2 规定以 toolResult `message_end` 为归属，AC-004-2 要求“工具 end 与 toolResult 不重复”。现有夹具只写 `message_end`，故测试未发现。另：三个新文件的模块文档头写入了模型 / 批次 / 输入清单等过程信息，仓库其他 `backend/tools/*.py` 只写用途与用法，路由记录应在本文件，第 2 批一并清理。

### 第 2 批：T-04～T-06（含第 1 批两项先修）

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `99b7422`；正式任务正常结束（594.32 秒，未超时）。
- 先修：json-events 只在 `message_end` 处理 toolResult（`message_start` 忽略），夹具改为真实次序 `tool_execution_start` → `tool_execution_end` → `message_start`(toolResult) → `message_end`(toolResult)，`test_repeated_message_counted_once` 增加单次计数断言；三个文件的文档头只留用途与用法。
- 新增：`build_report` 的 token 核心（完整总计条件、峰值标签与注明、`entry_appended` 记录计入、`entry_unrecognized` 阻断）、关系分区（两种单层星形、`duplicate_of` 生效条件与 v3 键集核验、血缘净新增、同会话双采集）、嵌套覆盖（多来源须显式声明、(P, T) 分组逐维核对）；夹具 F5、F8、F13 等。
- 协调者复跑：模块测试 150 passed；T-01～T-06 的 21 条验证命令逐条通过；无产品包导入。

### 第 3 批：T-07～T-09

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `e171cb3`；正式任务正常结束（812.65 秒，未超时）。
- 新增：主尝试五态计数与 `run_total`、操作记录（request_count unknown，不与尝试相加）、工具三视图与 `all_total`、§4.4 重试括号（confirmed 只计括号内观测到的新尝试，`scheduled_unobserved` 单列，原生 total 恒 unknown，摘要重试标记单列）、返工只取标注、`unobserved_paths`；时间与执行结果（只用带出处的标注，窗口须全部边界已知且可比，时间独立于 token 分区与采集状态）；维度出处与冲突、按维度守恒的分组、六项度量矩阵与 overall、D1 归一化域样例。
- 协调者复跑：模块测试 247 passed；T-07～T-09 的 14 条验证命令逐条通过；无产品包导入；`git diff --check` 通过。

### 第 4 批：T-10～T-11

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `9db3c33`；正式任务正常结束（609.46 秒，未超时）。
- 新增：`render_summary`（四层状态分列、单位与分母、峰值标签与注明、快照总体说明、“非验收结论”）、`main`（参数错误固定类别不回显、out-dir 须已存在且在仓库外、内存生成后独占创建、只清理本次文件、退出码 0 / 3 / 2 / 1、固定 stdout / stderr）、`--compare-with` 可比性；端到端离线 / 隐私 / 仓库状态回归 7 项测试；`backend/README.md` 工具表一行。按 Checklist R3 建议修 P3-R3-1：tasks.md 覆盖表 AC-001-1 行只列 T-11，T-11 完成标准 8～10 标“（非 AC，Plan §1 / AGENTS §4）”。
- 协调者复跑：模块测试 307 passed；T-10～T-11 的 12 条验证命令逐条通过；后端全量 `python -m pytest tests/ -q` = 760 passed / 1 failed / 5 skipped，唯一失败 `tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only` 即 HANDOFF 记录的既有基线（netstat 非空监听断言），不属本 feature、无新增失败；`git grep --untracked` 无产品包导入；`pyproject.toml` / `.gitignore` 未变。
- 协调者合成冒烟（仓库外 Temp，合成样例，非真实试点）：缺一来源时退出 3、状态行与摘要分列四层状态；重跑撞已有产物退出 2（`output_exists`）且不覆盖；仓库内 out-dir 退出 2（`out_dir_inside_repo`）；提示词哨兵、本机路径与来源文件名均未出现在产物中。观察（留待 Converge / Review 判定）：缺失来源时摘要 tokens 行显示“分母 1、已覆盖 1、缺失 0、覆盖率 100%”，与 AC-007-1“分母未知不给百分比、缺失计数”的口径可能不符。
- T-01～T-11 均已实施；T-12 真实试点仍待用户选定并授权，AC-008-1 / AC-008-3 未验收。27 条 AC 均未勾选，须待 Review 与 Gate 2。

## Converge R1（2026-10-31）

- Converge R1 = `claude-opus-5-5 via claude-bridge`（计划 / 分析类首选模型 + 首选通道；派工前最小真实调用成功），新开会话，未写过本 feature 代码；固定提交 `b8175f473aaa46cde9c4eb71358daada5bbd6210`；正式任务正常结束（738.5 秒，未超时）。报告见 [converge.md](converge.md)。
- **结论：未收敛**。T-01～T-11 的 47 条验证命令全部通过；模块 307 passed；全量 760 / 1 / 5，唯一失败为既有基线。真实差距 1 处：选定来源有缺口（unavailable / partial / empty）时，tokens / tool_calls 覆盖行仍给出“已知”分母与 100% 覆盖率、缺失 0，不符 AC-007-1 与 Plan §3.3、§4.3 第 1 条（即协调者冒烟观察，经 Converge 独立复现，S2 为坏行 / 截断时同样如此）。Converge 在 tasks.md 追加 **T-13**（只让实现符合现有 Plan，不改 Plan、不新增需求）。AC 计数：已收敛 24、差距 1（AC-007-1）、待试点 2（AC-008-1 / AC-008-3，T-12 外部阻塞）。
- 非阻塞观察：第 4 批在 `dev_harness_budget.py` 文档头重新写入了过程信息（与第 2 批清理后的仓库惯例不符，随 T-13 一并清理）；`_groups` 用生产 `assert` 守恒（Plan §4.3 原文即“断言”，测试另行核对加和，不处理）。
- **下一步**：Implement T-13（首选 `openai/gpt-6-astra`，先探活；同时清理文档头、在 tasks.md 覆盖表 AC-007-1 行补列 T-13）→ 对新固定提交重跑 Converge（R2）→ 收敛后独立 A Review。

### 第 5 批：T-13（Converge R1 差距）

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `7705b50`；正式任务正常结束（360.57 秒，未超时）。
- 修改：`_observation` 在任一选定来源非 loaded 时，tokens / tool_calls 两行的分母、缺失数、覆盖率置为未知（report.json 为 null，摘要显示“未知”），另列 `missing_sources`（单位“来源”，不与记录数相加）；全部 loaded 时不变，rework / timing、main_attempts / retries 不变。新增 `test_coverage_denominator_unknown_with_source_gaps`（经 `main`，缺失 / 坏行 / 只有 header 三种缺口 + 全部 loaded 对照）。清除第 4 批写回文件头的过程信息。tasks.md：AC-007-1 行补列 T-13，T-13 状态行改为已实施。
- 实施者报告全量 `python -m pytest tests/ -q` = 764 passed / 1 failed / 5 skipped，唯一失败为既有 netstat 监听断言，无新增失败。协调者复跑：模块 311 passed、T-13 命令 1 → 4 passed；无产品包导入；`git diff --check` 通过。按约定，协调者本轮不再重复跑全量测试（由 Converge R2 复跑）。

## Converge R2（2026-10-31）

- Converge R2 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `b014e401a836565765dd0060a4260334d35ba51d`；正式任务正常结束（543.45 秒，未超时）。报告见 [converge-r2.md](converge-r2.md)，[Converge R1](converge.md) 原文不动。
- **结论：未收敛**。T-13 自身已收敛（覆盖表两行在来源缺口下分母 / 缺失 / 百分比为未知，另列来源缺口数）。但同一规则在**分组节**未落实：来源缺口时 `### phase` 等仍写“分母 1”、组行“缺失 0”，与同一报告 token 行“分母 未知”矛盾（S2 坏行时分组节写“分母 2”）。追加 **T-14**（只让分组节符合现有 Plan，不改 Plan、不新增需求）。T-01～T-11、T-13 的 48 条验证命令全过；模块 311 passed；全量 764 / 1 / 5，唯一失败为既有基线。AC 计数：已收敛 24、差距 1（AC-007-1）、待试点 2。
- 非阻塞观察：tasks.md 覆盖表 AC-007-1 行测试列未列 T-13 / T-14 新测试（随 T-14 补）；`_groups` 的生产 `assert` 同 R1 观察，不处理。
- **下一步**：Implement T-14（首选 `openai/gpt-6-astra`，先探活）→ Converge R3 → 收敛后独立 A Review。

### 第 6 批：T-14（Converge R2 差距）

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `812c1c1`；正式任务正常结束（432.54 秒，未超时）。
- 修改：`_groups` 在任一选定来源非 loaded 时 `groups.<维度>.denominator` 为 null，另列 `missing_sources`（单位“来源”）；摘要分组节首行“分母 未知”，组行“未覆盖 / 缺失记录”与“分母”两列显示“未知”；已知小计、已覆盖记录、守恒不变，全部 loaded 时摘要逐字不变。新增 `test_group_denominator_unknown_with_source_gaps`（经 `main`，缺失 / 坏行 / 只有 header + 全部 loaded 对照）。tasks.md：AC-007-1 行任务列补 T-14、测试列补 T-13 / T-14 两项新测试；T-14 状态行改为已实施。
- 实施者报告全量 768 passed / 1 failed / 5 skipped，唯一失败为既有 netstat 基线，无新增失败。协调者复跑：模块 315 passed、T-14 命令 1 → 4 passed；无产品包导入；`git diff --check` 通过。
- **只读扫描（实施者按派工要求报告，未改代码）**：同类候选两处，交 Converge R3 判定——(1) 来源缺口时 token 节“未知 0 条用量归属记录”及各维 `unknown_records` 0（计数对象是已读到的记录，可能被误读为“无未知”）；(2) 峰值行“参与记录数 / 尝试总数：1 / 1”的“总数”措辞（Plan §3.3 原文用语；旁有“已知记录中的峰值（下界）”标注）。

## Converge R3（2026-10-31）

- Converge R3 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `f3e3d18482a2e6d560e1d84011e88e5200420abd`；正式任务正常结束（591.42 秒，未超时）。报告见 [converge-r3.md](converge-r3.md)；R1 / R2 原文不动。
- **结论：未收敛**。T-13、T-14 均已收敛（覆盖表与分组节在来源缺口下分母 / 缺失为未知，全部 loaded 时摘要哈希不变）。按派工要求对整份报告做同类扫描，只剩最后一处：来源缺口时摘要 `### token` 节仍写“未知 0 条用量归属记录”，维度表“未知记录”列为 0，与覆盖表“未知”矛盾；追加 **T-15**（只改摘要渲染，JSON 保持观测计数，不改 Plan、不新增需求）。第 6 批扫描的另一候选（峰值行“尝试总数”措辞）判定不属此类（Plan §3.3 原文用语，所在行已标下界）。49 条验证命令全过；模块 315 passed；全量 768 / 1 / 5，唯一失败为既有基线。AC 计数：已收敛 24、差距 1（AC-007-1）、待试点 2。
- **下一步**：Implement T-15（首选 `openai/gpt-6-astra`，先探活）→ Converge R4 → 收敛后独立 A Review。

### 第 7 批：T-15（Converge R3 差距）

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `159c09d`；正式任务正常结束（308.78 秒，未超时）。
- 修改：`render_summary` token 节在 `missing_sources.count > 0` 时，叙述行写“未知用量归属记录数 未知”、维度表六行“未知记录”列显示“未知”，其余列不变；`report.json` 不变；全部 loaded 时摘要逐字不变（T-14 测试的摘要哈希照过）。新增 `test_token_unknown_records_unknown_with_source_gaps`（经 `main`，三种缺口 + 全部 loaded 对照）。tasks.md：AC-007-1 行补 T-15 与新测试；T-15 状态行改为已实施。
- 实施者报告全量 772 passed / 1 failed / 5 skipped，唯一失败为既有 netstat 基线，无新增失败。协调者复跑：模块 319 passed；T-15 / T-14 命令 1 各 4 passed；无产品包导入；`git diff --check` 通过。

## Converge R4（2026-10-31）

- Converge R4 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `f2f8fb53a4c47b77105cecf1b1a13c6d6b8b0a09`；正式任务正常结束（467.74 秒，未超时）。报告见 [converge-r4.md](converge-r4.md)；R1～R3 原文不动。
- **结论：已收敛（T-01～T-11、T-13～T-15 离线实现范围）**。T-15 关闭 R3 差距（五种来源缺口下 token 节均为“未知”，report.json 与改前逐字节相同，全部 loaded 时摘要逐字节不变）；复核 R3 同类扫描表并逐行扫描五种缺口下的摘要，无剩余同类位置；未追加任务。50 条验证命令全过；模块 319 passed；全量 772 / 1 / 5，唯一失败为既有 netstat 基线。AC 计数：已收敛 25、差距 0、待试点 2（AC-008-1 / AC-008-3，T-12 外部阻塞）。
- 本结论不是独立 Review、不是 Gate 2、不是 AC 验收。**下一步**：独立 A Review（`claude-fable-5-1 via claude-bridge`，Temp 分离工作树只读审查固定提交与真实 diff）。

## Review R1（2026-10-31）

- 审核员 A = `claude-fable-5-1 via claude-bridge`（A 首选模型 + 首选通道；派工前最小真实调用成功），新开会话，在 Temp 分离工作树只读审查固定提交 `f5dbf6390aeacc7a7fc40f931f60ab6aec218aac` 与真实 diff `7bd2e5b..HEAD`；正式任务正常结束（762.1 秒，未超时）。与实施者（astra）及 Plan / Tasks / Analyze / Converge 作者（opus）均不同模型。A 只新建 [code-review-r1.md](code-review-r1.md)；协调者逐字节复制（SHA256 `9e88d8ecd33783e0754dc48b09369a52fd2882406e0227df7ae406052e94ca6e`），未改其内容。
- **结论：未通过**（P1 0 / P2 1 / P3 3）；A 实跑模块测试 319 passed，并做 5 组合成复现。
  - **P2-CR-1**：pi 1.4.0 的工具内嵌套调用（`ctx.executeTool()`，公开安装包 `nested-tool-calls.js`）在同一 json 流中发出带 `parentToolCallId` 的 `tool_execution_*` 事件；读取器不读该字段，把嵌套执行计为 direct 调用。复现：模型发起 1 次、嵌套 2 次 → direct 3、`tool_calls` complete、覆盖 100%（违反 AC-005-1 / AC-007-1）。属 Plan 对真实事件形状的盲点，不是需求变更，不回 Clarify；修复须先改 Plan §3.2 / §3.3 / §4.2，再追加任务实施。夹具 F2 / F12 写了 `nestedCalls` 却没有对应嵌套事件，与 1.4.0 形状不符，故测试未发现。
  - **P3-CR-1**：全部 loaded 但去重未确认（同会话双采集）时，tokens 覆盖行与分组节写“分母 0 / 缺失 0”，并误用原因 `no_usage_records_observed`。
  - **P3-CR-2**：血缘父已选入但不可用时，子来源仍标 `net_new_determined: true`、“复制件由血缘父计”。
  - **P3-CR-3**：`_groups` 用生产 `assert` 守恒。
- T-12 / AC-008-1 / AC-008-3 仍外部阻塞，本轮不予接受。本结论不是 Gate 2，不授权 Handoff。
- **待用户确认（Gate 2 对 R1 结论的处置）**：P2 必修。协调者建议本轮一并修 3 项 P3（都小，且 P3-CR-1 与 Converge R1～R3 同类）。修复会改动 Plan §4.2 等规则；按 Checklist R3 写明的条件（触及 §3.4 / §4.2 / §4.4 / §4.7 须再开 Checklist 轮次）与 desktop-shell 修订 4 先例，顺序为：Plan r5 + 追加任务 → Analyze R3 → 独立 A Checklist R4 → Implement → Converge → 独立 A Review R2。

### 用户对 Review R1 的处置与试点授权（2026-10-31）

- 用户原话：**“全修，T-12同批完成，授权脱敏”**。即：P2-CR-1 与 P3-CR-1～3 全部修复（不作风险接受）；真实试点 T-12 在本修复批次内完成；授权读取，产物与记录须脱敏。
- **授权范围**（按协调者提议的候选，取窄解释）：本机系统 Temp 下本功能临时目录中，本功能各阶段子会话的 `pi --mode json` 事件捕获，即文件名为 `budget-*.jsonl` 与 `review-budget-*.jsonl` 者（授权时 27 个；修复循环新生成的同类捕获同属本功能子会话）。不含协调者自身会话、`~/.pi` 下的会话、其他项目或私有文档目录。
- **执行约束**：试点由协调者在修复实施完成后以最终代码运行，不新增模型调用、不重跑任务；清单与报告只放仓库外的系统 Temp；review.md 只记脱敏计数与状态，不记路径、会话 ID、提示词或报告原文；运行前后核对被观测 feature 的 spec / checklist / review 哈希与 `git status`。
- 授权前协调者只核对了每个候选文件首条记录的类型与版本及行数（27 个均为 `session` v3 头，约 20.1 万行），未读取内容。
- **修复顺序**（Checklist R3 写明触及 §4.2 等规则须再开 Checklist 轮次，并参照 desktop-shell 修订 4 先例）：Plan r5 + 追加任务 → Analyze R3 → 独立 A Checklist R4 → Implement → 试点 T-12 → Converge → 独立 A Review R2 → Gate 2。

## Plan r5 与 Tasks 修订（Review R1）（2026-10-31）

- **角色 / 路由**：Plan / Tasks 修订作者 = `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前在 claude-bridge 做最小真实调用成功，为协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置。唯一串行写入者；只写 plan.md、tasks.md 与本文件（追加本节 + 头部状态行）。未改 spec、任何 checklist*、analyze*、converge*、code-review*、HANDOFF.md、specs/README.md；无代码改动、无测试运行、无 Git 写、网络、安装或派工；未读真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。
- **基线**：`70291e3d13867fb7390202d964474b0d303cd081`（分支 `workbench`，开始时干净）。
- **实际输入**：AGENTS.md（ee8e4ab）、model-routing.md（f980f5c）、templates/tasks.md（4b7f955）全文；workflow.md（4aca344）总规则、第 4 / 6 / 7 / 8 步与 Gate；spec.md（4689093）全文，锚定正文 SHA256 实算仍为 `a504fed8…e823`；plan.md r4（9c1c8bc）、tasks.md（a474f2b）、code-review-r1.md（2272b21）、checklist.md R3（04fe4b1）、converge-r4.md（38b87a3）全文；本文件（1f79d39）头部、“Review R1”与“用户对 Review R1 的处置与试点授权”两节；`backend/tools/dev_harness_budget.py`（3d81548）相关函数，以及夹具 / 测试中 nestedCalls、direct 计数、复制件数、空集原因、守恒与摘要哈希断言的检索。pi 1.4.0 公开安装包有界只读核实（包相对路径、哈希与行号见 plan.md §7 r5）。
- **源码核实要点**：工具内嵌套调用（`ctx.executeTool()`）在同一会话事件流中发 `tool_execution_start` / `update` / `end`，均带 `parentToolCallId`，子 id 由 pi 赋为 `<直接调用者 id>/<n>`（多层时孙调用的父是子调用 id）；不发 `message_*`、不产生 toolResult、结果不持久化。模型发起调用的 toolResult 在 `message_start` 时由 pi 附加 `nestedCalls`（覆盖各深度，记录 id 与执行 id 相同，最多 256 条，超限 `complete=false`），并把各深度嵌套 usage 并入其 `usage`；json 模式原样写出这些事件。因此 token 口径无需改动（嵌套 `tool_execution_end.result.usage` 本就不读），缺陷只在工具调用视图。
- **改了什么（作者修订的设计，未实施、未测试）**：
  - P2-CR-1：白名单增读 `parentToolCallId`（只作内部判定与哈希，不输出）；带父 id 的执行记为 `NestedExecutionRecord`，永不进入 direct；在同一 owner 作用域内解析顶层父，零或多候选 → `nested_parent_unresolved`，仍为嵌套；嵌套身份 = (来源, 顶层父调用身份, 子 id)，与父 toolResult `nestedCalls` 同法构造并去重（`nested_deduplicated`：matched / executed_only / reported_only）；状态 finished / unfinished / terminal_only；direct 的计数、分母与覆盖率不含嵌套，`nested_parent_unresolved` / `nested_execution_incomplete` 与既有 `nested_incomplete` 一样阻止 tool_calls complete；`all_total` 保守，存在任何嵌套证据即 unknown。F2 夹具改为真实形状（补嵌套事件、id 用 `call_0/n`、去掉重复记录），新增 F14 (a)～(f)。
  - P3-CR-1：存在未确认分区时，tokens / tool_calls 覆盖行、分组节、token 节的分母 / 缺失 / 未知记录数与来源缺口同样显示“未知”，另列 `unconfirmed_sources`；空的已确认集合用 `no_confirmed_records`，`no_usage_records_observed` 只属于 `empty` 来源。
  - P3-CR-2：血缘父已选入但非 `loaded` → 不做键集差，记 `lineage_parent_unavailable`、`net_new_determined: false`、复制件数未知（同 `parent_not_selected`）；父为 `partial` 时父子另入未确认分区，以免重复计入；`parent_not_selected` 同样显示复制件数 / 净新增数未知。
  - P3-CR-3：分组守恒改为计算，失败时记 `group_conservation_failed`、完整总计未知、tokens 降为 partial，不用生产 `assert`。
  - 记账：Plan §5 补登记 T-13～T-15 已在用的三个测试名；plan.md 头部加 r5 行，§7 新增 r5 表与源码核实元数据，输入清单补 r5 行。
  - Tasks：新增 T-16～T-20（全部未开始，依赖线性；T-16 须待 Analyze R3 通过且 Checklist R4 全部勾选）。明确两处既有测试修正：T-16 中 F2 改为真实形状后，若有断言变化须改正并逐条记录（按 Plan，F2 的 direct 1、nested_reported 2、状态 partial 不变）；T-19 中 `parent_not_selected` 的 `copied_record_count` 由 0 改为 null。T-12 由“外部阻塞”改为已授权（用户原话、范围与执行约束同上一节），依赖加入 T-13～T-20，完成标准与命令不变。AC 覆盖表相应行已更新，仍为 27 行。
- **未改**：退出码、六项度量矩阵、§4.2 收尾判据、重试括号、时间规则与其余已接受方案；无新需求、新度量、新阈值、新模式或新来源格式；不需回 Clarify（AC-005-1 已要求嵌套标识去重）。
- **未完成 / 待办**：对包含本修订的新固定提交做 Analyze R3（写 `analyze-r3.md`）→ 独立 A Checklist R4（Checklist R3 只覆盖 r4，不覆盖 r5 改动的 §3.3 / §3.4 / §4.2 / §4.3 / §4.7 规则）→ Implement T-16～T-20 → T-12 真实试点（协调者执行，已授权）→ Converge → 独立 A Review R2 → Gate 2。
- **边界**：本节不是关闭声明，也不是风险接受；四项发现是否关闭由 Review R2 判定。27 条 AC 仍全部未勾选；无 Gate 2。

## Analyze R3（2026-10-31）

- Analyze R3 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话、与 Plan r5 作者会话分离；固定提交 `42d15069ddb8ef8bd2c4eb227d5d172a87b128f7`；正式任务正常结束（445.34 秒，未超时）。报告见 [analyze-r3.md](analyze-r3.md)；R1 / R2 原文不动。
- **结论：未通过**（0 P1 / 0 P2 / 3 P3）。Review R1 四项发现在 Plan r5 与 T-16～T-20 中均有设计承接，有界源码核实支持作者对 `parentToolCallId`、子 id、共享记录器与嵌套 usage 的说法；退出码与六项度量未变，无回归。三项 P3：(1) T-12“修改范围”仍保留 r4 旧文字（`%LOCALAPPDATA%` 示例、由用户编写清单），与已记录的授权约束（协调者运行、只放系统 Temp）冲突；(2) 血缘冲突 / 不支持形状等净新增集不可确定的情形仍显示“复制件 0 条”（P3-CR-2 同类残留，§3.4 / §3.6 / T-19 口径不一）；(3) Plan §5 中 F2 的嵌套去重断言（matched 2）未进入任何任务的完成标准。
- **下一步**：按第 7 步先修正 Plan / Tasks（计划类，先测 bridge）→ 重跑 Analyze（R4）→ 独立 A Checklist R4。

## Plan r6 / Tasks 补正（Analyze R3）（2026-10-31）

- **角色 / 路由**：Plan / Tasks 修订作者 = `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前在 claude-bridge 做最小真实调用成功，为协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置；唯一串行写入者，只写 plan.md、tasks.md 与本节。无代码改动、无测试运行、无 Git 写、网络、安装或派工；未读真实 `~/.pi` 会话、agent / actor 日志、Temp 负载或试点数据。
- **基线**：`81c61761a8c45535b779d8686489ba9b74fd33c8`（分支 `workbench`，开始时干净）。spec 锚定正文 SHA256 实算仍为 `a504fed8…e823`。
- **改了什么（作者修订，未实施、未测试）**：
  - P3-AN-R3-1：T-12 修改范围改为由协调者编写清单、只列授权范围内的 `budget-*.jsonl` / `review-budget-*.jsonl`，清单与 out-dir 均放系统 Temp 下本功能临时工作目录；删去 `%LOCALAPPDATA%` 示例与“用户编写清单”。完成标准与验证命令不变。
  - P3-AN-R3-2：采用方向 (a)。Plan §3.4 第 4 层、§3.6 `sources[]`、§5 AC-004-3 与 T-19 统一为：凡 `net_new_determined: false` 的血缘情形（含 `lineage_usage_conflict` 与落入 `relation_shape_unsupported` 分量的血缘对）复制件数与净新增记录数为 unknown，不显示 0。T-19 明列 542 行与 565 行（只改 `lineage_conflict` 分支，`double_capture` 无血缘保持 0）的既有断言改正，新增链式重复变体，完成标准 2 与验证命令 2 相应扩展、保持一一对应。
  - P3-AN-R3-3：T-16 完成标准 1 加入 F2 已解析嵌套执行 `call_ref` 集合 = 父 toolResult 记录 `call_ref` 集合（2 / 2，即 matched 2）；验证命令不变。
  - 记账：plan.md 头部 r6 行、输入清单 r6 行与 §7 r6 表；tasks.md 头部 r6 一行。
- **未改**：其余规则与任务、退出码、六项度量矩阵、27 条 AC 映射；无新需求、新度量或新来源格式。
- **下一步**：对包含本修订的新固定提交重跑 Analyze（R4）→ 独立 A Checklist R4。本节不是关闭声明；三项 P3 是否关闭由 Analyze R4 判定；27 条 AC 仍全部未勾选，无 Gate 2。

## Analyze R4（2026-10-31）

- Analyze R4 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `4acd8ddc2a3fbbb5a5c634efcdd46254fb6cf1da`；正式任务正常结束（298.04 秒，未超时）。报告见 [analyze-r4.md](analyze-r4.md)；R1～R3 原文不动。
- **结论：未通过**（0 P1 / 0 P2 / 2 P3）。Analyze R3 三项 P3 均已由 r6 解决；Review R1 四项发现设计承接完整；r6 无回归。新 P3：(1) P3-AN-R4-1：T-16 依赖写“Analyze R3 通过”，R3 未通过且不会再改，此条件不可满足；(2) P3-AN-R4-2：试点自观测本功能时，写入试点记录（review.md）与前后哈希核对的先后顺序不明。
- **下一步**：计划类模型修正 tasks.md 两处措辞 → Analyze R5 → 独立 A Checklist R4。

## Tasks 补正 r7（Analyze R4）（2026-10-31）

- **角色 / 路由**：Plan / Tasks 修订作者 = `claude-opus-5-5 via claude-bridge`（协调者派工前在 claude-bridge 做最小真实调用成功，为协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置；唯一串行写入者，只写 tasks.md、plan.md（头部 r7 行、§5 AC-008-3 行一句、§7 r7）与本节。无代码、测试、Git 写、网络、安装或派工；未读真实会话、日志、Temp 负载或试点数据。
- **基线**：`d4781fc61f6f7cd2d506ed100774d134d2c24e54`（分支 `workbench`，开始时干净）。
- **改了什么（只改措辞，未实施）**：P3-AN-R4-1：T-16 依赖改为“对固定候选提交的最新一轮 Analyze（R5 或其后）通过、有效 checklist（R4 或其后）全部勾选”；其他任务的依赖都不以 Analyze R3 为闸门。P3-AN-R4-2：T-12 把被观测 feature 写明为 `dev-harness-budget`，并写明顺序：“前”hash-object / status → 报告命令 → “后”核对（须一致）→ 再写入脱敏记录（记录不属于被比较的状态）；完成标准含义不变，与验证命令仍一一对应；plan §5 AC-008-3 行同步一句。tasks.md 头部加 r7 一行。
- **下一步**：对新固定提交做 Analyze R5 → 独立 A Checklist R4。两项 P3 是否关闭由 Analyze R5 判定；27 条 AC 仍全部未勾选，无 Gate 2。

## Analyze R5（2026-10-31）

- Analyze R5 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `e467c89c953dc29aabe9f93392a642ff6320a2ef`；正式任务正常结束（218.55 秒，未超时）。报告见 [analyze-r5.md](analyze-r5.md)；R1～R4 原文不动。
- **结论：PASS（0 P1 / 0 P2 / 0 P3）**。Analyze R4 两项与 R3 三项 P3 均已解决；Review R1 四项发现的设计承接完整；r7 只改措辞，无回归。PASS 不是任务执行、Checklist 批准或 Implement 授权；r5～r7 改动的规则与 C-05 / C-09 待独立 A Checklist R4 判定。
- **下一步**：独立 A Checklist R4（`claude-fable-5-1 via claude-bridge`，Temp 分离工作树只读审查固定提交）。

## Checklist R4（2026-10-31）

- 审核员 A = `claude-fable-5-1 via claude-bridge`（派工前最小真实调用成功），新开会话，在 Temp 分离工作树只读审查固定提交 `ecd0bd6c93e17a5cbe5eb26aa0aac5fdb8fb8a7f`；正式任务正常结束（455.68 秒，未超时）。A 先将 R3 逐字节归档为 [checklist-r3.md](checklist-r3.md)（SHA256 `222a97e2…d34a`），再写当前有效 [checklist.md](checklist.md) R4（SHA256 `879141f4d60e515bcde7b75aaa4773aab30e6415dd54b88b3a6f0d5d16ff9d5c`）。协调者逐字节复制两件产物，未编辑清单内容或标记。
- **结论：Checklist R4 通过，有效清单 23/23**（P1 0 / P2 0 / P3 1）。Review R1 的 P2-CR-1 与 P3-CR-1～3 在 Plan r7 + T-16～T-20 设计层已解决（嵌套事件规则经 pi 1.4.0 公开源码复核）；Analyze R3 / R4 的 5 项 P3 经 A 复核同意已解决；R3 的 P3-R3-1 CLOSED；T-12 状态与依赖记录一致。新 P3-R4-1：plan / tasks 头部输入清单未补 r6 / r7 行（过程记录缺口，不阻塞，未修、未风险接受）。
- 含义：满足 T-16～T-20 的实施前置；不是实施、Review R2 或 Gate 2；27 条 AC 仍未勾选。**下一步**：Implement T-16～T-20（`openai/gpt-6-astra`，先探活）→ T-12 试点 → Converge → 独立 A Review R2。

### 第 8 批：T-16～T-20（Review R1 修复）

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `341ecd1`；正式任务正常结束（605.96 秒，未超时）。前置：有效 Checklist R4 23/23、Analyze R5 PASS。
- 修改（按 Plan r7）：json-events 白名单增读 `parentToolCallId`（只哈希、不输出），带父 id 的执行记为 `NestedExecutionRecord`、不进 direct，与父 toolResult `nestedCalls` 按身份去重（`nested_executed` / `nested_deduplicated` 视图，父未解析记 `nested_parent_unresolved`）；未确认分区下 tokens / tool_calls 覆盖行与分组节分母 / 缺失为未知并另列 `unconfirmed_sources`，空的已确认集合用 `no_confirmed_records`；血缘父非 loaded 时记 `lineage_parent_unavailable`、复制件与净新增数为未知；分组守恒改为计算，失败记 `group_conservation_failed`，删去生产 `assert`。夹具 F2 补真实嵌套执行事件并去重复记录，新增 F14。
- 修正的既有断言（实施者列明）：`parent_not_selected` 的复制件 0 → null（另加净新增 null 断言）；`lineage_conflict` 的复制件 0 → null、净新增 2 → null（血缘不可确定不填 0）；F2 原计数期望不变。
- 实施者报告：各任务验证命令全过；全量 806 passed / 1 failed / 5 skipped，唯一失败为既有 netstat 基线，无新增失败。协调者复跑：模块 353 passed，T-16～T-20 各验证命令通过；无产品包导入；生产代码无 `assert`；`git diff --check` 通过。T-12 未由实施者执行。

## T-12 真实试点记录（2026-10-31，脱敏）

- **授权与范围**：用户“全修，T-12同批完成，授权脱敏”。选入本功能各阶段子会话的 `pi --mode json` 捕获（`budget-*.jsonl` / `review-budget-*.jsonl`）共 **35** 段，即运行时该范围内的全部文件；不含协调者会话与 `~/.pi` 下的任何会话。清单由协调者编写，清单与报告只放系统 Temp 下本功能临时目录中的 pilot 子目录，不入库；本记录不含路径、会话 ID、提示词或报告原文。
- **执行**：协调者在修复实施入库后（基线 `a868d25`）以最终代码运行 `python tools/dev_harness_budget.py report --manifest <清单> --out-dir <目录>`；报告本身不发起模型或网络调用，未为测量重跑任何任务。timing 标注由协调者按调度器记录给出（`origin=external`，basis = 子会话启动时调度器写 pid 文件的时刻 + 调度器单调计时的时长；精度约 1 秒），结局取自调度器摘要（完成 / 失败 / 超时），未从会话内容或文件时间推算。
- **AC-008-3 顺序与核对**：报告前对 `specs/dev-harness-budget/` 的 spec / checklist / review 做 `git hash-object` 并取 `git status --porcelain=v1 --untracked-files=all`，报告后再取一次，**两次一致**（状态摘要 SHA256 `c4a2213ccf3c38fa60587d7c25b050cf9b99286c5038157e8219ade0f6cdc576`）；本记录与 T-12 状态行均在“后”核对之后写入。被观测 feature 即本功能，其冻结 AC / checklist / 路由 / Gate 未因试点改变；本记录不构成其验收；试点不以 desktop-shell / workbench-interaction 完成为前提。
- **结果（脱敏计数）**：
  - 退出码 **3**；状态行 `sources=gaps loaded=33 partial=2 empty=0 unavailable=0; metrics_complete=1/6; overall_observation=incomplete; not an acceptance verdict`；stderr 为空。2 段 partial 原因均为 `stream_not_settled`（暂停前两次超时被终止的 Checklist / Plan 子会话）。
  - 度量：tokens partial、main_attempts partial、tool_calls partial、retries partial、rework unavailable（未标注返工）、timing **complete**。
  - token：用量归属记录 877 条（四维全知 643、未知 234）；四维全知记录的已知小计 **84,220,612**；各维已知小计 input 1,333,795 / output 1,047,095 / cacheRead 99,799,324 / cacheWrite 4,427,029；完整总计 unknown（`default_zero`、`nonfinal_usage`、`record_usage_unknown`、`stream_not_settled`）；去重已确认（无跨来源重叠）。主 assistant 尝试内的来源上报输入峰值 341,336（下界）。
  - 按阶段的已知小计：Plan 27,024,528；Converge 22,777,365；Analyze 18,510,756；Checklist 6,386,057；Review 4,682,235；Tasks 3,974,192；Clarify 509,483；Spec 355,996；**Implement 未知**（见下）。
  - 尝试 / 工具 / 重试：观测到的主 assistant 尝试 877（completed 874、failed 1、inflight 2），运行内总数 unknown；direct 工具调用 1,169（全部 finished），嵌套执行 0；已确认 pi 自动重试 0（下界），总数 unknown；无其他模型操作记录。
  - 时间：会话耗时合计 **16,112 秒**（约 4.5 小时）；批次观测墙钟窗口 **72,171 秒**（约 20 小时，含会话间与过夜的空闲，二者分标签，不相互冒充）。
  - 未观测路径：物理 HTTP / SDK / provider 层请求与重试、失败的缓存预热请求、操作记录的请求数、无 usage 的工具内模型工作、branch summary。
- **试点发现（非代码缺陷）**：OpenAI 通道（Implement 的 `gpt-6-astra`，以及作废的 sol Analyze）在用量中把 cacheWrite 恒报 0；按已接受的保守口径，未经带出处的 `confirmed_zero` 标注即记 unknown，故 Implement 阶段 208 条记录与该 Analyze 的 11 条不计入已知小计。若要计入，须由用户提供带出处的 `confirmed_zero` 规则（provider / model / 字段 / basis），工具不自行假定。
- **结论**：仅证明工具对真实开发批次可用；**不是统计上充分的基线，也不证明任何节省**；不是本功能或任何 feature 的验收。AC-008-1 / AC-008-3 的判定留给独立 A Review R2 与 Gate 2。

## Converge R5（2026-10-31）

- Converge R5 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `e037e898f3eb4da51951d8d733342d5ab7a3f794`；正式任务正常结束（671.62 秒，未超时）。报告见 [converge-r5.md](converge-r5.md)；R1～R4 原文不动。
- **结论：已收敛（T-01～T-11、T-13 及以后的离线实现，并含 T-12 试点记录）**，未追加任务。Review R1 的 P2-CR-1 与 P3-CR-1～3 已按 plan r7 在代码中修复，并有字面量测试守卫；T-13～T-15 无回归。T-01～T-11、T-13～T-20 的 59 条验证命令全过；模块 353 passed；全量 806 / 1 / 5（唯一失败为既有 netstat 基线，806 = 772 + 本批新增 34）。T-12 试点记录满足两条完成标准的文字要求且不含私有信息；AC-008-1 / AC-008-3 是否接受留给 Review R2 与 Gate 2。AC 计数：已收敛 25、待 Review 判定 2、差距 0。
- **并行写入提示**：Converge R5 运行期间，工作区出现非本 feature 的改动——另一会话（作者自述 `openai/gpt-6.1-sol`，用户要求的新 feature `workflow-runtime`）新建了未跟踪的 `specs/workflow-runtime/spec.md`，并在 `specs/README.md` 追加一行。本 feature 的协调者、Converge 均未触碰；本 feature 的提交只列本 feature 路径，不纳入其改动。
- **下一步**：独立 A Review R2（`claude-fable-5-1 via claude-bridge`，Temp 分离工作树只读审查固定提交）。

## Review R2（2026-10-31）

- 审核员 A = `claude-fable-5-1 via claude-bridge`（派工前最小真实调用成功），新开会话，在 Temp 分离工作树只读审查固定提交 `5aebb038ffa13f74f8a1b063c9130ebea8a6b677` 与真实 diff `f5dbf63..HEAD`；正式任务正常结束（560.12 秒，未超时）。A 只新建 [code-review-r2.md](code-review-r2.md)；协调者逐字节复制（SHA256 `626703a8057e90a6d5fcec8cd980feaaf2677b3be24fa558ac0dae8c1930015f`），未改其内容。
- **结论：通过**（P1 0 / P2 0 / P3 2）。Review R1 的 P2-CR-1、P3-CR-1、P3-CR-2、P3-CR-3 **全部 CLOSED**（R1 复现形状重跑确认）；修复未引入回归（T-13～T-15、隐私哨兵、退出码、去重归属、完整总计三条件均保持）；A 实跑模块测试 353 passed。
  - **P3-CR2-1**：已确认集合中没有 json-events（如唯一的 json-events 来源落入未确认分区）时，`nested_executed` 误报原因 `nested_events_not_persisted`（数值为 unknown，方向保守）。
  - **P3-CR2-2**：tokens / 分组的 `unconfirmed_sources` 把已被生效 `duplicate_of` 取代的来源也计入（只多报来源计数，不影响小计、总计与分母结论）。
- **T-12 / AC-008-1 / AC-008-3**：依本文件脱敏记录，T-12 两条完成标准的文字要求均满足，记录无私有信息。**需用户在 Gate 2 明示确认**：授权时范围内 27 段，实跑 35 段（另 8 段为修复循环新生成的同类捕获）；“新生成的同类捕获同属授权范围”是协调者写下的解释，不是用户原话。
- 仍开放的 P3：P3-CR2-1、P3-CR2-2（本轮）与 P3-R4-1（plan / tasks 头部输入清单缺 r6 / r7 行）；均未修、未风险接受。本结论不是 Gate 2，不接受任何 AC，不授权 Handoff / PR / merge。

### 用户对 Review R2 的处置（2026-10-31）

- 用户原话：**“给我看一下这25条AC，然后3项P3现在就修，试点范围扩大35”**。
- 处置：P3-CR2-1、P3-CR2-2、P3-R4-1 **现在修复**（不作风险接受）；T-12 试点范围由用户确认为已运行的 **35 段**（授权时 27 段 + 修复循环新生成的 8 段同类捕获），协调者此前的范围解释由此得到用户确认。
- 这不是 Gate 2 的最终确认，也不授权 Handoff（PR / merge）；修复后仍须 Converge 与独立 A Review，再请用户确认 Gate 2 与交付。
- 修复路径：两项代码 P3 只让实现符合现有 Plan（A 写明“不改 Plan”），P3-R4-1 只补 plan / tasks 头部输入清单的 r6 / r7 行；不改 Plan 规则，按 Checklist R4 写明的条件不另开 Checklist 轮次（同 T-13～T-15 由 Converge 追加任务后直接实施的先例）。顺序：任务作者追加 T-21 并补输入清单 → Implement → 协调者用同一份 35 段清单重跑试点核对数字不变 → Converge R6 → 独立 A Review R3 → Gate 2。

## Tasks r8（Review R2 P3）（2026-10-31）

- **角色 / 路由**：Tasks 作者 = `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前最小真实调用成功，为协调者陈述）。本会话未换模型，未改 provider / 路由 / key / 全局配置；只写 tasks.md、plan.md（头部输入清单与一行记账、§5 三行登记测试名）与本节。无代码、测试、Git 写、网络、安装或派工；未读真实会话、日志、Temp 负载或试点数据；未触碰另一会话的 `specs/README.md` 改动与 `specs/workflow-runtime/`。
- **基线**：`39fa979f8932603853df2fdf7d8580624a639efb`（分支 `workbench`）。spec 锚定正文 SHA256 实算仍为 `a504fed8…e823`。
- **改了什么（未实施、未测试）**：
  - P3-CR2-1 / P3-CR2-2 → 新增 T-21（未开始，依赖 T-20）：批次 `nested_executed` 以全部选定来源判定是否有 json-events，选定有、已确认无时原因为 `overlap_unconfirmed`；被生效 `duplicate_of` 取代或被嵌套覆盖的来源不计入 tokens / 分组 `unconfirmed_sources`、不登记未确认嵌套记录。新测试 `test_nested_executed_reason_uses_selection`、`test_unconfirmed_sources_exclude_replaced_and_covered`，登记于 plan §5 与 tasks AC 覆盖表 AC-004-3 / AC-005-1 / AC-007-1 行（仍 27 行）。
  - P3-R4-1：plan.md 输入清单 r6 行移入代码块并补 r7 行；tasks.md 输入清单补 r6 / r7 行（blob 取自 Git 历史，章节取自本文件 r6 / r7 两节）。
- **未改**：Plan 规则正文、T-01～T-20、退出码、六项度量矩阵、27 条 AC 映射。
- **下一步**：Implement T-21 → 协调者用同一份 35 段清单重跑试点、核对数字不变 → Converge R6 → 独立 A Review R3 → Gate 2。本节不是关闭声明；三项 P3 是否关闭由 Converge R6 与 Review R3 判定；27 条 AC 仍全部未勾选。

### 第 9 批：T-21（Review R2 P3）

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `01d4c8d`；正式任务正常结束（367.62 秒，未超时）。
- 修改：批次 `nested_executed` 以全部选定来源判定是否存在 json-events，已确认集合无 json-events 而选定中有时不再报 `nested_events_not_persisted`；tokens / 分组的 `unconfirmed_sources` 不计被生效 `duplicate_of` 取代或被嵌套覆盖的来源。新增 `test_nested_executed_reason_uses_selection`、`test_unconfirmed_sources_exclude_replaced_and_covered`；既有断言无改动（实施者报告 none）。
- 实施者报告 T-21 五条验证命令全过；全量 809 passed / 1 failed / 5 skipped，唯一失败为既有 netstat 基线，无新增失败。协调者复跑：模块 356 passed，T-21 命令 1～3 → 1 / 2 / 27 passed；无产品包导入；`git diff --check` 通过。

### T-12 试点重跑（T-21 之后，2026-10-31）

- 用户已确认试点范围为 35 段。协调者以首次试点的同一份清单（35 段，timing 标注不变，只把 `baseline_commit` 换为 `de3180a`）在 T-21 后的代码上重跑，产物仍只写系统 Temp 下本功能临时目录，不入库。
- 结果：退出码 3，状态行与首次相同（`sources=gaps loaded=33 partial=2 empty=0 unavailable=0; metrics_complete=1/6; overall_observation=incomplete`），stderr 为空；采集状态、六项度量状态、token 各维与已知小计、记录数、峰值、尝试状态、direct 工具调用、已确认重试、时间窗口与会话合计、按阶段小计 **与首次逐项一致**。报告前后对本功能 spec / checklist / review 的 `git hash-object` 与 `git status` 一致；本记录写于“后”核对之后。
- 结论不变：仅证明可用，非统计基线，不证明节省，不构成任何 feature 的验收。

## Converge R6（2026-10-31）

- Converge R6 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `afb95c96eed36b46990098ffc73bf9b717e7759f`；正式任务正常结束（618.6 秒，未超时）。报告见 [converge-r6.md](converge-r6.md)；R1～R5 原文不动。（协调者派工稿的输出段仍写旧文件名，Converge 按边界条款写入 `converge-r6.md`；属协调者模板疏漏，已记。）
- **结论：未收敛**，差距 1 处：T-21 只修了 tokens / 分组的 `unconfirmed_sources`，**tool_calls** 的未确认来源数仍计入被生效 `duplicate_of` 取代的来源（合成复现 tokens 2、tool_calls 3），违反 Plan §4.3；只影响披露计数，不影响小计、总计、分母结论与退出码。追加 **T-22**。其余：62 条验证命令全过；模块 356 passed；全量 809 / 1 / 5（唯一失败为既有基线）；T-21、P3-R4-1 与试点（含重跑）记录合格。
- 工作区仍有另一会话（workflow-runtime）的未提交改动：`docs/architecture.md`、`docs/interaction.md`、`docs/plan.md`、`specs/README.md` 与未跟踪的 ADR / spec；本 feature 未触碰，也不纳入本 feature 的提交。
- **下一步**：Implement T-22 → Converge R7 → 独立 A Review R3 → Gate 2。

### 第 10 批：T-22（Converge R6 差距）

- 实施者 `openai/gpt-6-astra via openai`，派工前最小真实调用成功；基线 `915a145`；正式任务正常结束（304.84 秒，未超时）。
- 修改：`build_report` 计算 tool_calls 的未确认来源数时排除被生效 `duplicate_of` 取代或被嵌套覆盖的来源（与 T-21 对 tokens 的条件一致）；`test_unconfirmed_sources_exclude_replaced_and_covered` 增加 `replaced_lineage_partial` 参数（修前该参数失败、修后通过）；既有断言无改动。
- 实施者报告全量 810 passed / 1 failed / 5 skipped，唯一失败为既有 netstat 基线，无新增失败。协调者复跑：模块 357 passed，T-22 命令 1 → 3 passed；无产品包导入；`git diff --check` 通过。

## Converge R7（2026-10-31）

- Converge R7 = `claude-opus-5-5 via claude-bridge`（派工前最小真实调用成功），新开会话；固定提交 `2d84e7b7508b3d09767fc2f4da0ab2fd4c4c28b6`；正式任务正常结束（557.63 秒，未超时）。报告见 [converge-r7.md](converge-r7.md)；R1～R6 原文不动。
- **结论：已收敛（T-01～T-11、T-13～T-22 的离线实现，并含 T-12 试点及重跑记录）**，未追加任务。T-22 关闭 R6 差距，同类计数扫描无残留；Review R2 的 P3-CR2-1 / P3-CR2-2 已由 T-21 修复、P3-R4-1 已记录；Review R1 的修复仍在，无回归。63 条验证命令全过；模块 357 passed；全量 810 / 1 / 5（唯一失败为既有基线）。AC 计数：已收敛 25、待 Review R3 / Gate 2 判定 2、差距 0。
- **下一步**：独立 A Review R3（`claude-fable-5-1 via claude-bridge`，Temp 分离工作树只读审查固定提交）。

## Review R3（2026-10-31）

- 审核员 A = `claude-fable-5-1 via claude-bridge`（派工前最小真实调用成功），新开会话，在 Temp 分离工作树只读审查固定提交 `120f473f1f690c116dd7af1cfca39ad2540d11cf` 与真实 diff `5aebb03..HEAD`；正式任务正常结束（438.25 秒，未超时）。A 只新建 [code-review-r3.md](code-review-r3.md)；协调者逐字节复制（SHA256 `d0d4027570252091d29e6f36cc6621ec4d181e07b56f61953502403c699da4be`），未改其内容。
- **结论：通过**（P1 0 / P2 0 / P3 2）。Review R2 的 P3-CR2-1、P3-CR2-2 CLOSED（T-21 修复、T-22 补齐，复现重跑确认），P3-R4-1 CLOSED（已记录）；Review R1 四项仍关闭；A 实跑模块测试 357 passed，相关子集 54 passed；未重跑全量（Converge R7 实测 810 / 1 / 5，本轮未改代码）。
  - **P3-CR3-1**：json-events 来源不可用 / 部分时，`nested_executed` 与 `nested_deduplicated` 仍给出“0 条、无原因”，未按来源可用性门控。
  - **P3-CR3-2**：json-events 来源被生效 `duplicate_of` 取代时，批次 `nested_executed` 原因标为 `overlap_unconfirmed`，而该重叠已由人工链接确认。
  - 两项都只是嵌套视图披露层的计数 / 原因失真，不影响 direct 计数、已知小计、完整总计、分母结论、覆盖率或退出码。
- **T-12 / AC-008-1 / AC-008-3**：依首次与重跑的脱敏记录及用户已确认的 35 段范围，T-12 两条完成标准的文字要求均满足，无私有信息。本结论不是 Gate 2，不接受任何 AC，不授权 Handoff / PR / merge。

## Gate 2（2026-10-31）

- 用户原话：**“接受 P3，确认 Gate 2，同意交付”**。
- 确认内容：(1) Review R3 结论（通过，0 P1 / 0 P2 / 2 P3）；(2) **风险接受**：P3-CR3-1、P3-CR3-2（嵌套视图披露层计数 / 原因失真，不影响 direct 计数、小计、总计、分母结论与退出码）接受为后续任务，未修复；(3) 27 条 AC 由用户在 Gate 2 认可：25 条由合成样例与测试覆盖（Review R3 判代码层已对齐），AC-008-1 / AC-008-3 依据 T-12 试点记录（含 T-21 后重跑；35 段范围已由用户确认）；(4) 同意交付：从 `main` 建交付分支，只带本 feature 文件，测试后推送、开 PR、合并。
- AC 记录方式：按本库先例（settings / data-layer / frontend-workbench 的 spec 均不在 Gate 2 后勾选 AC），且本 spec 自 Gate 1 冻结、正文哈希覆盖复选框，故**不改 spec.md**；27 条 AC 的认可以本节为准。
- Handoff 阶段（计划类）随后由首选模型撰写交付记录；交付分支、PR 与合并由协调者执行。

## Handoff 交付记录（2026-10-31）

- **作者 / 路由**：`claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前最小真实调用成功，为协调者陈述）。未换模型，未改 provider / 路由 / key / 全局配置。只写本文件（追加本节 + 头部“当前状态”行）；未改 spec / plan / tasks / checklist* / analyze* / converge* / code-review* / HANDOFF / 索引 / 代码；无 Git 写、联网、安装或派工；未读真实会话、日志、Temp 负载或试点数据。本次未重跑测试，下列数字均引自已有记录。
- **基线**：`477cd93a97f01563893cfcf692698dc6206dc713`（分支 `workbench`）。本 feature 文件与 HEAD 一致；工作区另有 workflow-runtime 会话的未提交改动（`specs/README.md`、`docs/architecture.md`、`docs/interaction.md`、`docs/plan.md`，未跟踪的 ADR 与 `specs/workflow-runtime/`），未读、未动。

输入清单：

```
AGENTS.md @ 477cd93（blob ee8e4ab）全文
docs/development/workflow.md @ 477cd93（blob 4aca344）全文（重点第 9～11 步、Gate 2）
templates/review.md @ 477cd93（blob b927e01）全文
specs/dev-harness-budget/review.md @ 477cd93（修改前）全文
specs/dev-harness-budget/code-review-r3.md @ 477cd93（blob 4be2d9b）全文
specs/dev-harness-budget/converge-r7.md @ 477cd93（blob 70017ff）全文
specs/dev-harness-budget/tasks.md @ 477cd93（blob 61a4ec6）状态行与 AC 覆盖表
specs/dev-harness-budget/checklist.md @ 477cd93（blob 3e7a7d6，R4）头部
```

### 完成项

- v1 交付一个离线、运行后的开发批次用量观测工具（只观测，不约束）：`backend/tools/dev_harness_budget.py`（标准库单文件，不进 wheel / 打包，不导入产品包）、`backend/tests/test_dev_harness_budget.py`、`backend/tests/dev_harness_budget_fixtures.py`（合成样例）、`backend/README.md` 工具表一行。
- 任务：T-01～T-11、T-13～T-22 已实施，各自验证命令通过（tasks.md 状态行；Converge R7 逐条复跑 63 条 `-k` 命令全过）。T-12 真实试点在用户确认的 35 段范围内执行，T-21 后重跑，各项指标与首次逐项一致。
- 各轮结果（详见上文各节与原件）：
  - Checklist：R1 未通过（16/23，4 P2）；R2 通过 21/23；R3 通过 23/23；R4 通过 23/23（当前有效）。
  - Analyze：R1 未通过（1 P2）；R2 PASS；R3 未通过（3 P3）；R4 未通过（2 P3）；R5 PASS。
  - Converge：R1～R3 未收敛（分别追加 T-13 / T-14 / T-15）；R4、R5 已收敛；R6 未收敛（追加 T-22）；R7 已收敛（当前有效）。
  - Review：R1 未通过（1 P2 / 3 P3，全修）；R2 通过（2 P3，用户要求修复，连同 P3-R4-1）；R3 通过（0 P1 / 0 P2 / 2 P3，当前有效）。

### 未完成项

- **P3-CR3-1**（json-events 来源不可用 / 部分时嵌套视图仍报“0 条、无原因”）与 **P3-CR3-2**（json-events 来源被生效 `duplicate_of` 取代时原因误标 `overlap_unconfirmed`）：未修复，Gate 2 接受为后续任务。修复方向见 [code-review-r3.md](code-review-r3.md)。
- 27 条 AC 已由用户在 Gate 2 认可，认可记录以上文“Gate 2（2026-10-31）”节为准；按本库先例，spec.md 复选框保持未勾选，冻结正文不改。
- 仍未处理的非阻塞观察（Review R3 / Converge R7 已记，不是发现）：未解析嵌套执行的原因在 start / end 各追加一次；峰值行“尝试总数”措辞（改须先过 Plan）；T-12 状态摘要 SHA256 的构造方式未记录（Git 历史已独立佐证）。T-22 后未再重跑试点，Review R3 依代码判定不影响记录数字，Gate 2 未要求重跑。
- 本记录未更新 `specs/README.md` 状态行与 `HANDOFF.md`（不在本次写限）；前者当前含另一会话的未提交改动，更新时须只动本 feature 一行。

### 风险

- **原生来源无法证明总数**：重试总数恒为 unknown（只报已确认的下界），物理 HTTP / provider 请求不可观测，原生输入下 overall 观测恒为 incomplete；退出 0 只表示产物写出且采集无缺口。试点为 6 项度量中 1 项（timing）complete。
- **OpenAI 通道 cacheWrite 恒报 0**：未经带出处的 `confirmed_zero` 规则即记 unknown，试点中 Implement 阶段 208 条与作废 Analyze 11 条记录因此不计入已知小计。工具不自行假定。
- **pi 版本漂移**：事件形状（`parentToolCallId`、`nestedCalls`、`entry_appended` 白名单、收尾判据、fork 复制方式）只对 pi 1.4.0 公开安装包核实；未知用量只检测顶层 `usage` 键。升级 pi 后须重新核实，否则可能漏计或误归属。
- **既有无关失败**：后端全量唯一失败 `tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only`（netstat 监听断言），是 HANDOFF 记录的既有基线，不属本 feature，未修。
- **共用工作区**：workflow-runtime 会话在同一工作区有未提交改动；交付分支须只带本 feature 文件，不得纳入其改动；合并时若在 `specs/README.md` 等共享文件上冲突，按 workflow 第 11 步处理。

### 下一步任务

- 后续待办：P3-CR3-1、P3-CR3-2（只改 `_tool_counts` 与 `build_report` 传参及对应断言，Review R3 判定不需回 Plan 或 Clarify）；仍须按工作流登记任务并实施、收敛与评审。
- 可选：实际使用前为 OpenAI 通道的 cacheWrite 给出用户来源的 `confirmed_zero` 规则指引（provider / model / 字段 / basis），由用户确认，工具不内置。
- v1 不做预算约束或拦截；如需约束版本，须新写 spec 并重过 Gate 1。

### 验收证据

- 测试命令输出摘要（引自 Converge R7，固定提交 `2d84e7b`；Review R3 在 `120f473` 未改代码的前提下复跑模块一致）：
  - `cd backend && python -m pytest tests/test_dev_harness_budget.py -q` → 357 passed。
  - `cd backend && python -m pytest tests/ -q` → 810 passed / 1 failed / 5 skipped，唯一失败为上述既有 netstat 基线。
  - T-12 试点（首次 `a868d25`、T-21 后重跑 `de3180a`）：退出码 3，状态行 `sources=gaps loaded=33 partial=2 empty=0 unavailable=0; metrics_complete=1/6; overall_observation=incomplete; not an acceptance verdict`，stderr 为空；前后 `git hash-object` / `git status` 核对一致。仅证明可用，非统计基线，不证明节省。
- Converge 报告结论：[Converge R7](converge-r7.md)“已收敛（T-01～T-11、T-13～T-22 的离线实现，并含 T-12 试点及重跑记录）”，未追加任务；AC 已收敛 25、待 Review / Gate 2 判定 2、差距 0。
- Gate 2 确认记录：用户原话“接受 P3，确认 Gate 2，同意交付”（2026-10-31），详见上文“Gate 2（2026-10-31）”节。
- 交付：到 `main` 的交付 PR 及其合并由协调者在本记录之后执行（提交前按约定跑测试）；PR URL 与合并提交随后补记。截至本记录，PR 未创建、未合并。
