# Feature: desktop-shell 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员 A 生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求质量达标，**不代表实施完成，不代表代码通过，不是 Review，不是 Gate 2**。实施者不勾选本文件。
> 审核员 A 为独立会话（与实施隔离），单审，结论即审核结论。

| 项 | 记录 |
|---|---|
| 审核员 A 实际模型 / 通道 | `anthropic/claude-fable-5-1`（官方 API 通道） |
| 路由原因 | `claude-bridge/claude-fable-5-1` 在当前 seven_day 限额窗口内已确认不可用（重置约 2026-10-30）；按 AGENTS §6.5 本窗口不重复探活，直接走 `anthropic` 通道，最小真实调用成功。换通道不是换模型，审核员身份不变。与 Plan 作者（`claude-opus-5-5`）、协调（`openai/gpt-6.1-sol`）、拟定 Implement（`openai/gpt-6-astra`）均不同 |
| 日期 | 2026-10-28 |
| 固定源码基线 | `8ba1b6a304f916e3d57ebdd6b89790b75a15f14c` |
| 审核输入 | 基线 + 冻结的 Plan 修订 2 工作副本（未提交）：`git diff 8ba1b6a -- specs/` 只改 `specs/README.md`（状态行）、`spec.md`（页首 Gate 1 元数据 1 行）、`review.md`（角色/通道表）、`plan.md`（修订 2）；新增 `plan-gaps.md`、`manual-acceptance.md`、`checklist-review-request.md`。源码（`backend/app/*`、`backend/tools/*`、`backend/tests/test_app_*`、`shell/*`）相对基线无改动 |
| 审核范围 | AGENTS §2 第 5 步 Checklist（需求/Plan 质量）。本次在 Plan 修订 2 之后、新 tasks.md 之前进行；tasks.md 仍是历史草稿，Tasks / Analyze 对齐项本轮**一律不勾选**，待 Tasks/Analyze 完成后由 A 独立复查 |
| 当前结论 | **Plan 可进入 Tasks 阶段**，前提是先修 F-01、F-02（P2，Plan 修补，均不需回 Clarify / Gate 1）。无需改 spec 的发现。本结论不认证历史 T-01～T-06 的执行，不代表 Implement 可直接开始（Implement 前置条件 = 本清单全部勾选 + 最终 Analyze 收敛） |

统计：**30 / 41** 项已勾选。未勾选 11 项 = 2 项 P2 Plan 修补（C-21、C-23）+ 3 项 P3 Plan 修补（C-08b、C-14b、C-22）+ 6 项待 Tasks/Analyze 阶段（模板 2 项 + C-28～C-31）。

---

## 需求完整性

- [x] 每条需求都有至少一条可验证的验收规则 —— spec R-001～R-010 共 10 条需求、38 条 AC（直接计数：4+4+4+4+4+4+4+3+4+3），每条 AC 在 plan §9 有独立一行
- [x] 无未澄清歧义（spec.md §5 歧义记录已清零或闭环）—— Q-001～Q-010 均有回答与融入位置；plan-gaps B-01～B-10 的设计分歧全部从 spec/Clarify/docs 推得，C 类"需 Walter 回答"为空，A 复核同意
- [x] 目标与非目标边界清晰 —— 非目标（前端页面、业务 API、agent 能力、多窗口、更新服务端、本地模型）与 plan §1"真实业务边界"、§3.1.5"不挂载 MCP 工具"一致

## 一致性

