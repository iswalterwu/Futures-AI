# frontend-workbench v2 S0 阶段合入 main 与目录清理记录（merge-main-cleanup.md）

> **作者**：`claude-opus-5-5 via anthropic`，由协调器新派的集成 / 交接文档会话。不是 Implement，不是审核员 A，也不是协调器。bridge 在本限额窗口已有真实额度 / 限流失败，本会话没有重试，也没有改 provider、路由或配置。
> **唯一可写树**：`D:/2030/Futures-AI-workbench-v2-integration`，分支 `integration/frontend-workbench-v2`。开始时 HEAD = `76abe9246fbd6b9bbf2573dbd3751fd8eb022cb7`，`git status` 干净。本会话没有另建目录或工作树，没有 checkout / reset / 删除其他树或分支，没有派 agent。
> **性质**：这是对 S0 现有内容的**阶段性合入**和集成记录，不是 v2 最终 Review、Gate 2 或正式 Handoff。本会话只做文档和 Git 检查，没有运行 install / pnpm / test / build，也没有启动服务。本文件不写自己的合并提交号（以 `git log` 为准），也不预写复测结果、PR 结果或目录删除结果。

## 1. 授权原话、范围与 Gate 边界

**用户原话**（协调器转述，2026-10-29）：

> “我现在的目录过于臃肿，请你把现有的更新merge到main，然后删除D:\2030 目录下所有Futures-AI对应本次修改的文件夹（本会话衍生的）”

**背景**：这条指令是在以下三件事都已汇报之后给出的：S0（T-V2-01 → T-V2-02）实现完成；独立 S0 限定代码审查结论为 0 P1 / 0 P2 / 1 P3（P3-1：加载页百分比显示长小数）；完整 v2 被 H-x 外部交接阻塞。

**本次登记的授权范围**：

- 把 S0 的现有内容合入 main：12 个 frontend / design 改动，以及截至 `76abe92` 的规格、审核和状态文档。
- 合入后，由协调器删除本次修改衍生的工作树目录（见第 7 节）。

**不在授权内、仍然有效的事项**：

- 完整 v2 仍为 **blocked**：T-V2-03～12 共 10 项被 H-x 阻塞，tasks §1.2 的八行全部“未交付”。完整 v2 仍是“未收敛（外部阻塞）”。
- 本次授权不是 v2 最终 Review，不是 Gate 2，也不是正式 Handoff。其余 Gate 都没有取消：S1 / S2 的开工闸门、v2 最终 Review、Gate 2、Handoff、人工验收照旧有效。
- P3-1 保持“后续候选、未修复、未获最终风险接受”。本次合入不等于 Walter 已接受这个风险；它的处置留到最终 Gate 2。
- 最初 `HANDOFF.md` 写过“不得合入”，那是当时的阶段限制。本轮用户的明确新指令取代了它，但只覆盖本节列出的范围。
- main 上新的 D-020～D-024 是后续 Phase 的目标。`docs/designUI.md` 写明这些目标不给冻结 spec 追加义务。“日报”菜单是否改名留给后续 v2 Clarify；本轮保留已批准的名称，不改名，也不做新的 Clarify 或功能。

## 2. 两条基线与合并方式

| 项 | 值 |
|---|---|
| 本方（父 1） | `76abe9246fbd6b9bbf2573dbd3751fd8eb022cb7`（S0 完成、代码审查集成、外部阻塞登记） |
| main（父 2） | `cf8e11bc1c91149cac233a2f3b5ec6eed4e23caa` = `origin/main`。本会话开始时实测，本地 `main` ref 也已指向它 |
| merge-base | `43b6d79681a49562f41751368b2ae00c24062f56`（v1 Handoff，PR #7） |
| 方式 | `git merge --no-commit --no-ff cf8e11b`，解决冲突后提交一个本地 merge commit，两个父提交依次为 `76abe92` 和 `cf8e11b`。没有 push，没有开 PR，也没有改 main |

main 相对 merge-base 带来三组提交：

- **PR #8 H-01**：`SampleChart.vue` 新增四行局部样式；`e2e/theme.spec.ts` 新增回归用例；新增 `review-h01.md`；`assets/h01-fix-20261028/` 下新增四张图注特写和 README。
- **PR #10 T-19 M-08**：新增修复后的 1440 整图和 `capture-full-1440.json`；`manual-acceptance.md` 的 M-08 段新增两行。
- **PR #9 agent 工作流重塑**：新增 D-020～D-024 和 `docs/agent/candidates.md`；更新 AGENTS、`docs/plan.md`、`docs/interaction.md`、`docs/designUI.md`、`docs/architecture.md`；根目录 `HANDOFF.md`；跨 feature 待办。

