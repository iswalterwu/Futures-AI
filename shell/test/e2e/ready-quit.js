'use strict'
const fs = require('node:fs')
const path = require('node:path')
const net = require('node:net')
const { httpJson } = require('../../src/backend')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    const app = await ctx.launch()
    const ready = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.backend.phase === 'ready' ? s : null
    }, 20000)
    ctx.expectEqual('真实后端存活', ctx.alive(ready.backend.pid), true)
    const health = await httpJson(ready.backend.port, null, 'GET', '/health')
    ctx.expectEqual('真实 health 200+ok+data_ready', [health.status, health.body.status, health.body.data_ready], [200, 'ok', true])
    ctx.expectEqual('真实写锁存在', fs.existsSync(path.join(app.paths.dataRoot, 'data', '.lock')), true)
    ctx.expectEqual('真实只读端点存在', fs.existsSync(path.join(app.paths.dataRoot, 'data', 'mcp_endpoint.json')), true)
    ctx.expectEqual('host.json 在状态目录 run', fs.existsSync(path.join(app.paths.stateDir, 'run', 'host.json')), true)
    ctx.expectEqual('数据根无 host.json', fs.existsSync(path.join(app.paths.dataRoot, 'host.json')), false)
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    console.log(`RUNTIME ${JSON.stringify(ready.versions)}`)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
    ctx.expectEqual('后端 pid 已退出', ctx.alive(ready.backend.pid), false)
    ctx.expectEqual('无 .lock', fs.existsSync(path.join(app.paths.dataRoot, 'data', '.lock')), false)
    ctx.expectEqual('无 mcp_endpoint.json', fs.existsSync(path.join(app.paths.dataRoot, 'data', 'mcp_endpoint.json')), false)
    ctx.expectEqual('host.json 已删', fs.existsSync(path.join(app.paths.stateDir, 'run', 'host.json')), false)
    const server = net.createServer()
    try {
      await new Promise((resolve, reject) => { server.once('error', reject); server.listen(ready.backend.port, '127.0.0.1', resolve) })
      ctx.expectEqual('端口已释放', server.address().port, ready.backend.port)
    } finally { await new Promise(resolve => server.close(resolve)) }
  },
}
