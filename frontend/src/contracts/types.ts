import { z } from 'zod'

export const CONTRACT_VERSION = '1.0.0'

export const TradingDateSchema = z.iso.date().describe('交易日，YYYY-MM-DD。')
export const TimestampSchema = z.iso.datetime({ offset: true }).describe('ISO 8601 时间，必须带时区偏移；Z 表示 UTC。')
export const SemanticSchema = z.enum(['market', 'analysis']).describe('market 为行情涨跌；analysis 为分析增减（红表示负）。')
export const ModuleIdSchema = z.enum([
  'market-board',
  'supply-demand',
  'logistics-onwater',
  'positions',
  'doc-catalog',
  'watchlist',
  'release-calendar',
]).describe('v1 模块唯一标识；焦点带不属于模块目录。')

export const FigureSchema = z.object({
  label: z.string().min(1).describe('数值的显示名称。'),
  value: z.number().nullable().describe('数值；null 表示缺数，显示 en dash，不等同于零。'),
  unit: z.string().min(1).describe('显示单位；无量纲值也须明确填写单位。'),
  decimals: z.int().nonnegative().describe('主数值的显示小数位数；主数值按此精度取整后判零，不决定百分比变化量精度。'),
  freq: z.string().min(1).describe('数据频率，例如 1d、1w、1mo。'),
  delta: z.number().nullable().optional().describe('变化量；缺省表示未提供，null 表示缺数；pct 时为百分数值，1.5 表示 1.5%。'),
  deltaKind: z.enum(['abs', 'pct']).optional().describe('变化量口径：abs 为本单位绝对变化，pct 为百分数值；缺省按 abs。'),
  deltaDecimals: z.int().nonnegative().optional().describe('变化量的独立显示小数位数，显式 0 有效；缺省时 pct 用 2 位，abs 或未指定口径沿用 decimals。变化量方向与零中性按此精度取整后判定。'),
  semantic: SemanticSchema,
  asOf: TimestampSchema.describe('该数值的数据截至时间，ISO 8601 带偏移。'),
  seriesId: z.string().min(1).optional().describe('可选的规范序列 ID，用于溯源。'),
}).describe('单个业务数值及其显示、时间和色彩语义元数据。')

export const BoardCellSchema = z.discriminatedUnion('state', [
  z.object({
    state: z.literal('ok').describe('正常格，必须包含 figure。'),
    figure: FigureSchema.describe('正常格的完整数值与元数据，不可为 null。'),
  }).describe('有数值的盘面格。'),
  z.object({
    state: z.enum(['holiday', 'pending', 'missing']).describe('holiday 显示休，pending 显示待，missing 显示 en dash。'),
    figure: z.null().describe('非正常格不携带数值，必须为 null。'),
  }).describe('休市、待结算或缺数的盘面格。'),
]).describe('盘面格；state 为 ok 当且仅当 figure 非 null。')

export const SparkSeriesSchema = z.object({
  points: z.array(z.object({
    ts: TimestampSchema.describe('观测时间，ISO 8601 带偏移；点按时间升序返回。'),
    value: z.number().nullable().describe('观测值，单位与语义继承所属序列；null 表示缺数。'),
  }).describe('序列中的一个观测点。')).describe('按时间升序排列的观测点；空列表表示无数据。'),
  unit: z.string().min(1).describe('整条序列的数值单位。'),
  freq: z.string().min(1).describe('整条序列的数据频率，例如 1d。'),
  semantic: SemanticSchema,
  asOf: TimestampSchema.describe('整条序列的数据截至时间，ISO 8601 带偏移。'),
  seriesId: z.string().min(1).describe('整条序列的规范 ID，用于溯源。'),
}).describe('迷你折线与样例图的序列；元数据在序列层声明，不逐点重复。')

export const ContractErrorSchema = z.object({
  code: z.enum(['not_found', 'validation_error', 'rate_limited', 'adapter_error', 'internal']).describe('统一错误码：不存在、参数无效、限流、适配器错误、内部错误。'),
  message: z.string().min(1).describe('可向用户展示的错误原因。'),
  retryable: z.boolean().describe('是否允许重试；不代表已经自动重试。'),
}).describe('数据访问与 agent 失败事件共用的错误详情。')

export const ErrorResponseSchema = z.object({
  error: ContractErrorSchema,
}).describe('统一失败形态；异步方法以此形态拒绝，成功返回值不包裹 error。')

