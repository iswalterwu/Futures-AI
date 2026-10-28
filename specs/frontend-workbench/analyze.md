# frontend-workbench v1 Review 整改 · Analyze

- 日期：2026-10-28。
- 阶段：T-16 实施前的只读一致性分析；只记录结果，不修改冻结 spec / Checklist。
- 输入：重新读取 AGENTS.md、docs 三件套、spec.md、plan.md、tasks.md、checklist.md、review.md；当前分支 `feat/frontend-workbench`，HEAD `0ffa15e`，加本轮已登记的 plan / tasks 文档改动。
- 用户授权：Review 后“继续”，本轮仅关闭 R1-01 与补齐 R1-09 的流程文档；P3 非默认扩改，Gate 2 尚未批准。

## 结论

**无剩余 spec / plan / tasks 冲突、缺失 AC 或任务依赖问题，可进入 T-16 Implement。** R1-01 是已登记的实现 / 契约展示精度缺陷，不新增用户行为；本轮不改 spec，不需要重过 Gate 1。变化量默认精度是 plan 的实现细节，不改变既有“按显示位取整后判零、零中性”的需求。

## 发现与处理

| 项 | 分析 | 处理 |
|---|---|---|
| R1-01 | 价格与百分比变化量共用精度，已由独立 A 认定为 P2；原测试把错误显示固化为期望 | plan §2.1 / §2.7 登记 `deltaDecimals?` 与共享 `figureDeltaDecimals`；T-16 明确修改范围、回归用例、重生成与命令 |
| R1-09 | tasks 仍称草案；TS 5.9.2 未回写 plan §1；没有 Converge 证据 | 文档先补生效状态、原 15 项实施提交、实际 TS 版本；T-17 负责完成后的实测与 Converge |
| 其余 P3 | 首轮只有 P3；多数涉及未来真实 API / agent-runtime / 后续 UX，不应偷偷扩大本轮范围 | tasks 的 P3 台账逐项登记后续归属与 AC；“登记”不等于已修复 / 风险已接受，Gate 2 仍待用户确认 |
| 人工验收 | AC-009-2 允许 Handoff 附图，M-01 ~ M-08 尚未执行 | 保持原人工清单未勾选，不把自动化结果冒充视觉验收 |
| 生成物 | 可选精度字段进入公开契约，不能手改 CONTRACT.md / schema.json | T-16 只改 schema 源与消费代码，执行 `pnpm -C frontend contract`，再只读对拍 |

## 结构核验（实施前、只读 Node 内存脚本）

```text
SPEC_AC       45
PLAN_MISSING  []
TASKS_MISSING []
TASKS         T-01 ~ T-17（17 项）
HOURS         28 = 原 25.5 + T-16 1.5 + T-17 1
DEPENDENCIES  前向引用 []（全部依赖更小编号，无环）
CHECKLIST     70 checked / 0 unchecked（实施者未修改）
POLICY        plan 已登记 figureDeltaDecimals(figure) 与 deltaDecimals?
GIT_DIFF_CHECK 通过（仅仓库既有自动换行提示）
```

原 T-01 ~ T-15 的任务提交号已用 `git log --all --grep='^T-'` 核实。AC 集合来自冻结 spec 的 45 条编号，plan / tasks 展开编号区间后比对均无遗漏；未增加检查器、脚手架或工具流程。

## 后续

T-16：先跑针对真实实现的失败回归，再修复并重生成契约；T-17：全量测试 / 构建后写 Converge 证据，再由独立 A 定向复核。**本 Analyze 不代表实现已完成、已收敛或 Review 已通过。**

## Handoff 合并主线后的只读复查（2026-10-28）

- 执行者：Handoff = claude-opus-5-5 via anthropic（AGENTS §6 Handoff 首选；只读复查，不改冻结 spec / Checklist）。
- 起因：AGENTS §2 第 11 步——合并 `origin/main`（`3bf6476`）时有 5 处内容冲突（`.gitignore`、`AGENTS.md`、`docs/designUI.md`、`docs/plan.md`、`specs/README.md`），其中 designUI / plan 涉及设计语义，解决后回到 Analyze 复查。合并提交 `8920b06`。

| 检查 | 结果 |
|---|---|
| 冻结 spec / Checklist / plan | `git diff b991059 8920b06` 对 `spec.md`、`checklist.md`、`plan.md` 均为空；45 条 AC 与 Checklist 70/70 未动 |
| 代码与规范资产 | `git diff b991059 8920b06 -- frontend design` 为空；合并未改任何实现 |
| 主线权威文件 | `backend/`、`AGENTS.md`、`docs/interaction.md`、`docs/architecture.md`、D-016 ~ D-019、`specs/data-layer`、`specs/settings`、`templates/` 与 `origin/main` 逐字一致（AGENTS §6 模型路由未回退） |
| D-015 | plan §3 预留行换成正式行并记完成；ADR、spec / plan / tasks、designUI §2.2、`design/` 7 个文件均为 D-015；历史评审记录保留 D-013 + 勘误说明——与主线“编号说明”四步一致 |
| designUI 合并结果 | 保留主线 §1 新原则、§2.4 状态与来源、§3 双区 / 作业 / 介入界面、§5.2 块模型、§6 新增组件、§8 新登记规则；保留本分支 §2.1 玻璃边注、§2.2 D-015 作用域、§2.3 / §6 / §8 指向已移植条目；§3.10 加注“v1 为已交付地基，9 项菜单 / 作业轨道等由 v2 与 workbench-interaction 规格承载” |
| v1 spec 与新交互文档的关系 | D-016 / D-018 把菜单改为 9 项并新增作业轨道，与冻结 v1 的 R-002 / R-003 不同；按 D-016“影响”与 plan §9 的批准记录，这由 `frontend-workbench` v2（独立分支，另过 Gate 1）承载，v1 不回改——不构成 v1 的 spec / plan / tasks 冲突 |
| 令牌来源与文档指针 | `tokens.json` 引用的 designUI §2.1 / §2.2 在合并后各唯一存在；§2.3 / §6 / §8 指针仍指向真实条目（`pnpm -C frontend test` 中 AC-008-1 / AC-008-2 通过） |

**结论：无新增冲突、缺口或歧义；不需要新增 v1 实现任务。** Handoff 视觉检查新发现的 H-01 / H-02 是实现外观问题，已登记到 tasks.md「P3 后续台账」，与本次合并无关。
