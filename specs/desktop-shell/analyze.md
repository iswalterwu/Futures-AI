# desktop-shell Analyze 报告（analyze.md）

> AGENTS §2 第 7 步 Analyze：**只读**比对 spec / plan / tasks（+ checklist 状态、manual-acceptance、docs）。本报告不改源码、spec、plan、tasks；发现问题时先记录本轮结论，再切换到 Plan/Tasks 修补，修补后重新运行新一轮 Analyze。
>
> - **作者 / 通道**：`anthropic/claude-opus-5-5`（`claude-bridge` seven_day 额度在当前窗口已确认耗尽，不重试；官方通道最小真实调用成功）。协调 = `openai/gpt-6.1-sol`（不是作者）。
> - **日期**：2026-10-28
> - **固定源码基线**：`8ba1b6a304f916e3d57ebdd6b89790b75a15f14c`（分支 `plan/desktop-shell-resume`）。
> - **未提交工作副本（overlay）**：`specs/README.md`、`spec.md`（仅页首 Gate 1 元数据 1 行）、`review.md`（协调者所有）、`plan.md`（修订 3）、`tasks.md`（重写）、`plan-gaps.md`、`manual-acceptance.md`、`checklist.md`（A 所有，只读）、`checklist-review-request.md`、本文件。`git diff --stat 8ba1b6a -- backend/ shell/ packaging/ docs/ .gitignore` 为空：**源码与 docs 无改动**。
> - **本报告不声称**：代码正确、任何测试已运行或通过、Converge、Review、Gate 2、Implement 已开始或完成。

---

## 迭代 1（Plan 修订 3 + 新 tasks.md 初稿之后）

### 1. 检查的产物

`AGENTS.md`；`docs/plan.md`、`docs/architecture.md`（§1 存储图、§2、§4.4、§5.2、§9）、`docs/interaction.md` §3.3、`docs/designUI.md` §3.1、`docs/decisions/20261026-desktop-shell.md`；`specs/desktop-shell/{spec,plan,tasks,checklist,plan-gaps,manual-acceptance,checklist-review-request,review}.md`；`templates/{plan,tasks}.md`；源码只读核对：`shell/{main,preload,check}.js`、`shell/package.json`、`shell/package-lock.json`（electron 33.4.11）、`backend/app/{main,__main__}.py`、`backend/tools/shell_check.py`、`backend/tests/test_app_*.py`、`backend/data/{lock,mcp_server,service}.py`、`backend/data/cli.py`、`.gitignore`。

### 2. 实际执行的检查（只有文档/静态检查）

| 检查 | 方法 | 结果 |
|---|---|---|
| spec 冻结 | `git diff 8ba1b6a -- specs/desktop-shell/spec.md` | 只有页首 Gate 1 元数据 1 行 |
| AC 计数 | 正则抽取 spec `AC-0xx-y` | 39 个编号，其中 `AC-003-5` 出现在 spec §4 指 **settings** 的 AC，本 feature AC = **38**（R-001～R-010：4+4+4+4+4+4+4+3+4+3） |
| AC/WO → 任务完成标准 | 脚本按任务"完成标准"段落匹配 | 38 AC 全部至少 1 个任务；WO-01～WO-13 除 WO-03 外均有任务；WO-03 在 tasks"不在本 feature 任务内"段以现有回归命令承载（有意，无新代码） |
| 估时 | 脚本 | 38 个任务全部 0.5～2h；执行顺序表与任务体估时一致；合计 54.5h |
| 依赖 | 脚本核对顺序表依赖都在前、任务体"依赖"与顺序表一致 | 无环、无前向依赖 |
| M-ID | 脚本 | tasks 引用的 M-ID 都存在于 manual-acceptance（26 个）；M-10、M-16 只在批次表的区间里出现，未在对应任务验证中点名 |
| e2e 场景 | 脚本：tasks 中运行的场景 ⊆ tasks 中创建的场景文件；与 plan e2e 名称对照 | 35 个场景，全部有创建任务；plan 中的 e2e 名称全部在 tasks；`events-invalid` 在 plan §8.3 自检段定义 |
| 已退役命令 / 路径 | 在任务体中搜索 `check:ui`、`--backend-only`、`npm run smoke`、`shell/lib`、`lib/` | 任务体无命中（只在页首"已退役"说明与历史表中作为历史文本出现） |
| `.gitignore` | `git check-ignore --no-index` 对计划新增路径 | `shell/src/*`、`shell/test/**`、`shell/renderer/startup.js`、`shell/tools/`、`shell/installer/`、`shell/electron-builder.config.js`、`packaging/build.ps1`、3 个新 pytest 文件均不被忽略；`shell/lib/*` 被第 17 行忽略（已弃用该路径） |
| 工具存在性 | `command -v` / 版本 | `python` 3.14.2、`node` v25.2.1、`npm`、`powershell`、`icacls`、`netstat`、`taskkill`、`git` 存在；**`tar` 在 git-bash PATH 上解析为 `/usr/bin/tar`（GNU tar 1.35，不能解 ZIP）**，Windows `C:\Windows\System32\tar.exe` 为 bsdtar 3.8.9（可解 ZIP） |
| Electron 运行时 Node | 本工作树无 `node_modules`，无法读取 | 未核实；plan 已改为不依赖 `zlib.crc32`，并要求 e2e 快照记录 `versions.node` |

### 3. 发现

| # | 级别 | 位置 | 证据 | 处置 |
|---|---|---|---|---|
| AN1-01 | **P2** | plan §9 AC-009-4 / AC-010-2、§8.3；tasks T-08d | 计划写"系统 `tar.exe -xf`"但未写绝对路径；在本机 git-bash 环境 `tar` 解析为 GNU tar 1.35，无法解压 ZIP → `diagnostics-privacy` 会因工具而非产品失败，或诱使实施者改用别的解压方式而丢掉"bsdtar 校验 CRC"这一运行时证据 | Plan/Tasks 修补：统一写 `%SystemRoot%\System32\tar.exe`（运行器声明为必需工具，缺失即 FAIL） |
| AN1-02 | P3 | tasks T-05k（AC-004-2）、T-05i（AC-002-3）、T-04b（AC-009-1） | plan §9 给这些 AC 配了 M-10、M-16、M-26，但对应任务的验证只在批次表区间里体现 | Tasks 修补：在任务验证中点名 M-ID |
| AN1-03 | P3 | tasks T-05h `health-fail` | 未设置 `FAI_HEALTH_TIMEOUT_MS`，默认 30 s，场景慢且与 `timeout` 场景写法不一致 | Tasks 修补：写明 `FAI_HEALTH_TIMEOUT_MS=3000` |
| AN1-04 | P3 | `checklist-review-request.md` | 仍描述"tasks.md 为旧版草稿、新 tasks 待写"，与当前产物不符 | 修补：改写为 Tasks/Analyze 复查请求 |
| AN1-05 | P3（接受） | tasks T-05c | 主进程路径接线的运行时验收由 T-05e `harness-selftest` 关闭（前向闭合，非循环），任务体已写明"T-05e 通过前不得标完成" | 接受，不改 |
| AN1-06 | P3（接受，测试缺口） | tasks T-05d 规则 2 | 运行器"登记表不一致 / 零断言 → FAIL / 无复合布尔断言"没有自动化负向用例，只能 Review 代码审阅 | 接受；Review 须核对（列入风险） |
| AN1-07 | P3（接受，测试缺口） | tasks T-08f | 后端 507 在设置页的渲染没有自动化（假后端不实现设置端点，真实后端无法在 e2e 中造满盘）；只有 pytest（507）+ 人工 M-18（可选） | 接受；Handoff 时如实记录 |

**结论（迭代 1）**：**文档一致性未通过**（AN1-01 P2）。切换到 Plan/Tasks 修补（AN1-01～AN1-04），修补后运行迭代 2。

### 迭代 1 之后的修补（Plan/Tasks 模式，非 Analyze）

| 发现 | 修补 |
|---|---|
| AN1-01 | plan §8.3 运行器工具声明、§9 AC-009-4 / AC-010-2、§0 F-03 行，tasks T-08d：统一为 `%SystemRoot%\System32\tar.exe`（bsdtar），并说明 PATH 上可能是 GNU tar |
| AN1-02 | tasks T-04b 点名 M-26、T-05i 点名 M-16、T-05k 点名 M-10 / M-11 |
| AN1-03 | tasks T-05h `health-fail` 写明 `FAI_HEALTH_TIMEOUT_MS=3000` |
| AN1-04 | `checklist-review-request.md` 改写为 Tasks/Analyze 复查请求（无虚构的集成提交） |

---

## 迭代 2（修补后重新读取 spec / plan / tasks / manual / checklist 状态）

### 1. 重新执行的检查

迭代 1 第 2 节全部检查重跑（同一脚本 + 人工通读 plan §0/§3.4～§3.8/§8/§9/§10 与 tasks 全文）：38 AC 与 WO 覆盖不变；38 个任务均 0.5～2h、合计 54.5h；依赖无前向/无环；26 个 M-ID 全部被至少一个任务或批次点名，tasks 引用的 M-ID 都存在；35 个 e2e 场景都有创建任务，plan e2e 名称全部在 tasks；任务体无已退役命令与 `shell/lib` 路径；`tar.exe` 引用全部为 `%SystemRoot%\System32\tar.exe`；源码/docs/.gitignore 相对基线无改动；`checklist.md` 未被作者改动（A 所有）。

### 2. 覆盖矩阵：AC → 任务 → 验证（全部"待新增"，未运行）→ 人工 → 诚实状态

