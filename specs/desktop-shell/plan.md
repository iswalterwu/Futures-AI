# Feature: desktop-shell 实施计划（plan.md）

> Plan 阶段产物，由 `spec.md`（v1，Gate 1 已于 2026-10-28 批准）生成。需求在 spec，本文承载实现机制与契约。

## 1. 技术方案

- **外壳**：Electron（D-007）主进程 + 渲染进程（加载前端构建产物）；`contextIsolation` 开启、`nodeIntegration` 关闭
- **后端宿主**：新增 `backend/app/`（FastAPI，D-010）——不是一个业务 API，而是**进程宿主**：持有 data Service（写锁）、起 MCP（复用 data-layer 的 `build_mcp`）、暴露 `/health` 与最小设置端点，供外壳判定就绪与承载引导
- **打包**：后端 PyInstaller onedir（含 `data/`、`settings/` 与三份内置清单）→ 外壳用 electron-builder 打 NSIS 安装包，二者随包分发
- **依赖**：Node 25 / npm 11（构建期）；Python 侧新增 `fastapi`、`uvicorn`、`pyinstaller`
- **单实例**：Electron `app.requestSingleInstanceLock()`；第二实例聚焦已有窗口（AC-004-1）
- **端口与令牌**：后端监听 `127.0.0.1:0`（系统分配），就绪后把 `{port, token}` 写入外壳指定的端点文件；**就绪判定用 `/health` 而不是端点文件**（AC-002-2）

## 2. 进程模型

```
Electron Main（单实例锁、窗口、托盘、通知、日志、诊断）
 ├── Renderer（Vue 构建产物或内置引导页；CSP 禁远程）
 └── child: futuresai-backend（一个进程）
       ├── data Service（持 <data>/.lock 写锁；DuckDB + SQLite）
       ├── MCP server（127.0.0.1，Bearer token，含内部只读端点）
       └── /health、/settings/*（最小宿主端点；业务 API 归 `api` feature）
```

- 外壳**只拉一个**子进程（spec Q-001）；`data serve` 不再单独启动
- 启动顺序：外壳 → 后端（等 `/health`）→ 显示主界面；退出顺序：通知后端 `/shutdown` → 等子进程退出（≤5s）→ 超时 kill → 外壳退出
- 后端退出必须在 `finally` 释放写锁与 MCP 端口（沿用 data-layer 的 `Service.close()`）

## 3. 模块设计

### 3.1 后端宿主（`backend/app/`）

| 文件 | 职责 |
|---|---|
| `main.py` | FastAPI 应用；启动时 `Service(root).init()` + 起 MCP（后台线程）；`/health`；`/shutdown`；`/settings/profile`（GET）、`/settings/onboard`（GET/POST）、`/settings/sources`（GET）、`/settings/key`（POST 验证并保存） |
| `__main__.py` | `python -m app --root <dir> --port-file <path> --token <t>`：起 uvicorn（127.0.0.1:0），就绪后写端点文件 |

**契约**：

- `GET /health` → `{"status":"ok","data_ready":true,"version":"0.1.0","mcp_port":<n>}`；数据未就绪时 `data_ready=false`（外壳不用它判就绪，用 `status`）
- `POST /shutdown`（Bearer）→ 202，随后进程退出
- `GET /settings/profile` → 档案（邮箱遮蔽）+ `onboard` 状态 + `missing_for_registration`
- `POST /settings/onboard` `{skip: bool}` → 标记引导完成/跳过
- `GET /settings/sources` → 复用 `settings.sources.list_with_status`
- `POST /settings/key` `{key}` → 复用 `settings.onboarding.verify_and_save`；**不回显 key**
- 所有端点要求 `Authorization: Bearer <token>`（除 `/health`，供外壳探活）

### 3.2 外壳（`shell/`）

| 文件 | 职责 |
|---|---|
| `main.js` | 单实例锁、窗口、托盘、通知、日志、诊断包、后端子进程管理、`/health` 轮询、退出流程 |
| `preload.js` | 暴露 `window.futuresai = {mode, apiBase, token, version, openExternal, showDiagnostics}`（最小面） |
| `renderer/onboarding.html` | **内置最小引导/设置页**（档案表单 + EIA 开通 + 数据源状态），调用后端 `/settings/*`；不依赖 `frontend-workbench` 分支（AC-005-*） |
| `electron-builder.yml` | 打包配置（NSIS、图标、`extraResources` 放后端产物） |

- 前端产物缺失或 mock 模式 → 加载内置页并置 `mode="mock"`（AC-002-4）
- 托盘菜单：打开主窗口 / 查看运行中作业（v1 显示占位）/ 导出诊断 / 退出
- 关窗默认最小化到托盘（spec Q-003）；设置里可改为退出
- 通知：作业阶段完成、验证性需求、介入冲突、后端异常（v1 由后端事件推送预留，先支持"后端异常"与手动测试入口）

