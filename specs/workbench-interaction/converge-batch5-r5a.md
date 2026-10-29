# Feature: workbench-interaction 增量 Converge 报告 — T-C04a（R5-A 普通业务一致性补修）（converge-batch5-r5a.md）

> **性质**：AGENTS §2 第 9 步的**增量 Converge**，只看 T-C04a 一项：真实代码 `a2a2cdd..f63ef7c -- frontend` 对 spec / plan r6.13 / tasks T-C04a。**不是** Review、审核结论、Gate 2 或 Handoff；不勾 checklist，**不判 R5-A 关闭**——只能由新会话 A 增量代码 Review 判定。
>
> - **作者**：Converge / Analyze R27 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a189eb-e03e-755d-b516-41616d94c44c`）。`claude-bridge` 本窗口既有限额、无重置证据，按 §6 规则 2 / 5 不重试；同模型官方通道成功；未改配置。派工 = 集成人 `01a18388-a371-7746-8158-9fb15d55d819`。
> - **写入**：唯一树 `D:/2030/Futures-AI-interaction-converge-batch4`（`docs/workbench-interaction-batch4-converge`），起点 HEAD `f63ef7c62f273626e4ee72f94d16bfa53b52f148` clean；未建新目录。只写本文件、tasks / analyze / implementation-log / interface-handoff，以及 `specs/README.md` 本 feature 两行。plan 准确、不动；未改代码 / 测试 / spec / checklist / 旧 Review / 旧 Converge / docs / HANDOFF / 其他树；**未运行产品测试**，未 commit / push / merge，未派 agent。
> - **测试数字来源**：全部来自实施者（Astra）执行：Temp `wi-batch5-01a18388-q7s7olxl/astra-r5a-summary.md` 与 `astra-r5a-logs/`（red-component / red-e2e(+artifacts) / command1(-rerun) / command2 / command3(-rerun) / e2e-list / regressions / preservation / final-git）。本会话亲跑的只有只读 git、字节比较与结构脚本（Temp `r5a-converge-work/`，非项目产物）。日期 2026-10-30。

## 0. 固定输入

| 项 | 值 |
|---|---|
| 任务 / 授权 | T-C04a（r6.13，0.5 h，依赖 T-C03 / T-C04，3 标准 : 3 命令）。授权 = review-batch5（原件 `fe9c2c9`）§4 R5-A：A 明判**普通业务一致性、非 §5.1 防线**，可按 §2 第 9 步登记；集成人选择只修 R5-A；登记提交 `a2a2cdd`（plan r6.13 / tasks / Analyze R26 / implog §24） |
| 代码 | `f63ef7c62f273626e4ee72f94d16bfa53b52f148`，父 = `a2a2cdd`（其 frontend 与 `e609c2e` 相同）；`a2a2cdd..f63ef7c` 全仓库与 `e609c2e..f63ef7c -- frontend` 都恰 3 文件 **+82 / −2**；`git diff --check` 干净（本会话只读复核） |
| 实施者 | openai/gpt-6-astra via openai，新会话 `01a189e3-09a9-75a4-a3ad-882e181b41d6`（会话日志只有该模型、0 次 error 停止，未回退）；实施树 / 生产方集成树 / 本树 HEAD 均为 `f63ef7c`（集成树只是旁证，不是 ④） |
| 有效 Checklist | R11 `1f99f80`，blob `27a76aa6c3e4adcb817fed5d9b6512e1853061dd`，26 / 26，只读 |

重读：AGENTS.md、`docs/plan.md`、冻结 spec（blob `102af73…`，AC-003-4 / AC-009-1）、plan 页首 r6.13 与 §2.3【r6.13 成功回执同步】、tasks 页首 r6.13 / T-C04a 全文（三标准三命令）/ T-G09 / §5 AC-003-4、review-batch5 §4 R5-A～R5-E 与 §7、Analyze R26、implog §24、interface-handoff r6.13 块。完整读了 `git diff a2a2cdd f63ef7c`、`f63ef7c` 的 `intake.ts` 全文与 `previewTarget` 全部读点、两个测试的改动段及其 harness；回报只作结果来源。

## 1. diff 事实

- **生产**（`stores/intake.ts` +1）：私有 `selectReceipt` 首行加 `previewTarget.value = structuredClone(receipt.upload)`，其后照旧写 `selection` / ready / null。`clearPreview` 条件、`open` / `selectUpload` / `editMapping` / `submit` / `confirm` / `assign` / `remove` / `loadPool` / `refreshViews`、返回对象、`emptyDraft` 逐字不变。`receipt` 是契约层刚返回的原始对象（非响应式代理），可直接 `structuredClone`；`toRaw` 只在 `selectUpload` 入参（DeepReadonly）上需要，plan“沿用副本写法”的语义一致。`previewTarget` 在 `src` 中唯一 UI 读点仍是 `IntakeDrawer` 的 error 分支（第 36 / 39 行），error 只能由 `selectUpload` 进入，渲染路径未变。
- **组件**（`unassigned-pool.spec.ts` +35 / −2）：
  - 旧例 `test.each(['assign','remove'])` 恰 3 行：① 标题改为 `%s clears a receipt selection and its synced preview target`；② 原 `toBeNull()` 行换为 `expect(store.previewTarget!.id).toBe(receipt.upload.id)`；③ 写后、`selection` 断言前追加 `expect(store.previewTarget).toBeNull()`。用例数仍 2，其余 28 例 / imports / helpers / describe 名零差异（diff 只有这一 hunk + 文末追加）。
  - 追加 describe `WI R5-A`（`test.each` 2 例）：真实 Pinia + 既有 `connect()` 透传 spy，无 `vi.mock`；loadPool → selectUpload(A = pool[0]) → submit 文本 B（`jobId` null）→ `previewTarget` 等于回执 upload（`expect.soft`）→ editMapping B → assign / remove A（spy 恰一次）→ selection 仍 B、草稿仍编辑值、`previewTarget` 仍 B、ready → confirm（spy 参数 = 编辑映射）→ 回执 ingested、mapping = 编辑值，`selection.upload` 与 `previewTarget` 都等于回执 upload。
- **E2E**（`e2e/jobs/intake.spec.ts` +46）：原 205 行 / 14808 字节是新文件逐字节前缀（本会话 `git show` + `cmp` 复核），只追加 1 例 `WI R5-A…`：normal、真实 UI 链（行 A“预览 / 修正”→ 同抽屉 `fillText` 提交 B → 改“目标字段 1”→ 删除 A 并确认 → 确认入库），取证只读 `localStorage` 快照与 DOM；复用既有 `snapshot` / `fillText`；无窗口钩子 / fixture / 直接 API 写，配置未改。

## 2. 逐条完成标准

| 标准 | 代码 / 测试证据 | 命令结果（实施者执行，本会话未重跑） | 判定 |
|---|---|---|---|
| **1** 组件 2 例 + 整文件 30 + 2 = 32，旧例只有那一例 3 行（AC-003-4 最终，与 T-C02 共同；R5-A） | §1 组件；断言覆盖“assign / remove 另一 id 后 B 的选中、草稿、同步 target 保持；确认后 target 与 selection.upload 的 status / mapping = 回执” | 命令 1：**2 passed / 30 skipped → 32 passed**；类型修正后重跑同数（command1 / command1-rerun）。**先红**：旧生产下 2 failed——soft 断言显示 target 仍为池中 A（`u-unassigned-file`），硬断言第 508 行 selection 已被清（`undefined`），assign / remove 两支都复现 | **满足** |
| **2** Chrome normal 1 例；全部 E2E 78 + 1 = 79，原 intake 4 例与其他 E2E 不改（AC-003-4 最终；R5-A） | §1 E2E；确认前快照 B mapping 恒等于原值，删除 A 后预览 1 / 编辑器 1 / 输入框仍编辑值，确认后 ingested 且 `mapping[0].targetField` = 编辑值 | 命令 2（每次前确认 4173 空闲，Playwright 自管 Vite）：**1 passed → 79 passed / 12 files**（`--list` 79 in 12，原 intake 4 例在列）。**先红**：旧生产下 1 failed，第 237 行“抽取预览”期望 1、实际 0（error-context / trace 保留） | **满足** |
| **3** 全量 1128 + 2 = 1130 / 39 files；typecheck / lint / 六守卫 / contract 25 / 10 / 2；`e609c2e..HEAD -- frontend` 只含三文件（AC-009-1 部分前置） | 无删用例；三文件 | 命令 3 首跑：1130 过，typecheck **TS2345**（新测试第 512 行 `structuredClone(toRaw(mapping))` 保留 readonly 类型）。只把**新测试**的副本构造改为 `mapping.map(field => ({ ...field }))`，期望 / 源码 / imports / helpers 不变，命令 1 与命令 3 全链重跑：**39 files / 1130 / 0**、typecheck / lint、六守卫、contract **25 / 10 / 2** 通过；提交后 diff 腿 = 3 文件 +82 / −2（final-git） | **满足** |

回归（非标准，实施者执行）：`WI H-5` **8**、`WI H-2` **27**、`WI labels` **10**、real-stubs + routes + session-context + contract-doc + contracts + mock 六文件 **129**。保全脚本（preservation.log）PASS：生产只多一行；E2E 205 行前缀；组件只有许可的 3 行；R11 blob 不变；恰三文件、无未跟踪文件。未跑：`pnpm test` 总命令（T-G09）、build、后端、截图（T-G10）、任何 46 AC 最终验收。

## 3. 授权与规格对拍

- **在授权内、是普通赋值而不是防线**：只在现成成功路径里补一次赋值，恢复 plan【r6.13】不变量“成功回执后 `selection.upload` 与 `previewTarget` 指向同一投放”；没有请求序号 / 锁 / 比较 / 提交中禁用 / 生命周期 guard，失败路径不调用 `selectReceipt`、字段不动。与 tasks 修改范围逐项一致；**R5-B / R5-C（§5.1，待 Walter 本人决定、未审批）未被顺手实现**，R5-D（file 输入 / `inputKind`）/ R5-E（图标）未碰。
- **测试演进**：唯一旧例冲突即 tasks 预登记那一例 3 行；它原断言的正是 R5-A 缺陷状态，新形态还加强了“同 id 写成功两者都清”。无第二处，无删用例。TS2345 是新测试自身类型问题，修复只在新测试内、未改期望，属正常 red → fix，非范围变化。
- **结论**：实施与 plan §2.3【r6.13】/ tasks T-C04a 一致，plan 无需新版本；不是需求变更（spec 46 AC 不变，不回 Clarify / Gate 1）；R11 仍有效，不另开 Checklist。

## 4. 交给 A 的观察（不是缺口，不预设结论）

- **O-R5A-1**：`selectReceipt` 中 `previewTarget` 是回执 upload 的独立副本，`selection.upload` 是回执原对象（`selectUpload` 两者共用同一 `copy`）。值相等、引用不同；`src` 无引用相等比较，按 plan“副本”写法。
- **O-R5A-2**：新组件例的首个同步断言用 `expect.soft`，是为了旧代码下也能暴露后续“草稿被清”；软断言失败照样判例失败，绿态下它与硬断言等效，末尾另有硬断言 `previewTarget` = B / = 回执。
- **O-R5A-3**：红日志中的组件测试是 TS 修正前版本（第 502 行副本写法不同），断言与期望未变；命令 2 只跑过一次（TS 修正只动组件文件，与 E2E 无关）。
- **O-R5A-4**：E2E 以“首行首段文本”定位 A，再以快照 `j-collect-source-1.removed === true` 间接确认 A 即 source-1，符合 tasks 步骤 1 的指认。

## 5. 状态回写与结论

- **T-C04a** → “**已实施（待 A 新会话增量 Review，不计完成）**”，登记 `f63ef7c`、逐命令结果、红 → 绿与 TS 留痕；派工原文保留。标准 / 命令 / 工时 / 依赖不改。
- **进度**：74 / 约 107.5 h / 248 / 248；**37 已实施 = 36 已完成（Review 过）+ T-C04a 1 项待 A**；**37 未开始**；46 AC 最终验收 **0**；feature **未收敛**（37 项未实施 + T-C04a 待 A + H 组外部阻塞）。结构复算见 analyze.md「Analyze R27」。
- **风险台账**：R5-A **代码已修、未关闭**（待 A）；R3-B 技术关闭（原 A `fe9c2c9`）不变；R5-B / R5-C 须 Walter §5.1 决定、未审批、未修；R5-D / R5-E 与旧 P3 均未经风险接受。
- **H-x**：H-5 / 页面切片 ① 旧候选 `e609c2e` 已经 A 核对；新候选 `f63ef7c` 待 A 增量 Review 后才替换；② R11；③ 实施者新测试（原 `WI H-5` 仍 8）；**④ 仍缺 → 未交付**。H-6 缺 T-A21；D–F 仍占位；不代 v2 签收。
- **本任务范围内缺口：无**；不新增任务。**本任务增量已收口，待独立 A 增量 Review**（新会话、非 Implement 模型；固定审 `a2a2cdd..f63ef7c -- frontend`（= `e609c2e..f63ef7c -- frontend`）+ 本轮文档提交；重点：一行修复、旧例 3 行、无第二处、无 guard、O-R5A-1～4）。A 通过前不写“已完成”、不关 R5-A、不更新 H-5 ①。
