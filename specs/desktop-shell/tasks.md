# Feature: desktop-shell 任务清单（tasks.md）

> Tasks 阶段产物（按 `templates/tasks.md`）。每个任务 0.5–2 小时，按下方"执行顺序"串行执行（Implement 阶段）。
>
> - **作者 / 通道**：Tasks = `anthropic/claude-opus-5-5`（`claude-bridge` seven_day 额度在当前窗口已确认耗尽，不重试；官方通道最小真实调用成功）。协调 = `openai/gpt-6.1-sol`（不是作者）。
> - **输入**：冻结 `spec.md` v1（Gate 1 2026-10-28）+ `plan.md` 修订 3 + A 的初轮 `checklist.md`（只读）。固定源码基线 `8ba1b6a304f916e3d57ebdd6b89790b75a15f14c`，规划文件为未提交工作副本。
> - **修订 4（2026-10-28，T-04b 构建收集源头修正）**：作者同上（`anthropic/claude-opus-5-5` via anthropic，本轮官方通道最小真实调用成功；bridge 同窗口已知耗尽，不重复探活）。输入 = 固定提交 `1275ae2` + `plan.md` 修订 4（§0、§7.5）。只改 T-04b 的上下文、修改范围、估时、完成标准、验证与执行细则，以及执行顺序表第 8 行和合计；任务数仍为 41，其他任务、依赖与历史计数不变。A 对修订 3 的 41/41 不自动覆盖修订 4，T-04b 的修订 4 部分须等 A 独立复查后才能实施。
> - **修订 5（2026-10-29，T-06c/T-06d 设置导航与测试兼容）**：作者同上（`anthropic/claude-opus-5-5` via anthropic；bridge 同窗口已知耗尽不重复探活，官方探活 `ROUTING_PLAN_OK`；同一 Plan 阶段收尾，非回退）。输入 = 固定提交 `4b0c3c5`（代码同 `d77ce69`）+ `plan.md` 修订 5（§0、§3.3、§4.1、§6.1、§8.3）。只改 T-06c / T-06d 的上下文、修改范围、完成标准、验证与执行细则，T-06c 估时 1.5h → 2h，执行顺序表第 22/23 行与合计（61h → 61.5h）；任务数仍 41，依赖与顺序不变，spec/AC 不变。A 对修订 4 的 41/41 不自动覆盖修订 5；T-06c/d 须等 A 按 `settings-routing-review-request.md` 独立复查后才能实施。
> - **执行前置条件（硬）**：Implement 开始前重新读取 `checklist.md` 全文，**全部复选框均已由 A 勾选**才可开始。本文件生成时 A 初轮为 30/41、Tasks/Analyze 对齐项待 A 复查；**当前审批状态以 `checklist.md` / `review.md` 为准**，未全部勾选前 Implement 不得开始。
> - **执行者**：全部实施任务（含纠偏任务）由 `openai/gpt-6-astra` 执行；仅在调用失败（额度/鉴权/持续错误）时按 AGENTS §6 回退 `deepseek/deepseek-flash`，测试变红不是回退理由。**2026-10-28 17:25 UTC 用户明确恢复；原 Astra 会话从 `782aa20` 完成后端复验（最终 451 passed / 5 online skips），真实构建成功，但 T-04b 冒烟因 `_internal/pyarrow/tests` 黑名单命中而 blocked（11/12）。按冻结规则停止，未启动 T-05；实际进度见本文件末尾、`review.md` 与根目录 `HANDOFF.md`，不能将后端子句通过等同于最终 AC 验收。**
> - **最新后端检查点（2026-10-28）**：T-04b 修订 4 已由 Astra 从 `3a9ec35` 完成七步验证并交协调者保存为实施提交 `c1e33e0`：聚焦 3 passed、全量 454 passed / 5 online skips、干净重建成功、未修改冒烟 12/12、文件路径仅少目标测试资产 17（新增/其他移除均 0）。黑名单未改；详见实施进度与 `implementation-evidence.md` §6，不代表全 feature/GUI/外部 AC 或 Gate 2 完成。当时停在 T-05b 之前，当前批次见下一行。
> - **当前检查点（2026-10-28）**：Astra 从 `83b91db` 依序完成 T-05b/c/d/m/e/f，实施源码本地保存为 `a643f81`；最后源码 `npm ci` 成功、**34 unit passed / 0 skipped**、真实 Electron **2 场景 / 37/37 断言通过**，自有进程与场景 temp 已清理。Checklist 41/41 与需求不变；真实前台焦点 M-09 等边界不随之完成。下一项 T-05g，未开始。
> - **最新实现检查点（2026-10-29）**：Astra 从 `e0fe1cd` 按顺序实现 T-05g/h/i/j/k/l，实施提交 `f7d347b`；最后 **42 unit / 14场景213/213通过**，但一次root-locked的10s等待失败根因未确认，**T-05k稳定性复核未关闭**。后续先复核此项，不直接进入T-06b/T-07，不以最后绿灯掩盖失败；详见实施证据§8。
> - **最新风险评估检查点（2026-10-29）**：Astra有界诊断未复现，只补安全时间线，实施681d4bb；最后42unit/14场景213通过。独立A专项评估无P1/P2，RL-01=P3 OPEN/UNKNOWN、非阻塞，可从T-06b继续；**不是根因已修或用户风险接受**。整体Converge/Review前需按A报告§4与既定文档流程补正负对照，其他RL事项仍跟踪。
> - **最新设置检查点（2026-10-29）**：Astra从c33fa9d完成T-06b并保存d77ce69：42unit/0skip、16场景236/236，真实file设置XHR未触发CORS。T-06c/d因两个旧场景兼容与菜单驱动方案缺口暂停；先Plan/Tasks/Analyze/A窄修补确认，不隐匿API/假菜单或改生产路由取绿，不进入T-07；RL-01仍OPEN非阻塞。
> - **工作树**：一个 Astra 实施工作树 / 分支串行完成全部任务；`shell/main.js`、`preload.js`、`renderer/onboarding.*`、`package.json`/`package-lock.json`、`backend/app/*` 是共享文件，不安排并行写入者。
> - **登记约定**：各任务修改范围中的"`shell/check.js`（登记）"均指在登记表 `shell/test/e2e/index.js` 中加入场景名（plan §8.3），不改运行器逻辑。
- **命令状态**：下列所有"待新增"的测试文件、测试名、e2e 场景、npm 脚本在 Implement 前**都不存在、都未运行**；本文件不表示任何验证已通过。测试名为约定名，实施时须按此命名，以便验证输出能逐条对上。
> - **已退役命令**（仅历史文本，**不得**作为任何任务的验证命令）：`npm run check:ui`、`python tools/shell_check.py --backend-only`、`npm run smoke` / `electron . --smoke` / `--ui-smoke`。
> - **通用前提**：外壳命令在 `shell/` 下先执行一次 `npm ci`（lockfile 驱动）；后端命令使用按 `backend/constraints.txt` 安装的 Python 环境。e2e 需要交互式 Windows 桌面会话（托盘/窗口）。每个任务提交前执行 `git status --short --ignored shell packaging backend`，确认新增文件未被 `.gitignore` 忽略（plan §10）。
> - **证据边界**：夹具驱动（事件/更新源/假后端）的结果只证明外壳侧行为；真实作业引擎、真实前端、agent、发布通道、干净机、基准机 15 s、真实 EIA key、系统通知观感均为外部/人工缺口（plan §8.1、plan-gaps D），任何任务都不得写成"已通过"。

## 历史任务 T-01～T-06（阶段代码 / 阶段证据）

T-01～T-06 曾在**没有 desktop-shell checklist** 的情况下实施；下表证据是当时的阶段运行记录，**不是**本轮最终 AC 通过结论，也未在本轮复验。已知缺陷（plan-gaps A 类）由下文 `T-0nb…` 纠偏任务处理；只有纠偏任务完成并复验后，相关 AC 才可能计为满足。

| # | 内容 | 当时记录的证据 | 本轮定位 |
|---|---|---|---|
| T-01 | 后端宿主骨架与 `/health` | `tests/test_app_health.py` 5 passed | 阶段代码；`/health` 恒 ok（A-01）→ T-01b |
| T-02 | 生命周期与优雅退出 | `tests/test_app_lifecycle.py` 3 passed | 阶段代码；孤儿进程（A-08）、无只读通道（A-02）→ T-02b、T-02c |
| T-03 | 设置端点 | `tests/test_app_settings_api.py` 6 passed | 阶段代码；遮蔽邮箱可回写覆盖（A-10）、无 507 → T-03b |
| T-04 | 打包后端 + 冒烟 | `build_backend.py` + `shell_check.py` 8/8（原任务写的 `--backend-only` 参数不存在） | 阶段代码；就绪判据误判（A-14）、回环测试退化（A-17）→ T-04b |
| T-05 | Electron 主进程 | `shell/check.js` 9/9 | 阶段代码；单实例断言恒真、用真实用户目录（A-16）、重启参数缺失与并发（A-05）、默认目录错（A-06）、窗口时机（A-07）→ T-05b～T-05l |
| T-06 | 内置引导/设置页 | `check.js` 9/9 + settings API 10 passed（原任务写的 `check:ui` 不存在） | 阶段代码；`innerHTML`（A-11）、遮蔽邮箱回写（A-10）、无设置入口（A-13）→ T-06b、T-06c |

## 执行顺序（串行，单一实施工作树）

| 序 | 任务 | 估时 | 依赖 |
|---|---|---|---|
| 1 | T-01b 真实健康探测 | 1h | — |
| 2 | T-01c 启动失败分类 | 2h | T-01b |
| 3 | T-01d 端口分配与显式端口冲突 | 1h | T-01c |
| 4 | T-02b stdin EOF 守护 | 1h | T-01c |
| 5 | T-02c 内部只读通道 | 1.5h | T-01c、T-02b |
| 6 | T-03b 设置端点纠偏 | 1.5h | T-01b |
| 7 | T-03c 注册指引端点（暴露核心 prepare / registration_hint） | 1h | T-03b |
| 8 | T-04b 打包冒烟与回环断言加强 + 后端产物收集源头修正（修订 4） | 2h | T-01b～T-03c |
| 9 | T-05b 路径/偏好纯模块 | 1.5h | — |
| 10 | T-05c 启动引导 `bootstrap`（路径 → 单实例锁 → 数据目录） | 1.5h | T-05b |
| 11 | T-05d e2e 运行器 + 运行器单测 | 2h | T-05b |
| 12 | T-05m 假后端夹具 + 直接验收 | 1.5h | T-05b |
| 13 | T-05e 测试钩子 + 控制通道 + 自检 | 2h | T-05c、T-05d、T-05m |
| 14 | T-05f 单实例场景重写 | 1h | T-05e |
| 15 | T-05g 生命周期状态机模块 | 2h | T-05b |
| 16 | T-05h 状态机接线 | 1.5h | T-05g、T-05e、T-02b、T-02c |
| 17 | T-05i 崩溃重启 / 上限 / 强杀自愈 | 1.5h | T-05h |
| 18 | T-05j 启动页 + preload + 超时重试 | 2h | T-05h |
| 19 | T-05k 启动错误页（标记码） | 1.5h | T-05j、T-01c、T-01d |
| 20 | T-05l 目标页选择 / mock / 资源缺失 | 1.5h | T-05j |
| 21 | T-06b 内置页纠偏 | 1.5h | T-03b、T-05j |
| 22 | T-06c 引导路由与设置入口（修订 5：`routeToMain`/`openMain`/应用菜单/`app-menu-click`/两旧场景兼容） | 2h | T-06b、T-05l |
| 23 | T-06d 内置页注册指引（缺项先引导；修订 5 细则） | 1.5h | T-03c、T-06c |
| 24 | T-07a 活动归约器 + 事件夹具 | 1.5h | T-05e |
| 25 | T-07b 托盘 / 关窗行为 / 托盘菜单 | 1.5h | T-07a、T-06c |
| 26 | T-07c 退出守卫 | 1.5h | T-07b |
| 27 | T-07d 设置"应用"区（偏好与数据目录） | 2h | T-06c |
| 28 | T-07e 系统通知 | 1h | T-07a、T-07d、T-05i |
| 29 | T-08a 脱敏 + 滚动日志模块 | 1.5h | T-05b |
| 30 | T-08b 日志接线与崩溃现场 | 1.5h | T-08a、T-05h、T-07d |
| 31 | T-08c 诊断包模块 | 1.5h | T-08a |
| 32 | T-08d 诊断导出入口 + 隐私 e2e | 2h | T-08b、T-08c、T-07b、T-05j、T-06d |
| 33 | T-08e 渲染层安全 | 1.5h | T-05l、T-06b |
| 34 | T-08f 磁盘满界面路径 | 1h | T-08b、T-07d、T-03b |
| 35 | T-09a 更新模块 | 1.5h | T-05b |
| 36 | T-09b 关于页 | 1h | T-07d |
| 37 | T-09c 更新检查接线与提示 | 1.5h | T-09a、T-09b、T-08e、T-07e |
| 38 | T-10a electron-builder 配置与 NSIS（仅配置） | 1.5h | T-09c |
| 39 | T-10b 包内容扫描（夹具验收） | 1h | T-10a |
| 40 | T-10c `build.ps1`：首次 dist + 扫描 + 校验和 | 2h | T-04b、T-10b |
| 41 | T-10d 打包产物 e2e | 1h | T-10c |
| — | T-M1、T-M2a～c 人工验收批次（非代码任务） | 各 1.5–2h | T-10d |

