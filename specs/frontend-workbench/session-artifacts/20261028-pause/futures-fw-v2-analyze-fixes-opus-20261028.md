The intended replacement for the T-V2-06 bullet:

Now review the full diff.

Plan/Tasks 已按 Analyze R1 的 F-01～F-07 改完，只动了允许的 4 个文件。还没有 commit，没有重跑 Analyze，也没有经 A 复核。

**改动的文件**
- `specs/frontend-workbench/analyze-v2.md`（新建）：前面加两行落盘说明，写明这是 R1、固定在 `b364971`、只读诊断。说明里写了 F 项要等下一轮独立 Analyze 确认才算关闭。报告正文原样保存，去掉 CR 后与临时报告逐行比对一致；F 表和 E 表都没改。
- `plan.md`（§7）、`tasks.md`（v2 段）、`specs/README.md` 的修正如下：
  - **F-01**：`PlaceholderPage.vue` 作为壳的最小派生修改，加入 Plan §7.2、§7.13 S0、Tasks §4 和 T-V2-02。T-V2-02 新增第 4 条标准，验证命令是 `pnpm -C frontend typecheck`，对应 AC-002-7 和 AC-009-1（只算类型打底，不算全量验收）。这项派生修改还要交给 A 确认。
  - **F-02**：T-V2-01 写明要做的事：
    - `shell.spec` 的八项菜单表改成九项；
    - 旧的 AC-002-2 菜单用例和直达用例全部迁移，不能留旧的八项用例；
    - 删掉 research 深链，保留 daily 深链；
    - 删掉旧 AC-002-3 和不再使用的 `research.json` 导入。
    
    第 1 条验证命令改成全前缀 `-g "AC-002-2"`。
  - **F-03**：`shell.spec` 的写入顺序改为 T-V2-01 → T-V2-02 → T-V2-09。
    - T-V2-01 第 1 条标准注明：`/jobs` 的壳 owner 断言只作 S0 证据。
    - T-V2-09 的修改范围加入 `shell.spec`，新增第 4 条标准和命令（全前缀 `-g "AC-002-2"` 回归）。
    - Plan §7.11 的 AC-002-2 行注明 S0 和 S2 的断言怎么迁移。
    - 另外写明：H-3 集成后到 T-V2-09 完成前，这条断言会失效，这段时间不能拿全前缀或全量运行结果当证据。
  - **F-04**：交接 H-2·列表时，至少要交付一个会改变作业摘要的写 action（例如 `createJob` 在 store 层的 action），连同它的公开导出和定向测试，名字按交接 SHA 登记。T-V2-05 第 2 条标准只调用这个 action，没交付就 blocked。
  - **F-05**：H-4 交接时必须写明有没有可在测试里用的公开设置方式。如果 context 只能由路由守卫设置，T-V2-03 和 S1-ctx 就要等 H-3 路由切片。不加测试专用 setter，壳也不写 sessionStore。
  - **F-06**：H-6 要求 `jobFixtures` 能替换整个作业样例集合（新增一项也是用替换实现）。替换能力没交付时，T-V2-06 整个任务 blocked。原来那句“只能追加时子用例再报”已删掉。
  - **F-07**：开工闸门 2 的证据改成三项：A 定向复核产物的已提交 SHA、I-01b 和 V-02 的明确通过记录、checklist-v2 当前仍有效。不再用 grep 没输出来代替。1.1 节新增“最近一轮 Analyze”和“A 定向复核 SHA = 未取得”两行。
  - README 只改了两处：frontend-workbench 的状态行改成你指定的说法；跨 feature 待同步那一行补上 F-04/05/06 三点。其他行没动。
  - Plan 和 Tasks 页首各加了一条修正记录，写明模型、基线、F-01～07，以及“未经 A 复核、未重跑 Analyze”。

**结构自检**（只读 git 加一次性 Python，不算新一轮 Analyze，没跑 pnpm）
- spec 有 52 条 AC；Plan §7.11 不缺不多；Tasks 矩阵 52 行，无重复、无遗漏；12 个任务完成标准里引用的 AC 合起来正好 52 条。
- 仍是 12 个任务、22 h。每个任务的标准条数和命令条数一一对应：4/4/3/3/4/4/4/2/4/3/9/3。
- 矩阵里的“T-V2-xx#n”引用都能对上该条标准里的 AC。T-V2-02 第 4 条对应 AC-002-7 和 AC-009-1，T-V2-09 第 4 条对应 AC-002-2。AC-002-2、AC-002-7、AC-009-1 三行的命令已同步。
- 依赖都指向编号更早的任务，没有环。
- 和 `b364971` 比：v1 正文和 Plan §1～§6 没有删改，只多了页首一行记录。spec、两份 checklist、docs、AGENTS 都没变。
- `git diff --check` 通过（`analyze-v2.md` 另用 `--no-index --check` 查过，没有行尾空格）。`git status` 只有这 4 个文件。

**仍然 blocked 的外部条件**
- R1 报告里的 E-01～E-12 全部没解除：v1 Handoff 合入 main 的 SHA、壳 v2 的 worktree、集成人和集成分支、H-1～H-6 和页面切片的交接、互动方有效的 A 授权。
- A 定向复核产物的 SHA 还没有，I-01b 和 V-02 也还没有通过记录。
- 下一步要另开一轮只读 Analyze，固定到修正后的提交复跑。所有 v2 任务都不能进入 Implement。