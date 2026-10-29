import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import { StageSchema, type JobContext } from '../../contracts/types.ts'

export const useSessionStore = defineStore('job-session', () => {
  const currentContext = ref<JobContext | null>(null)
  const context = computed(() => currentContext.value === null ? null : readonly(currentContext.value))

  function bindRouter(router: Router): void {
    router.afterEach(to => {
      const stage = StageSchema.safeParse(to.params.stage)
      currentContext.value = to.name === 'job-detail' && stage.success
        ? { jobId: to.params.id as string, stage: stage.data }
        : null
    })
  }

  return { context, bindRouter }
})
