<script setup lang="ts">
import { computed } from 'vue'
import type { MarketBoard } from '../../contracts/types.ts'
import { fmtDelta, fmtValue } from '../format.ts'
import '../num.css'

const props = defineProps<{ board: MarketBoard }>()
const stateLabels = { holiday: '休', pending: '待', missing: '–' } as const
const stateTitles = { holiday: '休市', pending: '待结算', missing: '缺数' } as const
const rows = computed(() => props.board.rows.map(row => ({
  ...row,
  cells: row.cells.map(cell => {
    if (cell.state !== 'ok') return { ...cell, display: null }
    const value = fmtValue(cell.figure.value, { decimals: cell.figure.decimals })
    const delta = fmtDelta(cell.figure.delta, { decimals: cell.figure.decimals, kind: cell.figure.deltaKind })
    // 价格的正负不是涨跌，字色取变化量；显示为零或缺数时仍须中性。
    return { ...cell, display: { ...value, tone: value.tone === 'neutral' ? 'neutral' : delta.tone } }
  }),
})))
</script>

<template>
  <div class="board-scroll">
    <table
      class="board-grid"
      aria-label="行情盘面"
    >
      <thead>
        <tr>
          <th
            class="stub"
            scope="col"
          >
            合约
          </th>
          <th
            v-for="column in board.columns"
            :key="column.id"
            scope="col"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          :data-row-id="row.id"
        >
          <th
            class="stub"
            scope="row"
          >
            {{ row.label }}
          </th>
          <td
            v-for="(cell, index) in row.cells"
            :key="board.columns[index].id"
            :data-column-id="board.columns[index].id"
            :data-state="cell.state"
          >
            <template v-if="cell.state === 'ok'">
              <span
                class="num"
                :class="[`sem-${cell.figure.semantic}`, `is-${cell.display.tone}`]"
                :title="`${cell.figure.label} · 截至 ${cell.figure.asOf}`"
              >{{ cell.display.text }}</span>
              <span class="unit">{{ cell.figure.unit }}</span>
            </template>
            <span
              v-else
              class="board-status"
              :class="cell.state"
              :title="stateTitles[cell.state]"
              :aria-label="stateTitles[cell.state]"
            >{{ stateLabels[cell.state] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.board-scroll {
  min-width: 0;
  overflow-x: auto;
}

.board-grid {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--fai-font-sans);
  font-size: var(--fai-type-board-td);
}

.board-grid th,
.board-grid td {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  text-align: right;
}

.board-grid thead th {
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-board-colh-cn);
  font-weight: var(--fai-weight-regular);
}

.board-grid .stub {
  text-align: left;
  font-size: var(--fai-type-board-stub);
  font-weight: var(--fai-weight-regular);
}

.unit,
.board-status {
  color: var(--fai-text-muted);
}

.board-status.pending {
  color: var(--fai-accent-amber);
}
</style>
