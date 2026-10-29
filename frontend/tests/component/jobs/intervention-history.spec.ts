import { config, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import { router as appRouter } from '../../../src/app/router.ts'
import { dataClient } from '../../../src/contracts/index.ts'
import { createMockDataClient } from '../../../src/contracts/mock/index.ts'
import { InterventionKindSchema, ReliabilityLabel, StageLabel, type Bootstrap, type Intervention, type SourceNote } from '../../../src/contracts/types.ts'
import InterventionHistory from '../../../src/jobs/components/InterventionHistory.vue'
import { registerJobRoutes } from '../../../src/jobs/routes.ts'
import { useJobsStore } from '../../../src/jobs/stores/jobs.ts'
import EmptyState from '../../../src/shared/components/EmptyState.vue'
import ErrorState from '../../../src/shared/components/ErrorState.vue'
import Loading from '../../../src/shared/components/Loading.vue'

let pinia: ReturnType<typeof createPinia>
let router: ReturnType<typeof createRouter>
enableAutoUnmount(afterEach)
beforeEach(async () => {
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  vi.stubEnv('VITE_MOCK_SCENARIO', undefined)
  pinia = createPinia()
  setActivePinia(pinia)
  config.global.plugins = [pinia]
  router = createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes })
  registerJobRoutes(router, pinia)
  await navigator.clipboard.writeText('')
})
afterEach(() => {
  disposePinia(pinia)
  vi.restoreAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
})

