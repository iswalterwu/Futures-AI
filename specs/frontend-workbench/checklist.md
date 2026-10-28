# Feature: frontend-workbench 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求 / 设计质量达标，不代表实施完成。实施者不勾选本文件。
>
> **审核员**：A = claude-fable-5-1 **via anthropic**（`--model anthropic/claude-fable-5-1`）。
> 切换原因：`claude-bridge` 周额度不可用，按用户指示改走 Anthropic API 通道；同一 Claude 模型，只换接入路径，审核员身份不变。四轮均经此通道。
> **单审**（AGENTS.md §2 第 5 步，2026-10-28 版）：本文件结论即审核结论，不再要求第二名审核员、不做共识投票。
> 本文件**取代**双审时代的共识清单（旧版及 8 份逐轮中间文件历史留存于 git，见 `git show df0b1ec --stat`）。
> **编号勘误（2026-10-28，编辑性）**：本文件历史记录中的 `D-013` 指涨跌作用域 ADR；该 ADR 合并前已重编号为 `D-015`（与主线 D-013 库存收敛撞号）。清单结论与勾选状态不变，本文件不改写历史记录。
>
> **审核历程**（spec.md 全程为 `1b5659d` Gate 1 重新批准的冻结版，45 条 AC，未动）：
> - **第一轮**（基线 `df0b1ec`，精简版 plan 235 行 / tasks 15 项 25.5 h）：全文审查——AGENTS.md（§2 单审、§5 七条准则）、docs 三件套、全部 ADR（含 D-013 勘误段）、spec / plan / tasks、`git show df0b1ec` 全文 diff、`D:\FTEngine\design\` 源资产。结论：不通过，8 项阻断（B-01 ~ B-08）+ 14 条建议（S-01 ~ S-14）。
> - **第二轮定向复核**（基线 `50c26dd`）：B-01 / B-02 / B-03 / B-08(a) 闭环；B-04 / B-05 未动、B-06 / B-07 / B-08(b) 残留（事后查明该批 plan 修改在实施侧同一次编辑调用中整体回滚）。结论：不通过（剩余 5 项）。
> - **第三轮定向复核**（基线 `666b671`，补回 plan §2.7 / §2.8 / §6）：B-04 / B-05 / B-06 闭环；B-07 / B-08(b) 的 plan 侧落实，残留 5 行文本（tasks:45 / :53 / :205，plan:210 / :214）。结论：不通过（剩余 5 行）。
> - **第四轮定向复核（2026-10-28，基线 = HEAD `2c2fbc8`，plan 2 +/2 −、tasks 4 +/4 −）**：逐处核第三轮点名的 5 处 + 确认其余 B 项未回退 + 结构核验。**结论：通过。**
>
> **口径**：只在确认满足时勾选；未勾选项写原因与位置（文件 + 行号）。阻断项编号 **B-xx**，建议项 **S-xx**（不阻断、不计入判定）。复核判定二元：原关闭要求仍有遗漏即"未闭环"。
> 只读审核：未安装依赖、未运行项目测试、未修改其他文件、未 commit；结构核验用一次内存脚本（见文末）。

**结论（第四轮）：通过，tasks.md 自此生效（基线 `2c2fbc8`）。** 8 项阻断（B-01 ~ B-08）全部闭环，70 项检查全部勾选；14 条建议采纳 12 条（S-04 / S-07 未采纳，理由可接受），另有 4 条非阻断的顺手项（S-08 残留、S-15、S-16、S-17）留给实施期。Gate 2 前需 Walter 知悉的事项见文末。

## 需求完整性

- [x] **N-01 每条编号需求至少有一条可验证的验收规则。** spec R-001 ~ R-009 共 45 条 AC（6 / 7 / 6 / 6 / 7 / 4 / 4 / 3 / 2），编号连续、每条写明验证形态（自动 / 组件 / 端到端 / 人工）。
- [x] **N-02 无未澄清歧义。** spec §5 Q-001 ~ Q-022 全部有裁定与融入位置；Q-006 ~ Q-014 为可推断项并已写入对应需求；spec 冻结（`1b5659d`）后无新增问题。
- [x] **N-03 目标与非目标边界清晰。** spec §2：交付设计系统 / 外壳 / 工作台 / 模块 / 对话抽屉 / 图表主题 / 契约与 mock / 资产移植 / 守卫；明确排除真实后端、Electron、14 种图表、各 domain 页内容、亮色主题、拖拽、多语言 / 移动端 / 无障碍。
- [x] **N-04 spec 每条 what 在 plan 均有设计落点。** 逐条核对 R-001 ~ R-009 无缺失：R-007 "错误形态"落 plan §2.7（plan:147：统一 `{error: {code, message, retryable}}`、code 集合、写入 CONTRACT.md、模块错误态与 `run.failed` 复用，B-06）；R-005 事件字段（plan:121，S-01）、页面目标跳转（plan:120，S-02）、R-004 样例态区分（plan:112，S-03）均已补齐。

## 一致性

- [x] **I-01 spec / plan / tasks 之间无冲突。** 第一轮 B-01 / B-02 / B-03、第二轮 B-04 / B-05 / B-06 已闭环；第三轮点名的两组残留在 `2c2fbc8` 全部消除：① 回放脚本四份——plan §2.5（plan:123）↔ plan §5 AC-005-2 行（plan:210 "success / failure / retry 回放"）、AC-005-6 行（plan:214 "四份脚本"）↔ T-07.3（tasks:105）↔ T-13.3（tasks:205 "回放 success / failure / retry"）一致，全文 `retry / abort` = 0、`五份` = 0；② 样例口径——plan §2.8（plan:162 "除 AC-001-2 明定的最小样例外不写样例自检"）↔ tasks 头部（tasks:5 "去掉了守卫样例自检（AC-001-2 明文要求的 `colors` 最小样例除外）"）↔ T-03 上下文（tasks:45 "仅 `colors` 按 AC-001-2 先跑最小样例"）↔ T-03 完成标准 2（tasks:50）一致，tasks 全文 `不写样例自检` = 0。余 plan:218 `check.network` 笔误（S-15，编辑性，不构成语义冲突）。
- [x] **I-02 与 docs/ 决策与 ADR 无冲突。** 核对项：D-004 / D-008（ECharts、Vue 3 + Vite + TS + Pinia）✓；D-011 结论 1–8（首页 = 工作台 + 焦点带、八项菜单、底部抽屉 + 时间线、角标、暗色玻璃面 3–6% / 边 7–14%、模块库 + 固定栅格）✓；D-013 三个登记位置 = plan §2.1 `updown.css` 允许引入名单（market-board / watchlist / FocusBand）✓；designUI §2.1 玻璃三值（.035 / .045 / .82 面，.07 / .09 / .12 边，18 / 28px 模糊）均在登记范围内 ✓；§2.2 状态色不用绿 ✓；§2.3 退役五色 = PALETTE_CORE `palette-retired` 块 ✓；§3 默认模块顺序 ✓；§4.2 主题经 ECharts registerTheme ✓；docs/plan.md §5 `frontend/` 目录与目录 README ✓；architecture §2 前端职责 ✓；D-013 勘误段已改"三个位置"（`50c26dd`，S-11）。
- [x] **I-03 精简提交（df0b1ec）删除项逐项核对——是否删掉了 spec 要求的内容。** 守卫自检样例（11 守卫 → 六条 grep）：§5.6 允许，AC-001-2 单独要求的样例已按方案 (1) 为 `colors` 保留（plan:156、tasks:46 / :50 / :53）；`source_anchors.json` 逐锚盘点与双向核：spec R-008 只要求"未采用的规定标注原因"，删除合规；pi 原始事件归约层 + 六份样本：Q-014 只要求"对照、保证可映射"，plan §2.5 保留映射表与归约规则即可；Toast / StorageAdapter：§5.3 合规（Q-007 "经存储接口隔离"为推断性实现措辞，spec 正文与 AC 未要求接口，三个 localStorage 键在 plan §3 集中登记已满足"后续迁移"意图，记录于 C-05）；SparkSeries 跨字段 refine：§5.2 合规，SparkSeries 自身四项元数据仍必填（AC-007-4 不受影响）；对比度只按单层卡面：焦点带与模块区为网格独立行、结构上不叠层，合规；layering 守卫与几何 e2e：被结构设计取代，合规；ac-coverage 守卫：测试标题以 AC 开头 + 矩阵即可在 Converge 时机械核对，合规；网络守卫 ESLint → grep：AC-007-1 字面要求"静态扫描：允许名单只含契约实现层"，grep 满足；唯一被误删的 spec 要求（错误形态）已于 `666b671` 补回 plan §2.7。
- [x] **I-04 文件边界、共享文件与回滚一致。** spec §4（Q-022）= plan §1 = tasks 约定"文件边界"行（tasks:12，S-12）= T-01 `.gitignore` 追加四行 / T-15 `docs/designUI.md` 指针；不碰 `backend/`；plan §6 回滚按文件块、D-013 不删除只标 superseded + 后继 ADR，与 `docs/decisions/README.md` 规则相容。

## 可测试性

- [x] **V-01 每条验收规则可映射到自动测试或人工验收步骤。** 45 条全部确认，逐条见下表。
- [x] **V-02 任务模板字段齐备、粒度在区间内、验证命令与完成标准一一对应。** 15 项均含上下文 / 修改范围 / 依赖 / 预计 / 完成标准 / 验证命令；每项 1.0–2.0 h；每条完成标准引用 AC 编号；完成标准条数 = 验证命令条数（四轮脚本逐任务比对均无差）。第三轮指出的唯一机制错位（T-03 验证 2 为 vitest 而完成标准 2 说由 `colors` 检查自身先核样例）已改为 `pnpm -C frontend check --only colors`（tasks:53），与完成标准 2（tasks:50）及 plan:156 机制一致。工时偏紧的处理方式已写入 tasks 末行（S-10）。
- [x] **V-03 任务依赖无前向、无环，工时合计一致。** 四轮脚本：15 任务、依赖边全部指向更小编号、无缺失引用、DFS 无环；逐项求和 25.5 h = 末行"约 25.5 小时"。
- [x] **V-04 验证命令所指测试文件均有归属任务。** `tests/unit/design-registry.spec.ts` → T-05（tasks:72）、`tests/component/topbar.spec.ts` → T-08（tasks:116）（B-03）；T-03 验证 2 不再指向无归属的 vitest 测试（`2c2fbc8`，tasks:53）。其余验证命令所用文件均在对应任务修改范围内。非阻断：T-15 验证 3 要改 T-05 拥有的 `design-registry.spec.ts`，T-15 范围未列（S-16）。

### 逐 AC 验证映射（45 条）

- [x] **AC-001-1** plan §5 + T-02.1（生成物逐字比对、`@media` 阈值 ∈ 令牌）+ T-14.2（浏览器内逐令牌读计算样式对拍）；`pnpm test` 以 `check`（含 generated）开头（plan:162）。
- [x] **AC-001-2** T-03 `check:colors`（plan:156：登记处 `tokens.json` / `generated/*` 豁免、具名色只在样式声明值位置识别、先跑 `scripts/check-samples/colors/{positive,negative}.css` 阳性全部命中 / 阴性不中）+ T-03.2（tasks:50）+ 验证 `check --only colors`（tasks:53）。
- [x] **AC-001-3** T-03 `check:glass`（`backdrop-filter` 只在 glass.css、`.glass-*` 仅三类）+ 人工 M-01（T-15）。
- [x] **AC-001-4** T-04.1 `format.spec`（en dash / 正号 / 取整后判零 / 无负零 / pct）+ T-04.2 `typography.spec`（类）+ T-14.2 浏览器计算字体族。
- [x] **AC-001-5** T-03 `check:updown`（plan:158 三条：涨跌令牌只在 `updown.css`；`updown.css` 内引用涨跌令牌的声明只能是 `color:`；只被 `market-board/`、`watchlist/`、`FocusBand.vue` 引入）+ T-04.3 + T-11.1 / T-11.5（`check --only updown`）+ T-14.3（`.sem-market` 只在登记容器且背景非涨跌色）。
- [x] **AC-001-6** T-03 `check:colors`（退役五值不在令牌 / 生成物 / 源码；五值与 PALETTE_CORE `palette-retired` 一致）。
- [x] **AC-002-1** T-08.2 e2e：首帧静态骨架可见 → 工作台；首帧样式来自 T-02 生成块；T-08 范围含 `index.html`（静态骨架标记）。
- [x] **AC-002-2** T-08.1 e2e：八项顺序、`aria-current`、占位页归属文案、直接打开非工作台地址并刷新仍停留。
- [x] **AC-002-3** T-08.5 e2e：`window.__FAI_MOCK__` 注入研究项 → 菜单多一项。
- [x] **AC-002-4** T-08.4 组件：ticker 条目、状态点 fresh / stale 令牌类；`tests/component/topbar.spec.ts` 在 T-08 范围。
- [x] **AC-002-5** T-08.3 e2e：折叠 → reload 仍折叠（`fai.rail`）。
- [x] **AC-002-6** T-14.1 e2e：960 / 979 / 981 / 1239 / 1241 / 1399 / 1401 / 1499 / 1501 / 1440×900 十个视口，断言侧栏形态、栅格列数、焦点带卡数、无横向溢出；断点 980 / 1240 / 1400 / 1500 与 FTEngine UI_LAYOUT 登记值一致（已核源文件）。
- [x] **AC-002-7** T-08.2 e2e：加载页进度 / 通知文案；`boot-error` 场景首次失败显示原因 → 重试 → 进入工作台。
- [x] **AC-003-1** T-10.1 组件：结论条目、数字、方向类。
- [x] **AC-003-2** T-10.3 e2e：点击 → `/daily/<date>`。
- [x] **AC-003-3** T-10.3 组件：`brief = null` → 空态文案 = 契约 `reason`。
- [x] **AC-003-4** T-10.2 组件：market 用涨跌类、analysis 用"红 = 负"类。
- [x] **AC-003-5** T-10.2 组件：market 只在行情段、analysis 只在指标段、涨跌类只在行情段 + 人工 M-03（T-15；矩阵已标注）。
- [x] **AC-003-6** T-10.4 e2e：模块库无焦点带、无移除钮，增删模块后仍在。
- [x] **AC-004-1** T-09.3 e2e：默认七个且 = 目录顺序；模块库七项带状态与 `description`；`grid-column` 取 `min(defaultSpan, 列数)`。
- [x] **AC-004-2** T-09.4 e2e：上移 / 下移 / 移除 / 添加（末尾）→ reload 保持（`fai.layout`）。
- [x] **AC-004-3** T-09.1 组件逐模块 DOM 契约（`data-badge="ok|warn|bad|sample"`、`data-ai="none|running|done"`、样例态虚线边 + 文字"样例"）+ T-09.5 e2e 页面遍历 + T-11.4 四个壳模块占位。
- [x] **AC-004-4** T-09.2 组件：三态 + 诊断复制；T-14.4 e2e：`error` 场景模块错误态可达、诊断可复制，验证 `-g "AC-004-4"`。
- [x] **AC-004-5** T-11.1 盘面四态格 / 等宽右对齐 / 红涨绿跌、T-11.2 关注列表对齐 / 千分位 / 只涂字色 / Spark 输入为 SparkSeries、T-11.3 日程升序 + 人工 M-04（T-15）。
- [x] **AC-004-6** T-03 `check:grid`（`grid-template-columns` 不得裸 `1fr`，零豁免；plan §2.2 shell 用 `minmax(0,1fr)`）。
- [x] **AC-005-1** T-13.1 e2e：八路由输入栏可见、提交 → 抽屉展开显示用户消息。
- [x] **AC-005-2** T-13.3 组件：回放 success / failure / retry，步骤可展开、`step.error` 呈现、唯一终态行（tasks:205；plan:210 同口径，`2c2fbc8` 已去掉已删除的 abort 脚本）。spec 只要求完成 / 失败两种终态，映射成立。
- [x] **AC-005-3** T-13.4 e2e：`long` 脚本下切页与收抽屉两种情形，同一 run、步骤增加、无重复（应用级订阅，plan §2.5）。
- [x] **AC-005-4** T-13.5 e2e：`data-ai` running → done → 点击模块后 none。
- [x] **AC-005-5** T-13.5 e2e：在布局 → 导航 + 高亮；已移除 → 时间线内联提示 + "添加回工作台"、布局不变、从非工作台路由发起也完成加回 → 导航 → 等挂载 → 滚动 → 高亮；不存在 → 提示且不跳转；页面目标 → `router.push(path)`（plan 行为）。
- [x] **AC-005-6** T-06.2（十种事件 schema 可校验、终态唯一断言，字段表见 plan:121）+ T-07.3（四份脚本各恰好一个终态，tasks:105）+ T-07.4（CONTRACT.md 含全部事件类型）；plan §5 AC-005-6 行已改"四份脚本"（plan:214）。
- [x] **AC-005-7** T-13.2 e2e：closed / half / tall 切换 + reload 保持（`fai.drawer`）；运行中指示出现、终态消失。
- [x] **AC-006-1** T-12.1 unit：主题对象与令牌一致、不含退役色。
- [x] **AC-006-2** T-12.2 unit：对最不利单层卡面 `#252629` 序列 / 类目色 ≥ 3、文字用色 ≥ 4.5、中性退后色豁免登记；plan §2.1 的对比度值经 WCAG 相对亮度公式逐一复算一致（C-01）。
- [x] **AC-006-3** T-12.3 e2e：经 `window.__FAI_TEST__.charts`（仅 mock 模式）读 `getOption().color` 与令牌一致。
- [x] **AC-006-4** T-12.3 e2e：`backgroundColor` 透明 + 人工 M-08（T-15；矩阵已标注）。
- [x] **AC-007-1** T-03 `check:network`（`fetch(` / XHR / WebSocket / EventSource / axios 只在 `src/contracts/real/`），与 AC 字面"允许名单只含契约实现层"一致（plan:218 `check.network` 为笔误，S-15）。
- [x] **AC-007-2** T-07.2 unit 五种场景（含 error 下 bootstrap 与目录成功）+ T-14.4 e2e normal / empty / error / slow。
- [x] **AC-007-3** T-06.3（`DataClient` 10 个方法 + `AgentClient` `send` / `subscribe` 每方法有语义条目、每字段有描述）+ T-07.4（CONTRACT.md 覆盖方法、错误形态与事件）+ `check:generated` 重生成 `contracts/{CONTRACT.md,schema.json}` 逐字比对（plan:155；T-07 验证 4 `contract && check --only generated`）。
- [x] **AC-007-4** T-06.1（Figure / BoardCell / SparkSeries 三形态，缺元数据与 `ok` 缺 figure 反例被拒）+ T-07.1（fixtures 全部过 schema，关注列表为合约价格）。
- [x] **AC-008-1** T-05.1（原 id、`source / source_verified / migrated / adaptation`、`## 暗色适配` 段）+ T-15.3（designUI 引用指向真实条目）。
- [x] **AC-008-2** T-05.3 "tokens.json 每个 `source` 可解析到本任务条目锚或 designUI 节号"，验证 `-t "AC-008-2 sources"`（tasks:81）；矩阵 AC-008-2 → T-02、T-05（tasks:271）；T-02 验证 2 注明"由 T-05 验证"（tasks:41）。
- [x] **AC-008-3** T-05.2 / plan §5："14 个 palette-core 原色（按不同 hex 计）"（tasks:76、plan:222），与 plan §2.1 表及 PALETTE_CORE 一致。
- [x] **AC-009-1** T-01（依赖 / 构建 / 冒烟打底）+ T-15.1 `pnpm test` 一条命令（`check` + `typecheck` + `lint` + `test:unit` + `test:e2e`，plan:162）退出码 0。
- [x] **AC-009-2** T-15.2 `manual-acceptance.md` M-01 ~ M-08 各写"看什么"，八项含义已列全（tasks:238）+ Handoff 截图。

## 工程准则（AGENTS §5）专项核查

- [x] **P-1 不为猜测场景加复杂度、不悄悄扩大范围（§5.1）。** 精简版已去掉的推测性项（ESLint 级网络守卫、layering 守卫、几何 e2e、ac-coverage、pi 归约层、守卫自检）核对无误；保留项逐一有 AC 或 Clarify 依据：`boot-error`（AC-002-7）、error 下 bootstrap 成功（AC-004-4 可达）、`__FAI_MOCK__` 注入（AC-002-3）、`__FAI_TEST__` 钩子（AC-006-3）、`step.error` + `retry` 脚本（Q-014：pi 自动重试须有非终态映射）、`grid-column: span min()`（窄窗口不溢出）。第一轮唯一的范围扩大——中止功能——已按方案 (2) 收回且全文一致（plan:117 Dock 无中止钮、plan:122 "`run.aborted` 只作为事件类型存在…v1 不做中止交互"、plan:123 / :210 / :214 与 tasks:105 / :205 均为四份脚本、plan:140 无 `abort()`）；"目录有、注册表无"分支亦删（S-09）。
- [x] **P-2 外部数据只在入口层校验（§5.2）。** plan §2.7 明示"mock / real 实现对自己返回的数据做一次 parse，内部组件直接消费已确定类型的值"；SparkSeries 跨字段 refine 已删；`layoutStore` hydrate 丢弃目录外 id 属 localStorage 边界校验；BoardCell `ok ⇔ figure ≠ null` 是边界 schema 约束。措辞提醒 S-07 未采纳（不阻断）。
- [x] **P-3 不提前抽只用一次的抽象（§5.3）。** StorageAdapter、Toast 已删；`DataTable` / `BoardGrid` / `Spark` / `Kpi` 虽 v1 各只一处使用，但各对应 FTEngine 具名设计概念（table_data / board / spark_rng / KPI 例外）且有独立测试，符合"代表一个能起清楚名字的概念"；`ModuleSummary` 四模块共用、`PlaceholderPage` 七路由共用；无消费者的 `AgentClient.getHistory` 已删（plan:140、tasks:91，B-08(a)）。
- [x] **P-4 主函数只写正常流程（§5.4）。** plan §4 四条关键流程均为主路径 + 一处失败分支（启动）；§2.5 引导跳转四种情形为需求分支而非细节混杂。真正落实在代码层，Review 阶段核 `bootstrap()` / `send()` 流程函数。
- [x] **P-5 自动生成文件不手改（§5.5）。** 三类生成物（`src/design/generated/*`、`index.html` 首帧块、`contracts/{CONTRACT.md,schema.json}`）均由 `check:generated` 重生成逐字比对（plan:155），`pnpm test` 以 `check` 开头（plan:162），§6 "生成物漂移"行覆盖三者（plan:234），§2.7 明示 contracts "生成物入库、不手改"（plan:146）——B-04 闭环。实施提醒 S-17：T-03 时 `contract-build.mjs` 与 `contracts/*` 尚不存在，`generated` 对 contracts 的比对须在生成器缺失时跳过。
- [x] **P-6 测试测真实实现、少用 mock（§5.6）。** 六条 check 直接扫真实仓库；AC-001-2 的最小样例只核 `colors` 规则本身（spec 明文要求，方案 (1)，plan:162 / tasks:5 / :45 口径一致），其他五项检查不写自检；组件 / e2e 测真实组件，数据经契约 mock 实现在系统边界注入（spec R-007 要求的形态）；不 vi.mock 内部模块；`format.spec` 测真实 `fmtValue` / `fmtDelta`；对比度测试自带 WCAG 公式作 oracle（应用内无该逻辑，不构成抄逻辑）；`__FAI_TEST__` 钩子只在 mock 模式。
- [x] **P-7 按仓库现有流程、不引入未在用工具（§5.7）。** 仓库无前端代码，工具链由 D-008 与 spec R-009 决定：pnpm / Vitest / Playwright（复用本机 Chrome）/ zod（AC-007-4 + R-007 文档生成）/ ESLint 均有需求依据；Prettier 已去除（plan:10，换行交 `.gitattributes`；目录树 plan:16 残留一处 `.prettierrc`，S-08 备注）；工作流（spec-driven、每任务一提交、`pnpm test` 一条命令）与 data-layer 一致。

## 其他自定义项

- [x] **C-01 Q-003 暗色配色表可复算。** 对 `#252629`（白 .045 叠 `#1B1C1F`，复算相符）用 WCAG 相对亮度重算 plan §2.1 表除霜地（α 叠加）外的 16 行（12.1 / 5.4 / 6.4 / 4.1 / 5.8 / 6.9 / 9.4 / 5.7 / 6.4 / 4.8 / 2.0 / 5.9 / 4.9 / 4.2 / 5.6 / 5.3）及文字次 5.2、弱 4.6，共 18 个值与表值一致；阈值分级（线条 ≥ 3、文字 ≥ 4.5、点睛红非文字 ≥ 3、中性退后不设限）自洽；Walter 2026-10-27 裁定 A 等亮已记入 plan，样张 `assets/palette-dark-candidates.html` 在库。
- [x] **C-02 FTEngine 源资产存在且关键数值核实。** `D:\FTEngine\design\UI\{Foundations,Colors,Fonts,Layout,Components,Cards,Tables,Navigation}` 八份条目与 `Graphs\Palette\PALETTE_CORE.md` 存在；`palette-core` 不同原色 14 个、`palette-retired` 五值 = plan 退役清单；UI_LAYOUT `shell_collapse 980 / g4_2 1240 / g5_3 1400 / g3_2 1500`；UI_FONTS `type_scale.main` 45 键 = plan "main_scale 45 键全量"。
- [x] **C-03 D-013 登记位置 ↔ plan 守卫名单 ↔ fixtures 语义来源一致。** 三个位置（行情价格模块、关注列表、焦点带行情段）= `updown.css` 允许引入 `market-board/`、`watchlist/`、`FocusBand.vue`；焦点带内按 `semantic` 分段、指标段红 = 负；状态色不用绿；分析图表缥碧保持色板身份。
- [x] **C-04 mock 隐私与 backend 隔离。** plan §3：fixtures 不含真实头寸 / 凭证 / 私有文档；不写用户数据目录；不触碰 `backend/`；`.gitignore` 只追加四行（tasks:20 已列明，`dist/` 根文件已有；目录树不用 `lib/`，`*.spec` 不匹配 `.spec.ts`，无误伤）。
- [x] **C-05 Q-007 "经存储接口隔离"与 §5.3 的关系已记录。** Q-007 属推断性实现措辞（spec 规定实现机制一律在 plan），R-002 / R-004 的 AC 只验持久化行为；AGENTS §5 与 §2 同等强制，plan §3 以"三个 `fai.*` 键集中登记、不做抽象层"落实，不构成需求变更、无需回流 Clarify。
- [x] **C-06 Q-014 pi 可映射性保留。** plan §2.5 保留 pi 1.4.0 `docs/json.md` / `docs/rpc.md` 的对照表与 `agent_settled` 归约规则（文字级），`step.error.willRetry` 兼顾 `auto_retry_start` 与 `compaction_end.willRetry`，`run.aborted` 对应 `agent_settled.aborted`；本 feature 不接 pi、不实现归约代码，符合"对照、保证可映射"。

## 阻断项（第一轮发现 → 逐轮复核 → 全部闭环）

| # | 类别 | 问题（第一轮） | 复核 #2（50c26dd） | 复核 #3（666b671） | 复核 #4（2c2fbc8）· 依据 |
|---|---|---|---|---|---|
| **B-01** | 一致性 | "16 个原色"与 §2.1 表 / PALETTE_CORE 的 14 个不同 hex 不符 | 闭环 | 闭环 | **闭环（未回退）**：plan:222、tasks:76 "14 个 palette-core 原色（按不同 hex 计）" |
| **B-02** | 可测试性 | 矩阵归 T-11 / T-14，但两任务完成标准未引用 AC-001-5 / AC-004-4 | 闭环 | 闭环 | **闭环（未回退）**：tasks:171 / :175 / :181（T-11，`check --only updown`）、tasks:224 / :229（T-14，`-g "AC-004-4"`）；脚本矩阵 ↔ 完成标准 diffs=[] |
| **B-03** | 可测试性 / 依赖 | AC-008-2 自动测试无承担任务；两个测试文件无归属 | 闭环 | 闭环 | **闭环（未回退）**：tasks:72 / :81 / :271 / :41（T-05 拥有 `design-registry.spec.ts`、验证 `AC-008-2 sources`、矩阵 T-02、T-05、T-02 验证 2 注明）；tasks:116（T-08 含 `index.html` 骨架与 `topbar.spec.ts`） |
| **B-04** | §5.5 | `contracts/*` 为入库生成物却无重生成比对 | 未闭环 | 闭环 | **闭环（未回退）**：plan:155 `generated` 含 `contracts/{CONTRACT.md,schema.json}`、plan:234 §6、plan:146 §2.7、tasks:111 T-07 验证 4 |
| **B-05** | 一致性 | (a) `colors` 未豁免登记处；(b) `updown` 缺"只写 `color`"第三条 | 未闭环 | 闭环 | **闭环（未回退）**：plan:156（豁免 `tokens.json` / `generated/*`、具名色只在样式声明值位置、先跑 `check-samples`）；plan:158（"只能是 `color:`"） |
| **B-06** | 需求完整性 | spec R-007 "错误形态"无 plan 落点 | 未闭环 | 闭环 | **闭环（未回退）**：plan:147 错误形态 `{error: {code, message, retryable}}` + code 集合 + 写入 CONTRACT.md；tasks:106 T-07.4 |
| **B-07** | spec ↔ plan 冲突 | 冻结 AC-001-2 要求阳性 / 阴性样例，plan 取消全部样例 | 方案 (1) 主体落实；残留 ①②③ | plan 侧闭环（①）；残留 ②③（tasks T-03） | **闭环**：② tasks:5 头部"去掉了守卫样例自检（AC-001-2 明文要求的 `colors` 最小样例除外）"，tasks:45 T-03 上下文"直接扫真实仓库；仅 `colors` 按 AC-001-2 先跑最小样例"；③ tasks:53 T-03 验证 2 改为 `pnpm -C frontend check --only colors`（该检查内部先核样例、再扫仓库），与完成标准 2（tasks:50）及 plan:156 机制一致，不再指向无归属的 vitest 测试；tasks 全文 `不写样例自检` = 0、`AC-001-2 samples` = 0 |
| **B-08(a)** | §5.3 | `getHistory` 无消费者 | 闭环 | 闭环 | **闭环（未回退）**：plan:140 `send({sessionId?, message}) / subscribe(cb)`；tasks:91 "`AgentClient`（`send` / `subscribe`）" |
| **B-08(b)** | §5.1 范围 | 中止功能不在 spec（事件、中止钮、`abort()`、abort 脚本） | 方案 (2) 主体落实；残留 2 处 | 残留 3 处（plan:210 / :214、tasks:205） | **闭环**：plan:210 AC-005-2 行"success / failure / retry 回放"；plan:214 AC-005-6 行"四份脚本"；tasks:205 T-13.3 "回放 success / failure / retry"；与 plan:123（四份脚本）、plan:122（`run.aborted` 只作事件类型，v1 不做中止交互）、plan:121（事件仍 10 种）、tasks:105（T-07.3 四份）全文一致；`retry / abort` = 0、`五份` = 0 |

## 建议（不阻断、不计入判定）

| # | 位置 | 建议（第一轮） | 最终状态（2c2fbc8） |
|---|---|---|---|
| S-01 | plan §2.5 | 恢复逐事件字段清单 | **已采纳**（plan:121） |
| S-02 | plan §2.5 | 补页面目标跳转 | **已采纳**（plan:120） |
| S-03 | plan §2.4 | `data-badge` 值域与样例态做法 | **已采纳**（plan:112） |
| S-04 | plan §2.7 / §2.1 | 各类型含哪些 Figure 字段；mock / real 切换配置；"文字用色"清单 | **未采纳**。理由可接受：T-06 zod 为唯一定义，AC-006-2 阈值已在 plan:56；信息级 |
| S-05 | tasks T-01、T-08 | 列出 `.gitignore` 追加行；T-08 加 `index.html` | **已采纳**（tasks:20、:116） |
| S-06 | 矩阵、T-15 | 人工项标注；M-01 ~ M-08 含义 | **已采纳**（tasks:257 / :265 / :238） |
| S-07 | plan §4 流程 3 | "唯一终态"注明是契约保证 | **未采纳**（plan:181 原文）。信息级 |
| S-08 | plan §1 | 不引 Prettier | **已采纳**（plan:10）；残留 plan:16 目录树仍列 `.prettierrc`（编辑性，实施期顺手删） |
| S-09 | plan §2.4 | 删"不可用"分支 | **已采纳** |
| S-10 | tasks T-08 / T-13 | 工时偏紧 | **已采纳**（tasks:276 末行拆分规则） |
| S-11 | D-013 勘误段；specs/README.md | "四个"→"三个"；状态表同步 | **已采纳**（D-013:45；specs/README.md:23） |
| S-12 | tasks 约定 | 文件边界句 | **已采纳**（tasks:12） |
| S-13 | plan §2.8 `colors` | 具名色限定样式声明上下文 | **已采纳**（plan:156） |
| S-14 | plan §2.8、T-03 / T-04 | `--only` CLI 形式；`tokens:check` 与 `check:generated` 重复 | **已采纳**（plan:162） |
| S-15 | plan §5 AC-007-1 行 | （50c26dd 引入）`check.network` 应为 `check:network` | **未改**（plan:218）；编辑性，实施期顺手改 |
| S-16 | tasks T-15 修改范围 | T-15 验证 3 要改 T-05 拥有的 `design-registry.spec.ts`，范围未列 | **未改**（tasks:234）；实施期加入范围即可 |
| S-17 | plan §2.8 `generated` / tasks T-03 | T-03 时 `contract-build.mjs` 与 `contracts/*` 尚不存在（T-07 创建）；`generated` 对 contracts 的重生成比对须在生成器 / 目标缺失时跳过，否则 T-03 验证 1 在 T-07 前失败 | **未改**；实施 T-03 时按此处理，Converge 核 |

## 结构核验证据（只读内存脚本，未写文件、未安装依赖）

```text
ROUND 4  基线 = HEAD 2c2fbc8（plan 2+/2−、tasks 4+/4−，只触及第三轮点名的 5 处）；spec.md 自 1b5659d 未动
SPEC_AC   45（编号集合 = 完成标准集合 = 矩阵集合 = plan §5 集合，missing=[]）
TASKS     15（T-01 ~ T-15）；依赖 forward=[] missing=[] cycle=False
HOURS     逐项求和 25.5 = 末行 25.5；单项范围 [1.0, 2.0]
CRITERIA≠MATRIX  diffs=[]；CRITERIA/VERIFY 15 任务条数全部相等
PLAN_TASK_REFS   plan 只引用 T-01、T-08，均存在
FIVE_SPOTS  tasks:5 头部括注 ✓ | tasks:45 T-03 上下文 ✓ | tasks:53 `check --only colors` ✓ | tasks:205 T-13.3 无 abort ✓ | plan:210 无 abort、plan:214 四份 ✓
RESIDUAL_GREP    `retry / abort` = 0；`五份` = 0；tasks `不写样例自检` = 0；tasks `AC-001-2 samples` = 0
NON_BLOCKING     plan:218 `check.network` = 1（S-15）；plan:16 `.prettierrc` = 1（S-08）
NOT_REVERTED     B-01 ~ B-06、B-08(a) 的全部依据行号在 2c2fbc8 上逐一复核，均在
ROUND 1–3 同项：TASK_DAG 四轮均通过；CONTRAST 18 值复算一致；SOURCE 八份条目 + 断点 + 45 键核实
```

## 结论与下一步

1. **通过，tasks.md 自此生效（基线 `2c2fbc8`）。** 8 项阻断 B-01 ~ B-08 全部闭环，70 项检查全部勾选；spec 冻结内容（`1b5659d`，45 条 AC）全程未动，无需重过 Gate 1。按 AGENTS §2 进入 **Analyze → Implement**（Implement 前再读本文件复选框状态作前置条件；实施者不改本文件）。
2. **实施期顺手项（不阻断）**：S-15（plan:218 `check.network` → `check:network`）、S-08 残留（plan:16 目录树 `.prettierrc`）、S-16（T-15 范围加 `tests/unit/design-registry.spec.ts`）、S-17（`generated` 对 contracts 在生成器缺失时跳过，T-03 实施时处理）；S-04 / S-07 为信息级，不要求采纳。Converge 时一并核。
3. **Gate 2 前需 Walter 知悉的事项**（已在文档中如实记录，本阶段不阻断）：
   ① **D-013 勘误记录**：编辑性更正（"新增位置须先修订本 ADR"→"新增后继 ADR、本 ADR 保持原样"），位置计数已改"三个"；ADR README 尚无"编辑性勘误"机制，本例为首例，建议后续在 README 补一句；
   ② **中止交互未纳入 v1**（方案 (2)）：`run.aborted` 只保留为事件类型，供 agent-runtime 映射 pi `agent_settled.aborted`；无中止钮 / `abort()` / abort 回放脚本（plan §2.5、§2.7）；若日后需要用户中止，属新增需求，回流 Clarify；
   ③ **AC-001-2 的 `colors` 最小样例**（方案 (1)）：只对 `colors` 检查保留 `scripts/check-samples/colors/{positive,negative}.css` 并在检查内部先核；其他五项检查不写自检（plan §2.8、T-03）；
   ④ **Playwright 复用本机 Chrome**：`channel: chrome`，找不到时回退 `msedge`，再不行一次性 `playwright install chromium`（plan §6）；验收浏览器 = Chromium 内核，Electron 外壳归 desktop-shell（spec §4、Q-006）；
   ⑤ **暗色序列色 ΔE2000 = 13.2 的取舍**：七色两两最小色差 13.2（亮色原版同口径 21.5），黑底压缩了可用明度区间；Walter 已裁定 A 等亮（Q-003），v1 接受并登记于 PALETTE_DARK，chart-templates 画出真实季节图后复核（plan §2.1、§6）；
   ⑥ 另两项背景：Q-007 "经存储接口隔离"按 AGENTS §5.3 落实为三个 localStorage 键集中登记、不做抽象层（C-05）；Node 25（非 LTS）/ TS 7 / Vite 8 / Vitest 5 组合由 T-01 冒烟决定，vue-tsc 不兼容则锁 TS 5.9.x 并回写 plan §1（plan §6）。
4. 本轮只更新本文件；未修改 spec / plan / tasks / docs，未安装依赖、未运行项目测试、未 commit。本文件的勾选是需求 / 设计质量证据，不是实现验收证据；Review 阶段仍按 spec + plan + tasks + git diff 评审。
