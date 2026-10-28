# HANDOFF — agent 工作流重塑（Review 通过、Gate 2 已确认；合入 main 集成中，待独立复核 / 提交 / PR）

> 文档同步（Plan / Converge，历史）= openai/gpt-6.1-sol via openai；前作者 anthropic/claude-opus-5-5 正式调用超时后接续。
> Handoff 文档集成 = anthropic/claude-opus-5-5 via anthropic（bridge 本窗口额度耗尽、不重复探活；同模型 API 最小探活成功），接续 `4aaf019`、合入 `origin/main` `44845c8`；真实路由见 `docs/plan.md` §9，集成记录见本文 §9。
> **当前状态**：Gate 2 已由 Walter “继续”确认；merge 冲突已在工作树整合，**尚未独立集成复核 / 提交 / 开 PR / 合并**。以下 §1–§7 中“未 push / merge”“Gate 2 待确认”等为 Gate 2 前暂停阶段的历史记录。

- 本轮：恢复会话同步记录（沿用 2026-10-28 任务背景，不另推断批准时间）
- 工作树：`D:/2030/Futures-AI-docs-agent`（分支 `docs/agent-workflow-reshape`，文档已本地提交，**未 push / merge**）
- 分支来源基线：`docs/interaction-v2` @ `4ebb76b`（第二轮 docs 分支，本分支叠在它之上；跨分支集成本轮未做）
- 本轮接续基线：`88ff28b`；协调者停止前作者超时进程树后，回退作者核查并接续其 AGENTS / designUI / architecture 三份 partial。
- 文档受审提交：`f20fdfb`；审核工作树 `D:/2030/Futures-AI-docs-reshape-review`（detached 于该提交，干净只读）。最新提交记录用 `git log -2 --oneline` 查看，受审提交之后只补审核 / 验证记录。
- 本轮未启动产品服务，未修改 provider / 全局配置；作者不提交，协调者创建本地受审快照并另记审核结果。**未 push / merge，Gate 2 待 Walter 确认**（历史，已由 §9 接替）。

## 1. 任务目标与当前进度

**目标**：把 Walter 对 brainstorm 七问的裁决转成 ADR + 同步 docs，其余想法进候选池。拆分（Walter "按建议来"）：
六项裁决 → 5 份 ADR（D-020～D-024）+ 同步 `interaction.md` / `plan.md` / `architecture.md` / `designUI.md` / `AGENTS.md`；未决想法 → `docs/agent/candidates.md`。

**进度：文档补齐与一致性对照已收敛，已本地提交；独立 Review 通过（0 个 P1/P2，9 个 P3），Gate 2 待 Walter 确认。** Walter 已回复 **“以上按建议全部接受”**：原 §6 四组设计问题均已接受（见现 §6 与 `docs/plan.md` §9），不再请求重复裁决。该设计批准早于独立审核，不冒充评审后的 Gate 2，也不替代其他 feature Gate，不表示功能已实现。

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
| 一致性复查 / commit / PR | ✅ 作者自查与协调者复跑完成（§2）、本地受审提交 `f20fdfb`、独立 A 审核通过（§8）；✅ Gate 2 已由“继续”确认（§9）；⏳ 合入 main 冲突已在工作树整合，独立集成复核 / 提交 / PR / 合并未做 |

## 2. 已完成：改动文件、基线与真实验证

- `88ff28b` 已含五份 ADR 与 interaction / plan / architecture 第三轮设计，本轮历史 ADR 不改。
- 相对 `88ff28b` 的受审提交 `f20fdfb` 包含：`AGENTS.md`、`HANDOFF.md`、`docs/architecture.md`、`docs/designUI.md`、`docs/plan.md`、`docs/interaction.md`、`specs/README.md`；新增 `docs/agent/candidates.md`。仅在授权清单内写文档。
- `f20fdfb`：`docs: 补齐 agent 工作流重塑文档与候选池（D-020～D-024）`；审核后仅补本文件与 `docs/plan.md` 的记录，不修改受审产品规则。未 push / merge。

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

