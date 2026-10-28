# Futures-AI 产品架构（architecture.md）

> 与 `plan.md` 配套。本文档定义系统分层、组件职责与数据流。变更需同步 ADR。
> 交互与协作模型（双循环、阶段契约、介入机制、知识回流、学习与协议）见 `interaction.md`；界面语言与组件见 `designUI.md`。

## 1. 总体架构

```
┌──────────────────────────────────────────────────────────┐
│ Shell 桌面外壳（Electron）                                  │
│ 窗口/托盘/通知/自动更新/打包/激活窗口                         │
├──────────────────────────────────────────────────────────┤
│ Frontend Web 前端（Vue 3 + TS + ECharts）                   │
│ 工作台(焦点带/作业轨道/模块) · 作业四阶段 · 交付台 · 学习区      │
│ 知识库 · 设置 · 对话                                          │
│      ↕ localhost HTTP / WebSocket                          │
├──────────────────────────────────────────────────────────┤
│ Backend Python 核心（FastAPI，仅 localhost）                 │
│  ┌───────────┬──────────────┬────────────────────┐          │
│  │ 统一数据层  │ 知识层        │ Agent 层(pi RPC)    │          │
│  │ adapters   │ ingest/gate  │ 工具集              │          │
│  │ catalog    │ index/memory │                    │          │
│  └───────────┴──────────────┴────────────────────┘          │
│  ┌──────────────┬───────────────┬───────────────┐          │
│  │ 作业引擎       │ 交付管线        │ 学习/协议       │          │
│  │ 状态机/版本/介入│ 块模型/发布     │ 会话/蒸馏       │          │
│  └──────────────┴───────────────┴───────────────┘          │
│  ┌───────────┐                                              │
│  │ 授权模块   │                                              │
│  └───────────┘                                              │
├──────────────────────────────────────────────────────────┤
│ Storage                                                    │
│ DuckDB(时序/分析/断言台账) + SQLite(元数据) + LanceDB(向量)   │
│ 用户数据目录：docs_in/ knowledge/ works/ claims/ playbook/    │
│              learning/ memory/ creds/ log                   │
└──────────────────────────────────────────────────────────┘
pi coding agent（子进程，`pi --mode rpc`）
   ↑ Backend 驱动（JSONL）
   └ 工具经本地 MCP server 指回 Backend
```

## 2. 分层职责

| 层 | 职责 | 技术 |
|---|---|---|
| Shell | 窗口管理、托盘、通知、自动更新、进程守护（拉起 Backend） | Electron |
| Frontend | 工作台/作业四阶段/交付台/学习区、图表渲染、知识库、设置、对话 | Vue 3 + Vite + TS + ECharts |
| Backend/api | localhost REST/WS，前后端唯一边界 | FastAPI |
| Backend/data | 统一数据层：适配器、序列目录、溯源、取数、对齐 | Python + DuckDB |
| Backend/knowledge | 文档摄取、写入闸门、断言台账、检索、记忆与分析协议 | Python + LanceDB/bge-m3/DuckDB FTS |
| Backend/workflow | 作业编排：阶段状态机、产物版本、检查点合并、介入事件、验证性需求生命周期 | Python |
| Backend/agent | pi RPC 生命周期、MCP server、agent 工具 | Python + pi |
| Backend/report | 交付管线：chart-spec 模板、块式交付物装配、发布快照 | Python |
| Backend/learning | 学习会话、认知缺口、分析协议蒸馏 | Python + pi |
| Backend/settings | 用户档案、数据源开通向导（凭证由 data-layer 的 creds 管理） | Python |
| Backend/license | 激活、校验、feature flags | Python |

## 3. 统一数据层（核心设计）

### 3.1 适配器 manifest（草案，完整字段契约以 specs/data-layer/plan.md §2.1 为准）

每个数据源一个适配器，带声明清单：