export const BootstrapSchema = z.object({
  appVersion: z.string().min(1).describe('应用版本。'),
  contractVersion: z.literal(CONTRACT_VERSION).describe('数据访问契约版本。'),
  mode: z.enum(['mock', 'real']).describe('当前数据实现；默认 mock。'),
  scenario: z.enum(['normal', 'empty', 'error', 'slow', 'boot-error']).describe('当前场景；real 使用 normal。'),
  notice: z.string().optional().describe('加载页可展示的通知文案。'),
}).describe('启动完成后返回的版本、运行模式与通知。')

export const ModuleDefSchema = z.object({
  id: ModuleIdSchema,
  zh: z.string().min(1).describe('模块中文标题。'),
  en: z.string().describe('模块英文副标；界面以全大写呈现，空串表示不显示。'),
  description: z.string().min(1).describe('模块库中的功能说明。'),
  defaultSpan: z.int().positive().describe('默认栅格跨列数；渲染时不超过当前栅格列数。'),
  order: z.int().positive().describe('默认布局顺序，从 1 开始，按升序返回。'),
}).describe('模块库定义；不含组件实现。')

export const DailyBriefSchema = z.object({
  date: TradingDateSchema.describe('日报所属交易日，也是日报页面的日期标识。'),
  conclusions: z.array(z.string().min(1)).describe('核心结论；焦点带最多显示前三条。'),
  figures: z.array(FigureSchema).describe('关键数字；界面按 semantic 分入行情与指标两段。'),
}).describe('今日焦点带使用的日报摘要。')

export const DailyBriefResponseSchema = z.object({
  brief: DailyBriefSchema.nullable().describe('日报摘要；null 表示所选交易日没有日报。'),
  reason: z.string().optional().describe('无日报时供空态展示的原因，例如今日日报尚未生成。'),
}).describe('日报查询结果；没有日报不属于请求失败。')

export const MarketBoardSchema = z.object({
  columns: z.array(z.object({
    id: z.string().min(1).describe('盘面列的唯一标识。'),
    label: z.string().min(1).describe('盘面列标题。'),
  }).describe('盘面列定义。')).describe('按展示顺序排列的盘面列。'),
  rows: z.array(z.object({
    id: z.string().min(1).describe('盘面行的合约标识。'),
    label: z.string().min(1).describe('合约显示名称。'),
    cells: z.array(BoardCellSchema).describe('与 columns 顺序对应的盘面格；数值使用 market 语义。'),
  }).describe('一行合约盘面数据。')).describe('按展示顺序排列的合约行；空列表表示无数据。'),
  series: SparkSeriesSchema.describe('模块头部样例折线的行情序列；无数据时 points 为空。'),
  asOf: TimestampSchema.describe('盘面数据截至时间，用于模块右注。'),
}).describe('行情盘面网格与样例序列。')

export const WatchlistTableSchema = z.object({
  rows: z.array(z.object({
    id: z.string().min(1).describe('关注合约的唯一标识。'),
    name: z.string().min(1).describe('合约显示名称。'),
    price: FigureSchema.describe('最新合约价格，market 语义。'),
    change: FigureSchema.describe('相对前结算价的绝对涨跌，value 为带符号变化量，market 语义。'),
    changePct: FigureSchema.describe('相对前结算价的涨跌幅，value 为百分数值，单位为 %，market 语义。'),
    spark: SparkSeriesSchema.describe('该合约的历史价格迷你折线，market 语义。'),
  }).describe('一个关注合约的数值和历史价格。')).describe('按用户关注顺序排列；空列表表示无数据。'),
  asOf: TimestampSchema.describe('关注列表数据截至时间，用于模块右注。'),
}).describe('关注合约价格表，不含真实用户头寸。')

export const CalendarEntrySchema = z.object({
  id: z.string().min(1).describe('日程唯一标识。'),
  ts: TimestampSchema.describe('计划发布时间，ISO 8601 带偏移；日期与时间由该字段展示。'),
  name: z.string().min(1).describe('数据发布名称。'),
  source: z.string().min(1).describe('发布来源名称。'),
  status: z.enum(['fresh', 'stale']).describe('fresh 为已更新，stale 为待更新。'),
}).describe('数据发布日程，查询结果按 ts 升序排列。')

export const ModuleSummarySchema = z.object({
  moduleId: ModuleIdSchema,
  text: z.string().describe('示例摘要或所属 domain feature 的占位说明。'),
  figures: z.array(FigureSchema).describe('示例指标；没有数值时为空列表。'),
  asOf: TimestampSchema.describe('摘要数据截至时间，用于模块右注。'),
}).describe('库存、物流、头寸与文档目录等模块的示例摘要。')

