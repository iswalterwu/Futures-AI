import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h, nextTick, toRaw } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import AgentDock from '../../src/agent/AgentDock.vue'
import CotTimeline from '../../src/agent/CotTimeline.vue'
import { AgentRunSchema } from '../../src/agent/events.ts'
import { useAgentStore } from '../../src/agent/store.ts'
import { router as appRouter } from '../../src/app/router.ts'
import { agentClient, dataClient } from '../../src/contracts/index.ts'
import ModuleShell from '../../src/modules/ModuleShell.vue'
import { useBadgesStore } from '../../src/stores/badges.ts'
import { useLayoutStore } from '../../src/stores/layout.ts'
import { useUiStore } from '../../src/stores/ui.ts'

let pinia: ReturnType<typeof createPinia>
let router: ReturnType<typeof createRouter>
let unsubscribe: () => void

enableAutoUnmount(afterEach)
beforeEach(async () => {
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  pinia = createPinia()
  setActivePinia(pinia)
  router = createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes })
  await router.push('/prices')
  unsubscribe = agentClient.subscribe(useAgentStore(pinia).receive)
  vi.useFakeTimers()
})
afterEach(() => {
  unsubscribe()
  disposePinia(pinia)
  vi.clearAllTimers()
  vi.useRealTimers()
  localStorage.clear()
  delete window.__FAI_MOCK__
  window.history.replaceState(null, '', '/')
})

function mountDock() {
  return mount(AgentDock, { global: { plugins: [pinia, router] } })
}

function mountRoutedDock() {
  return mount({ render: () => h('div', [h(RouterView), h(AgentDock)]) }, {
    attachTo: document.body,
    global: { plugins: [pinia, router] },
  })
}

