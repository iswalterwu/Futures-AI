import { defineStore } from 'pinia'
import { onScopeDispose, ref } from 'vue'
import type { TerminalEvent } from '../agent/events.ts'
import type { ModuleId } from '../contracts/types.ts'

export const useBadgesStore = defineStore('badges', () => {
  const modules = ref<Partial<Record<ModuleId, { runId: string; state: 'running' | 'done' }>>>({})
  const highlightedId = ref<ModuleId | null>(null)
  let highlightTimer: ReturnType<typeof setTimeout> | undefined

  function markRunning(id: ModuleId, runId: string) {
    modules.value[id] = { runId, state: 'running' }
  }

  function settle(event: TerminalEvent) {
    for (const id of Object.keys(modules.value) as ModuleId[]) {
      const badge = modules.value[id]!
      if (badge.runId !== event.runId) continue
      if (event.type === 'run.completed') badge.state = 'done'
      else clear(id)
    }
    if (event.type === 'run.completed') {
      for (const id of event.moduleIds) modules.value[id] = { runId: event.runId, state: 'done' }
    }
  }

  function clear(id: ModuleId) {
    delete modules.value[id]
  }

  function highlight(id: ModuleId) {
    clearTimeout(highlightTimer)
    highlightedId.value = id
    highlightTimer = setTimeout(() => { highlightedId.value = null }, 1500)
  }

  function clearHighlight(id: ModuleId) {
    if (highlightedId.value !== id) return
    clearTimeout(highlightTimer)
    highlightedId.value = null
  }

  onScopeDispose(() => clearTimeout(highlightTimer))
  return { modules, highlightedId, markRunning, settle, clear, highlight, clearHighlight }
})
