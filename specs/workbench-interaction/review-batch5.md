# Feature: workbench-interaction 第五批代码 Review — 采集台闭环 T-A01a / T-A13a / T-A15a / T-B06 / T-C01 / T-C01a / T-C02 / T-C03 / T-C04（review-batch5.md）

> **性质**：AGENTS §2 第 10 步 Review 的**批次独立代码评审**。对象 = 固定代码 diff `b67a2279cb8ed94f71b4df5144a226bf321e27fd..e609c2e54e02ba1d11912c5c10cf229ada025cba -- frontend`（9 个前端提交 / 28 文件 / +3672 / −24）。**不是**全 feature 最终 Review、**不是** Gate 2、**不是** Handoff；不勾 checklist、不改代码 / 测试 / fixture / spec / plan / tasks / 旧 Review / Converge / docs / README / HANDOFF；不替作者修代码、不代 Walter 做风险接受或 §5.1 审批、不代 v2 消费方签收 ④、不造“小批 Gate 2”。
>
> **阶段记录（脱敏）**：A = **claude-fable-5-1 via anthropic**（`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`，PI_SESSION_ID `01a189bf-ca32-720b-919c-be4a55a4748b`），新开独立会话、与 Implement（openai/gpt-6-astra）异模型、与 Converge / Analyze（claude-opus-5-5）隔离。通道：协调窗口对 `claude-bridge` 的限额已有既有证据且无重置证据，按 AGENTS §6 规则 5 本会话**未对 bridge 发起任何调用**；fable 未单独探 bridge，不声称探过；官方 `anthropic/claude-fable-5-1` 近期真实调用成功，本轮全部工作走该通道。只换通道、不换模型；未改 provider / key / 路由 / 全局 pi 配置；不因测试或审核结论换模型。
>
> **固定输入**：复用只读审核树 `D:/2030/Futures-AI-interaction-review-batch4`（branch `review/workbench-interaction-batch4-code`），HEAD **`ca3c303f6abf87cf21ac8d77fa2f4b0c14e5b4ad`**，开始时 `git status --short` 为空（仅 ignored 的 `frontend/node_modules/`、`frontend/test-results/`）。`e609c2e..ca3c303` 只有 7 个 `specs/**` 文档 +388 / −15，**零 frontend 差异**（本会话 `git diff --stat` 核）。`af31dda`（r6.12.2）/ `19228ce`（r6.12.3）为纯文档提交（4 / 5 文件，只改 `specs/**`），父链 `6529f41 → af31dda → 19228ce → d4e3fb6`，许可**先于**对应代码提交发生。有效 Checklist = R11 原件 `1f99f80f547a53c5e996964907b533751e4cf804`，本树 `checklist.md` blob = `27a76aa6c3e4adcb817fed5d9b6512e1853061dd`（`git rev-parse` 两者相同；26 ☑ / 0 ☐）。冻结 spec blob `102af73bb448224fda5002430842868632b5b66a`（46 AC）。
>
> **重新读取**（不依赖会话记忆）：AGENTS.md §2 / §3 / §5 / §6；`docs/plan.md`；`docs/interaction.md` §3.3（R4 只对破坏性动作确认）；`docs/designUI.md` §2.2（涨跌作用域）/ §3.3（右侧常驻介入历史）；冻结 spec 全文（R-003 / R-007 / R-008 / R-009 与 46 AC）；plan.md 页首 r6.12～r6.12.4、§2.1 / §2.3 / §2.4 / §3 的【r6.12】【r6.12.1】【r6.12.3】【r6.12.4】段；tasks.md 页首 r6.12～r6.12.4 块、§2a（H-5 / 页面切片）、第五批 9 项全文（状态 / 依赖 / 修改范围 / 全部完成标准与 33 条验证命令原文）；checklist.md R11 页首与结论；analyze.md「Analyze R25」；implementation-log §20～§23；interface-handoff 页首 / §3；`review-batch3.md` R3-B 原文（§5 表与 §7 建议）；`review-batch4.md` / `review-batch4-r4a.md`（R4-A 关闭依据与 §5.1 口径）；`converge-batch5.md` 全文。源码逐文件读过：`stores/intake.ts`、`stages/{IntakePanel,IntakeDrawer,CollectWorkspace,ExtractionPreview,MappingEditor,UnassignedPool}.vue`、`components/{InterventionHistory,StageWorkspace}.vue`、`pages/{JobListPage,JobDetailPage}.vue` 本批 diff、`contracts/{types,client,methods}.ts` 与 `mock/{index,job-state}.ts` / `real/index.ts` 本批 diff、8 份新 / 改测试文件。
>
> **写入范围**：唯一写入 = 本文件（新建）。未改任何其他文件；`pnpm check` 重生成后 `git status --short` 仍为空（生成物与源一致）。本会话只读脚本、Playwright 探针（含到本树 `node_modules` 的目录联接）、日志与产物都在独占 Temp `C:/Users/iswal/AppData/Local/Temp/review-batch5-A/`（非项目产物，不入库，不清共享 tmp）。**未执行**：commit / push / merge / PR、派子 agent、新建 D:/2030 树、改 `playwright.config.ts` / 锁文件 / 全局配置、下载浏览器（探针复用本树 `channel: 'chrome'` 真实 Chrome）。4173 端口每次运行前核为空闲，运行后只剩 TIME_WAIT、无 LISTEN。
>
> **日期**：2026-10-30 02:20～02:40（+04:00）。

## 结论

