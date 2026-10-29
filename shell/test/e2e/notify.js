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
      { type: 'job.stage_completed', jobId: 'one', stage: '提取', delayMs: 300 },
      { type: 'job.finished', jobId: 'one', delayMs: 1500 },
    ]))
    const app = await ctx.launch({ env: { FAI_TEST_EVENTS: file,
      FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    const notified = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.records.notifications.length ? s : null
    })
    ctx.expectEqual('收到 stage_completed 通知', notified.records.notifications, [
      { kind: 'stage_completed', title: 'FuturesAI', body: '作业阶段已完成。' },
    ])
    ctx.expectEqual('通知时托盘运行中', notified.tray.state, 'running')
    await ctx.waitFor(async () => (await ctx.snapshot(app)).activity.jobs.every(job => job.status !== 'running'))
    ctx.expectEqual('阶段通知恰一条', (await ctx.snapshot(app)).records.notifications.length, 1)
  },
}
