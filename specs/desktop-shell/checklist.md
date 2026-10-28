# Feature: desktop-shell 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员 A 生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求质量达标，**不代表实施完成，不代表代码通过，不是 Review，不是 Gate 2**。实施者不勾选本文件。
> 审核员 A 为独立会话（与实施隔离），单审，结论即审核结论。

| 项 | 记录 |
|---|---|
| 审核员 A 实际模型 / 通道 | `anthropic/claude-fable-5-1`（官方 API 通道），两轮相同 |
| 路由原因 | `claude-bridge/claude-fable-5-1` 在当前 seven_day 限额窗口内已确认不可用（重置约 2026-10-30）；按 AGENTS §6.5 本窗口不重复探活，直接走 `anthropic` 通道，最小真实调用成功。换通道不是换模型，审核员身份不变。与 Plan/Tasks/Analyze 作者（`claude-opus-5-5`）、协调（`openai/gpt-6.1-sol`）、拟定 Implement（`openai/gpt-6-astra`）均不同 |
| 日期 | 初轮 2026-10-28（Plan 修订 2 之后）；**复查轮 2026-10-28（Plan 修订 3 + tasks.md 重写 + Analyze 迭代 6 之后，新开独立会话）** |
| 固定源码基线 | `8ba1b6a304f916e3d57ebdd6b89790b75a15f14c`（分支 `review/desktop-shell-checklist`） |
| 审核输入（复查轮） | 基线 + 协调者冻结的**未提交**规划工作副本（不是集成提交）：`git diff 8ba1b6a -- specs/` 只改 `specs/README.md`（状态行）、`spec.md`（页首 Gate 1 元数据 1 行）、`review.md`、`plan.md`（修订 3）、`tasks.md`（重写）；新增 `analyze.md`、`plan-gaps.md`、`manual-acceptance.md`、`checklist-review-request.md`。`git diff --stat 8ba1b6a -- backend shell packaging docs .gitignore` 为空（A 复核）：源码、docs、`.gitignore` 相对基线无改动；`git diff --check` 无空白错误 |
| 审核范围 | AGENTS §2 第 5 步 Checklist（需求 / Plan / Tasks 质量）。复查轮：独立复核初轮 F-01～F-10 的处置是否成立、Tasks/Analyze 对齐项（C-28～C-31 与模板两项）、协调者提出的验收循环 / 打包自举 / AC 引用问题、AC-005-3 逐子句追溯。只做文件阅读、`git`/`rg`/`check-ignore` 静态核查与 tasks.md 结构脚本统计；**未运行任何测试、构建、安装或 npm 命令** |
| 当前结论 | **Checklist 通过（全部 41/41）**。冻结 spec / plan 修订 3 / tasks（41 个任务）/ analyze 迭代 6 的文档前置条件满足，可交 `openai/gpt-6-astra` 进入 Implement（实施前须重读本文件全部复选框）。本结论**不**认证历史 T-01～T-06 的执行，**不**代表任何代码已实现或测试已通过，**不是** Converge / Review / Gate 2；干净机、基准机、真实作业引擎、真实前端、真实发布通道、真实 EIA key、系统通知观感等外部 / 人工证据仍未取得 |

统计：**41 / 41** 项已勾选（A 直接计数复选框）。初轮为 30 / 41；复查轮勾选的 11 项 = C-08b、C-14b、C-21、C-22、C-23（F-01～F-07 修补成立）+ 模板"spec/plan/tasks 无冲突""任务粒度与验证命令"+ C-28～C-31（Tasks/Analyze 对齐）。各项勾选依据写在条目内"复查："之后。

---

## 需求完整性

- [x] 每条需求都有至少一条可验证的验收规则 —— spec R-001～R-010 共 10 条需求、38 条 AC（直接计数：4+4+4+4+4+4+4+3+4+3），每条 AC 在 plan §9 有独立一行。复查：spec 正文未变，计数不变
- [x] 无未澄清歧义（spec.md §5 歧义记录已清零或闭环）—— Q-001～Q-010 均有回答与融入位置；plan-gaps B-01～B-10 的设计分歧全部从 spec/Clarify/docs 推得，C 类"需 Walter 回答"为空，A 复核同意。复查：Analyze 迭代 1～6 均未产生需回 Clarify 的发现，A 同意
- [x] 目标与非目标边界清晰 —— 非目标（前端页面、业务 API、agent 能力、多窗口、更新服务端、本地模型）与 plan §1"真实业务边界"、§3.1.5"不挂载 MCP 工具"一致

## 一致性

