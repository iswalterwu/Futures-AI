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
| workbench-interaction | in-progress（第二批独立代码 Review **通过** `f72a1a1`（0 P1 / P2、5 P3 R2-A～R2-E 未修、未经风险接受）；**16 / 67 已完成**、**51 未开始**；46 AC 最终验收 **0**；feature 未收敛） | v1 Handoff `43b6d79` + 上游 pin `90187f7`；Checklist R7 `9acf3de`（r6 设计）→ R8 `7b91a2c` 未通过（B-12）→ **R8.1 `34d339e` 通过（当前有效，26 / 26）**；H 组仍待 frontend-workbench v2 | 2026-10-29 | **第三批派工准备 r6.6（T-A11 → T-A12 → T-A13 → T-A22a，约 7 h）：开码前精度已补、全部待实施**（plan / tasks【r6.6】，[analyze.md](workbench-interaction/analyze.md)「Analyze R12」；结构不变，唯一改字的完成标准 = T-A11 标准 1 的持久化白名单补列既有 `quarantineReason`，连同内部 `mappingHistory` 提请第三批独立 Review 核对；Checklist R8.1 未改；继续 pin `90187f7`，main `072bb12` 不自动同步）。spec v1.1 冻结、46 AC；67 项 / 约 102 h（标准 / 命令 224 / 224）。Walter 回复“允许”授权代码实施及协调会话 `01a18388` 担任集成人（既有 tasks 范围内持续有效，后续批次不重复请求；不跳过逐批 Review / Gate 2）。授权规格种子 `8753fa9`（源 `1ad7963`）。**首批 T-A01～T-A09、T-A09a 已完成**（openai/gpt-6-astra；代码 `8753fa9..13a3373`；Converge `b0b065f`；独立 A [review-batch-a09a.md](workbench-interaction/review-batch-a09a.md)（`af95b66`）本批通过：0 P1 / P2、6 P3 R-A～R-F）。**第二批 T-A09b / T-A10 / T-A22 / T-A22b / T-A23 / T-A24 已完成**（openai/gpt-6-astra；代码 `34d339e..27e59e6`，6 提交；生产方集成树已含 `f72a1a1`，旁证）：Converge [converge-batch2.md](workbench-interaction/converge-batch2.md)（`858025d`）判本批收口；独立 A（claude-fable-5-1 via anthropic）[review-batch2.md](workbench-interaction/review-batch2.md)（`f72a1a1`）**本批通过**，亲跑全量单测 27 files / 833 / 0 fail、v1 三契约 88、本批 21 命令、shell + agent E2E 24、`contract --check` 15 / 10 / 2、六守卫 / typecheck / lint 均过（未跑其余 7 份 E2E、无人工截图）。R-B 部分落实（done 阶段 draft 不自动审批）、S-37 已落实、R-A 待 T-A16 / T-A19 前定案、R-D 未加 guard；R2-A → T-G06、R2-B → T-A11 / T-A18、R2-C → 首个消费徽标页面或 T-G10 前、R2-D → 同步 `072bb12` 时按 tasks §7、R2-E → plan §2.4 一句精度已登记。“已完成”= 批次 Review 通过 ≠ AC 验收。H-2·标签 / H-3·路由切片 / H-4 / H-1 生产方 ①②③ 齐（③ 含 A 亲跑），④ 消费方集成 SHA 均未取得（`integration/frontend-workbench-v2` = `3f63273` 不含），均未交付；其余 H-x 未交付。上游 main `072bb12`（v2 S0）不在本批祖先，集成人决定本批不自动同步；同步前须按 tasks §7 重核 / Analyze / A 定向复核。下一可起步 T-A11（第三批 T-A11 → T-A12 → T-A13 → T-A22a，完成后预计 20 / 67，未预写）。非全 feature Review / Gate 2 / Handoff。进度与证据见 [implementation-log.md](workbench-interaction/implementation-log.md)。 |