合计 41 个实施任务、约 **61.5 h**（修订 5：T-06c 1.5h → 2h；修订 4 时为 61h：T-04b 1.5h → 2h；修订 3 时为 60.5h）；另 4 个人工验收批次（约 6–8 h，执行人为人，不是 Implement 模型）。

---

## 任务

### T-01b 真实健康探测（纠偏 T-01，A-01）

- **上下文**：`/health` 现恒为 ok（`Host.ready=True`），AC-002-2 不成立。plan §3.1.3。依赖：无。
- **修改范围**：`backend/app/main.py`（仅 `/health`）；`backend/tests/test_app_health.py`。
- **估时**：1h
- **完成标准**：
  1. AC-002-2：`/health` 在 Service 访问锁内对两库 `SELECT 1`，成功 → `200 {status:"ok", data_ready:true, version}`；探测异常或 Service 已关闭 → `503 {status:"unavailable", data_ready:false, reason:<类型名>}`，`reason` 不含输入值。
- **验证**（待新增）：
  1. → `cd backend && python -m pytest tests/test_app_health.py -q -v`，输出须含 `TestHealth::test_health_probes_both_stores`、`TestHealth::test_health_503_when_store_probe_raises`（访问层边界注入异常）、`TestHealth::test_health_503_after_service_closed` 均 PASSED；既有用例按新契约更新后通过。

### T-01c 启动失败分类与退出码 3（纠偏 T-01/T-02，A-09）

- **上下文**：锁被占/不可写/磁盘满在外壳看来都只是"进程退出"并被当崩溃重启。plan §3.1.2。依赖：T-01b。
- **修改范围**：`backend/app/main.py`（`create_app` 接收已构造的 Host；测试仍可 `create_app(root, token)`）；`backend/app/__main__.py`；新增 `backend/tests/test_app_startup_errors.py`。
- **估时**：2h
- **完成标准**：
  1. AC-004-2：数据目录写锁被另一进程持有 → stdout 一行 `FAI_HOST {"event":"startup_failed","code":"data_root_locked",…}`，退出码 3。
  2. AC-004-3：目录不可写（EACCES/EPERM/EROFS、winerror 5/19）→ `data_root_unwritable`，含路径，退出码 3。
  3. AC-007-4（启动期）：ENOSPC / winerror 39、112 → `disk_full`。
  4. AC-004-2、AC-004-3（同一分类入口的兜底）：其他异常 → `startup_internal`，`detail` 只含异常类型名。
- **验证**（待新增）：
  1. → `cd backend && python -m pytest tests/test_app_startup_errors.py -q -v`：`test_locked_root_exits_3_with_marker`（测试进程持有真实 `Service(root)` 写锁后启动宿主子进程）PASSED。
  2. → 同上命令：`test_unwritable_root_exits_3_with_marker`（`icacls` 拒绝写入，结束后恢复 ACL）PASSED。
  3. → 同上命令：`test_enospc_classified_disk_full`（在文件系统边界注入 `OSError(ENOSPC)`）PASSED。
  4. → 同上命令：`test_unknown_error_marker_has_type_only` PASSED；另跑 `python -m pytest tests/test_app_health.py tests/test_app_lifecycle.py tests/test_app_settings_api.py -q` 无回归。

### T-01d 端口分配与显式端口冲突（AC-007-1）

- **上下文**：外壳从不传固定端口（端口 0）；显式 `--port` 被占时须明确失败而非卡住。plan §4.4、§3.1.2。依赖：T-01c。
- **修改范围**：`backend/app/__main__.py`；`backend/tests/test_app_startup_errors.py`。
- **估时**：1h
- **完成标准**：
  1. AC-007-1：两个宿主（不同数据目录）同时就绪且端口不同；显式 `--port` 被占 → `port_in_use` 标记 + 退出码 3，10 s 内退出。
- **验证**（待新增）：
  1. → `cd backend && python -m pytest tests/test_app_startup_errors.py -q -v`：`test_two_hosts_get_distinct_ports`、`test_explicit_busy_port_exits_3_port_in_use` PASSED。

### T-02b stdin EOF 守护（纠偏 T-02，A-08）

- **上下文**：外壳被强杀后后端成孤儿继续持锁，AC-003-3 不成立。plan §3.1.1、§4.5。依赖：T-01c（`__main__` 已重构）。
- **修改范围**：`backend/app/__main__.py`（`--exit-on-stdin-eof`）；`backend/tests/test_app_lifecycle.py`。
- **估时**：1h
- **完成标准**：
  1. AC-003-3（后端侧）：带 `--exit-on-stdin-eof` 启动后关闭其 stdin → 5 s 内经 lifespan 退出，写锁与端口释放。
  2. AC-003-1：上述退出路径与 `/shutdown` 一样不残留 `data/.lock`。不带该参数时行为不变。
- **验证**（待新增）：
  1. → `cd backend && python -m pytest tests/test_app_lifecycle.py -q -v`：`TestStdinEof::test_stdin_eof_releases_lock_and_port` PASSED。
  2. → 同上：`TestStdinEof::test_without_flag_stdin_eof_ignored` PASSED；既有 `test_shutdown_releases_lock_and_port`、`test_stale_lock_recovered_after_hard_kill` 仍 PASSED。

### T-02c 内部只读通道（WO-13，A-02）

- **上下文**：宿主持锁却不发布 `data/mcp_endpoint.json`，应用运行期间 `futureai-data`/`futureai-settings` 只读命令失效。plan §3.1.5。不挂载 MCP 工具（agent feature）。依赖：T-01c、T-02b。
- **修改范围**：`backend/app/main.py`、`backend/app/__main__.py`；新增 `backend/tests/test_app_channel.py`。
- **估时**：1.5h
- **完成标准**：
  1. WO-13（最近 AC：AC-004-1 "不产生第二个数据服务"；Q-001）：宿主运行时 `futureai-data list sources` 与 `futureai-settings source list` 经通道成功返回。
  2. AC-003-1：优雅退出后 `data/mcp_endpoint.json` 已删除；通道令牌每次随机且与外壳令牌不同。
- **验证**（待新增）：
  1. → `cd backend && python -m pytest tests/test_app_channel.py -q -v`：`test_data_list_sources_via_channel`、`test_settings_source_list_via_channel` PASSED。
  2. → 同上：`test_endpoint_file_removed_after_shutdown`、`test_channel_token_differs_from_shell_token` PASSED。

### T-03b 设置端点纠偏（纠偏 T-03，A-10）

- **上下文**：遮蔽邮箱能通过校验并覆盖真实邮箱；磁盘满显示为 422。plan §3.1.4、§3.1.6。依赖：T-01b。
- **修改范围**：`backend/app/main.py`（`put_profile`、`post_key`、异常处理器）；`backend/tests/test_app_settings_api.py`；新增 `backend/tests/test_app_disk_full.py`。
- **估时**：1.5h
- **完成标准**：
  1. AC-005-4：`PUT /settings/profile` 邮箱含 `***` → 422 "遮蔽显示值不可回写"，档案未改写。
  2. AC-007-4：写档案/保存 key 遇 ENOSPC → `507 {"error":"disk_full"}`，进程继续服务，随后 `/health` 仍 200。
- **验证**（待新增）：
  1. → `cd backend && python -m pytest tests/test_app_settings_api.py -q -v`：`TestProfileWrite::test_masked_email_rejected_422_without_writing` PASSED，既有用例无回归。
  2. → `cd backend && python -m pytest tests/test_app_disk_full.py -q -v`：`test_profile_put_enospc_507_then_health_ok`、`test_key_post_enospc_507`（在 `os.replace`/写文件边界注入）PASSED。

### T-03c 注册指引端点：暴露 settings 核心 `prepare` / `registration_hint`（AC-005-3，Analyze 迭代 5）

- **上下文**：AC-005-3 的"预填"必须复用 settings 核心（R-005、settings AC-003-1），而宿主没有对应路由，内置页只能用遮蔽后的档案自拼字段。plan §3.1.4（新增行与"隐私区分"段）、§3.1.7。不改 settings 核心与 schema。依赖：T-03b（同一文件 `backend/app/main.py`，串行）。
- **修改范围**：`backend/app/main.py`（新增 `GET /settings/registration-guide`，原样返回 `onboarding.prepare(root).detail` 与 `onboarding.registration_hint().detail`）；`backend/tests/test_app_settings_api.py`（新增 `TestRegistrationGuide`）。
- **估时**：1h
- **完成标准**：
  1. AC-005-3（预填，settings AC-003-1）：用真实 `settings.profile.save` 写入的加密档案——完整档案时 `prefill` 五项为 First Name / Last Name / Email（真实值）/ Category（官方标签，如 `Research/Consulting`，不是 key）/ Reason for use，`missing == []`；缺 last_name、email、sector 的档案时 `missing` 恰为这三项且 `hint` 非空；`submit.url` 为 EIA 注册页、`notes` 含"不会代替你提交"。
  2. AC-005-4、AC-009-4（隐私边界）：无令牌 → 401；已用真实 `creds.put` 保存哨兵 key 时响应不含该 key；请求期间捕获的日志不含档案邮箱。
- **验证**（待新增）：
  1. → `cd backend && python -m pytest tests/test_app_settings_api.py -q -v`：`TestRegistrationGuide::test_complete_profile_matches_core_labels`、`TestRegistrationGuide::test_missing_profile_lists_core_missing` PASSED（期望值写成字面量，不在测试里复算核心逻辑）。
  2. → 同上：`TestRegistrationGuide::test_requires_token`、`TestRegistrationGuide::test_no_key_in_response_and_no_email_in_logs` PASSED；既有用例无回归。

### T-04b 打包冒烟与回环断言加强 + 后端产物收集源头修正（纠偏 T-04，A-14、A-17；plan 修订 4）

- **上下文**：`shell_check.py` 在健康检查从未成功时也判就绪；回环测试在仅回环机器上不断言。plan §8.2、§7.4。依赖：T-01b、T-01c、T-02b、T-02c、T-03b、T-03c（产物须包含这些改动）。**修订 4**：上述加强已在实施 WIP 中写成并真实运行过（就绪判据正反例、回环、扫描夹具，以及真实 exe 的 11 项检查通过），但首次真实冒烟为 11/12：`_internal/pyarrow/tests` 命中冻结黑名单。根因是 contrib `hook-pyarrow.py` 的 `collect_data_files('pyarrow')` 没有排除测试数据，而 `--exclude-module tests` 不影响数据文件（plan §7.5 第 1 段）。本任务追加构建收集源头修正（plan §7.5），在 AC-001-4 冻结范围内，不改 spec、AC、黑名单。
- **实施前置（修订 4）**：A 对修订 4 的独立复查（`build-assets-review-request.md`）已记入 `checklist.md`，且全部复选框为勾选状态。A 对修订 3 的 41/41 不自动覆盖修订 4。
- **修改范围**：
  - 修订 3 范围（已在 WIP 中，本次修正**只读**）：`backend/tools/shell_check.py`；`backend/tests/test_app_health.py`（`TestLoopbackBind`、`TestPackagedSmokeChecks`）。
  - 修订 4 授权写入（仅限以下各项）：`backend/tools/build_backend.py`（只加仓库 hook 目录常量、`--additional-hooks-dir` 参数与 docstring 一行）；新增 `backend/tools/pyinstaller_hooks/hook-pyarrow.py`；新增 `backend/tests/test_app_packaging.py`；`specs/desktop-shell/implementation-evidence.md`（**追加**新一节，不改写、不删除已有的失败记录与警告）。
  - 禁止改动：`spec.md`；plan §7.4 黑名单与 `shell_check.py`（含 `package_exclusions()`）；`test_app_health.py`；site-packages（含 contrib hook）与全局 pi 配置；`constraints.txt`、`pyproject.toml` 与任何包版本；`backend/app`、`backend/data`、`backend/settings`；`shell/`、`packaging/`；`checklist.md`、`tasks.md`、`review.md`、`specs/README.md`、`HANDOFF.md`（属于协调者或 A）。生成目录 `backend/build/`、`backend/dist/` 不手改，只能由 `build_backend.py --clean` 重新生成。
