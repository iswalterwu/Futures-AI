# Feature: desktop-shell 实施计划（plan.md）

> Plan 阶段产物（**修订 4**，2026-10-28；修订 4 只做 T-04b 后端产物的构建收集源头修正，见 §0「修订 4」与 §7.5；修订 3 为修订 2 之后按审核员 A 的 Checklist 发现 F-01～F-07 与协调者静态关注点修补），由已冻结的 `spec.md` v1 生成（Gate 1：Walter 于 2026-10-28 在会话内批准，见 `review.md`）。
> 需求以 spec 为准；本文只写实现机制、契约与验证方式，不新增需求、不改 AC。
>
> - **作者 / 通道**：Plan = claude-opus-5-5 via anthropic（claude-bridge 的 seven_day 额度已确认耗尽，本窗口不再探活；官方通道最小真实调用成功）。协调会话 = openai/gpt-6.1-sol（不是 Plan 或 Implement 作者）。
> - **基线**：`8ba1b6a304f916e3d57ebdd6b89790b75a15f14c`，分支 `plan/desktop-shell-resume`。
- **修订 4 作者 / 输入**：Plan = `anthropic/claude-opus-5-5` via anthropic（本轮官方通道最小真实调用成功；`claude-bridge` 同模型 seven_day 限额在当前窗口已知耗尽，按 AGENTS §6.5 不重复探活；不是因测试变红而换模型）。固定输入 `1275ae2`（分支 `plan/desktop-shell-build-assets`），原始源码基线仍为 `8ba1b6a`。下方「阶段状态」是修订 3 时点的历史描述；修订 4 的审批状态以 `checklist.md` / `review.md` 为准，A 对修订 3 的 41/41 **不自动**覆盖修订 4。
> - **阶段状态**：A 已对修订 2 出具初轮 Checklist（`anthropic/claude-fable-5-1`，30/41 勾选，结论"F-01、F-02 修补后可进入 Tasks"）；修订 3 处理全部 F-01～F-07，新 tasks.md 已写，Analyze 见 `analyze.md`。截至本文件生成时 A 尚未复查（含 Tasks/Analyze 对齐项）；**当前审批状态以 `checklist.md` / `review.md` 为准**。Implement、Converge、Review、Gate 2 均未开始。
> - **配套产物**：`plan-gaps.md`（Tasks 之前的初步漂移与缺口报告，历史记录，不是 Analyze）、`manual-acceptance.md`（人工验收步骤 M-01～M-26，不是 checklist）、`tasks.md`、`analyze.md`（只读一致性报告）、`checklist-review-request.md`（交给 A 的复查请求）。
> - **标记约定**：【现有】= 基线源码里已经有的行为；【计划】= 尚未实现的设计；【外部】= 依赖本 checkout 之外的产物或环境，本 feature 只能给出过渡证据。

## 0. 修订摘要

### 修订 4（相对修订 3；T-04b 构建收集源头修正，不改 spec、不改 AC、不改黑名单）

授权：Walter 明确同意"修构建收集源头、排除第三方测试资产、保持黑名单不变，先修 Plan/Tasks、Analyze 和 A 独立复查，再交 Astra 实施"。该授权只针对这一具体构建修正，不是黑名单例外、需求变更、新机制、Gate 2 或 push/PR/merge。协调 = `openai/gpt-6.1-sol`（只协调）。

| 项 | 内容 |
|---|---|
| 触发（观测事实） | 实施会话 `01a18285-2349-7290-b570-c8f9b2e18658`：后端全量 451 passed / 5 online skips；真实 `build_backend.py` 退出 0；真实 `shell_check.py` 11/12，唯一失败 = `_internal/pyarrow/tests`（含 `.pyx` 与 feather/orc/parquet 测试数据，非空目录）。见 `implementation-evidence.md` §4 |
| 根因（只读核对已安装源码） | contrib `hook-pyarrow.py` 的 `datas = collect_data_files('pyarrow')` 没有排除 `tests`；现有 `--exclude-module tests` 只排除名为 `tests` 的模块，不影响数据文件（§7.5 第 1 段） |
| 修正 | 仓库内 `backend/tools/pyinstaller_hooks/hook-pyarrow.py` 覆盖 contrib hook：只在 `datas` 上加 `excludes=['tests']`，`hiddenimports` / `binaries` 与 contrib 等价；`build_backend.py` 增加 `--additional-hooks-dir`；新增聚焦测试 `backend/tests/test_app_packaging.py`（§7.5） |
| 不变 | spec 与 38 条 AC；§7.4 黑名单与 `shell_check.py`（含 `package_exclusions()`）；`backend/tests/test_app_health.py`；constraints / 包版本；site-packages 与全局 hook；运行时代码（`backend/app`、`backend/data`、`backend/settings`）；`shell/`、`packaging/`；任务数（41） |
| 范围判定 | 落在冻结 AC-001-4"安装包内不含……开发期产物"之内：§7.4 早已把 `tests/` 列入黑名单，本修正只让构建产物满足既有规则，不新增或改动需求、AC、schema → 不需回 Clarify / Gate 1。PyInstaller sidecar 已由 D-007 决定，仓库 hook 与现有 `--exclude-module` 同属构建实现细节 → 不需新 ADR。它修的是已观测到的真实失败，改动约 10 行源码，经 Walter 授权，不属于 AGENTS §5.1 所说的猜测性复杂度 |
| 任务 | 不拆新任务：T-04b 的修改范围、完成标准与验证改写，估时 1.5h → 2h（合计 60.5h → 61h），依赖与执行顺序不变 |
| 审批 | 须由 A 独立复查受影响的质量项（`build-assets-review-request.md`）并记入 `checklist.md` 后，Astra 才能实施本修正 |

### 修订 3（相对修订 2；处理 A 的发现，不改 spec、不新增 AC）