状态取值：`in-progress` / `blocked` / `done`。feature 开始、阻塞、完成时必须更新本表；
依赖未满足的 feature 不得进入 Plan。

## 跨 feature 待同步事项

| 日期 | 来源 | 影响 feature | 要做什么 |
|---|---|---|---|
| 2026-10-28 | workbench-interaction r6.1（Checklist R7 `9acf3de`，规格来源 `1ad7963`；2026-10-29 首批 / 第二批实施及第二批 Review `f72a1a1` 后更新，当前有效 Checklist R8.1 `34d339e`） | `frontend-workbench` v2 | 生产方接口设计、公开名称与尚未完成的接收确认见 [interface-handoff.md](workbench-interaction/interface-handoff.md) §3 / §5。**H-1** 生产方已具备 ① `13a3373` + ② R7 `9acf3de`（当时有效）+ ③ 定向测试摘要（另经首批 A 亲跑，`af95b66`）；**H-2·标签**（① `ebce4c8`）/ **H-3·路由切片**（① `cc59e94`，页面为骨架）/ **H-4**（① `b38cf43`，公开设置方式 = 无）生产方具备 ① + ② R8.1 `34d339e` + ③ 定向测试摘要（实施者执行，**第二批独立 Review A 亲跑同数通过**，`f72a1a1`）；以上均待 v2 消费方集成（**未交付**；只读核对 `integration/frontend-workbench-v2` = `3f63273` 不含四个 ①）；H-2·列表、H-5、H-6、页面切片未交付。④ 消费方集成 SHA 必须由 `integration/frontend-workbench-v2` 的所有者真正集成后登记，不能用本 feature 集成树冒充，不代写壳文件。main `072bb12` 的 `jobs` 壳占位 / shell E2E `/jobs` owner 断言与 H-3 同名替换的同步时点（v2 T-V2-09#4）待集成人与 v2 所有者协调（interface-handoff §5-9；review-batch2 R2-D）。 |
| 2026-10-28 | D-018 | `frontend-workbench` v2（Gate 1 待批） | R-002 / AC-002-2 / Q-023 菜单第七项"学习"→"格物致知"（路由 `/learning` 不改），在 Gate 1 前改入 |
| 2026-10-28 | D-019（多 agent 编排、模型三档） | `settings`（后续版本） | 新增模型三档配置需求，另起 spec 修订 |
| 2026-10-28 | D-024（协议冷启动） | `playbook-bootstrap`（待起 spec，Phase 1） | 依赖知识库 v1 摄取管线 + 透明页最小版；历史产出摄取与可跳过 / 重做访谈 → bootstrap proposed，经透明页确认、不自动 active；待按模板起 spec，本表不代表已开始实施 |
| 2026-10-28 | D-022 / D-023（自主度与主体） | `settings`（后续版本） | 后续 spec 修订承载自主度档位、每日 / 每台预算与主体模型绑定；建议默认 A1，具体档位名与默认档仍由 settings spec 确认；不追加当前版本 AC |
| 2026-10-28 | D-020（结果校准） | 后续交付物 / 验证队列 feature（待起 spec） | 承载观点 / call / 决策三类新块及回链；`workbench-interaction` 冻结 spec 不加 AC，按后续 feature 流程承接 |
| 2026-10-28 | D-022（晨间议程 / 日报导出） | `frontend-workbench` v2（沿用既有 Gate 状态，待核实） | “日报”入口将承载议程与导出，九项菜单不变；是否改名留 v2 Clarify；Phase 2B 焦点带目标不追加冻结 spec 义务，按既有 Gate 状态走变更流程，本轮设计批准不替代其 Gate 1 / Gate 2 |

以上仅为跨 feature 导航待办，不修改冻结 spec / AC，不新建 spec 目录，不表示功能已实现；其他工作树的 Gate 状态由对应负责人核实。
完成后删除对应行。
