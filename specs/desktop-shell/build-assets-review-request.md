# desktop-shell 构建资产修正：Checklist 局部复查请求（交审核员 A；Plan 修订 4 之后）

> 起草：Plan/Tasks/Analyze 作者 `anthropic/claude-opus-5-5` via anthropic（本轮官方通道最小真实调用成功；`claude-bridge` 同模型 seven_day 限额在当前窗口已知耗尽，不重复探活）。由协调者 `openai/gpt-6.1-sol` 转交 A。
>
> - **请求类型**：AGENTS §2 第 5 步 Checklist 的**局部复查**，只针对 Plan 修订 4（T-04b 后端产物的构建收集源头修正），审的是需求 / 计划 / 任务质量。**不是**代码 Review、Converge 或 Gate 2。
> - **审核员 A**：按 AGENTS §6 选模型（默认 `claude-fable-5-1`，先 `claude-bridge` 后 `anthropic`；当前窗口已知 bridge 限额，不重复探活），新开独立会话，与实施（`openai/gpt-6-astra`）、本作者（`claude-opus-5-5`）和协调者隔离。在 `checklist.md` 头部记录本轮实际模型 / 通道及切换原因。
> - **A 对修订 3 的 41/41 不自动覆盖修订 4。** 修订 4 在 A 记录本轮复查之前不得实施。

## 1. 固定输入

| 项 | 值 |
|---|---|
| 固定输入提交 | `1275ae2191881d830a4f8e09c52dbe4cb12a2e78`（分支 `plan/desktop-shell-build-assets`） |
| 原始源码基线 | `8ba1b6a304f916e3d57ebdd6b89790b75a15f14c` |
| 待审规划差异 | 由协调者集成后给出的固定提交（**集成提交：待协调者填写**）。差异应只有四个文件：`specs/desktop-shell/plan.md`（修订 4）、`specs/desktop-shell/tasks.md`（T-04b 修正）、`specs/desktop-shell/analyze.md`（追加迭代 7）、`specs/desktop-shell/build-assets-review-request.md`（本文件，新增） |
| 核对命令（只读） | `git diff --stat 1275ae2 <集成提交>` 只列上述四个文件；`git diff --exit-code 1275ae2 <集成提交> -- specs/desktop-shell/spec.md backend specs/desktop-shell/checklist.md` 为空；`git diff --check 1275ae2 <集成提交>` 无错误 |

请阅读**真实 diff**，不要只读本文件的摘要。

## 2. 修订 4 要点（权威内容见 plan §0「修订 4」、§7.5、§8.2、§9 AC-001-4、§10；tasks T-04b）

- **触发（观测事实）**：实施会话 `01a18285-2349-7290-b570-c8f9b2e18658` 的真实构建退出 0，但真实冒烟 11/12，唯一失败为 `_internal/pyarrow/tests`（`.pyx` 与 feather/orc/parquet 测试数据）。
- **根因（作者只读核对已安装源码）**：contrib `hook-pyarrow.py` 的 `datas = collect_data_files('pyarrow')` 未排除 `tests`；现有 `--exclude-module tests` 只排除模块，不影响数据文件。PyInstaller 6.22.3 每个模块只启用优先级最高的 hook，`--additional-hooks-dir` 为 1000、contrib 为 −1000。
- **修正**：新增 `backend/tools/pyinstaller_hooks/hook-pyarrow.py`（与 contrib 等价，只在 `datas` 上加 `excludes=['tests']`）；`build_backend.py` 增加 `--additional-hooks-dir`；新增 `backend/tests/test_app_packaging.py`（构建接线只在 `subprocess.run` 边界注入；真实执行仓库 hook 与已安装 contrib hook 做参照）。
- **验收**：聚焦测试 3 passed / 0 skipped；全量回归只允许 5 个既有在线 skip；`build_backend.py --clean` 干净重建；**未修改的** `shell_check.py` 12/12；重建前后产物清单只少 `_internal/pyarrow/tests/**`；构建日志显示 pyarrow hook 来自仓库目录；冻结文件 diff 为空；新增文件不被忽略。附有停止规则：出现其他第三方黑名单命中等情况即停，不扩大范围。
- **任务**：不拆新任务；T-04b 估时 1.5h → 2h，合计 60.5h → 61h；任务数 41、依赖与顺序不变。
- **不变**：spec 与 38 条 AC；plan §7.4 黑名单与 `shell_check.py`（blob `2aa8824b47088345ae450fd769697e416196787b`，与 `1275ae2` 相同）；`test_app_health.py`；constraints / 包版本；site-packages；运行时代码；`shell/`、`packaging/`。

