<script setup lang="ts">
</script>

<template>
  <div
    class="workbench"
    data-page="workbench"
  >
    <header>
      <h1>工作台</h1>
      <p class="en">
        Workbench
      </p>
    </header>
    <section
      class="focus-placeholder glass-focus"
      aria-labelledby="focus-placeholder-title"
    >
      <h2 id="focus-placeholder-title">
        今日焦点 <span class="en">Daily focus</span>
      </h2>
      <p>日报摘要与关键数字将在此呈现。</p>
    </section>
    <section
      class="modules-container"
      aria-label="工作台模块区"
    >
      <p>工作台模块区待接入。</p>
    </section>
  </div>
</template>

<style scoped>
.workbench {
  display: flex;
  flex-direction: column;
  gap: var(--fai-space-grid-gap);
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.focus-placeholder {
  flex: none;
  padding: var(--fai-space-section-gap);
}

.focus-placeholder h2 {
  margin-bottom: var(--fai-space-grid-gap);
  font-size: var(--fai-type-sec-title);
  font-weight: var(--fai-weight-emphasis);
}

.focus-placeholder p,
.modules-container {
  color: var(--fai-text-secondary);
}

.modules-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>
