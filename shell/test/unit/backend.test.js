'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const { PassThrough } = require('node:stream')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { Backend } = require('../../src/backend')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function until(fn, ms = 6000) {
  const deadline = Date.now() + ms
  while (Date.now() < deadline) { if (fn()) return; await delay(10) }
  assert.fail('machine condition timeout')
}
function fixture(t, { health = { status: 200, body: { status: 'ok', data_ready: true } }, timeoutMs = 1500, missing = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fai-machine-'))
  const children = [], calls = [], kills = []
  let maxLive = 0
  const close = (child, code = 0) => {
    if (child.exitCode !== null) return
    child.exitCode = code
    child.emit('exit', code, null)
    child.emit('close', code, null)
  }
  const machine = new Backend({ root, portFile: path.join(root, 'run', 'host.json'),
    command: () => ({ cmd: 'fixture', args: [], env: {} }), timeoutMs }, {
    spawn(cmd, args, options) {
      if (cmd === 'taskkill') {
        const killer = new EventEmitter()
        const child = children.find(c => c.pid === Number(args[1]))
        kills.push(child.pid)
        setImmediate(() => { close(child); killer.emit('close', 0) })
        return killer
      }
      calls.push({ args, options, at: Date.now() })
      const child = new EventEmitter()
      Object.assign(child, { pid: 7000 + children.length, exitCode: null,
        stdout: new PassThrough(), stderr: new PassThrough(), stdin: new PassThrough() })
      child.stdin.on('finish', () => close(child))
      child.kill = () => { kills.push(child.pid); close(child) }
      children.push(child)
      maxLive = Math.max(maxLive, children.filter(c => c.exitCode === null).length)
      if (missing) setImmediate(() => { child.emit('error', Object.assign(new Error('missing'), { code: 'ENOENT' })); close(child, -4058) })
      else fs.writeFileSync(args[args.indexOf('--port-file') + 1], JSON.stringify({ port: 24000 + children.length }))
      return child
    },
    async http(port, token, method) {
      if (method === 'POST') { close(children[port - 24001]); return { status: 200, body: {} } }
      return health
    },
  })
  t.after(async () => { await machine.stop(); assert.equal(children.filter(c => c.exitCode === null).length, 0); fs.rmSync(root, { recursive: true, force: true }) })
  return { machine, children, calls, kills, close, maxLive: () => maxLive }
}
test('就绪需 200+ok+data_ready', async t => {
  for (const bad of [{ status: 503, body: { status: 'ok', data_ready: true } },
    { status: 200, body: { status: 'unavailable', data_ready: true } },
    { status: 200, body: { status: 'ok', data_ready: 1 } }]) {
    const f = fixture(t, { health: bad, timeoutMs: 80 }); f.machine.start()
    await until(() => f.machine.phase === 'failed')
    assert.equal(f.machine.phases.includes('ready'), false)
  }
  const f = fixture(t); f.machine.start(); await until(() => f.machine.phase === 'ready')
  assert.equal(f.machine.getBackend().port, 24001)
  assert.deepEqual(f.calls[0].options.stdio, ['pipe', 'pipe', 'pipe'])
  assert.equal(f.calls[0].args.includes('--exit-on-stdin-eof'), true)
})
test('端点文件存在但 health 503 不就绪', async t => {
  const f = fixture(t, { health: { status: 503, body: { status: 'unavailable', data_ready: false } }, timeoutMs: 100 })
  f.machine.start(); assert.equal(fs.existsSync(f.machine.portFile), true)
  await until(() => f.machine.phase === 'failed')
  assert.equal(f.machine.getBackend(), null)
  assert.equal(f.machine.phases.includes('ready'), false)
})
test('预算 3 次后 restart_limit 且就绪不清零', async t => {
  const f = fixture(t); f.machine.start()
  for (let n = 0; n < 4; n++) {
    await until(() => f.machine.phase === 'ready')
    assert.equal(f.machine.restarts, n)
    f.close(f.children[n], 1)
  }
  assert.equal(f.machine.lastCode, 'restart_limit')
  assert.equal(f.calls.length, 4)
  assert.equal(f.maxLive(), 1)
  for (let n = 1; n < 4; n++) assert.ok(f.calls[n].at - f.calls[n - 1].at >= n * 500 - 5)
})
test('retry 清零预算', async t => {
  const f = fixture(t); f.machine.start(); await until(() => f.machine.phase === 'ready')
  f.close(f.children[0], 1); assert.equal(f.machine.restarts, 1)
  await Promise.all([f.machine.retry(), f.machine.retry()])
  await until(() => f.machine.phase === 'ready')
  await delay(550)
  assert.equal(f.machine.restarts, 0); assert.equal(f.machine.gen, 2)
  assert.equal(f.calls.length, 2); assert.equal(f.maxLive(), 1)
})
test('旧代际事件被忽略', async t => {
  const f = fixture(t); f.machine.start(); await until(() => f.machine.phase === 'ready')
  const old = f.children[0], token = f.machine.getBackend().token
  await f.machine.retry(); await until(() => f.machine.phase === 'ready')
  old.emit('error', new Error('late')); old.emit('exit', 1); old.emit('close', 3)
  old.stdout.write('FAI_HOST {"event":"startup_failed","code":"disk_full"}\n')
  assert.equal(f.machine.phase, 'ready'); assert.equal(f.machine.lastCode, null)
  assert.equal(f.machine.getBackend().port, 24002)
  assert.notEqual(f.machine.getBackend().token, token)
  assert.equal(f.maxLive(), 1)
})
test('超时先 kill 再 failed(health_timeout)', async t => {
  const f = fixture(t, { health: { status: 503, body: {} }, timeoutMs: 80 })
  const observed = []
  f.machine.on('status', status => { if (status.phase === 'failed') observed.push(f.children[0].exitCode) })
  f.machine.start(); await until(() => f.machine.phase === 'failed')
  assert.deepEqual(f.kills, [7000]); assert.deepEqual(observed, [0])
  assert.equal(f.machine.lastCode, 'health_timeout')
})
test('退出码 3 + 标记 → failed(code) 不重启', async t => {
  const f = fixture(t, { health: { status: 503, body: {} } }); f.machine.start()
  f.children[0].stdout.write('FAI_HOST {"event":"startup_')
  f.children[0].stdout.write('failed","code":"disk_full","path":"root","detail":"fixture"}\n')
  f.close(f.children[0], 3); await delay(550)
  assert.equal(f.machine.phase, 'failed'); assert.equal(f.machine.lastCode, 'disk_full')
  assert.equal(f.machine.restarts, 0); assert.equal(f.calls.length, 1)
})
test('spawn ENOENT → backend_missing', async t => {
  const f = fixture(t, { missing: true }); f.machine.start()
  await until(() => f.machine.phase === 'failed')
  assert.equal(f.machine.lastCode, 'backend_missing'); assert.equal(f.calls.length, 1)
})