```yaml
id: akshare
version: 1
credentials: none            # 或 {kind: api_key, credential_ref: <名>}，密钥存凭证库（DPAPI）
provides:
  - descriptor: {asset: sc, geo: world, measure: close, contract: ""}   # contract 可选：空串 = 主力/连续
    symbols: ["futures_daily_SC"]      # 源侧符号
    unit: cny_bbl
    freq: 1d
    tz: Asia/Shanghai
    priority: 100                     # 越小越优先，默认 100
    fetch: {modes: [on_demand], history_days: 3650}
    update: {lag_min: 0, revises: true}
```

### 3.2 序列身份

- **规范身份** = 描述符 {asset, geo, measure, contract?}（三键必填且非空，contract 可选：缺省空串 = 主力/连续，非空 = 指定合约 `[A-Za-z0-9]{1,20}`，不同 contract = 不同序列）→ 规范化（键排序/枚举小写/UTF-8）后稳定哈希派生 ID；unit/freq/tz 为序列元数据（不参与身份，同身份不同口径进对账 R-006）
- 8 槽渲染格式继承 FTEngine（`cat.geo1.geo2.com1.com2.measure.slot7.freq`）：asset→槽1、geo→槽2、measure→槽6、contract→槽7（空串渲染 `-`）、freq 元数据→槽8，槽3/4/5 填 `-`
- **别名映射层**：源侧 ticker/字段名 → 描述符（模板规则 + 模糊匹配 + 用户手动覆盖），带来源作用域，裁决：手动 > manifest > 模板 > 模糊
- 两源同描述符自动归并同序列

### 3.3 观测存储（DuckDB）

```
observations(series_id, ts, value, unit,
             source, fetched_at, asof, ingest_run, payload_hash)
```

- 追加写、永不删行；latest_obs 查询取现值（v1 由 Python 侧 winners 择优解析，非 DuckDB 视图）；asof 重建任一时点所见（v1 择优用当前配置，历史配置版本化留 Phase 2，不承诺）
- 供方竞争：同 series_id 多源按优先级逐点择优（全族权威 < 纯计算 < 交易所 < 转发 < 常规）。**v1 收窄（2026-10-26，详见 D-012 ADR）：唯一全序 = 优先级数值小者胜 → asof 新者胜 → ingest_run（自增 BIGINT）大者胜；手动覆盖 = 替换该 source 优先级值并参与同一决胜链（无独立绝对覆盖）；五层分类留待平衡表 feature 再评估**

### 3.4 溯源与对齐（track & align）

- **溯源**：每个值可回答"哪来的、何时来、哪一批"
- **修订**：vintages 保留，修订即新版本；diff 报告"什么变了、变多少"
- **对齐**：两源同序列自动校验单位换算、日历/时区、重采样口径；不一致进对账报告

### 3.5 取数模式

- **scheduled**：APScheduler 定时批量（类似 FTEngine 刷新）。**v1 收窄（2026-10-26）：data-layer 先交付任务注册表骨架 + 手动触发，不引 APScheduler；调度器随 daily-report feature 引入**
- **on_demand**：agent/用户触发 → 适配器即时拉取 → 写库 → 返回（agent 工具 `fetch_series`）
- **realtime**：订阅流，喂盯盘与盘中提醒

### 3.6 与作业层、知识层的边界

数据层只负责**时序观测**的采集、标准化、溯源与对齐；文档解析、表格规范化、断言、交付物与学习产物归知识层与作业层。

- 用户经采集台投放 CSV/Excel 且目标为已声明的序列：走 `local_file` 适配器导入（数据层路径；目标序列需在用户清单中声明，内置 local-file 源默认启用）
- 投放 PDF/docx/md/xlsx 文档或网页/粘贴文本：走知识层摄取管线（§4.5），材料按 L0 闸门入知识层（`interaction.md` §5）；文档中提取的表格由知识层规范化（§4.1）
- 来源说明（用途/可靠性/时效/口径）作为知识与投放记录的溯源元数据，不改变序列身份与观测语义（D-012 不变）
- 时序"去重"仍是 `(series_id, ts, source, ingest_run)` 幂等（D-012 第 5 条）；文档/观点的去重是断言台账（§4.7）

