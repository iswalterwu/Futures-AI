# desktop-shell 恢复入口（保留暂停 WIP 交接）

> **最新检查点：T-05b/c/d/m/e/f 六项外壳基础任务已完成自动化复验，下一项 T-05g（2026-10-28）**。Astra 从 `83b91db` 串行实施，最终真实 `npm ci` 成功、单测 **34 passed / 0 skipped**、真实 Electron **2 场景 / 37/37 断言通过**；单实例后端始终只启动一次。实施源码已本地保存为 **`a643f81`**，未开始 T-05g / T-07。
> 实施 = `openai/gpt-6-astra`，协调 = `openai/gpt-6.1-sol`；**先读最新 §12 与 `implementation-evidence.md` §7**。本批进程/场景临时目录已清理，无后台 worker；真实 Windows 前台焦点仍待 M-09，不把夹具/基础设施当作真实作业或全 feature 通过。Checklist 41/41 不变，Gate 2 未批准，仍不 push / PR / merge。

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

## 12. 2026-10-28 外壳基础六任务（当前已验证检查点）

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
