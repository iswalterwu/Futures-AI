import { readFileSync } from 'node:fs'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { DataClient } from '../../src/contracts/client.ts'
import { createMockDataClient } from '../../src/contracts/mock/index.ts'
import boardFixture from '../../src/contracts/mock/fixtures/market-board.json'
import watchlistFixture from '../../src/contracts/mock/fixtures/watchlist.json'
import calendarFixture from '../../src/contracts/mock/fixtures/release-calendar.json'
import type { ModuleDef, ModuleId } from '../../src/contracts/types.ts'
import { T } from '../../src/design/generated/tokens.ts'
import ModuleShell from '../../src/modules/ModuleShell.vue'
import MarketBoard from '../../src/modules/market-board/MarketBoard.vue'
import marketSource from '../../src/modules/market-board/MarketBoard.vue?raw'
import Watchlist from '../../src/modules/watchlist/Watchlist.vue'
import watchlistSource from '../../src/modules/watchlist/Watchlist.vue?raw'
import ReleaseCalendar from '../../src/modules/release-calendar/ReleaseCalendar.vue'
import calendarSource from '../../src/modules/release-calendar/ReleaseCalendar.vue?raw'
import ModuleSummary from '../../src/modules/summary/ModuleSummary.vue'
import { moduleComponents } from '../../src/modules/registry.ts'
import BoardGrid from '../../src/shared/components/BoardGrid.vue'
import boardSource from '../../src/shared/components/BoardGrid.vue?raw'
import DataTable from '../../src/shared/components/DataTable.vue'
import tableSource from '../../src/shared/components/DataTable.vue?raw'
import ErrorState from '../../src/shared/components/ErrorState.vue'
import Spark from '../../src/shared/components/Spark.vue'

const updownCss = readFileSync('src/design/updown.css', 'utf8')
const numCss = readFileSync('src/shared/num.css', 'utf8')
let catalog: ModuleDef[]
enableAutoUnmount(afterEach)
beforeEach(async () => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  catalog = await createMockDataClient().getModuleCatalog()
})
afterEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  vi.useRealTimers()
})

function renderModule(id: ModuleId, client: DataClient = createMockDataClient(), attrs: Record<string, unknown> = {}) {
  return mount(moduleComponents[id], {
    props: { module: catalog.find(module => module.id === id)!, client },
    attrs,
  })
}

function styleRule(source: string, selector: string) {
  const sheet = new CSSStyleSheet()
  const css = source.includes('<style scoped>') ? source.split('<style scoped>')[1].split('</style>')[0] : source
  sheet.replaceSync(css)
  const rule = Array.from(sheet.cssRules).find((rule): rule is CSSStyleRule =>
    rule instanceof CSSStyleRule && rule.selectorText.replace(/\s+/g, ' ') === selector)
  expect(rule, `Missing style rule: ${selector}`).toBeDefined()
  return rule!.style
}

function recordCanvas() {
  const context = {
    setTransform: vi.fn(), clearRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(),
    lineTo: vi.fn(), stroke: vi.fn(), arc: vi.fn(), fill: vi.fn(),
    strokeStyle: '', fillStyle: '', lineWidth: 0,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)
  return context
}

