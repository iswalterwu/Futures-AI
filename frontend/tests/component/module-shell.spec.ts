import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createMockDataClient } from '../../src/contracts/mock/index.ts'
import catalogFixture from '../../src/contracts/mock/fixtures/module-catalog.json'
import type { ErrorResponse } from '../../src/contracts/types.ts'
import ModuleShell from '../../src/modules/ModuleShell.vue'
import { moduleComponents } from '../../src/modules/registry.ts'
import Badge from '../../src/shared/components/Badge.vue'
import ErrorState from '../../src/shared/components/ErrorState.vue'
import { useLayoutStore } from '../../src/stores/layout.ts'

enableAutoUnmount(afterEach)
beforeEach(async () => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  localStorage.clear()
  setActivePinia(createPinia())
  await navigator.clipboard.writeText('')
})
afterEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  localStorage.clear()
  vi.useRealTimers()
})

describe('AC-004-3 shell', () => {
  test.each(catalogFixture)('$id has the shared structure using contract metadata', async ({ id }) => {
    const catalog = await createMockDataClient().getModuleCatalog()
    const module = catalog.find(item => item.id === id)!
    const wrapper = mount(ModuleShell, {
      props: { module, right: '元/吨 · 截至 2026-10-28' },
      slots: { default: '<p>模块正文</p>' },
    })
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.classes()).toEqual(['fai-module', 'glass-module'])
    expect(wrapper.attributes('data-module-id')).toBe(id)
    expect(wrapper.attributes('data-state')).toBe('ready')
    expect(wrapper.attributes('data-highlight')).toBe('false')
    expect(Array.from((wrapper.element as HTMLElement).children, child => child.tagName)).toEqual(['HEADER', 'DIV'])
    const header = wrapper.get('header')
    expect(Array.from(header.element.children, child => child.tagName)).toEqual(['H3', 'SPAN', 'SPAN', 'SPAN', 'SPAN', 'NAV'])
    expect(header.get('h3.title').text()).toBe(module.zh)
    expect(wrapper.attributes('aria-labelledby')).toBe(header.get('h3.title').attributes('id'))
    expect(header.get('span.en').text()).toBe(module.en)
    expect(header.get('span.right').text()).toBe('元/吨 · 截至 2026-10-28')
    expect(header.get('span.badge').attributes('data-badge')).toBe('sample')
    expect(header.get('span.badge').text()).toBe('样例')
    expect(header.get('span.ai').attributes('data-ai')).toBe('none')
    expect(header.get('nav.actions').findAll('button')).toHaveLength(3)
    expect(wrapper.get('div.body').text()).toBe('模块正文')
  })

  test('keeps the optional English and right-note positions without fabricating data', async () => {
    const [module] = await createMockDataClient().getModuleCatalog()
    const wrapper = mount(ModuleShell, { props: { module: { ...module, en: '' } } })
    expect(wrapper.get('header > .en').text()).toBe('')
    expect(wrapper.get('header > .right').text()).toBe('–')
    expect(wrapper.get('.body').text()).toBe('')
  })

  test('registry keys match the contract catalog and values are component implementations only', async () => {
    const catalog = await createMockDataClient().getModuleCatalog()
    expect(Object.keys(moduleComponents).sort()).toEqual(catalog.map(module => module.id).sort())
    for (const component of Object.values(moduleComponents)) {
      expect(component).toEqual(expect.objectContaining({ setup: expect.any(Function) }))
      expect(component).not.toHaveProperty('defaultSpan')
      expect(component).not.toHaveProperty('description')
    }
  })

  test.each([
    ['ok', '正常'], ['warn', '警告'], ['bad', '异常'], ['sample', '样例'],
  ] as const)('renders %s badge with an explicit text label', (state, label) => {
    const wrapper = mount(Badge, { props: { state } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('data-badge')).toBe(state)
    expect(wrapper.text()).toBe(label)
  })

  test('layout actions emit separately from viewing, and boundary buttons are disabled', async () => {
    const [module] = await createMockDataClient().getModuleCatalog()
    const wrapper = mount(ModuleShell, { props: { module, canMoveUp: false, canMoveDown: false } })
    const [up, down, remove] = wrapper.findAll('.actions button')
    expect(up.attributes('disabled')).toBeDefined()
    expect(down.attributes('disabled')).toBeDefined()
    await up.trigger('click')
    await down.trigger('click')
    expect(wrapper.emitted('moveUp')).toBeUndefined()
    expect(wrapper.emitted('moveDown')).toBeUndefined()
    await wrapper.setProps({ canMoveUp: true, canMoveDown: true })
    await up.trigger('click')
    await down.trigger('click')
    await remove.trigger('click')
    expect(wrapper.emitted('moveUp')).toEqual([[]])
    expect(wrapper.emitted('moveDown')).toEqual([[]])
    expect(wrapper.emitted('remove')).toEqual([[]])
    expect(wrapper.emitted('viewed')).toBeUndefined()
    await wrapper.get('.body').trigger('click')
    expect(wrapper.emitted('viewed')).toEqual([[]])
  })

  test('AI slot exposes none, running and done without providing agent behavior', async () => {
    const [module] = await createMockDataClient().getModuleCatalog()
    const wrapper = mount(ModuleShell, { props: { module } })
    expect(wrapper.get('.ai').attributes('data-ai')).toBe('none')
    expect(wrapper.get('.ai').text()).toBe('')
    await wrapper.setProps({ ai: 'running' })
    expect(wrapper.get('.ai').attributes('data-ai')).toBe('running')
    expect(wrapper.get('.ai').text()).toBe('AI 运行中')
    await wrapper.setProps({ ai: 'done' })
    expect(wrapper.get('.ai').attributes('data-ai')).toBe('done')
    expect(wrapper.get('.ai').text()).toBe('AI 已完成')
    await wrapper.setProps({ ai: 'none' })
    expect(wrapper.get('.ai').text()).toBe('')
  })

  test('highlight lasts 1500ms and releases its timer on unmount', async () => {
    const [module] = await createMockDataClient().getModuleCatalog()
    vi.useFakeTimers()
    const wrapper = mount(ModuleShell, { props: { module } })
    wrapper.vm.highlight()
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('data-highlight')).toBe('true')
    await vi.advanceTimersByTimeAsync(1499)
    expect(wrapper.attributes('data-highlight')).toBe('true')
    await vi.advanceTimersByTimeAsync(1)
    expect(wrapper.attributes('data-highlight')).toBe('false')
    wrapper.vm.highlight()
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('AC-004-4', () => {
  test('loading and empty replace content, then ready restores the body slot', async () => {
    const [module] = await createMockDataClient().getModuleCatalog()
    const wrapper = mount(ModuleShell, {
      props: { module, state: 'loading' },
      slots: { default: '<p>已就绪内容</p>' },
    })
    expect(wrapper.attributes('data-state')).toBe('loading')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('.body [role="status"]').text()).toBe('正在加载…')
    expect(wrapper.text()).not.toContain('已就绪内容')
    await wrapper.setProps({ state: 'empty', emptyMessage: '本期尚无数据。' })
    expect(wrapper.attributes('data-state')).toBe('empty')
    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.get('.body [role="status"]').text()).toBe('本期尚无数据。')
    expect(wrapper.find('.loading-state').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('已就绪内容')
    await wrapper.setProps({ state: 'ready' })
    expect(wrapper.get('.body').text()).toBe('已就绪内容')
    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })

  test('contract error yields a timestamped diagnostic copied through the clipboard', async () => {
    window.history.replaceState(null, '', '/?scenario=error')
    const client = createMockDataClient()
    const [module] = await client.getModuleCatalog()
    const response = await client.getMarketBoard().catch(cause => cause as ErrorResponse) as ErrorResponse
    const wrapper = mount(ModuleShell, {
      props: { module, state: 'error', badge: 'bad', error: response.error },
      slots: { default: '<p>正常正文</p>' },
    })
    expect(wrapper.attributes('data-state')).toBe('error')
    expect(wrapper.get('[role="alert"]').text()).toBe(response.error.message)
    expect(wrapper.text()).not.toContain('正常正文')
    const diagnostic = wrapper.get('code').text()
    const parsed = JSON.parse(diagnostic)
    expect(parsed).toEqual({
      moduleId: module.id,
      code: 'adapter_error',
      message: response.error.message,
      ts: expect.any(String),
    })
    expect(Number.isNaN(Date.parse(parsed.ts))).toBe(false)
    const errorState = wrapper.getComponent(ErrorState)
    await errorState.findAll('button')[0].trigger('click')
    await flushPromises()
    expect(await navigator.clipboard.readText()).toBe(diagnostic)
    expect(errorState.get('[role="status"]').text()).toBe('诊断已复制。')
    await errorState.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('retry')).toEqual([[]])
    await wrapper.setProps({ state: 'ready' })
    expect(wrapper.find('.error-state').exists()).toBe(false)
    expect(wrapper.get('.body').text()).toBe('正常正文')
  })

  test('failed clipboard access leaves selectable diagnostics and an honest failure message', async () => {
    const wrapper = mount(ErrorState, { props: {
      moduleId: 'doc-catalog',
      error: { code: 'not_found', message: '没有文档摘要。', retryable: false },
      ts: '2026-10-28T09:00:00+08:00',
    } })
    const diagnostic = wrapper.get('code').text()
    expect(JSON.parse(diagnostic).ts).toBe('2026-10-28T09:00:00+08:00')
    expect(wrapper.findAll('button')).toHaveLength(1)
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new DOMException('Denied', 'NotAllowedError'))
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toBe('复制失败，请选择诊断信息手动复制。')
    expect(wrapper.get('code').text()).toBe(diagnostic)
  })
})

