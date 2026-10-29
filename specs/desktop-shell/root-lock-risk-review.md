# desktop-shell：T-05k root-locked 风险独立技术评估（root-lock-risk-review.md）

> 按 `templates/review.md` 结构裁剪的**窄范围补充评审**。只针对 HANDOFF §13 授权的"T-05k root-locked 一次未解释 10s 超时"做独立代码 / 测试 / 证据判断。
> **不是** AGENTS §2 的整 feature Review，**不是** Converge，**不是** Gate 2，**不是**用户风险接受；不认证 T-05k 之外的任何任务，不替 Walter 授予任何批准。

## 0. 评审头

| 项 | 记录 |
|---|---|
| 审核员 A 请求路由 | `anthropic/claude-fable-5-1` via 官方 API（协调者 CLI 固定；bridge 同模型 seven_day 限额本窗口已知耗尽、未重试；本轮最小真实调用返回 `RISK_REVIEW_ROUTE_OK`）。未因发现问题换模型 |
| 会话身份 | 只读工具内无法读取会话 ID；协调者按会话元数据核实为 **`01a18632-84de-7247-b0ff-2a0d46152f95`**（协调者核实值，非本会话工具推断） |
| 独立性 | 新开会话，与实施 `openai/gpt-6-astra`、协调 `openai/gpt-6.1-sol` 隔离；单审 |
| 固定输入 | 私有树 `D:/2030/Futures-AI-desktop-lock-risk`，分支 `review/desktop-shell-root-lock-risk`，**HEAD `681d4bb09736c2cfec16ccda6f14b854acb8f181`**（审期未移动；无 commit / push / reset / merge） |
| 真实 diff | `lifecycle-code.diff`（`e0fe1cd..f7d347b`：main.js / 新 `src/backend.js` / test-hooks / 新 `root-locked.js` / 新 `backend.test.js`）；`observation.diff`（`35e5f78..681d4bb`：仅 `root-locked.js` +24/−2 与证据 §9，无生产行为改动）。`review-preflight.txt` 的 stat 与两份 diff 一致 |
| 证据指纹 | `risk-inputs.sha256` 列出的 18 个输入文件为本次阅读对象；协调者在本评审后复核 |
| 历史 FAIL 原件 | `handoff-artifacts/20261029-lifecycle/e2e-intermittent-failure.txt`（协调者记录 SHA `5f0bc33d…`，与 `%TEMP%/fai-lifecycle-01a185d9/e2e-final-2.log` 相同） |
| 新诊断 | `%TEMP%/fai-lockprobe-01a18620/{diag-1.log, e2e-final.log, root-locked-final.log}` 已读；`diag-2-profile.log` 原件**未读**（只采信证据 §9.2 给出的数值，并如此标注）；`diag-full.log`、`unit-final.log` 以证据 §9.4 为准 |
| 方法 | 只读阅读：AGENTS、docs/plan、docs/architecture、spec/plan/tasks/checklist/analyze/review/implementation-evidence（含 §8.3/§8.4/§9）、templates/review.md、`shell/{main.js,check.js,src/backend.js,src/test-hooks.js,test/e2e/root-locked.js,test/unit/backend.test.js}`、`backend/app/{__main__,main}.py`、`backend/data/{lock,service}.py`，另读 `data/adapters/{akshare,eia}` 文件头核对 import 时序。**未运行任何测试 / 构建 / hook / npm / Python，未联网，未改源码，未动 checklist** |

## 0.1 客观修正说明（v2，同一审核员 / 同一会话 / 同一 HEAD）

协调者核对 18 个输入 SHA 未变、仅本报告存在后，指出 v1 四处**证明强度过度**；本人重新只读核对后修正如下（保留 v1 曾有这些过度声明的事实，便于追溯）：

