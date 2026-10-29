import { config, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { isReadonly, toRaw } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { router as appRouter } from '../../../src/app/router.ts'
import { agentClient, dataClient } from '../../../src/contracts/index.ts'
import { createMockDataClient } from '../../../src/contracts/mock/index.ts'
import { INTAKE_FILE_EXTENSIONS, ReliabilityLabel, type Bootstrap, type ErrorResponse, type SourceNote } from '../../../src/contracts/types.ts'
import { registerJobRoutes } from '../../../src/jobs/routes.ts'
import IntakePanel from '../../../src/jobs/stages/IntakePanel.vue'
import { useIntakeStore, type IntakeSubmission } from '../../../src/jobs/stores/intake.ts'
import { useJobsStore } from '../../../src/jobs/stores/jobs.ts'
import ErrorState from '../../../src/shared/components/ErrorState.vue'

let pinia: ReturnType<typeof createPinia>
let router: ReturnType<typeof createRouter>
enableAutoUnmount(afterEach)
beforeEach(async () => {
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  delete window.__FAI_MOCK__
  vi.stubEnv('VITE_MOCK_SCENARIO', undefined)
  pinia = createPinia()
  setActivePinia(pinia)
  config.global.plugins = [pinia]
  router = createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes })
  registerJobRoutes(router, pinia)
  await router.push('/jobs/j-collect/collect')
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
  const writes = vi.spyOn(dataClient, 'submitIntake').mockImplementation((...args) => client.submitIntake(...args))
  const lists = vi.spyOn(dataClient, 'listJobs').mockImplementation((...args) => client.listJobs(...args))
  const reads = vi.spyOn(dataClient, 'getJob').mockImplementation((...args) => client.getJob(...args))
  const workspaces = vi.spyOn(dataClient, 'getStageWorkspace').mockImplementation((...args) => client.getStageWorkspace(...args))
  return { client, writes, lists, reads, workspaces, store: useIntakeStore(pinia), jobs: useJobsStore(pinia) }
}

function mountPanel() {
  return mount(IntakePanel, { global: { plugins: [router] } })
}

async function chooseFile(wrapper: ReturnType<typeof mountPanel>, file: File) {
  const input = wrapper.get('input[type="file"]')
  Object.defineProperty(input.element, 'files', { configurable: true, value: [file] })
  await input.trigger('change')
}

const note: SourceNote = { purpose: '对照库存', reliability: 'unknown', publishedAt: null, validUntil: null, scopeNote: null }
const initialDraft = {
  inputKind: 'file', fileMeta: null, url: '', text: '', purpose: '', reliability: 'unknown',
  publishedAt: '', validUntil: '', scopeNote: '',
}

