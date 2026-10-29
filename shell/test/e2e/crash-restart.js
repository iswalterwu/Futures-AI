'use strict'
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { httpJson } = require('../../src/backend')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    const app = await ctx.launch()
    const before = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.backend.phase === 'ready' ? s : null
    }, 20000)
    const endpoint = path.join(app.paths.stateDir, 'run', 'host.json')
    const oldToken = JSON.parse(fs.readFileSync(endpoint, 'utf8')).token
    ctx.expectEqual('真实写锁存在', fs.existsSync(path.join(app.paths.dataRoot, 'data', '.lock')), true)
    const killed = spawnSync('taskkill', ['/PID', String(before.backend.pid), '/T', '/F'], { windowsHide: true, timeout: 5000 })
    ctx.expectEqual('定向结束后端成功', killed.status, 0)
    const errored = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.tray.state === 'error' ? s : null
    })
    ctx.expectEqual('托盘曾为 error', errored.tray.state, 'error')
    const after = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app)
      return s.backend.gen === 2 && s.backend.phase === 'ready' ? s : null
    }, 20000)
    ctx.expectEqual('重启后就绪且端口变化', [after.backend.phase, after.backend.port !== before.backend.port], ['ready', true])
    ctx.expectEqual('restarts = 1', after.backend.restarts, 1)
    ctx.expectEqual('旧进程已死且新进程存活', [ctx.alive(before.backend.pid), ctx.alive(after.backend.pid)], [false, true])
    ctx.expectEqual('新代令牌已轮换', JSON.parse(fs.readFileSync(endpoint, 'utf8')).token !== oldToken, true)
    const health = await httpJson(after.backend.port, null, 'GET', '/health')
    ctx.expectEqual('新端点真实健康', [health.status, health.body.status, health.body.data_ready], [200, 'ok', true])
    const bridged = (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.getBackend()' })).value
    ctx.expectEqual('preload 返回新代端口', bridged.port, after.backend.port)
    ctx.expectEqual('preload 返回新代令牌', bridged.token === JSON.parse(fs.readFileSync(endpoint, 'utf8')).token, true)
    ctx.expectIncludes('真实阶段包含 restarting', after.backend.phases, 'restarting')
    ctx.expectEqual('重启后托盘与活动来自真实状态', [after.tray.state, after.activity.accepting], ['idle', true])
    ctx.expectIncludes('通知含 backend_error', after.records.notifications.map(item => item.kind), 'backend_error')
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
  },
}
