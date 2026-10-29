import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, test } from 'vitest'
import { router as appRouter } from '../../../src/app/router.ts'
import PlaceholderPage from '../../../src/pages/PlaceholderPage.vue'
import JobListPage from '../../../src/jobs/pages/JobListPage.vue'
import JobDetailPage from '../../../src/jobs/pages/JobDetailPage.vue'
import { jobRoutes, registerJobRoutes } from '../../../src/jobs/routes.ts'

function memoryRouter() {
  return createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes })
}

describe('WI routes — AC-001-1 / AC-002-2 partial', () => {
  test.each([
    ['/jobs', 'jobs', {}, JobListPage],
    ['/jobs/j-collect', 'job-detail', { id: 'j-collect', stage: '' }, JobDetailPage],
    ['/jobs/j-collect/collect', 'job-detail', { id: 'j-collect', stage: 'collect' }, JobDetailPage],
    ['/jobs/j-collect/process', 'job-detail', { id: 'j-collect', stage: 'process' }, JobDetailPage],
    ['/jobs/j-other/analyze', 'job-detail', { id: 'j-other', stage: 'analyze' }, JobDetailPage],
    ['/jobs/j-other/deliver', 'job-detail', { id: 'j-other', stage: 'deliver' }, JobDetailPage],
  ] as const)('%s resolves and navigates to the feature page', async (path, name, params, component) => {
    const router = memoryRouter()
    registerJobRoutes(router, createPinia())
    await router.push(path)
    expect(router.currentRoute.value.name).toBe(name)
    expect(router.currentRoute.value.params).toEqual(params)
    expect(router.currentRoute.value.meta).toMatchObject({ navId: 'jobs' })
    expect(router.currentRoute.value.meta.title).toBeTruthy()
    expect(router.currentRoute.value.meta.en).toBeTruthy()
    expect(router.currentRoute.value.matched[0].components?.default).toBe(component)
  })

  test('unknown paths still use the real baseline fallback', async () => {
    const router = memoryRouter()
    registerJobRoutes(router, createPinia())
    await router.push('/not-a-page/nested')
    expect(router.currentRoute.value.matched[0].path).toBe('/:pathMatch(.*)*')
    expect(router.currentRoute.value.matched[0].components?.default).toBe(PlaceholderPage)
    expect(router.currentRoute.value.meta.title).toBe('页面未开放')
  })
})

describe('WI register — AC-002-2 partial / H-3 route slice', () => {
  test('replaces a same-name placeholder without duplicate records', () => {
    const router = memoryRouter()
    router.addRoute({ path: '/jobs', name: 'jobs', component: PlaceholderPage })
    registerJobRoutes(router, createPinia())
    expect(router.getRoutes().filter(route => route.name === 'jobs')).toHaveLength(1)
    expect(router.getRoutes().filter(route => route.path === '/jobs')).toHaveLength(1)
    expect(router.resolve('/jobs').matched[0].components?.default).toBe(JobListPage)
    expect(router.resolve('/jobs/j-collect/collect').matched[0].components?.default).toBe(JobDetailPage)
  })

  test('adds exactly two records to the actual app router, preserving all baseline routes', () => {
    const before = appRouter.getRoutes()
    expect(before.some(route => route.name === 'jobs')).toBe(false)
    try {
      registerJobRoutes(appRouter, createPinia())
      expect(appRouter.getRoutes()).toHaveLength(before.length + 2)
      for (const route of before) expect(appRouter.getRoutes()).toContain(route)
      expect(jobRoutes.map(route => [route.name, route.path])).toEqual([
        ['jobs', '/jobs'], ['job-detail', '/jobs/:id/:stage?'],
      ])
      for (const route of jobRoutes) {
        const matches = appRouter.getRoutes().filter(record => record.name === route.name)
        expect(matches).toHaveLength(1)
        expect(matches[0].components?.default).toBe(route.component)
      }
      expect(appRouter.resolve('/unknown').matched[0].components?.default).toBe(PlaceholderPage)
    } finally {
      appRouter.removeRoute('jobs')
      appRouter.removeRoute('job-detail')
    }
  })
})
