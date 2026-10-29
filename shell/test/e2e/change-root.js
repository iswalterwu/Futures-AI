'use strict'
const fs = require('node:fs')
const path = require('node:path')
module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [require('electron')] },
  async run(ctx) {
    const oldRoot = ctx.owned(path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))
    fs.mkdirSync(oldRoot, { recursive: true })
    const sentinel = path.join(oldRoot, 'keep.txt')
    fs.writeFileSync(sentinel, 'KEEP-OLD-DATA')
    const app = await ctx.launch() // No FAI_DATA_ROOT override: actual preference resolution.
    await ctx.waitFor(async () => (await ctx.snapshot(app)).backend.phase === 'ready', 20000)
    await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js:
      "document.querySelector('#data-root')?.textContent" })).value)
    const prefsFile = ctx.owned(path.join(app.paths.stateDir, 'shell-prefs.json'))
    for (const [candidate, expected] of [
      ['relative', 'data_root_invalid'], [oldRoot, 'data_root_current'],
      [path.resolve(__dirname, '../..'), 'data_root_install'],
      [path.resolve(__dirname, '../../renderer'), 'data_root_install'],
    ]) {
      await ctx.cmd(app, { command: 'answer', queue: [{ type: 'open', paths: [candidate] }] })
      const result = (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.chooseDataRoot()' })).value
      ctx.expectEqual('非法目录被拒', result, { error: expected })
      ctx.expectEqual('拒绝目录不写偏好', fs.existsSync(prefsFile), false)
    }
    const notDirectory = ctx.owned(path.join(ctx.root, 'not-directory'))
    fs.writeFileSync(notDirectory, 'file')
    await ctx.cmd(app, { command: 'answer', queue: [{ type: 'open', paths: [notDirectory] }] })
    const failed = (await ctx.cmd(app, { command: 'eval', js: 'window.futuresai.chooseDataRoot()' })).value
    ctx.expectEqual('不可写目录探测失败', Boolean(failed.error), true)
    ctx.expectEqual('探测失败不写偏好', fs.existsSync(prefsFile), false)
    const next = ctx.owned(path.join(ctx.root, 'new-data'))
    await ctx.cmd(app, { command: 'answer', queue: [{ type: 'open', paths: [next] }] })
    await ctx.cmd(app, { command: 'eval', js: "document.querySelector('#choose-data-root').click()" })
    await ctx.waitFor(() => fs.existsSync(prefsFile) && JSON.parse(fs.readFileSync(prefsFile, 'utf8')).pendingDataRoot === next)
    ctx.expectEqual('只设置 pending', JSON.parse(fs.readFileSync(prefsFile, 'utf8')).dataRoot, null)
    ctx.expectEqual('当前实例仍使用原目录', (await ctx.snapshot(app)).paths.dataRoot, oldRoot)
    await ctx.waitFor(async () => (await ctx.cmd(app, { command: 'eval', js:
      "document.querySelector('#pending-root').textContent.startsWith('重启后生效：')" })).value)
    ctx.expectEqual('显示待生效路径与立即重启', (await ctx.cmd(app, { command: 'eval', js:
      "[document.querySelector('#pending-root').textContent, document.querySelector('#relaunch').hidden]" })).value, [`重启后生效：${next}`, false])
    await ctx.cmd(app, { command: 'request-quit' })
    ctx.expectEqual('首实例退出码 0', await ctx.waitExit(app), 0)
    const second = await ctx.launch()
    const ready = await ctx.waitFor(async () => {
      const s = await ctx.snapshot(second); return s.backend.phase === 'ready' ? s : null
    }, 20000)
    ctx.expectEqual('新目录就绪', [ready.paths.dataRoot, ready.backend.phase], [next, 'ready'])
    const prefs = JSON.parse(fs.readFileSync(prefsFile, 'utf8'))
    ctx.expectEqual('偏好 dataRoot 为新目录', [prefs.dataRoot, prefs.pendingDataRoot], [next, null])
    ctx.expectEqual('旧目录哨兵仍在', fs.readFileSync(sentinel, 'utf8'), 'KEEP-OLD-DATA')
    ctx.expectEqual('未迁移旧目录数据', fs.existsSync(path.join(next, 'keep.txt')), false)
    ctx.expectEqual('真实宿主非夹具', ctx.registry().length, 0)
    await ctx.cmd(second, { command: 'request-quit' })
    ctx.expectEqual('第二实例退出码 0', await ctx.waitExit(second), 0)
  },
}
