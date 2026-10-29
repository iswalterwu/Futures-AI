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

## 8. 2026-10-29 Lifecycle + startup 六任务检查点（T-05g/h/i/j/k/l）

### 8.1 固定输入、批准、实施范围

- Implement = **`openai/gpt-6-astra` via openai**；session **`01a185d9-e062-733e-b5af-f1175102c292`**（首次命令仅打印三个 PI 字段与 HEAD，实核）。无模型切换、额外 agent 或配置变更。
- 工作树 / 分支：`D:/2030/Futures-AI-desktop-implement` / `feat/desktop-shell-astra`；开始工作树干净，固定输入及结束 HEAD **`e0fe1cd4eb464fb76971b18f5f6d72ffb2053a80`**。没有 commit / push / PR / merge / reset。
- 本轮依据 AGENTS、HANDOFF 最新 §12、docs 四份权威文档 / D-007、feature spec / Plan4 / Tasks / Checklist / Analyze / Review / 本证据；相关读取见会话记录。独立计数 Checklist **41 checked / 0 unchecked**；未修改。未变 shell 任务沿用修订 3 批准，修订 4 只局部修 T-04b；本轮无新需求或 Plan 作者角色。
- 严格按 **g → h → i → j → k → l** 实施并在边界重读对应任务/流程。停在本检查点，**未开始 T-06b/c/d、T-07 或日志/诊断/更新/构建任务**。backend 全部只读；未重建、未剔除已知 PYZ helpers、未运行 npm dist、未改依赖。
- 代码范围：8 个既有 shell 文件定点修改 + 17 个新文件；本证据只追加。既有 `check.js`、`prefs.js`、fake_backend.py、旧 unit、onboarding.js、package/lock、冻结文档与其他工作树未改。两个基础场景只把“窗口可见”等待补为“窗口可见且实际 ready”，保留全部原断言（仍 18 / 19）。

### 8.2 六任务实际交付与证据边界

| 任务 | 本批状态 / AC 与真实边界 |
|---|---|
| T-05g | **完成**。生产 `src/backend.js` 与直接 Node 单测共用同一状态机；仅 spawn / HTTP 边界注入。8 个约定测试名全部通过：三条件 ready、503 不就绪、3 次预算且 ready 不清零、retry 清零、旧代事件忽略、超时先 kill、标记 + exit3 不重启、ENOENT。覆盖 AC-002-2/3、AC-007-2 的模块子句 |
| T-05h | **完成**。main 使用该生产模块；代际各有 child / token / portFile / deadline；host.json 在 stateDir/run，spawn 前及 stop 后删除；三条 pipe + EOF flag。真实 `python -m app` 就绪、锁/只读端点存在，requestQuit 后均删除、端口可重新绑定；health-fail 夹具从未 ready，超时后 owned PID 已死。覆盖 AC-003-1、AC-002-2 |
| T-05i | **完成（本批生命周期子句）**。真实 host 被定向 taskkill 后 gen2、restarts1、新端口/令牌与 preload 当前端点一致。crash-after-ready:300 夹具恰 4 spawns、4 次 ready、观察存活峰值恰 1，最后 restart_limit。仅杀 Electron（明确无 /T）后真实后端 ≤5s、退出码0、自行删除锁/只读端点并释放端口，同目录再次 ready；未手删运行态文件。AC-002-3 的诊断导出与通知/托盘仍属后续任务 |
| T-05j | **完成**。启动本地页先 visible 再启动后端；sandbox/contextIsolation/nodeIntegration 安全值不变。窄 preload 仅 mode/getBackend/onShellStatus（可 unsubscribe）/retryStartup/openLogs；未就绪 null、失败不转 mock；真实 retry gen+1、无进程重叠。记录 shown/ready/interactive 时序；不是基准机15s认证。覆盖 AC-001-2/002-1 的可见性子句、AC-007-2/WO-12 与失败页面 |
| T-05k | **实现及最后复跑通过（启动期）；保留一次未解释的联合运行超时风险，见下文**。14 个批准错误码中文映射，动态文本用 textContent。真实 Service 辅助进程持锁 → data_root_locked、不重启；释放辅助进程后点击重试真实 ready。新建 temp 子目录 icacls 拒写 → 路径/权限不足、不改根、不 spawn；finally 恢复 ACL 并实写验证，点击重试真实 ready。disk_full 仅协议夹具标记，应用存活；不冒充真实满盘。覆盖 AC-004-2/3、AC-007-4 启动期 |
| T-05l | **完成（本批目标选择）**。开发显式 frontend、打包 app-config bundled/builtin 区分；缺失不静默 builtin。真实 Electron 显式 --mock 与 FAI_MODE=mock 都不 spawn（snapshot/registry/OS 查询），stub 显示 mode、内置 mock 横幅说明业务不可用。真实 host + 缺失 frontend → 错误页；仅补齐该 temp 夹具后点重试成功、后端代际不变。缺失 exe → backend_missing、不重启、不转 mock。打包路径解析用真实函数+临时配置夹具，不是打包产物验收。覆盖 AC-002-4 / AC-007-3 |

