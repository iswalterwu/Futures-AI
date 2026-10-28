# desktop-shell 评审与验收记录

> 当前阶段：补齐 Plan / Analyze / Checklist 前置条件，随后实施 T-07～T-10。
> Gate 1：Walter 已在会话中批准 desktop-shell v1；此前 spec 页首未补记，需补元数据，不改变需求正文。
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
| Plan | `8ba1b6a` | `anthropic/claude-opus-5-5` | bridge 已知 seven_day 限额仍在当前窗口，按 §6.5 不重复请求；本轮官方最小真实调用成功 | 独立会话、独立工作树 `D:/2030/Futures-AI-desktop-plan` / `plan/desktop-shell-resume`；已完成修订 2：spec 只补 Gate 1 元数据；Plan、初步缺口报告、M-01～M-26 人工步骤与审阅包已串行集成；未改代码、未跑测试、未提交或勾选 checklist |
| Checklist A | `8ba1b6a` + 固定规划工作副本（尚未提交） | `anthropic/claude-fable-5-1` | bridge 同窗口已知限额不重复请求；本轮官方最小真实调用成功 | Plan 产物已固定并复制至独立工作树 `D:/2030/Futures-AI-desktop-checklist` / `review/desktop-shell-checklist`；新开独立审核会话，仅可生成 checklist，不改代码/规划 |
| T-07～T-10 Implement | 待 Checklist / Analyze | 指定 `openai/gpt-6-astra` | 当前未进入该阶段；前轮最小真实调用成功不等于本轮实施证据 | 未启动；实施前重读全部 checklist 复选框与 Analyze 结论 |

本轮不使用旧会话记忆替代文件重读，不更改全局 pi/provider 配置。前轮测试结果仅作基线引用，不冒充本轮复验。

跨 feature 引用说明：settings 文档所说的 GUI「T-08」是 settings 自身待办编号，不是 desktop-shell 的 T-08（故障与诊断）。其界面子句在本 feature 由 T-06 及后续纠偏任务承载；不因此把 settings 的 GUI 标为已完成。

## 已取得的基线证据

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
