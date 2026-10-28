# desktop-shell 第一批后端实施检查点

> Implement = `openai/gpt-6-astra` via `openai`；session `01a18285-2349-7290-b570-c8f9b2e18658`（本轮 PI 环境实核）。未换模型、未启动其他 agent。
> **结论：前七项后端范围复验通过；T-04b 被真实产物黑名单阻塞。保留 WIP，不做批次完成提交。** 不是整个 AC/feature 验收，不是 Converge、Review 或 Gate 2。

## 1. 输入与权限

- 工作树：`D:/2030/Futures-AI-desktop-implement`，分支 `feat/desktop-shell-astra`。
- 原始源码基线：`8ba1b6a304f916e3d57ebdd6b89790b75a15f14c`。
- 本轮恢复输入 / 当前 HEAD：`782aa2027ae53d18fb2e55bf007823791a9d19bd`（暂停 WIP，包含此前实施代码与规划材料）；开始时工作树干净。规划 overlay “未提交”是历史口径，不适用于本轮快照。
- 用户明确恢复后执行；HANDOFF 中历史暂停指令不作为继续阻碍。本轮仅第一批八项，不启动 T-05b。
- 已完整补读 HANDOFF、AGENTS、docs/plan、docs/architecture、desktop-shell 的 spec/plan/tasks/checklist/analyze/review，以及 D-007/D-010/D-012/D-014 和原始批次请求。测试前独立计数 checklist：**41 checked / 0 unchecked**，未修改。
- `backend/tools/build_backend.py`、data/settings、shell、packaging、docs、冻结规格与进度元数据保持只读；构建生成物未手改。

## 2. 历史证据与本轮结果分开

暂停前全量基线为 **389 passed / 5 skipped，125.85s**，见 HANDOFF 与暂停证据。这不是本轮结果。暂停前局部测试及 stdin 缓冲读取导致解释器退出异常的修复，亦仅属历史记录；本轮在保存后的最终代码上重新验证。

环境：Windows / Python **3.14.2** / pytest **9.0.3**。全部本轮 pytest 用 `PYTHONDONTWRITEBYTECODE=1`、`PYTHONIOENCODING=utf-8`、`-p no:cacheprovider`，每次 `tempfile.mkdtemp` 创建全新仓库外 basetemp。未开启在线冒烟、未读取真实凭证、未请求 EIA。

| 顺序 | 验证 | 结果 |
|---|---|---|
| 1 | 恢复后六文件，保存代码首次复跑 | **80 passed in 54.45s** |
| 2 | 首次全量 | **1 failed, 450 passed, 5 skipped in 187.62s**；新增测试固定哨兵触发凭证字面量扫描 |
| 3 | 初次修复后六文件 + test_scan | **1 failed, 84 passed in 61.51s**；即使追加 UUID，前置长字符串仍被规则命中 |
| 4 | 最终修复后六文件 + test_scan | **85 passed in 65.89s** |
| 5 | 最终全量（构建之前） | **451 passed, 5 skipped in 207.40s** |
| 6 | 真实 `tools/build_backend.py` | **退出码 0，192.53s**；生成本工作树 onedir exe |
| 7 | 真实 `tools/shell_check.py` | **退出码 1，11/12 通过**；唯一失败为 `_internal/pyarrow/tests` 命中冻结黑名单 |

五个 skip 均为 `tests/test_smoke_online.py`（39/50/62/76/91 行）：需显式 `FUTURESAI_ONLINE=1` 才执行；本轮未启用，不证明真实上游可用。

### 实际命令（cwd = backend）

首次六文件复跑：

```bash
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_health.py','tests/test_app_startup_errors.py','tests/test_app_lifecycle.py','tests/test_app_channel.py','tests/test_app_settings_api.py','tests/test_app_disk_full.py','-q','-vv','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-resume-targeted-')]))"
```

修复后的联合检查（两次，分别对应上表 3/4）：

```bash
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_health.py','tests/test_app_startup_errors.py','tests/test_app_lifecycle.py','tests/test_app_channel.py','tests/test_app_settings_api.py','tests/test_app_disk_full.py','tests/test_scan.py','-q','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-resume-fixed-')]))"
```

全量（两次，分别对应上表 2/5）：

```bash
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/','-q','-rs','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-resume-full-')]))"
```

构建与冒烟（构建使用包装器保存完整输出至仓库外）：

```bash
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys,time; from pathlib import Path; log=Path(tempfile.mkdtemp(prefix='fai-resume-build-'))/'build.txt'; print('BUILD_LOG',log,flush=True); start=time.monotonic(); out=log.open('w',encoding='utf-8'); result=subprocess.run([sys.executable,'tools/build_backend.py'],stdout=out,stderr=subprocess.STDOUT); out.close(); print('BUILD_EXIT',result.returncode,'SECONDS',round(time.monotonic()-start,2)); sys.exit(result.returncode)"
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python tools/shell_check.py
```

完整构建日志：`%TEMP%/fai-resume-build-bon07pti/build.txt`（181 行）。构建有 Pydantic V1 与 Python 3.14 兼容性警告，不能称零警告构建；本轮真实 exe 已通过下述宿主冒烟，但不证明所有第三方能力兼容。

