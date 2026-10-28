<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), { message: '暂无数据。' })
</script>

<template>
  <p
    class="empty-state"
    role="status"
  >
    {{ message }}
  </p>
</template>

<style scoped>
.empty-state {
  padding: var(--fai-space-section-gap);
  color: var(--fai-text-secondary);
  text-align: center;
  overflow-wrap: anywhere;
}
</style>
