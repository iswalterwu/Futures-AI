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
| workbench-interaction | in-progress（首批 10/66 已完成，独立批次 Review 通过；feature 未收敛） | v1 正式基线 `43b6d79` + 上游 `90187f7`；Checklist R7 `9acf3de` 通过；H 组仍待 v2 | 2026-10-29 | Walter 已回复“允许”代码实施及本协调会话 `01a18388` 担任集成人，授权在既有 tasks 内持续有效。首批 T-A01～T-A09、T-A09a 由 openai/gpt-6-astra 实施；受审代码 `13a3373`，批次最终记账 `0920004`（实施树 `D:/2030/Futures-AI-interaction-implement`、生产集成树 `D:/2030/Futures-AI-interaction-integration`）。独立 A（claude-fable-5-1 via anthropic）批次 Review `af95b66` 通过：0 P1/P2、6 P3 后续定位，未风险接受；亲跑单元／组件 722 passed、Agent E2E 8 passed、六守卫 / 类型检查 / lint 过。其余 56 项未开始，46 AC 最终验收仍为 0；H-1 生产方 3/4 证据具备、仍缺 v2 消费方集成 SHA，未交付。当前规格树只同步文档，不含实施代码；进度见 [implementation-log.md](workbench-interaction/implementation-log.md)、[review-batch-a09a.md](workbench-interaction/review-batch-a09a.md)、根 HANDOFF.md §11。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-29 | workbench-interaction 首批（Checklist R7 `9acf3de`；代码 `13a3373`；独立 Review `af95b66`） | `frontend-workbench` v2 | H-1 生产方已具备 ① 固定实现 commit + ② 已提交有效 Checklist + ③ 定向测试摘要（含独立 A 亲跑），**④ 消费方集成 SHA 未取得，未交付**；其余 H-x 仍未交付。接口设计与待确认语义见 [interface-handoff.md](workbench-interaction/interface-handoff.md) §3 / §5；必须由 `integration/frontend-workbench-v2` 所有者真正集成后登记④，不能用生产方集成树 `0920004` 冒充，不代写壳文件。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