- [ ] spec / plan / tasks 之间无冲突（Analyze 报告无遗留问题）—— **待 Tasks / 最终 Analyze**。当前 tasks.md 为历史草稿：T-04 `--backend-only`、T-06 `npm run check:ui` 不存在（源码核实：`shell/package.json` 只有 `start/smoke/check`；`shell_check.py` 无 argparse），T-07/T-09/T-10 把人工步骤指向 checklist 的 M-ID，T-10 写 `electron-builder.yml` 而 plan 为 `electron-builder.config.js`。plan-gaps A-15/A-20/E 已给出修法，但未落到 tasks.md
- [x] 与 docs/ 决策与 ADR 无冲突 —— D-001/D-007（Electron + PyInstaller sidecar + electron-builder）、D-010（FastAPI 宿主）、architecture §2（Shell 职责：窗口/托盘/通知/更新/进程守护）、§4.4（用户数据目录含日志）、§5.2（MCP 在 Backend 进程内，由 agent feature 挂载 → plan 只恢复 data-layer 只读通道，B-02 成立）、§9（127.0.0.1 + 令牌）；interaction §3.3 第 6 条"通知节制"与 R-006 的关系按 B-04 处理（系统 toast 非模态、可全局关闭，spec 已冻结）；designUI §3.1"启动：加载页 → 工作台"与 plan §4.1 立即显示启动页一致。未发现需新立 ADR 的决策（只读通道、状态目录拆分、端口 0 均为 spec/Q-001/data-layer 既有契约的落地）

## 可测试性

- [x] 每条验收规则可映射到单元测试或手动验收步骤 —— plan §9 每条 AC 至少有一种：pytest / `node --test` / 真实 Electron e2e / M-ID；plan §9 引用的 M-ID（M-01～M-26）全部存在于 `manual-acceptance.md`；人工步骤未写进本清单
- [ ] 任务粒度与验证命令满足 tasks.md 模板要求 —— **待 Tasks 阶段**。plan-gaps E 的建议拆分（每任务 0.5～2h、完成标准引用 AC、验证命令写 cwd、依赖无环）形式上满足，但新 tasks.md 尚未写出；A 届时复查（见 C-28～C-31）

## 自定义项

### A. 冻结 spec 与范围

- [x] C-01 spec 38 条 AC 与 10 条需求由 A 直接计数核对；plan §9 逐条覆盖，无遗漏、无多算
- [x] C-02 spec 相对基线的差异只有页首 Gate 1 元数据一行（`git diff 8ba1b6a -- specs/desktop-shell/spec.md`），需求、AC、歧义表正文未动；plan 未新增/修改 AC，无偷改需求
- [x] C-03 依赖边界：spec §4 依赖 `frontend-workbench`、`settings`、`data-layer v23`；plan 对三者的处理与 spec 一致——前端产物按"打包时显式指定，否则内置页 + mock"（AC-002-4 / Q-002 明示允许，frontend-workbench 未合入不构成 Plan 阻塞），settings 只做视图宿主（Q-007；settings spec Q-009 分阶段交付已获 Walter 批准），data-layer 只复用现有锁/只读通道/陈旧锁回收，不改其 §3.3 布局内部结构
- [x] C-04 "有 what 无 AC"条目 WO-01～WO-13 找全，A 对照 spec R-001～R-010 的 what 逐句核对未发现遗漏；均已给出覆盖与验证，不构成需求缺口，不需新增 AC

### B. Plan 对源码现状的描述属实（只核对事实，不做代码评审）

- [x] C-05 plan §0、§2 与 plan-gaps A-01～A-19 的源码断言经 A 逐条核实属实：`/health` 恒 `ok`（`Host.ready=True`）；无 MCP/只读通道挂载；`onBackendCrash` 内 `waitForReady()` 无参；`stdio[0]='ignore'`；`spawn` 无 `error` 处理；`mkdirSync` 无异常处理；默认数据目录 `path.join(userData,'FuturesAI')`；`host.json` 写在数据目录根；`will-navigate` 把任意非 `file:` 交给 `openExternal`；`path.resolve(__dirname,'..','frontend','dist')` 查前端；`onboarding.js` 用 `innerHTML` 拼后端字符串且 `#profile-form` 以遮蔽邮箱整体 PUT；`check.js` 单实例断言 `!second.out.includes('READY ') || second.code === 0` 恒真且首实例 `first.kill()`；`shell_check.py` 就绪判据 `bool(info) and proc.poll() is None`；`test_subprocess_listens_on_loopback_only` 在仅回环时不断言；`preload.js` 只有 `backend()` 读固定 argv；`package.json` 无 `check:ui`；`electron` 锁 `33.4.11`

### C. Plan 显式契约

