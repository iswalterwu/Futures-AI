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
    const ui = (await ctx.cmd(app, { command: 'eval', js: `({title:document.getElementById('title').textContent, node:typeof require, mode:window.futuresai.mode, keys:Object.keys(window.futuresai).sort()})` })).value
    ctx.expectEqual('状态文字为正在启动', ui.title, '正在启动')
    ctx.expectEqual('渲染层无 Node', ui.node, 'undefined')
    ctx.expectEqual('稳定 backend mode', ui.mode, 'backend')
    ctx.expectEqual('仅当前 preload 子集', ui.keys, ['getBackend', 'mode', 'onShellStatus', 'openLogs', 'retryStartup'])
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
