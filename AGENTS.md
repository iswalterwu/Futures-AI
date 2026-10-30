# AGENTS.md — Futures-AI 工作手册

> 本文件是所有 agent 的**唯一常驻入口，每会话必读**；其余按 §1 触发读取。
> 产品设计权威在 `docs/`；实现冲突须回修。D-026 只调整导航与阅读策略，旧章节引用见 §2 / §6。

## 0. 这是什么

Futures-AI 是期货交易者的本地化 **Agent+人 研究工作台**，以作业交付和学习双循环共享带溯源的知识底座。技术栈为 Python + Vue 3 / TS / ECharts + Electron，AI 底座为 pi；v1 聚焦油品，底座品种无关。

## 1. 按任务读什么

- 本文件全文每个会话必读。下表“必读”在触发条件成立时强制；链接**不是**传递性必读——被链接文档里的链接，只有其内容适用于本任务时才须读。
- 拿不准属于哪个领域：先查看改动范围（文件、数据语义、交互、界面），扩大阅读；**不得用导航跳过实际适用的规则**。
- 文档权威归属与更多路由：[docs/README.md](docs/README.md)（按需查，不是每个任务前的中间必读）。

| 触发条件 | 必读 |
|---|---|
| 功能开发，进入 / 恢复工作流阶段 | [workflow.md](docs/development/workflow.md) 对应阶段；读取该阶段已有、适用的规格产物。Implement 必须核对冻结 spec / plan / tasks / 有效 checklist |
| 开会话、选 / 换模型、派工、审核、回退 | [model-routing.md](docs/development/model-routing.md) 全文 |
| 产品定位、范围、路线图 / 分期、跨领域设计、新 ADR | [plan.md](docs/plan.md) 相关节 + [decisions/](docs/decisions/README.md)；其他任务把 plan.md 作为相关上下文（D-026 变更 1） |
| 架构、数据层、知识层、agent 集成、存储、安全隔离 | [architecture.md](docs/architecture.md) 相关节 |
| 交互、作业、交付物、定稿、知识回流、学习、校准、世界模型、常驻、多主体 | [interaction.md](docs/interaction.md) 相关节 |
| 前端界面、图表、配色、交付物块样式 | [designUI.md](docs/designUI.md) + `design/` 资产索引 |
| 改某代码目录 | 该目录 README（[backend](backend/README.md) / [frontend](frontend/README.md)）；目录没有 README 或尚未在本 checkout 落地时，读对应 `specs/<feature>/` 与 [architecture.md](docs/architecture.md) 相关节。plan.md §5 的目录规划不表示该模块已实现 |
| 恢复工作区或在研 feature | [HANDOFF.md](HANDOFF.md) + [specs/README.md](specs/README.md) |
| 评估新的产品 agent 想法 | [candidates.md](docs/agent/candidates.md)（候选不是决策、不是实施入口） |

## 2. 工作流：spec-driven（所有功能开发必须遵守）

```
Constitution → Spec → Clarify → 【Gate 1】 → Plan → Checklist → Tasks → Analyze → Implement → Converge → Review → 【Gate 2】 → Handoff
```

细则、产物与完成条件见 [workflow.md](docs/development/workflow.md)；旧“§2 第 N 步”= 其第 N 步，历史“§2.1”= model-routing.md。硬约束：

- **阶段输入核对（D-026 变更 2）**：每阶段核对权威输入的实际版本与当前上下文可见性；已变化、不可见、被压缩或只剩摘要的重读原文，完整可见且未变的不重复追加；摘要不得替代已批准的 spec / AC / Gate / 安全规则或审核必需的原始输入；产物头部记输入清单（路径 @ SHA 或 hash + 章节）。
- **Gate 1（硬闸门）**：Clarify 完成后由用户批准 `spec.md`；批准即冻结，未批准不得进入 Plan。
- **Gate 2（硬闸门）**：Review 后由用户确认评审结论，确认后方可 Handoff（PR / merge）。
- **Checklist 受保护**：由独立审核员 A 生成并勾选，实施者不勾选；Implement 前读取有效 checklist，全部勾选才继续，过程中不改任何 checklist 文件或标记。通过只代表需求质量，不代表实施完成。
- **需求变更**：Implement 中途需求变化 → 回 Clarify → 重过 Gate 1 → 更新 plan / tasks；不许直接改 tasks.md 偷跑。
- **Review**：A 依 spec + plan + tasks + 真实 diff 评审；存在 P1/P2 = 未通过。