- **估时**：2h（修订 3 为 1.5h；修订 4 追加 hook、接线、聚焦测试与干净重建复验）
- **完成标准**：
  1. AC-002-2：`shell_check.py` 只有看到 `/health` 200 + `data_ready:true` 才判就绪；在干净重建的产物上成立。
  2. AC-009-1：pytest 与 `shell_check.py` 都用 `netstat -ano -p TCP` 按 pid 断言 LISTENING 地址只有 127.0.0.1，不依赖本机是否有非回环地址。
  3. AC-001-4（后端产物）：未修改的 `shell_check.py` 按 plan §7.4 冻结黑名单扫描 `build_backend.py --clean` 重新生成的产物，无命中；整份冒烟 12/12、退出码 0；与阻塞产物相比只少了 `_internal/pyarrow/tests/**`。
  4. AC-001-4（收集源头，修订 4）：构建命令经 `--additional-hooks-dir` 把仓库 hook 目录交给 PyInstaller，真实构建确实加载了仓库 hook；真实执行仓库 `hook-pyarrow.py` 时，`datas`/`binaries` 没有目标位于 `pyarrow/tests` 下的条目，`hiddenimports` 没有 `pyarrow.tests*`；其 `hiddenimports`、`binaries` 与已安装 contrib hook 集合相等，`datas` 等于 contrib `datas` 去掉 `pyarrow/tests` 目标后的集合（plan §7.5 第 3、4 段）。
- **验证**（cwd 均为 `backend`，第 7 步为仓库根目录；完整命令、顺序与停止规则见下方"修订 4 执行细则"）：
  1. → 细则第 4、5 步：`python tools/build_backend.py --clean` 后 `python tools/shell_check.py`，输出含 `PASS  就绪：/health 200 且 data_ready（AC-002-2）`。
  2. → `python -m pytest tests/test_app_health.py -q -v`：`TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only` PASSED（细则第 2 步的全量已包含此文件）；同 1 的输出含 `PASS  监听地址仅 127.0.0.1（AC-009-1）`；外部机器连接人工 M-26（可选，T-M2c）。
  3. → 同 1 的输出含 `PASS  产物不含黑名单文件（AC-001-4）` 与 `12/12 项通过`，退出码 0；细则第 3、6 步产物清单对比退出码 0；细则第 2 步全量 `tests/` 全部通过且 skip 恰为 5 个 `tests/test_smoke_online.py`；细则第 7 步冻结文件 diff 为空。
  4. → 细则第 1 步 `python -m pytest tests/test_app_packaging.py -q -vv`：`test_build_command_wires_repository_hook_dir`、`test_pyarrow_hook_collects_no_test_assets`、`test_pyarrow_hook_matches_contrib_except_tests` 均 PASSED（不得 skip）；细则第 4 步构建日志显示 `hook-pyarrow.py` 来自仓库 hook 目录；细则第 7 步 `git check-ignore` 确认新增两个文件不被忽略。

#### 修订 4 执行细则（T-04b 内，按序执行）

所有 pytest 均用 `PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8`、`-p no:cacheprovider`，每次用 `tempfile.mkdtemp` 新建仓库外 basetemp（沿用 `implementation-evidence.md` §2 的包装写法）；不开启在线冒烟，不读取真实凭证，不访问上游。第 1～6 步 cwd = `backend`。

1. 聚焦测试：

   ```bash
   PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_packaging.py','-q','-vv','-rs','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-t04b-pack-')]))"
   ```

   期望 3 passed、0 skipped。测试只在 `subprocess.run` 边界注入；两个 hook 测试真实执行仓库 hook 与已安装 contrib hook（plan §7.5 第 3 段）。
2. 全量回归：

   ```bash
   PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/','-q','-rs','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-t04b-full-')]))"
   ```

   期望全部通过，skip 恰为 5 个 `tests/test_smoke_online.py`（未开启的在线冒烟，不算成功）；任何其他 skip（含 pyarrow 的 `importorskip`）都不算通过。
3. 重建前记录阻塞产物的文件清单（只读，不改 `dist/`）：

   ```bash
   python -c "import json,tempfile; from pathlib import Path; d=Path('dist/futuresai-backend'); out=Path(tempfile.mkdtemp(prefix='fai-t04b-before-'))/'files.json'; out.write_text(json.dumps(sorted(p.relative_to(d).as_posix() for p in d.rglob('*') if p.is_file())),encoding='utf-8'); print('BEFORE',out)"
   ```

   阻塞产物 `dist/futuresai-backend` 必须存在（实施树中保留的 11/12 产物）；不存在时停止并报协调者，不得在没有对照的情况下宣称"只少了 tests"。
4. 干净重建（`--clean` 是现有脚本的正常再生成；完整输出写入仓库外日志，警告如实保留）：

   ```bash
   PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys,time; from pathlib import Path; log=Path(tempfile.mkdtemp(prefix='fai-t04b-build-'))/'build.txt'; print('BUILD_LOG',log,flush=True); start=time.monotonic(); out=log.open('w',encoding='utf-8'); result=subprocess.run([sys.executable,'tools/build_backend.py','--clean'],stdout=out,stderr=subprocess.STDOUT); out.close(); print('BUILD_EXIT',result.returncode,'SECONDS',round(time.monotonic()-start,2)); sys.exit(result.returncode)"
   rg -n "hook-pyarrow.py" <BUILD_LOG>
   ```

   期望构建退出码 0；PyInstaller 的 `Processing standard module hook 'hook-pyarrow.py' from …` 行指向 `backend\tools\pyinstaller_hooks`，且没有指向 `_pyinstaller_hooks_contrib` 的 `hook-pyarrow.py` 行。
5. 完整冒烟（不修改脚本、不加参数）：

   ```bash
   PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python tools/shell_check.py
   ```

   期望退出码 0、`12/12 项通过`。
6. 产物清单对比（`<BEFORE>` 为第 3 步打印的路径）：

   ```bash
   python -c "import json,sys; from pathlib import Path; b=set(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))); d=Path('dist/futuresai-backend'); a={p.relative_to(d).as_posix() for p in d.rglob('*') if p.is_file()}; rm=sorted(b-a); add=sorted(a-b); bad=[p for p in rm if not p.startswith('_internal/pyarrow/tests/')]; print('REMOVED',len(rm),'ADDED',len(add),'OTHER_REMOVED',len(bad)); [print('ADD',p) for p in add]; [print('OTHER',p) for p in bad]; sys.exit(0 if rm and not add and not bad else 1)" <BEFORE>
   ```

   期望 `REMOVED` > 0、`ADDED 0`、`OTHER_REMOVED 0`，退出码 0。
7. 静态核对（cwd = 仓库根目录；`<输入基线>` = 协调者给定的、含 T-04b WIP 的固定实施输入提交）：

   ```bash
   git diff --check
   git diff --exit-code <输入基线> -- specs/desktop-shell/spec.md backend/tools/shell_check.py backend/tests/test_app_health.py
   git check-ignore -v --no-index backend/tools/pyinstaller_hooks/hook-pyarrow.py backend/tests/test_app_packaging.py   # 期望无输出、退出码 1（不被忽略）
   git status --short --ignored -- backend/tools backend/tests specs/desktop-shell
   rg -n "import pyarrow|from pyarrow" backend/app backend/data backend/settings   # 期望无命中（plan §7.5 第 4 段）
   ```

**停止规则**（出现即停，写入证据并报协调者，不自行扩大范围）：

- 第 3 步阻塞产物不存在（无法对照）；
- 第 5 步出现 pyarrow 以外的第三方黑名单命中，或 `pyarrow/tests` 仍被命中；
- 第 6 步出现 `_internal/pyarrow/tests/` 以外的增删；
- 第 1 步只有 mock `collect_*` 才能运行，或参照测试显示仓库 hook 与 contrib 在 tests 以外有差异；
- 第 4 步日志显示 pyarrow hook 仍来自 contrib；
- 第 5 步黑名单之外的检查（就绪、回环、三源、鉴权、退出、清理）失败；
- 任何需要改动"禁止改动"清单中文件的情况；需要改 spec、黑名单或 AC 时回 Clarify / Gate 1。

**证据**：在 `implementation-evidence.md` 末尾追加"修订 4 构建收集源头修正"一节，写明模型/会话、输入提交、改动文件、上述 7 步的实际命令与输出摘要（含失败与重跑历史、构建警告），以及仍未取得的外部边界。修正前的 11/12 结果与警告原样保留。实施者不提交、不 push / PR / merge（由协调者处理）。

### T-05b 路径 / 偏好纯模块（纠偏 T-05，A-06）

- **上下文**：默认数据目录错（`%APPDATA%\futuresai-shell\FuturesAI`）；无偏好。plan §3.6、§4.1 第 1/3 步、§5。依赖：无。
- **修改范围**：新增 `shell/src/paths.js`、`shell/src/prefs.js`、`shell/test/unit/paths.test.js`、`shell/test/unit/prefs.test.js`；`shell/package.json`（`electron` 改精确 `33.4.11`；新增脚本 `test:unit` = `node --test "test/unit/*.test.js"`）；`shell/package-lock.json`（仅随 package.json 同步）。
- **估时**：1.5h
- **完成标准**：
  1. WO-04（最近 AC：AC-004-4；spec §4）：默认数据目录 = `%LOCALAPPDATA%\FuturesAI`，状态目录 = `%LOCALAPPDATA%\FuturesAI-Shell`；`LOCALAPPDATA` 缺失 → `localappdata_missing`，不回退；`FAI_DATA_ROOT`/`FAI_SHELL_STATE_DIR` 仅在未打包或 `FAI_TEST_HOOKS=1` 时生效。
  2. AC-004-3（逻辑）：可写探测 EACCES/EPERM/EROFS → `data_root_unwritable`，ENOSPC → `disk_full`，不回退临时目录。
  3. AC-004-4（逻辑）：pending 可写 → 生效并清空；不可写 → `data_root_invalid` 且原 `dataRoot` 不变；偏好损坏 → `prefs_invalid` 且不改写文件；写入失败返回原因。
- **验证**（待新增）：
  1. → `cd shell && npm ci && npm run test:unit`：输出含 `ok … 默认数据目录 = LOCALAPPDATA\FuturesAI`、`ok … LOCALAPPDATA 缺失 → localappdata_missing`、`ok … FAI_DATA_ROOT 仅在未打包或测试钩子下生效`。
  2. → 同上：`ok … 可写探测 EACCES → data_root_unwritable`、`ok … 可写探测 ENOSPC → disk_full`。
  3. → 同上：`ok … pending 可写 → 生效并清空`、`ok … pending 不可写 → data_root_invalid 且原目录不变`、`ok … 偏好损坏 → prefs_invalid 且文件未改写`、`ok … 偏好写入失败返回原因`。

### T-05c 启动引导 `bootstrap`：路径 → 单实例锁 → 数据目录（纠偏 T-05，A-05 `mkdirSync`、A-06）