**本批通过**（**0 P1 / 0 P2 / 5 P3**：R5-A～R5-E；另 5 项观察 O-R5-1～O-R5-5 不计入判定）。9 / 9 任务的完成标准在固定 diff 中逐条有真实实现与真实测试，33 条验证命令由本会话在 `ca3c303`（代码 = `e609c2e`）**全部亲跑且数字与实施者登记逐条相同**；两处 `intake.spec.ts` 例外与 r6.12.2 / r6.12.3 许可**逐行相同**、许可先于代码、未削减任何正向业务 / 隐私断言；禁写路径零差异。**R3-B 技术关闭**（§5）。Converge §5 的 O-B5-1 / O-B5-2 / O-B5-3 三项都在真实 Chrome 独立复现（§4），分级为 P3，理由与最小方案、授权边界逐项写明；**没有一项达到 P2**：没有持久化数据被错写或丢失、没有跨作业数据错配进写路径、没有路由劫持，受影响的都是抽屉内存视图（未确认的映射草稿 / 投放草稿 / 预览上下文），可在秒级由用户重做，且在本 feature 的产品模式（normal mock，写延迟 ≈ 0）下 O-B5-1 / O-B5-2 不可触发。

P3 可接受为后续任务；**本结论不是 Gate 2、不是风险接受**：R5-A 的最小修正属普通业务流程一致性（非 §5.1 防线），可按 AGENTS §2 第 9 步登记为下一批任务；R5-B / R5-C 的任何修法（提交中禁用 / 比较后复位 / 提交锁 / 生命周期隔离）都属 §5.1 新增防线，**须 Walter 本人批准后才可开码**，本评审只给依据，不替他决定。

## 1. 亲跑证据（本会话在 `ca3c303` 执行；实施者数字引自 tasks 状态行 / converge-batch5 §2）

环境：`pnpm install --frozen-lockfile --offline` → `Already up to date`（锁文件未改）；Node v25.2.1 / pnpm 11.21.0；日志 `review-batch5-A/{install,unit-all,task-commands-2,v1-contract,gates,e2e-five,e2e-intake-g,e2e-other7,probe-run1,probe-run2}.log`。

| 命令（tasks 原文；`pnpm -C frontend` 省略） | 实施者 | 本会话 |
|---|---|---|
| 全量 `test:unit` | 39 files / 1128 / 0 | **39 files / 1128 passed / 0**（7.3 s） |
| `contract --check` | 25 / 10 / 2 | **25 methods, 10 events, 2 artifacts match** |
| `check`（六守卫） | 通过 | tokens 156 / 5；generated / colors（24 / 24，负命中 0）/ glass / updown / grid / network 全过；重生成后 `git status` 仍空 |
| `typecheck` / `lint` | 通过 | **通过 / 通过（0 警告）** |
| A01a 1 `contract-labels -t "WI reliability label"` | 2 | **2** |
| A01a 2 `contract-labels + contracts + contract-doc` | 72 | **72** |
| A01a 旧 `-t "WI labels"` | 10 | **10** |
| A13a 1 `job-state-pool -t "WI R3-B repeated remove"` | 2 | **2** |
| A13a 2 `job-state-pool` 整文件 | 29 | **29** |
| A13a 旧 `-t "WI removeUpload"` | 4 | **4** |
| A15a 1 `job-state-history -t "WI listInterventions"` | 9 | **9** |
| A15a 2 `-t "WI history scenarios"` + `real-stubs` | 3 + 24 | **3 + 24** |
| A15a 另 `job-state-read` | 39 | **39**；`job-state-history` 整文件 **12** |
| B06 1 `intervention-history -t "WI AC-007-1"` | 8 | **8** |
| B06 2 `-t "WI history refresh"` | 2 | **2**；整文件 **10** |
| B06 3 `job-detail` + E2E detail-stage / list-create | 13 + 6 | **13**；E2E 见下 |
| C01 1～4 `intake -t "WI AC-003-2" / "WI purpose required" / "WI metadata only" / "WI H-5 store"` | 13 / 4 / 2 / 6 | **13 / 4 / 2 / 6** |
| C01a 1～4 `intake -t "WI H-5 container" / "WI H-5 close" / "WI page mount" / "WI non-modal"` | 1 / 1 / 10 / 1 | **1 / 1 / 10 / 1** |
| C01a 5 `job-list + job-detail + job-create` | 30 | **30**（12 / 13 / 5） |
| C02 1～3 `extraction-preview -t "WI AC-003-4" / "WI AC-003-6" / "WI confirm refresh"` | 5 / 4 / 4 | **5 / 4 / 4**；整文件 **13** |
| C02 4 `intake` 整文件 | 38 | **38** |
| C03 1～3 `unassigned-pool -t "WI pool assign" / "WI remove confirm" / "WI assign refresh"` | 5 / 4 / 21 | **5 / 4 / 21**；整文件 **30** |
| C03 4 `intake + extraction-preview + job-state-pool` | 80 | **80** |
| C04 1～3 `test:e2e e2e/jobs/intake.spec.ts -g "WI AC-003-1 local" / "WI AC-003-3" / "WI AC-003-5"` | 1 / 2 / 1 | **1 / 2 / 1**（真实 Chrome，各 3.4～4.9 s） |
| 五份 E2E `shell + agent + detail-stage + list-create + intake` | 34 / 0 | **34 passed / 0**（1.1 min） |
| 回归：routes + session-context / `jobs-store -t "WI H-2"` / badges / v1 三份契约 / real-stubs | 17 / 27 / 48 / 88 / 24 | **17 / 27 / 48 / 88 / 24** |
| **O-B5-9** `intake -t "WI H-5"`（未单跑过） | — | **8 passed**（6 + 1 + 1） |
| 其余 7 份 E2E（breakpoints / modules / scenarios / smoke / theme / tokens / workbench；非本批要求） | 未跑 | **44 passed / 0**（30.8 s） |

