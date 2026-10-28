<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section
    class="placeholder-page"
    :data-placeholder-owner="route.meta.placeholderOwner"
  >
    <header>
      <h1>{{ route.meta.title }}</h1>
      <p class="en">
        {{ route.meta.en }}
      </p>
    </header>
    <p class="placeholder-note">
      此页为占位页，内容随 <code>{{ route.meta.placeholderOwner }}</code> feature 交付。
    </p>
    <p v-if="route.params.date">
      日报日期：<time
        class="num"
        :datetime="String(route.params.date)"
      >{{ route.params.date }}</time>
    </p>
  </section>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  gap: var(--fai-space-section-gap);
  height: 100%;
  min-width: 0;
  overflow: auto;
  overflow-wrap: anywhere;
}

.placeholder-note {
  color: var(--fai-text-secondary);
}

.placeholder-page .num {
  display: inline-block;
}
</style>
