<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { DataClient } from '../../contracts/client.ts'
import { dataClient } from '../../contracts/index.ts'
import type { ContractError, ErrorResponse, MarketBoard, ModuleDef } from '../../contracts/types.ts'
import '../../design/updown.css'
import BoardGrid from '../../shared/components/BoardGrid.vue'
import ModuleShell from '../ModuleShell.vue'

const props = defineProps<{ module: ModuleDef; client?: DataClient }>()
const board = ref<MarketBoard>()
const state = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const error = ref<ContractError>()

onMounted(load)

async function load() {
  state.value = 'loading'
  error.value = undefined
  try {
    board.value = await (props.client ?? dataClient).getMarketBoard()
    state.value = board.value.rows.length ? 'ready' : 'empty'
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
    :right="board ? `截至 ${board.asOf}` : '–'"
    empty-message="暂无行情盘面数据。"
    @retry="load"
  >
    <BoardGrid
      v-if="board"
      :board="board"
    />
  </ModuleShell>
</template>
