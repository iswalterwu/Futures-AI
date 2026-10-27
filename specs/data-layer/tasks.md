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
- 验证命令：`pytest tests/test_adapters.py -q`

### T-04 观测存储（DuckDB）
- 上下文：plan §3.2；依赖 T-01
- 修改范围：`backend/data/store/duck.py`、`backend/data/store/ingest.py`
- 完成标准：AC-003-1（幂等：同批次重放不重复、不覆盖历史）；ingest_runs 生命周期（running→succeeded/failed）；失败无部分写入
- 验证命令：`pytest tests/test_store.py -k Idempotent -q`

### T-05 择优解析（winners）
- 上下文：plan §3.2/§3.4；依赖 T-04
- 修改范围：`backend/data/store/winners.py`
- 完成标准：AC-003-2（latest 两粒度）、AC-003-3（asof 与 latest 同一规则，asof(now)≡latest）、AC-003-4（唯一全序：优先级→可见时间→批次序号；手动覆盖=替换优先级；并列样例断言唯一）
- 验证命令：`pytest tests/test_store.py -q`

### T-06 目录编译与源状态机（registry）
- 上下文：plan §4.1；依赖 T-03
- 修改范围：`backend/data/catalog/registry.py`
- 完成标准：AC-001-1（双目录扫描）、AC-001-3（增量重建/error/disabled 软删、既有序列不清空）、AC-001-4（重复 id 后到者 error）、**AC-002-2（同描述符自动归并，不同 contract 不同序列）**
- 验证命令：`pytest tests/test_registry.py -q`

### T-07 别名映射与裁决
- 上下文：plan §3.1 aliases；依赖 T-06
- 修改范围：`backend/data/catalog/aliases.py`
- 完成标准：AC-002-3（来源作用域；手动 > manifest > 模板 > 模糊；写入低优先级被拒；覆盖持久化）
- 验证命令：`pytest tests/test_aliases.py -q`

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
- 验证命令：`pytest tests/test_adapters_builtin.py -k "Akshare or Receipt" -q`

### T-13 适配器 EIA
- 上下文：依赖 T-11/T-12
- 修改范围：`backend/data/adapters/eia/`
- 完成标准：AC-007-2（credential_ref 读凭证库、key 失败 fail closed、固定响应样本）
- 验证命令：`pytest tests/test_adapters_builtin.py -k Eia -q`

### T-14 适配器本地文件 + import 向导
- 上下文：依赖 T-08
- 修改范围：`backend/data/adapters/local_file/`
- 完成标准：AC-007-3（CSV/Excel 向导映射入库、映射模板保存复用）
- 验证命令：`pytest tests/test_adapters_builtin.py -k LocalFile -q` + `pytest tests/test_cli.py -k Import -q`

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
- 验证命令：`pytest tests/test_cli.py -k SingleWriter -q` + `pytest tests/test_layout.py -q`

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

> 第一轮独立评审（F-01~F-15）驱动；第十六轮按 tasks 模板补齐修改范围、AC 完成标准与验证命令（验证命令在 `backend/` 下执行）。

