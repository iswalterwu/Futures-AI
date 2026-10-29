# Feature: workbench-interaction 增量代码 Review — T-C04a（R5-A 普通业务一致性补修）（review-batch5-r5a.md）

> **性质**：AGENTS §2 第 10 步的**增量 Review**，只审 T-C04a 一项；由审核员 A 独立新会话出具。**不是** Gate 2、不是 Handoff、不是风险接受；不勾 checklist、不改代码、不改任何原件。第五批原 Review（`review-batch5.md` 原件 `fe9c2c9`，0 P1 / 0 P2 / 5 P3）已通过，本报告**不重判**。
>
> **阶段记录（脱敏）**：A = **claude-fable-5-1 via anthropic**（`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`，PI_SESSION_ID `01a189f3-8f06-71bf-8b3d-256cf0be4ba0`），新开独立会话；与 Implement（openai/gpt-6-astra，会话 `01a189e3…`）异模型，与 Converge / Analyze R27（claude-opus-5-5，会话 `01a189eb…`）及前一 A 会话（`01a189bf…`，已结束）隔离。通道：`claude-bridge` 本窗口既有限额、无重置证据，按 AGENTS §6 规则 5 **未对 bridge 发起任何调用**；官方 `anthropic/claude-fable-5-1` 近期真实调用成功，本轮全部工作走该通道。只换通道、不换模型；未改 provider / key / 路由 / 全局 pi 配置；不因测试或审核结论换模型。
>
> **固定输入**：复用只读审核树 `D:/2030/Futures-AI-interaction-review-batch4`（branch `review/workbench-interaction-batch4-code`），HEAD **`64d20e4a593395ad8544f64a9cd9141a0e11e43d`**，开始与结束时 `git status --short` 均为空（仅 ignored 的 `frontend/node_modules/`、`frontend/test-results/`）。**审查对象 = 代码 diff `a2a2cdd379fd84e7744538b253450c00d59695c7..f63ef7c62f273626e4ee72f94d16bfa53b52f148 -- frontend`**（本会话 `git diff --stat` 核：3 文件 **+82 / −2**，`git diff --check` 干净）；`f63ef7c..64d20e4` **零 frontend 差异**（6 份 `specs/**` 文档 +157 / −3）；`e609c2e..a2a2cdd -- frontend` 为空，故本 diff 与 tasks 指定的 `e609c2e..<T-C04a> -- frontend` 相同。有效 Checklist = R11 原件 `1f99f80`，本树 `checklist.md` blob **`27a76aa6c3e4adcb817fed5d9b6512e1853061dd`**（`git rev-parse` 两者相同；26 ☑ / 0 ☐，只读未勾）。冻结 spec blob `102af73bb448224fda5002430842868632b5b66a`（46 AC）。`review-batch5.md` 本树 blob 与 `fe9c2c9` 相同（`61bff89…`），未动。
>
> **写入**：唯一受控新文件 = 本报告。未改 code / tests / docs / spec / plan / tasks / checklist / log / interface / README / HANDOFF / 原 reports / 别树；未 commit / push / merge / PR；未派 agent；未建新 `D:/2030` 目录；未改 playwright / vitest 配置；未装浏览器；未杀他人进程；测试后 4173 无监听者。本会话产物只有 Temp `wi-batch5-01a18388-q7s7olxl/r5a-review-logs/`（命令日志）与 `r5a-review-probe/`（探针 spec + 独立 playwright 配置 + 结果），都不是项目产物。
>
> **重新读取**（不依赖会话记忆）：AGENTS.md §2 / §3 / §5 / §6；`docs/plan.md`；冻结 spec（AC-003-4 / AC-009-1）；plan 页首 r6.13 与 §2.3【r6.13 成功回执同步】/【r6.12.4】失效注 / §5 AC-003-4 行；tasks 页首当前状态块、T-C04a 全文（性质 / 流程 / 修改范围三文件 / **唯一旧例例外三行** / 三标准三命令）、T-G09 依赖、§5 AC-003-4；R11 原件与本树 blob；`review-batch5.md` 原件 `fe9c2c9` §4 R5-A～R5-E（真实 Chrome 复现链、普通业务 / §5.1 授权边界）与 §7 结论；analyze.md「Analyze R26」「Analyze R27」；implementation-log §24 / §25；interface-handoff 当前状态块；`converge-batch5-r5a.md` 全文（含 O-R5A-1～4）；Temp `astra-r5a-summary.md` 与 `astra-r5a-logs/`（red-component / red-e2e / command1(-rerun) / command2 / command3(-rerun) / regressions / preservation / final-git）。源码逐文件读过：`stores/intake.ts` 全文（f63ef7c）、`contracts/mock/{index,job-state}.ts` 的 `commit` / `writeJobState` / `parseBoundary` / `submitIntake` / `confirmIntake`、`contracts/index.ts`、`stages/{IntakeDrawer,IntakePanel,MappingEditor,UnassignedPool,CollectWorkspace}.vue`、两份测试文件的改动段与 harness（`connect()` 边界 spy、`beforeEach` / `afterEach`）。