describe('AC-005-2 timeline', () => {
  test.each(['success', 'failure', 'retry'] as const)('%s replays actual client events with expandable steps and one terminal', async (agentScript) => {
    window.__FAI_MOCK__ = { agentScript }
    const wrapper = mount(CotTimeline, { global: { plugins: [pinia, router] } })
    const agent = useAgentStore()
    expect(await agent.send('分析合成油品数据')).toBe(true)
    await vi.runAllTimersAsync()
    expect(wrapper.findAll('.agent-run')).toHaveLength(1)
    expect(wrapper.get('.user-message').text()).toBe('分析合成油品数据')
    const run = agent.runs[0]
    expect(wrapper.get('.agent-run').attributes('data-run-id')).toBe(run.runId)
    expect(wrapper.findAll('.timeline-step')).toHaveLength(run.steps.length)
    expect(new Set(run.steps.map(step => step.stepId)).size).toBe(run.steps.length)
    const details = wrapper.get('[data-step-type="step.tool.call"] details')
    expect(details.attributes('open')).toBeUndefined()
    ;(details.get('summary').element as HTMLElement).click()
    await nextTick()
    expect(details.attributes('open')).toBeDefined()
    expect(details.get('pre').text()).toContain('合成示例')
    ;(details.get('summary').element as HTMLElement).click()
    await nextTick()
    expect(details.attributes('open')).toBeUndefined()
    const terminal = wrapper.findAll('.terminal-row')
    expect(terminal).toHaveLength(1)
    expect(terminal[0].attributes('data-terminal')).toBe(agentScript === 'failure' ? 'run.failed' : 'run.completed')
    expect(agent.running).toBe(false)
    if (agentScript !== 'success') {
      expect(wrapper.findAll('[data-step-type="step.error"]')).toHaveLength(1)
      expect(wrapper.get('[data-step-type="step.error"]').attributes('data-error')).toBe('true')
      expect(wrapper.get('[data-step-type="step.tool.result"]').attributes('data-error')).toBe('true')
    }
  })

  test('increments text in place and replaces it with authoritative done text without duplicate rows', async () => {
    const wrapper = mountDock()
    await useAgentStore().send('合并片段')
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.get('[data-step-id="1"] .step-summary').text()).toBe('先读取合约价格，')
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.get('[data-step-id="1"] .step-summary').text()).toBe('先读取合约价格，再核对库存指标。')
    expect(wrapper.findAll('[data-step-id="1"]')).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.get('[data-step-id="4"] .step-summary').text()).toBe('样例中原油走高，LPG 小幅回落。')
    await vi.advanceTimersByTimeAsync(200)
    expect(wrapper.get('[data-step-id="4"] .step-summary').text()).toBe('样例中原油走高，LPG 小幅回落；这不是实时行情或交易建议。')
    expect(wrapper.findAll('[data-step-id="4"]')).toHaveLength(1)
    await vi.runAllTimersAsync()
    expect(wrapper.findAll('.timeline-step')).toHaveLength(7)
    expect(wrapper.findAll('.terminal-row')).toHaveLength(1)
  })

  test('retryable step.error remains nonterminal while the same run resumes', async () => {
    window.__FAI_MOCK__ = { agentScript: 'retry' }
    const wrapper = mountDock()
    const agent = useAgentStore()
    await agent.send('重试数据源')
    await vi.advanceTimersByTimeAsync(700)
    const runId = agent.runs[0].runId
    expect(agent.running).toBe(true)
    expect(wrapper.find('.terminal-row').exists()).toBe(false)
    expect(wrapper.get('[data-step-type="step.error"] .step-detail').text()).toContain('将自动重试，当前运行继续。')
    await vi.runAllTimersAsync()
    expect(agent.runs).toHaveLength(1)
    expect(agent.runs[0].runId).toBe(runId)
    expect(wrapper.findAll('[data-step-type="step.error"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-step-type="step.tool.call"]')).toHaveLength(2)
    expect(wrapper.get('.terminal-row').attributes('data-terminal')).toBe('run.completed')
  })

  test('non-retrying errors wait for failure and expose contract diagnostics in the terminal', async () => {
    window.__FAI_MOCK__ = { agentScript: 'failure' }
    const wrapper = mountDock()
    await useAgentStore().send('读取失败')
    await vi.advanceTimersByTimeAsync(1000)
    expect(useAgentStore().running).toBe(true)
    expect(wrapper.find('.terminal-row').exists()).toBe(false)
    expect(wrapper.get('[data-step-type="step.error"] .step-detail').text()).toContain('不自动重试，等待运行终态。')
    await vi.runAllTimersAsync()
    const terminal = wrapper.get('.terminal-row')
    ;(terminal.get('summary').element as HTMLElement).click()
    await nextTick()
    expect(terminal.attributes('open')).toBeDefined()
    expect(terminal.get('code').text()).toBe('rate_limited')
    expect(terminal.text()).toContain('样例数据源限流，请稍后重试。')
  })

  test('groups subsequent runs separately while preserving their shared session and earlier steps', async () => {
    const wrapper = mountDock()
    const agent = useAgentStore()
    await agent.send('第一问')
    await vi.runAllTimersAsync()
    const first = structuredClone(toRaw(agent.runs[0].steps))
    window.__FAI_MOCK__ = { agentScript: 'failure' }
    await agent.send('第二问')
    await vi.runAllTimersAsync()
    expect(agent.runs).toHaveLength(2)
    expect(agent.runs[0].sessionId).toBe(agent.runs[1].sessionId)
    expect(agent.runs[0].runId).not.toBe(agent.runs[1].runId)
    expect(agent.runs[0].steps).toEqual(first)
    expect(wrapper.findAll('.agent-run').map(run => run.get('.user-message').text())).toEqual(['第一问', '第二问'])
    expect(wrapper.findAll('.agent-run').every(run => run.findAll('.terminal-row').length === 1)).toBe(true)
  })

  test('renders the contracted aborted terminal without adding an abort control', async () => {
    const wrapper = mountDock()
    const common = { runId: 'aborted-run', sessionId: 'session', ts: '2026-10-28T09:00:00+08:00' }
    AgentRunSchema.parse([
      { ...common, type: 'run.started', prompt: '已中止的运行' },
      { ...common, type: 'run.aborted' },
    ]).forEach(useAgentStore().receive)
    await nextTick()
    expect(wrapper.findAll('.terminal-row')).toHaveLength(1)
    expect(wrapper.get('.terminal-row').text()).toContain('已中止')
    expect(wrapper.findAll('button').some(button => button.text().includes('中止'))).toBe(false)
  })
})

test('AC-005-1 dock opens on submit, displays the accepted prompt and retains tall mode', async () => {
  const wrapper = mountDock()
  const ui = useUiStore()
  expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  await wrapper.get('input').setValue('  今日油品  ')
  await wrapper.get('form').trigger('submit')
  await vi.advanceTimersByTimeAsync(0)
  expect(ui.drawer).toBe('half')
  expect(wrapper.get('.user-message').text()).toBe('今日油品')
  expect(wrapper.get<HTMLInputElement>('input').element.value).toBe('')
  await vi.runAllTimersAsync()
  ui.setDrawer('tall')
  await wrapper.get('input').setValue('再看库存')
  await wrapper.get('form').trigger('submit')
  await vi.advanceTimersByTimeAsync(0)
  expect(ui.drawer).toBe('tall')
  expect(wrapper.findAll('.agent-run')).toHaveLength(2)
})

