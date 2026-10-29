# desktop-shell 评审与验收记录

> 当前检查点：**T-06b 已验证42unit/16场景236/236，T-06c/d因测试兼容与菜单驱动方案缺口暂停**。真实file-origin设置GET/PUT/DELETE通过，未触发CORS、不改backend/安全；实施保存d77ce69。准备窄范围Plan/Tasks/Analyze修补与A复查，确认前不进入c/d/T-07，不假点击或隐匿API；RL-01 P3 OPEN、Checklist41/41原批准、完整Gate2边界不变。
> Gate 1：Walter 已在会话中批准 desktop-shell v1；spec 页首已补记批准元数据，冻结需求正文未改。
> **Gate 2 尚未批准**。本次不自动合并或发布，不把受测机冒烟等同于干净机器验收。

## 前轮开发编排（保留历史）

当前规则沿用 `AGENTS.md` §2 / §5 / §6（旧 §2.1 已归并至 §6）；仅协调派工与集成，不引入新的 agent 框架。

| 角色 / 任务 | 基线 | 模型 / 通道 | 探活与回退原因 | 结果 |
|---|---|---|---|---|
| 协调（分派、集成、验证、Gate 汇报） | `1cfa6ae` | 当前协调会话 | 不代替计划/实施/审核角色 | 独立集成工作树 `D:/2030/Futures-AI-desktop-finish` |
| 规划 / Analyze | `cdbcc89` | `anthropic/claude-opus-5-5` | `claude-bridge/claude-opus-5-5` 最小真实调用遇 seven_day 用量限制，随后同模型 anthropic 探活成功 | 前轮已停止于 Plan/Analyze；本轮另开会话，见下表 |
| 实施候选 | `cdbcc89` | `openai/gpt-6-astra` | 最小真实调用成功，无需 deepseek-flash 回退 | 待 Checklist |
| 审核员 A 候选 | `cdbcc89` | `anthropic/claude-fable-5-1` | bridge 同模型遇 seven_day 用量限制，随后 anthropic 探活成功 | 待独立 Checklist / Review |

历史 T-01～T-06 曾在没有 desktop-shell checklist 的情况下实施；本轮如实补做独立需求质量审核，不伪造历史通过记录。
每个可写实施任务须使用独立 worktree / 分支及文件所有权；不碰 `frontend-workbench`、`workbench-interaction` 的工作目录和提交。

## 2026-10-28 恢复 Plan / Analyze

Walter 指示：继续 Plan/Analyze；T-07～T-10 进入 Implement 时切换 `openai/gpt-6-astra`。本轮先补齐规划与独立需求质量审核，不提前修改实现或宣称完成。

| 角色 / 任务 | 固定基线 | 实际 provider/model | 通道 / 失败类别 | 状态 |
|---|---|---|---|---|
| 协调 / 串行集成 | `8ba1b6a` | `openai/gpt-6.1-sol`（PI 环境确认） | 保留协调身份，不代替 Plan、Implement 或审核员 | 当前工作树 `feat/desktop-shell-finish`；只做派工、证据记录与集成 |
| Plan | `8ba1b6a` | `anthropic/claude-opus-5-5` | bridge 已知 seven_day 限额仍在当前窗口，按 §6.5 不重复请求；本轮官方最小真实调用成功 | 独立会话、独立工作树 `D:/2030/Futures-AI-desktop-plan` / `plan/desktop-shell-resume`；已完成修订 2 / 3 与后续 Analyze 修补：spec 只补 Gate 1 元数据；Plan、缺口报告、M-01～M-26 人工步骤、Tasks、Analyze 与审阅包已串行集成；未改代码、未跑测试、未提交或勾选 checklist |
| Checklist A | `8ba1b6a` + 固定规划工作副本（尚未提交） | `anthropic/claude-fable-5-1` | bridge 同窗口已知限额不重复请求；本轮官方最小真实调用成功 | Plan 产物已固定并复制至独立工作树 `D:/2030/Futures-AI-desktop-checklist` / `review/desktop-shell-checklist`；初审完成 30/41，2 项 P2 需 Plan 修补，6 项待 Tasks/Analyze，其余为 P3 小修；仅生成 checklist，无源码/规划写入 |
| Plan 修补 / Tasks / Analyze | `8ba1b6a` + Plan 修订 2 与 A 初审（工作副本） | `anthropic/claude-opus-5-5` | 同一限额窗口沿用官方通道；不是因审核未通过而回退模型 | 规划独立会话及同会话续作已结束；完成 41 个待实施任务、Analyze 迭代 1～6（保留 1/3/5 未通过历史，最终文档一致性通过）；源码与 checklist 未改，等待独立 A 复查 |
| Checklist A 最终复查 | `8ba1b6a` + 冻结 Plan / Tasks / Analyze 迭代 6 工作副本 | `anthropic/claude-fable-5-1` | 当前窗口沿用已探活的官方通道，不因发现问题更换审核模型 | 新开独立会话 `01a18273-3057-7120-b308-b1239b516633`（会话元数据确认）；**41/41 通过**，无 P1/P2，4 项 P3；仅改 checklist，输入 SHA-256 在审核前后核对一致；源码未改 |
| T-07～T-10 与纠偏 Implement | 文档前置条件已满足（尚未启动） | 指定 `openai/gpt-6-astra` | 本轮不提前切入；开始实施时使用独立工作树及该模型 | 必须按 tasks 依赖执行，先重读全部 41 个质量复选框；不沿用旧任务的假通过记录 |

