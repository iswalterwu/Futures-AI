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
  decimals: z.int().nonnegative().describe('显示小数位数；方向与零值按此精度取整后判定。'),
  freq: z.string().min(1).describe('数据频率，例如 1d、1w、1mo。'),
  delta: z.number().nullable().optional().describe('变化量；缺省表示未提供，null 表示缺数；pct 时为百分数值，1.5 表示 1.5%。'),
  deltaKind: z.enum(['abs', 'pct']).optional().describe('变化量口径：abs 为本单位绝对变化，pct 为百分数值；缺省按 abs。'),
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

export const contractSchemas = {
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
