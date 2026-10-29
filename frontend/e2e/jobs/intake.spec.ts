import { expect, test, type Locator, type Page } from '@playwright/test'
import type { Intervention, SourceNote } from '../../src/contracts/types.ts'
import type { PersistedJobData } from '../../src/jobs/persistence.ts'

// T-C04 Implement = openai/gpt-6-astra via openai; baseline 7b802d4.
// Normal business snapshots only: no fixture overrides, window hooks or direct API writes.
async function snapshot(page: Page): Promise<{ version: number; data: PersistedJobData }> {
  const raw = await page.evaluate(() => localStorage.getItem('fai.jobs.v1'))
  expect(raw).not.toBeNull()
  return JSON.parse(raw!)
}

async function fillText(panel: Locator, body: string, purpose: string) {
  await panel.getByRole('radio', { name: '文本', exact: true }).check()
  await panel.getByRole('textbox', { name: '投放文本', exact: true }).fill(body)
  await panel.getByRole('textbox', { name: '用途', exact: true }).fill(purpose)
}

async function expectHistory(page: Page, event: Intervention, note: SourceNote, reliabilityText: string) {
  const history = page.getByRole('complementary', { name: '介入历史', exact: true })
  const toggle = history.getByRole('button', { name: '展开介入历史', exact: true })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  const entry = history.locator(`[data-intervention-id="${event.id}"]`)
  await expect(entry).toBeVisible()
  await expect(entry).toContainText('提取 · ingest')
  await expect(entry.locator('details')).not.toHaveAttribute('open')
  await entry.locator('summary').click()
  await expect(entry.locator('details')).toHaveAttribute('open', '')
  for (const [label, value] of [
    ['id', event.id], ['jobId', 'j-collect'], ['payload · action', 'ingest'],
    ['用途', note.purpose], ['可靠性', reliabilityText],
    ['发布日期', note.publishedAt ?? '未知'], ['有效期', note.validUntil ?? '未知'],
    ['口径备注', note.scopeNote ?? '无'],
  ]) {
    const field = entry.locator('dt').filter({ hasText: new RegExp(`^${label}$`) }).locator('+ dd')
    await expect(field).toBeVisible()
    await expect(field).toHaveText(value!)
  }
}

test('WI AC-003-1 local list and collect entries use the same drawer/panel with unassigned and job snapshots', async ({ page }) => {
  await page.goto('/jobs?scenario=normal')
  await page.getByRole('button', { name: '投放', exact: true }).click()
  const drawer = page.getByRole('complementary', { name: '投放抽屉', exact: true })
  const panel = drawer.getByRole('region', { name: '投放表单', exact: true })
  await expect(drawer).toHaveCount(1)
  await expect(panel).toHaveCount(1)
  await expect(drawer).toHaveClass('glass-drawer intake-drawer')
  await expect(drawer.getByText('未指定作业：提交后进入待归属池', { exact: true })).toBeVisible()
  await expect(panel.getByRole('heading', { name: '投放材料', exact: true })).toBeVisible()
  // An empty, synthetic in-memory file exercises the browser file-input boundary, not a private fixture.
  await panel.getByLabel('投放文件', { exact: true }).setInputFiles({ name: 'synthetic-intake.csv', mimeType: 'text/csv', buffer: Buffer.alloc(0) })
  const listPurpose = 'C04 列表文件元数据投放'
  await panel.getByRole('textbox', { name: '用途', exact: true }).fill(listPurpose)
  await panel.getByRole('button', { name: '提交投放', exact: true }).click()
  const pool = drawer.getByRole('region', { name: '待归属池', exact: true })
  await expect(pool.getByRole('listitem').filter({ hasText: listPurpose })).toBeVisible()
  const listed = await snapshot(page)
  expect(listed.version).toBe(1)
  expect(listed.data.uploads.uploads).toHaveLength(3)
  const upload = listed.data.uploads.uploads.find(item => item.sourceNote.purpose === listPurpose)!
  expect(upload).toMatchObject({ jobId: null, inputKind: 'file', status: 'pending_validation', fileMeta: { name: 'synthetic-intake.csv', size: 0, type: 'text/csv', lastModified: expect.any(Number) } })
  expect(listed.data.details['j-collect']!.collect.uploads.some(item => item.id === upload.id)).toBe(false)

  await drawer.getByRole('button', { name: '关闭', exact: true }).click()
  await expect(drawer).toHaveCount(0)
  await page.locator('.job-card h2 a[href="/jobs/j-collect"]').click()
  await expect(page).toHaveURL('/jobs/j-collect/collect')
  const collect = page.getByRole('region', { name: '提取工作区', exact: true })
  await collect.getByRole('button', { name: '投放到本作业', exact: true }).click()
  await expect(drawer).toHaveCount(1)
  await expect(panel).toHaveCount(1)
  await expect(drawer).toHaveClass('glass-drawer intake-drawer')
  await expect(drawer.getByText('目标作业：j-collect', { exact: true })).toBeVisible()
  await expect(panel.getByRole('heading', { name: '投放材料', exact: true })).toBeVisible()
  await panel.getByRole('radio', { name: '链接', exact: true }).check()
  const url = 'https://example.test/c04-synthetic-source'
  const detailPurpose = 'C04 详情链接元数据投放'
  await panel.getByRole('textbox', { name: '投放链接', exact: true }).fill(url)
  await panel.getByRole('textbox', { name: '用途', exact: true }).fill(detailPurpose)
  await panel.getByRole('button', { name: '提交投放', exact: true }).click()
  const row = collect.getByRole('list', { name: '采集列表' }).getByRole('listitem').filter({ hasText: detailPurpose })
  await expect(row).toContainText(url)
  await expect(row.locator('.artifact-status-badge')).toContainText('待验证')
  const detailed = await snapshot(page)
  const assigned = detailed.data.details['j-collect']!.collect.uploads.find(item => item.sourceNote.purpose === detailPurpose)!
  expect(assigned).toMatchObject({ jobId: 'j-collect', inputKind: 'url', url, status: 'pending_validation' })
  expect(detailed.data.details['j-collect']!.collect.uploads).toHaveLength(listed.data.details['j-collect']!.collect.uploads.length + 1)
  expect(detailed.data.uploads.uploads).toEqual(listed.data.uploads.uploads)
  expect(detailed.data.interventions.filter(event => event.payload.action === 'ingest' && event.payload.uploadId === assigned.id)).toEqual([
    expect.objectContaining({ jobId: 'j-collect', stage: 'collect', kind: 'ingest', payload: { action: 'ingest', uploadId: assigned.id, sourceNote: assigned.sourceNote } }),
  ])
})

