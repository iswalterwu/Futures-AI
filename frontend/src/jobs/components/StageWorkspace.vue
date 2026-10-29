<script setup lang="ts">
import { StageLabel, type Stage } from '../../contracts/types.ts'

defineProps<{ stage: Stage }>()
</script>

<template>
  <section
    class="stage-workspace"
    :aria-label="`${StageLabel[stage].text}工作区`"
  >
    <h2>{{ StageLabel[stage].text }}工作区</h2>
    <p>工作区内容由后续任务提供。</p>
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
