import { z } from 'zod'
import { version as appVersion } from '../../../package.json'
import { AgentRunSchema, type AgentEvent } from '../../agent/events.ts'
import type { AgentClient, AgentEventCallback, DataClient } from '../client.ts'
import { agentMethods, dataMethods } from '../methods.ts'
import {
  BootstrapSchema,
  CONTRACT_VERSION,
  JobCollectionsSchema,
  JobDetailsSchema,
  DeliverableFixturesSchema,
  InterventionSchema,
  UploadFixturesSchema,
  ModuleIdSchema,
  ModuleSummarySchema,
  type Bootstrap,
  type ContractError,
  type ErrorResponse,
} from '../types.ts'
import * as jobState from './job-state.ts'
import success from './agent/success.ts'
import failure from './agent/failure.ts'
import retry from './agent/retry.ts'
import long from './agent/long.ts'
import moduleCatalog from './fixtures/module-catalog.json'
import dailyBrief from './fixtures/daily-brief.json'
import marketBoard from './fixtures/market-board.json'
import watchlist from './fixtures/watchlist.json'
import releaseCalendar from './fixtures/release-calendar.json'
import moduleSummaries from './fixtures/module-summaries.json'
import news from './fixtures/news.json'
import sources from './fixtures/sources.json'
import research from './fixtures/research.json'
import jobs from './fixtures/jobs/jobs.json'
import jobDetails from './fixtures/jobs/job-detail.json'
import deliverables from './fixtures/jobs/deliverable.json'
import interventions from './fixtures/jobs/interventions.json'
import uploads from './fixtures/jobs/uploads.json'

const jobFixtures = { jobs, 'job-detail': jobDetails, deliverable: deliverables, interventions, uploads }
export const jobFixtureSchemas = {
  jobs: JobCollectionsSchema,
  'job-detail': JobDetailsSchema,
  deliverable: DeliverableFixturesSchema,
  interventions: z.array(InterventionSchema),
  uploads: UploadFixturesSchema,
}
const jobFixturesBoundary = z.preprocess(value => {
  // Only the file keys are merged. Each supplied file replaces its built-in counterpart.
  if (value === undefined) return jobFixtures
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return value
  return { ...jobFixtures, ...value }
}, z.strictObject(jobFixtureSchemas))

/** Read and validate seed overrides once, never on a business read request. */
export function readJobFixtures() {
  return parseJobFixtures(window.__FAI_MOCK__?.jobFixtures)
}

function parseJobFixtures(override: unknown) {
  return parseBoundary(jobFixturesBoundary, override)
}

const fixtures = {
  'module-catalog': moduleCatalog,
  'daily-brief': dailyBrief,
  'market-board': marketBoard,
  watchlist,
  'release-calendar': releaseCalendar,
  'module-summaries': moduleSummaries,
  news,
  sources,
  research,
}

export const fixtureSchemas = {
  'module-catalog': dataMethods.getModuleCatalog.result,
  'daily-brief': dataMethods.getDailyBrief.result,
  'market-board': dataMethods.getMarketBoard.result,
  watchlist: dataMethods.getWatchlist.result,
  'release-calendar': dataMethods.getReleaseCalendar.result,
  'module-summaries': z.partialRecord(ModuleIdSchema, ModuleSummarySchema),
  news: dataMethods.getNewsTicker.result,
  sources: dataMethods.getSourceStatus.result,
  research: dataMethods.getResearchList.result,
}

export type AgentScript = ReadonlyArray<{ afterMs: number; event: AgentEvent }>
export const agentScripts = { success, failure, retry, long } satisfies Record<string, AgentScript>
export type AgentScriptName = keyof typeof agentScripts
export interface MockOverrides {
  fixtures?: Partial<Record<keyof typeof fixtures, unknown>>
  jobFixtures?: Partial<Record<keyof typeof jobFixtures, unknown>>
  agentScript?: AgentScriptName
}