- [x] spec / plan / tasks 之间无冲突（Analyze 报告无遗留问题）—— 初轮待定（旧 tasks.md 为历史草稿）。**复查**：新 tasks.md 为 41 个任务；A 用脚本按"完成标准"段统计：38 条 AC 全部至少有 1 个任务承载，WO-01/02/04～13 均有任务，WO-03 有意无新任务（沿用 data-layer `stale_running()` 与现有回归命令，tasks"不在本 feature 任务内"段写明）；任务体中 `check:ui`、`--backend-only`、`npm run smoke`、`shell/lib`、`FAI_TEST_CONTROL_TOKEN`、`zlib.crc32`（作为依赖）均无命中，仅作历史/退役文本；人工步骤只引用 `manual-acceptance.md` 的 M-ID（tasks 引用的 M-ID 全部存在于该文件）；e2e 场景名与 plan §9/§8.3 一致（37 个场景均有创建任务）；`electron-builder.config.js` 与 plan §7.3 一致。analyze.md 迭代 6 的"文档一致性通过"与 A 的独立核对一致，且迭代 1/3/5 的未通过结论如实保留。无遗留 P1/P2
- [x] 与 docs/ 决策与 ADR 无冲突 —— D-001/D-007（Electron + PyInstaller sidecar + electron-builder）、D-010（FastAPI 宿主）、architecture §2（Shell 职责：窗口/托盘/通知/更新/进程守护）、§4.4（用户数据目录含日志）、§5.2（MCP 在 Backend 进程内，由 agent feature 挂载 → plan 只恢复 data-layer 只读通道，B-02 成立）、§9（127.0.0.1 + 令牌）；interaction §3.3 第 6 条"通知节制"与 R-006 的关系按 B-04 处理（系统 toast 非模态、可全局关闭，spec 已冻结）；designUI §3.1"启动：加载页 → 工作台"与 plan §4.1 立即显示启动页一致。未发现需新立 ADR 的决策（只读通道、状态目录拆分、端口 0 均为 spec/Q-001/data-layer 既有契约的落地）。复查：修订 3 把日志目录改为 `log\`，与 architecture §1 存储图（第 35 行 `… creds/ log`）一致；新端点 `GET /settings/registration-guide` 是对 settings 核心的只读暴露，属 R-005 / Q-007"复用核心、外壳只做视图"，不需 ADR

## 可测试性

- [x] 每条验收规则可映射到单元测试或手动验收步骤 —— plan §9 每条 AC 至少有一种：pytest / `node --test` / 真实 Electron e2e / M-ID；plan §9 引用的 M-ID（M-01～M-26）全部存在于 `manual-acceptance.md`；人工步骤未写进本清单
- [x] 任务粒度与验证命令满足 tasks.md 模板要求 —— 初轮待定。**复查**：41 个任务估时均在 0.5～2h（脚本核对，合计 60.5h；执行顺序表与任务体估时一致）；每个任务含上下文、修改范围、估时、完成标准、验证；**每个任务块的每一条完成标准都含 `AC-xxx-y`**（脚本逐条核对，无例外；基础设施任务 T-05d/T-05e/T-05m 写"最近 AC"并明言不证明产品 AC），完成标准与验证条数一一对应；验证命令 cwd 均写明（`cd backend` / `cd shell` / 仓库根目录）且与 plan §8.2 的"现有 / 待新增"标注一致；执行顺序表 41 行无前向依赖、无环（任务体"依赖"与顺序表一致，T-04b 的"T-01b～T-03c"区间写法与 T-05i 的"已含 T-02b"括注为同义表述）

## 自定义项

### A. 冻结 spec 与范围

- [x] C-01 spec 38 条 AC 与 10 条需求由 A 直接计数核对；plan §9 逐条覆盖，无遗漏、无多算
- [x] C-02 spec 相对基线的差异只有页首 Gate 1 元数据一行（`git diff 8ba1b6a -- specs/desktop-shell/spec.md`），需求、AC、歧义表正文未动；plan 未新增/修改 AC，无偷改需求。复查：仍只有该一行差异；修订 3 与新 tasks 未新增 AC（`AC-003-5` 只在 spec §4 指 settings 的 AC，不计入）
- [x] C-03 依赖边界：spec §4 依赖 `frontend-workbench`、`settings`、`data-layer v23`；plan 对三者的处理与 spec 一致——前端产物按"打包时显式指定，否则内置页 + mock"（AC-002-4 / Q-002 明示允许，frontend-workbench 未合入不构成 Plan 阻塞），settings 只做视图宿主（Q-007；settings spec Q-009 分阶段交付已获 Walter 批准），data-layer 只复用现有锁/只读通道/陈旧锁回收，不改其 §3.3 布局内部结构
- [x] C-04 "有 what 无 AC"条目 WO-01～WO-13 找全，A 对照 spec R-001～R-010 的 what 逐句核对未发现遗漏；均已给出覆盖与验证，不构成需求缺口，不需新增 AC

### B. Plan 对源码现状的描述属实（只核对事实，不做代码评审）

- [x] C-05 plan §0、§2 与 plan-gaps A-01～A-19 的源码断言经 A 逐条核实属实：`/health` 恒 `ok`（`Host.ready=True`）；无 MCP/只读通道挂载；`onBackendCrash` 内 `waitForReady()` 无参；`stdio[0]='ignore'`；`spawn` 无 `error` 处理；`mkdirSync` 无异常处理；默认数据目录 `path.join(userData,'FuturesAI')`；`host.json` 写在数据目录根；`will-navigate` 把任意非 `file:` 交给 `openExternal`；`path.resolve(__dirname,'..','frontend','dist')` 查前端；`onboarding.js` 用 `innerHTML` 拼后端字符串且 `#profile-form` 以遮蔽邮箱整体 PUT；`check.js` 单实例断言 `!second.out.includes('READY ') || second.code === 0` 恒真且首实例 `first.kill()`；`shell_check.py` 就绪判据 `bool(info) and proc.poll() is None`；`test_subprocess_listens_on_loopback_only` 在仅回环时不断言；`preload.js` 只有 `backend()` 读固定 argv；`package.json` 无 `check:ui`；`electron` 锁 `33.4.11`。复查新增 A-22 亦属实：`shell/renderer/onboarding.js:79` `renderPrefill(profile)` 用 `GET /settings/profile` 的遮蔽结果自拼 4 行（Email 为遮蔽值、`Category` 显示 `profile.sector` 的 key、无 Reason for use、不读 `missing_for_registration`）；`backend/app/main.py` 无 `prepare` / `registration_hint` 路由；而 `backend/settings/onboarding.py` 的 `prepare()` 返回 `{missing, prefill, hint}`、`guide_fields()` 五项（Category 用 `SECTORS` 官方标签、含 `reason_for_use`）、`registration_hint()` 返回 `{url, notes}`

### C. Plan 显式契约

