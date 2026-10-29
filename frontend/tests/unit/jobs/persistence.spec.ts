import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createMockDataClient } from '../../../src/contracts/mock/index.ts'
import { commit, getJob, getJobScenario } from '../../../src/contracts/mock/job-state.ts'
import type { Bootstrap } from '../../../src/contracts/types.ts'
import {
  getPersistenceStatus, INBOX_KEY, JOBS_KEY, loadJobsSnapshot,
  onPersistenceStatus, saveJobsSnapshot,
} from '../../../src/jobs/persistence.ts'
import jobs from '../../../src/contracts/mock/fixtures/jobs/jobs.json'
import details from '../../../src/contracts/mock/fixtures/jobs/job-detail.json'
import deliveries from '../../../src/contracts/mock/fixtures/jobs/deliverable.json'
import uploads from '../../../src/contracts/mock/fixtures/jobs/uploads.json'
import interventions from '../../../src/contracts/mock/fixtures/jobs/interventions.json'

function clientFor(scenario: Bootstrap['scenario'] = 'normal') {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

beforeEach(() => {
  // happy-dom binds Storage methods onto a proxy; use a fresh real Storage per test
  // so bound spies cannot survive Vitest's prototype restoration between cases.
  vi.stubGlobal('localStorage', new Storage())
  localStorage.clear()
  delete window.__FAI_MOCK__
  vi.stubEnv('VITE_MOCK_SCENARIO', undefined)
})
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  delete window.__FAI_MOCK__
  window.history.replaceState(null, '', '/')
})

describe('WI whitelist — persistence boundary and normal initialization', () => {
  test('commit saves once after replacement; new client restores the complete business subset', async () => {
    const client = clientFor()
    const set = vi.spyOn(localStorage, 'setItem')
    commit(state => { state.jobs[0].goal = '合成的本地目标' })
    expect(set).toHaveBeenCalledTimes(1)
    expect(getPersistenceStatus()).toBe('ok')
    const raw = localStorage.getItem(JOBS_KEY)!
    const snapshot = JSON.parse(raw)
    expect(Object.keys(snapshot).sort()).toEqual(['data', 'version'])
    expect(snapshot.version).toBe(1)
    expect(Object.keys(snapshot.data).sort()).toEqual(['jobs', 'details', 'deliverables', 'interventions', 'uploads', 'mappingHistory'].sort())
    expect(snapshot.data.mappingHistory).toEqual([])
    expect(snapshot.data.details).toEqual(details)
    expect(snapshot.data.deliverables).toEqual(deliveries)
    expect(snapshot.data.interventions).toEqual(interventions)
    expect(snapshot.data.uploads).toEqual(uploads)
    const restored = clientFor()
    expect(await restored.getJob('j-collect')).toEqual(await client.getJob('j-collect'))
    expect(await restored.getJob('j-collect')).toMatchObject({ goal: '合成的本地目标' })
    expect(await restored.getStageWorkspace('j-deliver', 'deliver')).toEqual(deliveries['j-deliver'])
    expect(localStorage.getItem(JOBS_KEY)).toBe(raw)
  })

  test('Upload keys are whitelisted for all three kinds and quarantineReason survives restore', () => {
    clientFor()
    commit(() => {})
    const data = loadJobsSnapshot()!
    const allUploads = [...data.uploads.uploads, ...Object.values(data.details).flatMap(detail => detail.collect.uploads)]
    expect(new Set(allUploads.map(upload => upload.inputKind))).toEqual(new Set(['file', 'url', 'text']))
    for (const upload of allUploads) {
      const keys = ['id', 'jobId', 'inputKind', 'sourceNote', 'mapping', 'status', 'createdAt', 'removed']
      if (upload.inputKind === 'file') {
        keys.push('fileMeta')
        expect(Object.keys(upload.fileMeta).sort()).toEqual(['lastModified', 'name', 'size', 'type'])
      }
      if (upload.inputKind === 'url') keys.push('url')
      if (upload.quarantineReason !== undefined) keys.push('quarantineReason')
      expect(Object.keys(upload).sort()).toEqual(keys.sort())
    }
    const quarantine = data.uploads.uploads.find(upload => upload.id === 'u-unassigned-quarantine')!
    expect(quarantine.quarantineReason).toBeTruthy()
    clientFor()
    commit(() => {})
    expect(loadJobsSnapshot()!.uploads.uploads.find(upload => upload.id === quarantine.id)).toEqual(quarantine)
  })

  test('strict Upload commit boundary rejects original text, File, bytes and complete input', () => {
    clientFor()
    commit(() => {})
    const before = localStorage.getItem(JOBS_KEY)
    const set = vi.spyOn(localStorage, 'setItem')
    for (const extra of [
      { text: '合成原文，不应持久化' },
      { file: new File(['synthetic body'], 'sample.md') },
      { bytes: new Uint8Array([1, 2, 3]) },
      { input: { inputKind: 'text', text: 'synthetic body' } },
    ]) {
      expect(() => commit(state => { Object.assign(state.uploads.uploads[0], extra) })).toThrow()
    }
    expect(set).not.toHaveBeenCalled()
    expect(localStorage.getItem(JOBS_KEY)).toBe(before)
  })

  test('save projects business fields rather than dumping runtime controls', () => {
    clientFor()
    commit(() => {})
    const data = loadJobsSnapshot()!
    saveJobsSnapshot({ ...data, ...{ scenario: 'error', emptyJobIds: ['runtime'], runs: ['runtime'] } })
    expect(JSON.parse(localStorage.getItem(JOBS_KEY)!).data).toEqual(data)
  })

  test('version 1 without optional mappingHistory defaults once on the snapshot boundary', () => {
    clientFor()
    commit(() => {})
    const snapshot = JSON.parse(localStorage.getItem(JOBS_KEY)!)
    delete snapshot.data.mappingHistory
    localStorage.setItem(JOBS_KEY, JSON.stringify(snapshot))
    clientFor()
    commit(() => {})
    expect(getPersistenceStatus()).toBe('ok')
    expect(JSON.parse(localStorage.getItem(JOBS_KEY)!).data.mappingHistory).toEqual([])
  })

  test('factory builds typed seed state before storage hydration; override getter is read once even for undefined', async () => {
    let reads = 0
    window.__FAI_MOCK__ = { get jobFixtures() { reads++; return reads === 1 ? undefined : {} } }
    const originalGet = localStorage.getItem.bind(localStorage)
    const get = vi.spyOn(localStorage, 'getItem').mockImplementation(key => {
      expect(getJobScenario()).toBe('normal')
      expect(getJob('j-collect')).toEqual(jobs.normal[0])
      return originalGet(key)
    })
    const client = clientFor()
    expect(reads).toBe(1)
    expect(get).toHaveBeenCalledExactlyOnceWith(JOBS_KEY)
    await client.getJob('j-collect')
    await client.resetMockData()
    expect(reads).toBe(1)
    expect(get).toHaveBeenCalledTimes(1)
  })
})

