import { readFileSync } from 'node:fs'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import type { Figure, Semantic } from '../../src/contracts/types.ts'
import Kpi from '../../src/shared/components/Kpi.vue'
import kpiSource from '../../src/shared/components/Kpi.vue?raw'
import Num from '../../src/shared/components/Num.vue'
import numSource from '../../src/shared/components/Num.vue?raw'

const baseCss = readFileSync('src/design/base.css', 'utf8')
const glassCss = readFileSync('src/design/glass.css', 'utf8')
const updownCss = readFileSync('src/design/updown.css', 'utf8')
const numCss = readFileSync('src/shared/num.css', 'utf8')
const kpiCss = kpiSource.split('<style scoped>')[1].split('</style>')[0]
const figure: Figure = {
  label: '商业库存',
  value: 2460.5,
  unit: '万吨',
  decimals: 1,
  freq: '1w',
  delta: -35,
  deltaKind: 'abs',
  semantic: 'analysis',
  asOf: '2026-10-28T09:00:00+08:00',
}

enableAutoUnmount(afterEach)

function styleRules(css: string): CSSStyleRule[] {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(css)
  return Array.from(sheet.cssRules).filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
}

function declarations(css: string, selector: string): CSSStyleDeclaration {
  const rule = styleRules(css).find((rule) => rule.selectorText.replace(/\s+/g, ' ') === selector)
  expect(rule, `Missing style rule: ${selector}`).toBeDefined()
  return rule!.style
}

