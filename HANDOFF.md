# HANDOFF — agent 工作流重塑（第三轮裁定落 docs）

- 写于：2026-10-28 17:xx（暂停交接）
- 工作树：`D:/2030/Futures-AI-docs-agent`（分支 `docs/agent-workflow-reshape`，WIP，**未 push**）
- 基线：`docs/interaction-v2` @ `4ebb76b`（**未合并到 main** 的第二轮 docs 分支；本分支叠在它之上）
- 无后台进程、无服务、无端口、无 /tmp 产物。

## 1. 任务目标与当前进度

**目标**：把 Walter 对 brainstorm 七问的裁决转成 ADR + 同步 docs，其余想法进候选池。拆分（Walter "按建议来"）：
六项裁决 → 5 份 ADR（D-020～D-024）+ 同步 `interaction.md` / `plan.md` / `architecture.md` / `designUI.md` / `AGENTS.md`；未决想法 → `docs/agent/candidates.md`。

**进度：约 60%。** 卡在"architecture.md 刚打完补丁，designUI.md / AGENTS.md / candidates.md / specs/README.md 还没动，整体一致性未复查"。

| 项 | 状态 |
|---|---|
| ADR D-020 真值锚与结果校准 `docs/decisions/20261028-outcome-calibration.md` | ✅ 已写 |
| ADR D-021 世界模型 `docs/decisions/20261028-world-model.md` | ✅ 已写 |
| ADR D-022 常驻研究台与自主度 `docs/decisions/20261028-standing-desk-autonomy.md` | ✅ 已写 |
| ADR D-023 多主体协作 `docs/decisions/20261028-multi-persona-collaboration.md` | ✅ 已写 |
| ADR D-024 协议冷启动 `docs/decisions/20261028-playbook-bootstrap.md` | ✅ 已写（已修"拍脑袋"错别字） |
| `docs/interaction.md` | ✅ 已改：头注、§1.3（五条→七条原理）、§2.1（核心对象 +4）、§2.2 图、§2.3（三层→四层 + 护栏）、§2.4、§3.2 扩展、§3.4（`basis` + `slot_fix/decision/interview`）、§3.5、§3.6、§3.7、§4.1/4.3/4.4、§5.1、§5.2（L3.5）、§6.1/6.2/6.3/6.4（结果指标 + 护栏）/6.5、新 §6.6、§7.1、§8.1、新 §9 结果校准、§10 世界模型、§11 常驻研究台与自主度、§12 多主体 |
| `docs/plan.md` | ✅ 已改：§1 目标、§2（+5 条）、§3 表 +5 行、编号说明、§4 docs 树、§5 目录、§6、§7.2、§7.4、§8（Phase 1 加 playbook-bootstrap；2A/2B/2C 扩；新 2D；3/4 扩；排序原则 2 修订 + 新增 5–8）、§9 第三轮确认记录、§10 风险 +6 |
| `docs/architecture.md` | ✅ 刚打完补丁（22 处）：§1 图、§2 表、§4.1 表、§4.4 目录（`calibration/` `agenda/`）、§4.6、§4.7（L3.5）、新 §4.8 世界模型、§5.2 工具、§5.5（值班员 / 裁判员 / 主体 / 自主度 / 访谈模式）、新 §5.6 常驻作业、§6、§8 数据流 10–14、§9 安全。**未人工复读**，§1 ASCII 图宽度可能微错位 |
| `docs/designUI.md` | ❌ 未动 |
| `AGENTS.md` | ❌ 未动 |
| `docs/agent/candidates.md` | ❌ 未建 |
| `specs/README.md` 跨 feature 待同步表 | ❌ 未加行 |
| 一致性复查 / commit / PR | ❌ 未做（本次交接只做 WIP commit） |

## 2. 已完成：改动文件、commit、验证

- 改动文件（本分支 vs 基线 `4ebb76b`）：
  - 新增：上表 5 份 ADR
  - 修改：`docs/interaction.md`、`docs/plan.md`、`docs/architecture.md`
  - 本文件 `HANDOFF.md`
- commit：见 `git log --oneline -1`（WIP commit，交接时打）
- 验证：仅做了补丁脚本的"每处恰好匹配 1 次"校验（22/22）；无自动化测试（纯 docs）。**尚未做**：跨文档引用一致性 grep、ASCII 图对齐、错别字扫描。

## 3. 下一步（按顺序，可直接执行）

工作目录一律 `cd D:/2030/Futures-AI-docs-agent`。

1. **复读 architecture.md 补丁结果**：`git diff HEAD~1 -- docs/architecture.md`；重点看 §1 图三行（`状态机/版本/介入`、`DuckDB(...)`、`learning/ clips/ ...` 拆成两行）的边框对齐，手工调空格。
2. **改 `docs/designUI.md`**（按 ADR "影响"节）：
   - §1 原则加一条：结果 / 校准 / 议程是界面元素（或并入第 11 条）
   - §3.1：说明"日报"菜单项承载晨间议程 + 日报导出，**是否改名留给 frontend-workbench v2 Clarify**（不改菜单九项）
   - §3.2：焦点带 = 晨间议程头部（D-022）
   - §3.4 表加行：收件箱 / 议程、校准看板 + 决策日志、平衡表页 = 世界模型视图（两视图 / 残差 / 冲突 / 陈旧徽 / 人填）、分析台辩论视图、自主度与预算设置、"Agent 学到的"加访谈入口 + 镜子开关 + 规则来源 / 校准
   - §3.6：CoT 角色芯片带主体 `agent:<角色>@<主体>`
   - §5.2 块表加三行：观点块（方向 + 失效条件 + 时限 + 置信 → 锚 call）、call 块（→ call id / 裁决）、决策块（→ 决策日志）
   - §6 新增组件：议程卡、call 卡、校准表、槽位卡、陈旧徽、分歧地图、主体卡、自主度开关
   - §7：交付物类型加"晨间议程（不定稿）"，日报改"导出模板"
