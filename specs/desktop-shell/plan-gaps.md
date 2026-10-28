# desktop-shell 初步缺口报告（plan-gaps.md）

> **性质**：Plan 修订 2 期间写的只读发现记录，供独立 Checklist（A）和后续 Tasks 使用。它**不是**最终 Analyze 报告（最终 Analyze 要在新 tasks.md 写完之后，对 spec/plan/tasks 三者重新运行）。
>
> - **作者 / 通道**：claude-opus-5-5 via anthropic（bridge 的 seven_day 额度已耗尽，本窗口不再探活）。
> - **基线**：`8ba1b6a`。
> - **本文件不做的事**：不改 tasks.md、checklist.md、review.md、specs/README.md 或 docs/；不勾选任何框；不声称 Checklist、Analyze、Implement、Converge、Gate 2 已完成。
> - **历史进度的定位**：tasks.md 中 T-01～T-06 的 ✅ 只是阶段证据。实施时没有 checklist，且下文 A 类缺陷说明其中多条 AC 并未端到端成立。
>
> **状态注记（2026-10-28，Plan 修订 3 + Tasks 之后追加；以上与以下正文保留为历史记录，未改写）**
>
> - A 类（A-01～A-21）：全部已在 plan 修订 2/3 给出设计，并落到新 `tasks.md` 的纠偏/新增任务（对应关系见下表 G）；**均未实施**，只有 Implement 完成并复验后才算关闭。
> - E 类建议拆分已被新 `tasks.md` **取代**：路径 `shell/lib/` 一律改为 `shell/src/`（A 的 F-01：`.gitignore` 第 17 行 `lib/` 会忽略它）；`csp` 场景不再断言拦截计数（F-02）；任务进一步拆细并重排了依赖（路径接线与运行器先于单实例、生命周期场景）。E 表中的路径与命令仅供追溯，不得作为执行依据。
> - F 类（最终 Analyze 输入）：已由 `analyze.md` 执行，结论以该文件为准。
> - C 类仍为"无阻塞性需求问题"；D 类外部缺口不变。

## A. 可解决的契约 / 任务漂移（plan 修订 2 已给出设计，需落到新 tasks.md）

