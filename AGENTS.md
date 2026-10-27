# AGENTS.md — Futures-AI 工作手册

> 本仓库内所有 agent 的上下文入口：先读本文件，再按任务进入对应文档。
> 产品设计与决策的权威在 `docs/`。实现与 docs 冲突时以 docs 为准，并回修代码。

## 0. 这是什么

Futures-AI：给期货交易者的本地化 AI 分析软件（桌面应用）。用户下载安装后指定文档文件夹授权读取；
程序把文档与 agent 生成的知识沉淀为本地知识库；agent（pi 底座）结合用户自选的数据源，每天产出个性化的
可视化图表与日报。v1 从油品（柴油/LPG 等能源品种）垂直切入；架构底座品种无关，后续横向扩展其他品种。

核心循环：用户文档 + 自选数据源 → 本地知识库 + 统一数据层 → pi agent → 个性化图表 + 日报。

## 1. 文档地图

| 文档 | 内容 | 何时读 |
|---|---|---|
| `docs/plan.md` | 总方案：目标、决策记录、文档体系、目录结构、路线图、扩展性设计（app 端/模型/数据源/收费） | 任何任务前先读 |
| `docs/architecture.md` | 产品架构：分层职责、数据底座、知识层、agent 集成、报告管线、授权模块 | 动架构相关代码前必读 |
| `docs/designUI.md` | 全局设计理念：配色系统、图表系统、chart-spec 模型、UI 组件、日报设计 | 动前端/图表/日报样式前必读 |
| `docs/decisions/` | ADR 决策记录（编号、日期、背景、取舍） | 新决策先登记再实现 |
| `specs/<feature>/` | 功能规格目录：spec.md / plan.md / tasks.md / review.md | 开发任何功能时（唯一实施入口） |
| `templates/` | spec-driven 工作流模板（spec/plan/tasks/checklist/review） | 新建功能规格时 |
| `design/` | 从 FTEngine 移植的规范资产（图表/UI 规范原文，逐份搬运） | 图表与 UI 实现细节 |

## 2. 工作流：spec-driven（固定流程，所有功能开发必须遵守）

```
Constitution → Spec → Clarify → 【Gate 1】 → Plan → Checklist → Tasks → Analyze → Implement → Converge → Review → 【Gate 2】 → Handoff
```

**总规则**：每一步开始时重新读取对应文件（AGENTS.md、docs/、`specs/<feature>/` 产物），不依赖会话记忆。

1. **Constitution**：先固化项目原则，明确安全边界、什么该做什么不该做。
   载体：本文件（§3 决策红线、§4 工作约定）+ `docs/`（plan/architecture/designUI）+ `docs/decisions/` ADR。
2. **Spec**：按照 what/why 写 feature 的需求，不写技术方案；每条需求必须能映射到具体的验收规则。
   产物：`specs/<feature>/spec.md`。
3. **Clarify**：AI Agent 追问所有描述不明确的地方和歧义点；能从仓库、文档、既有方案推断的，不问用户；
   将回答融入 spec 中，避免出现模糊不清的情况。产物：更新 `spec.md`（歧义记录表）。

**Gate 1（人工批准，硬闸门）**：Clarify 完成后、Plan 开始前，由用户批准 `spec.md`。批准后 **spec 冻结**；
未批准不得进入 Plan。此后任何需求变更都按第 8 步的变更规则处理。

4. **Plan**：参考技术栈和架构信息，生成来自 spec 规范的设计成果，包括具体的实施细节。
   产物：`specs/<feature>/plan.md`。
5. **Checklist**：生成一个自定义的质量检查清单，包括针对 spec 需求进行的单元测试，以便在工作进行分解前
   确保需求描述完整、清晰且一致。这些自定义检查清单属于审核员所确定的需求质量审查成果；只有当审核员认为
   某项检查标准得到满足时，才会标记该项检查为已通过。虽然某些自定义项已通过检查，但这并不意味着实施工作已经完成。
   **审核员约束**：审核必须是独立会话（新开会话、与实施会话隔离），并使用与实施不同的模型；
   至少配置 2 名审核员（claude-fable-5-1 与 gpt-6.1-sol）并行审核，各自产出勾选结果，
   按共识取通过项；有分歧的项视为未通过并附说明。
   产物：`specs/<feature>/checklist.md`（实施者不勾选）。
6. **Tasks**：把方案拆成 0.5 到 2 小时可完成的任务，每个任务包含上下文、修改范围、完成标准和验证命令。
   **完成标准必须引用 spec 的 AC 编号**（如“满足 AC-001-1”），验证命令与完成标准一一对应。
   产物：`specs/<feature>/tasks.md`。
