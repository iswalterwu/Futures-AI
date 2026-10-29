# desktop-shell 恢复入口（保留暂停 WIP 交接）

> **当前阶段：Plan修订5 / Analyze8 / A第4轮质量复查完成（41/41，无P1/P2），准备恢复T-06c/d实现（2026-10-29）**。固定规划提交 **38c482c**，明确openMain、真实应用菜单驱动和两旧场景最小兼容；未改需求/后端/安全。T-06b已通过42unit/16场景236/236，CORS STOP未触发；19场景尚未运行，不进T-07。
> **先读 §16（本轮批准）**及Plan5/Checklist第4轮。RL-01 P3 OPEN及对照义务、R5新跟踪项保留；本质量复查不是代码Review/完整Gate2，不push/PR/merge。

## 历史暂停记录（以下 §1～§9 为暂停时点快照）

> 2026-10-28，Walter 指令：**收到后不要开新任务；保存、提交 WIP、停止后台，不 push**。
> 本文件由当前协调会话 `openai/gpt-6.1-sol` 整理；源码实施会话实际为 `openai/gpt-6-astra`。
> 这是暂停交接，**不是功能开发的 Handoff / Review 通过，也不是 Gate 2 批准**。恢复必须等 Walter 明确发话；不要因读到后续命令就自动执行。

## 1. 目标、当前进度、卡点

目标：按 `specs/desktop-shell/` 的冻结需求与实施顺序，完成桌面外壳纠偏及 T-07～T-10。Plan 修订 3 / Analyze 迭代 6 已完成；独立 A 的需求质量 Checklist **41/41 已勾选**，不代表代码通过。

**当前停在第一批后端纠偏的 T-04b。**

- T-01b/c/d、T-02b/c、T-03b/c：源码和测试已写，对应阶段有局部通过记录；不是最终 AC 验收。
- T-04b：`backend/tools/shell_check.py` 和 `backend/tests/test_app_health.py` 的改动已保存，**最后编辑后尚未验证**。
- 最后一次文件保存：2026-10-28 **12:58:28 UTC / 16:58:28 +04:00**，`backend/tests/test_app_health.py`；随后实施会话停止。
- **没有启动本轮后端构建/打包冒烟，没有 npm / Electron 构建或下载；修改结束后的完整后端回归也未跑。**
- T-05 起其余 33 项（含 T-07～T-10）未开始。41 项任务原估时约 60.5h 是计划，不是完成工时。
- 当前卡点是用户主动暂停，不是模型不可用；没有已知必须立即拍板的新需求。

## 2. 工作树与 commit 定位

原始源码基线：`8ba1b6a304f916e3d57ebdd6b89790b75a15f14c`。

| 工作树 | 本地分支 | 用途 |
|---|---|---|
| `D:/2030/Futures-AI-desktop-finish` | `wip/desktop-shell-pause-20261028` | 主暂停快照：已串行收回实施源码、规划与交接资料；从该目录开始恢复 |
| `D:/2030/Futures-AI-desktop-implement` | `feat/desktop-shell-astra` | Astra 私有实施工作树；暂停快照亦本地提交，后续只在此继续写代码 |

本次保存主/实施两个代码 WIP，并将之前遗留的两个历史规划/审核工作树也分别提交，避免留下未提交改动。**没有 push / PR / merge**。

| 快照 | 已保存 commit / 定位 | 备注 |
|---|---|---|
| Astra 实施 WIP | **`782aa20`**，`feat/desktop-shell-astra` | 9 个源码/测试文件、已批准规划、暂停资料；对应未完成的 T-04b，不是首批验收完成 |
| 历史规划工作树 | **`16b0f0f`**，`plan/desktop-shell-resume` | `D:/2030/Futures-AI-desktop-plan`；只保存历史文档，不是恢复实施入口 |
| 历史 Checklist 工作树 | **`76bf7ca`**，`review/desktop-shell-checklist` | `D:/2030/Futures-AI-desktop-checklist`；保存 A 的历史审阅输入/结论，不回拷覆盖主快照 |
| 主暂停交接 | 本文件所在 **`HEAD`**，`wip/desktop-shell-pause-20261028` | 包含与 `782aa20` 相同的 9 个实施文件及本次交接补充；以 `git log -1 --oneline` 查询本提交 |

实施会话在暂停前没有自行提交；上述提交均为 Walter 要求的本地 WIP 保存，不替代未跑的最终测试。定位命令：

```bash
git -C D:/2030/Futures-AI-desktop-finish log -1 --oneline
git -C D:/2030/Futures-AI-desktop-implement log -1 --oneline
```

不要 reset、清理或提交其他 feature 的工作树。旧规划 / Checklist 工作树仅保留历史输入；本轮最终产物已在主暂停快照中保存，不必从它们回拷旧版本。

## 3. 已落盘的文件

### Astra 源码 / 测试（9 个文件）

- `backend/app/main.py`：真实健康探测、内部只读通道、遮蔽邮箱回写拒绝、磁盘满映射、注册指引端点。
- `backend/app/__main__.py`：启动错误分类/退出码、端口处理、stdin EOF 退出、端点生命周期。
- `backend/tests/test_app_health.py`：健康与回环监听测试；**最新 T-04b 部分未跑**。
- `backend/tests/test_app_lifecycle.py`：stdin EOF 与退出清理测试。
- `backend/tests/test_app_settings_api.py`：邮箱保护、注册指引与隐私测试。
- `backend/tests/test_app_startup_errors.py`（新）：锁占用、不可写、磁盘满、端口等测试。
- `backend/tests/test_app_channel.py`（新）：只读通道与端点清理测试。
- `backend/tests/test_app_disk_full.py`（新）：507 与宿主继续服务测试。
- `backend/tools/shell_check.py`：真实就绪判据、监听地址、产物扫描等 T-04b WIP；**未构建、未执行**。

