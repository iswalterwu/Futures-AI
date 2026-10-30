# 2026-10-30 工作区整合与清理：main 参考页

> 本页是 [D-025 ADR](../decisions/20261030-workspace-lifecycle.md) 中“维护记录”链接在 main 上的**参考落地页**，在 D-026 文档的 main 兼容交付中新写（见 [交付记录](20261030-agent-navigation-main.md) §4）。它**不是**原执行日志，不含原清理过程、检查点、备份清单或 feature 验证证据，也不是对这些内容的重新认定。

## 1. 原执行日志溯源

| 项 | 值 |
|---|---|
| 原文件 | workbench `c2e82e6389dafc9ed85158f01f301d98a36fb730` 的 `docs/maintenance/20261030-workspace-consolidation.md` |
| blob / SHA256 | `4d516cbd6f0673ac5a5f12d863a393476924a7ff`；`d9f085cf2a6d7f23594aceff30c4aab4fff0f92e0341362d7628484ad9f1f30d`（Git 中 LF / UTF-8 内容，20,111 字节） |
| 查看方式 | `git show c2e82e6:docs/maintenance/20261030-workspace-consolidation.md`（只读查看；其中的恢复命令只在 workbench 原文语境下适用，本页不复述，也不是恢复指令） |

原日志记录了衍生目录与分支的盘点、备份、整合来源选择、整合后的验证与实际清理结果；这些过程与证据都依附于 workbench 的在研内容，因此留在 workbench。

## 2. 现行政策

工作区规则以 [D-025](../decisions/20261030-workspace-lifecycle.md) 为准，根 [AGENTS.md](../../AGENTS.md) §4 保留其工作约定，并行隔离细则见 [model-routing.md 规则 7](../development/model-routing.md#rule-7)。本页不新增或改变规则。

## 3. 边界

- **治理验收 ≠ 产品验收**：目录整合与清理只是开发协作维护。它不是任何 feature 的 Gate 1 / Gate 2，不代勾 checklist，不签收 H-x，也不表示 workbench 上在研的 desktop-shell、workbench-interaction 或 frontend-workbench v2 已完成或已进入 main。
- main 的源码与 feature 状态不因本页而改变；以本 checkout 的 Git 内容与 [specs/README.md](../../specs/README.md) 为准。
- 不得依据本页或历史 HANDOFF 重建已清理的目录或分支。
