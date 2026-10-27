# Feature: frontend-workbench 质量检查清单（审核员 B：gpt-6.1-sol）

> Checklist 阶段独立审核产物；审核员 B = `openai/gpt-6.1-sol`，日期：2026-10-27。
> 审核基线：分支 `feat/frontend-workbench`，HEAD `35865dc6f8da77ef29ad2ab41727553044464038`，审核开始时工作区干净。
> 仅勾选本会话确认满足的**需求与实施设计质量**，不表示代码已实现或测试已通过；不代签审核员 A，也不代替双审共识版 `checklist.md`。
> 本文中的 `spec.md` / `plan.md` / `tasks.md` 均指 `specs/frontend-workbench/` 下同名文件。F-01～F-22 是问题定位索引，不另外计入检查项数。

**结论：不通过，须修订后复审。共 64 项：通过 37 项，未通过 27 项；其中逐 AC 审查 41 项：通过 28 项，未通过 13 项。**

**Q-015 专项结论**：关注列表改为合约价格、红涨绿跌，已贯穿 spec 的 R-001 / R-004 / AC-001-5 / AC-004-5，以及 plan 的样式范围、模块定义、验收映射和 tasks 的守卫、fixture、模块实现任务，未见旧的“行情价格是唯一使用涨跌专色的模块”作为现行要求残留。但修订版仍待 Walter 重过 Gate 1，且涨跌色守卫尚不能证明“仅限登记位置、只涂字色”；不能据此使草案任务生效。

## 需求完整性

- [x] N-01 每条编号需求都有至少一条可验证的验收规则。spec.md §3 有 R-001～R-009，共 41 条唯一 AC；plan.md §5、tasks.md 末尾覆盖矩阵均有对应落点（含合并行 / 范围写法）。
- [ ] N-02 所有 what 均有完整的验收闭环。R-007 的“模块库定义全部经契约读取”没有接口落点，分页 / 时间参数约定未定；R-005 的收起抽屉后继续运行没有明确验证步骤。位置：spec.md R-005 / R-007；plan.md §2.5 / §2.7 / §5；tasks.md T-09 / T-11 / T-24；见 F-12 / F-14 / F-22。
- [ ] N-03 无未澄清歧义。KPI 数字字族优先级、1240 断点究竟作用于哪个栅格、跳转到已移除模块的处理仍不唯一。位置：spec.md R-001 / R-002 / R-004 / R-005；plan.md §2.1 / §2.3～§2.5；见 F-02 / F-05 / F-15。Q-015 的行为回答已记录，但重新批准状态另见 C-01。
- [x] N-04 产品目标与非目标边界清晰。spec.md §2 / §4 明确本 feature 交付浏览器内 mock 工作台地基；真实 API、Electron、14 种图表模板、各 domain 页、亮色导出、自定义拖拽均不在本次范围。文件修改边界的冲突不在此项放行，见 I-04。

## 一致性

- [ ] I-01 spec / plan / tasks 无冲突。启动重定向与深链刷新、模块库可见性、断点、令牌来源等仍有冲突或缺口；见 F-03 / F-04 / F-05 / F-13。当前无 Analyze 产物本身不作为 Checklist 阶段的缺陷；修订后仍须按 AGENTS.md §2 执行 Analyze，不能以本次审核替代。
- [ ] I-02 与 docs/ 决策及 ADR 全面一致。主要技术与交互方向一致，但 plan.md §2.1 的“绿色全站只表示跌”与应保留的分析图表缥碧身份冲突；令牌来源捷径也弱于 designUI.md §8 的条目登记纪律。位置：docs/designUI.md §2.2 / §2.3 / §8，spec.md R-006 / AC-008-2，plan.md §2.1；见 F-13 / F-21。
- [x] I-03 核心架构落点符合 D-002 / D-004 / D-008 / D-011。Vue + Vite + TS + Pinia、ECharts、固定栅格、工作台焦点带、底部抽屉与应用级后台订阅均有设计落点；不新增 Electron 或 Python API 实现，不引入与 D-009 / D-012 冲突的存储或 MCP 写者。位置：plan.md §1 / §2.2～§2.7，tasks.md T-01 / T-12～T-24。
- [ ] I-04 修改范围、文档同步与回滚清单一致。spec.md §4 和 plan.md §1 只列两个共享文件，但 R-008、plan.md §2.9 与 T-27 又要求修改 docs/designUI.md；tasks.md 边界未包含 specs/README.md，plan.md §6 回滚也漏掉这两类共享文档变更。见 F-18。

## 可测试性

