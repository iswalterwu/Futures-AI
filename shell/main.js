// 外壳主进程（desktop-shell plan §2/§3.2）
//
// 职责：单实例锁、窗口、后端托管（一个进程）、/health 就绪判定、崩溃重启、退出顺序、日志。
// 不直接管 data serve / pi：它们都在后端进程内部（spec Q-001）。
'use strict'

const electron = require('electron')
const { app, BrowserWindow, dialog, shell: electronShell } = electron
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const http = require('node:http')
const path = require('node:path')
const crypto = require('node:crypto')
const { bootstrap } = require('./src/paths')
const startup = bootstrap(app, process.env)

const HEALTH_TIMEOUT_MS = process.env.FAI_TEST_HOOKS === '1'
  ? Number(process.env.FAI_HEALTH_TIMEOUT_MS || 30000) : 30000
const MAX_RESTARTS = 3
const SHUTDOWN_GRACE_MS = 5000

const state = {
  backend: null,
  backendInfo: null, // {port, token}
  restarts: 0,
  quitting: false,
  window: null,
  logFile: null,
}
let hooks = null
if (process.env.FAI_TEST_HOOKS === '1' && !startup.error) {
  hooks = require('./src/test-hooks').install(electron, startup, state, () => gracefulQuit(0))
}

// ---------- 日志（AC-010-1） ----------
function log(line) {
  const stamp = new Date().toISOString()
  const text = `[${stamp}] ${line}\n`
  try {
    if (!state.logFile) state.logFile = path.join(startup.paths.stateDir, 'log')
    fs.mkdirSync(state.logFile, { recursive: true })
    const file = path.join(state.logFile, 'shell.log')
    if (hooks && !fs.existsSync(file)) fs.writeFileSync(file, 'TEST HOOKS ENABLED\n')
    fs.appendFileSync(file, text)
  } catch {
    /* 日志失败不影响主流程 */
  }
}

// ---------- 数据目录与后端可执行文件（R-004） ----------
function backendCommand() {
  const replacement = hooks?.backendCommand()
  if (replacement) return replacement
  const exeName = process.platform === 'win32' ? 'futuresai-backend.exe' : 'futuresai-backend'
  const backendDir = path.resolve(__dirname, '..', 'backend')

  // 显式指定可执行文件（打包验证用）
  if (process.env.FAI_BACKEND_EXE) {
    const exe = process.env.FAI_BACKEND_EXE
    return { cmd: exe, args: [], cwd: path.dirname(exe), env: {} }
  }
  // 打包后：随包的后端（resources/backend/）
  if (app.isPackaged) {
    const packaged = path.join(process.resourcesPath, 'backend', exeName)
    return { cmd: packaged, args: [], cwd: path.dirname(packaged), env: {} }
  }
  // 开发期：直接跑 Python 源码，避免每次改后端都重新打包
  return {
    cmd: process.env.FAI_PYTHON || 'python',
    args: ['-m', 'app'],
    cwd: backendDir,
    env: { PYTHONPATH: backendDir, PYTHONIOENCODING: 'utf-8' },
  }
}

// ---------- 后端进程（R-002/R-003） ----------
function startBackend() {
  const root = startup.dataRoot
  const portFile = path.join(root, 'host.json')
  try {
    fs.rmSync(portFile, { force: true })
  } catch {
    /* ignore */
  }
  const token = crypto.randomBytes(16).toString('hex')
  const { cmd, args, cwd, env } = backendCommand()
  log('starting backend')
  const child = spawn(cmd, [...args, '--root', root, '--port-file', portFile, '--token', token], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  })
  child.stdout.on('data', (d) => log(`[backend] ${String(d).trim()}`))
  child.stderr.on('data', (d) => log(`[backend:err] ${String(d).trim()}`))
  child.on('exit', (code, signal) => {
    log(`backend exited code=${code} signal=${signal}`)
    if (!state.quitting) onBackendCrash()
  })
  state.backend = child
  return { child, portFile, token }
}

function onBackendCrash() {
  if (state.restarts >= MAX_RESTARTS) {
    log('backend crashed too many times; giving up')
    dialog.showErrorBox(
      '后端启动失败',
      `后端连续 ${MAX_RESTARTS} 次异常退出。可查看日志或导出诊断后重试。`
    )
    app.quit()
    return
  }
  state.restarts += 1
  const delay = 500 * state.restarts
  log(`restarting backend in ${delay}ms (attempt ${state.restarts})`)
  setTimeout(() => {
    if (state.quitting) return
    try {
      startBackend()
      waitForReady().then(onReady).catch(handleNotReady)
    } catch (e) {
      log(`restart failed: ${e}`)
    }
  }, delay)
}

function httpJson(port, token, method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        method,
        path: pathname,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
        timeout: 5000,
      },
      (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => {
          let parsed = {}
          try {
            parsed = data ? JSON.parse(data) : {}
          } catch {
            parsed = { raw: data }
          }
          resolve({ status: res.statusCode, body: parsed })
        })
      }
    )
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