- [x] C-06 启动就绪契约清楚且与 AC-002-2 一致：就绪 = `200 + status=="ok" + data_ready===true`，`/health` 真实探测两库；端点文件/端口可连不算；503 分支与 `reason` 不含输入值
- [x] C-07 mock 与真实边界：`--mock`/`FAI_MODE=mock` 显式进入，后端失败不静默降级（B-10）；作业引擎/agent/真实前端标为【外部】；事件夹具只在 `FAI_TEST_HOOKS=1` 下启用且窗口标题与日志首行带标记；§8.1 三类证据不混用；验收记录不得把夹具结果写成真实作业（§1、§3.5）
- [x] C-08 偏好与数据目录引导：默认 `%LOCALAPPDATA%\FuturesAI`（spec §4）；偏好文件放独立状态目录 `FuturesAI-Shell`（理由成立：偏好记录数据目录位置）；偏好损坏不自动重置、不静默回退；`pendingDataRoot` 可写探测失败 → 明示错误并"继续使用原目录"；不复制/移动/删除原目录（AC-004-4、Q-004、B-06）；偏好里不放凭证/个人信息，不读写 settings 加密档案
- [ ] C-08b（P3）`FAI_DATA_ROOT` 环境变量在打包运行时也优先于用户偏好（§3.6），与"不静默改变数据目录"的精神有张力；建议只在 `!app.isPackaged` 或 `FAI_TEST_HOOKS=1` 时生效。见 F-06
- [x] C-09 生命周期：单一状态机 + 代际 `gen` 解决并发重启；重启预算 3 次、退出码 3 不重启、超时先 kill 再 failed；退出顺序 `stopping → /shutdown → 5s → taskkill /T /F → 删 host.json → cleanExit`；退出守卫 `ask / 等待完成 / 取消退出`，排队项 `cancelled_on_exit`、新到项 `rejected_exiting` 写日志并显示，不静默丢弃（AC-003-1/2/4）；强杀自愈路径（stdin EOF → lifespan 释放锁；双杀 → `_stale` 回收）可追溯到 AC-003-3 并被源码缺陷（孤儿进程）证明为必要
- [x] C-10 通知开关与真实处理器接缝：托盘状态不受 `notifications` 影响（AC-006-3）；通知四类对应 Q-006；通知器/对话框/`openExternal` 只在 `FAI_TEST_SCENARIO` 下替换为记录器，处理器本身是生产代码（AGENTS §5.6）
- [x] C-11 资源失败与重试：`frontend_missing`/`renderer_crashed` 回到启动页并可重试（AC-007-3）；"有意不带前端"与"应有前端但缺失"分开（A-12）；`health_timeout` 页提供重试/查看日志，重试清零预算（AC-007-2、WO-12）；端口 0 策略满足 AC-007-1 的"自动改用其他端口"，显式 `--port` 冲突有 `port_in_use` 标记
- [x] C-12 日志有界与诊断阳性样例：单文件 5 MB × 5 份、总量有上界（AC-010-1）；诊断包按条目白名单生成、永不包含清单明确（Q-010）；AC-009-4 用真实 `creds.put` 写入的哨兵 key、档案邮箱、`docs_in/`/`knowledge/` 文档哨兵与当次令牌做阳性扫描；plan 明确声明"脱敏只是第二层防护，不能保证清除任意内容"，真正保证来自不记载荷 + 白名单
- [x] C-13 外链与远程内容策略：`setWindowOpenHandler`/`will-navigate` 只把 `http(s)` 交系统浏览器，其余拒绝（AC-009-3；收紧现有任意协议外放）；渲染层 `contextIsolation/sandbox/nodeIntegration` 固定；请求白名单挂 `defaultSession` 覆盖 CSP 不受控的前端产物；preload 不暴露 `ipcRenderer`/`shell`/任意 URL/文件系统；内置页改 `textContent`。策略本身清楚；其**验证断言**的问题见 C-21
- [x] C-14 最小设置宿主复用：只复用 settings 现有端点（§3.1.4 端点表按源码改正），新增的 "遮蔽邮箱拒绝回写 → 422" 是入口层校验（AGENTS §5.2），修复 A-10 真实缺陷；不重复实现档案/向导/状态业务逻辑（Q-007）
- [ ] C-14b（P3）请求白名单放行 `http://127.0.0.1:<任意端口>` 的全部资源类型：plan 应明确声明"回环 HTTP 不属于 AC-009-2 的'远程'"，并补 `ws://127.0.0.1:*`（architecture §1 前后端通道含 WebSocket）与 `blob:`（前端产物常用）的取舍；可选把回环放行限定在 `xhr/fetch/websocket` 类 `resourceType`。见 F-04
- [x] C-15 更新：默认 `feedUrl=null` 不检查、不编造服务器；元数据 schema 入口校验、`version` 三段式数值比较；有更新只提示 + 系统浏览器下载 + "稍后"（Q-005，AC-008-2）；离线只记一行日志、无弹窗（AC-008-3）；独立非持久会话发请求且不带用户数据；完整性 = `SHA256SUMS.txt` + 元数据 `sha256/size`（WO-08），签名明确列为 v1 不做
- [x] C-16 打包：lockfile 驱动 `npm ci`、PyInstaller 版本断言、三处 `VERSION` 一致断言；`files` 白名单 + `scan-package.js` 黑/白名单扫描（AC-001-4）；NSIS 按用户安装、`deleteAppDataOnUninstall:false`、`customUnInstall` 只删 `session/run`，保留 `%LOCALAPPDATA%\FuturesAI` 与 `shell-prefs.json`（AC-001-3、B-03）；干净机【外部】、15 s【基准机】、系统通知【安装版人工】三者分开写明，Q-009 过渡验收不冒充干净机

