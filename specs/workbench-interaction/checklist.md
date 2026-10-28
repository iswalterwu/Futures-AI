# Feature: workbench-interaction 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求 / 设计质量达标，不代表实施完成。实施者不勾选本文件。
>
> **审核员**：A = claude-fable-5-1 **via anthropic**（`--model anthropic/claude-fable-5-1`），独立新会话，与实施模型隔离。
> **切换原因**：2026-10-28 接手时 `claude-bridge` 实测返回 `quota exceeded / rate limit (seven_day) / monthly spend limit`，按 AGENTS.md §2 第 5 步改走同一模型的 Anthropic API 通道；只换接入路径，审核员身份不变。
> **单审**（AGENTS.md §2 第 5 步）：本文件结论即审核结论。
>
> **本轮性质**：Plan 后首轮 Checklist（第一轮）。**尚无 tasks.md**；凡涉及 Tasks / Analyze / 测试执行 / Handoff 截图的项目一律不勾选，只写阶段说明。
>
> **基线**：
> - 冻结 spec：`cfb6c66`（Walter 2026-10-28 Gate 1 批准；9 条需求 / 46 条 AC；Q-001～Q-012 已裁定）。审核时 `spec/workbench-interaction` 分支上的 `spec.md` 与 `cfb6c66` 版本 md5 一致（`7c689362…`）。
> - Plan：`d52e784`（= `spec/workbench-interaction` 分支 tip；`plan.md` md5 `4064e740…` 一致）。
> - 前端地基：`D:/2030/Futures-AI-frontend`，`feat/frontend-workbench` @ `fdaa7d8`（T-01～T-08 已合入；T-09～T-15 进行中）。只读。
> - `spec/frontend-workbench-v2` 草稿未经 Gate 1，**不作为已交付依赖**。
> - 审核期间本 worktree 被其他会话从 `spec/workbench-interaction` 切到 `feat/desktop-shell`（HEAD `71a80bd`）；本审核员**未切换分支**，后续行号均经 `git show spec/workbench-interaction:…` 读取；本文件以未跟踪文件写入指定路径，未暂存、未提交。
>
> **审查范围**：AGENTS.md、docs/plan.md、docs/interaction.md（§3.2/§3.3/§3.4/§3.5/§7）、docs/designUI.md（§2.4/§3/§5.2/§7）、docs/architecture.md、D-016 / D-017 / D-011、spec.md、plan.md、templates/checklist.md、前端 `specs/frontend-workbench/{spec,plan,tasks,checklist}.md`、前端真实代码 `frontend/src/contracts/{types,client,methods,index}.ts`、`contracts/mock/index.ts`、`contracts/real/index.ts`、`src/agent/events.ts`、`scripts/contract-build.mjs`、`scripts/check.mjs`、`src/app/{nav,router}.ts`、`AppShell.vue`、`TopBar.vue`、`src/stores/*`、`src/design/{glass.css,tokens.json}`、`package.json`。
> **未执行**：未安装依赖、未运行任何测试或应用、未启动其他 agent、未读用户凭证、未修改 spec / plan / docs、未 commit / push。
>
> **口径**：只在确认满足时勾选；未勾选项写原因与位置（文件 + 行号）。阻断项 **B-xx**（任一未闭环 = 未通过），建议项 **S-xx**（不阻断、不计入判定）。每项阻断标注"设计补全"（Plan 内闭环）或"需求变更"（回流 Clarify）。

---

## 结论（第一轮）：**未通过**

阻断 **B-01 ～ B-08**（全部为**设计补全**，无需求变更、不需回流 Clarify、不动冻结 spec）。Plan §5 的 46 行映射对 46 条 AC 全部"有一行"，但逐条核到契约方法、场景、状态迁移与版本语义时，**15 条 AC 的设计不闭环**（见"逐 AC 映射"表）。Plan 修订后需**第二轮定向复核**（仍由 A 独立会话执行），复核通过前不得进入 Tasks。

---

## 需求完整性

- [x] **N-01 每条编号需求至少有一条可验证的验收规则。** spec R-001～R-009 共 46 条 AC（5 / 5 / 6 / 5 / 6 / 8 / 5 / 4 / 2），编号连续，每条写明验证形态（组件 / 端到端 / 契约 / 静态 / 人工）。
- [x] **N-02 无未澄清歧义。** spec §5 Q-001～Q-012 全部"按推荐（2026-10-28 Walter）"并给出融入位置；冻结后无新增问题。
- [x] **N-03 目标与非目标边界清晰。** spec §2：交付作业对象 / 四阶段 / 四台 / 介入与不干扰 / 契约 v2 + mock / 可验收性；排除验证队列、学习区、闸门、协议、真实 api / agent / 解析、完整块编辑器、导出、导航与作业轨道本体（归 v2）。
- [ ] **N-04 spec 每条 what 与 AC 在 plan 均有可实现的设计落点。** 未满足。缺口集中在：spec 已写明的写行为没有契约写路径（B-01）、AC 直接依赖的契约声明 / 字段缺失（B-04）、重跑状态迁移未定义（B-03）、角标 / 收件箱语义未定义（B-08）。详见阻断表。

## 一致性