- **上下文**：`app.setPath` 必须早于 `requestSingleInstanceLock()`，否则隔离状态目录与单实例锁不生效；后续 e2e 隔离依赖本任务。启动引导做成生产函数 `src/paths.js` 的 `bootstrap(app, env)`，由 `main.js` 第一步调用，可独立单测。plan §3.2、§4.1 第 1/3 步。依赖：T-05b。
- **修改范围**：`shell/src/paths.js`（新增 `bootstrap`）；`shell/main.js`（第一步调用 `bootstrap`，用其结果替换现有 `dataRoot()` 与 `mkdirSync`；未拿到锁即退出）；新增 `shell/test/unit/bootstrap.test.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-004-1（前提）：`bootstrap` 先对 userData / sessionData / crashDumps 调用 `app.setPath`，之后才调用 `requestSingleInstanceLock()`；未拿到锁时返回 `gotLock:false` 且不读写数据目录。
  2. AC-004-4、WO-04：数据目录 = `FAI_DATA_ROOT`（仅未打包或测试钩子下）> 偏好 `dataRoot`（含 pending 生效）> `%LOCALAPPDATA%\FuturesAI`。
  3. AC-004-3：可写探测失败返回错误码与路径，不回退、不创建临时替代目录（错误页在 T-05k）。
  4. AC-004-1（接线）：`main.js` 只经 `bootstrap` 调用 `setPath` / `requestSingleInstanceLock`。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … bootstrap：setPath×3 先于 requestSingleInstanceLock`、`ok … bootstrap：未拿到锁不触碰数据目录`（只在 Electron 边界注入记录型 `app`；路径、偏好、探测走真实实现与临时目录）。
  2. → 同上：`ok … bootstrap：默认 LOCALAPPDATA\FuturesAI`、`ok … bootstrap：pending 生效后 dataRoot 为新目录`、`ok … bootstrap：打包且无钩子时忽略 FAI_DATA_ROOT`。
  3. → 同上：`ok … bootstrap：不可写返回 data_root_unwritable 且无临时目录`。
  4. → 静态核查 `rg -n "setPath|requestSingleInstanceLock|bootstrap\(" shell/main.js shell/src`：`setPath` 与 `requestSingleInstanceLock` 只出现在 `src/paths.js`，`main.js` 调用 `bootstrap`。T-05e `harness-selftest` 之后做集成复验，**不是**本任务的完成前提。

### T-05d e2e 运行器 + 假后端（纠偏 T-05，A-16）

- **上下文**：现有 `check.js` 断言恒真、用真实用户目录、首实例 `kill()` 制造孤儿。本任务只建基础设施，不依赖后续生命周期功能。plan §8.3。依赖：T-05b（`package.json` 串行修改）。
- **修改范围**：`shell/check.js`（重写：参数、登记表读取、隔离路径校验、断言 API、清理、汇总；`FAI_CHECK_E2E_DIR` 仅供运行器单测替换场景目录）；新增 `shell/test/e2e/index.js`（登记表，初始为空数组）、`shell/test/unit/check-runner.test.js`、`shell/test/fixtures/runner/{ok,unknown-marker,mismatch,zero-assert,missing-tool}/`；`shell/package.json`（删除 `smoke` 脚本，`check` 保持 `node check.js`）。
- **估时**：2h
- **完成标准**（运行器是 e2e 基础设施；最近 AC 为 AC-004-1——每场景隔离临时目录、结束后无残留后端，是 AC-004-1 / AC-002-3 等 e2e 计数可信的前提；本任务**不**证明任何产品 AC）：
  1. AC-004-1（前提）：未知场景名 → 退出码 2，不运行任何场景（夹具场景的标记文件未生成）。
  2. AC-004-1（前提）：登记表与场景文件不一致 → 退出码 2；零断言 → FAIL；缺外部工具/夹具 → FAIL（不 skip）；断言 API 不提供单参数布尔断言；两条显式断言通过 → 退出码 0。
  3. AC-004-1（前提）：场景结束后临时目录被删除；隔离路径校验拒绝临时目录之外的路径。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … runner：未知场景退出码 2 且未运行场景`（子进程运行真实 `check.js`，`FAI_CHECK_E2E_DIR` 指向夹具目录）。
  2. → 同上：`ok … runner：登记表不一致退出码 2`、`ok … runner：零断言判 FAIL`、`ok … runner：缺外部工具判 FAIL`、`ok … runner：断言 API 无布尔断言`、`ok … runner：两条断言通过退出码 0`。
  3. → 同上：`ok … runner：临时目录已清理`、`ok … runner：临时目录外路径被拒`。启动/结束真实 Electron 的清理路径由 T-05e `harness-selftest` 集成复验。

### T-05m 假后端夹具 + 直接验收（纠偏 T-05，A-16）

- **上下文**：e2e 的进程边界夹具（plan §8.3），只实现宿主的命令行/端点文件/标记行/stdin EOF 契约，不是业务实现；单独验收，后续场景不再承担验证它的责任。依赖：T-05b（`test:unit` 脚本）。
- **修改范围**：新增 `shell/test/fixtures/fake_backend.py`、`shell/test/unit/fake-backend.test.js`。
- **估时**：1.5h
- **完成标准**（最近 AC 为 AC-002-2、AC-002-3、AC-004-2——为其 e2e 提供与真实宿主同契约的夹具；**不**证明产品 AC）：
  1. AC-002-2（夹具契约）：`--mode ok` 写端点文件且 `/health` 200 + `data_ready:true`；`--mode health-fail` 恒 503。
  2. AC-004-2、AC-007-4（夹具契约）：`--mode startup-failed:<code>` 输出 `FAI_HOST` 标记行并以退出码 3 退出。
  3. AC-003-3、AC-002-3（夹具契约）：带 `--exit-on-stdin-eof` 时关闭 stdin 即退出；每次启动向 `FAI_FAKE_REGISTRY/spawns.jsonl` 追加一条。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … fake-backend：ok 就绪`、`ok … fake-backend：health-fail 503`。
  2. → 同上：`ok … fake-backend：startup-failed 退出码 3 + 标记`。
  3. → 同上：`ok … fake-backend：stdin EOF 退出`、`ok … fake-backend：spawns.jsonl 登记`。

### T-05e 测试钩子 + 控制通道 + 运行器自检（纠偏 T-05，A-16）

- **上下文**：为全部 e2e 提供系统边界记录器、`SMOKE` 输出与控制通道；删除旧 `--smoke`/`--ui-smoke`/`UI_ASSERTIONS`。只依赖现有就绪流程与假后端，不依赖状态机。控制通道不另设鉴权令牌（只在 `FAI_TEST_HOOKS=1` 时存在、只监听回环、被测进程使用隔离临时目录；生产后端 Bearer 不变）。plan §8.3。依赖：T-05c、T-05d、T-05m。
- **修改范围**：新增 `shell/src/test-hooks.js`、`shell/test/e2e/harness-selftest.js`；`shell/main.js`（仅在 `FAI_TEST_HOOKS=1` 时加载钩子；`FAI_BACKEND_CMD`；窗口标题标记；删除旧冒烟分支）；`shell/check.js`（读取登记表）、`shell/test/e2e/index.js`（登记 `harness-selftest`）。
- **估时**：2h
- **完成标准**：
  1. AC-004-1（基础设施层：隔离运行与后端唯一；单实例产品行为由 T-05f 证明）：`harness-selftest` 通过——`SMOKE paths` 全在临时目录、窗口存在、后端 pid 存活且 `spawns.jsonl` 恰 1 条 → `request-quit` 后 Electron 退出码 0、后端 pid 不存活、临时目录已删除。
  2. AC-004-4、WO-04（集成复验；`bootstrap` 已由 T-05c 单测）：数据目录 = `<临时 LOCALAPPDATA>\FuturesAI`。
  3. AC-006-1、AC-003-2 等夹具驱动 AC 的诚实标记（plan §3.5）：钩子启用时窗口标题含"［测试钩子］"、日志首行 `TEST HOOKS ENABLED`；未设 `FAI_TEST_HOOKS` 时 `main.js` 不加载 `src/test-hooks.js`、不起控制通道。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- harness-selftest`：输出含 `PASS harness-selftest › paths 位于临时目录`、`› spawns 恰 1 条`、`› 退出码 0`、`› 后端 pid 已退出`、`› 临时目录已删除`。
  2. → 同上：`PASS harness-selftest › 默认数据目录 = LOCALAPPDATA\FuturesAI`。
  3. → 同上：`PASS harness-selftest › 标题含测试钩子标记`、`› 日志首行 TEST HOOKS ENABLED`；静态核查 `rg -n "test-hooks" shell/main.js` 只命中 `FAI_TEST_HOOKS === '1'` 条件分支内的加载。

### T-05f 单实例场景重写（AC-004-1）

- **上下文**：旧断言恒真。plan §9 AC-004-1。依赖：T-05e。
- **修改范围**：新增 `shell/test/e2e/single-instance.js`；`shell/main.js`（`second-instance` 处理器执行 restore/show/focus；钩子记录调用）；`shell/check.js`（登记）。
- **估时**：1h
- **完成标准**：
  1. AC-004-1：同一隔离目录启动第二个实例 → 10 s 内退出码 0；首实例 `records.secondInstance` 恰 1 条且记录了 restore/show/focus 调用；`spawns.jsonl` 恰 1 条；首实例后端 pid 与端口不变。真实前台聚焦留 M-09。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- single-instance`：输出含 `PASS single-instance › 第二实例退出码 0`、`› secondInstance 恰 1 条`、`› spawns 恰 1 条`、`› 后端 pid/端口不变`；人工 M-09（T-M2a）。

### T-05g 生命周期状态机模块（纠偏 T-05，A-05）

- **上下文**：重启沿用旧参数、崩溃与未就绪并发、`spawn` error 未处理。plan §4.2。依赖：T-05b（`test:unit` 脚本）。
- **修改范围**：新增 `shell/src/backend.js`、`shell/test/unit/backend.test.js`。
- **估时**：2h
- **完成标准**：
  1. AC-002-2：就绪唯一条件 = HTTP 200 + `status=="ok"` + `data_ready===true`；端点文件存在/端口可连不算。
  2. AC-002-3：重启预算 3 次（0.5/1/1.5 s），就绪不清零，用尽 → `failed(restart_limit)`；用户重试清零；旧代际事件被忽略、同一时刻最多一个子进程。
  3. AC-007-2：超时先 kill 本代子进程再 `failed(health_timeout)`；退出码 3 + 标记 → `failed(code)` 不重启；`spawn` ENOENT → `backend_missing`。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … 就绪需 200+ok+data_ready`、`ok … 端点文件存在但 health 503 不就绪`。
  2. → 同上：`ok … 预算 3 次后 restart_limit 且就绪不清零`、`ok … retry 清零预算`、`ok … 旧代际事件被忽略`。
  3. → 同上：`ok … 超时先 kill 再 failed(health_timeout)`、`ok … 退出码 3 + 标记 → failed(code) 不重启`、`ok … spawn ENOENT → backend_missing`。

### T-05h 状态机接线（纠偏 T-05，A-05、A-08、A-19）

- **上下文**：把状态机接入主进程；`host.json` 移到 `<状态目录>/run/`；stdin pipe + `--exit-on-stdin-eof`。plan §4.2、§4.3。依赖：T-05g、T-05e、T-02b、T-02c。
- **修改范围**：`shell/main.js`；`shell/src/test-hooks.js`（快照补 `backend.phase/phases/gen/restarts/lastCode`）；新增 `shell/test/e2e/ready-quit.js`、`shell/test/e2e/health-fail.js`；`shell/check.js`（登记）。
- **估时**：1.5h
- **完成标准**：
  1. AC-003-1：真实后端就绪后 `request-quit` → 无 `data/.lock`、无 `data/mcp_endpoint.json`、端口已释放、`run/host.json` 已删、退出码 0。
  2. AC-002-2：假后端 `health-fail` → `phases` 从不含 `ready`，最终 `failed` 且 `lastCode=health_timeout`，无残留后端进程。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- ready-quit`：`PASS ready-quit › 无 .lock`、`› 无 mcp_endpoint.json`、`› 端口已释放`、`› host.json 已删`、`› 退出码 0`。
  2. → `cd shell && npm run check -- health-fail`（场景设置 `FAI_HEALTH_TIMEOUT_MS=3000`）：`PASS health-fail › phases 不含 ready`、`› lastCode = health_timeout`、`› 无残留后端`。

### T-05i 崩溃重启 / 上限 / 强杀自愈（AC-002-3、AC-003-3）

