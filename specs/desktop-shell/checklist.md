# Feature: desktop-shell 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员 A 生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求质量达标，**不代表实施完成，不代表代码通过，不是 Review，不是 Gate 2**。实施者不勾选本文件。
> 审核员 A 为独立会话（与实施隔离），单审，结论即审核结论。

| 项 | 记录 |
|---|---|
| 审核员 A 实际模型 / 通道 | `anthropic/claude-fable-5-1`（官方 API 通道），三轮相同。第 3 轮（修订 4 局部复查）会话 `01a183ba-241b-76cf-8588-b472ac61c90c`，`PI_PROVIDER=anthropic` / `PI_MODEL=claude-fable-5-1`（会话环境实核） |
| 路由原因 | `claude-bridge/claude-fable-5-1` 在当前 seven_day 限额窗口内已确认不可用（重置约 2026-10-30）；按 AGENTS §6.5 本窗口不重复探活，直接走 `anthropic` 通道，最小真实调用成功。换通道不是换模型，审核员身份不变。与 Plan/Tasks/Analyze 作者（`claude-opus-5-5`）、协调（`openai/gpt-6.1-sol`）、拟定 Implement（`openai/gpt-6-astra`）均不同 |
| 日期 | 初轮 2026-10-28（Plan 修订 2 之后）；**复查轮 2026-10-28（Plan 修订 3 + tasks.md 重写 + Analyze 迭代 6 之后，新开独立会话）**；**第 3 轮 2026-10-28（Plan 修订 4：T-04b 构建收集源头修正，新开独立会话，只针对 `build-assets-review-request.md` 列出的受影响项）** |
| 固定源码基线 | `8ba1b6a304f916e3d57ebdd6b89790b75a15f14c`（分支 `review/desktop-shell-checklist`）。第 3 轮：原始源码基线不变；源码 / spec / 本文件与固定输入 `1275ae2191881d830a4f8e09c52dbe4cb12a2e78` 逐字节相同（`shell_check.py` blob `2aa8824b…`） |
| 审核输入（第 3 轮，修订 4） | 审核树 `review/desktop-shell-build-assets`，**固定 HEAD `981d4301f069f71dd120a1a86124dbe03aa54e0c`**（审核期间未移动）。`git diff --stat 1275ae2 981d430` 只列四个文件：`plan.md`（+80/−3，修订 4）、`tasks.md`（+88/−12，T-04b）、`analyze.md`（+60/−0，追加迭代 7，只追加于第 343 行之后）、`build-assets-review-request.md`（+50，新增），共 278 行新增 / 15 行删除；删除行全部是 T-04b 相关行的替换（页首修订号、顺序表第 8 行、合计、T-04b 块、§9 AC-001-4 行、§10 回滚行），无历史内容被改写。`git diff --exit-code 1275ae2 981d430 -- spec.md backend checklist.md shell packaging docs .gitignore` 为空；`git diff --check` 无错误；`checklist.md` 在本轮开始时仍为 41 `[x]` / 0 `[ ]` |
| 审核输入（复查轮） | 基线 + 协调者冻结的**未提交**规划工作副本（不是集成提交）：`git diff 8ba1b6a -- specs/` 只改 `specs/README.md`（状态行）、`spec.md`（页首 Gate 1 元数据 1 行）、`review.md`、`plan.md`（修订 3）、`tasks.md`（重写）；新增 `analyze.md`、`plan-gaps.md`、`manual-acceptance.md`、`checklist-review-request.md`。`git diff --stat 8ba1b6a -- backend shell packaging docs .gitignore` 为空（A 复核）：源码、docs、`.gitignore` 相对基线无改动；`git diff --check` 无空白错误 |
| 审核范围 | AGENTS §2 第 5 步 Checklist（需求 / Plan / Tasks 质量）。**第 3 轮**：只复查 `build-assets-review-request.md` §3 列出的九组质量项（C-02 / 一致性、C-16、C-17 / C-18、C-19、C-20 / C-23、C-24、C-28 / C-29 与模板项、C-26 / C-27、analyze 迭代 7）；只读阅读真实 diff、已安装 PyInstaller 6.22.3 / hooks-contrib 2026.9 / pyarrow 22.0.0 源码与目录枚举、实施树中保留的阻塞产物与构建 TOC 文本（只读）、`git`/`rg`/`check-ignore` 静态核查与 tasks.md 结构计数；**未运行任何测试、构建、hook、npm，未导入 pyarrow，未改源码，未提交**。复查轮：独立复核初轮 F-01～F-10 的处置是否成立、Tasks/Analyze 对齐项（C-28～C-31 与模板两项）、协调者提出的验收循环 / 打包自举 / AC 引用问题、AC-005-3 逐子句追溯。只做文件阅读、`git`/`rg`/`check-ignore` 静态核查与 tasks.md 结构脚本统计；**未运行任何测试、构建、安装或 npm 命令** |
| 当前结论 | **第 3 轮（修订 4）：Checklist 通过（仍为 41/41，受影响项经独立复查后保持勾选；无 P1/P2，新增 3 项 P3 R4-01～R4-03）**。修订 4 只对 T-04b 的 Implement 文档前置条件成立：冻结 spec / plan 修订 4 / tasks（41 个任务，61h）/ analyze 迭代 7 一致，可交 `openai/gpt-6-astra` 实施 T-04b 修订 4 部分（实施前须重读本文件全部复选框，且协调者须先按 AN7-04 给出固定实施输入提交）。本结论**不是** feature 完成、Converge、代码 Review 或 Gate 2，**不**代表 hook / 测试 / 重建已做或已通过。——历史：第 2 轮 **Checklist 通过（全部 41/41）**。冻结 spec / plan 修订 3 / tasks（41 个任务）/ analyze 迭代 6 的文档前置条件满足，可交 `openai/gpt-6-astra` 进入 Implement（实施前须重读本文件全部复选框）。本结论**不**认证历史 T-01～T-06 的执行，**不**代表任何代码已实现或测试已通过，**不是** Converge / Review / Gate 2；干净机、基准机、真实作业引擎、真实前端、真实发布通道、真实 EIA key、系统通知观感等外部 / 人工证据仍未取得 |