- [ ] V-01 每条 AC 都有足以判定其完整要求的测试或人工步骤。41 条均有名义映射，但运行时令牌、颜色范围、网络范围、路由、错误场景、契约元数据等映射仍不充分；以下逐项列明，不把“有命令”当作“能证明 AC”。
- [ ] V-02 任务粒度、依赖与验证命令满足 tasks.md 模板的完整要求。形式粒度已满足（C-08），但 T-04 的前置文件依赖不闭合，T-11 的文档测试命令无明确测试文件归属，长运行脚本的选择入口未定；见 F-17。

### R-001 设计系统与令牌（6 条 AC）

- [ ] AC-001-1 令牌登记与运行时样式 / 主题对拍。plan.md §2.1 / §2.8 / §5、tasks.md T-05 / T-18 只安排生成物 diff 与断点检查，未安排逐令牌浏览器运行时取值；见 F-06。
- [ ] AC-001-2 零未登记色值字面量。plan.md §2.8、tasks.md T-06 的扫描不含根 index.html，且只列部分颜色语法，`color: red` 等可逃逸；见 F-07。
- [x] AC-001-3 三层玻璃。plan.md §2.1 / §2.8、tasks.md T-07 将定义限定为 focus / module / drawer 三类，限制 backdrop-filter 定义位置与规则数，并安排 T-26 的 M-01 整页截图检查；满足三种登记层级的静态与人工验收设计，不把同层级的多个模块实例误算为多个新层级。
- [ ] AC-001-4 字族分工与数值规则的唯一性。格式化用例已明确，但 KPI 大数既被要求 serif，又受“一切数值 mono”约束；typography 测试无法据此获得唯一预期。位置：spec.md R-001，plan.md §2.1 / §5，tasks.md T-08；见 F-02。
- [ ] AC-001-5 涨跌色限行情语义且只涂字色。Q-015 的三处允许位置已同步，但只检查 updown.css 的 import 路径不能限制全局选择器实际作用位置，也未禁止以涨跌令牌涂底。位置：plan.md §2.1 / §2.8 / §5，tasks.md T-07 / T-08 / T-19 / T-20；见 F-08。
- [ ] AC-001-6 退役色不出现在令牌、主题与源码。令牌 / 生成物扫描和五色清单已安排，但根 index.html 也是前端源码，未纳入列明的源码扫描范围。位置：plan.md §2.8，tasks.md T-01 / T-06；见 F-07。历史配色样张中的原色展示不应误算运行时代码违规。

### R-002 应用外壳与导航（6 条 AC）

- [x] AC-002-1 加载页到工作台、无空白帧。plan.md §2.2 / §4 / §5、tasks.md T-13 明确静态首帧骨架、挂载后同构骨架、bootstrap 成功 / 失败分支及截帧检查；具备可执行的验收设计。
- [ ] AC-002-2 菜单 / 当前项 / 占位页 / 刷新保持。八项与地址已明确，但 bootstrap 成功总是跳 /workbench，破坏 /prices 等深链刷新。位置：plan.md §2.2 / §4 流程 1，tasks.md T-12 / T-13；见 F-03。
- [x] AC-002-3 动态研究子项。plan.md §2.7 / §5、tasks.md T-10 / T-14 指定 fixture 注入 N→N+1 与菜单项数量断言，不依赖真实研究后端。
- [x] AC-002-4 ticker 与数据源状态。plan.md §2.2 / §5、tasks.md T-14 指定 mock 条目与 fresh / stale 令牌类映射测试；未把 fresh 错映射为行情跌色。
- [x] AC-002-5 侧栏状态持久化。plan.md §2.2 / §3、tasks.md T-12 明确 StorageAdapter、命名空间、收起→刷新仍收起的 E2E。
- [ ] AC-002-6 窄窗口断点。视口集合与无横向溢出断言已明确，但 spec 所说的 1240 栅格收缩与 plan 的模块栅格断点不是同一张映射表。位置：spec.md R-002 / R-004 / Q-004，plan.md §2.3 / §2.4 / §5，tasks.md T-18；见 F-05。

### R-003 工作台与今日焦点带（4 条 AC）

- [x] AC-003-1 摘要结论、数字与方向。plan.md §2.3 / §5、tasks.md T-17 具备 fixture 驱动组件测试与明确渲染字段。
- [x] AC-003-2 跳转携带当日标识。plan.md §2.3 / §5、tasks.md T-17 指定 `/daily/<date>` 与 E2E 路由断言。
- [x] AC-003-3 无日报空态。plan.md §2.7 提供 getDailyBriefStatus 的原因字段，§5 与 T-17 明确 null / 原因文案测试；不要求本 feature 生成真实日报。
- [x] AC-003-4 声明语义驱动取色。plan.md §2.3 / §5、tasks.md T-17 分别测试 market / analysis，且共享 Num 有对应映射设计；全局样式范围与“只涂字色”问题仍由 AC-001-5 阻断，不在本项代为放行。

