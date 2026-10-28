# HANDOFF — agent 工作流重塑（第三轮文档同步待独立 Review）

> 文档同步（Plan / Converge）= openai/gpt-6.1-sol via openai；前作者 anthropic/claude-opus-5-5 正式调用超时后接续，真实路由见 `docs/plan.md` §9。

- 本轮：恢复会话同步记录（沿用 2026-10-28 任务背景，不另推断批准时间）
- 工作树：`D:/2030/Futures-AI-docs-agent`（分支 `docs/agent-workflow-reshape`，WIP，**未 push**）
- 分支来源基线：`docs/interaction-v2` @ `4ebb76b`（第二轮 docs 分支，本分支叠在它之上；跨分支集成本轮未做）
- 本轮接续基线 / 当前 HEAD：`88ff28b`；协调者已停止前作者超时进程树，交接时仅 AGENTS / designUI / architecture 三份未提交改动，无其他写入者。
- 本作者未派生 agent、未启动服务或后台任务，未修改 provider / 全局配置；**未 commit / push / merge**。

## 1. 任务目标与当前进度

**目标**：把 Walter 对 brainstorm 七问的裁决转成 ADR + 同步 docs，其余想法进候选池。拆分（Walter "按建议来"）：
六项裁决 → 5 份 ADR（D-020～D-024）+ 同步 `interaction.md` / `plan.md` / `architecture.md` / `designUI.md` / `AGENTS.md`；未决想法 → `docs/agent/candidates.md`。

**进度：本轮 A–H 文档同步与作者自查完成，待独立 Review。** Walter 已回复 **“以上按建议全部接受”**：原 §6 四组问题均已接受（见现 §6 与 `docs/plan.md` §9），不再请求重复裁决。设计批准不替代其他 feature Gate 1 / Gate 2，不表示功能已实现。

| 项 | 状态 |
|---|---|
| ADR D-020 真值锚与结果校准 `docs/decisions/20261028-outcome-calibration.md` | ✅ 已写 |
| ADR D-021 世界模型 `docs/decisions/20261028-world-model.md` | ✅ 已写 |
| ADR D-022 常驻研究台与自主度 `docs/decisions/20261028-standing-desk-autonomy.md` | ✅ 已写 |
| ADR D-023 多主体协作 `docs/decisions/20261028-multi-persona-collaboration.md` | ✅ 已写 |
| ADR D-024 协议冷启动 `docs/decisions/20261028-playbook-bootstrap.md` | ✅ 已写（已修"拍脑袋"错别字） |
| `docs/interaction.md` | ✅ 已改：头注、§1.3（五条→七条原理）、§2.1（核心对象 +4）、§2.2 图、§2.3（三层→四层 + 护栏）、§2.4、§3.2 扩展、§3.4（`basis` + `slot_fix/decision/interview`）、§3.5、§3.6、§3.7、§4.1/4.3/4.4、§5.1、§5.2（L3.5）、§6.1/6.2/6.3/6.4（结果指标 + 护栏）/6.5、新 §6.6、§7.1、§8.1、新 §9 结果校准、§10 世界模型、§11 常驻研究台与自主度、§12 多主体 |
| `docs/plan.md` | ✅ 已改：§1 目标、§2（+5 条）、§3 表 +5 行、编号说明、§4 docs 树、§5 目录、§6、§7.2、§7.4、§8（Phase 1 加 playbook-bootstrap；2A/2B/2C 扩；新 2D；3/4 扩；排序原则 2 修订 + 新增 5–8）、§9 第三轮确认记录、§10 风险 +6 |
| `docs/architecture.md` | ✅ 已复读 `4ebb76b..88ff28b` 补丁与当前文件；保留前作者对齐修正和必要路径一致性修正，§1 图实测 29 行均 66 显示列，三个内框列位置对齐，无需再改 |
| `docs/designUI.md` | ✅ 核查保留前作者可用改动：议程 / 收件箱、校准 / 决策日志、世界模型、多主体、自主度预算、透明页访谈与规则来源、三类新块与组件；九项菜单不变，Phase 1 现行设计与 Phase 2B 目标分开，不追加冻结 spec AC |
| `AGENTS.md` | ✅ 核查保留 §0 / §1 / §3 最小同步；§6 与 `88ff28b` 完全相同，不处理跨分支规范冲突 |
| `docs/agent/candidates.md` | ✅ 新建：六项已晋升映射、26 项 candidate；A3 沙箱 / 情景树区分已决高层与候选细节，研究回放为 Phase 2C 既有 asof 复盘的增强 |
| `specs/README.md` 跨 feature 待同步表 | ✅ 加 D-024 冷启动、D-022/023 settings 后续版、D-020 新块与 D-022 日报入口 / 命名待办；不改变冻结 spec / AC 或替其他树批准 Gate |
| `docs/interaction.md` 本轮小修 | ✅ 区分用户显式定稿与 agent call 自动登记（不等于用户认可），澄清新分析作业确认；修正指标方向为 Brier ↓ / 命中率 ↑ |
| `docs/plan.md` 本轮补记 | ✅ §9 记录四组全部接受及实际路由 / 超时回退，§3 区分 D-016 原始三层与 D-020 当前四层口径 |
| 一致性复查 / commit / PR | ✅ 作者文档自查完成（§2）；❌ 独立 Review、本地提交与跨分支集成未做，不 push / merge |

