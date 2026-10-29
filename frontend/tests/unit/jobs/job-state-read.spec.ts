import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { Bootstrap, Stage, StageWorkspace } from '../../../src/contracts/types.ts'
import { createMockDataClient, type MockOverrides } from '../../../src/contracts/mock/index.ts'
import { commit } from '../../../src/contracts/mock/job-state.ts'
import jobs from '../../../src/contracts/mock/fixtures/jobs/jobs.json'
import details from '../../../src/contracts/mock/fixtures/jobs/job-detail.json'
import deliveries from '../../../src/contracts/mock/fixtures/jobs/deliverable.json'

const normalIds = ['j-cancelled', 'j-failed', 'j-deliver', 'j-process', 'j-collect']
const scenarios = ['normal', 'empty', 'error', 'slow', 'boot-error', 'job-running', 'job-pending-merge', 'job-conflict', 'job-delivered'] as const
const stages = ['collect', 'process', 'analyze', 'deliver'] as const
const empty: Record<Stage, StageWorkspace> = {
  collect: { stage: 'collect', uploads: [], artifacts: [], revisions: [] },
  process: { stage: 'process', sources: [], series: [], artifacts: [], revisions: [], derivedValues: [] },
  analyze: { stage: 'analyze', artifacts: [], revisions: [] },
  deliver: { stage: 'deliver', artifacts: [], revisions: [], deliverable: null, finalSnapshot: null },
}
const notFound = { error: { code: 'not_found', retryable: false } }
const invalid = { error: { code: 'validation_error', retryable: false } }
const adapterError = { error: { code: 'adapter_error', retryable: true } }

