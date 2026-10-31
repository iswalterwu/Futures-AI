# Feature: dev-harness-budget v1 Analyze 报告 R2（analyze-r2.md）

> Analyze 阶段产物（[workflow.md 第 7 步](../../docs/development/workflow.md#step-7)）：只读报告 spec / plan / tasks 之间的冲突、差距与模糊处。
> 本报告**不修复**任何输入，不勾选 / 豁免任何 checklist 项，不授权 Implement；质量判定 ≠ 任务执行 / AC 完成 / Checklist 批准。[Analyze R1](analyze.md) 原文保留不动。

- **Analyze R2 = `claude-opus-5-5 via claude-bridge`**（计划类首选模型 + 首选通道）。协调者派工前对 bridge 做了一次最小真实调用，成功（协调者陈述）；本会话未换模型、未改 provider / 路由 / key / 全局配置。新开会话，与 Plan r4 作者会话分离；是唯一有效的 Analyze R2。
- **固定提交**：`4132cc66054f52a9892f3e8c640839f12d5851a4`（`D:/2030/Futures-AI`，分支 `workbench`；开始时 `git status --short` 为空）。本会话唯一写入 = 新建本文件；无 Git 写操作、无网络、无安装、无派工、无测试；未读真实 `~/.pi` 会话、actor / agent 日志、Temp 负载或试点数据。
- **日期**：2026-10-30。

输入清单：

```
AGENTS.md @ 4132cc6（blob ee8e4ab）全文
docs/development/model-routing.md @ 4132cc6（blob f980f5c）全文
docs/development/workflow.md @ 4132cc6（blob 4aca344）全文（总规则、第 6～8 步、Gate 1 / Gate 2）
templates/tasks.md @ 4132cc6（blob 4b7f955）全文
specs/dev-harness-budget/spec.md @ 4132cc6（blob 4689093）全文；锚定 ^## 1\. 至文末 SHA256 = a504fed81e63b1f15262dff5ba0b2ad35c48cee3dd984a4bddd4ff2da922e823（本会话实算）
specs/dev-harness-budget/plan.md @ 4132cc6（blob 9c1c8bc，r4）全文（分 4 段读完 §1～§7）
specs/dev-harness-budget/tasks.md @ 4132cc6（blob 873f55b）全文
specs/dev-harness-budget/analyze.md @ 4132cc6（blob 2caea51，Analyze R1）全文
specs/dev-harness-budget/checklist.md @ 4132cc6（blob 40b0b87，Checklist R2）全文
specs/dev-harness-budget/review.md @ 4132cc6（blob ae5046a）头部与最后三节
真实 diff：git diff 64e20e8..HEAD（3 个文件：plan.md、review.md、tasks.md，+82/−31；无代码、无 checklist / spec / analyze.md 改动）
pi 1.4.0 公开安装包（有界、只读，包相对路径）：pi-coding-agent docs/json.md 全文；
  dist/core/agent-session.js 186、466–480、505–520、570–645、860–870、1568–1576、2290–2326、2580–2612、2778–2790、3378–3410 行；
  dist/core/cache-warmer.js 145–152、236–256 行；dist/core/session-manager.js 860–960、1176–1200 行；dist/modes/json-event.js 检索
```

## 结论

**PASS**：未发现 spec / plan r4 / tasks 之间的冲突、差距或歧义（0 P1 / 0 P2 / 0 P3）。Analyze R1 的 P2-AN-1 与 P3-AN-1 均已解决（见下表）。冻结 spec 正文未变，27 条 AC 均未勾选；r4 未改退出码、六项度量矩阵与 R2 已接受的其余方案，未发现回归。

PASS 只表示本轮一致性分析没有发现问题。它**不是**任务执行、AC 完成、Checklist 批准或 Implement 授权。有效清单仍是 Checklist R2，21/23；C-05 / C-09 及 r3 / r4 改动的规则、P3-R2-1～5 只能由独立 A 判定，本报告不关闭它们。

## Analyze R1 发现的解决情况

| 发现 | 结论 | 理由（依据 4132cc6 原文与有界源码核实） |
|---|---|---|
| P2-AN-1 `entry_appended` 用量被丢弃却可报完整总计 | **已解决** | 见下方逐项核对 |
| P3-AN-1 T-11 命令 10 对未跟踪文件空真 | **已解决** | T-11 命令 10 改为 `git grep --untracked -nE …`，完成标准 10 同步。本会话核实：Git 2.52 的 `git grep -h` 列出 `--[no-]untracked`（"search in both tracked and untracked files"）；`git check-ignore` 对 `backend/tools/dev_harness_budget.py` 退出 1（未被忽略，会被检索）；同一正则在已跟踪的 `backend/tests/*.py` 上能命中 `from data …`，说明它不是一个永远为空的正则。提交前后都有效，期望“无输出”不再空真成立 |

P2-AN-1 逐项核对：

- **抽取白名单**（plan §4.2、tasks T-03）：`entry_appended.entry` 只取 `type` / `id`；`type=usage` 再取 kind / provider / model / usage 数值；`type=compaction` 只再取 usage 数值。summary、details、systemMessage、firstKeptEntryId、customType、data（含其中形似 usage 的键）、content、note 明确禁读。核对 `session-manager.js` 864–877（usage：kind / provider / model / usage / 可选 note）、880–898（compaction：summary / firstKeptEntryId / tokensBefore / details / usage / fromHook / 可选 systemMessage）、901–911（custom：customType / data）、947–959（custom_message：content / display / details）后，白名单与禁读集合完整覆盖这些字段。tokensBefore、fromHook 不在白名单内，不会输出。
- **单一归属、无重复计数**：`rg entry_appended` 排除 bundle 后，实际只有 agent-session.js 的 5 个发射点（186 / 476 / 639 / 868 / 2787）；另一处匹配是 interactive-mode 的消费端，不是发射点。`appendUsage` 的唯一调用者是 cache-warmer.js 249（`cache_warm`）。`appendCompaction` 有 3 个调用点：594 是边界草稿，只经 639 `_commitBoundaryDrafts` 发出 `entry_appended`；2297 / 2586 是常规与扩展触发的压缩，只发 `compaction_end`，不发 `entry_appended`。cache-warmer 用 `streamSimple` 直接请求，不发 `message_*`，因此与主尝试也不重叠。plan §3.2 关于“唯一归属者”的结论成立；`entry_appended` 内按 entry id 去重，与 session-v3 第 1 层同口径。新版本漂移已在 §6 写明“须回 Plan”。
- **无虚假完整总计**：§4.3 第 3 条已把抽取出的记录纳入完整性判定；`entry_unrecognized` 四维恒为 unknown，因此完整总计为 unknown（`entry_appended_usage_unrecognized`）。§4.7 tokens 行与 §3.3 单位同步更新。F13 的字面量期望可以由规则唯一推出：(a) 170 + 40 = 210 且 complete；(b) 170 + 30（边界 compaction，同 id 只计一次）+ 12（常规 compaction）= 212；(c) 已知小计 170、完整总计 unknown、tokens partial、来源 loaded、退出 0。这些与 §2 退出码、§4.7 矩阵一致。
- **未识别的携带 usage 的类型按保守方式处理**：usage / compaction 以外的类型只检测顶层是否有 `usage` 键，有则记 `entry_unrecognized`，不读取其值、不输出类型名，因此不会静默丢弃。1.4.0 中 `branch_summary` 带顶层 `usage`（session-manager.js 1180–1198），但不经 `entry_appended` 发出（agent-session.js 3384 之后只发扩展的 `session_tree`）；万一出现，也会走上述回退。plan §3.2 / §3.6 把 json 来源的 branch summary 列为未观测，与源码一致。
- **披露**：`unobserved_paths` 删去了不准确的“json 不暴露 usage 条目”，只保留已核实的盲区。cache-warmer.js 247–251 只在非 error / aborted 时追加条目，“失败 / 中止的缓存预热请求”这一项属实。json.md 只写了“扩展经 `pi.appendEntry()` 追加 custom 条目”，比源码实际发射范围窄；plan §7 r4 已注明以源码为准。
- **隐私**：F13 (d) 的哨兵放在 custom 的 customType / data、custom_message 的 content、compaction 的 summary / details / systemMessage、usage 的 note。哨兵测试 `test_privacy_sentinels_absent` 由 T-11 承接；F13 夹具由 T-04 创建，T-04 在 T-11 之前，依赖顺序成立。
- **Tasks 承接**：T-03 负责抽取，T-04 负责计入、完整总计与 F13（新增完成标准 7 ↔ 验证命令 7），T-07 负责已覆盖 / 未观测（完成标准 6），T-11 负责隐私（完成标准 4）。AC 覆盖表中 AC-003-4 / AC-005-3 已补入 `test_entry_appended_usage_records_counted`，与 plan §5 对应行一致。

## 一致性核对（本会话实际执行的静态核对；未来测试命令一律未执行，也无实现可测）

| 项 | 结果 |
|---|---|
| spec 冻结 | 锚定正文 SHA256 = `a504fed8…e823`；spec.md blob 与 R1 相同（4689093）；`- [ ]` AC 行 27 条，`- [x]` 0 条 |
| checklist | checklist.md 仍为 blob 40b0b87：`[x]` 21 项、`[ ]` 2 项（C-05 / C-09）；diff 未触及任何 checklist 文件 |
| 真实 diff | `git diff --stat 64e20e8..HEAD` 只涉及 plan / review / tasks 三个 Markdown 文件；`git diff --check` 退出 0；analyze.md 未改 |
| AC 映射 | 脚本计数：plan §5 表 27 行、tasks 覆盖表 27 行，编号去重后均为 27，且与 spec 的 AC 集合相等 |
| 测试名 | tasks 中的 `test_*` 与 plan §5 中的完全相等（双向差集为空）；`-k` 名称之间没有子串碰撞；每个任务修改范围内列出的测试与其验证命令的 `-k` 集合一致 |
| 任务结构 | T-01～T-12 均有依赖 / 估时 / 上下文 / 修改范围 / 完成标准 / 验证命令；完成标准与验证命令条数逐任务相等（1/3/3/7/4/3/6/4/4/5/10/2）；除 T-11 第 8～10 条（全量回归 / 范围核对，非 AC 断言）外，每条都引用 AC 编号 |
| 依赖与粒度 | T-01→…→T-11 线性无环，T-12 依赖 T-11 + 外部授权；估时都在 0.5–2h 内（T-04 由 1.5–2h 调到 2h） |
| 范围 / 工具 | 仍为 3 个新文件 + README 一行；只用标准库 + 既有 pytest / Git；没有新工具、依赖、功能、阈值或来源格式；不 import 产品包，不改 pyproject / .gitignore / 全局规则 |
| 离线 / 字面量 / 隐私 | 审计钩子设计未变；F13 的期望值以字面量写出（210 / 212 / 170 / 987654 哨兵），不复写算法；stdout / stderr 仍为固定类别 |
| 三层数据 | F1～F13 = 原生合成文件（tasks 通用约定已同步为 F13）；D1 = 在 `build_report` 边界注入的归一化事实，并标明不代表原生读取器能产出；T-12 = 外部阻塞的试点，未被当作已满足 |
| 退出码 / 六项度量 | §2 退出码 0 / 3 / 2 / 1 与状态行未改；§4.7 只有 tokens 行的单位措辞扩展，complete / partial / unavailable 判据与其余 5 行未改；原生输入下 overall 恒为 incomplete |
| r4 回归检查 | §3.2 / §3.3 / §3.6 / §4.2 / §4.3 / §4.7 / §5 的改动只涉及 `entry_appended`。§4.2 收尾判据的 17 种运行类 / 4 种非运行类及其顺序规则逐字未变；§3.4、§4.4、§4.5 未改；P3-R2-1～5 的作者修订文字未被 r4 改动，也未受影响（峰值标签不变，F13 (a) 额外断言峰值仍为 150）。未发现回归 |
| 源码哈希 | 本会话复算：agent-session.js `436e8be3…1162`、cache-warmer.js `9c4b0009…7fc0`、session-manager.js `046b6a11…d9926`、json.md `f1031918…3543`、json-event.js `5f375647…d606`、print-mode.js `bb070a05…f13d`，均与 plan §7 r3 / r4 的记录一致 |

## 非阻塞观察（不是发现；供实施者与独立 A 参考，不要求回 Plan）

- F13 (a)～(c) 的字面量（210 / 212 / 170）说明它们应是各自独立、都以同一主尝试为基础的变体，且 (b) 中常规 `compaction_end` 应位于末个 `agent_settled` 之前（否则按 §4.2 会被判为 `stream_not_settled`）。这两点都能从期望值唯一推出，但实施者构造夹具时应照此安排。
- 回退检测只看顶层 `usage` 键。在已核实的 1.4.0 发射点内，这不会漏掉任何携带用量的条目。若未来版本经 `entry_appended` 发出用量嵌套在下层的条目（如 message 类），按 §6 属于版本漂移，须回 Plan 处理。
- T-11 命令 10 的正则以 `^` 锚定，匹配不到函数内的缩进 import。这是 R1 时就已存在的强度局限，不属于 P3-AN-1 的空真问题；仓库惯例是顶层 import。
- §3.4 第 3 / 5 层写“json-events 无条目 id”。r4 后，`entry_appended` 的条目其实带 id，但消息事件仍然没有，所以按键集核验仍不可行，规则依旧保守，不影响结论。

## 外部条件与下一步

- 由独立 A（新开会话，与实施模型不同）做 Checklist R3：复核 r3 / r4 改动的规则与 P3-R2-1～5，并依据实际 Tasks 与 Analyze（R1 + 本报告）判定 C-05 / C-09。有效清单 23/23 前不得开始 T-01。
- T-12 / AC-008-1 / AC-008-3 的真实试点仍然外部阻塞：须用户另行选定并授权具体文件。它不构成规划不一致，也不阻塞 T-01～T-11 的离线实施。
- 不需要回 Clarify；没有需求变更。Implement、Review、Gate 2 均未授权。
