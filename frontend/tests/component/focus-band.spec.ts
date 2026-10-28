import { readFileSync } from 'node:fs'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { dataClient } from '../../src/contracts/index.ts'
import { createMockDataClient } from '../../src/contracts/mock/index.ts'
import dailyFixture from '../../src/contracts/mock/fixtures/daily-brief.json'
import { T } from '../../src/design/generated/tokens.ts'
import ErrorState from '../../src/shared/components/ErrorState.vue'
import Kpi from '../../src/shared/components/Kpi.vue'
import FocusBand from '../../src/workbench/FocusBand.vue'
import focusSource from '../../src/workbench/FocusBand.vue?raw'

const updownCss = readFileSync('src/design/updown.css', 'utf8')
const numCss = readFileSync('src/shared/num.css', 'utf8')
const initialWidth = window.innerWidth
const sheet = new CSSStyleSheet()
sheet.replaceSync(`${numCss}\n${updownCss}`)
const colorRules = Array.from(sheet.cssRules) as CSSStyleRule[]

enableAutoUnmount(afterEach)
beforeEach(async () => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  resizeWindow(T.window.width)
  await navigator.clipboard.writeText('')
})
afterEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  resizeWindow(initialWidth)
})

function resizeWindow(width: number) {
  Object.assign(window, { innerWidth: width })
  window.dispatchEvent(new Event('resize'))
}

function mountFocus() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: FocusBand },
      { path: '/daily/:date', component: FocusBand },
    ],
  })
  const wrapper = mount(FocusBand, { global: { plugins: [router] } })
  return { wrapper, router }
}

describe('AC-003-1', () => {
  test('loads the real mock brief and renders conclusions, date, KPI values, units and rounded changes', async () => {
    const { brief } = await createMockDataClient().getDailyBrief()
    const { wrapper } = mountFocus()
    expect(wrapper.attributes('data-state')).toBe('loading')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('.loading-state').text()).toBe('正在加载今日日报…')
    expect(wrapper.attributes('href')).toBeUndefined()
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('ready')
    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.classes()).toContain('glass-focus')
    expect(wrapper.get('h2').text()).toBe('今日焦点 Daily focus')
    expect(wrapper.get('time').attributes('datetime')).toBe(brief!.date)
    expect(wrapper.get('time').text()).toBe(brief!.date)
    expect(wrapper.findAll('.focus-conclusions li').map(item => item.text())).toEqual(brief!.conclusions)
    expect(wrapper.findAllComponents(Kpi).map(card => card.props('figure'))).toEqual(brief!.figures)
    expect(wrapper.findAll('.kpi-value').map(value => value.text())).toEqual(['512.6', '4,320', '3,018', '2,460', '76.8', '820'])
    expect(wrapper.findAll('.unit').map(unit => unit.text())).toEqual(['元/桶', '元/吨', '元/吨', '万吨', '%', '万吨'])
    const deltas = wrapper.findAll('.kpi-delta')
    expect(deltas.map(delta => delta.text())).toEqual(['+1.50%', '-0.46%', '+0.60%', '-35', '+0.8', '0'])
    expect(deltas[1].classes()).toContain('is-down')
    expect(deltas[2].classes()).toContain('is-up')
    expect(wrapper.find('.loading-state').exists()).toBe(false)
  })

  test('truncates conclusions after three and figures after the expanded token limit', async () => {
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: {
      ...dailyFixture.brief,
      conclusions: [...dailyFixture.brief.conclusions, '不应展示的第四条结论'],
      figures: [...dailyFixture.brief.figures, { ...dailyFixture.brief.figures[0], label: '不应展示的第七张卡' }],
    } } } }
    const { wrapper } = mountFocus()
    await flushPromises()
    expect(wrapper.findAll('.focus-conclusions li').map(item => item.text())).toEqual(dailyFixture.brief.conclusions)
    expect(wrapper.findAll('.focus-card')).toHaveLength(T.layout.focus_expanded)
    expect(wrapper.text()).not.toContain('不应展示')
  })

  test('uses the registered 4/6 card limits at the exact breakpoint and responds to viewport changes', async () => {
    resizeWindow(T.window.min_width)
    const { wrapper } = mountFocus()
    await flushPromises()
    expect(wrapper.findAll('.focus-card')).toHaveLength(T.layout.focus_compact)
    expect(wrapper.findAll('.kpi-label').map(label => label.text())).toEqual(['原油 SC2612', 'LPG PG2612', '燃料油 FU2701', '商业库存'])
    for (const [width, count] of [
      [T.breakpoint.focus_expand, T.layout.focus_expanded],
      [T.breakpoint.focus_expand + 1, T.layout.focus_expanded],
      [T.breakpoint.focus_expand - 1, T.layout.focus_compact],
    ]) {
      resizeWindow(width)
      await flushPromises()
      expect(wrapper.findAll('.focus-card')).toHaveLength(count)
      expect(wrapper.findAll('.focus-conclusions li')).toHaveLength(3)
    }
  })

  test('failed contract reads use ErrorState with copyable diagnostics and retry the real client', async () => {
    window.history.replaceState(null, '', '/?scenario=error')
    const failingClient = createMockDataClient()
    const request = vi.spyOn(dataClient, 'getDailyBrief').mockImplementation(() => failingClient.getDailyBrief())
    const { wrapper } = mountFocus()
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('error')
    expect(wrapper.attributes('aria-busy')).toBe('false')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('样例数据源暂不可用，请重试。')
    expect(wrapper.find('.focus-card').exists()).toBe(false)
    expect(wrapper.find('.empty-state').exists()).toBe(false)
    const diagnostic = wrapper.get('code').text()
    const parsed = JSON.parse(diagnostic)
    expect(parsed).toEqual({
      moduleId: 'daily-brief', code: 'adapter_error',
      message: '样例数据源暂不可用，请重试。', ts: expect.any(String),
    })
    expect(Number.isNaN(Date.parse(parsed.ts))).toBe(false)
    const errorState = wrapper.getComponent(ErrorState)
    await errorState.findAll('button')[0].trigger('click')
    await flushPromises()
    expect(await navigator.clipboard.readText()).toBe(diagnostic)
    expect(errorState.get('[role="status"]').text()).toBe('诊断已复制。')
    request.mockRestore()
    await errorState.findAll('button')[1].trigger('click')
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('ready')
    expect(wrapper.attributes('href')).toBe(`/daily/${dailyFixture.brief.date}`)
    expect(wrapper.find('.error-state').exists()).toBe(false)
    expect(wrapper.findAll('.focus-card')).toHaveLength(T.layout.focus_expanded)
  })
})