## 2. 已完成：改动文件、基线与真实验证

- `88ff28b` 已含五份 ADR 与 interaction / plan / architecture 第三轮设计，本轮历史 ADR 不改。
- 相对 `88ff28b` 的未提交文件：`AGENTS.md`、`HANDOFF.md`、`docs/architecture.md`、`docs/designUI.md`、`docs/plan.md`、`docs/interaction.md`、`specs/README.md`；新增 `docs/agent/candidates.md`。仅在授权清单内写文档。
- 本轮无新 commit；HEAD 仍为 `88ff28b`，未 push / merge，不预写最终 hash。

实际执行的文档验证（作者自查，不是独立 Review / Gate 2）：

| 验证命令 / 方法 | 实际结果 |
|---|---|
| `git diff --check` | 通过，无空白错误；最终复跑仅有 HANDOFF.md 将由 LF 转 CRLF 的 Git 提示，不是校验失败 |
| `rg -n -e '三层自迭代' -e '自迭代三层' -e '五个对象' -e '五条第一性' -e '发布快照' -e '批准发布' docs AGENTS.md` | 仅历史 ADR D-016 / D-020 各一处旧三层描述；当前活文档无命中。§3 D-016 行已注明原始三层由 D-020 扩为四层 |
| `rg -n -e '^## [0-9]' -e '^### [0-9]' docs/interaction.md docs/architecture.md` + 临时 Python 内联脚本 | 标题已列出；interaction / architecture / designUI / plan 主 / 子编号连续；99 处显式“文件 + 首个章节号”引用存在，范围与上下文引用另按章节表人工复核（不是全仓库链接检查） |
| 临时 Python 内联：候选行正则与连续序列断言 | 26 行，C-01…C-26 连续、唯一，状态全为 candidate |
| 临时 Python 内联：扫描 ADR 标题并核文件存在 | D-020…D-024 各唯一文件 / 标题，五份独立 ADR 均在 |
| 临时 Python 内联：`unicodedata.east_asian_width`（W/F=2，其余=1） | 架构 §1 外框 29 行均 66 显示列；三组内框边界分别为 `[0,3,18,35,58,65]` / `[0,3,22,41,58,65]` / `[0,3,18,65]`，各组一致 |
| `rg` 分期 / Brier / 核心边界复核 | Phase 1 冷启动、1.5 协作骨架、2A 槽位投影、2B 值班与 calls、2C 复盘校准、2D 多主体求解、4 A3 保持；Brier ↓ / 命中率 ↑；定稿 / call、议程不回流、两视图 / L3.5 / 人填保护、自主度预算、主体来源、bootstrap 门槛已对照权威段落 |
| 内联脚本比对 `git show 88ff28b:AGENTS.md` §6；`git diff --name-only 88ff28b -- 'specs/*/' docs/decisions/` | §6 原样保留；冻结 spec / checklist 与历史 ADR 无改动 |

第一次图宽诊断因 Windows Python 默认 GBK 无法输出 ↕ 字符而中止；后续命令设 `PYTHONIOENCODING=utf-8` 后完成全部断言。未新增脚本 / 工具 / 包，纯 docs 未运行无关后端测试，不声称业务测试通过。

## 3. 已执行顺序与剩余工作

本轮按原交接顺序执行：A 复读架构补丁并实测图宽 → B 核查 UI → C 核查 AGENTS 最小同步 → D 建 26 项候选池 → E 补跨 feature 待同步表 → F 一致性复查与必要小修 → G 总方案批准 / 路由记录 → H 更新本交接。候选原清单全部迁入 `docs/agent/candidates.md`，不再复制维护；原清单中 A3 / 情景的高层已决与细节候选已明确区分。

