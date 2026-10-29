<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ACTIVE_JOB_STATUSES, type ContractError, type ErrorResponse } from '../../contracts/types.ts'
import ErrorState from '../../shared/components/ErrorState.vue'
import Loading from '../../shared/components/Loading.vue'
import ArtifactStatusBadge from '../components/ArtifactStatusBadge.vue'
import { useIntakeStore } from '../stores/intake.ts'
import { useJobsStore } from '../stores/jobs.ts'

const intake = useIntakeStore()
const jobs = useJobsStore()
const availableJobs = computed(() => jobs.jobs.filter(job => ACTIVE_JOB_STATUSES.some(status => status === job.status)))
const targets = ref<Record<string, string>>({})
const errors = ref<Record<string, ContractError | null>>({})

onMounted(() => {
  void jobs.ensureJobs()
  void intake.loadPool()
})

async function assign(uploadId: string) {
  errors.value[uploadId] = null
  try {
    await intake.assign(uploadId, targets.value[uploadId]!)
  } catch (cause) {
    errors.value[uploadId] = (cause as ErrorResponse).error
  }
}
</script>

<template>
  <section
    class="unassigned-pool"
    aria-label="待归属池"
  >
    <h2>待归属池</h2>
    <Loading v-if="intake.poolStatus === 'loading'" />
    <ErrorState
      v-else-if="intake.poolStatus === 'error' && intake.poolError"
      module-id="intake-pool"
      :error="intake.poolError"
      @retry="intake.loadPool()"
    />
    <ErrorState
      v-if="jobs.listStatus === 'error' && jobs.listError"
      module-id="intake-pool"
      :error="jobs.listError"
      @retry="jobs.refresh()"
    />
    <p v-if="intake.poolStatus === 'ready' && intake.pool.length === 0">
      待归属池为空。
    </p>
    <ul>
      <li
        v-for="upload in intake.pool"
        :key="upload.id"
      >
        <p v-if="upload.inputKind === 'file'">
          文件 · {{ upload.fileMeta.name }}
        </p>
        <p v-else-if="upload.inputKind === 'url'">
          链接 · {{ upload.url }}
        </p>
        <p v-else>
          文本 · 文本投放（正文未保存）
        </p>
        <p>用途：{{ upload.sourceNote.purpose }}</p>
        <ArtifactStatusBadge :status="upload.status" />
        <p v-if="upload.quarantineReason">
          隔离原因：{{ upload.quarantineReason }}
        </p>
        <select
          v-model="targets[upload.id]"
          aria-label="归入作业"
        >
          <option
            :value="undefined"
            disabled
          >
            请选择作业
          </option>
          <option
            v-for="job in availableJobs"
            :key="job.id"
            :value="job.id"
          >
            {{ job.title }}
          </option>
        </select>
        <button
          type="button"
          :disabled="!targets[upload.id]"
          @click="assign(upload.id)"
        >
          归入
        </button>
        <ErrorState
          v-if="errors[upload.id]"
          module-id="intake-pool"
          :error="errors[upload.id]!"
          @retry="assign(upload.id)"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.unassigned-pool {
  min-width: 0;
  overflow-wrap: anywhere;
}

.unassigned-pool ul {
  display: grid;
  gap: var(--fai-space-grid-gap);
  padding: 0;
  list-style: none;
}

.unassigned-pool li {
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
}

.unassigned-pool select, .unassigned-pool button {
  max-width: 100%;
  padding: calc(var(--fai-space-grid-gap) / 2);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
}

.unassigned-pool :focus-visible {
  outline-color: var(--fai-accent-link);
}
</style>
