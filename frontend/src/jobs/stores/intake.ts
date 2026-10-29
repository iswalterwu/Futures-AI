import { defineStore } from 'pinia'
import { computed, readonly, ref, toRaw, type DeepReadonly } from 'vue'
import { dataClient } from '../../contracts/index.ts'
import type { ContractError, ErrorResponse, ExtractionPreview, FieldMapping, IntakeFileMeta, IntakeInput, IntakeReceipt, SourceNote, Upload, WriteReceipt } from '../../contracts/types.ts'
import { useJobsStore } from './jobs.ts'

export type IntakeDraft = {
  inputKind: IntakeInput['inputKind']
  fileMeta: IntakeFileMeta | null
  url: string
  text: string
  purpose: string
  reliability: SourceNote['reliability']
  publishedAt: string
  validUntil: string
  scopeNote: string
}
export type IntakeSubmission = {
  [K in IntakeInput['inputKind']]: Omit<Extract<IntakeInput, { inputKind: K }>, 'jobId'>
}[IntakeInput['inputKind']]

export type IntakeSelection = { upload: Upload; preview: ExtractionPreview; mapping: FieldMapping }

export const useIntakeStore = defineStore('intake', () => {
  const isOpen = ref(false)
  const jobId = ref<string | null>(null)
  const draft = ref<IntakeDraft>(emptyDraft())
  const selection = ref<IntakeSelection | null>(null)
  const previewTarget = ref<Upload | null>(null)
  const previewStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const previewError = ref<ContractError | null>(null)
  const pool = ref<Upload[]>([])
  const poolStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const poolError = ref<ContractError | null>(null)

  function open(targetJobId?: string): void {
    jobId.value = targetJobId ?? null
    isOpen.value = true
    selection.value = null
    previewTarget.value = null
    previewStatus.value = 'idle'
    previewError.value = null
  }

  function close(): void {
    isOpen.value = false
  }

  function updateDraft(patch: Partial<IntakeDraft>): void {
    Object.assign(draft.value, patch)
  }

  function resetDraft(): void {
    draft.value = emptyDraft()
  }

  async function submit(submission: IntakeSubmission): Promise<IntakeReceipt> {
    const receipt = await dataClient.submitIntake({ ...submission, jobId: jobId.value })
    resetDraft()
    selectReceipt(receipt)
    await refreshViews()
    return receipt
  }

  async function selectUpload(upload: DeepReadonly<Upload>): Promise<void> {
    const copy = structuredClone(toRaw(upload)) as Upload
    previewTarget.value = copy
    previewStatus.value = 'loading'
    try {
      const preview = await dataClient.getIntakePreview(upload.id)
      selection.value = { upload: copy, preview, mapping: structuredClone(copy.mapping) }
      previewStatus.value = 'ready'
      previewError.value = null
    } catch (cause) {
      previewError.value = (cause as ErrorResponse).error
      previewStatus.value = 'error'
    }
  }

  function editMapping(index: number, patch: Partial<Pick<FieldMapping[number], 'targetField' | 'unit'>>): void {
    Object.assign(selection.value!.mapping[index]!, patch)
  }

  async function confirm(mapping: FieldMapping): Promise<IntakeReceipt> {
    const receipt = await dataClient.confirmIntake(selection.value!.upload.id, mapping)
    selectReceipt(receipt)
    await refreshViews()
    return receipt
  }

  function selectReceipt(receipt: IntakeReceipt): void {
    previewTarget.value = structuredClone(receipt.upload)
    selection.value = { upload: receipt.upload, preview: receipt.preview, mapping: structuredClone(receipt.upload.mapping) }
    previewStatus.value = 'ready'
    previewError.value = null
  }

  async function loadPool(): Promise<void> {
    poolStatus.value = 'loading'
    try {
      pool.value = await dataClient.listUnassignedUploads()
      poolStatus.value = 'ready'
      poolError.value = null
    } catch (cause) {
      poolError.value = (cause as ErrorResponse).error
      poolStatus.value = 'error'
    }
  }

  async function assign(uploadId: string, targetJobId: string): Promise<WriteReceipt> {
    const receipt = await dataClient.assignUpload(uploadId, targetJobId)
    clearPreview(uploadId)
    await refreshViews()
    return receipt
  }

  async function remove(uploadId: string, reason: string): Promise<WriteReceipt> {
    const receipt = await dataClient.removeUpload(uploadId, reason)
    clearPreview(uploadId)
    await refreshViews()
    return receipt
  }

  function clearPreview(uploadId: string): void {
    if (selection.value?.upload.id === uploadId || previewTarget.value?.id === uploadId) {
      selection.value = null
      previewTarget.value = null
      previewStatus.value = 'idle'
      previewError.value = null
    }
  }

  async function refreshViews(): Promise<void> {
    await useJobsStore().refresh()
    if (poolStatus.value !== 'idle') await loadPool()
  }

  return {
    pool: computed(() => readonly(pool.value)),
    poolStatus: computed(() => poolStatus.value),
    poolError: computed(() => poolError.value === null ? null : readonly(poolError.value)),
    loadPool,
    assign,
    remove,
    selection: computed(() => selection.value === null ? null : readonly(selection.value)),
    previewTarget: computed(() => previewTarget.value === null ? null : readonly(previewTarget.value)),
    previewStatus: computed(() => previewStatus.value),
    previewError: computed(() => previewError.value === null ? null : readonly(previewError.value)),
    selectUpload,
    editMapping,
    confirm,
    isOpen: computed(() => isOpen.value),
    jobId: computed(() => jobId.value),
    draft: computed(() => readonly(draft.value)),
    open,
    close,
    updateDraft,
    resetDraft,
    submit,
  }
})

function emptyDraft(): IntakeDraft {
  return {
    inputKind: 'file', fileMeta: null, url: '', text: '', purpose: '', reliability: 'unknown',
    publishedAt: '', validUntil: '', scopeNote: '',
  }
}