这些文件由 Astra 写入，协调者只在停止写入后原样串行复制到主暂停工作树，没有代写业务代码。

### 规划与交接文件

`specs/desktop-shell/{spec,plan,tasks,checklist,analyze,review,manual-acceptance,plan-gaps,checklist-review-request}.md`、`specs/README.md`、本文件，以及下述 `handoff-artifacts/`。

- 冻结 spec 正文未改，只有上轮补记的 Gate 1 页首元数据。
- Checklist 仍由 A 维护，41/41 不变；实施者与协调者没有自行勾选。
- `tasks.md` 只补暂停进度元数据，未改变任务需求或验收标准。

## 4. 实际验证结果（不要夸大）

全部是本次 Astra 会话中**已完成命令**的输出：

| 范围 | 结果 |
|---|---|
| 实施前全量基线 | **389 passed, 5 skipped in 125.85s** |
| T-01b 健康 | 9 passed in 6.82s |
| T-01c 启动分类 + health/lifecycle/settings 回归 | 35 passed in 20.19s |
| T-01d 启动/端口 | 15 passed in 11.10s |
| T-02b 生命周期 | 5 passed in 10.22s |
| T-02c 通道 + 生命周期（修正后） | 9 passed in 28.39s |
| T-03b 设置 + 磁盘满 | 17 passed in 6.05s |
| T-03c 设置 API（含注册指引） | 17 passed in 5.61s |

- T-02c 中间曾出现 `3 failed / 6 passed`、`1 failed / 3 passed`，后续联合用例 9 passed；失败历史未隐去。
- 5 个基线 skip 是未开启的在线冒烟，不能说真实 EIA / 上游验证已通过。
- 每次 pytest 使用仓库外临时 basetemp、禁用 cache；未用真实 EIA key，也未启用在线冒烟。
- **这些结果分别对应当时阶段，不保证最后保存的代码全量通过。**暂停后只做 `git diff --check` 等保存检查，不新跑测试、构建或下载。
- 目前没有完成后的 `implementation-evidence.md`，实施会话在最终报告前被中断；暂停证据见下一节，不要把空日志当成功。

## 5. /tmp 重要产物（已复制入项目）

可移交证据目录：**`specs/desktop-shell/handoff-artifacts/20261028/`**。

| 已保存路径（该目录内） | 原位置 / 说明 |
|---|---|
| `pause-evidence.md` | 协调者从已完成 toolResult 提取的路由、测试、失败历史、停止状态摘要 |
| `backend-batch-request.md` | `/tmp/desktop-shell-implement-Z0hpHFJf/backend-batch-request.md`，首批 8 项派工范围与写权限 |
| `astra-probe.txt` | 同 run 的 `astra-probe.log`；本次最小调用输出 `IMPLEMENT_ROUTE_OK` |
| `approved-inputs.sha256` | 同 run 的批准输入指纹；对应暂停元数据更新**之前**的批准文件；暂停前核对全部一致 |
| `checklist-final-report.txt` | `/tmp/desktop-shell-resume-stgIbp5B/checklist-recheck.log`，上轮 A 最终独立复查报告 |

原始临时运行目录（Git Bash `/tmp` 对应 Windows 用户 Temp）：

- `C:/Users/iswal/AppData/Local/Temp/desktop-shell-implement-Z0hpHFJf/`
- `C:/Users/iswal/AppData/Local/Temp/desktop-shell-resume-stgIbp5B/`

本次原始实施会话（**未复制入 Git**，避免完整会话上下文/敏感字段入库）：

`C:/Users/iswal/AppData/Local/Temp/desktop-shell-implement-Z0hpHFJf/sessions/backend/2026-10-28T12-38-45-834Z_01a18285-2349-7290-b570-c8f9b2e18658.jsonl`

同 run 的 `backend-batch.log` 为 **0 字节**（print 模式还没有最终答复）；`backend-batch.exit` 为 **1**，原因是用户要求手动停止。原始测试数据库/目录 `fai-baseline-*`、`fai-t01*`～`fai-t03*` 没有入库；它们是可再生成的隔离夹具，不是用户数据。所需结论已脱敏提取；即使临时目录被系统清理，也可从 Git 快照重新开 Astra 会话继续。

## 6. 已停止的命令、服务、端口

- 原后台命令：`pi --print --model openai/gpt-6-astra --thinking high ... --name desktop-shell-implement-backend`。
- 实施会话 ID：`01a18285-2349-7290-b570-c8f9b2e18658`；会话元数据确认实际为 `openai/gpt-6-astra`。
- 已执行 `taskkill /PID 28644 /T /F`（退出码 0），停止 Node PID **28644 / 42096**；启动包装 PID **63020** 亦已退出。
- 随后 CIM 检查确认上述 PID、两个本任务 run 目录对应的 agent 都不存在；未发现本任务 `python -m app` 或 `futuresai-backend.exe` 服务。
- 没有确认停不掉的本任务进程。其他 feature 的 Python 进程未误杀。
- **无需保留任何端口**：后端/只读通道用 `127.0.0.1:0` 动态分配，恢复后从新端点文件读取，不能复用旧测试端口。
- 当前没有需要立即重启的服务；只在 Walter 明确恢复后重启实施会话与必要验证命令。

## 7. 恢复后的直接执行顺序（现在不要执行）

