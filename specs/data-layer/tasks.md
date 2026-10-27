# Feature: data-layer 任务清单（tasks.md）

> Tasks 阶段产物：每任务 0.5–2 小时可完成，按依赖顺序执行。完成标准引用 AC 编号。
> 前置条件：checklist.md 终审通过 ✅（A/B 双审共识）。

## 任务

### T-01 项目骨架与依赖冒烟
- 上下文：backend/ 包骨架（pyproject.toml、data/ 包结构、pytest 配置、隔离临时根 fixture）
- 修改范围：`backend/pyproject.toml`、`backend/data/__init__.py`、`backend/tests/conftest.py`
- 完成标准：全依赖 pip install + import 成功（环境前提，spec §4）；pytest 空跑通过
- 验证命令：`cd backend && pip install -e . && python -c "import data" && pytest -q`

### T-02 描述符规范化、ID 派生与 8 槽渲染
- 上下文：plan §2.3；依赖 T-01
- 修改范围：`backend/data/catalog/descriptor.py`
- 完成标准：AC-002-1（golden 对拍含 contract 缺省与 SC2401）、AC-002-5（8 槽渲染 golden）；contract 合法值 = 1–20 位字母或数字，非法/纯空白/超长拒绝
- 验证命令：`pytest tests/test_identity.py -q`

### T-03 manifest 字段契约与校验
- 上下文：plan §2.1；依赖 T-02
- 修改范围：`backend/data/manifest.py`
- 完成标准：AC-001-2（必填字段/枚举/类型/contract 字符集校验；坏件报告路径+字段+原因）；重复 id 检测数据
- 验证命令：`pytest tests/test_adapters.py::test_manifest_validation -q`

### T-04 观测存储（DuckDB）
- 上下文：plan §3.2；依赖 T-01
- 修改范围：`backend/data/store/duck.py`、`backend/data/store/ingest.py`
- 完成标准：AC-003-1（幂等：同批次重放不重复、不覆盖历史）；ingest_runs 生命周期（running→succeeded/failed）；失败无部分写入
- 验证命令：`pytest tests/test_store.py::test_idempotent_replay -q`

### T-05 择优解析（winners）
- 上下文：plan §3.2/§3.4；依赖 T-04
- 修改范围：`backend/data/store/winners.py`
- 完成标准：AC-003-2（latest 两粒度）、AC-003-3（asof 与 latest 同一规则，asof(now)≡latest）、AC-003-4（唯一全序：优先级→可见时间→批次序号；手动覆盖=替换优先级；并列样例断言唯一）
- 验证命令：`pytest tests/test_store.py -q`

### T-06 目录编译与源状态机（registry）
- 上下文：plan §4.1；依赖 T-03
- 修改范围：`backend/data/catalog/registry.py`
- 完成标准：AC-001-1（双目录扫描）、AC-001-3（增量重建/error/disabled 软删、既有序列不清空）、AC-001-4（重复 id 后到者 error）、**AC-002-2（同描述符自动归并，不同 contract 不同序列）**
- 验证命令：`pytest tests/test_adapters.py::test_registry -q`

### T-07 别名映射与裁决
- 上下文：plan §3.1 aliases；依赖 T-06
- 修改范围：`backend/data/catalog/aliases.py`
- 完成标准：AC-002-3（来源作用域；手动 > manifest > 模板 > 模糊；写入低优先级被拒；覆盖持久化）
- 验证命令：`pytest tests/test_identity.py::test_aliases -q`

### T-08 按需取数与任务注册表
- 上下文：plan §4.2/§4.3；依赖 T-05/T-06
- 修改范围：`backend/data/fetch/on_demand.py`、`backend/data/fetch/jobs.py`
- 完成标准：AC-004-1（do_fetch 语义/只读短路/显式源校验/无启用源 not_found）、AC-004-2（注册/查看/手动触发）、AC-004-3（失败原子性、重试=新批次）、AC-004-4（realtime 签名存在）
- 验证命令：`pytest tests/test_fetch.py -q`

