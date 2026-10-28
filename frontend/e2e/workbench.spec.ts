import { expect, test } from '@playwright/test'
import dailyFixture from '../src/contracts/mock/fixtures/daily-brief.json' with { type: 'json' }
import catalog from '../src/contracts/mock/fixtures/module-catalog.json' with { type: 'json' }
import { T } from '../src/design/generated/tokens.ts'

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: T.window.width, height: T.window.height })
})

test('AC-003-1 focus renders the mock brief, formatted numbers and direction classes', async ({ page }) => {
  await page.goto('/workbench')
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'ready')
  await expect(focus).toHaveClass(/glass-focus/)
  await expect(focus.getByRole('heading', { level: 2 })).toHaveText('今日焦点 Daily focus')
  await expect(focus.locator('time')).toHaveAttribute('datetime', dailyFixture.brief.date)
  await expect(focus.locator('.focus-conclusions li')).toHaveText(dailyFixture.brief.conclusions)
  await expect(focus.locator('.kpi-value')).toHaveText(['512.6', '4,320', '3,018', '2,460', '76.8', '820'])
  await expect(focus.locator('.kpi-delta')).toHaveText(['+1.5%', '0%', '+1%', '-35', '+0.8', '0'])
  await expect(focus.locator('.kpi-delta').nth(0)).toHaveClass(/sem-market is-up/)
  await expect(focus.locator('.kpi-delta').nth(1)).toHaveClass(/sem-market is-neutral/)
  await expect(focus.locator('.kpi-delta').nth(3)).toHaveClass(/sem-analysis is-down/)
  await expect(focus.locator('.kpi-delta').nth(4)).toHaveClass(/sem-analysis is-up/)
})

test('AC-003-1 focus truncates conclusions and uses four/six cards across the registered breakpoint without overflow', async ({ page }) => {
  await page.addInitScript(fixture => {
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': fixture } }
  }, { brief: {
    ...dailyFixture.brief,
    conclusions: [...dailyFixture.brief.conclusions, '不应展示的第四条结论'],
    figures: [...dailyFixture.brief.figures, { ...dailyFixture.brief.figures[0], label: '不应展示的第七张卡' }],
  } })
  await page.goto('/workbench')
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'ready')
  for (const [width, count] of [
    [T.window.min_width, T.layout.focus_compact],
    [T.breakpoint.shell_collapse, T.layout.focus_compact],
    [T.breakpoint.focus_expand - 1, T.layout.focus_compact],
    [T.breakpoint.focus_expand, T.layout.focus_expanded],
    [T.breakpoint.focus_expand + 1, T.layout.focus_expanded],
    [T.window.width, T.layout.focus_expanded],
    [T.window.min_width, T.layout.focus_compact],
  ]) {
    await page.setViewportSize({ width, height: T.window.height })
    await expect(focus.locator('.focus-card')).toHaveCount(count)
    await expect(focus.locator('.focus-conclusions li')).toHaveText(dailyFixture.brief.conclusions)
    await expect(focus).not.toContainText('不应展示')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    expect(await focus.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  }
})

test('AC-003-2 clicking the band, conclusion or figure opens the dated daily placeholder; keyboard works too', async ({ page }) => {
  const date = '2026-11-02'
  await page.addInitScript(brief => {
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief } } }
  }, { ...dailyFixture.brief, date })
  for (const target of ['band', 'conclusion', 'figure', 'keyboard']) {
    await page.goto('/workbench')
    const focus = page.getByRole('link', { name: '今日焦点 Daily focus', exact: true })
    await expect(focus).toHaveAttribute('href', `/daily/${date}`)
    if (target === 'keyboard') {
      await focus.focus()
      await page.keyboard.press('Enter')
    } else if (target === 'band') {
      const inset = Number.parseFloat(T.space.grid_gap) / 2
      await focus.click({ position: { x: inset, y: inset } })
    } else {
      await focus.locator(target === 'conclusion' ? '.focus-conclusions li' : '.focus-card').first().click()
    }
    await expect(page).toHaveURL(`/daily/${date}`)
    await expect(page.locator('[data-placeholder-owner="daily-report"]')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('日报')
    await expect(page.locator('.placeholder-page time')).toHaveText(date)
    await expect(page.locator('.placeholder-page time')).toHaveAttribute('datetime', date)
  }
  await page.reload()
  await expect(page).toHaveURL(`/daily/${date}`)
  await expect(page.locator('.placeholder-page time')).toHaveText(date)
})

test('AC-003-3 absent daily brief renders the exact contract reason and no link or cards', async ({ page }) => {
  const reason = '数据发布延后，当前交易日的日报尚未生成。'
  await page.addInitScript(message => {
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief: null, reason: message } } }
  }, reason)
  await page.goto('/workbench')
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'empty')
  await expect(focus.getByRole('status')).toHaveText(reason)
  await expect(focus.getByRole('heading', { level: 2 })).toBeVisible()
  await expect(focus).not.toHaveAttribute('href')
  await expect(focus.locator('.focus-card')).toHaveCount(0)
  await expect(focus.locator('.focus-conclusions')).toHaveCount(0)
  await focus.click()
  await expect(page).toHaveURL('/workbench')
})

test('AC-003-3 empty scenario uses the mock client reason', async ({ page }) => {
  await page.goto('/workbench?scenario=empty')
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'empty')
  await expect(focus.locator('.empty-state')).toHaveText('今日日报尚未生成。')
})

