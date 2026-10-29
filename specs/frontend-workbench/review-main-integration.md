# frontend-workbench v2 S0 合入最新 main：独立集成复核（审核员 A）

> **审核员 A = `claude-fable-5-1 via anthropic`**。bridge 链路在本限额窗口已有真实 quota / rate 失败（继承协调器证据），按 AGENTS §6 第 5 条未重试、未改 provider / 路由 / 配置。全新会话，与 Astra（实施 / 验证，`openai/gpt-6-astra`）、Opus（合并作者 / 分析）、Sol（协调）隔离；模型与 Implement 不同。
> **固定对象**：`D:/2030/Futures-AI-workbench-v2-s0-code-review`，分支 `review/frontend-workbench-v2-main`，HEAD `d837b03d481c614eabe15bf8ab0618602f04a18d`。进入时 `git status --short --branch` 只有分支行与两个 ignored 目录（`frontend/node_modules/`、`frontend/test-results/`），无 tracked 变更；全程只读，退出时仅新增本文件（未 commit）。
> **性质**：只复核**本次阶段性集成**（S0 现有内容合入 main `cf8e11b`）是否安全，依据用户 2026-10-29 的阶段合入指令。**不是** v2 最终 Review、Gate 2 或正式 Handoff；不把 P3-1 标为已修复或已获风险接受；不扩大 S0 实现；不替用户做产品决策。
> **方法**：没有运行 install / pnpm / test / build，没有启动服务，没有派 agent。全部断言来自本会话亲跑的只读 git 命令（`git diff` / `git show` / `cmp` / `diff` / `grep`，比对对象为 blob 而非工作树文本，避免 CRLF 干扰）。没有采信作者摘要自动通过；没有读原型、没有重审 v1 60 张旧图。

## 1. 结论

**通过（限本次阶段集成）。P1 = 0，P2 = 0。**

- 新增发现：1 项 P3（F-01，清理前置条件的台账时点问题，不阻断合入）。
- 既有登记：S0 代码审查 P3-1（加载页百分比长小数）**仍未修复、未获最终风险接受**，本轮只登记、不处置。
- 独立 Analyze 的 F-01 / F-02（均 P3）：本轮独立核对后**同意其判定**（见 §5）。
- 完整 v2：**未收敛（外部阻塞）**——T-V2-03～12 共 10 项 blocked，tasks §1.2 H 表 8 行全部“未交付”；最终 Review / Gate 2 / Handoff 均未进行。
- 可否进入 PR / merge：**可以**，按 §7 的前置条件执行；目录清理须在 PR 真正合入 main 之后。

## 2. 固定对象与历史核对（亲测）

| 项 | 实测 |
|---|---|
| HEAD | `d837b03` = 指令指定值；分支 `review/frontend-workbench-v2-main`；`spec/frontend-workbench-v2` 也指向 `d837b03` |
| 线性历史 | `d837b03` → `9e68233` → `3f63273`（merge）→ `76abe92` …；`3f63273` 父 = `76abe9246fbd…` / `cf8e11bc1c91…` |
| merge-base | `43b6d79`（v1 Handoff，PR #7） |
| `3f63273` 冲突文件（`diff-tree --cc`） | `design/ui/UI_NAV.md`、`specs/README.md`、`handoff-v2-s0.md`、`manual-acceptance.md`、`merge-main-cleanup.md`、`plan.md`、`review.md`、`tasks.md`（含文档冲突与新增文件；合并作者登记的“四文档冲突”为 HANDOFF / README / plan / tasks，其余为自动合并或新增，结果已逐一核对，见 §3） |
| `9e68233` | 只新增 `validation-main-integration.md`（+92），无代码 |
| `d837b03` | 只新增 `analyze-main-integration.md`（+168）、`handoff-v2-s0.md` 页首 1 行改写、`merge-main-cleanup.md` 页首 +2 行；无代码 |
| `3f63273..HEAD` 文件集 | 仅 4 个 `specs/frontend-workbench/*.md`，**无 frontend / design / docs / backend** |
| 本地 `origin/main` / `main` | 均 `cf8e11b`（本地快照，本会话未 fetch） |