| AC | 任务 | 自动验证（命令见各任务） | 人工 | 诚实状态 / 外部 |
|---|---|---|---|---|
| AC-001-1 | T-10c、T-10d | `build.ps1` 全流程；e2e `packaged-ready` | M-01 | 受测机为 Q-009 过渡证据；干净机【外部】 |
| AC-001-2 | T-05j、T-10d | e2e `startup-visible`、`packaged-ready` | M-02 | 15 s 只在基准机判定【外部】 |
| AC-001-3 | T-10a | 配置审阅（NSIS 选项、`installer.nsh`） | M-03 | 仅人工（以实际安装目录为准） |
| AC-001-4 | T-04b、T-10a、T-10b、T-10c | `shell_check.py` 黑名单；`scan-package.test.js`；`scan-package.js dist/win-unpacked` | M-04 | 可自动化 |
| AC-002-1 | T-05j | e2e `startup-visible` | M-02 | 可自动化 |
| AC-002-2 | T-01b、T-04b、T-05g、T-05h | pytest `TestHealth::*503*`；`backend.test.js`；e2e `health-fail`；`shell_check.py` | — | 可自动化 |
| AC-002-3 | T-05g、T-05i、T-05j、T-08d | `backend.test.js`；e2e `crash-restart`、`restart-limit`（页面 + 导出） | M-16 | 可自动化 |
| AC-002-4 | T-05l | e2e `mock` | — | 真实前端 mock 集成【外部】 |
| AC-003-1 | T-02b、T-02c、T-05h | pytest `TestStdinEof`、`test_endpoint_file_removed_after_shutdown`；e2e `ready-quit` | — | 可自动化 |
| AC-003-2 | T-07c | e2e `quit-guard-cancel` | M-08 | 夹具驱动；真实作业【外部】 |
| AC-003-3 | T-02b、T-05i | pytest `TestStdinEof`、`test_stale_lock_recovered_after_hard_kill`（现有）；e2e `kill-shell-recover` | M-24 | 可自动化 |
| AC-003-4 | T-07a、T-07c | `activity.test.js`；e2e `quit-guard-wait` | M-08 | 仅外壳侧语义；后端 drain【外部】 |
| AC-004-1 | T-05f（基础 T-05d/T-05e；WO-13 关联 T-02c） | e2e `single-instance` | M-09 | 后端唯一性可自动化；真实前台聚焦仅 M-09 |
| AC-004-2 | T-01c、T-05k | pytest `test_locked_root_exits_3_with_marker`；e2e `root-locked` | M-10 | 可自动化 |
| AC-004-3 | T-01c、T-05b、T-05c、T-05k | pytest `test_unwritable_root_exits_3_with_marker`；`prefs.test.js`；e2e `root-unwritable` | M-11 | 只读盘人工 |
| AC-004-4 | T-05b、T-07d | `prefs.test.js`；e2e `change-root` | M-12 | "立即重启"仅人工 |
| AC-005-1 | T-06c | e2e `onboarding`；pytest `TestOnboardState`（现有） | M-13 | 可自动化 |
| AC-005-2 | T-06c | e2e `onboarding-skip` | M-13 | 可自动化 |
| AC-005-3 | T-06b | e2e `settings-sources`；pytest `TestKeyWizard`/`TestSources`/`TestClearKey`（现有） | M-14 | 真实 key【外部】 |
| AC-005-4 | T-03b、T-06b、T-08d | pytest `test_masked_email_rejected_422_without_writing`；e2e `ui-masking`、`diagnostics-privacy` | M-15 | 可自动化 |
| AC-006-1 | T-07b | e2e `close-to-tray` | M-05 | 夹具驱动；托盘观感人工 |
| AC-006-2 | T-07a、T-07e | `activity.test.js`；e2e `notify` | M-06 | 系统 toast 仅安装版人工 |
| AC-006-3 | T-07a、T-07d、T-07e | `activity.test.js`；e2e `notify-off`（含设置页开关） | M-06 | 同上 |
| AC-006-4 | T-07b（导出项 T-08d） | e2e `tray-menu` | M-07 | 子菜单内容由夹具驱动 |
| AC-007-1 | T-01d | pytest `test_two_hosts_get_distinct_ports`、`test_explicit_busy_port_exits_3_port_in_use` | — | 可自动化 |
| AC-007-2 | T-05g、T-05j | `backend.test.js`；e2e `timeout` | — | 可自动化 |
| AC-007-3 | T-05l | e2e `frontend-missing` | M-17 | 可自动化 |
| AC-007-4 | T-01c、T-03b、T-05k、T-08a、T-08c、T-08f | pytest `test_enospc_classified_disk_full`、`test_app_disk_full.py`；`logger`/`diagnostics`/`prefs` 单测；e2e `startup-disk-full` | M-18（可选） | 507 界面渲染无自动化（AN1-07）；真实满盘人工 |
| AC-008-1 | T-09b | e2e `about` | M-19 | 可自动化 |
| AC-008-2 | T-09a、T-09c（WO-08 关联 T-10c） | `update.test.js`；e2e `update-available` | M-20 | 夹具源；真实发布通道【外部】 |
| AC-008-3 | T-09a、T-09c | `update.test.js`；e2e `update-offline` | M-21 | 可自动化 |
| AC-009-1 | T-04b | pytest `test_listening_sockets_of_pid_are_loopback_only`；`shell_check.py` netstat | M-26（可选） | 可自动化 |
| AC-009-2 | T-06b、T-08e | e2e `csp`（远程命中 = 0 + 正对照）；静态 `rg innerHTML` | — | 可自动化；不需外网 |
| AC-009-3 | T-08e | e2e `external-link` | M-22 | 真实浏览器打开人工 |
| AC-009-4 | T-08a、T-08c、T-08d | `redact.test.js`、`diagnostics.test.js`；e2e `diagnostics-privacy`（阳性哨兵） | M-23 | 可自动化 |
| AC-010-1 | T-08a、T-08b | `logger.test.js`；e2e `crash-record`（日志位置） | — | 可自动化 |
| AC-010-2 | T-08c、T-08d | `diagnostics.test.js`（CRC 向量）；e2e `diagnostics-privacy`（真实 Electron + bsdtar） | M-23 | 单测不证明 Electron 运行时 |
| AC-010-3 | T-08b | e2e `crash-record` | M-24 | 可自动化 |

| WO | 任务（最近 AC） | 验证 | 人工 |
|---|---|---|---|
| WO-01 非首次直接进工作台 | T-06c（AC-005-1） | e2e `onboarding` 第二次运行 | M-13 |
| WO-02 退出提示"等待完成" | T-07c（AC-003-2） | e2e `quit-guard-wait` | M-08 |
| WO-03 未完成批次按既有约定 | 无新任务（AC-003-3 相关，data-layer 既有） | 现有 `tests/test_store.py`、`tests/test_review_round20.py`（T-04b 全量回归） | — |
| WO-04 默认数据目录 | T-05b、T-05c、T-05e（AC-004-4） | `paths.test.js`；e2e `harness-selftest` / `change-root` | — |
| WO-05 设置常驻可达 | T-06c、T-07b（AC-005-2） | e2e `onboarding-skip`、`tray-menu` | M-07、M-13 |
| WO-06 其余三类通知 + 托盘错误态 | T-07a、T-07e（AC-006-2） | `activity.test.js`；e2e `crash-restart` | M-16 |
| WO-07 关窗可改为退出 | T-07b（AC-006-1） | e2e `close-quit` | — |
| WO-08 完整性可校验 | T-09a、T-10c（AC-008-2） | `update.test.js`；`build.ps1` → `SHA256SUMS.txt` | M-25 |
| WO-09 令牌只对本机可见 | T-08d（AC-009-4）；`host.json` 移至状态目录 T-05h | e2e `diagnostics-privacy` 令牌扫描；e2e `ready-quit`（`run/host.json` 已删） | — |
| WO-10 不外发 | T-08e（AC-009-2） | e2e `csp`；静态出站点核查 | M-26（可选） |
| WO-11 诊断含进程状态 | T-08d（AC-010-2） | e2e `diagnostics-privacy`（`process.json`） | M-23 |
| WO-12 未就绪可重试 | T-05j（AC-007-2） | e2e `timeout` | — |
| WO-13 数据服务与只读通道在后端内 | T-02c（AC-004-1；Q-001） | pytest `test_app_channel.py` | — |

### 3. 依赖、粒度、cwd、工具

- **依赖**：执行顺序表 38 行，每个依赖都在前；关键实际顺序已满足——路径/状态目录接线（T-05c）先于隔离 e2e；运行器与假后端（T-05d）、测试钩子与自检（T-05e）先于所有场景；`harness-selftest` 只依赖现有就绪流程与假后端，不依赖状态机（T-05g/h），无循环验收；stdin EOF（T-02b）先于 `kill-shell-recover`；只读通道（T-02c）先于 `ready-quit` 的 `mcp_endpoint.json` 断言；诊断模块（T-08c）先于导出入口（T-08d）；白名单（T-08e）先于更新分区验证（T-09c）。
- **粒度**：38 个任务 0.5～2h（2h 的有 T-01c、T-05e、T-05g、T-05j、T-08d，均为单一模块/页面 + 2～3 个场景）；人工批次单列，非 Implement 任务。
- **cwd**：后端命令均 `cd backend`；外壳命令均 `cd shell`；`build.ps1` 在仓库根目录；与 plan §8.2 一致。
- **工具**：`python`、`node`（构建机 v25.2.1）、`npm`、`powershell`、`icacls`、`netstat`、`taskkill`、`%SystemRoot%\System32\tar.exe`（bsdtar 3.8.9）在本机存在；`electron`（lockfile 33.4.11）与 `electron-builder` 在本工作树未安装（`node_modules` 不存在），属 Implement 期 `npm ci` / 新增 devDependency 的范围。

