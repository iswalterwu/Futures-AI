import { config, enableAutoUnmount, flushPromises, mount, type DOMWrapper } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h, isReadonly, toRaw } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import { router as appRouter } from '../../../src/app/router.ts'
import { dataClient } from '../../../src/contracts/index.ts'
import { createMockDataClient, readJobFixtures } from '../../../src/contracts/mock/index.ts'
import { ACTIVE_JOB_STATUSES, UploadStatusLabel, type Bootstrap, type ErrorResponse } from '../../../src/contracts/types.ts'
import { registerJobRoutes } from '../../../src/jobs/routes.ts'
import CollectWorkspace from '../../../src/jobs/stages/CollectWorkspace.vue'
import IntakeDrawer from '../../../src/jobs/stages/IntakeDrawer.vue'
import UnassignedPool from '../../../src/jobs/stages/UnassignedPool.vue'
import { useIntakeStore } from '../../../src/jobs/stores/intake.ts'
import { useJobsStore } from '../../../src/jobs/stores/jobs.ts'
import ErrorState from '../../../src/shared/components/ErrorState.vue'
import Loading from '../../../src/shared/components/Loading.vue'

let pinia: ReturnType<typeof createPinia>
enableAutoUnmount(afterEach)
beforeEach(async () => {
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  vi.stubEnv('VITE_MOCK_SCENARIO', undefined)
  pinia = createPinia()
  setActivePinia(pinia)
  config.global.plugins = [pinia]
  await navigator.clipboard.writeText('')
})
afterEach(() => {
  disposePinia(pinia)
  vi.restoreAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllEnvs()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
})
function changeScenario(scenario: Bootstrap['scenario']) {
  window.history.replaceState(null, '', `/?scenario=${scenario}`)
  return createMockDataClient()
}
function connect(scenario: Bootstrap['scenario'] = 'normal') {
  const client = changeScenario(scenario)
  const poolReads = vi.spyOn(dataClient, 'listUnassignedUploads').mockImplementation(() => client.listUnassignedUploads())
  const assigns = vi.spyOn(dataClient, 'assignUpload').mockImplementation((...args) => client.assignUpload(...args))
  const removes = vi.spyOn(dataClient, 'removeUpload').mockImplementation((...args) => client.removeUpload(...args))
  const submits = vi.spyOn(dataClient, 'submitIntake').mockImplementation((...args) => client.submitIntake(...args))
  const confirms = vi.spyOn(dataClient, 'confirmIntake').mockImplementation((...args) => client.confirmIntake(...args))
  const previews = vi.spyOn(dataClient, 'getIntakePreview').mockImplementation((...args) => client.getIntakePreview(...args))
  const lists = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  const reads = vi.spyOn(dataClient, 'getJob').mockImplementation((...args) => client.getJob(...args))
  const workspaces = vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  return { client, poolReads, assigns, removes, submits, confirms, previews, lists, reads, workspaces, store: useIntakeStore(pinia), jobs: useJobsStore(pinia) }
}
function collectView(jobs: ReturnType<typeof useJobsStore>) {
  return mount({ render: () => {
    const workspace = jobs.currentStageWorkspace!
    return workspace.stage === 'collect' ? h(CollectWorkspace, { job: jobs.currentJob!, workspace }) : null
  } })
}
function button(row: Pick<DOMWrapper<Element>, 'findAll'>, label: string) {
  return row.findAll('button').find(item => item.text() === label)!
}
const note = { purpose: '池中合成用途', reliability: 'unknown' as const, publishedAt: null, validUntil: null, scopeNote: null }