function clientFor(scenario: Bootstrap['scenario'] = 'normal') {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

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

describe('WI listJobs — AC-001-2 partial', () => {
  test('default order, each filter, combinations, no match and clearing', async () => {
    const client = clientFor()
    expect((await client.listJobs()).map(job => job.id)).toEqual(normalIds)
    expect((await client.listJobs({ status: 'processing' })).map(job => job.id)).toEqual(['j-process'])
    expect((await client.listJobs({ type: 'daily' })).map(job => job.id)).toEqual(['j-failed', 'j-collect'])
    expect((await client.listJobs({ title: 'j-pro' })).map(job => job.id)).toEqual(['j-process'])
    expect((await client.listJobs({ status: 'failed', type: 'daily', title: '合成油品' })).map(job => job.id)).toEqual(['j-failed'])
    expect(await client.listJobs({ status: 'failed', type: 'research', title: '合成油品' })).toEqual([])
    expect(await client.listJobs({ title: 'J-PRO' })).toEqual([])
    expect(await client.listJobs({ title: 'not a title' })).toEqual([])
    for (const filter of [undefined, {}, { title: '' }]) {
      const list = await client.listJobs(filter)
      expect(list.map(job => job.id)).toEqual(normalIds)
      expect(Object.keys(list[0]).sort()).toEqual(['id', 'title', 'type', 'subject', 'status', 'currentStage', 'updatedAt', 'reason', 'stages', 'pendingCount'].sort())
    }
  })
  test('sorting uses instants rather than lexical offset representations', async () => {
    window.__FAI_MOCK__ = { jobFixtures: { jobs: { ...jobs, normal: [
      { ...jobs.normal[0], updatedAt: '2026-10-28T10:00:00+08:00' },
      { ...jobs.normal[1], updatedAt: '2026-10-28T03:00:00Z' },
    ] } } }
    expect((await clientFor().listJobs()).map(job => job.id)).toEqual(['j-process', 'j-collect'])
  })
})

describe('WI scenarios read — AC-001-4 / AC-004-5 / AC-005-6 partial', () => {
  test('normal details and every stage return their actual snapshots, independently of currentStage', async () => {
    const client = clientFor()
    expect(await client.getJob('j-process')).toEqual(jobs.normal[1])
    for (const stage of stages) {
      expect(await client.getStageWorkspace('j-deliver', stage)).toEqual(stage === 'deliver' ? deliveries['j-deliver'] : details['j-deliver'][stage])
    }
    expect((await client.getJob('j-failed'))?.reason).toBeTruthy()
    expect((await client.getJob('j-cancelled'))?.reason).toBeTruthy()
  })
  test('empty initializes the list and preset workspaces once, not on each read', async () => {
    const client = clientFor('empty')
    expect(await client.listJobs()).toEqual([])
    expect(await client.listJobs({ type: 'daily' })).toEqual([])
    for (const id of normalIds) {
      expect(await client.getJob(id)).toBeNull()
      for (const stage of stages) expect(await client.getStageWorkspace(id, stage)).toEqual(empty[stage])
    }
    // Exercise the real transaction entry, not an extra createJob/test injection API.
    commit(working => { working.jobs.push({ ...jobs.normal[0], id: 'new-in-empty' } as typeof working.jobs[number]) })
    expect((await client.listJobs()).map(job => job.id)).toEqual(['new-in-empty'])
    expect(await client.getJob('new-in-empty')).toMatchObject({ id: 'new-in-empty' })
    expect(await client.getStageWorkspace('new-in-empty', 'collect')).toEqual(empty.collect)
  })
  test('error rejects all three known-target reads while bootstrap/catalog remain available', async () => {
    const client = clientFor('error')
    await expect(client.listJobs()).rejects.toMatchObject(adapterError)
    await expect(client.getJob('j-collect')).rejects.toMatchObject(adapterError)
    for (const stage of stages) await expect(client.getStageWorkspace('j-collect', stage)).rejects.toMatchObject(adapterError)
    expect(await client.bootstrap()).toMatchObject({ scenario: 'error', contractVersion: '2.0.0' })
    expect(await client.getModuleCatalog()).toHaveLength(7)
  })
  test.each(scenarios)('%s unknown anchors independently return not_found', async scenario => {
    vi.useFakeTimers()
    const client = clientFor(scenario)
    const checks = [
      expect(client.getJob('unknown-job')).rejects.toMatchObject(notFound),
      ...stages.map(stage => expect(client.getStageWorkspace('unknown-job', stage)).rejects.toMatchObject(notFound)),
    ]
    await vi.advanceTimersByTimeAsync(1500)
    await Promise.all(checks)
  })
  test('boot-error fails bootstrap once without blocking new business reads', async () => {
    const client = clientFor('boot-error')
    expect((await client.listJobs()).map(job => job.id)).toEqual(normalIds)
    await expect(client.bootstrap()).rejects.toMatchObject({ error: { code: 'internal', retryable: true } })
    expect(await client.getJob('j-collect')).toEqual(jobs.normal[0])
    expect(await client.getStageWorkspace('j-deliver', 'deliver')).toEqual(deliveries['j-deliver'])
    expect(await client.bootstrap()).toMatchObject({ scenario: 'boot-error' })
  })
  test.each([
    ['job-running', ['j-human', 'j-running']],
    ['job-pending-merge', ['j-merge']],
    ['job-conflict', ['j-conflict']],
    ['job-delivered', ['j-delivered']],
  ] as const)('%s uses only its dedicated collection with real stage contents', async (scenario, ids) => {
    const client = clientFor(scenario)
    expect((await client.listJobs()).map(job => job.id)).toEqual(ids)
    for (const id of ids) {
      expect(await client.getJob(id)).toEqual(jobs[scenario].find(job => job.id === id))
      for (const stage of stages) {
        expect(await client.getStageWorkspace(id, stage)).toEqual(stage === 'deliver' ? deliveries[id] : details[id][stage])
      }
    }
    await expect(client.getJob('j-collect')).rejects.toMatchObject(notFound)
    await expect(client.getStageWorkspace('j-collect', 'collect')).rejects.toMatchObject(notFound)
  })
  test('jobFixtures is read once at creation; all clients follow the rebuilt current job state', async () => {
    let reads = 0
    const replacement = { ...jobs, normal: [...jobs.normal, { ...jobs.normal[0], id: 'j-extra', title: '新增合成样例' }] }
    window.__FAI_MOCK__ = { get jobFixtures() { reads++; return { jobs: replacement } } }
    const first = clientFor()
    expect(reads).toBe(1)
    expect((await first.listJobs()).map(job => job.id)).toEqual([...normalIds, 'j-extra'])
    for (const stage of stages) expect(await first.getStageWorkspace('j-extra', stage)).toEqual(empty[stage])
    replacement.normal = []
    window.history.replaceState(null, '', '/?scenario=empty')
    expect(await first.getJob('j-extra')).toMatchObject({ title: '新增合成样例' })
    expect(await first.listJobs()).toHaveLength(6)
    expect(reads).toBe(1)
    const second = clientFor('normal')
    expect(reads).toBe(2)
    expect(await first.listJobs()).toEqual([])
    expect(await second.listJobs()).toEqual([])
    await expect(first.getJob('j-extra')).rejects.toMatchObject(notFound)
    delete window.__FAI_MOCK__
    const third = clientFor('job-running')
    expect((await first.listJobs()).map(job => job.id)).toEqual(['j-human', 'j-running'])
    expect(await second.getJob('j-human')).toEqual(await third.getJob('j-human'))
    // New methods share current state; v1 factory-captured behavior remains unchanged.
    expect((await first.bootstrap()).scenario).toBe('normal')
    expect((await third.bootstrap()).scenario).toBe('job-running')
    clientFor('error')
    await expect(first.listJobs()).rejects.toMatchObject(adapterError)
  })
  test('whole-file overrides replace rather than merge records; omitted files keep built-ins', async () => {
    window.__FAI_MOCK__ = { jobFixtures: { jobs: { ...jobs, normal: [...jobs['job-delivered'], jobs.normal[4]] }, 'job-detail': {}, deliverable: {} } }
    const client = clientFor()
    expect((await client.listJobs()).map(job => job.id)).toEqual(['j-delivered', 'j-cancelled'])
    expect(await client.getJob('j-delivered')).toEqual(jobs['job-delivered'][0])
    for (const stage of stages) expect(await client.getStageWorkspace('j-delivered', stage)).toEqual(empty[stage])
    await expect(client.getJob('j-collect')).rejects.toMatchObject(notFound)
    // Even a not_started stage may carry revisions; reads must not derive emptiness from its state.
    window.__FAI_MOCK__ = { jobFixtures: { jobs: { ...jobs, normal: [{ ...jobs.normal[2], stages: jobs.normal[4].stages }] } } }
    expect(await clientFor().getStageWorkspace('j-deliver', 'deliver')).toEqual(deliveries['j-deliver'])
  })
  test.each([
    null, [], { unknown: [] }, { jobs: { normal: [] } }, { jobs: [] }, { jobs: undefined },
    { 'job-detail': { invalid: {} } }, { deliverable: { invalid: {} } },
    { interventions: [{ kind: 'unknown' }] }, { uploads: { uploads: [{ text: 'private body' }], previews: {} } },
  ])('invalid seed override %# is rejected at factory boundary without replacing current state', async override => {
    const client = clientFor()
    window.__FAI_MOCK__ = { jobFixtures: override } as MockOverrides
    expect(() => createMockDataClient()).toThrow(expect.objectContaining({
      error: expect.objectContaining({ ...invalid.error, message: expect.any(String) }),
    }))
    expect((await client.listJobs()).map(job => job.id)).toEqual(normalIds)
  })
  test('method input boundaries reject malformed filter, job id and stage', async () => {
    const client = clientFor()
    // @ts-expect-error invalid public input exercises the runtime boundary
    await expect(client.listJobs({ status: 'unknown' })).rejects.toMatchObject(invalid)
    // @ts-expect-error invalid public input exercises the runtime boundary
    await expect(client.listJobs({ type: 'unknown' })).rejects.toMatchObject(invalid)
    // @ts-expect-error invalid public input exercises the runtime boundary
    await expect(client.listJobs({ title: 123 })).rejects.toMatchObject(invalid)
    // @ts-expect-error unknown filter keys must not silently drop the user's condition
    await expect(client.listJobs({ query: 'ignored' })).rejects.toMatchObject(invalid)
    await expect(client.getJob('')).rejects.toMatchObject(invalid)
    await expect(client.getStageWorkspace('', 'collect')).rejects.toMatchObject(invalid)
    // @ts-expect-error invalid public input exercises the runtime boundary
    await expect(client.getStageWorkspace('j-collect', 'unknown')).rejects.toMatchObject(invalid)
  })
  test('list, detail, workspace, revision and final snapshot reads do not expose mutable state', async () => {
    const client = clientFor()
    const list = await client.listJobs()
    list[0].title = 'mutated'
    list[0].stages[0].pendingCount = 100
    list.pop()
    expect((await client.listJobs()).map(job => job.id)).toEqual(normalIds)
    expect((await client.listJobs())[0]).toMatchObject({ title: jobs.normal[4].title, stages: jobs.normal[4].stages })
    const job = (await client.getJob('j-deliver'))!
    job.stages[0].state = 'conflict'
    job.goal = 'mutated'
    expect(await client.getJob('j-deliver')).toEqual(jobs.normal[2])
    const workspace = await client.getStageWorkspace('j-deliver', 'deliver')
    if (workspace.stage !== 'deliver') throw new Error('expected deliver workspace')
    workspace.revisions[0].blocks[0].comments.length = 0
    workspace.deliverable!.blocks.length = 0
    expect(await client.getStageWorkspace('j-deliver', 'deliver')).toEqual(deliveries['j-deliver'])
    clientFor('job-delivered')
    const final = await client.getStageWorkspace('j-delivered', 'deliver')
    if (final.stage !== 'deliver') throw new Error('expected deliver workspace')
    final.finalSnapshot!.blocks.length = 0
    expect(await client.getStageWorkspace('j-delivered', 'deliver')).toEqual(deliveries['j-delivered'])
  })
  test('real commit replaces atomically and does not retain the mutator working reference', async () => {
    const client = clientFor()
    const before = await client.getJob('j-collect')
    expect(() => commit(working => { working.jobs[0].title = 'partial'; throw new Error('mutator failed') })).toThrow('mutator failed')
    expect(await client.getJob('j-collect')).toEqual(before)
    expect(() => commit(working => { working.jobs[0].title = '' })).toThrow()
    expect(await client.getJob('j-collect')).toEqual(before)
    let retained: Parameters<Parameters<typeof commit>[0]>[0] | undefined
    commit(working => { working.jobs[0].title = 'committed'; retained = working })
    retained!.jobs[0].title = 'late mutation'
    expect(await client.getJob('j-collect')).toMatchObject({ title: 'committed' })
    expect((await client.listJobs({ title: 'committed' })).map(job => job.id)).toEqual(['j-collect'])
    expect((await clientFor().getJob('j-collect'))).toEqual(before)
  })
  test('this batch stays entirely in memory in every scenario, including overrides', async () => {
    vi.useFakeTimers()
    const get = vi.spyOn(Storage.prototype, 'getItem')
    const set = vi.spyOn(Storage.prototype, 'setItem')
    const remove = vi.spyOn(Storage.prototype, 'removeItem')
    const clear = vi.spyOn(Storage.prototype, 'clear')
    for (const scenario of scenarios) {
      const client = clientFor(scenario)
      const result = client.listJobs().catch(error => error)
      await vi.advanceTimersByTimeAsync(1500)
      await result
    }
    window.__FAI_MOCK__ = { jobFixtures: { jobs } }
    await clientFor().listJobs()
    expect(get).not.toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
    expect(clear).not.toHaveBeenCalled()
  })
})

describe('WI slow — AC-008-2 partial', () => {
  test.each(['list', 'job', 'workspace'] as const)('%s delays every call until 1500ms, including calls from older clients', async method => {
    vi.useFakeTimers()
    const client = clientFor()
    clientFor('slow')
    for (let call = 0; call < 2; call++) {
      let settled = false
      const pending = (method === 'list' ? client.listJobs()
        : method === 'job' ? client.getJob('j-deliver') : client.getStageWorkspace('j-deliver', 'deliver'))
        .then(result => { settled = true; return result })
      await vi.advanceTimersByTimeAsync(1499)
      expect(settled).toBe(false)
      await vi.advanceTimersByTimeAsync(1)
      expect(settled).toBe(true)
      const result = await pending
      if (method === 'list') expect(result).toHaveLength(5)
      else expect(result).toEqual(method === 'job' ? jobs.normal[2] : deliveries['j-deliver'])
    }
  })
})

test('WI not-started seeds read — twelve empty seeds plus unchanged started content (S-37)', async () => {
  // Handwritten plan rows, not computed from fixture stage states.
  const expected = [
    ['normal', 'j-collect', ['running', 'not_started', 'not_started', 'not_started']],
    ['normal', 'j-process', ['done', 'running', 'not_started', 'not_started']],
    ['normal', 'j-deliver', ['done', 'done', 'done', 'running']],
    ['normal', 'j-failed', ['done', 'done', 'conflict', 'not_started']],
    ['normal', 'j-cancelled', ['not_started', 'not_started', 'not_started', 'not_started']],
    ['job-running', 'j-running', ['done', 'done', 'running', 'not_started']],
    ['job-running', 'j-human', ['done', 'needs_human', 'running', 'not_started']],
    ['job-pending-merge', 'j-merge', ['done', 'done', 'done', 'running']],
    ['job-conflict', 'j-conflict', ['done', 'done', 'conflict', 'running']],
    ['job-delivered', 'j-delivered', ['done', 'done', 'done', 'done']],
  ] as const
  let count = 0
  for (const [scenario, id, states] of expected) {
    const client = clientFor(scenario)
    for (const [index, stage] of stages.entries()) {
      if (states[index] !== 'not_started') continue
      expect(await client.getStageWorkspace(id, stage)).toEqual(empty[stage])
      count++
    }
  }
  expect(count).toBe(12)
  const client = clientFor()
  const collect = await client.getStageWorkspace('j-collect', 'collect')
  expect(collect).toEqual(details['j-collect'].collect)
  if (collect.stage !== 'collect') throw new Error('expected collect workspace')
  expect(collect.uploads).toHaveLength(2)
  const deliver = await client.getStageWorkspace('j-deliver', 'deliver')
  expect(deliver).toEqual(deliveries['j-deliver'])
  if (deliver.stage !== 'deliver') throw new Error('expected deliver workspace')
  expect(deliver.deliverable!.blocks.map(block => block.type)).toEqual(['conclusion', 'chart', 'table', 'quote', 'verification', 'note'])
})
