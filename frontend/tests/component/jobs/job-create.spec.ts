import { config, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import { router as appRouter } from '../../../src/app/router.ts'
import { dataClient } from '../../../src/contracts/index.ts'
import { createMockDataClient } from '../../../src/contracts/mock/index.ts'
import { JobTypeLabel, type Bootstrap, type ErrorResponse } from '../../../src/contracts/types.ts'
import JobCard from '../../../src/jobs/components/JobCard.vue'
import JobCreatePanel from '../../../src/jobs/pages/JobCreatePanel.vue'
import panelSource from '../../../src/jobs/pages/JobCreatePanel.vue?raw'
import listSource from '../../../src/jobs/pages/JobListPage.vue?raw'
import { registerJobRoutes } from '../../../src/jobs/routes.ts'
import { useJobsStore } from '../../../src/jobs/stores/jobs.ts'
import ErrorState from '../../../src/shared/components/ErrorState.vue'

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
  vi.unstubAllEnvs()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
})

function changeScenario(scenario: Bootstrap['scenario']) {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}

function connect() {
  const client = changeScenario('normal')
  const writes = vi.spyOn(dataClient, 'createJob').mockImplementation((...args) => client.createJob(...args))
  const lists = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  const store = useJobsStore(pinia)
  const creates = vi.spyOn(store, 'createJob')
  return { client, writes, lists, store, creates }
}

async function openPanel() {
  const wrapper = mount({ render: () => h(RouterView) }, { attachTo: document.body, global: { plugins: [router] } })
  await flushPromises()
  await wrapper.get('.job-create-toggle').trigger('click')
  return { wrapper, panel: wrapper.getComponent(JobCreatePanel) }
}