## 4. 知识层（多层存储与检索，D-009）

核心原则：**embedding 只负责“找文本”，数字和表格交给 SQL**。

### 4.1 存储分层

| 数据类型 | 例子 | 存储 | 检索方式 |
|---|---|---|---|
| 非结构化长文 | PDF 研报、新闻、交易所公告 | Markdown/JSON + 原文页坐标 | 切块（带上下文）→ bge-m3 向量 + BM25 混合检索 |
| 表格 | Excel、PDF 表格、仓单日报 | 规范化 Parquet / DuckDB 表 | SQL（必要时文本转查询）+ 表卡 |
| 时间序列/大数据集 | 行情、期限结构、持仓、库存 | Parquet + DuckDB | `get_series()` / SQL |
| 断言与派生 | 结论、观点、笔记、摘要 | DuckDB 断言台账（含派生谱系 DAG）；LanceDB 断言/派生向量 | 断言聚类/同义合并；检索后按谱系展开 |
| 交付物与学习产物 | 日报、专题、学习笔记 | 块模型文档（JSON/Markdown）+ 版本库 | 交付物编辑器 / 检索（派生降权） |
| 元数据 | 目录、来源、日期、品种、版本 | DuckDB catalog | 检索前过滤 |

选型：PDF 解析 MinerU（纯文本层 PyMuPDF）；OCR PaddleOCR/RapidOCR；嵌入 bge-m3（1024 维/8192 token/dense+sparse）；精排 bge-reranker-v2-m3；向量库 LanceDB；关键词 DuckDB FTS（BM25，备选 Tantivy）；结构化 DuckDB + Parquet。

### 4.2 检索管线

dense + BM25 各召回 30–50 → RRF 融合 → 元数据过滤（品种/日期/来源）→ reranker 精排 → top 8。
末端执行检索期去重与派生内容降权（规则权威：`interaction.md` §5.6；落点见 §4.7）。

### 4.3 工程约定

1. 切块带上下文：每块拼“报告标题 + 发布日期 + 品种 + 章节 + 页码”（contextual retrieval）
2. 表卡路线：每表生成表卡（表名/列名/单位/日期范围/样例）并只嵌表卡；agent 先查表卡拿 table_id，再 SQL 查明细
3. 引用到页：chunk 存 doc_id + page + section + 原文哈希，结论可点回 PDF 原页
4. 增量与版本：文件 hash + mtime；catalog 记录解析器/嵌入模型/切块参数版本，变更即重建
5. 期货元数据：品种、交易所（SHFE/INE/DCE/CZCE/CME/LME）、合约月份、报告类型、发布日 vs 数据日、主力连续 vs 单合约
6. 容量：约 900 页/天 ≈ 2000–3500 chunk/天；一年约 100 万 chunk、向量 5–8GB；瓶颈在解析/OCR，夜间批处理；PDF 原件放 NAS

### 4.4 目录布局（每用户数据目录）

```
docs_in/     用户指定授权的文档文件夹（程序只读摄取）
parsed/      解析产物：Markdown/JSON + 页坐标、提取的表格
knowledge/   沉淀区：notes/（markdown 笔记）summaries/（文档摘要）
             snapshots/（图表/结论快照）index/（LanceDB 向量 + FTS）
claims/      断言台账的导入/导出与审计文件；权威表在 DuckDB（§4.7）
works/       作业运行状态、阶段产物与版本、介入事件、待归属投放池（作业引擎）
playbook/    分析协议：active/、proposed/、retired/（版本化）
learning/    学习会话、认知产物、认知缺口
tables/      规范化 Parquet/DuckDB 表
memory/      agent 记忆状态：profile/（用户画像）focus/（关注点）logic/（分析逻辑）
```