describe('AC-004-5 board', () => {
  test('renders contract columns, rows and all four distinct cell states', async () => {
    expect(moduleComponents['market-board']).toBe(MarketBoard)
    const wrapper = renderModule('market-board')
    expect(wrapper.attributes('data-state')).toBe('loading')
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('ready')
    expect(wrapper.findComponent(BoardGrid).exists()).toBe(true)
    expect(wrapper.findAll('thead th').map(cell => cell.text())).toEqual(['合约', '最新价', '结算价'])
    expect(wrapper.findAll('tbody th').map(cell => cell.text())).toEqual(boardFixture.rows.map(row => row.label))
    const prices = wrapper.findAll('td[data-state="ok"] .num')
    expect(prices.map(cell => cell.text())).toEqual(['512.6', '4,320', '3,018'])
    expect(prices[0].classes()).toEqual(['num', 'sem-market', 'is-up'])
    expect(prices[1].classes()).toEqual(['num', 'sem-market', 'is-down'])
    expect(prices[2].classes()).toEqual(['num', 'sem-market', 'is-up'])
    for (const [state, text, title] of [['holiday', '休', '休市'], ['pending', '待', '待结算'], ['missing', '–', '缺数']]) {
      const cell = wrapper.get(`td[data-state="${state}"]`)
      expect(cell.text()).toBe(text)
      expect(cell.get('.board-status').attributes('aria-label')).toBe(title)
      expect(cell.find('.sem-market').exists()).toBe(false)
    }
    expect(wrapper.get('[data-row-id="PG2612"] .unit').text()).toBe('元/吨')
    expect(wrapper.get('header .right').text()).toBe(`截至 ${boardFixture.asOf}`)
  })

  test.each([
    { value: 0, delta: 1, text: '0.0', tone: 'neutral' },
    { value: -0.04, delta: -1, text: '0.0', tone: 'neutral' },
    { value: null, delta: -1, text: '–', tone: 'neutral' },
    { value: 512.6, delta: -0.04, text: '512.6', tone: 'neutral' },
    { value: 512.6, delta: null, text: '512.6', tone: 'neutral' },
    { value: 512.6, delta: undefined, text: '512.6', tone: 'neutral' },
    { value: -512.6, delta: 1, text: '-512.6', tone: 'up' },
  ])('keeps displayed zero/missing neutral and uses delta rather than price sign: $value / $delta', async ({ value, delta, text, tone }) => {
    const board = await createMockDataClient().getMarketBoard()
    board.rows[0].cells[0].figure!.value = value
    board.rows[0].cells[0].figure!.delta = delta
    window.__FAI_MOCK__ = { fixtures: { 'market-board': board } }
    const wrapper = renderModule('market-board')
    await flushPromises()
    const number = wrapper.get('tbody .num')
    expect(number.text()).toBe(text)
    expect(number.classes()).toEqual(['num', 'sem-market', `is-${tone}`])
  })

  test.each([
    { deltaKind: 'pct', delta: -0.46, deltaDecimals: undefined, tone: 'down' },
    { deltaKind: 'pct', delta: 0.6, deltaDecimals: undefined, tone: 'up' },
    { deltaKind: 'pct', delta: -0.46, deltaDecimals: 0, tone: 'neutral' },
    { deltaKind: 'pct', delta: -0.004, deltaDecimals: 3, tone: 'down' },
    { deltaKind: 'abs', delta: -0.46, deltaDecimals: undefined, tone: 'neutral' },
    { deltaKind: 'abs', delta: -0.46, deltaDecimals: 2, tone: 'down' },
  ] as const)('R1-01 board uses the declared delta precision, not price precision: $deltaKind / $deltaDecimals / $tone', async ({ deltaKind, delta, deltaDecimals, tone }) => {
    const board = await createMockDataClient().getMarketBoard()
    Object.assign(board.rows[0].cells[0].figure!, { value: 4320, decimals: 0, deltaKind, delta, deltaDecimals })
    window.__FAI_MOCK__ = { fixtures: { 'market-board': board } }
    const wrapper = renderModule('market-board')
    await flushPromises()
    const number = wrapper.get('tbody .num')
    expect(number.text()).toBe('4,320')
    expect(number.classes()).toEqual(['num', 'sem-market', `is-${tone}`])
  })

  test('uses the shared numeric rules and only amber for pending cells', () => {
    const number = styleRule(numCss, '.num')
    expect(number.fontFamily).toBe('var(--fai-font-mono)')
    expect(number.fontVariantNumeric).toBe('tabular-nums')
    expect(number.textAlign).toBe('right')
    expect(styleRule(boardSource, '.board-grid .stub').textAlign).toBe('left')
    expect(styleRule(boardSource, '.board-status.pending').color).toBe('var(--fai-accent-amber)')
    expect(styleRule(boardSource, '.unit, .board-status').color).toBe('var(--fai-text-muted)')
    expect(styleRule(boardSource, '.board-scroll').overflowX).toBe('auto')
    expect(marketSource).toContain("import '../../design/updown.css'")
    expect(boardSource).not.toContain('updown.css')
  })
})

