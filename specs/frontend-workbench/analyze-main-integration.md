# frontend-workbench v2 S0 合入 main：独立只读集成 Analyze / Converge 报告

> **会话**：`claude-opus-5-5 via anthropic`（环境变量 `PI_PROVIDER=anthropic`、`PI_MODEL=claude-opus-5-5`），由协调器新派。按指令没有重试 bridge，也没有改 provider、路由或配置。
> **独立性**：本会话不是审核员 A，不是集成作者的会话，也不是 Astra。我和集成作者用的是同一个模型，但会话互相隔离。AGENTS §6 把 Analyze / Converge 归为“计划与分析类”，首选就是 Opus；它没有异模型要求，异模型要求只针对审核员 A。
> **唯一 cwd**：`D:/2030/Futures-AI-workbench-v2`，固定对象 `3f632739fc186396221482364cf16e3629b4b24f`。
> - 开始时：HEAD = `3f63273`，`## spec/frontend-workbench-v2...origin/spec/frontend-workbench-v2 [ahead 76]`，没有未提交改动。
> - 结束时：同一 HEAD、同一状态，仍然干净。
> **只读声明，有一处违规需要说明**：我没有运行 install / test / build，没有启动服务，没有派 agent，没有改仓库文件或 refs。`git status` 都用 `--no-optional-locks` 执行。
> - 违规：一次核对 AC 集合的命令里误写了重定向 `> /tmp/x`，在仓库外生成了临时文件 `C:\Users\iswal\AppData\Local\Temp\x`。内容只是我刚提取的 52 行 AC 编号，生成时间 08:41:59。
> - 处理：确认是本次新建的文件后，已立即 `rm` 删除并核实不存在。仓库、refs 和其他工作树都没有受影响。之后的比对全部改用管道。

## 1. 固定对象与两条真实 diff

| 项 | 实测 |
|---|---|
| `3f63273` 的两个父提交 | P1 = `76abe92`（S0 完成后的状态提交），P2 = `cf8e11b`（本地 `main` 与 `origin/main` 的 ref 都指向它） |
| merge-base | `43b6d79`（v1 Handoff，PR #7） |
| `git diff 76abe92..3f63273` | 33 个文件，+2787 / −285 |
| `git diff cf8e11b..3f63273` | 44 个文件，+4320 / −141 |

两条 diff 的内容：

- **`76abe92..3f63273`**：
  - main 带来的部分：PR #8 H-01（`SampleChart.vue` +4 行，`e2e/theme.spec.ts` +78 行，`review-h01.md`，`assets/h01-fix-20261028/`）；PR #10 T-19（1440 整图、`capture-full-1440.json`，manual 的 M-08 新增 2 行）；PR #9（AGENTS、docs 和 D-020～D-024 等 5 份 ADR、`candidates.md`、根 `HANDOFF.md`、`analyze.md` / `converge.md` / `review.md` 的 v1 追加）。
  - 集成新增：`handoff-v2-s0.md`、`merge-main-cleanup.md`。
  - plan / tasks / README：冲突整合。
  - `UI_NAV.md`：只改一行节号。
- **`cf8e11b..3f63273`**：
  - S0 的 12 个 frontend / design 文件；
  - v2 规格、审核和状态原件：spec、checklist-v2、analyze-v2 R1～R9、S0 的三份报告、`session-artifacts/`、`v2-gate1-request.md`；
  - plan §9、tasks v2 段、README 状态行和 H-x 行、manual 的 M-09～M-12、`review.md` §20。

**范围外说明**：实施树分支 `feat/frontend-workbench-v2-s0` 现在指向 `9e68233`。它的父提交是 `3f63273`，只新增了 `specs/frontend-workbench/validation-main-integration.md`（+92 行），与 `3f63273` 的 tree 不同。这是 Astra 的集成复测提交，不在本次固定对象内。我没有读它的结论，也不引用。

## 2. 读取范围

