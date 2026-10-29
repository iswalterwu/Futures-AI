'use strict'
const fs = require('node:fs')
const path = require('node:path')
const fake = path.resolve(__dirname, '../fixtures/fake_backend.py')

module.exports = {
  requires: { tools: ['python', 'taskkill'], files: [fake, require('electron')] },
  async run(ctx) {
    const first = await ctx.launch({ env: { FAI_BACKEND_CMD: JSON.stringify(['python', fake, '--mode', 'ok']) } })
    ctx.expectEqual('paths 位于临时目录', Object.values(first.paths).map(p => ctx.owned(p)), Object.values(first.paths))
    ctx.expectEqual('默认数据目录 = LOCALAPPDATA\\FuturesAI', first.paths.dataRoot, path.join(ctx.env.LOCALAPPDATA, 'FuturesAI'))
    const snapshot = await ctx.waitFor(async () => {
      const current = await ctx.snapshot(first)
      return current.window.visible && current.backend.phase === 'ready' ? current : null
    })
    ctx.expectEqual('窗口存在', snapshot.window.exists, true)
    ctx.expectEqual('后端存活', ctx.alive(snapshot.backend.pid), true)
    ctx.expectEqual('spawns 恰 1 条', ctx.registry().length, 1)
    ctx.expectEqual('registry PID = 快照 PID', ctx.registry()[0].pid, snapshot.backend.pid)
    ctx.expectIncludes('标题含测试钩子标记', snapshot.window.title, '［测试钩子］')
    const log = fs.readFileSync(path.join(first.paths.stateDir, 'log', 'shell.log'), 'utf8')
    ctx.expectEqual('日志首行 TEST HOOKS ENABLED', log.split('\n')[0], 'TEST HOOKS ENABLED')
    ctx.expectEqual('Electron 精确版本', snapshot.versions.electron, '33.4.11')
    console.log(`RUNTIME ${JSON.stringify(snapshot.versions)}`)
    ctx.expectEqual('控制通道 snapshot 路径一致', snapshot.paths, first.paths)
    ctx.expectEqual('未实现 tray/activity 不伪造', [snapshot.tray, snapshot.activity], [null, null])
    ctx.expectEqual('未知命令 HTTP 400', (await ctx.rawCommand(first, { command: 'not-a-command' })).status, 400)
    ctx.expectEqual('eval 调用真实窗口', (await ctx.cmd(first, { command: 'eval', js: 'document.location.protocol' })).value, 'file:')
    ctx.expectEqual('无未应答对话框', snapshot.records.dialogs, [])
    await ctx.cmd(first, { command: 'request-quit' })
    ctx.expectEqual('退出码 0', await ctx.waitExit(first), 0)
    ctx.expectEqual('后端 pid 已退出', ctx.alive(snapshot.backend.pid), false)
    // Runner finally independently checks registry PIDs and removes the owned temp root.
  },
}
