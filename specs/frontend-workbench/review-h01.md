# 独立审核员 A：frontend-workbench H-01 修复（T-18）定向 Review 结果

> **判定：通过（无 P1 / P2；1 项 P3，可接受为后续）。**
> 本报告只写到临时证据目录，不改仓库 `review.md`；不批准 Gate 2、不 PR / merge、不改任何 tracked 文件、不勾选 Checklist / 人工清单。

## 0. 身份、通道与输入

- **审核员**：A = `claude-fable-5-1` **via anthropic**。原因：协调会话本窗口已实际探活 `claude-bridge`，返回 account quota exceeded（seven_day / monthly spend limit），按 AGENTS §6 规则 5 在本限额窗口内不重复试；Anthropic 官方通道最小真实调用 READY。换通道不换模型；与实施模型 `openai/gpt-6-astra` 不同、新开独立会话。
- **工作树**：`D:/2030/Futures-AI-frontend`，分支 `fix/frontend-workbench-visual`。启动时 `git status --porcelain` 为空（干净），`git rev-parse HEAD` = **`869cb71dce6d6553727fe30e4380e640cf25621b`**，与协调会话冻结目标一致。审核结束时工作树仍干净、HEAD 不变。
- **基线**：`43b6d79681a49562f41751368b2ae00c24062f56`（PR #7 在 main 的 merge commit）。
- **diff 范围**：`git diff 43b6d79..869cb71`，13 文件 +426 / −7。`frontend/` 只有 2 文件；`frontend` 树在 `771f2af` 与 `869cb71` 为同一对象 `03fda1deaef016793033c29f79ffce5b901f83a4`（之后两个提交 `f4ff7be` / `869cb71` 仅文档与截图）。
- **提交链**：`ef11610`（plan §7 / T-18 / review §10 / analyze / 状态表）→ `771f2af`（T-18 修复 + 回归 + tasks 实施记录）→ `f4ff7be`（4 张截图 + README）→ `869cb71`（converge §9、plan §7.6、analyze 末节、review §11 等）。
- **重新读取的文件**（不依赖会话记忆）：`AGENTS.md`、`docs/plan.md`、`docs/designUI.md`、`specs/frontend-workbench/{spec,plan,tasks,checklist,review,analyze,converge,manual-acceptance}.md`（spec 全文；plan / tasks / review / analyze / converge 按真实 diff 读本轮新增节）、`specs/frontend-workbench/assets/h01-fix-20261028/README.md`、`assets/handoff/README.md`（M-08 条目）；源码 `frontend/src/modules/market-board/SampleChart.vue`、`frontend/src/shared/num.css`、`frontend/src/pages/PlaceholderPage.vue`（先例）、`frontend/src/shared/components/DataTable.vue`（`td.num`）、`frontend/e2e/theme.spec.ts` 全文、`frontend/playwright.config.ts`、`frontend/src/design/generated/tokens.ts`（`window` / `font.mono`）。
- **亲自看图**：4 张新 PNG 由本会话原生视觉读取（AI 观察，不是 Walter 人工验收）。

## 1. 亲跑验证（新日志写在本目录 `reviewer-*`，未触碰已归档证据）

| 命令 | 结果 | 日志 |
|---|---|---|
| 启动前 `netstat` 核对 4173 | 无监听者；`playwright.config.ts` 为 `reuseExistingServer: false` + `--strictPort`，不会共用他人服务 | — |
| `pnpm -C frontend test:e2e -g "H-01"` | **2 passed / exit 0**（1440×900、960×900 各一；Chrome 156.0.8078.49） | `reviewer-h01-e2e.{log,exit}` |
| `pnpm -C frontend test:e2e -g "AC-006-3\|AC-006-4\|AC-001-4\|AC-002-6"` | **22 passed / exit 0**（含 H-01 两档、AC-006-3 两条、AC-006-4、tokens AC-001-1/4、breakpoints AC-002-6 全部 14 视口 + 2 条动态） | `reviewer-h01-related-e2e.{log,exit}` |
| `pnpm -C frontend check --only generated`（在 `frontend/` 下） | **exit 0**：156 令牌 / 5 生成物对拍、契约 12 方法 10 事件；无生成物漂移 | `reviewer-check-generated.{log,exit}` |
| `git diff --check 43b6d79..869cb71` | exit 0 | — |
| `git diff --exit-code 43b6d79..869cb71 -- spec.md checklist.md manual-acceptance.md assets/handoff frontend/src/shared frontend/src/design frontend/contracts design docs AGENTS.md backend` | exit 0（冻结件零改动）；`assets/handoff` 仍 63 个 tracked 文件；Checklist 70 `[x]` / 0 `[ ]`；manual-acceptance 0 `[x]` / 8 `[ ]` | — |
| 截图溯源 sha256 | 本会话绿跑产出的 `test-results/**/sample-chart-1440x900.png` = `4b011b68…`、`…960x900.png` = `d6e0f603…`，与仓库 `after-1440x900.png` / `after-960x900.png` **逐字节相同**；仓库 `before-1440x900.png` = `125977fa…`、`before-960x900.png` = `c4c722da…`，与归档红跑产物 `h01-red-results/**/sample-chart-*.png` **逐字节相同** | — |
| 运行后 `netstat` | 4173 无 LISTENING（仅客户端 TIME_WAIT 残留，内核自行回收）；未启动独立服务、未杀其他进程 | — |

