'use strict'
const fs = require('node:fs')
const path = require('node:path')
const net = require('node:net')
const { spawn, spawnSync } = require('node:child_process')
module.exports = {
  timeoutMs: 45000,
  requires: { tools: ['python', 'taskkill', 'powershell'],  files: [require('electron')] },
  async run(ctx) {
    const first = await ctx.launch()
    const before = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(first); return s.backend.phase === 'ready' ? s : null
    }, 20000)
    // Retain a Windows process handle so termination cause remains observable after PID exit.
    const observer = spawn('powershell', ['-NoProfile', '-Command',
      `$p = Get-Process -Id ${before.backend.pid}; $h = $p.Handle; Write-Output 'OBSERVING'; $p.WaitForExit(); Write-Output ('EXIT_CODE=' + $p.ExitCode)`],
    { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let observation = ''
    observer.stdout.on('data', data => { observation += data })
    observer.stderr.resume()
    let observerExited = false
    observer.once('exit', () => { observerExited = true })
    ctx.restorers.push(async () => {
      if (!observerExited) {
        ctx.expectEqual('观测辅助进程无泄漏', ctx.alive(observer.pid), false)
        spawnSync('taskkill', ['/PID', String(observer.pid), '/T', '/F'], { windowsHide: true, timeout: 5000 })
      }
      ctx.expectEqual('观测辅助 PID 已退出', ctx.alive(observer.pid), false)
    })
    await ctx.waitFor(() => observation.includes('OBSERVING'))
    const start = Date.now()
    // Deliberately NOT /T: the backend must stop itself on stdin EOF.
    const killed = spawnSync('taskkill', ['/PID', String(first.child.pid), '/F'], { windowsHide: true, timeout: 5000 })
    ctx.expectEqual('仅结束外壳成功', killed.status, 0)
    await ctx.waitFor(() => !ctx.alive(before.backend.pid), Math.max(1, 5000 - (Date.now() - start)))
    ctx.expectEqual('后端 5 s 内退出', Date.now() - start <= 5000, true)
    await ctx.waitExit(first)
    await ctx.waitFor(() => observerExited)
    const exitCode = observation.match(/EXIT_CODE=(-?\d+)/)?.[1] ?? 'unknown'
    console.log(`BACKEND_AFTER_SHELL_KILL exitCode=${exitCode}`)
    ctx.expectEqual('EOF 正常退出码 0', exitCode, '0')
    ctx.expectEqual('外壳 OS PID 已退出', ctx.alive(first.child.pid), false)
    ctx.expectEqual('EOF 自行释放锁', fs.existsSync(path.join(first.paths.dataRoot, 'data', '.lock')), false)
    ctx.expectEqual('EOF 自行删除只读端点', fs.existsSync(path.join(first.paths.dataRoot, 'data', 'mcp_endpoint.json')), false)
    const server = net.createServer()
    try {
      await new Promise((resolve, reject) => { server.once('error', reject); server.listen(before.backend.port, '127.0.0.1', resolve) })
      ctx.expectEqual('EOF 释放端口', server.address().port, before.backend.port)
    } finally { await new Promise(resolve => server.close(resolve)) }
    const second = await ctx.launch()
    const after = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(second); return s.backend.phase === 'ready' ? s : null
    }, 20000)
    ctx.expectEqual('同目录重新启动', second.paths, first.paths)
    ctx.expectEqual('再启动就绪', after.backend.phase, 'ready')
    ctx.expectEqual('再启动无重试', after.backend.restarts, 0)
    ctx.expectEqual('新后端 PID', after.backend.pid !== before.backend.pid, true)
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    await ctx.cmd(second, { command: 'request-quit' })
    ctx.expectEqual('重启实例退出码 0', await ctx.waitExit(second), 0)
  },
}
