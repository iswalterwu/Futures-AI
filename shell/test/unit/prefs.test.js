'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const prefs = require('../../src/prefs')

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fai-prefs-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  return { root, file: path.join(root, 'state', 'shell-prefs.json') }
}
function failingWrite(code) {
  return { ...fs, writeFileSync() { throw Object.assign(new Error(code), { code }) } }
}

test('偏好缺失使用完整 schema v1 默认值且不创建文件', t => {
  const { file } = fixture(t)
  assert.deepEqual(prefs.load(file), { prefs: { schema: 1, closeBehavior: 'tray', notifications: true, updateCheck: 'startup', dataRoot: null, pendingDataRoot: null } })
  assert.equal(fs.existsSync(file), false)
})
test('可写探测 EACCES → data_root_unwritable', t => {
  const { root } = fixture(t)
  for (const code of ['EACCES', 'EPERM', 'EROFS']) {
    assert.deepEqual(prefs.probe(root, failingWrite(code)), { error: { code: 'data_root_unwritable', path: root, reason: code } })
  }
})
test('可写探测 ENOSPC → disk_full', t => {
  const { root } = fixture(t)
  assert.equal(prefs.probe(root, failingWrite('ENOSPC')).error.code, 'disk_full')
})
test('pending 可写 → 生效并清空', t => {
  const { root, file } = fixture(t)
  const old = path.join(root, 'old'), next = path.join(root, 'new')
  fs.mkdirSync(old)
  fs.writeFileSync(path.join(old, 'sentinel'), 'keep')
  const original = { ...prefs.defaults(), dataRoot: old, pendingDataRoot: next }
  prefs.save(file, original)
  assert.deepEqual(prefs.applyPending(file, original), { prefs: { ...original, dataRoot: next, pendingDataRoot: null } })
  assert.equal(prefs.load(file).prefs.dataRoot, next)
  assert.equal(fs.readFileSync(path.join(old, 'sentinel'), 'utf8'), 'keep')
  assert.deepEqual(fs.readdirSync(next), [])
})
test('pending 不可写 → data_root_invalid 且原目录不变', t => {
  const { root, file } = fixture(t)
  const original = { ...prefs.defaults(), dataRoot: path.join(root, 'old'), pendingDataRoot: path.join(root, 'new') }
  prefs.save(file, original)
  const before = fs.readFileSync(file)
  const result = prefs.applyPending(file, original, failingWrite('EACCES'))
  assert.equal(result.error.code, 'data_root_invalid')
  assert.equal(result.error.path, original.pendingDataRoot)
  assert.equal(result.prefs.dataRoot, original.dataRoot)
  assert.deepEqual(fs.readFileSync(file), before)
})
test('偏好损坏 → prefs_invalid 且文件未改写', t => {
  const { file } = fixture(t)
  fs.mkdirSync(path.dirname(file))
  for (const text of ['{broken', JSON.stringify({ ...prefs.defaults(), dataRoot: 'relative' }), JSON.stringify({ ...prefs.defaults(), schema: 2 }), JSON.stringify({ ...prefs.defaults(), notifications: 'true' }), JSON.stringify({ ...prefs.defaults(), dismissedUpdate: '1.0.0' })]) {
    fs.writeFileSync(file, text)
    assert.equal(prefs.load(file).error.code, 'prefs_invalid')
    assert.equal(fs.readFileSync(file, 'utf8'), text)
  }
})
test('偏好写入失败返回原因', t => {
  const { file } = fixture(t)
  prefs.save(file, prefs.defaults())
  const before = fs.readFileSync(file)
  const result = prefs.save(file, { ...prefs.defaults(), notifications: false }, failingWrite('ENOSPC'))
  assert.deepEqual(result.error, { code: 'disk_full', path: file, reason: 'ENOSPC' })
  assert.deepEqual(fs.readFileSync(file), before)
})
test('偏好写入先 tmp 后 rename，rename 失败保留旧文件', t => {
  const { file } = fixture(t)
  prefs.save(file, prefs.defaults())
  const before = fs.readFileSync(file)
  const next = { ...prefs.defaults(), notifications: false }
  const result = prefs.save(file, next, { ...fs, renameSync(from, to) {
    assert.equal(from, file + '.tmp'); assert.equal(to, file)
    assert.deepEqual(JSON.parse(fs.readFileSync(from, 'utf8')), next)
    throw Object.assign(new Error('denied'), { code: 'EACCES' })
  } })
  assert.equal(result.error.reason, 'EACCES')
  assert.deepEqual(fs.readFileSync(file), before)
  assert.deepEqual(prefs.save(file, next), { prefs: next })
  assert.equal(fs.existsSync(file + '.tmp'), false)
})