### 4. 风险与测试缺口（不是文档不一致）

| # | 内容 | 处置 |
|---|---|---|
| R-1 | `file://` 页面对回环后端的带令牌 XHR 是否需要 CORS 预检未核实（宿主无 CORS 处理；历史 T-06 记录未复验） | plan §10 停止规则：`settings-sources` / `csp` 正对照失败即停并报回 Plan，不自行放宽 |
| R-2 | Electron 33.4.11 内嵌 Node 版本、`ses.fetch`、`webRequest.resourceType` 取值未在本工作树核实 | 设计已避开 `zlib.crc32`；其余以真实 Electron e2e（快照 `versions.node`、`update-available`、`csp` 正对照）为唯一证据 |
| R-3 | AN1-05：T-05c 运行时验收由 T-05e 关闭 | 已写明，接受 |
| R-4 | AN1-06：运行器负向规则无自动化 | Review 核对 `check.js` |
| R-5 | AN1-07：507 界面渲染无自动化 | 人工 M-18（可选）；Handoff 如实记录 |
| R-6 | T-10c 版本不一致失败分支不人为制造 | 代码审阅核对 |

### 5. 分类发现（迭代 2）

| # | 级别 | 内容 | 处置 |
|---|---|---|---|
| — | P1 | 无 | — |
| — | P2 | 无（AN1-01 已修补并复核） | — |
| AN2-01 | P3 | 迭代 1 的 AN1-05～AN1-07 保留为已接受的测试缺口/前向闭合（见第 4 节 R-3～R-5） | 接受；Review/Handoff 跟踪 |

**外部验收证据（本阶段无法取得，不是文档不一致）**：干净机安装与卸载、基准机 15 s、真实系统通知/托盘观感、真实作业引擎与后端 drain、真实 `frontend-workbench` 产物及 `window.futuresai` 采纳、agent、真实发布通道、真实 EIA key、真实满盘、代码签名（plan-gaps D-01～D-10）。任何 Handoff 记录都不得把夹具结果写成这些已通过。

**缺少的审核批准（不是文档不一致）**：A 尚未复查修订 3、新 tasks.md 与本报告；`checklist.md` 当前 30/41，未勾选项含 C-08b、C-14b、C-21、C-22、C-23（作者已按 F-03～F-07、F-01、F-02 修补，待 A 判定）及 Tasks/Analyze 对齐项 C-28～C-31 与模板两项。作者不勾选任何项。

### 6. 正式结论

- **文档一致性通过**（迭代 2）：spec（冻结）/ plan 修订 3 / tasks 之间未发现遗留的 P1/P2 冲突、差距或歧义；38 AC 与 13 WO 均有任务与验证映射；迭代 1 的未通过结论如实保留于上文。
- 本结论只针对文档一致性，**不**代表代码正确、测试通过、Converge、Review 或 Gate 2。

### 7. Implement 前置条件

1. 审核员 A（`anthropic/claude-fable-5-1`，新开独立会话）完成复查，`checklist.md` **全部复选框勾选**；Astra 会话开始实施前重新读取全文确认。A 若提出新的 P1/P2，回到 Plan/Tasks 修补并重新运行 Analyze。
2. 工程批准：作者判断**无**需要 AGENTS §5.1 单独批准的新增复杂度（plan §10 列出的扩展项均不做，未声称已批准）。唯一待 A 判断的是测试专用控制通道的随机令牌（仅 `FAI_TEST_HOOKS=1`、只监听回环）；若 A 或 Walter 认为属于需报批的安全复杂度，按其意见保留或删除，**在此之前视为未批准**。
3. 无需回 Clarify / Gate 1 的发现；无需新立 ADR（`src/` 目录名、`log/` 目录名、测试钩子均为 plan 层实现细节，与 docs/ADR 一致）。

---

## 迭代 3（协调者 `openai/gpt-6.1-sol` 的静态 Analyze 发现；记录为本报告的一轮，结论：未通过）

迭代 2 的"通过"是在下列问题被发现之前作出的；迭代 2 的脚本只检查了集合包含与文本拓扑顺序，**没有**检查"完成标准是否能在本任务内独立验收"、"早期命令是否需要后期产物"以及"每个任务块的每条完成标准是否引用 AC"。以下发现由协调者提出，作者独立核对后全部成立：

| # | 级别 | 位置 | 发现 | 核对结果 |
|---|---|---|---|---|
| AN3-01 | **P2** | tasks T-05c / T-05e | T-05c 依赖 T-05b、T-05e 依赖 T-05c，而 T-05c 写"T-05e 通过前本任务不得标完成"——按序执行时构成完成循环；迭代 2 把它当作已接受的 P3（AN1-05）是错误的 | 成立 |
| AN3-02 | P2 | tasks T-07d / T-07e | T-07d 的"通知开关写入偏好"只由后序 T-07e `notify-off` 验证 | 成立 |
| AN3-03 | **P2** | tasks T-10a～T-10c；plan §9 AC-001-3/4 | T-10a 要求 `npm run dist` 生成安装包，但 `extraResources` 需要的 `dist/staging/app-config.json` 只在 T-10c `build.ps1` 第 5 步生成，而 T-10c 依赖 T-10b、T-10b 依赖 T-10a；T-10b 还要求扫描 T-10c 才会生成的 `dist/win-unpacked` | 成立（打包自举循环） |
| AN3-04 | P2 | tasks T-05d、T-05e（及逐条检查） | T-05e 只有 WO-04、无 AC 编号；T-05d 写"不对应 AC"；运行器负向规则推迟到 Review 代码审阅（迭代 1 的 AN1-06 被错误地接受）。逐条检查另发现 T-01c 第 4 条、T-07a 第 3 条无 AC 编号 | 成立 |
| AN3-05 | P2 | plan §8.3、analyze 迭代 2 §7 | 新增的测试控制通道随机令牌是未被要求的安全机制，并把"是否需 §5.1 批准"交给 A 判断——A 不能授予 Walter 的工程批准 | 成立 |
| AN3-06 | P3 | plan 页首、tasks 页首/进度、analyze | 写死"当前 A 为 30/41"等实时状态，A 复查后即失真 | 成立 |

**结论（迭代 3）**：**文档一致性未通过**。切换到 Plan/Tasks 修补。

### 迭代 3 之后的修补（Plan/Tasks 模式，非 Analyze）

| 发现 | 修补 |
|---|---|
| AN3-01 | plan §3.2/§4.1：启动引导成为生产函数 `src/paths.js` 的 `bootstrap(app, env)`（setPath → 单实例锁 → 偏好/数据目录/探测），`main.js` 第一步调用。tasks T-05c 改为 1.5h，新增 `test/unit/bootstrap.test.js`（只在 Electron 边界注入记录型 `app`）断言调用顺序、未拿锁不碰数据目录、目录解析与探测，加静态核查 `main.js` 只经 `bootstrap` 调用；T-05e `harness-selftest` 改为集成复验，不是 T-05c 完成前提 |
| AN3-02 | tasks T-07d（2h）新增 e2e `prefs-ui`：设置页点击后 `shell-prefs.json` 持久化 `notifications=false` 与 `closeBehavior`、再次启动回显、非法 patch 被拒；T-07e `notify-off` 改为预置偏好文件只证明抑制效果。plan §9 AC-006-3 同步 |
| AN3-03 | T-10a 仅配置，`test/unit/builder-config.test.js` 读取真实配置与 `installer.nsh` 自证，不运行 `dist`；T-10b 只用临时目录正/负夹具验收扫描器；T-10c（2h）`build.ps1` 第 5 步生成 staging 配置后第 6 步**首次** `npm run dist`、第 7 步扫描真实 `dist/win-unpacked`，验证中单独复跑扫描并挂 M-03/M-04/M-25。plan §8.2 `dist` 行、§9 AC-001-3/4 同步 |
| AN3-04 | 逐任务补 AC：T-05d、T-05m、T-05e 写"最近 AC"并声明不证明产品 AC；T-01c 第 4 条、T-07a 第 3 条补 AC。运行器规则由新 `test/unit/check-runner.test.js` 直接验证（子进程运行真实 `check.js`，`FAI_CHECK_E2E_DIR` 指向 `test/fixtures/runner/*` 夹具：未知名称、登记表不一致、零断言、缺工具、正常通过、临时目录清理与越界路径）；假后端拆为独立任务 **T-05m**（1.5h，`test/unit/fake-backend.test.js` 直接验收）。登记表改为 `test/e2e/index.js`（plan §8.3） |
| AN3-05 | plan §8.3 控制通道**去掉**鉴权令牌与 `FAI_TEST_CONTROL_TOKEN`：只在 `FAI_TEST_HOOKS=1` 时存在、只监听回环、隔离临时目录；生产后端 Bearer 令牌不变；plan §10 风险行与 `checklist-review-request.md` 同步。不新增任何其他安全机制 |
| AN3-06 | plan 页首、tasks 页首与进度表改为"文件生成时 A 初轮 30/41；当前审批状态以 `checklist.md` / `review.md` 为准"；保留初轮计数作为历史 |

---

## 迭代 4（修补后重新读取 AGENTS.md、spec、plan、tasks、manual、plan-gaps、checklist 状态；最终）

### 1. 执行的检查（只有文档/静态检查；未运行任何测试、构建或 npm）