1. 在主暂停工作树阅读本文件，再读 `AGENTS.md`、`specs/desktop-shell/{spec,plan,tasks,checklist,analyze,review}.md`；确认 Checklist 仍为全勾选、需求未变化，并检查两个工作树 `git status --short` / `git log -1 --oneline`。
2. 在**实施工作树**恢复 `openai/gpt-6-astra`。原临时会话还在时可使用：

   ```bash
   cd D:/2030/Futures-AI-desktop-implement
   pi --model openai/gpt-6-astra --session "C:/Users/iswal/AppData/Local/Temp/desktop-shell-implement-Z0hpHFJf/sessions/backend/2026-10-28T12-38-45-834Z_01a18285-2349-7290-b570-c8f9b2e18658.jsonl"
   ```

   先告知该会话“用户已恢复；先读 HANDOFF.md，保存的是 WIP，不把 exit=1 当模型失效；从 T-04b 未验证部分继续”。若临时会话已丢失，在同工作树新开同模型会话，读本文件与保留的派工请求即可。**不得因为本次手动中断回退模型。**
3. 由 Astra 先复跑首批后端六个测试文件（同时覆盖 T-04b 新增回环断言），使用新临时 basetemp：

   ```bash
   cd backend
   PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_health.py','tests/test_app_startup_errors.py','tests/test_app_lifecycle.py','tests/test_app_channel.py','tests/test_app_settings_api.py','tests/test_app_disk_full.py','-q','-vv','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-resume-targeted-')]))"
   ```

4. 处理真实失败后，完成 T-04b 并由 Astra 跑完整后端回归：

   ```bash
   PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/','-q','-rs','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-resume-full-')]))"
   ```

5. **只有恢复后、测试通过后**，再由 Astra 在 `backend/` 执行真实构建与冒烟：

   ```bash
   python tools/build_backend.py
   python tools/shell_check.py
   ```

   不使用已退役的 `--backend-only`，不伪造健康/监听地址/包内容扫描通过。若打包黑名单与真实依赖冲突，按冻结方案停下报告，不擅自放宽。
6. 写真实 `implementation-evidence.md`，更新各任务实际完成状态并形成首批正式 checkpoint；随后从 **T-05b** 按顺序推进外壳，不能跳到 T-07。所有后续 Implement 继续用 Astra，在同一独立实施工作树串行写共享文件。
7. 如果触发 Plan §10 的 CORS 等停止规则，回 Plan/Analyze，不能私自扩大权限/改需求。整体 Implement 完成后才做 Converge、A 的独立代码 Review；Gate 2 仍须 Walter 批准，**不要自动 PR/merge**。

## 8. 需要 Walter 拍板的事项

- 当前只需等待明确的“恢复/继续”指令；没有新增需求或工程范围等待批准。
- 当前不申请 Gate 2，不申请上传、真实 key、用户文档或更新服务配置。
- 后续仍缺真实前端/作业引擎集成、真实发布通道、干净 Windows、基准机 15s、系统通知/托盘观感、真实 EIA 注册/key 等证据；不能用夹具替代。
- A 的 P3（507 UI 未自动化、11 个 sector/12 个 option 的口径、验收证据隐私、首次打包下载耗时）已在 `review.md` 登记，未来 Review/Gate 2 再如实处理。

## 9. 下次恢复后给 Walter 的第一句话（照此发送）

我会先用 openai/gpt-6-astra 复跑暂停前的后端测试，从 T-04b 的打包冒烟继续，暂不跳到 T-07。

## 10. 2026-10-28 恢复后阻塞检查点（历史时点，最新见 §11）

### 实际完成与阻塞

- 原 Astra 会话在原实施树恢复，独立确认 Checklist **41/41**，没有改 frozen spec / Plan / Tasks / Checklist；会话已结束，进程退出码 **0** 表示调用正常结束，**不表示产品冒烟成功**。
- 六个后端文件首次复跑 **80 passed**；全量发现测试固定哨兵触发凭证字面量扫描。Astra 在 `backend/tests/test_app_settings_api.py` 将哨兵改成运行时 UUID 生成，未改扫描器或隐私断言；修复后六文件 + 扫描 **85 passed**，最终全量 **451 passed / 5 skipped（207.40s）**。失败历史完整保留在实施证据中。
- 真实 `python tools/build_backend.py` **退出 0（192.53s）**，有兼容性警告，不能称零警告。真实 `python tools/shell_check.py` **退出 1，11/12 通过**：健康就绪、仅 127.0.0.1 监听、三源、鉴权、优雅退出、锁/只读端点/端口及临时目录清理通过；**包内 `_internal/pyarrow/tests` 命中 AC-001-4 冻结黑名单**，含 `.pyx` 与 feather/orc/parquet 测试资产，不是空目录。
- T-01b/c/d、T-02b/c、T-03b/c 的本批后端范围复验通过；**T-04b 未完成，T-05 起未开始**。未作 Converge、独立代码 Review 或 Gate 2 结论。
- 协调者只读核对安装环境中的 `hook-pyarrow.py`：其 hiddenimports 排除了 tests，但 `datas = collect_data_files('pyarrow')` 未排除测试数据；这解释了现有 `--exclude-module tests` 仍收进数据文件。未改 site-packages、构建脚本或黑名单。

### 保存位置与工作树

- 主工作树本次 WIP 检查点 = 本文件所在 `HEAD`（用 `git log -1 --oneline` 查询），起始提交 `007a4c0`；已原样收回 Astra 的测试修复与 `specs/desktop-shell/implementation-evidence.md`，两个文件与实施树逐字节一致。
- 实施树仍为 `D:/2030/Futures-AI-desktop-implement` / `feat/desktop-shell-astra`，HEAD **`782aa20`**；仅上述测试文件修改与新增证据尚未提交。Astra 因 blocked 未做“首批完成”提交，**不要丢弃这两个 WIP 文件**；主检查点也有备份。
- 可移交请求、最终报告和 agent 进程退出码保存在 `specs/desktop-shell/handoff-artifacts/20261028-resume/`。仓库外原始日志在 `C:/Users/iswal/AppData/Local/Temp/desktop-shell-continue-Hldtv1BJ/`，完整构建输出在 `%TEMP%/fai-resume-build-bon07pti/build.txt`；不将完整会话或测试数据库入库。
- `backend/build/` 与 `backend/dist/` 是本轮真实生成、被忽略的产物，保留在实施树作阻塞复核，不手改或提交。本任务恢复 agent PID 5364/30952 与打包后端 PID 47224 已不存在，无需保留端口或重启服务。

