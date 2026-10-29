// @vitest-environment node
import { describe, expect, test } from 'vitest'
import * as c from '../../../src/contracts/types.ts'
import jobsInput from '../../../src/contracts/mock/fixtures/jobs/jobs.json'
import detailsInput from '../../../src/contracts/mock/fixtures/jobs/job-detail.json'

import deliverableInput from '../../../src/contracts/mock/fixtures/jobs/deliverable.json'
import interventionsInput from '../../../src/contracts/mock/fixtures/jobs/interventions.json'
import uploadsInput from '../../../src/contracts/mock/fixtures/jobs/uploads.json'

const deliveries = c.DeliverableFixturesSchema.parse(deliverableInput)
const uploads = c.UploadFixturesSchema.parse(uploadsInput)
const interventions = c.InterventionSchema.array().parse(interventionsInput)
const jobs = c.JobCollectionsSchema.parse(jobsInput)
const details = c.JobDetailsSchema.parse(detailsInput)
const allJobs = Object.values(jobs).flat()

// Expectations are the ten rows of the frozen plan, not derived from fixture states.
const expected = [
  ['normal', 'j-collect', 'collecting', 'collect', ['running', 'not_started', 'not_started', 'not_started']],
  ['normal', 'j-process', 'processing', 'process', ['done', 'running', 'not_started', 'not_started']],
  ['normal', 'j-deliver', 'delivering', 'deliver', ['done', 'done', 'done', 'running']],
  ['normal', 'j-failed', 'failed', 'analyze', ['done', 'done', 'conflict', 'not_started']],
  ['normal', 'j-cancelled', 'cancelled', 'collect', ['not_started', 'not_started', 'not_started', 'not_started']],
  ['job-running', 'j-running', 'analyzing', 'analyze', ['done', 'done', 'running', 'not_started']],
  ['job-running', 'j-human', 'needs_human', 'process', ['done', 'needs_human', 'running', 'not_started']],
  ['job-pending-merge', 'j-merge', 'delivering', 'deliver', ['done', 'done', 'done', 'running']],
  ['job-conflict', 'j-conflict', 'needs_human', 'analyze', ['done', 'done', 'conflict', 'running']],
  ['job-delivered', 'j-delivered', 'delivered', 'deliver', ['done', 'done', 'done', 'done']],
] as const