## 3. 源码与历史保护断言（全部实测）

### 3.1 源码

| 断言 | 命令 | 结果 |
|---|---|---|
| 相对 `cf8e11b`，非 `specs/` 的改动只有 S0 的 12 个路径 | `git diff --name-only cf8e11b HEAD \| grep -v ^specs/` | ✅ 正好 12 个：`design/ui/{README,UI_NAV}.md`、`frontend/e2e/{agent,shell}.spec.ts`、`frontend/src/app/{Rail.vue,TopBar.vue,nav.ts,router.ts}`、`frontend/src/pages/PlaceholderPage.vue`、`frontend/src/stores/app.ts`、`frontend/tests/component/topbar.spec.ts`、`frontend/tests/unit/manual-acceptance.spec.ts`；与 `43b6d79..76abe92` 的 S0 代码足迹（去掉根 HANDOFF）逐一相同 |
| 这 12 个文件相对 `76abe92` | `git diff --stat 76abe92 HEAD -- <11 文件>` 为空；`UI_NAV.md` 单独 diff | ✅ 11 个文件字节不变；`UI_NAV.md` 只有第 120 行一对 −/+，内容为 “plan §2.2 / §7.4 … §7.4 为准” → “§9.4 … §9.4 为准”，适配语义未改 |
| S0 已审代码 = 本次代码 | `git diff --stat fab08a6 76abe92 -- frontend/ design/` | ✅ 空。A 原 S0 审查（固定 `fab08a6`）审的就是现在合入的代码 |
| main 的 H-01 代码 / 测试、AGENTS、docs、根 HANDOFF 未被反向覆盖 | `git diff --stat cf8e11b HEAD -- AGENTS.md HANDOFF.md docs/ frontend/e2e/theme.spec.ts frontend/src/modules/market-board/SampleChart.vue` | ✅ 空（唯一不同的 `design/ui/UI_NAV.md` 是 S0 自己的 4 行改动） |
| 相对 `76abe92`，非 specs / docs 的改动只来自 main | `git diff --name-only 76abe92 HEAD \| grep -v '^specs/\|^docs/'` | ✅ `AGENTS.md`、`HANDOFF.md`、`design/ui/UI_NAV.md`（节号）、`frontend/e2e/theme.spec.ts`、`frontend/src/modules/market-board/SampleChart.vue` |
| 没有 P3-1 修复 / 新功能 / 真实后端 / interaction jobs 代码混入 | 上两行 + `grep` `stores/app.ts:13` | ✅ `completed.value / 3 * 100` 仍在；S0 diff（`43b6d79..76abe92` 的 `frontend/src`）新增行中无任何 `num` 字样；`backend/` 无差异 |

### 3.2 规格与历史原件

| 断言 | 结果 |
|---|---|
| 根 `HANDOFF.md` == `cf8e11b` | ✅ `git diff --stat cf8e11b HEAD -- HANDOFF.md` 为空；内容为 main 的「agent 工作流重塑（PR #9）」交接，`docs/plan.md:230–248` 多处引用 |
| `handoff-v2-s0.md` == `76abe92:HANDOFF.md` + 页首 | ✅ 去掉页首 4 行后与 `76abe92:HANDOFF.md` 逐行 diff，**唯一差异**是 §2 G-02 行 “plan §7.4” → “plan §9.4”；页首（`d837b03` 版）已明确“第 1～7 节全部是 `76abe92` 时点的原文快照” |
| `spec.md` == `76abe92` == `fec3556` | ✅ 两次 `git diff --stat` 均为空；AC 去重 52 条 |
| `checklist-v2.md` == `76abe92` == `e596244` | ✅ 均为空；53 个已勾 / 0 个未勾；R4 结论行固定 `34ee795`、通过 |
| `checklist.md`（v1） == `cf8e11b` | ✅ 空 |
| `review.md` 以 `cf8e11b` 原文为逐字前缀 | ✅ `cmp` blob 前 595 行相同；只追加 §20（8 行，纯链接，numstat 8/0） |
| `manual-acceptance.md` | ✅ `cf8e11b` 原文为逐字前缀（含 main 的 M-08 “截图证据补充（T-19）”“采集补充记录（T-19）”两行）；后接 M-09～M-12；`- [ ]` 12 个、`- [x]` 0 个 |
| 历史 Analyze / S0 报告 / session-artifacts == `76abe92` | ✅ `cf8e11b..HEAD` 中这些文件均为纯新增，`76abe92..HEAD` 中不出现 |
| 空白检查 | `git diff --check 76abe92 HEAD` exit 0；`git diff --check cf8e11b HEAD` exit 2，恰 3 处，全部在 `session-artifacts/20261028-pause/`（`analyze-fixes…:16`、`tasks-opus…:351,371`），这些文件自 `76abe92` 起字节未变，属原样归档，不是本次引入 |

