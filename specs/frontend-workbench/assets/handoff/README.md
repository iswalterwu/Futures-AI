# frontend-workbench v1 · Handoff 截图证据索引

> 本目录的 `*.png` 与 `capture-log*.json` 是**生成物**：由一次性 Playwright 采集脚本对内置合成 mock 实拍，不手修；需要更新时只能重采。
> 本 README 是人写的索引与观察记录，对应清单见 [manual-acceptance.md](../../manual-acceptance.md)。

## 采集元数据

| 项 | 值 |
|---|---|
| 代码提交 | `8920b06`（合并主线后的 HEAD；`git diff b991059 8920b06 -- frontend` 为空，前端代码与 Review 第二轮复核的 `923e238` 逐字一致） |
| 浏览器 | Google Chrome 156.0.8078.49（Playwright 1.64.1 `channel: 'chrome'`，无头） |
| 运行环境 | Windows 11，Node v25.2.1，Vite 8.3.5 开发服务 `127.0.0.1:4191`（独立端口，采集完已停止；不占用测试用 4173） |
| 数据 | 仅内置合成 mock（`VITE_DATA_MODE` 默认 mock），无后端、无私有文档 / 头寸 / 凭证 |
| 视口 | 基准 1440×900；M-06 另取 1501 / 1499 / 1401 / 1399 / 1241 / 1239 / 981 / 979 / 960，高度均 900 |
| 场景 / 回放 | `?scenario=normal / empty / slow / error`；`?agentScript=success / failure / retry / long`；M-07 另以 `reducedMotion: 'reduce'` 模拟 |
| 上下文 | 每组场景新开浏览器上下文（localStorage 为空，默认布局 / 侧栏 / 抽屉起步） |
| 执行者 | AI：Handoff = claude-opus-5-5 via anthropic（浏览器操作 + 视觉检查）。**不是 Walter 本人的人工逐图验收** |
| 日期 | 2026-10-28 |
| 采集脚本 | 系统临时目录的一次性脚本（主脚本 55 张 + 补充脚本 5 张；不入库、不新增生产工具链）。逐张的地址、视口、场景、脚本见 [capture-log.json](capture-log.json) 与 [capture-log-supplement.json](capture-log-supplement.json)；其中 `observations` 是采集时的 DOM 辅助测量（布局列数、平移量、存储值等），只用来佐证动态行为，**不替代**看图 |

## 视觉检查方式

每张截图都由 Handoff 执行者用原生视觉逐张打开查看（共 60 张），结论写在 manual-acceptance.md 各项的“AI 辅助视觉验收”段。动态行为（滚动、暂停、后台连续、角标变化、档位持久化）由脚本实际操作并记录前后状态，没有只凭静态图推断。

## 截图清单

