// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import tokens from '../../src/design/tokens.json'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const documents = new Map<string, string>()
const tokenValues = new Map(tokens.map(({ name, value }) => [name, value]))
const uiEntries = [
  { folder: 'Foundations', file: 'UI_FOUNDATIONS' },
  { folder: 'Colors', file: 'UI_COLORS' },
  { folder: 'Fonts', file: 'UI_FONTS' },
  { folder: 'Layout', file: 'UI_LAYOUT' },
  { folder: 'Components', file: 'UI_COMPONENTS' },
  { folder: 'Cards', file: 'UI_CARDS' },
  { folder: 'Tables', file: 'UI_TABLES' },
  { folder: 'Navigation', file: 'UI_NAV' },
]

function readDocument(path: string): string {
  if (!documents.has(path)) {
    documents.set(path, readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n'))
  }
  return documents.get(path)!
}

function metadata(markdown: string): Record<string, string> {
  const match = markdown.match(/^---\n([\s\S]+?)\n---\n/)
  expect(match, 'front matter must precede the document').not.toBeNull()
  return Object.fromEntries(
    [...match![1].matchAll(/^([a-z_]+): (.+)$/gm)].map((field) => [field[1], field[2]]),
  )
}

function jsonBlock(markdown: string, label: string): unknown {
  const match = markdown.match(new RegExp('```json ' + label + '\\n([\\s\\S]+?)\\n```'))
  expect(match, `missing JSON block: ${label}`).not.toBeNull()
  return JSON.parse(match![1])
}

function rgb(hex: string): number[] {
  expect(hex).toMatch(/^#[\da-f]{6}$/i)
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16))
}

