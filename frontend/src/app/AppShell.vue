<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAppStore } from '../stores/app.ts'
import { useUiStore } from '../stores/ui.ts'
import LoadingScreen from './LoadingScreen.vue'
import Rail from './Rail.vue'
import TopBar from './TopBar.vue'

const app = useAppStore()
const ui = useUiStore()
const router = useRouter()

onMounted(start)

async function start() {
  await router.isReady()
  if (!await app.bootstrap()) return
  const route = router.currentRoute.value
  if (route.path === '/') {
    await router.replace({ path: '/workbench', query: route.query, hash: route.hash })
  }
  // 快速启动也要绘制通知和完成进度，再以外壳一次性替换骨架。
  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  app.phase = 'ready'
}
</script>

<template>
  <LoadingScreen
    v-if="app.phase !== 'ready'"
    :progress="app.progress"
    :status-text="app.statusText"
    :notice="app.boot?.notice"
    :error="app.error"
    @retry="start"
  />
  <div
    v-else
    class="shell"
    :data-rail-collapsed="ui.railCollapsed"
  >
    <Rail />
    <div class="content">
      <TopBar
        :news="app.news"
        :sources="app.sources"
      />
      <main class="route-view">
        <RouterView />
      </main>
      <footer class="dock-slot">
        <slot name="dock" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: var(--fai-layout-rail-width) minmax(0, 1fr);
  height: var(--fai-layout-viewport-height);
}

.shell[data-rail-collapsed='true'] {
  grid-template-columns: calc(var(--fai-space-section-gap) * 2) minmax(0, 1fr);
}

.content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-width: 0;
  min-height: 0;
}

.route-view {
  min-width: 0;
  min-height: 0;
  padding: var(--fai-space-grid-gap) var(--fai-space-content-pad-x);
  overflow: hidden;
  z-index: var(--fai-z-content);
}

.dock-slot {
  min-width: 0;
  z-index: var(--fai-z-dock);
}

@media (max-width: 979px) {
  .shell,
  .shell[data-rail-collapsed='true'] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }
}
</style>