describe('WI jobs fixtures — AC-008-2 / AC-002-3 / AC-002-5 / AC-005-6', () => {
  test('both complete files parse without stripped data; exactly ten scenario rows', () => {
    expect(jobs).toEqual(jobsInput)
    expect(details).toEqual(detailsInput)
    expect(allJobs).toHaveLength(10)
    expect(new Set(allJobs.map(job => job.id)).size).toBe(10)
    expect(Object.keys(details).sort()).toEqual(allJobs.map(job => job.id).sort())
    for (const [scenario, id, status, currentStage, states] of expected) {
      const job = jobs[scenario].find(item => item.id === id)!
      expect(job).toMatchObject({ status, currentStage })
      expect(job.stages.map(stage => stage.state)).toEqual(states)
    }
  })
  test('S-29 failed is only a stage conflict; cancelled and normal seeds have zero pending counts', () => {
    for (const job of jobs.normal) {
      expect(job.pendingCount).toBe(0)
      expect(job.stages.every(stage => stage.pendingCount === 0)).toBe(true)
      expect(details[job.id].analyze.artifacts.every(artifact => artifact.status === 'draft')).toBe(true)
    }
    for (const id of ['j-failed', 'j-cancelled']) expect(allJobs.find(job => job.id === id)!.reason).toBeTruthy()
    expect(allJobs.find(job => job.id === 'j-failed')!.reason).toContain('conflict')
  })
  test.each(Object.keys(details))('%s has reachable snapshots, uploads, recipe chain, lineage and evidence', id => {
    const detail = details[id]
    for (const workspace of [detail.collect, detail.process, detail.analyze]) {
      expect(c.StageWorkspaceSchema.parse(workspace)).toEqual(workspace)
      for (const artifact of workspace.artifacts) {
        const snapshot = workspace.revisions.find(rev => rev.id === artifact.latestMergedRev)!
        expect(snapshot.artifactId).toBe(artifact.id)
        expect(snapshot.artifactKind).toBe(artifact.kind)
      }
      for (const rev of workspace.revisions) {
        expect(workspace.artifacts.some(artifact => artifact.id === rev.artifactId)).toBe(true)
        if (rev.baseRev) expect(workspace.revisions.some(base => base.id === rev.baseRev && base.number < rev.number)).toBe(true)
      }
    }
    const { collect, process, analyze } = detail
    const states = expected.find(row => row[1] === id)![4]
    if (states[0] !== 'not_started') {
      expect(collect.uploads).toHaveLength(2)
      for (const upload of collect.uploads) {
        expect(upload.jobId).toBe(id)
        expect(detail.previews[upload.id].fields).toEqual(upload.mapping)
        expect(collect.revisions[0].uploads.find(item => item.uploadId === upload.id)).toMatchObject({ mapping: upload.mapping, status: upload.status })
      }
    }
    if (states[1] !== 'not_started') {
      expect(process.sources).toHaveLength(2)
      expect(process.series).toHaveLength(2)
      for (const series of process.series) {
        expect(process.sources.some(source => source.id === series.sourceId)).toBe(true)
        expect(collect.uploads.some(upload => upload.id === series.sourceId)).toBe(true)
      }
      const steps = process.revisions[0].steps
      expect(steps.length).toBeGreaterThanOrEqual(3)
      expect(process.series.some(series => series.seriesId === steps[0].input)).toBe(true)
      steps.slice(1).forEach((step, index) => expect(step.input).toBe(steps[index].output))
      expect(detail.reconciliations).toHaveLength(2)
      expect(detail.reconciliations[0].rows[0]).toMatchObject({ leftValue: 100, rightValue: 104, difference: 4, differs: true })
      expect(detail.reconciliations[1].rows).toEqual([])
      for (const diff of detail.reconciliations) {
        expect(process.series.some(series => series.seriesId === diff.seriesId)).toBe(true)
        expect(diff.sources).toEqual(process.sources)
      }
      for (const value of process.derivedValues) for (const anchor of value.lineage) {
        expect(anchor.kind).toBe('observation')
        expect(detail.reconciliations.some(diff => diff.rows.some(row => `${diff.seriesId}@${row.ts}` === anchor.ref))).toBe(true)
      }
    }
    if (states[2] !== 'not_started') {
      const conclusions = analyze.revisions.flatMap(rev => rev.conclusions)
      expect(analyze.revisions[0].conclusions.length).toBeGreaterThanOrEqual(3)
      expect(new Set(conclusions.flatMap(conclusion => conclusion.evidence.map(anchor => anchor.kind)))).toEqual(new Set(['assertion', 'series', 'source']))
      for (const conclusion of conclusions) for (const anchor of conclusion.evidence) {
        const targets = anchor.kind === 'assertion' ? conclusions.map(item => item.id)
          : anchor.kind === 'series' ? process.series.map(item => item.seriesId) : collect.uploads.map(item => item.id)
        expect(targets).toContain(anchor.ref)
        expect(anchor.ref).not.toBe(conclusion.id)
      }
    }
  })
  test('conflict preserves distinct human/agent proposals and a usable provisional merged snapshot', () => {
    const { artifacts, revisions } = details['j-conflict'].analyze
    expect(artifacts[0].status).toBe('conflict')
    expect(revisions.find(rev => rev.id === artifacts[0].latestMergedRev)!.conclusions.every(item => item.status === 'provisional')).toBe(true)
    expect(revisions[1].author).toBe('human')
    expect(revisions[2].author).toBe('agent')
    expect(revisions[1].conclusions[0].status).toBe('conflict')
    expect(revisions[2].conclusions[0].status).toBe('conflict')
    expect(revisions[1].conclusions[0].text).not.toBe(revisions[2].conclusions[0].text)
  })
  test('real boundaries reject malformed job and workspace files', () => {
    expect(c.JobCollectionsSchema.safeParse({ ...jobsInput, normal: [{ ...jobsInput.normal[0], stages: [] }] }).success).toBe(false)
    expect(c.JobDetailsSchema.safeParse({ broken: { ...detailsInput['j-collect'], collect: detailsInput['j-collect'].process } }).success).toBe(false)
  })
})