| 检查 | 结果 |
|---|---|
| spec 冻结 | `git diff 8ba1b6a -- specs/desktop-shell/spec.md` 仍只有页首 Gate 1 元数据 1 行 |
| 源码/docs 未改 | `git diff --stat 8ba1b6a -- backend shell packaging docs .gitignore` 为空 |
| `git diff --check`（已跟踪文件）与 `git diff --no-index --check`（新文件） | 无空白错误 |
| AC 计数 | 38（`AC-003-5` 为 spec §4 中 settings 的编号，排除） |
| **逐任务块逐条**完成标准含 AC 编号 | 39 个任务的全部完成标准条目均含 `AC-xxx-y`；无独立 AC 的 WO 均写"最近 AC" |
| 完成标准与验证条数 | 每个任务一一对应 |
| 估时 | 39 个任务均 0.5～2h；顺序表与任务体一致；合计 58h |
| 依赖 | 顺序表无前向依赖；任务体"依赖"与顺序表一致（T-05i 的"已含 T-02b"为括注，经 T-05h 传递） |
| **后序任务引用** | 逐条列出完成标准/验证中对后序任务的引用并人工判定，全部属于"范围说明或集成复验"，没有一条把本任务的完成标准交给后序任务验收：T-05c→T-05k（错误页范围）、T-05c/T-05d→T-05e（集成复验，明文"不是完成前提"）、T-05e→T-05f（单实例产品行为范围）、T-05i→T-05j/T-08d（页面与导出属于后序任务自己的完成标准）、T-06c→T-07b、T-07b→T-08d（托盘入口/导出项范围）、T-07d→T-07e（抑制效果范围）、T-08c→T-08d（运行时 ZIP 属 T-08d 标准）、T-09b→T-10d（打包后构建信息范围） |
| 早期命令是否需要后期产物 | `npm run dist` 只出现在 T-10c 的 `build.ps1` 之内；`scan-package.js dist/win-unpacked` 只在 T-10c 及之后；T-10a/T-10b 验证只用单测与临时夹具 |
| 测试文件 | tasks 13 个单测文件 ⊇ plan 提到的全部单测文件 |
| e2e 场景 | 36 个（新增 `prefs-ui`），全部有创建任务；与 plan 名称一致（`harness-selftest`、`events-invalid` 为 plan §8.3 自检场景） |
| M-ID | 26 个全部被任务或批次点名；tasks 引用的 M-ID 全部存在 |
| 已删除/退役内容 | `FAI_TEST_CONTROL_TOKEN`、控制通道"随机令牌"在 plan/tasks 中无残留（plan 中剩余"随机令牌"仅指生产后端令牌 WO-09）；`check:ui`、`--backend-only`、`npm run smoke` 只作历史/退役文本；`shell/lib` 只出现在 F-01 历史说明 |
| 实时状态措辞 | plan/tasks 中 `30/41` 只以"文件生成时 / 初轮"历史口径出现，并指向 `checklist.md` / `review.md` |

### 2. 覆盖矩阵更新（相对迭代 2 §2 的变化；其余行不变）

| AC / WO | 任务 | 自动验证（待新增） | 人工 |
|---|---|---|---|
| AC-001-3 | T-10a、T-10c | `builder-config.test.js`；`build.ps1` 生成安装包 | M-03 |
| AC-001-4 | T-04b、T-10a、T-10b、T-10c | `builder-config.test.js`；`scan-package.test.js`；`build.ps1` 第 7 步与单独复跑扫描 | M-04 |
| AC-004-1 | T-05c、T-05d、T-05e（前提/基础设施）、T-05f（产品行为）；T-02c（WO-13） | `bootstrap.test.js`；`check-runner.test.js`；e2e `harness-selftest`、`single-instance` | M-09 |
| AC-004-3 | T-01c、T-05b、T-05c、T-05k | `bootstrap.test.js` 等 | M-11 |
| AC-004-4 / WO-04 | T-05b、T-05c、T-05e、T-07d | `paths.test.js`、`prefs.test.js`、`bootstrap.test.js`；e2e `harness-selftest`（集成复验）、`change-root` | M-12 |
| AC-006-3 | T-07a、T-07d、T-07e | `activity.test.js`；e2e `prefs-ui`（界面持久化）、`notify-off`（抑制效果） | M-06 |
| WO-07 | T-07b、T-07d | e2e `close-quit`、`prefs-ui` | — |
| AC-002-2 / AC-002-3 / AC-004-2（夹具契约） | T-05m | `fake-backend.test.js`（只证明夹具契约，不证明产品 AC） | — |

### 3. 风险与测试缺口（不是文档不一致）

| # | 内容 | 处置 |
|---|---|---|
| R-1 | `file://` 页面对回环后端带令牌 XHR 的 CORS 行为未核实 | plan §10 停止规则（不变） |
| R-2 | Electron 33.4.11 内嵌 Node、`ses.fetch`、`resourceType` 取值未在本工作树核实 | 只以真实 Electron e2e 为证据（不变） |
| R-3 | 507 在设置页的渲染无自动化（AN1-07） | 人工 M-18（可选）；Handoff 如实记录 |
| R-4 | `build.ps1` 版本不一致失败分支不人为制造（代码审阅） | 接受 |
| — | 迭代 1 的 AN1-05、AN1-06 | 已由 AN3-01、AN3-04 的修补消除，不再作为接受项 |

### 4. 分类发现（迭代 4）

- P1：无。P2：无（AN3-01～AN3-05 已修补并复核）。P3：R-3、R-4 为已知测试缺口，Review/Handoff 跟踪。

**外部验收证据（本阶段无法取得，不是文档不一致）**：干净机安装/卸载、基准机 15 s、真实系统通知/托盘观感、真实作业引擎与后端 drain、真实 `frontend-workbench` 产物与 `window.futuresai` 采纳、agent、真实发布通道、真实 EIA key、真实满盘、代码签名。

**缺少的审核批准（不是文档不一致）**：A 的独立复查（含 Tasks/Analyze 对齐项）。本文件生成时 A 只有初轮结论；当前状态以 `checklist.md` / `review.md` 为准。作者不勾选任何项。

### 5. 正式结论

- **文档一致性通过**（迭代 4，最终）：冻结 spec / plan 修订 3（含迭代 3 修补）/ tasks（39 个任务）之间未发现遗留 P1/P2；38 AC 与 13 WO 均有任务与验证映射，逐任务完成标准均引用 AC，无后序任务承担前序任务验收，无早期命令依赖后期产物。迭代 1、迭代 3 的未通过结论如实保留于上文。
- 本结论**不**代表代码正确、任何测试已运行或通过、Converge、Review 或 Gate 2。

### 6. Implement 前置条件（取代迭代 2 §7）

1. 审核员 A（`anthropic/claude-fable-5-1`，新开独立会话）完成复查，`checklist.md` **全部复选框勾选**；Astra 会话开始实施前重新读取全文确认。A 若提出新的 P1/P2，回到 Plan/Tasks 修补并重新运行 Analyze。
2. 工程批准：**无待批项**。控制通道令牌已从设计中删除；plan §10 的扩展项均不做、未声称已批准。不把任何工程批准交给 A。
3. 无需回 Clarify / Gate 1；无需新立 ADR。

---

## 迭代 5（协调者 AC-005-3 逐子句追溯检查；作者对照源码与冻结需求独立核对；结论：未通过）

迭代 4 的"通过"只按 AC 编号集合与任务结构检查，没有逐子句核对 AC-005-3"预填、粘贴 key、验证、保存"各自的实现落点。作者核对的事实：

| 依据 | 源码 / 文档事实 |
|---|---|
| 冻结需求 | desktop-shell AC-005-3 明列"预填、粘贴 key、验证、保存"；R-005 / Q-007 要求复用 settings 核心、外壳只做视图；settings R-003 第 1 步与 AC-003-1："用档案预填……档案缺字段时先引导补档案，不出现空表单"；Q-005：程序只做预填与指引，不代提交 |
| settings 核心 | `backend/settings/onboarding.py` 的 `prepare()` 返回 `{missing, prefill, hint}`，`guide_fields()` 给出五项（Category 用 `SECTORS` 官方标签、含 `reason_for_use`），`registration_hint()` 给出注册页 URL 与"不代提交"说明；已有 `tests/test_settings_onboarding.py::TestPrepare` 覆盖核心本身 |
| 宿主 | `backend/app/main.py` 没有暴露 `prepare` / `registration_hint` 的路由；plan §3.1.4 端点表也没有 |
| 内置页 | `shell/renderer/onboarding.js` 的 `renderPrefill(profile)` 用 `GET /settings/profile` 的结果自拼 4 项：Email 是遮蔽值、Category 显示内部 key、缺 Reason for use、忽略 `missing_for_registration`；"打开注册页"在缺项时也可点 |
| 迭代 4 时的任务 | T-06b 只覆盖状态表/清除 key/遮蔽邮箱；T-03b 只覆盖遮蔽邮箱回写与 507；plan §9 AC-005-3 只列 `TestKeyWizard`/`TestSources`/`TestClearKey` 与 `settings-sources`；M-14 从"打开注册页"开始，没有预填与缺项核对 |

| # | 级别 | 发现 | 处置 |
|---|---|---|---|
| AN5-01 | **P2（文档追溯缺口）** | AC-005-3 的"预填"子句（含 settings AC-003-1 的缺项引导）在 plan/tasks 中没有落点与验证；现有内置页重新实现了预填且结果与核心不一致。`TestKeyWizard` 只证明核心的验证/保存，不能证明界面预填 | 切换到 Plan/Tasks 修补 |

**结论（迭代 5）**：**文档一致性未通过**。

### 迭代 5 之后的修补（Plan/Tasks 模式，非 Analyze；不改 spec、不新增 AC、不改 settings 核心与 schema、无需 ADR）