- [ ] **I-01 spec / plan / tasks 之间无冲突。** tasks 尚不存在（阶段说明，不勾选）。spec ↔ plan 已发现冲突：① plan:120 "批注/追问/教规则/否决 → 对应契约方法"，但 plan:80–91 方法表中没有任何分析介入方法（B-01）；② plan:60 "`scenario !== normal` 时不恢复本地状态"与 plan:123 "重置 mock 状态与本地快照"语义不一致（B-02d）；③ plan:11 "1.x 数据可解析"与前端 `types.ts:66` `contractVersion: z.literal(CONTRACT_VERSION)` 矛盾（S-01）。
- [ ] **I-02 与 docs/ 决策与 ADR 无冲突。** 已核无冲突项：D-016 结论 2/3/5/9（作业一等对象、旁路介入、块模型、三层玻璃）✓；designUI §2.4 状态徽文案 + 图标、不新增色值（plan:12–13）✓；§3.9 作业轨道 / 阶段轨道不新增玻璃层 ✓（plan 复用 `glass-*` 三类，`check.mjs:269` 强制）；§5.2 六类块 ✓；D-015 与主线 D-013 未混淆（plan 未引用）✓；D-017 仅作边界引用 ✓。**未闭环**：interaction §3.3 R1（编辑不覆盖、可回滚）与 R3（冲突只在发布检查点要求处理）、designUI §3.5-3（冲突芯片、发布检查点集中处理）在 plan §4.5 发布流程与 `resolveRevision` 语义中没有落点（B-05）。
- [x] **I-03 前端基线事实核对（代替"组件存在"的推定）。** 已读真实代码：`contract-build.mjs:6–7/41/47` 由 `contractSchemas` + `methodSemantics` 表驱动，新方法只需进 `methods.ts`（plan:16 "如方法表驱动则无需改"成立；新 schema 须进 `contractSchemas` 注册表或改脚本）；`methods.ts:101/123` 的 `satisfies RequestMethods<…>` 会强制每个新 `DataClient` 方法有语义条目（利于 AC-008-1）；`check.mjs:269–278` glass 三类白名单真实存在（AC-007-5 继承成立）；`check.mjs:313–320` network 白名单只含 `src/contracts/real/`（AC-008-3 继承成立）；`mock/index.ts:56–58` `MockOverrides.fixtures` 为封闭键集、`types.ts:68` `scenario` 为封闭枚举（扩展场景须改 schema）。**基线上不存在**：`src/agent/{store.ts,AgentDrawer.vue,AgentDock.vue,CotTimeline.vue}`（T-13）、`src/design/theme.ts`（T-12）、`src/modules/`、`src/stores/{layout,badges}.ts`——plan:48 的"复用"与 plan:156 的"既有暗色主题"目前是**对未来产物的依赖**（B-06）。
- [x] **I-04 文件边界与回滚一致。** spec §4 "只改 `frontend/`（+ `specs/README.md`、`.gitignore`）" = plan:14–17 所有权清单 = plan:189 回滚块；不碰 `backend/`、`docs/` 权威内容、冻结的 `specs/frontend-workbench/spec.md`。

## 可测试性

- [ ] **V-01 每条验收规则可映射到自动测试或人工验收步骤，且被映射的设计存在。** 46 条中 31 条映射成立、15 条存在设计缺口（逐条见下表）。"有一行映射"不等于"可测"：AC-005-3 / AC-005-4 / AC-006-3 / AC-007-3 所断言的契约方法与事件 kind 在 plan 中不存在；AC-002-4 要求断言的"状态迁移"未定义；AC-007-2 / AC-008-2 依赖的场景驱动未定义。
- [ ] **V-02 任务粒度与验证命令满足 tasks.md 模板要求。** 阶段不适用（尚无 tasks.md）。要求：Tasks 产出后由 A 独立复核——每条完成标准引用 AC 编号、完成标准与验证命令一一对应、0.5–2h、依赖无前向无环；v2 集成任务显式 `blocked_by`。
- [x] **V-03 静态守卫声称与真实脚本一致。** AC-007-5 → `check --only glass`、AC-008-3 → `check --only network`、AC-008-1 → `check --only generated`（重生成 `contracts/*` 逐字节比对，`check.mjs:189–197`）均已对照真实脚本确认，不是"沿用"空话。spec R-009 what 中"状态徽不只靠颜色 / 来源徽覆盖"两项静态守卫在 plan 中以组件测试承担（S-03）。

### 逐 AC 设计映射（46 条；"✓" = 设计闭环可测，"✗" = 缺口，"◐" = 部分 / 受前置阻塞）

