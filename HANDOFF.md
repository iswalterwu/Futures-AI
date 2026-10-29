# 暂停交接 — workbench-interaction

> ⚠️ **恢复更新见 §9（2026-10-28 22:20 +04:00）；下方 §1～§8 的旧暂停状态已被 §9 新记录替代，仅作历史保留。**
> 🔖 **最新：§12 第二批实施与独立 Review（2026-10-29）**——两批合计 **16/67 已完成、51 未开始**；第二批 A Review 通过（0 P1/P2、5 P3），A 亲跑单元／组件 **833 passed**、壳层+Agent E2E **24 passed**。有效 Checklist 为 **R8.1 `34d339e`（26/26）**；代码与生产集成树当前 `f1b7c06`（受审代码 `27e59e6`）。授权持续有效，下一入口 T-A11；feature 未收敛，H-1 / H-2·标签 / H-3 / H-4 均缺消费方集成④。main `072bb12`（v2 S0）尚未导入，同步前须重核及协调壳断言迁移。§11 及以前只作对应时点历史。
> 【§9 时点原文】当前要点：v1 基线已合入 main（`43b6d79`）并登记；r6 设计经独立 A Checklist R7 通过（`9acf3de`）；**仍 BLOCKED 于 Walter 代码实施授权 + 集成人 / 集成验证分支 / 实施 worktree 登记**；H 组仍待外部 v2。本文件仍不是正式 feature Handoff，不表示实现完成或 Gate 2 通过。

> 用户暂停指令下的会话存档，不是 AGENTS.md 工作流里的正式 feature Handoff，不表示实现完成或 Gate 2 通过。
> 记录时间：2026-10-28 17:55 +04:00。收到暂停后未开启新任务、未启动新 agent、构建、测试、下载或服务；仅保存状态、核验文档、检查本会话子进程并做本地 WIP 提交。
> 暂停记录执行者：当前协调会话 `openai/gpt-6.1-sol`；此前 Plan / Tasks / Analyze 作者为 `claude-opus-5-5 via anthropic`，独立审核员 A 为 `claude-fable-5-1 via anthropic`。

## 1. 停在哪、目标和当前进度

- 目录：`D:/2030/Futures-AI-interaction`。
- 分支：`spec/workbench-interaction`。不要切换或操作其他 feature 的可写分支。
- 本轮开始前 HEAD：`8bd1b31cfe99aa687338f68f63bf7668a4abaa3b`（spec v1.1 Gate 1 再批准）。
- 目标：复核 D-018 / Q-013 术语同步，补正计划，产出可实施的 Tasks / Analyze 并经独立 A 复核；用户此前一直要求不改代码、不改冻结 spec。
- **已停在安全点：Checklist R6 通过，当前有效检查项 26/26；Tasks r5 + Analyze R5 文档质量通过。** B-09 / B-10 / B-11 均关闭。历史 R1～R5 的失败与通过记录保留，不要拿历史文字复选框作当前开工依据。
- Tasks 共 **62 项，预估 96.5 h，全部未开始**；完整映射 **46 条 AC**。这不是实现、产品测试或验收通过。
- **仍 BLOCKED：`implementation_base_sha = PENDING`。** 按已审 plan §1.1，必须等 frontend-workbench v1 完成 Review / Gate 2 / Handoff 并合入 main 的真实提交，再登记基线和复核前端事实。不能拿 v1 分支 HEAD 代替 main 上的合入提交。
- H 组另外依赖 frontend-workbench v2；AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未交付前，Converge 必须报“未收敛（外部阻塞）”。
- 最近一步只是回答“现在可行的下一步计划”，已完成只读核对和建议；**没有执行接口补全、PR 合并或任何代码实施**。现在按用户要求暂停，不自动接着做下一步。

## 2. 已完成、改动文件与 commit

本次暂停 WIP 提交包含以下五份既有文档变更和本文件；**不 push、不创建 PR、不 merge**。本文件所在的暂停提交号可直接查询（不在文件中硬编码自身提交号）：

```bash
git log -1 --format="%H %s" -- HANDOFF.md
git show --stat HEAD
```

| 文件 | 已完成内容 |
|---|---|
| `specs/workbench-interaction/plan.md` | B-09：来源材料发布日期恢复 `publishedAt`，与定稿 `finalizedAt` 区分；B-10：补齐交付物独立 `draft / final`、定稿三锚、原子提交、初始样例和验收落点；S-20：明确三份既有契约测试的修改所有权与回滚范围 |
| `specs/workbench-interaction/tasks.md` | 新建 Tasks r5；62 项、约 96.5 h、46 AC、逐任务完成标准/命令/依赖；落实 S-11～S-24；删除未经批准的抽屉实例登记，改为集成时移除页面临时挂载；全部保留实施阻塞 |
| `specs/workbench-interaction/analyze.md` | 新建只读分析报告；保留各轮 TF / O 发现与修订轨迹；当前有效分析为文末 Analyze R5，已获 Checklist R6 认可 |
| `specs/workbench-interaction/checklist.md` | A 的 R3～R6 独立复核记录；R6 当前有效 26/26，旧轮次复选框改文字、保留历史；本文件只由审核员改过勾选 |
| `specs/README.md` | 仅本 feature 状态行更新为文档经 R6 通过、Implement 等待 v1 Handoff 合入 main |
| `HANDOFF.md` | 本次暂停状态、恢复顺序、运行/临时文件情况与待裁决事项 |

**没有修改**：冻结的 `specs/workbench-interaction/spec.md`、`frontend/`、`backend/`、`shell/`、`docs/` 权威文件、`AGENTS.md`、凭证或全局 pi 配置。

### 已有验证结果（纯文档）

- `git diff --check`：通过；只有仓库既有 LF → CRLF 提示，不是错误。
- 文档结构核验：62 个任务、依赖有向无环、每任务 1～2 h；完成标准与验证命令一一对应；46/46 AC 集合一致；R6 有效复选框 26 已勾、0 未勾，历史轮次无有效 Markdown 复选框残留。
- R6 后只回写状态表，已审 plan / tasks / analyze / checklist 内容未再改动。
- 本会话**未执行产品单测、e2e、构建、安装或下载**。任何任务里的测试命令都是未来实施命令，不能当现成通过证据。
- 暂停提交前再次核对：代码、冻结 spec 和权威 docs 相对 `8bd1b31` 无改动。

### 已审内容 SHA256（原始工作区字节；Git 换行转换可能使恢复后的 raw hash 不同）

如 hash 不同，先区分 LF/CRLF 与实质差异，**不要**为了匹配 hash 覆盖文件或 reset。提交后的 Git blob / 实际 diff 才是可跨 worktree 的固定引用。

| 文件 | SHA256 |
|---|---|
| `specs/workbench-interaction/spec.md`（未改） | `ed0f6c6c3e50b93166a02880df574e6f167a5773829ec0ab8d3ddcf269f942d9` |
| `specs/workbench-interaction/plan.md` | `2623f32ba54fe7d95c4b2247bc1356f952094e5fe1726dea0d6f69936ed09fc5` |
| `specs/workbench-interaction/tasks.md` | `2d1f550862efb62912d977e3d574be76afe85972ad4da79b454775b85b777f39` |
| `specs/workbench-interaction/analyze.md` | `79471e67a09faa98fd87f1e7b21fa8dc0fa08fb38060e17f637508c6ed086476` |
| `specs/workbench-interaction/checklist.md` | `ae78b657221dbbaf3612a7ae83a5489f705c4b98562d23546ba9e5d30cac30e0` |
| `specs/README.md`（R6 后状态回写） | `b6d787c39d60643e765b0ca4d94284f288123c6bb13ef6e6f63c45fc6adf294e` |

### 阅读时的状态优先级

- `checklist.md` 的 **R6** 和本交接记录反映暂停时的当前状态。
- `tasks.md` 页首“草案 r5、待 A R6”与 Analyze R5 的“待 R6”是**交审时原文**；后续 R6 已通过。为保持审核输入不变，本会话没有在通过后改这些原文。
- `specs/README.md` 其他 feature 行及旧 plan 中“v2 待 Gate 1”已落后于外部分支；不要用它们推翻 v2 页首已有的 Gate 1 批准记录，也不要顺手修改别的 feature 状态行。

## 3. 外部依赖最后一次只读观察（不是永久状态）

### frontend-workbench v1

