# frontend-workbench v2 S0 限定代码审查（review-v2-s0）

> **审核员 A = `claude-fable-5-1 via anthropic`**（`PI_PROVIDER=anthropic`、`PI_MODEL=claude-fable-5-1` 实测）。bridge 链路在当前限额窗口已有真实 quota / rate 失败（继承协调器证据），按 AGENTS §6 第 5 条未重试、未改 provider / 路由 / 配置。
> **独立性**：全新会话、独立 worktree `D:/2030/Futures-AI-workbench-v2-s0-code-review`、分支 `review/frontend-workbench-v2-s0-code`；与 Astra 实施树隔离；本会话不是 Astra（`openai/gpt-6-astra`）、不是 Opus 作者（Plan / Converge）、不是 Sol 集成人。
> **固定对象**：HEAD `fab08a6a629e0c5acb47c5923efc2cfee53f3647`（进入与退出时 `git status --short --branch` 均只有分支行，无变更；退出时仅多本文件 untracked）。
> **真实代码 diff**：`6a1fda4..5d53f45`，15 文件 +245/−112，两个提交 `0aebf660`（T-V2-01）/ `5d53f451`（T-V2-02）。`5d53f45..fab08a6` 仅新增 `converge-v2-s0.md`（+115），frontend / design 对 `5d53f45` 无差异。
> **性质**：仅 S0（T-V2-01 → T-V2-02）的独立代码审查，**不是 v2 最终 Review、不是 Gate 2、不是 Handoff**，不建议据此 merge main。源码全程只读；只写本文件，不 commit。

## 1. 结论

**通过（仅 S0）。P1 = 0，P2 = 0，P3 = 1。** 完整 v2 仍 **未收敛（外部阻塞）**；T-V2-03～12 未做；H-x 八行全部未交付。

## 2. 已读与范围核验（本会话亲自执行）

已完整重读：AGENTS、docs/plan、spec v2.1（冻结）、plan §7.0～7.4 / §7.11 / §7.12、tasks v2 段（§1.1 / §1.2 / §4 / §5 / T-V2-01 / T-V2-02 / 矩阵）、checklist-v2 当前 R4（C01～C11、S16、O01～O03、结论）、analyze-v2-r9（经 R4-C11 交叉）、implementation-v2-s0.md、converge-v2-s0.md、manual-acceptance.md 新增段，以及 15 文件真实 diff。按需读了 `AppShell.vue`、`main.ts`、`LoadingScreen.vue`、`breakpoints.spec.ts`、mock `index.ts`（slow 延迟）、`UI_NAV.md` 暗色适配段、`design/ui/README.md`。未重审 v1 已过 Gate 2 的旧代码 / 60 截图 / 原型。

| 核验 | 结果 |
|---|---|
| 15 路径 | 全在 S0 许可内（design/ui 2、src/app 4、pages 1、stores 1、e2e 2、tests 2、specs 3） |
| 保护路径对 `43b6d79` | `AppShell.vue`、`main.ts`、`e2e/breakpoints.spec.ts`、`design/ui/UI_LAYOUT.md`：`git diff --exit-code` = 0 |
| 契约 / mock / events / 生成物 / package / lock / 配置 / backend / docs / spec / 两份 checklist | 不在 `6a1fda4..5d53f45` 的 15 路径内（stat 核对） |
| tasks.md | 仅 T-V2-01 / T-V2-02 两条状态行 `ready`/`pending` → `completed`；定义 / AC / 依赖 / 工时未动 |
| manual-acceptance.md | `--numstat` 32/0，删除行 0 → 纯追加；M-01～M-08 逐字前缀；M-09～M-12 四个「人工验收通过」均 `[ ]` 未勾 |
| UI_NAV.md | 唯一 hunk 在「暗色适配」段（:113 起）；上方原文快照与 JSON 碎片未动；`git grep -nE "八项\|getResearchList\|研究扩展\|研究列表" -- design/ui` 无输出（exit 1） |
| aria-current 来源 | `grep -rn aria-current frontend/src` 只有 `Rail.vue`（模板 1 处 + 样式 2 处）；无其他组件设置该属性 |

## 3. 发现（按 bug / 架构风险 / 测试缺口 / 目标对齐）

### P3-1（bug，用户可见、瞬时、非功能性）：加载页百分比文本从整数退化为长浮点

