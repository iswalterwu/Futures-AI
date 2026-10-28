<script setup lang="ts">
import { ref } from 'vue'
import { useUiStore } from '../stores/ui.ts'
import AgentDrawer from './AgentDrawer.vue'
import { useAgentStore } from './store.ts'

const agent = useAgentStore()
const ui = useUiStore()
const message = ref('')

async function submit() {
  if (ui.drawer === 'closed') ui.setDrawer('half')
  if (await agent.send(message.value)) message.value = ''
}
</script>

<template>
  <div class="agent-dock">
    <AgentDrawer />
    <form
      class="dock-form"
      aria-label="AI 对话输入栏"
      @submit.prevent="submit"
    >
      <button
        type="button"
        class="drawer-toggle"
        :aria-expanded="ui.drawer !== 'closed'"
        aria-controls="agent-drawer"
        @click="ui.setDrawer(ui.drawer === 'closed' ? 'half' : 'closed')"
      >
        {{ ui.drawer === 'closed' ? '展开对话' : '收起对话' }}
      </button>
      <span
        v-if="agent.running"
        class="running-indicator"
        role="status"
      ><i aria-hidden="true" />运行中</span>
      <label for="agent-message">AI</label>
      <input
        id="agent-message"
        v-model="message"
        name="message"
        aria-label="向 AI 提问"
        placeholder="询问行情、指标或文档…"
        autocomplete="off"
        :disabled="agent.sending"
      >
      <button
        type="submit"
        :disabled="!message.trim() || agent.sending || agent.running"
      >
        {{ agent.sending ? '正在发送…' : '发送' }}
      </button>
    </form>
    <p
      v-if="agent.sendError"
      class="send-error"
      role="alert"
    >
      发送失败：{{ agent.sendError.message }}
    </p>
  </div>
</template>

<style scoped>
.agent-dock {
  position: relative;
  min-width: 0;
  background: var(--fai-bg-bottom);
  border-top: thin solid var(--fai-glass-drawer-border);
}

.dock-form {
  display: flex;
  align-items: center;
  gap: var(--fai-space-grid-gap);
  padding: var(--fai-space-grid-gap) var(--fai-space-content-pad-x);
}

.dock-form input {
  flex: 1;
  min-width: 0;
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-drawer-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
}

.dock-form input::placeholder {
  color: var(--fai-text-muted);
}

.dock-form button {
  flex: none;
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-drawer-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
  cursor: pointer;
}

.dock-form button:hover:not(:disabled),
.dock-form button:focus-visible,
.dock-form input:focus-visible {
  outline: thin solid var(--fai-accent-link);
}

.dock-form button:disabled {
  color: var(--fai-text-muted);
  cursor: default;
}

.running-indicator {
  display: flex;
  flex: none;
  align-items: center;
  gap: calc(var(--fai-space-grid-gap) / 2);
  color: var(--fai-status-warn);
  font-size: var(--fai-type-meta);
}

.running-indicator i {
  width: var(--fai-status-dot-size);
  height: var(--fai-status-dot-size);
  border-radius: var(--fai-radius-round);
  background: currentColor;
  animation: agent-pulse 1500ms ease-in-out infinite;
}

@keyframes agent-pulse {
  50% { opacity: 0; }
}

.send-error {
  padding: 0 var(--fai-space-content-pad-x) var(--fai-space-grid-gap);
  color: var(--fai-text-primary);
}

@media (prefers-reduced-motion: reduce) {
  .running-indicator i {
    animation: none;
  }
}
</style>
