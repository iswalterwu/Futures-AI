import type { Figure } from '../contracts/types.ts'

export type Tone = 'up' | 'down' | 'neutral'

export interface FormattedNumber {
  text: string
  tone: Tone
}

export function fmtValue(
  value: number | null | undefined,
  { decimals, unit = '' }: { decimals: number; unit?: string },
): FormattedNumber {
  const formatted = formatNumber(value, decimals)
  const suffix = unit ? `${unit === '%' ? '' : ' '}${unit}` : ''
  return {
    text: formatted.text === '–' ? '–' : formatted.text.replace(/^\+/, '') + suffix,
    tone: formatted.tone,
  }
}

export function fmtDelta(
  value: number | null | undefined,
  { decimals, kind = 'abs' }: { decimals: number; kind?: 'abs' | 'pct' },
): FormattedNumber {
  const formatted = formatNumber(value, decimals)
  return {
    text: formatted.text + (kind === 'pct' && formatted.text !== '–' ? '%' : ''),
    tone: formatted.tone,
  }
}

export function figureDeltaDecimals({ decimals, deltaDecimals, deltaKind }: Figure): number {
  return deltaDecimals ?? (deltaKind === 'pct' ? 2 : decimals)
}

function formatNumber(value: number | null | undefined, decimals: number): FormattedNumber {
  if (value == null) return { text: '–', tone: 'neutral' }

  // 用最终显示的符号判方向，让取整后的零同时去号、去色，避免两次舍入不一致。
  const text = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: 'exceptZero',
  }).format(value)
  const tone = text.startsWith('+') ? 'up' : text.startsWith('-') ? 'down' : 'neutral'
  return { text, tone }
}
