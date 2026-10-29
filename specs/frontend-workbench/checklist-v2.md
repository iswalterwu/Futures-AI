# Feature: frontend-workbench 质量检查清单 v2（checklist-v2.md）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求 / 设计质量达标，不代表实施完成。实施者不勾选本文件。
> **本文件是 frontend-workbench v2（spec v2.1，52 条 AC）当前有效的 Checklist。** 同目录 `checklist.md` 只是 v1（45 条 AC）的历史记录，按冻结 spec §4「历史 v1 Checklist 不修改」原则原样保留，其勾选不授权 v2；v2 未变部分的复用依据见本文件 I-03。
>
> **审核员**：A = `claude-fable-5-1` **via `anthropic`**（`--model anthropic/claude-fable-5-1`）。
> **通道原因**：协调器按 AGENTS §6 第 5 条对 `claude-bridge/claude-fable-5-1` 做最小真实探活，因额度 / 限流失败；同模型经 `anthropic` 成功。只换通道、不换模型，审核员身份不变；本限额窗口内不再重试 bridge。失败类别 = 通道额度或限流；本记录已脱敏。
> **独立性**：全新独立会话；Plan 作者为 `claude-opus-5-5` via anthropic，协调 / 集成人为 `openai/gpt-6.1-sol`，未来 Implement 按 AGENTS §6 路由（`openai/gpt-6-astra` 首选）——A 与三者均不同模型。单审（AGENTS §2 第 5 步），本文件结论即审核结论。
> **任务**：v2 Checklist 首轮（不是 Plan 作者、不是代码 Review、不是实施者；本轮无 Tasks / Implement）。
> **基线**：worktree `D:/2030/Futures-AI-workbench-v2-checklist`，分支 `review/frontend-workbench-v2-checklist`，固定审查提交 **`d2bf5a7`**（HEAD，进入前工作树干净）。冻结 spec v2.1 = `fec3556`（`git show HEAD:specs/frontend-workbench/spec.md` 与 `fec3556` 的 AC 集合逐字一致）。
> **真实 Plan 增量**：`git diff fec3556 d2bf5a7 -- specs/frontend-workbench/plan.md specs/README.md` = plan.md +320 / −0（页首 4 行 + 新 §7 共 316 行，§1～§6 零改动）、README.md 状态表本 feature 一行 1 +/1 −。
> **只读参照**：v1 实现以固定提交 `0ffa15e` 核对（`git show 0ffa15e:<path>`）；互动方（workbench-interaction）设计以固定提交 `8bd1b31` 核对；外部 worktree `D:/2030/Futures-AI-interaction` 的未提交 R3 / R4 变更**不作为**已审核交付，本轮未写入、未引用其内容。
> **只读审核**：未安装依赖、未运行项目测试、未启动应用、未调用其他 agent、未读取凭证或全局配置、未 commit / push；唯一写入文件为本文件。结构核验用只读 Python / git（见文末）。

**结论（首轮）：通过——无阻断项（V2-B：0）；建议 9 条（V2-S01～S09，不阻断、不计入判定）。允许进入 Tasks；不授权 Implement。** Implement 开工另需：(1) Tasks 头部登记 v1 完成 Review / Gate 2 / Handoff 并合入 main 的准确 SHA；(2) 各 S1 / S2 子阶段对应的生产方交接单元（plan §7.3 H-1～H-6）按固定 commit + 定向测试摘要交付并由集成人串行集成；(3) v2 Tasks 与 Analyze 产出后由 A 新开独立会话复核并在本文件「阶段说明」对应项补勾。

> **R2 结论（2026-10-28，定向复核，固定 HEAD `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`）：通过——V2-B 0 项；新增建议 V2-S10～S12（不阻断）。I-01b、V-02 由 A 补设正式复选框并勾选（见文末「R2 定向复核」）。本轮完成 Tasks / Analyze 质量复核，仍不授权 Implement：tasks §5 闸门 1（v1 Handoff SHA）与闸门 3（H-x 交接集成）全部未过。** 上方首轮（R1，审 `d2bf5a7`）全文保留为历史，其 V2-S01～S09 的落地核验见 R2-C01。
>
> **R3 当前有效结论（2026-10-28，恢复修订定向复核，固定 HEAD `b375b270a47d210823ae62da16438eeac17096db`）：通过——V2-B 0 项；新增建议 V2-S13～S15（不阻断）。I-01b、V-02 在 R3 基线上再次确认；R3-C01～R3-C08 为正式复选框（见文末「R3 定向复核」）。本轮只解除 tasks §5 闸门 2 的「A 定向复核」子项（待集成人把本文件提交 SHA 与固定对象 `b375b27` 登记进 tasks 1.1:387）；闸门 1 的 SHA 子项已满足（`43b6d79`），G-02 窄窗导航形态仍待 Walter 裁定，闸门 3（H-x 交接）全部未过——仍不授权 Implement。** R2 全文保留为历史，其 V2-S10～S12 的落地核验见 R3-C04。（R4 后为历史，见下段。）
>
> **R4 当前有效结论（2026-10-28，G-02 裁定落实定向复核，固定 HEAD `34ee7954d8aa26609c937dd6fcc7cc029baa2539`）：通过——V2-B 0 项；新增建议 V2-S16（不阻断）。I-01b、V-02 在 R4 基线上再次确认；R4-C01～R4-C11 为正式复选框（见文末「R4 定向复核」）。G-02 已由 Walter 裁定（“可以”）为九项单行 + 导航容器内部横滚 + 页面不横滚，执行 `UI_LAYOUT.md#narrow` 原规则，不改 52 AC、不新 ADR、不重过 Gate 1；本轮经真实源码核对 R8 F-01（P2）/ F-02（P3）已关闭。本通过解除 tasks §5 闸门 2「A 定向复核」子项对 `79b5212..34ee795` 增量的要求，并**限定放行 S0（T-V2-01 → T-V2-02）的内部设计闸门**（条件见 R4-C10：集成人登记本产物 SHA 与固定对象 `34ee795`、实施树快进、§5 四闸门逐项人工核对）；S1 / S2 因 H-x 四项交接全部未交付仍 blocked——不授权 S1 / S2，不宣称任何 AC 产品验证通过。** 上方 C-01「< 980 九项换行」、R3-O01 与 R3 结论 3(b) 的 G-02「待裁定」表述自 R4 起为历史，已被取代。

## 需求完整性

- [x] **N-01 每条编号需求至少有一条可验证的验收规则。** spec R-001～R-009 共 52 条 AC（6 / 8 / 9 / 6 / 9 / 4 / 5 / 3 / 2），编号连续；每条写明验证形态（自动 / 组件 / 端到端 / 契约 / 人工），跨 feature 集成项在条文内显式标注（AC-002-2 / 002-3 / 002-8 / 003-7 / 005-8）。脚本核验：spec AC 集合 = plan §7.11 集合，missing=[]、extra=[]。
- [x] **N-02 无未澄清歧义。** Q-023～Q-031 由 spec 页首「2026-10-28 Walter 批准 v2.1（Gate 1 通过，含 Q-023～Q-031）」闭环；Q-001～Q-022 为 v1 已裁定。spec:209–222 表头与各行仍保留「待 Walter 确认」字样，属冻结前的措辞残留，页首批准记录为准，不构成未闭环歧义（记 V2-S09，编辑性）。
- [x] **N-03 目标与非目标边界清晰。** spec §2：壳只补九项导航 / 固定轨道 / 投放挂载 / 对话上下文；作业页面、采集内容、阶段 / 编辑 / 版本 / 定稿、验证队列、格物致知内容、D-019 角色芯片均明确排除。plan §7.0 对 D-019 的「不顺手扩入」与 §7.5 对「验证提醒」的不显示均与非目标一致。
- [x] **N-04 spec 每条 what 在 plan §7 均有设计落点。** R-002 作业入口 / 格物致知占位 / 顶栏投放 / 九项顺序 / 作业详情高亮 → §7.4、§7.6；R-003 轨道位置 / 内容 / 三态 / 共享数据 / 点击进当前阶段 → §7.5；R-005 上下文捕获 / run 归属 / 按作业查看 / 旧消息有效 → §7.7；R-007 可选字段、不另升版本 → §7.8；R-009 M-09～M-12 → §7.12。唯一未细化处：§7.5 空态「原因」的来源（见 V2-S03），不影响落点存在。

## 一致性

