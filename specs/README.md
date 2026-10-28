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
| data-layer | in-progress | 无 | 2026-10-27 | 已合并（PR #1/#2）；v23（D-013 库存收敛 + D-014 EIA 双路径）Gate 1 已批准 → Plan/Implement |
| settings | in-progress（核心完成，GUI blocked） | desktop-shell、data-layer v23 | 2026-10-28 | 核心 + CLI 完成并经 A 单审通过；GUI 类 AC 由 T-08 随 desktop-shell 承载（Walter 批准分阶段交付） |
| desktop-shell | in-progress | frontend-workbench（完整前端集成）、settings、data-layer v23 | 2026-10-28 | Gate 1 已批准；T-01～T-06 阶段代码已有，按新多 agent 路由补齐 Plan/Analyze/Checklist 后推进 T-07～T-10；最终 Review 后待 Gate 2 |
| frontend-workbench | in-progress（v1 实施中；v2 Clarify 草稿待 Gate 1） | 无后端依赖；v2 集成 AC 依赖 workbench-interaction 前端 | 2026-10-28 | v1 地基在 feat/frontend-workbench（基线 fdaa7d8）；v2 草稿位于隔离 worktree D:/2030/Futures-AI-workbench-v2（spec/frontend-workbench-v2）：九项导航/固定作业轨道/全局投放/对话上下文，52 AC、Q-023～Q-030 待 Walter 批准；未进入 v2 Plan |
| workbench-interaction | in-progress（Checklist A 独立审核中） | frontend-workbench v1 地基；壳集成待 v2 批准；api 仅后续真实集成 | 2026-10-28 | Phase 1.5 协作交付骨架；Spec Gate 1 已批准（9 需求/46 AC），Plan 完成。审阅包 checklist-review-request.md；bridge 实测额度受限，已启动 claude-fable-5-1 via anthropic 新会话；未取得结论，不进入 Tasks / Implement |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。
