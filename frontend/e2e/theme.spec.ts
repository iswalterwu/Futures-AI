import { expect, test, type Page } from '@playwright/test'
import board from '../src/contracts/mock/fixtures/market-board.json' with { type: 'json' }
import { T } from '../src/design/generated/tokens.ts'

const seriesColors = [T.chart.line_0, T.chart.line_1, T.chart.line_2, T.chart.line_3, T.chart.line_4, T.chart.line_5, T.chart.line_6]

async function openSample(page: Page) {
  await page.goto('/workbench?scenario=normal')
  await expect(page.locator('.fai-module[data-module-id="market-board"]')).toHaveAttribute('data-state', 'ready')
  await expect(page.locator('[data-chart-id="market-board"] .plot svg')).toBeVisible()
  await expect.poll(() => page.evaluate(() => Boolean(window.__FAI_TEST__?.charts['market-board']))).toBe(true)
}

test('AC-006-3 sample renders the 60-day contract series with the registered theme, not the Spark canvas', async ({ page }) => {
  await openSample(page)
  const sample = page.locator('[data-chart-id="market-board"]')
  await expect(sample).toHaveAttribute('data-series-id', board.series.seriesId)
  await expect(sample.locator('figcaption')).toContainText('近 60 日收盘 · 样例')
  await expect(sample.locator('.unit')).toHaveText(board.series.unit)
  expect(await sample.evaluate(element => element.nextElementSibling?.classList.contains('board-scroll'))).toBe(true)
  const actual = await page.evaluate(() => {
    const chart = window.__FAI_TEST__!.charts['market-board']
    return { option: chart.getOption(), lineColor: chart.getVisual({ seriesIndex: 0 }, 'color'), disposed: chart.isDisposed() }
  })
  expect(actual.disposed).not.toBe(true)
  expect(actual.option).toMatchObject({
    darkMode: true,
    color: seriesColors,
    textStyle: { color: T.text.primary, fontFamily: T.font.sans },
    xAxis: [{ data: board.series.points.map(point => point.ts.slice(0, 10)), axisLabel: { color: T.text.muted, fontFamily: T.font.mono } }],
    yAxis: [{ axisLabel: { color: T.text.muted, fontFamily: T.font.mono } }],
    series: [{ id: board.series.seriesId, type: 'line', data: board.series.points.map(point => point.value) }],
  })
  expect(board.series.points).toHaveLength(60)
  expect(actual.lineColor).toBe(T.chart.line_0)
  await expect(page.locator('.fai-module[data-module-id="watchlist"] .spark canvas')).toHaveCount(3)
  expect(await page.evaluate(() => Object.keys(window.__FAI_TEST__!.charts))).toEqual(['market-board'])
})

test('AC-006-3 sample follows container resizing and releases its instance when leaving the workbench', async ({ page }) => {
  await page.setViewportSize({ width: T.window.width, height: T.window.height })
  await openSample(page)
  const instance = await page.evaluateHandle(() => window.__FAI_TEST__!.charts['market-board'])
  const previousWidth = await instance.evaluate(chart => chart.getWidth())
  const previousId = await instance.evaluate(chart => chart.id)
  await page.setViewportSize({ width: T.window.min_width, height: T.window.height })
  await expect.poll(() => instance.evaluate(chart => chart.getWidth())).not.toBe(previousWidth)
  await expect.poll(() => instance.evaluate(chart => Math.abs(chart.getWidth() - chart.getDom().clientWidth))).toBeLessThanOrEqual(1)
  expect(await instance.evaluate(chart => chart.getHeight())).toBeGreaterThan(0)

  await page.getByRole('link', { name: '价格', exact: true }).click()
  await expect(page).toHaveURL('/prices')
  await expect.poll(() => instance.evaluate(chart => chart.isDisposed())).toBe(true)
  expect(await page.evaluate(() => window.__FAI_TEST__?.charts['market-board'] === undefined)).toBe(true)
  await page.getByRole('link', { name: '工作台', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.__FAI_TEST__?.charts['market-board']?.getOption().color)).toEqual(seriesColors)
  expect(await page.evaluate(() => window.__FAI_TEST__!.charts['market-board'].id)).not.toBe(previousId)
  await instance.dispose()
})