### 下一步（不能跳过阻塞）

1. 按冻结停止规则向 Walter 报告本次真实黑名单冲突。建议保持黑名单不变，在构建收集源头排除第三方测试资产；**这尚未实施或批准为新的任务范围**。不要只手动删除 dist 中的目录，不改全局 PyInstaller hook，不误以为模块排除必然排除数据文件。
2. 明确构建修补的文件所有权后，走 Plan/Tasks 修补与 Analyze、A 独立复查相应质量项，再由 Astra 生成新产物、复跑测试和完整冒烟。若要改变需求本身则必须重新 Clarify / Gate 1；不能把黑名单放宽当作普通修复。
3. T-04b 真实通过、写入 checkpoint 后，从 **T-05b** 按原顺序推进。未取得的前端/真实作业/干净机/15s/通知观感/真实 key 等边界不变；不 push / PR / merge，Gate 2 仍待用户批准。

## 11. 2026-10-28 窄范围修补（前序已验证后端检查点）

### 批准、角色与固定输入

- Walter 对“修构建收集源头、排除第三方测试资产、保持黑名单不变；先修 Plan/Tasks、Analyze、A 独立复查，再交 Astra”明确答复“是的”。这不是需求变更、黑名单例外或 Gate 2；§10“尚未批准范围”是历史时点。
- Plan = **`anthropic/claude-opus-5-5`**，新独立会话 `01a183a9-aa0d-71f9-b5a9-add01c9d3107`、工作树 `D:/2030/Futures-AI-desktop-build-plan`。本 seven_day 窗口不重试已耗尽 bridge；本轮官方最小真实调用成功。Plan 修订 4 / Analyze 7 四文件集成提交 **`981d430`**，任务仍 41 项，T-04b 2h、总估时 61h，spec/AC/黑名单未改。
- A = **`anthropic/claude-fable-5-1`**，新独立会话 `01a183ba-241b-76cf-8588-b472ac61c90c`、工作树 `D:/2030/Futures-AI-desktop-build-checklist`，固定审查 `1275ae2..981d430`；本轮官方探活成功。修订 4 **41 checked / 0 unchecked，无 P1/P2，3 P3**；A 只改 Checklist，11 份输入 SHA-256 前后均一致。质量批准集成主树 `ccbc291`，不是代码 Review 或 Gate 2。
- 协调者先把旧测试修复与证据保存为实施树 WIP **`9ae2ad9`**，再串行同步 8 份批准/进度文档并核对源码，形成干净固定实施输入 **`3a9ec35512ad593cc931f98dc5c3a347342f4e45`**；七步验证的 `<输入基线>` 就是该提交。
- Implement = **`openai/gpt-6-astra` via openai**，新聚焦会话 `01a183c8-f4a5-778d-acfc-d458ead81908`（18:32～18:44 UTC），元数据实核；使用原实施工作树/分支串行写入，不是模型回退。只改 build_backend.py、仓库 hook、新 test_app_packaging.py 与证据追加。结束后协调者本地保存源码修复为 **`c1e33e096621311ece7ec8f3d61ddadd4bffcb19`**，未开 T-05、未 push / PR / merge。

### 本轮真实验证

| 项 | 结果 |
|---|---|
| 三项聚焦测试 | **3 passed / 0 skipped（1.79s）**；真实执行仓库与 contrib hook，保留模块/DLL/header 正对照 |
| 全量后端 | **454 passed / 5 skipped（181.46s）**；仅原 5 个在线冒烟未启用，不算上游通过 |
| health 与逐名补验 | health 文件 **34 passed**；netstat/readiness 逐名 **6 passed** |
| 真实干净重建 | `build_backend.py --clean` **退出 0（95.78s）**，日志确认 pyarrow hook 来自仓库目录 |
| 未修改真实冒烟 | `shell_check.py` **12/12、退出 0（6.221s）**；健康/回环/鉴权/退出与锁、端点、端口清理通过 |
| 文件路径差集 | **3411 → 3394，移除 17 / 新增 0 / 其他移除 0**；全部移除项均在 `_internal/pyarrow/tests/` 下，不是二进制逐字节一致的声明 |
| 冻结与清理 | spec/黑名单/health/运行时代码/依赖版本未改，静态检查通过；后端 PID 30988 已退出，CIM owned 后端 0，冒烟临时目录已删；本轮 3 个 agent 均已结束，无服务或端口需保留 |

构建仍有 Pydantic V1 / Python 3.14 兼容性及 `scipy.special._cdflib` hidden-import 警告，已记录，不称零警告或全部第三方能力兼容。旧 11/12 与测试失败历史保留；本轮产品测试/构建/冒烟首次通过，证据 EOF 空行检查的小失败和修正也有记录。

### 保存位置与未完成边界

