import { expect, test } from '@playwright/test'
import { T } from '../src/design/generated/tokens.ts'

const menu = [
  { title: '工作台', path: '/workbench' },
  { title: '作业', path: '/jobs', owner: 'workbench-interaction' },
  { title: '日报', path: '/daily', owner: 'daily-report' },
  { title: '价格', path: '/prices', owner: 'prices' },
  { title: '平衡表', path: '/balance', owner: 'balance-sheet' },
  { title: '物流', path: '/logistics', owner: 'logistics' },
  { title: '格物致知', path: '/learning', owner: 'learning' },
  { title: '知识库', path: '/knowledge', owner: 'knowledge-base' },
  { title: '设置', path: '/settings', owner: 'settings' },
]
const notice = '演示模式：数据均为合成样例，不读取私有文档或真实头寸。'

test('AC-002-2 v2-nav nine-item order, stable addresses, current item and S0 feature-owned placeholders', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('.fixed-link')
  await expect(links).toHaveCount(9)
  await expect(page.locator('.research-link')).toHaveCount(0)
  expect(await links.locator('.full-label').allTextContents()).toEqual(menu.map(item => item.title))
  for (const item of menu) {
    const link = page.getByRole('navigation', { name: '主菜单', exact: true }).getByRole('link', { name: item.title, exact: true })
    await expect(link).toHaveAttribute('href', item.path)
    await link.click()
    await expect(page).toHaveURL(item.path)
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('[aria-current]')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.title)
    if (item.owner) {
      await expect(page.locator('[data-placeholder-owner]')).toHaveAttribute('data-placeholder-owner', item.owner)
      await expect(page.locator('.placeholder-note')).toContainText(`${item.owner} feature`)
      await expect(page.locator('.placeholder-note')).toContainText('占位页')
    }
  }
  await page.goBack()
  await expect(page).toHaveURL('/knowledge')
  await expect(page.locator('.fixed-link[aria-current="page"] .full-label')).toHaveText('知识库')
})

for (const item of menu.slice(1)) {
  test(`AC-002-2 v2-nav direct ${item.path} and reload preserve path, query and fragment`, async ({ page }) => {
    const url = `${item.path}?scenario=normal#saved-view`
    await page.goto(url)
    await expect(page.locator('.shell')).toBeVisible()
    await expect(page).toHaveURL(url)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.title)
    await page.reload()
    await expect(page.locator('.shell')).toBeVisible()
    await expect(page).toHaveURL(url)
    await expect(page.locator('.fixed-link[aria-current="page"]')).toHaveAttribute('href', item.path)
  })
}

test('AC-002-2 v2-nav dated daily deep link survives startup and reload', async ({ page }) => {
  const url = '/daily/2026-10-28?scenario=normal#report'
  await page.goto(url)
  await expect(page.locator('.shell')).toBeVisible()
  await expect(page).toHaveURL(url)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('日报')
  await expect(page.locator('[data-nav-id="daily"]')).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('[aria-current]')).toHaveCount(1)
  await page.reload()
  await expect(page.locator('.shell')).toBeVisible()
  await expect(page).toHaveURL(url)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('日报')
  await expect(page.locator('[data-nav-id="daily"]')).toHaveAttribute('aria-current', 'page')
})

