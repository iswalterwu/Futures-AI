import { expect, test } from '@playwright/test'

test('AC-009-1 SMOKE mounts the application in local Chrome', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/')

  await expect(page).toHaveTitle('Futures-AI')
  await expect(page.locator('#app')).toHaveAttribute('data-v-app', '')
  await expect(page.locator('#app')).toBeVisible()
  await expect(page.locator('#app')).not.toBeEmpty()
  expect(pageErrors).toEqual([])
})