## 3. 八项任务的后端侧状态

下表“通过”仅指本批任务的后端修改与自动化检查；相同 AC 的 shell/GUI/外部子句不随之完成。首次 `-vv` 输出确认约定测试名均实际执行并 PASSED，最终联合/全量再覆盖全部用例。

| 任务 | AC / 范围 | 实证与状态 |
|---|---|---|
| T-01b | AC-002-2 后端健康 | **通过**：真实两库 SELECT 1、访问锁持有断言；cat/store 边界故障和已关闭 Service → 503、仅异常类型；正常恢复 200。shell 就绪状态机未验证 |
| T-01c | AC-004-2/3、AC-007-4 启动期 | **通过**：真实 Service 锁、真实子进程 exit 3 / 单条标记；本次临时子目录 icacls 拒写且操作实证，finally 恢复并写入验证；ENOSPC/cause/winerror 分类、坏 SQLite 兜底与初始化资源释放。GUI 提示未验证 |
| T-01d | AC-007-1 | **通过**：双宿主不同根目录同时就绪、端口不同；独占端口冲突 10s 内 exit 3 / port_in_use，锁释放 |
| T-02b | AC-003-1/3 后端侧 | **通过**：stdin EOF 启用时 5s 内优雅退出并释放锁/端口；默认不启用时 EOF 不退出；既有 shutdown 与强杀陈旧锁恢复通过。真实强杀 Electron 场景待后续 |
| T-02c | WO-13、AC-004-1 后端唯一性基础、AC-003-1 | **通过**：宿主持锁时真实 data/settings CLI 只读请求成功、同端口；独立通道令牌、跨令牌拒绝、重启轮换、退出删除端点。不含 MCP 工具或 agent；不证明窗口单实例聚焦 |
| T-03b | AC-005-4、AC-007-4 | **通过**：遮蔽邮箱 422 且密文文件逐字节不变、部分更新/清空；真实加密存储在 os.write/os.replace 边界 ENOSPC → 507、旧值保存、health 仍 200。key 验证仅注入网络边界，不访问上游 |
| T-03c | AC-005-3/4、AC-009-4 后端隐私 | **通过**：真实核心/加密档案、五项字面量期望、官方 Category 标签、真实邮箱仅显式指引、缺项/401/损坏档案；已加密哨兵 key 不在响应中、邮箱/key 不在捕获日志。GUI/诊断包隐私待后续 |
| T-04b | AC-002-2、AC-009-1、AC-001-4 后端产物 | **部分通过 / blocked**：就绪判据五组正反例、全部 19 类扫描夹具、真实源码 PID netstat 通过；真实 exe 健康/回环通过；**真实产物黑名单失败，任务未完成** |

## 4. 本轮失败、最小修复与打包阻塞

本轮唯一源码差异相对输入 WIP：`backend/tests/test_app_settings_api.py` 的 `TestRegistrationGuide::test_no_key_in_response_and_no_email_in_logs` 新增局部 UUID 导入，哨兵改为运行时生成（FAIPLANT / KEY 标签与 UUID 用 join 组合）。初次只追加 UUID 仍触发扫描，最终改正；没有修改扫描器、豁免规则或隐私断言，真实 `creds.put` 仍加密保存哨兵。

T-04b 真实输出摘要：

```text
PASS  打包产物存在
FAIL  产物不含黑名单文件（AC-001-4） — _internal/pyarrow/tests
PASS  就绪：/health 200 且 data_ready（AC-002-2） — health=200/ok/true
PASS  监听地址仅 127.0.0.1（AC-009-1） — pid=47224, LISTENING=['127.0.0.1']
PASS  内置三源随包（AC-001-4） — ['akshare', 'eia', 'local-file']
PASS  非 /health 端点需令牌（AC-009-1） — http 401
PASS  优雅退出（AC-003-1） — rc=0
PASS  退出后写锁释放（AC-003-1）
PASS  退出后只读端点删除（AC-003-1）
PASS  退出后端口释放（AC-003-1）
PASS  本次后端进程已退出 — pid=47224
PASS  临时目录已删除
11/12 项通过
```

命中的是实际第三方目录 `backend/dist/futuresai-backend/_internal/pyarrow/tests`，包含 `.pyx` 与 feather/orc/parquet 测试数据，并非仅空目录。冻结 Plan §7.4 禁止所有 `tests/`，不允许第三方例外。现有构建脚本虽传 `--exclude-module tests`，实际产物仍含该路径；本轮不推断/修改依赖 hook，不直接删除生成物来伪造成功。

**停止理由**：修复构建收集范围需要触及本轮只读的构建源头或扩展授权；应由协调者明确后续所有权与处理方案。黑名单保持冻结。解决后需重新生成产物并重跑完整冒烟，不能只重扫手工删改的目录。

## 5. 清理、所有权与交接