### T-09 对账与主源派生缓存
- 上下文：plan §4.5；依赖 T-06
- 修改范围：`backend/data/align.py`
- 完成标准：AC-006-1/2/3/4（口径权威、对账报告、主源派生缓存、退化 warning）
- 验证命令：`pytest tests/test_align.py -q`

### T-10 溯源查询与 diff
- 上下文：plan §4.4；依赖 T-04
- 修改范围：`backend/data/store/provenance.py`
- 完成标准：AC-005-1（来源/拉取时间/批次/哈希可查）、AC-005-2（可比条件、三类计数、ΣΔ/max|Δ| 口径）
- 验证命令：`pytest tests/test_provenance.py -q`

### T-11 凭证存储（fail closed）
- 上下文：plan §1/§2；依赖 T-01
- 修改范围：`backend/data/creds.py`
- 完成标准：AC-009-1（加密保存；保存失败与读取失败均报错，无明文/None）
- 验证命令：`pytest tests/test_creds.py -q`

### T-12 适配器基类与 akshare
- 上下文：plan §1/§2.1；依赖 T-03/T-08
- 修改范围：`backend/data/adapters/base.py`、`backend/data/adapters/akshare/`
- 完成标准：AC-007-1（SC/FU/LU/BU/PG 日线 + 仓单/库存，固定响应样本 mock；在线冒烟可选）
- 验证命令：`pytest tests/test_adapters_akshare.py -q`

### T-13 适配器 EIA
- 上下文：依赖 T-11/T-12
- 修改范围：`backend/data/adapters/eia/`
- 完成标准：AC-007-2（credential_ref 读凭证库、key 失败 fail closed、固定响应样本）
- 验证命令：`pytest tests/test_adapters_eia.py -q`

### T-14 适配器本地文件 + import 向导
- 上下文：依赖 T-08
- 修改范围：`backend/data/adapters/local_file/`
- 完成标准：AC-007-3（CSV/Excel 向导映射入库、映射模板保存复用）
- 验证命令：`pytest tests/test_adapters_local.py -q`

### T-15 MCP server 与内部只读端点
- 上下文：plan §2.2/§4.6；依赖 T-05/T-08/T-09
- 修改范围：`backend/data/mcp_server.py`
- 完成标准：AC-008-1（四工具逐契约）、AC-008-2（fetch 默认 false 短路）、AC-008-3（错误契约含 retryable 映射）、AC-008-4（serve 启动可连接）；内部只读端点 /internal/provenance、/internal/diff
- 验证命令：`pytest tests/test_mcp.py -q`

### T-16 CLI 全子命令
- 上下文：plan §2.2；依赖 T-09/T-10/T-11/T-15
- 修改范围：`backend/data/cli.py`
- 完成标准：AC-004-5（config 持久化/add-source 骨架）、AC-005-1/2 交付入口（provenance/diff）、jobs/import/reconcile/list/serve
- 验证命令：`pytest tests/test_cli.py -q`

### T-17 单写者文件锁与只读路由
- 上下文：plan §3.3/§6；依赖 T-16
- 修改范围：`backend/data/lock.py`
- 完成标准：AC-004-6（serve 持锁时写命令报错；只读命令经内部 HTTP 路由；端点发现 mcp_endpoint.json）
- 验证命令：`pytest tests/test_cli.py::test_single_writer -q`

### T-18 静态扫描（零凭证 + 零手写 ID）
- 上下文：spec AC-009-2/AC-002-4；依赖 T-01
- 修改范围：`backend/tests/fixtures/credential_scan_fixtures/`、`backend/tests/fixtures/manual_series_id_fixtures/`、`backend/tests/test_scan.py`
- 完成标准：AC-009-2（三正则组 + 阳/阴性样例，阳性须命中）、AC-002-4（辅助 grep + 构造性测试）
- 验证命令：`pytest tests/test_scan.py -q`

### T-19 目录结构与隔离断言
- 上下文：plan §3.3；依赖 T-01
- 修改范围：`backend/tests/test_layout.py`
- 完成标准：AC-009-3（权威布局断言；用户数据不入 Git）
- 验证命令：`pytest tests/test_layout.py -q`