### 3.3 plan.md

| 断言 | 结果 |
|---|---|
| 标题结构 | HEAD：`## 1`～`## 6`、`## 7 H-01`、`## 8 M-08`、`## 9 v2 实施设计` + `### 9.0`～`### 9.14`（15 个） |
| v1 §1～§8 正文 == `cf8e11b` | ✅ HEAD 第 37～371 行与 `cf8e11b` 第 8～342 行 diff，唯一差异是 §8 末多出 “空行 + `---` + 空行” 分隔（来自 `76abe92` 原有 v2 段前分隔），无内容差异。main 的 H-01 页首行（“追加 §7”）原样保留 |
| v2 §9 == `76abe92` §7 机械迁移 | ✅ HEAD 第 372 行起与 `76abe92` 第 273 行起逐行 diff，所有差异行都是 `7.`→`9.` 标题或 `§7.x`→`§9.x` 引用；**AC、接口、H-x 表、风险表文字无任何其他改动** |
| 外部文档节号未误改 | ✅ §9.0 中 `docs/interaction.md §2.4、§3.3、§7.2` 保留 `§7.2`（本人用全局替换复现时会误改此处，HEAD 正确未改）；§9 正文无其它残留 `§7` |
| 页首 | 新增“主线合并与编号迁移”行（含完整映射与不迁移清单）；S0 归档行交接指针改为 `handoff-v2-s0.md`；其余 v2 历史行只有 §7→§9 |

### 3.4 tasks.md

| 断言 | 结果 |
|---|---|
| v1 页首 1～8 行 == `cf8e11b` 1～8 行 | ✅ 相同；第 10 行新增一行“主线合并（2026-10-29）”指引 |
| v1 正文（「## 约定」～「## AC 覆盖」末）== `cf8e11b` | ✅ HEAD 第 19～440 行 vs `cf8e11b` 第 9～429 行，唯一差异是末尾多一个空行。T-01～T-19、P3 台账（含 H-01 / H-02 后续）、H-01 / M-08 Review 备注、AC 覆盖表完整；T-18 / T-19 引用的 plan §7 / §8 未被迁移 |
| v2 段 == `76abe92` v2 段机械迁移 | ✅ 逐行 diff：标题 “plan §7”→“plan §9”、所有 `plan §7.x`→`§9.x`；新增“主线合并登记”块（7 行）。任务定义、完成标准、验证命令、依赖、工时未改；tasks 自己的“§9 第 3 步”“第 7 节矩阵”在两版中一致、未被误改 |
| 计数 | ✅ `#### T-V2-01`～`T-V2-12` 共 12 个；§9 表合计 22 h；登记 “T-V2-01 / 02 completed”、10 项 blocked；§7 矩阵 52 个 AC 与 spec AC 集合**集合相等**（`diff` 为空）；§1.2 H 表 8 行行尾“未交付” |
| §1.3 P3-1 | ✅ 仍为“后续候选，未修复，未获 Walter 风险接受”，不计入 12 项 / 22 h |

### 3.5 specs/README.md 与设计资产

