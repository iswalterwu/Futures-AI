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
  type CreateJobInput,
  type ExtractionPreview,
  type FieldMapping,
  type IntakeInput,
  type IntakeReceipt,
  type Intervention,
  type Upload,
  type WriteReceipt,
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
export function commit<T>(mutator: (working: JobState) => T): T {
  const working = structuredClone(state)
  const result = mutator(working)
  const validated = JobStateSchema.parse(working)
  if (state.scenario === 'error') {
    throw { error: { code: 'adapter_error', message: '样例作业数据暂不可用，请重试。', retryable: true } }
  }
  state = validated
  if (session.persistent) saveJobsSnapshot(state)
  return structuredClone(result)
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

export function createJob(input: CreateJobInput): WriteReceipt {
  return commit(working => {
    const now = new Date().toISOString()
    const id = `j-${crypto.randomUUID()}`
    const job: Job = {
      ...input, id, createdBy: 'human', parentJobId: null, reason: null,
      status: 'collecting', currentStage: 'collect', updatedAt: now, pendingCount: 0,
      stages: [
        { stage: 'collect', state: 'running', pendingCount: 0 },
        { stage: 'process', state: 'not_started', pendingCount: 0 },
        { stage: 'analyze', state: 'not_started', pendingCount: 0 },
        { stage: 'deliver', state: 'not_started', pendingCount: 0 },
      ],
    }
    const artifactId = `${id}-deliverable`
    const artifact = {
      id: artifactId, kind: 'deliverable' as const, status: 'draft' as const,
      source: 'human' as const, origin: 'derived' as const,
      latestMergedRev: `${artifactId}-r1`, overlayRev: null, pendingMerge: false, pendingRunId: null,
    }
    const revision = {
      id: artifact.latestMergedRev, artifactId, artifactKind: 'deliverable' as const,
      number: 1, baseRev: null, author: 'human' as const, createdAt: now,
      summary: '新建空草稿', changeSummary: '建立交付物首版', blocks: [],
    }
    working.jobs.push(job)
    working.deliverables[id] = {
      stage: 'deliver', artifacts: [artifact], revisions: [revision], finalSnapshot: null,
      deliverable: { id: artifactId, jobId: id, blocks: [], deliverableStatus: 'draft', finalSnapshotId: null, finalRevisionNumber: null, finalizedAt: null },
    }
    return { ...emptyReceipt(), jobs: [job], artifacts: [artifact], revisions: [revision] }
  })
}

export function submitIntake(input: IntakeInput): IntakeReceipt {
  return commit(working => {
    const job = input.jobId === null ? null : writableJob(working, input.jobId)
    const now = new Date().toISOString()
    const preview: ExtractionPreview = {
      detectedType: {
        file: '合成文件预览（未解析正文）', url: '合成链接预览（未抓取）', text: '合成文本预览（正文不保存）',
      }[input.inputKind],
      fields: [{ sourceField: '合成列 1', targetField: '待映射', unit: '待确认' }],
      unit: null, timeRange: null,
    }
    const metadata = {
      id: `u-${crypto.randomUUID()}`, jobId: input.jobId, sourceNote: input.sourceNote,
      status: 'pending_validation' as const, mapping: structuredClone(preview.fields), createdAt: now, removed: false,
    }
    const upload: Upload = input.inputKind === 'file' ? { ...metadata, inputKind: 'file', fileMeta: input.fileMeta }
      : input.inputKind === 'url' ? { ...metadata, inputKind: 'url', url: input.url }
        : { ...metadata, inputKind: 'text' }
    const target = job ? jobDetail(working, job.id) : null
    if (target) {
      target.collect.uploads.push(upload)
      target.previews[upload.id] = preview
    } else {
      working.uploads.uploads.push(upload)
      working.uploads.previews[upload.id] = preview
    }
    const receipt = job ? appendDatasetRevision(working, job, now, {
      action: 'ingest', uploadId: upload.id, sourceNote: upload.sourceNote,
    }) : emptyReceipt()
    return { ...receipt, upload, preview }
  })
}

export function getIntakePreview(uploadId: string): ExtractionPreview {
  const { previews } = findUpload(state, uploadId)
  const preview = previews[uploadId]
  if (!preview) throw { error: { code: 'not_found', message: `投放 ${uploadId} 的预览不存在。`, retryable: false } }
  return structuredClone(preview)
}

export function confirmIntake(uploadId: string, mapping: FieldMapping): IntakeReceipt {
  return commit(working => {
    const { upload, previews } = findUpload(working, uploadId)
    const job = upload.jobId === null ? null : writableJob(working, upload.jobId)
    if (upload.removed || upload.status !== 'pending_validation') {
      throw { error: { code: 'validation_error', message: '只能确认未删除的待验证投放。', retryable: false } }
    }
    const now = new Date().toISOString()
    working.mappingHistory.push({ uploadId, mapping: structuredClone(upload.mapping), status: upload.status, replacedAt: now })
    upload.mapping = mapping
    upload.status = upload.quarantineReason === undefined ? 'ingested' : 'quarantined'
    const receipt = job ? appendDatasetRevision(working, job, now, { action: 'map_fix', uploadId, mapping }) : emptyReceipt()
    return { ...receipt, upload, preview: previews[uploadId] }
  })
}

function writableJob(working: JobState, jobId: string): Job {
  const job = working.jobs.find(job => job.id === jobId)
  if (!job) throw { error: { code: 'not_found', message: `作业 ${jobId} 不存在。`, retryable: false } }
  if (job.status === 'delivered' || job.status === 'cancelled') {
    throw { error: { code: 'validation_error', message: '已定稿或取消的作业只读。', retryable: false } }
  }
  return job
}

function findUpload(working: JobState, uploadId: string) {
  const pooled = working.uploads.uploads.find(upload => upload.id === uploadId)
  if (pooled) return { upload: pooled, previews: working.uploads.previews }
  for (const job of working.jobs) {
    const detail = working.details[job.id]
    const upload = detail?.collect.uploads.find(upload => upload.id === uploadId)
    if (upload) return { upload, previews: detail.previews }
  }
  throw { error: { code: 'not_found', message: `投放 ${uploadId} 不存在。`, retryable: false } }
}

function jobDetail(working: JobState, jobId: string) {
  return working.details[jobId] ??= {
    collect: { stage: 'collect', uploads: [], artifacts: [], revisions: [] },
    process: { stage: 'process', sources: [], series: [], artifacts: [], revisions: [], derivedValues: [] },
    analyze: { stage: 'analyze', artifacts: [], revisions: [] },
    previews: {}, reconciliations: [],
  }
}

function emptyReceipt(): WriteReceipt {
  // No inbox entries exist before T-A21; these are actual counts, not inferred badges.
  return { jobs: [], artifacts: [], revisions: [], interventions: [], inbox: { unread: 0, byStage: { collect: 0, process: 0, analyze: 0, deliver: 0 } } }
}

type DatasetAction = Extract<Intervention['payload'], { action: 'ingest' | 'map_fix' | 'remove_source' }>
function appendDatasetRevision(working: JobState, job: Job, now: string, payload: DatasetAction): WriteReceipt {
  const collect = jobDetail(working, job.id).collect
  let artifact = collect.artifacts[0]
  const baseRev = artifact?.latestMergedRev ?? null
  const artifactId = artifact?.id ?? `${job.id}-dataset`
  const number = collect.revisions.filter(revision => revision.artifactId === artifactId).length + 1
  const revision = {
    id: `${artifactId}-r${number}`, artifactId, artifactKind: 'dataset' as const, number, baseRev,
    author: 'human' as const, createdAt: now, summary: '更新投放记录', changeSummary: payload.action,
    uploads: collect.uploads.filter(upload => !upload.removed).map(upload => ({
      uploadId: upload.id, mapping: structuredClone(upload.mapping), status: upload.status,
    })),
  }
  if (!artifact) {
    artifact = {
      id: artifactId, kind: 'dataset', status: 'draft', source: 'external', origin: 'source',
      latestMergedRev: revision.id, overlayRev: null, pendingMerge: false, pendingRunId: null,
    }
    collect.artifacts.push(artifact)
  }
  artifact.latestMergedRev = revision.id
  collect.revisions.push(revision)
  job.updatedAt = now
  const event: Intervention = {
    id: `i-${crypto.randomUUID()}`, jobId: job.id, stage: 'collect', artifactId, baseRev,
    kind: payload.action === 'remove_source' ? 'delete' : payload.action, payload,
    reason: payload.action === 'remove_source' ? payload.reason : null, outcome: 'recorded', createdAt: now,
  }
  working.interventions.push(event)
  return { ...emptyReceipt(), jobs: [job], artifacts: [artifact], revisions: [revision], interventions: [event] }
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