前端和设计代码没有冲突。

## 3. 四处冲突的处理

| 文件 | 冲突 | 处理 |
|---|---|---|
| 根 `HANDOFF.md` | add/add | **逐字取 `cf8e11b`**。main 的根 `HANDOFF.md` 是另一 feature（agent 工作流重塑）已交付的交接，`docs/plan.md` 等多处引用它。本方 `76abe92:HANDOFF.md` 迁到新文件 [handoff-v2-s0.md](handoff-v2-s0.md)：文件开头加迁移说明，正文保留原历史内容，只把一处 “plan §7.4” 机械改为 “§9.4” |
| `specs/README.md` | 只有 frontend-workbench 状态行冲突 | 合成一行，状态为 `blocked`：v1、H-01、T-19 已交付；v2 只有 S0 已完成并阶段性合入；整体 blocked 于 H-x，不是 done。跨 feature 待办按三方合并的自动结果处理：<br>• 保留 main 新增的 D-020～D-024 各行和表尾说明；<br>• 保留本方的 H-x 细化行，其中“plan §7.3”改为“§9.3（原 §7.3）”；<br>• “D-018 → frontend-workbench v2（Gate 1 待批）”一行，本方早已按“完成后删除对应行”删除（v2.1 的 Q-031 已改入并通过 Gate 1），main 没改这一行，所以三方合并结果是删除，本轮照此保留。<br>“日报”菜单名不改。H-x 行仍在第 33 行，与 tasks §1.2 规则 5 的行号一致 |
| `specs/frontend-workbench/plan.md` | 页首与文末都冲突 | §1～§8 正文逐字取 `cf8e11b`：§1～§6 是 v1；§7 是 H-01；§8 是 M-08。main 的 H-01 页首行放在原有位置。本方的 v2 设计从原 §7 迁为 **§9（9.0～9.14）**，只改编号，见第 4 节。页首新增“主线合并与编号迁移”行；S0 页首行的“当前交接”改为指向 `handoff-v2-s0.md` |
| `specs/frontend-workbench/tasks.md` | 页首与文末都冲突 | 页首 v1 各行，以及从「## 约定」到 v2 段之前的 v1 正文，整段逐字取 `cf8e11b`（T-01～T-19、P3 台账含 H-01 / H-02 后续、H-01 / M-08 Review 备注、AC 覆盖表）。随后追加 `76abe92` 的 v2 页首行和 v2 段，只做两类修改：<br>• plan 引用 §7.x → §9.x 的机械迁移；<br>• 当前元数据：页首一行指引，以及 v2 段首新增“主线合并登记”。<br>任务定义、完成标准、验证命令、依赖、工时和 52 AC 矩阵都没改 |

自动合并、没有冲突的文件中，本轮另有两处文档追加：

- `review.md`：在 `cf8e11b` 原文后追加 §20，只放本报告的链接。§0～§19 是 `cf8e11b` 原文的逐字前缀。
- `manual-acceptance.md`：自动合并结果保留了 main 的 M-08 新增两行，也保留了本方追加的 M-09～M-12。M-01～M-08 的旧记录和勾选框没改，本轮也没有手动修改这个文件。

## 4. plan 编号迁移（v2 设计 旧 §7 → 新 §9）

| 旧 | 新 | 内容 |
|---|---|---|
| §7（标题） | §9 | v2 实施设计（v2.1 冻结需求） |
| §7.0 | §9.0 | 阶段、闸门、基线与依据 |
| §7.1 | §9.1 | 对旧节的覆盖（只改增量） |
| §7.2 | §9.2 | 文件唯一写入者 |
| §7.3 | §9.3 | 契约与 store 交接要求（H-1～H-6） |
| §7.4 | §9.4 | 导航与路由（含 G-02 窄窗） |
| §7.5 | §9.5 | 工作台作业轨道 |
| §7.6 | §9.6 | 全局投放 |
| §7.7 | §9.7 | 对话的作业上下文 |
| §7.8 | §9.8 | 契约 |
| §7.9 | §9.9 | 数据与存储 |
| §7.10 | §9.10 | 关键时序 |
| §7.11 | §9.11 | 验收对应（52 条） |
| §7.12 | §9.12 | 测试命令、人工验收与回滚（M-09～M-12） |
| §7.13 | §9.13 | 分阶段依赖（S0 / S1-* / S2） |
| §7.14 | §9.14 | 风险 |

**迁移规则（机械）**：

