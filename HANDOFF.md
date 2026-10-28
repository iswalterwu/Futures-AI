# 恢复交接 — frontend-workbench v2

> **最新状态（R9 报告落盘）**：G-02 用户裁定已登记，Plan/Tasks 与两个测试证据缺口均已修正。独立 Analyze R9 固定审 `ee3e348459124aead80d99c4f3b9438d24450a54`，确认 R8 两项全关、无新增内部发现（原文 `specs/frontend-workbench/analyze-v2-r9.md`）。本提交是 A R4 按既有规则应审的固定对象；当前 S0 仍待 A R4，尚未开始实施，S1/S2 另缺 H-x 实现交接。下方“待 R9”仅指报告前时点。

> **当前状态（2026-10-28，G-02 已裁定；Analyze R8 的 1 P2 / 1 P3 已最小修正，待独立复跑 R9 / A R4）**：v1 正式 Handoff `43b6d79681a49562f41751368b2ae00c24062f56` 已合入；代码、`design/`、权威 docs 与它一致，冻结 spec（52 AC）与两份 Checklist 未改。历史复核：Analyze R7 审 `217960d`、A R3 审 `b375b270a47d210823ae62da16438eeac17096db` 通过（原样产物 `425c1fd6c639734b0c45ba7cf9259dbee4439074`），只覆盖各自固定提交。**G-02 人工裁定已满足**：协调器问“是否按推荐，采用导航内部横向滚动？”，Walter 本轮回复“可以”。内容是小于 980px 时九项顶部导航单行，导航容器内部横向滚动，页面不横滚；按 `design/ui/UI_LAYOUT.md#narrow` 原规则执行，不改该文件。Plan / Tasks 已据此修改（提交 `docs(frontend-workbench): apply approved G-02 horizontal navigation plan`，基线 `e84ee27`）。这属于 plan §7.4 的实质设计修改。独立只读 Analyze R8（`specs/frontend-workbench/analyze-v2-r8.md`）已出 1 P2 / 1 P3，已由协调器新派的 Plan/Tasks 修正作者（`claude-opus-5-5 via anthropic`，不是 A / Implement）按最小范围修正（提交 `docs(frontend-workbench): make G-02 nowrap acceptance regression-sensitive`，基线 `39b16e3`）；还须独立复跑 R9，再由 A R4 定向复核，之后 T-V2-01 / 02 才能开工。S1/S2 仍缺 H-x 四项交接。
> **工作树登记**：协调 / 串行集成 = `openai/gpt-6.1-sol` 会话。主规格树 `D:/2030/Futures-AI-workbench-v2` / `spec/frontend-workbench-v2`、集成树 `D:/2030/Futures-AI-workbench-v2-integration` / `integration/frontend-workbench-v2`、实施树 `D:/2030/Futures-AI-workbench-v2-implement` / `feat/frontend-workbench-v2-s0` 都已真实建立；集成树与实施树仍在 `79b521207a93567c4da8651e5f6e53c665e3d098`，主规格树已串行集成本次设计修订（准确 HEAD 以 Git 为准），尚无 v2 实施提交。本 G-02 修订在 `D:/2030/Futures-AI-workbench-v2-g02` / `docs/frontend-workbench-v2-g02`，由集成人串行合入。建立 / 同步工作树不等于放行。
> **模型记录（脱敏）**：Plan/Tasks = `claude-opus-5-5 via anthropic`，由协调器派出独立会话，不是用户直接切换模型。同一限额窗口内 Opus bridge 的最小真实调用已返回额度 / 限流类失败，本轮未重试 bridge，同模型 anthropic 正常；只换通道，未改配置。下方 R3/R4 的“用户以该通道启动”属作者当时措辞，以本段为准。

## 当前下一步与证据边界

