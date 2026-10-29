import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import {
  ArtifactStatusLabel, ArtifactStatusSchema, JobStatusLabel, JobStatusSchema,
  OriginLabel, SourceLabel, SourceSchema, UploadStatusLabel, UploadStatusSchema,
} from '../../../src/contracts/types.ts'
import JobStatusBadge from '../../../src/jobs/components/JobStatusBadge.vue'
import ArtifactStatusBadge from '../../../src/jobs/components/ArtifactStatusBadge.vue'
import SourceBadge from '../../../src/jobs/components/SourceBadge.vue'
import jobSource from '../../../src/jobs/components/JobStatusBadge.vue?raw'
import artifactSource from '../../../src/jobs/components/ArtifactStatusBadge.vue?raw'
import sourceSource from '../../../src/jobs/components/SourceBadge.vue?raw'

enableAutoUnmount(afterEach)

describe('WI status badges — AC-001-5 component / AC-003-6 / AC-006-8 partial', () => {
  test.each(JobStatusSchema.options)('job %s renders contract text and icon without color cues', status => {
    const wrapper = mount(JobStatusBadge, { props: { status } })
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe(JobStatusLabel[status].icon)
    expect(wrapper.element.children[1].textContent).toBe(JobStatusLabel[status].text)
    // Strip the real component's styling hooks; the evidence is actual DOM text, not CSS content.
    for (const node of [wrapper.element, ...wrapper.element.querySelectorAll('*')]) {
      for (const attr of node.getAttributeNames()) {
        if (attr === 'class' || attr === 'style' || attr.startsWith('data-v-')) node.removeAttribute(attr)
      }
    }
    expect(wrapper.text()).toContain(JobStatusLabel[status].text)
    expect(wrapper.text()).toContain(JobStatusLabel[status].icon)
  })

  test.each(ArtifactStatusSchema.options)('artifact %s renders contract text and icon', status => {
    const wrapper = mount(ArtifactStatusBadge, { props: { status } })
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe(ArtifactStatusLabel[status].icon)
    expect(wrapper.element.children[1].textContent).toBe(ArtifactStatusLabel[status].text)
  })

  test.each(UploadStatusSchema.options)('upload %s uses the same component with upload labels', status => {
    const wrapper = mount(ArtifactStatusBadge, { props: { status } })
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe(UploadStatusLabel[status].icon)
    expect(wrapper.element.children[1].textContent).toBe(UploadStatusLabel[status].text)
  })

  test('all 9 / 4 / 3 visible labels remain distinguishable without any styles', () => {
    const jobs = JobStatusSchema.options.map(status => mount(JobStatusBadge, { props: { status } }).text())
    const artifacts = ArtifactStatusSchema.options.map(status => mount(ArtifactStatusBadge, { props: { status } }).text())
    const uploads = UploadStatusSchema.options.map(status => mount(ArtifactStatusBadge, { props: { status } }).text())
    // text() excludes color, classes and other styling; each state still has a unique visible label.
    expect(new Set(jobs).size).toBe(9)
    expect(new Set(artifacts).size).toBe(4)
    expect(new Set(uploads).size).toBe(3)
  })

  test('prop changes update labels across status families', async () => {
    const job = mount(JobStatusBadge, { props: { status: 'draft' } })
    await job.setProps({ status: 'needs_human' })
    expect(job.text()).toContain(JobStatusLabel.needs_human.text)
    expect(job.text()).not.toContain(JobStatusLabel.draft.text)
    const artifact = mount(ArtifactStatusBadge, { props: { status: 'provisional' } })
    await artifact.setProps({ status: 'quarantined' })
    expect(artifact.text()).toContain(UploadStatusLabel.quarantined.text)
    expect(artifact.text()).not.toContain(ArtifactStatusLabel.provisional.text)
  })
})