## 结论

**本增量通过：0 P1 / 0 P2 / 0 新 P3**（另 3 项观察 O-A-1～O-A-3，不计入判定）。**R5-A 技术关闭。** 3 / 3 完成标准在固定 diff 中有真实实现与真实测试，3 条验证命令由本会话在 `64d20e4`（代码 = `f63ef7c`）**全部亲跑且数字与实施者登记逐条相同**；旧例改动恰为 tasks 预登记的三行、无第二处、无删用例；生产只多一行普通赋值、无任何 guard；真实 Chrome 独立探针 6 / 6 通过，原 R5-A 复现链在修复后不再复现。

本结论**不是** Gate 2、**不是**风险接受：R5-B / R5-C（§5.1）仍须 Walter 本人批准后才可开码；R5-D / R5-E、S-43 与所有旧 P3 维持开放、未经风险接受；R3-B / R4-A / R2-C 维持关闭；46 AC 最终验收仍为 0 / 46；feature 未收敛。

## 1. 本会话亲跑结果（HEAD `64d20e4`，代码 = `f63ef7c`）

| 命令 | 本会话实测 | 实施者登记（Temp `astra-r5a-logs/`） | 一致 |
|---|---|---|---|
| 命令 1 `test:unit unassigned-pool.spec.ts -t "WI R5-A"` → 整文件 | **2 passed / 30 skipped (32)** → **32 passed** | 2 / 30 → 32 | ✓ |
| 命令 2 `test:e2e e2e/jobs/intake.spec.ts -g "WI R5-A"` → 全部 E2E（真实 Chrome，Playwright 自管 4173，配置未改；每次前核 4173 空闲） | **1 passed** → **79 passed / 0 failed（12 files）**；原 `intake.spec.ts` 4 例在列（ok 1 / 13 / 25 / 34） | 1 → 79 / 12 files | ✓ |
| 命令 3 `test:unit` → `typecheck` → `lint` → `check` → `contract --check` → `git diff --stat e609c2e HEAD -- frontend` | **39 files / 1130 passed / 0**；typecheck 通过；lint 通过（`--max-warnings 0`）；六守卫 generated / colors（24 / 24，负命中 0）/ glass / updown / grid / network 通过；contract **25 / 10 / 2 match**；diff 腿 = `e2e/jobs/intake.spec.ts` +46、`stores/intake.ts` +1、`unassigned-pool.spec.ts` +37 / −2，**3 files +82 / −2** | 同（命令 3 首跑 TS2345 后重跑同数） | ✓ |
| 回归（非标准）`intake.spec.ts -t "WI H-5"` / `jobs-store.spec.ts -t "WI H-2"` / `contract-labels.spec.ts -t "WI labels"` | **8** / **27** / **10** | 8 / 27 / 10 | ✓ |
| 回归 real-stubs + routes + session-context + contract-doc + contracts + mock | **129**（其中 real-stubs **24**、routes + session-context **17**、v1 三份契约 contracts / contract-doc / mock **88**） | 129 | ✓ |
| 回归 contract-version / badges | 30 / 48 | — | — |

