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
| workbench-interaction | in-progress（**第四批 Review 未通过；R4-A 待 §5.1 批准；已 push 备份，未 merge / 未删除**） | v1 `43b6d79` + 上游 pin `90187f7`；有效 Checklist R10 `37e2f71`；H 组仍待 v2 | 2026-10-29 | 70 项：21 完成 + 5 已实施未过 + 44 未开始；46 AC 最终验收 0，未收敛。Review `9812f64`：1 P2（R4-A）+ 4 P3，本次未修、未重跑测试。已 push：`integration/workbench-interaction` @ `e285ad2`（代码 `6c082fd`）、`spec/workbench-interaction`、`docs/workbench-interaction-batch3-plan` @ `8c4660f`，覆盖全部 21 个本地分支历史。[Draft PR #12](https://github.com/iswalterwu/Futures-AI/pull/12) 仅保存 / 查看，不合入；与 main 仍有冲突。main `072bb12` 未动。本 feature 的 25 棵 worktree 全部保留，待 Walter 选择：不合 main 只归档清理，或按完整流程继续。H-x ④仍缺。恢复见根 HANDOFF.md §15、[implementation-log.md](workbench-interaction/implementation-log.md) §16。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-29 | workbench-interaction 第四批 Review `9812f64` 未过（有效 Checklist R10 `37e2f71`） | `frontend-workbench` v2 | H-1 / H-3 / H-4 与 H-2·标签历史证据保留；标签新候选 `5c00cf6` 经 A 核对 18 / 9 / 21 / 48，但本批有 P2 R4-A，暂不转生产已核。H-2·列表公开接口未变，①仍 `af24c82`，旧 27 例复跑通过；详情缓存内部成员记 `ca7dca1`。B01 / B02 / B04 已实施但 Review 未过，C 组未做，页面切片未交付。**④ 消费方集成 SHA 仍全缺**，不能用生产方 `e285ad2` 冒充；消费分支只读仍 `3f63273`，本 session 不写、不重建、不代 merge。R4-A 最小修复待 Walter §5.1 批准；H-5 未做、H-6 缺 T-A21。接口见 [interface-handoff.md](workbench-interaction/interface-handoff.md)。main `072bb12` 未自动导入，同步仍须 R2-D 流程及与 v2 所有者协调 T-V2-09#4。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