describe('WI source badge — AC-005-1 / AC-006-8 partial / S-17', () => {
  test.each(SourceSchema.options)('derived %s keeps source as secondary text', source => {
    const wrapper = mount(SourceBadge, { props: { origin: 'derived', source } })
    expect(wrapper.element.children[1].textContent).toBe(OriginLabel.derived.text)
    expect(wrapper.text()).toContain('内部生成')
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe(OriginLabel.derived.icon)
    expect(wrapper.get('.source-secondary').text()).toBe(`· ${SourceLabel[source].text}`)
  })

  test.each(SourceSchema.options)('source %s uses SourceLabel without the derived marker', source => {
    const wrapper = mount(SourceBadge, { props: { origin: 'source', source } })
    expect(wrapper.element.children[1].textContent).toBe(SourceLabel[source].text)
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe(SourceLabel[source].icon)
    expect(wrapper.text()).not.toContain(OriginLabel.derived.text)
    expect(wrapper.find('.source-secondary').exists()).toBe(false)
  })

  test('updates origin and source without retaining a stale internal marker', async () => {
    const wrapper = mount(SourceBadge, { props: { origin: 'derived', source: 'agent' } })
    await wrapper.setProps({ origin: 'source', source: 'external' })
    expect(wrapper.text()).toContain(SourceLabel.external.text)
    expect(wrapper.text()).not.toContain(OriginLabel.derived.text)
    expect(wrapper.text()).not.toContain(SourceLabel.agent.text)
    expect(wrapper.find('.source-secondary').exists()).toBe(false)
  })
})

describe('WI badge tone — R2-C / AC-001-5 partial', () => {
  function styleRules(source: string) {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(source.split('<style scoped>')[1]!.split('</style>')[0]!)
    return Array.from(sheet.cssRules).filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
  }

  function styleRule(source: string, selector: string) {
    return styleRules(source).find(rule => rule.selectorText.split(',').some(part => part.trim() === selector))?.style
  }

  test.each([
    ['draft', null], ['collecting', 'ok'], ['processing', 'ok'], ['analyzing', 'ok'],
    ['delivering', 'ok'], ['delivered', 'ok'], ['needs_human', 'warn'], ['failed', 'bad'], ['cancelled', null],
  ] as const)('job %s exposes its status and the specified border tone', (status, tone) => {
    const wrapper = mount(JobStatusBadge, { props: { status } })
    expect(wrapper.attributes('data-status')).toBe(status)
    const style = styleRule(jobSource, `.job-status-badge[data-status='${status}']`)
    if (tone === null) expect(style).toBeUndefined()
    else expect(style?.getPropertyValue('border-color')).toBe(`var(--fai-status-${tone})`)
  })

  test.each([
    ['draft', null], ['provisional', 'warn'], ['confirmed', 'ok'], ['conflict', 'bad'],
    ['pending_validation', 'warn'], ['ingested', 'ok'], ['quarantined', 'bad'],
  ] as const)('artifact/upload %s exposes its status and the specified border tone', (status, tone) => {
    const wrapper = mount(ArtifactStatusBadge, { props: { status } })
    expect(wrapper.attributes('data-status')).toBe(status)
    const style = styleRule(artifactSource, `.artifact-status-badge[data-status='${status}']`)
    if (tone === null) expect(style).toBeUndefined()
    else expect(style?.getPropertyValue('border-color')).toBe(`var(--fai-status-${tone})`)
  })

  test.each(SourceSchema.options)('source %s has no status attribute for either origin', source => {
    for (const origin of ['source', 'derived'] as const) {
      expect(mount(SourceBadge, { props: { source, origin } }).attributes('data-status')).toBeUndefined()
    }
  })

  test('all bases are neutral; status/red tokens never color text and sample is unused', () => {
    for (const [source, selector] of [
      [jobSource, '.job-status-badge'], [artifactSource, '.artifact-status-badge'], [sourceSource, '.source-badge'],
    ] as const) {
      // happy-dom expands var() in border shorthands; inspect the parsed color and real declaration.
      expect(styleRule(source, selector)?.getPropertyValue('border-color')).toBe('var(--fai-glass-module-border)')
      expect(source.split(`${selector} {`)[1]!.split('}')[0]).toContain('border: thin solid var(--fai-glass-module-border);')
      expect(source).not.toContain('--fai-status-sample')
      for (const rule of styleRules(source)) {
        expect(rule.style.getPropertyValue('color')).not.toMatch(/--fai-status-|--fai-accent-red/)
      }
    }
    expect(sourceSource).not.toContain('--fai-status-')
  })
})
