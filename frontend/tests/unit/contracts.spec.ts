import { describe, expect, expectTypeOf, test } from 'vitest'
import { z } from 'zod'
import {
  AgentEventSchema,
  AgentRunSchema,
  isTerminalEvent,
  type AgentEvent,
  type TerminalEvent,
} from '../../src/agent/events.ts'
import type { AgentClient, DataClient } from '../../src/contracts/client.ts'
import { agentMethods, contractSemantics, dataMethods, methodSemantics } from '../../src/contracts/methods.ts'
import {
  BoardCellSchema,
  CONTRACT_VERSION,
  ErrorResponseSchema,
  FigureSchema,
  MarketBoardSchema,
  SparkSeriesSchema,
  TimestampSchema,
  TradingDateSchema,
  WatchlistTableSchema,
  contractSchemas,
  type BoardCell,
  type Figure,
  type SparkSeries,
} from '../../src/contracts/types.ts'

const ts = '2026-10-28T15:00:00+08:00'
const figure = {
  label: '合约价格',
  value: 4200.5,
  unit: '元/吨',
  decimals: 1,
  freq: '1d',
  delta: 1.5,
  deltaKind: 'pct',
  semantic: 'market',
  asOf: ts,
  seriesId: 'sample-contract-price',
} satisfies Figure
const spark = {
  points: [{ ts, value: 4200.5 }, { ts: '2026-10-29T15:00:00+08:00', value: null }],
  unit: '元/吨',
  freq: '1d',
  semantic: 'market',
  asOf: '2026-10-29T15:00:00+08:00',
  seriesId: 'sample-contract-price',
} satisfies SparkSeries

const common = { runId: 'run-1', sessionId: 'session-1', ts }
const eventSamples = [
  { ...common, type: 'run.started', prompt: '分析今日行情' },
  { ...common, type: 'step.thinking', stepId: 1, text: '先查询数据', done: true },
  { ...common, type: 'step.text', stepId: 2, text: '正在查询', done: false },
  { ...common, type: 'step.tool.call', stepId: 3, toolCallId: 'call-1', toolName: 'fetch_series', argsSummary: '查询合约', moduleId: 'market-board' },
  { ...common, type: 'step.tool.result', stepId: 4, toolCallId: 'call-1', isError: false, resultSummary: '已获取数据', durationMs: 100, moduleId: 'market-board' },
  { ...common, type: 'step.error', stepId: 5, message: '稍后重试', willRetry: true },
  { ...common, type: 'hint.navigate', stepId: 6, target: { kind: 'module', id: 'market-board' }, reason: '查看行情' },
  { ...common, type: 'run.completed', moduleIds: ['market-board'] },
  { ...common, type: 'run.failed', error: { code: 'adapter_error', message: '数据源不可用', retryable: true } },
  { ...common, type: 'run.aborted' },
] satisfies AgentEvent[]
const nonterminalEvents = eventSamples.slice(0, 7)
const terminalEvents = eventSamples.slice(7)

