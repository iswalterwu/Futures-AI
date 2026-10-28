# frontend-workbench v2 S0 实施记录

> Implement = `openai/gpt-6-astra` via `openai`（provider/model：`openai/gpt-6-astra`）；无模型或通道切换。仅实施 T-V2-01 → T-V2-02，不是 Plan、Analyze、Converge、审核员 A、Gate 2 或 Handoff 产物。
> 唯一写入树：`D:/2030/Futures-AI-workbench-v2-implement`；分支：`feat/frontend-workbench-v2-s0`。
> 固定开工 HEAD：`6a1fda426edb568cf1bd9bfbef7d402af6f0e988`。进入时 `git status --short` 无输出，分支与 HEAD 均实测吻合。

## 开工核对（四闸门）

1. **v1 基线**：`git merge-base --is-ancestor 43b6d79681a49562f41751368b2ae00c24062f56 HEAD` 及对 `main` 均 exit 0。分支 reflog 实测创建于 `43b6d79`，经 `b375b27`、`79b5212` 快进至 `6a1fda4`。
2. **有效 Checklist / A**：已完整读取 `checklist-v2.md`（含历史与当前 R4），不是以 grep 无未勾项代替审核。A R4 = `claude-fable-5-1 via anthropic`，独立会话、固定审 `34ee7954d8aa26609c937dd6fcc7cc029baa2539`，0 阻断；R4-C01～C11 全由 A 正式勾选，C04/C05 再确认 I-01b/V-02，C10 仅放行 S0 内部设计。原样产物 `e596244fba308875152b0ce1a9c1752d6e85b6ae` 对本树清单的 `git diff --exit-code` = 0；未修改或勾选任何 checklist。核对 `79b5212..34ee795` 只含登记允许的 7 个文档路径；审查范围外对 `43b6d79` 的 diff 及旧清单对 `425c1fd` 的 diff 均 exit 0；冻结 spec 对 `fec3556` diff exit 0。tasks §1.1 与 HANDOFF 最新记录已登记 A 产物与固定对象，实施树已含登记。
3. **生产方交接**：T-V2-01/02 的 H-x 消费集合为空，门 3 对 S0 不适用。tasks §1.2 八行（H-1、H-2 标签/列表、H-3 路由、页面、H-4、H-5、H-6）仍未交付；不据 S0 放行 T-V2-03～12。
4. **内部 Analyze / G-02**：完整读取独立 R9（固定审 `ee3e348459124aead80d99c4f3b9438d24450a54`），R8 F-01/P2 与 F-02/P3 全关、无新增内部 P1/P2/P3。G-02 用户“可以”与九项单行、仅空间不足时导航内横滚、页面不横滚的裁定在最新 tasks / plan / HANDOFF 一致；增量已由 R9/A R4 覆盖。未修改设计或任务定义。

已重新完整阅读 AGENTS、docs/plan、docs/designUI、docs/interaction、冻结 spec v2.1、feature plan（含完整 §7）、tasks v2 全段、checklist-v2、R9 和 HANDOFF；按任务读取实际源码、测试和资产后才修改。

## 环境与执行约束

- Node `v25.2.1`、pnpm `11.21.0`。初始无 `frontend/node_modules`；`pnpm -C frontend install --frozen-lockfile` exit 0，251 包复用、下载 0，package/lock 未变。
- 沿用 Playwright 本机 Chrome、`http://127.0.0.1:4173` 与 `reuseExistingServer: false`。每次 e2e 前用 `Get-NetTCPConnection -State Listen -LocalPort 4173` 确认空闲；只由测试启停 webServer，没有杀他人进程或常驻后台服务，没有下载浏览器或改配置。
- 以下命令均在上述唯一 worktree 根执行。T01 测试时 HEAD 为 `6a1fda4`，工作区只有本任务范围内的未提交绿代码（红轮例外见下）；没有使用其他工作树结果。

## T-V2-01：完成

