<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import { RouterLink } from 'vue-router'
import { JobTypeLabel, StageLabel, type JobListItem } from '../../contracts/types.ts'
import JobStatusBadge from './JobStatusBadge.vue'

defineProps<{ job: DeepReadonly<JobListItem> }>()
</script>

<template>
  <article class="job-card glass-module">
    <h2>
      <RouterLink :to="{ name: 'job-detail', params: { id: job.id } }">
        {{ job.title }}
      </RouterLink>
    </h2>
    <div class="job-meta">
      <span class="job-type">
        <span aria-hidden="true">{{ JobTypeLabel[job.type].icon }}</span>
        {{ JobTypeLabel[job.type].text }}
      </span>
      <JobStatusBadge :status="job.status" />
      <span class="job-stage">
        <span aria-hidden="true">{{ StageLabel[job.currentStage].icon }}</span>
        {{ StageLabel[job.currentStage].text }}
      </span>
      <time :datetime="job.updatedAt">{{ job.updatedAt }}</time>
    </div>
  </article>
</template>

<style scoped>
.job-card {
  min-width: 0;
  padding: var(--fai-space-grid-gap);
  border-radius: var(--fai-radius-base);
  overflow-wrap: anywhere;
}

.job-card h2 {
  margin: 0 0 var(--fai-space-grid-gap);
  font-family: var(--fai-font-sans);
  font-size: var(--fai-type-card-t);
}

.job-card a {
  color: var(--fai-accent-link);
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--fai-space-grid-gap);
  color: var(--fai-text-secondary);
  font-size: var(--fai-type-meta);
}
</style>
