<script setup lang="ts">
import type { ContractError } from '../contracts/types.ts'

defineProps<{
  progress: number
  statusText: string
  notice?: string
  error: ContractError | null
}>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <main
    class="fai-loading"
    data-testid="loading-screen"
    :data-phase="error ? 'error' : 'loading'"
    :aria-busy="!error"
  >
    <h1 class="wordmark">
      Futures-AI
    </h1>
    <p role="status">
      {{ error ? '启动失败' : statusText }}
    </p>
    <progress
      :value="progress"
      max="100"
      aria-label="加载进度"
    />
    <span class="num">{{ progress }}%</span>
    <p class="notice">
      {{ notice ?? '正在读取启动信息…' }}
    </p>
    <p
      v-if="error"
      class="boot-error"
      role="alert"
    >
      {{ error.message }}
    </p>
    <button
      v-if="error"
      type="button"
      class="retry-button"
      @click="$emit('retry')"
    >
      重试
    </button>
  </main>
</template>

<style scoped>
.boot-error {
  color: var(--fai-text-primary);
  border-inline-start: var(--fai-radius-base) solid var(--fai-status-bad);
  padding-inline: var(--fai-space-grid-gap);
}

.retry-button {
  justify-self: center;
  padding: var(--fai-space-grid-gap) var(--fai-space-section-gap);
  border: thin solid var(--fai-glass-focus-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
  cursor: pointer;
}
</style>
