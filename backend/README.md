# backend — Futures-AI 统一数据层（data-layer feature）

实现依据：`../specs/data-layer/spec.md`（what/why + 36 条验收规则）与 `../specs/data-layer/plan.md`（实现机制与契约细则）。

## 职责

| 模块 | 职责 |
|---|---|
| `data/catalog/` | 描述符与 ID、别名、目录编译（registry）、SQLite 目录库 |
| `data/store/` | DuckDB 观测存储、择优解析、溯源与 diff |
| `data/fetch/` | 按需取数、任务注册表 |
| `data/adapters/` | 内置适配器（akshare/EIA/local-file）+ 基类 |
| `data/align.py` | 对账与主源派生 |
| `data/creds.py` | DPAPI 凭证（fail closed） |
| `data/lock.py` | 用户数据目录布局与单写者写锁 |
| `data/service.py` | 对外门面（CLI/MCP 共用） |
| `data/mcp_server.py` | MCP 四工具 + 内部只读通道 |
| `data/cli.py` | CLI 全子命令 |

## 入口

- CLI：`python -m data.cli <子命令>`（config/fetch/list/jobs/reconcile/import/provenance/diff/serve）
- MCP：`futureai-data serve`（streamable HTTP，localhost）

## 验证

```bash
python -m pytest tests/ -q
```