export const NewsItemSchema = z.object({
  id: z.string().min(1).describe('资讯唯一标识。'),
  title: z.string().min(1).describe('ticker 显示的资讯标题。'),
  source: z.string().min(1).describe('资讯来源名称。'),
  ts: TimestampSchema.describe('资讯发布时间，ISO 8601 带偏移。'),
}).describe('顶栏资讯条目。')

export const SourceStatusSchema = z.object({
  id: z.string().min(1).describe('数据源唯一标识。'),
  name: z.string().min(1).describe('数据源显示名称。'),
  status: z.enum(['fresh', 'stale']).describe('fresh 为新鲜，stale 为待更新；不使用行情涨跌色。'),
  asOf: TimestampSchema.nullable().describe('最近一次数据截至时间，ISO 8601 带偏移；从未更新时为 null。'),
}).describe('顶栏数据源新鲜度。')

export const ResearchItemSchema = z.object({
  id: z.string().min(1).describe('研究唯一标识，用于专题研究子路由。'),
  title: z.string().min(1).describe('动态研究菜单标题。'),
}).describe('专题研究动态菜单条目。')

export const SendMessageSchema = z.object({
  sessionId: z.string().min(1).optional().describe('已有会话 ID；缺省时新建会话。'),
  message: z.string().trim().min(1).describe('用户消息；入口去除两端空白后不可为空。'),
}).describe('提交给 agent 的用户消息。')

export const SendReceiptSchema = z.object({
  sessionId: z.string().min(1).describe('接收消息的会话 ID。'),
  runId: z.string().min(1).describe('本次运行 ID，与后续事件一致。'),
}).describe('消息受理回执；不表示运行完成，终态由事件流提供。')

// 作业契约 v2：先交付 schema；版本与方法接线由 T-A09 及后续任务完成。
export const StageSchema = z.enum(['collect', 'process', 'analyze', 'deliver']).describe('固定阶段顺序：提取 → 处理 → 分析 → 交付。')
export const StageStateSchema = z.enum(['not_started', 'running', 'needs_human', 'done', 'conflict']).describe('阶段状态；不另设 failed，运行失败以 conflict 呈现，原因见 Job.reason。')
export const JobTypeSchema = z.enum(['daily', 'research', 'adhoc']).describe('作业类型：日报、专题、临时。')
export const JobStatusSchema = z.enum(['draft', 'collecting', 'processing', 'analyzing', 'delivering', 'delivered', 'needs_human', 'failed', 'cancelled']).describe('九种作业状态；运行失败以 conflict 呈现，原因见 Job.reason。delivered / cancelled 作业领域只读。')
export const ActiveJobStatusSchema = JobStatusSchema.exclude(['delivered', 'cancelled']).describe('进行中 = 非终结；终结 = 领域只读门封存的 delivered / cancelled；failed 可经 rerunStage 继续、以 conflict 阶段呈现，计入进行中；draft 计入。')
export const ACTIVE_JOB_STATUSES = ActiveJobStatusSchema.options
export const ArtifactKindSchema = z.enum(['dataset', 'recipe', 'analysis', 'deliverable']).describe('阶段产物类型：数据集、配方、分析稿、交付物。')
export const ArtifactStatusSchema = z.enum(['draft', 'provisional', 'confirmed', 'conflict']).describe('产物 / 块状态，独立于交付物定稿状态；confirmed 不等于 final。')
export const SourceSchema = z.enum(['external', 'human', 'agent', 'mixed']).describe('内容来源；派生内容保留人 / agent / 混合来源与作者信息。')
export const OriginSchema = z.enum(['source', 'derived']).describe('source 为源材料，derived 为派生内容；派生徽显示内部生成，source 作为次文案保留。')
export const InterventionKindSchema = z.enum(['ingest', 'map_fix', 'recipe', 'framework', 'question', 'delete', 'rewrite', 'veto', 'approve', 'ask_why', 'pin_rule', 'rerun', 'finalize']).describe('v1 子集；interaction §3.4 的 source_pref / value_fix 归后续处理台 / data-layer 映射 feature；定稿在 interaction 示意表中归 approve，本契约用独立的 finalize 承载。')
export const InterventionOutcomeSchema = z.enum(['recorded', 'pending', 'merged', 'rejected']).describe('介入处理结果；检查点只更新 outcome，不改原动作。')
export const UploadStatusSchema = z.enum(['pending_validation', 'ingested', 'quarantined']).describe('抽取结果：待验证、已入库、隔离；本 feature 不实现真实闸门。')
export const DeliverableStatusSchema = z.enum(['draft', 'final']).describe('交付物定稿状态，只由显式定稿动作从 draft 变为 final，不自动定稿、不可撤销。')

