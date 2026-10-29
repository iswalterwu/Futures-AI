<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { JobStatusLabel, JobStatusSchema, JobTypeLabel, JobTypeSchema, type JobStatus, type JobType } from '../../contracts/types.ts'
import JobCard from '../components/JobCard.vue'
import JobCreatePanel from './JobCreatePanel.vue'
import IntakeDrawer from '../stages/IntakeDrawer.vue'
import { useIntakeStore } from '../stores/intake.ts'
import { useJobsStore, type ListJobsFilter } from '../stores/jobs.ts'
import EmptyState from '../../shared/components/EmptyState.vue'
import ErrorState from '../../shared/components/ErrorState.vue'
import Loading from '../../shared/components/Loading.vue'

const jobsStore = useJobsStore()
const intake = useIntakeStore()
const createExpanded = ref(false)
const status = ref<JobStatus | ''>(jobsStore.filter?.status ?? '')
const type = ref<JobType | ''>(jobsStore.filter?.type ?? '')
const title = ref(jobsStore.filter?.title ?? '')
const displayedJobs = computed(() => jobsStore.filteredJobs ?? jobsStore.jobs)
onMounted(() => jobsStore.ensureJobs())

function applyFilter() {
  const filter: ListJobsFilter = {}
  if (status.value !== '') filter.status = status.value
  if (type.value !== '') filter.type = type.value
  if (title.value !== '') filter.title = title.value
  void jobsStore.applyFilter(Object.keys(filter).length === 0 ? null : filter)
}

function clearFilter() {
  status.value = ''
  type.value = ''
  title.value = ''
  void jobsStore.applyFilter(null)
}
</script>

<template>
  <section
    class="jobs-page"
    aria-label="作业列表"
  >
    <h1>作业</h1>
    <div class="intake-actions">
      <button
        class="job-create-toggle"
        type="button"
        :aria-expanded="createExpanded"
        @click="createExpanded = !createExpanded"
      >
        新建作业
      </button>
      <button
        class="intake-toggle"
        type="button"
        @click="intake.open()"
      >
        投放
      </button>
    </div>
    <JobCreatePanel v-if="createExpanded" />
    <div
      v-if="intake.isOpen"
      class="intake-slot"
    >
      <IntakeDrawer />
    </div>
    <div class="job-filters">
      <label>
        状态
        <select
          v-model="status"
          aria-label="状态"
          @change="applyFilter"
        >
          <option value="">全部</option>
          <option
            v-for="value in JobStatusSchema.options"
            :key="value"
            :value="value"
          >{{ JobStatusLabel[value].text }}</option>
        </select>
      </label>
      <label>
        类型
        <select
          v-model="type"
          aria-label="类型"
          @change="applyFilter"
        >
          <option value="">全部</option>
          <option
            v-for="value in JobTypeSchema.options"
            :key="value"
            :value="value"
          >{{ JobTypeLabel[value].text }}</option>
        </select>
      </label>
      <label>
        标题
        <input
          v-model="title"
          type="search"
          aria-label="标题"
          @input="applyFilter"
        >
      </label>
      <button
        type="button"
        @click="clearFilter"
      >
        清空
      </button>
    </div>
    <Loading v-if="jobsStore.listStatus === 'idle' || jobsStore.listStatus === 'loading'" />
    <ErrorState
      v-else-if="jobsStore.listStatus === 'error' && jobsStore.listError"
      module-id="jobs-list"
      :error="jobsStore.listError"
      @retry="jobsStore.refresh()"
    />
    <EmptyState
      v-else-if="displayedJobs.length === 0"
      :message="jobsStore.filter === null ? '暂无作业。' : '暂无符合筛选的作业。'"
    />
    <div
      v-else
      class="job-list"
    >
      <JobCard
        v-for="job in displayedJobs"
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

.intake-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fai-space-grid-gap);
}

.job-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: var(--fai-space-grid-gap);
}

.job-filters label {
  display: grid;
  gap: calc(var(--fai-space-grid-gap) / 2);
  color: var(--fai-text-secondary);
}

.intake-toggle,
.job-create-toggle,
.job-filters select,
.job-filters input,
.job-filters button {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
}

.intake-toggle,
.job-create-toggle,
.job-filters button {
  cursor: pointer;
}

.intake-toggle,
.job-create-toggle {
  justify-self: start;
}

.intake-toggle:focus-visible,
.job-create-toggle:focus-visible,
.job-filters select:focus-visible,
.job-filters input:focus-visible,
.job-filters button:focus-visible {
  outline-color: var(--fai-accent-link);
}
</style>
