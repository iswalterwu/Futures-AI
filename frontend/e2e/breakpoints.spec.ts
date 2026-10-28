import { expect, test, type Page } from '@playwright/test'
import catalog from '../src/contracts/mock/fixtures/module-catalog.json' with { type: 'json' }
import { T } from '../src/design/generated/tokens.ts'

const { breakpoint: B, layout: L, window: W } = T
const viewports = [
  { width: W.min_width, collapsed: true, cols: L.grid_narrow, focusCards: L.focus_compact },
  { width: B.shell_collapse - 1, collapsed: true, cols: L.grid_narrow, focusCards: L.focus_compact },
  { width: B.shell_collapse + 1, collapsed: false, cols: L.grid_default, focusCards: L.focus_compact },
  { width: B.focus_expand - 1, collapsed: false, cols: L.grid_default, focusCards: L.focus_compact },
  { width: B.focus_expand + 1, collapsed: false, cols: L.grid_default, focusCards: L.focus_expanded },
  { width: B.grid_three - 1, collapsed: false, cols: L.grid_default, focusCards: L.focus_expanded },
  { width: B.grid_three + 1, collapsed: false, cols: L.grid_three, focusCards: L.focus_expanded },
  { width: B.grid_four - 1, collapsed: false, cols: L.grid_three, focusCards: L.focus_expanded },
  { width: B.grid_four + 1, collapsed: false, cols: L.grid_four, focusCards: L.focus_expanded },
  { width: W.width, collapsed: false, cols: L.grid_three, focusCards: L.focus_expanded },
  { width: B.shell_collapse, collapsed: false, cols: L.grid_default, focusCards: L.focus_compact },
  { width: B.focus_expand, collapsed: false, cols: L.grid_default, focusCards: L.focus_expanded },
  { width: B.grid_three, collapsed: false, cols: L.grid_three, focusCards: L.focus_expanded },
  { width: B.grid_four, collapsed: false, cols: L.grid_four, focusCards: L.focus_expanded },
]

async function expectViewport(page: Page, viewport: typeof viewports[number]) {
  const shell = page.locator('.shell')
  const rail = page.locator('.rail')
  const grid = page.locator('.module-grid')
  await expect(shell).toHaveAttribute('data-viewport-collapsed', String(viewport.collapsed))
  await expect(rail).toHaveAttribute('data-viewport-collapsed', String(viewport.collapsed))
  await expect(shell).toHaveCSS('min-width', `${W.min_width}px`)
  await expect(grid.locator(':scope > .fai-module[data-state="ready"]')).toHaveCount(catalog.length)
  await expect.poll(() => grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(viewport.cols)
  await expect(page.locator('.focus-band[data-state="ready"] .focus-card')).toHaveCount(viewport.focusCards)
  for (const module of catalog) {
    await expect(grid.locator(`[data-module-id="${module.id}"]`)).toHaveCSS('grid-column', `span ${Math.min(module.defaultSpan, viewport.cols)}`)
  }

  const positions = await shell.evaluate(element => {
    const rail = element.querySelector('.rail')!.getBoundingClientRect()
    const content = element.querySelector('.content')!.getBoundingClientRect()
    return { railRight: rail.right, railBottom: rail.bottom, contentLeft: content.left, contentTop: content.top }
  })
  if (viewport.collapsed) {
    await expect(rail.locator('.nav-list')).toHaveCSS('display', 'flex')
    await expect(rail.locator('.rail-toggle')).toBeHidden()
    await expect(rail.locator('.fixed-link .full-label').first()).toBeVisible()
    await expect(rail.locator('.fixed-link .full-label').last()).toBeVisible()
    expect(positions.railBottom).toBeCloseTo(positions.contentTop)
  } else {
    await expect(rail.locator('.nav-list')).toHaveCSS('display', 'block')
    await expect(rail.locator('.rail-toggle')).toBeVisible()
    expect(positions.railRight).toBeCloseTo(positions.contentLeft)
  }
  expect(await page.evaluate(() => ({
    document: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    body: document.body.scrollWidth <= window.innerWidth,
  }))).toEqual({ document: true, body: true })
  expect(await page.locator('.modules-container').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
}

for (const viewport of viewports) {
  test(`AC-002-6 ${viewport.width}×${W.height}: navigation, ${viewport.cols} columns, ${viewport.focusCards} focus cards and no overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: W.height })
    await page.goto('/workbench?scenario=normal')
    await expectViewport(page, viewport)
  })
}

test('AC-002-6 live resizing in both directions keeps all viewport consumers synchronized', async ({ page }) => {
  await page.goto('/workbench?scenario=normal')
  const ascending = viewports.slice(0, 9)
  for (const viewport of [...ascending, ...[...ascending].reverse()]) {
    await page.setViewportSize({ width: viewport.width, height: W.height })
    await expectViewport(page, viewport)
  }
})

test('AC-002-6 top navigation does not overwrite the saved rail preference and viewport changes survive route remounts', async ({ page }) => {
  const wide = viewports[9]
  const narrow = viewports[0]
  await page.setViewportSize({ width: wide.width, height: W.height })
  await page.goto('/workbench?scenario=normal')
  await page.getByRole('button', { name: '收起侧栏', exact: true }).click()
  const rail = page.locator('.rail')
  await expect(rail).toHaveAttribute('data-collapsed', 'true')
  await page.setViewportSize({ width: narrow.width, height: W.height })
  await expectViewport(page, narrow)
  expect(await page.evaluate(() => localStorage.getItem('fai.rail'))).toBe('collapsed')
  await page.reload()
  await expectViewport(page, narrow)
  await expect(rail).toHaveAttribute('data-collapsed', 'true')

  await page.getByRole('link', { name: '价格', exact: true }).click()
  await page.setViewportSize({ width: wide.width, height: W.height })
  await expect(rail).toHaveAttribute('data-viewport-collapsed', 'false')
  await expect(page.getByRole('button', { name: '展开侧栏', exact: true })).toBeVisible()
  await expect(rail.locator('.fixed-link .full-label').first()).toBeHidden()
  await page.getByRole('link', { name: '工作台', exact: true }).click()
  await expectViewport(page, wide)
  await page.getByRole('button', { name: '展开侧栏', exact: true }).click()
  await expect(rail).toHaveCSS('width', T.layout.rail_width)
  await page.setViewportSize({ width: narrow.width, height: W.height })
  await expectViewport(page, narrow)
  await page.setViewportSize({ width: wide.width, height: W.height })
  await expectViewport(page, wide)
  await expect(rail).toHaveAttribute('data-collapsed', 'false')
  expect(await page.evaluate(() => localStorage.getItem('fai.rail'))).toBe('expanded')
})
