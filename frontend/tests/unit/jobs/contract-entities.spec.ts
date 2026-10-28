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

test('WI naming — AC-007-1 / AC-008-1 camelCase and getJob null semantics are generated', () => {
  const document = readFileSync(new URL('../../../contracts/CONTRACT.md', import.meta.url), 'utf8')
  for (const mapping of ['job_id→jobId', 'artifact_id→artifactId', 'base_rev→baseRev', 'created_at→createdAt']) expect(document).toContain(mapping)
  expect(document).toContain('仅在 empty 场景查询预置 fixture id 时返回 null')
  expect(document).toContain('任何场景的未知 id 返回 not_found')
})