### T-20 全量回归与文档同步
- 上下文：AC-007-4（适配器隔离）；依赖 T-01~T-19
- 修改范围：全量测试跑通、backend/README.md、docs 同步（architecture §3 锚点核对）
- 完成标准：全部 36 条 AC 有测试断言且通过；`pytest -q` 全绿
- 验证命令：`cd backend && pytest -q`

## 追加任务（独立 Review 发现，Converge 重新打开后完成 ✅）

| # | 任务 | 关联发现 | 状态 |
|---|---|---|---|
| T-21 | 锁生命周期前置（先锁后开库）、只读路由生命周期、.lock 释放删除 | F-01 | ✅ 133 tests |
| T-22 | 单连接业务级串行（Service access_lock） | F-02 | ✅ 并发回归 test_concurrent_provenance_no_crosstalk |
| T-23 | MCP 主通道 Bearer 鉴权（token_verifier）+ 同端口内部端点 | F-06 | ✅ test_mcp auth |
| T-24 | ISO8601 范围解析与校验、descriptor 对象返回、do_fetch 显式 | F-05 | ✅ test_iso_range_* |
| T-25 | akshare 仓单/指定合约真实路由（三取数点注入） | F-03 | ✅ TestReceiptAndContract |
| T-26 | EIA 序列/时间绑定、错误脱敏与分类 | F-04/F-07 | ✅ TestCredentialRedaction |
| T-27 | 交互式 import 向导 + 批次生命周期 + 覆盖范围记录 | F-08 | ✅ test_import_* |
| T-28 | 状态机（原地 error/启停保留/provides 撤销 current=0）+ 主源用有效优先级 + 显示 ID 重算 | F-10/F-11 | ✅ TestRegistryStateMachine |
| T-29 | 载荷哈希真实链路 + UTC 统一 | F-12 | ✅ TestPayloadHashAndTime |
| T-30 | 批次终态保护 + 空批次 + 重放 no-op | F-13 | ✅ TestBatchLifecycle |
| T-31 | manifest 纯空白/条件必填/解码失败隔离 | F-14 | ✅ test_adapters |
| T-32 | package-data 声明（wheel 含内置清单） | F-09 | ✅ pyproject 已声明；wheel 实测留发布管线 |
| T-33 | 静态扫描逐条阳性 + 空凭证拒绝 | 评审补充 | ✅ test_scan/test_creds |

## 追加任务（第十二轮审核员 A 独立评审发现，Converge 重新打开）

> 来源：审核员 A（claude-fable-5-1，首次参与）第十二轮复核 5 项 P2 + P3 + 测试缺口。方案变更已先写入 plan（§2.1 执行绑定/akshare 符号约定、§2.2 config/import/serve/内部通道/首启/错误分类/执行模型、§3.1 source_reasons 与 reg_order、§6 时间语义）。
> 验证命令在 `backend/` 下执行（R12 = `tests/test_review_round12.py`）；全量 `python -m pytest tests/ -q` 为准。关键修复均做过变异验证（注入旧行为 → 对应测试必失败）。