第一次图宽诊断因 Windows Python 默认 GBK 无法输出 ↕ 字符而中止；后续命令设 `PYTHONIOENCODING=utf-8` 后完成全部断言。协调者再次独立运行 Python 内联断言，复核八份修改范围、26 项候选、五份 ADR、四文档章节、29×66 架构图与内框、AGENTS §6 原样、活文档无旧术语、Brier 方向，全部通过。A 另运行 `git diff --check 4ebb76b..f20fdfb`，rc=0。未新增脚本 / 工具 / 包，纯 docs 未运行后端业务测试，不声称业务测试通过。

## 3. 已执行顺序与剩余工作

本轮按原交接顺序执行：A 复读架构补丁并实测图宽 → B 核查 UI → C 核查 AGENTS 最小同步 → D 建 26 项候选池 → E 补跨 feature 待同步表 → F 一致性复查与必要小修 → G 总方案批准 / 路由记录 → H 更新本交接。候选原清单全部迁入 `docs/agent/candidates.md`，不再复制维护；原清单中 A3 / 情景的高层已决与细节候选已明确区分。

协调者已完成本地受审提交与独立审核，剩余事项如下：

1. **独立 Review 已完成**：A = `claude-fable-5-1 via anthropic`，新会话、独立 detached 工作树只读检查固定提交 `f20fdfb`（包含已跟踪候选池）；结论通过，无 P1/P2，九个 P3 见 §8。作者自查与 A 结论分开记录。
2. **Gate 2（历史：当时待确认；现已由“继续”确认，见 §9）**：本轮仅创建本地受审快照与审核记录提交，不 push / merge，不把原设计批准或本地 commit 当作评审后批准。P3 当前只登记，不擅自确定涉及自主度、call 生命周期、冷启动生效等产品行为。
3. **后续跨分支集成**（历史描述；现状见 §9：`docs/interaction-v2` 已经 PR #6 合入 main，本分支正合入 `44845c8`）：Walter 已接受由协调者负责，先 `docs/interaction-v2` 再本分支；本轮未查询或修改其他工作树，也未开 PR / 解决冲突。AGENTS §2.1 / §6 最终统一成一份规范，不丢既定纪律；语义冲突解决后回 Analyze / Converge 复核。
4. **feature 承接**：按 `specs/README.md` 待办进入各自 Clarify / Gate 流程。settings 默认档、日报菜单是否改名等仍由相应 spec 确认，不把本次文档设计批准冒充 feature Gate。
5. **P3 后续线索**：九项均已登记到 §8；其中 `docs/plan.md` §6 “五层”实列四层是基线既存问题，本轮不改层次设计。其余进入对应后续 feature Clarify / 任务，不追加当前冻结 AC。

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
4. **原问题：PR 顺序与 AGENTS.md 路由冲突由谁解？结论：协调者后续集成，先 interaction-v2 再本分支，最终一份规范、不丢纪律；本轮不处理冲突、不 push / merge。**（“本轮不 push / merge”为当时暂停阶段限制，已由 §9 的“继续”授权接替。）

## 7. 下次恢复后的第一句话

“第三轮文档 `f20fdfb` 经独立 A 审核通过（0 个 P1/P2、9 个 P3，见 §8），Gate 2 已由 Walter ‘继续’确认，九项 P3 为后续事项。本分支正合入 main `44845c8`，`docs/plan.md` / `docs/designUI.md` 冲突已在工作树整合（§9）；下一步由协调者做独立 Analyze / Converge 集成复核，再提交 merge、开 PR 并合并到 main。”

（历史第一句话，Gate 2 前：“第三轮文档补齐已本地提交 `f20fdfb`，独立 A 审核通过（0 个 P1/P2、9 个 P3），结果见 HANDOFF §8；原四组设计建议已批准，不再重复提问。当前只补审核记录，未 push / merge；下一步请确认评审结论（Gate 2），随后再按已批准顺序做跨分支集成。”）

