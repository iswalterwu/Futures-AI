// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import * as c from '../../../src/contracts/types.ts'

const timestamp = '2026-10-28T12:00:00+08:00'
const job = {
  id: 'j-test', title: '合成研究', type: 'research', subject: null, goal: '', createdBy: 'human',
  status: 'collecting', currentStage: 'collect', updatedAt: timestamp, parentJobId: null, reason: null,
  stages: [
    { stage: 'collect', state: 'running', pendingCount: 0 },
    { stage: 'process', state: 'not_started', pendingCount: 0 },
    { stage: 'analyze', state: 'not_started', pendingCount: 0 },
    { stage: 'deliver', state: 'not_started', pendingCount: 0 },
  ], pendingCount: 0,
}

describe('WI job schema — AC-001-1 / AC-002-1 / AC-002-5 schema 前置', () => {
  test('job and exact list summary fields parse', () => {
    expect(c.JobSchema.parse(job)).toEqual(job)
    const summary = c.JobListItemSchema.parse(job)
    expect(Object.keys(summary)).toEqual(['id', 'title', 'type', 'subject', 'status', 'currentStage', 'updatedAt', 'reason', 'stages', 'pendingCount'])
    expect(c.JobListItemSchema.safeParse(summary).success).toBe(true)
  })
  test.each([
    job.stages.slice(1), [...job.stages].reverse(), [job.stages[0], job.stages[0], ...job.stages.slice(2)], [...job.stages, job.stages[0]],
  ])('rejects missing, reordered or repeated stages %#', stages => {
    for (const schema of [c.JobSchema, c.JobListItemSchema]) expect(schema.safeParse({ ...job, stages }).success).toBe(false)
  })
  test.each(['failed', 'cancelled'])('%s requires a meaningful reason', status => {
    for (const schema of [c.JobSchema, c.JobListItemSchema]) {
      for (const reason of [null, '', '  ', undefined]) expect(schema.safeParse({ ...job, status, reason }).success).toBe(false)
      expect(schema.safeParse({ ...job, status, reason: '合成原因' }).success).toBe(true)
    }
  })
  test('every job field is required and invalid counts/timestamps/states fail', () => {
    for (const key of Object.keys(job)) {
      const input: Record<string, unknown> = { ...job }
      delete input[key]
      expect(c.JobSchema.safeParse(input).success, key).toBe(false)
    }
    for (const patch of [{ pendingCount: -1 }, { pendingCount: 1.5 }, { updatedAt: '2026-10-28' }, { status: 'verifying' }, { createdBy: 'agent' }]) expect(c.JobSchema.safeParse({ ...job, ...patch }).success).toBe(false)
  })
  test('context and inbox accept nullable anchors, not missing fields or unknown enums', () => {
    expect(c.JobContextSchema.parse({ jobId: 'j-test', stage: 'analyze' })).toEqual({ jobId: 'j-test', stage: 'analyze' })
    expect(c.JobContextSchema.safeParse({ jobId: 'j-test', stage: 'other' }).success).toBe(false)
    const inbox = { id: 'i1', jobId: 'j-test', stage: 'process', artifactId: null, revisionId: null, interventionId: null, reason: 'needs_human', createdAt: timestamp, read: false, resolved: false }
    expect(c.InboxItemSchema.parse(inbox)).toEqual(inbox)
    expect(c.InboxItemSchema.safeParse({ ...inbox, artifactId: undefined }).success).toBe(false)
    expect(c.InboxItemSchema.safeParse({ ...inbox, reason: 'done' }).success).toBe(false)
  })
})

const artifact = { id: 'a1', kind: 'dataset', status: 'draft', source: 'human', origin: 'derived', latestMergedRev: 'r1', overlayRev: null, pendingMerge: false, pendingRunId: null }
const revisionBase = { id: 'r1', artifactId: 'a1', number: 1, baseRev: null, author: 'human', createdAt: timestamp, summary: '初版', changeSummary: '' }
const revisions = [
  { ...revisionBase, artifactKind: 'dataset', uploads: [{ uploadId: 'u1', mapping: [], status: 'ingested' }] },
  { ...revisionBase, artifactKind: 'recipe', params: { unit: 't', timezone: 'UTC', calendar: 'natural', resample: '1d', aggregation: 'sum' }, steps: [{ id: 's1', label: '归一化', input: 'raw', output: 'normalized' }] },
  { ...revisionBase, artifactKind: 'analysis', conclusions: [{ id: 'c1', text: '保留的结论', status: 'draft', source: 'agent', origin: 'derived', evidence: [], deleted: true }] },
  { ...revisionBase, artifactKind: 'deliverable', blocks: [{ id: 'b1', type: 'note', text: '备注', status: 'confirmed', source: 'human', origin: 'derived', anchors: [], comments: [] }] },
]

describe('WI revision — AC-004-2 / AC-006-4 S-12 schema 前置', () => {
  test.each(revisions)('parses $artifactKind complete snapshot', revision => { expect(c.RevisionSchema.parse(revision)).toEqual(revision) })
  test('rejects branch/content mismatches and extraneous other-branch content', () => {
    for (const revision of revisions) {
      for (const artifactKind of ['dataset', 'recipe', 'analysis', 'deliverable'].filter(kind => kind !== revision.artifactKind)) expect(c.RevisionSchema.safeParse({ ...revision, artifactKind }).success).toBe(false)
    }
    expect(c.RevisionSchema.safeParse({ ...revisions[1], blocks: [] }).success).toBe(false)
  })
  test('requires every shared field and a positive integral revision number', () => {
    for (const key of Object.keys(revisionBase)) expect(c.RevisionSchema.safeParse({ ...revisions[0], [key]: undefined }).success, key).toBe(false)
    for (const number of [0, -1, 1.5]) expect(c.RevisionSchema.safeParse({ ...revisions[0], number }).success).toBe(false)
  })
})

