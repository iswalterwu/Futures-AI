<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useLayoutStore } from '../stores/layout.ts'

const layout = useLayoutStore()
const panel = useTemplateRef<HTMLDialogElement>('panel')
defineEmits<{ close: [] }>()
onMounted(() => panel.value!.showModal())
</script>

<template>
  <dialog
    ref="panel"
    class="module-library glass-drawer"
    aria-labelledby="module-library-title"
    @close="$emit('close')"
  >
    <header>
      <h2 id="module-library-title">
        模块库 <span class="en">Module library</span>
      </h2>
      <button
        type="button"
        aria-label="关闭模块库"
        @click="panel!.close()"
      >
        关闭
      </button>
    </header>
    <ul class="library-list">
      <li
        v-for="module in layout.catalog"
        :key="module.id"
        class="library-entry"
        :data-module-id="module.id"
        :data-added="layout.order.includes(module.id)"
      >
        <h3>{{ module.zh }}</h3>
        <span class="en">{{ module.en }}</span>
        <p class="description">
          {{ module.description }}
        </p>
        <div class="library-actions">
          <span class="membership">{{ layout.order.includes(module.id) ? '已在工作台' : '未添加' }}</span>
          <button
            type="button"
            :aria-label="`添加${module.zh}`"
            :disabled="layout.order.includes(module.id)"
            @click="layout.add(module.id)"
          >
            {{ layout.order.includes(module.id) ? '已添加' : '添加到工作台' }}
          </button>
        </div>
      </li>
    </ul>
  </dialog>
</template>

<style scoped>
.module-library {
  position: fixed;
  inset-block: var(--fai-space-grid-gap);
  inset-inline-start: auto;
  inset-inline-end: var(--fai-space-grid-gap);
  width: min(calc(var(--fai-layout-rail-width) * 2), calc(100% - var(--fai-space-grid-gap) * 2));
  max-width: none;
  max-height: calc(100% - var(--fai-space-grid-gap) * 2);
  margin: 0;
  padding: var(--fai-space-section-gap);
  overflow-y: auto;
  color: var(--fai-text-primary);
  z-index: var(--fai-z-library);
}

.module-library::backdrop {
  background: transparent;
}

.module-library > header,
.library-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--fai-space-grid-gap);
}

.module-library h2 {
  font-size: var(--fai-type-modal-title);
}

.library-list {
  display: grid;
  gap: var(--fai-space-section-gap);
  list-style: none;
  margin: var(--fai-space-section-gap) 0 0;
  padding: 0;
}

.library-entry {
  display: grid;
  gap: calc(var(--fai-space-grid-gap) / 2);
  min-width: 0;
  padding-block-end: var(--fai-space-grid-gap);
  border-bottom: thin solid var(--fai-glass-drawer-border);
  overflow-wrap: anywhere;
}

.library-entry h3 {
  font-size: var(--fai-type-card-t);
  font-weight: var(--fai-weight-emphasis);
}

.description,
.membership {
  color: var(--fai-text-secondary);
}

.membership {
  font-size: var(--fai-type-footnote);
}

.module-library button {
  flex: none;
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-drawer-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
  cursor: pointer;
}

.module-library button:disabled {
  color: var(--fai-text-muted);
  border-color: transparent;
  cursor: default;
}

.module-library button:hover:not(:disabled),
.module-library button:focus-visible {
  border-color: var(--fai-accent-link);
}
</style>