| AC | plan 落点 | 判定 | 说明 |
|---|---|---|---|
| AC-001-1 | plan:36/129 `JobListPage` + `JobCard`；fixtures | ✓ | |
| AC-001-2 | plan:54/130 `jobsStore.filter`、`listJobs(filter?)` | ✓ | 更新时间倒序建议写入 `listJobs` 语义（S-05） |
| AC-001-3 | plan:117/131 `createJob` → `/jobs/:id/collect` | ✓ | |
| AC-001-4 | plan:132 `scenario=empty/error` | ✗ | `empty` / `error` 对 `listJobs` / `getJob` 的行为未定义（B-02b） |
| AC-001-5 | plan:133 `JobStatusBadge` 映射单测 | ✗ | AC 要求"状态→文案映射**由契约声明**"，plan 的映射在组件内，契约无此声明（B-04a） |
| AC-002-1 | plan:37/69/134 `StageRail`、`StageState` | ✓ | |
| AC-002-2 | plan:30/135 `router.replace`、未知 stage 回落 | ✓ | |
| AC-002-3 | plan:136 `job-running` 含 `needs_human` | ✗ | 作业级 `status` 与四个 `StageState` 的组合规则未定义（哪一阶段 needs_human、其余阶段是否 running、横幅"对应阶段"如何确定）（B-02a） |
| AC-002-4 | plan:83/119/137 `rerunStage` → kind=rerun | ✗ | AC 要求断言"mock 状态迁移"；plan 未定义迁移到哪些 `StageState`、产物版本如何保留（B-03） |
| AC-002-5 | plan:138 failed/cancelled fixtures | ✗ | `Job` 类型（plan:71）无失败 / 取消原因字段；且无任何动作能把作业置为 cancelled（B-04b、B-01e） |
| AC-003-1 | plan:139 三处入口；工作台入口 blocked_by v2 | ◐ | 顶栏"任意页面可用"与工作台入口归 v2（plan:197）；v2 未过 Gate 1 → 本 AC 在 v2 合入前不可能全绿，Converge 不得报"已收敛"（B-06、S-10） |
| AC-003-2 | plan:140 三种投放 + 白名单 | ✓ | |
| AC-003-3 | plan:141 用途必填 + payload 断言 | ✗ | 来源说明字段（用途 / 可靠性 / 时效 / 口径）未进 `Upload` 类型定义（plan:74 只写"投放元数据、来源说明"）；payload 持久化子集未定（B-04e、B-07） |
| AC-003-4 | plan:142 `ExtractionPreview` / `MappingEditor`、`confirmIntake(uploadId, mapping)` | ✓ | 单位修正是否在 `mapping` 内、确认前状态值建议写明（S-06） |
| AC-003-5 | plan:143 `UnassignedPool` + `assignUpload` | ✓ | |
| AC-003-6 | plan:144 抽取状态徽 | ◐ | 待验证 / 已入库 / 隔离枚举未在类型表登记（并入 B-04e） |
| AC-004-1 | plan:145 `ProcessWorkspace` / `RecipeSteps` / 溯源 | ✓ | |
| AC-004-2 | plan:146 `updateParams` → 事件 + 待合并 | ✓ | kind（`recipe` / `map_fix`）须在 B-01 的动作→kind 矩阵中登记 |
| AC-004-3 | plan:147 `ReconciliationDiff` | ✓ | |
| AC-004-4 | plan:148 `markProvisional` → 下游徽 | ✓ | |
| AC-004-5 | plan:149 三态 | ✗ | `getStageWorkspace` 在 `empty` / `error` 下的返回未定义（B-02b） |
| AC-005-1 | plan:150 `ConclusionCard` | ✓ | |
| AC-005-2 | plan:151 `EvidenceChain` | ✓ | |
| AC-005-3 | plan:152 `InterventionComposer` 五类操作 | ✗ | **无契约方法**承载批注 / 追问 / 深挖 / 删除 / 否决；五动作 → kind 映射未给（"深挖""批注"在 13 种 kind 中无对应）（B-01a） |
| AC-005-4 | plan:153 `RuleCandidateDialog` + pin_rule | ✗ | 无契约方法；"candidate"标注落在哪个字段未定（B-01b） |
| AC-005-5 | plan:48/154 抽屉 `jobContext` 标签 | ◐ | `AgentDrawer.vue` / `agent/store.ts` 在基线不存在（T-13 未完成）；接线时机与所有权未定（B-06） |
| AC-005-6 | plan:155 三态 / 冲突场景 | ✗ | `job-conflict` 场景下结论卡 / 阶段 / 产物各自的 `conflict` 分布未定义（B-02a） |
| AC-006-1 | plan:156 六类块 + chart-spec + 主题 | ✗ | chart 块载荷形态（designUI §5.1 `{template_id, series_bindings, overrides}` 或编译后 option）未在类型表定义；`theme.ts` 基线不存在（B-04f、B-06） |
| AC-006-2 | plan:157 inline 编辑 → revision（来源=人） | ✓ | |
| AC-006-3 | plan:88/158 `createBlockComment` | ✗ | 只有"新建"；**回复、标记已解决无契约方法**；`BlockComment` 状态 / 线程结构未定（B-01c、B-04c） |
| AC-006-4 | plan:89/159 `listRevisions` / `getRevision` | ✓ | `Revision` 的版本号 / 作者 / 时间 / 摘要 / base 字段建议在类型表列明（并入 B-04d） |
| AC-006-5 | plan:46/160 `DiffView`、`diff.ts` | ✓ | |
| AC-006-6 | plan:90/121/161 `requestRevision` + 回放 + `resolveRevision` | ✗ | "回退"的语义未定义：按 R1 必须是新 revision 而非删除；`action` 枚举未给（B-05a） |
| AC-006-7 | plan:121/162 `publishDeliverable` | ✗ | 发布检查点对未解决 `conflict` / `pendingMerge` 的处理未定义（interaction R3、designUI §3.5-3）；发布后只读在契约层如何拒绝写方法未定（B-05b/c） |
| AC-006-8 | plan:163 块徽 | ✓ | |
| AC-007-1 | plan:73/164 `InterventionHistory` + 筛选 | ✓ | 字段命名（spec 为 snake_case，既有契约为 camelCase）须在契约中一次定清（并入 B-04g） |
| AC-007-2 | plan:122/165 `job-pending-merge` 场景 | ✗ | 运行如何开始未定义：mock `AgentClient` 只在 `send()` 后发事件（`mock/index.ts:137–166`），plan:95 的 `jobScript` 语义与触发点缺失（B-02c） |
| AC-007-3 | plan:166 删除 / 发布 / 取消二次确认 | ✗ | 无取消作业、无删除来源方法；"删除结论"也无方法 → 二次确认无动作可挂（B-01d/e） |
| AC-007-4 | plan:45/55/167 `inboxStore` | ✗ | "待处理介入"的产生规则、"轨道"指阶段轨道还是工作台作业轨道（后者归 v2）、收件箱条目来源均未定义（B-08） |
| AC-007-5 | plan:101/168 `check --only glass` | ✓ | 已核 `check.mjs:269–278` |
| AC-008-1 | plan:92/169 `contract-build` + 对拍单测 | ✓ | 已核生成器表驱动；新 schema 须加入 `contractSchemas`（S-07） |
| AC-008-2 | plan:96/170 场景清单单测 + e2e | ✗ | 九个场景中四个 `job-*` 的 fixture 组成与既有三个（empty / error / slow）对 v2 方法的行为未定义（B-02a/b） |
| AC-008-3 | plan:101/171 `check --only network` | ✓ | 已核 `check.mjs:313–320`；`File.text()` / URL 粘贴不触发网络（plan:110） |
| AC-008-4 | plan:11/172 CONTRACT.md 2.0.0 + 变更说明 | ✓ | 版本字面量与"1.x 可解析"措辞见 S-01 |
| AC-009-1 | plan:106/173 `pnpm test` | ✓ | 命令已定义；实现时登记输出 |
| AC-009-2 | plan:105/174 `manual-acceptance.md` M-01～M-10 | ✓ | 十项内容目前只有计数，建议在 plan 列出各项"看什么"（S-09）；截图属 Handoff，本轮不声称 |

