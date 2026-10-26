# D-009 知识库与嵌入：多层存储与检索

- 日期：2026-10-26
- 状态：accepted
- 取代：plan.md §9 原推荐（sqlite-vec / bge-small-zh）

## 背景

本地知识库靠"一个嵌入模型 + 一个向量库"无法覆盖期货文档全类型（长文 / 表格 / 时序 / 元数据）。
关键原则：**embedding 只负责"找文本"，数字和表格交给 SQL**。

## 结论：分层存储与检索

| 数据类型 | 例子 | 存储 | 检索方式 |
|---|---|---|---|
| 非结构化长文 | PDF 研报、新闻、交易所公告 | Markdown/JSON + 原文页坐标 | 切块（带上下文）→ bge-m3 向量 + BM25 混合检索 |
| 表格 | Excel、PDF 表格、仓单日报 | 规范化 Parquet / DuckDB 表 | SQL（必要时文本转查询）+ 表卡 |
| 时间序列/大数据集 | 行情、期限结构、持仓、库存 | Parquet + DuckDB | `get_series()` / SQL |
| 元数据 | 目录、来源、日期、品种、版本 | DuckDB catalog | 检索前过滤 |

选型（个人电脑）：

| 组件 | 首选 | 备选 | 理由 |
|---|---|---|---|
| PDF 解析 | MinerU | Docling / Marker | 中文双栏、表格、公式强；纯文本层用 PyMuPDF |
| OCR | PaddleOCR / RapidOCR | — | 扫描版公告、图片表格 |
| 嵌入 | bge-m3（1024 维、8192 token、dense+sparse） | Qwen3-Embedding-0.6B | 中英混合 + 长文档 + 稀疏检索一步到位 |
| 精排 | bge-reranker-v2-m3 | Qwen3-Reranker-0.6B | 召回 50 → 精排 8，质量提升明显 |
| 向量库 | LanceDB（嵌入式、无服务） | Qdrant 本地 docker | 个人机最省心，百万级 chunk 无压力 |
| 关键词 | **DuckDB FTS（BM25）** | Tantivy | 期货合约代码（CU2411 等）必须靠关键词；DuckDB FTS 零额外依赖（本 ADR 对原表的调整：Tantivy 降为备选） |
| 结构化 | DuckDB + Parquet | SQLite | 本地分析型查询最快，零部署 |

## 检索管线

dense + BM25 各召回 30–50 → RRF 融合 → 元数据过滤（品种/日期/来源）→ reranker 精排 → top 8。

## 工程约定

1. **切块带上下文**：每块拼上"报告标题 + 发布日期 + 品种 + 章节 + 页码"（contextual retrieval，研报召回提升大、零成本）
2. **表卡路线**：每张表生成表卡（表名、列名、单位、日期范围、几行样例）并只嵌表卡；agent 先检索表卡，拿 table_id 再 SQL 查明细，不让模型直读原始表格
3. **引用到页**：chunk 保存 doc_id + page + section + 原文哈希，报告每个结论可点回 PDF 原页
4. **增量与版本**：文件 hash + mtime 判断变更；catalog 记录解析器/嵌入模型/切块参数版本；任一变更即全量重建对应索引
5. **期货元数据**：品种、交易所（SHFE/INE/DCE/CZCE/CME/LME）、合约月份、报告类型（日报/周报/月报/交易所公告/仓单日报）、发布日 vs 数据日（两者常不同）、主力连续 vs 单合约
6. **容量**：30 份 × 30 页 ≈ 900 页/天 ≈ 2000–3500 chunk/天；一年约 100 万 chunk、向量 5–8GB；瓶颈在解析/OCR，夜间批处理；PDF 原件约 100GB/年放 NAS

## 待确认

- **解析管线分级**：MinerU 底层为 PyTorch 版面检测模型，CPU 吞吐不现实（单页 10–60s）且安装包 +5GB 级。
  建议按 tier/硬件分级：基础版 = PyMuPDF 文本层 + 规则表格提取 + RapidOCR 兜底；专业版/有 GPU = MinerU 全量。待 Walter 确认。

## 影响

- `backend/knowledge/` 技术栈与摄取管线
- 安装包体积与分发策略
- 与授权 tier 联动（解析质量可作为功能开关）