| 清单项 | 文件 | 场景 |
|---|---|---|
| M-01 | [m01-1440-workbench](m01-1440-workbench.png) | 基准工作台整页 |
| M-01 | [m01-1440-library-open](m01-1440-library-open.png) | 模块库展开（抽屉层） |
| M-01 / M-05 | [m01-1440-drawer-half](m01-1440-drawer-half.png) | 对话抽屉半高（success 完成） |
| M-01 | [m01-1440-closed-again](m01-1440-closed-again.png) | 收起抽屉后（行情价格出现“AI 已完成”角标） |
| M-02 | [m02-rail-brand](m02-rail-brand.png) | 品牌字标与侧栏导航 |
| M-02 / M-03 | [m02-focus-kpi](m02-focus-kpi.png) | 焦点带 KPI、双语段标 |
| M-02 / M-04 | [m02-watchlist-table](m02-watchlist-table.png) | 模块壳双语标题与表格数值 |
| M-02 | [m02-page-title-placeholder](m02-page-title-placeholder.png) | 页标题（知识库占位页） |
| M-03 | [m03-focus-normal](m03-focus-normal.png) | 正常两段与结论 |
| M-03 | [m03-after-layout-change](m03-after-layout-change.png) | 移除 / 上移模块后焦点带仍固定 |
| M-03 | [m03-daily-entry](m03-daily-entry.png) | 点击焦点带进入 `/daily/2026-10-28` |
| M-03 | [m03-focus-empty](m03-focus-empty.png) | 无日报空态 |
| M-04 | [m04-market-board](m04-market-board.png)、[m04-board-grid](m04-board-grid.png) | 行情价格：样例折线 + 盘面网格（`待 / – / 休`） |
| M-04 | [m04-watchlist](m04-watchlist.png) | 关注列表 |
| M-04 | [m04-release-calendar](m04-release-calendar.png) | 数据发布日历 |
| M-04 | [m04-placeholder-supply-demand](m04-placeholder-supply-demand.png)、[m04-placeholder-positions](m04-placeholder-positions.png) | 壳 + 示例占位 |
| M-04 | [m04-library-dialog](m04-library-dialog.png)、[m04-library-dialog-bottom](m04-library-dialog-bottom.png) | 模块库七项（顶部 / 滚动到底） |
| M-04 | [m04-slow](m04-slow.png)、[m04-empty](m04-empty.png)、[m04-error](m04-error.png)、[m04-error-detail](m04-error-detail.png) | 加载 / 空 / 错误三态 |
| M-05 | [m05-success-half](m05-success-half.png)、[m05-success-steps-expanded](m05-success-steps-expanded.png)、[m05-success-tall](m05-success-tall.png) | success：半高、步骤详情、加高 |
| M-05 | [m05-failure](m05-failure.png)、[m05-retry](m05-retry.png) | failure / retry 过程与终态 |
| M-05 | [m05-long-running-badge](m05-long-running-badge.png)、[m05-long-completed](m05-long-completed.png)、[m05-long-done-badge](m05-long-done-badge.png)、[m05-long-badge-cleared](m05-long-badge-cleared.png) | long：运行中指示与角标、后台完成、角标清除 |
| M-05 | [m05-hint-highlight](m05-hint-highlight.png) | 从价格页建议跳转 → 工作台高亮 |
| M-06 | [1501](m06-1501.png)、[1499](m06-1499.png)、[1401](m06-1401.png)、[1399](m06-1399.png)、[1241](m06-1241.png)、[1239](m06-1239.png)、[981](m06-981.png)、[979](m06-979.png)、[960](m06-960.png) | 各断点两侧与最小宽度 |
| M-06 | [m06-1440](m06-1440.png)、[m06-1440-restored](m06-1440-restored.png) | 基准与从 960 放回基准 |
| M-06 | [m06-960-library](m06-960-library.png)、[m06-960-drawer](m06-960-drawer.png)、[m06-960-watchlist](m06-960-watchlist.png) | 窄窗模块库 / 抽屉 / 单列模块 |
| M-07 | [m07-ticker-t0](m07-ticker-t0.png)、[m07-ticker-t3s](m07-ticker-t3s.png)、[m07-ticker-hover-paused](m07-ticker-hover-paused.png) | 滚动与悬停暂停 |
| M-07 | [m07-ticker-reduced](m07-ticker-reduced.png)、[m07-ticker-reduced-scrolled](m07-ticker-reduced-scrolled.png)、[m07-ticker-empty](m07-ticker-empty.png) | 减少动态 / 手动横滚 / 空态 |
| M-08 | [m08-chart-1440](m08-chart-1440.png)、[m08-chart-1440-tooltip](m08-chart-1440-tooltip.png) | 基准样例图与浮窗 |
| M-08 | [m08-chart-960-scrolled](m08-chart-960-scrolled.png)、[m08-chart-960-scrolled-tooltip](m08-chart-960-scrolled-tooltip.png) | 960 窄窗样例图与浮窗（滚动到位） |
| M-08 | [m08-chart-960](m08-chart-960.png)、[m08-chart-960-tooltip](m08-chart-960-tooltip.png) | 主脚本未滚动到位的 960 局部，被模块区滚动边界裁切；保留为 H-02 的直观证据，不作为图表本身的判据 |

## 动态行为观察（脚本实际执行）

- **抽屉档位**：加高 → 刷新后仍为 `tall`（存储 `tall`）；收起 → 刷新后不可见（存储 `closed`）。
- **failure / retry**：failure 步骤为“思考摘要 → 工具调用 → 工具结果（失败）→ 步骤错误”，唯一终态 `run.failed`；retry 中间出现非终态“步骤错误（将自动重试）”，随后重试成功，唯一终态 `run.completed`。
- **long 后台连续**：发送后 2 步、行情价格角标 `running`、运行中指示可见 → 收起抽屉并切到 `/prices` 约 4 s，步骤增至 4、指示仍在 → 回工作台并展开，同一 `runId` 完成，步骤 id `1..7` 无重复，指示消失；角标 `done` → 点击模块标题后 `none`。
- **引导跳转**：从 `/prices` 点击“前往模块：market-board” → 地址 `/workbench`，抽屉收起，行情价格高亮。
- **ticker**：轨道平移 t0 −8.1 px → 3 s 后 −66.2 px（持续滚动）；悬停 1.5 s 内保持 −68.36 px，聚焦同样保持（暂停）；减少动态时动画为 `none`，资讯区可手动横滚到 205 px（内容 1011 px / 可视 806 px），页面 `scrollWidth = clientWidth = 1440`。
- **断点**：栅格列数 1501→4、1499/1440/1401→3、1399/1241/1239/981→2、979/960→1；焦点卡 ≥1241 为 6、≤1239 为 4；979/960 侧栏塌为顶部导航；所有视口页面无横向溢出（`scrollWidth = clientWidth`）。
- **布局变更**：移除库存/供需指标并上移关注列表后 `fai.layout` 只含六个模块 id，焦点带不在布局内、仍在顶部。
