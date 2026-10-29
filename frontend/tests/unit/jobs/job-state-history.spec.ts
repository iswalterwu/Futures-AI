import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createMockDataClient, readJobFixtures } from '../../../src/contracts/mock/index.ts'
import * as state from '../../../src/contracts/mock/job-state.ts'
import { InterventionSchema, type Bootstrap } from '../../../src/contracts/types.ts'
import { JOBS_KEY } from '../../../src/jobs/persistence.ts'

const sourceNote = { purpose: '介入历史合成样例', reliability: 'medium' as const, publishedAt: null, validUntil: null, scopeNote: null }
const notFound = { error: { code: 'not_found', retryable: false } }
const invalid = { error: { code: 'validation_error', retryable: false } }
const unavailable = { error: { code: 'adapter_error', retryable: true } }

function clientFor(scenario: Bootstrap['scenario'] = 'normal') {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

beforeEach(() => {
  localStorage.clear()
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

describe('WI listInterventions — AC-007-1 partial', () => {
  test('reads only the requested job, with ten fields and stable same-time seed order', async () => {
    const client = clientFor()
    for (const [jobId, ids] of [
      ['j-collect', ['i-seed-1']], ['j-process', ['i-seed-2']],
      ['j-deliver', ['i-seed-4', 'i-seed-5']], ['j-cancelled', []],
    ] as const) {
      const events = await client.listInterventions(jobId)
      expect(events.map(event => event.id)).toEqual(ids)
      for (const event of events) {
        expect(event.jobId).toBe(jobId)
        expect(Object.keys(event).sort()).toEqual(['id', 'jobId', 'stage', 'artifactId', 'baseRev', 'kind', 'payload', 'reason', 'outcome', 'createdAt'].sort())
        expect(InterventionSchema.parse(event)).toEqual(event)
      }
    }
    const deliver = await client.listInterventions('j-deliver')
    expect(deliver.map(event => event.createdAt)).toEqual(['2026-10-28T08:02:00Z', '2026-10-28T08:02:00Z'])
    expect(await client.listInterventions('j-deliver', {})).toEqual(deliver)
    expect((await client.listInterventions('j-process', { stage: 'process', kind: 'approve' })).map(event => event.id)).toEqual(['i-seed-2'])
  })

  test('real ingest and removal are read in time order rather than append order', async () => {
    vi.useFakeTimers()
    const client = clientFor()
    vi.setSystemTime(new Date('2030-01-02T03:04:05Z'))
    const submitted = await client.submitIntake({ jobId: 'j-collect', inputKind: 'text', text: '合成正文', sourceNote })
    vi.setSystemTime(new Date('2025-01-02T03:04:05Z'))
    const removed = await client.removeUpload(submitted.upload.id, '移除合成来源')
    const events = await client.listInterventions('j-collect')
    expect(events.map(event => event.id)).toEqual([removed.interventions[0].id, 'i-seed-1', submitted.interventions[0].id])
    expect(events[0]).toEqual(removed.interventions[0])
    expect(events[2]).toEqual(submitted.interventions[0])
    expect(events[0].payload).toEqual({ action: 'remove_source', uploadId: submitted.upload.id, reason: '移除合成来源' })
    expect(events[2].payload).toEqual({ action: 'ingest', uploadId: submitted.upload.id, sourceNote })
    expect((await client.listInterventions('j-collect', { kind: 'ingest' })).map(event => event.id)).toEqual(['i-seed-1', submitted.interventions[0].id])
    expect(await client.listInterventions('j-collect', { stage: 'process', kind: 'ingest' })).toEqual([])
    for (const event of events) expect(InterventionSchema.parse(event)).toEqual(event)
  })

  test('stage, kind and their intersection filter cross-stage history with handwritten expectations', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-02T03:04:05Z'))
    const client = clientFor()
    const submitted = await client.submitIntake({ jobId: 'j-deliver', inputKind: 'text', text: '合成正文', sourceNote })
    const removed = await client.removeUpload(submitted.upload.id, '删除来源')
    const ingestId = submitted.interventions[0].id
    const removeId = removed.interventions[0].id
    expect((await client.listInterventions('j-deliver')).map(event => event.id)).toEqual(['i-seed-4', 'i-seed-5', ingestId, removeId])
    expect((await client.listInterventions('j-deliver', { stage: 'deliver' })).map(event => event.id)).toEqual(['i-seed-4', 'i-seed-5'])
    expect((await client.listInterventions('j-deliver', { stage: 'collect' })).map(event => event.id)).toEqual([ingestId, removeId])
    expect((await client.listInterventions('j-deliver', { kind: 'framework' })).map(event => event.id)).toEqual(['i-seed-5'])
    expect((await client.listInterventions('j-deliver', { kind: 'delete' })).map(event => event.id)).toEqual([removeId])
    expect((await client.listInterventions('j-deliver', { stage: 'collect', kind: 'ingest' })).map(event => event.id)).toEqual([ingestId])
    expect((await client.listInterventions('j-deliver', { stage: 'deliver', kind: 'rewrite' })).map(event => event.id)).toEqual(['i-seed-4'])
    expect(await client.listInterventions('j-deliver', { stage: 'collect', kind: 'rewrite' })).toEqual([])
    expect(await client.listInterventions('j-deliver', { kind: 'veto' })).toEqual([])
  })

  test('boundary fixture timestamps sort by instant, retaining equal-time record order', async () => {
    const seeds = readJobFixtures()
    const first = seeds.interventions[3]
    const second = seeds.interventions[4]
    window.__FAI_MOCK__ = { jobFixtures: { interventions: [
      { ...first, id: 'later', createdAt: '2026-10-28T03:00:00Z' },
      { ...second, id: 'equal-first', createdAt: '2026-10-28T10:00:00+08:00' },
      { ...first, id: 'equal-second', createdAt: '2026-10-28T02:00:00Z' },
    ] } }
    expect((await clientFor().listInterventions('j-deliver')).map(event => event.id)).toEqual(['equal-first', 'equal-second', 'later'])
  })

  test('nested results are copies and reading or mutating them does not write domain state', async () => {
    const client = clientFor()
    await client.submitIntake({ jobId: 'j-collect', inputKind: 'text', text: '合成正文', sourceNote })
    const stored = localStorage.getItem(JOBS_KEY)
    const job = await client.getJob('j-collect')
    const workspace = await client.getStageWorkspace('j-collect', 'collect')
    const before = await client.listInterventions('j-collect')
    const set = vi.spyOn(localStorage, 'setItem')
    const events = await client.listInterventions('j-collect')
    events[0].reason = 'caller mutation'
    if (events[0].payload.action !== 'ingest') throw new Error('expected ingest seed')
    events[0].payload.sourceNote.purpose = 'caller mutation'
    events.length = 0
    const direct = state.listInterventions('j-collect', undefined)
    if (direct[0].payload.action !== 'ingest') throw new Error('expected ingest seed')
    direct[0].payload.sourceNote.purpose = 'state reader mutation'
    direct.reverse()
    expect(state.listInterventions('j-collect', undefined)).toEqual(before)
    expect(await client.listInterventions('j-collect')).toEqual(before)
    expect(await client.getJob('j-collect')).toEqual(job)
    expect(await client.getStageWorkspace('j-collect', 'collect')).toEqual(workspace)
    expect(localStorage.getItem(JOBS_KEY)).toBe(stored)
    expect(set).not.toHaveBeenCalled()
  })

  test.each(['normal', 'empty'] as const)('unknown job remains not_found in %s', async scenario => {
    await expect(clientFor(scenario).listInterventions('unknown-job')).rejects.toMatchObject(notFound)
  })

  test('empty preset ids return no events; new jobs can acquire readable history', async () => {
    const client = clientFor('empty')
    expect(await client.getJob('j-collect')).toBeNull()
    expect(await client.listInterventions('j-collect')).toEqual([])
    expect(await client.listInterventions('j-deliver', { stage: 'deliver', kind: 'rewrite' })).toEqual([])
    const created = await client.createJob({ title: '空场景合成作业', type: 'adhoc', subject: null, goal: '' })
    const jobId = created.jobs[0].id
    const submitted = await client.submitIntake({ jobId, inputKind: 'text', text: '合成正文', sourceNote })
    expect(await client.listInterventions(jobId)).toEqual(submitted.interventions)
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })

  test('input boundary rejects empty ids, invalid enums and extra filter keys', async () => {
    const client = clientFor()
    await expect(client.listInterventions('')).rejects.toMatchObject(invalid)
    // @ts-expect-error unknown stage exercises the public input boundary
    await expect(client.listInterventions('j-collect', { stage: 'unknown' })).rejects.toMatchObject(invalid)
    // @ts-expect-error unknown kind exercises the public input boundary
    await expect(client.listInterventions('j-collect', { kind: 'unknown' })).rejects.toMatchObject(invalid)
    // @ts-expect-error unknown filter keys must be rejected rather than silently ignored
    await expect(client.listInterventions('j-collect', { title: 'ignored' })).rejects.toMatchObject(invalid)
    // @ts-expect-error filter is optional but not nullable
    await expect(client.listInterventions('j-collect', null)).rejects.toMatchObject(invalid)
  })
})

describe('WI history scenarios — AC-008-2 partial', () => {
  test('error rejects known jobs but preserves unknown-anchor not_found', async () => {
    const client = clientFor('error')
    await expect(client.listInterventions('j-collect')).rejects.toMatchObject(unavailable)
    await expect(client.listInterventions('unknown-job')).rejects.toMatchObject(notFound)
  })

  test('slow waits 1499/1500 ms on every read, including older clients (R2-E)', async () => {
    vi.useFakeTimers()
    const client = clientFor()
    clientFor('slow')
    for (let call = 0; call < 2; call++) {
      let settled = false
      const pending = client.listInterventions('j-deliver').then(events => { settled = true; return events })
      await vi.advanceTimersByTimeAsync(1499)
      expect(settled).toBe(false)
      await vi.advanceTimersByTimeAsync(1)
      expect(settled).toBe(true)
      expect((await pending).map(event => event.id)).toEqual(['i-seed-4', 'i-seed-5'])
    }
  })

  test('all clients follow rebuilt history and scenario while v1 retains its factory scenario (R2-E)', async () => {
    const client = clientFor()
    clientFor('empty')
    expect(await client.listInterventions('j-collect')).toEqual([])
    clientFor('error')
    await expect(client.listInterventions('j-collect')).rejects.toMatchObject(unavailable)
    await expect(client.listInterventions('unknown-job')).rejects.toMatchObject(notFound)
    clientFor('job-running')
    expect((await client.listInterventions('j-running', { stage: 'analyze', kind: 'ask_why' })).map(event => event.id)).toEqual(['i-seed-3'])
    await expect(client.listInterventions('j-collect')).rejects.toMatchObject(notFound)
    expect((await client.bootstrap()).scenario).toBe('normal')
  })
})
