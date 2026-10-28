# AGENTS.md — Futures-AI 工作手册

> 本仓库内所有 agent 的上下文入口：先读本文件，再按任务进入对应文档。
> 产品设计与决策的权威在 `docs/`。实现与 docs 冲突时以 docs 为准，并回修代码。

## 0. 这是什么

Futures-AI：给期货交易者的本地化 **Agent+人 研究工作台**（桌面应用）。用户下载安装后指定文档文件夹授权读取；
程序把外部材料与 agent 产出沉淀为**带溯源的知识底座**；agent（pi 底座）结合用户自选的数据源，以"作业"为单位
人机共同交付：数据提取 → 数据处理 → 分析延申 → 交付物；交付物生成验证性需求驱动下一轮采集；另设格物致知区支持
复盘与认知强化。人可在任意阶段介入但不干扰自动化，介入痕迹沉淀为分析协议。v1 从油品（柴油/LPG 等能源品种）
垂直切入；架构底座品种无关，后续横向扩展其他品种。

核心循环（双循环）：交付循环（提取 → 处理 → 分析 → 交付 → 验证性需求 → 新作业）+ 学习循环（用户发起 →
阅读/复盘/深挖 → 认知产物 → 回流）；两者共享知识底座与分析协议。交互与协作模型权威见 `docs/interaction.md`。

## 1. 文档地图

| 文档 | 内容 | 何时读 |
|---|---|---|
| `docs/plan.md` | 总方案：目标、决策记录、文档体系、目录结构、路线图、扩展性设计（app 端/模型/数据源/收费） | 任何任务前先读 |
| `docs/architecture.md` | 产品架构：分层职责、数据底座、知识层（写入闸门/断言台账）、agent 集成、交付管线、授权模块 | 动架构相关代码前必读 |
| `docs/interaction.md` | 交互架构：双循环、作业与四阶段契约、介入机制、验证性需求、知识回流规则、学习循环与分析协议 | 动交互/工作流/交付物/知识回流/学习相关设计前必读 |
| `docs/designUI.md` | 全局设计理念：配色系统、图表系统、chart-spec 模型、交付物块模型、UI 组件、界面形态 | 动前端/图表/交付物/学习界面样式前必读 |
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
   载体：本文件（§3 决策红线、§4 工作约定）+ `docs/`（plan/architecture/interaction/designUI）+ `docs/decisions/` ADR。
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
   **审核员**：**A**，独立会话（新开会话、与实施隔离、与实施不同模型）；其结论即为审核结论（单审，
   不再要求第二名审核员、不做共识投票）。A 的模型与回退顺序、Claude 接入通道规则见 **§6 模型路由规范**
   （默认 `claude-fable-5-1`，先 `claude-bridge` 后 `anthropic`）。每轮在产物头部记录实际模型与通道
   （如 `A = claude-fable-5-1 via anthropic`）及切换原因。
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
10. **Review**：由**审核员 A**（新开独立会话，与实施隔离，模型按 §6）参考 **spec.md + plan.md + tasks.md + 实际代码差异**
    （git diff）评审，按 bug、架构风险、测试缺口、目标是否对齐出结论，禁止只做风格化总结。
    判定规则：存在 P1/P2 = 未通过；仅 P3 或无发现 = 通过（P3 可接受为后续任务）。

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

- **技术栈**：Python 后端核心 + Web 前端（Vue 3 + TS + ECharts）+ 桌面外壳 Electron（D-007）
- **交互架构**：交付+学习双循环，以"作业"为一等对象、四阶段契约与旁路介入、交付物块模型与验证性需求；对话是接口之一（D-016，权威 `docs/interaction.md`）
- **知识回流**：写入闸门 L0–L5、断言台账、派生内容隔离与晋升、防自引用；去重 = 归并 + 加边（D-017，见 `interaction.md` §5、`architecture.md` §4.7）；派生内容可引用但标"内部生成"+ 根来源索引、不计独立证据（D-018）
- **定稿**：交付物由用户显式定稿（取代"发布"一词）后才冻结、晋升、回流、派生验证性需求、蒸馏；不自动定稿、不可撤销（D-018，权威 `interaction.md` §3.5）
- **网页剪藏**：URL / 粘贴 → 正文 → 零工具剪藏员模型清理 → 数字守恒校验 → frontmatter `.md` 落 `clips/`（D-018）
- **格物致知**：学习循环的产品区 / 菜单名；概念词"学习循环"与目录 `learning/`、路由 `/learning` 不改（D-018）
- **多 agent 编排**：编排在代码里（作业引擎固定 DAG）、智能在节点里（角色定义文件 + 工具子集 + fast/standard/strong 三档）；复核员异模型、升档最多一次、v1 不设编排者 agent（D-019，`architecture.md` §5.5）。这是**产品运行时**的编排，与 §6 的开发工作流模型路由无关
- **AI 底座**：pi coding agent。Python 侧经 `pi --mode rpc` 子进程驱动；agent 工具经本地 MCP server 暴露
- **数据底座**：声明式数据源适配器 + 描述符派生序列 ID + 溯源/修订/对齐层（见 architecture.md §3）
- **渲染**：ECharts。图表 = 绑定序列 ID 的声明式 chart-spec；v1 固定模板，v2 用户自定义
- **存储**：DuckDB（时序/分析）+ SQLite（元数据）+ LanceDB（向量）+ Parquet；每用户独立数据目录，本地优先
- **知识库**：多层存储与检索（D-009）——embedding 只找文本（bge-m3 + BM25 混合 + reranker 精排），数字与表格走 DuckDB SQL；PDF 解析 MinerU + PaddleOCR
- **v1 范围**：油品垂直（供需、物流、期货市场交易数据三大模块）

