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

describe('WI H-2 list status — AC-001-1 / AC-001-2 / AC-001-4 partial', () => {
  test('filtering before ensure keeps idle so ensure still loads the unscreened cache and preserves the filtered view', async () => {
    const { client, reads, store } = connect()
    const filter: ListJobsFilter = { type: 'daily' }
    const expectedBase = await client.listJobs()
    const expectedFiltered = await client.listJobs(filter)
    expect(expectedFiltered.length).toBeGreaterThan(0)
    expect(expectedFiltered.length).toBeLessThan(expectedBase.length)

    await store.applyFilter(filter)
    expect(reads.mock.calls).toEqual([[filter]])
    expect(store.filter).toEqual(filter)
    expect(store.filteredJobs).toEqual(expectedFiltered)
    expect(store.jobs).toEqual([])
    expect(store.listStatus).toBe('idle')
    expect(store.listError).toBeNull()

    await store.ensureJobs()
    expect(reads.mock.calls).toEqual([[filter], [], [filter]])
    expect(store.jobs).toEqual(expectedBase)
    expect(store.filter).toEqual(filter)
    expect(store.filteredJobs).toEqual(expectedFiltered)
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
  })

  test('successful filtering preserves a base read error until explicit refresh recovers both views', async () => {
    const { reads, store } = connect('error')
    await expect(store.ensureJobs()).resolves.toBeUndefined()
    expect(store.listStatus).toBe('error')
    expect(store.listError?.code).toBe('adapter_error')
    const base = store.jobs
    const error = store.listError
    const client = changeScenario('normal')
    const filter: ListJobsFilter = { type: 'daily' }
    const expectedBase = await client.listJobs()
    const expectedFiltered = await client.listJobs(filter)
    expect(expectedFiltered.length).toBeGreaterThan(0)
    reads.mockClear()

    await store.applyFilter(filter)
    expect(reads.mock.calls).toEqual([[filter]])
    expect(store.filter).toEqual(filter)
    expect(store.filteredJobs).toEqual(expectedFiltered)
    expect(store.jobs).toBe(base)
    expect(store.listStatus).toBe('error')
    expect(store.listError).toBe(error)
    expect(store.listError?.code).toBe('adapter_error')
    await store.ensureJobs()
    expect(reads.mock.calls).toEqual([[filter]])
    expect(store.jobs).toBe(base)
    expect(store.listStatus).toBe('error')
    expect(store.listError).toBe(error)

    await expect(store.refresh()).resolves.toBeUndefined()
    expect(reads.mock.calls).toEqual([[filter], [], [filter]])
    expect(store.jobs).toEqual(expectedBase)
    expect(store.filteredJobs).toEqual(expectedFiltered)
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

  test('filter read errors resolve and retain both caches; only an explicit refresh clears the error', async () => {
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
    expect(store.listStatus).toBe('error')
    expect(store.listError?.code).toBe('adapter_error')
    await expect(store.refresh()).resolves.toBeUndefined()
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

describe('WI detail cache open — AC-002-1 / AC-002-2 partial', () => {
  let connection: ReturnType<typeof connect>
  beforeEach(() => {
    connection = connect()
    const { client } = connection
    vi.spyOn(dataClient, 'getJob').mockImplementation(id => client.getJob(id))
    vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  })

  test('opens the requested stage with readonly members and nested data, without storage or list reads', async () => {
    const { client, reads, store } = connection
    const expectedJob = await client.getJob('j-process')
    const expectedWorkspace = await client.getStageWorkspace('j-process', 'analyze')
    const storage = ['getItem', 'setItem', 'removeItem', 'clear'].map(method =>
      vi.spyOn(Storage.prototype, method as 'getItem'))
    expect(store.currentJob).toBeNull()
    expect(store.currentStageWorkspace).toBeNull()
    expect(store.detailStatus).toBe('idle')
    expect(store.detailError).toBeNull()
    const opening = store.openJob('j-process', 'analyze')
    expect(store.detailStatus).toBe('loading')
    await expect(opening).resolves.toBe('analyze')
    expect(store.currentJob).toEqual(expectedJob)
    expect(store.currentStageWorkspace).toEqual(expectedWorkspace)
    expect(store.currentStageWorkspace?.stage).toBe('analyze')
    expect(store.detailStatus).toBe('ready')
    expect(store.detailError).toBeNull()
    expect(dataClient.getJob).toHaveBeenCalledExactlyOnceWith('j-process')
    expect(dataClient.getStageWorkspace).toHaveBeenCalledExactlyOnceWith('j-process', 'analyze')
    for (const key of ['currentJob', 'currentStageWorkspace', 'detailStatus', 'detailError']) {
      expect(isReadonly(Object.getOwnPropertyDescriptor(store, key)?.value)).toBe(true)
    }
    expect(isReadonly(store.currentJob)).toBe(true)
    expect(isReadonly(store.currentJob?.stages)).toBe(true)
    expect(isReadonly(store.currentJob?.stages[0])).toBe(true)
    expect(isReadonly(store.currentStageWorkspace)).toBe(true)
    expect(isReadonly(store.currentStageWorkspace?.artifacts)).toBe(true)
    expect(storage.every(spy => spy.mock.calls.length === 0)).toBe(true)
    expect(reads).not.toHaveBeenCalled()
    expect(store.listStatus).toBe('idle')
    expect(store.listError).toBeNull()
    expect(store).not.toHaveProperty('anchor')
    expect(store).not.toHaveProperty('readDetail')
    expect(store).not.toHaveProperty('closeJob')
  })

  test('null stage resolves to the business current stage and is reused by refresh', async () => {
    const { client, store } = connection
    const job = await client.getJob('j-process')
    await expect(store.openJob('j-process', null)).resolves.toBe(job?.currentStage)
    expect(store.currentStageWorkspace).toEqual(await client.getStageWorkspace('j-process', 'process'))
    expect(store.currentStageWorkspace?.artifacts.length).toBeGreaterThan(0)
    expect(isReadonly(store.currentStageWorkspace?.artifacts[0])).toBe(true)
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    await store.refresh()
    expect(dataClient.getStageWorkspace).toHaveBeenCalledExactlyOnceWith('j-process', 'process')
  })

  test('switching stages of the same job keeps ready and the old workspace until the read completes', async () => {
    const { store } = connection
    await store.openJob('j-process', 'analyze')
    const cached = store.currentStageWorkspace
    const opening = store.openJob('j-process', 'collect')
    expect(store.detailStatus).toBe('ready')
    expect(store.currentStageWorkspace).toBe(cached)
    await expect(opening).resolves.toBe('collect')
    expect(store.currentStageWorkspace?.stage).toBe('collect')
    expect(store.detailStatus).toBe('ready')
  })

  test('opening a different job enters loading and replaces both caches on success', async () => {
    const { client, store } = connection
    await store.openJob('j-process', 'analyze')
    const cached = store.currentJob
    const opening = store.openJob('j-collect', 'collect')
    expect(store.detailStatus).toBe('loading')
    expect(store.currentJob).toBe(cached)
    await expect(opening).resolves.toBe('collect')
    expect(store.currentJob).toEqual(await client.getJob('j-collect'))
    expect(store.currentStageWorkspace).toEqual(await client.getStageWorkspace('j-collect', 'collect'))
  })
})

describe('WI detail cache states — AC-001-4 partial', () => {
  let connection: ReturnType<typeof connect>
  beforeEach(() => {
    connection = connect()
    const { client } = connection
    vi.spyOn(dataClient, 'getJob').mockImplementation(id => client.getJob(id))
    vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  })

  test('slow first open stays loading through both sequential reads, then becomes ready', async () => {
    vi.useFakeTimers()
    changeScenario('slow')
    const { store } = connection
    const opening = store.openJob('j-process', 'analyze')
    expect(store.detailStatus).toBe('loading')
    await vi.advanceTimersByTimeAsync(1500)
    expect(store.detailStatus).toBe('loading')
    expect(store.currentJob).toBeNull()
    expect(dataClient.getStageWorkspace).toHaveBeenCalledExactlyOnceWith('j-process', 'analyze')
    await vi.advanceTimersByTimeAsync(1499)
    expect(store.detailStatus).toBe('loading')
    await vi.advanceTimersByTimeAsync(1)
    await expect(opening).resolves.toBe('analyze')
    expect(store.detailStatus).toBe('ready')
    expect(store.currentJob?.id).toBe('j-process')
    expect(store.currentStageWorkspace?.stage).toBe('analyze')
    expect(store.listStatus).toBe('idle')
    expect(store.listError).toBeNull()
  })

  test('empty preset id clears old caches, skips workspace reads and resolves null as ready', async () => {
    const { store } = connection
    await store.openJob('j-process', 'analyze')
    changeScenario('empty')
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    await expect(store.openJob('j-collect', 'collect')).resolves.toBeNull()
    expect(store.currentJob).toBeNull()
    expect(store.currentStageWorkspace).toBeNull()
    expect(store.detailStatus).toBe('ready')
    expect(store.detailError).toBeNull()
    expect(dataClient.getStageWorkspace).not.toHaveBeenCalled()
    expect(store.listStatus).toBe('idle')
    expect(store.listError).toBeNull()
  })

  test.each([
    { scenario: 'error', id: 'j-collect', code: 'adapter_error', retryable: true },
    { scenario: 'normal', id: 'j-missing', code: 'not_found', retryable: false },
  ] as const)('$scenario / $id resolves null with the original typed error and preserves both caches and list state', async ({ scenario, id, code, retryable }) => {
    const { store } = connection
    await store.ensureJobs()
    await store.openJob('j-process', 'analyze')
    const job = store.currentJob
    const workspace = store.currentStageWorkspace
    const list = store.jobs
    const listError = store.listError
    changeScenario(scenario)
    vi.mocked(dataClient.getJob).mockClear()
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    await expect(store.openJob(id, 'collect')).resolves.toBeNull()
    const cause = await vi.mocked(dataClient.getJob).mock.results[0]!.value.catch((error: unknown) => error)
    expect(store.detailStatus).toBe('error')
    expect(cause).toEqual({ error: store.detailError })
    expect(store.detailError).toMatchObject({ code, retryable })
    expect(isReadonly(store.detailError)).toBe(true)
    expect(store.currentJob).toBe(job)
    expect(store.currentStageWorkspace).toBe(workspace)
    expect(dataClient.getStageWorkspace).not.toHaveBeenCalled()
    expect(store.jobs).toBe(list)
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBe(listError)
  })

  test('workspace failure after a successful job read preserves both old caches; a later open clears the error', async () => {
    const { client, store } = connection
    await store.openJob('j-process', 'analyze')
    const job = store.currentJob
    const workspace = store.currentStageWorkspace
    vi.mocked(dataClient.getJob).mockImplementationOnce(async id => {
      const result = await client.getJob(id)
      changeScenario('error')
      return result
    })
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    await expect(store.openJob('j-collect', 'collect')).resolves.toBeNull()
    const cause = await vi.mocked(dataClient.getStageWorkspace).mock.results[0]!.value.catch((error: unknown) => error)
    expect(cause).toEqual({ error: store.detailError })
    expect(store.detailStatus).toBe('error')
    expect(store.currentJob).toBe(job)
    expect(store.currentStageWorkspace).toBe(workspace)
    expect(store.listStatus).toBe('idle')
    expect(store.listError).toBeNull()
    changeScenario('normal')
    await expect(store.openJob('j-collect', 'collect')).resolves.toBe('collect')
    expect(store.detailStatus).toBe('ready')
    expect(store.detailError).toBeNull()
    expect(store.currentJob?.id).toBe('j-collect')
    expect(store.currentStageWorkspace?.stage).toBe('collect')
  })

  test('successful detail open cannot clear an existing list read error', async () => {
    const { store } = connection
    changeScenario('error')
    await store.ensureJobs()
    const error = store.listError
    changeScenario('normal')
    await expect(store.openJob('j-process', 'analyze')).resolves.toBe('analyze')
    expect(store.detailStatus).toBe('ready')
    expect(store.detailError).toBeNull()
    expect(store.listStatus).toBe('error')
    expect(store.listError).toBe(error)
  })
})

describe('WI detail cache refresh — AC-001-4 / AC-002-2 partial', () => {
  let connection: ReturnType<typeof connect>
  beforeEach(() => {
    connection = connect()
    const { client } = connection
    vi.spyOn(dataClient, 'getJob').mockImplementation(id => client.getJob(id))
    vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  })

  test('without an open anchor refresh only reads the list and leaves detail idle', async () => {
    const { reads, store } = connection
    await store.refresh()
    expect(reads.mock.calls).toEqual([[]])
    expect(dataClient.getJob).not.toHaveBeenCalled()
    expect(dataClient.getStageWorkspace).not.toHaveBeenCalled()
    expect(store.detailStatus).toBe('idle')
    expect(store.detailError).toBeNull()
  })

  test('each refresh reads the last opened anchor once after base and filter, without loading or polling', async () => {
    vi.useFakeTimers()
    const { client, reads, store } = connection
    await store.ensureJobs()
    await store.openJob('j-collect', 'collect')
    await store.openJob('j-process', 'analyze')
    const expectedJob = await client.getJob('j-process')
    const expectedWorkspace = await client.getStageWorkspace('j-process', 'analyze')
    const getJob = vi.mocked(dataClient.getJob)
    const getWorkspace = vi.mocked(dataClient.getStageWorkspace)
    for (const filter of [null, { type: 'research' } as const]) {
      changeScenario('normal')
      await store.applyFilter(filter)
      reads.mockClear()
      getJob.mockClear()
      getWorkspace.mockClear()
      changeScenario('slow')
      const cachedJob = store.currentJob
      const cachedWorkspace = store.currentStageWorkspace
      const refreshing = store.refresh()
      expect(store.detailStatus).toBe('ready')
      expect(store.currentJob).toBe(cachedJob)
      expect(store.currentStageWorkspace).toBe(cachedWorkspace)
      await vi.advanceTimersByTimeAsync(filter === null ? 1500 : 3000)
      expect(store.detailStatus).toBe('ready')
      expect(getJob).toHaveBeenCalledExactlyOnceWith('j-process')
      expect(getWorkspace).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1500)
      expect(store.detailStatus).toBe('ready')
      expect(store.currentJob).toBe(cachedJob)
      await vi.advanceTimersByTimeAsync(1500)
      await expect(refreshing).resolves.toBeUndefined()
      expect(reads.mock.calls).toEqual(filter === null ? [[]] : [[], [filter]])
      expect(getWorkspace).toHaveBeenCalledExactlyOnceWith('j-process', 'analyze')
      expect(store.currentJob).toEqual(expectedJob)
      expect(store.currentStageWorkspace).toEqual(expectedWorkspace)
      expect(store.listStatus).toBe('ready')
      expect(store.detailStatus).toBe('ready')
      expect(store.detailError).toBeNull()
      await vi.advanceTimersByTimeAsync(60000)
      expect(getJob).toHaveBeenCalledTimes(1)
      expect(getWorkspace).toHaveBeenCalledTimes(1)
      expect(vi.getTimerCount()).toBe(0)
    }
  })

  test('createJob uses its existing single refresh to reload the open detail and active filter once', async () => {
    const { client, reads, writes, store } = connection
    await store.ensureJobs()
    await store.applyFilter({ type: 'research' })
    await store.openJob('j-process', 'analyze')
    reads.mockClear()
    vi.mocked(dataClient.getJob).mockClear()
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    const job = await store.createJob(input)
    expect(writes).toHaveBeenCalledExactlyOnceWith(input)
    expect(reads.mock.calls).toEqual([[], [{ type: 'research' }]])
    expect(dataClient.getJob).toHaveBeenCalledExactlyOnceWith('j-process')
    expect(dataClient.getStageWorkspace).toHaveBeenCalledExactlyOnceWith('j-process', 'analyze')
    expect(store.jobs.some(item => item.id === job.id)).toBe(true)
    expect(store.filteredJobs).toEqual(await client.listJobs({ type: 'research' }))
    expect(store.currentJob).toEqual(await client.getJob('j-process'))
    expect(store.currentStageWorkspace).toEqual(await client.getStageWorkspace('j-process', 'analyze'))
  })

  test('a missing open anchor still refreshes as not_found without contaminating successful list reads', async () => {
    const { reads, store } = connection
    await store.openJob('j-process', 'analyze')
    const job = store.currentJob
    const workspace = store.currentStageWorkspace
    await expect(store.openJob('j-missing', 'collect')).resolves.toBeNull()
    vi.mocked(dataClient.getJob).mockClear()
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    await expect(store.refresh()).resolves.toBeUndefined()
    expect(reads.mock.calls).toEqual([[]])
    expect(dataClient.getJob).toHaveBeenCalledExactlyOnceWith('j-missing')
    expect(dataClient.getStageWorkspace).not.toHaveBeenCalled()
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
    expect(store.detailStatus).toBe('error')
    expect(store.detailError).toMatchObject({ code: 'not_found', retryable: false })
    expect(store.currentJob).toBe(job)
    expect(store.currentStageWorkspace).toBe(workspace)
  })

  test('list and detail failures record their own original errors, retain caches and recover independently on refresh', async () => {
    const { reads, store } = connection
    await store.ensureJobs()
    await store.openJob('j-process', 'analyze')
    const list = store.jobs
    const job = store.currentJob
    const workspace = store.currentStageWorkspace
    changeScenario('error')
    reads.mockClear()
    vi.mocked(dataClient.getJob).mockClear()
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    await expect(store.refresh()).resolves.toBeUndefined()
    const listCause = await reads.mock.results[0]!.value.catch((error: unknown) => error)
    const detailCause = await vi.mocked(dataClient.getJob).mock.results[0]!.value.catch((error: unknown) => error)
    expect(store.listStatus).toBe('error')
    expect(listCause).toEqual({ error: store.listError })
    expect(store.listError?.code).toBe('adapter_error')
    expect(store.detailStatus).toBe('error')
    expect(detailCause).toEqual({ error: store.detailError })
    expect(store.detailError?.code).toBe('adapter_error')
    expect(store.listError).not.toBe(store.detailError)
    expect(store.jobs).toBe(list)
    expect(store.currentJob).toBe(job)
    expect(store.currentStageWorkspace).toBe(workspace)
    expect(dataClient.getJob).toHaveBeenCalledExactlyOnceWith('j-process')
    expect(dataClient.getStageWorkspace).not.toHaveBeenCalled()
    changeScenario('normal')
    const retry = store.refresh()
    expect(store.detailStatus).toBe('error')
    await expect(retry).resolves.toBeUndefined()
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
    expect(store.detailStatus).toBe('ready')
    expect(store.detailError).toBeNull()
    expect(dataClient.getStageWorkspace).toHaveBeenCalledExactlyOnceWith('j-process', 'analyze')
  })

  test('a failed list read does not skip a successful detail read or let it clear the list error', async () => {
    const { client, reads, store } = connection
    await store.ensureJobs()
    await store.openJob('j-process', 'analyze')
    changeScenario('error')
    reads.mockImplementationOnce(async (...args) => {
      try {
        return await client.listJobs(...args)
      } finally {
        changeScenario('normal')
      }
    })
    vi.mocked(dataClient.getJob).mockClear()
    vi.mocked(dataClient.getStageWorkspace).mockClear()
    await expect(store.refresh()).resolves.toBeUndefined()
    expect(store.listStatus).toBe('error')
    expect(store.listError?.code).toBe('adapter_error')
    expect(store.detailStatus).toBe('ready')
    expect(store.detailError).toBeNull()
    expect(dataClient.getJob).toHaveBeenCalledExactlyOnceWith('j-process')
    expect(dataClient.getStageWorkspace).toHaveBeenCalledExactlyOnceWith('j-process', 'analyze')
    expect(store.currentJob).toEqual(await client.getJob('j-process'))
  })
})
