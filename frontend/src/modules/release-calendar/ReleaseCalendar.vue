<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { DataClient } from '../../contracts/client.ts'
import { dataClient } from '../../contracts/index.ts'
import type { CalendarEntry, ContractError, ErrorResponse, ModuleDef } from '../../contracts/types.ts'
import ModuleShell from '../ModuleShell.vue'

const props = defineProps<{ module: ModuleDef; client?: DataClient }>()
const entries = ref<CalendarEntry[]>([])
const state = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const error = ref<ContractError>()

onMounted(load)

async function load() {
  state.value = 'loading'
  error.value = undefined
  try {
    // v1 展示契约提供的完整日程，避免本机日期使固定样例全部落在查询区间外。
    entries.value = await (props.client ?? dataClient).getReleaseCalendar('0001-01-01', '9999-12-31')
    state.value = entries.value.length ? 'ready' : 'empty'
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
    right="按发布时间升序"
    empty-message="暂无数据发布日程。"
    @retry="load"
  >
    <ol
      class="release-calendar"
      aria-label="数据发布日程"
    >
      <li
        v-for="entry in entries"
        :key="entry.id"
        :data-entry-id="entry.id"
      >
        <time
          class="num"
          :datetime="entry.ts"
          :title="entry.ts"
        >
          <span class="date">{{ entry.ts.slice(0, 10) }}</span>
          <span>{{ entry.ts.slice(11, 16) }}</span>
        </time>
        <div class="release-detail">
          <p class="release-name">
            {{ entry.name }}
          </p>
          <span class="source">{{ entry.source }}</span>
          <span class="freshness">
            <span
              class="status-dot"
              :class="entry.status"
              aria-hidden="true"
            />
            {{ entry.status === 'fresh' ? '已更新' : '待更新' }}
          </span>
        </div>
      </li>
    </ol>
  </ModuleShell>
</template>

<style scoped>
.release-calendar {
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--fai-font-sans);
  font-size: var(--fai-type-meta);
}

.release-calendar li {
  display: flex;
  align-items: baseline;
  gap: var(--fai-space-grid-gap);
  padding: var(--fai-space-grid-gap) 0;
  border-bottom: thin solid var(--fai-glass-module-border);
}

.release-calendar time {
  flex: none;
  color: var(--fai-text-secondary);
}

.date {
  display: block;
}

.release-detail {
  min-width: 0;
}

.source,
.freshness {
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-footnote);
}

.freshness {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--fai-space-grid-gap) / 2);
  margin-inline-start: var(--fai-space-grid-gap);
}

.status-dot {
  width: var(--fai-status-dot-size);
  height: var(--fai-status-dot-size);
  border-radius: var(--fai-radius-round);
}

.status-dot.fresh {
  background: var(--fai-status-fresh);
}

.status-dot.stale {
  background: var(--fai-status-stale);
}
</style>