describe('AC-003-4', () => {
  test('uses declared semantic and rounded delta direction, not the sign of the positive headline value', async () => {
    const cases = [
      { label: '行情涨', semantic: 'market', delta: 1.5, text: '+1.50%', tone: 'up', token: 'updown-up' },
      { label: '行情跌', semantic: 'market', delta: -1.5, text: '-1.50%', tone: 'down', token: 'updown-down' },
      { label: '行情零', semantic: 'market', delta: -0.004, text: '0.00%', tone: 'neutral', token: 'text-primary' },
      { label: '指标增', semantic: 'analysis', delta: 1.5, text: '+1.50%', tone: 'up', token: 'chart-pos' },
      { label: '指标减', semantic: 'analysis', delta: -1.5, text: '-1.50%', tone: 'down', token: 'chart-neg' },
      { label: '指标零', semantic: 'analysis', delta: -0, text: '0.00%', tone: 'neutral', token: 'text-primary' },
    ] as const
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: {
      ...dailyFixture.brief,
      figures: cases.map(({ label, semantic, delta }) => ({
        ...dailyFixture.brief.figures[0], label, semantic, delta, decimals: 2,
      })),
    } } } }
    const { wrapper } = mountFocus()
    await flushPromises()
    const cards = wrapper.findAll('.focus-card')
    expect(cards).toHaveLength(cases.length)
    for (const [index, item] of cases.entries()) {
      const card = cards[index]
      expect(card.get('.kpi-label').text()).toBe(item.label)
      expect(card.get('.kpi-value').text()).toBe('512.60')
      const delta = card.get('.kpi-delta')
      expect(delta.text()).toBe(item.text)
      expect(delta.classes()).toContain(`sem-${item.semantic}`)
      expect(delta.classes()).toContain(`is-${item.tone}`)
      expect(delta.attributes('style')).toBeUndefined()
      const selector = item.tone === 'neutral' ? '.num.is-neutral' : `.sem-${item.semantic}.is-${item.tone}`
      const rule = colorRules.find(rule => rule.selectorText === selector)
      expect(rule, `Missing ${selector} in ${colorRules.map(rule => rule.selectorText).join(', ')}`).toBeDefined()
      expect(rule!.style.color).toBe(`var(--fai-${item.token})`)
    }
  })

  test('keeps missing and rounded-zero numbers neutral and does not invent an absent delta', async () => {
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: {
      ...dailyFixture.brief,
      figures: [
        { ...dailyFixture.brief.figures[0], value: null, delta: null },
        { ...dailyFixture.brief.figures[1], value: -0.004, delta: -0.004, decimals: 2 },
        { ...dailyFixture.brief.figures[3], delta: undefined },
      ],
    } } } }
    const { wrapper } = mountFocus()
    await flushPromises()
    const [missing, zero, noChange] = wrapper.findAll('.focus-card')
    expect(missing.get('.kpi-value').text()).toBe('–')
    expect(missing.get('.kpi-delta').text()).toBe('–')
    expect(missing.get('.kpi-delta').classes()).toContain('is-neutral')
    expect(zero.get('.kpi-value').text()).toBe('0.00')
    expect(zero.get('.kpi-delta').text()).toBe('0.00%')
    expect(zero.get('.kpi-delta').classes()).toContain('is-neutral')
    expect(noChange.get('.kpi-value').text()).toBe('2,460')
    expect(noChange.find('.kpi-delta').exists()).toBe(false)
  })
})

