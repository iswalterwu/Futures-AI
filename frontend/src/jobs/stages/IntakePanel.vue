<script setup lang="ts">
import { ref } from 'vue'
import { INTAKE_FILE_EXTENSIONS, IntakeFileMetaSchema, IntakeInputSchema, ReliabilityLabel, SourceNoteSchema, type ContractError, type ErrorResponse, type SourceNote } from '../../contracts/types.ts'
import ErrorState from '../../shared/components/ErrorState.vue'
import { useIntakeStore, type IntakeSubmission } from '../stores/intake.ts'

const intake = useIntakeStore()
const fileError = ref('')
const validationMessage = ref('')
const error = ref<ContractError | null>(null)
let lastSubmission: IntakeSubmission | null = null

async function submit() {
  validationMessage.value = ''
  const submission = validateSubmission()
  if (submission === null) return
  lastSubmission = submission
  await send(submission)
}

async function send(submission: IntakeSubmission) {
  error.value = null
  try {
    await intake.submit(submission)
    fileError.value = ''
  } catch (cause) {
    error.value = (cause as ErrorResponse).error
  }
}

function selectFile(file: File | undefined) {
  fileError.value = ''
  if (file === undefined) {
    intake.updateDraft({ fileMeta: null })
    return
  }
  const result = IntakeFileMetaSchema.safeParse({ name: file.name, size: file.size, type: file.type, lastModified: file.lastModified })
  intake.updateDraft({ fileMeta: result.success ? result.data : null })
  if (!result.success) fileError.value = `只接受 ${INTAKE_FILE_EXTENSIONS.join(' / ')} 文件`
}

function validateSubmission(): IntakeSubmission | null {
  const draft = intake.draft
  const note = SourceNoteSchema.safeParse({
    purpose: draft.purpose,
    reliability: draft.reliability,
    publishedAt: draft.publishedAt === '' ? null : draft.publishedAt,
    validUntil: draft.validUntil === '' ? null : draft.validUntil,
    scopeNote: draft.scopeNote === '' ? null : draft.scopeNote,
  })
  if (!note.success) {
    validationMessage.value = note.error.issues[0]!.path[0] === 'purpose' ? '请填写用途。' : '请检查来源说明中的可靠性与日期。'
    return null
  }
  switch (draft.inputKind) {
    case 'file':
      if (draft.fileMeta === null) {
        validationMessage.value = '请选择文件。'
        return null
      }
      return { inputKind: 'file', fileMeta: draft.fileMeta, sourceNote: note.data }
    case 'url': {
      const result = IntakeInputSchema.options[1].shape.url.safeParse(draft.url)
      if (!result.success) {
        validationMessage.value = '请填写链接。'
        return null
      }
      return { inputKind: 'url', url: result.data, sourceNote: note.data }
    }
    case 'text': {
      const result = IntakeInputSchema.options[2].shape.text.safeParse(draft.text)
      if (!result.success) {
        validationMessage.value = '请粘贴文本。'
        return null
      }
      return { inputKind: 'text', text: result.data, sourceNote: note.data }
    }
  }
}
</script>