| # | 任务（修改范围） | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-21 | 锁生命周期前置（先锁后开库）、只读路由生命周期、`.lock` 释放删除（`data/lock.py`、`data/service.py`、`data/cli.py`） | F-01 | AC-004-6 | `pytest tests/test_layout.py -k Lock -q` + `pytest tests/test_cli.py -k SingleWriter -q` | ✅ |
| T-22 | 单连接业务级串行（`data/service.py` 访问锁、`data/mcp_server.py` 内部端点） | F-02 | AC-004-6、AC-008-1 | `pytest tests/test_review_regressions.py -k Concurrency -q` | ✅ |
| T-23 | MCP 主通道 Bearer 鉴权 + 同端口内部端点（`data/mcp_server.py`） | F-06 | AC-008-1、AC-008-4 | `pytest tests/test_mcp.py -k "requires_token or wrong_token or internal_provenance" -q` | ✅ |
| T-24 | ISO8601 范围解析与校验、descriptor 对象返回、do_fetch 显式（`data/service.py`、`data/mcp_server.py`） | F-05 | AC-004-1、AC-008-1 | `pytest tests/test_mcp.py -k "iso_range or search_series" -q` | ✅ |
| T-25 | akshare 仓单/指定合约真实路由，三取数点可注入（`data/adapters/akshare/`） | F-03 | AC-007-1 | `pytest tests/test_adapters_builtin.py -k "Receipt or contract" -q` | ✅ |
| T-26 | EIA 序列/时间绑定、错误脱敏与分类（`data/adapters/eia/`） | F-04/F-07 | AC-007-2、AC-008-3 | `pytest tests/test_review_regressions.py -k CredentialRedaction -q` | ✅ |
| T-27 | 交互式 import 向导 + 批次生命周期 + 覆盖范围记录（`data/cli.py`、`data/adapters/local_file/`） | F-08 | AC-007-3、AC-004-3 | `pytest tests/test_cli.py -k Import -q` + `pytest tests/test_review_regressions.py -k empty_date -q` | ✅ |
| T-28 | 状态机（原地 error/启停保留/provides 撤销 current=0）+ 主源有效优先级 + 显示 ID 重算（`data/catalog/registry.py`、`data/catalog/db.py`） | F-10/F-11 | AC-001-3、AC-003-4、AC-006-1 | `pytest tests/test_review_regressions.py -k RegistryStateMachine -q` | ✅ |
| T-29 | 载荷哈希真实链路 + UTC 统一（`data/fetch/on_demand.py`、`data/store/duck.py`） | F-12 | AC-005-1、AC-003-3 | `pytest tests/test_review_regressions.py -k PayloadHashAndTime -q` | ✅ |
| T-30 | 批次终态保护 + 空批次 + 重放 no-op（`data/store/duck.py`） | F-13 | AC-003-1、AC-004-3 | `pytest tests/test_review_regressions.py -k BatchLifecycle -q` | ✅ |
| T-31 | manifest 纯空白/条件必填/解码失败隔离（`data/manifest.py`） | F-14 | AC-001-2 | `pytest tests/test_adapters.py -q` | ✅ |
| T-32 | package-data 声明，wheel 含内置清单（`backend/pyproject.toml`） | F-09 | AC-001-1 | `pytest tests/test_review_round16.py -k package_data -q`（wheel 实测留发布管线） | ✅ |
| T-33 | 静态扫描逐条阳性 + 空凭证拒绝（`tests/test_scan.py`、`data/creds.py`） | 评审补充 | AC-009-1、AC-009-2 | `pytest tests/test_scan.py tests/test_creds.py -q` + `pytest tests/test_review_regressions.py -k empty_secret -q` | ✅ |

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

## 追加任务（第十三轮双审发现，Converge 再开）

> 来源：第十三轮复审（A=claude-fable-5-1、B=gpt-6.1-sol）均未通过：共同 P2 = eia 无凭证引用分支被函数内局部导入遮蔽（UnboundLocalError → adapter_error/可重试）；B 另一 P2 = 不存在的序列在只读分支被当作成功空序列；另有 P3 与按 AC 的测试缺口。plan §2.1/§2.2/§6 已先行修订。
> R13 = `tests/test_review_round13.py`；关键修复均做变异验证（注入旧行为 → 对应测试必失败）。

| # | 任务 | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-47 | eia 凭证引用：删除遮蔽模块级 FetchError 的局部导入；清单跨字段校验（implementation: eia ⇒ credentials.kind=api_key，否则源 error 且原因可见）；凭证损坏经 service/MCP = unauthorized；EIA 请求边界 401/403/429/5xx 码与 retryable | R13-A/B 共同 P2 + 测试缺口 | AC-007-2、AC-008-3、AC-001-2 | `pytest R13 -k EiaCredentialRef -q` | ✅ |
| T-48 | 不存在的序列 → not_found（只读/取数两分支一致）；已登记无观测 = 成功空结果 | R13-B-02（P2）、A-P3 | AC-008-3、AC-004-1 | `pytest R13 -k UnknownSeries -q` | ✅ |
| T-49 | 取数排队隔离：fetch=true 经专用单槽限流器异步排队（不占工作线程）；akshare 上游调用硬超时（挂起不长期占住写路径） | R13-B-03、A-P3（写互斥无超时） | AC-004-6、AC-008-1、AC-004-3 | `pytest R13 -k FetchQueueIsolation -q` | ✅ |
| T-50 | 真实 SDK 边界回归：FU/BU/LU 库存经 akshare 真实符号映射与列解析（仅 HTTP 边界注入固定响应）；仓单默认回看窗口不再硬编码年份 | B 测试缺口 + 自查 | AC-007-1 | `pytest R13 -k AkshareSdkBoundary -q` | ✅ |
| T-51 | 检索只匹配描述符字段值与别名（不含 JSON 键名）；add-source 骨架 id/name 以字符串写出、eia 凭证引用名 ≤64 | A-P3、R13-B-04 | AC-008-1、AC-004-5 | `pytest R13 -k SearchAndSkeleton -q` | ✅ |
| T-52 | 库文件损坏 → CLI 结构化 internal 错误（只读/写/serve 三路，不留写锁）；陈旧锁删除失败视为占用；非 serve 写进程持锁时只读提示语义化 | A-P3、B 测试缺口 | AC-004-6、AC-008-3 | `pytest R13 -k CorruptDbAndLockEdges -q` | ✅ |
| T-53 | 按 AC 补齐断言：提交中途故障整体回滚（AC-004-3）；修订间历史时点与覆盖（AC-003-3/4）；diff 单因素不可比原因（AC-005-2）；主源为空时缓存沿用/无历史置空（AC-006-4，warning 区分两种情形）；Excel 导入与映射复用（AC-007-3）；默认只读不调适配器且不写批次（AC-008-2）；MCP list_sources 含 reason（AC-008-1）；真实 CTRL_BREAK 优雅退出清理端点与写锁（AC-008-4） | A/B 测试缺口 | AC-003-3、AC-003-4、AC-004-3、AC-005-2、AC-006-4、AC-007-3、AC-008-1、AC-008-2、AC-008-4 | `pytest R13 -k AcceptanceGaps -q` + `pytest tests/test_serve_e2e.py -q` | ✅ |