**查阅但非亲跑**（Implement 日志，exit 文件与 mtime 一并核对）：
- `h01-red.log` / `.exit=1`（21:37:20）：`Running 2 tests`，**2 failed**，两档均失败于 `theme.spec.ts:100` "caption text and number share one line"——1440：`max(top)=531.75 ≥ min(bottom)=513.75`；960：`738.5 ≥ 720.5`。失败点在生产版式几何，之前的 `data-state=ready` 等待与 web server 启动均正常，不是环境 / fixture 失败。`h01-red-results/**/error-context.md` 的 ARIA 快照显示 figure 内 "近" 与 "60" 为独立节点，与三行版式一致。
- `h01-green.log` / `.exit=0`（21:37:50）：2 passed。`h01-related.log` / `.exit=0`：6 passed。
- `h01-tests.log` / `.exit=0`（21:40:48）：六项守卫（generated / colors 24/24 / glass / updown / grid / network）+ vue-tsc + eslint 通过；Vitest **14 文件 559 passed**；Playwright **68 passed**（无 skipped）。
- `h01-build.log` / `.exit=0`：828 模块，JS 780.57 kB，仅 >500 kB chunk 提示。`h01-diff-check.exit=0`。
- 时序：全部日志早于 `771f2af`（21:42:02）提交，但日志中的行号（`theme.spec.ts:62:3`、`:100`、`:139:1`）与提交内容一致，且其后 `frontend/` 未再改动（树对象相同）。**我未亲跑全量 `pnpm -C frontend test` 与 `build`**，不冒称。
- **红跑我未亲自复现**（复现需改动 tracked 的 `SampleChart.vue`，超出只读授权）；以红跑日志 + 逐字节相同的 before 截图 + error-context 快照作为"先红"证据，三者相互印证。

## 2. 重点核验逐项结论

### 2.1 根因与修复（生产 diff 仅 `SampleChart.vue` +4 行）

- 根因核实属实：`figcaption { display:flex }` 使标签 `<span>` 块化；内层 `<span class="num">` 命中全局 `frontend/src/shared/num.css:9-11` 的 `span.num { display:block }`，把行内格式化上下文切成三个匿名块行，`text-align:right` 再把 60 推右。before 截图（764×51 / 882×50）正是"近 / 右推的 60 / 日收盘 · 样例"三行，单位在首行右端。
- 修复 `SampleChart.vue:117-119` `figcaption .num { display: inline; }` 位于 `<style scoped>`：编译为 `figcaption .num[data-v-…]`，特异度 (0,2,1) > 全局 `span.num` (0,1,1)；该组件模板无子组件，`figcaption` 在 `frontend/src` 中只出现于此文件，因此**不会波及任何其他 `span.num`**（盘面 / 关注列表 / 焦点带 / `DataTable` 的 `td.num` 单元格）。`num.css` 的 mono / `tabular-nums` / `nowrap` / `text-align:right` 均未被覆盖（`text-align` 对行内元素无视觉效果但计算值仍为 `right`，旧 `tokens.spec` AC-001-4 断言不受影响，亲跑通过）。
- 与仓库先例 `PlaceholderPage.vue:51` `.placeholder-page .num { display:inline-block }` 同口径；未新增令牌、全局样式、主题或数据改动。未为猜测的风险扩加复杂度，符合 AGENTS §5.1 / §5.3。
- 需求解释（plan §7.2 / analyze）：AC-001-4 的"表格与卡内数值右对齐"针对数值格 / 数值列；图注里嵌在句中的计数是行内文字。我同意该解释——AC 文字与自动判据均未改，属实现纠偏，不需回流 Clarify / Gate 1 / 新 ADR。