### D. 范围控制（AGENTS §5.1）

- [x] C-17 两项"必要复杂度"可直接追溯：stdin EOF 守护 ← AC-003-3 + 源码孤儿进程事实（A-08）；请求白名单 ← AC-009-2 + 前端产物 CSP 不受控。状态机代际计数 ← A-05 并发缺陷事实。均能说清"具体怎么出错"，不是猜测的竞态/安全框架
- [x] C-18 plan §10"有意不做"清单（IPC 发送方校验、Job Object、元数据签名、应用内下载、目录迁移、日志加密、偏好自动重置、多窗口）取舍合理；plan 与 plan-gaps 均**未**宣称任何 §5.1 批准已取得，只写"如要做需 Walter 先批准"；A 确认本清单亦不替 Walter 授予批准
- [x] C-19 回滚范围限定在 `backend/app/`、`backend/tools/{build_backend,shell_check}.py`、`backend/tests/test_app_*`、`shell/`、`packaging/`，不触及用户数据与其他 feature 目录；settings 文档的 "T-08" 跨引用（A-21）已在 `review.md` 说明，不改 settings 文件

### E. 可测试性细节

- [x] C-20 验证命令的 cwd 与"现有/待新增"标注准确（plan §8.2）：不再引用 `check:ui`、`--backend-only`；现有命令经源码核实存在；`node --test`、`shell/check.js` 场景、`packaging/build.ps1` 均标"待新增/待重构"
- [ ] C-21（P2）**AC-009-2 的 e2e 断言与 CSP 行为矛盾**：plan §9 要求 e2e `csp` "白名单拦截计数 ≥ 3"，但远程 `<script>`/`<iframe>`/`fetch` 若在带 CSP（`default-src 'none'`）的内置页内发起，会被 Chromium 在渲染进程内按 CSP 拦下，根本不会到达 `webRequest.onBeforeRequest`，计数为 0 → 断言为假而策略其实有效。见 F-02
- [ ] C-22（P3）Electron 运行时 Node API 兼容性未在 plan 中说明：`lib/diagnostics.js` 依赖 `zlib.crc32`，该 API 自 Node 20.15 可用，Electron 33.4.11 内嵌 Node 20.18.x 应可用，但 plan 未写明；且 `node --test` 单测跑在构建机 Node 25 下，**不能**证明 Electron 内嵌 Node 的 API 存在，只有真实 Electron e2e（`diagnostics-privacy`）才算证据。见 F-03
- [ ] C-23（P2）**计划新增的 `shell/lib/**` 会被仓库 `.gitignore` 第 17 行 `lib/` 忽略**（`git check-ignore -v shell/lib/backend.js` 命中），plan §3.2、§7.3 `files` 白名单、plan-gaps E 的 T-05b/T-05c/T-07a/T-08a/T-08b/T-09a 全部指向该目录；按现计划实施后这些生产模块无法入库。plan 已注意到 `build/` 被忽略，但漏了 `lib/`。见 F-01
- [x] C-24 测试接缝只在系统边界：`FAI_SHELL_STATE_DIR`/`FAI_DATA_ROOT`/`LOCALAPPDATA` 隔离目录；`FAI_BACKEND_CMD` 替换进程；`FAI_TEST_EVENTS` 替换事件来源；`FAI_TEST_SCENARIO` 替换对话框/通知器/`openExternal`；`FAI_UPDATE_FEED_URL` 仅回环；pytest 在访问层/文件系统/网络边界注入异常。真实后端 e2e 覆盖就绪/退出/锁/强杀/崩溃/引导/通道/诊断。`check.js` 启动前校验两个隔离变量指向临时目录（修复 A-16 使用真实用户目录）
- [x] C-25 AC-009-1 改用 `netstat -ano -p TCP` 按 pid 断言监听地址，不再依赖本机是否有非回环地址（修复 A-17）；AC-002-2 的 `shell_check.py` 加强为"必须看到健康检查成功"（修复 A-14）