test('AC-002-1 first-frame static skeleton hands over to mounted loading then workbench without blank frames', async ({ page }) => {
  let releaseEntry!: () => void
  const entryGate = new Promise<void>(resolve => { releaseEntry = resolve })
  await page.route('**/src/main.ts', async route => {
    await entryGate
    await route.continue()
  })
  await page.goto('/?scenario=slow#opening', { waitUntil: 'commit' })
  const loading = page.getByTestId('loading-screen')
  await expect(loading).toBeVisible()
  await expect(loading).toHaveAttribute('data-phase', 'static')
  await expect(loading.getByRole('heading')).toHaveText('Futures-AI')
  await expect(page.locator('#app')).not.toHaveAttribute('data-v-app')

  const frameSamples = page.evaluate(() => new Promise<{ visible: boolean; progress: number | null; notice: string | null }[]>(resolve => {
    const frames: { visible: boolean; progress: number | null; notice: string | null }[] = []
    function sample() {
      const loading = document.querySelector<HTMLElement>('.fai-loading')
      const shell = document.querySelector<HTMLElement>('.shell')
      const surface = loading ?? shell
      frames.push({
        visible: !!surface && surface.getBoundingClientRect().height > 0 && getComputedStyle(surface).visibility === 'visible',
        progress: loading?.querySelector('progress')?.value ?? null,
        notice: loading?.querySelector('.notice')?.textContent?.trim() ?? null,
      })
      if (shell) resolve(frames)
      else requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  }))
  releaseEntry()
  await expect(loading).toHaveAttribute('data-phase', 'loading')
  await expect(page.locator('[data-page="workbench"]')).toBeVisible()
  await expect(page).toHaveURL('/workbench?scenario=slow#opening')
  const frames = await frameSamples
  expect(frames.length).toBeGreaterThan(1)
  expect(frames.every(frame => frame.visible)).toBe(true)
  expect(frames.some(frame => frame.progress === 0)).toBe(true)
  expect(frames.some(frame => frame.progress === 100 && frame.notice === notice)).toBe(true)
  await expect(loading).toHaveCount(0)
})

test('AC-002-7 v2-boot loading displays three-step progress and the bootstrap notice before readiness', async ({ page }) => {
  await page.goto('/?scenario=slow')
  const loading = page.getByTestId('loading-screen')
  await expect(loading).toHaveAttribute('data-phase', 'loading')
  await expect(loading.getByRole('progressbar')).toHaveAttribute('value', '0')
  await expect(loading.getByRole('status')).toHaveText('正在启动本地工作台…')
  await expect(loading.locator('.notice')).toHaveText(notice)
  await expect.poll(() => loading.getByRole('progressbar').evaluate(element => (element as HTMLProgressElement).value)).toBeCloseTo(33.333333, 5)
  await expect(loading.getByRole('status')).toHaveText('正在加载资讯与数据源…')
  await expect(loading.getByRole('status')).not.toContainText('研究列表')
  await expect(page.locator('[data-page="workbench"]')).toBeVisible()
})

test('AC-002-7 boot-error exposes the cause and retries on the same client successfully', async ({ page }) => {
  await page.goto('/?scenario=boot-error')
  const loading = page.getByTestId('loading-screen')
  await expect(loading).toHaveAttribute('data-phase', 'error')
  await expect(loading.getByRole('alert')).toHaveText('样例启动首次失败，请重试。')
  await expect(loading.getByRole('progressbar')).toHaveAttribute('value', '0')
  await expect(page.locator('.shell')).toHaveCount(0)
  await loading.getByRole('button', { name: '重试', exact: true }).click()
  await expect(page.locator('[data-page="workbench"]')).toBeVisible()
  await expect(page).toHaveURL('/workbench?scenario=boot-error')
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('AC-002-7 retry on a deep link does not redirect to workbench', async ({ page }) => {
  const url = '/settings?scenario=boot-error#saved-view'
  await page.goto(url)
  await expect(page.getByRole('alert')).toHaveText('样例启动首次失败，请重试。')
  await page.getByRole('button', { name: '重试', exact: true }).click()
  await expect(page.locator('.shell')).toBeVisible()
  await expect(page).toHaveURL(url)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('设置')
})

test('AC-002-5 rail collapse and expansion survive navigation and reload', async ({ page }) => {
  await page.goto('/')
  const rail = page.locator('.rail')
  await expect(rail).toHaveAttribute('data-collapsed', 'false')
  const expandedWidth = await rail.evaluate(element => element.getBoundingClientRect().width)
  await page.getByRole('button', { name: '收起侧栏' }).click()
  await expect(rail).toHaveAttribute('data-collapsed', 'true')
  expect(await rail.evaluate(element => element.getBoundingClientRect().width)).toBeLessThan(expandedWidth)
  expect(await page.evaluate(() => localStorage.getItem('fai.rail'))).toBe('collapsed')
  await page.getByRole('link', { name: '价格', exact: true }).click()
  await page.reload()
  await expect(rail).toHaveAttribute('data-collapsed', 'true')
  await expect(page).toHaveURL('/prices')
  await expect(page.getByRole('button', { name: '展开侧栏' })).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('button', { name: '展开侧栏' }).click()
  await page.reload()
  await expect(rail).toHaveAttribute('data-collapsed', 'false')
  expect(await page.evaluate(() => localStorage.getItem('fai.rail'))).toBe('expanded')
})

for (const width of [T.window.min_width, T.breakpoint.shell_collapse - 1]) {
  test(`AC-002-6 v2-nav ${width}: nowrap labels, single row, contained overflow and reachable settings`, async ({ page }) => {
    await page.setViewportSize({ width, height: T.window.height })
    await page.goto('/workbench')
    const nav = page.locator('nav.rail-navigation')
    const links = nav.locator('.fixed-link')
    await expect(links).toHaveCount(9)
    await expect(nav.locator('.nav-list')).toHaveCSS('flex-wrap', 'nowrap')
    const labels = links.locator('.full-label')
    for (let index = 0; index < 9; index++) {
      await expect(labels.nth(index)).toHaveCSS('white-space', 'nowrap')
    }
    const tops = await links.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top))
    for (const top of tops) expect(Math.abs(top - tops[0])).toBeLessThanOrEqual(1)
    await expect(nav).toHaveCSS('overflow-x', 'auto')
    const overflowing = await nav.evaluate(element => element.scrollWidth > element.clientWidth)
    await nav.evaluate(element => { element.scrollLeft = element.scrollWidth })
    if (overflowing) expect(await nav.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
    const settings = nav.getByRole('link', { name: '设置', exact: true })
    const containerRect = await nav.boundingBox()
    const settingsRect = await settings.boundingBox()
    expect(containerRect).not.toBeNull()
    expect(settingsRect).not.toBeNull()
    expect(settingsRect!.x).toBeGreaterThanOrEqual(containerRect!.x - 1)
    expect(settingsRect!.x + settingsRect!.width).toBeLessThanOrEqual(containerRect!.x + containerRect!.width + 1)
    expect(settingsRect!.y).toBeGreaterThanOrEqual(containerRect!.y - 1)
    expect(settingsRect!.y + settingsRect!.height).toBeLessThanOrEqual(containerRect!.y + containerRect!.height + 1)
    expect(await page.evaluate(() => ({
      document: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      body: document.body.scrollWidth <= window.innerWidth,
    }))).toEqual({ document: true, body: true })
    await settings.click()
    await expect(page).toHaveURL('/settings')
  })
}

test('AC-002-4 ticker moves normally and reduced motion leaves news manually scrollable', async ({ page }) => {
  await page.goto('/')
  const track = page.locator('.ticker-track')
  await expect(track).toBeVisible()
  await expect(track).toHaveCSS('animation-iteration-count', 'infinite')
  const initial = await track.evaluate(element => getComputedStyle(element).transform)
  await expect.poll(() => track.evaluate(element => getComputedStyle(element).transform)).not.toBe(initial)
  for (const status of ['fresh', 'stale']) {
    const colors = await page.locator(`.status-dot.${status}`).first().evaluate((element, state) => {
      const reference = document.createElement('span')
      reference.style.backgroundColor = `var(--fai-status-${state})`
      document.body.append(reference)
      const expected = getComputedStyle(reference).backgroundColor
      reference.remove()
      return { actual: getComputedStyle(element).backgroundColor, expected }
    }, status)
    expect(colors.actual).toBe(colors.expected)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(track).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.ticker-copy')).not.toBeVisible()
  const ticker = page.getByRole('region', { name: '资讯 ticker' })
  await expect(ticker).toHaveCSS('overflow-x', 'auto')
  expect(await ticker.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
  await ticker.evaluate(element => { element.scrollLeft = element.scrollWidth })
  expect(await ticker.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
})
