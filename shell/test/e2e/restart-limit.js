'use strict'
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const app = await ctx.launch({ env: { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'crash-after-ready:300']) } })
    let maxLive = 0
    const failed = await ctx.waitFor(async () => {
      const live = ctx.registry().filter(p => ctx.alive(p.pid)).length
      maxLive = Math.max(maxLive, live)
      const s = await ctx.snapshot(app); return s.backend.phase === 'failed' ? s : null
    }, 15000)
    ctx.expectEqual('spawns 恰 4', ctx.registry().length, 4)
    ctx.expectEqual('观察到同时存活峰值 1', maxLive, 1)
    ctx.expectEqual('同时存活后端 ≤ 1', maxLive <= 1, true)
    ctx.expectEqual('lastCode = restart_limit', failed.backend.lastCode, 'restart_limit')
    ctx.expectEqual('就绪不清零预算', failed.backend.restarts, 3)
    ctx.expectEqual('每代都真实 ready', failed.backend.phases.filter(p => p === 'ready').length, 4)
    ctx.expectEqual('四个后端全退出', ctx.registry().map(p => ctx.alive(p.pid)), [false, false, false, false])
    await new Promise(resolve => setTimeout(resolve, 1700))
    ctx.expectEqual('预算用尽无第五次 spawn', ctx.registry().length, 4)
    const code = await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js: 'document.body.dataset.code' })).value)
    ctx.expectEqual('显示 restart_limit 页', code, 'restart_limit')
    ctx.expectEqual('错误页可见', (await ctx.snapshot(app)).window.visible, true)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
  },
}
