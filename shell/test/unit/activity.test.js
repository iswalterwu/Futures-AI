'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { initialState, apply } = require('../../src/activity')

test('等待退出时排队项标 cancelled_on_exit', () => {
  const initial = initialState()
  const running = apply(initial, { type: 'job.started', jobId: 'run', title: '运行作业' }).state
  const queued = apply(running, { type: 'job.queued', jobId: 'queue', title: '排队作业' }).state
  const asked = apply(queued, { type: 'quit.request' })
  assert.deepEqual(asked.state, queued)
  assert.deepEqual(asked.effects, [{ type: 'ask' }, { type: 'tray', state: 'running' }])
  assert.deepEqual(apply(asked.state, { type: 'quit.cancel' }), { state: queued, effects: [] })
  const waiting = apply(queued, { type: 'quit.wait' })
  assert.deepEqual(waiting.state.jobs, [
    { jobId: 'run', title: '运行作业', status: 'running' },
    { jobId: 'queue', title: '排队作业', status: 'cancelled_on_exit' },
  ])
  assert.deepEqual([waiting.state.accepting, waiting.state.waiting], [false, true])
  assert.deepEqual(waiting.effects, [
    { type: 'log', code: 'cancelled_on_exit', jobId: 'queue' },
    { type: 'hint', code: 'cancelled_on_exit', jobId: 'queue' },
    { type: 'tray', state: 'running' },
  ])
  const finished = apply(waiting.state, { type: 'job.finished', jobId: 'run' })
  assert.deepEqual(finished.effects, [{ type: 'tray', state: 'idle' }, { type: 'quit' }])
  const failed = apply(waiting.state, { type: 'job.failed', jobId: 'run', reason: 'fixture' })
  assert.deepEqual(failed.effects, [{ type: 'tray', state: 'error' }, { type: 'quit' }])
  const resumed = apply(waiting.state, { type: 'quit.cancel' })
  assert.deepEqual([resumed.state.accepting, resumed.state.waiting], [true, false])
  assert.deepEqual(resumed.state.jobs, waiting.state.jobs) // Cancellation marks are not silently undone.
  assert.deepEqual(apply(resumed.state, { type: 'job.finished', jobId: 'run' }).effects,
    [{ type: 'tray', state: 'idle' }])
  assert.equal(queued.jobs[1].status, 'queued')
  assert.deepEqual(initial, { jobs: [], accepting: true, waiting: false, backendError: null, notifications: true, tray: 'idle' })
  const idleQueued = apply(initial, { type: 'job.queued', jobId: 'queue', title: '排队作业' }).state
  assert.deepEqual(apply(idleQueued, { type: 'quit.request' }).effects, [
    { type: 'log', code: 'cancelled_on_exit', jobId: 'queue' },
    { type: 'hint', code: 'cancelled_on_exit', jobId: 'queue' },
    { type: 'tray', state: 'idle' }, { type: 'quit' },
  ])
})

test('等待退出时新作业标 rejected_exiting', () => {
  const running = apply(initialState(), { type: 'job.started', jobId: 'run', title: '运行作业' }).state
  const waiting = apply(running, { type: 'quit.wait' }).state
  for (const type of ['job.queued', 'job.started']) {
    const rejected = apply(waiting, { type, jobId: 'new', title: '新作业' })
    assert.deepEqual(rejected.state.jobs, [
      { jobId: 'run', title: '运行作业', status: 'running' },
      { jobId: 'new', title: '新作业', status: 'rejected_exiting' },
    ])
    assert.deepEqual(rejected.effects, [
      { type: 'log', code: 'rejected_exiting', jobId: 'new' },
      { type: 'hint', code: 'rejected_exiting', jobId: 'new' },
      { type: 'tray', state: 'running' },
    ])
  }
  const resumed = apply(waiting, { type: 'quit.cancel' }).state
  assert.equal(apply(resumed, { type: 'job.started', jobId: 'new', title: '新作业' }).state.jobs[1].status, 'running')
})

test('四类事件产生对应通知种类', () => {
  for (const [event, kind, tray] of [
    [{ type: 'job.stage_completed', jobId: 'run', stage: '提取' }, 'stage_completed', 'idle'],
    [{ type: 'verification.pending', count: 2 }, 'verification_pending', 'idle'],
    [{ type: 'intervention.conflict', jobId: 'run' }, 'intervention_conflict', 'idle'],
    [{ type: 'backend.error', code: 'backend_exited' }, 'backend_error', 'error'],
  ]) {
    assert.deepEqual(apply(initialState(), event).effects, [{ type: 'tray', state: tray }, { type: 'notify', kind }])
  }
  for (const event of [
    { type: 'job.queued', jobId: 'run', title: '作业' },
    { type: 'job.started', jobId: 'run', title: '作业' },
    { type: 'job.finished', jobId: 'run' },
    { type: 'job.failed', jobId: 'run', reason: 'fixture' },
    { type: 'backend.ready' },
  ]) assert.deepEqual(apply(initialState(), event).effects.filter(effect => effect.type === 'notify'), [])
})

test('托盘状态 error>running>idle', () => {
  const idle = initialState()
  const queued = apply(idle, { type: 'job.queued', jobId: 'run', title: '作业' }).state
  assert.equal(queued.tray, 'idle')
  const running = apply(queued, { type: 'job.started', jobId: 'run', title: '作业' }).state
  assert.equal(running.tray, 'running')
  const error = apply(running, { type: 'backend.error', code: 'backend_exited' }).state
  assert.equal(error.tray, 'error')
  const recovered = apply(error, { type: 'backend.ready' }).state
  assert.equal(recovered.tray, 'running')
  assert.equal(apply(recovered, { type: 'job.finished', jobId: 'run' }).state.tray, 'idle')
  const failed = apply(running, { type: 'job.failed', jobId: 'other', reason: 'fixture' }).state
  assert.equal(failed.tray, 'error')
  assert.equal(apply(failed, { type: 'backend.ready' }).state.tray, 'error')
  const retried = apply(failed, { type: 'job.started', jobId: 'other', title: '重试' }).state
  assert.equal(retried.tray, 'running')
})

test('通知关闭时托盘状态仍更新', () => {
  const running = apply(initialState({ notifications: false }), { type: 'job.started', jobId: 'run', title: '作业' })
  assert.deepEqual(running.effects, [{ type: 'tray', state: 'running' }])
  for (const event of [
    { type: 'job.stage_completed', jobId: 'run', stage: '提取' },
    { type: 'verification.pending', count: 1 },
    { type: 'intervention.conflict', jobId: 'run' },
  ]) assert.deepEqual(apply(running.state, event).effects, [{ type: 'tray', state: 'running' }])
  const error = apply(running.state, { type: 'backend.error', code: 'backend_exited' })
  assert.deepEqual(error.effects, [{ type: 'tray', state: 'error' }])
  const recovered = apply(error.state, { type: 'backend.ready' })
  assert.deepEqual(recovered.effects, [{ type: 'tray', state: 'running' }])
  assert.deepEqual(apply(recovered.state, { type: 'job.finished', jobId: 'run' }).effects, [{ type: 'tray', state: 'idle' }])
})