- **G-02 已闭环（人工选择）**：Plan §7.2 / §7.4 / §7.11 / §7.12 M-09 / §7.13 / §7.14 与 Tasks T-V2-01（修改范围、标准 4 / 6、命令 4 / 6）已改为单行加容器内横滚。新增窄窗用例放在 T-V2-01 拥有的 `e2e/shell.spec.ts`（`AC-002-6 v2-nav`），不写 T-V2-08 的 `breakpoints.spec.ts`；`UI_LAYOUT.md` 不写，`UI_NAV.md` / README 由 T-V2-01 实施时先改资产、再改代码。
- **R8 修正（F-01 P2 / F-02 P3）**：令牌宽度下九项在 960 / 979 本来放得下，几何同一行和 `overflow-x: auto` 用 v1 换行实现也会通过。T-V2-01 标准 4 与 `shell.spec` 计划用例因此增加计算样式断言（`.nav-list` 的 `flex-wrap` = `nowrap`、导航标签 `white-space` = `nowrap`；`flex: none` 如需写在 `.nav-list > li`），几何 / 文档无横滚 / 末项可达保留为行为证据，`scrollLeft > 0` 只在 `scrollWidth > clientWidth` 时断言；新增 CSS 限定窄窗选择器，纵向不滚若写用 `overflow-y: hidden`。M-09、T-V2-01 标准 6 的 `UI_NAV` 文案改为“960 / 979 九项单行、页面不横滚；仅空间不足时内部横滚，令牌宽度下不出现滚动条属正常”。命令、矩阵、12 任务 / 22 h 不变；不加测试工具，不碰 T-V2-08 的 `breakpoints.spec`。
- **下一步（按序）**：(1) 已完成：独立只读 Analyze R8 及其最小修正（见上条）；(1b) 独立只读复跑 R9，审 `79b5212..` 含本修正的提交（含 `e84ee27` 的 S13 / S14 文字），R8 的 F-01 / F-02 在 R9 确认前不算关闭；(2) 集成人把 R9 报告落盘的提交登记为 A R4 固定对象（R9 再触发修正则继续顺延）（tasks §1.1“A 定向复核”行当前口径：只允许文档路径，范围外断言对 `43b6d79` / `fec3556` / `425c1fd`）；(3) A R4 新开独立会话复核；(4) 实施树快进到复核过的规格提交，S0 才能开工。本作者没有写 Analyze 报告，也不宣称 A 已通过。
- **生产方仍未交接实现**：互动方已提交 `0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d`、`9acf3de661187840ea5be6f6d6f78205872ac356`（A R7 Checklist）和 `5e9e1f4e99e7d5d7c4dfbf682a7fd92bd7dff796`（R7 通过记录）。这些只作设计授权参考，均不含 `frontend/src/jobs`，不是任何 H-x 的四项交付；tasks §1.2 八行仍为“未交付”，壳不代写。
- **S13 / S14**：S13 只是预登记超 2h 拆分规则，没有实际拆分（12 任务 / 22 h）；S14 在各任务状态行统一标“已满足前置：v1 Handoff `43b6d79`”。
- **v1 P3 H-02**：台账原文不改。不宣称 H-02 已关闭、v1 截图已补齐、视觉验收已完成或 v1 缺陷已全部修完。
- **验证只到文档 / Git**：52 AC、12 任务 / 22 h、标准与命令一一对应、依赖无环、矩阵引用有效、`git diff --check`。没有安装依赖，没有运行 pnpm / Vitest / Playwright / 构建 / 应用，没有启动服务；没有 push / PR / main 合并。

## 暂停时历史快照（以下“当前 / 未取得 / 不启动新任务”仅指暂停时刻，不覆盖上方恢复状态）

> 2026-10-28，按 Walter「暂停交接，收到后不要开新任务」指令收尾。
> 暂停期间未进入 Implement，未启动新审核、构建、下载或长任务。以下为当时保存的恢复顺序与证据。

> **恢复记录（2026-10-28，用户“按 HANDOFF.md 继续”）**：本文件以下内容是暂停时的历史快照。恢复后由 Plan/Tasks 作者（`claude-opus-5-5` via anthropic）在 worktree `D:/2030/Futures-AI-workbench-v2-resume`、分支 `docs/frontend-workbench-v2-resume` 继续。已做：登记 v1 Handoff SHA `43b6d79`（PR #7 merge commit，已在 main 上）；落实 V2-S10～S12；完成 R3 定向 Analyze（`specs/frontend-workbench/analyze-v2-r3.md`）。**仍未 Implement**；当前状态以本文件页首、tasks.md 1.1 / §9 和 analyze-v2.md 的最新独立轮次索引为准，R3/R4 自查不作为独立复核结论。

> **集成记录 R4（2026-10-28）**：协调器指定 `claude-opus-5-5` via anthropic 为本次文档 merge 唯一执行者，已以合并提交 `eb6ebd8` 把 v1 Handoff `43b6d79` 合入 `docs/frontend-workbench-v2-resume`（G-03 关闭，`specs/frontend-workbench/analyze-v2-r4.md`）。仍未 Implement、未 push。