describe('WI deliverable fixtures — AC-006-7 / AC-008-1 S-18', () => {
  test('all three files parse unchanged, including the final and draft workspace boundaries', () => {
    expect(deliveries).toEqual(deliverableInput)
    expect(uploads).toEqual(uploadsInput)
    expect(interventions).toEqual(interventionsInput)
    for (const workspace of Object.values(deliveries)) expect(c.StageWorkspaceSchema.parse(workspace)).toEqual(workspace)
  })
  test('six ordered blocks, agent v1 / human v2 and open thread have usable anchors', () => {
    const workspace = deliveries['j-deliver']
    expect(workspace.deliverable!.blocks.map(block => block.type)).toEqual(['conclusion', 'chart', 'table', 'quote', 'verification', 'note'])
    expect(workspace.revisions.map(rev => [rev.number, rev.author])).toEqual([[1, 'agent'], [2, 'human']])
    expect(workspace.revisions[1].baseRev).toBe(workspace.revisions[0].id)
    expect(workspace.deliverable!.blocks).toEqual(workspace.revisions[1].blocks)
    expect(workspace.revisions[0].blocks.at(-1)).not.toEqual(workspace.revisions[1].blocks.at(-1))
    const thread = workspace.deliverable!.blocks[0].comments[0]
    expect(thread.status).toBe('open')
    expect(thread.blockId).toBe(workspace.deliverable!.blocks[0].id)
    expect(thread.comments[0]).toMatchObject({ threadId: thread.threadId, parentId: null })
    for (const [id, delivery] of Object.entries(deliveries)) {
      if (expected.find(row => row[1] === id)![4][3] === 'not_started') continue
      expect(delivery.deliverable!.jobId).toBe(id)
      const artifact = delivery.artifacts[0]
      expect(artifact.id).toBe(delivery.deliverable!.id)
      expect(delivery.revisions.some(rev => rev.id === artifact.latestMergedRev)).toBe(true)
      for (const rev of delivery.revisions) {
        expect(rev.artifactId).toBe(artifact.id)
        if (rev.baseRev) expect(delivery.revisions.some(base => base.id === rev.baseRev && base.number < rev.number)).toBe(true)
        for (const block of rev.blocks) {
          for (const anchor of block.anchors) {
            const targets = anchor.kind === 'series' ? details[id].process.series.map(item => item.seriesId)
              : anchor.kind === 'source' ? details[id].collect.uploads.map(item => item.id)
                : details[id].analyze.revisions.flatMap(item => item.conclusions.map(conclusion => conclusion.id))
            expect(targets).toContain(anchor.ref)
          }
          if (block.type === 'verification') expect(rev.blocks.some(target => target.id === block.conclusionBlockId && target.type === 'conclusion')).toBe(true)
          if (block.type === 'quote') expect(details[id].collect.uploads.some(upload => upload.id === block.sourceAnchor.ref)).toBe(true)
          if (block.type === 'chart') {
            expect(block.chartSpec.seriesBindings.main).toBe(block.seriesData.seriesId)
            expect(details[id].process.series.some(series => series.seriesId === block.seriesData.seriesId)).toBe(true)
            expect(block.seriesData.points[0]).toMatchObject({ ts: details[id].reconciliations[0].rows[0].ts, value: 100 })
          }
        }
      }
    }
  })
  test('merge starts without overlay; conflict keeps human, agent and provisional snapshots', () => {
    expect(deliveries['j-merge'].deliverable!.blocks.map(block => block.type)).toEqual(['conclusion', 'note'])
    expect(deliveries['j-merge'].artifacts[0]).toMatchObject({ overlayRev: null, pendingMerge: false, pendingRunId: null })
    const workspace = deliveries['j-conflict']
    expect(workspace.deliverable!.blocks[0].status).toBe('conflict')
    expect(workspace.revisions[0].id).toBe(workspace.artifacts[0].latestMergedRev)
    expect(workspace.revisions[0].blocks.every(block => block.status === 'provisional')).toBe(true)
    expect(workspace.revisions.slice(1).map(rev => rev.author)).toEqual(['human', 'agent'])
    expect(workspace.revisions[1].blocks[0]).not.toEqual(workspace.revisions[2].blocks[0])
  })
  test('two unassigned uploads, one quarantined reason, metadata only and reachable previews', () => {
    expect(uploads.uploads).toHaveLength(2)
    expect(uploads.uploads.every(upload => upload.jobId === null)).toBe(true)
    expect(uploads.uploads.filter(upload => upload.status === 'quarantined')).toHaveLength(1)
    expect(uploads.uploads.find(upload => upload.status === 'quarantined')!.quarantineReason).toBeTruthy()
    for (const upload of uploads.uploads) {
      expect(uploads.previews[upload.id].fields).toEqual(upload.mapping)
      expect(c.UploadSchema.safeParse({ ...upload, text: 'must not persist' }).success).toBe(false)
    }
  })
  test('S-18 rejects non-null draft anchors, missing/mismatched final anchors and a draft snapshot', () => {
    const draft = structuredClone(deliveries['j-deliver'])
    const final = structuredClone(deliveries['j-delivered'])
    expect(c.StageWorkspaceSchema.safeParse({ ...draft, deliverable: { ...draft.deliverable, finalSnapshotId: 'bad' } }).success).toBe(false)
    expect(c.StageWorkspaceSchema.safeParse({ ...final, deliverable: { ...final.deliverable, finalSnapshotId: null } }).success).toBe(false)
    for (const patch of [{ id: 'bad' }, { revisionNumber: 99 }, { finalizedAt: '2026-10-29T08:00:00Z' }]) {
      expect(c.StageWorkspaceSchema.safeParse({ ...final, finalSnapshot: { ...final.finalSnapshot, ...patch } }).success).toBe(false)
    }
    expect(c.StageWorkspaceSchema.safeParse({ ...draft, finalSnapshot: final.finalSnapshot }).success).toBe(false)
  })
})