**未执行**：全量 `pnpm -C frontend test` 单命令（其组成部分已分别全绿）、后端、人工截图、46 AC 最终验收。全部命令首跑即过，本会话无失败留痕；实施者的首跑失败（B06 lint 4、C01 URL 空格期望、C01a `WriteReceipt.job` 误读 / lint 26、C03 时钟 / TS2345 ×4）本会话只读 Temp 日志目录名与 tasks 登记核对为“只修新测试 / 新模板”，与 §2 diff 事实一致（旧测试期望零改动）。

## 2. diff 事实、所有权与两处例外

- **逐提交文件**（`git show --stat`）与 tasks 各项修改范围、implementation-log §20.2 / §23.2 写权限表逐一相同；顺序 A01a `f65d3c6` → A13a `e1cd4d4` → A15a `a2efb98` → B06 `0d09748` → C01 `4af80e8` → C01a `6529f41` → (docs) → C02 `d4e3fb6` → C03 `7b802d4` → C04 `e609c2e`，父链连续 = tasks §6 DAG。
- **禁写路径零差异**（本会话 `git diff b67a227 e609c2e -- <路径> | wc -l` = 0）：`src/{app,shared,agent,workbench,stores}/**`、`main.ts`、`jobs/routes.ts`、`jobs/stores/{jobs,session}.ts`、`persistence.ts`、`mock/fixtures/**`、`scripts/**`、`package.json`、`pnpm-lock.yaml`、`vitest.config.ts`、`playwright.config.ts`。`git diff --check b67a227 e609c2e` 无告警。
- **R4-A 保留**：`JobDetailPage.vue` diff 只有 imports、`.intake-slot`、ready 分支的两列包裹与样式；`watch`（含 `onCleanup` 失效标志）、`selectStage`、三态、详情头逐行未动。
- **A13a 范围**：`job-state.ts` 恰 1 行（`if (upload.removed) throw {validation_error '投放已删除。'}`，位于 `findUpload` / `writableJob` 之后、`upload.removed = true` 之前，在 `commit` 的 working 副本上抛出 → 无部分写入）；`methods.ts` 描述 1 句；生成物；`job-state-pool.spec.ts` +39 / −0 只追加 describe `WI R3-B repeated remove`。无锁 / 幂等键 / 通用框架。
- **A15a 范围**：五个契约文件各只加 `listInterventions`；`real-stubs.spec.ts` 恰 +1 行（`requests` 表新键），`satisfies` 与两条断言未改。
- **C01 → C01a**：`intake.spec.ts` 在 `4af80e8`（21906 字节）是 `6529f41` 版本的**逐字节前缀**（本会话 `cmp` 核）。
- **两处例外（§3 of converge-batch5，本会话独立核）**：
  - `git diff 6529f41 d4e3fb6 -- intake.spec.ts`：仅 ① 首例标题 → `starts closed with readonly H-5 state and internal view caches; DTO excludes jobId`；② `expect(store).not.toHaveProperty('selection')` → `expect(store.selection).toBeNull()`；③ 第 528 行 `expect(collect.findAll('button')).toHaveLength(1)` → `expect(collect.findAll('button').filter(button => button.text() === '投放到本作业')).toHaveLength(1)`。−3 / +3，再无其他行。
  - `git diff d4e3fb6 7b802d4 -- intake.spec.ts`：仅 `expect(store).not.toHaveProperty('pool')` → `expect(store.pool).toEqual([])` + `expect(isReadonly(store.pool)).toBe(true)`。−1 / +2。`7b802d4..e609c2e` 该文件零差异。
  - **判定：合法的阶段性约束更正，不是删覆盖，无越权**。两条负断言原文只表达“C01 不提前做 C02 / C03”（R11 已审的 `selection` / `pool` 机制本就要求这两个成员存在），第 528 行只表达“C01a 阶段只有入口按钮”；替换后反而多了正向初值 + 只读断言，入口唯一性仍被断言。该用例其余检查（`isOpen` / `jobId` / `draft` 只读 / `$state` 为空 / 4 条 `@ts-expect-error` / DTO 不含 jobId / 分配 DTO）与其余 36 例、imports、`connect` / `initialDraft` / `note` helper、describe 名、用例数 38 逐字不变；隐私断言（`File.prototype.{text,arrayBuffer,stream,slice}` / `FileReader.readAs*` / `URL.createObjectURL` spy 0 次、`fai.jobs.v1` 不含正文、列表不出现正文）全部在位。新字段是私有 ref + `computed`（`Object.keys(store.$state)` 仍 `[]`），没有 Proxy / `defineProperty` / 不可枚举 / 惰性隐藏；新按钮是真实 `<button>`。8 份新 / 改测试文件 `grep` 无 `.skip / .only / .todo / test.fails`。许可文档 `af31dda` / `19228ce` 的提交时间（01:14 / 01:30）早于 `d4e3fb6`（01:35），两次“停止”在 Temp 摘要中登记为零写入，与 git 事实一致。

## 3. 逐任务核对（完成标准 → 代码证据（本会话读源）→ 判定）

