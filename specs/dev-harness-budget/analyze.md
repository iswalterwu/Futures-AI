# Feature: dev-harness-budget v1 Analyze 报告（analyze.md）

> Analyze 阶段产物（[workflow.md 第 7 步](../../docs/development/workflow.md#step-7)）：只读报告 spec / plan / tasks 之间的冲突、差距与模糊处。
> 本报告**不修复**任何输入，不勾选 / 豁免任何 checklist 项，不授权 Implement；质量判定 ≠ 任务执行 / AC 完成 / Checklist 批准。

- **Analyze R1 = `claude-opus-5-5 via claude-bridge`**（计划类首选模型 + 首选通道）。协调者 23:00（+04:00）对 bridge 做一次最小真实调用重测成功（claude-opus-5-5 / claude-fable-5-1），此前“bridge 耗尽”结论已过时未重测（规则 5 允许窗口重置后重测）；官方通道最近一次探活失败，未使用。此前在该过时前提下派出的 `openai/gpt-6.1-sol` 回退 Analyze 已由协调者在未读结论前作废并移出仓库（路由纠正，规则 2，非质量驱动）；本会话未读取任何既往 Analyze 结论，是唯一有效 Analyze。
- **固定提交**：`325e43b57b890eea30fce0d9e7915214caa3404b`（`D:/2030/Futures-AI`，分支 `workbench`，开始时干净）。本会话唯一写入 = 新建本文件；无 Git 写、无网络、无 agent、无安装，未读真实 `~/.pi/agent/sessions`、actor 日志或试点数据。
- **日期**：2026-10-30。

输入清单：

```
AGENTS.md @ 325e43b（blob ee8e4ab）全文
docs/development/model-routing.md @ 325e43b（blob f980f5c）全文
docs/development/workflow.md @ 325e43b（blob 4aca344）全文（总规则、第 6～8 步、Gate）
templates/tasks.md @ 325e43b（blob 4b7f955）全文
specs/dev-harness-budget/spec.md @ 325e43b（blob 4689093）全文；锚定 ^## 1\. 至文末 SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算，与冻结记录一致）
specs/dev-harness-budget/plan.md @ 325e43b（blob 9afc846，r3）全文（分 3 段读完 §1～§7）
specs/dev-harness-budget/tasks.md @ 325e43b（blob 9e8c9a4）全文
specs/dev-harness-budget/checklist.md @ 325e43b（blob 40b0b87，SHA256 1a667287…）R2 全文
specs/dev-harness-budget/review.md @ 325e43b（blob 35f310e）“Plan r3 与 Tasks 候选”节 + dc5932d..HEAD 差异
真实 diff：git diff dc5932d..HEAD（5 文件：HANDOFF.md、specs/README.md、plan.md、review.md、tasks.md；无代码）
pi 1.4.0 公开安装包（有界、只读，包相对路径）：docs/json.md（f1031918…3543）第 122 行；
  dist/core/agent-session.js（436e8be3…1162）186、470–477、578–640、750–756、778–788、3098–3104、1562–1576 行；
  dist/core/cache-warmer.js（9c4b0009…7fc0）140–155、249 行；dist/core/session-manager.js（046b6a11…）864、880 行（仅签名）
```

## 结论

**NOT PASSED**：1 项 P2、1 项 P3。spec 冻结正文未变；27 条 AC 均有 Plan 与 Tasks 映射；任务依赖无环；退出码与六项度量与 R2 接受版本一致；5 项 P3-R2 的作者修订在 Plan / Tasks 中均有落点（待 A 复核，见矩阵）。但 Plan r3 自己引入的 `entry_appended` 事实更正与冻结 AC 冲突（P2-AN-1），须回 Plan / Tasks 修订后重跑 Analyze。

## 发现

### P2-AN-1 json-events 中 `entry_appended` 携带的已暴露用量被丢弃，却仍可得出“完整总计”与 tokens complete

- **位置**：plan.md §3.2“其他模型操作记录”行（v1 不抽取 `entry_appended`）、§4.2 收尾判据（尾随 `entry_appended` 不使来源 partial）、§4.3 完整总计三条件、§4.7 tokens 行、§3.6 `unobserved_paths`；tasks.md T-03（“不抽取 `entry_appended`”）、T-04、T-07 完成标准 6。
- **事实（本会话有界核实，1.4.0 公开源码）**：`entry_appended` 不只承载 settled 后的 `cache_warm` usage 条目（agent-session.js 186 / cache-warmer.js 249）；扩展在 `turn_end` 与 `agent_before_settle` 边界提交的 **compaction 草稿（含 `usage`）** 经 `_applyBoundaryDrafts` → `appendCompaction(…, fromHook=true, usage)` 写入，并**只**经 `_commitBoundaryDrafts` 以 `entry_appended` 发出（578–640、514、1573），不经 `compaction_end`。Plan §3.2 / §3.6 只披露“cache_warm 与 branch summary”，未披露扩展边界 compaction。
- **具体反例**：单个 json-events 来源：assistant `message_end(stop)` 100/40/10/20 → … → `agent_settled` → `entry_appended{entry:{type:"usage",kind:"cache_warm",usage:{…正数…}}}`。按 Plan：尾随类型合法 → `loaded`；唯一归属记录四维 known；无关系缺口 → 完整总计 = 170、tokens complete、退出 0。但选定文件内存在一条来源**已暴露**、值已知、属于 Plan §3.3 自身计量单位（“usage 条目”）的记录未被计入。同理，settled 之前的扩展边界 compaction 用量也被静默排除。
- **冲突**：spec“已知小计 / 完整总计”术语（完整总计须选定总体内全部记录已知并计入）、AC-003-4（已知小计不冒充完整总计）、AC-005-3（来源**暴露**的压缩等用量“计入并标为已覆盖”，只有来源**未暴露**的才列“未观测”）。把已暴露路径列入 `unobserved_paths` 并同时报完整总计，构成虚假完整。session-v3 读取全部 usage / compaction 条目，不受影响。
- **修复方向（回 Plan → Tasks，二选一，作者定）**：(a) 在 `_read_pi_json_events` 白名单抽取 `entry_appended.entry` 中 `type ∈ {usage, compaction, branch_summary}` 的 id / kind / usage 数值，作为“其他模型操作记录”计入并标“已覆盖”（其余 entry 类型不抽取内容）；或 (b) 不抽取但检测：出现携带 usage 条目或 compaction 的 `entry_appended` 时，完整总计 unknown（如 `entry_appended_usage_not_extracted`）、tokens 不得 complete，`unobserved_paths` 改为如实描述“来源已暴露、v1 未计入”，并补披露扩展边界 compaction。两者都不改退出码定义。Tasks 同步 T-03 / T-04 / T-07 与 F2 / F6 夹具正负例（settled 后 cache_warm、settled 前边界 compaction），并在 Plan §7 记录。是否触及 R2 已接受规则由 A 判断。

### P3-AN-1 T-11 验证命令 10 的 `git grep` 对未跟踪的新文件恒为空，期望“无输出”可空真通过

- **位置**：tasks.md T-11 验证命令 10 / 完成标准 10。
- **说明**：`git grep` 默认只搜已跟踪文件；`backend/tools/dev_harness_budget.py` 在提交前是未跟踪新文件，命令无论内容如何都无输出。若在提交后执行则有效，但任务未写明时机。
- **修复方向**：改为 `git grep --untracked -nE …` 或 `git grep --no-index -nE …`（仓库已有工具，不引入新工具），或写明“在实施提交后执行”。

## 核对结果（本会话实际执行的静态核对；未来测试命令一律未执行，无实现可测）

| 项 | 结果 |
|---|---|
| spec 冻结 | 锚定正文 SHA256 = `a504fed8…e823`；dc5932d..HEAD 未改 spec.md；27 条 AC 均未勾选 |
| 真实 diff 范围 | 仅 5 个 Markdown 文件；`git diff --check dc5932d..HEAD` 退出 0；无代码、无 checklist 改动 |
| AC 映射 | Plan §5 与 tasks 覆盖表各 27 行、编号去重 27；每任务完成标准引用 AC 编号，验证命令逐条对应（T-11 第 8～10 条为回归 / 范围核对，非 AC 断言，合理） |
| 测试名一致 | tasks 中全部 `test_*` ⊆ Plan §5（Plan 额外的 `test_app_packaging` 是既有仓库测试引用）；`-k` 表达式之间无子串碰撞 |
| 依赖与粒度 | T-01→…→T-11 线性无环，T-12 依赖 T-11 + 外部授权；估时均在 0.5–2h（T-02 / T-03 / T-07 / T-10 偏满载，属估时判断，不列发现） |
| 范围 / 副作用 | 只 3 个新文件 + README 一行；标准库 + 既有 pytest；不 import 产品包、不改 pyproject / .gitignore / 全局规则；无新工具、新依赖、新功能 |
| 离线 / 字面量 / 隐私 | 审计钩子在测试辅助模块、只在被测调用期间计数；期望值字面量、不复写算法；哨兵与路径形标签测试齐全；stdout / stderr 固定类别 |
| 三层数据 | F1 = 原生文件、仅 token 度量 complete；D1 = `build_report` 边界注入的归一化事实、标明非原生可产出；T-12 = 外部阻塞真实试点，未被当作已满足 |
| 退出码 / 六项度量 | 0 / 3 / 2 / 1 与 R2 接受的 §2 / §4.7 相同；tokens / main_attempts / tool_calls / retries / rework / timing 六项，overall 对原生输入恒 incomplete |
| 禁止口径 | 无基于来源末时间戳 / mtime 的结束或收尾判定（§4.2 只用类型与顺序）；来源 unknown 不填 0；主 assistant 尝试与操作记录不相加、操作记录 request_count 恒 unknown |
| 源码佐证 | 本会话复算 agent-session.js / cache-warmer.js / json.md 哈希与 Plan §7 r3 一致；`auto_retry_end{success:true}` 在转发新尝试 `message_end` 之后发出（778–788），`auto_retry_start` 在退避前（3102），与 §4.4 括号规则一致；该事件对一切非 `error` 结局（含 `aborted`）发出，§4.4“与重试结局无关”已覆盖 |

## P3-R2 承接矩阵（作者修订 / 待独立 A；本报告不关闭）

| R2 发现 | Plan r3 实际落点 | Tasks 承接 | Analyze 观察 |
|---|---|---|---|
| P3-R2-1 | §3.4 第 6 层末句加“仅单来源或 flag=true”，多来源 flag=false 全部入未确认分区 | T-06 完成标准 1、F8 负例 | 与 §3.4 首句一致；无冲突 |
| P3-R2-2 | §3.3 / §3.6 / §5 固定标签“主 assistant 尝试内的来源上报输入峰值”，操作记录不参与并注明 | T-04 标准 2、T-10 标准 1 | 含 spec 原词，符合 AC-003-3；无冲突 |
| P3-R2-3 | §4.4 括号规则 + 源码顺序、§5 F2 正例与三负例 | T-03 抽取、T-07 标准 4 | 本会话抽查源码顺序成立；无冲突 |
| P3-R2-4 | §4.2 末个 settled + 17 运行类 / 4 非运行类、未知尾随 → partial | T-03 标准 3 | 判据本身可判定；但允许尾随 `entry_appended` 而不约束 token 完整性，触发 P2-AN-1 |
| P3-R2-5 | (i) §3.3 `totalTokens` 缺失不对账、无效 / 不符 unreconciled；(ii) §3.4 第 4 层先于第 6 层，(d) 用净新增集逐维比较 | T-02 标准 3；T-05 标准 1、T-06 标准 3 | 两点均落实且与 AC-003-2 / AC-004-3 一致；无冲突 |

## 外部条件与下一步

- **路由回作者**：P2-AN-1（及可选 P3-AN-1）回 Plan / Tasks 修订（计划类阶段，首选模型重新开始）→ 对新固定提交**重跑 Analyze** → 独立 A 复核 r3 / r4 规则改动并依实际 Tasks / Analyze 判 C-05 / C-09。
- Checklist R2 仍为 21/23，C-05 / C-09 只能由独立 A 判定；本报告未标记或豁免任何项。有效 checklist 23/23 前不得开始 T-01。
- T-12 / AC-008-1 / AC-008-3 真实试点仍外部阻塞（须用户另行选定并授权文件）；它本身不构成规划不一致，也不阻塞离线单元任务。全局物理计费不在 v1 范围，不作为要求。
- 不需要回 Clarify：P2-AN-1 可在冻结 AC 内通过 Plan 设计修正解决，不改需求。
