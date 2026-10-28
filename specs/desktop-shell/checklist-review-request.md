# desktop-shell Checklist 复查请求（交审核员 A；Tasks / Analyze 之后）

> 由 Plan/Tasks/Analyze 作者 `anthropic/claude-opus-5-5` 起草，协调者（`openai/gpt-6.1-sol`）转交 A。
>
> - **请求类型**：AGENTS §2 第 5 步 Checklist 的**复查**（需求/计划/任务质量）。不是代码评审、不是 Review、不出 Gate 2 结论。
> - **审核员 A**：`anthropic/claude-fable-5-1`，新开独立会话，与实施（`openai/gpt-6-astra`）隔离、模型不同；回退顺序与通道规则按 AGENTS §6（bridge 当前窗口已知 seven_day 限额，不重复探活）。在 `checklist.md` 头部记录本轮实际模型/通道。
> - **审核输入**：固定源码基线 `8ba1b6a304f916e3d57ebdd6b89790b75a15f14c` + **未提交**规划工作副本（尚无集成提交；不要把工作副本当作已提交成果）。由协调者把下列文件的当前副本固定后复制到 A 的独立只读工作树，用 `git diff 8ba1b6a -- specs/` 与 `git status` 核对真实差异；`git diff 8ba1b6a -- backend/ shell/ packaging/ docs/ .gitignore` 应为空。

## 1. 本轮相对 A 初轮的变化

| 文件 | 变化 |
|---|---|
| `plan.md` | 修订 3：§0 新增"修订 3"表，逐条处理 F-01～F-07 与协调者关注点（`shell/src/`、`csp` 改为真实效果 + 正对照、ZIP 自带 CRC-32、回环资源类型限制与 `blob:`、`dismissedUpdate` 改内存、`FAI_DATA_ROOT` 门槛、日志目录 `log/`、`FAI_TEST_EVENTS` 单一协议、更新分区隔离、§8.3 运行器与控制通道、AC-004-1 聚焦断言、file:// 回环 XHR 的 CORS 风险与停止规则、`%SystemRoot%\System32\tar.exe`） |
| `tasks.md` | 按模板重写：T-01～T-06 标为历史阶段证据；41 个实施任务（T-01b～T-10d，含迭代 3 新增的 T-05m 与迭代 5 新增的 T-03c、T-06d；0.5～2h，合计约 60.5h）+ 4 个人工验收批次；每任务含依赖、独占文件范围、估时、AC 编号完成标准与一一对应的验证（全部标"待新增"） |
| `analyze.md` | 新增：迭代 1 未通过（AN1-01 P2 等）→ 修补 → 迭代 2；协调者静态发现记为迭代 3（未通过）→ 修补 → 迭代 4；协调者 AC-005-3 追溯检查记为迭代 5（未通过）→ 修补 → 迭代 6（最终） |
| `manual-acceptance.md` | 对齐：`log\` 目录、事件夹具只接受文件绝对路径、M-03 以实际安装目录为准、M-08 增加 J3 观察拒收、M-09 为真实前台聚焦的唯一证据、M-17 错误码 |
| `plan-gaps.md` | 只追加状态注记与 A 类 → 新任务落点表 G；历史正文未改写 |

`spec.md` 正文未改（仍只有页首 Gate 1 元数据 1 行差异）。`checklist.md` 未被作者改动。

## 2. 请 A 复查

1. **F-01～F-07 处置**是否成立（plan §0 修订 3 表），对应未勾选项 C-08b、C-14b、C-21、C-22、C-23 是否可以勾选。
2. **Tasks 对齐**（C-28～C-31 与模板两项"spec/plan/tasks 无冲突""任务粒度与验证命令"）：
   - 38 AC + WO-01～WO-13 均有任务承载、完成标准引用 AC 编号；无独立 AC 的 WO 是否正确写成"最近 AC + WO"，未虚构 AC；
   - 每任务 ≤ 2h、依赖无环且实际可执行（路径接线 → 运行器/钩子 → 单实例与生命周期；运行器自检不依赖后续状态机）；
   - 验证命令 cwd 与 plan §8.2 一致；已退役命令只作历史文本；e2e 场景名与 plan §9 一致；
   - 夹具/外部类 AC 未写成真实业务已验证；人工步骤只引用 `manual-acceptance.md` 的 M-ID；plan §10"有意不做"未混入任务。
3. **analyze.md** 的结论与"Implement 前置条件"是否属实；迭代 1、迭代 3 的失败是否如实保留；**每个任务的完成标准是否能在该任务及其前置任务内独立验证**（不由后序任务承担验收，如 T-05c `bootstrap` 单测、T-07d `prefs-ui`、T-10a 配置单测 / T-10b 夹具单测 / T-10c 首次打包）；**每个任务块**的完成标准是否都引用了 AC 编号（基础设施任务写"最近 AC"且不宣称产品 AC 已证明）。 另请逐子句核对 AC-005-3（预填 / 缺项引导 / 粘贴 key / 验证 / 保存）在任务层的追溯：T-03c、T-06d、T-06b 与现有 `TestKeyWizard`。
4. 是否存在**需要回 Clarify / Gate 1** 的发现（作者判断：无），或需要 AGENTS §5.1 单独批准的新增复杂度（作者判断：无；测试钩子控制通道已按迭代 3 去掉鉴权令牌，只在 `FAI_TEST_HOOKS=1` 时存在、只监听回环、使用隔离临时目录，生产后端 Bearer 不变）。A 的职责是需求/计划/任务质量审核，不替 Walter 授予工程批准。

## 3. 产出要求

- 只修改 `checklist.md`：勾选 A 认为已满足的项；未满足的写原因与修正位置。A 不改 spec/plan/tasks/analyze/源码。
- 勾选只代表需求/计划/任务质量达标，**不代表** Implement 完成或代码通过。
- **Implement 只有在 `checklist.md` 全部勾选后才可开始**（实施前由 Astra 会话重新读取全部复选框确认）。
