# workbench-interaction — Checklist 审阅包

> 2026-10-28，实施接手者整理；**不是审核结论，不代替 checklist.md，不授权 Tasks / Implement**。
> 指定审核员仅 A = `claude-fable-5-1`，必须新开独立会话，与实施模型隔离（AGENTS.md §2）。
> 本文件是审阅输入导航，不复制需求；需求以冻结 `spec.md` 为准，设计以 `plan.md` 为准。

## 1. 基线与阶段

- 稳定审阅仓库：`D:/2030/Futures-AI-interaction`，分支 `spec/workbench-interaction`。所有后续审核从此 worktree 启动，不再使用并行会话共享的 `D:/2030/Futures-AI`。
- 冻结 spec：`cfb6c66`，Walter 2026-10-28 Gate 1 批准；9 条需求、46 条 AC；Q-001～Q-012 已裁定。
- 首轮 Plan 基线：`d52e784`；首轮 A 报告已原样归档到 `1d6b54c`，结论未通过、B-01～B-08 全为设计补全。**本次 R2 复核修正后的 plan.md**，以启动提示登记的提交 SHA 为准，比较 `git diff d52e784 -- specs/workbench-interaction/plan.md`。
- 首轮期间其他会话把共享目录切到 `feat/desktop-shell`；A 已自行用 git show 核对冻结 spec/Plan 与原基线一致后完成首轮，故保留其正式发现，不把它误记为中断。误启动的重复 R1b 已停止、无产物/无结论，不计审核轮次。后续所有工作只在本隔离路径进行。
- 阶段：**Plan 补正 → Checklist R2**。尚无本 feature 的 `tasks.md`；不得因 Tasks 尚未生成而要求倒置流程，也不得把未来 Tasks / Analyze / 测试执行视为已通过。
- 前端地基：`D:/2030/Futures-AI-frontend`，`feat/frontend-workbench`，基线 `fdaa7d8`（T-01～T-08 部分地基已落地；后续任务仍在实施）。只读参考，不得修改。
- frontend-workbench v2：隔离草稿分支 `spec/frontend-workbench-v2`，worktree `D:/2030/Futures-AI-workbench-v2`；**未经 Gate 1 批准**，不得将其建议当作已交付依赖。
- 其他会话在原共享目录继续 desktop-shell / backend；本 worktree 不包含那些未提交实现。**不修改其他 feature 文件，不切换分支、不 merge，不安装依赖**。

## 2. 必须重新读取的文件

依次完整读取（大文件需分段读完）：

1. 当前仓库 `AGENTS.md`、`docs/plan.md`。
2. `docs/interaction.md`（尤其 §3.2 阶段契约、§3.3 R1–R6、§3.4 介入、§3.5 版本发布、§7 界面映射）。
3. `docs/designUI.md`（尤其 §2.4、§3、§5.2、§7）、`docs/architecture.md`（契约边界）。
4. `docs/decisions/20261028-dual-loop-interaction.md`（D-016）、`20261028-knowledge-write-gate.md`（D-017，仅边界）、`20261026-ui-visual-system.md`（D-011）。D-015 在前端分支为涨跌作用域 ADR，与主线 D-013 不同，禁止混淆。
5. `specs/workbench-interaction/spec.md`、`plan.md`、`templates/checklist.md`。
6. 前端基线 `D:/2030/Futures-AI-frontend/specs/frontend-workbench/{spec,plan,tasks,checklist}.md`，以及按需读取其真实 `frontend/src/contracts/`、`src/agent/events.ts`、`scripts/contract-build.mjs`、`src/app/`。这里的历史 Checklist 只覆盖 v1，不能继承为本 feature 或 v2 的通过证据。

前端分支尚未合入 D-016 / D-017 文档。交互权威以**当前仓库**已批准的 docs 为准；前端分支提供现有代码和 v1 基线，不能用其旧八项导航否定已批准 D-016。

只读 diff 建议：

```bash
git show cfb6c66 -- specs/workbench-interaction/spec.md
git show d52e784 -- specs/workbench-interaction/plan.md specs/README.md
git -C D:/2030/Futures-AI-frontend log -6 --oneline
```

## 3. AC 索引（仅导航，原文不在此重复）

| 需求 | AC 范围 | 数量 | 重点验证面 |
|---|---|---:|---|
| R-001 作业对象 | AC-001-1～AC-001-5 | 5 | 列表、筛选、创建、三态、状态映射 |
| R-002 阶段轨道 | AC-002-1～AC-002-5 | 5 | 顺序、路由/刷新、待确认、重跑、失败/取消 |
| R-003 采集台 | AC-003-1～AC-003-6 | 6 | 全局入口、三种投放、来源说明、预览确认、归属、状态 |
| R-004 处理台 | AC-004-1～AC-004-5 | 5 | 配方/溯源、参数事件、对账 diff、暂定、三态 |
| R-005 分析台 | AC-005-1～AC-005-6 | 6 | 结论/证据、五类介入、候选规则、对话上下文、冲突 |
| R-006 交付台 | AC-006-1～AC-006-8 | 8 | 六类块、编辑、批注、历史/diff、改稿、发布、徽标 |
| R-007 不干扰 | AC-007-1～AC-007-5 | 5 | 事件字段/筛选、检查点、非模态/破坏性确认、角标、玻璃 |
| R-008 契约 | AC-008-1～AC-008-4 | 4 | 生成物、场景、网络边界、版本 |
| R-009 验收 | AC-009-1～AC-009-2 | 2 | 一条命令、人工清单/截图 |
| **合计** | | **46** | 不以 Plan 有 46 行映射代替设计闭环检查 |

