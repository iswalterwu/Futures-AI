我先核验基线与真实 diff，然后完整阅读上下文文档。

Now the spec (fully).

Reading and verification are complete. Let me run a final structural check on the dependency chain and the old-task supersession list before writing.

Now writing the v2 checklist.

**审核结论（frontend-workbench v2 Checklist 首轮）：通过——0 项阻断（V2-B：无），9 条建议（V2-S01～S09）。允许进入 Tasks；不授权 Implement。**

要点：
- 固定审查 `d2bf5a7`，真实 diff 为 plan.md +320/−0（页首 + §7，§1～§6 零改动）与 README 一行；spec 52 AC 与 `fec3556` 逐字一致，plan §7.11 覆盖 52/52。
- 九项导航、JobTrack 共享数据/三态/写回执刷新、投放唯一非模态挂载/快照/双抽屉几何、发送快照与 run 归属/筛选、十类事件兼容与唯一终态、文件唯一写入者、交接切片无环——均对照 `0ffa15e`（v1 实现）与 `8bd1b31`（互动方设计）核实可落地；Plan 对「尚不存在」的生产方项（H-2 缓存、`JobTypeLabel`、H-4/H-5/H-6）识别准确，没有把占位当集成。
- v1 未变部分的复用依据已单独确认（I-03：§1～§6 零改动 + 2c2fbc8→fec3556 仅编辑性 + 41 条 AC 逐字相同），明确为设计复用而非实现证据。
- `stores/app.ts` 派生修改经 A 确认可接受（Tasks 须显式列入）。
- 主要建议：H-2/H-4/H-5/H-6 作为对互动方的新增要求应补登记到 `specs/README.md` 跨 feature 待同步表；「进行中」集合口径、空态原因来源、S1-track 点击在 H-3 前的处理、AC-005-8 e2e 等待顺序、store 双向 import 等在 Tasks 落实。
- 外部 `8bd1b31` 已提交 checklist 为 R2 通过（审 `630e06f`）；R3 仅在未提交工作树，本轮不作证据，Plan 的「外部交接未就绪」处置在两种状态下都成立。

新文件：`specs/frontend-workbench/checklist-v2.md`（唯一写入；未 commit，未改其他文件）。