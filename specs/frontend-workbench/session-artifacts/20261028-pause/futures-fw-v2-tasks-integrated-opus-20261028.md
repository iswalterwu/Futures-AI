Now the tasks.md edits (header + tail; two disjoint entries).

Now verify the tasks.md landing against the source draft (read-only).

Diff hunks beyond the mis-anchored first one are exactly the intended edits. Re-run anchored correctly with UTF-8 output:

Now plan.md §7 — 15 changes merged into 9 non-overlapping entries (H-2/H-3 adjacent rows merged; JobTrack badge/click/empty merged; three S1 rows merged).

Verify plan.md = HEAD + exactly the 15 PLAN_EDITS (applied in memory, read-only):

Now README: status row + extend line 33.

Now the full read-only structural verification.

三个文件已经按范围改好。验证全部通过。实施仍然 blocked，因为 v1 Handoff 和 H-1～H-6 都还没到位。按要求没有 commit，HEAD 还是 `a8ab444`。

## 改了什么（只用 edit 工具）
- **`specs/frontend-workbench/tasks.md`**：分两处修改：
  - 页首：在旧页首后面插入 v2 覆盖说明（4 行）。
  - 末尾：追加「## v2 任务（spec v2.1 / plan §7）」整章，包括 T-V2-01～12（都是 `[ ]`、blocked，共 22 h）、52 行 AC 矩阵、V2-S01～S09 的落实表、工时和依赖。
  - v1 的正文、勾选状态、矩阵和尾注都没动。
- **`specs/frontend-workbench/plan.md`**：PLAN_EDITS 的 15 处小改都在 §7 内，合并成 9 个互不重叠的 edit：
  - H-2 那一行的两处修改，和相邻的 H-3 行合成一个；
  - `JobStatusBadge`、点击行为、空态三处（392–396 行）合成一个；
  - S1-ctx、S1-track、S1-intake 三行合成一个；
  - 其余 6 处各自单独。
- **`specs/README.md`**：
  - frontend-workbench 这一行：状态改为「v2 Tasks 草案已产出，待 Analyze 与 A 定向复核；实施 blocked：v1 Handoff SHA 及 H-1～H-6 交接均未取得」，备注同步更新。
  - 第 33 行跨 feature 待办：来源补上「v2 Tasks §1.2」，内容补了三点：`JobStatusBadge` 随 H-2 交付；H-2 标签可以先给 S1-ctx；H-3 路由切片可以先给 S1-track，不等页面功能。
  - 其他行没动。

## 与源稿不同的地方（机械或事实性，请协调器确认）
1. **两处行尾空白**：T-V2-09 标准 3 和 T-V2-10 标准 2 各有一行只有空格，改成了真正的空行，否则 `git diff --check` 会报错。
2. **落盘人记录**：源稿页首写「协调与串行落盘 = gpt-6.1-sol」，但这次落盘是我做的，所以改为「协调 = gpt-6.1-sol（只读）；串行落盘 = 本 Tasks 会话（claude-opus-5-5 via anthropic）」。这一条改的是记录的事实，不只是格式。
3. **「本 Tasks 落盘提交 SHA」**：改为「未登记，由集成人在后续 Analyze / Checklist 记录准确提交；落盘时不预填」。作者基线 `a8ab444` 没改。
4. **README 补登**：§1.2 规则 5 和 §8 的 V2-S01 原来写「建议协调器补 README」，现在 README 已经在本轮补上，所以改成「已随落盘补入同一行」。

没有发现实质的设计冲突。另外有两次 README 的 edit 调用因为文本没匹配上，直接报错了，文件没有被改动。

## 验证结果（只读 Python / git，没有运行项目）
- **范围**：只有这三个文件有改动；spec、两份 checklist 和代码都没动；`git diff --check` 通过；三个文件仍是 CRLF，没有混入单独的 LF 换行。
- **tasks.md**：
  - 去掉新增的两段后，剩下的内容和 HEAD 逐字一致，v1 原来就没有复选框，前后都是 0 个。
  - v2 新增部分和源稿逐行比对，差异只有上面 4 类。
- **plan.md**：把 15 条 PLAN_EDITS 应用到 HEAD 版本上得到的结果，和当前文件完全一致；§7 之前的内容没变。
- **AC 覆盖**：spec 共 52 条 AC。矩阵 52 行，没有重复，和 spec 一致；12 个任务的完成标准加起来也正好覆盖这 52 条。
- **任务结构**：12 个任务都在 1～2 h 之间，合计 22 h；依赖都指向编号更早的任务，没有环；每个任务的完成标准条数和验证命令条数相等；都是 `[ ]` 加 blocked；v2 部分没有任何 `[x]`。

## 实施前还缺的前置
1. v1 完成 Review / Gate 2 / Handoff 并合入 main 的准确 SHA，目前未取得。
2. H-1、H-2·标签、H-2·列表、H-3·路由切片、页面切片、H-4、H-5、H-6：每个单元都要有固定 commit、已提交的有效 Checklist SHA、定向测试摘要，并由集成人集成。目前都还没有。
3. 集成验证分支名、指定集成人、壳 v2 实施 worktree 还没登记；本次落盘的提交 SHA 由集成人后续登记。
4. 需要在新会话里做 Analyze；之后由 A 新开独立会话，定向复核这份 Tasks 和 plan §7 的小改（目前都没经过审核），并补勾 checklist-v2「阶段说明」里的 I-01b 和 V-02。