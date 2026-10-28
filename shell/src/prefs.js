'use strict'

const fs = require('node:fs')
const path = require('node:path')

function defaults() {
  return { schema: 1, closeBehavior: 'tray', notifications: true, updateCheck: 'startup',
    dataRoot: null, pendingDataRoot: null }
}

function valid(prefs) {
  return prefs !== null && typeof prefs === 'object' && !Array.isArray(prefs) &&
    Object.keys(prefs).sort().join(',') === Object.keys(defaults()).sort().join(',') &&
    prefs.schema === 1 && ['tray', 'quit'].includes(prefs.closeBehavior) &&
    typeof prefs.notifications === 'boolean' && ['startup', 'off'].includes(prefs.updateCheck) &&
    [prefs.dataRoot, prefs.pendingDataRoot].every(p => p === null || (typeof p === 'string' && path.isAbsolute(p)))
}

// Filesystem boundary: preserve the actual reason; do not wrap unrelated errors.
function fileError(error, file) {
  let code = error.code
  if (['EACCES', 'EPERM', 'EROFS'].includes(code) || [5, 19].includes(error.winerror)) code = 'data_root_unwritable'
  if (code === 'ENOSPC' || [39, 112].includes(error.winerror)) code = 'disk_full'
  return { code, path: file, reason: error.code || error.name }
}

function load(file, io = fs) {
  let text
  try { text = io.readFileSync(file, 'utf8') } catch (error) {
    if (error.code === 'ENOENT') return { prefs: defaults() }
    return { error: fileError(error, file) }
  }
  let prefs
  try { prefs = JSON.parse(text) } catch { return { error: { code: 'prefs_invalid', path: file } } }
  if (!valid(prefs)) return { error: { code: 'prefs_invalid', path: file } }
  return { prefs }
}

function save(file, prefs, io = fs) {
  if (!valid(prefs)) return { error: { code: 'prefs_invalid', path: file } }
  const tmp = `${file}.tmp`
  try {
    io.mkdirSync(path.dirname(file), { recursive: true })
    io.writeFileSync(tmp, JSON.stringify(prefs, null, 2) + '\n', 'utf8')
    io.renameSync(tmp, file)
    return { prefs }
  } catch (error) {
    return { error: fileError(error, file) }
  }
}

function probe(root, io = fs) {
  const file = path.join(root, `.fai-write-probe-${process.pid}`)
  try {
    io.mkdirSync(root, { recursive: true })
    io.writeFileSync(file, '')
    io.unlinkSync(file)
    return {}
  } catch (error) {
    return { error: fileError(error, root) }
  }
}

function applyPending(file, prefs, io = fs) {
  if (prefs.pendingDataRoot === null) return { prefs }
  const result = probe(prefs.pendingDataRoot, io)
  if (result.error) return { prefs, error: { ...result.error, code: 'data_root_invalid', reason: result.error.code } }
  const next = { ...prefs, dataRoot: prefs.pendingDataRoot, pendingDataRoot: null }
  const saved = save(file, next, io)
  return saved.error ? { prefs, error: saved.error } : saved
}

module.exports = { defaults, load, save, probe, applyPending, fileError }