- 源码子进程测试只跟踪并退出各自创建的进程；ACL 仅用于测试新建目录并有恢复验证。打包冒烟确认后端 PID 47224 退出、锁/只读端点删除、端口可重新绑定，整份 smoke 临时目录已删除。
- 冒烟后用 `Get-Process -Id 47224` 与 CIM 定向检查本工作树打包后端 / `fai-resume-` 根的 `python -m app`：均无匹配；没有杀其他进程、没有后台服务需保留。
- pytest 的外部 basetemp 与外部构建日志可留作本地证据，未声称所有 pytest 临时夹具目录已删除；未入库。生成的 `backend/build` 与 `backend/dist` 保留供阻塞复核，属于忽略的构建产物，不手改、不提交。
- `git diff --check` 通过；所有权检查使用 `git status --short --ignored --` 显式列出九个自有代码/测试路径及本证据文件。本轮只改设置测试并新建本文件，其余八个实施文件已在输入 WIP 中。本轮未改只读文件、未勾选 checklist。
- 无新 commit；HEAD 仍为输入 WIP。未 push、PR、merge、reset；未更新协调者拥有的 tasks/review/README 状态。
- **下一检查点**：协调者先处置 T-04b 的 pyarrow 测试资源收集阻塞并复验；后续 shell 的首任务仍是 **T-05b**，本轮未启动，不能跳 T-07。
- 未取得：真实前端与 preload 接口集成、作业引擎/drain、agent、真实 EIA 注册/key、发布通道、干净 Windows 安装卸载、基准机 15 秒、系统通知/托盘观感、真实满盘及 507 GUI 渲染。没有这些验收、整体 Converge、独立代码 Review 或 Gate 2 通过声明。

## 6. 2026-10-28 修订 4 构建收集源头修正（T-04b）

### 6.1 固定输入、批准与所有权

- Implement = `openai/gpt-6-astra` via `openai`；新聚焦 session **`01a183c8-f4a5-778d-acfc-d458ead81908`**，PI 环境实核。不是模型回退；没有新 agent 或其他 writer。
- 工作树 / 分支：`D:/2030/Futures-AI-desktop-implement` / `feat/desktop-shell-astra`。固定输入与结束 HEAD 均为 **`3a9ec35512ad593cc931f98dc5c3a347342f4e45`**，开始时工作树干净。
- 第一读为仓库外 `C:/Users/iswal/AppData/Local/Temp/desktop-shell-buildfix-s9IO23nK/approved-baseline.txt`；HEAD 与该文件一致。已完整读取请求规定的 AGENTS、HANDOFF（最新 §11）、docs/plan、architecture、D-007 和八份 feature 文件。
- A 的新修订 4 复查：`anthropic/claude-fable-5-1`，session `01a183ba-241b-76cf-8588-b472ac61c90c`；固定审查 `1275ae2..981d4301f069f71dd120a1a86124dbe03aa54e0c`，明确 PASS、无 P1/P2、3 项 P3。实施者重读全文并用 `rg -c '^- \[x\]'` / `rg -c '^- \[ \]'` 核对 **41 checked / 0 unchecked**（后者无匹配，退出 1）；不是沿用修订 3 的批准。批准文件所列协调检查点为 `ccbc2916f296ed6ebf557b96f5c3219c9124c9f6`。
- 只写四个授权路径：
  1. `backend/tools/build_backend.py`：仅新增 `HOOKS` 目录常量、`--additional-hooks-dir` 参数与一行 docstring；其他参数和 `--clean` 行为不变。
  2. 新 `backend/tools/pyinstaller_hooks/hook-pyarrow.py`：三条真实公开 API 赋值；仅 datas 使用 `excludes=['tests']`，hiddenimports/binaries 与 contrib 等价；无 `__init__.py`，未复制许可证或整份上游 hook。
  3. 新 `backend/tests/test_app_packaging.py`：恰三个约定名测试；只有接线测试注入 `subprocess.run`；模块级 fixture 各真实执行仓库 / contrib hook 一次，不 mock `collect_*`；正锚点为 `pyarrow.lib/compute/parquet`、`arrow.dll/parquet.dll`、`pyarrow/include/arrow/api.h`。
  4. 本文件只追加本节，§1～§5 的七项后端证据、失败与警告保留原文。
- 编辑前用 read 核对实际构建/冒烟/health 测试源码及已安装 contrib hook、PyInstaller `collect_submodules` / `collect_data_files` / `collect_dynamic_libs`、hook 选择与优先级实现。环境版本为 Python 3.14.2、pytest 9.0.3、PyInstaller 6.22.3、hooks-contrib 2026.9、pyarrow 22.0.0；没有安装或改动依赖。

### 6.2 七步验证的真实结果（严格按顺序）

以下为本 session 新结果，不复用此前 451 passed / 5 skips 与 11/12：