## 工程准则（AGENTS §5）专项核查

- [ ] **P-1 不为猜测场景加复杂度、不悄悄扩大范围（§5.1）。** 基本符合：行级 diff 自实现 + 2000 行上限、512KB 降级、mock 单一可变状态层均有 AC 或风险依据，不引第三方 diff 库。**一处待去除**：plan:54 `jobsStore` "运行态轮询（mock 立即返回）"——状态变化全部来自契约方法返回值与 agent 事件流，轮询没有需求来源（S-02）。非阻断，Plan 修订时删或给依据后勾选。
- [x] **P-2 外部数据只在入口层校验（§5.2）。** plan:57–58 契约 mock 层持有唯一可变状态、读写经契约方法；沿用 `methods.ts` 的 `validation` 约定（边界 parse 一次）；localStorage 损坏在 `persistence.ts` 边界重建（plan:46/102）。
- [x] **P-3 不提前抽只用一次的抽象（§5.3）。** `diff.ts` / `persistence.ts` 各有多处消费者（diff 视图 + 变更摘要；jobs + inbox 快照）；徽标三组件对应 designUI §6 具名概念；不复制第二套对话组件（plan:48）。`sessionStore`（plan:56）若仅为 `jobContext` 透传，Tasks 时可并入 `jobsStore`（信息级）。
- [ ] **P-4 主函数只写正常流程（§5.4）。** 代码级准则，Plan 阶段不适用；Review 阶段核 `job-state.ts` 各方法与 `IntakeDrawer` 提交流程。
- [x] **P-5 自动生成文件不手改（§5.5）。** `contracts/{CONTRACT.md,schema.json}` 继续由 `contract-build.mjs` 生成、`check --only generated` 逐字节比对（plan:92/101/112）；本 feature 不新增生成物类别。
- [x] **P-6 测试测真实实现、少用 mock（§5.6）。** 组件 / e2e 测真实组件，数据经契约 mock 在系统边界注入（spec R-008 要求的形态）；`diff.ts` / `persistence.ts` 单测测真实函数；不 vi.mock 内部模块。提醒：diff 单测的期望值须手写样例，不得在测试里再实现一遍 LCS。
- [x] **P-7 按仓库现有流程、不引入未在用工具（§5.7）。** 栈与命令全部沿用 frontend-workbench（`package.json` 已核：Vue 3.5 / Vite 8 / zod 4 / Vitest 5 / Playwright 1.64 / pnpm 11）；不升级工具链（plan:8）。

## 其他自定义项

