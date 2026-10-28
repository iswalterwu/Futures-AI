import { expect, test, type Page } from '@playwright/test'
import catalog from '../src/contracts/mock/fixtures/module-catalog.json' with { type: 'json' }

const defaultOrder = catalog.map(module => module.id)

async function expectOrder(page: Page, order: string[]) {
  const modules = page.locator('.module-grid > .fai-module')
  await expect(modules).toHaveCount(order.length)
  await expect.poll(() => modules.evaluateAll(elements => elements.map(element => element.getAttribute('data-module-id')))).toEqual(order)
}

test('AC-004-1 default layout and drawer list all seven contract modules with descriptions and membership', async ({ page }) => {
  await page.goto('/workbench')
  await expectOrder(page, defaultOrder)
  const opener = page.getByRole('button', { name: '模块库', exact: true })
  await opener.click()
  const library = page.getByRole('dialog', { name: '模块库' })
  await expect(library).toBeVisible()
  await expect(library).toHaveClass(/glass-drawer/)
  await expect(opener).toHaveAttribute('aria-expanded', 'true')
  const entries = library.locator('.library-entry')
  await expect(entries).toHaveCount(7)
  expect(await entries.locator('h3').allTextContents()).toEqual(catalog.map(module => module.zh))
  for (const module of catalog) {
    const entry = library.locator(`[data-module-id="${module.id}"]`)
    await expect(entry.locator('.en')).toHaveText(module.en)
    await expect(entry.locator('.description')).toHaveText(module.description)
    await expect(entry.locator('.membership')).toHaveText('已在工作台')
    await expect(entry).toHaveAttribute('data-added', 'true')
    await expect(entry.getByRole('button', { name: `添加${module.zh}`, exact: true })).toBeDisabled()
  }
  await expect(library.getByText('今日焦点', { exact: true })).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(library).toHaveCount(0)
  await expect(opener).toBeFocused()
  await expect(opener).toHaveAttribute('aria-expanded', 'false')
  await opener.click()
  await page.getByRole('button', { name: '关闭模块库' }).click()
  await expect(library).toHaveCount(0)
  await expectOrder(page, defaultOrder)
})

test('AC-004-1 catalog overrides drive title, description, order and span without registry metadata', async ({ page }) => {
  const custom = catalog.map(module => module.id === 'market-board' ? {
    ...module, zh: '契约行情标题', en: 'Contract market', description: '来自契约的模块说明。', order: 8, defaultSpan: 8,
  } : module)
  await page.addInitScript(items => {
    window.__FAI_MOCK__ = { fixtures: { 'module-catalog': items } }
  }, custom)
  await page.setViewportSize({ width: 1501, height: 900 })
  await page.goto('/workbench')
  await expectOrder(page, [...defaultOrder.slice(1), 'market-board'])
  const module = page.locator('.fai-module[data-module-id="market-board"]')
  await expect(module.locator('h3.title')).toHaveText('契约行情标题')
  await expect(module.locator('header > .en')).toHaveText('Contract market')
  await expect(module).toHaveCSS('grid-column', 'span 4')
  await page.getByRole('button', { name: '模块库', exact: true }).click()
  const entry = page.getByRole('dialog').locator('[data-module-id="market-board"]')
  await expect(entry.locator('h3')).toHaveText('契约行情标题')
  await expect(entry.locator('.description')).toHaveText('来自契约的模块说明。')
})

