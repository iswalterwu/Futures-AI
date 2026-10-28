'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawn } = require('node:child_process')

async function run(t, fixture, args = [], env = {}) {
  const child = spawn(process.execPath, [path.resolve(__dirname, '../../check.js'), ...args], {
    env: { ...process.env, ...env, FAI_CHECK_E2E_DIR: path.resolve(__dirname, '../fixtures/runner', fixture) },
    windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  })
  let out = ''
  child.stdout.on('data', data => { out += data }); child.stderr.on('data', data => { out += data })
  let timer
  try {
    const code = await Promise.race([
      new Promise((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) }),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('runner subprocess timeout')), 15000) }),
    ])
    return { code, out }
  } finally {
    clearTimeout(timer)
    if (child.exitCode === null) {
      const exited = new Promise(resolve => child.once('exit', resolve))
      child.kill(); await exited
    }
    assert.throws(() => process.kill(child.pid, 0), { code: 'ESRCH' })
    // Also verify cleanup after FAIL, not only success.
    for (const match of out.matchAll(/^TEMP (.+)$/gm)) assert.equal(fs.existsSync(JSON.parse(match[1])), false)
  }
}
test('runner：未知场景退出码 2 且未运行场景', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fai-runner-marker-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const marker = path.join(dir, 'marker')
  const result = await run(t, 'unknown-marker', ['marker', 'unknown'], { FAI_RUNNER_MARKER: marker })
  assert.equal(result.code, 2); assert.equal(fs.existsSync(marker), false)
  assert.doesNotMatch(result.out, /^TEMP /m)
  const positive = await run(t, 'unknown-marker', ['marker'], { FAI_RUNNER_MARKER: marker })
  assert.equal(positive.code, 0); assert.equal(fs.readFileSync(marker, 'utf8'), 'ran')
})
test('runner：登记表不一致退出码 2', async t => {
  assert.equal((await run(t, 'mismatch')).code, 2)
})
test('runner：零断言判 FAIL', async t => {
  const result = await run(t, 'zero-assert')
  assert.equal(result.code, 1); assert.match(result.out, /FAIL .*zero assertions/)
})
test('runner：缺外部工具判 FAIL', async t => {
  const result = await run(t, 'missing-tool')
  assert.equal(result.code, 1); assert.match(result.out, /missing external tool/)
  assert.doesNotMatch(result.out, /must not execute/)
})
test('runner：缺夹具判 FAIL', async t => {
  const result = await run(t, 'missing-tool', [], { FAI_RUNNER_CASE: 'missing-file' })
  assert.equal(result.code, 1); assert.match(result.out, /missing fixture/)
})
test('runner：断言 API 无布尔断言', async t => {
  const result = await run(t, 'ok')
  assert.equal(result.code, 0); assert.match(result.out, /PASS ok › 无布尔断言/)
  const invalid = await run(t, 'ok', [], { FAI_RUNNER_CASE: 'arity' })
  assert.equal(invalid.code, 1); assert.match(invalid.out, /requires name, actual, expected/)
})
test('runner：两条断言通过退出码 0', async t => {
  const result = await run(t, 'ok')
  assert.equal(result.code, 0)
  assert.match(result.out, /PASS ok › 显式期望值/)
  assert.match(result.out, /SUMMARY 3\/3 assertions; 1 scenes; failures=0/) // 2 scene + 1 cleanup
})
test('runner：临时目录已清理', async t => {
  const result = await run(t, 'ok')
  assert.equal(result.code, 0)
  const root = JSON.parse(result.out.match(/^TEMP (.+)$/m)[1])
  assert.equal(fs.existsSync(root), false)
})
test('runner：临时目录外路径被拒', async t => {
  const result = await run(t, 'ok', [], { FAI_RUNNER_CASE: 'outside' })
  assert.equal(result.code, 1); assert.match(result.out, /isolation path outside owned temp root/)
})