- **上下文**：plan §4.2、§4.5。依赖：T-05h（已含 T-02b）。
- **修改范围**：新增 `shell/test/e2e/crash-restart.js`、`restart-limit.js`、`kill-shell-recover.js`；`shell/check.js`（登记）；`shell/main.js` 仅限修复这些场景暴露的缺陷。
- **估时**：1.5h
- **完成标准**：
  1. AC-002-3：真实后端被 `taskkill` → 重新就绪、端口变化、`restarts=1`；假后端 `crash-after-ready:300` → `spawns.jsonl` 恰 4 条、同时存活后端 ≤ 1、`lastCode=restart_limit`（错误页与导出入口在 T-05j / T-08d 补断言）。
  2. AC-003-3：`taskkill /F` 只杀外壳 → 后端 5 s 内自行退出 → 同目录再启动就绪（陈旧锁/锁释放）。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- crash-restart restart-limit`：`PASS crash-restart › 重启后就绪且端口变化`、`› restarts = 1`；`PASS restart-limit › spawns 恰 4`、`› 同时存活后端 ≤ 1`、`› lastCode = restart_limit`；人工 M-16（T-M2b）。
  2. → `cd shell && npm run check -- kill-shell-recover`：`PASS kill-shell-recover › 后端 5 s 内退出`、`› 再启动就绪`。

### T-05j 启动页 + preload + 超时重试（纠偏 T-05，A-04、A-07）

- **上下文**：现窗口等就绪才创建、失败只弹框退出；preload 读固定参数。plan §3.3（`mode`、`getBackend`、`onShellStatus`、`retryStartup`、`openLogs`）、§4.1 第 2/5/8 步。依赖：T-05h。
- **修改范围**：新增 `shell/renderer/startup.html`、`shell/renderer/startup.js`、`shell/test/e2e/startup-visible.js`、`shell/test/e2e/timeout.js`；`shell/preload.js`；`shell/main.js`；`shell/test/e2e/restart-limit.js`、`health-fail.js`（补错误页断言）；`shell/check.js`。
- **估时**：2h
- **完成标准**：
  1. AC-001-2、AC-002-1：假后端 `slow-ready:3000` → 就绪前窗口已显示且页面状态文字为"正在启动/等待健康检查"；记录 `startup_timing`（15 s 判定留 M-02）。
  2. AC-007-2、WO-12（最近 AC：AC-007-2）：假后端 `hang` + `FAI_HEALTH_TIMEOUT_MS=3000` → `health_timeout` 页含"重试""查看日志"；点重试后 `gen` +1、无残留进程。
  3. AC-002-3（页面部分）：`restart-limit` 最终显示 `restart_limit` 错误页；`health-fail` 显示 `health_timeout` 页。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- startup-visible`：`PASS startup-visible › 就绪前窗口可见`、`› 状态文字为正在启动`、`› 日志含 startup_timing`。
  2. → `cd shell && npm run check -- timeout`：`PASS timeout › health_timeout 页含重试与查看日志`、`› 重试后 gen+1`、`› 无残留后端`。
  3. → `cd shell && npm run check -- restart-limit health-fail`：`PASS restart-limit › 显示 restart_limit 页`、`PASS health-fail › 显示 health_timeout 页`。

### T-05k 启动错误页（标记码）（AC-004-2、AC-004-3、AC-007-4）

- **上下文**：把后端标记码与外壳探测错误映射为可操作错误页（错误码表 plan §4.1）。依赖：T-05j、T-01c、T-01d。
- **修改范围**：`shell/renderer/startup.js`（错误码与文案表）；`shell/main.js`；新增 `shell/test/e2e/root-locked.js`、`root-unwritable.js`、`startup-disk-full.js`；`shell/check.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-004-2：真实后端 + 辅助 Python 进程持有写锁 → `data_root_locked` 页含路径、`restarts=0`（不自动重启）。
  2. AC-004-3：`icacls <dir> /deny %USERNAME%:(W)` → 错误页含该路径与"权限不足"，不改用临时目录；场景结束恢复 ACL。
  3. AC-007-4（启动期）：假后端 `startup-failed:disk_full` → `disk_full` 页，应用不崩溃。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- root-locked`：`PASS root-locked › 页面 code = data_root_locked`、`› 含路径`、`› restarts = 0`；人工 M-10（T-M2a）。
  2. → `cd shell && npm run check -- root-unwritable`：`PASS root-unwritable › 含路径与权限不足`、`› 数据目录未改到临时目录`、`› ACL 已恢复`；只读盘场景人工 M-11（T-M2a）。
  3. → `cd shell && npm run check -- startup-disk-full`：`PASS startup-disk-full › 页面 code = disk_full`、`› 主进程存活`。

### T-05l 目标页选择 / mock / 资源缺失（纠偏 T-05，A-12）

- **上下文**：前端路径解析无意义、无法区分"有意不带前端"与缺失；mock 模式不存在。plan §4.1 第 4/7 步。依赖：T-05j。
- **修改范围**：`shell/main.js`；`shell/src/paths.js`（打包资源路径、`app-config.json` 读取）；`shell/renderer/startup.js`、`onboarding.html`（mock 横幅）；新增 `shell/test/fixtures/frontend-stub/index.html`（无 CSP）、`shell/test/e2e/mock.js`、`frontend-missing.js`；`shell/check.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-002-4：`--mock` + `FAI_FRONTEND_DIST=test/fixtures/frontend-stub` → 页面回显 `mode==='mock'`、`getBackend()` 为 null、无后端子进程且 `spawns.jsonl` 不存在；不带前端时内置页显示 mock 横幅。真实前端 mock 集成【外部】。
  2. AC-007-3：`FAI_FRONTEND_DIST` 指向不存在目录 → `frontend_missing` 页（含路径），重试与打开日志可用，非白屏。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- mock`：`PASS mock › mode = mock`、`› getBackend = null`、`› 无后端进程`、`› 内置页 mock 横幅可见`。
  2. → `cd shell && npm run check -- frontend-missing`：`PASS frontend-missing › 页面 code = frontend_missing`、`› 含重试与打开日志`；人工 M-17（T-M2b）。

### T-06b 内置页纠偏（纠偏 T-06，A-10、A-11）

- **上下文**：`innerHTML` 拼接后端字符串；设置表单把遮蔽邮箱原样 PUT 回去；页面读固定参数。plan §3.4、§3.1.4。依赖：T-03b、T-05j。
- **修改范围**：`shell/renderer/onboarding.html`、`shell/renderer/onboarding.js`（`textContent`/`createElement`；只提交被修改的邮箱；改用 `getBackend()`）；新增 `shell/test/e2e/settings-sources.js`、`ui-masking.js`；`shell/check.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-005-3：设置页状态表含 eia「免凭证回退」；清除 key 后显示回到免凭证回退的提示（真实 key 验证留 M-14【外部】）。
  2. AC-005-4：key 输入框为 `password`；设置页只显示遮蔽邮箱；只改姓名保存后退出，运行器用 settings 核心 `load` 读出的邮箱等于原值。e2e 不提交 key（会访问外网）。
  3. AC-009-2（内置页部分）：`onboarding.js` 不再使用 `innerHTML` 写入后端/用户字符串。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- settings-sources`：`PASS settings-sources › eia 显示免凭证回退`、`› 清除 key 后提示回退`、`› 组织类型下拉 12 项`（同时是回环 XHR 正对照；若失败按 plan §10 CORS 风险停止并报回 Plan）。
  2. → `cd shell && npm run check -- ui-masking`：`PASS ui-masking › key 输入为 password`、`› 显示遮蔽邮箱`、`› 真实邮箱未被覆盖`；人工 M-15（T-M2b）。
  3. → 静态核查（Converge/Review 执行）：`rg -n "innerHTML" shell/renderer` 无写入后端/用户字符串的命中。

### T-06c 引导路由与设置入口（纠偏 T-06，A-13）

- **上下文**：引导判定只在内置页内部；加载前端后无法进入设置；T-06b 后静态核出两旧场景与批准接口/路由冲突、无应用菜单测试驱动、无回到目标页的固定入口（`implementation-evidence.md` §10.4；plan §0 修订 5 ①～④）。设计权威：plan §3.3、§4.1 第 6 步与资源错误重试、§6.1 第 1～8、10、11 段、§8.3。依赖：T-06b、T-05l。
- **修改范围**（plan §6.1 第 10 段；T-06c/d 合计唯一可写集合）：`shell/main.js`（`routeToMain()`：就绪事件 / `fai:open-main` / `frontend_missing`·`renderer_crashed` 重试共用，只读真实 `GET /settings/profile`；`openSettings(via)`；应用菜单 `fai-settings`；钩子启用时 `records.navigation`）；`shell/preload.js`（新增无参数 `openSettings()`、`openMain()`）；`shell/renderer/onboarding.html`、`onboarding.js`（保存并继续/跳过后 `openMain()`、`#back-main`、删除全部 `location.reload()`）；`shell/src/test-hooks.js`（**只**加 `records.navigation` 初始化与 `app-menu-click` 一个命令分支）；`shell/test/e2e/startup-visible.js`（**只**替换严格五项断言为 §6.1 第 6 段四条）；`shell/test/e2e/frontend-missing.js`（**只**加 §6.1 第 7 段核心前提与一条断言）；新增 `shell/test/e2e/onboarding.js`、`onboarding-skip.js`；`shell/test/e2e/index.js`（按序追加登记）；`specs/desktop-shell/implementation-evidence.md`（只追加）。其余全部只读（§6.1 第 10 段）；`settings-sources`、`ui-masking`、`mock` 不改，只需在新路由下继续通过（它们用 `url.endsWith('/onboarding.html')`，§6.1 第 3 段保证不加 query/hash）。
- **估时**：2h（修订 5）
- **完成标准**：
  1. AC-005-1、WO-01（最近 AC：AC-005-1）：全新目录第一次运行进引导 → 保存并继续 → 设置区；真实核心读出 `completed=true, skipped=false` 与档案；第二次运行直接进目标页（内置设置页）。
  2. AC-005-2、WO-05（最近 AC：AC-005-2）：已配置前端夹具时全新根仍先进引导；"跳过"→ 前端夹具（主界面）；`app-menu-click {item:"settings"}` 调用真实菜单项 `click` → 设置区，`records.navigation` 含 `{action:'open-settings', via:'app-menu', result:'opened'}`；保存档案；`#back-main` → `openMain()` → 前端夹具；真实核心读出 `skipped=true` 与补填字段（托盘入口在 T-07b）。
  3. AC-005-2（接缝契约，plan §6.1 第 5 段）：`app-menu-click` 的 `item` 缺失或非 `settings` → 400 `unknown_menu_item`；命令本身不导航，效果只经真实菜单回调产生。
  4. AC-009-2 / plan §3.3（preload 面不扩大）：`startup-visible` 的成员断言为 APPROVED 18 项全集外成员 `[]`、REQUIRED_NOW 7 项缺失 `[]`、类型契约、FORBIDDEN 出现 `[]`；该场景其余断言不变。
  5. AC-007-3（保持）：`frontend-missing` 先用真实核心 `set_onboard_state(root, completed=True)` 再首启，原有缺失页 / 打开日志 / 补齐后重试成功 / 重载不重启后端 / `getBackend` 当前端口 / 后端缺失分支 / 清理断言**全部保留不改**。
- **验证**（待新增；cwd `shell`，最后源码上）：
  1. → `npm run check -- onboarding`：`PASS onboarding › 首次进入引导`、`› 保存后进入设置区`、`› 真实核心 completed=true skipped=false`、`› 第二次运行进入设置页`。
  2. → `npm run check -- onboarding-skip`：`PASS onboarding-skip › 有前端时仍先进入引导`、`› 跳过后进入主界面`、`› 菜单设置… 打开设置页`、`› navigation 记录 app-menu`、`› 档案可保存`、`› 返回主界面回到前端`、`› 真实核心 skipped=true`、`› 未知菜单项 400`；人工 M-13（T-M2b）。
  3. → `npm run check -- startup-visible`：`PASS startup-visible › 仅批准的 preload 成员`、`› 当前必需成员齐全`、`› 成员类型符合契约`、`› 不暴露高权限对象或任意导航`，其余原断言名照旧通过。
  4. → `npm run check -- frontend-missing settings-sources ui-masking mock`：`PASS frontend-missing › 真实核心设置引导完成` + 全部原断言名；另三场景原断言全部通过（未改文件）。
  5. → `npm ci`；`npm run test:unit`（现有单测全部通过、0 skip）；无参数 `npm run check`（**18** 个登记场景、0 failures；T-06d 后为 19）。