declare global {
  interface Window {
    __FAI_MOCK__?: MockOverrides
  }
}

const moduleFixtures = new Set<keyof typeof fixtures>([
  'daily-brief', 'market-board', 'watchlist', 'release-calendar', 'module-summaries',
])

export function createMockDataClient(): DataClient {
  const scenario = readScenario()
  const override = window.__FAI_MOCK__?.jobFixtures
  jobState.initializeJobState(scenario, parseJobFixtures(override), scenario === 'normal' && override === undefined)
  let bootstrapFailed = false

  async function readFixture<T>(name: keyof typeof fixtures, schema: z.ZodType<T>): Promise<T> {
    await delayScenario(scenario)
    if (scenario === 'error' && moduleFixtures.has(name)) {
      throw mockError('adapter_error', '样例数据源暂不可用，请重试。', true)
    }
    const overrides = window.__FAI_MOCK__?.fixtures
    const value = overrides && Object.hasOwn(overrides, name) ? overrides[name] : fixtures[name]
    return parseBoundary(schema, value)
  }

  return {
    async bootstrap() {
      await delayScenario(scenario)
      if (scenario === 'boot-error' && !bootstrapFailed) {
        bootstrapFailed = true
        throw mockError('internal', '样例启动首次失败，请重试。', true)
      }
      return parseBoundary(dataMethods.bootstrap.result, {
        appVersion,
        contractVersion: CONTRACT_VERSION,
        mode: 'mock',
        scenario,
        notice: '演示模式：数据均为合成样例，不读取私有文档或真实头寸。',
      })
    },
    async getModuleCatalog() {
      const catalog = await readFixture('module-catalog', fixtureSchemas['module-catalog'])
      return catalog.sort((a, b) => a.order - b.order)
    },
    async getDailyBrief(date) {
      const [day] = parseBoundary(dataMethods.getDailyBrief.params, [date])
      const result = await readFixture('daily-brief', fixtureSchemas['daily-brief'])
      if (scenario === 'empty') return { brief: null, reason: '今日日报尚未生成。' }
      if (day && result.brief && day !== result.brief.date) {
        return { brief: null, reason: `${day} 的日报尚未生成。` }
      }
      return result
    },
    async getMarketBoard() {
      const board = await readFixture('market-board', fixtureSchemas['market-board'])
      return scenario === 'empty' ? { ...board, rows: [], series: { ...board.series, points: [] } } : board
    },
    async getWatchlist() {
      const table = await readFixture('watchlist', fixtureSchemas.watchlist)
      return scenario === 'empty' ? { ...table, rows: [] } : table
    },
    async getReleaseCalendar(from, to) {
      const [start, end] = readCalendarRange(from, to)
      const entries = await readFixture('release-calendar', fixtureSchemas['release-calendar'])
      return scenario === 'empty' ? [] : entries
        .filter(entry => entry.ts.slice(0, 10) >= start && entry.ts.slice(0, 10) <= end)
        .sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))
    },
    async getModuleSummary(moduleId) {
      const [id] = parseBoundary(dataMethods.getModuleSummary.params, [moduleId])
      const summaries = await readFixture('module-summaries', fixtureSchemas['module-summaries'])
      const summary = summaries[id]
      if (!summary) throw mockError('not_found', `模块 ${id} 没有示例摘要。`, false)
      return scenario === 'empty' ? { ...summary, text: '', figures: [] } : summary
    },
    async getNewsTicker() {
      const items = await readFixture('news', fixtureSchemas.news)
      return scenario === 'empty' ? [] : items
    },
    async getSourceStatus() {
      const items = await readFixture('sources', fixtureSchemas.sources)
      return scenario === 'empty' ? [] : items
    },
    async getResearchList() {
      const items = await readFixture('research', fixtureSchemas.research)
      return scenario === 'empty' ? [] : items
    },
    async resetMockData() {
      await delayScenario(jobState.getJobScenario())
      jobState.resetJobState()
      return null
    },
    async listJobs(filter) {
      const [query] = parseBoundary(dataMethods.listJobs.params, [filter])
      return readJobState(() => jobState.listJobs(query), dataMethods.listJobs.result)
    },
    async getJob(jobId) {
      const [id] = parseBoundary(dataMethods.getJob.params, [jobId])
      return readJobState(() => jobState.getJob(id), dataMethods.getJob.result)
    },
    async getStageWorkspace(jobId, stage) {
      const [id, targetStage] = parseBoundary(dataMethods.getStageWorkspace.params, [jobId, stage])
      return readJobState(() => jobState.getStageWorkspace(id, targetStage), dataMethods.getStageWorkspace.result)
    },
  }
}