| # | 任务 | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-34 | 只读命令空目录首启：库文件不存在/未初始化 → 内存目录（按清单编译）+ 空观测库，不建库、不取锁；diff/provenance/reconcile/list 均不抛裸异常 | A-P2-1 | AC-004-6（只读命令不受影响）、AC-006-3/AC-006-4（reconcile 首启返回 warnings） | `pytest R12 -k FreshRoot -q` | ✅ |
| T-35 | 配置入口存在性校验：priority/alias/enable/disable/jobs register 仅接受已有清单的真实源与存在的序列；负向测试（且不落库） | A-P2-2 | AC-004-5（只能配置已有清单的源）、AC-004-2 | `pytest R12 -k ConfigValidation -q` | ✅ |
| T-36 | 错误分类：凭证缺失/读取失败 → unauthorized（retryable=false）；源未绑定取数实现 → not_found；service 与 MCP 两路断言 | A-P2-3 | AC-008-3、AC-007-2 | `pytest R12 -k ErrorClassification -q` | ✅ |
| T-37 | 用户清单执行绑定（manifest `implementation`）+ akshare 库存日报（FU/BU/LU，`_STOCK`）+ 指定合约经用户清单全链路入库 + 导入向导目标选择（local-file 绑定源，多目标选择/`--series`） | A-P2-4 | AC-001-1（用户目录加载）、AC-007-1（指定合约/库存日报入库）、AC-007-3 | `pytest R12 -k "Binding or ImportTargets" -q` | ✅ |
| T-38 | R-001 单源启停入口：`config enable/disable <source_id>`（持久化、重启生效、刷新主源）；修正“停用源历史仍可见”空断言测试 | A-P2-5 + 测试缺口 | AC-004-5、AC-004-1（默认拉取源随启停变化）、AC-003-2/AC-003-4（停用不影响历史可见与择优） | `pytest R12 -k EnableDisable -q` + `pytest tests/test_store.py -k disabled_source -q` | ✅ |
| T-39 | 清单校验原因用户可见：source_reasons 持久化、list_sources.reason、serve 启动打印 | A-P3 + 测试缺口 AC-001-2 | AC-001-2（被拒并报告原因） | `pytest R12 -k ManifestReason -q` | ✅ |
| T-40 | serve 生命周期：`--port`（默认 8932）、issuer 与实际端口一致、退出删除端点文件；真实 serve 子进程端到端（MCP 握手/工具调用、CLI 只读经 HTTP、写命令被拒、强杀后陈旧锁回收） | A-P3 + 测试缺口 AC-008-4/AC-004-6 | AC-008-4、AC-004-6 | `pytest tests/test_serve_e2e.py -q` + `pytest R12 -k "serve_reports or exit_signals" -q` | ✅ |
| T-41 | MCP 工具/内部端点移出事件循环（工作线程）；取数网络阶段不持访问锁；SQLite 跨线程访问经访问锁串行 | A-P3 | AC-008-1、AC-004-6（只读不受写阻塞） | `pytest R12 -k NonBlocking -q` | ✅ |
| T-42 | 健壮性：择优可见时间纯算术比较（不经本机时区）、对账跳过无声明源并 warning、检索 LIKE 转义、reg_order 首次登记持久、目录重建单事务、死代码清理、内部端点常量时间令牌比较与结构化错误 | A-P3 | AC-003-4、AC-006-3、AC-008-1、AC-001-3 | `pytest R12 -k TestRobustness -q` | ✅ |
| T-43 | 锁健壮性：OpenProcess 拒绝访问不判陈旧；陈旧锁删除失败视为占用；DuckDB 文件被占用映射 LockBusy | A-P3 | AC-004-6 | `pytest R12 -k LockRobustness -q` | ✅ |
| T-44 | 时间语义：带时区 range 换算到序列主源声明时区；本地导入带时区时间戳换算到目标源声明时区 | A-P3 | AC-004-1、AC-007-3 | `pytest R12 -k "TimeSemantics or choose_among" -q` | ✅ |
| T-45 | CLI 小项：credentials 交互输入（不入 shell 历史、不需写锁）、凭证名校验（防路径穿越）、CSV 后缀大小写、jobs last_run UTC 且触发后记录、add-source id 校验（防路径穿越）与骨架补全、diff 不可比原因输出、内部路由错误透传、mcp<2 锁定入 pyproject | A-P3 | AC-009-1、AC-007-3、AC-004-2、AC-004-5、AC-005-2 | `pytest R12 -k CliMisc -q` + `pytest tests/test_cli.py -q` | ✅ |
| T-46 | 内置清单 SC 仓单单位修正（cny_ton → kb，原始桶 ÷1000），与库存日报同一数量型归一规则 | Converge 自查（随 T-37 发现） | AC-007-1、AC-006-1（口径声明权威） | `pytest tests/test_adapters_builtin.py -q` + `pytest R12 -k builtin_receipt -q` | ✅ |
