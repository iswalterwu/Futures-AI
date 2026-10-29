import { createPinia, setActivePinia } from 'pinia'
import { isReadonly } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { AgentEventSchema, isTerminalEvent, type AgentEvent } from '../../../src/agent/events.ts'
import { dataClient } from '../../../src/contracts/index.ts'
import { agentScripts, createMockAgentClient, createMockDataClient } from '../../../src/contracts/mock/index.ts'
import { ACTIVE_JOB_STATUSES, type Bootstrap, type CreateJobInput, type JobContext } from '../../../src/contracts/types.ts'
import { useJobsStore, type ListJobsFilter } from '../../../src/jobs/stores/jobs.ts'

const input: CreateJobInput = { title: '缓存新作业', type: 'research', subject: '柴油', goal: '验证供需\n保留依据' }
const context: JobContext = { jobId: 'j-collect', stage: 'collect' }
const scriptNames = ['success', 'failure', 'retry', 'long'] as const

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  vi.stubEnv('VITE_MOCK_SCENARIO', undefined)
  setActivePinia(createPinia())
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
  delete window.__FAI_MOCK__
  window.history.replaceState(null, '', '/')
  localStorage.clear()
})

// The production boundary remains real; the spies only delegate and count calls.
function connect(scenario: Bootstrap['scenario'] = 'normal') {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  const client = createMockDataClient()
  const reads = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  const writes = vi.spyOn(dataClient, 'createJob').mockImplementation(value => client.createJob(value))
  return { client, reads, writes, store: useJobsStore() }
}

