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
| frontend-workbench | in-progress（v1 尚未完成 Review / Gate 2 / Handoff；v2.1 Gate 1 已通过 → v2 Plan §7 已产出，待 A 独立 v2 Checklist） | 无后端依赖；实施硬前置为 v1 Handoff 合入 main 的准确 SHA。v2 S1/S2 按 plan §7.3 分批接收 workbench-interaction 的固定提交与定向测试摘要，不要求其先全量 Handoff；2026-10-28 只读核对其 R3（8bd1b31）未通过，B-09/B-10 待复核，外部交接未就绪 | 2026-10-28 | v1：45 AC，历史 A Checklist 只授权 v1。v2：spec/frontend-workbench-v2，52 AC、Q-023～Q-031 已冻结；plan.md 页首与 §7 为 v2 设计（Plan = claude-opus-5-5 via anthropic；基线 fec3556）。tasks.md / checklist.md 仍为 v1，不授权 v2 实施；新增令牌、组件与测试仅为计划，未改代码 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | D-018（定稿取代"发布"；学习区定名"格物致知"） | `workbench-interaction`（spec 已冻结） | 按 AGENTS.md §2 第 8 步回 Clarify 做术语级修订（R-006 / AC-006-7 / AC-007-3 "发布"→"定稿"，"学习"→"格物致知"；不加 AC）后重过 Gate 1 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
