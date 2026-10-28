# desktop-shell 评审与验收记录

> 当前阶段：**按 Walter 指令暂停交接，停在 Implement 第一批的 T-04b WIP**（实施模型 `openai/gpt-6-astra`）。首批 7 项源码已写且对应局部测试曾通过，T-04b 最后编辑未验证，最终全量回归/构建未跑；后台已停，恢复前读根 `HANDOFF.md`。Plan / Analyze 与独立 Checklist **41/41 通过**不等同于代码验收；T-07～T-10 未开始。
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

## 已取得的基线证据（前轮，非本轮复验）

- `cd backend && PYTHONDONTWRITEBYTECODE=1 python -m pytest tests/ -q -p no:cacheprovider --basetemp=<仓库外临时目录>`：**389 passed, 5 skipped，0 warnings**。
- 5 个 skip 是默认未开启的在线冒烟；本轮功能验收不得把 skip 记成已通过真实上游验证。
- 环境：Windows 11、Python 3.14.2、Node 25.2.1、npm 11.7.0；PyInstaller 6.22.3、FastAPI 0.135.2、uvicorn 0.42.0。

## 完成与未完成

- 已有阶段性代码：后端宿主、健康/退出/设置端点、PyInstaller 构建、Electron 启动与引导界面（T-01～T-06）；任务表中的既有勾选不代表本轮已逐项复验。
- 待补齐并实测：托盘/通知与关闭行为、故障/诊断/日志、版本/更新、安装包（T-07～T-10）。
- 前端完整工作台、作业引擎、agent 实际执行等仍由各自 feature 承载；使用 spec §4 允许的 mock 接口时要明确标识，不将其描述成真实业务已完成。
- 干净 Windows 无开发环境安装/卸载与真实系统通知观感须独立记录；受测机自动化检查只能作为 Q-009 允许的过渡证据。

## 最终评审结论

待审核员 A 对固定集成提交及实际 diff 出具结论。无结论前不得宣称可通过 Gate 2。
