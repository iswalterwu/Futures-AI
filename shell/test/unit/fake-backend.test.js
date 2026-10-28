'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const crypto = require('node:crypto')
const { spawn, spawnSync } = require('node:child_process')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function fixture(t, mode = 'ok', flags = []) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fai-fake-backend-'))
  const file = path.join(root, 'host.json'), token = crypto.randomBytes(16).toString('hex')
  const child = spawn('python', [path.resolve(__dirname, '../fixtures/fake_backend.py'), '--mode', mode,
    '--root', path.join(root, 'data-root'), '--port-file', file, '--token', token, ...flags], {
    env: { ...process.env, FAI_FAKE_REGISTRY: root, PYTHONDONTWRITEBYTECODE: '1', PYTHONIOENCODING: 'utf-8' },
    stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true,
  })
  let output = '', ended = false, exitCode, spawnError
  child.stdout.on('data', data => { output += data }); child.stderr.on('data', data => { output += data })
  child.once('exit', code => { ended = true; exitCode = code })
  child.once('error', error => { spawnError = error; ended = true })
  async function wait(fn, timeout = 5000) {
    const until = Date.now() + timeout
    while (Date.now() < until) {
      if (spawnError) throw spawnError
      const result = fn()
      if (result) return result
      await delay(25)
    }
    throw new Error('fake backend condition timeout')
  }
  t.after(async () => {
    try {
      if (!ended) {
        child.stdin.end()
        const until = Date.now() + 1000
        while (!ended && Date.now() < until) await delay(25)
        if (!ended) {
          const result = spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, timeout: 5000 })
          assert.equal(result.status, 0)
          await wait(() => ended)
        }
      }
      assert.throws(() => process.kill(child.pid, 0), { code: 'ESRCH' })
    } finally { fs.rmSync(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }) }
  })
  return { child, root, file, token, output: () => output,
    endpoint: () => wait(() => {
      try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch (error) {
        if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
        return false
      }
    }),
    exit: async () => { await wait(() => ended); return exitCode },
  }
}
async function request(f, endpoint, method = 'GET', token = f.token) {
  const { port } = await f.endpoint()
  const response = await fetch(`http://127.0.0.1:${port}${endpoint}`, {
    method, headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(3000),
  })
  return { status: response.status, body: await response.json() }
}
test('fake-backend：ok 就绪', async t => {
  const f = await fixture(t, 'ok', ['--exit-on-stdin-eof'])
  const endpoint = await f.endpoint()
  assert.equal(endpoint.token, f.token); assert.equal(Number.isInteger(endpoint.port), true)
  assert.deepEqual(await request(f, '/health'), { status: 200, body: { status: 'ok', data_ready: true, version: 'fixture' } })
  assert.deepEqual((await request(f, '/settings/profile')).body, { onboarding: { completed: true, skipped: false } })
  assert.equal((await request(f, '/shutdown', 'POST', 'wrong')).status, 401)
  assert.deepEqual(await request(f, '/shutdown', 'POST'), { status: 200, body: { status: 'shutting_down' } })
  assert.equal(await f.exit(), 0); assert.equal(fs.existsSync(f.file), false)
})
test('fake-backend：health-fail 503', async t => {
  const f = await fixture(t, 'health-fail', ['--exit-on-stdin-eof'])
  for (let n = 0; n < 2; n++) assert.deepEqual(await request(f, '/health'), {
    status: 503, body: { status: 'unavailable', data_ready: false, version: 'fixture' },
  })
})
test('fake-backend：startup-failed 退出码 3 + 标记', async t => {
  for (const code of ['data_root_locked', 'disk_full']) {
    const f = await fixture(t, `startup-failed:${code}`)
    assert.equal(await f.exit(), 3)
    const lines = f.output().trim().split('\n')
    assert.equal(lines.length, 1); assert.match(lines[0], /^FAI_HOST /)
    const marker = JSON.parse(lines[0].slice(9))
    assert.equal(marker.event, 'startup_failed'); assert.equal(marker.code, code)
    assert.equal(marker.path, path.join(f.root, 'data-root'))
    assert.equal(fs.existsSync(f.file), false)
  }
})
test('fake-backend：stdin EOF 退出', async t => {
  const f = await fixture(t, 'ok', ['--exit-on-stdin-eof'])
  await f.endpoint(); f.child.stdin.end()
  assert.equal(await f.exit(), 0)
  assert.equal(fs.existsSync(f.file), false)
})
test('fake-backend：spawns.jsonl 登记', async t => {
  const f = await fixture(t, 'ok', ['--exit-on-stdin-eof'])
  await f.endpoint()
  const entries = fs.readFileSync(path.join(f.root, 'spawns.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  assert.equal(entries.length, 1); assert.equal(entries[0].pid, f.child.pid)
  assert.equal(typeof entries[0].time, 'number')
  assert.doesNotMatch(f.output(), new RegExp(f.token))
})
test('fake-backend：slow-ready / hang / exit-before-ready / crash-after-ready 协议模式', async t => {
  const slow = await fixture(t, 'slow-ready:300', ['--exit-on-stdin-eof', '--onboarded', '0'])
  const start = Date.now()
  await slow.endpoint(); assert.equal(Date.now() - start >= 250, true)
  assert.equal((await request(slow, '/settings/profile')).body.onboarding.completed, false)
  const hang = await fixture(t, 'hang', ['--exit-on-stdin-eof'])
  await delay(150); assert.equal(fs.existsSync(hang.file), false)
  hang.child.stdin.end(); assert.equal(await hang.exit(), 0)
  const early = await fixture(t, 'exit-before-ready')
  assert.equal(await early.exit(), 1); assert.equal(fs.existsSync(early.file), false)
  const crash = await fixture(t, 'crash-after-ready:300', ['--exit-on-stdin-eof'])
  assert.equal((await request(crash, '/health')).status, 200)
  assert.equal(await crash.exit(), 1)
})
