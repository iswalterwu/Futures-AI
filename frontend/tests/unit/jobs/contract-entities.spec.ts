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
    const receipt = { jobs: [job], artifacts: [artifact], revisions, interventions: [], inbox: { unread: 0, byStage: { collect: 0, process: 0, analyze: 0, deliver: 0 } } }
    expect(c.WriteReceiptSchema.parse(receipt)).toEqual(receipt)
    expect(c.WriteReceiptSchema.safeParse({ ...receipt, inbox: { unread: 0, byStage: { collect: 0 } } }).success).toBe(false)
  })
})

// 手写的动作矩阵验收输入；不导入实现映射来计算期望 kind。
const interventionExamples = [
  { kind: 'ingest', payload: { action: 'ingest', uploadId: 'u1', sourceNote: { purpose: '合成用途', reliability: 'high', publishedAt: null, validUntil: null, scopeNote: null } } },
  { kind: 'map_fix', payload: { action: 'map_fix', uploadId: 'u1', mapping: [] } },
  { kind: 'recipe', payload: { action: 'recipe', artifactId: 'a1', changes: { unit: 'kt' } } },
  { kind: 'framework', payload: { action: 'annotate', conclusionId: 'c1', note: '批注' } },
  { kind: 'ask_why', payload: { action: 'ask_why', conclusionId: 'c1', question: '依据？' } },
  { kind: 'question', payload: { action: 'what_if', conclusionId: 'c1', question: '如果？' } },
  { kind: 'rewrite', payload: { action: 'deepen', conclusionId: 'c1', instruction: '深挖' } },
  { kind: 'delete', payload: { action: 'delete_conclusion', conclusionId: 'c1', reason: '删除理由' } },
  { kind: 'veto', payload: { action: 'veto', conclusionId: 'c1', reason: '否决理由' } },
  { kind: 'pin_rule', payload: { action: 'pin_rule', ruleText: '合成规则', state: 'candidate' } },
  { kind: 'delete', payload: { action: 'remove_source', uploadId: 'u1', reason: '删除理由' } },
  { kind: 'delete', payload: { action: 'cancel_job', reason: '取消理由' } },
  { kind: 'rewrite', payload: { action: 'edit_block', blockId: 'b1', text: '新正文' } },
  { kind: 'rewrite', payload: { action: 'revise_blocks', blockIds: ['b1'], instruction: '改稿' } },
  { kind: 'framework', payload: { action: 'block_comment', blockId: 'b1', text: '批注' } },
  { kind: 'framework', payload: { action: 'reply_comment', threadId: 't1', text: '回复' } },
  { kind: 'framework', payload: { action: 'resolve_comment', threadId: 't1' } },
  { kind: 'approve', payload: { action: 'mark_provisional', artifactId: 'a1' } },
  { kind: 'rerun', payload: { action: 'rerun', stage: 'analyze', affectedStages: ['analyze', 'deliver'] } },
  { kind: 'approve', payload: { action: 'accept', revisionId: 'r2' } },
  { kind: 'rewrite', payload: { action: 'revert', revisionId: 'r2' } },
  { kind: 'approve', payload: { action: 'resolve_conflict', blockId: 'b1', humanRevId: 'r2', agentRevId: 'r3', choice: 'human' } },
  { kind: 'finalize', payload: { action: 'finalize', revisionId: 'r2', snapshotId: 'f1' } },
]
const eventBase = { id: 'i1', jobId: 'j1', stage: 'analyze', artifactId: null, baseRev: null, reason: null, outcome: 'recorded', createdAt: timestamp }