- 路径：`D:/2030/Futures-AI-frontend`，分支 `feat/frontend-workbench`。
- 最后核对分支 HEAD：`a7e20a43b31024fdf0862e6f548057d072cf40f2`。
- 已见 Gate 2 确认（`beb5b75`）与 Handoff 文档/AI 截图提交（`a7e20a4`）。
- 最后 `gh pr list` 实查：**PR #7 OPEN、`mergeCommit = null`**，`https://github.com/iswalterwu/Futures-AI/pull/7`。
- 最后 `git ls-remote` 实查：远端 main 仍为 `3bf64763573c6b45d3c9a8cb368502fad510c576`。本地 main `85c6cbb` 更旧，不能只看本地 main 判断远端合入情况。
- v1 `review.md` §9 新列 H-01 / H-02（图注断行 / 窄窗导航过高），执行者初判 P3、尚待 Walter 处置；此前接受的 11 项旧 P3 不等于自动接受这两项。AI 60 张截图不等于 Walter 人工验收签字。
- 外部会话可能继续推进；恢复时必须重查 PR，不重复断言“仍未合入”。本会话没有操作该分支、PR 或其进程。

### frontend-workbench v2

- 路径：`D:/2030/Futures-AI-workbench-v2`，最后核对 HEAD `949a232`。
- **spec v2.1 Gate 1 已通过**；Plan Checklist 已通过；Tasks 12 项 / 22 h、Analyze R2 已产出，新增 Plan / Tasks 仍待其 A 定向复核；不能继承 v1 Checklist 授权。
- `specs/frontend-workbench/tasks.md` §1.2 / §5 有 H-1～H-6、页面切片与开工登记要求；交接需要固定 commit、已提交有效 Checklist SHA、定向测试摘要、集成 SHA 四项。
- 还未执行双方交接对拍。需核共享未筛选 jobsStore 缓存/写后刷新、进行中 selector、session 同次导航清空、intake 的 jobId 快照/非模态容器约定、jobFixtures 整集合替换等消费细节；本 feature R6 通过不自动等于 v2 新增消费要求全部被确认/交付。

## 4. 恢复后按顺序执行（仅在用户恢复授权后，不在暂停期间执行）

### 4.1 先确认存档，不重复实施

```bash
cd D:/2030/Futures-AI-interaction
git status --short
git branch --show-current
git log -1 --format="%H %s" -- HANDOFF.md
git show --stat HEAD
git diff --check
```

用 read 工具重读 `AGENTS.md`、`docs/plan.md`、本文件、冻结 spec、plan、checklist R6、tasks、Analyze R5；确认没有别人新增的未提交改动。不得 reset、强推、清理共享 worktree 或手改审核勾选。

### 4.2 重新查询 PR #7 / main（只读）

```bash
gh pr view 7 --json state,mergedAt,mergeCommit,url
git ls-remote origin refs/heads/main refs/heads/feat/frontend-workbench
git -C D:/2030/Futures-AI-frontend log -4 --oneline
```

- 若仍 OPEN：保留 `implementation_base_sha = PENDING`，不启动代码；由前端负责会话处理新风险与 PR。此会话不越权替它 merge。
- 等待期间可在用户授权下做双方 H-x 交接对拍、v2 Tasks 的独立 A 复核。只细化设计时更新 Plan/Tasks → Analyze → A 定向；若改需求则回 Clarify / Gate 1，不擅改冻结 spec。

### 4.3 已合入时再解除实施基线门槛

用户授权恢复且 PR 确实 MERGED 后，才执行以下元数据同步/验证（不是现在执行）：

```bash
git fetch origin
MERGE_SHA="$(gh pr view 7 --json mergeCommit --jq '.mergeCommit.oid // empty')"
if [ -z "$MERGE_SHA" ]; then
  printf '未取得合入 SHA；保持 BLOCKED\n'
else
  git merge-base --is-ancestor "$MERGE_SHA" origin/main
fi
```

取得且核实合入 SHA 后，登记 tasks 的 `implementation_base_sha`，按 tasks §0 / §7 在真实基线复核脚本、契约、fixture 和既有测试事实。有实质差异先修任务、重跑 Analyze 并交 A 定向复核；无差异则只登记。指定集成人和双方独立 worktree/文件所有权；不要在这个规格 worktree 或其他 feature 分支上直接铺实现。

### 4.4 最后才启动实施（需用户授权）

- 按 AGENTS §6：计划/分析用 Opus 首选，Implement 用 `openai/gpt-6-astra` 首选，A 新会话用 Fable 首选且与实施异模型。
- 建议首批 **T-A01～T-A09**（类型/映射/fixtures/契约 2.0.0），随后按真实 DAG 推进；不能声称 A09 就完成 H-1，上下文事件链涉及 T-A18。
- 测试/构建只在依赖已满足、相应代码和测试存在后执行，沿用 tasks 中逐条命令。例如 `pnpm -C frontend contract --check`、`pnpm -C frontend typecheck`、`pnpm -C frontend lint` 及对应 jobs 路径单测；全量 `pnpm -C frontend test` 不在暂停时运行。
- 每个 H-x 按固定提交和测试证据串行交接，壳消费已交付切片，不互等双方全量 Handoff；最后分别 Converge / Review / Gate 2 / Handoff。

## 5. 命令、后台进程、端口与日志

- **进行中的命令：无。** 先前所有 pi print 子会话、探活、结构核验、git/gh 只读查询均已返回；没有待续跑的构建、下载、测试或安装。
- **本会话启动的后台服务：无。** 本会话未启动 Vite、Playwright webServer、Python 后端或 Electron。
- 暂停时已用 Windows `Get-CimInstance Win32_Process`，按本会话启动的十个明确 pi 子会话名匹配 node/bun/pi 进程：**没有残留匹配进程**，因此没有需要停止或重启的本会话服务/PID。
- 不停止其他会话的进程，也不按端口全局杀进程。其他 feature 的后台服务归各自所有者。
- **需要重启的命令/端口：无。** 未来前端 e2e 配置使用 `127.0.0.1:4173`，由测试自己的 webServer 管理；这是未来测试配置，不是本次遗留服务。
- 本会话没有独立的应用测试/构建日志文件。审核与验证摘要已保存在 `checklist.md` / `analyze.md` / 本文件。
- 本地主会话日志（只作本机排错，不复制入库）：`C:/Users/iswal/.pi/agent/sessions/--D--2030-Futures-AI-interaction--/2026-10-28T11-00-19-877Z_01a1822b-0525-7642-9baf-98b3088d9322.jsonl`。其中是完整会话记录，不应未经脱敏上传或当产品测试输出。

## 6. /tmp 与临时产物

- 恢复所必需的成果已全部在本次 WIP 的 `specs/workbench-interaction/` 与本文件中；**没有已确认必须从临时目录拷回的剩余重要产物**。此前临时 Python/Markdown 草稿仅用于一次性文档编辑/结构检查，非恢复前置。
- **已披露异常**：Tasks 修订子会话曾清理共享 `/tmp/an.py`，发现它可能已被其他会话改写但仍删除；该文件不在本项目 Git 中。已向用户报告；在检查过的本次/相关 pi 会话记录中没有找到它被改写后的完整内容，**无法复制或恢复**，未擅自重建。
- 不再次扫描或清理共享 `/tmp`，不复用 `an.py` 等通用文件名。将来需要结构检查，优先 `python - <<'PY'` 标准输入；确需临时产物时使用该会话独占目录，重要输出及时归档为脱敏项目文档。
- 不复制其他 feature 的临时产物、完整 pi 日志或用户私有数据到本仓库。本次暂停没有在项目外创建、覆盖或删除文件。

## 7. 需要 Walter 拍板 / 协调

1. 暂停期间不启动新任务；恢复时先明确授权范围：仅交接对拍/基线登记，还是在前置满足后允许代码实施。本次“暂停落盘并 commit”不等于实施或 push/merge 授权。
2. 前端 v1 新 H-01 / H-02 是先修还是接受为后续；人工截图如何确认，由其负责会话记录，不在本会话代批。
3. 指定双方集成人、共享文件合并顺序；对 v2 新增消费约束若影响冻结需求，需按流程重新裁定；不能用壳方要求直接覆盖本 feature 的已审需求。
4. `/tmp/an.py` 的误删如影响其他会话，需由该文件原所有者确认/重新生成；本会话没有足够内容可靠重建，不能伪称已修复。

## 8. 下次恢复后发给用户的第一句话

