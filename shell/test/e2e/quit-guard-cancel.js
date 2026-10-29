'use strict'
const fs = require('node:fs')
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const file = ctx.owned(path.join(ctx.root, 'events.json'))
    fs.writeFileSync(file, JSON.stringify([
      { type: 'job.started', jobId: 'one', title: '运行作业', delayMs: 100 },
      { type: 'job.finished', jobId: 'one', delayMs: 4000 },
    ]))
    const app = await ctx.launch({ env: { FAI_TEST_EVENTS: file,
      FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    const before = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.tray.state === 'running' ? s : null
    })
    await ctx.cmd(app, { command: 'answer', queue: [{ type: 'message', button: '取消退出' }] })
    await ctx.cmd(app, { command: 'request-quit' })
    const cancelled = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.records.dialogs.length === 1 ? s : null
    })
    ctx.expectEqual('应用仍在', ctx.alive(app.child.pid), true)
    ctx.expectEqual('后端存活', ctx.alive(cancelled.backend.pid), true)
    ctx.expectEqual('作业仍运行', cancelled.activity.jobs, [{ jobId: 'one', title: '运行作业', status: 'running' }])
    ctx.expectEqual('取消询问不改活动', cancelled.activity, before.activity)
    await ctx.cmd(app, { command: 'answer', queue: [{ type: 'message', button: '等待完成后退出' }] })
    await ctx.cmd(app, { command: 'tray-click', path: ['退出'] })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).activity.waiting)
    await ctx.cmd(app, { command: 'tray-click', path: ['取消退出'] })
    const resumed = await ctx.snapshot(app)
    ctx.expectEqual('托盘取消等待恢复接单', [resumed.activity.accepting, resumed.activity.waiting], [true, false])
    ctx.expectEqual('对话框均有显式应答', resumed.records.dialogs.map(item => item.unanswered), [false, false])
    await ctx.waitFor(async () => (await ctx.snapshot(app)).activity.jobs.every(job => job.status !== 'running'))
    ctx.expectEqual('取消等待后不自动退出', ctx.alive(app.child.pid), true)
  },
}
