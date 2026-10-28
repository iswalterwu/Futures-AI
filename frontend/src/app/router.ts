import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PlaceholderPage from '../pages/PlaceholderPage.vue'
import WorkbenchPage from '../workbench/WorkbenchPage.vue'
import { navItems } from './nav.ts'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    en: string
    navId?: string
    placeholderOwner?: string
  }
}

const routes: RouteRecordRaw[] = navItems.map(item => ({
  path: item.id === 'daily' ? '/daily/:date?' : item.path,
  name: item.id,
  component: item.id === 'workbench' ? WorkbenchPage : PlaceholderPage,
  meta: { title: item.title, en: item.en, navId: item.id, placeholderOwner: item.placeholderOwner },
}))

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: WorkbenchPage, meta: { title: '工作台', en: 'Workbench', navId: 'workbench' } },
    ...routes,
    {
      path: '/:pathMatch(.*)*',
      component: PlaceholderPage,
      meta: { title: '页面未开放', en: 'Page unavailable', placeholderOwner: 'frontend-workbench' },
    },
  ],
})