| v1 过度声明 | 修正后事实 | 位置 |
|---|---|---|
| `_stale.read_text()` "只读 PID 字节、不与偏移 64 的字节锁冲突" | `lock.py::_stale` 是**整文件** `read_text()`（第 108 行），冲突与否取决于运行时读取实现，本仓库证据（§8.3 `t05k-locked.log` Node 整读 EBUSY）不支持"无冲突"；但 `_stale` 以 `except OSError: return False` 兜底、`startup_failure` 以 `except (OSError, ValueError)` 兜底，**无论读取成功或失败都立即 `LockBusy`**。"立即、无等待"结论不变，"无冲突"声明撤回 | §2 第 3 条 |
| 历史快照证明"子进程仍存活、无 stdout 标记" | `Backend.snapshot().pid` 依据 `!g.exited`（Node `exit` 事件观测），不是 OS 存活检查，也不暴露 `g.marker`；`output()` 可在 `waiting_health` 期间就置 `g.marker`。历史快照只证明 **"在该观察点 Node 未观测到 exit / close / 分类"**，不证明无标记、不必然证明 OS 进程仍活（§9.4 新证据有 62 ms 的 OS 已死 / Node 仍 `waiting_health` 窗口）。候选状态扩为三类，见 §2 第 8 条 | §2 第 8 条、§3 |
| RL-04 "只影响 `message`，`code`/`path` 为 ASCII" | `path` 来自 `str(root)`，Windows 用户名 / 数据目录可含中文；Python 侧 `ensure_ascii=False`。`code` 为 ASCII 不受影响，**`path` 与 `detail` 都可能**在 chunk 边界被替换符污染。与历史 FAIL 无关（该次临时路径为 ASCII） | §3 RL-04 |
| "poll 不可能卡住 close"、"主循环未阻塞"等绝对表述 | 改为源码 / 异步设计与**已观测到的** snapshot 应答所能支持的限定表述；`poll()` 每 100 ms 有一次同步 `fs.readFileSync`，同步 FS 停顿、事件循环调度与未观测间隔未被全局排除 | §2 第 7、9 条 |

**修正后严重度与处置是否变化**：发现仍为 **无 P1/P2；RL-01 为 P3 残余 OPEN / UNKNOWN；T-05k 可作 nonblocking 残余继续 Implement**。但 nonblocking 的论证**不再**依赖"无标记 / OS 存活"推断，改为对三类候选现场逐一给出生产有界结果（§3）。RL-04 范围扩大但仍 P3，建议在整体 Review 前修复（§3）。

## 1. 冻结契约到底要求什么（问题 1）

| 来源 | 原文要点 | 对本风险的含义 |
|---|---|---|
| spec AC-004-2 / R-004 | 目录被另一写进程占用 → 启动给出"另一进程占用"的**明确提示**，而不是无响应或静默失败 | 要求**分类正确、可见、可操作**；**没有任何时限** |
| spec R-002 / AC-002-2 | 就绪只认健康检查；未就绪时界面明示状态并可重试 | 锁占用路径永远不该 ready；现场快照 `waiting_health` + 启动页可见符合"明示状态" |
| spec R-007 / AC-007-2 | 后端启动超时 → 显示超时原因与"重试 / 查看日志" | 这是生产对"慢 / 挂"的唯一时限承诺，落点是 `health_timeout` |
| spec AC-001-2 | 基准机冷启动 **15 s 内出现可交互界面** | 指**窗口 / 启动页**可交互（Plan §4.1 第 2 步立即显示启动页），**不是**后端分类或就绪时限；判定只在基准机 M-02 |
| Plan §4.2 | `waiting_health` 超时（默认 30 s）→ kill → `failed(health_timeout)`；退出码 3 + 标记 → `failed(code)` 不重启 | 生产对锁占用的分类窗口是 **30 s**（`main.js` 第 16–17 行 `HEALTH_TIMEOUT_MS`；`backend.js` `launch()` 的 `deadline`） |
| Plan §9 AC-004-2 / tasks T-05k | e2e `root-locked`：真实后端 + 辅助 Python 持锁 → 错误页 `data_root_locked`、含路径、`restarts=0`；人工 M-10 | 完成标准**不含 10 s** |
| check.js `waitFor(fn, timeout = 10000)` | 运行器的**通用默认**观察预算（T-05d 基础设施） | 10 s 是**测试观察者的默认值**，不是 AC、不是 Plan 契约 |

