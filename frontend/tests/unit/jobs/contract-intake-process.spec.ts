// @vitest-environment node
import { describe, expect, test } from 'vitest'
import * as c from '../../../src/contracts/types.ts'

const sourceNote = { purpose: '合成材料用途', reliability: 'unknown', publishedAt: '2026-10-28', validUntil: null, scopeNote: null }
const fileMeta = { name: 'sample.pdf', size: 100, type: '', lastModified: 0 }
const common = { jobId: null, sourceNote }
const timestamp = '2026-10-28T12:00:00Z'

describe('WI intake schema — AC-003-2 / AC-003-3 schema 前置', () => {
  test.each(['pdf', 'docx', 'xlsx', 'md', 'csv'])('accepts .%s including uppercase', extension => {
    expect(c.INTAKE_FILE_EXTENSIONS).toContain(extension)
    for (const ext of [extension, extension.toUpperCase()]) expect(c.IntakeInputSchema.safeParse({ ...common, inputKind: 'file', fileMeta: { ...fileMeta, name: `sample.${ext}` } }).success).toBe(true)
  })
  test.each(['sample.exe', 'sample.png', 'sample', 'sample.pdf.exe'])('rejects %s', name => {
    expect(c.IntakeInputSchema.safeParse({ ...common, inputKind: 'file', fileMeta: { ...fileMeta, name } }).success).toBe(false)
  })
  test('three input kinds parse; empty text, mixed payloads and missing payloads fail', () => {
    for (const input of [{ inputKind: 'file', fileMeta }, { inputKind: 'url', url: 'https://example.test/research' }, { inputKind: 'text', text: '合成正文' }]) expect(c.IntakeInputSchema.safeParse({ ...common, ...input }).success).toBe(true)
    for (const input of [{ inputKind: 'file' }, { inputKind: 'text', text: ' ' }, { inputKind: 'url', url: '' }, { inputKind: 'url', url: 'https://example.test', text: 'extra' }]) expect(c.IntakeInputSchema.safeParse({ ...common, ...input }).success).toBe(false)
  })
  test('source note enforces purpose, reliability and material dates rather than timestamps', () => {
    for (const reliability of ['high', 'medium', 'low', 'unknown']) expect(c.SourceNoteSchema.safeParse({ ...sourceNote, reliability }).success).toBe(true)
    expect(c.SourceNoteSchema.safeParse({ ...sourceNote, publishedAt: null }).success).toBe(true)
    for (const patch of [{ purpose: '' }, { purpose: '  ' }, { reliability: 'trusted' }, { publishedAt: timestamp }, { publishedAt: '2026-02-30' }, { validUntil: timestamp }]) expect(c.SourceNoteSchema.safeParse({ ...sourceNote, ...patch }).success).toBe(false)
  })
  test('upload records contain metadata only and preview/mapping are concrete', () => {
    const upload = { ...common, id: 'u1', inputKind: 'text', status: 'pending_validation', mapping: [], createdAt: timestamp, removed: false }
    expect(c.UploadSchema.parse(upload)).toEqual(upload)
    expect(c.UploadSchema.safeParse({ ...upload, text: 'must not persist' }).success).toBe(false)
    expect(c.UploadSchema.safeParse({ ...upload, inputKind: 'file', fileMeta }).success).toBe(true)
    expect(c.UploadSchema.safeParse({ ...upload, inputKind: 'file' }).success).toBe(false)
    const fields = [{ sourceField: '日期', targetField: 'date', unit: 'day' }]
    expect(c.ExtractionPreviewSchema.safeParse({ detectedType: 'table', fields, unit: 'day', timeRange: { start: '2026-10-01', end: '2026-10-28' } }).success).toBe(true)
    expect(c.FieldMappingSchema.safeParse([{ sourceField: '日期' }]).success).toBe(false)
  })
})

describe('WI process schema — AC-004-1 / AC-004-3 schema 前置', () => {
  test('reconciliation accepts empty differences and concrete rows with Figure metadata', () => {
    const diff = { unit: 't', freq: '1d', semantic: 'analysis', asOf: timestamp, seriesId: 's1', sources: [{ id: 'a', name: '源 A' }, { id: 'b', name: '源 B' }], rows: [] }
    expect(c.ReconciliationDiffSchema.parse(diff)).toEqual(diff)
    expect(c.ReconciliationDiffSchema.safeParse({ ...diff, rows: [{ ts: timestamp, leftValue: 10, rightValue: 12, difference: -2, differs: true }] }).success).toBe(true)
    expect(c.ReconciliationDiffSchema.safeParse({ ...diff, sources: diff.sources.slice(1) }).success).toBe(false)
    expect(c.ReconciliationDiffSchema.safeParse({ ...diff, rows: [{ ts: timestamp, leftValue: 10, rightValue: 12 }] }).success).toBe(false)
  })
  test('lineage requires at least one observation or table-row anchor', () => {
    for (const kind of ['observation', 'tableRow']) expect(c.DerivedValueSchema.safeParse({ value: 1, unit: 't', lineage: [{ kind, ref: 's1@2026-10-28', label: '来源' }] }).success).toBe(true)
    for (const lineage of [[], [{ kind: 'source', ref: 's1', label: '错误类型' }], [{ kind: 'observation' }]]) expect(c.DerivedValueSchema.safeParse({ value: 1, unit: 't', lineage }).success).toBe(false)
  })
  test('parameter patches and single-chain steps have typed fields', () => {
    const params = { unit: 't', timezone: 'UTC', calendar: 'natural', resample: '1d', aggregation: 'sum' }
    expect(c.ParamSetSchema.parse(params)).toEqual(params)
    expect(c.ParamChangeSchema.parse({ unit: 'kt' })).toEqual({ unit: 'kt' })
    for (const changes of [{}, { unit: undefined }, { unit: '' }, { unexpected: 'x' }]) expect(c.ParamChangeSchema.safeParse(changes).success).toBe(false)
    expect(c.RecipeStepSchema.safeParse({ id: 'step-1', label: '单位换算', input: 's1', output: 's2' }).success).toBe(true)
    expect(c.RecipeStepSchema.safeParse({ id: 'step-1', label: '单位换算', input: ['s1'], output: 's2' }).success).toBe(false)
    expect(c.SeriesRefSchema.safeParse({ seriesId: 's1', sourceId: 'a', label: '合成序列', unit: 't', freq: '1d', semantic: 'analysis', asOf: timestamp }).success).toBe(true)
  })
})

describe('WI analysis schema — AC-005-1 / AC-005-2 schema 前置', () => {
  test('evidence is the only count source and tombstones preserve conclusion content', () => {
    const evidence = [{ kind: 'assertion', ref: 'claim-1', label: '断言' }, { kind: 'series', ref: 's1', label: '序列' }, { kind: 'source', ref: 'u1', label: '来源' }]
    const conclusion = { id: 'c1', text: '合成结论', status: 'provisional', source: 'agent', origin: 'derived', evidence }
    expect(c.ConclusionSchema.parse(conclusion).evidence).toHaveLength(3)
    expect(c.ConclusionSchema.parse({ ...conclusion, evidence: [] }).evidence).toHaveLength(0)
    expect(c.ConclusionSchema.parse({ ...conclusion, deleted: true, vetoed: true })).toMatchObject({ text: '合成结论', deleted: true, vetoed: true })
    expect(c.ConclusionSchema.safeParse({ ...conclusion, evidenceCount: 99 }).success).toBe(false)
    expect(c.ConclusionSchema.safeParse({ ...conclusion, evidence: [{ kind: 'unknown', ref: 'x', label: 'x' }] }).success).toBe(false)
  })
})