- **按要求完整重读**：main 版 AGENTS、`docs/plan.md`，以及 `docs/designUI.md` 中涉及菜单、焦点带和 D-022 的段落；`interaction.md` 与 D-020～D-024 的 ADR 只通过 grep 和 diff 核对与 frontend-workbench 有关的位置。
- **全文阅读**：`merge-main-cleanup.md`、`handoff-v2-s0.md`；plan 页首 1～36 行和 §9.1；tasks 页首、v2 段首、§1.2、§2，以及 T-V2-xx 各任务的状态行。
- **定点核对**：checklist-v2 R4；S0 三份原件（implementation、converge、review）的结论段；README 全文；`theme.spec.ts` 的 H-01 用例；`design-registry.spec.ts`；`manual-acceptance.spec.ts`；S0 全部代码 diff（`43b6d79..76abe92`）。
- **比对方式**：所有逐字和机械比对都用 `git cat-file -p`（原始 blob，统一 LF）。没有只看集成作者的摘要。

## 3. 核验结果

| # | 检查项 | 结果 |
|---|---|---|
| C1 | 根 `HANDOFF.md` 与 `cf8e11b` 相同 | ✅ `git diff --quiet` 退出码 0 |
| C2 | `handoff-v2-s0.md` 与 `76abe92:HANDOFF.md` | ✅ 只多页首 4 行迁移说明，正文只有一处 “plan §7.4→§9.4” |
| C3 | `specs/README.md` | ✅ 详见下方说明 |
| C4 | plan §1～§8 正文与 `cf8e11b` 相同 | ✅ 与 `cf8e11b` 第 8～339 行逐字相同。§8 之后多出 “空行 + `---`”，这是 `76abe92` 原有的 v2 段前分隔，不是新内容 |
| C5 | plan §9 去掉编号后与 `76abe92` 的 §7 相同 | ✅ 把 §9 反向替换回 §7 后，与 `76abe92` 第 273 行至文末逐字相同（diff 退出码 0），共 15 个 `### 9.N` |
| C6 | plan §9 正文残留的 “§7” | ✅ 只剩 §9.0 里的 `docs/interaction.md` §7.2，符合规则。逐个检查了 §9 中的 §9.x，全部指 plan 内部 |
| C7 | plan 页首 | ✅ 新增“主线合并与编号迁移”行；S0 行的交接指针改为 `handoff-v2-s0.md`；v2 历史行只有 §7→§9；main 的 H-01 页首行（“追加 §7”）原样保留 |
| C8 | tasks 页首 v1 与 v1 正文 | ✅ 页首第 1～8 行与 `cf8e11b` 相同；「## 约定」至 AC 覆盖表与 `cf8e11b` 相同，只在末尾多一个空行。T-18 / T-19 引用的 plan §7 / §7.3 / §8 / §8.2 / §8.3 没有被迁移 |
| C9 | tasks v2 段 | ✅ 把 `76abe92` v2 段里所有 “§7” 换成 “§9” 后，与当前版本相比只多 7 行“主线合并登记”（页首另有 1 行指引）。旧 v2 段里所有 §7 都是 plan 引用；tasks 自己的“第 7 节矩阵”“第 9 节工时”“§9 第 3 步”都没被改动 |
| C10 | tasks 计数 | ✅ 12 项任务、合计 22 h、2 completed / 10 blocked；§1.2 的 H 表 8 行（含表头附近共 9 处“未交付”字样）；矩阵 52 行与 spec 的 AC 集合去重比对一致（52 条） |
| C11 | 代码与冻结文件相对 `cf8e11b` | ✅ 相同：`backend`、`docs`、AGENTS、`.gitignore`、`templates`、LICENSE、README、`package.json`、`pnpm-lock.yaml`、根 HANDOFF、`assets/`、`review-h01.md`、`review-m08.md`、`converge.md`、`analyze.md`、`SampleChart.vue`、`theme.spec.ts` |
| C12 | frontend / design 相对 `cf8e11b` | ✅ 正好是 S0 的 12 个文件 |
| C13 | 同一范围相对 `76abe92` | ✅ 只有 3 个文件不同：`SampleChart.vue`、`theme.spec.ts`（来自 main），以及 `UI_NAV.md` 的一行节号 |
| C14 | 冻结与历史原件相对 `76abe92` | ✅ 相同：spec、checklist、checklist-v2（R4 全部已勾）、analyze-v2 R1～R9、implementation / converge / review-v2-s0、`v2-gate1-request.md`、`session-artifacts/` |
| C15 | manual-acceptance | ✅ `cf8e11b` 原文是逐字前缀（包括 M-08 新增 2 行），后接 M-09～M-12；0 个已勾 / 12 个未勾 |
| C16 | review.md | ✅ `cf8e11b` 原文是逐字前缀，后面只追加 §20（链接） |
| C17 | 格式检查 | ✅ `git diff --check cf8e11b HEAD`（排除 `session-artifacts`）和 `git diff --check 76abe92 HEAD` 都退出码 0；没有冲突标记 |
| C18 | 现行引用是否已更新 | ✅ `UI_NAV.md` 落点、README H-x 行、plan / tasks 页首都已更新；frontend 和 design 里没有残留的 `plan §7.x`。历史原件中的旧 SHA 引用保留，靠页首映射读作 §9 |