### 8.3 实际命令、失败历史与最终结果

全部日志留 Git 外：**`C:/Users/iswal/AppData/Local/Temp/fai-lifecycle-01a185d9/`**。命令 cwd = `shell`，均用 bash `time` 保存输出/墙钟；未开启在线/live 标志或访问真实 EIA/key/userdata。

| 顺序 / 命令 | 实际结果（exit 0，除明确失败行） | 日志 / 墙钟 |
|---|---|---|
| 新基线 `npm ci` | 70 packages，成功；既有 boolean@3.2.0 deprecated 提示，未升级 | baseline-ci.log / 11.501s |
| 新基线 `npm run test:unit` | 34 passed / 0 failed / 0 skipped，3093.37ms | baseline-unit.log / 3.664s |
| 新基线默认 `npm run check` | 2 场景、37/37 断言、0 failures | baseline-e2e.log / 6.902s |
| T-05g `npm run test:unit` | 42 passed / 0 failed / 0 skipped，4997.72ms | t05g-unit.log / 5.545s |
| `npm run check -- ready-quit` | 15/15 | t05h-ready.log / 7.427s |
| `npm run check -- health-fail` | 8/8（补页面断言前） | t05h-health.log / 4.521s |
| `npm run check -- crash-restart restart-limit` | 28/28（补页面/preload断言前） | t05i-restart.log / 14.589s |
| `npm run check -- kill-shell-recover` 初次 | **13/15，exit1**：后端死、端口释放、重启成功，但锁/只读端点残留 | t05i-recover.log / 6.686s |
| 同命令增加 OS 退出码观测后 | **15/17，exit1**：退出码0仍残留两文件；观测 helper 已退出 | t05i-recover-diagnostic.log / 9.620s |
| 同命令 Windows spawn 修正后 | **17/17** | t05i-recover-console.log / 7.269s |
| `npm run check -- startup-visible` | 13/13 | t05j-visible.log / 4.837s |
| `npm run check -- timeout` | 14/14（含 unsubscribe、实际日志出口与 retry） | t05j-timeout.log / 8.177s |
| `npm run check -- restart-limit health-fail` | 26/26（页面断言已补） | t05j-errors.log / 12.579s |
| `npm run check -- root-locked` 初次 | **2/3，exit1**：测试试图整读被真实字节锁保护的 .lock，EBUSY；发生在 Electron 启动前，helper 已优雅清理 | t05k-locked.log / 2.734s |
| 同命令修正后 | **16/16** | t05k-locked-fixed.log / 7.188s |
| `npm run check -- root-unwritable` | 12/12 | t05k-unwritable.log / 4.969s |
| `npm run check -- startup-disk-full` | 10/10 | t05k-full.log / 1.808s |
| `npm run check -- mock` | 17/17 | t05l-mock.log / 3.197s |
| `npm run check -- frontend-missing` | 19/19 | t05l-missing.log / 5.107s |
| 首轮联合前完整 `npm run test:unit` | 42 passed / 0 failed / 0 cancelled / 0 skipped，5073.31ms | unit-final.log / 5.681s |
| 首轮默认 `npm run check`（所有登记场景联合） | 14 场景、212/212 断言、0 failures，exit0 | e2e-final.log / 70.398s |
| 补 app-config null 形状校验后 `npm run test:unit` | 42 passed / 0 failed / 0 skipped，4975.46ms | unit-final-2.log / 5.528s |
| 同源码默认 `npm run check` | **14场景、202/203、1 failure，exit1**：root-locked 等待 failed 的10s条件超时；其余场景通过 | e2e-final-2.log / 100.950s |
| 同源码 `npm run check -- root-locked` 核查 | 16/16；未改超时/断言，不能以此抹掉前次失败 | t05k-locked-recheck.log / 9.443s |
| **最后源码编辑后，最终完整 `npm run test:unit`** | **42 passed / 0 failed / 0 cancelled / 0 skipped，4988.49ms** | unit-final-3.log / 5.541s |
| **最后源码编辑后，最终默认 `npm run check`（所有登记场景联合）** | **14 场景、213/213 断言、0 failures，exit0** | e2e-final-3.log / 67.092s |

失败的最小处置（不改验收条件）：

