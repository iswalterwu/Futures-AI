import { config, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h, isReadonly, toRaw } from 'vue'
import { dataClient } from '../../../src/contracts/index.ts'
import { createMockDataClient, readJobFixtures } from '../../../src/contracts/mock/index.ts'
import { UploadStatusLabel, type Bootstrap, type ErrorResponse, type FieldMapping } from '../../../src/contracts/types.ts'
import CollectWorkspace from '../../../src/jobs/stages/CollectWorkspace.vue'
import IntakeDrawer from '../../../src/jobs/stages/IntakeDrawer.vue'
import ExtractionPreview from '../../../src/jobs/stages/ExtractionPreview.vue'
import MappingEditor from '../../../src/jobs/stages/MappingEditor.vue'
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
  const previews = vi.spyOn(dataClient, 'getIntakePreview').mockImplementation((...args) => client.getIntakePreview(...args))
  const confirms = vi.spyOn(dataClient, 'confirmIntake').mockImplementation((...args) => client.confirmIntake(...args))
  const submits = vi.spyOn(dataClient, 'submitIntake').mockImplementation((...args) => client.submitIntake(...args))
  const lists = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  const reads = vi.spyOn(dataClient, 'getJob').mockImplementation((...args) => client.getJob(...args))
  const workspaces = vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  return { client, previews, confirms, submits, lists, reads, workspaces, store: useIntakeStore(pinia), jobs: useJobsStore(pinia) }
}
function inject(quarantine = false) {
  const fixtures = readJobFixtures()
  const detail = fixtures['job-detail']['j-collect']!
  detail.collect.uploads[0]!.mapping = [{ sourceField: '库存', targetField: 'saved_inventory', unit: '吨' }]
  if (quarantine) detail.collect.uploads[0]!.quarantineReason = '合成隔离原因：出处不足'
  window.__FAI_MOCK__ = { jobFixtures: { 'job-detail': fixtures['job-detail'] } }
}
function collectView(jobs: ReturnType<typeof useJobsStore>) {
  return mount({ render: () => {
    const workspace = jobs.currentStageWorkspace!
    return workspace.stage === 'collect' ? h(CollectWorkspace, { job: jobs.currentJob!, workspace }) : null
  } })
}
const edited: FieldMapping = [{ sourceField: '库存', targetField: 'corrected_inventory', unit: '万吨' }]