export const JobStatusLabel = {
  draft: { text: '草稿', icon: '◇' }, collecting: { text: '提取中', icon: '↓' },
  processing: { text: '处理中', icon: '⚙' }, analyzing: { text: '分析中', icon: '⌕' },
  delivering: { text: '交付中', icon: '▤' }, delivered: { text: '已交付', icon: '✓' },
  needs_human: { text: '待人工确认', icon: '!' }, failed: { text: '失败', icon: '×' }, cancelled: { text: '已取消', icon: '⊘' },
} as const
export const StageLabel = {
  collect: { text: '提取', icon: '↓' }, process: { text: '处理', icon: '⚙' },
  analyze: { text: '分析', icon: '⌕' }, deliver: { text: '交付', icon: '▤' },
} as const
export const StageStateLabel = {
  not_started: { text: '未开始', icon: '○' }, running: { text: '运行中', icon: '↻' },
  needs_human: { text: '待人工确认', icon: '!' }, done: { text: '已完成', icon: '✓' }, conflict: { text: '冲突', icon: '⚠' },
} as const
export const ArtifactStatusLabel = {
  draft: { text: '草稿', icon: '◇' }, provisional: { text: '暂定', icon: '◐' },
  confirmed: { text: '已确认', icon: '✓' }, conflict: { text: '冲突', icon: '⚠' },
} as const
export const UploadStatusLabel = {
  pending_validation: { text: '待验证', icon: '?' }, ingested: { text: '已入库', icon: '✓' }, quarantined: { text: '隔离', icon: '⊘' },
} as const
export const DeliverableStatusLabel = { draft: { text: '草稿', icon: '◇' }, final: { text: '已定稿', icon: '✓' } } as const
export const SourceLabel = {
  external: { text: '外部源', icon: '↗' }, human: { text: '人', icon: '♙' },
  agent: { text: 'agent', icon: '✦' }, mixed: { text: '混合', icon: '⋈' },
} as const
export const OriginLabel = { source: { text: '源材料', icon: '↗' }, derived: { text: '内部生成', icon: '⋈' } } as const
export const JobTypeLabel = {
  daily: { text: '日报', icon: '▤' }, research: { text: '专题', icon: '⌕' }, adhoc: { text: '临时', icon: '◇' },
} as const

export const JobStatusLabelSchema = labelSchema(JobStatusLabel).describe('作业状态展示映射：文案与图标同源。')
export const StageLabelSchema = labelSchema(StageLabel).describe('阶段展示映射，顺序同 Stage。')
export const StageStateLabelSchema = labelSchema(StageStateLabel).describe('阶段态展示映射；conflict 也用于运行失败，原因见 Job.reason。')
export const ArtifactStatusLabelSchema = labelSchema(ArtifactStatusLabel).describe('产物与块状态展示映射。')
export const UploadStatusLabelSchema = labelSchema(UploadStatusLabel).describe('抽取结果展示映射。')
export const DeliverableStatusLabelSchema = labelSchema(DeliverableStatusLabel).describe('交付物定稿状态展示映射：草稿 / 已定稿。')
export const SourceLabelSchema = labelSchema(SourceLabel).describe('来源展示映射；derived 时保留为次文案。')
export const OriginLabelSchema = labelSchema(OriginLabel).describe('派生来源展示映射：内部生成；根来源索引与推断标记归后续知识库 feature。')
export const JobTypeLabelSchema = labelSchema(JobTypeLabel).describe('作业类型展示映射。')

// 九张展示映射共用同一转换，literal 值直接来自运行时常量，供文档生成器展开。
function labelSchema<const T extends Record<string, { readonly text: string; readonly icon: string }>>(labels: T) {
  const shape = Object.fromEntries(Object.entries(labels).map(([key, value]) => [key,
    z.object({ text: z.literal(value.text), icon: z.literal(value.icon) }),
  ])) as { [K in keyof T]: z.ZodObject<{ text: z.ZodLiteral<T[K]['text']>; icon: z.ZodLiteral<T[K]['icon']> }> }
  return z.object(shape)
}