test('AC-005-1 rejected sends keep the draft and show the boundary error without a fabricated run', async () => {
  window.history.replaceState(null, '', '/?agentScript=unknown')
  const wrapper = mountDock()
  await wrapper.get('input').setValue('保留草稿')
  await wrapper.get('form').trigger('submit')
  await flushPromises()
  expect(wrapper.get<HTMLInputElement>('input').element.value).toBe('保留草稿')
  expect(wrapper.get('[role="alert"]').text()).toContain('发送失败')
  expect(wrapper.findAll('.agent-run')).toHaveLength(0)
  expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
  window.history.replaceState(null, '', '/')
  await wrapper.get('form').trigger('submit')
  await vi.runAllTimersAsync()
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.get('.user-message').text()).toBe('保留草稿')
})

test('AC-005-7 drawer states persist; the running indicator lasts only until the terminal', async () => {
  const wrapper = mountDock()
  const ui = useUiStore()
  expect(ui.drawer).toBe('closed')
  await wrapper.get('.drawer-toggle').trigger('click')
  expect(ui.drawer).toBe('half')
  expect(localStorage.getItem('fai.drawer')).toBe('half')
  await wrapper.get('.drawer-header button:nth-child(2)').trigger('click')
  expect(ui.drawer).toBe('tall')
  expect(localStorage.getItem('fai.drawer')).toBe('tall')
  for (const state of ['closed', 'half', 'tall'] as const) {
    ui.setDrawer(state)
    const restoredPinia = createPinia()
    expect(useUiStore(restoredPinia).drawer).toBe(state)
    disposePinia(restoredPinia)
  }
  setActivePinia(pinia)
  await useAgentStore().send('运行指示')
  await vi.advanceTimersByTimeAsync(0)
  expect(wrapper.find('.running-indicator').exists()).toBe(true)
  await wrapper.get('.drawer-toggle').trigger('click')
  expect(ui.drawer).toBe('closed')
  expect(wrapper.find('.running-indicator').exists()).toBe(true)
  await vi.runAllTimersAsync()
  expect(wrapper.find('.running-indicator').exists()).toBe(false)
})

test('AC-005-7 unknown persisted drawer state falls back at the storage boundary', () => {
  localStorage.setItem('fai.drawer', 'invalid')
  expect(useUiStore().drawer).toBe('closed')
})

test('AC-005-3 application subscription outlives drawer unmount and page changes during a long run', async () => {
  window.__FAI_MOCK__ = { agentScript: 'long' }
  const first = mountDock()
  const agent = useAgentStore()
  await agent.send('后台继续')
  await vi.advanceTimersByTimeAsync(300)
  const runId = agent.runs[0].runId
  expect(agent.runs[0].steps).toHaveLength(2)
  first.unmount()
  await router.push('/daily')
  await vi.advanceTimersByTimeAsync(6200)
  const reopened = mountDock()
  expect(reopened.findAll('.timeline-step')).toHaveLength(5)
  expect(reopened.get('.agent-run').attributes('data-run-id')).toBe(runId)
  useUiStore().setDrawer('closed')
  await vi.advanceTimersByTimeAsync(2000)
  useUiStore().setDrawer('half')
  await nextTick()
  expect(reopened.findAll('.timeline-step')).toHaveLength(6)
  await vi.runAllTimersAsync()
  expect(agent.runs).toHaveLength(1)
  expect(agent.runs[0].runId).toBe(runId)
  expect(agent.runs[0].steps.map(step => step.stepId)).toEqual([1, 2, 3, 4, 5, 6, 7])
  expect(reopened.findAll('.terminal-row')).toHaveLength(1)
})

