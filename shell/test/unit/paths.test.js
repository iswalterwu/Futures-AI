'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const os = require('node:os')
const { resolvePaths, resolveDataRoot } = require('../../src/paths')
const { defaults } = require('../../src/prefs')
const local = path.join(os.tmpdir(), 'paths-only-local')

test('默认数据目录 = LOCALAPPDATA\\FuturesAI', () => {
  const result = resolvePaths({ isPackaged: false }, { LOCALAPPDATA: local })
  assert.equal(resolveDataRoot(result, defaults()), path.join(local, 'FuturesAI'))
  assert.equal(result.paths.stateDir, path.join(local, 'FuturesAI-Shell'))
})
test('LOCALAPPDATA 缺失 → localappdata_missing', () => {
  assert.deepEqual(resolvePaths({ isPackaged: false }, { FAI_DATA_ROOT: local }), { error: { code: 'localappdata_missing' } })
})
test('FAI_DATA_ROOT 仅在未打包或测试钩子下生效', () => {
  const env = { LOCALAPPDATA: local, FAI_DATA_ROOT: path.join(local, 'override'), FAI_SHELL_STATE_DIR: path.join(local, 'state') }
  for (const [packaged, flag, root, state] of [
    [false, undefined, env.FAI_DATA_ROOT, env.FAI_SHELL_STATE_DIR],
    [true, '1', env.FAI_DATA_ROOT, env.FAI_SHELL_STATE_DIR],
    [true, undefined, path.join(local, 'FuturesAI'), path.join(local, 'FuturesAI-Shell')],
    [true, '0', path.join(local, 'FuturesAI'), path.join(local, 'FuturesAI-Shell')],
  ]) {
    const result = resolvePaths({ isPackaged: packaged }, { ...env, FAI_TEST_HOOKS: flag })
    assert.equal(resolveDataRoot(result, defaults()), root)
    assert.equal(result.paths.stateDir, state)
  }
})
test('偏好数据目录优先于默认路径', () => {
  const result = resolvePaths({ isPackaged: false }, { LOCALAPPDATA: local })
  assert.equal(resolveDataRoot(result, { ...defaults(), dataRoot: path.join(local, 'chosen') }), path.join(local, 'chosen'))
})