## 8. 独立 Review 结果与后续线索

- **A = claude-fable-5-1 via anthropic**；与文档作者不同模型、新会话，独立 detached 工作树只读。
- 路由：bridge 本窗口已确认额度耗尽，不重复尝试；Fable 的同模型 API 最小探活与正式审核均成功，无审核模型回退。
- 固定基线 `4ebb76b` / 接续基线 `88ff28b` / 受审 `f20fdfb`。A 审查整轮 13 文件真实 diff、接续八文件 diff、五份新 ADR 与 D-018 / D-019、最终四份 docs、AGENTS、候选池、specs README 与交接；不审其他工作树的功能实现。
- **结论：通过，仅 P3，无 P1/P2。** 已批准项均已落文，未发现实质矛盾、越权、冻结 spec 追加 AC 或历史 ADR 改写。本轮文档与已批准项的对照已收敛；不等于后续 feature 已实现或 Gate 2 已批准。
- A 实际验证：`git diff --check 4ebb76b..f20fdfb` rc=0，冻结 spec / AC / checklist 与历史 ADR 的保护 diff 为空、AGENTS §6 未动；未运行业务测试或全仓库链接检查。

以下是 A 原结论的摘要与最小建议，不表示 Walter 已接受风险或已批准新的行为。九项全保留为后续线索；涉及产品语义的选项回相应 feature Clarify，不静默补设计。

| 编号 | 级别 | 位置与问题 | 后续线索（未实施） |
|---|---|---|---|
| A-P3-1 | P3 | `docs/interaction.md` §4.1 / §11.2 称教练生成复盘草稿，§9.6 与 `architecture.md` §8-11 是教练排程、格物生成 | 后续统一生成者与排程者措辞，勿据此扩大值班员写学习笔记权限 |
| A-P3-2 | P3 | `docs/architecture.md` §5.2 新增 `call_propose` / `decision_log`，§5.5 未明确分配调用角色 | workflow / 交付物 spec 明确定稿节点的调用方与权限；不在本轮选定角色或扩权 |
| A-P3-3 | P3 | `docs/interaction.md` §11.4 未明确定义 A1 下常驻职责是否运行、超预算降级后的产物去向 | settings / standing-desk Clarify 明确 A1 行为；不能把“建议默认 A1”自行解释成自动运行授权 |
| A-P3-4 | P3 | `docs/plan.md` §8 Phase 1 角色骨架未列 bootstrap 蒸馏员，冷启动确认规则的注入生效时点与 Phase 2A 协议 v1 边界不清 | playbook-bootstrap spec 确认蒸馏员访谈角色与最小注入范围 / 时点；不将 Phase 1 proposed 等同已执行协议 |
| A-P3-5 | P3 | `docs/interaction.md` §3.6 / §9.2 / §12.3 crux 可直接登记 call，而主路径从定稿起算 | Phase 2D spec 明确 crux-call 登记时机、作者与校准归属；不在此补未经批准的生命周期 |
| A-P3-6 | P3 | D-022 / `docs/interaction.md` §11.2 写“共识地图后置”，`docs/agent/candidates.md` C-07 为未决 candidate | 后续注明“后置提及”不代表已冻结范围，仍按候选晋升流程；历史 ADR 不改 |
| A-P3-7 | P3 | D-023 影响清单提及 `architecture.md` §5.2 persona 配置暴露，实际只在 §2 / §5.5 有落点 | 后续明确主体配置是否经 MCP，避免误读影响清单；不擅自新增工具或改 ADR |
| A-P3-8 | P3 | `docs/designUI.md` §3.4 平衡表为 Phase 2A 世界模型视图，现行 / 目标分隔及跨 feature 导航不如焦点带明确 | frontend-workbench Clarify 核实既有平衡表范围；以待办说明未来目标，不追加冻结 AC |
| A-P3-9 | P3（既存） | `docs/plan.md` §6 “五层”实列四层，`4ebb76b` 已存在 | 后续措辞修正，不改层次设计 |