- [x] C-06 启动就绪契约清楚且与 AC-002-2 一致：就绪 = `200 + status=="ok" + data_ready===true`，`/health` 真实探测两库；端点文件/端口可连不算；503 分支与 `reason` 不含输入值
- [x] C-07 mock 与真实边界：`--mock`/`FAI_MODE=mock` 显式进入，后端失败不静默降级（B-10）；作业引擎/agent/真实前端标为【外部】；事件夹具只在 `FAI_TEST_HOOKS=1` 下启用且窗口标题与日志首行带标记；§8.1 三类证据不混用；验收记录不得把夹具结果写成真实作业（§1、§3.5）。复查：`FAI_TEST_EVENTS` 已统一为**唯一**协议（UTF-8 JSON 事件数组文件的绝对路径；非法 → 退出码 4 + `TEST_EVENTS_INVALID`），plan §3.5/§8.3、manual-acceptance 页首与 M-05～M-08、tasks T-07a 三处一致
- [x] C-08 偏好与数据目录引导：默认 `%LOCALAPPDATA%\FuturesAI`（spec §4）；偏好文件放独立状态目录 `FuturesAI-Shell`（理由成立：偏好记录数据目录位置）；偏好损坏不自动重置、不静默回退；`pendingDataRoot` 可写探测失败 → 明示错误并"继续使用原目录"；不复制/移动/删除原目录（AC-004-4、Q-004、B-06）；偏好里不放凭证/个人信息，不读写 settings 加密档案
- [x] C-08b（初轮 P3，F-06）`FAI_DATA_ROOT` 在打包运行时也优先于用户偏好 —— **复查已闭合**：plan §3.6"开发/测试覆盖"改为仅 `!app.isPackaged || FAI_TEST_HOOKS=1` 时生效，否则记一行日志 `FAI_DATA_ROOT ignored (packaged)` 并忽略；`FAI_SHELL_STATE_DIR` 同门槛；tasks T-05b 完成标准 1 / T-05c 完成标准 2 与单测 `打包且无钩子时忽略 FAI_DATA_ROOT` 承载
- [x] C-09 生命周期：单一状态机 + 代际 `gen` 解决并发重启；重启预算 3 次、退出码 3 不重启、超时先 kill 再 failed；退出顺序 `stopping → /shutdown → 5s → taskkill /T /F → 删 host.json → cleanExit`；退出守卫 `ask / 等待完成 / 取消退出`，排队项 `cancelled_on_exit`、新到项 `rejected_exiting` 写日志并显示，不静默丢弃（AC-003-1/2/4）；强杀自愈路径（stdin EOF → lifespan 释放锁；双杀 → `_stale` 回收）可追溯到 AC-003-3 并被源码缺陷（孤儿进程）证明为必要
- [x] C-10 通知开关与真实处理器接缝：托盘状态不受 `notifications` 影响（AC-006-3）；通知四类对应 Q-006；通知器/对话框/`openExternal` 只在 `FAI_TEST_SCENARIO` 下替换为记录器，处理器本身是生产代码（AGENTS §5.6）
- [x] C-11 资源失败与重试：`frontend_missing`/`renderer_crashed` 回到启动页并可重试（AC-007-3）；"有意不带前端"与"应有前端但缺失"分开（A-12）；`health_timeout` 页提供重试/查看日志，重试清零预算（AC-007-2、WO-12）；端口 0 策略满足 AC-007-1 的"自动改用其他端口"，显式 `--port` 冲突有 `port_in_use` 标记
- [x] C-12 日志有界与诊断阳性样例：单文件 5 MB × 5 份、总量有上界（AC-010-1）；诊断包按条目白名单生成、永不包含清单明确（Q-010）；AC-009-4 用真实 `creds.put` 写入的哨兵 key、档案邮箱、`docs_in/`/`knowledge/` 文档哨兵与当次令牌做阳性扫描；plan 明确声明"脱敏只是第二层防护，不能保证清除任意内容"，真正保证来自不记载荷 + 白名单。复查：注册指引载荷（含真实邮箱）明确不入日志（§3.1.7）、不进诊断包（§3.7 白名单），`diagnostics-privacy` 流程含打开指引后再扫描邮箱哨兵
- [x] C-13 外链与远程内容策略：`setWindowOpenHandler`/`will-navigate` 只把 `http(s)` 交系统浏览器，其余拒绝（AC-009-3；收紧现有任意协议外放）；渲染层 `contextIsolation/sandbox/nodeIntegration` 固定；请求白名单挂 `defaultSession` 覆盖 CSP 不受控的前端产物；preload 不暴露 `ipcRenderer`/`shell`/任意 URL/文件系统；内置页改 `textContent`。策略本身清楚；其验证断言见 C-21（已闭合）
- [x] C-14 最小设置宿主复用：只复用 settings 现有端点（§3.1.4 端点表按源码改正），新增的 "遮蔽邮箱拒绝回写 → 422" 是入口层校验（AGENTS §5.2），修复 A-10 真实缺陷；不重复实现档案/向导/状态业务逻辑（Q-007）。复查：修订 3 新增 `GET /settings/registration-guide` 只读、原样返回核心 `prepare(root).detail` 与 `registration_hint().detail`，宿主不拼装、不做业务判断——A 对照源码确认其契约 `{missing, hint, prefill:[{label,value}], submit:{url, notes}}` 与核心返回形状一致，且删除内置页自拼的 `renderPrefill`，是**消除**重复实现而非新增
- [x] C-14b（初轮 P3，F-04）回环放行范围、`ws:`/`blob:` —— **复查已闭合**：plan §3.4 明示"回环本机服务不属于 AC-009-2 所说的远程内容"；回环 `http`/`ws` 仅放行 `resourceType ∈ {xhr, webSocket}`（回环 `script`/`subFrame`/`mainFrame`/`stylesheet`/`image` 拒绝）；`blob:` 放行；`localhost` 写法拒绝；更新检查走独立内存分区 `fai-update` 不受白名单影响（§3.8），避免 https 更新源被渲染层规则误拦。e2e `csp` 以"回环脚本被拒"+"回环 `fetch /ok` 200"正反对照验证。无超出冻结 AC 的新机制
- [x] C-15 更新：默认 `feedUrl=null` 不检查、不编造服务器；元数据 schema 入口校验、`version` 三段式数值比较；有更新只提示 + 系统浏览器下载 + "稍后"（Q-005，AC-008-2）；离线只记一行日志、无弹窗（AC-008-3）；独立非持久会话发请求且不带用户数据；完整性 = `SHA256SUMS.txt` + 元数据 `sha256/size`（WO-08），签名明确列为 v1 不做。复查（F-05）："稍后"的版本号改为主进程内存状态，已从 `shell-prefs.json` schema 移除，§3.6 与 §3.8 一致
- [x] C-16 打包：lockfile 驱动 `npm ci`、PyInstaller 版本断言、三处 `VERSION` 一致断言；`files` 白名单 + `scan-package.js` 黑/白名单扫描（AC-001-4）；NSIS 按用户安装、`deleteAppDataOnUninstall:false`、`customUnInstall` 只删 `session/run`，保留 `%LOCALAPPDATA%\FuturesAI` 与 `shell-prefs.json`（AC-001-3、B-03）；干净机【外部】、15 s【基准机】、系统通知【安装版人工】三者分开写明，Q-009 过渡验收不冒充干净机。复查：打包自举顺序已理顺——`build.ps1` 第 5 步生成 `shell/dist/staging/app-config.json`（`git check-ignore` 确认 `shell/dist/` 被忽略，生成物不入库、不手改）后第 6 步才首次 `npm run dist`，第 7 步扫描真实 `dist/win-unpacked`；T-10a 只写配置并以 `builder-config.test.js` 读取真实配置自证，T-10b 只用临时目录夹具验收扫描器；M-03 以实际所选安装目录（M-01 记录 / 注册表 `UninstallString`）为准，不写死默认路径