describe('AC-001-4 typography', () => {
  test('renders ordinary numbers with the mono, tabular, right-aligned num class', () => {
    const wrapper = mount(Num, { props: { value: 1234.5, decimals: 2, semantic: 'analysis', unit: '元/吨' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('num')
    expect(wrapper.text()).toBe('1,234.50 元/吨')
    expect(wrapper.attributes('style')).toBeUndefined()

    const style = declarations(numCss, '.num')
    expect(style.fontFamily).toBe('var(--fai-font-mono)')
    expect(style.fontVariantNumeric).toBe('tabular-nums')
    expect(style.textAlign).toBe('right')
    expect(declarations(numCss, 'span.num').display).toBe('block')
  })

  test('keeps only the KPI large value serif, with sans label and mono unit and delta', () => {
    const wrapper = mount(Kpi, { props: { figure } })
    expect(wrapper.get('.kpi-label').text()).toBe('商业库存')
    expect(wrapper.get('.kpi-value').text()).toBe('2,460.5')
    expect(wrapper.get('.kpi-value').classes()).not.toContain('num')
    expect(wrapper.get('.unit').text()).toBe('万吨')
    expect(wrapper.getComponent(Num).text()).toBe('-35.0')
    expect(wrapper.getComponent(Num).classes()).toContain('num')

    const valueStyle = declarations(kpiCss, '.kpi-value')
    expect(valueStyle.fontFamily).toBe('var(--fai-font-serif)')
    expect(valueStyle.fontSize).toBe('var(--fai-type-kpi)')
    expect(valueStyle.fontVariantNumeric).toBe('tabular-nums')
    expect(valueStyle.textAlign).toBe('right')
    expect(declarations(kpiCss, '.kpi-label').fontFamily).toBe('var(--fai-font-sans)')
    expect(declarations(kpiCss, '.unit').fontFamily).toBe('var(--fai-font-mono)')
    expect(declarations(numCss, '.num').fontFamily).toBe('var(--fai-font-mono)')
  })

  test('assigns base font roles without promoting module titles to serif', () => {
    expect(declarations(baseCss, 'html').fontFamily).toBe('var(--fai-font-sans)')
    expect(declarations(baseCss, 'html').fontSize).toBe('var(--fai-type-body)')
    expect(declarations(baseCss, 'html').lineHeight).toBe('var(--fai-type-body-lh)')
    expect(declarations(baseCss, 'button, input, select, textarea').fontFamily).toBe('var(--fai-font-sans)')
    expect(declarations(baseCss, '.fai-module > header > .title').fontFamily).toBe('var(--fai-font-sans)')
    expect(declarations(baseCss, '.fai-module > header > .title').fontSize).toBe('var(--fai-type-card-t)')
    expect(declarations(baseCss, 'h1, .page-title').fontFamily).toBe('var(--fai-font-serif)')
    expect(declarations(baseCss, '.wordmark').fontFamily).toBe('var(--fai-font-serif)')
  })

  test('uses small uppercase tracked English subtitles and mono code, units and ticker', () => {
    const english = declarations(baseCss, '.en')
    expect(english.fontSize).toBe('var(--fai-type-en-sub)')
    expect(english.letterSpacing).toBe('var(--fai-tracking-en-sub)')
    expect(english.textTransform).toBe('uppercase')
    expect(declarations(baseCss, 'code, pre, kbd, samp, .unit, .ticker').fontFamily).toBe('var(--fai-font-mono)')
    expect(declarations(baseCss, '.unit').fontSize).toBe('var(--fai-type-unit)')
    expect(declarations(baseCss, '.ticker').fontSize).toBe('var(--fai-type-ticker)')
  })

  test.each([
    { changes: {}, text: '-0.46%', tone: 'down' },
    { changes: { delta: 0.6 }, text: '+0.60%', tone: 'up' },
    { changes: { delta: -0.004 }, text: '0.00%', tone: 'neutral' },
    { changes: { delta: -0 }, text: '0.00%', tone: 'neutral' },
    { changes: { deltaDecimals: 0 }, text: '0%', tone: 'neutral' },
    { changes: { delta: -0.004, deltaDecimals: 3 }, text: '-0.004%', tone: 'down' },
    { changes: { deltaKind: 'abs' }, text: '0', tone: 'neutral' },
    { changes: { deltaKind: 'abs', deltaDecimals: 2 }, text: '-0.46', tone: 'down' },
    { changes: { deltaKind: undefined }, text: '0', tone: 'neutral' },
    { changes: { delta: null }, text: '–', tone: 'neutral' },
  ] as const)('R1-01 separates KPI price precision from delta precision: $text / $tone', ({ changes, text, tone }) => {
    const wrapper = mount(Kpi, { props: { figure: {
      ...figure, value: 4320, decimals: 0, delta: -0.46, deltaKind: 'pct', ...changes,
    } } })
    expect(wrapper.get('.kpi-value').text()).toBe('4,320')
    expect(wrapper.get('.kpi-delta').text()).toBe(text)
    expect(wrapper.get('.kpi-delta').classes()).toContain(`is-${tone}`)
    expect(wrapper.get('.kpi-delta').classes()).toContain('sem-analysis')
  })

  test('distinguishes absent KPI delta from missing and rounded-zero delta', async () => {
    const wrapper = mount(Kpi, { props: { figure: { ...figure, value: null, delta: undefined } } })
    expect(wrapper.get('.kpi-value').text()).toBe('–')
    expect(wrapper.findComponent(Num).exists()).toBe(false)

    await wrapper.setProps({ figure: { ...figure, delta: null } })
    expect(wrapper.get('.kpi-value').text()).toBe('2,460.5')
    expect(wrapper.getComponent(Num).text()).toBe('–')
    expect(wrapper.getComponent(Num).classes()).toContain('is-neutral')

    await wrapper.setProps({ figure: { ...figure, value: -0.01, delta: -0.01 } })
    expect(wrapper.get('.kpi-value').text()).toBe('0.0')
    expect(wrapper.getComponent(Num).text()).toBe('0.0')
    expect(wrapper.getComponent(Num).classes()).toContain('is-neutral')
  })
})

describe('AC-001-5 num', () => {
  describe.each(['market', 'analysis'] as const)('%s semantic', (semantic: Semantic) => {
    test.each([
      { value: 1.5, text: '+1.50%', tone: 'up' },
      { value: -1.5, text: '-1.50%', tone: 'down' },
      { value: 0, text: '0.00%', tone: 'neutral' },
      { value: -0.004, text: '0.00%', tone: 'neutral' },
      { value: null, text: '–', tone: 'neutral' },
    ])('renders $value using classes only', ({ value, text, tone }) => {
      const wrapper = mount(Num, { props: { value, decimals: 2, semantic, delta: true, kind: 'pct' } })
      expect(wrapper.classes()).toEqual(['num', `sem-${semantic}`, `is-${tone}`])
      expect(wrapper.text()).toBe(text)
      expect(wrapper.attributes('style')).toBeUndefined()
      expect(wrapper.element.children).toHaveLength(0)
    })
  })

  test('updates tone, precision, format and semantic without leaving stale classes', async () => {
    const wrapper = mount(Num, { props: { value: 0.04, decimals: 2, semantic: 'market', delta: true } })
    expect(wrapper.text()).toBe('+0.04')
    expect(wrapper.classes()).toEqual(['num', 'sem-market', 'is-up'])

    await wrapper.setProps({ decimals: 1 })
    expect(wrapper.text()).toBe('0.0')
    expect(wrapper.classes()).toEqual(['num', 'sem-market', 'is-neutral'])

    await wrapper.setProps({ value: -3.2, semantic: 'analysis', delta: false, unit: '万吨' })
    expect(wrapper.text()).toBe('-3.2 万吨')
    expect(wrapper.classes()).toEqual(['num', 'sem-analysis', 'is-down'])
  })

  test('passes the declared KPI delta semantic and pct kind to the real Num component', async () => {
    const wrapper = mount(Kpi, { props: { figure: { ...figure, semantic: 'market', delta: 1.5, deltaKind: 'pct' } } })
    expect(wrapper.getComponent(Num).text()).toBe('+1.50%')
    expect(wrapper.getComponent(Num).classes()).toContain('sem-market')
    expect(wrapper.getComponent(Num).classes()).toContain('is-up')
    expect(wrapper.get('.kpi-value').attributes('class')).toBe('kpi-value')

    await wrapper.setProps({ figure })
    expect(wrapper.getComponent(Num).text()).toBe('-35.0')
    expect(wrapper.getComponent(Num).classes()).toContain('sem-analysis')
    expect(wrapper.getComponent(Num).classes()).not.toContain('sem-market')
  })

  test('maps analysis gain/loss to chart tokens and zeros to neutral text', () => {
    expect(declarations(numCss, '.sem-analysis.is-up').color).toBe('var(--fai-chart-pos)')
    expect(declarations(numCss, '.sem-analysis.is-down').color).toBe('var(--fai-chart-neg)')
    expect(declarations(numCss, '.num.is-neutral').color).toBe('var(--fai-text-primary)')
    expect(numCss).not.toContain('sem-market')
    expect(numCss).not.toContain('--fai-updown-')
  })

  test('keeps market colors in updown.css with color-only declarations and no global import', () => {
    const rules = styleRules(updownCss)
    expect(rules.map((rule) => rule.selectorText)).toEqual(['.sem-market.is-up', '.sem-market.is-down'])
    expect(rules[0].style.color).toBe('var(--fai-updown-up)')
    expect(rules[1].style.color).toBe('var(--fai-updown-down)')
    for (const rule of rules) {
      expect(rule.style.length).toBe(1)
      expect(rule.style.item(0)).toBe('color')
    }
    for (const source of [baseCss, numCss, numSource, kpiSource]) {
      expect(source).not.toContain('updown.css')
      expect(source).not.toContain('--fai-updown-')
    }
  })
})

test('AC-001-3 glass defines only the three registered layers using token variables', () => {
  const rules = styleRules(glassCss)
  expect(rules.map((rule) => rule.selectorText)).toEqual(['.glass-focus', '.glass-module', '.glass-drawer'])
  for (const layer of ['focus', 'module', 'drawer']) {
    const style = declarations(glassCss, `.glass-${layer}`)
    expect(style.getPropertyValue('background')).toBe(`var(--fai-glass-${layer}-surface)`)
    // happy-dom 会丢弃 border 简写中的 var，边色直接核对该层的真实声明。
    const block = glassCss.match(new RegExp(`\\.glass-${layer}\\s*\\{([^}]+)\\}`))![1]
    expect(block).toContain(`border: thin solid var(--fai-glass-${layer}-border);`)
    expect(style.getPropertyValue('border-radius')).toBe('var(--fai-radius-base)')
    expect(style.getPropertyValue('backdrop-filter')).toBe(`blur(var(--fai-glass-${layer}-blur))`)
  }
})