| 步骤 | 实际结果 |
|---|---|
| 1 聚焦测试 | **3 passed / 0 skipped，1.79s，退出 0**；三个约定名均 PASSED；真实 upstream parity、非空测试资产差集、模块/DLL/header 正锚点通过 |
| 2 全量后端（保留旧 build/dist 时运行） | **454 passed / 5 skipped，181.46s，退出 0**；包括真实 hook 与凭证扫描；无新增 skip |
| 2 补跑只读 health 文件 | **34 passed，9.77s，退出 0**；`-q -v` 只展示文件级点阵，故又以 `-vv` 跑约定 netstat + readiness 名称：**6 passed，7.07s，退出 0**；这是增加逐名输出，不是失败重试 |
| 3 重建前 manifest | 确认旧 `dist/futuresai-backend` 及 `_internal/pyarrow/tests` 均存在后生成；**3411 个文件路径**，保存在 Git 外 |
| 4 真实 `build_backend.py --clean` | **退出 0，95.78s**；只由现有构建脚本清理/再生成，未手删或修改产物；日志证明仓库 hook 生效 |
| 5 未修改的真实 `shell_check.py` | **12/12，退出 0，墙钟 6.221s**；无额外参数 |
| 6 路径对比 | **REMOVED 17 / ADDED 0 / OTHER_REMOVED 0，退出 0**；重建后 3394 个文件路径，所有移除项均在 `_internal/pyarrow/tests/` 下 |
| 7 静态与冻结核对 | `git diff --check` 通过；spec / scanner / health 及其他禁止路径相对固定输入零差异；新文件不被忽略；运行时代码无直接 pyarrow import；HEAD 未移动 |

**失败 / 重跑历史**：本修订 4 没有产品测试失败、构建失败、冒烟失败或修复后重跑；源码一次写入后全部验证通过。接线单测的非零返回 7 是批准的边界注入，用于证明真实构建入口透传失败码，不是实际构建失败。旧 session 的全量与哨兵修复失败、11/12 阻塞仍保留于 §2 / §4。

5 个 skip 仍恰为 `tests/test_smoke_online.py:39/50/62/76/91`，原因均为“在线冒烟：设置 FUTURESAI_ONLINE=1 才执行”。未设 live 标志、未读取真实 key、未访问真实 EIA / 上游；不把这些 skip 算作上游通过。全部 pytest 使用无 bytecode、UTF-8、无 cache、新建仓库外 basetemp。

### 6.3 实际命令与外部产物

步骤 1～6 的 cwd = `backend`。步骤 1、2（含逐名补跑）实际命令：

```bash
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_packaging.py','-q','-vv','-rs','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-t04b-pack-')]))"
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/','-q','-rs','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-t04b-full-')]))"
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_health.py','-q','-v','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-t04b-health-')]))"
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys; sys.exit(subprocess.call([sys.executable,'-m','pytest','tests/test_app_health.py::TestLoopbackBind::test_listening_sockets_of_pid_are_loopback_only','tests/test_app_health.py::TestPackagedSmokeChecks::test_readiness_requires_actual_health_success','-q','-vv','-p','no:cacheprovider','--basetemp='+tempfile.mkdtemp(prefix='fai-t04b-health-named-')]))"
```

步骤 3、4、5：

```bash
test -d dist/futuresai-backend && test -d dist/futuresai-backend/_internal/pyarrow/tests && printf 'PRESERVED_BLOCKED_DIST_PRESENT\n' && python -c "import json,tempfile; from pathlib import Path; d=Path('dist/futuresai-backend'); out=Path(tempfile.mkdtemp(prefix='fai-t04b-before-'))/'files.json'; out.write_text(json.dumps(sorted(p.relative_to(d).as_posix() for p in d.rglob('*') if p.is_file())),encoding='utf-8'); print('BEFORE',out)"
PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python -c "import tempfile,subprocess,sys,time; from pathlib import Path; log=Path(tempfile.mkdtemp(prefix='fai-t04b-build-'))/'build.txt'; print('BUILD_LOG',log,flush=True); start=time.monotonic(); out=log.open('w',encoding='utf-8'); result=subprocess.run([sys.executable,'tools/build_backend.py','--clean'],stdout=out,stderr=subprocess.STDOUT); out.close(); print('BUILD_EXIT',result.returncode,'SECONDS',round(time.monotonic()-start,2)); sys.exit(result.returncode)"
rg -n "hook-pyarrow.py" C:/Users/iswal/AppData/Local/Temp/fai-t04b-build-i_2sbw7u/build.txt
time PYTHONDONTWRITEBYTECODE=1 PYTHONIOENCODING=utf-8 python tools/shell_check.py
```

外部完整构建日志：`C:/Users/iswal/AppData/Local/Temp/fai-t04b-build-i_2sbw7u/build.txt`，已用 read 完整读取。`rg` 只命中一行（105），没有来自 contrib 的 pyarrow hook 行；原始日志行（保留 repr 双反斜杠）：

```text
48119 INFO: Processing standard module hook 'hook-pyarrow.py' from 'D:\\2030\\Futures-AI-desktop-implement\\backend\\tools\\pyinstaller_hooks'
```

**构建警告如实保留**：两次 `UserWarning: Core Pydantic V1 functionality isn't compatible with Python 3.14 or greater.`（hooks/__init__.py:665 与 building/build_main.py:227）；另有 `77138 WARNING: Hidden import "scipy.special._cdflib" not found!`。构建还生成 `backend/build/pyinstaller/futuresai-backend/warn-futuresai-backend.txt`，未手改。不称零警告、不声称全部第三方能力兼容；未为消除警告改包版本或拓展修复范围。

步骤 6（任务原命令，随后额外保存 AFTER 与 delta 作为外部验证产物）：

