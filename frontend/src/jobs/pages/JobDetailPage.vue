<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { JobTypeLabel, StageSchema, type Stage } from '../../contracts/types.ts'
import EmptyState from '../../shared/components/EmptyState.vue'
import ErrorState from '../../shared/components/ErrorState.vue'
import Loading from '../../shared/components/Loading.vue'
import JobStatusBadge from '../components/JobStatusBadge.vue'
import StageRail from '../components/StageRail.vue'
import StageWorkspace from '../components/StageWorkspace.vue'
import { useJobsStore } from '../stores/jobs.ts'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const viewedStage = computed(() => {
  const result = StageSchema.safeParse(route.params.stage)
  return result.success ? result.data : null
})

watch([() => route.params.id, () => route.params.stage], async ([id], _old, onCleanup) => {
  let stale = false
  onCleanup(() => { stale = true })
  const stage = viewedStage.value
  const openedStage = await jobsStore.openJob(id as string, stage)
  if (!stale && stage === null && openedStage !== null) {
    await router.replace({ name: 'job-detail', params: { id, stage: openedStage } })
  }
}, { immediate: true })

function selectStage(stage: Stage) {
  void router.replace({ name: 'job-detail', params: { id: route.params.id, stage } })
}
</script>

<template>
  <section
    class="job-detail"
    aria-label="作业详情"
  >
    <Loading v-if="jobsStore.detailStatus === 'idle' || jobsStore.detailStatus === 'loading'" />
    <ErrorState
      v-else-if="jobsStore.detailStatus === 'error' && jobsStore.detailError"
      module-id="job-detail"
      :error="jobsStore.detailError"
      @retry="jobsStore.refresh()"
    />
    <EmptyState
      v-else-if="jobsStore.currentJob === null"
      message="暂无作业。"
    />
    <template v-else>
      <header class="job-detail-header">
        <h1>{{ jobsStore.currentJob.title }}</h1>
        <div class="job-detail-meta">
          <span class="job-type">
            <span aria-hidden="true">{{ JobTypeLabel[jobsStore.currentJob.type].icon }}</span>
            {{ JobTypeLabel[jobsStore.currentJob.type].text }}
          </span>
          <JobStatusBadge :status="jobsStore.currentJob.status" />
          <span
            v-if="jobsStore.currentJob.subject !== null"
            class="job-subject"
          >{{ jobsStore.currentJob.subject }}</span>
        </div>
        <p
          v-if="jobsStore.currentJob.goal !== ''"
          class="job-goal"
        >
          {{ jobsStore.currentJob.goal }}
        </p>
      </header>
      <StageRail
        :stages="jobsStore.currentJob.stages"
        :current-stage="jobsStore.currentJob.currentStage"
        :viewed-stage="viewedStage"
        @select="selectStage"
      />
      <StageWorkspace
        v-if="viewedStage !== null"
        :stage="viewedStage"
      />
    </template>
  </section>
</template>

<style scoped>
.job-detail {
  display: grid;
  gap: var(--fai-space-section-gap);
  min-width: 0;
  overflow-wrap: anywhere;
}

.job-detail-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--fai-space-grid-gap);
  color: var(--fai-text-secondary);
}

.job-goal {
  white-space: pre-wrap;
}
</style>
