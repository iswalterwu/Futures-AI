import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { dataClient } from '../contracts/index.ts'
import type { Bootstrap, ContractError, ErrorResponse, NewsItem, SourceStatus } from '../contracts/types.ts'

export const useAppStore = defineStore('app', () => {
  const phase = ref<'loading' | 'error' | 'ready'>('loading')
  const boot = ref<Bootstrap | null>(null)
  const error = ref<ContractError | null>(null)
  const completed = ref(0)
  const news = ref<NewsItem[]>([])
  const sources = ref<SourceStatus[]>([])
  const progress = computed(() => completed.value / 3 * 100)
  const statusText = computed(() => {
    if (completed.value === 3) return '加载完成'
    return boot.value ? '正在加载资讯与数据源…' : '正在启动本地工作台…'
  })

  async function bootstrap(): Promise<boolean> {
    phase.value = 'loading'
    boot.value = null
    error.value = null
    completed.value = 0
    try {
      boot.value = await dataClient.bootstrap()
      completed.value += 1
      await Promise.all([
        dataClient.getNewsTicker().then(items => { news.value = items; completed.value += 1 }),
        dataClient.getSourceStatus().then(items => { sources.value = items; completed.value += 1 }),
      ])
      return true
    } catch (cause) {
      error.value = (cause as ErrorResponse).error
      phase.value = 'error'
      return false
    }
  }

  return { phase, boot, error, progress, statusText, news, sources, bootstrap }
})
