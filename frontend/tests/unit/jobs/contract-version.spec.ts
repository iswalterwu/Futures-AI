import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { BootstrapSchema, CONTRACT_VERSION } from '../../../src/contracts/types.ts'
import { contractSemantics } from '../../../src/contracts/methods.ts'
import { createMockDataClient, jobFixtureSchemas, readJobFixtures, type MockOverrides } from '../../../src/contracts/mock/index.ts'
import jobs from '../../../src/contracts/mock/fixtures/jobs/jobs.json'

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

const scenarios = ['normal', 'empty', 'error', 'slow', 'boot-error', 'job-running', 'job-pending-merge', 'job-conflict', 'job-delivered'] as const

describe('WI scenarios — AC-008-2 / AC-008-4', () => {
  test('version is exactly 2.0.0 and the nine-value enum is closed', () => {
    expect(CONTRACT_VERSION).toBe('2.0.0')
    expect(BootstrapSchema.shape.scenario.options).toEqual(scenarios)
    expect(BootstrapSchema.safeParse({ appVersion: '1', contractVersion: '1.0.0', mode: 'mock', scenario: 'normal' }).success).toBe(false)
  })
  test.each(scenarios)('%s bootstrap uses v2 through the real mock client', async scenario => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', `/?scenario=${scenario}`)
    const client = createMockDataClient()
    if (scenario === 'boot-error') await expect(client.bootstrap()).rejects.toMatchObject({ error: { code: 'internal', retryable: true } })
    const pending = client.bootstrap()
    await vi.advanceTimersByTimeAsync(1500)
    expect(await pending).toMatchObject({ contractVersion: '2.0.0', scenario })
  })
  test('query > env > normal, captured once per client; unknown selections are validation_error', async () => {
    const normal = createMockDataClient()
    expect((await normal.bootstrap()).scenario).toBe('normal')
    vi.stubEnv('VITE_MOCK_SCENARIO', 'job-running')
    expect((await createMockDataClient().bootstrap()).scenario).toBe('job-running')
    window.history.replaceState(null, '', '/?scenario=job-conflict')
    const conflict = createMockDataClient()
    expect((await conflict.bootstrap()).scenario).toBe('job-conflict')
    window.history.replaceState(null, '', '/?scenario=job-delivered')
    expect((await conflict.bootstrap()).scenario).toBe('job-conflict')
    expect((await normal.bootstrap()).scenario).toBe('normal')
    expect((await createMockDataClient().bootstrap()).scenario).toBe('job-delivered')
    for (const query of ['unknown', '']) {
      window.history.replaceState(null, '', `/?scenario=${query}`)
      expect(() => createMockDataClient()).toThrow(expect.objectContaining({ error: expect.objectContaining({ code: 'validation_error', retryable: false }) }))
    }
    window.history.replaceState(null, '', '/')
    vi.stubEnv('VITE_MOCK_SCENARIO', 'unknown')
    expect(() => createMockDataClient()).toThrow(expect.objectContaining({ error: expect.objectContaining({ code: 'validation_error' }) }))
  })
  test.each(scenarios.slice(5))('%s preserves all ten v1 method behaviors', async scenario => {
    const readV1 = (client: ReturnType<typeof createMockDataClient>) => Promise.all([
      client.bootstrap(), client.getModuleCatalog(), client.getDailyBrief(), client.getMarketBoard(), client.getWatchlist(),
      client.getReleaseCalendar('2026-10-27', '2026-10-29'), client.getModuleSummary('positions'), client.getNewsTicker(), client.getSourceStatus(), client.getResearchList(),
    ])
    const original = await readV1(createMockDataClient())
    window.history.replaceState(null, '', `/?scenario=${scenario}`)
    const actual = await readV1(createMockDataClient())
    expect(actual[0]).toEqual({ ...original[0], scenario })
    expect(actual.slice(1)).toEqual(original.slice(1))
  })
})

