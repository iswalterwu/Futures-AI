'use strict'
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { resolveTarget } = require('../../src/paths')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
const stub = path.resolve(__dirname, '../fixtures/frontend-stub')
module.exports = {
  requires: { tools: ['python', 'taskkill', 'powershell'], files: [fake, path.join(stub, 'index.html'), require('electron')] },
  async run(ctx) {
    const env = { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']), FAI_FRONTEND_DIST: stub }
    const app = await ctx.launch({ args: ['--mock'], env })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).window.url.endsWith('/frontend-stub/index.html'))
    const mode = await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js: "document.getElementById('mode')?.textContent" })).value)
    ctx.expectEqual('mode = mock', mode, 'mock')
    ctx.expectEqual('getBackend = null', (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.getBackend()' })).value, null)
    const snapshot = await ctx.snapshot(app)
    ctx.expectEqual('无后端进程', [snapshot.backend.pid, snapshot.backend.gen], [null, 0])
    ctx.expectEqual('夹具没有 spawn', ctx.registry().length, 0)
    ctx.expectEqual('registry 文件不存在', fs.existsSync(path.join(ctx.env.FAI_FAKE_REGISTRY, 'spawns.jsonl')), false)
    const children = spawnSync('powershell', ['-NoProfile', '-Command',
      `@(Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq ${app.child.pid} -and ($_.Name -match '^python' -or $_.Name -eq 'futuresai-backend.exe') }).Count`],
    { windowsHide: true, encoding: 'utf8', timeout: 10000 })
    ctx.expectEqual('OS 子进程核查成功', children.status, 0)
    ctx.expectEqual('OS 无后端子进程', children.stdout.trim(), '0')
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('mock 退出码 0', await ctx.waitExit(app), 0)
    const builtin = await ctx.launch({ env: { FAI_MODE: 'mock', FAI_BACKEND_CMD: env.FAI_BACKEND_CMD } })
    await ctx.waitFor(async () => (await ctx.snapshot(builtin)).window.url.endsWith('/onboarding.html'))
    const banner = await ctx.waitFor(async () => {
      const value = (await ctx.cmd(builtin, { command: 'eval', js: `(()=>{const b=document.getElementById('mock-banner');return b && !b.hidden ? b.textContent : null})()` })).value
      return value
    })
    ctx.expectIncludes('内置页 mock 横幅可见', banner, 'Mock 模式')
    ctx.expectIncludes('明确设置业务不可用', banner, '设置业务不可用')
    ctx.expectEqual('环境变量显式 mock', (await ctx.cmd(builtin, { command: 'eval', js: 'window.futuresai.mode' })).value, 'mock')
    ctx.expectEqual('内置 mock 也未 spawn', [(await ctx.snapshot(builtin)).backend.gen, ctx.registry().length], [0, 0])
    await ctx.cmd(builtin, { command: 'request-quit' })
    ctx.expectEqual('内置 mock 退出码 0', await ctx.waitExit(builtin), 0)
    // Real resolver with temporary app-config fixtures; not a packaged app acceptance.
    const resources = path.join(ctx.root, 'resources')
    fs.mkdirSync(resources)
    const shellDir = path.resolve(__dirname, '../..')
    ctx.expectEqual('缺失打包配置不静默 builtin', resolveTarget({ isPackaged: true }, {}, resources, shellDir).error,
      { code: 'frontend_missing', path: path.join(resources, 'app-config.json') })
    fs.writeFileSync(path.join(resources, 'app-config.json'), 'null')
    ctx.expectEqual('配置形状无效返回资源错误而非抛异常', resolveTarget({ isPackaged: true }, {}, resources, shellDir).error.code, 'frontend_missing')
    fs.writeFileSync(path.join(resources, 'app-config.json'), JSON.stringify({ frontend: 'bundled' }))
    ctx.expectEqual('bundled 路径不因文件缺失回退', resolveTarget({ isPackaged: true }, env, resources, shellDir).target,
      path.join(resources, 'frontend', 'index.html'))
    fs.writeFileSync(path.join(resources, 'app-config.json'), JSON.stringify({ frontend: 'builtin' }))
    ctx.expectEqual('明确 builtin 使用内置页', resolveTarget({ isPackaged: true }, env, resources, shellDir).target,
      path.join(shellDir, 'renderer', 'onboarding.html'))
  },
}