describe('WI AC-003-2', () => {
  test.each(INTAKE_FILE_EXTENSIONS)('selects and submits allowed .%s metadata via the actual API', async ext => {
    const { client, writes, store } = connect()
    store.open()
    const wrapper = mountPanel()
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('aria-label')).toBe('投放表单')
    expect(wrapper.find('[role="dialog"], [aria-modal], [inert]').exists()).toBe(false)
    expect(wrapper.get('input[type="file"]').attributes('accept')).toBe('.pdf,.docx,.xlsx,.md,.csv')
    const file = new File(['合成内容'], `sample.${ext.toUpperCase()}`, { type: '', lastModified: 1000 })
    await chooseFile(wrapper, file)
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    const fileMeta = { name: file.name, size: file.size, type: file.type, lastModified: file.lastModified }
    expect(writes).toHaveBeenCalledExactlyOnceWith({ jobId: null, inputKind: 'file', fileMeta, sourceNote: note })
    const receipt = await writes.mock.results[0]!.value
    expect((await client.listUnassignedUploads()).map(upload => upload.id)).toContain(receipt.upload.id)
    expect(receipt.upload).toMatchObject({ inputKind: 'file', fileMeta, status: 'pending_validation' })
  })

  test.each(['select', 'drop'] as const)('rejects a disallowed file after an allowed one through %s, clears metadata and lists the whitelist', async method => {
    const { writes, store } = connect()
    const wrapper = mountPanel()
    await chooseFile(wrapper, new File(['sample'], 'allowed.csv'))
    expect(store.draft.fileMeta?.name).toBe('allowed.csv')
    const file = new File(['sample'], 'blocked.exe')
    if (method === 'select') await chooseFile(wrapper, file)
    else await wrapper.get('.intake-drop').trigger('drop', { dataTransfer: { files: [file] } })
    expect(store.draft.fileMeta).toBeNull()
    expect(wrapper.text()).toContain(`只接受 ${INTAKE_FILE_EXTENSIONS.join(' / ')} 文件`)
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('请选择文件')
    expect(writes).not.toHaveBeenCalled()
  })

  test('drop accepts only the first file and submits its metadata', async () => {
    const { writes } = connect()
    const wrapper = mountPanel()
    const first = new File(['abc'], 'first.md', { type: 'text/markdown', lastModified: 42 })
    await wrapper.get('.intake-drop').trigger('dragover')
    await wrapper.get('.intake-drop').trigger('drop', { dataTransfer: { files: [first, new File(['second'], 'second.csv')] } })
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(writes).toHaveBeenCalledExactlyOnceWith({ jobId: null, inputKind: 'file', fileMeta: { name: 'first.md', size: 3, type: 'text/markdown', lastModified: 42 }, sourceNote: note })
  })

  test.each([
    ['url', '投放链接', '  https://example.test/source  ', 'https://example.test/source'],
    ['text', '投放文本', '  合成投放正文\n第二行  ', '合成投放正文\n第二行'],
  ] as const)('submits only the selected %s branch; draft keeps raw input until the boundary', async (kind, label, raw, expected) => {
    const { writes, store } = connect()
    store.updateDraft({ url: '旧链接', text: '旧文本', fileMeta: { name: 'old.csv', size: 1, type: '', lastModified: 0 } })
    const wrapper = mountPanel()
    await wrapper.get(`input[value="${kind}"]`).setValue(true)
    await wrapper.get(`[aria-label="${label}"]`).setValue(raw)
    // type=url applies the browser's value sanitization; the store keeps the DOM input unchanged.
    expect(store.draft[kind]).toBe((wrapper.get(`[aria-label="${label}"]`).element as HTMLInputElement | HTMLTextAreaElement).value)
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(writes).toHaveBeenCalledExactlyOnceWith({ jobId: null, inputKind: kind, [kind]: expected, sourceNote: note })
  })

  test.each([
    ['file', '请选择文件'], ['url', '请填写链接'], ['text', '请粘贴文本'],
  ] as const)('requires a nonempty %s input', async (kind, hint) => {
    const { writes } = connect()
    const wrapper = mountPanel()
    await wrapper.get(`input[value="${kind}"]`).setValue(true)
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain(hint)
    expect(writes).not.toHaveBeenCalled()
  })
})

