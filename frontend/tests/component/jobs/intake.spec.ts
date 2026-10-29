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
  test('starts closed with readonly H-5 state and internal view caches; DTO excludes jobId', () => {
    const { store } = connect()
    expect(store.isOpen).toBe(false)
    expect(store.jobId).toBeNull()
    expect(store.draft).toEqual(initialDraft)
    expect(isReadonly(store.draft)).toBe(true)
    expect(Object.keys(store.$state)).toEqual([])
    expect(store.selection).toBeNull()
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

// T-C01a: append-only coverage; C01 tests and harness above remain unchanged.
import { h, readonly } from 'vue'
import { RouterView } from 'vue-router'
import { StageLabel, UploadStatusLabel } from '../../../src/contracts/types.ts'
import StageWorkspace from '../../../src/jobs/components/StageWorkspace.vue'
import CollectWorkspace from '../../../src/jobs/stages/CollectWorkspace.vue'
import IntakeDrawer from '../../../src/jobs/stages/IntakeDrawer.vue'
import drawerSource from '../../../src/jobs/stages/IntakeDrawer.vue?raw'
import Loading from '../../../src/shared/components/Loading.vue'

async function mountIntakePages(path: string) {
  await router.push(path)
  const wrapper = mount({ render: () => h(RouterView) }, { attachTo: document.body, global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('WI H-5 container', () => {
  test('fills the supplied container with the existing glass layer and no modal or positioning machinery', () => {
    connect()
    const wrapper = mount(IntakeDrawer)
    expect(wrapper.element.tagName).toBe('ASIDE')
    expect(wrapper.classes()).toEqual(['glass-drawer', 'intake-drawer'])
    expect(wrapper.attributes('aria-label')).toBe('投放抽屉')
    expect(wrapper.findComponent(IntakePanel).exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('投放')
    expect(wrapper.find('[role="dialog"], [aria-modal], [inert], dialog').exists()).toBe(false)
    expect(drawerSource).not.toMatch(/position:\s*fixed|backdrop|overlay|focusin|keydown|focus\(|inert|aria-modal/)
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(drawerSource.split('<style scoped>')[1]!.split('</style>')[0]!)
    const style = (Array.from(sheet.cssRules).find(rule => (rule as CSSStyleRule).selectorText === '.intake-drawer') as CSSStyleRule).style
    expect(style.width).toBe('100%')
    expect(style.height).toBe('100%')
    expect(style.minWidth).toBe('0')
    expect(style.padding).toBe('var(--fai-space-grid-gap)')
  })
})

describe('WI H-5 close', () => {
  test('the drawer close button only closes, preserving route, target and draft without agent calls', async () => {
    const { store, writes } = connect()
    store.open('j-collect')
    store.updateDraft({ inputKind: 'text', text: '未提交草稿', purpose: '关闭测试' })
    const wrapper = await mountIntakePages('/jobs/j-collect/collect')
    const route = router.currentRoute.value.fullPath
    const push = vi.spyOn(router, 'push')
    const replace = vi.spyOn(router, 'replace')
    const send = vi.spyOn(agentClient, 'send')
    await wrapper.get('.intake-heading button').trigger('click')
    expect(store.isOpen).toBe(false)
    expect(wrapper.find('.intake-slot').exists()).toBe(false)
    expect(router.currentRoute.value.fullPath).toBe(route)
    expect(push).not.toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
    expect(writes).not.toHaveBeenCalled()
    expect(store.jobId).toBe('j-collect')
    expect(store.draft.text).toBe('未提交草稿')
  })
})

describe('WI page mount', () => {
  test('list entry opens an unassigned snapshot; navigation remounts one drawer without losing the snapshot or draft', async () => {
    const { store } = connect()
    const wrapper = await mountIntakePages('/jobs')
    expect(wrapper.findComponent(IntakeDrawer).exists()).toBe(false)
    await wrapper.get('.intake-toggle').trigger('click')
    expect(store.jobId).toBeNull()
    expect(wrapper.get('.intake-slot > aside').text()).toContain('未指定作业：提交后进入待归属池')
    expect(wrapper.get('.intake-slot').element.nextElementSibling).toBe(wrapper.get('.job-filters').element)
    await wrapper.get('input[value="text"]').setValue(true)
    await wrapper.get('[aria-label="投放文本"]').setValue('跨页未提交正文')
    await wrapper.get('[aria-label="用途"]').setValue('跨页用途')
    await router.push('/jobs/j-collect/collect')
    await flushPromises()
    expect(wrapper.findAll('.intake-slot > aside')).toHaveLength(1)
    expect(wrapper.get('.intake-slot > aside').text()).toContain('未指定作业：提交后进入待归属池')
    expect(store.jobId).toBeNull()
    expect((wrapper.get('[aria-label="投放文本"]').element as HTMLTextAreaElement).value).toBe('跨页未提交正文')
    expect((wrapper.get('[aria-label="用途"]').element as HTMLInputElement).value).toBe('跨页用途')
    await wrapper.get('.intake-heading button').trigger('click')
    await wrapper.getComponent(CollectWorkspace).get('button').trigger('click')
    expect(store.jobId).toBe('j-collect')
    expect(wrapper.get('.intake-slot > aside').text()).toContain('目标作业：j-collect')
    await router.push('/jobs/j-process/process')
    await flushPromises()
    expect(wrapper.findAllComponents(IntakeDrawer)).toHaveLength(1)
    expect(store.jobId).toBe('j-collect')
    expect(store.draft.text).toBe('跨页未提交正文')
  })

  test('collect renders all input kinds in contract order and consumes readonly caches without modifying them', async () => {
    const { client, jobs } = connect()
    await client.submitIntake({ jobId: 'j-collect', inputKind: 'file', fileMeta: { name: '样例.csv', size: 4, type: '', lastModified: 0 }, sourceNote: note })
    await client.submitIntake({ jobId: 'j-collect', inputKind: 'text', text: '不应出现在列表的正文', sourceNote: note })
    const wrapper = await mountIntakePages('/jobs/j-collect/collect')
    const workspace = jobs.currentStageWorkspace!
    if (workspace.stage !== 'collect') throw new Error('Expected real collect workspace')
    const before = JSON.stringify(workspace)
    const collect = wrapper.getComponent(CollectWorkspace)
    expect(collect.props('job')).toBe(jobs.currentJob)
    expect(collect.props('workspace')).toBe(workspace)
    expect(isReadonly(collect.props('workspace'))).toBe(true)
    const rows = collect.get('[aria-label="采集列表"]').findAll('li')
    expect(rows).toHaveLength(workspace.uploads.length)
    for (const [index, upload] of workspace.uploads.entries()) {
      const row = rows[index]!
      const name = upload.inputKind === 'file' ? `文件 · ${upload.fileMeta.name}` : upload.inputKind === 'url' ? `链接 · ${upload.url}` : '文本 · 文本投放（正文未保存）'
      expect(row.text()).toContain(name)
      expect(row.text()).toContain(`用途：${upload.sourceNote.purpose}`)
      expect(row.get('.artifact-status-badge').text()).toContain(UploadStatusLabel[upload.status].text)
      expect(row.get('[aria-hidden="true"]').text()).toBe(UploadStatusLabel[upload.status].icon)
    }
    expect(collect.text()).not.toContain('不应出现在列表的正文')
    expect(JSON.stringify(workspace)).toBe(before)
    expect(collect.findAll('button').filter(button => button.text() === '投放到本作业')).toHaveLength(1)
  })

  test('a newly created job has an empty collect list and a working entry', async () => {
    const { client, store } = connect()
    const receipt = await client.createJob({ title: '空采集', type: 'adhoc', subject: null, goal: '' })
    const wrapper = await mountIntakePages(`/jobs/${receipt.jobs[0]!.id}/collect`)
    const collect = wrapper.getComponent(CollectWorkspace)
    expect(collect.get('[aria-label="采集列表"]').findAll('li')).toHaveLength(0)
    expect(collect.text()).toContain('暂无投放。')
    await collect.get('button').trigger('click')
    expect(store.jobId).toBe(receipt.jobs[0]!.id)
  })

  test.each(['process', 'analyze', 'deliver'] as const)('%s keeps the original placeholder even when a collect cache is supplied', async stage => {
    const { client } = connect()
    const job = (await client.getJob('j-collect'))!
    const workspace = await client.getStageWorkspace(job.id, 'collect')
    const wrapper = mount(StageWorkspace, { props: { stage, job: readonly(job), workspace: readonly(workspace) } })
    expect(wrapper.attributes('aria-label')).toBe(`${StageLabel[stage].text}工作区`)
    expect(wrapper.get('h2').text()).toBe(`${StageLabel[stage].text}工作区`)
    expect(wrapper.text()).toContain('工作区内容由后续任务提供。')
    expect(wrapper.findComponent(CollectWorkspace).exists()).toBe(false)
  })

  test('unmatched collect cache uses only local reading status, not shared Loading', async () => {
    const { client } = connect()
    const job = (await client.getJob('j-collect'))!
    const wrapper = mount(StageWorkspace, { props: { stage: 'collect', job: readonly(job), workspace: null } })
    expect(wrapper.get('[role="status"]').text()).toBe('读取中…')
    expect(wrapper.findComponent(Loading).exists()).toBe(false)
    expect(wrapper.findComponent(CollectWorkspace).exists()).toBe(false)
    await wrapper.setProps({ workspace: readonly(await client.getStageWorkspace(job.id, 'process')) })
    expect(wrapper.get('[role="status"]').text()).toBe('读取中…')
    await wrapper.setProps({ workspace: readonly(await client.getStageWorkspace(job.id, 'collect')) })
    expect(wrapper.findComponent(CollectWorkspace).exists()).toBe(true)
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  test.each(['empty', 'error', 'slow'] as const)('detail drawer stays mounted independently of %s detail state', async scenario => {
    vi.useFakeTimers()
    const { store } = connect(scenario)
    store.open('j-collect')
    const wrapper = await mountIntakePages('/jobs/j-collect/collect')
    expect(wrapper.find('.intake-slot > aside').exists()).toBe(true)
    expect(wrapper.get('.job-detail').element.firstElementChild).toBe(wrapper.get('.intake-slot').element)
    expect(wrapper.get('.intake-slot > aside').text()).toContain('目标作业：j-collect')
    if (scenario === 'slow') {
      expect(wrapper.findComponent(Loading).exists()).toBe(true)
      await vi.runAllTimersAsync()
      await flushPromises()
      expect(wrapper.findComponent(Loading).exists()).toBe(false)
      expect(wrapper.find('.intake-slot > aside').exists()).toBe(true)
    }
  })
})

describe('WI non-modal', () => {
  test('list filtering, creation entry, outside focus and detail stage navigation remain usable while the drawer is open', async () => {
    connect()
    const wrapper = await mountIntakePages('/jobs')
    await wrapper.get('.intake-toggle').trigger('click')
    const title = wrapper.get<HTMLInputElement>('[aria-label="标题"]')
    title.element.focus()
    expect(document.activeElement).toBe(title.element)
    await title.setValue('不存在的标题')
    await flushPromises()
    expect(wrapper.text()).toContain('暂无符合筛选的作业。')
    await wrapper.get('.job-filters button').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.job-card').length).toBeGreaterThan(0)
    await wrapper.get('.job-create-toggle').trigger('click')
    expect(wrapper.find('[aria-label="新建作业"]').exists()).toBe(true)
    expect(wrapper.find('[role="dialog"], [aria-modal], [inert]').exists()).toBe(false)
    await router.push('/jobs/j-collect/collect')
    await flushPromises()
    const stage = wrapper.get('[aria-label="作业阶段"]').findAll('button')[1]!
    ;(stage.element as HTMLButtonElement).focus()
    expect(document.activeElement).toBe(stage.element)
    await stage.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.params.stage).toBe('process')
    expect(wrapper.get('[aria-label="处理工作区"]').text()).toContain('工作区内容由后续任务提供。')
    expect(wrapper.findAll('.intake-slot > aside')).toHaveLength(1)
    expect(wrapper.find('[role="dialog"], [aria-modal], [inert]').exists()).toBe(false)
  })
})
