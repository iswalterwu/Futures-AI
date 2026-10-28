import { readFileSync } from 'node:fs'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { getInstanceByDom } from 'echarts/core'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createMockDataClient } from '../../src/contracts/mock/index.ts'
import theme from '../../src/design/generated/echarts-theme.json'
import { T } from '../../src/design/generated/tokens.ts'
import tokens from '../../src/design/tokens.json'
import { FAI_DARK_THEME } from '../../src/design/theme.ts'
import SampleChart from '../../src/modules/market-board/SampleChart.vue'

const seriesColors = [T.chart.line_0, T.chart.line_1, T.chart.line_2, T.chart.line_3, T.chart.line_4, T.chart.line_5, T.chart.line_6]
const axes = ['categoryAxis', 'valueAxis', 'timeAxis', 'logAxis'] as const
const textStyles = [
  { name: 'text', actual: theme.textStyle, color: T.text.primary, font: T.font.sans, size: T.type.plot },
  { name: 'title', actual: theme.title.textStyle, color: T.text.primary, font: T.font.sans, size: T.type.card_t },
  { name: 'subtitle', actual: theme.title.subtextStyle, color: T.text.secondary, font: T.font.sans, size: T.type.card_sub },
  { name: 'legend', actual: theme.legend.textStyle, color: T.text.secondary, font: T.font.sans, size: T.type.card_sub },
  { name: 'tooltip', actual: theme.tooltip.textStyle, color: T.text.primary, font: T.font.sans, size: T.type.tip_title },
  ...axes.flatMap(name => [
    { name: `${name}.axisLabel`, actual: theme[name].axisLabel, color: T.text.muted, font: name === 'categoryAxis' ? T.font.sans : T.font.mono, size: T.type.tick },
    { name: `${name}.nameTextStyle`, actual: theme[name].nameTextStyle, color: T.text.secondary, font: T.font.sans, size: T.type.unit },
  ]),
]
const graphicTokens = tokens.filter(({ name }) => /^chart\.(?:line_\d+|cat_\d+|ord_\d+|region\.[a-z]+|pos|neg|other|band|mean|ref|model)$/.test(name))
const neutralExemptions = new Map([
  ['chart.other', { alpha: 1, reason: '明月珰：其他 / 残差有意退后，不作文字。' }],
  ['chart.region.apx', { alpha: 1, reason: '明月珰：亚太其他大区复用其他色，不作文字。' }],
  ['chart.region.ap', { alpha: 1, reason: '明月珰：AP 是 APX 的别名，不作文字。' }],
  ['chart.band', { alpha: T.chart.band_alpha, reason: '霜地：区间带以登记透明度合成后有意退后，不作文字。' }],
])
const textColors = [
  ...textStyles.map(({ name, actual }) => ({ name, color: actual.color })),
  { name: 'legend.inactiveColor', color: theme.legend.inactiveColor },
  { name: 'markLine.label', color: theme.markLine.label.color },
  ...tokens.filter(({ name }) => /^(?:text\.(?:primary|secondary|muted)|chart\.(?:pos|neg)|updown\.(?:up|down)|accent\.(?:amber|link))$/.test(name))
    .map(({ name, value }) => ({ name, color: String(value) })),
]

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.unstubAllEnvs()
  delete window.__FAI_TEST__
})

async function mountSample() {
  const { series } = await createMockDataClient().getMarketBoard()
  const wrapper = mount(SampleChart, { props: { chartId: 'market-board', series } })
  const chart = getInstanceByDom(wrapper.get<HTMLDivElement>('.plot').element)!
  expect(chart).toBeDefined()
  return { wrapper, chart, series }
}

