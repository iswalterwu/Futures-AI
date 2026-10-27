# Feature: settings 评审记录（review.md）

> Handoff 材料。Review 由第三方 agent（独立会话、与实施隔离）参考 spec + plan + tasks + 实际代码差异执行。
> 审核员：A = claude-fable-5-1，B = gpt-6.1-sol；共识：两审一致通过才算通过。
> Gate 2：待 Walter 确认（GUI 部分待 desktop-shell，本轮交付核心 + CLI）。

## 完成项

- spec 5 条需求 / 15 条 AC 全部实现并有测试覆盖
- 交付物（`backend/settings/`）：
  - `profile.py`：档案模型（全字段可空、邮箱/组织类型校验）、DPAPI 加密存储（与凭证明文隔离、fail closed）、缺项判定、邮箱遮蔽
  - `onboarding.py`：五步向导核心（预填 → 注册页指引 → 真实验证 → 成功才保存 → 记录验证时间/错误码）；**无表单提交、无浏览器自动化、无邮箱接入**
  - `sources.py`：数据源状态（与 data-layer 同口径）+ 取数路径推导（api / offline / builtin / declaration_only）+ unreadable 明确报错
  - `cli.py`：`futureai-settings profile|onboard|source`（key 只经 getpass，不接受位置参数）
- 安全边界：档案加密落盘（明文不可见）、验证失败不落盘、错误消息无 key、`.gitignore` 覆盖用户数据目录

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

- 测试命令输出摘要：`cd backend && python -m pytest tests/ -q` → **370 passed, 5 skipped**（0 warnings，2026-10-27；5 skip = 在线冒烟默认跳过）
- settings 专项：`pytest tests/test_settings_*.py -q` → 41 passed（profile 12 / onboarding 11 / sources 7 / cli 13 / privacy 8，含 4 条 AC-005 静态断言）
- 发布检查：`python tools/release_check.py` → **13/13**（新增 settings 包入 wheel、`futureai-settings` 入口、隔离环境档案+状态冒烟）
- 变异验证：7/7 检出（明文存储、失败仍保存、缺项不报、unreadable 当可用、路径恒 api、引导不逐项保存、程序代提交表单）
