'use strict'
const path = require('node:path')
const { spawnSync } = require('node:child_process')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    const app = await ctx.launch()
    const view = async instance => {
      const s = await ctx.snapshot(instance)
      if (!s.window.url.endsWith('/onboarding.html')) return null
      return (await ctx.cmd(instance, { command: 'eval', js: `document.querySelector('section.active')?.id` })).value
    }
    await ctx.waitFor(async () => await view(app) === 'view-onboard', 20000)
    ctx.expectEqual('首次进入引导', await view(app), 'view-onboard')
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    await ctx.cmd(app, { command: 'eval', js: `(() => {
      const form = document.querySelector('#onboard-form')
      form.elements.first_name.value = 'Synthetic'
      form.requestSubmit()
      return true
    })()` })
    await ctx.waitFor(async () => await view(app) === 'view-settings')
    ctx.expectEqual('保存后进入设置区', await view(app), 'view-settings')
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.navigation.length === 1)
    ctx.expectEqual('保存经生产 openMain', (await ctx.snapshot(app)).records.navigation,
      [{ action: 'open-main', via: 'renderer', result: 'opened' }])
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('首实例退出码 0', await ctx.waitExit(app), 0)
    const checked = spawnSync('python', ['-c', `import sys,json
from pathlib import Path
from settings.profile import load
from settings.onboarding import onboard_state
root=Path(sys.argv[1]); state=onboard_state(root); profile=load(root)
print(json.dumps({'completed':state['completed'],'skipped':state['skipped'],'nameSaved':profile.first_name=='Synthetic','optionalEmpty':profile.last_name==profile.email==profile.sector==''}))
`, ctx.owned(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))], {
      cwd: path.resolve(__dirname, '../../../backend'), env: { ...ctx.env, PYTHONIOENCODING: 'utf-8' },
      encoding: 'utf8', windowsHide: true, timeout: 10000,
    })
    ctx.expectEqual('真实核心读取成功', checked.status, 0)
    if (checked.status !== 0) throw new Error('core read failed (payload not logged)')
    const core = JSON.parse(checked.stdout)
    ctx.expectEqual('真实核心 completed=true skipped=false', [core.completed, core.skipped], [true, false])
    ctx.expectEqual('档案可保存且其余字段可空', [core.nameSaved, core.optionalEmpty], [true, true])
    const second = await ctx.launch()
    await ctx.waitFor(async () => await view(second) === 'view-settings', 20000)
    ctx.expectEqual('第二次运行进入设置页', await view(second), 'view-settings')
    ctx.expectEqual('第二次引导区不显示', (await ctx.cmd(second, { command: 'eval', js:
      `getComputedStyle(document.querySelector('#view-onboard')).display` })).value, 'none')
    await ctx.cmd(second, { command: 'request-quit' })
    ctx.expectEqual('第二实例退出码 0', await ctx.waitExit(second), 0)
  },
}
