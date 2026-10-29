'use strict'
const path = require('node:path')
const { randomUUID } = require('node:crypto')
const { spawnSync } = require('node:child_process')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    const root = ctx.owned(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))
    const email = `synthetic.${randomUUID()}@example.test`
    const changedName = '<b data-synthetic="name">Synthetic</b>'
    const core = script => spawnSync('python', ['-c', script, root], {
      cwd: path.resolve(__dirname, '../../../backend'), env: { ...ctx.env, PYTHONIOENCODING: 'utf-8' },
      input: JSON.stringify({ email, changedName }), encoding: 'utf8', windowsHide: true, timeout: 10000,
    })
    const seed = core(`import sys,json
from pathlib import Path
from settings.profile import Profile,save
from settings.onboarding import set_onboard_state
root=Path(sys.argv[1]); data=json.load(sys.stdin)
save(root,Profile(first_name='Synthetic',last_name='Fixture',email=data['email'],sector='research'))
set_onboard_state(root,completed=True)
`)
    ctx.expectEqual('真实核心写入加密档案', seed.status, 0)
    if (seed.status !== 0) throw new Error('core seed failed (payload not logged)')
    const app = await ctx.launch()
    await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app)
      return s.backend.phase === 'ready' && s.window.url.endsWith('/onboarding.html')
    }, 20000)
    await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js:
      `document.querySelector('#view-settings').classList.contains('active')` })).value)
    const shown = (await ctx.cmd(app, { command: 'eval', js: `({
      password: document.querySelector('#api-key').type,
      masked: document.querySelector('#profile-form').elements.email.value.includes('***'),
      plainEmailAbsent: !document.body.textContent.includes(${JSON.stringify(email)})
    })` })).value
    ctx.expectEqual('key 输入为 password', shown.password, 'password')
    ctx.expectEqual('显示遮蔽邮箱', shown.masked, true)
    ctx.expectEqual('普通页面无完整邮箱', shown.plainEmailAbsent, true)
    await ctx.cmd(app, { command: 'eval', js: `(() => {
      const form = document.querySelector('#profile-form')
      form.elements.first_name.value = ${JSON.stringify(changedName)}
      form.requestSubmit()
    })()` })
    await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js:
      `document.querySelector('#profile-status').textContent === '档案已保存'` })).value)
    ctx.expectEqual('用户字符串未作为 HTML 插入', (await ctx.cmd(app, { command: 'eval', js:
      `document.querySelectorAll('[data-synthetic="name"]').length` })).value, 0)
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
    const checked = core(`import sys,json
from pathlib import Path
from settings.profile import load,profile_path
root=Path(sys.argv[1]); data=json.load(sys.stdin); profile=load(root)
print(json.dumps({'emailUnchanged':profile.email==data['email'],'nameUpdated':profile.first_name==data['changedName'],'encrypted':data['email'].encode() not in profile_path(root).read_bytes()}))
`)
    ctx.expectEqual('真实核心读取成功', checked.status, 0)
    if (checked.status !== 0) throw new Error('core read failed (payload not logged)')
    const result = JSON.parse(checked.stdout)
    ctx.expectEqual('真实邮箱未被覆盖', result.emailUnchanged, true)
    ctx.expectEqual('姓名确已保存', result.nameUpdated, true)
    ctx.expectEqual('档案存储无明文邮箱', result.encrypted, true)
  },
}
