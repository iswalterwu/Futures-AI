<script setup lang="ts">
import { computed } from 'vue'
import { JobStatusLabel, type JobStatus } from '../../contracts/types.ts'

const props = defineProps<{ status: JobStatus }>()
const label = computed(() => JobStatusLabel[props.status])
</script>

<template>
  <span class="job-status-badge">
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
  border: thin solid var(--fai-status-ok);
  border-radius: var(--fai-radius-base);
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-tag);
  white-space: nowrap;
}
</style>