- **位置**：`frontend/src/stores/app.ts:13` `progress = completed / 3 * 100`；`frontend/src/app/LoadingScreen.vue:31` `<span class="num">{{ progress }}%</span>`（未改动的 v1 文件）。
- **证据**：`node -e "console.log(1/3*100, 2/3*100)"` → `33.33333333333333 66.66666666666666`。Vue 文本插值 = `String(value)`，所以加载页第二步实际渲染 **`33.33333333333333%`**；v1 四步时为 `25% / 50% / 75% / 100%` 整数。`?scenario=slow` 下该状态保持 1500 ms（mock `delayScenario`），normal 场景下闪过。`<progress value>` 条本身与 `role=status` 文案正常。
- **影响 AC**：不违反 AC-002-7（只要求“显示加载进度与通知文案”）；AC-002-7 三条 e2e 全绿（断言的是 `<progress>` 的 `value` 属性 ≈ 33.333333，不是 `.num` 文本）。属于 S0 引入的视觉回归，不是功能 bug，故定 P3。
- **为什么没在 S0 内修**：plan §7.2:321 / tasks T-V2-02 把 `stores/app.ts` 限定为“只做三处修改”，`LoadingScreen.vue` 不在 tasks §4 任何写入者行内；实施者按口径执行是正确的，口径本身漏了显示位。
- **最小修正建议（只建议，不代改 tasks）**：走 Analyze 登记一条小任务（或并入 T-V2-11 回归），二选一：(a) `app.ts` 的 `progress` 取整（`Math.round`），e2e AC-002-7 的 poll 改为 `toBe(33)`；(b) 在 `LoadingScreen.vue` 的 `.num` 处格式化为整数并把该文件登记进 §4 写入者表。验证：`pnpm -C frontend test:e2e -g "AC-002-7"` 全绿 + 在 `/?scenario=slow` 目视 `.num` 为整数。

### 非发现（已核实不成立或属设计既定）

- **Converge O-1（根路由 `/` 上 `aria-current="location"`）→ 非发现，不是可达用户回归。** 实际路径：`AppShell.vue` `start()` 先 `await router.isReady()` → `await app.bootstrap()` → 若 `route.path === '/'` 则 `await router.replace('/workbench')` → **之后**才 `app.phase = 'ready'`；`<Rail>` 只在 `v-else`（`phase === 'ready'`）分支渲染。`replace` 不留 `/` 历史项（后退回不到 `/`）；`grep` 全 `src` 无 `push('/')` / `to="/"`；bootstrap 失败后的重试也走同一 `start()`。因此 Rail 挂载时 `route.name` 恒为具名路由，`/` 上的 `location` 分支不可达。e2e `AC-002-2 v2-nav` 从 `/` 启动后断言工作台 `aria-current="page"` 且全页 `[aria-current]` 计数 1，已间接覆盖此重定向。实现与 plan §7.4 字面一致，无需改代码或口径。
- **架构风险**：无新增。`TopBar` 仍纯 props + `defineEmits<{intake:[]}>()`，AppShell 未接线（对 `43b6d79` 无差异），符合“不宣称 AC-002-8”。`Rail` 删除 `useAppStore` 后不再依赖 app store；`PlaceholderPage` 同。`router.ts` 仍由 `navItems` 派生，`/daily/:date?` 保留，无 `job-detail`。新 CSS 全在 `.rail[data-viewport-collapsed='true']` 选择器下，`flex: none` 落在 `.nav-list > li`，`overflow-y: hidden` 只限窄窗；宽屏纵向导航规则未变。`.nav-link` 基础 `overflow-wrap: anywhere` 在 `white-space: nowrap` 下无软换行机会、不生效。
- **测试缺口（设计既定、不计发现）**：(1) `scrollLeft > 0` 分支在令牌宽度下（九项 ≈ 504 px < 908 / 927 px）实际不执行，导航内横滚机制只有计算样式 + 几何证据、无运行时滚动证据——tasks 标准 4 明文“不为制造溢出改字号或令牌”，A R4-C06 已接受；(2) `aria-current="location"` 分支在 S0 无可达路由，留 T-V2-09#1。
- **目标对齐**：九项顺序 / path / title / en / owner 与 plan §7.4 表逐项一致；`learning` 归属注释逐字符合 tasks；research 壳导航、`/research/:id?`、`.research-link`、AC-002-3 旧用例与 `research.json` 导入全部删除；契约侧 `getResearchList` / fixture 未动（归契约方）。e2e 旧八项用例是**迁移**而非删除语义（标题加 `v2-nav`、计数 8→9、daily 深链保留并加 `aria-current` 唯一断言）；`[aria-current]` 唯一断言从 `.fixed-link[aria-current]` 扩到全文档，比 v1 更强。新 AC-002-6 用例：`.nav-list` `flex-wrap` 与九个 `.full-label` 逐元素 `white-space` 计算样式（旧实现分别为 `wrap` / `normal`，必红）、同一行 ±1 px、`overflow-x: auto`、条件 scroll、末项矩形 ±1 px 容差、document/body 无横滚、点击到 `/settings`——与 tasks 标准 4 三层子项一一对应。组件测试用真实 `createMockDataClient()` 数据、不 mock 内部模块（AGENTS §5.6）。

