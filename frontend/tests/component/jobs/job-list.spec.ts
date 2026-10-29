import { config, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { router as appRouter } from '../../../src/app/router.ts'
import { dataClient } from '../../../src/contracts/index.ts'
import { createMockDataClient } from '../../../src/contracts/mock/index.ts'
import { JobStatusLabel, JobTypeLabel, StageLabel, type Bootstrap } from '../../../src/contracts/types.ts'
import JobCard from '../../../src/jobs/components/JobCard.vue'
import JobListPage from '../../../src/jobs/pages/JobListPage.vue'
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
  await router.push('/jobs')
  await navigator.clipboard.writeText('')
})
afterEach(() => {
  disposePinia(pinia)
  vi.restoreAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
  delete window.__FAI_MOCK__
  window.history.replaceState(null, '', '/')
  localStorage.clear()
})

function changeScenario(scenario: Bootstrap['scenario']) {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

function connect(scenario: Bootstrap['scenario'] = 'normal') {
  const client = changeScenario(scenario)
  const reads = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  return { client, reads, store: useJobsStore(pinia) }
}

function mountList() {
  return mount(JobListPage, { global: { plugins: [router] } })
}

describe('WI AC-001-1', () => {
  test('renders the five real mock jobs in contract order with labels, icons, timestamps and title links', async () => {
    const { client, reads, store } = connect()
    const expected = await client.listJobs()
    const wrapper = mountList()
    await flushPromises()
    expect(reads).toHaveBeenCalledExactlyOnceWith()
    const cards = wrapper.findAllComponents(JobCard)
    expect(cards).toHaveLength(5)
    expect(cards.map(card => card.props('job').id)).toEqual(expected.map(job => job.id))
    expect(cards.map(card => card.get('time').text())).toEqual(expected.map(job => job.updatedAt).sort().reverse())
    for (const [index, job] of expected.entries()) {
      const card = cards[index]!
      expect(card.props('job')).toBe(store.jobs[index])
      expect(card.get('h2 a').text()).toBe(job.title)
      expect(card.get('h2 a').attributes('href')).toBe(`/jobs/${job.id}`)
      for (const [selector, label] of [
        ['.job-type', JobTypeLabel[job.type]], ['.job-status-badge', JobStatusLabel[job.status]],
        ['.job-stage', StageLabel[job.currentStage]],
      ] as const) {
        expect(card.get(selector).text()).toContain(label.text)
        expect(card.get(`${selector} [aria-hidden="true"]`).text()).toBe(label.icon)
      }
      expect(card.get('time').attributes('datetime')).toBe(job.updatedAt)
      expect(card.get('time').text()).toBe(job.updatedAt)
    }
    await cards[0]!.get('h2 a').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe(`/jobs/${expected[0]!.id}`)
    expect(router.currentRoute.value.params.stage).toBeUndefined()
  })

  test('reuses the real unscreened store cache on mount without another read or storage access', async () => {
    const { store, reads } = connect()
    await store.ensureJobs()
    const cached = store.jobs
    const storage = ['getItem', 'setItem', 'removeItem', 'clear'].map(method =>
      vi.spyOn(Storage.prototype, method as 'getItem'))
    const wrapper = mountList()
    await flushPromises()
    expect(reads).toHaveBeenCalledTimes(1)
    expect(store.jobs).toBe(cached)
    expect(wrapper.findAllComponents(JobCard).map(card => card.props('job'))).toEqual(cached)
    expect(storage.every(spy => spy.mock.calls.length === 0)).toBe(true)
  })
})

describe('WI AC-001-4 list', () => {
  test('slow first load displays shared Loading until the real request completes', async () => {
    vi.useFakeTimers()
    const { store } = connect('slow')
    const wrapper = mountList()
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
    expect(wrapper.findComponent(JobCard).exists()).toBe(false)
    await vi.advanceTimersByTimeAsync(1499)
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()
    expect(store.listStatus).toBe('ready')
    expect(wrapper.findComponent(Loading).exists()).toBe(false)
    expect(wrapper.findAllComponents(JobCard)).toHaveLength(5)
  })

  test('empty scenario displays the shared empty state', async () => {
    connect('empty')
    const wrapper = mountList()
    await flushPromises()
    expect(wrapper.getComponent(EmptyState).text()).toBe('暂无作业。')
    expect(wrapper.findComponent(Loading).exists()).toBe(false)
    expect(wrapper.findComponent(ErrorState).exists()).toBe(false)
    expect(wrapper.findComponent(JobCard).exists()).toBe(false)
  })

  test.each([false, true])('error diagnostics copy and retry refreshes normal data (cached=%s)', async cached => {
    const { store, reads } = connect(cached ? 'normal' : 'error')
    if (cached) {
      await store.ensureJobs()
      changeScenario('error')
      await store.refresh()
      expect(store.jobs).toHaveLength(5)
    }
    const wrapper = mountList()
    await flushPromises()
    const errorState = wrapper.getComponent(ErrorState)
    expect(wrapper.findComponent(JobCard).exists()).toBe(false)
    expect(wrapper.findComponent(EmptyState).exists()).toBe(false)
    const diagnostic = errorState.get('code').text()
    const parsed = JSON.parse(diagnostic)
    expect(parsed).toEqual({
      moduleId: 'jobs-list', code: 'adapter_error', message: store.listError!.message, ts: expect.any(String),
    })
    expect(Number.isNaN(Date.parse(parsed.ts))).toBe(false)
    await errorState.findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(await navigator.clipboard.readText()).toBe(diagnostic)
    expect(errorState.get('[role="status"]').text()).toBe('诊断已复制。')
    changeScenario('normal')
    const previousCalls = reads.mock.calls.length
    await errorState.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(reads).toHaveBeenCalledTimes(previousCalls + 1)
    expect(reads).toHaveBeenLastCalledWith()
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
    expect(wrapper.findComponent(ErrorState).exists()).toBe(false)
    expect(wrapper.findAllComponents(JobCard)).toHaveLength(5)
  })
})

describe('WI AC-001-2', () => {
  test('offers all nine statuses and three types using contract option values and labels', async () => {
    connect()
    const wrapper = mountList()
    await flushPromises()
    for (const [name, labels] of [['状态', JobStatusLabel], ['类型', JobTypeLabel]] as const) {
      const options = wrapper.findAll(`select[aria-label="${name}"] option`)
      expect(options.map(option => [option.attributes('value'), option.text()])).toEqual([
        ['', '全部'], ...Object.entries(labels).map(([value, label]) => [value, label.text]),
      ])
    }
  })

  test('each control sends the composed filter and renders real contract results without replacing the base cache', async () => {
    const { client, reads, store } = connect()
    const wrapper = mountList()
    await flushPromises()
    const cached = store.jobs
    for (const [selector, value, filter] of [
      ['select[aria-label="类型"]', 'research', { type: 'research' }],
      ['select[aria-label="状态"]', 'processing', { type: 'research', status: 'processing' }],
      ['input[aria-label="标题"]', 'j-process', { type: 'research', status: 'processing', title: 'j-process' }],
      ['select[aria-label="状态"]', '', { type: 'research', title: 'j-process' }],
      ['select[aria-label="类型"]', '', { title: 'j-process' }],
    ] as const) {
      reads.mockClear()
      await wrapper.get(selector).setValue(value)
      await flushPromises()
      expect(reads).toHaveBeenCalledExactlyOnceWith(filter)
      const expected = await client.listJobs(filter)
      expect(expected.length).toBeGreaterThan(0)
      expect(wrapper.findAllComponents(JobCard).map(card => card.props('job'))).toEqual(expected)
      expect(store.jobs).toBe(cached)
      expect(store.listStatus).toBe('ready')
    }
    reads.mockClear()
    await wrapper.get('input[aria-label="标题"]').setValue('')
    await flushPromises()
    expect(reads).not.toHaveBeenCalled()
    expect(store.filter).toBeNull()
    expect(store.filteredJobs).toBeNull()
    expect(wrapper.findAllComponents(JobCard).map(card => card.props('job'))).toEqual(cached)
  })

  test('clear resets all controls and restores the unscreened list without a request', async () => {
    const { reads, store } = connect()
    const wrapper = mountList()
    await flushPromises()
    const cached = store.jobs
    await wrapper.get('select[aria-label="状态"]').setValue('processing')
    await flushPromises()
    await wrapper.get('select[aria-label="类型"]').setValue('research')
    await flushPromises()
    await wrapper.get('input[aria-label="标题"]').setValue('j-process')
    await flushPromises()
    expect(wrapper.findAllComponents(JobCard)).toHaveLength(1)
    reads.mockClear()
    await wrapper.get('.job-filters button').trigger('click')
    await flushPromises()
    expect(reads).not.toHaveBeenCalled()
    expect(wrapper.get<HTMLSelectElement>('select[aria-label="状态"]').element.value).toBe('')
    expect(wrapper.get<HTMLSelectElement>('select[aria-label="类型"]').element.value).toBe('')
    expect(wrapper.get<HTMLInputElement>('input[aria-label="标题"]').element.value).toBe('')
    expect(store.filter).toBeNull()
    expect(store.filteredJobs).toBeNull()
    expect(wrapper.findAllComponents(JobCard).map(card => card.props('job'))).toEqual(cached)
  })

  test('title stays untrimmed and case-sensitive; empty matches have their own message', async () => {
    const { client, reads } = connect()
    const wrapper = mountList()
    await flushPromises()
    for (const title of [' j-process ', 'J-PROCESS', ' ', 'j-process']) {
      reads.mockClear()
      await wrapper.get('input[aria-label="标题"]').setValue(title)
      await flushPromises()
      expect(reads).toHaveBeenCalledExactlyOnceWith({ title })
      const expected = await client.listJobs({ title })
      expect(wrapper.findAllComponents(JobCard).map(card => card.props('job'))).toEqual(expected)
      if (title === 'j-process' || title === ' ') {
        expect(expected).toHaveLength(title === ' ' ? 5 : 1)
        expect(wrapper.findComponent(EmptyState).exists()).toBe(false)
      } else {
        expect(expected).toHaveLength(0)
        expect(wrapper.getComponent(EmptyState).text()).toBe('暂无符合筛选的作业。')
      }
    }
  })

  test('clearing a filter in the empty scenario restores the unfiltered empty message without reading', async () => {
    const { reads } = connect('empty')
    const wrapper = mountList()
    await flushPromises()
    expect(wrapper.getComponent(EmptyState).text()).toBe('暂无作业。')
    await wrapper.get('select[aria-label="类型"]').setValue('daily')
    await flushPromises()
    expect(wrapper.getComponent(EmptyState).text()).toBe('暂无符合筛选的作业。')
    reads.mockClear()
    await wrapper.get('.job-filters button').trigger('click')
    await flushPromises()
    expect(reads).not.toHaveBeenCalled()
    expect(wrapper.getComponent(EmptyState).text()).toBe('暂无作业。')
  })

  test('filter failure hides cached cards; later filter success keeps the read error until retry refreshes both lists', async () => {
    const { client, reads, store } = connect()
    const wrapper = mountList()
    await flushPromises()
    const cached = store.jobs
    changeScenario('error')
    await wrapper.get('select[aria-label="类型"]').setValue('research')
    await flushPromises()
    expect(store.listStatus).toBe('error')
    const error = store.listError
    expect(wrapper.getComponent(ErrorState).props('error')).toEqual(error)
    expect(wrapper.findComponent(JobCard).exists()).toBe(false)
    changeScenario('normal')
    await wrapper.get('input[aria-label="标题"]').setValue('j-process')
    await flushPromises()
    expect(store.filteredJobs).toHaveLength(1)
    expect(store.jobs).toBe(cached)
    expect(store.listStatus).toBe('error')
    expect(store.listError).toBe(error)
    expect(wrapper.findComponent(ErrorState).exists()).toBe(true)
    expect(wrapper.findComponent(JobCard).exists()).toBe(false)
    reads.mockClear()
    await wrapper.getComponent(ErrorState).findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(reads.mock.calls).toEqual([[], [{ type: 'research', title: 'j-process' }]])
    expect(store.listStatus).toBe('ready')
    expect(store.listError).toBeNull()
    expect(wrapper.findComponent(ErrorState).exists()).toBe(false)
    expect(wrapper.findAllComponents(JobCard).map(card => card.props('job'))).toEqual(
      await client.listJobs({ type: 'research', title: 'j-process' }),
    )
    expect(store.jobs).toEqual(await client.listJobs())
  })
})
