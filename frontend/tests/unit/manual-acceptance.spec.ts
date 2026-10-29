// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import packageJson from '../../package.json'

const manual = readFileSync(new URL('../../../specs/frontend-workbench/manual-acceptance.md', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
const sections = manual.split(/^## (?=M-\d{2}\b)/m).slice(1)
const items = [
  { id: 'M-01', title: '玻璃层次', ac: 'AC-001-3' },
  { id: 'M-02', title: '字族与双语', ac: 'AC-001-4' },
  { id: 'M-03', title: '焦点带两段', ac: 'AC-003-5' },
  { id: 'M-04', title: '模块壳与形态', ac: 'AC-004-5' },
  { id: 'M-05', title: '抽屉与时间线', ac: 'AC-005-2' },
  { id: 'M-06', title: '窄窗口', ac: 'AC-002-6' },
  { id: 'M-07', title: 'ticker', ac: 'AC-002-4' },
  { id: 'M-08', title: '图表主题', ac: 'AC-006-4' },
  { id: 'M-09', title: '九项导航', ac: 'AC-002-2' },
  { id: 'M-10', title: '作业轨道', ac: 'AC-003-7' },
  { id: 'M-11', title: '全局投放', ac: 'AC-002-8' },
  { id: 'M-12', title: '对话作业上下文', ac: 'AC-005-8' },
]

test('AC-009-1 test chains every automated check in order and stops on failure', () => {
  expect(packageJson.scripts.test.split(/\s*&&\s*/)).toEqual([
    'pnpm check',
    'pnpm typecheck',
    'pnpm lint',
    'pnpm test:unit',
    'pnpm test:e2e',
  ])
})

describe('AC-009-2 v2-manual acceptance', () => {
  test('contains exactly M-01 through M-12 in order', () => {
    expect(sections.map(section => section.split('\n')[0])).toEqual(
      items.map(({ id, title }) => `${id} ${title}`),
    )
    expect(manual).toContain('Handoff')
  })

  test.each(items)('$id $title has actionable visual checks and a handoff evidence slot', ({ id, title, ac }) => {
    const matches = sections.filter(section => section.startsWith(`${id} ${title}\n`))
    expect(matches).toHaveLength(1)
    const section = matches[0]
    expect(section).toContain(ac)
    for (const label of ['操作', '看什么', '截图证据']) {
      const field = section.match(new RegExp(`^- ${label}：(.+)$`, 'm'))
      expect(field, `${id} ${label}`).not.toBeNull()
      expect(field![1].trim(), `${id} ${label}`).not.toBe('')
    }
    expect(section).toMatch(/^- \[[ x]\] 人工验收通过/m)
  })
})