- 当前主集成检查点 = 本文件所在 `HEAD`（`git log -1 --oneline`）；实施分支源码修复提交 = `c1e33e0`，后续若同步进度文档，以 `git -C D:/2030/Futures-AI-desktop-implement log -1 --oneline` 查询最新 HEAD。主/实施源码与实施证据逐字节一致；不是 feature Handoff / Review / Gate 2。
- 详细验收证据：**`specs/desktop-shell/implementation-evidence.md` §6**。Plan/A/Implement 最终报告、批准输入、审核输入指纹和真实路径差集已保存到 **`specs/desktop-shell/handoff-artifacts/20261028-build-assets/`**；完整会话、构建日志、全量 manifests 与测试数据库留仓库外，不入 Git。
- 仓库外本轮 run：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-buildfix-s9IO23nK/`；构建日志 `%TEMP%/fai-t04b-build-i_2sbw7u/build.txt`。`backend/build` / `backend/dist` 为忽略的真实产物，不手改、不提交。即使 Temp 被清理，源码/规划/批准与摘要证据均可从 Git 检查点恢复。
- A 的 **R4-01** 已核实新旧 PYZ 均保留 `pyarrow.conftest` / `pyarrow.tests` / `pyarrow.tests.util`；本次按批准范围只排除测试数据，不剔除这些纯模块，Review/Gate 2 仍须跟踪。**不宣称包内没有任何测试代码**。R4-02 日志 repr 与 R4-03 扫描构建文本的提示已在实际验证中照做，不扩大授权。
- 未取得的真实前端/作业引擎/drain/agent、真实 key/发布通道、干净 Windows、基准机 15s、系统 toast/托盘、真实满盘/507 GUI 等边界不变；Converge、独立代码 Review、Gate 2 仍未完成。

### 下一步

在**同一实施工作树/分支**按既定任务从 **T-05b 路径/偏好纯模块**开始，随后 T-05c/d/m/e/f 等串行推进，不跳到 T-07。本次停在已验证的后端检查点，无后台 worker；开始下一批前按 AGENTS 重读相应文档与完整 Checklist（含本轮批准），首选 Implement 仍为 `openai/gpt-6-astra`，不因测试失败换模型。不要重复修复已解除的 T-04b，也不要未经批准连带剔除 PYZ 纯模块或放宽黑名单。

## 12. 2026-10-28 外壳基础六任务（前序已验证检查点）

### 输入、交付与提交

- 用户再次指示“继续”。主树输入 `68f1d46` / 实施树输入 **`83b91dba7d2d0ef86e65d40e5878f496ed80651f`**，开始时均干净、相关内容一致。Checklist **41 checked / 0 unchecked**：未变 shell 任务沿用第 2 轮批准，第 3 轮只局部修订 T-04b。本批未改需求/Plan/Checklist。
- Implement = **`openai/gpt-6-astra` via openai**，新 session **`01a18415-9390-7773-9dad-5f1ad7456cd2`**（19:56～20:19 UTC），元数据实核；同一实施树/分支唯一 writer，无回退。协调者仅派工、记录、串行集成，未代写实现或跑产品测试。
- 严格依序完成 **T-05b/c/d/m/e/f**：路径/偏好、bootstrap、诚实运行器、Python 协议夹具、旗标限定 hooks/控制通道、真实 Electron 单实例；改动为 shell 4 个既有文件 + 21 个新源/测试文件，实施证据只追加。backend、preload、renderer、既有规划与审核、全局配置均未改，未重建 backend 或打包。
- 结束后协调者核对冻结 diff 与 **26 文件 SHA-256 全部一致**，将本批源/测试/证据本地保存为实施提交 **`a643f812307cbd571e80d8c551a51a562585b638`**，原样收回主树。当前主集成检查点 = 本文件所在 HEAD；实施分支若后续同步进度文档，以 git log 查询最新 HEAD，源码提交仍为 a643f81。

### 最终真实验证（最后源码编辑之后）

| 命令 / 范围 | 结果 |
|---|---|
| npm 生成 lock、真实 `npm ci` | **退出 0**，70 packages；Electron 精确 33.4.11，无新依赖，未手改 lock |
| `npm run test:unit` | **34 passed / 0 failed / 0 skipped（3325.59ms）**，含真实 FS/ACL、真实 runner 正负子进程及 fake_backend 协议子进程 |
| 默认 `npm run check` | **2 场景 / 37/37 断言 / 0 failures / 退出 0** = harness-selftest 18 + single-instance 19 |
| 实际 Electron runtime | **Electron 33.4.11 / Node 20.18.3 / Chrome 130.0.6723.191**；不以构建机 Node25 单测替代 |
| 单实例与清理 | 第二实例 10s 内退出 0、secondInstance 恰 1、后端 spawn 恰 1、首后端 PID/port 不变；自有进程 0、两场景 temp 实际删除 |
| 静态与冻结 | diff/新路径检查通过；setPath/锁只在 paths 模块、hooks 仅精确旗标分支加载；backend/冻结文件零差异 |

中间失败完整保留：ACL 核查时机 18/19 后修复；两次 Electron Notification 只读导出异常，改为系统出口记录器；三次可见性超时定位为 runner 的 `windowsHide:true`，改为 GUI `windowsHide:false`，未改生产显示/CSP/renderer。最终删除一条冗余旧快照断言后完整复跑 34 单测 + 两场景。未隐藏失败、不以 taskkill 兜底当成功、不换模型。npm 仍有既有 boolean@3.2.0 deprecated 提示，未升级依赖。

### 证据与后续

- 详细证据 **`specs/desktop-shell/implementation-evidence.md` §7**；最终报告、分派范围、unit/e2e/npm 原始简短输出与 26 文件指纹保存在 **`specs/desktop-shell/handoff-artifacts/20261028-foundation/`**。完整 session、diff、临时夹具/失败日志仍留 Git 外。
- 原始 run `C:/Users/iswal/AppData/Local/Temp/desktop-shell-foundation-uvOXqTBv/`；完整测试日志 `C:/Users/iswal/AppData/Local/Temp/fai-foundation-01a18415/`。本批 agent 已结束，CIM owned 进程 **0**，无需保留服务或端口。旧后端 454/5 与 12/12 在本批未重跑，只保留为前序证据。
- **下一项 T-05g 生命周期状态机纯模块**，之后 T-05h/i/j/k/l 等依序推进；其余 27 项与人工批次未完成。本批没有提前修旧重启缺陷、stdin 接线、host.json 迁移、启动错误页、设置业务、托盘/通知/日志/更新/打包，不把 null 的 tray/activity 快照假装成实现。
- 真实 Windows 前台焦点 **M-09 未执行**；真实前端/作业/agent、干净机、15s、系统通知/托盘、真实 key、满盘 GUI、整体 Converge、独立代码 Review、Gate 2 等均未取得。后续如触发 CORS/权限/设计停止规则，仍停报，不自行放宽。已知 PYZ P3 不连带处理；不 push / PR / merge。

## 13. 2026-10-29 生命周期与启动批次（实现检查点，稳定性复核待关闭）

### 输入、实现与保存

- 主树输入 `6d4ce80` / 实施树固定输入 **`e0fe1cd4eb464fb76971b18f5f6d72ffb2053a80`**，开始均干净且相关内容一致；Checklist **41 checked / 0 unchecked**。本批未改 spec / Plan / Checklist，未变任务原批准有效。
- Implement = **`openai/gpt-6-astra` via openai**，session **`01a185d9-e062-733e-b5af-f1175102c292`**（04:10～04:46 UTC），元数据实核；同一实施树/分支唯一 writer，无回退。协调者仅派工、元数据、核对与串行保存，未代写代码或跑产品测试。
- 按 g→h→i→j→k→l 实现状态机、真实后端/EOF 接线、恢复、启动/错误/mock 页面；8 个既有 shell 文件 + 17 个新文件，证据只追加。backend、依赖、onboarding.js、规划审核、全局配置与其他 feature 均未改；未开始 T-06b/T-07 或打包。
- 结束后协调者确认 **26 文件 SHA-256 全部一致**，保存实施源码/证据为 **`f7d347b2a2f6796e5bbca0c608f327163046bc38`**，原样集成主树；不是“稳定性全部关闭”提交。主检查点 = 本文件所在 HEAD；实施树若同步进度文档，以 git log 查询最新 HEAD。

### 最后源码上的验证与真实边界

| 项 | 结果 |
|---|---|
| 本轮新基线 | npm ci 成功；34 unit / 2 场景 37/37，非仅引用前轮结果 |
| 最后完整 unit | **42 passed / 0 failed / 0 skipped（4988.49ms）**，生产状态机直接测试 |
| 最后完整 e2e | **14 场景 / 213/213 断言 / 0 failures / exit 0（67.092s）**，含原 2 场景与新 12 场景 |
| 真实后端 | 正常 shutdown 清锁/端点/端口；崩溃后新端口/令牌、restarts1；仅杀外壳后 ≤5s 后端 exit0、自行释放资源、同目录重启 ready |
| 假后端 | 严格三条件健康、重启恰 4 次启动/3 次预算、峰值 1、超时/磁盘满/错误页；不作真实满盘或业务证明 |
| 资源/界面 | 就绪前启动页可见、retry、只读通道/数据目录错误、显式 mock 不 spawn、资源缺失不回退、补齐后重载不重启 backend |
| 隔离/清理 | 全部自有 temp/ACL/helper；最终 owned 进程 **0**、ACL 已恢复并实写、场景 temp 已删除；无后台 worker/服务/端口保留 |
| 运行时 | Electron33.4.11 / 内嵌 Node20.18.3 / Chrome130.0.6723.191；非打包 exe、非15s基准机验收 |

具体 Windows 故障已修：先前仅杀外壳两次出现 exit0 却残留锁/端点，改为 Windows spawn `detached:true` 隔离控制台生命周期，**不 unref**、仍由状态机/pipe EOF 托管；无需 Job Object、后端改动或新依赖，之后真实清理与恢复通过。锁场景最初额外“整读锁文件”被字节锁拒绝，改用真实 Service.init 成功/锁存在/helper 存活，保留必需错误码/路径/零重启/真实 retry 断言。app-config `null` 入口形状校验也已修并完整重跑。

### 未关闭：root-locked 一次间歇性超时

- 首轮全集 212/212 通过；补 config-null 校验后的全集 **202/203、1 failure**：root-locked 等待 `failed` 的 10s 条件超时，清理前快照为 **gen1 / waiting_health / port=null**。失败运行已清理，不是进程残留。
- **未改超时或断言**的单独核查 16/16 与最后全集 213/213 虽通过，但证据不能区分启动迟滞还是其他原因，**根因未确认、未宣称修复**。不得只引用绿灯丢掉 FAIL，不自行把该风险评级为 P3 或用户已接受。
- **T-05k 保留“实现/末次通过，稳定性复核未关闭”状态**；下一次优先在原范围诊断时序/进程/标记观测，必要时交独立审核判断。不能仅靠增大超时、反复跑到绿灯或弱化断言关闭；如要改设计/安全面/权限范围，回 Plan 流程。此项未结算前，不直接推进 T-06b。

### 证据与下一步

- 详细证据 **`specs/desktop-shell/implementation-evidence.md` §8**；最终报告、派工、最终 unit/e2e、**间歇失败完整输出**与源码指纹在 **`specs/desktop-shell/handoff-artifacts/20261029-lifecycle/`**。完整会话/其他失败日志/diff/测试库留 Git 外。
- 原始 run：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-lifecycle-GULOgc3i/`；全部测试日志：`C:/Users/iswal/AppData/Local/Temp/fai-lifecycle-01a185d9/`。本轮未跑 Python 全量或 backend 打包，旧454/5与12/12只为历史证据。
- **下一步先复核 T-05k 的 root-locked 间歇超时，再从 T-06b 继续**；其余21项、人工/外部验收仍未开始/未完成。旧 onboarding.js 的同步 backend() 消费者刻意留给 T-06b，不宣称设置业务可用。真实前端/作业/agent、clean install、15s、人工 M-ID、托盘/通知/诊断与整体 Converge/独立代码 Review/Gate2 均未取得；已知PYZ P3不变，不加 CORS、不 push/PR/merge。