// WCAG 相对亮度公式是测试判据；区间带必须先按 PALETTE_DARK#contrast 合成，不能测实色。
function contrast(foreground: string, alpha = 1): number {
  const rgb = (hex: string) => {
    expect(hex).toMatch(/^#[\da-f]{6}$/i)
    return [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16))
  }
  const luminance = (channels: number[]) => {
    const [r, g, b] = channels.map(channel => {
      const s = channel / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const background = rgb(T.chart.contrast_background)
  const composed = rgb(foreground).map((channel, i) => Math.round(alpha * channel + (1 - alpha) * background[i]))
  const fg = luminance(composed)
  const bg = luminance(background)
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05)
}

describe('AC-006-1', () => {
  test('registers the generated theme as fai-dark on a real ECharts instance', async () => {
    const { chart } = await mountSample()
    expect(FAI_DARK_THEME).toBe('fai-dark')
    expect(theme.darkMode).toBe(true)
    expect(theme.color).toEqual(seriesColors)
    expect(theme.backgroundColor).toBe(T.chart.canvas)
    expect(chart.getOption()).toMatchObject({
      darkMode: true,
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      textStyle: theme.textStyle,
      xAxis: [{ axisLabel: { color: T.text.muted }, axisLine: theme.categoryAxis.axisLine }],
      yAxis: [{ axisLabel: theme.valueAxis.axisLabel, splitLine: theme.valueAxis.splitLine }],
    })
    expect(chart.getVisual({ seriesIndex: 0 }, 'color')).toBe(T.chart.line_0)
  })

  test.each(textStyles)('$name color, font and size match tokens', ({ actual, color, font, size }) => {
    expect(actual).toMatchObject({ color, fontFamily: font, fontSize: parseFloat(size) })
  })

  test.each(axes)('%s axes, ticks and grid match tokens', (name) => {
    expect(theme[name].axisLine.lineStyle.color).toBe(T.chart.axis_line)
    expect(theme[name].axisTick.lineStyle.color).toBe(T.chart.axis_tick)
    expect(theme[name].splitLine.lineStyle.color).toBe(T.chart.grid)
  })

  test('legend, tooltip, mean and interval band retain their registered roles', () => {
    expect(theme.title.textStyle.fontWeight).toBe(T.weight.emphasis)
    expect(theme.legend.inactiveColor).toBe(T.text.muted)
    expect(theme.tooltip.backgroundColor).toBe(T.glass.drawer.surface)
    expect(theme.tooltip.borderColor).toBe(T.glass.drawer.border)
    expect(theme.markLine.lineStyle).toEqual({ color: T.chart.mean, type: 'dotted' })
    expect(theme.markLine.label).toEqual({ color: T.text.secondary, fontFamily: T.font.mono })
    expect(theme.markArea.itemStyle).toEqual({ color: T.chart.band, opacity: T.chart.band_alpha })
  })

  test('excludes all five retired palette colors from the theme', () => {
    const source = readFileSync('../design/charts/PALETTE_CORE.md', 'utf8')
    const block = source.match(/```json palette-retired\r?\n([\s\S]+?)\r?\n```/)
    expect(block).not.toBeNull()
    const retired = JSON.parse(block![1]) as { hex: string; name: string }[]
    expect(retired).toHaveLength(5)
    const serialized = JSON.stringify(theme).toLowerCase()
    for (const { hex, name } of retired) expect(serialized, name).not.toContain(hex.toLowerCase())
  })
})

describe('AC-006-2', () => {
  test('keeps the registered graphic and text thresholds at the acceptance minima', () => {
    expect(T.chart.contrast_graphic).toBe(3)
    expect(T.chart.contrast_text).toBe(4.5)
  })

  test.each(graphicTokens.filter(({ name }) => !neutralExemptions.has(name)))('$name has graphic contrast ≥ 3 on the worst single-layer card', ({ value }) => {
    expect(contrast(String(value))).toBeGreaterThanOrEqual(T.chart.contrast_graphic)
  })

  test.each(theme.color.map((color, index) => ({ name: `theme.color[${index}]`, color })))('$name actually emitted by the theme has contrast ≥ 3', ({ color }) => {
    expect(contrast(color)).toBeGreaterThanOrEqual(T.chart.contrast_graphic)
  })

  test.each(textColors)('$name has text contrast ≥ 4.5', ({ color }) => {
    expect(contrast(color)).toBeGreaterThanOrEqual(T.chart.contrast_text)
  })

  test.each([...neutralExemptions].map(([name, exemption]) => ({ name, ...exemption })))('$name is an explicit, non-text neutral exemption: $reason', ({ name, alpha, reason }) => {
    const token = graphicTokens.find(token => token.name === name)
    expect(token).toBeDefined()
    expect(reason).toContain('不作文字')
    expect(textColors.map(({ color }) => color)).not.toContain(token!.value)
    expect(contrast(String(token!.value), alpha)).toBeLessThan(T.chart.contrast_graphic)
  })
})

describe('AC-006-3 sample', () => {
  test('renders the contract’s 60-day closing series and exposes the real instance only in mock mode', async () => {
    const { wrapper, chart, series } = await mountSample()
    expect(series.points).toHaveLength(60)
    expect(window.__FAI_TEST__?.charts['market-board']).toBe(chart)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.get('figcaption').text()).toContain('近 60 日收盘 · 样例')
    expect(wrapper.get('.unit').text()).toBe(series.unit)
    expect(chart.getOption()).toMatchObject({
      color: seriesColors,
      xAxis: [{ data: series.points.map(point => point.ts.slice(0, 10)), axisLabel: { fontFamily: T.font.mono } }],
      series: [{ id: series.seriesId, type: 'line', data: series.points.map(point => point.value) }],
    })
  })

  test('updates the real instance without retaining old observations or connecting missing values', async () => {
    const { wrapper, chart, series } = await mountSample()
    const points = series.points.slice(-3).map((point, i) => ({ ...point, value: i === 1 ? null : point.value }))
    await wrapper.setProps({ series: { ...series, points } })
    expect(chart.getOption()).toMatchObject({
      color: seriesColors,
      xAxis: [{ data: points.map(point => point.ts.slice(0, 10)) }],
      series: [{ data: points.map(point => point.value), connectNulls: false }],
    })
    expect(window.__FAI_TEST__?.charts['market-board']).toBe(chart)
    await wrapper.setProps({ series: { ...series, points: [] } })
    expect(chart.getOption()).toMatchObject({ series: [{ data: [] }] })
  })

  test('disconnects resizing, disposes the instance and removes the hook on unmount', async () => {
    const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
    const { wrapper, chart } = await mountSample()
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalledOnce()
    expect(chart.isDisposed()).toBe(true)
    expect(window.__FAI_TEST__?.charts['market-board']).toBeUndefined()
  })

  test('does not create test hooks in real mode', async () => {
    vi.stubEnv('VITE_DATA_MODE', 'real')
    const { chart } = await mountSample()
    expect(chart.getVisual({ seriesIndex: 0 }, 'color')).toBe(T.chart.line_0)
    expect(window.__FAI_TEST__).toBeUndefined()
  })
})

test('AC-006-4 sample keeps the generated and runtime backgrounds transparent', async () => {
  const { chart } = await mountSample()
  expect(theme.backgroundColor).toBe('transparent')
  expect(chart.getOption().backgroundColor).toBe('transparent')
})