for (const sample of [
  { name: 'all five source fields', note: { purpose: 'C04 完整来源说明', reliability: 'high', publishedAt: '2026-10-01', validUntil: '2026-11-30', scopeNote: '合成柴油样例；仅比较同口径周度数据' }, reliabilityText: '高' },
  { name: 'unknown reliability and null optional fields', note: { purpose: 'C04 未知来源说明', reliability: 'unknown', publishedAt: null, validUntil: null, scopeNote: null }, reliabilityText: '未知' },
] satisfies { name: string; note: SourceNote; reliabilityText: string }[]) {
  test(`WI AC-003-3 required purpose, recorded payload and expanded history: ${sample.name}`, async ({ page }) => {
    await page.goto('/jobs/j-collect/collect?scenario=normal')
    const collect = page.getByRole('region', { name: '提取工作区', exact: true })
    const rows = collect.getByRole('list', { name: '采集列表' }).getByRole('listitem')
    await expect(rows).toHaveCount(2)
    await collect.getByRole('button', { name: '投放到本作业', exact: true }).click()
    const drawer = page.getByRole('complementary', { name: '投放抽屉', exact: true })
    const panel = drawer.getByRole('region', { name: '投放表单', exact: true })
    const body = `C04_RAW_BODY_SENTINEL_${sample.name}\n合成正文只在本次草稿中。`
    await fillText(panel, body, '')
    await expect(panel.getByRole('combobox', { name: '可靠性', exact: true })).toHaveValue('unknown')
    const before = await page.evaluate(() => localStorage.getItem('fai.jobs.v1'))
    expect(before).toBeNull()
    await panel.getByRole('button', { name: '提交投放', exact: true }).click()
    await expect(panel.getByRole('alert')).toHaveText('请填写用途。')
    expect(await page.evaluate(() => localStorage.getItem('fai.jobs.v1'))).toBe(before)
    await expect(rows).toHaveCount(2)
    await expect(drawer.getByRole('region', { name: '抽取预览', exact: true })).toHaveCount(0)

    const note = sample.note
    await panel.getByRole('textbox', { name: '用途', exact: true }).fill(note.purpose)
    if (note.reliability !== 'unknown') await panel.getByRole('combobox', { name: '可靠性', exact: true }).selectOption({ label: sample.reliabilityText })
    if (note.publishedAt !== null) await panel.getByLabel('发布日期', { exact: true }).fill(note.publishedAt)
    if (note.validUntil !== null) await panel.getByLabel('有效期', { exact: true }).fill(note.validUntil)
    if (note.scopeNote !== null) await panel.getByRole('textbox', { name: '口径备注', exact: true }).fill(note.scopeNote)
    await panel.getByRole('button', { name: '提交投放', exact: true }).click()
    await expect(rows).toHaveCount(3)
    const row = rows.filter({ hasText: note.purpose })
    await expect(row).toBeVisible()
    await expect(row).toContainText('文本投放（正文未保存）')
    await expect(row.locator('.artifact-status-badge')).toContainText('待验证')
    const recorded = await snapshot(page)
    const upload = recorded.data.details['j-collect']!.collect.uploads.find(item => item.sourceNote.purpose === note.purpose)!
    expect(upload).toMatchObject({ jobId: 'j-collect', inputKind: 'text', status: 'pending_validation' })
    expect(upload.sourceNote).toEqual(note)
    expect(upload).not.toHaveProperty('text')
    const events = recorded.data.interventions.filter(event => event.payload.action === 'ingest' && event.payload.uploadId === upload.id)
    expect(events).toHaveLength(1)
    const event = events[0]!
    expect(event).toMatchObject({ jobId: 'j-collect', stage: 'collect', kind: 'ingest' })
    expect(event.payload).toEqual({ action: 'ingest', uploadId: upload.id, sourceNote: note })
    const raw = await page.evaluate(() => localStorage.getItem('fai.jobs.v1'))
    expect(raw).not.toContain(body.split('\n')[0])
    expect(raw).not.toContain('合成正文只在本次草稿中。')
    await drawer.getByRole('button', { name: '关闭', exact: true }).click()
    await expectHistory(page, event, note, sample.reliabilityText)
  })
}

