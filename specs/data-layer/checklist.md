# Feature: data-layer 质量检查清单（checklist.md）

> Checklist 阶段产物，由审核员生成并勾选。仅当审核员认为某项检查标准得到满足时才标记为通过；
> 通过只代表需求质量达标，不代表实施完成。实施者不勾选本文件。
>
> **审核员**：A = deepseek/deepseek-flash（独立会话；deepseek-v4.1-flash 在已认证 provider 下不存在，以同 provider deepseek-flash 替代，待 Walter 确认）、B = openai/gpt-6.1-sol（独立会话）。
> 共识规则：两审一致通过才算通过；分歧视为未通过。
>
> **审核历程**：首轮双审未通过（14 阻断）→ 二至十三轮逐步收敛（设计层缺陷 → 契约细节 → 文档同步）。
> 第十三轮剩余项已修复（contract 全链路传播、只读通道端点发现、目录不清空口径、留痕基线）。**v16 为验收目标版本。**

## 当前状态（v16）

### 需求完整性

- [ ] 每条编号需求都有至少一条可验证的验收规则 —— v14：R-001~R-009 共 36 条 AC，全部可验证
- [ ] 所有目标与需求描述均有对应验收规则 —— CLI 入口、8 槽渲染、realtime 签名、退化分支均已补
- [ ] 无未澄清歧义 —— §5 歧义记录 Q-001~Q-032 全部闭环

### 一致性

- [ ] spec / plan 全文无冲突 —— v14 已同步（版本头、contract 全链路、只读语义、主源候选、目录布局）
- [ ] 与 docs/ 决策与 ADR 一致 —— D-012 十二条裁定；architecture §3.1/§3.2/§3.3 已同步
- [ ] 序列身份与对账条件自洽 —— 4 键身份（含可选 contract）+ 主源派生缓存

### 可测试性

- [ ] 每条 AC 映射到单元测试 —— plan §5 覆盖全部 36 条 AC（含 grep 三正则组、fixtures、锁冲突、退化分支、contract golden）
- [ ] 外部数据源离线可验收 —— 固定响应样本 mock + 在线冒烟
- [ ] 任务粒度与验证命令满足 tasks.md 模板要求 —— 跳过：tasks.md 未生成，Tasks 阶段后单独复审

### 其他自定义项

- [ ] 幂等/追加写语义单一 —— 唯一索引冲突忽略，全文无 DELETE+INSERT
- [ ] 择优唯一全序 —— 优先级数值小者 → asof 新者 → ingest_run 大者；覆盖 = 替换优先级（D-012）
- [ ] 单写者闭环 —— 写锁 + 进程内 MCP + 只读 HTTP 路由 + 连接互斥
- [ ] 凭证 fail closed —— 保存/读取双失败路径
- [ ] 枚举封闭 —— 新增值须先修订 spec 过 Gate
- [ ] 决策留痕 —— D-012 入 ADR；plan.md §3 登记；architecture 指向 D-012

## 复核条件

1. 第十六轮双审复核通过（v16 闭环）
2. v15 spec.md 获 **Gate 1 再批准**（Walter）——顺带确认审核员模型替代（deepseek-flash 替代 deepseek-v4.1-flash）
3. 注：tasks.md 的“任务粒度 + 验证命令 ↔ AC 一一对应”为 **Tasks 阶段产物自身的质量要求**，在 Analyze 阶段补审（不是进入 Tasks 的前置条件）；review.md 按 Handoff 阶段生成
