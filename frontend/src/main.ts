import { createPinia } from 'pinia'
import { createApp, h } from 'vue'
import AgentDock from './agent/AgentDock.vue'
import { useAgentStore } from './agent/store.ts'
import AppShell from './app/AppShell.vue'
import { router } from './app/router.ts'
import { agentClient } from './contracts/index.ts'
import './design/base.css'

const pinia = createPinia()
const app = createApp({
  render: () => h(AppShell, null, { dock: () => h(AgentDock) }),
})
const unsubscribe = agentClient.subscribe(useAgentStore(pinia).receive)
app.onUnmount(unsubscribe)
import.meta.hot?.dispose(unsubscribe)
app.use(pinia).use(router).mount('#app')
