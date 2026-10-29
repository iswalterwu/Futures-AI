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
| workbench-interaction | in-progress（**第三批 + R3-A 补修安全点：21/68 已完成，47 未开始；feature 未收敛**） | v1 基线 `43b6d79` + 上游 pin `90187f7`；当前 Checklist **R9 `ab742f5`**（26/26）；H 组仍待 v2 | 2026-10-29 | Walter 的代码实施及集成人 `01a18388` 授权持续有效。第三批 T-A11 / A12 / A13 / A22a 经独立 A [review-batch3.md](workbench-interaction/review-batch3.md) `49edb7e` 通过（0 P1/P2）；新增小任务 T-A22c 修复筛选顺序问题，代码 `af24c82`，增量 [review-batch3-cache-fix.md](workbench-interaction/review-batch3-cache-fix.md) `69faacc` 通过（0 P1/P2、0 新 P3，R3-A 关闭）。A 亲跑单元／组件 **953 passed**、壳层+Agent E2E **24 passed**、契约对拍 24 / 10 / 2、六守卫 / 类型检查 / lint 通过；其余 7 份 E2E 未跑。现 68 项 / 102.5 h、227 标准命令对；46 AC 最终验收仍 0。R3-B → T-C03 / T-A17、R3-C → T-G04 未修、未经风险接受；前两批未关项见实施日志 §8。H-2·列表等已有生产方①②③，但④消费方集成 SHA 仍缺、未交付；H-6 缺 T-A21，H-5 / 页面切片未做，`/jobs` 两页仍为骨架。main `072bb12` 未自动导入，同步按 tasks §7 / R2-D。实施与生产集成树均已 ff-only 到记账 `6ba2a15`，当前规格树只同步文档、保留其他 feature 行不变。下一入口 T-B01（先确认 R2-C 徽标令牌归属）或 T-A14～A16 / T-C01。记录见 [implementation-log.md](workbench-interaction/implementation-log.md) §13、根 HANDOFF.md §13；非全 feature Review / Gate 2 / Handoff。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-29 | workbench-interaction 三批 + R3-A 补修（当前 Checklist R9 `ab742f5`；Review `49edb7e` / 增量 `69faacc`） | `frontend-workbench` v2 | H-1（① `13a3373`）、H-2·标签（① `ebce4c8`）、H-3·路由（① `cc59e94`，页面仅骨架）、H-4（① `b38cf43`）保留生产方①②③；新增 **H-2·列表① `af24c82`、② R9、③ A 亲跑 27 例（原四组 5 / 4 / 7 / 9 + 顺序回归 2）及工程门**，R3-A 已关闭。以上 **④ 消费方集成 SHA 仍全缺 → 待消费方集成（未交付）**；H-6 缺 T-A21，H-5 / 页面切片未交付。只读消费分支仍 `3f63273`；④必须由所有者真正集成后登记，不能用生产方 `6ba2a15` 冒充。接口见 [interface-handoff.md](workbench-interaction/interface-handoff.md)。同步 main `072bb12` 的 jobs 壳占位时，协调 v2 T-V2-09#4 的 shell E2E 断言迁移；本 session 不写、不重建、不代 merge v2 树。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