## 1. 目标、位置与当前安全点

- 目标：重读项目规范，产出 `specs/frontend-workbench/plan.md` 的 v2 部分；随后用户说「继续」，推进到独立 Checklist、Tasks、Analyze 和 Tasks 定向复核。
- 主 worktree：`D:/2030/Futures-AI-workbench-v2`。
- 主分支：`spec/frontend-workbench-v2`；没有 checkout / reset 其他 feature 分支，也没有 push。
- 最初基线：`fec355650f614ef42138f409afc748206e941ba1`（v2.1 Gate 1 已批准，52 AC）。用户原提及的 `docs/spec.md` 不存在，需求权威为 `specs/frontend-workbench/spec.md`。
- **安全点：Plan / Tasks / Analyze 内部质量已复核通过，但实施尚未开始。**
  - Plan §7 已完成；旧 §1～§6 正文保留。
  - v2 Tasks：T-V2-01～T-V2-12，预计 22 h，52 AC 全覆盖；12 个任务全部未开始、全部 blocked。
  - Analyze R1 找到 3 P2 / 4 P3；按 F-01～F-07 修正文档后，Analyze R2 审 `6bda6c9` 确认全部关闭、无新增 F。
  - **A 的 Checklist R2 已完成并通过（0 阻断）**，不是“仍待 A 复核”：审查对象 `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`；I-01b / V-02 由 A 正式勾选；原样清单提交 `f1f755bad8e4bab7577c415f4aea3d297c9d37a8`，已经登记到 Tasks §1.1。
  - A 新增 3 条非阻断建议 **V2-S10～S12**，暂停时未处理；不能把它们伪称已完成。
- **真正卡住的是实施外部前置**：尚未取得 / 登记 v1 Handoff 合入 main 的准确 SHA，以及互动方 H-1～H-6 / 页面切片的交接证据。不能用 `fdaa7d8`、`0ffa15e`、`b19427a` 或某个移动 worktree 的 HEAD 代替正式 Handoff。
- 未修改 `frontend/`、`backend/`、`design/` 或权威 `docs/` 的实现；未改冻结 spec、旧 v1 Checklist 和 v1 Tasks 正文；未声称 Converge / 代码 Review / Gate 2 / Handoff 已通过。

## 2. 已完成文件与提交

### 当前应读的文件

| 路径 | 内容 / 当前状态 |
|---|---|
| `specs/frontend-workbench/spec.md` | 已冻结 v2.1，52 AC；本轮未改。旧“待批准”历史措辞以页首批准记录为准 |
| `specs/frontend-workbench/plan.md` | §7 v2 设计、接口交接 H-1～H-6、所有权与阶段依赖；页首已同步暂停与 A R2 结果 |
| `specs/frontend-workbench/tasks.md` | v2 12 任务 / 22 h、52 AC 矩阵、开工登记表；v1 历史正文不改；A 产物 SHA 已登记 |
| `specs/frontend-workbench/checklist-v2.md` | **当前有效清单**；R1 历史 + R2 当前结论、正式 I-01b / V-02、建议 V2-S10～S12。协调器未代勾 |
| `specs/frontend-workbench/checklist.md` | v1 历史，未改，不能授权 v2 |
| `specs/frontend-workbench/analyze-v2.md` | 当前结论索引 + R1 原文；页首补记后续 A R2 已通过 |
| `specs/frontend-workbench/analyze-v2-r2.md` | Opus 只读复跑原文，固定 `6bda6c9`，F-01～F-07 全闭环。其“待 A 复核”是当时历史状态 |
| `specs/README.md` | frontend-workbench 已标 blocked / 暂停；跨 feature 队列登记共享缓存、标签 / 徽标、路由切片、公开写 action、上下文清空、可替换 fixture 等交接要求 |
| `specs/frontend-workbench/session-artifacts/20261028-pause/` | 临时输出的入库副本，见第 6 节 |
| `HANDOFF.md` | 本交接文件；最终暂停提交用 `git log -1 --format=%h -- HANDOFF.md` 查询，避免自引用提交 SHA |

### 主分支本地提交（均未 push）

