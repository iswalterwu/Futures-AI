# 开发工作流模型路由（model-routing.md）

> 本文件是本仓库**开发工作流**模型路由的**单一详细权威**（D-026，[ADR](../decisions/20261030-agent-navigation.md)）。下方“模型路由规范”一节自根 `AGENTS.md`（基线 `c93d4ba`）原 §6 **逐字迁移**，只在每条规则前加入锚点；名称、通道、回退顺序与规则语义均未改动。
> 根 [`AGENTS.md`](../../AGENTS.md) §6 保留为兼容入口与硬约束摘要。**开新会话、为任何工作流阶段选模型、派工、审核、回退之前，必须读取本文件全文。**
> 迁移作者：`claude-opus-5-5 via anthropic`（bridge 当窗限额 / 限流失败，官方成功），基线 `c93d4ba3e3768e489e7738dbdcb4ef1d883f4aab`。迁移后的验证 / 审核与作者超时接续记录见[维护记录](../maintenance/20261030-agent-navigation.md)。

## 引用解析（迁移后路径说明，不改原文）

| 原文写法 | 迁移后指向 |
|---|---|
| “§2 的工作流阶段”、“Gate 1 / Gate 2、checklist 前置条件” | [workflow.md](workflow.md) 同名阶段与 Gate（旧“AGENTS §2 第 N 步”= workflow 第 N 步） |
| “§5 工程准则” | 根 [`AGENTS.md`](../../AGENTS.md) §5（七条逐字保留） |
| “本节” | 本文件“模型路由规范”一节 |
| 旧引用“AGENTS §6 规则 N”“§6.N”“§6 第 N 条” | 本文件规则 N（锚点 `#rule-N`），例如历史“§6.7 隔离”= [规则 7](#rule-7)，“§6 规则 5”= [规则 5](#rule-5) |
| 历史分支用语“AGENTS §2.1”（旧模板曾指向的模型路由小节） | 本文件 |
| `architecture.md` §5.5 | [docs/architecture.md](../architecture.md) §5.5（产品运行时角色与三档，D-019） |
| `specs/<feature>/review.md`、`plan.md` | 各 feature 规格目录；纯文档维护无 feature 目录时按 `docs/maintenance/` 维护记录先例记录 |

## 模型路由规范（本仓库开发工作流；Walter 2026-10-28 裁定）

适用于为本仓库开启的每个 pi 会话（`--model <provider>/<model>`）。按 §2 的工作流阶段选模型；首选不可用时按顺序回退。

| 工作流阶段 | 首选 | 回退 1 | 回退 2 |
|---|---|---|---|
| 计划与分析类：Constitution / Spec / Clarify / Plan / Tasks / Analyze / Converge / Handoff（含文档与 ADR 撰写） | `claude-opus-5-5` | `openai/gpt-6.1-sol` | `deepseek/deepseek-flash` |
| Implement（实施：写代码、跑测试、修 bug） | `openai/gpt-6-astra` | `deepseek/deepseek-flash` | — |
| 审核员 A：Checklist / Review | `claude-fable-5-1` | `claude-opus-5-5` | `openai/gpt-6.1-sol` |

规则：

1. <a id="rule-1"></a>**回退触发** = 没有用量（额度耗尽 / 限流持续）或出现错误（鉴权失败、launcher 异常、同一请求连续失败）；不因"觉得慢"回退。回退后该阶段余下工作可留在回退模型上，下一阶段重新从首选开始。
2. <a id="rule-2"></a>**Claude 接入通道**：所有 Claude 模型先测 `claude-bridge` 链路（`--model claude-bridge/<model>`），不成功才走官方 API key 链路（`--model anthropic/<model>`）。换通道不是换模型，不改变阶段 / 审核员身份；通道都不通才按上表回退到下一个模型。
3. <a id="rule-3"></a>**审核员独立性**：A 必须是新开会话、与实施隔离、与实施模型不同；回退后仍须满足（表中 A 的任一候选都不与 Implement 候选重合）。
4. <a id="rule-4"></a>**记录**：每个阶段产物头部记实际模型与通道及切换原因（如 `Plan = claude-opus-5-5 via claude-bridge`、`A = claude-opus-5-5 via anthropic（fable 额度耗尽）`）；派工 / 回退在 `specs/<feature>/review.md`（前期可用 `plan.md`）简记角色、任务、基线提交、实际 provider/model、失败类别；只记脱敏摘要，不记 API key、token 或完整鉴权报错。
5. <a id="rule-5"></a>**探活与不重试**：首次使用某 Claude 模型前先做一次最小真实调用测 bridge 链路（模型在列表中可见不等于可调用）；已明确限额耗尽的通道在当前限额窗口内不反复重试，新会话或窗口重置后再测。不得擅自改用户的 provider、路由、API key 或全局 pi 配置。
6. <a id="rule-6"></a>**只有调用失败才回退**：测试变红、Analyze 发现差距、Review 判未通过都是正常任务结果，不是换模型找"通过"的理由。所有候选都不可用 → 标 blocked 并报告，不跳过审核、不伪称完成。回退不取消 Gate 1 / Gate 2、checklist 前置条件与 §5 工程准则。
7. <a id="rule-7"></a>**会话与工作树**：每个并行写入的 agent 用独立 git worktree / 分支，明确文件所有权、任务范围、AC、验证命令与基线提交；不共享可写目录、不同时改同一文件、不在别的 feature 分支上提交 / reset / 强推；共享文件由指定集成人串行合并；审核会话只读审查固定提交与真实 diff，除勾选 checklist 外不替实施者改代码。
8. <a id="rule-8"></a>本节只管本仓库的开发工作流；产品运行时的角色与模型三档是另一回事（D-019，`architecture.md` §5.5）。

## 与工作区生命周期的关系

规则 7 中为并行写入创建独立 worktree / 分支、共享文件由集成人串行合并的条款，适用于**确需并行写入**的场景；文件所有权、任务范围、基线提交、审核会话只读审查固定提交与真实 diff、除勾选 checklist 外不替实施者改代码等要求，**串行工作时同样有效**。

默认仅用 `D:/2030/Futures-AI` 串行工作，常驻本地分支为 `main` 与 `workbench`。独立审核和固定提交要求不取消；必要的临时快照 / worktree 放系统 Temp，任务结束保存有效修改与证据、确认可恢复后回收（D-025，[ADR](../decisions/20261030-workspace-lifecycle.md)，根 `AGENTS.md` §4）。