describe('AC-004-5 watchlist', () => {
  test('renders real DataTable and SparkSeries with grouped, signed, right-aligned contract prices', async () => {
    expect(moduleComponents.watchlist).toBe(Watchlist)
    const wrapper = renderModule('watchlist')
    await flushPromises()
    expect(wrapper.findComponent(DataTable).exists()).toBe(true)
    expect(wrapper.findAll('thead th').map(cell => cell.text())).toEqual(['合约', '最新价', '涨跌', '涨跌幅', '走势'])
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
    expect(rows.map(row => row.get('[data-column="price"]').text())).toEqual(['512.6', '4,320', '3,018'])
    expect(rows.map(row => row.get('[data-column="change"]').text())).toEqual(['+7.6', '-20', '+18'])
    expect(rows.map(row => row.get('[data-column="changePct"]').text())).toEqual(['+1.50%', '-0.46%', '+0.60%'])
    for (const [index, row] of rows.entries()) {
      expect(row.get('.contract-name').text()).toBe(watchlistFixture.rows[index].name)
      expect(row.get('.unit').text()).toBe(watchlistFixture.rows[index].price.unit)
      for (const column of ['price', 'change', 'changePct']) {
        const cell = row.get(`[data-column="${column}"]`)
        expect(cell.classes()).toContain('num')
        expect(cell.get('span').classes()).toEqual(['num', 'sem-market', index === 1 ? 'is-down' : 'is-up'])
        expect(cell.attributes('style')).toBeUndefined()
        expect(cell.get('span').attributes('style')).toBeUndefined()
      }
    }
    const sparks = wrapper.findAllComponents(Spark)
    expect(sparks.map(spark => spark.props('series'))).toEqual(watchlistFixture.rows.map(row => row.spark))
    expect(sparks[0].get('canvas').attributes('aria-label')).toContain(watchlistFixture.rows[0].spark.unit)
    expect(sparks[0].attributes('data-series-id')).toBe(watchlistFixture.rows[0].spark.seriesId)
    expect(wrapper.get('header .right').text()).toBe(`截至 ${watchlistFixture.asOf}`)
  })

  test('keeps rounded-zero changes neutral without signs and respects null values', async () => {
    const table = structuredClone(watchlistFixture)
    const row = table.rows[0]
    row.price.value = 12345.67
    row.price.decimals = 2
    row.change.value = -0.004
    row.change.decimals = 2
    row.changePct.value = 0.004
    window.__FAI_MOCK__ = { fixtures: { watchlist: { ...table, rows: [row, {
      ...table.rows[1],
      price: { ...table.rows[1].price, value: null },
      change: { ...table.rows[1].change, value: null },
      changePct: { ...table.rows[1].changePct, value: null },
    }] } } }
    const wrapper = renderModule('watchlist')
    await flushPromises()
    expect(wrapper.findAll('tbody .num > span').map(number => number.text())).toEqual(['12,345.67', '0.00', '0.00%', '–', '–', '–'])
    expect(wrapper.findAll('tbody .sem-market')).toHaveLength(6)
    expect(wrapper.findAll('tbody .sem-market').every(number => number.classes().includes('is-neutral'))).toBe(true)
    expect(wrapper.find('.is-up, .is-down').exists()).toBe(false)
  })

  test('confines red/green to shared text-color rules and keeps table text sans-serif', () => {
    expect(watchlistSource).toContain("import '../../design/updown.css'")
    expect(styleRule(tableSource, '.data-table').fontFamily).toBe('var(--fai-font-sans)')
    expect(styleRule(tableSource, '.numeric-heading').textAlign).toBe('right')
    expect(styleRule(tableSource, '.table-scroll').overflowX).toBe('auto')
    for (const direction of ['up', 'down']) {
      const rule = styleRule(updownCss, `.sem-market.is-${direction}`)
      expect(rule.length).toBe(1)
      expect(rule.item(0)).toBe('color')
      expect(rule.color).toBe(`var(--fai-updown-${direction})`)
    }
  })

  test('Spark draws the real series with a neutral token line and a final dot', async () => {
    const context = recordCanvas()
    const { rows } = await createMockDataClient().getWatchlist()
    const wrapper = mount(Spark, { props: { series: rows[0].spark } })
    expect(context.setTransform).toHaveBeenCalledWith(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    expect(context.moveTo).toHaveBeenCalledWith(4, 20)
    expect(context.lineTo).toHaveBeenCalledTimes(4)
    expect(context.arc).toHaveBeenCalledWith(68, 4, 2, 0, Math.PI * 2)
    expect(context.strokeStyle).toBe(T.chart.line_0)
    expect(context.fillStyle).toBe(T.chart.line_0)
    expect(context.fill).toHaveBeenCalledOnce()
    expect(wrapper.get('canvas').attributes('width')).toBe(String(72 * window.devicePixelRatio))
    expect(wrapper.get('canvas').attributes('height')).toBe(String(24 * window.devicePixelRatio))
  })

  test('Spark redraws reactive input without connecting across missing observations', async () => {
    const context = recordCanvas()
    const { rows } = await createMockDataClient().getWatchlist()
    const series = rows[0].spark
    const wrapper = mount(Spark, { props: { series } })
    vi.clearAllMocks()
    await wrapper.setProps({ series: {
      ...series, points: series.points.slice(0, 4).map((point, index) => ({ ...point, value: [10, 20, null, 30][index] })),
    } })
    expect(context.clearRect).toHaveBeenCalledOnce()
    expect(context.moveTo).toHaveBeenCalledTimes(2)
    expect(context.moveTo).toHaveBeenLastCalledWith(68, 4)
    expect(context.lineTo).toHaveBeenCalledOnce()
    expect(context.arc).toHaveBeenCalledWith(68, 4, 2, 0, Math.PI * 2)
  })

  test.each([1, 2])('Spark handles %i constant observations without invalid coordinates', async (count) => {
    const context = recordCanvas()
    const { rows } = await createMockDataClient().getWatchlist()
    const series = rows[0].spark
    mount(Spark, { props: { series: { ...series, points: series.points.slice(0, count).map(point => ({ ...point, value: 10 })) } } })
    expect(context.moveTo).toHaveBeenCalledWith(count === 1 ? 36 : 4, 12)
    expect(context.arc).toHaveBeenCalledWith(count === 1 ? 36 : 68, 12, 2, 0, Math.PI * 2)
  })

  test('Spark clears old data, shows en dash for empty/null series, and draws a zero reference when needed', async () => {
    const context = recordCanvas()
    const { rows } = await createMockDataClient().getWatchlist()
    const series = rows[0].spark
    const wrapper = mount(Spark, { props: { series } })
    for (const points of [[], series.points.map(point => ({ ...point, value: null }))]) {
      vi.clearAllMocks()
      await wrapper.setProps({ series: { ...series, points } })
      expect(wrapper.get('.num').text()).toBe('–')
      expect(wrapper.get<HTMLCanvasElement>('canvas').element.style.display).toBe('none')
      expect(context.clearRect).toHaveBeenCalledOnce()
      expect(context.stroke).not.toHaveBeenCalled()
      expect(context.arc).not.toHaveBeenCalled()
    }
    vi.clearAllMocks()
    await wrapper.setProps({ series: { ...series, points: [
      { ...series.points[0], value: -10 }, { ...series.points[1], value: 10 },
    ] } })
    expect(wrapper.find('.num').exists()).toBe(false)
    expect(wrapper.get<HTMLCanvasElement>('canvas').element.style.display).not.toBe('none')
    expect(context.moveTo).toHaveBeenNthCalledWith(1, 4, 12)
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 68, 12)
    expect(context.stroke).toHaveBeenCalledTimes(2)
  })
})

