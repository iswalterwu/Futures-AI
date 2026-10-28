'use strict'
const path = require('node:path')
module.exports = {
  requires: process.env.FAI_RUNNER_CASE === 'missing-file'
    ? { tools: [], files: [path.join(__dirname, 'nonexistent-fixture')] }
    : { tools: ['fai-nonexistent-external-tool-01a18415'], files: [] },
  async run(ctx) { ctx.expectEqual('must not execute', 1, 1) },
}