## 追加任务（第十四轮双审发现，Converge 再开）

> 来源：第十四轮复审 A（claude-fable-5-1）通过；B（gpt-6.1-sol）未通过：R14-B-01 仓单滚动窗口未入批次覆盖快照（diff 误报删除）；R14-B-02 PG 仓单/库存属冻结 R-007 范围却未交付，且用户清单按“吨”假设错标 PG 数据。另有 A/B 的 P3 与测试缺口。plan §2.1/§2.2/§4/§6 已先行修订（取消“PG 不内置”的 plan 层收窄，改为正确交付）。
> R14 = `tests/test_review_round14.py`；修复均做变异验证（11 个变异全部被检出）。

| # | 任务 | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-54 | 批次覆盖 = 实际请求窗口：`Adapter.effective_range` 在建批次前解析（仓单默认 30 天、库存默认 365 天、价格型 None = 全量历史），SDK 请求与批次快照同一窗口；东财库存整页截断且覆盖不到请求起点 → validation_error | R14-B-01（P2） | AC-005-2、D-012 第 10 条 | `pytest R14 -k CoverageSnapshot -q` | ✅ |
| T-55 | 数量型归一表（SC 桶、FU/BU/LU 吨、PG 手×20 吨）；内置仓单扩至 SC/FU/LU/BU/PG、库存扩至 FU/LU/BU/PG；未登记品种/量纲不匹配在请求上游前 validation_error | R14-B-02（P2） | AC-007-1（R-007 五品种）、AC-006-1 | `pytest R14 -k QuantityUnits -q` | ✅ |
| T-56 | 被放弃的超时调用迟到返回不回写、不翻转 failed；取消的排队取数不执行、不泄漏限流容量；DPAPI 解密失败经 service/MCP = unauthorized；provenance 不存在序列 = not_found | A/B P3 + 测试缺口 | AC-004-3、AC-004-6、AC-007-2、AC-009-1、AC-008-3、AC-005-1 | `pytest R14 -k Round14Robustness -q` | ✅ |
| T-57 | CLI 不抛裸异常（写路径意外错误、DuckDB/目录库损坏，覆盖只读/写/serve 三路且不留锁）；锁定与损坏分开提示；只读命令等待非 serve 写进程结束（≤30s，残留端点不可达同规则）；EIA 其余 4xx → validation_error | A/B P3 | AC-008-3、AC-004-6 | `pytest R14 -k CliRound14 -q` + `pytest tests/test_review_round13.py -k http_status -q` | ✅ |
| T-58 | 交接准确性：早期任务验证命令改为实际测试位置（T-03/04/06/07/12/13/14/17 逐条可执行）；受测版本约束 `backend/constraints.txt`，plan/review 措辞由“版本锁定”改为“受测版本约束” | B P3 | 工作流（AGENTS.md §2 Tasks/Handoff） | 逐条执行 T-01~T-20 验证命令 | ✅ |
| T-59 | 测试与运行日期解耦：滚动窗口相关测试冻结“今天”（FrozenDate），避免日期推移后误失败 | Converge 自查 | AC-007-1 | `pytest tests/test_review_round12.py -k "builtin_inventory or builtin_receipt" -q` | ✅ |

## 追加任务（第十五轮双审 P3 收口，Converge 再开）