本轮不使用旧会话记忆替代文件重读，不更改全局 pi/provider 配置。前轮测试结果仅作基线引用，不冒充本轮复验。

跨 feature 引用说明：settings 文档所说的 GUI「T-08」是 settings 自身待办编号，不是 desktop-shell 的 T-08（故障与诊断）。其界面子句在本 feature 由 T-06 及后续纠偏任务承载；不因此把 settings 的 GUI 标为已完成。

A 初审结论：spec 10 需求 / 38 AC 无需变更；F-01（P2）计划的 `shell/lib/` 被现有 `.gitignore` 的 `lib/` 锚点忽略，须改规划落点而非删除锚点；F-02（P2）CSP 先拦截时不会触发 `webRequest`，现有计数断言会产生假阴性，须分开证明两道策略。先修 Plan，再进入 Tasks / 最终 Analyze；30/41 不是 Implement 放行，也不是代码 Review / Gate 2 结论。

## 上一轮规划产物与范围（历史时点尚未实施）

- `plan.md` 修订 3（含迭代修补）、`tasks.md`、`analyze.md`、`manual-acceptance.md`、`plan-gaps.md`、`checklist-review-request.md` 已集成；Checklist 仅由 A 生成与复查。
- **38 条冻结 AC + 13 条 what 覆盖项 → 41 个实施任务（各 0.5～2h，估计 60.5h）**，另 4 个人工验收批次。包括先前 T-01～T-06 的纠偏，而非仅续做 T-07～T-10；所有代码工作均待 `openai/gpt-6-astra`。
- 已纳入规划：真实健康判定、重启参数与孤儿清理、遮蔽邮箱覆盖、EIA 预填未复用核心、单实例/就绪测试假阳性、任务验收前向依赖、打包 staging 自举循环。该规划阶段结束时**源码缺陷尚未修复**；本次实施 WIP 进展见下文与根 `HANDOFF.md`。
- Analyze 迭代 1/3/5 的未通过结论与修补证据保留；迭代 6 结论为**文档一致性通过**，不是代码收敛或测试通过。当前独立 Checklist 审批状态见 `checklist.md`，未全部勾选不得 Implement。
- 本轮只执行静态文档比对、AC/任务/依赖核对、路径忽略检查与 `git diff --check`；未执行 pytest/npm 测试、构建或安装，未提交、推送、PR 或 merge。下节 389 passed 是前轮基线，不是本轮复验。
- 工具纪律偏差：规划角色报告部分精确替换失败后使用 shell 片段修改规划文档；这是编辑工具约定的偏差，不是推荐流程。集成人核对了最终差异、冻结 spec 与空白检查，未涉及源码；后续不得沿用该做法。

## Checklist 最终复查结论与后续跟踪

A 在新会话中独立复核固定源码与真实规划差异，结论：**Checklist 全部 41/41 通过，Plan/Tasks/Analyze 文档前置条件满足**。初审 F-01～F-10 已关闭；验收循环、打包自举、AC 引用与 AC-005-3 预填逐子句追溯均经核对。该结论不是实现完成、代码 Review、Converge 或 Gate 2，不替 Walter 授予工程批准。

| A 的 P3 | 后续处理 |
|---|---|
| N-01：507 的界面渲染无自动化 | 随 T-08f / M-18 / Review 跟踪；Handoff 明记是否执行 M-18，未执行时不得把该路径写成已通过 |
| N-02：组织类型 11 / 12 的计数口径 | 后端 `SECTORS` 为 11 项，页面加 1 个占位 `<option>` 后为 12；Implementation / Review 按实际断言对象核对 |
| N-03：人工验收证据的隐私提示 | 验收记录、截图、证据路径与备注不得包含真实 key、完整邮箱、用户文档内容；真实私有证据只留用户本地且不入库，必要时以脱敏摘要引用 |
| N-04：首次构建下载的墙钟风险 | T-10c 首次 electron-builder / NSIS 下载可能超估时，实录耗时与依赖问题；不得跳过打包产物扫描 |

上一轮 Plan/Analyze 阶段结尾记录：按 `tasks.md` 的串行顺序，下一步由 `openai/gpt-6-astra` 在独立实施工作树处理纠偏与 T-07～T-10；该轮到文档审核就绪为止，未启动 Implement、未提交或合并。本次 Walter 已要求继续，执行状态见下节。

## 2026-10-28 继续 Implement（第一批，现已按用户指令暂停）

| 角色 / 范围 | 固定源码基线与输入 | 实际模型 / 通道 | 状态 |
|---|---|---|---|
| Implement 第一批：T-01b/c/d、T-02b/c、T-03b/c、T-04b | `8ba1b6a` + 已批准的 Plan/Tasks/Analyze 与 A 的 41/41 Checklist 工作副本（尚未提交） | `openai/gpt-6-astra` via openai；本轮最小真实调用成功，无回退 | 独立工作树 `D:/2030/Futures-AI-desktop-implement` / `feat/desktop-shell-astra`；新会话 `01a18285-2349-7290-b570-c8f9b2e18658` 的 `model_change` 元数据已确认实际 provider=`openai`、model=`gpt-6-astra`；已保存后端 WIP；基线 389 passed / 5 skipped，局部结果见暂停证据；在 T-04b 编辑保存后停止会话，未构建，未宣布首批完成 |
| 协调 / 集成 | 同上 | `openai/gpt-6.1-sol`（PI 环境确认） | 只持有进度文档与串行集成，不代写代码或运行产品测试 |

