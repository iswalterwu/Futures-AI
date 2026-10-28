# H-01 图注修复：浏览器截图证据

- 日期：2026-10-28。
- 执行者：Implement = **openai/gpt-6-astra via openai**（首选，无回退）。这是 **AI 执行采集**，不是 Walter 人工验收；本轮没有作看图结论，待协调会话原生视觉复核。M-01 ~ M-08 人工勾选未改。
- 分支：`fix/frontend-workbench-visual`。
- 生产基线：`43b6d79681a49562f41751368b2ae00c24062f56`（origin/main，PR #7 merge）。
- 规划提交：`ef1161029de21fba258dec95b695c8d6f91fa3ff`。
- 修复与测试提交：`771f2af9d3254c3b2596554f53216e4be9732320`。截图在提交前采集：before 使用未改的基线生产代码 + 新测试，after 使用与该修复提交一致的生产代码与测试；不把采集时尚未产生的提交号写成当时 HEAD。
- 浏览器：本机 Google Chrome **156.0.8078.49**，Playwright **1.64.1**，Windows；`channel: chrome`，默认 deviceScaleFactor = 1。
- 页面：`http://127.0.0.1:4173/workbench?scenario=normal`，新 Playwright browser context，默认布局与偏好；仅内置 **mock normal**，无真实后端、私有数据或凭证。
- 视口：宽档 `T.window.width × T.window.height` = **1440×900 CSS px**；窄档 `T.window.min_width × T.window.height` = **960×900 CSS px**。

## 文件与采集方式

| 文件 | 生产代码 | viewport | 内容 |
|---|---|---|---|
| [before-1440x900.png](before-1440x900.png) | 基线（未修复） | 1440×900 | figcaption 特写 |
| [before-960x900.png](before-960x900.png) | 基线（未修复） | 960×900 | figcaption 特写，已滚动到位 |
| [after-1440x900.png](after-1440x900.png) | 局部 display 修复 | 1440×900 | figcaption 特写 |
| [after-960x900.png](after-960x900.png) | 局部 display 修复 | 960×900 | figcaption 特写，已滚动到位 |

所有 PNG 均由真实浏览器 `locator.screenshot()` 直接输出，未拼接、未改图。文件名中的尺寸是浏览器 viewport，不是元素截图尺寸。按本轮执行指示，截图目标采用 **figcaption** 而非整个 figure：960 下 H-02 仍占据导航高度，整图不能一屏完整显示；先对图注 `scrollIntoViewIfNeeded()` 再截图，没有修改导航、布局或生产 DOM 来拍图。宽档也取同一图注特写，便于对照。原 `assets/handoff/` 60 张图未覆盖。

## 命令与自动化证据

工作目录：仓库根。测试位置：`frontend/e2e/theme.spec.ts`，两个标题以 `AC-001-4 AC-006-3 H-01` 开头。

1. 在旧生产代码上，仅加测试后执行：
   ```sh
   pnpm -C frontend test:e2e -g "H-01"
   ```
   **2 failed，exit 1**；两档均在文本节点 Range 的“caption text and number share one line”断言失败。截图先于断言执行；将 `frontend/test-results/**/sample-chart-<width>x900.png` 原样复制为 `before-*`，再改生产样式。
2. 仅在 `SampleChart.vue` scoped 样式加入 `figcaption .num { display: inline; }`，再次执行同一命令：**2 passed，exit 0**。将同名输出原样复制为 `after-*`，早于后续测试清空输出目录。
3. 相关回归：
   ```sh
   pnpm -C frontend test:e2e -g "AC-006-3|AC-006-4|AC-001-4"
   ```
   **6 passed，exit 0**。
4. 全量与构建（本轮实跑）：
   ```sh
   pnpm -C frontend test
   pnpm -C frontend build
   git diff --check
   ```
   全量六项守卫 / typecheck / lint 通过，Vitest **14 文件 / 559 passed**，Playwright **68 passed**（较基线新增两档 H-01 用例）；build **exit 0**（828 模块，JS 780.57 kB，仅 chunk 大小提示）；diff check **exit 0**。

日志与各自退出码在本机临时证据目录 `C:/Users/iswal/AppData/Local/Temp/fw-h01-resume.fw1YK3/`：`h01-{red,green,related,tests,build,diff-check}.{log,exit}`；红跑 trace / 截图副本在 `h01-red-results/`。日志与完整会话不入库。

