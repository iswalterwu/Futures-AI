'use strict'
const path = require('node:path')
module.exports = {
  requires: { tools: [], files: [] },
  async run(ctx) {
    if (process.env.FAI_RUNNER_CASE === 'outside') await ctx.launch({ env: { FAI_SHELL_STATE_DIR: path.dirname(ctx.root) } })
    if (process.env.FAI_RUNNER_CASE === 'arity') ctx.expectEqual('invalid single argument')
    ctx.expectEqual('无布尔断言', typeof ctx.expect, 'undefined')
    ctx.expectEqual('显式期望值', ['fixture', 2], ['fixture', 2])
  },
}
