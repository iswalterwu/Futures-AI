# 2026-10-30 D-026 开发导航文档的 main 兼容交付：执行与适配记录

> 性质：本文件是 D-026 已批准文档改造在 `main` 上的**交付执行与适配记录**，不是新的产品 spec、不是新的 ADR，也不改变任何 feature 的范围、AC、Gate 状态或开放风险。
> 状态（快照，非自动更新的完成看板）：A 首轮主线适配审核通过（0 P1、0 P2、2 P3），确认无新实质语义；其中一处定位已按建议修正，待定向确认。快照时 PR / merge 尚未进行；最终交付状态以 PR 元数据与后续 handoff 确认为准，不预写 merge SHA。
> 作者：`claude-opus-5-5 via anthropic`。本阶段对官方通道做了一次最小真实探活并成功；`claude-bridge` 在同一协调者限额窗口内已明确限额耗尽，按 [model-routing 规则 5](../development/model-routing.md#rule-5) 不重复探活。换通道不是换模型。协调者 = `openai/gpt-6.1-sol`，只负责确定性 Git / 核查集成，不撰写本候选内容。

## 1. 固定版本与授权

| 项 | 值 |
|---|---|
| BASE（目标主线） | `origin/main` = `072bb12de3425e1b76357b5771e47f0609b32979` |
| 交付分支 / 工作树 | `docs/agent-navigation-main`，系统 Temp 下的临时 worktree `fai-docnav-20261030/main-delivery`（D-025：用后回收） |
| SOURCE（已批准来源） | `workbench` @ `c2e82e6389dafc9ed85158f01f301d98a36fb730` |
| 已审核对象 | A R2 固定审 `03a1bfe3cdf5dd989b10b3f1c82b34f388b66673`；审核与验收证据提交 `461a703d1df7128bf1c30d8dbd22f4fedfd65a14`；R1 固定审 `8b880c71bf6d6e1acf81bf6aae3c9f531f0c1e22`；改造基线 `c93d4ba3e3768e489e7738dbdcb4ef1d883f4aab` |

用户授权原话（按时间顺序）：

1. **“接受，批准本轮 Gate 2”**：确认 A R2 对 `03a1bfe` 的评审结论（0 P1、0 P2、1 P3），并接受 P3-A 为后续任务。原 Gate 2 已批准，本次不重复请求。
2. 协调者随后诊断：若把 22 个已批准 Markdown 原样覆盖到 main，会有 35 个相对链接目标不存在；建议保留完整的已批准 `workbench`，只从 main 派生可独立交付的 AGENTS / 工作流 / 模型路由 / 必要 ADR，推迟依赖业务内容的 README 与 feature 状态导航，经适配审核后以纯文档 PR 合入 main。用户回复 **“按你说的做”**。

该授权只覆盖**与 main 兼容的文档拆分交付**，不授权产品工作、不授权整条 `workbench` 合入 main，也不是任何产品 feature 的 Gate 1 / Gate 2。

**适配边界**：本交付只做兼容性适配——元数据、相对路径、目录缺失时的回退说明、历史内容放置位置。若需要新增或改变规则、模型、Gate、阅读义务或范围（实质语义变更），作者必须停止并报告，不得默默加入；在这种情况下原 Gate 2 不覆盖，需重新确认。本次作者未发现需要实质语义变更的地方（见 §4，待 A 复核）。

## 2. 输入清单

- `AGENTS.md`、`docs/plan.md`、`HANDOFF.md` @ `072bb12`（blob `31945f9` / `93faacc` / `21e8611`），全文。
- `specs/README.md`、`templates/{README,checklist,plan}.md`、`backend/README.md`、`frontend/README.md` @ `072bb12`，只读核对存在性与导航。
- `c93d4ba` 相对 `072bb12` 的 `AGENTS.md` / `docs/plan.md` / `templates/checklist.md` 差异：确认改造基线的 AGENTS §2 / §5 / §6 与 main 相同（只多一条 D-025 工作约定）。
- SOURCE `c2e82e6`：`AGENTS.md`（blob `ee8e4ab`）、`README.md`、`HANDOFF.md`、`docs/README.md`（blob `7a94862`）、`docs/development/workflow.md`（blob `4aca344`）、`docs/development/model-routing.md`（blob `f980f5c`）、D-025（blob `60c0df2`）、D-026（blob `fbfce4b`）、`docs/maintenance/20261030-agent-navigation.md`（blob `f4d98e3`，§1、§5–§8）、R1（blob `1605efd`）、R2（blob `e331f4b`）、`docs/maintenance/20261030-workspace-consolidation.md`（blob `4d516cb`，只读页首与目录）、`templates/{README,checklist,plan}.md`、`docs/plan.md` 相对 main 的差异。
- 未读取大型 feature 实施日志；它们不属于本候选。

## 3. 范围

### 3.1 写入白名单（18 个文件，此外不写）

| 文件 | 处理方式 |
|---|---|
| `AGENTS.md` | 由 SOURCE 根入口派生，适配 main 的目录与链接 |
| `README.md` | 只移植通用导航链接 |
| `HANDOFF.md` | 新写 main 兼容的当前入口；原文先存档 |
| `docs/README.md` | 由 SOURCE 派生，去掉依赖 workbench 专有资产的活链接 |
| `docs/plan.md` | 在 BASE 上定向修改（§3 / §4 / §9 与页首），产品正文不动 |
| `docs/development/workflow.md` | SOURCE 原样迁入，规则不改 |
| `docs/development/model-routing.md` | SOURCE 原样迁入，规则不改 |
| `docs/decisions/20261030-workspace-lifecycle.md` | D-025，SOURCE 逐字节复制 |
| `docs/decisions/20261030-agent-navigation.md` | D-026，SOURCE 逐字节复制 |
| `docs/maintenance/20261030-workspace-consolidation.md` | main 参考落地页（不是原执行日志） |
| `docs/maintenance/20261030-agent-navigation.md` | main 上的短索引 / 溯源页（不是 workbench 原记录） |
| `docs/maintenance/20261030-agent-navigation-main.md` | 本记录 |
| `docs/maintenance/20261030-agent-navigation-main-history.md` | BASE `HANDOFF.md` 全文存档 |
| `docs/maintenance/20261030-agent-navigation-review-r1.md` | SOURCE R1 原报告逐字节复制 |
| `docs/maintenance/20261030-agent-navigation-review-r2.md` | SOURCE R2 原报告逐字节复制 |
| `templates/README.md` | 只移植通用导航 |
| `templates/checklist.md` | 模型名单改为指向 model-routing |
| `templates/plan.md` | 只移植通用导航 |

### 3.2 推迟项（本次绝不写入或导入）

- **产品源码与构建**：全部 backend / frontend / shell 源码、构建与打包配置、锁文件、`.gitignore`、`design/` 资产。
- **specs**：`specs/**` 全部，包括 `specs/README.md` 与任何 feature 的 `README.md`、spec / plan / tasks / checklist / review / 日志。
- **代码目录 README**：`backend/README.md`、`frontend/README.md`、`shell/README.md`（main 无 `shell/` 目录）。
- **workbench 专有的 feature 与证据**：desktop-shell 与 workbench-interaction 的全部模块、规格、checklist、实施日志、归档交接检查点（`docs/maintenance/checkpoints/*`）与验收结果；SOURCE 的 plan / specs 索引历史快照（`20261030-agent-navigation-plan-history.md`、`20261030-agent-navigation-specs-index.md`）及其他维护记录。
- 不为了让链接通过而复制上述 35 个缺失依赖，不建空壳实现文件，不伪造验收。
- **P3-A**（`specs/frontend-workbench/README.md` §2 的 “S0 开工登记” 定位措辞）：已被用户接受为后续任务，**未修复**；该文件只存在于 workbench，属于推迟范围。

D-026 ADR 的“影响”一节描述的是 workbench 上的完整落地（含 feature README、`shell/README.md`、`specs/README.md` 精简、历史快照等）。**本次 main 交付只是其中的上述子集，不得把 ADR 列出的全部文件当作已进入 main。**

## 4. 适配对照（仅元数据、路径、回退与历史放置）

| 文件 | 相对 SOURCE 的适配 | 是否改变规则语义 |
|---|---|---|
| `AGENTS.md` | §1“改某代码目录”一行：去掉 `shell/README.md` 链接，改为现有 backend / frontend README，并说明目录无 README 或尚未落地时读对应 spec 与 architecture 相关节、规划中的模块不等于已实现；仍要求读取实际适用的规则。§1“恢复”一行与 SOURCE 相同（当前 HANDOFF + `specs/README.md`），不要求可选的 feature README。§0–§6 标题、Gate / Checklist / 变更 / 审核硬约束、§4 工作约定（含 D-025）与 §5 七条工程准则逐字保留 | 否 |
| `docs/README.md` | 去掉 `maintenance/checkpoints/` 与 feature README 的活引用；增加“规划架构 ≠ 本 checkout 内容”说明；feature 文档不在本 checkout 时查 `specs/README.md` / architecture，或有意切到 `workbench` 核对；维护记录入口指向本记录与索引页 | 否；不新增传递性必读 |
| `docs/plan.md` | 页首加导航与本次作者簿记；§3 增 D-025 / D-026 行（措辞取 SOURCE）及编号说明后一句；§4 文档树增 `README.md` / `development/` / `maintenance/` 并把工作流链接指向 workflow.md；§9 保留原文，开头标注其为历史过程记录、不是当前工作区指令，并在 §9 末尾补 D-025 目录整理条目（措辞取改造基线 `c93d4ba`）与 D-026 批准 / main 交付的简短历史条目。§1 / §2 / §6 / §7 / §8 / §10 不动 | 否；SOURCE 的 §9 索引化 / 历史快照迁移推迟 |
| `workflow.md` / `model-routing.md` | 与 SOURCE 逐字节一致；其链接在 main 候选中均可达（`docs/maintenance/20261030-agent-navigation.md` 以 main 索引页承接）。页首的历史作者与基线 `c93d4ba` 属历史归属，当前适配归属见本记录。`c93d4ba` 的 AGENTS §2 / §6 与 main `072bb12` 相同，因此“自原 §2 / §6 迁入”的描述对 main 同样成立 | 否 |
| D-025 / D-026 ADR | 逐字节复制，不改历史 ADR | 否 |
| `20261030-workspace-consolidation.md` | D-025 ADR 的链接目标。main 上写成标注清楚的参考落地页：说明原执行日志只在 workbench，给出源路径 / blob / SHA256，政策指向 D-025，强调治理验收不等于产品验收；不导入原日志、检查点或 feature 证据 | 否；分支投影，不是伪造原始证据 |
| `20261030-agent-navigation.md` | workflow / model-routing / D-026 的链接目标。main 上写成短索引：指向本记录、R1 / R2 原报告与 SOURCE 原记录的溯源信息，引用原 Gate 2 及其范围；不复制 workbench 的运行 / 进度记录 | 否 |
| `HANDOFF.md` | 新写：当前 checkout / Git 为文件事实权威；源码与 feature 状态未因本交付推进；D-025 默认 main / workbench、不按旧 HANDOFF 重建目录；指向 `specs/README.md` 与本记录；保留 §8 / §10 历史指针编号。BASE 原文全文存档于 [main-history](20261030-agent-navigation-main-history.md) | 否；PR #9 的历史批准与九项 P3 后续线索保留 |
| `README.md` / `templates/*` | 移植 SOURCE 的通用导航；不链接 `shell/` 与 feature 目录；模板模型名单集中在 model-routing，保留“复制模板后改相对链接”的提示 | 否 |

## 5. 历史放置

- BASE 的 `HANDOFF.md`（PR #9 交付记录）全文存于 [20261030-agent-navigation-main-history.md](20261030-agent-navigation-main-history.md)，附源路径、blob、SHA256 与相对链接基准；它是不可变数据，不是恢复命令。
- BASE `docs/plan.md` §9 的过程历史本次**原地保留**并标注为历史；SOURCE 的“§9 索引化 + 逐字快照”迁移推迟到后续（与 feature 状态导航一起处理时再定）。
- workbench 的原维护记录（运行过程、验证输出、Handoff 诊断）留在 `c2e82e6`，main 只提供索引与溯源。

## 6. 五类导航走查（main 候选）

| 场景 | 必读路径与停止条件 |
|---|---|
| 局部 bug，如 frontend store | 根 AGENTS + model-routing（开会话 / 选模型时）；[frontend/README.md](../../frontend/README.md)；`specs/frontend-workbench/` 的冻结 spec / plan / tasks 与有效 checklist；workflow 第 8 / 9 步。涉及交互语义补读 interaction。不是跳过 Gate 的捷径 |
| UI / 图表变更 | 上述阶段与 feature 输入 + designUI 相关章节、`design/ui` 或 `design/charts` 索引；先改生成源，不手改生成物；新增行情语义位置按 D-015 决策流程 |
| 数据语义变更 | 根与阶段规则 + [backend/README.md](../../backend/README.md)、architecture §3、`specs/data-layer/` spec / plan、相关 ADR；冻结范围变化先 Clarify / Gate 1 |
| 独立 Review | 新会话、固定提交、隔离；model-routing 全文、workflow 第 10 步、spec / plan / tasks / 真实 diff 及相关领域原文；不以实施摘要替代源码与证据；P1/P2 = 未通过 |
| 恢复暂停 feature | 根 AGENTS、当前 HANDOFF、`specs/README.md` 状态表；直接读该 feature 的冻结 spec / plan / tasks、有效 checklist 与审核记录（没有导航 README 时不需要补建）。feature 不在本 checkout（如 desktop-shell、workbench-interaction）时，有意切到 `workbench` 核对，不要在 main 上推断其已交付 |

补充：改一个尚无目录 README 的规划模块（如 `shell/`）时，按 AGENTS §1 回退读对应 spec 与 architecture 相关节；plan §5 的目录规划不表示该模块已实现。

## 7. 验证计划与结果

以下计划由作者事先列出、未预填结果；1–5 已由协调者执行，实际证据见 §9：

1. 范围：`git diff --name-only 072bb12` 与未跟踪文件只落在 §3.1 白名单；源码、specs、状态表、checklist、配置、锁文件与 BASE 一致；`git diff --check`。
2. 原文保护（临时标准库脚本，不入库）：根 AGENTS §5 七条工程准则与 BASE 逐字一致；BASE §6 模型表与八条规则在 model-routing 中去掉 `<a id="rule-N">` 锚点后逐字一致；D-025、D-026、R1、R2 与 `c2e82e6` 同路径 blob 逐字节一致；workflow / model-routing 与 SOURCE 一致；存档内围栏数据与 `git show 072bb12:HANDOFF.md` 逐字节一致且 SHA256 匹配；`docs/plan.md` §1 / §2 / §6 / §7 / §8 / §10 与 BASE 逐字节一致。
3. 链接：变更文件中所有活跃相对链接与片段在本工作树可达（忽略围栏内历史数据）。
4. 体积：根 `AGENTS.md` 按 LF / UTF-8 口径测量，软目标约 6–8 KB。
5. 现有测试（不改依赖与 Git 中锁文件）：`pnpm -C frontend check`；`pnpm -C frontend exec vitest run tests/unit/design-registry.spec.ts tests/unit/contract-doc.spec.ts`。
6. 独立审核员 A（新会话、只读、固定候选提交，按 model-routing）复核本适配是否只做兼容性调整、有无实质语义变更、P1/P2 判定。

| 检查 | 结果 |
|---|---|
| 1 范围 / `git diff --check` | 通过（协调者） |
| 2 原文保护 | 通过（协调者） |
| 3 链接 | 通过：171 个活跃相对链接 / 片段可达（协调者） |
| 4 体积 | 根 `AGENTS.md` 8,022 字节（LF），BASE main 18,309、SOURCE 7,850（协调者） |
| 5 现有测试 | 通过：`check` exit 0；vitest 2 文件 192/192（协调者） |
| 6 A 复核 | 首轮固定审 `65ef2fa` 通过（0 P1、0 P2、2 P3）；定位补修与复核见 §10 |

## 8. 完成项与待办

**作者已完成**：§3.1 白名单内 18 个文件的候选内容。作者另用一次性标准库脚本做了廉价自查（不入库、不是验收）：改动只在白名单内，七条工程准则与模型规则原文、plan 受保护各节、复制文件与存档原文均未发现差异，171 个活跃相对链接 / 片段可达，`git diff --check` 无输出；根 `AGENTS.md` 按 LF / UTF-8 为 8,022 字节（SOURCE 为 7,850 字节，多出的是目录缺失回退说明）。以上为核查前的历史自查，已由协调者正式核查（§9）取代。

**待办**：A 对定位补修的定向确认；随后 PR 与 merge、临时资源回收（由协调者执行）。最终状态以 PR 元数据与后续 handoff 确认为准。A 首轮已确认没有新的实质语义变更，原 Gate 2 不重复请求；后续若出现新的实质语义变更，仍须停止并报告用户。

**作者声明与独立审核声明分开**：本记录中的“未改变规则语义”“链接可达”等均为作者自述，必须以协调者核查结果与 A 的独立结论为准；作者未运行任何测试，也不声称审核、合并或适配已完成。

**仍有效的后续**：P3-A 已接受、未修复（在推迟文件中）；PR #9 首轮九项 P3 与第二轮记录 P3 仍为后续线索（见 [HANDOFF](../../HANDOFF.md) §8）；推迟的 feature 导航、代码目录 README、`specs/README.md` 精简、plan / specs 历史快照迁移，需在前置 feature 进入 main 后另行规划。

## 9. 协调者确定性核查证据（2026-10-30）

执行者：协调者 `openai/gpt-6.1-sol`（会话 `01a18b79-beab-72f7-8cde-d865a02a25b8`）。作者未运行以下任何测试；这些证据不是独立审核员 A 的结论。本节为核查后追记，本文件此次改动仍在 §3.1 白名单内，由 A 在固定提交上一并复核。

- **确定性核查**：临时标准库脚本 `verify_main.py` 针对本工作树 20/20 通过（结果 JSON：系统 Temp `fai-docnav-20261030/main-verification.json`，不入库）。覆盖：改动仅限 18 个白名单文件，源码、specs、模块 README、状态表、索引、锁文件、配置均未改；D-025、D-026、R1、R2 逐字复制；BASE 七条工程准则与八条模型规则同时与 main 和 SOURCE 一致，workflow / model-routing 原文保留（作者亦已比对）；plan §1 / §2 / §6 / §7 / §8 / §10 未变；main 旧 HANDOFF 存档与 SHA256 一致；171 个相对链接 / 片段可达；体积见 §7。
- **`git diff --check`**：通过。
- **依赖安装**：首次 `pnpm install --frozen-lockfile --offline` 因本地缓存缺 `echarts` 6.1.0 报 `ERR_PNPM_NO_OFFLINE_TARBALL`——属环境准备失败，不是测试失败，也不是模型回退；随后常规 `pnpm install --frozen-lockfile` 成功，Git 中锁文件与 package 无变化；未以 junction 等方式复用 workbench 的 `node_modules`。
- **`pnpm -C frontend check`**（隔离 main 候选）：exit 0。tokens 156 / 5 个产物；contract 12 methods / 10 events / 2 artifacts（main 口径，非 workbench 的 25）；generated / colors / glass / updown / grid / network 全部通过。输出：系统 Temp `main-frontend-check.txt`。
- **vitest**（`tests/unit/design-registry.spec.ts`、`tests/unit/contract-doc.spec.ts`，main 候选）：exit 0，2 个文件 192/192 通过，开始 12:25:44，耗时 1.37 s。输出：系统 Temp `main-docs-tests.txt`。
- **未执行**：后端、前端全量、Electron 与手工测试——本次为纯文档适配，不在 §7 计划内。

上述确定性核查时点尚待 A 复核；其后结论及补修见 §10。原 Gate 2 已批准，除非 A 认定存在新的实质语义变更，否则不重复请求。P3-A 已接受、未修复（在推迟文件中）。

## 10. 主线适配独立审核与定位补修

A = `claude-fable-5-1 via anthropic`，新会话、只读 detached Temp 工作树，固定审 `65ef2faa83a156e0e45fda4f826deeeb3d7b9c74`（BASE `072bb12`）。原文逐字保存于 [main 适配审核](20261030-agent-navigation-main-review.md)。

- 首轮结论：**通过，0 P1、0 P2、2 P3**。A 核对规则、复制件、旧 HANDOFF 全文与校验和、171 个活链接、实际测试输出，并明确分类为“已批准语义保留”，无需要用户重新确认的实质性新语义。
- P3-1：`docs/README.md` 的数据层字段契约错误指向 plan §3.1；协调者已按 A 的原建议作确定性替换为 **§2.1**。原冻结 `specs/data-layer/plan.md` §2.1 标题实存，文件未改；不是业务或政策语义变化。此定位补修待 A 定向确认。
- P3-2：临时分支与 worktree 必须在合并后回收；这是 D-025 已有义务，不在合并前预写“已清理”。当前交付临时分支为 `docs/agent-navigation-main`，候选与审核工作树均在系统 Temp；实际清理结果在 PR / 交接记录中登记。
- SOURCE 的 P3-A 与本轮 P3-1 不同：前者是推迟的 frontend-workbench README 定位措辞，已接受但仍未修复；后者是本次 main 文档指针补修。
- 本节是协调者的适配执行与证据记账，不改 A 原报告、不把作者声明当作独立审核。待固定补修提交交 A 定向确认后，若无新阻断或实质语义变化，按已获授权提交文档专用 PR 并合入 main；不合入任何在研源码或 feature 状态。
