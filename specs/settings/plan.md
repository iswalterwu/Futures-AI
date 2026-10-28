# Feature: settings 实施计划（plan.md）

> Plan 阶段产物：由 `spec.md`（v1，Gate 1 已批准 2026-10-27）生成的设计成果。需求在 spec，本文承载实现机制与契约。
> 依赖：data-layer v23（凭证加密存储、数据源状态、EIA 双路径）。

## 1. 技术方案

- **语言/框架**：Python 3.14（D-002）；新包 `backend.settings`（与 `backend.data` 平级，**单向依赖 data**，data 不反向依赖 settings）
- **界面宿主**：v1 只交付**CLI + 可测试核心**；GUI 归 desktop-shell（本 feature 的界面在 shell 就绪后接，落地时只做视图层，不重复实现流程）
- **存储**：
  - 档案：`<用户数据目录>/profile/profile.bin`——**DPAPI 加密的 JSON**（复用 `data.creds` 的加解密，与凭证同等保护、同等 fail closed）
  - 数据源开通状态：`<用户数据目录>/profile/state.json`——**不含任何凭证**，仅 `{source_id: {verified_at, last_error}}`
- **凭证**：沿用 data-layer 的 `<用户数据目录>/creds/<credential_ref>.bin`（DPAPI）
- **依赖**：`pydantic`（档案模型）、`data`（Service / creds / FetchError）；EIA 验证复用 data-layer 的 API 请求点

## 2. 模块设计

### 2.1 档案（`settings/profile.py`）

```python
class Profile(BaseModel):            # 全部字段可空（spec Q-001：不是必填项）
    first_name: str = ""
    last_name: str = ""
    email: str = ""
    sector: str = ""                 # 固定清单，见下
    reason_for_use: str = ""         # 可选
    notify: bool = False             # 可选
    display_name: str = ""           # 应用偏好
```

- `SECTORS`（与 EIA 注册表单选项一致的封闭清单，11 项；2026-10-27 抓取注册页并在 `tests/fixtures/eia_register/sectors.txt` 留存比对样本）：`business`、`citizen`、`research`、`finance`、`government`、`library`、`student`、`teacher`、`media`、`trade_assoc`、`other`（界面展示对应英文原文）
- 校验：`email` 非空时须形如 `x@y.z`；`sector` 非空时须在清单内；`notify` 布尔
- `load(root) -> Profile`：文件不存在 → 返回空 Profile（首次启动判定）；存在但解密失败 → 报错（fail closed，不静默当空）
- `save(root, profile)`：DPAPI 加密后原子替换（复用 `creds.put` 的临时文件语义）
- `clear(root)`：删除档案文件，**不动 creds**（AC-001-4）
- `missing_for_registration(profile) -> list[str]`：返回"数据源注册所需"字段的缺项（`first_name`/`last_name`/`email`/`sector`）；供向导与界面使用（AC-001-1）

### 2.2 开通向导（`settings/onboarding.py`）

五步对应 spec R-003，写成**可测试的无副作用状态机**（每步返回结构化结果，不直接 print）：

```python
@dataclass
class Step:
    key: str                 # prepare | submit | key_input | verify | done
    title: str
    detail: dict             # 预填字段、注册页 URL、缺项、验证结果等

def prepare(root) -> Step            # 用档案预填；缺项时 detail["missing"] 非空（AC-003-1）
def registration_url() -> str        # https://www.eia.gov/opendata/register.php + 逐项指引
def guide_fields(profile) -> list[dict]   # [{label, value}] 供界面照抄到浏览器表单
def verify_and_save(root, key) -> Step    # 真实验证 → 成功才保存（AC-003-2/3）
def clear_key(root) -> None               # 清除凭证 → 回到免凭证路径（AC-003-5）
```

- `verify_and_save` 的验证 = **真实调用 EIA API 一次**（注入点 `settings.onboarding._probe`；默认实现自建请求以便精细分类，不复用 data-layer 的 `_request`——后者把 5xx 与网络错误都归为 `adapter_error`，分不出 server_error/unreachable）：
  - 成功（HTTP 200 + 至少一条数据）→ `creds.put` → 写 `state.json.verified_at` → `Step("done")`
  - 401/403 → `invalid_key`；429 → `rate_limited`；网络不可达 → `unreachable`；5xx → `server_error`
  - **任何失败都不保存**；错误消息不含 key 明文（AC-003-3）
- 程序**不提交注册表单**：本模块不含向 `register.php` 发 POST 的代码路径（AC-005-1，静态断言守护）
- **日志脱敏**：`data.adapters.eia.protect_secrets()` 一次性给 `urllib3`/`requests` logger 装 Filter，把 `api_key=...` 替换为 `api_key=***`；不切换日志级别（并发请求下也不失效）
- **提交边界**：`verify_and_save` 的「写凭证 + 记 verified_at」与 `clear_key` 的「删凭证 + 清状态」都取 `profile/` 目录锁，二者互斥（锁不可重入，内部 `write_state(lock=False)`）

### 2.3 数据源状态（`settings/sources.py`）

```python
def list_with_status(root) -> list[dict]
# [{adapter_id, name, enabled, status, credential_state, path, verified_at, last_error}]
# credential_state: configured | missing | unreadable
# path: api | offline | builtin | declaration_only | blocked
#   api=有凭证走官方 API；offline=未配置凭证走免凭证回退；builtin=内置实现无需凭证；
#   declaration_only=清单未声明 implementation；blocked=凭证存在但读不出（不回退、不可用）
# reason: 保留 data-layer 的清单原因（坏件/重复 id/已移除）；派生提示放 reason_hint
# run_status / run_at: 最近一次取数的结果与时间（来自 ingest_runs）；guide_error: 向导期的凭证错误码
```

