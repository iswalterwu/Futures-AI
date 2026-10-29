import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'
import { dataClient } from '../../contracts/index.ts'
import type { IntakeFileMeta, IntakeInput, IntakeReceipt, SourceNote } from '../../contracts/types.ts'
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

export const useIntakeStore = defineStore('intake', () => {
  const isOpen = ref(false)
  const jobId = ref<string | null>(null)
  const draft = ref<IntakeDraft>(emptyDraft())

  function open(targetJobId?: string): void {
    jobId.value = targetJobId ?? null
    isOpen.value = true
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
    await useJobsStore().refresh()
    return receipt
  }

  return {
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