function luminance(channels: number[]): number {
  const [r, g, b] = channels.map((channel) => {
    const s = channel / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(foreground: string, background: string, alpha: number): number {
  const bg = rgb(background)
  const composed = rgb(foreground).map((channel, i) => Math.round(alpha * channel + (1 - alpha) * bg[i]))
  const foregroundLuminance = luminance(composed)
  const backgroundLuminance = luminance(bg)
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

describe('AC-008-1 registry', () => {
  test.each(uiEntries)('$file retains its original id, rule structure and migration provenance', ({ folder, file }) => {
    const path = `design/ui/${file}.md`
    const markdown = readDocument(path)
    const meta = metadata(markdown)
    expect(meta.id).toBe(`ui.${folder.toLowerCase()}.${file.toLowerCase()}`)
    expect(meta.source).toBe(`D:/FTEngine/design/UI/${folder}/${file}.md`)
    expect(meta.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(meta.source_verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(meta.migrated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(meta.adaptation).toBe('dark-glass')

    const sections = markdown.split('\n## 暗色适配\n')
    expect(sections).toHaveLength(2)
    const rules = sections[0].split(/^### #[a-z_]+ .+$/m).slice(1)
    expect(rules.length).toBeGreaterThan(0)
    for (const rule of rules) {
      expect(rule).toContain('规定：')
      expect(rule).toContain('为什么：')
      expect(rule).toContain('落点：')
    }
    expect(sections[1]).toContain('不采用')
    expect(sections[1]).toContain('原因')
    expect(sections[1]).toContain('为什么')
    expect(sections[1]).toContain('落点')

    const index = readDocument('design/ui/README.md')
    expect(index).toContain(`](${file}.md)`)
    expect(index).toContain(meta.source)
    expect(index).toContain(meta.migrated)
  })

  test('local additions declare their own identity, provenance and adoption limits', () => {
    const markdown = readDocument('design/ui/UI_DARK_ADDITIONS.md')
    const meta = metadata(markdown)
    expect(meta.id).toBe('ui.dark.ui_dark_additions')
    expect(meta.source).toBe('specs/frontend-workbench/plan.md')
    expect(readDocument(meta.source)).toContain('### 2.9 规范资产移植')
    expect(meta.source_verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(meta.migrated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(meta.adaptation).toBe('dark-glass')
    expect(markdown).toContain('\n## 暗色适配\n')
    expect(markdown).toContain('不采用')
    expect(readDocument('design/ui/README.md')).toContain('](UI_DARK_ADDITIONS.md)')
  })
})

describe('AC-008-2 sources', () => {
  test.each(tokens)('$name → $source', ({ source }) => {
    expect(source).toMatch(/^(?:design\/ui\/UI_[A-Z_]+\.md#[a-z_]+|design\/charts\/PALETTE_DARK\.md#[a-z_]+|docs\/designUI\.md#\d+(?:\.\d+)*)$/)
    const [path, anchor] = source.split('#')
    const markdown = readDocument(path)
    if (path === 'docs/designUI.md') {
      const sections = [...markdown.matchAll(/^#{1,6} (\d+(?:\.\d+)*)\s+.+$/gm)].map((heading) => heading[1])
      expect(sections.filter((section) => section === anchor), source).toHaveLength(1)
    } else {
      const ids = [...markdown.matchAll(/<a id="([a-z_]+)"><\/a>/g)].map((match) => match[1])
      expect(ids.filter((id) => id === anchor), source).toHaveLength(1)
      expect(markdown, source).toMatch(new RegExp(`^#{1,6} #${anchor}\\s+.+$`, 'm'))
    }
  })
})

type CorePalette = {
  line: string[]
  cat: string[]
  ord: string[]
  region: Record<string, string>
  pos: string
  neg: string
  other: string
  band: string
  band_alpha: number
  mean: string
  ref: string
  model: string
}

const coreDocument = readDocument('design/charts/PALETTE_CORE.md')
const darkDocument = readDocument('design/charts/PALETTE_DARK.md')
const core = jsonBlock(coreDocument, 'palette-core') as CorePalette
const retired = jsonBlock(coreDocument, 'palette-retired') as { hex: string }[]
const paletteRows = darkDocument.split('\n')
  .filter((line) => line.startsWith('|'))
  .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim().replaceAll('`', '')))
  .filter((cells) => cells.length === 7 && /^#[\da-f]{6}$/i.test(cells[1]))
  .map(([name, original, token, dark, alpha, ratio, usage]) => ({
    name, original, token, dark, alpha: Number(alpha), ratio: Number(ratio), usage,
  }))

describe('AC-008-3 palette', () => {
  test('covers exactly the 14 unique palette-core colors, excluding palette-retired', () => {
    const originals = [...new Set(JSON.stringify(core).match(/#[\da-f]{6}/gi))].sort()
    expect(metadata(coreDocument).id).toBe('graphs.palette.palette_core')
    expect(originals).toHaveLength(14)
    expect(paletteRows).toHaveLength(originals.length)
    expect(paletteRows.map(({ original }) => original).sort()).toEqual(originals)
    const retiredColors = retired.map(({ hex }) => hex.toUpperCase())
    for (const row of paletteRows) {
      expect(retiredColors).not.toContain(row.original.toUpperCase())
      expect(retiredColors).not.toContain(row.dark.toUpperCase())
    }
  })

  test('records the adaptation source, date, method and index without changing the original identity', () => {
    const meta = metadata(darkDocument)
    expect(meta.id).toBe('graphs.palette.palette_dark')
    expect(meta.source).toBe('D:/FTEngine/design/Graphs/Palette/PALETTE_CORE.md')
    expect(meta.source_verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(meta.migrated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(meta.adaptation).toBe('dark-glass')
    expect(darkDocument).toContain('WCAG')
    expect(darkDocument).toContain('\n## 暗色适配\n')
    const index = readDocument('design/charts/README.md')
    expect(index).toContain('](PALETTE_CORE.md)')
    expect(index).toContain('](PALETTE_DARK.md)')
    expect(index).toContain(meta.source)
    expect(index).toContain(meta.migrated)
  })

  test.each(paletteRows)('$name maps to $token and reports its composited contrast', (row) => {
    expect(row.dark).toBe(tokenValues.get(row.token))
    expect(row.alpha).toBe(row.token === 'chart.band' ? tokenValues.get('chart.band_alpha') : 1)
    expect(row.alpha).toBeGreaterThan(0)
    expect(row.alpha).toBeLessThanOrEqual(1)
    expect(row.ratio).toBeCloseTo(contrast(row.dark, String(tokenValues.get('chart.contrast_background')), row.alpha), 2)
    expect(row.usage).not.toBe('')
    if (row.token === 'chart.other' || row.token === 'chart.band') {
      expect(row.usage).toContain('有意退后')
      expect(row.usage).toContain('豁免下限')
    }
  })

  test('all semantic aliases keep the original palette role and color order', () => {
    const mappings: [string, string][] = [
      ...core.line.map((hex, i): [string, string] => [`chart.line_${i}`, hex]),
      ...core.cat.map((hex, i): [string, string] => [`chart.cat_${i}`, hex]),
      ...core.ord.map((hex, i): [string, string] => [`chart.ord_${i}`, hex]),
      ...Object.entries(core.region).map(([key, hex]): [string, string] => [`chart.region.${key.toLowerCase()}`, hex]),
      ...(['pos', 'neg', 'other', 'band', 'mean', 'ref', 'model'] as const)
        .map((key): [string, string] => [`chart.${key}`, core[key]]),
    ]
    for (const [token, original] of mappings) {
      const row = paletteRows.find((entry) => entry.original === original)
      expect(row, `${token} original ${original}`).toBeDefined()
      expect(tokenValues.get(token), token).toBe(row!.dark)
    }
  })
})

describe('AC-008-1 docs', () => {
  const uiFiles = [...uiEntries.map(({ file }) => `design/ui/${file}.md`), 'design/ui/UI_DARK_ADDITIONS.md']
  const chartFiles = ['design/charts/PALETTE_CORE.md', 'design/charts/PALETTE_DARK.md']

  test.each([
    { section: '2.3', files: chartFiles },
    { section: '6', files: uiFiles },
    { section: '8', files: [...uiFiles, ...chartFiles] },
  ])('designUI §$section links to concrete migrated entries and existing anchors', ({ section, files }) => {
    const markdown = readDocument('docs/designUI.md')
    const heading = new RegExp(`^#{2,3} ${section.replaceAll('.', '\\.')}\\.? `, 'm')
    const content = markdown.split(heading)[1]?.split(/^## /m)[0]
    expect(content, `designUI §${section}`).toBeDefined()

    const links = [...content!.matchAll(/\]\(\.\.\/(design\/(?:ui|charts)\/[^)#]+\.md)(?:#([^)]*))?\)/g)]
    expect(links.map(link => link[1])).toEqual(expect.arrayContaining(files))
    for (const [, path, anchor] of links) {
      const target = readDocument(path)
      expect(target, path).toMatch(/^# .+$/m)
      if (anchor) expect(target, `${path}#${anchor}`).toContain(`<a id="${anchor}"></a>`)
    }
  })
})
