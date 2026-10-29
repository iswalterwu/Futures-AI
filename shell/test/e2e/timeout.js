'use strict'
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const app = await ctx.launch({ env: { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'hang']), FAI_HEALTH_TIMEOUT_MS: '3000' } })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).backend.phase === 'failed')
    await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js: 'document.body.dataset.code' })).value === 'health_timeout')
    const before = await ctx.snapshot(app)
    const page = (await ctx.cmd(app, { command: 'eval', js: `({code:document.body.dataset.code, buttons:[...document.querySelectorAll('button')].filter(b=>!b.disabled && !b.parentElement.hidden).map(b=>b.textContent), mode:window.futuresai.mode})` })).value
    ctx.expectEqual('health_timeout 页含重试与查看日志', [page.code, page.buttons], ['health_timeout', ['重试', '查看日志']])
    ctx.expectEqual('失败不静默转 mock', page.mode, 'backend')
    ctx.expectEqual('超时后端先退出', ctx.registry().map(p => ctx.alive(p.pid)), [false])
    ctx.expectEqual('失败 getBackend null', (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.getBackend()' })).value, null)
    await ctx.cmd(app, { command: 'eval', js: `document.getElementById('logs').click(); true` })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.external.length === 1)
    ctx.expectEqual('查看日志实际调用固定路径', (await ctx.snapshot(app)).records.external,
      [{ method: 'openPath', value: path.join(app.paths.stateDir, 'log') }])
    // Prove unsubscribe, not merely the presence of a function in the bridge.
    await ctx.cmd(app, { command: 'eval', js: `window.statusCalls=0; window.unsubscribeStatus=window.futuresai.onShellStatus(()=>window.statusCalls++); true` })
    await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js: 'window.statusCalls' })).value > 0)
    const calls = (await ctx.cmd(app, { command: 'eval', js: 'window.unsubscribeStatus(); window.statusCalls' })).value
    await ctx.cmd(app, { command: 'eval', js: `document.getElementById('retry').click(); true` })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).backend.gen === before.backend.gen + 1)
    ctx.expectEqual('重试后 gen+1', (await ctx.snapshot(app)).backend.gen, before.backend.gen + 1)
    ctx.expectEqual('unsubscribe 后不再回调', (await ctx.cmd(app, { command: 'eval', js: 'window.statusCalls' })).value, calls)
    ctx.expectEqual('重试不重叠进程', ctx.registry().filter(p => ctx.alive(p.pid)).length <= 1, true)
    await ctx.waitFor(async () => (await ctx.snapshot(app)).backend.phase === 'failed')
    ctx.expectEqual('无残留后端', ctx.registry().map(p => ctx.alive(p.pid)), [false, false])
    ctx.expectEqual('重试预算归零', (await ctx.snapshot(app)).backend.restarts, 0)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
  },
}