| # | 发现（源码证据） | 影响 AC | plan 落点 |
|---|---|---|---|
| A-01 | `app/main.py` 的 `Host.ready=True` 恒成立，`/health` 不探测数据服务；修订 1 还写了不存在的 `mcp_port` | AC-002-2 | §3.1.3 |
| A-02 | 修订 1 写"起 MCP"，源码没有；宿主持锁却不发布 `data/mcp_endpoint.json`，应用运行期间 `futureai-data` / `futureai-settings` 的只读命令会等到超时失败 | WO-13（Q-001、data-layer AC-004-6） | §3.1.5（恢复只读通道；MCP 工具不在本 feature） |
| A-03 | 修订 1 的端点表漏了 `GET /settings/sectors`、`PUT /settings/profile`、`DELETE /settings/key`；`/shutdown` 实际返回 200 而非 202 | 文档准确性 | §3.1.4 |
| A-04 | `preload.js` 只有 `backend()`，读的是窗口创建时的 `additionalArguments`，后端重启换端口后拿到旧值；修订 1 承诺的 `mode/apiBase/token/version/openExternal/showDiagnostics` 都没有 | AC-002-3/4、AC-008-1 | §3.3 |
| A-05 | `onBackendCrash` 中 `waitForReady()` 没有传参（沿用旧就绪参数，`readFileSync(undefined)` → 永远等到超时）；崩溃重启与 `handleNotReady` 并发；`spawn` 的 `error` 事件未处理；`mkdirSync` 没有异常处理 | AC-002-3、AC-007-2 | §4.2 |
| A-06 | 默认数据目录是 `path.join(userData,'FuturesAI')` = `%APPDATA%\futuresai-shell\FuturesAI`，与 spec §4 的 `%LOCALAPPDATA%/FuturesAI` 不符 | WO-04、AC-004-4 | §3.6、§5（开发期旧目录不迁移） |
| A-07 | 窗口要等后端就绪后才创建；失败时只弹 `showErrorBox` 然后 `app.quit()`，没有重试、日志、导出入口 | AC-001-2、AC-002-1、AC-002-3、AC-007-2 | §4.1 |
| A-08 | 外壳被强杀后后端成为孤儿进程继续持锁（`stdio[0]='ignore'`，后端无法感知父进程退出），下次启动报"占用"，AC-003-3 不成立；`check.js` 自己就用 `first.kill()` 制造了这种孤儿 | AC-003-3 | §3.1.1 stdin EOF |
| A-09 | 锁被占、不可写、磁盘满在外壳看来都只是"后端进程已退出"，而且还会被当成崩溃自动重启 | AC-004-2、AC-004-3、AC-007-4 | §3.1.2 标记行 + 退出码 3 |
| A-10 | **内置设置页把 `GET /settings/profile` 返回的遮蔽邮箱填进表单，原样 PUT 回去**；遮蔽值能通过 `_EMAIL_RE` 校验，会覆盖加密档案里的真实邮箱 | AC-005-4（以及 settings 档案正确性） | §3.1.4（入口拒绝含 `***` 的值）+ 渲染层不回写未修改的邮箱 |
| A-11 | `onboarding.js` 用 `innerHTML` 拼接后端字符串和档案字段 | AC-009-2 | §3.4 |
| A-12 | 打包后用 `path.resolve(__dirname,'..','frontend','dist')` 查前端，路径无意义；无法区分"有意不带前端"与"资源缺失" | AC-007-3、AC-002-4 | §4.1 第 7 步 + `app-config.frontend` |
| A-13 | 加载前端产物后没有任何途径进入内置设置；引导完成判定只在内置页内部做 | AC-005-1、AC-005-2、WO-05 | §4.1 第 6 步、§6 |
| A-14 | `shell_check.py` 的"打包产物启动并就绪"在健康检查从未成功时也判通过（`bool(info) and proc.poll() is None`） | AC-002-2 | §8.2 加强 |
| A-15 | tasks.md 引用的 `shell_check.py --backend-only` 参数不存在（会被忽略）；`npm run check:ui` 脚本不存在 | 验证命令 | §8.2 |
| A-16 | `check.js` 的单实例断言 `!second.out.includes('READY ') \|\| second.code === 0` 恒真；首个实例没用 `--smoke`，stdout 不输出日志，等待循环一定要等满 60 s；所有运行共用真实用户的 Electron `userData`（单实例锁和日志都落在真实用户目录） | AC-004-1 | §8.3 `FAI_SHELL_STATE_DIR` + 重写场景 |
| A-17 | `test_subprocess_listens_on_loopback_only` 在本机只有回环地址时会跳过断言 | AC-009-1 | §9 用 netstat 断言 |
| A-18 | `will-navigate` 会把任意非 `file:` 协议交给 `openExternal` | AC-009-3 | §3.4 只放行 http(s) |
| A-19 | 日志只追加不滚动；`host.json`（含令牌）写在数据目录根 | AC-010-1、WO-09 | §3.7、§4.2 |
| A-20 | 修订 1 的 §5 把多条 AC 合并成一行，由"人工清单"兜底，且引用的是 checklist.md 里的 M-ID（checklist 归审核员所有，不应承载人工步骤） | 覆盖完整性 | §9 逐条 + `manual-acceptance.md` |
| A-21 | settings 的 spec/plan/review 说 GUI 类 AC 由 "T-08" 承载，但 desktop-shell 的 T-08 是"故障处理与诊断"，引导/设置页在 T-06 | 跨 feature 引用 | 本 feature 不改 settings 文档；交协调者在集成时统一说明（settings 文件不在本次可写范围） |

## B. 已有答案的设计问题（从 docs/spec 推得，不需要问 Walter）

| # | 问题 | 依据与结论 |
|---|---|---|
| B-01 | 一个进程还是两个？ | Q-001：一个后端进程，外壳只管它 |
| B-02 | 本 feature 是否要在宿主里挂载 agent 用的 MCP 工具？ | spec 非目标"agent 能力本身（pi 集成、工具…）→ 后续 agent feature"；architecture §5.2 的 MCP 放在 Backend 进程内，由 agent feature 挂载。本 feature 只恢复 data-layer 的只读通道，保证不破坏既有契约 |
| B-03 | 卸载时删不删用户数据？ | AC-001-3 允许"保留或提示是否删除"；R-004 / Q-004 强调数据是用户资产 → 选**保留**，卸载器不提供删除选项 |
| B-04 | 通知是否违背 interaction.md §3.3 第 6 条"通知节制，不弹窗打断"？ | spec R-006 / Q-006 明确要求系统通知且可全局关闭；系统 toast 不是模态窗口，应用内不使用模态对话框做提醒 |
| B-05 | 更新是否应用内下载或自动安装？ | Q-005：只检查、提示，由用户确认；服务端后置 → 交给系统浏览器下载，显示 sha256 |
| B-06 | 更改数据目录是否迁移数据？ | Q-004 只要求"原目录不删除"，AC-004-4 只要求"在新目录就绪" → v1 不迁移；如果需要迁移，要另走 Clarify |
| B-07 | 关窗默认行为 | Q-003：默认最小化到托盘 |
| B-08 | 干净机器验收 | Q-009：v1 允许过渡验收；发布前必须补干净机验证（Windows Sandbox 可提供真实干净环境） |
| B-09 | 诊断包是否包含文档或知识库内容 | Q-010：不包含 → 白名单诊断 |
| B-10 | mock 模式何时启用 | Q-002 / AC-002-4：显式 `--mock`；后端失败**不**静默降级到 mock（否则违背 AC-002-1/AC-007-2 的"明示状态"） |

