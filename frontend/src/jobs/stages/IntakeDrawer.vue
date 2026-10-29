<script setup lang="ts">
import { useIntakeStore } from '../stores/intake.ts'
import IntakePanel from './IntakePanel.vue'

const intake = useIntakeStore()
</script>

<template>
  <aside
    class="glass-drawer intake-drawer"
    aria-label="投放抽屉"
  >
    <header class="intake-heading">
      <h2>投放</h2>
      <button
        type="button"
        @click="intake.close()"
      >
        关闭
      </button>
    </header>
    <p v-if="intake.jobId === null">
      未指定作业：提交后进入待归属池
    </p>
    <p v-else>
      目标作业：{{ intake.jobId }}
    </p>
    <IntakePanel />
  </aside>
</template>

<style scoped>
.intake-drawer {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: var(--fai-space-grid-gap);
  overflow-wrap: anywhere;
}

.intake-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--fai-space-grid-gap);
}

.intake-heading button {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
  cursor: pointer;
}

.intake-heading button:focus-visible {
  outline-color: var(--fai-accent-link);
}
</style>
