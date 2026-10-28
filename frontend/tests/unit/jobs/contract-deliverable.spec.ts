// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import * as c from '../../../src/contracts/types.ts'

const timestamp = '2026-10-28T12:00:00+08:00'
const blockBase = { id: 'b1', status: 'confirmed', source: 'agent', origin: 'derived', anchors: [], comments: [] }
const chartSpec = { templateId: 'line-sample', seriesBindings: { main: 's1' }, overrides: { title: '合成图' } }
const seriesData = { points: [{ ts: timestamp, value: 1 }], unit: 't', freq: '1d', semantic: 'analysis', asOf: timestamp, seriesId: 's1' }
const blocks = [
  { ...blockBase, type: 'conclusion', text: '结论' },
  { ...blockBase, id: 'b2', type: 'note', text: '备注' },
  { ...blockBase, id: 'b3', type: 'quote', text: '摘录', sourceAnchor: { kind: 'source', ref: 'u1#page1', label: '材料' } },
  { ...blockBase, id: 'b4', type: 'table', tableId: 't1', columns: ['日期', '数量'], rows: [['2026-10-28', 1], ['2026-10-29', null]] },
  { ...blockBase, id: 'b5', type: 'verification', question: '是否继续？', conclusionBlockId: 'b1' },
  { ...blockBase, id: 'b6', type: 'chart', chartSpec, seriesData },
]
const draft = { id: 'd1', jobId: 'j1', blocks, deliverableStatus: 'draft', finalSnapshotId: null, finalRevisionNumber: null, finalizedAt: null }
const snapshot = { id: 'f1', jobId: 'j1', revisionId: 'r2', revisionNumber: 2, finalizedAt: timestamp, blocks }
const final = { ...draft, deliverableStatus: 'final', finalSnapshotId: 'f1', finalRevisionNumber: 2, finalizedAt: timestamp }

describe('WI blocks — AC-006-1 schema 前置', () => {
  test.each(blocks)('accepts $type', block => { expect(c.BlockSchema.parse(block)).toEqual(block) })
  test('rejects wrong chart template and arbitrary ECharts options at every level', () => {
    for (const input of [
      { ...chartSpec, templateId: 'bar' }, { series: [{ type: 'line', data: [1] }] },
      { ...chartSpec, option: { xAxis: {} } }, { ...chartSpec, overrides: { title: 'x', series: [] } },
      { ...chartSpec, seriesBindings: { main: 's1', arbitrary: 's2' } },
    ]) {
      expect(c.ChartSpecSchema.safeParse(input).success).toBe(false)
      expect(c.BlockSchema.safeParse({ ...blockBase, type: 'chart', chartSpec: input, seriesData }).success).toBe(false)
    }
    expect(c.ChartSpecSchema.safeParse({ ...chartSpec, overrides: {} }).success).toBe(true)
  })
  test('requires branch-specific content and rejects later block types', () => {
    expect(c.BlockSchema.safeParse({ ...blockBase, type: 'chart', text: 'wrong' }).success).toBe(false)
    expect(c.BlockSchema.safeParse({ ...blockBase, type: 'call', text: 'future' }).success).toBe(false)
    expect(c.BlockSchema.safeParse({ ...blocks[2], sourceAnchor: { kind: 'series', ref: 's1', label: 'wrong' } }).success).toBe(false)
  })
  test('comment threads retain parent and author metadata', () => {
    const root = { id: 'm1', threadId: 't1', parentId: null, author: 'human', text: '批注', createdAt: timestamp }
    const thread = { threadId: 't1', blockId: 'b1', status: 'open', comments: [root, { ...root, id: 'm2', parentId: 'm1', author: 'agent' }] }
    expect(c.BlockCommentThreadSchema.parse(thread)).toEqual(thread)
    expect(c.BlockCommentThreadSchema.safeParse({ ...thread, status: 'resolved' }).success).toBe(true)
    expect(c.BlockCommentSchema.safeParse({ ...root, parentId: undefined }).success).toBe(false)
  })
})

describe('WI S-18 — AC-006-7 / AC-008-1 schema 前置', () => {
  test('draft has three null anchors, even with confirmed blocks; final has matching anchors', () => {
    expect(c.DeliverWorkspaceSchema.parse({ deliverable: draft, finalSnapshot: null }).deliverable?.deliverableStatus).toBe('draft')
    expect(c.DeliverWorkspaceSchema.parse({ deliverable: final, finalSnapshot: snapshot })).toEqual({ deliverable: final, finalSnapshot: snapshot })
    expect(c.DeliverWorkspaceSchema.safeParse({ deliverable: null, finalSnapshot: null }).success).toBe(true)
  })
  test('draft rejects any non-null final anchor', () => {
    for (const patch of [{ finalSnapshotId: 'f1' }, { finalRevisionNumber: 2 }, { finalizedAt: timestamp }]) expect(c.DeliverableSchema.safeParse({ ...draft, ...patch }).success).toBe(false)
  })
  test('final rejects missing/null/invalid anchors and date-only finalizedAt', () => {
    for (const key of ['finalSnapshotId', 'finalRevisionNumber', 'finalizedAt']) {
      expect(c.DeliverableSchema.safeParse({ ...final, [key]: null }).success).toBe(false)
      expect(c.DeliverableSchema.safeParse({ ...final, [key]: undefined }).success).toBe(false)
    }
    for (const patch of [{ finalSnapshotId: '' }, { finalRevisionNumber: 0 }, { finalRevisionNumber: 1.5 }, { finalizedAt: '2026-10-28' }]) expect(c.DeliverableSchema.safeParse({ ...final, ...patch }).success).toBe(false)
    expect(c.FinalSnapshotSchema.safeParse({ ...snapshot, finalizedAt: '2026-10-28' }).success).toBe(false)
  })
  test('workspace rejects mismatched or missing snapshots, checking all three anchors', () => {
    for (const finalSnapshot of [null, { ...snapshot, id: 'f2' }, { ...snapshot, revisionNumber: 3 }, { ...snapshot, finalizedAt: '2026-10-29T12:00:00+08:00' }]) expect(c.DeliverWorkspaceSchema.safeParse({ deliverable: final, finalSnapshot }).success).toBe(false)
  })
  test('draft and absent deliverable cannot carry a final snapshot', () => {
    for (const deliverable of [draft, null]) expect(c.DeliverWorkspaceSchema.safeParse({ deliverable, finalSnapshot: snapshot }).success).toBe(false)
  })
})

test('WI generated deliverable — AC-008-1 oneOf and both branches are generated by the real generator', () => {
  const schema = JSON.parse(readFileSync(new URL('../../../contracts/schema.json', import.meta.url), 'utf8'))
  expect(schema.$defs.Deliverable.oneOf).toHaveLength(2)
  expect(schema.$defs.Deliverable.oneOf.map((branch: { properties: { deliverableStatus: { const: string } } }) => branch.properties.deliverableStatus.const)).toEqual(['draft', 'final'])
  const document = readFileSync(new URL('../../../contracts/CONTRACT.md', import.meta.url), 'utf8')
  const section = document.split('### `Deliverable`')[1]!.split('\n### ')[0]!
  expect(section).toContain('$.oneOf[0].deliverableStatus')
  expect(section).toContain('$.oneOf[1].deliverableStatus')
  expect(section).toContain('"draft"')
  expect(section).toContain('"final"')
})
