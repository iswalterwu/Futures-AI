import type { AgentEvent } from '../agent/events.ts'
import type {
  Bootstrap,
  CalendarEntry,
  DailyBriefResponse,
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
}

export type AgentEventCallback = (event: AgentEvent) => void
export type Unsubscribe = () => void

export interface AgentClient {
  send(input: SendMessage): Promise<SendReceipt>
  subscribe(cb: AgentEventCallback): Unsubscribe
}
