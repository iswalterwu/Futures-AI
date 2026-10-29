<script setup lang="ts">
import { computed } from 'vue'
import { JobStatusLabel, type JobStatus } from '../../contracts/types.ts'

const props = defineProps<{ status: JobStatus }>()
const label = computed(() => JobStatusLabel[props.status])
</script>

<template>
  <span
    class="job-status-badge"
    :data-status="props.status"
  >
    <span aria-hidden="true">{{ label.icon }}</span>
    <span>{{ label.text }}</span>
  </span>
</template>

<style scoped>
.job-status-badge {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--fai-space-grid-gap) / 2);
  padding: 0 calc(var(--fai-space-grid-gap) / 2);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-base);
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-tag);
  white-space: nowrap;
}

.job-status-badge[data-status='collecting'],
.job-status-badge[data-status='processing'],
.job-status-badge[data-status='analyzing'],
.job-status-badge[data-status='delivering'],
.job-status-badge[data-status='delivered'] {
  border-color: var(--fai-status-ok);
}

.job-status-badge[data-status='needs_human'] {
  border-color: var(--fai-status-warn);
}

.job-status-badge[data-status='failed'] {
  border-color: var(--fai-status-bad);
}
</style>