### R-004 模块系统（6 条 AC）

- [ ] AC-004-1 七模块在模块库可见并可管理。plan.md §2.4 规定模块库只显示未启用模块，默认七个全启用时模块库为空，与 spec 的“七个模块在模块库中可见”不符；T-16 测试未覆盖此差异。见 F-04。
- [x] AC-004-2 顺序与布局持久化。plan.md §2.4 / §5、tasks.md T-16 明确上移 / 下移 / 移除 / 追加末尾与刷新保持；存储访问经接口隔离。
- [x] AC-004-3 模块壳结构。plan.md §2.4 有统一 DOM 契约，T-15 / T-16 / T-20 分别负责组件、页面遍历和四个占位模块；结构检查不是仅靠视觉抽查。
- [x] AC-004-4 加载 / 空 / 错误与复制诊断。plan.md §2.4 / §5、tasks.md T-15 安排三态组件测试和剪贴板 mock；全局 error 场景的可达性另由 AC-007-2 阻断。
- [x] AC-004-5 三代表模块的 mock 形态。plan.md §2.4 / §5、tasks.md T-19 / T-20 / T-26 覆盖休 / 待 / 缺数、关注合约价格表与 Spark、红涨绿跌字色及日程列表，人工 M-04 补视觉检查；Q-015 行为无旧版本冲突。
- [x] AC-004-6 裸 1fr。plan.md §2.4 / §2.8、tasks.md T-07 明确 minmax 约束、守卫样例与有来源的 shell 例外；模块栅格本身没有获准裸 1fr。

### R-005 AI 对话抽屉与 CoT 时间线（6 条 AC）

- [x] AC-005-1 全局输入、提交与抽屉。plan.md §2.5 / §5、tasks.md T-22 有八路由可见、用户消息、两档高度及收起操作的 E2E 落点。
- [x] AC-005-2 mock 时间线展开与终态。plan.md §2.5 / §5、tasks.md T-23 明确 success / failure 脚本、步骤数量、详情展开 / 收起和终态显示；不把此项等同于真实 pi 终态映射已正确（C-09）。
- [x] AC-005-3 切页不中断。plan.md §2.5 / §5、tasks.md T-24 指定应用级订阅及跨页期间产生步骤、无重复的断言；收抽屉期间的独立场景仍缺，见 C-10。
- [x] AC-005-4 角标运行→完成→查看清除。plan.md §2.5 / §5、tasks.md T-24 指定 moduleId、data-ai 和用户点击清除流程；成功路径可确定验收。
- [ ] AC-005-5 导航并高亮目标。plan.md §2.5 / §5、tasks.md T-24 没有定义目标模块已被移除时如何满足高亮要求，也没有该组合场景测试；见 F-15。
- [x] AC-005-6 类型、文档与三脚本。plan.md §2.5 / §2.7 / §5、tasks.md T-09 / T-10 / T-11 分别安排九类事件定义、逐事件 schema 校验、成功 / 失败 / 长运行脚本和 contract-doc 事件字段对拍。额外 doc 单测的文件归属及回放选择入口仍须按 V-02 / F-17 补齐；pi 对照也未在本项代为放行（C-09）。

### R-006 图表暗色主题（4 条 AC）

- [x] AC-006-1 主题与令牌、退役色。plan.md §2.6 / §2.8、tasks.md T-05 / T-06 / T-21 具备生成物对拍、主题退役色集合检查与自检样例；没有要求搬入整个图表模板系统。
- [x] AC-006-2 七个序列色的对比度。plan.md §2.1 / §2.6 指定 WCAG 相对亮度算法、登记卡面与 ≥3:1 阈值，T-21 有专门守卫；确认的七色在该卡面均达标。扩展到文字色与真实玻璃背景的额外承诺未闭环，见 C-04，不据此宣称全站满足 4.5:1。
- [x] AC-006-3 样例图使用注册主题。plan.md §2.6 / §5、tasks.md T-21 明确注册名 fai-dark、ECharts 样例图位置、读取实例颜色与令牌对照；Spark 不冒充 ECharts 样例图。
- [x] AC-006-4 画布透明。plan.md §2.6 / §5、tasks.md T-21 / T-26 同时安排 backgroundColor 自动断言与 M-08 视觉检查。

### R-007 数据访问契约与 mock（4 条 AC）

