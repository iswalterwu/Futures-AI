import { expect, test } from '@playwright/test'

test('WI AC-002-2 stage selection replaces the URL and switches the placeholder workspace', async ({ page }) => {
  await page.goto('/jobs')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('作业')
  await page.locator('.job-card h2 a[href="/jobs/j-process"]').click()
  await expect(page).toHaveURL('/jobs/j-process/process')
  const rail = page.getByRole('navigation', { name: '作业阶段' })
  await rail.getByRole('button', { name: /交付/ }).click()
  await expect(page).toHaveURL('/jobs/j-process/deliver')
  await expect(rail.getByRole('button', { name: /交付/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(rail.getByRole('button', { name: /处理/ })).toHaveAttribute('aria-current', 'step')
  await expect(page.getByRole('region', { name: '交付工作区' })).toContainText('由后续任务提供')
  await page.goBack()
  await expect(page).toHaveURL('/jobs')
})

test('WI AC-002-2 direct viewed stage survives reload without changing the business current stage', async ({ page }) => {
  await page.goto('/jobs/j-process/analyze')
  const rail = page.getByRole('navigation', { name: '作业阶段' })
  await expect(rail.getByRole('button', { name: /分析/ })).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page).toHaveURL('/jobs/j-process/analyze')
  await expect(rail.getByRole('button', { name: /分析/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(rail.getByRole('button', { name: /处理/ })).toHaveAttribute('aria-current', 'step')
  await expect(page.getByRole('region', { name: '分析工作区' })).toBeVisible()
})

for (const suffix of ['', '/bogus']) {
  test(`WI AC-002-2 ${suffix || 'missing stage'} falls back to the job current stage`, async ({ page }) => {
    await page.goto(`/jobs/j-process${suffix}`)
    await expect(page).toHaveURL('/jobs/j-process/process')
    const current = page.getByRole('navigation', { name: '作业阶段' }).getByRole('button', { name: /处理/ })
    await expect(current).toHaveAttribute('aria-current', 'step')
    await expect(current).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('region', { name: '处理工作区' })).toBeVisible()
  })
}

test('WI R4-A leaving a slow missing-stage detail through the sidebar is not undone by a late canonical replace', async ({ page }) => {
  await page.goto('/jobs?scenario=slow')
  const card = page.locator('.job-card h2 a[href="/jobs/j-process"]')
  await expect(card).toBeVisible({ timeout: 15000 })
  await card.click()
  await expect(page).toHaveURL('/jobs/j-process')
  await expect(page.getByRole('navigation', { name: '作业阶段' })).toHaveCount(0)
  await page.getByRole('link', { name: '价格', exact: true }).click()
  await expect(page).toHaveURL('/prices')
  // The two real slow contract reads take 3000 ms; let the abandoned callback finish.
  await page.waitForTimeout(3500)
  await expect(page).toHaveURL('/prices')
})
