# frontend-workbench v2 — Analyze 汇总

> **当前独立复跑：R5（2026-10-28）**，固定审 `5ba40ad4524cd823bc0a73a90c7c9ae10d72e274`，原文 [`analyze-v2-r5.md`](analyze-v2-r5.md)。结论为不通过（2 P2 / 3 P3）；修正提交 `71a21adcd6d9ecb6c8906b1a03869407b29a9677` 已集成，但 F-01～F-05 尚待下一轮只读复跑确认。R3 / R4 是作者 / 文档集成者自查，不能代替本轮独立报告；下方 R2“当前有效”只指当时固定基线。G-02 与 H-x 尚未解除，不授权 Implement。

> **R3 定向补记（2026-10-28 恢复后）**：R3 只覆盖恢复修订（v1 Handoff `43b6d79` 登记、V2-S10～S12、T-V2-01 的 AppShell 条件消解），原文 `analyze-v2-r3.md`；内部没有新增 F，外部 / 裁定项为 G-01～G-03。下面 R2 对 `6bda6c9` 的结论仍然有效。
> **当前有效轮次：R2（2026-10-28）**。Analyze = `claude-opus-5-5` via `anthropic`（bridge 本窗口额度不可用，未重复探活、未换模型），固定审查提交 `6bda6c910343b887fad2ffede062fe241f034752`。**内部一致：R1 的 F-01～F-07（3 P2 / 4 P3）全部关闭，无新增 F。** 逐项闭环证据、实际只读核验与 O-1～O-4 观察项见同目录 [`analyze-v2-r2.md`](analyze-v2-r2.md)（作者原样产物）。
> **后续状态补记（2026-10-28 暂停时）**：A = `claude-fable-5-1` via `anthropic` 已在全新独立会话中审 `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`，Checklist R2 通过（0 阻断，I-01b / V-02 正式勾选），原样产物提交 `f1f755bad8e4bab7577c415f4aea3d297c9d37a8`。这不改写下方或 `analyze-v2-r2.md` 的历史报告；R2 报告内“待 A 复核”是报告产出时状态。**仍不授权 Implement**：外部开工条件 E-01～E-12 未取得交接证据，新增非阻断建议 V2-S10～S12 待恢复处理。用户已要求暂停；恢复入口 `HANDOFF.md`。本 Analyze 报告本身不是 A 审核、Converge、Review、Gate 2 或实施验收。
> **落盘记录**：协调器只原样集成只读报告并同步状态，不修改诊断或审核勾选；本轮未修改代码、冻结 spec、旧 v1 任务正文及两份 Checklist。

## R1 历史（当前判定由上方 R2 取代，原文保留）

> **落盘说明（修正会话追加，非报告正文）**：以下自「# frontend-workbench v2：Analyze 报告」起为 Analyze R1 报告原文，固定审查提交 `b364971a1a76fde96be6f924a7b7263ecb9cd447`，作为历史只读诊断保存。报告作者只读产出、未写仓库；现由 Analyze 后的 Plan/Tasks 修正会话（`claude-opus-5-5` via `anthropic`，分支 `docs/frontend-workbench-v2-analyze-fixes`）原样落盘，F 表与 E 表内容未改。
> 本轮修正 plan.md / tasks.md / README **不等于已重跑 Analyze**：最后一次有效 Analyze 仍是本 R1，其 F-01～F-07 在下一轮独立只读 Analyze 复跑确认前**不视为已关闭**；修正也未经审核员 A 定向复核。

# frontend-workbench v2：Analyze 报告

- **模型与通道**：Analyze = `claude-opus-5-5`，经 `anthropic` 通道。本限额窗口内 `claude-bridge` 已明确额度不可用。按 AGENTS §6 第 5 条，本轮没有重试 bridge；只换了通道，没有换模型。协调和集成由 `openai/gpt-6.1-sol` 负责。本会话不是审核员 A，也不是实施者。
- **基线**：固定审查提交 `b364971a1a76fde96be6f924a7b7263ecb9cd447`，当前 HEAD 就是这个提交，工作树干净。实际 diff 用的是 `git diff a8ab444 b364971 -- specs/frontend-workbench/{plan,tasks}.md specs/README.md`。
- **只读参照**：
  - v1 实现：`git show 0ffa15e:<path>`。它是固定的历史参照，不是 Handoff，也不是 HEAD。
  - 互动方设计：`git show 8bd1b31:…`。
  - `b19427a` 不作为 Handoff。移动工作树里未提交的 R3/R4 不作为证据。