1. 真实仅杀外壳两次均出现“后端 exit0 但锁/端点残留”，不能把同目录重启成功当 EOF 优雅退出通过。Windows spawn 增加 `detached: process.platform === 'win32'`，分离 Windows 控制台生命周期；**没有 unref**，仍由同一状态机跟踪/等待退出、stdin pipe EOF 守护、必要时 owned taskkill /T。该一项 spawn 边界修正后，锁/端点自行删除与端口释放、再次就绪全部通过；最终全集再通过。无 Job Object/PID watchdog/新依赖/后端改动，未声称仅凭退出码即可证明优雅退出。
2. root-locked 的试验性“读整个锁文件/PID 显示”假设不成立：真实字节锁可拒绝整读，而宿主协议只承诺 PID 读得到时才附加。移除这项非必需整读，改为真实 Service.init 成功信号 + 锁存在 + helper 存活，并保留全部必需的错误码/目录/零重启/持锁者未被误杀/释放后真实 retry 断言。未 mock 锁、未放宽必需断言、未手删锁。该失败和重跑都保留。
3. 首轮全集通过后，检查发现合法 JSON `null` 的 app-config 会在读取 `.frontend` 时抛 TypeError；在批准的配置入口改为可选链形状检查，统一返回 frontend_missing（重试重新解析），并在 mock 场景调用真实解析器验证；未扩展资源机制。mock 因而由17增至18条，总数213。
4. 随后的完整运行 **root-locked 10s等待失败**：清理前真实快照为 gen1 / waiting_health / port=null，未收到预期失败状态。runner 已退出后端、辅助进程并删除临时目录。只读核查后端代码与日志，现有证据不能区分启动迟滞还是其他原因，**未确认根因、没有宣称修复**。不改源码/超时/断言的单场景16/16与最后完整213/213均通过；这是保留的间歇性风险，交协调者/独立审核，不以绿灯删除FAIL历史。
5. 共四次失败运行均已列出；没有 skip、静默吞测试失败、模型回退或变更需求。证据追加后 `git diff --check` 另报第387行 new blank line at EOF，定点去掉新增尾部空行后复查；这是文档空白检查失败，不是产品测试失败。Git 的 LF→CRLF 提示不当作测试失败，未修改 Git 配置。

最终全部场景断言数（含 runner 清理断言）：

| 场景 | 通过/总数 | 场景 | 通过/总数 |
|---|---|---|---|
| harness-selftest | 18/18 | single-instance | 19/19 |
| ready-quit | 15/15 | health-fail | 10/10 |
| crash-restart | 16/16 | restart-limit | 16/16 |
| kill-shell-recover | 17/17 | startup-visible | 13/13 |
| timeout | 14/14 | root-locked | 16/16 |
| root-unwritable | 12/12 | startup-disk-full | 10/10 |
| mock | 18/18 | frontend-missing | 19/19 |

构建机 **Node v25.2.1 / npm11.7.0 / Python3.14.2**；真实 Electron 快照 **Electron33.4.11 / 内嵌 Node20.18.3 / Chrome130.0.6723.191**。旧 backend **454/5 skips 与12/12** 本轮未重跑，仅为历史；本轮真实 backend 证据来自 Electron 场景中的源码宿主，不是打包 exe。

### 8.4 清理、冻结、剩余缺口与下一项

- 未修改 runner 的隔离/清理规则。每场景新外部 temp LOCALAPPDATA/state/data；真实宿主场景没有 FAI_BACKEND_CMD。主动退出与最终清理走生产 requestQuit；仅 kill-shell-recover 故意 app-only taskkill，随后等待/核查 EOF，重启实例正常 requestQuit。快照/registry/helper PIDs 均核查已死，所有14场景 temp实际删除；ACL 已恢复且实写成功。失败运行同样清理；无以兜底杀进程当成功。
- 最终只读 CIM 定向核查本工作树 Electron、fake_backend.py 与本批真实 host/helper 命令根：**OWNED_LIFECYCLE_PROCESSES=0**。无服务/端口保留；未 broad taskkill、未访问/删除真实用户数据。
- 输入188个 tracked文件 SHA-256 留 `input.sha256`；源码结束后 checksum 仅8个授权既有shell文件改变，其余180个逐字节一致（含 backend、package/lock、旧测试、规格/Checklist等；本证据追加之后多1个合法差异）。冻结 diff 相对 e0fe1cd 为空；17个新文件均不被忽略；新文件 no-index whitespace检查与 `git diff --check` 通过。忽略产物仅既存 backend/build、backend/dist 与 npm生成的node_modules。本证据保留§1～§7，只有追加。
- 完整日志/session/临时测试库不入Git；代码与证据未提交。最终diff与SHA清单留上述外部目录供协调者核对。
- **六任务实现已到检查点、最后完整复跑通过，但保留 root-locked 一次未解释超时风险；不宣称稳定性问题已关闭。下一项 T-06b，本 session 不继续。** preload 已采用异步新契约，旧 onboarding.js 的同步 `backend()` 消费者刻意留给 T-06b；本批只证明页面加载/启动生命周期，**不声称现有设置业务可用**，未提前实现 T-06c 的 profile/onboarding 路由或设置入口。
- 后续仍未验证：14错误码的每个真实GUI触发（本批只实际触发上述场景）、startup.html本身缺失的原生兜底、真实renderer崩溃恢复、打包后的app-config资源装配、日志滚动/脱敏/诊断导出、真实前端与作业/agent/drain、真实EIA注册/key、clean install、基准机15s、全部人工M-ID（含M-09焦点/M-16观感/M-18真实满盘）、toast/托盘、整体Converge、独立代码Review及Gate2。既有PYZ P3不变；settings-sources/csp/CORS正对照留后续，若需要改安全面则停报，不自行放宽。