test('AC-003-5 semantic sections isolate market colors from analysis colors with bilingual labels and a glass divider', async ({ page }) => {
  const [oil, lpg, fuel, inventory, utilization, onwater] = dailyFixture.brief.figures
  await page.addInitScript(brief => {
    window.__FAI_MOCK__ = { fixtures: { 'daily-brief': { brief } } }
  }, { ...dailyFixture.brief, figures: [inventory, oil, utilization, { ...lpg, decimals: 2 }, onwater, fuel] })
  await page.goto('/workbench')
  const focus = page.locator('.focus-band')
  const market = focus.locator('[data-semantic="market"]')
  const analysis = focus.locator('[data-semantic="analysis"]')
  await expect(market.getByRole('heading')).toHaveText('行情 Market')
  await expect(analysis.getByRole('heading')).toHaveText('指标 Indicators')
  await expect(market.locator('.kpi-label')).toHaveText([oil.label, lpg.label, fuel.label])
  await expect(analysis.locator('.kpi-label')).toHaveText([inventory.label, utilization.label, onwater.label])
  await expect(market.locator('.sem-analysis')).toHaveCount(0)
  await expect(analysis.locator('.sem-market')).toHaveCount(0)
  await expect(analysis).toHaveCSS('border-inline-start-style', 'solid')
  const divider = await analysis.evaluate(element => {
    const reference = document.createElement('span')
    reference.style.color = 'var(--fai-glass-focus-border)'
    document.body.append(reference)
    const expected = getComputedStyle(reference).color
    reference.remove()
    const style = getComputedStyle(element)
    return { color: style.borderInlineStartColor, width: parseFloat(style.borderInlineStartWidth), expected }
  })
  expect(divider.color).toBe(divider.expected)
  expect(divider.width).toBeGreaterThan(0)
  for (const [semantic, label, token] of [
    ['market', oil.label, 'updown-up'], ['market', lpg.label, 'updown-down'],
    ['analysis', inventory.label, 'chart-neg'], ['analysis', utilization.label, 'chart-pos'],
  ]) {
    const delta = focus.locator(`[data-semantic="${semantic}"] .focus-card`).filter({ hasText: label }).locator('.kpi-delta')
    const colors = await delta.evaluate((element, name) => {
      const reference = document.createElement('span')
      reference.style.color = `var(--fai-${name})`
      document.body.append(reference)
      const expected = getComputedStyle(reference).color
      reference.remove()
      const style = getComputedStyle(element)
      return { color: style.color, background: style.backgroundColor, expected }
    }, token)
    expect(colors.color).toBe(colors.expected)
    expect(colors.background).not.toBe(colors.expected)
  }
})

test('AC-003-6 focus is fixed outside the module grid/library and survives layout moves, removal, addition and reload', async ({ page }) => {
  await page.goto('/workbench')
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'ready')
  const content = await focus.innerHTML()
  await expect(focus.getByRole('button')).toHaveCount(0)
  await expect(focus).not.toHaveAttribute('data-module-id')
  await expect(page.locator('.modules-container .focus-band')).toHaveCount(0)
  await expect(page.locator('.module-grid > .fai-module')).toHaveCount(catalog.length)
  const initialTop = (await focus.boundingBox())!.y
  await page.locator('.modules-container').evaluate(element => { element.scrollTop = element.scrollHeight })
  expect((await focus.boundingBox())!.y).toBe(initialTop)
  await page.getByRole('button', { name: '下移行情价格', exact: true }).click()
  expect(await focus.innerHTML()).toBe(content)
  for (const module of catalog) {
    await page.getByRole('button', { name: `移除${module.zh}`, exact: true }).click()
    await expect(focus).toBeVisible()
    expect(await focus.innerHTML()).toBe(content)
  }
  await expect(page.locator('.modules-container .empty-state')).toHaveText('工作台暂无模块，请从模块库添加。')
  await page.getByRole('button', { name: '模块库', exact: true }).click()
  const library = page.getByRole('dialog', { name: '模块库' })
  await expect(library.locator('.library-entry')).toHaveCount(catalog.length)
  await expect(library.locator('.library-entry h3')).toHaveText(catalog.map(module => module.zh))
  await expect(library.getByText('今日焦点', { exact: true })).toHaveCount(0)
  await expect(library.locator('[data-module-id="focus-band"]')).toHaveCount(0)
  await library.getByRole('button', { name: '添加关注列表', exact: true }).click()
  await library.getByRole('button', { name: '关闭模块库' }).click()
  await expect(page.locator('.module-grid > .fai-module')).toHaveCount(1)
  expect(await focus.innerHTML()).toBe(content)
  await page.reload()
  await expect(focus).toHaveAttribute('data-state', 'ready')
  await expect(focus).toBeVisible()
  await expect(page.locator('.module-grid > .fai-module')).toHaveAttribute('data-module-id', 'watchlist')
  expect(await focus.innerHTML()).toBe(content)
})

test('AC-003-1 failed brief reads show an error and diagnostics instead of an empty report', async ({ page }) => {
  await page.goto('/workbench?scenario=error')
  const focus = page.locator('.focus-band')
  await expect(focus).toHaveAttribute('data-state', 'error')
  await expect(focus.getByRole('alert')).toHaveText('样例数据源暂不可用，请重试。')
  const diagnostic = JSON.parse(await focus.locator('code').innerText())
  expect(diagnostic).toEqual({
    moduleId: 'daily-brief', code: 'adapter_error',
    message: '样例数据源暂不可用，请重试。', ts: expect.any(String),
  })
  expect(Number.isNaN(Date.parse(diagnostic.ts))).toBe(false)
  await expect(focus.getByRole('button', { name: '复制诊断' })).toBeVisible()
  await expect(focus.getByRole('button', { name: '重试', exact: true })).toBeVisible()
  await expect(focus.locator('.empty-state')).toHaveCount(0)
  await expect(focus).not.toHaveAttribute('href')
})