describe('AC-004-5 calendar', () => {
  test('renders ascending dates and times supplied by the contract, including same-day releases', async () => {
    expect(moduleComponents['release-calendar']).toBe(ReleaseCalendar)
    window.__FAI_MOCK__ = { fixtures: { 'release-calendar': [
      calendarFixture[3], calendarFixture[2],
      { ...calendarFixture[1], id: 'sample-noon', ts: '2026-10-28T12:00:00+08:00', name: '午间发布（样例）' },
      calendarFixture[0], calendarFixture[1],
    ] } }
    const wrapper = renderModule('release-calendar')
    await flushPromises()
    const entries = wrapper.findAll('ol li')
    expect(entries.map(entry => entry.attributes('data-entry-id'))).toEqual([
      'sample-inventory-previous', 'sample-refinery', 'sample-noon', 'sample-inventory', 'sample-onwater',
    ])
    expect(entries.map(entry => entry.get('time').attributes('datetime'))).toEqual([
      '2026-10-27T16:00:00+08:00', '2026-10-28T09:00:00+08:00', '2026-10-28T12:00:00+08:00',
      '2026-10-28T22:30:00+08:00', '2026-10-29T10:00:00+08:00',
    ])
    for (const entry of entries) {
      const time = entry.get('time')
      expect(time.get('.date').text()).toBe(time.attributes('datetime')!.slice(0, 10))
      expect(time.text()).toContain(time.attributes('datetime')!.slice(11, 16))
      expect(time.classes()).toContain('num')
      expect(entry.get('.source').text()).toBe('合成日程')
    }
    expect(entries[2].get('.release-name').text()).toBe('午间发布（样例）')
    expect(entries[0].get('.freshness').text()).toBe('已更新')
    expect(entries[0].get('.status-dot').classes()).toContain('fresh')
    expect(entries[3].get('.freshness').text()).toBe('待更新')
    expect(entries[3].get('.status-dot').classes()).toContain('stale')
    expect(wrapper.find('.sem-market').exists()).toBe(false)
    for (const state of ['fresh', 'stale']) {
      expect(styleRule(calendarSource, `.status-dot.${state}`).background).toBe(`var(--fai-status-${state})`)
    }
  })
})