| 任务 | 核对要点 | 判定 |
|---|---|---|
| **T-A01a** `f65d3c6` | `ReliabilityLabel = {high:{高,↑}, medium:{中,＝}, low:{低,↓}, unknown:{未知,?}} as const`；`ReliabilityLabelSchema = labelSchema(ReliabilityLabel)`（与既有九张同一 `labelSchema`，literal 从运行时常量生成，文案 / 图标同源）；注册进 `contractSchemas`；`SourceNoteSchema.reliability` 枚举未改、未新增 `ReliabilitySchema`、`CONTRACT_VERSION` 未升；测试断言键序 = `SourceNoteSchema.shape.reliability.options`、逐键改错文案被拒、生成物小节含四条 text / icon；原 `mappings` 数组未加项（`WI labels` 仍 10）。真实生成源对拍（`contract --check` 25 / 10 / 2） | 满足；图标语义见 R5-E |
| **T-A13a** `e1cd4d4` | 见 §2 与 §5。新测试覆盖已归属 / 未归属两例：第二次删除 reject `{validation_error, '投放已删除。', retryable:false}` 后 `localStorage['fai.jobs.v1']` 原串、快照（interventions / mappingHistory）、工作区修订、`updatedAt` 全部不变；第一次的 `remove_source` 与旧修订仍在。属既有领域规则（与 `confirmIntake` / `assignUpload` 对已删除者一致），不是 §5.1 新 guard（R11 已判，本会话同意） | 满足 |
| **T-A15a** `a2efb98` | `client.ts` 签名 `listInterventions(jobId, filter?: {stage?; kind?})`；`methods.ts` params = `[string.min(1), strictObject({stage?, kind?}).optional()]`（显式 `null` 被拒，测试覆盖）、result `z.array(InterventionSchema)`，复用既有 schema、无新注册；mock 走 `readJobState`（场景延迟 / error / not_found 同源）；`job-state.listInterventions` 先 `findJob`，按 jobId / stage / kind 过滤后 `Date.parse(createdAt)` 升序（V8 `sort` 稳定，同刻保持记录顺序），返回 `structuredClone`；real 桩抛 `NotImplementedError`。测试含真实 `submitIntake` / `removeUpload` 产生的事件、带时区同刻、修改返回值后再读不变、empty `[]`、slow 1499 / 1500 ms | 满足 |
| **T-B06** `0d09748` | `InterventionHistory.vue`：`<aside aria-label="介入历史">` + `<h2>`；按钮 `aria-expanded`，`expanded` 初值 false；`watch([() => props.job, stage, kind, expanded])` 无 `immediate`，回调 `if (expanded.value) void load()` → 收起时 0 读（组件测试 spy `not.toHaveBeenCalled`，Chrome 实测 aside 在、`aria-expanded=false`、无 `<ol>`）；filter 只放已选项；本地 loading / `ErrorState(moduleId='intervention-history')` 重试 / `EmptyState('暂无介入记录。')`；每条 `<time :datetime>`、`StageLabel`、kind / outcome 原值；`<details>` 内 id / jobId / artifactId / baseRev / reason（null → “无”）与按 `payload.action` 收窄的摘要（ingest 五项、可靠性走 `ReliabilityLabel`、日期 null → “未知”、口径 null → “无”；map_fix 行；remove_source / cancel_job / delete_conclusion / veto 显示 reason），没有 `JSON.stringify` / 任意键遍历。挂载：ready 有作业分支 `.detail-columns`（`minmax(0, 2fr) minmax(0, 1fr)`，Chrome 实测 1280 px 下 `678.656px 339.344px`，`data-viewport-collapsed=false`；900 px 下 `908px` 单列、`=true`）；侧栏在主列之后；不渲染 `h1` / `.job-*` / `aria-current` / `aria-pressed` / `JobStatusBadge`。refresh 信号 = `props.job` 替换（组件测试“真实 `submitIntake` + 一次 `refresh()` 后新 ingest 出现”）；无 store 成员 / 总线 / 轮询 / 序号 | 满足 |
| **T-C01** `4af80e8` | `IntakePanel`：根 `<section aria-label="投放表单">`，提示文案在；三种输入单选、只提交当前种类；`selectFile` 只取 `files[0]` 的 `name / size / type / lastModified` → `IntakeFileMetaSchema.safeParse` 一次（失败提示由 `INTAKE_FILE_EXTENSIONS` 拼出、`fileMeta=null`）；拖入只取首个；源码无 `File.text / arrayBuffer / stream / slice / FileReader / createObjectURL`、不发 URL 请求；用途必填（`SourceNoteSchema.safeParse` 一次，纯空白被拒）；可靠性 `<select>` 由 `ReliabilityLabel` 生成、默认 unknown；空日期 / 口径 → null；file 种类提交时只判 `fileMeta !== null`（S-46）；url / text 原串在提交时各 parse 一次；`ErrorState(moduleId='intake-submit')` 以 `lastSubmission` 重试。`intake.ts`：`open(jobId?)` 每次覆盖快照、不读 route；`close()` 只置 false；`submit` 类型为分配式 `Omit<…,'jobId'>`（`@ts-expect-error` 断言）；成功 `resetDraft()` → `selectReceipt` → `refreshViews()`（`refresh()` 恰一次）；失败原 `ErrorResponse` reject、不刷新、保草稿；store 不持 File、不读写 localStorage | 满足；提交期间无禁用见 R5-B |
| **T-C01a** `6529f41` | `IntakeDrawer`：根 `<aside class="glass-drawer intake-drawer" aria-label="投放抽屉">`，`width/height: 100%`，无 fixed / 遮罩 / dialog / aria-modal / inert / 焦点锁（源码 grep 零命中；Chrome 实测 `position: static`、`aria-modal=null`、`role=dialog` 0）；“关闭” → `close()`（组件测试：路由不变、`agentClient.send` 0 次）。`JobListPage`：“投放”与“新建作业”同置 `.intake-actions`，`.intake-slot` 在创建面板后、筛选条前；`JobDetailPage`：`.intake-slot` 在状态分支前；`StageWorkspace` props `{stage, job, workspace}`，只对 `collect && workspace?.stage==='collect'` 分发 `CollectWorkspace`，collect 不匹配时 `<p role="status">读取中…</p>`，其他阶段原占位。`CollectWorkspace`：首个按钮“投放到本作业” → `open(job.id)`；`<ul aria-label="采集列表">` 按 `workspace.uploads` 原序显示种类 / 名称或 URL /“文本投放（正文未保存）”/ 用途 / `ArtifactStatusBadge`；空列表“暂无投放。”。Chrome 实测：抽屉开着时状态筛选可用（cards 1）；从列表导航到详情后抽屉仍在、header 仍“未指定作业”（快照不随路由改写） | 满足 |
| **T-C02** `d4e3fb6` | `selectUpload`：先 `previewTarget = structuredClone(toRaw(upload))` → loading → `getIntakePreview` → 成功一次写 `selection = {upload: copy, preview, mapping: structuredClone(copy.mapping)}`（初值 = `upload.mapping`，非 `preview.fields`；测试用注入差异样例断言）→ ready；失败写 `previewError` 并 resolve。`editMapping` 只改草稿。`confirm(mapping)`：`confirmIntake(selection.upload.id, mapping)` → `selectReceipt`（selection 立即为 ingested / quarantined）→ `refresh()` 恰一次；失败 reject、selection 不变、不刷新。`ExtractionPreview`：类型 / 字段 / 单位 / 时间范围（null → “未知”）/ 状态徽 / 隔离原因。`MappingEditor`：“确认入库”只在 `pending_validation && !removed`；点击先 `FieldMappingSchema.safeParse` 一次；`ErrorState(moduleId='intake-confirm')`。`IntakeDrawer`：loading → `Loading`；error → `ErrorState(moduleId='intake-preview')` 重试 `selectUpload(previewTarget)`；`selection` 非 null → 预览 + 编辑器（`:key=upload.id`）。`CollectWorkspace` 每行“预览 / 修正” → `open(job.id); selectUpload(upload)`；状态徽旁显示隔离原因。读失败 resolve、写失败 UI catch，Chrome 探针全程无 `pageerror` | 满足；`selectReceipt` 不同步 `previewTarget` 见 R5-A |
| **T-C03** `7b802d4` | `UnassignedPool`：`onMounted` → `ensureJobs()` + `loadPool()`；归入选项 = `jobs.jobs.filter(status ∈ ACTIVE_JOB_STATUSES)`（`JobStatusSchema.exclude(['delivered','cancelled'])`：含 draft / failed，不含 delivered / cancelled）；未选作业时按钮 `disabled`；读 / 写错误 `ErrorState(moduleId='intake-pool')`；空池“待归属池为空。”。`CollectWorkspace` 删除：行内 `<section aria-label="确认删除来源">`，理由默认“来源不再适用”可改，经 `dataMethods.removeUpload.params.def.items[1].safeParse` 一次；取消 → 关面板零调用；确认 → `intake.remove(id, reason)`；`ErrorState(moduleId='intake-remove')`。store：`assign` / `remove` 成功 → `clearPreview(id)`（`selection.upload.id === id || previewTarget.id === id` 时清两者并复位 idle / null）→ `refreshViews()`（`refresh()` 恰一次；`poolStatus !== 'idle'` 时再 `loadPool()` 一次）；失败 reject、不刷新、不动字段（`WI assign refresh` 21 例逐动作断言）。当前列表隐藏 removed、历史保留 `remove_source`（组件测试经真实 `listInterventions` 核）。抽屉任意挂载点（列表 / 详情直达）都含完整流程 | 满足 |
| **T-C04** `e609c2e` | 只新建 `e2e/jobs/intake.spec.ts`（4 例，无生产文件）。取证只读 `localStorage['fai.jobs.v1']` 与可见 DOM；合成空 CSV 走真实 `<input type=file>` 边界；AC-003-1 本地子项：列表“投放”（null 快照）与详情“投放到本作业”（j-collect）进入同一 `glass-drawer intake-drawer` / “投放表单”，提交分别进 `uploads.uploads`（2 → 3）与 `details['j-collect'].collect.uploads`（+1，ingest 事件恰 1 条，池不变）；AC-003-3：空用途“请填写用途。”且快照不增；两种样例的 Upload 与 ingest `sourceNote` 等于输入、文本 Upload 无 `text`、原串不含正文；展开“介入历史”与 `<details>` 后逐字段取证（可靠性“高”/“未知”，null → “未知”/“无”）；AC-003-5：列表投放 → 池 → 预览（未知单位 / 范围）→ 只改草稿时快照不变 → 确认“已入库” → 归入 j-collect（选项不含 j-cancelled、含 j-failed）→ 离池（回到 2）→ 快照同 id 只改 jobId → 详情列表含该投放与同状态徽。本会话真实 Chrome 1 / 2 / 1 通过 | 满足 |