describe('WI purpose required', () => {
  test.each(['', '   '])('rejects empty/whitespace purpose (%j) without a write', async purpose => {
    const { writes } = connect()
    const wrapper = mountPanel()
    await wrapper.get('input[value="text"]').setValue(true)
    await wrapper.get('[aria-label="投放文本"]').setValue('样例')
    await wrapper.get('[aria-label="用途"]').setValue(purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('请填写用途')
    expect(writes).not.toHaveBeenCalled()
  })

  test('uses contract reliability labels/default unknown and submits null optional values', async () => {
    const { writes } = connect()
    const wrapper = mountPanel()
    const select = wrapper.get('select[aria-label="可靠性"]')
    expect(select.findAll('option').map(option => [option.attributes('value'), option.text()])).toEqual(Object.entries(ReliabilityLabel).map(([value, label]) => [value, label.text]))
    expect((select.element as HTMLSelectElement).value).toBe('unknown')
    await wrapper.get('input[value="text"]').setValue(true)
    await wrapper.get('[aria-label="投放文本"]').setValue('样例')
    await wrapper.get('[aria-label="用途"]').setValue('  对照库存  ')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(writes.mock.calls[0]![0].sourceNote).toEqual(note)
  })

  test('submits all five user-provided source-note fields', async () => {
    const { writes } = connect()
    const wrapper = mountPanel()
    await wrapper.get('input[value="text"]').setValue(true)
    await wrapper.get('[aria-label="投放文本"]').setValue('样例')
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('[aria-label="可靠性"]').setValue('high')
    await wrapper.get('[aria-label="发布日期"]').setValue('2026-10-01')
    await wrapper.get('[aria-label="有效期"]').setValue('2026-11-01')
    await wrapper.get('[aria-label="口径备注"]').setValue('本周\n同口径')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(writes.mock.calls[0]![0].sourceNote).toEqual({ purpose: note.purpose, reliability: 'high', publishedAt: '2026-10-01', validUntil: '2026-11-01', scopeNote: '本周\n同口径' })
  })
})

describe('WI metadata only', () => {
  test('file selection/drop/submission never reads bytes or creates an object URL, and the store holds only metadata', async () => {
    const { store, writes } = connect()
    const readers = [
      vi.spyOn(File.prototype, 'text'), vi.spyOn(File.prototype, 'arrayBuffer'),
      vi.spyOn(File.prototype, 'stream'), vi.spyOn(File.prototype, 'slice'),
      vi.spyOn(FileReader.prototype, 'readAsText'), vi.spyOn(FileReader.prototype, 'readAsArrayBuffer'),
      vi.spyOn(FileReader.prototype, 'readAsDataURL'), vi.spyOn(FileReader.prototype, 'readAsBinaryString'),
      vi.spyOn(URL, 'createObjectURL'),
    ]
    const wrapper = mountPanel()
    const file = new File(['UNREAD_SYNTHETIC_FILE_BODY'], 'sample.pdf', { type: 'application/pdf', lastModified: 123 })
    await chooseFile(wrapper, file)
    await wrapper.get('.intake-drop').trigger('drop', { dataTransfer: { files: [file] } })
    expect(store.draft.fileMeta).not.toBeInstanceOf(File)
    expect(Object.keys(store.draft.fileMeta!)).toEqual(['name', 'size', 'type', 'lastModified'])
    expect(store.draft.fileMeta).toEqual({ name: file.name, size: file.size, type: file.type, lastModified: file.lastModified })
    expect(isReadonly(store.draft.fileMeta)).toBe(true)
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(writes).toHaveBeenCalledTimes(1)
    for (const reader of readers) expect(reader).not.toHaveBeenCalled()
    expect(localStorage.getItem('fai.jobs.v1')).not.toContain('UNREAD_SYNTHETIC_FILE_BODY')
  })

  test('keeps raw text only in memory/submission and never fetches a submitted URL', async () => {
    const { writes, store } = connect()
    const fetch = vi.spyOn(globalThis, 'fetch')
    const xhr = vi.spyOn(XMLHttpRequest.prototype, 'open')
    const wrapper = mountPanel()
    expect(wrapper.text()).toContain('本地样例记录；原文不保存，刷新后需重新投放原文')
    const text = 'SYNTHETIC_INTAKE_BODY_NOT_FOR_PERSISTENCE_94817'
    await wrapper.get('input[value="text"]').setValue(true)
    await wrapper.get('[aria-label="投放文本"]').setValue(text)
    expect(store.draft.text).toBe(text)
    expect(localStorage.getItem('fai.jobs.v1')).toBeNull()
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(writes.mock.calls[0]![0]).toMatchObject({ inputKind: 'text', text })
    expect(store.draft.text).toBe('')
    expect(localStorage.getItem('fai.jobs.v1')).not.toBeNull()
    expect(localStorage.getItem('fai.jobs.v1')).not.toContain(text)
    await wrapper.get('input[value="url"]').setValue(true)
    await wrapper.get('[aria-label="投放链接"]').setValue('https://example.test/no-fetch')
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(writes).toHaveBeenCalledTimes(2)
    expect(fetch).not.toHaveBeenCalled()
    expect(xhr).not.toHaveBeenCalled()
  })
})

describe('WI H-5 store', () => {
  test('starts closed with a deep-readonly draft and exposes no selection/pool or writable target; DTO excludes jobId', () => {
    const { store } = connect()
    expect(store.isOpen).toBe(false)
    expect(store.jobId).toBeNull()
    expect(store.draft).toEqual(initialDraft)
    expect(isReadonly(store.draft)).toBe(true)
    expect(Object.keys(store.$state)).toEqual([])
    expect(store).not.toHaveProperty('selection')
    expect(store).not.toHaveProperty('pool')
    const assertTypes = () => {
      // @ts-expect-error H-5 target is readonly.
      store.jobId = 'j-process'
      // @ts-expect-error H-5 open state is readonly.
      store.isOpen = true
      // @ts-expect-error draft fields are readonly; updates go through the action.
      store.draft.text = 'not an input path'
      if (store.draft.fileMeta) {
        // @ts-expect-error metadata is deeply readonly as well.
        store.draft.fileMeta.name = 'other.csv'
      }
      // @ts-expect-error caller must not override the open-time target.
      void store.submit({ inputKind: 'text', text: '样例', sourceNote: note, jobId: 'j-process' })
      const submissions: IntakeSubmission[] = [
        { inputKind: 'text', text: '样例', sourceNote: note },
        { inputKind: 'url', url: 'https://example.test', sourceNote: note },
        { inputKind: 'file', fileMeta: { name: 'sample.csv', size: 1, type: '', lastModified: 0 }, sourceNote: note },
      ]
      return submissions
    }
    expect(assertTypes).toBeTypeOf('function')
  })

  test('snapshots open target across navigation, then open() overrides it to the actual pool; each success refreshes exactly once', async () => {
    const { client, store, jobs, writes, lists, reads, workspaces } = connect()
    await jobs.openJob('j-collect', 'collect')
    reads.mockClear()
    workspaces.mockClear()
    store.open('j-collect')
    expect(store.isOpen).toBe(true)
    expect(store.jobId).toBe('j-collect')
    await router.push('/jobs/j-process/process')
    expect(store.jobId).toBe('j-collect')
    store.updateDraft({ inputKind: 'text', text: '草稿', purpose: note.purpose })
    const receipt = await store.submit({ inputKind: 'text', text: '草稿', sourceNote: note })
    expect(writes).toHaveBeenCalledExactlyOnceWith({ inputKind: 'text', text: '草稿', sourceNote: note, jobId: 'j-collect' })
    expect(receipt.upload.jobId).toBe('j-collect')
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(reads).toHaveBeenCalledExactlyOnceWith('j-collect')
    expect(workspaces).toHaveBeenCalledExactlyOnceWith('j-collect', 'collect')
    expect(jobs.currentStageWorkspace?.stage).toBe('collect')
    if (jobs.currentStageWorkspace?.stage === 'collect') expect(jobs.currentStageWorkspace.uploads.map(upload => upload.id)).toContain(receipt.upload.id)
    expect(store.draft).toEqual(initialDraft)
    expect(store.isOpen).toBe(true)
    store.open()
    expect(store.jobId).toBeNull()
    lists.mockClear()
    const poolReceipt = await store.submit({ inputKind: 'url', url: 'https://example.test/pool', sourceNote: note })
    expect(writes).toHaveBeenLastCalledWith({ inputKind: 'url', url: 'https://example.test/pool', sourceNote: note, jobId: null })
    expect((await client.listUnassignedUploads()).map(upload => upload.id)).toContain(poolReceipt.upload.id)
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    store.open('j-process')
    expect(store.jobId).toBe('j-process')
  })

  test('close preserves draft/target without navigation or agent calls; remount after route change retains the input', async () => {
    const { store, writes } = connect()
    const send = vi.spyOn(agentClient, 'send')
    store.open('j-collect')
    const wrapper = mountPanel()
    await wrapper.get('input[value="text"]').setValue(true)
    await wrapper.get('[aria-label="投放文本"]').setValue('尚未提交的正文')
    await wrapper.get('[aria-label="用途"]').setValue('跨页草稿')
    const push = vi.spyOn(router, 'push')
    const replace = vi.spyOn(router, 'replace')
    store.close()
    expect(store.isOpen).toBe(false)
    expect(store.jobId).toBe('j-collect')
    expect(store.draft.text).toBe('尚未提交的正文')
    expect(push).not.toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
    expect(writes).not.toHaveBeenCalled()
    wrapper.unmount()
    await router.push('/prices')
    store.open()
    const remounted = mountPanel()
    expect((remounted.get('[aria-label="投放文本"]').element as HTMLTextAreaElement).value).toBe('尚未提交的正文')
    expect((remounted.get('[aria-label="用途"]').element as HTMLInputElement).value).toBe('跨页草稿')
    expect(store.jobId).toBeNull()
    expect(localStorage.getItem('fai.jobs.v1')).toBeNull()
    store.resetDraft()
    expect(store.draft).toEqual(initialDraft)
  })

  test('awaits the real refresh after success rather than resolving with a stale cache', async () => {
    vi.useFakeTimers()
    const { store, jobs, lists } = connect('slow')
    store.open()
    store.updateDraft({ inputKind: 'text', text: '慢样例', purpose: note.purpose })
    let resolved = false
    const pending = store.submit({ inputKind: 'text', text: '慢样例', sourceNote: note }).then(receipt => { resolved = true; return receipt })
    await vi.advanceTimersByTimeAsync(1500)
    expect(store.draft).toEqual(initialDraft)
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1499)
    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect((await pending).upload.jobId).toBeNull()
    expect(jobs.listStatus).toBe('ready')
    expect(resolved).toBe(true)
  })

  test('rejects with the original ErrorResponse, preserves draft and does not refresh on failure', async () => {
    const { store, writes, lists, reads, workspaces } = connect('error')
    store.open('j-collect')
    store.updateDraft({ inputKind: 'text', text: '保留草稿', purpose: note.purpose })
    const draft = store.draft
    const result = store.submit({ inputKind: 'text', text: '保留草稿', sourceNote: note }).catch((cause: ErrorResponse) => cause)
    const original = await writes.mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    expect(await result).toBe(original)
    expect(original.error.code).toBe('adapter_error')
    expect(store.draft).toBe(draft)
    expect(store.jobId).toBe('j-collect')
    expect(lists).not.toHaveBeenCalled()
    expect(reads).not.toHaveBeenCalled()
    expect(workspaces).not.toHaveBeenCalled()
  })

  test('the panel catches API rejection, copies original diagnostics and retries the same submission even after input edits', async () => {
    const { store, writes, lists } = connect('error')
    store.open('j-collect')
    const wrapper = mountPanel()
    await wrapper.get('input[value="text"]').setValue(true)
    await wrapper.get('[aria-label="投放文本"]').setValue('首次内容')
    await wrapper.get('[aria-label="用途"]').setValue(note.purpose)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    const original = await writes.mock.results[0]!.value.catch((cause: ErrorResponse) => cause)
    const error = wrapper.getComponent(ErrorState)
    expect(toRaw(error.props('error'))).toBe(original.error)
    const diagnostic = error.get('code').text()
    expect(JSON.parse(diagnostic)).toEqual({ moduleId: 'intake-submit', code: original.error.code, message: original.error.message, ts: expect.any(String) })
    await error.findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(await navigator.clipboard.readText()).toBe(diagnostic)
    expect(store.draft.text).toBe('首次内容')
    expect(lists).not.toHaveBeenCalled()
    await wrapper.get('[aria-label="投放文本"]').setValue('另一个尚未提交的修改')
    changeScenario('normal')
    await error.findAll('button')[1]!.trigger('click')
    await flushPromises()
    expect(writes).toHaveBeenCalledTimes(2)
    expect(writes.mock.calls[1]).toEqual(writes.mock.calls[0])
    expect(lists).toHaveBeenCalledExactlyOnceWith()
    expect(wrapper.findComponent(ErrorState).exists()).toBe(false)
    expect(store.draft).toEqual(initialDraft)
  })
})
