'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { spawnSync } = require('node:child_process')
const { bootstrap } = require('../../src/paths')
const prefs = require('../../src/prefs')

function fixture(t, { gotLock = true, isPackaged = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fai-bootstrap-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const calls = []
  const app = { isPackaged, setPath(key, value) { calls.push([key, value]) },
    requestSingleInstanceLock() { calls.push(['lock']); return gotLock } }
  return { root, calls, app, env: { LOCALAPPDATA: root } }
}
test('bootstrap：setPath×3 先于 requestSingleInstanceLock', t => {
  const { root, calls, app, env } = fixture(t)
  assert.equal(bootstrap(app, env).gotLock, true)
  assert.deepEqual(calls, [
    ['userData', path.join(root, 'FuturesAI-Shell')],
    ['sessionData', path.join(root, 'FuturesAI-Shell', 'session')],
    ['crashDumps', path.join(root, 'FuturesAI-Shell', 'session', 'crashDumps')], ['lock'],
  ])
})
test('bootstrap：未拿到锁不触碰数据目录', t => {
  const { root, app, env } = fixture(t, { gotLock: false })
  const file = path.join(root, 'FuturesAI-Shell', 'shell-prefs.json')
  fs.mkdirSync(path.dirname(file)); fs.writeFileSync(file, '{invalid')
  const result = bootstrap(app, env)
  assert.equal(result.gotLock, false)
  assert.equal(result.error, undefined) // 没读坏偏好，更没有探测数据根。
  assert.equal(fs.existsSync(path.join(root, 'FuturesAI')), false)
  assert.equal(fs.readFileSync(file, 'utf8'), '{invalid')
})
test('bootstrap：默认 LOCALAPPDATA\\FuturesAI', t => {
  const { root, app, env } = fixture(t)
  const result = bootstrap(app, env)
  assert.equal(result.dataRoot, path.join(root, 'FuturesAI'))
  assert.deepEqual(fs.readdirSync(result.dataRoot), [])
})
test('bootstrap：pending 生效后 dataRoot 为新目录', t => {
  const { root, app, env } = fixture(t)
  const next = path.join(root, 'chosen')
  const file = path.join(root, 'FuturesAI-Shell', 'shell-prefs.json')
  prefs.save(file, { ...prefs.defaults(), pendingDataRoot: next })
  assert.equal(bootstrap(app, env).dataRoot, next)
  assert.equal(prefs.load(file).prefs.pendingDataRoot, null)
})
test('bootstrap：打包且无钩子时忽略 FAI_DATA_ROOT', t => {
  const { root, app, env } = fixture(t, { isPackaged: true })
  const override = path.join(root, 'override')
  const result = bootstrap(app, { ...env, FAI_DATA_ROOT: override, FAI_SHELL_STATE_DIR: path.join(root, 'state-override') })
  assert.equal(result.dataRoot, path.join(root, 'FuturesAI'))
  assert.equal(result.paths.stateDir, path.join(root, 'FuturesAI-Shell'))
  assert.deepEqual(result.ignored, ['FAI_DATA_ROOT', 'FAI_SHELL_STATE_DIR'])
  assert.equal(fs.existsSync(override), false)
})
test('bootstrap：开发覆盖优先于偏好', t => {
  const { root, app, env } = fixture(t)
  prefs.save(path.join(root, 'FuturesAI-Shell', 'shell-prefs.json'), { ...prefs.defaults(), dataRoot: path.join(root, 'prefs-root') })
  assert.equal(bootstrap(app, { ...env, FAI_DATA_ROOT: path.join(root, 'override') }).dataRoot, path.join(root, 'override'))
})
test('bootstrap：不可写返回 data_root_unwritable 且无临时目录', t => {
  const { root, app, env } = fixture(t)
  const data = path.join(root, 'FuturesAI')
  fs.mkdirSync(data)
  const who = spawnSync('whoami', [], { encoding: 'utf8', windowsHide: true })
  assert.equal(who.status, 0)
  const user = who.stdout.trim()
  try {
    assert.equal(spawnSync('icacls', [data, '/deny', `${user}:(W)`], { windowsHide: true }).status, 0)
    const result = bootstrap(app, env)
    assert.equal(result.error.code, 'data_root_unwritable')
    assert.equal(result.error.path, data)
    assert.equal(result.dataRoot, data)
    assert.deepEqual(fs.readdirSync(root).sort(), ['FuturesAI', 'FuturesAI-Shell'])
  } finally {
    assert.equal(spawnSync('icacls', [data, '/remove:d', user], { windowsHide: true }).status, 0)
    assert.deepEqual(fs.readdirSync(data), [])
    fs.writeFileSync(path.join(data, 'acl-restored'), '')
  }
})