> 已读取交接记录；我会先核对前端 PR #7 和实施基线，未解除阻塞前不启动代码实施。

## 9. 恢复记录（2026-10-28 22:20 +04:00；替代 §1～§8 的暂停状态）

> 恢复收尾的文档记账，**不是**正式 feature Handoff，不走也不代批 Gate 2，不表示实现完成。
> 本节记账执行者：`claude-opus-5-5 via anthropic`。原因：本限额窗口对 `claude-bridge/claude-opus-5-5` 的真实最小调用 exit 1（quota / rate / spend_limit 类，原文未记录）；同模型 `anthropic` 最小调用及本轮 Plan 任务 exit 0。按 AGENTS §6 规则 2 / 5 只换通道不换模型，本窗口不重试已耗尽的 bridge，未改任何 provider / key / 路由 / 全局配置。

### 9.1 恢复授权边界

- 起点：`8af343ff085c0f958068b6b50008a6985f51d170`（§1～§8 的暂停 WIP 提交）。
- 用户指令为“按照 HANDOFF.md 继续”。协调器按原“此前不改代码”边界，只恢复**基线登记 + 接口设计（H-x 对拍）+ 独立审核**；“继续”**不视为新增代码实施授权**。

### 9.2 当前提交、分支与目录

| 项 | 值 |
|---|---|
| 文档 writer worktree | `D:/2030/Futures-AI-interaction-resume`，分支 `docs/workbench-interaction-resume-20261028` |
| r6 文档提交（Opus） | `0e37fbf9f2810ad04f1c1b3fd856b0219f9c2f0d`：plan / tasks / analyze / `interface-handoff.md`（新）/ `specs/README.md` |
| A R7 审核原件 | `9acf3de661187840ea5be6f6d6f78205872ac356`（审核分支提交原样 cherry-pick，hash 相同）；`checklist.md` Git blob `7c219c071607596c813af6a3ebc1b651e25cd8d0` |
| 本节 / README 记账提交 | 不在文件内硬编码自身提交号；用 `git log -1 --format="%H %s" -- HANDOFF.md` 查询（本记账写入时尚未提交） |
| 主规格 worktree | `D:/2030/Futures-AI-interaction` 仍为 `spec/workbench-interaction@8af343f`、clean。**计划**：协调器在本记账提交后，核验其 clean + HEAD，再把文档分支 **ff-only** 合回该 worktree；不 merge main、不 push。写入本节时**尚未执行**，恢复时以 `git -C D:/2030/Futures-AI-interaction log -1` 实查为准 |
| v1 基线只读目录 | `D:/2030/Futures-AI-interaction-base-43b6d79`（detached `43b6d79`） |
| v2 参照只读目录 | `D:/2030/Futures-AI-interaction-v2-ref-ded7161`（HEAD `ded716100381fcd2b4b5d3481f4f56e44c9869fd`；v2.1 Gate 1 + 其 A R2 内部审核已过，**仍未实施**） |
| A 审核 worktree | `D:/2030/Futures-AI-interaction-review-r7`，分支 `review/workbench-interaction-resume-r7` |

上述四个新建目录均**不清理**；原 v1（`D:/2030/Futures-AI-frontend`）/ v2（`D:/2030/Futures-AI-workbench-v2`）实际 worktree 本轮只读、未改。

### 9.3 阅读时的状态优先级（取代 §2 末节）

1. **当前权威**：`checklist.md` §R7、`specs/README.md` 本 feature 行与跨 feature 待同步行、本 §9。
2. `tasks.md` / `plan.md` / `analyze.md` 页首及 Analyze R6 中“待 A 新会话定向复核 = Checklist R7”等措辞是**交审时输入原文**；R7 已通过，但为保持审查输入不变，本轮**不改**这些文件。`interface-handoff.md` 同理。
3. `checklist.md` 只有 §R7 的 26 个复选框有效；R6 及更早轮次已由 A 改为文字符号，仅作历史。协调器与本记账者**未手勾**任何检查项。
4. §1～§8 中“`implementation_base_sha = PENDING`”“PR #7 OPEN”“62 任务 / 96.5 h”“Checklist R6 为当前”均已过时。

### 9.4 本轮完成事项

- **v1 基线门已满足**：`gh pr view 7` = MERGED，mergedAt `2026-10-28T12:49:38Z`，mergeCommit `43b6d79681a49562f41751368b2ae00c24062f56`；`git fetch` 后 `git merge-base --is-ancestor` 对 `origin/main` 成功，`origin/main` 正为该 SHA。tasks 已登记 `implementation_base_sha = 43b6d79`。
- **r6 设计（`0e37fbf`，Opus）**：在 `43b6d79` 真实文件审计 B-1～B-11，唯一实质差异 `mock.spec.ts:96-99` 旧硬编码循环落到 T-A09；与 v2 H-1～H-6 / 页面切片对拍，均为既有需求内接口精度，**无需求变化，46 AC 不变**，冻结 spec 零 diff。
- **任务变化**：r5 = 62 任务 / 96.5 h → r6 = **66 任务 / 约 101.5 h**，新增 T-A09a / T-A22a / T-A22b / T-C01a；**全部未开始**。Analyze R6 内部一致。
- **独立审核 Checklist R7**：A = `claude-fable-5-1 via anthropic`，新会话、独立 worktree、与实施异模型；未重探 fable bridge（继承本窗口 bridge 已耗尽证据），官方 fable 最小调用 exit 0，实际任务 exit 0。固定审 `0e37fbf` 相对 `8af343f` 的真实 diff：**通过，26/26 当前有效项，0 P1 / P2**，6 项 P3（S-27～S-32）不阻断。
  - 记录性说明：A 的 wrapper 打印因 Windows stdout GBK 不支持 Unicode minus 返回 1，但 A 进程本身 exit 0，`review-r7-result.md` 已以 UTF-8 保存；属输出编码问题，不是调用失败，**不重跑、不回退**。

### 9.5 已过与仍缺的门槛

| 门槛 | 状态 |
|---|---|
| spec v1.1 Gate 1 | 已过（冻结，未改） |
| v1 Handoff 合入 main / `implementation_base_sha` | **已满足**：`43b6d79` |
| IMPL-GATE-R6 (1) A 对 r6 定向复核 | **已满足**：Checklist R7 通过，`9acf3de` |
| IMPL-GATE-R6 (2) Walter 代码实施授权 | **未取得** |
| IMPL-GATE-R6 (3) 指定集成人、集成验证分支、实施 worktree / 分支（从 `43b6d79` 建立并带入 `specs/workbench-interaction/**`） | **未登记** |
| H 组（T-H01～T-H03）外部 v2 壳方 S1 / S2 | **阻塞**；AC-003-1 / AC-005-5 / AC-007-4 的 v2 子项未解除前 Converge 必报“未收敛（外部阻塞）” |
| H-x 八切片（H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-5、H-6）交接四项 | 仅“已提交有效 Checklist SHA”可填 `9acf3de`；**实现固定 commit、定向测试输出摘要、集成 SHA 三项未取得**，全部**未交付** |
| interface-handoff §5 v2 接收方确认（含 H-6 是否分批） | **未办**；设计通过 ≠ 双向签收 |

**结论：现在不能开工写代码。** (2)(3) 任一未满足，任何任务不得开始。

### 9.6 下一步（按顺序）

1. **Walter 决定**：是否允许代码实施；本协调会话是否担任集成人（并登记集成验证分支与实施 worktree）。**未答复前不写代码。**
2. **实施前精度修订（可选但建议）**：按 R7 建议在建实现分支前吸收 S-27（`job-state.ts` 模块级单例会话状态 / `jobFixtures` 建状态时读一次 vs v1 `fixtures` 每请求读）、S-29（j-failed 分析产物 draft vs 阶段 conflict、`pendingCount` 初始期望），可同带 S-28（终态-only 刷新依赖的摘要不变量断言）、S-30（追问经 `agentClient.send` 不带 sessionId 的措辞与 v2 知悉）。仅措辞 / 断言精度不需重过 R7；超出则重跑 Analyze 并请 A 定向复核。S-31 留作 Converge 逐写路径核对刷新，S-32 为实施期 lint 提示。**本轮未吸收、未改审核输入，不得声称已修复。**
3. v2 接收方对 interface-handoff §5 各项给出确认；合并时按 §5-6 处理 main 上 `specs/README.md` 的本 feature 行与已完成的 D-018 待同步行。
4. 授权与登记齐后：从 `43b6d79` 建实施分支（带入本规格文档），按 tasks §7 复核 §0.0；按 AGENTS §6 Implement 首选 `openai/gpt-6-astra`；首批 T-A01～T-A09 / T-A09a，按真实 DAG 推进，H-x 逐切片按四项证据交接。

