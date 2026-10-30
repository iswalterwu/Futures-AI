# Feature: <feature-name> 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求质量达标，不代表实施完成。实施者不勾选本文件。
> 审核员 A 为独立会话（与实施隔离），单审，结论即审核结论。
> 模型、回退顺序、Claude 通道与独立性要求只在 [docs/development/model-routing.md](../docs/development/model-routing.md) 维护（审核员 A 一行与规则 2～6），本模板不另列模型清单。
> 产物头部记录实际模型、通道、基线提交与回退原因，以及输入清单（路径 @ SHA 或 hash + 适用章节，见 [workflow.md 总规则](../docs/development/workflow.md#general-rule)）。

## 需求完整性

- [ ] 每条需求都有至少一条可验证的验收规则
- [ ] 无未澄清歧义（spec.md §5 歧义记录已清零或闭环）
- [ ] 目标与非目标边界清晰

## 一致性

- [ ] spec / plan / tasks 之间无冲突（Analyze 报告无遗留问题）
- [ ] 与 docs/ 决策与 ADR 无冲突

## 可测试性

- [ ] 每条验收规则可映射到单元测试或手动验收步骤
- [ ] 任务粒度与验证命令满足 tasks.md 模板要求

## 其他自定义项

- [ ] ……
