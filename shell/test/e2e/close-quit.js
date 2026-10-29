'use strict'
const fs = require('node:fs')
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const prefsFile = ctx.owned(path.join(ctx.env.FAI_SHELL_STATE_DIR, 'shell-prefs.json'))
    fs.mkdirSync(path.dirname(prefsFile), { recursive: true })
    fs.writeFileSync(prefsFile, JSON.stringify({ schema: 1, closeBehavior: 'quit', notifications: true,
      updateCheck: 'startup', dataRoot: null, pendingDataRoot: null }))
    const app = await ctx.launch({ env: { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    const ready = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.window.visible && s.backend.phase === 'ready' ? s : null
    })
    await ctx.cmd(app, { command: 'close-window' })
    ctx.expectEqual('关窗后退出码 0', await ctx.waitExit(app), 0)
    ctx.expectEqual('关窗后后端已退出', ctx.alive(ready.backend.pid), false)
  },
}