- 状态行：`blocked`，写明 v1 / H-01 / T-19 已交付、v2 仅 S0 完成并经授权阶段合入、10 项 blocked、未收敛（外部阻塞）；保留 PR #7 / #8 / #10 事实。
- 跨 feature 队列：main 新增的 D-020 / D-022 / D-023 / D-024 各行与表尾说明保留；本方 H-x 行在第 33 行，写作 “plan §9.3（原 §7.3）”，与 tasks §1.2 规则 5 引用的行号一致。
- “D-018 → frontend-workbench v2（Gate 1 待批）”行：`76abe92` 已删、`cf8e11b` 未改，三方合并结果为删除，与 spec v2.1 已改入“格物致知”、`nav.ts:17` 已实现一致。
- “日报”菜单未改名：`nav.ts:12` 仍为“日报”，与 `docs/designUI.md:68`（D-022，改名留 v2 Clarify）一致；九项顺序与 `designUI.md:67` 逐项相同。main 的 D-020～D-024 不追加冻结 spec 义务，本次没有新功能或新 Clarify。

## 4. 验证证据的来源区分

| 证据 | 来源 | 本会话态度 |
|---|---|---|
| `3f63273` 上 `pnpm -C frontend test` = 六守卫 / typecheck / lint 通过，unit/component **564/564**，e2e **70/70**；`build` exit 0，仅 779.98 kB chunk 警告；H-01 两档用例与 S0 用例同轮通过 | Astra 亲跑，`validation-main-integration.md`（`9e68233`） | **查阅、非亲跑**。指令禁止重复测试。静态一致性：`76abe92` 时 S0 回归为 564 + 68（`implementation-v2-s0.md`），main H-01 在 `theme.spec.ts:61–62` 以 `[width, min_width]` 循环新增 2 条 e2e → 68 + 2 = 70，unit 数不变；`3f63273..HEAD` 无代码改动，故该验证对 `d837b03` 同样成立 |
| S0 限定代码审查 0 P1 / 0 P2 / 1 P3，A 亲跑 31 unit / 32 e2e | `review-v2-s0.md`（固定 `fab08a6`，产物 `6acfd30`） | 旧阶段证据，只证明 S0 代码本身；本轮已实测 `fab08a6` 与 `76abe92` 的 frontend / design 零差异，因此其结论适用于本次合入的同一代码，但**不与本轮 70 e2e 混算** |
| 独立集成 Analyze 0 P1 / 0 P2 / 2 P3 | `analyze-main-integration.md`（固定 `3f63273`） | 其 C1～C18 本轮按 §3 独立复做，结果一致；其 F-01 / F-02 见 §5 |
| 本报告 §3 全部断言 | 本会话亲跑只读 git | 亲测 |

Analyze 报告自述的一次 `> /tmp/x` 只读指令违规：本轮实测 `C:/Users/iswal/AppData/Local/Temp/x` 已不存在；仓库 `3f63273..d837b03` 只有 4 个 md 新增 / 微改，`git status` 干净。披露属实、不在仓库内、未掩盖，也不构成代码被改的证据。

## 5. 发现

### F-01（P3，清理台账时点；不阻断合入）

- **现象**：`merge-main-cleanup.md` §7 表第 7 行把“未 push、须先 PR 合入 main 再清理”的保护对象写为 `-integration` 树（当时 `76abe92`，现 `3f63273`），第 12 行把本目录登记为 `review/frontend-workbench-v2-s0-code @ 6acfd30`。实测当前最前沿提交 `d837b03` 在 `spec/frontend-workbench-v2`（目录 #1 `Futures-AI-workbench-v2`）和 `review/frontend-workbench-v2-main`（目录 #12，本会话 cwd，协调器复用后新建分支）；`-integration` 仍停在 `3f63273`，`-implement` 在 `9e68233`。页首“后续验证登记”已说明 merge 与后续提交，但 §7 表本身未更新。
- **影响**：若协调器按表字面只保护 `-integration`，可能在 PR 合入前移除目录 #1 / #12。由于清理边界已规定“不删除分支 ref”，提交不会丢失，故为 P3；但 PR head 若取错分支，会漏掉 `9e68233` / `d837b03` 及本报告。
- **最小建议**：协调器在清理前（不改本提交）：① 以包含 `d837b03` + 本报告提交的分支为 PR head；② 对 14 个目录逐一 `git rev-parse <branch>`，确认每个分支 ref 保留且 PR head 包含 `3f63273`；③ 目录 #1 / #12 / #7 在 PR 合入 main、且使用它们的会话结束后再移除。不需要改文档。

