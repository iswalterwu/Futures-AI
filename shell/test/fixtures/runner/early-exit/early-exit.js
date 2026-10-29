'use strict'
module.exports = {
  requires: { tools: ['taskkill'], files: [] },
  async run(ctx) {
    const scenario = process.env.FAI_RUNNER_CASE
    const options = { env: { FAI_RUNNER_CASE: scenario } }
    if (scenario !== 'default') options.expectEarlyExit = 'test-events-invalid'
    const instance = await ctx.launch(options)
    ctx.expectEqual('退出码 4', instance.code, 4)
    ctx.expectEqual('标记已观察', instance.markerSeen, true)
  },
}
