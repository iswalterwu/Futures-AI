<script setup lang="ts">
import { computed } from 'vue'
import type { Figure, Semantic } from '../../contracts/types.ts'
import { fmtDelta, fmtValue } from '../format.ts'
import '../num.css'

defineOptions({ name: 'FaiNum' })

const props = defineProps<{
  value: number | null | undefined
  decimals: number
  semantic: Semantic
  unit?: string
  delta?: boolean
  kind?: Figure['deltaKind']
}>()

const formatted = computed(() => props.delta
  ? fmtDelta(props.value, { decimals: props.decimals, kind: props.kind })
  : fmtValue(props.value, { decimals: props.decimals, unit: props.unit }))
</script>

<template>
  <span
    class="num"
    :class="[`sem-${semantic}`, `is-${formatted.tone}`]"
  >{{ formatted.text }}</span>
</template>
