<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Job, StageWorkspace } from '../../contracts/types.ts'
import ArtifactStatusBadge from '../components/ArtifactStatusBadge.vue'
import { useIntakeStore } from '../stores/intake.ts'

defineProps<{
  job: DeepReadonly<Job>
  workspace: Extract<DeepReadonly<StageWorkspace>, { readonly stage: 'collect' }>
}>()
const intake = useIntakeStore()
</script>

<template>
  <div class="collect-workspace">
    <button
      type="button"
      @click="intake.open(job.id)"
    >
      投放到本作业
    </button>
    <ul aria-label="采集列表">
      <li
        v-for="upload in workspace.uploads"
        :key="upload.id"
      >
        <p v-if="upload.inputKind === 'file'">
          文件 · {{ upload.fileMeta.name }}
        </p>
        <p v-else-if="upload.inputKind === 'url'">
          链接 · {{ upload.url }}
        </p>
        <p v-else>
          文本 · 文本投放（正文未保存）
        </p>
        <p>用途：{{ upload.sourceNote.purpose }}</p>
        <ArtifactStatusBadge :status="upload.status" />
      </li>
    </ul>
    <p v-if="workspace.uploads.length === 0">
      暂无投放。
    </p>
  </div>
</template>

<style scoped>
.collect-workspace {
  min-width: 0;
  overflow-wrap: anywhere;
}

.collect-workspace ul {
  display: grid;
  gap: var(--fai-space-grid-gap);
  padding: 0;
  list-style: none;
}

.collect-workspace li {
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
}

.collect-workspace button {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
  cursor: pointer;
}

.collect-workspace button:focus-visible {
  outline-color: var(--fai-accent-link);
}
</style>
