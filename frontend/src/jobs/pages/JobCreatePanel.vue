<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CreateJobInputSchema, JobTypeLabel, JobTypeSchema, type ContractError, type ErrorResponse } from '../../contracts/types.ts'
import ErrorState from '../../shared/components/ErrorState.vue'
import { useJobsStore } from '../stores/jobs.ts'

const router = useRouter()
const jobsStore = useJobsStore()
const title = ref('')
const type = ref('')
const subject = ref('')
const goal = ref('')
const titleResult = computed(() => CreateJobInputSchema.shape.title.safeParse(title.value))
const typeResult = computed(() => JobTypeSchema.safeParse(type.value))
const error = ref<ContractError | null>(null)

async function submit() {
  const selectedType = typeResult.value
  if (!titleResult.value.success || !selectedType.success) return
  error.value = null
  try {
    const job = await jobsStore.createJob({
      title: title.value,
      type: selectedType.data,
      subject: subject.value.trim() === '' ? null : subject.value,
      goal: goal.value,
    })
    await router.push({ name: 'job-detail', params: { id: job.id, stage: 'collect' } })
  } catch (cause) {
    error.value = (cause as ErrorResponse).error
  }
}
</script>

<template>
  <section
    class="job-create-panel"
    aria-label="新建作业"
  >
    <h2>新建作业</h2>
    <form
      novalidate
      @submit.prevent="submit"
    >
      <label>
        标题
        <input
          v-model="title"
          aria-label="作业标题"
          :aria-invalid="!titleResult.success"
          aria-describedby="job-create-title-hint"
        >
      </label>
      <p
        v-if="!titleResult.success"
        id="job-create-title-hint"
        role="alert"
      >
        请填写作业标题。
      </p>
      <label>
        类型
        <select
          v-model="type"
          aria-label="作业类型"
          :aria-invalid="!typeResult.success"
          aria-describedby="job-create-type-hint"
        >
          <option value="">请选择类型</option>
          <option
            v-for="(label, value) in JobTypeLabel"
            :key="value"
            :value="value"
          >{{ label.text }}</option>
        </select>
      </label>
      <p
        v-if="!typeResult.success"
        id="job-create-type-hint"
        role="alert"
      >
        请选择作业类型。
      </p>
      <label>
        品种 / 主题（可选）
        <input
          v-model="subject"
          aria-label="品种 / 主题"
        >
      </label>
      <label>
        目标说明
        <textarea
          v-model="goal"
          aria-label="目标说明"
          rows="4"
        />
      </label>
      <button type="submit">
        创建作业
      </button>
    </form>
    <ErrorState
      v-if="error"
      module-id="job-create"
      :error="error"
      @retry="submit"
    />
  </section>
</template>

<style scoped>
.job-create-panel {
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
}

.job-create-panel form,
.job-create-panel label {
  display: grid;
  gap: var(--fai-space-grid-gap);
}

.job-create-panel label,
.job-create-panel [role='alert'] {
  color: var(--fai-text-secondary);
}

.job-create-panel input,
.job-create-panel select,
.job-create-panel textarea,
.job-create-panel button {
  min-width: 0;
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
}

.job-create-panel textarea {
  resize: vertical;
}

.job-create-panel button {
  justify-self: start;
  cursor: pointer;
}

.job-create-panel input:focus-visible,
.job-create-panel select:focus-visible,
.job-create-panel textarea:focus-visible,
.job-create-panel button:focus-visible {
  outline-color: var(--fai-accent-link);
}
</style>
