<script setup lang="ts">
import { StageLabel, StageStateLabel, type Stage, type StageSummary } from '../../contracts/types.ts'

defineProps<{ stages: readonly StageSummary[]; currentStage: Stage; viewedStage: Stage | null }>()
defineEmits<{ select: [stage: Stage] }>()
</script>

<template>
  <nav
    class="stage-rail"
    aria-label="作业阶段"
  >
    <button
      v-for="item in stages"
      :key="item.stage"
      type="button"
      :aria-current="item.stage === currentStage ? 'step' : undefined"
      :aria-pressed="item.stage === viewedStage"
      @click="$emit('select', item.stage)"
    >
      <span class="stage-name">
        <span aria-hidden="true">{{ StageLabel[item.stage].icon }}</span>
        {{ StageLabel[item.stage].text }}
      </span>
      <span class="stage-state">
        <span aria-hidden="true">{{ StageStateLabel[item.state].icon }}</span>
        {{ StageStateLabel[item.state].text }}
      </span>
    </button>
  </nav>
</template>

<style scoped>
.stage-rail {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--fai-space-grid-gap);
}

.stage-rail button {
  display: grid;
  gap: calc(var(--fai-space-grid-gap) / 2);
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-inline-start: var(--fai-radius-base) solid transparent;
  border-radius: var(--fai-radius-control);
  background: transparent;
  color: var(--fai-text-primary);
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.stage-rail button[aria-current='step'] {
  border-inline-start-color: var(--fai-accent-red);
}

.stage-rail button[aria-pressed='true'] .stage-name {
  text-decoration: underline;
}

.stage-rail button:focus-visible {
  outline-color: var(--fai-accent-link);
}

.stage-state {
  color: var(--fai-text-secondary);
}
</style>
