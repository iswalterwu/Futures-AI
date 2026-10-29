<script setup lang="ts">
import { computed } from 'vue'
import {
  ArtifactStatusLabel, UploadStatusLabel,
  type ArtifactStatus, type UploadStatus,
} from '../../contracts/types.ts'

const props = defineProps<{ status: ArtifactStatus | UploadStatus }>()
const label = computed(() => props.status in ArtifactStatusLabel
  ? ArtifactStatusLabel[props.status as ArtifactStatus]
  : UploadStatusLabel[props.status as UploadStatus])
</script>

<template>
  <span
    class="artifact-status-badge"
    :data-status="props.status"
  >
    <span aria-hidden="true">{{ label.icon }}</span>
    <span>{{ label.text }}</span>
  </span>
</template>

<style scoped>
.artifact-status-badge {
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

.artifact-status-badge[data-status='confirmed'],
.artifact-status-badge[data-status='ingested'] {
  border-color: var(--fai-status-ok);
}

.artifact-status-badge[data-status='provisional'],
.artifact-status-badge[data-status='pending_validation'] {
  border-color: var(--fai-status-warn);
}

.artifact-status-badge[data-status='conflict'],
.artifact-status-badge[data-status='quarantined'] {
  border-color: var(--fai-status-bad);
}
</style>