describe('WI final only delivered — AC-006-7', () => {
  test('only j-delivered is final and its snapshot freezes the actual revision', () => {
    expect(Object.keys(deliveries).sort()).toEqual(allJobs.map(job => job.id).sort())
    for (const [id, workspace] of Object.entries(deliveries)) {
      if (expected.find(row => row[1] === id)![4][3] === 'not_started') {
        expect(workspace.deliverable).toBeNull()
        expect(workspace.finalSnapshot).toBeNull()
        continue
      }
      if (id !== 'j-delivered') {
        expect(workspace.deliverable).toMatchObject({ deliverableStatus: 'draft', finalSnapshotId: null, finalRevisionNumber: null, finalizedAt: null })
        expect(workspace.finalSnapshot).toBeNull()
        continue
      }
      const snapshot = workspace.finalSnapshot!
      const revision = workspace.revisions.find(rev => rev.id === snapshot.revisionId)!
      expect(workspace.deliverable).toMatchObject({ deliverableStatus: 'final', finalSnapshotId: snapshot.id, finalRevisionNumber: revision.number, finalizedAt: snapshot.finalizedAt })
      expect(snapshot.jobId).toBe(id)
      expect(snapshot.revisionNumber).toBe(revision.number)
      expect(snapshot.blocks).toEqual(revision.blocks)
      expect(workspace.deliverable!.blocks).toEqual(snapshot.blocks)
      expect(snapshot.blocks.every(block => block.status === 'confirmed')).toBe(true)
    }
  })
})