> 来源：第十五轮复审 A、B 均通过（无 P1/P2）。为免交接后另走一轮完整流程，收口两份报告中低成本且有实质价值的 P3 与测试缺口；plan §2.1/§2.2/§6 已先行修订。
> R15 = `tests/test_review_round15.py`。

| # | 任务 | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-60 | 有效窗口倒置（补全后起点晚于终点）→ validation_error，不建批次 | R15-A P3-1、R15-B-02 | AC-004-1、AC-005-2 | `pytest R15 -k InvertedWindow -q` | ✅ |
| T-61 | 仓单交易日历覆盖检查：请求终点晚于 akshare 静态日历末日 → validation_error（提示升级），不静默 0 行成功；review.md 风险登记日历到期日 | R15-A P3-3 | AC-007-1、AC-004-3 | `pytest R15 -k ReceiptCalendar -q` | ✅ |
| T-62 | CLI stdout 只输出 JSON：fetch / jobs run 期间上游 SDK 打印改道 stderr | R15-A P3-2 | AC-008-3（CLI 契约）、AC-004-2 | `pytest R15 -k StdoutPurity -q` | ✅ |
| T-63 | CLI 最外层统一错误出口（数据目录不可用、服务构建失败等未分类异常 → 结构化 internal，返回 1，不留锁）；凭证文件写入失败 → 保存失败报错且不留半写文件；只读通道无响应时的提示措辞 | R15-B-01、R15-A P3-5 | AC-008-3、AC-009-1、AC-004-6 | `pytest R15 -k CliExit -q` | ✅ |
| T-64 | 测试缺口：真实 serve 子进程下排队取数时只读（内部端点/MCP/CLI）照常响应；仓单经真实 `get_receipt` → 大商所 HTTP 边界（PG 手×20 吨）；显式窗口首端点真删除仍计删除；DPAPI 解密失败 service/MCP 各一 failed 批次 | R15-A/B 测试缺口 | AC-004-6、AC-008-1、AC-007-1、AC-005-2、AC-004-3、AC-007-2 | `pytest R15 -k Gaps15 -q` + `pytest tests/test_serve_e2e.py -q` | ✅ |
| T-65 | 文档：manifest `history_days` = 源历史深度声明（元数据），v1 不用于推导默认窗口 | R15-A P3-4 | AC-001-2（字段契约） | 阅读 plan §2.1 | ✅ |
| T-66 | Checklist 复选框留痕：由独立审核会话依据 A/B 逐项复核结果按共识勾选（实施者不勾选） | R15-B-03 | AGENTS.md §2 第 5 步 | 阅读 checklist.md | ⬜ |

## 追加任务（第十六轮双审发现，Converge 再开）

> 来源：第十六轮复审 A（claude-fable-5-1）通过；B（gpt-6.1-sol）未通过：R16-B-01 凭证并发保存共用固定临时文件致串写（本轮引入，P2）；R16-B-02 提交事务被 KeyboardInterrupt 中断时未回滚（既有，P2）。另有 A/B 的 P3、测试缺口，以及 Checklist 复核中双方一致判 ❌ 的第 4 项（AC-004-6 与 plan 的非 serve 写窗口限制冲突）与第 9 项（T-21~T-33 模板字段缺失）。plan §2.2/§3.2/§3.3 已先行修订：持锁进程均提供只读通道，取消 plan 层收窄。
> R16 = `tests/test_review_round16.py`。