## C. 真正需要 Walter 回答的需求问题

**无阻塞性问题。** 现有 spec、Clarify 与 docs 已能回答全部设计分歧（见 B 类）。

以下两项不是问题，是**审批事项**：只有在 Walter 想做时才需要批准，计划默认不做（AGENTS §5.1）：

- plan §10 列出的"有意不做"清单；
- 如果 Walter 希望 v1 就做数据目录迁移或卸载时的删除选项，需要回 Clarify。

## D. 本阶段无法取得的外部集成 / 证据

| # | 项目 | 本阶段做法 | 何时补 |
|---|---|---|---|
| D-01 | `frontend-workbench` 构建产物（不在本 checkout） | 内置页 + `frontend-stub` 夹具证明 mock 契约；`build.ps1 -FrontendDist` 留好接口 | frontend-workbench 合入后 |
| D-02 | 作业引擎 / 真实作业事件 / 后端退出时停止接单（drain） | 测试事件夹具驱动**生产**归约器、托盘、通知、退出守卫；AC-003-2/3-4、AC-006-1/2/4 标注"夹具驱动" | workflow / `api` feature |
| D-03 | 前端采纳 `window.futuresai` 契约（`mode`、`getBackend()`） | plan §3.3 写明接口；前端侧不在本次范围 | frontend-workbench v2 |
| D-04 | 真实发布通道（更新源） | 默认 `feedUrl=null`；用 loopback 夹具源验证逻辑；"无真实通道"记为外部证据缺口，不能算失败 | Phase 3 商业化 |
| D-05 | 干净 Windows 机器 | Q-009 过渡；Windows Sandbox 若可用，可作为真实干净环境证据 | 发布前 |
| D-06 | 基准机器（spec §4 "沿用 frontend-workbench 基准"，基准定义不在本 checkout） | 记录 `startup_timing`；15 s 判定留给 M-02 | 基准机可用时 |
| D-07 | 真实 EIA key 与网络 | API 层测试在网络边界注入 `_probe`；M-14 人工 | 首个真实用户走查 |
| D-08 | 系统通知 / 托盘的真实观感 | 自动化只记录通知器调用；M-05～M-07 在安装版上人工确认 | Implement 后 |
| D-09 | 真实满盘 | 文件系统边界注入 ENOSPC；M-18 用小容量 VHD（可选，需要管理员权限） | 可选 |
| D-10 | 代码签名证书 | 不做（plan §10） | 商业化 |

## E. 建议的任务拆分（供 Tasks 阶段使用；本文件不改 tasks.md）

原则：

- 保留原有编号，大任务拆成 a/b/c；
- 对已标 ✅ 但 AC 未端到端成立的任务，追加纠偏任务 `T-0nb…`；
- 每个任务 0.5～2 h，完成标准引用 AC，验证命令写明 cwd。