// AC-003-4: exercise actual store, contract and input boundary, not a copied implementation.
describe('WI AC-003-4', () => {
  test('row preview copies readonly upload; saved mapping differs from detected fields; only confirmation writes', async () => {
    inject()
    const { store, jobs, client, previews, confirms } = connect()
    await jobs.openJob('j-collect', 'collect')
    const collect = collectView(jobs)
    const original = JSON.stringify(jobs.currentStageWorkspace)
    const drawer = mount(IntakeDrawer)
    const rows = collect.get('[aria-label="采集列表"]').findAll('li')
    for (const [index, row] of rows.entries()) {
      await row.findAll('button').find(button => button.text() === '预览 / 修正')!.trigger('click')
      await flushPromises()
      expect(store.jobId).toBe('j-collect')
      expect(store.isOpen).toBe(true)
      expect(previews).toHaveBeenLastCalledWith(`j-collect-source-${index + 1}`)
    }
    await rows[0]!.findAll('button').find(button => button.text() === '预览 / 修正')!.trigger('click')
    await flushPromises()
    const preview = drawer.getComponent(ExtractionPreview)
    expect(preview.text()).toContain('识别类型：合成时间序列表')
    expect(preview.text()).toContain('库存 → inventory · kt')
    expect(preview.text()).toContain('整体单位：kt')
    expect(preview.text()).toContain('2026-10-27 — 2026-10-28')
    const editor = drawer.getComponent(MappingEditor)
    expect((editor.get('input[aria-label="目标字段 1"]').element as HTMLInputElement).value).toBe('saved_inventory')
    expect((editor.get('input[aria-label="映射单位 1"]').element as HTMLInputElement).value).toBe('吨')
    expect(isReadonly(store.selection)).toBe(true)
    expect(isReadonly(store.selection!.mapping)).toBe(true)
    expect(isReadonly(store.previewTarget)).toBe(true)
    expect(Object.keys(store.$state)).toEqual([])
    await editor.get('[aria-label="目标字段 1"]').setValue(edited[0]!.targetField)
    await editor.get('[aria-label="映射单位 1"]').setValue(edited[0]!.unit)
    expect(store.selection!.upload.mapping[0]!.targetField).toBe('saved_inventory')
    expect(store.selection!.preview.fields[0]!.targetField).toBe('inventory')
    expect(store.selection!.upload.status).toBe('pending_validation')
    expect(JSON.stringify(jobs.currentStageWorkspace)).toBe(original)
    expect(confirms).not.toHaveBeenCalled()
    await editor.get('form').trigger('submit')
    await flushPromises()
    expect(confirms).toHaveBeenCalledExactlyOnceWith('j-collect-source-1', edited)
    expect(store.selection!.upload.status).toBe('ingested')
    expect(editor.find('input').exists()).toBe(false)
    expect(editor.text()).toContain('库存 → corrected_inventory · 万吨')
    expect((await client.getStageWorkspace('j-collect', 'collect')).stage).toBe('collect')
    const assertTypes = () => {
      // @ts-expect-error selection is readonly.
      store.selection = null
      // @ts-expect-error mapping is deeply readonly.
      store.selection!.mapping[0]!.unit = 'not an input'
      // @ts-expect-error preview target is readonly.
      store.previewTarget = null
    }
    expect(assertTypes).toBeTypeOf('function')
  })

  test('invalid mapping stays draft and does not call the contract', async () => {
    const { store, client, confirms } = connect()
    await store.selectUpload((await client.listUnassignedUploads())[0]!)
    const wrapper = mount(MappingEditor)
    await wrapper.get('[aria-label="目标字段 1"]').setValue('')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('请填写目标字段与单位')
    expect(confirms).not.toHaveBeenCalled()
    expect(store.selection!.upload.status).toBe('pending_validation')
  })

  test('submit sets receipt selection ready before refresh; unknown metadata stays unknown; open clears preview but not draft', async () => {
    vi.useFakeTimers()
    const { store, lists } = connect('slow')
    expect(store.previewTarget).toBeNull()
    expect(store.previewStatus).toBe('idle')
    const pending = store.submit({ inputKind: 'text', text: '合成正文', sourceNote: { purpose: '预览', reliability: 'unknown', publishedAt: null, validUntil: null, scopeNote: null } })
    await vi.advanceTimersByTimeAsync(1500)
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(store.previewStatus).toBe('ready')
    expect(store.selection!.upload.status).toBe('pending_validation')
    const preview = mount(ExtractionPreview)
    expect(preview.text()).toContain('整体单位：未知')
    expect(preview.text()).toContain('时间范围：未知')
    await vi.runAllTimersAsync()
    const receipt = await pending
    expect(store.selection!.mapping).toEqual(receipt.upload.mapping)
    store.updateDraft({ text: '保留草稿' })
    store.open('j-collect')
    expect(store.selection).toBeNull()
    expect(store.previewTarget).toBeNull()
    expect(store.previewStatus).toBe('idle')
    expect(store.previewError).toBeNull()
    expect(store.draft.text).toBe('保留草稿')
  })

  test('read failure resolves with original error and target; drawer copies diagnosis and retries the same upload', async () => {
    const { client, store, previews } = connect()
    const upload = (await client.listUnassignedUploads())[0]!
    changeScenario('error')
    const wrapper = mount(IntakeDrawer)
    await expect(store.selectUpload(upload)).resolves.toBeUndefined()
    await flushPromises()
    const original = await previews.mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    expect(toRaw(store.previewError)).toBe(original.error)
    expect(store.selection).toBeNull()
    expect(store.previewTarget).toEqual(upload)
    const error = wrapper.findAllComponents(ErrorState).find(component => component.props('moduleId') === 'intake-preview')!
    expect(toRaw(error.props('error'))).toBe(original.error)
    await error.findAll('button')[0]!.trigger('click')
    expect(await navigator.clipboard.readText()).toBe(error.get('code').text())
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(previews.mock.calls).toEqual([[upload.id], [upload.id]])
    expect(store.selection!.upload.id).toBe(upload.id)
    expect(store.previewError).toBeNull()
    expect(store.previewStatus).toBe('ready')
  })

  test('slow reads expose loading and keep the target before the await', async () => {
    const { client, store } = connect()
    const upload = (await client.listUnassignedUploads())[0]!
    vi.useFakeTimers()
    changeScenario('slow')
    const wrapper = mount(IntakeDrawer)
    const pending = store.selectUpload(upload)
    await flushPromises()
    expect(store.previewTarget).toEqual(upload)
    expect(store.previewStatus).toBe('loading')
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
    await vi.runAllTimersAsync()
    await pending
    await flushPromises()
    expect(store.previewStatus).toBe('ready')
    expect(wrapper.findComponent(ExtractionPreview).exists()).toBe(true)
  })
})

