import { createPinia } from 'pinia'
import { isReadonly } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, test } from 'vitest'
import { router as appRouter } from '../../../src/app/router.ts'
import type { JobContext } from '../../../src/contracts/types.ts'
import { registerJobRoutes } from '../../../src/jobs/routes.ts'
import { useSessionStore } from '../../../src/jobs/stores/session.ts'

function session() {
  const pinia = createPinia()
  const router = createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes })
  registerJobRoutes(router, pinia)
  return { router, store: useSessionStore(pinia) }
}

describe('WI H-4 enter — AC-005-5 partial', () => {
  test('sets all four stages and updates the job via real navigation', async () => {
    const { router, store } = session()
    expect(store.context).toBeNull()
    for (const stage of ['collect', 'process', 'analyze', 'deliver']) {
      await router.push(`/jobs/j-collect/${stage}`)
      expect(store.context).toEqual({ jobId: 'j-collect', stage })
    }
    await router.push('/jobs/j-other/analyze')
    expect(store.context).toEqual({ jobId: 'j-other', stage: 'analyze' })
  })

  test.each(['/jobs/j-collect', '/jobs/j-collect/unknown', '/jobs/j-collect/Collect'])(
    '%s clears rather than inferring a stage', async path => {
      const { router, store } = session()
      await router.push('/jobs/j-collect/process')
      await router.push(path)
      expect(router.currentRoute.value.name).toBe('job-detail')
      expect(store.context).toBeNull()
      // T-B04 will use replace to resolve the missing/unknown stage.
      await router.replace('/jobs/j-collect/collect')
      expect(store.context).toEqual({ jobId: 'j-collect', stage: 'collect' })
    },
  )
})

describe('WI H-4 leave same navigation — AC-005-5 partial', () => {
  test.each(['/jobs', '/unknown/page', '/workbench?stage=collect'])(
    'later afterEach already observes null when leaving for %s', async path => {
      const { router, store } = session()
      await router.push('/jobs/j-collect/collect')
      const observed: Array<JobContext | null> = []
      router.afterEach(() => { observed.push(store.context) })
      await router.push(path)
      expect(observed).toEqual([null])
      expect(store.context).toBeNull()
    },
  )
})

describe('WI H-4 readonly — AC-009-1 partial', () => {
  test('exposes a readonly getter, not writable context state or a public setter', async () => {
    const { router, store } = session()
    await router.push('/jobs/j-collect/analyze')
    expect(store.context).toEqual({ jobId: 'j-collect', stage: 'analyze' })
    expect(isReadonly(store.context)).toBe(true)
    expect(Object.keys(store.$state)).toEqual([])
    expect(store).not.toHaveProperty('setContext')
    expect(store).not.toHaveProperty('currentContext')

    // Compile-time assertions only: never use mutation to set test context.
    const assertReadonly = () => {
      // @ts-expect-error context is a getter, not a writable state property.
      store.context = { jobId: 'arbitrary', stage: 'collect' }
      if (store.context) {
        // @ts-expect-error the exposed context cannot be mutated through its fields either.
        store.context.stage = 'deliver'
      }
      // @ts-expect-error there is no public context setter.
      store.setContext(null)
    }
    expect(assertReadonly).toBeTypeOf('function')
  })
})
