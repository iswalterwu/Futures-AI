// @vitest-environment node
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { AgentEventSchema, AgentRunSchema } from '../../src/agent/events.ts'
import { contractSemantics, methodSemantics } from '../../src/contracts/methods.ts'
import { CONTRACT_VERSION, ContractErrorSchema, contractSchemas } from '../../src/contracts/types.ts'

interface SchemaNode {
  [key: string]: unknown
  $ref?: string
  description?: string
  properties?: Record<string, SchemaNode>
}
interface GeneratedContract {
  $schema: string
  'x-contract-version': string
  'x-semantics': Record<string, unknown>
  'x-methods': Record<string, {
    description: string
    params?: SchemaNode
    result?: SchemaNode
    error?: SchemaNode
    callback?: { name: string; description: string; event: SchemaNode }
    returns?: { type: string; description: string }
  }>
  $defs: Record<string, SchemaNode>
}

const frontendRoot = fileURLToPath(new URL('../../', import.meta.url))
const document = readFileSync(new URL('../../contracts/CONTRACT.md', import.meta.url), 'utf8')
const generated = JSON.parse(readFileSync(new URL('../../contracts/schema.json', import.meta.url), 'utf8')) as GeneratedContract
const sourceSchemas = {
  ...contractSchemas,
  ...Object.fromEntries(AgentEventSchema.options.map(schema => [schema.shape.type.value, schema])),
  AgentEvent: AgentEventSchema,
  AgentRun: AgentRunSchema,
}