### D. 范围控制（AGENTS §5.1）

- [x] C-17 两项"必要复杂度"可直接追溯：stdin EOF 守护 ← AC-003-3 + 源码孤儿进程事实（A-08）；请求白名单 ← AC-009-2 + 前端产物 CSP 不受控。状态机代际计数 ← A-05 并发缺陷事实。均能说清"具体怎么出错"，不是猜测的竞态/安全框架。复查：迭代 3 后新增的 `bootstrap(app, env)` 是对现有启动代码的抽取（为可单测、消除验收循环），`GET /settings/registration-guide` 在 AC-005-3 冻结范围内；测试控制通道的随机令牌已被**删除**（AN3-05），A 同意"A 不能替 Walter 授予工程批准"的处理；本清单未授予任何 §5.1 批准，也未发现未经批准的扩展
- [x] C-18 plan §10"有意不做"清单（IPC 发送方校验、Job Object、元数据签名、应用内下载、目录迁移、日志加密、偏好自动重置、多窗口）取舍合理；plan 与 plan-gaps 均**未**宣称任何 §5.1 批准已取得，只写"如要做需 Walter 先批准"；A 确认本清单亦不替 Walter 授予批准。复查：tasks"不在本 feature 任务内"段逐项列出这些项不进入任何任务
- [x] C-19 回滚范围限定在 `backend/app/`、`backend/tools/{build_backend,shell_check}.py`、`backend/tests/test_app_*`、`shell/`、`packaging/`，不触及用户数据与其他 feature 目录；settings 文档的 "T-08" 跨引用（A-21）已在 `review.md` 说明，不改 settings 文件。复查：41 个任务的修改范围全部落在上述目录内（`backend/tests/test_app_settings_api.py` 新增类、`backend/tests/test_app_{startup_errors,channel,disk_full}.py` 新文件均匹配 `test_app_*`）

### E. 可测试性细节

