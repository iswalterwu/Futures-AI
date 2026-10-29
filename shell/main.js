// 外壳主进程（desktop-shell plan §2/§3.2）
//
// 职责：单实例锁、窗口、后端托管（一个进程）、/health 就绪判定、崩溃重启、退出顺序、日志。
// 不直接管 data serve / pi：它们都在后端进程内部（spec Q-001）。
'use strict'

const electron = require('electron')
const { app, BrowserWindow, Menu, dialog, ipcMain, shell: electronShell } = electron
const { Backend, httpJson } = require('./src/backend')
const fs = require('node:fs')
const path = require('node:path')
const { bootstrap, resolvePaths, loadDataRoot, resolveTarget } = require('./src/paths')
const startedAt = Date.now()
const startup = bootstrap(app, process.env)
const startupPage = path.join(__dirname, 'renderer', 'startup.html')

const HEALTH_TIMEOUT_MS = process.env.FAI_TEST_HOOKS === '1'
  ? Number(process.env.FAI_HEALTH_TIMEOUT_MS || 30000) : 30000

const state = {
  backend: null,
  quitting: false,
  window: null,
  logFile: null,
  mode: process.argv.includes('--mock') || process.env.FAI_MODE === 'mock' ? 'mock' : 'backend',
  status: { phase: 'starting' },
  timing: { shown_ms: null, ready_ms: null, interactive_ms: null },
  page: null,
  navigation: 0,
}
let hooks = null
if (process.env.FAI_TEST_HOOKS === '1' && startup.paths) {
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
  state.backend = new Backend({ root: startup.dataRoot,
    portFile: path.join(startup.paths.stateDir, 'run', 'host.json'),
    command: backendCommand, timeoutMs: HEALTH_TIMEOUT_MS })
  state.backend.on('status', status => {
    log(`backend ${status.phase} ${status.code || ''}`)
    if (status.phase === 'stopping' || status.phase === 'stopped') return
    setStatus({ ...status, phase: status.phase === 'spawning' ? 'starting' : status.phase })
    if (status.phase === 'restarting' || status.phase === 'failed') void showStartup()
  })
  state.backend.on('backend.ready', () => {
    state.timing.ready_ms = Date.now() - startedAt
    void routeToMain()
  })
  state.backend.start()
}