## 4. 发现（按 bug / 架构风险 / 测试缺口 / 目标对齐；每项附位置、复现、实测数字、级别理由、最小方案、授权边界）

**探针**：`review-batch5-A/probe/observations.probe.ts`（10 例，真实 Chrome，`?scenario=normal` / `slow` / `job-delivered`；日志 `probe-run1.log` / `probe-run2.log`）。探针只做 UI 操作与 DOM / `localStorage` 读取，不注入 fixture、不调 API 写、不改产品代码。所有探针无 `pageerror`（无 unhandled rejection）。

### P1 / P2：无

### P3

| 编号 | 位置 | 复现（真实 Chrome）与实测 | 级别理由 | 最小方案与授权边界 |
|---|---|---|---|---|
| **R5-A**（= O-B5-3） | `stores/intake.ts` `selectReceipt`（不写 `previewTarget`）+ `clearPreview`（`previewTarget.id === id` 也清 `selection`） | **normal，确定复现**：`/jobs/j-collect/collect` → 行 A（source-1）“预览 / 修正”（预览“合成时间序列表”）→ 同一抽屉提交文本 B（预览变“合成文本预览（正文不保存）”，此时 `previewTarget` 仍 A）→ 在 B 的编辑器把“目标字段 1”改为 `B-edited-target` → 页面上对行 A“删除来源 → 确认删除”。结果：**预览 0 / 编辑器 0**（删除前 1 / 1），抽屉仍开；重新选中 B 行后“目标字段 1”= `待映射`（未确认的修改丢失，已保存映射完好）。**对照**：直接预览 B → 编辑 `kept-edit` → 删 A：预览 1、值仍 `kept-edit`（`of another id preserves…` 用例覆盖的正是这一支） | 损失 = 抽屉内存里**尚未确认**的映射草稿（几个输入框），持久化数据与投放记录都不受影响，不显示错数据（是清空不是错配），用户重选一行即可重做；触发需要“预览 A → 同抽屉提交 B → 编辑 B → 删 A”的特定顺序。与 tasks T-C03【r6.12.3】“其他 id 不动”的意图冲突，但代码符合其字面规则，文档对“selection 与 previewTarget 指向不同 id”没有给答案 → 设计精度缺口 + 测试缺口（缺“两者不一致”用例）。**不是 P2**：无持久化损失、无跨作业错写、无路由劫持 | **普通业务流程修正，不是 §5.1 防线**：`selectReceipt` 同时把 `previewTarget` 置为回执 upload 的副本（或 null），恢复“两者恒指向同一投放”的不变量——这是现成成功路径里的一次赋值，不引入请求序号 / 版本检查 / 锁 / 异步 guard。须先改 plan §2.3【r6.12.3】“未改 submit / confirm 对 previewTarget 的处理”一句并重跑 Analyze，再按 AGENTS §2 第 9 步登记约 0.5 h 任务（1 行 + `unassigned-pool.spec.ts` 1～2 例“selection=B、previewTarget=A，删 / 归入 A 时 B 不动”）。文档作者判断“须先修 plan”**正确**，本评审同意走该路径，不接受只改文案 |
| **R5-B**（= O-B5-1） | `IntakePanel.vue`（提交期间表单与按钮不禁用）+ `intake.submit` 成功后无条件 `resetDraft()` | **slow（写延迟 1500 ms）复现**：提交 A 后 +73 ms 在同一表单填入 B 正文与用途；+1209 ms 时 textarea 仍为 B、用途仍为 B；**+1930 ms 时 textarea 已不存在（`inputKind` 复位为 file、“文件”单选被选中）、用途 = ""**；最终列表 A 1 条、B 0 条 → B 的正文从 DOM 与内存草稿一并消失（不持久化，若是唯一副本则不可恢复）。**双击提交**：slow 下两次点击（间隔 60 ms）→ 同用途投放 **2 条**；normal 下 `dblclick` → **1 条** + 提示“请填写用途。”（第二次点击时草稿已复位）。**normal 下 O-B5-1 不可触发**：写路径无计时器，提交 → 复位在同一宏任务的微任务链内完成，用户输入事件不可能插入 | 影响的是用户输入保全，不是 API 乱序；但在本 feature 的产品模式（normal mock）窗口 ≈ 0，只在 slow 场景或未来真实 `api` 延迟下出现；损失上限 = 延迟窗口内的输入（粘贴正文通常仍在剪贴板）。AC-003-2 / 003-3 字面满足，plan r6.12 只定义“成功后复位草稿”。**不是 P2**：产品模式不可触发、无持久化损失；但真实后端接入前应处理 | 任何修法（提交中禁用表单 / 按钮、复位前比较草稿是否仍等于提交内容、提交锁）都是 AGENTS §5.1 的竞态 / 生命周期防线，**须先报 Walter 本人批准**，不能借 R4-A 专项批准或“通用代码授权”覆盖；本评审不预写方案任务。归属建议：`api` 接入或下一精度轮，由 Walter 定。双击产生 2 条投放在 v1 为两条合法记录（可各自删除；R3-B 修复后重复删除不再膨胀台账），同一审批决定 |
| **R5-C**（= O-B5-2） | `intake.submit` → `selectReceipt` 无条件写全局 `selection`；`open()` 只在调用时清 | **slow 复现**：列表 → 进入 j-collect 详情 → “投放到本作业”（header“目标作业：j-collect”）→ 提交文本 A → +113 ms 浏览器 Back 回列表 → 点“投放”（`open()`，header“未指定作业：提交后进入待归属池”，预览 0）→ **+2214 ms：header 仍“未指定作业…”，预览 1，内容为“合成文本预览（正文不保存）”**（A 的回执，A 实际已写入 j-collect） | 视图上下文错位：抽屉标题与下方预览 / 编辑器指向不同目标。写入本身正确（`jobId` 在调用时同步取快照；若用户在该预览上“确认入库”，`confirm` 用 `selection.upload.id`=A，作用对象仍是 A）。normal 下不可触发（同 R5-B）。**不是 P2**：无错写、无数据混入另一作业的写路径 | 同 R5-B：修法（回执到达时比较 `jobId` 快照 / 打开序号 / 生命周期隔离）属 §5.1，**须 Walter 批准**。非防线的替代设计（`submit` 成功不再写 `selection`，由用户自行点“预览 / 修正”）是对 plan r6.12“submit 成功后以回执设选中”的设计变更，须先改 plan 并重过 Analyze，是否采用由 Walter 定。本评审只列选项 |
| **R5-D**（= O-B5-6 + 同类） | `IntakePanel.vue` 原生 `<input type=file>` 无 ref / 不清 `value`；`resetDraft()` 把 `inputKind` 复位为 `'file'` | **normal 复现**：列表“投放” → 选 `probe.csv` → 提交成功（池中出现）→ `input.files.length` **仍 = 1**，而“已选：…”行已消失；不重选直接再提交 → “请选择文件。”，**无第二条投放**。同类：提交文本 / 链接成功后单选跳回“文件”，textarea / url 输入框消失（R5-B 探针 +1930 ms 的 `textarea count = 0` 即此） | 纯 UX 不一致（浏览器仍显示旧文件名；连投多条文本须每次重选种类），行为安全（不会重复提交旧文件；草稿真实已清）。符合 plan “复位草稿 = 初值”的字面 | 可与 R5-A 同一精度轮处理：成功后经模板 ref 置 `input.value = ''`（1 行，非 guard）；`inputKind` 是否保留上次种类属 UX 取舍，先在 plan §2.3 定一句再改。不阻断 |
| **R5-E**（= O-B5-7） | `contracts/types.ts` `ReliabilityLabel` 图标 `↑ / ＝ / ↓ / ?` | 静读 + Chrome 可见（介入历史“可靠性”只显示文案，表单 `<select>` 只显示文案；图标目前未在本批任何界面渲染，只在契约 / 文档中） | 期货场景里 ↑ / ↓ 强关联涨跌方向，用于“可靠性高 / 低”有歧义；designUI §2.2 只约束涨跌**颜色**作用域（`check:updown` 通过），没有约束箭头字形。本批无渲染点，无 AC 违反 | 建议在图标首次进入界面前（B06 / C01 目前只用 `.text`）换成非方向性字形（如 ●◐○?），改 `types.ts` 常量 + 重生成即可，仍 2.0 内展示映射、不升版本；由 Walter / 设计定，不阻断 |