- [ ] **C-01 前置依赖与职责边界清楚。** 未满足（B-06）：① plan:16 把 `router.ts` 列为"共享文件（需与 v2 协调）"，但 plan:29 又由本 feature 改它注册路由——没有唯一所有者；② plan:180 "本 feature 分支基于该 feature 完成后合并"未指明起始基线（frontend-workbench Handoff 后的 commit，还是当前 `fdaa7d8`）；③ plan:48/156 复用的 `AgentDrawer.vue` / `agent/store.ts` / `theme.ts` 在 `fdaa7d8` 不存在；④ `specs/README.md:23` 把 frontend-workbench v2 与 api 列为依赖，而 AGENTS §2 规定"依赖未满足不得进入 Plan"——spec §4 已把二者改写为"不阻塞 mock 验收"的软依赖，状态表应区分硬 / 软依赖（S-04）。
- [ ] **C-02 契约闭环（spec 行为 ↔ 契约写路径）。** 未满足（B-01）：已写入 spec 的行为中，分析台五类介入、教规则、块批注回复 / 解决、取消作业、删除来源 / 结论没有任何 `DataClient` 方法；plan:120 的"对应契约方法"是空指。`listInterventions` / `subscribe(jobContext)` / `resolveRevision` / `rerunStage` / `markProvisional` 的读 / 写路径存在。
- [ ] **C-03 事件与状态闭环（R1–R6 旁路语义）。** 部分满足：plan:122 人的编辑即时落 revision 并标 `pendingMerge`、agent 不被打断、`run.completed` 为检查点、`failed/aborted` 保持待合并并提示——符合 R2 / R3，没有用"等人确认才继续"替代旁路 ✓。**未满足**：重跑迁移（B-03）、未运行时参数修正的 `pendingMerge` 何时清除（无 run 则无 `run.completed`；B-03）、合并结果以何种契约可见形态记录（kind 列表无 merge 类；B-02c）、冲突与发布检查点（B-05b）。
- [ ] **C-04 场景定义足以稳定验证。** 未满足（B-02）：四个 `job-*` 场景各含哪些作业、每个作业的 `status` × 四个 `StageState` × 产物状态组合、是否与 `normal` 叠加、`empty/error/slow` 对 22 个新方法（含写方法）的行为、`job-pending-merge` 的运行驱动，均未写；plan:60 与 plan:123 对非 normal 场景是否清空 `fai.jobs.v1` 说法相反。
- [ ] **C-05 版本与发布闭环。** 未满足（B-05）：人改 / agent 改各产生 revision ✓（plan:121）；但回退语义、`PublishSnapshot` 不可变性（发布后写方法拒绝码）、发布检查点对 conflict / pendingMerge 的处理、历史版本只读在契约层的保证未定义。
- [ ] **C-06 隐私与本地持久化自洽。** 部分满足：fixtures 为合成样例、不读真实 PDF、不落盘文件本体、URL 不抓取（plan:110、network 守卫）✓。**未满足**（B-07）：文本粘贴正文与 URL 是否进入 `fai.jobs.v1`（plan:60 列"投放"入快照、plan:110 又称"不写私有文档"），一次大段粘贴即可触发 512KB 降级；降级 / 损坏"提示"的界面落点缺失（frontend-workbench 已删除 Toast）。
- [x] **C-07 视觉与工程纪律。** 不新增颜色字面量与玻璃层级（plan:12–13）；状态徽 / 来源徽文案 + 图标，派生标记以来源徽 + 文字表达（designUI §2.4）；冲突徽对比度不足时"登记后继设计变更、不私加色值"（plan:185）；`accent.amber` / `text.*` 令牌在 `tokens.json:16–22` 存在。
- [x] **C-08 D-015 / D-013 编号未混淆；D-017 仅边界引用。** plan 未引用 D-015；spec §4 引用 D-017 "仅关联"；前端分支的旧八项导航未被用来否定 D-016（plan:195 明确 9 项归 v2）。

---

## 阻断项（B-01 ～ B-08；全部为设计补全，不需回流 Clarify）

