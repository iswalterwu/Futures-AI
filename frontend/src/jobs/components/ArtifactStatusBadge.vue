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
  <span class="artifact-status-badge">
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
  border: thin solid var(--fai-status-ok);
  border-radius: var(--fai-radius-base);
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-tag);
  white-space: nowrap;
}
</style>