- [x] C-20 验证命令的 cwd 与"现有/待新增"标注准确（plan §8.2）：不再引用 `check:ui`、`--backend-only`；现有命令经源码核实存在；`node --test`、`shell/check.js` 场景、`packaging/build.ps1` 均标"待新增/待重构"。复查：tasks 页首与每条验证均标"待新增"，明言 Implement 前不存在、未运行；`npm run dist` 只出现在 T-10c 的 `build.ps1` 内；A 在本机确认 `C:\Windows\System32\tar.exe` 为 bsdtar 3.8.9、git-bash `tar` 为 GNU tar 1.35，plan/tasks 统一写绝对路径 `%SystemRoot%\System32\tar.exe` 的处理正确（AN1-01）
- [x] C-21（初轮 **P2**，F-02）AC-009-2 的 e2e 断言与 CSP 行为矛盾 —— **复查已闭合**：plan §9 AC-009-2 / §3.4 / tasks T-08e 改为两段、各自独立证明一层：①无 CSP 的 `frontend-stub`（模拟前端产物）在页面内发起远程 `<script>`/`<iframe>`/`fetch` 与回环 `<script>` → 以回环夹具服务（`remote.fai.test` 经 `host-resolver-rules` 映射到 127.0.0.1）的**真实命中数 = 0**、`window.__remoteExecuted` 未定义、iframe 未加载为证据；②有 CSP 的内置引导页（真实后端）同样远程命中 = 0。两段都配**正对照**（回环 `fetch /ok` 200 且恰命中 1 次、经 `getBackend()` 的 `/health` 200、内置页带令牌 XHR 加载组织类型下拉），证明放行路径没有被一并堵死。**不**断言 `webRequest` 拦截计数，不要求在 CSP 已拦截时仍发生拦截。无外网依赖
- [x] C-22（初轮 P3，F-03）Electron 运行时 Node API —— **复查已闭合**：plan 改为不依赖 `zlib.crc32`，`src/diagnostics.js` 用 `zlib.deflateRawSync` + 模块内 CRC-32 查表（零新增运行时依赖），单测用标准向量 `"123456789" → cbf43926`；plan §1/§8.1 明示 `node --test` 跑在构建机 Node 25、不能证明 Electron 运行时 API，运行时证据只认真实 Electron 的 `diagnostics-privacy`（bsdtar 解压校验 CRC，快照记录 `versions.node`）；tasks T-08c/T-08d 对应
- [x] C-23（初轮 **P2**，F-01）`shell/lib/**` 被 `.gitignore` 第 17 行 `lib/` 忽略 —— **复查已闭合**：plan §3.2 改为 `shell/src/`（并写明理由），§7.3 `files` 白名单为 `src/**`，§10 新增"提交前 `git status --short --ignored` 核对"风险行；tasks 全部任务路径为 `shell/src/*`，`shell/lib` 零命中。A 用 `git check-ignore -v` 核对：`shell/src/backend.js`、`shell/src/paths.js`、`shell/test/unit/*.test.js`、`shell/test/e2e/index.js`、`shell/test/fixtures/fake_backend.py`、`shell/test/fixtures/runner/ok/*`、`shell/installer/installer.nsh`、`shell/tools/scan-package.js`、`shell/electron-builder.config.js`、`shell/renderer/startup.js`、`packaging/build.ps1`、`backend/tests/test_app_channel.py` 均**不被忽略**；仅 `shell/dist/staging/app-config.json` 被第 242 行 `shell/dist/` 忽略，而它本就是构建生成物（plan §7.2"生成物不提交、不手改"）。`.gitignore` 锚点未被要求移除
- [x] C-24 测试接缝只在系统边界：`FAI_SHELL_STATE_DIR`/`FAI_DATA_ROOT`/`LOCALAPPDATA` 隔离目录；`FAI_BACKEND_CMD` 替换进程；`FAI_TEST_EVENTS` 替换事件来源；`FAI_TEST_SCENARIO` 替换对话框/通知器/`openExternal`；`FAI_UPDATE_FEED_URL` 仅回环；pytest 在访问层/文件系统/网络边界注入异常。真实后端 e2e 覆盖就绪/退出/锁/强杀/崩溃/引导/通道/诊断。`check.js` 启动前校验两个隔离变量指向临时目录（修复 A-16 使用真实用户目录）。复查：`bootstrap` 单测只在 Electron 边界注入记录型 `app`，路径/偏好/探测走真实实现；假后端 `fake_backend.py` 只实现宿主命令行/端点文件/标记行/stdin EOF 契约与 `/health`、`/shutdown`、`GET /settings/profile` 的 `onboarding` 形状，不含业务逻辑；控制通道只调用生产函数；`TestRegistrationGuide` 用真实 settings 核心 + 真实加密档案夹具且期望值写字面量，不在测试里复算核心逻辑
- [x] C-25 AC-009-1 改用 `netstat -ano -p TCP` 按 pid 断言监听地址，不再依赖本机是否有非回环地址（修复 A-17）；AC-002-2 的 `shell_check.py` 加强为"必须看到健康检查成功"（修复 A-14）

### F. 边界诚实与证据分类

- [x] C-26 夹具驱动的 AC（AC-003-2/4、AC-006-1/2/4）在 plan §9"外部/诚实状态"列明确标注"夹具驱动；真实作业【外部】"；后端 drain 留给 workflow feature（D-02）；未把夹具结论写成真实业务已验证。复查：tasks T-07b/T-07c/T-07e/T-05e 完成标准同样标注，T-05e 还把钩子启用时的标题/日志标记作为完成标准
- [x] C-27 外部证据缺口（plan-gaps D-01～D-10：前端产物、作业引擎、`window.futuresai` 采纳、发布通道、干净机、基准机、真实 EIA key、系统通知观感、真实满盘、签名）逐项列出并给出"何时补"，不作为需求质量失败，也不冒充已取得。复查：analyze 迭代 6 §4 与 tasks"不在本 feature 任务内"段同样如实列出
- [x] C-28a 人工步骤全部在 `manual-acceptance.md`（M-01～M-26，无复选框，带环境标签与证据类别），本清单不含 M-ID 复选框；历史 T-01～T-06 的 ✅ 被 plan-gaps 与 review.md 定位为"阶段证据，待纠偏后复验"，本清单不认证其回溯执行

### G. Tasks / Analyze 对齐（初轮不勾选；复查轮由 A 独立核对后勾选）

