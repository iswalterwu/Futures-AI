import { config, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import { router as appRouter } from '../../../src/app/router.ts'
import { dataClient } from '../../../src/contracts/index.ts'
import { createMockDataClient } from '../../../src/contracts/mock/index.ts'
import { JobTypeLabel, StageLabel, StageStateLabel, type Bootstrap } from '../../../src/contracts/types.ts'
import StageRail from '../../../src/jobs/components/StageRail.vue'
import StageWorkspace from '../../../src/jobs/components/StageWorkspace.vue'
import detailSource from '../../../src/jobs/pages/JobDetailPage.vue?raw'
import railSource from '../../../src/jobs/components/StageRail.vue?raw'
import { registerJobRoutes } from '../../../src/jobs/routes.ts'
import { useJobsStore } from '../../../src/jobs/stores/jobs.ts'
import { useSessionStore } from '../../../src/jobs/stores/session.ts'
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
})

function changeScenario(scenario: Bootstrap['scenario']) {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

function connect(scenario: Bootstrap['scenario'] = 'normal') {
  const client = changeScenario(scenario)
  const reads = vi.spyOn(dataClient, 'getJob').mockImplementation((...args) => client.getJob(...args))
  const workspaces = vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  const lists = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  return { client, reads, workspaces, lists, store: useJobsStore(pinia) }
}

async function mountDetail(path: string) {
  await router.push(path)
  return mount({ render: () => h(RouterView) }, { global: { plugins: [router] } })
}

function styleRule(source: string, selector: string) {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(source.split('<style scoped>')[1]!.split('</style>')[0]!)
  return (Array.from(sheet.cssRules).find(rule => (rule as CSSStyleRule).selectorText === selector) as CSSStyleRule).style
}

describe('WI AC-002-1', () => {
  test.each([
    ['normal', 'j-failed', 'analyze'], ['job-running', 'j-human', 'process'],
  ] as const)('renders contract order, state labels and icons in %s / %s', async (scenario, id, stage) => {
    const { client, store } = connect(scenario)
    const job = (await client.getJob(id))!
    const wrapper = await mountDetail(`/jobs/${id}/${stage}`)
    await flushPromises()
    const rail = wrapper.getComponent(StageRail)
    expect(rail.props('stages')).toBe(store.currentJob!.stages)
    const buttons = rail.findAll('button')
    expect(buttons).toHaveLength(4)
    for (const [index, summary] of job.stages.entries()) {
      const button = buttons[index]!
      expect(button.get('.stage-name').text()).toContain(StageLabel[summary.stage].text)
      expect(button.get('.stage-name [aria-hidden]').text()).toBe(StageLabel[summary.stage].icon)
      expect(button.get('.stage-state').text()).toContain(StageStateLabel[summary.state].text)
      expect(button.get('.stage-state [aria-hidden]').text()).toBe(StageStateLabel[summary.state].icon)
      expect(button.attributes('aria-current')).toBe(summary.stage === job.currentStage ? 'step' : undefined)
    }
    expect(rail.findAll('[aria-current="step"]')).toHaveLength(1)
    expect(styleRule(railSource, ".stage-rail button[aria-current='step']").getPropertyValue('border-inline-start-color')).toBe('var(--fai-accent-red)')
  })

  test('keeps business current stage distinct from viewed stage; selection replaces the URL and reads that workspace', async () => {
    const { client, workspaces, lists, store } = connect()
    const job = (await client.getJob('j-process'))!
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountDetail('/jobs/j-process/collect')
    await flushPromises()
    expect(wrapper.get('h1').text()).toBe(job.title)
    expect(wrapper.get('.job-type').text()).toContain(JobTypeLabel[job.type].text)
    expect(wrapper.get('.job-type [aria-hidden]').text()).toBe(JobTypeLabel[job.type].icon)
    expect(wrapper.get('.job-status-badge').text()).toContain('处理中')
    expect(wrapper.get('.job-subject').text()).toBe(job.subject)
    expect(wrapper.get('.job-goal').element.textContent).toBe(job.goal)
    expect(wrapper.get('[aria-current="step"] .stage-name').text()).toContain('处理')
    expect(wrapper.get('[aria-pressed="true"] .stage-name').text()).toContain('提取')
    await wrapper.getComponent(StageRail).findAll('button')[2]!.trigger('click')
    await flushPromises()
    expect(replace).toHaveBeenCalledExactlyOnceWith({ name: 'job-detail', params: { id: 'j-process', stage: 'analyze' } })
    expect(router.currentRoute.value.path).toBe('/jobs/j-process/analyze')
    expect(workspaces).toHaveBeenLastCalledWith('j-process', 'analyze')
    expect(wrapper.getComponent(StageWorkspace).props('stage')).toBe('analyze')
    expect(wrapper.get('[aria-label="分析工作区"]').text()).toContain('由后续任务提供')
    expect(wrapper.get('[aria-current="step"] .stage-name').text()).toContain('处理')
    expect(useSessionStore(pinia).context).toEqual({ jobId: 'j-process', stage: 'analyze' })
    expect(lists).not.toHaveBeenCalled()
    expect(store.listStatus).toBe('idle')
  })

  test.each(['', '/bogus'])('normalizes an absent or unknown stage once (%s) and leaves through RouterView without invalid reads', async suffix => {
    const { reads, workspaces, store } = connect()
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountDetail(`/jobs/j-process${suffix}`)
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/jobs/j-process/process')
    expect(replace).toHaveBeenCalledExactlyOnceWith({ name: 'job-detail', params: { id: 'j-process', stage: 'process' } })
    expect(reads.mock.calls).toEqual([['j-process'], ['j-process']])
    expect(workspaces.mock.calls).toEqual([['j-process', 'process'], ['j-process', 'process']])
    expect(useSessionStore(pinia).context).toEqual({ jobId: 'j-process', stage: 'process' })
    reads.mockClear()
    await router.push('/jobs')
    await flushPromises()
    expect(wrapper.findComponent(StageRail).exists()).toBe(false)
    // List mounting calls ensureJobs -> refresh, which intentionally rereads the retained anchor.
    expect(reads.mock.calls).toEqual([['j-process']])
    expect(store.detailStatus).toBe('ready')
    expect(useSessionStore(pinia).context).toBeNull()
  })

  test('route id changes reopen the detail; optional header fields and multiline goal follow the real contract', async () => {
    const { client, reads } = connect()
    const first = (await client.createJob({ title: '空目标', type: 'adhoc', subject: null, goal: '' })).jobs[0]!
    const second = (await client.createJob({ title: '多行目标', type: 'research', subject: '油品', goal: '第一行\n第二行' })).jobs[0]!
    const wrapper = await mountDetail(`/jobs/${first.id}/collect`)
    await flushPromises()
    expect(wrapper.find('.job-subject').exists()).toBe(false)
    expect(wrapper.find('.job-goal').exists()).toBe(false)
    await router.push(`/jobs/${second.id}/collect`)
    await flushPromises()
    expect(reads).toHaveBeenLastCalledWith(second.id)
    expect(wrapper.get('h1').text()).toBe(second.title)
    expect(wrapper.get('.job-goal').element.textContent).toBe(second.goal)
    expect(styleRule(detailSource, '.job-goal').getPropertyValue('white-space')).toBe('pre-wrap')
  })
})

describe('WI AC-001-4 detail', () => {
  test('slow first entry remains Loading until both real detail reads complete', async () => {
    vi.useFakeTimers()
    const { store, lists } = connect('slow')
    const wrapper = await mountDetail('/jobs/j-process/process')
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(2999)
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()
    expect(store.detailStatus).toBe('ready')
    expect(wrapper.findComponent(Loading).exists()).toBe(false)
    expect(wrapper.findComponent(StageRail).exists()).toBe(true)
    expect(lists).not.toHaveBeenCalled()
  })

  test.each(['/collect', ''])('empty known id shows no rail and does not normalize a null result (%s)', async suffix => {
    const { workspaces, store } = connect('empty')
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountDetail(`/jobs/j-collect${suffix}?scenario=empty`)
    await flushPromises()
    expect(wrapper.getComponent(EmptyState).text()).toBe('暂无作业。')
    expect(wrapper.findComponent(StageRail).exists()).toBe(false)
    expect(wrapper.findComponent(ErrorState).exists()).toBe(false)
    expect(workspaces).not.toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
    expect(store.listStatus).toBe('idle')
  })

  test('adapter error copies original diagnostics and retry refreshes after normal recovery', async () => {
    const { store, lists, reads } = connect('error')
    const wrapper = await mountDetail('/jobs/j-process/process')
    await flushPromises()
    const error = wrapper.getComponent(ErrorState)
    expect(error.props('error')).toBe(store.detailError)
    const diagnostic = error.get('code').text()
    expect(JSON.parse(diagnostic)).toEqual({ moduleId: 'job-detail', code: 'adapter_error', message: store.detailError!.message, ts: expect.any(String) })
    await error.findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(await navigator.clipboard.readText()).toBe(diagnostic)
    expect(wrapper.findComponent(StageRail).exists()).toBe(false)
    expect(lists).not.toHaveBeenCalled()
    expect(store.listStatus).toBe('idle')
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(reads).toHaveBeenCalledTimes(2)
    expect(store.detailStatus).toBe('ready')
    expect(store.detailError).toBeNull()
    expect(wrapper.findComponent(StageRail).exists()).toBe(true)
  })

  test('unknown id has not_found without retry, hides old detail and leaves the list state unchanged', async () => {
    const { store } = connect()
    await store.ensureJobs()
    const wrapper = await mountDetail('/jobs/j-process/process')
    await flushPromises()
    await router.push('/jobs/j-missing/collect')
    await flushPromises()
    const error = wrapper.getComponent(ErrorState)
    expect(JSON.parse(error.get('code').text()).code).toBe('not_found')
    expect(error.findAll('button').map(button => button.text())).toEqual(['复制诊断'])
    expect(wrapper.findComponent(StageRail).exists()).toBe(false)
    expect(wrapper.find('h1').exists()).toBe(false)
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
  })
})
