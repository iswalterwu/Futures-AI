import { expect, test } from '@playwright/test'
import catalog from '../src/contracts/mock/fixtures/module-catalog.json' with { type: 'json' }
import dailyBrief from '../src/contracts/mock/fixtures/daily-brief.json' with { type: 'json' }
import marketBoard from '../src/contracts/mock/fixtures/market-board.json' with { type: 'json' }
import watchlist from '../src/contracts/mock/fixtures/watchlist.json' with { type: 'json' }
import calendar from '../src/contracts/mock/fixtures/release-calendar.json' with { type: 'json' }
import { T } from '../src/design/generated/tokens.ts'

test.use({ viewport: { width: T.window.width, height: T.window.height } })

test('AC-007-2 normal configuration renders the brief and all seven real mock modules', async ({ page }) => {
  await page.goto('/workbench?scenario=normal')
  await expect(page.locator('.shell')).toBeVisible()
  await expect(page.getByTestId('loading-screen')).toHaveCount(0)
  await expect(page.locator('.module-grid > .fai-module[data-state="ready"]')).toHaveCount(catalog.length)
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'ready')
  await expect(focus.locator('time')).toHaveText(dailyBrief.brief.date)
  await expect(focus.locator('.focus-conclusions li')).toHaveText(dailyBrief.brief.conclusions)
  await expect(focus.locator('.focus-card')).toHaveCount(T.layout.focus_expanded)
  await expect(page.getByRole('table', { name: '行情盘面', exact: true }).locator('tbody > tr')).toHaveCount(marketBoard.rows.length)
  await expect(page.getByRole('table', { name: '关注合约价格', exact: true }).locator('tbody > tr')).toHaveCount(watchlist.rows.length)
  await expect(page.locator('.release-calendar > li')).toHaveCount(calendar.length)
  await expect(page.locator('.module-summary')).toHaveCount(4)
  await expect(page.locator('.error-state, .empty-state')).toHaveCount(0)
})

test('AC-007-2 empty configuration keeps the catalog and replaces brief and module contents with explicit empty states', async ({ page }) => {
  await page.goto('/workbench?scenario=empty')
  await expect(page.locator('.module-grid > .fai-module[data-state="empty"]')).toHaveCount(catalog.length)
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'empty')
  await expect(focus.locator('.empty-state')).toHaveText('今日日报尚未生成。')
  await expect(focus.locator('.focus-card')).toHaveCount(0)
  for (const module of catalog) {
    const shell = page.locator(`.fai-module[data-module-id="${module.id}"]`)
    await expect(shell.locator('h3.title')).toHaveText(module.zh)
    await expect(shell.locator('.body > .empty-state')).toContainText('暂无')
  }
  await expect(page.getByText('暂无资讯', { exact: true })).toBeVisible()
  await expect(page.getByText('暂无数据源状态', { exact: true })).toBeVisible()
  await expect(page.locator('.board-grid, .data-table, .release-calendar, .module-summary, .error-state, .loading-state')).toHaveCount(0)
  await expect(page.getByRole('button', { name: '模块库', exact: true })).toBeEnabled()
})

test('AC-007-2 AC-004-4 error configuration reaches every module error and copies its actual diagnostic through the browser clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/workbench?scenario=error')
  await expect(page.locator('.shell')).toBeVisible()
  await expect(page.getByTestId('loading-screen')).toHaveCount(0)
  await expect(page.locator('.module-grid > .fai-module[data-state="error"]')).toHaveCount(catalog.length)
  await expect(page.locator('.focus-band')).toHaveAttribute('data-state', 'error')
  await expect(page.getByRole('button', { name: '模块库', exact: true })).toBeEnabled()
  for (const module of catalog) {
    const shell = page.locator(`.fai-module[data-module-id="${module.id}"]`)
    await expect(shell.locator('h3.title')).toHaveText(module.zh)
    await expect(shell.locator('.badge')).toHaveAttribute('data-badge', 'bad')
    const error = shell.locator('.error-state')
    await expect(error.getByRole('alert')).toHaveText('样例数据源暂不可用，请重试。')
    const text = await error.locator('code').innerText()
    const diagnostic: { moduleId: string; code: string; message: string; ts: string } = JSON.parse(text)
    expect(diagnostic).toEqual({
      moduleId: module.id,
      code: 'adapter_error',
      message: '样例数据源暂不可用，请重试。',
      ts: expect.any(String),
    })
    expect(Number.isNaN(Date.parse(diagnostic.ts))).toBe(false)
    await page.evaluate(() => navigator.clipboard.writeText(''))
    await error.getByRole('button', { name: '复制诊断', exact: true }).click()
    await expect(error.getByRole('status')).toHaveText('诊断已复制。')
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    // 剪贴板与页面显示的是同一份诊断：按语义比对，忽略排版空白
    expect(JSON.parse(copied)).toEqual(JSON.parse(text))
    await expect(error.getByRole('button', { name: '重试', exact: true })).toBeEnabled()
  }
})

test('AC-007-2 slow configuration exposes startup, brief, catalog and module loading before becoming ready', async ({ page }) => {
  await page.goto('/workbench?scenario=slow')
  const loading = page.getByTestId('loading-screen')
  await expect(loading).toHaveAttribute('data-phase', 'loading')
  await expect(loading.getByRole('progressbar')).toBeVisible()
  await expect(loading.getByRole('status')).toHaveText('正在启动本地工作台…')
  await expect(page.locator('.shell')).toBeVisible()
  await expect(loading).toHaveCount(0)
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'loading')
  await expect(focus.locator('.loading-state')).toHaveText('正在加载今日日报…')
  await expect(page.locator('.modules-container > .loading-state')).toHaveText('正在加载模块目录…')
  await expect(page.getByRole('button', { name: '模块库', exact: true })).toBeDisabled()
  await expect(page.locator('.module-grid > .fai-module[data-state="loading"]')).toHaveCount(catalog.length)
  await expect(page.locator('.fai-module .body > .loading-state')).toHaveCount(catalog.length)
  await expect(focus).toHaveAttribute('data-state', 'ready')
  await expect(page.locator('.module-grid > .fai-module[data-state="ready"]')).toHaveCount(catalog.length)
  await expect(focus.locator('.focus-card')).toHaveCount(T.layout.focus_expanded)
  await expect(page.getByRole('button', { name: '模块库', exact: true })).toBeEnabled()
  await expect(page.locator('.loading-state, .error-state, .empty-state')).toHaveCount(0)
})
