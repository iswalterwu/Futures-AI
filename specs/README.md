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
| frontend-workbench | blocked（v1、H-01 修复、T-19 M-08 证据补采已交付；v2 仅 S0 = T-V2-01/02 已完成，经 Walter 授权阶段性合入 main；T-V2-03～12 共 10 项 blocked 于 H-x；完整 v2 未收敛（外部阻塞），非 done） | 无后端依赖（与后端唯一接口为 R-007 契约）；v1 正式 Handoff = `43b6d79`（PR #7，已在 main）。v2 S1/S2 依赖 `workbench-interaction` 的 H-1～H-6 / 页面切片四项交接（固定 commit、有效 Checklist SHA、定向测试摘要、集成 SHA），tasks §1.2 八行全部未交付；互动方 `8af343f` / `0e37fbf` / `9acf3de` / `5e9e1f4` 只是设计 / 审核证据 | 2026-10-29 | **v1**：经 [PR #7](https://github.com/iswalterwu/Futures-AI/pull/7) 合并（Gate 2 已确认，11 项 P3 接受为后续、未修复、未扩改，[review.md §9](frontend-workbench/review.md#9-handoff-记录2026-10-28)）。**H-01 修复**（T-18）经 [PR #8](https://github.com/iswalterwu/Futures-AI/pull/8) 合并（[review-h01.md](frontend-workbench/review-h01.md)、review §13 ~ §14）。**T-19 M-08 修复后 1440 整图证据补采**：独立 A 通过（[review-m08.md](frontend-workbench/review-m08.md)），Walter 2026-10-28 Gate 2 已批准（A-M08-P3-1 接受为非阻断备注），Handoff 见 [review.md §18 ~ §19](frontend-workbench/review.md)，PR：[iswalterwu/Futures-AI#10](https://github.com/iswalterwu/Futures-AI/pull/10)。v1 待办：Walter 人工复核 M-01 ~ M-08（8 项未勾；A-H01-P3-1 已补采、待复核 M-08）；H-02 v1 台账原文不改、不宣称关闭。**v2**：共 52 AC、12 任务 / 22 h。G-02 已闭环（Walter“可以”），R9 固定审 `ee3e348` 无内部问题；A R4 设计 Checklist 固定审 `34ee795` 通过（产物 `e596244`，只放行 S0）。S0 实施 Astra（`openai/gpt-6-astra via openai`）：T01 `0aebf66`、T02 `5d53f45`；Converge 固定审 `5d53f45`，S0 无差距（`converge-v2-s0.md`）；S0 限定代码审查 A 固定审 `fab08a6`，通过（仅 S0，0 P1 / 0 P2 / 1 P3，产物 `6acfd30`，`review-v2-s0.md`）。564 unit + 68 e2e 只是 S0 回归，不算 52 AC 验收。P3-1（加载百分比长浮点）只登记为后续候选，未修复、未获风险接受，不计入 12 项。人工 M-09～M-12 未代勾、未补截图；未做 v2 最终 Review / Gate 2 / 正式 Handoff。**阶段合入**：Walter 授权把 S0 现有内容合入 main，合并记录、Gate 边界与待清理工作树见 [merge-main-cleanup.md](frontend-workbench/merge-main-cleanup.md)；plan 的 v2 设计由旧 §7 机械迁为 §9（main 的 v1 §7 H-01 / §8 M-08 保留）。当前 v2 交接见 [handoff-v2-s0.md](frontend-workbench/handoff-v2-s0.md) 与 tasks §1.3。D-020～D-024 为后续 Phase 目标，不向冻结 spec 追加义务；“日报”菜单名本轮不改（见下方 D-022 行） |
| dev-harness-budget | done | 无产品 feature 完成依赖 | 2026-10-31 | 开发工作流的运行后用量观测工具 v1（只观测、不约束）；Gate 2 已由用户确认（2026-10-31）；T-01～T-22 已实施，独立 Review R3 通过（0 P1 / 0 P2；2 项 P3 经用户接受为后续任务）；真实试点 T-12 已执行；记录见 [review.md](dev-harness-budget/review.md) |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | frontend-workbench plan §9.3（原 §7.3）H-2/H-4/H-5/H-6；v2 Checklist V2-S01；v2 Tasks §1.2 | `workbench-interaction` | 在其 Plan/Tasks 落实共享未筛选作业列表缓存及写回执/agent 通知刷新、进行中口径与 JobTypeLabel、session 同次导航清空、投放 jobId 快照及非模态容器约定、listJobs 场景与角标 fixture；经其 A 审核授权后以固定 commit + 定向测试摘要分批交接，登记已提交的 Checklist SHA；壳不代写、不以移动工作树为证据。v2 Tasks 细化的交接范围：`JobStatusBadge` 随 H-2 交付；H-2 的标签导出（如 `StageLabel`）可先于共享列表缓存单独交付给壳 S1-ctx；H-3 的路由定义与 `main.ts` 注册切片可先交付给壳 S1-track，不等列表/详情页面功能。Analyze R1 后补充：H-2·列表随交接至少交付一个会改变作业摘要的写 action（如 `createJob` 的 store action，名称以交接 SHA 登记）及其 store 归属、公开导出与定向测试；H-4 交接登记写明是否含可测试的公开设置方式（只经路由守卫设置时，壳 S1-ctx 条件依赖 H-3 路由切片）；H-6 `jobFixtures` 可替换整个作业样例集合 |
| 2026-10-28 | D-018（定稿取代"发布"；学习区定名"格物致知"） | `workbench-interaction`（spec 已冻结） | 按 AGENTS.md §2 第 8 步回 Clarify 做术语级修订（R-006 / AC-006-7 / AC-007-3 "发布"→"定稿"，"学习"→"格物致知"；不加 AC）后重过 Gate 1 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |
| 2026-10-28 | D-024（协议冷启动） | `playbook-bootstrap`（待起 spec，Phase 1） | 依赖知识库 v1 摄取管线 + 透明页最小版；历史产出摄取与可跳过 / 重做访谈 → bootstrap proposed，经透明页确认、不自动 active；待按模板起 spec，本表不代表已开始实施 |
| 2026-10-28 | D-022 / D-023（自主度与主体） | `settings`（后续版本） | 后续 spec 修订承载自主度档位、每日 / 每台预算与主体模型绑定；建议默认 A1，具体档位名与默认档仍由 settings spec 确认；不追加当前版本 AC |
| 2026-10-28 | D-020（结果校准） | 后续交付物 / 验证队列 feature（待起 spec） | 承载观点 / call / 决策三类新块及回链；`workbench-interaction` 冻结 spec 不加 AC，按后续 feature 流程承接 |
| 2026-10-28 | D-022（晨间议程 / 日报导出） | `frontend-workbench` v2（沿用既有 Gate 状态，待核实） | “日报”入口将承载议程与导出，九项菜单不变；是否改名留 v2 Clarify；Phase 2B 焦点带目标不追加冻结 spec 义务，按既有 Gate 状态走变更流程，本轮设计批准不替代其 Gate 1 / Gate 2 |

以上仅为跨 feature 导航待办，不修改冻结 spec / AC，不新建 spec 目录，不表示功能已实现；其他工作树的 Gate 状态由对应负责人核实。
完成后删除对应行。
