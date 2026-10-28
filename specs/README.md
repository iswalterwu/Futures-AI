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

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | D-018（定稿取代"发布"；学习区定名"格物致知"） | `workbench-interaction`（spec 已冻结） | 按 AGENTS.md §2 第 8 步回 Clarify 做术语级修订（R-006 / AC-006-7 / AC-007-3 "发布"→"定稿"，"学习"→"格物致知"；不加 AC）后重过 Gate 1 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |
| 2026-10-28 | D-024（协议冷启动） | `playbook-bootstrap`（待起 spec，Phase 1） | 依赖知识库 v1 摄取管线 + 透明页最小版；历史产出摄取与可跳过 / 重做访谈 → bootstrap proposed，经透明页确认、不自动 active；待按模板起 spec，本表不代表已开始实施 |
| 2026-10-28 | D-022 / D-023（自主度与主体） | `settings`（后续版本） | 后续 spec 修订承载自主度档位、每日 / 每台预算与主体模型绑定；建议默认 A1，具体档位名与默认档仍由 settings spec 确认；不追加当前版本 AC |
| 2026-10-28 | D-020（结果校准） | 后续交付物 / 验证队列 feature（待起 spec） | 承载观点 / call / 决策三类新块及回链；`workbench-interaction` 冻结 spec 不加 AC，按后续 feature 流程承接 |
| 2026-10-28 | D-022（晨间议程 / 日报导出） | `frontend-workbench` v2（沿用既有 Gate 状态，待核实） | “日报”入口将承载议程与导出，九项菜单不变；是否改名留 v2 Clarify；Phase 2B 焦点带目标不追加冻结 spec 义务，按既有 Gate 状态走变更流程，本轮设计批准不替代其 Gate 1 / Gate 2 |

以上仅为跨 feature 导航待办，不修改冻结 spec / AC，不新建 spec 目录，不表示功能已实现；其他工作树的 Gate 状态由对应负责人核实。
完成后删除对应行。