### 观察（不计入判定）

- **O-R5-1**（= O-B5-4）slow 下连点“确认入库”两次（60 ms）：+2500 ms 时“确认入库”按钮 0、映射状态徽“已入库”、抽屉内 `.error-state` 0、无 `pageerror` → 第二次被领域层 validation_error 拒绝，错误因表单已按状态隐藏而不可见，但无副作用、无 unhandled rejection。连点两行“预览 / 修正”（200 ms）：最终预览 1、`Loading` 0、不卡 loading（mock 按序，最后一次生效，S-43 / R4-E 同类）。不要求处理。
- **O-R5-2**（= O-B5-5）`?scenario=job-delivered` 的 `/jobs/j-delivered/collect`：采集列表 2 行，“预览 / 修正”2、“删除来源”2、“投放到本作业”在；提交 → `ErrorState`“已定稿或取消的作业只读。”；删除确认 → 同错误。`/jobs/j-cancelled/collect`（normal）：0 行、提交同错误。领域只读门对本批四个写路径生效、数据不变；入口按作业状态隐藏 / 禁用属 AC-006-7（T-F07）与 AC-002-5（T-B05），第五批 9 项标准无此要求 → **非本批缺口**，归属确认同 Converge（状态行阅读提示即可）。
- **O-R5-3**（= O-B5-8）`JobDetailPage` 只读 `useUiStore().viewport.collapsed` 写到 `data-viewport-collapsed`：与 `app/AppShell.vue:43` / `app/Rail.vue:18` 写法相同，`src/stores/ui.ts` 零差异，不在禁写清单 → **在“沿用仓库既有断点写法”范围内**，Chrome 实测断点生效（§3 B06 行）。`.intake-actions` 包裹两个按钮：`.job-create-toggle` 类名 / `aria-expanded` 未变，job-list 12 / job-create 5 / list-create E2E 语义不变 → 范围内。
- **O-R5-4**（= O-B5-9）`-t "WI H-5"` 在 `ca3c303` 亲跑 = 8（§1）。
- **O-R5-5** 探针两次在 `/jobs?scenario=normal` 首次加载时捕获 1 条控制台 `404 (Not Found)` 资源错误，专门复跑一次未再出现；本批 diff 不含任何静态资源 / 路由 / 壳改动，判为壳层既有偶发（疑 favicon），不归本批，仅如实登记。

