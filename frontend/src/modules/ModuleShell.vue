<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { ContractError, ModuleDef } from '../contracts/types.ts'
import Badge from '../shared/components/Badge.vue'
import EmptyState from '../shared/components/EmptyState.vue'
import ErrorState from '../shared/components/ErrorState.vue'
import Loading from '../shared/components/Loading.vue'

withDefaults(defineProps<{
  module: ModuleDef
  state?: 'ready' | 'loading' | 'empty' | 'error'
  right?: string
  badge?: 'ok' | 'warn' | 'bad' | 'sample'
  ai?: 'none' | 'running' | 'done'
  emptyMessage?: string
  error?: ContractError
  canMoveUp?: boolean
  canMoveDown?: boolean
}>(), {
  state: 'ready',
  right: '–',
  badge: 'sample',
  ai: 'none',
  emptyMessage: '暂无数据。',
  error: undefined,
  canMoveUp: true,
  canMoveDown: true,
})
defineEmits<{ moveUp: []; moveDown: []; remove: []; retry: []; viewed: [] }>()
const highlighted = ref(false)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

function highlight() {
  clearTimeout(highlightTimer)
  highlighted.value = true
  highlightTimer = setTimeout(() => { highlighted.value = false }, 1500)
}

onBeforeUnmount(() => clearTimeout(highlightTimer))
defineExpose({ highlight })
</script>

<template>
  <section
    class="fai-module glass-module"
    :data-module-id="module.id"
    :data-state="state"
    :data-highlight="highlighted"
    :aria-labelledby="`module-title-${module.id}`"
    :aria-busy="state === 'loading'"
    tabindex="-1"
    @click="$emit('viewed')"
  >
    <header>
      <h3
        :id="`module-title-${module.id}`"
        class="title"
      >
        {{ module.zh }}
      </h3>
      <span class="en">{{ module.en }}</span>
      <span class="right">{{ right }}</span>
      <Badge :state="badge" />
      <span
        class="ai"
        :data-ai="ai"
        aria-live="polite"
      >{{ ai === 'running' ? 'AI 运行中' : ai === 'done' ? 'AI 已完成' : '' }}</span>
      <nav
        class="actions"
        :aria-label="`${module.zh}布局操作`"
        @click.stop
      >
        <button
          type="button"
          :aria-label="`上移${module.zh}`"
          :disabled="!canMoveUp"
          @click="$emit('moveUp')"
        >
          上移
        </button>
        <button
          type="button"
          :aria-label="`下移${module.zh}`"
          :disabled="!canMoveDown"
          @click="$emit('moveDown')"
        >
          下移
        </button>
        <button
          type="button"
          :aria-label="`移除${module.zh}`"
          @click="$emit('remove')"
        >
          移除
        </button>
      </nav>
    </header>
    <div class="body">
      <Loading v-if="state === 'loading'" />
      <EmptyState
        v-else-if="state === 'empty'"
        :message="emptyMessage"
      />
      <ErrorState
        v-else-if="state === 'error' && error"
        :module-id="module.id"
        :error="error"
        @retry="$emit('retry')"
      />
      <slot v-else />
    </div>
  </section>
</template>

<style scoped>
.fai-module {
  min-width: 0;
  overflow-wrap: anywhere;
}

.fai-module[data-highlight='true'] {
  outline: var(--fai-radius-base) solid var(--fai-accent-link);
  outline-offset: calc(-1 * var(--fai-radius-base));
}

.fai-module > header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  padding: var(--fai-space-grid-gap);
  border-bottom: thin solid var(--fai-glass-module-border);
}

.title,
.en,
.right {
  min-width: 0;
}

.right {
  margin-inline-start: auto;
  color: var(--fai-text-secondary);
  font-family: var(--fai-font-mono);
  font-size: var(--fai-type-card-r);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.ai {
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-tag);
}

.ai[data-ai='running'] {
  color: var(--fai-status-warn);
}

.ai[data-ai='done'] {
  color: var(--fai-status-ok);
}

.actions {
  display: flex;
  flex-basis: 100%;
  justify-content: flex-end;
  gap: calc(var(--fai-space-grid-gap) / 2);
}

.actions button {
  padding: 0 calc(var(--fai-space-grid-gap) / 2);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: transparent;
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-secbtn);
  cursor: pointer;
}

.actions button:disabled {
  color: var(--fai-text-muted);
  border-color: transparent;
  cursor: default;
}

.actions button:hover:not(:disabled),
.actions button:focus-visible {
  border-color: var(--fai-accent-link);
  color: var(--fai-text-primary);
}

.body {
  min-width: 0;
  padding: var(--fai-space-grid-gap);
}
</style>
