import type { AgentClient, DataClient } from '../client.ts'
import type { ContractError } from '../types.ts'

export class NotImplementedError extends Error {
  readonly error: ContractError

  constructor(method: string) {
    const message = `真实数据接口 ${method} 尚未实现；请使用 VITE_DATA_MODE=mock。`
    super(message)
    Object.defineProperty(this, 'name', { value: 'NotImplementedError', configurable: true })
    this.error = { code: 'internal', message, retryable: false }
  }
}

export const dataClient: DataClient = {
  async bootstrap() { throw new NotImplementedError('bootstrap') },
  async getModuleCatalog() { throw new NotImplementedError('getModuleCatalog') },
  async getDailyBrief() { throw new NotImplementedError('getDailyBrief') },
  async getMarketBoard() { throw new NotImplementedError('getMarketBoard') },
  async getWatchlist() { throw new NotImplementedError('getWatchlist') },
  async getReleaseCalendar() { throw new NotImplementedError('getReleaseCalendar') },
  async getModuleSummary() { throw new NotImplementedError('getModuleSummary') },
  async getNewsTicker() { throw new NotImplementedError('getNewsTicker') },
  async getSourceStatus() { throw new NotImplementedError('getSourceStatus') },
  async getResearchList() { throw new NotImplementedError('getResearchList') },
  async listJobs() { throw new NotImplementedError('listJobs') },
  async getJob() { throw new NotImplementedError('getJob') },
  async getStageWorkspace() { throw new NotImplementedError('getStageWorkspace') },
  async resetMockData() { throw new NotImplementedError('resetMockData') },
}

export const agentClient: AgentClient = {
  async send() { throw new NotImplementedError('send') },
  subscribe() { throw new NotImplementedError('subscribe') },
}
