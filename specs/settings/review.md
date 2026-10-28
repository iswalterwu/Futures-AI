# Feature: settings 评审记录（review.md）

> Handoff 材料。Review 由第三方 agent（独立会话、与实施隔离）参考 spec + plan + tasks + 实际代码差异执行。
> 审核员：A = claude-fable-5-1（**单审**，2026-10-28 起；A 的结论即审核结论）。
> **通道记录（2026-10-28）**：本轮 A 经 **anthropic** 通道（`--provider anthropic --model claude-fable-5-1`）
> —— claude-bridge 通道周限额（seven_day，10-30 18:00 重置）不可用，按 AGENTS.md §2 的通道优先级切换；
> 同一 Claude 模型、仅换接入路径，审核员身份不变。
> Gate 2：待 Walter 确认（GUI 部分待 desktop-shell，本轮交付核心 + CLI）。

## 完成项

- spec 5 条需求 / **19 条 AC**：核心与 CLI 相关的 AC 已实现并有测试覆盖；**界面类 AC（应用启动引导、跳过后进入主界面、设置入口）由 desktop-shell 承载，尚未完成**（T-08）
- 交付物（`backend/settings/`）：
  - `profile.py`：档案模型（全字段可空、邮箱/组织类型校验）、DPAPI 加密存储（与凭证明文隔离、fail closed）、缺项判定、邮箱遮蔽
  - `onboarding.py`：五步向导核心（预填 → 注册页指引 → 真实验证 → 成功才保存 → 记录验证时间/错误码）；**无表单提交、无浏览器自动化、无邮箱接入**
  - `sources.py`：数据源状态（与 data-layer 同口径）+ 取数路径推导（api / offline / builtin / declaration_only）+ unreadable 明确报错
  - `cli.py`：`futureai-settings profile|onboard|source`（key 只经 getpass，不接受位置参数）
- 安全边界：档案加密落盘（明文不可见）、验证失败不落盘、错误消息无 key、`.gitignore` 覆盖用户数据目录

## 评审发现（第一轮双审 B）与修复

- F-01 引导绕过校验、非法值落盘 → 引导逐项经 `profile.update` 校验，非法不写、可重试（15 项测试覆盖）
- F-02 不可读凭证被显示为正常/回退 → 新增 `path=blocked`、`status=error`，与"未配置 → offline"区分
- F-03 写进程运行时状态查询不可用 → `sources` 复写锁探测＋内部只读通道；无通道时结构化报错（不再裸 traceback）
- F-04 多进程写不安全 → 档案/状态文件均加目录锁（排队 5s）与原子替换；并发部分更新不丢字段（跨进程回归）
- F-05 引导把"全空档案"当已完成、中断不能恢复 → 引入 `onboard_state`（completed/skipped 标记），中断不置位、下次继续
- F-06 状态缺真实取数运行态 → 增加 `last_fetch_at` / `last_fetch_status`（读 `ingest_runs`），并标注运行态不可用场景
- F-07 HTTP DEBUG 日志泄露 key → 请求期间抑制 urllib3/requests 日志（数据层 `_suppress_http_debug`），有回归断言
- F-08 终端无法隐藏输入仍继续 → 捕获 `GetPassWarning` 即中止，不验证、不保存
- F-09 组织类型缺 Library → 清单补 `library`，并以官方选项 fixture 比对（11 项一致）
- F-11 验证错误分类不完整 → `_probe` 自分类（invalid_key/rate_limited/unreachable/server_error/bad_response），参数化覆盖
- F-12 文档数字/证据不准 → 本节与验收证据已按实测修正
- **F-10 未在代码修**：CLI 阶段成果不等于 feature 全部完成（界面依赖 desktop-shell）。见"未完成项"，需 Gate 2 裁决交付顺序

## 第二轮评审发现（A/B）与修复

- B2-01 并发请求时全局 logger 级别互相覆盖 → 改为**一次性脱敏 Filter**（`api_key=***`），不切级别
- B2-02 `GetPassWarning` 在读取之后才检查 → `_read_key` 先判终端，非终端直接拒绝（Windows 的 getpass 会降级回显）
- B2-03 运行态语义错 → 字段分离：`run_status`/`run_at`/`guide_error`，成功不再写进错误字段；失败给可操作提示
- B2-04 `clear()` 不持锁 → 纳入档案锁
- B2-05 凭证与状态非同一提交边界 → `verify_and_save`/`clear_key` 同取 `profile/` 锁（`write_state(lock=False)` 避免重入）
- B2-06 覆盖 data-layer 清单原因 → `reason` 保留原值，派生提示放 `reason_hint`
- B2-07 DPAPI 保存失败被当校验错误 → `ProgressError`（存储）与 `ValueError`（校验）分开，存错则失败退出且不置完成标记
- A P2-B plan/tasks 与实现脱节 → 已同步（SECTORS 11 项、path 五值、`_probe` 自建、state 结构、锁边界、日志脱敏）
- 第三轮 A（单审）指出 F3-01/F3-02（变异脚本假阳性、重复类遮蔽脱敏测试）与 13 项 P3，已修：测试去重、变异脚本区分 BROKEN、`declaration_only` 走真实路径、`creds.remove()`、锁超时消息、settings 与 data CLI 的等待一致、死代码清理、data-layer plan 与文档同步
- **F-10（GUI 类 AC 延后）仍未裁决**，待 Gate 2 由 Walter 决定交付顺序

## 未完成项

- **GUI**：档案表单、五步向导、状态卡片等视图层归 desktop-shell（T-08），本轮只交付可测试核心 + CLI，流程不重复实现
- 真实 EIA 注册流程的端到端人工走查（需要真实邮箱与 key；自动化验证已就绪，注册本身按设计由用户完成）
- 档案导入/导出（未在 spec 范围；如需再走流程）

## 风险

- **EIA 注册表单字段变化**：档案字段与 `SECTORS` 为 plan 层清单；表单改版时同步维护（`guide_fields` 只做展示，不解析页面）
- **用户把 key 贴进 shell 历史**：CLI 仅用 getpass；文档明确提示
- **DPAPI 不可用**：档案与凭证均 fail closed（报错，不降级明文）
- **验证请求触发限流**：429 明确提示、不保存、不自动重试

## 下一步任务

1. Review（本轮双审）→ Gate 2 → Handoff
2. desktop-shell 就绪后接 T-08（视图层复用本轮核心）
3. 首个真实用户走查（注册 + key 回填 + 状态确认）

## 验收证据

- 测试命令输出摘要：`cd backend && python -m pytest tests/ -q` → **373 passed, 5 skipped**（0 warnings，2026-10-27；5 skip = 在线冒烟默认跳过）
- settings 专项：`pytest tests/test_settings_*.py -q` → **74 passed**（profile 16 / onboarding 19 / sources 10 / cli 19 / privacy 10，含 AC-005 静态断言与官方选项比对）
- 发布检查：`python tools/release_check.py` → **13/13**（新增 settings 包入 wheel、`futureai-settings` 入口、隔离环境档案+状态冒烟）
- 变异验证：`cd backend && python tools/mutations.py` → **8/8 检出**（脚本按新准则裁到 8 项关键守护）（settings 11 项：引导不校验、unreadable 当回退、写锁不路由、状态非原子、引导状态按内容、缺运行态、两处 HTTP 日志、getpass 降级继续、缺 Library、503 误分类；data-layer 5 项：无 key 不回退、凭证故障静默回退、内置回流 stock、无看门狗、BEGIN 移出保护）
