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
| frontend-workbench | in-progress（v2.1 Gate 1 已通过；v2 Plan §7 → A Checklist R1 通过；v2 Tasks 草案已产出，待 Analyze 与 A 定向复核；实施 blocked：v1 Handoff SHA 及 H-1～H-6 交接均未取得） | 无后端依赖；实施硬前置为 v1 Handoff 合入 main 的准确 SHA（未取得）。v2 S1/S2 按 plan §7.3 分批接收互动方固定提交与定向测试摘要；其已提交基线 8bd1b31 的旧 R2 通过不覆盖新增 H-2/H-4/H-5/H-6，移动工作树的 R3/R4 不作为交接证据；外部交接未就绪 | 2026-10-28 | v2 52 AC 已冻结；checklist-v2.md 为当前有效清单，A = claude-fable-5-1 via anthropic，审 d2bf5a7：0 阻断 / 9 建议。v1 checklist.md / 历史任务不改、不授权 v2；Tasks 草案已产出（12 任务 / 22 h，随附 plan §7 未审小改），Analyze 及 A 定向复核待完成，不进入 Implement；v1 尚未 Handoff |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | frontend-workbench plan §7.3 H-2/H-4/H-5/H-6；v2 Checklist V2-S01；v2 Tasks §1.2 | `workbench-interaction` | 在其 Plan/Tasks 落实共享未筛选作业列表缓存及写回执/agent 通知刷新、进行中口径与 JobTypeLabel、session 同次导航清空、投放 jobId 快照及非模态容器约定、listJobs 场景与角标 fixture；经其 A 审核授权后以固定 commit + 定向测试摘要分批交接，登记已提交的 Checklist SHA；壳不代写、不以移动工作树为证据。v2 Tasks 细化的交接范围：`JobStatusBadge` 随 H-2 交付；H-2 的标签导出（如 `StageLabel`）可先于共享列表缓存单独交付给壳 S1-ctx；H-3 的路由定义与 `main.ts` 注册切片可先交付给壳 S1-track，不等列表/详情页面功能 |
| 2026-10-28 | D-018（定稿取代"发布"；学习区定名"格物致知"） | `workbench-interaction`（spec 已冻结） | 按 AGENTS.md §2 第 8 步回 Clarify 做术语级修订（R-006 / AC-006-7 / AC-007-3 "发布"→"定稿"，"学习"→"格物致知"；不加 AC）后重过 Gate 1 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
