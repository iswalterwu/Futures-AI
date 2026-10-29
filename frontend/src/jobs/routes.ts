import type { Pinia } from 'pinia'
import type { Router, RouteRecordRaw } from 'vue-router'
import JobListPage from './pages/JobListPage.vue'
import JobDetailPage from './pages/JobDetailPage.vue'
import { useSessionStore } from './stores/session.ts'

export const jobRoutes: RouteRecordRaw[] = [
  {
    path: '/jobs',
    name: 'jobs',
    component: JobListPage,
    meta: { title: '作业', en: 'Jobs', navId: 'jobs' },
  },
  {
    path: '/jobs/:id/:stage?',
    name: 'job-detail',
    component: JobDetailPage,
    meta: { title: '作业详情', en: 'Job detail', navId: 'jobs' },
  },
]

export function registerJobRoutes(router: Router, pinia: Pinia): void {
  for (const route of jobRoutes) router.addRoute(route)
  useSessionStore(pinia).bindRouter(router)
}
