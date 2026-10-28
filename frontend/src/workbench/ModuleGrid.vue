<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { T } from '../design/generated/tokens.ts'
import { moduleComponents } from '../modules/registry.ts'
import EmptyState from '../shared/components/EmptyState.vue'
import ErrorState from '../shared/components/ErrorState.vue'
import Loading from '../shared/components/Loading.vue'
import { useLayoutStore } from '../stores/layout.ts'

const layout = useLayoutStore()
const columns = ref<number>(T.layout.grid_narrow)
const breakpoints = [
  { query: matchMedia(`(min-width: ${T.breakpoint.shell_collapse}px)`), columns: T.layout.grid_default },
  { query: matchMedia(`(min-width: ${T.breakpoint.grid_three}px)`), columns: T.layout.grid_three },
  { query: matchMedia(`(min-width: ${T.breakpoint.grid_four}px)`), columns: T.layout.grid_four },
]

onMounted(() => {
  updateColumns()
  for (const { query } of breakpoints) query.addEventListener('change', updateColumns)
})
onBeforeUnmount(() => {
  for (const { query } of breakpoints) query.removeEventListener('change', updateColumns)
})

function updateColumns() {
  columns.value = breakpoints.reduce<number>((count, breakpoint) =>
    breakpoint.query.matches ? breakpoint.columns : count, T.layout.grid_narrow)
}
</script>

<template>
  <section
    class="modules-container"
    aria-label="工作台模块区"
  >
    <Loading
      v-if="layout.status === 'loading'"
      message="正在加载模块目录…"
    />
    <ErrorState
      v-else-if="layout.status === 'error' && layout.error"
      module-id="module-catalog"
      :error="layout.error"
      @retry="layout.loadCatalog"
    />
    <EmptyState
      v-else-if="layout.order.length === 0"
      message="工作台暂无模块，请从模块库添加。"
    />
    <div
      v-else
      class="module-grid"
      :style="{ '--fai-grid-cols': columns }"
    >
      <component
        :is="moduleComponents[module.id]"
        v-for="(module, index) in layout.modules"
        :key="module.id"
        :module="module"
        :style="{ gridColumn: `span ${Math.min(module.defaultSpan, columns)}` }"
        :can-move-up="index > 0"
        :can-move-down="index < layout.order.length - 1"
        @move-up="layout.moveUp(module.id)"
        @move-down="layout.moveDown(module.id)"
        @remove="layout.remove(module.id)"
      />
    </div>
  </section>
</template>

<style scoped>
.modules-container {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(var(--fai-grid-cols), minmax(0, 1fr));
  align-items: start;
  gap: var(--fai-space-grid-gap);
  min-width: 0;
}
</style>
