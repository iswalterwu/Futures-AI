import { z } from 'zod'
import { AgentEventSchema } from '../agent/events.ts'
import type { AgentClient, DataClient } from './client.ts'
import {
  BootstrapSchema,
  CalendarEntrySchema,
  CONTRACT_VERSION,
  DailyBriefResponseSchema,
  ErrorResponseSchema,
  MarketBoardSchema,
  ModuleDefSchema,
  ModuleIdSchema,
  ModuleSummarySchema,
  NewsItemSchema,
  ResearchItemSchema,
  SendMessageSchema,
  SendReceiptSchema,
  SourceStatusSchema,
  TradingDateSchema,
  WatchlistTableSchema,
} from './types.ts'

type RequestMethods<Client> = {
  [Method in keyof Client]: Client[Method] extends (...args: infer Args) => Promise<infer Result>
    ? { description: string; params: z.ZodType<Args>; result: z.ZodType<Result> }
    : never
}

const noParams = z.tuple([]).describe('无参数。')

export const contractSemantics = {
  version: CONTRACT_VERSION,
  validation: 'mock / real 实现仅在输入与输出边界 parse 一次；界面消费确定类型，不重复校验。',
  errors: ErrorResponseSchema,
  errorDelivery: '所有请求方法失败时以 {error:{code,message,retryable}} 拒绝 Promise；已开始运行的失败通过 run.failed 发布。',
  pagination: 'v1 所有列表一次返回，不分页；空列表不等同于请求失败。',
  date: 'date、from、to 为交易日 YYYY-MM-DD；日历区间包含两端，按发布时间升序返回。',
  timestamp: 'asOf、ts 必须为 ISO 8601 带偏移时间，Z 为 UTC；不接收无时区本地时间。',
  delta: 'deltaKind=pct 时 delta 是百分数值，例如 1.5 表示 1.5%，不是 0.015。',
  events: '每个事件携带 runId、sessionId、ts；stepId 在 run 内单调，同一步文本允许复用编号；done=false 追加，done=true 用权威全文替换；每个 run 恰好一个终态。',
} as const

export const dataMethods = {
  bootstrap: {
    description: '初始化应用并返回版本、数据模式、场景和可选通知；失败后可由加载页重试。',
    params: noParams,
    result: BootstrapSchema,
  },
  getModuleCatalog: {
    description: '返回 v1 七个模块，按 order 升序；该顺序即默认布局，焦点带不在其中。',
    params: noParams,
    result: z.array(ModuleDefSchema).describe('全部模块定义，不分页。'),
  },
  getDailyBrief: {
    description: '读取指定交易日的摘要；省略日期时使用当前交易日，无日报返回 brief=null 与原因。',
    params: z.tuple([
      TradingDateSchema.optional().describe('date：可选交易日 YYYY-MM-DD，缺省为当前交易日。'),
    ]).describe('日报查询的位置参数。'),
    result: DailyBriefResponseSchema,
  },
  getMarketBoard: {
    description: '返回行情盘面网格与样例折线，数值使用 market 语义；无数据时 rows 与序列 points 为空。',
    params: noParams,
    result: MarketBoardSchema,
  },
  getWatchlist: {
    description: '返回关注合约的最新价、涨跌、涨跌幅与迷你折线，全部使用 market 语义。',
    params: noParams,
    result: WatchlistTableSchema,
  },
  getReleaseCalendar: {
    description: '读取 [from, to] 闭区间内的发布日程，from 不晚于 to；按 ts 升序一次返回，不分页；日界按各条 ts 的偏移确定。',
    params: z.tuple([
      TradingDateSchema.describe('from：起始交易日 YYYY-MM-DD，包含当日。'),
      TradingDateSchema.describe('to：结束交易日 YYYY-MM-DD，包含当日。'),
    ]).describe('发布日历查询的位置参数，闭区间。'),
    result: z.array(CalendarEntrySchema).describe('按发布时间升序排列的全部日程。'),
  },
  getModuleSummary: {
    description: '读取模块的示例摘要，供四个占位模块使用；不提供真实用户头寸或私有文档。',
    params: z.tuple([
      ModuleIdSchema.describe('moduleId：需要摘要的模块 ID。'),
    ]).describe('模块摘要查询的位置参数。'),
    result: ModuleSummarySchema,
  },
  getNewsTicker: {
    description: '读取顶栏资讯，按展示顺序一次返回，不分页。',
    params: noParams,
    result: z.array(NewsItemSchema).describe('顶栏资讯列表。'),
  },
  getSourceStatus: {
    description: '读取各数据源新鲜度与截至时间，供顶栏展示待更新状态。',
    params: noParams,
    result: z.array(SourceStatusSchema).describe('全部数据源状态，不分页。'),
  },
  getResearchList: {
    description: '读取专题研究动态子菜单，按展示顺序一次返回，不分页。',
    params: noParams,
    result: z.array(ResearchItemSchema).describe('研究条目列表。'),
  },
} satisfies RequestMethods<DataClient>

export const agentMethods = {
  send: {
    description: '提交用户消息并返回会话与运行 ID；缺省 sessionId 时创建会话，回执仅表示受理，运行进度由 subscribe 提供。',
    params: z.tuple([
      SendMessageSchema.describe('input：会话 ID（可选）与用户消息。'),
    ]).describe('发送消息的位置参数。'),
    result: SendReceiptSchema,
  },
  subscribe: {
    description: '注册应用级事件监听，切页与收起抽屉不取消订阅；v1 不提供历史补发。',
    callback: {
      name: 'cb',
      description: '接收已在契约边界校验的 AgentEvent；应在发送消息前完成订阅。',
      event: AgentEventSchema,
    },
    returns: {
      type: '() => void',
      description: '取消当前监听的函数；不结束 agent 运行，也不提供中止交互。',
    },
  },
} satisfies RequestMethods<Pick<AgentClient, 'send'>> & Record<Exclude<keyof AgentClient, 'send'>, {
  description: string
  callback: { name: string; description: string; event: typeof AgentEventSchema }
  returns: { type: string; description: string }
}>

export const methodSemantics = { ...dataMethods, ...agentMethods } as const