describe('AC-007-4 types', () => {
  test('requires numeric metadata at the type level and narrows board cells', () => {
    expectTypeOf<Pick<Figure, 'unit' | 'freq' | 'semantic' | 'asOf'>>().toEqualTypeOf<{
      unit: string; freq: string; semantic: 'market' | 'analysis'; asOf: string
    }>()
    expectTypeOf<Pick<SparkSeries, 'unit' | 'freq' | 'semantic' | 'asOf' | 'seriesId'>>().toEqualTypeOf<{
      unit: string; freq: string; semantic: 'market' | 'analysis'; asOf: string; seriesId: string
    }>()
    expectTypeOf<Omit<Figure, 'unit'>>().not.toExtend<Figure>()
    expectTypeOf<Omit<SparkSeries, 'freq'>>().not.toExtend<SparkSeries>()
    expectTypeOf<Extract<BoardCell, { state: 'ok' }>['figure']>().toEqualTypeOf<Figure>()
    expectTypeOf<Exclude<BoardCell, { state: 'ok' }>['figure']>().toEqualTypeOf<null>()
  })

  test('accepts all three numeric forms without converting percent values or nulls', () => {
    expect(FigureSchema.parse(figure)).toEqual(figure)
    expect(FigureSchema.parse({ ...figure, value: null, delta: null, semantic: 'analysis' }).value).toBeNull()
    expect(FigureSchema.parse({ ...figure, value: 0 }).value).toBe(0)
    expect(BoardCellSchema.parse({ state: 'ok', figure })).toEqual({ state: 'ok', figure })
    expect(SparkSeriesSchema.parse(spark)).toEqual(spark)
    expect(SparkSeriesSchema.parse({ ...spark, points: [] }).points).toEqual([])
  })

  test('R1-01 preserves optional delta precision independently of the headline precision, including zero', () => {
    expectTypeOf<Figure['deltaDecimals']>().toEqualTypeOf<number | undefined>()
    expect(FigureSchema.parse(figure)).not.toHaveProperty('deltaDecimals')
    for (const deltaDecimals of [0, 2, 3]) {
      expect(FigureSchema.parse({ ...figure, decimals: 0, deltaDecimals })).toMatchObject({
        decimals: 0, deltaDecimals, delta: 1.5, deltaKind: 'pct',
      })
    }
  })

  test.each([-1, 1.5, '2', null])('R1-01 rejects invalid deltaDecimals %j at the contract boundary', (deltaDecimals) => {
    expect(FigureSchema.safeParse({ ...figure, deltaDecimals }).success).toBe(false)
  })

  test.each(['unit', 'freq', 'semantic', 'asOf'] as const)('rejects missing %s on Figure and SparkSeries', (key) => {
    const incompleteFigure: Record<string, unknown> = { ...figure }
    const incompleteSpark: Record<string, unknown> = { ...spark }
    delete incompleteFigure[key]
    delete incompleteSpark[key]
    expect(FigureSchema.safeParse(incompleteFigure).success).toBe(false)
    expect(SparkSeriesSchema.safeParse(incompleteSpark).success).toBe(false)
    expect(BoardCellSchema.safeParse({ state: 'ok', figure: incompleteFigure }).success).toBe(false)
  })

  test.each(['holiday', 'pending', 'missing'] as const)('requires null figure for %s', (state) => {
    expect(BoardCellSchema.parse({ state, figure: null })).toEqual({ state, figure: null })
    expect(BoardCellSchema.safeParse({ state, figure }).success).toBe(false)
    expect(BoardCellSchema.safeParse({ state }).success).toBe(false)
  })

  test('rejects ok without figure and series without their ID', () => {
    expect(BoardCellSchema.safeParse({ state: 'ok', figure: null }).success).toBe(false)
    expect(BoardCellSchema.safeParse({ state: 'ok' }).success).toBe(false)
    expect(BoardCellSchema.safeParse({ state: 'unknown', figure: null }).success).toBe(false)
    expect(SparkSeriesSchema.safeParse({ ...spark, seriesId: undefined }).success).toBe(false)
    expect(FigureSchema.safeParse({ ...figure, seriesId: undefined }).success).toBe(true)
  })

  test.each([
    { value: Number.NaN }, { value: Infinity }, { value: '4200' },
    { unit: '' }, { freq: '' }, { semantic: 'positive' }, { decimals: -1 }, { decimals: 1.5 },
  ])('rejects invalid Figure fields %j', (invalid) => {
    expect(FigureSchema.safeParse({ ...figure, ...invalid }).success).toBe(false)
  })

  test('uses numeric schemas inside actual board and watchlist response schemas', () => {
    const board = {
      columns: [{ id: 'latest', label: '最新价' }],
      rows: [{ id: 'sample-contract', label: '样例合约', cells: [{ state: 'ok', figure }] }],
      series: spark,
      asOf: ts,
    }
    const watchlist = {
      rows: [{ id: 'sample-contract', name: '样例合约', price: figure, change: figure, changePct: figure, spark }],
      asOf: ts,
    }
    expect(MarketBoardSchema.parse(board)).toEqual(board)
    expect(WatchlistTableSchema.parse(watchlist)).toEqual(watchlist)
    expect(MarketBoardSchema.safeParse({ ...board, series: { ...spark, unit: undefined } }).success).toBe(false)
    expect(WatchlistTableSchema.safeParse({
      ...watchlist, rows: [{ ...watchlist.rows[0], price: { ...figure, freq: undefined } }],
    }).success).toBe(false)
  })

  test('accepts real dates and offset timestamps, not local times', () => {
    expect(TradingDateSchema.parse('2028-02-29')).toBe('2028-02-29')
    expect(TradingDateSchema.safeParse('2026-02-29').success).toBe(false)
    expect(TradingDateSchema.safeParse(ts).success).toBe(false)
    for (const value of [ts, '2026-10-28T07:00:00Z', '2026-10-28T02:00:00-05:00']) {
      expect(TimestampSchema.parse(value)).toBe(value)
    }
    for (const value of ['2026-10-28T15:00:00', '2026-10-28', '2026-02-30T15:00:00+08:00']) {
      expect(TimestampSchema.safeParse(value).success).toBe(false)
    }
  })
})

