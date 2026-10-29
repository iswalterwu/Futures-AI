import { z } from 'zod'
import type { DataClient } from '../client.ts'
import {
  clearJobKeys,
  loadJobsSnapshot,
  PersistedJobDataSchema,
  resetPersistenceStatus,
  saveJobsSnapshot,
} from '../../jobs/persistence.ts'
import {
  BootstrapSchema,
  DeliverableFixturesSchema,
  InterventionSchema,
  JobCollectionsSchema,
  JobDetailsSchema,
  UploadFixturesSchema,
  type Bootstrap,
  type Job,
  type Stage,
  type StageWorkspace,
} from '../types.ts'

// Composition of existing boundaries; no additional cross-field domain guards.
const JobStateSchema = PersistedJobDataSchema.extend({
  scenario: BootstrapSchema.shape.scenario,
  emptyJobIds: z.array(z.string()),
})
type JobState = z.infer<typeof JobStateSchema>
type JobSeeds = {
  jobs: z.infer<typeof JobCollectionsSchema>
  'job-detail': z.infer<typeof JobDetailsSchema>
  deliverable: z.infer<typeof DeliverableFixturesSchema>
  interventions: z.infer<typeof InterventionSchema>[]
  uploads: z.infer<typeof UploadFixturesSchema>
}

// All DataClient instances read this current session, rebuilt only by their factory.
let state: JobState
let session: { seeds: JobSeeds; persistent: boolean }

export function initializeJobState(scenario: Bootstrap['scenario'], seeds: JobSeeds, persistent: boolean): void {
  session = { seeds, persistent }
  state = createSeedState(scenario, seeds)
  if (persistent) {
    const snapshot = loadJobsSnapshot()
    if (snapshot !== null) state = { ...state, ...snapshot }
  } else {
    resetPersistenceStatus()
  }
}

export function resetJobState(): void {
  if (session.persistent) clearJobKeys()
  state = createSeedState(state.scenario, session.seeds)
  if (session.persistent) saveJobsSnapshot(state)
  else resetPersistenceStatus()
}

function createSeedState(scenario: Bootstrap['scenario'], seeds: JobSeeds): JobState {
  const collection = scenario === 'job-running' || scenario === 'job-pending-merge'
    || scenario === 'job-conflict' || scenario === 'job-delivered' ? scenario : 'normal'
  const jobs = seeds.jobs[collection]
  return structuredClone({
    scenario,
    mappingHistory: [],
    jobs: scenario === 'empty' ? [] : jobs,
    details: scenario === 'empty' ? {} : seeds['job-detail'],
    deliverables: scenario === 'empty' ? {} : seeds.deliverable,
    interventions: scenario === 'empty' ? [] : seeds.interventions,
    uploads: scenario === 'empty' ? { uploads: [], previews: {} } : seeds.uploads,
    emptyJobIds: scenario === 'empty' ? jobs.map(job => job.id) : [],
  })
}

/** The single transaction entry for subsequent write methods. Never publish a partial copy. */
export function commit(mutator: (working: JobState) => void): void {
  const working = structuredClone(state)
  mutator(working)
  state = JobStateSchema.parse(working)
  if (session.persistent) saveJobsSnapshot(state)
}

export function getJobScenario(): Bootstrap['scenario'] {
  return state.scenario
}

export function listJobs(filter: Parameters<DataClient['listJobs']>[0]): Job[] {
  return structuredClone(state.jobs.filter(job =>
    (filter?.status === undefined || job.status === filter.status)
    && (filter?.type === undefined || job.type === filter.type)
    && (filter?.title === undefined || job.title.includes(filter.title)),
  ).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)))
}

export function getJob(jobId: string): Job | null {
  return structuredClone(findJob(jobId))
}

export function getStageWorkspace(jobId: string, stage: Stage): StageWorkspace {
  findJob(jobId)
  const workspace = stage === 'deliver' ? state.deliverables[jobId] : state.details[jobId]?.[stage]
  return structuredClone(workspace ?? emptyWorkspace(stage))
}

function findJob(jobId: string): Job | null {
  const job = state.jobs.find(job => job.id === jobId)
  if (job) return job
  if (state.emptyJobIds.includes(jobId)) return null
  throw { error: { code: 'not_found', message: `作业 ${jobId} 不存在。`, retryable: false } }
}

function emptyWorkspace(stage: Stage): StageWorkspace {
  switch (stage) {
    case 'collect': return { stage, uploads: [], artifacts: [], revisions: [] }
    case 'process': return { stage, sources: [], series: [], artifacts: [], revisions: [], derivedValues: [] }
    case 'analyze': return { stage, artifacts: [], revisions: [] }
    case 'deliver': return { stage, artifacts: [], revisions: [], deliverable: null, finalSnapshot: null }
  }
}