test('AC-005-4 real module shell observes running/done and clears only on viewing, not layout controls', async () => {
  const [module] = await dataClient.getModuleCatalog()
  const shell = mount(ModuleShell, { props: { module }, global: { plugins: [pinia] } })
  await useAgentStore().send('角标')
  await vi.advanceTimersByTimeAsync(300)
  expect(shell.get('.ai').attributes('data-ai')).toBe('running')
  await shell.get('.actions button').trigger('click')
  expect(shell.get('.ai').attributes('data-ai')).toBe('running')
  await vi.runAllTimersAsync()
  expect(shell.get('.ai').attributes('data-ai')).toBe('done')
  await shell.get('.body').trigger('click')
  expect(shell.get('.ai').attributes('data-ai')).toBe('none')
  expect(shell.emitted('viewed')).toEqual([[]])
})

test('AC-005-4 failed runs release running badges without claiming success', async () => {
  window.__FAI_MOCK__ = { agentScript: 'failure' }
  const badges = useBadgesStore()
  await useAgentStore().send('失败角标')
  await vi.advanceTimersByTimeAsync(300)
  expect(badges.modules['market-board']?.state).toBe('running')
  await vi.runAllTimersAsync()
  expect(badges.modules['market-board']).toBeUndefined()
})

describe('AC-005-5 navigation', () => {
  test('an in-layout module from another page mounts, scrolls, focuses and highlights for 1500ms', async () => {
    const wrapper = mountRoutedDock()
    useUiStore().setDrawer('tall')
    await useAgentStore().send('定位模块')
    await vi.runAllTimersAsync()
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
    await wrapper.get('[data-target-id="market-board"] .hint-link').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/workbench')
    expect(useUiStore().drawer).toBe('closed')
    const module = wrapper.get('.fai-module[data-module-id="market-board"]')
    expect(module.attributes('data-highlight')).toBe('true')
    expect(document.activeElement).toBe(module.element)
    expect(scroll).toHaveBeenCalledWith({ block: 'start' })
    await vi.advanceTimersByTimeAsync(1499)
    expect(module.attributes('data-highlight')).toBe('true')
    await vi.advanceTimersByTimeAsync(1)
    expect(module.attributes('data-highlight')).toBe('false')
  })

  test('a removed module only offers restoration; explicit add appends before navigation and highlight', async () => {
    localStorage.setItem('fai.layout', JSON.stringify(['watchlist']))
    const wrapper = mountRoutedDock()
    useUiStore().setDrawer('half')
    await useAgentStore().send('恢复模块')
    await vi.runAllTimersAsync()
    await wrapper.get('[data-target-id="market-board"] .hint-link').trigger('click')
    await flushPromises()
    const hint = wrapper.get('[data-target-id="market-board"]')
    expect(hint.get('[role="status"]').text()).toContain('该模块不在工作台')
    expect(useLayoutStore().order).toEqual(['watchlist'])
    expect(localStorage.getItem('fai.layout')).toBe('["watchlist"]')
    expect(router.currentRoute.value.path).toBe('/prices')
    await hint.get('.navigation-notice button').trigger('click')
    await flushPromises()
    expect(useLayoutStore().order).toEqual(['watchlist', 'market-board'])
    expect(router.currentRoute.value.path).toBe('/workbench')
    expect(wrapper.get('.fai-module[data-module-id="market-board"]').attributes('data-highlight')).toBe('true')
    expect(hint.find('[role="status"]').exists()).toBe(false)
  })

  test('existing page targets navigate, missing modules and fallback page routes do not', async () => {
    const wrapper = mountRoutedDock()
    await router.push('/daily')
    useUiStore().setDrawer('half')
    await useAgentStore().send('跳转建议')
    await vi.runAllTimersAsync()
    await wrapper.get('[data-target-id="sample-unavailable-module"] .hint-link').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/daily')
    expect(wrapper.get('[data-target-id="sample-unavailable-module"] .navigation-notice').text()).toContain('目标模块不存在')
    await wrapper.get('[data-target-id="/prices"] .hint-link').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/prices')
    const common = { runId: 'missing-page', sessionId: 'session', ts: '2026-10-28T09:00:00+08:00' }
    AgentRunSchema.parse([
      { ...common, type: 'run.started', prompt: '不存在的页面' },
      { ...common, type: 'hint.navigate', stepId: 1, target: { kind: 'page', id: '/not-a-page' } },
      { ...common, type: 'run.completed', moduleIds: [] },
    ]).forEach(useAgentStore().receive)
    useUiStore().setDrawer('half')
    await nextTick()
    await wrapper.get('[data-target-id="/not-a-page"] .hint-link').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/prices')
    expect(wrapper.get('[data-target-id="/not-a-page"] .navigation-notice').text()).toContain('目标页面不存在')
  })
})
