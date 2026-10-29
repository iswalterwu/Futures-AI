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
      { type: 'job.queued', jobId: 'queue', title: '排队作业', delayMs: 100 },
      { type: 'job.queued', jobId: 'new-queue', title: '新排队', delayMs: 2000 },
      { type: 'job.started', jobId: 'new-start', title: '新启动', delayMs: 2000 },
      { type: 'job.finished', jobId: 'one', delayMs: 4500 },
    ]))
    const app = await ctx.launch({ env: { FAI_TEST_EVENTS: file,
      FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).activity.jobs.length === 2)
    await ctx.cmd(app, { command: 'answer', queue: [{ type: 'message', button: '等待完成后退出' }] })
    await ctx.cmd(app, { command: 'request-quit' })
    const waiting = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.activity.jobs.length === 4 ? s : null
    })
    ctx.expectIncludes('对话框列出排队作业', waiting.records.dialogs[0].detail, '排队作业')
    ctx.expectEqual('对话框有显式应答', waiting.records.dialogs[0].unanswered, false)
    ctx.expectEqual('等待时停止接单', [waiting.activity.accepting, waiting.activity.waiting], [false, true])
    ctx.expectEqual('排队取消新到拒收', waiting.activity.jobs.map(job => [job.jobId, job.status]), [
      ['one', 'running'], ['queue', 'cancelled_on_exit'], ['new-queue', 'rejected_exiting'], ['new-start', 'rejected_exiting'],
    ])
    const log = fs.readFileSync(path.join(app.paths.stateDir, 'log', 'shell.log'), 'utf8')
    ctx.expectIncludes('日志含 cancelled_on_exit', log, 'activity cancelled_on_exit')
    ctx.expectIncludes('日志含 rejected_exiting', log, 'activity rejected_exiting')
    ctx.expectIncludes('托盘提示取消标记', waiting.tray.tooltip, 'cancelled_on_exit')
    ctx.expectIncludes('托盘提示拒收标记', waiting.tray.tooltip, 'rejected_exiting')
    ctx.expectIncludes('等待时提供取消退出', waiting.tray.menu.map(item => item.label), '取消退出')
    ctx.expectEqual('作业结束后退出码 0', await ctx.waitExit(app), 0)
    ctx.expectEqual('等待退出后后端已退出', ctx.alive(waiting.backend.pid), false)
  },
}