describe('AC-004-2 layout', () => {
  test('loads the catalog default order, moves, removes, appends once and restores storage', async () => {
    const layout = useLayoutStore()
    await layout.loadCatalog()
    const defaults = layout.catalog.map(module => module.id)
    expect(layout.order).toEqual(defaults)
    expect(layout.modules).toEqual(layout.catalog)
    layout.moveUp(defaults[0])
    layout.moveDown(defaults.at(-1)!)
    expect(layout.order).toEqual(defaults)
    layout.moveDown(defaults[0])
    expect(layout.order.slice(0, 2)).toEqual([defaults[1], defaults[0]])
    layout.moveUp(defaults[0])
    expect(layout.order).toEqual(defaults)
    layout.remove(defaults[1])
    expect(layout.order).not.toContain(defaults[1])
    layout.add(defaults[1])
    layout.add(defaults[1])
    const expected = [defaults[0], ...defaults.slice(2), defaults[1]]
    expect(layout.order).toEqual(expected)
    expect(JSON.parse(localStorage.getItem('fai.layout')!)).toEqual(expected)
    await layout.loadCatalog()
    expect(layout.order).toEqual(expected)
    setActivePinia(createPinia())
    const restored = useLayoutStore()
    await restored.loadCatalog()
    expect(restored.order).toEqual(expected)
    expect(restored.modules.map(module => module.id)).toEqual(expected)
  })

  test('keeps a deliberately empty saved layout empty', async () => {
    localStorage.setItem('fai.layout', '[]')
    const layout = useLayoutStore()
    await layout.loadCatalog()
    expect(layout.order).toEqual([])
    expect(layout.modules).toEqual([])
  })

  test.each(['not-json', '{}', 'null', '[123]'])('invalid storage %s falls back at the storage boundary', async (stored) => {
    localStorage.setItem('fai.layout', stored)
    const layout = useLayoutStore()
    await layout.loadCatalog()
    expect(layout.order).toEqual(layout.catalog.map(module => module.id))
  })

  test('storage hydration drops out-of-catalog ids and repeated ids without appending missing modules', async () => {
    localStorage.setItem('fai.layout', JSON.stringify(['watchlist', 'retired-module', 'watchlist', 'positions']))
    const layout = useLayoutStore()
    await layout.loadCatalog()
    expect(layout.order).toEqual(['watchlist', 'positions'])
  })

  test('catalog metadata and order come from the contract, not the registry', async () => {
    const custom = catalogFixture.map(module => ({
      ...module, zh: `契约 · ${module.zh}`, description: `目录 · ${module.description}`, order: 8 - module.order,
    }))
    window.__FAI_MOCK__ = { fixtures: { 'module-catalog': custom } }
    const layout = useLayoutStore()
    await layout.loadCatalog()
    expect(layout.catalog).toEqual([...custom].reverse())
    expect(layout.order).toEqual([...custom].reverse().map(module => module.id))
  })

  test('catalog rejection is observable and the same store can retry', async () => {
    window.__FAI_MOCK__ = { fixtures: { 'module-catalog': [{}] } }
    const layout = useLayoutStore()
    await layout.loadCatalog()
    expect(layout.status).toBe('error')
    expect(layout.error?.code).toBe('validation_error')
    expect(layout.order).toEqual([])
    delete window.__FAI_MOCK__
    await layout.loadCatalog()
    expect(layout.status).toBe('ready')
    expect(layout.error).toBeNull()
    expect(layout.order).toHaveLength(7)
  })
})
