<script setup lang="ts">
import { computed } from 'vue'
import type { NewsItem, SourceStatus } from '../contracts/types.ts'

const props = defineProps<{ news: NewsItem[]; sources: SourceStatus[] }>()
// 时长随资讯字数增长，避免长列表被迫加速。
const tickerDuration = computed(() => `${props.news.reduce((length, item) => length + item.title.length, 0)}s`)
</script>

<template>
  <header class="topbar glass-focus">
    <div
      class="ticker-viewport ticker"
      role="region"
      aria-label="资讯 ticker"
      tabindex="0"
    >
      <div
        v-if="news.length"
        class="ticker-track"
      >
        <ul
          v-for="copy in 2"
          :key="copy"
          class="ticker-items"
          :class="{ 'ticker-copy': copy === 2 }"
          :aria-hidden="copy === 2 ? true : undefined"
        >
          <li
            v-for="item in news"
            :key="item.id"
            :data-news-id="item.id"
          >
            <time :datetime="item.ts">{{ item.ts.slice(11, 16) }}</time>
            <span>{{ item.title }}</span>
            <span class="news-source">{{ item.source }}</span>
          </li>
        </ul>
      </div>
      <p v-else>
        暂无资讯
      </p>
    </div>
    <ul
      v-if="sources.length"
      class="source-list"
      aria-label="数据源状态"
    >
      <li
        v-for="source in sources"
        :key="source.id"
        :data-source-id="source.id"
        :title="source.asOf ? `截至 ${source.asOf}` : '尚未更新'"
      >
        <span
          class="status-dot"
          :class="source.status"
          aria-hidden="true"
        />
        <span>{{ source.name }}</span>
        <span class="source-state">{{ source.status === 'fresh' ? '新鲜' : '待更新' }}</span>
      </li>
    </ul>
    <p
      v-else
      class="source-empty"
    >
      暂无数据源状态
    </p>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: var(--fai-space-section-gap);
  min-width: 0;
  padding: var(--fai-space-grid-gap) var(--fai-space-content-pad-x);
  z-index: var(--fai-z-chrome);
}

.ticker-viewport {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.ticker-track {
  display: flex;
  width: max-content;
  animation-name: ticker-scroll;
  animation-duration: v-bind(tickerDuration);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.ticker-items {
  display: flex;
  flex: none;
  gap: var(--fai-space-section-gap);
  list-style: none;
  margin: 0;
  padding: 0 var(--fai-space-section-gap) 0 0;
}

.ticker-items li {
  display: flex;
  align-items: center;
  gap: var(--fai-space-grid-gap);
  white-space: nowrap;
}

.news-source,
.ticker-items time,
.source-state,
.source-empty {
  color: var(--fai-text-secondary);
}

.source-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--fai-space-grid-gap);
  max-width: 50%;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--fai-type-footnote);
}

.source-list li {
  display: flex;
  align-items: center;
  gap: calc(var(--fai-space-grid-gap) / 2);
  min-width: 0;
  overflow-wrap: anywhere;
}

.status-dot {
  flex: none;
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

.ticker-viewport:hover .ticker-track,
.ticker-viewport:focus-within .ticker-track {
  animation-play-state: paused;
}

@keyframes ticker-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-viewport {
    overflow-x: auto;
  }

  .ticker-track {
    animation: none;
  }

  .ticker-copy {
    display: none;
  }
}
</style>