describe('WI artifact — AC-004-2 / AC-007-2 schema 前置', () => {
  test('requires overlay when pending, but permits a manual checkpoint without run', () => {
    expect(c.ArtifactSchema.parse(artifact)).toEqual(artifact)
    expect(c.ArtifactSchema.safeParse({ ...artifact, pendingMerge: true }).success).toBe(false)
    expect(c.ArtifactSchema.safeParse({ ...artifact, pendingMerge: true, overlayRev: 'r2' }).success).toBe(true)
    expect(c.ArtifactSchema.safeParse({ ...artifact, pendingMerge: true, overlayRev: 'r2', pendingRunId: 'run1' }).success).toBe(true)
    expect(c.ArtifactSchema.safeParse({ ...artifact, overlayRev: '' }).success).toBe(false)
  })
})

describe('WI workspace — AC-001-4 / AC-004-5 / AC-005-6 schema 前置', () => {
  const workspaces = [
    { stage: 'collect', uploads: [], artifacts: [artifact], revisions: [revisions[0]] },
    { stage: 'process', sources: [], series: [], artifacts: [{ ...artifact, kind: 'recipe' }], revisions: [revisions[1]], derivedValues: [] },
    { stage: 'analyze', artifacts: [{ ...artifact, kind: 'analysis' }], revisions: [revisions[2]] },
    { stage: 'deliver', artifacts: [{ ...artifact, kind: 'deliverable' }], revisions: [revisions[3]], deliverable: { id: 'a1', jobId: 'j1', blocks: [], deliverableStatus: 'draft', finalSnapshotId: null, finalRevisionNumber: null, finalizedAt: null }, finalSnapshot: null },
  ]
  test.each(workspaces)('accepts $stage and its empty workspace', workspace => {
    expect(c.StageWorkspaceSchema.parse(workspace)).toEqual(workspace)
    const empty = { ...workspace, artifacts: [], revisions: [], ...(workspace.stage === 'deliver' ? { deliverable: null } : {}) }
    expect(c.StageWorkspaceSchema.safeParse(empty).success).toBe(true)
  })
  test('rejects wrong stage, wrong artifact and wrong revision kinds', () => {
    for (const workspace of workspaces) {
      for (const stage of ['collect', 'process', 'analyze', 'deliver'].filter(stage => stage !== workspace.stage)) expect(c.StageWorkspaceSchema.safeParse({ ...workspace, stage }).success).toBe(false)
    }
    expect(c.StageWorkspaceSchema.safeParse({ ...workspaces[1], artifacts: [artifact] }).success).toBe(false)
    expect(c.StageWorkspaceSchema.safeParse({ ...workspaces[1], revisions: [revisions[0]] }).success).toBe(false)
    expect(c.StageWorkspaceSchema.safeParse({ ...workspaces[0], artifacts: [{ ...artifact, pendingMerge: true }] }).success).toBe(false)
  })
  test('deliver union preserves S-18 boundary refinement', () => {
    const snapshot = { id: 'f1', jobId: 'j1', revisionId: 'r1', revisionNumber: 1, finalizedAt: timestamp, blocks: [] }
    const deliverable = { id: 'a1', jobId: 'j1', blocks: [], deliverableStatus: 'final', finalSnapshotId: 'f1', finalRevisionNumber: 1, finalizedAt: timestamp }
    expect(c.StageWorkspaceSchema.safeParse({ ...workspaces[3], deliverable, finalSnapshot: snapshot }).success).toBe(true)
    for (const patch of [{ id: 'wrong' }, { revisionNumber: 2 }, { finalizedAt: '2026-10-29T00:00:00Z' }]) expect(c.StageWorkspaceSchema.safeParse({ ...workspaces[3], deliverable, finalSnapshot: { ...snapshot, ...patch } }).success).toBe(false)
    expect(c.StageWorkspaceSchema.safeParse({ ...workspaces[3], finalSnapshot: snapshot }).success).toBe(false)
  })
  test('write receipt carries changed entities and full inbox counts', () => {
    const receipt = { jobs: [job], artifacts: [artifact], revisions, inbox: { unread: 0, byStage: { collect: 0, process: 0, analyze: 0, deliver: 0 } } }
    expect(c.WriteReceiptSchema.parse(receipt)).toEqual(receipt)
    expect(c.WriteReceiptSchema.safeParse({ ...receipt, inbox: { unread: 0, byStage: { collect: 0 } } }).success).toBe(false)
  })
})

test('WI naming — AC-007-1 / AC-008-1 camelCase and getJob null semantics are generated', () => {
  const document = readFileSync(new URL('../../../contracts/CONTRACT.md', import.meta.url), 'utf8')
  for (const mapping of ['job_id→jobId', 'artifact_id→artifactId', 'base_rev→baseRev', 'created_at→createdAt']) expect(document).toContain(mapping)
  expect(document).toContain('仅在 empty 场景查询预置 fixture id 时返回 null')
  expect(document).toContain('任何场景的未知 id 返回 not_found')
})
