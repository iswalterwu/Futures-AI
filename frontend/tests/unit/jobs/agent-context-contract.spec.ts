import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { AgentEventSchema, AgentRunSchema, isTerminalEvent, type AgentEvent } from '../../../src/agent/events.ts'
import { SendMessageSchema, type JobContext } from '../../../src/contracts/types.ts'
import { agentScripts, createMockAgentClient, type AgentScriptName } from '../../../src/contracts/mock/index.ts'

const context: JobContext = { jobId: 'j-merge', stage: 'deliver' }
const scriptNames = ['success', 'failure', 'retry', 'long'] as const
const legacyEvents = [
  ...Object.values(agentScripts).flatMap(script => script.map(item => item.event)),
  { type: 'run.aborted', runId: 'legacy-abort', sessionId: 'legacy-session', ts: '2026-10-28T08:00:00Z' },
]

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  vi.stubEnv('VITE_MOCK_SCENARIO', undefined)
})
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
  delete window.__FAI_MOCK__
  window.history.replaceState(null, '', '/')
})

describe('WI H-1 schema — AC-005-5 / AC-008-1', () => {
  test('SendMessage optional context parses, illegal stage/missing job id/null fail', () => {
    expect(SendMessageSchema.parse({ message: '分析' })).toEqual({ message: '分析' })
    expect(SendMessageSchema.parse({ message: '分析', jobContext: context })).toEqual({ message: '分析', jobContext: context })
    for (const jobContext of [{ jobId: 'j-merge', stage: 'unknown' }, { stage: 'deliver' }, { jobId: '', stage: 'deliver' }, null]) {
      expect(SendMessageSchema.safeParse({ message: '分析', jobContext }).success).toBe(false)
    }
  })
  test('all ten event variants accept optional context and reject invalid stage', () => {
    expect(new Set(legacyEvents.map(event => event.type)).size).toBe(10)
    for (const event of legacyEvents) {
      expect(AgentEventSchema.parse({ ...event, jobContext: context })).toEqual({ ...event, jobContext: context })
      expect(AgentEventSchema.safeParse({ ...event, jobContext: { ...context, stage: 'unknown' } }).success).toBe(false)
    }
  })
  test('generated SendMessage and every event section list jobContext as optional', () => {
    const document = readFileSync('contracts/CONTRACT.md', 'utf8')
    for (const name of ['SendMessage', ...AgentEventSchema.options.map(schema => schema.shape.type.value)]) {
      const section = document.split(`### \`${name}\``)[1]?.split('\n### ')[0]
      expect(section, name).toContain('| `$.jobContext` | 否 |')
    }
  })
})

describe('WI H-1 legacy — AC-008-1', () => {
  test('old ten event variants still parse unchanged without a jobContext key', () => {
    expect(AgentEventSchema.options).toHaveLength(10)
    for (const event of legacyEvents) {
      expect(AgentEventSchema.parse(event)).toEqual(event)
      expect(Object.hasOwn(AgentEventSchema.parse(event), 'jobContext')).toBe(false)
    }
  })
  test.each(scriptNames)('%s original script still passes the actual whole-run boundary', name => {
    const events = agentScripts[name].map(item => item.event)
    expect(AgentRunSchema.parse(events)).toEqual(events)
    expect(events.every(event => !Object.hasOwn(event, 'jobContext'))).toBe(true)
    expect(events.filter(isTerminalEvent)).toHaveLength(1)
  })
})

