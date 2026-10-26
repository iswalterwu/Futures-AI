# D-012 data-layer v1 范围收窄与数据语义裁定

- 日期：2026-10-26
- 状态：accepted
- 背景：data-layer spec 六轮双审修订中产生的 v1 范围与语义裁定，集中登记于此（替代分散在 feature 文档中的注记）

## 裁定内容

1. **序列身份 = 3 键 {asset, geo, measure}**；unit/freq/tz 为序列元数据（不参与身份），manifest 声明为唯一权威，series 表派生缓存取主源值
2. **供方竞争 v1 基础版**：唯一全序 = 优先级数值小者胜 → asof 新者胜 → ingest_run（DuckDB 自增 BIGINT）大者胜；手动覆盖 = 替换该 source 优先级值、参与同一决胜链（无独立绝对覆盖）；FTEngine 五层分类留待平衡表 feature
3. **调度器 v1 收窄**：任务注册表 + 手动触发，不引 APScheduler（随 daily-report feature 引入）
4. **asof = 批次成功提交时刻（finished_at）**；历史择优使用当前配置（配置版本化留 Phase 2，不承诺）
5. **幂等 = (series_id, ts, source, ingest_run) 唯一索引冲突忽略**；追加写永不删行
6. **ingest_runs 置于 DuckDB**（与 observations 同文件单事务，保证失败原子性）；SQLite 仅目录
7. **MCP = streamable HTTP，Backend 进程内提供**（单写者）；pi 经 mcp.json URL 连接
8. **单写者**：数据目录文件锁；CLI 写操作遇锁报错；MCP 进程内连接互斥串行化
9. **枚举封闭**：manifest 枚举为封闭清单，新增值须先修订 spec（过 Gate），禁止运行时注册
10. **diff 可比条件**：两 run 均 succeeded、同 series、同 source、同覆盖范围、同 unit/freq/tz 快照

## 影响

- `docs/architecture.md` §3 相关注记
- `specs/data-layer/` spec/plan 的裁决登记（Q-005~Q-026）