- **修订 5 执行细则**：
  - 顺序：main/preload/菜单/路由 → test-hooks 命令 → onboarding.* 导航 → 两旧场景兼容 → 两新场景与登记 → 验证 → 证据追加。
  - 静态核对（Converge 复核）：`rg -n "location\.reload" shell/renderer` 无命中；`git diff --stat 4b0c3c5 -- shell` 只含修改范围内文件；`rg -n "app-menu-click" shell/src/test-hooks.js` 仅一个分支且以 `=== 'settings'` 精确比较；`git status --short --ignored shell` 新场景不被忽略。
  - 停止规则（plan §6.1 第 11 段）：`file://` 请求被 CORS/OPTIONS/权限阻止；驱动菜单需比 §6.1 第 5 段更高权限（如主进程任意 JS）或 `MenuItem.click()` 不能编程执行生产回调；任何旧场景只有改动范围外文件或弱化断言才能通过；路由需要改后端/settings 核心。出现即停，写证据报协调者。
  - 禁止：隐藏/按场景裁剪 bridge；在钩子或夹具伪造引导状态；为场景改生产路由优先级；`eval` 调 `openSettings()` 冒充菜单证据；给 `loadFile` 加 query/hash。
  - 回滚：只回退上述 `shell/` 文件即回到 T-06b 检查点。

### T-06d 内置页注册指引：消费核心结果、缺项先引导（AC-005-3，Analyze 迭代 5）

- **上下文**（修订 5 设计权威：plan §6.1 第 9 段）：现 `renderPrefill(profile)` 用遮蔽后的 `/settings/profile` 自拼字段：Category 显示 key、缺 Reason for use、忽略 `missing_for_registration`，缺项时仍可打开注册页。改为只渲染 T-03c 端点返回的核心结果。plan §3.1.4"隐私区分"、§9 AC-005-3。依赖：T-03c、T-06c（同一页面文件串行；引导/设置导航已就绪）。
- **修改范围**：`shell/renderer/onboarding.html`、`shell/renderer/onboarding.js`（删除 `renderPrefill`；新增"准备注册信息"按钮：点击后请求 `/settings/registration-guide`，用 `textContent`/`createElement` 渲染；缺项时列出缺项与核心 `hint`、定位档案表单对应输入框、不显示"打开注册页"；齐全时显示五项指引与 `notes`，"打开注册页"使用响应中的 `submit.url`；指引区只读、不在任何表单内、离开设置页清空）；新增 `shell/test/e2e/registration-guide.js`；`shell/test/e2e/index.js`（登记）；`specs/desktop-shell/implementation-evidence.md`（只追加）。修订 5 细则：删除写死的 `REGISTER_URL`；`#prepare-guide` 按钮、`#guide` 只读区（只含文本元素，无 `input`/`textarea`/`select`）；只在点击后经 `getBackend()` 当前端点与令牌请求、`cache:'no-store'`；齐全时才创建 `#open-register`，用核心 `submit.url` 经 `window.open` → `setWindowOpenHandler` → `openExternal`；缺项时元素带 `data-missing=<字段名>`、焦点移到 `#profile-form` 第一个缺项输入框；`openMain()`/`openSettings()` 重载即清空，不写 `localStorage`/`sessionStorage`/IndexedDB；不提交 key、不访问网络（EIA/上游）。其余文件只读（plan §6.1 第 10 段）。
- **估时**：1.5h
- **完成标准**：
  1. AC-005-3（预填）：运行器启动前用 settings 核心写入完整加密档案（真实后端）→ 点击"准备注册信息"后指引五项文本等于核心值（Category 为官方标签、含 Reason for use、Email 为档案真实值）→ 点击"打开注册页"→ `openExternal` 记录器恰收到核心返回的注册页 URL；全程不访问 EIA（`openExternal` 只记录不打开）。
  2. AC-005-3（缺项引导，settings AC-003-1）：缺 last_name/email/sector 的档案 → 指引区列出三项缺项与核心提示、页面无"打开注册页"、`openExternal` 记录为空；key 粘贴输入框与"验证并保存"按钮仍可用（已有 key 不必重新注册）。
  3. AC-005-4（隐私区分）：点击前指引区为空；普通档案表单仍只显示遮蔽邮箱；指引区元素不位于任何 `<form>` 内。日志/诊断中不含邮箱由 T-08d `diagnostics-privacy`（其流程包含打开指引）作为它自己的完成标准证明。
  4. AC-005-3、AC-005-4（修订 5，plan §6.1 第 9 段）：缺项时焦点移到第一个缺项输入框；`openMain()`/`openSettings()` 重载后指引清空且未写入 Web 存储；全程不提交 key、不访问网络；无参数 `npm run check` 19 个登记场景 0 failures，静态无 `renderPrefill`/`REGISTER_URL`/`location.reload`。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- registration-guide`：`PASS registration-guide › 完整档案 指引五项等于核心值`、`› Category 为官方标签`、`› 含 Reason for use`、`› openExternal 收到核心 URL`。
  2. → 同上：`PASS registration-guide › 缺项档案 列出三项缺项`、`› 无打开注册页`、`› openExternal 记录为空`、`› key 输入与验证按钮可用`。
  3. → 同上：`PASS registration-guide › 点击前指引区为空`、`› 档案表单邮箱为遮蔽值`、`› 指引区不在表单内`；人工 M-14、M-15（T-M2b）。
  4. → 同上（修订 5）：`PASS registration-guide › 缺项焦点在第一个缺项输入框`、`› 离开后指引清空`、`› 未写入 Web 存储`；随后 cwd `shell`：`npm ci`；`npm run test:unit`（0 skip）；`npm run check -- startup-visible frontend-missing onboarding onboarding-skip registration-guide settings-sources ui-masking`；最终无参数 `npm run check`（**19** 个登记场景、0 failures）；静态 `rg -n "renderPrefill|REGISTER_URL|location\.reload" shell/renderer` 无命中。

### T-07a 活动归约器 + 事件夹具来源

- **上下文**：托盘/通知/退出守卫的唯一状态来源。plan §3.5。依赖：T-05e（钩子加载夹具）。
- **修改范围**：新增 `shell/src/activity.js`、`shell/test/unit/activity.test.js`、`shell/test/e2e/events-invalid.js`；`shell/src/test-hooks.js`（`FAI_TEST_EVENTS` 文件加载，非法 → 退出码 4）；`shell/check.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-003-4（逻辑）：等待退出时排队项 → `cancelled_on_exit`，新到 `job.queued/started` → `rejected_exiting`，均出现在副作用（日志/提示）中。
  2. AC-006-2（逻辑）、WO-06（最近 AC：AC-006-2）：`stage_completed`/`verification.pending`/`intervention.conflict`/`backend.error` 产生对应通知种类；托盘状态 error > running > idle；`notifications=false` 时不产生通知副作用但托盘状态照常（AC-006-3 逻辑）。
  3. AC-006-2、AC-003-4（其 e2e 的夹具前提；不证明真实作业）：`FAI_TEST_EVENTS` 只接受事件数组文件路径（plan §3.5）；非法 → 退出码 4 + `TEST_EVENTS_INVALID`。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … 等待退出时排队项标 cancelled_on_exit`、`ok … 等待退出时新作业标 rejected_exiting`。
  2. → 同上：`ok … 四类事件产生对应通知种类`、`ok … 托盘状态 error>running>idle`、`ok … 通知关闭时托盘状态仍更新`。
  3. → `cd shell && npm run check -- events-invalid`：`PASS events-invalid › 退出码 4`、`› 输出 TEST_EVENTS_INVALID`。

### T-07b 托盘 / 关窗行为 / 托盘菜单（AC-006-1、AC-006-4、WO-07）

- **上下文**：现关窗即退出、无托盘。plan §4.3 第 1 步、§3.5。依赖：T-07a、T-06c。
- **修改范围**：`shell/main.js`（Tray、`closeBehavior`、托盘菜单：打开主窗口/运行中作业/设置…/退出）；新增 `shell/test/e2e/close-to-tray.js`、`close-quit.js`、`tray-menu.js`；`shell/check.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-006-1：事件夹具运行中作业 + `close-window` → 窗口隐藏未销毁、后端存活、托盘状态 `running`（夹具驱动；真实作业【外部】）。
  2. WO-07（最近 AC：AC-006-1；Q-003）：预置 `closeBehavior:"quit"` 的偏好文件 → `close-window` 走退出流程，进程退出码 0。
  3. AC-006-4、WO-05：托盘菜单标签含"打开主窗口""运行中作业""设置…""退出"；点击后窗口可见、子菜单列出夹具作业标题、设置页打开、"退出"调用退出入口（"导出诊断"在 T-08d 补）。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- close-to-tray`：`PASS close-to-tray › 窗口隐藏未销毁`、`› 后端存活`、`› 托盘 running`。
  2. → `cd shell && npm run check -- close-quit`：`PASS close-quit › 关窗后退出码 0`。
  3. → `cd shell && npm run check -- tray-menu`：`PASS tray-menu › 菜单标签齐全`、`› 打开主窗口后可见`、`› 子菜单列出作业`、`› 设置… 打开设置页`、`› 退出调用 requestQuit`；人工 M-05、M-07（T-M2a）。

### T-07c 退出守卫（AC-003-2、AC-003-4、WO-02）

- **上下文**：plan §3.5 退出守卫、§4.3 第 2 步。依赖：T-07b。
- **修改范围**：`shell/main.js`（`requestQuit`、对话框、等待模式、托盘"取消退出"）；新增 `shell/test/e2e/quit-guard-cancel.js`、`quit-guard-wait.js`；`shell/check.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-003-2：运行中作业 + 应答"取消退出" → 应用与后端仍在、作业仍为运行中。
  2. AC-003-4、WO-02（最近 AC：AC-003-2）：应答"等待完成后退出" → 对话框列出排队作业；排队项 `cancelled_on_exit`、等待期间新到作业 `rejected_exiting` 写入日志与托盘提示；运行中作业 `job.finished` 后自动优雅退出（退出码 0）。只证明外壳侧语义，后端 drain【外部】。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- quit-guard-cancel`：`PASS quit-guard-cancel › 应用仍在`、`› 后端存活`、`› 作业仍运行`。
  2. → `cd shell && npm run check -- quit-guard-wait`：`PASS quit-guard-wait › 对话框列出排队作业`、`› 日志含 cancelled_on_exit`、`› 日志含 rejected_exiting`、`› 作业结束后退出码 0`；人工 M-08（T-M2a）。

### T-07d 设置"应用"区（偏好与数据目录）（AC-004-4、AC-006-3 入口）

- **上下文**：plan §6、§3.3（`getShellPrefs`/`setShellPrefs`/`chooseDataRoot`/`relaunch`）、§4.6。依赖：T-06c。
- **修改范围**：`shell/renderer/onboarding.html`、`onboarding.js`（"应用"区：关窗行为、通知开关、更新检查开关、数据目录）；`shell/preload.js`；`shell/main.js`（IPC 入口校验、目录选择校验）；新增 `shell/test/e2e/change-root.js`、`shell/test/e2e/prefs-ui.js`；`shell/check.js`。
- **估时**：2h
- **完成标准**：
  1. AC-004-4：`answer` 预置目录 → `chooseDataRoot()` 设置 pending → 退出 → 再启动在新目录就绪、偏好 `dataRoot` 为新目录、旧目录哨兵文件仍在；非绝对路径/当前目录/安装目录内被拒（"立即重启"留 M-12）。
  2. AC-006-3（入口）：`prefs-ui` 场景在设置页点击通知开关与关窗行为 → `shell-prefs.json` 持久化 `notifications=false` 与所选 `closeBehavior`；再次启动界面回显；非法 patch 返回 `{error}` 且文件不变（WO-07 的设置入口，最近 AC：AC-006-1）。通知是否真正被抑制由 T-07e 证明，不是本任务完成前提。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- change-root`：`PASS change-root › 新目录就绪`、`› 偏好 dataRoot 为新目录`、`› 旧目录哨兵仍在`、`› 非法目录被拒`；人工 M-11、M-12（T-M2a）。
  2. → `cd shell && npm run check -- prefs-ui`：`PASS prefs-ui › notifications=false 已持久化`、`› closeBehavior 已持久化`、`› 再次启动回显`、`› 非法 patch 被拒且文件不变`。

### T-07e 系统通知（AC-006-2、AC-006-3、WO-06）

