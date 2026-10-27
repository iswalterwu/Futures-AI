# Futures-AI 总方案（plan.md）

> 本文档是项目方案的总入口：背景目标、决策记录、文档体系、目录结构、路线图与扩展性设计。
> 架构细节见 `architecture.md`，设计理念见 `designUI.md`。变更本文件内容即变更项目方案，需同步相关文档。

## 1. 背景与目标

期货市场信息极度碎片化，现有工具存在四个痛点：

1. **数据分散**：不同供应商的时间序列难以合并成一张图/表，人肉搬运成本高；
2. **日报死板**：日报由数据供应商撰写，不按用户关注点与用户自己的分析逻辑呈现，缺少交易与基本面指引；
3. **框架不可迭代**：如油品全球平衡表这类"活框架"，在数据源分散、信息碎片化、变化频繁的市场下缺乏持续迭代的实操性，自动化工具无法保证信息可追踪与变化分析；
4. **专题研究低效**：写报告只能手工过一遍手头工具与内容，无自动化工具。

**目标**：做一个给期货交易者用的桌面软件——用户安装后指定文档目录授权读取，程序将文档与 agent 生成的知识沉淀为**本地知识库**；用户自选数据源接入；agent 每天产出**个性化可视化图表 + 日报**，越用越懂用户（记忆自迭代）。

## 2. 产品定位与核心循环

- **用户**：其他期货交易者（非自用）；下载安装，数据与知识库留在用户本机
- **核心循环**：用户文档 + 自选数据源 → 统一数据层 + 本地知识库/记忆 → pi agent → 每日图表 + 日报
- **v1 垂直**：油品（柴油/LPG 等能源品种）；底座围绕三大品种无关模块：**供需、物流、期货市场交易数据**
- **模板策略**：v1 图表与日报用固定模板；后续开放图表属性与日报内容自定义

## 3. 决策记录（含取舍）

| 编号 | 决策 | 备选 | 取舍理由 |
|---|---|---|---|
| D-001 | 产品形态：桌面应用 | Web SaaS / 用户自部署 | "本地知识库"语义 + 用户自带数据源合规；不承担服务器存储责任 |
| D-002 | Python 后端核心 + Web 前端 | TS/Node 全栈 | 期货数据源生态（akshare/tushare 等）压倒性在 Python；可视化归 JS 图表库 |
| D-003 | AI 底座 pi 经 RPC 驱动（`pi --mode rpc`） | in-process SDK（限 TS） | RPC 语言无关，Python 侧可驱动完整 agent；工具经 MCP 暴露 |
| D-004 | 渲染层 ECharts | Plotly | K 线一等公民；option 声明式同时服务 agent 生成与用户自定义；大数据性能；geo 支持物流图。FTK 238 行实现重写代价小，规范资产照搬 |
| D-005 | 数据底座：声明式适配器 + 描述符派生 ID + 溯源对齐层 | 沿用 FTEngine 手动注册表 | 手动维护不可扩展；agent 按需取数需要 fetch 模式分层；对齐/追踪是一等需求 |
| D-006 | 存储：DuckDB + SQLite，每用户独立数据目录 | 服务端数据库 | 本地优先、嵌入式、可直读用户 CSV/Excel |
| D-007 | 桌面外壳：Electron | Tauri / pywebview | 打包/更新/托盘/授权生态最成熟；Python 以子进程 sidecar 随包分发 |
| D-008 | 前端框架：Vue 3 + Vite + TS | React | 中文生态、心智负担低；图表密集场景够用 |
| D-009 | 知识库多层存储与检索：LanceDB + bge-m3 + bge-reranker-v2-m3 + DuckDB FTS + DuckDB/Parquet，MinerU 解析 + PaddleOCR | sqlite-vec / bge-small-zh（原推荐） | embedding 只找文本，数字表格走 SQL；详见 architecture.md §4 |
| D-010 | 后端框架：FastAPI | — | localhost 标准答案，低风险 |
| D-011 | UI 视觉体系与交互形态：暗色玻璃 + 工作台焦点带 + 底部抽屉对话（时间线 CoT）+ 模块角标 + 红涨绿跌（行情专属）+ 模块库固定栅格 | 亮色纸底 / 其他对话形态 | 产品视觉工作流逐项确认；详见 ADR 与 designUI.md |
| D-012 | data-layer v1 范围收窄与数据语义（十二项裁定：描述符身份（含可选 contract）/供方竞争基础版/调度器收窄/asof 语义/幂等/MCP 进程内 HTTP/单写者/枚举封闭/diff 可比条件/择优与状态关系/MCP 生命周期与只读路由等） | 沿用 architecture 完整设计 | 双审多轮修订产物；详见 ADR |
| D-013 | data-layer 内置库存收敛到交易所仓单口径（东财“库存”与仓单同口径且 FU 停更、BU 漏厂库；商业库存不在内置范围，经用户数据源接入） | 保留东财/仅改 FU/引入付费源 | 在线冒烟实测；详见 ADR |