**结论 1**：冻结契约对锁占用只要求"正确且可见的分类 + 不自动重启"，生产有界时限是 Plan §4.2 的 30 s（超时后走 AC-007-2 路径）。10 s 仅是运行器通用 `waitFor` 默认，被 `root-locked.js` 第 40 行原样沿用；它不是 AC-004-2 的验收条件。"15 s 基准"属窗口可交互，与后端就绪无关；本场景也没有伪造就绪（快照 `phases` 不含 `ready`，`pid` 清空后才 `failed`）。

## 2. 代码事实核对：生产路径是否存在能产生该签名的缺陷（问题 2）

只读核对当前 HEAD 源码（与 `lifecycle-code.diff` 一致）：

**Python 侧（`python -m app`）**

1. `backend/app/__main__.py::main`：`host = Host(root)` 在 uvicorn 之前；任何异常 → `startup_failure` → 一行 `FAI_HOST {...}` 到 stdout（`flush=True`）→ `return 3`。stdin-EOF 守护线程只在 `Host`/`create_app`/`HostServer` 都成功后才启动——锁占用路径**不会**读 stdin。
2. `backend/app/main.py::Host.__init__` → `Service(root)`；`backend/data/service.py::Service.__init__`：`ensure_layout` 后**立即** `write_lock(self.dirs["data"])`，在开任何库之前。
3. `backend/data/lock.py::write_lock`：`O_CREAT|O_EXCL` 失败 → `_stale()` → 非陈旧 → **立即** `raise LockBusy`。`_stale`（第 103–126 行）对锁文件做**整文件** `read_text()`，若因 helper 的 `msvcrt` 字节锁（偏移 64）而抛 `OSError`（§8.3 `t05k-locked.log` 已记录 Node 整读该文件得到 EBUSY，说明冲突在本环境是现实的）→ `return False` → `LockBusy`；若读成功 → `int(pid)` → `_pid_alive` → 存活 → `LockBusy`。`startup_failure` 读 PID 作 `detail` 时同样 `except (OSError, ValueError)` 兜底。**两条分支都没有重试或等待**，不存在名义 10 s 获取窗口；pytest `test_locked_root_exits_3_with_marker` 与三次诊断证明该路径在 ~2 s 内可达。（v1 的"只读 PID 字节、无冲突"声明撤回，见 §0.1。）
4. import 时序：`data/adapters/akshare/akshare_adapter.py` 在函数内才 `import akshare`（文件头核对）；`eia_adapter.py` 模块级 `import requests`（有界，无网络）。证据 §9.2 的 profiling（`app.main` 累计 ≈1.47 s、pandas ≈0.49 s）与此一致。**未发现 import 期网络或无界阻塞点**（基于源码头部核对与 profiling 数值；非穷举所有第三方包）。

**Node 侧（`shell/src/backend.js`）**

5. `launch()`：spawn 后 `transition('waiting_health')`，`exit` → `g.exited=true`；`close` → `g.resolve()`，若非旧代且非 `ending` → 把残余输出补 `\n` 后 `ended(g, code, signal)`。`close` 需要 stdout/stderr 两个管道关闭 + 进程退出；本路径 Python 不产生继承管道的孙进程，不会拖延 `close`。
6. `output()`：逐行解析 `FAI_HOST ` 前缀、JSON、`event==='startup_failed'`、code 在白名单 → `g.marker`。`ended()`：`code===3 && g.marker` → `failed(marker)`；否则走重启预算。与 Python 的 `return 3` 契约一致。
7. `poll()`：只负责端点文件 / health 轮询与 deadline；按源码它**不参与**标记路径的状态迁移（`failed(marker)` 由 `close` 回调触发），锁路径下 `portFile` 永不存在 → 每 100 ms 一次同步 `fs.readFileSync`（抛 ENOENT 被吞）后 `delay(100)`。就异步设计而言 poll 不持有能阻止 `close` 回调的锁；但该同步 FS 调用若被外部因素（如 AV 扫描 `run/` 目录）拖长，会占用主进程事件循环，这种情形**未被源码排除、也未被历史证据观测**。
8. `snapshot().pid`：`g.exited` 为 false 时返回 `child.pid`；`g.exited` 只由 Node `exit` 事件置位，snapshot **不是 OS 存活检查**，也**不暴露 `g.marker`**（`output()` 可在 `waiting_health` 期间就置标记，分类要等 `close`）。历史 FAIL 的 `CLEANUP_OBSERVED` `{phase:'waiting_health', gen:1, pid:15640, port:null}` 因而只证明：**到该观察点为止，Node 未观测到该代的 `exit`、`close` 或分类**。与之相容的候选现场有三类，历史证据**无法区分**：
   - (a) Python 仍在运行且尚未输出标记（导入 / `Host()` 之前慢或挂）；
   - (b) 标记已到达（`g.marker` 已置）但进程未退出 / `exit`、`close` 未到（解释器退出期停顿；正常运行该段约 300 ms）；
   - (c) OS 进程已退出但 Node 的 `exit` 事件在观察窗口内未送达（§9.4 观测到此类间隙正常约 62 ms；10 s 量级的送达延迟无任何证据，但历史场景未做 OS 存活检查，不能从证据上排除）。
   随后 `request-quit` 的 `stop()`（`g.info` 为 null → `stdin.end()` → 等 ≤5 s → `kill(g)`）在 10 s 内完成、`后端 pid 已退出` PASS；该路径对 (a)(b)(c) 都会给出同样结果，不提供区分信息。