// 就绪判定：/health 200 且 data_ready（AC-002-2；不用端点文件代替）
async function waitForReady(portFile, token, timeoutMs = HEALTH_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs
  let info = null
  while (Date.now() < deadline) {
    if (state.backend && state.backend.exitCode !== null) {
      const err = new Error(`后端进程已退出（code=${state.backend.exitCode}）`)
      err.code = 'backend_exited'
      throw err
    }
    if (!info) {
      try {
        info = JSON.parse(fs.readFileSync(portFile, 'utf8'))
      } catch {
        info = null
      }
    }
    if (info) {
      try {
        const res = await httpJson(info.port, token, 'GET', '/health')
        if (res.status === 200 && res.body && res.body.data_ready === true) {
          state.backendInfo = { port: info.port, token }
          return res.body
        }
      } catch {
        /* 尚未监听 */
      }
    }
    await new Promise((r) => setTimeout(r, 150))
  }
  const err = new Error(`后端在 ${timeoutMs}ms 内未就绪`)
  err.code = 'timeout'
  throw err
}

function onReady(health) {
  log(`backend ready: ${JSON.stringify(health)}`)
  createWindow()
}

function handleNotReady(err) {
  log(`backend not ready: ${err.code || ''} ${err.message}`)
  dialog.showErrorBox(
    '后端启动失败',
    `${err.message}\n\n可重试，或查看日志：${path.join(startup.paths.stateDir, 'log', 'shell.log')}`
  )
  app.quit()
}

// ---------- 窗口（R-005/R-009） ----------
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#141519',
    show: false,
    title: hooks ? 'FuturesAI ［测试钩子］' : 'FuturesAI',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: [
        `--fai-backend=${JSON.stringify({
          port: state.backendInfo ? state.backendInfo.port : null,
          token: state.backendInfo ? state.backendInfo.token : null,
        })}`,
      ],
    },
  })
  state.window = win
  if (hooks) win.on('page-title-updated', event => event.preventDefault())
  win.once('ready-to-show', () => win.show())
  // 外链交给系统浏览器（AC-009-3）
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) electronShell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault()
      electronShell.openExternal(url)
    }
  })

  const frontendIndex = path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html')
  const builtinPage = path.join(__dirname, 'renderer', 'onboarding.html')
  const target = fs.existsSync(frontendIndex) ? frontendIndex : builtinPage
  log(`loading ${target}`)
  win.loadFile(target)
  win.on('closed', () => {
    state.window = null
  })
}

// ---------- 退出（R-003） ----------
async function gracefulQuit(exitCode = 0) {
  if (state.quitting) return
  state.quitting = true
  log('graceful shutdown started')
  const { backend, backendInfo } = state
  try {
    if (backendInfo && backend && backend.exitCode === null) {
      await httpJson(backendInfo.port, backendInfo.token, 'POST', '/shutdown', {})
    }
  } catch (e) {
    log(`shutdown request failed: ${e}`)
  }
  if (backend && backend.exitCode === null) {
    const exited = await new Promise((resolve) => {
      const timer = setTimeout(() => resolve(false), SHUTDOWN_GRACE_MS)
      backend.once('exit', () => {
        clearTimeout(timer)
        resolve(true)
      })
    })
    if (!exited) {
      log('backend did not exit in time; killing')
      backend.kill()
    }
  }
  log('graceful shutdown done')
  app.exit(exitCode)
}

// ---------- 单实例（AC-004-1） ----------
if (startup.error) {
  // 可操作错误页由 T-05k 接入；这里不回退目录，也不启动后端。
  process.stderr.write(`STARTUP_FAILED ${JSON.stringify(startup.error)}\n`)
  app.exit(1)
} else if (!startup.gotLock) {
  // 第二实例：聚焦已有窗口后退出，不启动第二个后端（AC-004-1）
  app.quit()
} else {
  app.on('second-instance', () => {
    if (state.window) {
      const calls = []
      state.window.restore()
      calls.push('restore')
      state.window.show()
      calls.push('show')
      state.window.focus()
      calls.push('focus')
      if (hooks) hooks.records.secondInstance.push({ calls })
    }
  })

  app.on('window-all-closed', () => {
    // v1：关窗即退出（托盘常驻在 T-07 接入）
    gracefulQuit(0)
  })

  app.on('before-quit', (event) => {
    if (!state.quitting) {
      event.preventDefault()
      gracefulQuit(0)
    }
  })

  app.whenReady().then(async () => {
    log('shell starting')
    for (const key of startup.ignored) log(`${key} ignored (packaged)`)
    if (hooks) await hooks.startControl()
    const { portFile, token } = startBackend()
    try {
      const health = await waitForReady(portFile, token)
      onReady(health)
    } catch (e) {
      handleNotReady(e)
    }
  })
}