**C3 说明（README）**：

- 状态行：整体为 `blocked`，同时写明 v1、H-01 和 T-19 已交付，并保留 main 原有的 PR #7 / #8 / #10 事实。
- H-01 后续一句由 main 的 “H-02 留待 v2、未修复” 改成了 “v1 台账原文不改、不宣称关闭”。这与 tasks v2 §2 的 R3 补充一致，是准确表述，不是事实丢失。
- 跨 feature 待办：保留 main 的 D-020～D-024 各行和表尾说明；H-x 行在第 33 行，与 tasks §1.2 规则 5 引用的行号一致。
- “D-018 → frontend-workbench v2（Gate 1 待批）”这一行：`43b6d79` 有、`76abe92` 已删、`cf8e11b` 未改，三方合并结果是删除。删除成立，因为 spec v2.1 已经改入“格物致知”，S0 的 `nav.ts` 也已实现。

**相对新权威 docs 的方向**：

- S0 没有改 `docs/` 或 AGENTS。
- 九项菜单的顺序与 `docs/designUI.md:67` 完全一致：工作台 · 作业 · 日报 · 价格 · 平衡表 · 物流 · 格物致知 · 知识库 · 设置。
- “日报”没有改名，符合 designUI:68 和 D-022。
- D-020～D-024 写明是 Phase 2 之后的目标，不给冻结 spec 追加义务，本次没有实现或裁定新功能。

**H-01 修复没有被反向覆盖**：`SampleChart.vue` 和 `theme.spec.ts` 都与 `cf8e11b` 相同。S0 在 `/workbench` 上只新增了一个“投放”按钮，没有新增 `span.num`。`design-registry.spec` 不检查节号；`manual-acceptance.spec` 用 `^- 截图证据：` 匹配，main 新增的“截图证据补充（T-19）”一行不会让它出错。

## 4. 机械编号映射（plan 中的 v2 设计）

| 旧编号 | 新编号 | 旧编号 | 新编号 |
|---|---|---|---|
| §7（标题） | §9 | §7.8 契约 | §9.8 |
| §7.0 阶段、闸门与基线 | §9.0 | §7.9 数据与存储 | §9.9 |
| §7.1 对旧节的覆盖 | §9.1 | §7.10 关键时序 | §9.10 |
| §7.2 文件唯一写入者 | §9.2 | §7.11 验收对应（52 条） | §9.11 |
| §7.3 契约与 store 交接（H-x） | §9.3 | §7.12 测试、人工验收与回滚 | §9.12 |
| §7.4 导航与路由 | §9.4 | §7.13 分阶段依赖 | §9.13 |
| §7.5 作业轨道 | §9.5 | §7.14 风险 | §9.14 |
| §7.6 全局投放 / §7.7 对话上下文 | §9.6 / §9.7 | | |

