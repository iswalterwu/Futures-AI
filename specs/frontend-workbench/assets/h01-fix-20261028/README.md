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
