<script setup lang="ts">
import { computed } from 'vue'
import type { Figure } from '../../contracts/types.ts'
import { figureDeltaDecimals, fmtValue } from '../format.ts'
import Num from './Num.vue'

defineOptions({ name: 'FaiKpi' })

const props = defineProps<{ figure: Figure }>()
const value = computed(() => fmtValue(props.figure.value, { decimals: props.figure.decimals }))
</script>

<template>
  <div class="kpi">
    <div class="kpi-label">
      {{ figure.label }}
    </div>
    <div class="kpi-reading">
      <span class="kpi-value">{{ value.text }}</span>
      <span class="unit">{{ figure.unit }}</span>
    </div>
    <Num
      v-if="figure.delta !== undefined"
      class="kpi-delta"
      :value="figure.delta"
      :decimals="figureDeltaDecimals(figure)"
      :semantic="figure.semantic"
      :kind="figure.deltaKind"
      delta
    />
  </div>
</template>

<style scoped>
.kpi {
  display: grid;
  min-width: 0;
  gap: var(--fai-space-grid-gap);
}

.kpi-label {
  color: var(--fai-text-secondary);
  font-family: var(--fai-font-sans);
  font-size: var(--fai-type-meta);
}

.kpi-reading {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: var(--fai-space-grid-gap);
}

.kpi-value {
  color: var(--fai-text-primary);
  font-family: var(--fai-font-serif);
  font-size: var(--fai-type-kpi);
  font-weight: var(--fai-weight-regular);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.unit {
  color: var(--fai-text-secondary);
  font-family: var(--fai-font-mono);
  font-size: var(--fai-type-unit);
}

.kpi-delta {
  font-size: var(--fai-type-meta);
}
</style>