<template>
  <section
    class="intake-panel"
    aria-label="投放表单"
  >
    <h2>投放材料</h2>
    <p>本地样例记录；原文不保存，刷新后需重新投放原文</p>
    <form
      novalidate
      @submit.prevent="submit"
    >
      <fieldset>
        <legend>投放方式</legend>
        <label>
          <input
            type="radio"
            name="intake-kind"
            value="file"
            :checked="intake.draft.inputKind === 'file'"
            @change="intake.updateDraft({ inputKind: 'file' })"
          >文件
        </label>
        <label>
          <input
            type="radio"
            name="intake-kind"
            value="url"
            :checked="intake.draft.inputKind === 'url'"
            @change="intake.updateDraft({ inputKind: 'url' })"
          >链接
        </label>
        <label>
          <input
            type="radio"
            name="intake-kind"
            value="text"
            :checked="intake.draft.inputKind === 'text'"
            @change="intake.updateDraft({ inputKind: 'text' })"
          >文本
        </label>
      </fieldset>
      <div
        v-if="intake.draft.inputKind === 'file'"
        class="intake-drop"
        @dragover.prevent
        @drop.prevent="selectFile($event.dataTransfer?.files[0])"
      >
        <label>
          拖入或选择文件
          <input
            type="file"
            aria-label="投放文件"
            :accept="INTAKE_FILE_EXTENSIONS.map(ext => `.${ext}`).join(',')"
            @change="selectFile(($event.target as HTMLInputElement).files?.[0])"
          >
        </label>
        <p v-if="intake.draft.fileMeta">
          已选：{{ intake.draft.fileMeta.name }} · {{ intake.draft.fileMeta.size }} 字节
        </p>
        <p
          v-if="fileError"
          role="alert"
        >
          {{ fileError }}
        </p>
      </div>
      <label v-else-if="intake.draft.inputKind === 'url'">
        链接
        <input
          type="url"
          aria-label="投放链接"
          :value="intake.draft.url"
          @input="intake.updateDraft({ url: ($event.target as HTMLInputElement).value })"
        >
      </label>
      <label v-else>
        文本
        <textarea
          aria-label="投放文本"
          rows="4"
          :value="intake.draft.text"
          @input="intake.updateDraft({ text: ($event.target as HTMLTextAreaElement).value })"
        />
      </label>
      <label>
        用途（必填）
        <input
          aria-label="用途"
          required
          :value="intake.draft.purpose"
          @input="intake.updateDraft({ purpose: ($event.target as HTMLInputElement).value })"
        >
      </label>
      <label>
        可靠性
        <select
          aria-label="可靠性"
          :value="intake.draft.reliability"
          @change="intake.updateDraft({ reliability: ($event.target as HTMLSelectElement).value as SourceNote['reliability'] })"
        >
          <option
            v-for="(label, value) in ReliabilityLabel"
            :key="value"
            :value="value"
          >{{ label.text }}</option>
        </select>
      </label>
      <label>
        发布日期
        <input
          type="date"
          aria-label="发布日期"
          :value="intake.draft.publishedAt"
          @input="intake.updateDraft({ publishedAt: ($event.target as HTMLInputElement).value })"
        >
      </label>
      <label>
        有效期
        <input
          type="date"
          aria-label="有效期"
          :value="intake.draft.validUntil"
          @input="intake.updateDraft({ validUntil: ($event.target as HTMLInputElement).value })"
        >
      </label>
      <label>
        口径备注（可选）
        <textarea
          aria-label="口径备注"
          rows="2"
          :value="intake.draft.scopeNote"
          @input="intake.updateDraft({ scopeNote: ($event.target as HTMLTextAreaElement).value })"
        />
      </label>
      <p
        v-if="validationMessage"
        role="alert"
      >
        {{ validationMessage }}
      </p>
      <button type="submit">
        提交投放
      </button>
    </form>
    <ErrorState
      v-if="error"
      module-id="intake-submit"
      :error="error"
      @retry="lastSubmission !== null && send(lastSubmission)"
    />
  </section>
</template>

<style scoped>
.intake-panel {
  min-width: 0;
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  overflow-wrap: anywhere;
}

.intake-panel form,
.intake-panel label {
  display: grid;
  gap: var(--fai-space-grid-gap);
}

.intake-panel fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fai-space-grid-gap);
  min-width: 0;
  border: thin solid var(--fai-glass-module-border);
}

.intake-panel fieldset label {
  display: flex;
  align-items: center;
}

.intake-panel label,
.intake-panel p {
  color: var(--fai-text-secondary);
}

.intake-panel input,
.intake-panel select,
.intake-panel textarea,
.intake-panel button {
  min-width: 0;
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
}

.intake-panel textarea {
  resize: vertical;
}

.intake-panel button {
  justify-self: start;
  cursor: pointer;
}

.intake-panel input:focus-visible,
.intake-panel select:focus-visible,
.intake-panel textarea:focus-visible,
.intake-panel button:focus-visible {
  outline-color: var(--fai-accent-link);
}

.intake-drop {
  padding: var(--fai-space-grid-gap);
  border: thin dashed var(--fai-glass-module-border);
}
</style>
