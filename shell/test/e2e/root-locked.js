'use strict'
const fs = require('node:fs')
const path = require('node:path')
const { spawn, spawnSync } = require('node:child_process')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    // Bounded, payload-free observations; milliseconds are monotonic from scene entry.
    const origin = process.hrtime.bigint()
    const trace = (event, fields = {}) => console.log(`LOCK_TIMELINE ${JSON.stringify({ event,
      ms: Math.round(Number(process.hrtime.bigint() - origin) / 1e6), ...fields })}`)
    trace('helper-launch')
    const root = path.join(ctx.env.LOCALAPPDATA, 'FuturesAI')
    const helper = spawn('python', ['-u', '-c',
      'import os,sys; from pathlib import Path; from data.service import Service\ns=Service(Path(sys.argv[1]))\ntry:\n s.init(); print("LOCKED",flush=True); os.read(sys.stdin.fileno(),1)\nfinally:\n s.close()', root],
    { cwd: path.resolve(__dirname, '../../../backend'), env: ctx.env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
    let locked = false, exited = false, code = null
    helper.stdout.on('data', data => { if (String(data).includes('LOCKED')) locked = true })
    helper.stderr.resume()
    helper.once('exit', value => { exited = true; code = value; trace('helper-exit', { code }) })
    ctx.restorers.push(async () => {
      helper.stdin.end()
      const until = Date.now() + 5000
      while (!exited && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 50))
      if (!exited) {
        ctx.expectEqual('锁辅助进程无泄漏', ctx.alive(helper.pid), false)
        spawnSync('taskkill', ['/PID', String(helper.pid), '/T', '/F'], { windowsHide: true, timeout: 5000 })
      }
      ctx.expectEqual('锁辅助 PID 已退出', ctx.alive(helper.pid), false)
    })
    await ctx.waitFor(() => { if (exited) throw new Error('lock helper exited before lock'); return locked })
    trace('helper-ready', { pid: helper.pid })
    ctx.expectEqual('真实 Service 初始化后锁文件存在', fs.existsSync(path.join(root, 'data', '.lock')), true)
    ctx.expectEqual('真实持锁辅助进程存活', ctx.alive(helper.pid), true)
    trace('electron-launch')
    const app = await ctx.launch()
    trace('paths-control-ready', { pid: app.child.pid })
    let observed = null, previous = null
    const failed = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app)
      // Observation times, not inferred spawn/import times. Never dump full snapshots.
      const { phase, gen, restarts, pid, port, lastCode } = s.backend
      observed = { phase, gen, restarts, pid, port, lastCode, alive: pid === null ? false : ctx.alive(pid) }
      const key = JSON.stringify(observed)
      if (key !== previous) { previous = key; trace('snapshot', observed) }
      return s.backend.phase === 'failed' ? s : null
    }).catch(error => {
      trace('failed-wait-rejected', { lastObservation: observed, holderAlive: ctx.alive(helper.pid) })
      throw error // Preserve the runner's original timeout/failure and cleanup semantics.
    })
    const page = await ctx.waitFor(async () => {
      const value = (await ctx.cmd(app, { command: 'eval', js: `({code:document.body.dataset.code,text:document.body.textContent})` })).value
      return value.code ? value : null
    })
    trace('renderer', { code: page.code })
    ctx.expectEqual('页面 code = data_root_locked', page.code, 'data_root_locked')
    ctx.expectIncludes('含路径', page.text, root)
    ctx.expectIncludes('提示另一进程占用', page.text, '被另一进程占用')
    ctx.expectEqual('restarts = 0', failed.backend.restarts, 0)
    ctx.expectEqual('启动失败进程已退出', failed.backend.pid, null)
    ctx.expectEqual('持锁辅助进程未被误杀', ctx.alive(helper.pid), true)
    trace('release-helper')
    helper.stdin.end()
    await ctx.waitFor(() => exited)
    ctx.expectEqual('辅助进程优雅退出', code, 0)
    await ctx.cmd(app, { command: 'eval', js: `document.getElementById('retry').click(); true` })
    const ready = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.backend.phase === 'ready' ? s : null
    }, 20000)
    trace('retry-ready', { gen: ready.backend.gen, pid: ready.backend.pid })
    ctx.expectEqual('解除占用后真实重试成功', [ready.backend.gen, ready.backend.restarts], [2, 0])
    ctx.expectEqual('真实后端非夹具', ctx.registry().length, 0)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
    trace('electron-exit', { code: app.code })
  },
}