| # | 类别 | 问题与位置 | 受影响 AC | 最小关闭要求 |
|---|---|---|---|---|
| **B-01** | 契约闭环 | plan:80–91 方法表缺以下写路径，而 plan:120 / :152 / :153 / :158 / :166 均声称经"对应契约方法"：(a) 分析台批注 / 追问 / 深挖 / 删除 / 否决；(b) 教它一条规则（pin_rule，candidate 标注）；(c) 块批注回复、标记已解决；(d) 删除来源（spec:142）/ 删除结论（spec:110）；(e) 取消作业（spec:142/148）。13 种 kind（plan:73）与五类分析动作的对应关系未给（"批注""深挖"无 kind）。 | AC-005-3、AC-005-4、AC-006-3、AC-007-3、AC-002-5 | 在 plan §2.4 增补方法（如 `submitIntervention(jobId, input)` 承载 a/b/d 结论侧、`replyBlockComment` / `resolveBlockComment`、`cancelJob`、`removeUpload`；形态由实施者定，但须进 `methods.ts` 语义表与 CONTRACT.md），并给出一张 **动作 → 方法 → kind → payload 必填字段** 矩阵覆盖 spec 全部介入动作（含 AC-004-2 的参数修正、AC-006-6 的改稿、AC-002-4 的重跑、AC-006-7 的发布）。 |
| **B-02** | 场景与 mock 驱动 | (a) plan:95–96 / :119 / :136 / :155：四个 `job-*` 场景的 fixture 组成未定——每场景含哪些作业、各作业 `status` 与四个 `StageState`、产物 / 结论 / 块的状态分布；`needs_human` 作业的其他阶段是否 `running`（R3 下游继续）；避免单一作业同时承担互斥情景。(b) 既有 `empty / error / slow` 对 22 个新方法（含写方法）的行为未定（`mock/index.ts:70–76` 现只对 `moduleFixtures` 报错）。(c) plan:122 / :165 `job-pending-merge`："检查点事件"来自哪一次 run——mock `AgentClient` 只在 `send()` 后发事件（`mock/index.ts:137–166`），plan:95 `jobScript` 的触发点与语义缺失；合并结果以何种契约可见形态记录（kind 列表无 merge / checkpoint）。(d) plan:60 "不恢复本地状态"与 plan:123 "重置 mock 状态与本地快照"相反。 | AC-001-4、AC-002-3、AC-004-5、AC-005-6、AC-007-2、AC-008-2 | plan §2.4 增一张 **场景 × 方法行为表**（九个场景 × 读 / 写方法：返回 / 拒绝码 / 延迟）与 **场景 × 作业样本表**（每场景的作业 id、status、四个 StageState、关键产物状态）；明确 `job-pending-merge` 的驱动（推荐：用户在作业内经抽屉 `send({jobContext})` 走 `long` 脚本，不另造 `jobScript`；若保留 `jobScript`，定义其触发时机与是否绕过 `send`）；明确合并结果的记录形态（如原介入事件 `outcome` 更新为 `merged` / `pending`）；统一 plan:60 与 plan:123：非 normal 场景只读 fixture、**不写不清**用户的 `fai.jobs.v1`。 |
| **B-03** | 事件与状态闭环 | plan:83 / :119 / :137 `rerunStage` 只写"新介入事件"：未定义本阶段及下游 `StageState` 迁移（如 → `running`，再由何事件置 `done`）、作业级 `status` 同步、产物版本保留方式（按 R1 应为新 revision、旧 revision 可见）、运行中重跑与 `pendingMerge` 的关系；AC-002-4 明文要求断言"mock 状态迁移"。同类缺口：无 run 时（直接 `updateParams`）产物的 `pendingMerge` 何时、由谁清除（plan:122 只定义了有 run 的情况）；`needs_human` 横幅"对应阶段"取自哪一字段。 | AC-002-4、AC-004-2、AC-002-3 | plan §4.3 写明 `rerunStage` 的状态迁移表（本阶段与下游 StageState 前 → 后、job.status 前 → 后、产物 revision 变化），以及 `pendingMerge` 的两条清除路径（有 run：终态事件；无 run：即时合并或显式"检查点"动作，二选一并写明）；注明横幅目标 = `StageState === 'needs_human'` 的首个阶段。 |
| **B-04** | 契约类型完整性 | plan:66–76 类型表缺 AC 直接依赖的声明：(a) 状态 → 文案映射由契约声明（spec:51），现只在 `JobStatusBadge` 组件；(b) `Job` 无 failed / cancelled 原因字段（spec:66）；(c) `BlockComment` 无状态（未解决 / 已解决）与线程 / 回复结构（spec:130）；(d) `Revision` 的版本号 / 作者 / 时间 / 摘要 / base 未列（spec:131）；(e) `Upload` 的来源说明字段（用途 / 可靠性枚举 / 时效 / 口径）与状态枚举（待验证 / 已入库 / 隔离）未列（spec:72–73/83）；(f) chart 块载荷形态未定（spec:128 "契约 chart-spec"；基线契约无 chart-spec 类型，chart-templates 未交付）；(g) `Intervention` 字段命名：spec:140 为 snake_case（`job_id / base_rev / created_at`），既有契约与 plan:76 `JobContext` 为 camelCase，plan:113 又写 `created_at`。 | AC-001-5、AC-002-5、AC-003-3、AC-003-6、AC-006-1、AC-006-3、AC-006-4、AC-007-1 | plan §2.4 类型表逐项补齐字段（可引用 zod 名，不必写全 schema）；(a) 以契约导出的 `JobStatusLabel` / `StageStateLabel`（或 schema `describe` + CONTRACT.md 表）作为唯一映射来源，组件只消费；(f) 选定 chart 块载荷 = designUI §5.1 的 `{templateId, seriesBindings, overrides}` 最小子集或 `SparkSeries` 复用，并说明与 chart-templates 的衔接；(g) 定一条命名规则（建议 camelCase，CONTRACT.md 注明与 spec 字段的对应），AC-007-1 按该规则断言。 |
| **B-05** | 版本与发布 | (a) plan:90 / :121 / :161 `resolveRevision(action)`：`action` 枚举与"回退"语义未定；按 interaction §3.3 R1"编辑不覆盖、可回滚"，回退须产生新 revision 而非删除。(b) plan:121 / :162 发布：未定义发布检查点对未解决 `conflict` 与 `pendingMerge` 的处理（interaction §3.3 R3、designUI §3.5-3 "发布检查点集中处理"），`job-conflict` 场景因此无可验证的收口行为。(c) 发布后"只读"与"快照不可变"在契约层如何保证（写方法对 delivered 作业的拒绝码；`PublishSnapshot` 与 `Revision` 的关系）未写。 | AC-006-6、AC-006-7、AC-005-6（冲突场景）、AC-006-4 | plan §4.5 补三句：`resolveRevision` 的 `accept / revert` 各自产生什么 revision；`publishDeliverable` 在存在 `conflict` / `pendingMerge` 块时的行为（推荐：发布对话框列出未决项并拒绝，返回 `validation_error`；或要求逐项"接受当前版本"后方可发布——二选一）；delivered 后 `saveBlockText / createBlockComment / requestRevision / updateParams / rerunStage` 一律拒绝（给出 code），历史 revision 与快照只读。无需改 spec。 |
| **B-06** | 前置依赖与所有权 | plan:16 共享文件无唯一所有者（`router.ts` 同时被本 feature plan:29 与 v2 修改；`agent/store.ts` 列为共享但 plan:48 要复用、plan:198 又由 v2 改）；plan:180 "基于该 feature 完成后合并"未给基线；`AgentDrawer.vue` / `agent/store.ts` / `theme.ts` 在 `fdaa7d8` 尚不存在（frontend-workbench T-12 / T-13 未完成）；AC-003-1 / AC-005-5 / AC-006-1 / AC-007-4 的可验收性依赖这些未来产物与未过 Gate 1 的 v2。 | AC-003-1、AC-005-5、AC-006-1、AC-007-4 | plan §1 增"基线与所有权"小节：① 本 feature 实施起点 = frontend-workbench Handoff 合入后的 commit（或明确可接受的最小前置任务集 T-12 / T-13 完成的 commit）；② 每个共享文件只有一个修改者（建议：`router.ts` 路由追加归本 feature、`nav.ts` / `TopBar.vue` / `AppShell.vue` / `WorkbenchPage.vue` 归 v2、`agent/store.ts` 的 `jobContext` selector 归本 feature 且只做新增），并写明接线顺序；③ 明确哪些 AC 在 v2 合入前只能标 `blocked_by`，且 Converge 报告须把它们列为"未收敛（外部阻塞）"而非通过。 |
| **B-07** | 隐私与本地持久化 | plan:60 把"投放"整体纳入 `fai.jobs.v1`，plan:110 又称"不写私有文档到 localStorage"：文本粘贴正文与 URL 是否入快照未定，一次长粘贴即触发 plan:111 的 512KB 降级，导致全部作业状态失去持久化；"降级并提示""解析失败重置"（plan:111/183）的提示落点未定（基线无 Toast）；与 B-02d 的"重置本地快照"叠加后，用户何时会丢本地状态不可预期。 | AC-003-3、AC-008-2、AC-001-4（错误态） | plan §3 写明 `Upload` 的持久化子集（建议：元数据 + 来源说明 + 映射 + 状态；文本粘贴正文不持久化或截断到固定长度并标注"已截断"，URL 只存字符串）；提示落点定为页面内横幅或收件箱条目（复用 B-08 的收件箱）；写明清空 `fai.jobs.v1` 的唯一触发（显式"重置样例数据"动作），场景切换不清空。 |
| **B-08** | 角标与收件箱 | plan:45 / :55 / :120 / :167 只写 `inboxStore` 与 `fai.inbox.v1`：未定义什么事件构成"待处理介入"（候选：阶段 `needs_human`、`conflict`、待合并结果、agent 改稿待接受 / 回退、重跑完成）、条目由契约方法返回还是前端从 `listInterventions` / `StageState` 推导（plan:186 禁止前端推导阶段状态，角标是否同理）、"轨道"指详情页阶段轨道还是工作台作业轨道（spec:143/149；后者归 v2 plan:196）、"查看收件箱后清除"清的是角标还是条目。 | AC-007-4 | plan §2.2 / §2.3 补一段：待处理项的来源枚举与生成规则（推荐经契约 `listInbox(jobId?)` 或在 `Job` / `StageWorkspace` 上带 `pendingCount`，与 plan:186 口径一致）；角标出现位置 = 作业列表卡 + 详情页阶段轨道（本 feature），工作台作业轨道角标标 `blocked_by v2`；"清除" = 已读状态写 `fai.inbox.v1`，条目保留。 |