describe('WI degrade — successful memory commits retain last successful snapshot', () => {
  test('UTF-8 limit accepts exactly 512 KiB, rejects one extra byte and multibyte text, then recovers', async () => {
    const client = clientFor()
    commit(state => { state.jobs[0].goal = '' })
    const baseBytes = new TextEncoder().encode(localStorage.getItem(JOBS_KEY)!).byteLength
    const room = 512 * 1024 - baseBytes
    expect(room).toBeGreaterThan(0)
    commit(state => { state.jobs[0].goal = 'a'.repeat(room) })
    const last = localStorage.getItem(JOBS_KEY)!
    expect(new TextEncoder().encode(last).byteLength).toBe(512 * 1024)
    expect(getPersistenceStatus()).toBe('ok')
    const set = vi.spyOn(localStorage, 'setItem')
    const remove = vi.spyOn(localStorage, 'removeItem')
    const longGoals = ['a'.repeat(room + 1), '汉'.repeat(Math.floor(room / 3) + 1)]
    for (const goal of longGoals) {
      expect(() => commit(state => { state.jobs[0].goal = goal })).not.toThrow()
      expect(getPersistenceStatus()).toBe('degraded')
      expect((await client.getJob('j-collect'))!.goal).toBe(goal)
      expect(localStorage.getItem(JOBS_KEY)).toBe(last)
    }
    expect(set).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
    commit(state => { state.jobs[0].goal = 'short again' })
    expect(set).toHaveBeenCalledTimes(1)
    expect(getPersistenceStatus()).toBe('ok')
    expect((await clientFor().getJob('j-collect'))!.goal).toBe('short again')
  })

  test('quota exception is not a business failure; each later commit retries and status notifications are synchronous', async () => {
    const client = clientFor()
    commit(() => {})
    const before = localStorage.getItem(JOBS_KEY)
    const notifications: string[] = []
    const unsubscribe = onPersistenceStatus(status => { notifications.push(status) })
    const originalSet = localStorage.setItem.bind(localStorage)
    const set = vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new DOMException('Synthetic quota', 'QuotaExceededError') })
    const remove = vi.spyOn(localStorage, 'removeItem')
    expect(() => commit(state => { state.jobs[0].goal = 'memory success' })).not.toThrow()
    expect(notifications).toEqual(['degraded'])
    expect((await client.getJob('j-collect'))!.goal).toBe('memory success')
    commit(state => { state.jobs[0].goal = 'retry' })
    expect(set).toHaveBeenCalledTimes(2)
    expect(notifications).toEqual(['degraded'])
    expect(localStorage.getItem(JOBS_KEY)).toBe(before)
    expect(remove).not.toHaveBeenCalled()
    set.mockImplementation(originalSet)
    commit(state => { state.jobs[0].goal = 'persisted again' })
    expect(notifications).toEqual(['degraded', 'ok'])
    unsubscribe()
    commit(state => { state.jobs[0].goal = 'a'.repeat(512 * 1024) })
    expect(getPersistenceStatus()).toBe('degraded')
    expect(notifications).toEqual(['degraded', 'ok'])
    expect((await clientFor().getJob('j-collect'))!.goal).toBe('persisted again')
  })

  test('reset still rebuilds memory when its new snapshot hits quota', async () => {
    const client = clientFor()
    commit(state => { state.jobs[0].goal = 'changed' })
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new DOMException('Synthetic quota', 'QuotaExceededError') })
    await expect(client.resetMockData()).resolves.toBeNull()
    expect(await client.getJob('j-collect')).toEqual(jobs.normal[0])
    expect(getPersistenceStatus()).toBe('degraded')
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })
})