## 3. 请 A 复查的质量项（只看与修订 4 相关的部分）

1. **C-02 / 一致性"spec/plan/tasks 无冲突"**：spec 正文是否仍未动；修订 4 是否确实留在冻结 AC-001-4 之内（不是黑名单例外、不是需求或 schema 变更）；作者"不需回 Clarify / Gate 1、不需新 ADR"的判断是否成立。
2. **C-16（打包）**：根因与设计是否与已安装源码相符（可只读核对 `_pyinstaller_hooks_contrib/stdhooks/hook-pyarrow.py`、`PyInstaller/utils/hooks/__init__.py` 中的 `collect_data_files`、`PyInstaller/depend/imphook.py` 第 128～136 行与第 420 行、`PyInstaller/depend/analysis.py` 第 61～64 行）；仓库 hook 是否是最小且合理的方案；放弃方案的理由是否成立。
3. **C-17 / C-18（范围控制，AGENTS §5.1）**：修正是否只针对已观测的失败；是否混入了猜测性加固、新依赖、新框架或抽象；残余边界（AN7-02：PYZ 内可能经 `pyarrow.conftest` 带入的纯模块，未核实）只登记、不处理，这样处理是否恰当。A 不替 Walter 授予工程批准。
4. **C-19（回滚与文件所有权）**：plan §10 回滚范围加入 `backend/tools/pyinstaller_hooks/`；tasks T-04b 的写入集合 / 只读集合是否明确，并与 plan §7.5 一致。
5. **C-20 / C-23（命令与路径）**：新命令的 cwd 与"现有 / 待新增"标注；`git check-ignore -v --no-index` 核对新路径不被忽略。
6. **C-24（测试接缝）**：测试是否测真实实现——接线测试只替换 `subprocess.run`；hook 测试真实执行 hook，参照规则取自黑名单表述而非复制生产 glob；禁止 mock `collect_*`；`importorskip` 只用于未安装 pyarrow 的环境，最终证据不允许 skip。plan §7.5 第 4 段关于 pyarrow 运行时可用性的论证是否充分，又没有夸大（冒烟本身不能单独证明 pyarrow 可导入）。
7. **C-28 / C-29 与模板"任务粒度与验证命令"**：T-04b 仍 ≤ 2h；4 条完成标准都引用 AC 并与 4 条验证一一对应；没有由后序任务承担的验收；计数（41 个任务、61h）一致；Analyze 迭代 1～6 与 A 前两轮的历史计数未被改写。
8. **C-26 / C-27（诚实边界）**：证据要求是否保留修正前的 11/12 失败与构建警告；外部边界（干净机、基准机、真实前端等）是否仍如实标为未取得。
9. **analyze.md 迭代 7**：结论"文档一致性通过（修订 4 范围）"及其 §6 实施前置条件是否属实。

## 4. 仍然存在的外部边界（不是本轮要解决的）

干净 Windows 安装 / 卸载、基准机 15 s、真实前端与 `window.futuresai` 采纳、作业引擎与后端 drain、agent、真实发布通道、真实 EIA key、系统通知 / 托盘观感、真实满盘与 507 界面渲染、代码签名。另有 AN7-02（PYZ 残余，未核实）与 AN7-03（pyarrow / contrib 未锁版本）两项已登记的 P3。

## 5. A 的权限与产出

- **只能写 `checklist.md`**：记录本轮实际模型 / 通道与日期；对受影响项给出复查结论（保持勾选，或取消勾选并写明原因与修正位置）；登记发现（P1 / P2 / P3）。不改 spec、plan、tasks、analyze、review、README、HANDOFF 或任何源码 / 测试。
- 只读审查固定集成提交与真实 diff；可以只读查看已安装的 PyInstaller / contrib / pyarrow 源码。**不运行**测试、构建、安装、npm，不发起联网请求，不提交。
- 勾选只代表需求 / 计划 / 任务质量达标，**不代表**修正已实施或测试已通过。
- A 记录完成、且 `checklist.md` 全部复选框为勾选状态后，协调者才可把 T-04b 修订 4 交给 `openai/gpt-6-astra` 实施。A 若提出 P1/P2，回到 Plan/Tasks 修补并重新运行 Analyze。