实施者必须重读全部 41 个 Checklist 复选框，不改 `checklist.md`；本次派工也已计数 **41 已勾选 / 0 未勾选**。实际基线/回归/打包冒烟结果记录到 `implementation-evidence.md`（产生后）再由协调者汇总；未取得结果前不把任务标为完成。T-05 起的外壳任务与 T-07～T-10 尚未开始。Gate 2、真实私有数据、全局 pi/provider 配置与其他 feature 工作树均不在此次授权范围。

## 2026-10-28 暂停交接记录

- 用户要求立即安全暂停，不再启动新构建/下载/长任务。最后保存的是 `backend/tests/test_app_health.py`（12:58:28 UTC），此前为 `backend/tools/shell_check.py`；T-04b 未验证。
- 实施前基线实际复跑：389 passed, 5 skipped（125.85s）；健康 9 passed；启动分类及相关回归 35 passed；端口 15 passed；生命周期 5 passed；通道修正后联合 9 passed；设置/磁盘满 17 passed；注册指引所在设置 API 17 passed。结果对应各自阶段，**不能证明最后代码全量通过**。通道中间失败记录也已保留。
- 本轮没有启动后端构建/打包冒烟、npm/Electron 构建或下载；没有完整结束后的全量回归。T-01b/c/d、T-02b/c、T-03b/c 为已写入的阶段 WIP；T-04b 是恢复点。
- 已停止本任务 Node PID 28644 及子 PID 42096，启动包装 PID 63020 也已退出；CIM 复核未发现本任务 agent / 后端服务。worker 的 exit=1 是手动中断，不是模型失效，不据此回退模型。
- 原始临时会话不入库；必要请求、路由成功输出、批准输入指纹、A 最终报告与测试摘要已拷入 `specs/desktop-shell/handoff-artifacts/20261028/`。详情、后续命令、工作树与本地 WIP 提交见根 `HANDOFF.md`。
- 交接是用户要求的暂停 WIP 保存，**不是** AGENTS §2 的功能 Handoff，不替代 Converge / Review / Gate 2；不 push、不 PR、不 merge。没有新增需求待拍板，只等待用户明确恢复。

## 2026-10-28 17:25 UTC 恢复 Implement（本轮已结束，T-04b blocked）

Walter 明确指示“按照 HANDOFF.md 继续”，本次不把暂停时的 exit=1 当模型失效。协调会话实际 `openai/gpt-6.1-sol`（PI 环境确认），只派工、记录、集成，不代写源码或运行产品测试。

| 角色 / 范围 | 固定输入 | 实际模型 / 通道 | 状态 |
|---|---|---|---|
| Implement：第一批 T-01b～T-04b 的最终验证 | 实施树 `782aa20`，主快照 `007a4c0`；原始源码基线仍为 `8ba1b6a`；冻结 spec / Plan 修订 3 / Analyze 迭代 6 / A Checklist 41/41 | 原 `openai/gpt-6-astra` via openai，会话 `01a18285-2349-7290-b570-c8f9b2e18658`，PI 环境实核，未回退 | 17:47 UTC 正常结束（agent exit 0，不代表产品通过）；前七项本批后端范围复验通过；T-04b 真实包扫描 blocked，未新增完成提交；未开始 shell。证据已收回主树，详见下表 |

主/实施工作树恢复前均干净，9 个实施文件与暂停快照一致；协调者和 Astra 分别计数 Checklist **41 已勾选、0 未勾选**。冻结需求、Plan/Analyze/Checklist 未改；协调者只更新实际进度元数据，并在实施停止后原样收回测试修复和证据，逐字节核对一致。

| 本轮实际验证 | 结果 |
|---|---|
| 暂停代码六文件首次复跑 | 80 passed / 54.45s |
| 首次全量 | 1 failed / 450 passed / 5 skipped：测试固定 key 哨兵触发凭证字面量扫描 |
| 首次哨兵修复后的联合检查 | 1 failed / 84 passed：前置字符串仍触发扫描；未隐藏失败 |
| 最终随机哨兵修复后六文件 + 扫描 | 85 passed / 65.89s，扫描器与隐私断言未放宽 |
| 最终全量（构建前） | **451 passed / 5 skipped / 207.40s**；5 项为未启用的在线冒烟，不是上游验证 |
| 真实 PyInstaller 构建 | **退出码 0 / 192.53s**，有兼容性警告，不称零警告 |
| 真实 `shell_check.py` | **退出码 1 / 11/12**，唯一失败为 `_internal/pyarrow/tests`；健康就绪、回环监听、三源、鉴权、退出、锁/端点/端口清理均通过 |

**阻塞与停止规则**：真实产物中的 `pyarrow/tests` 含 `.pyx` 和 feather/orc/parquet 测试资产，命中 Plan §7.4 的 `tests/` 黑名单。Astra 没有豁免第三方条目、手改生成物或越权修改只读的 `build_backend.py`。协调者只读核对安装环境 hook：hiddenimports 已过滤 tests，但 `collect_data_files('pyarrow')` 未排除测试数据；模块排除并不能证明数据文件不会被收集。该静态核对不是新的 Plan / 实施修补。

**交接**：`implementation-evidence.md` 含命令、全部失败历史、AC 后端子句与剩余边界；可移交请求/最终报告/agent exit 码在 `handoff-artifacts/20261028-resume/`，完整会话/测试数据库/构建日志仍留仓库外。恢复 agent PID 5364/30952 与打包后端 PID 47224 已不存在；没有需保留的服务或端口。实施树 HEAD 仍 `782aa20`，测试修复和新增证据为 WIP；主树已备份。不把 agent exit 0 写成冒烟成功，也不把 blocked 当作模型失效。

