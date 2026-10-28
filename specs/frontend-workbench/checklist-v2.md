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

- [x] **C-01 九项导航。** 顺序、路径、占位 owner（plan:346–356）= spec R-002 / designUI §3.1；删 `research` 项与 `/research/:id?` 特例、旧 URL 落兜底页（plan:357–361）；`aria-current` 规则 `page` / `location` 且全局唯一（plan:364–366）覆盖「作业详情仍高亮作业」；< 980 九项换行不溢出（plan:367）纳入 AC-002-6 回归。已核 `0ffa15e` `router.ts` 由 `navItems` 生成具名路由、`Rail.vue` 以 `route.meta.navId` 判当前项，方案可直接落地。
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

- **I-01b spec / plan / tasks 无冲突（Analyze）**：v2 tasks.md 尚不存在，Analyze 未发生。Tasks 产出后由 A 复核。复核要点：v2 任务不得修改或勾选 v1 历史任务，但须**显式声明取代**与 v2 冲突的 v1 完成标准——T-08.1 / T-08 上下文「八项菜单」（tasks:115、119）、T-08.5「专题研究子项由研究列表驱动」（tasks:123）、T-13.1「八路由」（tasks:203）、T-15.2「M-01～M-08 八项」（tasks:238）、T-08 `stores/app.ts` 状态文案；旧 tasks 不得当 v2 任务生效。
- **V-02 任务粒度与验证命令满足 tasks.md 模板要求**：Tasks 产出后由 A 复核——每条完成标准引用 AC 编号、验证命令一一对应、0.5–2 h、依赖无前向无环；S1 / S2 任务显式 `blocked_by: H-x`（指向固定交接 SHA）；头部登记 v1 Handoff SHA 与集成验证分支名；AC-002-8 / 003-7 / 005-8 集成子项不得由占位任务「完成」。
- **P-4 主函数只写正常流程（§5.4）**：代码级准则，Review 阶段核 `JobTrack` 三态分支、`AppShell` 投放事件处理、`send` 快照与 `receive` 绑定。
- **AC-009-1 命令输出 / AC-009-2 截图 / AC-007-5 生产方证据**：属 Implement / Handoff 证据，当前不声称。
- **Implement 前置**：本文件当前有效复选框全部勾选，但开工另需 (1) Tasks 经 A 复核补勾；(2) Tasks 头部登记 v1 Handoff SHA；(3) 各子阶段的 H-x 交接单元以固定 commit + 定向测试摘要交付并由集成人集成；(4) 外部阻塞未解除时 Converge 必报「未收敛（外部阻塞）」，不得报全量。

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
