'use strict'
const fs = require('node:fs')
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const prefsFile = ctx.owned(path.join(ctx.env.FAI_SHELL_STATE_DIR, 'shell-prefs.json'))
    fs.mkdirSync(path.dirname(prefsFile), { recursive: true })
    fs.writeFileSync(prefsFile, JSON.stringify({ schema: 1, closeBehavior: 'tray', notifications: false,
      updateCheck: 'startup', dataRoot: null, pendingDataRoot: null }))
    const file = ctx.owned(path.join(ctx.root, 'events.json'))
    fs.writeFileSync(file, JSON.stringify([
      { type: 'job.started', jobId: 'one', title: '夹具作业', delayMs: 100 },
      { type: 'job.stage_completed', jobId: 'one', stage: '提取', delayMs: 300 },
      { type: 'job.finished', jobId: 'one', delayMs: 1500 },
    ]))
    const app = await ctx.launch({ env: { FAI_TEST_EVENTS: file,
      FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    const running = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.tray.state === 'running' ? s : null
    })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).activity.jobs.every(job => job.status !== 'running'))
    const finished = await ctx.snapshot(app)
    ctx.expectEqual('无通知记录', finished.records.notifications, [])
    ctx.expectEqual('托盘状态仍变化', [running.tray.state, finished.tray.state], ['running', 'idle'])
    ctx.expectEqual('实际通知偏好关闭', finished.activity.notifications, false)
  },
}
