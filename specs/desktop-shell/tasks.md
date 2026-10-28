# Feature: desktop-shell 任务清单（tasks.md）

> Tasks 阶段产物：每任务 0.5–2 小时可完成，按依赖顺序执行。完成标准引用 AC。
> 前置条件：`spec.md` v1 已过 Gate 1（2026-10-28）；`plan.md` 已定稿。

## 任务

### T-01 后端宿主骨架与 /health
- 上下文：plan §3.1；依赖 data-layer v23
- 修改范围：`backend/app/__init__.py`、`backend/app/main.py`、`backend/app/__main__.py`、`backend/pyproject.toml`（fastapi/uvicorn 依赖 + 包）
- 完成标准：AC-002-2（`/health` 返回 status 与 data_ready，数据未就绪时为 false）、AC-009-1（只绑 127.0.0.1）
- 验证命令：`cd backend && python -m pytest tests/test_app_health.py -q`

### T-02 后端生命周期与优雅退出
- 上下文：plan §2/§4；依赖 T-01
- 修改范围：`backend/app/main.py`
- 完成标准：AC-003-1（退出后 `.lock` 释放、端口关闭）、AC-009-1（除 `/health` 外需 Bearer）
- 验证命令：`cd backend && python -m pytest tests/test_app_lifecycle.py -q`

### T-03 设置端点（引导/档案/数据源/开通）
- 上下文：plan §3.1；依赖 T-01、settings
- 修改范围：`backend/app/main.py`
- 完成标准：AC-005-1/2（引导状态可读写）、AC-005-3（数据源状态与开通）、AC-005-4（不回显 key）
- 验证命令：`cd backend && python -m pytest tests/test_app_settings_api.py -q`

### T-04 打包后端可执行文件
- 上下文：plan §3.3；依赖 T-01~T-03
- 修改范围：`backend/tools/build_backend.py`、`backend/pyproject.toml`（pyinstaller 依赖）
- 完成标准：AC-001-4（产物不含用户数据）、内置三份 manifest 随包
- 验证命令：`cd backend && python tools/build_backend.py && python tools/shell_check.py --backend-only`

### T-05 外壳主进程：单实例、窗口、就绪、退出
- 上下文：plan §2/§3.2；依赖 T-01/T-04
- 修改范围：`shell/main.js`、`shell/preload.js`、`shell/package.json`
- 完成标准：AC-002-1/2/3（就绪判定与重启）、AC-003-2/4（退出提示与不再接新作业）、AC-004-1（单实例聚焦）
- 验证命令：`cd shell && npm run check`（含 `tools/shell_check.py` 的端到端冒烟）

### T-06 内置引导与设置页
- 上下文：plan §3.2；依赖 T-03/T-05
- 修改范围：`shell/renderer/onboarding.html`、`shell/renderer/onboarding.js`
- 完成标准：AC-005-1/2/3（首启引导、可跳过、开通向导与状态）、AC-005-4（界面不显示明文）
- 验证命令：`cd shell && npm run check:ui`（用 Electron 加载页面并断言 DOM 文案）

### T-07 托盘、通知与关窗行为
- 上下文：plan §3.2；依赖 T-05
- 修改范围：`shell/main.js`
- 完成标准：AC-006-1/2/3/4
- 验证命令：人工清单（`specs/desktop-shell/checklist.md` 中标注 M-01~M-04）

### T-08 故障处理与诊断
- 上下文：plan §4；依赖 T-05
- 修改范围：`shell/main.js`、`backend/app/main.py`（日志）
- 完成标准：AC-007-1/2/3/4、AC-010-1/2/3、AC-009-2/3/4
- 验证命令：`cd backend && python -m pytest tests/test_app_security.py -q` + `python tools/shell_check.py`

### T-09 更新检查与关于页
- 上下文：plan §3.2；依赖 T-05
- 修改范围：`shell/main.js`、`shell/renderer/onboarding.html`
- 完成标准：AC-008-1/2/3
- 验证命令：人工清单（M-05~M-06）

### T-10 构建与安装包
- 上下文：plan §3.3；依赖 T-04/T-05
- 修改范围：`shell/electron-builder.yml`、`packaging/build.ps1`
- 完成标准：AC-001-1/2/3（安装、启动、卸载）
- 验证命令：`packaging/build.ps1` 产物 + 人工安装清单（M-07）

## 实施进度

| # | 任务 | 状态 | 证据 |
|---|---|---|---|
| T-01 | 后端宿主骨架与 `/health` | ✅ | `tests/test_app_health.py` 5 passed |
| T-02 | 后端生命周期与优雅退出 | ✅ | `tests/test_app_lifecycle.py` 3 passed（退出后锁/端口释放、强杀自愈） |
| T-03 | 设置端点（引导/档案/数据源/开通） | ✅ | `tests/test_app_settings_api.py` 6 passed |
| T-04 | 打包后端可执行文件 + 冒烟 | ✅ | `tools/build_backend.py` 产物 + `tools/shell_check.py` 8/8 |
| T-05 | Electron 主进程（单实例/窗口/后端托管/就绪/重启/优雅退出/日志） | ✅ | `shell/check.js` 9/9（含就绪、退出清理、单实例） |
| T-06 | 内置引导/设置页（引导、档案、EIA 开通、数据源状态） | ✅ | `shell/check.js` 9/9 + `tests/test_app_settings_api.py` 10 passed |
| T-07~T-10 | 托盘/通知、故障诊断、更新、安装包 | ⬜ | 待实施 |
