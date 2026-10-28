// Real Electron scene runner. No scene runs until the complete registry is validated.
'use strict'
const assert = require('node:assert/strict')
const fs = require('node:fs')
const http = require('node:http')
const os = require('node:os')
const path = require('node:path')
const { spawn, spawnSync } = require('node:child_process')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function alive(pid) {
  try { process.kill(pid, 0); return true } catch (error) {
    if (error.code === 'ESRCH') return false
    throw error
  }
}
function inside(root, candidate) {
  if (typeof candidate !== 'string' || !path.isAbsolute(candidate)) throw new Error('isolation path must be absolute')
  const rel = path.relative(root, candidate)
  if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw new Error('isolation path outside owned temp root')
  return candidate
}
function requireTools(requires) {
  for (const file of requires.files || []) {
    if (!fs.statSync(file, { throwIfNoEntry: false })?.isFile()) throw new Error(`missing fixture: ${file}`)
  }
  for (const tool of requires.tools || []) {
    const result = spawnSync('where.exe', [tool], { windowsHide: true, encoding: 'utf8', timeout: 5000 })
    if (result.error || result.status !== 0) throw new Error(`missing external tool: ${tool}`)
  }
}
async function killOwned(pid) {
  if (!alive(pid)) return
  const result = spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true, timeout: 5000 })
  if (result.error) throw new Error(`owned taskkill failed: ${result.error.code}`)
  for (let n = 0; n < 30 && alive(pid); n++) await delay(100)
  if (alive(pid)) throw new Error(`owned PID still alive: ${pid}`)
}
function command(instance, cmd) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(cmd)
    const req = http.request({ host: '127.0.0.1', port: instance.controlPort, path: '/cmd', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }, timeout: 2000 }, res => {
      let text = ''
      res.on('data', data => { text += data })
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(text) }) } catch (error) { reject(error) }
      })
    })
    req.on('error', reject)
    req.on('timeout', () => req.destroy(new Error('control request timeout')))
    req.end(body)
  })
}

