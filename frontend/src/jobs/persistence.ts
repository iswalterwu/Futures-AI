import { z } from 'zod'
import {
  DeliverableFixturesSchema,
  FieldMappingSchema,
  InterventionSchema,
  JobDetailsSchema,
  JobSchema,
  TimestampSchema,
  UploadFixturesSchema,
  UploadStatusSchema,
} from '../contracts/types.ts'

export const JOBS_KEY = 'fai.jobs.v1'
export const INBOX_KEY = 'fai.inbox.v1'

// Business data only. Runtime scenario, empty anchors and run controls are not snapshots.
export const PersistedJobDataSchema = z.strictObject({
  jobs: z.array(JobSchema),
  details: JobDetailsSchema,
  deliverables: DeliverableFixturesSchema,
  interventions: z.array(InterventionSchema),
  uploads: UploadFixturesSchema,
  mappingHistory: z.array(z.strictObject({
    uploadId: z.string().min(1),
    mapping: FieldMappingSchema,
    status: UploadStatusSchema,
    replacedAt: TimestampSchema,
  })).default([]),
})
export type PersistedJobData = z.infer<typeof PersistedJobDataSchema>
const SnapshotSchema = z.strictObject({ version: z.literal(1), data: PersistedJobDataSchema })
type PersistenceStatus = 'ok' | 'degraded' | 'unreadable'
let status: PersistenceStatus = 'ok'
const listeners = new Set<(status: PersistenceStatus) => void>()

export function getPersistenceStatus(): PersistenceStatus {
  return status
}

export function onPersistenceStatus(cb: (status: PersistenceStatus) => void): () => void {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

export function resetPersistenceStatus(): void {
  setStatus('ok')
}

export function loadJobsSnapshot(): PersistedJobData | null {
  resetPersistenceStatus()
  try {
    const raw = localStorage.getItem(JOBS_KEY)
    return raw === null ? null : SnapshotSchema.parse(JSON.parse(raw)).data
  } catch {
    setStatus('unreadable')
    return null
  }
}

export function saveJobsSnapshot(data: PersistedJobData): void {
  if (status === 'unreadable') return // Preserve the original until an explicit reset.
  // Project known, already-validated business fields; never serialize the whole state.
  const { jobs, details, deliverables, interventions, uploads, mappingHistory } = data
  const snapshot = JSON.stringify({ version: 1, data: { jobs, details, deliverables, interventions, uploads, mappingHistory } })
  if (new TextEncoder().encode(snapshot).byteLength > 512 * 1024) {
    setStatus('degraded')
    return
  }
  try {
    localStorage.setItem(JOBS_KEY, snapshot)
  } catch {
    setStatus('degraded')
    return
  }
  setStatus('ok')
}

export function clearJobKeys(): void {
  localStorage.removeItem(JOBS_KEY)
  localStorage.removeItem(INBOX_KEY)
  resetPersistenceStatus()
}

function setStatus(next: PersistenceStatus): void {
  if (status === next) return
  status = next
  for (const listener of listeners) listener(status)
}
