# 2026-10-30 开发文档导航改造（D-026）：main 上的索引与溯源页

> 本页是 main 上的**短索引**，供 [D-026 ADR](../decisions/20261030-agent-navigation.md)、[workflow.md](../development/workflow.md)、[model-routing.md](../development/model-routing.md) 中“维护记录”链接落地。它**不是** workbench 上原维护记录的复制件；原记录（运行过程、验证输出、Handoff 诊断）只在 workbench，溯源见 §2。
> 本次 main 交付的范围、适配与验证计划见 [main 兼容交付记录](20261030-agent-navigation-main.md)。

## 1. 本页性质

- D-026 的决策内容以 ADR 为准；工作流与模型路由的详细规则分别以 workflow.md、model-routing.md 为准。本页不复述、不新增规则。
- 本页只列出证据位置与 Gate 范围，不代表 main 已合入任何 workbench 在研功能。

## 2. 原记录溯源

| 项 | 值 |
|---|---|
| 原维护记录 | workbench `c2e82e6389dafc9ed85158f01f301d98a36fb730` 的 `docs/maintenance/20261030-agent-navigation.md` |
| 原记录 blob / SHA256 | `f4d98e339eac8ee842cd6280a423dd2dbeb09ea8`；`9591ea9118fea729841e42f6962f0a104ac082eaf2df2fadf8a45b0ca87cac56`（Git 中 LF / UTF-8 内容，27,781 字节） |
| 改造基线 | `c93d4ba3e3768e489e7738dbdcb4ef1d883f4aab`（其根 `AGENTS.md` 的 §2 / §5 / §6 与 main `072bb12` 相同） |
| 查看方式 | `git show c2e82e6:docs/maintenance/20261030-agent-navigation.md`（只读查看，不是恢复或重建目录的指令） |

## 3. 条款归属

旧根 `AGENTS.md` 条款到新归属的映射见 [D-026 结论 8](../decisions/20261030-agent-navigation.md) 与 [docs/README.md](../README.md) §1；逐条对照表在 §2 所列原记录的 §3。

## 4. 历史证据位置

- 独立审核原文（逐字节复制自 `c2e82e6`）：[R1 报告](20261030-agent-navigation-review-r1.md)（固定审 `8b880c7`）、[R2 报告](20261030-agent-navigation-review-r2.md)（固定审 `03a1bfe`）。它们是 workbench 改造的历史审核证据，**不是**本次 main 适配的审核结论。
- main 原 `HANDOFF.md` 全文：[存档](20261030-agent-navigation-main-history.md)。
- plan / specs 索引的历史快照只在 workbench，本次未导入 main。

## 5. 导航走查

main 候选上的五类导航走查见 [main 兼容交付记录 §6](20261030-agent-navigation-main.md)。

## 6. 真实路由（摘要）

workbench 改造：文档作者 `claude-opus-5-5 via anthropic`（bridge 限额失败、官方成功），正式任务超时后接续 = `openai/gpt-6.1-sol via openai`；审核员 A = `claude-fable-5-1 via anthropic`（R1、R2 各为新会话、隔离只读）；Gate 2 后 Handoff 记录作者 = `claude-opus-5-5 via anthropic`。逐阶段明细见原记录 §6 / §8.1。本次 main 交付的路由见 [main 兼容交付记录](20261030-agent-navigation-main.md) 页首。

## 7. 评审与 Gate 状态

- A R1（`8b880c7`）：未通过，1 P2、4 P3；补修后由 R2 关闭。
- A R2（`03a1bfe`）：通过，0 P1、0 P2、1 P3（P3-A）。
- 用户原话 **“接受，批准本轮 Gate 2”**：Gate 2 已批准，对象**仅限** A R2 固定审查 `03a1bfe` 的 D-026 导航文档改造，以及 `461a703` 中的审核与验收证据；P3-A 接受为后续任务，**未修复**（所在文件 `specs/frontend-workbench/README.md` 只在 workbench）。这不是任何产品 feature 的 Gate 1 / Gate 2，也不是 workbench 在研代码合入 main 的授权。
- 原 Gate 2 不覆盖本次 main 适配是否只做了兼容性调整；这一点由独立审核员 A 对 main 固定候选另行复核，结果见 [main 兼容交付记录 §7](20261030-agent-navigation-main.md)。

## 8. main 交付

workbench 上的 22 个已批准文件不能原样进入 main（35 个链接目标在 main 上不存在）。用户回复 **“按你说的做”**，授权以 main 兼容的文档子集交付；范围、推迟项与适配见 [main 兼容交付记录](20261030-agent-navigation-main.md)。本页不声称 main 已合并。
