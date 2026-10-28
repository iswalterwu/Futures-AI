<script setup lang="ts">
defineOptions({ name: 'FaiLoading' })
withDefaults(defineProps<{ message?: string }>(), { message: '正在加载…' })
</script>

<template>
  <p
    class="loading-state"
    role="status"
    aria-busy="true"
  >
    {{ message }}
  </p>
</template>

<style scoped>
.loading-state {
  padding: var(--fai-space-section-gap);
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-loading);
  text-align: center;
}
</style>