3. **改 `AGENTS.md`**（最小改动）：§0 加一句（常驻值班 / 世界模型 / 结果校准用户优先 / 多主体 / 自主度分级）；§1 文档地图加 `docs/agent/candidates.md` 行；§3 加 5 条决策（D-020～D-024）。注意本分支 AGENTS.md 是 `docs/interaction-v2` 版本（模型路由在 §6），与 `feat/desktop-shell` 的 §2.1 版本有分歧——不要在本分支解决，PR 时处理。
4. **新建 `docs/agent/candidates.md`**：候选池。结构：说明 + "已晋升"映射表（brainstorm 条目 → D-0xx）+ 候选表 `C-xx | 名称 | 一句话 | 依赖 | 状态 candidate`。候选清单（来自 brainstorm 汇报，均未决策）：分析即代码 / 协议可回测；问题图谱；研究回放（asof 时光机，与 Phase 2C 复盘 asof 衔接）；纸面组合；研究提案结构化（阶段 0）；A3 沙箱规范；共识地图；修订情报（源修订偏差）；政权检测；口径翻译；解释变化（因果叙事）；历史类比；框架翻译；情景树（D-021 后置项追踪）；响应式交付物自动起草增量；"需要你决定的三件事"交互形态；已知的未知地图；费曼模式；知识半衰期策略与主动复核；叙事时间线；协议包 / 人格市场（商业化）；介入理由追问；弱信号（看 / 跳 / 复制 / 沉默）；券商账户导入；跨用户匿名校准基准；模块背后站 agent（点击即解释）。
5. **`specs/README.md` 跨 feature 待同步表加行**：D-024 → 新 feature `playbook-bootstrap` 待起 spec（Phase 1，依赖知识库 v1 摄取 + 透明页最小版）；D-022/D-023 → `settings` 后续版本加自主度档位 / 预算 / 主体模型绑定；D-020 → 后续交付物 / 验证队列 feature 承载三类新块（`workbench-interaction` 冻结 spec 不加 AC）。
6. **一致性复查**（在本工作树）：
   - `grep -rn "三层自迭代\|自迭代三层\|五个对象\|五条第一性" docs/ AGENTS.md` → 应为 0（除 ADR 历史文本）
   - `grep -rn "发布快照\|批准发布" docs/` → 应为 0（术语已是"定稿"）
   - `grep -rn "D-02[0-4]" docs/ AGENTS.md | wc -l` 粗看引用是否指向存在的章节（§9–§12、§6.6、§4.8、§5.6）
   - `grep -n "^## \|^### " docs/interaction.md docs/architecture.md` 确认章节号连续
7. **提交**：`git add -A && git commit -m "docs: agent 工作流重塑第三轮（D-020～D-024）…"`；不 push，等 Walter 拍板。
8. **PR 顺序**：先合 `docs/interaction-v2`（PR 未知是否已开），再开本分支 PR → main；两者都碰 `AGENTS.md`，与 `feat/desktop-shell` 的 §2.1 会冲突，需在合并时统一为一份模型路由规范。

## 4. 需要重启的命令 / 端口 / 日志

无。纯 docs 工作，没有启动任何服务、构建或长任务。

## 5. 临时产物

无。`_patch_arch.py`（architecture.md 补丁脚本）已执行并删除，效果已落在 `docs/architecture.md`。

## 6. 需要 Walter 拍板的问题

1. **我在裁决之外加的细则，是否接受**（都在 ADR 结论里，可直接否）：
   - D-020：agent 的 call **不需用户确认即可登记**；`basis=private` 字段；"镜子"可关；满意度指标作护栏并"显著恶化即回退"。
   - D-021：模型**必含两视图**（基本面 / 市场隐含，"与市场的分歧"为一等查询）；新增闸门 **L3.5** 只标不拒；人填槽位 agent 不覆盖。
   - D-022：自主度分 **A0–A3** 四档，建议默认 **A1 提案**；A3 自扩展放 Phase 4；新增**值班员**角色；"日报"菜单项是否改名留给 frontend-workbench v2。
   - D-023：主体与 D-019 角色**正交**（不是新角色表）；新增**裁判员**角色；作业树由引擎创建；红队产物不是介入事件。
   - D-024：历史产出入**派生区（作者 = 人）**；历史立场**不生成 call**。
2. 5 份 ADR 是否太碎（可合并 D-020 + D-024 为"学习来源扩展"）。
3. 路线图新增 **Phase 2D（多主体与求解）** 是否接受，还是并入 2B/3。
4. PR 顺序与 AGENTS.md 模型路由（§2.1 vs §6）冲突由谁解。

## 7. 下次恢复后给 Walter 的第一句话

"上次停在：D-020～D-024 五份 ADR + interaction/plan/architecture 三份已改并 WIP 提交在 `docs/agent-workflow-reshape`；接下来按 HANDOFF §3 顺序做 designUI / AGENTS / candidates.md / specs README 和一致性复查——先请你看 §6 的拍板项，尤其第 1 条里我在裁决之外加的细则。"
