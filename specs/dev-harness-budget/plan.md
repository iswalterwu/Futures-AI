# Feature: dev-harness-budget v1 实施计划（plan.md）

> Plan 阶段产物：由已冻结 [spec.md](spec.md) 生成的设计，需求本身不在此复制。
> 本文件只是设计：其中的路径、函数与命令都是**未来**实施对象，本阶段未写代码、未运行测试，任何 AC 均未通过。
> **评后状态记账（2026-10-30）**：本设计已由独立 A = `claude-fable-5-1 via anthropic` 对固定提交 `57d0d84` 完成 [Checklist R2](checklist.md)：旧 4 P2 / 3 P3 关闭，本轮 0 P1 / 0 P2、新 5 P3 待处理，清单 21/23，Implement 未就绪。下文“未经复核 / R1 唯一有效”等均是作者成稿时的历史状态；R2 集成检查点的设计正文与受审版本一致，最新有效结论以 checklist.md 为准。其后的 r3 修订（见下）已改变设计正文，仍待 A 复核，不改变“R2 只覆盖 `57d0d84`”这一事实。

- **Plan 作者**：`claude-opus-5-5 via anthropic`（计划类阶段按 [model-routing.md](../../docs/development/model-routing.md) 重新从首选开始；`claude-bridge` 在同一协调窗口内已确认限额耗尽、无重置证据，按规则 2 / 5 不重试；官方通道本阶段新做的最小真实探活成功。换通道不是换模型）。协调者 = `openai/gpt-6.1-sol`。
- **Gate 1**：用户 2026-10-30 答复“批准”；spec 冻结于 `ab7f246`（blob `092338a`）。批准不授权实施、本 feature Gate 2 或选读真实试点批次。
- **基线**：初稿 `ab7f246081c25b521361b633fe83276daea42d4c`；r2 修订基线 `037d61668391631d6b4a370125b464022d3784c2`（`D:/2030/Futures-AI`，分支 `workbench`）。
- **接续记录（历史）**：初稿与精修由 `claude-opus-5-5 via anthropic` 撰写；精修正式任务在 300 秒超时，停止所属进程树并保留有效 partial，随后按调用失败回退由 `openai/gpt-6.1-sol via openai` 接续核对与记账。不是因设计问题或静态检查失败而更换模型。其后独立 A 对 `a261657` 的 Checklist R1 结论见 [checklist.md](checklist.md)。
- **Plan 修订 r1（作者自审，同日）**：同一模型、同一健康通道继续，属正常设计自审，不是通道故障，未换模型。修了 5 处正确性缺口：完整总计须选定总体完整（§4.3）；`nested_of` / `duplicate_of` 须满足覆盖前提（§3.4）；标签拒绝路径形值（§3.1）；原生时间跨度不作耗时下界（§3.2 / §4.5）；写出改为独占创建（§2）。27 条 AC 映射保留，无新需求；详见 review.md。
- **Plan 修订 r2（按 Checklist R1 修订，2026-10-30）**：用户“继续”后恢复；作者 `claude-opus-5-5 via anthropic`，本阶段重新从首选开始（bridge 同一协调会话已确认耗尽、无重置证据，不重试；官方最小真实探活成功，为协调者陈述）。针对 R1 的 P2-1～P2-4 及 P3-1～P3-3 修订，逐项见 §7。**R1 仍是唯一有效审核结论（未通过）**；r2 未经独立 A 复核，不代表任何发现已关闭。27 条 AC 映射保留，无新需求、新阈值或新模式。
- **Plan 修订 r3（按 Checklist R2 的 5 项 P3，2026-10-30）**：用户“继续”后执行；作者 `claude-opus-5-5 via anthropic`（计划类首选；bridge 同一协调会话已确认耗尽、无重置证据，不重试；官方最小真实探活成功，为协调者陈述；换通道不是换模型），基线 `dc5932d3553aa4880ed35fd98d20ec0791043943`。只做 P3-R2-1～5 的最小修订与 pi 1.4.0 公开安装包源码有界核实（逐项见 §7 r3），无新需求、新度量、新来源格式；27 条 AC 映射保留。**R2 的通过只覆盖 `57d0d84`**；r3 改动的规则（§3.2 三行、§3.3 总量 / 峰值、§3.4 第 4 / 6 层、§3.6、§4.2 收尾判据、§4.4、§4.7、§5）是**作者修订的设计，待独立 A 复核**，5 项 P3 不由作者自称关闭；未实施、未测试。同阶段新建 [tasks.md](tasks.md)。正式调用在保存两份有效稿后以服务错误结束（进程退出 0，但末次 assistant `stopReason=error`，不是正常完成）；按调用失败条件由 `openai/gpt-6.1-sol via openai` 接续确定性保存与状态记账，未改上述技术设计。下一阶段重新从首选开始。
- **Plan 修订 r4（按 [Analyze R1](analyze.md) 的 P2-AN-1 / P3-AN-1，2026-10-30）**：作者 `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前对 bridge 做最小真实调用成功），基线 `64e20e8489fbe18f81536bce4aac3a888891bba6`。只改 `pi-json-events` 中 `entry_appended` 用量记录的抽取、计数与披露（§2 类别、§3.2、§3.3、§3.6、§4.2、§4.3、§4.7、§5、§6），并修 tasks.md T-11 验证命令 10；逐项见 §7 r4。退出码、六项度量矩阵与 R2 已接受的方案不变；无新需求、新度量、新阈值、新模式或新来源格式；27 条 AC 映射保留。r4 是**作者修订的设计**：P2-AN-1 / P3-AN-1 是否关闭由 Analyze R2 判定，r3 / r4 改动的规则与 5 项 P3-R2 由独立 A 复核；未实施、未测试。
- **Plan 修订 r5（按 [Review R1](code-review-r1.md) 的 P2-CR-1 / P3-CR-1～3，2026-10-31）**：作者 `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前对 bridge 做最小真实调用成功，为协调者陈述；本会话未换模型、未改 provider / 路由 / key / 全局配置），基线 `70291e3d13867fb7390202d964474b0d303cd081`。用户对 R1 的处置为“全修，T-12同批完成，授权脱敏”（四项全修，不作风险接受）。范围只限四项发现：P2-CR-1 同流嵌套工具执行事件（`parentToolCallId`）的身份、状态、去重与视图（§2、§3.2、§3.3、§3.6、§4.2、§4.7、§5、§6）；P3-CR-1 未确认分区下的分母 / 缺失数与空集原因类别（§3.6、§4.3、§4.7）；P3-CR-2 血缘父已选入但非 `loaded`（§3.4 第 4 / 6 层）；P3-CR-3 分组守恒改为计算（§4.3）。另把 Converge R1～R3 追加任务 T-13～T-15 的测试名补登记到 §5（只记账，不改规则）。逐项见 §7 r5。退出码、六项度量矩阵与其余已接受规则不变；无新需求、新度量、新阈值、新模式或新来源格式；27 条 AC 映射保留。AC-005-1 已要求“来源暴露的嵌套工具调用按其标识纳入并去重”，r5 是对真实事件形状的设计修订，不是需求变更，不回 Clarify。r5 是**作者修订的设计**：须经 Analyze R3 与独立 A Checklist R4 复核；四项发现是否关闭由实施后的独立 A Review R2 判定；未实施、未测试。
- **Plan 修订 r6（按 [Analyze R3](analyze-r3.md) 的 P3-AN-R3-1～3，2026-10-31）**：作者 `claude-opus-5-5 via claude-bridge`（计划类首选模型 + 首选通道；协调者派工前对 bridge 做最小真实调用成功，为协调者陈述；本会话未换模型、未改 provider / 路由 / key / 全局配置），基线 `81c61761a8c45535b779d8686489ba9b74fd33c8`。范围只限 Analyze R3 三项 P3：P3-AN-R3-1 只改 tasks.md T-12 修改范围；P3-AN-R3-2 采用修复方向 (a)，统一 §3.4 第 4 层、§3.6 `sources[]`、§5 AC-004-3 断言要点与 T-19（`net_new_determined: false` 的全部血缘情形，复制件数与净新增记录数均为 unknown）；P3-AN-R3-3 只把 F2 的嵌套去重断言写入 tasks.md T-16 完成标准 1。逐项见 §7 r6。其余规则、任务与 27 条 AC 映射不变；无新需求、新度量或新来源格式。r6 是**作者修订**：是否关闭由 Analyze R4 判定，之后由独立 A Checklist R4 复核；未实施、未测试。
- **Plan 修订 r7（按 [Analyze R4](analyze-r4.md) 的 P3-AN-R4-1～2，2026-10-31，只改措辞）**：作者 `claude-opus-5-5 via claude-bridge`（协调者派工前最小真实调用成功，为协调者陈述；本会话未换模型、未改 provider / 路由 / key / 全局配置），基线 `d4781fc61f6f7cd2d506ed100774d134d2c24e54`。Plan 只在 §5 AC-008-3 行加一句自观测试点的核对顺序；其余在 tasks.md（T-16 依赖、T-12 feature 名与顺序）。规则、27 条 AC 映射不变；是否关闭由 Analyze R5 判定；未实施、未测试。
- **头部记账补正（r7 之后，2026-10-31，不是规则修订）**：Tasks 作者 `claude-opus-5-5 via claude-bridge`，基线 `39fa979`。按 Checklist R4 P3-R4-1 把 r6 行移入输入清单代码块并补 r7 行；按 Review R2（tasks.md T-21）只在 §5 AC-004-3 / AC-005-1 / AC-007-1 行登记两个新测试名。规则正文与 27 条 AC 映射不变。
- **通道记录更正指引**：本文件上文（含 r2 / r3 行与头部作者行）关于“`claude-bridge` 当窗耗尽、无重置证据”的表述是未复测的旧记录，已过时，以 [review.md](review.md)“claude-bridge 路由更正与 Analyze R1”节为准；历史文字不改写。

输入清单：

```
AGENTS.md @ ab7f246（blob ee8e4ab）全文
docs/development/workflow.md @ ab7f246（blob 4aca344）总规则、第 4～8 步、Gate 1
docs/development/model-routing.md @ ab7f246（blob f980f5c）全文
specs/dev-harness-budget/spec.md @ ab7f246（blob 092338a；## 1. 至文末 LF SHA256 a504fed8…）全文
specs/dev-harness-budget/review.md @ ab7f246（blob b65fc4a）全文
templates/plan.md @ ab7f246（blob 22bd037）全文
docs/architecture.md @ ab7f246（blob 5c0dc17）§5.1～§5.5、§9
docs/plan.md @ ab7f246（blob 707e0cb）§4、§5（backend/tools = 仓库脚本）、§7.2
backend/README.md（blob 5d6fa8f）、backend/pyproject.toml（blob 8015e26）、.gitignore（blob 9245637）、
backend/tests/conftest.py（blob 98d37da）、backend/tools/build_backend.py（blob db00ae0）全文或相关行；
backend/tools/*.py 文件头、tests 中 `from tools import …` 用法（检索）
pi-coding-agent 1.4.0 安装包（非本仓库）：docs/json.md（sha256 f1031918…）、docs/message-types.md（b832893f…）、
docs/session-format.md（4f8fc421…）、docs/sessions.md（152d6489…）全文；dist/core/session-manager.d.ts（2288b69c…）
1～60 行及检索；dist/core/session-manager.js 第 1225～1265、1385～1425 行（fork / 分支会话复制条目的方式）
r1：协调者转达的 Plan 自审修订指示（5 项正确性缺口）；spec 冻结复核用锚定 re.search(r'^## 1\.', re.M)，哈希仍为 a504fed8…
r2：AGENTS.md（ee8e4ab）、workflow.md（4aca344）、model-routing.md（f980f5c）@ 037d616 全文
r2：spec.md @ 037d616（blob 4689093）全文，锚定正文 SHA256 仍为 a504fed8…；plan.md @ 037d616（blob 45395ad，即 R1 审查的候选）全文
r2：checklist.md @ 037d616（blob aef3138，文件 SHA256 dbe95b58…）R1 全文；review.md @ 037d616（blob f5e25df）暂停与恢复相关节
r2：pi 1.4.0 docs 有界复核（不做源码考古）：json.md 的 message_start / tool_execution_* / auto_retry_* / summarization_retry_* / agent_settled；
    message-types.md 的 pending 不持久化、NestedToolCalls；session-format.md 的 UsageEntry（kind）
r3：AGENTS.md（ee8e4ab）、workflow.md（4aca344）、model-routing.md（f980f5c）、templates/tasks.md（4b7f955）@ dc5932d 全文
r3：spec.md @ dc5932d（blob 4689093）全文，锚定正文 SHA256 仍为 a504fed8…；plan.md（blob d756f4b）全文；checklist.md R2（blob 40b0b87，SHA256 1a667287…）全文；review.md（cb44cf5）头部与 R2 节；HANDOFF.md、specs/README.md 全文
r3：pi 1.4.0 公开安装包（非本仓库，包相对路径；哈希与方法见 §7 r3）：pi-coding-agent docs/json.md 全文；dist/core/agent-session.js、
    dist/core/cache-warmer.js、dist/modes/print-mode.js、dist/modes/json-event.js 与 pi-agent-core dist/agent-loop.js、dist/agent.js 的相关方法
r4：AGENTS.md（ee8e4ab）、docs/development/model-routing.md（f980f5c）全文；workflow.md（4aca344）总规则、第 4 / 6 / 7 / 8 步、Gate；templates/tasks.md（4b7f955）全文 @ 64e20e8
r4：spec.md @ 64e20e8（blob 4689093）全文，锚定 ^## 1\. 至文末 LF SHA256 仍为 a504fed8…e823（本会话实算）；plan.md（blob 9afc846，r3）全文；tasks.md（9e8c9a4）全文；
    analyze.md（2caea51，Analyze R1）全文；checklist.md R2（40b0b87，SHA256 1a667287…）全文；review.md（4686eb8）头部与“Plan r3 与 Tasks 候选”“claude-bridge 路由更正与 Analyze R1”两节
r4：pi 1.4.0 公开安装包（非本仓库，包相对路径，有界 rg / 行读；哈希与行号见 §7 r4）：pi-coding-agent dist/core/agent-session.js、dist/core/cache-warmer.js、
    dist/core/session-manager.js、dist/modes/print-mode.js、dist/modes/json-event.js、docs/json.md 第 122 行
r5 @ 70291e3：AGENTS.md（ee8e4ab）、docs/development/model-routing.md（f980f5c）、templates/tasks.md（4b7f955）全文；docs/development/workflow.md（4aca344）总规则、第 4 / 6 / 7 / 8 步、Gate
r5：spec.md（4689093）全文，锚定 ^## 1\. 至文末 LF SHA256 仍为 a504fed8…e823（本会话实算）；plan.md（9c1c8bc，r4）、tasks.md（a474f2b）、code-review-r1.md（2272b21；工作区文件 SHA256 9e88d8ec…ca6e，与 review.md 记录一致）全文；
    checklist.md（04fe4b1，Checklist R3）、converge-r4.md（38b87a3）全文；review.md（1f79d39）头部、“Review R1”节与“用户对 Review R1 的处置与试点授权”节
r5：backend/tools/dev_harness_budget.py @ 70291e3（blob 3d81548）`_tool_event`、`_read_pi_json_events`、`_event_tool_result`、`_nested`、`build_report`、`_count_metrics`、`_tool_counts`、
    `_groups`、`_observation`、`_source_gaps`、`_aggregate_tokens`、`_partition_sources`、`_lineage_partition`、`_nested_failure`、`render_summary`；
    backend/tests/dev_harness_budget_fixtures.py（ee1318c）`tool_result_events`、`f2_rows`、`f8_sources`、`f12_events`、`f12_nested_sources`、`privacy_rows` 与 `nestedCalls` 检索；
    backend/tests/test_dev_harness_budget.py（3f9025a）对 nestedCalls / direct / copied_record_count / no_usage_records_observed / conserved / 摘要哈希的断言检索
r5：pi 1.4.0 公开安装包（非本仓库，包相对路径，有界只读；哈希与行号见 §7 r5）：pi-coding-agent dist/core/nested-tool-calls.js 全文、dist/core/agent-session.js 384–415 / 708–727、
    dist/modes/json-event.js 全文、dist/modes/print-mode.js 75–110、docs/message-types.md 全文、docs/extensions.md 全文；pi-agent-core dist/agent-loop.js 340–470 / 560–681
r6 @ 81c6176：AGENTS.md（ee8e4ab）全文；workflow.md（4aca344）总规则、第 4 / 6 / 7 步；spec.md（4689093）全文，锚定 ^## 1\. 至文末 LF SHA256 仍为 a504fed8…e823（本会话实算）；
    analyze-r3.md（e7fbc98）全文；plan.md（11a074e，r5）全文；tasks.md（9d20409）T-12、T-16～T-20、AC 覆盖表；review.md（b908e20）“用户对 Review R1 的处置与试点授权”“Analyze R3”两节；
    backend/tests/test_dev_harness_budget.py（3f9025a）530–700 行、dev_harness_budget_fixtures.py（ee1318c）`f5_sources` / `f8_sources`、backend/tools/dev_harness_budget.py（3d81548）`_lineage_partition` 与 `sources[]` 构造（只读）
r7 @ d4781fc：analyze-r4.md（0fb9a28）全文（P3-AN-R4-1～2）；plan.md（933c443，r6）头部、§5 AC-008-3 行、§7；tasks.md（941b9a6）T-12、T-16；review.md（1294cf5）“Analyze R4”节；
    AGENTS.md（ee8e4ab）、workflow.md（4aca344）、spec.md（4689093）在该提交未变
（r6 行原在代码块外、r7 行原缺，均按 Checklist R4 P3-R4-1 补正：r7 的 blob 取自 Git 历史，章节取自 review.md“Tasks 补正 r7”节所记的依据与修订位置。）
记账补正 @ 39fa979：code-review-r2.md（775dfdd）全文；checklist.md（3e7a7d6，R4）P3-R4-1；本文件（175fc2e）头部、输入清单、§3.3、§4.3、§5；spec.md（4689093）锚定正文 SHA256 a504fed8…e823（实算）
```

