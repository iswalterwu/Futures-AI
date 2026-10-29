// Pure shell activity state. Sources validate once before calling apply.
'use strict'

function initialState({ notifications = true } = {}) {
  return { jobs: [], accepting: true, waiting: false, backendError: null, notifications, tray: 'idle' }
}

function apply(state, event) {
  const next = { ...state, jobs: state.jobs.map(job => ({ ...job })) }
  const effects = []
  const job = next.jobs.find(item => item.jobId === event.jobId)
  let notification = null
  let checkDrain = false
  switch (event.type) {
    case 'job.queued':
    case 'job.started': {
      const status = next.accepting ? (event.type === 'job.queued' ? 'queued' : 'running') : 'rejected_exiting'
      if (job) Object.assign(job, { title: event.title, status })
      else next.jobs.push({ jobId: event.jobId, title: event.title, status })
      if (status === 'rejected_exiting') markEffects(effects, event.jobId, status)
      break
    }
    case 'job.stage_completed': notification = 'stage_completed'; break
    case 'verification.pending': notification = 'verification_pending'; break
    case 'intervention.conflict': notification = 'intervention_conflict'; break
    case 'backend.error': next.backendError = event.code; notification = 'backend_error'; break
    case 'backend.ready': next.backendError = null; break
    case 'job.finished':
      if (job) job.status = 'finished'
      checkDrain = true
      break
    case 'job.failed':
      if (job) Object.assign(job, { status: 'failed', reason: event.reason })
      else next.jobs.push({ jobId: event.jobId, status: 'failed', reason: event.reason })
      checkDrain = true
      break
    // Internal user actions, not accepted by the external event source validator.
    case 'quit.request':
      if (next.jobs.some(item => item.status === 'running')) {
        effects.push({ type: 'ask' })
        break
      }
      // No running jobs: still mark queued work before exiting.
      // falls through
    case 'quit.wait':
      next.accepting = false
      next.waiting = true
      for (const item of next.jobs) {
        if (item.status === 'queued') {
          item.status = 'cancelled_on_exit'
          markEffects(effects, item.jobId, item.status)
        }
      }
      checkDrain = true
      break
    case 'quit.cancel':
      if (!state.waiting) return { state, effects: [] }
      next.accepting = true
      next.waiting = false
      break
  }
  next.tray = next.backendError !== null || next.jobs.some(item => item.status === 'failed') ? 'error' :
    next.jobs.some(item => item.status === 'running') ? 'running' : 'idle'
  effects.push({ type: 'tray', state: next.tray })
  if (notification && next.notifications) effects.push({ type: 'notify', kind: notification })
  if (checkDrain && next.waiting && !next.jobs.some(item => item.status === 'running')) effects.push({ type: 'quit' })
  return { state: next, effects }
}

function markEffects(effects, jobId, code) {
  effects.push({ type: 'log', code, jobId }, { type: 'hint', code, jobId })
}

// Boundary validation shared by file and future runtime sources. No payload is logged.
function validateEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) return 'unknown_type'
  let fields
  switch (event.type) {
    case 'job.queued':
    case 'job.started': fields = ['jobId', 'title']; break
    case 'job.stage_completed': fields = ['jobId', 'stage']; break
    case 'job.finished':
    case 'intervention.conflict': fields = ['jobId']; break
    case 'job.failed': fields = ['jobId', 'reason']; break
    case 'backend.error': fields = ['code']; break
    case 'backend.ready': fields = []; break
    case 'verification.pending':
      if (!Number.isInteger(event.count) || event.count < 0) return 'missing_field'
      fields = []
      break
    default: return 'unknown_type'
  }
  if (fields.some(field => typeof event[field] !== 'string' || event[field].length === 0)) return 'missing_field'
  if (event.delayMs !== undefined && (!Number.isFinite(event.delayMs) || event.delayMs < 0)) return 'invalid_delay'
  return null
}

module.exports = { initialState, apply, validateEvent }