- **重新完整读取的文件**：
  - AGENTS.md；
  - docs/{plan,architecture,interaction,designUI}.md；
  - spec.md；
  - plan.md，共 560 行，已读完；
  - tasks.md，共 794 行，v1 历史部分和 v2 部分都已读完；
  - checklist-v2.md；
  - specs/README.md。
- **只读声明**：本轮没有写任何仓库文件，也没有修改 code、spec、plan、tasks 或 checklist。没有提交，没有启动其他 agent，没有运行 pnpm、vitest、playwright 或应用，也没有读取凭证配置。结构核验用的临时 Python 脚本放在仓库外的 `/tmp`；结束后 `git status --short` 输出为空。

## 总结

**结论：有未解决的冲突，Plan 和 Tasks 内部还不一致。** 共 3 项 P2、4 项 P3，没有 P1。

三项 P2 都出在 S0 的导航收尾上：
- 研究列表被删除后，派生改动漏掉了一个文件；
- v1 的旧测试没有明确改写；
- `/jobs` 占位断言在集成后会变成反向断言。

这三项不改，`typecheck` 或全量 `pnpm test` 会在 S0 或集成后变红，而各任务自己的定向命令查不出来。P3 主要是交接切片里有几处隐含依赖或能力没有写明，以及开工闸门里有一条命令证明不了它要证明的条件。

结构方面：
- 52 条 AC 都有映射；
- 依赖没有环；
- 工时合计为 22 h；
- 完成标准和验证命令的条数一一对应；
- v1 任务正文零改动；
- 9 条建议已经落地，其中 S08 是部分落地。

**外部开工阻塞**另列在 E 表，和内部设计问题不混在一起。外部阻塞**全部未解除**：所有 v2 任务都是 blocked，本报告不授权 Implement。本报告不是审核员 A 的结论；Review、Converge 和 Gate 2 都还没有发生，不能说已经通过。

## F：内部冲突、缺口与歧义