```bash
python -c "import json,sys; from pathlib import Path; b=set(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))); d=Path('dist/futuresai-backend'); a={p.relative_to(d).as_posix() for p in d.rglob('*') if p.is_file()}; rm=sorted(b-a); add=sorted(a-b); bad=[p for p in rm if not p.startswith('_internal/pyarrow/tests/')]; print('REMOVED',len(rm),'ADDED',len(add),'OTHER_REMOVED',len(bad)); [print('ADD',p) for p in add]; [print('OTHER',p) for p in bad]; sys.exit(0 if rm and not add and not bad else 1)" C:/Users/iswal/AppData/Local/Temp/fai-t04b-before-q53j6r23/files.json
python -c "import json,tempfile; from pathlib import Path; d=Path('dist/futuresai-backend'); out=Path(tempfile.mkdtemp(prefix='fai-t04b-after-')); a=sorted(p.relative_to(d).as_posix() for p in d.rglob('*') if p.is_file()); b=json.loads(Path('C:/Users/iswal/AppData/Local/Temp/fai-t04b-before-q53j6r23/files.json').read_text(encoding='utf-8')); (out/'files.json').write_text(json.dumps(a),encoding='utf-8'); (out/'delta.json').write_text(json.dumps({'before_count':len(b),'after_count':len(a),'removed':sorted(set(b)-set(a)),'added':sorted(set(a)-set(b))},indent=2),encoding='utf-8'); print('AFTER',out/'files.json'); print('DELTA',out/'delta.json')"
```

- BEFORE：`C:/Users/iswal/AppData/Local/Temp/fai-t04b-before-q53j6r23/files.json`（3411）。
- AFTER：`C:/Users/iswal/AppData/Local/Temp/fai-t04b-after-c9n0y4hv/files.json`（3394）。
- 差集：同目录 `delta.json`（已用 read 读取），17 个移除路径 = 3 `.pyx`、4 `.parquet`、4 `.orc`、4 `.gz`、1 `.md`、1 `.feather`。示例：`_internal/pyarrow/tests/bound_function_visit_strings.pyx`、`_internal/pyarrow/tests/data/orc/README.md`、`_internal/pyarrow/tests/data/parquet/v0.7.1.parquet`、`_internal/pyarrow/tests/data/feather/v0.17.0.version.2-compression.lz4.feather`。
- 比较对象仅为文件路径；未以二进制 hash / 时间戳变化作为判断条件，未宣称重建二进制逐字节相等。

步骤 7（cwd = 仓库根；预期无匹配命令的 exit 1 单独记录，不当失败）：

```bash
git diff --check
git diff --exit-code 3a9ec35512ad593cc931f98dc5c3a347342f4e45 -- specs/desktop-shell/spec.md backend/tools/shell_check.py backend/tests/test_app_health.py
git check-ignore -v --no-index backend/tools/pyinstaller_hooks/hook-pyarrow.py backend/tests/test_app_packaging.py
git status --short --ignored -- backend/tools backend/tests specs/desktop-shell
rg -n "import pyarrow|from pyarrow" backend/app backend/data backend/settings
git diff --exit-code 3a9ec35512ad593cc931f98dc5c3a347342f4e45 -- . ':!backend/tools/build_backend.py' ':!specs/desktop-shell/implementation-evidence.md'
git status --short --untracked-files=all
git rev-parse HEAD
```

`check-ignore` 无输出 / exit 1，运行时 import 搜索无输出 / exit 1；其余检查通过。冻结 spec、Plan、Tasks、Checklist、Analyze、review、HANDOFF、README、scanner/黑名单、health 测试、运行时代码、shell/packaging、依赖配置均未改。最终工作树仅上述四个授权路径，未提交、push、PR、merge 或 reset。

### 6.4 真实冒烟、清理与结论

```text
PASS  打包产物存在
PASS  产物不含黑名单文件（AC-001-4）
PASS  就绪：/health 200 且 data_ready（AC-002-2） — health=200/ok/true
PASS  监听地址仅 127.0.0.1（AC-009-1） — pid=30988, LISTENING=['127.0.0.1']
PASS  内置三源随包（AC-001-4） — ['akshare', 'eia', 'local-file']
PASS  非 /health 端点需令牌（AC-009-1） — http 401
PASS  优雅退出（AC-003-1） — rc=0
PASS  退出后写锁释放（AC-003-1）
PASS  退出后只读端点删除（AC-003-1）
PASS  退出后端口释放（AC-003-1）
PASS  本次后端进程已退出 — pid=30988
PASS  临时目录已删除
12/12 项通过
```

- 冒烟实证包含 graceful exit 0、锁/只读端点删除、端口重新绑定成功、owned PID 30988 退出和整个 smoke 临时目录删除。未保留服务或端口；未杀其他任务进程。
- 随后额外只读 CIM 核查（输出 `OWNED_BACKEND_PROCESSES=0`、exit 0）：

