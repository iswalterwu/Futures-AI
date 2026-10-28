import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import TopBar from '../../src/app/TopBar.vue'
import topBarSource from '../../src/app/TopBar.vue?raw'
import { createMockDataClient } from '../../src/contracts/mock/index.ts'

const css = topBarSource.split('<style scoped>')[1].split('</style>')[0]
const sheet = new CSSStyleSheet()
sheet.replaceSync(css)
const rules = Array.from(sheet.cssRules).filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)

enableAutoUnmount(afterEach)
beforeEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
})
afterEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
})

describe('AC-002-4 topbar', () => {
  test('renders news titles, sources and timestamps returned by the real mock client', async () => {
    const client = createMockDataClient()
    const news = await client.getNewsTicker()
    const sources = await client.getSourceStatus()
    const wrapper = mount(TopBar, { props: { news, sources } })
    const items = wrapper.findAll('.ticker-items:not(.ticker-copy) li')
    expect(items).toHaveLength(news.length)
    for (const [index, item] of items.entries()) {
      expect(item.attributes('data-news-id')).toBe(news[index].id)
      expect(item.text()).toContain(news[index].title)
      expect(item.get('.news-source').text()).toBe(news[index].source)
      expect(item.get('time').attributes('datetime')).toBe(news[index].ts)
      expect(item.get('time').text()).toBe(news[index].ts.slice(11, 16))
    }
    expect(wrapper.get('.ticker-viewport').classes()).toContain('ticker')
    expect(wrapper.get('.ticker-copy').attributes('aria-hidden')).toBe('true')
    expect(wrapper.findAll('.ticker-copy li')).toHaveLength(news.length)
  })

  test('fresh and stale dots use only their registered status tokens with visible state labels', async () => {
    const sources = await createMockDataClient().getSourceStatus()
    const wrapper = mount(TopBar, { props: { news: [], sources } })
    expect(new Set(sources.map(source => source.status))).toEqual(new Set(['fresh', 'stale']))
    expect(wrapper.findAll('.source-list li')).toHaveLength(sources.length)
    for (const source of sources) {
      const item = wrapper.get(`[data-source-id="${source.id}"]`)
      expect(item.text()).toContain(source.name)
      expect(item.get('.source-state').text()).toBe(source.status === 'fresh' ? '新鲜' : '待更新')
      expect(item.get('.status-dot').classes()).toEqual(['status-dot', source.status])
      expect(item.attributes('title')).toBe(source.asOf ? `截至 ${source.asOf}` : '尚未更新')
    }
    for (const status of ['fresh', 'stale']) {
      const style = rules.find(rule => rule.selectorText === `.status-dot.${status}`)!.style
      expect(style.getPropertyValue('background')).toBe(`var(--fai-status-${status})`)
    }
    expect(rules.find(rule => rule.selectorText === '.status-dot')!.style.width).toBe('var(--fai-status-dot-size)')
    expect(topBarSource).not.toContain('--fai-updown-')
  })

  test('empty mock data has explicit empty text and no fabricated ticker or status dots', async () => {
    window.history.replaceState(null, '', '/?scenario=empty')
    const client = createMockDataClient()
    const wrapper = mount(TopBar, { props: {
      news: await client.getNewsTicker(),
      sources: await client.getSourceStatus(),
    } })
    expect(wrapper.get('.ticker-viewport').text()).toBe('暂无资讯')
    expect(wrapper.get('.source-empty').text()).toBe('暂无数据源状态')
    expect(wrapper.find('.ticker-track').exists()).toBe(false)
    expect(wrapper.find('.status-dot').exists()).toBe(false)
  })

  test('renders changed contract data without retaining old news or freshness classes', async () => {
    const client = createMockDataClient()
    const news = await client.getNewsTicker()
    const sources = await client.getSourceStatus()
    const wrapper = mount(TopBar, { props: { news, sources } })
    window.__FAI_MOCK__ = { fixtures: {
      news: [{ ...news[0], title: '更新后的合成资讯' }],
      sources: [{ ...sources[0], status: 'stale' }],
    } }
    await wrapper.setProps({ news: await client.getNewsTicker(), sources: await client.getSourceStatus() })
    expect(wrapper.findAll('.ticker-items:not(.ticker-copy) li')).toHaveLength(1)
    expect(wrapper.text()).toContain('更新后的合成资讯')
    expect(wrapper.text()).not.toContain(news[1].title)
    expect(wrapper.find('.status-dot.fresh').exists()).toBe(false)
    expect(wrapper.find('.status-dot.stale').exists()).toBe(true)
  })

  test('provides CSS translation, hover/focus pause and static horizontal scrolling for reduced motion', () => {
    const track = rules.find(rule => rule.selectorText === '.ticker-track')!.style
    expect(track.animationName).toBe('ticker-scroll')
    expect(track.animationIterationCount).toBe('infinite')
    expect(css).toContain('transform: translateX(-50%)')
    const pause = rules.find(rule => rule.selectorText.includes(':focus-within'))!.style
    expect(pause.animationPlayState).toBe('paused')
    const reduced = Array.from(sheet.cssRules).find((rule): rule is CSSMediaRule =>
      rule instanceof CSSMediaRule && rule.conditionText === '(prefers-reduced-motion: reduce)')!
    const reducedRules = Array.from(reduced.cssRules) as CSSStyleRule[]
    expect(reducedRules.find(rule => rule.selectorText === '.ticker-viewport')!.style.overflowX).toBe('auto')
    expect(reducedRules.find(rule => rule.selectorText === '.ticker-track')!.style.animation).toBe('none')
    expect(reducedRules.find(rule => rule.selectorText === '.ticker-copy')!.style.display).toBe('none')
  })
})
