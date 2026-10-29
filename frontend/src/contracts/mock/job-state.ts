import { z } from 'zod'
import type { DataClient } from '../client.ts'
import {
  BootstrapSchema,
  DeliverableFixturesSchema,
  InterventionSchema,
  JobCollectionsSchema,
  JobDetailsSchema,
  JobSchema,
  UploadFixturesSchema,
  type Bootstrap,
  type Job,
  type Stage,
  type StageWorkspace,
} from '../types.ts'

// Composition of existing boundaries; no additional cross-field domain guards.
const JobStateSchema = z.strictObject({
  scenario: BootstrapSchema.shape.scenario,
  jobs: z.array(JobSchema),
  details: JobDetailsSchema,
  deliverables: DeliverableFixturesSchema,
  interventions: z.array(InterventionSchema),
  uploads: UploadFixturesSchema,
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

export function initializeJobState(scenario: Bootstrap['scenario'], seeds: JobSeeds): void {
  const collection = scenario === 'job-running' || scenario === 'job-pending-merge'
    || scenario === 'job-conflict' || scenario === 'job-delivered' ? scenario : 'normal'
  const jobs = seeds.jobs[collection]
  state = structuredClone({
    scenario,
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