说明：我首轮回归命令写错了测试路径（`tests/component/jobs/jobs-store.spec.ts` 等不存在 → vitest "No test files found"），属本会话输入错误，不是产品失败；按真实路径重跑后如上。全部日志在 Temp `r5a-review-logs/`。

## 2. 逐条完成标准（固定 diff 对 tasks T-C04a）

| 标准 | 代码 / 测试证据（本会话逐行读） | 命令 | 判定 |
|---|---|---|---|
| **1** 组件 `WI R5-A` 两例；整文件 30 + 2 = 32；旧例只有修改范围第 2 点那一例的三行（AC-003-4 最终，与 T-C02 共同；R5-A） | 追加 `describe('WI R5-A')` + `test.each(['assign','remove'])` 恰 2 例：`connect()` → `loadPool` → `selectUpload(pool[0])` → `submit` 文本 B（`jobId` null）→ `selection.upload` / `previewTarget`（soft）= 回执 upload → `editMapping` → assign / remove A（spy 恰一次）→ `selection.upload.id` = B、`mapping` = 编辑值、`previewTarget` = B、`ready` → `confirm(mapping)` → 回执 ingested / mapping = 编辑值，`selection.upload` 与 `previewTarget` 都 = 回执。旧例 hunk 恰 3 行：标题 `…clears a receipt selection and its synced preview target`；`toBeNull()` → `previewTarget!.id).toBe(receipt.upload.id)`；写后追加 `expect(store.previewTarget).toBeNull()`。用例计数脚本：a2a2cdd 8 单例 + 22 each = 30，f63ef7c 8 + 24 = 32。imports / `connect` / helpers / 其余 28 例零差异（diff 只有两个 hunk）。全仓 `previewTarget` 断言扫描（`extraction-preview.spec.ts` 第 98 / 120 / 140 / 156 / 172 / 194 行，`unassigned-pool.spec.ts` 其余行）均在 submit 前、`open()` 后或 `selectUpload` 路径，**无第二处冲突** | 2 → 32 | **满足** |
| **2** Chrome normal 1 例；全部 E2E 78 + 1 = 79；原 4 例与其他 E2E 不改（AC-003-4 最终；R5-A） | 原 205 行 / 14808 字节是新文件逐字节前缀（本会话 `git show` + `cmp`）；只追加 1 例 `WI R5-A deleting previewed A…`：真实 UI 链行 A“预览 / 修正”→ 同抽屉 `fillText` 提交 B → 快照记 B 原 mapping → 改“目标字段 1”→ 快照仍原值 → 行 A“删除来源 → 确认删除”→ 行 A 消失、抽屉在、预览 1 且为 B、编辑器 1、输入框仍编辑值、快照 source-1 `removed=true` 且 B mapping 仍原值 → “确认入库”→ 行 / 预览徽“已入库”、快照 `ingested` 且 `mapping[0].targetField` = 编辑值。复用既有 `snapshot` / `fillText`，取证只读 `localStorage` 与 DOM；无窗口钩子 / fixture 覆盖 / 直接 API 写 / `test.only` / skip；`playwright.config.ts` 未改 | 1 → 79 | **满足** |
| **3** 全量 1128 + 2 = 1130 / 39 files、无删用例；typecheck / lint / 六守卫 / contract 25 / 10 / 2；`e609c2e..HEAD -- frontend` 只含三文件（AC-009-1 部分前置） | 见 §1 第 3 行；无删除用例（两测试文件只追加 + 三行替换） | 通过 | **满足** |

## 3. 独立核项（派工单 1～5）

