'use strict'
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const app = await ctx.launch({ env: { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'startup-failed:disk_full']) } })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).backend.phase === 'failed')
    const page = await ctx.waitFor(async () => {
      const value = (await ctx.cmd(app, { command: 'eval', js: `({code:document.body.dataset.code,text:document.body.textContent})` })).value
      return value.code ? value : null
    })
    ctx.expectEqual('页面 code = disk_full', page.code, 'disk_full')
    ctx.expectIncludes('明确磁盘空间不足', page.text, '磁盘空间不足')
    ctx.expectIncludes('显示失败目录', page.text, app.paths.dataRoot)
    ctx.expectEqual('主进程存活', ctx.alive(app.child.pid), true)
    ctx.expectEqual('startup_failed 不重启', (await ctx.snapshot(app)).backend.restarts, 0)
    ctx.expectEqual('只有一次 spawn', ctx.registry().length, 1)
    ctx.expectEqual('失败子进程已退出', ctx.registry().map(p => ctx.alive(p.pid)), [false])
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
  },
}