先精准修改 `design/ui/UI_NAV.md` 暗色适配段与 `design/ui/README.md` 索引行，再修改 nav/router/Rail 和 shell/agent e2e。九项顺序含作业与格物致知；research 壳导航与动态子项删除，契约遗留方法/fixtures 保留；`/daily/:date?` 保留；`/jobs` 仅明确 owner 占位、未造 `job-detail`。当前项用 meta.navId + route.name 区分 page/location；真实页面全局唯一。窄窗 CSS 仅在现有 viewport-collapsed 选择器内，li 为 flex 子项、标签 nowrap、容器 min-width 0 / overflow-x auto / overflow-y hidden；未加 JS、state、token 或自动滚动。

### 真实 red → green（R8 防回退）

- 九项导航和新窄窗测试已就位、**保留既有 `flex-wrap: wrap` CSS** 时执行：`pnpm -C frontend test:e2e -g "AC-002-6 v2-nav"` → **exit 1，2 failed**（960 / 979 均在 `.nav-list` 计算 `flex-wrap` 处：expected `nowrap`、received `wrap`）。测试未被故意破坏，未复制业务实现；红代码未提交。
- 只应用计划内最小窄窗 CSS 后，同一命令 → **exit 0，2 passed**。每个 full-label 逐个断言 white-space nowrap；同一行几何、容器 overflow-x auto、末项矩形约 1px 容差与点击到设置、document/body 无横滚均通过。只有实际 `scrollWidth > clientWidth` 才要求 `scrollLeft > 0`，不制造溢出。

### 六条标准 / 六条验证

| 标准 | 实际命令（完整） | 输出摘要 / exit | 证据范围 |
|---|---|---|---|
| 1 | `pnpm -C frontend test:e2e -g "AC-002-2"` | 10 passed / 0 | 九项顺序、href、唯一当前项、占位 owner、八个非工作台直达刷新、daily 深链；AC-002-2 壳部分 |
| 2 | `pnpm -C frontend test:e2e -g "AC-005-1 v2-nav"` | 1 passed / 0 | 九路由输入栏、提交展开及用户消息；AC-005-1 |
| 3 | `pnpm -C frontend test:e2e -g "AC-002-1\|AC-002-5"` | 2 passed / 0 | 无空白首帧、折叠持久化回归 |
| 4 | `pnpm -C frontend test:e2e -g "AC-002-6"` | 18 passed / 0 | 16 个既有断点/resize/偏好用例 + 2 个新窄窗用例；未写 breakpoints.spec |
| 5 | `pnpm -C frontend typecheck && pnpm -C frontend lint` | 两项均成功 / 0 | 派生删除无无用导入，静态打底，不是 AC-009-1 全量验收 |
| 6 | `pnpm -C frontend test:unit -t "AC-008-1"`；`git grep -nE "八项\|getResearchList\|研究扩展\|研究列表" -- design/ui`；`git diff --exit-code 43b6d79 -- design/ui/UI_LAYOUT.md` | 12 passed / 547 skipped，1 文件 passed / 13 skipped，exit 0；grep 无输出 / 1（预期无匹配）；diff 无输出 / 0 | registry 与导航登记；逐段核对 UI_NAV 为九项/单行/页面不横滚/仅不足时内部横滚/G-02；原文快照与 JSON 不动，UI_LAYOUT 不动 |

`git diff --check` 通过；保护路径（breakpoints、contracts、main、package/lock、AppShell）对 `43b6d79` 无差异。T01 后 4173 再查空闲。未触发 2h 超时拆分规则。

## T-V2-02：待串行实施

只在 T01 提交后开始；执行证据随后追加到此节，不预填完成或人工验收。

## 交付限制

- S0 不单独 Handoff；T03～12 不启动。没有正式 Converge / Review / Gate 2，不 push / PR / merge。
- AC-002-2 作业详情高亮的真实集成、AC-002-3 列表、AC-002-8 采集流程、作业轨道与对话上下文均未交付。`/jobs` 占位断言仅是 S0 证据，H-3 接入后由 T09 迁移。
- v1 P3 台账（含 H-02）、历史截图、人工勾选均不回写；没有视觉截图任务，不替 Walter 验收。所有 S1/S2 H-x 仍需固定实现 commit、有效 Checklist SHA、定向测试摘要与集成 SHA 四项齐全。
