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
| frontend-workbench | in-progress（v1 实施中；v2 Clarify 草稿待 Gate 1） | 无后端依赖；v2 集成 AC 依赖 workbench-interaction 前端 | 2026-10-28 | 隔离 worktree D:/2030/Futures-AI-workbench-v2（spec/frontend-workbench-v2）：九项导航/固定作业轨道/全局投放/对话上下文，52 AC、Q-023～Q-030 待 Walter 批准；按 A 首轮 B-06 细化唯一文件所有者；未进入 v2 Plan |
| workbench-interaction | in-progress（**第四批 Review 未通过；R4-A 最小修复待 Walter §5.1 批准**） | v1 `43b6d79` + 上游 pin `90187f7`；有效 Checklist **R10 `37e2f71`**（26/26）；H 组仍待 v2 | 2026-10-29 | 70 项 / 104.5 h、235 标准命令对：**21 已完成 + 5 已实施未过 + 44 未开始**（含待批草案 T-B04a）；46 AC 最终验收 0，feature 未收敛。第四批 B01 / B02 / A22d / B04 / B03 代码固定 `6c082fd`，列表、筛选、详情轨道与创建闭环已实施，C–F 工作区仍占位。独立 A [review-batch4.md](workbench-interaction/review-batch4.md) `9812f64` 判未通过：**1 P2 R4-A + 4 P3**。A 亲跑单元／组件 **1018 passed**、四份 E2E **29 passed**、六守卫 / 类型 / lint / 契约 24 / 10 / 2 通过，但不改变 Review 判定。R4-A：slow 下离开、Back 或选阶段后被迟到的 canonical replace 拉回；约 3–5 行 onCleanup 失效检查 + 2 例组件 / 1 例 E2E 草案，**Walter 尚未单独批准，不派代码**。当前只是 §5.1 工程审批，不是全 feature Gate 2，也不以风险接受抹掉 P2。通用代码 / 集成人授权持续但不覆盖此新增 guard。H-x ④仍全缺，标签候选 `5c00cf6` 不转生产已核；旧未关项见日志 §8。三棵本方代码／记账树 `e285ad2`，规格树只同步文档，未 push / PR / merge main。恢复见 [implementation-log.md](workbench-interaction/implementation-log.md) §16、[analyze.md](workbench-interaction/analyze.md) R18、根 HANDOFF.md §14。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-29 | workbench-interaction 第四批 Review `9812f64` 未过（有效 Checklist R10 `37e2f71`） | `frontend-workbench` v2 | H-1 / H-3 / H-4 与 H-2·标签历史证据保留；标签新候选 `5c00cf6` 经 A 核对 18 / 9 / 21 / 48，但本批有 P2 R4-A，暂不转生产已核。H-2·列表公开接口未变，①仍 `af24c82`，旧 27 例复跑通过；详情缓存内部成员记 `ca7dca1`。B01 / B02 / B04 已实施但 Review 未过，C 组未做，页面切片未交付。**④ 消费方集成 SHA 仍全缺**，不能用生产方 `e285ad2` 冒充；消费分支只读仍 `3f63273`，本 session 不写、不重建、不代 merge。R4-A 最小修复待 Walter §5.1 批准；H-5 未做、H-6 缺 T-A21。接口见 [interface-handoff.md](workbench-interaction/interface-handoff.md)。main `072bb12` 未自动导入，同步仍须 R2-D 流程及与 v2 所有者协调 T-V2-09#4。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
