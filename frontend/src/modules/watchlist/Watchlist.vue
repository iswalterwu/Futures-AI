<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DataClient } from '../../contracts/client.ts'
import { dataClient } from '../../contracts/index.ts'
import type { ContractError, ErrorResponse, ModuleDef, WatchlistTable } from '../../contracts/types.ts'
import '../../design/updown.css'
import { fmtDelta, fmtValue } from '../../shared/format.ts'
import DataTable from '../../shared/components/DataTable.vue'
import Num from '../../shared/components/Num.vue'
import Spark from '../../shared/components/Spark.vue'
import ModuleShell from '../ModuleShell.vue'

defineOptions({ name: 'FaiWatchlist' })
const props = defineProps<{ module: ModuleDef; client?: DataClient }>()
const table = ref<WatchlistTable>()
const state = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const error = ref<ContractError>()
const columns = [
  { key: 'name', label: '合约' },
  { key: 'price', label: '最新价', numeric: true },
  { key: 'change', label: '涨跌', numeric: true },
  { key: 'changePct', label: '涨跌幅', numeric: true },
  { key: 'spark', label: '走势' },
] as const
const rows = computed(() => table.value?.rows.map(row => {
  const price = fmtValue(row.price.value, { decimals: row.price.decimals })
  const change = fmtDelta(row.change.value, { decimals: row.change.decimals })
  return { ...row, priceDisplay: { ...price, tone: price.tone === 'neutral' ? 'neutral' : change.tone } }
}) ?? [])

onMounted(load)

async function load() {
  state.value = 'loading'
  error.value = undefined
  try {
    table.value = await (props.client ?? dataClient).getWatchlist()
    state.value = table.value.rows.length ? 'ready' : 'empty'
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
    :right="table ? `截至 ${table.asOf}` : '–'"
    empty-message="暂无关注合约。"
    @retry="load"
  >
    <DataTable
      :rows="rows"
      :columns="columns"
      label="关注合约价格"
    >
      <template #name="{ row }">
        <span class="contract-name">{{ row.name }}</span>
        <span class="unit">{{ row.price.unit }}</span>
      </template>
      <template #price="{ row }">
        <span
          class="num"
          :class="[`sem-${row.price.semantic}`, `is-${row.priceDisplay.tone}`]"
          :title="`截至 ${row.price.asOf}`"
        >{{ row.priceDisplay.text }}</span>
      </template>
      <template #change="{ row }">
        <Num
          :value="row.change.value"
          :decimals="row.change.decimals"
          :semantic="row.change.semantic"
          delta
        />
      </template>
      <template #changePct="{ row }">
        <Num
          :value="row.changePct.value"
          :decimals="row.changePct.decimals"
          :semantic="row.changePct.semantic"
          delta
          kind="pct"
        />
      </template>
      <template #spark="{ row }">
        <Spark :series="row.spark" />
      </template>
    </DataTable>
  </ModuleShell>
</template>

<style scoped>
.contract-name {
  display: block;
}

.unit {
  color: var(--fai-text-muted);
}
</style>