test('AC-003-5 interleaved contract figures stay in their semantic section with bilingual labels and a glass-edge divider', async () => {
  const figures = dailyFixture.brief.figures
  window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: {
    ...dailyFixture.brief, figures: [figures[3], figures[0], figures[4], figures[1], figures[5], figures[2]],
  } } } }
  const { wrapper } = mountFocus()
  await flushPromises()
  expect(wrapper.findAll('.focus-segment')).toHaveLength(2)
  const market = wrapper.get('[data-semantic="market"]')
  const analysis = wrapper.get('[data-semantic="analysis"]')
  expect(market.get('h3').text()).toBe('行情 Market')
  expect(analysis.get('h3').text()).toBe('指标 Indicators')
  expect(market.attributes('aria-labelledby')).toBe(market.get('h3').attributes('id'))
  expect(analysis.attributes('aria-labelledby')).toBe(analysis.get('h3').attributes('id'))
  expect(market.findAll('.kpi-label').map(label => label.text())).toEqual(['原油 SC2612', 'LPG PG2612', '燃料油 FU2701'])
  expect(analysis.findAll('.kpi-label').map(label => label.text())).toEqual(['商业库存', '炼厂开工率', '在途运量'])
  expect(market.findAll('.sem-market')).toHaveLength(3)
  expect(analysis.findAll('.sem-analysis')).toHaveLength(3)
  expect(market.find('.sem-analysis').exists()).toBe(false)
  expect(analysis.find('.sem-market').exists()).toBe(false)
  expect(focusSource).toContain("import '../design/updown.css'")
  expect(focusSource).toContain('border-inline-start: thin solid var(--fai-glass-focus-border)')
  expect(focusSource).not.toContain('--fai-updown-')
})

describe('AC-003-3', () => {
  test('shows the exact contract reason for a missing brief without a daily link or fabricated content', async () => {
    const reason = '当前交易日尚未完成数据更新，请稍后查看日报。'
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: null, reason } } }
    const { wrapper } = mountFocus()
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('empty')
    expect(wrapper.get('.empty-state[role="status"]').text()).toBe(reason)
    expect(wrapper.get('h2').text()).toBe('今日焦点 Daily focus')
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.find('.focus-card').exists()).toBe(false)
    expect(wrapper.find('.focus-conclusions').exists()).toBe(false)
    expect(wrapper.find('.error-state').exists()).toBe(false)
  })

  test('the optional reason has a readable default when the contract omits it', async () => {
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: null } } }
    const { wrapper } = mountFocus()
    await flushPromises()
    expect(wrapper.get('.empty-state').text()).toBe('今日日报尚未生成。')
  })
})

test('AC-003-2 the entire ready band is a native router link carrying the brief date', async () => {
  window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: { ...dailyFixture.brief, date: '2026-11-02' } } } }
  const { wrapper, router } = mountFocus()
  await flushPromises()
  expect(wrapper.element.tagName).toBe('A')
  expect(wrapper.attributes('href')).toBe('/daily/2026-11-02')
  expect(wrapper.findAll('a')).toHaveLength(1)
  expect(wrapper.find('button').exists()).toBe(false)
  await wrapper.get('.focus-card').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe('/daily/2026-11-02')
})