test('WI AC-003-5 list intake enters the pool, confirms and moves the same upload/status to the selected active job', async ({ page }) => {
  await page.goto('/jobs?scenario=normal')
  await page.getByRole('button', { name: '投放', exact: true }).click()
  const drawer = page.getByRole('complementary', { name: '投放抽屉', exact: true })
  const pool = drawer.getByRole('region', { name: '待归属池', exact: true })
  await expect(pool.getByRole('listitem')).toHaveCount(2)
  const purpose = 'C04 待归属流转同一投放'
  await fillText(drawer.getByRole('region', { name: '投放表单', exact: true }), 'C04_POOL_SYNTHETIC_BODY', purpose)
  await drawer.getByRole('button', { name: '提交投放', exact: true }).click()
  const row = pool.getByRole('listitem').filter({ hasText: purpose })
  await expect(pool.getByRole('listitem')).toHaveCount(3)
  await expect(row).toBeVisible()
  await expect(row.locator('.artifact-status-badge')).toContainText('待验证')
  const submitted = await snapshot(page)
  const upload = submitted.data.uploads.uploads.find(item => item.sourceNote.purpose === purpose)!
  expect(upload).toMatchObject({ jobId: null, inputKind: 'text', status: 'pending_validation' })

  // The preview is explicitly synthetic; only the real confirmation action changes status.
  const preview = drawer.getByRole('region', { name: '抽取预览', exact: true })
  await expect(preview).toContainText('合成文本预览（正文不保存）')
  await expect(preview).toContainText('整体单位：未知')
  await expect(preview).toContainText('时间范围：未知')
  const mapping = drawer.getByRole('region', { name: '字段映射', exact: true })
  await mapping.getByRole('textbox', { name: '目标字段 1', exact: true }).fill('合成库存')
  await mapping.getByRole('textbox', { name: '映射单位 1', exact: true }).fill('万吨')
  expect((await snapshot(page)).data.uploads.uploads.find(item => item.id === upload.id)).toEqual(upload)
  await mapping.getByRole('button', { name: '确认入库', exact: true }).click()
  await expect(row.locator('.artifact-status-badge')).toContainText('已入库')
  await expect(preview.locator('.artifact-status-badge')).toContainText('已入库')
  await expect(mapping.getByRole('button', { name: '确认入库', exact: true })).toHaveCount(0)
  const confirmed = (await snapshot(page)).data.uploads.uploads.find(item => item.id === upload.id)!
  expect(confirmed).toMatchObject({ id: upload.id, jobId: null, status: 'ingested', mapping: [{ sourceField: '合成列 1', targetField: '合成库存', unit: '万吨' }] })

  const target = row.getByRole('combobox', { name: '归入作业', exact: true })
  await expect(row.getByRole('button', { name: '归入', exact: true })).toBeDisabled()
  await expect(target.locator('option[value="j-collect"]')).toHaveCount(1)
  await expect(target.locator('option[value="j-cancelled"], option[value="j-delivered"]')).toHaveCount(0)
  await expect(target.locator('option[value="j-failed"]')).toHaveCount(1)
  expect(submitted.data.jobs.find(job => job.id === 'j-collect')!.status).toBe('collecting')
  await target.selectOption('j-collect')
  await row.getByRole('button', { name: '归入', exact: true }).click()
  await expect(row).toHaveCount(0)
  await expect(pool.getByRole('listitem')).toHaveCount(2)
  const assigned = await snapshot(page)
  expect(assigned.data.uploads.uploads.some(item => item.id === upload.id)).toBe(false)
  expect(assigned.data.details['j-collect']!.collect.uploads.find(item => item.id === upload.id)).toEqual({ ...confirmed, jobId: 'j-collect' })
  await drawer.getByRole('button', { name: '关闭', exact: true }).click()
  await page.locator('.job-card h2 a[href="/jobs/j-collect"]').click()
  await expect(page).toHaveURL('/jobs/j-collect/collect')
  const collected = page.getByRole('list', { name: '采集列表' }).getByRole('listitem').filter({ hasText: purpose })
  await expect(collected).toHaveCount(1)
  await expect(collected).toBeVisible()
  await expect(collected).toContainText('文本投放（正文未保存）')
  await expect(collected.locator('.artifact-status-badge')).toHaveAttribute('data-status', confirmed.status)
  await expect(collected.locator('.artifact-status-badge')).toContainText('已入库')
  expect(await page.evaluate(() => localStorage.getItem('fai.jobs.v1'))).not.toContain('C04_POOL_SYNTHETIC_BODY')
})
