# frontend-workbench v2 S0 Converge 报告（converge-v2-s0）

> Converge = `claude-opus-5-5 via anthropic`。bridge 链路本窗口已知额度失败，没有重试，也没有改配置。本会话不是 A，也不是 Astra 实施者。
> 固定 HEAD `5d53f451c1519ff5dbae66c91eef734f21335fe9`。真实 diff：`6a1fda4..5d53f45`，15 个文件，+245/−112。
> 两个提交：`0aebf660`（T-V2-01）、`5d53f451`（T-V2-02）。
> 全程只读：只用了 git 和内存比对，没有写文件、refs 或临时文件，没有跑 install/pnpm/test/build，没有起服务，也没有派 agent。
> 已重读：AGENTS、docs/plan、spec v2.1、plan §7、tasks v2 全段、checklist-v2 当前 R4、analyze-v2-r9、implementation-v2-s0.md、manual-acceptance.md（历史段加新增段），以及 design/ui/UI_NAV、README 的 diff。结论以代码 diff 为准，不以实施摘要代替。

## 1. 冻结物与范围核验（本会话亲自执行的只读 git 结果）

| 核验项 | 结果 |
|---|---|
| 15 个路径 | 全在 S0 许可内：design/ui/{UI_NAV,README}；src/app/{nav,router,Rail,TopBar}；PlaceholderPage；stores/app；e2e/{shell,agent}；component/topbar；unit/manual-acceptance；specs 下 implementation-v2-s0、manual-acceptance、tasks |
| 保护路径 | 对 `6a1fda4` 的 `git diff --quiet` 退出码为 0：contracts、src/contracts、scripts、src/agent、src/jobs、src/design（含生成物）、index.html、package、lock、playwright/vite 配置、backend、docs、specs/README |
| 对 `43b6d79` 不变 | main.ts、AppShell.vue、breakpoints.spec.ts、UI_LAYOUT.md |
| spec | 与 `fec3556` 一致；52 条 AC 去重计数为 52 |
| checklist-v2 | 与 `e596244` 内容一致。`e596244` 不是 HEAD 的祖先，因为它在 A 的独立分支上，这和 425c1fd 的情况相同 |
| checklist.md | 与 `425c1fd` 一致 |
| plan.md、analyze-v2-r9 | 与 `6a1fda4` 一致 |
| tasks.md | 只改了两行，就是 T01、T02 的状态行（改为 completed）。定义、AC、工时、依赖都没动 |
| UI_NAV.md | 唯一的 hunk 从 :113 开始，只在暗色适配段内。原文快照和 JSON 碎片没动 |
| design/ui 旧词 | `git grep "八项\|getResearchList\|研究扩展\|研究列表" design/ui` 无输出 |
| manual-acceptance.md | 唯一的 hunk 是 @@ -81,3 +81,35，全是追加。M-01～M-08 原文是逐字前缀，人工勾选框没动 |
| A R4 记录 | 固定审查对象 `34ee795` 是 HEAD 的祖先；`e596244` 只改了 checklist-v2。R4-C10 限定放行 S0 |
| H-x 状态 | tasks §1.2 八行全部是“未交付” |
| 其他 | `43b6d79` 是 main 的祖先；`git diff --check` 通过 |

## 2. 任务对拍矩阵（T01 六条标准 + T02 四条标准）

