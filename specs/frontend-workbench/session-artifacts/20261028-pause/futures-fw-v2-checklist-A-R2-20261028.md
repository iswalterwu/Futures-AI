Now the frozen spec.

Now the checklist-v2, analyze files, and README.

Now verify v1 facts at `0ffa15e` and interaction-side facts at `8bd1b31`.

**R2 审核结论（A = claude-fable-5-1 via anthropic，固定 HEAD `949a2329be9874aeaf7c5a189d49d1ee11ad97e5`）**

- **结论：通过。阻断 V2-B = 0。** I-01b、V-02 已由我补设正式复选框并勾选 `[x]`，附固定 SHA、三层真实 diff 范围与逐项依据（52 AC 矩阵/引用核验、12 任务 22 h、依赖无前向无环、文件单写者与串行链、旧 v1 正文零改动、§2 覆盖声明命中 R1 列出的全部冲突点）。
- **V2-S01～S09**：全部落地核验通过（S08 以可追溯 owner `learning` 接受，不要求改页面）。
- **F-01～F-07**：修正语义闭环成立。`PlaceholderPage.vue` 经独立判断为同源派生、可接受（`0ffa15e` 中 `app.research` 消费者仅 Rail.vue:70/75 与 PlaceholderPage.vue:9；互动方所有权不含 `src/pages`；纯减法、单写者 T-V2-02、`typecheck` 验证；T-V2-01→02 顺序任一提交点不红）。shell.spec 物理用例迁移与 `/jobs` 子断言 01→02→09 串行迁移均与 `0ffa15e` 物理用例一一对应。
- **O 项处理**：O-1 可接受（typecheck 是派生安全网，矩阵为超集，全量 test 本含 typecheck，不回改 plan）；O-2 可接受（窗口有界、已登记、窗口内命令不触及；附记录要求 V2-S11）；O-3 清晰度足够（经依赖链必然传递；编辑性补句 V2-S12）。
- **新增建议 3 条（不阻断）**：V2-S10 派生删除后的无用导入（Rail.vue / stores/app.ts `ResearchItem` / PlaceholderPage `useAppStore`）会使 `lint` 红而 T-V2-01/02 不跑 lint、且首跑 lint 的 T-V2-07 不是写入者——建议 T-V2-02 命令 4 改 `typecheck && lint` 并在范围加"连带删除失效导入"；V2-S11 窗口期"已知红"记录；V2-S12 blocked_by 补继承句。
- **内外分离**：本通过只解除 tasks §5 闸门 2 的"A 定向复核"子项（(a) 待集成人把本文件提交 SHA 登记进 tasks 1.1:304）；闸门 1（v1 Handoff SHA）与闸门 3（H-x 四项登记集成）全部未过，12 个任务仍全部 blocked，不授权 Implement。

唯一写入文件：`specs/frontend-workbench/checklist-v2.md`（R1 原文保留；在页首加 R2 当前有效结论、阶段说明补 R2 确认、文末新增「R2 定向复核」整节）。未 commit，其他文件未动。