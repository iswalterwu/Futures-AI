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
| workbench-interaction | blocked（spec v1.1 冻结；r6 设计经 Checklist R7 通过；Implement 待 Walter 代码授权 + 集成人登记） | frontend-workbench v1 Handoff 合入 main（**已满足**：`implementation_base_sha = 43b6d79`，PR #7 merge commit）；r6 plan / tasks / analyze / interface-handoff 的 A 定向复核（**已满足**：Checklist R7 通过，审核原件提交 `9acf3de`）；Walter 代码实施授权 + 指定集成人 / 集成验证分支 / 实施 worktree 登记（**未取得**）；H 组另待 v2 壳方 S1 / S2 交付；api 仅后续真实集成前置 | 2026-10-28 | Phase 1.5 协作交付骨架。恢复轮 r6（claude-opus-5-5 via anthropic，提交 `0e37fbf`）：在 43b6d79 重核前端事实（唯一实质差异 mock.spec.ts:96-99 已落 T-A09）；与 v2（ded7161）H-1～H-6 / 页面切片对拍，均为既有需求内接口精度、46 AC 不变；Tasks r6 = 66 任务 / 约 101.5 h，全部未开始。Checklist R7（A = claude-fable-5-1 via anthropic，独立会话）固定审 `0e37fbf`：26/26 当前有效项、0 P1/P2，S-27～S-32 六项 P3 未吸收（S-27 / S-29 建议开工前做 Tasks 措辞精度修订）。H-x 八切片全部**未交付**（Checklist SHA 已有 `9acf3de`；实现 commit / 定向测试摘要 / 集成 SHA 未取得），interface-handoff §5 未经 v2 接收方确认。未改代码、未实施、未验收；恢复记录见根 HANDOFF.md §9 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | workbench-interaction r6（interface-handoff.md §3 / §5；tasks §2a；Checklist R7 `9acf3de` 设计通过） | `frontend-workbench` v2 | 生产方 r6 设计已经 A R7 通过，**待 v2 接收方确认 interface-handoff §5**（设计通过 ≠ 双向签收；实现交接四项仍缺实现 commit / 定向测试摘要 / 集成 SHA 三项）。接收方核对公开名称与语义：`useJobsStore()` 的 `jobs / listStatus / listError / ensureJobs / refresh / createJob`；契约常量 `ACTIVE_JOB_STATUSES`（JobStatus − delivered / cancelled）；`sessionStore.context` 只经路由守卫设置、无公开 setter（S1-ctx 条件依赖 H-3）；`main.ts` 另含守卫注册与 jobsStore 订阅（生产方文件）；H-6 角标样例在 job-running / job-conflict 场景且依赖生产方 T-A21，是否分批交接待接收方确认；`jobFixtures` 中 `jobs` 按场景集合分键、每 client 读一次；待归属池在 IntakeDrawer 内；另 R7 S-30（P3，作者未吸收）提示作业内追问经 `agentClient.send` 不带 sessionId、为独立 mock session，供 v2 知悉。全部切片仍未交付；生产方不代写壳文件，接收方不以本行为交接证据 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