1. **生产一行与状态一致性**：`selectReceipt` 现为 `previewTarget.value = structuredClone(receipt.upload)` → `selection.value = { upload: receipt.upload, preview, mapping: structuredClone(receipt.upload.mapping) }` → `ready` / `null`。`submit` 与 `confirm` 成功都只经 `selectReceipt`，两条路径同时生效。`clearPreview` 条件（`selection.id === id || previewTarget.id === id`）与清理字段逐字不变；`open` / `close` / `selectUpload` / `editMapping` / `assign` / `remove` / `loadPool` / `refreshViews`、返回对象、`emptyDraft` 零差异；无请求序号 / 锁 / 比较 / 提交中禁用 / 取消；UI（五个 `.vue`）、query、`stores/jobs.ts`、契约 / mock / 生成物、配置零差异（`git diff --stat` 只三文件）。**status / mapping 一致**：`previewTarget` 与 `selection.upload` 从同一 `receipt.upload` 构造，同 id / status / mapping；组件例与探针都断言两者 `toEqual` 回执。**clone 来源**：mock `commit()` 返回 `structuredClone(result)`，`writeJobState` 再经 `parseBoundary(method.result, …)`（zod `parse`）产出新的普通对象；组件测试 `connect()` 的 spy 透传到同一 client；`real/index.ts` 为 NotImplemented stub。因此 `receipt.upload` 是**普通 DTO、非 Vue Proxy**，`structuredClone` 无 DataCloneError 风险（1130 / 79 全绿亦证）。**返回 receipt 与 state**：`previewTarget` 是独立副本，caller 改 receipt 不影响它；`selection.upload` 与返回的 `receipt.upload` 共享底层对象（见 O-A-1，**非本 diff 引入**），而生产 caller `IntakePanel.send` / `MappingEditor.confirm` 都 `await` 后丢弃回执，不存在写入路径。
2. **测试演进**：旧例改动恰三行、同一例、用例数仍 2；整文件 30 → 32；其余 assert / import / helper 零差异；无第二处冲突（§2 第 1 行扫描）。E2E 前缀逐字节保留、只追加 1 例。无删覆盖、无 `only` / `skip`、无任意 JSON 注入、无窗口钩子。新例 harness = 真实 Pinia + 真实 mock 契约 + 边界 spy 透传，不 `vi.mock` 内部模块，不把实现逻辑抄进测试（符合 AGENTS §5.6）。
3. **先红后绿**：`red-component.log`：旧生产下 2 failed / 30 skipped，soft 断言显示 `previewTarget` 仍为池中 A（`u-unassigned-file`，只有旧代码可能出现此值）、硬断言第 508 行 `selection?.upload.id` 为 `undefined`（B 已被清），assign / remove 两支都复现；`red-e2e.log`：旧生产下 1 failed，第 237 行“抽取预览”期望 1 实际 0，error-context / trace 留存。修复后期望未改（红日志中的断言行与最终文件一致，只有第 502 行副本构造因 TS2345 改写）。`command3.log` 首跑 TS2345 位于**新测试**第 512 行（`structuredClone(toRaw(...))` 保留 readonly 数组类型），修正只在新测试内（`mapping.map(field => ({ ...field }))`），源码 / 期望 / imports 不变；`command3-rerun.log` 全绿。这是正常红 → 修 → 绿，**不是 provider 故障**，也不构成范围扩大。本会话未在旧代码上重跑红（避免改动只读树），红证据以实施者日志中只有旧代码才能产生的值（上述 A 的 id）核实；原 A（`fe9c2c9` §4）在 `e609c2e` 真实 Chrome 的复现也与同一链一致。
4. **真实 Chrome 独立探针**（Temp `r5a-review-probe/`，独立 playwright 配置，`testDir` = Temp、`outputDir` = Temp、同一 `pnpm dev --port 4173 --strictPort` webServer、`cwd` 指向本树 frontend；**非正式 79 例之一**；normal 场景；每例监听 `pageerror` 与 console error（排除开发态资源 404））：**6 / 6 通过**。
   - P1 复现旧 R5-A 原链：预览 A（`j-collect-source-1`）→ 同抽屉提交 B → 改“目标字段 1”“映射单位 1”→ 删 A（填理由、确认）：行 A 消失、列表仍 2 行、抽屉 header 仍“目标作业：j-collect”、预览 1 为 B 且徽“待验证”、编辑器 1、两输入框仍编辑值；快照 source-1 `removed=true`、B mapping 仍原值、池计数不变；“确认入库”后 B `ingested` 且 mapping = `[{合成列 1, P1-edited, P1-unit}]`。**修复后不再复现**。
   - P2 预览 A → 提交 B → 编辑 → 在同抽屉池中把另一未归属投放“归入”j-collect：池 2 → 1、列表 2 → 4，B 预览 / 编辑器 / 编辑值保持，快照 B mapping 仍原值。
   - P3 同 id：预览 A → 提交 B → 编辑 → 删 B：预览 0 / 编辑器 0（与旧例新形态“同 id 写成功两者都清”一致）。
   - P4 预览 A → 提交 B → 确认 B → 删 A：预览 1 为 B 且徽“已入库”、编辑器显示编辑值、无“确认入库”按钮。
   - P5 对照：直接预览第二行 → 删 A：预览 / 编辑器保持（原 A 的对照支未受影响）。
   - P6 列表页空作业抽屉：提交 B 进池 → 编辑 → 归入另一池项：header 仍“未指定作业…”，B 预览 / 编辑值保持，快照 B 草稿未落盘。
   - “assign 已预览的 A”在 UI 不可达（池行只有“归入”、无“预览 / 修正”），该支由组件例 `assign of previewed A…`（真实 mock state）覆盖，本会话亲跑通过。
   - 探针首轮 6 失败均为**探针自身假设错误**（行 A 文案定位用了预览标题“合成时间序列”而非行内链接；首写前 `localStorage` 快照尚不存在；console 404 为开发态资源），修正定位后全绿；探针文件与两轮日志都在 Temp。
   - 未扩到 R5-B / R5-C（slow 场景、提交中输入、Back 后回执）与任何 global 乱序；S-43 / R5-C 维持原报告的开放状态。
