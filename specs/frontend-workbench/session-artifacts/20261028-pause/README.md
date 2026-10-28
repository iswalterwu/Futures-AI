# frontend-workbench v2 — 2026-10-28 暂停时临时产物归档

本目录按用户暂停交接要求保存原在 `C:/Users/iswal/AppData/Local/Temp/` 的 Markdown 产物；文件原样拷贝，没有凭证、token 或原始鉴权报错。恢复不依赖临时目录。

**这里不是当前需求、设计或审核的权威入口。** 草稿和阶段摘要中的“待审核 / 未落盘 / 当前 HEAD”等是生成当时的历史状态。当前状态以项目根 `HANDOFF.md`、`specs/frontend-workbench/{spec,plan,tasks,checklist-v2,analyze-v2}.md` 为准。

| 文件 | 内容 / 用途 |
|---|---|
| `futures-fw-v2-plan-opus-20261028.md` | Opus 第一版 v2 Plan 草案，未直接作为最终设计 |
| `futures-fw-v2-plan-opus-refined-20261028.md` | Opus 收敛后的 v2 Plan 文本，集成时做过少量路径 / 工作树纪律等编辑性校正 |
| `futures-fw-v2-checklist-A-R1-20261028.md` | A 首轮完成摘要；实际清单在 `checklist-v2.md` 的 R1 历史 |
| `futures-fw-v2-tasks-opus-20261028.md` | Opus Tasks 初稿及 Plan 15 处细化建议 |
| `futures-fw-v2-tasks-integrated-opus-20261028.md` | Tasks 专用 worktree 落盘摘要与文档结构验证 |
| `futures-fw-v2-analyze-opus-20261028.md` | Analyze R1 输出，含 3 P2 / 4 P3；正文已保存在 `analyze-v2.md` 的 R1 历史 |
| `futures-fw-v2-analyze-fixes-opus-20261028.md` | 按 F-01～F-07 修正文档的摘要与验证 |
| `futures-fw-v2-analyze-R2-opus-20261028.md` | Analyze R2 原文，固定 `6bda6c9`；与 `analyze-v2-r2.md` 内容相同 |
| `futures-fw-v2-checklist-A-R2-20261028.md` | A 的 Tasks / Plan / Analyze 定向复核完成摘要，审 `949a232`；实际清单产物在提交 `f1f755b` |

所有生成这些文件的 pi 调用均为同步 `subprocess.run`，均已结束；本目录没有需要重启的进程或服务日志。原始 API / JSONL 流没有复制入仓库。

归档保留原始字节与历史草稿空白（Tasks 初稿含两处仅空格的行），不为消除格式提示而改写原稿；正式文档单独执行 `git diff --check`，归档文件以与临时原件逐字节比对为验证。