## 9. 2026-10-29 T-05k root-locked 有界诊断（风险仍 OPEN）

### 9.1 固定输入、范围与预检

- Implement/debug = **`openai/gpt-6-astra` via openai**；session **`01a18620-5f99-7422-91f6-e006cb8c47a3`**，PI 环境实核（只输出三个指定 PI 字段）。唯一 writer，未开其他 agent、未切模型/通道或修改配置。
- 工作树 / 分支：`D:/2030/Futures-AI-desktop-implement` / `feat/desktop-shell-astra`；固定输入及结束 HEAD **`35e5f7869b9d80bcf49a37ab21336072ed611ffc`**；开始 `git status --short` 为空。`git diff --exit-code 40aff0c HEAD -- shell backend specs/desktop-shell docs` 为空。既有源码检查点 f7d347b 已在输入中，不是未提交旧 WIP。
- 完整重读 AGENTS、HANDOFF（含最新 §13）、docs/plan/architecture、feature spec/plan/tasks/checklist/analyze/review/本证据；截断处用 offset 补读。没有改 UI，未触及 interaction/designUI 的设计范围。重读真实 scene、runner waitFor/launch/cleanup、Backend/main/hooks、Python Host/Service/write_lock；边界再次读取 T-05k、Plan §4.2、实际待改文件。Checklist 独立计数 **41 checked / 0 unchecked**，只读。
- 历史失败原件仍存在：`%TEMP%/fai-lifecycle-01a185d9/e2e-final-2.log`；与 Git 中 `handoff-artifacts/20261029-lifecycle/e2e-intermittent-failure.txt` 的 SHA-256 均为 **`5f0bc33d580a31a2e0605098ce8b2063fb6064093204f7cd26e5b7a1e5d071a1`**。历史 **202/203、1 failure** 原样保留；此前单独16/16与最后213/213不是修复证明。
- 宣告上限为最多4次定向诊断 + 1次全集诊断，另做要求的最终验证；实际只用 **2次定向（其中1次 profiling）+ 1次全集诊断**。未复现即停止增加诊断次数，不循环跑到绿灯。

### 9.2 观测方法与真实结果

全部新原始输出与验证产物留在仓库外 **`C:/Users/iswal/AppData/Local/Temp/fai-lockprobe-01a18620/`**（下称 RUN）；没有凭证、argv、请求/响应体、完整 child dump 或用户文档入日志。

- 真实 root-locked 仍使用原 Python `Service.init()` 持锁 helper、真实 `python -m app`；没有 `FAI_BACKEND_CMD`、没有业务 mock、没有整读字节锁文件、没有为通过而删锁或杀 holder。
- 临时 `src/test-hooks.js` 仅在 root-locked 下观测真实 spawn 系统边界：spawn返回/事件、stdout首次到达、**生产解析器已设置的 marker code**、exit/close、status。没有复制生产标记解析逻辑或改变命令、状态、deadline。时间来自 `process.hrtime.bigint()`；producer时钟起点为首次 command，scene另记接收时刻，二者不冒充同一原点。`marker-parsed` 由 setImmediate 读实际结果，是观测上界，不是精确 Python print 时刻。
- profiling 仅通过该条命令的 `PYTHONPROFILEIMPORTTIME=1` 启用；临时 observer 只放行 `import time: <整数> | <整数> | <模块名>`，不转发其他 stderr。该环境也被 helper继承；没有修改 Python 源码或全局环境。**profiling和转发有额外开销，不能作为不变生产启动性能验收**；模块 cumulative时间有嵌套，不能相加。
- 临时诊断源码差异保存在 RUN/`diagnostic.diff`，已在最终源码验证前全部移除（hooks恢复输入字节）。最终只保留 scene 的安全观察时间线，见 §9.3。

诊断阶段首代测量（单位 ms；小数取整；spawn列以实际 Node spawn事件为零点）：

| 运行 | helper ready（scene起点） | paths / control接收（scene起点） | spawn→stdout首次 / marker已解析 | spawn→exit3 / failed状态 | failed快照 / renderer code（scene起点） |
|---|---:|---:|---:|---:|---:|
| 定向普通 diag-1 | 1130 | 1347 / 1397 | 1801 / 1810 | 2110 / 2111 | 3842 / 3844 |
| 定向 profiling diag-2 | 1160 | 1370 / 1416 | 1767 / 1767 | 2063 / 2064 | 3798 / 3805 |
| 全集 diag-full 中 root-locked | 1255 | 1491 / 1546 | 2152 / 2152 | 2421 / 2421 | 4339 / 4347 |

三次均实际收到/解析 `data_root_locked`、exit3 后才 failed；页面同码/含路径/另一进程提示、restarts0、失败PID清空、holder仍活、holder优雅exit0后retry gen2/restarts0/ready、全部 owned PID退出与temp删除均通过。普通定向 marker解析到exit约300ms，全集约268ms；未观测到多秒的marker运输/退出延迟。

