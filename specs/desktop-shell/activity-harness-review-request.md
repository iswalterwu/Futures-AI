# desktop-shell：Plan 修订 6（T-07a 运行器提前退出约定 + T-07b/c/e 钩子接线所有权）A 复查请求

> 作者 = `anthropic/claude-opus-5-5` via anthropic（Plan/Tasks/Analyze，会话 `01a187bb-94f0-739b-a564-841bc4ccb516`；bridge 同窗口已知耗尽不重复探活，官方探活 `ACTIVITY_PLAN_OK`；未回退）。协调 = `openai/gpt-6.1-sol`。Implement = `openai/gpt-6-astra`。日期 2026-10-29。

## 1. 固定输入

- 规划输入：`c1b40700b3824396d7a071868f904d181f6adcfd`（分支 `plan/desktop-shell-activity-harness`；主树快照，含 `implementation-evidence.md` §12 的 T-07a 预检停止；源码为 T-06c/d 检查点）。
- 待审差异（四个文档，相对 `c1b4070`）：`specs/desktop-shell/plan.md`（修订 6：页首、§0、§3.5 事件来源行、§8.3 两处指引、新增 §8.4）、`specs/desktop-shell/tasks.md`（页首修订 6 说明、顺序表第 24/33 行、合计、T-06c 验证括注、T-07a 块、T-07b/c/e 修改范围、T-08e 依赖与完成标准 2）、`specs/desktop-shell/analyze.md`（追加迭代 9）、本文件（新增）。
- **评审 HEAD 由协调者在集成提交后另行提供**；本文件不自报自身所在提交的哈希。A 只审该固定 HEAD 的真实 `git diff c1b4070..<评审HEAD>`，审核期间不移动 HEAD。

## 2. A 的写入范围

只写 `specs/desktop-shell/checklist.md`（新增“第 5 轮（修订 6）复查记录”，记录实际模型与通道、受影响项结论）。不改源码、spec、plan、tasks、analyze、review、README、HANDOFF、证据文件；不运行测试；不代 Walter 批准任何工程项。

## 3. 请求复查的受影响质量项

| 项 | 关注点 |
|---|---|
| C-02 / C-03 | spec 冻结、38 条 AC 与依赖不变（Analyze 9：`spec.md` 相对 `c1b4070` 无差异） |
| C-07 / C-26 | 事件夹具仍只在 `FAI_TEST_HOOKS=1` 下；标记原因限固定枚举、不含文件名/内容；夹具结果不写成真实作业（plan §3.5、§8.4 第 1、4 段） |
| C-17 / C-24 | 提前退出约定是否是必要复杂度且比默认路径更窄（唯一值 `'test-events-invalid'`、固定退出码 4 + 固定标记、仍先核对 `paths` 与隔离、只存布尔、默认语义与 10 s / 30 s 时限 / 清理 / 泄漏判定不变）；`FAI_CHECK_PRODUCER` 是否与已批准 `FAI_CHECK_E2E_DIR` 同类、是否只能在运行器单测夹具模式生效、是否仍是系统边界替换而非伪造生产；是否需要 Walter 工程批准（作者判断不需要，见 plan §0 修订 6“范围判定”） |
| C-13 / C-21 | T-07b/c/e 对 `src/test-hooks.js` 的所有权是否只实现 §8.3 已批准的快照字段与命令（`tray`/`activity` 读取真实对象、`tray-click` 调用真实托盘菜单项、`request-quit` 改接生产 `requestQuit()`、对话框记录补 `message`/`detail`），无新命令、无 emit/注入事件、无菜单模拟、无主进程 JS、无任意路径/URL、无钩子内业务状态；preload 与 `startup-visible` 批准全集不变 |
| C-20 / C-28 / C-29 / C-30 | T-07a 完成标准 4 条、验证 4 条，均含 AC 编号，cwd `shell`；T-07a 1.5h → 2h，合计 62h，仍 41 个任务；T-08e 依赖加 T-06d 后无前向依赖；Node 单测与真实 Electron 证据分层（plan §8.4 第 3 段） |
| R5-01 / R5-03 | T-06c 验证括注对位；T-08e 依赖与“真实核心完整档案 + 点击 `#prepare-guide`”前提已同步（正文与顺序表）。R5-02 仍 OPEN（P3），R5-04 已实施（静态），不是新需求 |

Analyze 迭代 9 的发现与结论见 `analyze.md`。

## 4. 证据边界

- 本轮只有静态检查；没有运行任何测试、npm、构建、Electron 或联网请求，也没有写源码。
- T-07a 首次实施（会话 `01a187b3-5e6b-76b8-b88a-1209f19e5f0a`，输入 `dad9352`）在写代码前预检停止，只追加了证据 §12；不是产品失败，不是模型/通道失败。此前的 42 unit / 19 场景 310/310 只是 T-06c/d 的历史证据，不是本轮复验；新的默认 20 场景未运行。
- RL-01 仍 P3 OPEN / UNKNOWN；A 报告 §4 的正负对照、RL-02～05、UTF-8、PYZ、507 GUI 与人工/外部证据义务均与本修订无关、保持不变。
- A 完成并全部复选框为勾选状态之前，Astra 不得恢复 T-07a；当前状态：**A 第 5 轮复查 PENDING**。