- **上下文**：plan §3.5 通知、§7.3 `setAppUserModelId`。依赖：T-07a、T-07d、T-05i。
- **修改范围**：`shell/main.js`（通知派发、`app.setAppUserModelId`、`backend.error/ready` 事件接入）；新增 `shell/test/e2e/notify.js`、`notify-off.js`；`shell/test/e2e/crash-restart.js`（补通知/托盘断言）；`shell/check.js`。
- **估时**：1h
- **完成标准**：
  1. AC-006-2：`stage_completed` 事件 → 通知记录器收到 `stage_completed` 一条（系统 toast 观感留 M-06）。
  2. AC-006-3：预置 `notifications=false` 的偏好文件（界面写入由 T-07d `prefs-ui` 证明）+ 同事件 → 通知记录为空、托盘状态仍变化。
  3. WO-06（最近 AC：AC-006-2）：真实后端崩溃重启时通知记录含 `backend_error`、托盘短暂为 `error`。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- notify`：`PASS notify › 收到 stage_completed 通知`。
  2. → `cd shell && npm run check -- notify-off`：`PASS notify-off › 无通知记录`、`› 托盘状态仍变化`。
  3. → `cd shell && npm run check -- crash-restart`：`PASS crash-restart › 通知含 backend_error`、`› 托盘曾为 error`；人工 M-06（T-M2a，安装版）。

### T-08a 脱敏 + 滚动日志模块（AC-010-1）

- **上下文**：现日志只追加不滚动。plan §3.7。依赖：T-05b。
- **修改范围**：新增 `shell/src/redact.js`、`shell/src/logger.js`、`shell/test/unit/redact.test.js`、`shell/test/unit/logger.test.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-010-1：小上限写满 → 每类文件数 ≤ 5、单文件 ≤ 上限。
  2. AC-009-4（第二层）：当次令牌、`Bearer x`、`api_key=`/`"key":`/`token=` 值、邮箱、用户主目录前缀被替换（阳性用例）。
  3. AC-007-4（日志部分）：写入时注入 ENOSPC 不抛出，置 `logWriteError`。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … 滚动后文件数 ≤ 5 且单文件 ≤ 上限`。
  2. → 同上：`ok … 脱敏：令牌/Bearer/key/token/邮箱/主目录`。
  3. → 同上：`ok … ENOSPC 不抛出并置 logWriteError`。

### T-08b 日志接线与崩溃现场（AC-010-3）

- **上下文**：plan §3.7 日志位置、崩溃现场；设置页"诊断"区。依赖：T-08a、T-05h、T-07d。
- **修改范围**：`shell/main.js`（`<dataRoot>/log/` 与 `bootstrap.log`、后端输出逐行捕获 + 200 行环形缓冲、`session.json`、`last-crash.json`、`render-process-gone`/`child-process-gone`）；`shell/preload.js`（`getLastCrash`）；`shell/renderer/onboarding.*`（诊断区：上次异常、日志写入错误、打开日志目录）；新增 `shell/test/e2e/crash-record.js`；`shell/check.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-010-3：`taskkill /F` 外壳 → 再启动 `getLastCrash()` 为 `shell_unclean_exit`；结束后端 → `backend_crash` 含退出码与已脱敏尾部；设置页诊断区显示时间与原因。
  2. AC-010-1（接线）：日志写到 `<dataRoot>/log/shell.log`、`backend.log`。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- crash-record`：`PASS crash-record › shell_unclean_exit`、`› backend_crash 含退出码与尾部`、`› 诊断区显示上次异常`。
  2. → 同上：`PASS crash-record › 日志位于 <dataRoot>/log/`；人工 M-24（T-M2c）。

### T-08c 诊断包模块（AC-010-2、AC-009-4）

- **上下文**：plan §3.7 诊断包；ZIP 用 `zlib.deflateRawSync` + 模块内 CRC-32 查表（不用 `zlib.crc32`，零新增依赖）。依赖：T-08a。
- **修改范围**：新增 `shell/src/diagnostics.js`、`shell/test/unit/diagnostics.test.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-010-2（逻辑）：只生成白名单条目（`manifest.json`、`env.json`、`process.json`、`log/*`、可选 `crash/last-crash.json`）；保留最近 5 份。
  2. AC-009-4（逻辑）：数据目录中白名单外的文件（`creds/`、`profile/`、`docs_in/`、`knowledge/`、`host.json` 等）不进入条目集合。
  3. AC-007-4（诊断部分）：写 ZIP 遇 ENOSPC 返回 `{error}` 而不抛出。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … CRC-32 标准向量 123456789 = cbf43926`、`ok … 条目集合等于白名单`、`ok … 只保留最近 5 份`。
  2. → 同上：`ok … 白名单外文件不入包`。
  3. → 同上：`ok … ENOSPC 返回 error 不抛出`。运行时 ZIP 正确性只认 T-08d（真实 Electron）。

### T-08d 诊断导出入口 + 隐私 e2e（AC-009-4、AC-010-2、AC-002-3、WO-09、WO-11）

- **上下文**：plan §3.7、§9 AC-009-4。依赖：T-08b、T-08c、T-07b、T-05j、T-06d。
- **修改范围**：`shell/main.js`（导出 IPC、托盘"导出诊断"、`showItemInFolder`）；`shell/preload.js`（`exportDiagnostics`）；`shell/renderer/startup.js`、`onboarding.*`（导出按钮）；新增 `shell/test/e2e/diagnostics-privacy.js`；`shell/test/e2e/restart-limit.js`、`tray-menu.js`（补导出断言）；`shell/check.js`。
- **估时**：2h
- **完成标准**：
  1. AC-009-4、AC-005-4（诊断部分）、WO-09（最近 AC：AC-009-4）：预置哨兵（运行器在启动前用真实 `creds.put` 写入 `FAIPLANT-KEY-…`、档案邮箱 `plant.user@example.test`、`docs_in/`/`knowledge/` 下含 `FAIPLANT-DOC-…` 的文件）→ 跑引导/设置（含点击"准备注册信息"显示指引，使档案邮箱哨兵出现在界面）/崩溃重启后导出 → `%SystemRoot%\System32\tar.exe -xf`（bsdtar，绝对路径；PATH 上的 `tar` 可能是不能读 ZIP 的 GNU tar）解压成功，所有条目与 `<dataRoot>/log/` 均不含任一哨兵与当次令牌，条目集合 ⊆ 白名单。
  2. AC-010-2、WO-11（最近 AC：AC-010-2）：ZIP 由真实 Electron 写出并可被 `%SystemRoot%\System32\tar.exe` 解压（CRC 正确），`manifest.json` 版本 = `package.json`，含 `env.json`、`process.json`、`log/`；快照记录 `versions.node`（Electron 内嵌 Node）。
  3. AC-002-3（导出入口）：`restart_limit` 页点击"导出诊断"后 ZIP 存在；托盘菜单含"导出诊断"并可用。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- diagnostics-privacy`：`PASS diagnostics-privacy › tar 解压成功`、`› 无哨兵命中`、`› 无令牌命中`、`› 条目 ⊆ 白名单`。
  2. → 同上：`PASS diagnostics-privacy › manifest 版本 = package.json`、`› env/process/log 齐全`。
  3. → `cd shell && npm run check -- restart-limit tray-menu`：`PASS restart-limit › 导出诊断生成 ZIP`、`PASS tray-menu › 导出诊断可用`；人工 M-23（T-M2c）。

### T-08e 渲染层安全（AC-009-2、AC-009-3、WO-10，A-18）

- **上下文**：plan §3.4（白名单只挂 `defaultSession`，回环仅 `xhr`/`webSocket`）、§8.3（host-resolver-rules、回环夹具服务）、§9 AC-009-2。依赖：T-05l、T-06b。
- **修改范围**：`shell/main.js`（`webRequest` 白名单、`will-navigate` 收紧、`setWindowOpenHandler`）；`shell/src/test-hooks.js`（`host-resolver-rules`）；`shell/check.js`（回环夹具服务）；新增 `shell/test/e2e/csp.js`、`external-link.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-009-2：①无 CSP 的 `frontend-stub`：远程 script/iframe/fetch 与回环 script → 夹具服务 `Host: remote.fai.test` 命中 = 0、`/evil.js` 命中 = 0、`window.__remoteExecuted` 未定义、iframe 未加载；正对照回环 `fetch /ok` 200 且命中恰 1、经 `getBackend()` 的 `/health` fetch 200。②有 CSP 的内置引导页（真实后端）：远程命中 = 0、未执行；正对照：组织类型下拉 12 项。不断言拦截计数。
  2. AC-009-3：点击"打开 EIA 注册页" → `openExternal` 记录器收到该 URL、窗口 URL 不变；`will-navigate` 到非 http(s) 协议被拒且不交给系统。
  3. WO-10（最近 AC：AC-009-2）：①中远程命中 = 0；静态核查主进程出站点只有更新检查与 `openExternal`。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- csp`：`PASS csp › 无CSP页 远程命中 = 0`、`› 远程脚本未执行`、`› iframe 未加载`、`› 回环脚本被拒`、`› 正对照 /ok = 200`、`› 正对照 后端 /health = 200`、`› 内置页 远程命中 = 0`、`› 内置页 正对照 12 项`。
  2. → `cd shell && npm run check -- external-link`：`PASS external-link › openExternal 收到 URL`、`› 窗口 URL 不变`、`› 非 http(s) 协议被拒`；人工 M-22（T-M2c）。
  3. → 同 1；静态核查（Converge/Review 执行）`rg -n "fetch\(|net\.request|http\.request|https\.request" shell/main.js shell/src` 只命中更新检查、后端本机调用与测试钩子控制通道；人工 M-26（可选，T-M2c）。

### T-08f 磁盘满界面路径（AC-007-4）

- **上下文**：plan §3.6 写入失败返回原因、§3.7 `logWriteError`、§3.1.6 507。依赖：T-08b、T-07d、T-03b。
- **修改范围**：`shell/main.js`（偏好写入失败与 `logWriteError` 透传）；`shell/renderer/onboarding.js`（507 → "磁盘空间不足，写入失败"；诊断区显示日志写入错误）；`shell/test/unit/prefs.test.js`（补用例）。
- **估时**：1h
- **完成标准**：
  1. AC-007-4：偏好写入 ENOSPC → 设置页显示具体原因；后端 507 → 设置页显示"磁盘空间不足"；日志写入失败在诊断区显示；应用不崩溃。
- **验证**：
  1. → `cd shell && npm run test:unit`（待新增）：`ok … setShellPrefs ENOSPC 返回 disk_full 原因`；后端 507 由 T-03b pytest 证明；界面文案的运行时表现由人工 M-18（可选，T-M2b）确认——**自动化未覆盖 507 的界面渲染**，此缺口记入 analyze.md。

### T-09a 更新模块（AC-008-2、AC-008-3、WO-08）

- **上下文**：plan §3.8。依赖：T-05b。
- **修改范围**：新增 `shell/src/update.js`、`shell/test/unit/update.test.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-008-2（逻辑）：元数据 schema 入口校验（非法 → 检查失败）；`version` 只接受 `x.y.z` 并按数值比较；`notes` ≤ 4000 字符纯文本。
  2. AC-008-3（逻辑）：超时/网络错误/非 2xx → 结果为"检查失败"，不抛出。
  3. WO-08（最近 AC：AC-008-2）：`sha256` 64 位十六进制、`size` 正整数为必填。生产只接受 `https:`，测试钩子下只接受 `http://127.0.0.1:*`。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … 版本数值比较 0.10.0 > 0.9.9`、`ok … 非法 schema → 检查失败`。
  2. → 同上：`ok … 超时与非 2xx → 检查失败不抛出`。
  3. → 同上：`ok … sha256/size 必填`、`ok … 源协议限制`。

### T-09b 关于页（AC-008-1）