- 以下位置中，指向 v2 设计的 “§7” / “§7.x” 一律改为 “§9” / “§9.x”：plan 的 v2 页首各行和 §9 正文、tasks 的 v2 页首各行和 v2 段、`handoff-v2-s0.md` 正文、`specs/README.md` 的 H-x 行。章节标题 `## 7.` / `### 7.N` 改为 `## 9.` / `### 9.N`。
- 以下内容**不迁移**：
  - plan §9.0 中的 `docs/interaction.md` §7.2；
  - main 的 v1 §7 / §8 正文，以及 H-01 页首行中的“追加 §7”；
  - tasks v1 段 T-18 / T-19 引用的 plan §7 / §7.3 / §8 / §8.2（这些指 H-01 / M-08）；
  - tasks 自己的第 7 节（52 AC 矩阵）和第 9 节（工时、依赖与下一步，文中写作“§9 第 3 步”）；
  - spec 中“其 Plan §7”（指互动方的 plan）。
- **设计资产 Markdown**：`design/ui/UI_NAV.md` 暗色适配段“落点”里的链接文字 “plan §2.2 / §7.4” 和 “（v2 导航以 §7.4 为准）”，本轮只把节号改为 §9.4。这是 S0 写入的 12 个文件之一，只改节号，不改适配语义；原文快照和 JSON 碎片不改。
- **历史原件不改**：`analyze-v2.md`、`analyze-v2-r2.md`～`analyze-v2-r9.md`、`checklist-v2.md`、`checklist.md`、`implementation-v2-s0.md`、`converge-v2-s0.md`、`review-v2-s0.md`、`v2-gate1-request.md`、`session-artifacts/`。它们都针对固定的旧 SHA，原样保留；其中的 “plan §7.x” 按上表读作 “§9.x”。plan / tasks 页首已写明这一点，没有为了行号去改审核原件。
- **一条覆盖声明的注记**：§9.1 写的“§1～§6 与 §9 冲突时以 §9 为准”，范围仍只到 §1～§6。§7（H-01）和 §8（M-08）是 main 已交付的 v1 追加节；S0 没碰它们对应的代码（`SampleChart.vue`、`e2e/theme.spec.ts` 与 main 相同）。本轮不新增覆盖声明，留给独立集成 Analyze 确认有没有语义冲突。

## 5. 保留校验（本会话只读 Git 结果；最终数值以提交后复核为准）

下列检查都在 merge 结果上执行，对象是暂存后的索引或提交。所有命令都只读。

| 校验 | 期望 | 结果 |
|---|---|---|
| 代码相对 `cf8e11b`：`git diff --name-only cf8e11b <merge> -- frontend design` | 只有 S0 的 12 个文件：`design/ui/{UI_NAV.md,README.md}`；`frontend/src/app/{nav.ts,router.ts,Rail.vue,TopBar.vue}`；`frontend/src/pages/PlaceholderPage.vue`；`frontend/src/stores/app.ts`；`frontend/e2e/{shell,agent}.spec.ts`；`frontend/tests/component/topbar.spec.ts`；`frontend/tests/unit/manual-acceptance.spec.ts` | 见第 5.1 节 |
| 上述 12 个文件相对 `76abe92` | 只有 `UI_NAV.md` 一处节号改动，其余 11 个文件不变 | 见第 5.1 节 |
| main 的 H-01 代码：`SampleChart.vue`、`e2e/theme.spec.ts` | 与 `cf8e11b` 相同 | 见第 5.1 节 |
| `backend/`、`docs/`、`AGENTS.md`、`.gitignore`、`frontend/package.json`、lock 文件、根 `HANDOFF.md`、`assets/`、`review-h01.md`、`review-m08.md`、`converge.md`、`analyze.md` | 与 `cf8e11b` 相同 | 见第 5.1 节 |
| `spec.md`、`checklist.md`、`checklist-v2.md`、`analyze-v2*.md`、`implementation-v2-s0.md`、`converge-v2-s0.md`、`review-v2-s0.md`、`v2-gate1-request.md`、`session-artifacts/` | 与 `76abe92` 相同 | 见第 5.1 节 |
| plan | §1～§8 正文与 `cf8e11b` 相同；§9 把编号还原后与 `76abe92` 的 §7 相同 | 见第 5.1 节 |
| tasks | v1 页首和 v1 正文与 `cf8e11b` 相同；v2 段把编号还原后，只多出新增的“主线合并登记”和页首一行指引；仍是 12 项 / 22 h、2 completed / 10 blocked、52 AC、H 表 8 行“未交付” | 见第 5.1 节 |
| manual / review | main 的 M-08 两行仍在，M-09～M-12 仍在，勾选框数量不变；review.md 以 `cf8e11b` 原文为逐字前缀 | 见第 5.1 节 |
| `git diff --check cf8e11b <merge>` | 本轮新增内容没有空白错误。原样归档的 `session-artifacts/` 中已有的空白问题排除在外，不修改 | 见第 5.1 节 |

