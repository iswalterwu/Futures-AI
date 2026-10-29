'use strict'
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const stub = path.resolve(__dirname, '../fixtures/frontend-stub')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [path.join(stub, 'index.html'), require('electron')] },
  async run(ctx) {
    const app = await ctx.launch({ env: { FAI_FRONTEND_DIST: stub } })
    const view = async () => {
      const s = await ctx.snapshot(app)
      if (!s.window.url.endsWith('/onboarding.html')) return null
      return (await ctx.cmd(app, { command: 'eval', js: `document.querySelector('section.active')?.id` })).value
    }
    await ctx.waitFor(async () => await view() === 'view-onboard', 20000)
    ctx.expectEqual('有前端时仍先进入引导', await view(), 'view-onboard')
    const original = (await ctx.snapshot(app)).backend
    await ctx.cmd(app, { command: 'eval', js: `document.querySelector('#skip-onboard').click(); true` })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).window.url.endsWith('/frontend-stub/index.html'))
    const mode = await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js: `document.querySelector('#mode')?.textContent` })).value)
    ctx.expectEqual('跳过后进入主界面', mode, 'backend')
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.navigation.length === 1)
    const before = await ctx.snapshot(app)
    const rejected = []
    for (const item of [undefined, 'other', '__proto__', { path: 'settings' }]) {
      rejected.push(await ctx.rawCommand(app, { command: 'app-menu-click', item }))
    }
    ctx.expectEqual('未知菜单项 400', rejected,
      Array.from({ length: 4 }, () => ({ status: 400, body: { error: 'unknown_menu_item' } })))
    const afterRejected = await ctx.snapshot(app)
    ctx.expectEqual('无效菜单输入不导航', [afterRejected.window.url, afterRejected.records.navigation],
      [before.window.url, before.records.navigation])
    ctx.expectEqual('真实菜单项点击已接受', await ctx.cmd(app, { command: 'app-menu-click', item: 'settings' }), { clicked: 'settings' })
    await ctx.waitFor(async () => await view() === 'view-settings')
    ctx.expectEqual('菜单设置… 打开设置页', await view(), 'view-settings')
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.navigation.length === 2)
    ctx.expectEqual('navigation 记录 app-menu', (await ctx.snapshot(app)).records.navigation,
      [{ action: 'open-main', via: 'renderer', result: 'opened' },
        { action: 'open-settings', via: 'app-menu', result: 'opened' }])
    await ctx.cmd(app, { command: 'eval', js: `(() => {
      const form = document.querySelector('#profile-form')
      form.elements.first_name.value = 'Supplement'
      form.requestSubmit()
      return true
    })()` })
    await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js:
      `document.querySelector('#profile-status').textContent === '档案已保存'` })).value)
    ctx.expectEqual('档案可保存', (await ctx.cmd(app, { command: 'eval', js:
      `document.querySelector('#profile-form').elements.first_name.value === 'Supplement'` })).value, true)
    await ctx.cmd(app, { command: 'eval', js: `document.querySelector('#back-main').click(); true` })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).window.url.endsWith('/frontend-stub/index.html'))
    ctx.expectEqual('返回主界面回到前端', (await ctx.snapshot(app)).window.url, before.window.url)
    // The public API is fixed-purpose: arguments cannot select a path or URL.
    await ctx.cmd(app, { command: 'eval', js: `window.futuresai.openSettings('https://invalid.example.test/'); true` })
    await ctx.waitFor(async () => await view() === 'view-settings')
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.navigation.length === 4)
    ctx.expectEqual('renderer 设置入口共用生产处理器', (await ctx.snapshot(app)).records.navigation.at(-1),
      { action: 'open-settings', via: 'renderer', result: 'opened' })
    await ctx.cmd(app, { command: 'eval', js: `window.futuresai.openMain('https://invalid.example.test/'); true` })
    await ctx.waitFor(async () => (await ctx.snapshot(app)).window.url.endsWith('/frontend-stub/index.html'))
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.navigation.length === 5)
    const final = await ctx.snapshot(app)
    ctx.expectEqual('导航忽略参数且不打开外链', [final.window.url, final.records.external], [before.window.url, []])
    ctx.expectEqual('导航不重启后端', [final.backend.gen, final.backend.pid, final.backend.port],
      [original.gen, original.pid, original.port])
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
    const checked = spawnSync('python', ['-c', `import sys,json
from pathlib import Path
from settings.profile import load
from settings.onboarding import onboard_state
root=Path(sys.argv[1]); state=onboard_state(root)
print(json.dumps({'completed':state['completed'],'skipped':state['skipped'],'nameSaved':load(root).first_name=='Supplement'}))
`, ctx.owned(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))], {
      cwd: path.resolve(__dirname, '../../../backend'), env: { ...ctx.env, PYTHONIOENCODING: 'utf-8' },
      encoding: 'utf8', windowsHide: true, timeout: 10000,
    })
    ctx.expectEqual('真实核心读取成功', checked.status, 0)
    if (checked.status !== 0) throw new Error('core read failed (payload not logged)')
    const core = JSON.parse(checked.stdout)
    ctx.expectEqual('真实核心 skipped=true', [core.completed, core.skipped], [true, true])
    ctx.expectEqual('补填档案真实落盘', core.nameSaved, true)
  },
}