- **上下文**：plan §3.3 `getAppInfo`、§6 关于区；`build` 来自 `app-config.json`，开发期为 null。依赖：T-07d。
- **修改范围**：`shell/main.js`（`getAppInfo`）；`shell/preload.js`；`shell/renderer/onboarding.*`（关于区）；新增 `shell/test/e2e/about.js`；`shell/check.js`。
- **估时**：1h
- **完成标准**：
  1. AC-008-1：关于区显示版本（= `package.json`）、构建信息（开发期"开发构建（未打包）"）、Electron/Node 版本、后端版本。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- about`：`PASS about › 版本 = package.json`、`› 显示开发构建`、`› 后端版本非空`；打包后构建信息由 T-10d 与人工 M-19（T-M2c）确认。

### T-09c 更新检查接线与提示（AC-008-2、AC-008-3）

- **上下文**：plan §3.8；请求走独立内存分区 `fai-update`，不注册白名单；"稍后"为内存状态。依赖：T-09a、T-09b、T-08e（白名单已生效，验证分区隔离）、T-07e（通知）。
- **修改范围**：`shell/main.js`（就绪 10 s 后检查、`fai-update` 分区 `fetch`、`dismissUpdate`、`openUpdateDownload`）；`shell/preload.js`；`shell/renderer/onboarding.*`（更新提示）；`shell/check.js`（更新元数据端点）；新增 `shell/test/e2e/update-available.js`、`update-offline.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-008-2：回环夹具源提供更高版本 → 关于区显示版本与说明（`<b>` 按纯文本）、通知记录 1 条、"下载"→ `openExternal` 记录该 URL、"稍后"后本次运行不再提示；应用未自行下载。白名单生效下请求成功即证明分区隔离。真实发布通道【外部】。
  2. AC-008-3：源指向已关闭端口 → 应用正常就绪、对话框与通知记录为空、日志恰一行检查失败、关于区显示"上次检查失败"。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- update-available`：`PASS update-available › 显示新版本`、`› notes 按纯文本`、`› 通知 1 条`、`› 下载交给 openExternal`、`› 稍后后不再提示`；人工 M-20（T-M2c）。
  2. → `cd shell && npm run check -- update-offline`：`PASS update-offline › 正常就绪`、`› 无对话框`、`› 无通知`、`› 日志一行失败`；人工 M-21（T-M2c）。

### T-10a electron-builder 配置与 NSIS（仅配置）（AC-001-3、AC-001-4）

- **上下文**：plan §7.1、§7.3。只写配置并以单测自证；**不**运行 `npm run dist`——`extraResources` 需要的 `dist/staging/app-config.json` 由 T-10c 的 `build.ps1` 第 5 步生成，首次打包在 T-10c。依赖：T-09c（打包最终外壳文件集）。
- **修改范围**：`shell/package.json`（`electron-builder` 精确版本 devDependency、脚本 `dist`）；`shell/package-lock.json`；新增 `shell/electron-builder.config.js`、`shell/installer/installer.nsh`、`shell/test/unit/builder-config.test.js`。
- **估时**：1.5h
- **完成标准**：
  1. AC-001-3（配置）：NSIS 按用户安装、允许改目录、`deleteAppDataOnUninstall:false`、`include: installer/installer.nsh`；`customUnInstall` 只删 `FuturesAI-Shell\session` 与 `run`，不触碰 `FuturesAI` 数据目录与 `shell-prefs.json`（实际卸载效果留 M-03）。
  2. AC-001-4（配置）：`files` 白名单 = `main.js`、`preload.js`、`src/**`、`renderer/**`、`package.json`；`extraResources` 指向 `../backend/dist/futuresai-backend` 与 `dist/staging/app-config.json`；`npm ci` 由 lockfile 驱动。
- **验证**（待新增）：
  1. → `cd shell && npm ci && npm run test:unit`：`ok … builder-config：NSIS 按用户安装/可改目录/不删 AppData`、`ok … builder-config：customUnInstall 只删 session 与 run`（读取真实 `electron-builder.config.js` 与 `installer/installer.nsh`，不生成安装包）。
  2. → 同上：`ok … builder-config：files 白名单`、`ok … builder-config：extraResources 指向后端产物与 staging 配置`、`ok … package.json dist 脚本与 electron-builder 精确版本`；`npm ci` 成功即 lockfile 一致。electron-builder 选定版本由实施者记入 review。

### T-10b 包内容扫描（夹具验收）（AC-001-4）

- **上下文**：plan §7.4。扫描器以临时目录正/负夹具独立验收；对真实 `dist/win-unpacked` 的扫描首次在 T-10c（`build.ps1` 第 7 步）。依赖：T-10a（白名单来源一致）。
- **修改范围**：新增 `shell/tools/scan-package.js`、`shell/test/unit/scan-package.test.js`。
- **估时**：1h
- **完成标准**：
  1. AC-001-4：黑名单任一命中 → 退出码非 0 并列出路径；`resources/app/` 下存在白名单外条目 → 失败；干净目录 → 退出码 0。
- **验证**（待新增）：
  1. → `cd shell && npm run test:unit`：`ok … 黑名单命中失败`、`ok … 白名单外条目失败`、`ok … 干净目录通过`（临时目录夹具，子进程运行真实 `tools/scan-package.js`）。

### T-10c `build.ps1`：首次打包 + 产物扫描 + 校验和（AC-001-4、AC-001-3、WO-08、AC-001-1 构建部分）

- **上下文**：plan §7.2 八个步骤；第 5 步生成 staging 配置后第 6 步才首次运行 `npm run dist`，第 7 步扫描真实产物。依赖：T-04b、T-10b。
- **修改范围**：新增 `packaging/build.ps1`（兼容 Windows PowerShell 5.1）。
- **估时**：2h
- **完成标准**：
  1. AC-001-4、AC-001-1（构建）：按 §7.2 顺序失败即停：三处 `VERSION` 一致断言、PyInstaller 版本断言、后端构建与 `shell_check.py`、`shell/dist/staging/app-config.json` 生成、`npm ci`→`test:unit`→`dist`、对真实 `dist/win-unpacked` 运行 `scan-package.js`。
  2. AC-001-3（安装器产物）：第 6 步生成 NSIS 安装包（卸载效果仍只由 M-03 判定）。
  3. WO-08（最近 AC：AC-008-2）：生成 `shell/dist/SHA256SUMS.txt`；传 `-ReleaseBaseUrl` 时生成符合 §3.8 schema 的 `update-metadata.json`。
- **验证**（待新增）：
  1. → 仓库根目录 `powershell -ExecutionPolicy Bypass -File packaging/build.ps1`：退出码 0，日志依次出现 8 个步骤且第 7 步扫描通过；随后 `cd shell && node tools/scan-package.js dist/win-unpacked` 单独复跑退出码 0；版本不一致的失败分支由代码审阅核对（不人为制造不一致）；人工 M-04（T-M1）。
  2. → 同上：`shell/dist/` 下存在 NSIS 安装包；人工 M-03（T-M1）。
  3. → 同上后 `Get-FileHash shell/dist/*.exe -Algorithm SHA256` 与 `SHA256SUMS.txt` 一致；人工 M-25（T-M1）。

### T-10d 打包产物 e2e（AC-001-1 过渡、AC-001-2、AC-001-4）

- **上下文**：plan §9 AC-001-1。用 `dist/win-unpacked/FuturesAI.exe` + 测试钩子（打包内 `src/test-hooks.js`）。依赖：T-10c。
- **修改范围**：新增 `shell/test/e2e/packaged-ready.js`；`shell/check.js`（登记）。
- **估时**：1h
- **完成标准**：
  1. AC-001-1（Q-009 过渡，受测机）：打包产物以随包后端就绪，`getAppInfo().build` 非 null，退出清理同 `ready-quit`。干净机【外部】。
  2. AC-001-2：打包产物就绪前显示启动页；记录 `startup_timing`（15 s 判定只在基准机 M-02）。
- **验证**（待新增）：
  1. → `cd shell && npm run check -- packaged-ready`：`PASS packaged-ready › 随包后端就绪`、`› build 信息非空`、`› 退出后无 .lock`；人工 M-01（T-M1）。
  2. → 同上：`PASS packaged-ready › 就绪前启动页可见`；人工 M-02（T-M1，基准机）。

---

## 人工验收批次（非 Implement 代码任务）

执行人：Walter 或其指定的人，在 Implement 与 Converge 之后执行 `manual-acceptance.md` 的步骤；结果由协调者按该文件模板记入 `review.md`。未执行的 M-ID 记为"未执行"，夹具类记"夹具"，不得写成真实业务或真实发布已验证。

| 批次 | M-ID | 环境 | 承载 |
|---|---|---|---|
| T-M1 | M-01、M-02、M-03、M-04、M-25 | 干净机（优先）/ 过渡机；M-02 判定须基准机 | AC-001-1～4、WO-08 |
| T-M2a | M-05～M-12 | 安装版（M-06 必须安装版）或开发版 | AC-006-1～4、AC-003-2/4、AC-004-1～4 |
| T-M2b | M-13～M-18 | 同上；M-14 需真实 EIA key（外部）；M-18 可选（管理员） | AC-005-1～4、AC-002-3、AC-007-3/4 |
| T-M2c | M-19～M-24、M-26（可选） | 同上 | AC-008-1～3、AC-009-1/3/4、AC-010-2/3、WO-10 |

## 不在本 feature 任务内（plan §10 / plan-gaps D）

- plan §10"有意不做"项（IPC 发送方校验、Job Object、元数据签名、应用内下载、数据目录迁移、日志加密、偏好自动重置、多窗口）不进入任何任务；如要做需 Walter 先批准。
- WO-03（未完成批次按后端既有约定处理）无新任务：沿用 data-layer `stale_running()`；回归命令（现有）`cd backend && python -m pytest tests/test_store.py tests/test_review_round20.py -q`，作为 T-04b 全量回归的一部分。
- 外部缺口：真实 `frontend-workbench` 产物与 `window.futuresai` 采纳、作业引擎与后端 drain、agent、发布通道、干净机、基准机、真实 EIA key、系统通知观感、真实满盘、代码签名。

## 实施进度

| 范围 | 状态 |
|---|---|
| T-01～T-06 | 历史阶段代码（见上表），未在本轮复验 |
| T-01b/c/d、T-02b/c、T-03b/c（7 项） | 本批后端范围复验通过；前轮六文件 + 凭证扫描 85 passed / 全量 451+5，本轮含新打包测试全量 **454 passed / 5 online skips**；不代表相同 AC 的 GUI/外部子句完成，详见 `implementation-evidence.md` |
| T-04b | **后端范围完成，原打包扫描阻塞解除**：Plan 修订 4 / Analyze 7 / A 新复查 41/41 后，Astra 从 `3a9ec35` 验证：聚焦 3 passed、全量 454+5、真实干净重建退出 0、未修改冒烟 **12/12**、清单仅移除目标测试资产 **17**（新增/其他移除 0）。实施提交 `c1e33e0`；旧失败与构建警告保留，黑名单未改；已知 PYZ 纯模块残余仍为 P3，见 `implementation-evidence.md` §6 |
| T-05b/c/d/m/e/f（6 项） | **本批自动化检查点完成**：Astra 从 `83b91db` 实施，源码提交 `a643f81`；最终 npm ci 成功、34 unit / 0 skip、真实 Electron 2 场景 / 37/37 断言；单实例后端 spawn 与事件恰 1，首后端 PID/port 不变；不把基础设施/夹具写成真实业务、M-09 或整体 AC 完成，详见 `implementation-evidence.md` §7 |
| T-05g/h/i/j/l（5 项） | 本批实现/自动化检查点通过：状态机、真实后端清理恢复、启动页与资源/mock；最后完整42unit、14场景213/213；实施提交 `f7d347b`，不代表整feature/人工/业务验收 |
| T-05k（1 项） | 实现/末次验证通过；A专项评估 **RL-01=P3 OPEN/UNKNOWN、非阻塞**，不再暂阻T-06b。原10s根因未确认，安全时间线已加，生产零改；整体Converge/Review前必须补对照，不能称已修/用户接受，详见 `root-lock-risk-review.md` v2 / 证据§9 |
| T-06b（1 项） | 本任务自动化子句通过：42unit/0skip、16场景236/236，两个新真实设置场景23/23；file-origin GET/PUT/DELETE实证成功，backend/安全未改，实施d77ce69，见证据§10 |
| T-06c/d（2 项） | 未实施：旧接口枚举/资源场景前提与新批准路由冲突，且缺真实菜单驱动；先Plan/Tasks/Analyze与A明确最小兼容范围/方案后继续，不直接改断言或控制面 |
| T-07a 起其余 18 项（含 T-07～T-10） | ⬜ 未开始；待本批后按依赖串行从T-07a推进；RL对照等条件仍需整体Converge/Review前另行安排，不因非阻塞漏项 |
| T-M1、T-M2a～c | ⬜ 未执行 |