function setStatus(status) {
  state.status = { ...status, logPath: startup.paths ? path.join(startup.paths.stateDir, 'log', 'shell.log') : '' }
  state.window?.webContents.send('fai:status', state.status)
}
async function showStartup() {
  if (state.page === startupPage) return
  await loadPage(startupPage)
}
async function loadPage(target) {
  const navigation = ++state.navigation
  state.page = target
  try {
    await state.window.loadFile(target)
    if (navigation !== state.navigation || state.quitting) return
    state.window.webContents.send('fai:status', state.status)
    if (target !== startupPage) {
      state.timing.interactive_ms = Date.now() - startedAt
      log(`startup_timing ${JSON.stringify(state.timing)}`)
    }
  } catch {
    if (navigation !== state.navigation || state.quitting) return
    if (target === startupPage && !fs.existsSync(startupPage)) {
      dialog.showErrorBox('启动界面资源缺失', `请重新安装。日志：${state.status.logPath || '状态目录不可用'}`)
      await gracefulQuit(1)
    } else if (target !== startupPage) {
      setStatus({ phase: 'failed', code: 'frontend_missing', path: target })
      await showStartup()
    } else setStatus({ phase: 'failed', code: 'startup_internal', path: startupPage })
  }
}
async function loadTarget() {
  const selection = resolveTarget(app, process.env, process.resourcesPath, __dirname)
  if (selection.error) {
    setStatus({ phase: 'failed', ...selection.error })
    await showStartup()
    return
  }
  setStatus({ phase: state.mode === 'mock' ? 'mock' : 'ready' })
  await loadPage(selection.target)
}
async function routeToMain() {
  if (!state.window) return { error: 'not_ready' }
  if (state.mode === 'mock') {
    await loadTarget()
    return { opened: true }
  }
  const endpoint = state.backend?.getBackend()
  if (!endpoint) return { error: 'not_ready' }
  const gen = state.backend.gen
  try {
    const response = await httpJson(endpoint.port, endpoint.token, 'GET', '/settings/profile', 5000)
    if (state.backend.gen !== gen || !state.backend.getBackend()) return { error: 'not_ready' }
    if (response.status !== 200 || typeof response.body?.onboarding?.completed !== 'boolean') {
      throw new Error('invalid_profile_response')
    }
    if (response.body.onboarding.completed) await loadTarget()
    else {
      setStatus({ phase: 'ready' })
      await loadPage(path.join(__dirname, 'renderer', 'onboarding.html'))
    }
    return { opened: true }
  } catch {
    if (state.backend.gen === gen && state.backend.getBackend()) {
      setStatus({ phase: 'failed', code: 'startup_internal' })
      await showStartup()
    }
    return { error: 'not_ready' }
  }
}
async function openSettings(via) {
  const available = Boolean(state.window && (state.mode === 'mock' || state.backend?.getBackend()))
  if (available) await loadPage(path.join(__dirname, 'renderer', 'onboarding.html'))
  if (hooks) hooks.records.navigation.push({ action: 'open-settings', via, result: available ? 'opened' : 'not_ready' })
  return available ? { opened: true } : { error: 'not_ready' }
}
function beginStartup() {
  if (state.mode === 'mock') void loadTarget()
  else startBackend()
}
function installIpc() {
  ipcMain.handle('fai:backend', () => state.backend?.getBackend() ?? null)
  ipcMain.handle('fai:status', () => state.status)
  ipcMain.handle('fai:open-settings', () => openSettings('renderer'))
  ipcMain.handle('fai:open-main', async () => {
    const result = await routeToMain()
    if (hooks) hooks.records.navigation.push({ action: 'open-main', via: 'renderer', result: result.opened ? 'opened' : 'not_ready' })
    return result
  })
  ipcMain.handle('fai:retry', async () => {
    if (state.quitting) return
    if (startup.error) {
      const retried = startup.gotLock ? loadDataRoot(resolvePaths(app, process.env)) : bootstrap(app, process.env)
      delete startup.error
      Object.assign(startup, retried)
      if (startup.error) { setStatus({ phase: 'failed', ...startup.error }); return }
      beginStartup()
    } else if (['frontend_missing', 'renderer_crashed'].includes(state.status.code)) {
      await routeToMain()
    } else if (state.backend) await state.backend.retry()
  })
  ipcMain.handle('fai:logs', async () => {
    const folder = startup.paths ? path.join(startup.paths.stateDir, 'log') : null
    if (!folder) return { error: 'localappdata_missing' }
    const error = await electronShell.openPath(folder)
    return error ? { error } : { path: folder }
  })
}

// ---------- 窗口（R-005/R-009） ----------
async function createWindow() {
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
      additionalArguments: [`--fai-mode=${state.mode}`],
    },
  })
  state.window = win
  if (hooks) win.on('page-title-updated', event => event.preventDefault())
  const shown = new Promise(resolve => win.once('ready-to-show', () => {
    win.show()
    state.timing.shown_ms = Date.now() - startedAt
    resolve()
  }))
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

  win.webContents.on('did-fail-load', (_event, code, _description, _url, isMainFrame) => {
    if (!isMainFrame || code === -3 || state.quitting || state.page === startupPage) return
    setStatus({ phase: 'failed', code: 'frontend_missing', path: state.page })
    void showStartup()
  })
  win.webContents.on('render-process-gone', () => {
    if (state.quitting) return
    const failedPath = state.page
    state.page = null
    setStatus({ phase: 'failed', code: 'renderer_crashed', path: failedPath })
    void showStartup()
  })
  win.on('closed', () => { state.window = null })
  await showStartup()
  if (!state.quitting) await shown
}

// ---------- 退出（R-003） ----------
async function gracefulQuit(exitCode = 0) {
  if (state.quitting) return
  state.quitting = true
  log('graceful shutdown started')
  try {
    await state.backend?.stop()
  } catch {
    log('backend stop failed')
    app.exit(1)
    return
  }
  log('graceful shutdown done')
  app.exit(exitCode)
}

// ---------- 单实例（AC-004-1） ----------
if (!startup.gotLock && !startup.error) {
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
    for (const key of startup.ignored || []) log(`${key} ignored (packaged)`)
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { label: '文件', submenu: [
        { id: 'fai-settings', label: '设置…', accelerator: 'CmdOrCtrl+,', click: () => openSettings('app-menu') },
        { type: 'separator' }, { role: 'quit' },
      ] },
      { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' },
    ]))
    if (hooks) await hooks.startControl()
    installIpc()
    if (startup.error) setStatus({ phase: 'failed', ...startup.error })
    await createWindow()
    if (!state.quitting && !startup.error) beginStartup()
  })
}