剩余工作由协调者处理，本作者不继续派工、提交或集成：

1. **独立 Review**：按 AGENTS §6 新开隔离只读审核会话，固定受审基线与真实 diff（新建 candidates 为未跟踪文件，须显式纳入审查，不可只看 `git diff`）；本轮作者自查不是 A 的审核结论。发现 P1/P2 仍须修复与复查，不因验证失败换模型求通过。
2. **本地提交**：独立 Review 与所需人工确认完成后，由协调者按授权决定本地提交，补最终 hash。本作者未 commit，不用 `git add -A` 混入其他工作；本轮仍不 push / merge。
3. **后续跨分支集成**：Walter 已接受由协调者负责，先 `docs/interaction-v2` 再本分支；本轮未查询或修改其他工作树，也未开 PR / 解决冲突。AGENTS §2.1 / §6 最终统一成一份规范，不丢既定纪律；语义冲突解决后回 Analyze / Converge 复核。
4. **feature 承接**：按 `specs/README.md` 待办进入各自 Clarify / Gate 流程。settings 默认档、日报菜单是否改名等仍由相应 spec 确认，不把本次文档设计批准冒充 feature Gate。
5. **范围外既存问题（只报告）**：`docs/plan.md` §6 写“五层”但箭头只列 Shell / Frontend / Backend / Storage 四层；这是既存表述问题，本轮不改层次设计，留后续确认措辞。

## 4. 需要重启的命令 / 端口 / 日志

本作者未启动服务、构建或长任务，无需重启。前作者 600 秒正式调用超时，进程树已由协调者停止；不重复探活已耗尽通道。真实失败类别和回退记录见 `docs/plan.md` §9，仅记脱敏摘要。

## 5. 临时产物

本作者只运行临时 Python 内联验证，未落盘脚本或引入工具 / 包。原交接称 `_patch_arch.py` 已删除；本轮未重建。提示文件由协调者置于仓库外临时目录，不入库。

## 6. 原裁决问题与已接受记录（无需再问）

Walter 本轮回复 **“以上按建议全部接受”**。保留原四组问题的议题与结论如下，当前状态均为已接受；具体记录亦见 `docs/plan.md` §9。

1. **原问题：裁决之外的细则是否接受？结论：全部接受**（原议题来自 ADR 结论，以下为按批准口径记录）：
   - D-020：agent 的 call **随用户显式定稿自动登记，不另逐条确认**（不自动定稿、登记不代表用户认可）；`basis=private` 不要求溯源、不计来源校准；“镜子”可关；满意度指标作护栏并“显著恶化即回退”（阈值由 feature spec 定）。
   - D-021：模型**必含两视图**（基本面 / 市场隐含，"与市场的分歧"为一等查询）；新增闸门 **L3.5** 只标不拒；人填槽位 agent 不覆盖。
   - D-022：自主度分 **A0–A3** 四档，建议默认 **A1 提案**（具体档位名与默认档仍由 settings spec 确认）；A3 自扩展放 Phase 4；新增**值班员**角色；“日报”菜单项是否改名留给 frontend-workbench v2 Clarify。
   - D-023：主体与 D-019 角色**正交**（不是新角色表）；新增**裁判员**角色；作业树由引擎创建；红队产物不是介入事件。
   - D-024：历史产出入**派生区（作者 = 人、不计独立证据）**；历史立场**不生成 call**；首启访谈可跳过 / 重做，bootstrap proposed 经透明页确认、不自动 active。
2. **原问题：五份 ADR 是否合并？结论：保留 D-020～D-024 五份独立 ADR，不合并。**
3. **原问题：Phase 2D 是否接受或并入 2B/3？结论：保留 Phase 2D（多主体与求解）。**
4. **原问题：PR 顺序与 AGENTS.md 路由冲突由谁解？结论：协调者后续集成，先 interaction-v2 再本分支，最终一份规范、不丢纪律；本轮不处理冲突、不 push / merge。**

## 7. 下次恢复后的第一句话

“第三轮文档同步和作者自查已完成，未提交，HEAD 仍为 `88ff28b`；你已接受原四组建议，不再重复提问。接下来由协调者安排独立 Review，重点检查已决 / 候选边界、分期与冻结 spec 保护、定稿 / call / 议程生命周期；本轮不 push / merge，跨分支集成尚未做。”