### F. 边界诚实与证据分类

- [x] C-26 夹具驱动的 AC（AC-003-2/4、AC-006-1/2/4）在 plan §9"外部/诚实状态"列明确标注"夹具驱动；真实作业【外部】"；后端 drain 留给 workflow feature（D-02）；未把夹具结论写成真实业务已验证
- [x] C-27 外部证据缺口（plan-gaps D-01～D-10：前端产物、作业引擎、`window.futuresai` 采纳、发布通道、干净机、基准机、真实 EIA key、系统通知观感、真实满盘、签名）逐项列出并给出"何时补"，不作为需求质量失败，也不冒充已取得
- [x] C-28a 人工步骤全部在 `manual-acceptance.md`（M-01～M-26，无复选框，带环境标签与证据类别），本清单不含 M-ID 复选框；历史 T-01～T-06 的 ✅ 被 plan-gaps 与 review.md 定位为"阶段证据，待纠偏后复验"，本清单不认证其回溯执行

### G. 待 Tasks / Analyze 阶段（本轮不勾选，A 届时独立复查）

- [ ] C-28 新 tasks.md 承载全部 38 AC + WO-01～WO-13，每任务完成标准引用 AC 编号，验证命令与完成标准一一对应且 cwd 正确（plan-gaps F-1/F-2）
- [ ] C-29 每任务 ≤ 2 h、依赖无环；plan-gaps E 中 T-01b（5 条 AC + 新测试文件，估 2h）、T-10c（含人工 M-01～M-04，估 1～2h）有超时风险，Tasks 阶段应复核或再拆
- [ ] C-30 夹具/外部类 AC 的完成标准不写成"真实业务已验证"；人工步骤只引用 `manual-acceptance.md` 的 M-ID；plan §10"有意不做"项未混入 tasks（plan-gaps F-4/F-5/F-6）
- [ ] C-31 旧 tasks.md 进度表的 ✅ 改写为"阶段证据，待纠偏任务完成后复验"；F-01/F-02 的修补已反映到相应任务的文件路径与验证断言

---

## 发现（Findings）

严重度：P1 = 阻塞 Tasks；P2 = 进入 Implement 前必须修；P3 = 可作为后续任务/Plan 小修。
类别：(a) 需改 spec、回 Clarify / Gate 1；(b) Plan 修补；(c) 待 Tasks/Analyze 对齐；(d) 仅外部验收缺口。

**(a) 需回 Clarify / Gate 1 的 spec 变更：无。** 所有分歧均可由冻结 spec、Q-001～Q-010 与 docs 解决。

