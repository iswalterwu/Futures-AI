import { describe, expect, test } from 'vitest'
import { diffLines } from '../../../src/jobs/diff.ts'

describe('WI lcs — AC-006-5 partial', () => {
  test('reports unchanged lines, insertion and deletion in document order', () => {
    expect(diffLines('开头\n旧段\n保留\n结尾', '开头\n保留\n新段\n结尾')).toEqual({
      kind: 'lines',
      lines: [
        { kind: 'equal', text: '开头' },
        { kind: 'remove', text: '旧段' },
        { kind: 'equal', text: '保留' },
        { kind: 'add', text: '新段' },
        { kind: 'equal', text: '结尾' },
      ],
    })
  })

  test('empty string is zero lines on either side', () => {
    expect(diffLines('', '')).toEqual({ kind: 'lines', lines: [] })
    expect(diffLines('', 'a\nb')).toEqual({ kind: 'lines', lines: [
      { kind: 'add', text: 'a' }, { kind: 'add', text: 'b' },
    ] })
    expect(diffLines('a\nb', '')).toEqual({ kind: 'lines', lines: [
      { kind: 'remove', text: 'a' }, { kind: 'remove', text: 'b' },
    ] })
  })

  test('identical text preserves blank lines and whitespace', () => {
    expect(diffLines('a\n\n b ', 'a\n\n b ')).toEqual({ kind: 'lines', lines: [
      { kind: 'equal', text: 'a' }, { kind: 'equal', text: '' }, { kind: 'equal', text: ' b ' },
    ] })
  })

  test('repeated lines use a longest subsequence rather than greedy alignment', () => {
    expect(diffLines('a\nb\na\nc', 'a\na\nb\nc')).toEqual({ kind: 'lines', lines: [
      { kind: 'equal', text: 'a' },
      { kind: 'remove', text: 'b' },
      { kind: 'equal', text: 'a' },
      { kind: 'add', text: 'b' },
      { kind: 'equal', text: 'c' },
    ] })
    expect(diffLines('a\nb\nc', 'b\nc\na')).toEqual({ kind: 'lines', lines: [
      { kind: 'remove', text: 'a' },
      { kind: 'equal', text: 'b' },
      { kind: 'equal', text: 'c' },
      { kind: 'add', text: 'a' },
    ] })
  })

  test('no common lines remove the old text before adding its replacement', () => {
    expect(diffLines('a\nb', 'c\nd')).toEqual({ kind: 'lines', lines: [
      { kind: 'remove', text: 'a' }, { kind: 'remove', text: 'b' },
      { kind: 'add', text: 'c' }, { kind: 'add', text: 'd' },
    ] })
  })

  test('splits only on newline, including trailing empty lines and carriage returns', () => {
    expect(diffLines('a', 'a\n')).toEqual({ kind: 'lines', lines: [
      { kind: 'equal', text: 'a' }, { kind: 'add', text: '' },
    ] })
    expect(diffLines('\n', '')).toEqual({ kind: 'lines', lines: [
      { kind: 'remove', text: '' }, { kind: 'remove', text: '' },
    ] })
    expect(diffLines('a\r\nb', 'a\nb')).toEqual({ kind: 'lines', lines: [
      { kind: 'remove', text: 'a\r' }, { kind: 'add', text: 'a' }, { kind: 'equal', text: 'b' },
    ] })
  })
})

describe('WI limit — AC-006-5 partial', () => {
  test('exactly 2000 lines on both sides still returns line results', () => {
    const text = Array(2000).fill('same').join('\n')
    const result = diffLines(text, text)
    expect(result.kind).toBe('lines')
    if (result.kind !== 'lines') throw new Error('Expected line results at the inclusive limit')
    expect(result.lines).toHaveLength(2000)
    expect(result.lines.every(line => line.kind === 'equal' && line.text === 'same')).toBe(true)
  })

  test.each([
    [2001, 1], [1, 2001], [2001, 2001], [2001, 0], [0, 2001],
  ])('%i old / %i new lines returns only counts, not a truncated line diff', (before, after) => {
    const result = diffLines(Array(before).fill('old').join('\n'), Array(after).fill('new').join('\n'))
    expect(result).toEqual({ kind: 'summary', beforeLineCount: before, afterLineCount: after })
    expect(result).not.toHaveProperty('lines')
  })

  test('trailing newline counts as the 2001st line', () => {
    const text = Array(2000).fill('a').join('\n')
    expect(diffLines(text, `${text}\n`)).toEqual({
      kind: 'summary', beforeLineCount: 2000, afterLineCount: 2001,
    })
  })
})