§9 待确认事项已全部确认（2026-10-26），保留作记录。

## 4. 文档体系规划

原则：**单一作者、机读优先、决策留痕**（继承 FTEngine 的教训与优点）。

```
docs/
├── plan.md            # 本文档：总方案与路线图（唯一"当前状态"入口）
├── architecture.md    # 产品架构：分层、数据底座、知识层、agent 集成、报告管线、授权
├── designUI.md        # 全局设计理念：配色、图表系统、chart-spec、组件、日报设计
├── decisions/         # ADR：YYYYMMDD-<slug>.md，编号 D-XXX；先登记再实现
├── data/              # （后续）数据模型、序列规范、适配器 SDK 规范、溯源对齐规格
├── agent/             # （后续）pi 集成细节、工具清单、记忆模块设计、prompt 约定
└── business/          # （后续）收费框架、授权协议、分发与更新、隐私合规
specs/<feature>/       # 功能规格目录：每功能一份 spec/plan/tasks/review（唯一实施入口）
templates/             # spec-driven 工作流模板（spec/plan/tasks/checklist/review 的模板权威）
design/                # FTEngine 移植的规范资产（charts/、ui/，逐份搬运、保留原文编号）
```

文档纪律：

- 每份规范只有一个权威作者位置；README 只导航不复制数值（防双份漂移）
- 所有"为什么"写进 ADR 或规范条目，不散落在会话里
- 方案变更先改 docs 再改代码；实现与 docs 冲突以 docs 为准
- **功能开发一律走 spec-driven 工作流**（AGENTS.md §2）：Constitution → Spec → Clarify → Plan → Checklist → Tasks → Analyze → Implement → Converge → Review → Handoff；规格与实施产物在 `specs/<feature>/`

## 5. 目录结构规划

```
Futures-AI/
├── AGENTS.md           # agent 工作手册（本仓库上下文入口）
├── README.md           # 项目简介（人读）
├── docs/               # 设计文档（见 §4）
├── specs/              # 功能规格目录（每 feature 一份：spec/plan/tasks/review）
├── templates/          # spec-driven 工作流模板
├── design/             # FTEngine 规范资产移植区（charts/、ui/）
├── shell/              # 桌面外壳：主进程、托盘、通知、更新、打包配置
├── frontend/           # Web 前端：Vue 3 + Vite + TS + ECharts
├── backend/            # Python 核心（FastAPI，localhost）
│   ├── api/            #   对外 API 层（前端与外壳调用）
│   ├── data/           #   统一数据层：adapters/、catalog/、provenance/、fetch/、align/
│   ├── knowledge/      #   知识库与记忆：ingest/、index/、memory/
│   ├── agent/          #   pi 集成：rpc 驱动、mcp server、工具定义
│   ├── report/         #   图表与日报：templates/、bindings/、pipeline/
│   └── license/        #   授权与收费：feature flags、激活、校验
├── packaging/          # 打包、签名、自动更新脚本
└── tests/              # 测试（隔离 fixture，不接触真实私有数据）
```

代码内各目录配 README（职责/入口/验证），规则同文档纪律。

## 6. 架构总览

五层：**Shell（桌面外壳）→ Frontend（Web 前端）→ Backend（Python 核心）→ Storage（DuckDB/SQLite + 用户数据目录）**，
外加两个横向存在：**pi agent 子进程**（Backend 经 RPC 驱动，工具经本地 MCP server 暴露）与 **license 模块**。
各层职责、组件与数据流见 `architecture.md`。

## 7. 扩展性设计

