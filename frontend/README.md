# Futures-AI 前端

## 职责

Vue + TypeScript 工作台：应用外壳与导航、今日焦点带、模块库与固定栅格、全局 AI 输入栏与时间线抽屉，以及 ECharts 暗色主题样例。

- 本 feature 在浏览器中验收，所有数据与 agent 事件经类型化契约的 mock 实现提供；不读取私有文档或真实头寸，不需要启动后端。
- `real` 实现目前只是抛出 `NotImplementedError` 的桩；真实 API、桌面外壳、图表模板库与各领域页面由后续 feature 交付。
- 需求与机制分别见 [冻结 spec](../specs/frontend-workbench/spec.md)、[实施 plan](../specs/frontend-workbench/plan.md)；设计权威见 [designUI](../docs/designUI.md)。本 README 只导航，不复制设计数值。

## 入口

| 入口 | 用途 |
|---|---|
| [src/main.ts](src/main.ts)、[AppShell.vue](src/app/AppShell.vue)、[router.ts](src/app/router.ts) | 启动、全局布局、路由与应用级 agent 订阅 |
| [WorkbenchPage.vue](src/workbench/WorkbenchPage.vue) | 今日焦点带与模块区 |
| [modules/registry.ts](src/modules/registry.ts)、[ModuleShell.vue](src/modules/ModuleShell.vue) | 模块组件映射与统一壳 |
| [AgentDock.vue](src/agent/AgentDock.vue)、[agent/store.ts](src/agent/store.ts) | 全局输入、抽屉与事件状态 |
| [contracts/index.ts](src/contracts/index.ts)、[CONTRACT.md](contracts/CONTRACT.md) | 数据实现切换、字段与事件契约 |
| [tokens.json](src/design/tokens.json)、[theme.ts](src/design/theme.ts) | 设计数值唯一来源与图表主题注册 |
| [UI 资产索引](../design/ui/README.md)、[图表资产索引](../design/charts/README.md) | 原条目、暗色适配与采用边界 |

### 本地启动

环境为 Windows + Node + pnpm；Node 要求与 pnpm 精确版本以 [package.json](package.json) 的 `engines` / `packageManager` 为准，依赖版本以 [pnpm-lock.yaml](pnpm-lock.yaml) 为准。以下命令均在仓库根执行：

```sh
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend dev
```

打开 Vite 输出的本地地址，访问 `/workbench`。默认 `VITE_DATA_MODE=mock`，无需凭证；不要把 `real` 当成可用后端。

- 数据场景：`/workbench?scenario=normal`；将值改为 `empty` / `error` / `slow` 查看空态、错误态与加载态，`boot-error` 查看启动失败后的重试。
- Agent 回放：`/workbench?agentScript=success`；可选 `failure` / `retry` / `long`，进入后在底部输入栏发送消息。查询参数优先级与 fixture 注入方式见 [CONTRACT.md](contracts/CONTRACT.md)。
- 侧栏、抽屉档位、模块布局分别保存在当前站点的 `fai.rail` / `fai.drawer` / `fai.layout`。需要恢复默认时，只删除这三个 localStorage 键并刷新，或使用新的浏览器上下文。

## 验证

安装依赖并确保本机 Chrome 可用后，一条命令运行全部自动化检查（AC-009-1）：

```sh
pnpm -C frontend test
```

该入口按顺序执行 `check` → `typecheck` → `lint` → `test:unit` → `test:e2e`，任一步失败即停止；在 `frontend/` 目录内可直接执行 `pnpm test`。

| 命令（仓库根） | 验证内容 |
|---|---|
| `pnpm -C frontend check` | 生成物对拍、颜色与退役色、玻璃层级、涨跌作用域、栅格、网络调用边界；可用 `--only generated/colors/glass/updown/grid/network` 中的单个名称选择一项 |
| `pnpm -C frontend typecheck` | 严格 TypeScript 与 Vue 类型检查 |
| `pnpm -C frontend lint` | ESLint，零警告 |
| `pnpm -C frontend test:unit` | Vitest 单元与组件测试，包括设计登记、契约与文档检查 |
| `pnpm -C frontend test:e2e` | Playwright 在本机 Chrome 中验证外壳、模块、事件、断点、场景与主题 |
| `pnpm -C frontend build` | 类型检查与生产构建（单独执行，不属于 `test` 链） |

Playwright 按 [playwright.config.ts](playwright.config.ts) 自行启停 Vite 服务，不复用现有服务；运行前保持配置中的端口空闲。失败追踪与结果位于被忽略的 `test-results/`，不提交为验收成功证据。

生成物不手改：令牌改 [tokens.json](src/design/tokens.json) 后执行 `pnpm -C frontend tokens`；契约改 [types.ts](src/contracts/types.ts)、[events.ts](src/agent/events.ts) 或 [methods.ts](src/contracts/methods.ts) 后执行 `pnpm -C frontend contract`，再用 `pnpm -C frontend check --only generated` 对拍。

人工视觉验收见 [M-01 ~ M-08 清单](../specs/frontend-workbench/manual-acceptance.md)（AC-009-2）。自动化全绿不代表人工验收通过；Handoff 时由验收人逐项确认并附截图证据。