## 4. 重点复核（不是预设结论）

请独立判断，发现阻断时给出文件 + 行号、受影响 AC、最小关闭要求，并区分设计补全与需求变更：

- **前置依赖与职责**：前端地基尚在实施、v2 待 Gate 1；Plan 中“直达路由可验收”和 AC-003-1 全局入口的整体验收边界是否清楚；壳与作业页面共享文件的唯一所有者及接线时机是否明确。
- **契约闭环**：§2.4 列出的方法是否实际覆盖五类分析介入、候选规则、块批注回复/解决、事件读取、删除/取消、角标清除、重跑/合并结果等已写入 spec 的行为。不要把“组件存在”视为存在可替换的契约写路径。
- **事件与状态闭环**：运行中人的修改是否真实保留旁路语义；检查点合并是否有确定驱动；未运行时的参数修正如何完成；失败/中止、冲突、发布只读、历史版本保留是否一致。不能用“等人确认才继续”替代旁路。
- **场景定义**：normal / empty / error / slow、运行中、待人工确认、待合并、冲突、已交付的样例与时间驱动是否足以稳定验证 AC，是否避免同一作业同时用互斥状态表达所有情景。
- **版本与发布**：人的改动和 agent 改动都产生 revision；接受/回退、批注状态、快照不可变、发布检查点与冲突处理的设计是否闭环。
- **隐私与本地持久化**：投放 File / URL / 文本在 mock 下读取与保存的范围是否自洽；是否误把用户私有文档写入 fixture 或快照；损坏/超限后的用户提示是否有落点。
- **视觉与工程纪律**：现有令牌、来源/状态文案、派生标记、≤3 玻璃层、网络只在契约边界；不引入猜测性复杂度、不重复边界校验、不手改生成物、不用测试复制业务实现。
- **测试设计**：逐条 AC 的正向/负向测试形态与最小输入；静态守卫是否确实覆盖 AC 声称的属性，而非只写“沿用”；Handoff 截图属未来验收，不可现在声称已有。

## 5. R2 定向复核导航（实施侧说明，不是关闭结论）

| 首轮项 | 本次设计补全落点 |
|---|---|
| B-01 | §2.4 新方法、动作→方法→kind→payload 表，分析/规则/批注/删除/取消/改稿等写路径 |
| B-02 | §2.4 场景×读写/持久化表、样例×状态表；删除 jobScript，沿既有 send 脚本/runId 驱动 |
| B-03 | §4 rerunStage 迁移表、运行中请求排队；有 run 的检查点与无 run 的 mergePending 两条路径 |
| B-04 | §2.4 字段/标签映射/线程/revision/chart-spec/来源说明与状态/命名对照；schema 注册表 |
| B-05 | §4 回退新版本、保留非目标块改动、冲突选版、发布未决项拒绝、领域只读与快照不可变 |
| B-06 | §1.1 明确 v1 Handoff SHA 为实现前置、唯一文件修改者、jobs/routes + main 注册和外部阻塞 AC；v2 草稿 §4 同步所有权 |
| B-07 | §3 持久化白名单、原文只在内存、512KiB/异常/损坏后的非模态横幅与保留旧 key、唯一显式重置 |
| B-08 | §2.3/§2.4 inbox 生成/去重/已读规则、计数契约、列表/阶段轨道与首页轨道责任区分 |

S-01～S-10 也在 Plan 中处理（bootstrap 版本不假兼容、去轮询、徽标组件守卫、列表排序、投放状态、schema 注册、手写 diff 期望、人工清单主题、外部阻塞）。请逐条独立核实并检查修复是否引入新矛盾，不能按此表直接勾选。首轮已勾选项若回退应重新打开；Tasks / Analyze 尚未发生仍只记录阶段状态。

## 6. 审核输出要求

**允许写入的唯一仓库文件**：`D:/2030/Futures-AI-interaction/specs/workbench-interaction/checklist.md`。其他文件均只读。

- 以 `templates/checklist.md` 起稿，按本 feature 定制；由 A 自己生成/勾选，实施者不修改勾选。
- 头部记录审核员、实际通道与切换原因、独立新会话、冻结 spec / plan 基线、审查范围和未执行项。
- 本轮指定通道：`A = claude-fable-5-1 via anthropic`。原因：2026-10-28 接手时桥接实测返回 `quota exceeded / rate limit (seven_day) / monthly spend limit`；按 AGENTS.md 改用同一模型的 Anthropic API。认证状态 ready 不等于审核已完成。
- 覆盖需求完整性、一致性、可测试性、工程准则，附 46 AC 逐项设计映射。只在确有证据时勾选；发现问题保留未勾选项。
- 尚未发生的 Tasks / Analyze 不得勾选为完成，可写阶段说明并要求后续独立复核。
- 给出 R2 二元结论（通过 / 未通过）及逐项 B-01～B-08 复核；不以风格化总结代替具体发现。保留首轮历史，不因本轮修正而改写首轮发现；需求需变更时明确回流 Clarify，不自行修改冻结 spec。
- 不安装依赖、不跑应用测试、不启动其他 agent、不读用户凭证、不 commit / push。最终回复概括结论与所写文件。