### 7.1 app 端拓展

- Backend 设计为 headless 核心（localhost API，前后端严格边界），外壳可替换：桌面 v1；后续移动端/远程只读通道（同核心起服务）、CLI 均可低成本接入
- 前端组件与图表渲染不依赖外壳专属 API
- 品种扩展：数据适配器 + 品种配置包（模板/口径/页面）插件化加载，底座不动

### 7.2 模型接口对接

- **agent 主路径**：pi 自带模型体系（内置 providers + `models.json` 自定义兼容端点）。用户自填 API key（DeepSeek/GLM/Qwen/OpenAI/Anthropic 等），设置界面写入 pi 配置；token 成本由用户承担
- **非 agent 用途**（嵌入/精排/解析）：全部本地——bge-m3 + bge-reranker-v2-m3 + MinerU/OCR（见 D-009），隐私与零 token 成本；API 嵌入仅作备选
- **后续**：官方订阅档位含内置模型额度（经我方计费网关），与收费框架联动

### 7.3 数据源接口对接

- **适配器 manifest 规范**（草案，落地时入 docs/data/）：声明可产出序列（描述符）、源符号映射、取数模式（批量/按需/实时）、更新语义（时滞/修订）、凭证要求
- v1 内置适配器：akshare（免费行情/基本面）、EIA（能源公开数据）、本地文件（CSV/Excel 自动识别）
- 第三方适配器：用户安装适配器包 → 程序扫描 manifest → 自动进目录
- 凭证存用户本地目录，绝不外发；软件不转售行情（合规底线）
- agent 工具：`search_series` / `fetch_series` / `list_sources` / `reconcile`

### 7.4 收费框架

- **模式**：桌面软件 + 激活码（买断或订阅，最终形态待定但架构预留）
- **分层草案**：基础版（内置免费数据源、固定模板图表与日报）/ 专业版（图表与日报自定义、记忆全功能、更多适配器）/ 机构版（多品种、高级对齐与对账）
- **技术**：签名 license 文件（本地）+ 周期在线校验 + 离线宽限期；**feature flags 从第一天贯穿**（功能矩阵随 tier 切换）
- **合规**：用户自带数据源凭证；不代购、不转售行情数据
- **与模型计费联动**：内置模型额度按 tier 计量（后续）

## 8. 路线图

| 阶段 | 内容 |
|---|---|
| **Phase 0（当前）** | 文档体系与仓库骨架：AGENTS.md、docs 三件套、ADR 流程、spec-driven 工作流与模板（templates/、specs/）；§9 待确认决策冻结 |
| **Phase 1 油品 MVP** | 数据层骨架（适配器框架 + akshare/EIA/本地文件三适配器）、序列目录与溯源、ECharts 模板库 v1（固定模板）、日报管线 v1（固定模板）、pi 集成（RPC + 基础工具）、知识库 v1（文档摄取+检索）、桌面外壳、本地打包 |
| **Phase 2 个性化与自迭代** | 记忆模块增强（用户关注/逻辑学习）、图表属性自定义、日报内容自定义、对齐与对账报告、更多适配器 |
| **Phase 3 商业化** | 授权体系、tier 功能开关、自动更新、公测/发布 |
| **Phase 4 扩展** | 更多品种插件、移动端读取通道、第三方适配器生态 |

## 9. 待确认决策

已全部确认（2026-10-26）：桌面外壳 Electron（D-007）、前端 Vue 3（D-008）、知识库与嵌入栈（D-009）、后端 FastAPI（D-010）。
后续新决策一律走 ADR（docs/decisions/）。

## 10. 风险与约束

- **数据源合规**：软件不转售行情；适配器只做"用户自带凭证的通道"，来源稳定性风险由适配器层隔离
- **Windows 打包与签名**：代码签名证书成本；自动更新通道需稳定
- **本地模型体积与性能**：MinerU/嵌入/精排随包分发使安装包 GB 级；CPU 解析吞吐有限，批量解析走夜间调度（D-009）
- **pi 版本策略**：随包锁定 pi 版本，升级走正式发布流程
- **激活/换机**：无账号体系，激活码换机流程与防滥用需要产品化设计
- **垂直深度 vs 通用底座**：油品做深的同时保持底座干净，避免品种逻辑渗入底座（用插件边界守护）