**不迁移的编号**：

- plan 的 v1 §7（H-01）和 §8（M-08），以及 H-01 页首行；
- tasks v1 段里 T-18 / T-19 引用的 plan §7.x / §8.x；
- tasks 自己的第 7 节（矩阵）和第 9 节（含“§9 第 3 步”）；
- `docs/interaction.md` §7.2；
- 所有固定旧 SHA 的历史原件。

## 5. 发现

### 5.1 内部发现（F）

**判定：P1 = 0，P2 = 0，P3 = 2，均不阻断这次阶段合入。**

**F-01（P3，S1 阶段的前瞻约束，S0 不受影响）**：main 的 H-01 回归用例 `theme.spec.ts`（两个视口）要求：`/workbench` 上图注之外的所有 `span.num` 都必须是 `display: block`、等宽字体、tabular-nums、右对齐。

- plan §9.5 和 T-V2-05 / 06 的作业轨道 `JobTrack` 写于 H-01 进入本分支之前，没有提到这条全局约束。
- 风险：如果 S1 在轨道卡片里像 H-01 那样把 `.num` 局部改成行内，H-01 用例会变红。T-V2-11 / 12 的全量测试能拦住，所以不是静默风险。
- 回答集成作者留下的问题：§9.1 的覆盖声明只针对 §1～§6，这是正确的。§7 / §8 是 v1 的追加节，v2 没有任何条款覆盖或改写它们，涉及的文件也都不在 v2 写入范围内。§9.12 的回滚只用 `git revert`，并禁止整文件 checkout，不会冲掉 H-01。因此**没有语义冲突，S0 不需要新增覆盖声明**。
- 最小修正：等 H-x 解锁、S1-track 开工前的那轮 Analyze / Tasks，在 tasks v2 §2 补一行“T-18 / T-19 与 plan §7 / §8 保留，v2 不覆盖”，并在 T-V2-05 / 06 的上下文中注明这条约束。现在不改，因为改 tasks 要走流水线。

**F-02（P3，文档时态）**：`handoff-v2-s0.md` 的迁移说明只把第 5、6 节标为 `76abe92` 时点的快照。但第 1 节正文写着“没有进行……PR 或 main 合并”，PR 合入 main 后这句就过时了。

- 迁移说明已写明“下方正文是 `76abe92` 原文”，读者可以理解，所以不阻断。
- 最小修正（可选）：在合并后的记录或 Handoff 时，把说明扩成“第 1～7 节都是 `76abe92` 时点的原文”。

### 5.2 观察（不计入判定）

- **O-1**：`merge-main-cleanup.md` §5.1 写“§8 和 §9 之间多一个分隔空行”。实际多出的是“空行 + `---`”，`---` 来自 `76abe92`。这不影响任何逐字结论。
- **O-2**：在 tasks v2 段里，单独的“§9”（例如“1.1 / §9 / T-V2-01”“§9 引用本口径”）指 tasks 自己的第 9 节，而 “plan §9.x” 指 plan。“主线合并登记”已经写明这条读法，不需要改。

### 5.3 外部或非本次内部范围的事项（E，不当作内部 P2）

- **E-1（真实外部阻塞）**：H-1 到 H-6 及页面切片共 8 行都未交付，T-V2-03～12 仍为 blocked。AC-002-8 等需要集成的条目、T-V2-11 / 12 都还没做。
- **E-2（跨 feature 引用）**：互动方分支（`integration/workbench-interaction` `0920004`、`spec/workbench-interaction` `91c8c5d`）的 specs 里有 12 处写着 “v2 plan §7.3 / H-x”。本次合入 main 后，main 上的 plan §7.3 是 H-01 的“验证机制”。
  - 已有的缓解：README 第 33 行写成 “§9.3（原 §7.3）”，plan 页首有完整映射。
  - 这些文件属于互动方的写入范围，其中多数针对固定的 `ded7161` / `79b5212`。由互动方在下次交付 H-x 时自行对齐。