describe('AC-005-6 types', () => {
  test.each(eventSamples)('validates $type', (event) => {
    expect(AgentEventSchema.parse(event)).toEqual(event)
  })

  test('contains exactly ten discriminated event variants and three terminal types', () => {
    expect(AgentEventSchema.options.map(schema => schema.shape.type.value)).toEqual(eventSamples.map(event => event.type))
    expect(AgentEventSchema.options).toHaveLength(10)
    expect(eventSamples.filter(isTerminalEvent).map(event => event.type)).toEqual([
      'run.completed', 'run.failed', 'run.aborted',
    ])
    expectTypeOf<TerminalEvent['type']>().toEqualTypeOf<'run.completed' | 'run.failed' | 'run.aborted'>()
  })

  test.each(terminalEvents)('accepts one terminal event: $type', (terminal) => {
    const run = [...nonterminalEvents, terminal]
    expect(AgentRunSchema.parse(run)).toEqual(run)
  })

  test('rejects missing, duplicate, or competing terminal events', () => {
    expect(AgentRunSchema.safeParse(nonterminalEvents).success).toBe(false)
    for (const first of terminalEvents) {
      for (const second of terminalEvents) {
        expect(AgentRunSchema.safeParse([...nonterminalEvents, first, second]).success).toBe(false)
      }
    }
  })

  test.each([true, false])('step.error willRetry=%s is never a terminal event', (willRetry) => {
    const error = AgentEventSchema.parse({ ...common, type: 'step.error', stepId: 1, message: '失败', willRetry })
    expect(isTerminalEvent(error)).toBe(false)
    expect(AgentRunSchema.safeParse([eventSamples[0], error]).success).toBe(false)
    expect(AgentRunSchema.safeParse([eventSamples[0], error, eventSamples[8]]).success).toBe(true)
  })

  test('accepts text fragments and an authoritative full text on the same step', () => {
    const run = [
      eventSamples[0],
      { ...common, type: 'step.text', stepId: 1, text: '增量', done: false },
      { ...common, type: 'step.text', stepId: 1, text: '权威全文', done: true },
      eventSamples[7],
    ]
    expect(AgentRunSchema.parse(run)).toEqual(run)
    expect(AgentRunSchema.safeParse([
      eventSamples[0], { ...run[1], stepId: 2 }, run[2], eventSamples[7],
    ]).success).toBe(false)
  })

  test('requires a single-run record with start first and terminal last', () => {
    expect(AgentRunSchema.safeParse([]).success).toBe(false)
    expect(AgentRunSchema.safeParse([eventSamples[7]]).success).toBe(false)
    expect(AgentRunSchema.safeParse([eventSamples[0], eventSamples[0], eventSamples[7]]).success).toBe(false)
    expect(AgentRunSchema.safeParse([eventSamples[0], eventSamples[7], eventSamples[1]]).success).toBe(false)
    for (const mismatch of [{ runId: 'other-run' }, { sessionId: 'other-session' }]) {
      expect(AgentRunSchema.safeParse([eventSamples[0], { ...eventSamples[7], ...mismatch }]).success).toBe(false)
    }
  })

  test('requires common identity and timezone fields on every event', () => {
    for (const event of eventSamples) {
      for (const key of ['runId', 'sessionId', 'ts']) {
        const incomplete: Record<string, unknown> = { ...event }
        delete incomplete[key]
        expect(AgentEventSchema.safeParse(incomplete).success).toBe(false)
      }
      expect(AgentEventSchema.safeParse({ ...event, ts: '2026-10-28T15:00:00' }).success).toBe(false)
    }
    expect(AgentEventSchema.safeParse({ ...common, type: 'run.unknown' }).success).toBe(false)
    expect(AgentEventSchema.safeParse({ ...eventSamples[1], stepId: undefined }).success).toBe(false)
    expect(AgentEventSchema.safeParse({ ...eventSamples[2], done: undefined }).success).toBe(false)
  })

  test('retains unknown navigation targets for the UI to report, including page paths', () => {
    for (const target of [{ kind: 'module', id: 'not-in-catalog' }, { kind: 'page', id: '/prices' }]) {
      const event = { ...common, type: 'hint.navigate', stepId: 1, target }
      expect(AgentEventSchema.parse(event)).toEqual(event)
    }
  })
})

