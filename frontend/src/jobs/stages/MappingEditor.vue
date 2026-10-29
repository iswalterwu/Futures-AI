<script setup lang="ts">
import { computed, ref } from 'vue'
import { FieldMappingSchema, type ContractError, type ErrorResponse } from '../../contracts/types.ts'
import ErrorState from '../../shared/components/ErrorState.vue'
import ArtifactStatusBadge from '../components/ArtifactStatusBadge.vue'
import { useIntakeStore } from '../stores/intake.ts'

const intake = useIntakeStore()
const editable = computed(() => intake.selection?.upload.status === 'pending_validation' && !intake.selection.upload.removed)
const validationMessage = ref('')
const error = ref<ContractError | null>(null)

async function confirm() {
  validationMessage.value = ''
  error.value = null
  const result = FieldMappingSchema.safeParse(intake.selection!.mapping)
  if (!result.success) {
    validationMessage.value = '请填写目标字段与单位。'
    return
  }
  try {
    await intake.confirm(result.data)
  } catch (cause) {
    error.value = (cause as ErrorResponse).error
  }
}
</script>

<template>
  <section
    v-if="intake.selection"
    class="mapping-editor"
    aria-label="字段映射"
  >
    <h2>字段映射</h2>
    <form
      v-if="editable"
      novalidate
      @submit.prevent="confirm"
    >
      <div
        v-for="(field, index) in intake.selection.mapping"
        :key="index"
        class="mapping-row"
      >
        <span>源字段：{{ field.sourceField }}</span>
        <label>
          目标字段
          <input
            :aria-label="`目标字段 ${index + 1}`"
            :value="field.targetField"
            @input="intake.editMapping(index, { targetField: ($event.target as HTMLInputElement).value })"
          >
        </label>
        <label>
          单位
          <input
            :aria-label="`映射单位 ${index + 1}`"
            :value="field.unit"
            @input="intake.editMapping(index, { unit: ($event.target as HTMLInputElement).value })"
          >
        </label>
      </div>
      <p
        v-if="validationMessage"
        role="alert"
      >
        {{ validationMessage }}
      </p>
      <button type="submit">
        确认入库
      </button>
      <ErrorState
        v-if="error"
        module-id="intake-confirm"
        :error="error"
        @retry="confirm"
      />
    </form>
    <div v-else>
      <p>已保存映射（只读）</p>
      <p
        v-for="(field, index) in intake.selection.upload.mapping"
        :key="index"
      >
        {{ field.sourceField }} → {{ field.targetField }} · {{ field.unit }}
      </p>
      <ArtifactStatusBadge :status="intake.selection.upload.status" />
      <p v-if="intake.selection.upload.quarantineReason">
        隔离原因：{{ intake.selection.upload.quarantineReason }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.mapping-editor, .mapping-editor form, .mapping-row {
  display: grid;
  gap: var(--fai-space-grid-gap);
  min-width: 0;
}

.mapping-editor input, .mapping-editor button {
  box-sizing: border-box;
  max-width: 100%;
  padding: calc(var(--fai-space-grid-gap) / 2);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
}

.mapping-editor :focus-visible {
  outline-color: var(--fai-accent-link);
}
</style>
