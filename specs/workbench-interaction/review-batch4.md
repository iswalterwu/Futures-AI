# Feature: workbench-interaction 代码 Review — 第四批 T-B01 / T-B02 / T-A22d / T-B04 / T-B03（review-batch4.md）

> **性质**：AGENTS §2 第 10 步 Review 的**批次评审**，只审第四批 5 项。**不是**全 feature 最终 Review、**不是** Gate 2、**不是** Handoff；不勾 checklist、不改代码 / 测试 / fixture / spec / plan / tasks / 旧 Review / Converge / docs；不替作者修代码、不代 Walter 做风险接受、不代 v2 接收方签收。结构参照 `templates/review.md` 与 `review-batch3.md`，Gate 2 记录不填。
> **审核员 A（脱敏）**：`claude-fable-5-1` **via anthropic**（官方通道；`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`、PI_SESSION_ID `01a1881e-0d52-740b-8dea-83fca258f12f`）。本协调窗口 bridge 已确认 quota / rate / spend_limit 类限额，不重复试；**fable 未单独探 bridge，不声称探过**；官方通道此前最小调用与实际任务均成功，本评审走官方通道。只换通道、不换模型；未改 provider / key / 路由 / 全局配置；不因测试结果换模型。新会话、独立 worktree，与 Implement（`openai/gpt-6-astra`）异模型，与 Converge（`claude-opus-5-5`）隔离。
> **固定输入**：worktree `D:/2030/Futures-AI-interaction-review-batch4`，branch `review/workbench-interaction-batch4-code`，HEAD `adede0ca02a23ddc11560e6b5674fab48ca37a43`（起始 `git status --short` 为空）。受审代码 = `git diff 37e2f71aae5a625de7e39a3f4b2d9c0b1a9c7b38..6c082fd60570a329771727be16b494f81775f957 -- frontend`（5 个前端提交、17 文件、+1870 / −11；`git diff --check` 通过；`-- . ':!frontend'` 零差异），逐提交 T-B01 `5c00cf6`（7 文件）→ T-B02 `0221a94`（2）→ T-A22d `ca7dca1`（2）→ T-B04 `cc6559d`（5）→ T-B03 `6c082fd`（4）。`6c082fd..adede0c` 只有 7 个 specs 文档，`-- frontend` **零差异**（本会话核）。有效 Checklist **R10** 原件 `37e2f71`，本树 `checklist.md` blob = `4537c55f226f0bdc4f39b19e7c369731cf23abba`（与原件相同，只读未改）。冻结 spec LF 归一化 SHA256 `ed0f6c6c…942d9`（与 Analyze 登记相同）。正式 base `43b6d79`（HEAD 祖先 ✓）、上游 pin `90187f7`（祖先 ✓）、main `072bb12` **不是**祖先（不据此判任何既有 route 测试为错；R2-D 流程不变）。
> **重新读取**（不依赖会话记忆）：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`；冻结 spec v1.1（§2 范围、R-001 / R-002 / R-008、46 AC、§4 约束、§5 歧义表）；plan.md（页首 r6.9 / r6.10、§1【r6.9】R2-C 表、§2.1【r6.9】【r6.10】、§2.3【r6.8】【r6.9】【r6.10】）；tasks.md（T-A22d / T-B01～T-B04 全部修改范围、完成标准与命令，T-B05 状态行 S-41 承接句，§0 / §1 / §2a / §3 / §5～§7）；checklist.md R10 节（S-41～S-43，只读）；analyze.md R16 / R17；implementation-log §14 / §15；interface-handoff；`converge-batch4.md` 全文；`review-batch2.md` R2-C / R2-D 原文；`review-batch3.md` 风险台账。受审 17 个文件全部真实阅读；`contracts/mock/index.ts`（场景 / `agentScript` 读取时机、`delayScenario` 1500 ms、`readJobState`）、`app/nav.ts`、`app/Rail.vue`、`agent/CotTimeline.vue`、`e2e/agent.spec.ts` 只读作旁证。
> **边界**：唯一改动文件 = 本文件。依赖安装只落本树 gitignore 的 `frontend/node_modules/`（`pnpm install --frozen-lockfile --offline`，锁文件未改，评审结束 `git status --short` 仍为空）。只读浏览器探针（Playwright 配置导入本树 `playwright.config.ts`、`testDir` 指向 Temp、`webServer.cwd` 指向本树 frontend）与日志只写 `C:/Users/iswal/AppData/Local/Temp/wi-batch4-01a18388-nzh9q1wh/review-probe/`（`playwright.config.ts` / `probe.spec.ts` / `probe-results.log`；**非产品测试，不计入 29 条正式 E2E**；不清理共享 tmp、不记凭证）。未 commit / push / PR / merge，未派生 agent，未写其他 worktree，未改锁 / config，未下载 Chrome（用本机既有 `channel: 'chrome'`），E2E 与探针结束后 4173 无 LISTEN、无遗留服务。
> **日期**：2026-10-29（+04:00）。

## 0. 判定

**本批未通过**：**1 项 P2**（R4-A，= Converge O-B4-2，真实浏览器复现，不是 harness 伪影）；**4 项 P3**（R4-B～R4-E）；0 P1。按 AGENTS §2 第 10 步判定规则（存在 P1 / P2 = 未通过），1018 条单测与 29 条 E2E 全绿不改变此结论。

与此同时，**代码层对 5 项任务完成标准的实现全部成立**（§2）：本会话亲跑全部 17 条任务命令，用例数与实施者逐条相同；全量单测 34 文件 1018 / 0、六守卫、`contract --check` 24 / 10 / 2、typecheck、lint、四份 E2E 29 / 0；文件所有权与 AGENTS §5 纪律未越界；无 `vi.mock` 内部模块、无 Window 测试钩子、无新 guard / 请求序号 / 总线；旧测试零删改。**R2-C 的代码修正本会话独立核实无误**（§5），其关闭随本批最终通过 / Gate 2 生效。

**R4-A 的处置边界**（§3 详述）：唯一能根治的最小修改（约 3 行，在 `JobDetailPage.vue` 的 `watch` 回调用 Vue `onCleanup` 标记过期后不再 `router.replace`）属 plan §2.1【r6.9】明写“不加比较 / 去重 guard”、plan §2.3【r6.10】“任何新增 guard 按 AGENTS §5.1 先报 Walter”的范围。**本评审只判定与建议，不实现、不代为风险接受；集成人通用代码授权不覆盖这项新增防护；“修 / 接受风险 / 改设计”三选一由 Walter 本人在 Gate 2 决定。** 本评审给出了 §5.1 要求的三项具体依据（怎么出错 / 概率 / 代码量），供 Walter 据此裁定，不以命名方式绕过授权。

**不改变的事实**：46 AC 最终验收仍 **0**（本批 6 个 AC 的最终任务已实施，但最终验收须全 feature Review / Gate 2）；feature 整体**未收敛**（26 / 69 已实施 = 21 已完成 + 本批 5，43 未开始，H 组外部阻塞）；四阶段工作区仍为 C–F 占位；B05 原因 / 取消 / 创建者、B07 重跑、A14+、A18、A21 / G02 角标、G04 横幅均未实现，本评审**不**因未来项缺失记本批 P2，也不冒称页面功能完整。S-41（创建者展示）按 tasks T-B05 状态行由本 feature 在 T-B05 开工前承接，**未经风险接受**，本评审不改其归属。本评审**不是** Gate 2 / Handoff。

## 1. 独立亲跑证据（本会话执行，固定代码 `6c082fd` 的前端树 = HEAD 前端树）

| 命令 | 结果 |
|---|---|
| `pnpm install --frozen-lockfile --offline` | exit 0（本树原无 `node_modules`；锁未改） |
| `pnpm typecheck` / `pnpm lint`（`--max-warnings 0`） | exit 0 / exit 0 |
| `pnpm check`（六守卫） | tokens 156 / 5 artifacts；contract 24 / 10 / 2 generated；generated / colors（24 / 24 正样本、0 负命中）/ glass / updown / grid / network 全 passed；之后 `git status` 仍 clean |
| `pnpm contract --check` | `24 methods, 10 events, 2 artifacts match` |
| `pnpm test:unit`（全量） | **34 files / 1018 passed / 0 failed**（与实施者末轮一致） |
| v1 三份契约测试 `contracts / contract-doc / mock.spec.ts` | 3 files / **88 passed** |
| `tests/unit/jobs/real-stubs.spec.ts` | **23 passed** |
| `routes.spec.ts` + `session-context.spec.ts` | **17 passed**（pin 基线上成立；R2-D 不动） |
| `jobs-store.spec.ts -t "WI H-2"` | **27 passed**（16 skipped = 本批新组） |
| `contract-labels.spec.ts -t "WI labels"` | 10 passed |
| **T-B01** 命令 1～4 | `WI AC-001-1` **2**；`WI AC-001-4 list` **4**；`WI badge tone` **21** + colors + glass ✓；badges 整文件 **48**（其中原 `WI status badges` **18**、`WI source badge` **9** 单独复跑亦通过）+ typecheck + lint ✓ |
| **T-B02** 命令 1～2 | `WI AC-001-2` **6**；typecheck + lint ✓；job-list 整文件 **12** |
| **T-A22d** 命令 1～4 | `WI detail cache open` **4**；`states` **6**；`refresh` **6**；整文件 **43**（原 27 + 新 16）+ typecheck + lint ✓ |
| **T-B04** 命令 1～4 | `WI AC-002-1` **6**；e2e `WI AC-002-2` **4**；两文件 `WI AC-001-4` **9**；typecheck + lint ✓；job-detail 整文件 **11** |
| **T-B03** 命令 1～3 | `WI AC-001-3 validation` **4**；e2e `WI AC-001-3` **1**；`WI non-modal` **1** + typecheck + lint ✓ |
| 四份 E2E `shell + agent + jobs/detail-stage + jobs/list-create` | **29 passed / 0 failed**（1.1 min，4 workers；Playwright 自管 4173，前后无 LISTEN） |

**未跑**：其余 7 份 E2E、全量 `pnpm test`、人工截图（不构成任何 AC 最终验收）。

**只读浏览器探针**（Temp，Chrome，slow / job-running / normal 场景；完整时间线见 `probe-results.log`）：9 个探针全部按预期复现了 O-B4-1 / O-B4-2 / O-B4-4 的真实行为，结果写入 §3 / §4。

## 2. 逐任务核对（完成标准 → 真实代码 → 亲跑）

| 任务 | 标准 | 代码证据（本会话读） | 判定 |
|---|---|---|---|
| **T-B01** `5c00cf6` | ① 列表只读 store、顺序 = `listJobs()`、卡片字段 / 图标 / `time[datetime]` / `href=/jobs/<id>`；② 三态 + 诊断 `jobs-list` 可复制、重试经 `refresh()`；③ R2-C 令牌表；④ 工程门 | `JobListPage.vue`：`displayedJobs = filteredJobs ?? jobs`，`onMounted → ensureJobs()`，按 `listStatus` 分支 Loading / `ErrorState(module-id="jobs-list", @retry=refresh())` / `EmptyState` / `JobCard` 列表，不重排、不碰 `dataClient` / Storage。`JobCard.vue`：`props job: DeepReadonly<JobListItem>`，`RouterLink {name:'job-detail', params:{id}}`（无 stage），`JobTypeLabel` / `JobStatusBadge` / `StageLabel` / `<time :datetime>` 原样，无角标。徽标：根 `:data-status`，基础边 `var(--fai-glass-module-border)`，属性选择器 ok / warn / bad 与 plan §1【r6.9】表**逐值相同**（Job：5 ok / needs_human warn / failed bad / draft、cancelled 无规则；Artifact：confirmed+ingested ok / provisional+pending_validation warn / conflict+quarantined bad / draft 无）；SourceBadge 只换基础边、无 `data-status`；三者 `color` 未变、无 `--fai-status-sample`。测试：真实 Pinia + memory router + `registerJobRoutes`，边界 spy 透传真实 mock client；`WI badge tone` 以 `?raw` + `CSSStyleSheet` 解析真实 SFC 并同时断言原文 `border: thin solid var(--fai-glass-module-border);`（O-B4-5 核：改写后的断言仍证明基础边中性） | **满足** |
| **T-B02** `0221a94` | ① 组合 / 清空；透传参数 = 组装 filter；卡片 = 真实 `listJobs(filter)`；title 不 trim；空结果专用文案；② 工程门 | `applyFilter()`：status / type 原值、`title !== ''` 原样（不 trim）、全空 → `applyFilter(null)`；`clearFilter()` 复位三控件 + `applyFilter(null)`；初值取 `jobsStore.filter`（r6.10）；选项来自 `JobStatusSchema.options` / `JobTypeSchema.options` + Label；无前端重筛 / 排序 / 防抖；错误态沿用共享读状态。`WI AC-001-2` 6 例：五步组合逐步断言 spy 参数与真实结果、`store.jobs` 引用不变；`' j-process '` / `'J-PROCESS'` 0、`' '` 5；筛选失败 → 成功保持错误 → 重试恢复两份 | **满足** |
| **T-A22d** `ca7dca1` | ① 四只读成员 + `openJob`；② 三态与错误语义；③ 统一刷新独立 try；④ 不加 closeJob / 序号 / 锁 / guard | `jobs.ts` +43 / −1：`currentJob` / `currentStageWorkspace` / `detailStatus` / `detailError` 均 `computed(readonly)`；私有 `anchor` 与共用 `readDetail(target)`（`getJob` → `stage ?? job.currentStage` → job 非 null 才读工作区 → 一次写两缓存、`target.stage` 定为有效阶段、ready、清错）；`openJob` 先置锚、仅换作业置 loading、失败写原 `error` 并 resolve null；`refresh()` 原列表 / 筛选 try **原文未动**，之后 `anchor !== null` 独立 try，不置 loading、只写 detail 两字段。原 447 行测试零删改（`git diff` 无 `-` 行），`ensureJobs` / `applyFilter` / `createJob` / `receiveAgentEvent` 原文不变。新 16 例覆盖 readonly 深层、slow 假时钟、empty / not_found / adapter_error resolve、refresh 各 1 次、列表 / 详情错误独立、store 上无 `anchor` / `readDetail` / `closeJob` | **满足** |
| **T-B04** `cc6559d` | ① 固定顺序四阶段 + 五态 + 当前高亮；两种标记；点击 replace；详情头；② e2e URL / reload / 缺省 / bogus；③ 详情三态；④ 工程门 | `JobDetailPage.vue`：`watch([params.id, params.stage], async, {immediate:true})`，合法 stage → `openJob(id, stage)`；否则 `openJob(id, null)` 后非 null 一次 `router.replace`；按 `detailStatus` 分支，`ErrorState(module-id="job-detail")`，不调 `ensureJobs`；详情头 subject null / goal `''` 不渲染，`.job-goal{white-space:pre-wrap}`；不显示 createdBy（S-41）。`StageRail.vue`：按 `stages` 原序 4 个 `<button type="button">`，`aria-current="step"` + `border-inline-start-color: var(--fai-accent-red)`（同 `app/Rail.vue`），`aria-pressed` 布尔 + 下划线，emit `select` → 页面 `router.replace`。`StageWorkspace.vue` 只占位。E2E 4 例亲跑通过：缺省 / bogus → `/process`，`/analyze` reload 仍 pressed 分析、current 处理，点交付 → `/deliver`，`goBack` 回 `/jobs`。组件测试经 `RouterView` 挂载（S-42 落实） | **满足**（R4-A 是 plan 已登记的 async 入口的生命周期缺陷，不是对本任务标准字面的违反，见 §3） |
| **T-B03** `6c082fd` | ① 校验失败不调 store；subject / goal 映射；失败诊断 `job-create`、表单保留；② e2e 记录 + 回显；③ 非模态；工程门 | `JobCreatePanel.vue`：`CreateJobInputSchema.shape.title.safeParse` / `JobTypeSchema.safeParse` 即时提示；`type` 初值 `''`、选项来自 `JobTypeLabel`、不默认；`subject.trim()==='' ? null : subject`；goal 原值；校验失败 `return`；成功 `jobsStore.createJob` → `router.push({…stage:'collect'})`；失败 `ErrorState(module-id="job-create", @retry=submit)`，无导航 / 锁 / 草稿 / modal。`<section aria-label="新建作业">` + `<form novalidate>`；JobListPage 只增 `aria-expanded` 按钮与 `v-if` 挂载。E2E 读 `localStorage["fai.jobs.v1"]` 真实快照（无 Window 钩子），回显标题 / 专题 / 提取中 / goal 多行 / 提取 `aria-current`。`moduleId='job-create'` 与 R10 已审 tasks 原文一致（协调提示 `jobs-create` 为笔误，非偏离） | **满足** |

**测试真实性（全批）**：三份组件测试与 store 测试均用真实 Pinia / 真实 memory-history router（`appRouter.options.routes` + `registerJobRoutes`）/ 真实 mock client，只在系统边界 `vi.spyOn(dataClient, …)` 透传；无 `vi.mock` 内部模块；无把业务算法抄进测试（顺序断言用 `updatedAt` 字符串倒序对照真实结果；筛选断言对照真实 `listJobs(filter)`）；clipboard 按 `focus-band.spec.ts` 先例；SFC 样式用 `?raw` 解析。旧 `badges.spec.ts` 27 例、`jobs-store.spec.ts` 27 例零删改（diff 无 `-` 行）；B01 旧用例在 B02 / B03 提交中保留。无生成物 / 锁 / config / 旧 E2E / peer 文件变更（`git diff --stat` 对 `app / shared / agent / workbench / contracts / main.ts / routes.ts / session.ts / package.json / pnpm-lock.yaml / vitest.config.ts / playwright.config.ts / scripts` 全为空）。scopeOwner 逐提交与 implementation-log §14 写权限表一致。

## 3. 发现（按严重度；位置 / 复现 / 影响 / 建议）

### R4-A（**P2**）— 离开详情后迟到的 canonical `router.replace`（= Converge O-B4-2；**真实生命周期缺陷，非 harness 伪影**）

- **位置**：`frontend/src/jobs/pages/JobDetailPage.vue` :21–27：
  ```ts
  watch([() => route.params.id, () => route.params.stage], async ([id]) => {
    const stage = viewedStage.value
    const openedStage = await jobsStore.openJob(id as string, stage)
    if (stage === null && openedStage !== null) {
      await router.replace({ name: 'job-detail', params: { id, stage: openedStage } })
    }
  }, { immediate: true })
  ```
  组件卸载 / 参数变化会停止 watcher 的**再触发**，但**不会取消已在 `await` 中的回调**；`openJob` 完成后无条件执行 `router.replace`。
- **真实浏览器复现**（Chrome，`?scenario=slow`，每次契约读 1500 ms，无 stage 入口 = `getJob` + `getStageWorkspace` = **3000 ms 窗口**；时间戳见 `probe-results.log`）：
  1. **2a 侧栏离开**：`/jobs` → 点卡片 j-process（`/jobs/j-process`）→ +30 ms 点侧栏“价格”（`/prices`）→ **+3000 ms URL 被拉回 `/jobs/j-process/process`**。`history.length` = 4：`/prices` 这条历史记录被 replace 覆盖。
  2. **2b 浏览器 Back**：`/jobs` → 点卡片 → Back 回 `/jobs?scenario=slow` → +3000 ms URL 变 `/jobs/j-process/process`，**列表页那条历史记录被覆盖**；再 Back → `about:blank`（用户被弹出应用）；Forward → `/jobs/j-process` → 再次 canonical → `/process`。
  3. **2c 用户的阶段选择被静默覆盖**：同一作业已缓存（第二次从列表进入，轨道即时可见）→ 点“交付”（URL `/deliver`，`aria-pressed` 交付）→ +3000 ms **URL 变回 `/process`、`aria-pressed` 处理、工作区“处理工作区”**，之后不再自愈。此时 AC-002-2 第一句“点击阶段切换工作区，URL 更新”在 spec R-008 / AC-008-2 列明的“延迟”场景下**不成立**。
  4. **2d 换作业**：j-process（无 stage）→ Back → 点 j-failed → +3000 ms URL 先跳 `/jobs/j-process/process`（被遗弃作业）、+50 ms 再被 j-failed 的回调改回 `/jobs/j-failed/analyze`；+6000 ms 还出现一次 j-process 标题显示在 j-failed URL 下（~50 ms，store 迟到写入，见 R4-E）。此例最终自愈，仅因“最后一次导航的读晚完成”，不是机制保证。
- **与既有登记的关系**：Checklist R10 S-42 只分析了“卸载后 watcher 不再以 `id=undefined` 触发”，S-43 与 plan §2.3【r6.10】把本项归入“真实 `api` 乱序 / 后发先至”；**但本缺陷在请求完全按序、同延迟的 mock 口径下就发生**（2a / 2b / 2c 都只有一次读），plan 用来不加 guard 的前提（“mock 同延迟、按序完成”）**不覆盖**它。Converge §5 已明确“交 A 实测 / 判定是否报 Walter”，故这不是已接受风险，也不是需求变更。
- **AGENTS §5.1 三项依据**（供 Walter 裁定）：① **怎么出错**：导航劫持 + 历史记录被 replace 销毁（2b 可把用户弹到 `about:blank`）+ 用户阶段选择被静默覆盖（2c）；② **概率**：v1 normal 场景读在同一宏任务内完成，人无法介入，**不可达**；slow 场景（spec 列明、AC-008-2 要求可用、E2E 使用）**确定性复现**；接入真实 `api` 后，窗口 = 两次往返延迟，而无 stage 入口正是 **JobCard 的默认链接**（tasks T-B01 设计“不带 stage”），即每次列表 → 详情都打开此窗口，误点 Back / 侧栏即触发；③ **代码量**：约 **3 行**，Vue 官方 watch 清理机制：
  ```ts
  watch([...], async ([id], _old, onCleanup) => {
    let stale = false
    onCleanup(() => { stale = true })          // 再触发或组件卸载时调用
    const stage = viewedStage.value
    const openedStage = await jobsStore.openJob(id as string, stage)
    if (!stale && stage === null && openedStage !== null) await router.replace(...)
  }, { immediate: true })
  ```
  另加 1 例组件回归（slow 假时钟：push `/jobs/j-process` → 1 ms 后 push `/workbench` → 推进 3000 ms → `replace` 未调用、路由仍 `/workbench`；以及同作业内 push `/deliver` 后不被改回）。
- **为什么本评审不自行归类为“普通流程修复”**：这段改动的本质就是“异步回调完成后检查自身是否仍有效”，与 plan §2.1【r6.9】“不加比较 / 去重 guard”字面冲突，Converge 也已把它列为须 Walter 同意的事项。本评审不用“清理回调不是 guard”之类的命名绕过授权；集成人通用代码授权不覆盖。**Walter 的选项**：(a) 批准上述最小 guard（≤ 0.5 h，按 §2 第 9 步登记小任务 → Implement → A 定向复核）；(b) 明确风险接受（记入 tasks §3 / plan §2.3，并把“slow 下离开 / 选阶段会被拉回”写入 T-G10 人工验收已知项）并随 `api` feature 处理；(c) 改设计（如 JobCard 默认带 `currentStage` 以收窄默认路径——但 `/jobs/:id` 深链仍有窗口，且改 T-B01 / e2e，不建议）。**未取得 (a)(b)(c) 之一前，本批不应进入 Handoff / merge。**
- **不受影响**：`sessionStore.context` 随 URL 一致变化，不是独立缺陷；store 本身无崩溃 / 未处理 rejection（`router.replace` 对中止导航 resolve 而非 reject）。

### R4-B（P3）— 应用内四处导航不透传 `route.query`（= O-B4-1）

- **位置**：`JobCard.vue` RouterLink、`JobDetailPage.vue` canonical replace 与 `selectStage`、`JobCreatePanel.vue` 成功 push，均只带 `{name, params}`。
- **真实复现**：① `/jobs/j-human/process?scenario=job-running` 点“分析” → `/jobs/j-human/analyze`（query 丢）→ reload → `{"code":"not_found","message":"作业 j-human 不存在。"}`；`/jobs?scenario=job-running` 点卡片同样 → reload not_found。② `/jobs/j-process/process?agentScript=long` 发送一次（step 1 “将分批读取样例数据…”= long）→ 点“分析” → 再发送 → step 1 “先读取合约价格，再核对库存指标。”（= **success**，`readAgentScript()` 每次 send 重读 `location.search`）。
- **判定**：**不违反** AC-002-2（两项字面：URL 更新 ✓；直接打开带阶段地址刷新仍停留 ✓，直开时 query 不丢）与 AC-008-2（场景经 `?scenario=` 直开可用并被 E2E 使用 ✓）。v1 壳 `Rail.vue` 的 `:to="item.path"` 同样不带 query（已交付、已过 Gate 2），`e2e/agent.spec.ts` AC-005-3 正是在 Rail 丢 query 之后继续运行；`scenario` 在 client 创建时读一次，会话内不受影响；真实 `api` 无此 query。影响限于 mock 演示 / 下游 E2E 编写（T-G01 / T-G05）。
- **建议**：不在本 feature 单独给四处加 `query: route.query`（会与壳 Rail 行为不一致；若要透传应是壳级决定，归 v2 Clarify / candidates），下游 E2E 按 Converge 已加的阅读提示直开深链或用 `window.__FAI_MOCK__.agentScript`。承接 = T-G01 / T-G05 状态行提示（已登记）；不需 Walter 批准；若 Walter 仍要透传，按 Converge §5 最小方案 ≤ 0.5 h 登记。

### R4-C（P3）— 创建面板两条 `role="alert"` 在展开瞬间即渲染（= O-B4-3）

- **位置**：`JobCreatePanel.vue` :57–63 / :79–85，`v-if="!titleResult.success"` 在初值 `''` 时为真。
- **影响**：屏幕阅读器在用户尚未输入时就播报两条错误；E2E“先空提交再见提示”无法区分提交触发与初始渲染（标准字面仍满足）。spec §2 把“无障碍专项”列为非目标。
- **建议**：归 T-G10 M-01 人工验收记录；若要改，用“提交过一次后才显示提示”的 1 个 `ref`，不新增机制；不需 Walter 批准。

### R4-D（P3）— 同作业重开时先显示上一次的 `not_found` 错误（= O-B4-4）

- **位置**：`jobs.ts` `openJob` 只在换作业时置 loading；`JobDetailPage.vue` 模板 error 分支优先于缓存。先开 A（ready）→ 开 j-missing（`currentJob` 仍为 A，`detailStatus=error`）→ 回 A：读完成前显示“作业 j-missing 不存在”。
- **实测**：normal 下窗口为 0（不可见）；slow 下 3 s。**SPA 内无路径到达 not_found id**（卡片来自同一列表，v1 无取消 / 删除），只能手输 URL（整页刷新，缓存清空），故产品内实际不可达。
- **判定**：plan §2.3【r6.9】“进入同一作业时先显示缓存再刷新”的意图在“上一次是错误”时未达成，但不越出已审口径；只记。承接 = 下次 plan 精度一句（T-B05 作业级状态区开工时一并看）；不需 Walter 批准。

### R4-E（P3）— store 迟到写入导致短暂错位（S-43 已登记的 mock 口径后果）

- **位置**：`jobs.ts` `readDetail` 无条件写 `currentJob` / `currentStageWorkspace`。
- **实测**：2d 时间线 +11272 ms，j-process 标题在 `/jobs/j-failed/analyze` 下显示约 50 ms 后自愈。Checklist R10 :95 已预见“slow 下短暂显示 B 再回 A（自愈）”。
- **判定**：与 S-43 一致，归 `api` feature 决定是否加请求序号；本 feature 不预做。**与 R4-A 区分**：R4-E 自愈、R4-A 不自愈。

### O-B4-5 / O-B4-6（已核，无发现）

- O-B4-5：本会话以固定代码亲跑 17 条命令；`WI badge tone` 改写后的断言同时核解析后的 `border-color` 与 SFC 原文声明，足以证明基础规则边为中性令牌。
- O-B4-6：R2-C 代码修正逐值核对与 plan §1【r6.9】表一致（§2 B01 行），`WI status badges` 18 / `WI source badge` 9 / tone 21 / 48 / colors / glass 亲跑通过。**可关闭**，生效时点见 §0。

## 4. 架构风险 / 测试缺口 / 目标对齐

- **bug**：R4-A（P2）。其余为 P3 观察。
- **架构风险**：R4-A 揭示的是“URL 为唯一来源 + async 入口自动 canonical”设计在离开 / 换阶段时缺少回调有效性边界；真实 `api` 接入时窗口从 0 变为真实延迟，默认路径（卡片无 stage）每次都经过，若 (b) 风险接受则必须随 `api` feature 的 Clarify 一并重提。R2-E（新旧方法场景来源）在本批测试中再次被依赖（`changeScenario` 后旧 client 行为随模块状态变化），仍只是测试可观察，不计新发现。
- **测试缺口**：① 无“在飞行中离开 / 换阶段”的组件用例（随 R4-A 处置补 1 例；若选 (b) 风险接受则改为在 tasks §3 登记“不测”）；② B04 `job-detail.spec` “离开后仍重读保留锚”的断言把 plan 接受的额外读取固化为期望，合理但应随 plan 变化维护；③ 其余 7 份 E2E 未跑（非本批文件，不是缺口）。
- **目标对齐**：与冻结 spec v1.1（46 AC 不变）、plan r6.9 / r6.10、tasks 一致；r6.10 精度确为类型 / 读法登记，不是需求变更（本会话独立核：`DeepReadonly` props、`aria-pressed` 布尔、占位文案、`job-create` moduleId、filter 初值）；D-020～D-024 未混入；AGENTS §5：无猜测性复杂度（R4-A 的修复恰是 §5.1 要求“说得清”的那类，故交 Walter）、入口校验一次（表单经契约 schema、路由 stage 经 `StageSchema.safeParse`）、未提前抽象（`readDetail` 两处调用、`applyFilter` 页面函数两处事件）、未引入新工具。

## 5. P3 台账与归属（均未经 Walter 风险接受）

| 项 | 状态 | 承接 |
|---|---|---|
| **R2-C**（review-batch2） | 代码已修并经本评审核实；**关闭随本批通过 / Gate 2 生效** | — |
| R4-B（O-B4-1 query） | 开放 | T-G01 / T-G05 阅读提示（已登记）；壳级透传归 v2 Clarify / candidates |
| R4-C（O-B4-3 提示时机） | 开放 | T-G10 M-01 记录 |
| R4-D（O-B4-4 同作业旧错误） | 开放 | 下次 plan 精度一句 / T-B05 开工前 |
| R4-E（S-43 迟到写入） | 开放 | `api` feature（plan §2.3【r6.10】已登记） |
| S-41（创建者展示） | 开放 | T-B05 开工前精度轮（tasks T-B05 状态行） |
| R2-D / R2-E / R3-B / R3-C、R-A～R-F 残留 | 本批不涉及 | 归属不变（implementation-log §8） |

## 6. H-x（只记录，不签收）

- **H-2·标签**：① 候选 `5c00cf6`（`ebce4c8` 并存）；② R10 `37e2f71`（blob `4537c55…`）；③ **本评审亲跑**：`WI status badges` 18 / `WI source badge` 9 / `WI badge tone` 21 / 整文件 48 / colors / glass / typecheck / lint 全通过；④ **缺**（待消费方集成登记）。对外 props / 文案 / 图标未变，仅新增根 `data-status` 与边框令牌。因本批未通过，① 不转“生产已核”。
- **H-2·列表**：① 仍 `af24c82`；本批新增详情缓存为内部成员，`WI H-2` 27 本评审复跑通过；④ 缺。
- **页面切片**：T-B01 / B02 / B04 已实施但本批未通过；C 组未开始；`intake.spec.ts` 不存在 → 未交付。
- H-1 / H-3 / H-4 历史证据保留；H-5 未做；H-6 缺 T-A21。生产方集成树 `6c082fd` 不是 ④。

## 7. 结论与下一步

1. **判定：本批未通过**（R4-A P2）。**Gate 2 待 Walter**：对 R4-A 在 (a) 批准最小 guard（~3 行 + 1 例回归，≤ 0.5 h，按 §2 第 9 步登记小任务 → Implement → A 定向复核）/ (b) 风险接受（记入 tasks §3 / plan §2.3 + T-G10 已知项，并随 `api` feature 重提）/ (c) 改设计 之间裁定。本评审不代做。
2. 若 Walter 选 (a)：修复后只需 A 定向复核 `JobDetailPage.vue` diff + 新回归用例 + `job-detail.spec` 整文件 + 四份 E2E；其余 4 项任务代码无需改动。若选 (b)：本批可按“P3 可接受为后续任务”改判通过，R2-C 随之关闭。
3. R4-B～R4-E 为 P3，不阻断，承接见 §5；不需 Walter 批准。
4. 集成人：本评审未 commit；本树 `git status --short` 仅本文件为新增（`?? specs/workbench-interaction/review-batch4.md`）；探针与日志在 Temp `review-probe/`，非项目产物。
5. 本评审不是 Gate 2 / Handoff；不改 spec / checklist / plan / tasks；46 AC 最终验收仍 0。

## 验收证据（本批）

- 测试命令输出摘要：§1（全量单测 34 / 1018 / 0；v1 契约 88；real-stubs 23；routes + session 17；H-2 27；17 条任务命令用例数与实施者逐条相同；`check` 六守卫 / `contract --check` 24 / 10 / 2 / typecheck / lint 通过；四份 E2E 29 / 0）。
- Converge 报告结论：`converge-batch4.md` 判“本批已收口、待 Review”；本评审核对其 §1 diff 事实、§2 逐任务证据、§3 精度判定成立；§5 O-B4-1～6 独立判定：**O-B4-2 → R4-A（P2，真实浏览器复现）**，O-B4-1 → R4-B、O-B4-3 → R4-C、O-B4-4 → R4-D（均 P3），O-B4-5 / O-B4-6 无发现（R2-C 修正核实）。
- Gate 2 记录：**未填**（待 Walter）。
