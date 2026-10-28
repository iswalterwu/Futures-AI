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
| frontend-workbench | in-progress（v1 已合并；H-01 实现已收敛，待独立 Review / Gate 2） | 无（与后端唯一接口为 R-007 契约） | 2026-10-28 | v1 已经 [PR #7](https://github.com/iswalterwu/Futures-AI/pull/7) 合并到 main（`43b6d79`），Gate 2 已确认（11 项 P3 接受为后续、未修复），证据见 [review.md §9](frontend-workbench/review.md#9-handoff-记录2026-10-28)。**H-01 修复 in-progress**：用户 2026-10-28 回复“继续”，按建议仅做最小样式修复，T-18 已实施（分支 `fix/frontend-workbench-visual`，代码 `771f2af`），Converge 判定 H-01 修复的实现与自动化验证范围已收敛（[converge.md §9](frontend-workbench/converge.md)、[review.md §11](frontend-workbench/review.md)）；待独立 A Review，本次修复 Gate 2 未批准。H-02 留待 v2、未修复。M-01 ~ M-08 仍待 Walter 人工复核。v2 在独立规格分支推进，不属 v1。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | D-018（定稿取代"发布"；学习区定名"格物致知"） | `workbench-interaction`（spec 已冻结） | 按 AGENTS.md §2 第 8 步回 Clarify 做术语级修订（R-006 / AC-006-7 / AC-007-3 "发布"→"定稿"，"学习"→"格物致知"；不加 AC）后重过 Gate 1 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
