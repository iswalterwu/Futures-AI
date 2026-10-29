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
| workbench-interaction | in-progress（**第五批采集台 + R5-A 补修通过；37/74 完成、37 未开始；未收敛**） | v1 `43b6d79` + 上游 pin `90187f7`；有效 Checklist **R11 `1f99f80`**（26/26）；H 组仍待 v2 | 2026-10-30 | 第五批 9 项代码 `e609c2e` 经独立 A [review-batch5.md](workbench-interaction/review-batch5.md) `fe9c2c9` 通过（0 P1/P2、5 P3），**R3-B 技术关闭**。普通流程补修 `f63ef7c` 仅在成功回执同步 previewTarget，避免删旧来源误清新映射；独立 A [review-batch5-r5a.md](workbench-interaction/review-batch5-r5a.md) `2c0d09d` 通过（0 P1/P2、0 新 P3），**R5-A 技术关闭**。A 亲跑 **39 文件 1130 单元／组件测试、12 文件 79 E2E 全过**，六守卫 / typecheck / lint / 契约25/10/2通过。74 项 / 107.5 h / 248 对；46 AC 最终验收0。R5-B/C慢速草稿与回执上下文风险为P3，新增防护须先Walter §5.1批准，未修、未风险接受；其它P3见日志。H-5/页面切片①生产已核f63、②R11、③A实测，但④全缺仍未交付；D–F仍占位、H-6缺A21。源树状态 `7468a52`，[Draft PR #12](https://github.com/iswalterwu/Futures-AI/pull/12) 保持Draft，不auto-merge、不处理main冲突。25工作树保留复用，无新D:/2030目录；全部完成并经最终Review/Gate2后才main。下一入口A14/A15/A16（先R-A）或G04（先R3-C）。恢复见根HANDOFF.md §17、[implementation-log.md](workbench-interaction/implementation-log.md) §26。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-30 | workbench-interaction 第五批及R5-A Review通过（`fe9c2c9` / `2c0d09d`；有效R11 `1f99f80`） | `frontend-workbench` v2 | **H-5与页面切片①更新生产已核 `f63ef7c`**（完整采集流程与映射补修），②R11，③A亲跑H-5定向8、采集E2E4+补修1、全部E2E79；旧 `e609c2e` 保留追溯。H-2标签 `5c00cf6` / 列表 `af24c82`、H-1/H-3/H-4历史生产证据不变。**④消费方集成SHA仍全缺，全部未交付**，不可用生产方 `7468a52` 代填；消费分支最后只读 `3f63273`，本session不写、不重建、不代merge。H-6缺A21；process/analyze/deliver仍占位。公开组件/API与证据见 [interface-handoff.md](workbench-interaction/interface-handoff.md)。main同步按R2-D并协调v2 T-V2-09#4；用户要求全部完成后才合main，当前PR12仍Draft。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |

完成后删除对应行。
