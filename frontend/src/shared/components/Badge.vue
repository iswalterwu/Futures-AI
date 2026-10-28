<script setup lang="ts">
defineOptions({ name: 'FaiBadge' })
withDefaults(defineProps<{ state?: 'ok' | 'warn' | 'bad' | 'sample' }>(), { state: 'ok' })
const labels = { ok: '正常', warn: '警告', bad: '异常', sample: '样例' } as const
</script>

<template>
  <span
    class="badge"
    :data-badge="state"
  >{{ labels[state] }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0 calc(var(--fai-space-grid-gap) / 2);
  border: thin solid var(--fai-status-ok);
  border-radius: var(--fai-radius-base);
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-tag);
  white-space: nowrap;
}

.badge[data-badge='warn'] {
  border-color: var(--fai-status-warn);
}

.badge[data-badge='bad'] {
  border-color: var(--fai-status-bad);
}

.badge[data-badge='sample'] {
  border-color: var(--fai-status-sample);
  border-style: dashed;
}
</style>