| 编号 | 严重度 | 文件与行号 | 事实，以及影响的 AC | 最小修正（只给建议，未代改） |
|---|---|---|---|---|
| F-01 | P2 | plan.md:302（§7.2）；tasks.md:379、430～451（T-V2-02） | T-V2-02 要删掉 `stores/app.ts` 里的 `research` ref 和对应导出。但在 `0ffa15e:frontend/src/pages/PlaceholderPage.vue`:8–9 里，标题仍按 `route.meta.navId === 'research'` 读取 `app.research`。这个文件不在 plan §7.2 的写入表里，也不在 tasks §4 和任何 v2 任务的修改范围里。删掉导出后 `vue-tsc` 会失败，而 T-V2-02 的三条验证命令都不跑 `typecheck`，所以任务看上去能完成，仓库实际已经红了。影响 AC-002-7（派生改动）和 AC-009-1 | 1. 在 plan §7.2 和 tasks §4 加入 `src/pages/PlaceholderPage.vue`，写入者为壳，性质是最小派生修改：只删除 research 标题分支。<br>2. 把它列进 T-V2-02 的修改范围。<br>3. 给 T-V2-02 增加一条标准和命令 `pnpm -C frontend typecheck`。<br>4. 这项派生改动和 `stores/app.ts` 一样，要交给 A 确认（对照 checklist-v2 I-01） |
| F-02 | P2 | tasks.md:416、420；验证命令 1 | T-V2-01 只写了“新增 `AC-002-2 v2-nav`、删除旧 AC-002-3”。但 `0ffa15e:e2e/shell.spec.ts` 里有三类旧测试还在：<br>- :5–12 是八项菜单表（含 `/research`）；<br>- :16、:41 是以八项表为参数的 `AC-002-2` 菜单用例和直达用例；<br>- :54 是 `AC-002-2 … research detail deep links`。<br>验证命令 `-g "AC-002-2 v2-nav"` 不会选中这些旧用例，所以它们会留在仓库里，在 `-g "AC-002-2"`、T-V2-11 和 T-V2-12 全量运行时变红。旧 T-08#1 被取代的范围只写到“标准”，没有落到这些物理测试上。影响 AC-002-2、AC-009-1 | 1. 在 T-V2-01 的修改范围里写明：把 `shell.spec` 的八项表改成九项；删除 research 深链用例，保留 daily 深链部分。<br>2. 增加一条验证命令 `test:e2e -g "AC-002-2"`，用全前缀确认旧用例不存在或全部是绿的 |
| F-03 | P2 | tasks.md:380、420、604；plan §7.11 AC-002-2 | T-V2-01#1 断言 `/jobs` 是壳的占位页，owner 为 `workbench-interaction`。H-3（从 S1-track 起就会集成）会用同名路由替换这个占位，而 T-V2-09#1 的等价断言正好相反：要求“没有壳占位的 owner 文案”。tasks §4 里 `shell.spec.ts` 的写入链只到 T-V2-02，T-V2-11 又是“默认不改代码”，所以没有任何任务负责把这条 S0 断言迁移到集成后的状态，T-V2-12#1 的全量运行必然变红。spec AC-002-2 本身就区分了“壳单独验收”和“集成后”两种状态。影响 AC-002-2、AC-009-1 | 1. 在 tasks §4 把 `e2e/shell.spec.ts` 的写入链改为 T-V2-01 → T-V2-02 → T-V2-09。<br>2. 在 T-V2-09 的修改范围里，把 `/jobs` 的 owner 子断言替换成集成态断言。<br>3. 在 T-V2-01#1 注明：这条子断言只作为 S0 证据，H-3 集成后由 T-V2-09 取代 |
| F-04 | P3 | tasks.md:315、520（T-V2-05#2）；plan §7.3 H-2⑤ | 作为关键用例，T-V2-05#2 要调用互动方的写 action，tasks 举的例子是 `markInboxRead` 或投放归属。但这两个 action 分别属于 `inboxStore`（见 `8bd1b31` plan §2.3）和 H-5 加页面切片，都不在 T-V2-05 的 blocked_by（H-2 标签和列表、H-3 路由切片、H-6）里。H-2·列表这一行只写了“写回执会刷新缓存”，没写随交接一起交付哪一个写 action。闸门 §5 第 3 条只核对已登记的 H-x，所以这个任务可能已经开工，却验证不了 AC-003-7（共享缓存部分） | 1. 在 1.2 节 H-2·列表的内容里写明：随交接至少交付一个会改变作业摘要的写 action，名称以交接 SHA 为准，并附它的定向测试。<br>2. T-V2-05#2 改用这个 action。<br>3. 如果做不到，就在 blocked_by 里加上对应的 store 或切片。<br>4. README 第 33 行同步 |
| F-05 | P3 | tasks.md:458、470；plan.md:534（§7.13 S1-ctx） | T-V2-03 写的是：如果 `sessionStore` 只能由路由守卫设置，测试就用互动方的 routes 来导航。H-4 也写明“进入作业详情时设置，离开时由守卫清空”。这两点说明 H-4 实际上很可能依赖 H-3 的路由切片，但 T-V2-03 的 blocked_by 和 plan 中 S1-ctx 的依赖都只写了 H-1、H-4。影响 AC-005-8 单元部分的开工判定 | 1. 在 T-V2-03 的 blocked_by 和 plan §7.13 S1-ctx 里加一个条件依赖：“H-3·路由切片（H-4 只经路由守卫设置时）”。<br>2. 或者在 H-4 的交接要求里写明一种可在测试中设置的公开方式。<br>两种办法选一种 |
| F-06 | P3 | tasks.md:320、543；plan.md:339、§7.11 AC-003-9 | T-V2-06#1 要求“两种空态的文案都正确”。第二种空态需要“只含非进行中作业”的列表，但 H-6 只要求 `jobFixtures` “可以新增作业”。tasks 自己也承认，只能追加时这个子用例要保持 blocked。这样一来，AC-003-9 的任务能否收口，取决于一项从没向生产方提出的能力。spec 本身只要求“空态可触发” | 二选一：<br>1. 现在就在 H-6 和 README 第 33 行写入“jobFixtures 可替换”，或“`empty` 场景下覆盖项仍然生效”；<br>2. 把第二种空态降为不阻断 AC-003-9 的补充用例。 |
| F-07 | P3 | tasks.md:398（§5 闸门 2） | checklist-v2 的「阶段说明」明确不设复选框，当前 `^- \[ \]` 的计数是 0，`[x]` 是 28。所以闸门里的 `git grep -n "^- \[ \]"` 现在已经没有输出，证明不了“A 已经补勾 I-01b 和 V-02”。真正的条件只能人工核对，命令和标准实际上没有一一对应 | 1. 把闸门 2 的证据改成“A 定向复核产物的提交 SHA，加上阶段说明中 I-01b、V-02 的明确通过记录”。<br>2. 或者由 A 先给这两项补上复选框，再用 grep 检查 |