describe('WI pool assign', () => {
  test('drawer mounts the pool after the panel, loads jobs, renders all input kinds/statuses and only active targets', async () => {
    const fixtures = readJobFixtures()
    const draft = structuredClone(fixtures.jobs.normal[0]!)
    draft.id = 'j-draft-test'
    draft.title = '草稿目标'
    draft.status = 'draft'
    fixtures.jobs.normal.push(draft)
    window.__FAI_MOCK__ = { jobFixtures: { jobs: fixtures.jobs } }
    const { client, store, jobs, assigns, poolReads, lists } = connect()
    await client.submitIntake({ inputKind: 'url', url: 'https://example.test/pool', jobId: null, sourceNote: note })
    const expected = await client.listUnassignedUploads()
    const wrapper = mount(IntakeDrawer)
    await flushPromises()
    const pool = wrapper.getComponent(UnassignedPool)
    expect(pool.element.tagName).toBe('SECTION')
    expect(pool.attributes('aria-label')).toBe('待归属池')
    expect(wrapper.element.lastElementChild).toBe(pool.element)
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(poolReads).toHaveBeenCalledExactlyOnceWith()
    const rows = pool.findAll('li')
    expect(rows).toHaveLength(expected.length)
    for (const [index, upload] of expected.entries()) {
      const row = rows[index]!
      expect(row.text()).toContain(upload.inputKind === 'file' ? `文件 · ${upload.fileMeta.name}` : upload.inputKind === 'url' ? `链接 · ${upload.url}` : '文本 · 文本投放（正文未保存）')
      expect(row.text()).toContain(`用途：${upload.sourceNote.purpose}`)
      expect(row.get('.artifact-status-badge').text()).toContain(UploadStatusLabel[upload.status].text)
      expect(row.get('[aria-hidden="true"]').text()).toBe(UploadStatusLabel[upload.status].icon)
      if (upload.quarantineReason) expect(row.text()).toContain(`隔离原因：${upload.quarantineReason}`)
      expect(row.get('button').attributes('disabled')).toBeDefined()
      const options = row.findAll('option').filter(option => option.attributes('disabled') === undefined)
      expect(options.map(option => option.attributes('value'))).toEqual(jobs.jobs.filter(job => ACTIVE_JOB_STATUSES.some(status => status === job.status)).map(job => job.id))
      expect(options.map(option => option.text())).toContain('草稿目标')
      expect(options.map(option => option.attributes('value'))).toContain('j-failed')
      expect(options.map(option => option.attributes('value'))).not.toContain('j-cancelled')
      expect(options.map(option => option.attributes('value'))).not.toContain('j-delivered')
    }
    expect(assigns).not.toHaveBeenCalled()
    expect(isReadonly(store.pool)).toBe(true)
    expect(isReadonly(store.pool[0]!.mapping)).toBe(true)
    expect(Object.keys(store.$state)).toEqual([])
    const assertTypes = () => {
      // @ts-expect-error pool is readonly.
      store.pool = []
      // @ts-expect-error pool entries are deeply readonly.
      store.pool[0]!.sourceNote.purpose = 'not an input path'
      // @ts-expect-error pool status is readonly.
      store.poolStatus = 'idle'
    }
    expect(assertTypes).toBeTypeOf('function')
  })

  test('direct detail entry has selectable targets; every pool row can be assigned and disappears from pool into collect', async () => {
    const { client, store, jobs, assigns } = connect()
    const router = createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes })
    registerJobRoutes(router, pinia)
    await router.push('/jobs/j-collect/collect')
    const wrapper = mount({ render: () => h(RouterView) }, { global: { plugins: [router] } })
    await flushPromises()
    expect(jobs.listStatus).toBe('idle')
    await wrapper.getComponent(CollectWorkspace).get('button').trigger('click')
    await flushPromises()
    const original = [...store.pool]
    expect(original.length).toBeGreaterThan(0)
    for (const upload of original) {
      const row = wrapper.getComponent(UnassignedPool).findAll('li')[0]!
      await row.get('select').setValue('j-collect')
      expect(row.get('button').attributes('disabled')).toBeUndefined()
      await row.get('button').trigger('click')
      await flushPromises()
      expect(assigns).toHaveBeenLastCalledWith(upload.id, 'j-collect')
      expect(store.pool.map(item => item.id)).not.toContain(upload.id)
      const workspace = jobs.currentStageWorkspace!
      if (workspace.stage !== 'collect') throw new Error('Expected collect workspace')
      expect(workspace.uploads).toContainEqual({ ...upload, jobId: 'j-collect' })
      expect(wrapper.getComponent(CollectWorkspace).text()).toContain(upload.sourceNote.purpose)
    }
    expect(assigns).toHaveBeenCalledTimes(original.length)
    expect(wrapper.getComponent(UnassignedPool).text()).toContain('待归属池为空。')
    expect(await client.listUnassignedUploads()).toEqual([])
  })

  test('empty and slow pool reads have explicit states', async () => {
    vi.useFakeTimers()
    const { store } = connect('slow')
    const wrapper = mount(UnassignedPool)
    await flushPromises()
    expect(store.poolStatus).toBe('loading')
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(store.poolStatus).toBe('ready')
    expect(wrapper.findComponent(Loading).exists()).toBe(false)
    changeScenario('empty')
    await store.loadPool()
    await flushPromises()
    expect(wrapper.text()).toContain('待归属池为空。')
  })

  test('read failure resolves, retains old pool and original error, copies diagnostics and retries', async () => {
    const { store, poolReads, jobs } = connect()
    await jobs.ensureJobs()
    const wrapper = mount(UnassignedPool)
    await flushPromises()
    const pool = store.pool
    changeScenario('error')
    await expect(store.loadPool()).resolves.toBeUndefined()
    await flushPromises()
    const original = await poolReads.mock.results.at(-1)!.value.catch((cause: ErrorResponse) => cause)
    expect(store.pool).toBe(pool)
    expect(store.poolStatus).toBe('error')
    expect(toRaw(store.poolError)).toBe(original.error)
    const error = wrapper.getComponent(ErrorState)
    expect(error.props('moduleId')).toBe('intake-pool')
    expect(toRaw(error.props('error'))).toBe(original.error)
    await error.findAll('button')[0]!.trigger('click')
    expect(await navigator.clipboard.readText()).toBe(error.get('code').text())
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(store.poolStatus).toBe('ready')
    expect(store.poolError).toBeNull()
    expect(wrapper.findComponent(ErrorState).exists()).toBe(false)
  })

  test('assignment UI catches errors without refresh and can retry the selected row', async () => {
    const { store, assigns, lists, poolReads } = connect()
    const wrapper = mount(UnassignedPool)
    await flushPromises()
    lists.mockClear(); poolReads.mockClear()
    const id = store.pool[0]!.id
    changeScenario('error')
    const row = wrapper.findAll('li')[0]!
    await row.get('select').setValue('j-collect')
    await row.get('button').trigger('click')
    await flushPromises()
    const original = await assigns.mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    const error = row.getComponent(ErrorState)
    expect(error.props('moduleId')).toBe('intake-pool')
    expect(toRaw(error.props('error'))).toBe(original.error)
    expect(lists).not.toHaveBeenCalled()
    expect(poolReads).not.toHaveBeenCalled()
    expect(store.pool[0]!.id).toBe(id)
    await error.findAll('button')[0]!.trigger('click')
    expect(await navigator.clipboard.readText()).toBe(error.get('code').text())
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(assigns.mock.calls).toEqual([[id, 'j-collect'], [id, 'j-collect']])
    expect(store.pool.map(upload => upload.id)).not.toContain(id)
  })
})