**下一步**：先明确构建收集源头修补的文件所有权，保持黑名单不变；按 Plan/Tasks 修补、Analyze、A 复查后由 Astra 重新生成并验证产物。T-04b 真正通过后才从 T-05b 串行推进；当前无首批全部完成、Converge、代码 Review 或 Gate 2 结论。本次仍不 push / PR / merge。

## 2026-10-28 17:56 UTC 用户确认构建源头修补（规划与独立质量复查完成）

Walter 已明确答复“是的”，批准保持黑名单不变、从构建收集源头排除第三方测试资产；仍按 Plan/Tasks → Analyze → 独立 A 质量复查 → Astra 实施的次序，不修改 frozen spec、不重复 Gate 1（除非实际发现需求变更），不把构建产物手工删除当作修复。

| 角色 / 范围 | 固定输入 | 实际 provider/model / 通道 | 状态 |
|---|---|---|---|
| Plan/Tasks 修补、Analyze 新迭代 | 主检查点 `1275ae2`，原始源码基线 `8ba1b6a` | `anthropic/claude-opus-5-5`；bridge 本 seven_day 窗口已知耗尽，不重复探活；本轮官方最小真实调用返回 `PLAN_ROUTE_OK` | 独立规划树 `D:/2030/Futures-AI-desktop-build-plan` / `plan/desktop-shell-build-assets`，会话 `01a183a9-aa0d-71f9-b5a9-add01c9d3107` 元数据确认实际模型；完成四文件修补（Plan 修订 4 / Analyze 7 文档一致性通过），集成提交 **981d430**；未运行产品测试、构建或改源码 |
| A 质量局部复查（Plan 修订 4） | 固定 HEAD **981d4301f069f71dd120a1a86124dbe03aa54e0c**，真实差异 `1275ae2..981d430` 仅四文件 | `anthropic/claude-fable-5-1`；同窗口不重试已耗尽 bridge，本轮官方最小真实调用返回 `REVIEW_ROUTE_OK` | 新独立树 `D:/2030/Futures-AI-desktop-build-checklist` / `review/desktop-shell-build-assets`，新会话 **01a183ba-241b-76cf-8588-b472ac61c90c** 元数据确认；**41/41 通过，无 P1/P2，3 项 P3**；仅改 Checklist，11 份输入文件 SHA-256 前后全部一致；未运行测试/构建/hook，未导入 pyarrow |
| 协调 / 串行集成 | `1275ae2` | `openai/gpt-6.1-sol`（PI 环境实核） | 只记录授权、派工和集成；仓库外运行目录 `C:/Users/iswal/AppData/Local/Temp/desktop-shell-buildfix-s9IO23nK/`；不代写 Plan/实现/审核结论 |

本轮没有复用旧 41/41 假放行；新的 A 复查已明确覆盖修订 4，允许进入 T-04b 修补 Implement。协调者在无实施 writer 的边界把上轮测试修复和证据（与主快照逐字节一致）保存为实施树 **`9ae2ad9`**，不是首批完成提交；后续会先同步已批准文档并给出新的固定实施输入。新开同一 `openai/gpt-6-astra` 模型的聚焦会话，在原实施树/分支串行写入；不是模型回退，无并行 writer。

A 新增 P3 跟踪：**R4-01** 确认旧 `PYZ-00.toc` 中已有 `pyarrow.conftest` / `pyarrow.tests` / `pyarrow.tests.util`，本次只修测试数据，不剔除这些纯模块，后续 Review / Gate 2 须如实记录；**R4-02** 构建日志 `%r` 路径反斜杠成对，按原 rg 命令判读；**R4-03** `test_scan.py` 会扫描保留的 build/dist 文本，A 静态核对未命中，实际全量测试仍不可省。不得把文件系统扫描通过夸大成包内没有任何测试代码。

工具纪律偏差：本轮 Plan 与 A 的静态读取仍出现 `cat` / `sed` / `head` 等读取快捷方式，未发生 shell 源码写入；Plan 的临时占位文本误编辑已由作者用 edit 修复并验证无残留。协调者未将其当作推荐流程；为本次 Implement 增加进程级 read/edit 工具纪律提示（不改全局配置），继续禁止 shell/Python/PowerShell 文本拼改与手改生成物。不 push / PR / merge，Gate 2 未批准。

## 2026-10-28 18:32～18:44 UTC T-04b 修订 4 Implement（本批已验证完成）

- A 结论已在主树 `ccbc291` 保存。协调者在无 writer 的边界串行同步 8 份文档并逐字节核对源码，形成干净固定实施输入 **`3a9ec35512ad593cc931f98dc5c3a347342f4e45`**（前序 `9ae2ad9`），AN7-04 的同步与 `<输入基线>` 动作已完成。
- 实际模型 **`openai/gpt-6-astra` via openai**，新聚焦 session **`01a183c8-f4a5-778d-acfc-d458ead81908`** 元数据确认；同一实施树/分支，无并行 writer，不是回退。实施者只写四个授权路径、未自行提交；结束后协调者本地保存为源码修复提交 **`c1e33e096621311ece7ec8f3d61ddadd4bffcb19`**，并逐字节集成回主树。
- 真实源码差异：build_backend.py 仅加 hook 目录常量、参数和 docstring 共 3 行；新 hook 三条公开 API 赋值仅过滤 datas；新 pytest 文件 3 个用例；实施证据只追加，保留原失败历史。spec、scanner/黑名单、health 测试、运行时代码、包版本、全局配置、shell/packaging 均未改。