数据层目录（data/catalog.sqlite、data/observations.duckdb、data/.lock、adapters/、creds/）以 `specs/data-layer/plan.md` §3.3 为权威布局；本节新增的 `claims/`、`works/`、`playbook/`、`learning/` 与 `data/` 平级，属知识层/作业层，schema 由对应 feature spec 冻结。

派生内容（`origin=derived`）不单独建目录：文本存 `knowledge/notes/` 或交付物块，谱系记入断言台账的派生谱系（DAG，§4.7）。

### 4.5 摄取管线

文档（PDF/docx/xlsx/md）→ 解析（PyMuPDF 文本层 / MinerU 高质量 / OCR 扫描页）→ 分块（带上下文）→ 表卡与表格入库 → **写入闸门**（L0–L2，§4.7）→ 嵌入（bge-m3）→ LanceDB + FTS 索引 → 摘要

### 4.6 记忆、分析协议与自迭代

- 短期记忆：会话与近期作业；长期记忆：`knowledge/` 中的笔记、断言台账（DuckDB，见 §4.7）、`memory/` 的用户画像与关注点
- **分析协议（playbook/）**：从介入痕迹蒸馏出的分析框架、判断标准、表达与数据偏好；显式、可编辑、可停用、版本化；规则权威见 `interaction.md` §6
- **自迭代三层**：L1 产物（版本/重跑）、L2 协议（介入 → 协议）、L3 知识（写入闸门 + 断言台账 + 验证性需求）；定义与验收见 `interaction.md` §2.3
- 用户画像与关注点由 agent 从交互中归纳、人工可改；与协议共用"Agent 学到的"透明页
- agent 产出不再直接写索引：一律经 `kb_write` 过闸门（§4.7）

### 4.7 知识写入闸门与断言台账（D-017）

**职责**：所有进入知识层的内容（外部材料、人 + agent 产物）都必须经过写入闸门；闸门决定"新增 / 归并加证 / 冲突 / 隔离 / 拒绝"。对象分层、L0–L5 闸门、六种判定、晋升与推翻规则的权威在 `interaction.md` §5；本节只定系统落点。

- **存储**：源材料索引（catalog + 文件）、断言台账（DuckDB：`claims` / `claim_anchors` / `claim_edges` / `claim_revisions` / `conflicts`）、派生内容谱系（DAG）、闸门审计日志；断言与派生向量进 LanceDB
- **接口**：`kb_write` 必须提交来源定位与作者类型，返回 `{inserted, merged, linked, conflict, quarantined}`；禁止绕过闸门直接写入索引
- **检索衔接**：检索期去重与派生内容标注降权在 §4.2 管线末端执行
- **成本分级**：按 `interaction.md` §5.7 执行；v1 落 L0–L2 + 派生标记，L3 台账在知识库 v1 后接入

## 5. Agent 层（pi 集成）

### 5.1 生命周期

Backend 启动 → spawn `pi --mode rpc`（JSONL over stdio）→ 会话消息/工具事件双向 → 退出时优雅关闭

### 5.2 工具暴露（MCP）

Backend 内置本地 MCP server（**streamable HTTP、localhost、Backend 进程内提供**，保证 DuckDB 单写者；pi 经 mcp.json URL 连接）；工具集：

- data：`search_series` `fetch_series` `list_sources` `reconcile`
- knowledge：`kb_search`（混合检索）`table_query`（SQL 查表）`kb_write`（必经写入闸门）`kb_status` `claim_query`
- workflow：`artifact_read` `artifact_write` `intervention_read` `verification_propose` `playbook_read`
- deliverable：`render_chart` `build_deliverable`
- learning：`study_material` `study_note`（学习区，v1 后置；字段与权限在对应 feature spec 冻结）

权限：读默认；写知识/取数需显式工具调用，且 `kb_write` 必须提交来源定位与作者类型，返回新增/归并/冲突/隔离结果（§4.7）。v1 工具集以交付闭环最小集为准；除 `data` 四工具已实现（`backend/data/mcp_server.py`）外，其余为规划目标态，随对应 feature spec 落地。