| # | 标准 | 代码与测试落点（HEAD） | 判定 |
|---|---|---|---|
| T01-1 | 九项、href、aria 唯一、owner、直达刷新、daily 深链、无 research 用例 | nav.ts 九项，learning 带归属注释；router 由 navItems 生成，保留 `/daily/:date?`，删掉 research 特例，没有 job-detail。<br>Rail:57 规则为“navId 相同且 name 相同记 page，否则记 location”。<br>shell.spec 的 menu 表为九项，按项断言 href、`[aria-current]` 计数为 1、owner 和“{owner} feature”文案；八个直达加刷新用例；daily 深链用例；`.research-link` 计数为 0；research.json 导入与 AC-002-3 旧用例已删 | 已对齐 |
| T01-2 | 九个路由下输入栏可见，提交后打开抽屉 | agent.spec 断言 `navItems` 长度为 9，遍历全部路由 | 已对齐 |
| T01-3 | AC-002-1、AC-002-5 不回归 | 两个用例原样保留 | 已对齐（结果见 §3） |
| T01-4 | 960/979 下窄窗不换行 | shell.spec:170 起，视口取令牌 `window.min_width` 和 `shell_collapse-1`。<br>先断言 `.nav-list` 的 flex-wrap 为 nowrap，再对九个 `.full-label` 逐个断言 white-space 为 nowrap（R9 O-3 已处理）。<br>行为断言：同一行（±1px）、`overflow-x: auto`、只在 `scrollWidth>clientWidth` 时才要求 `scrollLeft>0`、“设置”矩形落在容器内、document/body 无横滚、点击进入 /settings。<br>CSS 只写在 `[data-viewport-collapsed='true']` 下：`min-width:0`、`overflow-x:auto`、`overflow-y:hidden`、`li` 上 `flex:none`、`white-space:nowrap`。没有新增 JS、状态或令牌。breakpoints.spec 没写入 | 已对齐 |
| T01-5 | 派生删除无残留，typecheck 和 lint 通过 | Rail 删了 useAppStore 和 app 常量，以及 research 子列表和样式 | 代码已对齐（lint 结果见 §3） |
| T01-6 | UI_NAV 与 README 改为九项和 G-02 文字，UI_LAYOUT 不改 | 第一条规定改为九项无子项，并注明 R-002 v2（D-016/D-018）；第二条写明单行、页面不横滚、仅空间不足时导航内横滚、`UI_LAYOUT#narrow`、Walter 2026-10-28；“不采用”和“落点”加了 §7.4 | 已对齐 |
| T02-1 | 3 步进度，文案不含“研究列表”，重试路径不变 | app.ts 改了三处（分母 3、完成判定 3、新文案），并删了失效的 ResearchItem 导入，错误分支没动。<br>e2e 用 poll 断言约 33.333333，并断言文案不含“研究列表”。两条重试用例保留（shell.spec:126、:139） | 已对齐 |
| T02-2 | 投放按钮可见，点击发出 intake | TopBar 只接 props，加了 `defineEmits<{intake}>`，按钮 type=button、文案“投放”，没有颜色字面量。AppShell 没接（与 43b6d79 一致）。<br>组件测试用真实 mock client，断言点击前 emitted 为 undefined、点击后为 `[[]]`，原有 5 条测试保留 | 已对齐 |
| T02-3 | M-01～M-12 文本，测试同步 | M-09～M-12 有“操作 / 看什么 / 截图证据：待补”，勾选框都没勾。M-09 含“learning，Phase 2C”和 G-02 窄窗口径。<br>unit 测试改为 12 项，按项用 test.each | 已对齐（只做了文本部分） |
| T02-4 | PlaceholderPage 派生修改 | 标题直接取 `route.meta.title`，删了 computed、useAppStore、research 分支。owner 文案和 daily 日期展示保留 | 已对齐 |

## 3. 测试证据的来源和限制

- **以下数字都是 Astra 在实施树 `D:/2030/Futures-AI-workbench-v2-implement` 上跑的，本会话没有亲跑。** 来源是 implementation-v2-s0.md。
- T01 六条命令：
  - e2e 依次 10、1、2、18 个通过（AC-002-6 是 16 个原有加 2 个新增）；
  - typecheck 和 lint 通过；
  - AC-008-1 unit 12 个通过；grep 无输出；UI_LAYOUT diff 退出码 0。
- T02 四条命令：e2e 3 个、topbar unit 6 个、人工清单 unit 13 个通过；typecheck 和 lint 通过。
- red→green：记录是旧 wrap 下 2 failed、改为 nowrap 后 2 passed。红轮代码没有提交，本会话无法复现。佐证只有一条：A R4-C06 独立推出，这两条计算样式断言能区分新旧实现（旧实现分别得到 wrap 和 normal）。
- 计数与代码结构吻合：AC-002-2 是 1 + 8 + 1 = 10；topbar 有 6 个 `test(`；manual 是 1 + 12 = 13。
- 额外跑的 `pnpm test`（564 个 unit/component、68 个 e2e 全绿）和 build（成功，有一个大 chunk 警告：779.98 kB）**只是 S0 回归，不是 52 AC 的集成验收**，不能替代 T-V2-11、T-V2-12。

## 4. 52 条 AC 的范围状态（每条只归一类，6+8+9+6+9+4+5+3+2 = 52，无缺口）

| 类别 | AC | 说明 |
|---|---|---|
| S0 定向命令已满足（5） | AC-002-1、AC-002-5（回归）；AC-002-4（按钮发出事件）；AC-002-7（3 步）；AC-005-1（九个路由） | 只是任务级证据。最终仍以集成分支上 T-V2-12#1 的全量结果为准 |
| S0 只完成壳或文本子项（5） | AC-002-2；AC-002-6；AC-008-1；AC-009-1；AC-009-2 | 剩余部分如下 ↓ |
| 待集成或尚未实现（8） | AC-002-3；AC-002-8；AC-003-7、AC-003-8、AC-003-9；AC-005-8、AC-005-9；AC-007-5 | 见下方 |
| v1 实现不变，只跑了 S0 回归（34） | AC-001-1～6；AC-003-1～6；AC-004-1～6；AC-005-2～7；AC-006-1～4；AC-007-1～4；AC-008-2、AC-008-3 | 正式归属的标准在 T03～T12，都没开始 |