| # | 任务（修改范围） | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-67 | 凭证保存改为同目录独占创建的唯一临时文件 + 原子替换，失败只清理自身临时文件（`data/creds.py`）；真实双进程交错保存回归、替换失败保留旧值 | R16-B-01（P2）、R16-A P3-5 | AC-009-1 | `pytest R16 -k CredentialConcurrency -q` | ✅ |
| T-68 | 提交事务被任何异常（含 KeyboardInterrupt/SystemExit）中断 → 回滚、独立标 failed、原样传播；标 failed 失败不吞掉原异常（`data/store/duck.py`、`data/fetch/on_demand.py`） | R16-B-02（P2） | AC-004-3、AC-003-2 | `pytest R16 -k InterruptedCommit -q` | ✅ |
| T-69 | 持锁进程均提供只读通道：CLI 写命令执行期间在随机端口启动只读端点并写端点文件，结束前删除；只读命令等待中发现端点即路由；向导/骨架的数据访问经访问锁（`data/mcp_server.py`、`data/cli.py`、`data/service.py`） | Checklist 第 4/5/12 项（A/B）、AC-004-6 | AC-004-6、AC-008-1 | `pytest R16 -k WriterChannel -q` + `pytest tests/test_serve_e2e.py -q` | ✅ |
| T-70 | 上游 SDK 运行期打印按线程改道 stderr（含超时被放弃线程的迟到打印），移除 CLI 对 sys.stdout 的整体替换；CLI 输出契约按命令类别收准（`data/adapters/akshare/akshare_adapter.py`、`data/cli.py`） | R16-B-03/B-04、R16-A P3-1/P3-4 | AC-008-3 | `pytest R16 -k SdkStdout -q` + `pytest tests/test_review_round15.py -k StdoutPurity -q` | ✅ |
| T-71 | CLI 退出契约：参数用法错误退出码 2；KeyboardInterrupt 原样传播且释放写锁；serve 启动失败（端口被占）→ 结构化 internal、不留锁与端点；Service 构造被任何异常中断均释放写锁（`data/cli.py`、`data/service.py`） | R16-A P3-3、R16-B 测试缺口 | AC-008-3、AC-004-6 | `pytest R16 -k ExitContract -q` | ✅ |
| T-72 | 测试与日期解耦（第十三轮仓单默认窗口测试冻结今天）；倒置窗口消息带时间；仓单经真实 SDK 至上期所/能源中心 HTTP 边界回归（SC→kb、FU→kton）；package-data 声明断言（`tests/`、`data/fetch/on_demand.py`） | R16-B-05、R16-A P3-2/P3-6、R16-B 测试缺口 | AC-007-1、AC-004-1、AC-001-1 | `pytest R16 -k Round16Gaps -q` + `pytest tests/test_review_round13.py -k receipt_default_window -q` | ✅ |
| T-73 | tasks.md T-21~T-33 补齐模板字段（修改范围 / 完成标准 AC / 验证命令） | Checklist 第 9 项（A/B） | 工作流（AGENTS.md §2 第 6 步） | 逐条执行 T-21~T-33 验证命令 | ✅ |

## 追加任务（第十七轮审核员 B 发现，Converge 再开）

> 来源：第十七轮复审 B（gpt-6.1-sol）未通过：R17-B-01 写命令退出时只读通道仅 join(5)、Service 关库不持访问锁，在途读取撞上已关闭连接（P2，T-69 引入）；另有 P3 与测试缺口。审核员 A 本轮超时未产出（第十八轮重跑）。plan §2.2 已先行修订（通道排空/降级/重试、serve 停服例外）。
> R17 = `tests/test_review_round17.py`。

| # | 任务（修改范围） | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-74 | 写命令退出先排空在途只读请求（≤30s，超时强制停服），Service 关库在访问锁保护下进行（`data/mcp_server.py`、`data/service.py`） | R17-B-01（P2） | AC-004-6 | `pytest R17 -k TestChannelDrain -q` | ✅ |
| T-75 | 通道从线程启动起纳入清理：启动等待中断、端点发布/删除失败不遗留后台线程；无通道时写命令照常并在 stderr 提示（`data/mcp_server.py`、`data/cli.py`） | R17-B-02 | AC-004-6、AC-008-3 | `pytest R17 -k TestChannelCleanup -q` | ✅ |
| T-76 | 只读命令对同一端点在截止时间内间隔 1s 重试，单次请求超时 10s（`data/cli.py`） | R17-B-03 | AC-004-6 | `pytest R17 -k TestRouteRetry -q` | ✅ |
| T-77 | 退出契约收准：serve 正常停服（Ctrl+C/Ctrl+Break/SystemExit(0)）为例外，清理后返回 0（plan §2.2、`data/cli.py`） | R17-B-04 | AC-008-3、AC-008-4 | `pytest R17 -k TestServeShutdown -q` | ✅ |
| T-78 | import 向导等待输入时不持访问锁、经写进程只读通道的读取即时成功（持久回归） | R17-B 测试缺口 | AC-004-6、AC-007-3 | `pytest R17 -k TestWizardChannel -q` | ✅ |
| T-79 | 凭证部分写入后失败、双写者交错且一方替换失败的持久回归 | R17-B 测试缺口 | AC-009-1 | `pytest R17 -k TestCredentialFailures -q` | ✅ |
| T-80 | 凭证扫描阳性样例逐条标注规则组并断言各自命中（三组均有样例），补阴性样例（`tests/test_scan.py`、`tests/fixtures/credential_scan_fixtures/`） | R17-B-05 | AC-009-2 | `pytest tests/test_scan.py -q` | ✅ |
