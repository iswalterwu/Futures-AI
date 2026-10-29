# Feature: workbench-interaction Converge 报告 — 第四批 T-B01 / T-B02 / T-A22d / T-B04 / T-B03（converge-batch4.md）

> **性质**：AGENTS §2 第 9 步 Converge 的**批次报告**。本报告只读对比本批真实代码与 spec / plan / tasks。它**不是** Review、审核结论、Gate 2 或 Handoff；不勾选 checklist，不改 spec。
>
> **阶段记录（脱敏）**：
> - **角色与模型**：Converge / 进度登记 / Analyze R17 作者 = **claude-opus-5-5 via anthropic**（PI_SESSION_ID `01a1880c-8385-70eb-96c3-75402937cefb`）。
> - **通道**：本协调窗口已确认 `claude-bridge` 为 quota / rate / spend_limit 类限额，按 AGENTS §6 规则 2 / 5 不重复调用；官方通道真实调用成功。只换通道、不换模型，未改 provider / key / 路由 / 全局配置。测试结果不是回退理由。
> - **派工人**：集成人协调会话 `01a18388-a371-7746-8158-9fb15d55d819`。Walter 的“允许”授权和集成人指定在既有 tasks 范围内持续有效。
>
> **写入范围**：
> - 唯一可写 worktree：`D:/2030/Futures-AI-interaction-converge-batch4`（branch `docs/workbench-interaction-batch4-converge`，固定起点 `6c082fd60570a329771727be16b494f81775f957`，起始 clean）。
> - 只写 `specs/workbench-interaction/{plan,tasks,analyze,implementation-log,interface-handoff,converge-batch4}.md`，以及 `specs/README.md` 中本 feature 的状态行和本 feature 的跨 feature 队列行。
> - **未改动**：源码、测试、fixture、生成器、spec、checklist、已有 Review 原件、旧 Converge 报告、权威 docs、根 HANDOFF、其他 feature、其他 worktree。
> - **未执行**：没有 commit / push / PR / merge；没有启动子 agent、服务或安装；**没有运行任何产品测试**。
> - **测试数字来源**：下文测试数字全部由实施者执行，本会话没有重跑。只读核对脚本与日志放在协调器独占临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch4-01a18388-nzh9q1wh/converge-*`（非项目产物，不清理）。
>
> **日期**：2026-10-29（+04:00）。

## 0. 固定输入

| 项 | 值 |
|---|---|
| `implementation_base_sha` | `43b6d79681a49562f41751368b2ae00c24062f56`（v1 Handoff，不变） |
| `upstream_start_sha` | `90187f7d8907316e554d2441d846827468c5371f`（继续 pin）。main / `origin/main` = `072bb12de3425e1b76357b5771e47f0609b32979`，**不是**本树祖先（只读核验）；不导入，R2-D 流程不变 |
| 有效 Checklist | **R10**，原件提交 `37e2f71aae5a625de7e39a3f4b2d9c0b1a9c7b38`；本树 `checklist.md` blob = `4537c55f226f0bdc4f39b19e7c369731cf23abba`（与原件相同，只读未改）。结论 26 / 26 ☑，0 P1 / P2，P3 S-41～S-43 不阻断 |
| 冻结 spec | v1.1，46 AC；LF 归一化 SHA256 `ed0f6c6c3e50b93166a02880df574e6f167a5773829ec0ab8d3ddcf269f942d9`（与历次 Analyze 登记相同；`git log` 最后改动仍是种子 `8753fa9`） |
| 本批代码 diff | `37e2f71..6c082fd -- frontend`：**5 个前端提交，17 个文件，+1870 / −11**；同区间 `frontend` 以外零差异。每个文件都读过（§1 / §2） |
| 逐提交 | T-B01 `5c00cf695235155c4cfa9efb9df1fee06a161189` → T-B02 `0221a94bbd9aefe4b7d482f61e3e9017d0a25710` → T-A22d `ca7dca175150652b1026a831f1447fb6830028e4` → T-B04 `cc6559d7bb0b5afb0e233b8295dbd55f1de41d9d` → T-B03 `6c082fd60570a329771727be16b494f81775f957`（顺序即 r6.9 规定的 B01 → B02 → A22d → B04 → B03） |
| 生产方集成树 | `integration/workbench-interaction` = `6c082fd`（集成人 ff-only；本会话只读 `worktree list` 核验）。只是旁证，**不是** ④ |
| v2 消费方集成 | `integration/frontend-workbench-v2` = `3f632739fc186396221482364cf16e3629b4b24f`（只读）。本批提交都**不是**它的祖先。本会话不写、不代登记 v2 / peer / main 树 |

**本轮开始时重新读取**（不依赖会话记忆）：
- 工作流与权威：AGENTS.md（§2 / §3 / §5 / §6）、`docs/plan.md`；交互 / UI 只读 `docs/interaction.md` §3、`docs/designUI.md` §2.4 / §6 中与本批相关的段落。
- 本 feature 规格：冻结 spec.md（R-001 / R-002、46 AC）；plan.md（页首 r6.9、§1【r6.9】R2-C 表、§2.1【r6.9】、§2.3【r6.8】【r6.9】）；tasks.md（页首 r6.9 块、§1、§2a、§3、T-A22a / A22c / A22d、T-B01～T-B04、§5～§7）。
- 审核与分析：checklist.md R10 节（只读，S-41～S-43）、analyze.md R16。
- 记账与交接：implementation-log §8 / §14、interface-handoff §1 / §3、`review-batch2.md` R2-C、`review-batch3.md` / `review-batch3-cache-fix.md` 的风险台账、`specs/README.md`。
- 实施者回报（只作结果来源，不替代代码阅读）：`astra-list-result.md` 与其详版 `C:/Users/iswal/AppData/Local/Temp/astra-list-01a187e0/result.md`、`astra-detail-cache-result.md`、`astra-detail-create-result.md` 与 `astra-detail-create-logs/summary.md`，以及各命令原始日志。

## 1. diff 事实与所有权

**逐提交文件清单**（`git show --name-only`；父提交链连续）与 tasks 五个任务的修改范围、implementation-log §14 写权限表逐一一致：

| 提交 | 文件 | 对照写权限 |
|---|---|---|
| B01 `5c00cf6`（7） | `jobs/pages/JobListPage.vue`；新建 `jobs/components/JobCard.vue`；`jobs/components/{JobStatusBadge,ArtifactStatusBadge,SourceBadge}.vue`；新建 `tests/component/jobs/job-list.spec.ts`；`tests/component/jobs/badges.spec.ts` | 徽标只改根 `data-status`（SourceBadge 无）与边框规则；badges.spec 只在文件头加 3 个 `?raw` 导入并在末尾追加 `WI badge tone` 组，原 18 / 9 例不改 |
| B02 `0221a94`（2） | `JobListPage.vue`（筛选条）；`job-list.spec.ts` 只追加 `WI AC-001-2` 组（+139 / −0） | 一致 |
| A22d `ca7dca1`（2） | `jobs/stores/jobs.ts`（+43 / −1，仅 import 行一处替换）；`jobs-store.spec.ts` 只在第 447 行后追加三组（+363 / −0） | 原列表 / 筛选 try 块与 `ensureJobs` / `applyFilter` / `createJob` / `receiveAgentEvent` 原文不变；原 27 例与 `connect` / `changeScenario` 不变 |
| B04 `cc6559d`（5） | `JobDetailPage.vue`；新建 `StageRail.vue` / `StageWorkspace.vue` / `job-detail.spec.ts` / `e2e/jobs/detail-stage.spec.ts` | 不改 store / routes / session |
| B03 `6c082fd`（4） | 新建 `JobCreatePanel.vue` / `job-create.spec.ts` / `e2e/jobs/list-create.spec.ts`；`JobListPage.vue` 只增按钮与内联挂载（+18） | 一致 |

**零差异**（`git diff --stat 37e2f71..6c082fd -- <路径>` 为空）：`frontend/src/{app,shared,agent,workbench,contracts}/**`（含 fixture 与生成物）、`main.ts`、`jobs/routes.ts`、`jobs/stores/session.ts`、`jobs/persistence.ts`、`scripts/**`、`package.json`、`pnpm-lock.yaml`、`vitest.config.ts`、`playwright.config.ts`、`tests/unit/jobs/{routes,session-context}.spec.ts`、`e2e/{shell,agent}.spec.ts`、`specs/**`、`docs/**`、AGENTS.md、HANDOFF.md。`git diff --check 37e2f71..6c082fd` 通过。

## 2. 逐任务核对（完成标准 → 代码证据 → 命令）

- **命令结果**列：实施者在实施树执行（openai/gpt-6-astra，三个新会话，均为首选、调用正常、未回退），本会话没有重跑。
- **标题存在**列：本会话读过测试源，确认 tasks 命令的 `-t` / `-g` 标题存在，`test` / `test.each` 展开数与回报用例数对得上。

| 任务 | 固定 commit | 完成标准 → 代码证据 | 标题存在 | 命令结果（实施者执行） | 判定 |
|---|---|---|---|---|---|
| T-B01 | `5c00cf6` | **①** 列表只读 `useJobsStore()`，挂载 `ensureJobs()`；JobCard 标题 = `RouterLink {name:'job-detail', params:{id}}`（无 stage），类型 / 阶段取 `JobTypeLabel` / `StageLabel` 图标 + 文案，状态用 `JobStatusBadge`，`<time :datetime>` 原样；不渲染角标。测试：normal 5 卡顺序 = `listJobs()`，与 `updatedAt` 字符串倒序一致，href = `/jobs/<id>`，点击后 `params.stage` 为 undefined；复用缓存时无二次读、Storage 零调用。**②** `idle/loading` → Loading；`error` → `ErrorState(moduleId='jobs-list')`（含有缓存时）；空 → “暂无作业。”；诊断 JSON `{moduleId,code:'adapter_error',message,ts}` 可复制，重试经 `refresh()` 恢复。**③ R2-C**：Job / Artifact 徽标根 `:data-status`，基础边 `var(--fai-glass-module-border)`，ok / warn / bad 属性选择器与 plan §1【r6.9】表逐值一致（draft / cancelled 无专属规则）；SourceBadge 只改基础边、无 `data-status`；无 `--fai-status-sample`，`color` 不取状态 / 红令牌。**④** 工程门 | ✓（AC-001-1 2；AC-001-4 list 1+1+2；badge tone 9+7+4+1=21） | 命令 1 **2**（重跑后；首跑 1 fail）；命令 2 **4**；命令 3 **21**（重跑后；首跑 1 fail）+ `check --only colors` / `glass` 通过；命令 4 badges 整文件 **48** + typecheck / lint 通过。另：原 `WI status badges` 18 / `WI source badge` 9 不变通过 | 满足 |
| T-B02 | `0221a94` | **①** 状态 / 类型 `<select>`（“全部” + 契约 options / Label 文案）、标题 `type=search`、“清空”按钮；任一变化组装 filter（title 非空原样、不 trim），全空 → `applyFilter(null)`；展示 `filteredJobs ?? jobs`；筛选空结果文案“暂无符合筛选的作业。”；筛选失败与成功均不清共享读错误，重试经 `refresh()`（R3-A 已关口径）。控件初值取 store 的 `filter`（返回列表页时保留筛选，不发额外请求）。测试：五步组合的透传 spy 参数 = 组装 filter、卡片 = 真实 `listJobs(filter)`、`jobs` 引用不变；清空不发请求；`' j-process '` / `'J-PROCESS'` 无匹配、`' '` 匹配 5（fixture 标题均含空格）；empty 场景清空后回到“暂无作业。”。**②** 工程门 | ✓（AC-001-2 6） | 命令 1 **6**（重跑后；首跑 1 fail）；命令 2 typecheck / lint 通过（lint 首跑 2 warnings 后修正）；job-list 整文件 **12** | 满足 |
| T-A22d | `ca7dca1` | **①** 新增只读 `currentJob` / `currentStageWorkspace` / `detailStatus` / `detailError`（`computed` + `readonly`）、`openJob(jobId, stage \| null): Promise<Stage \| null>`；私有 `anchor` 与共用私有 `readDetail`（`getJob` → `stage ?? job.currentStage` → job 非 null 才读工作区 → 一次写两缓存、`anchor.stage` 定为有效阶段、ready、清错）。只在 `currentJob?.id !== jobId` 时置 loading。**②** 失败保留旧缓存、写原 `ErrorResponse.error`、resolve null；empty 预置 id → 两缓存 null、ready、返回 null；not_found `retryable=false`。**③** `refresh()` 原列表 / 筛选 try 原样，之后 `anchor !== null` 时独立 try 重读，不置 loading、只写 detail 读状态；列表失败不跳过详情、互不改写。**④** 无 `closeJob` / 序号 / 锁 / guard / 轮询 / setter | ✓（open 4；states 1+1+2+1+1=6；refresh 6） | 命令 1 **4**（首跑 3 / 1 fail，见 §2 末）；命令 2 **6**；命令 3 **6**；命令 4 整文件 **43**（原 27 + 新 16）+ typecheck / lint 通过 | 满足 |
| T-B04 | `cc6559d` | **①** `watch([()=>route.params.id, ()=>route.params.stage], …, {immediate:true})`：合法 stage → `openJob(id, stage)`；缺省 / 未知 → `openJob(id, null)`，返回非 null 时 `router.replace` 一次。三态按 `detailStatus`（`moduleId='job-detail'`，not_found 无重试），不调用 `ensureJobs`。详情头：标题、类型图标 + 文案、`JobStatusBadge`、subject（null 不渲染）、goal（`''` 不渲染、`white-space: pre-wrap`）；不显示 createdBy（S-41）。StageRail：按 `stages` 原序 4 个按钮，`StageLabel` / `StageStateLabel` 图标 + 文案，`aria-current="step"` + `border-inline-start-color: var(--fai-accent-red)`（同 `app/Rail.vue` 当前项写法），`aria-pressed` 标当前查看，点击 `router.replace`。StageWorkspace = `aria-label="<阶段>工作区"` 占位与“工作区内容由后续任务提供。”。**②** e2e：`/jobs/j-process` 与 `/bogus` → `/jobs/j-process/process`；`/analyze` reload 后 `aria-pressed` 仍在“分析”、`aria-current` 仍在“处理”；点“交付” → `/deliver`，`goBack` 回 `/jobs`（证明 replace）。**③** slow 两次读 3000 ms 后 ready；`/jobs/j-collect/collect?scenario=empty` 与无 stage 均显示“暂无作业。”、不 replace；error 诊断可复制、切回 normal 重试恢复；`j-missing` not_found 只剩“复制诊断”、`listStatus` 不变。五种阶段态由 `j-failed`（done / conflict / not_started）+ job-running `j-human`（done / needs_human / running / not_started）的 fixture 合起来覆盖（本会话读 `jobs.json` 核实）。**④** 工程门 | ✓（AC-002-1 2+1+2+1=6；AC-002-2 e2e 4；AC-001-4 list 4 + detail 1+2+1+1=9） | 命令 1 **6**（首跑 2 fail，见 §2 末）；命令 2 e2e **4**；命令 3 **9**（2 文件）；命令 4 typecheck / lint 通过（lint 首跑 2 warnings 后修正）。详情组件整文件 **11** | 满足 |
| T-B03 | `6c082fd` | **①** JobListPage“新建作业”按钮 `aria-expanded`，`v-if` 内联 `JobCreatePanel`（普通 `<section aria-label="新建作业">`）。表单：title 原值（`CreateJobInputSchema.shape.title.safeParse` 即时提示）；type 初值 `''`、选项来自 `JobTypeLabel`、`JobTypeSchema.safeParse`；subject `trim()===''` → `null`，否则原值；goal 原值。校验失败不调用 store。成功：`jobsStore.createJob(input)`（内部一次 refresh）→ `router.push({name:'job-detail', params:{id, stage:'collect'}})`。失败：`ErrorState(moduleId='job-create')`，表单保留、不导航、`@retry` 重新提交。**②** e2e：空提交见两条提示、URL 仍 `/jobs`；填写后进入 `/jobs/j-…/collect`；`fai.jobs.v1` 记录 `{title,type:'research',subject:null,goal,status:'collecting',currentStage:'collect',createdBy:'human'}`；详情回显标题 / “专题” / “提取中” / goal 多行，“提取”`aria-current="step"`。**③** 无 dialog / aria-modal / inert / fixed / 遮罩 / 焦点锁（DOM 与两份 SFC 源文本双查），展开时筛选可聚焦可用 | ✓（validation 1+2+1=4；non-modal 1） | 命令 1 **4**；命令 2 e2e **1**；命令 3 **1** + typecheck / lint 通过（typecheck 首跑新测试 TS18046 ×2、TS2339 ×1 后修正） | 满足 |

**批次回归时间线**（实施者执行、本会话未重跑；只登记真实发生的运行）：

| 时点 | 树 | 结果 |
|---|---|---|
| B02 `0221a94` 后（会话 `01a187e0`） | clean | 全量 `test:unit` **32 文件 986 / 0**；`check` 六守卫；`contract --check` 24 / 10 / 2；typecheck / lint；routes + session **17**；`jobs-store -t "WI H-2"` **27**；badges `WI status badges|WI source badge` **27**；`e2e/shell` + `e2e/agent` **24** |
| A22d `ca7dca1` 后（会话 `01a187ee`） | clean | 全量 **32 文件 1002 / 0**；`check`；contract 24 / 10 / 2；routes + session 17；job-list 12；badges 48；H-2 27；shell + agent E2E 24。原 447 行测试、27 例、`connect` / `changeScenario` 与原列表块 / 四 action 经 hash 核对不变 |
| B03 `6c082fd` 后（会话 `01a187fa`，末轮） | clean | 全量 **34 文件 1018 / 0**（+16）；`check` 六守卫（tokens 156 / 5 artifacts，colors 正样本 24 / 24、负命中 0）；contract 24 / 10 / 2；typecheck / lint；routes + session 17；H-2 27；store 43；badges 48；job-list 12；detail 11；**四份 E2E 29**（shell + agent 24 + detail-stage 4 + list-create 1）；4173 前后空闲 |

**失败留痕**（都是测试结果，不是模型调用失败，不回退；旧测试未改；以原始日志为准）：
- B01：新测试误把具名路由缺省 `params.stage` 断言为 `''`（实为 undefined）；happy-dom 把 `border` 简写序列化为 `thin solid`，改为断言解析后的 `border-color` + 真实 SFC 基础声明原文。另有一次只读保留性核对脚本的 GBK 解码 / 截取问题（脚本问题，非产品测试）。
- B02：新测试误以为单空格标题无匹配（5 个 fixture 标题都含空格）；新按钮格式触发 2 条 lint 换行警告。
- A22d：新测试对未开始 analyze 阶段的空 `artifacts[0]` 做只读断言（undefined），改在有产物的 process 工作区断言。
- B04：新测试原期待离开详情后不再 `getJob`，实际列表页 `ensureJobs → refresh` 按设计重读保留锚（plan §2.3【r6.9】“离开详情不清锚”），修正新测试期望，未加页面 / store guard；模板换行 2 条 lint 警告。
- B03：新测试 `catch` 变量类型 TS18046 ×2、`getComponent(...).exists()` TS2339，改为类型标注与 `findComponent`。

**未执行**：其余 7 份 E2E、全量 `pnpm -C frontend test`、人工截图。**不构成**任何 AC 的最终验收、全 feature Review 或 Gate 2。实施者回报每个任务均未超过 2 h，未触发 §7 拆分。

**本批结论**：5 / 5 任务的完成标准在代码层都有对应实现，17 条原定命令的标题均存在、实施者执行全部通过；失败留痕真实、修的都是新测试或新模板。绿测试不等于无缺陷——§5 列出本会话静读发现的 6 项观察，交独立 A 实测判定。

## 3. 实施中的定形：是否需求变更

| 实施事实（源码确认） | 原 plan / tasks 文本 | 判定 | 同步位置 |
|---|---|---|---|
| `JobCard` props 为 `job: DeepReadonly<JobListItem>`（store 对外元素层只读的直接结果） | T-B01【r6.9】“props `job: JobListItem`” | 类型精度，不改行为 | tasks T-B01【r6.10】、plan §2.1【r6.10】 |
| store 对外 `currentJob` / `currentStageWorkspace` 在类型层为 `DeepReadonly<Job> \| null` / `DeepReadonly<StageWorkspace> \| null`（同既有 `jobs` 写法）；`openJob(jobId: string, stage: Stage \| null): Promise<Stage \| null>` 与 r6.9 一致；锚与读函数私有（测试断言 store 上无 `anchor` / `readDetail` / `closeJob`） | plan §2.3【r6.9】 | 一致；只补类型层读法 | tasks T-A22d【r6.10】、plan §2.3【r6.10】、interface-handoff §3 |
| `StageRail` props `{stages: readonly StageSummary[]; currentStage: Stage; viewedStage: Stage \| null}`，emit `select`；`aria-pressed` 绑定布尔，未查看项输出 `"false"`；当前查看的视觉线索为阶段名下划线（仅 `aria-pressed='true'` 规则） | T-B04【r6.9】 | 一致；补“查看”视觉线索的实际写法 | tasks T-B04【r6.10】、plan §2.1【r6.10】 |
| `StageWorkspace` 占位文本“工作区内容由后续任务提供。”，`currentStageWorkspace` 无任何页面消费者 | T-B04【r6.9】 | 一致；C–F 仍为占位 | 同上 |
| 创建面板诊断 `moduleId='job-create'`（R10 已审 tasks / checklist 原文）；协调提示中的 `jobs-create` 是笔误，实施者按已审原文实现并在开码前声明 | T-B03【r6.9】 | 一致，**不改**为笔误拼写 | tasks T-B03【r6.10】 |
| 列表页控件初值取 store 的 `filter`（回到列表时保持上次筛选，不额外请求） | T-B02【r6.9】未写 | 既有 `filter` 只读成员的自然消费，不新增机制 | tasks T-B02【r6.10】 |

**判定**：都是已审设计的落地或类型 / 读法精度。方法集、契约、生成物、动作矩阵、九场景、样例表、迁移表、定稿语义、46 AC，以及任务编号 / 依赖 / 预估 / 完成标准 / 命令都没有变。**不是需求变更**，不回 Clarify / Gate 1。同步文字标【r6.10 精度（Converge batch4 登记）】，只写类型、名称与读法，不复制实现。

## 4. P3 与精度项状态（只记事实，不冒称关闭）

| 项 | 本批事实 | 状态 |
|---|---|---|
| **R2-C**（`review-batch2.md`） | B01 `5c00cf6` 按 plan §1【r6.9】表修正三个徽标的边框令牌（§2 B01 ③）；文案 / 图标 / props / class / 文字色未变 | **代码已修，待第四批独立 A 代码 Review 确认关闭**；Converge 不判关闭 |
| R10 **S-41**（详情 / 列表不显示创建者） | B04 按已审 r6.9 不显示 createdBy；`JobListItem` 契约本身不含创建者（describe 原文）。冻结 spec §2 目标与 R-001 what 都列“创建者（人 / 计划）”，46 AC 无一要求展示 | **未关、明确归属本 feature**：在 **T-B05**（作业级状态区）开工前，先做一次最小精度轮（Tasks / Plan，经 Analyze + A 定向复核）决定展示位置与文案来源（候选：S-11 同机制的契约展示映射）；若因此超 2 h 按 B-12 先例拆小任务。**不改 spec、不写成“v1 不展示”、不移交其他 feature、不回头扩已实施的 B04、不代 Walter 风险接受** |
| R10 **S-42**（harness 优先 RouterView） | `job-detail.spec` / `job-create.spec` 均经 `mount({render: () => h(RouterView)})`；“离开详情”用例断言唯一的额外读是列表 `ensureJobs → refresh` 对保留锚的 `getJob('j-process')`，无 `undefined` 读、无页面 guard | 已按提示落实 |
| R10 **S-43**（真实 api 乱序） | 本批不加请求序号 / 锁 / guard | plan §2.3【r6.10】补一句跨 feature 登记：真实 `api` 若出现后发先至，由 `api` feature 按需求流程决定；本 feature 不预做 |
| R3-B / R3-C；R-A、R-B 残留、R-C / R2-A、R-D ①③④、R-E、R-F、R2-B（AgentClient 侧）、R2-D | 本批不涉及 | **未处理**，未经 Walter 风险接受；归属不变（implementation-log §8） |

## 5. 给第四批独立代码 Review 的观察项（静读所得；不预设严重度，不新增任务）

- **O-B4-1（应用内导航丢失 URL query）**：
  - **事实**：`JobCard` 的 `RouterLink`、`JobDetailPage` 缺省 / 未知 stage 的 canonical `router.replace`、`selectStage` 的 `router.replace`、`JobCreatePanel` 成功后的 `router.push` 都只带 `{name, params}`，不带当前 `route.query`。mock 的 `scenario` 只在 client 创建时从 `window.location.search` 读一次（会话内导航不受影响），但 **`agentScript` 在每次 `agentClient.send` 时重新读 `window.location.search`**（v1 `mock/index.ts` `readAgentScript()`）。
  - **静读推演**：① 从 `/jobs/j-human/process?scenario=job-running`（有效 fixture）点“分析” → URL 变为 `/jobs/j-human/analyze`，此时 reload 会按 normal 重建，j-human 不存在 → not_found；job-running 列表点 j-human 同理。② 从 `…?scenario=job-pending-merge&agentScript=long` 进入后若先点阶段 / 卡片再触发 send，`agentScript` 会静默回落到 `success`（或 `window.__FAI_MOCK__.agentScript`）。
  - **对照 AC**：AC-002-2 的两项字面要求（点击后 URL 更新；直接打开带阶段地址刷新后仍停留）在任一场景都满足，直接打开的地址刷新不丢 query；AC-008-2 要求场景切换可用并被 e2e 使用，经 `?scenario=` 直开即可用。v1 壳的 `Rail.vue` 导航链接（`:to="item.path"`）同样不带 query（已交付、已接受的既有行为）；非 normal 场景只在内存，reload 本来就会重置会话写入。plan / tasks / checklist 从未规定导航须透传 query。
  - **Converge 判定**：**不判为对 AC-002-2 / AC-008-2 的明确违反**，不新增任务；归入 T-G05（场景遍历）/ T-G01（`agentScript`）一类的下游 e2e 观察，并在这两个任务状态行加阅读提示（e2e 优先直开带 stage 的深链，或用 `window.__FAI_MOCK__.agentScript`）。**交 A 实测并判定严重度**。若 A 或 Walter 判为须修，最小方案（≤ 0.5 h，按 §2 第 9 步登记）：只在上述四处路由对象加 `query: route.query`（JobCard 需 `useRoute`），加一例组件回归；不改 v1 / v2 导航、不加 fallback、不改 mock 读取时机。
- **O-B4-2（离开后迟到的 canonical replace）**：详情页 watch 回调是 async。无 stage 深链首读未完成时（v1 mock 只有 slow 场景，约 3 s 窗口；真实 `api` 视延迟而定）若用户已离开详情，回调仍会在 `openJob` 返回后执行 `router.replace({name:'job-detail', …})`，把用户拉回详情。具体怎么出错清楚；v1 概率低（需 slow + 3 s 内离开）；修复约 1 行判断但属新增 guard，按 AGENTS §5.1 与 plan r6.9“不加去重 guard”须先报 Walter 同意。本会话**不加任务**，与 S-43 一并交 A 实测 / 判定是否报 Walter。
- **O-B4-3（创建面板提示时机）**：两条校验提示（`role="alert"`）在面板一展开、尚未输入时就渲染；e2e “先空提交再见提示”无法区分提交触发与初始渲染。标准字面（给出提示且不提交）满足；属 UX / a11y 观察。
- **O-B4-4（同作业重开时的旧错误）**：`openJob` 只在换作业时置 loading（r6.9 口径）。若先打开 j-missing（not_found，`currentJob` 仍为旧作业 A）再回到 A，读完成前页面仍显示上一次的 not_found 错误，随后自愈为 ready。不越出 r6.9 设计，只记。
- **O-B4-5（证据粒度）**：B04 的 2 条 lint 警告与 B03 的 TS 错误原文只在会话 transcript / 一份 log 中；B01 tone 测试从断言 `border` 简写改为断言 `border-color` + SFC 原文声明（happy-dom 局限）。请 A 以固定代码亲跑为准，并确认改写后的断言仍证明“基础规则边为中性令牌”。
- **O-B4-6（R2-C 关闭）**：代码修正已落地（§4），关闭只由 A 判定；A 可同时复跑 `WI status badges` 18（H-2·标签 ① 候选的复核条件，§6）。

## 6. 上游与 H-x（只记录，不导入、不代登记）

- **上游**：main `072bb12` 不在祖先，继续 pin `90187f7`；R2-D 同步流程（tasks §7 重核 → Analyze → A 定向复核 → 指定范围小任务）不变，不新增人工门。本会话不写 v2 / peer / main 任何树。
- **H-2·标签**：B01 改了 `JobStatusBadge`（新增根 `data-status`、边框令牌），对外 props / 文案 / 图标不变。
  - ① 候选 `5c00cf6`（待第四批代码 Review）；已审历史 `ebce4c8` 并存、保留追溯；
  - ② 当前有效 R10 `37e2f71`（blob `4537c55…`）；
  - ③ 实施者执行：原 `WI status badges` 18 / `WI source badge` 9 不变通过，新 `WI badge tone` 21，整文件 48，colors / glass / typecheck / lint 通过（与 `ebce4c8` 时 A 亲跑的 18 / 10 历史并存）；
  - ④ 缺 → **待消费方集成（未交付）**。
- **H-2·列表**：公开交接成员（`jobs` / `listStatus` / `listError` / `ensureJobs` / `refresh` / `createJob`）签名与语义未变，① 仍为 `af24c82`；`ca7dca1` 新增的详情缓存是内部成员，只在 §3 落地核对登记，不改交接接口，`-t "WI H-2"` 集合仍 27（实施者在 `6c082fd` 复跑通过）。④ 缺。
- **页面切片**：提供任务中 T-B01 / B02 / B04 已实施（待 Review），C 组（T-C01 / C01a / C02 / C03 / C04）未开始；`intake.spec.ts` 不存在 → **未交付**。实施者已跑 `detail-stage.spec.ts -g "WI AC-002-2"` 4、`job-list.spec.ts` 12，仅作部分旁证。
- **H-1 / H-3 / H-4**：历史生产方证据保留，当前有效 Checklist 可并记 R10；④ 缺。**H-5** 未做；**H-6** 缺 T-A21。生产方集成树 `6c082fd` 不是 ④。

## 7. AC 与 Converge 核对项

- **46 AC 最终验收：0 / 46**。本批六个 AC 的最终任务（AC-001-1 B01、001-2 B02、001-3 B03、001-4 B04、002-1 B04、002-2 B04）已实施、命令绿，但最终验收须本批 Review → 全 feature Review / Gate 2，此处不宣称。
- **页面现状**：`/jobs` 列表与详情现为功能页（列表 / 筛选 / 新建 / 详情头 / 阶段轨道 / URL 阶段），但四阶段工作区仍是 C–F 占位；业务处理、投放、取消、重跑、角标、收件箱、创建者展示均**未做**，不得计为完成。
- **tasks §7 写后统一刷新（S-31）**：本批新增 UI 写路径只有 `JobCreatePanel → useJobsStore().createJob`：成功恰一次 `refresh()`（组件测试 `lists` 恰一次、无另行刷新；有筛选 / 打开详情时由 A22d 一并重读），失败不刷新、表单保留。其他写 API 仍无 UI 调用方，由 T-C01 / C02 / C03 / B05 / G04 等接入时核。
- **tasks §7 外部阻塞**：AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除 → 必须报“未收敛（外部阻塞）”。

## 8. 结论

- **本批（5 项）**：**已收口，待第四批独立代码 Review**。没有发现对冻结 AC 的明确违反，不新增修复任务；定形只是精度（r6.10）；O-B4-1～6 交 A 判定（O-B4-1 若判须修，按 §5 最小方案经 §2 第 9 步登记；O-B4-2 若要修须先报 Walter）。
- **feature 整体**：**未收敛（尚未实施 43 项 + H 组外部阻塞）**。69 个任务 / 约 104 h：**26 项已实施** = 21 项已完成（四次批次 / 增量 Review）+ 本批 5 项待 Review；**43 项未开始**（A 组 T-A14～T-A21 共 8、B 组 T-B05～T-B07 共 3、C 5、D 3、E 3、F 7、G 10、H 4）。完成标准 / 命令 232 / 232；46 AC 最终验收 0。
- **不是** Review 通过、Gate 2 或 Handoff；没有写 `review.md`；H-x 无一“已交付”。

## 9. 下一步（第四批独立 A Review 前要做 / 要看的）

1. **集成人**：审阅并提交本 worktree 的文档改动（本会话不 commit），再派审核员 A。
2. **第四批独立代码 Review**（AGENTS §2 第 10 步）：A 新会话、与实施异模型；首选 `claude-fable-5-1`（先 bridge，限额已确认则走 anthropic）。
   - **只读输入**：冻结 spec；plan / tasks（r6.9 + r6.10）；checklist R10；本报告与 analyze.md「Analyze R17」；固定代码 diff `37e2f71..6c082fd -- frontend`（逐提交见 §0）。
   - **重点**：R2-C 是否可关闭（§4）；§5 O-B4-1（建议真实浏览器复现两条链：`job-running` 点阶段后 reload；`agentScript=long` 进入后先导航再 send）、O-B4-2（slow 下无 stage 深链 3 s 内离开）、O-B4-3～5；A22d 列表 / 详情读状态隔离与“离开后仍重读”的代价；B03 非模态审计；H-2·标签 ① 候选是否可转生产已核（复跑 `WI status badges` 18）。
   - 可亲跑本批 17 条命令、全量 unit、四份 E2E；其余 7 份 E2E 与全量 `pnpm test` 是否跑由 A 决定，但不得以本报告代替。
3. **S-41**：T-B05 开工前的精度轮（§4），不在 Review 内顺手改。
4. 依赖链：以 26 项已实施计入，依赖已满足、未开始的任务为 T-A14 / T-A15 / T-A16 / T-C01（脚本复算，analyze R17）；B04 相关后续（T-B05 / T-B06 / T-G02 等）仍受 A1x / A2x 链阻塞。批次划分由集成人决定。