### 9.7 工具、子进程、目录与临时产物

- 独占临时目录：`C:/Users/iswal/AppData/Local/Temp/wi-resume-01a18388-dmiq93ec/`，含各 prompt、片段、模型 sessions 与输出（如 `plan-result.md`、`analyze-r6.md`、`review-r7-result.md`、A 的 `r7-*` 片段）。核心产物已正式写入 `specs/workbench-interaction/` 与本文件，**恢复不依赖该目录**；保持不清理，原始 sessions / key / 完整报错**不入库**。
- 本轮**未再次删除** `/tmp` 任何文件；§6 所述旧 `/tmp/an.py` 异常按原记录保留，无新进展。
- **后台服务：无。** 本轮共派出 Opus Plan / Tasks / Analyze、独立 A R7、Opus 恢复记账三个子会话，均经同步调用完成后退出，没有待续跑的子会话或常驻 agent（本行由协调器在记账调用返回后核实）。

### 9.8 验证与未执行项

- 已做（纯文档）：独立结构核验——66 任务 / 101.5 h、每项 1～2 h；220 条完成标准 ↔ 220 条验证命令 1:1；46 AC 集合一致；DAG 无环、部分前置均为最终任务祖先；18 条 e2e AC 的最终命令均为 e2e；测试 jobs 路径 / WI 标题隔离。文档 `git diff --check` 通过。
- **未执行**：任何产品单测 / e2e / 构建 / 安装 / 服务 / 下载；已做 git / gh 查询、`git fetch origin` 元数据同步、独立文档 worktree / 分支建立、文档结构核验与文档 git 提交。无实现 commit、无定向产品测试、无集成 SHA。不 push、不建 PR、不 merge 到 main；文档分支 ff-only 同步计划见 §9.2。

### 9.9 下次恢复后发给用户的第一句话（取代 §8）

> 已读取交接记录：v1 基线 `43b6d79` 已合入并登记，r6 设计已过独立 A Checklist R7；现在只等你确认是否允许代码实施、以及本会话是否担任集成人，答复前我不写代码。

## 10. 开工登记（2026-10-28，r6.1；替代 §9.5 / §9.6 / §9.9 的“待授权”状态）

> 开工前文档记账，**不是**正式 feature Handoff，不走也不代批 Gate 2，不表示任何任务完成。
> 记账执行者：`claude-opus-5-5 via anthropic`（本限额窗口 `claude-bridge` 已真实返回 quota / rate / spend_limit 类失败，exit 1，按 AGENTS §6 规则 5 不重试；同模型 `anthropic` 最小调用与正式文档任务 exit 0；未换模型、未改 provider / key / 路由 / 全局配置）。

### 10.1 新增授权（原话）

- 协调会话上一轮问：“是否允许开始代码实施，并由本会话担任集成人？” Walter 回复原话：“**允许**”。
- 解读边界：新增 = 本 feature 已审 tasks 内的代码实施授权 + 指定该协调会话（`PI_SESSION_ID=01a18388-a371-7746-8158-9fb15d55d819`，`openai/gpt-6.1-sol`）为集成人。**不**代其他 feature 的 Gate 1 / Gate 2，**不**授权扩范围、不改冻结 spec / AC、不代 v2 接收方签收。

### 10.2 工作树与基线（协调器已实际创建；本轮只读核验）

| 项 | 值 |
|---|---|
| 实施树 | `D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra` |
| 生产方集成验证树（仅集成人串行写） | `D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction` |
| 创建起点 → 当前 | 均自 `43b6d79` 创建，fetch 发现 main 前进后 ff-only 到 `90187f7d8907316e554d2441d846827468c5371f`（PR #8 H-01 修复 + PR #9 D-020～D-024 文档）；clean、无本 feature 代码、尚无 `specs/workbench-interaction/**` |
| `implementation_base_sha` | **仍为 `43b6d79`**（v1 正式 Handoff）；另登记 `upstream_start_sha = 90187f7` |
| 只读参照 | main `D:/2030/Futures-AI-interaction-main-ref-90187f7`；旧基线 `D:/2030/Futures-AI-interaction-base-43b6d79`；v2 `D:/2030/Futures-AI-interaction-v2-ref-79b5212`（`79b5212`，H 消费要求与 `ded7161` 相同） |
| v2 自有树（他人所有，严禁写 / 代 merge） | `D:/2030/Futures-AI-workbench-v2-integration`（`integration/frontend-workbench-v2`）及其实施树；即使其协调会话也是 Sol，也不是本 session |

### 10.3 本轮文档改动（规格写入树 `D:/2030/Futures-AI-interaction-resume`，起点 `5e9e1f4`，未 commit）

- `plan.md`：页首 r6.1 记录；§2.3 种子句（S-29）；§2.4 `jobFixtures` 句（S-27）；动作矩阵“追问”行（S-30）。
- `tasks.md`：页首新增「当前开工状态（r6.1）」块；§0.0 末“r6.1 upstream 复核”；T-A07（S-29）、T-A10 / T-A18 修改范围（S-27）、T-A18 标准 4（S-28）、T-A21 标准 5（S-29）、T-A22 提示（S-32）、T-E03（S-30）、§7 Converge 核对项（S-31）。任务数 / 工时 / 依赖 / AC / 命令不变。
- `interface-handoff.md`：页首当前状态；§0 增实施 / 集成树与 v2 最新参照行；§1 ④ 口径（= v2 集成树所有者登记，生产方集成 SHA 不能代填）与 ② = R7 `9acf3de`；§3 `jobFixtures` 行（S-27）；§5-6 补 main `90187f7` 合并口径；新增 §5-7（S-30）；§6 H-01 已修复。
- `analyze.md`：页首当前结论；文末新增「Analyze R7」（只读，结论：无实质新问题，精度修订在 R7 授权范围内，不需重过 R7 / 另起 A）。
- 新建 `implementation-log.md`：授权、基线、工作树、模型候选、首批派工范围、实施提示、证据与派工记录表（全部待填，非 Gate 2 Handoff）。
- `specs/README.md`：只改本 feature 行（→ in-progress）与本 feature 的跨 feature 待同步行。
- **未改**：`spec.md`、`checklist.md`（blob 仍为 `7c219c0…`）、`checklist-review-request.md`、`docs/**`、`frontend/**`、`backend/**`、`shell/**`、`design/**`、AGENTS.md、全局配置、其他 worktree。

### 10.4 main `90187f7` 文档影响（只读核验，详见 analyze.md「Analyze R7」§3）

- D-020 ADR 末条：“`workbench-interaction`（已冻结）不加 AC”；main `docs/plan.md` §8 保留 Phase 1.5；§9 明写产品批准“不是其他 feature 的 Gate 1 / Gate 2”。
- 本 feature 不加 calls / `basis=private` / 观点·call·决策块 / 世界模型（`slot_fix`）/ 常驻研究台与自主度 / 多主体 / 协议冷启动（`interview`）等，只登记由后续 feature 承接。
- H-01 已经 PR #8 修复（§3 / §9 中“H-01 未处置”为当时历史）；H-02 仍为 frontend-workbench v2 事项。
- 现阶段不 merge main 进规格分支、不改权威 docs；后续把本规格目录定向导入 `90187f7` 起点的实施分支，不整文件覆盖 main 的 `docs/**`、`specs/README.md` 或其他 feature 规格。

### 10.5 门槛现状（取代 §9.5）

| 门槛 | 状态 |
|---|---|
| spec v1.1 Gate 1 | 已过（冻结，未改） |
| `implementation_base_sha` | 已满足：`43b6d79`（`upstream_start_sha = 90187f7` 另记） |
| IMPL-GATE-R6 (1) A R7 | 已满足：`9acf3de` |
| IMPL-GATE-R6 (2) Walter 代码授权 | **已取得**：原话“允许” |
| IMPL-GATE-R6 (3) 集成人 / 集成验证分支 / 实施 worktree | **已登记**（§10.2） |
| 开码前置：实施分支带入 r6.1 规格 | **未完成**（集成人执行） |
| H 组外部 v2 S1 / S2 | 阻塞（不变） |
| H-x 八切片 | 全部未交付；② = R7 `9acf3de`，①③ 待实现，④ 待 v2 集成树所有者真正集成后登记 |
| interface-handoff §5 v2 接收方确认 | 未办 |