9. 控制通道在 10 s 内对每次 snapshot 请求（约 50 ms 一次，单次超时 2 s）都有应答（否则 `waitFor` 会以 `control request timeout` 失败）→ 只能说明**在这些应答时刻**主进程事件循环可响应，不能排除应答之间的短暂同步停顿或未观测间隔。

**运行器 / 场景侧（`check.js`、`root-locked.js`）**

10. 历史场景（`lifecycle-code.diff` 中的原 `root-locked.js`）：`ctx.launch()` 在 `paths` + `control` 就绪即返回；而生产 spawn 发生在 `createWindow()` → `showStartup()` → `await shown`（`ready-to-show`）之后（`main.js` `whenReady` 块与 `createWindow` 末尾）。所以 10 s 预算实际覆盖：启动页 `ready-to-show` + spawn + Python 解释器/导入 + `LockBusy` + 标记 + 解释器退出 + 管道关闭。诊断 diag-1：control 就绪 1397 ms → spawn 1703 ms（+≈0.3 s）→ stdout 首次 +1.81 s → exit3 +0.30 s → failed 3842 ms；全集内 4339–4403 ms。正常占用预算约 2.4–2.9 s，失败需要 ≥3.5–4 倍的拖慢。
11. 历史失败所在全集墙钟 **100.95 s**，而同源码的另三次全集为 70.40 / 67.09 / 65.40 s（证据 §8.3、§9.4）。root-locked 失败本身只多消耗约 10 s（等待）+ ≤5 s（stop 等待）≈ +10–12 s，**仍有约 20 s 无法由该场景解释** → 与"该次整机变慢"相容，但日志无逐场景时间戳，**不能证明**。

**判定（问题 2）**：

- **未证明生产缺陷**：锁路径在 Python 与 Node 两侧按源码都是直线式、无等待、无状态竞争的；只读核对未发现与历史失败有因果关联的 state / marker / close / poll 缺陷。但历史快照（Node `exit` 标志、无 marker、无 OS 存活）不足以区分候选现场 (a)(b)(c)，因此这是"未发现已确认缺陷"，不是"已排除缺陷"；根因保持 UNKNOWN。
- **未证明观察者缺陷**：观察者如实报告了"10 s 内未观测到 failed"；它没有误读状态，但它的观测维度（Node `exit` 标志、无 marker、无 OS 存活）不足以区分 (a)(b)(c)。
- **存在可核实的观察预算错配**（不是猜测）：10 s 通用默认 < 30 s 生产分类窗口，且预算混入了与锁路径无关的窗口显示延迟；该场景**无法区分"慢但正确"与"挂起"**。
- **根因：证据不足，UNKNOWN**。第 11 条的全集墙钟差异与 (a) 的"环境性慢启动"相容，但没有该 PID 的 spawn / 首次输出 / 标记 / 退出 / OS 存活时刻，(b)(c) 均不能从证据上排除；本文不选定任何一类为原因。本轮三次诊断与十次左右的 root-locked 执行（§8.3 修正后 4 次 + §9 6 次，其中 1 次 FAIL）未复现。

