<script setup lang="ts">
import ArtifactStatusBadge from '../components/ArtifactStatusBadge.vue'
import { useIntakeStore } from '../stores/intake.ts'

const intake = useIntakeStore()
</script>

<template>
  <section
    v-if="intake.selection"
    aria-label="抽取预览"
  >
    <h2>抽取预览</h2>
    <p>识别类型：{{ intake.selection.preview.detectedType }}</p>
    <div
      v-for="(field, index) in intake.selection.preview.fields"
      :key="index"
    >
      {{ field.sourceField }} → {{ field.targetField }} · {{ field.unit }}
    </div>
    <p>整体单位：{{ intake.selection.preview.unit ?? '未知' }}</p>
    <p>
      时间范围：{{ intake.selection.preview.timeRange ? `${intake.selection.preview.timeRange.start} — ${intake.selection.preview.timeRange.end}` : '未知' }}
    </p>
    <ArtifactStatusBadge :status="intake.selection.upload.status" />
    <p v-if="intake.selection.upload.quarantineReason">
      隔离原因：{{ intake.selection.upload.quarantineReason }}
    </p>
  </section>
</template>
