'use strict'
const fs = require('node:fs')
const path = require('node:path')
module.exports = {
  requires: { tools: ['taskkill'], files: [require('electron')] },
  async run(ctx) {
    const file = ctx.owned(path.join(ctx.root, 'invalid-events.json'))
    fs.writeFileSync(file, JSON.stringify([{ type: 'unknown' }]), 'utf8')
    const instance = await ctx.launch({ env: { FAI_TEST_EVENTS: file }, expectEarlyExit: 'test-events-invalid' })
    ctx.expectEqual('退出码 4', instance.code, 4)
    ctx.expectEqual('输出 TEST_EVENTS_INVALID', instance.markerSeen, true)
  },
}
