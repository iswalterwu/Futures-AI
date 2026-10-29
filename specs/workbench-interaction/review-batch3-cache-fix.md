# Feature: workbench-interaction 增量代码 Review — T-A22c（R3-A 补修）（review-batch3-cache-fix.md）

> **性质**：AGENTS §2 第 10 步 Review 的**定向增量评审**，只审 T-A22c 一项、只判 **R3-A 是否关闭**。**不是**全 feature 最终 Review、**不是** Gate 2、**不是** Handoff；不勾 checklist、不改代码 / 测试 / fixture / spec / plan / tasks / 旧 Review（`review-batch3.md` 等）/ Converge / docs / README / HANDOFF；不替作者修代码、不代 Walter 做风险接受（R3-B / R3-C 仍未经风险接受）、不代 v2 接收方签收 ④。**不重写、不替代** `review-batch3.md` 对四任务（T-A11 / A12 / A13 / A22a）的结论：原件 `49edb7e` 通过、0 P1 / P2、3 P3 保留。结构参照 `templates/review.md`，Gate 2 记录不填。
> **审核员 A（脱敏）**：`claude-fable-5-1` **via anthropic**（官方通道；`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1`、PI_SESSION_ID `01a1875e-96b8-7724-85fe-089647041c61`）。本轮协调器对 `claude-bridge` 的最小真实 probe 为 quota / rate 类失败，本窗口同通道不重复试（AGENTS §6 规则 2 / 5）；**fable 未单独探 bridge，不声称探过**；官方通道调用成功，本 Review 全程走官方通道。只换通道、不换模型；未改 provider / key / 路由 / 全局配置；不因测试结果或结论换模型。新会话、独立 worktree，与 Implement（`openai/gpt-6-astra`，实施者会话 `01a1874b-4f8e-73e6-8b86-1adc1f7a9321`，会话日志记 `provider: openai / modelId: gpt-6-astra`）异模型，与 Converge（`claude-opus-5-5`，`01a18755-…`）隔离。
> **固定输入**：worktree `D:/2030/Futures-AI-interaction-review-batch3-cache-fix`，branch `review/workbench-interaction-batch3-cache-fix`，HEAD `eb91340096a22f845c8511a370d6100262e939d4`（起始 `git status --short` 为空；`eb91340` 为纯文档提交，`--stat` 只含 `specs/**` 6 文件）。受审代码 = `git diff e7716a88297ed9f3fe3a642215bd970c3a326a37..af24c826f41580d27f90ce611fb2f55fec44acbf`：**2 文件、+67 / −3**（`frontend/src/jobs/stores/jobs.ts` −2；`frontend/tests/unit/jobs/jobs-store.spec.ts` +67 / −1），`git diff --check` 通过。规格提交 `e7716a8`（r6.8：T-A22c 登记、plan §2.3【r6.8】、Analyze R14，commit body 记集成人接受 T-B01 依赖 T-A22c = 任务排期，非新需求 / 人工门）。有效 Checklist **R9** 原件 `ab742f5`，本树 `checklist.md` `git hash-object` = `74084c1337491a042c944096e1f290fe07aab324`，`git diff ab742f5 HEAD -- checklist.md` 为空（只读未改）。祖先核：`43b6d79` ✓、`90187f7` ✓、`0032fc6` ⊂ `af24c82` ✓、`49edb7e` ⊂ HEAD ✓；main `072bb12` **不是**祖先（本会话核）。
> **重新读取**（不依赖会话记忆）：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`、冻结 spec v1.1（AC-001-1 / 001-2 / 001-4 / 009-1）、plan.md 页首 r6.8 + §2.3【r6.8】、tasks.md 页首当前块 + r6.8 块 / §2a H-2·列表 / T-A22a（含【r6.6】【r6.7】【r6.8】）/ **T-A22c 全文** / T-B01 / T-B02 依赖行 / §6、checklist.md R9（只读）、analyze.md「Analyze R14」「Analyze R15」、implementation-log 页首 + §7 + §8【T-A22c 实施后更新】+ §11、interface-handoff 页首 + §1 H-2·列表行 + §3【r6.8】、**`review-batch3.md` 全文**（§4 探针 P1 / P2 / P3、§5 R3-A 方案 (a)/(b)、O-R3-2、§8 第 2 条）、`converge-batch3-cache-fix.md` 全文、`specs/README.md` 本 feature 行。`af24c82` 上两个受审文件**完整阅读**；实施者回报 `astra-cache-fix-result.md` 与会话日志 `astra-cache-fix-session/*.jsonl`（只读、只核留痕，不代替代码阅读）。
> **边界**：唯一改动文件 = 本文件。依赖安装与测试产物只落在本树 gitignore 目录（`frontend/node_modules/`、`frontend/test-results/`），锁文件未改（各步后 `git status` 均 clean）。亲跑日志与只读探针只写 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/cache-fix-review-logs/` 与 `cache-fix-review-probe/`（不清理共享 tmp、不上传 session、不记凭证）。未 commit / push / PR / merge，未派生 agent，未写其他 worktree，未保留服务（E2E 前后 4173 无 LISTEN），未重装浏览器。
> **日期**：2026-10-29（+04:00）。

## 0. 判定

**本增量通过**（0 P1 / 0 P2 / **0 新 P3**；无新发现）。**R3-A 关闭**：原件 §5 R3-A 点名的两条路径（探针 P1：fresh store 先筛选后 `ensureJobs()` 永不加载、`jobs=[]` 却 ready；P2：base 读错误被筛选成功“洗白”）在 `af24c82` 上**不再复现**（本会话只读探针 §4 P1 / P2 独立重跑），且由新 describe `WI H-2 list status` 两例在产品测试中固定（本会话亲跑 2 / 2，实施者会话日志证实修复前同两例以 `expected 'ready' to be 'idle'`、`expected 'ready' to be 'error'` 各红一次）。生产改动恰为方案 (b)：删 `applyFilter` 成功分支 `listStatus.value = 'ready'` / `listError.value = null` 两行，**再无其他生产改动**；失败分支、`applyFilter(null)`、`ensureJobs` / `refresh` / `createJob` / `receiveAgentEvent`、S-38 捕获、返回对象与签名逐字不变。被改旧例是与 plan §2.3【r6.8】相符的**精度修正**（见 §3 标准 2），不是删覆盖；`WI H-2 filter` 组仍 4 例。

**不改变的事实**：T-A22c 通过只表示 R3-A 关闭与该任务 3 条完成标准成立；**46 AC 最终验收仍 0**（本任务仅 AC-001-1 / 001-2 / 001-4 部分前置 + AC-009-1 工程门）；feature **未收敛**（本结论生效后可记 **21 / 68 已完成**、47 未开始；由集成人回写 tasks / README / implementation-log，本会话不改）。**R3-B / R3-C 不在本次范围、未修、未经风险接受、不在此假关、也不作“新发现”重计**。H-2·列表 **④ 消费方集成仍未取得**（只能由 `integration/frontend-workbench-v2` 所有者登记；生产方集成树 `af24c82` / `eb91340` 只是旁证）。本评审不扩到 T-B01 / T-B02 的 UI、T-G04 横幅或任何未来任务。

## 1. 独立亲跑证据（本会话执行；日志在 `cache-fix-review-logs/`）

| 命令 | 本会话结果 | 实施者数字（`astra-cache-fix-result.md` / tasks 状态行） | 一致 | 日志 |
|---|---|---|---|---|
| `pnpm -C frontend install --frozen-lockfile` | exit 0；锁文件未改，`git status` clean | — | — | `install.log` |
| **命令 1** `test:unit tests/unit/jobs/jobs-store.spec.ts -t "WI H-2 list status"` | **2 passed** / 25 skipped (27)，exit 0 | 2 passed | ✓ | `cmd1.log` |
| **命令 2** `test:unit tests/unit/jobs/jobs-store.spec.ts` | **27 passed** (27)，exit 0 | 27 passed | ✓ | `cmd2.log` |
| 原四组（T-A22a 命令 1～4 标题，保持性核对） | `WI H-2 cache` **5** / `WI H-2 filter` **4** / `WI H-2 createJob refresh` **7** / `WI H-2 agent refresh` **9**（均 exit 0） | 5 / 4 / 7 / 9（`0032fc6` 第三批 A 亲跑同数） | ✓ | `grp-*.log` |
| §2a H-2·列表 `-t "WI H-2"` | **27 passed**（= 25 + 新 2） | — | — | — |
| **命令 3** `typecheck && lint && contract --check` | 均 exit 0；`contract:check: 24 methods, 10 events, 2 artifacts match.`；lint `--max-warnings 0` 零告警 | 通过；24 / 10 / 2 | ✓ | `cmd3.log` |
| `pnpm -C frontend test:unit`（全量） | **31 files / 953 passed / 0 failed** | 31 / 953 / 0 | ✓（= 已审 951 + 新 2） | `unit-full.log` |
| `pnpm -C frontend check`（六守卫） | exit 0：generated / colors（24/24 正样本、0 负命中）/ glass / updown / grid / network 全 passed；之后 `git status` 仍 clean ⇒ 生成物与源一致、不需手改 | 六守卫通过 | ✓ | `check.log` |
| 三份既有 v1 契约测试 `contracts / contract-doc / mock.spec.ts` | 3 files / **88 passed**（本增量未改对应文件，可选重跑） | 第三批 A 亲跑 88 | ✓ | `v1-contracts.log` |
| `tests/unit/jobs/real-stubs.spec.ts` | **23 passed**（可选重跑） | 第三批 A 亲跑 23 | ✓ | `real-stubs.log` |
| `pnpm -C frontend test:e2e e2e/shell.spec.ts e2e/agent.spec.ts` | 先核 `4173` 无 LISTEN；Playwright 自管 webServer；**24 passed / 0 failed**（1.0 min）；结束后无 LISTEN | 24 passed | ✓ | `e2e.log` |
| 只读探针（`cache-fix-review-probe/{vitest.probe.config.ts,probe.spec.ts}`，经本树 `node_modules` 运行；**非产品测试**，不改受控文件） | 6 例全部执行，输出见 §4 | — | — | `probe-results.log`、`probe.log` |
| `git diff --check` / `git status --short`（写本文件前） | 通过 / 为空 | — | — | — |

**未跑项（如实限制）**：全量 `pnpm test` 中其余 7 份 E2E（breakpoints / modules / scenarios / smoke / theme / tokens / workbench）——本任务无 UI 页面、tasks 命令不含 E2E，归 T-G09 / T-H04；无人工截图；未在修复前的 `e7716a8` 树上重跑“红”（本树只允许停在固定 HEAD，红的证据以实施者会话日志为准，见 §3 标准 1）。

## 2. diff 事实与所有权（本会话核对）

- `git diff --stat e7716a8..af24c82`：只有 `frontend/src/jobs/stores/jobs.ts`（−2）与 `frontend/tests/unit/jobs/jobs-store.spec.ts`（+67 / −1）；与 T-A22c「修改范围」授权的两个文件**完全相同**。`eb91340`（`af24c82` 之后的唯一提交）`--stat` 只有 `specs/README.md` 与 `specs/workbench-interaction/{analyze,converge-batch3-cache-fix,implementation-log,interface-handoff,tasks}.md`，`-- frontend` 零差异。
- **生产代码**（`jobs.ts`）：diff 仅为 `applyFilter` try 块内 `filteredJobs.value = await dataClient.listJobs(value)` 之后删去 `listStatus.value = 'ready'` 与 `listError.value = null`。本会话读 `af24c82` 全文确认：现在源码中写 `'ready'` 与 `listError = null` 的位置**只剩 `refresh()`**（`:26-27`）；`ensureJobs()` 仍只看 `idle`（`:18`）；失败分支（`:44-45`）、`applyFilter(null)`（`:37-40`）、`createJob` / `receiveAgentEvent` / 返回对象（5 个只读 computed + 5 个 action）与 `ListJobsFilter` 类型逐字未变。无新字段、无 private flag、无回滚 / 锁 / 请求序号、无新公开成员（AGENTS §5.1）。
- **测试**（`jobs-store.spec.ts`）：
  - 新 describe `WI H-2 list status — AC-001-1 / AC-001-2 / AC-001-4 partial`（`:150-211`），两例。标题不含 `WI H-2 cache` / `filter` / `createJob refresh` / `agent refresh` 子串，T-A22a 四条命令的匹配集合不扩大（本会话亲跑 5 / 4 / 7 / 9 印证）。
  - `WI H-2 filter` 组一例改名：`… the next filter read clears the error` → `… only an explicit refresh clears the error`（`:278`）；在切回 normal、`applyFilter({type:'daily'})` 成功后**新增** 3 条断言（`listStatus` 仍 `error`、`listError.code` 仍 `adapter_error`、`await expect(store.refresh()).resolves.toBeUndefined()`），原有的 `listError` null / `ready` 两条断言**原样保留**但移到 refresh 之后。前半段（失败时保留两份缓存、`filter` 已更新、置 error）零改动。**未删任何用例**；组内仍 4 例。
  - 其余 25 例 diff 为零（本会话 `git diff` 全文核）。
- **零差异**：`main.ts`、`contracts/**` 与生成物、`jobs/{persistence,routes,diff}.ts`、`jobs/stores/session.ts`、`agent/**`、`app/**`、`shared/**`、`workbench/**`、`scripts/**`、`package.json` / `pnpm-lock.yaml`、`vitest.config.ts` / `playwright.config.ts`、`mock/fixtures/**`、`e2e/**`、v1 三份契约测试、`real-stubs.spec.ts`、spec / plan / checklist、`docs/**`、`AGENTS.md`、`backend/`。
- **生产调用方**：`applyFilter` 在 `frontend/src` 除定义处外**无调用方**（本会话 grep）；本修复不改变任何现有页面行为，也不提前做 T-B02。
- **测试真实性**（AGENTS §5.6）：沿用文件既有 `connect()` / `changeScenario()`：真实 Pinia（`setActivePinia(createPinia())`）、真实 `createMockDataClient()`；只对 `contracts/index.ts` 的 `dataClient.listJobs / createJob` 做**透传 spy**（系统边界，`mockImplementation` 直接委托真实 client）；期望值全部由真实 `client.listJobs()` / `client.listJobs(filter)` 得出，**不抄筛选算法**；diff 内无 `vi.mock`、无 `__FAI_MOCK__`、无 `eslint-disable`、无 Window 钩子、无生产故障开关（本会话 grep）。
- **红 → 绿留痕**（实施者会话日志 `astra-cache-fix-session/2026-10-29T10-53-42-159Z_01a1874b-….jsonl`，只读解析工具调用序列）：① `edit jobs-store.spec.ts`（加新 describe、改旧例标题与断言）→ ② `test:unit … -t "WI H-2 list status"` → **`Tests 2 failed | 25 skipped (27)`**，两条 `AssertionError: expected 'ready' to be 'idle'`、`expected 'ready' to be 'error'`，FAIL 标题恰为新两例 → ③ `edit jobs.ts`（oldText 含 `listStatus.value = 'read…`，newText 只剩 `filteredJobs.value = await …`）→ ④ 同命令 `2 passed`，整文件 `27 passed`，`24 methods, 10 events, 2 artifacts match.` → ⑤ 全量 `31 passed / 953 passed`、六守卫 → ⑥ E2E `24 passed (1.0m)` → ⑦ `-t "WI H-2 filter"` `4 passed` → ⑧ 暂存范围脚本 + commit。顺序为**先写测试、先红、再改生产、后绿**，与 `converge-batch3-cache-fix.md` §2 / tasks 状态行“失败留痕”一致。
- 模型：会话日志首行 `model_change: provider openai / modelId gpt-6-astra`，无回退记录；测试红未触发换模型（AGENTS §6 规则 6）。

## 3. 逐条完成标准核对（标准 → 真实代码证据 → 本会话结果）

| T-A22c 标准 | 真实代码 / 测试证据（本会话阅读） | 本会话亲跑 | 判定 |
|---|---|---|---|
| **1**（P1 / P2 两条路径；AC-001-1 / 001-2 / 001-4 部分前置） | **P1 例**（`:151-174`）：fresh normal store，先 `applyFilter({type:'daily'})` → 断言 reads `[[f]]`、`filter=f`、`filteredJobs=listJobs(f)`、`jobs=[]`、**`listStatus='idle'`**、`listError=null`；再 `ensureJobs()` → reads `[[f],[],[f]]`、`jobs=listJobs()`、`filteredJobs` 不变（`toEqual(expectedFiltered)`）、`ready`、无错。前置断言 `0 < filtered < base` 排除空集退化。源码对应：成功分支不再写读状态 ⇒ 保持 idle ⇒ `ensureJobs` 走 `refresh()`，`refresh()` 内 `filter !== null` 再读 `[f]`。**P2 例**（`:176-210`）：error 场景 `ensureJobs()` → `error` / `adapter_error`，记 `base` / `error` 引用；切 normal，`reads.mockClear()`，`applyFilter(f)` → reads `[[f]]`、`filteredJobs` 更新、**`jobs` 引用 `toBe(base)`、`listStatus` 仍 `error`、`listError` 引用 `toBe(error)`**；再 `ensureJobs()` 不发请求（reads 仍 `[[f]]`）；显式 `refresh()` → reads `[[f],[],[f]]`、两视图恢复、`ready`、null。两例与标准 1 文字逐项对应。 | 命令 1 **2 / 2**；探针 P1 / P2（§4）独立复现同结果；实施者日志修复前同两例红 | **满足** |
| **2**（整文件通过；filter 组用例数不变、改断言为“筛选成功保留错误、显式 refresh 清错”；四组其余原样含 S-38 / 清空不发请求 / 失败保留旧 filteredJobs；H-2 ①～⑤ 不回归） | 被改例（`:278-299`）：失败半段零改动（`applyFilter({type:'daily'})` 在 error 场景 resolve、`filter` 更新、`jobs` / `filteredJobs` 引用保留、`error` / `adapter_error`）；切 normal 后 `applyFilter` 成功 → `filteredJobs = listJobs({type:'daily'})`、`jobs` 引用不变、**`listStatus` 仍 `error`、`listError.code` 仍 `adapter_error`** → `refresh()` → null / ready。这正是 plan §2.3【r6.8】第 2 条“已有的读错误不会被筛选成功清除，须显式 `refresh()` 恢复”的直接断言；原断言“下一次筛选读清错”固定的是 R3-A 本身（`0032fc6:43-44`），改掉它是**修正被审出的错误口径**，不是放宽覆盖（断言数由 2 增为 5）。S-38 三例（`agent refresh` 参数化 4 + `cache` 1）、`applyFilter(null)` 零读、失败保留旧 `filteredJobs`、slow 场景不回 loading、createJob 恰一次刷新等 25 例 diff 为零。 | 命令 2 **27 / 27**；四组 **5 / 4 / 7 / 9**；全量 **953 / 0** | **满足** |
| **3**（工程门；契约生成物零漂移；AC-009-1 部分前置） | 两文件都不涉及契约源或生成物；`check` 六守卫后 `git status` 仍 clean | 命令 3 typecheck / lint / `contract --check` **24 / 10 / 2** 全 exit 0；`check` 六守卫通过 | **满足** |

**标准 ↔ 命令 1:1**：3 条标准 ↔ 3 条命令，命令限定 `tests/unit/jobs/` 路径与 `WI` 标题（Analyze R14 / R15 脚本复算 227 / 227，本会话按 tasks 原文逐条核对）。**任务预估 / DAG / AC 矩阵源不改**：T-A22c 0.5 h、依赖 T-A22a；T-B01 / T-B02 依赖 T-A22c 为 `e7716a8` 已登记的排期；46 行矩阵不变。**不触 Gate 1 / 新 Checklist**：方案 (b) 出自已审原件，恢复 T-A22a【r6.6】“只写两字段”原意，无新需求 / 机制 / 公开成员；R9 `ab742f5` 持续有效（本树 blob 未改）。**API 不变**：`useJobsStore()` 对外成员与签名零差异，interface-handoff §3【r6.8】口径已由代码满足。**契约 24**：`contract --check` 24 methods / 10 events / 2 artifacts match，生成物不需手改。

## 4. 只读探针结果（独立复现；`cache-fix-review-probe/probe-results.log` 原文）

| 探针 | 结果 | 对应 |
|---|---|---|
| **P1**（原 R3-A P1 链）：fresh normal store 直接 `await applyFilter({type:'daily'})` | 之后 `status=idle、err=null、jobs=0、filtered=2`，reads `[[f]]`；再 `await ensureJobs()` → **`status=ready、jobs=5`**（= 未筛选 `listJobs()` 5 条）、`filtered=2`，reads `[[f],[],[f]]`；再 `ensureJobs()` reads 仍 3 次（不重读） | 原症状“ready + 空缓存 + ensure 永不加载”**消失** |
| **P2**：error 场景 `ensureJobs()` → 切 normal → `applyFilter(f)` 成功 | `status=error、err=adapter_error、jobs=0、filtered=2`（错误**未被洗白**）；`ensureJobs()` 不重读（reads 共 2）；`refresh()` 后 `ready、jobs=5、filtered=2、err=null` | 原症状“筛选成功清 base 错误”**消失**；只有显式 refresh 清错，与方案 (b) 精度一致 |
| **P3**（O-R3-2 范围）：已有筛选成功，error 场景再筛选失败，切 normal 再筛选成功 | 失败后 `filter={status:'delivering'}`、`filteredJobs` 仍旧结果、`status=error`；**成功再筛选后仍 `error`**（方案 (b) 的既定后果）；`refresh()` 后 `ready` | 与 plan §2.3【r6.8】第 3 条、tasks T-A22c「保持不变」段一致；UI 按 error 呈现即可，不要求新状态机 / rollback / 锁；**不记新发现** |
| **P4**：同一 tick 并发 `applyFilter(f)` 与 `ensureJobs()`（fresh store） | 同步读 `listStatus='loading'`（`ensureJobs` 看到 idle 立即进 refresh）；settle 后 `ready、jobs=5、filtered=2`，reads `[[f],[],[f]]` | 原件“同一 tick 内并发也不触发”判断在修复后仍成立，且终态正确 |
| **P5**：slow 场景，初次 `ensureJobs()` 加载中调 `applyFilter(f)` | 筛选先 resolve 时 `status` 仍 `loading`（修复前此处会被筛选成功提前置 ready）；ensure settle 后 `ready、jobs=5、filtered=2`，reads `[[],[f],[f]]` | 修复附带消除了“加载中被筛选成功提前置 ready”的路径，无额外请求 |
| **P6**：`applyFilter(null)` 在 error / idle 下 | 分别保持 `error` / `idle`，`filter=null、filtered=null` | `applyFilter(null)` 不碰读状态（未改、未回归） |

## 5. 发现

**P1 / P2 / P3：无新发现。** 本增量不产生新编号。

- **架构风险**：无新增。方案 (b) 把 `listStatus` / `listError` 的写入点收敛到唯一的 `refresh()`，与 plan §2.3 r6“`listStatus` / `listError` 是未筛选列表缓存的读状态”及 interface-handoff §3【r6.8】一致；共享读状态仍为“最近一次读”的语义（P3 路径），已由 plan 精度登记，不需要新状态机。
- **测试缺口**：无。R3-A 点名的两条顺序用例已补；被改旧例为精度修正且断言面增大；S-38 / 清空 / 失败保留旧缓存的既有用例零改动并通过。
- **目标对齐**：与冻结 spec v1.1（46 AC 不变）、plan r6.8、tasks T-A22c 3 条标准逐条一致；无 D-020～D-024 混入；AGENTS §5：§5.1 零新增 guard / 锁 / 序号（本次是**删**两行）、§5.2 入口校验未动、§5.3 未抽函数、§5.6 真实 Pinia + 真实 mock client + 边界 spy、§5.7 无新工具。
- **既有 P3 状态（只记事实，不重计、不假关）**：**R3-B**（重复 `removeUpload` 冗余修订 / 事件 → T-C03 / T-A17）与 **R3-C**（`removeItem` 抛错时 `resetMockData` 非契约错误形态 → T-G04）在本增量**未修、未经 Walter 风险接受**，本 Review 不处理、不改判。O-R3-1 / O-R3-3 不变；O-R3-2 已由 plan §2.3【r6.8】登记精度（探针 P3 印证）。前两批 P3（R-A～R-F、R2-A～R2-E）状态不变（implementation-log §8）。

## 6. H-x 交接与 feature 状态（本评审不代填 ④）

| 项 | 本评审核对后 |
|---|---|
| **R3-A** | **关闭**（本会话判定；代码 `af24c82`、测试固定、探针 P1 / P2 不再复现） |
| H-2·列表 ① | 候选 `af24c826f41580d27f90ce611fb2f55fec44acbf` ✓（祖先含已审 `0032fc6`；`0032fc6` 仅作历史证据） |
| H-2·列表 ② | R9 `ab742f5` ✓（blob `74084c13…` 未改） |
| H-2·列表 ③ | **本会话亲跑** `WI H-2 list status` 2、整文件 27（原四组 5 / 4 / 7 / 9 = 25 + 新 2）、`-t "WI H-2"` 27 + typecheck / lint / `contract --check` 24 / 10 / 2 ✓ |
| H-2·列表 ④ | **未取得** → 仍 **待消费方集成（未交付）**；只能由 `integration/frontend-workbench-v2` 所有者在真正集成后登记，本树 / 生产方集成树不能冒充 |
| H-2·标签 / H-3 / H-4 / H-1 | 历史登记保留，④ 仍缺；本增量不涉及 |
| H-6（缺 T-A21）/ H-5 / 页面切片 | 未交付，本增量不涉及 |
| feature | **未收敛**：本结论生效后 **21 / 68 已完成**（20 + T-A22c）、**47 未开始**；68 任务 / 102.5 h / 227 : 227；46 AC 最终验收 **0**；H 组外部阻塞不变 |

## 7. 下一步（建议，不替作者改）

1. 集成人确认本结论后**原样提交本文件**；由集成人回写 tasks T-A22c 状态行（“已实施、待定向 Review” → “已完成（增量 Review 通过 `<本文件提交 SHA>`，R3-A 关闭；不表示 AC 最终验收）”）、`specs/README.md` 本 feature 行、implementation-log §8 R3-A 行、interface-handoff §1 H-2·列表 ①③（① = `af24c82`、③ 补本会话亲跑）。本会话不改这些文件。
2. R3-A 关闭后 T-B02 / H-2 ④ 的前置条件已满足；T-B01 可按依赖链起步（`review-batch3.md` §8 第 2 条已满足；T-B01 是否已派由集成人定）。
3. R3-B 并入 T-C03 / T-A17、R3-C 并入 T-G04：维持原件归属，未经风险接受，不在本次关闭。
4. H-2·列表 ④ 待 `integration/frontend-workbench-v2` 所有者登记；main `072bb12` 同步按 R2-D 流程。

## 验收证据（本增量）

- **测试命令输出摘要**：见 §1——命令 1 **2 passed**；命令 2 **27 passed**（四组 5 / 4 / 7 / 9 保持）；命令 3 typecheck / lint 通过、`contract:check: 24 methods, 10 events, 2 artifacts match.`；全量 `test:unit` **31 files / 953 passed / 0 failed**；`check` 六守卫通过且树仍 clean；v1 三份契约测试 **88**、`real-stubs` **23**；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` **24 passed / 0 failed**（4173 前后无 LISTEN）；只读探针 6 例输出见 §4。全部数字与实施者回报逐条相同。
- **红 → 绿证据**：实施者会话日志（§2）——先改测试、命令 1 `2 failed`（`'ready'≠'idle'`、`'ready'≠'error'`），再删两行生产代码、`2 passed`；非本会话复跑（本树固定 HEAD）。
- **Converge 报告结论**：`converge-batch3-cache-fix.md` 判“增量已收口、待独立 A 增量 Review、不判 R3-A 关闭”；本评审核对其 §1 diff 事实、§2 逐条证据、§3 对拍成立，并由本会话独立亲跑 + 探针确认 → **R3-A 关闭、T-A22c 通过**。
- **Gate 2 确认记录**：**不适用**（本增量不是全 feature Review / Handoff；Gate 2 待全 feature 最终 Review）。