- 源列表与状态来自 `data.Service.list_sources()`（同口径，AC-004-1）
- `path` 推导：`implementation=eia` 且凭证 `configured` → `api`；凭证 `missing` → `offline`（**界面明确标注"免凭证回退"**，AC-004-3）；`unreadable` → 状态错误并给原因（AC-004-2）；无 `implementation` → `declaration_only`
- 判断 `credential_state` 时：`creds.exists` 先判存在；存在但解密失败 → `unreadable`（此时不读内容、不返回明文，只做一次解密校验）

### 2.4 CLI（`settings/cli.py`，入口 `futureai-settings`）

| 子命令 | 行为 | 对应 AC |
|---|---|---|
| `profile show` | 显示档案（邮箱做遮蔽） | AC-001-1 |
| `profile set [--first-name ...] [--email ...] [--sector ...]` | 部分更新并保存；缺项只提示不拦截 | AC-001-1/002-2 |
| `profile clear` | 清除档案 | AC-001-4 |
| `onboard` | 首次启动引导：显示档案表单、可跳过（`--skip`） | AC-002-1/2/3 |
| `source list` | 数据源与路径/验证状态 | AC-004-1/2/3 |
| `source open eia` | 向导：预填 → 打印注册页与逐项指引 → 不回显输入 key → 验证 → 保存 | AC-003-1~4 |
| `source clear eia` | 清除 key，回到免凭证 | AC-003-5 |

- 输出约定：查询类输出 JSON；交互类输出提示文本；错误走 stderr 并返回 1（与 data-layer CLI 一致）
- key 输入走 `settings.cli._read_key()`：**非终端直接拒绝**（Windows 下 `getpass` 会降级为回显读取，不能靠 warning 拦截）；`warnings` 把 `GetPassWarning` 升为异常作为第二道；不接受位置参数传 key

## 3. 数据与存储

### 3.1 用户数据目录增量（AC-009-3 沿用 data-layer 布局）

```
<root>/profile/profile.bin     # DPAPI 加密的档案 JSON（不在 Git）
<root>/profile/state.json      # {source_id: {verified_at, last_error}, onboard: {completed, skipped}}（不含凭证）
<root>/creds/eia_api_key.bin   # 既有：DPAPI 凭证（data-layer 管）
```

目录由 settings 自己创建；`profile/` 与 `creds/` 分离，清除档案不影响凭证。

### 3.2 档案与凭证的关系

| 操作 | 档案 | 凭证 |
|---|---|---|
| `profile clear` | 删除 | 保留（AC-001-4） |
| `source clear eia` | 保留 | 删除（回到免凭证，AC-003-5） |
| 向导验证失败 | 不变 | 不写入（AC-003-2） |

## 4. 关键流程

1. **首次启动**：`load(root)` 无文件 → 引导；`onboard --skip` 直接返回 0 并提示（AC-002-3）
2. **开通 EIA**：`prepare`（档案缺项 → 先提示补档案，不出现空表单）→ 打印注册页 + 逐项指引 → 用户浏览器提交 → `getpass` 读 key → `verify_and_save`（真实 API）→ 成功写凭证 + `verified_at`
3. **无 key 取数**：data-layer 自动回退 offline（D-014）；`source list` 显示 `path=offline` + "免凭证回退"
4. **凭证故障**：凭证文件存在但解密失败 → `credential_state=unreadable`，状态错误、不回退（AC-004-2）

## 5. 验收对应

| AC | 实现位置 | 验证方式 |
|---|---|---|
| AC-001-1/2/3/4 | `profile.py` | `tests/test_settings_profile.py`：部分保存/读回、邮箱与 sector 校验、缺项判定、无网络（monkeypatch 断网也能读写）、清除档案后凭证仍可用 |
| AC-002-1/2/3/4 | `cli.py` `onboard` | `tests/test_settings_cli.py`：无档案进引导、留空可完成、`--skip` 返回 0、同次运行输入不丢 |
| AC-003-1/2/3/4/5 | `onboarding.py` | `tests/test_settings_onboarding.py`：预填与缺项、验证成功才保存、四类失败分类且不保存、错误消息无 key、清除后 path 变 offline |
| AC-004-1/2/3 | `sources.py` | `tests/test_settings_sources.py`：与 Service 状态一致、三态路径、unreadable 报错 |
| AC-005-1/2/3 | 静态断言 + 目录断言 | `tests/test_settings_privacy.py`：代码无 `register.php` 的 POST、profile/creds 不在 Git、日志与错误无 key 明文 |

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| EIA 注册页改版（字段增减） | 档案字段与 `SECTORS` 为 plan 层清单，改版时同步；`guide_fields` 只做展示，不依赖页面结构 |
| DPAPI 不可用 | fail closed：档案保存/读取失败均报错（复用 creds 语义），不降级明文 |
| 用户把 key 贴进 shell 历史 | CLI 只经 `_read_key`（非终端拒绝），不接受 key 位置参数；文档明示 |
| GUI 未就绪 | 本轮只交付可测试核心 + CLI；视图层随 desktop-shell 接，流程不重复实现 |
| 验证请求被限流 | 429 明确提示"稍后重试"，不保存；不自动重试（交给用户） |

回滚：本 feature 只新增 `profile/` 目录与 `settings` 包，删除即回到 data-layer v23 状态；不修改既有数据。