| 提交 | 内容 |
|---|---|
| `d2bf5a7` | v2 Plan §7 与状态表 |
| `a8ab444` | 原样集成 A Checklist R1：0 阻断 / 9 建议；跨 feature 待同步登记 |
| `b364971` | v2 Tasks 初稿（12 任务 / 22 h）和 Plan 细化 |
| `6bda6c9` | 按 Analyze R1 F-01～F-07 修正文档，保存 R1 报告 |
| `949a232` | 保存 Analyze R2 内部一致结论及状态记账；这是 A R2 的审查基线 |
| `f1f755b` | **收到暂停指令后，仅保存已经完成的 A R2 审核产物**：0 阻断、I-01b / V-02 正式勾选 |
| 本文件所在 WIP 提交 | 暂停状态记账、临时产物归档、本 HANDOFF；没有新功能工作 |

## 3. 验证结果与未运行项

已执行的都是轻量文档 / git 检查，不是实现验收：

- spec AC = Plan §7.11 AC = Tasks 矩阵 AC = 新任务完成标准覆盖并集，均为 **52**，无遗漏、无额外编号。
- **12 个任务 / 22 h**；每项 0.5～2 h；依赖无前向、无环。
- 各任务完成标准数 / 验证命令数一一对应：`4/4, 4/4, 3/3, 3/3, 4/4, 4/4, 4/4, 2/2, 4/4, 3/3, 9/9, 3/3`。
- v1 Tasks 正文、Plan §1～§6 正文保留；冻结 spec 和 v1 Checklist 未改。
- A R1 / R2 清单均从独立 worktree 原样集成，R2 SHA 已登记；不是协调器自行勾选。
- Analyze R2 原文与临时输出逐字一致；7 个 F 闭环经只读复跑及 A 独立复核确认。
- 每次提交前执行文档差异检查；最终暂停提交的**正式文档**执行 `git diff --check` / `git diff --cached --check`（排除原样归档目录）。LF→CRLF 提示不是错误。归档 Tasks 初稿保留两处仅空格行，不改写历史原稿；9 份归档另与临时原件逐字节比对。
- **未安装依赖，未运行 pnpm / Vitest / Playwright / 前端应用。** 当前本 worktree 的 `frontend/node_modules` 不存在；本轮只做规范与质量流程，不能把文档检查说成自动化实施测试全绿。

## 4. 恢复后的动作 / 命令（按顺序；现在不要执行长任务）

1. **先发第 8 节的第一句话**，再完整重读 `HANDOFF.md`、恢复时的 `AGENTS.md`、`docs/plan.md` 和本 feature 的 spec / plan / tasks / checklist-v2 / analyze。
2. 核对主工作树和审查证据，先只读：

   ```bash
   cd D:/2030/Futures-AI-workbench-v2
   git status --short --branch
   git log -8 --oneline
   git show f1f755b -- specs/frontend-workbench/checklist-v2.md
   git diff --stat fec3556..HEAD
   ```

3. 用户明确恢复后，再处理 A 的 **非阻断** V2-S10～S12：
   - S10：在 T-V2-01 / 02 文字里补“连带删除失效导入 / 局部变量”，T-V2-02 命令 4 建议 `typecheck && lint`。当前未改这些内容，也没改实现。
   - S11：H-3 集成到 T-V2-09 完成的窗口内，记录 `shell.spec` 的 `/jobs` S0 占位子断言“已知红”，不拿它作全量证据。
   - S12：T-V2-04 / 07 显式补继承 T-V2-03 的 H-3 条件依赖。
   - 按恢复时 AGENTS 走 Tasks 精度修订 / 定向 Analyze；若触及实质设计，再让 A 新开独立会话复核。不要为此直接改冻结 spec 或自行勾清单。
4. 取得并登记 **v1 正式 Handoff 合入 main 的准确 SHA**；读其真实代码和文档，不能把旧固定参照当最新事实。用真实 SHA 核验：

   ```bash
   git merge-base --is-ancestor <v1HandoffSHA> main
   ```

5. 按 Tasks §1.2 向 `workbench-interaction` 接收切片：H-1、H-2·标签、H-2·列表（含可调用写 action）、H-3·路由切片、页面切片、H-4、H-5、H-6（可替换整个作业集合）。每个切片都要有**固定 commit、已提交有效 Checklist SHA、定向测试摘要、集成 SHA**，缺一项不放行。不要把 `8bd1b31` 的旧 R2 或移动工作树的未提交 R3 / R4 当成新增要求已获授权或实现。
6. 登记指定集成人、集成验证分支和独立实施 worktree；每个并行写入者独立分支 / 目录。只由集成人串行写集成分支。对应任务的 H-x 核验方式：

   ```bash
   git merge-base --is-ancestor <H-x-commit> <集成验证分支>
   ```