| 新验证 | 真实结果 |
|---|---|
| 聚焦（真实仓库/contrib hook + 接线） | **3 passed / 0 skipped / 1.79s** |
| 全量后端 | **454 passed / 5 skipped / 181.46s**，仅原 5 项在线冒烟未启用，不是上游通过 |
| health 文件与逐名 netstat/readiness | **34 passed / 9.77s**；再逐名 **6 passed / 7.07s**，为补全逐名证据，不是失败重跑 |
| 真实 `build_backend.py --clean` | **退出 0 / 95.78s**，构建日志确认使用仓库 hook |
| 未修改真实 `shell_check.py` | **12/12 / 退出 0 / 6.221s**；就绪、回环、三源、鉴权、退出与锁/端点/端口/临时目录清理通过 |
| 前后文件路径清单 | **3411 → 3394；REMOVED 17 / ADDED 0 / OTHER_REMOVED 0**；17 项全在 `_internal/pyarrow/tests/`，未宣称重建二进制逐字节相同 |
| 冻结、所有权、清理 | 只改授权四路径，静态检查通过；backend PID 30988 已退出、owned 后端 0；本轮 Plan/A/Implement agent 均已结束，无服务/端口需保留 |

本轮产品测试/构建/冒烟首次通过；原 11/12 与旧测试失败仍在 `implementation-evidence.md`，本轮证据末尾 EOF 空行检查的小失败与 edit 修正也有记录。仍有 Pydantic V1 / Python 3.14 兼容性及 `scipy.special._cdflib` hidden-import 警告，不称零警告，不改依赖或顺手扩范围。

证据位置：`implementation-evidence.md` **§6**；三角色最终报告、批准输入、审阅指纹和真实路径差集在 `handoff-artifacts/20261028-build-assets/`。完整会话、构建日志和 manifests 留仓库外；未将用户数据/凭证/测试数据库/构建产物入库。

**本批结论仅为 T-04b 后端范围完成、文件系统测试数据扫描阻塞解除**。R4-01 已知 PYZ `pyarrow.conftest` / `pyarrow.tests` / `pyarrow.tests.util` 仍保留，未来 Review/Gate 2 继续跟踪；不夸大成包内无任何测试代码。下一项 **T-05b**，其余 33 项 shell/后续任务及人工/外部验收未完成。未作整体 Converge、独立代码 Review 或 Gate 2，不 push / PR / merge。

## 2026-10-28 19:56～20:19 UTC 外壳基础批次 Implement（本批已验证完成）

| 角色 / 范围 | 固定输入 | 实际模型 / 会话 | 状态 |
|---|---|---|---|
| Implement：T-05b/c/d/m/e/f，按 tasks 顺序 | 实施树 **83b91db** / `feat/desktop-shell-astra`，主树 **68f1d46**；相关源码与交接/feature 文档一致，启动前均干净 | **openai/gpt-6-astra via openai**；新聚焦 session **01a18415-9390-7773-9dad-5f1ad7456cd2** 元数据已确认 | 原独立实施树唯一 writer，已完成本批；只改授权 shell 4 个既有文件 + 21 个新源/测试文件和证据追加；最终 34 unit / 37 e2e 断言通过，backend/renderer/preload/规划审核零改动；结束后协调者以 **a643f81** 本地保存源码与证据，并逐字节集成 |
| 协调 / 后续串行集成 | 同上 | `openai/gpt-6.1-sol`（PI 环境实核） | 只记录进度、派工和集成，不代写实现或跑产品测试；本批不进入 Plan / Converge / Review |

质量前置条件：Checklist **41 checked / 0 unchecked**；未变的 shell 任务沿用第 2 轮批准，第 3 轮只局部复查 T-04b，未改本批任务或撤销原批准。要求实施者重读完整 Checklist；本次不改 spec/Plan/Checklist，无需求变更或新 ADR。

执行/证据边界：每个真实 Electron 场景使用新的仓库外隔离目录并核对实际 SMOKE paths，旧真实用户目录 smoke 禁用；只替换系统边界，清理仅自己 PID/临时目录。完成后必须在最后源码上重跑全 unit、harness-selftest 与 single-instance 两场景，缺工具或零断言直接 FAIL，不 skip；真实前台聚焦仍留 M-09。六项结束先交协调者核对，不在同调用开始 T-05g 及后续任务。