## 4. 测试证据（亲跑 vs 实施者来源）

**本会话亲跑**（review 树、HEAD `fab08a6`、Node v25.2.1 / pnpm 11.21.0；`pnpm -C frontend install --frozen-lockfile` exit 0，package/lock 未变；4173 跑前无 LISTEN、仅 TIME_WAIT 残留、未占用他人进程）：

| 命令 | 结果 |
|---|---|
| `pnpm -C frontend test:unit -t "AC-002-4\|AC-009-2\|AC-008-1"` | **31 passed / 533 skipped（564 total）**，3 文件 passed / 11 skipped，exit 0 —— 6 + 13 + 12，与 Astra 分项计数一致 |
| `pnpm -C frontend typecheck && pnpm -C frontend lint` | 均 exit 0 |
| `pnpm -C frontend test:e2e -g "AC-002-2\|AC-002-6\|AC-002-7\|AC-005-1 v2-nav"` | **32 passed（35.6 s）**，exit 0 —— AC-002-2 10（1 菜单 + 8 直达 + 1 daily 深链）、AC-002-6 18（16 既有 + 960 / 979 两条 v2-nav）、AC-002-7 3、AC-005-1 1；与 Astra 四条命令计数一致 |
| 收尾 | 4173 无 LISTEN；`Get-CimInstance Win32_Process` 过滤本树路径的 node 进程为 0；`git status --short` 仅本文件 untracked |

**实施者来源（Astra，`implementation-v2-s0.md`，本会话未复现）**：red→green（保留旧 `flex-wrap: wrap` 时 `AC-002-6 v2-nav` 2 failed → nowrap 后 2 passed；红轮代码未提交）；全量 `pnpm test` 564 unit/component + 68 e2e 全绿；`pnpm build` 成功、779.98 kB chunk 仅警告。本会话对 red 轮只做了静态佐证：旧 CSS 下 `.nav-list` 计算 `flex-wrap = wrap`、`.full-label` `white-space = normal`，两条断言必红（与 A R4-C06 独立推论一致）。全量 68 e2e 与 build 未亲跑。

## 5. 边界与待办（不扩大）

- **代码保护**：本审查未改任何源码 / 测试 / 配置 / docs / spec / checklists / tasks / README / HANDOFF / converge；node_modules 为 ignored 产物。
- **待 H-x + 人工截图**：tasks §1.2 八行（H-1、H-2 标签 / 列表、H-3 路由、页面切片、H-4、H-5、H-6）全部未交付，闸门 3 未过；M-09～M-12 只有文本，截图与 Walter 人工验收未做；v1 M-01 / 03 / 04 / 08 仍待复核。
- **完整 v2：未收敛（外部阻塞）**，与 converge-v2-s0 §6 结论一致；T-V2-03～12 未做；AC-002-8 不满足；S0 不单独 Handoff，不进入最终 Review / Gate 2，**不建议立即 merge main**。
- **已知后续风险（沿用 Converge R-1）**：H-3 集成后 `/jobs` 壳 owner 断言将变红，按 T-V2-09#4 迁移。
- **v1 P3 台账（含 H-02）**：本轮未修、不宣称关闭。
- **本轮唯一后续建议**：P3-1 走 Analyze 登记（§3），不在本审查中代改 tasks。
