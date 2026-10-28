# Feature: settings 任务清单（tasks.md）

> Tasks 阶段产物：每任务 0.5–2 小时可完成，按依赖顺序执行。完成标准引用 AC。
> 前置条件：`specs/settings/spec.md` v1 已过 Gate 1（2026-10-27）；`plan.md` 已定稿。

## 任务

### T-01 包骨架与依赖
- 上下文：`backend/settings/` 新包（与 `data` 平级，单向依赖 data）；入口 `futureai-settings`
- 修改范围：`backend/settings/__init__.py`、`backend/settings/cli.py`（骨架）、`backend/pyproject.toml`（packages 与 scripts）
- 完成标准：`python -c "import settings"` 成功；`futureai-settings --help` 可用
- 验证命令：`cd backend && python -m pytest tests/test_settings_cli.py -k skeleton -q`
- 状态：✅

### T-02 档案模型与加密存储
- 上下文：plan §2.1/§3.1；依赖 T-01
- 修改范围：`backend/settings/profile.py`
- 完成标准：AC-001-1（可部分保存/读回、缺项判定）、AC-001-2（邮箱/sector 校验）、AC-001-3（本机加密、无网络）、AC-001-4（清档案不动凭证）
- 验证命令：`cd backend && python -m pytest tests/test_settings_profile.py -q`
- 状态：✅

### T-03 开通向导核心
- 上下文：plan §2.2/§4；依赖 T-02
- 修改范围：`backend/settings/onboarding.py`
- 完成标准：AC-003-1（预填与缺项）、AC-003-2（成功才保存、四类失败分类）、AC-003-3（不回显/不记录明文）、AC-003-4（完成页路径与时间）、AC-003-5（清除后回免凭证）
- 验证命令：`cd backend && python -m pytest tests/test_settings_onboarding.py -q`
- 状态：✅

### T-04 数据源状态
- 上下文：plan §2.3；依赖 T-01（与 data-layer v23 的 `last_path`/凭证状态配合）
- 修改范围：`backend/settings/sources.py`
- 完成标准：AC-004-1（与 Service 同口径）、AC-004-2（unreadable 报错）、AC-004-3（missing → offline 标注）
- 验证命令：`cd backend && python -m pytest tests/test_settings_sources.py -q`
- 状态：✅

### T-05 CLI 子命令
- 上下文：plan §2.4；依赖 T-02/T-03/T-04
- 修改范围：`backend/settings/cli.py`
- 完成标准：AC-002-1/2/3/4（首次启动、留空可完成、可跳过、同次运行不丢）、AC-003-2（key 用 getpass，不接受位置参数）
- 验证命令：`cd backend && python -m pytest tests/test_settings_cli.py -q`
- 状态：✅

### T-06 隐私与静态断言
- 上下文：plan §5（AC-005-*）；依赖 T-03/T-05
- 修改范围：`backend/tests/test_settings_privacy.py`
- 完成标准：AC-005-1（代码无向 register.php 的 POST）、AC-005-2（profile/creds 不入 Git）、AC-005-3（日志/错误无 key 明文，阳性样例命中）
- 验证命令：`cd backend && python -m pytest tests/test_settings_privacy.py -q`
- 状态：✅

### T-07 全量回归与文档
- 上下文：依赖 T-01~T-06
- 修改范围：`backend/README.md`、`specs/README.md`、`specs/settings/review.md`
- 完成标准：全量测试绿；包安装后 `futureai-settings` 入口可用（发布检查扩展）
- 验证命令：`cd backend && python -m pytest tests/ -q && python tools/release_check.py`
- 状态：✅

## 后续（依赖 desktop-shell）

- T-08 设置界面（档案表单、开通向导五步、数据源状态卡片）：等 desktop-shell 落地后接，复用 T-02~T-05 的核心接口，不重复实现流程；承载 AC-002-1、AC-002-3 与 AC-003-3/AC-003-5 的界面子句（Walter 2026-10-28 批准分阶段交付）

## 追加任务（评审驱动修复）

| # | 任务（修改范围） | 关联发现 | 完成标准（AC） | 验证命令 | 状态 |
|---|---|---|---|---|---|
| T-09 | 引导逐项校验（非法不落盘、可重试、中断可续）、引导完成标记、档案/状态并发锁、`unreadable` 阻断态、写锁时经 data-layer 只读通道、`Library` 选项 | 第一轮 A/B 的 F-01~F-09 | AC-001-1/2、AC-002-1~4、AC-004-1~3 | `pytest tests/test_settings_*.py -q` | ✅ |
| T-10 | 日志脱敏改用一次性 `logging.Filter`（不再切全局级别）、`_read_key` 非终端拒绝、运行态字段分离（`run_status`/`run_at`/`guide_error`）、保留 data-layer 清单原因（`reason`/`reason_hint`）、DPAPI 失败不误报、plan/tasks 同步 | 第二轮 A/B 的 B2-01~B2-07、P2-A、P2-B | AC-001-3/4、AC-003-2~5、AC-004-1、AC-005-3 | `pytest tests/test_settings_*.py -q` + `python tools/mutations.py` | ✅ |