其他仍待 spec 确认：自主度档位名与默认档、每日 / 每台预算、常驻职责集与议程排序、状态枚举、满意度护栏阈值、校准入口；候选池不是实施入口。本轮不新建 feature spec 目录，不勾 checklist，不代替任何 feature Gate。

## 9. Gate 2 确认与 Handoff 集成（进行中）

- **Gate 2**：协调者向 Walter 说明“当前停 Gate 2 等确认，尚未推进 PR / 集成”后，Walter 回复原话 **“继续”**（承接评审汇报）。据此确认 A 对 `f20fdfb` 的评审结论；§8 九项 P3 接受为后续事项，清单不变、未修复、不擅自决定其产品行为；不冒充其他 feature Gate。此前“不 push / merge”为暂停阶段限制，已被本次授权接替，当前允许提交 / PR / push / merge（由协调者执行）。
- **前置 PR**：`docs/interaction-v2` 已经 PR #6 于 2026-10-28 合入 main（head `4ebb76b`，merge `3bf6476`），不重复开 PR。
- **主线与基线**：`origin/main` = `44845c8`（PR #7 frontend-workbench v1 + PR #8 H-01）；本分支 HEAD `4aaf019`，`git merge --no-commit --no-ff origin/main` 进行中（MERGE_HEAD `44845c8`）。main 引入文件由 Git 自动合并 / 暂存，本作者未改。
- **AGENTS.md**：main 为 `4ebb76b` 版 §6，仅一份路由、无 §2.1 并存，自动合并无冲突，无需解冲突；desktop-shell 尚在其他分支，未来合入须保留单一路由与既定纪律，本轮不改。
- **集成作者**：`anthropic/claude-opus-5-5`（bridge 本窗口额度耗尽不重复探活；同模型 API 最小探活成功；不派生 agent、不改 provider / 全局配置）；只写 `docs/plan.md`、`docs/designUI.md`、`HANDOFF.md`。

冲突逐处选择（并列保留已批准内容，不整文件取 ours / theirs）：

| 位置 | 选择 | 理由 |
|---|---|---|
| `docs/plan.md` §3 D-015 | 取 main 正式行 | frontend-workbench v1 已完成重编号并合入；退回“预留”会抹掉完成事实 |
| `docs/plan.md` §3 D-016 | 取本分支“原始三层（现由 D-020 扩为四层）” | main 行为旧口径；本分支口径已经 A 审核 |
| `docs/plan.md` 编号说明之后 | main 完成记录 + 本分支第三轮 / 候选池句并存 | 两者是不同事实，互不替代 |
| `docs/designUI.md` §3.10 | 本分支“变更”行（含 D-022 Phase 2B 目标）+ main“已交付地基（frontend-workbench v1）”整条 | 后者承载现行 8 项菜单与未来 9 项菜单的区分；D-022 仍为 Phase 2B 目标，不追加 v1 AC |
| `docs/designUI.md` §6 | main 全部 UI 资产链接与采用边界 + 本分支 D-020～D-023 新增组件行 | 本分支令牌 / 桌面适配两行与基线相同，由 main 加链接版取代，无内容丢失 |

自动合并区核查：`designUI.md` §2.1 玻璃边子范围注、§2.2 D-015 作用域正式内容、§2.3 配色链接、§8 移植链接均为 main 版；`specs/README.md` 保留 main frontend-workbench done 行与本分支跨 feature 待同步表。

集成观察（未决，不修改、不做产品选择）：D-022 的 Phase 2B 目标把焦点带改为晨间议程头部，main v1 焦点带按 D-015 分“行情 | 指标”两段；两者届时如何共存由 frontend-workbench v2 / 常驻研究台相关 spec 的 Clarify 决定。

**未完成**：独立 Analyze / Converge 集成复核、提交 merge、开 PR、合并到 main，结果由协调者后补。A 的结论只覆盖 `f20fdfb`，未审本次 merge。