## E：外部开工阻塞（全部未解除，不属于内部设计缺陷）

| 编号 | 阻塞项 | 关联任务 | 放行证据 |
|---|---|---|---|
| E-01 | v1 完成 Review、Gate 2、Handoff 并合入 main 的准确 SHA | 全部 T-V2-01～12 | 在 tasks 1.1 节登记真实 SHA，并且 `git merge-base --is-ancestor <sha> main` 成功。不能用 `fdaa7d8`、`0ffa15e` 或 `b19427a` 代替 |
| E-02 | 壳 v2 的实施 worktree / 分支 | 全部 | 在 1.1 节登记，且从 E-01 的 SHA 建立 |
| E-03 | 指定集成人，以及只有集成人可写的集成验证分支 | 全部；S1/S2 要同步到该分支 | 在 1.1 节登记分支名和集成人 |
| E-04 | H-1：契约 2.0.0、`jobContext`、mock 透传 | T-V2-03、04、09；T-V2-07 因串行而继承；T-V2-11#8（AC-007-5） | 第 1.2 节规则 2 的四项：生产方固定 commit、已提交的有效 Checklist SHA、定向测试摘要、集成 SHA |
| E-05 | H-2·标签，含 `JobTypeLabel`、`JobStatusBadge` | T-V2-04（只用 StageLabel）、05、06；T-V2-07 继承 | 同上，四项齐全 |
| E-06 | H-2·列表：共享未筛选缓存①～⑤，以及“进行中”口径登记进 CONTRACT.md | T-V2-05、06、09 | 同上；另见 F-04 |
| E-07 | H-3·路由切片（`jobs`、`job-detail`，以及 `addRoute`） | T-V2-05、06、09；条件依赖 T-V2-03（F-05） | 同上 |
| E-08 | 页面切片：`/jobs` 列表页、作业详情页、`IntakeDrawer` 投放和归属流程 | T-V2-09、10 | 同上 |
| E-09 | H-4：`sessionStore.context`，以及在同一次导航内清空 | T-V2-03、07、09 | 同上 |
| E-10 | H-5：`intakeStore` 快照，以及非模态容器约定 | T-V2-07、08、10 | 同上 |
| E-11 | H-6：`listJobs` 的三个场景，以及角标 fixture | T-V2-05、06、09 | 同上；另见 F-06 |
| E-12 | 互动方当前有效的 A 授权：`8bd1b31` 里已提交的是旧 R2（审查对象 `630e06f`），不覆盖 H-2、H-4、H-5、H-6；plan 记载的 R3 未通过来自移动工作树，不作证据 | E-04～E-11 的全部任务 | 互动方提交的、审查到新要求的有效 Checklist SHA |

## 结构核验摘要（实际运行：只读 git，加仓库外的临时 Python）

- **git**：
  - `git rev-parse HEAD` 的结果是 `b364971…`，`git status --short` 为空。
  - `git diff --numstat a8ab444 b364971`：README 2/2，plan.md 14/14，tasks.md 518/0。tasks 只有页首和文件末尾两个 hunk，v1 的 T-01～T-15 和 AC 覆盖表零改动。
  - plan 的 8 个 hunk 都位于 §7（第 248 行起），§1～§6 零改动。
  - 对 `a8ab444..b364971` 的 spec、checklist-v2、checklist、docs、AGENTS 跑 `git diff --quiet`，结果都没有变化。
- **AC 覆盖**：
  - spec 的 AC 共 52 条，按 R-001～R-009 分布为 6/8/9/6/9/4/5/3/2。
  - plan §7.11 的 AC 集合：missing=[]，extra=[]。
  - tasks 第 7 节矩阵有 52 行，没有重复，没有遗漏。
  - 12 个任务完成标准里引用的 AC 并集等于 52 条，没有遗漏。
  - 矩阵里所有“T-V2-xx#n”引用都存在，而且对应的那条完成标准确实写了该 AC。
