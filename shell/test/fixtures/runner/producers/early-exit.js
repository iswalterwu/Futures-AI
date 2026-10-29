// Spawn-boundary producer for runner unit tests only; no Electron or business logic.
'use strict'
const fs = require('node:fs')
const path = require('node:path')
const scenario = process.env.FAI_RUNNER_CASE
const root = scenario === 'outside' ? path.parse(process.env.LOCALAPPDATA).root : process.env.LOCALAPPDATA
if (scenario !== 'missing-paths') {
  const stateDir = path.join(root, 'FuturesAI-Shell')
  const paths = { stateDir, userData: stateDir, sessionData: path.join(stateDir, 'session'),
    crashDumps: path.join(stateDir, 'session', 'crashDumps'), dataRoot: path.join(root, 'FuturesAI') }
  fs.writeSync(1, `SMOKE ${JSON.stringify({ event: 'paths', paths, gotLock: true })}\n`)
}
if (scenario === 'missing-marker') fs.writeSync(2, 'xTEST_EVENTS_INVALID FAIPLANT-REASON\n')
else fs.writeSync(2, 'TEST_EVENTS_')
setTimeout(() => {
  if (scenario !== 'missing-marker') fs.writeSync(2, 'INVALID FAIPLANT-REASON\n')
  process.exit(scenario === 'wrong-code' ? 3 : 4)
}, 100)
