import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { AgentRunSchema, isTerminalEvent, type AgentEvent } from '../../src/agent/events.ts'
import type { DataClient } from '../../src/contracts/client.ts'
import { dataMethods } from '../../src/contracts/methods.ts'
import { ErrorResponseSchema, ModuleIdSchema, type ModuleId } from '../../src/contracts/types.ts'
import {
  agentScripts,
  createMockAgentClient,
  createMockDataClient,
  fixtureSchemas,
  type AgentScriptName,
} from '../../src/contracts/mock/index.ts'
import { agentClient as realAgentClient, dataClient as realDataClient, NotImplementedError } from '../../src/contracts/real/index.ts'

const fixtureFiles = import.meta.glob('../../src/contracts/mock/fixtures/*.json', { eager: true, import: 'default' })

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  vi.stubEnv('VITE_DATA_MODE', undefined)
  vi.stubEnv('VITE_MOCK_SCENARIO', undefined)
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
  delete window.__FAI_MOCK__
  window.history.replaceState(null, '', '/')
})

describe('AC-007-4 fixtures', () => {
  test('all nine checked-in fixtures pass their actual boundary schemas', () => {
    expect(Object.keys(fixtureFiles)).toHaveLength(9)
    for (const [name, schema] of Object.entries(fixtureSchemas)) {
      const fixture = fixtureFiles[`../../src/contracts/mock/fixtures/${name}.json`]
      expect(fixture, name).toBeDefined()
      expect(schema.safeParse(fixture).success, name).toBe(true)
    }
  })

  test('catalog order, board states and 60-point sample serve the documented modules', async () => {
    const client = createMockDataClient()
    const catalog = await client.getModuleCatalog()
    expect(catalog.map(module => module.id)).toEqual(ModuleIdSchema.options)
    expect(catalog.map(module => module.order)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(catalog.map(module => module.defaultSpan)).toEqual([2, 1, 1, 1, 1, 1, 1])
    const board = await client.getMarketBoard()
    expect(new Set(board.rows.flatMap(row => row.cells.map(cell => cell.state)))).toEqual(new Set(['ok', 'holiday', 'pending', 'missing']))
    for (const row of board.rows) {
      expect(row.cells).toHaveLength(board.columns.length)
      for (const cell of row.cells) if (cell.state === 'ok') expect(cell.figure.semantic).toBe('market')
    }
    expect(board.series.points).toHaveLength(60)
    expect(board.series.semantic).toBe('market')
    expect(board.series.points.at(-1)?.ts).toBe(board.series.asOf)
    expect(board.series.points.map(point => point.ts)).toEqual(board.series.points.map(point => point.ts).sort())
  })

  test('watchlist contains contract prices and market metadata, not analysis indicators', async () => {
    const table = await createMockDataClient().getWatchlist()
    expect(table.rows.map(row => row.id)).toEqual(['SC2612', 'PG2612', 'FU2701'])
    for (const row of table.rows) {
      for (const figure of [row.price, row.change, row.changePct, row.spark]) {
        expect(figure.semantic).toBe('market')
        expect(figure.unit).toBeTruthy()
        expect(figure.freq).toBe('1d')
        expect(figure.asOf).toBe(table.asOf)
      }
      expect(row.changePct.unit).toBe('%')
      expect(row.spark.seriesId).toBe(row.price.seriesId)
      expect(row.spark.points.at(-1)?.value).toBe(row.price.value)
    }
    expect(table.rows[0].changePct.value).toBe(1.5)
    expect(table.rows[1].change.value).toBeLessThan(0)
  })

  test('brief has both numeric semantics; all four summaries are synthetic placeholders', async () => {
    const client = createMockDataClient()
    const { brief } = await client.getDailyBrief()
    expect(brief?.conclusions).toHaveLength(3)
    expect(brief?.figures.filter(figure => figure.semantic === 'market')).toHaveLength(3)
    expect(brief?.figures.filter(figure => figure.semantic === 'analysis')).toHaveLength(3)
    for (const id of ['supply-demand', 'logistics-onwater', 'positions', 'doc-catalog'] as const) {
      const summary = await client.getModuleSummary(id)
      expect(summary.moduleId).toBe(id)
      expect(summary.text).toContain('domain feature')
      for (const figure of summary.figures) expect(figure.semantic).toBe('analysis')
    }
  })
})

describe('AC-007-2 mock scenarios', () => {
  test('defaults to normal and all ten data methods return schema-valid values', async () => {
    const client = createMockDataClient()
    const results = await Promise.all(dataRequests(client))
    for (const [index, method] of Object.values(dataMethods).entries()) {
      expect(method.result.safeParse(results[index]).success).toBe(true)
    }
    expect(results[0]).toMatchObject({ mode: 'mock', scenario: 'normal', contractVersion: '1.0.0', notice: expect.any(String) })
  })

  test('query scenario wins over environment, environment wins over normal', async () => {
    vi.stubEnv('VITE_MOCK_SCENARIO', 'empty')
    expect(await createMockDataClient().bootstrap()).toMatchObject({ scenario: 'empty' })
    window.history.replaceState(null, '', '/?scenario=error')
    expect(await createMockDataClient().bootstrap()).toMatchObject({ scenario: 'error' })
    window.history.replaceState(null, '', '/?scenario=normal')
    expect(await createMockDataClient().bootstrap()).toMatchObject({ scenario: 'normal' })
  })

  test('empty keeps the catalog and metadata but clears module content and shell lists', async () => {
    window.history.replaceState(null, '', '/?scenario=empty')
    const client = createMockDataClient()
    expect(await client.bootstrap()).toMatchObject({ scenario: 'empty' })
    expect(await client.getModuleCatalog()).toHaveLength(7)
    expect(await client.getDailyBrief()).toEqual({ brief: null, reason: '今日日报尚未生成。' })
    const board = await client.getMarketBoard()
    expect(board.rows).toEqual([])
    expect(board.series.points).toEqual([])
    expect(fixtureSchemas['market-board'].safeParse(board).success).toBe(true)
    expect((await client.getWatchlist()).rows).toEqual([])
    expect(await client.getReleaseCalendar('2026-10-27', '2026-10-29')).toEqual([])
    for (const id of ['supply-demand', 'logistics-onwater', 'positions', 'doc-catalog'] as const) {
      expect(await client.getModuleSummary(id)).toMatchObject({ moduleId: id, text: '', figures: [] })
    }
    expect(await client.getNewsTicker()).toEqual([])
    expect(await client.getSourceStatus()).toEqual([])
    expect(await client.getResearchList()).toEqual([])
  })

  test('error permits startup, catalog and shell data while all module methods reject the same error', async () => {
    window.history.replaceState(null, '', '/?scenario=error')
    const client = createMockDataClient()
    expect(await client.bootstrap()).toMatchObject({ scenario: 'error' })
    expect(await client.getModuleCatalog()).toHaveLength(7)
    expect((await client.getNewsTicker()).length).toBeGreaterThan(0)
    expect((await client.getSourceStatus()).length).toBeGreaterThan(0)
    expect((await client.getResearchList()).length).toBeGreaterThan(0)
    const calls = [client.getDailyBrief(), client.getMarketBoard(), client.getWatchlist(),
      client.getReleaseCalendar('2026-10-27', '2026-10-29'), client.getModuleSummary('positions')]
    const results = await Promise.allSettled(calls)
    for (const result of results) {
      expect(result.status).toBe('rejected')
      if (result.status === 'rejected') {
        expect(ErrorResponseSchema.parse(result.reason)).toEqual({
          error: { code: 'adapter_error', message: '样例数据源暂不可用，请重试。', retryable: true },
        })
      }
    }
  })

  test('slow delays every data method by exactly 1500ms', async () => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/?scenario=slow')
    let settled = 0
    const pending = Promise.all(dataRequests(createMockDataClient()).map(promise => promise.then(value => {
      settled += 1
      return value
    })))
    await vi.advanceTimersByTimeAsync(1499)
    expect(settled).toBe(0)
    await vi.advanceTimersByTimeAsync(1)
    expect(settled).toBe(10)
    expect((await pending)[0]).toMatchObject({ scenario: 'slow' })
  })

  test('boot-error fails only the first bootstrap on that client, with retryable diagnostics', async () => {
    window.history.replaceState(null, '', '/?scenario=boot-error')
    const client = createMockDataClient()
    await expect(client.bootstrap()).rejects.toEqual({ error: { code: 'internal', message: '样例启动首次失败，请重试。', retryable: true } })
    expect(await client.bootstrap()).toMatchObject({ scenario: 'boot-error' })
    expect(await client.bootstrap()).toMatchObject({ scenario: 'boot-error' })
    expect(await client.getModuleCatalog()).toHaveLength(7)
    expect((await client.getMarketBoard()).rows.length).toBeGreaterThan(0)
    await expect(createMockDataClient().bootstrap()).rejects.toMatchObject({ error: { code: 'internal' } })
  })

  test('fixture injection replaces a complete fixture and output mutations do not leak into future reads', async () => {
    const client = createMockDataClient()
    const original = await client.getResearchList()
    window.__FAI_MOCK__ = { fixtures: { research: [...original, { id: 'added-research', title: '新增研究' }] } }
    const injected = await client.getResearchList()
    expect(injected).toHaveLength(original.length + 1)
    injected.pop()
    expect(await client.getResearchList()).toHaveLength(original.length + 1)
    window.__FAI_MOCK__.fixtures = { research: [] }
    expect(await client.getResearchList()).toEqual([])
    delete window.__FAI_MOCK__
    expect(await client.getResearchList()).toEqual(original)
  })

  test('boundary validation rejects invalid input or overridden metadata with the uniform shape', async () => {
    const client = createMockDataClient()
    const board = await client.getMarketBoard()
    window.__FAI_MOCK__ = { fixtures: { 'market-board': { ...board, series: { ...board.series, unit: undefined } } } }
    await expect(client.getMarketBoard()).rejects.toMatchObject({ error: { code: 'validation_error', retryable: false } })
    window.__FAI_MOCK__.fixtures = { research: null }
    await expect(client.getResearchList()).rejects.toMatchObject({ error: { code: 'validation_error' } })
    await expect(client.getDailyBrief('2026/10/28')).rejects.toMatchObject({ error: { code: 'validation_error' } })
    await expect(client.getReleaseCalendar('2026-10-29', '2026-10-28')).rejects.toMatchObject({ error: { code: 'validation_error' } })
    await expect(client.getModuleSummary('unknown' as ModuleId)).rejects.toMatchObject({ error: { code: 'validation_error' } })
    await expect(client.getModuleSummary('market-board')).rejects.toMatchObject({ error: { code: 'not_found', retryable: false } })
    window.history.replaceState(null, '', '/?scenario=unknown')
    expect(() => createMockDataClient()).toThrow(expect.objectContaining({ error: expect.objectContaining({ code: 'validation_error' }) }))
  })

  test('daily dates select the fixture trading day and a missing brief is not an error', async () => {
    const client = createMockDataClient()
    const current = await client.getDailyBrief()
    expect(await client.getDailyBrief(current.brief!.date)).toEqual(current)
    expect(await client.getDailyBrief('2026-10-29')).toEqual({ brief: null, reason: '2026-10-29 的日报尚未生成。' })
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: null, reason: '样例：等待生成' } } }
    expect(await client.getDailyBrief()).toEqual({ brief: null, reason: '样例：等待生成' })
  })

  test('calendar includes both local-date endpoints and sorts timestamps by instant', async () => {
    window.__FAI_MOCK__ = { fixtures: { 'release-calendar': [
      { id: 'late', ts: '2026-10-28T23:59:59-05:00', name: '末端', source: '样例', status: 'stale' },
      { id: 'offset-early', ts: '2026-10-28T12:00:00+08:00', name: '较早时刻', source: '样例', status: 'fresh' },
      { id: 'start', ts: '2026-10-28T00:00:00+08:00', name: '起点', source: '样例', status: 'fresh' },
      { id: 'offset-late', ts: '2026-10-28T06:00:00Z', name: '较晚时刻', source: '样例', status: 'fresh' },
      { id: 'outside', ts: '2026-10-29T00:00:00+08:00', name: '区间外', source: '样例', status: 'stale' },
    ] } }
    const client = createMockDataClient()
    expect((await client.getReleaseCalendar('2026-10-28', '2026-10-28')).map(entry => entry.id)).toEqual(['start', 'offset-early', 'offset-late', 'late'])
    expect(await client.getReleaseCalendar('2026-10-30', '2026-10-31')).toEqual([])
  })

  test.each([undefined, 'mock', 'real'])('entry selects VITE_DATA_MODE=%s', async (mode) => {
    vi.stubEnv('VITE_DATA_MODE', mode)
    vi.resetModules()
    const { dataClient, agentClient } = await import('../../src/contracts/index.ts')
    if (mode === 'real') {
      await expect(dataClient.bootstrap()).rejects.toMatchObject({ name: 'NotImplementedError', error: { code: 'internal' } })
      await expect(agentClient.send({ message: '样例' })).rejects.toMatchObject({ name: 'NotImplementedError' })
    } else {
      expect(await dataClient.bootstrap()).toMatchObject({ mode: 'mock', scenario: 'normal' })
      const unsubscribe = agentClient.subscribe(() => {})
      expect(unsubscribe).toBeTypeOf('function')
      unsubscribe()
    }
  })

  test('every real method throws NotImplementedError with contract diagnostics and no fallback', async () => {
    await Promise.all([...dataRequests(realDataClient), realAgentClient.send({ message: '样例' })].map(async promise => {
      await expect(promise).rejects.toBeInstanceOf(NotImplementedError)
      await expect(promise).rejects.toMatchObject({ error: { code: 'internal', retryable: false } })
    }))
    expect(() => realAgentClient.subscribe(() => {})).toThrow(NotImplementedError)
    const error = new NotImplementedError('bootstrap')
    expect(JSON.parse(JSON.stringify(error))).toEqual({ error: error.error })
  })
})