- **标准与命令**：每个任务的完成标准条数都等于验证命令条数（4/3/3/3/4/4/4/2/3/3/9/3）。语义缺口见 F-01、F-02、F-07。
- **依赖与工时**：
  - 依赖都只指向编号更早的任务，没有环。
  - 工时为 2/2/2/2/2/2/2/1/2/2/1.5/1.5，合计 22.0 h；每个任务都在 0.5～2 h 范围内。
  - 关键路径是 01→02→03→04→07→08→09→10→11→12，共 18 h。
- **文件所有权**：
  - §4 与 plan §7.2 互补，`jobs/**`、`contracts/**`、`events.ts`、`main.ts` 都归互动方。
  - `AgentDrawer.vue` 按 T-V2-04 → T-V2-07 串行。
  - `integration-v2` 由 T-V2-09 创建，T-V2-10 追加。
  - 缺 `PlaceholderPage.vue`（F-01）；`shell.spec` 的写入链缺 T-V2-09（F-03）。
  - README 第 33 行（跨 feature 那一行）由 Tasks 会话按协调范围落盘；这超出了“只改本 feature 一行”的字面范围，建议集成人在合并时确认。
- **v1 事实核对（`0ffa15e`）**：
  - mock `send` 没有并发守卫，每次调用生成独立的 runId。
  - 订阅在 `main.ts` 中完成。
  - `__FAI_TEST__` 只暴露 charts，所以 T-V2-09#1 退回等价断言是合理的。
  - `z.drawer` 令牌存在；`tokens-build` 把令牌名转成 `--fai-${name.replace(/[._]/g,'-')}`，因此 `layout.intake_width` 会生成 `--fai-layout-intake-width`。
  - `scenarios.spec` 的页面级计数在 H-6 normal 场景有进行中作业的前提下不受轨道影响。
- **没有运行**：pnpm、vitest、playwright、应用本身都没有运行；外部 worktree 也没有读取。

## 9 条建议的落地情况，以及未变部分的复用检查

- **已落地**：
  - S01：1.2 节登记表，以及 README 第 33 行补入三处细化；
  - S02：H-2③，以及 T-V2-05#1；
  - S03：§7.5 和 T-V2-06 的两种静态空态，但 H-6 的能力缺口见 F-06；
  - S04：H-3 路由切片列为依赖，不加 `hasRoute`；
  - S05：T-V2-09#3 显式等待终态；
  - S06：只在 `send` 函数体内调用 `useSessionStore()`；
  - S07：`JobStatusBadge` 未交接时 blocked；
  - S09：1.1 节，以及 plan §7.1 的补句。
- **部分落地**：S08。归属信息只写进了 `nav.ts` 注释和 M-09；用户看到的占位文案仍是“`learning` feature”，是否接受由 A 判断。
- **旧任务取代声明**（第 2 节）：已覆盖 checklist-v2 I-01b 列出的旧 T-08 第 1、2（进度）、5 条，T-13 第 1 条，T-15 第 1、2 条，T-08 状态文案，以及 `main.ts`。这些声明只作用于标准文本；物理测试没有处理，见 F-02。
- **未变部分的复用**：plan §1～§6 和 v1 tasks 正文都是零改动，checklist-v2 I-03 的复用依据仍然成立。plan §7.14 写了“筛选后返回工作台复验”，§7.11 没写，但 T-V2-10#2 已经补上，不构成冲突。
- **plan 的 15 处小改**：没有发现产品需求变化，spec 和 docs 都没改。这些小改仍然**未经审核**，要等 A 定向复核。

## 下一步

1. **先修 Plan 和 Tasks**：修 F-01～F-03（P2）。F-04～F-07（P3）建议同批修正，也可以登记为已接受风险。只改 plan §7.2、§7.3、§7.13 和 tasks 的 1.2、4、5 节以及 T-V2-01、02、03、05、06、09；不改 spec，不改 v1 正文。
2. **修完后重新做一轮 Analyze**：只读，固定到新的提交，确认没有未解决项。
3. **然后送 A 新开独立会话**，定向复核 Tasks 和 plan §7 的小改，并补全 checklist-v2「阶段说明」里的 I-01b 和 V-02。
4. **禁止启动 Implement**：要等 E-01～E-12 按对应证据逐项解除、§5 开工闸门全部满足之后才行。外部阻塞未解除时，Converge 只能报“未收敛（外部阻塞）”。