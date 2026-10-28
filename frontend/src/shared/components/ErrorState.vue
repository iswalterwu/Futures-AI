<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ContractError } from '../../contracts/types.ts'

const props = defineProps<{ moduleId: string; error: ContractError; ts?: string }>()
defineEmits<{ retry: [] }>()
const occurredAt = new Date().toISOString()
const diagnostic = computed(() => JSON.stringify({
  moduleId: props.moduleId,
  code: props.error.code,
  message: props.error.message,
  ts: props.ts ?? occurredAt,
}, null, 2))
const copyStatus = ref('')

async function copyDiagnostic() {
  try {
    await navigator.clipboard.writeText(diagnostic.value)
    copyStatus.value = '诊断已复制。'
  } catch {
    copyStatus.value = '复制失败，请选择诊断信息手动复制。'
  }
}
</script>

<template>
  <div class="error-state">
    <p role="alert">
      {{ error.message }}
    </p>
    <code>{{ diagnostic }}</code>
    <div class="error-actions">
      <button
        type="button"
        @click="copyDiagnostic"
      >
        复制诊断
      </button>
      <button
        v-if="error.retryable"
        type="button"
        @click="$emit('retry')"
      >
        重试
      </button>
    </div>
    <p role="status">
      {{ copyStatus }}
    </p>
  </div>
</template>

<style scoped>
.error-state {
  display: grid;
  gap: var(--fai-space-grid-gap);
  padding: var(--fai-space-section-gap);
  color: var(--fai-text-secondary);
  text-align: center;
  overflow-wrap: anywhere;
}

.error-state > [role='alert'] {
  border-inline-start: var(--fai-radius-base) solid var(--fai-status-bad);
  color: var(--fai-text-primary);
}

.error-state code {
  display: block;
  min-width: 0;
  white-space: pre-wrap;
  text-align: start;
  user-select: text;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--fai-space-grid-gap);
}

.error-actions button {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
  color: var(--fai-text-primary);
  cursor: pointer;
}

.error-actions button:hover,
.error-actions button:focus-visible {
  border-color: var(--fai-accent-link);
}
</style>