describe('WI corrupt — unreadable key stays untouched until explicit reset (S-40)', () => {
  test.each(['{bad json', JSON.stringify({ version: 2, data: {} }), JSON.stringify({ version: 1, data: {} })])('fallback preserves invalid snapshot %# until reset', async raw => {
    localStorage.setItem(JOBS_KEY, raw)
    localStorage.setItem(INBOX_KEY, JSON.stringify(['old-read']))
    const set = vi.spyOn(localStorage, 'setItem')
    const remove = vi.spyOn(localStorage, 'removeItem')
    const client = clientFor()
    expect(getPersistenceStatus()).toBe('unreadable')
    expect(await client.getJob('j-collect')).toEqual(jobs.normal[0])
    commit(state => { state.jobs[0].goal = 'memory while unreadable' })
    commit(state => { state.jobs[0].goal = 'a'.repeat(512 * 1024) })
    expect(getPersistenceStatus()).toBe('unreadable')
    expect(localStorage.getItem(JOBS_KEY)).toBe(raw)
    expect(set).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
    await expect(client.resetMockData()).resolves.toBeNull()
    expect(remove.mock.calls).toEqual([[JOBS_KEY], [INBOX_KEY]])
    expect(set).toHaveBeenCalledTimes(1)
    expect(getPersistenceStatus()).toBe('ok')
    expect(await client.getJob('j-collect')).toEqual(jobs.normal[0])
    expect(JSON.parse(localStorage.getItem(JOBS_KEY)!).data.jobs).toEqual(jobs.normal)
    expect(localStorage.getItem(INBOX_KEY)).toBeNull()
    expect(await clientFor().getJob('j-collect')).toEqual(jobs.normal[0])
  })

  test('snapshot schema rejects extra runtime and original-text fields without silently deleting them', () => {
    clientFor()
    commit(() => {})
    const snapshot = JSON.parse(localStorage.getItem(JOBS_KEY)!)
    for (const modify of [
      () => ({ ...snapshot, data: { ...snapshot.data, scenario: 'normal' } }),
      () => ({ ...snapshot, data: { ...snapshot.data, uploads: { ...snapshot.data.uploads, uploads: [{ ...snapshot.data.uploads.uploads[0], text: 'synthetic original' }] } } }),
    ]) {
      const raw = JSON.stringify(modify())
      localStorage.setItem(JOBS_KEY, raw)
      clientFor()
      expect(getPersistenceStatus()).toBe('unreadable')
      commit(() => {})
      expect(localStorage.getItem(JOBS_KEY)).toBe(raw)
    }
  })
})