7. **Analyze**：报告在 spec.md、plan.md 和 tasks.md 之间存在的冲突、差距和模糊之处。该报告是只读的；
   如果发现了问题请进行修复，然后在实施之前重新运行该报告。
8. **Implement**：按照依赖顺序执行 tasks.md 中的任务。在执行之前，会读取检查清单中的复选框状态作为前置条件，
   并在继续之前确认所有检查清单项都已勾选；过程中不会修改任何检查清单文件或标记。可以一次性运行以构建整个系统，
   或者将任务划分为多个阶段来处理大型功能。
   **需求变更规则**：Implement 中途需求发生变化 → 回到 Clarify 重新走流水线（更新 spec → 重新过 Gate 1 →
   更新 plan/tasks），不许直接改 tasks.md 偷跑。
9. **Converge**：对比代码库与规范、计划以及任务列表进行检查。如果发现差距，就在 tasks.md 处添加新的任务，
   然后运行 Implement 工作流再次进行比对，直到报告"已收敛"为止。否则任务完成，可以继续完成评审。
10. **Review**：调用第三方 agent（新开独立会话，与实施会话隔离）参考 **spec.md + plan.md + tasks.md + 实际代码差异**
    （git diff），按 bug、架构风险、测试缺口、目标是否对齐进行评审，禁止只做风格化总结。

**Gate 2（人工批准，硬闸门）**：Review 完成后，由用户确认评审结论（bug 修复 / 风险接受 / 缺口补齐），确认后方可进入 Handoff。

11. **Handoff**：更新 feature 的 review.md，记录完成项、未完成项、风险和下一步任务，并附**验收证据**：
    测试命令输出摘要、Converge 报告结论。然后**提交 PR 并 merge 到 main**；若出现 conflict，先 resolve 冲突
    （涉及实现语义的冲突解决后回到 Analyze/Converge 复查），再完成 merge。

### 功能规格目录约定

```
specs/<feature>/          # 每个功能性 feature 一个独立规格目录（如 desktop-shell）
├── spec.md               # 需求：what/why + 验收规则（不含技术方案）
├── plan.md               # 实施设计：技术方案与细节（Plan 阶段）
├── tasks.md              # 任务分解（0.5–2h/任务，含验证命令）
├── review.md             # 评审与交接记录（Handoff 阶段更新）
└── checklist.md          # 质量检查清单（Checklist 阶段生成，有则必读）
```

### 多 feature 并行

`specs/README.md` 维护一张**状态表**（feature / 状态 / 依赖 / 最近更新）。feature 开始、阻塞、完成时必须更新；
依赖未满足的 feature 不得进入 Plan。

新建 feature 一律从 `templates/` 模板起稿，走完整个工作流。

## 3. 已确认的关键决策（实现不得偏离）

- **技术栈**：Python 后端核心 + Web 前端（Vue 3 + TS + ECharts）+ 桌面外壳（候选见 plan.md §9，未冻结前不写外壳代码）
- **AI 底座**：pi coding agent。Python 侧经 `pi --mode rpc` 子进程驱动；agent 工具经本地 MCP server 暴露
- **数据底座**：声明式数据源适配器 + 描述符派生序列 ID + 溯源/修订/对齐层（见 architecture.md §3）
- **渲染**：ECharts。图表 = 绑定序列 ID 的声明式 chart-spec；v1 固定模板，v2 用户自定义
- **存储**：DuckDB（时序/分析）+ SQLite（元数据）+ LanceDB（向量）+ Parquet；每用户独立数据目录，本地优先
- **知识库**：多层存储与检索（D-009）——embedding 只找文本（bge-m3 + BM25 混合 + reranker 精排），数字与表格走 DuckDB SQL；PDF 解析 MinerU + PaddleOCR
- **v1 范围**：油品垂直（供需、物流、期货市场交易数据三大模块）

## 4. 工作约定

- 所有功能开发必须走 §2 spec-driven 工作流；`specs/<feature>/` 是实施的唯一入口
- 决策先写 ADR（`docs/decisions/`）再改代码；方案变更先改 docs 再动实现
- 用户文档、私有数据、凭证永不入库；`.gitignore` 锚点不得移除
- 凭证只在 `.env` 或用户本地数据目录，代码零 fallback 字面量
- 手改数据必须走事务接口并记台账（继承 FTEngine 审计纪律）
- 环境：Windows 11 + Python 3.14，无 WSL；提交前跑测试
