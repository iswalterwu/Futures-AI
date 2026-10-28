<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { dataClient } from '../contracts/index.ts'
import type { ContractError, DailyBrief, ErrorResponse } from '../contracts/types.ts'
import '../design/updown.css'
import EmptyState from '../shared/components/EmptyState.vue'
import ErrorState from '../shared/components/ErrorState.vue'
import Kpi from '../shared/components/Kpi.vue'
import Loading from '../shared/components/Loading.vue'
import { useUiStore } from '../stores/ui.ts'

const ui = useUiStore()
const brief = ref<DailyBrief | null>(null)
const reason = ref<string>()
const error = ref<ContractError | null>(null)
const status = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const segments = computed(() => {
  const figures = brief.value?.figures.slice(0, ui.viewport.focusCards) ?? []
  return [
    { semantic: 'market', zh: '行情', en: 'Market', figures: figures.filter(figure => figure.semantic === 'market') },
    { semantic: 'analysis', zh: '指标', en: 'Indicators', figures: figures.filter(figure => figure.semantic === 'analysis') },
  ]
})

onMounted(loadBrief)

async function loadBrief() {
  status.value = 'loading'
  error.value = null
  try {
    const result = await dataClient.getDailyBrief()
    brief.value = result.brief
    reason.value = result.reason
    status.value = result.brief ? 'ready' : 'empty'
  } catch (cause) {
    error.value = (cause as ErrorResponse).error
    status.value = 'error'
  }
}
</script>

<template>
  <component
    :is="status === 'ready' ? RouterLink : 'section'"
    class="focus-band glass-focus"
    :to="brief ? `/daily/${brief.date}` : undefined"
    :data-state="status"
    :aria-busy="status === 'loading'"
    aria-labelledby="focus-title"
  >
    <header class="focus-header">
      <h2 id="focus-title">
        今日焦点 <span class="en">Daily focus</span>
      </h2>
      <div
        v-if="status === 'ready' && brief"
        class="focus-report"
      >
        <time
          class="num"
          :datetime="brief.date"
        >{{ brief.date }}</time>
        <span class="focus-open">查看完整日报 →</span>
      </div>
    </header>
    <Loading
      v-if="status === 'loading'"
      message="正在加载今日日报…"
    />
    <ErrorState
      v-else-if="error"
      module-id="daily-brief"
      :error="error"
      @retry="loadBrief"
    />
    <template v-else-if="brief">
      <ul class="focus-conclusions">
        <li
          v-for="(conclusion, index) in brief.conclusions.slice(0, 3)"
          :key="index"
        >
          {{ conclusion }}
        </li>
      </ul>
      <div class="focus-figures">
        <section
          v-for="segment in segments"
          :key="segment.semantic"
          class="focus-segment"
          :data-semantic="segment.semantic"
          :aria-labelledby="`focus-${segment.semantic}-title`"
          :style="{ '--fai-focus-columns': Math.max(1, segment.figures.length) }"
        >
          <h3 :id="`focus-${segment.semantic}-title`">
            {{ segment.zh }} <span class="en">{{ segment.en }}</span>
          </h3>
          <div class="focus-cards">
            <Kpi
              v-for="(figure, index) in segment.figures"
              :key="index"
              class="focus-card"
              :figure="figure"
            />
          </div>
        </section>
      </div>
    </template>
    <EmptyState
      v-else
      :message="reason ?? '今日日报尚未生成。'"
    />
  </component>
</template>

<style scoped>
.focus-band {
  display: grid;
  flex: none;
  gap: var(--fai-space-grid-gap);
  min-width: 0;
  padding: var(--fai-space-section-gap);
  color: var(--fai-text-primary);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.focus-band[href]:hover,
.focus-band[href]:focus-visible {
  border-color: var(--fai-accent-link);
}

.focus-header,
.focus-report {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--fai-space-grid-gap);
}

.focus-header {
  justify-content: space-between;
}

.focus-header h2 {
  font-size: var(--fai-type-sec-title);
  font-weight: var(--fai-weight-emphasis);
}

.focus-report {
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-meta);
}

.focus-open {
  color: var(--fai-accent-link);
}

.focus-conclusions {
  margin: 0;
  padding-inline-start: var(--fai-space-section-gap);
}

.focus-figures {
  display: flex;
  gap: var(--fai-space-section-gap);
  min-width: 0;
}

.focus-segment {
  flex: var(--fai-focus-columns) 1 0;
  min-width: 0;
}

.focus-segment + .focus-segment {
  padding-inline-start: var(--fai-space-section-gap);
  border-inline-start: thin solid var(--fai-glass-focus-border);
}

.focus-segment h3 {
  margin-bottom: var(--fai-space-grid-gap);
  font-size: var(--fai-type-meta);
  font-weight: var(--fai-weight-emphasis);
}

.focus-cards {
  display: grid;
  grid-template-columns: repeat(var(--fai-focus-columns), minmax(0, 1fr));
  gap: var(--fai-space-grid-gap);
  min-width: 0;
}
</style>