describe('AC-007-3 doc', () => {
  test('checked-in artifacts exactly match a fresh generation without writing them', () => {
    const output = execFileSync(process.execPath, ['scripts/contract-build.mjs', '--check'], {
      cwd: frontendRoot, encoding: 'utf8',
    })
    expect(output).toContain('12 methods, 10 events, 2 artifacts match')
    expect(document).toContain('Do not edit.')
    expect(document).toContain(`v${CONTRACT_VERSION}`)
    expect(generated['x-contract-version']).toBe(CONTRACT_VERSION)
    expect(generated.$schema).toBe('https://json-schema.org/draft/2020-12/schema')
  })

  test('every generated type and event expands to the JSON Schema of its actual zod definition', () => {
    for (const [name, schema] of Object.entries(sourceSchemas)) {
      expect(generated.$defs[name], name).toBeDefined()
      expect(expandReferences(generated.$defs[name]), name).toEqual(expandReferences(z.toJSONSchema(schema)))
      expect(document, name).toContain(`### \`${name}\``)
    }
  })

  test('all ten data methods and send/subscribe match the method semantic table', () => {
    expect(Object.keys(generated['x-methods'])).toEqual(Object.keys(methodSemantics))
    expect(Object.keys(generated['x-methods'])).toHaveLength(12)
    for (const [name, method] of Object.entries(methodSemantics)) {
      const entry = generated['x-methods'][name]
      expect(document).toContain(`### \`${name}\``)
      expect(document).toContain(method.description)
      expect(entry.description).toBe(method.description)
      if ('params' in method) {
        expect(expandReferences(entry.params), `${name} params`).toEqual(expandReferences(z.toJSONSchema(method.params)))
        expect(expandReferences(entry.result), `${name} result`).toEqual(expandReferences(z.toJSONSchema(method.result)))
        expect(entry.error).toEqual({ $ref: '#/$defs/ErrorResponse' })
      } else {
        expect(entry.callback).toEqual({ ...method.callback, event: { $ref: '#/$defs/AgentEvent' } })
        expect(entry.returns).toEqual(method.returns)
        expect(document).toContain(method.callback.description)
        expect(document).toContain(method.returns.description)
      }
    }
  })

  test('the markdown includes every source field description, optionality and enum values', () => {
    const schemas = [...Object.values(sourceSchemas), ...Object.values(methodSemantics)
      .flatMap(method => 'params' in method ? [method.params, method.result] : [])]
    for (const schema of schemas) {
      visit(z.toJSONSchema(schema), node => {
        if (typeof node.description === 'string') expect(document).toContain(node.description.replaceAll('|', '&#124;').replaceAll('\n', ' '))
        for (const name of Object.keys(node.properties ?? {})) {
          expect(document, `field ${name}`).toMatch(new RegExp('\\| `[^`]*\\.' + name + '` \\|'))
        }
      })
    }
    expect(document).toContain('| `$.delta` | 否 |')
    expect(document).toContain('| `$.deltaDecimals` | 否 |')
    expect(generated.$defs.Figure.properties?.deltaDecimals).toMatchObject({ type: 'integer', minimum: 0 })
    expect(generated.$defs.Figure.required).not.toContain('deltaDecimals')
    expect(document).toContain('| `$.unit` | 是 |')
    expect(document).toContain('| `$.semantic` | 是 |')
    expect(document).toContain('"market" &#124; "analysis"')
  })

  test('documents the exact error envelope, shared run failure details and all five codes', () => {
    expect(document).toContain('{error:{code,message,retryable}}')
    expect(document).toContain('run.failed.error')
    const envelope = expandReferences(generated.$defs.ErrorResponse) as SchemaNode
    const failed = expandReferences(generated.$defs['run.failed']) as SchemaNode
    expect(envelope.properties?.error).toEqual(failed.properties?.error)
    expect(envelope.properties?.error).toEqual(expandReferences(z.toJSONSchema(ContractErrorSchema)))
    for (const code of ContractErrorSchema.shape.code.options) expect(document).toContain(`\`${code}\``)
  })

  test('documents ten event variants, sole terminal, deltas, timestamps and complete-list conventions', () => {
    const eventRefs = generated.$defs.AgentEvent.oneOf as SchemaNode[]
    expect(eventRefs.map(node => node.$ref)).toEqual(AgentEventSchema.options.map(schema => `#/$defs/${schema.shape.type.value}`))
    expect(eventRefs).toHaveLength(10)
    for (const [key, value] of Object.entries(contractSemantics)) {
      if (typeof value === 'string') {
        expect(generated['x-semantics'][key]).toBe(value)
        expect(document).toContain(value)
      }
    }
    expect(document).toContain('恰好一个终态')
    expect(document).toContain('done=false')
    expect(document).toContain('done=true')
    expect(document).toContain('YYYY-MM-DD')
    expect(document).toContain('不分页')
    expect(document).toContain('ISO 8601')
    expect(document).toContain('1.5%')
  })

  test('documents mock selection, injection keys and the real stub for downstream consumers', () => {
    for (const text of ['VITE_DATA_MODE', 'VITE_MOCK_SCENARIO', '?scenario=', '?agentScript=',
      'window.__FAI_MOCK__', 'normal', 'empty', 'error', 'slow', 'boot-error',
      'success', 'failure', 'retry', 'long', '1500ms', 'NotImplementedError', 'afterMs']) {
      expect(document).toContain(text)
    }
    expect(document).toContain('不做深合并')
    expect(document).toContain('取消监听不停止运行')
  })
})

function expandReferences(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(expandReferences)
  if (value === null || typeof value !== 'object') return value
  const node = value as SchemaNode
  if (node.$ref) {
    expect(node.$ref).toMatch(/^#\/\$defs\/[^/]+$/)
    const definition = generated.$defs[node.$ref.slice('#/$defs/'.length)]
    expect(definition, node.$ref).toBeDefined()
    const { $ref, ...siblings } = node
    expect($ref).toBeTruthy()
    return expandReferences({ ...definition, ...siblings })
  }
  return Object.fromEntries(Object.entries(node)
    .filter(([key]) => key !== '$schema' && key !== '$id')
    .map(([key, child]) => [key, expandReferences(child)]))
}

function visit(value: unknown, callback: (node: SchemaNode) => void): void {
  if (Array.isArray(value)) {
    value.forEach(child => visit(child, callback))
  } else if (value !== null && typeof value === 'object') {
    const node = value as SchemaNode
    callback(node)
    Object.values(node).forEach(child => visit(child, callback))
  }
}
