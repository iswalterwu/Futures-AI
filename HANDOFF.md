# HANDOFF — 当前工作区与开发入口（main）

> 本页只记当前工作位置与入口，不是任何 feature 的状态权威，也不是 Gate。文件事实以当前 checkout 的 Git 内容为准；feature 状态以 [specs/README.md](specs/README.md) 为准。
> 本页在 D-026 开发导航文档的 main 兼容交付中改写；改写前的 main 原 HANDOFF（PR #9 交付记录）全文存于 [维护存档](docs/maintenance/20261030-agent-navigation-main-history.md)。旧引用 “HANDOFF §N” 指该存档原文；本页 §8 / §10 保留旧编号作指针。

## 1. 当前工作位置

- 按 [D-025](docs/decisions/20261030-workspace-lifecycle.md)：默认只用 `D:/2030/Futures-AI` 串行工作，常驻本地分支为 `main`（已验收主线）与 `workbench`（在研整合）。必要的临时快照 / worktree 放系统 Temp，用后回收。
- 不要依据历史 HANDOFF 或维护存档中的路径重建已清理的目录或分支；那些只是当时状态。
- 当前 checkout 有哪些代码、规格和文档，以 Git 为准。workbench 上在研的内容（如 desktop-shell、workbench-interaction 的代码与规格）不在 main，不要在 main 上推断其已交付。

## 2. 本次文档交付（D-026 main 兼容子集）

- 内容：开发导航与阅读策略（D-026）及工作区生命周期（D-025）中可独立交付到 main 的文档子集——根入口、[workflow.md](docs/development/workflow.md)、[model-routing.md](docs/development/model-routing.md)、[docs/README.md](docs/README.md)、两份 ADR、模板导航与维护记录。
- 范围、推迟项、适配与验证计划：[main 兼容交付记录](docs/maintenance/20261030-agent-navigation-main.md)。验证与独立审核 A 的结果以该记录为准；在其填写之前，不视为已通过、已合并。
- 本交付**不推进**任何源码或 feature 状态：`specs/**`、代码目录 README、锁文件与配置均未改动。

## 3. 恢复在研 feature

1. 读根 [AGENTS.md](AGENTS.md)，按其 §1 触发读取工作流与模型路由。
2. 查 [specs/README.md](specs/README.md) 状态表与跨 feature 待同步事项，找到目标 feature。
3. 直接读该 feature 的冻结 spec / plan / tasks、有效 checklist 与审核 / 交接记录。
4. feature 不在本 checkout 时，有意切到 `workbench` 分支核对，不在 main 上补建或推断。

## 8. 历史：PR #9 独立 Review 结果与后续线索（保留旧引用编号）

原文见 [维护存档](docs/maintenance/20261030-agent-navigation-main-history.md) 中原 HANDOFF 的 §8。要点：A 对 `f20fdfb` 的 Review 通过（0 个 P1/P2，9 个 P3）；Walter 以“继续”确认 Gate 2，九项 P3 接受为后续 Clarify / 任务线索，**仍未修复**、不扩改冻结 AC。

## 10. 历史：PR #9 Handoff 交付记录与验收证据（保留旧引用编号）

原文见 [维护存档](docs/maintenance/20261030-agent-navigation-main-history.md) 中原 HANDOFF 的 §10（独立集成复核、实际验收证据、未完成项、风险与下一步）。其中的历史批准、风险与后续事项仍然有效；工作树路径与“下一步”指令只反映当时状态。