未读取：真实 `~/.pi` 会话、Temp 中既往作者日志、试点日志、其他 feature 的大型历史。

## 1. 技术方案

- **定位**：开发工作流的事后观测脚本，不是产品功能（[architecture.md §5.4～§5.5](../../docs/architecture.md#54-作业引擎边界) 的作业引擎 / 角色预算均不涉及；[model-routing.md 规则 8](../../docs/development/model-routing.md#rule-8)）。不 import `app` / `data` / `settings`，不接 MCP、pi 扩展、provider hook、服务器或数据库。
- **技术栈**：Python 3.14 标准库（`argparse`、`json`、`dataclasses`、`hashlib`、`datetime`、`pathlib`、`math`、`os`、`re`）+ 仓库现有 pytest。无新依赖、无新框架、不改 `pyproject.toml`。
- **落点**：`backend/tools/dev_harness_budget.py`（单文件）。依据：[plan.md §5](../../docs/plan.md#5-目录结构规划) 规定 `backend/tools/` 为仓库脚本目录，现有 `release_check.py` / `mutations.py` 同为 `cd backend && python tools/<x>.py` 的单文件标准库脚本，测试以 `from tools import <x>` 导入（如 `tests/test_app_packaging.py`）。`[tool.setuptools.packages.find] include = ["data*","settings*","app*"]` 与 `build_backend.py` 的 `--collect-submodules data/settings/app` 都不收 `tools`，故脚本不进 wheel / 打包产物，无需改打包。
- **测试**：`backend/tests/test_dev_harness_budget.py`；合成样例由 `backend/tests/dev_harness_budget_fixtures.py`（沿用 `tests/shfe_html.py` 这类测试辅助模块先例）在 `tmp_path` 中写出 JSONL，不提交任何 JSONL 数据文件、不含真实负载。
- **不需要 ADR**：只在既有仓库脚本目录新增开发工具，不改产品架构、全局规则、`.gitignore`、AGENTS / workflow / model-routing。实施中若发现必须改其中任何一项、或需导入产品包 / 新依赖，**停止**并回报，先走 ADR / Clarify。
- **单文件理由**：解析、归一、聚合、渲染只在此处使用一次（AGENTS §5.3）；文件内按“入口校验 → 类型化事实 → 聚合 → 输出”分节，主函数只写正常流程（§5.4）。

## 2. 模块设计

`backend/tools/dev_harness_budget.py` 的对外接口（测试只经这些接口调用真实实现）：

| 名称 | 签名 | 职责 |
|---|---|---|
| `main` | `main(argv: list[str] \| None = None) -> int` | CLI 入口；捕获全部异常并映射为固定类别 |
| `load_manifest` | `(path: Path) -> Manifest` | 唯一的清单校验边界（含 §3.4 关系图校验）；失败抛 `InputError(category, field_path)` |
| `read_source` | `(spec: SourceSpec, ctx: ReadContext) -> SourceFacts` | 只读打开一个选定文件，按 `kind` 分派到 `_read_pi_session_v3` / `_read_pi_json_events`，只抽取白名单字段为类型化记录 |
| `normalize_usage` | `(raw: object, *, finality: Finality, provider: str, model: str, rules: ZeroRules) -> TokenCounts` | 来源 Usage → 每维 known / partial / unknown（§3.3） |
| `build_report` | `(manifest: Manifest, facts: list[SourceFacts], prior: Conditions \| None) -> dict` | 关系分区、去重、聚合、按度量完整性、时间、分组守恒、可比性。**声明的系统边界**：测试可在此注入类型化 `SourceFacts` |
| `render_summary` | `(report: dict) -> str` | 默认中文摘要（Markdown） |

类型（`@dataclass(frozen=True, slots=True)`）：`Manifest`、`SourceSpec`、`TimingAnnotation`、`ZeroRule`、`Link`、`Value`（`status: known|partial|unknown`、`value: int|None`、`origin: source|annotation|derived`、`reason: str|None`）、`TokenCounts`（`input/output/cache_read/cache_write: Value`，`reasoning/cache_write_1h: Value` 子集，`unreconciled: bool`）、`UsageRecord`（`record_ref, category: main|compaction|branch_summary|usage_entry|tool_nested|entry_unrecognized, kind, provider, model, stop_reason, finality, tokens`；`entry_unrecognized` 只由 §4.2 的 `entry_appended` 回退产生，四维恒 unknown）、`AttemptRecord`（`record_ref, state: completed|failed|aborted|inflight|terminal_only`）、`ToolCallRecord`（`owner_ref, call_ref, state: finished|unfinished|terminal_only|proposed_only, nested: NestedView | None`；只表示模型发起的调用）、`NestedExecutionRecord`（r5：`owner_ref, call_ref, root_ref: str | None, state: finished|unfinished|terminal_only`；只来自带 `parentToolCallId` 的执行事件，§3.3）、`RetryFacts`（`confirmed: Value, scheduled_unobserved: int, total: Value, summarization_markers: Value`）、`SourceFacts`（`status: loaded|partial|empty|unavailable`、原因类别列表、`session_ref`、`content_sha256`、`parent_link`、条目键集合、`attempt_run_total: Value`、行数 / 坏行数及上述记录；r5 另含 `nested_executions: tuple[NestedExecutionRecord, ...]`，与 `tool_calls` 分开存放，direct 相关逻辑不遍历它）。`owner_ref` / `call_ref` / `root_ref` 为来源内序号或条目键的哈希，只作内部 trace，不输出 toolCallId；`parentToolCallId` 同样只参与读取器内部的父调用解析与身份哈希，不输出。原始 dict 只在 `_read_*` 内部存在，不进入任何类型或输出。

CLI（在 `backend/` 下执行）：

```
python tools/dev_harness_budget.py report --manifest <清单.json> --out-dir <目录>
       [--detail] [--compare-with <先前 report.json>]
```

- `--manifest`、`--out-dir` 必填，无默认（不隐式写任何位置）；建议 out-dir 用 `%LOCALAPPDATA%/FuturesAI-dev/harness-budget/<batch_id>/`。
- 输出：`summary.md`（默认摘要）、`report.json`（schema `dhb-report/1`，全部聚合元数据）；`--detail` 另写 `records.json`（逐记录元数据，不含任何负载）。默认不做事件回放。
- out-dir 须为已存在的目录（否则 `out_dir_invalid`，工具不建目录）；解析后位于本仓库根（`Path(__file__).resolve().parents[2]`）之内 → `out_dir_inside_repo`。两项都在任何写出前检查。
- 写出：全部内容先在内存生成，再按 `report.json` →（`records.json`）→ `summary.md` 的顺序用 `open(path, "x")` 独占创建。不做存在性预检，不用临时文件 / rename / replace / 锁 / 事务框架。目标已存在（含与选定来源、先前报告或临时文件样名文件同名）→ `FileExistsError` → `output_exists`，该路径不被写入。任一写出失败 → 只删除**本次运行独占创建成功**的文件；运行前已存在的路径永不删除、永不覆盖。不为创建与清理之间的外部替换另加防护（AGENTS §5.1）。
- **退出码**（只表达“产物是否写出”与“来源采集是否有缺口”，**不表达**度量覆盖、执行结果或业务验收，详见 §4.7）：`0` = 全部产物已写出，且每个选定来源均 `loaded`（无采集 / 格式失败、观测到 ≥ 1 条可用记录）；度量仍可能 partial，`0` **不表示观测完整**；`3` = 全部产物已如实写出，但至少一个来源缺失 / 不可读 / 截断 / 不支持 / 无效 / 无可用数据（`unavailable` / `partial` / `empty`）；`2` = 输入错误（清单、out-dir、`output_exists`、比较报告）；`1` = 内部错误或写出失败。退出 2 / 1 时，若本次创建的文件已全部删除，才可称“未留下本次报告文件”；若清理失败，stderr 附 `partial_artifacts_left=<n>`（只给计数、不给路径），残留文件属不完整产物，不得称“未写报告”。
- 参数解析使用 `argparse`，但 `ArgumentParser.error()` 只转为固定 `invalid_arguments` 输入错误；不得使用默认的 argv / 非法值回显或 `FileType` 自动打开输入。`--help` 只显示静态用法。`field_path` 仅由本工具已知 schema 字段名与列表序号构成；未知键报 `manifest_invalid`，字段位置用固定 `unknown_field`，不回显用户键名或取值。以上属于入口一次性校验，不增加语义 DLP。
- stdout 只在退出 0 / 3 时输出一行状态：`dev-harness-budget: report written; sources=<ok|gaps> loaded=<n> partial=<n> empty=<n> unavailable=<n>; metrics_complete=<k>/6; overall_observation=<complete|incomplete>; not an acceptance verdict`，不含任何路径。stderr 只输出 `error: <类别>[ <清单字段路径或 source_id>][; partial_artifacts_left=<n>]`；类别固定：`invalid_arguments`、`manifest_unreadable`、`manifest_invalid`、`out_dir_invalid`、`out_dir_inside_repo`、`output_exists`、`compare_report_invalid`、`write_failed`、`internal_error`。绝不输出异常文本、traceback、路径、源内容或无效标签的原值。

## 3. 数据与存储

### 3.1 清单（用户在仓库外自行编写，`manifest_version: 1`）

```json
{"manifest_version": 1, "batch_id": "pilot-1", "baseline_commit": "<40 hex，可选>",
 "conditions": {"config_label": "<可选>", "task_scope": "<可选>"},
 "comparability_note": {"text": "<可选标签>", "basis": "<出处标签>"},
 "confirmed_zero": [{"provider": "p", "model": "m 或 *", "fields": ["cacheWrite"], "basis": "<出处标签>"}],
 "all_nested_children_declared": false,
 "links": [{"type": "disjoint", "sources": ["S1", "S2"], "basis": "<出处标签>"}],
 "sources": [{"source_id": "S1", "kind": "pi-session-v3 | pi-json-events", "path": "<文件，相对清单目录或绝对>",
   "dimensions": {"phase": "Plan", "role": "author", "channel": "<可选>", "baseline_commit": "<可选>"},
   "rework": {"count": 0, "basis": "<出处标签>"},
   "timing": {"start": "ISO-8601", "end": "ISO-8601", "observed_until": "ISO-8601，可选",
              "outcome": "completed|failed|cancelled|timeout", "origin": "manual|external", "basis": "<出处标签>"},
   "duplicate_of": {"source": "<source_id>", "basis": "<出处标签>"},
   "nested_of": {"source": "<父 source_id>", "tool_call_id": "<父来源中的 toolCallId>", "basis": "<出处标签>"}}]}
```

- 选择即清单中的 `sources`；只打开列出的普通文件，不 glob、不扫目录、不跟随 `parentSession`、不读未列出的会话或私有文档目录。
- 标签分类校验，只在入口校验一次（清单在 `load_manifest`，来源值在 `_read_*`；AGENTS §5.2），内部与渲染不再重复检查：
  - **标识 / 注释类**（`batch_id`、`source_id`、维度 phase / role / channel、`conditions.*`、`comparability_note.text`、全部 `basis`）：`^\w[\w .+#@-]{0,63}$`（可含中文；不允许 `:`、`/`、`\`、换行，因此拼不出盘符、UNC 或绝对路径）。`basis` 填不透明出处 ID（如 `walter-2026-10-30-msg3`），不写文件路径或 URL。
  - **provider / model 类**（`confirmed_zero` 的 provider / model；§4.2 来源中的 provider / model / usage kind）：`^[A-Za-z0-9][A-Za-z0-9._:/@+-]{0,95}$`，允许 `org/model`、`model:version`（如 `openai/gpt-6.1-sol`、`qwen3:32b`）；另拒绝可识别的路径形值：含 `//`，或以盘符 `[A-Za-z]:/` 开头（反斜杠、前导 `/`、`~` 已被首字符与字符集排除）。规则中的 `model` 另允许 `*`。
  - `tool_call_id`：`^[A-Za-z0-9_][A-Za-z0-9_.|:-]{0,127}$`（无 `/`、`\`），只用于匹配，不进入任何输出。
  - `baseline_commit` 须为 7～40 位十六进制，枚举字段只收枚举值。
  - 清单值不符 → `manifest_invalid` + 字段路径（字段名，不是取值）；来源值不符 → 显示为固定类别 `(无效标签)` 并计入 `invalid_label`。任何情况都不回显原值。这只拒绝可识别的路径形值与无约束的源内容，不做通用语义隐私检测或付费分类（这部分由清单作者负责）；输出仍只经白名单投影。
- 来源 `path` 只用于打开文件，永不输出；证据标识为 `source_id`、`format`、`session_ref = "s:" + sha256(header.id)[:16]`、`content_sha256`（文件字节哈希，作来源版本证据）。

### 3.2 支持的来源与能力矩阵（pi 1.4.0 语义）

| 度量 | `pi-session-v3`（会话文件，header `version: 3`） | `pi-json-events`（`pi --mode json` 的 stdout 捕获，首记录为 v3 header） |
|---|---|---|
| token 主调用 | 全文件全部 `message`/`assistant` 条目（含废弃分支、被 compaction 折叠、被 `context_edit` 省略者；不只看活动分支） | 归属者 = `message_end`（assistant）；`turn_end.message`、`agent_end.messages` 只是重复，不计 |
| 流式快照 | 不持久化（pi 不持久化 `pending` 助手消息） | `message_update.usage` 为累计快照，只保留最后一个作部分观测值；最终值只取 `message_end` |
| 主 assistant 尝试 | 持久化的 assistant 条目（终态：完成 / error / aborted）；进行中的尝试不可见，且快照不证明运行已结束 → 运行内尝试总数 unknown | `message_start`（assistant）与随后 `message_end` 配对：完成 / 失败 / 中止 / 进行中（只有 start）/ 仅终态（只有 end）；`auto_retry_start` 只是排程，不是尝试 |
| 其他模型操作记录（不是尝试） | `compaction`、`branch_summary` 的 `usage`；`usage` 条目任意 `kind`（未知 kind 照计并按 kind 列示）；带 `usage` 的 `toolResult` | `compaction_end.result.usage`（常规手动 / 自动压缩；失败 / 中止 → 已发生、用量未知）；toolResult `message_end` 的 `usage`；**`entry_appended.entry` 中的用量记录**（r4，按 §4.2 白名单抽取，不论位于 settled 之前或之后）：`type=usage`（任意 kind，如缓存预热在 settled 前后追加的 `cache_warm`）与 `type=compaction`（扩展在 `turn_end` / `agent_before_settle` 边界提交的压缩草稿），与 session-v3 的 usage 条目 / compaction 同口径计为操作记录并标“已覆盖”；无 usage 的边界 compaction 同 session-v3 中无 usage 的 compaction。**归属（源码核实，§7 r4）**：1.4.0 中常规压缩只经 `compaction_end`、边界草稿压缩只经 `entry_appended`，互不重叠，各自是唯一归属者；`entry_appended` 内按 entry `id` 去重，重复 id 计一次并记 `duplicate_entry_id`。其他 entry 类型（custom、custom_message、context_edit 及未知类型）不抽取内容；若带顶层 `usage` 键 → 按 §4.2 回退记一条 `entry_unrecognized`（四维 unknown、不读其值）。branch summary 只在交互式树导航中持久化、不发会话事件（源码核实）→ 列入 `unobserved_paths` |
| 工具执行证据 | `toolResult` 条目；assistant 中无对应结果的 `toolCall` 块 = 仅提议（嵌套调用不产生 toolResult 条目，r5 源码核实） | 不带 `parentToolCallId` 的 `tool_execution_start` / `tool_execution_end` = 模型发起的调用（direct）；只有 start → 未完成；assistant `toolCall` 块无执行事件 = 仅提议。**带 `parentToolCallId` 的执行事件是工具内嵌套调用（`ctx.executeTool()`），不是 direct 证据**（r5，见下行与 §3.3） |
| 嵌套工具调用 | `toolResult.nestedCalls`（`complete=false` → 嵌套视图部分）；嵌套执行事件不持久化（pi 只发事件、不写条目），session-v3 只有记录视图 | 两类证据（r5，源码核实，§7 r5）：① **嵌套执行事件** = 带 `parentToolCallId` 的 `tool_execution_start` / `tool_execution_end`（`tool_execution_update` 同样带该字段，但不读），子 id 由 pi 赋为 `<直接调用者 id>/<n>`，任意深度的 `parentToolCallId` 都是直接调用者（孙调用的父是子调用 id）；嵌套调用不发 `message_*`、不产生 toolResult。② 模型发起调用的 toolResult `message_end` 上的 `nestedCalls`：同一顶层调用下**各深度**嵌套调用的有界记录，记录 id 与执行事件的 `toolCallId` 相同，超过 256 条丢弃并 `complete=false`；pi 在该 toolResult 的 `message_start` 时附加。两类证据按 §3.3 的嵌套身份去重。各深度嵌套结果的 usage 已由 pi 并入该 toolResult 的 `usage`（照 §3.3 / §3.4 第 6 层作操作记录计一次）；嵌套 `tool_execution_end.result.usage` 不读，不会重复计 |
| 工具耗时 | **不可得**（持久化结果无时长） | `tool_execution_end.durationMs`（缺省 → 未知） |
| 物理 HTTP / SDK 请求与重试 | **不可得**（一律“未观测”） | **不可得** |
| pi 自动重试（assistant 循环级） | **不可得**（无重试标记持久化） | 仅 §4.4 的显式括号可确认（事件顺序经 1.4.0 公开源码核实）；总数不可证明 |
| 会话开始 / 结束 | **原生不可得**：header 时间是创建时间，条目时间是追加时间，无关闭 / settled 条目。这些时间戳的跨度可能包含空闲、历史或所选运行之外的时间，**不作为耗时、部分耗时或耗时下界输出** | **原生不可得**：事件无时间戳，`message.timestamp` 是创建时间，`agent_settled` 无时间；同左，不输出 |
| 执行结果 | 原生未知 | 末个 `agent_settled`（§4.2 收尾判据）确认被观测 agent run 已停止，不是业务验收。`aborted=true` 只证明运行中断，原因未知；不得自行区分取消与超时。`aborted=false` 且末次 assistant 为 error → 失败，否则标“被观测 agent run 正常结束”（完成，scope 明示为 agent run）。无 settled → 未知；超时或取消原因须由明确来源 / 标注确认 |
| 模型 / 通道 | 物理模型取自 assistant 的 `provider`/`model`（`model_change` 可能是虚拟模型，不用于归属）；通道 = `provider` | 同左 |

- 已确认墙钟只来自清单 `timing` 标注（`origin` 必须声明 manual / external 并带 basis），报告逐项标“标注来源”；部分耗时只来自同一标注中带出处的 `observed_until`（§4.5）。绝不用文件 mtime、最后一条消息、`agent_end`、header 时间或当前时间推出结束、部分耗时或下界。缺确认时间时，会话 / 批次耗时为 unknown。
- 不支持：会话 v1 / v2 或缺 version（→ `unsupported_version`，不可用；不迁移、不调用 SessionManager、不改文件）、RPC 流（无 header）、其他工具日志（→ `unsupported_format`）。无“全覆盖”承诺。

### 3.3 归一化口径（`dhb-metrics/1`）

- **完成度**：assistant `stopReason ∈ {stop, length, toolUse}`、`usage` 条目、带 usage 的摘要条目 = `final`；`error` / `aborted` = `interrupted`；`deferred`、无 `message_end` 的流 = `nonfinal`。
- **每维取值**（input / output / cacheRead / cacheWrite / reasoning / cacheWrite1h）：非 int、bool、负数、非有限 → `unknown(invalid)`；`final` 且正数 → known；`final` 且为 0 → 仅当 `confirmed_zero` 规则匹配 provider / model / 字段时 known 0（origin = annotation），否则 `unknown(default_zero)`——因 pi Usage 恒带数值默认值，字段存在或为 0 都不证明来源真报了 0；`interrupted` / `nonfinal` 的正数 → partial（下界，需快照单调，否则 unknown），0 → unknown。
- **总量**（P3-R2-5 (i)）：记录总量只由四个互斥维决定 = 四维之和，仅当四维均 known。来源 `totalTokens` 不作权威，只是可选的辅助对账字段：**缺失 → 不对账**，不因缺失而标 `unreconciled`（AC-003-2 不假设来源提供全部字段）；存在但无效（非 int、bool、负数、非有限）→ `unreconciled(total_tokens_invalid)`；存在、有效且四维均 known 时与四维和不等 → `unreconciled(total_tokens_mismatch)`；四维有未知时记录总量本已 unknown，不做对账。子集同理：子集与父维都存在且 known 时 `reasoning > output` 或 `cacheWrite1h > cacheWrite` → `unreconciled(subset_exceeds_parent)`，任一缺失 → 不对账、子集显示 unknown。`unreconciled` 记录不入精确总计。`cost` 一律不读出、不输出。
- **来源上报输入** = input + cacheRead + cacheWrite（三维均 known 才有）；峰值只在主 assistant 尝试记录上取，固定标签“**主 assistant 尝试内的来源上报输入峰值**”（P3-R2-2；含 spec 原词“来源上报输入峰值”，不称计费输入或请求前上下文大小），并给“参与记录数 / 尝试总数”；有未知记录时标“已知记录中的峰值（下界）”。其他模型操作记录（compaction、branch_summary、usage 条目、带 usage 的 toolResult）的输入**不参与**该峰值：它们不是单请求值（一条记录可能对应未知个、可能多个请求，请求数 unknown），峰值旁固定注明这一点；不另设操作记录峰值。
- **尝试与操作记录分开**（P2-3）：“观测到的主 assistant 尝试”是 pi agent 循环中的逻辑尝试，不是物理 HTTP 请求；按状态 completed / failed / aborted / inflight / terminal_only 分列，inflight 与 terminal_only 照计为“已观测到的尝试”。compaction、branch_summary、usage 条目（按 kind）、带 usage 的 toolResult、失败 / 中止的 compaction 属“其他模型操作记录”：**一条记录 ≠ 一次模型请求**，请求数恒 unknown，不计入尝试数，也不与尝试相加。子会话里的 assistant 尝试按子来源的主尝试单列；从父视角它们属于工具内嵌套工作，父的 toolResult 用量只作操作记录，不换算为请求数。
- **工具调用身份与视图**（P2-4）：
  - 来源内身份：session-v3 = `(source_id, toolResult 条目 id)`，owner = 沿 `parentId` 越过 toolResult 条目找到的首个 assistant 条目；events = `(source_id, owner 序号, toolCallId)`，owner 序号 = 该 `tool_execution_start` 之前最近一个 assistant `message_end` 的序号。同一 toolCallId 在不同 owner（不同轮次）下是**不同**调用，不合并（防 provider 复用 `call_0`）；同一 owner 内重复 → 每次都计为观测到的调用，配对不明，记 `tool_call_id_reused_in_scope`。owner 解析失败 → `tool_owner_unresolved`，调用仍计入。
  - 状态：finished（session 的 toolResult；events 的 start + end）、unfinished（events 只有 start，仍是已观测的调用）、terminal_only（events 只有 end）。assistant 的 `toolCall` 块（只取 type 与 id）在同一 owner 下没有任何执行证据 → `proposed_only`：不是实际执行的证据，单列，不计入调用数。
  - 视图：`direct` = 各来源**模型发起**调用的执行证据计数（不带 `parentToolCallId`；经 §3.4 去重分区）；`nested_reported` = 父 toolResult `nestedCalls.calls` 记录数（身份 = 父调用身份 + nested id，在该父调用内按 id 去重）；r5 另有 `nested_executed`（嵌套执行事件按状态计数，只有 json-events 能提供）与 `nested_deduplicated`（两类嵌套证据按嵌套身份去重后的计数），见下两条。direct 与任何嵌套视图**永不相加**；只要选定总体中存在任何嵌套证据（nestedCalls 记录或嵌套执行事件），跨来源“全部工具调用总数”即 unknown（`nested_overlap_unresolved`：nested id 与子会话直接调用 id 没有可靠对应）；没有嵌套证据时，它等于 `direct` 的已确认总体计数。
  - **嵌套执行事件（r5，P2-CR-1）**：带 `parentToolCallId`（非空字符串）的 `tool_execution_start` / `tool_execution_end` 一律记为 `NestedExecutionRecord`，**永不进入 `direct`**，也不参与 `proposed_only` 的匹配。父调用解析只在同一 owner 作用域内进行（owner 序号与 direct 的定义相同；嵌套事件发生在父调用执行期间，其间没有新的 assistant `message_end`）：`parentToolCallId` 恰好等于该作用域内一条 direct 执行的 toolCallId → 该 direct 调用即顶层父；否则恰好等于该作用域内一条已解析嵌套执行的子 id → 继承其顶层父（多层嵌套）；零条或多于一条候选 → 父未解析，记固定原因 `nested_parent_unresolved`，该执行仍是嵌套，**不改判为 direct**。不从 id 字符串（`<父 id>/<n>` 形状）推断父子关系；raw id 只存在于 `_read_pi_json_events` 内部的临时映射中。
  - **嵌套身份、状态与去重（r5）**：已解析者的身份 = (来源, 顶层父调用身份, 子 toolCallId)，内部引用 `root_ref` = 顶层父的 `call_ref`，`call_ref = _hash_ref("n", root_ref + "\0" + 子 id)`，与该父 toolResult `nestedCalls` 记录的身份按同一方式构造，相等即同一嵌套调用；未解析者 `root_ref` 为空，只有来源内序号引用，无法与记录匹配。同一身份内 start / end 配对：start + end → finished；只有 start → unfinished；只有 end → terminal_only（未解析者在同一 owner 作用域内按子 id 配对）。`nested_deduplicated` = 每来源（已解析执行身份 ∪ 记录身份）的个数 + 未解析执行数，另列两者均见（matched）、只见执行（executed_only）、只见记录（reported_only）。`nested_executed` 只计 json-events 来源；所选来源全部为 session-v3 时为 unknown（`nested_events_not_persisted`），混合时只计 json-events 来源并注明范围。跨来源不做嵌套身份去重（身份含来源；同一会话双采集已按 §3.4 第 5 层进入未确认分区，不进入计数）。
  - **对 direct 完整性的影响（r5）**：嵌套执行不计入 direct，也不进入 tool_calls 的分母（§4.7）。与既有 `complete=false`（`nested_incomplete`）同理，`nested_parent_unresolved` 与嵌套执行 unfinished / terminal_only（`nested_execution_incomplete`）是 tool_calls 度量的原因，阻止其 complete，但不改变 direct 的计数、分母与覆盖率；嵌套证据既不能让 direct 看似完整，也不会抬高其分母。`all_total` 保持保守：源码只证明同一会话内嵌套 id 由 pi 赋值、不作为 transcript 中的工具调用出现，并不给出与选定子会话直接调用的对应关系，且记录有 256 条上限，故存在任何嵌套证据时 `all_total` 仍为 unknown，不新增已知值路径。
- **单位与分母**（均限于选定且已确认去重的总体）：token 覆盖以“用量归属记录”（主 assistant 尝试 + 摘要条目 + usage 条目 + 带 usage 的 toolResult；json-events 含经 `entry_appended` 抽取的 usage 条目 / compaction 与 `entry_unrecognized`，r4）为单位；嵌套工具用量以“带 usage 的 toolResult”为单位、分母未知（工具未必做模型工作）；尝试以“观测到的主 assistant 尝试”为单位；工具以来源内调用身份为单位；重试以“已确认的 pi 自动重试关联”为单位；时间以来源（会话）为单位。百分比只在分母已知时给出；文案固定为“选定记录”，不写“全部 API 调用”。

### 3.4 去重层级与来源关系

0. **关系图入口校验**（`load_manifest`，P2-4）：边 = 每个 `duplicate_of.source`（S→X）与每个 `nested_of.source`（S→P）的**并集**。以下一律 `manifest_invalid` + 字段路径：目标未声明、指向自身、并集图中任何环（含 duplicate 环、nested 环与两类混合环，如 A dup B、B nested_of A）、同一来源同时声明 `duplicate_of` 与 `nested_of`。只做来源数规模的 DFS，不建全局账本。
1. **来源内**：每类事实一个归属者（§3.2）；会话文件按条目 `id` 去重，重复 id 计一次并记 `duplicate_entry_id`。第 1～5 层同时作用于 token、主尝试与工具执行证据。
2. **关系形状**：对通过校验的关系图按弱连通分量判定，只支持两种单层形状：
   - **重复星形**：若干 S_i `duplicate_of` X；X 无出边；任何 S_i 无入边；分量内无 nested 边。
   - **嵌套星形**：若干 C_i `nested_of` (P, T_i)；P 无出边；任何 C_i 无入边；分量内无 duplicate 边。
   其余形状（链式重复、孙→子→父链式嵌套、两类边混在一个分量）→ 整个分量进入未确认分区，原因 `relation_shape_unsupported`：逐来源事实全部保留和展示，不排除任何来源的 token，分量不入已确认总体，完整总计 unknown。不做递归核算。
3. **`duplicate_of`（重复星形）**：语义是**清单作者断言** S 的全部记录都包含于 X；报告把它标为 annotation，展示 basis 与“正确性由断言者负责”，并写明风险：断言错误时 S 独有的尾部记录会被丢弃。生效条件：X 与 S 均 `loaded`；两者都是 session-v3 时另核对 S 的每个 `(type, id, timestamp)` 键都存在于 X，否则 `duplicate_not_contained`；json-events 无条目 id，不做跨格式重建，标“未经核验的人工断言”。生效 → S 不入 token / 尝试 / 工具聚合，逐来源事实保留并标“按人工链接被 X 取代”。X 或 S 缺失 / 不可读 / 不支持 / partial / empty → 链接不生效，两者进入未确认分区（`duplicate_target_unavailable`），已知值照常单列——不可用的目标永不压制有效数据。`links.disjoint` → 人工断言两来源不重叠（标 annotation 出处）。
4. **可靠血缘**：子会话 header `parentSession` 规范化后（`os.path.normcase(os.path.abspath)`，只做字符串比较、不打开）等于另一选定来源路径 → 子文件中 `(type, id, timestamp)` 与父文件相同的条目视为复制件，只由父计一次（依据：pi 1.4.0 `session-manager.js` fork / 分支会话逐条复制并保留 `id`/`timestamp`）；同键但用量不同 → 该对来源进入“未确认去重”（`lineage_usage_conflict`，`net_new_determined: false`）。父未选入 → 子来源已知值照计，标“可能含复制自父会话的历史用量，无法区分”，并记一项选择缺口 `parent_not_selected`（完整总计 unknown，§4.3）。**父已选入但不是 `loaded`**（`unavailable` / `empty` / `partial`；r5，P3-CR-2）→ **不做键集差**：子来源标 `lineage_parent_unavailable`、`net_new_determined: false`、复制件数 unknown，注明“血缘父未完整加载，无法区分复制件”，原因与 `parent_not_selected` 同样记为选择 / 关系缺口（完整总计 unknown），聚合仍使用子来源全部记录；父为 `partial` 时父仍贡献已读到的记录，子中这些条目的复制件无法判定，为免在已确认小计中重复计入，父子这一对另进入未确认分区（原因同上），逐来源已知值照常单列；父为 `unavailable` / `empty` 时父不贡献记录，子来源与 `parent_not_selected` 一样留在已确认总体。**凡 `net_new_determined: false` 的血缘情形**（r6，P3-AN-R3-2）——`parent_not_selected`、`lineage_parent_unavailable`、`lineage_usage_conflict`，以及父或子落入 `relation_shape_unsupported` 分量（第 2 层）而跳过键集差者——逐来源的复制件数与净新增记录数均为 unknown（JSON null，摘要显示“未知”），不显示 0；无血缘的来源复制件数为 0、净新增记录数 = 全部用量归属记录数，这两种情形的 0 不表示“未知”。**本层先于第 6 层执行**（P3-R2-5 (ii)）：去除复制件后，子来源剩下的是“净新增用量记录集”（无血缘的来源即其全部用量归属记录），全局聚合、分组与第 6 层 (d) 一律使用净新增集；逐来源事实同时列原始记录数与其中复制件数（复制件标“由血缘父计”），不把含复制历史的原始和当作该来源的已知值或覆盖证据。上述 `net_new_determined: false` 的各情形（r5 / r6）净新增集不可确定。
5. **同一会话被重复采集**（两来源 `session_ref` 相同，如会话文件 + JSON 捕获）且无生效的 `duplicate_of` → 该组“未确认去重”（事件无条目 id，不按文本 / 哈希 / 相等 token 值配对）。
6. **嵌套工具用量（嵌套星形）**：单来源时 toolResult 用量照计。多来源时须 `all_nested_children_declared: true`（人工断言：选定集中的嵌套子会话都已用 `nested_of` 声明），否则全部带 usage 的 toolResult 归入“未确认去重”分区。把 `nested_of` 按 (P, T) 分组，每组 G = {C_1..C_n} 同时满足以下前提，才视为“被父覆盖”：
   - (a) P 与 G 中每个子来源均 `loaded`；
   - (b) P 中以 T 为 toolCallId 的执行证据恰有一条（session = toolResult 条目；events = toolResult 的 `message_end`）；T 在 P 的多个轮次中复用 → 不是恰一条 → `nested_link_mismatch`；
   - (c) 该 toolResult 带 `usage`，四维均 final-known 且未 unreconciled，`nestedCalls.complete` 不为 false；
   - (d) G 中每个子来源的**净新增用量记录集**（第 4 层之后）四维均 final-known，且对 input、output、cacheRead、cacheWrite **逐维**：Σ 子来源净新增集该维 = 父 usage 该维。复制件既不参与 Σ，也不参与该完整性要求，因此子文件含复制历史不会使有效的净覆盖因“和含历史”而被误拒。子来源为 `parent_not_selected` 或 `lineage_parent_unavailable`（净新增集不可确定）或其血缘对已入“未确认去重” → (d) 不成立（`nested_coverage_unverifiable`）。任一子维 unknown / partial 时**不跳过校验**，直接判不成立（`nested_coverage_unverifiable`）；只有四维合计相等不算通过。
   全部成立 → G 的净新增 token 不入聚合，由 P 的这条 toolResult 用量计一次（G 的复制件仍按第 4 层只由血缘父计）；子来源的主尝试、工具调用与时间照常计。任一不成立 → P 与 G 全部进入未确认分区（`nested_coverage_absent` / `nested_link_mismatch` / `nested_coverage_partial` / `nested_coverage_unverifiable` / `nested_sum_mismatch`），逐来源事实保留，不静默丢弃。只核对显式链接，不建全局记账。**仅在单来源、或 `all_nested_children_declared: true` 时**，未被任何 `nested_of` 引用的 toolResult 用量照计（P3-R2-1）；多来源且该标志为 false 或缺省时，**全部**带 usage 的 toolResult（无论是否被引用）留在未确认分区（见本层首句），用户可见的各来源已知值照常单列，不形成虚假的已确认已知小计。
7. 其余：`session_ref` 不同且无血缘 → 不相交（依据 header 血缘）。

“已确认去重总体”= 未落入任何未确认分区的来源 / 记录；批次已知小计、分组守恒只在此总体内计算。存在未确认分区时，跨来源完整总计 = 未知，标“未完全去重”，各来源已知值照常单列。token 归属不等于时间归属（§4.5）。

### 3.5 标注与冲突

- 阶段 / 角色 / 返工 / 可比性说明只来自标注；模型、通道优先取来源，标注只填缺失项，冲突计 `annotation_conflict` 并保留来源归属。执行结果只比较同一作用域、同一语义层的明确结局：两者明确且矛盾才标“冲突 → 未知”。原生 `aborted` 是中断事实，不是取消原因；人工或外部标注可补充 timeout / cancelled，同时保留中断事实与标注出处，不把“中断 + 超时原因”误判为冲突。
- `timing` 时间须带 UTC 偏移才可跨来源比较；无偏移的时间只可算同一来源内的耗时，批次窗口因“时钟不可比”为未知；`end < start` → 该来源时间无效（未知 + 原因）。

### 3.6 报告结构（`report.json`，schema `dhb-report/1`）

`batch`（batch_id、基线、条件）、`semantics`（`dhb-metrics/1`、`pi-coding-agent 1.4.0 docs`）、`population`（选定来源总体 = 各来源 `content_sha256` 文件快照中的记录；不证明运行已结束、不代表整次会话或平台账单；列出 partial / empty / unavailable 来源的 `source_id`，不含路径）、`acquisition`（`ok|gaps` 与逐来源状态 / 原因）、`observation`（6 项度量 tokens / main_attempts / tool_calls / retries / rework / timing 各自 complete / partial / unavailable + 原因 + 单位 + 总体；tokens / tool_calls 另列 `missing_sources` 与 r5 的 `unconfirmed_sources`（单位“来源”，不与记录数相加，§4.3）；overall，§4.7）、`sources[]`（证据标识、状态、原因类别、坏行数、血缘 / 关系状态、观测到的归属记录数（可为 0）、复制件数 / 净新增记录数（血缘 `net_new_determined: false` 的全部情形为 unknown，见 §3.4 第 4 层；无血缘来源为 0 / 全部记录；r5 / r6）、逐来源度量、逐来源执行结果）、`relations`（每条 duplicate_of / nested_of / disjoint：类型、origin = annotation、basis、生效与否及原因、核验方式 `v3_keyset|unverified`）、`tokens`（每维已知小计 / 已知记录数 / 部分下界 / 未知数 / 无效数，子集，组合已知小计、完整总计或 unknown + 原因列表（来源缺口 / 选择缺口 / 未确认分区 / 记录未知，后者含 `entry_appended_usage_unrecognized`；已确认集合为空时 `no_confirmed_records`，分组守恒计算失败时 `group_conservation_failed`，r5）、去重状态、峰值（标签“主 assistant 尝试内的来源上报输入峰值”，附“操作记录输入不参与、非单请求值”的注明）、类别分解：主调用 / 摘要 / usage 条目按 kind / 嵌套工具 / 无法识别的用量记录（仅计数））、`attempts`（`main_assistant`：按状态计数、observed_total、run_total（Value）；`model_operations`：按类别记录数、带 usage 数、request_count = unknown）、`tool_calls`（`direct` 按状态（只含模型发起的调用）、`proposed_only`、`nested_reported`、r5 的 `nested_executed`（finished / unfinished / terminal_only / parent_unresolved / observed_total，只来自 json-events）与 `nested_deduplicated`（observed_total / matched / executed_only / reported_only）、`all_total`（Value）、原因；各嵌套视图不与 direct 相加）、`retries`（scope = “观测到的 pi 自动重试（assistant 循环级）”；confirmed、scheduled_unobserved、total；`summarization_retry_markers` 单列；`semantic_rework`）、`timing`（逐来源耗时 / 结果 / 部分耗时（仅来自 `observed_until` 标注）；批次窗口或 unknown + 原因；会话耗时合计或 unknown）、`groups`（phase / role / model / channel 各自含 `(未知)` 组及守恒标记；守恒标记由计算得出，另有 `denominator`、`missing_sources` 与 r5 的 `unconfirmed_sources`，§4.3）、`comparability`、`unobserved_paths`（物理 HTTP / SDK / provider 层请求与重试、session-v3 的进行中尝试 / 重试 / 工具耗时、json-events 中的 branch summary（不发会话事件）、失败 / 中止的缓存预热请求（两种格式均不追加条目）、操作记录的请求数、无 usage 的工具内模型工作、`complete=false` 的嵌套路径）。无任何金额字段。

## 4. 关键流程

### 4.1 主流程

`main` → `load_manifest` → 校验 out-dir → 逐来源 `read_source`（失败转为该来源 `unavailable` + 原因类别：`source_missing` / `source_unreadable` / `unsupported_format` / `unsupported_version`）→ `build_report` → `render_summary` → 独占创建写出（§2）→ 打印状态行 → 返回 0 / 3（§4.7）。

### 4.2 读取

二进制打开（`"rb"`），按 `b"\n"` 逐行切分并去掉行尾 `\r`（不用会把 U+2028 当行界的切分方式），逐行 `json.loads`。坏行计数并使来源成为 `partial`；末行无换行且解析失败记 `truncated`（`partial`）。只抽取白名单字段：类型、id / parentId / timestamp、role、provider / model、stopReason、usage 数值、toolCallId、`tool_execution_start` / `tool_execution_end` 的 `parentToolCallId`（r5；只用于嵌套判定与内部身份哈希，不输出、不进入 records.json；`tool_execution_update` 仍不读）、assistant content 中 `toolCall` 块的 type 与 id（不取参数）、isError、durationMs、nestedCalls 的 id / status / complete、usage 条目 kind、`auto_retry_start.attempt`、`auto_retry_end.success / attempt`、`summarization_retry_*` 的 type 与 source、`agent_settled.aborted`、header 的 id / version / parentSession；`entry_appended.entry`（r4）只取 `type` 与 `id`，仅当 `type=usage` 时再取 kind / provider / model / usage 数值，仅当 `type=compaction` 时再取 usage 数值；其他类型只检测顶层是否存在 `usage` 键、不读其值，存在则记一条 `entry_unrecognized`（四维 unknown，原因 `entry_appended_usage_unrecognized`，不输出其类型名）。永不读取 summary、details、systemMessage、firstKeptEntryId、customType、data（含其中形似 usage 的键）、content、note 或其他负载。provider / model / kind 按 §3.1 的 provider / model 类校验（含路径形值拒绝），不符则显示 `(无效标签)` + `invalid_label`，不回显原值。合法读完但没有任何用量归属记录（§3.3，如只有 header）的文件 → `empty`（无可用数据，§4.7），其余已抽取事实照常保留。

**收尾判据（`pi-json-events`，P3-R2-4）**：来源为 settled 当且仅当流中存在 `agent_settled`，且**末个** `agent_settled` 之后没有任何运行活动记录。运行活动类型（json.md 公开事件）= `agent_start`、`agent_end`、`turn_start`、`turn_end`、`message_start`、`message_update`、`message_end`、`tool_execution_start`、`tool_execution_update`、`tool_execution_end`、`compaction_start`、`compaction_end`、`auto_retry_start`、`auto_retry_end`、`summarization_retry_scheduled`、`summarization_retry_attempt_start`、`summarization_retry_finished`。末个 settled 之后只允许非运行类记录 `queue_update`、`session_info_changed`、`thinking_level_changed`、`entry_appended`（json.md“Queue and state events”）。以下 → `partial` + `stream_not_settled`（可能截断，后续消耗可能被隐藏）：没有任何 `agent_settled`；末个 settled 之后出现运行活动（新一轮运行未再 settled）；末个 settled 之后出现两表之外的未知记录类型（不能证明非运行）。多个 prompt 各自 settled 时只看末个，被后续 settled 收尾的中间运行不是缺口。判据只用记录类型与顺序，**不**使用文件 mtime、条目 / 消息时间戳或当前时间。尾随 `entry_appended` 不使来源 partial；其 entry 与任何位置的 `entry_appended` 一样按上文白名单抽取，抽取出的用量记录（如 settled 之后的 `cache_warm` usage 条目）照计入 §4.3 的已知小计与完整总计（r4）。判据本身仍只看记录类型与顺序。该判据只决定来源采集状态与 §4.7 main_attempts 的“已 settled”，不改变退出码定义（`loaded` 且其他条件满足 → 0；`stream_not_settled` → 3）。

### 4.3 聚合

关系分区与去重（§3.4）→ 每维累加 known、单列 partial / unknown → 组合已知小计（已确认总体内四维全 known 的记录；缺失 / 部分来源以外的可用来源，以及部分来源中已确认的有效记录照计）→ **完整总计**：以下全部成立时才等于组合已知小计，否则为 unknown 并列出原因：

1. **选定总体完整**：每个选定来源均为 `loaded`，即无 `unavailable`（`source_missing` / `source_unreadable` / `unsupported_*`）、无 `partial`（坏行、`truncated`、`stream_not_settled`）、无 `empty`；`empty` 的来源报告“观测到的归属记录 0 条”，token 消耗为 unknown（`no_usage_records_observed`），不当作 0；
2. **无未解决的选择 / 关系缺口**：无未确认分区，无失效的 `duplicate_of` / `nested_of`，无 `parent_not_selected`；
3. 所有归属记录四维 final-known，且无 unreconciled。json-events 经 `entry_appended` 抽取的 usage 条目 / compaction 属归属记录，照此条参与；`entry_unrecognized` 四维恒 unknown，出现即使完整总计 unknown（原因 `entry_appended_usage_unrecognized`），不静默丢弃（r4）。

“已有记录全部 known”不能单独推出完整总计：缺失或截断的来源不产生记录，对空集说“全部 known”是空真。完整总计只对“选定记录总体”成立，摘要同时列出该格式不暴露的类别（§3.6 `unobserved_paths`），不表述为整次会话或平台账单。→ 分组：每个维度（phase / role / model / channel）独立分组，记录无值进 `(未知)`，并**计算**每维各组已知小计之和是否等于已确认总体已知小计（不跨维度相加），结果写入该维 `conserved`。

**分组守恒不用生产断言（r5，P3-CR-3）**：生产代码不用 `assert`（`python -O` 下会被移除，失败时又会以 `internal_error` 中断报告）。任一维 `conserved` 为 false → `tokens.reasons` 加 `group_conservation_failed`，完整总计置 unknown，tokens 度量由 complete 降为 partial（其余状态不变），报告照常写出。分组与批次小计取自同一已确认记录集，该分支按构造不应发生，只作诚实降级；tokens 度量状态须在分组计算之后再进入 `observation`。

**空集原因（r5，P3-CR-1）**：`no_usage_records_observed` 只表示来源为 `empty`（观测到的归属记录 0 条），只经来源缺口给出，聚合本身不再因记录集为空而追加它。批次或分组的已确认集合为空、或某 `loaded` 来源的净新增集为空（记录全部落入未确认分区、被 `duplicate_of` 取代、被嵌套覆盖或为血缘复制件）→ 原因 `no_confirmed_records`；逐来源聚合中来源本身为 `empty` / `unavailable` 时只给其采集原因，不追加空集原因。

**未确认分区下的分母（r5，P3-CR-1）**：与来源缺口同理（T-13～T-15 已落实）——只要存在未确认分区，就有已观测但未确认去重的记录在已确认总体之外，选定总体的记录数不能由已确认子集代表。故 tokens 与 tool_calls 覆盖行的分母、缺失数、覆盖率为 unknown，分组节各维分母与各组缺失数为 unknown，token 节的未知用量归属记录数为 unknown（JSON 中仍保留观测计数，同 T-14 / T-15）；另以 `unconfirmed_sources`（单位“来源”，不与记录数相加）披露：tokens 与分组 = 存在来源级或记录级未确认分区的来源数；tool_calls = 存在来源级未确认分区的来源数（记录级未确认只涉 toolResult 用量，不影响调用身份，该来源仍在 tool_calls 的已确认总体内）。被生效 `duplicate_of` 取代或被嵌套覆盖的来源属于已确认去重，不计入。`covered` 与已知小计照常给出；全部来源 `loaded` 且无未确认分区时输出不变。

### 4.4 重试与返工（P2-2）

- **度量名与范围**：“观测到的 pi 自动重试（assistant 循环级）”。只覆盖 pi agent 循环发出 `auto_retry_*` 标记的重试；provider / SDK / HTTP 层重试永远列入 `unobserved_paths`；`summarization_retry_*` 单列为“摘要重试标记”，不并入。
- **已确认关联**（只在 `pi-json-events`；事件顺序已按 pi 1.4.0 公开源码核实，见下条，P3-R2-3）：每个 `auto_retry_start` 开启一个**括号**，止于其后最先出现的下一个 `auto_retry_start`、`auto_retry_end` 或 `agent_settled`（流截断时止于文末）。括号前最近一条 assistant `message_end` 为 `stopReason=error`，且括号内观测到新的 assistant `message_start` → `confirmed +1`（括号内首个 assistant `message_start` 即该次重试尝试），两次尝试都计入主尝试。确认的是“重试关系已被观测”，与重试尝试自身结局无关：括号内的新尝试随后 `message_end(error|aborted)` 仍计 1（它可开启下一括号）。括号内没有新 assistant `message_start`（如退避等待中被中止：`auto_retry_end{success:false, finalError:"Retry cancelled"}`，或流截断）→ `scheduled_unobserved +1`，不计 confirmed。`auto_retry_end` 只作括号终点：`success:true` / `false`（含最终失败与取消）本身都不是尝试证据，不单独计数；`auto_retry_end(success:false)` 之后出现、不在任何括号内的新 assistant 尝试（如下一个 prompt 的运行）不计 confirmed。不按先后顺序或成败状态推断关联：无标记的失败 → 成功、compaction 溢出恢复后的继续（无 `auto_retry_*`）都不计。
- **源码核实的顺序**（只读公开安装包；哈希与行号见 §7 r3）：失败尝试 `message_end(error)` → `turn_end` → `agent_end{willRetry:true}`；`_startRun` 循环调 `_handlePostAgentRun` → `_prepareRetry` 发 `auto_retry_start{attempt:k}`，退避后返回 → `agent.continue()` → `runAgentLoopContinue` 发 `agent_start`、`turn_start` → `streamAssistantResponse` 发新 assistant `message_start` … `message_end`。新尝试非 error 时，`_handleAgentEvent` 在**转发该 `message_end` 之后**才发 `auto_retry_end{success:true}`（早于其 `turn_end` 与工具事件）；新尝试仍 error 且未超上限 → 下一个 `auto_retry_start{k+1}`；超上限 → `_handlePostAgentRun` 发 `auto_retry_end{success:false, finalError}`；退避中中止 → `_finishCancelledRetry` 发 `auto_retry_end{success:false,"Retry cancelled"}`；最终 `_emitAgentSettled` 发 `agent_settled`。故新尝试的 `message_start` 恒在 `auto_retry_start` 之后、对应 `auto_retry_end` 之前，上一条规则与实际一致，无遗留“待实施时假设”。json 模式按发射顺序逐条写出所有会话事件，只改写 `message_update`。pi-agent-core `handleRunFailure` 可合成 `usage` 全 0 的 assistant error 消息：它仍是观测到的逻辑尝试（零值按 §3.3 为 unknown），不证明发生了物理请求。
- **唯一的总数规则**：原生读取器对每个来源恒输出 `total = unknown(retry_total_not_provable)`，无论有无标记——标记缺失不证明 0，且冻结 AC-005-2 要求“失败 → 成功而无关联”时重试数未知，原生来源无法在不推断的前提下区分这两种情况。`confirmed` 只作已知小计（下界）。session-v3：`confirmed` 与 `total` 均 unknown（`retry_markers_not_persisted`）。批次 `total` 只在每个来源的 `RetryFacts.total` 都 known 时才 known——v1 原生读取器从不产生这种事实，该路径只由 §5 的归一化域样例 D1 在 `build_report` 边界验证。因此 retries 度量对原生来源恒非 complete（json：partial；session：unavailable）。
- **语义返工**：只取 `rework` 标注，与传输重试分列；缺标注 → unknown。

### 4.5 时间与完整性

逐来源：标注 start + end 合法 → 耗时 known、时间度量 complete，结果取 §3.5。只有 start → 时间 partial：同一标注带 `observed_until`（与 start 同为带偏移，或同为无偏移；`observed_until ≥ start`；有 basis）→ 部分耗时 = observed_until − start，标“标注观测至（下界）”；否则耗时 unknown。都无 → unavailable、耗时 unknown。end 与 observed_until 并存且 observed_until > end → 该来源时间无效（unknown + 原因）。原生记录时间戳的跨度一律不作耗时、部分耗时或下界（§3.2），也不填 0。**时间独立于来源采集状态与 token 去重**（P3-2）：来源文件 unavailable / partial / empty 时，其合法 `timing` 标注照常进入会话耗时与批次窗口；`nested_of` / `duplicate_of` 只决定 token 归属，被覆盖的子会话仍属于所选会话，不删去其时长。批次窗口 = 所选会话的最晚确认 end − 最早确认 start，须每个所选会话的边界都 known、带偏移且可比；不能丢弃时间未知的来源来使窗口看似完整。会话耗时合计同样基于所选会话，单列、不称批次耗时。只有证据明确为同一会话同一观测窗口的重复采集，且确认起止一致时，才在时间维度计一次；重复身份 / 边界有冲突则相关时间汇总 unknown，不直接套用 token 的排除集合。

### 4.6 比较

`--compare-with` 先校验 `dhb-report/1`，只投影其比较所需元数据：`batch.baseline_commit`、`batch.conditions`、各来源已知物理模型集合、`semantics` 与来源格式集合；不把任意输入 dict 或原始字段直接复制到新报告，标签与错误按 §3.1 校验 / 脱敏。基线不同仅“已披露”。物理模型集合、config_label、task_scope、度量版本、来源格式集合中任一已知差异 → “条件不同、不可直接比较”；缺失条件同时列示，不因缺失而隐藏已知差异。没有已知差异但有缺失 → “可比性未知”；全部已知且相同 → “比较条件相同”，不等于基线充分或质量相同。人工说明带出处展示，不移除变化警示。不计算差值、不出节省或质量结论。

### 4.7 按度量完整性、退出码与四层状态（P2-1）

| 度量 | 单位 / 总体 | complete | partial | unavailable |
|---|---|---|---|---|
| tokens | 用量归属记录（含 json-events 经 `entry_appended` 抽取者）；选定且已确认去重的快照记录 | §4.3 完整总计 known | 有任何 known / 下界值，但完整总计 unknown | 无任何 known / 下界值 |
| main_attempts | 观测到的主 assistant 逻辑尝试 | 每个来源 `attempt_run_total` known 且已确认去重（原生只有 `loaded`、按 §4.2 收尾判据已 settled、无 inflight / terminal_only 的 json-events 产出 known） | 有观测计数但不满足 complete（任一 session-v3 来源恒属此类：pending 不持久化、快照不证明运行结束） | 无可用来源 |
| tool_calls | 来源内调用身份的 `direct` 视图（只含模型发起的调用；嵌套执行不入分母，r5） | 每个来源 `loaded`，全部为 finished，无 proposed_only / terminal_only / 同作用域 ID 复用 / owner 未解析，无 `complete=false`，无 `nested_parent_unresolved` / `nested_execution_incomplete`（r5），已确认去重 | 其他有计数情况 | 无可用来源 |
| retries | 已确认的 pi 自动重试关联 | 批次 total known（原生来源永不满足，§4.4） | json-events 有已确认小计 | 只有 session-v3 或无可用来源 |
| rework | 逐来源 `rework` 标注 | 每个选定来源都有标注 | 部分来源有 | 都没有 |
| timing | 逐来源确认起止；批次窗口 | 每个所选会话起止 known 且批次窗口 known | 部分 | 无任何标注 |

- **覆盖计数的分母**（T-13～T-15 落实、r5 扩展）：tokens / tool_calls 两行与分组节的分母、缺失数，在任一选定来源非 `loaded`，或存在未确认分区（§4.3）时为 unknown，百分比随之不给；rework / timing（单位“来源”）与 main_attempts / retries（分母取自 run_total / total）不变。tool_calls 的分母只含 direct，嵌套执行永不计入（r5）。
- **overall** = 6 项全部 complete；任一项完整不推出整体完整。v1 原生来源下 retries 恒非 complete，故 **overall 对任何原生输入都是 incomplete**——这是来源能力的如实结论，不另造来源或开关补齐。`unobserved_paths` 中的项属于声明范围之外，只披露、不计入上述 6 项。
- **四层状态分开报告**，摘要与 stdout 都不混用：①**报告生成**：产物是否全部写出（退出 0 / 3 = 已写；1 / 2 = 未完成）；②**来源采集**：`sources=ok|gaps`（退出 0 vs 3），来源失败时绝不报告采集成功（AC-001-4）；③**度量覆盖**：上表逐项状态与 overall；④**观测到的执行结果**：逐来源 completed / failed / cancelled / timeout / unknown（§3.2 / §3.5）。第五层**业务验收 / Gate** 本工具从不判定，摘要固定写“非验收结论”。
- AC-001-3 的“完整报告”按 R1 认可的解读 = 全部报告产物按 schema 完整写出，**不是**对全部实际调用的完全掌握；F1 的“已知完整”= **token 度量** complete，不是整体观测完整。

## 5. 验收对应

以下命令均为**未来**命令，本阶段未执行：`cd backend && python -m pytest tests/test_dev_harness_budget.py -q -k <测试名>`；全量 `python -m pytest tests/ -q`。测试数据分三层，不混称：

- **原生文件样例**（F1～F14，由 `backend/tests/dev_harness_budget_fixtures.py` 在 `tmp_path` 写出合成 pi 格式 JSONL，经 `read_source` 读取）：F1 token 度量已知完整的 session-v3 会话（100/40/10/20、reasoning 5、stopReason stop）、F2 快照 + 重复 + 重试括号流（已 settled；正例按 §4.4 源码核实顺序构造：`message_end(error)` → `turn_end` → `agent_end{willRetry:true}` → `auto_retry_start{1}` → `agent_start` → `turn_start` → 新 assistant `message_start` → `message_update` 6 / 10 → `message_end(stop)` 12 → `auto_retry_end{success:true}` → `turn_end` → `agent_end` → `agent_settled`；负例：括号内重试再 error → `auto_retry_start{2}` → 第三次成功、退避中取消（`auto_retry_end{success:false,"Retry cancelled"}`，括号内无新尝试）、`auto_retry_end{success:false}` 之后下一个 prompt 的新尝试；r5：F2 的 toolResult 带 `nestedCalls`，因此须按 §7 r5 核实的顺序同流写出对应嵌套执行事件——父 `tool_execution_start{call_0}` → 嵌套 `call_0/1` start / end（均带 `parentToolCallId: call_0`）→ 嵌套 `call_0/2` start → 父 `tool_execution_end` → toolResult `message_start` / `message_end`（`nestedCalls` = `call_0/1` ok、`call_0/2` unfinished，`complete=false`）→ 嵌套 `call_0/2` end（未被等待的嵌套调用在父结果之后结束）；记录 id 与执行 `toolCallId` 相同且不重复（pi 记录器不产生重复 id；“父调用内按 id 去重”的防御性断言改由 session-v3 样例承担，session-v3 不持久化嵌套事件））、F3 中断流 + 并行 / 超时 / 缺结束标注 / start + observed_until / 带跨数小时原生时间戳但无标注、F4 无标记失败→成功（已 settled）、F5 血缘 / 同会话双采集 / duplicate_of（v3 键集包含与不包含、目标缺失）、F6 v2 / 缺失 / 目录 / 坏 JSON / 只有 header / “缺失来源 + 有效来源”组合 / 无 `agent_settled` 的流 / 不可用来源带合法 timing 标注 / §4.2 收尾判据（正例：settled 后仅尾随 `queue_update`、`session_info_changed`、`entry_appended`；两个 prompt 各自 settled；负例：settled 后出现新 `agent_start` / `message_*` 而无新 settled、settled 后出现未知记录类型）、F7 零值与对账（含缺 `totalTokens` 而四维全 known 的正例，`totalTokens` 为字符串 / 负数、与四维和不等的负例）、F8 嵌套用量与 nested_of（单子正例；多来源 `all_nested_children_declared=false` 且选入未声明 `nested_of` 的子来源（负例）；血缘 + 嵌套：子会话 header `parentSession` 指向 P 并复制 P 的前若干条目，净新增记录逐维和 = P 的 toolResult usage 而含复制件的原始和 ≠（正例），净新增逐维不等（负例）；负例：父结果无 usage、tool_call_id 不存在、T 在两轮复用、`complete=false`、单子值不一致；两子同 (P,T)：逐维和相等正例、四维合计相等但逐维不等、一子维 unknown）、F9 未选文件与私有目录哨兵 + 路径形标签哨兵（`C:/Users/…`、`//server/share/…`、`/private/…` 放于标注与来源 provider / model）及安全 ID、F10 out-dir 中预先存在的 `summary.md` / `report.json` 与名为 `.summary.md.tmp` 的选定来源、F11 关系图（自环、缺目标、duplicate 环、nested 环、dup + nested 混合环、同源双声明；可通过校验的链式重复、链式嵌套、混合分量）、F12 尝试与工具身份（events 只有 start 的 assistant、只有 end 的 assistant、只有 start 的工具、assistant toolCall 无执行证据、`call_0` 在两轮各执行一次、同轮重复 id、父 nestedCalls 两条 + 子会话两条不同 id 的直接调用）、F13 `entry_appended` 用量记录（r4；json-events、已 settled，主尝试同 F1 为 `message_end(stop)` 100/40/10/20；(a) settled 后尾随 `entry_appended{type:usage, kind:cache_warm, usage 5/1/30/4}`；(b) `turn_end` 之后、settled 之前的边界 `entry_appended{type:compaction, fromHook:true, usage 20/5/3/2}` 以同一 id 出现两次，另有一次常规 `compaction_start` → `compaction_end{result.usage 8/2/1/1}`；(c) settled 后一条未知类型但带顶层 `usage` 的 `entry_appended`（数值为哨兵 987654）；(d) 隐私负例：`entry_appended` 的 custom（customType / data 含哨兵及形似 usage 的键）、custom_message（content 哨兵）、边界 compaction 的 summary / details / systemMessage 哨兵、usage 条目 note 哨兵）、F14 同流嵌套工具执行（r5；json-events、已 settled，按 §7 r5 核实的顺序：assistant `message_end(toolUse)` 发起 `call_1` → 父 `tool_execution_start` → 带 `parentToolCallId` 的嵌套 `tool_execution_start` / `tool_execution_end`（可夹 `tool_execution_update`，不读）→ 父 `tool_execution_end` → toolResult `message_start` / `message_end`（`nestedCalls` 列出同一批 id）→ 第二次 assistant `message_end(stop)` → `agent_settled`；(a) 两个嵌套 `call_1/1`、`call_1/2`，记录 `complete=true`；(b) 多层：`call_1/1` 再调用 `call_1/1/1`（其 `parentToolCallId` = `call_1/1`），记录按开始顺序三条；(c) 在 (a) 基础上另有一次嵌套执行，其 `parentToolCallId` 在同一 owner 作用域内无对应（父未解析），不在记录中；(d) 两次嵌套执行、记录只列第一条且 `complete=false`（模拟 256 条上限）；(e) 并行：同一 assistant 发起 `call_A`、`call_B`，两父 start 先发出，嵌套 `call_A/1`、`call_B/1` 事件交错，两条 toolResult 各列自己的记录；(f) `call_0` 在两轮各执行一次、各有嵌套 `call_0/1`）。
- **归一化域样例**（D1，在测试中构造类型化 `SourceFacts` 注入 `build_report` 这一声明的系统边界）：全部度量“来源已确认”的合成事实（含 retries total known、timing 起止），只测全部已知时的聚合与 overall complete 路径；测试名与注释标明“不代表任何原生读取器能产出这些事实”，期望值以字面量写出，不复写算法。
- **真实试点**：用户已授权（2026-10-31，“全修，T-12同批完成，授权脱敏”；范围与约束见 review.md 与 tasks.md T-12），修复任务完成后由协调者以最终代码执行，见 AC-008-1 / AC-008-3。

期望值以字面量写在测试中，测试不复写聚合算法。外部边界观测在测试辅助模块中注册一次 `sys.addaudithook`，通过测试控制的 active 标记只在被测接口调用期间记录 `open`、`socket.*`、`subprocess.Popen`、`os.system`、`os.kill` 等事件，结束时关闭计数。Python 审计钩子没有移除 API，因此不承诺每个测试后卸载钩子；钩子不进入生产模块、不要求生产代码增加测试开关。

| AC | 实现位置 | 测试（样例） | 断言要点 |
|---|---|---|---|
| AC-001-1 | `load_manifest`、`read_source` | `test_only_selected_sources_opened`（F1+F9） | 审计 `open` 路径 ⊆ 清单 + 选定来源 + out-dir；未选文件 / 私有目录未被打开，其哨兵不在输出 |
| AC-001-2 | `read_source` | `test_historical_records_same_semantics`（F1 旧时间戳副本） | 无任何进程 / 网络事件；与新记录同口径产出相同度量 |
| AC-001-3 | 全模块（无网络代码） | `test_zero_model_and_network_attempts`（F1+F2） | 清空凭证类环境变量；审计 socket 连接 / 解析与进程事件计数 = 0；退出 0，`summary.md` 与 `report.json` 按 schema 完整写出（“完整报告” = 产物完整，§4.7），不断言 overall complete |
| AC-001-4 | `read_source` 原因类别、§4.2 收尾判据、§4.3、§4.7、写出、`main` | `test_observation_failures_marked`（F6）、`test_stream_settled_tail_rule`（F6）、`test_exit_codes_separate_acquisition_from_coverage`（F1、F3、F6）、`test_selected_source_gap_blocks_full_total`（F1+F6）、`test_no_effect_on_observed_work`（F1 + 合成 `specs/demo/` 沙箱）、`test_existing_outputs_never_overwritten`（F10）、`test_write_failure_cleans_own_artifacts_only`（F10，文件系统边界注入） | 不可用来源标原因、不填 0；settled 后仅非运行类尾随 / 两 prompt 各自 settled → `loaded`，settled 后有运行活动而无新 settled、未知尾随类型、无 settled → `partial` + `stream_not_settled`，不读 mtime / 时间戳；F1 → 退出 0、`sources=ok`、overall incomplete；缺失 / 坏行 / 只有 header / 未 settled → 退出 3、`sources=gaps`，stdout / 摘要不出现“采集成功”或“观测完整”；有效 S1 + 缺失 S2 → S1 已知小计 170 保留、完整总计 unknown（`source_missing`），S2 不显示 0；源文件与沙箱 spec / checklist / review 哈希前后一致；源只以 `rb` 打开；审计无 Popen / kill / system；预先存在的目标与临时文件样名来源哈希不变、退出 2、无本次残留；第二个产物写出失败 → 只删本次创建的文件，清理失败时退出 1 + `partial_artifacts_left`，不称“未写报告” |
| AC-002-1 | `build_report` 分组 | `test_missing_dimensions_unknown_group`（F1 无 phase 标注来源） | 值为 `(未知)` 且作为独立组，不为空串 / 默认值 |
| AC-002-2 | `load_manifest`、§3.5 | `test_annotation_origin_and_sources_untouched`（F1） | 每维值带 origin；改清单标注后重跑，源哈希不变、结果随标注变化；来源 vs 标注冲突计数 |
| AC-002-3 | §4.3 守恒 | `test_group_conservation_per_dimension`（F1+F2+F5）、`test_group_conservation_computed_not_asserted`（r5，F1+F2） | 每维各组（含未知）之和 = 已确认总体已知小计；未确认分区单列、不参与；r5：生产模块无 `assert` 语句（AST 检查），每维 `conserved` 为计算值且正常路径为 true、`tokens.reasons` 不含 `group_conservation_failed`；失败分支按构造不可达，不对私有函数打桩 |
| AC-003-1 | `normalize_usage` | `test_exclusive_dimensions_total_170`（F1） | 100/40/10/20、reasoning 5 → 总计 170，非 175 |
| AC-003-2 | `normalize_usage` 对账 | `test_subset_fields_and_unreconciled`（F7） | reasoning / cacheWrite1h 只作子集；缺 `totalTokens` → 不对账、总量 170 照常 known、不标 unreconciled；`totalTokens` 无效或与四维和不符、子集超父 → unreconciled、无精确总计；缺维度字段为 unknown |
| AC-003-3 | 峰值 | `test_source_reported_input_peak_150`（F1+F7） | 峰值 150、标签为“主 assistant 尝试内的来源上报输入峰值”（含 spec 原词），无“计费”字样，带覆盖；注明操作记录输入不参与、非单请求值，无操作记录峰值字段；含未知记录时标下界 |
| AC-003-4 | `normalize_usage`、`confirmed_zero`、§4.2 `entry_appended` 白名单、§4.3 | `test_confirmed_zero_vs_placeholder`（F7）、`test_header_only_not_zero`（F6）、`test_selected_source_gap_blocks_full_total`（F1+F6）、`test_entry_appended_usage_records_counted`（F13）、`test_unconfirmed_partition_denominators_unknown`（r5，F5 / F8） | r5：已确认集合为空而选定来源有观测记录（同会话双采集）→ 原因 `no_confirmed_records`，不出现 `no_usage_records_observed`（它只属于 `empty` 来源）；默认 0 → unknown；规则匹配 → known 0 并标 annotation；负数 → invalid；已知 50 + 未知 1 → “已知小计 50、未知 1、完整总计未知”；只有 header → `empty`、归属记录 0 条、token 消耗 unknown，不显示“总计 0”；缺失来源 + 有效来源 → 不把已知小计称为完整总计；F13 (a) → `loaded`、usage 条目 1 条计入、完整总计 210、tokens complete、峰值仍 150；(b) → compaction 记录 2 条（边界 1 + 常规 1）、`duplicate_entry_id` 1、完整总计 212（无重复计）；(c) → `entry_unrecognized` 1 条、已知小计 170、完整总计 unknown（`entry_appended_usage_unrecognized`）、tokens partial、来源仍 `loaded`、退出 0，不显示“总计 170”，987654 不出现在任何输出 |
| AC-004-1 | 流读取 | `test_cumulative_snapshots_final_12`（F2）、`test_nonfinal_partial_lower_bound_10`（F3） | 6/10/12 → 12；无 `message_end` → 非最终、partial 10、不入已知小计；快照不单调 → unknown |
| AC-004-2 | 归属者规则 | `test_repeated_message_counted_once`（F2） | `message_end` / `turn_end` / `agent_end` 中同一响应只计一次；工具 end 与 toolResult 不重复 |
| AC-004-3 | §3.4 | `test_lineage_dedup_confirmed`、`test_ambiguous_overlap_not_deduplicated`、`test_duplicate_of_containment_and_unavailable_target`（F5）、`test_relation_graph_rejected`、`test_relation_shapes_unsupported_retain_facts`（F11）、`test_nested_link_negative_cases`、`test_nested_multi_children_per_dimension`、`test_lineage_net_new_before_nested_coverage`（F8）、`test_lineage_parent_unavailable_not_determined`（r5，F5 变体）、`test_unconfirmed_sources_exclude_replaced_and_covered`（T-21） | r5：血缘父已选入但缺失 / 只有 header / 坏行 → 子来源 `lineage_parent_unavailable`、`net_new_determined: false`、复制件数与净新增记录数 unknown、不出现“复制件由血缘父计”、完整总计 unknown；父坏行时父子进入未确认分区、已确认小计无重复计入；`parent_not_selected` 的复制件数 / 净新增数同样为 unknown；r6：`lineage_usage_conflict` 与落入 `relation_shape_unsupported` 分量的血缘对，复制件数 / 净新增数同样为 unknown，不显示“复制件 0 条”；血缘可靠 → 复制条目只计一次；同会话双采集 / 冲突条目 → 各来源值保留、完整总计 unknown、标“未完全去重”；`duplicate_of`：v3 键集包含且目标 loaded 才生效、标 annotation + basis + 丢弃风险，键集不包含 / 目标缺失 → 两者值保留、无精确汇总；F11 六类非法图 → `manifest_invalid` 且不回显值；链式 / 混合分量 → `relation_shape_unsupported`，每个来源已知值保留，无来源被排除为 0；F8 负例与 T 两轮复用 → 父子值各自保留、完整总计 unknown；两子逐维和相等 → 只计父一次；仅四维合计相等或一子维 unknown → 未确认；多来源 flag=false + 未声明子来源 → 全部带 usage 的 toolResult 在未确认分区、完整总计 unknown、各来源已知值单列、无虚假已确认小计；血缘 + 嵌套 → 先去复制件再逐维比较，净新增和相等即覆盖成立（不因原始和含历史被误拒），净新增不等 → 未确认 |
| AC-005-1 | §3.3 工具身份与视图、嵌套执行事件（r5） | `test_tool_calls_separate_from_attempts`（F2+F8）、`test_tool_identity_and_views`（F12）、`test_nested_execution_events_read_as_nested`（r5，F2+F14，经 `read_source`）、`test_nested_views_dedup_and_direct_coverage`（r5，F14+F12，经 `main`）、`test_nested_executed_reason_uses_selection`（T-21，F5） | r5：带 `parentToolCallId` 的执行永不计入 direct：F14 (a) → direct 1（finished 1）、`nested_executed` finished 2、`nested_reported` 2、`nested_deduplicated` 2（matched 2）、主尝试 2、tool_calls complete，覆盖行分母 1 / 已覆盖 1 / 缺失 0 / 100%，`all_total` unknown（`nested_overlap_unresolved`）；(b) → 嵌套 3、matched 3、direct 1；(c) → `nested_parent_unresolved` 1、direct 仍 1、tool_calls partial、去重后 3（matched 2、executed_only 1）；(d) → 去重后 2（matched 1、executed_only 1）、`nested_incomplete`；(e) → direct 2、嵌套 2 各归其父、matched 2；(f) → 两轮的 `call_0/1` 不合并、去重后 2、无 `tool_call_id_reused_in_scope`；F2 → direct 1、`nested_executed` finished 2、matched 2；无 `parentToolCallId` 的旧流（F12 各例）计数不变；session-v3 → `nested_executed` unknown（`nested_events_not_persisted`）；输出不含 toolCallId / parentToolCallId；工具调用不进尝试数；`call_0` 两轮各一次 → direct 2；同轮重复 → 两次均计入并标 `tool_call_id_reused_in_scope`；只有 start 的工具 → unfinished 计入；toolCall 无执行证据 → proposed_only 单列、不计入；父 nestedCalls 2 条与子会话 direct 2 条分列、不相加，`all_total` unknown（`nested_overlap_unresolved`）；nestedCalls 在父调用内按 id 去重；`complete=false` → 嵌套视图部分；输出不含 toolCallId |
| AC-005-2 | §4.4 | `test_retry_requires_explicit_association`（F2+F4） | 按源码核实顺序的括号 → 尝试 2、已确认 pi 自动重试 1、total unknown；括号内重试再 error 后成功 → 尝试 3、confirmed 2；退避取消（无新尝试）→ scheduled_unobserved 1、confirmed 0；`auto_retry_end(success:false)` 之后下一 prompt 的新尝试不计 confirmed；无标记失败→成功（已 settled）→ 尝试 2、已确认 0（下界）、total unknown，不判 0；排程无后续尝试 → scheduled_unobserved；session-v3 → 重试 unavailable；摘要重试标记单列；provider / SDK / HTTP 重试在 `unobserved_paths` |
| AC-005-3 | 类别分解、`unobserved_paths`、§3.4 第 6 层、§4.2 `entry_appended` 白名单 | `test_covered_and_unobserved_paths`（F1+F2+F8+F13）、`test_attempt_states_and_operation_records`（F1+F3+F12）、`test_nested_link_negative_cases`（F8）、`test_entry_appended_usage_records_counted`（F13） | compaction / usage 条目（含未知 kind）/ 嵌套用量标“已覆盖”且为操作记录、request_count unknown、不计入尝试；events 只有 start 的 assistant → inflight 计入观测尝试、run_total unknown；只有 end → terminal_only 计入；session-v3 → run_total unknown（`pending_not_persisted`）；json 来源 `unobserved_paths` 含 branch summary 与失败 / 中止的缓存预热请求，不含 usage 条目或边界 compaction；F13 的 `cache_warm` usage 条目与边界 compaction 标“已覆盖”、属操作记录、request_count unknown、不计入主尝试、不参与峰值；无 usage 的 compaction、物理请求标“未观测”；摘要写“选定记录小计 ≠ 整次会话或平台账单”；父工具结果无 usage 或 `complete=false` → 嵌套覆盖不成立，子来源已知值单列 |
| AC-005-4 | `rework` 标注 | `test_semantic_rework_annotation_only`（F2+F5） | 返工只来自标注且与传输重试分列；换通道 / 新增来源不产生返工；缺标注 → unknown |
| AC-006-1 | §4.5 | `test_parallel_window_10_sum_20`、`test_timing_independent_of_token_overlap`（F3+F8 标注）、`test_timing_kept_for_unavailable_source`（F6+F3） | 窗口 10 s、会话合计 20 s 分标签；任一边界缺失或无偏移 → 窗口 unknown；父工具覆盖子 token 不删除子会话时长，父 0–10、子 0–5 时合计 15 s；来源文件缺失但 timing 合法 → 其时长仍计入合计与窗口；存在未确认时间来源时不从 token 已确认子集推出完整窗口 |
| AC-006-2 | §4.5、§4.7 | `test_timeout_known_duration_usage_unknown`（F3） | 0→30 s 超时：耗时 30 known、时间 complete、结果 timeout、用量 unknown、overall incomplete；原生 aborted + 明确人工 timeout 原因不当作互斥结局，缺原因则结局 unknown；缺 end → partial / unavailable，不为 0；带原生时间戳但无标注 → 耗时 unknown、不输出下界；start + observed_until → 部分耗时 = 差值，标“标注观测至（下界）” |
| AC-007-1 | `render_summary`、§3.6、§4.3、§4.7 | `test_summary_contents_units_denominators`（F1+F3）、`test_all_known_aggregation_normalized_facts`（D1）、`test_coverage_denominator_unknown_with_source_gaps`、`test_group_denominator_unknown_with_source_gaps`、`test_token_unknown_records_unknown_with_source_gaps`（T-13～T-15，F1+F6；r5 补登记）、`test_nested_views_dedup_and_direct_coverage`（r5，F14）、`test_unconfirmed_partition_denominators_unknown`（r5，F5 / F8）、`test_unconfirmed_sources_exclude_replaced_and_covered`（T-21） | 来源缺口（T-13～T-15）与未确认分区（r5）下，tokens / tool_calls 覆盖行、分组节、token 节的分母 / 缺失 / 未知记录数为“未知”，另列 `missing_sources` / `unconfirmed_sources`（单位“来源”）；同会话双采集（全部 loaded）→ 退出 0、`sources=ok`，覆盖行与分组节不出现已知分母或“缺失 0”；F8 未声明子来源（只有记录级未确认）→ tokens 与分组分母未知，tool_calls 分母仍已知；全部 loaded 且无未确认分区 → 摘要逐字不变；tool_calls 分母只含 direct（r5）；摘要含已知小计 / 分组 / 覆盖计数 + 单位 + 分母、峰值标签与注明同 §3.3、四层状态分列（报告生成 / 来源采集 / 度量覆盖 / 执行结果）与“非验收结论”、证据标识；总体说明写明“`content_sha256` 快照中的记录，不证明运行已结束”并列出非 loaded 来源；分母未知不出百分比；“观测到的归属记录 0 条”与“token 消耗未知”分列；无事件回放；D1 → 6 项 complete、overall complete、完整总计为字面量 |
| AC-007-2 | 白名单抽取、§3.1 标签分类、固定错误类别 | `test_path_shaped_labels_rejected_not_echoed`（F9）、`test_privacy_sentinels_absent`（F1+F2+F9+F12+F13，哨兵放于提示、思考、工具参数 / 结果、toolCallId、errorMessage、摘要、cwd、parentSession、标签、bash 输出、usage note、路径目录名，以及 F13 `entry_appended` 的 custom customType / data、custom_message content、compaction summary / details / systemMessage，r5 另加 F2 嵌套执行事件的 `parentToolCallId`） | 所有输出文件 / stdout / stderr（含失败与注入的内部错误）检索不到哨兵；合法用量仍正确（F13 的 usage 条目 / 边界 compaction 照计，custom / custom_message 不计数）；路径形标注 → `manifest_invalid` + 字段路径；路径形来源 provider / model → `(无效标签)`；两者原值都不出现；非法 CLI 参数 / 无效清单键的错误也不回显参数值、路径或原始键名；`openai/gpt-6.1-sol`、`qwen3:32b`、`claude-opus-5-5` 正常保留 |
| AC-007-3 | out-dir 守卫 | `test_repo_state_unchanged`（`git init` 临时沙箱 + 本仓库） | 运行前后 `git status --porcelain=v1 --untracked-files=all` 一致；out-dir 在仓库内 → 退出 2、无写出 |
| AC-007-4 | §4.6 | `test_comparability_flags_no_money`（F1 两份报告） | 基线不同仅披露；模型 / 范围 / 口径变 → 不可直接比较；缺 → 未知；人工说明不移除警示；输出无 cost / 金额字段，样例中的 cost 哨兵数值不出现 |
| AC-008-1 | 试点（非代码） | 手动：用户另行选定并授权真实批次后，`python tools/dev_harness_budget.py report --manifest <用户本地清单> --out-dir <用户本地目录>` | 用户已授权（2026-10-31，范围见 tasks.md T-12，修复任务完成后由协调者执行）；不新增模型调用、不重跑任务；在 review.md 只记脱敏计数与“仅证明可用、非基线、不证明节省” |
| AC-008-2 | 样例模块 | `test_synthetic_categories_covered` | F1（token 度量已知完整，原生）/ F2（快照 + 重试）/ F3（未知或中断 + 并行）分别覆盖三类情形；D1 只补“全部度量已知”的聚合路径并标为归一化域样例；样例只含合成文本 |
| AC-008-3 | 试点流程 | 试点前后对被观测 feature 的 `git status` 与其 spec / checklist / review 哈希比对。r7：被观测 feature 即本功能 `dev-harness-budget`，顺序为“前”哈希 / status → 运行报告命令 → “后”哈希 / status（须与“前”一致）→ 再在 review.md 写入脱敏试点记录（记录本身不属于被比较的状态） | 被观测 feature 冻结 AC / checklist / 路由 / Gate 不变；记录写明不构成其验收；不以 desktop-shell / WI 完成为前提 |

计数：27 条 AC 全部有映射（27 行）；其中 25 条由合成样例 / 受控边界验证，AC-008-1 与 AC-008-3 依赖真实试点：用户已于 2026-10-31 授权，由协调者在修复任务完成后执行，执行并经 Review 前不得判通过（Plan 与单元实施不依赖试点数据）。r5 新增测试只加入既有行，不新增 AC 行。映射 ≠ 通过；以上测试均未编写、未执行。

## 6. 风险与回滚

- **原生来源能力有限**：会话 / 事件流都没有可信的开始 / 结束时间，原生时间戳跨度也不作耗时下界；session 源无重试标记、工具耗时与进行中尝试，也无法证明文件之后没有追加；json 捕获不暴露 branch summary（usage 条目与扩展边界 compaction 经 `entry_appended` 抽取计入，r4）；物理请求数一律不可得；默认 0 不确认。因此 overall 对原生输入恒为 incomplete，退出 0 只表示产物写出且来源采集无缺口（§4.7）。这是如实结果，不靠推断补齐；需要时由用户在清单中提供带出处的 `timing`（含 `observed_until`）与 `confirmed_zero` 标注。
- **pi 版本漂移**：口径按 pi 1.4.0 文档与源码；fork 复制保留条目 id 的去重依据只对 1.4.0 验证；§4.4 重试括号顺序与 §4.2 收尾类型按 1.4.0 公开安装包源码核实（哈希见 §7 r3）；`entry_appended` 的发射者与压缩归属同样只对 1.4.0 核实（§7 r4），新版本若让同一压缩同时经 `compaction_end` 与 `entry_appended` 发出，须回 Plan 修订归属。新版本若改格式 → 视为 `unsupported_format` 或回 Plan 修订，不静默适配。
- **嵌套与重叠**：未声明的子会话无法自动识别，故多来源时嵌套用量默认进入“未确认去重”；用户断言（`disjoint`、`all_nested_children_declared`、`duplicate_of`）以 annotation 出处展示，正确性由断言者负责。`duplicate_of` 错误时可能丢弃来源独有的尾部记录（session-v3 可做键集核验，json-events 不能）。`nested_of` 须按 (P, T) 逐维对上父工具结果；链式 / 混合关系不支持，整体进入未确认分区。若真实工具结果的 usage 与子会话之和常不一致，结果会如实显示“未完全去重”，不放宽前提。
- **工具身份**：toolCallId 按 owner 轮次命名空间；nestedCalls 与子会话直接调用无法可靠对应，故存在嵌套证据时全部工具调用总数为 unknown。owner 解析依赖 pi 1.4.0 的 parentId / 事件顺序。同流嵌套执行以 `parentToolCallId` 区分、不入 direct（r5，1.4.0 源码核实）；父未解析者保留为嵌套并阻止 tool_calls complete；新版本若改变嵌套事件字段、id 赋值或 `nestedCalls` 记录方式，须回 Plan 修订，不静默适配。
- **写出**：独占创建只保证不覆盖已存在的路径；创建与清理之间被外部替换的竞态不做防护（AGENTS §5.1）。清理失败时如实报告残留数量。
- **隐私**：源记录与负载同处一行；靠白名单抽取、标签正则、固定错误类别与哨兵测试控制泄漏；不声称通用语义隐私检测。真实清单与报告只放仓库外本地目录。
- **试点依赖**：用户已于 2026-10-31 授权本功能子会话的 json 事件捕获作为试点批次（tasks.md T-12）；试点执行并经 Review 前不得判定 AC-008-1 / AC-008-3 通过。若候选批次缺用量，试点只能报告“不完整 / 不可用”，仍如实记录。
- **回滚**：新增文件仅 `backend/tools/dev_harness_budget.py`、`backend/tests/test_dev_harness_budget.py`、`backend/tests/dev_harness_budget_fixtures.py`（及 Implement 时按需更新 `backend/README.md` 工具表一行）；删除即完全回滚，不涉及数据迁移、打包、配置或其他 feature。

## 7. 修订史

### r2（作者按 Checklist R1 修订；未经独立 A 复核，R1 仍为唯一有效结论）

| R1 发现 | 修订位置 | 修订要点 |
|---|---|---|
| P2-1 | §2 退出码 / 状态行、§3.6 `acquisition` / `observation`、§4.3、§4.7、§5 F1 / D1 与 AC-001-3 / AC-001-4 / AC-007-1 / AC-008-2 | 6 项度量逐项定义单位、总体与 complete / partial / unavailable；退出码与覆盖解耦（0 = 产物写出且采集无缺口，3 = 采集缺口）；承认原生下 overall 不可达；四层状态分列；“完整报告” = 产物完整；F1 = token 度量完整；全部已知路径用 D1 在 `build_report` 边界验证；新增来源状态 `empty` |
| P2-2 | §3.2、§3.6 `retries`、§4.4、§5 AC-005-2 | 度量改名“观测到的 pi 自动重试（assistant 循环级）”；总数单一规则 = 原生恒 unknown，有无标记对称；已确认关联只作下界；provider / SDK / HTTP 重试入 `unobserved_paths`；摘要重试标记单列 |
| P2-3 | §3.2、§3.3、§3.6 `attempts` / `unobserved_paths`、§4.7、§5 AC-005-3 | 主尝试按 completed / failed / aborted / inflight / terminal_only 分列，start-only 计入；操作记录与尝试分开、请求数 unknown；session-v3 不持久化 pending、json 不暴露 usage 条目与 branch summary 的盲区显式披露 |
| P2-4 | §3.1 schema、§3.3 工具身份、§3.4 第 0 / 2 / 6 层、§5 F8 / F11 / F12 与 AC-004-3 / AC-005-1 | 并集图入口拒绝自环 / 缺目标 / 任意环 / 同源双声明；只支持重复星形与嵌套星形，链式 / 混合 → 未确认分区且保留事实；(P, T) 分组逐维和校验，子维未知不跳过；工具身份按 owner 轮次命名空间，direct 与 nested_reported 不相加，proposed_only 不计执行 |
| P3-1 | §3.6 `population`、§5 AC-007-1 | 摘要写明总体 = `content_sha256` 快照中的记录，不证明运行结束，列出非 loaded 来源 |
| P3-2 | §4.5、§5 AC-006-1 | 不可用 / 部分来源的合法 timing 标注照常计入会话耗时与批次窗口 |
| P3-3 | §3.1 `duplicate_of.basis`、§3.4 第 3 层、§3.6 `relations`、§6 | `duplicate_of` 标为作者包含断言，披露 basis、责任与丢弃尾部风险；session-v3 做键集核验；目标不可用不压制有效数据 |

### r3（作者按 Checklist R2 的 5 项 P3 修订；**待独立 A 复核**，R2 通过只覆盖 `57d0d84`）

原始发现以 [checklist.md](checklist.md) R2 为权威；下表只记作者修订的设计与对应测试，不是关闭声明，也不是用户风险接受。R2 已关闭的 R1 4 P2 / 3 P3 不因本次文字修订而重开；r3 未改动其余 R2 已接受的方案。

| R2 发现 | 修订位置 | 修订要点（作者修订、未实施、未测试） | 边界样例 / 测试（未来，未编写） |
|---|---|---|---|
| P3-R2-1 | §3.4 第 6 层末句 | “未被引用的 toolResult 用量照计”只在单来源或 `all_nested_children_declared: true` 时成立；多来源且标志为 false / 缺省 → 全部带 usage 的 toolResult 留在未确认分区，各来源已知值单列 | F8 flag=false + 选入未声明子来源；`test_nested_link_negative_cases` |
| P3-R2-2 | §3.3 来源上报输入、§3.6 `tokens`、§5 AC-003-3 / AC-007-1 | 固定标签“主 assistant 尝试内的来源上报输入峰值”（含 spec 原词）；操作记录输入不参与，注明其非单请求值、请求数 unknown；不新增可选的操作记录峰值 | F1 + F7；`test_source_reported_input_peak_150`、`test_summary_contents_units_denominators` |
| P3-R2-3 | §3.2 重试行、§4.4、§5 F2 / AC-005-2、§6 | 按 1.4.0 公开源码核实：新尝试 `message_start` 在 `auto_retry_start` 之后、`auto_retry_end` 之前，原方向成立，改写为可判定的括号规则；重试尝试自身结局不影响 confirmed；`auto_retry_end` 只作终点，取消 / 最终失败标记本身不计，无新尝试 → scheduled_unobserved；无标记失败→成功不计；原生 total 恒 unknown 不变 | F2 正例 + 三个负例、F4；`test_retry_requires_explicit_association` |
| P3-R2-4 | §3.2 执行结果行、§4.2 收尾判据、§4.7 main_attempts、§5 F6 / AC-001-4 | 末个 `agent_settled` 之后无运行活动（列明 17 种运行类型）才 settled；允许尾随 4 种非运行类记录；未知尾随类型、新运行未 settled、无 settled → `stream_not_settled`；不使用 mtime / 时间戳；退出码与 `loaded` / `partial` / 度量矩阵定义不变 | F6 正 / 负例；新增测试名 `test_stream_settled_tail_rule`（承接原 F6“无 settled 流”样例） |
| P3-R2-5 | §3.3 总量、§3.4 第 4 / 6 层、§5 F7 / F8 / AC-003-2 / AC-004-3 | (i) 四互斥维决定总量；缺 `totalTokens` 不对账、不标 unreconciled；无效或不符 → unreconciled；(ii) 第 4 层血缘去重先于第 6 层，(d) 用子来源净新增记录集逐维比较，复制件不参与 Σ 与完整性要求；`parent_not_selected` / 血缘未确认 → `nested_coverage_unverifiable` | F7 缺 total 正例与无效负例、F8 血缘 + 嵌套正负例；`test_subset_fields_and_unreconciled`、新增 `test_lineage_net_new_before_nested_coverage` |
| 源码核实附带的事实更正 | §3.2 其他模型操作记录行、§3.6 `unobserved_paths` | 原文“json-events 不暴露独立 usage 条目”不准确：1.4.0 缓存预热可在 settled 后经 `entry_appended` 发出 `cache_warm` usage 条目。v1 仍不抽取 `entry_appended`，行为与披露范围不变，只把理由改为“v1 不抽取”，列入 `unobserved_paths` | 随 `test_covered_and_unobserved_paths` 断言该披露项 |

**源码核实元数据（r3，只读公开安装包，不读真实会话 / 日志；包相对路径，版本均为 1.4.0）**：

| 包内文件 | SHA256 | 方法 / 行（核实时） | 证明的顺序 |
|---|---|---|---|
| pi-coding-agent `docs/json.md` | `f1031918…3543` | 全文 | 公开事件类型与“Queue and state events”非运行类 |
| pi-coding-agent `dist/core/agent-session.js` | `436e8be3bbab2db475ce30bb5d0bb30f0046b19a3476f8cd57b8133e68891162` | `_handleAgentEvent` 709–798（753 转发事件，780–787 随后发 `auto_retry_end{success:true}`）；`_startRun` 1423–1473（1449 prompt，循环中 `agent.continue()`，1471 `_emitAgentSettled`）；`_handlePostAgentRun` 1531–1565（1540 `_prepareRetry`，1550–1557 最终失败 `auto_retry_end`）；`_finishCancelledRetry` 3074–3085；`_prepareRetry` 3090–3125（3102 `auto_retry_start` 后退避）；`_emitAgentSettled` 683–705；186 缓存预热 → `entry_appended` | 失败 → `auto_retry_start` → 新尝试 → `auto_retry_end` → settled |
| pi-coding-agent `dist/core/cache-warmer.js` | `9c4b000930d6d3c567073102f6b6a52660110bb0f79cf78dd72c4dd1ebc87fc0` | 149 `onAgentSettled`（空闲后继续预热）、249–250 `appendUsage("cache_warm")` | settled 后可能出现 usage 条目 |
| pi-coding-agent `dist/modes/print-mode.js` / `json-event.js` | `bb070a05…c9f13d` / `5f375647…40d606` | 84–87 订阅后逐条写出、97–101 header；`toJsonEvent` 只改写 `message_update` | json 流顺序 = 发射顺序 |
| pi-agent-core `dist/agent-loop.js` | `22ee81f9977e211044c1ad41a763876c793ca7fc1c5b39b9fa7f76f3cb281129` | `runAgentLoopContinue` 64–77（`agent_start`、`turn_start`）；error / aborted → 156 `turn_end` 后 `agent_end`；`streamAssistantResponse` 265 起（288 provider start → assistant `message_start`） | 重试尝试的 `message_start` 位于新 `agent_start` 之后 |
| pi-agent-core `dist/agent.js` | `f45ae001e2b14fced8ae151f0a00303b5fbdb5fc4b25418d45de6a5546f48a8c` | `handleRunFailure` 368–384（合成 usage 全 0 的 assistant error）；`processEvents` 依次 await 监听器 | 监听器串行，顺序确定 |

### r4（作者按 Analyze R1 修订；**待 Analyze R2 与独立 A**，不是关闭声明）

原始发现以 [analyze.md](analyze.md)（Analyze R1，审 `325e43b`）为权威。作者 `claude-opus-5-5 via claude-bridge`，基线 `64e20e8`。采用 Analyze 修复方向 (a)：白名单抽取并计入。理由：AC-005-3 要求来源**已暴露**的压缩 / 摘要用量“计入并标为已覆盖”，只检测不计数仍会让已暴露的边界压缩不被计入。退出码、六项度量矩阵、§4.2 收尾判据的类型 / 顺序规则与其余 R2 已接受方案不变；r3 的“源码核实附带的事实更正”一行由本节取代。

| Analyze 发现 | 修订位置 | 修订要点（作者修订、未实施、未测试） | 未来测试（未编写） |
|---|---|---|---|
| P2-AN-1 | §2 `UsageRecord.category`；§3.2 json 列“其他模型操作记录”；§3.3 单位与分母；§3.6 `tokens` / `unobserved_paths`；§4.2 白名单与收尾判据措辞；§4.3 第 3 条；§4.7 tokens 行；§5 F13 与 AC-003-4 / AC-005-3 / AC-007-2；§6 | `entry_appended.entry` 只取 type / id，`usage` 取 kind / provider / model / usage 数值，`compaction` 取 usage 数值；与 session-v3 同口径计为“其他模型操作记录”：标已覆盖、request_count unknown、不算主尝试、不参与单请求输入峰值；位置不限（含 settled 之后），收尾判据仍只看类型与顺序。归属唯一：常规压缩 = `compaction_end`，边界草稿压缩 = `entry_appended`，`entry_appended` 内按 entry id 去重。其他类型不读内容，带顶层 `usage` 键 → `entry_unrecognized`（四维 unknown）→ 完整总计 unknown（`entry_appended_usage_unrecognized`），不静默丢弃。`unobserved_paths` 删去不准确的“json 不暴露 usage 条目”，只留已核实盲区：branch summary、失败 / 中止的缓存预热请求 | `test_entry_appended_usage_records_counted`（F13 a～c：210 / 212 无重复计 / unknown）；`test_covered_and_unobserved_paths`（+F13）；`test_privacy_sentinels_absent`（+F13 d） |
| P3-AN-1 | tasks.md T-11 验证命令 10 与完成标准 10 | 改用 `git grep --untracked`，使未跟踪的新文件也被检索，期望无输出不再空真成立；只用仓库已有的 Git | T-11 验证命令 10 |

**源码核实元数据（r4，只读公开安装包，有界 `rg -n "entry_appended"` 后按行读取；不读真实会话 / 日志；包相对路径，版本 1.4.0）**：

| 包内文件 | SHA256 | 方法 / 行（核实时） | 结论 |
|---|---|---|---|
| pi-coding-agent `dist/core/agent-session.js` | `436e8be3bbab2db475ce30bb5d0bb30f0046b19a3476f8cd57b8133e68891162`（与 r3 相同） | `rg` 排除 `dist/bundle` 后全部 `entry_appended` 发射点共 5 处：186（缓存预热 `onWarmed` → usage 条目）、474–476（虚拟模型状态 → custom 条目）、635–640 `_commitBoundaryDrafts`（由 514 `turn_end` 与 1573 `agent_before_settle` 边界调用；`_applyBoundaryDrafts` 578–600 产生 custom / custom_message / context_edit / compaction，594 `appendCompaction(…, true, draft.usage)`）、866–868（恢复省略 → context_edit）、2784–2788（扩展 `appendEntry` → custom）。常规压缩 2297 → 2323 与 2586 → 2609 只发 `compaction_end`，不发 `entry_appended`；`navigateTree` 3384 `branchWithSummary` 后只发扩展 `session_tree`（3407），不发会话事件 | 带 usage 的只有 usage 条目与 compaction；常规 / 边界压缩各只经一种事件；branch summary 不进事件流 |
| pi-coding-agent `dist/core/cache-warmer.js` | `9c4b000930d6d3c567073102f6b6a52660110bb0f79cf78dd72c4dd1ebc87fc0`（与 r3 相同） | 238–250：`streamSimple` 直接请求（不发 `message_*`），仅非 error / aborted 时 `appendUsage("cache_warm", …)` 并 `onWarmed`；149 `onAgentSettled` | 预热不产生主尝试事件；失败的预热不留条目 |
| pi-coding-agent `dist/core/session-manager.js` | `046b6a1109ac3f0ed893bb85bf0648709362fa926a5da75761216cf2fcf9d926` | 864–877 `appendUsage`（type / id / parentId / timestamp / kind / provider / model / usage / 可选 note）；880–898 `appendCompaction`（summary / firstKeptEntryId / tokensBefore / details / usage / fromHook / 可选 systemMessage）；901–911 custom（customType / data）；947–959 custom_message（content / details）；1180 `branchWithSummary` | 白名单字段与禁读负载字段 |
| pi-coding-agent `dist/modes/json-event.js` / `print-mode.js` | `5f375647…40d606` / `bb070a05…c9f13d`（与 r3 相同） | `toJsonEvent` 只改写 `message_update`；print-mode 84–87 逐条写出 | `entry_appended` 原样进入 json 流 |
| pi-coding-agent `docs/json.md` | `f103191816fdcf3627dfc98b89acad8a28eee737697130ddaeb2581131213543` | 第 122 行 | 文档只写“扩展经 `pi.appendEntry()` 追加 custom 条目”，少于源码实际发射范围；r4 以源码为准 |

### r5（作者按 Review R1 修订；**待 Analyze R3 与独立 A Checklist R4**，不是关闭声明）

原始发现以 [code-review-r1.md](code-review-r1.md)（Review R1，审 `f5dbf63`）为权威。作者 `claude-opus-5-5 via claude-bridge`，基线 `70291e3`。用户处置：四项全修、不作风险接受，T-12 同批完成并授权脱敏（review.md“用户对 Review R1 的处置与试点授权”节）。退出码、六项度量矩阵、§4.2 收尾判据与其余已接受方案不变；Checklist R3 只覆盖 r4，r5 改动的规则（§3.3 工具视图、§3.4 第 4 / 6 层、§4.2 白名单、§4.3、§4.7 tool_calls 行与分母）须由独立 A Checklist R4 复核。

| Review 发现 | 修订位置 | 修订要点（作者修订、未实施、未测试） | 未来测试（未编写） |
|---|---|---|---|
| P2-CR-1 | §2 类型；§3.2 工具执行证据 / 嵌套工具调用两行；§3.3 视图与三条 r5 规则；§3.6 `tool_calls`；§4.2 白名单；§4.7 tool_calls 行与分母说明；§5 F2 修正、F14、AC-005-1 / AC-007-1 / AC-007-2；§6 | 白名单增读 `parentToolCallId`（只作内部判定与哈希，不输出）；带父 id 的执行记为 `NestedExecutionRecord`，永不进入 direct；在同一 owner 作用域内按父 id 解析顶层父（direct 优先，其次已解析嵌套子 id；零或多候选 → `nested_parent_unresolved`，仍为嵌套）；嵌套身份 = (来源, 顶层父调用身份, 子 id)，与父 toolResult `nestedCalls` 记录同法构造，按身份去重为 `nested_deduplicated`（matched / executed_only / reported_only）；状态 finished / unfinished / terminal_only；direct 计数、分母与覆盖率不含嵌套，`nested_parent_unresolved` / `nested_execution_incomplete` 与既有 `nested_incomplete` 一样阻止 tool_calls complete；`all_total` 保守，存在任何嵌套证据即 unknown；嵌套 usage 已由 pi 并入父 toolResult `usage`，嵌套 `tool_execution_end.result.usage` 不读，token 口径不变；session-v3 不持久化嵌套事件，只有记录视图 | `test_nested_execution_events_read_as_nested`（F2 + F14 a～f，经 `read_source`）；`test_nested_views_dedup_and_direct_coverage`（F14 + F12，经 `main`）；`test_privacy_sentinels_absent`（+ `parentToolCallId` 哨兵）；既有 `test_tool_identity_and_views` / `test_tool_calls_separate_from_attempts` 随 F2 修正复跑 |
| P3-CR-1 | §3.6 `observation` / `tokens` / `groups`；§4.3 空集原因与未确认分区下的分母；§4.7 分母说明；§5 AC-003-4 / AC-007-1 | 存在未确认分区时，tokens / tool_calls 覆盖行、分组节分母与缺失数、token 节未知记录数与来源缺口同样置为 unknown，另列 `unconfirmed_sources`（单位“来源”；tool_calls 只计来源级未确认）；空的已确认集合用 `no_confirmed_records`，`no_usage_records_observed` 只经来源缺口给 `empty` 来源；全部 loaded 且无未确认分区时输出不变 | `test_unconfirmed_partition_denominators_unknown`（F5 同会话双采集、F8 未声明子来源 + 对照） |
| P3-CR-2 | §3.4 第 4 层、第 6 层 (d)；§3.6 `sources[]`；§5 AC-004-3 | 血缘父已选入但非 `loaded` → 不做键集差，子来源 `lineage_parent_unavailable`、`net_new_determined: false`、复制件数 unknown（同 `parent_not_selected`）；父 `partial` 时父子另入未确认分区以免重复计入；`parent_not_selected` 与 `lineage_parent_unavailable` 的逐来源复制件数 / 净新增数均为 unknown | `test_lineage_parent_unavailable_not_determined`（F5 变体：父缺失 / 只有 header / 坏行 + `parent_not_selected` 对照） |
| P3-CR-3 | §4.3 分组段与“分组守恒不用生产断言”段；§3.6 `tokens` / `groups`；§5 AC-002-3 | 守恒改为计算并写入 `conserved`；false → `group_conservation_failed`、完整总计 unknown、tokens complete → partial；报告照常写出；不用生产 `assert` | `test_group_conservation_computed_not_asserted`（AST 无 `assert` + 正常路径 `conserved` 为 true） |
| 记账（非发现） | §5 AC-007-1 行 | 补登记 Converge R1～R3 追加任务 T-13～T-15 已在用的三个测试名，使 tasks.md 中每个测试名都出现在 §5；规则不变 | — |

**源码核实元数据（r5，只读公开安装包，不读真实会话 / 日志；包相对路径，版本 1.4.0）**：

| 包内文件 | SHA256 | 方法 / 行（核实时） | 结论 |
|---|---|---|---|
| pi-coding-agent `dist/core/nested-tool-calls.js` | `62a69500b63b1967e350305aa5f6762345ceb397fe5c5e7f6e6ca6c8fc16c034` | 全文（178 行）。1–9 头注释（会话自行发 `tool_execution_*` 并带 `parentToolCallId`，调用与 usage 记在模型发起调用的 toolResult 上）；17 `maxCalls: 256`；35–55 `start` 记 `toolCall.id`，超限置 `complete=false` 并丢弃；72–78 `snapshot`（无调用时 undefined；有 unfinished 则 `complete=false`）；98–166 `execute`：106 子 id `` `${callerId}/${n}` ``，110–117 先记录再发 `tool_execution_start{parentToolCallId: callerId}`，129–133 子 id 作为新作用域共享同一记录器（任意深度记入同一顶层记录、孙调用的 `callerId` = 子 id），139–146 update 同带父 id，153–155 “Nested results are not persisted”、usage 只经记录器累加，157–165 `tool_execution_end{parentToolCallId}`；168–174 `takeRecord` | 嵌套执行事件的字段、id 赋值、多层父链；记录 id = 执行 id；结果不持久化、无 toolResult 消息 |
| pi-coding-agent `dist/core/agent-session.js` | `436e8be3bbab2db475ce30bb5d0bb30f0046b19a3476f8cd57b8133e68891162`（与 r3 / r4 相同） | 384–415 `_executeNestedToolCall`（412 `this._emit(event)` 进入会话事件流）；2845 `executeTool` 接线；708–727 `_handleAgentEvent`：toolResult `message_start` 时 `takeRecord(message.toolCallId)`，写入 `message.nestedCalls` 并把嵌套 usage `combineUsage` 进 `message.usage`；`agent_end` 时清空；755 起 `message_end` 持久化（session-v3 的 toolResult 因此带 `nestedCalls`，但不含嵌套事件） | 嵌套事件与主事件同流；`nestedCalls` 与嵌套 usage 都挂在模型发起调用的 toolResult 上 |
| pi-coding-agent `dist/modes/json-event.js` / `print-mode.js` | `5f375647…40d606` / `bb070a05…c9f13d`（与 r3 / r4 相同） | `json-event.js` 全文：`toJsonEvent` 只改写 `message_update`；`print-mode.js` 84–87 逐条写出 | `tool_execution_*`（含 `parentToolCallId`）原样进入 `pi --mode json` 捕获 |
| pi-agent-core `dist/agent-loop.js` | `22ee81f9977e211044c1ad41a763876c793ca7fc1c5b39b9fa7f76f3cb281129`（与 r3 相同） | 380–415 顺序执行：父 start → 执行（嵌套事件在此期间）→ 父 `tool_execution_end` → toolResult `message_start` / `message_end`；417–470 并行：各父 start 先发，执行并发（嵌套事件交错），`Promise.all` 后依次发 toolResult；565–572 `runToolCall`（嵌套调用复用的管线，本身不发事件）；652–680 `emitToolExecutionEnd` / `emitToolResultMessage`（模型发起的调用不带 `parentToolCallId`） | F2 / F14 的事件顺序；direct 事件无父 id |
| pi-coding-agent `docs/extensions.md` | `46fc0baeb00db8ca8db399e33e0f506e86e425693b291258357e8063e2f3353c` | 全文；第 261 行 `ctx.executeTool` 段 | 文档确认：三类执行事件都带 `parentToolCallId`、id 为 `<parent id>/<n>`、这些 id 不作为 transcript 中的工具调用或结果出现、记录有界（256 条，`complete: false`）、各深度嵌套 usage 并入调用者结果 `usage` |
| pi-coding-agent `docs/message-types.md` | `b832893fb762f87fdbbfd694241d484592942823791f3e81a6c4d915421ff5db`（与初稿相同） | 全文；`ToolResultMessage` / `NestedToolCalls` / `NestedToolCallRecord` 段 | 记录字段（id / name / arguments / status / durationMs / error）；本工具只取 id / status / complete |

### r6（作者按 Analyze R3 修订；**待 Analyze R4 与独立 A Checklist R4**，不是关闭声明）

原始发现以 [analyze-r3.md](analyze-r3.md)（Analyze R3，审 `42d1506`）为权威。作者 `claude-opus-5-5 via claude-bridge`，基线 `81c6176`。只修三项 P3；其余规则、任务、退出码、六项度量矩阵与 27 条 AC 映射不变。

| Analyze 发现 | 修订位置 | 修订要点（作者修订、未实施、未测试） | 未来测试 / 命令（未编写） |
|---|---|---|---|
| P3-AN-R3-1 | tasks.md T-12 修改范围（Plan 规则不变） | 改为与已记录授权一致：清单由协调者编写，只列授权范围内的 `budget-*.jsonl` / `review-budget-*.jsonl` 捕获；清单与 out-dir 均放本机系统 Temp 下本功能的临时工作目录（仓库外）；删去 `%LOCALAPPDATA%` 示例与“用户编写清单”。完成标准与验证命令（含占位符）不变 | T-12 手动步骤 1 / 2（不变） |
| P3-AN-R3-2 | §3.4 第 4 层；§3.6 `sources[]`；§5 AC-004-3 断言要点；tasks.md T-19 | 采用方向 (a)：凡 `net_new_determined: false` 的血缘情形（`parent_not_selected`、`lineage_parent_unavailable`、`lineage_usage_conflict`、父或子在 `relation_shape_unsupported` 分量内）复制件数与净新增记录数均为 unknown（null，摘要“未知”），不显示 0；无血缘来源仍为 0 / 全部记录。T-19 明列既有断言改正：542 行（`parent_not_selected`）与 565 行（`test_ambiguous_overlap_not_deduplicated` 的 `lineage_conflict` 分支；`double_capture` 无血缘，保持 0） | `test_lineage_parent_unavailable_not_determined`（+ 链式重复变体）、`test_ambiguous_overlap_not_deduplicated`、`test_lineage_dedup_confirmed`（T-19 验证命令 2） |
| P3-AN-R3-3 | tasks.md T-16 完成标准 1（§5 AC-005-1 行不变） | F2 两条已解析嵌套执行的 `call_ref` 集合 = 父 toolResult `nestedCalls` 记录的 `call_ref` 集合（2 / 2 相等，即 §5 的“matched 2”）进入完成标准；验证命令不变 | `test_nested_execution_events_read_as_nested`（T-16 验证命令 1，不变） |

### r7（作者按 Analyze R4 措辞补正；**待 Analyze R5 与独立 A Checklist R4**，不是关闭声明）

原始发现以 [analyze-r4.md](analyze-r4.md)（审 `4acd8dd`）为权威。作者 `claude-opus-5-5 via claude-bridge`，基线 `d4781fc`。只改措辞：P3-AN-R4-1 → tasks.md T-16 依赖改为“最新一轮 Analyze（R5 或其后）通过、有效 checklist（R4 或其后）全部勾选”；P3-AN-R4-2 → tasks.md T-12 写明被观测 feature = `dev-harness-budget` 与“前核对 → 报告命令 → 后核对 → 写记录”顺序，§5 AC-008-3 行同步一句。完成标准含义、规则、退出码、六项度量与 27 条 AC 映射不变。