5. **命令完整性**：三条命令按 tasks 原文逐条亲跑（§1），数字亲取不抄；4173 每次前核空闲、后核无监听者（仅 TIME_WAIT）；未改配置、未装浏览器、未杀他人进程。未跑：`pnpm test` 总命令（T-G09）、build、后端、截图（T-G10）、46 AC 最终验收。

## 4. 授权与规格对拍

- **在原 A 授权内**：`fe9c2c9` §4 R5-A 明判“普通业务流程修正，不是 §5.1 防线：`selectReceipt` 同时把 `previewTarget` 置为回执 upload 的副本”；本 diff 正是这一处赋值，没有请求序号 / 版本检查 / 锁 / 异步 guard。plan §2.3【r6.13 成功回执同步】“沿用 `selectUpload` 的 `structuredClone` 副本写法，与 `selection.upload` 同 id / status / mapping”逐字满足。不是需求变更（spec / 46 AC 不变，不回 Clarify / Gate 1），R11 仍有效、不重开 Checklist。
- **未借此修 R5-B / R5-C**：`IntakePanel` / `open()` / `submit` 的 `resetDraft` 与 `selection` 写入都未动；没有任何 slow 路径防线被“顺手”加入（diff 只三文件）。R5-D（file 输入 / `inputKind` 复位）/ R5-E（图标）未碰。
- **架构面**：`useIntakeStore()` 交接成员 `open / close / isOpen / jobId` 不变；`previewTarget` 在 `src` 的唯一 UI 读点仍是 `IntakeDrawer` error 分支（第 36 / 39 行），error 只由 `selectUpload` 进入；本行只在成功路径把 `previewTarget` 变为非 null，不新增渲染分支。

## 5. 发现

### P1 / P2：无

### 新 P3：无

### 观察（不计入判定，不预设任务）