### 3.3 打包（`packaging/` + `backend/tools/`）

- `backend/tools/build_backend.py`：PyInstaller onedir，产物 `backend/dist/futuresai-backend/`
- `packaging/build.ps1`：`npm ci && npm run build`（前端，若存在）→ build_backend → electron-builder
- `backend/tools/shell_check.py`：**冒烟**——启动打包后的后端可执行文件 → 轮询 `/health` → 调 `/settings/profile` → `/shutdown` → 断言退出码 0、写锁已释放、端口关闭（AC-002/003/004 的可自动化部分）

## 4. 关键流程

1. **启动**：单实例锁（失败→聚焦已有窗口）→ 解析数据目录（默认 `%LOCALAPPDATA%/FuturesAI`；不可写→错误页 AC-004-3）→ 起后端子进程 → 轮询 `/health`（≤30s，失败→错误页含重试与日志 AC-007-2）→ 读 `/settings/profile` 判引导 → 加载主界面（或内置引导页）
2. **退出**：有运行中作业→提示（AC-003-2）→ `POST /shutdown` → 等子进程 ≤5s → kill → 关闭窗口/托盘 → 退出
3. **崩溃恢复**：后端非正常退出 → 重启（≤3 次，间隔递增）→ 超限→错误页 + 诊断包（AC-002-3）；强杀后下次启动清理陈旧锁（AC-003-3，data-layer 已实现 `_stale`）
4. **端口占用**：后端用 `port=0`，天然避让；若指定端口被占 → 外壳重试一次改 0 并记录（AC-007-1）
5. **诊断**：`导出诊断` → `<userData>/diagnostics-<ts>.zip`，含版本/环境/最近日志/进程状态；脱敏（token、key、邮箱、绝对路径中的用户名）

## 5. 验收对应

| AC | 实现位置 | 验证方式 |
|---|---|---|
| AC-001-1/2/4 | electron-builder + `main.js` 启动流程 | `packaging/build.ps1` 产物 + 干净机器人工清单（Q-009：v1 可先用已装运行时过渡） |
| AC-001-3 | NSIS 卸载脚本 | 人工：卸载后检查无运行时残留、数据目录保留提示 |
| AC-002-1/2/3/4 | `main.js` 就绪与重启逻辑、`renderer/` mock 分支 | `tools/shell_check.py`（/health 判定、kill 后重启）+ 人工（mock 模式） |
| AC-003-1/2/3/4 | 退出流程、后端 `finally` 释放、`/shutdown` | `shell_check.py`：退出后无 `.lock`、端口关闭；人工：运行中作业提示 |
| AC-004-1/2/3/4 | 单实例锁、数据目录校验 | 人工双击两次（聚焦）+ `shell_check.py`（占用/只读目录报错） |
| AC-005-1~4 | `renderer/onboarding.html` + `/settings/*` | `tests/test_app_settings_api.py`（后端）+ 人工（界面） |
| AC-006-1~4 | 托盘/通知 | 人工清单 |
| AC-007-1~4 | 端口/超时/资源/磁盘 | `shell_check.py`（端口占用、启动超时注入）+ 人工 |
| AC-008-1~3 | 版本与更新检查 | 人工（关于页、离线不阻塞） |
| AC-009-1~4 | 绑定地址、CSP、外链、诊断脱敏 | `tests/test_app_security.py`（绑定与 Bearer）+ 人工（外链）+ 诊断包脱敏断言 |
| AC-010-1~3 | 日志滚动、诊断包、崩溃现场 | `tools/shell_check.py`（日志存在与滚动）+ 人工 |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| Electron/electron-builder 首次安装耗时长、依赖网络 | 构建脚本先做 `npm ci` 缓存；失败时保底交付"后端宿主 + 冒烟脚本"，外壳单独迭代 |
| PyInstaller 打包后路径/资源丢失（内置 manifest） | `build_backend.py` 显式 `--add-data` 三份 manifest；`shell_check.py` 用打包产物跑 `/settings/sources` 断言三源可见 |
| 杀进程不留清理机会 | 后端 `finally` 释放锁 + 下次启动陈旧锁回收；`/shutdown` 是首选路径 |
| 双实例抢写锁 | 单实例锁在 Electron 层，早于后端启动 |
| 前端 mock 与真实 API 混用 | 外壳用 `mode` 显式区分；mock 模式不调后端业务端点 |
| 干净机器验收缺测试运行时 | Q-009：v1 过渡验收 + 发布前补干净机器验证（列入 Handoff 未完成项） |

回滚：本 feature 只新增 `backend/app/`、`shell/`、`packaging/`；删除即回到 data-layer + settings 状态，不影响既有数据。