### 5.3 模型

- pi 内置 providers + `models.json` 自定义端点；用户 key 经设置界面注入
- 非 agent 模型（嵌入/分类）走 Backend 本地或 API

### 5.4 角色与作业引擎边界

- 角色：数据采集、数据处理、分析撰写、交付编辑、学习导师；同一 pi 运行时按阶段被作业引擎调用
- **作业引擎（Python，`backend/workflow/`）**：阶段状态机、产物版本与检查点合并、介入事件、验证性需求生命周期；保证可恢复、可审计、可测试
- pi 不承担编排职责：不自行推进阶段、不直接改产物最新版本；所有写入经工具与闸门

## 6. 交付管线与图表

- **chart-spec**：`{template_id, series_bindings, overrides}` → 编译成 ECharts option → 前端渲染
- **模板库 v1**：kind 枚举（season-daily/season-monthly/season-phase/line/dual/bar/hbar/bar-signed/stack/area/scatter-fit/band/heat/table）+ 油品模板集
- **交付管线**：作业编排（§5.4）→ 阶段产物 → 块式交付物装配（块模型权威：`designUI.md` §5.2）→ 人改/agent 改稿 → 版本与发布快照 → 验证性需求抽取（`interaction.md` §3.6）
- **日报** = 定时作业的交付物模板，不再单独一条管线；交付物类型见 `designUI.md` §7
- **溯源**：每个数字可回溯到断言或观测（series_id + observation / claim + source，含来源与拉取时间）

## 7. 授权与收费模块

- license 文件（签名 JSON，绑定机器指纹）+ 激活服务器 + 周期校验 + 离线宽限
- feature flags：tier → 功能矩阵（数据源数量/自定义能力/记忆功能/模型额度）
- 协作/学习能力（分析协议、验证监测、学习区、断言台账高级能力）纳入 feature flags 候选，分层在商业化阶段定
- 预留：内置模型计费网关接口

## 8. 数据流示例

1. **冷启动**：启动 Backend → 加载适配器 → 编译目录 → 拉起 pi → 前端就绪
2. **每日刷新**：scheduler 触发 → 各适配器批量拉取 → 写 DuckDB → 溯源/对齐检查 → 生成图表+日报 → 通知
3. **按需取数**：用户/agent 请求 → `fetch_series` → 适配器即时调用 → 写库 → 返回
4. **知识摄取**：用户指定新文档 → 解析/分块/嵌入 → 索引 → agent 摘要 → 沉淀
5. **人投放材料**：采集台投放（文件/链接/粘贴）→ 解析与抽取 → 写入闸门（§4.7）→ 标准化入库 → 归属作业或进入待归属池
6. **验证循环**：交付 → 抽取验证性需求 → 用户确认 → 新作业 + 采集计划 → 定时/事件触发采集 → 增量版本
7. **学习回流**：学习区会话 → 笔记/问题/框架 → 派生区入库 + 协议候选 + 验证队列

## 9. 隔离与安全

- 每安装一套用户数据目录；文档内容不出本机（嵌入本地计算）
- 凭证加密存储（DPAPI）；agent 工具默认只读，写操作显式授权
- localhost API 绑定 127.0.0.1，令牌鉴权
- 派生内容与来源标注：交付物与检索结果显式区分外部证据 / 人的判断 / agent 结论；派生内容不得伪装为外部证据（D-017）
- 介入、闸门判定、协议变更留审计日志，仅存本机，可导出供用户核查
- 学习区的外网检索按隐私开关，默认关闭，素材优先来自本机知识库

## 10. 扩展路径

- **品种插件**：适配器 + 品种配置包（模板/口径/页面）
- **多端**：Backend headless，移动端经只读通道或自托管接入
- **第三方适配器生态**：manifest 规范开放，用户目录扫描安装
