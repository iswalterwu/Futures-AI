'use strict'
const fs = require('node:fs')
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const app = await ctx.launch({ env: { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'slow-ready:3000']) } })
    const starting = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.window.visible ? s : null
    })
    ctx.expectEqual('就绪前窗口可见', [starting.window.visible, starting.backend.phases.includes('ready')], [true, false])
    ctx.expectMatch('就绪前是本地启动页', starting.window.url, /\/startup\.html$/)
    const ui = (await ctx.cmd(app, { command: 'eval', js: `({title:document.getElementById('title').textContent, node:typeof require, mode:window.futuresai.mode, keys:Object.keys(window.futuresai).sort(), types:Object.fromEntries(Object.entries(window.futuresai).map(([key,value])=>[key,typeof value]))})` })).value
    ctx.expectEqual('状态文字为正在启动', ui.title, '正在启动')
    ctx.expectEqual('渲染层无 Node', ui.node, 'undefined')
    ctx.expectEqual('稳定 backend mode', ui.mode, 'backend')
    const APPROVED = ['chooseDataRoot', 'checkForUpdates', 'dismissUpdate', 'exportDiagnostics', 'getAppInfo', 'getBackend', 'getLastCrash', 'getShellPrefs', 'getUpdateState', 'mode', 'onShellStatus', 'openLogs', 'openMain', 'openSettings', 'openUpdateDownload', 'relaunch', 'retryStartup', 'setShellPrefs']
    const REQUIRED_NOW = ['getBackend', 'mode', 'onShellStatus', 'openLogs', 'openMain', 'openSettings', 'retryStartup']
    const FORBIDDEN = ['ipcRenderer', 'shell', 'require', 'process', 'fs', 'openExternal', 'openUrl', 'openPath', 'send', 'invoke', 'loadURL', 'navigate']
    ctx.expectEqual('仅批准的 preload 成员', ui.keys.filter(key => !APPROVED.includes(key)), [])
    ctx.expectEqual('当前必需成员齐全', REQUIRED_NOW.filter(key => !ui.keys.includes(key)), [])
    ctx.expectEqual('成员类型符合契约', ui.types, Object.fromEntries(ui.keys.map(key => [key, key === 'mode' ? 'string' : 'function'])))
    ctx.expectEqual('不暴露高权限对象或任意导航', FORBIDDEN.filter(key => ui.keys.includes(key)), [])
    ctx.expectEqual('未就绪 getBackend null', (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.getBackend()' })).value, null)
    await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.backend.phase === 'ready' && s.window.url.endsWith('/onboarding.html')
    })
    const logFile = path.join(app.paths.stateDir, 'log', 'shell.log')
    const line = await ctx.waitFor(() => fs.readFileSync(logFile, 'utf8').split('\n').find(s => s.includes('startup_timing ')))
    ctx.expectIncludes('日志含 startup_timing', line, 'startup_timing')
    const timing = JSON.parse(line.split('startup_timing ')[1])
    ctx.expectEqual('shown/ready/interactive 真实顺序', timing.shown_ms < timing.ready_ms && timing.ready_ms <= timing.interactive_ms, true)
    ctx.expectEqual('就绪后 getBackend 为当前端口', (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.getBackend().then(b=>b.port)' })).value, (await ctx.snapshot(app)).backend.port)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
  },
}