describe('WI interventions fixtures — AC-007-1', () => {
  test('ten fields, multiple stages/kinds, and all target/base anchors exist', () => {
    expect(new Set(interventions.map(event => event.stage)).size).toBeGreaterThanOrEqual(2)
    expect(new Set(interventions.map(event => event.kind)).size).toBeGreaterThanOrEqual(3)
    for (const event of interventions) {
      expect(Object.keys(event).sort()).toEqual(['id', 'jobId', 'stage', 'artifactId', 'baseRev', 'kind', 'payload', 'reason', 'outcome', 'createdAt'].sort())
      expect(allJobs.some(job => job.id === event.jobId)).toBe(true)
      const workspace = event.stage === 'deliver' ? deliveries[event.jobId] : details[event.jobId][event.stage]
      expect(workspace.artifacts.some(artifact => artifact.id === event.artifactId)).toBe(true)
      expect(workspace.revisions.some(revision => revision.id === event.baseRev)).toBe(true)
      const payload = event.payload
      if ('uploadId' in payload) expect(details[event.jobId].collect.uploads.some(upload => upload.id === payload.uploadId)).toBe(true)
      if ('conclusionId' in payload) expect(details[event.jobId].analyze.revisions.some(revision => revision.conclusions.some(conclusion => conclusion.id === payload.conclusionId))).toBe(true)
      if ('blockId' in payload) expect(deliveries[event.jobId].deliverable!.blocks.some(block => block.id === payload.blockId)).toBe(true)
      if (payload.action === 'finalize') expect(deliveries[event.jobId].finalSnapshot).toMatchObject({ id: payload.snapshotId, revisionId: payload.revisionId, finalizedAt: event.createdAt })
      expect(c.InterventionSchema.safeParse({ ...event, kind: 'veto' }).success).toBe(false)
      expect(c.InterventionSchema.safeParse({ ...event, payload: { action: 'unknown' } }).success).toBe(false)
    }
  })
})

test('WI not-started seeds — twelve empty workspaces and no orphan previews/reconciliations', () => {
  const empty = {
    collect: { stage: 'collect', uploads: [], artifacts: [], revisions: [] },
    process: { stage: 'process', sources: [], series: [], artifacts: [], revisions: [], derivedValues: [] },
    analyze: { stage: 'analyze', artifacts: [], revisions: [] },
    deliver: { stage: 'deliver', artifacts: [], revisions: [], deliverable: null, finalSnapshot: null },
  }
  let count = 0
  for (const [, id, , , states] of expected) {
    for (const [index, stage] of (['collect', 'process', 'analyze', 'deliver'] as const).entries()) {
      if (states[index] !== 'not_started') continue
      const workspace = stage === 'deliver' ? deliveries[id] : details[id][stage]
      expect(workspace).toEqual(empty[stage])
      if (stage === 'collect') expect(details[id].previews).toEqual({})
      if (stage === 'process') expect(details[id].reconciliations).toEqual([])
      count++
    }
  }
  expect(count).toBe(12)
})

describe('WI list coverage — AC-001-1 / AC-001-2', () => {
  test('three types, distinct timestamps and multiple states support sorting/filtering', () => {
    expect(new Set(allJobs.map(job => job.type))).toEqual(new Set(['daily', 'research', 'adhoc']))
    expect(new Set(allJobs.map(job => job.updatedAt)).size).toBe(10)
    expect(new Set(allJobs.map(job => job.status)).size).toBe(8)
    const sorted = [...allJobs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    expect(sorted[0].id).toBe('j-delivered')
    expect(sorted.at(-1)!.id).toBe('j-collect')
  })
})