describe('WI remove confirm', () => {
  test.each([null, '  替换为最新口径  '])('cancel is zero calls; confirm carries default or edited reason (%j), removes row and retains history anchors', async customReason => {
    const { jobs, store, client, removes, lists, reads, poolReads } = connect()
    await jobs.ensureJobs()
    await jobs.openJob('j-collect', 'collect')
    await store.loadPool()
    const wrapper = collectView(jobs)
    const rows = wrapper.get('[aria-label="采集列表"]').findAll('li')
    // Every row has a genuine button and confirmation; opening/cancelling never writes.
    for (const row of rows) {
      await button(row, '删除来源').trigger('click')
      const panel = row.get('[aria-label="确认删除来源"]')
      expect(panel.element.tagName).toBe('SECTION')
      expect((panel.get('textarea').element as HTMLTextAreaElement).value).toBe('来源不再适用')
      expect(wrapper.find('[role="dialog"], [aria-modal], [inert]').exists()).toBe(false)
      await button(panel, '取消').trigger('click')
      expect(row.find('[aria-label="确认删除来源"]').exists()).toBe(false)
    }
    expect(removes).not.toHaveBeenCalled()
    const before = await client.getStageWorkspace('j-collect', 'collect')
    if (before.stage !== 'collect') throw new Error('Expected collect workspace')
    const upload = before.uploads[0]!
    const oldHistory = await client.listInterventions('j-collect')
    const oldPreview = await client.getIntakePreview(upload.id)
    await store.selectUpload(upload)
    lists.mockClear(); reads.mockClear(); poolReads.mockClear()
    await button(rows[0]!, '删除来源').trigger('click')
    const panel = rows[0]!.get('[aria-label="确认删除来源"]')
    if (customReason !== null) await panel.get('textarea').setValue(customReason)
    await button(panel, '确认删除').trigger('click')
    await flushPromises()
    const expectedReason = customReason?.trim() ?? '来源不再适用'
    expect(removes).toHaveBeenCalledExactlyOnceWith(upload.id, expectedReason)
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(reads).toHaveBeenCalledExactlyOnceWith('j-collect')
    expect(poolReads).toHaveBeenCalledExactlyOnceWith()
    expect(wrapper.findAll('li')).toHaveLength(rows.length - 1)
    expect(store.selection).toBeNull()
    expect(store.previewTarget).toBeNull()
    expect(store.previewStatus).toBe('idle')
    const history = await client.listInterventions('j-collect')
    expect(history.slice(0, -1)).toEqual(oldHistory)
    expect(history.at(-1)).toMatchObject({ jobId: 'j-collect', kind: 'delete', artifactId: 'j-collect-dataset', baseRev: before.artifacts[0]!.latestMergedRev, payload: { action: 'remove_source', uploadId: upload.id, reason: expectedReason } })
    // A13a domain rule remains in effect, not implemented again in the UI.
    await expect(client.removeUpload(upload.id, expectedReason)).rejects.toMatchObject({ error: { code: 'validation_error' } })
    expect(await client.listInterventions('j-collect')).toEqual(history)
    expect(await client.getIntakePreview(upload.id)).toEqual(oldPreview)
  })

  test('blank reason is rejected at UI boundary without calling remove', async () => {
    const { jobs, removes } = connect()
    await jobs.openJob('j-collect', 'collect')
    const wrapper = collectView(jobs)
    const row = wrapper.findAll('li')[0]!
    await button(row, '删除来源').trigger('click')
    const panel = row.get('[aria-label="确认删除来源"]')
    await panel.get('textarea').setValue('  ')
    await button(panel, '确认删除').trigger('click')
    expect(panel.get('[role="alert"]').text()).toBe('请填写删除理由。')
    expect(removes).not.toHaveBeenCalled()
  })

  test('delete UI catches contract errors, keeps row/selection, copies diagnostics and retries', async () => {
    const { jobs, store, removes, lists, poolReads } = connect()
    await jobs.openJob('j-collect', 'collect')
    const workspace = jobs.currentStageWorkspace!
    if (workspace.stage !== 'collect') throw new Error('Expected collect workspace')
    await store.selectUpload(workspace.uploads[0]!)
    const selection = store.selection
    const wrapper = collectView(jobs)
    changeScenario('error')
    const row = wrapper.findAll('li')[0]!
    await button(row, '删除来源').trigger('click')
    const panel = row.get('[aria-label="确认删除来源"]')
    await panel.get('textarea').setValue('更正理由')
    await button(panel, '确认删除').trigger('click')
    await flushPromises()
    const original = await removes.mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    const error = panel.getComponent(ErrorState)
    expect(error.props('moduleId')).toBe('intake-remove')
    expect(toRaw(error.props('error'))).toBe(original.error)
    await error.findAll('button')[0]!.trigger('click')
    expect(await navigator.clipboard.readText()).toBe(error.get('code').text())
    expect(store.selection).toBe(selection)
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(lists).not.toHaveBeenCalled()
    expect(poolReads).not.toHaveBeenCalled()
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(removes.mock.calls).toEqual([['j-collect-source-1', '更正理由'], ['j-collect-source-1', '更正理由']])
    expect(wrapper.findAll('li')).toHaveLength(1)
  })
})

