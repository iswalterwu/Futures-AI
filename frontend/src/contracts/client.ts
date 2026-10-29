import type { AgentEvent } from '../agent/events.ts'
import type {
  Bootstrap,
  CalendarEntry,
  CreateJobInput,
  ExtractionPreview,
  FieldMapping,
  IntakeInput,
  IntakeReceipt,
  WriteReceipt,
  DailyBriefResponse,
  Job,
  JobListItem,
  JobStatus,
  JobType,
  Stage,
  StageWorkspace,
  MarketBoard,
  ModuleDef,
  ModuleId,
  ModuleSummary,
  NewsItem,
  ResearchItem,
  SendMessage,
  SendReceipt,
  SourceStatus,
  TradingDate,
  WatchlistTable,
} from './types.ts'

export interface DataClient {
  bootstrap(): Promise<Bootstrap>
  getModuleCatalog(): Promise<ModuleDef[]>
  getDailyBrief(date?: TradingDate): Promise<DailyBriefResponse>
  getMarketBoard(): Promise<MarketBoard>
  getWatchlist(): Promise<WatchlistTable>
  getReleaseCalendar(from: TradingDate, to: TradingDate): Promise<CalendarEntry[]>
  getModuleSummary(moduleId: ModuleId): Promise<ModuleSummary>
  getNewsTicker(): Promise<NewsItem[]>
  getSourceStatus(): Promise<SourceStatus[]>
  getResearchList(): Promise<ResearchItem[]>
  listJobs(filter?: { status?: JobStatus; type?: JobType; title?: string }): Promise<JobListItem[]>
  getJob(jobId: string): Promise<Job | null>
  getStageWorkspace(jobId: string, stage: Stage): Promise<StageWorkspace>
  resetMockData(): Promise<null>
  createJob(input: CreateJobInput): Promise<WriteReceipt>
  submitIntake(input: IntakeInput): Promise<IntakeReceipt>
  getIntakePreview(uploadId: string): Promise<ExtractionPreview>
  confirmIntake(uploadId: string, mapping: FieldMapping): Promise<IntakeReceipt>
}

export type AgentEventCallback = (event: AgentEvent) => void
export type Unsubscribe = () => void

export interface AgentClient {
  send(input: SendMessage): Promise<SendReceipt>
  subscribe(cb: AgentEventCallback): Unsubscribe
}
