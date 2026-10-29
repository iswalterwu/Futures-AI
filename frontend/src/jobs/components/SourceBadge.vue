<script setup lang="ts">
import { computed } from 'vue'
import { OriginLabel, SourceLabel, type Origin, type Source } from '../../contracts/types.ts'

const props = defineProps<{ origin: Origin; source: Source }>()
const label = computed(() => props.origin === 'derived' ? OriginLabel.derived : SourceLabel[props.source])
</script>

<template>
  <span class="source-badge">
    <span aria-hidden="true">{{ label.icon }}</span>
    <span>{{ label.text }}</span>
    <span
      v-if="origin === 'derived'"
      class="source-secondary"
    >· {{ SourceLabel[source].text }}</span>
  </span>
</template>

<style scoped>
.source-badge {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--fai-space-grid-gap) / 2);
  padding: 0 calc(var(--fai-space-grid-gap) / 2);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-base);
  color: var(--fai-text-primary);
  font-size: var(--fai-type-tag);
  white-space: nowrap;
}

.source-secondary {
  color: var(--fai-text-secondary);
}
</style>