仓库外 run：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-foundation-uvOXqTBv/`；完整测试/失败日志 `C:/Users/iswal/AppData/Local/Temp/fai-foundation-01a18415/`。本批最终结果如下，不把历史 backend 454/5 或 12/12 写成新复跑。

| 本批最终验证 | 实际结果 |
|---|---|
| npm 生成 lock / 真实 npm ci | 退出 0；70 packages，约 4s；Electron 精确 33.4.11，无新依赖，lock 未手改 |
| 全 unit（最后源码上） | **34 passed / 0 failed / 0 cancelled / 0 skipped，3325.59ms** |
| 默认 npm run check（两登记场景联合） | **37/37 断言 / 2 场景 / 0 failures / 退出 0**；harness-selftest 18 + single-instance 19 |
| 真 Electron runtime | **33.4.11 / 内嵌 Node 20.18.3 / Chrome 130.0.6723.191** |
| 单实例核心子句 | 第二实例 10s 内退出 0；secondInstance 恰 1，restore/show/focus 为生产调用；backend spawn 恰 1，首后端 PID/port 不变 |
| 冻结、复制与清理 | 26 文件 SHA-256 全部核对一致；backend/其他只读文件零差异；owned 进程 0，最终两场景 temp 已删；无后台服务保留 |

失败历史保留于 `implementation-evidence.md` §7.4：一次 ACL 检查时机不当；两次 Notification 导出不可重定义导致启动异常，改为出口记录器；三次 `windowsHide:true` 导致真实 GUI 隐藏，修正为 false。没有弱化必要断言、改 renderer/安全配置、清理后伪称成功或切模型。单实例单独 20/20 后仅删除一条读取旧快照的冗余断言，最后完整复跑 unit 和两场景，最终 37/37；static no-index / EOF 检查小失败和 edit 修正同样记录。npm 既有 boolean@3.2.0 deprecated 提示未被伪称零警告。

本批实施最终报告、明确派工范围、unit/e2e/npm 最终原始简短输出与源码指纹保存于 `handoff-artifacts/20261028-foundation/`（本批没有新 Plan 或 A 评审）；源码实际实现者为 Astra，协调者只复制/核对/保存。**本批六项完成；T-05g 及后续 27 项未开始**，基础设施/协议夹具不等于真实作业或设置业务。M-09 真实前台焦点未执行；未做整体 Converge、独立代码 Review 或 Gate 2，不 push / PR / merge。

## 2026-10-29 04:10～04:46 UTC 生命周期与启动批次（实现检查点；T-05k 稳定性待复核）

| 角色 / 范围 | 固定输入 | 实际模型 / session | 状态 |
|---|---|---|---|
| Implement：T-05g/h/i/j/k/l | 实施树 **e0fe1cd** / `feat/desktop-shell-astra`，主树 **6d4ce80**，相关内容一致、启动前均干净 | **openai/gpt-6-astra via openai**，新 session **01a185d9-e062-733e-b5af-f1175102c292** 元数据实核 | 原独立实施树唯一 writer；六项已实现、最后 42 unit / 213 e2e 断言通过；一项 root-locked 间歇超时未解释，不开始 T-06b/T-07；结束后协调者按26文件指纹核对并以 **f7d347b** 保存源码/证据 |
| 协调 / 后续串行集成 | 同上 | `openai/gpt-6.1-sol`（PI 环境实核） | 仅派工、元数据与集成，不代写实现或跑产品测试，不进入新 Plan/Converge/Review |

前置条件：完整 Checklist **41 checked / 0 unchecked**；不改需求/Plan/Checklist，未变任务的原批准有效。权限只含指定 shell 生命周期/启动文件、12 个新场景及必要的旧场景/运行器兼容和证据追加；backend、依赖、其他业务界面与全局配置只读，不重开 T-04b/PYZ 修补。

验证要求：真实源后端证明 shutdown、写锁/只读端点/端口释放、崩溃重启、app-only 强杀后 stdin EOF 5s 自愈；假后端验证三条件健康、预算 3、超时/磁盘满错误等。所有 root/ACL/helper PID 只用自有隔离夹具；不手删锁、不复合布尔伪断言、不 skip 缺工具、不加 CORS 或放宽 Chromium 安全。最后源码必须全 unit + 全登记 e2e（包括原两场景）通过才结算本批。

仓库外 run：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-lifecycle-GULOgc3i/`；全部测试日志 `C:/Users/iswal/AppData/Local/Temp/fai-lifecycle-01a185d9/`。

| 验证 | 本轮真实结果 |
|---|---|
| 新基线 | npm ci 成功；34 unit、2场景37/37，未只引用历史 |
| 最后完整 unit | **42 passed / 0 failed / 0 skipped，4988.49ms** |
| 最后默认 npm run check | **14场景、213/213断言、0 failures、exit0，67.092s** |
| 真实源码宿主 | 正常退出清理锁/只读端点/端口；崩溃重启新端口/令牌与restarts1；仅杀app后≤5s后端exit0自行清理并同目录再就绪 |
| 启动/错误/资源 | 初始页就绪前可见、真实retry与日志出口、锁占用/真实ACL错误、显式mock不spawn、缺失资源错误/补齐后重载，故障协议不冒充真实满盘 |
| 冻结/复制/清理 | backend/包版本/规划审核等只读路径零差异；26个源/证据文件SHA逐字节一致后集成，实施提交 **f7d347b**；owned进程0，ACL恢复且实写验证、所有场景temp清理，agent已退出 |

实现范围仅8个既有shell文件、17个新文件与证据追加。Windows app-only kill 原两次出现exit0但锁/端点残留，使用 spawn `detached:win32` 隔离控制台（不unref，仍由同状态机/pipeEOF/owned taskkill托管）后真实资源清理通过；无Job Object/后端改动/新依赖。真实锁文件整读EBUSY的试验性断言已改用Service.init成功信号、锁存在、helper存活，必需断言均保留。app-config合法JSON null的入口形状问题已修，新增一条测试并完整重跑。

**未关闭风险（未评级、非用户接受）**：首轮全集212/212后，补config-null的全集出现 **202/203、1failure**，root-locked在10s内尚未从gen1/waiting_health/port=null进入失败态。失败运行已清理；不改超时/断言的单场景16/16与最后全集213/213通过，但**根因未确认，不称已修复**。已在 `implementation-evidence.md` §8.3 记录全部失败/重跑，并把失败原始输出与绿灯共同保存在 `handoff-artifacts/20261029-lifecycle/`。T-05k 保留稳定性复核待关闭，不因最终绿灯把它结算为风险已解决，不自动评级P3；后续先诊断/复核，再进入T-06b。