- [x] **I-01 spec ↔ plan §7 无冲突（Tasks 尚不存在，I-01b 见阶段说明）。** 逐项：九项顺序（plan:346–356）= spec R-002；`/learning` 路由不改（plan:353）= D-018 §5 / spec Q-031；AC-002-3 改为共享 mock 作业驱动（plan:479）= spec Q-027；投放按钮文案与非阻塞（plan:404–415）= spec R-002 / AC-002-4 / AC-002-8；轨道不进模块库、不持久化、不推进阶段（plan:373–397）= spec R-003；`jobContext` 由生产方写入、壳只消费（plan:449–454）= spec §4 Q-029；`stores/app.ts` 最小派生修改（plan:301）不在 spec §4 壳文件清单内，但该文件亦不在互动方所有权内（`8bd1b31` plan:16），且改动是 AC-002-2「不再单列专题研究」的直接派生——**A 确认可接受**，条件：Tasks 显式列入修改范围并把 AC-002-7 进度断言按 3 步更新（plan:483 已写）。
- [x] **I-02 与 docs/ 决策与 ADR 无冲突。** D-011 结论 2（八项）已被 D-016 结论 9 变更为九项，plan §7.4 按 D-016 / designUI §3.1 ✓；D-015 三个涨跌位置不变，`JobTrack` 不引 `updown.css`（plan:380、476）✓；D-016 作业轨道为固定件非模块（plan:373）✓；D-018 「格物致知」命名 + `/learning` 不改 ✓、壳不涉「定稿」✓；D-019 运行时角色芯片 / 成本不在 52 AC，plan 不扩入 ✓；designUI §2.1 三层玻璃——轨道容器透明、卡片复用 `.glass-module`、投放抽屉与对话抽屉同为 `.glass-drawer`（plan:376–378、414）✓ §3.9「轨道不新增玻璃层级」✓；designUI §3.2 顶栏全局投放入口 ✓；interaction §3.3 R4 无模态——投放 slot 无遮罩 / 焦点锁 / `aria-modal`（plan:410）✓；interaction §7.2 作业内输入带上下文 ✓；AGENTS §6 开发路由与 D-019 运行时三档区分（plan:257）✓。
- [x] **I-03 v1 未变部分可复用的依据（不直接继承 v1 通过）。** (a) `git diff fec3556 d2bf5a7 -- plan.md` 对 §1～§6 零改动；(b) `git diff 2c2fbc8 fec3556 -- plan.md`（v1 Checklist 第四轮基线 → v2 基线）仅 39 行：D-013→D-015 重编号、删 `.prettierrc`（v1 S-08）、`check:x`→`check --only x` 记法（v1 S-14/S-15）、补「双语层级」一段与 `VITE_DATA_MODE` 一行、启动行补 `notice` 文案——均为编辑性或对 spec R-001 / R-007 / AC-002-7 既有要求的补述，不改设计；(c) spec 45 条 v1 AC 中 41 条文字与 `2c2fbc8` 逐字相同，AC-001-5 仅 D-013→D-015，AC-002-2 / 002-3 / 002-4 为实质修改（plan §7.11 已标「修改」）；(d) plan §7.11 对未变 AC 逐条写明 v2 回归点（glass / updown / colors 覆盖新文件、九路由、轨道与双抽屉不溢出、生成物对拍含新令牌）。据此 A 确认：v1 §1～§6 设计对 41 + 1 条未变 AC 继续有效，**但这是设计复用，不是实现证据**——v1 Review / Gate 2 / Handoff 尚未完成，实现证据以 Handoff SHA 为准。
- [x] **I-04 文件唯一写入者、生成物与回滚一致。** §7.2 表 ↔ 互动方 `8bd1b31` plan:16–17 所有权双向互补、无重叠（壳：app/5 文件、stores/app.ts、workbench/2 文件、agent/4 文件、tokens 源与 UI_DARK_ADDITIONS、壳测试、本 feature specs；互动方：jobs/**、contracts/**、agent/events.ts、contract-build、contracts 生成物、main.ts）；`package.json` / lock / 工具链两方不改；`specs/README.md` 各改本行由集成人串行合并；生成物只经 `pnpm -C frontend tokens` / `contract` 再生成（plan:304–311）；§7.12 精确回滚（`git revert` 壳提交、禁止整文件 `checkout`、不撤互动方改动）与 §7.2 一致并明确取代旧 §6 整删 `frontend/`。
- [x] **I-05 外部设计输入核对（固定 `8bd1b31`）。** 互动方 plan:36 `jobs/routes.ts` 导出 `jobs` / `job-detail`、`meta.navId:'jobs'`、`main.ts` `addRoute`、不改 `app/router.ts` = plan §7.4 / H-3 ✓；plan:92 `JobContext={jobId,stage}`、`SendMessage.jobContext?`、十类事件公共可选字段 = H-1 ✓；plan:81 导出 `JobStatusLabel / StageLabel / StageStateLabel`，**无 `JobTypeLabel`**——plan H-2 如实标「还缺」✓；plan:61 `jobsStore` 只有「当前作业、阶段工作区视图缓存」——plan H-2 如实标「共享未筛选缓存尚不存在」✓；plan:64 `sessionStore` 仅「当前作业 / 阶段上下文，内存」、未定清空时机——plan H-4 补约束 ✓；plan:34 / :62 `IntakeDrawer` 非模态、`intakeStore` 开关——plan H-5 补 `open(jobId?)` 快照与几何约束 ✓；plan:153–155 `empty / slow / error` 未覆盖 `listJobs`——plan H-6 补 ✓。plan §7.3 对「尚不存在的部分」的识别与固定提交内容一致，没有把占位或未交付项当成已集成。
- [x] **I-06 外部审核状态表述。** `8bd1b31` 提交内 `checklist.md` 当前有效轮次为 **R2 通过**（审查对象 `630e06f`）；plan §7.0 所述「R3 未通过、B-09 / B-10」来自外部 worktree 未提交内容，本轮不作证据。plan 的处置——「外部交接未就绪、以互动方最新有效审核为准、壳不代修」——在两种状态下都成立；且 R2 审查的是 `630e06f`，不含 H-2 / H-4 / H-5 / H-6 新要求，故不能以 R2 通过视为依赖已就绪。plan 结论正确；Tasks 登记交接时须引用外部 checklist 的**已提交** SHA（V2-S01）。

## 可测试性

- [x] **V-01 52 条 AC 每条可映射到自动测试或人工验收步骤，且被映射的设计存在。** 逐条见下表；集成类 AC 的 `blocked_by` 均指向具体交接单元，不以占位充数。
- [x] **V-03 新增测试与新尺寸有明确落点。** 新文件 `tests/component/job-track.spec.ts`、`tests/unit/agent-context.spec.ts`、`e2e/integration-v2.spec.ts`（plan:307）；既有修改文件 `tests/component/{topbar,timeline}.spec.ts`、`tests/unit/manual-acceptance.spec.ts`、`e2e/{shell,workbench,modules,breakpoints,agent}.spec.ts` 在 `0ffa15e` 全部存在（已核 `git ls-tree`）；新令牌 `layout.intake_width` 的 `source` 指向 `design/ui/UI_DARK_ADDITIONS.md#drawer`，该锚在 `0ffa15e` 存在（`<a id="drawer">` :107），满足 AC-008-2 可解析要求；生成变量名 `--fai-layout-intake-width` 与 §7.6 用法一致。
- [x] **V-04 验证命令形式与 v1 约定一致。** `pnpm -C frontend test:unit -t "AC-xxx"` / `test:e2e -g "AC-xxx"` / `check [--only]` / 全量 `test`（plan:505–511）与 v1 tasks「测试标题以 AC 编号开头」约定相同；plan:512 明确这些命令本轮未运行、不是证据。

## 工程准则（AGENTS §5）专项核查

- [x] **P-1 不为猜测场景加复杂度、不悄悄扩大范围。** 无 overlay 管理器、无轮询、无事件总线、无第二套状态机（plan:397、416）；避让只用一个局部 CSS 变量（plan:417–418）；`runsFor` 只一个可选参数、不做「仅全局」筛选（plan:437–440）；单会话、运行中禁止再发不扩成多路并行（plan:446）；D-019 芯片、验证提醒、中止交互均未扩入。焦点移入 slot / 关闭回按钮（plan:411）是非模态面板的最小键盘可达，不属无障碍专项，可接受。
- [x] **P-2 外部数据只在入口层校验。** 契约 parse 仍只在 mock / real 实现边界（旧 §2.7，§7.8 未改）；壳对 store 已确定类型的值直接消费（plan:382–385、390）。
- [x] **P-3 不提前抽只用一次的抽象。** `JobTrack` 对应 designUI §3.2 具名固定件；`runsFor` 有抽屉选择器消费；chip 为两处复用（输入栏 / run 头）；无新共享组件。
- [x] **P-5 自动生成的文件不手改。** tokens 生成物与 contracts 生成物各由唯一拥有者经脚本再生成（plan:304、309–310、424–425）；`check --only generated` 继续对拍（plan:476、496）。
- [x] **P-6 测试测真实实现、少用 mock。** AC-003-7 组件测试用真实 Pinia + 互动方真实 `jobsStore` + 真实 mock `dataClient`，只在系统边界注入、不 `vi.mock` 内部模块、不抄业务逻辑（plan:487）；AC-005-9 用真实 mock `AgentClient` + fake timers（plan:494）——已核 `0ffa15e` mock `send` 无并发守卫、每次调用独立 `runId` 并经 `setTimeout` 回放，交错回放在 store 层可行。
- [x] **P-7 按仓库现有流程、不引入未在用工具。** 栈、脚本、六项 check、命令形式全部沿用 v1；交接单元 = 固定 commit + 定向测试摘要（plan:321–323）与 AGENTS §6 第 7 条工作树纪律一致。

## 其他自定义项（本轮特别核查）

- [x] **C-01 九项导航。** 顺序、路径、占位 owner（plan:346–356）= spec R-002 / designUI §3.1；删 `research` 项与 `/research/:id?` 特例、旧 URL 落兜底页（plan:357–361）；`aria-current` 规则 `page` / `location` 且全局唯一（plan:364–366）覆盖「作业详情仍高亮作业」；< 980 九项换行不溢出（plan:367）纳入 AC-002-6 回归。已核 `0ffa15e` `router.ts` 由 `navItems` 生成具名路由、`Rail.vue` 以 `route.meta.navId` 判当前项，方案可直接落地。 **R4 补记（固定 `34ee795`）：本条“< 980 九项换行不溢出”已被 Walter 2026-10-28 的 G-02 裁定取代——窄窗为九项单行、导航容器内部横向滚动、文档不横滚（plan §7.4:387–392）；以文末 R4-C02 / R4-C06 / R4-C09 为准，本条其余内容（顺序 / 路径 / `aria-current` / 旧 URL 兜底）不变。**
- [x] **C-02 JobTrack：共享数据 / 三态 / 写回执刷新。** 数据 = 互动方 `jobsStore` 未筛选缓存 + 「进行中」selector / 常量（plan:382–385），壳不持副本、不从阶段状态推断（plan:384–386）；三态读 store 读状态与错误、错误诊断 `{source:'job-track',code,message,ts}` 可复制、重试调共享 refresh（plan:391–396）；刷新只靠 H-2 ⑤ 写回执 / agent 通知重读同一缓存，壳不 watch、不轮询（plan:397–400）；点击 `router.push({name:'job-detail', params:{id, stage: currentStage}})` 不推进阶段（plan:390）。AC-003-7 关键用例「轨道挂载、无终态、调互动方写 action → 角标 / 顺序自动变化且与 selector 一致、不手动重读」（plan:487）直接验证「共享一份数据」。
- [x] **C-03 投放：唯一非模态挂载 / 上下文快照 / 双抽屉几何。** 唯一挂载点 `AppShell .route-area > aside.intake-slot`（plan:408–413）；`intake.open(session.context?.jobId)` 打开时快照、路由变化不改写、非作业页为 `undefined`（plan:405–407）；无遮罩 / 焦点锁 / `aria-modal`（plan:410）；宽 `min(--fai-layout-intake-width, 50%)`、`z` 用既有 `--fai-z-drawer`（plan:409）；对话抽屉经继承的 `--shell-intake-offset` 改 `inset-inline: 0 var(--shell-intake-offset, 0)` 让位（plan:417–418）。已核 `0ffa15e`：`AppShell .content` 三行（顶栏 / `main.route-view` / `footer.dock-slot`），`AgentDrawer` 为 `.agent-dock` 内 `position:absolute; inset-inline:0; bottom:100%`，CSS 变量沿 `.content → footer → .agent-dock → .agent-drawer` 继承可达；slot 限于第二行，底栏输入栏不被覆盖；960 下 `min(24rem, 50%)` = 384px，两面板并排不溢出。
- [x] **C-04 发送快照 / 历史 run 归属 / 按作业筛选。** `send` 在第一个 `await` 前同步读 `sessionStore.context`（plan:430）；无上下文时 payload 不出现该键、形状同 v1（plan:432）；run 归属来自 `run.started` 事件本身、此后不变（plan:434）；`receive` 不过滤不丢事件（plan:435）；`runsFor(jobId?)` + 抽屉本地选择器（plan:437–441）；离开作业由 H-4 同一次导航内同步清空（plan:468）。已核 `0ffa15e` `agent/store.ts`：`run.started` 以 `{...event, steps:[], terminal:null}` 建 run，事件带 `jobContext` 即自然绑定；`send` 现为 `agentClient.send({sessionId, message})`，加可选键即可。
- [x] **C-05 十类旧事件兼容 / 唯一终态 / 模块角标。** 十类事件与 `eventFields` 公共字段模式（`0ffa15e` `events.ts`）支持以一处可选字段扩展全部类型；plan §7.7 明示角标、`running`、唯一终态「全局有效、不按作业拆分」（plan:436）；AC-005-9 同时断言无上下文脚本照旧、角标不变、每 run 恰一个终态（plan:494）；AC-007-5 兼容证据归生产方契约测试，壳不代勾（plan:454、496）。
- [x] **C-06 文件唯一写入者与生成物。** 见 I-04；`stores/app.ts` 派生修改已确认（I-01）；`frontend/src/agent/events.ts` 虽在壳目录下仍归互动方（plan:309），两方所有权文件一致。
- [x] **C-07 实施前置与交接切片无环。** 链：v1 Handoff SHA → 互动方 A～G（只依赖 v1）→ 壳 S1-ctx / S1-track / S1-intake（各依赖对应 H 单元）→ 互动方 H 组（依赖壳 S1）→ 壳 S2（依赖全部 S1 + H-3 + 页面 / IntakeDrawer 集成）。互动方 `8bd1b31` plan §1.1 / §8 的 H 组 `blocked_by: frontend-workbench-v2` 与此互补；交接不要求对方先 Handoff 合 main（plan:325），避免了「互相等合 main」的环。无环成立。
- [x] **C-08 外部实施 blocked 与本轮设计阻断已区分。** plan §7.11 / §7.13 把集成类子项标 `blocked_by H-x`，并要求外部阻塞未解除时 Converge 报「未收敛（外部阻塞）」（plan:542）；本清单未因外部 feature 未 Handoff 判本 Plan 失败，也未发现 Plan 自身设计闭环缺口。
- [x] **C-09 不制造未经需求支持的安全 / 竞态复杂度。** 上下文「不赋予 agent 推进阶段或覆盖产物能力」只是重申 spec（plan:447），无新机制；H-4 同步清空是对竞态的最小约束且由 AC-005-8 覆盖，而非新增代码层。

### 逐 AC 设计 → 验证落点映射（52 条；「设计」= 本轮判定，「实现证据」= 当前状态）

| AC | 类型 | 设计落点 | 验证落点（plan §7.11） | 设计 | 实现证据 |
|---|---|---|---|---|---|
| AC-001-1、AC-001-2、AC-001-3、AC-001-4、AC-001-6 | 不变 | 旧 §2.1 / §2.8 | 旧 §5 + v2 回归：001-1 generated 对拍含 `layout.intake_width`；001-2 / 001-6 colors 扫新文件；001-3 glass 只许三类（slot 无玻璃、IntakeDrawer 根 `.glass-drawer`）；001-4 字族规则对 chip / 轨道卡片沿用 | ✓ | 无（待 v1 Handoff + S0/S1） |
| AC-001-5 | 不变（D-013→D-015 编辑性） | 旧 §2.1 updown 三条 grep | `check --only updown`：轨道不得引用 | ✓ | 无 |
| AC-002-1 | 不变 | 旧 §2.2 | `shell.spec` 回归 | ✓ | 无 |
| AC-002-2 | 修改；部分集成 | §7.4 | 壳：`shell.spec` 九项 / href / `aria-current` / 占位 owner / 直达刷新含 `/jobs` `/learning` / 无 `.research-link`；集成：`integration-v2` `/jobs/:id/:stage` 直达刷新高亮作业、名为 `jobs` 路由唯一（blocked_by H-3） | ✓ | 无 |
| AC-002-3 | 修改；集成 | §7.3 H-3 / H-6 | `integration-v2`：`jobFixtures` 新增 → `/jobs` 可见可进（blocked_by H-3 / H-6） | ✓ | 无 |
| AC-002-4 | 修改 | §7.6 TopBar 按钮 | `topbar.spec`：原断言 + 按钮可见、文案「投放」、发出 `intake` | ✓ | 无 |
| AC-002-5 | 不变 | 旧 §2.2 | `shell.spec` | ✓ | 无 |
| AC-002-6 | 不变 + 回归 | §7.5 轨道一行 / §7.6 双抽屉 | `breakpoints.spec` 十视口 + 轨道无溢出 + 960 / 1440 双开无溢出 | ✓ | 无 |
| AC-002-7 | 不变（回归更新） | §7.2 `stores/app.ts` 3 步 | `shell.spec` 进度 / 文案更新、`boot-error` 不变 | ✓ | 无 |
| AC-002-8 | 新增；集成 | §7.6 / §7.10-1 | `integration-v2`：四页同一 `.intake-slot`、快照 jobId、`long` 中关闭：URL / runId 不变、步骤不重复（blocked_by H-4 / H-5 / IntakeDrawer） | ✓ | 无 |
| AC-003-1、AC-003-2、AC-003-3、AC-003-4、AC-003-5 | 不变 | 旧 §2.3 | `focus-band.spec` / `workbench.spec`；003-5 另有人工 M-03 | ✓ | 无 |
| AC-003-6 | 不变 + 回归 | §7.5 | `workbench.spec` 增删模块后焦点带与轨道都在 | ✓ | 无 |
| AC-003-7 | 新增；部分集成 | §7.5 / §7.3 H-2 | 组件 `job-track.spec`（真实 store + 写 action 自动刷新）；集成 `integration-v2`（投放归属 → 轨道更新 → `/jobs` 一致 → 点卡进当前阶段，blocked_by H-3 / H-5） | ✓ | 无 |
| AC-003-8 | 新增 | §7.5 | `workbench.spec` + `modules.spec`：DOM 顺序 Focus→Track→Grid、模块库无轨道、无移除 / 排序、增删移刷新后位置不变 | ✓ | 无 |
| AC-003-9 | 新增 | §7.5 三态 / H-6 | `job-track.spec`：`slow` / `empty`（含 `/jobs` 入口）/ `error`（诊断可复制、重试调共享 refresh）；焦点带与模块区独立 | ✓ | 无 |
| AC-004-1、AC-004-2、AC-004-3、AC-004-4、AC-004-5、AC-004-6 | 不变 | 旧 §2.4 / §2.8 | 旧 §5；004-1 / 004-2 与 AC-003-8 共用回归（增删移后轨道位置不变）；004-3 页面遍历不把轨道卡片当模块（卡片只复用 `.glass-module`，不用 `section.fai-module`）；004-6 grid 守卫覆盖轨道样式 | ✓ | 无 |
| AC-005-1 | 修改（路由数） | §7.4 | `agent.spec` 九路由输入栏可见 | ✓ | 无 |
| AC-005-2、AC-005-3、AC-005-4、AC-005-5、AC-005-6、AC-005-7 | 不变 | 旧 §2.5（§7.7 明示两档高度、时间线、角标、引导跳转、唯一终态不变） | `timeline.spec` / `agent.spec`，v1 无上下文脚本全部照旧通过（S1-ctx 回归） | ✓ | 无 |
| AC-005-8 | 新增；部分集成 | §7.7 / §7.10-3、-4 | 单元 `agent-context.spec`（快照 / 无键 / `run.started` 绑定 / sessionStore 变化不改旧 run）；端到端 `integration-v2`（`/jobs/:id/analyze` `long` 发送 → 切阶段切页 chip 不变 → 全局发送「全局」，blocked_by H-1 / H-3 / H-4） | ✓ | 无 |
| AC-005-9 | 新增 | §7.7 | `agent-context.spec` 交错回放 A / B / 无上下文：`runsFor` 正确、`receive` 全收、角标不变、每 run 一终态；`timeline.spec` 选择器与 chip | ✓ | 无 |
| AC-006-1、AC-006-2、AC-006-3、AC-006-4 | 不变 | 旧 §2.6 | 旧 §5：`theme.spec` / e2e `theme.spec`；M-08 | ✓ | 无 |
| AC-007-1、AC-007-2、AC-007-3、AC-007-4 | 不变 | 旧 §2.7 / §2.8 | 旧 §5；007-1 network 守卫覆盖新文件；007-2 壳 e2e 继续用 normal / empty / error / slow；007-3 2.0.0 生成物由生产方重生成、壳 `check --only generated` 回归；007-4 fixtures 过 schema 由生产方维护 | ✓ | 无 |
| AC-007-5 | 新增；生产方证据 | §7.8 / H-1 | 互动方契约测试三点；壳全量回归只作参与证据，未见生产方证据不得勾 | ✓ | 无 |
| AC-008-1、AC-008-2、AC-008-3 | 不变 | 旧 §2.9 + §7.6 新令牌登记 | `design-registry.spec`；008-2 新令牌 `source` 可解析（锚 `#drawer` 已存在）；008-1 / 008-3 不受 v2 影响 | ✓ | 无 |
| AC-009-1 | 不变 | §7.12 全量命令 | `pnpm -C frontend test` 全绿；只有集成后全量结果算 v2 证据 | ✓ | 无 |
| AC-009-2 | 不变 + 扩充 | §7.12 M-09～M-12 | `manual-acceptance.md` + `manual-acceptance.spec` 同步；Handoff 截图 | ✓ | 无 |

## 阻断项（V2-B）

无。

## 建议（V2-S；不阻断、不计入判定；建议在 Tasks 起草时落实或登记）

| # | 位置 | 建议 |
|---|---|---|
| V2-S01 | plan §7.3 / `specs/README.md` 跨 feature 待同步事项表 | H-2 ①～⑤（共享未筛选缓存、ensure / refresh、进行中判定、筛选不覆盖、写回执覆盖面、`JobTypeLabel`）、H-4（同一次导航内同步清空）、H-5（`open(jobId?)` 快照与几何约束）、H-6（场景覆盖 `listJobs`、角标 fixture）都是对互动方 Plan 的**新增要求**，而 `8bd1b31` 不含它们。本次 README 仅改状态行、未在「跨 feature 待同步事项」表登记；建议集成人补一行（来源 = 本 feature plan §7.3，影响 = workbench-interaction），并要求 Tasks 登记交接时引用外部 checklist 的已提交 SHA，而非移动工作树。 |
| V2-S02 | plan:334 H-2 ③、plan:383 | 「进行中」集合未定义，而它直接决定 AC-003-7 轨道显示哪些作业。建议 Plan 写明壳的最低期望（待人工确认 / 冲突等待介入状态必须在集合内，终结态不在），具体枚举由生产方契约常量定义并进 CONTRACT.md；避免 AC-003-7 的「与 selector 一致」退化为同义反复。不新增产品需求，属把 spec「进行中作业」落成可断言口径。 |
| V2-S03 | plan:394 | 空态「显示『暂无进行中的作业』和原因」：`JobListItem[]` 没有 `reason` 字段，原因来源未定。建议区分「列表为空」与「有作业但无进行中」两种静态文案，或由 Tasks 定清；不要为此在契约加字段。 |
| V2-S04 | plan:390、§7.13 S1-track | S1-track 「可以独立开启」，但卡片点击 `router.push({name:'job-detail'})` 在 H-3 集成前是未注册具名路由，运行时会抛错。Tasks 应写明点击只在 S2 验证、S1-track 不是可展示状态；或改为按 path push（落兜底页不抛错）——二选一登记，不加 `hasRoute` 兜底。 |
| V2-S05 | plan:493 AC-005-8 端到端 | `AgentDock` 在 `agent.running` 时禁用发送（`0ffa15e`），`long` 脚本 12 s 后才终态；「之后的全局发送」必须等前一 run 终态后再发。Tasks 的步骤顺序与等待条件写明，避免 e2e 偶发。 |
| V2-S06 | plan:430 | `agent/store.ts` 将导入互动方 `sessionStore`，而互动方 `jobs/**` 复用 `agent/store.ts`（`8bd1b31` plan:55），存在模块级双向 import。`useSessionStore()` 在 `send` 函数体内调用即可避免顶层求值循环；Tasks 加一句约束，不引入额外抽象。 |
| V2-S07 | plan:388 | 「优先复用互动方已交接的 `JobStatusBadge`」中「优先」语义不明：未交接时是 blocked 还是用 `JobStatusLabel` 文案直出？按 §7.3 原则应为「交接前 blocked、壳不自建映射」；建议改词为「复用」并列入 S1-track 依赖（可归入 H-2 交接单元）。 |
| V2-S08 | plan:353 | 格物致知占位 `placeholderOwner='learning'`：仓库尚无名为 `learning` 的 feature（docs/plan.md §8 为 Phase 2C 格物致知）。占位文案建议写「格物致知（learning，Phase 2C）」类可追溯表述；不影响 AC-002-2。 |
| V2-S09 | spec:209、215–222；plan §7.1 | 编辑性：spec v2 裁定表仍写「待 Walter 确认」（页首已记批准，spec 冻结不改，Tasks 引用时注明以页首为准）；plan §7.1 「§5 验收」行只列 5 条落点被取代，实际 §7.11 还为 002-6 / 003-6 / 003-8 / 001-x / 007-x / 009-2 加了回归或扩充——以 §7.11 为准即可，建议 §7.1 加「其余回归见 §7.11」字样。 |

## 阶段说明（不设复选框；后续由 A 新开独立会话复核并补勾）

- **I-01b spec / plan / tasks 无冲突（Analyze）**：v2 tasks.md 尚不存在，Analyze 未发生。Tasks 产出后由 A 复核。复核要点：v2 任务不得修改或勾选 v1 历史任务，但须**显式声明取代**与 v2 冲突的 v1 完成标准——T-08.1 / T-08 上下文「八项菜单」（tasks:115、119）、T-08.5「专题研究子项由研究列表驱动」（tasks:123）、T-13.1「八路由」（tasks:203）、T-15.2「M-01～M-08 八项」（tasks:238）、T-08 `stores/app.ts` 状态文案；旧 tasks 不得当 v2 任务生效。 **R2 确认（HEAD `949a232`）：已复核通过，正式复选框见文末「R2 定向复核」I-01b。** **R3 确认（HEAD `b375b27`）：恢复增量（R3 / R4 合并 / R5 / R6 修正 / R7）复核后仍成立，见文末 R3-C03、R3-C06。**
- **V-02 任务粒度与验证命令满足 tasks.md 模板要求**：Tasks 产出后由 A 复核——每条完成标准引用 AC 编号、验证命令一一对应、0.5–2 h、依赖无前向无环；S1 / S2 任务显式 `blocked_by: H-x`（指向固定交接 SHA）；头部登记 v1 Handoff SHA 与集成验证分支名；AC-002-8 / 003-7 / 005-8 集成子项不得由占位任务「完成」。 **R2 确认（HEAD `949a232`）：已复核通过，正式复选框见文末「R2 定向复核」V-02。** **R3 确认（HEAD `b375b27`）：12 任务 / 22.0 h、T-V2-01 6/6 等结构复算通过，T-V2-01 工时（R6 O-1）判定见文末 R3-C07。**
- **P-4 主函数只写正常流程（§5.4）**：代码级准则，Review 阶段核 `JobTrack` 三态分支、`AppShell` 投放事件处理、`send` 快照与 `receive` 绑定。
- **AC-009-1 命令输出 / AC-009-2 截图 / AC-007-5 生产方证据**：属 Implement / Handoff 证据，当前不声称。
- **Implement 前置**：本文件当前有效复选框全部勾选，但开工另需 (1) Tasks 经 A 复核补勾；(2) Tasks 头部登记 v1 Handoff SHA；(3) 各子阶段的 H-x 交接单元以固定 commit + 定向测试摘要交付并由集成人集成；(4) 外部阻塞未解除时 Converge 必报「未收敛（外部阻塞）」，不得报全量。 **R2 补记**：(1) 已由 R2 完成（tasks §5 闸门 2 的 (b) 明确通过记录 = 文末 R2 节；(a) 以本文件被集成人提交后的 SHA 登记进 tasks 1.1:304）；(2)(3)(4) 仍未满足，12 个 v2 任务全部 blocked。 **R3 补记（HEAD `b375b27`）**：(2) 已满足——v1 Handoff SHA `43b6d79` 已登记（tasks 1.1:381）且在 main 上；(1) 的恢复增量部分由文末 R3 节完成，待集成人登记本文件提交 SHA；(3) 仍未满足（tasks 1.2 八个交接单元全部「未取得 / 未交付」）；(4) 不变；另增 G-02（窄窗导航形态）待 Walter 裁定，裁定前 T-V2-01 不开工。12/12 任务仍 blocked。 **R4 补记（HEAD `34ee795`）**：G-02 已裁定并落实、经独立 R9 确认；(1) 的 G-02 增量由文末 R4 节完成，S0 内部设计闸门限定放行（R4-C10），待集成人把本产物 SHA 与固定对象 `34ee795` 登记进 tasks 1.1:395；(3) 仍未满足（tasks 1.2 八行「未交付」），S1 / S2 blocked；(4) 不变。登记完成并逐项核对 §5 闸门前，12/12 任务仍 blocked。

## 结构核验证据（只读内存脚本 + git，未写文件、未安装依赖）

```text
HEAD = d2bf5a7（branch review/frontend-workbench-v2-checklist，git status 干净）
DIFF fec3556..d2bf5a7  plan.md: 320 +/0 −（hunks @@-2,6 页首、@@-237,3 §7）；README.md: 1 +/1 −（本 feature 行）
DIFF 2c2fbc8..fec3556  plan.md 39 行：D-013→D-015 ×3、删 .prettierrc、check:x→--only x ×9、+双语层级段、+VITE_DATA_MODE 行、启动行 +notice
SPEC_AC  v2.1 = 52（6/8/9/6/9/4/5/3/2）；HEAD == fec3556；vs 2c2fbc8：unchanged 41、changed 4（001-5 仅编号、002-2/002-3/002-4 实质）、added 7、removed 0
PLAN_7_11  AC 集合 = 52，missing=[]，extra=[]
PLAN_ANCHORS  §7.0:249 §7.1:281 §7.2:296 §7.3:317 §7.4:342 §7.5:371 §7.6:403 §7.7:428 §7.8:449 §7.9:456 §7.10:463 §7.11:470 §7.12:502 §7.13:528 §7.14:546（共 559 行）
V1_0ffa15e  AppShell .content 三行 ✓；AgentDrawer absolute/inset-inline:0/bottom:100% ✓；agent/store run.started 建 run ✓；stores/app.ts 4 步 + 研究列表文案 ✓；router 由 navItems 生成具名路由 ✓；Rail 用 meta.navId ✓；TopBar 仅 props ✓；events.ts eventFields 公共字段 ✓；mock send 无并发守卫、独立 runId ✓；UI_DARK_ADDITIONS #drawer 锚 ✓；check.mjs glass 三类 / updown 三条 / network 一条 ✓；5 个既有 e2e 与 3 个既有组件 / 单元测试文件存在 ✓
EXT_8bd1b31  checklist 当前轮次 = R2 通过（审 630e06f）；plan:16 所有权、:36 routes/addRoute、:61 jobsStore、:64 sessionStore、:81 Labels（无 JobTypeLabel）、:92 JobContext、:153–155 场景（无 listJobs）、§7 前置清单、§8 H 组 blocked_by v2 ✓
未运行：pnpm / vitest / playwright / 应用；未读取外部 worktree 未提交内容
```

## 结论与下一步

1. **通过（设计质量）**：0 项阻断、9 条建议。plan §7 对 52 条 AC 的设计落点与验证落点完整、与冻结 spec v2.1 及 docs / ADR 无冲突；接口边界（壳只消费、不代写互动方 schema / mock / jobs / main）与交接切片无环；外部阻塞与设计阻断已区分。
2. **允许进入 Tasks**：Tasks 起草时落实 V2-S01～S08（S09 编辑性可顺手）；v2 任务基于 plan §7，不改 v1 历史 tasks / checklist。
3. **不授权 Implement**：前置见「阶段说明」；v1 Handoff SHA 与 H-1～H-6 交接单元未就绪前不得以 `fdaa7d8` / `0ffa15e` 开工，也不得用占位宣称集成 AC 通过。
4. 若后续 Plan 因 Tasks / Analyze 发现需修改 §7 实质设计（非编辑性），回到本文件由同一模型新开独立会话定向复核；审核员切换只在调用失败时按 AGENTS §6 回退。
5. 本轮只写本文件；未修改 spec / plan / tasks / 旧 checklist / docs / README，未 commit。本文件勾选是需求 / 设计质量证据，不是实现验收证据。

---

# R2 定向复核（Tasks / Plan §7 细化 / Analyze F-01～F-07）——R3 前有效（结论由文末 R3 延续，本节保留为历史）

> **审核员**：A = `claude-fable-5-1` **via `anthropic`**（`--model anthropic/claude-fable-5-1`）。**通道原因**：同模型 `claude-bridge` 最小真实探活在本限额窗口因额度 / 限流失败，`anthropic` 探活成功；只换通道、不换模型，本窗口不重复试 bridge。失败类别 = 通道额度或限流；本记录已脱敏，不含鉴权报错。
> **独立性**：全新会话；独占 worktree `D:/2030/Futures-AI-workbench-v2-tasks-review`，分支 `review/frontend-workbench-v2-tasks`，进入前 `git status` 干净。A 不是 Plan / Tasks / Analyze / 修正的作者（均 `claude-opus-5-5` via anthropic），不是协调集成人（`openai/gpt-6.1-sol`），不是未来实施者（`openai/gpt-6-astra` 首选）；单审，本节结论即审核结论。
> **任务**：Checklist R2 = 对 Tasks（T-V2-01～12）、随 Tasks 落盘的 plan §7 小改、Analyze R1 修正与 R2 结论做定向复核，并补记 I-01b / V-02。R1 只覆盖 `d2bf5a7` 的 plan §7。
> **固定基线**：HEAD = `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`（`git rev-parse HEAD`）。冻结 spec v2.1：`git diff --quiet fec3556 949a232 -- spec.md` 为空，52 条 AC 不变。
> **真实 diff 三层**：(1) Tasks + Plan 细化 `git diff a8ab444 b364971 -- specs/frontend-workbench/{plan,tasks}.md specs/README.md`：plan 14 + / 14 −（§7.0 / 7.1 / 7.3 / 7.5 / 7.7 / 7.11 / 7.13 共 8 个 hunk，§1～§6 零改动）、tasks 518 + / 0 −（页首 +7 行 + 末尾追加 v2 段）、README 2 / 2；(2) Analyze R1 修正 `git diff b364971 6bda6c9 -- specs/frontend-workbench/{plan,tasks,analyze-v2}.md specs/README.md`：plan 10 / 8、tasks 42 / 27、analyze-v2 +125、README 2 / 2；(3) `git diff 6bda6c9 949a232`：README 1 / 1、analyze-v2 +8、analyze-v2-r2 +82（新增）、plan 页首 2 / 1、tasks 页首 + 1.1 + 闸门 4 共 9 / 4——纯状态记账，无技术设计变更。`a8ab444..949a232` 下 `spec.md` / `checklist.md` / `checklist-v2.md` / `docs/` / `AGENTS.md` / `frontend/` 零改动。
> **只读参照**：v1 固定历史参照 `0ffa15e`（`git show 0ffa15e:<path>`）、互动方固定设计 `8bd1b31`；未读取任何外部 worktree；没有生产方已交付的 H-x SHA，也没有 v1 Handoff SHA（两者在 tasks 1.1 / 1.2 均为「未取得」）。
> **只读审核**：未安装依赖、未运行 pnpm / vitest / playwright / 应用、未调用其他 agent、未读取凭证或全局配置、未 commit / push；唯一写入文件为本文件。结构核验用 git 只读 + 内存 Python（stdin，不落盘），结果见文末 R2 证据块。

**R2 结论：通过——阻断 V2-B：0；新增建议 V2-S10～S12（不阻断、不计入判定）。I-01b、V-02 正式勾选。完成 Tasks / Analyze 质量复核；仍不得 Implement，直到 tasks §5 闸门 1（v1 Handoff SHA 在 main 上）与闸门 3（本任务所需 H-x 已按四项登记集成）满足。本通过只解除闸门 2 中「A 定向复核」这一内部审核项，不授权跳过 v1 Handoff 或任何 H-x 交接。**

## R2 正式复选框

- [x] **I-01b spec / plan / tasks 无冲突（Analyze 复核；固定 `949a232`）。** 依据：
  - (a) **spec 冻结未动**：`fec3556..949a232` spec 零改动；tasks 1.1:295「AC 集合与 `fec3556` 一致」属实；V2-S09 按建议处理——spec 不改、tasks 1.1 注明以页首批准为准、plan:294 补「其余回归见 §7.11」。
  - (b) **spec ↔ tasks 逐 AC**：tasks §7 矩阵（:705–765）52 行、无重复无遗漏；12 个任务完成标准引用的 AC 并集 = 52（missing = []、extra = []）；矩阵里每个「T-V2-xx#n」都指向确实写有该 AC 的那条标准（bad refs = []）。spec 标注跨 feature 集成的 5 条 AC（002-2 / 002-3 / 002-8 / 003-7 / 005-8）全部落在 T-V2-09 / T-V2-10，blocked_by 指向具体 H-x 与页面切片（tasks:610、:636）；S0 / S1 任务不宣称集成——T-V2-01#1「`/jobs` 占位 owner 子断言仅作 S0 证据」（:428）、T-V2-02「不宣称满足 AC-002-8」（:443）、T-V2-07#4「只提供实现，不验收」——与 spec §2 非目标 / §4「不能把占位路由视为已验收」一致。spec R-003 三态、点击进当前阶段、不持第二套状态 ↔ T-V2-05 / 06；R-005 快照 / 归属不变 / 按作业查看 / 旧脚本有效 ↔ T-V2-03 / 04；R-002 投放快照与关闭不中断 ↔ T-V2-07 / 10；R-009 M-09～M-12 ↔ T-V2-02#3 / T-V2-12#3。
  - (c) **plan §7 ↔ tasks**：§7.2 写入者表（含新增 `PlaceholderPage.vue` 行 plan:305）↔ tasks §4（:383）互补一致；§7.3 H-1～H-6（plan:337–342）↔ tasks 1.2（:317–324）逐条同文（含 F-04 写 action、F-05 公开设置方式、F-06 整集合替换）；§7.4 `aria-current` page / location 全局唯一（plan:371）↔ T-V2-01（:418）并与 T-V2-09#1（详情 = location）/ #4（`/jobs` = page）互洽；§7.5（plan:395–402）↔ T-V2-05 / 06；§7.6 ↔ T-V2-07；§7.7（plan:434–441）↔ T-V2-03 / 04；§7.11 ↔ 矩阵（矩阵为超集，差异只在 `typecheck`，见 R2-C03 O-1）；§7.13 S0 / S1-ctx / S1-track / S1-intake / S2（plan:536–540）↔ 各任务 blocked_by（T-V2-04 / 07 经依赖继承，见 O-3）。
  - (d) **旧 v1 任务未改写**：T-01～T-15 正文、勾选状态与 45 条「AC 覆盖」表与 `a8ab444` 逐字相同（从「## 约定」到 v2 段之前区间 diff 为空）；页首只追加 7 行记录、未改旧句。与 v2 冲突的 T-08 上下文 / #1 / #2 进度 / #5、T-13#1、T-15#1 / #2、T-06 / T-07、`main.ts` 在 tasks §2（:338–357）逐项显式覆盖，R1 阶段说明列出的五处全部命中；契约 / `jobs/**` / `main.ts` 归互动方（tasks:353、:397）。
  - (e) **Analyze**：R2 报告（`analyze-v2-r2.md`，固定 `6bda6c9`）的「F-01～F-07 全部关闭、无新增 F」经本轮独立逐项核对成立（R2-C02）；`6bda6c9..949a232` 只有状态记账。本轮未发现新的 spec / plan / tasks 冲突。
- [x] **V-02 任务粒度与验证命令满足 tasks.md 模板要求（固定 `949a232`）。** 依据：12 个任务，工时 2 / 2 / 2 / 2 / 2 / 2 / 2 / 1 / 2 / 2 / 1.5 / 1.5 = **22.0 h**，每项 ∈ [0.5, 2]；依赖 01←∅、02←01、03←02、04←03、05←02、06←05、07←02 + 04、08←06 + 07、09←08、10←09、11←10、12←11——全部指向更小编号，**无前向、无环**，关键路径 18 h（tasks:801–802 自述与核验一致）。每任务含上下文 / 修改范围 / 依赖 / 预计 / 完成标准 / 验证命令（`templates/tasks.md` 要素齐备）；完成标准条数 = 验证命令条数（4/4、4/4、3/3、3/3、4/4、4/4、4/4、2/2、4/4、3/3、9/9、3/3），**每条完成标准都引用 AC 编号**，命令按 AC 前缀 `-t` / `-g` 选取或为静态守卫 / 全量命令（不带 AC 名的命令全部是 `check` / `typecheck` / `tokens` / `test` / 人工截图，与所引 AC 类型吻合）。**文件唯一写入者**：tasks §4 每文件单写者；多任务共享文件显式串行——`shell.spec` 01→02→09、`AgentDrawer.vue` 04→07、`JobTrack.vue` + `job-track.spec` 05→06、`integration-v2.spec` 09→10、`AppShell.vue` 01（条件）→07；T-V2-11 修复限于 §4 壳文件；`contracts/** / events.ts / jobs/** / main.ts / package.json / lock` 明示不改（:397）。**blocked_by**：12/12 任务带状态行且全部 blocked，S1 / S2 显式 `blocked_by: H-x`（切片级：H-2·标签 / H-2·列表 / H-3·路由切片 / 页面切片），指向 tasks 1.2 登记行而非移动工作树；头部登记位 v1 Handoff SHA / 实施分支 / 集成验证分支 / 集成人 / A 复核 SHA（:299–304）已设且为「未取得」，并禁止用 `fdaa7d8` / `0ffa15e` / `b19427a` 代替；集成子项（AC-002-8 / 003-7 / 005-8）无占位任务「完成」。
- [x] **R2-C01 首轮建议 V2-S01～S09 落地核验。** S01：tasks 1.2 四项登记 + 登记规则 1–2（:326–328），README:33 含三点交接细化与 F-04 / 05 / 06 补充 ✓。S02：plan:338 H-2③ 最低期望（待人工确认 / 冲突在集合内、终结态不在，枚举由生产方登记 CONTRACT.md）+ T-V2-05#1 用 fixture id 断言、不重写判定 ✓。S03：plan:399 两种静态空态、不加 `reason`；T-V2-06 ✓。S04：plan:396 不加 `hasRoute`、不改 path 跳转，H-3「路由定义与 `main.ts` 注册」切片前置（plan:338 H-3 列、:538）；T-V2-05 / 06 blocked_by 含 H-3·路由切片，切片集成前卡片不可点、不演示 ✓。S05：plan:497 + T-V2-09#3 显式等待原 `long` run 唯一终态与运行中指示消失后再全局发送（核 `0ffa15e`：`long.ts`:14 在 12000 ms 发 `run.completed`；`AgentDock.vue`:51 `agent.running` 时禁发）✓。S06：plan:434 + T-V2-03 修改范围 / 标准 1：`useSessionStore()` 只在 `send` 函数体内调用、不加抽象（核 `0ffa15e` `agent/store.ts` 顶层只有 `useBadgesStore()`，加法可行）✓。S07：plan:395「复用」、未交接 blocked、不用 `JobStatusLabel` 直出；H-2·标签含 `JobStatusBadge`（tasks:318）；T-V2-05 blocked_by ✓。S08：`nav.ts` 归属注释 + M-09「格物致知（learning，Phase 2C）」+ `AC-002-2 v2-nav` 断言 owner 文案含 `learning`；用户可见占位文案仍沿用 `0ffa15e` 模板「内容随 `learning` feature 交付」——AC-002-2 只要求「注明归属」，`learning` 与 docs/plan.md §5 `backend/learning/`、路由 `/learning`（D-018）同名可追溯，**A 接受为落地**，不要求改页面功能 ✓。S09：见 I-01b(a) ✓。
- [x] **R2-C02 Analyze F-01～F-07 修正语义闭环（独立复核，不预设批准）。**
  - **F-01 `PlaceholderPage.vue` 派生边界（A 独立判定：同源派生，可接受）**。事实（`0ffa15e`）：`git grep app.research` 只命中 `Rail.vue`:70 / :75 与 `PlaceholderPage.vue`:9；`PlaceholderPage.vue`:8–10 的 `title` computed 依赖 `app.research`，删除 `stores/app.ts` 的 `research` 导出后不改必红；`8bd1b31` 互动方所有权（其 plan:16）不含 `src/pages`，该文件是 v1 壳文件（v1 T-08 范围）。判定理由：spec §4 Q-029 清单是「v2 壳接线」清单，不是对 v1 壳文件的禁改令；本改动是 AC-002-2「不再单列专题研究」的必然派生、纯减法（只删 research 标题分支，标题直接取 `route.meta.title`），不改占位文案 / `data-placeholder-owner` / daily 日期（T-V2-02 :454）；单写者 T-V2-02（tasks:383，plan:305）；验证 `typecheck`（T-V2-02#4，矩阵 AC-002-7 / AC-009-1 行同步）；顺序上 T-V2-01 先删 Rail 的消费、`research` 导出仍在，T-V2-02 再同时删导出与分支，任一提交点类型不红。接受条件与 I-01 对 `stores/app.ts` 相同（Tasks 显式列入范围 + 验证命令），已满足。附带的无用导入清理缺口见 V2-S10（不阻断）。
  - **F-02 `shell.spec` 八项 / research 深链物理用例迁移**：T-V2-01 修改范围（tasks:419–423）与 `0ffa15e:frontend/e2e/shell.spec.ts` 物理用例一一对应——:4–13 八项 `menu` 表（含 `/research`）→ 九项；:16 菜单用例与 :41 直达 / 刷新用例迁移、计数 8→9（:19 `toHaveCount(8)`）；:54「daily 与 research 深链」只留 daily；:168 旧 `AC-002-3` 用例与 :2 `research.json` 导入删除。标准 1（:428）写明不残留并要求全前缀全绿，命令 1 改为 `-g "AC-002-2"` 全前缀（:432）；`agent.spec.ts`:21「all eight routes」由 T-V2-01 改九项并加 `v2-nav` ✓。plan:482、tasks:344 同步 ✓。
  - **F-03 S0 `/jobs` 占位子断言到 T-V2-09 集成态的串行迁移**：`shell.spec` 写入链 01→02→09（tasks:384）；T-V2-01#1 标「仅作 S0 证据」；T-V2-09 上下文（:612）、修改范围、标准 4 与命令 4（:626–631）承接迁移并在集成验证分支上全前缀回归；plan:482「S0 与 S2 的断言迁移」同步。本轮逐条核对 T-V2-03～08 的全部验证命令：无一是全前缀 `AC-002-2` 或全量 `test`，窗口期内不会误用（窗口本身的处理见 O-2）✓。
  - **F-04 H-2 共享列表 + 写 action**：plan:338 H-2⑤「随 H-2·列表交接至少交付一个可调用、会改变作业摘要的生产方写 action」+ store 归属 / 公开导出 / 刷新定向测试，排除 inbox 与 H-5 action；tasks:319 同文、T-V2-05 blocked_by（:515）与 #2（:531）只调用登记的那个 action；plan:491 同步。核 `8bd1b31` 互动方 plan:200：`createJob` 新建作业为 `collecting/collect`，会进入「进行中」集合，示例可行 ✓。
  - **F-05 H-4 条件路由前置**：plan:340 H-4 交接登记须写明公开设置方式、只经路由守卫设置时 S1-ctx 条件依赖 H-3 路由切片、壳不加测试 setter；plan:537、tasks:320 / :322 / :469 / :481 同步；依赖方向仍为生产方 → 壳，无环 ✓。
  - **F-06 H-6 可替换集合**：plan:342「`jobFixtures` 可以替换整个作业样例集合」（新增一项 = 原集合加该项替换）；tasks:324 / T-V2-06 blocked_by（:542）/ 修改范围（:553）：替换能力未交付则整体 blocked，壳不代写；plan:493 同步。核 `0ffa15e` `mock/index.ts`:80–81 `readFixture` 的覆盖即整项替换，与 v1 语义一致；与 AC-002-3「新增一项」（T-V2-09#2）不冲突 ✓。
  - **F-07 闸门 2 证据**：tasks:402 改为三项人工证据（A 复核产物已提交 SHA / I-01b 与 V-02 明确通过记录或 A 补设的正式复选框 / checklist-v2 当前有效），明文禁止以 `git grep "^- \[ \]"` 无输出代替；1.1:304 登记位已设。本节即 (b) 的明确通过记录与正式复选框；(a) 由集成人在提交本文件后登记 ✓。
- [x] **R2-C03 Analyze R2 观察项 O-1～O-3 处理（只按实际影响判断）。**
  - **O-1（plan §7.11 未写 `typecheck`，落在 §7.2:305）——可接受**。`typecheck` 不是 AC-002-7 / AC-009-1 的验收手段，而是派生修改的安全网；§7.2 已登记、tasks 矩阵（:727、AC-009-1 行）与 T-V2-02#4 为超集；AC-009-1 的全量 `pnpm -C frontend test` 本身包含 `typecheck`。不要求回改 plan。
  - **O-2（H-3 集成后至 T-V2-09 完成前，`shell.spec` `/jobs` 子断言在集成验证分支上预期红）——可接受，附一条记录要求**。窗口有界且已登记（tasks:612 明文不以全前缀 / 全量为证据）；窗口内可能执行的 T-V2-03～08 命令都不触及该子断言；`shell.spec` 在该窗口的唯一合法写者就是 T-V2-09，不为此新增写者或提前任务（提前会打破 §4 单写者链）。实际影响只是一条已知的 S0 子断言，不是回归；要求窗口内提交与 Converge 记录标注「已知红」（V2-S11）。
  - **O-3（T-V2-04 / T-V2-07 经 T-V2-03 隐含继承 H-3 条件依赖）——清晰度足够**。T-V2-04 依赖 T-V2-03、T-V2-07 依赖 T-V2-04（tasks:496 / :569 / §9 表），加 §3「blocked_by 没有全部解除的任务不得开始」与依赖顺序，条件依赖必然传递；T-V2-07 已显式写「继承 H-1 和 H-2·标签」。补一句即可（V2-S12，编辑性）。
- [x] **R2-C04 内部设计通过与外部开工阻塞分离。** tasks 1.1 的 v1 Handoff SHA / 实施分支 / 集成验证分支 / 集成人 / A 复核 SHA 与 1.2 的 8 个交接单元（固定 commit / 有效 Checklist SHA / 测试摘要 / 集成 SHA）全部「未取得 / 未交付」；12/12 任务 blocked；Analyze E-01～E-12 均未解除；tasks §5 闸门 1、3 未过。本轮通过**只**解除闸门 2 的「A 定向复核」子项（待本文件提交 SHA 登记进 tasks 1.1:304），不解除闸门 1 / 3，不授权跳过 v1 Handoff 或任何 H-x 交接；本轮也**未**因外部未 Handoff 判设计未通过，更未把任何 H-x 当作已实现。README:24 状态行表述与此一致。

## R2 阻断项（V2-B）

无。

## R2 建议（V2-S10～S12；不阻断、不计入判定；建议在 Implement 前由 Tasks 作者按变更规则落实，或由实施者按「最小派生修改」精神执行）

| # | 位置 | 建议 |
|---|---|---|
| V2-S10 | tasks T-V2-01 修改范围 `Rail.vue`（:418）；T-V2-02 修改范围 `stores/app.ts`「只做三处修改」与 `PlaceholderPage.vue`（:445–454）；T-V2-02 命令 4 | 派生删除会留下无用导入 / 常量：`0ffa15e` `Rail.vue`:3 / :9 的 `useAppStore` / `app` 只服务 research 子列表；`stores/app.ts`:4 的 `ResearchItem` 类型导入；`PlaceholderPage.vue`:4 / :7 的 `useAppStore` / `app`。`tsconfig.json` 未开 `noUnusedLocals`，`typecheck` 不红；但 `eslint.config.js` 用 `tseslint.configs.recommended`（`no-unused-vars` 为 error），`pnpm -C frontend lint` 会红。T-V2-01 / 02 的验证命令不含 `lint`，首次跑 `lint` 的是 T-V2-07#4，而 T-V2-07 不是这三个文件的写入者（§4）。**最小修正**：T-V2-01 / 02 修改范围各加一句「连带删除因此失效的导入与局部变量」，T-V2-02 命令 4 改为 `pnpm -C frontend typecheck && pnpm -C frontend lint`（T-V2-01 可加同一命令）。不改设计、不改 AC、不改 spec；属 Tasks 文字精度，非阻断。 |
| V2-S11 | tasks T-V2-09 上下文（:612）；review.md | O-2 窗口（H-3 集成后至 T-V2-09 完成前）内，集成验证分支上 `shell.spec` 的 `/jobs` 占位子断言已知红。建议该窗口内每次提交信息与 Converge / review.md 记一句「已知红：`shell.spec` `/jobs` 占位子断言，待 T-V2-09 迁移」，避免被当成回归或被用作证据。 |
| V2-S12 | tasks T-V2-04（:496）、T-V2-07（:569）blocked_by | 编辑性：补「经 T-V2-03 继承 H-3·路由切片条件依赖」，与 T-V2-07 现有「继承 H-1 和 H-2·标签」写法一致。 |

## R2 结构核验证据（只读 git + 内存脚本；未写文件、未安装依赖、未运行测试）

```text
HEAD = 949a2329be9874aeaf7c5a189d49d1ee11ad97e5（branch review/frontend-workbench-v2-tasks，git status --porcelain 为空）
LOG  949a232 ← 6bda6c9 ← b364971 ← a8ab444 ← d2bf5a7 ← fec3556
DIFF a8ab444..b364971  plan 14/14（8 hunk 全在 §7）、tasks 518/0（页首 +7、末尾 +v2 段）、README 2/2
DIFF b364971..6bda6c9  plan 10/8、tasks 42/27、analyze-v2 +125（新增）、README 2/2
DIFF 6bda6c9..949a232  README 1/1、analyze-v2 +8、analyze-v2-r2 +82（新增）、plan 页首 2/1、tasks 9/4（页首 / 1.1 / 闸门 4，纯记账）
QUIET a8ab444..949a232  spec.md / checklist.md / checklist-v2.md / docs / AGENTS.md / frontend 零改动；spec == fec3556；checklist.md == d2bf5a7
V1_BODY  tasks「## 约定」→ v2 段前区间 与 a8ab444 逐字相同；plan §1～§6（「## 1. 技术方案」→「## 7.」前）与 a8ab444 逐字相同
TASKS  12 任务；标准/命令条数 4/4 4/4 3/3 3/3 4/4 4/4 4/4 2/2 4/4 3/3 9/9 3/3；AC 并集 52（missing=[] extra=[]）；矩阵 52 行唯一；T-V2-xx#n bad refs=[]；依赖无前向无环；工时 22.0 h；12/12 状态行 = blocked
V1_0ffa15e  PlaceholderPage.vue:8–10 title 依赖 app.research；app.research 消费者 = Rail.vue:70/75 + PlaceholderPage.vue:9；stores/app.ts 4 步进度 + 「正在加载资讯、数据源与研究列表…」+ ResearchItem 导入:4；shell.spec.ts :2 research.json 导入 / :4–13 八项 menu / :16 菜单用例 / :19 toHaveCount(8) / :41 直达用例 / :54 daily+research 深链 / :121 四步文案断言 / :168 旧 AC-002-3；agent.spec.ts:21 eight routes；router.ts 由 navItems 生成具名路由 + /research/:id? 特例；mock/index.ts:80–81 readFixture 覆盖 = 整项替换；__FAI_TEST__ 只暴露 charts；AgentDock.vue:51 running 禁发；long.ts:14 12000 ms run.completed；agent/store.ts 顶层仅 useBadgesStore；tsconfig 无 noUnusedLocals；eslint = tseslint recommended
EXT_8bd1b31  plan:16 所有权不含 src/pages；:55 jobs 复用 agent/store.ts；:61 jobsStore 仅当前作业视图缓存；:200 createJob → collecting/collect
未运行：pnpm / vitest / playwright / 应用；未读取外部 worktree
```

## R2 结论与下一步

1. **通过（Tasks / Analyze 质量）**：V2-B 0；I-01b、V-02 正式勾选；首轮 V2-S01～S09 全部落地（S08 以可追溯 owner 接受）；Analyze F-01～F-07 修正语义闭环，`PlaceholderPage.vue` 派生修改经 A 独立判定可接受；O-1～O-3 按实际影响接受，不新增机制。
2. **新增建议 V2-S10～S12**：S10 建议在 Implement 前由 Tasks 作者补入（属文字精度，若按 AGENTS §2 第 8 步处理，仅需更新 tasks 并重做定向 Analyze，不触发 spec 变更）；S11 / S12 可在实施记录中落实。
3. **仍不授权 Implement**：tasks §5 闸门 1（v1 Handoff SHA 登记且在 main 上）、闸门 3（各 H-x 四项登记齐全并集成）全部未过；闸门 2 的 (a) 待集成人把本文件提交后的 SHA 登记进 tasks 1.1:304。外部前置齐备前，Converge 只能报「未收敛（外部阻塞）」。
4. 若后续对 plan §7 / tasks v2 段做实质（非编辑性）修改，回到本文件由同一模型新开独立会话再做定向复核；审核员切换只在调用失败时按 AGENTS §6 回退。
5. 本轮只写本文件；未修改 spec / plan / tasks / analyze / 旧 checklist / docs / README / 代码，未 commit。本节勾选是设计 / 任务质量证据，不是实现验收证据。

---

# R3 定向复核（恢复修订：v1 Handoff 登记 / R4 合并 / V2-S10～S12 / Analyze R5～R7 修正）——R4 前有效（结论由文末 R4 延续，本节保留为历史）

> **审核员**：A = `claude-fable-5-1` **via `anthropic`**（`--model anthropic/claude-fable-5-1`）。**通道**：本会话由协调器以 `anthropic` 通道派出；本限额窗口内 `claude-bridge/claude-fable-5-1` 已有额度 / 限流类失败记录（见 R1 / R2 页首与互动方 checklist R3～R6 页首），按 AGENTS §6 第 5 条本会话未再探活 bridge、未换模型、未改任何 provider / 路由 / 配置。失败类别 = 通道额度或限流（继承记录）；本记录已脱敏。
> **独立性**：全新独立会话；独占 worktree `D:/2030/Futures-AI-workbench-v2-resume-review`，分支 `review/frontend-workbench-v2-resume`，进入前 `git status --porcelain` 为空。A 不是 Plan / Tasks / 修正 / Analyze R3～R7 的作者（均 `claude-opus-5-5` via anthropic），不是协调集成人（`openai/gpt-6.1-sol`，同时是 A 的回退 2，本轮未触发回退），不是未来实施者（`openai/gpt-6-astra` 首选）。单审，本节结论即审核结论。本轮是设计 / 任务质量复核，不是代码 Review、不是 Gate 2。
> **固定对象**：HEAD = `b375b270a47d210823ae62da16438eeac17096db`（`git rev-parse HEAD`）。它是 R7 报告（`analyze-v2-r7.md`，审 `217960d`）落盘的提交，即 tasks 1.1:387「A 定向复核」行定义的「复跑报告落盘的提交」；该格尚未写入具体 SHA（提交无法含自身号），由集成人在登记本产物 SHA 时一并登记 `b375b27`。`217960d` 与 `43b6d79` 均为 HEAD 祖先；`b375b27` 相对 `217960d` 只改 README 状态行、`analyze-v2.md` 索引、`analyze-v2-r7.md`（新增）与 tasks 状态行（符合 R6 O-2）。
> **审查路径与命令（按 tasks 1.1:387 口径）**：`git diff ded7161 b375b27 -- specs/frontend-workbench/plan.md specs/frontend-workbench/tasks.md 'specs/frontend-workbench/analyze-v2*.md' specs/README.md HANDOFF.md` = 10 个文件：HANDOFF 14 +/−、README 1/1、analyze-v2 +4、analyze-v2-r3～r7 各新增（52 / 45 / 47 / 50 / 33 行）、plan 31 行（页首 +4 行记录、§7.0 / §7.2 / §7.3 / §7.4 / §7.11 / §7.13 / §7.14 共 8 个 hunk）、tasks 178 行（v2 页首 / 1.1 / §2 补充 / §4 / §5 / T-V2-01 / 02 / 04 / 07 / 09 / 矩阵 / §8 / §9）。另核 `949a232..ded7161` 对 plan / tasks / README / analyze-v2 只有 5 行暂停记账，故本轮覆盖 A R2 之后的全部增量。
> **范围外三断言（均无输出）**：`git diff 43b6d79 b375b27 -- frontend design docs backend AGENTS.md specs/frontend-workbench/assets specs/frontend-workbench/review.md specs/frontend-workbench/converge.md specs/frontend-workbench/manual-acceptance.md specs/frontend-workbench/checklist.md`；`git diff fec3556 b375b27 -- specs/frontend-workbench/spec.md`；`git diff f1f755b b375b27 -- specs/frontend-workbench/checklist-v2.md`。附加核对：`specs/frontend-workbench/analyze.md` 与 `43b6d79` 相同（R7 O-1）；`session-artifacts/`、`v2-gate1-request.md` 在 `ded7161..b375b27` 无变化。
> **只读参照**：v1 正式 Handoff `43b6d79`（`git show` / 工作树文件，二者一致）；互动方固定 `8bd1b31`、已提交 `8af343f`（只读 `git show`，不读其工作树）；另见 R3-O03 对 `0e37fbf` 的说明。
> **只读审核**：未安装依赖、未运行 pnpm / vitest / playwright / 应用、未调用其他 agent、未读取凭证或全局配置、未 commit / push；唯一写入文件为本文件。结构核验用 git 只读 + 内存 Python（stdin，不落盘），结果见文末 R3 证据块。

**R3 结论：通过——阻断 V2-B：0；新增建议 V2-S13～S15（不阻断、不计入判定）。I-01b、V-02 在 `b375b27` 上再次确认成立。本通过只解除 tasks §5 闸门 2 的「A 定向复核」子项；闸门 1 的 SHA 子项由 `43b6d79` 满足；G-02（窄窗导航形态）仍待 Walter 裁定，裁定前 T-V2-01 不开工；闸门 3（H-x 四项登记并集成）全部未过。不授权 Implement；外部阻塞未解除时 Converge 只能报「未收敛（外部阻塞）」。**

## R3 正式复选框

- [x] **R3-C01 固定对象、审查范围与范围外断言成立。** 固定对象按 tasks 1.1:387 规则唯一确定为 `b375b27`（R7 落盘提交），不是 `d1c2133` 或更早；审查命令只列 10 个文档文件；三条范围外断言均无输出，证明 v1 代码 / 截图 / review / converge / manual-acceptance / 旧 checklist 与 `43b6d79` 一致、spec 与 `fec3556` 一致、本文件与 `f1f755b` 一致（直到本轮写入前）。tasks 1.1:387 对「不带路径的 diff / `git log ded7161..` 会带入全部 v1 提交」的说明属实（合并基早于 v1 完成），本轮未以其为清单。R6 F-01 的修正达到目的。
- [x] **R3-C02 v1 Handoff 登记与 v1 事实复核（tasks §5 闸门 1 SHA 子项）。** `43b6d79` = 「Merge PR #7: frontend-workbench v1（Gate 2 已确认，Handoff）」；`git merge-base --is-ancestor 43b6d79 main` 与 `… origin/main` 均成立（本轮实测；未调用 `gh`）。tasks 1.1:381 所述事实逐项核实：`git diff --stat 0ffa15e 43b6d79 -- frontend design` = 12 个文件、全部属 R1-01 精度修复（`contracts/{types.ts,CONTRACT.md,schema.json}`、`shared/{format.ts,components/Kpi.vue,components/BoardGrid.vue}` + 6 个测试），`design/` 无差异；plan §7.2 壳文件集合中只有 `e2e/workbench.spec.ts` 变化（+1 条 `AC-003-1 R1-01` 用例，T-V2-06 在其上追加）；`Rail.vue`:3 / :9 `useAppStore` / `app` 只服务 :70–:81 研究子列表，窄窗样式 `.rail[data-viewport-collapsed='true'] .nav-list { flex-wrap: wrap }`（:216–218）在 `Rail.vue` 而非 `AppShell.vue`（后者只有 shell 网格的 `[data-viewport-collapsed]` 选择器）；`stores/app.ts`:4 `ResearchItem` 导入、:13 `research` ref、:17 四步文案、:31 `getResearchList`；`PlaceholderPage.vue`:4 / :7–:10；`eslint.config.js` 启用 `tseslint.configs.recommended`、`tsconfig` 无 `noUnusedLocals`——与 R2 以 `0ffa15e` 核对的事实逐字一致，R2-C02 / V2-S10 的判定在 Handoff SHA 上继续有效。契约仍 `1.0.0`，新增可选 `Figure.deltaDecimals` 归契约拥有者，壳不涉。
- [x] **R3-C03 I-01b 延伸：R4 合并带入的 v1 段 / plan §1～§6 Handoff 版本与 v2 段无冲突。** 结构核验：tasks `## 约定`→`## v2 任务` 区间与 `43b6d79:tasks.md` 同区间逐字相同（含 T-16 / T-17 与 P3 台账）；plan `## 1.`→`## 7.` 区间与 `43b6d79:plan.md` 同区间只差 `---` 分隔行；plan §7 与 `217960d` 逐字相同。语义核对：§7.1 对 §2.1「沿用」——Handoff §2.1 新增「变化量独立精度（R1-01）」只涉 `shared/format.ts` / `Kpi` / `BoardGrid`，v2 §4 写入者表与 :484「不修改」清单均不触及 `shared/**`，JobTrack 不消费 `Figure`；§7.1 对 §2.7「契约升 2.0.0 只由互动方执行」——Handoff §2.7 `Figure` 增可选 `deltaDecimals` 且仍 `1.0.0`，互动方 R6 核对基线 `8920b06` 的 `frontend` / `design` 与 `43b6d79` 相同（本轮实测 `git diff --quiet`），2.0.0 升级将在含 `deltaDecimals` 的基线上进行，无冲突。tasks §2 覆盖声明表仍逐行命中 Handoff 版 v1 段（T-08 / T-13 / T-14 / T-15 / T-06 / T-07 / T-01 条目文字未变），§2 R3 补充（:443）正确声明 T-16 / T-17 不被 v2 覆盖、P3 台账不在 v2 范围、H-02 转 G-02 处理。R4 四处冲突（`.gitignore` / README / plan 页首 / tasks 合计段）均为记录性，无语义冲突。
- [x] **R3-C04 V2-S10～S12 落地核验（A R2 建议）。** S10：T-V2-01 修改范围 `Rail.vue` 写明「连带删除失效的导入与局部变量」并引 `43b6d79` 位置；T-V2-02 `stores/app.ts` 补 `ResearchItem` 连带清理、`PlaceholderPage.vue` 补 `useAppStore` / `app` 清理；T-V2-01 新增标准 5 / 命令 5、T-V2-02 标准 4 / 命令 4 改为 `typecheck && lint`；矩阵 AC-002-7（:823）/ AC-009-1（:861）同步 ✓。S11：T-V2-09 上下文（:708）写明窗口内提交信息 / Converge / review.md 记「已知红」，窗口由集成人在 H-3 集成时开启、T-V2-09#4 通过后关闭 ✓。S12：T-V2-04（:591）、T-V2-07（:664）blocked_by 显式写出经 T-V2-03（→T-V2-04）继承 H-3·路由切片条件依赖 ✓。§8 表 :877–:879 登记一致。
- [x] **R3-C05 R3 自查项（非 A 建议，一并复核）。** (a) `AppShell.vue` 条件写入消解：依据 R3-C02 事实（窄窗样式在 `Rail.vue`），§4:469 改为 `AppShell.vue` 只由 T-V2-07 写、T-V2-01 修改范围删去该文件——单写者链由 01（条件）→07 简化为 07，无新增多写者，正确。(b) T-V2-02 blocked_by 改为「继承 T-V2-01 的全部 blocked_by」——T-V2-02 依赖 T-V2-01，§3「blocked_by 未全部解除不得开始」加依赖顺序使 G-02 自然传递，正确。(c) G-02 登记（tasks 1.1:389、plan §7.14:574）：两种裁定的动作各自写明且互斥——保持换行 = plan §7.4 不变、`UI_LAYOUT.md` 暗色适配段登记 `#narrow` 横向滚动「不采用 + 原因」、不重跑 Analyze；改横向滚动 = 改 §7.4 / §7.2 / T-V2-01 范围与标准 4、6，重跑 Analyze 并由 A 复核——与 AGENTS §2 第 8 步变更规则一致。A 核对：spec R-002 / AC-002-6 对两种做法都成立（AC-002-6 是文档级无横向溢出，导航容器 `overflow-x` 滚动不构成文档溢出），本轮不替 Walter 裁定；另见 R3-O01。
- [x] **R3-C06 Analyze R5 F-01～F-05 / R6 F-01～F-02 修正语义闭环与 R7 结论（独立复核，不预设批准）。** R5 F-01（A 复核对象不一）：1.1:387、§5 闸门 2(a)（:489）、§9 第 3 步（:908）、T-V2-01 状态行（:497）、「本 Tasks 落盘」行（:388）统一指向同一规则且写明「不是 `d1c2133`」✓。R5 F-02（`design/ui` 导航条目无人负责）：本轮实测 `git grep -nE "八项|getResearchList|研究扩展|研究列表" -- design/ui` 恰命中 `README.md:16`、`UI_NAV.md:116`、`:119` 三处，均在暗色适配段 / 索引行，原文快照与 JSON 碎片无命中，故 T-V2-01#6「应无输出」可达；`design-registry.spec.ts`:65–:91 对暗色适配段只断言含「不采用 / 原因 / 为什么 / 落点」及 README 含链接 / 来源 / 迁移日期，按 T-V2-01 修改范围改写不回归；`docs/designUI.md`:198 / :213 确为把 `UI_NAV` 指为导航登记处；plan §7.2:312 / §7.4:382 / §7.11:512 / §7.13:546 / §7.14:574 与 tasks §4:468 / T-V2-01 范围·标准 6·命令 6 / 1.1:389 / 矩阵 AC-008-1（:858）互相一致 ✓。R5 F-03（闸门 4 登记）：1.1:385–:386 与 §5 闸门 4（:491）登记到 R7 ✓。R5 F-04（「未审」措辞过时）：plan 页首 R5 行、§7.0 括注、tasks 页首 R5 行、1.1:378、v2 段首均写明「A R2 已审到 `949a232`，未审增量从 `d1c2133` 起」——与本文件 R2 基线一致 ✓。R5 F-05（通道记录）：plan / tasks 页首更正行 + R3 / R4 报告页首注记（原文不改），HANDOFF 页首同步 ✓。R6 F-01：见 R3-C01 ✓。R6 F-02：T-V2-01#6 只引 AC-008-1（依据 spec:180 AC-008-1 与 :205 §4 末条「视觉决定登记为令牌与条目」，引用准确）；矩阵 AC-002-2 行（:818）不含 #6 与 `git grep`；plan §7.2 备注「验证落在 AC-008-1 registry」与 §7.11 AC-002-2 / AC-008-1 行一致；全文无「导航视觉决定登记」「AC-008-1 registry 与 AC-002-2」残留 ✓。R7 对 `217960d` 的「F-01 / F-02 关闭、无新增」经本轮独立核对成立；`217960d..b375b27` 只有状态记账。
- [x] **R3-C07 V-02 再确认（固定 `b375b27`）+ R6 O-1（T-V2-01 工时）判定。** 12 任务，工时 2 / 2 / 2 / 2 / 2 / 2 / 2 / 1 / 2 / 2 / 1.5 / 1.5 = 22.0 h；完成标准 / 验证命令 6/6、4/4、3/3、3/3、4/4、4/4、4/4、2/2、4/4、3/3、9/9、3/3；每条标准引用 AC；标准 AC 并集 = 52（missing / extra 皆空）；矩阵 52 行唯一；`T-V2-xx#n` 引用 bad refs = []；依赖 01←∅、02←01、03←02、04←03、05←02、06←05、07←02+04、08←06+07、09←08、10←09、11←10、12←11，无前向无环；12/12 状态行 blocked。**T-V2-01 工时**：在原 2 h（nav / router / Rail / `shell.spec` 迁移 / `agent.spec`）上新增 3 处 `design/ui` 文档改写（各为一段 / 一行）、连带导入清理与 `lint`，改动量小，A 判定仍可按 2 h 登记、不拆任务、不改结构；但它已处于上限，若实施中超时须按 AGENTS §2 第 6 步拆分，建议预登记拆分规则（V2-S13）。
- [x] **R3-C08 内部通过与外部开工阻塞分离。** 本轮通过只解除闸门 2「A 定向复核」子项（产物 SHA 待集成人登记进 1.1:387）。闸门 1：SHA 子项满足；实施树 `feat/frontend-workbench-v2-s0` 与集成树 `integration/frontend-workbench-v2` 均停在 `43b6d79`、无 v2 提交（本轮 `git worktree list` 核对），S0 开工前须快进到含本产物登记的规格提交（tasks §9 第 4 步）。闸门 3：tasks 1.2 八个交接单元四项登记全部「未取得 / 未交付」；plan §7.3:337 / §7.0:281 对互动方 `8af343f` R6 的处置（通过但不含 §7.3 新增要求，不当作依赖已就绪）本轮核对属实——`8af343f` 的 plan / tasks 中「未筛选」「open(jobId」「同一次导航」「路由切片」「ACTIVE_JOB」命中均为 0，其 checklist R6 页首所记基线 `8920b06` 的 `frontend` / `design` 与 `43b6d79` 相同。G-02 待裁定。README:24 状态行、HANDOFF 页首与此一致。本轮未因外部未交付判设计未通过，也未把任何 H-x 当作已实现。

## R3 阻断项（V2-B）

无。

## R3 建议（V2-S13～S15；不阻断、不计入判定；均为 Tasks 文字精度 / 登记事项，不改设计、AC 或 spec）

| # | 位置 | 建议 |
|---|---|---|
| V2-S13 | tasks T-V2-01（:516 预计 2 h）；§9 工时段 | R6 O-1 的处置：T-V2-01 已到 2 h 上限并新增 `design/ui` 三处改写。建议仿 v1 尾注（:358）预登记一句「若实施超过 2 h，把 `design/ui` 登记（修改范围前三项、标准 6 / 命令 6）拆为 T-V2-01b（0.5 h，依赖 T-V2-01，矩阵 AC-008-1 行同步）」，避免实施中临时改结构时无规则可循。拆分若真发生，属任务结构变更，按 AGENTS §2 第 8 步走定向 Analyze。 |
| V2-S14 | tasks T-V2-03 / 04 / 05 / 07 / 09 状态行（:564 / :591 / :610 / :664 / :705）；1.2 登记规则 1 | 这些 blocked_by 仍以「v1 Handoff SHA」开头，但该前置已由 `43b6d79` 满足（T-V2-01 状态行已说明「不能再当作未取得」，其余任务未同步）。建议统一改为「v1 Handoff SHA（已满足 `43b6d79`）」或删去，使 blocked_by 只列未解除项，减少 Implement 时误读。同理 1.2 登记规则 1 只提 `8bd1b31` 旧 R2，建议补「`8af343f` R6 同样不覆盖 §7.3 新增要求」与 plan §7.3:337 对齐。 |
| V2-S15 | tasks 1.1:387、:388；README:24；HANDOFF 页首 | 集成人登记本产物 SHA 时，在同一提交内把固定对象 `b375b27` 写入 1.1:387（该格目前只写规则、未写 SHA），并同步 README 状态行与 HANDOFF 页首为「A R3 已复核 `b375b27`，待 G-02 裁定与 H-x 交接」；该提交只放登记 / 状态行（R6 O-2 精神），不顺带改 plan / tasks 实质内容，否则超出本轮复核范围。 |

## R3 观察（不计入判定、不要求修改）

- **R3-O01 G-02 的事实边界（供 Walter 裁定参考，不替裁定）**：`design/ui/UI_LAYOUT.md` 的「横向滚动」只出现在原文快照 `#narrow` 规定（:54）；其暗色适配段（:259–:275）对 `shell_collapse` 只写「下方侧栏塌顶栏」，既未写滚动也未写换行，「不采用」列表也未排除滚动；`UI_NAV.md` 暗色适配段（:117）写「窄窗口塌为顶部横向导航」，同样未定形态。v1 实现为换行（`Rail.vue`:218），plan §7.4 沿用；v1 Handoff 把差异登记为 P3 H-02 并指明需 Walter 裁定。两种裁定都不触及 spec 的 52 条 AC（AC-002-6 为文档级无溢出）；tasks 1.1:389 / plan §7.14:574 已把两条路径的文档与流程动作写清。 **R4 补记**：G-02 已于 2026-10-28 裁定为横向滚动（单行 + 容器内横滚），本条为裁定前记录，当前以 R4-C02 / R4-C09 为准。
- **R3-O02 `UI_NAV.md` 元信息**：T-V2-01 改写暗色适配段时不要求改 front matter（`verified` / `migrated`），`design-registry.spec` 只要求日期格式且 README 含同一日期；是否顺手更新 `verified` 由实施者按 `design/ui/README.md` 的约定决定，不影响 AC-008-1。
- **R3-O03 互动方分支已前移**：`git worktree list` 显示 `D:/2030/Futures-AI-interaction-resume` / `-review-r7` 停在 `0e37fbf`（`8af343f` 之后一个提交，「register merged v1 base and H-x producer design」，不在 main 上）。本轮只读 `git show 0e37fbf:` 的关键词计数显示其 plan / tasks 已出现「未筛选」「open(jobId」「同一次导航」「路由切片」等 §7.3 要求用语，但**本轮不把它当作任何交接证据**：按 plan §7.3 / tasks 1.2 登记规则 2，H-x 只有在「固定 commit + 已提交的有效 Checklist SHA + 定向测试摘要 + 集成 SHA」四项登记后才解除 blocked_by；tasks §9 第 5 步与 plan §7.0:281 对 `8af343f` 的描述是当时事实，不需要为此改文档。
- **R3-O04 集成人与 A 回退 2 同模型**：tasks 1.1:384 已登记「`gpt-6.1-sol` 是 A 的回退 2」。本轮 A 未回退，无需记录；若未来触发，按该行要求在 A 产物头部与 review.md 记录。

## R3 结构核验证据（只读 git + 内存脚本；未写文件、未安装依赖、未运行测试）

```text
HEAD = b375b270a47d210823ae62da16438eeac17096db（branch review/frontend-workbench-v2-resume，git status --porcelain 为空）
LOG  b375b27 ← 217960d ← 43b97dd ← 516b520 ← 71a21ad ← d4b1853 ← 5ba40ad ← 1642216 ← eb6ebd8(merge 43b6d79) ← d1c2133 ← ded7161 ← f1f755b ← 949a232
ANCESTOR  43b6d79 ∈ HEAD / main / origin/main ✓；217960d ∈ HEAD ✓；0e37fbf ∉ main
REVIEW_DIFF ded7161..b375b27（限定路径）= 10 文件：HANDOFF 14 行、README 1/1、analyze-v2 +4、analyze-v2-r3 +52、r4 +45、r5 +47、r6 +50、r7 +33、plan 31 行、tasks 178 行（合计 +408/−48）
OUT_OF_SCOPE  三断言均无输出；analyze.md == 43b6d79；session-artifacts / v2-gate1-request 在 ded7161..HEAD 无变化
PAUSE_DIFF  949a232..ded7161 对 plan / tasks / README / analyze-v2 = 5 行记账；checklist-v2 == f1f755b（写入前）
V1_SEG  tasks「## 约定」→「## v2 任务」== 43b6d79 同区间（逐字）；plan「## 1.」→「## 7.」== 43b6d79 同区间（仅多 `---` 分隔行）；plan §7 == 217960d
TASKS  12 任务；标准/命令 6/6 4/4 3/3 3/3 4/4 4/4 4/4 2/2 4/4 3/3 9/9 3/3；每条标准含 AC；AC 并集 52（missing=[] extra=[]）；矩阵 52 行唯一；T-V2-xx#n bad refs=[]；依赖无前向无环；工时 22.0 h；12/12 blocked
V1_43b6d79  0ffa15e..43b6d79 frontend/design = 12 文件（R1-01），§7.2 壳文件仅 e2e/workbench.spec.ts（+AC-003-1 R1-01 用例）；Rail.vue:3/:9 useAppStore/app、:70–:81 research 子列表、:216–:218 flex-wrap；AppShell.vue 无导航样式；stores/app.ts:4 ResearchItem、:13 research、:17 四步文案、:31 getResearchList；PlaceholderPage.vue:4/:7–:10；eslint = tseslint recommended；tsconfig 无 noUnusedLocals
DESIGN_UI  grep 八项|getResearchList|研究扩展|研究列表 -- design/ui → README.md:16、UI_NAV.md:116、:119（仅此三处）；UI_LAYOUT.md:54 原文「横向滚动」，:259–:275 暗色适配段无「滚动 / 换行」；UI_NAV.md:117「塌为顶部横向导航」；design-registry.spec:65–:91 暗色适配段断言 = 不采用/原因/为什么/落点 + README 链接/来源/日期；designUI.md:198/:213 指 UI_NAV
SPEC  == fec3556；:180 AC-008-1；:205 §4 末条「视觉决定登记为令牌与条目」
EXT  8af343f checklist R6 通过（基线 8bd1b31，前端核对 8920b06）；8920b06 vs 43b6d79 frontend/design 无差异；8af343f plan/tasks 关键词 未筛选/open(jobId/同一次导航/路由切片/ACTIVE_JOB 命中 0；JobTypeLabel tasks 2、JobStatusBadge plan 2 / tasks 1、2.0.0 plan 5 / tasks 6
b375b27 内容 = README 1/1、analyze-v2 +3/−1、analyze-v2-r7 +33、tasks 状态行 +6/−5（无实质设计改动）
未运行：pnpm / vitest / playwright / gh / 应用；未读取任何外部 worktree 的工作树文件
```

## R3 结论与下一步

1. **通过（恢复修订的设计 / 任务质量）**：V2-B 0；I-01b、V-02 在 `b375b27` 上再次成立；v1 Handoff 登记与事实复核无误；R4 合并无语义冲突；V2-S10～S12 全部落地；R5 / R6 修正语义闭环、R7 结论经独立核对成立；G-02 两条路径的文档动作完整。
2. **新增建议 V2-S13～S15**：均为 Tasks 文字精度 / 登记事项；S15 由集成人在登记本产物时顺手完成；S13 / S14 可在 Implement 前由 Tasks 作者按变更规则补入（只改 tasks 文字，不触发 spec 或 §7 设计变更，不要求重新 A 复核）。
3. **仍不授权 Implement**：(a) 集成人登记本产物 SHA 与固定对象 `b375b27` 进 tasks 1.1:387（闸门 2(a)）；(b) Walter 裁定 G-02（保持换行 → 登记日期后 T-V2-01 照计划执行；改横向滚动 → 改 plan §7.4 / §7.2 / T-V2-01，重跑 Analyze 并回到本文件由同一模型新开会话定向复核）；(c) 壳实施树快进到含 (a) 登记的规格提交；(d) S0 开工仍须经 §5 闸门逐项人工核对；S1 / S2 另等 H-x 四项登记与集成。外部阻塞未解除时，Converge 只能报「未收敛（外部阻塞）」。
4. 若后续对 plan §7 / tasks v2 段做实质（非编辑性）修改，回到本文件由同一模型新开独立会话定向复核；审核员切换只在调用失败时按 AGENTS §6 回退。
5. 本轮只写本文件；未修改 spec / plan / tasks / analyze / 旧 checklist / docs / README / HANDOFF / 代码，未 commit。本节勾选是设计 / 任务质量证据，不是实现验收证据。

---

# R4 定向复核（G-02 裁定落实：Plan §7 实质修改 / Analyze R8 修正 / 独立 R9）——当前有效

> **审核员**：A = `claude-fable-5-1` **via `anthropic`**（`--model anthropic/claude-fable-5-1`）。**通道**：本限额窗口内 `claude-bridge/claude-fable-5-1` 的最小真实调用已返回额度 / 限流类失败（R1～R3 页首记录），同模型 `anthropic` 成功；本会话继承该通道证据，按 AGENTS §6 第 5 条未重试 bridge、未换模型、未改任何 provider / 路由 / 配置 / 凭证。失败类别 = 通道额度或限流（继承记录）；本记录已脱敏。本轮无回退（正常审核结果不是换模型理由）。
> **独立性**：全新独立会话；独占 worktree `D:/2030/Futures-AI-workbench-v2-g02-review`，分支 `review/frontend-workbench-v2-g02`，进入前 `git status --porcelain` 为空。A 不是 Plan / Tasks / G-02 落实 / R8 修正 / Analyze R8 / R9 的作者（均 `claude-opus-5-5` via anthropic），不是协调集成人（`openai/gpt-6.1-sol`，同时是 A 的回退 2，本轮未触发），不是未来实施者（`openai/gpt-6-astra` 首选）。单审，本节结论即审核结论。本轮是设计 / 任务质量定向复核，不是代码 Review、不是 Gate 2，不代用户决定任何事。
> **固定对象**：HEAD = `34ee7954d8aa26609c937dd6fcc7cc029baa2539`（`git rev-parse HEAD`）。它是独立 Analyze R9 报告（`analyze-v2-r9.md`，审 `ee3e348`）落盘的提交，即 tasks 1.1:395「A 定向复核」行**当前口径**（R8 已触发修正 → 固定对象顺延为 R9 落盘提交）唯一确定的对象；该格尚未写入 SHA（提交无法含自身号），由集成人登记本产物时一并写入 `34ee795`。`git log --format='%h %p' 79b5212..34ee795` = `34ee795←ee3e348←39b16e3←876ae0d←e84ee27←79b5212`，线性、无合并提交；`79b5212` 是直接祖先。
> **真实差异**：`git diff --stat 79b5212..34ee795` = 7 个文件 +260 / −56：`HANDOFF.md` 19、`specs/README.md` 2、`analyze-v2-r8.md` +89（新增）、`analyze-v2-r9.md` +70（新增）、`analyze-v2.md` 5、`plan.md` 27（页首 +4 行记录；§7.2 资产行、§7.4 窄窗段、§7.11 AC-002-6 / AC-008-1 行、§7.12 M-09、§7.13 S0 行、§7.14 风险行；§1～§6 零改动）、`tasks.md` 104（v2 段首 +5 行记录；1.1 设计依据 / 工作树 / 最近 Analyze / A 定向复核 / G-02 行；1.2 登记规则 1；§2 R3 补充；§3 新增约定；§4 三行；§5 闸门 2 / 4；T-V2-01 状态 / 范围 / 拆分规则 / 标准 4、6 / 命令 4、6；T-V2-02 M-09；T-V2-03～12 状态行；矩阵 AC-002-6 / AC-008-1；§8 五行；§9）。`--name-only` 只有 tasks 1.1 当前口径允许的路径。逐提交：`e84ee27`（S13 / S14 文字）、`876ae0d`（G-02 实质设计）、`39b16e3`（R8 报告）、`ee3e348`（R8 最小修正）、`34ee795`（R9 报告 + 索引 / 状态行）。`git diff --check 79b5212 34ee795` 无输出。
> **范围外三断言（均无输出，本轮实测）**：`git diff 43b6d79 34ee795 -- frontend backend design docs AGENTS.md .gitignore specs/frontend-workbench/assets specs/frontend-workbench/review.md specs/frontend-workbench/converge.md specs/frontend-workbench/manual-acceptance.md specs/frontend-workbench/checklist.md specs/frontend-workbench/analyze.md specs/frontend-workbench/session-artifacts`；`git diff fec3556 34ee795 -- specs/frontend-workbench/spec.md`；`git diff 425c1fd 34ee795 -- specs/frontend-workbench/checklist-v2.md`（写入前；`425c1fd` 不是 HEAD 祖先，比较的是文件内容）。tasks v1 正文（`## 约定`→`## v2 任务`）与 `79b5212` / `b375b27` 逐字相同、与 `43b6d79` 仅差 v2 段前一个空行；plan §1～§6 与 `43b6d79` 仅差末尾 `---`。
> **只读参照**：v1 正式 Handoff `43b6d79`（`Rail.vue` / `shell.spec.ts` / `breakpoints.spec.ts` / `tokens.json` 工作树文件与之 `git diff --quiet` 相同）；`design/ui/{UI_LAYOUT,UI_NAV,README}.md`、`docs/designUI.md`、`tests/unit/design-registry.spec.ts`；只核 Plan 可行性，不重审已过 v1 代码 / 截图，不读原型，不读任何外部 worktree 的工作树文件。
> **只读审核**：未安装依赖、未运行 pnpm / vitest / playwright / 构建 / 应用 / 服务、未派 agent、未读取凭证或全局配置、未 commit / push；唯一写入文件为本文件（新增本节 + 页首 R4 段 + C-01 / 阶段说明 / R3 标题 / R3-O01 四处交叉引用补记，历史文字未删改）。结构核验用 git 只读 + 内存 Python（stdin，不落盘），见文末 R4 证据块。

**R4 结论：通过——阻断 V2-B：0；新增建议 V2-S16（不阻断、不计入判定）。I-01b、V-02 在 `34ee795` 上再次确认成立；R8 F-01 / F-02 经真实源码独立核对确已关闭。本通过解除 tasks §5 闸门 2「A 定向复核」子项对 `79b5212..34ee795` 增量的要求，并限定放行 S0 的内部设计闸门（R4-C10）；闸门 3（H-x 四项交接）全部未过，S1 / S2（T-V2-03～12）仍 blocked。不宣称任何 AC 的产品验证通过；外部阻塞未解除时 Converge 只能报「未收敛（外部阻塞）」。**

## R4 正式复选框

- [x] **R4-C01 固定对象、审查范围与范围外断言成立。** 固定对象按 tasks 1.1:395 当前口径唯一确定为 `34ee795`（R9 落盘提交），不是 `ee3e348` / `39b16e3` / `876ae0d`；审查范围 `git diff 79b5212 34ee795` 不带路径也不会带入 v1（线性直接祖先，本轮实测 `--name-only` 仅 7 个允许路径）；范围外断言按当前口径对 `43b6d79` / `fec3556` / `425c1fd`（不再用历史 `f1f755b`），均无输出。`34ee795` 本身只含 R9 报告、`analyze-v2.md` 索引、README / HANDOFF / plan 页首 / tasks 状态行（+83 / −5，无设计改动），符合「报告落盘提交只放报告和索引 / 状态行」的口径。
- [x] **R4-C02 G-02 裁定的性质与边界（独立核对，不替裁定）。** 协调器问“是否按推荐，采用导航内部横向滚动？”，Walter 回复“可以”；plan 页首、tasks 1.1:397、README、HANDOFF 四处转述一致：< 980 九项顶部导航单行，导航容器内部横向滚动，页面不横滚。A 核对：(a) 这是 `design/ui/UI_LAYOUT.md#narrow`（:54「侧栏塌成顶栏横向滚动」）的原规则，其暗色适配段（:261–:275）对 `shell_collapse` 只写「侧栏塌顶栏」、未排除横滚，故「原样采用、不写入」成立；(b) 冻结 spec R-002（:74）写「窗口窄于 980 时侧栏塌成顶部横向导航」且「任何支持宽度下不出现横向页面滚动条」，AC-002-6（:81）是文档级无横向溢出——导航容器内部 `overflow-x: auto` 不是页面滚动条，两句同时成立，52 AC 不改；(c) 不新增产品形态 / 架构决策，不触发 ADR 或 Gate 1（AGENTS §2 第 8 步的「需求变更」未发生，发生的是 plan §7.4 实质设计修改，已按 §7.4 → Analyze → A 的路径处理）；(d) v1 P3 台账 H-02 原文不改，plan §7.14:585 / tasks §2 明示不宣称 H-02 已关闭、截图已补、视觉验收已完成——措辞恰当。
- [x] **R4-C03 Plan §7.2 / §7.4 / §7.11 / §7.12 M-09 / §7.13 / §7.14 ↔ Tasks 一致（逐项）。** §7.2:318 资产行「`UI_NAV` 九项 + 单行 / 不横滚 / 仅空间不足时容器内横滚；`UI_LAYOUT.md` 不写入」= tasks §4:477 = T-V2-01 修改范围（`UI_NAV` 第二条、`UI_LAYOUT.md` **不改**）= 标准 6:539 = 命令 6:546（新增 `git diff --exit-code 43b6d79 -- design/ui/UI_LAYOUT.md`）= 矩阵 AC-008-1:874；§7.4:387–392 窄窗 CSS 约束（`.nav-list` `nowrap`、标签 `white-space: nowrap`、`flex: none` 落 `.nav-list > li`、`min-width: 0` + `overflow-x: auto` 限窄窗选择器、纵向不滚写 `overflow-y: hidden`、不加状态 / 令牌 / overlay / JS / 自动滚动）= T-V2-01 `Rail.vue` 范围:518 逐句同文；§7.4:393 规范登记「先写资产、再写代码」= T-V2-01 上下文 / 范围顺序；§7.11:507 AC-002-6「S0 窄窗导航：T-V2-01 在 `shell.spec` 新增 `AC-002-6 v2-nav`，先计算样式再行为证据，仅 `scrollWidth > clientWidth` 时断言横滚，不写 `breakpoints.spec`」= T-V2-01 范围:524 + 标准 4:532–535 + 命令 4:544 + §4:480 / :490 + 矩阵 AC-002-6:838；§7.12:538 M-09 = T-V2-02 范围:563（逐字同义）；§7.13:557 S0 行依赖「G-02 已满足；须经 R9 与 A R4」= T-V2-01 / 02 状态行:506 / :550 = §3:470 新约定 = §5 闸门 2:498 / 闸门 4:500；§7.14:585 风险行 = §8:902–903 两行 = §9:927 当前顺序；HANDOFF 页首、README 状态行、`analyze-v2.md` 索引与上述同一口径。G-02 行:397 把原「保持换行」路径标作废、按原登记的「改为横向滚动」路径执行（改 §7.4 / §7.2 / T-V2-01 范围·标准 4·标准 6，重跑 Analyze，A 复核）——与 R3-C05(c) 登记的变更规则一致。当前 plan §7 / tasks v2 段「九项换行 / 按项换行 / 几何断言防回退 / 内部可横滚 / 只补第三环 / 导航项 `flex: none`」均 0 命中。
- [x] **R4-C04 I-01b 再确认（spec / plan / tasks 无冲突；固定 `34ee795`）。** spec == `fec3556`；plan §7.11 AC 集合 = tasks 矩阵 52 行 = 12 任务完成标准 AC 并集 = spec 52（missing / extra 皆空）；矩阵 `T-V2-xx#n` 显式引用 81 处 bad refs = []（R9 以另一计法得 89，两者均无越界引用）。G-02 增量只改 AC-002-6 / AC-008-1 两行的落点描述，AC 文字与类型未动；AC-002-6 新增的 S0 子项（T-V2-01#4）与 T-V2-08#1 / #2 的 S1 子项所有权分离（`shell.spec` vs `breakpoints.spec`），不产生双写者。tasks v1 正文与 plan §1～§6 未变（见页首断言），§2 R3 补充对 H-02 的改写只更新了「处理见 1.1 G-02 行」的指向，不改 v1 台账。R9（审 `ee3e348`）「R8 两项关闭、无新增」经本轮独立核对成立（R4-C06 / C07）；`ee3e348..34ee795` 只有报告与记账。本轮未发现新的 spec / plan / tasks 冲突。
- [x] **R4-C05 V-02 再确认（固定 `34ee795`）。** 12 任务，工时 2 / 2 / 2 / 2 / 2 / 2 / 2 / 1 / 2 / 2 / 1.5 / 1.5 = 22.0 h，每项 ∈ [0.5, 2]；完成标准 / 验证命令顶层条数 6/6、4/4、3/3、3/3、4/4、4/4、4/4、2/2、4/4、3/3、9/9、3/3（T-V2-01 标准 4 的三层子项是嵌套列表，顶层仍 6 条，命令 4 与之一一对应）；每条标准引用 AC；依赖 01←∅、02←01、03←02、04←03、05←02、06←05、07←02+04、08←06+07、09←08、10←09、11←10、12←11，无前向无环，关键路径 18 h 不变；12/12 状态行 blocked。**S13**（`e84ee27`）：只在 T-V2-01:527 与 §9 预登记超时拆分规则（T-V2-01b 0.5 h、依赖 T-V2-01、§4 / §7 / §9 同步、触发走定向 Analyze），未实际拆分，任务数 / 工时不变——与 R3-C07 / V2-S13 的意图一致，且 G-02 后 T-V2-01 少写 `UI_LAYOUT.md`、多一条 `shell.spec` 用例与几行 CSS，仍按 2 h 登记可接受。**S14**：T-V2-03～12 状态行 blocked_by 只列未解除项，统一标「已满足前置：v1 Handoff `43b6d79`」+「全体共同前置：G-02 增量的 Analyze R8 / A R4」，§3:470 写明已满足闸门仍在开工前逐项人工核对；1.2 登记规则 1 补 `8af343f` R6 与 `0e37fbf` / `9acf3de` / `5e9e1f4` 只作设计授权参考、不是 H-x 交付（本轮未核外部提交内容，按其登记为「未交付」即可）。
- [x] **R4-C06 R8 F-01（P2）关闭——按真实源码独立核对，不预设 R9 通过。** 事实（`43b6d79` == 工作树）：`Rail.vue`:216–219 窄窗选择器 `.rail[data-viewport-collapsed='true'] .nav-list { display: flex; flex-wrap: wrap }`；`.nav-link`:141–149 无 `white-space` 声明（计算值 `normal`）、带 `overflow-wrap: anywhere`；`.rail-navigation`:129–132 基础样式已 `overflow: auto`（计算值 `overflow-x: auto`）；`.rail`:106 `min-width: 0`；`AppShell.vue`:93–95 窄窗 `.shell` 为 `minmax(0, 1fr)` 单列；`ul.nav-list > li` 是真实 flex 子项。令牌（`tokens.json`）：`type.nav` 12.5px、`space.grid_gap` 12px（`.nav-link` 左右各 12px）、`space.content_pad_x` 26px（窄窗 `.rail` padding-inline:208）、`breakpoint.shell_collapse` 980、`window.min_width` 960——九项 23 字 × 12.5 + 9 × 24 ≈ 504px < 908 / 927px，A 独立复算与 R8 / R9 一致：令牌宽度下 v1 换行实现也排一行、不溢出，所以「几何同一行」「`overflow-x: auto`」「文档无溢出」「末项可达」在旧实现上全绿，不是防回退。**标准 4:533 的两条计算样式断言能区分新旧**：旧实现 `.nav-list` `flex-wrap` 计算值 = `wrap` ≠ `nowrap`（红）、`.full-label` `white-space` = `normal` ≠ `nowrap`（红）；`white-space` 可继承，写在窄窗选择器下的 `.nav-link` 或 `.full-label` 均使 `.full-label` 计算值为 `nowrap`；`nowrap` 下无软换行机会，`overflow-wrap: anywhere` 不起作用，`li` 的 min-content 即整段文字宽，空间不足时只会在 nav 内溢出而非压缩，`flex: none` 写不写结果相同（R8 O-2）。`scrollLeft > 0` 只在 `scrollWidth > clientWidth` 时断言（:535），不造溢出 fixture、不改字号 / 令牌、不加 mock / JS 状态；新增 CSS 全部限定在 `.rail[data-viewport-collapsed='true']`，不影响宽屏纵向导航；纵向不滚如写用 `overflow-y: hidden`（R8 O-1）。plan §7.4:387–392 / §7.11:507 / §7.14:585 口径与 tasks 相同。F-01 关闭成立。
- [x] **R4-C07 R8 F-02（P3）关闭——人工验收与资产文案不要求观察不会出现的滚动。** plan §7.12:538 M-09、tasks T-V2-02:563、T-V2-01 标准 6:539 与修改范围 `UI_NAV` 第二条、plan §7.2:318 / §7.4:393 / §7.11:523 均为「960 / 979 九项单行、页面不横滚；仅空间不足时在导航容器内部横滚，令牌宽度下放得下、不出现滚动条属正常」；当前文字已无「窄窗（960）下…在导航内部横滚」这类要求看到滚动的表述。资产侧可行性：`git grep -nE "八项|getResearchList|研究扩展|研究列表" -- design/ui` 恰命中 `README.md:16`、`UI_NAV.md:116`、`:119` 三处，全在 T-V2-01 修改范围（第一条规定 / 不采用原因 / README 索引行）内；`design-registry.spec.ts` 对暗色适配段只断言含「不采用 / 原因 / 为什么 / 落点」及 README 含链接 / 来源 / 迁移日期，按范围改写不回归；原文快照与 JSON 碎片不改；`UI_LAYOUT.md` 由命令 6 的 `git diff --exit-code 43b6d79` 守住不写入。F-02 关闭成立。
- [x] **R4-C08 窄窗样式与测试落点在真实文件上可行、所有权无冲突。** (a) `shell.spec.ts` 当前（`43b6d79`）无 `T` 导入、八项 `menu` 表（:4–13）——新增 `AC-002-6 v2-nav` 用例需按 `breakpoints.spec.ts`:3 同法导入 `../src/design/generated/tokens.ts`（生成物已存在），视口取 `W.min_width` / `B.shell_collapse - 1`，不加工具、不改配置；`shell.spec` 写入链 T-V2-01 → T-V2-02 → T-V2-09（§4:480）不变。(b) `breakpoints.spec.ts` 窄窗断言（:43–47：`.nav-list` display flex、toggle 隐藏、首末 `.full-label` 可见、rail 底 ≈ content 顶；:53–57 文档 / `.modules-container` 无溢出）不依赖换行，单行 + 容器内横滚下照样成立（令牌宽度下无溢出；Playwright `toBeVisible` 亦不判断滚动裁切）；T-V2-01 只以 `-g "AC-002-6"` 回归它、不写入（§4:490、范围:524 明示不兼容时回 Analyze 而非改该文件），T-V2-08 仍是唯一写者。(c) `Rail.vue` 唯一写者 T-V2-01；`AppShell.vue` 不涉（R3-C05(a) 仍成立）。(d) 命令 4 全前缀同时选中 `breakpoints.spec` 原用例与新用例，与标准 4「原有各视口断言不回归」对应。不新增 JS 状态 / 令牌 / overlay / 自动滚动（P-1 / P-3 / P-7 继续成立）。
- [x] **R4-C09 历史取代声明（A 为本清单唯一修改者，实施者不动）。** 自本轮起以下表述为历史、不再作为当前设计依据：C-01「< 980 九项换行不溢出（plan:367）纳入 AC-002-6 回归」；R3-O01 对 G-02 两种裁定的事实边界；R3 结论 3(b)「保持换行 → 登记日期…；改横向滚动 → …」与 R3-C05(c) / R3-C08 的「G-02 待裁定」；页首 R3 段「G-02 仍待 Walter 裁定」。当前依据 = Walter 2026-10-28 裁定 + plan §7.4:387–393 + T-V2-01 标准 4 / 6。已在 C-01、阶段说明、R3 标题、R3-O01 追加交叉引用补记，历史原文未删改。R8 O-4 / R9 O-4 所指即此，已处理。
- [x] **R4-C10 S0 内部设计闸门限定放行；外部 S1 / S2 仍 blocked；两者不混。** 依据：T-V2-01 / 02 不消费任何 H-x（tasks 1.2 消费列无 T-V2-01 / 02；plan §7.13:557 S0 依赖只有 v1 Handoff 与 G-02），故 H-x 缺失不能泛化为 S0 阻塞（R8 / R9 E-1 同判）。本轮通过后，S0 的内部前置（闸门 2 的 A 复核子项、闸门 4 的 R9 内部分析子项）对 `79b5212..34ee795` 增量满足。**S0 正式开工仍须**：(a) 集成人把本产物已提交 SHA 与固定对象 `34ee795` 登记进 tasks 1.1:395（闸门 2(a)），并同步 README / HANDOFF 状态行（V2-S16）；(b) 实施树 `feat/frontend-workbench-v2-s0`（本轮 `git worktree list` 实测停在 `79b5212`，与 tasks 1.1 登记一致）快进到含 (a) 登记的规格提交；(c) 开工前按 §5 闸门 1～4 逐项人工核对；(d) 只按依赖顺序 T-V2-01 → T-V2-02，S0 不单独 Handoff、未接线按钮不宣称 AC-002-8。**S1 / S2（T-V2-03～12）**：tasks 1.2 八个交接单元四项登记全部「未取得 / 未交付」，闸门 3 未过——仍 blocked；互动方 `0e37fbf` / `9acf3de` / `5e9e1f4` 等只作设计授权参考，生产方文档轮次或分支前移不等于实现交付。本轮未运行任何产品测试，**不宣称任何 AC 的产品验证通过**；集成后 Converge 在外部阻塞未解除时只能报「未收敛（外部阻塞）」。
- [x] **R4-C11 R8 / R9 报告本身与登记一致。** R8（审 `876ae0d`，1 P2 / 1 P3）与 R9（审 `ee3e348`，全关、无新增）均为独立只读会话、非 A / 非实施；R9 的 F-01 / F-02 关闭证据表逐行与本轮源码核对一致（R4-C06 / C07）；R9 O-1（状态行「Analyze R8 / A R4」措辞）已由 tasks v2 段首「R8 修正」行明确改指 R9 与 A R4，O-2 / O-3 属实施细节，不要求改任务。tasks 1.1「最近一轮 Analyze」= R9、`analyze-v2.md` 索引、README、HANDOFF 四处一致；A R3 / R7 均被正确标为只覆盖各自固定提交的历史结论。

## R4 阻断项（V2-B）

无。

## R4 建议（V2-S16；不阻断、不计入判定）

| # | 位置 | 建议 |
|---|---|---|
| V2-S16 | tasks 1.1:395「A 定向复核」行；README 状态行；HANDOFF 页首 | 集成人登记本产物已提交 SHA 时，在同一提交内把固定对象 `34ee795` 写入 1.1:395（该格当前只写规则、未写 SHA），并把 README / HANDOFF 状态改为「A R4 已复核 `34ee795` 通过；S0 待实施树快进与 §5 闸门核对；S1 / S2 待 H-x」；该提交只放登记 / 状态行，可顺手把各任务状态行的「Analyze R8 / A R4」改为「R9 / A R4（已完成）」（R9 O-1），不改 plan / tasks 实质内容，否则超出本轮复核范围。 |

## R4 观察（不计入判定、不要求修改）

- **R4-O01 「10 个视口」措辞**：plan §7.11 / §7.12 与 tasks 沿用 spec AC-002-6 枚举的 10 个视口；`breakpoints.spec.ts`:7–20 实际另含 4 个恰在断点值的视口（共 14 条 `AC-002-6` 用例）。这是 v1 既有状态（`0ffa15e..43b6d79` 未动该文件），本轮 diff 不涉及，T-V2-01 命令 4 全前缀会一并回归，不影响 G-02 或任何 AC。
- **R4-O02 `UI_NAV.md` 元信息**：R3-O02 仍适用——改写暗色适配段不要求改 front matter；`design-registry.spec` 只要求日期格式且 README 含同一日期。
- **R4-O03 实施细节**：九个标签的 `toHaveCSS('white-space','nowrap')` 需逐元素（`nth` / 循环，R9 O-3）；末项矩形判断留约 1px 容差（R8 O-3）。均为实施写法，不改任务定义。

## R4 结构核验证据（只读 git + 内存脚本；未写文件、未安装依赖、未运行测试）

```text
HEAD = 34ee7954d8aa26609c937dd6fcc7cc029baa2539（branch review/frontend-workbench-v2-g02，git status --porcelain 为空）
LOG  34ee795 ← ee3e348 ← 39b16e3 ← 876ae0d ← e84ee27 ← 79b5212（线性，git log --merges 为空）
REVIEW_DIFF 79b5212..34ee795 = 7 文件 +260/−56：HANDOFF 19、README 2、analyze-v2-r8 +89、analyze-v2-r9 +70、analyze-v2 5、plan 27、tasks 104；git diff --check 无输出
PER_COMMIT  e84ee27 plan 2 / tasks 21；876ae0d HANDOFF 16 / README 2 / plan 24 / tasks 93；39b16e3 r8 +89；ee3e348 HANDOFF 5 / README 2 / analyze-v2 3 / plan 25 / tasks 34；34ee795 HANDOFF 4 / README 2 / r9 +70 / analyze-v2 4 / plan 2 / tasks 6
OUT_OF_SCOPE  三断言均无输出（43b6d79：frontend backend design docs AGENTS.md .gitignore assets review converge manual-acceptance checklist analyze.md session-artifacts；fec3556：spec；425c1fd：checklist-v2 写入前）；Rail.vue / shell.spec / breakpoints.spec / tokens.json 工作树 == 43b6d79
V1_SEG  tasks「## 约定」→「## v2 任务」== 79b5212 == b375b27（逐字），vs 43b6d79 仅多 1 空行；plan「## 1.」→「## 7.」== 43b6d79（仅末尾 ---）；plan §7 相对 b375b27 只变 §7.2 / 7.4 / 7.11 / 7.12 / 7.13 / 7.14
SPEC  52 AC（6/8/9/6/9/4/5/3/2）；R-002:74「侧栏塌成顶部横向导航」+「不出现横向页面滚动条」；AC-002-6:81 文档无横向溢出；AC-008-1:180
TASKS  12 任务；工时 22.0 h；标准/命令 6/6 4/4 3/3 3/3 4/4 4/4 4/4 2/2 4/4 3/3 9/9 3/3；每条标准含 AC；AC 并集 52（missing=[] extra=[]）；矩阵 52 行唯一 == spec；T-V2-xx#n 显式引用 81、bad=[]；依赖无前向无环；12/12 blocked
PLAN_7_11  AC 集合 52（missing=[] extra=[]）
STALE  九项换行 / 按项换行 / 几何断言防回退 / 内部可横滚 / 只补第三环 / 导航项 `flex: none`：plan §7 = 0，tasks v2 段 = 0
RAIL_43b6d79  :3/:9 useAppStore/app；:59 research 特例；:69–92 research 子列表；:106 .rail min-width:0；:129–132 .rail-navigation overflow:auto；:141–149 .nav-link 无 white-space、overflow-wrap:anywhere；:206–229 窄窗选择器；:216–219 .nav-list display:flex; flex-wrap:wrap；ul > li 为 flex 子项
APPSHELL  :93–95 窄窗 grid-template-columns: minmax(0,1fr)
TOKENS  type.nav 12.5px；space.grid_gap 12px；space.content_pad_x 26px；breakpoint.shell_collapse 980；window.min_width 960；window.width 1440；window.height 900 → 九项 ≈ 504px < 908 / 927px
SPECS  breakpoints.spec:3 import T；:7–8 视口 960 / 979；:43–47 窄窗断言；:53–57 无溢出；14 条 AC-002-6 视口用例；shell.spec:1–2 无 T 导入、:4–13 八项 menu（T-V2-01 迁移）
DESIGN_UI  grep 八项|getResearchList|研究扩展|研究列表 → README.md:16、UI_NAV.md:116、:119；UI_LAYOUT.md:54 #narrow「侧栏塌成顶栏横向滚动」，:261–275 暗色适配段无「滚动 / 换行」；design-registry.spec:65–91 暗色适配段断言 = 不采用/原因/为什么/落点 + README 链接/来源/日期；designUI.md:198 指 UI_NAV
WORKTREES  实施树 feat/frontend-workbench-v2-s0 = 79b5212；集成树 integration/frontend-workbench-v2 = 79b5212；主规格树 = 34ee795；g02 树 = ee3e348（与 tasks 1.1 / HANDOFF 登记一致）
未运行：pnpm / vitest / playwright / 构建 / 应用 / gh；未读取任何外部 worktree 的工作树文件；未读原型
```

## R4 结论与下一步

1. **通过（G-02 落实的设计 / 任务质量）**：V2-B 0；I-01b、V-02 在 `34ee795` 上再次成立；G-02 裁定属执行 `UI_LAYOUT#narrow` 原规则、不改 52 AC / 不新 ADR / 不重过 Gate 1；Plan §7.2 / 7.4 / 7.11 / 7.12 / 7.13 / 7.14 与 Tasks 全部一致；R8 F-01 / F-02 经真实源码核对确已关闭（`nowrap` 两条计算样式断言在 v1 实现上会红，是真正的防回退）；S13 / S14 落实无结构变化。
2. **新增建议 V2-S16**：集成人登记本产物时顺手完成，只放登记 / 状态行。
3. **S0 限定放行**：内部设计闸门对 T-V2-01 → T-V2-02 解除；正式开工仍须 (a) 登记本产物 SHA 与 `34ee795`、(b) 实施树快进、(c) §5 四闸门逐项人工核对、(d) 按依赖顺序执行并按任务命令取证。**S1 / S2 仍 blocked**（H-x 四项交接全部未交付），不以 H-x 缺失堵 S0，也不以 S0 放行推及 S1 / S2。本轮不是 Gate 2，不代用户做任何批准。
4. 若后续对 plan §7 / tasks v2 段再做实质（非编辑性）修改，回到本文件由同一模型新开独立会话定向复核；审核员切换只在调用失败时按 AGENTS §6 回退。
5. 本轮只写本文件；未修改 spec / plan / tasks / analyze / 旧 checklist / docs / README / HANDOFF / 代码，未 commit。本节勾选是设计 / 任务质量证据，不是实现验收证据。
