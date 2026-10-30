# docs/ — 文档权威归属与任务路由

> 本页只导航、不复制规则（D-026，[ADR](decisions/20261030-agent-navigation.md)）。它**不是**每个任务前必须先读的中间索引：根 [`AGENTS.md`](../AGENTS.md) §1 的触发表已直接指向权威文件；本页供需要确认“某条规则归谁维护”或查找更细路由时使用。
> 规划 ≠ 本 checkout 的内容：[plan.md](plan.md) §5 / §8 与 [architecture.md](architecture.md) 描述的是规划中的产品结构，其中的模块、目录或 feature 不因被写进文档就已实现。本 checkout 实际有哪些文件以 Git 为准；feature 状态以 [specs/README.md](../specs/README.md) 为准。

## 1. 权威归属（每份规范只有一个权威位置）

| 主题 | 唯一权威 | 说明 |
|---|---|---|
| 每会话必读入口、硬约束、工程准则 | [`../AGENTS.md`](../AGENTS.md) | §5 七条工程准则只在此维护 |
| 产品定位、范围、决策汇总、路线图 / 分期、扩展性、风险 | [plan.md](plan.md) | §3 决策表、§8 路线图、§10 风险 |
| 产品架构：分层、数据层、知识层、agent 集成、安全隔离 | [architecture.md](architecture.md) | 数据层字段契约以 [`specs/data-layer/plan.md`](../specs/data-layer/plan.md) 为准（见其 §2.1） |
| 交互与协作模型：双循环、作业、介入、定稿、回流、学习、校准、世界模型、常驻、多主体 | [interaction.md](interaction.md) | architecture / designUI 引用不复述 |
| 视觉与界面：配色、图表、chart-spec、交付物块样式、组件 | [designUI.md](designUI.md) | 移植原文在 `../design/` |
| 决策的“为什么” | [decisions/](decisions/README.md) | ADR 先登记再实现；变更 = 新 ADR，不改历史文件 |
| **开发**工作流（spec-driven 阶段、Gate、Checklist、Handoff） | [development/workflow.md](development/workflow.md) | 旧“AGENTS §2 第 N 步”= 其第 N 步 |
| **开发**工作流模型路由（阶段→模型、通道、回退、审核员独立性、并行隔离） | [development/model-routing.md](development/model-routing.md) | 旧“AGENTS §6 规则 N / §6.N”= 其规则 N |
| **产品** agent 工作流候选（未决想法） | [agent/candidates.md](agent/candidates.md) | 候选不是决策、不是实施入口；与上面两份开发文档无关 |
| 仓库维护记录与历史存档 | [maintenance/](maintenance/20261030-agent-navigation.md) | 历史证据，不是现行规则来源；存档为逐字原文。本次 main 交付见 [执行与适配记录](maintenance/20261030-agent-navigation-main.md) |
| feature 需求 / 设计 / 任务 / 审核 | `../specs/<feature>/` | 实施的唯一入口；状态表见 [specs/README.md](../specs/README.md) |
| 当前工作区与恢复方法 | [`../HANDOFF.md`](../HANDOFF.md) | 只记当前工作位置；main 原 HANDOFF 全文存于 [维护存档](maintenance/20261030-agent-navigation-main-history.md) |

**开发 vs 产品**：`development/` 规定“我们怎样开发本仓库”（含开发会话用哪个模型）；`agent/candidates.md` 与 `architecture.md` §5.5（D-019）讨论“产品运行时的 agent 怎样工作”。两者互不替代（model-routing 规则 8）。

## 2. 直接任务路由

