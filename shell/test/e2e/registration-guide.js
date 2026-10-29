'use strict'
const path = require('node:path')
const { spawnSync } = require('node:child_process')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    const root = ctx.owned(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))
    const email = 'guide.synthetic@example.test'
    const expected = [
      ['First Name', '<img src=x onerror=alert(1)>'],
      ['Last Name', 'Synthetic'],
      ['Email', email],
      ['Category that best describes you/your organization', 'Research/Consulting'],
      ['Reason for use（可选）', 'Synthetic energy research <script>not executable</script>'],
    ]
    const seed = profile => {
      const result = spawnSync('python', ['-c', `import sys,json
from pathlib import Path
from settings.profile import update,load,profile_path
from settings.onboarding import set_onboard_state
root=Path(sys.argv[1]); fields=json.load(sys.stdin)
update(root,**fields); set_onboard_state(root,completed=True)
p=load(root); raw=profile_path(root).read_bytes()
print(json.dumps({'matches':all(getattr(p,k)==v for k,v in fields.items()),'encrypted':not p.email or p.email.encode() not in raw}))
`, root], {
        cwd: path.resolve(__dirname, '../../../backend'), env: { ...ctx.env, PYTHONIOENCODING: 'utf-8' },
        input: JSON.stringify(profile), encoding: 'utf8', windowsHide: true, timeout: 10000,
      })
      if (result.status !== 0) throw new Error('core fixture failed (payload not logged)')
      return JSON.parse(result.stdout)
    }
    const evaluate = async (app, js) => (await ctx.cmd(app, { command: 'eval', js })).value
    const waitSettings = app => ctx.waitFor(async () => {
      const s = await ctx.snapshot(app)
      return s.window.url.endsWith('/onboarding.html') && await evaluate(app,
        `document.querySelector('#view-settings').classList.contains('active') && document.querySelector('#sector-select-2').options.length === 12`)
    }, 20000)
    const guideRequests = `performance.getEntriesByType('resource').filter(e => e.name.endsWith('/settings/registration-guide')).length`
    const storage = `(async () => ({local:localStorage.length,session:sessionStorage.length,databases:(await indexedDB.databases()).length,caches:(await caches.keys()).length}))()`
    ctx.expectEqual('真实核心写入并读取完整加密档案', seed({
      first_name: expected[0][1], last_name: expected[1][1], email, sector: 'research', reason_for_use: expected[4][1],
    }), { matches: true, encrypted: true })
    const app = await ctx.launch()
    await waitSettings(app)
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    ctx.expectEqual('点击前指引区为空', await evaluate(app, `document.querySelector('#guide').textContent`), '')
    ctx.expectEqual('点击前不请求指引', await evaluate(app, guideRequests), 0)
    ctx.expectEqual('点击前无打开注册页', await evaluate(app, `document.querySelector('#open-register') === null`), true)
    ctx.expectEqual('档案表单邮箱为遮蔽值', await evaluate(app,
      `document.querySelector('#profile-form').elements.email.value === 'gu***@example.test'`), true)
    ctx.expectEqual('点击前普通页面无完整邮箱', await evaluate(app,
      `!document.body.textContent.includes(${JSON.stringify(email)}) && !Array.from(document.querySelectorAll('input')).some(i=>i.value.includes(${JSON.stringify(email)}))`), true)
    await evaluate(app, `document.querySelector('#prepare-guide').click(); true`)
    await ctx.waitFor(async () => await evaluate(app, `document.querySelector('#open-register') !== null`))
    ctx.expectEqual('完整档案 指引五项等于核心值', await evaluate(app,
      `JSON.stringify(Array.from(document.querySelectorAll('#guide dt')).map(t=>[t.textContent,t.nextElementSibling.textContent])) === ${JSON.stringify(JSON.stringify(expected))}`), true)
    ctx.expectEqual('Category 为官方标签', await evaluate(app,
      `document.querySelectorAll('#guide dd')[3].textContent === 'Research/Consulting'`), true)
    ctx.expectEqual('含 Reason for use', await evaluate(app,
      `document.querySelectorAll('#guide dd')[4].textContent === ${JSON.stringify(expected[4][1])}`), true)
    ctx.expectEqual('指引区不在表单内', await evaluate(app, `document.querySelector('#guide').closest('form') === null`), true)
    ctx.expectEqual('指引只读且安全渲染', await evaluate(app,
      `document.querySelectorAll('#guide input,#guide textarea,#guide select,#guide button,#guide img,#guide script,[onerror]').length`), 0)
    ctx.expectEqual('核心 notes 原样显示', await evaluate(app,
      `Array.from(document.querySelectorAll('#guide p')).map(p=>p.textContent)`), [
      '打开上面的地址，按「逐项指引」填写；条款与勾选由你本人确认',
      '提交后 key 会发送到你在表单里填写的邮箱（注意查收垃圾邮件）',
      '本程序不会代替你提交表单，也不会读取你的邮箱',
    ])
    ctx.expectEqual('仅用户点击后请求一次', await evaluate(app, guideRequests), 1)
    ctx.expectEqual('打开指引不改变遮蔽表单', await evaluate(app,
      `document.querySelector('#profile-form').elements.email.value === 'gu***@example.test'`), true)
    ctx.expectEqual('未写入 Web 存储', await evaluate(app, storage), { local: 0, session: 0, databases: 0, caches: 0 })
    await evaluate(app, `document.querySelector('#open-register').click(); true`)
    await ctx.waitFor(async () => (await ctx.snapshot(app)).records.external.length === 1)
    ctx.expectEqual('openExternal 收到核心 URL', (await ctx.snapshot(app)).records.external,
      [{ method: 'openExternal', value: 'https://www.eia.gov/opendata/register.php' }])
    ctx.expectEqual('点击外链不打开应用内页面', (await ctx.snapshot(app)).window.url.endsWith('/onboarding.html'), true)
    ctx.expectEqual('无上游资源请求或 key 提交', await evaluate(app,
      `performance.getEntriesByType('resource').filter(e=>e.name.startsWith('http')).every(e=>new URL(e.name).hostname==='127.0.0.1' && !new URL(e.name).pathname.includes('/key'))`), true)
    // Both fixed navigation calls reload the document; no prefill survives either.
    for (const [index, method] of ['openMain', 'openSettings'].entries()) {
      await evaluate(app, `window.futuresai.${method}(); true`)
      await ctx.waitFor(async () => (await ctx.snapshot(app)).records.navigation.length === index + 1)
      await waitSettings(app)
      ctx.expectEqual(`离开后指引清空 ${method}`, await evaluate(app,
        `[document.querySelector('#guide').textContent,document.querySelector('#open-register') === null,${guideRequests}]`), ['', true, 0])
      ctx.expectEqual(`导航后未写入 Web 存储 ${method}`, await evaluate(app, storage), { local: 0, session: 0, databases: 0, caches: 0 })
      if (method === 'openMain') {
        await evaluate(app, `document.querySelector('#prepare-guide').click(); true`)
        await ctx.waitFor(async () => await evaluate(app, `document.querySelector('#open-register') !== null`))
      }
    }
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('完整档案实例退出码 0', await ctx.waitExit(app), 0)
    ctx.expectEqual('真实核心写入缺项档案', seed({ first_name: 'Synthetic', last_name: '', email: '', sector: '', reason_for_use: '' }),
      { matches: true, encrypted: true })
    const missing = await ctx.launch()
    await waitSettings(missing)
    await evaluate(missing, `document.querySelector('#prepare-guide').click(); true`)
    await ctx.waitFor(async () => await evaluate(missing, `document.querySelectorAll('#guide [data-missing]').length === 3`))
    ctx.expectEqual('缺项档案 列出三项缺项', await evaluate(missing,
      `Array.from(document.querySelectorAll('#guide [data-missing]')).map(e=>[e.dataset.missing,e.textContent])`),
    [['last_name', 'last_name'], ['email', 'email'], ['sector', 'sector']])
    ctx.expectEqual('核心 hint 原样显示', await evaluate(missing, `document.querySelector('#guide p').textContent`),
      '先补齐档案中的缺项，再继续注册（档案可在 profile set 中修改）')
    ctx.expectEqual('无打开注册页', await evaluate(missing, `document.querySelector('#open-register') === null`), true)
    ctx.expectEqual('openExternal 记录为空', (await ctx.snapshot(missing)).records.external, [])
    ctx.expectEqual('缺项焦点在第一个缺项输入框', await evaluate(missing,
      `document.activeElement === document.querySelector('#profile-form').elements.last_name`), true)
    ctx.expectEqual('key 输入与验证按钮可用', await evaluate(missing, `(() => {
      const key=document.querySelector('#api-key'), verify=document.querySelector('#verify-key')
      return [key.type,key.value,key.disabled,verify.disabled,key.getClientRects().length>0,verify.getClientRects().length>0]
    })()`), ['password', '', false, false, true, true])
    ctx.expectEqual('缺项无上游请求或 key 提交', await evaluate(missing,
      `performance.getEntriesByType('resource').filter(e=>e.name.startsWith('http')).every(e=>new URL(e.name).hostname==='127.0.0.1' && !new URL(e.name).pathname.includes('/key'))`), true)
    ctx.expectEqual('缺项未写入 Web 存储', await evaluate(missing, storage), { local: 0, session: 0, databases: 0, caches: 0 })
    await ctx.cmd(missing, { command: 'request-quit' })
    ctx.expectEqual('缺项档案实例退出码 0', await ctx.waitExit(missing), 0)
  },
}
