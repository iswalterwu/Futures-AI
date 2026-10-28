'use strict'

const path = require('node:path')
const fs = require('node:fs')
const prefs = require('./prefs')

function resolvePaths(app, env) {
  if (!env.LOCALAPPDATA) return { error: { code: 'localappdata_missing' } }
  const overrides = !app.isPackaged || env.FAI_TEST_HOOKS === '1'
  const stateDir = overrides && env.FAI_SHELL_STATE_DIR ? env.FAI_SHELL_STATE_DIR : path.join(env.LOCALAPPDATA, 'FuturesAI-Shell')
  return {
    paths: {
      stateDir,
      userData: stateDir,
      sessionData: path.join(stateDir, 'session'),
      crashDumps: path.join(stateDir, 'session', 'crashDumps'),
      prefsFile: path.join(stateDir, 'shell-prefs.json'),
      defaultDataRoot: path.join(env.LOCALAPPDATA, 'FuturesAI'),
    },
    dataRootOverride: overrides ? env.FAI_DATA_ROOT : undefined,
    ignored: overrides ? [] : ['FAI_DATA_ROOT', 'FAI_SHELL_STATE_DIR'].filter(key => env[key]),
  }
}

function resolveDataRoot(resolved, prefs) {
  return resolved.dataRootOverride || prefs.dataRoot || resolved.paths.defaultDataRoot
}

function bootstrap(app, env) {
  const resolved = resolvePaths(app, env)
  if (resolved.error) return { gotLock: false, ...resolved }
  const { paths } = resolved
  try {
    for (const key of ['userData', 'sessionData', 'crashDumps']) {
      fs.mkdirSync(paths[key], { recursive: true })
      app.setPath(key, paths[key])
    }
  } catch (error) {
    return { gotLock: false, paths, error: prefs.fileError(error, paths.stateDir) }
  }
  if (!app.requestSingleInstanceLock()) return { gotLock: false, paths }
  const result = { gotLock: true, paths, ignored: resolved.ignored }
  const loaded = prefs.load(paths.prefsFile)
  if (loaded.error) return { ...result, error: loaded.error }
  const applied = prefs.applyPending(paths.prefsFile, loaded.prefs)
  const dataRoot = resolveDataRoot(resolved, applied.prefs)
  if (applied.error) return { ...result, prefs: applied.prefs, dataRoot, error: applied.error }
  return { ...result, prefs: applied.prefs, dataRoot, ...prefs.probe(dataRoot) }
}

module.exports = { resolvePaths, resolveDataRoot, bootstrap }