describe('AC-005-6 scripts', () => {
  test.each(Object.keys(agentScripts) as AgentScriptName[])('%s is a schema-valid run with one final terminal and ordered offsets', (name) => {
    const script = agentScripts[name]
    const events = script.map(frame => frame.event)
    expect(AgentRunSchema.parse(events)).toEqual(events)
    expect(events.filter(isTerminalEvent)).toHaveLength(1)
    expect(isTerminalEvent(events.at(-1)!)).toBe(true)
    expect(script[0].afterMs).toBe(0)
    expect(script.map(frame => frame.afterMs)).toEqual(script.map(frame => frame.afterMs).sort((a, b) => a - b))
  })

  test.each(Object.keys(agentScripts) as AgentScriptName[])('replays %s through the real mock client with runtime identities and timestamps', async (agentScript) => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-02T03:04:05Z'))
    window.__FAI_MOCK__ = { agentScript }
    const events: AgentEvent[] = []
    const client = createMockAgentClient()
    client.subscribe(event => events.push(event))
    const receipt = await client.send({ sessionId: 'existing-session', message: '  本次输入  ' })
    expect(events).toEqual([])
    expect(receipt.sessionId).toBe('existing-session')
    await vi.runAllTimersAsync()
    expect(AgentRunSchema.parse(events)).toEqual(events)
    expect(events).toHaveLength(agentScripts[agentScript].length)
    expect(events[0]).toMatchObject({ ...receipt, prompt: '本次输入', ts: '2030-01-02T03:04:05.000Z' })
    for (const [index, event] of events.entries()) {
      expect(event.runId).toBe(receipt.runId)
      expect(event.sessionId).toBe(receipt.sessionId)
      expect(Date.parse(event.ts) - Date.parse(events[0].ts)).toBe(agentScripts[agentScript][index].afterMs)
    }
    expect(events.at(-1)?.type).toBe(agentScript === 'failure' ? 'run.failed' : 'run.completed')
  })

  test('script query overrides hook; hook overrides success; each send creates a new run', async () => {
    vi.useFakeTimers()
    const client = createMockAgentClient()
    const events: AgentEvent[] = []
    client.subscribe(event => events.push(event))
    const first = await client.send({ message: '默认成功' })
    await vi.runAllTimersAsync()
    expect(events.at(-1)?.type).toBe('run.completed')
    window.__FAI_MOCK__ = { agentScript: 'retry' }
    const second = await client.send({ sessionId: first.sessionId, message: '重试' })
    await vi.runAllTimersAsync()
    expect(events.some(event => event.type === 'step.error' && event.willRetry)).toBe(true)
    window.history.replaceState(null, '', '/?agentScript=failure')
    const third = await client.send({ sessionId: first.sessionId, message: '失败' })
    await vi.runAllTimersAsync()
    expect(events.at(-1)).toMatchObject({ type: 'run.failed', error: { code: 'rate_limited' } })
    expect(new Set([first.runId, second.runId, third.runId]).size).toBe(3)
    expect(events.every(event => event.sessionId === first.sessionId)).toBe(true)
  })

  test('retry emits a nonterminal error before resuming the same run', async () => {
    vi.useFakeTimers()
    window.__FAI_MOCK__ = { agentScript: 'retry' }
    const events: AgentEvent[] = []
    const client = createMockAgentClient()
    client.subscribe(event => events.push(event))
    const receipt = await client.send({ message: '重试' })
    await vi.advanceTimersByTimeAsync(700)
    expect(events.at(-1)).toMatchObject({ type: 'step.error', willRetry: true, ...receipt })
    expect(events.filter(isTerminalEvent)).toEqual([])
    await vi.runAllTimersAsync()
    expect(events.filter(isTerminalEvent).map(event => event.type)).toEqual(['run.completed'])
    expect(events.filter(event => event.type === 'run.started')).toHaveLength(1)
  })

  test('long continues after unsubscribe; persistent and later listeners see only their live events', async () => {
    vi.useFakeTimers()
    window.__FAI_MOCK__ = { agentScript: 'long' }
    const client = createMockAgentClient()
    const all: AgentEvent[] = []
    const before: AgentEvent[] = []
    const after: AgentEvent[] = []
    client.subscribe(event => all.push(event))
    const unsubscribe = client.subscribe(event => before.push(event))
    const receipt = await client.send({ message: '后台运行' })
    await vi.advanceTimersByTimeAsync(300)
    unsubscribe()
    const countBefore = before.length
    client.subscribe(event => after.push(event))
    await vi.advanceTimersByTimeAsync(8200)
    expect(all.at(-1)?.type).toBe('step.text')
    expect(all.filter(isTerminalEvent)).toEqual([])
    await vi.advanceTimersByTimeAsync(3500)
    expect(all).toHaveLength(agentScripts.long.length)
    expect(before).toHaveLength(countBefore)
    expect(after).toEqual(all.slice(countBefore))
    expect(all.every(event => event.runId === receipt.runId)).toBe(true)
    const steps = all.flatMap(event => 'stepId' in event ? [event.stepId] : [])
    expect(new Set(steps).size).toBe(steps.length)
    expect(all.filter(isTerminalEvent)).toHaveLength(1)
  })

  test('slow delays send acceptance by 1500ms without changing the selected script', async () => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/?scenario=slow&agentScript=failure')
    const client = createMockAgentClient()
    const events: AgentEvent[] = []
    client.subscribe(event => events.push(event))
    let accepted = false
    const pending = client.send({ message: '延迟受理' }).then(receipt => { accepted = true; return receipt })
    await vi.advanceTimersByTimeAsync(1499)
    expect(accepted).toBe(false)
    expect(events).toEqual([])
    await vi.advanceTimersByTimeAsync(1)
    expect(accepted).toBe(true)
    const receipt = await pending
    await vi.runAllTimersAsync()
    expect(events.at(-1)).toMatchObject({ type: 'run.failed', ...receipt })
  })

  test('invalid input or script rejects before scheduling any events', async () => {
    vi.useFakeTimers()
    const client = createMockAgentClient()
    await expect(client.send({ message: '  ' })).rejects.toMatchObject({ error: { code: 'validation_error', retryable: false } })
    window.history.replaceState(null, '', '/?agentScript=unknown')
    await expect(client.send({ message: '样例' })).rejects.toMatchObject({ error: { code: 'validation_error' } })
    expect(vi.getTimerCount()).toBe(0)
  })
})

function dataRequests(client: DataClient): Promise<unknown>[] {
  return [
    client.bootstrap(), client.getModuleCatalog(), client.getDailyBrief(), client.getMarketBoard(),
    client.getWatchlist(), client.getReleaseCalendar('2026-10-27', '2026-10-29'),
    client.getModuleSummary('supply-demand'), client.getNewsTicker(), client.getSourceStatus(), client.getResearchList(),
  ]
}
