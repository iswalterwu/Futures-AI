<script setup lang="ts">
import { useUiStore } from '../stores/ui.ts'
import CotTimeline from './CotTimeline.vue'

const ui = useUiStore()
</script>

<template>
  <section
    v-show="ui.drawer !== 'closed'"
    id="agent-drawer"
    class="agent-drawer glass-drawer"
    :data-drawer="ui.drawer"
    aria-labelledby="agent-drawer-title"
    @keydown.esc="ui.setDrawer('closed')"
  >
    <header class="drawer-header">
      <h2 id="agent-drawer-title">
        AI 对话 <span class="en">Agent timeline</span>
      </h2>
      <nav aria-label="对话抽屉高度">
        <button
          type="button"
          :aria-pressed="ui.drawer === 'half'"
          @click="ui.setDrawer('half')"
        >
          半高
        </button>
        <button
          type="button"
          :aria-pressed="ui.drawer === 'tall'"
          @click="ui.setDrawer('tall')"
        >
          加高
        </button>
        <button
          type="button"
          aria-label="收起对话抽屉"
          @click="ui.setDrawer('closed')"
        >
          收起
        </button>
      </nav>
    </header>
    <div class="drawer-content">
      <CotTimeline />
    </div>
  </section>
</template>

<style scoped>
.agent-drawer {
  position: absolute;
  inset-inline: 0;
  bottom: 100%;
  z-index: var(--fai-z-drawer);
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: var(--fai-layout-drawer-half);
}

.agent-drawer[data-drawer='tall'] {
  height: var(--fai-layout-drawer-tall);
}

.drawer-header {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: var(--fai-space-grid-gap);
  padding: var(--fai-space-grid-gap) var(--fai-space-content-pad-x);
  border-bottom: thin solid var(--fai-glass-drawer-border);
}

.drawer-header h2 {
  font-size: var(--fai-type-modal-title);
  font-weight: var(--fai-weight-emphasis);
}

.drawer-header nav {
  display: flex;
  gap: calc(var(--fai-space-grid-gap) / 2);
}

.drawer-header button {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-drawer-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
  cursor: pointer;
}

.drawer-header button[aria-pressed='true'],
.drawer-header button:hover,
.drawer-header button:focus-visible {
  border-color: var(--fai-accent-link);
}

.drawer-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--fai-space-grid-gap) var(--fai-space-content-pad-x);
}
</style>