### 架构风险

无新增。`intakeStore` 仍是视图缓存（唯一可变状态在 mock 契约层）；H-5 公开面仍只有 `open / close / isOpen / jobId`；没有事件总线 / 轮询 / 序号 / 锁 / 实例登记；`StageWorkspace` 只对 collect 分发，D–F 未提前实现；`app/** / shared/** / stores/**` 零差异。R5-A～R5-C 都是 intakeStore 内存视图层的一致性 / 生命周期精度，不触及契约与持久化。

### 测试缺口

1. R5-A 的“`selection` 与 `previewTarget` 指向不同 id 时 assign / remove”负向用例（随 R5-A 修正补）。
2. R5-B / R5-C 的 slow 行为无自动化用例——在 Walter 对 §5.1 做出决定前不应预写，以免把未批准的防线语义固化进测试。
3. 其余：33 条命令 1:1 对标准且亲跑通过；真实 Pinia / router / mock client + 边界 spy，无 `vi.mock` 内部模块；未见把实现逻辑抄进测试的用例；E2E 取证只读快照与 DOM，无窗口钩子。

### 目标对齐与 AGENTS §5

- 与冻结 spec v1.1 / plan r6.12～r6.12.4 / tasks 一致；未混入 D-020～D-024 内容；实现未越出 `frontend/`。
- §5.1：零新增 guard / 锁 / 序号（A13a 为领域规则，R11 已判、本会话同意；R4-A 的 6 行未动）。§5.2：用户输入在边界 parse 一次（`IntakeFileMetaSchema` 选择时、`SourceNoteSchema` + url / text 提交时、`FieldMappingSchema` 确认时、reason schema 删除时），store 不重复 parse，契约入口照旧 parse（既有先例）。§5.3：私有 `selectReceipt`（2 处）/ `clearPreview`（2 处）/ `refreshViews`（4 处）均多处复用。§5.4：`submit` / `confirm` / `assign` / `remove` 主流程只写正常路径，校验在面板小函数里。§5.5：生成物经 `contract` 重生成，`--check` 一致。§5.6：真实实现 + 边界 spy。§5.7：无新工具。

