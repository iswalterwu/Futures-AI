# specs/ — 功能规格目录

每个功能性 feature 一个独立规格目录，例如 `desktop-shell`、`data-layer`、`daily-report`。

```
specs/<feature>/
├── spec.md       # 需求：what/why + 验收规则（Spec / Clarify 阶段）
├── plan.md       # 实施设计（Plan 阶段）
├── tasks.md      # 任务分解（Tasks 阶段；Implement/Converge 更新）
├── review.md     # 评审与交接（Handoff 阶段）
└── checklist.md  # 质量检查清单（Checklist 阶段，审核员生成并勾选）
```

- 工作流与各阶段规则见根目录 `AGENTS.md` §2
- 模板在 `templates/`
- 本目录是功能实施的唯一入口：先有规格、后有代码

## 状态表（多 feature 并行时必维护）

| feature | 状态 | 依赖 | 最近更新 | 备注 |
|---|---|---|---|---|
| data-layer | done | 无 | 2026-10-27 | Gate 2 已确认（选项 A）；Handoff：feat/data-layer 经 PR 合并到 main；后续任务见 specs/data-layer/review.md |
| frontend-workbench | blocked | 无（与后端唯一接口为 R-007 契约） | 2026-10-28 | v1 独立 A [第二轮 Review 通过](frontend-workbench/review.md#7-第二轮定向复核2026-10-28)，R1-01 / R1-09 闭环；559 单元 / 组件 + 66 e2e、构建通过，[Converge](frontend-workbench/converge.md) 已收敛（实现与自动验证范围）。当前仅阻塞于人工 Gate 2：剩余 11 项 P3（首轮 9 + 二轮 2）处置待确认，M-01 ~ M-08 待验；未进入 Handoff / PR / merge。v2 仍暂停于 Clarify、等待 D-018 术语同步，不纳入本轮 v1 整改。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。