export const StageSummarySchema = z.object({
  stage: StageSchema,
  state: StageStateSchema,
  pendingCount: z.int().nonnegative().describe('本阶段未读且未解决的收件箱条目数。'),
}).describe('阶段状态与待处理计数，来自契约而非 UI 推导。')
const jobStagesSchema = z.array(StageSummarySchema).length(4).refine(
  stages => stages.every((item, index) => item.stage === StageSchema.options[index]),
  'stages 必须按 collect / process / analyze / deliver 顺序且各一项',
).describe('恰四项，固定顺序 collect / process / analyze / deliver，各一项；顺序约束由 zod 边界校验。')
const jobSummaryFields = {
  id: z.string().min(1).describe('作业唯一标识。'),
  title: z.string().trim().min(1).describe('作业标题，不能为空。'),
  type: JobTypeSchema,
  subject: z.string().nullable().describe('品种 / 主题；未指定时为 null。'),
  status: JobStatusSchema,
  currentStage: StageSchema,
  updatedAt: TimestampSchema.describe('作业更新时间；列表默认按此倒序。'),
  reason: z.string().nullable().describe('失败 / 取消原因；failed / cancelled 时必须非空。'),
  stages: jobStagesSchema,
  pendingCount: z.int().nonnegative().describe('作业未读且未解决的收件箱条目数。'),
}
export const JobListItemSchema = z.object(jobSummaryFields).refine(hasJobReason, {
  path: ['reason'], message: 'failed / cancelled 必须提供非空原因',
}).describe('作业列表摘要，字段固定；不含目标说明或创建者。')
export const JobSchema = z.object({
  ...jobSummaryFields,
  goal: z.string().describe('目标说明，可为空。'),
  createdBy: z.enum(['human', 'schedule']).describe('创建者：人或计划。'),
  parentJobId: z.string().min(1).nullable().describe('父作业锚；没有父作业时为 null。'),
}).refine(hasJobReason, { path: ['reason'], message: 'failed / cancelled 必须提供非空原因' }).describe('作业详情；getJob 仅在 empty 场景查询预置 fixture id 时返回 null，任何场景的未知 id 返回 not_found。')
export const JobContextSchema = z.object({
  jobId: z.string().min(1).describe('作业上下文锚；命名对照 job_id→jobId。'),
  stage: StageSchema,
}).describe('作业上下文；契约统一 camelCase：job_id→jobId、artifact_id→artifactId、base_rev→baseRev、created_at→createdAt。')
export const InboxItemSchema = z.object({
  id: z.string().min(1).describe('收件箱条目唯一标识。'),
  jobId: z.string().min(1).describe('所属作业。'),
  stage: StageSchema,
  artifactId: z.string().min(1).nullable().describe('产物锚；不适用时 null。'),
  revisionId: z.string().min(1).nullable().describe('修订锚；不适用时 null。'),
  interventionId: z.string().min(1).nullable().describe('介入锚；不适用时 null。'),
  reason: z.enum(['needs_human', 'conflict', 'pending_merge', 'revision_review']).describe('待处理原因。'),
  createdAt: TimestampSchema,
  read: z.boolean().describe('已读只清角标，不删除条目。'),
  resolved: z.boolean().describe('已解决与已读独立；计数只数未读且未解决条目。'),
}).describe('作业收件箱条目，不适用的锚明确为 null。')

function hasJobReason(job: { status: JobStatus; reason: string | null }) {
  return !['failed', 'cancelled'].includes(job.status) || (job.reason !== null && job.reason.trim().length > 0)
}