## 边界与待办

自动化读取真实计算 display / mono / tabular / 右对齐及文本节点 Range 几何（各一矩形、竖向共同交集、水平顺序），校验单位同一行、不重叠、页面与图注无横向溢出；图注以外的所有 `span.num` 保持 block（集合含盘面、关注列表与焦点带）。这些自动断言不替代看图与人工验收。

H-02 未修复、留待 v2；11 项旧 P3 未扩改。该修复尚未 Converge、独立 Review 或 Gate 2。未 push / PR / merge。Playwright 自行启停 4173 测试服务，运行后已确认无监听者；没有启动额外服务或其他 agent。

## Converge 追记（2026-10-28；以上为 Implement 原文，不改写）

- 执行者：Converge = claude-opus-5-5 via anthropic。**AI 观察，不是 Walter 人工验收。**
- 溯源核对：`before-1440x900.png`（sha256 `125977fa…`）与 `before-960x900.png`（`c4c722da…`）与本机红跑产物 `h01-red-results/**/sample-chart-*.png` 逐字节相同；PNG 尺寸 before 764×51 / 882×50、after 764×19 / 882×18（元素截图尺寸）。Playwright 1.64.1 由 `frontend/package.json` 与已安装包版本核实，Chrome 156.0.8078.49 由测试日志核实。
- 原生视觉读 4 张图：修复前两档均为三行——“近” / 右推的 “60” / “日收盘 · 样例”，单位“元/桶”在首行右端；修复后两档均为单行“近 60 日收盘 · 样例”，单位“元/桶”同行在右、不重叠。
- 限定：图注特写只证明图注一行；不证明整张样例图在 960 下一屏完整（H-02 留待 v2、未修复）。截图口径校准见 [plan §7.6](../../plan.md)；收敛记录见 [converge §9](../../converge.md)。

## 独立 Review 追记（2026-10-28；以上为实施 / 收敛时点原文，不改写）

- 独立 A（claude-fable-5-1 via anthropic）Review **通过**；A 本会话绿跑产出的截图与本目录 `after-*` 逐字节相同，`before-*` 与归档红跑产物逐字节相同；A 原生视觉看图结论与上文一致（AI 观察，非 Walter 人工验收）。原件见 [review-h01.md](../../review-h01.md)。
- A 的 P3-1：本目录只有图注特写，`assets/handoff/m08-chart-1440.png` 仍为修复前整图；是否补采修复后 1440 整图待 Walter 决定（tasks A-H01-P3-1）。本次修复 Gate 2 未批准。

## Gate 2 / Handoff 追记（2026-10-28；以上原文不改写）

- Walter 2026-10-28 对本轮 Gate 2 回复“好的”：修复获批；A-H01-P3-1（补采修复后 1440 整图）接受为后续、**尚未补采**，本目录仍只有图注特写。这不是 M-08 人工签字。Handoff 记录见 [review.md §14](../../review.md)。

## T-19：修复后 1440 整图补采（2026-10-28；以上历史不改写）