## 14. 2026-10-29 T-05k 有界诊断与独立评估（P3 OPEN，非阻塞）

### 输入、角色、实际改动

- 用户继续后，主树输入 `40aff0c` / 实施树输入 **`35e5f7869b9d80bcf49a37ab21336072ed611ffc`**，开始均干净、相关内容一致；Checklist **41 checked / 0 unchecked**，需求/Plan/Checklist未改。
- Implement/debug=**`openai/gpt-6-astra` via openai**，新session **`01a18620-5f99-7422-91f6-e006cb8c47a3`**（05:27～05:41 UTC），元数据实核，原实施树/分支唯一writer，无回退。协调仅派工、记录、核对与集成，未代写实现或跑产品测试。
- 有界执行 **2次定向（1次import profiling）+1次全集诊断**，均未复现历史失败；正常spawn→分类约 **2.11s / 2.42s**，profile有额外开销，不能解释原故障。没有盲改10s/30s预算，没有无限重跑到绿。
- 最终仅 `root-locked.js` **+24/−2** 安全单调时间线与证据§9追加；原错误继续抛出，断言/清理/超时未改。临时hooks观测完全恢复，生产/后端/依赖/全局配置零改；指纹核对后保存实施提交 **`681d4bb09736c2cfec16ccda6f14b854acb8f181`**，原样集成主树。