### 2.2 回归测试（测试 diff 仅 `e2e/theme.spec.ts` +78 行）

- **真实 Chrome**：`channel: 'chrome'`，日志实证 Chrome 156.0.8078.49；测试读取 `getComputedStyle` 与 `Range.getClientRects()` 几何，不是只查 DOM 文字（旧 AC-006-3 用例只断 `toContainText`，在基线上本就通过——plan §7.1 如实指出）。
- **视口由令牌取值**：`[T.window.width, T.window.min_width] × T.window.height` = 1440 / 960 × 900（`tokens.ts:185-189`），无新魔数。
- **判据覆盖**（`theme.spec.ts:62-137`）：三段文本节点各恰 1 个矩形（未折行）；竖向区间有公共交集（`max(top) < min(bottom)`，避开字体内容区高度差异的误判）；水平顺序 近 < 60 < 日收盘；数字 `display:inline`、字体首项 = `T.font.mono` 首项、含 `tabular-nums`、计算 `text-align:right`；单位文本 = fixture `series.unit`、宽高 > 0、落在 figcaption 内、与标签同行且 `rects[2].right ≤ unit.left`（不重叠）；`captionOverflow` / `pageOverflow` 均 false；图注以外**全部** `span.num` 仍 `block` + mono + tabular + right，scope 集合须含 `market-board` / `watchlist` / `focus`（加载页的 `span.num` 由 `v-if` 移除，不在就绪后的 DOM 中，不干扰）。
- **先红后绿**：红跑失败点恰是"同一行"断言（不是前置等待或 fixture），两档的受/期望值差 ≈ 18 px（约一行高），与三行版式一致；绿跑两档通过；本会话重跑再次通过。无 `test.skip` / `only` / 空跑；全量 68 E2E 无 skipped。
- **脆弱性评估**：`rects[0].right ≤ rects[1].left` 与 `rects[1].right ≤ rects[2].left` 依赖相邻文本节点在行内流中的几何邻接，Chrome 子像素下为精确相等或 ≤，Implement 两次 + 本会话两次共四次运行稳定；计算 `fontFamily` 返回声明栈而非解析字体，与令牌首项比较是确定性的。未发现错误固化（没有把缺陷状态写成期望值）。
- `console.log` 用于把 Chrome 版本 / 视口 / 数据源打进列表报告（`theme.spec.ts:74`），README 的 Chrome 版本即据此核实；有效且无副作用，见 §4 观察。

### 2.3 截图证据（`assets/h01-fix-20261028/`，新目录，4 PNG + README）

- 只用内置 mock `scenario=normal`，新 Playwright context；README 记录基线 / 规划 / 修复提交、`T.window` 视口来源、Chrome 156.0.8078.49 / Playwright 1.64.1、执行者模型、"AI 采集非 Walter 人工验收"声明，提交号写法诚实（不把采集时尚未产生的提交写成 HEAD）。
- 溯源可核实：before 与归档红跑产物逐字节相同；after 与**本会话**绿跑产物逐字节相同（见 §1），说明截图可复现、未改图。
- 我亲自看图：before 两档三行、单位在首行右端；after 两档单行"近 60 日收盘 · 样例"、"元/桶"同行在右、不重叠。与 Converge 的 AI 观察一致。
- `assets/handoff/` 60 张旧图（63 tracked 文件）零改动；没有把 AI 看图写成 Walter 人工验收；960 图注明"已滚动到位"且 plan §7.6 / README / converge §9 均明确**只证明图注一行、不证明 960 下整图一屏完整（H-02）**，未伪称全图完整显示。

### 2.4 文档一致性与边界