### (b) Plan 修补

| # | 级别 | 影响 AC / 位置 | 发现 | 最小修法 |
|---|---|---|---|---|
| F-01 | **P2** | 全部 `shell/lib/**` 落点：plan §3.2 表、§7.3 `files`、§10 回滚范围；plan-gaps E T-05b/05c/07a/08a/08b/09a；间接影响 AC-002-3、AC-004-4、AC-006-x、AC-008-x、AC-010-x | 仓库 `.gitignore` 第 17 行 `lib/`（无前导 `/`，匹配任意层级）会忽略 `shell/lib/`；`git check-ignore -v shell/lib/backend.js` 命中。按现计划实施，生产模块不会被提交，Review 的真实 diff 将看不到它们 | 二选一并写进 plan：① 将目录改名（如 `shell/src/`），同步 §3.2、§7.3 白名单与 plan-gaps E 路径；② 在 `.gitignore` **追加** `!shell/lib/` 否定规则（只追加，不删除既有锚点，符合 AGENTS §4）。A 倾向 ①，避免触碰全局 ignore |
| F-02 | **P2** | AC-009-2；plan §9 该行"自动验证"；§3.4 | e2e `csp` 要求"页面内尝试远程 `<script>`/`<iframe>`/`fetch` → 白名单拦截计数 ≥ 3"。若在带 CSP 的内置页发起，CSP 在渲染进程内先行拦截，请求不会到达 `webRequest.onBeforeRequest`，计数为 0，断言失败但策略有效；若实施者为凑数放宽 CSP 或断言，反而削弱 AC-009-2 | 把 `csp` 场景拆成两段并写明：①在**无 CSP** 的夹具页（可复用 `test/fixtures/frontend-stub/`，不加 CSP meta）发起三类远程请求，断言 `webRequest` 拦截计数 ≥ 3 且页面侧 `onerror`/失败回调触发——这证明白名单对前端产物有效；②在内置页断言 `securitypolicyviolation` 事件（或资源 `onerror`）≥ 3，**不**要求 `webRequest` 计数——这证明 CSP 有效。两段都不需要网络 |
| F-03 | P3 | AC-010-2、AC-009-4；plan §3.2 `lib/diagnostics.js`、§8.2 `test:unit` | plan 选 `zlib.crc32` 写 ZIP。该 API 自 Node 20.15 起可用，Electron 33.4.11 内嵌 Node 20.18.x，应可用，但 plan 未写明依据；且 `node --test` 单测在构建机 Node 25 下运行，不能证明 Electron 内嵌 Node 的 API 存在 | plan §1 或 §3.2 补一句"Electron 33.4.11 内嵌 Node 20.18.x；`zlib.crc32` 自 Node 20.15 可用"，并在 §8.1 注明纯模块单测不证明 Electron 运行时 API，`diagnostics-privacy` e2e（真实 Electron）才是 ZIP 写出的运行时证据；可选在该 e2e 里断言 ZIP 能被系统 `tar.exe` 解压（plan 已有）即视为覆盖 |
| F-04 | P3 | AC-009-2、WO-10；plan §3.4 | 白名单放行 `http://127.0.0.1:*` 全部资源类型（含 script/iframe）。回环不是"远程"，AC-009-2 不被违反，但 plan 应**明示**这一解释；另：architecture §1 前后端通道含 WebSocket，`ws://127.0.0.1:*` 未在放行名单内；前端产物常用 `blob:` 也未列 | §3.4 补：①声明回环 HTTP 不属于 AC-009-2 的"远程"；②放行名单加 `ws://127.0.0.1:*` 与 `blob:`（或写明有意不放行及理由）；③可选：回环放行限定 `resourceType ∈ {xhr, fetch, websocket, mainFrame(file)}`，拒绝回环 script/subFrame——这是对同一 AC 的收紧，不是新安全机制；是否采纳由 Plan 决定，不需 Walter 批准 |
| F-05 | P3 | AC-008-2；plan §3.6 schema | `dismissedUpdate` 写入持久化的 `shell-prefs.json`，却注明"仅本次运行内有效，启动时清空"——持久化无意义且多一次写盘（ENOSPC 面） | 从 schema 移除，改为主进程内存状态；或改语义为跨运行有效并同步 §3.8"稍后"的描述（二者取一，保持一致） |
| F-06 | P3 | AC-004-4、R-004；plan §3.6 "开发/测试覆盖" | `FAI_DATA_ROOT` 优先级高于用户偏好且在打包运行时同样生效；若该变量意外存在于用户环境，会静默改变数据目录，与 R-004"不静默"精神有张力 | 限定为 `!app.isPackaged \|\| FAI_TEST_HOOKS=1` 时生效，否则记一行日志并忽略 |
| F-07 | P3 | AC-010-1；plan §5、§3.7 | 日志目录命名 `logs/`，architecture §4.4 目录图写的是 `log`。不冲突于 spec，但两处不一致 | plan §5 注明与 architecture §4.4 的命名对应（或 Plan 角色提请协调者在 docs 里统一为 `logs`，一行改动，不需 ADR） |