## 3. 发现与严重度（问题 3、5）

| # | 级别 | 位置 / 证据 | 发现 | 最小处置 |
|---|---|---|---|---|
| RL-01 | **P3（残余，保持 OPEN，不得标 CLOSED）** | 历史 FAIL `CLEANUP_OBSERVED`；证据 §8.3 第 4 条、§9.2 | 一次 root-locked 在 10 s 观察预算内 Node 未观测到该代的 exit / close / 分类（`waiting_health`、`g.exited=false`、无端口）；根因 UNKNOWN，候选现场 (a)(b)(c) 均未排除。按源码，三类在生产都有**有界、可见、可重试**的结局：(a)(b) → 若 `exit` 在 30 s deadline 内到达则 `failed(data_root_locked)`（晚但正确），否则 deadline → `kill` → `failed(health_timeout)`；(c) → deadline → `kill` 对已死 PID 的 `taskkill` 失败且 `g.exited` 为 false → `failed(startup_internal)`。三类都不自动重启（`ended` 未被调用）、不伪造就绪、不触碰持锁者（kill 只针对自有子进程树）。即最坏是**错误码退化为超时 / 内部错误**，不是无响应或静默失败；但若 (c) 被证实，则属于外壳侧进程观测缺陷，须升级 | 继续在 review.md / Handoff 以 OPEN 跟踪；由 RL-02 的对照实验与 RL-03 / §4 第 4 条的时间线（含 OS 存活）在复现时区分 (a)(b)(c)；任何绿灯次数都不是关闭依据 |
| RL-02 | P3（测试设计） | `shell/check.js` `waitFor` 默认 10000；`shell/test/e2e/root-locked.js` 第 40 行沿用默认；`main.js` 第 16–17 行 30 s；Plan §4.2 | 场景观察预算与生产分类窗口不对齐，且同一预算吞并了启动页 `ready-to-show` 延迟；一个 10 s < t < 30 s 的**正确**分类会被判成 AC-004-2 失败，而生产行为其实满足 AC | 见 §4：把该场景的 failed 等待对齐到 producer deadline（并显式设置 `FAI_HEALTH_TIMEOUT_MS` 与 `timeoutMs`），**必须**配正 / 负对照；不是无条件放大超时 |
| RL-03 | P3（诊断缺口） | `observation.diff`；证据 §9.3 | 现保留的 `LOCK_TIMELINE` 只有 scene 侧快照观测；producer 侧（spawn / 首次 stdout / 标记 / exit / close 时刻）的临时 hook 已恢复移除。若再次出现，仍只能看到"10 s 内 waiting_health + alive"，无法区分导入慢与挂起 | 优先用 §4 的测试边界注入复现；若要常驻 producer 时刻，需改 `src/backend.js`（约 5 行时间戳 + snapshot 暴露），属生产代码，须协调者 / Walter 批准，本文不授予 |
| RL-04 | P3（生产健壮性，与本签名无关） | `backend.js::output()` 用 `String(data)` 逐 chunk 解码；`__main__.py` 标记 `ensure_ascii=False`、`path=str(root)` | 标记行中 `path`（Windows 用户名 / 自定义数据目录可含中文）与 `detail`（中文）都是多字节 UTF-8；若管道 chunk 边界落在多字节字符中间，`String(chunk)` 会把两侧各产生替换符，JSON 仍可解析、`code` 不受影响，但错误页显示的**路径 / 说明可能出现乱码字符**，影响 AC-004-2 / AC-004-3"含路径"的显示准确性（非分类正确性）。标记行很短、通常单 chunk 到达，故为低概率；历史 FAIL 的临时路径为 ASCII，与此无关 | 建议作为 Converge 新任务在整体 Review 前用 `StringDecoder('utf8')` 累积解码（约 3 行，`src/backend.js`，属生产代码须按流程派工）；不要求 T-05k 内处理，不阻塞 |
| RL-05 | P3（设计边界，非缺陷） | `backend.js::poll()` deadline 分支与 `close` 回调的 `g.ending` 检查 | 分类恰在 deadline 前后到达时（exit3 已发生但 `ending` 已置位）会报 `health_timeout` 而非标记码；这是 Plan §4.2 的既定语义，仅在 ≥30 s 的极端慢启动下出现 | 只登记；若 RL-02 对照显示真实宿主在受测机常态性接近 30 s，再回 Plan 讨论，本文不改设计 |