describe('WI non-normal — session ownership and zero storage access', () => {
  test.each(['empty', 'error', 'slow', 'boot-error', 'job-running', 'job-pending-merge', 'job-conflict', 'job-delivered'] as const)('%s never gets, sets or removes either key, including reset from an old client', async scenario => {
    vi.useFakeTimers()
    const oldClient = clientFor()
    commit(state => { state.jobs[0].goal = 'keep normal snapshot' })
    localStorage.setItem(INBOX_KEY, JSON.stringify(['keep-read']))
    const before = localStorage.getItem(JOBS_KEY)
    const get = vi.spyOn(localStorage, 'getItem')
    const set = vi.spyOn(localStorage, 'setItem')
    const remove = vi.spyOn(localStorage, 'removeItem')
    const clear = vi.spyOn(localStorage, 'clear')
    const current = clientFor(scenario)
    commit(state => { if (state.jobs[0]) state.jobs[0].goal = 'memory edit' })
    const reset = oldClient.resetMockData()
    await vi.advanceTimersByTimeAsync(1500)
    await expect(reset).resolves.toBeNull()
    expect(getJobScenario()).toBe(scenario)
    expect(getPersistenceStatus()).toBe('ok')
    const read = current.listJobs().catch(error => error)
    await vi.advanceTimersByTimeAsync(1500)
    if (scenario === 'error') expect(await read).toMatchObject({ error: { code: 'adapter_error' } })
    else if (scenario === 'empty') expect(await read).toEqual([])
    else expect((await read).length).toBeGreaterThan(0)
    expect(get).not.toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
    expect(clear).not.toHaveBeenCalled()
    get.mockRestore()
    expect(localStorage.getItem(JOBS_KEY)).toBe(before)
    expect(localStorage.getItem(INBOX_KEY)).toBe(JSON.stringify(['keep-read']))
  })

  test.each([{}, { jobs }])('normal override %# stays memory-only and reset uses captured parsed seeds, not the getter or old factory', async override => {
    const oldClient = clientFor('job-delivered')
    let reads = 0
    window.__FAI_MOCK__ = { get jobFixtures() { reads++; return override } }
    const get = vi.spyOn(localStorage, 'getItem')
    const set = vi.spyOn(localStorage, 'setItem')
    const remove = vi.spyOn(localStorage, 'removeItem')
    const current = clientFor()
    expect(reads).toBe(1)
    window.__FAI_MOCK__ = { get jobFixtures(): never { throw new Error('must not reread') } }
    commit(state => { state.jobs[0].goal = 'changed' })
    await oldClient.resetMockData()
    expect(await current.getJob('j-collect')).toEqual(jobs.normal[0])
    expect(getJobScenario()).toBe('normal')
    expect(reads).toBe(1)
    expect(get).not.toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
  })

  test('reset uses current custom seed copy even if the original override later mutates', async () => {
    const oldClient = clientFor()
    const replacement = { ...jobs, normal: [{ ...jobs.normal[0], id: 'custom-seed', goal: 'seed goal' }] }
    window.__FAI_MOCK__ = { jobFixtures: { jobs: replacement } }
    const current = clientFor()
    replacement.normal[0].goal = 'late override mutation'
    commit(state => { state.jobs[0].goal = 'business mutation' })
    await oldClient.resetMockData()
    expect(await current.getJob('custom-seed')).toMatchObject({ goal: 'seed goal' })
    expect(await current.listJobs()).toHaveLength(1)
  })

  test('slow reset changes nothing at 1499ms, resets at 1500ms using the current scenario', async () => {
    vi.useFakeTimers()
    const oldClient = clientFor()
    clientFor('slow')
    commit(state => { state.jobs[0].goal = 'before reset' })
    let settled = false
    const reset = oldClient.resetMockData().then(result => { settled = true; return result })
    await vi.advanceTimersByTimeAsync(1499)
    expect(settled).toBe(false)
    expect(getJob('j-collect')!.goal).toBe('before reset')
    await vi.advanceTimersByTimeAsync(1)
    await expect(reset).resolves.toBeNull()
    expect(settled).toBe(true)
    expect(getJob('j-collect')).toEqual(jobs.normal[0])
  })

  test('switching to memory-only clears persistence status; normal reset preserves unrelated keys', async () => {
    for (const key of ['fai.rail', 'fai.drawer', 'fai.layout']) localStorage.setItem(key, `keep ${key}`)
    localStorage.setItem(JOBS_KEY, 'bad snapshot')
    clientFor()
    expect(getPersistenceStatus()).toBe('unreadable')
    clientFor('boot-error')
    expect(getPersistenceStatus()).toBe('ok')
    expect(localStorage.getItem(JOBS_KEY)).toBe('bad snapshot')
    const client = clientFor()
    expect(getPersistenceStatus()).toBe('unreadable')
    localStorage.setItem(INBOX_KEY, JSON.stringify(['old-read']))
    await client.resetMockData()
    for (const key of ['fai.rail', 'fai.drawer', 'fai.layout']) expect(localStorage.getItem(key)).toBe(`keep ${key}`)
    expect(localStorage.getItem(INBOX_KEY)).toBeNull()
    expect(getPersistenceStatus()).toBe('ok')
  })
})