export const SourceNoteSchema = z.strictObject({
  purpose: z.string().trim().min(1).describe('来源用途，必填且非空。'),
  reliability: z.enum(['high', 'medium', 'low', 'unknown']).describe('来源可靠性：高 / 中 / 低 / 未知。'),
  publishedAt: TradingDateSchema.nullable().describe('材料发布日期 YYYY-MM-DD，未知时 null；不是交付物定稿时间。'),
  validUntil: TradingDateSchema.nullable().describe('材料有效期 YYYY-MM-DD，未知时 null。'),
  scopeNote: z.string().nullable().describe('口径备注；未提供时 null。'),
}).describe('投放来源语境，不改变序列身份。')
export const INTAKE_FILE_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'md', 'csv'] as const
export const IntakeFileMetaSchema = z.strictObject({
  name: z.string().min(1).refine(name => INTAKE_FILE_EXTENSIONS.some(ext => name.toLowerCase().endsWith(`.${ext}`)),
    '只接受 pdf / docx / xlsx / md / csv 文件').describe('文件名；扩展名白名单 pdf / docx / xlsx / md / csv，大小写不敏感。'),
  size: z.int().nonnegative().describe('文件字节数，只记录元数据。'),
  type: z.string().describe('浏览器报告的 MIME 类型，可为空；文件白名单按扩展名校验。'),
  lastModified: z.int().nonnegative().describe('文件最后修改时间，Unix 毫秒。'),
}).describe('文件元数据，不包含 File 对象、正文或字节。')
const intakeFields = {
  jobId: z.string().min(1).nullable().describe('目标作业；null 表示进入待归属池。'),
  sourceNote: SourceNoteSchema,
}
export const IntakeInputSchema = z.discriminatedUnion('inputKind', [
  z.strictObject({ ...intakeFields, inputKind: z.literal('file'), fileMeta: IntakeFileMetaSchema }),
  z.strictObject({ ...intakeFields, inputKind: z.literal('url'), url: z.string().trim().min(1).describe('URL 字符串；仅保存，不发起抓取。') }),
  z.strictObject({ ...intakeFields, inputKind: z.literal('text'), text: z.string().trim().min(1).describe('粘贴正文，只存在于提交参数与内存草稿，不进入 Upload 或持久化。') }),
]).describe('三种投放输入，必须选择一种；只校验元数据，不解析原文。')
export const FieldMappingSchema = z.array(z.strictObject({
  sourceField: z.string().min(1).describe('抽取的源字段 / 列名。'),
  targetField: z.string().min(1).describe('映射后的目标字段。'),
  unit: z.string().min(1).describe('映射字段单位，修正时一同提交。'),
})).describe('字段映射列表；空列表表示没有结构化字段。')
export const ExtractionPreviewSchema = z.strictObject({
  detectedType: z.string().min(1).describe('mock 识别类型，不代表真实解析结果。'),
  fields: FieldMappingSchema,
  unit: z.string().nullable().describe('预览整体单位；无结构化数值时 null。'),
  timeRange: z.strictObject({ start: TradingDateSchema, end: TradingDateSchema }).nullable().describe('识别的日期范围；未知时 null。'),
}).describe('合成抽取预览；确认前仍为待验证。')
const uploadFields = {
  ...intakeFields,
  id: z.string().min(1).describe('投放唯一标识。'),
  status: UploadStatusSchema,
  mapping: FieldMappingSchema,
  createdAt: TimestampSchema,
  removed: z.boolean().describe('仅从当前视图移除，历史锚保留。'),
  quarantineReason: z.string().min(1).optional().describe('隔离样例的模拟判定原因。'),
}
export const UploadSchema = z.discriminatedUnion('inputKind', [
  z.strictObject({ ...uploadFields, inputKind: z.literal('file'), fileMeta: IntakeFileMetaSchema }),
  z.strictObject({ ...uploadFields, inputKind: z.literal('url'), url: z.string().min(1) }),
  z.strictObject({ ...uploadFields, inputKind: z.literal('text') }),
]).describe('投放持久化记录；只含元数据 / 来源语境 / 映射 / 状态，拒绝粘贴正文与完整提交参数。')
export const DataSourceRefSchema = z.strictObject({
  id: z.string().min(1).describe('数据源锚。'), name: z.string().min(1).describe('来源名称。'),
}).describe('处理台数据源引用，不复制源数据。')
export const SeriesRefSchema = SparkSeriesSchema.omit({ points: true }).extend({
  label: z.string().min(1).describe('序列显示名称。'),
  sourceId: z.string().min(1).describe('所属 DataSourceRef.id。'),
}).describe('处理台序列引用及元数据，不含观测点。')
export const RecipeStepSchema = z.strictObject({
  id: z.string().min(1).describe('步骤标识。'),
  label: z.string().min(1).describe('加工步骤说明。'),
  input: z.string().min(1).describe('单链输入锚：源序列 / 表或上一项的 output。'),
  output: z.string().min(1).describe('本步骤输出锚，供下一步输入引用。'),
}).describe('按列表顺序呈现的单链配方步骤；只读，不提供 DAG 编辑。')
export const LineageAnchorSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('observation'), ref: z.string().min(1), label: z.string().min(1) }).describe('观测锚：ref 定位观测（如 seriesId@ts）。'),
  z.strictObject({ kind: z.literal('tableRow'), ref: z.string().min(1), label: z.string().min(1) }).describe('表行锚：ref 定位表行（如 tableId#row）。'),
]).describe('派生值根来源定位；只引用、不复制原文。')
export const DerivedValueSchema = z.strictObject({
  value: z.number().nullable().describe('派生值，null 表示缺数，不等于零。'),
  unit: z.string().min(1).describe('派生值单位。'),
  lineage: z.array(LineageAnchorSchema).min(1).describe('至少一个观测或表行来源锚。'),
}).describe('可回溯来源的派生值。')
export const ParamSetSchema = z.strictObject({
  unit: z.string().min(1).describe('输出单位。'), timezone: z.string().min(1).describe('时区。'),
  calendar: z.string().min(1).describe('日历口径。'), resample: z.string().min(1).describe('重采样口径。'),
  aggregation: z.string().min(1).describe('聚合方式。'),
}).describe('加工参数；v1 保存口径字符串，不执行真实数据处理。')
export const ParamChangeSchema = ParamSetSchema.partial().refine(changes => Object.values(changes).some(value => value !== undefined),
  '至少修改一项参数').describe('参数补丁：至少一项 unit / timezone / calendar / resample / aggregation，不接受其他参数。')
