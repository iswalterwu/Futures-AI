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
| frontend-workbench | blocked（v2：S0 = T-V2-01/02 已完成；T-V2-03～12 共 10 项 blocked 于 H-x；完整 v2 未收敛（外部阻塞），非 done） | 无后端依赖；v1 正式 Handoff = `43b6d79`（PR #7，已在 main）。S1/S2 依赖 `workbench-interaction` 的 H-1～H-6 / 页面切片四项交接（固定 commit、有效 Checklist SHA、定向测试摘要、集成 SHA），tasks §1.2 八行全部未交付；互动方 `8af343f` / `0e37fbf` / `9acf3de` / `5e9e1f4` 只是设计 / 审核证据 | 2026-10-29 | v1 已 Handoff（[review.md §8/§9](frontend-workbench/review.md)），11 P3 已接受未修，H-02 台账不改；v2 共 52 AC、12 任务 / 22 h。G-02 已闭环（Walter“可以”），R9 固定审 `ee3e348` 无内部问题；A R4 设计 Checklist 固定审 `34ee795` 通过（产物 `e596244`，只放行 S0）。S0 实施 Astra（`openai/gpt-6-astra via openai`）：T01 `0aebf66`、T02 `5d53f45`；Converge 固定审 `5d53f45`，S0 无差距（`converge-v2-s0.md`）；S0 限定代码审查 A 固定审 `fab08a6`，通过（仅 S0，0 P1 / 0 P2 / 1 P3，产物 `6acfd30`，`review-v2-s0.md`）。564 unit + 68 e2e 只是 S0 回归，不算 52 AC 验收。P3-1（加载百分比长浮点）只登记为后续候选，未修复、未获风险接受，不计入 12 项。人工 M-01～M-12 未代勾，未补截图；未做最终 Review / Gate 2 / Handoff / PR / main 合并。当前交接见根目录 `HANDOFF.md` 与 tasks §1.3 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | frontend-workbench plan §7.3 H-2/H-4/H-5/H-6；v2 Checklist V2-S01；v2 Tasks §1.2 | `workbench-interaction` | 在其 Plan/Tasks 落实共享未筛选作业列表缓存及写回执/agent 通知刷新、进行中口径与 JobTypeLabel、session 同次导航清空、投放 jobId 快照及非模态容器约定、listJobs 场景与角标 fixture；经其 A 审核授权后以固定 commit + 定向测试摘要分批交接，登记已提交的 Checklist SHA；壳不代写、不以移动工作树为证据。v2 Tasks 细化的交接范围：`JobStatusBadge` 随 H-2 交付；H-2 的标签导出（如 `StageLabel`）可先于共享列表缓存单独交付给壳 S1-ctx；H-3 的路由定义与 `main.ts` 注册切片可先交付给壳 S1-track，不等列表/详情页面功能。Analyze R1 后补充：H-2·列表随交接至少交付一个会改变作业摘要的写 action（如 `createJob` 的 store action，名称以交接 SHA 登记）及其 store 归属、公开导出与定向测试；H-4 交接登记写明是否含可测试的公开设置方式（只经路由守卫设置时，壳 S1-ctx 条件依赖 H-3 路由切片）；H-6 `jobFixtures` 可替换整个作业样例集合 |
| 2026-10-28 | D-018（定稿取代"发布"；学习区定名"格物致知"） | `workbench-interaction`（spec 已冻结） | 按 AGENTS.md §2 第 8 步回 Clarify 做术语级修订（R-006 / AC-006-7 / AC-007-3 "发布"→"定稿"，"学习"→"格物致知"；不加 AC）后重过 Gate 1 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