## 3. 已确认的关键决策（实现不得偏离）

全局护栏：**本地优先、每用户独立数据目录**；派生内容标“内部生成”并带根来源，**不计独立证据**；校准只作镜子，**不自动覆盖人的判断**；定稿由用户显式执行，**不自动、不可撤销**；闸门、用户优先、破坏性确认不随自主度放松。

按 §1 读取相关领域的现行权威原文，详细规则仍强制适用；[产品决策导航](docs/README.md#product-decisions) 定位原文，[plan.md §3](docs/plan.md#3-决策记录含取舍) 汇总决策。D-001～D-006 无独立 ADR，不另造第二份政策。

## 4. 工作约定

- 所有功能开发必须走 §2 spec-driven 工作流；`specs/<feature>/` 是实施的唯一入口
- 决策先写 ADR（`docs/decisions/`）再改代码；方案变更先改 docs 再动实现
- 交互/工作流/交付物/知识回流变更先改 `docs/interaction.md`（+ ADR），再动 frontend/backend；界面细则以 `docs/designUI.md` 为准
- docs 变更不改写已冻结的 spec、不授权实施；冻结范围与现行 docs 冲突经 Clarify / Gate 1 处理
- 用户文档、私有数据、凭证永不入库；`.gitignore` 锚点不得移除
- 凭证只在 `.env` 或用户本地数据目录，代码零 fallback 字面量
- 手改数据必须走事务接口并记台账（继承 FTEngine 审计纪律）
- 环境：Windows 11 + Python 3.14，无 WSL；提交前跑测试
- **工作区生命周期（D-025，Walter 2026-10-30）**：默认仅用 `D:/2030/Futures-AI` 串行工作，常驻本地分支为 `main`（已验收）和 `workbench`（在研整合）；不为每次规划、审核或批次留下长期分支 / 衍生目录。独立审核和固定提交要求不取消；必要的临时快照 / worktree 放系统 Temp，确需并行写入时仍按 §6.7 隔离（= model-routing.md 规则 7）。任务结束保存有效修改与证据、确认可恢复后清理临时目录 / 分支；不得据旧 HANDOFF 重建已清理目录，不以目录整合代替 Gate 2。

## 5. 工程准则（贯穿每个阶段，与 §2 同等强制）

1. **不为猜测的竞态/安全边界加复杂度**。只有能说清"具体怎么出错、发生概率多大、要写多少代码"的才做；
   必须先报给 Walter 并得到同意，不许悄悄扩大改动范围。
2. **外部数据只在入口层校验**：用户输入、外部 API、网络响应在边界处校验一次并转成确定类型，
   往里传已确定类型的值；内部不重复做防御性检查。
3. **不提前抽只用一次的函数**。只有会复用、封装了确实复杂的逻辑、或它代表一个能起清楚名字的概念时才抽。
4. **主函数只写正常流程**，校验与细节放到它下面的小函数里。
5. **自动生成的文件不手改**，改源头后重新生成。
6. **测试测真实实现**，不要把业务逻辑抄一份进测试，尽量少用 mock（优先真实实现或在系统边界注入）。
7. **按仓库现有流程走**，不引入仓库没在用的工具或流程。

## 6. 模型路由（兼容入口）

开会话、阶段选模型、派工、审核或回退前，**必读 [model-routing.md](docs/development/model-routing.md) 全文**。旧“§6 规则 N / §6.N”= 其规则 N（含“§6.7 隔离”）。以下硬约束不替代完整路由表和规则：

- 只有调用失败才回退；测试变红、Analyze 差距、Review 未通过都不是换模型的理由。
- 审核员 A 必须新开会话、与实施隔离、与实施模型不同。
- 不得擅自改用户的 provider、路由、API key 或全局 pi 配置；限额窗口内不反复重试已耗尽的通道。
- 每个阶段产物头部记实际模型与通道及切换原因，只记脱敏摘要。
- 本节只管开发工作流；产品运行时的角色与模型三档是 D-019。