无 P1 / P2。T-05k 的**产品代码**没有被证明的缺陷；本轮也未发现足以要求修改 `main.js` / `src/backend.js` / `backend/**` 的实证。

**窄范围处置（问题 3）**：

- T-05k **不必继续 blocked**；可作为 **nonblocking 残余（RL-01，OPEN）** 继续 Implement（T-06b 起）。理由（修正后，不依赖"无标记 / OS 存活"推断）：① AC-004-2 无时限，10 s 是测试默认；② Python 与 Node 两侧锁路径按源码直线、无等待；③ 对历史现场的三类候选 (a)(b)(c)，生产状态机都在 30 s deadline 内给出可见、可重试的失败页，不自动重启、不伪造就绪、不触碰持锁者（RL-01 行逐类说明）；④ 本轮约十次执行仅一次未解释失败，且未发现能解释它的源码缺陷。不是"大概率环境"的推断，而是"每一类未排除的现场都落在冻结 AC-007-2 / Plan §4.2 的有界路径内"。**保留升级条件**：若复现并证实为 (c)（OS 已退出而 Node 长时间未观测 exit），即为外壳侧进程观测缺陷，需按 P2 回修 `src/backend.js` 并重新评估。
- 条件：① RL-01 在 review.md / Handoff 保持 UNKNOWN / OPEN，不得写成已修复或已关闭；② 在整体 Converge / 代码 Review 之前完成 §4 的对照实验（不要求在 T-06b 之前）；③ 若在任何后续全集中再次出现，须附带 producer 侧时刻证据后重新评估，届时可升级；④ 用户接受与 Gate 2 不在本文范围。

## 4. 最小后续建议（问题 4）

