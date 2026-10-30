# 开发工作流：spec-driven（workflow.md）

> 本文件是本仓库功能开发工作流的**单一详细权威**（D-026，[ADR](../decisions/20261030-agent-navigation.md)），内容自根 `AGENTS.md`（基线 `c93d4ba`）原 §2 迁入。
> 所有功能开发必须遵守。根 [`AGENTS.md`](../../AGENTS.md) 仍是每个会话必读的入口，其 §2 保留 Gate 与 Checklist 等硬约束摘要；外置细则不放松根文件硬约束。发现两者矛盾时，停止受影响工作，核对 ADR 与批准记录，修正文本后再继续。
> 旧引用“AGENTS §2 第 N 步”= 本文件第 N 步（锚点 `#step-N`）。各阶段使用的模型、通道、回退与审核员独立性**只**在 [model-routing.md](model-routing.md) 维护，本文件不另列模型清单。
> 初稿：`claude-opus-5-5 via anthropic`（bridge 当窗限额 / 限流失败，官方成功）；正式任务超时后接续 = `openai/gpt-6.1-sol via openai`，基线 `c93d4ba3e3768e489e7738dbdcb4ef1d883f4aab`。最新验证与审核见[维护记录](../maintenance/20261030-agent-navigation.md)。

```
Constitution → Spec → Clarify → 【Gate 1】 → Plan → Checklist → Tasks → Analyze → Implement → Converge → Review → 【Gate 2】 → Handoff
```

<a id="general-rule"></a>

## 总规则：阶段输入核对（D-026 阅读策略变更 2）

原文为“每一步开始时重新读取对应文件（AGENTS.md、docs/、`specs/<feature>/` 产物），不依赖会话记忆”。D-026 将其**改为**下列规则（这是阅读策略的实质变更，不是机械迁移）：

1. **根 `AGENTS.md` 始终必读**。
2. 每个阶段开始时，核对本阶段权威输入（AGENTS.md、相关 `docs/`、`specs/<feature>/` 产物、固定提交 / 真实 diff）的**实际版本**（提交 SHA 或文件 hash）与其在**当前上下文中的可见性**。
3. 输入已变化、不在当前上下文、被压缩 / 截断或只剩摘要时，**重读原文**；输入在当前上下文中完整可见且版本未变时，**不重复追加**同一份原文。
4. 摘要、会话记忆、HANDOFF 转述**不得**替代已批准的 spec / AC / Gate / 安全规则原文，也**不得**替代审核必需的原始输入（spec.md、plan.md、tasks.md、实际代码差异）。新开的独立会话（如审核员 A）当前上下文中没有任何输入，按本规则即须读取全部原文。
5. 阶段产物头部以纯文本记录一份小**输入清单**：每行“路径 @ 提交 SHA 或文件 hash + 适用章节”，例如：

   ```
   输入清单：
   AGENTS.md @ <sha> 全文
   docs/development/workflow.md @ <sha> 第 8 步
   specs/<feature>/spec.md @ <sha> R-001～R-004
   specs/<feature>/checklist.md @ <sha> 当前有效轮次
   ```

   不需要新工具或框架；只记录，不替代原文。

<a id="step-1"></a>

## 1. Constitution

先固化项目原则，明确安全边界、什么该做什么不该做。
载体：根 `AGENTS.md`（§3 决策红线、§4 工作约定、§5 工程准则）+ `docs/`（plan/architecture/interaction/designUI）+ `docs/decisions/` ADR。文档权威归属见 [docs/README.md](../README.md)。

<a id="step-2"></a>

## 2. Spec

按照 what/why 写 feature 的需求，不写技术方案；每条需求必须能映射到具体的验收规则。
产物：`specs/<feature>/spec.md`（模板 [templates/spec.md](../../templates/spec.md)）。

<a id="step-3"></a>

## 3. Clarify

AI Agent 追问所有描述不明确的地方和歧义点；能从仓库、文档、既有方案推断的，不问用户；将回答融入 spec 中，避免出现模糊不清的情况。产物：更新 `spec.md`（歧义记录表）。

<a id="gate-1"></a>

## Gate 1（人工批准，硬闸门）