| 任务 | 范围（文件） | 完成标准（AC） | 验证（cwd） | 估时 | 依赖 |
|---|---|---|---|---|---|
| T-01b 宿主启动分类与真实健康探测 | `backend/app/main.py`、`__main__.py`；`tests/test_app_health.py`；新增 `tests/test_app_startup_errors.py` | AC-002-2、AC-004-2、AC-004-3、AC-007-1、AC-007-4（启动期） | `cd backend && python -m pytest tests/test_app_health.py tests/test_app_startup_errors.py -q` | 2h | —— |
| T-02b stdin EOF 守护 | `backend/app/__main__.py`；`tests/test_app_lifecycle.py` | AC-003-3（后端侧）、AC-003-1 | `cd backend && python -m pytest tests/test_app_lifecycle.py -q` | 1h | T-01b |
| T-02c 内部只读通道 | `backend/app/main.py`、`__main__.py`；新增 `tests/test_app_channel.py` | WO-13；AC-003-1（端点文件清理） | `cd backend && python -m pytest tests/test_app_channel.py -q` | 1.5h | T-01b |
| T-03b 设置端点纠偏 | `backend/app/main.py`；`tests/test_app_settings_api.py`；新增 `tests/test_app_disk_full.py` | AC-005-4（拒绝遮蔽邮箱回写）、AC-007-4（507） | `cd backend && python -m pytest tests/test_app_settings_api.py tests/test_app_disk_full.py -q` | 1h | —— |
| T-04b 打包冒烟加强 | `backend/tools/shell_check.py`；`tests/test_app_health.py`（netstat） | AC-002-2、AC-009-1、AC-001-4（后端产物） | `cd backend && python tools/build_backend.py && python tools/shell_check.py` | 1h | T-01b、T-02c |
| T-05b 路径与偏好模块 | `shell/lib/paths.js`、`lib/prefs.js`；`test/prefs.test.js`；`package.json`（`test:unit`） | WO-04、AC-004-4（逻辑）、AC-004-3（探测） | `cd shell && npm ci && npm run test:unit` | 1.5h | —— |
| T-05c 后端生命周期状态机 | `shell/lib/backend.js`、`main.js` | AC-002-2、AC-002-3、AC-003-1、AC-007-1、AC-007-2 | `cd shell && npm run check -- ready-quit crash-restart restart-limit timeout` | 2h | T-01b、T-02b、T-05b、T-05d |
| T-05d e2e 运行器与假后端夹具 | `shell/check.js`、`test/e2e/*`、`test/fixtures/fake_backend.py` | AC-004-1 场景重写；为 T-05c 及之后的任务提供基础设施 | `cd shell && npm run check -- single-instance` | 1.5h | T-05b |
| T-05e 启动/错误页、preload、目标页选择、mock | `shell/renderer/startup.*`、`preload.js`、`main.js`；`test/fixtures/frontend-stub/` | AC-001-2、AC-002-1、AC-002-4、AC-007-3、AC-004-2/3（界面）、WO-01 | `cd shell && npm run check -- startup-visible mock frontend-missing root-locked root-unwritable` | 2h | T-05c |
| T-05f 强杀自愈 e2e | `shell/test/e2e/kill-shell-recover.js` | AC-003-3 | `cd shell && npm run check -- kill-shell-recover` | 0.5h | T-02b、T-05c |
| T-06b 内置页纠偏 | `shell/renderer/onboarding.*` | AC-005-1～4、AC-009-2（textContent）、WO-05 | `cd shell && npm run check -- onboarding onboarding-skip settings-sources ui-masking` | 1.5h | T-03b、T-05e |
| T-07a 活动归约器 + 事件夹具来源 | `shell/lib/activity.js`、`test/activity.test.js`、`main.js`（夹具来源） | AC-003-4（逻辑）、AC-006-2（逻辑）、WO-06 | `cd shell && npm run test:unit` | 1.5h | T-05b |
| T-07b 托盘、关窗、退出守卫、通知 | `shell/main.js` | AC-003-2、AC-003-4、AC-006-1～4、WO-07 | `cd shell && npm run check -- close-to-tray close-quit quit-guard-cancel quit-guard-wait notify notify-off tray-menu` | 2h | T-07a、T-05e |
| T-07c 设置"应用"区（偏好与数据目录） | `shell/renderer/onboarding.*`、`main.js`（IPC） | AC-004-4、AC-006-3（入口） | `cd shell && npm run check -- change-root notify-off` | 1.5h | T-05b、T-06b |
| T-08a 滚动日志 + 后端日志捕获 + 崩溃现场 | `shell/lib/logger.js`、`main.js`；`test/logger.test.js` | AC-010-1、AC-010-3 | `cd shell && npm run test:unit && npm run check -- crash-record` | 1.5h | T-05c |
| T-08b 脱敏 + 诊断包 + 导出入口 + 阳性哨兵 | `shell/lib/redact.js`、`lib/diagnostics.js`、`main.js`；`test/{redact,diagnostics}.test.js`、`test/e2e/diagnostics-privacy.js` | AC-002-3（导出入口）、AC-005-4、AC-009-4、AC-010-2、WO-09、WO-11 | `cd shell && npm run test:unit && npm run check -- diagnostics-privacy` | 2h | T-08a |
| T-08c 渲染层安全 | `shell/main.js` | AC-009-2、AC-009-3、WO-10 | `cd shell && npm run check -- csp external-link` | 1h | T-05e |
| T-08d 磁盘满界面路径 | `shell/main.js`、`renderer/*`、单测 | AC-007-4 | `cd shell && npm run test:unit && npm run check -- startup-disk-full` | 1h | T-08a、T-03b |
| T-09a 更新模块 | `shell/lib/update.js`、`test/update.test.js` | AC-008-2/3（逻辑）、WO-08（展示 sha256） | `cd shell && npm run test:unit` | 1.5h | T-05b |
| T-09b 关于页与更新提示 | `shell/renderer/onboarding.*`、`main.js` | AC-008-1、AC-008-2、AC-008-3 | `cd shell && npm run check -- about update-available update-offline` | 1.5h | T-09a、T-07c |
| T-10a 构建配置 | `shell/electron-builder.config.js`、`installer/installer.nsh`、`package.json` / `package-lock.json`（精确锁版本） | AC-001-3、AC-001-4 | `cd shell && npm ci && npm run dist` | 1.5h | T-05e |
| T-10b `build.ps1` + 包扫描 + 校验和 | `packaging/build.ps1`、`shell/tools/scan-package.js` | AC-001-4、WO-08 | `powershell -ExecutionPolicy Bypass -File packaging/build.ps1`（仓库根目录） | 2h | T-04b、T-10a |
| T-10c 打包产物冒烟 + 人工验收执行记录 | `shell/test/e2e/packaged-ready.js`；把执行结果写进 review.md（由 Handoff 角色写） | AC-001-1、AC-001-2、AC-001-3（含人工 M-01～M-04） | `cd shell && npm run check -- packaged-ready` + M-01～M-04 | 1～2h | T-10b |

