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
