<script setup lang="ts">
import { ref, watch, type DeepReadonly } from 'vue'
import { dataClient } from '../../contracts/index.ts'
import { InterventionKindSchema, ReliabilityLabel, StageLabel, type ContractError, type ErrorResponse, type Intervention, type InterventionKind, type Job, type Stage } from '../../contracts/types.ts'
import EmptyState from '../../shared/components/EmptyState.vue'
import ErrorState from '../../shared/components/ErrorState.vue'
import Loading from '../../shared/components/Loading.vue'

const props = defineProps<{ job: DeepReadonly<Job> }>()
const expanded = ref(false)
const stage = ref<Stage | ''>('')
const kind = ref<InterventionKind | ''>('')
const events = ref<Intervention[]>([])
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const error = ref<ContractError | null>(null)

watch([() => props.job, stage, kind, expanded], () => {
  if (expanded.value) void load()
})

async function load() {
  status.value = 'loading'
  error.value = null
  try {
    events.value = await dataClient.listInterventions(props.job.id, {
      ...(stage.value === '' ? {} : { stage: stage.value }),
      ...(kind.value === '' ? {} : { kind: kind.value }),
    })
    status.value = 'ready'
  } catch (cause) {
    error.value = (cause as ErrorResponse).error
    status.value = 'error'
  }
}
</script>

<template>
  <aside
    class="intervention-history"
    aria-label="介入历史"
  >
    <h2>介入历史</h2>
    <button
      type="button"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起介入历史' : '展开介入历史' }}
    </button>
    <template v-if="expanded">
      <label>
        按阶段筛选
        <select
          v-model="stage"
          aria-label="按阶段筛选"
        >
          <option value="">全部</option>
          <option
            v-for="(label, value) in StageLabel"
            :key="value"
            :value="value"
          >{{ label.text }}</option>
        </select>
      </label>
      <label>
        按类型筛选
        <select
          v-model="kind"
          aria-label="按类型筛选"
        >
          <option value="">全部</option>
          <option
            v-for="value in InterventionKindSchema.options"
            :key="value"
            :value="value"
          >{{ value }}</option>
        </select>
      </label>
      <Loading v-if="status === 'loading'" />
      <ErrorState
        v-else-if="status === 'error' && error"
        module-id="intervention-history"
        :error="error"
        @retry="load"
      />
      <EmptyState
        v-else-if="events.length === 0"
        message="暂无介入记录。"
      />
      <ol v-else>
        <li
          v-for="event in events"
          :key="event.id"
          :data-intervention-id="event.id"
        >
          <time :datetime="event.createdAt">{{ event.createdAt }}</time>
          <p>{{ StageLabel[event.stage].text }} · {{ event.kind }} · {{ event.outcome }}</p>
          <details>
            <summary>事件详情</summary>
            <dl>
              <dt>id</dt><dd>{{ event.id }}</dd>
              <dt>jobId</dt><dd>{{ event.jobId }}</dd>
              <dt>artifactId</dt><dd>{{ event.artifactId ?? '无' }}</dd>
              <dt>baseRev</dt><dd>{{ event.baseRev ?? '无' }}</dd>
              <dt>reason</dt><dd>{{ event.reason ?? '无' }}</dd>
              <dt>payload · action</dt><dd>{{ event.payload.action }}</dd>
              <template v-if="event.payload.action === 'ingest'">
                <dt>用途</dt><dd>{{ event.payload.sourceNote.purpose }}</dd>
                <dt>可靠性</dt><dd>{{ ReliabilityLabel[event.payload.sourceNote.reliability].text }}</dd>
                <dt>发布日期</dt><dd>{{ event.payload.sourceNote.publishedAt ?? '未知' }}</dd>
                <dt>有效期</dt><dd>{{ event.payload.sourceNote.validUntil ?? '未知' }}</dd>
                <dt>口径备注</dt><dd>{{ event.payload.sourceNote.scopeNote ?? '无' }}</dd>
              </template>
              <template v-else-if="event.payload.action === 'map_fix'">
                <dt>映射</dt>
                <dd>
                  <ul>
                    <li
                      v-for="(row, index) in event.payload.mapping"
                      :key="index"
                    >
                      {{ row.sourceField }} → {{ row.targetField }} · {{ row.unit }}
                    </li>
                  </ul>
                </dd>
              </template>
              <template v-else-if="event.payload.action === 'remove_source' || event.payload.action === 'cancel_job' || event.payload.action === 'delete_conclusion' || event.payload.action === 'veto'">
                <dt>动作理由</dt><dd>{{ event.payload.reason }}</dd>
              </template>
            </dl>
          </details>
        </li>
      </ol>
    </template>
  </aside>
</template>

<style scoped>
.intervention-history {
  display: grid;
  align-content: start;
  gap: var(--fai-space-grid-gap);
  min-width: 0;
  padding: var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  overflow-wrap: anywhere;
}

.intervention-history label {
  display: grid;
  gap: calc(var(--fai-space-grid-gap) / 2);
}

.intervention-history button,
.intervention-history select {
  min-width: 0;
  padding: calc(var(--fai-space-grid-gap) / 2) var(--fai-space-grid-gap);
  border: thin solid var(--fai-glass-module-border);
  border-radius: var(--fai-radius-control);
  background: var(--fai-bg-middle);
  color: var(--fai-text-primary);
  font: inherit;
}

.intervention-history button,
.intervention-history summary {
  cursor: pointer;
}

.intervention-history button:focus-visible,
.intervention-history select:focus-visible,
.intervention-history summary:focus-visible {
  outline-color: var(--fai-accent-link);
}

.intervention-history ol {
  display: grid;
  gap: var(--fai-space-grid-gap);
  margin: 0;
  padding-inline-start: var(--fai-space-section-gap);
}

.intervention-history dt,
.intervention-history time {
  color: var(--fai-text-secondary);
}

.intervention-history dd {
  margin-inline-start: var(--fai-space-grid-gap);
  white-space: pre-wrap;
}
</style>