| 文件 | 修补 |
|---|---|
| `plan.md` | §0 记录；§2 内置页偏差补充；§3.1.4 新增只读端点 `GET /settings/registration-guide`（Bearer，原样返回 `prepare(root).detail` 与 `registration_hint().detail`，不拼装、不含 key）与"注册指引与普通档案的隐私区分"段（普通档案始终遮蔽；指引仅在用户点击后请求、只读、不在回写表单内、离开清空；邮箱不是 API 凭证，但指引载荷不进日志/诊断；缺项时不提供"打开注册页"，已有 key 的粘贴/验证不受影响；不代提交、不读邮箱）；§3.1.7 指引响应不入日志；§9 AC-005-3 / AC-005-4 行改写，AC-009-4 的隐私流程包含打开指引 |
| `tasks.md` | 新增 **T-03c**（1h，后端路由 + `TestRegistrationGuide`：真实 settings 核心 + 真实加密档案夹具，字面量期望值；401；不含 key；请求期间日志无邮箱）与 **T-06d**（1.5h，删除 `renderPrefill`，"准备注册信息"渲染核心结果，e2e `registration-guide`：完整档案五项与核心一致且 `openExternal` 恰收到核心 URL、缺项档案列缺项且无打开按钮且 key 区可用、点击前为空、档案表单仍遮蔽、指引不在表单内；不访问 EIA）；T-04b 依赖加 T-03c；T-08d 依赖加 T-06d 且隐私流程包含打开指引；顺序表重排为 41 行，合计 60.5h |
| `manual-acceptance.md` | M-14 增加缺项引导与完整预填两步（离线可做），真实注册/key 仍为外部；M-15 区分普通档案遮蔽与显式注册指引，日志搜索包含指引中显示过的邮箱 |
| `plan-gaps.md` | 表 G 追加 A-22 → T-03c、T-06d |
| `checklist-review-request.md` | 计数与迭代更新；请 A 逐子句核对 AC-005-3 |

---

## 迭代 6（修补后重新读取 AGENTS.md、spec、settings spec R-003、plan、tasks、manual、plan-gaps 与源码相关段；最终）

### 1. 执行的检查（只有文档/静态检查；未运行任何测试、构建或 npm）

| 检查 | 结果 |
|---|---|
| spec 冻结 / 源码与 docs 未改 | `spec.md` 仍只有页首元数据 1 行差异；`git diff --stat 8ba1b6a -- backend shell packaging docs .gitignore` 为空 |
| `git diff --check` / 新文件 `--no-index --check` | 无空白错误 |
| 任务结构 | 41 个任务，均 0.5～2h，合计 60.5h；顺序表与任务体估时/依赖一致，无前向依赖 |
| 逐任务逐条 AC 引用 | 41 个任务的全部完成标准条目均含 AC 编号；完成标准与验证条数一一对应 |
| 后序任务引用 | 新增 T-06d→T-08d 一条：日志/诊断无邮箱是 T-08d 自己的完成标准；T-06d 的三条标准全部在 T-06d 内由 `registration-guide` 验证。其余同迭代 4 判定 |
| e2e 场景 | 37 个（新增 `registration-guide`），均有创建任务，与 plan 名称一致 |
| 单测 / pytest | 13 个外壳单测文件；`TestRegistrationGuide` 在 plan §9 与 T-03c 一致，位于现有 `tests/test_app_settings_api.py`（plan §8.2 第一行命令已覆盖） |
| M-ID | 26 个全部被引用；M-14/M-15 已改写 |

### 2. AC-005-3 逐子句追溯

| 子句 | 实现落点 | 自动验证（待新增 / 现有） | 人工 |
|---|---|---|---|
| 预填（完整档案） | settings 核心 `prepare`/`guide_fields`（现有）→ T-03c 路由 → T-06d 渲染 | `TestPrepare::test_prefill_matches_profile`（现有，核心）；`TestRegistrationGuide::test_complete_profile_matches_core_labels`（T-03c）；e2e `registration-guide` 完整档案段（T-06d） | M-14 第 2 步 |
| 缺项先补档案（settings AC-003-1） | 同上 | `TestPrepare::test_missing_fields_reported`（现有）；`TestRegistrationGuide::test_missing_profile_lists_core_missing`（T-03c）；e2e `registration-guide` 缺项段（T-06d） | M-14 第 1 步 |
| 打开注册页（系统浏览器，不代提交） | 核心 `registration_hint` URL → T-06d → 主进程外链策略（T-08e） | e2e `registration-guide`（`openExternal` 恰收到核心 URL）；e2e `external-link`（T-08e） | M-14 第 3 步、M-22 |
| 粘贴 key | 内置页 key 区（现有，T-06b 纠偏） | e2e `ui-masking`（`password` 输入，T-06b）；e2e `registration-guide`（缺项时仍可用，T-06d） | M-14 第 4～5 步、M-15 |
| 验证、保存 | settings 核心 `verify_and_save`（现有）经 `POST /settings/key` | `TestKeyWizard`（现有，`_probe` 在网络边界注入），T-03b / T-03c 的"既有用例无回归"会重跑该文件 | M-14 第 4～5 步（真实 key【外部】） |
| 数据源当前状态（含免凭证回退） | `GET /settings/sources` + 状态表 | `TestSources` / `TestClearKey`（现有）；e2e `settings-sources`（T-06b） | M-14 第 6 步 |

### 3. 风险与测试缺口（不是文档不一致）

| # | 内容 | 处置 |
|---|---|---|
| R-1 | `file://` 页面对回环后端带令牌 XHR 的 CORS 未核实 | plan §10 停止规则（不变）；`registration-guide` 正对照同样会暴露 |
| R-2 | Electron 运行时 API 未在本工作树核实 | 只以真实 Electron e2e 为证据（不变） |
| R-3 | 507 在设置页的渲染无自动化 | 人工 M-18（可选） |
| R-4 | `build.ps1` 版本不一致分支不人为制造 | 代码审阅 |
| R-5（新） | 界面上"粘贴 → 验证 → 保存"的端到端只能人工：验证必须访问 EIA，e2e 不提交 key；自动化分别由 `TestKeyWizard`（核心与路由）与 `ui-masking` / `registration-guide`（界面输入可用、遮蔽）覆盖 | M-14（真实 key【外部】）；Handoff 如实记录 |

### 4. 分类发现（迭代 6）

- P1：无。P2：无（AN5-01 已修补并复核）。P3：R-3、R-4、R-5 为已知测试缺口。

**外部验收证据（本阶段无法取得）**：干净机安装/卸载、基准机 15 s、真实系统通知/托盘观感、真实作业引擎与后端 drain、真实前端与 `window.futuresai` 采纳、agent、真实发布通道、真实 EIA key 与真实注册、真实满盘、代码签名。

**缺少的审核批准**：A 的独立最终复查尚未开始；当前状态以 `checklist.md` / `review.md` 为准。作者不勾选任何项。

### 5. 正式结论

- **文档一致性通过**（迭代 6，最终）：冻结 spec / plan / tasks（41 个任务）之间未发现遗留 P1/P2；38 AC 与 13 WO 均有任务与验证映射，AC-005-3 已逐子句追溯；迭代 1、3、5 的未通过结论如实保留。
- 本结论**不**代表代码正确、任何测试已运行或通过、Converge、Review 或 Gate 2。

### 6. Implement 前置条件（取代迭代 4 §6）

1. 审核员 A（`anthropic/claude-fable-5-1`，新开独立会话）完成最终复查，`checklist.md` 全部复选框勾选；Astra 会话实施前重新读取全文确认。A 若提出新的 P1/P2，回到 Plan/Tasks 修补并重新运行 Analyze。
2. 工程批准：无待批项（新端点是对既有 settings 核心的只读暴露，位于已冻结 AC-005-3 范围内，不是新的安全或并发机制）。
3. 无需回 Clarify / Gate 1；无需新立 ADR。全部实施（含 T-03c、T-06d）待 `openai/gpt-6-astra`。

---

## 迭代 7（Plan 修订 4：T-04b 构建收集源头修正之后；只读）

> 本文件页首的"固定源码基线 `8ba1b6a` / 未提交工作副本"描述只适用于迭代 1～6。本轮输入：固定提交 `1275ae2`（分支 `plan/desktop-shell-build-assets`）+ 四个规划文件的工作副本差异（`plan.md` 修订 4、`tasks.md` T-04b 修正、本文件追加本节、新增 `build-assets-review-request.md`）。作者 = `anthropic/claude-opus-5-5` via anthropic（本轮官方通道最小真实调用成功；`claude-bridge` 同模型 seven_day 限额在当前窗口已知耗尽，不重复探活）；协调 = `openai/gpt-6.1-sol`。日期 2026-10-28。
> 本轮**不是** Converge、Review、产品测试通过或 Gate 2；没有运行任何测试、构建、npm 或联网请求。

### 1. 重读的输入

AGENTS.md；HANDOFF.md（§10）；`docs/plan.md`、`docs/architecture.md`、`docs/decisions/20261026-desktop-shell.md`（D-007）；`templates/{plan,tasks}.md`；`specs/desktop-shell/{spec,plan,tasks,checklist,analyze,review,implementation-evidence}.md`；源码 `backend/tools/{build_backend,shell_check}.py`、`backend/tests/test_app_health.py`；已安装源码（只读）：`_pyinstaller_hooks_contrib/stdhooks/hook-pyarrow.py`、`PyInstaller/utils/hooks/__init__.py`（`collect_data_files`、`collect_dynamic_libs`、`PY_DYLIB_PATTERNS`）、`PyInstaller/depend/imphook.py`、`PyInstaller/depend/analysis.py`、`PyInstaller/building/build_main.py`、`pandas/compat/pyarrow.py`，以及已安装 pyarrow 22.0.0 的目录枚举。修补 Plan/Tasks 之后再次重读 spec、plan 修订 4 相关段、tasks T-04b 全文与 checklist。