## 5. R3-B 判定：**技术关闭**

依据（真实 diff `e1cd4d4` + 本会话亲跑）：

1. 修复恰为 `review-batch3.md` §5 建议的 1 行 `if (upload.removed) throw validation_error('投放已删除。')`，位置在 `findUpload`（未知 → not_found）与已归属时 `writableJob`（终结作业 → validation_error）之后、`upload.removed = true` 之前；在 `commit` 的 `structuredClone(state)` 副本上抛出，`state` / 快照 / `updatedAt` 不动，无部分写入。
2. 与兄弟方法 `confirmIntake`（`upload.removed || status !== 'pending_validation'`）/ `assignUpload`（`jobId !== null || removed || !在池中`）的“对已删除者 validation_error”对齐；错误形态与既有 `{error:{code,message,retryable}}` 相同。
3. 范围只限 `removeUpload`；未加锁 / 幂等键 / 去重框架；未改 confirm / assign / cancel / submit；不借 R4-A 批准扩到其他 guard。方法描述补句实现中立，生成物同步。
4. 负向用例 2 例（已归属 / 未归属）断言 `localStorage` 原串、快照、`interventions`、`mappingHistory`、工作区修订、`updatedAt` 全部不变且第一次事件 / 旧修订仍在；原 `WI removeUpload` 4 例零改动（`-t` 仍 4，整文件 29）。
5. 首个真实消费方（`CollectWorkspace` 删除确认 → `intake.remove`）已接入；UI 层双击 / 重试不再膨胀台账。

前提：本批整体判通过（无 P2），关闭不附条件。未知 / 封存前置（not_found、`writableJob`）顺序与 R11 / tasks 登记一致。

## 6. H-x 切片与 AC（只记录，不签收）

- **H-5**：① 候选 `e609c2e54e02ba1d11912c5c10cf229ada025cba`（生产代码终点 `7b802d4` + C04 E2E；不以 `6529f41` 部分抽屉代替）；② R11 `1f99f80`（blob `27a76aa6…`）；③ **本会话 A 证据**：`WI H-5` 8 / `WI H-5 store` 6 / `container` 1 / `close` 1 / `intake.spec.ts` 整文件 38（§1）；④ **仍缺** → 待消费方集成（未交付），**不签收**。
- **页面切片**：① 候选 `e609c2e`；② B 组 R10 `37e2f71`、C 组 R11 `1f99f80`；③ 本会话 `e2e/jobs/intake.spec.ts` 4（1 / 2 / 1）、`detail-stage.spec.ts` 在五份 34 中通过、`job-list.spec.ts` 12；④ **仍缺**，不签收。process / analyze / deliver 仍为占位（D–F 未做）。
- H-1 / H-2 / H-3 / H-4 历史生产方证据保留；H-6 缺 T-A21；AC-003-1 工作台 / 顶栏子项与 AC-005-5 / AC-007-4 的 v2 子项仍 `blocked_by: frontend-workbench-v2`。
- **46 AC 最终验收 = 0 / 46**。本批涉及的 AC-003-2 / 003-3 / 003-4 / 003-5 / 003-6 / 007-1 与 AC-003-1 本地子项“已实施且本批 Review 通过”，最终验收仍待全 feature Review / Gate 2，此处不宣称。全局 Topbar 入口 / Workbench(v2) / A21 角标未交付不计入本批判定。
- 进度登记（不代改 tasks / README，由集成人更新）：73 任务 / 约 107 h / 245 / 245；本批 9 项可由“已实施待 Review”改记为“已完成（第五批 Review 通过，非 AC 最终验收）”；feature 仍**未收敛**（37 项未开始 + H 组外部阻塞）；R3-B 关闭；R4-A / R2-C 维持关闭；R4-B～R4-E、S-41、R3-C、R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B（AgentClient 侧）、R2-D 维持未处理、未经风险接受。

## 7. 下一步与补修授权边界（给集成人 / Walter；本评审不执行）

1. **集成人**：提交本原件；按 §6 更新 tasks / README / implementation-log 状态；R3-B 在台账标“已关闭（`e1cd4d4`，review-batch5）”。
2. **R5-A（普通业务修正，不需 §5.1 审批）**：先改 plan §2.3【r6.12.3】那句 + 重跑 Analyze → 登记 0.5 h 任务（`selectReceipt` 同步 `previewTarget` + 1～2 例）→ 实施 → 增量 Review。顺带可并入 R5-D 的 `input.value=''` 一行与 `inputKind` 复位取舍。
3. **R5-B / R5-C（§5.1）**：**须 Walter 本人决定**是否加“提交中禁用 / 比较后复位 / 回执与快照比对”类防线，或改为“submit 不写 selection”的设计变更，或接受为真实 `api` 接入时的事项。未获批前不得在任何任务里“顺手”实现，也不得以 R4-A 的专项批准或通用代码授权覆盖。
4. **R5-E**：图标字形由 Walter / 设计在首次渲染前定，改常量 + 重生成即可。
5. 可起步的未开始任务（依赖已全部完成）：T-A14 / T-A15 / T-A16（A16 开工前先定案 R-A）；T-G04 依赖 T-C01a，本批通过后可排。批次划分由集成人定。
6. 合并策略不变：Walter 已选全部完成后再合 main；Draft PR #12 保持 Draft；main `072bb12` 不导入、继续 pin `90187f7`、R2-D 流程不变；不写 v2 / peer 树。

**核对**：本会话结束时 `git status --short` 仅为本新建文件（`?? specs/workbench-interaction/review-batch5.md`）；`git diff --check` 无告警；源码 / 测试 / 生成物零差异；4173 无 LISTEN；未 commit。
