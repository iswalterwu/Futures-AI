'use strict'
const { EventEmitter } = require('node:events')
const { spawn } = require('node:child_process')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const startupCodes = new Set(['data_root_locked', 'data_root_unwritable', 'disk_full', 'port_in_use', 'startup_internal'])

function httpJson(port, token, method, pathname, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method, path: pathname, timeout,
      headers: token ? { Authorization: `Bearer ${token}` } : {} }, res => {
      let text = ''
      res.on('data', chunk => { text += chunk })
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(text) }) } catch { reject(new Error('invalid_json')) }
      })
      res.on('error', reject)
    })
    req.on('timeout', () => req.destroy(new Error('http_timeout')))
    req.on('error', reject)
    req.end()
  })
}

// One production machine, shared with Node tests. Only process/HTTP boundaries are injectable.
class Backend extends EventEmitter {
  constructor({ root, portFile, command, timeoutMs = 30000 }, boundary = {}) {
    super()
    this.root = root
    this.portFile = portFile
    this.command = command
    this.timeoutMs = timeoutMs
    this.spawn = boundary.spawn || spawn
    this.http = boundary.http || httpJson
    this.phase = 'idle'
    this.phases = ['idle']
    this.gen = 0
    this.restarts = 0
    this.lastCode = null
    this.current = null
    this.restartTimer = null
    this.stopPromise = null
    this.retryPromise = null
  }
  snapshot() {
    const g = this.current
    return { phase: this.phase, phases: [...this.phases], gen: this.gen, restarts: this.restarts,
      pid: g && !g.exited ? g.child?.pid ?? null : null,
      port: g?.info?.port ?? null, lastCode: this.lastCode }
  }
  getBackend() {
    return this.phase === 'ready' && !this.current.exited ? { ...this.current.info, token: this.current.token } : null
  }
  transition(phase, detail = {}) {
    this.phase = phase
    this.phases.push(phase)
    this.lastCode = detail.code ?? null
    this.emit('status', { phase, ...detail, attempt: this.restarts, maxAttempts: 3 })
  }
  start() {
    if (!['idle', 'stopped', 'failed'].includes(this.phase)) return
    if (this.current && !this.current.exited) return
    this.stopPromise = null
    this.launch()
  }
  launch() {
    const g = { gen: ++this.gen, child: null, portFile: this.portFile,
      token: crypto.randomBytes(16).toString('hex'), deadline: Date.now() + this.timeoutMs,
      info: null, marker: null, exited: false, ending: false, output: '' }
    this.current = g
    this.transition('spawning')
    try {
      fs.mkdirSync(path.dirname(g.portFile), { recursive: true })
      fs.rmSync(g.portFile, { force: true })
      const { cmd, args, cwd, env } = this.command()
      g.commandPath = cmd
      g.child = this.spawn(cmd, [...args, '--root', this.root, '--port-file', g.portFile,
        '--token', g.token, '--exit-on-stdin-eof'], {
        cwd, env: { ...process.env, ...env }, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true,
        // Separate the Windows console lifetime; ownership stays with this machine
        // and stdin EOF, rather than abrupt console teardown when Electron dies.
        detached: process.platform === 'win32',
      })
      g.done = new Promise(resolve => { g.resolve = resolve })
      g.child.stdout.on('data', data => this.output(g, data))
      // Never forward arbitrary child output/payloads to shell logs.
      g.child.stderr.on('data', () => {})
      g.child.on('error', () => {
        if (this.current !== g || g.ending) return
        g.spawnError = true
      })
      g.child.once('exit', () => { g.exited = true })
      g.child.once('close', (code, signal) => {
        g.exited = true
        g.resolve()
        if (this.current !== g || g.ending) return
        if (g.output) this.output(g, '\n')
        this.ended(g, code, signal)
      })
      this.transition('waiting_health')
      void this.poll(g)
    } catch (error) {
      g.exited = true
      this.transition('failed', { code: error.code === 'ENOENT' ? 'backend_missing' : 'startup_internal', path: this.root })
    }
  }
  output(g, data) {
    if (this.current !== g || g.ending) return
    g.output += String(data)
    const lines = g.output.split('\n'); g.output = lines.pop()
    for (const line of lines) {
      if (!line.startsWith('FAI_HOST ')) continue
      try {
        const value = JSON.parse(line.slice(9))
        if (value.event === 'startup_failed' && startupCodes.has(value.code)) {
          g.marker = { code: value.code, path: typeof value.path === 'string' ? value.path : this.root,
            message: typeof value.detail === 'string' ? value.detail : '' }
        }
      } catch { /* malformed external marker is not a startup classification */ }
    }
  }
  ended(g, code, signal) {
    g.info = null
    if (g.spawnError) { this.transition('failed', { code: 'backend_missing', path: g.commandPath }); return }
    if (code === 3 && g.marker) { this.transition('failed', g.marker); return }
    this.emit('backend.error', { code: 'backend_exited', exitCode: code, signal })
    if (this.restarts === 3) { this.transition('failed', { code: 'restart_limit' }); return }
    this.restarts++
    this.transition('restarting', { code: 'backend_exited' })
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null
      if (this.current === g && this.phase === 'restarting') this.launch()
    }, this.restarts * 500)
  }
  async poll(g) {
    while (this.current === g && !g.exited && !g.ending && this.phase === 'waiting_health') {
      const remaining = g.deadline - Date.now()
      if (remaining <= 0) {
        g.ending = true
        try {
          await this.kill(g)
          if (this.current === g && this.phase === 'waiting_health') {
            g.info = null
            this.transition('failed', { code: 'health_timeout', path: this.root })
          }
        } catch { this.transition('failed', { code: 'startup_internal', path: this.root }) }
        return
      }
      if (!g.info) {
        try {
          const info = JSON.parse(fs.readFileSync(g.portFile, 'utf8'))
          if (Number.isInteger(info.port) && info.port > 0 && info.port <= 65535) g.info = { port: info.port }
        } catch { /* endpoint not published yet */ }
      }
      if (g.info) {
        try {
          const health = await this.http(g.info.port, g.token, 'GET', '/health', Math.min(1000, remaining))
          if (this.current !== g || g.exited || g.ending || this.phase !== 'waiting_health') return
          if (Date.now() < g.deadline && health.status === 200 && health.body?.status === 'ok' && health.body.data_ready === true) {
            this.transition('ready')
            this.emit('backend.ready', { version: health.body.version })
            return
          }
        } catch { /* health is not ready; keep the same generation/deadline */ }
      }
      await delay(Math.min(100, Math.max(0, g.deadline - Date.now())))
    }
  }
  async kill(g) {
    if (g.exited) return
    if (!g.killPromise) g.killPromise = (async () => {
      if (process.platform === 'win32') {
        await new Promise((resolve, reject) => {
          const killer = this.spawn('taskkill', ['/PID', String(g.child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' })
          killer.once('error', reject)
          killer.once('close', code => code === 0 || g.exited ? resolve() : reject(new Error('taskkill_failed')))
        })
      } else g.child.kill('SIGKILL')
      const until = Date.now() + 5000
      while (!g.exited && Date.now() < until) await delay(25)
      if (!g.exited) throw new Error('backend_still_alive')
      await g.done
    })()
    return g.killPromise
  }
  stop() {
    if (this.stopPromise) return this.stopPromise
    clearTimeout(this.restartTimer)
    this.restartTimer = null
    const g = this.current
    if (g) g.ending = true
    this.transition('stopping')
    this.stopPromise = (async () => {
      if (g && !g.exited) {
        const until = Date.now() + 5000
        if (g.info) void this.http(g.info.port, g.token, 'POST', '/shutdown', 1000).catch(() => {})
        else g.child.stdin.end()
        while (!g.exited && Date.now() < until) await delay(25)
        await this.kill(g)
        await g.done
      }
      fs.rmSync(this.portFile, { force: true })
      if (g) g.info = null
      this.transition('stopped')
    })()
    return this.stopPromise
  }
  retry() {
    if (this.retryPromise) return this.retryPromise
    this.retryPromise = this.stop().then(() => {
      this.restarts = 0
      this.start()
    }).finally(() => { this.retryPromise = null })
    return this.retryPromise
  }
}
module.exports = { Backend, httpJson }