- 新入口：[after-1440x900-full.png](after-1440x900-full.png)（整个 figure：图注、单位、完整 SVG 曲线与坐标轴）；程序生成的溯源 / 几何 / hash：[capture-full-1440.json](capture-full-1440.json)。这是一张 **764×211 像素的元素截图**，采集 viewport 为 **1440×900 CSS px**，不与旧图注特写混淆。
- 执行者：Implement = **openai/gpt-6-astra via openai**（首选，无回退）。仅 AI 浏览器采集与自动断言，**本轮未作看图结论，不是 Walter 人工验收**；M-08 待 Walter 复核，8 项人工框仍未勾选。A-H01-P3-1 已补采，不在本阶段宣称关闭；尚待 Converge / 独立 Review / 本轮 Gate 2。
- 来源：分支 `docs/frontend-workbench-m08-evidence`；采集时 HEAD 与代码基线均为 `44845c8922becfdb26bf4d0c5572f12a79ce748f`（PR #8 merge），frontend 树 `03fda1deaef016793033c29f79ffce5b901f83a4`。当时仅五份规划文档未提交；脚本实际执行 `git diff --exit-code 44845c8 -- frontend` 并核对 frontend 树一致、无未跟踪前端文件。工作树状态原样记录在 JSON，未编造截图提交号。
- 环境：Chrome **156.0.8078.49** / Playwright **1.64.1**，`channel: chrome`，deviceScaleFactor **1**；新 browser context、默认布局与偏好，`http://127.0.0.1:4191/workbench?scenario=normal`，仅内置 mock normal。视口来自 `T.window.width` / `T.window.height`；采集时间 **2026-10-28T18:20:23.216Z**。
- 真实采集命令（仓库根）：`node C:/Users/iswal/AppData/Local/Temp/fw-m08-evidence.nY5thg/capture-full.mjs`。一次性脚本只在临时目录，使用仓库既有 Playwright / Vite；先检查端口空闲，再以 `--host 127.0.0.1 --port 4191 --strictPort` 启动自己的 Vite 子进程，完成或失败均关闭自己的浏览器并仅终止自己创建的 PID 树，不共享 / 清理他人服务。
- 步骤：等待模块 ready、SVG 与图实例 → 等待字体 → `figure.scrollIntoViewIfNeeded()` → 读取真实几何 / Range / 主题并断言 → 对整个 figure 调用 `locator.screenshot()` → 计算 PNG SHA256 并生成 JSON。没有改页面 DOM / CSS、隐藏元素、修改生产代码或后处理 PNG。
- 几何证明（CSS px）：figure `(left=237, top=498.75, right=1000.328125, bottom=708.25)`；模块区 bounds `(224, 416.75)–(1414, 829.5)`，client 可视矩形 `(224, 416.75)–(1414, 829.75)`；viewport `(0,0)–(1440,900)`。figure 完全在两者内部，图注与 SVG 完全在 figure 内，四项 `fullVisibility` 全为 true。图注三段 Range 的共同竖向区间 `500.75–513.75`，单位同行在右；SVG 有真实序列 path 与非空轴文字；实例数据与 fixture 的 **60 点**一致、主题色与令牌一致、背景为 `transparent`。
- PNG SHA256：`15c08282a5f7b65f6df162ab5818dbaf513f7bc891571e757d956beb3c79a678`（17,540 bytes），可用 `sha256sum specs/frontend-workbench/assets/h01-fix-20261028/after-1440x900-full.png` 对拍 JSON。
- 脚本首次运行在临时脚本的 `isDisposed() === false` 断言停止（ECharts 未销毁时实际返回 undefined），未出图，且己方进程已清理；改为与既有 e2e 一致的“不为 true”判据后采集成功（exit 0）。未改变任何产品行为或完整可见判据。首次日志 `capture-attempt-1.{log,exit}` 与成功日志 `capture.{log,exit}` 均保留在本轮临时证据目录，不入库。
- 本轮定向验证见 T-19 实施记录；上方 **559 + 68 / build 是旧 H-01 证据**，本轮不重跑全量 / build、不做旧代码红跑。旧 60 张图与 4 张图注特写均保留；不采 960 整图、不改 H-02 / v2 / 旧 11 项 P3。

## T-19 Converge 追记（2026-10-28；以上原文不改写）

- Converge = claude-opus-5-5 via anthropic。PNG sha256 实测 = JSON；JSON `scriptSha256` = 临时脚本当前 hash；来源 HEAD / frontend 树与基线 `44845c8` 一致。
- 原生视觉读 `after-1440x900-full.png`（**AI 观察，不是 Walter 人工验收**）：整个 figure，图注“近 60 日收盘 · 样例”单行、“元/桶”在右；折线、y 轴 480 ~ 515 与 x 轴 08-06 ~ 10-23 完整，无裁切、无白底。
- 当前阶段：T-19 证据补采范围已收敛（[converge §10](../../converge.md)）；待独立 A Review 与本轮 Gate 2；M-08 人工复核待 Walter。

## T-19 独立 Review 追记（2026-10-28；以上原文不改写）

- 独立 A（claude-fable-5-1 via anthropic）Review **通过**；A 用原脚本副本独立复采，PNG 与本目录 `after-1440x900-full.png` 逐字节相同，JSON 仅执行者 / HEAD / 工作树 / 脚本 hash / 时间等预期差异。原件 [review-m08.md](../../review-m08.md)。
- A-M08-P3-1：JSON 中 `checks.*` 等为断言守卫后的常量（数据真实），待 Walter 裁定。本轮 Gate 2 未批准；M-08 人工复核待 Walter。