### (c) 待 Tasks / Analyze 对齐（本轮不作为 Plan 缺陷）

| # | 内容 |
|---|---|
| F-08 | 旧 tasks.md：T-04 `--backend-only`、T-06 `check:ui` 不存在；T-07/T-09/T-10 把人工步骤指向 checklist 的 M-ID（应指向 `manual-acceptance.md`）；T-10 的 `electron-builder.yml` 与 plan `electron-builder.config.js` 不一致；进度表 ✅ 需改写为"阶段证据，待复验"。按 plan-gaps A-15/A-20/E/F 在新 tasks.md 修 |
| F-09 | plan-gaps E 的 T-01b、T-10c 估时贴近/可能超过 2h 上限（C-29），Tasks 阶段复核 |
| F-10 | F-01 的路径决定与 F-02 的断言拆分必须先定稿，再写 tasks，否则 tasks 会继承错误路径/断言 |

### (d) 仅外部验收缺口（不是需求质量失败）

干净机安装（AC-001-1）、基准机 15 s（AC-001-2）、真实系统通知观感（AC-006-2）、真实作业引擎与后端 drain（AC-003-2/4、AC-006-1/4）、真实发布通道（AC-008-2）、真实 EIA key（AC-005-3）、真实满盘（AC-007-4）、`window.futuresai` 被前端采纳（AC-002-4）——plan-gaps D-01～D-10 已如实列出，Handoff 时须按 §8.1 标"未取得"。

---

## 协调者关注点的独立核验结论

1. **`zlib.crc32` vs Electron 33 / 构建机 Node 25**：成立为 P3（F-03）——运行时 Node 20.18.x 有该 API，但 plan 需写明依据并区分单测环境与运行时证据。
2. **CSP 先于 `webRequest` 拦截导致计数断言为假**：成立为 P2（F-02）——plan §9 现断言在内置页上不可能满足；需按无 CSP 夹具页 + CSP 违规事件两段式重写。
3. **回环白名单允许远程脚本/iframe 问题**：不成立为 AC-009-2 违反（回环非远程），但 plan 应明示解释并补 `ws:`/`blob:` 取舍（P3，F-04）。
4. **AGENTS §5.1**：plan 内所有新增机制均可追溯到冻结 AC 或已核实的源码缺陷（C-17）；plan §10 列出的扩展项均未被声称已批准，本清单亦未授予任何批准（C-18）。

## 结论

- 需求质量：**基本达标**。spec 冻结、38 AC 全覆盖、边界诚实、范围受控；2 项 P2（F-01 `.gitignore` 吞掉 `shell/lib/`；F-02 AC-009-2 断言与 CSP 行为矛盾）需 Plan 修补后再写 tasks，均不需回 Clarify / Gate 1。
- **Tasks 可以在 F-01、F-02 修补后开始**；最终 Analyze 完成后，A 复查 C-28～C-31 与模板中两项待定项，并复核 F-03～F-07 的处理。
- 本文件**不是** Gate 2，**不是**代码通过结论，**不**认证历史 T-01～T-06 的执行。