describe('WI AC-003-6', () => {
  test.each(['pending_validation', 'ingested', 'quarantined'] as const)('%s has text and icon in collect and preview, with readonly nonpending mapping', async status => {
    const fixtures = readJobFixtures()
    const upload = fixtures['job-detail']['j-collect']!.collect.uploads[0]!
    upload.status = status
    if (status === 'quarantined') upload.quarantineReason = '合成隔离原因'
    window.__FAI_MOCK__ = { jobFixtures: { 'job-detail': fixtures['job-detail'] } }
    const { jobs, store } = connect()
    await jobs.openJob('j-collect', 'collect')
    const collect = collectView(jobs)
    await store.selectUpload(upload)
    const preview = mount(ExtractionPreview)
    const editor = mount(MappingEditor)
    for (const badge of [collect.get('li .artifact-status-badge'), preview.get('.artifact-status-badge')]) {
      expect(badge.text()).toContain(UploadStatusLabel[status].text)
      expect(badge.get('[aria-hidden="true"]').text()).toBe(UploadStatusLabel[status].icon)
    }
    expect(editor.find('button[type="submit"]').exists()).toBe(status === 'pending_validation')
    if (status !== 'pending_validation') expect(editor.find('input').exists()).toBe(false)
    if (status === 'quarantined') {
      for (const view of [collect, preview, editor]) expect(view.text()).toContain('隔离原因：合成隔离原因')
    }
  })
  test('removed pending upload cannot be confirmed in the editor', async () => {
    const { client, store } = connect()
    const upload = (await client.listUnassignedUploads())[0]!
    await store.selectUpload({ ...upload, removed: true })
    expect(mount(MappingEditor).find('button[type="submit"]').exists()).toBe(false)
  })
})

describe('WI confirm refresh', () => {
  test.each([false, true])('receipt status and shared collect/list caches update once, then reselect uses saved mapping (quarantine=%s)', async quarantine => {
    inject(quarantine)
    const { jobs, store, client, lists, reads, workspaces, confirms } = connect()
    await jobs.ensureJobs()
    await jobs.openJob('j-collect', 'collect')
    const before = jobs.jobs.find(job => job.id === 'j-collect')!.updatedAt
    const collect = collectView(jobs)
    const workspace = jobs.currentStageWorkspace!
    if (workspace.stage !== 'collect') throw new Error('Expected collect workspace')
    await store.selectUpload(workspace.uploads[0]!)
    lists.mockClear(); reads.mockClear(); workspaces.mockClear()
    const receipt = await store.confirm(edited)
    await flushPromises()
    expect(confirms).toHaveBeenCalledExactlyOnceWith('j-collect-source-1', edited)
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(reads).toHaveBeenCalledExactlyOnceWith('j-collect')
    expect(workspaces).toHaveBeenCalledExactlyOnceWith('j-collect', 'collect')
    const status = quarantine ? 'quarantined' : 'ingested'
    expect(store.selection!.upload.status).toBe(status)
    expect(store.selection!.upload).toEqual(receipt.upload)
    expect(collect.get('li .artifact-status-badge').text()).toContain(UploadStatusLabel[status].text)
    expect(jobs.jobs[0]!.id).toBe('j-collect')
    expect(jobs.jobs[0]!.updatedAt).not.toBe(before)
    const updated = await client.getStageWorkspace('j-collect', 'collect')
    if (updated.stage !== 'collect') throw new Error('Expected collect workspace')
    await store.selectUpload(updated.uploads[0]!)
    expect(store.selection!.mapping).toEqual(edited)
    expect(store.selection!.preview.fields).not.toEqual(edited)
    expect(mount(MappingEditor).text()).toContain('库存 → corrected_inventory · 万吨')
  })

  test('failure rejects original response without refreshing or replacing selection; UI copies diagnostics', async () => {
    const { store, client, confirms, lists, reads } = connect()
    await store.selectUpload((await client.listUnassignedUploads())[0]!)
    store.editMapping(0, { targetField: 'unsaved' })
    const selection = store.selection
    changeScenario('error')
    const result = store.confirm(edited).catch((cause: ErrorResponse) => cause)
    const original = await confirms.mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    expect(await result).toBe(original)
    expect(store.selection).toBe(selection)
    expect(store.selection!.mapping[0]!.targetField).toBe('unsaved')
    expect(lists).not.toHaveBeenCalled()
    expect(reads).not.toHaveBeenCalled()
    const editor = mount(MappingEditor)
    await editor.get('form').trigger('submit')
    await flushPromises()
    const error = editor.getComponent(ErrorState)
    expect(error.props('moduleId')).toBe('intake-confirm')
    expect(JSON.parse(error.get('code').text()).code).toBe('adapter_error')
    await error.findAll('button')[0]!.trigger('click')
    expect(await navigator.clipboard.readText()).toBe(error.get('code').text())
    expect(store.selection).toBe(selection)
    expect(lists).not.toHaveBeenCalled()
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(store.selection!.upload.status).toBe('ingested')
    expect(lists).toHaveBeenCalledExactlyOnceWith()
  })

  test('success sets the receipt immediately but awaits slow refresh before resolving', async () => {
    const { store, client, lists } = connect()
    const upload = (await client.listUnassignedUploads())[0]!
    await store.selectUpload(upload)
    vi.useFakeTimers()
    changeScenario('slow')
    let resolved = false
    const pending = store.confirm(edited).then(() => { resolved = true })
    await vi.advanceTimersByTimeAsync(1500)
    expect(store.selection!.upload.status).toBe('ingested')
    expect(store.previewStatus).toBe('ready')
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(resolved).toBe(false)
    await vi.runAllTimersAsync()
    await pending
    expect(resolved).toBe(true)
  })
})
