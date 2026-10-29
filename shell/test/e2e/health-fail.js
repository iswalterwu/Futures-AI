'use strict'
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const app = await ctx.launch({ env: { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'health-fail']), FAI_HEALTH_TIMEOUT_MS: '3000' } })
    const failed = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.backend.phase === 'failed' ? s : null
    })
    ctx.expectEqual('phases 不含 ready', failed.backend.phases.includes('ready'), false)
    ctx.expectEqual('lastCode = health_timeout', failed.backend.lastCode, 'health_timeout')
    ctx.expectEqual('spawns 恰 1', ctx.registry().length, 1)
    ctx.expectEqual('无残留后端', ctx.registry().map(p => ctx.alive(p.pid)), [false])
    ctx.expectEqual('无自动重启', failed.backend.restarts, 0)
    const code = await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js: 'document.body.dataset.code' })).value)
    ctx.expectEqual('显示 health_timeout 页', code, 'health_timeout')
    ctx.expectEqual('错误页可见', (await ctx.snapshot(app)).window.visible, true)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
  },
}
