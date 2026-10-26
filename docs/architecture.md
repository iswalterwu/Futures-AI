# Futures-AI 产品架构（architecture.md）

> 与 `plan.md` 配套。本文档定义系统分层、组件职责与数据流。变更需同步 ADR。

## 1. 总体架构

```
┌──────────────────────────────────────────────────┐
│ Shell 桌面外壳（Electron，待确认）                    │
│ 窗口/托盘/通知/自动更新/打包/激活窗口                   │
├──────────────────────────────────────────────────┤
│ Frontend Web 前端（Vue 3 + TS + ECharts）           │
│ 图表(option 渲染) · 日报 · 知识库界面 · 设置 · 对话    │
│      ↕ localhost HTTP / WebSocket                 │
├──────────────────────────────────────────────────┤
│ Backend Python 核心（FastAPI，仅 localhost）        │
│  ┌───────────┬─────────────┬──────────────────┐  │
│  │ 统一数据层  │ 知识层       │ Agent 层          │  │
│  │ adapters  │ ingest/index│ pi RPC + MCP     │  │
│  │ catalog   │ memory      │ 工具集            │  │
│  └───────────┴─────────────┴──────────────────┘  │
│  ┌───────────┬─────────────┐                     │
│  │ 报告管线   │ 授权模块     │                     │
│  └───────────┴─────────────┘                     │
├──────────────────────────────────────────────────┤
│ Storage                                          │
│ DuckDB(时序) + SQLite(元数据/向量)                  │
│ 用户数据目录：docs_in/ knowledge/ memory/ cred/ log │
└──────────────────────────────────────────────────┘
pi coding agent（子进程，`pi --mode rpc`）
   ↑ Backend 驱动（JSONL）
   └ 工具经本地 MCP server 指回 Backend
```

## 2. 分层职责

| 层 | 职责 | 技术 |
|---|---|---|
| Shell | 窗口管理、托盘、通知、自动更新、进程守护（拉起 Backend） | Electron（待确认） |
| Frontend | 图表渲染、日报展示、设置界面、知识库浏览、对话面板 | Vue 3 + Vite + TS + ECharts |
| Backend/api | localhost REST/WS，前后端唯一边界 | FastAPI |
| Backend/data | 统一数据层：适配器、序列目录、溯源、取数、对齐 | Python + DuckDB |
| Backend/knowledge | 文档摄取、嵌入、向量检索、知识沉淀、记忆 | Python + sqlite-vec |
| Backend/agent | pi RPC 生命周期、MCP server、agent 工具 | Python + pi |
| Backend/report | chart-spec 模板库、数据绑定、日报装配 | Python |
| Backend/license | 激活、校验、feature flags | Python |

## 3. 统一数据层（核心设计）

### 3.1 适配器 manifest（草案）

每个数据源一个适配器，带声明清单：

```yaml
id: akshare
version: 1
credentials: none            # 或 {kind: api_key, env: XXX}
provides:
  - descriptor: {asset: sc, measure: close, freq: 1d, unit: cny_bbl}
    symbols: ["futures_daily_SC"]      # 源侧符号
    fetch: {modes: [on_demand, realtime], history_days: 3650}
    update: {lag_min: 0, revises: true}
```

### 3.2 序列身份

- **规范身份** = 描述符（asset/geo/measure/unit/freq 等）→ 稳定哈希派生 ID；8 槽渲染格式继承 FTEngine（`cat.geo1.geo2.com1.com2.measure.slot7.freq`）
- **别名映射层**：源侧 ticker/字段名 → 描述符（模板规则 + 模糊匹配 + 用户手动覆盖）
- 两源同描述符自动归并同序列

### 3.3 观测存储（DuckDB）

```
observations(series_id, ts, value, unit,
             source, fetched_at, asof, ingest_run, payload_hash)
```

- 追加写、永不删行；`latest_obs` 视图取现值；asof 重建任一时点所见（继承 FTEngine）
- 供方竞争：同 series_id 多源按优先级逐点择优（全族权威 < 纯计算 < 交易所 < 转发 < 常规）。**v1 收窄（2026-10-26，data-layer Checklist 双审裁定）：优先级数值低者胜 + 同优先级取 asof 新 + 手动覆盖最优先；五层分类留待平衡表 feature 再评估**

### 3.4 溯源与对齐（track & align）

- **溯源**：每个值可回答"哪来的、何时来、哪一批"
- **修订**：vintages 保留，修订即新版本；diff 报告"什么变了、变多少"
- **对齐**：两源同序列自动校验单位换算、日历/时区、重采样口径；不一致进对账报告

### 3.5 取数模式

- **scheduled**：APScheduler 定时批量（类似 FTEngine 刷新）。**v1 收窄（2026-10-26）：data-layer 先交付任务注册表骨架 + 手动触发，不引 APScheduler；调度器随 daily-report feature 引入**
- **on_demand**：agent/用户触发 → 适配器即时拉取 → 写库 → 返回（agent 工具 `fetch_series`）
- **realtime**：订阅流，喂盯盘与盘中提醒

## 4. 知识层（多层存储与检索，D-009）

核心原则：**embedding 只负责“找文本”，数字和表格交给 SQL**。

