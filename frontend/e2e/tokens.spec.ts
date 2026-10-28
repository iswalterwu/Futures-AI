import { expect, test, type Page } from '@playwright/test'
import catalog from '../src/contracts/mock/fixtures/module-catalog.json' with { type: 'json' }
import tokens from '../src/design/tokens.json' with { type: 'json' }
import { T } from '../src/design/generated/tokens.ts'

const registeredTokens = Object.fromEntries(tokens.map(({ name, value }) => [
  `--fai-${name.replace(/[._]/g, '-')}`, String(value),
]))

async function readRuntimeTokens(page: Page) {
  return page.evaluate(names => {
    const root = getComputedStyle(document.documentElement)
    return Object.fromEntries(names.map(name => [name, root.getPropertyValue(name).trim()]))
  }, Object.keys(registeredTokens))
}

function firstFont(stack: string) {
  return stack.split(',')[0].trim().replace(/^["']|["']$/g, '')
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: T.window.width, height: T.window.height })
  await page.goto('/workbench?scenario=normal')
  await expect(page.locator('.module-grid > .fai-module[data-state="ready"]')).toHaveCount(catalog.length)
  await expect(page.locator('.focus-band')).toHaveAttribute('data-state', 'ready')
})

test('AC-001-1 every registered token matches the live root custom property; an injected override is detected', async ({ page }) => {
  expect(await readRuntimeTokens(page)).toEqual(registeredTokens)
  const override = await page.addStyleTag({
    content: `:root { --fai-text-primary: ${T.text.secondary} !important; }`,
  })
  const overridden = await readRuntimeTokens(page)
  expect(Object.keys(registeredTokens).filter(name => overridden[name] !== registeredTokens[name])).toEqual(['--fai-text-primary'])
  expect(overridden['--fai-text-primary']).toBe(T.text.secondary)
  await override.evaluate(element => { element.parentNode!.removeChild(element) })
  expect(await readRuntimeTokens(page)).toEqual(registeredTokens)
})

test('AC-001-1 AC-001-4 computed font-family first entries follow KPI, title, body and numeric roles', async ({ page }) => {
  for (const { selector, stack } of [
    { selector: '.kpi-value', stack: T.font.serif },
    { selector: 'h1', stack: T.font.serif },
    { selector: '.wordmark', stack: T.font.serif },
    { selector: '.fai-module > header > .title', stack: T.font.sans },
    { selector: '.focus-conclusions li', stack: T.font.sans },
    { selector: '.module-summary p', stack: T.font.sans },
    { selector: '.nav-link', stack: T.font.sans },
    { selector: 'button', stack: T.font.sans },
    { selector: '.contract-name', stack: T.font.sans },
    { selector: '.num', stack: T.font.mono },
    { selector: '.unit', stack: T.font.mono },
    { selector: '.ticker', stack: T.font.mono },
  ]) {
    const families = await page.locator(selector).evaluateAll(elements => elements.map(element => getComputedStyle(element).fontFamily))
    expect(families.length, selector).toBeGreaterThan(0)
    for (const family of families) expect(firstFont(family), selector).toBe(firstFont(stack))
  }
  const numbers = await page.locator('.num, .kpi-value').evaluateAll(elements => elements.map(element => {
    const style = getComputedStyle(element)
    return { text: element.textContent, variant: style.fontVariantNumeric, alignment: style.textAlign }
  }))
  expect(numbers.length).toBeGreaterThan(0)
  for (const number of numbers) {
    expect(number.variant, number.text ?? '').toContain('tabular-nums')
    expect(number.alignment, number.text ?? '').toBe('right')
  }
  await page.goto('/workbench?scenario=error')
  const diagnostic = page.locator('.fai-module[data-module-id="market-board"] .error-state code')
  await expect(diagnostic).toBeVisible()
  expect(firstFont(await diagnostic.evaluate(element => getComputedStyle(element).fontFamily))).toBe(firstFont(T.font.mono))
})

test('AC-001-5 market semantics stay in the three registered containers and up/down colors never paint their backgrounds', async ({ page }) => {
  for (const selector of [
    '.fai-module[data-module-id="market-board"]',
    '.fai-module[data-module-id="watchlist"]',
    '.focus-band .focus-segment[data-semantic="market"]',
  ]) {
    expect(await page.locator(`${selector} .sem-market`).count(), selector).toBeGreaterThan(0)
  }
  await expect(page.locator('.focus-segment[data-semantic="analysis"] .sem-market')).toHaveCount(0)
  await expect(page.locator('.focus-segment[data-semantic="market"] .sem-analysis')).toHaveCount(0)

  const violations = await page.locator('.sem-market').evaluateAll((elements, palette) => {
    const reference = document.createElement('span')
    document.body.append(reference)
    const colors = Object.fromEntries(Object.entries(palette).map(([tone, value]) => {
      reference.style.color = value
      return [tone, getComputedStyle(reference).color]
    }))
    reference.remove()
    const allowed = [
      '.fai-module[data-module-id="market-board"]',
      '.fai-module[data-module-id="watchlist"]',
      '.focus-band .focus-segment[data-semantic="market"]',
    ].join(', ')
    const errors: string[] = []
    for (const element of elements) {
      const label = element.textContent?.trim() ?? ''
      if (!element.closest(allowed)) errors.push(`Unregistered market element: ${label}`)
      const tone = ['up', 'down', 'neutral'].find(tone => element.classList.contains(`is-${tone}`))
      if (!tone || getComputedStyle(element).color !== colors[tone]) errors.push(`Incorrect market text color: ${label}`)
      // 字色节点往往透明，连同祖先检查才能发现把涨跌色涂在卡面上的错误。
      for (let surface: Element | null = element; surface; surface = surface.parentElement) {
        const background = getComputedStyle(surface).backgroundColor
        if (background === colors.up || background === colors.down) {
          errors.push(`Market background on ${surface.tagName}.${surface.className}: ${label}`)
          break
        }
      }
    }
    return errors
  }, { up: T.updown.up, down: T.updown.down, neutral: T.text.primary })
  expect(violations).toEqual([])
})
