import { describe, expect, test } from 'vitest'
import { fmtDelta, fmtValue } from '../../src/shared/format.ts'

describe('AC-001-4 format', () => {
  test.each([null, undefined])('renders missing %s as a neutral en dash without a unit', (value) => {
    expect(fmtValue(value, { decimals: 2, unit: '元/吨' })).toEqual({ text: '–', tone: 'neutral' })
    expect(fmtDelta(value, { decimals: 2, kind: 'abs' })).toEqual({ text: '–', tone: 'neutral' })
    expect(fmtDelta(value, { decimals: 2, kind: 'pct' })).toEqual({ text: '–', tone: 'neutral' })
  })

  test.each([
    { value: 12345.678, decimals: 2, text: '12,345.68', tone: 'up' },
    { value: -12345.678, decimals: 2, text: '-12,345.68', tone: 'down' },
    { value: 999.999, decimals: 2, text: '1,000.00', tone: 'up' },
    { value: -999.999, decimals: 2, text: '-1,000.00', tone: 'down' },
    { value: 1.005, decimals: 2, text: '1.01', tone: 'up' },
    { value: -1.005, decimals: 2, text: '-1.01', tone: 'down' },
    { value: 12, decimals: 0, text: '12', tone: 'up' },
    { value: 12, decimals: 3, text: '12.000', tone: 'up' },
  ])('formats value $value with $decimals decimal places and grouping', ({ value, decimals, text, tone }) => {
    expect(fmtValue(value, { decimals })).toEqual({ text, tone })
  })

  test('appends units without converting percentage values', () => {
    expect(fmtValue(1234.5, { decimals: 2, unit: '元/吨' })).toEqual({ text: '1,234.50 元/吨', tone: 'up' })
    expect(fmtValue(1.5, { decimals: 2, unit: '%' })).toEqual({ text: '1.50%', tone: 'up' })
    expect(fmtValue(0, { decimals: 1, unit: '%' })).toEqual({ text: '0.0%', tone: 'neutral' })
  })

  test.each([
    { value: 1234.56, decimals: 1, text: '+1,234.6', tone: 'up' },
    { value: -1234.56, decimals: 1, text: '-1,234.6', tone: 'down' },
    { value: 0.5, decimals: 0, text: '+1', tone: 'up' },
    { value: -0.5, decimals: 0, text: '-1', tone: 'down' },
    { value: 0.005, decimals: 2, text: '+0.01', tone: 'up' },
    { value: -0.005, decimals: 2, text: '-0.01', tone: 'down' },
    { value: 1.005, decimals: 2, text: '+1.01', tone: 'up' },
    { value: -1.005, decimals: 2, text: '-1.01', tone: 'down' },
  ])('signs a nonzero delta $value after rounding to $decimals places', ({ value, decimals, text, tone }) => {
    expect(fmtDelta(value, { decimals })).toEqual({ text, tone })
    expect(fmtDelta(value, { decimals, kind: 'abs' })).toEqual({ text, tone })
  })

  test.each([
    { value: 0, decimals: 0, text: '0' },
    { value: -0, decimals: 0, text: '0' },
    { value: 0, decimals: 2, text: '0.00' },
    { value: -0, decimals: 2, text: '0.00' },
    { value: 0.49, decimals: 0, text: '0' },
    { value: -0.49, decimals: 0, text: '0' },
    { value: 0.049, decimals: 1, text: '0.0' },
    { value: -0.049, decimals: 1, text: '0.0' },
    { value: 0.0049, decimals: 2, text: '0.00' },
    { value: -0.0049, decimals: 2, text: '0.00' },
    { value: 0.00049, decimals: 3, text: '0.000' },
    { value: -0.00049, decimals: 3, text: '0.000' },
  ])('keeps displayed zero $value at $decimals places neutral and unsigned', ({ value, decimals, text }) => {
    expect(fmtValue(value, { decimals })).toEqual({ text, tone: 'neutral' })
    expect(fmtDelta(value, { decimals })).toEqual({ text, tone: 'neutral' })
    expect(fmtDelta(value, { decimals, kind: 'pct' })).toEqual({ text: `${text}%`, tone: 'neutral' })
  })

  test.each([
    { value: 1.5, text: '+1.50%', tone: 'up' },
    { value: -1.5, text: '-1.50%', tone: 'down' },
    { value: 0.015, text: '+0.02%', tone: 'up' },
    { value: -0.015, text: '-0.02%', tone: 'down' },
  ])('treats pct delta $value as a percentage value, not a ratio', ({ value, text, tone }) => {
    expect(fmtDelta(value, { decimals: 2, kind: 'pct' })).toEqual({ text, tone })
  })
})