### 4.1 存储分层

| 数据类型 | 例子 | 存储 | 检索方式 |
|---|---|---|---|
| 非结构化长文 | PDF 研报、新闻、交易所公告 | Markdown/JSON + 原文页坐标 | 切块（带上下文）→ bge-m3 向量 + BM25 混合检索 |
| 表格 | Excel、PDF 表格、仓单日报 | 规范化 Parquet / DuckDB 表 | SQL（必要时文本转查询）+ 表卡 |
| 时间序列/大数据集 | 行情、期限结构、持仓、库存 | Parquet + DuckDB | `get_series()` / SQL |
| 元数据 | 目录、来源、日期、品种、版本 | DuckDB catalog | 检索前过滤 |

选型：PDF 解析 MinerU（纯文本层 PyMuPDF）；OCR PaddleOCR/RapidOCR；嵌入 bge-m3（1024 维/8192 token/dense+sparse）；精排 bge-reranker-v2-m3；向量库 LanceDB；关键词 DuckDB FTS（BM25，备选 Tantivy）；结构化 DuckDB + Parquet。

### 4.2 检索管线

dense + BM25 各召回 30–50 → RRF 融合 → 元数据过滤（品种/日期/来源）→ reranker 精排 → top 8。

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
knowledge/   沉淀区：notes/（markdown 笔记）facts/（jsonl 结构化事实）
             summaries/（文档摘要）snapshots/（图表/结论快照）index/（LanceDB 向量 + FTS）
tables/      规范化 Parquet/DuckDB 表
memory/      agent 记忆状态：profile/（用户画像）focus/（关注点）logic/（分析逻辑）
```

### 4.5 摄取管线

文档（PDF/docx/xlsx/md）→ 解析（PyMuPDF 文本层 / MinerU 高质量 / OCR 扫描页）→ 分块（带上下文）→ 表卡与表格入库 → 嵌入（bge-m3）→ LanceDB + FTS 索引 → 摘要

### 4.6 记忆与自迭代

- 短期记忆：会话与近期笔记；长期记忆：沉淀进 knowledge/ 的笔记与事实
- 自迭代循环：agent 产出新结论 → 经 `kb_write` 写入 knowledge/ → 重建索引 → 后续可检索
- 用户画像（关注品种、逻辑偏好）由 agent 从交互中归纳、人工可改

## 5. Agent 层（pi 集成）

### 5.1 生命周期

Backend 启动 → spawn `pi --mode rpc`（JSONL over stdio）→ 会话消息/工具事件双向 → 退出时优雅关闭

### 5.2 工具暴露（MCP）

Backend 内置本地 MCP server（stdio），pi 的 mcp.json 指向它；工具集：

- data：`search_series` `fetch_series` `list_sources` `reconcile`
- knowledge：`kb_search`（混合检索）`table_query`（SQL 查表）`kb_write` `kb_status`
- report：`render_chart` `build_report`（v1 阶段）

权限：读默认；写知识/取数需显式工具调用。

### 5.3 模型

- pi 内置 providers + `models.json` 自定义端点；用户 key 经设置界面注入
- 非 agent 模型（嵌入/分类）走 Backend 本地或 API

### 5.4 角色

日报分析文字撰写、专题研究初稿、用户问答、按需取数、知识沉淀

## 6. 报告与图表管线

- **chart-spec**：`{template_id, series_bindings, overrides}` → 编译成 ECharts option → 前端渲染
- **模板库 v1**：kind 枚举（season-daily/season-monthly/season-phase/line/dual/bar/hbar/bar-signed/stack/area/scatter-fit/band/heat/table）+ 油品模板集
- **日报管线**：数据快照 → 模板装配 → agent 撰写分析文字 → 渲染 → 沉淀快照
- **溯源**：每个数字可回溯到 series_id + observation（含来源与拉取时间）

## 7. 授权与收费模块

- license 文件（签名 JSON，绑定机器指纹）+ 激活服务器 + 周期校验 + 离线宽限
- feature flags：tier → 功能矩阵（数据源数量/自定义能力/记忆功能/模型额度）
- 预留：内置模型计费网关接口

## 8. 数据流示例

1. **冷启动**：启动 Backend → 加载适配器 → 编译目录 → 拉起 pi → 前端就绪
2. **每日刷新**：scheduler 触发 → 各适配器批量拉取 → 写 DuckDB → 溯源/对齐检查 → 生成图表+日报 → 通知
3. **按需取数**：用户/agent 请求 → `fetch_series` → 适配器即时调用 → 写库 → 返回
4. **知识摄取**：用户指定新文档 → 解析/分块/嵌入 → 索引 → agent 摘要 → 沉淀

## 9. 隔离与安全

- 每安装一套用户数据目录；文档内容不出本机（嵌入本地计算）
- 凭证加密存储（DPAPI）；agent 工具默认只读，写操作显式授权
- localhost API 绑定 127.0.0.1，令牌鉴权

## 10. 扩展路径

- **品种插件**：适配器 + 品种配置包（模板/口径/页面）
- **多端**：Backend headless，移动端经只读通道或自托管接入
- **第三方适配器生态**：manifest 规范开放，用户目录扫描安装