## 4. 工作约定

- 所有功能开发必须走 §2 spec-driven 工作流；`specs/<feature>/` 是实施的唯一入口
- 决策先写 ADR（`docs/decisions/`）再改代码；方案变更先改 docs 再动实现
- 交互/工作流/交付物/知识回流变更先改 `docs/interaction.md`（+ ADR），再动 frontend/backend；界面细则以 `docs/designUI.md` 为准
- 用户文档、私有数据、凭证永不入库；`.gitignore` 锚点不得移除
- 凭证只在 `.env` 或用户本地数据目录，代码零 fallback 字面量
- 手改数据必须走事务接口并记台账（继承 FTEngine 审计纪律）
- 环境：Windows 11 + Python 3.14，无 WSL；提交前跑测试

## 5. 工程准则（贯穿每个阶段，与 §2 同等强制）

1. **不为猜测的竞态/安全边界加复杂度**。只有能说清"具体怎么出错、发生概率多大、要写多少代码"的才做；
   必须先报给 Walter 并得到同意，不许悄悄扩大改动范围。
2. **外部数据只在入口层校验**：用户输入、外部 API、网络响应在边界处校验一次并转成确定类型，
   往里传已确定类型的值；内部不重复做防御性检查。
3. **不提前抽只用一次的函数**。只有会复用、封装了确实复杂的逻辑、或它代表一个能起清楚名字的概念时才抽。
4. **主函数只写正常流程**，校验与细节放到它下面的小函数里。
5. **自动生成的文件不手改**，改源头后重新生成。
6. **测试测真实实现**，不要把业务逻辑抄一份进测试，尽量少用 mock（优先真实实现或在系统边界注入）。
7. **按仓库现有流程走**，不引入仓库没在用的工具或流程。

## 6. 模型路由规范（本仓库开发工作流；Walter 2026-10-28 裁定）

适用于为本仓库开启的每个 pi 会话（`--model <provider>/<model>`）。按 §2 的工作流阶段选模型；首选不可用时按顺序回退。

| 工作流阶段 | 首选 | 回退 1 | 回退 2 |
|---|---|---|---|
| 计划与分析类：Constitution / Spec / Clarify / Plan / Tasks / Analyze / Converge / Handoff（含文档与 ADR 撰写） | `claude-opus-5-5` | `openai/gpt-6.1-sol` | `deepseek/deepseek-flash` |
| Implement（实施：写代码、跑测试、修 bug） | `openai/gpt-6-astra` | `deepseek/deepseek-flash` | — |
| 审核员 A：Checklist / Review | `claude-fable-5-1` | `claude-opus-5-5` | `openai/gpt-6.1-sol` |

规则：

1. **回退触发** = 没有用量（额度耗尽 / 限流持续）或出现错误（鉴权失败、launcher 异常、同一请求连续失败）；不因"觉得慢"回退。回退后该阶段余下工作可留在回退模型上，下一阶段重新从首选开始。
2. **Claude 接入通道**：所有 Claude 模型先测 `claude-bridge` 链路（`--model claude-bridge/<model>`），不成功才走官方 API key 链路（`--model anthropic/<model>`）。换通道不是换模型，不改变阶段 / 审核员身份；通道都不通才按上表回退到下一个模型。
3. **审核员独立性**：A 必须是新开会话、与实施隔离、与实施模型不同；回退后仍须满足（表中 A 的任一候选都不与 Implement 候选重合）。
4. **记录**：每个阶段产物头部记实际模型与通道及切换原因（如 `Plan = claude-opus-5-5 via claude-bridge`、`A = claude-opus-5-5 via anthropic（fable 额度耗尽）`）；派工 / 回退在 `specs/<feature>/review.md`（前期可用 `plan.md`）简记角色、任务、基线提交、实际 provider/model、失败类别；只记脱敏摘要，不记 API key、token 或完整鉴权报错。
5. **探活与不重试**：首次使用某 Claude 模型前先做一次最小真实调用测 bridge 链路（模型在列表中可见不等于可调用）；已明确限额耗尽的通道在当前限额窗口内不反复重试，新会话或窗口重置后再测。不得擅自改用户的 provider、路由、API key 或全局 pi 配置。
6. **只有调用失败才回退**：测试变红、Analyze 发现差距、Review 判未通过都是正常任务结果，不是换模型找"通过"的理由。所有候选都不可用 → 标 blocked 并报告，不跳过审核、不伪称完成。回退不取消 Gate 1 / Gate 2、checklist 前置条件与 §5 工程准则。
7. **会话与工作树**：每个并行写入的 agent 用独立 git worktree / 分支，明确文件所有权、任务范围、AC、验证命令与基线提交；不共享可写目录、不同时改同一文件、不在别的 feature 分支上提交 / reset / 强推；共享文件由指定集成人串行合并；审核会话只读审查固定提交与真实 diff，除勾选 checklist 外不替实施者改代码。
8. 本节只管本仓库的开发工作流；产品运行时的角色与模型三档是另一回事（D-019，`architecture.md` §5.5）。