### 2. 执行的检查（只有静态检查）

| 检查 | 方法 | 结果 |
|---|---|---|
| spec 冻结 | `git diff --exit-code 1275ae2 -- specs/desktop-shell/spec.md` | 无差异（相对 `8ba1b6a` 仍只有页首 Gate 1 元数据 1 行） |
| 黑名单冻结 | `git hash-object backend/tools/shell_check.py` 与 `git rev-parse 1275ae2:backend/tools/shell_check.py` | 均为 `2aa8824b47088345ae450fd769697e416196787b`；`git diff --quiet 1275ae2 -- backend` 无差异 |
| 其他只读文件 | `git diff --exit-code 1275ae2 --` checklist / review / README / HANDOFF / implementation-evidence | 均无差异；`checklist.md` 仍为 41 个 `[x]`、0 个 `[ ]`（作者未改） |
| 空白 | `git diff --check` | 无错误 |
| AC 计数 | 正则抽取 spec | 39 个编号，排除 spec §4 中属于 settings 的 `AC-003-5` 后为 38，与此前一致 |
| 任务结构 | 脚本解析执行顺序表与任务块 | 41 行 / 41 块；估时全部 0.5～2h；顺序表合计 = 任务块合计 = **61.0h**；每块完成标准条数 = 验证条数（T-04b 为 4/4）；每条完成标准都含 AC 编号；顺序表无前向依赖；T-10c 仍依赖 T-04b |
| 修订 4 只改 T-04b | `git diff 1275ae2 -- specs/desktop-shell/tasks.md` | 改动限于页首新增修订 4 说明、顺序表第 8 行、合计行与 T-04b 块；"实施进度"表（协调者所有）未改 |
| 所有权与回滚 | 对照 plan §7.5 设计表、§10 回滚、tasks T-04b 修改范围 | 写入集合一致 = `build_backend.py`、新 `backend/tools/pyinstaller_hooks/hook-pyarrow.py`、新 `backend/tests/test_app_packaging.py`（匹配既有 `test_app_*`）、`implementation-evidence.md` 追加；`shell_check.py`、`test_app_health.py`、spec、site-packages、constraints、运行时代码明确只读；§10 回滚已加入 hook 目录 |
| `.gitignore` | `git check-ignore -v --no-index` 新路径 | `backend/tools/pyinstaller_hooks/hook-pyarrow.py`、`backend/tests/test_app_packaging.py`、`specs/desktop-shell/build-assets-review-request.md` 均无输出、退出码 1（不被忽略） |
| cwd | 对照 plan §8.2 新增两行 | 细则第 1～6 步为 `backend`，第 7 步为仓库根目录，与 plan 一致 |
| 名称一致 | `rg` 三个测试名、`pyinstaller_hooks`、`--additional-hooks-dir` | plan §7.5 / §8.2 / §9 与 tasks T-04b 一致 |
| 测试接缝 | 对照 AGENTS §5.6 与 checklist C-24 | 接线测试只替换 `subprocess.run`；两个 hook 测试真实执行仓库 hook 与已安装 contrib hook；参照规则取自 §7.4 黑名单表述，不复制生产 glob；禁止 mock `collect_*`；`importorskip` 只针对未装 pyarrow 的环境，最终证据禁止 skip |
| 源码事实复核 | 只读阅读与枚举 | contrib hook 三行与 plan 所述一致；`excludes` 命中目录即追加 `<目录>/**/*`；动态库模式 `*.dll`/`*.dylib`/`lib*.so`；用户 hook 优先级 1000、contrib −1000、每模块只取最高者；`imphook.py` 第 420 行以 INFO 记录 `Processing standard module hook %r from %r`（细则第 4 步据此核对 hook 来源）；pyarrow 中名为 `tests` 的目录只有包根一处，内含 72 `.py`、72 `.pyc`、4 `.parquet`、4 `.orc`、4 `.gz`、3 `.pyx`、1 `.md`、1 `.feather`，无 `.dll`/`.pyd`；`pandas/compat/pyarrow.py` 以 `try: import pyarrow … except ImportError` 导入；`backend/app|data|settings` 无 `import pyarrow` / `from pyarrow` |
| 验收循环 | 逐条核对 T-04b 完成标准 | 4 条标准都在 T-04b 自身的 7 步内验证，不依赖后序任务；"A 复查修订 4"是实施前置闸门，不是验收循环 |

### 3. 发现

| # | 级别 | 内容 | 处置 |
|---|---|---|---|
| AN7-01 | P3（已在本轮 Analyze 之前的修补阶段处理） | 修补阶段自检发现：细则第 6 步的产物对比依赖第 3 步的阻塞产物；若该产物不存在，完成标准 3"只少了 `_internal/pyarrow/tests/**`"将无法取证 | tasks 第 3 步写明"阻塞产物必须存在，不存在即停"，停止规则同步；本轮复核已生效 |
| AN7-02 | P3（接受，残余边界） | 经 `pyarrow.conftest` 的导入链，PYZ 内可能含 `pyarrow.tests` 纯模块；未核实，不在冻结的文件系统黑名单扫描范围，也未被观测为失败 | 按 AGENTS §5.1 不做推测性加固；plan §10 已登记，交 A / Review 判断 |
| AN7-03 | P3（接受） | pyarrow 与 pyinstaller-hooks-contrib 均未在 `constraints.txt` 锁定，pyarrow 随环境进入产物 | 本修正不改包版本；参照测试会暴露 contrib hook 漂移；plan §10 已登记 |
| AN7-04 | P3（协调者动作） | 实施树的输入（`782aa20` + WIP）与规划基线 `1275ae2` 不同：细则第 7 步的 `<输入基线>` 须由协调者给定；四个规划文件须先集成为固定提交并同步到实施树，否则 Astra 会读到修订 3 的 T-04b | 写入 `build-assets-review-request.md` 与本节 §5 |
| AN7-05 | P3（接受，测试缺口） | "仓库 hook 优先于 contrib"没有单元测试，由真实构建日志（细则第 4 步）与真实产物扫描证明 | 不为单测构造占位模块图；以真实构建证据为准 |

P1：无。P2：无。

### 4. 覆盖矩阵变化（相对迭代 6；其余行不变）

| AC | 任务 | 自动验证 | 人工 |
|---|---|---|---|
| AC-001-4 | T-04b（完成标准 3：干净重建 + 未修改冒烟扫描；完成标准 4：收集源头）、T-10a、T-10b、T-10c | `test_app_packaging.py` 三个用例（待新增）；`build_backend.py --clean` + `shell_check.py` 12/12；产物清单对比；`builder-config.test.js`、`scan-package.test.js`、`build.ps1` 第 7 步 | M-04 |

### 5. 正式结论（迭代 7）

- **文档一致性通过（修订 4 范围）**：冻结 spec、plan 修订 4 与 tasks（41 个任务，61h）之间没有 P1/P2；修正落在 AC-001-4 冻结范围内，没有需求、schema 或黑名单变更，不需回 Clarify / Gate 1，不需新 ADR；所有权、cwd、依赖、粒度与计数一致。迭代 1～6（含 1、3、5 的未通过结论）原样保留。
- 本结论**不**代表代码已实现、任何测试已运行或通过，也不是 Converge、Review 或 Gate 2。
- **审批仍待定**：A 对修订 3 的 41/41 **不是**对修订 4 的自动批准。

### 6. 实施前置条件（修订 4，补充迭代 6 §6）

1. 审核员 A（新开独立会话，模型按 AGENTS §6）按 `build-assets-review-request.md` 复查受影响项，结论只写入 `checklist.md`；记录完成且全部复选框为勾选状态后，Astra 才可实施 T-04b 的修订 4 部分。A 若提出 P1/P2，回到 Plan/Tasks 修补并重新运行 Analyze。
2. 协调者把四个规划文件集成为固定提交、同步到实施树，并给出细则第 7 步的 `<输入基线>`。
3. 工程批准：除 Walter 已给出的这一项构建修正授权外，没有待批项；不需回 Clarify / Gate 1；不需新 ADR。

## 迭代 8（Plan 修订 5：T-06c/T-06d 设置导航与测试兼容之后；只读）

> 输入：固定提交 `4b0c3c510906bba83f41eac4ac34bbbccf1c1a30`（分支 `plan/desktop-shell-settings-routing`；代码同实施提交 `d77ce69`）+ 四个规划文件工作副本（`plan.md` 修订 5、`tasks.md` T-06c/d、本节追加、新增 `settings-routing-review-request.md`）。作者 = `anthropic/claude-opus-5-5` via anthropic（同一 Plan 阶段收尾；bridge 同窗口已知耗尽不重复探活，官方探活 `ROUTING_PLAN_OK`；中途两次协调者取消与一处行格式修复均非模型/通道失败，未回退）。协调 = `openai/gpt-6.1-sol`。日期 2026-10-29。
> 本轮**不是** Converge、Review、产品测试通过或 Gate 2；没有运行任何测试、构建、npm 或联网请求；没有执行 19 个场景。

### 1. 重读的输入