```bash
powershell -NoProfile -Command '$owned = @(Get-CimInstance Win32_Process | Where-Object { $_.ProcessId -eq 30988 -or $_.ExecutablePath -eq "D:\2030\Futures-AI-desktop-implement\backend\dist\futuresai-backend\futuresai-backend.exe" -or ($_.Name -match "^python" -and $_.CommandLine -match "fai-t04b-" -and $_.CommandLine -match "-m app") }); $owned | Select-Object ProcessId,Name,ExecutablePath; Write-Output ("OWNED_BACKEND_PROCESSES=" + $owned.Count); if ($owned.Count -ne 0) { exit 1 }'
rg -n "'pyarrow\.(conftest|tests|tests.util)'" backend/build/pyinstaller/futuresai-backend/PYZ-00.toc
```

- R4-01 残余如批准范围所述保留：新 PYZ TOC 仍在 7689 / 7752 / 7755 行含 `pyarrow.conftest`、`pyarrow.tests`、`pyarrow.tests.util`。本修正**不**剔除这些纯模块，不把文件系统黑名单通过写成“包内无任何测试代码”。hook parity 与路径对比只是本次收集变更的窄范围证据；pandas 会吞 pyarrow ImportError，故整体 smoke 不单独证明打包 pyarrow API 可用。
- 外部 pytest basetemp、构建日志与 manifest 保留本地，未入库；不宣称全部 pytest 临时目录已删除。`backend/build` / `backend/dist` 为真实再生成的忽略产物，未手改。
- **本次结论：T-04b 后端范围完成，原 pyarrow 测试数据黑名单阻塞解除。** 未做整体 Converge、独立代码 Review 或 Gate 2；未修改协调者的进度表。下一个任务仍是 **T-05b**，本 session 到此停止，留协调者集成/提交并决定后续批准批次。
- 未取得的真实前端/作业引擎/drain/agent、真实 EIA 注册/key、发布通道、干净 Windows、基准机 15 秒、系统 toast/托盘、真实满盘/507 GUI、完整 AC 与 Gate 2 边界均不变；不以本次测试替代这些证据。
- 证据追加后的静态复查曾报 `new blank line at EOF`（第 232 行）；已用 edit 仅移除新增末尾空行后复跑。Git 另提示本证据文件 LF 将在下次 Git 操作时转换为 CRLF；未修改 Git 配置。此为证据排版检查失败，不是产品测试失败，旧证据未删除（numstat 为仅新增）。

## 7. 2026-10-28 Shell foundation 六任务检查点（T-05b/c/d/m/e/f）

### 7.1 输入、角色与边界

- Implement = **`openai/gpt-6-astra` via openai**；session **`01a18415-9390-7773-9dad-5f1ad7456cd2`**（首次命令只打印 PI_PROVIDER / PI_MODEL / PI_SESSION_ID 与 HEAD，实核）。无模型切换、无其他 agent。
- 工作树 / 分支：`D:/2030/Futures-AI-desktop-implement` / `feat/desktop-shell-astra`；固定输入及结束 HEAD = **`83b91dba7d2d0ef86e65d40e5878f496ed80651f`**。开始时工作树干净；本次不提交、不 push / PR / merge / reset。
- Walter 已明确继续；本轮是既有批准实施，不是新 Plan。完整重读 AGENTS、HANDOFF（最新 §11）、docs 四份权威文档与 D-007、feature spec / Plan4 / Tasks / Checklist / Analyze / Review / 本证据。Checklist 独立计数 **41 checked / 0 unchecked**，未修改。原修订 3 的 shell 任务批准未被修订 4 的 T-04b 局部复查撤销。
- 严格按 **T-05b → T-05c → T-05d → T-05m → T-05e → T-05f** 执行，边界重读对应 Plan/Tasks 段落。到此停止，**未开始 T-05g**，也未提前实现状态机、启动错误页、mock 路由、托盘、活动归约器、日志滚动、诊断、更新或打包。
- `backend/**`、preload、renderer、冻结文档与协调者进度文件未改；未重建 backend，未运行 npm dist。前轮 **454 passed / 5 online skips、12/12 packaged smoke** 仅为历史证据，本 session 未重跑，未重开 PyArrow 修补或剔除已知 PYZ 辅助模块。

### 7.2 六项实际交付（只限本批 AC 子句）

