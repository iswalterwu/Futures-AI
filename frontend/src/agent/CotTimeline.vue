<script setup lang="ts">
import { nextTick, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ModuleId } from '../contracts/types.ts'
import { useBadgesStore } from '../stores/badges.ts'
import { useLayoutStore } from '../stores/layout.ts'
import { useUiStore } from '../stores/ui.ts'
import { useAgentStore, type AgentStep } from './store.ts'

const agent = useAgentStore()
const layout = useLayoutStore()
const badges = useBadgesStore()
const ui = useUiStore()
const router = useRouter()
const notices = reactive<Record<string, { message: string; moduleId?: ModuleId }>>({})
const stepLabels: Record<AgentStep['type'], { icon: string; label: string }> = {
  'step.thinking': { icon: '◇', label: '思考摘要' },
  'step.text': { icon: '≡', label: '文本输出' },
  'step.tool.call': { icon: '↗', label: '工具调用' },
  'step.tool.result': { icon: '↙', label: '工具结果' },
  'step.error': { icon: '!', label: '步骤错误' },
  'hint.navigate': { icon: '→', label: '建议跳转' },
}
const terminalLabels = {
  'run.completed': '已完成',
  'run.failed': '运行失败',
  'run.aborted': '已中止',
}

async function navigate(key: string, step: Extract<AgentStep, { type: 'hint.navigate' }>) {
  delete notices[key]
  if (step.target.kind === 'page') {
    const target = router.resolve(step.target.id)
    if (!target.matched.some(route => route.meta.navId)) {
      notices[key] = { message: '目标页面不存在，未跳转。' }
      return
    }
    await router.push(step.target.id)
    ui.setDrawer('closed')
    return
  }
  await layout.loadCatalog()
  if (layout.status === 'error') {
    notices[key] = { message: `无法读取模块目录：${layout.error!.message}` }
    return
  }
  const module = layout.catalog.find(module => module.id === step.target.id)
  if (!module) {
    notices[key] = { message: '目标模块不存在，未跳转。' }
    return
  }
  if (!layout.order.includes(module.id)) {
    notices[key] = { message: '该模块不在工作台', moduleId: module.id }
    return
  }
  await showModule(module.id)
}

async function restoreModule(key: string, id: ModuleId) {
  layout.add(id)
  delete notices[key]
  await showModule(id)
}

async function showModule(id: ModuleId) {
  await router.push('/workbench')
  // 收起遮挡层，保证高亮目标在加高抽屉下也能被看见。
  ui.setDrawer('closed')
  await nextTick()
  const element = document.querySelector<HTMLElement>(`.fai-module[data-module-id="${id}"]`)!
  element.scrollIntoView({ block: 'start' })
  element.focus({ preventScroll: true })
  badges.highlight(id)
}

function summary(step: AgentStep): string {
  switch (step.type) {
    case 'step.thinking':
    case 'step.text': return step.text
    case 'step.tool.call': return `${step.toolName} · ${step.argsSummary}`
    case 'step.tool.result': return step.resultSummary
    case 'step.error': return step.message
    case 'hint.navigate': return step.reason ?? step.target.id
  }
}

function time(ts: string): string {
  return new Date(ts).toLocaleTimeString('zh-CN', { hour12: false })
}
</script>