### 10.6 下一步（按顺序）

1. 协调器 / 集成人提交本轮文档改动（本记账者不 commit），在规格分支上核验 `git diff --check` 与结构。
2. 集成人把含 r6.1 的 `specs/workbench-interaction/**`（及 README 本 feature 行）定向带入 `feat/workbench-interaction-astra`，登记带入 SHA 于 `implementation-log.md` §2。**此前不写代码。**
3. 按 AGENTS §6 派 Implement（首选 `openai/gpt-6-astra`，新会话、在实施树）做首批 **T-A01～T-A09、T-A09a**，按 DAG；每任务回报 commit 与验证命令输出摘要，由集成人串行并入 `integration/workbench-interaction` 并登记证据。
4. H-1 在 T-A09a 后形成 ①②③ 三项生产方证据，通知 v2 所有者；④ 由其集成后登记，本 session 不写 v2 树、不代其 merge。
5. 后续批次、Converge（含 S-31 逐写路径刷新核对）、Review（A 新会话异模型）、Gate 2、Handoff 按 AGENTS §2。

### 10.7 验证与未执行项

- 已做（纯文档）：脚本复算 66 任务 / 101.5 h / 每项 1～2 h；220 ↔ 220 逐任务 1:1；46 AC = 矩阵；DAG 无环、部分前置均为最终任务祖先、任务 ↔ 矩阵双向一致；18 条 e2e AC 最终命令均为 `e2e/jobs`；213 个 `-t` / `-g` 标题 = 211 WI + 2 占位；测试路径隔离。`git diff --check` 结果见交付回复。
- **未执行**：任何产品单测 / e2e / 构建 / 安装 / 服务 / 下载；fetch / commit / push / PR / merge；写其他 worktree。临时脚本与片段只在独占目录 `C:/Users/iswal/AppData/Local/Temp/wi-implement-01a18388-72nsu9xh/`（不清理、不入库）；未触碰共享 `/tmp`。

### 10.8 下次恢复后发给用户的第一句话（取代 §9.9）

> 已读取交接记录：代码实施已获授权、本会话为集成人，工作树已建；r6.1 精度修订已落文档，下一步由集成人把规格带入实施分支后派 Implement 做首批 T-A01～T-A09 / T-A09a，此前不写代码。

## 11. 首批实施 + 独立批次 Review（2026-10-29；替代 §10 的实施前状态）

> 本节由 Opus 恢复记账会话起草、协调器据实际集成结果补记。Plan / Converge / 记账 = claude-opus-5-5 via anthropic；Implement = openai/gpt-6-astra；独立 A = claude-fable-5-1 via anthropic。Claude bridge 在本 session 限额窗口已有 quota / rate / spend_limit 类真实失败，未重复探活；官方同模型调用成功，未改配置。**不是正式 feature Handoff、不是 Gate 2；本轮在首批安全点汇报，不是用户暂停。**

### 11.1 授权与当前进度

- Walter 原话“**允许**”代码实施及指定协调会话 `01a18388-a371-7746-8158-9fb15d55d819`（openai/gpt-6.1-sol）为集成人，**在本 feature 既有 tasks 范围内持续有效，不再重复请求授权**。
- 首批 **T-A01～T-A09、T-A09a：10/66 已完成**（本批代码 Review 通过，不表示产品 AC 最终验收）。内容：契约枚举 / 展示映射 / 作业与产物 schema / 六类交付块与定稿元数据 / 介入事件 / 五份场景 fixtures / 版本 2.0.0 / `jobContext` 透传。
- **其余 56 项未开始；46 条 AC 最终验收仍为 0；feature 未收敛（尚未实施 + H 组外部阻塞）。** 不改冻结 spec、不扩 D-020～D-024 范围、不代其他 feature Gate 或 v2 签收。

### 11.2 固定提交与证据

| 项 | 固定引用 / 结论 |
|---|---|
| 正式 v1 Handoff / 上游同步 | `implementation_base_sha = 43b6d79681a49562f41751368b2ae00c24062f56`；`upstream_start_sha = 90187f7d8907316e554d2441d846827468c5371f` |
| 授权规格来源 / 种子 | 来源 `1ad796330997d3d4990ac513428ad7b2427d0422`；实施种子 `8753fa9f65dae685f765f316b00e6287750f0cf7` |
| 本批代码 | `8753fa9..13a3373`（12 提交、21 文件），受审代码头 `13a3373f7ebd2075fb8bcfe32033127a916fa6b9`；逐任务 SHA 与两次 describe 回归修复见 `implementation-log.md` §6 |
| 本批 Converge | `b0b065fb799c52ae729c9bd6d45335b5e165a4d0`；`converge-batch-a09a.md`：仅本批范围收口，整体未收敛 |
| 独立代码 Review | A 新会话、独立工作树固定审 `b0b065f` / 代码 `13a3373`；**本批通过，0 P1/P2，6 项 P3（R-A～R-F）**；原样产物 `review-batch-a09a.md` 提交 `af95b66505875609f7ed3f823e047cd16226a1c5` |
| 批次最终记账 | `0920004b1daed2721f81834de76c067931ab2350`；代码、实施树和生产方集成树均已同步至此，代码仍与受审 `13a3373` 相同 |
| 本规格树同步提交 | 本文件不硬编码自身提交号；用 `git log -1 --format="%H %s" -- HANDOFF.md` 查询 |

**审核员亲跑（不是仅引用实施者）**：`pnpm -C frontend install --frozen-lockfile`、`contract --check`、`check` 六守卫、`typecheck`、`lint` 均通过；全量 `test:unit` **21 files / 722 passed / 0 failed**；三份既有契约测试 **88 passed**；首批 **28 条 `-t` 标题命令全部匹配通过**；额外 `test:e2e e2e/agent.spec.ts` **8 passed**（4173 由测试 webServer 自管）。**未跑全量 `pnpm test` / 全部 E2E，无人工截图，无 Gate 2。**

### 11.3 工作树与文件位置

- **实施代码**：`D:/2030/Futures-AI-interaction-implement`，`feat/workbench-interaction-astra`，已 ff-only 到 `0920004`。
- **生产方集成**：`D:/2030/Futures-AI-interaction-integration`，`integration/workbench-interaction`，已 ff-only 到 `0920004`，仅本协调 session 串行写；它**不是 v2 接收方集成树**。
- **Converge / 记账**：`D:/2030/Futures-AI-interaction-converge-a09a`，`docs/workbench-interaction-batch-a09a`，`0920004`。
- **审核原件**：`D:/2030/Futures-AI-interaction-review-a09a`，`review/workbench-interaction-batch-a09a`，`af95b66`；审核已结束。
- **当前规格树**：`D:/2030/Futures-AI-interaction`，`spec/workbench-interaction`；只定向同步 `specs/workbench-interaction/**`、本 feature README 状态及本 HANDOFF，不把实现写到此树，不覆盖 main 分支的根 HANDOFF / 权威 docs / 其他 feature 文件。
- 恢复时优先读本 §11、tasks 页首、`implementation-log.md` 当前块和 `review-batch-a09a.md`；旧 Converge / Analyze 的“待 Review”是当时原文。

### 11.4 H-x 与后续

- **H-1 已具备生产方 3/4 证据**：① `13a3373`；② Checklist R7 `9acf3de`；③ H-1 定向测试及 A 亲跑结果（schema 3 / legacy 5 / passthrough 7、scenarios 15）。**④ v2 消费方集成 SHA 未取得 → 未交付**；只能由 `integration/frontend-workbench-v2` 所有者真正集成后登记，本 session 不代写。
- 其余 H-x 未交付：H-2·标签缺 `JobStatusBadge`，H-6 缺实际状态层等。原设计 Checklist blob `7c219c071607596c813af6a3ebc1b651e25cd8d0` 全程未改、未手勾。
- 下一批可开工入口：**T-A10 / T-A22 / T-A23 / T-A24**，仍用独立 Implement（首选 openai/gpt-6-astra），按既有 DAG 推进，再做批次 Converge / 独立 A Review。
- 六项 P3 只登记后续定位，**未修复、未经 Walter 风险接受**：R-A（冲突态 `Deliverable.blocks` 当前视图规则，须 T-A16 / T-A19 前定案）；R-B（未开始阶段 fixture 产物语义，T-A10 消费时核对）；R-C（前瞻契约文案，T-G06）；R-D（跨字段不变量，相关状态层任务先定保证位置，若补防御性校验须按 AGENTS §5.1 先报 Walter 同意，不悄加机制）；R-E（finalize outcome，T-A17）；R-F（投放样例、T-A21 同时更新作业与阶段计数）。细节以审核原件 §4 与实施日志 §8 为准。