Implement 阶段按 AGENTS §6 使用 `openai/gpt-6-astra`（Walter 指示：T-07～T-10 进 Implement 时换到该模型；纠偏任务 T-0nb 同样属于 Implement）。

## G. A 类 → 新 tasks.md 落点（状态注记）

| 发现 | 新任务 | 状态 |
|---|---|---|
| A-01 | T-01b | 未实施 |
| A-02 | T-02c | 未实施 |
| A-03 | 文档已改（plan §3.1.4） | 已关闭（文档） |
| A-04 | T-05j（preload 新契约）、T-07d/T-08d/T-09b/T-09c（其余成员） | 未实施 |
| A-05 | T-05g、T-05h、T-05c（`mkdirSync` → 可写探测） | 未实施 |
| A-06 | T-05b、T-05c | 未实施 |
| A-07 | T-05j、T-05k | 未实施 |
| A-08 | T-02b、T-05h、T-05i | 未实施 |
| A-09 | T-01c、T-01d、T-05k | 未实施 |
| A-10 | T-03b、T-06b | 未实施 |
| A-11 | T-06b | 未实施 |
| A-12 | T-05l | 未实施 |
| A-13 | T-06c、T-07b | 未实施 |
| A-14 | T-04b | 未实施 |
| A-15 | tasks.md 不再使用这两个命令（标为已退役） | 已关闭（文档） |
| A-16 | T-05c（bootstrap）、T-05d（运行器）、T-05m（假后端）、T-05e、T-05f（迭代 3 后拆分） | 未实施 |
| A-17 | T-04b | 未实施 |
| A-18 | T-08e | 未实施 |
| A-19 | T-08a、T-08b（滚动日志）、T-05h（`host.json` 移到状态目录 `run/`） | 未实施 |
| A-20 | plan §9 逐条 + `manual-acceptance.md` | 已关闭（文档） |
| A-21 | 协调者已在 `review.md` 说明 | 已关闭（文档，协调者负责） |
| A-22（Analyze 迭代 5 追加：内置页 EIA 预填用遮蔽档案自拼字段，未复用 settings 核心 `prepare` / `registration_hint`，AC-005-3） | T-03c、T-06d | 未实施 |

## F. 最终 Analyze 的输入（新 tasks.md 写完后执行）

1. 38 条 AC + WO-01～WO-13 在新 tasks.md 中都有任务承载，且完成标准引用了 AC 编号。
2. 每条验证命令都存在、cwd 正确、能对应到 plan §8.2 的"现有/待新增"标注；不再引用 `check:ui` 或 `--backend-only`。
3. 每个任务不超过 2 h；依赖之间无环。
4. 标为"夹具驱动"或"外部"的 AC，在 tasks 的完成标准里没有被写成"真实业务已验证"。
5. 手工步骤只引用 `manual-acceptance.md` 的 M-ID，不引用 checklist.md。
6. plan §10 的"有意不做"项没有混入 tasks。
7. 跨 feature 引用（A-21：settings 的 "T-08"）已由协调者处理或在 review 中记录。
8. 旧 tasks.md 进度表中的 ✅ 已改为"阶段证据，待纠偏任务完成后复验"，由 Tasks 阶段改写，不在本文件中修改。