Clarify 完成后、Plan 开始前，由用户批准 `spec.md`。批准后 **spec 冻结**；未批准不得进入 Plan。此后任何需求变更都按第 8 步的[变更规则](#change-rule)处理。

<a id="step-4"></a>

## 4. Plan

参考技术栈和架构信息，生成来自 spec 规范的设计成果，包括具体的实施细节。
产物：`specs/<feature>/plan.md`（模板 [templates/plan.md](../../templates/plan.md)）。

<a id="step-5"></a>

## 5. Checklist

生成一个自定义的质量检查清单，包括针对 spec 需求进行的单元测试，以便在工作进行分解前确保需求描述完整、清晰且一致。这些自定义检查清单属于审核员所确定的需求质量审查成果；只有当审核员认为某项检查标准得到满足时，才会标记该项检查为已通过。虽然某些自定义项已通过检查，但这并不意味着实施工作已经完成。

- **审核员**：**A**，独立会话（新开会话、与实施隔离、与实施不同模型）；其结论即为审核结论（单审，不再要求第二名审核员、不做共识投票）。A 的模型与回退顺序、Claude 接入通道规则见 [model-routing.md](model-routing.md)。每轮在产物头部记录实际模型与通道（如 `A = claude-fable-5-1 via anthropic`）及切换原因。
- 产物：`specs/<feature>/checklist.md`（模板 [templates/checklist.md](../../templates/checklist.md)；**实施者不勾选**）。
- 有效轮次：同一 feature 多轮复核时，以 checklist 文件内标明的“当前有效”轮次 / 提交为准。有 `specs/<feature>/README.md` 时可由其定位；没有导航 README 时直接读取该 feature 的 checklist 与审核记录，不要求为此补建 README。

<a id="step-6"></a>

## 6. Tasks

把方案拆成 0.5 到 2 小时可完成的任务，每个任务包含上下文、修改范围、完成标准和验证命令。
**完成标准必须引用 spec 的 AC 编号**（如“满足 AC-001-1”），验证命令与完成标准一一对应。
产物：`specs/<feature>/tasks.md`（模板 [templates/tasks.md](../../templates/tasks.md)）。

<a id="step-7"></a>

## 7. Analyze

报告在 spec.md、plan.md 和 tasks.md 之间存在的冲突、差距和模糊之处。该报告是只读的；如果发现了问题请进行修复，然后在实施之前重新运行该报告。

<a id="step-8"></a>

## 8. Implement

按照依赖顺序执行 tasks.md 中的任务。在执行之前，会读取检查清单中的复选框状态作为前置条件，并在继续之前确认所有检查清单项都已勾选；过程中不会修改任何检查清单文件或标记。可以一次性运行以构建整个系统，或者将任务划分为多个阶段来处理大型功能。

<a id="change-rule"></a>

**需求变更规则**：Implement 中途需求发生变化 → 回到 Clarify 重新走流水线（更新 spec → 重新过 Gate 1 → 更新 plan/tasks），不许直接改 tasks.md 偷跑。

<a id="step-9"></a>

## 9. Converge

对比代码库与规范、计划以及任务列表进行检查。如果发现差距，就在 tasks.md 处添加新的任务，然后运行 Implement 工作流再次进行比对，直到报告"已收敛"为止。否则任务完成，可以继续完成评审。

<a id="step-10"></a>

## 10. Review

由**审核员 A**（新开独立会话，与实施隔离，模型按 [model-routing.md](model-routing.md)）参考 **spec.md + plan.md + tasks.md + 实际代码差异**（git diff）评审，按 bug、架构风险、测试缺口、目标是否对齐出结论，禁止只做风格化总结。
判定规则：存在 P1/P2 = 未通过；仅 P3 或无发现 = 通过（P3 可接受为后续任务）。

<a id="gate-2"></a>

## Gate 2（人工批准，硬闸门）

Review 完成后，由用户确认评审结论（bug 修复 / 风险接受 / 缺口补齐），确认后方可进入 Handoff。

<a id="step-11"></a>

## 11. Handoff

更新 feature 的 review.md，记录完成项、未完成项、风险和下一步任务，并附**验收证据**：测试命令输出摘要、Converge 报告结论。然后**提交 PR 并 merge 到 main**；若出现 conflict，先 resolve 冲突（涉及实现语义的冲突解决后回到 Analyze/Converge 复查），再完成 merge。

模板：[templates/review.md](../../templates/review.md)。

<a id="feature-layout"></a>

## 功能规格目录约定

```
specs/<feature>/          # 每个功能性 feature 一个独立规格目录（如 desktop-shell）
├── spec.md               # 需求：what/why + 验收规则（不含技术方案）
├── plan.md               # 实施设计：技术方案与细节（Plan 阶段）
├── tasks.md              # 任务分解（0.5–2h/任务，含验证命令）
├── review.md             # 评审与交接记录（Handoff 阶段更新）
└── checklist.md          # 质量检查清单（Checklist 阶段生成，有则必读）
```

- 新建 feature 一律从 [`templates/`](../../templates/README.md) 模板起稿，走完整个工作流。
- 在研 feature 可另有只导航的 `README.md`（指向冻结 spec / plan / tasks、有效 checklist、风险与下一步来源），它不是新的状态或审核权威。

<a id="status-table"></a>

## 多 feature 并行

[`specs/README.md`](../../specs/README.md) 维护一张**状态表**（feature / 状态 / 依赖 / 最近更新）。feature 开始、阻塞、完成时必须更新；依赖未满足的 feature 不得进入 Plan。

<a id="isolation"></a>

## 隔离与并行写入

并行写入的会话 / 工作树隔离、文件所有权、基线提交、共享文件串行合并、审核会话只读等规则的单一详细权威是 [model-routing.md 规则 7](model-routing.md#rule-7)；工作区默认串行、临时目录 / 分支用后回收见 D-025 与根 `AGENTS.md` §4。

## 与当前 docs 的关系

`docs/` 的后续修改不会改写已冻结的 spec，也不授权实施。若冻结 spec 与当前 docs 冲突，通过 Clarify / Gate 1 解决（按第 8 步变更规则更新 spec → 重新过 Gate 1 → 更新 plan / tasks），不得直接改 tasks 或实现绕过；待解决的冲突登记在该 feature 记录或 [specs/README.md](../../specs/README.md) 跨 feature 待同步事项。