## 建议（S-xx；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| S-01 | plan:11；前端 `types.ts:66` | `Bootstrap.contractVersion` 是 `z.literal(CONTRACT_VERSION)`，升 2.0.0 后 1.0.0 的 bootstrap 不可解析；把"1.x 数据可解析"改为"既有字段与方法语义不变"，或将 literal 放宽为 `^1\.|^2\.`；同时说明为何纯新增走 MAJOR 而非 MINOR（若理由是"场景与 `SendMessage` 枚举扩展对 real 实现属破坏"，写一句即可）。 |
| S-02 | plan:54 | 删除 `jobsStore` 的"运行态轮询"或给出需求来源（§5.1）。 |
| S-03 | plan:101；spec:168 | spec R-009 what 列的"状态徽不只靠颜色 / 来源徽覆盖"两项静态守卫，plan 以组件测试承担（AC-001-5 / AC-003-6 / AC-006-8 均为组件测试，可接受）；在 plan §2.5 写明这一对应，避免 Converge 时被当作缺口。 |
| S-04 | `specs/README.md:23` | 依赖列区分硬依赖（frontend-workbench 地基完成）与软依赖（v2 Gate 1、api），与 spec §4 "不阻塞 mock 验收"一致；否则与 AGENTS §2 "依赖未满足不得进入 Plan"字面冲突。 |
| S-05 | plan:80 | `listJobs(filter?)` 语义表写明默认排序 = 更新时间倒序（spec R-001 what）。 |
| S-06 | plan:118 | 写明 `submitIntake` 后状态 = 待验证、`confirmIntake` 后 = 已入库 / 隔离（mock 规则），以及单位修正属于 `mapping` 的一部分。 |
| S-07 | plan:92；`contract-build.mjs:41` | 新 zod schema 须加入 `contractSchemas` 注册表（或在 `job-types.ts` 导出后合并），否则不会进入 `schema.json` / CONTRACT.md 字段清单。 |
| S-08 | plan:102 | `diff.ts` 单测用手写样例作期望，不在测试内重写 LCS（§5.6）。 |
| S-09 | plan:105 | 在 plan 列出 M-01～M-10 各项主题（如 M-01 状态徽、M-05 图表块主题等已被 §5 引用），便于 Tasks 一次写全。 |
| S-10 | plan:139 / :187 / :209 | AC-003-1（及 B-08 裁定后可能的 AC-007-4 轨道部分）在 v2 Gate 1 + 合入前无法全绿：Tasks 的 H 组任务显式 `blocked_by: frontend-workbench-v2`，Converge 报告把它们列为外部阻塞；需 Walter 知悉本 feature 的"完成"依赖 v2 的时间线。 |

