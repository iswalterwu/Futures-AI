// @vitest-environment node
import { describe, expect, test } from 'vitest'
import * as c from '../../../src/contracts/types.ts'
import jobsInput from '../../../src/contracts/mock/fixtures/jobs/jobs.json'
import detailsInput from '../../../src/contracts/mock/fixtures/jobs/job-detail.json'

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
    expect(collect.uploads).toHaveLength(2)
    for (const upload of collect.uploads) {
      expect(upload.jobId).toBe(id)
      expect(detail.previews[upload.id].fields).toEqual(upload.mapping)
      expect(collect.revisions[0].uploads.find(item => item.uploadId === upload.id)).toMatchObject({ mapping: upload.mapping, status: upload.status })
    }
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
    const conclusions = analyze.revisions.flatMap(rev => rev.conclusions)
    expect(analyze.revisions[0].conclusions.length).toBeGreaterThanOrEqual(3)
    expect(new Set(conclusions.flatMap(conclusion => conclusion.evidence.map(anchor => anchor.kind)))).toEqual(new Set(['assertion', 'series', 'source']))
    for (const conclusion of conclusions) for (const anchor of conclusion.evidence) {
      const targets = anchor.kind === 'assertion' ? conclusions.map(item => item.id)
        : anchor.kind === 'series' ? process.series.map(item => item.seriesId) : collect.uploads.map(item => item.id)
      expect(targets).toContain(anchor.ref)
      expect(anchor.ref).not.toBe(conclusion.id)
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