export const ReconciliationDiffSchema = z.strictObject({
  ...FigureSchema.pick({ unit: true, freq: true, semantic: true, asOf: true, seriesId: true }).shape,
  sources: z.tuple([DataSourceRefSchema, DataSourceRefSchema]).describe('左右两个来源，顺序对应行中的 leftValue / rightValue。'),
  rows: z.array(z.strictObject({
    ts: TimestampSchema,
    leftValue: z.number().nullable().describe('左来源原值。'),
    rightValue: z.number().nullable().describe('右来源原值。'),
    difference: z.number().nullable().describe('契约给出的差值，null 表示不可比较。'),
    differs: z.boolean().describe('契约给出的差异标记，UI 不重新计算。'),
  })).describe('对账差异行；空行集表示无差异。'),
}).describe('同序列两来源的对账，单位 / 频率 / 语义 / asOf / seriesId 复用 Figure 元数据。')
export const EvidenceAnchorSchema = z.strictObject({
  kind: z.enum(['assertion', 'series', 'source']).describe('证据锚类型：断言 / 序列 / 来源。'),
  ref: z.string().min(1).describe('目标引用，供来源跳转使用。'),
  label: z.string().min(1).describe('证据显示名称。'),
}).describe('结论证据链锚，不计算独立证据权重。')
export const ConclusionSchema = z.strictObject({
  id: z.string().min(1), text: z.string().min(1).describe('结论正文，删除 / 否决后仍保留。'),
  status: ArtifactStatusSchema, source: SourceSchema, origin: OriginSchema,
  evidence: z.array(EvidenceAnchorSchema).describe('证据链，显示数量直接取数组长度；允许空链，不另存数字字段。'),
  deleted: z.boolean().optional().describe('删除 tombstone；旧内容与旧版本保留。'),
  vetoed: z.boolean().optional().describe('否决 tombstone；旧内容与旧版本保留。'),
}).describe('分析结论卡及其证据链、状态和来源。')

export const contractSchemas = {
  SourceNote: SourceNoteSchema,
  IntakeFileMeta: IntakeFileMetaSchema,
  IntakeInput: IntakeInputSchema,
  FieldMapping: FieldMappingSchema,
  ExtractionPreview: ExtractionPreviewSchema,
  Upload: UploadSchema,
  DataSourceRef: DataSourceRefSchema,
  SeriesRef: SeriesRefSchema,
  RecipeStep: RecipeStepSchema,
  LineageAnchor: LineageAnchorSchema,
  DerivedValue: DerivedValueSchema,
  ParamSet: ParamSetSchema,
  ParamChange: ParamChangeSchema,
  ReconciliationDiff: ReconciliationDiffSchema,
  EvidenceAnchor: EvidenceAnchorSchema,
  Conclusion: ConclusionSchema,
  StageSummary: StageSummarySchema,
  Job: JobSchema,
  JobListItem: JobListItemSchema,
  JobContext: JobContextSchema,
  InboxItem: InboxItemSchema,
  Stage: StageSchema,
  StageState: StageStateSchema,
  JobType: JobTypeSchema,
  JobStatus: JobStatusSchema,
  ActiveJobStatus: ActiveJobStatusSchema,
  ArtifactKind: ArtifactKindSchema,
  ArtifactStatus: ArtifactStatusSchema,
  Source: SourceSchema,
  Origin: OriginSchema,
  InterventionKind: InterventionKindSchema,
  InterventionOutcome: InterventionOutcomeSchema,
  UploadStatus: UploadStatusSchema,
  DeliverableStatus: DeliverableStatusSchema,
  JobStatusLabel: JobStatusLabelSchema,
  StageLabel: StageLabelSchema,
  StageStateLabel: StageStateLabelSchema,
  ArtifactStatusLabel: ArtifactStatusLabelSchema,
  UploadStatusLabel: UploadStatusLabelSchema,
  DeliverableStatusLabel: DeliverableStatusLabelSchema,
  SourceLabel: SourceLabelSchema,
  OriginLabel: OriginLabelSchema,
  JobTypeLabel: JobTypeLabelSchema,
  TradingDate: TradingDateSchema,
  Timestamp: TimestampSchema,
  Semantic: SemanticSchema,
  ModuleId: ModuleIdSchema,
  Figure: FigureSchema,
  BoardCell: BoardCellSchema,
  SparkSeries: SparkSeriesSchema,
  ContractError: ContractErrorSchema,
  ErrorResponse: ErrorResponseSchema,
  Bootstrap: BootstrapSchema,
  ModuleDef: ModuleDefSchema,
  DailyBrief: DailyBriefSchema,
  DailyBriefResponse: DailyBriefResponseSchema,
  MarketBoard: MarketBoardSchema,
  WatchlistTable: WatchlistTableSchema,
  CalendarEntry: CalendarEntrySchema,
  ModuleSummary: ModuleSummarySchema,
  NewsItem: NewsItemSchema,
  SourceStatus: SourceStatusSchema,
  ResearchItem: ResearchItemSchema,
  SendMessage: SendMessageSchema,
  SendReceipt: SendReceiptSchema,
} as const