function changeScenario(scenario: Bootstrap['scenario']) {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

describe('WI H-2 cache — AC-001-1 / AC-008-3 partial', () => {
  test('shares a readonly unscreened cache, loads only from idle and never polls or touches storage on reads', async () => {
    vi.useFakeTimers()
    const { client, reads, store } = connect()
    const expected = await client.listJobs()
    const storage = ['getItem', 'setItem', 'removeItem', 'clear'].map(method =>
      vi.spyOn(Storage.prototype, method as 'getItem'))
    expect(useJobsStore()).toBe(store)
    expect(store.jobs).toEqual([])
    expect(store.listStatus).toBe('idle')
    expect(store.listError).toBeNull()
    const loading = store.ensureJobs()
    expect(store.listStatus).toBe('loading')
    await store.ensureJobs()
    expect(reads).toHaveBeenCalledTimes(1)
    await loading
    expect(store.jobs).toEqual(expected)
    expect(store.jobs.map(job => job.updatedAt)).toEqual(expected.map(job => job.updatedAt).sort().reverse())
    expect(store.listStatus).toBe('ready')
    expect(isReadonly(store.jobs)).toBe(true)
    expect(isReadonly(store.jobs[0])).toBe(true)
    const cached = store.jobs
    await store.ensureJobs()
    await vi.advanceTimersByTimeAsync(60000)
    expect(store.jobs).toBe(cached)
    expect(reads).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
    await store.refresh()
    await store.applyFilter({ status: 'collecting' })
    await store.applyFilter(null)
    expect(storage.every(spy => spy.mock.calls.length === 0)).toBe(true)
  })

  test('slow initial reads expose loading; refresh with existing data stays ready', async () => {
    vi.useFakeTimers()
    const { store, reads, client } = connect('slow')
    const first = store.ensureJobs()
    expect(store.listStatus).toBe('loading')
    await vi.advanceTimersByTimeAsync(1499)
    expect(store.listStatus).toBe('loading')
    expect(store.jobs).toEqual([])
    await vi.advanceTimersByTimeAsync(1)
    await first
    expect(store.listStatus).toBe('ready')
    const cached = store.jobs
    const refresh = store.refresh()
    expect(store.listStatus).toBe('ready')
    expect(store.jobs).toBe(cached)
    await vi.advanceTimersByTimeAsync(1500)
    await refresh
    const expected = client.listJobs()
    await vi.advanceTimersByTimeAsync(1500)
    expect(store.jobs).toEqual(await expected)
    expect(reads).toHaveBeenCalledTimes(2)
  })

  test('empty is ready and does not restart loading or implicitly reload', async () => {
    const { store, reads } = connect('empty')
    await store.ensureJobs()
    expect(store.jobs).toEqual([])
    expect(store.listStatus).toBe('ready')
    await store.ensureJobs()
    expect(reads).toHaveBeenCalledTimes(1)
    const refresh = store.refresh()
    expect(store.listStatus).toBe('ready')
    await refresh
  })

  test('S38 real read errors resolve, ensure does not retry, explicit refresh recovers', async () => {
    const { store, reads } = connect('error')
    await expect(store.ensureJobs()).resolves.toBeUndefined()
    expect(store.listStatus).toBe('error')
    expect(store.listError).toMatchObject({ code: 'adapter_error', retryable: true })
    await store.ensureJobs()
    expect(reads).toHaveBeenCalledTimes(1)
    await expect(store.refresh()).resolves.toBeUndefined()
    expect(reads).toHaveBeenCalledTimes(2)
    const client = changeScenario('normal')
    await expect(store.refresh()).resolves.toBeUndefined()
    expect(store.jobs).toEqual(await client.listJobs())
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
  })

  test('read failure retains both caches for diagnostics; retry with data never becomes loading', async () => {
    const { store } = connect()
    await store.ensureJobs()
    await store.applyFilter({ status: 'collecting' })
    const base = store.jobs
    const filtered = store.filteredJobs
    changeScenario('error')
    await expect(store.refresh()).resolves.toBeUndefined()
    expect(store.listStatus).toBe('error')
    expect(store.listError?.code).toBe('adapter_error')
    expect(store.jobs).toBe(base)
    expect(store.filteredJobs).toBe(filtered)
    changeScenario('normal')
    const retry = store.refresh()
    expect(store.listStatus).not.toBe('loading')
    await retry
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
  })
})

describe('WI H-2 filter — AC-001-2 partial', () => {
  test('delegates combined filters to listJobs without replacing base; clear restores base without a read', async () => {
    const { client, reads, store } = connect()
    await store.ensureJobs()
    const base = store.jobs
    const sample = base[0]!
    const filter: ListJobsFilter = { status: sample.status, type: sample.type, title: sample.title.slice(0, 2) }
    const expected = await client.listJobs(filter)
    expect(expected.length).toBeGreaterThan(0)
    reads.mockClear()
    await store.applyFilter(filter)
    expect(reads.mock.calls).toEqual([[filter]])
    expect(store.filteredJobs).toEqual(expected)
    expect(store.filter).toEqual(filter)
    expect(store.jobs).toBe(base)
    expect(isReadonly(store.filteredJobs)).toBe(true)
    await store.applyFilter({ title: '不存在的作业标题' })
    expect(store.filteredJobs).toEqual(await client.listJobs({ title: '不存在的作业标题' }))
    expect(store.jobs).toBe(base)
    reads.mockClear()
    await store.applyFilter(null)
    expect(store.filter).toBeNull()
    expect(store.filteredJobs).toBeNull()
    expect(store.jobs).toBe(base)
    expect(reads).not.toHaveBeenCalled()
  })

  test('refresh rereads base then the active filtered view, including an empty-object filter', async () => {
    const { client, reads, store } = connect()
    await store.ensureJobs()
    for (const filter of [{ status: 'collecting' } as const, {}]) {
      await store.applyFilter(filter)
      await client.createJob(input)
      reads.mockClear()
      await store.refresh()
      expect(reads.mock.calls).toEqual([[], [filter]])
      expect(store.jobs).toEqual(await client.listJobs())
      expect(store.filteredJobs).toEqual(await client.listJobs(filter))
      expect(store.listStatus).toBe('ready')
    }
  })

  test('refresh catches a real failure on its second read and retains the previous filtered cache', async () => {
    const { client, reads, store } = connect()
    await store.ensureJobs()
    const filter = { status: 'collecting' } as const
    await store.applyFilter(filter)
    const filtered = store.filteredJobs
    await client.createJob(input)
    const expectedBase = await client.listJobs()
    reads.mockClear()
    reads.mockImplementation(async (...args) => {
      const result = await client.listJobs(...args)
      // Switch the real mock session between the two reads, not a fabricated rejection.
      if (args.length === 0) changeScenario('error')
      return result
    })
    await expect(store.refresh()).resolves.toBeUndefined()
    expect(reads.mock.calls).toEqual([[], [filter]])
    expect(store.jobs).toEqual(expectedBase)
    expect(store.filteredJobs).toBe(filtered)
    expect(store.listStatus).toBe('error')
    expect(store.listError?.code).toBe('adapter_error')
  })

  test('filter read errors resolve and retain both caches; the next filter read clears the error', async () => {
    const { store } = connect()
    await store.ensureJobs()
    await store.applyFilter({ status: 'collecting' })
    const base = store.jobs
    const filtered = store.filteredJobs
    changeScenario('error')
    await expect(store.applyFilter({ type: 'daily' })).resolves.toBeUndefined()
    expect(store.filter).toEqual({ type: 'daily' })
    expect(store.jobs).toBe(base)
    expect(store.filteredJobs).toBe(filtered)
    expect(store.listStatus).toBe('error')
    expect(store.listError?.code).toBe('adapter_error')
    const client = changeScenario('normal')
    await store.applyFilter({ type: 'daily' })
    expect(store.filteredJobs).toEqual(await client.listJobs({ type: 'daily' }))
    expect(store.jobs).toBe(base)
    expect(store.listError).toBeNull()
    expect(store.listStatus).toBe('ready')
  })
})

describe('WI H-2 createJob refresh — AC-001-3 partial', () => {
  test.each([
    input,
    { title: '可选主题', type: 'adhoc', subject: null, goal: '' } satisfies CreateJobInput,
  ])('returns receipt jobs[0], refreshes exactly once and needs no manual load ($title)', async value => {
    const { client, reads, writes, store } = connect()
    const result = await store.createJob(value)
    expect(writes).toHaveBeenCalledExactlyOnceWith(value)
    const receipt = await writes.mock.results[0]!.value
    expect(result).toBe(receipt.jobs[0])
    expect(result).toMatchObject({ ...value, status: 'collecting', currentStage: 'collect', createdBy: 'human' })
    expect(ACTIVE_JOB_STATUSES).toContain(result.status)
    expect(ACTIVE_JOB_STATUSES).toEqual(['draft', 'collecting', 'processing', 'analyzing', 'delivering', 'needs_human', 'failed'])
    expect(reads.mock.calls).toEqual([[]])
    expect(store.jobs).toEqual(await client.listJobs())
    expect(store.jobs[0]?.id).toBe(result.id)
    expect(store.listStatus).toBe('ready')
  })

  test('one refresh also updates the isolated active filter after creation', async () => {
    const { client, reads, store } = connect()
    await store.ensureJobs()
    const filter = { type: 'research' } as const
    await store.applyFilter(filter)
    reads.mockClear()
    const job = await store.createJob(input)
    expect(reads.mock.calls).toEqual([[], [filter]])
    expect(store.jobs.some(item => item.id === job.id)).toBe(true)
    expect(store.filteredJobs).toEqual(await client.listJobs(filter))
    expect(store.filteredJobs?.some(item => item.id === job.id)).toBe(true)
  })

  test.each([
    { ...input, title: '   ' },
    { ...input, type: '' } as unknown as CreateJobInput,
    { ...input, subject: '' },
  ])('contract validation rejects unchanged and never refreshes ($title / $type / $subject)', async value => {
    const { reads, writes, store } = connect()
    await store.ensureJobs()
    await store.applyFilter({ status: 'collecting' })
    const base = store.jobs
    const filtered = store.filteredJobs
    reads.mockClear()
    const rejection = store.createJob(value)
    const originalError = await writes.mock.results[0]!.value.catch((cause: unknown) => cause)
    await expect(rejection).rejects.toBe(originalError)
    expect(originalError).toMatchObject({ error: { code: 'validation_error' } })
    expect(reads).not.toHaveBeenCalled()
    expect(store.jobs).toBe(base)
    expect(store.filteredJobs).toBe(filtered)
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
  })

  test('adapter write failure also rejects without refreshing or changing the cached view', async () => {
    const { reads, store } = connect()
    await store.ensureJobs()
    const base = store.jobs
    changeScenario('error')
    reads.mockClear()
    await expect(store.createJob(input)).rejects.toMatchObject({ error: { code: 'adapter_error' } })
    expect(reads).not.toHaveBeenCalled()
    expect(store.jobs).toBe(base)
    expect(store.listStatus).toBe('ready')
  })
})

describe('WI H-2 agent refresh — AC-002-4 / AC-006-6 / AC-007-2 partial', () => {
  test.each(scriptNames)('%s real timed run refreshes once at its tagged terminal, never for intermediate or legacy events', async name => {
    vi.useFakeTimers()
    const { client, reads, store } = connect()
    await store.ensureJobs()
    const base = store.jobs
    reads.mockClear()
    window.__FAI_MOCK__ = { agentScript: name }
    const agent = createMockAgentClient()
    const events: AgentEvent[] = []
    const unsubscribe = agent.subscribe(store.receiveAgentEvent)
    const stopRecording = agent.subscribe(event => events.push(event))
    await agent.send({ message: '作业运行', jobContext: context })
    const terminalTime = agentScripts[name].at(-1)!.afterMs
    await vi.advanceTimersByTimeAsync(terminalTime - 1)
    expect(events.length).toBeGreaterThan(0)
    expect(events.some(isTerminalEvent)).toBe(false)
    expect(reads).not.toHaveBeenCalled()
    expect(store.jobs).toBe(base)
    await vi.advanceTimersByTimeAsync(1)
    expect(events).toHaveLength(agentScripts[name].length)
    expect(events.at(-1)).toMatchObject({ type: agentScripts[name].at(-1)!.event.type, jobContext: context })
    expect(reads.mock.calls).toEqual([[]])
    expect(store.jobs).toEqual(await client.listJobs()) // A18 is not wired: only notification/reload is promised.
    expect(store.listStatus).toBe('ready')
    reads.mockClear()
    await agent.send({ message: '旧版无上下文运行' })
    await vi.runAllTimersAsync()
    expect(reads).not.toHaveBeenCalled()
    unsubscribe()
    stopRecording()
    await agent.send({ message: '解除订阅后', jobContext: context })
    await vi.runAllTimersAsync()
    expect(reads).not.toHaveBeenCalled()
  })

  test('the contract aborted variant refreshes only with context (built-in scripts have no abort)', async () => {
    const { reads, store } = connect()
    const event = AgentEventSchema.parse({ type: 'run.aborted', runId: 'abort', sessionId: 'session', ts: '2026-10-29T09:00:00Z' })
    store.receiveAgentEvent(event)
    expect(reads).not.toHaveBeenCalled()
    store.receiveAgentEvent({ ...event, jobContext: context })
    expect(reads.mock.calls).toEqual([[]])
    await reads.mock.results[0]!.value
    // Let the store's continuation finish, without an extra refresh.
    await Promise.resolve()
    expect(store.listStatus).toBe('ready')
  })

  test.each(scriptNames)('S38 %s terminal in real error scenario resolves read failure without an unhandled rejection', async name => {
    vi.useFakeTimers()
    const { reads, store } = connect()
    await store.ensureJobs()
    await store.applyFilter({ status: 'collecting' })
    const base = store.jobs
    const filtered = store.filteredJobs
    changeScenario('error')
    window.__FAI_MOCK__ = { agentScript: name }
    const agent = createMockAgentClient()
    const events: AgentEvent[] = []
    const unsubscribe = agent.subscribe(store.receiveAgentEvent)
    const stopRecording = agent.subscribe(event => events.push(event))
    reads.mockClear()
    await agent.send({ message: '终态触发失败的读取', jobContext: context })
    await vi.runAllTimersAsync()
    expect(events.filter(isTerminalEvent)).toHaveLength(1)
    expect(events.at(-1)?.jobContext).toEqual(context)
    expect(reads.mock.calls).toEqual([[]])
    expect(store.listStatus).toBe('error')
    expect(store.listError).toMatchObject({ code: 'adapter_error', retryable: true })
    expect(store.jobs).toBe(base)
    expect(store.filteredJobs).toBe(filtered)
    // No listener catches promises: Vitest would report any unhandled rejection.
    await expect(store.refresh()).resolves.toBeUndefined()
    unsubscribe()
    stopRecording()
  })
})
