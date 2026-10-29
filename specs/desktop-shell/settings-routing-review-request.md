# desktop-shell：Plan 修订 5（T-06c/T-06d 设置导航与测试兼容）A 复查请求

> 作者 = `anthropic/claude-opus-5-5` via anthropic（Plan/Tasks/Analyze，同一 Plan 阶段；bridge 同窗口已知耗尽，官方探活 `ROUTING_PLAN_OK`；中途协调者取消与格式修复不是模型/通道失败，未回退）。协调 = `openai/gpt-6.1-sol`。日期 2026-10-29。

## 1. 固定输入

- 规划基线：`4b0c3c510906bba83f41eac4ac34bbbccf1c1a30`（分支 `plan/desktop-shell-settings-routing`；代码同实施提交 `d77ce69`，T-06b 检查点）。
- 待审差异（四个文档，相对 `4b0c3c5`）：`specs/desktop-shell/plan.md`（修订 5）、`specs/desktop-shell/tasks.md`（T-06c/d、顺序表第 22/23 行、合计）、`specs/desktop-shell/analyze.md`（追加迭代 8）、本文件（新增）。
- **评审 HEAD 由协调者在集成提交后另行提供**；本文件不自报自身所在提交的哈希。A 应只审该固定 HEAD 的真实 `git diff 4b0c3c5..<评审HEAD>`，审核期间不移动 HEAD。

## 2. A 的写入范围

只写 `specs/desktop-shell/checklist.md`（新增“第 4 轮（修订 5）复查记录”、记录实际模型与通道、受影响项结论）。不改源码、spec、plan、tasks、analyze、review、README、HANDOFF、证据文件；不运行测试；不代 Walter 批准任何工程项。

## 3. 请求复查的受影响质量项

| 项 | 关注点 |
|---|---|
| C-02 / C-03 | spec 冻结、无 AC/依赖变更（Analyze 8：`spec.md` 相对 `4b0c3c5` 无差异） |
| C-11 | `frontend_missing`/`renderer_crashed` 重试改经 `routeToMain()`，引导未完成时不越过引导；`frontend-missing` 用真实核心标记完成且原断言全保留（plan §4.1、§6.1 第 2、7 段） |
| C-13 / C-21 | preload 面：仅新增无参数 `openMain()`；`startup-visible` 改为 APPROVED 18 / REQUIRED_NOW 7 / FORBIDDEN 显式断言，是否仍保留“无未批准成员”的保证；外链仍只经 `setWindowOpenHandler`（plan §3.3、§6.1 第 6、9 段） |
| C-14 | 主进程只读复用 `GET /settings/profile`，不缓存/推导引导状态；不改后端（§6.1 第 1、2 段） |
| C-17 / C-24 | `app-menu-click {item:"settings"}`：单值枚举、只在测试钩子下、调用真实 `MenuItem.click`、不执行主进程 JS；是否属于必要复杂度且仍是系统边界接缝（§6.1 第 5 段、§8.3）；是否需要 Walter 工程批准（作者判断不需要，见 plan §0 修订 5“范围判定”） |
| C-20 / C-28 / C-29 / C-30 | T-06c/d 完成标准引用 AC、验证一一对应（5/5、4/4）、cwd `shell`；T-06c 1.5h → 2h，合计 61.5h，仍 41 个任务、依赖不变 |
| AC-005-3 追溯表 | T-06d：`#prepare-guide`、缺项焦点、离开即清空、不写 Web 存储、不提交 key、不联网（§6.1 第 9 段） |

Analyze 迭代 8 发现：AN8-01、AN8-02（P3，已修）；AN8-03（409 分支无自动化，P3 接受，交 A 判断）；AN8-04（协调者集成动作）。无 P1/P2。

## 4. 证据边界

- 本轮只有静态检查；**没有执行 19 个场景**，也没有运行任何测试、npm、构建或联网请求。
- 既有实际证据仅为 T-06b 检查点（`implementation-evidence.md` §10.3）：42 unit / 0 skip、16 场景 236/236，真实 `file://` 设置 XHR 未触发 CORS 停止。T-06c/d 未实施。
- A 完成并全部复选框为勾选状态之前，Astra 不得实施 T-06c/d；当前状态：**A 第 4 轮复查 PENDING**。