- [ ] AC-007-1 界面零直接网络调用。plan.md §2.7 / §2.8、tasks.md T-07 / T-10 只列 fetch( 等文本模式；别名调用或第三方客户端可在界面层绕过。见 F-09。
- [ ] AC-007-2 四场景配置与 E2E。plan.md §2.7 的 error 令每个方法失败，bootstrap 因而先失败，无法到达 T-25 要验收的模块错误态 / 诊断。见 F-10。
- [x] AC-007-3 文档字段与类型一致。plan.md §2.7 / §2.8、tasks.md T-11 指定从 zod 生成字段清单与 JSON Schema、重生成 diff 及守卫正反例，能够验收该 AC 的字段一致性。R-007 更广的分页 / 时间 / 百分数语义仍未确定，不能由此推定完整契约需求已通过，见 N-02 / F-12。
- [ ] AC-007-4 所有业务数值带语义元数据。Figure 定义有四项必填，但 MarketBoard.cells[][] 另写成 `{value,state}`，未明确 value 是否 Figure、或元数据如何继承；与 T-09“数值字段统一 Figure”不一致。见 F-11。

### R-008 规范资产移植登记（3 条 AC）

- [x] AC-008-1 条目、原 id、来源、日期与暗色适配。plan.md §2.9、tasks.md T-02 / T-03 / T-04 / T-27 明确八份 UI 条目、索引、原 front matter、adopted / not_adopted 与检查器；这里只确认交付与检查设计，不声称文件已经移植。
- [ ] AC-008-2 每个令牌可追溯到条目或 designUI 条款。plan.md §2.1、tasks.md T-05 允许 source 直接指向 `spec:R-00x`，而该 what 条款通常没有具体数值，不满足此 AC；见 F-13。
- [x] AC-008-3 暗色配色适配表。plan.md §2.1 / §2.9、tasks.md T-04 的逐原色映射和对比度检查具备明确数据源；17 项确认色值与 HTML 数据一致。度量跨算法比较问题见 C-05。

### R-009 可验收性与人工验收（2 条 AC）

- [x] AC-009-1 一条命令组织全部自动化检查。plan.md §2.8 与 tasks.md T-26 明确 tokens:check → guards → typecheck → lint → unit / component → E2E 的聚合脚本及退出码要求；实际全绿证据须在实施后提供，当前不作已通过运行的声明。
- [x] AC-009-2 人工清单与证据责任。plan.md §5、tasks.md T-26 明确 M-01～M-08、“看什么”、人工部分对应 AC 与 Handoff 附截图；当前阶段不以截图尚未生成判为缺陷。

## 其他自定义项

- [ ] C-01 Q-015 回流的 Gate 1 已重新批准且状态留痕一致。spec.md 头部明确待 Walter 重新批准，plan.md 头部仍称冻结版，tasks.md 头部又称“冻结版；含 Q-015”；尚不满足生效条件。见 F-01。
- [x] C-02 Q-015 主要行为修订贯穿三件套。spec.md R-001 / R-004 / 两条修订 AC 与 Q-015，plan.md §2.1 / §2.3 / §2.4 / §2.8 / §5，以及 tasks.md T-07 / T-10 / T-17 / T-19 / T-20 均已采用合约价格、market、红涨绿跌；T-10 明确关注列表 fixture 必须声明 market。该结论不覆盖审批和守卫有效性。
- [x] C-03 Q-003 采用方案与配色样张数据一致。plan.md §2.1 和 assets/palette-dark-candidates.html 均记载 Walter 选择 A 等亮、中性色调整、B 未采用；核对 HTML 暗色 c 表的 17 项值均在采用表中，其他色 #54534B 与区间带 α .16 一致。未把不存在的 10-26 mockup 当视觉基准。
- [ ] C-04 对比度验收使用真实表面或足以证明覆盖真实表面的界。plan.md §2.1 / §2.6 固定用 #1D1E20，但玻璃卡在渐变顶部是约 #252629；点睛红文字对比度约 4.161:1，低于 plan 4.5:1 的文字承诺。见 F-19。
- [ ] C-05 配色证据的色差指标可比较。plan.md §2.1 将 OKLab×100 的最小 8.5 与 FTEngine 的 21.5 直接比较，后者原文是 ΔE2000；不能据此量化暗底“压缩”程度。见 F-20。
- [ ] C-06 行情、状态与分析配色语义无绝对化冲突。plan.md §2.1“绿色全站只表示跌”与同节序列 5 / 分析大区 FSU 的缥碧取色并不相容。应限制为状态 / 行情方向色语境，而不是禁掉分析色板身份；见 F-21。
- [x] C-07 静态守卫有正反例自检机制。plan.md §2.8 与 T-02 / T-06 / T-07 / T-11 / T-21 均要求 positives 必须命中、negatives 必须不命中，且失败非零退出；不能把该机制当作当前样例集合已足够，扫描语法与作用域缺口仍见相应 AC。
- [x] C-08 任务形式粒度与模板字段齐备。27 项均有上下文、修改范围、依赖、预计、引用 AC 的完成标准及编号对应的命令；各项 0.5～2 小时、合计 41 小时。这里只确认草案形式，不保证实际工时或依赖闭环。
- [ ] C-09 pi RPC 对照保证一次运行唯一终态。plan.md §2.5 将 message_end.error 直接映射 run.failed，同时把 agent_settled(aborted=false) 映射 run.completed；自动重试或最终失败均可能触发矛盾终态。见 F-16。
- [ ] C-10 后台运行覆盖收起抽屉而不只切页。spec.md R-005 要求两者，plan.md §5 和 T-24 仅明确跨页步骤数；需补收起期间推进、重开后连续且不重复的步骤。见 F-22。
- [x] C-11 mock 与安全边界符合本次范围。plan.md §3、tasks.md T-01 / T-10 明确无真实头寸、凭证或私有文档，不写用户数据目录、不修改 backend，根 .gitignore 仅追加前端忽略项；现有 .env 等忽略项不得移除。
- [ ] C-12 模块库定义与 R-007 的统一访问边界一致。plan.md §2.4 是本地 registry，§2.7 DataClient 没有模块库定义方法；还未区分本地组件映射与契约返回的 id / 名称 / 说明 / 默认跨列。见 F-14。
- [x] C-13 环境与依赖验证责任明确。plan.md §1 / §6、tasks.md T-01 在 Windows 浏览器验收边界内安排安装 / 构建 / 类型检查 / 单测 / E2E 冒烟及实际 lockfile 版本回写，不以 Python 后端就绪为前置条件。本审核未安装依赖，也未验证这些包版本在开发机已能运行。

### 未通过项的问题定位与复核要求（不重复计数）

#### F-01 修订版未重新过 Gate 1，版本头存在误导

- **位置**：`specs/frontend-workbench/spec.md` 头部 Gate 1 记录及 §5 Q-015；`specs/frontend-workbench/plan.md` 头部；`specs/frontend-workbench/tasks.md` 头部；`specs/README.md` 状态表；`AGENTS.md` §2 Gate 1 / 需求变更规则。
- **原因 / 复核**：Q-015 的产品回答不等于修订版整体重新批准。spec 与状态表正确标为待批准，plan / tasks 却未区分旧冻结版与修订草案。待 Walter 明确重新批准当前 spec，并统一版本 / 生效状态；本次可做草案审核，但不能替代 Gate 1 或令 tasks 生效。

#### F-02 字体规则没有可判定的优先级

- **位置**：`specs/frontend-workbench/spec.md` R-001 字体三族及 AC-001-4；`plan.md` §2.1 字族、§2.4 模块壳标题、§5 typography；`tasks.md` T-08。
- **原因 / 复核**：“KPI 大数 serif”与“数值一律 mono”对同一文本给出两种字体；模块大标题 serif 与模块壳 h3 的 sans 也未解释层级差异。源 FTEngine Foundations 同有 KPI 例外歧义，继承它不等于已澄清。明确数值本体 / 容器、KPI 例外、模块标题层级与优先级，再使组件测试断言实际字体，而不只断言互相冲突的类名。

#### F-03 bootstrap 总跳工作台，破坏直达与刷新

- **位置**：`specs/frontend-workbench/spec.md` R-002 路由可直达 / AC-002-2；`plan.md` §2.2 LoadingScreen、§4 流程 1；`tasks.md` T-12 / T-13。
- **原因 / 复核**：ready 后无条件跳 /workbench 会覆盖已有 /prices、/research/:id 或 /daily/:date。约定只在根地址 / 首次无目标启动时进入工作台，已有合法地址保持；E2E 须直接打开非工作台地址并刷新，而不只在挂载后点击菜单。

#### F-04 默认布局使模块库没有七个可见条目

- **位置**：`specs/frontend-workbench/spec.md` R-004 / AC-004-1；`plan.md` §2.4 ModuleLibrary；`tasks.md` T-16。
- **原因 / 复核**：默认七个全启用，库却只显示未启用项，因而默认空库不满足 AC。明确展示全部并标注已添加 / 禁用重复添加，或回流修订需求；测试默认库条目与重复添加行为，不能仅测移除后重加。

#### F-05 1240 的栅格责任不唯一

- **位置**：`specs/frontend-workbench/spec.md` R-002 窄窗口、R-004 固定栅格、Q-004；`plan.md` §2.1 breakpoint 表、§2.3 / §2.4 / §5；`tasks.md` T-18。
- **原因 / 复核**：spec 写栅格在 1240 / 1400 / 1500 收缩；plan 模块栅格为 <980 / ≥980 / ≥1400 / ≥1500 的 1 / 2 / 3 / 4 列，1240 只改变焦点带卡数。明确“模块栅格”与“焦点带数字卡栅格”各自的区间 / 列数表及原规范的适配差异，再让测试据统一登记值断言；仅核 CSS 阈值属于允许集合不能证明断点作用对象正确。

#### F-06 生成物相等不等于运行时样式相等

- **位置**：`specs/frontend-workbench/spec.md` AC-001-1；`plan.md` §2.1 tokens-sync、§2.8 / §5；`tasks.md` T-05 / T-18。
- **原因 / 复核**：未导入 tokens.css、CSS 覆盖变量、单位序列化差异等均可在生成物 diff 绿时使运行时错误。补浏览器内遍历令牌读取 computed style / CSS 自定义属性，按类型规范化比较，并检查实际注册主题；增加“生成正确但未加载 / 被覆盖”的阳性样例。

#### F-07 字面量与退役色扫描范围不完整

- **位置**：`specs/frontend-workbench/spec.md` AC-001-2 / AC-001-6；`plan.md` §1 index.html 静态骨架、§2.8 color-literals；`tasks.md` T-01 / T-06。
- **原因 / 复核**：仅扫 src 的 vue / ts / css，遗漏根 index.html 的内联样式 / 脚本；列明的语法没有覆盖命名色等合法颜色字面量。补完整生产源码范围、允许项与颜色语法约定，并以 index.html 内联退役色及 `color: red` 等反例自检；不要误报 palette 样张的历史色或守卫自身测试样本。

#### F-08 样式定义位置检查不能证明样式作用位置

- **位置**：`specs/frontend-workbench/spec.md` AC-001-5；`plan.md` §2.1 updown-scope、§2.8 / §5；`tasks.md` T-07 / T-08 / T-19 / T-20。
- **原因 / 复核**：全局 updown.css 一旦被合法模块导入，其他组件输出 sem-market / is-up 也会生效，哪怕没有非法 import；用涨跌令牌作为 background 也通过现有范围检查。
- **要求**：明确允许选择器 / 标记的实际使用位置，限制涨跌声明只用于 color，并测试非法组件复用语义类、以涨跌色涂底均失败；在行情价格 / 关注列表 / 混合语义焦点带做实际字色与底色断言。Q-015 的允许名单文本已完整，不应通过退回旧名单解决此问题。

#### F-09 网络文本模式无法覆盖界面直接调用

- **位置**：`specs/frontend-workbench/spec.md` AC-007-1；`plan.md` §2.7 / §2.8 network-scope；`tasks.md` T-07 / T-10。
- **原因 / 复核**：`const request = fetch; request(url)` 没有 fetch(，第三方 HTTP 客户端调用也不在所列四种模式中。明确网络入口 / import 限制和别名识别策略（例如语法级检查），补这些绕过样例，保持只允许 real 契约实现层。

#### F-10 error 场景在 bootstrap 阶段提前终止

- **位置**：`specs/frontend-workbench/spec.md` AC-004-4 / AC-007-2；`plan.md` §2.2 bootstrap.failed、§2.7“error = 每方法返回固定错误”、§5 四场景；`tasks.md` T-10 / T-13 / T-25。
- **原因 / 复核**：全方法失败时工作台不会挂载，模块 code / 复制诊断不可达。将启动失败与启动成功后的业务读取失败区分，或明确按方法 / 阶段注入；分别测试 bootstrap 重试和模块错误 / 诊断，不能用加载页错误文案冒充模块错误验收。

#### F-11 盘面数字元数据未闭环

- **位置**：`specs/frontend-workbench/spec.md` R-007 / AC-007-4；`plan.md` §2.4 BoardGrid 格与 §2.7 Figure / MarketBoard.cells；`tasks.md` T-09 / T-10 / T-19。
- **原因 / 复核**：Figure 有 unit / freq / semantic / asOf，格却只有 value / state。明确格值使用 Figure，或定义行列元数据继承与最终解析规则；补具体 MarketBoard 类型及缺失任一元数据的 fixture 反例，而不只验证独立 Figure。关注列表所有业务价格 / 变化数字同样按统一规则验收。

#### F-12 契约的参数语义不能由 schema 自动补出

- **位置**：`specs/frontend-workbench/spec.md` R-007 文档化要求 / AC-007-3；`plan.md` §2.7 client / Figure / contract-build；`tasks.md` T-09 / T-11。
- **原因 / 复核**：getDailyBrief(date)、getReleaseCalendar(from,to)、asOf 的时区 / 日期含义 / 区间端点未约定；列表是否分页也未声明。Q-015 新用的涨跌幅对应 deltaKind=pct，但比例值与百分数值口径未定。为各方法登记这些语义，或明确 v1 无分页及其范围；生成器有可校验的语义 / 方法元数据源，补文档一致性与格式化反例测试。

#### F-13 令牌来源可绕过条目与实际数值来源

- **位置**：`specs/frontend-workbench/spec.md` R-001 / R-008 / AC-008-2 / §4 values_once；`plan.md` §2.1 source 规则及 z / 新字号等分组；`tasks.md` T-05。
- **原因 / 复核**：source 指 spec:R-001 只证明需求存在，不证明某个 z 数值、尺寸或字号的来历；AC 要求指向条目文件或 designUI 条款。新增值先在对应移植条目的暗色适配段登记具体值与理由，令牌指向该锚，或明确回流修订 AC 后重过 Gate；不能在守卫里静默扩展来源允许集。

#### F-14 模块库定义没有经过承诺的数据契约

- **位置**：`specs/frontend-workbench/spec.md` R-004 模块字段、R-007 全部数据包含模块库定义；`plan.md` §2.4 registry / §2.7 DataClient；`tasks.md` T-09 / T-10 / T-15 / T-16。
- **原因 / 复核**：本地注册表直接给库提供定义，DataClient 无对应方法，说明字段也未在表中明确。区分本地组件工厂映射与契约模块定义，补定义方法 / schema / mock / 校验，或回流修订 R-007 的明确例外；真实客户端尚未实现不构成可跳过契约边界的理由。

#### F-15 引导到已移除模块无法完成高亮

- **位置**：`specs/frontend-workbench/spec.md` R-004 移除、R-005 引导跳转 / AC-005-5；`plan.md` §2.4 layout 与 §2.5 hint.navigate；`tasks.md` T-24。
- **原因 / 复核**：router.push + highlight(moduleId) 不会让不在 enabled 布局中的模块重新出现。定义自动恢复 / 询问添加 / 明确不可达反馈的产品规则与恢复顺序、持久化影响，并与 AC 对齐；补目标已移除及不存在的组合用例。

#### F-16 pi 的中间错误不等于一次运行终态

- **位置**：`specs/frontend-workbench/spec.md` Q-014；`plan.md` §2.5 pi 对照表；`tasks.md` T-09 / T-10 / T-23。
- **依据**：本机 pi 1.4.0 的 `docs/json.md`（Agent / Retry events）与 `docs/rpc.md`（Run lifecycle）：agent_settled 表示自动重试等全部结束；message_end 的 error 可先于重试或最终 settled。
- **原因 / 复核**：当前映射可能先 run.failed 后 run.completed；最终失败后的 settled(aborted=false) 也不代表成功。明确将中间错误记为步骤 / 尝试，在 settled 时根据最终结果只发一次 run.completed / failed / aborted，并登记可供未来 agent-runtime 实现的状态归约规则；本 feature 用固定事件样本检验错误→重试成功、最终失败、中止，不要求接入真实 pi。

#### F-17 任务依赖与验证命令归属没有完全闭合

- **位置**：`specs/frontend-workbench/tasks.md` T-04 依赖与完成标准 1、T-11 修改范围 / 验证命令 2、T-24；`plan.md` §2.5 mock 回放 / §2.7 配置。
- **原因 / 复核**：T-04 以八份 UI 条目齐备为标准，却只依赖 T-02，未依赖提供前四份的 T-03；按现有依赖图执行不保证命令可绿。T-11 运行 `test:unit -t "AC-005-6 doc"`，但范围没有创建 / 修改承载该测试的文件。三个 agent 脚本虽然列明，send 输入 / 配置 / 注入约定没有给出如何指定 long / failure，T-24 无确定启动入口。补依赖、测试所有权、脚本选择规则，确保测试筛选未命中时失败。

#### F-18 文件边界和回滚遗漏共享文档

- **位置**：`specs/frontend-workbench/spec.md` R-008 与 §4 文件边界；`plan.md` §1 共享文件、§2.9 docs 同步、§6 回滚；`tasks.md` 边界 / T-27；`AGENTS.md` §2 多 feature 状态表。
- **原因 / 复核**：docs/designUI.md 被实施任务明确要求修改，却不在前两份文档的共享文件允许集中；tasks 边界又不列 specs/README.md。回滚只写删除新增目录和忽略行，无法恢复已改的共享文档。统一允许范围、状态维护责任与逐文件回滚办法，保留“不改 backend、不移除忽略锚点”的约束。

#### F-19 固定卡面不能证明真实渐变上的文字对比度

- **位置**：`specs/frontend-workbench/plan.md` §2.1 背景 / 玻璃令牌 / 对比度算法与阈值、§2.6 theme-contrast；`tasks.md` T-21；`assets/palette-dark-candidates.html` .theme-dark / .card / THEMES.dark.surface。
- **复核证据**：按文中 sRGB 透明合成、WCAG 相对亮度算法，白 .045 叠在 #121315 得约 #1D1E20，点睛红 #DF5C4D 对比度 4.588:1；同一玻璃叠在渐变顶部 #1B1C1F 得约 #252629，对比度 4.161:1。
- **要求**：规定实际表面约束或补最不利背景验证；文字用色须满足 plan 自定 4.5:1。若要改已确认色值，按 Q-003 / 令牌变更纪律重新确认，不由审核员擅改。七序列色的 ≥3:1 与此项额外文字承诺分开判断。

#### F-20 暗亮两版色差采用不同指标

- **位置**：`specs/frontend-workbench/plan.md` §2.1“序列七色两两最小 ΔE”段；来源 `D:/FTEngine/design/Graphs/Palette/PALETTE_CORE.md` §二.1。
- **原因 / 复核**：暗色最小 8.5 标为 OKLab×100，来源原文 21.5 标为 ΔE2000。保留各自数据可以，但应标为不可直接比较，或重算同一指标后比较；同步未来 PALETTE_DARK 的方法和证据。Walter 已选择 A 不是这组跨算法比较成立的证明。

#### F-21 “绿色全站只表示跌”超出已定的模块语义

- **位置**：`specs/frontend-workbench/plan.md` §2.1 状态语义段及序列 5；`assets/palette-dark-candidates.html` THEMES.dark.c.piaobi、regionColor.FSU；`docs/designUI.md` §2.2 / §2.3；D-011 结论 6。
- **原因 / 复核**：缥碧还表达旧年份与分析大区，并非下跌。将“状态不用绿”与“行情方向绿=跌”写成有作用域的规则，保留分析图表的既定色板身份；Q-015 只把关注列表明确为行情，不要求新增“全站禁分析绿色”的决策。

#### F-22 收起抽屉期间的后台连续性未被测试覆盖

- **位置**：`specs/frontend-workbench/spec.md` R-005 后台运行；`plan.md` §2.5 / §5 AC-005-3；`tasks.md` T-22 / T-24。
- **原因 / 复核**：T-22 只测能收起，T-24 只测切页。补 long 回放中收起→期间接收步骤→重新展开，断言同一 run 未重启、步骤连续且不重复、输入栏运行中指示与终态同步；不能只靠“订阅在 main.ts”推断验收已覆盖。

### 复核条件与证据边界

1. 澄清并修订上述未通过项；涉及需求含义 / 例外变化的，按 AGENTS.md §2 回到 Clarify，并将 **Q-015 修订版及其他需求变更一并交 Walter 重过 Gate 1**，再同步 plan / tasks 的基线状态。
2. 审核员 A、B 分别独立复核，只有双方均确认满足的项进入共识版 checklist.md；本文件不授权实施者修改勾选状态。
3. Tasks 生效后执行 Analyze，确认三件套与 docs / ADR 无遗留冲突，再按依赖实施。Review、Gate 2、Handoff 的人工批准与证据职责不能由本次 Checklist 代替。
4. 已完整阅读 AGENTS.md、docs 三件套、docs/decisions 下六份 ADR 及目录规则、本 feature 三件套与配色 HTML、两份 checklist 参考、tasks / plan 模板和 specs 状态表；另核对相关 FTEngine Foundations / Colors / Fonts / Layout / Palette 原文、data-layer 错误契约及本机 pi 事件 / RPC 文档。
5. 本会话只做只读核对和内存中的统计 / 配色计算：确认 41 条 AC、27 个任务、41 小时，以及 17 项确认色值对应关系。**未安装依赖、未运行构建或项目测试、未提交 git；只新建本文件。** 审核期间状态检查显示并行会话另生成了审核员 A 清单，本会话未读取或修改它。因此所有通过项均为独立的规范质量判断，不是实现验收证据。