| 编号 | 观察 | 分级理由 |
|---|---|---|
| **O-A-1**（= Converge O-R5A-1，独立复核） | `selectReceipt` 内 `previewTarget` 是回执 upload 的 `structuredClone` 副本，而 `selection.upload` 直接引用 `receipt.upload`（`selectUpload` 则两者共用同一 `copy`）。值相等、引用不同；store 对外都经 `readonly()`；两个生产 caller 丢弃回执；测试只读回执。 | 本 diff 未引入该不对称（`selection.upload = receipt.upload` 自 T-C02 `d4e3fb6` 即如此，第五批 Review 已审）；无 caller 写回执、无引用相等比较，说不出具体出错路径，按 AGENTS §5.1 不因猜测加改动。若日后再动 `selectReceipt`，可让两者共用同一副本（与 `selectUpload` 对称），一行、非 guard，不要求现在做。**不是 P3** |
| **O-A-2**（= Converge O-R5A-2） | 新组件例首个同步断言用 `expect.soft`，目的是让旧代码下同时暴露“草稿被清”的硬断言；绿态下与硬断言等效，末尾另有硬断言 `previewTarget` = B / = 回执。 | 不削弱覆盖；红日志证明 soft 失败照样判例失败。不是缺口 |
| **O-A-3** | 新 E2E 以 `rows.first()` 的首段文本定位 A，再以快照 `j-collect-source-1.removed === true` 间接确认 A 即 source-1（Converge O-R5A-4）。本会话探针改以行内链接文本 `https://example.invalid/j-collect/1` 直接定位，同样通过。 | fixture 顺序稳定，两种定位都成立；不是缺口 |

### 测试缺口

- 本任务范围内：无。原 A 列出的缺口 1（“`selection` 与 `previewTarget` 指向不同 id 时 assign / remove 负向用例”）已由 `WI R5-A` 2 例 + E2E 1 例补齐。
- 缺口 2（R5-B / R5-C 的 slow 行为）维持：在 Walter 对 §5.1 做出决定前不应预写，以免把未批准的防线语义固化进测试。

## 6. 风险台账与 H-x（只登记，不代改 tasks / README）

- **R5-A：技术关闭**（本报告）。R3-B（`fe9c2c9`）/ R4-A（`46e8fbe`）/ R2-C 维持关闭。
- **R5-B / R5-C**：§5.1，**须 Walter 本人批准**后才可开码；未审批、未修、未经风险接受。任何修法不得借本次通过、R4-A 专项批准或通用代码授权覆盖。
- **R5-D / R5-E、S-43 及旧 P3**（R4-B～R4-E、S-41、R3-C、R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B、R2-D）：维持未处理、未经风险接受。
- **进度**（由 coordinator 回写，本报告不改 status）：74 任务 / 约 107.5 h / 248 / 248；T-C04a 可由“已实施待 A”改记为“**已完成（R5-A 增量 Review 通过，非最终 AC）**”→ 37 已完成 / 37 未开始；46 AC 最终验收 **0 / 46**；feature **未收敛**（37 项未开始 + D–F 仍占位 + H 组外部阻塞）。
- **H-5 / 页面切片**：① 候选可由 `e609c2e` 更新为 **`f63ef7c`**（本会话亲跑核对：`WI H-5` 8、`intake.spec.ts` E2E 5 例在 79 中、全部 12 份 E2E 79 / 0；交接成员 `open / close / isOpen / jobId` 不变）；② R11 `1f99f80`；③ 本会话亲跑（§1）；**④ 仍缺 → 未交付**，不得以生产方集成树 SHA 填 ④，本报告不签收。H-6 缺 T-A21；process / analyze / deliver 仍为占位。
- **PR #12 保持 Draft，不合 main**；普通同步不需新 what / Gate 1；全 feature Gate 2 仍在未来。

## 7. 结尾状态（本会话结束时）

- `git rev-parse HEAD` = `64d20e4a593395ad8544f64a9cd9141a0e11e43d`；`git status --short` 仅本新文件 `specs/workbench-interaction/review-batch5-r5a.md`（untracked，未 commit）；`git diff --check a2a2cdd f63ef7c` 干净；ignored 产物只有 `frontend/node_modules/`、`frontend/test-results/`。
- 端口 4173 无监听者（released）；未改配置；未装浏览器；未留服务；未杀他人进程。
- Temp 产物：`r5a-review-logs/{command1,command2,command3,regressions}.log`、`r5a-review-probe/{playwright.config.ts,r5a.spec.ts,probe-new.log,results/}`。