## Gate / Walter 知悉事项（本阶段不要求裁决）

1. 本轮 8 项阻断均可在 plan 内闭环，**不需要回流 Clarify、不动冻结 spec**。
2. 本 feature 实际可开工时点受 frontend-workbench T-09～T-15（尤其 T-12 主题、T-13 对话抽屉与 agent store）进度约束；plan 修订时应写死基线（B-06）。
3. AC-003-1 的工作台入口与可能的 AC-007-4 作业轨道角标依赖 `spec/frontend-workbench-v2` 过 Gate 1 并合入；在此之前本 feature 的 Converge 不能报"已收敛"（S-10）。
4. 审核期间本 worktree 被切到 `feat/desktop-shell`；本文件以未跟踪文件写入 `specs/workbench-interaction/checklist.md`，由实施侧在 `spec/workbench-interaction` 分支上纳入提交。

## 结构核验证据（只读，未安装依赖、未运行项目测试）

```text
SPEC      cfb6c66 == spec/workbench-interaction:specs/workbench-interaction/spec.md（md5 7c689362…）
PLAN      d52e784 == spec/workbench-interaction tip（md5 4064e740…）
AC_COUNT  5+5+6+5+6+8+5+4+2 = 46；plan §5 行数 46；编号集合一致
METHODS   plan §2.4 列 21 个 DataClient 新方法 + AgentClient.send(jobContext)；
          spec 写入的写行为中无方法承载：分析介入×5、pin_rule、批注回复/解决、取消作业、删除来源/结论
KINDS     plan 13 种 vs interaction §3.4 示例 10 种：多 question/rerun/publish；缺 merge/checkpoint；"批注""深挖"无映射
SCENARIO  既有 5（normal/empty/error/slow/boot-error，types.ts:68 封闭枚举）+ 新 4（job-*）；对 22 新方法行为未定
BASELINE  fdaa7d8：存在 contracts/{types,client,methods,index}.ts、mock/index.ts、real/index.ts、agent/events.ts、
          scripts/{contract-build,check}.mjs、app/{nav,router}.ts、AppShell/TopBar/Rail/LoadingScreen.vue；
          不存在 agent/{store.ts,AgentDrawer.vue,CotTimeline.vue}、design/theme.ts、modules/、stores/{layout,badges}.ts
GUARDS    check.mjs: glass 白名单 3 类(L269) ✓；network 仅 src/contracts/real/(L313–320) ✓；
          generated 含 contracts/* 字节比对(L189–197) ✓；contract-build 由 contractSchemas+methodSemantics 驱动 ✓
CONFLICT  plan:60 ↔ plan:123（非 normal 场景本地快照）；plan:120 ↔ plan:80–91（介入方法）；plan:11 ↔ types.ts:66（版本字面量）
```

## 结论与下一步

1. **未通过**。阻断 B-01～B-08 全部为设计补全；Plan 修订后由 A（独立新会话）做第二轮定向复核，逐项核闭环且确认其余内容未回退；通过后方可进入 Tasks。
2. Tasks 产出后另需 A 复核 V-02（任务模板、AC 引用、命令对应、依赖 DAG、`blocked_by` 标注）；Analyze 报告与 Converge 结论不得由本轮任何勾选代替。
3. 本轮只写入本文件；未修改 spec / plan / tasks / docs / 前端分支，未安装依赖、未运行测试、未 commit / push。