### 5.1 实测结果（提交前对暂存索引执行）

本会话用临时只读脚本（放在仓库外 Temp，不入库），对 `git add` 之后的索引逐项执行上表检查，结果**全部通过**：

- **代码**：相对 `cf8e11b` 的 frontend / design 差异正好是 S0 的 12 个文件。这 12 个文件相对 `76abe92` 只有 `UI_NAV.md` 一行变化（一对 −/+），内容是 §7.4→§9.4。`SampleChart.vue` 和 `theme.spec.ts` 与 `cf8e11b` 相同。
- **与 `cf8e11b` 相同**：`backend`、`docs`、`AGENTS.md`、`.gitignore`、`templates`、`LICENSE`、`README.md`、package、lock、根 `HANDOFF.md`、`assets/`、`review-h01.md`、`review-m08.md`、`converge.md`、`analyze.md`。
- **与 `76abe92` 相同**：spec、两份 checklist、`analyze-v2*.md`（R1～R9）、S0 三份原件、`v2-gate1-request.md`、`session-artifacts/`。spec 中 AC 去重后共 52 条。
- **plan**：§1～§8 与 `cf8e11b` 正文相同，只在 §8 和 §9 之间多一个分隔空行。§9 把编号还原为 §7 后，与 `76abe92` 的 §7 逐字相同，有 15 个 `### 9.N` 标题。页首相对 `76abe92` 只有两处不同：新增“主线合并与编号迁移”行；S0 行改了交接指针。其余行只有 §7→§9 的差异。main 的 H-01 页首行仍在。
- **tasks**：v1 页首和 v1 正文与 `cf8e11b` 相同，v1 正文后多一个分隔空行。页首只新增一行指引。v2 段去掉新增的“主线合并登记”后，等于 `76abe92` 的 v2 段做 §7→§9 迁移的结果。仍是 12 个任务、2 completed / 10 blocked、22 h；52 行 AC 矩阵与 spec 的 AC 集合相同；H 表 8 行都是“未交付”；P3-1 措辞未变。
- **其他文件**：
  - `manual-acceptance.md` 同时包含 `cf8e11b` 和 `76abe92` 的全部行；勾选框为 0 个已勾、12 个未勾。
  - `review.md` 以 `cf8e11b` 原文为逐字前缀，后面只接 §20。
  - `handoff-v2-s0.md` 的正文等于 `76abe92:HANDOFF.md` 改一处 §7.4→§9.4。
  - README 保留了 main 的 D-020～D-024 各行和表尾说明，H-x 行在第 33 行。
  - 没有冲突标记；对 `cf8e11b` 执行 `git diff --check`（排除 `session-artifacts/`）通过。

提交后会再跑同一组检查并核对两个父提交；结果写在本会话给协调器的报告里，不再回写本文件。

## 6. 未完成项与待人工 / 待验证（全部照旧）

- **P3-1**（S0 代码审查发现）：加载页百分比显示 `33.33333333333333%`。只登记为后续候选，未修复，未获最终风险接受，也不计入 12 项任务（tasks §1.3）。
- **H-x**：H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-5、H-6 八行全部“未交付”。T-V2-03～12 仍为 blocked。
- **人工**：M-01～M-08 仍待 Walter 复核（main 上 0 checked / 8 unchecked）。M-09～M-12 只有文本，没有截图，没有人代勾。v1 的 H-02 台账原文不改，不宣称 H-02 已关闭。
- **已知后续风险**：H-3 集成后，`/jobs` 的壳 owner 断言会变红，按 T-V2-09#4 迁移，由集成人登记“已知红”窗口。
- **合并后验证尚未执行**：本次 merge 对代码没有新的语义改动，但 main 带来了 H-01 的代码和测试，与 S0 代码首次共存。在这棵合并树上，下列验证都还没跑过：
  - `pnpm -C frontend test`（check、typecheck、lint、unit、e2e）；
  - `pnpm -C frontend build`；
  - registry 测试：`UI_NAV.md` 节号改了，需要复跑。
