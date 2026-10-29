export type DiffLine = { kind: 'equal' | 'add' | 'remove'; text: string }
export type LineDiffResult =
  | { kind: 'lines'; lines: DiffLine[] }
  | { kind: 'summary'; beforeLineCount: number; afterLineCount: number }

const MAX_DIFF_LINES = 2000

/** Line LCS; ties remove the old line first, so repeated-line output is deterministic. */
export function diffLines(before: string, after: string): LineDiffResult {
  const oldLines = before === '' ? [] : before.split('\n')
  const newLines = after === '' ? [] : after.split('\n')
  if (oldLines.length > MAX_DIFF_LINES || newLines.length > MAX_DIFF_LINES) {
    return { kind: 'summary', beforeLineCount: oldLines.length, afterLineCount: newLines.length }
  }
  return { kind: 'lines', lines: lcsLines(oldLines, newLines) }
}

function lcsLines(before: string[], after: string[]): DiffLine[] {
  // Each cell is the LCS length for the two suffixes. The 2000-line bound fits Uint16.
  const lengths = Array.from({ length: before.length + 1 }, () => new Uint16Array(after.length + 1))
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      lengths[i][j] = before[i] === after[j]
        ? lengths[i + 1][j + 1] + 1
        : Math.max(lengths[i + 1][j], lengths[i][j + 1])
    }
  }

  const lines: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) {
      lines.push({ kind: 'equal', text: before[i] })
      i++
      j++
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      lines.push({ kind: 'remove', text: before[i++] })
    } else {
      lines.push({ kind: 'add', text: after[j++] })
    }
  }
  while (i < before.length) lines.push({ kind: 'remove', text: before[i++] })
  while (j < after.length) lines.push({ kind: 'add', text: after[j++] })
  return lines
}