- [x] C-28 新 tasks.md 承载全部 38 AC + WO-01～WO-13，每任务完成标准引用 AC 编号，验证命令与完成标准一一对应且 cwd 正确 —— **复查通过**：脚本按"完成标准"段统计 38/38 AC 有任务（见本文件"复查记录"第 3 节的覆盖摘要）；WO-03 以现有 data-layer 回归承载（有意无新代码，合理）；41 个任务每条完成标准都含 AC 编号、与验证条数相等；cwd 与 plan §8.2 一致
- [x] C-29 每任务 ≤ 2 h、依赖无环 —— **复查通过**：41 项均 0.5～2h（2h 的为 T-01c、T-05d、T-05e、T-05g、T-05j、T-07d、T-08d、T-10c）；初轮担心的 T-01b 已拆为 T-01b/T-01c/T-01d（1h/2h/1h），T-10c 的人工 M-01～M-04 已移出到人工批次 T-M1（非 Implement 任务）；顺序表无前向依赖。A 另行核对了**实际可执行顺序**（不只形式 DAG）：`package.json` 的 `test:unit` 脚本在 T-05b 先建；T-05c `bootstrap` 自带单测，T-05e `harness-selftest` 明文"不是 T-05c 完成前提"（AN3-01 已消除循环）；`harness-selftest` 只依赖现有就绪流程 + 假后端（假后端写端点文件、`/health` 200、支持 `/shutdown`，与基线 `main.js` 的就绪/退出路径兼容），不依赖 T-05g/h 状态机；T-07d 的通知开关持久化由本任务 `prefs-ui` 自证，T-07e 只用预置偏好文件证明抑制效果（AN3-02 已消除）；T-10a/T-10b/T-10c 的 staging 自举已理顺（AN3-03）；T-05i `kill-shell-recover` 所需的 stdin EOF 经 T-05h ← T-02b 传递；T-05h `ready-quit` 的 `mcp_endpoint.json` 断言经 T-02c 传递；T-08d 依赖 T-06d（隐私流程含打开指引）；T-09c 依赖 T-08e（白名单生效后验证分区隔离）
- [x] C-30 夹具/外部类 AC 的完成标准不写成"真实业务已验证"；人工步骤只引用 `manual-acceptance.md` 的 M-ID；plan §10"有意不做"项未混入 tasks —— **复查通过**：tasks 页首"证据边界"段 + 各任务"夹具驱动 / 【外部】"标注；tasks 中 `checklist.md` 仅出现在前置条件/进度说明，不承载人工步骤；人工批次表 T-M1/T-M2a～c 只指向 M-ID；"不在本 feature 任务内"段逐项排除 §10 扩展项
- [x] C-31 旧 tasks.md 进度表的 ✅ 改写为"阶段证据，待纠偏任务完成后复验"；F-01/F-02 的修补已反映到相应任务的文件路径与验证断言 —— **复查通过**：tasks"历史任务 T-01～T-06"表把当时证据定位为阶段记录、"未在本轮复验"，进度表 T-01b～T-10d 全部 ⬜；路径全为 `shell/src/`，T-08e 的 `csp` 断言为真实命中数 + 正对照

---

## 发现（Findings）

严重度：P1 = 阻塞 Tasks；P2 = 进入 Implement 前必须修；P3 = 可作为后续任务/Plan 小修。
类别：(a) 需改 spec、回 Clarify / Gate 1；(b) Plan 修补；(c) 待 Tasks/Analyze 对齐；(d) 仅外部验收缺口。

**(a) 需回 Clarify / Gate 1 的 spec 变更：无（两轮均无）。** 所有分歧均可由冻结 spec、Q-001～Q-010 与 docs 解决。

### (b) Plan 修补（初轮发现；"状态"列为复查轮结论）