describe('AC-007-3 methods', () => {
  test('covers all ten DataClient methods and both AgentClient methods with matching types', () => {
    expect(Object.keys(dataMethods)).toEqual([
      'bootstrap', 'getModuleCatalog', 'getDailyBrief', 'getMarketBoard', 'getWatchlist',
      'getReleaseCalendar', 'getModuleSummary', 'getNewsTicker', 'getSourceStatus', 'getResearchList',
    ])
    expect(Object.keys(agentMethods)).toEqual(['send', 'subscribe'])
    expect(Object.keys(methodSemantics)).toHaveLength(12)
    expectTypeOf<keyof typeof dataMethods>().toEqualTypeOf<keyof DataClient>()
    expectTypeOf<keyof typeof agentMethods>().toEqualTypeOf<keyof AgentClient>()
    type SchemaClient = {
      [Method in keyof typeof dataMethods]: (...args: z.output<typeof dataMethods[Method]['params']>) =>
        Promise<z.output<typeof dataMethods[Method]['result']>>
    }
    expectTypeOf<SchemaClient>().toEqualTypeOf<DataClient>()
    expectTypeOf<z.output<typeof agentMethods.send.params>>().toEqualTypeOf<Parameters<AgentClient['send']>>()
    expectTypeOf<z.output<typeof agentMethods.send.result>>().toEqualTypeOf<Awaited<ReturnType<AgentClient['send']>>>()
    expectTypeOf<Parameters<AgentClient['subscribe']>[0]>().toEqualTypeOf<(event: AgentEvent) => void>()
    expectTypeOf<ReturnType<AgentClient['subscribe']>>().toEqualTypeOf<() => void>()
  })

  test('exports JSON-schema-compatible types with descriptions on every object field', () => {
    for (const [name, schema] of Object.entries(contractSchemas)) {
      expect(schema.description, name).toBeTruthy()
      expectDescribedFields(z.toJSONSchema(schema), name)
    }
    expectDescribedFields(z.toJSONSchema(AgentEventSchema), 'AgentEvent')
    expectDescribedFields(z.toJSONSchema(AgentRunSchema), 'AgentRun')
    for (const [name, method] of Object.entries({ ...dataMethods, send: agentMethods.send })) {
      expect(method.description, name).toBeTruthy()
      expect(method.params.description, name).toBeTruthy()
      expect(method.result.description, name).toBeTruthy()
      for (const parameter of method.params.def.items) {
        expect(parameter.description, `${name} parameter`).toBeTruthy()
      }
      expectDescribedFields(z.toJSONSchema(method.params), `${name}.params`)
      expectDescribedFields(z.toJSONSchema(method.result), `${name}.result`)
    }
    expect(agentMethods.subscribe.description).toBeTruthy()
    expect(agentMethods.subscribe.callback.name).toBe('cb')
    expect(agentMethods.subscribe.callback.description).toBeTruthy()
    expect(agentMethods.subscribe.callback.event).toBe(AgentEventSchema)
    expect(agentMethods.subscribe.returns.type).toBe('() => void')
    expect(agentMethods.subscribe.returns.description).toBeTruthy()
  })

  test('defines optional date, required closed-range endpoints, module ID and send inputs', () => {
    expect(dataMethods.bootstrap.params.parse([])).toEqual([])
    expect(dataMethods.getDailyBrief.params.parse([])).toEqual([])
    expect(dataMethods.getDailyBrief.params.parse(['2026-10-28'])).toEqual(['2026-10-28'])
    expect(dataMethods.getDailyBrief.params.safeParse(['2026/10/28']).success).toBe(false)
    expect(dataMethods.getReleaseCalendar.params.parse(['2026-10-28', '2026-10-28'])).toEqual(['2026-10-28', '2026-10-28'])
    expect(dataMethods.getReleaseCalendar.params.safeParse(['2026-10-28']).success).toBe(false)
    expect(dataMethods.getModuleSummary.params.safeParse(['unknown']).success).toBe(false)
    expect(agentMethods.send.params.parse([{ message: ' 分析今日行情 ' }])).toEqual([{ message: '分析今日行情' }])
    expect(agentMethods.send.params.safeParse([{ message: '  ' }]).success).toBe(false)
    expect(agentMethods.send.params.parse([{ sessionId: 'session-1', message: '继续' }])).toEqual([{ sessionId: 'session-1', message: '继续' }])
    expect(agentMethods.send.result.parse({ runId: 'run-1', sessionId: 'session-1' })).toEqual({ runId: 'run-1', sessionId: 'session-1' })
  })

  test('shares the exact error shape with run.failed and documents version, time and pagination', () => {
    expect(contractSemantics.version).toBe(CONTRACT_VERSION)
    expect(contractSemantics.errors).toBe(ErrorResponseSchema)
    for (const code of ['not_found', 'validation_error', 'rate_limited', 'adapter_error', 'internal']) {
      const payload = { error: { code, message: '请求失败', retryable: false } }
      expect(ErrorResponseSchema.parse(payload)).toEqual(payload)
      const event = AgentEventSchema.parse({ ...common, type: 'run.failed', ...payload })
      expect(event).toMatchObject(payload)
    }
    expect(ErrorResponseSchema.safeParse({ error: { code: 'unknown', message: '失败', retryable: false } }).success).toBe(false)
    expect(ErrorResponseSchema.safeParse({ error: { code: 'internal', message: '失败' } }).success).toBe(false)
    expect(contractSemantics.errorDelivery).toContain('{error:{code,message,retryable}}')
    expect(contractSemantics.pagination).toContain('不分页')
    expect(contractSemantics.date).toContain('包含两端')
    expect(contractSemantics.timestamp).toContain('带偏移')
    expect(contractSemantics.delta).toContain('1.5%')
    expect(contractSemantics.events).toContain('恰好一个终态')
  })
})

function expectDescribedFields(node: unknown, path: string): void {
  if (node === null || typeof node !== 'object') return
  if (Array.isArray(node)) {
    node.forEach((child, index) => expectDescribedFields(child, `${path}[${index}]`))
    return
  }
  const record = node as Record<string, unknown>
  const properties = record.properties as Record<string, { description?: string }> | undefined
  for (const [name, property] of Object.entries(properties ?? {})) {
    expect(property.description?.trim(), `${path}.${name} description`).toBeTruthy()
  }
  for (const [key, child] of Object.entries(record)) {
    expectDescribedFields(child, `${path}.${key}`)
  }
}
