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
| workbench-interaction | in-progress（两批共 16/67 已完成，第二批独立 Review 通过；feature 未收敛） | v1 基线 `43b6d79` + 本批上游 pin `90187f7`；当前 Checklist R8.1 `34d339e` 通过；H 组仍待 v2 | 2026-10-29 | Walter 的代码实施及本协调会话 `01a18388` 集成授权持续有效。第二批 T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24 已完成（openai/gpt-6-astra），代码 `27e59e6`，批次最终记账 `f1b7c06`；独立 A（claude-fable-5-1 via anthropic）[review-batch2.md](workbench-interaction/review-batch2.md) `f72a1a1` 通过：0 P1/P2、5 P3 后续定位。A 亲跑单元／组件 833 passed、壳层+Agent E2E 24 passed、六守卫 / 契约对拍 / 类型检查 / lint 过。任务拆分后共 67 项 / 102 h，224 标准命令对；16 完成、51 未开始、46 AC 最终验收仍 0。H-1 / H-2·标签 / H-3 / H-4 生产方各具备 3/4 证据、均缺消费方集成 SHA；未交付。main 已到 `072bb12`（v2 S0），未自动导入；同步前须按 tasks §7 重核 / Analyze / A 定向并协调壳断言迁移，不能把本批旧基线绿当作新基线证据。实现与生产集成树均 `f1b7c06`，当前规格树只同步文档。记录见 [implementation-log.md](workbench-interaction/implementation-log.md)、根 HANDOFF.md §12。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-29 | workbench-interaction 两批（当前 Checklist R8.1 `34d339e`；第二批 Review `f72a1a1`） | `frontend-workbench` v2 | H-1（① `13a3373`）、H-2·标签（① `ebce4c8`）、H-3·路由（① `cc59e94`）、H-4（① `b38cf43`）均已有生产方①②③（含 A 亲跑），**④ 消费方集成 SHA 均未取得，未交付**；其余切片提供任务未齐。接口与证据见 [interface-handoff.md](workbench-interaction/interface-handoff.md)。必须由消费方所有者真正集成后登记④，不能用生产方 `f1b7c06` 冒充。同步 main `072bb12` 的 jobs 壳占位时，需要协调 v2 T-V2-09#4 的 shell E2E 断言迁移；本 session 不代写壳文件或代 merge v2 树。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
