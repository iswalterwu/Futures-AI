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
| workbench-interaction | in-progress（**R4-A 已关闭；27/70 完成、43 未开始；全部工作完成后再合 main**） | v1 `43b6d79` + 上游 pin `90187f7`；有效 Checklist R10 `37e2f71`（26/26）；H 组仍待 v2 | 2026-10-29 | Walter 原话“那就先修P2等全部工作完成后，再合入main”已登记为最小修复的 §5.1 批准 `80a1892`，非风险接受 / 提前 Gate 2。修复 `ae592ba`：仅 watch 的 onCleanup 失效检查与 2 组件 + 1 E2E 回归；先红后绿，原例不改。新独立 A [review-batch4-r4a.md](workbench-interaction/review-batch4-r4a.md) 原件 `46e8fbe` 判通过（0 P1/P2、0 新 P3），**R4-A 关闭、R2-C 技术关闭，第四批 5 项 + B04a 技术通过**。A 亲跑 34 文件 **1020** 单元／组件测试、四份 E2E **30**、额外 Chrome 探针 6/6 通过，六守卫 / 类型 / lint / 契约 24/10/2 通过。70 项 / 104.5 h / 235 对，46 AC 最终验收仍 0；旧 P3 保留未风险接受，feature 未收敛。源树状态 `4bc6627`，[Draft PR #12](https://github.com/iswalterwu/Futures-AI/pull/12) 继续 Draft、不 auto-merge；main 未导入，R2-D 同步流程不变。现有 25 棵 worktree 保留复用、不新增 D:/2030 目录；不再等待归档选项确认。H-x ④仍缺；下一批建议 T-C01，先按流水线核任务。恢复见根 HANDOFF.md §16、[implementation-log.md](workbench-interaction/implementation-log.md) §19。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-29 | workbench-interaction 第四批补修 Review `46e8fbe` 通过（有效 Checklist R10 `37e2f71`） | `frontend-workbench` v2 | **R4-A 关闭，H-2·标签① `5c00cf6` 转生产已核**（原 `ebce4c8` 保留追溯），②R10，③A 亲跑 18 / 9 / 21 / 48；H-2·列表公开接口未变，①仍 `af24c82`，旧 27 例通过，详情缓存为内部成员。B01 / B02 / B04 / B04a 已通过批次与补修评审，但 C 组未做，页面切片仍未交付。**④ 消费方集成 SHA 仍全缺**，不能用生产方 `4bc6627` 冒充；消费分支最后只读为 `3f63273`，本 session 不写、不重建、不代 merge。H-1 / H-3 / H-4 历史生产证据保留，H-5 未做、H-6 缺 T-A21。接口见 [interface-handoff.md](workbench-interaction/interface-handoff.md)。main 同步仍按 R2-D 与 v2 T-V2-09#4 协调；用户要求全部工作完成后再合 main。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