describe('WI intervention kinds — AC-005-3 / AC-007-1 schema 前置', () => {
  test.each(interventionExamples)('$payload.action accepts only $kind', example => {
    const event = { ...eventBase, ...example }
    expect(c.InterventionSchema.parse(event)).toEqual(event)
    expect(c.InterventionPayloadSchema.parse(example.payload)).toEqual(example.payload)
    for (const kind of c.InterventionKindSchema.options.filter(kind => kind !== example.kind)) expect(c.InterventionSchema.safeParse({ ...event, kind }).success, kind).toBe(false)
  })
  test('all 23 actions have examples and cover all 13 kinds', () => {
    expect(interventionExamples).toHaveLength(23)
    expect(new Set(interventionExamples.map(example => example.kind))).toEqual(new Set(c.InterventionKindSchema.options))
    expect(interventionExamples.map(example => example.payload.action)).toEqual(c.InterventionPayloadSchema.options.map(schema => schema.shape.action.value))
  })
})

test('WI pin_rule candidate — AC-005-4 rejects omitted or non-candidate state', () => {
  const event = { ...eventBase, kind: 'pin_rule', payload: { action: 'pin_rule', ruleText: '合成规则', state: 'candidate' } }
  expect(c.InterventionSchema.safeParse(event).success).toBe(true)
  for (const state of [undefined, null, 'active', 'proposed', '']) expect(c.InterventionSchema.safeParse({ ...event, payload: { ...event.payload, state } }).success).toBe(false)
})

describe('WI intervention fields — AC-007-1 / AC-008-1 schema 前置', () => {
  test('exactly ten mandatory fields, with nullable job-level anchors', () => {
    const event = { ...eventBase, ...interventionExamples[11] }
    const parsed = c.InterventionSchema.parse(event)
    expect(Object.keys(parsed)).toEqual(['id', 'jobId', 'stage', 'artifactId', 'baseRev', 'kind', 'payload', 'reason', 'outcome', 'createdAt'])
    for (const key of Object.keys(parsed)) expect(c.InterventionSchema.safeParse({ ...event, [key]: undefined }).success, key).toBe(false)
    expect(c.InterventionSchema.safeParse({ ...event, basis: 'private' }).success).toBe(false)
  })
  test('each action requires its declared fields and rejects unstructured JSON', () => {
    for (const { kind, payload } of interventionExamples) {
      for (const key of Object.keys(payload)) expect(c.InterventionSchema.safeParse({ ...eventBase, kind, payload: { ...payload, [key]: undefined } }).success, `${payload.action}.${key}`).toBe(false)
      expect(c.InterventionPayloadSchema.safeParse({ ...payload, arbitrary: {} }).success).toBe(false)
    }
    for (const payload of [null, [], {}, { action: 'unfinalize' }, { action: 'annotate', data: { anything: true } }]) expect(c.InterventionPayloadSchema.safeParse(payload).success).toBe(false)
  })
  test('write receipt requires interventions and checks their actual action-kind matrix', () => {
    const event = { ...eventBase, ...interventionExamples[3] }
    const receipt = { jobs: [], artifacts: [], revisions: [], interventions: [event], inbox: { unread: 0, byStage: { collect: 0, process: 0, analyze: 0, deliver: 0 } } }
    expect(c.WriteReceiptSchema.parse(receipt)).toEqual(receipt)
    expect(c.WriteReceiptSchema.safeParse({ ...receipt, interventions: undefined }).success).toBe(false)
    expect(c.WriteReceiptSchema.safeParse({ ...receipt, interventions: [{ ...event, kind: 'veto' }] }).success).toBe(false)
  })
})

test('WI naming — AC-007-1 / AC-008-1 camelCase and getJob null semantics are generated', () => {
  const document = readFileSync(new URL('../../../contracts/CONTRACT.md', import.meta.url), 'utf8')
  for (const mapping of ['job_id→jobId', 'artifact_id→artifactId', 'base_rev→baseRev', 'created_at→createdAt']) expect(document).toContain(mapping)
  expect(document).toContain('仅在 empty 场景查询预置 fixture id 时返回 null')
  expect(document).toContain('任何场景的未知 id 返回 not_found')
})