describe('AC-004-3 summary', () => {
  test.each(['supply-demand', 'logistics-onwater', 'positions', 'doc-catalog'] as const)('%s uses the shared shell with explicit domain-feature placeholder text', async (id) => {
    expect(moduleComponents[id]).toBe(ModuleSummary)
    const summary = await createMockDataClient().getModuleSummary(id)
    const wrapper = renderModule(id)
    await flushPromises()
    expect(wrapper.findComponent(ModuleShell).exists()).toBe(true)
    expect(wrapper.attributes('data-module-id')).toBe(id)
    expect(wrapper.attributes('data-state')).toBe('ready')
    expect(wrapper.get('.body').text()).toContain(summary.text)
    expect(wrapper.get('.body').text()).toContain('示例占位')
    expect(wrapper.get('.summary-note').text()).toBe('内容随 domain feature 交付。')
    expect(wrapper.get('header .right').text()).toBe(`截至 ${summary.asOf}`)
    expect(wrapper.get('header .badge').text()).toBe('样例')
    expect(wrapper.find('.sem-market').exists()).toBe(false)
    expect(wrapper.find('table, canvas').exists()).toBe(false)
  })

  test.each(Object.keys(moduleComponents) as ModuleId[])('%s preserves the shell structure, grid style and layout event forwarding', async (id) => {
    const moveDown = vi.fn()
    const remove = vi.fn()
    const viewed = vi.fn()
    const wrapper = renderModule(id, createMockDataClient(), {
      style: { gridColumn: 'span 1' }, canMoveUp: false, canMoveDown: true,
      onMoveDown: moveDown, onRemove: remove, onViewed: viewed,
    })
    await flushPromises()
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.classes()).toEqual(['fai-module', 'glass-module'])
    expect(wrapper.attributes('style')).toContain('grid-column: span 1')
    expect(Array.from(wrapper.get('header').element.children, child => child.tagName)).toEqual(['H3', 'SPAN', 'SPAN', 'SPAN', 'SPAN', 'NAV'])
    expect(wrapper.get('h3.title').text()).toBe(catalog.find(module => module.id === id)!.zh)
    const [up, down, removeButton] = wrapper.findAll('.actions button')
    expect(up.attributes('disabled')).toBeDefined()
    expect(down.attributes('disabled')).toBeUndefined()
    await down.trigger('click')
    await removeButton.trigger('click')
    expect(moveDown).toHaveBeenCalledOnce()
    expect(remove).toHaveBeenCalledOnce()
    expect(viewed).not.toHaveBeenCalled()
    await wrapper.get('.body').trigger('click')
    expect(viewed).toHaveBeenCalledOnce()
  })
})

