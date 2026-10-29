// Loaded exclusively by main.js when FAI_TEST_HOOKS === '1'. System boundaries only.
'use strict'
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { validateEvent } = require('./activity')
const { EventEmitter } = require('node:events')

function install(electron, startup, state, requestQuit) {
  const { app } = electron
  const paths = { stateDir: startup.paths.stateDir, userData: app.getPath('userData'),
    sessionData: app.getPath('sessionData'), crashDumps: app.getPath('crashDumps'),
    dataRoot: startup.dataRoot ?? null }
  emit({ event: 'paths', paths, gotLock: startup.gotLock })
  const loaded = loadTestEvents()
  if (loaded.error) {
    fs.writeSync(2, `TEST_EVENTS_INVALID ${loaded.error}\n`)
    app.exit(4)
    return
  }
  const testEvents = loaded.events
  const records = { dialogs: [], notifications: [], external: [], secondInstance: [], navigation: [] }
  const answers = []
  const outlets = { Notification: electron.Notification }
  if (process.env.FAI_TEST_SCENARIO) {
    electron.dialog.showMessageBox = async (...args) => {
      const options = args.at(-1)
      const answer = answers[0]?.type === 'message' ? answers.shift() : undefined
      const response = answer ? options.buttons.indexOf(answer.button) : -1
      records.dialogs.push({ type: 'message', buttons: options.buttons, unanswered: response < 0,
        ...(typeof options.message === 'string' ? { message: options.message } : {}),
        ...(typeof options.detail === 'string' ? { detail: options.detail } : {}) })
      return { response: response < 0 ? (options.cancelId ?? options.buttons.length - 1) : response, checkboxChecked: false }
    }
    electron.dialog.showOpenDialog = async () => {
      const answer = answers[0]?.type === 'open' ? answers.shift() : undefined
      records.dialogs.push({ type: 'open', unanswered: !answer })
      return { canceled: !answer, filePaths: answer?.paths || [] }
    }
    class RecordedNotification extends EventEmitter {
      constructor(options) { super(); this.options = options }
      show() {
        const { kind, title, body } = this.options
        records.notifications.push({ kind, title, body })
      }
      static isSupported() { return true }
    }
    // Electron exports Notification via a non-configurable accessor. Replace the
    // notifier outlet, not Electron's module descriptor; consumers use this outlet.
    outlets.Notification = RecordedNotification
    for (const method of ['openExternal', 'openPath', 'showItemInFolder']) {
      electron.shell[method] = value => {
        records.external.push({ method, value })
        if (method !== 'showItemInFolder') return Promise.resolve(method === 'openPath' ? '' : undefined)
      }
    }
  }
  function snapshot() {
    const win = state.window
    const exists = Boolean(win && !win.isDestroyed())
    return {
      paths,
      versions: { electron: process.versions.electron, node: process.versions.node, chrome: process.versions.chrome },
      window: exists ? { exists: true, visible: win.isVisible(), minimized: win.isMinimized(),
        url: win.webContents.getURL(), title: win.getTitle() } : { exists: false },
      backend: state.backend ? state.backend.snapshot() :
        { phase: 'idle', phases: [], gen: 0, restarts: 0, pid: null, port: null, lastCode: null },
      tray: state.tray && !state.tray.isDestroyed() ? { state: state.tray.state, tooltip: state.tray.tooltip,
        menu: state.trayMenu.items.filter(item => item.type !== 'separator').map(item => ({ label: item.label,
          ...(item.submenu ? { submenu: item.submenu.items.map(child => ({ label: child.label })) } : {}) })) } : null,
      activity: state.activity, records, prefs: startup.prefs,
    }
  }
  function backendCommand() {
    if (!process.env.FAI_BACKEND_CMD) return null
    const command = JSON.parse(process.env.FAI_BACKEND_CMD)
    if (!Array.isArray(command) || command.length === 0 || command.some(arg => typeof arg !== 'string' || !arg)) {
      throw new Error('FAI_BACKEND_CMD must be a nonempty JSON string array')
    }
    return { cmd: command[0], args: command.slice(1), cwd: app.getAppPath(), env: {} }
  }
  async function startControl() {
    const server = http.createServer(async (req, res) => {
      const send = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)) }
      if (req.method !== 'POST' || req.url !== '/cmd') { send(404, { error: 'not_found' }); return }
      let text = ''
      for await (const chunk of req) text += chunk
      try {
        const message = JSON.parse(text)
        switch (message.command) {
          case 'snapshot': send(200, snapshot()); break
          case 'eval':
            if (typeof message.js !== 'string') { send(400, { error: 'invalid_js' }); break }
            send(200, { value: await state.window.webContents.executeJavaScript(message.js) }); break
          case 'answer':
            if (!Array.isArray(message.queue) || message.queue.some(answer =>
              !answer || (answer.type !== 'message' && answer.type !== 'open') ||
              (answer.type === 'message' ? typeof answer.button !== 'string' :
                !Array.isArray(answer.paths) || answer.paths.some(p => typeof p !== 'string')))) {
              send(400, { error: 'invalid_answers' }); break
            }
            answers.push(...message.queue); send(200, { queued: answers.length }); break
          case 'close-window': state.window.close(); send(200, { accepted: true }); break
          case 'tray-click': {
            if (!Array.isArray(message.path) || message.path.length < 1 || message.path.length > 2 ||
                message.path.some(label => typeof label !== 'string' || !label)) {
              send(400, { error: 'invalid_tray_path' }); break
            }
            let menu = state.trayMenu, item, error
            for (const label of message.path) {
              item = menu?.items.find(candidate => candidate.label === label)
              if (!item) { error = 'tray_item_missing'; break }
              if (item.enabled === false || item.visible === false) { error = 'tray_item_unavailable'; break }
              menu = item.submenu
            }
            if (error) { send(409, { error }); break }
            item.click()
            send(200, { clicked: true })
            break
          }
          case 'app-menu-click': {
            if (message.item === 'settings') {
              const item = electron.Menu.getApplicationMenu()?.getMenuItemById('fai-settings')
              if (!item) { send(409, { error: 'menu_item_missing' }); break }
              if (item.enabled === false || item.visible === false) { send(409, { error: 'menu_item_unavailable' }); break }
              item.click()
              send(200, { clicked: 'settings' })
            } else send(400, { error: 'unknown_menu_item' })
            break
          }
          case 'request-quit':
            send(200, { accepted: true })
            setImmediate(() => requestQuit())
            break
          default: send(400, { error: 'unknown_command' })
        }
      } catch {
        send(400, { error: 'command_failed' }) // Do not echo JS, payloads or exception input.
      }
    })
    await new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', resolve)
    })
    app.once('will-quit', () => server.close())
    emit({ event: 'control', port: server.address().port })
  }
  return { records, outlets, backendCommand, startControl, get testEvents() { return testEvents } }
}
function loadTestEvents() {
  const file = process.env.FAI_TEST_EVENTS
  if (file === undefined) return { events: Object.freeze([]) }
  if (!path.isAbsolute(file)) return { error: 'file_unreadable' }
  let bytes
  try { bytes = fs.readFileSync(file) } catch { return { error: 'file_unreadable' } }
  let events
  try { events = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) } catch {
    return { error: 'json_invalid' }
  }
  if (!Array.isArray(events)) return { error: 'not_array' }
  for (const event of events) {
    const error = validateEvent(event)
    if (error) return { error }
  }
  return { events: Object.freeze(events.map(event => Object.freeze(event))) }
}
function emit(message) { process.stdout.write(`SMOKE ${JSON.stringify(message)}\n`) }
module.exports = { install }
