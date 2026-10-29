// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import * as c from '../../../src/contracts/types.ts'

const document = readFileSync(new URL('../../../contracts/CONTRACT.md', import.meta.url), 'utf8')

describe('WI enums — AC-008-1 schema 前置', () => {
  test('frozen stages, states, types and thirteen intervention kinds', () => {
    expect(c.StageSchema.options).toEqual(['collect', 'process', 'analyze', 'deliver'])
    expect(c.StageStateSchema.options).toEqual(['not_started', 'running', 'needs_human', 'done', 'conflict'])
    expect(c.JobTypeSchema.options).toEqual(['daily', 'research', 'adhoc'])
    expect(c.JobStatusSchema.options).toEqual(['draft', 'collecting', 'processing', 'analyzing', 'delivering', 'delivered', 'needs_human', 'failed', 'cancelled'])
    expect(c.InterventionKindSchema.options).toEqual(['ingest', 'map_fix', 'recipe', 'framework', 'question', 'delete', 'rewrite', 'veto', 'approve', 'ask_why', 'pin_rule', 'rerun', 'finalize'])
    for (const kind of c.InterventionKindSchema.options) expect(c.InterventionKindSchema.parse(kind)).toBe(kind)
    for (const kind of ['source_pref', 'value_fix', 'decision', 'slot_fix', 'interview']) expect(c.InterventionKindSchema.safeParse(kind).success).toBe(false)
  })
  test('active includes draft and failed but not sealed jobs, with generated documentation', () => {
    expect(c.ACTIVE_JOB_STATUSES).toEqual(['draft', 'collecting', 'processing', 'analyzing', 'delivering', 'needs_human', 'failed'])
    expect(c.ACTIVE_JOB_STATUSES).toBe(c.ActiveJobStatusSchema.options)
    for (const status of c.JobStatusSchema.options) expect(c.ActiveJobStatusSchema.safeParse(status).success).toBe(!['delivered', 'cancelled'].includes(status))
    expect(document).toContain('### `ActiveJobStatus`')
    expect(document).toContain(c.ActiveJobStatusSchema.description)
  })
})

describe('WI labels — AC-001-5 / AC-003-6 / AC-006-8 schema 前置', () => {
  const mappings = [
    [c.JobStatusSchema, c.JobStatusLabel, c.JobStatusLabelSchema],
    [c.StageSchema, c.StageLabel, c.StageLabelSchema],
    [c.StageStateSchema, c.StageStateLabel, c.StageStateLabelSchema],
    [c.ArtifactStatusSchema, c.ArtifactStatusLabel, c.ArtifactStatusLabelSchema],
    [c.UploadStatusSchema, c.UploadStatusLabel, c.UploadStatusLabelSchema],
    [c.DeliverableStatusSchema, c.DeliverableStatusLabel, c.DeliverableStatusLabelSchema],
    [c.SourceSchema, c.SourceLabel, c.SourceLabelSchema],
    [c.OriginSchema, c.OriginLabel, c.OriginLabelSchema],
    [c.JobTypeSchema, c.JobTypeLabel, c.JobTypeLabelSchema],
  ] as const
  test.each(mappings)('mapping %# exactly covers enum and literal text/icons are generated', (enumeration, labels, schema) => {
    expect(Object.keys(labels)).toEqual(enumeration.options)
    expect(schema.parse(labels)).toEqual(labels)
    const first = Object.keys(labels)[0]!
    expect(schema.safeParse({ ...labels, [first]: { text: 'wrong', icon: '?' } }).success).toBe(false)
    for (const { text, icon } of Object.values(labels)) {
      expect(text.trim()).not.toBe('')
      expect(icon.trim()).not.toBe('')
      expect(document).toContain(JSON.stringify(text))
      expect(document).toContain(JSON.stringify(icon))
    }
  })
  test('derived and final use the approved terminology', () => {
    expect(c.OriginLabel.derived.text).toBe('内部生成')
    expect(c.DeliverableStatusLabel.draft.text).toBe('草稿')
    expect(c.DeliverableStatusLabel.final.text).toBe('已定稿')
  })
})

test('WI contract notes — AC-008-1 S-14 / S-16 are in generated CONTRACT.md', () => {
  for (const schema of [c.JobStatusSchema, c.StageStateLabelSchema, c.InterventionKindSchema]) expect(document).toContain(schema.description)
  expect(document).toContain('运行失败以 conflict 呈现，原因见 Job.reason')
  expect(document).toContain('source_pref / value_fix 归后续处理台 / data-layer 映射 feature')
  expect(document).toContain('本契约用独立的 finalize 承载')
})

describe('WI reliability label — AC-003-3 / AC-008-1 schema 前置', () => {
  test('ordered keys, approved text and nonempty icons share literal schemas', () => {
    expect(Object.keys(c.ReliabilityLabel)).toEqual(c.SourceNoteSchema.shape.reliability.options)
    expect(Object.values(c.ReliabilityLabel).map(label => label.text)).toEqual(['高', '中', '低', '未知'])
    expect(c.ReliabilityLabelSchema.parse(c.ReliabilityLabel)).toEqual(c.ReliabilityLabel)
    for (const key of c.SourceNoteSchema.shape.reliability.options) {
      const label = c.ReliabilityLabel[key]
      expect(label.icon.trim()).not.toBe('')
      expect(c.ReliabilityLabelSchema.safeParse({ ...c.ReliabilityLabel, [key]: { ...label, text: 'wrong' } }).success).toBe(false)
    }
  })
  test('registered mapping generates all four text and icon literals', () => {
    expect(c.contractSchemas.ReliabilityLabel).toBe(c.ReliabilityLabelSchema)
    const section = document.split('### `ReliabilityLabel`')[1]!.split('\n### ')[0]!
    for (const { text, icon } of Object.values(c.ReliabilityLabel)) {
      expect(section).toContain(JSON.stringify(text))
      expect(section).toContain(JSON.stringify(icon))
    }
  })
})
