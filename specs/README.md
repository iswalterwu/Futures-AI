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
| frontend-workbench | in-progress（v1 实施中；v2 Clarify 草稿待 Gate 1） | 无后端依赖；v2 集成 AC 依赖 workbench-interaction 前端 | 2026-10-28 | v1：45 AC，A Checklist 通过；前端基线 fdaa7d8，T-09 等在独立 worktree 实施。v2：隔离分支 spec/frontend-workbench-v2，九项导航/固定作业轨道/全局投放/对话上下文，52 AC、Q-023～Q-030 待批准；plan/tasks/checklist 仍为 v1，不授权 v2 实施。见 specs/frontend-workbench/v2-gate1-request.md |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。