test('AC-004-1 responsive grid has 1/2/3/4 columns and clamps every module span without horizontal overflow', async ({ page }) => {
  await page.goto('/workbench')
  await expectOrder(page, defaultOrder)
  const grid = page.locator('.module-grid')
  for (const [width, columns] of [
    [960, 1], [979, 1], [980, 2], [981, 2], [1239, 2], [1241, 2],
    [1399, 2], [1400, 3], [1401, 3], [1440, 3], [1499, 3], [1500, 4], [1501, 4], [960, 1],
  ]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(() => grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(columns)
    for (const module of catalog) {
      await expect(grid.locator(`[data-module-id="${module.id}"]`)).toHaveCSS('grid-column', `span ${Math.min(module.defaultSpan, columns)}`)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    expect(await page.locator('.modules-container').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  }
})

test('AC-004-2 move down/up, remove and append persist across reload and navigation', async ({ page }) => {
  await page.goto('/workbench')
  await expectOrder(page, defaultOrder)
  await expect(page.getByRole('button', { name: '上移行情价格', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: '下移数据发布日历', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: '下移库存/供需指标', exact: true }).click()
  const moved = ['market-board', 'logistics-onwater', 'supply-demand', ...defaultOrder.slice(3)]
  await expectOrder(page, moved)
  await page.reload()
  await expectOrder(page, moved)
  await page.getByRole('button', { name: '上移库存/供需指标', exact: true }).click()
  await expectOrder(page, defaultOrder)
  await page.reload()
  await expectOrder(page, defaultOrder)
  await page.getByRole('button', { name: '移除库存/供需指标', exact: true }).click()
  const removed = defaultOrder.filter(id => id !== 'supply-demand')
  await expectOrder(page, removed)
  await page.reload()
  await expectOrder(page, removed)
  await page.getByRole('button', { name: '模块库', exact: true }).click()
  const entry = page.getByRole('dialog').locator('[data-module-id="supply-demand"]')
  await expect(entry).toHaveAttribute('data-added', 'false')
  await expect(entry.locator('.membership')).toHaveText('未添加')
  const add = entry.getByRole('button', { name: '添加库存/供需指标', exact: true })
  await expect(add).toBeEnabled()
  await add.click()
  await expect(add).toBeDisabled()
  await expect(entry.locator('.membership')).toHaveText('已在工作台')
  await page.getByRole('button', { name: '关闭模块库' }).click()
  const appended = [...removed, 'supply-demand']
  await expectOrder(page, appended)
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('fai.layout')!))).toEqual(appended)
  await page.reload()
  await expectOrder(page, appended)
  await page.getByRole('link', { name: '价格', exact: true }).click()
  await page.getByRole('link', { name: '工作台', exact: true }).click()
  await expectOrder(page, appended)
})

test('AC-004-2 removing all modules preserves an empty layout and the library can add one back', async ({ page }) => {
  await page.goto('/workbench')
  await expectOrder(page, defaultOrder)
  for (const module of catalog) {
    await page.getByRole('button', { name: `移除${module.zh}`, exact: true }).click()
  }
  await expectOrder(page, [])
  await expect(page.getByText('工作台暂无模块，请从模块库添加。')).toBeVisible()
  await page.reload()
  await expectOrder(page, [])
  await expect(page.getByText('工作台暂无模块，请从模块库添加。')).toBeVisible()
  await expect(page.getByRole('heading', { name: '今日焦点 Daily focus' })).toBeVisible()
  await page.getByRole('button', { name: '模块库', exact: true }).click()
  await expect(page.getByRole('dialog').locator('.library-entry[data-added="false"]')).toHaveCount(7)
  await page.getByRole('button', { name: '添加关注列表', exact: true }).click()
  await page.getByRole('button', { name: '关闭模块库' }).click()
  await expectOrder(page, ['watchlist'])
  await page.reload()
  await expectOrder(page, ['watchlist'])
})

test('AC-004-3 page every module obeys the header/body DOM contract and sample styling', async ({ page }) => {
  await page.goto('/workbench')
  await expectOrder(page, defaultOrder)
  for (const definition of catalog) {
    const module = page.locator(`section.fai-module[data-module-id="${definition.id}"]`)
    await expect(module).toHaveClass(/glass-module/)
    await expect(module).toHaveAttribute('data-state', 'ready')
    await expect(module).toHaveAttribute('data-highlight', 'false')
    expect(await module.evaluate(element => Array.from(element.children, child => child.tagName))).toEqual(['HEADER', 'DIV'])
    const header = module.locator(':scope > header')
    await expect(header.locator(':scope > h3.title')).toHaveText(definition.zh)
    await expect(header.locator(':scope > span.en')).toHaveText(definition.en)
    await expect(header.locator(':scope > span.right')).toHaveCount(1)
    await expect(header.locator(':scope > span.right')).toHaveCSS('text-align', 'right')
    await expect(header.locator(':scope > span.badge[data-badge="sample"]')).toHaveText('样例')
    await expect(header.locator(':scope > span.badge')).toHaveCSS('border-top-style', 'dashed')
    await expect(header.locator(':scope > span.ai[data-ai="none"]')).toHaveCount(1)
    await expect(header.locator(':scope > nav.actions > button')).toHaveCount(3)
    await expect(module.locator(':scope > div.body')).toHaveCount(1)
  }
})