### 新验证与独立A结论

| 项 | 结果 |
|---|---|
| 最后完整unit | **42 passed / 0 failed / 0 skipped（4974.143ms）** |
| 最后独立root-locked | **16/16、exit0** |
| 最后全登记e2e | **14场景、213/213、0 failures、exit0（67.203s）** |
| 清理/冻结 | owned进程 **0**，ACL已恢复且实写、场景temp删除；仅2授权差异、211输入文件未改；未运行backend全量/打包 |

- 依§13启动**窄范围技术风险补充审阅**，不是完整feature Review/Converge/Gate2。A=**`anthropic/claude-fable-5-1`**，新独立session **`01a18632-84de-7247-b0ff-2a0d46152f95`**；同窗口不重试已耗尽bridge，本轮官方最小真实调用成功。独立树 `D:/2030/Futures-AI-desktop-lock-risk` / `review/desktop-shell-root-lock-risk`，审期HEAD固定 **681d4bb**。
- A仅写 **`specs/desktop-shell/root-lock-risk-review.md`**，不执行测试、不动源码/Checklist/原进度，18份输入SHA前后全一致。协调指出整锁读取/旧快照证明力/Unicode路径三处事实过推后，**同一A同一模型自行勘误**并保留§0.1记录，未换审或由协调者改判；最终v2结论不变。
- **A最终独立判定：本窄范围无P1/P2；RL-01=P3残余，根因UNKNOWN，保持OPEN；T-05k不必继续blocked，可继续Implement。** 10s来自通用测试观察窗，不是AC-004-2时限；生产启动有Plan的30s失败路径。**不是根因已修复、用户已接受或整feature通过**。

### 条件与后续（不可漏）

1. **下一项可从 T-06b 继续**，不是复跑到绿后自行放行，而是上述单审A的非阻塞评估；本次尚未开始T-06b/T-07。
2. **RL-01继续UNKNOWN/OPEN**，保留历史202/203 FAIL与所有绿灯。不得从旧snapshot反推OS存活或“没有marker”；该快照只证明Node未观察到exit/close/分类。复现时附OS/producer时刻重新评估；若证实OS已退出而Node长时间未感知，按A条件升级P2回修。
3. **整体Converge/Review前必须按既定文档/派工流程补RL-02正负对照**：合法>10s且在producer deadline内的真实宿主延迟分类仍严格data_root_locked/零重启/不伤holder/可retry；超deadline与错误marker/退出码必须仍失败。不能只调大测试超时。具体方案见A报告§4，当前未执行，不把建议当新批准实现。
4. RL-03常驻producer时间戳属于生产代码/额外观测，需先批准；本轮未保留。RL-04 UTF-8 chunk边界可能损坏**中文path与detail**（非仅message），A评P3，建议整体Review前作为Converge修补任务处理；未在本轮顺手改源码。RL-05 deadline边界按现有Plan，不隐含改设计。
5. 原21项与人工/外部验收未完成；旧onboarding.js接口迁移及CORS正对照留T-06b等，仍触发停止规则即停报；已知PYZ P3不变。完整Converge/代码Review/Gate2均未取得，不push/PR/merge。

### 保存与恢复

- 主集成检查点=本文件所在HEAD；实施源码观察提交=681d4bb，若同步进度文档以实施树git log查询最新HEAD。两棵树相关代码/文档会在无writer边界串行同步；不得从历史审核树回拷旧进度。
- 当前权威证据：`implementation-evidence.md` **§9** + **`root-lock-risk-review.md`最终v2**。分派/最终报告/普通时间线/最终unit/e2e/审核输入指纹与A勘误摘要在 **`handoff-artifacts/20261029-lockprobe/`**；原始历史失败仍在前序lifecycle目录。
- 原始run `C:/Users/iswal/AppData/Local/Temp/desktop-shell-lockprobe-FiY0hypq/`；原始测试/诊断 `C:/Users/iswal/AppData/Local/Temp/fai-lockprobe-01a18620/`。大型profile日志、完整session、diff/测试库不入Git。本轮两个agent均结束，无服务、控制端口或自有进程需保留。