**所有权**：仅 `shell/test/e2e/root-locked.js`（必要时新增一个登记场景并改 `shell/test/e2e/index.js`）；执行者为 T-05k 实施者（`openai/gpt-6-astra`）。**不**改 `main.js`、`src/backend.js`、`check.js` 运行器规则、backend/**、安全面、依赖；不引入 Job Object / watchdog / 新框架。

1. **对齐观察预算到生产契约（RL-02）**：场景显式传 `FAI_HEALTH_TIMEOUT_MS`（例如 20000）启动 Electron，failed 等待用"该 deadline + 固定余量"而非运行器 10 s 默认；相应设置 `module.exports.timeoutMs` 使外层场景超时 ≥ 该等待 + retry 20 s + 清理。保留全部 16 条原断言与 `LOCK_TIMELINE`。
2. **正对照（必须）**：用既有系统边界 `FAI_BACKEND_CMD`（仅在 `FAI_TEST_HOOKS=1` 下有效，hooks 返回 `env:{}`、`cwd=app.getAppPath()`，场景经 `launch({env})` 补 `PYTHONPATH=<backend>` 与 `PYTHONIOENCODING`）注入"**先 sleep 12 s 再 `runpy.run_module('app', run_name='__main__')`**"的真实宿主延迟启动，持锁 helper 不变 → 期望：`failed` 且 `lastCode==='data_root_locked'`、页面含路径与"被另一进程占用"、`restarts===0`、`pid===null`、holder 存活、随后 retry 真实 ready。这证明"10 s < t < deadline 的正确分类"在生产状态机下成立，而旧 10 s 预算会误判。
3. **负对照（必须）**：同一注入但 sleep > `FAI_HEALTH_TIMEOUT_MS`（如 deadline 3000、sleep 6 s）→ 期望 `lastCode==='health_timeout'`、`phases` 不含 `ready`、子进程被 kill、无自动重启；以及"错误退出码 + 标记"（exit 1）→ 不得进入 `failed(data_root_locked)`（走重启预算；单测 `退出码 3 + 标记` 已覆盖正向，此处补真实进程负向）。两项证明新预算没有把超时或错码伪装成锁分类。
4. **记录纪律与区分 (a)(b)(c)**：每次 root-locked 运行保留 `LOCK_TIMELINE`（现已含 `alive`：OS 存活）；复现时 `alive:false` 且长时间 `waiting_health` 指向 (c)；`alive:true` 则在 (a)(b) 之间——区分二者需要 producer 侧 stdout-first / marker 时刻（RL-03，改生产代码须批准）。若出现 `failed` 晚于 10 s 的**自然**运行，按时间线登记，不得删除或平均化。
5. **不建议**：仅把 `waitFor` 改成更大的数字而不做 2、3；用绿灯次数替代根因；在 backend 加 CORS / 安全变更；在没有批准下改 `src/backend.js` 增加 producer 时间戳（RL-03 可选项，需批准）。

## 5. 完成项（本评审实际做到的）

- 固定 HEAD、两份真实 diff、历史 FAIL 原件、新诊断日志（diag-1 / e2e-final / root-locked-final）与证据 §8.3/§8.4/§9 逐项核对；输入 SHA 清单留给协调者复核。
- 冻结 AC / Plan / Tasks 对"锁占用"的真实要求梳理（§1）。
- Python 与 Node 两侧锁路径、标记、close / poll、快照语义的只读代码核对（§2）。
- 分级发现 RL-01～RL-05（§3）与最小、可验收的后续建议（§4）。

## 6. 未完成项 / 边界

- 根因**未**确定；本文**不**关闭 RL-01。
- 未运行任何实验；§4 的正 / 负对照是建议，尚未执行。
- `diag-2-profile.log` 原件未读，profiling 数值采信证据 §9.2 并标注。
- 未评审 T-05k 之外的 20 余项未完成任务、打包、人工 M-ID、整体 Converge、完整 Review、Gate 2；它们均未验证。

## 7. 验收证据（本评审引用的事实出处）

- 历史 FAIL：`e2e-intermittent-failure.txt` 第 "TEMP …fai-e2e-root-locked-uIkNGz" 段：`FAIL root-locked › 场景执行: condition timeout (10000ms)`；`CLEANUP_OBSERVED {"backend":{"phase":"waiting_health",…,"pid":15640,"port":null,…}}`；`real 1m40.950s`。
- 诊断 diag-1：spawn-return 11.6 ms、stdout-first 1813.9 ms、marker-parsed 1822.6 ms、exit/close 2122 ms（以 spawn 为零点）；failed 快照 3842 ms（scene 起点）。
- 最终全集 e2e-final：root-locked waiting_health 2414 ms → 一次 `alive:false` 仍 `waiting_health`（4341 ms）→ failed 4403 ms（62 ms 内，exit→close 正常间隙）→ 213/213。
- 源码：`backend/data/lock.py::write_lock` / `_stale`（第 103–126 行整文件 `read_text()`，`except OSError: return False`；两分支均立即 `LockBusy`）；`backend/app/__main__.py::main`（标记 `ensure_ascii=False` + `return 3`；stdin 线程在成功路径才启动）；`shell/src/backend.js`（`snapshot().pid` 依 `!g.exited`；`close`→`ended`→`failed(marker)`；`poll` 每 100 ms 同步 `readFileSync`；deadline → `kill` → `health_timeout` / `taskkill_failed` → `startup_internal`）；`shell/check.js::waitFor` 默认 10000；`shell/main.js` `HEALTH_TIMEOUT_MS` 30000。
- Converge 报告结论：**不适用**（本文不是 Converge）。Gate 2 确认记录：**无，未申请**。

**独立结论（v2，修正后不变）**：本窄范围评估结果为 **"无 P1/P2；RL-01 作为 P3 残余保持 OPEN / UNKNOWN（候选现场 (a)(b)(c) 均未排除）；T-05k 可按 nonblocking 残余继续 Implement，但须在整体 Converge / Review 前完成 §4 的对照实验并保持含 OS 存活的时间线记录；若复现证实 (c) 则升级为 P2"**。RL-04 建议在整体 Review 前以 Converge 任务修复。不是整 feature 通过，不是 Gate 2，不是用户风险接受。