for (const width of [T.window.width, T.window.min_width]) {
  test(`AC-001-4 AC-006-3 H-01 caption stays inline without changing other numeric layouts at ${width}`, async ({ page, browser }, testInfo) => {
    await page.setViewportSize({ width, height: T.window.height })
    await openSample(page)
    await expect(page.locator('.fai-module[data-module-id="watchlist"]')).toHaveAttribute('data-state', 'ready')
    await expect(page.locator('.focus-band')).toHaveAttribute('data-state', 'ready')
    const caption = page.locator('[data-chart-id="market-board"] figcaption')
    // H-02 still limits the narrow module viewport: capture the caption, not a clipped figure.
    await caption.scrollIntoViewIfNeeded()
    await caption.screenshot({ path: testInfo.outputPath(`sample-chart-${width}x${T.window.height}.png`) })
    console.log(`H-01 capture: Chrome ${browser.version()}, viewport ${width}x${T.window.height}, mock normal, figcaption`)

    const geometry = await caption.evaluate(element => {
      const label = element.firstElementChild!
      const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT)
      const segments = []
      while (walker.nextNode()) {
        const node = walker.currentNode
        if (!node.textContent?.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(node)
        segments.push({ text: node.textContent.trim(), rects: Array.from(range.getClientRects(), rect => rect.toJSON()) })
      }
      const number = getComputedStyle(label.querySelector('.num')!)
      const unit = element.querySelector('.unit')!
      return {
        segments,
        number: { display: number.display, font: number.fontFamily, variant: number.fontVariantNumeric, align: number.textAlign },
        unit: { text: unit.textContent, rect: unit.getBoundingClientRect().toJSON() },
        caption: element.getBoundingClientRect().toJSON(),
        captionOverflow: element.scrollWidth > element.clientWidth,
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }
    })
    expect(geometry.segments.map(segment => segment.text)).toEqual(['近', '60', '日收盘 · 样例'])
    for (const segment of geometry.segments) expect(segment.rects, segment.text).toHaveLength(1)
    const rects = geometry.segments.map(segment => segment.rects[0])
    // Font content boxes may differ: require a shared vertical interval, not identical tops.
    expect(Math.max(...rects.map(rect => rect.top)), 'caption text and number share one line')
      .toBeLessThan(Math.min(...rects.map(rect => rect.bottom)))
    expect(rects[0].right).toBeLessThanOrEqual(rects[1].left)
    expect(rects[1].right).toBeLessThanOrEqual(rects[2].left)
    expect(geometry.number.display).toBe('inline')
    const firstFont = (stack: string) => stack.split(',')[0].trim().replace(/^["']|["']$/g, '')
    expect(firstFont(geometry.number.font)).toBe(firstFont(T.font.mono))
    expect(geometry.number.variant).toContain('tabular-nums')
    expect(geometry.number.align).toBe('right')
    expect(geometry.unit.text).toBe(board.series.unit)
    expect(geometry.unit.rect.width).toBeGreaterThan(0)
    expect(geometry.unit.rect.height).toBeGreaterThan(0)
    expect(geometry.unit.rect.left).toBeGreaterThanOrEqual(geometry.caption.left)
    expect(geometry.unit.rect.right).toBeLessThanOrEqual(geometry.caption.right)
    expect(Math.max(geometry.unit.rect.top, ...rects.map(rect => rect.top)))
      .toBeLessThan(Math.min(geometry.unit.rect.bottom, ...rects.map(rect => rect.bottom)))
    expect(rects[2].right).toBeLessThanOrEqual(geometry.unit.rect.left)
    expect(geometry.captionOverflow).toBe(false)
    expect(geometry.pageOverflow).toBe(false)

    const numbers = await page.locator('span.num').evaluateAll(elements => elements
      .filter(element => !element.closest('.sample-chart figcaption'))
      .map(element => {
        const style = getComputedStyle(element)
        return {
          scope: element.closest('[data-module-id]')?.getAttribute('data-module-id')
            ?? (element.closest('.focus-band') ? 'focus' : ''),
          display: style.display, font: style.fontFamily, variant: style.fontVariantNumeric, align: style.textAlign,
        }
      }))
    expect(numbers.map(number => number.scope)).toEqual(expect.arrayContaining(['market-board', 'watchlist', 'focus']))
    for (const number of numbers) {
      expect(number.display, number.scope).toBe('block')
      expect(firstFont(number.font), number.scope).toBe(firstFont(T.font.mono))
      expect(number.variant, number.scope).toContain('tabular-nums')
      expect(number.align, number.scope).toBe('right')
    }
  })
}

test('AC-006-4 sample background remains transparent over the module glass', async ({ page }) => {
  await openSample(page)
  expect(await page.evaluate(() => window.__FAI_TEST__!.charts['market-board'].getOption().backgroundColor)).toBe('transparent')
  const plot = page.locator('[data-chart-id="market-board"] .plot')
  const backgrounds = await plot.evaluate(element => {
    const reference = document.createElement('div')
    reference.style.backgroundColor = 'transparent'
    element.append(reference)
    const transparent = getComputedStyle(reference).backgroundColor
    reference.remove()
    return { transparent, plot: getComputedStyle(element).backgroundColor, svg: getComputedStyle(element.querySelector('svg')!).backgroundColor }
  })
  expect(backgrounds.plot).toBe(backgrounds.transparent)
  expect(backgrounds.svg).toBe(backgrounds.transparent)
})
