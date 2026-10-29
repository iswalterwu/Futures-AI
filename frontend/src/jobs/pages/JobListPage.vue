<script setup lang="ts">
import { onMounted } from 'vue'
import JobCard from '../components/JobCard.vue'
import { useJobsStore } from '../stores/jobs.ts'
import EmptyState from '../../shared/components/EmptyState.vue'
import ErrorState from '../../shared/components/ErrorState.vue'
import Loading from '../../shared/components/Loading.vue'

const jobsStore = useJobsStore()
onMounted(() => jobsStore.ensureJobs())
</script>

<template>
  <section
    class="jobs-page"
    aria-label="作业列表"
  >
    <h1>作业</h1>
    <Loading v-if="jobsStore.listStatus === 'idle' || jobsStore.listStatus === 'loading'" />
    <ErrorState
      v-else-if="jobsStore.listStatus === 'error' && jobsStore.listError"
      module-id="jobs-list"
      :error="jobsStore.listError"
      @retry="jobsStore.refresh()"
    />
    <EmptyState
      v-else-if="jobsStore.jobs.length === 0"
      message="暂无作业。"
    />
    <div
      v-else
      class="job-list"
    >
      <JobCard
        v-for="job in jobsStore.jobs"
        :key="job.id"
        :job="job"
      />
    </div>
  </section>
</template>

<style scoped>
.jobs-page,
.job-list {
  display: grid;
  gap: var(--fai-space-grid-gap);
}
</style>
