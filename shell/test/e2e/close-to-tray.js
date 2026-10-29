'use strict'
const fs = require('node:fs')
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const file = ctx.owned(path.join(ctx.root, 'events.json'))
    fs.writeFileSync(file, JSON.stringify([
      { type: 'job.started', jobId: 'one', title: '夹具作业', delayMs: 100 },
      { type: 'job.finished', jobId: 'one', delayMs: 4000 },
    ]))
    const app = await ctx.launch({ env: { FAI_TEST_EVENTS: file,
      FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.window.visible && s.tray.state === 'running'
    })
    await ctx.cmd(app, { command: 'close-window' })
    const hidden = await ctx.snapshot(app)
    ctx.expectEqual('窗口隐藏未销毁', [hidden.window.visible, hidden.window.exists], [false, true])
    ctx.expectEqual('后端存活', ctx.alive(hidden.backend.pid), true)
    ctx.expectEqual('托盘 running', hidden.tray.state, 'running')
    await ctx.waitFor(async () => (await ctx.snapshot(app)).activity.jobs.every(job => job.status !== 'running'))
    ctx.expectEqual('夹具作业完成后清理', (await ctx.snapshot(app)).activity.jobs[0].status, 'finished')
  },
}