统计：**41 / 41** 项已勾选（A 直接计数复选框；第 3 轮结束时 `rg -c '^- \[x\]'` = 41、`'^- \[ \]'` = 0，未新增条目）。初轮为 30 / 41；复查轮勾选的 11 项 = C-08b、C-14b、C-21、C-22、C-23（F-01～F-07 修补成立）+ 模板"spec/plan/tasks 无冲突""任务粒度与验证命令"+ C-28～C-31（Tasks/Analyze 对齐）。各项勾选依据写在条目内"复查："之后；**第 3 轮对修订 4 的复查依据写在受影响条目内"修订 4 复查："之后**，未受影响条目未重新评估、沿用第 2 轮结论。

---

## 需求完整性

- [x] 每条需求都有至少一条可验证的验收规则 —— spec R-001～R-010 共 10 条需求、38 条 AC（直接计数：4+4+4+4+4+4+4+3+4+3），每条 AC 在 plan §9 有独立一行。复查：spec 正文未变，计数不变
- [x] 无未澄清歧义（spec.md §5 歧义记录已清零或闭环）—— Q-001～Q-010 均有回答与融入位置；plan-gaps B-01～B-10 的设计分歧全部从 spec/Clarify/docs 推得，C 类"需 Walter 回答"为空，A 复核同意。复查：Analyze 迭代 1～6 均未产生需回 Clarify 的发现，A 同意
- [x] 目标与非目标边界清晰 —— 非目标（前端页面、业务 API、agent 能力、多窗口、更新服务端、本地模型）与 plan §1"真实业务边界"、§3.1.5"不挂载 MCP 工具"一致

## 一致性

