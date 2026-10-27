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

- CLI：`python -m data.cli [--root <数据目录>] <子命令>`（默认数据目录 `%LOCALAPPDATA%/FuturesAI`）
- MCP：`futureai-data serve [--port 8932]`（streamable HTTP，仅 127.0.0.1；端口与令牌写入 `data/mcp_endpoint.json`，正常退出时删除）

| 子命令 | 用途 |
|---|---|
| `list series\|sources\|jobs` / `reconcile <id>` / `provenance <id>` / `diff <a> <b>` | 只读；serve 运行中自动经内部 HTTP 通道查询；空目录首启不建库 |
| `fetch <id> [--start] [--end] [--source]` | 即时取数入库 |
| `config enable\|disable <source_id>` | 单源启停（持久化） |
| `config priority <series_id> <source_id> <n>` / `config alias <symbol> <source_id> <series_id>` | 手动覆盖优先级 / 手动别名（只接受已有清单的源与存在的序列） |
| `config credentials <name> [secret]` | 加密保存凭证；省略 secret 时不回显交互输入 |
| `config add-source <id> [--implementation akshare\|eia\|local-file]` | 在用户适配器目录生成清单骨架 |
| `jobs register <name> <source_id> <series_id>` / `jobs run <name>` | 任务注册表（手动触发） |
| `import <file> [--series <id>] [--source <id>]` | CSV/Excel 向导导入（目标 = local-file 绑定源） |

## 用户清单（复用内置实现）

用户适配器目录（`<数据目录>/adapters/<id>/manifest.yaml`）中的清单以 `implementation` 复用内置取数实现（v1 不加载用户代码），例如跟踪 SC2401 指定合约日线：

```yaml
id: sc-contracts
name: SC 指定合约
version: 1
credentials: none
implementation: akshare
provides:
  - descriptor: {asset: sc, geo: cn, measure: close, contract: SC2401}
    symbols: ["SC2401"]
    unit: cny_bbl
    freq: 1d
    tz: Asia/Shanghai
    fetch: {modes: [on_demand], history_days: 3650}
    update: {lag_min: 0, revises: true}
```

akshare 源符号约定：`SC0` 主力连续、`SC2401` 指定合约、`SC_RECEIPT` 仓单日报、`FU_STOCK` 库存日报（仓单/库存按品种原始口径折算：SC 桶→kb，FU/BU/LU 吨→kton，PG 手×20 吨→kton）（字段契约见 `../specs/data-layer/plan.md` §2.1）。清单校验失败的原因可在 `list sources` 的 `reason` 字段查看。

## 验证

```bash
pip install -e . -c constraints.txt   # 受测版本约束（pyproject 仅声明兼容下界）
python -m pytest tests/ -q
```
