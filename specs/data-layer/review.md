# Feature: data-layer 评审记录（review.md）

> Handoff 材料。Review 由第三方 agent（独立会话、与实施隔离）参考 spec + plan + tasks + 实际代码差异执行，
> 按 bug、架构风险、测试缺口、目标是否对齐评审。审核员：A = claude-fable-5-1（第十二轮起接替 deepseek-flash），
> B = gpt-6.1-sol；共识规则：两审一致通过才算通过。
> Gate 2：待 Walter 确认评审结论。

## 完成项

- spec 36 条 AC 全部实现并有测试断言；全量 222 tests 全绿（`python -m pytest tests/ -q`）
- 独立评审驱动的 Converge 修复全部落库（tasks.md T-21~T-53）：
  - 第一~十二轮（B 主审）：F-01~F-15、R2~R11 各项（并发串线、锁生命周期、鉴权、幂等与批次终态、原始载荷哈希、状态机与主源派生、包数据等）
  - 第十二轮（A 首审，5 项 P2）：只读命令空目录首启、配置入口存在性校验、凭证/未绑定错误分类、用户清单执行绑定（`implementation`）+ 库存日报 + 指定合约全链路、单源启停入口（T-34~T-46）
  - 第十三轮（A/B 双审，2 项 P2）：eia 无凭证引用分支被局部导入遮蔽、不存在序列的错误码；连同取数排队隔离、上游硬超时、真实 SDK 边界回归与按 AC 的测试缺口（T-47~T-53）
- 关键修复均做变异验证：注入旧行为后对应测试必失败（第十二、十三轮修复共 19 个变异全部被检出）
- 真实进程验收：serve 子进程端到端（MCP 握手/工具调用、CLI 只读经 HTTP、写命令被拒、强杀后陈旧锁回收）与真实 CTRL_BREAK 优雅退出（端点文件与写锁清理）均纳入回归

## 未完成项

- 在线冒烟（真实 akshare/EIA 网络）：离线固定样本与 SDK HTTP 边界注入通过；真实网络未验收（依赖外部服务，纳入发布管线 CI）
- 内置覆盖边界：PG 仓单/库存源侧单位为“手”，不在 v1 单位封闭枚举内，v1 不内置（新增单位须修订 spec）；其余品种/合约经用户清单绑定 akshare 可达（plan §2.1）
- 用户目录第三方代码实现（加载用户 Python 适配器）属 Phase 4 非目标；v1 用户清单只能复用内置实现
- wheel 实测安装（package-data 已声明）留发布管线

## 风险

- **上游 SDK 漂移**：akshare/EIA 以注入点与 HTTP 边界样本隔离，版本锁定；上游签名或字段变化需回归。akshare 内部请求无超时，已由适配器硬超时（300s）兜底，被放弃的挂起线程会存活到请求自行结束
- **单写者固有限制**：非 serve 写命令（fetch/import/config）执行期间只读命令返回“写进程运行中，请稍后重试”（DuckDB 单写者）
- **凭证显式传参（风险接受项，待 Gate 2 确认）**：`config credentials <name> <secret>` 仍允许脚本化显式传入，可能留在 shell 历史/进程参数；推荐省略 secret 走不回显交互输入（CLI 帮助已提示）
- **mcp SDK 版本**：锁定 `mcp>=1.2,<2`（FastMCP API）；升级需迁移评审
- **多进程边界**：锁/只读路由的已知竞态已覆盖（陈旧锁、拒绝访问、删除失败、DuckDB 文件占用）；生产以真实子进程回归守护

## 下一步任务

1. 第十四轮双审复核（T-47~T-53 闭环确认）→ 共识通过后 Gate 2
2. Gate 2 人工确认（含上列风险接受项）→ Handoff：PR + merge 到 main
3. 后续 feature：daily-report（调度器随其引入）、desktop-shell（serve 托管、设置 GUI）
4. 发布管线：wheel 实测、在线冒烟纳入 CI

## 验收证据

- 测试命令输出摘要：`cd backend && python -m pytest tests/ -q` → **222 passed**（0 warnings，2026-10-27）
- Converge 报告结论：tasks.md T-01~T-53 全部 ✅，各追加任务的验证命令逐条可执行并选中测试；36 条 AC 均有断言落点（plan §5）
- 独立评审记录：第十二轮 A 未通过（5 P2）→ 修复；第十三轮 A/B 均未通过（共 2 P2）→ 修复；第十四轮结论见本节更新
- Gate 2 确认记录：待 Walter 确认