describe('WI assign refresh', () => {
  test.each(['assign', 'remove'] as const)('%s success updates shared summary/order exactly once, reloads pool once and clears matching preview before refresh', async action => {
    const { jobs, store, lists, reads, poolReads, workspaces } = connect()
    await jobs.ensureJobs()
    await jobs.openJob('j-collect', 'collect')
    await store.loadPool()
    const upload = store.pool[0]!
    if (action === 'remove') await store.assign(upload.id, 'j-collect')
    const workspace = jobs.currentStageWorkspace!
    if (workspace.stage !== 'collect') throw new Error('Expected collect workspace')
    await store.selectUpload(action === 'assign' ? upload : workspace.uploads.find(item => item.id === upload.id)!)
    const previous = jobs.jobs.find(job => job.id === 'j-collect')!.updatedAt
    lists.mockClear(); reads.mockClear(); poolReads.mockClear(); workspaces.mockClear()
    // Advance wall time without altering the contract or jobsStore implementation.
    vi.useFakeTimers()
    vi.setSystemTime(new Date(Math.max(...jobs.jobs.map(job => Date.parse(job.updatedAt))) + 1000))
    const receipt = await (action === 'assign' ? store.assign(upload.id, 'j-collect') : store.remove(upload.id, '移除'))
    expect(receipt.jobs[0]!.id).toBe('j-collect')
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(reads).toHaveBeenCalledExactlyOnceWith('j-collect')
    expect(workspaces).toHaveBeenCalledExactlyOnceWith('j-collect', 'collect')
    expect(poolReads).toHaveBeenCalledExactlyOnceWith()
    expect(jobs.jobs[0]!.id).toBe('j-collect')
    expect(jobs.jobs[0]!.updatedAt).not.toBe(previous)
    expect(store.selection).toBeNull()
    expect(store.previewTarget).toBeNull()
    expect(store.previewStatus).toBe('idle')
    expect(store.previewError).toBeNull()
    expect(store.pool.map(item => item.id)).not.toContain(upload.id)
  })

  test.each(['assign', 'remove'] as const)('%s failure rejects original response without changing any view cache or rereading', async action => {
    const { store, jobs, assigns, removes, lists, reads, poolReads } = connect()
    await jobs.openJob('j-collect', 'collect')
    await store.loadPool()
    const upload = store.pool[0]!
    await store.selectUpload(upload)
    const pool = store.pool
    const selection = store.selection
    const target = store.previewTarget
    const job = jobs.currentJob
    changeScenario('error')
    lists.mockClear(); reads.mockClear(); poolReads.mockClear()
    const result = (action === 'assign' ? store.assign(upload.id, 'j-collect') : store.remove(upload.id, '移除')).catch((cause: ErrorResponse) => cause)
    const original = await (action === 'assign' ? assigns : removes).mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    expect(await result).toBe(original)
    expect(store.selection).toBe(selection)
    expect(store.previewTarget).toBe(target)
    expect(store.pool).toBe(pool)
    expect(jobs.currentJob).toBe(job)
    expect(lists).not.toHaveBeenCalled()
    expect(reads).not.toHaveBeenCalled()
    expect(poolReads).not.toHaveBeenCalled()
  })

  test.each(['assign', 'remove'] as const)('%s clears a matching failed preview target even when selection is null', async action => {
    const { store, client } = connect()
    const upload = (await client.listUnassignedUploads())[0]!
    changeScenario('error')
    await store.selectUpload(upload)
    expect(store.selection).toBeNull()
    expect(store.previewStatus).toBe('error')
    expect(store.previewTarget!.id).toBe(upload.id)
    changeScenario('normal')
    await (action === 'assign' ? store.assign(upload.id, 'j-collect') : store.remove(upload.id, '移除'))
    expect(store.selection).toBeNull()
    expect(store.previewTarget).toBeNull()
    expect(store.previewStatus).toBe('idle')
    expect(store.previewError).toBeNull()
  })

  test.each(['assign', 'remove'] as const)('%s of another id preserves selection and target', async action => {
    const { store } = connect()
    await store.loadPool()
    await store.selectUpload(store.pool[0]!)
    const selection = store.selection
    const target = store.previewTarget
    const other = store.pool[1]!.id
    await (action === 'assign' ? store.assign(other, 'j-collect') : store.remove(other, '移除'))
    expect(store.selection).toBe(selection)
    expect(store.previewTarget).toBe(target)
    expect(store.previewStatus).toBe('ready')
  })

  test.each(['submit', 'confirm', 'assign', 'remove'] as const)('%s reloads an already loaded pool exactly once after one jobs refresh', async action => {
    const { store, lists, poolReads } = connect()
    await store.loadPool()
    const upload = store.pool[0]!
    if (action === 'confirm') await store.selectUpload(upload)
    lists.mockClear(); poolReads.mockClear()
    if (action === 'submit') await store.submit({ inputKind: 'text', text: '合成正文', sourceNote: note })
    else if (action === 'confirm') await store.confirm([{ sourceField: '库存', targetField: 'saved', unit: '吨' }])
    else if (action === 'assign') await store.assign(upload.id, 'j-collect')
    else await store.remove(upload.id, '移除')
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(poolReads).toHaveBeenCalledExactlyOnceWith()
    expect(lists.mock.invocationCallOrder[0]!).toBeLessThan(poolReads.mock.invocationCallOrder[0]!)
    if (action === 'submit') expect(store.pool.map(item => item.id)).toContain(store.selection!.upload.id)
    if (action === 'confirm') expect(store.pool[0]!.status).toBe('ingested')
  })

  test.each(['submit', 'confirm', 'assign', 'remove'] as const)('%s does not load an idle pool', async action => {
    const { store, client, lists, poolReads } = connect()
    const upload = (await client.listUnassignedUploads())[0]!
    if (action === 'confirm') await store.selectUpload(upload)
    if (action === 'submit') await store.submit({ inputKind: 'text', text: '合成正文', sourceNote: note })
    else if (action === 'confirm') await store.confirm([{ sourceField: '库存', targetField: 'saved', unit: '吨' }])
    else if (action === 'assign') await store.assign(upload.id, 'j-collect')
    else await store.remove(upload.id, '移除')
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(poolReads).not.toHaveBeenCalled()
    expect(store.poolStatus).toBe('idle')
  })

  test.each(['submit', 'confirm'] as const)('%s failure also preserves a loaded pool without rereading it', async action => {
    const { store, lists, poolReads, submits, confirms } = connect()
    await store.loadPool()
    await store.selectUpload(store.pool[0]!)
    const pool = store.pool
    const selection = store.selection
    const target = store.previewTarget
    changeScenario('error')
    poolReads.mockClear()
    const result = (action === 'submit'
      ? store.submit({ inputKind: 'text', text: '保留正文', sourceNote: note })
      : store.confirm([{ sourceField: '库存', targetField: 'saved', unit: '吨' }])).catch((cause: ErrorResponse) => cause)
    const original = await (action === 'submit' ? submits : confirms).mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    expect(await result).toBe(original)
    expect(store.pool).toBe(pool)
    expect(store.selection).toBe(selection)
    expect(store.previewTarget).toBe(target)
    expect(lists).not.toHaveBeenCalled()
    expect(poolReads).not.toHaveBeenCalled()
  })

  test.each(['assign', 'remove'] as const)('%s clears a receipt-only selection without a preview target', async action => {
    const { store } = connect()
    const receipt = await store.submit({ inputKind: 'text', text: '合成正文', sourceNote: note })
    expect(store.selection!.upload.id).toBe(receipt.upload.id)
    expect(store.previewTarget).toBeNull()
    await (action === 'assign' ? store.assign(receipt.upload.id, 'j-collect') : store.remove(receipt.upload.id, '移除'))
    expect(store.selection).toBeNull()
    expect(store.previewStatus).toBe('idle')
    expect(store.previewError).toBeNull()
  })

  test('slow assignment clears preview before refreshing, then awaits both jobs and pool reads', async () => {
    const { store, lists, poolReads } = connect()
    await store.loadPool()
    const upload = store.pool[0]!
    await store.selectUpload(upload)
    lists.mockClear(); poolReads.mockClear()
    vi.useFakeTimers()
    changeScenario('slow')
    let resolved = false
    const pending = store.assign(upload.id, 'j-collect').then(() => { resolved = true })
    await vi.advanceTimersByTimeAsync(1500)
    expect(store.selection).toBeNull()
    expect(store.previewTarget).toBeNull()
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(poolReads).not.toHaveBeenCalled()
    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1500)
    expect(poolReads).toHaveBeenCalledExactlyOnceWith()
    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1500)
    await pending
    expect(resolved).toBe(true)
    expect(store.pool.map(item => item.id)).not.toContain(upload.id)
  })
})