export function createMockAgentClient(): AgentClient {
  const scenario = readScenario()
  const listeners = new Set<AgentEventCallback>()

  return {
    async send(input) {
      const [message] = parseBoundary(agentMethods.send.params, [input])
      const script = agentScripts[readAgentScript()]
      await delayScenario(scenario)
      const receipt = parseBoundary(agentMethods.send.result, {
        sessionId: message.sessionId ?? `mock-session-${crypto.randomUUID()}`,
        runId: `mock-run-${crypto.randomUUID()}`,
      })
      const startedAt = Date.now()
      const events = parseBoundary(AgentRunSchema, script.map(({ afterMs, event }) => ({
        ...event,
        ...receipt,
        ts: new Date(startedAt + afterMs).toISOString(),
        ...(event.type === 'run.started' ? { prompt: message.message } : {}),
        ...(message.jobContext === undefined ? {} : { jobContext: message.jobContext }),
      })))
      script.forEach(({ afterMs }, index) => {
        setTimeout(() => {
          for (const listener of listeners) listener(events[index])
        }, afterMs)
      })
      return receipt
    },
    subscribe(cb) {
      listeners.add(cb)
      return () => { listeners.delete(cb) }
    },
  }
}

async function readJobState<T>(read: () => T, schema: z.ZodType<T>): Promise<T> {
  const scenario = jobState.getJobScenario()
  await delayScenario(scenario)
  const result = read() // Unknown anchors remain not_found, including in error scenarios.
  if (scenario === 'error') throw mockError('adapter_error', '样例作业数据暂不可用，请重试。', true)
  return parseBoundary(schema, result)
}

function readScenario(): Bootstrap['scenario'] {
  const query = new URLSearchParams(window.location.search)
  return parseBoundary(BootstrapSchema.shape.scenario,
    query.get('scenario') ?? import.meta.env.VITE_MOCK_SCENARIO ?? 'normal')
}

function readAgentScript(): AgentScriptName {
  const query = new URLSearchParams(window.location.search)
  return parseBoundary(z.enum(['success', 'failure', 'retry', 'long']),
    query.get('agentScript') ?? window.__FAI_MOCK__?.agentScript ?? 'success')
}

async function delayScenario(scenario: Bootstrap['scenario']): Promise<void> {
  if (scenario === 'slow') await new Promise(resolve => setTimeout(resolve, 1500))
}

function readCalendarRange(from: string, to: string): [string, string] {
  const range = parseBoundary(dataMethods.getReleaseCalendar.params, [from, to])
  if (range[0] > range[1]) throw mockError('validation_error', 'from 不得晚于 to。', false)
  return range
}

function parseBoundary<T>(schema: z.ZodType<T>, value: unknown): T {
  try {
    return schema.parse(value)
  } catch (error) {
    if (!(error instanceof z.ZodError)) throw error
    throw mockError('validation_error', error.issues.map(issue => `${issue.path.join('.') || 'input'}: ${issue.message}`).join('; '), false)
  }
}

function mockError(code: ContractError['code'], message: string, retryable: boolean): ErrorResponse {
  return { error: { code, message, retryable } }
}