| 任务 | 本批结果与 AC / 夹具边界 |
|---|---|
| T-05b | **完成**。`src/paths.js` / `prefs.js`：默认 LocalAppData 根、缺失不回退、打包覆盖门槛；schema v1 严格校验、tmp + rename、损坏文件不改写、pending 探测后生效/失败保留旧目录、真实 FS 错误映射。覆盖 WO-04、AC-004-3/4 逻辑；不含选择目录 UI / 数据迁移。Electron 精确 33.4.11，新增约定 test:unit 脚本，lock 由 npm 生成 |
| T-05c | **完成**。生产 `bootstrap(app, env)` 设置 userData/sessionData/crashDumps 后才取单实例锁；锁失败不读偏好、不碰数据根。main 首步接线，只有 paths 模块调用 setPath/锁。记录型 Electron 边界 + 真实临时偏好/文件系统；真实 icacls 拒写与恢复。覆盖 AC-004-1 前提、AC-004-3/4、WO-04；错误页留 T-05k |
| T-05d | **完成（基础设施）**。真实 check.js 子进程测试：未知名先 exit 2、不运行任何场景；registry/file 不一致 exit 2；零断言/缺工具/缺夹具均 FAIL；显式期望值、无单参数布尔 API；路径越界在 ctx.launch 启动 Electron 前拒绝；成功/失败清理 temp。无新测试框架，不证明产品 AC |
| T-05m | **完成（协议夹具）**。真实 Python 子进程、端点文件、health 200/503、Bearer shutdown、profile 仅 onboarding 形状、startup_failed/exit 3、stdin EOF、每次实际启动 append registry；slow-ready/hang/exit-before-ready/crash-after-ready 也直接验证。无 data/settings 业务逻辑，不等同真实后端/作业验收 |
| T-05e | **完成（基础设施集成）**。只在精确 hooks=1 分支加载模块；实际 SMOKE 路径先核查，回环 HTTP 控制通道、系统出口记录器、JSON 数组后端替换；标题/日志诚实标记；旧 smoke/ui-smoke/UI_ASSERTIONS 已退役。真实 Electron + fake ok 的 paths/default root/window/backend/spawn/退出清理验证通过。托盘与 activity 快照为 null，tray-click 明报 409/not_implemented；没有伪造后续能力 |
| T-05f | **完成（AC-004-1 自动化子句）**。同隔离目录第二 Electron 10s 内 exit 0，实际 OS PID 已退出；第一实例 secondInstance 恰 1 条，记录生产 restore/show/focus 调用；registry 恰 1 个后端，第一后端 PID/port 不变，第一实例及后端仍活。**真实 Windows 前台聚焦仍为人工 M-09，未宣称通过** |

### 7.3 命令、最终结果与运行时

完整输出留 Git 外：**`C:/Users/iswal/AppData/Local/Temp/fai-foundation-01a18415/`**。没有完整会话、测试数据、日志或 credentials 入库。构建机 **Node v25.2.1 / npm 11.7.0 / Python 3.14.2**；真实 Electron 快照：**Electron 33.4.11 / Node 20.18.3 / Chrome 130.0.6723.191**。单测结果不代替 Electron 运行时证据。

最终源代码编辑之后，cwd `shell` 严格执行：

```bash
npm install --package-lock-only
npm ci
npm run test:unit
npm run check
```

| 验证 | 实际结果 / 外部完整日志 |
|---|---|
| 首次 lock 再生成 + npm ci | exit 0；安装 70 packages；`lock.log` / `ci.log` |
| T-05b 单测 | **12 passed / 0 failed / 0 skipped**；`t05b.log` |
| T-05c 初次 / 修正后单测 | **18 passed / 1 failed** → **19 passed / 0 failed / 0 skipped**；`t05c.log` / `t05c-fixed.log` |
| T-05d 单测 | **28 passed / 0 failed / 0 skipped**；`t05d.log` |
| T-05m 单测 | **34 passed / 0 failed / 0 skipped**；`t05m.log` |
| 单独 `npm run check -- harness-selftest` 最后一次 | **18/18 assertions、exit 0**；`t05e-visible.log`（之前失败见 §7.4） |
| 单独 `npm run check -- single-instance` | **20/20 assertions、exit 0**；`t05f.log`。随后删除一条仅重复读取旧快照的冗余断言，最终该场景为 19 条，不削减任何产品期望；最终两场景联合复跑如下 |
| 最终 lock 再生成 / 真实 npm ci | **exit 0 / exit 0**；npm ci 安装 70 packages，4s；`lock-final.log` / `ci-final.log`。lock 唯一内容差异为根 devDependency `^33.0.0` → `33.4.11`，没有新增依赖 |
| 最终完整 `npm run test:unit` | **34 passed / 0 failed / 0 cancelled / 0 skipped，3325.59ms，exit 0**；`unit-final.log`。约定测试名均实际执行（Node 默认 reporter 显示 ✔）；包括真实 check.js 正负子进程及真实 fake_backend 子进程 |
| 最终默认 `npm run check`（登记表仅本批两场景） | **37/37 assertions / 2 scenes / failures=0 / exit 0** = harness-selftest **18** + single-instance **19**；`e2e-final.log`。两次首实例均生产 request-quit → exit 0；第二实例 exit 0；两场景各恰 1 次后端 spawn |

npm 安装两次都提示 `boolean@3.2.0` deprecated（既有传递依赖）；未升级、未加依赖、未改全局 npm 配置，也不称零警告。安装没有网络/下载失败。

### 7.4 失败历史与修正（不删除、不改验收条件）