本批真实runtime仍为Electron33.4.11 / Node20.18.3 / Chrome130；旧Python454/5和打包12/12未复跑。旧onboarding.js消费者刻意未迁移，不称设置业务可用；真实前端/作业、基准机15s、全部人工M-ID、打包资源和诊断等未取得。未做整体Converge/独立代码Review/Gate2，不push/PR/merge。

## 2026-10-29 05:27～05:41 UTC T-05k 有界诊断（完成取证，未证明根因）

- 用户再次继续；主树40aff0c / 实施树35e5f78，启动前均干净、相关内容一致。实际Implement **openai/gpt-6-astra via openai**，新session **01a18620-5f99-7422-91f6-e006cb8c47a3** 元数据确认；原树唯一writer，不是模型回退。协调为PI实核openai/gpt-6.1-sol，不代写代码或跑产品测试。
- 仍读完整Checklist41/41；本次仅T-05k诊断/有证据最小修复与证据追加，不改需求/Plan/审核，不开始T-06b。优先场景/临时测试钩子安全时间线，生产代码只在证实真实生命周期bug后最小修改；backend/**、其他业务/依赖/全局配置只读。
- 有界实验集、分离进程/标记/状态/页面阶段，token/argv/payload禁入日志；不能无限重跑或无依据增超时。既有生产30s与观察10s不一致是线索，不是已证明根因。最终如无结论仍OPEN；有修复才按原严格断言、全unit/全14场景复验，不改隔离清理规则。
- run：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-lockprobe-FiY0hypq/`。Astra诊断结束：2次定向（其中一次import profiling）+1次全集未复现，spawn→分类约2.11/2.42s；不能解释原10s失败，未完成受控慢启动/标记负对照，不改预算/断言。最后42unit/14场景213通过但风险OPEN，仅保留scene安全时间线与证据§9，临时hooks恢复，生产零改；协调核对后本地保存实施提交 **681d4bb**。

### 05:47 UTC 独立A窄范围技术风险补充审阅（已完成，非整体Review）

- 触发依据：HANDOFF13允许必要时独立审核判断，本次不拿A代替原实施模型“找通过”。固定输入 **681d4bb09736c2cfec16ccda6f14b854acb8f181**，独立树 `D:/2030/Futures-AI-desktop-lock-risk` / `review/desktop-shell-root-lock-risk`；实际生命周期Git diff e0fe1cd..f7d347b与新观测diff35e5f78..681d4bb、原FAIL和新轨迹均提供，不读摘要代替真实代码。
- A首选 **anthropic/claude-fable-5-1**，同窗口已知bridge限额不重复请求，本轮官方最小真实调用 `RISK_REVIEW_ROUTE_OK`；新session **01a18632-84de-7247-b0ff-2a0d46152f95** 元数据确认，与Astra/协调隔离。不是因测试失败而模型回退。
- 只允许新写 `root-lock-risk-review.md`；其余源码/Checklist/Plan/进度只读，工具仅read/edit/write，不执行测试。评价该风险是生产缺陷/测试缺陷/预算假设/证据不足，给严重度与是否必须阻塞的独立依据；不指定“通过”、不替用户接受风险，不代表全feature Review/Gate2。18份输入指纹已冻结待前后核对。
- A最终报告 **`root-lock-risk-review.md` v2**；18份保护输入SHA在初评/勘误后均全部一致，审核期HEAD681d4bb未动，A只写该新报告。协调者指出整锁读取、快照证明力、Unicode路径三处过推后，原A同模型同会话自行勘误并保留§0.1；协调者未代改技术结论、未换模型“找通过”。
- **独立结论：无本窄范围P1/P2；RL-01=P3残余、UNKNOWN/OPEN，非阻塞，可继续T-06b起的Implement。** 原AC并无10s分类时限；10s是测试通用观察窗，生产有Plan30s有界失败路径。允许继续是A的范围内风险判定，不是通过次数、根因修复、用户风险接受、完整feature Review或Gate2。

| 本轮实际验证 | 结果 / 边界 |
|---|---|
| 有界诊断 | 2定向（1profile）+1全集均未复现；spawn→分类约2.11/2.42s，profiling不能倒推历史原因 |
| 最后全unit / 独立锁场景 / 全集 | **42pass/0skip；16/16；14场景213/213（67.203s）** |
| 实际差异 | scene+24/−2安全单调时间线及证据§9追加；临时hooks恢复，生产/超时/断言/清理/依赖均未改；实施源码保存681d4bb |
| 清理与复制 | owned进程0、ACL恢复并实写、temp已删；3文件指纹核对一致后原样集成主树 |

**必留跟踪而非关闭**：RL-01历史FAIL202/203完整保留；不能从旧snapshot推断OS存活或marker未到。若复现证实OS已死但Node长时未收到exit，按A条件升级P2。RL-02须在整体Converge/Review前完成真实迟启动与错误标记/超deadline正负对照，按Plan/Tasks/派工纪律安排，不只是改大等待值；RL-03生产时间戳需先批准；RL-04 UTF-8跨chunk可损中文path/detail，A评P3、建议整体Review前Converge任务修；RL-05沿用现有deadline语义。当前均未实施或被用户接受。

保存位置：A最终报告 + `implementation-evidence.md` §9；`handoff-artifacts/20261029-lockprobe/` 保存分派、Astra最终输出、普通时间线、最终unit/e2e、A勘误摘要及两类输入/源码指纹；大型profile/完整session留Git外。**取消此前人工临时阻塞，下一项T-06b**；本次未启动后续任务。需求/Plan/Checklist未改，整体Converge/独立代码Review/Gate2未完成，不push/PR/merge。归档Astra输出时，原Markdown硬换行的行尾空白触发一次whitespace检查；已用git stripspace从未改动的临时原始输出重新生成仅空白规范版，再检查通过，未手改生成物或生产源码，原报告保留Git外。

## 2026-10-29 07:37～07:52 UTC 设置宿主界面（T-06b通过；T-06c/d暂停）

- 用户继续后主树8a5ea69 / 实施树c33fa9d启动前均干净，相关内容一致。实际Implement **openai/gpt-6-astra via openai**，新session **01a18698-0ad0-7456-8578-dd4892e22bd5** 元数据确认，原实施树/分支唯一writer，无回退；协调仍PI实核gpt-6.1-sol，仅记录/派工/集成。
- Checklist41 checked/0 unchecked，未改需求/Plan/审核；A上轮非阻塞RL-01仍UNKNOWN/OPEN，控制实验等条件留存，本调用不连带实施。
- 范围仅既有onboarding.html/js、main/preload的设置导航、五个新e2e及登记/必要兼容与证据追加；backend、依赖、原生命周期/运行器/其他业务及全局配置只读，不进T-07。要求textContent安全DOM、只提交修改邮箱、真实核心加密档案、显式注册指引不入日志/缓存，e2e不提交真实key或访问EIA。
- 真实settings-sources为带令牌回环XHR正对照，遇CORS/OPTIONS/权限阻止先做安全元数据对比并停止受影响任务；不关webSecurity/CSP/sandbox、不加backend CORS或main/preload代理、不mock API/硬编码列表绕过。需要安全面改动先Plan/Analyze/A复查与必要人工批准。
- run：`C:/Users/iswal/AppData/Local/Temp/desktop-shell-settings-owBsqdLT/`；完整测试日志 `C:/Users/iswal/AppData/Local/Temp/fai-settings-01a18698/`。实现者已停止且未自行提交；协调核对六文件指纹后以 **d77ce69** 本地保存并原样集成。

| 验证 | T-06b真实结果 |
|---|---|
| 本轮新基线 | npm ci成功、42unit、14场景213/213 |
| 首次settings-sources | **8/10、2failure**：空key时清除按钮隐藏；非CORS失败，已修且历史保留 |
| 两个新场景 | **23/23**：12options、EIA回退/清除；密码输入、普通页面无完整合成邮箱、HTML样式字符串未作DOM插入、真实核心读出姓名改而邮箱未覆盖 |
| 最后完整unit / 全登记e2e | **42passed/0skip；16场景236/236/0failure（72.960s）** |
| 安全与清理 | file://真实端口令牌GET/PUT/DELETE成功，无backend/CORS/proxy/security更改；owned0、temp已删、冻结与指纹通过 |

**T-06c/d未实施的实际原因**：startup-visible锁死旧五API成员，不容批准的openSettings；frontend-missing新根未完成引导但期待先前端，与批准的主路由优先级冲突；固定控制集无应用菜单实际click驱动，不能把API调用冒充菜单。旧scene/runner/hooks未被擅改，main/preload本轮也未改，注册指引五字段尚未验证。

后续先做Plan/Tasks兼容范围/菜单驱动及必要窄导航设计修补，Analyze与A确认后再由Astra继续，不涉及新What/AC或CORS放宽。Plan首选anthropic/claude-opus-5-5，同窗口不重试已耗尽bridge，本轮官方真实最小调用 **ROUTING_PLAN_OK**；独立树/固定提交待派工记录。详细证据§10和归档settings-b，非全feature Converge/Review/Gate2，不push/PR/merge。

## 已取得的基线证据（前轮，非本轮复验）

- `cd backend && PYTHONDONTWRITEBYTECODE=1 python -m pytest tests/ -q -p no:cacheprovider --basetemp=<仓库外临时目录>`：**389 passed, 5 skipped，0 warnings**。
- 5 个 skip 是默认未开启的在线冒烟；本轮功能验收不得把 skip 记成已通过真实上游验证。
- 环境：Windows 11、Python 3.14.2、Node 25.2.1、npm 11.7.0；PyInstaller 6.22.3、FastAPI 0.135.2、uvicorn 0.42.0。

## 完成与未完成

- 已有阶段性代码：后端宿主、健康/退出/设置端点、PyInstaller 构建、Electron 启动与引导界面（T-01～T-06）；任务表中的既有勾选不代表本轮已逐项复验。
- 本批后端纠偏 T-01b/c/d、T-02b/c、T-03b/c、T-04b 已有自动化检查点；不代表对应 AC 的 GUI/外部子句全部完成。待补齐：从 T-05b 起的外壳纠偏、托盘/通知与关闭行为、故障/诊断/日志、版本/更新、安装包（T-07～T-10）。
- 前端完整工作台、作业引擎、agent 实际执行等仍由各自 feature 承载；使用 spec §4 允许的 mock 接口时要明确标识，不将其描述成真实业务已完成。
- 干净 Windows 无开发环境安装/卸载与真实系统通知观感须独立记录；受测机自动化检查只能作为 Q-009 允许的过渡证据。

## 最终评审结论

待审核员 A 对固定集成提交及实际 diff 出具结论。无结论前不得宣称可通过 Gate 2。
