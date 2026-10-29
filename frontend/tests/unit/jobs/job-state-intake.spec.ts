import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createMockDataClient, readJobFixtures } from '../../../src/contracts/mock/index.ts'
import * as state from '../../../src/contracts/mock/job-state.ts'
import { CreateJobInputSchema, IntakeReceiptSchema, type Bootstrap, type CreateJobInput, type IntakeInput, type FieldMapping } from '../../../src/contracts/types.ts'
import { JOBS_KEY, PersistedJobDataSchema } from '../../../src/jobs/persistence.ts'

const sourceNote = { purpose: '合成用途', reliability: 'high' as const, publishedAt: '2026-10-01', validUntil: '2026-11-01', scopeNote: '合成口径' }
const createInput: CreateJobInput = { title: '  合成研究  ', type: 'research', subject: '  油品  ', goal: '目标\n第二行' }
const mapping: FieldMapping = [{ sourceField: '合成列 1', targetField: '数量', unit: '吨' }]
const invalid = { error: { code: 'validation_error', retryable: false } }
const missing = { error: { code: 'not_found', retryable: false } }
const unavailable = { error: { code: 'adapter_error', retryable: true } }
const textInput = (jobId: string | null = null): IntakeInput => ({ jobId, inputKind: 'text', text: 'PRIVATE_SYNTHETIC_BODY_不持久化', sourceNote })
function clientFor(scenario: Bootstrap['scenario'] = 'normal') {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}
function snapshot() {
  return PersistedJobDataSchema.parse(JSON.parse(localStorage.getItem(JOBS_KEY)!).data)
}
function current() {
  return { jobs: state.listJobs(undefined), collect: state.getStageWorkspace('j-collect', 'collect'), deliver: state.getStageWorkspace('j-collect', 'deliver'), preview: state.getIntakePreview('u-unassigned-file') }
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

describe('WI createJob — AC-001-3 partial', () => {
  test.each(['normal', 'empty', 'job-delivered'] as const)('creates only an empty draft deliverable in %s and returns isolated receipts', async scenario => {
    const client = clientFor(scenario)
    const receipt = await client.createJob(createInput)
    const job = receipt.jobs[0]
    expect(job.id).toMatch(/^j-/)
    expect(job).toMatchObject({ title: '合成研究', type: 'research', subject: '油品', goal: '目标\n第二行', createdBy: 'human', status: 'collecting', currentStage: 'collect', parentJobId: null, reason: null, pendingCount: 0 })
    expect(job.stages).toEqual([
      { stage: 'collect', state: 'running', pendingCount: 0 }, { stage: 'process', state: 'not_started', pendingCount: 0 },
      { stage: 'analyze', state: 'not_started', pendingCount: 0 }, { stage: 'deliver', state: 'not_started', pendingCount: 0 },
    ])
    expect(await client.getJob(job.id)).toEqual(job)
    expect(receipt.inbox).toEqual({ unread: 0, byStage: { collect: 0, process: 0, analyze: 0, deliver: 0 } })
    expect(receipt.interventions).toEqual([])
    expect(receipt.artifacts).toHaveLength(1)
    expect(receipt.artifacts[0]).toMatchObject({ id: `${job.id}-deliverable`, kind: 'deliverable', status: 'draft', source: 'human', origin: 'derived', latestMergedRev: `${job.id}-deliverable-r1`, pendingMerge: false, overlayRev: null, pendingRunId: null })
    expect(receipt.revisions[0]).toMatchObject({ id: `${job.id}-deliverable-r1`, number: 1, baseRev: null, author: 'human', blocks: [] })
    for (const stage of ['collect', 'process', 'analyze'] as const) {
      expect(await client.getStageWorkspace(job.id, stage)).toMatchObject({ stage, artifacts: [], revisions: [] })
    }
    expect(await client.getStageWorkspace(job.id, 'deliver')).toMatchObject({ finalSnapshot: null, deliverable: { jobId: job.id, blocks: [], deliverableStatus: 'draft', finalSnapshotId: null, finalRevisionNumber: null, finalizedAt: null } })
    receipt.jobs[0].title = 'caller mutation'
    receipt.revisions[0].summary = 'caller mutation'
    expect((await client.getJob(job.id))?.title).toBe('合成研究')
    expect((await client.getStageWorkspace(job.id, 'deliver')).revisions[0].summary).not.toBe('caller mutation')
  })
  test.each([{ title: '' }, { title: ' \n ' }, { title: undefined }, { type: 'bad' }, { type: undefined }, { subject: '  ' }, { extra: true }])('rejects invalid input without side effects: %j', async patch => {
    const client = clientFor()
    const before = current()
    const input = { ...createInput, ...patch }
    expect(CreateJobInputSchema.safeParse(input).success).toBe(false)
    await expect(client.createJob(input as CreateJobInput)).rejects.toMatchObject(invalid)
    expect(current()).toEqual(before)
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })
  test('nullable subject and empty goal are accepted and restored', async () => {
    const receipt = await clientFor().createJob({ ...createInput, subject: null, goal: '' })
    expect(await clientFor().getJob(receipt.jobs[0].id)).toEqual(receipt.jobs[0])
  })
})

describe('WI confirm — AC-003-4 / AC-003-6 partial', () => {
  test('only confirmation ingests; assigned mapping keeps old revision, original preview and exact event anchors', async () => {
    const client = clientFor()
    const job = (await client.createJob(createInput)).jobs[0]
    const submitted = await client.submitIntake(textInput(job.id))
    const id = submitted.upload.id
    expect(IntakeReceiptSchema.safeParse(submitted).success).toBe(true)
    expect(submitted.upload.status).toBe('pending_validation')
    expect(submitted.interventions[0]).toMatchObject({ kind: 'ingest', jobId: job.id, stage: 'collect', artifactId: `${job.id}-dataset`, baseRev: null, reason: null, outcome: 'recorded', payload: { action: 'ingest', uploadId: id, sourceNote } })
    const oldWorkspace = await client.getStageWorkspace(job.id, 'collect')
    const confirmed = await client.confirmIntake(id, mapping)
    expect(confirmed.upload).toEqual({ ...submitted.upload, mapping, status: 'ingested' })
    expect(confirmed.preview).toEqual(submitted.preview)
    expect(confirmed.interventions).toHaveLength(1)
    expect(confirmed.interventions[0]).toMatchObject({ kind: 'map_fix', artifactId: `${job.id}-dataset`, baseRev: submitted.revisions[0].id, payload: { action: 'map_fix', uploadId: id, mapping } })
    const workspace = await client.getStageWorkspace(job.id, 'collect')
    expect(workspace.revisions.slice(0, -1)).toEqual(oldWorkspace.revisions)
    expect(workspace.revisions.at(-1)).toMatchObject({ number: 2, baseRev: submitted.revisions[0].id, uploads: [{ uploadId: id, mapping, status: 'ingested' }] })
    expect(snapshot().mappingHistory).toEqual([{ uploadId: id, mapping: submitted.upload.mapping, status: 'pending_validation', replacedAt: confirmed.interventions[0].createdAt }])
    const before = snapshot()
    await expect(client.confirmIntake(id, [])).rejects.toMatchObject(invalid)
    expect(snapshot()).toEqual(before)
    expect((await client.getJob(job.id))?.status).toBe('collecting')
    confirmed.upload.mapping[0].unit = 'caller mutation'
    expect(await client.getIntakePreview(id)).toEqual(submitted.preview)
    expect(snapshot().details[job.id].collect.uploads[0].mapping).toEqual(mapping)
  })
  test('unassigned confirmation retains mapping history without inventing job events, and survives reload', async () => {
    const client = clientFor()
    const submitted = await client.submitIntake(textInput())
    const events = snapshot().interventions
    const confirmed = await client.confirmIntake(submitted.upload.id, mapping)
    expect(confirmed).toMatchObject({ jobs: [], artifacts: [], revisions: [], interventions: [], upload: { jobId: null, status: 'ingested', mapping } })
    expect(snapshot().interventions).toEqual(events)
    expect(snapshot().mappingHistory).toEqual([{ uploadId: submitted.upload.id, mapping: submitted.upload.mapping, status: 'pending_validation', replacedAt: expect.any(String) }])
    expect(await clientFor().getIntakePreview(submitted.upload.id)).toEqual(submitted.preview)
    await expect(client.confirmIntake(submitted.upload.id, mapping)).rejects.toMatchObject(invalid)
    expect(snapshot().mappingHistory).toHaveLength(1)
  })
  test.each([false, true])('fixture reason alone decides quarantine; assigned=%s', async assigned => {
    const seeds = readJobFixtures()
    const upload = assigned ? seeds['job-detail']['j-collect'].collect.uploads[0] : seeds.uploads.uploads[0]
    upload.status = 'pending_validation'
    upload.quarantineReason = '合成隔离原因：需补证'
    window.__FAI_MOCK__ = { jobFixtures: assigned ? { 'job-detail': seeds['job-detail'] } : { uploads: seeds.uploads } }
    const result = await clientFor().confirmIntake(upload.id, mapping)
    expect(result.upload).toMatchObject({ status: 'quarantined', quarantineReason: upload.quarantineReason, sourceNote: upload.sourceNote })
    expect(result.interventions).toHaveLength(assigned ? 1 : 0)
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })
  test('removed input and terminal jobs reject; unknown and hidden fixture uploads are not_found', async () => {
    const seeds = readJobFixtures()
    seeds.uploads.uploads[0].removed = true
    window.__FAI_MOCK__ = { jobFixtures: { uploads: seeds.uploads } }
    const client = clientFor()
    await expect(client.confirmIntake(seeds.uploads.uploads[0].id, mapping)).rejects.toMatchObject(invalid)
    for (const id of ['unknown', seeds['job-detail']['j-delivered'].collect.uploads[0].id]) {
      await expect(client.confirmIntake(id, mapping)).rejects.toMatchObject(missing)
      await expect(client.getIntakePreview(id)).rejects.toMatchObject(missing)
    }
    const delivered = clientFor('job-delivered')
    await expect(delivered.submitIntake(textInput('j-delivered'))).rejects.toMatchObject(invalid)
    await expect(delivered.confirmIntake(seeds['job-detail']['j-delivered'].collect.uploads[0].id, mapping)).rejects.toMatchObject(invalid)
    await expect(clientFor().submitIntake(textInput('j-cancelled'))).rejects.toMatchObject(invalid)
  })
})

describe('WI intake validation — AC-003-2 / AC-003-3 partial', () => {
  test.each(['file', 'url', 'text'] as const)('stores only %s metadata and five source fields; no heuristics or body', async inputKind => {
    const client = clientFor()
    const input: IntakeInput = inputKind === 'file' ? { jobId: 'j-collect', inputKind, fileMeta: { name: 'quarantine-隔离.pdf', size: 12, type: 'application/pdf', lastModified: 0 }, sourceNote }
      : inputKind === 'url' ? { jobId: 'j-collect', inputKind, url: 'https://example.invalid/quarantine', sourceNote }
        : textInput('j-collect')
    const receipt = await client.submitIntake(input)
    expect(receipt.preview).toEqual({ detectedType: { file: '合成文件预览（未解析正文）', url: '合成链接预览（未抓取）', text: '合成文本预览（正文不保存）' }[inputKind], fields: [{ sourceField: '合成列 1', targetField: '待映射', unit: '待确认' }], unit: null, timeRange: null })
    expect(receipt.upload).toMatchObject({ inputKind, jobId: 'j-collect', sourceNote, status: 'pending_validation', removed: false, mapping: receipt.preview.fields })
    expect(receipt.interventions[0].payload).toEqual({ action: 'ingest', uploadId: receipt.upload.id, sourceNote })
    expect(Object.keys(receipt.upload).sort()).toEqual(['id', 'jobId', 'inputKind', 'sourceNote', 'status', 'mapping', 'createdAt', 'removed', ...(inputKind === 'file' ? ['fileMeta'] : inputKind === 'url' ? ['url'] : [])].sort())
    expect(localStorage.getItem(JOBS_KEY)).not.toContain('PRIVATE_SYNTHETIC_BODY')
    const stored = snapshot().details['j-collect'].collect.uploads.find(upload => upload.id === receipt.upload.id)
    expect(stored).toEqual(receipt.upload)
    expect((await client.confirmIntake(receipt.upload.id, mapping)).upload.status).toBe('ingested')
    expect(await clientFor().getIntakePreview(receipt.upload.id)).toEqual(receipt.preview)
  })
  test.each([
    { ...textInput(), sourceNote: { ...sourceNote, purpose: '  ' } },
    { jobId: null, inputKind: 'file', fileMeta: { name: 'no.exe', size: 1, type: '', lastModified: 0 }, sourceNote },
    { ...textInput(), quarantineReason: 'user switch forbidden' },
    { ...textInput(), text: '' },
    { ...textInput(), sourceNote: { ...sourceNote, reliability: 'bad' } },
    { ...textInput(), sourceNote: { ...sourceNote, publishedAt: 'not-a-date' } },
  ])('invalid input has no side effects: %j', async input => {
    const client = clientFor()
    const before = current()
    await expect(client.submitIntake(input as IntakeInput)).rejects.toMatchObject(invalid)
    expect(current()).toEqual(before)
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })
  test('invalid mapping and unknown job leave pending upload untouched', async () => {
    const client = clientFor()
    const submitted = await client.submitIntake(textInput('j-collect'))
    const before = snapshot()
    await expect(client.confirmIntake(submitted.upload.id, [{ sourceField: 'x', targetField: '', unit: '吨' }])).rejects.toMatchObject(invalid)
    await expect(client.submitIntake(textInput('missing'))).rejects.toMatchObject(missing)
    expect(snapshot()).toEqual(before)
  })
})

describe('WI scenario writes — AC-008-2 partial', () => {
  test('error rejects each write after validation without publishing partial state; unknown anchors stay not_found', async () => {
    const client = clientFor('error')
    const before = current()
    const assignedId = readJobFixtures()['job-detail']['j-collect'].collect.uploads[0].id
    for (const write of [() => client.createJob(createInput), () => client.submitIntake(textInput('j-collect')), () => client.submitIntake(textInput()), () => client.confirmIntake(assignedId, mapping)]) {
      await expect(write()).rejects.toMatchObject(unavailable)
      expect(current()).toEqual(before)
    }
    await expect(client.submitIntake(textInput('missing'))).rejects.toMatchObject(missing)
    await expect(client.confirmIntake('missing', mapping)).rejects.toMatchObject(missing)
    await expect(client.getIntakePreview('missing')).rejects.toMatchObject(missing)
    await expect(client.getIntakePreview('u-unassigned-file')).rejects.toMatchObject(unavailable)
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })
  test.each(['create', 'submit', 'confirm'] as const)('slow %s commits at 1500ms, not 1499ms, following current shared scenario', async action => {
    vi.useFakeTimers()
    const client = clientFor()
    clientFor('slow') // Old client must use current shared scenario, not its factory closure.
    const before = current()
    const assignedId = readJobFixtures()['job-detail']['j-collect'].collect.uploads[0].id
    const request = action === 'create' ? client.createJob(createInput)
      : action === 'submit' ? client.submitIntake(textInput('j-collect'))
        : client.confirmIntake(assignedId, mapping)
    let done = false
    void request.then(() => { done = true })
    await vi.advanceTimersByTimeAsync(1499)
    expect(done).toBe(false)
    expect(current()).toEqual(before)
    await vi.advanceTimersByTimeAsync(1)
    const receipt = await request
    expect(done).toBe(true)
    if (action === 'create') expect(state.listJobs(undefined)).toHaveLength(before.jobs.length + 1)
    else if (action === 'submit') expect(state.getStageWorkspace('j-collect', 'collect').revisions).toHaveLength(before.collect.revisions.length + 1)
    else {
      expect(receipt).toMatchObject({ upload: { status: 'ingested', mapping } })
      expect(state.getStageWorkspace('j-collect', 'collect')).toMatchObject({ uploads: expect.arrayContaining([expect.objectContaining({ id: assignedId, status: 'ingested', mapping })]) })
    }
    expect(localStorage.getItem(JOBS_KEY)).toBeNull()
  })
  test('slow preview read waits, returns a copy, and empty accepts new uploads', async () => {
    const empty = clientFor('empty')
    await expect(empty.getIntakePreview('u-unassigned-file')).rejects.toMatchObject(missing)
    const submitted = await empty.submitIntake(textInput())
    expect(await empty.getIntakePreview(submitted.upload.id)).toEqual(submitted.preview)
    vi.useFakeTimers()
    const slow = clientFor('slow')
    let done = false
    const request = slow.getIntakePreview('u-unassigned-file').then(result => { done = true; return result })
    await vi.advanceTimersByTimeAsync(1499)
    expect(done).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    const preview = await request
    preview.detectedType = 'caller mutation'
    expect(state.getIntakePreview('u-unassigned-file').detectedType).not.toBe('caller mutation')
  })
})