describe('WI H-1 passthrough — AC-005-5', () => {
  test.each(scriptNames)('%s timers preserve context for every event and omit it for legacy sends', async name => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-28T09:00:00Z'))
    window.__FAI_MOCK__ = { agentScript: name }
    const client = createMockAgentClient()
    const received: AgentEvent[] = []
    const unsubscribe = client.subscribe(event => received.push(event))
    const tagged = await client.send({ message: '带上下文', jobContext: context })
    const legacy = await client.send({ message: '普通消息' })
    expect(received).toEqual([]) // receipt precedes the actual timer-driven run.started
    for (const time of [...new Set(agentScripts[name].map(item => item.afterMs))]) {
      await vi.advanceTimersByTimeAsync(time - (Date.now() - Date.parse('2026-10-28T09:00:00Z')))
      expect(received.filter(event => event.runId === tagged.runId)).toHaveLength(agentScripts[name].filter(item => item.afterMs <= time).length)
    }
    for (const receipt of [tagged, legacy]) {
      const events = received.filter(event => event.runId === receipt.runId)
      expect(events).toHaveLength(agentScripts[name].length)
      expect(AgentRunSchema.parse(events)).toEqual(events)
      expect(events.map(event => event.type)).toEqual(agentScripts[name].map(item => item.event.type))
      expect(events.filter(isTerminalEvent)).toHaveLength(1)
      for (const event of events) {
        expect(event.sessionId).toBe(receipt.sessionId)
        if (receipt === tagged) expect(event.jobContext).toEqual(context)
        else expect(Object.hasOwn(event, 'jobContext')).toBe(false)
      }
    }
    unsubscribe()
    expect(vi.getTimerCount()).toBe(0)
  })
  test('a later send and caller mutations cannot rebind already delivered or future events of the first run', async () => {
    vi.useFakeTimers()
    window.__FAI_MOCK__ = { agentScript: 'long' }
    const client = createMockAgentClient()
    const events: AgentEvent[] = []
    client.subscribe(event => events.push(event))
    const firstContext: JobContext = { jobId: 'j-merge', stage: 'deliver' }
    const first = await client.send({ message: '首个 run', jobContext: firstContext })
    await vi.advanceTimersByTimeAsync(0)
    expect(events[0]).toMatchObject({ type: 'run.started', runId: first.runId, jobContext: context })
    const deliveredBefore = structuredClone(events)
    firstContext.jobId = 'caller-mutated'
    firstContext.stage = 'collect'
    window.history.replaceState(null, '', '/jobs/j-running/analyze')
    const secondContext: JobContext = { jobId: 'j-running', stage: 'analyze' }
    const second = await client.send({ message: '另一个 run', jobContext: secondContext })
    secondContext.stage = 'process'
    await vi.advanceTimersByTimeAsync(12000)
    expect(events.slice(0, deliveredBefore.length)).toEqual(deliveredBefore)
    const firstEvents = events.filter(event => event.runId === first.runId)
    const secondEvents = events.filter(event => event.runId === second.runId)
    expect(firstEvents).toHaveLength(agentScripts.long.length)
    expect(secondEvents).toHaveLength(agentScripts.long.length)
    expect(firstEvents.every(event => JSON.stringify(event.jobContext) === JSON.stringify(context))).toBe(true)
    expect(secondEvents.every(event => event.jobContext?.jobId === 'j-running' && event.jobContext.stage === 'analyze')).toBe(true)
    expect(first.runId).not.toBe(second.runId)
  })
  test('invalid context is rejected before any event is scheduled', async () => {
    vi.useFakeTimers()
    const client = createMockAgentClient()
    const listener = vi.fn()
    client.subscribe(listener)
    await expect(client.send({ message: '非法', jobContext: { jobId: 'j-merge', stage: 'wrong' } as unknown as JobContext })).rejects.toMatchObject({ error: { code: 'validation_error', retryable: false } })
    expect(vi.getTimerCount()).toBe(0)
    expect(listener).not.toHaveBeenCalled()
  })
  test('slow acceptance captures context before its 1500ms delay', async () => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/?scenario=slow')
    window.__FAI_MOCK__ = { agentScript: 'success' satisfies AgentScriptName }
    const client = createMockAgentClient()
    const events: AgentEvent[] = []
    client.subscribe(event => events.push(event))
    const inputContext = { ...context }
    const pending = client.send({ message: '延迟受理', jobContext: inputContext })
    inputContext.jobId = 'after-send'
    await vi.advanceTimersByTimeAsync(1499)
    expect(events).toEqual([])
    await vi.advanceTimersByTimeAsync(1)
    const receipt = await pending
    await vi.runAllTimersAsync()
    expect(events).toHaveLength(agentScripts.success.length)
    expect(events.every(event => event.runId === receipt.runId && event.jobContext?.jobId === context.jobId && event.jobContext.stage === context.stage)).toBe(true)
  })
})