| 我要… | 直接读 | 另外注意 |
|---|---|---|
| 修一个局部 bug | 所在目录 README（如 [backend](../backend/README.md) / [frontend](../frontend/README.md)）→ 相关 `specs/<feature>/`（冻结 spec / plan / tasks、有效 checklist） | 属于某 feature 的代码改动仍走 [workflow.md](development/workflow.md)；目录没有 README 时读对应 spec 与 [architecture.md](architecture.md) 相关节；涉及数据 / 交互语义则按下行补读 |
| 改界面 / 图表 / 样式 | [designUI.md](designUI.md) + `../design/` 资产索引 + [frontend/README.md](../frontend/README.md) | 交互语义变化先改 [interaction.md](interaction.md)（+ ADR） |
| 改数据语义（序列身份、asof、择优、单位、溯源） | [architecture.md](architecture.md) §3 + `specs/data-layer/`（spec / plan） | 涉及范围或决策 → [plan.md](plan.md) §3 + 新 ADR |
| 做 Checklist / Review（审核员 A） | [model-routing.md](development/model-routing.md) 全文 + [workflow.md](development/workflow.md) 第 5 / 10 步 + 该 feature 的 spec / plan / tasks / 真实 diff | 新开独立会话，读全部原文 |
| 恢复暂停的 feature | [HANDOFF.md](../HANDOFF.md) → [specs/README.md](../specs/README.md) → 该 feature 的冻结 spec / plan / tasks、有效 checklist 与审核记录 | 当前 HANDOFF 取代历史 HANDOFF 中的目录 / 分支指令。feature 文档不在本 checkout 时，查 specs 状态表与 architecture，或有意切到 `workbench` 分支核对；不要推断它已在本分支交付 |
| 产品范围 / 路线图 / 跨领域设计 | [plan.md](plan.md) + [decisions/](decisions/README.md) | 决策先写 ADR，再改 docs，再改实现 |
| 评估新想法 | [agent/candidates.md](agent/candidates.md) | 晋升须走 ADR → docs → spec → Gate 1 |

## 3. 现行 docs 与冻结 feature 范围

- `docs/` 描述**当前**产品设计；已过 Gate 1 的 `specs/<feature>/spec.md` 是该 feature 的**冻结**范围。
- 修改 docs 不会改写冻结 spec，也不授权任何实施。两者冲突时，经该 feature 的 Clarify → 重新 Gate 1 → 更新 plan / tasks 处理（[workflow.md 变更规则](development/workflow.md#change-rule)）；待处理事项登记在 [specs/README.md](../specs/README.md) 跨 feature 表或 feature 记录中。
- 设计批准（如 [plan.md](plan.md) §9 所列轮次）不是任何 feature 的 Gate 1 / Gate 2。

<a id="product-decisions"></a>

## 4. 产品决策原文导航

相关任务必须读取权威章节；本表只定位，不重述规则。D-001～D-006 的决策记录在 [plan.md §3](plan.md#3-决策记录含取舍)，没有独立 ADR 文件。

| 主题 | ADR | 权威原文 |
|---|---|---|
| 定位、范围、技术栈、外壳、存储 | D-001～D-002、D-006～D-008、D-010 | [plan.md](plan.md) §2–§3；[architecture.md](architecture.md) §1–§2 |
| pi RPC、MCP 与产品多 agent | D-003、D-019 | [architecture.md](architecture.md) §5，编排边界见 §5.4–§5.5 |
| 数据底座、来源与修订 | D-005、D-012～D-014 | [architecture.md](architecture.md) §3；字段契约见 `specs/data-layer/plan.md` §2.1 |
| 知识库、表格与数字检索 | D-009 | [architecture.md](architecture.md) §4 |
| 双循环、四阶段、定稿、验证与知识回流 | D-016～D-018 | [interaction.md](interaction.md) §2–§5，定稿见 §3.5，派生引用见 §5.4 |
| 网页剪藏、格物致知与蒸馏 | D-018 | [architecture.md](architecture.md) §4.5–§4.6；[interaction.md](interaction.md) §4、§6 |
| 校准与用户优先 | D-020 | [interaction.md](interaction.md) §9、§6.4 |
| 世界模型与人填槽位 | D-021 | [interaction.md](interaction.md) §10；[architecture.md](architecture.md) §4.8 |
| 常驻研究台、自主度、预算 | D-022 | [interaction.md](interaction.md) §11；[architecture.md](architecture.md) §5.6 |
| 多主体、作业树、辩论与红队 | D-023 | [interaction.md](interaction.md) §12 |
| 协议冷启动与历史立场 | D-024 | [interaction.md](interaction.md) §6.6 |
| ECharts、chart-spec、视觉、涨跌色 | D-004、D-011、D-015 | [designUI.md](designUI.md) §2、§4–§6 |
