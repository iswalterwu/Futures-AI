'use strict'
const path = require('node:path')
const http = require('node:http')
const { spawnSync } = require('node:child_process')

// Boundary diagnosis only: never proxy requests for the product or print bodies/tokens.
function responseMetadata(endpoint, route, preflight = false) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: endpoint.port, path: route,
      method: preflight ? 'OPTIONS' : 'GET', timeout: 2000,
      headers: preflight ? { Origin: 'null', 'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization' } : { Authorization: `Bearer ${endpoint.token}` } }, res => {
      res.resume()
      res.on('end', () => resolve({ status: res.statusCode,
        allowOrigin: res.headers['access-control-allow-origin'] ?? null,
        allowMethods: res.headers['access-control-allow-methods'] ?? null,
        allowHeaders: res.headers['access-control-allow-headers'] ?? null }))
    })
    req.on('error', () => reject(new Error('boundary request failed')))
    req.on('timeout', () => req.destroy(new Error('boundary request timeout')))
    req.end()
  })
}

module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    // Real settings core persists completion; no copied state schema or fake API.
    const root = ctx.owned(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))
    const seed = spawnSync('python', ['-c',
      'import sys; from pathlib import Path; from settings.onboarding import set_onboard_state; set_onboard_state(Path(sys.argv[1]), completed=True)', root],
    { cwd: path.resolve(__dirname, '../../../backend'), env: { ...ctx.env, PYTHONIOENCODING: 'utf-8' },
      encoding: 'utf8', windowsHide: true, timeout: 10000 })
    ctx.expectEqual('真实核心设置引导完成', seed.status, 0)
    if (seed.status !== 0) throw new Error('core fixture failed (payload not logged)')
    const app = await ctx.launch()
    const ready = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(app)
      return s.backend.phase === 'ready' && s.window.url.endsWith('/onboarding.html') ? s : null
    }, 20000)
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    ctx.expectEqual('file renderer', new URL(ready.window.url).protocol, 'file:')
    const endpoint = (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.getBackend()' })).value
    ctx.expectEqual('getBackend 当前端口', endpoint.port, ready.backend.port)
    const loaded = await ctx.waitFor(async () => {
      const { value } = await ctx.cmd(app, { command: 'eval', js: `({
        options: document.querySelector('#sector-select-2').options.length,
        rows: document.querySelectorAll('#sources-table tbody tr').length,
        failed: document.querySelector('#meta').textContent.startsWith('启动失败：')
      })` })
      return value.failed || value.rows > 0 ? value : null
    })
    ctx.expectEqual('组织类型下拉 12 项', loaded.options, 12)
    if (loaded.options !== 12 || loaded.failed) {
      const nodeProfile = await responseMetadata(endpoint, '/settings/profile')
      const nodeSectors = await responseMetadata(endpoint, '/settings/sectors')
      const nodeSources = await responseMetadata(endpoint, '/settings/sources')
      const preflight = await responseMetadata(endpoint, '/settings/sectors', true)
      const renderer = (await ctx.cmd(app, { command: 'eval', js: `(async () => {
        const current = await window.futuresai.getBackend()
        try {
          const response = await fetch('http://127.0.0.1:' + current.port + '/settings/sectors',
            { headers: { Authorization: 'Bearer ' + current.token } })
          return { ok: response.ok, status: response.status }
        } catch (error) { return { ok: false, errorType: error.name } }
      })()` })).value
      console.log(`SETTINGS_BOUNDARY ${JSON.stringify({ nodeProfile, nodeSectors, nodeSources, preflight, renderer,
        optionCount: loaded.options, rowCount: loaded.rows })}`)
      throw new Error('settings positive control failed; STOP for Plan §10 boundary review (no fallback)')
    }
    const eia = (await ctx.cmd(app, { command: 'eval', js: `Array.from(document.querySelectorAll('#sources-table tbody tr'))
      .find(row => row.querySelector('code').textContent === 'eia').textContent` })).value
    ctx.expectIncludes('eia 显示免凭证回退', eia, '免凭证回退')
    // No key is submitted, verified, or saved. Clearing an empty owned store is offline.
    const clearVisible = (await ctx.cmd(app, { command: 'eval', js: `!document.querySelector('#open-unregister').hidden` })).value
    ctx.expectEqual('清除 key 按钮可见', clearVisible, true)
    if (!clearVisible) throw new Error('clear-key control unavailable')
    await ctx.cmd(app, { command: 'eval', js: `document.querySelector('#open-unregister').click()` })
    const cleared = await ctx.waitFor(async () => {
      const { value } = await ctx.cmd(app, { command: 'eval', js: `document.querySelector('#key-status').textContent` })
      return value || null
    })
    ctx.expectIncludes('清除 key 后提示回退', cleared, '免凭证回退')
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(app), 0)
  },
}