| # | 级别 | 影响 AC / 位置 | 发现（初轮原文摘要） | 最小修法（初轮） | 状态（复查轮） |
|---|---|---|---|---|---|
| F-01 | **P2** | 全部 `shell/lib/**` 落点：plan §3.2 表、§7.3 `files`、§10 回滚范围；plan-gaps E；间接影响 AC-002-3、AC-004-4、AC-006-x、AC-008-x、AC-010-x | 仓库 `.gitignore` 第 17 行 `lib/` 会忽略 `shell/lib/`；按现计划实施后生产模块不会被提交 | ① 目录改名（如 `shell/src/`）或 ② 追加 `!shell/lib/` 否定规则；A 倾向 ① | **已闭合**：采用 ①，plan §3.2/§7.3/§10 与 tasks 全部改为 `shell/src/`；A 以 `git check-ignore -v` 复核全部计划新增路径不被忽略（C-23） |
| F-02 | **P2** | AC-009-2；plan §9 该行"自动验证"；§3.4 | e2e `csp` 要求"白名单拦截计数 ≥ 3"，但 CSP 在渲染进程先拦，请求不到 `webRequest`，断言恒假 | 拆成"无 CSP 夹具页证明白名单"与"内置页证明 CSP"两段，不断言计数 | **已闭合**：plan §3.4/§8.3/§9、tasks T-08e 改为两段真实效果断言 + 正对照（C-21） |
| F-03 | P3 | AC-010-2、AC-009-4；`diagnostics.js`、§8.2 | `zlib.crc32` 运行时依据未写明；单测不证明 Electron 运行时 | 补依据并区分单测与运行时证据 | **已闭合**：改为自带 CRC-32 查表，不依赖 `zlib.crc32`；§1/§8.1 区分证据；bsdtar 绝对路径（C-22） |
| F-04 | P3 | AC-009-2、WO-10；plan §3.4 | 回环放行全部资源类型；未明示回环非"远程"；`ws:`/`blob:` 未列 | 明示解释；补 `ws:`/`blob:`；可选限定 `resourceType` | **已闭合**：§3.4 明示 + 回环仅 `xhr`/`webSocket` + `blob:` 放行（C-14b） |
| F-05 | P3 | AC-008-2；plan §3.6 schema | `dismissedUpdate` 持久化却"仅本次运行有效" | 改内存状态或改语义 | **已闭合**：改为主进程内存状态，schema 移除，§3.8 同步（C-15） |
| F-06 | P3 | AC-004-4、R-004；plan §3.6 | `FAI_DATA_ROOT` 打包运行时也优先，可能静默改目录 | 限定 `!app.isPackaged || FAI_TEST_HOOKS=1` | **已闭合**：§3.6 限定并记日志；T-05b/T-05c 单测承载（C-08b） |
| F-07 | P3 | AC-010-1；plan §5、§3.7 | `logs/` 与 architecture `log` 不一致 | plan 注明对应或统一 | **已闭合**：plan/manual/tasks 统一为 `log\`，与 architecture §1 存储图一致（无 docs 改动） |

### (c) Tasks / Analyze 对齐（初轮登记；"状态"列为复查轮结论）

| # | 内容 | 状态（复查轮） |
|---|---|---|
| F-08 | 旧 tasks.md：`--backend-only`、`check:ui` 不存在；人工步骤指向 checklist 的 M-ID；`electron-builder.yml` 与 plan 不一致；进度表 ✅ 需改写 | **已闭合**：新 tasks.md 无上述命令（仅退役文本）、人工只指向 `manual-acceptance.md`、配置文件名为 `electron-builder.config.js`、进度表全部 ⬜（C-28/C-30/C-31） |
| F-09 | plan-gaps E 的 T-01b、T-10c 估时贴近/可能超过 2h | **已闭合**：T-01b 拆为三个任务；T-10c 的人工步骤移至 T-M1（C-29） |
| F-10 | F-01 路径与 F-02 断言须先定稿再写 tasks | **已闭合**：tasks 已继承 `shell/src/` 与新 `csp` 断言 |

### (d) 仅外部验收缺口（不是需求质量失败；两轮不变）

干净机安装（AC-001-1）、基准机 15 s（AC-001-2）、真实系统通知观感（AC-006-2）、真实作业引擎与后端 drain（AC-003-2/4、AC-006-1/4）、真实发布通道（AC-008-2）、真实 EIA key 与真实注册（AC-005-3）、真实满盘（AC-007-4）、`window.futuresai` 被前端采纳（AC-002-4）、代码签名——plan-gaps D-01～D-10 已如实列出，Handoff 时须按 §8.1 标"未取得"。

---

## 复查记录（第 2 轮，2026-10-28，A = `anthropic/claude-fable-5-1` via anthropic）

### 1. 协调者提出的 Tasks 实务问题（对照**最终**文件独立核验）

| 问题 | 独立核验结论 |
|---|---|
| T-05c 说在 T-05e 运行时检查前不能完成，而 T-05e 依赖 T-05c（验收循环） | **已修复**（AN3-01）。最终 T-05c 把启动引导抽为生产函数 `src/paths.js` 的 `bootstrap(app, env)`，新增 `test/unit/bootstrap.test.js`（只在 Electron 边界注入记录型 `app`）验证 `setPath×3` 先于 `requestSingleInstanceLock`、未拿锁不碰数据目录、目录解析与探测，并加静态核查；验证第 4 条明文"T-05e `harness-selftest` 之后做集成复验，**不是**本任务的完成前提"。不再有隐藏的验收循环 |
| T-07d 的通知开关标准只在依赖它的 T-07e 中验证 | **已修复**（AN3-02）。T-07d 新增 e2e `prefs-ui`（设置页点击 → `shell-prefs.json` 持久化 `notifications=false` 与 `closeBehavior`、再次启动回显、非法 patch 被拒），并明文"通知是否真正被抑制由 T-07e 证明，不是本任务完成前提"；T-07e `notify-off` 改为预置偏好文件。plan §9 AC-006-3 同步 |
| T-10a 要求 `npm run dist` 产出安装包，但 `extraResources` 需要 T-10c 才生成的 `dist/staging/app-config.json`（自举循环） | **已修复**（AN3-03）。T-10a 仅配置，`builder-config.test.js` 读取真实配置与 `installer.nsh` 自证、"不生成安装包"；T-10b 只用临时目录正/负夹具；T-10c `build.ps1` 第 5 步先生成 staging 配置、第 6 步首次 `npm run dist`、第 7 步扫描真实 `dist/win-unpacked`，验证中单独复跑扫描。plan §8.2 `dist` 行同步 |
| T-05e 只引用 WO-04、无 AC 编号 | **已修复**（AN3-04）。T-05e 三条完成标准分别引用 AC-004-1（基础设施层）、AC-004-4 / WO-04、AC-006-1 / AC-003-2（诚实标记）；T-05d/T-05m 同样写"最近 AC"并声明不证明产品 AC；脚本逐条核对 41 个任务无缺 AC 的完成标准 |

### 2. AC-005-3 逐子句追溯（协调者关注；A 对照源码独立判定）

源码事实（基线）：`backend/settings/onboarding.py` 的 `prepare()` / `guide_fields()` / `registration_hint()` 已实现 settings R-003 第 1 步与 AC-003-1（官方 `SECTORS` 标签、`reason_for_use`、缺项 `missing` + `hint`、注册 URL 与"不代提交"说明）；`backend/app/main.py` 未暴露；`shell/renderer/onboarding.js` 的 `renderPrefill` 用遮蔽后的 `/settings/profile` 自拼、显示 sector key、无 Reason for use、忽略 `missing_for_registration`、缺项仍可开注册页。**缺口属实**（迭代 4 之前 plan/tasks 确未覆盖"预填"子句）。

最终 Plan/Tasks 的覆盖（A 认定**已真实覆盖**，不是仅靠 AC 编号出现）：

| 子句 | 落点 | 验证 |
|---|---|---|
| 预填（完整档案，与核心一致） | plan §3.1.4 新端点 `GET /settings/registration-guide`（原样返回核心结果）→ T-03c；内置页删除 `renderPrefill`、点击"准备注册信息"后用 `textContent` 渲染核心结果 → T-06d | `TestRegistrationGuide::test_complete_profile_matches_core_labels`（真实核心 + 真实加密档案，字面量期望：Category 为 `Research/Consulting` 等官方标签、含 Reason for use、Email 为真实值）；e2e `registration-guide` 完整档案段；M-14 第 2 步 |
| 缺项先补档案（settings AC-003-1，不出现空表单） | 同上；缺项时列缺项 + 核心 `hint`、定位输入框、**不提供**"打开注册页" | `TestRegistrationGuide::test_missing_profile_lists_core_missing`（缺 last_name/email/sector 恰三项——与源码 `REGISTRATION_FIELDS=(first_name,last_name,email,sector)` 相容）；e2e 缺项段（无按钮、`openExternal` 记录为空、key 区仍可用）；M-14 第 1 步 |
| 打开注册页（系统浏览器，不代提交） | 核心 URL → T-06d → 外链策略 T-08e | e2e `registration-guide`（`openExternal` 恰收到核心 URL）、`external-link`；M-14 第 3 步、M-22 |
| 粘贴 key | T-06b（`password` 输入）、T-06d（缺项时仍可用） | e2e `ui-masking`、`registration-guide`；M-14/M-15 |
| 验证、保存 | 现有核心 `verify_and_save` 经 `POST /settings/key`（T-03b 补 507、不回显 key） | 现有 `TestKeyWizard`（`_probe` 网络边界注入）随 T-03b/T-03c 回归；真实 key 仅 M-14【外部】 |
| 数据源状态（含免凭证回退） | T-06b | 现有 `TestSources`/`TestClearKey`；e2e `settings-sources`；M-14 第 6 步 |

隐私边界：普通档案读写仍遮蔽并拒绝回写（AC-005-4）；指引仅用户显式点击后显示、只读、不在回写表单内、离开清空；指引载荷不入日志/诊断（AC-009-4，`diagnostics-privacy` 流程含打开指引）。邮箱不是 API 凭证，settings spec 也只要求凭证不明文；此处理在冻结需求内，不改 settings 核心/schema、不代提交、不暴露 key。**无 P2**。

### 3. 覆盖摘要（A 脚本统计，按任务"完成标准"段）

- 38/38 AC 均有 ≥1 个任务；覆盖最宽的 AC-007-4 有 7 个任务（启动期分类 / 507 / 错误页 / 日志 / 诊断 / 偏好写入），AC-005-3 有 T-03c、T-06b、T-06d。
- WO-01/02/04～13 均有任务；WO-03 有意沿用 data-layer 既有测试。
- 41 个任务、60.5h；37 个 e2e 场景全部有创建任务；13 个外壳单测文件 ⊇ plan 所列；3 个新 pytest 文件 + 2 个现有文件扩充。

### 4. 复查轮新增发现（均 P3，不阻塞 Implement；不改模型、不改结论）

| # | 级别 | 位置 | 发现 | 处置 |
|---|---|---|---|---|
| N-01 | P3（接受） | tasks T-08f；analyze R-3 | 后端 507 在设置页的**渲染**无自动化（假后端不实现设置端点，真实后端无法在 e2e 造满盘），只有 pytest 507 + 单测 ENOSPC + 可选人工 M-18 | 作者已如实登记为测试缺口；Handoff 必须记录"AC-007-4 的 507 界面渲染未自动化、M-18 是否执行"。不要求 Implement 前修 |
| N-02 | P3（措辞） | plan §9 AC-009-2、tasks T-06b/T-08e"组织类型下拉 12 项" | 源码 `SECTORS` 为 11 项，`onboarding.html` 下拉含 1 个 `（未选择）` 占位 `<option>`，`<option>` 总数 12；plan §3.1.4 端点表写 `× 11`。两处口径不同但都对（11 = 后端项数，12 = 页面 option 数） | 实施者按页面 `<option>` 元素计数即可；若写成后端返回数应为 11。不需改 Plan，Review 时核对断言对象 |
| N-03 | P3（建议） | `manual-acceptance.md` 执行记录模板 | 模板未写明"证据位置/备注与截图不得含真实 key、完整邮箱"；M-14/M-15 涉及真实 key 与真实邮箱显示 | 协调者可在 Handoff 记录验收证据时加一句约束；不属于 A 可写范围，不阻塞 |
| N-04 | P3（进度风险） | tasks T-10c（2h） | 首次 `npm run dist` 需下载 Electron / NSIS 二进制（plan §7.1 已记为构建期外部依赖），墙钟时间可能超过估时 | 不是文档不一致；Implement 如超时按 AGENTS 流程记入 review，不得跳过第 7 步扫描 |

### 5. 本轮未改变的边界

- 历史 T-01～T-06 仍为"阶段证据，待纠偏后复验"；T-01b～T-10d（含 T-03c、T-05m、T-06d）与全部纠偏代码**均未实施**，所有"待新增"测试/场景/脚本**不存在、未运行**。
- 全部实施（含纠偏）由 `openai/gpt-6-astra` 执行；Astra 会话开始前须重读本文件全部复选框。
- 外部 / 人工证据（上文 (d)）、Converge、Review（A 新开会话对固定提交与真实 diff 评审）、Gate 2 均未开始；本文件不是其中任何一项。
- 本轮 A 仅写入 `checklist.md`；未改 spec / plan / tasks / analyze / review / README / 源码，未运行测试或构建，未提交。

## 结论

- 需求 / Plan / Tasks 质量：**达标，Checklist 通过（全部 41/41）**。初轮 P2（F-01、F-02）与 P3（F-03～F-07）全部经 A 对照修订 3 内容与源码事实确认闭合；协调者提出的验收循环（T-05c/T-05e、T-07d/T-07e）、打包自举（T-10a～T-10c）与 AC 引用缺失均已在最终 tasks 中修复；AC-005-3 的"预填 / 缺项引导"缺口已由 T-03c + T-06d 真实覆盖。无需回 Clarify / Gate 1，无需新 ADR，无需 AGENTS §5.1 单独批准的新增复杂度（A 不授予也未发现此类项）。
- **Implement 文档前置条件满足**，可交 `openai/gpt-6-astra`（回退仅限调用失败：`deepseek/deepseek-flash`）。
- 本文件**不是** Gate 2，**不是**代码通过结论，**不**认证历史 T-01～T-06 的执行，**不**代表任何自动化或人工验收已取得。
