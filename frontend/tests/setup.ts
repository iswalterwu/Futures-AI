import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach } from 'vitest'

// 组件测试挂载真实组件（含 Pinia store），每个用例前换一个新的 Pinia，
// 避免 store 状态在用例之间泄漏。放在 setup 里而不是每个 spec 各自传 plugins，
// 因为 6 个组件测试文件都要挂载带 store 的组件。
beforeEach(() => {
  config.global.plugins = [createPinia()]
})
