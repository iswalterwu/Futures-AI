<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import { StageLabel, type Job, type Stage, type StageWorkspace } from '../../contracts/types.ts'
import CollectWorkspace from '../stages/CollectWorkspace.vue'

defineProps<{ stage: Stage; job: DeepReadonly<Job>; workspace: DeepReadonly<StageWorkspace> | null }>()
</script>

<template>
  <section
    class="stage-workspace"
    :aria-label="`${StageLabel[stage].text}工作区`"
  >
    <h2>{{ StageLabel[stage].text }}工作区</h2>
    <CollectWorkspace
      v-if="stage === 'collect' && workspace?.stage === 'collect'"
      :job="job"
      :workspace="workspace"
    />
    <p
      v-else-if="stage === 'collect'"
      role="status"
    >
      读取中…
    </p>
    <p v-else>
      工作区内容由后续任务提供。
    </p>
  </section>
</template>

<style scoped>
.stage-workspace {
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
}

.stage-workspace p {
  color: var(--fai-text-secondary);
}
</style>