- [x] spec / plan / tasks 之间无冲突（Analyze 报告无遗留问题）—— 初轮待定（旧 tasks.md 为历史草稿）。**复查**：新 tasks.md 为 41 个任务；A 用脚本按"完成标准"段统计：38 条 AC 全部至少有 1 个任务承载，WO-01/02/04～13 均有任务，WO-03 有意无新任务（沿用 data-layer `stale_running()` 与现有回归命令，tasks"不在本 feature 任务内"段写明）；任务体中 `check:ui`、`--backend-only`、`npm run smoke`、`shell/lib`、`FAI_TEST_CONTROL_TOKEN`、`zlib.crc32`（作为依赖）均无命中，仅作历史/退役文本；人工步骤只引用 `manual-acceptance.md` 的 M-ID（tasks 引用的 M-ID 全部存在于该文件）；e2e 场景名与 plan §9/§8.3 一致（37 个场景均有创建任务）；`electron-builder.config.js` 与 plan §7.3 一致。analyze.md 迭代 6 的"文档一致性通过"与 A 的独立核对一致，且迭代 1/3/5 的未通过结论如实保留。无遗留 P1/P2。**修订 4 复查**：真实 diff 只改 T-04b 相关段落（plan §0/§7.5/§8.2/§9 AC-001-4/§10；tasks 页首、顺序表第 8 行、合计、T-04b 块；analyze 追加迭代 7），spec 零差异；A 脚本重新统计：顺序表 41 行 / 任务块 41 个、估时合计两处均 61.0h（min 1h / max 2h）、T-04b 完成标准 4 条 = 验证 4 条且每条含 AC 编号、顺序表第 8 行依赖 `T-01b～T-03c` 未变、T-10c 仍依赖 T-04b；`60.5` 仅剩 1 处（历史括注）。plan §7.5 / §8.2 / §9 与 tasks T-04b 的三个测试名、`pyinstaller_hooks` 目录、`--additional-hooks-dir` 一致。analyze 迭代 7 的"文档一致性通过（修订 4 范围）"与 A 独立核对一致，迭代 1～6 原样保留。无 P1/P2
- [x] 与 docs/ 决策与 ADR 无冲突 —— D-001/D-007（Electron + PyInstaller sidecar + electron-builder）、D-010（FastAPI 宿主）、architecture §2（Shell 职责：窗口/托盘/通知/更新/进程守护）、§4.4（用户数据目录含日志）、§5.2（MCP 在 Backend 进程内，由 agent feature 挂载 → plan 只恢复 data-layer 只读通道，B-02 成立）、§9（127.0.0.1 + 令牌）；interaction §3.3 第 6 条"通知节制"与 R-006 的关系按 B-04 处理（系统 toast 非模态、可全局关闭，spec 已冻结）；designUI §3.1"启动：加载页 → 工作台"与 plan §4.1 立即显示启动页一致。未发现需新立 ADR 的决策（只读通道、状态目录拆分、端口 0 均为 spec/Q-001/data-layer 既有契约的落地）。复查：修订 3 把日志目录改为 `log\`，与 architecture §1 存储图（第 35 行 `… creds/ log`）一致；新端点 `GET /settings/registration-guide` 是对 settings 核心的只读暴露，属 R-005 / Q-007"复用核心、外壳只做视图"，不需 ADR。**修订 4 复查**：D-007 已决定"Python 以 sidecar 形态打包（PyInstaller）"；仓库 hook 目录与现有 `--exclude-module` 同属该决定下的构建实现细节，不触及分层、数据底座或交互模型，不需新 ADR，A 同意

## 可测试性

- [x] 每条验收规则可映射到单元测试或手动验收步骤 —— plan §9 每条 AC 至少有一种：pytest / `node --test` / 真实 Electron e2e / M-ID；plan §9 引用的 M-ID（M-01～M-26）全部存在于 `manual-acceptance.md`；人工步骤未写进本清单
- [x] 任务粒度与验证命令满足 tasks.md 模板要求 —— 初轮待定。**复查**：41 个任务估时均在 0.5～2h（脚本核对，合计 60.5h；执行顺序表与任务体估时一致）；每个任务含上下文、修改范围、估时、完成标准、验证；**每个任务块的每一条完成标准都含 `AC-xxx-y`**（脚本逐条核对，无例外；基础设施任务 T-05d/T-05e/T-05m 写"最近 AC"并明言不证明产品 AC），完成标准与验证条数一一对应；验证命令 cwd 均写明（`cd backend` / `cd shell` / 仓库根目录）且与 plan §8.2 的"现有 / 待新增"标注一致；执行顺序表 41 行无前向依赖、无环（任务体"依赖"与顺序表一致，T-04b 的"T-01b～T-03c"区间写法与 T-05i 的"已含 T-02b"括注为同义表述）。**修订 4 复查**：T-04b 估时 1.5h → 2h 仍 ≤ 2h（工作量 = 约 5 行 hook + 约 3 行接线 + 一个三用例测试文件 + 7 步复验，其中全量回归约 207 s、重建约 193 s、两次真实 hook 执行各需 PyInstaller 隔离子进程导入 pyarrow 子包，合理）；4 条完成标准 ↔ 4 条验证一一对应（1 就绪 PASS 行；2 回环用例 + PASS 行；3 黑名单 PASS 行 + 12/12 + 清单对比 + 全量 skip=5 + 冻结文件 diff；4 聚焦测试 3 passed/0 skip + 构建日志 hook 来源 + `check-ignore`）；全部验收都在 T-04b 自身 7 步内，不由后序任务承担；cwd 标注（第 1～6 步 `backend`，第 7 步仓库根）与 plan §8.2 新增两行一致

## 自定义项

### A. 冻结 spec 与范围

- [x] C-01 spec 38 条 AC 与 10 条需求由 A 直接计数核对；plan §9 逐条覆盖，无遗漏、无多算
- [x] C-02 spec 相对基线的差异只有页首 Gate 1 元数据一行（`git diff 8ba1b6a -- specs/desktop-shell/spec.md`），需求、AC、歧义表正文未动；plan 未新增/修改 AC，无偷改需求。复查：仍只有该一行差异；修订 3 与新 tasks 未新增 AC（`AC-003-5` 只在 spec §4 指 settings 的 AC，不计入）。**修订 4 复查**：`git diff --exit-code 1275ae2 981d430 -- specs/desktop-shell/spec.md` 为空，相对 `8ba1b6a` 仍只有页首元数据一行。修订 4 落在冻结 AC-001-4（"安装包内不含……开发期产物"）之内：plan §7.4 黑名单早含 `tests/`，冻结的 `shell_check.py::package_exclusions()`（A 读源码第 68～81 行）按目录名 `tests` 命中且注释明言"第三方同名条目也必须报告，不能豁免"；修正只让产物满足既有规则，不改需求、AC、schema、黑名单或扫描器 → 不需回 Clarify / Gate 1，A 同意作者判断
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
- [x] C-16 打包：lockfile 驱动 `npm ci`、PyInstaller 版本断言、三处 `VERSION` 一致断言；`files` 白名单 + `scan-package.js` 黑/白名单扫描（AC-001-4）；NSIS 按用户安装、`deleteAppDataOnUninstall:false`、`customUnInstall` 只删 `session/run`，保留 `%LOCALAPPDATA%\FuturesAI` 与 `shell-prefs.json`（AC-001-3、B-03）；干净机【外部】、15 s【基准机】、系统通知【安装版人工】三者分开写明，Q-009 过渡验收不冒充干净机。复查：打包自举顺序已理顺——`build.ps1` 第 5 步生成 `shell/dist/staging/app-config.json`（`git check-ignore` 确认 `shell/dist/` 被忽略，生成物不入库、不手改）后第 6 步才首次 `npm run dist`，第 7 步扫描真实 `dist/win-unpacked`；T-10a 只写配置并以 `builder-config.test.js` 读取真实配置自证，T-10b 只用临时目录夹具验收扫描器；M-03 以实际所选安装目录（M-01 记录 / 注册表 `UninstallString`）为准，不写死默认路径。**修订 4 复查（根因与设计与已安装源码相符，A 逐项只读核实）**：① contrib `stdhooks/hook-pyarrow.py` 恰为三行 `hiddenimports = collect_submodules('pyarrow', filter=lambda x: "tests" not in x)` / `datas = collect_data_files('pyarrow')` / `binaries = collect_dynamic_libs('pyarrow')`，无 `hook_priority` 覆盖；② `collect_data_files`（`utils/hooks/__init__.py` 第 765～885 行）：默认 `includes=['**/*']`，非 `include_py_files` 时追加 `**/*<suffix>` 排除 `compat.ALL_SUFFIXES`（`.py/.pyc/.pyd` 等），用户 `excludes` 位于前 `excludes_len` 项、命中目录即追加 `<dir>/**/*`，所以 `excludes=['tests']` 恰移除 `pyarrow/tests/**`；`datas` 的目标为 `s.parent.relative_to(pkg_base)`（目录），与 plan 的"目标路径"口径一致；③ `PY_DYLIB_PATTERNS = ['*.dll','*.dylib','lib*.so']`（第 716 行）；④ `depend/imphook.py` 第 128～136 行每模块只保留 `priority` 最高的 hook，第 420 行 `logger.info('Processing standard module hook %r from %r', …)`；`depend/analysis.py` 第 61～64 行 `HOOK_PRIORITY_USER_HOOKS = 1000`、`CONTRIBUTED = −1000`；`building/build_main.py` 第 524～533 行把 `--additional-hooks-dir` 以 1000 加入 `hookspath`；⑤ 环境：PyInstaller 6.22.3、hooks-contrib 2026.9、pyarrow 22.0.0（`importlib.metadata`，未导入 pyarrow）；site-packages 中 `hook-pyarrow*.py` 只有 contrib 一份，pyarrow 无 `pyinstaller40` 入口点；pyarrow 内名为 `tests` 的目录只有包根一处，内含 72 `.py` / 72 `.pyc`（`__pycache__`）/ 4 `.parquet` / 4 `.orc` / 4 `.gz` / 3 `.pyx` / 1 `.md` / 1 `.feather`；`include/arrow/testing` 存在但名为 `testing`，扫描器不命中；`arrow.dll`、`parquet.dll`、`include/arrow/api.h` 存在（字面量锚点成立）；⑥ 实施树保留的阻塞产物 `_internal/pyarrow/tests` 恰 17 个文件 = 上述 17 个非 `.py/.pyc` 文件（无 `.pyd`），整个产物中名为 `tests` 的目录仅此一处、无 `pytest`/`_pytest` 目录 → "该目录只来自 `datas`"与"只需覆盖 pyarrow 一个 hook"均为事实；⑦ `CONF['pathex']` 默认 `[]`，`is_package` / `get_all_package_paths` / `collect_submodules` 走 `isolated.call`，hook 可脱离构建以 `runpy` 真实执行而无需 mock（plan 的停止规则仍保留，合理）。放弃方案表的理由成立（`--exclude-module` 只作用于模块名、`.spec` 改动面更大、改 site-packages / 版本不可复现且被禁止、手删产物 = 伪造、黑名单豁免须回 Gate 1）。仓库 hook 是最小且标准的 PyInstaller 覆盖机制，A 同意

### D. 范围控制（AGENTS §5.1）

- [x] C-17 两项"必要复杂度"可直接追溯：stdin EOF 守护 ← AC-003-3 + 源码孤儿进程事实（A-08）；请求白名单 ← AC-009-2 + 前端产物 CSP 不受控。状态机代际计数 ← A-05 并发缺陷事实。均能说清"具体怎么出错"，不是猜测的竞态/安全框架。复查：迭代 3 后新增的 `bootstrap(app, env)` 是对现有启动代码的抽取（为可单测、消除验收循环），`GET /settings/registration-guide` 在 AC-005-3 冻结范围内；测试控制通道的随机令牌已被**删除**（AN3-05），A 同意"A 不能替 Walter 授予工程批准"的处理；本清单未授予任何 §5.1 批准，也未发现未经批准的扩展。**修订 4 复查**：修正只针对已观测的 11/12 失败（`_internal/pyarrow/tests`），改动集合 = 1 个 hook 文件（三条赋值）+ `build_backend.py` 一个常量与一个参数 + 1 个测试文件；无新依赖、新框架、新抽象，`hiddenimports`/`binaries` 刻意与 contrib 等价而不"顺手"收紧；plan §7.5 第 2 段与 tasks 停止规则禁止扩大排除或放宽黑名单。残余边界 AN7-02 只登记不处理——A 以只读方式读取实施树 `build/pyinstaller/futuresai-backend/PYZ-00.toc`，**已核实** PYZ 含 `pyarrow.conftest`、`pyarrow.tests`、`pyarrow.tests.util` 三条（`warn-*.txt` 第 375 行亦示 `pytest` 被排除而 `pyarrow.conftest`/`pyarrow.tests.util` 顶层导入它）；这是 contrib hook 既有行为、修订 4 不改变、不在冻结文件系统黑名单范围，按 §5.1 不加推测性处理是正确的（见 R4-01）。Walter 对本修正的授权记录在 plan §0 修订 4；A 不替 Walter 授予任何更大范围
- [x] C-18 plan §10"有意不做"清单（IPC 发送方校验、Job Object、元数据签名、应用内下载、目录迁移、日志加密、偏好自动重置、多窗口）取舍合理；plan 与 plan-gaps 均**未**宣称任何 §5.1 批准已取得，只写"如要做需 Walter 先批准"；A 确认本清单亦不替 Walter 授予批准。复查：tasks"不在本 feature 任务内"段逐项列出这些项不进入任何任务。**修订 4 复查**：plan §10 新增三行风险（第三方测试资产 / contrib 或 pyarrow 漂移 / PYZ 残余）均为登记 + 停止规则或参照测试，未新增"有意不做"之外的机制；`--exclude-module pyarrow`（改变运行时依赖集合）被明确列为不采用，A 同意
- [x] C-19 回滚范围限定在 `backend/app/`、`backend/tools/{build_backend,shell_check}.py`、`backend/tests/test_app_*`、`shell/`、`packaging/`，不触及用户数据与其他 feature 目录；settings 文档的 "T-08" 跨引用（A-21）已在 `review.md` 说明，不改 settings 文件。复查：41 个任务的修改范围全部落在上述目录内（`backend/tests/test_app_settings_api.py` 新增类、`backend/tests/test_app_{startup_errors,channel,disk_full}.py` 新文件均匹配 `test_app_*`）。**修订 4 复查**：plan §10 回滚范围加入 `backend/tools/pyinstaller_hooks/`（修订 4）；tasks T-04b 写入集合 = `build_backend.py`、新 `tools/pyinstaller_hooks/hook-pyarrow.py`、新 `tests/test_app_packaging.py`（匹配 `test_app_*`）、`implementation-evidence.md` 只追加；只读集合 = `shell_check.py`、`test_app_health.py`、spec、site-packages（含 contrib hook）、constraints / pyproject、`backend/app|data|settings`、`shell/`、`packaging/`、协调者 / A 所有的文档；生成目录只由 `--clean` 再生。与 plan §7.5 设计表和 §10 回滚完全一致

### E. 可测试性细节

- [x] C-20 验证命令的 cwd 与"现有/待新增"标注准确（plan §8.2）：不再引用 `check:ui`、`--backend-only`；现有命令经源码核实存在；`node --test`、`shell/check.js` 场景、`packaging/build.ps1` 均标"待新增/待重构"。复查：tasks 页首与每条验证均标"待新增"，明言 Implement 前不存在、未运行；`npm run dist` 只出现在 T-10c 的 `build.ps1` 内；A 在本机确认 `C:\Windows\System32\tar.exe` 为 bsdtar 3.8.9、git-bash `tar` 为 GNU tar 1.35，plan/tasks 统一写绝对路径 `%SystemRoot%\System32\tar.exe` 的处理正确（AN1-01）。**修订 4 复查**：plan §8.2 新增两行标注准确——`build_backend.py --clean` 标"现有（`--clean` 是脚本已有参数）"（A 读源码确认 `clean = "--clean" in argv` 且只删 `dist/<app>` 与 `build/pyinstaller`），`test_app_packaging.py` 标"待新增（修订 4）"；tasks 细则第 1～6 步 cwd = `backend`、第 7 步 = 仓库根目录，与 §8.2 一致；细则命令沿用 `implementation-evidence.md` §2 已实际使用过的包装写法。见 R4-02 对第 4 步日志行 repr 转义的提示（不需改文档）
- [x] C-21（初轮 **P2**，F-02）AC-009-2 的 e2e 断言与 CSP 行为矛盾 —— **复查已闭合**：plan §9 AC-009-2 / §3.4 / tasks T-08e 改为两段、各自独立证明一层：①无 CSP 的 `frontend-stub`（模拟前端产物）在页面内发起远程 `<script>`/`<iframe>`/`fetch` 与回环 `<script>` → 以回环夹具服务（`remote.fai.test` 经 `host-resolver-rules` 映射到 127.0.0.1）的**真实命中数 = 0**、`window.__remoteExecuted` 未定义、iframe 未加载为证据；②有 CSP 的内置引导页（真实后端）同样远程命中 = 0。两段都配**正对照**（回环 `fetch /ok` 200 且恰命中 1 次、经 `getBackend()` 的 `/health` 200、内置页带令牌 XHR 加载组织类型下拉），证明放行路径没有被一并堵死。**不**断言 `webRequest` 拦截计数，不要求在 CSP 已拦截时仍发生拦截。无外网依赖
- [x] C-22（初轮 P3，F-03）Electron 运行时 Node API —— **复查已闭合**：plan 改为不依赖 `zlib.crc32`，`src/diagnostics.js` 用 `zlib.deflateRawSync` + 模块内 CRC-32 查表（零新增运行时依赖），单测用标准向量 `"123456789" → cbf43926`；plan §1/§8.1 明示 `node --test` 跑在构建机 Node 25、不能证明 Electron 运行时 API，运行时证据只认真实 Electron 的 `diagnostics-privacy`（bsdtar 解压校验 CRC，快照记录 `versions.node`）；tasks T-08c/T-08d 对应
- [x] C-23（初轮 **P2**，F-01）`shell/lib/**` 被 `.gitignore` 第 17 行 `lib/` 忽略 —— **复查已闭合**：plan §3.2 改为 `shell/src/`（并写明理由），§7.3 `files` 白名单为 `src/**`，§10 新增"提交前 `git status --short --ignored` 核对"风险行；tasks 全部任务路径为 `shell/src/*`，`shell/lib` 零命中。A 用 `git check-ignore -v` 核对：`shell/src/backend.js`、`shell/src/paths.js`、`shell/test/unit/*.test.js`、`shell/test/e2e/index.js`、`shell/test/fixtures/fake_backend.py`、`shell/test/fixtures/runner/ok/*`、`shell/installer/installer.nsh`、`shell/tools/scan-package.js`、`shell/electron-builder.config.js`、`shell/renderer/startup.js`、`packaging/build.ps1`、`backend/tests/test_app_channel.py` 均**不被忽略**；仅 `shell/dist/staging/app-config.json` 被第 242 行 `shell/dist/` 忽略，而它本就是构建生成物（plan §7.2"生成物不提交、不手改"）。`.gitignore` 锚点未被要求移除。**修订 4 复查**：A 以 `git check-ignore -v --no-index backend/tools/pyinstaller_hooks/hook-pyarrow.py backend/tests/test_app_packaging.py specs/desktop-shell/build-assets-review-request.md` 核对：无输出、退出码 1（三者均不被忽略）；`.gitignore` 中可能相关的锚点只有第 3 行 `*.py[codz]`（不匹配 `.py`）、第 11 行 `build/`、第 13 行 `dist/`（恰好覆盖生成目录，符合预期）、第 17 行 `lib/`；无 `hooks`/`tools` 相关规则。修订 4 未要求改 `.gitignore`
- [x] C-24 测试接缝只在系统边界：`FAI_SHELL_STATE_DIR`/`FAI_DATA_ROOT`/`LOCALAPPDATA` 隔离目录；`FAI_BACKEND_CMD` 替换进程；`FAI_TEST_EVENTS` 替换事件来源；`FAI_TEST_SCENARIO` 替换对话框/通知器/`openExternal`；`FAI_UPDATE_FEED_URL` 仅回环；pytest 在访问层/文件系统/网络边界注入异常。真实后端 e2e 覆盖就绪/退出/锁/强杀/崩溃/引导/通道/诊断。`check.js` 启动前校验两个隔离变量指向临时目录（修复 A-16 使用真实用户目录）。复查：`bootstrap` 单测只在 Electron 边界注入记录型 `app`，路径/偏好/探测走真实实现；假后端 `fake_backend.py` 只实现宿主命令行/端点文件/标记行/stdin EOF 契约与 `/health`、`/shutdown`、`GET /settings/profile` 的 `onboarding` 形状，不含业务逻辑；控制通道只调用生产函数；`TestRegistrationGuide` 用真实 settings 核心 + 真实加密档案夹具且期望值写字面量，不在测试里复算核心逻辑。**修订 4 复查**：`test_build_command_wires_repository_hook_dir` 只替换 `subprocess.run`（系统边界）并返回非零码——A 读 `build_backend.main` 确认非零返回码在触碰 `dist/` 之前直接返回、`subprocess.run(cmd, cwd=str(BACKEND))` 可被记录器捕获 `cwd`；两个 hook 测试用 `runpy.run_path` 真实执行仓库 hook 与已安装 contrib hook，真实 `collect_*` 作用于真实 pyarrow（无需 mock，见 C-16 ⑦），参照规则"目标不在 `pyarrow/tests` 之下"取自 §7.4 的需求表述、与生产 glob `excludes` 机制不同，不是抄生产逻辑；禁止 mock `collect_*` 与"必须 mock 才能跑则停"的规则写入 plan 与 tasks 停止规则；`importorskip` 只针对未装 pyarrow 的环境，细则第 1 步 `-rs` + "3 passed / 0 skipped"、第 2 步"skip 恰为 5 个 `test_smoke_online.py`"使最终证据不允许 skip。plan §7.5 第 4 段的论证充分且未夸大：等价性测试 + 产物清单对比证明 pyarrow 模块 / 扩展 / DLL / 非测试数据与修正前一致；明确承认 `pandas/compat/pyarrow.py` 以 `try: import pyarrow … except ImportError` 吞掉导入失败（A 读源码第 7～25 行确认）故冒烟不能单独证明 pyarrow 可导入；`rg "import pyarrow|from pyarrow" backend/app backend/data backend/settings` 无命中（A 复核）；不新增运行时探针的理由（需改冻结冒烟脚本或运行时代码）成立。现有 `test_app_health.py` 以 `from tools.shell_check import …` 导入工具模块，`from tools import build_backend` 同理可行
- [x] C-25 AC-009-1 改用 `netstat -ano -p TCP` 按 pid 断言监听地址，不再依赖本机是否有非回环地址（修复 A-17）；AC-002-2 的 `shell_check.py` 加强为"必须看到健康检查成功"（修复 A-14）

### F. 边界诚实与证据分类

- [x] C-26 夹具驱动的 AC（AC-003-2/4、AC-006-1/2/4）在 plan §9"外部/诚实状态"列明确标注"夹具驱动；真实作业【外部】"；后端 drain 留给 workflow feature（D-02）；未把夹具结论写成真实业务已验证。复查：tasks T-07b/T-07c/T-07e/T-05e 完成标准同样标注，T-05e 还把钩子启用时的标题/日志标记作为完成标准。**修订 4 复查**：tasks T-04b "证据"段要求在 `implementation-evidence.md` 末尾**追加**一节、"修正前的 11/12 结果与警告原样保留"，修改范围也写明"不改写、不删除已有的失败记录与警告"；plan §7.5 第 5 段同义；plan §0 修订 4 触发行如实记录 451 passed / 5 online skips、构建退出 0、冒烟 11/12 与唯一失败路径。诚实边界保持
- [x] C-27 外部证据缺口（plan-gaps D-01～D-10：前端产物、作业引擎、`window.futuresai` 采纳、发布通道、干净机、基准机、真实 EIA key、系统通知观感、真实满盘、签名）逐项列出并给出"何时补"，不作为需求质量失败，也不冒充已取得。复查：analyze 迭代 6 §4 与 tasks"不在本 feature 任务内"段同样如实列出。**修订 4 复查**：`build-assets-review-request.md` §4、analyze 迭代 7 §3 与 plan §9 AC-001-4 行未把干净机 / 基准机 / 真实前端 / 作业引擎 / 发布通道 / 真实 EIA key / 系统通知 / 真实满盘 / 签名改写为已取得；AN7-02（PYZ 残余）、AN7-03（pyarrow 与 contrib 未在 `constraints.txt` 锁定——A 核对 constraints 只锁 `pyinstaller==6.22.3`）如实登记为 P3
- [x] C-28a 人工步骤全部在 `manual-acceptance.md`（M-01～M-26，无复选框，带环境标签与证据类别），本清单不含 M-ID 复选框；历史 T-01～T-06 的 ✅ 被 plan-gaps 与 review.md 定位为"阶段证据，待纠偏后复验"，本清单不认证其回溯执行

### G. Tasks / Analyze 对齐（初轮不勾选；复查轮由 A 独立核对后勾选）

- [x] C-28 新 tasks.md 承载全部 38 AC + WO-01～WO-13，每任务完成标准引用 AC 编号，验证命令与完成标准一一对应且 cwd 正确 —— **复查通过**：脚本按"完成标准"段统计 38/38 AC 有任务（见本文件"复查记录"第 3 节的覆盖摘要）；WO-03 以现有 data-layer 回归承载（有意无新代码，合理）；41 个任务每条完成标准都含 AC 编号、与验证条数相等；cwd 与 plan §8.2 一致。**修订 4 复查**：AC-001-4 的承载从 T-04b 完成标准 3（干净重建 + 未修改冒烟扫描 + 清单对比）扩展出完成标准 4（收集源头），analyze 迭代 7 §4 覆盖矩阵同步；其余 37 条 AC 的任务承载未动（diff 未触及其他任务块）
- [x] C-29 每任务 ≤ 2 h、依赖无环 —— **复查通过**：41 项均 0.5～2h（2h 的为 T-01c、T-05d、T-05e、T-05g、T-05j、T-07d、T-08d、T-10c）；初轮担心的 T-01b 已拆为 T-01b/T-01c/T-01d（1h/2h/1h），T-10c 的人工 M-01～M-04 已移出到人工批次 T-M1（非 Implement 任务）；顺序表无前向依赖。A 另行核对了**实际可执行顺序**（不只形式 DAG）：`package.json` 的 `test:unit` 脚本在 T-05b 先建；T-05c `bootstrap` 自带单测，T-05e `harness-selftest` 明文"不是 T-05c 完成前提"（AN3-01 已消除循环）；`harness-selftest` 只依赖现有就绪流程 + 假后端（假后端写端点文件、`/health` 200、支持 `/shutdown`，与基线 `main.js` 的就绪/退出路径兼容），不依赖 T-05g/h 状态机；T-07d 的通知开关持久化由本任务 `prefs-ui` 自证，T-07e 只用预置偏好文件证明抑制效果（AN3-02 已消除）；T-10a/T-10b/T-10c 的 staging 自举已理顺（AN3-03）；T-05i `kill-shell-recover` 所需的 stdin EOF 经 T-05h ← T-02b 传递；T-05h `ready-quit` 的 `mcp_endpoint.json` 断言经 T-02c 传递；T-08d 依赖 T-06d（隐私流程含打开指引）；T-09c 依赖 T-08e（白名单生效后验证分区隔离）。**修订 4 复查**：41 项估时 1～2h、合计 61.0h（顺序表与任务块两处一致）；T-04b 2h 依赖不变；"A 对修订 4 的复查"是实施前置闸门而非验收循环；AN7-04（协调者给定 `<输入基线>` 并把四个规划文件同步到实施树）是协调者交接动作，A 同意其不构成任务间循环
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

## 复查记录（第 3 轮，Plan 修订 4，2026-10-28，A = `anthropic/claude-fable-5-1` via anthropic，会话 `01a183ba-241b-76cf-8588-b472ac61c90c`）

> 路由：`claude-bridge/claude-fable-5-1` 的 seven_day 限额在当前窗口已知耗尽（约 2026-10-30 重置），按 AGENTS §6.5 不重复探活；官方 `anthropic` 通道本轮最小真实调用成功。换通道不是换模型；未因发现问题更换模型。与修订 4 作者（`claude-opus-5-5`）、协调（`gpt-6.1-sol`）、Implement（`gpt-6-astra`）隔离。
> 固定输入：`1275ae2`；固定 HEAD：`981d4301f069f71dd120a1a86124dbe03aa54e0c`（分支 `review/desktop-shell-build-assets`，审核期间未移动、未提交、未 push）。本轮**只写入本文件**。

### 1. 核对范围与方法（全部只读 / 静态）

| 对象 | 方法 | 结果 |
|---|---|---|
| 真实 diff | `git diff --stat / --check / --exit-code 1275ae2 981d430` | 只四个规划文件变化；spec / backend / shell / packaging / docs / `.gitignore` / 本文件零差异；无空白错误；15 行删除全为 T-04b 相关行的替换 |
| 已安装源码 | `read` contrib `hook-pyarrow.py`、`PyInstaller/utils/hooks/__init__.py`（`collect_data_files` / `collect_dynamic_libs` / `collect_submodules` / `__exec_python_cmd`）、`depend/imphook.py` 第 95～145、415～425 行、`depend/analysis.py` 第 55～70 行、`building/build_main.py` 第 520～536 行、`config.py`、`pandas/compat/pyarrow.py` | 与 plan §7.5 第 1 段逐条相符（细节见 C-16 "修订 4 复查"） |
| 已安装 pyarrow | 目录枚举（`find`），未导入 | 唯一 `tests` 目录在包根；17 个非 `.py/.pyc` 文件 = 阻塞产物 `_internal/pyarrow/tests` 的 17 个文件；锚点文件 / DLL 存在 |
| 实施树保留产物（只读，`D:/2030/Futures-AI-desktop-implement`，HEAD `9ae2ad9`） | `find` / `rg` | 产物中唯一名为 `tests` 的目录是 `pyarrow/tests`；无 `pytest`/`_pytest` 目录；`PYZ-00.toc` 含 `pyarrow.conftest`、`pyarrow.tests`、`pyarrow.tests.util`（R4-01） |
| tasks.md 结构 | 脚本计数 | 41 行 / 41 块 / 61.0h / T-04b 4:4 / 每条含 AC / 2h |
| `.gitignore` | `git check-ignore -v --no-index` | 三个新路径均不被忽略 |
| 本文件 | `rg -c` | 41 `[x]` / 0 `[ ]`（开始与结束均如此） |

### 2. 受影响项的复查结论

| 请求 §3 项 | 复查结论 | 位置 |
|---|---|---|
| 1 C-02 / 一致性 | 保持勾选：spec 未动；修正在冻结 AC-001-4 与 §7.4 既有 `tests/` 规则之内；不需 Clarify / Gate 1 / 新 ADR | C-02、"spec/plan/tasks 无冲突"、"与 docs/ 决策与 ADR 无冲突" |
| 2 C-16 | 保持勾选：根因、hook 选择规则、`excludes` 语义、动态库模式、"只来自 datas"均经已安装源码与真实产物证实；仓库 hook 是最小标准机制；放弃方案理由成立 | C-16 |
| 3 C-17 / C-18 | 保持勾选：只针对已观测失败，无猜测性加固 / 新依赖 / 新抽象；AN7-02 只登记不处理恰当（A 已把"未核实"核实为事实，见 R4-01）；A 不授予工程批准 | C-17、C-18 |
| 4 C-19 | 保持勾选：回滚范围与写入 / 只读集合明确且三处一致 | C-19 |
| 5 C-20 / C-23 | 保持勾选：cwd 与"现有 / 待新增"准确；新路径不被忽略 | C-20、C-23 |
| 6 C-24 | 保持勾选：只在 `subprocess.run` 边界注入；hook 真实执行且无需 mock；参照规则非生产逻辑复制；skip 不算通过；§7.5 第 4 段充分且未夸大 | C-24 |
| 7 C-28 / C-29 / 模板 | 保持勾选：T-04b ≤ 2h、4:4、无后序承担、41 / 61h、历史计数未改写 | C-28、C-29、"任务粒度与验证命令" |
| 8 C-26 / C-27 | 保持勾选：11/12 与警告保留；外部边界未冒充取得 | C-26、C-27 |
| 9 analyze 迭代 7 | 结论"文档一致性通过（修订 4 范围）"与 §6 前置条件属实；迭代 1～6 原样保留；AN7-01～AN7-05 分级恰当 | —— |

### 3. 第 3 轮新增发现（均 P3，不阻塞 T-04b 修订 4 实施；不改模型、不改结论）

| # | 级别 | 位置 | 发现（A 独立取证） | 处置 |
|---|---|---|---|---|
| R4-01 | P3（接受，已由"未核实"变为事实） | plan §10 第三行、analyze AN7-02 | 实施树保留的阻塞构建 `build/pyinstaller/futuresai-backend/PYZ-00.toc` 含 `pyarrow.conftest`（第 7689 行）、`pyarrow.tests`（7752）、`pyarrow.tests.util`（7755）；来源链 = contrib / 仓库 hook 相同的 `hiddenimports`（`pyarrow.conftest` 不含 "tests" 字样）→ `conftest.py` 第 25 行 `from pyarrow.tests.util import …`。这是修正前已存在、修订 4 **不改变**的 PYZ 内两个纯模块，不生成文件系统目录，不在冻结 §7.4 / `package_exclusions()` 的扫描范围内；`warn-*.txt` 第 375 行显示其顶层 `import pytest` 已被排除，运行时无人导入 | 不要求 Implement 前处理（与授权和 §5.1 一致）。Review / Handoff 须按具体模块名登记为已知残余；若 Walter 希望连带剔除（如 hook 过滤 `pyarrow.conftest`），属授权外的一行改动，需先批准再改 Plan。作者下次触碰 plan 时可把"未核实"改为"已核实（A 第 3 轮）"，非前置 |
| R4-02 | P3（提示，不需改文档） | tasks T-04b 细则第 4 步 | PyInstaller 第 420 行用 `%r` 记录路径，Windows 下日志行形如 `Processing standard module hook 'hook-pyarrow.py' from 'D:\\…\\backend\\tools\\pyinstaller_hooks'`（反斜杠成对出现）；细则给出的 `rg -n "hook-pyarrow.py" <BUILD_LOG>` 能命中，但若实施者改用含单反斜杠路径的字面量 grep 会漏匹配 | 实施者按细则原命令取行、人工判读来源目录即可；证据中粘贴原始日志行 |
| R4-03 | P3（信息，已排除风险） | tasks T-04b 细则第 2 步顺序 | `tests/test_scan.py` 对整个 `backend/` 递归扫描 `.py/.yaml/.yml/.json/.toml/.md/.txt`，细则第 2 步全量回归在保留的 `backend/dist`、`backend/build` 存在时运行，而此前 451 passed 发生在产物生成之前。A 静态核对实施树产物与构建目录中的 40 个此类文本文件（含 `_internal/pyarrow/tests/data/orc/README.md`、`warn-*.txt`、adapter manifest / `.py` 副本）对三条凭证正则与 `series_id` 正则均零命中 | 不构成文档问题；若实施时该测试意外命中产物内第三方文本，属既有扫描范围问题，按停止规则报协调者，不得放宽扫描或手改产物 |

### 4. 本轮未改变的边界

- 修订 4 的 hook、接线、测试、干净重建、12/12 冒烟、产物清单对比**均未实施、未运行**；本轮不是 Converge、代码 Review 或 Gate 2，不认证任何运行时产物已修复。
- 实施输入：按 AN7-04，协调者须把四个规划文件同步到实施树并给出细则第 7 步 `<输入基线>`（含 T-04b WIP 的固定提交；`9ae2ad9` 源码字节与 `1275ae2` 相同）后，`openai/gpt-6-astra` 才可实施；Astra 开始前重读本文件全部 41 个复选框。
- 历史 T-01～T-06、第 2 轮 N-01～N-04、外部 / 人工证据缺口、Gate 2 状态均不变。
- 本轮 A 仅写入 `checklist.md`；未改 spec / plan / tasks / analyze / review / README / HANDOFF / 源码 / 测试 / 已安装包，未运行测试、构建、hook、npm，未导入 pyarrow，未联网，未提交。

## 结论

- **第 3 轮（修订 4）**：需求 / Plan / Tasks 质量**达标，Checklist 通过（41/41，受影响项复查后保持勾选）**；无 P1/P2，新增 R4-01～R4-03 三项 P3（接受并跟踪）。修订 4 不需回 Clarify / Gate 1、不需新 ADR、不需 AGENTS §5.1 额外批准（Walter 对该构建修正的授权记录于 plan §0 修订 4；A 不授予更大范围）。**仅对 T-04b 修订 4 的 Implement 文档前置条件成立**，不是 feature 完成、Converge、Review 或 Gate 2。
- 历史（第 2 轮）：需求 / Plan / Tasks 质量：**达标，Checklist 通过（全部 41/41）**。初轮 P2（F-01、F-02）与 P3（F-03～F-07）全部经 A 对照修订 3 内容与源码事实确认闭合；协调者提出的验收循环（T-05c/T-05e、T-07d/T-07e）、打包自举（T-10a～T-10c）与 AC 引用缺失均已在最终 tasks 中修复；AC-005-3 的"预填 / 缺项引导"缺口已由 T-03c + T-06d 真实覆盖。无需回 Clarify / Gate 1，无需新 ADR，无需 AGENTS §5.1 单独批准的新增复杂度（A 不授予也未发现此类项）。
- **Implement 文档前置条件满足**，可交 `openai/gpt-6-astra`（回退仅限调用失败：`deepseek/deepseek-flash`）。
- 本文件**不是** Gate 2，**不是**代码通过结论，**不**认证历史 T-01～T-06 的执行，**不**代表任何自动化或人工验收已取得。