1. **T-05c 第一次 18/19**：真实 icacls 拒写期间 `fs.readdirSync(dataRoot)` 本身返回 EPERM；bootstrap 的错误码、路径、无替代目录断言已通过。把空目录核查放到 finally 恢复 ACL 之后，随后再实际写文件证明恢复；未取消拒写、未 mock bootstrap 文件系统。修正后 19/19。
2. **T-05e 初次**（`t05e.log`）启动等待超时：1/3 assertions，通过项仅 temp 删除；失败项为场景超时和被测 Electron 需要定向 taskkill。**诊断复跑**（`t05e-diagnostic.log`）记录 `Electron startup exception: TypeError`，仍 1/3；两次均发生于后端启动前、无 fake registry spawn、无控制通道，定向 taskkill 后确认 owned Electron PID 已死、temp 已删除。
3. TypeError 来自尝试重定义 Electron `Notification` 导出；改为返回 `hooks.outlets.Notification` 的系统出口记录器，不重定义 Electron 模块描述符、不实现通知业务。已有 dialog / shell 出口仍只在 `FAI_TEST_SCENARIO` 下替换。未记录异常 payload、argv 或 token，只保留异常类型。
4. **接着三次窗口可见超时**（`t05e-fixed.log`、`t05e-observe.log`、`t05e-url.log`），每次 **4/5 assertions**。后端 ready、真实窗口存在，实际 file URL 已加载但 visible=false；记录型控制快照而非猜测健康问题。定位为运行器 spawn Electron 使用 `windowsHide:true`，改为 **GUI 进程 windowsHide:false**，不改生产 createWindow/ready-to-show 或 Chromium 安全配置。之后 harness-selftest 18/18。三次失败均经生产 request-quit 正常清理，快照/registry 后端 PID 已死、temp 已删，无泄漏兜底杀后端。
5. 单实例首次真实运行成功；最终源代码只删除冗余旧快照计数断言，并把 runner 越界负测从调用路径校验函数改为**调用真实 ctx.launch 并在 spawn 前拒绝**，随后完整单测与两场景一起重跑，37/37。
6. 静态包装命令第一次把新文件的 `git diff --no-index --check /dev/null <file>` 正常差异退出码 1 当作失败而提前结束。读取日志确认无 whitespace error 后按 no-index 语义继续逐文件核查；不是产品失败，未改源码或忽略空白错误。本节追加后另报第 302 行 `new blank line at EOF`，已用 edit 仅去掉追加末尾空行后复查。Git 提示 LF→CRLF，未改 Git 配置。

### 7.5 清理、冻结 diff 与停止点

- 每个真实 Electron 场景使用全新仓库外 temp，注入 LOCALAPPDATA / FAI_SHELL_STATE_DIR / hooks / scenario；默认不设 FAI_DATA_ROOT。`ctx.launch` 检查隔离变量，首条实际 SMOKE paths 再核查后才执行场景动作。单实例第二进程共享该场景目录，锁失败时 dataRoot 为 null（未读偏好），不假造一个已解析的数据目录。
- 运行器 finally：优先生产 request-quit，等待上限 10s，必要时仅对自己创建的 PID taskkill /T /F；核对快照和 registry 后端 PID，泄漏即使杀掉也判 FAIL；恢复副作用，最多三次移除自己的 temp。两次早期 TypeError 使用定向 Electron taskkill，保留 FAIL；后续失败与最终成功均无残留后端。
- 直接 Python/runner 单测的 owned 子进程在 teardown/finally 关闭并核查 PID；ACL 只改临时测试子目录，已恢复并实写确认。没有 broad taskkill、没有删除无关目录。
- 最终独立 CIM 只读核查本工作树 Electron executable 与本工作树 fake_backend.py 子进程：**`OWNED_FOUNDATION_PROCESSES=0`**。无后台服务或端口需要保留。最终两个 e2e temp `fai-e2e-harness-selftest-zP5oks` / `fai-e2e-single-instance-GfWPwV` 均在 runner finally 中实际删除。
- 静态：`git diff --check` 通过；新文件逐个 no-index --check 无空白错误；`git check-ignore` 对 21 个新源码/测试文件无命中（exit 1）；`git status --short --ignored` 仅本批授权源文件，忽略项只有既存 backend/build、backend/dist 与本轮 node_modules。`rg` 确认 setPath / requestSingleInstanceLock 只在 paths.js，main 的 hooks require 在精确旗标分支内；旧 smoke / ui-smoke / UI_ASSERTIONS 无命中；控制 listen 为 127.0.0.1:0。
- 相对输入 `83b91db`，**backend 与其他只读路径 diff 为空**；没有任何 backend 写入。源码变化为 4 个既有文件（shell/package.json、生成的 package-lock.json、main.js、check.js）+ 21 个新增文件（src 3、unit 5、e2e 3、fake_backend 1、runner fixtures 9）；本证据仅追加本节。完整含新文件 diff 与 SHA-256 清单冻结到上述外部日志目录 `foundation.diff` / `foundation.sha256`，不提交生成物。
- **本批六任务自动化检查点完成；下一项 T-05g，未开始。** 既有正常生命周期足以证明本批 harness/single-instance；其旧重启缺陷、stdin 接线、host.json 迁移仍按 T-05g/h 处理，不假称已修。日志目前仍是早期状态目录单日志（加诚实标记），滚动/脱敏/数据根日志接线留 T-08。
- **未取得**：整体 feature 完成、Converge、独立代码 Review、Gate 2、真实前端/设置页面业务、真实作业引擎/drain/agent、真实 EIA key/注册、发布通道、干净机、基准机 15s、Windows 前台焦点 M-09、系统 toast/托盘及满盘 GUI。fake 只提供协议端点，不以可见窗口或 file 页面加载冒充设置业务成功；本批未执行 settings-sources/csp 正对照，后续若触发 Plan §10 CORS/权限/设计停止规则仍须停报，不自行放宽。
