<script setup lang="ts">
import { ref, type DeepReadonly } from 'vue'
import { dataMethods } from '../../contracts/methods.ts'
import ErrorState from '../../shared/components/ErrorState.vue'
import type { ContractError, ErrorResponse, Job, StageWorkspace } from '../../contracts/types.ts'
import ArtifactStatusBadge from '../components/ArtifactStatusBadge.vue'
import { useIntakeStore } from '../stores/intake.ts'

defineProps<{
  job: DeepReadonly<Job>
  workspace: Extract<DeepReadonly<StageWorkspace>, { readonly stage: 'collect' }>
}>()
const intake = useIntakeStore()
const removeTarget = ref<string | null>(null)
const reason = ref('来源不再适用')
const validationMessage = ref('')
const error = ref<ContractError | null>(null)

function requestRemove(uploadId: string) {
  removeTarget.value = uploadId
  reason.value = '来源不再适用'
  validationMessage.value = ''
  error.value = null
}

async function confirmRemove(uploadId: string) {
  validationMessage.value = ''
  error.value = null
  const result = dataMethods.removeUpload.params.def.items[1].safeParse(reason.value)
  if (!result.success) {
    validationMessage.value = '请填写删除理由。'
    return
  }
  try {
    await intake.remove(uploadId, result.data)
    removeTarget.value = null
  } catch (cause) {
    error.value = (cause as ErrorResponse).error
  }
}
</script>

<template>
  <div class="collect-workspace">
    <button
      type="button"
      @click="intake.open(job.id)"
    >
      投放到本作业
    </button>
    <ul aria-label="采集列表">
      <li
        v-for="upload in workspace.uploads"
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
        <button
          type="button"
          @click="intake.open(job.id); intake.selectUpload(upload)"
        >
          预览 / 修正
        </button>
        <button
          type="button"
          @click="requestRemove(upload.id)"
        >
          删除来源
        </button>
        <section
          v-if="removeTarget === upload.id"
          aria-label="确认删除来源"
        >
          <h3>确认删除来源</h3>
          <p>删除后从当前采集列表移除，历史记录仍保留。</p>
          <label>删除理由<textarea
            v-model="reason"
            aria-label="删除理由"
          /></label>
          <p
            v-if="validationMessage"
            role="alert"
          >
            {{ validationMessage }}
          </p>
          <button
            type="button"
            @click="confirmRemove(upload.id)"
          >
            确认删除
          </button>
          <button
            type="button"
            @click="removeTarget = null"
          >
            取消
          </button>
          <ErrorState
            v-if="error"
            module-id="intake-remove"
            :error="error"
            @retry="confirmRemove(upload.id)"
          />
        </section>
      </li>
    </ul>
    <p v-if="workspace.uploads.length === 0">
      暂无投放。
    </p>
  </div>
</template>

<style scoped>
.collect-workspace {
  min-width: 0;
  overflow-wrap: anywhere;
}

.collect-workspace ul {
  display: grid;
  gap: var(--fai-space-grid-gap);
  padding: 0;
  list-style: none;
}

.collect-workspace li {
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
}

.collect-workspace textarea {
  box-sizing: border-box;
  width: 100%;
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  border: thin solid var(--fai-glass-module-border);
  font: inherit;
}

.collect-workspace button {
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
  cursor: pointer;
}

.collect-workspace button:focus-visible {
  outline-color: var(--fai-accent-link);
}
</style>