profiling 首代：`uvicorn` cumulative **214866µs**，`fastapi` **285820µs**，`data.service` **610265µs**（其中 pandas **486392µs**），`app.main` **1465718µs**；app.main导入完成的接收时刻3490ms，stdout首次3500ms，failed快照3798ms。只证明这一受测运行导入占启动时间主要部分，**不证明历史失败由 imports 导致**，也没有测到有效真实分类超过10s。

**对历史现场的判断**：

1. runner 的默认 `waitFor` 是10s；main/Backend 默认 producer deadline 是30s，Plan §4.2约定按本代deadline处理、kill后报health_timeout。两者不同且起点也不同：scene在paths/control就绪后开始等待，而main要等启动窗口显示后才spawn（本轮初始快照仍能看到idle）。这是可检验的预算假设，不是历史因果证明。
2. `Service.__init__` 在开库之前调用 `write_lock`，已有且被持有的根会抛 `LockBusy`；没有名义上的10s锁获取等待。不能把未取得的import/调度/输出管道时序说成锁等待。
3. 历史只有10s拒绝与清理前 gen1/waiting_health/port=null/PID存活，没有该PID的import进度、标记到达或退出时序；本轮没有复现。**根因 UNKNOWN，风险 OPEN**。未发现足以修改 main/backend 生命周期或接线的实证，也没有足以调整本场景观察预算的>10s有效启动证据。
4. 本轮没有做“真实宿主受控慢启动>10s”或“丢失/错误marker”的新边界注入对照，因而**没有根因/修复的正负对照闭环**。全集中的既有 health-fail/timeout/restart-limit 及unit中的三条件健康/exit3标记对照均通过，但它们不能替代上述历史故障对照；不靠grep或通过次数宣布修复。

### 9.3 最终最小差异（不是行为修复）