AGENTS.md；`docs/plan.md`；`spec.md`（R-005 / AC-005-1～4）；`plan.md` 修订 5 的页首、§0、§3.3、§4.1 第 6 步与资源错误重试、§6 / §6.1 全文、§8.3 控制通道；`tasks.md` 页首、执行顺序表、T-06b/c/d；`implementation-evidence.md` §10.2～10.5（T-06b 检查点 42 unit / 16 场景 236/236 与 §10.4 停止理由）；`checklist.md` 审批页首与受影响项；本文件迭代 7。修补后再次重读 plan §6.1、§8.3 与 tasks T-06c/d。

### 2. 执行的检查（只有静态检查）

| 检查 | 方法 | 结果 |
|---|---|---|
| spec 冻结 | `git diff --exit-code 4b0c3c5 -- specs/desktop-shell/spec.md` | 无差异；AC 编号抽取 39（含 settings 的 AC-003-5）→ 38，与此前一致 |
| 只读文件 | `git diff --exit-code 4b0c3c5 --` spec / checklist / review / README / HANDOFF / implementation-evidence / `shell` / `backend` | 均无差异；checklist 未改（审批仍待 A） |
| 空白 | `git diff --check` | 通过（协调者修复了 plan §8.3 快照行的 150 个制表符残留，未改技术措辞） |
| 任务结构 | `rg` 抽取顺序表与任务块估时 | 41 行 / 41 块；顺序表合计 = 任务块合计 = **61.5h**；全部 0.5～2h；T-06c 2h、T-06d 1.5h；依赖与顺序未变、无前向依赖 |
| 完成标准 ↔ 验证 | 逐条对照 | T-06c 5/5（另附执行细则）；T-06d 4/4；每条完成标准含 AC 编号（AC-005-1/2/3/4、AC-007-3、AC-009-2） |
| 修订 5 只改 T-06c/d | `git diff 4b0c3c5 -- specs/desktop-shell/tasks.md` | 限于页首修订 5 说明、顺序表第 22/23 行、合计行、T-06c/T-06d 块；协调者所有的“实施进度”未改 |
| 所有权 | plan §6.1 第 10 段 vs tasks T-06c/d 修改范围 | 一致：main / preload / onboarding.* / test-hooks（只加 `records.navigation` 与 `app-menu-click`）/ startup-visible（只替换一条断言）/ frontend-missing（只加核心前提与一条断言）/ 三个新场景 / index 登记 / 证据追加；`settings-sources`、`ui-masking`、`mock` 与其余旧场景、`check.js`、`src/{backend,paths,prefs}.js`、夹具、依赖只读 |
| 设计一致 | `rg app-menu-click|openMain|fai-settings|REQUIRED_NOW` | plan §0/§3.3/§4.1/§6.1/§8.3 与 tasks 一致；§8.3 原缺 `app-menu-click` 条目（§0 已声称新增）→ 本轮补入 §8.3 命令集（AN8-01） |
| 场景计数 | plan §6.1 第 8 段 vs tasks | 16 → T-06c 后 18 → T-06d 后 19；T-06c 验证的无参数全集为 18、T-06d 为 19 |
| cwd | tasks 验证 | 全部 `shell`，与 plan §6.1 第 11 段一致 |
| `.gitignore` | `git check-ignore -v --no-index` 三个新场景与本请求文件 | 无输出、退出码 1（不被忽略） |

### 3. 发现

| # | 级别 | 内容 | 处置 |
|---|---|---|---|
| AN8-01 | P3（已修） | plan §0 修订 5 声称 §8.3 新增 `app-menu-click`，但 §8.3 固定命令集未列 | 在 §8.3 命令列表加入该命令与错误码，指向 §6.1 第 5 段 |
| AN8-02 | P3（已修） | T-06d 修订 5 新增两条验证（焦点/清空/Web 存储；19 场景回归）无对应完成标准 | 新增完成标准 4（AC-005-3/4），验证合并为 4 条，一一对应 |
| AN8-03 | P3（接受，测试缺口） | `app-menu-click` 的 409 分支（菜单项缺失/不可用）无自动化覆盖；正常生产模板下不可达 | 不为不可达分支构造假菜单（AGENTS §5.1/§5.6）；交 A 判断 |
| AN8-04 | P3（协调者动作） | 四个规划文件须集成为固定评审提交并同步到实施树；本请求不自报其提交哈希 | 见 `settings-routing-review-request.md` |

P1：无。P2：无。

### 4. 正式结论（迭代 8）

- **文档一致性通过（修订 5 范围）**：冻结 spec、plan 修订 5 与 tasks（41 个任务，61.5h）之间无 P1/P2；不改 spec / AC / 后端 / CORS / 生命周期 / 依赖 / 全局配置 / 安全面，不需回 Clarify / Gate 1，不需新 ADR。迭代 1～7 原样保留。
- 本结论**不**代表代码已实现或任何测试已运行；T-06b 检查点（42 unit / 16 场景 236/236）是既有实施证据，19 场景**未执行**。
- **审批待定**：A 对修订 4 的 41/41 不自动覆盖修订 5。

### 5. 实施前置条件（修订 5）

1. A（新开独立会话，AGENTS §6）按 `settings-routing-review-request.md` 复查受影响项，结论只写入 `checklist.md`；全部复选框为勾选状态后 Astra 才可实施 T-06c/d。A 提出 P1/P2 → 回 Plan/Tasks 修补并重跑 Analyze；A 若判定需 Walter 工程批准 → 停止。
2. 协调者把四个规划文件集成为固定评审提交并同步到实施树。

## 迭代 9（Plan 修订 6：T-07a 运行器提前退出约定 + T-07b/c/e 钩子接线所有权之后；只读）

> 输入：固定提交 `c1b40700b3824396d7a071868f904d181f6adcfd`（分支 `plan/desktop-shell-activity-harness`；主树快照，含 `implementation-evidence.md` §12 的 T-07a 预检停止；源码为 T-06c/d 检查点）+ 四个规划文件工作副本（`plan.md` 修订 6、`tasks.md` 修订 6、本节追加、新增 `activity-harness-review-request.md`）。作者 = `anthropic/claude-opus-5-5` via anthropic，会话 `01a187bb-94f0-739b-a564-841bc4ccb516`（bridge 同窗口已知耗尽不重复探活，官方探活 `ACTIVITY_PLAN_OK`；未回退）。协调 = `openai/gpt-6.1-sol`。日期 2026-10-29。
> 本轮**不是** Converge、Review、产品测试通过或 Gate 2；没有运行任何测试、npm、构建、Electron 或联网请求，没有写源码。A 对修订 5 的 41/41 不是对修订 6 的批准。

### 1. 重读的输入

AGENTS.md；`docs/plan.md`、`docs/architecture.md`、`docs/interaction.md`、`docs/designUI.md`（与本修订相关段）；冻结 `spec.md`；`plan.md` 修订 5（§3.5、§4.3、§8.3、§9 AC-003-2/4、AC-006-1～4）；`tasks.md` 页首、顺序表、T-06c、T-07a～e、T-08d/e；`checklist.md`（第 4 轮记录与 R5-01～04）；本文件迭代 1～8；`review.md`；根 `HANDOFF.md` §18；`implementation-evidence.md` §11、§12；源码 `shell/check.js`、`shell/src/test-hooks.js`、`shell/main.js`、`shell/test/unit/check-runner.test.js`、`shell/test/fixtures/runner/*`、`shell/test/e2e/{index,harness-selftest}.js`。修补后重读 plan 修订 6（§0、§3.5、§8.3、§8.4）与 tasks T-06c、T-07a～e、T-08e 全文。

### 2. 执行的检查（只有静态检查）

| 检查 | 方法 | 结果 |
|---|---|---|
| 阻塞事实 | `rg -n` 核对行号 | 属实：`check.js:113` `launch`、`:155` 只记异常类型、`:160` 要求 `paths && (second \|\| controlPort)`、`:161` 提前退出直接抛错；`main.js:33` 顶层 `install(..., () => gracefulQuit(0))`、`:313` 控制通道在 `whenReady` 内；`test-hooks.js:20` 对话框只记 `buttons/unanswered`、`:56` `tray:null, activity:null`、`:89` `tray-click` → 409；`FAI_TEST_EVENTS` 在源码中尚无实现 |
| spec 冻结 | `git diff --exit-code c1b4070 -- specs/desktop-shell/spec.md` | 无差异；AC 编号抽取 39（含 settings 的 AC-003-5）→ 38 |
| 只读文件 | `git diff --exit-code c1b4070 --` spec / checklist / review / implementation-evidence / HANDOFF / `specs/README.md` / `shell` / `backend` | 均无差异；checklist 仍 41 个 `[x]`，作者未改 |
| 改动集合 | `git status --short` | 仅 `plan.md`、`tasks.md`、`analyze.md` 修改与新增 `activity-harness-review-request.md` |
| 空白与行尾 | `git diff --check`；按行计数 CR | 通过；三份既有文档仍全部 CRLF（plan 931/931、tasks 748/748 行，analyze 追加后同样全为 CRLF） |
| 任务结构 | `rg` 抽取顺序表与任务块估时 | 41 行 / 41 块；两处均为 10×1h + 20×1.5h + 11×2h = **62h**；全部 0.5～2h；第 24 行 T-07a 2h，第 33 行 T-08e 依赖 `T-05l、T-06b、T-06d`（T-06d 在第 23 行，无前向依赖）；其余依赖与顺序不变 |
| 完成标准 ↔ 验证 | 逐条对照 | T-07a 4/4，每条含 AC 编号（AC-003-4、AC-006-2/3）；第 4 条明言只证明运行器契约、不证明产品 AC；原 5 个 activity 单测名与 `events-invalid` 两条断言名保留；T-06c 验证 2～5 已加完成标准括注（R5-01） |
| 名称一致 | `rg -c -F` 5 个运行器用例名、`expectEarlyExit`、`FAI_CHECK_PRODUCER`、`invalid_tray_path` | plan §8.4 与 tasks T-07a/T-07b 一致（5 个用例名各 1/1） |
| 所有权 | plan §8.4 第 4、5 段 vs tasks T-07a/b/c/e 修改范围 | 一致：`check.js` 仅 T-07a（第 1、2 段，页首“登记约定”的显式例外）；`check-runner.test.js` 仅 T-07a 追加 5 例；`test-hooks.js` T-07a 校验 + `testEvents`、T-07b 快照读取 + `tray-click`、T-07c 对话框 `message/detail`、T-07e 不改；`main.js` 由 T-07b/c/e 按原范围改动；旧夹具、19 个旧场景、`src/{backend,paths,prefs}.js`、依赖只读 |
| 安全面与控制面 | 对照 §8.3 命令集与快照键 | 无新命令、无 emit/注入事件、无主进程 JS、无任意路径/URL、无钩子业务状态、无令牌变化；快照键集合不变；preload 批准全集与 `startup-visible` 断言不变 |
| 默认语义 | 对照 plan §8.4 第 1 段与 `check.js` 现状 | 默认 `launch`、10 s 观察窗、`scene.timeoutMs \|\| 30000`、清理 10 s → 自有 taskkill、泄漏即 FAIL、隔离校验全部保留；新约定只在显式传唯一值时生效 |
| 证据分层 | plan §8.4 第 3 段 | Node 单测（替身在 spawn 边界，被测为真实 `check.js`）与真实 Electron `events-invalid`（真实 `main.js` 校验）分开；Node 单测不计作产品证据 |
| `.gitignore` | `git check-ignore -v --no-index` 本请求文件与 T-07a 计划新增的 7 个路径 | 无输出、退出码 1（不被忽略） |
| cwd | tasks T-07a 验证 | 全部 `shell`；静态核对在仓库根 |

