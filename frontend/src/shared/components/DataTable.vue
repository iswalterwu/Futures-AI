<script setup lang="ts" generic="Row extends { id: string }">
import '../num.css'

defineProps<{
  rows: Row[]
  columns: readonly { key: string; label: string; numeric?: boolean }[]
  label: string
}>()
</script>

<template>
  <div class="table-scroll">
    <table
      class="data-table"
      :aria-label="label"
    >
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :class="{ 'numeric-heading': column.numeric }"
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
          <td
            v-for="column in columns"
            :key="column.key"
            :data-column="column.key"
            :class="{ num: column.numeric }"
          >
            <slot
              :name="column.key"
              :row="row"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-scroll {
  min-width: 0;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--fai-font-sans);
  font-size: var(--fai-type-meta);
  text-align: left;
}

.data-table th,
.data-table td {
  padding: calc(var(--fai-space-grid-gap) / 2);
  border-bottom: thin solid var(--fai-glass-module-border);
}

.data-table th {
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-th);
  font-weight: var(--fai-weight-regular);
  text-transform: uppercase;
  white-space: nowrap;
}

.numeric-heading {
  text-align: right;
}

.data-table tbody tr:hover {
  background: var(--fai-glass-focus-surface);
}
</style>
