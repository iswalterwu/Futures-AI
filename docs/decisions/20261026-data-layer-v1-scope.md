# D-012 data-layer v1 范围收窄与数据语义裁定

- 日期：2026-10-26
- 状态：accepted
- 背景：data-layer spec 六轮双审修订中产生的 v1 范围与语义裁定，集中登记于此

## 备选方案

- 沿用 architecture §3.3/§3.5 的完整设计（FTEngine 五层供方竞争、APScheduler 调度、stdio MCP）
- 按本 ADR 收窄为 v1 基础版

## 结论（裁定内容）

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
11. **择优候选与状态关系**：择优候选 = 全部源的观测行（历史可见性不因源状态改变）；status 只影响配置角色（主源/默认拉取源/展示口径）；全源非 ok → 派生缓存沿用末次值 + 对账 warning，source=None 拉取返回 not_found
12. **MCP 生命周期**：v1 启动入口 = CLI `serve`（service.start_mcp()）；desktop-shell 阶段由 Backend 进程托管；只读查询以 DuckDB read_only 连接旁路写锁

## 取舍理由

- 五层供方竞争依赖多年磨合的复杂规则与数据质量经验，v1 无平衡表业务做校验对象，基础版足够且可回退
- 调度器在无日报/任务编排需求时是负担；注册表 + 手动触发满足 v1 与测试需要
- stdio MCP 需要独立进程，破坏 DuckDB 单写者；进程内 HTTP 是单写者模型下的唯一稳妥选择
- asof=提交时刻、择优用当前配置：以最小复杂度保证确定性，历史配置版本化是明确的 Phase 2 范围
- 封闭枚举：运行时注册使非法值集合恒空、验收不可证伪；走 spec 修订流程成本可接受

## 影响

- `docs/architecture.md` §3 相关注记
- `specs/data-layer/` spec/plan 的裁决登记（Q-005~Q-026）