“S0 只完成壳或文本子项”五条各自还差什么：
- **AC-002-2**：作业详情高亮“作业”、`/jobs/:id/:stage` 刷新，要等 H-3 和 T09/T10；`/jobs` 的 owner 断言只算 S0 证据，T09#4 要迁移它；人工 M-09 未验。
- **AC-002-6**：T08#1、#2 和人工 M-09～M-11 未做。
- **AC-008-1**：T01#6 已完成，T11#9 未做。
- **AC-009-1**：S0 只做了静态打底，**不代替 T12#1**。
- **AC-009-2**：文本已完成，截图和人工验收未做（T12#2、#3）。

“待集成或尚未实现”八条：
- **AC-002-8 不满足**：按钮没接 AppShell、抽屉和 H-5、页面切片。
- AC-002-3：旧的研究子项用例已删，列表要等 H-2、页面切片和 T09。
- 作业轨道（AC-003-7～9）要等 H-2、H-3、H-6 和 T05/T06/T10。
- 对话上下文（AC-005-8、AC-005-9）要等 H-1、H-4 和 T03/T04/T09。
- AC-007-5 只能由生产方提供证据，壳不代勾。

“只跑了 S0 回归”的 34 条里，有几条还带 v2 扩充，没有落地：
- AC-001-1、AC-008-2 的新令牌（T07）；
- AC-001-2、AC-001-5、AC-004-6、AC-007-1 要覆盖轨道文件（T05）；
- AC-003-6 要求轨道存在时仍成立（T06）；
- AC-007-3、AC-007-4 要等生产方重新生成后回归。

另有一层人工待验，与上表分类叠加：
- v1 的 M-01、M-03、M-04、M-08（对应 AC-001-3、AC-003-5、AC-004-5、AC-006-4）仍待 Walter 复核；
- M-09～M-12 只有文本，截图和人工验收都没做。

## 5. 内部差距与外部阻塞

**S0 内部差距：没有。** 不新增 Converge 任务。以下观察不计入判定，留给限定的 S0 代码审查判断：
- **O-1**：根路径 `/` 是无名路由（router.ts:24，v1 遗留）。按 plan §7.4 的字面规则，在 `/` 上“工作台”会得到 `aria-current="location"`，而 v1 给的是 page。视觉高亮靠 `.active` 保留，aria 仍然唯一，测试没覆盖 `/` 上 aria-current 的值。实现与 plan 一致，不算 Converge 差距。如果审查认为要改，属于 plan 口径问题，应走 Clarify/Analyze，不能直接改代码。
- **O-2**：red 轮证据只能来自实施记录（见 §3）。
- **O-3**：implementation-v2-s0.md 是新增的规格目录记录文件，不在 tasks §4 写入者表里。它属于协调器许可的 S0 路径，不是冻结物，也不是自动生成物。

**外部阻塞（完整 v2）：**
- T-V2-03～12 都没开始；
- tasks §1.2 的八个交接单元（H-1、H-2 标签/列表、H-3 路由、页面切片、H-4、H-5、H-6）全部是“未交付”，闸门 3 没过；
- 作业列表和详情、作业轨道、对话上下文、采集接线、M-09～M-12 截图都没实现，不能用占位当作通过。

## 6. 结论

1. **S0（T-V2-01 → T-V2-02）：已收口。** 十条完成标准在代码、测试和文本上都逐条有落点；冻结物、保护路径和写入范围符合要求。证据是 Astra 的命令记录，本会话没有复跑。
2. **完整 v2：未收敛（外部阻塞）。** 原因是 H-x 没交付、10 个任务没开始、AC-002-8 等 8 条待集成、人工验收和截图都没做。S0 不单独 Handoff，也不进入全 feature 的最终 Review 或 Gate 2。

## 7. 风险与下一步

**风险：**
- R-1：H-3 集成后，`/jobs` 会被同名路由替换，壳 owner 断言会变红。要按 T-V2-09#4 迁移，并由集成人登记“已知红”窗口（V2-S11）。
- R-2：本轮测试结果不能复用为 T-V2-12 的全量或集成证据。build 的大 chunk 警告只记录，v2 不处理。
- R-3：v1 的 P3 台账（含 H-02）不在 v2 范围。本轮没有修复，也不宣称已关闭。

**下一步：**
- (a) 可选：做一次限定的 S0 代码审查。审查人按 §6 选模型且不能是 Astra，只读固定的 `6a1fda4..5d53f45`，并判断 O-1。这不是最终 Review。
- (b) 集成人逐项登记 H-x 的四项（固定 commit、有效 Checklist SHA、定向测试摘要、集成 SHA），然后按消费切片解锁 S1。
- (c) S1/S2 完成后再做一次 Converge。外部阻塞没解除前，Converge 只能继续报“未收敛（外部阻塞）”。