### 11.5 验证与进程

- 协调器最终文档结构复核：**66 项 / 101.5 h，10 已完成 + 56 未开始，220 条标准 ↔ 220 条命令，46 AC 集合一致，依赖无环**；Markdown 状态行加粗已正确剥离后计数。`git diff --check` 通过，源码、冻结 spec 与 A Checklist 原件不因状态回写而变化。
- 全部模型调用均同步返回，无待续跑子会话；A 的 E2E webServer 由测试自管，不保留常驻服务。临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-implement-01a18388-72nsu9xh/` 保留提示、会话和日志；核心结论已进规格文档，恢复不依赖临时目录；不清理共享 `/tmp`。
- **未 push、未开 PR、未 merge main**。正式全 feature Review / Gate 2 / Handoff 仍在后续。

### 11.6 下次开场（取代 §10.8）

> workbench-interaction 首批 10 项已实施并通过独立 A 批次 Review，下一批按既有授权从 T-A10 / T-A22 / T-A23 / T-A24 推进；H-1 仍待 v2 所有者集成，整体尚未收敛。

## 12. 第二批实施 + 独立代码 Review（2026-10-29；替代 §11 的后续任务状态）

> 依据 Opus 第二批记账摘要，由协调器按实际提交与工作树状态追加。本节**不是正式 feature Handoff、不是 Gate 2**；本轮在批次安全点汇报，不是用户暂停。Plan / Converge / 记账 = claude-opus-5-5 via anthropic；Implement = openai/gpt-6-astra；独立 A = claude-fable-5-1 via anthropic。本轮 Claude bridge 最小真实调用均失败，类别为 **provider / invocation error（未确认 quota）**，同模型官方通道成功；只换通道、未改用户配置，未因审核结果换模型。

### 12.1 授权与当前进度

- Walter 原话“允许”代码实施及指定协调会话 `01a18388-a371-7746-8158-9fb15d55d819`（openai/gpt-6.1-sol）为集成人，连同本轮“继续”，在既有 tasks 范围内持续有效；**后续批次不重复请求代码授权**。不扩范围、不改冻结 spec / AC，不代其他 feature Gate 或 v2 签收。
- 两批合计 **16/67 已完成**：首批 10 项 + 第二批 6 项。**51 项未开始；46 AC 最终验收仍为 0；feature 未收敛（尚未实施 + H 组外部阻塞）**。“已完成”指本批完成标准与独立批次代码 Review 通过，不是整体产品验收。
- 下一已满足依赖的入口为 **T-A11**（本地持久化），之后按 tasks §6 DAG 推进；T-A11 / T-A18 派工须携带 R2-B 的正常初始化顺序约束，不擅加防御 guard。

### 12.2 Checklist 与任务拆分

- Checklist **R8 未通过**：原件 `7b91a2c3b5bdfd1147aeee7fbeb23d043c439b98`，25/26，唯一 P2 = **B-12**（T-A10 已顶格 2 h，不能再并入 fixture 校正）。未通过历史保留。
- 由 Opus 拆出 **T-A09b fixture-only（0.5 h，依赖 T-A08）**，T-A10 依赖它并恢复核心 2 h；重跑 Analyze R10。任务数 66 → **67**，预估 101.5 → **102 h**，完成标准 / 验证命令 **224 / 224**，46 AC 不变。
- A 新开独立会话做 **R8.1 增量复核通过**：原件提交 `34d339eb1705310927f06d95aaf64bfc9bf4a5c3`，当前有效 26/26，B-12 关闭，Checklist Git blob `99e096ad9f82bffe2e61d13ea5a8512d5075ce71`。实施与状态记账均未改 A 的清单原件；旧 R7 / R8 复选框由 A 改为历史文字符号。

### 12.3 第二批代码与固定引用

| 任务 / 产物 | 固定提交 |
|---|---|
| T-A09b：12 个未开始阶段种子校正 | `75a115975b50d8078f159f2e41ce5c401318f0b7` |
| T-A10：共享状态、真实 commit、三读取 API / real 桩 | `1841029f5a948b53ef21cbc54967556dc04e0815` |
| T-A22：路由切片与明确无数据骨架 | `cc59e946df2d08178b03e3b37928ab34517067d7` |
| T-A22b：只读会话上下文与 bindRouter | `b38cf43f602390d7645cc84514d0da9860a7e0b7` |
| T-A23：契约驱动状态／来源徽标 | `ebce4c85b1422a62b883117f75459a1fdee81b80` |
| T-A24：有界行级 LCS diff / 摘要退化 | `27e59e610e2ab8c14e7c3db554609e52e40f5f76` |
| 第二批 Converge / Analyze R11 | `858025d0b75f529e160b973ba5bda10848889228`；`converge-batch2.md` 判本批范围收口、整体未收敛 |
| 第二批独立代码 Review 原件 | `f72a1a187405e9f9dcba5bb22f47ad840141702d`，`review-batch2.md`；A 固定审 `858025d` + 代码 `27e59e6` |
| 第二批最终记账 | `f1b7c06bc7202685fdd3786d74c294cac6ae406e`；代码仍与受审 `27e59e6` 相同 |
| 当前规格树同步提交 | 不硬编码自身；用 `git log -1 --format="%H %s" -- HANDOFF.md` 查询 |

### 12.4 独立审核与验证证据

- **独立 A 本批代码 Review 通过：0 P1/P2，5 项 P3（R2-A～R2-E）**。审核员新会话、独立工作树，与实施异模型；原件已原样提交，不由实施者改写。
- A **亲跑**：全量 `test:unit` **27 files / 833 passed / 0 failed**；v1 三份契约测试 **88 passed**；本批 **21 条任务命令全部通过**；H-2 `WI labels` 10 passed；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` **24 passed**（Playwright 自管 4173，结束后无 LISTEN）；`contract --check` **15 methods / 10 events / 2 artifacts**；六守卫、typecheck、lint 全过。
- **未跑**：全量 `pnpm test` 的其余 7 份 E2E；无人工截图，无 Gate 2。不能把本批固定基线上的绿当作最新 main 的测试证据。
- 本批新增测试首跑失败（A10 的嵌套匹配器、A23 的 DOM 选择器）已只修新测试后重跑，未削弱既有测试或生产校验，失败留痕见实施日志；未因此换模型。

### 12.5 工作树与同步范围

- 实施：`D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra`，已 ff-only 到 **`f1b7c06`**。
- 生产方集成：`D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`，已 ff-only 到 **`f1b7c06`**，仅本协调 session 串行写。
- Converge / 记账：`D:/2030/Futures-AI-interaction-converge-batch2` / `docs/workbench-interaction-batch2-converge`，`f1b7c06`。
- 独立代码审核树：`D:/2030/Futures-AI-interaction-review-batch2` / `review/workbench-interaction-batch2-code`，`f72a1a1`，已结束。
- 当前规格树 `D:/2030/Futures-AI-interaction` / `spec/workbench-interaction` 只同步本 feature 文档、自己 README 状态及此 HANDOFF，不铺实现、不覆盖实施树中 main 的根 HANDOFF、权威 docs 或其他 feature 文件。

### 12.6 H-x 与上游风险