| A 发现 | 处理 | 位置 |
|---|---|---|
| F-01（P2）`.gitignore` 第 17 行 `lib/` 吞掉 `shell/lib/` | 目录改名 `shell/src/`（已用 `git check-ignore --no-index` 核对 `shell/src/*`、`shell/test/**`、`shell/installer/`、`shell/tools/`、`packaging/` 均不被忽略）；不改 `.gitignore` | §3.2、§7.3、§10 |
| F-02（P2）CSP 先于 `webRequest` 拦截，"拦截计数 ≥ 3"会误判 | 改为断言**真实效果**：回环夹具服务收到的"远程主机"请求数 = 0、远程脚本未执行、iframe 未加载，并配**正对照**（后端 XHR 与回环夹具 fetch 成功）；无 CSP 前端夹具与有 CSP 内置页各测一次；不断言拦截计数 | §3.4、§8.3、§9 AC-009-2 / WO-10 |
| F-03（P3）`zlib.crc32` 运行时依据 | 不依赖 `zlib.crc32`：`src/diagnostics.js` 用 `zlib.deflateRawSync`（Node 早期即有）+ 模块内 CRC-32 查表（IEEE 多项式，约 15 行），零新增运行时依赖；单测用标准向量，运行时证据只认真实 Electron 中的 `diagnostics-privacy`（`%SystemRoot%\System32\tar.exe` 解压校验 CRC） | §1、§3.2、§8.1、§9 AC-010-2 |
| F-04（P3）回环放行范围、`ws:` / `blob:` | 明示回环不属于 AC-009-2 的"远程"；回环 `http`/`ws` 只放行 `xhr`/`webSocket` 资源类型（回环脚本/iframe 也拒绝）；`blob:` 放行 | §3.4 |
| F-05（P3）`dismissedUpdate` 持久化却"仅本次运行有效" | 从 schema 移除，改为主进程内存状态 | §3.6、§3.8 |
| F-06（P3）`FAI_DATA_ROOT` 打包运行时也优先 | 仅 `!app.isPackaged \|\| FAI_TEST_HOOKS=1` 时生效，否则记一行日志并忽略 | §3.6 |
| F-07（P3）`logs/` 与 architecture `log` 不一致 | 按 docs 权威改为 `<dataRoot>\log\`（外壳状态目录同样用 `log\`） | §3.7、§5 |
| 协调者关注：`FAI_TEST_EVENTS` 两种写法 | 只保留一种：**UTF-8 JSON 事件数组文件的绝对路径** | §3.5、§8.3 |
| 协调者关注：更新请求被渲染层白名单拦 | 白名单只挂 `defaultSession`；更新走独立内存分区 `fai-update`，不注册白名单；e2e 用回环源验证（该源在 `defaultSession` 上会因资源类型规则被拒） | §3.4、§3.8 |
| 协调者关注：卸载核查写死默认路径 | M-03 以实际所选安装目录为准 | `manual-acceptance.md` M-03 |
| 测试驱动通道未定义 | 定义 e2e 运行器规则与测试钩子控制通道（回环 HTTP，仅测试钩子启用）；不使用 stdin（Electron 在 Windows 上读 stdin 的可靠性未验证） | §8.3 |
| 协调者 Analyze 迭代 3（见 `analyze.md`）：验收前向依赖、打包自举循环、控制通道令牌 | 启动引导抽成 `src/paths.js` 的 `bootstrap(app, env)`，单测注入记录型 `app` 验证调用顺序；运行器登记表与负向规则、假后端各有直接单测；控制通道**不设**鉴权令牌（仅测试钩子 + 回环 + 隔离目录；生产后端 Bearer 不变）；偏好界面由 `prefs-ui` 场景自证；打包配置由 `builder-config.test.js` 自证，首次 `npm run dist` 与产物扫描只在 `build.ps1` 第 6/7 步（第 5 步先生成 `dist/staging/app-config.json`） | §3.2、§4.1、§8.2、§8.3、§9 |
| 协调者追溯检查 → Analyze 迭代 5：AC-005-3 的"预填"未被追溯（内置页 `renderPrefill` 用遮蔽后的 `/settings/profile` 自拼字段，Category 显示 key 而非官方标签，缺 Reason for use，忽略 `missing_for_registration`，缺项时仍可打开注册页；宿主没有暴露 settings 核心的 `prepare()` / `registration_hint()`） | 新增只读端点 `GET /settings/registration-guide`（Bearer），原样返回核心 `prepare(root).detail` 与 `registration_hint().detail`；内置页删除 `renderPrefill`，在用户点击"准备注册信息"后用 `textContent` 渲染核心结果：缺项时列出缺项与核心提示、不提供"打开注册页"，齐全时显示逐项指引并用核心返回的 URL 交给系统浏览器；粘贴/验证已有 key 不受缺项影响。普通档案读写仍遮蔽（§3.1.4 隐私区分）。不改 settings 核心与 schema，不新增 AC | §3.1.4、§3.1.7、§9 AC-005-3/4、AC-009-4 |
| AC-004-1"窗口被聚焦"不可稳定自动断言（Windows 前台锁） | 自动化断言 `second-instance` 处理器执行了 restore/show/focus（记录器）+ 后端未重复；真实前台聚焦留 M-09 | §9 AC-004-1 |

### 修订 2（相对修订 1）

修订 1 有几处与源码不一致的描述，也漏了一些 AC 的覆盖。本轮按源码事实改正如下：

1. **健康检查**：修订 1 写的是 `/health` 返回 `mcp_port`、外壳只看 `status`。实际源码中 `/health` 在 Service 初始化后**恒为** `ok`，并不探测数据服务。现改为真实探测数据服务；外壳必须同时满足 `200 + status=="ok" + data_ready===true` 才判为就绪（§3.1.3）。
2. **MCP**：修订 1 写宿主"起 MCP"，但源码没有。现在的结论是：agent 用的 MCP 工具暴露属于 agent feature（spec 把"agent 能力本身"列为非目标），本 feature 不挂载。宿主只恢复 data-layer 已有的**内部只读通道**（`build_internal_app` + `data/mcp_endpoint.json`），否则应用运行期间 `futureai-data` / `futureai-settings` 的只读命令会失效（Q-001、data-layer AC-004-6），见 §3.1.5。
3. **端点表**按源码改正：补上 `GET /settings/sectors`、`PUT /settings/profile`、`DELETE /settings/key`；`/shutdown` 实际返回 200（修订 1 写的是 202）。
4. **preload**：修订 1 说暴露 `{mode, apiBase, token, version, openExternal, showDiagnostics}`，实际只有 `backend()`，而且它读取的是窗口创建时固定下来的参数，后端重启换端口后会拿到旧值。现在给出完整的 preload 面（§3.3）。
5. **生命周期缺陷**：
   - 重启时 `waitForReady()` 没有传参（沿用了旧的就绪参数），重启后永远等到超时；
   - `onBackendCrash` 与 `handleNotReady` 会并发触发；
   - 没有处理 `spawn` 的 `error` 事件，后端可执行文件缺失时主进程直接崩溃；
   - 数据目录 `mkdirSync` 没有异常处理；
   - 强杀外壳后后端成为孤儿进程并继续持锁，AC-003-3 因此无法成立。

   以上统一改为单一后端生命周期状态机（§4.2）。
6. **默认数据目录**：源码是 `%APPDATA%\futuresai-shell\FuturesAI`，嵌套层级错，也不在 Local 区；改为 spec 规定的 `%LOCALAPPDATA%\FuturesAI`（§5）。
7. **窗口时机**：源码要等后端就绪后才创建窗口，失败时只弹 `showErrorBox` 然后退出。现在改为**立即**显示内置启动/错误页，提供重试、打开日志、导出诊断（§4.1）。
8. **验证命令**：
   - `npm run check:ui` 不存在；
   - `shell_check.py --backend-only` 的参数会被忽略；
   - `shell_check.py` 在健康检查从未成功时也会判"就绪"通过；
   - `check.js` 的单实例断言恒真，而且使用的是真实用户的 Electron `userData`。

   §8 重新列出命令，并逐条标注现有 / 待新增。

## 1. 技术方案

- **外壳**：Electron 33（D-007），锁定精确版本 `33.4.11`，与现有 lockfile 一致（`package.json` 现为 `^33.0.0`，改为精确值）。主进程 + 预加载 + 渲染进程，固定 `contextIsolation: true`、`nodeIntegration: false`、`sandbox: true`。
- **运行时 Node 与构建机 Node 不同**：Electron 33 内嵌 Node 20.x（以真实 Electron 中 `process.versions.node` 为准，e2e 快照记录该值），构建机为 Node 25。主进程代码只用 Node 20 已有的 API；`node --test` 跑在构建机 Node 上，**不能**证明 Electron 运行时 API 存在，运行时行为只以真实 Electron e2e 为证据。
- **后端宿主**：`backend/app/`（FastAPI，D-010）。它是**进程宿主**，不是业务 API：持有唯一的 data `Service`（写锁），提供 `/health`、`/shutdown`、最小设置端点和 data-layer 的内部只读通道。业务 API 归 `api` feature；MCP 工具与 pi 归 agent feature。
- **打包**：后端用 PyInstaller onedir（现有 `tools/build_backend.py`）；外壳用 electron-builder 打 NSIS 包（D-007 已指定。electron-builder 是本 feature 唯一新增的 npm devDependency，精确锁版本，`npm ci` 按 lockfile 复现）。
- **测试工具**：只用仓库已有或运行时自带的工具：pytest（后端）、`node --test`（Node 内置测试器，测纯模块）、真实 Electron 冒烟（`shell/check.js` 及其场景）。不引入 Jest/Playwright 等新框架。
- **前端**：本 checkout **没有** `frontend/`。按 spec §4，在 `api`/`agent`/前端集成就绪之前，本 feature 以"内置页 + mock 模式 + 现有后端"验收：
  - 外壳能加载 `frontend-workbench` 的构建产物（打包时显式指定）；
  - 没有指定时使用内置引导/设置页。
- **真实业务边界**：本阶段**没有作业引擎、没有 agent、没有真实作业事件**。托盘、通知、退出守卫的逻辑由外壳里的生产处理器实现，驱动来源只有两种：真实的后端生命周期事件（后端异常）和测试事件夹具（§3.5）。任何验收记录都不得把夹具驱动的结果写成"真实作业已完成/已通知"。

## 2. 源码基线（8ba1b6a 实际状态）

| 区域 | 现有文件 | 已有能力 | 与 spec/修订 1 的偏差（本计划处理） |
|---|---|---|---|
| 后端宿主 | `backend/app/main.py`、`__main__.py` | `create_app(root, token)`；lifespan 内建 `Host(Service)`；`/health`、`/shutdown`、`/settings/{profile GET/PUT, sectors, onboard, sources, key POST/DELETE}`；只绑 127.0.0.1；端口 0；就绪后写 `--port-file` | `/health` 不探测数据；启动失败没有分类，锁被占/不可写/磁盘满在外壳看来都只是"进程退出"；没有父进程退出检测；没有内部只读通道；`VERSION` 是写死的常量 |
| 后端测试 | `tests/test_app_{health,lifecycle,settings_api}.py` | 健康、Bearer、只绑回环、优雅退出释放锁与端口、强杀后陈旧锁回收、设置端点 | 回环测试在本机只有回环地址时退化为不断言；没有覆盖遮蔽邮箱回写、磁盘满、启动失败分类 |
| 打包后端 | `backend/tools/build_backend.py`、`shell_check.py` | onedir 构建，带上 `data/adapters`；冒烟检查 /settings/sources、401、/shutdown、锁、端口 | "就绪"判据会误判通过；不存在 `--backend-only` |
| 外壳 | `shell/main.js` | 单实例锁、拉起一个后端、轮询 `/health`（看 `data_ready`）、退出时 `/shutdown`→5s→kill、外链交给系统浏览器、日志追加写 `userData/logs/shell.log` | 见 §0 第 5～8 条；关窗即退出；没有托盘、通知、偏好、诊断、更新、mock；日志不滚动 |
| 预加载 | `shell/preload.js` | `window.futuresai.backend()` | 只读启动参数，无法反映重启后的端口/令牌 |
| 内置页 | `shell/renderer/onboarding.{html,js}` | 引导（保存/跳过）、档案、EIA 开通（预填、打开注册页、粘贴验证、清除）、数据源状态表、CSP | 用 `innerHTML` 拼接后端字符串；**设置表单把遮蔽后的邮箱（如 `wa***@example.com`）原样 PUT 回去，会覆盖真实邮箱**（遮蔽值能通过 `_EMAIL_RE` 校验）；加载前端产物后无法进入设置；没有 mock 显示；EIA 预填区用遮蔽后的 `/settings/profile` 自拼字段（Category 显示 key、缺 Reason for use、忽略缺项），未复用 settings 核心 `prepare` |
| 冒烟 | `shell/check.js`、`package.json`（`start/smoke/check`） | 就绪、退出码、锁、端口、UI 断言、"单实例" | 单实例断言恒真；首个实例被直接 `kill()`，后端可能残留成孤儿；没有隔离外壳状态目录 |
| 打包配置 | —— | —— | 没有 `electron-builder` 配置、`packaging/build.ps1`、NSIS 脚本、包内容扫描、校验和 |

## 3. 模块设计与契约

### 3.1 后端宿主（`backend/app/`）

#### 3.1.1 命令行（【现有】+【计划】）

```
futuresai-backend --root <dir> --port-file <path> --token <hex> [--port 0] [--exit-on-stdin-eof]
```

- `--root`、`--port-file`、`--token`、`--port`：【现有】。
- `--exit-on-stdin-eof`：【计划】。外壳总会传这个参数，并以 `stdin: 'pipe'` 方式拉起后端。后端在一个守护线程里阻塞读 stdin，读到 EOF（父进程退出或被强杀）就置位 `should_exit`，走正常 lifespan 释放写锁。这是 AC-003-3 的必要条件：外壳被强杀后后端不能变成孤儿继续持锁。
  - 测试/CLI 直接运行时不传此参数，行为不变。
  - 不用 Job Object 或 PID 轮询，理由见 §10。

#### 3.1.2 启动失败分类（【计划】）

`Host`（`Service(root).init()`）改为在 uvicorn 启动**之前**于 `__main__` 中构造；`create_app` 改为接收已构造好的 Host（测试仍可直接用 `create_app(root, token)`）。构造或绑定端口失败时：

- 在 stdout 输出**一行** `FAI_HOST {"event":"startup_failed","code":<code>,"path":<root>,"detail":<不含凭证的短说明>}`，然后以**退出码 3** 退出；
- 退出码 3 表示"拒绝启动、不应自动重启"；运行期崩溃使用其他非零码。

| code | 判定（沿异常的 `__cause__` 链查找） | 说明 |
|---|---|---|
| `data_root_locked` | `data.lock.LockBusy` | AC-004-2；`detail` 附锁文件里的 PID（读得到时） |
| `data_root_unwritable` | `PermissionError`；`errno` ∈ {EACCES, EPERM, EROFS}；`winerror` ∈ {5, 19} | AC-004-3 |
| `disk_full` | `errno == ENOSPC`；`winerror` ∈ {39, 112} | AC-007-4（启动期） |
| `port_in_use` | 显式 `--port` 绑定失败（uvicorn 未启动时 `SystemExit`） | AC-007-1（外壳从不传固定端口，见 §4.4） |
| `startup_internal` | 其他异常 | 只输出异常类型名，不输出 repr |

#### 3.1.3 健康检查（【计划】替换现有恒 `ok`）

`GET /health`（不鉴权，供外壳探活）：

- 在 Service 的访问锁内对目录库和观测库各执行一次 `SELECT 1`。
- 成功 → `200 {"status":"ok","data_ready":true,"version":V}`。
- 失败或 Service 已关闭 → `503 {"status":"unavailable","data_ready":false,"version":V,"reason":<异常类型名>}`。
- `V` 沿用 `app/main.py` 现有的 `VERSION` 常量（不新增生成文件）。`build.ps1` 第 1 步断言 `VERSION` == `backend/pyproject.toml` 的 version == `shell/package.json` 的 version，三处不一致即构建失败。

外壳判定就绪的**唯一**条件是：HTTP 200、`status=="ok"`、`data_ready===true`。端点文件存在或端口可连都不算（AC-002-2）。

#### 3.1.4 端点（按源码改正）

| 方法 路径 | 鉴权 | 状态 | 契约 |
|---|---|---|---|
| `GET /health` | 无 | 【现有→改】 | 见 §3.1.3 |
| `POST /shutdown` | Bearer | 【现有】 | `200 {"status":"shutting_down"}`，随后进程退出（lifespan 释放写锁） |
| `GET /settings/profile` | Bearer | 【现有】 | `{profile(邮箱遮蔽), onboarding:{completed,skipped}, missing_for_registration}` |
| `PUT /settings/profile` | Bearer | 【现有→改】 | 部分更新，空串表示清空；校验失败 422。【计划】邮箱含 `***` 时返回 422 `"遮蔽显示值不可回写"`（遮蔽值不是合法输入，在入口拒绝）；落盘时磁盘满返回 507（§3.1.6） |
| `GET /settings/sectors` | Bearer | 【现有】 | `{sectors:[{key,label}] × 11}` |
| `POST /settings/onboard` | Bearer | 【现有】 | `{skip}` → 置 completed（skipped 另记） |
| `GET /settings/sources` | Bearer | 【现有】 | `settings.sources.list_with_service` |
| `POST /settings/key` | Bearer | 【现有→改】 | `{key}` → `verify_and_save`，**不回显 key**；落盘时磁盘满返回 507 |
| `DELETE /settings/key` | Bearer | 【现有】 | `{cleared}` |
| `GET /settings/registration-guide` | Bearer | 【计划】 | 只读，不接受参数：`{missing, hint, prefill:[{label,value}], submit:{url, notes}}`，字段原样来自 settings 核心 `onboarding.prepare(root).detail`（`missing` / `hint` / `prefill`）与 `onboarding.registration_hint().detail`（`url` / `notes`）；宿主不做任何字段拼装或业务判断；不含任何 key；磁盘读取失败按 §3.1.6 / 422 现有规则 |
| `GET /internal/*` | 通道令牌 | 【计划】 | data-layer 原有路由（§3.1.5） |

不新增作业、事件、诊断类后端端点；本阶段也不需要。

**注册指引与普通档案的隐私区分（AC-005-3 / AC-005-4 / AC-009-4）**：

- 普通档案读写（`GET/PUT /settings/profile`）始终返回遮蔽邮箱；遮蔽值禁止回写（422）。
- 注册指引是用户为在浏览器里**亲手**填写第三方注册表单而**显式请求**的本地指引：只有用户点击"准备注册信息"后才请求 `/settings/registration-guide`，其中 Email 为档案真实值（用户需要照抄；邮箱不是 API 凭证，AC-005-4 禁止的是凭证明文；AC-009-4 禁止的是日志与诊断包中的邮箱）。指引区只读、不在任何会回写档案的表单内，离开设置页即清空。
- 指引载荷不写日志（§3.1.7）、不进诊断包（§3.7 白名单）、不缓存到磁盘；程序不代提交第三方表单、不读取邮箱（settings Q-005）。
- 缺项时（`missing` 非空）界面列出缺项与核心 `hint`，并定位到档案表单对应输入框；此时不提供"打开注册页"（settings AC-003-1：不出现空表单）。粘贴并验证已有 key 的区域不受影响——已有 key 的用户无需重新注册。

#### 3.1.5 内部只读通道（【计划】，恢复 data-layer 契约）

- 宿主启动后，把 `data.mcp_server.build_internal_app(host.svc, channel_token)` 的路由挂进同一个 FastAPI 应用（同端口；`channel_token` 每次运行随机生成，与外壳 token 分开）。
- 服务开始监听后调用 `data.lock.write_endpoint(root/"data", port, channel_token)`；退出时调用 `remove_endpoint`。
- 效果：应用运行期间，`futureai-data list …` 和 `futureai-settings source list` 经现有 `internal_get` 路由到宿主，不再等到超时报"写进程运行中且尚未提供只读通道"。
- **不挂载 MCP 工具**（agent feature 负责，见 plan-gaps B-02）。

#### 3.1.6 磁盘满映射（【计划】）

宿主注册一个异常处理器：异常的 `__cause__` 链上有 ENOSPC / winerror 39、112 时，返回 `507 {"error":"disk_full","message":"磁盘空间不足，写入失败"}`，进程继续服务。

- `put_profile`、`post_key` 中被包装成 `ProfileError`/`CredsError` 的情况同样走 507，不再显示为 422。
- `PUT /settings/profile` 现有的 `except (ValueError, ProfileError)` 要先判断是否为磁盘满，再落到 422。

#### 3.1.7 日志纪律

- uvicorn 保持 `log_level="warning"`，不记访问日志。
- 宿主不记录请求体、响应体、令牌、argv。
- 异常日志只写类型名和不含输入值的消息。
- settings 现有的 urllib3 脱敏过滤器保留。
- `/settings/registration-guide` 的响应（含档案真实邮箱）不进入任何日志；外壳主进程不转发、不记录渲染层请求内容。

### 3.2 外壳主进程（`shell/`）

`main.js` 只负责组装；可单测的纯逻辑拆到 `shell/src/`。拆分理由是这些模块要被 `node --test` 和多个 e2e 场景复用，不是为了拆而拆。目录名用 `src/` 而不是 `lib/`：仓库 `.gitignore` 第 17 行 `lib/`（Python 模板，匹配任意层级）会忽略 `shell/lib/`（A 的 F-01）。

| 文件 | 状态 | 职责 |
|---|---|---|
| `main.js` | 【现有→改】 | 路径与单实例 → 偏好 → 窗口（立即显示启动页）→ 后端生命周期 → 托盘/菜单 → 更新检查 → 退出。现有 `--smoke` / `--ui-smoke` 分支与 `UI_ASSERTIONS` 被 §8.3 测试钩子取代后删除 |
| `src/paths.js` | 【计划】 | 默认数据目录、外壳状态目录、打包资源路径；导出 `bootstrap(app, env)`：解析路径 → `app.setPath`（userData/sessionData/crashDumps）→ `app.requestSingleInstanceLock()` → 读偏好、解析数据目录并做可写探测，返回 `{gotLock, paths, dataRoot, error?}`。`main.js` 第一步调用它；单测向它注入记录型 `app`（Electron 系统边界）验证调用顺序与目录解析 |
| `src/prefs.js` | 【计划】 | `shell-prefs.json` 的 schema 校验、原子读写、待生效数据目录的应用、可写探测（§3.6） |
| `src/backend.js` | 【计划】 | 后端生命周期状态机：spawn、就绪判定、标记行解析、重启预算、停止（§4.2）；依赖注入 `spawn`/`http`（单测用注入的假 spawn 驱动状态迁移），e2e 使用真实实现 |
| `src/activity.js` | 【计划】 | 作业活动归约器：事件 → 状态 + 副作用（托盘状态、通知种类、退出守卫）（§3.5） |
| `src/logger.js` | 【计划】 | 滚动日志（大小滚动）+ 写入前脱敏（§3.7） |
| `src/redact.js` | 【计划】 | 已知模式与当次运行令牌的脱敏（§3.7，只是第二层防护） |
| `src/diagnostics.js` | 【计划】 | 白名单收集 + ZIP 写出（stored 头 + `zlib.deflateRawSync` + 模块内 CRC-32 查表；**不用** `zlib.crc32`，不引入新依赖）+ 保留最近 5 份 |
| `src/update.js` | 【计划】 | 更新源配置、元数据 schema 校验、版本比较、带超时的获取（§3.8） |
| `src/test-hooks.js` | 【计划】 | 仅 `FAI_TEST_HOOKS=1` 时由 `main.js` 加载：系统边界记录器、控制通道、`SMOKE` 输出（§8.3）。未设置时不加载、无任何行为 |
| `preload.js` | 【现有→改】 | §3.3 |
| `renderer/startup.{html,js}` | 【计划】 | 启动/未就绪/重启中/错误页（§4.1） |
| `renderer/onboarding.{html,js}` | 【现有→改】 | 引导 + 设置（档案、EIA、数据源状态 + 【计划】"应用"区：关窗行为/通知/更新检查/数据目录/关于/诊断） |
| `electron-builder.config.js` | 【计划】 | §7 |
| `installer/installer.nsh` | 【计划】 | NSIS 卸载自定义（§7.3）。不放在 `build/` 下，因为 `.gitignore` 忽略 `build/` |
| `tools/scan-package.js` | 【计划】 | 包内容白名单/黑名单扫描（AC-001-4） |
| `test/unit/*.test.js` | 【计划】 | `node --test` 单测（纯模块） |
| `test/fixtures/fake_backend.py` | 【计划】 | 进程边界夹具（§8.3），**不是**业务实现 |
| `test/fixtures/frontend-stub/index.html` | 【计划】 | 前端产物夹具：无 CSP，只回显 `window.futuresai.mode` 并供 `csp` 场景在页面内发起探测；**不是**前端 |
| `check.js` + `test/e2e/*.js` | 【现有→改】 | 真实 Electron 场景运行器（§8.3） |

### 3.3 预加载契约（`window.futuresai`，【计划】替换现有 `backend()`）

| 成员 | 说明 |
|---|---|
| `mode` | `'backend'` \| `'mock'`，启动时确定，运行中不变 |
| `getBackend(): Promise<{port, token} \| null>` | 当前后端代际的端点；mock 或未就绪时为 null。替代读取固定启动参数的 `backend()` |
| `onShellStatus(cb): () => void` | 推送 `{phase, code?, message?, path?, attempt?, maxAttempts?}`；`phase` ∈ `starting / waiting_health / ready / restarting / failed / mock` |
| `retryStartup()` / `openLogs()` / `exportDiagnostics(): Promise<{path}\|{error}>` | 启动页、设置页、托盘共用 |
| `getAppInfo(): Promise<{version, build, electron, chrome, node, os, backendVersion}>` | AC-008-1。`build` 来自打包配置（§7.2），开发期为 `null` 并显示"开发构建（未打包）" |
| `getShellPrefs()` / `setShellPrefs(patch)` | 主进程在入口处校验 patch（§3.6），非法返回 `{error}` |
| `chooseDataRoot(): Promise<{pendingDataRoot}\|{cancelled}\|{error}>`、`relaunch()` | AC-004-4 |
| `getLastCrash(): Promise<record \| null>` | AC-010-3 |
| `getUpdateState()` / `checkForUpdates()` / `dismissUpdate(version)` / `openUpdateDownload()` | AC-008-2/3；下载交给系统浏览器 |
| `openSettings()` | 在主窗口加载内置设置页（即使当前加载的是前端产物也可用） |

- **不暴露** `ipcRenderer`、`shell`、任意 URL 打开、文件系统。
- 外链仍由主进程的 `setWindowOpenHandler` / `will-navigate` 统一处理。
- 这份契约同时是给 `frontend-workbench` 的跨 feature 接口：前端读 `mode` 与 `getBackend()`；`window.futuresai` 不存在时（纯浏览器开发）走前端自己的 mock。前端侧是否采纳由该 feature 决定（plan-gaps D-03）。

### 3.4 渲染层策略（主进程 / 预加载 / 渲染，仅限冻结 AC）

- **CSP**（内置页，【现有】）：`default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src http://127.0.0.1:*`。
- **请求白名单**（【计划】）：只注册在 `session.defaultSession.webRequest.onBeforeRequest`（渲染层所用会话），规则按 URL 与 `details.resourceType`：
  - 放行：`file:`、`data:`、`blob:`、`devtools:`（本地内容，任意资源类型）；
  - 放行：`http://127.0.0.1:<任意端口>` 与 `ws://127.0.0.1:<任意端口>`，**仅当** `resourceType` ∈ {`xhr`, `webSocket`}（前端/内置页访问本机后端；`fetch()` 在 Electron 中报告为 `xhr`，由 e2e 正对照证实）；
  - 其余一律取消（含任何非回环主机、`localhost` 写法、回环上的 `script`/`subFrame`/`mainFrame`/`stylesheet`/`image` 等），按 URL 的协议+主机记一行日志（不记 query）。
  - 解释：回环本机服务不属于 AC-009-2 所说的"远程内容"；仍限制其资源类型，是为了让无 CSP 的前端产物也只能把回环当数据接口用。这一层覆盖 CSP 不受本 feature 控制的前端产物，是 AC-009-2 对前端产物的落点；内置页另有 CSP（双层）。
  - 主进程的更新检查不走 `defaultSession`（§3.8 独立分区），不受此白名单影响；`openExternal` 不经渲染层会话。
  - 验证方式：断言真实效果（夹具服务收到的远程主机请求数、脚本是否执行、正对照是否成功），**不**断言拦截计数——内置页上 CSP 会在请求到达 `webRequest` 之前拦下（§9 AC-009-2）。
- **导航**：`setWindowOpenHandler` 只把 `http(s)` 交给 `shell.openExternal`，其余拒绝（【现有】）；`will-navigate` 对非 `file:` 一律 `preventDefault`，只有 `http(s)` 才交给系统浏览器（【计划】收紧，现有代码会把任意协议交出去）。
- **内置页渲染**：所有后端字符串和用户输入一律用 `textContent`/`createElement` 写入 DOM，不再用 `innerHTML` 拼接（【计划】）。

### 3.5 作业活动接缝（托盘 / 通知 / 退出守卫，【计划】）

`src/activity.js` 是**生产代码**：一个纯归约器 `apply(state, event) → {state, effects}`。托盘、通知和退出守卫都只消费它的输出。

**事件**（来源入口处校验：运行期来源中未知类型丢弃并记日志；测试夹具文件按下方"事件来源"表整体拒绝）：

```
{type:"job.queued",      jobId, title}
{type:"job.started",     jobId, title}
{type:"job.stage_completed", jobId, stage}
{type:"job.finished",    jobId}
{type:"job.failed",      jobId, reason}
{type:"verification.pending", count}
{type:"intervention.conflict", jobId}
{type:"backend.error",   code}        // 外壳生命周期内部产生（真实来源）
{type:"backend.ready"}                 // 同上
```

**状态与副作用**：

- 托盘状态：存在未清除的 `backend.error` 或 `job.failed` → `error`；否则有运行中作业 → `running`；否则 `idle`。
- 通知种类：`stage_completed`、`verification_pending`、`intervention_conflict`、`backend_error`（Q-006 的四类）。是否真正弹出由偏好 `notifications` 决定；托盘状态不受该开关影响（AC-006-3）。
- 退出守卫：`requestQuit()` 时如有运行中作业 → 返回 `ask`；
  - 选"等待完成" → `accepting=false`，已排队作业标为 `cancelled_on_exit`，此后新到的 `job.queued/started` 标为 `rejected_exiting`。这些标记写入日志、显示在退出对话框和托盘提示里，不静默丢弃；运行中作业归零后自动执行优雅退出。
  - 选"取消退出" → 状态不变，作业继续。
  - 等待期间托盘提供"取消退出"，恢复 `accepting=true`。

**事件来源（关键边界）**：

| 来源 | 本阶段 | 说明 |
|---|---|---|
| 外壳生命周期（`backend.error/ready`） | **真实** | 后端崩溃、重启、恢复 |
| 作业引擎事件流 | **不存在**【外部】 | 由 workflow / `api` feature 提供；接入时只新增一个来源适配器，归约器不变 |
| 测试事件夹具 | **测试专用** | 仅在 `FAI_TEST_HOOKS=1` 时读取 `FAI_TEST_EVENTS=<绝对路径>`：该文件为 UTF-8 JSON **事件数组**（唯一格式，不接受内联 JSON）；每项可带 `delayMs`（相对"首次 `backend.ready`"，mock 模式下相对目标页加载完成；不累加）。文件缺失、JSON 非法、存在未知 `type` 或缺字段 → 外壳以退出码 4 结束并在 stderr/日志写 `TEST_EVENTS_INVALID <原因>`（测试输入错误要显式失败，不丢弃）。启用钩子时窗口标题加"［测试钩子］"，日志首行写 `TEST HOOKS ENABLED`，防止被误认为真实业务 |

**本阶段边界**：AC-003-4 的"不再接受新作业"在本阶段只能证明**外壳侧语义**（归约器拒收并标记）。后端作业引擎在退出时停止接单（drain）的契约留给 workflow feature（plan-gaps D-02）。

### 3.6 外壳偏好（【计划】）

**位置**：`<外壳状态目录>/shell-prefs.json`。外壳状态目录 = `%LOCALAPPDATA%\FuturesAI-Shell`（§5），与数据目录分开，因为它要记录数据目录本身在哪里。

**schema v1**（加载时整体校验）：

```json
{ "schema": 1,
  "closeBehavior": "tray",          // "tray" | "quit"，默认 tray（Q-003）
  "notifications": true,            // 全局开关（Q-006）
  "updateCheck": "startup",         // "startup" | "off"；未配置更新源时无效果
  "dataRoot": null,                 // null = 默认 %LOCALAPPDATA%\FuturesAI；否则为绝对路径
  "pendingDataRoot": null }         // 设置里选定、下次启动时生效
```

- **文件不存在** → 使用默认值，首次写入时创建。
- **文件存在但解析或校验失败** → 进入启动错误 `prefs_invalid`（显示路径，提供打开所在文件夹/重试/退出）。**不自动重置**，否则用户自定义的数据目录会被静默丢掉，退回默认目录。
- **写入**：临时文件 + `rename`；写入失败（含 ENOSPC）把原因返回给渲染层显示。
- **数据目录生效规则**：
  - 启动时如有 `pendingDataRoot`：做可写探测（§4.1 第 3 步）。通过 → `dataRoot = pending`、`pending = null` 并保存；不通过 → 启动错误 `data_root_invalid`，给出两个选项："继续使用原目录"（清除 pending）或"重试"。**不复制、不移动、不删除原目录数据，也不回退到临时目录**（AC-004-4、R-004）。
  - 新目录为空时会重新走首启引导，这是预期行为。v1 不做迁移（plan-gaps B-06）。
- "稍后"的版本号只放主进程内存（本次运行内有效），不写偏好文件。
- **开发/测试覆盖**：仅当 `!app.isPackaged` 或 `FAI_TEST_HOOKS=1` 时，`FAI_DATA_ROOT`（【现有】）> `prefs.dataRoot` > 默认；打包运行且未开测试钩子时，`FAI_DATA_ROOT` 被忽略并记一行日志 `FAI_DATA_ROOT ignored (packaged)`，避免用户环境里残留的变量静默改变数据目录。`FAI_SHELL_STATE_DIR` 遵循同一门槛，只用于测试隔离。
- **不读不写** settings 的加密档案（`profile/profile.bin`）、`creds/`、`onboarding` 状态文件；偏好里不放任何凭证或个人信息。

### 3.7 日志、脱敏与诊断包（【计划】）

**日志**

- 位置：`<dataRoot>/log/shell.log`、`<dataRoot>/log/backend.log`。后端的 stdout/stderr 由外壳逐行捕获写入，并保留最近 200 行的内存环形缓冲。数据目录尚未确定或不可写时，写到 `<外壳状态目录>/log/bootstrap.log`，并在错误页显示该路径。
- 滚动：单文件上限 5 MB，每类保留 5 份（`x.log`、`x.1.log`…`x.4.log`），总量有上界（AC-010-1）。
- 写日志失败（含 ENOSPC）不影响主流程，只置 `logWriteError`，在设置页"诊断"区显示原因（AC-007-4）。

**不记录**：请求/响应体、令牌、argv、档案字段、key、渲染层 console 输出、URL 的 query。

**脱敏（`redact.js`）**：写盘前替换以下内容：

- 当次运行的外壳令牌和通道令牌（字面值）；
- `Bearer <x>`；
- `api_key=`、`"key":`、`token=` 后面的值；
- 邮箱；
- 用户主目录前缀（替换为 `%USERPROFILE%`）。

**明确声明**：脱敏只是第二层防护，**不能保证清除任意内容**。用户文档、知识库正文、任意格式的密钥无法靠正则识别。真正的保证来自两条：①不记录载荷；②诊断包只收白名单内的输入。

**诊断包（AC-010-2、AC-009-4、Q-010）**

- 一键导出到 `<dataRoot>/log/diagnostics/futuresai-diag-<UTC时间戳>.zip`（数据目录不可用时写到外壳状态目录），在资源管理器中定位该文件，只保留最近 5 份。
- **只**包含以下条目（白名单，按条目名逐一生成，不按目录打包）：

| 条目 | 内容 |
|---|---|
| `manifest.json` | 应用版本、构建信息、Electron/Chrome/Node 版本、生成时间 |
| `env.json` | OS 版本、架构、CPU 数、内存、数据目录所在卷的剩余空间；路径经脱敏；偏好中的三个开关值（不含路径） |
| `process.json` | 后端状态机阶段、代际、重启次数、最近退出码/信号、最近启动错误 code、各进程 uptime（AC-010 "进程状态"） |
| `log/shell*.log`、`log/backend*.log`、`log/bootstrap*.log` | 每类最近 2 MB 尾部，再过一遍脱敏 |
| `crash/last-crash.json` | 如果存在 |

- **永不包含**：`creds/`、`profile/`、onboarding 状态、`data/*.duckdb|*.sqlite`、`data/mcp_endpoint.json`、`host.json`、`shell-prefs.json` 原文、`adapters/`、知识库/文档目录，以及数据目录下白名单之外的任何文件。

**崩溃现场（AC-010-3）**

- 启动时写 `<dataRoot>/log/session.json` `{startedAt, pid, cleanExit:false}`，优雅退出时置 `true`。
- 下次启动若读到 `cleanExit:false` → 生成 `last-crash.json`，`kind` 为 `shell_unclean_exit`。
- 后端崩溃时立即写 `{kind:"backend_crash", at, exitCode, signal, startupErrorCode, tail:<环形缓冲最近 50 行，已脱敏>}`。
- `render-process-gone` / `child-process-gone` 记录原因。
- 设置页"诊断"区显示上次异常的时间与原因，并提供"打开日志目录"和"导出诊断"。

### 3.8 版本与更新检查（【计划】）

**更新源配置**：只来自显式发布配置。打包时 `build.ps1 -UpdateFeedUrl <https URL>` 写入 `app-config.json` 的 `update.feedUrl`。

- 默认为 `null` → 不检查，关于页显示"未配置更新源"。
- 不编造服务器地址，不内置任何凭证。
- 测试覆盖：`FAI_TEST_HOOKS=1` 时可用 `FAI_UPDATE_FEED_URL`，且只允许 `http://127.0.0.1:*`；生产只接受 `https:`。

**检查时机**：就绪 10 秒后，在主进程异步 GET，超时 10 秒。请求通过独立的内存会话 `session.fromPartition('fai-update')`（无 `persist:` 前缀）的 `fetch()` 发出：该分区**不注册** §3.4 的白名单，所以已配置的 https 更新源不会被渲染层策略拦下；也没有任何窗口使用该分区，渲染层无法借用这条通道。运行时证据只认真实 Electron e2e `update-available`（其回环源若误走 `defaultSession` 会因资源类型规则被拒）。检查完全不阻塞后端与界面。偏好 `updateCheck="off"` 时只能在关于页手动检查。

**元数据 schema（入口校验，任何不合法都按"检查失败"处理）**：

```json
{ "schema": 1, "channel": "stable", "version": "0.2.0", "releasedAt": "<ISO-8601>",
  "notes": "<纯文本，≤4000 字符>", "url": "https://…/FuturesAI-Setup-0.2.0.exe",
  "sha256": "<64 位十六进制>", "size": 123456789 }
```

- `version` 只接受 `x.y.z` 数字三段式，按数值比较。

**有新版本时（AC-008-2）**：

- 若通知开启，发系统通知；
- 关于页显示版本号与更新说明（`textContent` 纯文本，不渲染 HTML/Markdown）、`sha256` 以及校验方法提示；
- 按钮"下载"交给系统浏览器打开 `url`；"稍后"在本次运行内不再提示该版本（主进程内存状态，不写偏好，§3.6）。
- **不在应用内下载，不静默安装**（Q-005）。

**失败或离线（AC-008-3）**：只记一行日志，关于页灰字显示"上次检查失败"，不弹任何对话框或通知。

**完整性（R-008 what）**：构建产出 `SHA256SUMS.txt`；更新元数据携带 `sha256`/`size`；用户可以用 `Get-FileHash` 自行核对。代码签名证书不在 v1 范围（§10）。

**出站限制**：主进程只有更新检查（访问已配置的更新源）和 `openExternal` 两类出站；元数据请求不带任何用户数据（R-009 what）。

## 4. 关键流程

### 4.1 启动（无白屏）

1. `src/paths` 的 `bootstrap(app, env)`（`main.js` 第一步调用）：解析 `LOCALAPPDATA`，缺失 → 错误 `localappdata_missing`（不回退）。设置 `userData = <外壳状态目录>`，`sessionData` 与 `crashDumps` 放在 `<外壳状态目录>/session/`。然后执行 `requestSingleInstanceLock()`；没拿到锁 → 退出，由已有实例的 `second-instance` 聚焦窗口（AC-004-1）。
2. **立即**创建主窗口并加载 `renderer/startup.html`（`ready-to-show` 时显示），记录 `shown_ms`（AC-001-2、AC-002-1）。
3. 加载偏好（§3.6）→ 确定数据目录 → 可写探测：`mkdir -p`，创建并删除 `.fai-write-probe-<pid>`。
   - EACCES/EPERM/EROFS → `data_root_unwritable`（显示路径与原因，AC-004-3）；
   - ENOSPC → `disk_full`。
   - 探测失败不回退到临时目录。
4. mock 模式（`--mock` 参数或 `FAI_MODE=mock`）→ 不启动后端，`mode='mock'`，直接执行第 7 步（AC-002-4）。
5. 后端状态机启动（§4.2）。窗口通过 `onShellStatus` 显示"正在启动 / 等待健康检查 / 重启中（第 n/3 次）"。
6. 就绪 → `GET /settings/profile`。`onboarding.completed=false` → 加载内置引导页（AC-005-1）；否则加载目标页（WO-01）。
7. 目标页：
   - 打包时指定了前端（`app-config.frontend="bundled"`）→ `resources/frontend/index.html`；
   - 开发期 → `FAI_FRONTEND_DIST` 指定的目录；
   - 两者都没有 → 内置设置页。
   - 目标页（前端产物**或**内置引导/设置页）文件缺失、`did-fail-load` 或 `render-process-gone` → 回到启动页显示 `frontend_missing`（文案"界面资源缺失或加载失败"，附路径）/ `renderer_crashed`，提供重试（重新加载）和打开日志（AC-007-3）。
   - 启动页 `startup.html` 本身缺失时无法显示任何页面，退化为 `dialog.showErrorBox`（含日志路径）后退出；这是唯一使用原生错误框的路径。
   - "有意不带前端"（builtin 构建或未设置 `FAI_FRONTEND_DIST`）与"应有前端但缺失"这两种情况分开处理。
8. 记录 `startup_timing {shown_ms, ready_ms, interactive_ms}`（`interactive_ms` = 目标页 `did-finish-load` 的时间），供 M-02 在基准机上判定。

**错误页统一结构**：标题、原因、路径（如有）、动作。动作从以下集合中选：重试 / 查看日志 / 导出诊断 / 打开所在文件夹 / 继续使用原目录 / 退出。错误码与中文文案表由 Implement 写进 `renderer/startup.js`，覆盖：

`localappdata_missing`、`prefs_invalid`、`data_root_invalid`、`data_root_unwritable`、`data_root_locked`、`disk_full`、`port_in_use`、`backend_missing`、`backend_exited`、`health_timeout`、`restart_limit`、`frontend_missing`、`renderer_crashed`、`startup_internal`

### 4.2 后端生命周期状态机（单一实例）

```
idle → spawning → waiting_health → ready ──(意外退出)──→ restarting → spawning …
                      │                        │
                      ├─ 退出码 3 + 标记 → failed(code)（不自动重启）
                      ├─ 无标记的提前退出 → restarting（计入预算）
                      ├─ 超时 → kill → failed(health_timeout)（不自动重启）
                      └─ spawn error(ENOENT 等) → failed(backend_missing)
restarting 预算 3 次（间隔 0.5/1/1.5 s）；用尽 → failed(restart_limit)
任何状态 + 用户退出 → stopping → stopped
```

- **同一时刻最多一个子进程**。每次 spawn 递增代际 `gen`，旧代际的 `exit`/`error`/输出事件一律忽略。这同时修复了"崩溃重启"和"未就绪处理"并发触发的问题。
- 就绪轮询显式接收本代的 `{child, portFile, token, deadline}`，修复重启时沿用旧参数的问题。超时后先 kill 本代子进程，再进入 failed，避免残留进程持锁。
- `portFile` = `<外壳状态目录>/run/host.json`（不再写进数据目录根）。每次 spawn 前删除，退出后再删除一次。
- 外壳总是以 `stdio: ['pipe','pipe','pipe']` 拉起后端并传 `--exit-on-stdin-eof`。
- 用户点击"重试"会把重启预算清零；再次就绪**不**清零（M-16 与 e2e `restart-limit` 依赖这一点）。
- `ready → restarting` 时发出 `backend.error` 事件（托盘变为错误态并通知，AC-002-3、WO-06）；再次就绪时发出 `backend.ready`。
- 渲染层通过 `getBackend()` 拿到新的端口和令牌，当前页面在就绪后重新加载。

### 4.3 退出（AC-003-1/2/4）

1. 关窗：`closeBehavior="tray"` → 隐藏窗口、托盘常驻（AC-006-1）；`"quit"` → `requestQuit()`（WO-07）。托盘"退出"、系统关机前的 `before-quit` 也走 `requestQuit()`。
2. `requestQuit()` → 交给活动归约器的退出守卫（§3.5）。若需要询问，弹出 `dialog.showMessageBox`，选项为"等待完成后退出 / 取消退出"，并列出将被标记的排队项。
3. 优雅退出：
   - 状态机进入 `stopping`；
   - `POST /shutdown`，等待子进程退出最多 5 s；
   - 超时则结束进程树（`taskkill /PID <pid> /T /F`）并记日志；
   - 删除 `host.json`；
   - `session.json` 置 `cleanExit:true`；
   - 销毁托盘，`app.exit(0)`。
4. 正常退出后数据目录里不残留 `data/.lock` 和 `data/mcp_endpoint.json`，端口已释放（AC-003-1）。

### 4.4 端口（AC-007-1）

外壳**从不**传固定端口：后端始终绑定 `127.0.0.1:0`，由系统分配，所以不存在"默认端口被占"的情况，这是本计划对 AC-007-1 "自动改用其他端口"的实现方式。显式 `--port` 被占时宿主输出 `port_in_use` 标记并退出，不会卡住（供 CLI/测试使用）。

### 4.5 强杀与自愈（AC-003-3）

- 外壳被强杀 → 后端读到 stdin EOF → 走 lifespan 释放写锁 → 下次启动正常。
- 外壳与后端同时被强杀（模拟断电）→ `.lock` 残留，但持有者 PID 已死 → data-layer 的 `_stale` 回收陈旧锁（【现有】）。
- 未完成的取数批次由 `Service.init()` 里的 `store.stale_running()` 按 data-layer 既有约定处理（【现有】，WO-03）。

### 4.6 更改数据目录（AC-004-4）

设置 → "更改…" → 主进程 `dialog.showOpenDialog`（选择目录）→ 入口校验：

- 必须是绝对路径；
- 不能是当前目录；
- 不能位于安装目录之内；
- 可写探测通过。

校验通过后写 `pendingDataRoot`，界面提示"重启后生效"，并提供"立即重启"（`app.relaunch()` 后优雅退出）。下次启动按 §3.6 生效。日志从此写到新目录。

## 5. 数据与存储

| 位置 | 内容 | 归属 |
|---|---|---|
| `%LOCALAPPDATA%\FuturesAI\`（默认数据目录，spec §4） | data-layer 布局（`data/`、`adapters/`、`creds/`）+ settings（`profile/` 等），本 feature 不改动 | data-layer / settings |
| `<dataRoot>\log\` | `shell*.log`、`backend*.log`、`session.json`、`last-crash.json`、`diagnostics\*.zip` | 本 feature（目录名与 architecture §1 存储图中的 `log` 一致） |
| `%LOCALAPPDATA%\FuturesAI-Shell\` | `shell-prefs.json`、`log\bootstrap*.log`、`run\host.json`（运行期） | 本 feature |
| `%LOCALAPPDATA%\FuturesAI-Shell\session\` | Chromium 会话缓存、Crashpad（运行时文件，卸载时删除） | 本 feature |
| `%LOCALAPPDATA%\Programs\FuturesAI\`（NSIS 按用户安装） | 程序本体，`resources\{app, backend, frontend?, app-config.json}` | 本 feature |

旧开发路径 `%APPDATA%\futuresai-shell\FuturesAI` 只在开发期出现过，不做迁移（plan-gaps A-06）。

## 6. 设置页"应用"区（承载 AC-004-4、AC-006-3、AC-008-1、AC-010-2/3）

内置设置页新增一个区块，各项均调用 §3.3 的接口：

- 关窗行为（最小化到托盘 / 关闭即退出）
- 系统通知（开 / 关）
- 启动时检查更新（开 / 关；未配置更新源时禁用并说明原因）
- 数据目录（当前路径、待生效路径、"更改…"、"立即重启"）
- 关于（版本、构建信息、后端版本、手动检查更新、更新提示）
- 诊断（上次异常、日志写入错误、"打开日志目录"、"导出诊断"）

托盘菜单和应用菜单都有"设置…"，随时可以进入（WO-05）。引导页与设置页之间提供显式导航，不再依赖 `location.reload()` 切换视图。

## 7. 打包与构建

### 7.1 依赖与复现

- `shell/package.json`：`electron` 改为精确版本 `33.4.11`；新增 `electron-builder`，用精确版本，具体版本由 Implement 选定并记入 review。`npm ci` 必须由 lockfile 驱动，lockfile 与 package.json 不一致时直接失败。
- 后端：按 `backend/constraints.txt` 安装（含 `pyinstaller==6.22.3`）。`build.ps1` 先核对 `python -m PyInstaller --version` 与 constraints 一致，不一致即失败。
- 网络：electron-builder 首次运行会下载 Electron 和 NSIS 二进制（可走既有 npm 镜像）。这是构建期的外部依赖，在 review 中记录。

### 7.2 `packaging/build.ps1`（【计划】，在仓库根目录运行，兼容 Windows PowerShell 5.1）

| 步骤 | 命令 / 动作 | 失败即停 |
|---|---|---|
| 1 | 打印 git 提交、Node/npm/Python/PyInstaller 版本；断言 `shell/package.json`、`backend/pyproject.toml` 与 `backend/app/main.py` 的 `VERSION` 三者一致 | ✓ |
| 2 | `backend`：`python tools/build_backend.py --clean` | ✓ |
| 3 | `backend`：`python tools/shell_check.py`（加强版，§8） | ✓ |
| 4 | 前端：只有传入 `-FrontendDist <dir>` 时才校验 `<dir>/index.html` 存在并记 `frontend="bundled"`；默认 `frontend="builtin"`（本 checkout 无 `frontend/`，这是 mock 范围允许的） | ✓ |
| 5 | 生成 `shell/dist/staging/app-config.json`：`{frontend, build:{commit, builtAt, channel}, update:{feedUrl}}`，`feedUrl` 来自 `-UpdateFeedUrl`，默认 null。生成物不提交、不手改 | ✓ |
| 6 | `shell`：`npm ci` → `npm run test:unit` → `npm run dist`（`electron-builder --config electron-builder.config.js --win nsis`） | ✓ |
| 7 | `shell`：`node tools/scan-package.js dist/win-unpacked` | ✓ |
| 8 | `Get-FileHash -Algorithm SHA256` 处理安装包 → `shell/dist/SHA256SUMS.txt`；若传入 `-ReleaseBaseUrl`，另生成 `update-metadata.json`（§3.8 schema）供人工发布 | ✓ |

### 7.3 `electron-builder.config.js`（【计划】）

- `appId: "com.futuresai.desktop"`、`productName: "FuturesAI"`、`asar: false`（便于扫描与核查；运行时没有 node_modules 依赖）。
- `files` 用**白名单**：`main.js`、`preload.js`、`src/**`、`renderer/**`、`package.json`。`test/`、`tools/`、`check.js`、`installer/` 不进包；`src/test-hooks.js` 随包但只在 `FAI_TEST_HOOKS=1` 时加载（`packaged-ready` 需要它驱动打包产物）。
- `extraResources`：
  - `../backend/dist/futuresai-backend` → `backend`
  - `dist/staging/app-config.json` → `app-config.json`
  - 仅当环境变量 `FAI_FRONTEND_DIST` 存在时：其目录 → `frontend`
- `directories.buildResources: "installer"`。
- `nsis`：`oneClick: false`、`perMachine: false`、`allowToChangeInstallationDirectory: true`、`deleteAppDataOnUninstall: false`、`include: "installer/installer.nsh"`。
  - `customUnInstall` 只删除 `$LOCALAPPDATA\FuturesAI-Shell\session` 与 `…\run`。
  - **不触碰** `$LOCALAPPDATA\FuturesAI`（用户数据，按 R-004 保留）和 `shell-prefs.json`。
- 打包后的运行时：主进程启动时调用 `app.setAppUserModelId(appId)`，Windows 通知依赖它。

### 7.4 包内容扫描（AC-001-4）

`tools/scan-package.js <dir>` 检查两件事：

1. **黑名单**命中即失败：`*.duckdb`、`*.duckdb.wal`、`*.sqlite`、`profile.bin`、`eia_api_key.bin`、`creds/`、`profile/`、`host.json`、`mcp_endpoint.json`、`shell-prefs.json`、`*.log`、`.env*`、`tests/`、`pytest`/`_pytest`、`node_modules/electron-builder`、`.git/`。
2. **白名单**：`resources/app/` 下的条目必须全部在 §7.3 的 `files` 白名单之内。

后端产物沿用 `shell_check.py` 的测试依赖检查并补上同一黑名单。

### 7.5 后端产物中第三方测试资产的收集源头（修订 4，AC-001-4）

**1. 根因（只读核对已安装源码：PyInstaller 6.22.3、pyinstaller-hooks-contrib 2026.9、pyarrow 22.0.0）**

- `_pyinstaller_hooks_contrib/stdhooks/hook-pyarrow.py`：`hiddenimports = collect_submodules('pyarrow', filter=lambda x: "tests" not in x)`、`datas = collect_data_files('pyarrow')`、`binaries = collect_dynamic_libs('pyarrow')`。三者中只有 `hiddenimports` 排除了 tests。
- `collect_data_files`（`PyInstaller/utils/hooks/__init__.py`）：先按 includes（默认 `**/*`）收集包内全部文件，再去掉 Python 源码、字节码与扩展模块后缀（`.py`、`.pyc`、`.pyd` 等）的文件。`pyarrow/tests` 下的 `.pyx`、`.parquet`、`.orc`、`.feather`、`.gz`、`.md` 因此都作为数据收进 `pyarrow/tests`，与实测命中内容一致。
- `excludes` 的语义：每个 glob 相对包目录匹配；命中目录时追加 `<目录>/**/*`，把该目录下的所有文件从收集集合中移除。`excludes=['tests']` 正好移除 `pyarrow/tests/**`，不影响其他目录。已枚举：已安装 pyarrow 中名为 `tests` 的目录只有包根这一处；`include/arrow/testing` 不在 §7.4 黑名单内，不处理。
- `collect_dynamic_libs` 的模式是 `*.dll`、`*.dylib`、`lib*.so`，在 `pyarrow/tests` 下没有命中；纯 Python 模块进 PYZ 归档，不会生成 `_internal/pyarrow/tests` 目录。所以该目录**只**来自 `datas`。
- 模块排除不等于数据排除：`--exclude-module tests` 只作用于名为 `tests` 的模块，`collect_data_files` 不读模块排除列表。
- hook 选择规则：每个模块只启用一个 hook，取优先级最高者（`depend/imphook.py` 第 128～136 行）；`--additional-hooks-dir` 的优先级 1000 高于 contrib 的 −1000（`depend/analysis.py` 第 61～64 行，`building/build_main.py` 第 525～533 行）。因此仓库 hook 会**整体替换** contrib hook，必须自己给出与 contrib 等价的 `hiddenimports` 和 `binaries`。

**2. 设计（最小改动）**

| 文件 | 状态 | 内容 |
|---|---|---|
| `backend/tools/pyinstaller_hooks/hook-pyarrow.py` | 【计划】新增 | 只用 PyInstaller 公开 hook API 写三条赋值：`hiddenimports` 与 contrib 相同（`collect_submodules('pyarrow', filter=…)`，排除名称含 `tests` 的子模块）；`datas = collect_data_files('pyarrow', excludes=['tests'])`；`binaries = collect_dynamic_libs('pyarrow')`。文件头用一句注释说明用途（覆盖 contrib hook，只排除 `pyarrow/tests` 数据）与对照的 contrib 版本；不复制 contrib 文件正文和许可证头 |
| `backend/tools/build_backend.py` | 【现有→改】 | 新增仓库 hook 目录常量（`BACKEND / "tools" / "pyinstaller_hooks"`），PyInstaller 命令加 `--additional-hooks-dir <该目录绝对路径>`；docstring"要点"补一行。其余参数（含 `--exclude-module pytest` / `tests`、`--add-data`）与 `--clean` 行为不变 |
| `backend/tests/test_app_packaging.py` | 【计划】新增 | 见第 3 段 |

- hook 目录名用下划线且不放 `__init__.py`：它不是 Python 包，不会被 `--collect-submodules` 或 pytest 收集。`git check-ignore -v --no-index` 已核对 `backend/tools/pyinstaller_hooks/hook-pyarrow.py`、`backend/tests/test_app_packaging.py` 均不被忽略。
- 只覆盖 pyarrow 一个 hook，因为真实冒烟只报了这一处。**如果干净重建后出现其他第三方黑名单命中，停止并报回 Plan**，不得顺手扩大排除范围或放宽黑名单。

放弃的方案：

| 方案 | 不采用的原因 |
|---|---|
| `--exclude-module pyarrow.tests` | 只影响模块，`collect_data_files` 仍会收集测试数据（见根因） |
| `--exclude-module pyarrow`，整个去掉 pyarrow | 改变运行时依赖集合（pandas 的可选 pyarrow 路径），超出"只排除测试资产"的授权 |
| 改用仓库内 `.spec` 文件，在 Analysis 之后过滤 `datas` | 要把 CLI 构建换成 spec 构建，改动面更大 |
| 改 site-packages 中的 contrib hook，升级/降级 contrib 或 pyarrow，改 constraints | 不在仓库内、不可复现，且被明确禁止 |
| 构建后手工删除 `dist/…/pyarrow/tests` | 伪造结果；生成物不手改 |
| 黑名单对第三方 `tests/` 豁免 | 是对冻结 §7.4 / AC-001-4 的变更，须回 Clarify / Gate 1，不在授权内 |

**3. 测试（测真实实现，只在子进程边界注入）**

`backend/tests/test_app_packaging.py`（cwd `backend`）：

| 测试 | 断言 |
|---|---|
| `test_build_command_wires_repository_hook_dir` | 只把 `subprocess.run`（系统边界）换成记录器并返回非零退出码；调用真实 `build_backend.main`（不带 `--clean`，不删任何目录）→ 返回该非零码；记录的命令中 `--additional-hooks-dir` 恰出现一次，其值等于 `backend/tools/pyinstaller_hooks` 的绝对路径，且该目录含 `hook-pyarrow.py`；`--exclude-module pytest`、`--exclude-module tests`、`--add-data` 仍在；`cwd` 为 `backend` |
| `test_pyarrow_hook_collects_no_test_assets` | 用 `runpy.run_path` 真实执行仓库 hook（真实 `collect_*` 作用于已安装 pyarrow）：`datas` 与 `binaries` 中没有目标路径（统一成 `/` 分隔）等于 `pyarrow/tests` 或以 `pyarrow/tests/` 开头的条目；`hiddenimports` 中没有 `pyarrow.tests` 及其子模块 |
| `test_pyarrow_hook_matches_contrib_except_tests` | 同样真实执行已安装的 contrib hook（只读）作为独立参照：仓库 hook 的 `hiddenimports`、`binaries` 与 contrib 集合相等；仓库 `datas` = contrib `datas` 去掉目标位于 `pyarrow/tests` 之下的条目；被去掉的条目在当前受测环境非空（复现前提）；字面量锚点：`hiddenimports` 含 `pyarrow.lib`、`pyarrow.compute`、`pyarrow.parquet`，`binaries` 文件名含 `arrow.dll`、`parquet.dll`，`datas` 含目标为 `pyarrow/include/arrow` 的 `api.h` |

- 参照规则"目标路径不在 `pyarrow/tests` 之下"是 §7.4 黑名单的需求表述，与生产 hook 的 glob `excludes` 是不同机制，不是把生产过滤逻辑抄进测试。
- 两个 hook 各执行一次（模块级 fixture）；`collect_submodules` 会在隔离子进程中导入 pyarrow 子模块，这是 PyInstaller 自身的行为。
- 未安装 pyarrow 的环境里该 hook 不会生效，两个 hook 测试用 `pytest.importorskip("pyarrow")` 并写明原因；**当前受测环境已安装 pyarrow，最终证据中这两个测试必须 PASSED，出现 skip 即不算通过**。如果脱离构建执行 hook 必须靠 mock 才能运行，停止并报回 Plan，不得 mock `collect_*`。
- 不用真实凭证，不访问上游。

**4. pyarrow 运行时可用性为何足够（限本修正范围）**

1. 等价性：第 3 段的参照测试证明仓库 hook 与 contrib hook 的 `hiddenimports`、`binaries` 完全相同，`datas` 只少测试资产 → 冻结产物中 pyarrow 的模块、扩展、DLL 与非测试数据都与修正前一致。这是 pyarrow 可用性的主要保证。
2. 真实产物：`build_backend.py --clean` 重新生成后运行**未修改**的 `shell_check.py`：真实 exe 启动并加载依赖链，`/health` 对两库做真实探测，三源随包，鉴权、优雅退出与清理全部通过（12/12）。注意 pandas 导入时尝试加载 pyarrow 但会吞掉 `ImportError`，所以冒烟本身**不能单独**证明 pyarrow 可导入，只证明应用整体可用。
3. 产物差异：重建前记录阻塞产物的文件清单，重建后对比：被移除的路径非空且全部在 `_internal/pyarrow/tests/` 之下，没有其他增删。出现其他差异时停止并报告，不自行解释为通过。
4. 静态事实：`backend/app`、`backend/data`、`backend/settings` 中没有 `import pyarrow` / `from pyarrow`（`rg` 核对），本 feature 的 AC 不直接调用 pyarrow API。因此不新增 pyarrow 功能探针——那需要改冻结的冒烟脚本或运行时代码，超出授权。

**5. 证据与停止规则**：见 tasks T-04b。生成物只由 `build_backend.py --clean` 重新生成；修正前的 11/12 失败与构建兼容性警告保留在证据中。

## 8. 验证体系

### 8.1 三类证据，不得混用

| 类别 | 证明什么 | 不能证明什么 |
|---|---|---|
| 自动化（pytest / `node --test` / Electron 冒烟） | 生产处理器在真实进程、真实文件系统、真实 HTTP 下的行为；夹具只在系统边界替换（进程、对话框、通知器、`openExternal`、更新源、事件来源） | 系统通知观感、真实托盘交互、干净机器、基准机性能、真实业务作业 |
| 人工（`manual-acceptance.md` 的 M-ID） | 真实 GUI、系统托盘、系统通知、安装与卸载、外部浏览器 | 未在该环境执行过的结论 |
| 外部（真实作业引擎、发布通道、干净机、基准机、真实 EIA key） | —— | 本阶段无法取得；在 review 中标"未取得"，不能用夹具结果代替 |

`node --test` 单测运行在构建机 Node 上，只证明纯逻辑；涉及 Electron/Chromium 运行时的结论（ZIP 写出、`ses.fetch`、`webRequest`/CSP、托盘、通知、对话框）只以真实 Electron e2e 为证据。所有"待新增"命令在 Implement 前都不存在，不得写成已通过。

### 8.2 命令（cwd 写明；标注现有 / 待新增）

| 命令 | 状态 | 说明 |
|---|---|---|
| `cd backend && python -m pytest tests/test_app_health.py tests/test_app_lifecycle.py tests/test_app_settings_api.py -q` | 现有（用例待扩充） | 健康/鉴权/回环/退出/设置 |
| `cd backend && python -m pytest tests/test_app_startup_errors.py tests/test_app_channel.py tests/test_app_disk_full.py -q` | 待新增 | 启动分类与端口、只读通道、磁盘满（stdin EOF 用例加在现有 `test_app_lifecycle.py`，回环 netstat 用例加在现有 `test_app_health.py`） |
| `cd backend && python -m pytest tests/ -q` | 现有 | 全量回归（提交前） |
| `cd backend && python tools/build_backend.py` | 现有 | 无 `--backend-only` 参数 |
| `cd backend && python tools/build_backend.py --clean` | 现有（`--clean` 是脚本已有参数） | 修订 4：T-04b 最终验证必须干净重建；构建将带 `--additional-hooks-dir`（待新增） |
| `cd backend && python -m pytest tests/test_app_packaging.py -q -vv` | 待新增（修订 4） | 构建命令接线 + 仓库 pyarrow hook 的真实收集（§7.5） |
| `cd backend && python tools/shell_check.py` | 现有（待加强） | 加强点：就绪必须看到健康检查成功；netstat 校验监听地址；黑名单扫描 |
| `cd shell && npm ci` | 现有 lockfile | 所有外壳命令的前置步骤 |
| `cd shell && npm run test:unit` | 待新增 | 脚本 `node --test "test/unit/*.test.js"`（Node 25 内置 glob）；输出逐条测试名 |
| `cd shell && npm run check -- <场景…>` | 脚本现有，运行器待重写 | `node check.js <场景…>`，运行 `test/e2e/<场景>.js` 的真实 Electron 场景（规则见 §8.3）；无参数 = 全部登记场景 |
| `cd shell && npm run dist` | 待新增 | `electron-builder --config electron-builder.config.js --win nsis`；依赖 `build.ps1` 第 5 步生成的 `dist/staging/app-config.json`，因此首次运行在 `build.ps1` 第 6 步，不单独作为早期任务的验证命令 |
| `cd shell && node tools/scan-package.js dist/win-unpacked` | 待新增 | AC-001-4 |
| `powershell -ExecutionPolicy Bypass -File packaging/build.ps1`（仓库根目录） | 待新增 | 完整构建 |

**已退役（仅作历史文本，任何任务不得作为验证命令）**：`npm run check:ui`（从未存在）、`python tools/shell_check.py --backend-only`（参数不存在，会被忽略）、`npm run smoke` 与 `--smoke` / `--ui-smoke` 分支（由 §8.3 测试钩子取代后删除）。

### 8.3 测试接缝与 e2e 运行器（只在系统边界）

**隔离（每个 e2e 场景强制）**：运行器为每个场景建临时目录 `<tmp>/fai-e2e-<场景>-<随机>/`，给被测进程设置 `LOCALAPPDATA=<tmp>/LocalAppData`、`FAI_SHELL_STATE_DIR=<tmp>/LocalAppData/FuturesAI-Shell`、`FAI_TEST_HOOKS=1`、`FAI_TEST_SCENARIO=<场景>`；`FAI_DATA_ROOT` 只在场景明确需要时设置（`change-root` 不设，以验证默认解析与偏好）。被测进程第一行 `SMOKE {"event":"paths",…}` 报告 userData / sessionData / 状态目录 / 数据目录，运行器核对全部位于该临时目录内，否则立即结束进程并 FAIL（修复 A-16 使用真实用户目录）。

**测试钩子 `src/test-hooks.js`**（仅 `FAI_TEST_HOOKS=1` 时由 `main.js` 加载）：

- 系统边界记录器：`dialog.showMessageBox` / `showOpenDialog` 按预置应答队列返回，队列为空时记录 `unanswered` 并返回取消（场景据此失败）；`Notification` 只记录 `{kind,title,body}`；`shell.openExternal` / `openPath` / `showItemInFolder` 只记录参数。处理器本身是生产代码，只替换出口（AGENTS §5.6）。
- `FAI_BACKEND_CMD`（JSON 字符串数组）替换后端命令；`FAI_TEST_EVENTS`（§3.5，事件数组文件路径）；`FAI_UPDATE_FEED_URL`（仅 `http://127.0.0.1:*`）；`FAI_HEALTH_TIMEOUT_MS`（就绪超时）。
- Chromium 开关 `host-resolver-rules=MAP remote.fai.test 127.0.0.1`：让"远程主机"`remote.fai.test` 在被放行时会真实打到回环夹具服务，从而可以用服务端命中数证明拦截（AC-009-2），无需外网。
- **控制通道**：在 `127.0.0.1:0` 起一个 HTTP 服务（不另设鉴权：只在 `FAI_TEST_HOOKS=1` 时存在、只监听回环、被测进程使用隔离临时目录；生产后端的 Bearer 令牌不受影响），stdout 输出 `SMOKE {"event":"control","port":N}`。`POST /cmd` 的固定命令集（未知命令 → 400）：
  - `snapshot` → `{paths, versions:{electron,node,chrome}, window:{exists,visible,minimized,url,title}, backend:{phase,phases,gen,restarts,pid,port,lastCode}, tray:{state,tooltip,menu}, records:{dialogs,notifications,external,secondInstance}, activity, prefs}`；
  - `eval {js}` → 主窗口 `executeJavaScript` 的 JSON 结果；
  - `answer {queue}` → 追加对话框应答（如 `{type:"message",button:"取消退出"}`、`{type:"open",paths:[…]}`）；
  - `close-window`（等同用户点关闭）、`tray-click {path:[菜单标签…]}`（调用托盘菜单项真实 `click`）、`request-quit`（调用生产退出入口）。
  - 控制通道只调用生产函数，不含业务判断。不用 stdin：Electron 在 Windows 上读 stdin 的可靠性未经验证；stdout 只承载 `SMOKE` 行（现有 `check.js` 已证明可读）。

**假后端 `test/fixtures/fake_backend.py`**（进程边界夹具，不是业务实现）：与真实宿主相同的命令行（`--root --port-file --token [--port] [--exit-on-stdin-eof]`）、端点文件、`FAI_HOST` 标记行、退出码 3 语义与 stdin EOF；端点只有 `/health`、`/shutdown`、`GET /settings/profile`（只返回路由需要的 `onboarding` 形状，由 `--onboarded 0|1` 决定，默认 1）。模式 `--mode`：`ok`、`slow-ready:<ms>`、`health-fail`（/health 恒 503）、`hang`（不监听）、`exit-before-ready`、`crash-after-ready:<ms>`（每个实例就绪 `<ms>` 后以退出码 1 退出）、`startup-failed:<code>`。登记：`FAI_FAKE_REGISTRY=<dir>` 下每次启动追加 `spawns.jsonl`（pid、时间），运行器据此统计启动次数，并用 pid 存活检查断言"同时最多一个后端"。重启预算在就绪后**不**清零，只在用户"重试"时清零（§4.2），所以 `crash-after-ready` 下应恰好启动 4 次（1 + 3 次重启）。

**运行器 `check.js`**：

- 登记表 `test/e2e/index.js`（场景名数组）与同目录场景文件必须一一对应，否则退出码 2；`node check.js <名…>` 中有未知名称 → 退出码 2，不运行任何场景；无参数运行全部。
- 每个场景声明所需外部工具与夹具（如 `python`、`%SystemRoot%\System32\tar.exe`、`icacls`、`netstat`、`taskkill`、夹具文件）；缺失 → 该场景 FAIL，不 skip。ZIP 解压必须用绝对路径 `%SystemRoot%\System32\tar.exe`（bsdtar）：git-bash 等环境的 PATH 上 `tar` 可能是不能读 ZIP 的 GNU tar。
- 断言只用显式期望值（`expectEqual(名, 实际, 期望)`、`expectMatch`、`expectIncludes` 等），禁止 `a || b` 式复合布尔断言；场景结束时断言数为 0 → FAIL。
- 清理（含失败与超时路径）：控制通道 `request-quit` → 最多等 10 s → 否则 `taskkill /PID <electron pid> /T /F`；核对快照中的后端 pid 与假后端登记的 pid 都已不存活，否则结束并 FAIL；恢复场景副作用（如 ACL）；删除临时目录（重试 3 次，仍失败 → FAIL 并打印路径）。
- 输出每条 `PASS|FAIL <场景> › <断言名>`，汇总后有失败则退出码 1。
- 场景模块形如 `{requires, run(ctx)}`，只有调用 `ctx.launch()` 才启动 Electron；断言 API 不提供单参数布尔断言。
- 运行器自身规则由 `test/unit/check-runner.test.js` 直接验证：以子进程运行真实 `check.js`，用 `FAI_CHECK_E2E_DIR`（只由运行器读取）把场景目录换成 `test/fixtures/runner/<情形>/`，覆盖未知名称（退出码 2、夹具标记文件未生成）、登记表不一致（退出码 2）、零断言（FAIL）、缺外部工具（FAIL）、两条断言正常通过（退出码 0）。
- 假后端由 `test/unit/fake-backend.test.js` 以子进程直接验收：`ok` 写端点文件且 `/health` 200、`health-fail` 503、`startup-failed:<code>` 退出码 3 + 标记行、stdin EOF 退出、`spawns.jsonl` 登记。

**回环夹具服务**（`csp`、`update-*` 场景内由运行器启动）：记录每个请求的 `Host` 头与路径；`/evil.js` 返回 `window.__remoteExecuted=1`；`/frame.html`、`/data`、`/ok`（200，`Access-Control-Allow-Origin: *`）；更新元数据端点。

**运行器与钩子自检场景**（基础设施；最近 AC 为 AC-004-1（隔离运行、只有一个后端）与 AC-004-4 / WO-04（默认目录解析），不证明产品 AC）：`harness-selftest`（假后端 `ok`：`SMOKE paths` 全在临时目录、窗口存在、后端 pid 存活且 `spawns.jsonl` 1 条 → `request-quit` 后退出码 0、后端 pid 不存活、临时目录已删）；`events-invalid`（`FAI_TEST_EVENTS` 指向含未知 `type` 的文件 → 退出码 4 且输出 `TEST_EVENTS_INVALID`）。`harness-selftest` 只依赖现有就绪流程与假后端，不依赖 §4.2 状态机，因此可以先于生命周期任务落地；它是 `bootstrap` 接线的集成复验，不是 `bootstrap` 任务的完成前提。

**真实后端 e2e**（不设 `FAI_BACKEND_CMD`，开发期以 `python -m app` 运行源码后端）覆盖：就绪、退出清理、锁被占、强杀自愈、崩溃重启、引导与设置、诊断包。

## 9. 验收对应（spec 38 条 AC 逐条 + 无 AC 的 what）

列说明：

- **计划实现**：落点文件。
- **自动验证**：命令或用例，"新"表示待新增。
- **手工**：`manual-acceptance.md` 中的 M-ID。
- **外部 / 诚实状态**：本阶段能证明到什么程度。

| AC | 计划实现 | 自动验证 | 手工 | 外部 / 诚实状态 |
|---|---|---|---|---|
| AC-001-1 | §7 打包；§4.1 启动 | `build.ps1` 全流程 + 运行 unpacked 产物冒烟（e2e `packaged-ready`，新） | M-01 | 干净机【外部】；Q-009 允许已装运行时的过渡验收，可用 Windows Sandbox 获取真实干净环境证据 |
| AC-001-2 | §4.1 第 2、8 步（立即显示启动页 + 计时） | e2e `startup-visible`（fake `slow-ready:3000`：就绪前页面为"正在启动"），新 | M-02 | 15 s 只能在基准机上判定【外部】；开发机计时仅供参考 |
| AC-001-3 | §7.3 NSIS + `installer.nsh` | `builder-config.test.js`（读取真实 `electron-builder.config.js` 与 `installer/installer.nsh`：按用户安装、可改目录、`deleteAppDataOnUninstall:false`、`customUnInstall` 只删 `FuturesAI-Shell\session` 与 `run`、不触碰 `FuturesAI` 与 `shell-prefs.json`）（新）；安装/卸载效果无法自动化 | M-03 | 配置可自动化；卸载效果仅人工 |
| AC-001-4 | §7.3 白名单 `files`；§7.4 扫描 | `builder-config.test.js`（`files` 白名单）（新）；`scan-package.test.js`（临时目录正/负夹具）（新）；`build.ps1` 第 7 步对真实 `dist/win-unpacked` 运行 `scan-package.js`（新）；`shell_check.py` 黑名单（加强）；`test_app_packaging.py`（构建命令接线 + 真实执行仓库 pyarrow hook：无 `pyarrow/tests` 目标、其余与 contrib hook 一致）（新，修订 4）；T-04b 以 `build_backend.py --clean` 干净重建 + 未修改的 `shell_check.py` 12/12 验收（§7.5） | M-04 | 可自动化 |
| AC-002-1 | `renderer/startup.*`；`onShellStatus` | e2e `startup-visible`（同上） | M-02 | 可自动化 |
| AC-002-2 | §3.1.3 真实探测；§4.2 三条件就绪 | pytest：探测失败 → 503、`data_ready:false`（新，在访问层边界注入异常）；e2e `health-fail`（fake `health-fail`）：快照 `backend.phases` 从未出现 `ready`，超时后进入 `health_timeout` 页（新）；`shell_check.py` 必须看到健康检查成功 | —— | 可自动化 |
| AC-002-3 | §4.2 重启预算 3 次 + `restart_limit` 页（含"导出诊断"） | e2e `crash-restart`（真实后端：结束后端 pid → 重启后就绪、端口变化、`restarts=1`）；e2e `restart-limit`（fake `crash-after-ready:300`：`spawns.jsonl` 恰好 4 条、同时存活后端 ≤ 1、最终 `restart_limit` 页）（新）；"导出诊断"入口在诊断包任务接入后由 `restart-limit` 复验：点击后 ZIP 文件存在（新） | M-16 | 可自动化 |
| AC-002-4 | §4.1 第 4 步 mock；preload `mode` | e2e `mock`：`--mock` + `FAI_FRONTEND_DIST=test/fixtures/frontend-stub` → 页面回显 `mode==='mock'`、`getBackend()` 为 null、假后端登记为空且无后端子进程；不带前端时内置页显示 mock 横幅（新） | —— | 真实 `frontend-workbench` 的 mock 集成【外部】 |
| AC-003-1 | §4.3；后端 lifespan | pytest `test_shutdown_releases_lock_and_port`（现有）；e2e `ready-quit`（现有加强：无 `.lock`、无 `mcp_endpoint.json`、端口释放、`host.json` 已删） | —— | 可自动化 |
| AC-003-2 | §3.5 退出守卫；§4.3 | e2e `quit-guard-cancel`（事件夹具运行中作业 + 对话框记录器选"取消退出" → 应用和后端仍在、作业仍为运行中）（新） | M-08 | 由夹具驱动；真实作业【外部】 |
| AC-003-3 | §3.1.1 stdin EOF；§4.5 | pytest `test_stale_lock_recovered_after_hard_kill`（现有）+ stdin EOF 退出释放锁（新）；e2e `kill-shell-recover`（`taskkill /F` 只杀外壳 → 后端 5 s 内退出 → 再启动就绪）（新） | —— | 可自动化 |
| AC-003-4 | §3.5（`cancelled_on_exit` / `rejected_exiting`） | `activity.test.js`（新）；e2e `quit-guard-wait`（选"等待完成" → 排队项被标记、新事件被拒收并记录 → 作业结束后自动退出）（新） | M-08 | 只证明外壳侧语义；后端 drain【外部】（plan-gaps D-02） |
| AC-004-1 | §4.1 第 1 步 | e2e `single-instance`（同一隔离目录内启动第二个实例：10 s 内退出码 0；首实例 `records.secondInstance` 恰为 1 条且记录了对窗口的 restore/show/focus 调用；`spawns.jsonl` 恰 1 条；首实例后端 pid 与端口不变）（重写） | M-09 | 后端唯一性可自动化；Windows 前台锁使"真实获得焦点"无法稳定自动断言，留 M-09 人工 |
| AC-004-2 | §3.1.2 `data_root_locked`；不重启 | pytest：测试进程持有真实 `Service(root)` 写锁 → 宿主退出码 3 + 标记（新）；e2e `root-locked`（真实后端，辅助 Python 进程持锁 → 错误页 `data_root_locked`、`restarts=0`）（新） | M-10 | 可自动化 |
| AC-004-3 | §4.1 第 3 步探测；§3.1.2 | `prefs.test.js` / 探测单测（新）；e2e `root-unwritable`（`icacls <dir> /deny %USERNAME%:(W)` → 错误页含路径与"权限不足"，事后恢复 ACL）（新） | M-11 | 只读盘场景人工 |
| AC-004-4 | §3.6、§4.6 | `prefs.test.js`（pending 生效/失败分支）（新）；e2e `change-root`（`answer` 预置打开目录应答 → `eval` 调用 `window.futuresai.chooseDataRoot()` 设置 pending → `request-quit` → 运行器以同一隔离目录再启动：新目录就绪、偏好 `dataRoot` 为新目录、旧目录哨兵文件仍在；"立即重启"的 `app.relaunch()` 会产生运行器无法跟踪的进程，留 M-12 人工）（新） | M-12 | 可自动化 |
| AC-005-1 | 就绪后按 `onboarding.completed` 选页 | pytest `TestOnboardState`（现有）；e2e `onboarding`：第一次运行进引导 → 提交 → 第二次运行进设置（新） | M-13 | 可自动化；承载 settings AC-002-1 的界面子句 |
| AC-005-2 | 引导"跳过"；设置入口（§6） | pytest `test_mark_completed_skip`（现有）；e2e `onboarding-skip`：跳过 → 设置页可编辑档案；托盘/菜单"设置…"可达（新） | M-13 | 承载 settings AC-002-3 |
| AC-005-3 | 宿主 `GET /settings/registration-guide`（§3.1.4，原样暴露 settings 核心 `prepare` / `registration_hint`）；内置设置页 EIA 区"准备注册信息"→ 缺项引导 / 逐项指引 → 系统浏览器打开注册页；粘贴、验证、保存、清除；状态表 | pytest `TestRegistrationGuide`（真实 settings 核心 + 真实加密档案夹具：完整档案的 Category 为官方标签、含 Reason for use、Email 为真实值；缺项档案 `missing` 与核心一致且 `hint` 非空；无令牌 401；保存过 key 后响应不含 key；请求期间日志不含邮箱）（新）；pytest `TestKeyWizard` / `TestSources` / `TestClearKey`（现有；`_probe` 在网络边界注入，覆盖验证与保存）；e2e `registration-guide`（真实后端；运行器启动前用 settings 核心写入加密档案：完整档案 → 指引五项与核心一致、点击"打开注册页"后 `openExternal` 记录器收到核心 URL；缺项档案 → 列出缺项、无"打开注册页"、`openExternal` 记录为空、key 粘贴/验证区仍可用；全程不访问 EIA）（新）；e2e `settings-sources`：状态表含 eia「免凭证回退」；清除 key 后的提示（新） | M-14 | 真实 key 验证与真实注册需要网络与真实 key【外部】；承载 settings AC-003-1 的预填/缺项引导与 AC-003-5 的界面提示 |
| AC-005-4 | 输入框 `password`、成功后清空；遮蔽邮箱禁止回写；不记载荷；注册指引只读且仅在用户显式点击后显示（§3.1.4 隐私区分） | pytest：响应不含 key（现有）；PUT 遮蔽邮箱 → 422（新）；`TestRegistrationGuide` 响应不含 key（新）；e2e `ui-masking`（key 输入框为 `password`；不在 e2e 中提交 key——验证会访问 EIA 外网；设置页只显示遮蔽邮箱；只改姓名并保存后退出，运行器用 settings 核心 `load` 读出的邮箱等于原值）（新）；e2e `registration-guide`（点击前指引区为空；指引区不在任何表单内）（新）；e2e `diagnostics-privacy`（§9 AC-009-4，流程含打开注册指引） | M-15 | 承载 settings AC-003-3 的遮蔽 |
| AC-006-1 | §4.3 第 1 步；托盘 | e2e `close-to-tray`（运行中作业 + `win.close()` → 窗口隐藏未销毁、后端存活、托盘状态为 running）（新） | M-05 | 夹具驱动；真实托盘观感人工 |
| AC-006-2 | §3.5 通知 | `activity.test.js`；e2e `notify`（`stage_completed` → 通知记录器收到对应种类）（新） | M-06 | 系统 toast 只能在安装版上人工确认【外部/人工】 |
| AC-006-3 | 偏好 `notifications=false`；设置"应用"区开关 | e2e `prefs-ui`（设置页点击通知开关与关窗行为 → `shell-prefs.json` 持久化 `notifications=false` 与所选值；再次启动界面回显；非法 patch 被拒）（新）；e2e `notify-off`（预置 `notifications=false` 的偏好文件，带 `stage_completed` 事件 → 通知记录为空、托盘状态仍随事件变化）（新） | M-06 | 同上 |
| AC-006-4 | 托盘菜单：打开主窗口 / 运行中作业子菜单 / 设置… / 导出诊断 / 退出 | e2e `tray-menu`（读取菜单模板标签并调用各 click：窗口可见、子菜单列出作业标题、退出走 `requestQuit`）（新） | M-07 | 子菜单内容由夹具驱动 |
| AC-007-1 | §4.4 端口 0；`port_in_use` | pytest：两个宿主同时就绪且端口不同；显式 `--port` 被占 → 退出码 3 + `port_in_use`（新） | —— | 可自动化 |
| AC-007-2 | §4.2 超时 → 先 kill 再报错；错误页提供重试和日志 | e2e `timeout`（fake `hang`、`FAI_HEALTH_TIMEOUT_MS=3000` → `health_timeout` 页带"重试""查看日志"；重试后代际 +1 且无残留进程）（新） | —— | 可自动化 |
| AC-007-3 | §4.1 第 7 步 | e2e `frontend-missing`（`FAI_FRONTEND_DIST` 指向不存在的目录 → `frontend_missing` 页，可重试）（新） | M-17 | 可自动化 |
| AC-007-4 | §3.1.6 507；§3.6 偏好写入；§3.7 日志与诊断写入失败；启动期 `disk_full` | pytest `test_app_disk_full.py`（`os.replace` / 写文件边界抛 ENOSPC → 507 后 `/health` 仍为 200）（新）；`logger` / `diagnostics` / `prefs` 单测在文件系统边界注入 ENOSPC（新）；e2e `startup-disk-full`（fake `startup-failed:disk_full`）（新） | M-18 | 真实满盘只能人工（VHD，可选） |
| AC-008-1 | `getAppInfo`；关于区 | e2e `about`（版本 == `package.json`；开发构建标识）（新） | M-19 | 可自动化 |
| AC-008-2 | §3.8 | `update.test.js`（schema、比较、非法输入）（新）；e2e `update-available`（loopback 夹具源；notes 含 `<b>` 时按纯文本显示；"稍后"后不再提示；通知被记录）（新） | M-20 | 真实发布通道【外部】 |
| AC-008-3 | §3.8 失败静默 | e2e `update-offline`（源指向已关闭端口 → 应用正常就绪、对话框记录器为空、日志有一行失败记录）（新） | M-21 | 可自动化 |
| AC-009-1 | 宿主只绑 127.0.0.1（现有） | pytest 回环测试（现有）+ `netstat -ano -p TCP` 按 pid 断言 LISTENING 地址为 127.0.0.1（新，不依赖本机是否有非回环地址）；`shell_check.py` 同样做 netstat 检查 | M-26（可选，第二台机器） | 可自动化 |
| AC-009-2 | §3.4 CSP + 请求白名单 | e2e `csp`（新），两段，均以回环夹具服务的真实命中为证据（`remote.fai.test` 经 host-resolver-rules 映射到该服务）：①无 CSP 的 `frontend-stub`（模拟前端产物；假后端 `--onboarded 1` 使目标页为该夹具）：`eval` 在页面内插入 `<script src=http://remote.fai.test:P/evil.js>`、`<iframe src=http://remote.fai.test:P/frame.html>`、`fetch(http://remote.fai.test:P/data)`，以及回环脚本 `<script src=http://127.0.0.1:P/evil.js>` → 服务收到 `Host: remote.fai.test` 的请求 = 0、`/evil.js` 请求 = 0、`window.__remoteExecuted === undefined`、iframe 文档未加载、fetch 被拒；**正对照**：同页 `fetch(http://127.0.0.1:P/ok)` 返回 200 且服务恰收到 1 次 `/ok`，经 `getBackend()` 对当前后端 `/health` 的 fetch 返回 200；②有 CSP 的内置引导页（真实后端、全新数据目录）：同样三类远程尝试 → 远程命中 = 0、未执行；正对照：内置页对真实后端的带令牌 XHR 成功（组织类型下拉从后端加载出 12 项）。**不**断言白名单拦截计数（CSP 可能先于 `webRequest` 拦下） | —— | 可自动化；不需要外网 |
| AC-009-3 | §3.4 导航 | e2e `external-link`（点击"打开 EIA 注册页" → `openExternal` 记录器收到 URL，窗口 URL 不变）（新） | M-22 | 真实浏览器打开需人工 |
| AC-009-4 | §3.7 白名单诊断 + 不记载荷 + 脱敏 | `redact.test.js`（已知模式的阳性用例）、`diagnostics.test.js`（白名单条目）（新）；e2e `diagnostics-privacy`：数据目录中预置哨兵——真实 `creds.put` 写入的 `FAIPLANT-KEY-…`、档案邮箱 `plant.user@example.test`、`docs_in/` 与 `knowledge/` 下含 `FAIPLANT-DOC-…` 的文件；跑完引导/设置（含点击"准备注册信息"显示指引）/崩溃重启后导出诊断 → 用 `%SystemRoot%\System32\tar.exe -xf`（bsdtar，绝对路径）解压（同时作为 ZIP/CRC 在真实 Electron 运行时写出正确的证据），所有条目及 `<dataRoot>/log/` 下均不含任一哨兵和当次令牌，条目集合 ⊆ 白名单（新） | M-23 | 可自动化（阳性哨兵） |
| AC-010-1 | §3.7 滚动 | `logger.test.js`（小上限写满 → 文件数 ≤ 5、单文件 ≤ 上限）（新） | —— | 可自动化 |
| AC-010-2 | §3.7 诊断包 | `diagnostics.test.js`（CRC-32 标准向量 `"123456789"` → `cbf43926`、条目白名单、ENOSPC）（新）；e2e `diagnostics-privacy`（真实 Electron 写出、`%SystemRoot%\System32\tar.exe` 可解压、`manifest.json` 版本等于 `package.json`、`env`/`process`/`log` 条目齐全）（新） | M-23 | 可自动化；单测不证明 Electron 运行时 |
| AC-010-3 | §3.7 崩溃现场 | e2e `crash-record`（`taskkill /F` 外壳 → 再启动后 `getLastCrash()` 返回 `shell_unclean_exit`；结束后端 → `backend_crash` 带退出码和尾部日志；设置页诊断区显示）（新） | M-24 | 可自动化 |

**spec 中有 what 但没有单独 AC 的条目**（不新增 AC；给出覆盖，是否属于需求质量缺口由 A 判断）：

| WO | spec 出处 | 计划 | 验证 |
|---|---|---|---|
| WO-01 | R-001 "非首次启动直接进入工作台" | §4.1 第 6、7 步 | e2e `onboarding` 第二次运行 |
| WO-02 | R-003 退出提示中的"等待完成" | §3.5 | e2e `quit-guard-wait` |
| WO-03 | R-003 "未完成批次按后端既有约定处理" | 现有 `stale_running()` | data-layer 既有测试；本 feature 不新增 |
| WO-04 | R-004 / spec §4 默认数据目录 `%LOCALAPPDATA%/FuturesAI` | §3.6、§5 | `paths.test.js`、`bootstrap.test.js`（新）；e2e `harness-selftest`（集成复验）/ `change-root` 在注入的 `LOCALAPPDATA` 下解析出默认目录 |
| WO-05 | R-005 "设置入口在应用内常驻可达" | §6 托盘与菜单 | e2e `onboarding-skip` / `tray-menu` |
| WO-06 | R-006 另外三类通知 + 托盘"有错误"状态 | §3.5 | `activity.test.js`；e2e `crash-restart`（`backend_error` 通知 + 托盘 error） |
| WO-07 | R-006 / Q-003 关窗可改为"退出" | §4.3 | e2e `close-quit`（新） |
| WO-08 | R-008 "更新包与安装包的完整性可校验" | §3.8、§7.2 第 8 步 | `build.ps1` 输出 `SHA256SUMS.txt`；M-25 |
| WO-09 | R-009 "访问令牌只对本机进程可见" | 每次运行随机令牌、只绑回环、`host.json` 放在用户本地目录、令牌不进日志或诊断包 | e2e `diagnostics-privacy` 扫描当次令牌 |
| WO-10 | R-009 "除用户自选数据源与模型调用外不外发" | §3.4 白名单；§3.8 出站限制 | e2e `csp` 远程命中 = 0；Analyze/Review 静态核查主进程出站点只有更新检查与 `openExternal`（`rg "fetch\(|net\.request|http\.request|https\.request" shell/main.js shell/src`）；M-26（可选网络监视） |
| WO-11 | R-010 诊断含"进程状态" | `process.json` | e2e `diagnostics-privacy` |
| WO-12 | R-002 "未就绪时可重试" | 错误页"重试" | e2e `timeout` |
| WO-13 | Q-001 "数据服务（单写者 + 只读通道）在后端进程内" | §3.1.5 | pytest `test_app_channel.py`：宿主运行时 `futureai-data list sources` 与 `futureai-settings` 的源列表经通道成功；退出后端点文件删除（新） |

## 10. 风险、回滚与未做之事

| 风险 | 对策 |
|---|---|
| PyInstaller 产物冷启动慢（pandas/akshare 导入），在基准机上超过 15 s | §4.1 先显示启动页，`startup_timing` 实测；超标时在 Analyze/Converge 中立项做延迟导入（需证据，不预先优化） |
| electron-builder 首次构建需要联网下载二进制 | 记录镜像与缓存；构建失败不影响后端与外壳的源码验收 |
| 未签名安装包触发 SmartScreen 警告 | AC-001-1 仍可完成安装；签名证书属于发布/商业化范畴【外部】，v1 不做 |
| 夹具结果被误当成真实业务 | §3.5 标题和日志标记；§8.1 证据分类；review 中单列"外部未取得" |
| 测试误用真实用户目录 | 所有 e2e 强制设置临时 `LOCALAPPDATA` 与 `FAI_SHELL_STATE_DIR`，并以 `SMOKE paths` 行核对实际路径（§8.3） |
| 新文件被 `.gitignore` 忽略而未入库 | 外壳模块放 `shell/src/`；Implement 每个任务提交前跑 `git status --short --ignored shell packaging` 确认新增文件未被忽略 |
| 页面（`file://`）对回环后端的带令牌 XHR 是否触发 CORS 预检未在 Plan 中核实（宿主无 CORS 处理；历史 T-06 记录称内置页能加载组织类型，但未经本轮复验） | `settings-sources` 与 `csp` 的正对照会直接暴露；若失败，Implement 停止并报回 Plan（是否给宿主加 CORS 属于安全面变更，需先改 plan 并经 A 复查），不得自行放宽 |
| 控制通道/钩子误入生产行为 | 仅 `FAI_TEST_HOOKS=1` 时加载 `src/test-hooks.js`；启用时标题与日志带标记；控制通道只在钩子启用时存在、只监听回环，不另设令牌 |
| （修订 4）第三方包把测试资产作为数据随包（实测 `pyarrow/tests`） | 仓库 hook 在收集源头排除（§7.5）；只处理已观测到的 pyarrow；重建后若出现其他第三方命中，停止并报回 Plan，不扩大排除、不放宽黑名单 |
| （修订 4）contrib hook 或 pyarrow 版本变化使仓库 hook 偏离 | `test_pyarrow_hook_matches_contrib_except_tests` 以已安装 contrib hook 为参照，偏离即失败；pyarrow 未在 `constraints.txt` 锁定、随环境进入产物——这是既有事实，本修正不改包版本 |
| （修订 4）PYZ 内可能经 `pyarrow.conftest` 的导入链带入 `pyarrow.tests` 纯模块（未核实） | 不在冻结的文件系统黑名单扫描范围内，也未被观测为失败；按 AGENTS §5.1 不做推测性加固，只登记为残余边界，交 A / Review 判断 |

**回滚**：本 feature 只改动 `backend/app/`、`backend/tools/{build_backend,shell_check}.py`、`backend/tools/pyinstaller_hooks/`（修订 4）、`backend/tests/test_app_*`、`shell/`、`packaging/`。回退这些文件即可回到 data-layer + settings 的状态，不影响用户数据。

**按 AGENTS §5.1 有意不做的事**：下列任何一项如果要做，都需要 Walter 先批准：

- IPC 发送方校验：只加载本地页面、导航受限、CSP 加请求白名单已经覆盖；
- 剥离 FastAPI 422 响应里回显的输入：内置页只发送字符串，没有可达的泄露路径；
- 用 Windows Job Object 托管子进程：stdin EOF 已满足 AC-003-3；
- 更新元数据签名、应用内下载与校验；
- 数据目录迁移；
- 日志加密；
- 偏好文件损坏时自动重置；
- 多窗口。
