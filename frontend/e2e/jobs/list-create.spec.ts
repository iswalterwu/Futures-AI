import { expect, test } from '@playwright/test'

test('WI AC-001-3 validates required fields then records creation parameters and shows the collect detail', async ({ page }) => {
  await page.goto('/jobs')
  const toggle = page.getByRole('button', { name: '新建作业', exact: true })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  const panel = page.getByRole('region', { name: '新建作业', exact: true })
  await expect(panel.getByRole('combobox', { name: '作业类型' })).toHaveValue('')
  await panel.getByRole('button', { name: '创建作业', exact: true }).click()
  await expect(panel.getByText('请填写作业标题。', { exact: true })).toBeVisible()
  await expect(panel.getByText('请选择作业类型。', { exact: true })).toBeVisible()
  await expect(page).toHaveURL('/jobs')

  const title = '油品供需专题（新建验收）'
  const goal = '核对合成供需数据\n列出下一轮研究问题'
  await panel.getByRole('textbox', { name: '作业标题', exact: true }).fill(title)
  await panel.getByRole('combobox', { name: '作业类型' }).selectOption({ label: '专题' })
  await panel.getByRole('textbox', { name: '品种 / 主题', exact: true }).fill('')
  await panel.getByRole('textbox', { name: '目标说明' }).fill(goal)
  await panel.getByRole('button', { name: '创建作业', exact: true }).click()
  await expect(page).toHaveURL(/\/jobs\/j-[^/]+\/collect$/)
  const id = new URL(page.url()).pathname.split('/')[2]!
  const recorded = await page.evaluate(jobId => {
    const snapshot = JSON.parse(localStorage.getItem('fai.jobs.v1')!)
    return snapshot.data.jobs.find((job: { id: string }) => job.id === jobId)
  }, id)
  expect(recorded).toMatchObject({ id, title, type: 'research', subject: null, goal, status: 'collecting', currentStage: 'collect', createdBy: 'human' })
  const detail = page.getByRole('region', { name: '作业详情', exact: true })
  await expect(detail.getByRole('heading', { level: 1 })).toHaveText(title)
  await expect(detail.locator('.job-type')).toContainText('专题')
  await expect(detail.locator('.job-status-badge')).toHaveAttribute('data-status', 'collecting')
  await expect(detail.locator('.job-status-badge')).toContainText('提取中')
  await expect(detail.locator('.job-goal')).toHaveText(goal)
  await expect(detail.locator('.job-goal')).toHaveCSS('white-space', 'pre-wrap')
  await expect(detail.locator('.job-subject')).toHaveCount(0)
  const collect = detail.getByRole('navigation', { name: '作业阶段' }).getByRole('button', { name: /提取/ })
  await expect(collect).toHaveAttribute('aria-current', 'step')
  await expect(collect).toHaveAttribute('aria-pressed', 'true')
  await expect(detail.getByRole('region', { name: '提取工作区' })).toBeVisible()
})
