# A 独立评审：开发文档导航改造（D-026）

**审核员**：A = `claude-fable-5-1 via anthropic`（本会话 bridge 最小探活 quota/rate 失败，未重探；官方通道成功）。新会话、只读、无子 agent，未改任何仓库文件（`git status` 干净）。
**对象**：BASE `c93d4ba3e3768e489e7738dbdcb4ef1d883f4aab` → HEAD `8b880c71bf6d6e1acf81bf6aae3c9f531f0c1e22`（已核实 detached worktree HEAD）。
**范围**：纯文档 / 开发治理维护，不是任何 feature 的 Gate；本结论不构成 Gate 2。

## 实际执行的检查
- `git diff --stat/--name-only BASE HEAD`：20 个 Markdown，无源码 / 锁文件 / `.gitignore` / 冻结 spec·AC·plan·tasks·checklist / 旧 ADR·review / `CONTRACT.md` 改动。
- 自写 Python 对比：基线 §5 七条与新根 §5 **逐字相同**；基线 §6 模型表 + 8 条规则与 `model-routing.md` 去锚点后**逐行相同**（仅标题层级变化）；基线 §2 各步正文句级比对，仅第 5 步括注“默认 fable、先 bridge 后 anthropic”未保留（权威已在 model-routing，可接受）。
- 历史快照：E1/E2/E3 = 基线 `docs/plan.md` 第 6 / 68–75 / 205–253 行逐字；三段 SHA256、整文件 SHA256 `69cafa…`、blob `8acb1e8`；`specs/README.md` 全文 + SHA256 `fc9504…`、blob `8498895` 均独立复算一致。plan.md 删除行中仅 3 行导航句未入快照（git 可查）。
- 277 个新增 / 修改文件的活链接与片段（忽略围栏）全部可达；`docs/README.md` §4 指向的 interaction/architecture/designUI 章节号实存（§3.5、§5.4“内部生成”、§6.6、§9–§12、§4.7–4.8、§5.5–5.6）。
- 三个 feature README 的每条指向（WI implementation-log §8/§26.1–26.4、interface-handoff §1/§5/§6、checklist 页首“文件结构”；desktop root-lock-risk-review §3/§4、evidence §9、plan 修订 7/R7-01；FW handoff-v2-s0 §1–§7、merge-main-cleanup §4/§7、review §20/§21、tasks“P3 后续台账”/§5 开工闸门）逐一核实存在且语义相符。
- `shell/README.md` 与 `package.json` scripts、`main.js`/`paths.js` 环境变量、`backend/app/__main__.py` 参数对拍一致；无“真实后端 / 已完成”声称。
- 运行协调者 `verify_docnav.py`（只读，19/19 通过，未写文件）；审其源码：只检字节 / 逐字 / 链接 / plan §1·2·6·7·8·10 不变，不检 §2 步骤语义、specs 行内容与导航正确性——上述项已由本人手工补审。
- 五类导航走查（局部 bug / UI / 数据语义 / 独立 Review / 恢复 feature）均能从根 §1 一跳到权威并带停止条件；RL-01 OPEN/UNKNOWN、R5/R6/R7、R5-B/C 需 Walter §5.1 批准、H-x 四项未交付、M-01～M-12 未勾、S0 P3-1 未接受在 `specs/README.md` 行与 feature README 页首显眼可见。

## 发现

**P2-1** `docs/development/model-routing.md:38`（“与工作区生命周期的关系”）：“**规则 7 只在确需并行写入时适用**”把整条规则 7 限定为并行场景，而逐字规则 7 含无条件的“审核会话只读审查固定提交与真实 diff，除勾选 checklist 外不替实施者改代码”。D-025 ADR 第 3 点只把“创建临时 worktree”限定于并行写入，第 2 点审核隔离仍无条件。单一权威文件内出现对硬规则范围的矛盾表述，串行模式下可被读作审核会话可改代码。影响：审核只读边界失去唯一明确出处（workflow `#isolation` 与根 §4 仅间接覆盖）。修复：改为“规则 7 中独立 worktree / 分支与共享文件串行合并的条款只在确需并行写入时适用；文件所有权、基线提交、审核会话只读与不替实施者改代码在串行模式同样有效”。

**P3-1** `specs/frontend-workbench/README.md` §2：`checklist-v2.md` 页首 R3、R4 两处均写“当前有效结论”，README“以页首标为‘当前有效’的轮次为准”不能消歧；建议 README 指明最新为 R4（`34ee795`，见 tasks“S0 开工登记”），不改 checklist 原件。
**P3-2** `workflow.md` 第 5 步“各 feature 的位置见其 `specs/<feature>/README.md`”——data-layer / settings 无 README，宜写“有则”。
**P3-3** 维护记录 §7 的 `pnpm -C frontend check` 六项与 vitest 192/192 为 Sol 接续声称，Temp 目录仅有 `verification.json`，无命令输出留存，本会话未安装依赖不可复跑；风险低（两份 spec 只读 `design/`、`CONTRACT.md`、`designUI.md`，本次均未改），建议补脱敏输出摘要或注明执行会话。
**P3-4** `model-routing.md` 引用解析表新增“纯文档维护无 feature 目录时按 `docs/maintenance/` 先例记录”，属规则 4 记录位置的解释性扩展，未在 ADR 结论 8 / 条款映射登记；建议补一行。

## 已确认无问题
根 §0–§6 标题、§6.7 / §2 第 N 步 / 历史 §2.1 映射可解；两项阅读策略变更在根 §1/§2、ADR 结论 7、workflow 总规则、维护记录 §2 均显式标为“实质变更”，输入清单不豁免重读，摘要不得替代 spec/AC/Gate/审核输入；Gate 1/2、冻结与变更、Checklist 保护、独立 A、P1/P2 判定、docs 先于代码、隐私 / 凭证 / 审计、D-025 均在根导航表之前；plan §3/§9 仍有效边界（非 Gate、settings 待定档位、日报改名、P3 线索、单一路由）保留；D-001～D-006 未虚构 ADR；无预算 / 循环上限 / 路由语义变更；根体积 18,878→7,850 字节仅为入口体积。

## 结论
**未通过**（1 P2，4 P3）。P2-1 为单句修正，修正后由 A 复核该文件即可；P3 可接受为后续。Gate 2 待用户确认，本评审不作合入 / PR 授权。