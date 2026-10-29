import type { Pinia } from 'pinia'
import type { Router, RouteRecordRaw } from 'vue-router'
import JobListPage from './pages/JobListPage.vue'
import JobDetailPage from './pages/JobDetailPage.vue'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- T-A22b uses pinia to bind the route context.
export function registerJobRoutes(router: Router, pinia: Pinia): void {
  for (const route of jobRoutes) router.addRoute(route)
}
