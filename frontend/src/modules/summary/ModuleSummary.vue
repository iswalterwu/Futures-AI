<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { DataClient } from '../../contracts/client.ts'
import { dataClient } from '../../contracts/index.ts'
import type { ContractError, ErrorResponse, ModuleDef, ModuleSummary } from '../../contracts/types.ts'
import ModuleShell from '../ModuleShell.vue'

const props = defineProps<{ module: ModuleDef; client?: DataClient }>()
const summary = ref<ModuleSummary>()
const state = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const error = ref<ContractError>()

onMounted(load)

async function load() {
  state.value = 'loading'
  error.value = undefined
  try {
    summary.value = await (props.client ?? dataClient).getModuleSummary(props.module.id)
    state.value = summary.value.text ? 'ready' : 'empty'
  } catch (cause) {
    error.value = (cause as ErrorResponse).error
    state.value = 'error'
  }
}
</script>

<template>
  <ModuleShell
    :module="module"
    :state="state"
    :error="error"
    :badge="state === 'error' ? 'bad' : 'sample'"
    :right="summary ? `截至 ${summary.asOf}` : '–'"
    empty-message="暂无示例摘要。内容随 domain feature 交付。"
    @retry="load"
  >
    <div
      v-if="summary"
      class="module-summary"
    >
      <p>{{ summary.text }}</p>
      <p class="summary-note">
        内容随 domain feature 交付。
      </p>
    </div>
  </ModuleShell>
</template>

<style scoped>
.module-summary {
  display: grid;
  gap: var(--fai-space-grid-gap);
  font-family: var(--fai-font-sans);
}

.summary-note {
  color: var(--fai-text-muted);
  font-size: var(--fai-type-footnote);
}
</style>