- **H-1、H-2·标签、H-3·路由切片、H-4** 均具备生产方 **① 固定实现 commit + ② 已提交有效 Checklist + ③ 定向测试摘要（含独立 A 亲跑）**；**④ 消费方集成 SHA 全部未取得 → 未交付**。当前有效清单为 R8.1 `34d339e`；H-1 保留当时 R7 `9acf3de` 的历史追溯。
- 只读核：消费分支 `integration/frontend-workbench-v2` = `3f63273`，四个实现提交 `13a3373` / `ebce4c8` / `cc59e94` / `b38cf43` 均不是其祖先。本 session 不写、不重建、不代 merge 外部 v2 可写树；④ 由其所有者真正集成后登记。H-2·列表、H-6、H-5、页面切片提供任务未齐，仍未交付；路由页是骨架，不是作业页面功能交付。
- 正式 `implementation_base_sha` 仍为 v1 Handoff **`43b6d79`**；本批 `upstream_start_sha` 继续 pin **`90187f7`**。main 已到 **`072bb12de3425e1b76357b5771e47f0609b32979`（PR #11，v2 S0）**，但不在本批祖先中，**本批不自动同步**。
- 同步新 main 前按 tasks §7 重核 §0.0 → Analyze → A 定向复核 → 指定范围修订 `routes.spec` 的“真实路由表原无 jobs / +2 条”断言；同时与 v2 所有者协调 **T-V2-09#4** 对 shell E2E `/jobs` owner 占位断言的迁移。不要代改壳测试，不把生产集成树 SHA 冒充消费方④。这是同步前置，不是当前 T-A11 的新增人工门。

### 12.7 P3 与下一步

- R2-A：契约 describe 混入 mock 实现语义，归 T-G06，与首批 R-C 收口。
- R2-B：内部状态未初始化时为非契约错误，T-A11 / T-A18 按正常工厂顺序接入并以测试固定，不在此加 guard。
- R2-C：徽标统一 ok 边框令牌，首个消费页面或 T-G10 前用既有令牌核对；本批未修。
- R2-D：新 main 同步后的路由测试耦合，按上节同步流程处理。
- R2-E：新读方法的延迟 / error 行为随当前共享状态的 scenario，v1 十方法仍随各自工厂捕获值；按 A 建议已在 plan §2.4 补一句精度，不改代码。
- 上述 P3 只作后续定位，**未修复、未经 Walter 风险接受**（R2-E 仅文档精度已登记）。首批 R-B 已校正未开始种子但 done 上游 draft 不自动审批，仍部分落实；S-37 正向 workspace 断言已落实；R-A 仍须 T-A16 / T-A19 前定案；其余见 `implementation-log.md` §8。
- **下一步：T-A11**，随后按现有 DAG 推进；新会话先读当前任务、Review 与初始化顺序提示，不再追问代码授权。

### 12.8 进程与保存