describe.each([
  { id: 'market-board', suite: 'AC-004-5 board' },
  { id: 'watchlist', suite: 'AC-004-5 watchlist' },
  { id: 'release-calendar', suite: 'AC-004-5 calendar' },
  { id: 'supply-demand', suite: 'AC-004-3 summary' },
  { id: 'logistics-onwater', suite: 'AC-004-3 summary' },
  { id: 'positions', suite: 'AC-004-3 summary' },
  { id: 'doc-catalog', suite: 'AC-004-3 summary' },
] as const)('$suite $id states', ({ id }) => {
  test('shows loading until the slow contract resolves', async () => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/?scenario=slow')
    const wrapper = renderModule(id)
    expect(wrapper.attributes('data-state')).toBe('loading')
    expect(wrapper.get('.loading-state').text()).toBe('正在加载…')
    await vi.advanceTimersByTimeAsync(1499)
    expect(wrapper.attributes('data-state')).toBe('loading')
    await vi.advanceTimersByTimeAsync(1)
    expect(wrapper.attributes('data-state')).toBe('ready')
    expect(wrapper.find('.loading-state').exists()).toBe(false)
  })

  test('shows an explicit empty state from the real empty scenario', async () => {
    window.history.replaceState(null, '', '/?scenario=empty')
    const wrapper = renderModule(id)
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('empty')
    expect(wrapper.get('.empty-state').text()).toContain('暂无')
    expect(wrapper.find('table, canvas, ol').exists()).toBe(false)
  })

  test('shows contract errors with module diagnostics and retries through the shell', async () => {
    window.history.replaceState(null, '', '/?scenario=error')
    const wrapper = renderModule(id)
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('error')
    expect(wrapper.get('[role="alert"]').text()).toBe('样例数据源暂不可用，请重试。')
    expect(JSON.parse(wrapper.get('code').text())).toMatchObject({ moduleId: id, code: 'adapter_error' })
    expect(wrapper.get('[data-badge]').attributes('data-badge')).toBe('bad')
    window.history.replaceState(null, '', '/')
    await wrapper.setProps({ client: createMockDataClient() })
    const retry = wrapper.getComponent(ErrorState).findAll('button').find(button => button.text() === '重试')!
    await retry.trigger('click')
    await flushPromises()
    expect(wrapper.attributes('data-state')).toBe('ready')
    expect(wrapper.find('.error-state').exists()).toBe(false)
    expect(wrapper.get('[data-badge]').attributes('data-badge')).toBe('sample')
  })
})
