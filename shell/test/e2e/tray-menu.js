'use strict'
const fs = require('node:fs')
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const file = ctx.owned(path.join(ctx.root, 'events.json'))
    fs.writeFileSync(file, JSON.stringify([
      { type: 'job.started', jobId: 'one', title: '夹具作业', delayMs: 100 },
      { type: 'job.finished', jobId: 'one', delayMs: 4000 },
    ]))
    const app = await ctx.launch({ env: { FAI_TEST_EVENTS: file,
      FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    const running = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app); return s.window.visible && s.tray.state === 'running' ? s : null
    })
    ctx.expectEqual('菜单标签齐全', running.tray.menu.map(item => item.label), ['打开主窗口', '运行中作业', '设置…', '退出'])
    ctx.expectEqual('子菜单列出作业', running.tray.menu[1].submenu, [{ label: '夹具作业' }])
    for (const value of [[], [''], ['a', 'b', 'c'], [7], '退出']) {
      const result = await ctx.rawCommand(app, { command: 'tray-click', path: value })
      ctx.expectEqual('非法托盘路径被拒', [result.status, result.body.error], [400, 'invalid_tray_path'])
    }
    const missing = await ctx.rawCommand(app, { command: 'tray-click', path: ['不存在'] })
    ctx.expectEqual('缺失菜单项被拒', [missing.status, missing.body.error], [409, 'tray_item_missing'])
    await ctx.cmd(app, { command: 'close-window' })
    await ctx.cmd(app, { command: 'tray-click', path: ['打开主窗口'] })
    ctx.expectEqual('打开主窗口后可见', (await ctx.snapshot(app)).window.visible, true)
    await ctx.cmd(app, { command: 'close-window' })
    ctx.expectEqual('真实二级菜单可点击', await ctx.cmd(app, { command: 'tray-click', path: ['运行中作业', '夹具作业'] }), { clicked: true })
    ctx.expectEqual('作业菜单激活窗口', (await ctx.snapshot(app)).window.visible, true)
    await ctx.cmd(app, { command: 'tray-click', path: ['设置…'] })
    const settings = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app)
      return s.records.navigation.some(item => item.via === 'tray' && item.result === 'opened') ? s : null
    })
    ctx.expectEqual('设置… 打开设置页', settings.window.url.endsWith('/onboarding.html'), true)
    await ctx.waitFor(async () => (await ctx.snapshot(app)).activity.jobs.every(job => job.status !== 'running'))
    const unavailable = await ctx.rawCommand(app, { command: 'tray-click', path: ['运行中作业', '无运行中作业'] })
    ctx.expectEqual('禁用菜单项被拒', [unavailable.status, unavailable.body.error], [409, 'tray_item_unavailable'])
    await ctx.cmd(app, { command: 'tray-click', path: ['退出'] })
    ctx.expectEqual('退出调用 requestQuit', await ctx.waitExit(app), 0)
  },
}