describe('WI AC-001-3 validation', () => {
  test('type starts empty, all options come from the contract, and blank title or missing type never calls the store', async () => {
    const { creates, writes } = connect()
    const { panel } = await openPanel()
    expect(panel.get<HTMLSelectElement>('select').element.value).toBe('')
    expect(panel.findAll('option').map(option => [option.attributes('value'), option.text()])).toEqual([
      ['', '请选择类型'], ...Object.entries(JobTypeLabel).map(([value, label]) => [value, label.text]),
    ])
    await panel.get('form').trigger('submit')
    expect(panel.text()).toContain('请填写作业标题。')
    expect(panel.text()).toContain('请选择作业类型。')
    await panel.get('select').setValue('research')
    await panel.get('input[aria-label="作业标题"]').setValue(' \t ')
    await panel.get('form').trigger('submit')
    expect(panel.get('#job-create-title-hint').text()).toBe('请填写作业标题。')
    expect(panel.find('#job-create-type-hint').exists()).toBe(false)
    await panel.get('input[aria-label="作业标题"]').setValue('有效标题')
    await panel.get('select').setValue('')
    await panel.get('form').trigger('submit')
    expect(panel.find('#job-create-title-hint').exists()).toBe(false)
    expect(panel.get('#job-create-type-hint').text()).toBe('请选择作业类型。')
    expect(creates).not.toHaveBeenCalled()
    expect(writes).not.toHaveBeenCalled()
    expect(router.currentRoute.value.path).toBe('/jobs')
  })

  test.each([
    [' \t ', null, ''], ['  油品  ', '  油品  ', '第一行\n第二行'],
  ])('submits raw title, mapped subject (%s) and raw goal, refreshes once and navigates to real detail', async (subject, expectedSubject, goal) => {
    const { writes, lists, creates } = connect()
    const { wrapper, panel } = await openPanel()
    await panel.get('input[aria-label="作业标题"]').setValue('  创建参数测试  ')
    await panel.get('select').setValue('research')
    await panel.get('input[aria-label="品种 / 主题"]').setValue(subject)
    await panel.get('textarea').setValue(goal)
    lists.mockClear()
    await panel.get('form').trigger('submit')
    await flushPromises()
    const input = { title: '  创建参数测试  ', type: 'research', subject: expectedSubject, goal }
    expect(creates).toHaveBeenCalledExactlyOnceWith(input)
    expect(writes).toHaveBeenCalledExactlyOnceWith(input)
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    const receipt = await writes.mock.results[0]!.value
    expect(router.currentRoute.value.path).toBe(`/jobs/${receipt.jobs[0].id}/collect`)
    expect(wrapper.get('h1').text()).toBe('创建参数测试')
    expect(wrapper.get('.job-status-badge').text()).toContain('提取中')
    expect(wrapper.get('[aria-current="step"]').text()).toContain('提取')
    if (goal !== '') expect(wrapper.get('.job-goal').element.textContent).toBe(goal)
  })

  test('original adapter error remains copyable with form and route intact; retry sends the same input and refreshes only after success', async () => {
    const { writes, lists, creates } = connect()
    const { wrapper, panel } = await openPanel()
    const input = { title: '失败后保留', type: 'daily', subject: '油品', goal: '第一行\n第二行' }
    await panel.get('input[aria-label="作业标题"]').setValue(input.title)
    await panel.get('select').setValue(input.type)
    await panel.get('input[aria-label="品种 / 主题"]').setValue(input.subject)
    await panel.get('textarea').setValue(input.goal)
    changeScenario('error')
    lists.mockClear()
    await panel.get('form').trigger('submit')
    await flushPromises()
    const cause = await (writes.mock.results[0]!.value as Promise<unknown>).catch(error => error) as ErrorResponse
    const errorState = panel.getComponent(ErrorState)
    expect(errorState.props('error')).toEqual(cause.error)
    const diagnostic = errorState.get('code').text()
    expect(JSON.parse(diagnostic)).toEqual({ moduleId: 'job-create', code: 'adapter_error', message: cause.error.message, ts: expect.any(String) })
    await errorState.findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(await navigator.clipboard.readText()).toBe(diagnostic)
    expect(router.currentRoute.value.path).toBe('/jobs')
    expect(wrapper.get('.job-create-toggle').attributes('aria-expanded')).toBe('true')
    expect(panel.get<HTMLInputElement>('input[aria-label="作业标题"]').element.value).toBe(input.title)
    expect(panel.get<HTMLSelectElement>('select').element.value).toBe(input.type)
    expect(panel.get<HTMLInputElement>('input[aria-label="品种 / 主题"]').element.value).toBe(input.subject)
    expect(panel.get<HTMLTextAreaElement>('textarea').element.value).toBe(input.goal)
    expect(lists).not.toHaveBeenCalled()
    changeScenario('normal')
    await errorState.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(creates.mock.calls).toEqual([[input], [input]])
    expect(writes.mock.calls).toEqual([[input], [input]])
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(wrapper.findComponent(JobCreatePanel).exists()).toBe(false)
    expect(wrapper.get('h1').text()).toBe(input.title)
  })
})

describe('WI non-modal', () => {
  test('ordinary inline section can collapse; filters, list and focus remain usable while expanded', async () => {
    connect()
    const { wrapper, panel } = await openPanel()
    expect(panel.element.tagName).toBe('SECTION')
    expect(wrapper.get('.job-create-toggle').attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('[role="dialog"], [aria-modal], [inert], dialog')).toHaveLength(0)
    expect(wrapper.findAllComponents(JobCard)).toHaveLength(5)
    const filter = wrapper.get<HTMLSelectElement>('.job-filters select[aria-label="类型"]')
    expect(filter.attributes('disabled')).toBeUndefined()
    filter.element.focus()
    expect(document.activeElement).toBe(filter.element)
    await filter.setValue('research')
    await flushPromises()
    expect(wrapper.findAllComponents(JobCard).length).toBeGreaterThan(0)
    expect(wrapper.findAllComponents(JobCard).every(card => card.props('job').type === 'research')).toBe(true)
    expect(wrapper.findComponent(JobCreatePanel).exists()).toBe(true)
    // Audit the actual two SFCs, not an invented modal implementation.
    for (const source of [panelSource, listSource]) {
      expect(source).not.toMatch(/position\s*:\s*fixed|aria-modal|\binert\b|focus(?:Trap|Lock)|backdrop|overlay|@keydown/)
    }
    await wrapper.get('.job-create-toggle').trigger('click')
    expect(wrapper.get('.job-create-toggle').attributes('aria-expanded')).toBe('false')
    expect(wrapper.findComponent(JobCreatePanel).exists()).toBe(false)
    expect(router.currentRoute.value.path).toBe('/jobs')
  })
})
