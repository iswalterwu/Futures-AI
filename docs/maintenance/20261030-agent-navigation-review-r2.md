# A R2 定向复核：D-026 导航改造补修（只读）

**审核员**：A = `claude-fable-5-1 via anthropic`（同窗口 bridge 已有 quota/rate 失败记录，本会话未重探、未换模型/配置）。新会话、隔离 Temp worktree `review-tree-r2`，`git status --porcelain` 空，未写任何仓库文件。
**固定对象**：HEAD = `03a1bfe3cdf5dd989b10b3f1c82b34f388b66673`（已核实）；增量 `8b880c7..03a1bfe`（单提交，6 个 Markdown，+80/−8）；整体基线 `c93d4ba`。
**输入**：根 AGENTS.md（上下文）、model-routing.md 全文 @HEAD、增量 diff 全部 6 文件、checklist-v2.md 页首/tasks.md v2 段定向 grep、ADR 结论段、workflow 第 5 步 + `#isolation`、D-025 ADR 结论 1–3、Temp 两份 stdout。
**实际命令**：`git rev-parse/status/log/diff(--stat|--check)`、`git cat-file -t 34ee795 e596244`、`git diff --name-only c93d4ba..HEAD -- specs/ | grep -v README`（空）、`python verify_docnav.py <worktree>`（19/19 PASS，279 链接可达，仅 Markdown 变更，模型表与八条规则逐字、七条准则逐字、历史快照校验和一致）、`cat`/`grep` Temp 输出。**未**安装依赖、未运行 pnpm/vitest。

## R1 发现逐项核对

| 发现 | 状态 | 依据 |
|---|---|---|
| P2-1 规则 7 整体限并行 | **关闭** | model-routing.md:41–43 改为：独立 worktree/分支与共享文件串行合并条款限“确需并行写入”；所有权、任务范围、基线提交、审核只读审查固定提交与真实 diff、除勾选 checklist 外不替实施者改代码“串行工作时同样有效”。与 D-025 ADR 结论 1–3（仅临时 worktree 限并行，独立审核/固定提交不取消）一致；原模型表与 8 条规则经 verifier 逐字核验未变 |
| P3-1 FW 多“当前有效” | **关闭**（见新 P3-A） | README §2 明示 R4、`34ee795`（commit 实存，"record clean G-02 Analyze R9"）、`e596244`（commit 实存，"approve G-02 … S0 gate on 34ee795"）；checklist-v2.md:20 已有“R4 后为历史”、:22 R4 限定放行 S0、S1/S2 blocked；基线以来 specs/ 下非 README 文件零改动 |
| P3-2 无 README 导航 | **关闭** | workflow.md:75 “有则由其定位；没有则直接读 checklist 与审核记录，不要求补建”；specs/data-layer、settings 确无 README，不受影响 |
| P3-3 测试证据 | **关闭** | 维护记录 §7 新增执行会话（Sol via openai、session id、11:41）；Temp `frontend-check.txt`（317B）/`docs-tests.txt`（201B）mtime 11:41，内容与记录摘录逐行一致：六项 guard passed、`Tests 192 passed (192)`、Duration 1.18s；无凭证/鉴权文本。**我只核对了留存 stdout 与记录一致，未复跑；退出码 0 为记录声称，stdout 文件本身不含退出码** |
| P3-4 纯 docs 先例未登记 | **关闭** | ADR 结论 9 + 维护记录 §3.3 规则 4 行登记；基线 plan.md:224 确有“纯 docs 任务，无 feature 目录”先例；两处均明写“不改变模型/通道/回退策略，不为功能开发提供免走 specs/Gate 的豁免”，边界受限且与“不变的内容”段一致 |

## 保全核对

- R1 报告 `review-r1.md` 为本提交新增文件（8b880c7 中不存在），内容为 fable 的 R1 全文（1 P2、4 P3，结论未通过），与本人 R1 范围/结论一致；无法与仓外原稿字节比对，仅确认未被改写成“通过”。
- 增量 diff 其余变更仅：维护记录状态行、路由表两行、§7 补修表与证据段；无其他语义改动；`git diff --check` 干净；治理范围仍仅 Markdown。

## 新发现

- **P3-A** `specs/frontend-workbench/README.md:16`：写“登记见 tasks.md v2 段 §1.1‘S0 开工登记’”，但“S0 开工登记”注记位于 v2 段首（tasks.md:459，§1 标题在 :476 之后），§1.1 的正式登记行是 :492 表格“A 对 Tasks…产物 SHA”格。两处 SHA 一致，读者仍可定位，仅节号不精确；建议改为“v2 段首‘S0 开工登记’与 §1.1 A 产物 SHA 行”。不阻断。
- 观察（不计级）：workflow.md `#isolation` 标题“隔离与并行写入”仍把“审核会话只读”列在并行语境句内，但已指向规则 7 单一权威，而规则 7 末节现已明确串行适用，无矛盾。

## 结论

**通过**（0 P1、0 P2、1 P3）。R1 P2-1 及 P3-1～P3-4 全部关闭；新 P3-A 可作后续。本结论限纯文档/治理维护的 A 复核，**Gate 2 仍待用户确认**，不授权 push/PR/merge，不改变任何既有 feature（含 frontend-workbench S1/S2）的 Gate、阻塞或交接状态。