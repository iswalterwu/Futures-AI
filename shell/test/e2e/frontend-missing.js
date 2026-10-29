'use strict'
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const stub = path.resolve(__dirname, '../fixtures/frontend-stub/index.html')
module.exports = {
  timeoutMs: 45000,
  requires: { tools: ['python', 'taskkill'], files: [stub, require('electron')] },
  async run(ctx) {
    const root = ctx.owned(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))
    const seed = spawnSync('python', ['-c',
      'import sys; from pathlib import Path; from settings.onboarding import set_onboard_state; set_onboard_state(Path(sys.argv[1]), completed=True)', root],
    { cwd: path.resolve(__dirname, '../../../backend'), env: { ...ctx.env, PYTHONIOENCODING: 'utf-8' },
      encoding: 'utf8', windowsHide: true, timeout: 10000 })
    ctx.expectEqual('真实核心设置引导完成', seed.status, 0)
    if (seed.status !== 0) throw new Error('core fixture failed (payload not logged)')
    const frontend = ctx.owned(path.join(ctx.root, 'missing-frontend'))
    const app = await ctx.launch({ env: { FAI_FRONTEND_DIST: frontend } })
    const page = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app)
      if (!s.window.url.endsWith('/startup.html')) return null
      const value = (await ctx.cmd(app, { command: 'eval', js: `({code:document.body.dataset.code,text:document.body.textContent})` })).value
      return value.code ? value : null
    }, 20000)
    ctx.expectEqual('页面 code = frontend_missing', page.code, 'frontend_missing')
    ctx.expectIncludes('含资源路径', page.text, path.join(frontend, 'index.html'))
    ctx.expectIncludes('含重试与打开日志', page.text, '重试')
    ctx.expectIncludes('查看日志按钮存在', page.text, '查看日志')
    ctx.expectEqual('非白屏错误页可见', (await ctx.snapshot(app)).window.visible, true)
    const ready = (await ctx.snapshot(app)).backend
    ctx.expectEqual('真实后端保持 ready', ready.phase, 'ready')
    ctx.expectEqual('未静默 mock', (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.mode' })).value, 'backend')
    await ctx.cmd(app, { command: 'eval', js: `document.getElementById('logs').click(); true` })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.external.length === 1)
    ctx.expectEqual('日志动作真实固定目录', (await ctx.snapshot(app)).records.external,
      [{ method: 'openPath', value: path.join(app.paths.stateDir, 'log') }])
    // Restore only this scene's frontend fixture, never repository resources.
    fs.mkdirSync(frontend)
    fs.copyFileSync(stub, path.join(frontend, 'index.html'))
    await ctx.cmd(app, { command: 'eval', js: `document.getElementById('retry').click(); true` })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).window.url.endsWith('/missing-frontend/index.html'))
    const mode = await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js: "document.getElementById('mode')?.textContent" })).value)
    ctx.expectEqual('补齐资源后重试成功', mode, 'backend')
    ctx.expectEqual('重载资源不重启后端', (await ctx.snapshot(app)).backend.gen, ready.gen)
    ctx.expectEqual('重载后 getBackend 当前端口', (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.getBackend().then(b=>b.port)' })).value, ready.port)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
    const missing = await ctx.launch({ env: { FAI_BACKEND_EXE: path.join(ctx.root, 'absent-backend.exe') } })
    await ctx.waitFor(async () => (await ctx.snapshot(missing)).backend.phase === 'failed')
    const backendCode = await ctx.waitFor(async () => (await ctx.cmd(missing, { command: 'eval', js: 'document.body.dataset.code' })).value)
    ctx.expectEqual('后端缺失显示 backend_missing', backendCode, 'backend_missing')
    ctx.expectEqual('后端缺失不静默 mock', (await ctx.cmd(missing, { command: 'eval', js: 'window.futuresai.mode' })).value, 'backend')
    ctx.expectEqual('后端缺失 getBackend null', (await ctx.cmd(missing, { command: 'eval', js: 'window.futuresai.getBackend()' })).value, null)
    ctx.expectEqual('后端缺失不重启', (await ctx.snapshot(missing)).backend.restarts, 0)
    await ctx.cmd(missing, { command: 'request-quit' })
    ctx.expectEqual('错误实例退出码 0', await ctx.waitExit(missing), 0)
  },
}