- plan §7（含 §7.6 口径校准）/ tasks T-18（5 条完成标准 ↔ 5 条验证命令）/ analyze 两节 / converge §9 / review §10–§11 / `specs/README.md` 状态行 / 证据 README 之间：状态、提交号、计数（559 + 68、18 项 / 29 h）、模型通道记录、H-02 "留待 v2、未修复、未写入 v2 规格" 的措辞一致；历史正文只追加不改写（`plan.md` / `review.md` 相对基线仅新增行；`tasks.md` 只改 H-01 / H-02 台账状态、4 行 AC 覆盖映射与末尾合计）。
- Gate 边界表述正确：旧 v1 Gate 2 保持"历史已批准（11 项 P3 接受为后续）"，本次修复 Gate 2 在所有文档中标"未批准"；用户"继续"被明确限定为采用"H-01 最小修复"建议，不是 Gate 2 / M 项签字 / v2 授权。H-02 未被说成已修复或已交付 v2。
- 未改冻结 spec（45 AC）、Checklist（70/70）、manual-acceptance（0/8）、全局样式、令牌、生成物、契约、`design/`、`docs/`、`backend/`。未扩改 11 项旧 P3（含 R2-01 头部计数，保留为历史）。
- 本轮 review §11.3 把 A 的输入写为 `43b6d79..771f2af`，实际冻结目标为 `869cb71`；两者 `frontend` 树相同，差异仅文档与截图，本报告已按 `869cb71` 全量审阅，不构成问题。

## 3. 发现

### P1：无
### P2：无

### P3-1 M-08 的 1440 整图证据仍是修复前原件，而 1440 不受 H-02 影响

- **位置**：`specs/frontend-workbench/assets/handoff/m08-chart-1440.png`（未重采，仍为修复前）；`tasks.md` H-01 台账行状态列已如实写"M-08 整图未重采，`m08-chart-1440.png` 仍为修复前原件"；plan §7.6 把宽档也取图注特写的理由写为"便于对照"。
- **影响**：Walter 复核 M-08 时，`assets/handoff/README.md` 索引（第 56 行）指向的基准整图仍显示三行图注；需要靠 tasks / README 文字转向新目录的图注特写，且图注特写不含图表本体。H-02（<980）对 1440 没有影响，plan §7.3 原本规划的 `figure` 整图截图在宽档本可直接采集。不影响自动判据、不违反任何 AC、不阻塞本次修复——所以是 P3。
- **建议**（后续任务，不要求本轮返工）：在 Walter 做 M-08 人工复核前，补采一张修复后 1440×900 的 `figure` 整图到 `assets/h01-fix-20261028/`（或其他新目录），不覆盖 `assets/handoff/` 旧图；或由集成人在 Gate 2 材料里明确告知 Walter 看图路径。960 整图仍受 H-02 限制，保持现有"图注特写 + 标注边界"的做法即可。

## 4. 观察（非发现，不计入判定）

- `theme.spec.ts:74` 的 `console.log` 把浏览器版本 / 视口打到列表报告，是本轮 Chrome 版本溯源的依据；若后续希望报告更安静，可改为 `testInfo.annotations` / `attach`，纯偏好。
- 实施日志产生于提交前工作树（Converge 已如实记录）；本会话重跑 H-01 两档与相关 22 条在 `869cb71` 上通过，并且绿跑截图与入库 after 图逐字节相同，已弥补"提交后未重跑"的证据缺口（全量 559 + 68 与 build 仍只凭日志）。

## 5. 范围 / 需求对齐与人工项、Gate 边界

- **对齐**：本轮只做 H-01 最小样式修复（T-18），对应既有 AC-001-4（图注数字仍等宽 + tabular；其他 `span.num` 不变）、AC-006-3（样例图图注版式）、AC-002-6（仅无横向溢出条款）、AC-009-1（全量 + build）、M-08 / AC-009-2（新截图证据，人工勾选未动）。无需求变更，未扩范围，未触碰 H-02 / v2 / 旧 P3。
- **人工项**：M-01 ~ M-08 共 8 项仍未勾选，须由 Walter 本人复核；本报告与所有本轮文档中的"看图"都是 AI 观察。
- **Gate 2**：本次 H-01 修复的 Gate 2 **未批准**，由 Walter 在本 Review 之后确认；旧 v1 Gate 2 为历史已批准，不混淆。本报告不批准 Gate 2、不 PR / merge。

## 6. 判定

**通过**（无 P1 / P2；P3-1 一项，可接受为后续任务）。