- 全部模型调用同步返回；E2E webServer 自行结束，无本 session 需续跑的服务或子会话。临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch2-01a18388-i8ukv6xl/` 保留提示、探针、日志和摘要；核心结论均在本 feature 的任务、实施日志、Converge、Review、接口登记中，不依赖临时目录，原始 session / 凭证不入库、不清理共享 `/tmp`。
- 最终文档结构复核：**67 项 / 102 h，16 完成 + 51 未开始，224 标准 ↔ 224 命令，46 AC 集合一致，DAG 无环；当前有效清单 26 勾 / 0 未勾**。旧轮次复选框不参与开工判定。
- 未 push、未开 PR、未 merge main；正式全 feature Review / Gate 2 / Handoff 仍在后续。

### 12.9 下次开场（取代 §11.6）

> 第二批六项已实施并通过独立 A 代码 Review，当前 16/67 完成；按既有授权从 T-A11 继续。H-1 / H-2·标签 / H-3 / H-4 仍待消费方集成，新 main 的路由断言同步前置已登记，整体未收敛。

## 13. 第三批实施 + 独立代码 Review + R3-A 补修（2026-10-29；第三批安全点恢复记录，非正式 Handoff；替代 §12 的后续任务状态）

> 本节为**第三批安全点恢复记录**：由 Opus 状态登记会话起草（claude-opus-5-5 via anthropic，PI_SESSION_ID `01a1876b-2420-709d-b58f-04d6eed0d36f`），协调器按实际提交与工作树状态核对后追加。**不是正式 feature Handoff，不是 Gate 2；本轮在批次安全点汇报，不是用户暂停。** Plan / Converge / 记账 = claude-opus-5-5 via anthropic；Implement = openai/gpt-6-astra；独立 A（Checklist R9、第三批代码 Review、T-A22c 增量 Review）= claude-fable-5-1 via anthropic；集成人 = 协调会话（openai/gpt-6.1-sol）。本窗口 Claude bridge 最小真实调用为 **quota / rate / spend_limit 类**失败，同通道不重试；同模型官方通道成功；只换通道、未改 provider / key / 路由 / 全局配置，未因测试或审核结果换模型。

### 13.1 授权与当前进度

- Walter 原话“允许”代码实施并指定协调会话 `01a18388-a371-7746-8158-9fb15d55d819` 为集成人，在既有 tasks 范围内持续有效；**后续批次不重复请求代码授权**。不扩范围、不改冻结 spec / AC，不代其他 feature Gate 或 v2 签收。
- 当前 **68 个任务 / 约 102.5 h**，**21/68 已完成**（首批 10 + 第二批 6 + 第三批 4 + R3-A 补修 1），**47 项未开始**；完成标准 / 验证命令 **227 / 227**；**46 AC 最终验收仍为 0；feature 未收敛（尚未实施 + H 组外部阻塞）**。“已完成”= 所在批次独立代码 Review 通过，不是产品验收。
- 本轮五个代码任务：**T-A11**（本地持久化与样例重置）、**T-A12**（createJob 与投放主流程）、**T-A13**（待归属池、归入、删除来源、取消作业）、**T-A22a**（jobsStore 共享未筛选缓存、写后与 agent 终态刷新）、**T-A22c**（R3-A 补修：筛选成功不改写未筛选列表读状态）。

### 13.2 Checklist、范围停止与失败留痕

- 开码前精度 r6.6（`ef64c1853f79ea1e18e99a7b0ff22de2152de40c`）经 A **Checklist R9 通过**：原件 `ab742f5801628b15324fc998f03959482fd31d9d`，26/26，0 P1/P2，P3 S-38～S-40（已在实施中落实）；`checklist.md` blob `74084c1337491a042c944096e1f290fe07aab324`。**R9 仍是当前有效 Checklist**，本轮未改、未重勾；T-A22c 是已审 Review 点名的 Converge 补修，不另开 Checklist 轮次。本规格树只转存 A 的 R9 原件，不由实施者勾选。
- **两次范围停止（真实留痕，不是调用失败、不回退）**：① T-A11 开码前，`real-stubs.spec.ts` 的 `requests` 表须为新方法加键但不在写入清单 → Astra 停下 → r6.6.1（`e4031fae9ca31d090f2bec4ed4b09793ff3dea56`）只许追加键；② A13 实现后全量 `test:unit` **925 pass / 1 fail**（T-A11 旧 error 分支仍期待 commit 成功，与已批准的 A12 拒绝时机冲突）→ Astra 停下 → r6.6.2（规划树原件 `8c4660fe9121610b2bd85a13cfd7ea97d7f7c75e`，定向导入实施树 `198846383e23910e17e0a48a24d9d80c4cb213fe`，A13 WIP 无损）→ 独立 test-fix `0a2d1a5`，之后 clean 全量 926 / 0。
- **T-A22c 先红后绿**：修复前新两例 2 fail（`ready`≠`idle`、`ready`≠`error`），删两行后通过。各失败原文摘要已入 `implementation-log.md` §6 / §7 / §12，恢复时不需要粘贴原日志。

### 13.3 固定引用

| 项 | 固定提交 |
|---|---|
| T-A11 | `c7ebccb8f9e29350d5a815959be3b532191bdb95` |
| T-A12 / 语义回归 test-fix（r6.6.2） | `742d6aa3d671cee91c6cce856f657a103d510615` / `0a2d1a5e756b4a469996d2069996a256f16722b9` |
| T-A13 | `a5ad11c79cf08ca50ebb55ef0984beae952a7dad` |
| T-A22a（第三批受审代码头） | `0032fc6b3e47ee6de27a03c2c229ef57ca9115cc` |
| 第三批 Converge / Analyze R13 | `e14ad25d525d319fee85e2fc34e4ebb972e42150`（`converge-batch3.md`：本批收口、整体未收敛） |
| 第三批独立代码 Review 原件 | `49edb7ebf7bd0fdb0ab9ea0767c33945b39e13cf`（`review-batch3.md`：**通过，0 P1/P2，3 P3 R3-A～R3-C**） |
| R3-A 补修登记 r6.8 / Analyze R14 | `e7716a88297ed9f3fe3a642215bd970c3a326a37`（方案 b；commit body 记集成人接受 T-B01 也依赖 T-A22c 以保 AC 矩阵祖先，属任务排期） |
| T-A22c（**当前代码固定点**） | `af24c826f41580d27f90ce611fb2f55fec44acbf` |
| T-A22c 增量 Converge / Analyze R15 | `eb91340096a22f845c8511a370d6100262e939d4`（`converge-batch3-cache-fix.md`：T-A22c 收口、整体未收敛；不判 R3-A 关闭） |
| T-A22c 增量代码 Review 原件 | `69faacccabd8b089a9f240b28e6449a8fea90619`（`review-batch3-cache-fix.md`：**通过，0 P1/P2，0 新 P3，R3-A 关闭**） |
| 第三批安全点状态登记 | `6ba2a155d85d7495014eb5c2faff36cd542d3288`（tasks / implementation-log §13 / interface-handoff / analyze 页首 / README 本 feature 两行） |
| 当前规格树同步提交 | 不硬编码自身；用 `git log -1 --format="%H %s" -- HANDOFF.md` 查询 |

### 13.4 独立审核与验证证据

- **第三批代码 Review**（A 新会话、独立工作树，固定审 `e14ad25` + 代码 `0032fc6`）亲跑：全量 `test:unit` **31 files / 951 / 0**；本批 **19 条任务命令**用例数与实施者逐条相同；v1 三份契约测试 **88**；real-stubs **23**；六守卫、`contract --check` 24 / 10 / 2、typecheck、lint；`e2e/shell.spec.ts` + `e2e/agent.spec.ts` **24 / 0**；只读探针 8 例。R9 交代的隐私核对项（快照六键业务子集、Upload strict 白名单含既有 `quarantineReason`、无原文持久化、`mappingHistory` 每条投放至多一条）经 A 认可。
- **T-A22c 增量 Review**（A 新会话、独立工作树，固定审 `eb91340` + diff `e7716a8..af24c82`）亲跑：`WI H-2 list status` **2**；整文件 **27**（原四组 5 / 4 / 7 / 9 保持）；typecheck / lint / `contract --check` 24 / 10 / 2；全量 `test:unit` **31 files / 953 / 0**；六守卫；v1 契约 **88**；real-stubs **23**；shell + agent E2E **24 passed**。只读探针 6 例：P1 / P2 不再复现，同 tick 并发与 slow 加载中筛选终态正确。生产 diff 仅删 `applyFilter` 成功分支两行，测试新增 2 例、旧例精度改（未删覆盖），无新状态机 / 请求序号 / 锁。
- **未跑**：其余 7 份 E2E、全量 `pnpm test`；无人工截图；无最终 AC 验收、无 Gate 2。所有产品测试由实施者与 A 真实执行；Converge / 记账会话未跑产品测试。
- 状态登记后脚本复算：68 项 / 102.5 h，**21 完成 + 47 未开始**，227 ↔ 227，46 AC 矩阵一致、部分前置均为最终任务祖先，DAG 无环；逐任务预计 / 标准 / 命令与 §5～§7 相对 `69faacc` 无差异。

### 13.5 工作树分工与同步范围

- **代码固定 `af24c82`**：其后只有文档提交，代码不变。
- 实施：`D:/2030/Futures-AI-interaction-implement` / `feat/workbench-interaction-astra`，已由集成人 ff-only 至 **`6ba2a155d85d7495014eb5c2faff36cd542d3288`**。
- 生产方集成：`D:/2030/Futures-AI-interaction-integration` / `integration/workbench-interaction`，也已 ff-only 至 `6ba2a15`；**集成人是唯一串行写入者**，它不是 v2 接收方集成树。
- Converge / 记账：`D:/2030/Futures-AI-interaction-converge-batch3` / `docs/workbench-interaction-batch3-converge`（`6ba2a15`）。
- 只读审核树（已结束）：`-checklist-batch3`（`ab742f5`）、`-review-batch3`（`49edb7e`）、`-review-batch3-cache-fix`（`69faacc`）；规格准备树 `-plan-batch3`（`8c4660f`）。
- 当前规格树 `D:/2030/Futures-AI-interaction` / `spec/workbench-interaction` 只定向同步本 feature 文档、README 本 feature 行与本 HANDOFF 新恢复节，**不铺实现代码**，不覆盖 main 的根 HANDOFF、权威 docs 或其他 feature 文件。**规格树只同步文档；生产方代码已由集成人串行 ff-only。未 push、未开 PR、未 merge main、未做全 feature Review / Gate 2。**

### 13.6 H-x 与上游边界

- **H-2·列表**：① `af24c82`（生产已核；已审历史 `0032fc6` 保留追溯）、② R9 `ab742f5`、③ 实施者与 A 亲跑同数（含全量 953、E2E 24）。本方“T-A22c 复核前不放行 ④”条件已解除；**④ 仍缺 → 待消费方集成（未交付）**。
- **H-1 / H-2·标签 / H-3·路由切片 / H-4**：历史生产方 ①②③ 保留（② 当时 R7 / R8.1，当前有效 R9），④ 缺 → 待消费方集成（未交付）。**H-6** 仍缺 T-A21；**H-5 / 页面切片**未做。`/jobs` 两页仍为骨架，jobsStore 未被页面消费，写 API 大部分未挂 UI，**不能称作业页面已完成**。
- 只读观察消费分支 `integration/frontend-workbench-v2` 仍 `3f63273`，不含上述 ①；本 session **不写、不重建、不 merge** 该树，④ 只由其所有者真正集成后登记，不凭推测填写。
- 正式 `implementation_base_sha` 仍 `43b6d79`；本批继续 pin `upstream_start_sha = 90187f7`。main `072bb12`（PR #11，v2 S0）**不在祖先、不自动同步**；同步前按 tasks §7 重核 → Analyze → A 定向复核 → 指定范围修订 `routes.spec`，并与 v2 所有者协调 T-V2-09#4（R2-D）。不代改壳测试、不写 v2 / main。

### 13.7 P3 与下一步

- **R3-A 已关闭**（`69faacc`）。**R3-B**（重复 `removeUpload` 冗余修订 / 事件 → T-C03 / T-A17）、**R3-C**（storage `removeItem` 抛错时 reset 以原始错误拒绝 → T-G04）**仍未修、未经 Walter 风险接受**。
- 前两批未关：R-A（冲突态当前视图，T-A16 / T-A19 前定案）、R-B 残留、R-C / R2-A（T-G06）、R-D ①③④、R-E、R-F、**R2-B**（仅 DataClient 初始化顺序已固定，AgentClient 侧 T-A18）、**R2-C**（徽标统一 ok 边框令牌，首个消费页面或 T-G10 前核对）、**R2-D**（新 main 路由断言迁移）；R2-E 仅文档精度。细节见 `implementation-log.md` §8。上述 P3 均未被接受为已关闭。
- **下一入口建议**：T-B01（→ T-B02 / T-B04）或 API 依赖已就绪的 T-A14 / T-A15 / T-A16、T-C01。**若先做 T-B01，派工前先按台账确认 R2-C 的处理归属**（在 T-B01 首次消费徽标时用既有令牌核对，或明确留到 T-G10），不新增色值。批次划分由集成人决定；Implement 仍用独立新会话（首选 openai/gpt-6-astra），之后批次 Converge + 新会话异模型 A Review。

### 13.8 进程与保存

- 全部模型调用同步返回；E2E webServer 由测试自管，结束后无 LISTEN；无本 session 待续跑服务或子会话。
- 临时目录 `C:/Users/iswal/AppData/Local/Temp/wi-batch3-01a18388-0yit2j1a/` 保留派工提示、实施者 / A 会话、探针、日志与本节草稿，可辅助恢复；**关键结论均已入库**（tasks 页首、`implementation-log.md` §8 / §12 / §13、两份 Converge、两份 Review、interface-handoff、analyze），恢复不依赖临时目录。原始 session / 凭证不入库，不清理共享 `/tmp`。
- 未 push、未开 PR、未 merge main；正式全 feature Review / Gate 2 / Handoff 仍在后续。

### 13.9 下次开场（取代 §12.9）

> 第三批四项与 R3-A 补修已通过独立 A 代码 Review，当前 21/68 完成、47 未开始，代码固定 `af24c82`；按既有授权从 T-B01（先确认 R2-C 归属）或 T-A14～A16 / T-C01 继续。H-2·列表等切片仍待消费方集成，R3-B / R3-C 未修，整体未收敛。