- **`shell/test/e2e/root-locked.js`**：仅 +24/−2 行诊断接线。scene局部复用的trace以单调时钟输出helper启动/ready/exit、Electron启动/paths-control就绪、**变化时才输出**的快照白名单（phase/gen/restarts/pid/port/lastCode/OS alive）、renderer code、释放holder、retry-ready与Electron退出。等待拒绝时记最后观测与holder存活，**原错误重新抛出**。不输出完整snapshot、页面文本、path/令牌/argv或child字节流；不新增后台计时器、通用工具、持久遥测。
- 原10s等待、外层scene30s、retry20s、producer30s和所有原断言/清理均未改；无新增弱化布尔断言。每次独立 root-locked仍 **16/16**（含清理）；最后全集仍 **213/213**，断言数量未被削减。
- **本文件**只追加§9；历史§1～§8保持原文。`test-hooks.js` 的临时wrapper/观测字段/import处理已恢复，SHA-256与输入一致；`main.js`、`src/backend.js`、backend/**、其他scene/runner/unit、renderer/preload、依赖/lock及所有冻结文件均未改。没有产品修复，所以没有新增backend regression用例。

### 9.4 全部本轮命令与结果（失败不隐藏）

以下cwd均为shell，输出用 `{ time <命令>; } > RUN/<文件> 2>&1` 保存，随后实录退出码；profiling变量只作用于那一个命令。

| 顺序 | 命令 | 结果 | 日志 / 墙钟 |
|---|---|---|---|
| 诊断1 | `npm run check -- root-locked` | 16/16、exit0 | diag-1.log / 7.499s |
| 诊断2（额外开销） | `PYTHONPROFILEIMPORTTIME=1 npm run check -- root-locked` | 16/16、exit0 | diag-2-profile.log / 7.477s |
| 唯一全集诊断 | `npm run check` | 14场景、213/213、exit0 | diag-full.log / 65.401s |
| **最后源码编辑后** | `npm run test:unit` | **42 passed / 0 failed / 0 skipped / 0 cancelled，4974.143ms，exit0** | unit-final.log / 5.522s |
| **最后源码编辑后** | `npm run check -- root-locked` | **16/16、exit0** | root-locked-final.log / 7.686s |
| **最后源码编辑后** | 默认 `npm run check` | **14注册场景、213/213、failures0、exit0** | e2e-final.log / 67.203s |

- 本轮没有新增真实测试FAIL、没有重跑失败直到通过；历史202/203、1failure仍未解释。hash校验相对输入返回1是预期的授权文件变更：追加本证据之前仅root-locked不匹配，其余212/213相同；最终只有scene与本证据两个差异。`rg`未勾选项无匹配exit1=0项；不是忽略测试红灯。Git的LF→CRLF提示保留，未改配置。
- 最后独立scene：helper-ready1309ms、paths/control-ready1635ms、waiting_health观察1902ms、failed4024ms、页面4026ms、retry-ready6270ms。最后全集scene：helper-ready1802ms、paths/control-ready2058ms、waiting_health2414ms、failed4403ms、页面4404ms、retry-ready6643ms。均是**观察时刻**，未用快照倒推出真实spawn/import时刻；最后全集有一次OS已死但Node状态仍waiting_health的短暂快照，随后62ms内观测failed，不能据此声称生命周期bug。
- 构建机实核 **Node v25.2.1 / npm11.7.0 / Python3.14.2**；真实Electron快照 **33.4.11 / 内嵌Node20.18.3 / Chrome130.0.6723.191**。未安装或改依赖、未重跑npm ci、未构建backend或运行Python全量；旧 **454/5 online skips、12/12**只为历史证据。不把本轮source-host测试写成打包或15s基准验收。

### 9.5 清理、冻结与后续

- 所有运行均使用runner新建的独立外部root；helper由实际Service成功信号确认，不读整份锁。退出走生产request-quit；runner的≤10s/owned树kill兜底与泄漏即FAIL规则未动。本轮root-locked无兜底kill，holder在断言后才结束stdin并正常退出；没有删锁求绿。
- 两次全集内root-unwritable均恢复自有ACL，并通过真实`restored-write-proof`写入/读取断言；14场景均实际删除temp、所有跟踪backend/helper PID均死。最后CIM定向检查本工作树Electron及本次e2e/machine根Python/fixture，**OWNED_LOCKPROBE_PROCESSES=0**，不打印命令行；无后台服务/控制端口需保留。外部日志/manifest保留，未删除旧失败证据或其他任务文件。
- 213个输入tracked文件指纹在 RUN/`input.sha256`；最终比对 **211个未改，2个授权差异**（scene、本证据）。`git diff --exit-code 35e5f78 -- . ':!shell/test/e2e/root-locked.js' ':!specs/desktop-shell/implementation-evidence.md'`为空；`git diff --check`通过；本证据numstat仅新增、零删除。完整诊断diff、最终diff与最终SHA清单留RUN供协调者核对。冻结spec/Plan/Tasks/Checklist/Analyze/Review/HANDOFF/README、backend与依赖均未动；HEAD未移动。未commit/push/PR/merge/reset。
- **结论：只完成本轮有界诊断及安全观测补充，不是T-05k稳定性关闭，更不是Converge/代码Review/Gate2。T-06b未开始。** 不能用本轮绿灯给风险评级或代替用户接受。
- 下一步仍限定T-05k：协调者先保留本证据和历史FAIL；若继续诊断，可用已保存的最小临时observer做一次受控真实宿主启动迟滞（10s以上、30s以内）与缺失/错误marker或deadline超时的负对照，证明或否定“本场景观察预算不足”，再决定是否只调整该scene；同时仍需自然失败的producer/import/exit记录才能解释历史因果。不得仅用受控sleep或绿灯反推历史原因。需要触及后端/安全面/冻结设计时继续停报；不直接推进T-06b。

## 10. 2026-10-29 T-06b 设置页检查点（T-06c/d 因权限边界暂停）

### 10.1 输入、批准与实际范围

- Implement = **`openai/gpt-6-astra` via openai**；session **`01a18698-0ad0-7456-8578-dd4892e22bd5`**，PI 环境实核，仅打印指定三个 PI 字段。唯一 writer，未开其他 agent、未切模型、未改配置。
- 工作树 / 分支：`D:/2030/Futures-AI-desktop-implement` / `feat/desktop-shell-astra`；固定输入与结束 HEAD **`c33fa9dad1a7a9ba548f1979a986a0a29cf18606`**。起始 `git status --short` 为空。未 commit / push / PR / merge / reset。
- 按请求完整读取 AGENTS、HANDOFF（含最新§14）、docs 四份权威文档与 D-007、feature spec/Plan/Tasks/Checklist/Analyze/Review/实施证据/root-lock-risk-review v2、settings spec/plan 与真实 profile/onboarding/sources/宿主路由、main/preload/renderer/runner/hooks/相关场景；截断均以 offset 续读。T-06b 实施及准备进入 T-06c 时重读对应 Plan/Tasks。
- Checklist **41 checked / 0 unchecked**，未修改。最初 `rg -o '\[x\]'` 对全部文本计数得到43/2（误包含文内计数示例）；随后按实际 `^- \[x\]` / `^- \[ \]` 条目重新核对41/0，不将字面量计数当作闸门。
- 按 Walter 继续及独立 A v2 的 nonblocking 判定开始既定 T-06b；**RL-01 仍 P3 OPEN / UNKNOWN**，原202/203失败、原断言/10s观察窗/30s生产deadline/历史记录均未改。RL-02受控正负对照仍欠，须整体Converge/Review前另行派工；RL-03/04/05与PYZ残余不顺手处理。本次基线及最终全集未复现root-lock，不能称根因已修或用户接受。

### 10.2 任务状态与真实结果边界

| 任务 | 实际状态 / AC |
|---|---|
| **T-06b** | **本任务自动化子句通过**。每次 API 操作异步取当前 `getBackend()`，无静态 `backend()` 别名；null/mock 明示。后端/用户字符串用 textContent/createElement/replaceChildren，renderer 无 innerHTML。表单保存时邮箱等于加载的遮蔽值则不提交，改变（含空串清除）才提交，成功后用遮蔽响应回填。保留 password key 输入与成功清空，不回显。真实来源表显示路径/状态/验证与取数记录/原因，并明确不是本次上游成功；空凭证也能清除并提示回退。覆盖 AC-005-3 的状态/清除、AC-005-4 的输入遮蔽/邮箱不覆盖、AC-009-2 的内置DOM子句；不代表整个AC或源开通完成 |
| **T-06c** | **未实施 / 权限阻塞**。准备接线前发现旧只读场景与批准的新接口/路由直接冲突（§10.4），未修改main/preload/旧场景/hooks/fixture。AC-005-1/2、WO-01/05没有本轮新增通过结论 |
| **T-06d** | **未开始**（依赖T-06c）。旧 renderPrefill 本轮仅消除HTML拼接，仍是旧的四项遮蔽展示；固定注册URL、缺项仍可打开注册、location.reload 仍待后续任务纠偏。没有调用或验证 registration-guide，没有声称核心五项指引、显式点击/离开清空、应用菜单测试已通过 |

真实核心夹具：`settings-sources` 启动前用 `settings.onboarding.set_onboard_state` 写自有根目录完成状态，不复制schema；`ui-masking` 用 `settings.profile.Profile/save` 加密保存随机合成邮箱，退出后用真实 `load` 校验姓名确改、邮箱不变，并检查密文中无完整邮箱字节。测试只输出布尔判定和退出码，不打印字段/请求体/响应体/令牌/argv。名字含HTML样式文本，保存后没有插入对应DOM元素。所有邮箱均 `example.test` 合成数据；未读取真实凭证、未保存/提交/验证任何EIA key，清除仅作用于自有空凭证库，无上游/注册网络请求。

**CORS实证**：源宿主无 `FAI_BACKEND_CMD`，真正的 `file://…/onboarding.html`，通过当前异步端口/令牌执行页面自身 fetch。`/settings/profile` 与 `/settings/sectors` 成功，**后端11项 + placeholder1 = DOM12项**；真实 `/settings/sources` 渲染eia「免凭证回退」，DELETE空key与姓名PUT也成功。**本受测 Electron33.4.11 没有触发 Plan§10 CORS STOP**；这不证明别的浏览器/打包环境CORS政策，也不宣称OPTIONS已被允许。场景失败分支保留Node同端点GET、OPTIONS状态/允许头与renderer错误类型的安全诊断，但本次该分支**未执行**，没有OPTIONS观测数据。未加入CORS中间件、proxy、header改写、security开关、mock API或回退。

### 10.3 全部命令、失败与最终复验

日志目录（Git外）：**`C:/Users/iswal/AppData/Local/Temp/fai-settings-01a18698/`**。以下cwd= shell，均用 `{ time <命令>; } > <日志> 2>&1` 保存并实录退出码：

| 顺序 | 命令 | 结果 | 日志 / 墙钟 |
|---|---|---|---|
| 新基线 | `npm ci` | exit0，70 packages；既有boolean@3.2.0 deprecated提示 | baseline-ci.log / **13.430s** |
| 新基线 | `npm run test:unit` | **42 passed / 0 failed / 0 skipped，4967.7373ms，exit0** | baseline-unit.log / **5.539s** |
| 新基线 | `npm run check` | 原14场景 **213/213，failures0，exit0** | baseline-e2e.log / **71.091s** |
| 早期真实正对照（只迁移异步API后） | `npm run check -- settings-sources` | **8/10，failures2，exit1**；DOM12项与eia回退已通过，失败为旧UI在空key时隐藏清除按钮，随后场景明确中断；非CORS错误 | t06b-settings-sources.log / **5.766s** |
| T-06b修正后 | `npm run check -- settings-sources ui-masking` | **23/23，2场景，exit0** | t06b-final.log / **11.467s** |
| **最后源码编辑后** | `npm run test:unit` | **42 passed / 0 failed / 0 cancelled / 0 skipped，4968.2733ms，exit0** | unit-final.log / **5.502s** |
| **最后源码编辑后** | 默认 `npm run check` | **236/236，16场景，failures0，exit0**（原14场景213 + 新settings-sources11 + ui-masking12） | e2e-final.log / **72.960s** |

唯一产品失败为上述一次清除按钮不可见；修正是让无key的真实清除入口可用并说明回退，未改断言、运行器、隔离或清理规则。不是重跑直到绿；T-06c的旧场景冲突属于静态发现、尚未执行的新功能失败，不伪造红灯结果。hash检查exit1仅为三个授权既有源码差异（证据追加前），`check-ignore`无命中exit1、新文件`diff --no-index --check`正常差异exit1不是产品失败；Git LF→CRLF提示未通过配置消除。

真实runtime：**Electron33.4.11 / Node20.18.3 / Chrome130.0.6723.191**。本轮未跑后端全量、打包冒烟或重建；旧454/5与12/12仅历史。未执行19场景，不把未创建的 onboarding/onboarding-skip/registration-guide算通过；完整507 GUI自动化仍是既有P3缺口，仅API错误显示现在可使用message字段。

### 10.4 后续停止理由：测试兼容所有权 / 菜单驱动范围

本请求明确冻结旧生命周期/其他scene，只允许极小frontend-stub/test-hook兼容，并要求权限或控制命令不足时报告。T-06b后重读发现：

1. `shell/test/e2e/startup-visible.js:18` 对 `Object.keys(window.futuresai).sort()` **严格等于旧五项**。T-06c批准契约必须增加 `openSettings()`，该旧断言将失败；不通过隐藏API枚举或按测试场景裁剪产品bridge骗过它。
2. `shell/test/e2e/frontend-missing.js:10,33–35` 用全新、未完成引导的真实根，要求先显示外部资源缺失，再在补齐资源后直接进frontend fixture。Plan§4.1第6步要求未完成引导先进入内置向导；需授权把此旧资源场景的前提改为经真实settings核心完成引导，**保留**缺失/重载/后端代际/端点/清理断言。不为了它改变生产路由优先级，也不在hooks伪造业务状态。
3. `src/test-hooks.js` 固定命令无应用菜单click（只有尚未实现的tray-click），eval只能在隔离renderer中运行。`openSettings()`调用不能当“菜单设置…”通过；没有默默新增menu-click或把tray-click改称应用菜单。需协调明确真实菜单handler的受控驱动方式/授权范围（或既定人工路径，但不能因此改自动化验收条件）。

**停止点：保留T-06b已验证WIP，不实施T-06c/d，更不进入T-07a。** 下一步需要协调者批准上述两个旧scene的最小兼容写入范围，并明确应用菜单测试驱动；若涉及新增控制命令/设计，则依请求先走相应Plan/Analyze与A复查，不在本轮自授权限。这里不是CORS或模型不可用，不申请任何后端/Chromium安全放宽。

### 10.5 冻结、源码指纹、清理与剩余边界

- 只改3个既有源码（onboarding.html/js、e2e/index.js）+ 新2个scene + 本证据§10追加。main/preload/backend/**、依赖/package/lock、旧14scene/unit/runner/hooks/fixture、frozen spec/Plan/Tasks/Checklist/Analyze/Review/README/HANDOFF/.gitignore及其他工作树未改。
- 输入清单 `input.sha256` 共209个tracked文件；证据追加前206个字节相同，3个授权源码变化；追加后实核205个未改、4个授权差异（另增本证据）。`git diff --exit-code c33fa9d -- . ':!shell/renderer/onboarding.html' ':!shell/renderer/onboarding.js' ':!shell/test/e2e/index.js' ':!specs/desktop-shell/implementation-evidence.md'`为空；新scene不被忽略；已跟踪及两个新文件whitespace检查通过。忽略项只有既有backend/build、backend/dist与npm安装生成的node_modules。
- 每场景自有外部root；失败及成功均由原runner优先production request-quit退出。新scene没有兜底kill/泄漏；快照记录的backend PID已死，所有scene temp已删；两次全集真实ACL恢复并实写通过，holder/helper均退出。最终CIM定向检查本工作树Electron、测试root Python/fake_backend，仅输出PID/Name与计数，**OWNED_SETTINGS_PROCESSES=0**；没有后台服务/控制端口保留，没有broad kill或用户数据清理。外部测试日志/指纹作为证据保留，不入Git。
- 源码SHA-256清单（`code.sha256`，最后源码上）：

```text
013667f40561fd356c24906c8a52805d8a20cb37b634ca8c78b6f4e89e031f59  shell/renderer/onboarding.html
6a7ce9cbbbc18babcf15632f3083336b3fd42cffe91adcfaee072867d9ddce3e  shell/renderer/onboarding.js
3b5fec5546c5989cef7ce3655201cee7995f586abff8a0a48d367d10fc53c6cc  shell/test/e2e/index.js
167c802ac8f9b5dda955f9a6744ec52a36e4d7367beafbc415bda016f08dc253  shell/test/e2e/settings-sources.js
71560b3084aa61aec7c41ac3244baac5e48efa84a55f3933e6807928ee5656c2  shell/test/e2e/ui-masking.js
```

- 追加证据后空白检查曾报第523行 new blank line at EOF；已定点移除新增尾部空行后复查，保留此文档检查失败记录。源码未再编辑，最后测试与五个源码SHA仍对应当前源码。
- **无整体feature完成 / Converge / 独立代码Review / Gate2 / 用户风险接受结论**。RL-01及所有条件保持；人工M-13/14/15、真实前端/作业/agent/drain、真实key/注册、日志诊断隐私、clean install、基准机15s、发布通道、系统toast/托盘、满盘/507 GUI等均未取得。本轮checkpoint不代替这些证据。