class Context {
  constructor(name) {
    this.name = name
    this.root = fs.mkdtempSync(path.join(os.tmpdir(), `fai-e2e-${name}-`))
    this.env = { ...process.env }
    // Never inherit application/test overrides or Electron's Node mode from the caller.
    for (const key of Object.keys(this.env)) if (key.startsWith('FAI_') || key === 'ELECTRON_RUN_AS_NODE') delete this.env[key]
    Object.assign(this.env, { LOCALAPPDATA: path.join(this.root, 'LocalAppData'),
      FAI_SHELL_STATE_DIR: path.join(this.root, 'LocalAppData', 'FuturesAI-Shell'),
      FAI_TEST_HOOKS: '1', FAI_TEST_SCENARIO: name, PYTHONDONTWRITEBYTECODE: '1',
      FAI_FAKE_REGISTRY: path.join(this.root, 'registry') })
    this.instances = []
    this.backendPids = new Set()
    this.assertions = 0
    this.failures = 0
    this.closed = false
    this.restorers = []
    console.log(`TEMP ${JSON.stringify(this.root)}`)
  }
  result(name, check) {
    this.assertions++
    try { check(); console.log(`PASS ${this.name} › ${name}`) } catch (error) {
      this.failures++
      console.error(`FAIL ${this.name} › ${name}: ${error.message}`)
    }
  }
  expectEqual(name, actual, expected) {
    if (arguments.length !== 3) throw new Error('expectEqual requires name, actual, expected')
    this.result(name, () => assert.deepEqual(actual, expected))
  }
  expectMatch(name, actual, expected) {
    if (arguments.length !== 3) throw new Error('expectMatch requires name, actual, expected')
    this.result(name, () => assert.match(actual, expected))
  }
  expectIncludes(name, actual, expected) {
    if (arguments.length !== 3) throw new Error('expectIncludes requires name, actual, expected')
    this.result(name, () => assert.equal(actual.includes(expected), true))
  }
  owned(candidate) { return inside(this.root, candidate) }
  alive(pid) { return alive(pid) }
  registry() {
    const file = path.join(this.env.FAI_FAKE_REGISTRY, 'spawns.jsonl')
    if (!fs.existsSync(file)) return []
    const entries = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
    for (const entry of entries) this.backendPids.add(entry.pid)
    return entries
  }
  async waitFor(fn, timeout = 10000) {
    const until = Date.now() + timeout
    while (Date.now() < until) {
      if (this.closed) throw new Error('scene closed')
      const value = await fn()
      if (value) return value
      await delay(50)
    }
    throw new Error(`condition timeout (${timeout}ms)`)
  }
  async launch({ env = {}, args = [], second = false } = {}) {
    if (this.closed) throw new Error('scene closed')
    requireTools({ tools: ['taskkill'] })
    const childEnv = { ...this.env, ...env }
    for (const key of ['LOCALAPPDATA', 'FAI_SHELL_STATE_DIR', 'FAI_DATA_ROOT', 'FAI_FAKE_REGISTRY']) {
      if (childEnv[key] !== undefined) inside(this.root, childEnv[key])
    }
    assert.equal(childEnv.FAI_TEST_HOOKS, '1')
    assert.equal(childEnv.FAI_TEST_SCENARIO, this.name)
    const child = spawn(require('electron'), ['.', ...args], { cwd: __dirname, env: childEnv,
      stdio: ['ignore', 'pipe', 'pipe'], windowsHide: false })
    const instance = { child, paths: null, controlPort: null, exited: false, code: null, error: null, smokeCount: 0 }
    this.instances.push(instance)
    instance.exit = new Promise(resolve => {
      child.once('exit', code => { instance.exited = true; instance.code = code; resolve(code) })
      child.once('error', error => { instance.error = error; instance.exited = true; resolve(null) })
    })
    let pending = ''
    child.stdout.on('data', data => {
      pending += data.toString()
      const lines = pending.split('\n'); pending = lines.pop()
      for (const line of lines) {
        if (!line.startsWith('SMOKE ')) continue
        try {
          const message = JSON.parse(line.slice(6))
          if (instance.smokeCount++ === 0) assert.equal(message.event, 'paths')
          if (message.event === 'paths') {
            for (const key of ['userData', 'sessionData', 'crashDumps', 'stateDir']) inside(this.root, message.paths[key])
            if (message.gotLock) inside(this.root, message.paths.dataRoot)
            instance.paths = message.paths
          }
          if (message.event === 'control') instance.controlPort = message.port
        } catch (error) {
          instance.error = error
          // Isolation violation: stop this owned process immediately, before scene actions.
          void killOwned(child.pid).catch(killError => { instance.error = killError })
        }
      }
    })
    // Only retain the main-process exception type, never renderer text or payloads.
    child.stderr.on('data', data => {
      const type = data.toString().match(/\b(TypeError|ReferenceError|SyntaxError):/)
      if (type) instance.startupException = type[1]
    })
    await this.waitFor(() => {
      if (instance.startupException) throw new Error(`Electron startup exception: ${instance.startupException}`)
      if (instance.error) throw instance.error
      if (instance.paths && (second || instance.controlPort)) return true
      if (instance.exited) throw new Error(`Electron exited before paths/control: ${instance.code}`)
      return false
    })
    return instance
  }
  async cmd(instance, value) {
    const response = await command(instance, value)
    assert.equal(response.status, 200, 'control command HTTP status')
    return response.body
  }
  rawCommand(instance, value) { return command(instance, value) }
  async snapshot(instance) {
    const snapshot = await this.cmd(instance, { command: 'snapshot' })
    if (snapshot.backend.pid) this.backendPids.add(snapshot.backend.pid)
    return snapshot
  }
  async waitExit(instance, timeout = 10000) {
    await this.waitFor(() => instance.exited, timeout)
    return instance.code
  }
  async cleanup() {
    this.closed = true
    const errors = []
    for (const instance of this.instances) {
      if (!instance.exited && instance.controlPort) {
        try {
          const observed = await this.snapshot(instance)
          console.log(`CLEANUP_OBSERVED ${JSON.stringify({ backend: observed.backend,
            window: { exists: observed.window.exists, visible: observed.window.visible, url: observed.window.url } })}`)
          await command(instance, { command: 'request-quit' })
        } catch (error) { errors.push(`control cleanup: ${error.message}`) }
      }
      const until = Date.now() + 10000
      while (!instance.exited && Date.now() < until) await delay(50)
      if (!instance.exited && instance.child.pid) {
        errors.push('Electron required owned taskkill')
        try { await killOwned(instance.child.pid) } catch (error) { errors.push(error.message) }
      }
      if (instance.error) errors.push(instance.error.message)
    }
    try { this.registry() } catch (error) { errors.push(`registry: ${error.message}`) }
    for (const pid of this.backendPids) {
      if (alive(pid)) {
        errors.push(`leaked backend PID ${pid}`) // Still FAIL even if forced cleanup succeeds.
        try { await killOwned(pid) } catch (error) { errors.push(error.message) }
      }
      this.expectEqual('后端 pid 已退出', alive(pid), false)
    }
    for (const restore of this.restorers.reverse()) {
      try { await restore() } catch (error) { errors.push(`restore: ${error.message}`) }
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      try { fs.rmSync(this.root, { recursive: true, force: true }); break } catch (error) {
        if (attempt === 2) errors.push(`temp cleanup failed: ${this.root}: ${error.code}`)
        else await delay(200)
      }
    }
    this.expectEqual('临时目录已删除', fs.existsSync(this.root), false)
    for (const message of errors) this.result('清理失败', () => { throw new Error(message) })
  }
}

async function main() {
  const dir = path.resolve(process.env.FAI_CHECK_E2E_DIR || path.join(__dirname, 'test', 'e2e'))
  let names
  try {
    names = require(path.join(dir, 'index.js'))
    assert.equal(Array.isArray(names), true)
    assert.equal(names.every(name => typeof name === 'string' && /^[a-z0-9-]+$/.test(name)), true)
    assert.equal(new Set(names).size, names.length)
    const files = fs.readdirSync(dir).filter(name => name.endsWith('.js') && name !== 'index.js').map(name => name.slice(0, -3))
    assert.deepEqual([...names].sort(), files.sort(), 'registry/file mismatch')
    for (const name of process.argv.slice(2)) assert.equal(names.includes(name), true, `unknown scene: ${name}`)
  } catch (error) {
    console.error(`REGISTRY_ERROR ${error.message}`)
    return 2
  }
  const selected = process.argv.length > 2 ? process.argv.slice(2) : names
  let total = 0, failed = 0
  for (const name of selected) {
    const ctx = new Context(name)
    let timer
    try {
      const scene = require(path.join(dir, name + '.js'))
      requireTools(scene.requires)
      await Promise.race([scene.run(ctx), new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('scene timeout')), scene.timeoutMs || 30000)
      })])
      if (ctx.assertions === 0) throw new Error('zero assertions')
    } catch (error) {
      ctx.result('场景执行', () => { throw error })
    } finally {
      clearTimeout(timer)
      await ctx.cleanup()
    }
    total += ctx.assertions; failed += ctx.failures
  }
  console.log(`SUMMARY ${total - failed}/${total} assertions; ${selected.length} scenes; failures=${failed}`)
  return failed ? 1 : 0
}

if (require.main === module) main().then(code => { process.exitCode = code }).catch(error => {
  console.error(`RUNNER_ERROR ${error.message}`); process.exitCode = 1
})