function changeScenario(scenario: Bootstrap['scenario']) {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

function connect() {
  const client = changeScenario('normal')
  const history = vi.spyOn(dataClient, 'listInterventions').mockImplementation((...args) => client.listInterventions(...args))
  const reads = vi.spyOn(dataClient, 'getJob').mockImplementation((...args) => client.getJob(...args))
  const workspaces = vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  const lists = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  vi.spyOn(dataClient, 'submitIntake').mockImplementation((...args) => client.submitIntake(...args))
  return { client, history, reads, workspaces, lists, store: useJobsStore(pinia) }
}

async function mountDetail(id = 'j-deliver', stage = 'deliver') {
  await router.push(`/jobs/${id}/${stage}`)
  const wrapper = mount({ render: () => h(RouterView) }, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

const sourceNote: SourceNote = {
  purpose: '验证新增来源', reliability: 'unknown', publishedAt: null, validUntil: null, scopeNote: null,
}

describe('WI AC-007-1', () => {
  test('renders all ten fields and preserves the real equal-time seed order', async () => {
    const { client, history } = connect()
    const expected = await client.listInterventions('j-deliver')
    expect(expected.map(event => event.id)).toEqual(['i-seed-4', 'i-seed-5'])
    expect(expected[0]!.createdAt).toBe(expected[1]!.createdAt)
    const wrapper = await mountDetail()
    const sidebar = wrapper.getComponent(InterventionHistory)
    expect(sidebar.element.tagName).toBe('ASIDE')
    expect(sidebar.attributes('aria-label')).toBe('介入历史')
    expect(history).not.toHaveBeenCalled()
    expect(sidebar.get('button').attributes('aria-expanded')).toBe('false')
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(history).toHaveBeenCalledExactlyOnceWith('j-deliver', {})
    const rows = sidebar.findAll('[data-intervention-id]')
    expect(rows.map(row => row.attributes('data-intervention-id'))).toEqual(expected.map(event => event.id))
    for (const [index, event] of expected.entries()) {
      const row = rows[index]!
      expect(row.get('time').attributes('datetime')).toBe(event.createdAt)
      expect(row.get('time').text()).toBe(event.createdAt)
      expect(row.get('p').text()).toBe(`${StageLabel[event.stage].text} · ${event.kind} · ${event.outcome}`)
      row.get('details').element.open = true
      await row.get('details').trigger('toggle')
      expect(row.findAll('dt').map(item => item.text())).toEqual(['id', 'jobId', 'artifactId', 'baseRev', 'reason', 'payload · action'])
      expect(row.findAll('dd').map(item => item.text())).toEqual([
        event.id, event.jobId, event.artifactId, event.baseRev, '无', event.payload.action,
      ])
    }
  })

  test('passes stage, kind and combined filters to the API and renders its actual result, including empty and clear', async () => {
    const { client, history } = connect()
    const wrapper = await mountDetail()
    const sidebar = wrapper.getComponent(InterventionHistory)
    await sidebar.get('button').trigger('click')
    await flushPromises()
    const stage = sidebar.get('select[aria-label="按阶段筛选"]')
    const kind = sidebar.get('select[aria-label="按类型筛选"]')
    expect(stage.findAll('option').map(option => option.text())).toEqual(['全部', ...Object.values(StageLabel).map(label => label.text)])
    expect(kind.findAll('option').map(option => option.text())).toEqual(['全部', ...InterventionKindSchema.options])
    for (const [stageValue, kindValue, filter] of [
      ['deliver', '', { stage: 'deliver' }],
      ['deliver', 'framework', { stage: 'deliver', kind: 'framework' }],
      ['collect', 'framework', { stage: 'collect', kind: 'framework' }],
      ['', 'framework', { kind: 'framework' }],
      ['', '', {}],
    ] as const) {
      await stage.setValue(stageValue)
      await kind.setValue(kindValue)
      await flushPromises()
      const expected = await client.listInterventions('j-deliver', filter)
      expect(history).toHaveBeenLastCalledWith('j-deliver', filter)
      expect(sidebar.findAll('[data-intervention-id]').map(row => row.attributes('data-intervention-id'))).toEqual(expected.map(event => event.id))
      if (expected.length === 0) expect(sidebar.getComponent(EmptyState).text()).toBe('暂无介入记录。')
    }
  })

  test('ingest shows the five source fields and explicit unknown/null labels; map_fix and remove show typed summaries', async () => {
    const { client } = connect()
    const receipt = await client.submitIntake({ jobId: 'j-collect', inputKind: 'text', text: '合成材料', sourceNote })
    await client.confirmIntake(receipt.upload.id, [{ sourceField: '原列', targetField: '库存', unit: '吨' }])
    await client.removeUpload(receipt.upload.id, '来源已失效')
    const expected = await client.listInterventions('j-collect')
    const wrapper = await mountDetail('j-collect', 'collect')
    const sidebar = wrapper.getComponent(InterventionHistory)
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(sidebar.findAll('[data-intervention-id]').map(row => row.attributes('data-intervention-id'))).toEqual(expected.map(event => event.id))
    const seed = sidebar.get('[data-intervention-id="i-seed-1"]')
    expect(seed.findAll('dd').slice(6).map(item => item.text())).toEqual(['对照合成库存口径', ReliabilityLabel.medium.text, '2026-10-27', '2026-11-03', '全为合成数据，不读取真实材料。'])
    const added = sidebar.get(`[data-intervention-id="${receipt.interventions[0]!.id}"]`)
    expect(added.findAll('dd').slice(6).map(item => item.text())).toEqual(['验证新增来源', ReliabilityLabel.unknown.text, '未知', '未知', '无'])
    expect(sidebar.text()).toContain('原列 → 库存 · 吨')
    expect(sidebar.text()).toContain('动作理由来源已失效')
  })

  test('cancel_job displays null artifact/revision and the reason from a real write', async () => {
    const { client } = connect()
    const receipt = await client.cancelJob('j-collect', '研究计划调整')
    const wrapper = await mountDetail('j-collect', 'collect')
    const sidebar = wrapper.getComponent(InterventionHistory)
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(sidebar.get(`[data-intervention-id="${receipt.interventions[0]!.id}"]`).findAll('dd').map(item => item.text())).toEqual([
      receipt.interventions[0]!.id, 'j-collect', '无', '无', '研究计划调整', 'cancel_job', '研究计划调整',
    ])
  })

  test.each(['delete_conclusion', 'veto'] as const)('renders the %s reason from the typed fixture boundary', async action => {
    const event: Intervention = {
      id: 'i-reason', jobId: 'j-deliver', stage: 'analyze', artifactId: null, baseRev: null,
      kind: action === 'veto' ? 'veto' : 'delete', payload: { action, conclusionId: 'c-example', reason: '证据不足' },
      reason: '证据不足', outcome: 'recorded', createdAt: '2026-10-28T08:02:00Z',
    }
    window.__FAI_MOCK__ = { jobFixtures: { interventions: [event] } }
    connect()
    const wrapper = await mountDetail()
    const sidebar = wrapper.getComponent(InterventionHistory)
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(sidebar.get('[data-intervention-id="i-reason"]').findAll('dd').map(item => item.text())).toEqual([
      'i-reason', 'j-deliver', '无', '无', '证据不足', action, '证据不足',
    ])
  })

  test('has local slow loading and empty states without extra list/detail reads', async () => {
    vi.useFakeTimers()
    const { history, reads, lists } = connect()
    const wrapper = await mountDetail()
    const sidebar = wrapper.getComponent(InterventionHistory)
    changeScenario('slow')
    await sidebar.get('button').trigger('click')
    expect(sidebar.findComponent(Loading).exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(1500)
    await flushPromises()
    expect(sidebar.findComponent(Loading).exists()).toBe(false)
    expect(sidebar.findAll('[data-intervention-id]')).toHaveLength(2)
    await sidebar.get('button').trigger('click')
    changeScenario('empty')
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(sidebar.getComponent(EmptyState).text()).toBe('暂无介入记录。')
    expect(history).toHaveBeenCalledTimes(2)
    expect(reads).toHaveBeenCalledTimes(1)
    expect(lists).not.toHaveBeenCalled()
  })

  test('catches read errors, copies original diagnostics and retries the same API/filter', async () => {
    const { history, reads, lists } = connect()
    const wrapper = await mountDetail()
    const sidebar = wrapper.getComponent(InterventionHistory)
    changeScenario('error')
    await sidebar.get('button').trigger('click')
    await flushPromises()
    const original = await history.mock.results[0]!.value.catch((cause: unknown) => cause)
    const error = sidebar.getComponent(ErrorState)
    expect(error.props('error')).toEqual(original.error)
    const diagnostic = error.get('code').text()
    expect(JSON.parse(diagnostic)).toEqual({ moduleId: 'intervention-history', ...{ code: original.error.code, message: original.error.message }, ts: expect.any(String) })
    await error.findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(await navigator.clipboard.readText()).toBe(diagnostic)
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(history.mock.calls).toEqual([['j-deliver', {}], ['j-deliver', {}]])
    expect(sidebar.findComponent(ErrorState).exists()).toBe(false)
    expect(sidebar.findAll('[data-intervention-id]')).toHaveLength(2)
    expect(reads).toHaveBeenCalledTimes(1)
    expect(lists).not.toHaveBeenCalled()
  })
})

describe('WI history refresh', () => {
  test('stays mounted and unread while collapsed; a real submit plus refresh updates expanded history and navigation changes its job', async () => {
    const { client, history, store, lists, reads, workspaces } = connect()
    const wrapper = await mountDetail('j-collect', 'collect')
    let sidebar = wrapper.getComponent(InterventionHistory)
    expect(history).not.toHaveBeenCalled()
    await store.refresh()
    await flushPromises()
    expect(history).not.toHaveBeenCalled()
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(history).toHaveBeenCalledExactlyOnceWith('j-collect', {})
    lists.mockClear()
    reads.mockClear()
    workspaces.mockClear()
    const receipt = await dataClient.submitIntake({ jobId: 'j-collect', inputKind: 'text', text: '刷新样例', sourceNote })
    await store.refresh()
    await flushPromises()
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(reads).toHaveBeenCalledExactlyOnceWith('j-collect')
    expect(workspaces).toHaveBeenCalledExactlyOnceWith('j-collect', 'collect')
    expect(history).toHaveBeenCalledTimes(2)
    expect(sidebar.find(`[data-intervention-id="${receipt.interventions[0]!.id}"]`).exists()).toBe(true)
    await router.push('/jobs/j-process/process')
    await flushPromises()
    sidebar = wrapper.getComponent(InterventionHistory)
    // A different job enters the existing page loading branch, so the sidebar remounts collapsed.
    expect(sidebar.get('button').attributes('aria-expanded')).toBe('false')
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(history).toHaveBeenLastCalledWith('j-process', {})
    expect(sidebar.findAll('[data-intervention-id]').map(row => row.attributes('data-intervention-id'))).toEqual((await client.listInterventions('j-process')).map(event => event.id))
    expect(sidebar.text()).not.toContain(receipt.interventions[0]!.id)
  })

  test('same-job detail replacement rereads with filters only while expanded', async () => {
    const { history, store } = connect()
    const wrapper = await mountDetail()
    const sidebar = wrapper.getComponent(InterventionHistory)
    await sidebar.get('button').trigger('click')
    await flushPromises()
    await sidebar.get('select[aria-label="按类型筛选"]').setValue('framework')
    await flushPromises()
    history.mockClear()
    await router.push('/jobs/j-deliver/analyze')
    await flushPromises()
    expect(history).toHaveBeenCalledExactlyOnceWith('j-deliver', { kind: 'framework' })
    await sidebar.get('button').trigger('click')
    history.mockClear()
    await store.refresh()
    await flushPromises()
    expect(history).not.toHaveBeenCalled()
    await sidebar.get('button').trigger('click')
    await flushPromises()
    expect(history).toHaveBeenCalledExactlyOnceWith('j-deliver', { kind: 'framework' })
  })
})
