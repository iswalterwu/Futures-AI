<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLayoutStore } from '../stores/layout.ts'
import FocusBand from './FocusBand.vue'
import ModuleGrid from './ModuleGrid.vue'
import ModuleLibrary from './ModuleLibrary.vue'

const layout = useLayoutStore()
const libraryOpen = ref(false)
onMounted(() => layout.loadCatalog())
</script>

<template>
  <div
    class="workbench"
    data-page="workbench"
  >
    <header class="workbench-header">
      <div>
        <h1>工作台</h1>
        <p class="en">
          Workbench
        </p>
      </div>
      <button
        type="button"
        class="library-toggle"
        aria-haspopup="dialog"
        :aria-expanded="libraryOpen"
        :disabled="layout.status !== 'ready'"
        @click="libraryOpen = true"
      >
        模块库
      </button>
    </header>
    <FocusBand />
    <ModuleGrid />
    <ModuleLibrary
      v-if="libraryOpen"
      @close="libraryOpen = false"
    />
  </div>
</template>

<style scoped>
.workbench {
  display: flex;
  flex-direction: column;
  gap: var(--fai-space-grid-gap);
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.workbench-header {
  display: flex;
  flex: none;
  justify-content: space-between;
  align-items: center;
  gap: var(--fai-space-grid-gap);
}

.library-toggle {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
  cursor: pointer;
}

.library-toggle:disabled {
  color: var(--fai-text-muted);
  cursor: default;
}

.library-toggle:hover:not(:disabled),
.library-toggle:focus-visible {
  border-color: var(--fai-accent-link);
}
</style>