### 3. 发现

| # | 级别 | 内容 | 处置 |
|---|---|---|---|
| AN9-01 | P3（已在修补阶段处理） | 自检：Node 子进程 `exit` 事件可能早于最后一段 stdout/stderr，若以 `exit` 判定，`paths` 或标记可能尚未解析而误判 | plan §8.4 第 1 段规定提前退出约定以 `close`（stdio 排空）为判定时点 |
| AN9-02 | P3（已在修补阶段处理） | 自检：T-07c 把 `request-quit` 改接生产 `requestQuit()` 后，运行器清理遇到仍有运行中作业的场景会弹询问、无应答即取消，导致 10 s 后自有 taskkill 并 FAIL | plan §8.4 第 4 段与 T-07b/T-07c 修改范围：使用事件夹具的场景结束前等到无运行中作业；运行器清理语义不变 |
| AN9-03 | P3（接受，测试缺口） | 提前退出约定的“10 s 内未退出”与“出现 control”两条拒绝分支没有 Node 单测：前者经现有辅助函数需 10 s 等待 + 10 s 清理，超过其 15 s 子进程上限；后者需要替身伪造控制服务 | 两分支沿用现有超时与清理代码，由 Converge/Review 代码核对；不为此改辅助函数或伪造控制服务 |
| AN9-04 | P3（接受，运行时未核实） | Electron 33 在 `ready` 之前于 `install()` 内调用 `app.exit(4)` 是否以退出码 4 结束且不启动控制通道，静态无法证明 | plan §8.4 第 5 段与 T-07a 停止规则：不成立即停，不推迟校验、不改 `main.js` |
| AN9-05 | P3（估时风险） | T-07a 合并运行器约定 + 5 个运行器用例 + 归约器 + 钩子校验 + 场景后为 2h，偏紧 | 保持 41 个任务；明显超出时按停止规则报告、由 Plan 拆分，不压缩验证 |
| AN9-06 | P3（协调者动作） | 四个规划文件须集成为固定评审提交，并同步到实施树（原实施输入 `dad9352`）；T-07a 静态核对中的 `<实施输入>` 由协调者给定 | 见 `activity-harness-review-request.md` |

既有 P3 跟踪：R5-01、R5-03 已按 A 第 4 轮要求在本次 Tasks 触碰中对齐（文本对齐，不改 AC/测试/T-08 代码）；R5-02（菜单 409 分支无自动化）仍 OPEN；R5-04 已由 T-06c/d 实施（空窗口分支仅静态核对），不是新需求。RL-01（P3 OPEN / UNKNOWN）及 A 报告 §4 的正负对照、RL-02～05、UTF-8、PYZ、507 GUI 为独立的后续义务，本修订不处理也不改写。

P1：无。P2：无。

### 4. 正式结论（迭代 9）

- **文档一致性通过（修订 6 范围）**：冻结 spec、plan 修订 6 与 tasks（41 个任务，62h）之间无 P1/P2；不改 spec / AC / 后端 / settings schema / 业务工作流 / 生命周期策略 / CSP / CORS / 权限 / 控制通道鉴权 / 依赖 / 全局配置，不需回 Clarify / Gate 1，不需新 ADR。迭代 1～8 原样保留。
- 本结论**不**代表代码已实现或任何测试已运行；历史 42 unit / 19 场景 310/310 只是 T-06c/d 检查点证据，新的 20 场景默认全集**未运行**。
- **审批待定**：须由新的独立 A 复查（A 质量项按请求文件第 3 节）。

### 5. 实施前置条件（修订 6）

1. A（新开独立会话，AGENTS §6）按 `activity-harness-review-request.md` 复查受影响项，结论只写入 `checklist.md`；全部复选框为勾选状态后 Astra 才可恢复 T-07a。A 提出 P1/P2 → 回 Plan/Tasks 修补并重跑 Analyze；A 若判定需 Walter 工程批准 → 停止，A 不代 Walter 批准。
2. 协调者把四个规划文件集成为固定评审提交并同步到实施树，并给出 T-07a 静态核对用的 `<实施输入>`。

## 迭代 10（Plan 修订 7：T-07b/T-07e 两条旧 null 断言兼容之后；只读）

> 输入：固定提交 `ec55aeed3c2b24ac8d2ea80bbb8bd7efa78723e5`（内容同主树 `ac8c028`；含 A 第 5 轮 41/41 与证据 §13 的 T-07b 预检停止；源码仍为 T-06d 检查点）+ 四个规划文件工作副本（`plan.md` 修订 7、`tasks.md` T-07b/T-07e、本节、新增 `tray-compat-review-request.md`）。作者 = `anthropic/claude-opus-5-5` via anthropic，会话 `01a187bb-94f0-739b-a564-841bc4ccb516`（沿用 `ACTIVITY_PLAN_OK`，bridge 已知耗尽不重试，未回退）。本轮不是 Converge / Review / Gate 2；没有运行测试、npm 或 Electron，没有写源码，没有读取 Astra 的 T-07a 实施 WIP。

### 1. 检查

| 检查 | 结果 |
|---|---|
| 触发事实 | `rg -n` 核实 `shell/test/e2e/harness-selftest.js:26` 断言 `[snapshot.tray, snapshot.activity]` = `[null, null]`、`shell/test/e2e/crash-restart.js:32` 断言 `[after.tray, after.activity]` = `[null, null]`；T-07b 接入真实状态后两者必然失败 |
| spec / checklist / 源码冻结 | `git diff --exit-code ec55aee --` spec / checklist / `shell` / `backend` 均无差异；checklist 仍 41/0 |
| 改动集合 | 仅 `plan.md`（页首作者行、§0 修订 7、§8.4 第 6 段）、`tasks.md`（T-07b 修改范围 / 完成标准 4 / 验证 4，T-07e crash-restart 措辞）、本文件追加、新增请求文件；修订 6 的提前退出约定与 `FAI_CHECK_PRODUCER` 未改 |
| 任务结构 | 41 块，估时 10×1h + 20×1.5h + 11×2h = 62h，顺序表与依赖未改；T-07b 仍 1.5h（只多两行原位替换） |
| 完成标准 ↔ 验证 | T-07b 4/4，新增第 4 条含 AC-006-1、AC-006-4；验证 4 cwd `shell`，显式列出 `harness-selftest crash-restart close-to-tray close-quit tray-menu` |
| 期望值来源 | 字面量 `['idle', true]`，依据 plan §3.5（无错误、无运行中作业 → idle；未进入退出等待 → accepting）；不用生产函数推算，不猜其他内部字段 |
| T-07e 一致性 | T-07e 只追加通知/托盘断言并保留 T-07b 新断言；`backend.ready` 清除 `backend.error` 后仍为 `idle`，无矛盾 |
| `git diff --check` | 通过 |

### 2. 发现

| # | 级别 | 内容 | 处置 |
|---|---|---|---|
| AN10-01 | P3（已修） | 两条旧 null 断言无写入所有权且与 T-07b 真实状态冲突 | plan §8.4 第 6 段 + T-07b 原位替换所有权与完成标准 4 |
| AN10-02 | P3（接受） | `accepting` 字段名来自 plan §3.5 退出守卫语义；若 T-07a 实际归约器状态不暴露该字段，T-07b 须停止报告而不改期望 | 写入 §8.4 第 6 段停止规则 |

P1：无。P2：无。R5-02、R6-01～05、RL-01 等既有 P3 / 义务不变。

### 3. 结论与前置条件

- 文档一致性通过（修订 7 范围）；迭代 1～9 原样保留。相关测试**未运行**。
- A 第 6 轮（新开独立会话，只写 Checklist）按 `tray-compat-review-request.md` 复查前，T-07b 不得开始；当前 **A6 PENDING**。协调者集成四文档为固定评审提交。
