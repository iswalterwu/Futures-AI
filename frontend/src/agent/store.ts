import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { agentClient } from '../contracts/index.ts'
import type { ContractError, ErrorResponse } from '../contracts/types.ts'
import { useBadgesStore } from '../stores/badges.ts'
import { isTerminalEvent, type AgentEvent, type TerminalEvent } from './events.ts'

export type AgentStep = Extract<AgentEvent, { stepId: number }>
export interface AgentRun {
  runId: string
  sessionId: string
  prompt: string
  ts: string
  steps: AgentStep[]
  terminal: TerminalEvent | null
}

export const useAgentStore = defineStore('agent', () => {
  const runs = ref<AgentRun[]>([])
  const sessionId = ref<string>()
  const sending = ref(false)
  const sendError = ref<ContractError | null>(null)
  const running = computed(() => runs.value.some(run => run.terminal === null))
  const badges = useBadgesStore()

  async function send(message: string): Promise<boolean> {
    sending.value = true
    sendError.value = null
    try {
      const receipt = await agentClient.send({ sessionId: sessionId.value, message })
      sessionId.value = receipt.sessionId
      return true
    } catch (cause) {
      sendError.value = (cause as ErrorResponse).error
      return false
    } finally {
      sending.value = false
    }
  }

  function receive(event: AgentEvent) {
    if (event.type === 'run.started') {
      runs.value.push({ ...event, steps: [], terminal: null })
      return
    }
    const run = runs.value.find(run => run.runId === event.runId)!
    if (isTerminalEvent(event)) {
      run.terminal = event
      badges.settle(event)
      return
    }
    mergeStep(run, event)
    if ('moduleId' in event && event.moduleId) badges.markRunning(event.moduleId, event.runId)
  }

  return { runs, sessionId, sending, sendError, running, send, receive }
})

function mergeStep(run: AgentRun, event: AgentStep) {
  const index = run.steps.findIndex(step => step.stepId === event.stepId)
  const previous = run.steps[index]
  let step = event
  if (event.type === 'step.thinking' || event.type === 'step.text') {
    const text = previous && 'text' in previous ? previous.text : ''
    step = { ...event, text: event.done ? event.text : text + event.text }
  }
  if (index === -1) run.steps.push(step)
  else run.steps[index] = step
}
