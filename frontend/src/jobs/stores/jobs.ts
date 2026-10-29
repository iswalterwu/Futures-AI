import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'
import { isTerminalEvent, type AgentEvent } from '../../agent/events.ts'
import type { DataClient } from '../../contracts/client.ts'
import { dataClient } from '../../contracts/index.ts'
import type { ContractError, CreateJobInput, ErrorResponse, Job, JobListItem } from '../../contracts/types.ts'

export type ListJobsFilter = NonNullable<Parameters<DataClient['listJobs']>[0]>

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<JobListItem[]>([])
  const listStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const listError = ref<ContractError | null>(null)
  const filter = ref<ListJobsFilter | null>(null)
  const filteredJobs = ref<JobListItem[] | null>(null)

  async function ensureJobs(): Promise<void> {
    if (listStatus.value === 'idle') await refresh()
  }

  async function refresh(): Promise<void> {
    if (listStatus.value !== 'ready' && jobs.value.length === 0) listStatus.value = 'loading'
    try {
      jobs.value = await dataClient.listJobs()
      if (filter.value !== null) filteredJobs.value = await dataClient.listJobs(filter.value)
      listStatus.value = 'ready'
      listError.value = null
    } catch (cause) {
      // Subscription callbacks can fire-and-forget: read failures live in the view state.
      listError.value = (cause as ErrorResponse).error
      listStatus.value = 'error'
    }
  }

  async function applyFilter(value: ListJobsFilter | null): Promise<void> {
    filter.value = value
    if (value === null) {
      filteredJobs.value = null
      return
    }
    try {
      filteredJobs.value = await dataClient.listJobs(value)
      listStatus.value = 'ready'
      listError.value = null
    } catch (cause) {
      listError.value = (cause as ErrorResponse).error
      listStatus.value = 'error'
    }
  }

  async function createJob(input: CreateJobInput): Promise<Job> {
    const receipt = await dataClient.createJob(input)
    await refresh()
    return receipt.jobs[0]!
  }

  function receiveAgentEvent(event: AgentEvent): void {
    if (event.jobContext && isTerminalEvent(event)) void refresh()
  }

  return {
    jobs: computed(() => readonly(jobs.value)),
    listStatus: computed(() => listStatus.value),
    listError: computed(() => listError.value === null ? null : readonly(listError.value)),
    filter: computed(() => filter.value === null ? null : readonly(filter.value)),
    filteredJobs: computed(() => filteredJobs.value === null ? null : readonly(filteredJobs.value)),
    ensureJobs,
    refresh,
    applyFilter,
    createJob,
    receiveAgentEvent,
  }
})