export type TradingDate = z.infer<typeof TradingDateSchema>
export type Timestamp = z.infer<typeof TimestampSchema>
export type ModuleId = z.infer<typeof ModuleIdSchema>
export type Semantic = z.infer<typeof SemanticSchema>
export type Figure = z.infer<typeof FigureSchema>
export type BoardCell = z.infer<typeof BoardCellSchema>
export type SparkSeries = z.infer<typeof SparkSeriesSchema>
export type ContractError = z.infer<typeof ContractErrorSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type Bootstrap = z.infer<typeof BootstrapSchema>
export type ModuleDef = z.infer<typeof ModuleDefSchema>
export type DailyBrief = z.infer<typeof DailyBriefSchema>
export type DailyBriefResponse = z.infer<typeof DailyBriefResponseSchema>
export type MarketBoard = z.infer<typeof MarketBoardSchema>
export type WatchlistTable = z.infer<typeof WatchlistTableSchema>
export type CalendarEntry = z.infer<typeof CalendarEntrySchema>
export type ModuleSummary = z.infer<typeof ModuleSummarySchema>
export type NewsItem = z.infer<typeof NewsItemSchema>
export type SourceStatus = z.infer<typeof SourceStatusSchema>
export type ResearchItem = z.infer<typeof ResearchItemSchema>
export type SendMessage = z.infer<typeof SendMessageSchema>
export type SendReceipt = z.infer<typeof SendReceiptSchema>

export type Stage = z.infer<typeof StageSchema>
export type StageState = z.infer<typeof StageStateSchema>
export type JobType = z.infer<typeof JobTypeSchema>
export type JobStatus = z.infer<typeof JobStatusSchema>
export type ActiveJobStatus = z.infer<typeof ActiveJobStatusSchema>
export type ArtifactKind = z.infer<typeof ArtifactKindSchema>
export type ArtifactStatus = z.infer<typeof ArtifactStatusSchema>
export type Source = z.infer<typeof SourceSchema>
export type Origin = z.infer<typeof OriginSchema>
export type InterventionKind = z.infer<typeof InterventionKindSchema>
export type InterventionOutcome = z.infer<typeof InterventionOutcomeSchema>
export type UploadStatus = z.infer<typeof UploadStatusSchema>
export type DeliverableStatus = z.infer<typeof DeliverableStatusSchema>
export type StageSummary = z.infer<typeof StageSummarySchema>
export type Job = z.infer<typeof JobSchema>
export type JobListItem = z.infer<typeof JobListItemSchema>
export type JobContext = z.infer<typeof JobContextSchema>
export type InboxItem = z.infer<typeof InboxItemSchema>
export type SourceNote = z.infer<typeof SourceNoteSchema>
export type IntakeFileMeta = z.infer<typeof IntakeFileMetaSchema>
export type IntakeInput = z.infer<typeof IntakeInputSchema>
export type FieldMapping = z.infer<typeof FieldMappingSchema>
export type ExtractionPreview = z.infer<typeof ExtractionPreviewSchema>
export type Upload = z.infer<typeof UploadSchema>
export type DataSourceRef = z.infer<typeof DataSourceRefSchema>
export type SeriesRef = z.infer<typeof SeriesRefSchema>
export type RecipeStep = z.infer<typeof RecipeStepSchema>
export type LineageAnchor = z.infer<typeof LineageAnchorSchema>
export type DerivedValue = z.infer<typeof DerivedValueSchema>
export type ParamSet = z.infer<typeof ParamSetSchema>
export type ParamChange = z.infer<typeof ParamChangeSchema>
export type ReconciliationDiff = z.infer<typeof ReconciliationDiffSchema>
export type EvidenceAnchor = z.infer<typeof EvidenceAnchorSchema>
export type Conclusion = z.infer<typeof ConclusionSchema>
