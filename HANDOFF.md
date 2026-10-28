# desktop-shell 恢复入口（保留暂停 WIP 交接）

> **最新状态（2026-10-28 18:28 UTC）：Plan 修订 4 / Analyze 迭代 7 已完成，独立 A 对修订 4 复查通过（41/41，无 P1/P2，3 项 P3）；正在准备固定实施输入，随后由 Astra 仅修 T-04b 构建收集源头。** 黑名单保持不变；新代码/测试/重建尚未执行。最近产品实证仍为 **451 passed / 5 online skips、构建成功、真实冒烟 11/12**，未启动 T-05。
> Plan = `anthropic/claude-opus-5-5`，A = `anthropic/claude-fable-5-1`（均独立会话/工作树）；实施继续 `openai/gpt-6-astra`，协调 = `openai/gpt-6.1-sol`。**先读 §11 和当前 Checklist 的第 3 轮复查，再读 §10 / `implementation-evidence.md`**。A 同时登记了 PYZ 中既存的 `pyarrow.conftest` / `pyarrow.tests` / `pyarrow.tests.util` 残余，本轮不剔除、不宣称包内没有任何测试代码。Gate 2 未批准，仍不 push / PR / merge。

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

## 10. 2026-10-28 恢复后检查点（当前权威状态）

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

## 11. 2026-10-28 17:56 UTC 窄范围修补批准（进行中）

- Walter 对“修构建收集源头、排除第三方测试资产、保持黑名单不变；先修 Plan/Tasks、Analyze、A 独立复查，再交 Astra”明确答复“是的”。这不是需求变更、黑名单例外或 Gate 2；上节“尚未批准范围”仅属先前时点。
- 本轮固定输入主树 `1275ae2`。规划工作树 `D:/2030/Futures-AI-desktop-build-plan` / `plan/desktop-shell-build-assets`，会话 `01a183a9-aa0d-71f9-b5a9-add01c9d3107` 元数据已确认实际 `anthropic/claude-opus-5-5`；只写 feature 的 plan.md / tasks.md / analyze.md 与新增 build-assets-review-request.md，源码和 Checklist 只读。协调者在逐字节核对现有测试修复与证据和主快照一致后，将实施树这两个 WIP 文件本地保存为 **`9ae2ad9`**（非批次完成提交）；实施树已干净，无 reset，覆盖 §10 的旧 HEAD/dirty 定位。
- Plan 首选 `claude-opus-5-5` 的 bridge 在本 seven_day 窗口已知耗尽，不重复请求；本轮官方最小真实调用返回 `PLAN_ROUTE_OK`，实际以 `anthropic/claude-opus-5-5` 开新独立会话。A 同窗口沿用官方通道，本轮最小真实调用返回 `REVIEW_ROUTE_OK`，实际 `anthropic/claude-fable-5-1`，尚未启动正式复查。
- 仓库外请求/路由/会话/日志：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-buildfix-s9IO23nK/`。Plan 14 分钟内完成修订 4 / Analyze 7，仅四个规划文件，已集成为 **`981d4301f069f71dd120a1a86124dbe03aa54e0c`**；源码、spec、黑名单和旧 Checklist 均未改。T-04b 估时改为 2h，任务仍 41 个、总估时 61h。
- A 在新工作树 `D:/2030/Futures-AI-desktop-build-checklist` / `review/desktop-shell-build-assets` 固定审查 `1275ae2..981d430`，会话 **`01a183ba-241b-76cf-8588-b472ac61c90c`** 元数据确认实际 `anthropic/claude-fable-5-1`。结论：修订 4 质量复查通过，**41 checked / 0 unchecked，无 P1/P2**。A 只改 Checklist；11 份输入文件 SHA-256 前后均一致。此结论不是代码 Review 或新产物通过。
- 新 P3：R4-01 已核实 PYZ 中保留 `pyarrow.conftest`、`pyarrow.tests`、`pyarrow.tests.util`（不生成本轮文件系统黑名单目录，本次不剔除，Review/Gate 2 继续跟踪）；R4-02 日志路径使用 repr，反斜杠成对；R4-03 全量扫描会读保留的构建文本（A 静态核对未命中，但不代替实际测试）。不把这些写成已解决。
- 接下来将已批准的四份规划文件与 A 的 Checklist 同步到实施树，并提交为固定输入；具体 `<输入基线>` 写入仓库外 `approved-baseline.txt`。本次新开同一 `openai/gpt-6-astra` 模型的聚焦实施会话，在**同一实施工作树/分支**串行修复，不是模型回退；旧会话已停，无并行 writer。只允许 build_backend.py、新仓库 hook、新 test_app_packaging.py 与实施证据追加，先完成七步验证再汇报，不开 T-05。
