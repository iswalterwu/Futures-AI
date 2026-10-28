'use strict'
const fs = require('node:fs')
module.exports = { requires: { tools: [], files: [] }, async run(ctx) {
  fs.writeFileSync(process.env.FAI_RUNNER_MARKER, 'ran')
  ctx.expectEqual('marker positive control', 1, 1)
} }