describe('WI change note — AC-008-4', () => {
  test('generated title, change note and S-19 declaration are present without generator changes', () => {
    const document = readFileSync('contracts/CONTRACT.md', 'utf8')
    expect(document).toContain('v2.0.0')
    expect(document).toContain(contractSemantics.contractChange)
    expect(document).toContain(contractSemantics.jobScenarios)
    for (const text of ['MAJOR', '旧 bootstrap', '可选 jobContext', 'CONTRACT.md §4 所列为 v1 五场景与 fixture 键；job-* 场景及 `window.__FAI_MOCK__.jobFixtures` 以本条为准']) expect(document).toContain(text)
    for (const scenario of scenarios) expect(document).toContain(scenario)
  })
})

describe('WI jobFixtures — AC-008-2 H-6 boundary only (state wiring is T-A10)', () => {
  test('all built-in files pass their actual schemas and reads return independent parsed copies', () => {
    const first = readJobFixtures()
    expect(Object.keys(first).sort()).toEqual(['jobs', 'job-detail', 'deliverable', 'interventions', 'uploads'].sort())
    for (const [key, schema] of Object.entries(jobFixtureSchemas)) expect(schema.parse(first[key as keyof typeof first])).toEqual(first[key as keyof typeof first])
    first.jobs.normal[0].title = 'changed copy'
    expect(readJobFixtures().jobs.normal[0].title).toBe(jobs.normal[0].title)
  })
  test('whole-file replacement supports original normal + one extra job, leaving other files built in', () => {
    const builtin = readJobFixtures()
    const replacement = { ...jobs, normal: [...jobs.normal, { ...jobs.normal[0], id: 'j-extra', title: '新增合成样例' }] }
    window.__FAI_MOCK__ = { jobFixtures: { jobs: replacement } }
    const parsed = readJobFixtures()
    expect(parsed.jobs).toEqual(replacement)
    expect(parsed['job-detail']).toEqual(builtin['job-detail'])
    expect(parsed.deliverable).toEqual(builtin.deliverable)
    expect(parsed.interventions).toEqual(builtin.interventions)
    expect(parsed.uploads).toEqual(builtin.uploads)
    expect(parsed['job-detail']['j-extra']).toBeUndefined() // A10 supplies an empty workspace, not this parser.
  })
  test('only delivered/cancelled collection replaces normal; record files are not deep merged', () => {
    const cancelled = jobs.normal.find(job => job.id === 'j-cancelled')!
    const replacement = { ...jobs, normal: [...jobs['job-delivered'], cancelled] }
    window.__FAI_MOCK__ = { jobFixtures: { jobs: replacement, 'job-detail': {}, deliverable: {}, interventions: [], uploads: { uploads: [], previews: {} } } }
    expect(readJobFixtures()).toEqual({ jobs: replacement, 'job-detail': {}, deliverable: {}, interventions: [], uploads: { uploads: [], previews: {} } })
  })
  test('one boundary read captures overrides; later mutation does not mutate the parsed seed', () => {
    let reads = 0
    const replacement = { ...jobs, normal: [jobs.normal[0]] }
    window.__FAI_MOCK__ = { get jobFixtures() { reads += 1; return { jobs: replacement } } }
    const seed = readJobFixtures()
    expect(reads).toBe(1)
    replacement.normal = []
    expect(seed.jobs.normal).toHaveLength(1)
    expect(readJobFixtures().jobs.normal).toEqual([])
    expect(reads).toBe(2)
  })
  test.each([
    null, [], { unknown: [] }, { jobs: { normal: [] } }, { jobs: [] }, { jobs: undefined },
    { 'job-detail': { invalid: {} } }, { deliverable: { invalid: {} } },
    { interventions: [{ kind: 'unknown' }] }, { uploads: { uploads: [{ text: 'private body' }], previews: {} } },
  ])('invalid override %# is validation_error rather than silently merged or ignored', override => {
    window.__FAI_MOCK__ = { jobFixtures: override } as MockOverrides
    expect(() => readJobFixtures()).toThrow(expect.objectContaining({ error: expect.objectContaining({ code: 'validation_error', retryable: false }) }))
  })
})
