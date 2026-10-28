import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { expect, test } from 'vitest'
import App from '../../src/App.vue'

test('AC-009-1 SMOKE renders the Vue application with Pinia', () => {
  const wrapper = mount(App, {
    global: { plugins: [createPinia()] },
  })

  expect(wrapper.get('h1').text()).toBe('Futures-AI')
  expect(wrapper.get('[role="status"]').text()).toBe('前端脚手架已就绪')

  wrapper.unmount()
})
