import { z } from 'zod'
import { AgentEventSchema } from '../agent/events.ts'
import type { AgentClient, DataClient } from './client.ts'
import {
  BootstrapSchema,
  CalendarEntrySchema,
  CreateJobInputSchema,
  ExtractionPreviewSchema,
  FieldMappingSchema,
  IntakeInputSchema,
  IntakeReceiptSchema,
  WriteReceiptSchema,
  CONTRACT_VERSION,
  DailyBriefResponseSchema,
  ErrorResponseSchema,
  JobSchema,
  JobListItemSchema,
  JobStatusSchema,
  JobTypeSchema,
  StageSchema,
  StageWorkspaceSchema,
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
  contractChange: '2.0.0：新增作业 / 阶段 / 产物 / 介入 / 交付物 / 版本契约与作业方法，封闭场景枚举从五值扩为九值，SendMessage 与十类事件增加可选 jobContext；既有字段与 v1 方法语义保留，旧消息 / 事件仍可解析。新增必实现方法与封闭枚举扩展使旧 real 实现不再满足完整接口，故升 MAJOR；旧 bootstrap 的 contractVersion=1.0.0 不兼容，必须声明 2.0.0。作业方法随状态层任务逐项接入，本版本号本身不表示状态层已实现。',
  jobScenarios: '九场景优先级：?scenario= > VITE_MOCK_SCENARIO > normal。normal：j-collect / j-process / j-deliver / j-failed / j-cancelled；empty：初始化为空，预置 id 的 getJob=null、工作区为空，未知 id 为 not_found；error：bootstrap / 目录成功，作业业务读写 adapter_error；slow：normal 行为，逐调用延迟 1500ms，写入在延迟后提交；boot-error：首次 bootstrap 失败、重试成功，作业行为同 normal。job-running：j-running / j-human（处理待确认、下游运行）；job-pending-merge：j-merge 初始无 overlay，由显式 send(long) 驱动编辑与同 run 检查点；job-conflict：j-conflict 保留冲突两版与 provisional 快照；job-delivered：j-delivered 已定稿，领域写入 validation_error。v1 十个方法在 job-* 下按 normal 行为。CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准。jobFixtures 键为 jobs / job-detail / deliverable / interventions / uploads（fixtures/jobs 下文件名去掉 .json），每个给出的键整体替换对应内置文件，不深合并；jobs 按 normal / job-running / job-pending-merge / job-conflict / job-delivered 集合分键，新增一项须以原集合加该项整体替换，未覆盖键沿用内置文件，非法覆盖 validation_error。job-state.ts 在每次 createMockDataClient() 建立 / 重建模块级唯一共享状态时读取 scenario 与 jobFixtures 各一次；AgentClient 与所有 DataClient 共用当前状态，不各持一份。切换覆盖值须新建 client，沿用 v1 测试在系统边界 spy 委托的做法；与 v1 fixtures 每次请求读取不同。覆盖集合缺工作区样例时返回带阶段的空工作区；非 normal 或存在覆盖时仅内存，不读写清空 fai.jobs.v1 / fai.inbox.v1。无 jobScript，仍用 success / failure / retry / long；不因读取自动运行。状态、持久化与收件箱生成由后续状态层任务接入。',
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
  listJobs: {
    description: '按状态、类型与标题子串组合筛选作业摘要；省略 filter 或传空对象恢复全列表，默认按 updatedAt 时间倒序，不分页。empty 初始化为空；error 返回 adapter_error；slow 每次调用延迟 1500ms。读取当前共享会话状态并返回副本。',
    params: z.tuple([
      z.strictObject({
        status: JobStatusSchema.optional().describe('status：可选作业状态，精确匹配。'),
        type: JobTypeSchema.optional().describe('type：可选作业类型，精确匹配。'),
        title: z.string().optional().describe('title：可选标题子串，区分大小写；空串不限制标题。'),
      }).optional().describe('filter：可选组合条件，各条件同时满足；省略条件不限制对应字段。'),
    ]).describe('作业列表查询的位置参数。'),
    result: z.array(JobListItemSchema).describe('按更新时间倒序排列的作业摘要副本；没有匹配项时为空数组。'),
  },
  getJob: {
    description: '读取当前共享会话的作业详情副本；empty 的预置 normal 集合作业 id 返回 null，其他未知 id 在任何场景均为 not_found（独立于 error）；error 的已知目标返回 adapter_error；slow 每次调用延迟 1500ms。',
    params: z.tuple([
      z.string().min(1).describe('jobId：作业唯一标识，非空。'),
    ]).describe('作业详情查询的位置参数。'),
    result: JobSchema.nullable().describe('作业详情副本；仅 empty 初始化的预置 id 返回 null。'),
  },
  getStageWorkspace: {
    description: '按作业与阶段读取当前共享状态的工作区副本，不按阶段态过滤内容或启动运行。empty 预置 id 与覆盖集合中缺工作区样例的作业返回带阶段的空集合（交付物和定稿快照为 null）；未知 id 在任何场景均为 not_found，error 的已知目标返回 adapter_error；slow 每次调用延迟 1500ms。',
    params: z.tuple([
      z.string().min(1).describe('jobId：工作区所属作业唯一标识，非空。'),
      StageSchema.describe('stage：要读取的阶段，不必是当前阶段。'),
    ]).describe('阶段工作区查询的位置参数。'),
    result: StageWorkspaceSchema,
  },
  createJob: {
    description: '创建人的作业，初始为 collecting / collect，四阶段为运行中 / 未开始 / 未开始 / 未开始；只建立空草稿交付物及首版，不自动推进或定稿。',
    params: z.tuple([CreateJobInputSchema]).describe('input：新作业标题、类型、可空主题与目标说明。'),
    result: WriteReceiptSchema,
  },
  submitIntake: {
    description: '提交一种投放及来源说明，返回待验证记录与合成预览，不解析或抓取正文。jobId 非空时归入该作业并记录 ingest，否则进入待归属池；终结作业拒绝写入。',
    params: z.tuple([IntakeInputSchema]).describe('input：提交时确定的作业锚、输入种类及来源说明。'),
    result: IntakeReceiptSchema,
  },
  getIntakePreview: {
    description: '读取投放锚对应的合成预览副本，未知锚返回 not_found。',
    params: z.tuple([z.string().min(1).describe('uploadId：投放唯一标识，非空。')]).describe('投放预览查询的位置参数。'),
    result: ExtractionPreviewSchema,
  },
  confirmIntake: {
    description: '确认未删除的待验证投放并修正映射；有既定隔离原因时保留原因并隔离，否则入库。保留修正前映射，已归属者追加 dataset 修订与 map_fix；终结作业拒绝写入。',
    params: z.tuple([
      z.string().min(1).describe('uploadId：待确认投放锚。'),
      FieldMappingSchema.describe('mapping：修正后的字段与单位映射。'),
    ]).describe('投放确认的位置参数。'),
    result: IntakeReceiptSchema,
  },
  resetMockData: {
    description: '显式重置作业样例记录与已读状态，恢复种子数据；不影响导航、抽屉与布局设置，不生成分析介入事件。',
    params: noParams,
    result: z.null().describe('重置完成，无返回数据。'),
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