7. **只有用户已恢复、Tasks §5 四个开工闸门均满足，才按依赖顺序实施。** 模型路由以恢复时 AGENTS 为准。本轮计划 / 分析作者为 Opus via anthropic，A 为 Fable via anthropic，协调器为 Sol；开发路由与产品运行时三档无关，不改用户全局 provider / key / 配置。
8. 实施后才运行任务里的 pnpm 验证及最终 `pnpm -C frontend test`；不得在本次暂停收尾时启动。跨 feature AC 未交付时 Converge 只能报告“未收敛（外部阻塞）”；Review / Gate 2 / Handoff 不能省略。

## 5. 命令、后台进程、端口与日志

- 暂停收到前最后一条长命令是 A R2 的同步 pi 调用：已正常结束，`exit_code=0`，39 次工具调用；结果已保存到清单与归档摘要。**没有仍在运行的长命令。**
- 所有本会话派出的 pi 均经同步 `subprocess.run`，已返回；没有用后台 `&` / nohup 起服务。
- **没有启动本项目的 Backend、Electron、Vite、Playwright webServer、后台构建或下载。无本会话占用端口，无需要停止或重启的服务。** 不要误杀其他 feature / 用户自己的 pi、node 或服务。
- 需要重启的命令：**无**。后续实施时的 dev/test 命令只按 Tasks 和届时配置启动，不从旧终端盲目恢复。
- 产物 / 脱敏阶段摘要路径：`specs/frontend-workbench/session-artifacts/20261028-pause/`；核心报告另在 feature 根目录。
- 原始 API / JSONL / pi 用户会话日志未入库；恢复不依赖这些日志或临时 Python 脚本。

## 6. 临时目录产物已复制入项目

- 原目录：`C:/Users/iswal/AppData/Local/Temp/`。
- 文件模式：`futures-fw-v2-*20261028.md`，**共 9 份 Markdown**，全部已复制到：
  `specs/frontend-workbench/session-artifacts/20261028-pause/`。
- 归档 `README.md` 列明每份的用途、与正式产物的关系；包括 Plan 两稿、Tasks 草稿 / 落盘摘要、Analyze R1 / 修正摘要 / R2、A R1 / R2 完成摘要。
- 这些是历史输出，不覆盖正式 spec、Plan、Tasks 或 A 的当前结论。只有脱敏文本，无 key / token / 原始鉴权错误。
- `/tmp` 下的一次性结构检查脚本无需恢复；报告和命令结果已经保存。

### 本会话专用 worktree 的暂停快照（均已本地 commit，未 push）

| worktree | 分支 | WIP 快照 |
|---|---|---|
| `D:/2030/Futures-AI-workbench-v2-checklist` | `review/frontend-workbench-v2-checklist` | `5e375d2`（A R1；主分支已集成） |
| `D:/2030/Futures-AI-workbench-v2-tasks` | `docs/frontend-workbench-v2-tasks` | `8eacc37`（Tasks 初稿；主分支已有其后续修正） |
| `D:/2030/Futures-AI-workbench-v2-analyze-fixes` | `docs/frontend-workbench-v2-analyze-fixes` | `ebb0e6b`（Analyze R1 修正；主分支已有 R2） |
| `D:/2030/Futures-AI-workbench-v2-tasks-review` | `review/frontend-workbench-v2-tasks` | `1e01df5`（A R2；主分支提交 f1f755b 内容相同） |

这些 worktree 都已结束、改动都已保存；不是待重启的 agent。恢复应从主 worktree 的 HANDOFF 继续，不要把旧 worktree 草稿再次覆盖回来。本会话未清理或重置其他 feature 的 worktree。

## 7. 需要 Walter 拍板的问题

- **目前没有新增产品需求 / Gate 1 问题需要拍板**；暂停前未擅自变更需求。
- 恢复实施前需要落实集成人和集成验证分支；如已有安排，直接按既有安排登记，不另造并行写流程。
- 不建议、也未默认获准跳过 v1 Handoff 或 H-x 交接；若 Walter 要改变这些前置，应先按当前规范走变更流程，不能一句“继续”当作取消闸门。
- Gate 2 尚未到阶段，不能预填批准。

## 8. 下次恢复后给 Walter 发的第一句话

**我已读完 HANDOFF，将先核对 v1 Handoff 与 H-x 交接证据，前置未齐不启动实施。**