- **E-3（合并后的验证）**：我没有运行 test、build 或 registry 测试。Astra 的结果在 `9e68233`，由协调器另行集成。本报告不预写“通过”。
- **E-4（人工与 Gate）**：
  - M-01～M-12 没有人代勾；
  - P3-1（加载百分比显示长小数，`stores/app.ts` 的 `/3*100`）未修复，**也没有获得最终风险接受**；
  - “日报”是否改名（D-022）要按 AGENTS §2 第 8 步回到 Clarify 再定；
  - 这次合入不是 v2 最终 Review、Gate 2 或正式 Handoff，S1 / S2 的闸门照旧有效。
- **E-5（远端状态）**：本地 `origin/main` = `cf8e11b` 是快照，我没有 fetch。开 PR 前必须确认远端 main 没有前进；如果前进了，需要重新 merge，并对新的合并结果重做 Analyze。

## 6. 清理的安全范围（只核对，不执行）

- **14 个 `Futures-AI-workbench-v2*` 目录**：与 `merge-main-cleanup.md` §7 的清单一致，现在全部 `dirty = 0`。
  - 被忽略的文件只在两处：`-implement`（`frontend/dist`、`node_modules`、`test-results`）和 `-s0-code-review`（`node_modules`、`test-results`）。
- **与盘点时的差异**：`-implement` 从 `76abe92` 前进到了 `9e68233`；`-integration` 和主规格树现在都在 `3f63273`。
- **不在 HEAD 祖先链上的分支提交**，要靠保留分支 ref 来保全：
  - `ebb0e6b`、`5e375d2`、`e596244`（A R4 产物）、`425c1fd`（A R3 产物）、`6acfd30`（S0 代码审查产物）、`8eacc37`、`1e01df5`、`9e68233`（Astra 复测提交）。
  - 除 `spec/frontend-workbench-v2`（领先 origin 76 个提交）外，这些分支都没有设置 upstream。
- **清理时必须做到**：
  - 只移除工作树目录，不删除分支 ref；
  - `-integration` 和主规格树（`3f63273` 不在任何远端的 main 上）要等 PR 合入之后再移除；
  - 本会话的 cwd 就是第 1 号目录，要等使用它的会话都结束后再移除。
- **范围外、核实应保留**：主仓 `D:/2030/Futures-AI`、所有 `Futures-AI-desktop-*`、`Futures-AI-docs` / `Futures-AI-docs-agent` / `Futures-AI-docs-reshape-*`、所有 `Futures-AI-interaction-*`、`D:/2030/fw-T-15`。

## 7. 结论

- **S0 阶段合入的内部一致性：已收敛。** 四处冲突的处理与授权范围一致；编号迁移是纯机械的；代码、冻结文件和历史原件都按两边的基线保留；没有反向覆盖 main 的新权威 docs 或 H-01 修复。P1 = 0、P2 = 0；2 项 P3（F-01、F-02）不阻断，作为后续候选。
- **完整 v2：未收敛（外部阻塞）**，见 E-1。

## 8. PR、merge 与清理前必须满足的条件（由协调器执行）

1. 集成 Astra 的复测报告（`9e68233`），并确定 PR head 是 `3f63273` 还是 `9e68233`。任何一项测试变红都要先停下来。
2. 审核员 A 新开会话，用与 Implement 不同的模型，只读复核选定 head 的真实 diff（`76abe92..head`、`cf8e11b..head`）。出现 P1 / P2 即为不通过。
3. fetch 远端，确认 `main` 仍是 `cf8e11b`。如果已前进，重新 merge 并重做 Analyze。
4. 开 PR 并 merge 到 main，提交号以 PR 记录为准。
5. 合入后清理第 6 节列出的工作树：只移除目录，保留分支 ref，`-integration` 和主规格树最后移除。

本报告不预写上面任何一步的结果。

REPORT_END_ANALYZE_MAIN