import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createMockDataClient, readJobFixtures } from '../../../src/contracts/mock/index.ts'
import * as state from '../../../src/contracts/mock/job-state.ts'
import type { Bootstrap, IntakeInput } from '../../../src/contracts/types.ts'
import { JOBS_KEY, PersistedJobDataSchema } from '../../../src/jobs/persistence.ts'

const sourceNote = { purpose: '合成用途', reliability: 'unknown' as const, publishedAt: null, validUntil: null, scopeNote: '保留口径' }
const input: IntakeInput = { jobId: null, inputKind: 'text', text: 'PRIVATE_POOL_BODY_正文', sourceNote }
const mapping = [{ sourceField: '合成列 1', targetField: '数量', unit: '吨' }]
const invalid = { error: { code: 'validation_error', retryable: false } }
const missing = { error: { code: 'not_found', retryable: false } }
const unavailable = { error: { code: 'adapter_error', retryable: true } }
function clientFor(scenario: Bootstrap['scenario'] = 'normal') {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}
function snapshot() {
  return PersistedJobDataSchema.parse(JSON.parse(localStorage.getItem(JOBS_KEY)!).data)
}
function current() {
  return { job: state.getJob('j-collect'), collect: state.getStageWorkspace('j-collect', 'collect'), pool: state.listUnassignedUploads(), preview: state.getIntakePreview('u-unassigned-file') }
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

describe('WI assign — AC-003-5 partial', () => {
  test.each([false, true])('moves record and preview, appends one ingest without replay; confirmed=%s', async confirm => {
    const client = clientFor()
    const job = (await client.createJob({ title: '合成作业', type: 'adhoc', subject: null, goal: '' })).jobs[0]
    const submitted = await client.submitIntake(input)
    const original = confirm ? await client.confirmIntake(submitted.upload.id, mapping) : submitted
    expect(await client.listUnassignedUploads()).toContainEqual(original.upload)
    const before = snapshot()
    const receipt = await client.assignUpload(original.upload.id, job.id)
    expect(receipt.interventions).toHaveLength(1)
    expect(receipt.interventions[0]).toMatchObject({ jobId: job.id, stage: 'collect', kind: 'ingest', artifactId: `${job.id}-dataset`, baseRev: null, reason: null, outcome: 'recorded', payload: { action: 'ingest', uploadId: original.upload.id, sourceNote } })
    expect(receipt.revisions).toHaveLength(1)
    expect(receipt.revisions[0]).toMatchObject({ number: 1, baseRev: null, uploads: [{ uploadId: original.upload.id, mapping: original.upload.mapping, status: original.upload.status }] })
    expect(receipt.inbox).toEqual({ unread: 0, byStage: { collect: 0, process: 0, analyze: 0, deliver: 0 } })
    expect((await client.listUnassignedUploads()).some(upload => upload.id === original.upload.id)).toBe(false)
    expect(await client.getStageWorkspace(job.id, 'collect')).toMatchObject({ uploads: [{ ...original.upload, jobId: job.id }] })
    expect(await client.getIntakePreview(original.upload.id)).toEqual(original.preview)
    const after = snapshot()
    expect(after.uploads.uploads.some(upload => upload.id === original.upload.id)).toBe(false)
    expect(after.uploads.previews[original.upload.id]).toBeUndefined()
    expect(after.details[job.id].previews[original.upload.id]).toEqual(original.preview)
    expect(after.interventions).toEqual([...before.interventions, ...receipt.interventions])
    expect(after.mappingHistory).toEqual(before.mappingHistory)
    expect(localStorage.getItem(JOBS_KEY)).not.toContain('PRIVATE_POOL_BODY')
    const reloaded = clientFor()
    expect(await reloaded.getIntakePreview(original.upload.id)).toEqual(original.preview)
    expect(await reloaded.getStageWorkspace(job.id, 'collect')).toEqual(await client.getStageWorkspace(job.id, 'collect'))
    await expect(client.assignUpload(original.upload.id, 'j-collect')).rejects.toMatchObject(invalid)
    expect(snapshot()).toEqual(after)
  })
  test('quarantined assignment retains reason, status and source note', async () => {
    const client = clientFor()
    const upload = (await client.listUnassignedUploads()).find(item => item.status === 'quarantined')!
    const before = await client.getStageWorkspace('j-collect', 'collect')
    const receipt = await client.assignUpload(upload.id, 'j-collect')
    expect(receipt.revisions[0].baseRev).toBe(before.artifacts[0].latestMergedRev)
    expect(await client.getStageWorkspace('j-collect', 'collect')).toMatchObject({ uploads: expect.arrayContaining([{ ...upload, jobId: 'j-collect' }]) })
    expect(snapshot().details['j-collect'].collect.revisions.slice(0, -1)).toEqual(before.revisions)
  })
  test('unknown, removed and terminal targets reject with no mutation', async () => {
    const client = clientFor()
    await client.removeUpload('u-unassigned-file', '删除')
    const before = snapshot()
    await expect(client.assignUpload('u-unassigned-quarantine', 'missing')).rejects.toMatchObject(missing)
    await expect(client.assignUpload('missing', 'j-collect')).rejects.toMatchObject(missing)
    await expect(client.assignUpload('u-unassigned-file', 'j-collect')).rejects.toMatchObject(invalid)
    await expect(client.assignUpload('u-unassigned-quarantine', 'j-cancelled')).rejects.toMatchObject(invalid)
    await expect(client.assignUpload('', 'j-collect')).rejects.toMatchObject(invalid)
    expect(snapshot()).toEqual(before)
    await expect(clientFor('job-delivered').assignUpload('u-unassigned-file', 'j-delivered')).rejects.toMatchObject(invalid)
  })
  test.each(['normal', 'empty', 'error', 'slow', 'boot-error', 'job-running', 'job-pending-merge', 'job-conflict', 'job-delivered'] as const)('pool reads obey %s and return copies', async scenario => {
    vi.useFakeTimers()
    const client = clientFor(scenario)
    if (scenario === 'error') {
      await expect(client.listUnassignedUploads()).rejects.toMatchObject(unavailable)
      return
    }
    let done = false
    const request = client.listUnassignedUploads().then(result => { done = true; return result })
    if (scenario === 'slow') {
      await vi.advanceTimersByTimeAsync(1499)
      expect(done).toBe(false)
      await vi.advanceTimersByTimeAsync(1)
    }
    const pool = await request
    expect(pool).toHaveLength(scenario === 'empty' ? 0 : 2)
    if (pool.length) {
      pool[0].sourceNote.purpose = 'caller mutation'
      expect(state.listUnassignedUploads()[0].sourceNote.purpose).not.toBe('caller mutation')
    }
  })
  test('empty session accepts new pool records and assignment to a new job', async () => {
    const client = clientFor('empty')
    const submitted = await client.submitIntake(input)
    const job = (await client.createJob({ title: '空场景', type: 'daily', subject: null, goal: '' })).jobs[0]
    await client.assignUpload(submitted.upload.id, job.id)
    expect(await client.listUnassignedUploads()).toEqual([])
    expect(await client.getStageWorkspace(job.id, 'collect')).toMatchObject({ uploads: [{ ...submitted.upload, jobId: job.id }] })
  })
  test('error writes are atomic; slow assignment waits until 1500ms', async () => {
    const client = clientFor('error')
    const before = current()
    await expect(client.assignUpload('u-unassigned-file', 'j-collect')).rejects.toMatchObject(unavailable)
    await expect(client.assignUpload('u-unassigned-file', 'missing')).rejects.toMatchObject(missing)
    expect(current()).toEqual(before)
    vi.useFakeTimers()
    clientFor('slow')
    const slowBefore = current()
    const request = client.assignUpload('u-unassigned-file', 'j-collect')
    await vi.advanceTimersByTimeAsync(1499)
    expect(current()).toEqual(slowBefore)
    await vi.advanceTimersByTimeAsync(1)
    await request
    expect(state.listUnassignedUploads().some(upload => upload.id === 'u-unassigned-file')).toBe(false)
    expect(state.getStageWorkspace('j-collect', 'collect')).toMatchObject({ uploads: expect.arrayContaining([expect.objectContaining({ id: 'u-unassigned-file', jobId: 'j-collect' })]) })
    expect(state.getIntakePreview('u-unassigned-file')).toEqual(slowBefore.preview)
  })
})

describe('WI removeUpload — AC-007-3 partial', () => {
  test.each([false, true])('tombstones only current projection and preserves original anchors; assigned=%s', async assigned => {
    const client = clientFor()
    const submitted = await client.submitIntake({ ...input, jobId: assigned ? 'j-collect' : null })
    const original = await client.confirmIntake(submitted.upload.id, mapping)
    const before = snapshot()
    const receipt = await client.removeUpload(original.upload.id, '  保留历史，删除当前来源  ')
    const after = snapshot()
    const originalRecords = assigned ? before.details['j-collect'].collect.uploads : before.uploads.uploads
    const records = assigned ? after.details['j-collect'].collect.uploads : after.uploads.uploads
    expect(records.find(upload => upload.id === original.upload.id)).toEqual({ ...originalRecords.find(upload => upload.id === original.upload.id), removed: true })
    expect(after.mappingHistory).toEqual(before.mappingHistory)
    expect(await client.getIntakePreview(original.upload.id)).toEqual(original.preview)
    expect((await client.listUnassignedUploads()).some(upload => upload.id === original.upload.id)).toBe(false)
    if (assigned) {
      expect(receipt.interventions).toHaveLength(1)
      expect(receipt.interventions[0]).toMatchObject({ kind: 'delete', jobId: 'j-collect', stage: 'collect', artifactId: before.details['j-collect'].collect.artifacts[0].id, baseRev: before.details['j-collect'].collect.artifacts[0].latestMergedRev, reason: '保留历史，删除当前来源', payload: { action: 'remove_source', uploadId: original.upload.id, reason: '保留历史，删除当前来源' } })
      expect(after.interventions).toEqual([...before.interventions, ...receipt.interventions])
      const workspace = await client.getStageWorkspace('j-collect', 'collect')
      expect(workspace).toMatchObject({ uploads: expect.not.arrayContaining([expect.objectContaining({ id: original.upload.id })]) })
      expect(workspace.revisions.slice(0, -1)).toEqual(before.details['j-collect'].collect.revisions)
      expect(workspace.revisions.at(-2)).toMatchObject({ uploads: expect.arrayContaining([{ uploadId: original.upload.id, mapping, status: 'ingested' }]) })
      expect(workspace.revisions.at(-1)).toMatchObject({ uploads: expect.not.arrayContaining([expect.objectContaining({ uploadId: original.upload.id })]) })
      expect(after.details['j-collect'].previews).toEqual(before.details['j-collect'].previews)
    } else {
      expect(receipt).toMatchObject({ jobs: [], artifacts: [], revisions: [], interventions: [] })
      expect(after.interventions).toEqual(before.interventions)
      expect(after.uploads.previews).toEqual(before.uploads.previews)
    }
    await expect(client.confirmIntake(original.upload.id, [])).rejects.toMatchObject(invalid)
    expect(await clientFor().getIntakePreview(original.upload.id)).toEqual(original.preview)
    expect(snapshot()).toEqual(after)
  })
  test('invalid reason, unknown anchors and terminal job reject without partial deletion', async () => {
    const client = clientFor()
    const before = current()
    await expect(client.removeUpload('u-unassigned-file', ' \n ')).rejects.toMatchObject(invalid)
    await expect(client.removeUpload('missing', 'reason')).rejects.toMatchObject(missing)
    expect(current()).toEqual(before)
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
    const seeds = readJobFixtures()
    const hidden = seeds['job-detail']['j-delivered'].collect.uploads[0].id
    await expect(client.removeUpload(hidden, 'reason')).rejects.toMatchObject(missing)
    await expect(clientFor('job-delivered').removeUpload(hidden, 'reason')).rejects.toMatchObject(invalid)
  })
  test('error rejects without mutation; slow removal commits after 1500ms', async () => {
    const client = clientFor('error')
    const before = current()
    await expect(client.removeUpload('u-unassigned-file', 'reason')).rejects.toMatchObject(unavailable)
    await expect(client.removeUpload('missing', 'reason')).rejects.toMatchObject(missing)
    expect(current()).toEqual(before)
    vi.useFakeTimers()
    clientFor('slow')
    const slowBefore = current()
    const request = client.removeUpload('u-unassigned-file', 'reason')
    await vi.advanceTimersByTimeAsync(1499)
    expect(current()).toEqual(slowBefore)
    await vi.advanceTimersByTimeAsync(1)
    await request
    expect(state.listUnassignedUploads().some(upload => upload.id === 'u-unassigned-file')).toBe(false)
    expect(state.getIntakePreview('u-unassigned-file')).toEqual(slowBefore.preview)
  })
})

describe('WI cancelJob — AC-002-5 / AC-007-3 partial', () => {
  test.each(['j-collect', 'j-process', 'j-deliver', 'j-failed'])('cancels %s without modifying stages or any workspace snapshot', async id => {
    const client = clientFor()
    const beforeJob = await client.getJob(id)
    const stages = ['collect', 'process', 'analyze', 'deliver'] as const
    const beforeWorkspaces = await Promise.all(stages.map(stage => client.getStageWorkspace(id, stage)))
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-02T03:04:05Z'))
    const receipt = await client.cancelJob(id, '  合成取消原因  ')
    expect(receipt.jobs).toEqual([{ ...beforeJob, status: 'cancelled', reason: '合成取消原因', updatedAt: '2030-01-02T03:04:05.000Z' }])
    expect(receipt.artifacts).toEqual([])
    expect(receipt.revisions).toEqual([])
    expect(receipt.interventions).toEqual([{ id: expect.stringMatching(/^i-/), jobId: id, stage: beforeJob!.currentStage, artifactId: null, baseRev: null, kind: 'delete', payload: { action: 'cancel_job', reason: '合成取消原因' }, reason: '合成取消原因', outcome: 'recorded', createdAt: '2030-01-02T03:04:05.000Z' }])
    expect(await client.getJob(id)).toEqual(receipt.jobs[0])
    expect(await Promise.all(stages.map(stage => client.getStageWorkspace(id, stage)))).toEqual(beforeWorkspaces)
    expect(snapshot().interventions).toContainEqual(receipt.interventions[0])
    expect(await clientFor().getJob(id)).toEqual(receipt.jobs[0])
    const after = snapshot()
    await expect(client.cancelJob(id, 'again')).rejects.toMatchObject(invalid)
    await expect(client.submitIntake({ ...input, jobId: id })).rejects.toMatchObject(invalid)
    await expect(client.assignUpload('u-unassigned-file', id)).rejects.toMatchObject(invalid)
    expect(snapshot()).toEqual(after)
  })
  test.each(['', '  \n ', undefined])('rejects empty/missing reason %j without side effects', async reason => {
    const client = clientFor()
    const before = current()
    await expect(client.cancelJob('j-collect', reason as string)).rejects.toMatchObject(invalid)
    expect(current()).toEqual(before)
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })
  test('unknown and terminal anchors reject; error is atomic and slow waits until 1500ms', async () => {
    const client = clientFor()
    await expect(client.cancelJob('missing', 'reason')).rejects.toMatchObject(missing)
    await expect(client.cancelJob('j-cancelled', 'reason')).rejects.toMatchObject(invalid)
    await expect(clientFor('job-delivered').cancelJob('j-delivered', 'reason')).rejects.toMatchObject(invalid)
    clientFor('error')
    const before = current()
    await expect(client.cancelJob('j-collect', 'reason')).rejects.toMatchObject(unavailable)
    await expect(client.cancelJob('missing', 'reason')).rejects.toMatchObject(missing)
    expect(current()).toEqual(before)
    vi.useFakeTimers()
    clientFor('slow')
    const slowBefore = current()
    const request = client.cancelJob('j-collect', 'reason')
    await vi.advanceTimersByTimeAsync(1499)
    expect(current()).toEqual(slowBefore)
    await vi.advanceTimersByTimeAsync(1)
    await request
    expect(state.getJob('j-collect')).toMatchObject({ status: 'cancelled', reason: 'reason', currentStage: slowBefore.job!.currentStage, stages: slowBefore.job!.stages })
    expect(state.getStageWorkspace('j-collect', 'collect')).toEqual(slowBefore.collect)
  })
})

describe('WI R3-B repeated remove — AC-007-3 partial', () => {
  test.each([true, false])('second removal rejects without changing history or timestamps; assigned=%s', async assigned => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-02T03:04:05Z'))
    const client = clientFor()
    const submitted = await client.submitIntake({ ...input, jobId: assigned ? 'j-collect' : null })
    await client.confirmIntake(submitted.upload.id, mapping)
    const beforeRemoval = await client.getStageWorkspace('j-collect', 'collect')
    const first = await client.removeUpload(submitted.upload.id, '第一次删除')
    const beforeSecond = snapshot()
    const stored = localStorage.getItem(JOBS_KEY)
    const workspace = await client.getStageWorkspace('j-collect', 'collect')
    const job = await client.getJob('j-collect')
    expect(beforeSecond.mappingHistory).toHaveLength(1)
    expect(workspace.revisions.slice(0, beforeRemoval.revisions.length)).toEqual(beforeRemoval.revisions)
    if (assigned) {
      expect(workspace.revisions).toHaveLength(beforeRemoval.revisions.length + 1)
      expect(first.interventions).toHaveLength(1)
      expect(first.interventions[0]).toMatchObject({ kind: 'delete', payload: { action: 'remove_source', uploadId: submitted.upload.id } })
      expect(beforeSecond.interventions).toContainEqual(first.interventions[0])
    } else {
      expect(first.interventions).toEqual([])
      expect(workspace).toEqual(beforeRemoval)
    }
    vi.setSystemTime(new Date('2030-01-02T03:05:05Z'))
    await expect(client.removeUpload(submitted.upload.id, '再次删除')).rejects.toEqual({
      error: { code: 'validation_error', message: '投放已删除。', retryable: false },
    })
    expect(localStorage.getItem(JOBS_KEY)).toBe(stored)
    expect(snapshot()).toEqual(beforeSecond)
    expect(snapshot().interventions).toEqual(beforeSecond.interventions)
    expect(snapshot().mappingHistory).toEqual(beforeSecond.mappingHistory)
    expect(await client.getStageWorkspace('j-collect', 'collect')).toEqual(workspace)
    expect((await client.getJob('j-collect'))!.updatedAt).toBe(job!.updatedAt)
    expect(await client.getIntakePreview(submitted.upload.id)).toEqual(submitted.preview)
    expect(await clientFor().getIntakePreview(submitted.upload.id)).toEqual(submitted.preview)
  })
})