<template>
  <div class="cot-timeline">
    <p
      v-if="agent.runs.length === 0"
      class="timeline-empty"
    >
      提交问题后，在这里查看思考摘要、工具调用与运行结果。
    </p>
    <section
      v-for="run in agent.runs"
      :key="run.runId"
      class="agent-run"
      :data-run-id="run.runId"
      :data-session-id="run.sessionId"
      :aria-label="`对话：${run.prompt}`"
    >
      <header class="run-header">
        <h3>你</h3>
        <time :datetime="run.ts">{{ time(run.ts) }}</time>
        <p class="user-message">
          {{ run.prompt }}
        </p>
      </header>
      <ol class="timeline-steps">
        <li
          v-for="step in run.steps"
          :key="step.stepId"
          class="timeline-step"
          :data-step-id="step.stepId"
          :data-step-type="step.type"
          :data-target-id="step.type === 'hint.navigate' ? step.target.id : undefined"
          :data-error="step.type === 'step.error' || (step.type === 'step.tool.result' && step.isError)"
        >
          <details>
            <summary class="step-heading">
              <span aria-hidden="true">{{ stepLabels[step.type].icon }}</span>
              <span class="step-type">{{ stepLabels[step.type].label }}</span>
              <span class="step-summary">{{ summary(step) }}</span>
              <time :datetime="step.ts">{{ time(step.ts) }}</time>
            </summary>
            <div class="step-detail">
              <p v-if="step.type === 'step.thinking' || step.type === 'step.text'">
                {{ step.text }}
              </p>
              <template v-else-if="step.type === 'step.tool.call'">
                <p>工具：<code>{{ step.toolName }}</code> · <code>{{ step.toolCallId }}</code></p>
                <pre>{{ step.argsSummary }}</pre>
              </template>
              <template v-else-if="step.type === 'step.tool.result'">
                <p>{{ step.isError ? '工具执行失败' : '工具执行成功' }} · <code>{{ step.toolCallId }}</code></p>
                <pre>{{ step.resultSummary }}</pre>
                <p v-if="step.durationMs !== undefined">
                  耗时：<span class="duration">{{ step.durationMs }} ms</span>
                </p>
              </template>
              <template v-else-if="step.type === 'step.error'">
                <p>{{ step.message }}</p>
                <p>{{ step.willRetry ? '将自动重试，当前运行继续。' : '不自动重试，等待运行终态。' }}</p>
              </template>
              <template v-else-if="step.type === 'hint.navigate'">
                <p>{{ step.reason ?? '查看关联内容。' }}</p>
                <code>{{ step.target.id }}</code>
              </template>
            </div>
          </details>
          <template v-if="step.type === 'hint.navigate'">
            <button
              type="button"
              class="hint-link"
              @click="navigate(`${run.runId}:${step.stepId}`, step)"
            >
              前往{{ step.target.kind === 'module' ? '模块' : '页面' }}：{{ step.target.id }}
            </button>
            <div
              v-if="notices[`${run.runId}:${step.stepId}`]"
              class="navigation-notice"
              role="status"
            >
              <p>{{ notices[`${run.runId}:${step.stepId}`].message }}</p>
              <button
                v-if="notices[`${run.runId}:${step.stepId}`].moduleId"
                type="button"
                @click="restoreModule(`${run.runId}:${step.stepId}`, notices[`${run.runId}:${step.stepId}`].moduleId!)"
              >
                添加回工作台
              </button>
            </div>
          </template>
        </li>
      </ol>
      <details
        v-if="run.terminal"
        class="terminal-row"
        :data-terminal="run.terminal.type"
      >
        <summary class="step-heading">
          <span aria-hidden="true">{{ run.terminal.type === 'run.completed' ? '✓' : '–' }}</span>
          <span>{{ terminalLabels[run.terminal.type] }}</span>
          <time :datetime="run.terminal.ts">{{ time(run.terminal.ts) }}</time>
        </summary>
        <div class="step-detail">
          <template v-if="run.terminal.type === 'run.failed'">
            <p>{{ run.terminal.error.message }}</p>
            <code>{{ run.terminal.error.code }}</code>
            <p>{{ run.terminal.error.retryable ? '可稍后重新提交问题。' : '请检查问题或数据源后重新提交。' }}</p>
          </template>
          <p v-else>
            {{ run.terminal.type === 'run.completed' ? '本次运行已完成。' : '本次运行已中止。' }}
          </p>
        </div>
      </details>
      <p
        v-else
        class="run-pending"
      >
        运行中…
      </p>
    </section>
  </div>
</template>

<style scoped>
.cot-timeline,
.agent-run {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--fai-space-grid-gap);
}

.cot-timeline {
  gap: var(--fai-space-section-gap);
}

.timeline-empty,
.run-pending {
  color: var(--fai-text-secondary);
}

.run-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
}

.run-header h3 {
  font-size: var(--fai-type-card-t);
  font-weight: var(--fai-weight-emphasis);
}

.user-message {
  flex-basis: 100%;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.timeline-steps {
  margin: 0;
  padding: 0 0 0 var(--fai-space-grid-gap);
  list-style: none;
  border-inline-start: thin solid var(--fai-glass-drawer-border);
}

.timeline-step + .timeline-step {
  margin-top: var(--fai-space-grid-gap);
}

.step-heading {
  display: flex;
  align-items: baseline;
  gap: calc(var(--fai-space-grid-gap) / 2);
  font-size: var(--fai-type-timeline-step);
  cursor: pointer;
}

.step-heading::before {
  content: '›';
}

details[open] > .step-heading::before {
  content: '⌄';
}

.step-heading::-webkit-details-marker {
  display: none;
}

.step-type,
time {
  flex: none;
}

.step-summary {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--fai-text-secondary);
}

time {
  margin-inline-start: auto;
  color: var(--fai-text-muted);
  font-family: var(--fai-font-mono);
  font-size: var(--fai-type-tsrow);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.step-detail {
  padding: var(--fai-space-grid-gap);
  margin-top: calc(var(--fai-space-grid-gap) / 2);
  border-inline-start: thin solid var(--fai-glass-drawer-border);
  overflow-wrap: anywhere;
}

.step-detail p,
.step-detail pre {
  margin: 0;
  white-space: pre-wrap;
}

.duration {
  display: inline-block;
  font-family: var(--fai-font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.timeline-step[data-error='true'] > details,
.terminal-row[data-terminal='run.failed'] {
  border-inline-start: var(--fai-radius-base) solid var(--fai-status-bad);
  padding-inline-start: calc(var(--fai-space-grid-gap) / 2);
}

.terminal-row {
  border-top: thin solid var(--fai-glass-drawer-border);
  padding-top: var(--fai-space-grid-gap);
}

.hint-link,
.navigation-notice button {
  margin-top: calc(var(--fai-space-grid-gap) / 2);
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-accent-link);
  border-radius: var(--fai-radius-control);
  background: transparent;
  color: var(--fai-accent-link);
  overflow-wrap: anywhere;
  text-align: start;
  cursor: pointer;
}

.navigation-notice {
  margin-top: calc(var(--fai-space-grid-gap) / 2);
}
</style>
