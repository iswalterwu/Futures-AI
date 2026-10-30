# 独立审核 A：D-026 文档的 main 兼容适配（固定候选 `65ef2fa`）

**审核员** A = `claude-fable-5-1 via anthropic`（本任务已有官方最小探活成功；bridge 同窗已耗尽，未重试）。新会话、只读 detached Temp worktree `main-review-tree`，无写入 / 安装 / Git 变更。
**BASE** `072bb12de3425e1b76357b5771e47f0609b32979` · **HEAD** `65ef2faa83a156e0e45fda4f826deeeb3d7b9c74`（已确认）· **SOURCE** `c2e82e6`（R2 对象 `03a1bfe`、证据 `461a703`）。

## 实际执行的命令
- `git rev-parse HEAD` / `git status` / `git log` / `git diff --stat|--name-status 072bb12..HEAD`：恰为 18 个白名单文件，无其他改动；specs/源码/锁/配置/design 与 BASE 一致。
- 临时 Python（标准库）：BASE §6 模型表 + 8 条规则去 `<a id>` 锚点后与 model-routing 节**整段逐字相等**（强于 helper 的子串检查）；§5 七条工程准则逐字相等；HEAD 与 SOURCE 逐文件比对（workflow / model-routing / D-025 / D-026 / R1 / R2 / templates×3 逐字节一致；AGENTS 仅差“改某代码目录”一行）；`git diff c2e82e6 HEAD` 查看其余 4 个派生文件；171 个活跃相对链接 / 片段全部在本快照可达（忽略围栏）；存档围栏块 == `git show 072bb12:HANDOFF.md`，25,888 字节，SHA256 `ba06a469…cf9e9` 与所记一致；两份 SOURCE 记录的 blob / SHA256 / 字节数核实无误。
- 复跑 `verify_main.py <本工作树>`：20/20 通过（根 AGENTS 8,022 LF 字节）。审计其假设：规则检查为“子串存在”而非整段相等（我已补做整段比对）；不检查 workflow 步骤语义、HANDOFF / plan §3 §4 §9 的措辞——这些由本审核人工覆盖。
- 读取 `main-frontend-check.txt`（check 六项通过、contract 12 methods main 口径）与 `main-docs-tests.txt`（vitest 2 文件 192/192，12:25:44，1.37s），与记录 §9 一致；未自称重跑。
- `git ls-files --eol`：所有改动文件 index 为 LF，工作树 CRLF 为 `core.autocrlf=true` 所致，非内容问题。

## 语义核对结论
- 工作流 1–11 步、Gate 1/2、spec 冻结、变更规则、Checklist 受保护、Review P1/P2 判定、Handoff PR/merge 纪律均与 BASE §2 语义一致，并在根 AGENTS §2 持续可见；无预算 / 自主度 / 循环上限 / 新旁路。
- 回退触发、A 独立性、审核只读、规则 7 串行同样有效（R1 P2-1 补修）、D-025 工作约定与 SOURCE 一致。
- AGENTS §1“改某代码目录”新增回退说明：只**增加**阅读义务（无 README 时读 spec + architecture），不让既有规则可选、不虚构目录、明示“plan §5 规划 ≠ 已实现”；其余触发表与“拿不准扩大阅读”、D-026 输入版本 / 可见性策略原文完整。
- HANDOFF 为当前治理入口，不含 WIP 进度；§8/§10 保留旧编号指针，旧批准（PR #9、九项 P3 未修）、风险保留。workspace-consolidation 落地页明确“不是原执行日志”，无伪造证据。D-025/D-026/R1/R2 未改动；D-026 ADR“影响”全量落地被记录 §3.2 明确限定为子集；P3-A 仍“已接受、未修复”。plan §1/2/6/7/8/10 不变，§9 原地保留并标历史，未移植 workbench 索引化；路由权威仅 model-routing 一份。授权原话、基线、通道记录与 SOURCE 记录一致；A 复核 / PR / merge 均标“待进行”。

## 发现
- **P3-1** `docs/README.md:12`（§1 行）“数据层字段契约…见其 §3.1”；实际 `specs/data-layer/plan.md` §3.1 是 SQLite，字段契约在 §2.1（同文件 §4 行写对）。继承自 SOURCE，但本次使其成为 main 活链接。影响：定位错节。修：改为 §2.1。
- **P3-2** 本地分支 `docs/agent-navigation-main` 与 Temp worktree `main-delivery` 为交付用临时资源，记录 §1 已标“用后回收”；影响：若 merge 后不清理即违反 D-025。修：PR 合并后删除并在记录登记。
- 备注（非发现）：`templates/checklist.md` 头部不再直述“与实施不同模型”，改为链接 model-routing 规则 3；与 SOURCE 一致、属已批准语义，根 §6 与 workflow 第 5 步仍显式写明。

## 分类
**已批准语义保留**：18 文件中 11 个与 SOURCE 逐字节一致；AGENTS / docs/README / HANDOFF / plan / 两份维护页仅做路径、目录缺失回退、历史放置与分支投影，未发现新规则、新模型、新 Gate、阅读义务放松或范围扩大。**无需用户重新确认的实质性新语义。**

**结论：通过（0 P1、0 P2、2 P3）。** 本结论仅限此 main 兼容文档适配，不是任何产品 feature 的 Gate，不代表 PR / merge 已完成。