### 对独立 Analyze F-01 / F-02 的复核

- **F-01（P3，S1-track 前瞻约束）**：同意。实测 H-01 用例 `theme.spec.ts:119–131` 要求 `/workbench` 上除 `.sample-chart figcaption` 以外的所有 `span.num` 为 `display: block`；S0 diff 新增行无任何 `.num` 元素（`TopBar.vue` 的“投放”按钮为纯文本 `<button>`），S0 不受影响。约束只在 S1-track 的 `JobTrack` 卡片引入数字时生效，T-V2-11 / 12 全量测试能拦住。按 AGENTS §2 第 8 步，等 S1 开工前的 Analyze / Tasks 轮补注，本次不改 tasks，正确。
- **F-02（P3，handoff 时态）**：已由 `d837b03` 关闭——`handoff-v2-s0.md` 页首第 3 行现写“下方第 1～7 节全部是 `76abe92` 时点的原文快照，包括‘尚未 PR / main 合并’”。本轮实测该页首与正文差异仅此。

### 既有登记（不变）

- **P3-1**（`review-v2-s0.md` §3）：`stores/app.ts:13` `/ 3 * 100` 仍在；tasks §1.3 登记为后续候选；**未修复、未获最终风险接受**，留最终 Gate 2 处置。
- v1 的 11 项已接受 P3、A-H01-P3-1、A-M08-P3-1、H-02：台账原文未改，本轮不宣称关闭。
- M-01～M-12：0 checked / 12 unchecked，无人代勾。

## 6. 未发现的问题（明确排除）

- 没有把真实的 H-x 外部阻塞泛化为本次 S0 合入的 P2：合入内容只含 S0 已审代码与文档，S1 / S2 任务保持 blocked，闸门未放松。
- 没有反向覆盖 main 的 AGENTS / docs / D-020～D-024 / candidates / H-01 代码 / T-19 证据 / 原 v1 审核件（§3.1、§3.2 全部为空 diff）。
- 没有为对齐行号改动固定旧 SHA 的审核原件；页首映射已写明 “plan §7.x 读作 §9.x”。
- 没有 P3 修复、新功能、真实后端或 interaction jobs 代码混入。

## 7. 对协调器：可否进入 PR / merge 与清理前置

**可以按用户的阶段合入指令进入 PR / merge**（0 P1 / 0 P2），前提：

1. **fetch 核实远端**：本会话只看到本地快照 `origin/main = cf8e11b`。开 PR 前确认远端 `main` 仍为 `cf8e11b`；若已前进，需重新 merge 并重做集成 Analyze 与本复核。
2. **PR head**：取包含 `d837b03` 与本报告提交的分支（见 F-01），不以 `3f63273` 或 `9e68233` 单独为 head（否则丢失验证 / 分析 / 本复核记录）。
3. **不预写结果**：PR 号、merge SHA、清理结果以 GitHub 记录与协调器执行摘要为准；本报告与 `merge-main-cleanup.md` 都不回填。
4. **清理顺序**：PR 真正合入 main 之后，才按 `merge-main-cleanup.md` §7 白名单（14 个 `Futures-AI-workbench-v2*`，本轮 `git worktree list` 实测路径与分支逐一对应）只移除工作树目录、**保留全部分支 ref**；主仓 `Futures-AI`、`Futures-AI-desktop-*`、`Futures-AI-docs*`、`Futures-AI-interaction*`、`fw-T-15` 不在范围。本会话不删除任何文件或目录。
5. **Gate 边界不变**：本次通过只覆盖阶段集成安全；v2 最终 Review、Gate 2、正式 Handoff、P3-1 处置、M-01～M-12 人工复核、“日报”改名 Clarify 均未进行，待后续流程。

REPORT_END_REVIEW_MAIN