## 15. 2026-10-29 设置宿主界面（T-06b检查点通过；T-06c/d待方案兼容修补）

- 用户继续后，主树输入 `8a5ea69` / 实施树输入 **`c33fa9d`**，开始均干净，相关源码/feature文档/交接内容一致。Checklist41 checked/0 unchecked；A已判RL-01非阻塞但保持OPEN，未把根因当已修。
- 唯一实施writer=session **`01a18698-0ad0-7456-8578-dd4892e22bd5`**，元数据实核 **openai/gpt-6-astra via openai**，原树/分支，无回退；协调仅派工、记录及后续串行集成。
- 仅T-06b→c→d：异步当前端点与安全DOM/邮箱保护、引导与菜单设置入口、显式消费核心注册指引；仅授权shell界面/导航/五场景与证据追加。backend/**、依赖/生命周期/规划审核/全局配置只读，不开始T-07，也不重开RL控制实验或PYZ修补。
- 必须真实settings-sources XHR正对照、真实加密档案夹具；组织类型11后台项+1占位=12options。e2e不验证/提交真实key，不访EIA，外链只经记录器；注册指引只在用户点击后显示真实合成邮箱，离开清空，不入日志/缓存。
- **硬停止规则**：真实file://→127.0.0.1请求若被CORS/OPTIONS/权限阻止，保留Node同端点与renderer的安全诊断差异，停在受影响任务；禁止加CORSMiddleware、关闭webSecurity/CSP/sandbox、加main/preload代理或mock API/硬编码列表取绿，须先回Plan/Analyze/A复查及必要人工批准。
- run：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-settings-owBsqdLT/`；Astra已在07:52结束，**T-06b**最后源码42unit/0skip、16场景236/236，两个新业务场景23/23；真实file页面12options/EIA回退/DELETE空key/PUT姓名均成功，未触发CORS，未改backend/安全。最初清除按钮隐藏8/10失败已修且保留。六文件指纹核对后保存实施提交 **d77ce69520f2530532476f32a0735aa76691c301**；owned进程0，temp已删。
- **T-06c/d未实施**：旧startup-visible严格等于五成员bridge，与已批准openSettings冲突；旧frontend-missing使用未完成引导的新根却要求直接进frontend，与Plan首启优先冲突；测试固定命令没有真实应用菜单点击驱动。禁止隐匿API/假点击/改生产路由迎合旧测试，需先明确最小兼容写权限与菜单方案。
- Plan/Tasks/Analyze窄范围修补进行中（非需求变更、非CORS调整），原目标/AC不变。固定主检查点 **4b0c3c510906bba83f41eac4ac34bbbccf1c1a30**；独立规划树 `D:/2030/Futures-AI-desktop-settings-plan` / `plan/desktop-shell-settings-routing`，session **01a186ae-a724-7435-9516-4e3e3028f6a5** 元数据实核 **anthropic/claude-opus-5-5**。同窗口不重试已耗尽bridge，本轮官方真实最小调用ROUTING_PLAN_OK。
- 规划者仅写plan/tasks/analyze（新增迭代）与settings-routing-review-request；此处为开工时点描述。现Plan5/Analyze8与A第4轮已完成，最新批准见§16，非复用旧41/41假放行。

## 16. 2026-10-29 Plan5 / Analyze8 / A第4轮质量批准

- 四份规划文档固定提交 **38c482c6c97085d25c913e3cfdee2c0938854201**（相对4b0c3c5仅四文档）。同一首选 **anthropic/claude-opus-5-5** via官方：首会话01a186ae-a724-7435-9516-4e3e3028f6a5设计、聚焦收尾01a186cd-cda4-7695-a01c-0c406624215d；长生成在无活动tool边界由协调者保存/中止后同模型通道续作，人工exit1不是额度/鉴权/模型失败，不触发回退。草稿150tab/CRLF格式障碍由协调者仅用edit修格式，未代写技术方案。静态曾有awk/od等读取快捷方式，不作为后续工具惯例。
- 设计：无参数openMain固定返回目标；routeToMain真实GETprofile决定首启/目标；openSettings共用生产处理器。仅test-hooks新增app-menu-click单值settings驱动真实MenuItem.click，不开放任意主进程JS/路径；startup-visible用批准18全集/当前7必需/禁止项，frontend-missing核心标记完成后验证资源，均保留原保证。任务仍41、61.5h（T06c=2h）。无Spec/AC/CORS/后端/依赖变更。
- A=**anthropic/claude-fable-5-1**官方，本轮SETTINGS_REVIEW_OK真实探活成功，同窗口不重试已耗尽bridge；新独立session **01a186df-a8d4-7549-a450-deb727c6dd65** 元数据实核。独立树 `D:/2030/Futures-AI-desktop-settings-checklist` / `review/desktop-shell-settings-routing`，HEAD固定38c482c，只写Checklist；17份输入指纹前后全一致，不跑测试。
- **A第4轮结论：41 checked/0 unchecked，无P1/P2，R5-01～04四项P3，T06c/d修订5文档前置满足**。R5-01完成/验证编号不对位但具名覆盖全，Converge按断言核对；R5-02菜单409不可达分支缺自动化跟踪；R5-03 **实施T08e前必须补依赖T06d及完整档案+点击准备注册前提**；R5-04接口类型eval与空window not_ready为必要兼容。无额外工程批准/ADR/Gate1需求，A不授予更大范围。
- 接下来在无writer边界同步四规划+A Checklist到原实施树并固定新输入，才由同首选Astra恢复T06c/d。当前代码仍T06b检查点，19场景未执行；原RL/PYZ/UTF8等跟踪与Gate2边界不变。run `C:/Users/iswal/AppData/Local/Temp/desktop-shell-routing-2nBCT4xX/`。
