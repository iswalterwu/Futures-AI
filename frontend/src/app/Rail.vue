<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useUiStore } from '../stores/ui.ts'
import { navItems } from './nav.ts'

defineOptions({ name: 'AppRail' })

const ui = useUiStore()
const route = useRoute()
</script>

<template>
  <aside
    class="rail glass-focus"
    :data-collapsed="ui.railCollapsed"
    :data-viewport-collapsed="ui.viewport.collapsed"
    aria-label="应用导航"
  >
    <header class="rail-header">
      <p
        class="wordmark"
        aria-label="Futures-AI"
      >
        <span class="full-label">Futures-AI</span>
        <span
          class="compact-label"
          aria-hidden="true"
        >F</span>
      </p>
      <button
        type="button"
        class="rail-toggle"
        :aria-label="ui.railCollapsed ? '展开侧栏' : '收起侧栏'"
        :title="ui.railCollapsed ? '展开侧栏' : '收起侧栏'"
        :aria-expanded="!ui.railCollapsed"
        aria-controls="rail-navigation"
        @click="ui.toggleRail"
      >
        {{ ui.railCollapsed ? '›' : '‹' }}
      </button>
    </header>
    <nav
      id="rail-navigation"
      class="rail-navigation"
      aria-label="主菜单"
    >
      <ul class="nav-list">
        <li
          v-for="item in navItems"
          :key="item.id"
        >
          <RouterLink
            :to="item.path"
            class="nav-link fixed-link"
            :class="{ active: route.meta.navId === item.id }"
            :data-nav-id="item.id"
            :aria-current="route.meta.navId === item.id ? (route.name === item.id ? 'page' : 'location') : undefined"
            :aria-label="item.title"
            :title="item.title"
          >
            <span class="full-label">{{ item.title }}</span>
            <span
              class="compact-label"
              aria-hidden="true"
            >{{ item.title[0] }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <p class="rail-foot full-label en">
      Local workspace
    </p>
  </aside>
</template>

<style scoped>
.rail {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: var(--fai-space-grid-gap);
  gap: var(--fai-space-section-gap);
  z-index: var(--fai-z-chrome);
}

.rail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--fai-space-grid-gap);
}

.rail-toggle {
  flex: none;
  cursor: pointer;
  padding: 0 calc(var(--fai-space-grid-gap) / 2);
  border: thin solid var(--fai-glass-focus-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
}

.rail-navigation {
  min-height: 0;
  overflow: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  padding: var(--fai-space-grid-gap);
  border-inline-start: var(--fai-radius-base) solid transparent;
  color: var(--fai-text-secondary);
  text-decoration: none;
  font-size: var(--fai-type-nav);
  overflow-wrap: anywhere;
}

.nav-link.active,
.nav-link[aria-current='page'] {
  border-inline-start-color: var(--fai-accent-red);
  color: var(--fai-text-primary);
  font-weight: var(--fai-weight-strong);
}

.nav-link:hover,
.nav-link:focus-visible,
.rail-toggle:hover {
  color: var(--fai-text-primary);
}

.rail-foot {
  margin-top: auto;
  font-size: var(--fai-type-rfoot);
}

.compact-label {
  display: none;
}

.rail[data-viewport-collapsed='false'][data-collapsed='true'] {
  padding-inline: calc(var(--fai-space-grid-gap) / 2);
}

.rail[data-viewport-collapsed='false'][data-collapsed='true'] .rail-header {
  flex-direction: column;
}

.rail[data-viewport-collapsed='false'][data-collapsed='true'] .full-label {
  display: none;
}

.rail[data-viewport-collapsed='false'][data-collapsed='true'] .compact-label {
  display: inline;
}

.rail[data-viewport-collapsed='false'][data-collapsed='true'] .nav-link {
  padding-inline: 0;
  text-align: center;
}

.rail[data-viewport-collapsed='true'] {
  gap: var(--fai-space-grid-gap);
  padding-inline: var(--fai-space-content-pad-x);
}

.rail[data-viewport-collapsed='true'] .rail-toggle,
.rail[data-viewport-collapsed='true'] .rail-foot {
  display: none;
}

.rail[data-viewport-collapsed='true'] .rail-navigation {
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.rail[data-viewport-collapsed='true'] .nav-list {
  display: flex;
  flex-wrap: nowrap;
}

.rail[data-viewport-collapsed='true'] .nav-list > li {
  flex: none;
}

.rail[data-viewport-collapsed='true'] .nav-link {
  white-space: nowrap;
  border-inline-start: 0;
  border-bottom: var(--fai-radius-base) solid transparent;
}

.rail[data-viewport-collapsed='true'] .nav-link.active,
.rail[data-viewport-collapsed='true'] .nav-link[aria-current='page'] {
  border-bottom-color: var(--fai-accent-red);
}
</style>