- **后续顺序（由协调器安排，本会话不执行）**：
  1. Implement 角色（按 AGENTS §6，首选 `openai/gpt-6-astra`）在本集成树的 merge 提交上重跑全量测试和 build；
  2. 独立集成 Analyze / Converge（新会话，计划与分析类角色）只读核对本 merge；
  3. 审核员 A（新会话，与实施不同模型）复核本 merge 的真实差异；
  4. 以上都无阻断后，协调器开 PR 并 merge main；
  5. 协调器按第 7 节清理目录。

  任何一步出现 P1 / P2 或测试变红，都停下来报告，不得跳步。本文件不预写这些步骤的结果。

## 7. 待清理目录（只由协调器执行；本会话不删除任何目录或分支）

协调器已经只读盘点过 14 个本 feature v2 会话衍生的工作树（清单：`C:/Users/iswal/AppData/Local/Temp/futures-fw-v2-merge-cleanup-20261029-01a18387/worktree-inventory.json`）。盘点结果：全部 clean；被忽略的文件只有实施树和代码审查树里的 `frontend/node_modules`、`frontend/dist`、`frontend/test-results`。

| # | 路径 | 分支 | 盘点时 HEAD |
|---|---|---|---|
| 1 | `D:/2030/Futures-AI-workbench-v2` | `spec/frontend-workbench-v2` | `76abe92` |
| 2 | `D:/2030/Futures-AI-workbench-v2-analyze-fixes` | `docs/frontend-workbench-v2-analyze-fixes` | `ebb0e6b` |
| 3 | `D:/2030/Futures-AI-workbench-v2-checklist` | `review/frontend-workbench-v2-checklist` | `5e375d2` |
| 4 | `D:/2030/Futures-AI-workbench-v2-g02` | `docs/frontend-workbench-v2-g02` | `ee3e348` |
| 5 | `D:/2030/Futures-AI-workbench-v2-g02-review` | `review/frontend-workbench-v2-g02` | `e596244` |
| 6 | `D:/2030/Futures-AI-workbench-v2-implement` | `feat/frontend-workbench-v2-s0` | `76abe92`（ignored：`dist/`、`node_modules/`、`test-results/`） |
| 7 | `D:/2030/Futures-AI-workbench-v2-integration` | `integration/frontend-workbench-v2` | 盘点时 `76abe92`，本次合并后为本地 merge commit，**未 push**，须先经 PR 合入 main 后再清理 |
| 8 | `D:/2030/Futures-AI-workbench-v2-resume` | `docs/frontend-workbench-v2-resume` | `1642216` |
| 9 | `D:/2030/Futures-AI-workbench-v2-resume-fixes` | `docs/frontend-workbench-v2-resume-fixes` | `217960d` |
| 10 | `D:/2030/Futures-AI-workbench-v2-resume-review` | `review/frontend-workbench-v2-resume` | `425c1fd` |
| 11 | `D:/2030/Futures-AI-workbench-v2-s0-close` | `docs/frontend-workbench-v2-s0-close` | `76abe92` |
| 12 | `D:/2030/Futures-AI-workbench-v2-s0-code-review` | `review/frontend-workbench-v2-s0-code` | `6acfd30`（ignored：`node_modules/`、`test-results/`） |
| 13 | `D:/2030/Futures-AI-workbench-v2-tasks` | `docs/frontend-workbench-v2-tasks` | `8eacc37` |
| 14 | `D:/2030/Futures-AI-workbench-v2-tasks-review` | `review/frontend-workbench-v2-tasks` | `1e01df5` |

**不在清理范围**（不是本次 v2 会话衍生，不能列入）：

- 主仓 `D:/2030/Futures-AI`；
- 所有 `Futures-AI-desktop-*`；
- `Futures-AI-docs`、`Futures-AI-docs-agent`、`Futures-AI-docs-reshape-*`；
- `Futures-AI-interaction` 及所有 `Futures-AI-interaction-*`；
- `D:/2030/fw-T-15`；
- v1 前端树（`Futures-AI-frontend`，盘点时已不存在）；
- `D:/2030` 下其他非 Futures-AI 目录。

**清理边界**：

- 只移除工作树目录，例如用 `git worktree remove`；被忽略的产物随目录一起删除。
- **不删除分支 ref**，包括审核分支和 WIP 分支，以保留各自独有的历史。例如 `review/*` 分支上的审核原样产物 `e596244`、`6acfd30`、`425c1fd`，以及 `5e375d2`、`1e01df5` 等，都不是 main 的祖先。
- 集成树（第 7 行）要等 merge commit 经 PR 合入 main 之后再清理，以免丢失未推送的提交。
