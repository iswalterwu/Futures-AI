# desktop-shell：Plan 修订 7（T-07b/T-07e 两条旧 null 断言兼容）A 第 6 轮复查请求

> 作者 = `anthropic/claude-opus-5-5` via anthropic，会话 `01a187bb-94f0-739b-a564-841bc4ccb516`（沿用 `ACTIVITY_PLAN_OK`；bridge 同窗口已知耗尽不重试；未回退）。协调 = `openai/gpt-6.1-sol`。日期 2026-10-29。

## 1. 固定输入

- 规划输入：`ec55aeed3c2b24ac8d2ea80bbb8bd7efa78723e5`（内容同主树 `ac8c028`；含 A 第 5 轮 41/41 与证据 §13 的 T-07b 预检停止）。
- 待审差异（四个文档）：`plan.md`（页首作者行、§0 修订 7、§8.4 第 6 段）、`tasks.md`（T-07b 修改范围 / 完成标准 4 / 验证 4；T-07e `crash-restart` 措辞）、`analyze.md`（追加迭代 10）、本文件。
- 评审 HEAD 由协调者提供；本文件不自报哈希。A 只审 `git diff ec55aee..<评审HEAD>`。

## 2. A 的写入范围

只写 `checklist.md`（第 6 轮记录）。不改其他文件、不运行测试、不代 Walter 批准。

## 3. 请求复查

| 项 | 关注点 |
|---|---|
| C-02 / C-03 | spec 与 38 条 AC 不变 |
| C-24 / C-26 | `harness-selftest.js:26` 与 `crash-restart.js:32` 的 `[null, null]` 由 T-07b 原位替换为真实状态断言（字面期望 `['idle', true]`），是否比旧负向不变量更强、不是弱化；禁止按场景伪造 null 或只在夹具下创建托盘 |
| C-20 / C-28 / C-29 | T-07b 完成标准 4 / 验证 4 对位且含 AC-006-1、AC-006-4；cwd `shell`；41 任务 / 62h 不变；T-07e 只追加并保留 T-07b 新断言 |
| 修订 6 不变 | 提前退出约定、`FAI_CHECK_PRODUCER`、钩子所有权与停止规则未改 |

## 4. 证据边界

只有静态检查；未运行测试或 Electron，未读 Astra 的 T-07a WIP。T-07a 由 Astra 按已批准修订 6 另行实施，不受本修订影响。**A 第 6 轮 PENDING**，通过前 T-07b/c/d/e 不得开始。
