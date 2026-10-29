'use strict'
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')

module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const env = { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) }
    const first = await ctx.launch({ env })
    const before = await ctx.waitFor(async () => {
      const current = await ctx.snapshot(first)
      return current.window.visible && current.backend.phase === 'ready' ? current : null
    })
    ctx.expectEqual('首实例后端存活', ctx.alive(before.backend.pid), true)
    ctx.expectEqual('首次 spawns 恰 1 条', ctx.registry().length, 1)
    const start = Date.now()
    const second = await ctx.launch({ env, second: true })
    ctx.expectEqual('第二实例退出码 0', await ctx.waitExit(second, Math.max(1, 10000 - (Date.now() - start))), 0)
    ctx.expectEqual('第二实例 10s 内退出', Date.now() - start < 10000, true)
    ctx.expectEqual('第二实例 OS PID 已退出', ctx.alive(second.child.pid), false)
    ctx.expectEqual('第二实例与首实例共享隔离状态目录', second.paths.stateDir, first.paths.stateDir)
    ctx.expectEqual('锁失败者未解析数据目录', second.paths.dataRoot, null)
    const after = await ctx.waitFor(async () => {
      const current = await ctx.snapshot(first)
      return current.records.secondInstance.length > 0 ? current : null
    })
    ctx.expectEqual('secondInstance 恰 1 条', after.records.secondInstance.length, 1)
    ctx.expectEqual('restore/show/focus 真实调用记录', after.records.secondInstance[0].calls, ['restore', 'show', 'focus'])
    ctx.expectEqual('spawns 恰 1 条', ctx.registry().length, 1)
    ctx.expectEqual('后端 pid/端口不变', [after.backend.pid, after.backend.port], [before.backend.pid, before.backend.port])
    ctx.expectEqual('registry 只有首实例后端 PID', ctx.registry().map(entry => entry.pid), [before.backend.pid])
    ctx.expectEqual('首实例 Electron 仍存活', ctx.alive(first.child.pid), true)
    ctx.expectEqual('首实例后端仍存活', ctx.alive(before.backend.pid), true)
    ctx.expectEqual('首窗口可见', after.window.visible, true)
    await ctx.cmd(first, { command: 'request-quit' })
    ctx.expectEqual('首实例退出码 0', await ctx.waitExit(first), 0)
    ctx.expectEqual('退出后 spawns 仍恰 1 条', ctx.registry().length, 1)
    // Windows foreground focus is manual M-09, not asserted here.
  },
}
