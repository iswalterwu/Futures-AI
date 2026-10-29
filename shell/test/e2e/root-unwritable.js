'use strict'
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
module.exports = {
  requires: { tools: ['python', 'taskkill', 'icacls', 'whoami'], files: [require('electron')] },
  async run(ctx) {
    const root = ctx.owned(path.join(ctx.root, 'denied-data'))
    fs.mkdirSync(root)
    const identity = spawnSync('whoami', [], { encoding: 'utf8', windowsHide: true, timeout: 5000 })
    if (identity.status !== 0) throw new Error('whoami failed')
    const user = identity.stdout.trim()
    let denied = false
    const restore = () => {
      if (!denied) return
      const result = spawnSync('icacls', [root, '/remove:d', user], { windowsHide: true, timeout: 5000 })
      if (result.status !== 0) throw new Error('ACL restoration failed')
      denied = false
      fs.writeFileSync(path.join(root, 'restored-write-proof'), 'restored')
      ctx.expectEqual('ACL 已恢复', fs.readFileSync(path.join(root, 'restored-write-proof'), 'utf8'), 'restored')
    }
    ctx.restorers.push(restore)
    const deny = spawnSync('icacls', [root, '/deny', `${user}:(W)`], { windowsHide: true, timeout: 5000 })
    denied = true // restore even if icacls reports a partial failure
    if (deny.status !== 0) throw new Error('ACL denial failed')
    try {
      let errorCode = null
      try { fs.writeFileSync(path.join(root, 'must-not-write'), 'no') } catch (error) { errorCode = error.code }
      ctx.expectEqual('真实拒写证明', ['EACCES', 'EPERM'].includes(errorCode), true)
      const app = await ctx.launch({ env: { FAI_DATA_ROOT: root } })
      const page = await ctx.waitFor(async () => {
        const s = await ctx.snapshot(app)
        if (!s.window.visible) return null
        const value = (await ctx.cmd(app, { command: 'eval', js: `({code:document.body.dataset.code,text:document.body.textContent})` })).value
        return value.code ? value : null
      })
      ctx.expectEqual('页面 code = data_root_unwritable', page.code, 'data_root_unwritable')
      ctx.expectIncludes('含路径与权限不足', page.text, root)
      ctx.expectIncludes('明确权限不足原因', page.text, '权限不足')
      ctx.expectEqual('数据目录未改到临时目录', app.paths.dataRoot, root)
      ctx.expectEqual('探测失败不 spawn 后端', (await ctx.snapshot(app)).backend.gen, 0)
      ctx.expectEqual('未创建默认替代数据目录', fs.existsSync(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI')), false)
      restore()
      await ctx.cmd(app, { command: 'eval', js: `document.getElementById('retry').click(); true` })
      await ctx.waitFor(async () => (await ctx.snapshot(app)).backend.phase === 'ready', 20000)
      ctx.expectEqual('修复权限后真实重试成功', (await ctx.snapshot(app)).backend.gen, 1)
      await ctx.cmd(app, { command: 'request-quit' })
      ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
    } finally { restore() }
  },
}
