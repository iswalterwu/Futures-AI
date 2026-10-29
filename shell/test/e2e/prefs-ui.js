'use strict'
const fs = require('node:fs')
const path = require('node:path')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    const first = await ctx.launch()
    await ctx.waitFor(async () => (await ctx.snapshot(first)).backend.phase === 'ready', 20000)
    await ctx.waitFor(async () => (await ctx.cmd(first, { command: 'eval', js:
      "document.querySelector('#view-onboard')?.classList.contains('active') && !!document.querySelector('#data-root')?.textContent" })).value)
    await ctx.cmd(first, { command: 'eval', js: "document.querySelector('#skip-onboard').click()" })
    await ctx.waitFor(async () => (await ctx.cmd(first, { command: 'eval', js:
      "document.querySelector('#view-settings')?.classList.contains('active') && !!document.querySelector('#data-root')?.textContent" })).value)
    const file = ctx.owned(path.join(first.paths.stateDir, 'shell-prefs.json'))
    await ctx.cmd(first, { command: 'eval', js: "document.querySelector('#notifications').click()" })
    await ctx.waitFor(() => fs.existsSync(file) && JSON.parse(fs.readFileSync(file, 'utf8')).notifications === false)
    ctx.expectEqual('notifications=false 已持久化', JSON.parse(fs.readFileSync(file, 'utf8')).notifications, false)
    await ctx.cmd(first, { command: 'eval', js: "document.querySelector('#close-behavior').value='quit'; document.querySelector('#close-behavior').dispatchEvent(new Event('change'))" })
    await ctx.waitFor(() => JSON.parse(fs.readFileSync(file, 'utf8')).closeBehavior === 'quit')
    ctx.expectEqual('closeBehavior 已持久化', JSON.parse(fs.readFileSync(file, 'utf8')).closeBehavior, 'quit')
    ctx.expectEqual('未配置更新源时禁用并说明', (await ctx.cmd(first, { command: 'eval', js:
      "[document.querySelector('#update-check').disabled, document.querySelector('#update-note').textContent]" })).value,
    [true, '未配置更新源，启动时检查更新不可用。'])
    for (const patch of [null, [], { notifications: 'false' }, { closeBehavior: 'hide' }, { updateCheck: true }, { schema: 2 }, { dataRoot: 'relative' }, { unknown: true }]) {
      const before = fs.readFileSync(file, 'utf8')
      const result = (await ctx.cmd(first, { command: 'eval', js: `window.futuresai.setShellPrefs(${JSON.stringify(patch)})` })).value
      ctx.expectEqual('非法 patch 被拒且文件不变', [Boolean(result.error), fs.readFileSync(file, 'utf8')], [true, before])
    }
    await ctx.cmd(first, { command: 'request-quit' })
    ctx.expectEqual('首实例退出码 0', await ctx.waitExit(first), 0)
    const second = await ctx.launch()
    await ctx.waitFor(async () => (await ctx.snapshot(second)).backend.phase === 'ready', 20000)
    const displayed = await ctx.waitFor(async () => {
      const value = (await ctx.cmd(second, { command: 'eval', js:
        "document.querySelector('#data-root')?.textContent ? [document.querySelector('#notifications').checked, document.querySelector('#close-behavior').value] : null" })).value
      return value
    })
    ctx.expectEqual('再次启动回显', displayed, [false, 'quit'])
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    await ctx.cmd(second, { command: 'close-window' })
    ctx.expectEqual('持久化关窗即退出生效', await ctx.waitExit(second), 0)
  },
}
