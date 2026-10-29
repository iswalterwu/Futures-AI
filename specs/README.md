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
| frontend-workbench | done（v1；H-01 修复） | 无（与后端唯一接口为 R-007 契约） | 2026-10-28 | v1 已经 [PR #7](https://github.com/iswalterwu/Futures-AI/pull/7) 合并到 main（`43b6d79`），Gate 2 已确认（11 项 P3 接受为后续、未修复、未扩改），证据见 [review.md §9](frontend-workbench/review.md#9-handoff-记录2026-10-28)。**H-01 修复**（T-18）：独立 A 通过（[review-h01.md](frontend-workbench/review-h01.md)），Walter 2026-10-28 Gate 2 已批准，经 [iswalterwu/Futures-AI#8](https://github.com/iswalterwu/Futures-AI/pull/8) Handoff（[review.md §13 ~ §14](frontend-workbench/review.md)）；A-H01-P3-1（1440 整图补采）接受为后续、未补采。待办：Walter 人工复核 M-01 ~ M-08（8 项未勾）；H-02 留待 v2、未修复。v2 在独立规格分支推进，不属 v1。 |
| workbench-interaction | in-progress（Implement：首批 10 / 66 已完成并经批次 Review；第二批派工准备、待实施；feature 未收敛） | v1 Handoff `43b6d79` + 上游同步 `90187f7`；Checklist R7 `9acf3de` 通过；H 组仍待 frontend-workbench v2 | 2026-10-29 | spec v1.1 冻结、46 AC；66 项 / 101.5 h。Walter 回复“允许”授权代码实施及协调会话 `01a18388` 担任集成人（既有 tasks 范围内持续有效）。授权规格种子 `8753fa9`（源 `1ad7963`）。**首批 T-A01～T-A09、T-A09a 已完成**（openai/gpt-6-astra；代码 `8753fa9..13a3373`，12 提交）；Converge `b0b065f`（[converge-batch-a09a.md](workbench-interaction/converge-batch-a09a.md)）本批收口；独立 A（claude-fable-5-1 via anthropic）[review-batch-a09a.md](workbench-interaction/review-batch-a09a.md)（`af95b66`）**本批通过：0 P1 / P2、6 P3（R-A～R-F，未经风险接受，后续定位见 implementation-log §8）**，A 亲跑全量单测 21 文件 722 / 0 fail 等。“已完成”≠ AC 验收：**46 AC 最终验收 0**，其余 **56 项未开始**，feature **未收敛（尚未实施 + H 组外部阻塞）**；**第二批 T-A10 / T-A22 / T-A22b / T-A23 / T-A24 派工准备完成（r6.3 精度 + Analyze R9），待实施**：R-B 定案为 T-A10 fixture-only 校正，R-D 不加 refine（按构造保持），H-4 增生产路由绑定入口 `bindRouter`，T-A23 不导入 shared Badge；T-A22b / T-A23 建议先经 A 限定范围定向复核。H-1 生产方具备 ①②③（③ 含 A 亲跑）、④ 消费方集成 SHA 未取得（未交付），其余 H-x 未交付。非全 feature Review / Gate 2 / Handoff。进度与证据见 [implementation-log.md](workbench-interaction/implementation-log.md)。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | workbench-interaction r6.1（Checklist R7 `9acf3de`，规格来源 `1ad7963`；2026-10-29 首批实施与批次 Review 后更新） | `frontend-workbench` v2 | 生产方接口设计、公开名称与尚未完成的接收确认见 [interface-handoff.md](workbench-interaction/interface-handoff.md) §3 / §5。**H-1** 生产方已具备 ① `13a3373` + ② R7 `9acf3de` + ③ 定向测试摘要（实施者执行，另经首批独立 Review A 亲跑同数通过，`af95b66`），待 v2 消费方集成（**未交付**）；其余 H-x 未交付。④ 消费方集成 SHA 必须由 `integration/frontend-workbench-v2` 的所有者真正集成后登记，不能用本 feature 集成树冒充，不代写壳文件。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |
| 2026-10-28 | D-024（协议冷启动） | `playbook-bootstrap`（待起 spec，Phase 1） | 依赖知识库 v1 摄取管线 + 透明页最小版；历史产出摄取与可跳过 / 重做访谈 → bootstrap proposed，经透明页确认、不自动 active；待按模板起 spec，本表不代表已开始实施 |
| 2026-10-28 | D-022 / D-023（自主度与主体） | `settings`（后续版本） | 后续 spec 修订承载自主度档位、每日 / 每台预算与主体模型绑定；建议默认 A1，具体档位名与默认档仍由 settings spec 确认；不追加当前版本 AC |
| 2026-10-28 | D-020（结果校准） | 后续交付物 / 验证队列 feature（待起 spec） | 承载观点 / call / 决策三类新块及回链；`workbench-interaction` 冻结 spec 不加 AC，按后续 feature 流程承接 |
| 2026-10-28 | D-022（晨间议程 / 日报导出） | `frontend-workbench` v2（沿用既有 Gate 状态，待核实） | “日报”入口将承载议程与导出，九项菜单不变；是否改名留 v2 Clarify；Phase 2B 焦点带目标不追加冻结 spec 义务，按既有 Gate 状态走变更流程，本轮设计批准不替代其 Gate 1 / Gate 2 |

以上仅为跨 feature 导航待办，不修改冻结 spec / AC，不新建 spec 目录，不表示功能已实现；其他工作树的 Gate 状态由对应负责人核实。
完成后删除对应行。
