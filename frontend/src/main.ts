import { createPinia } from 'pinia'
import { createApp } from 'vue'
import AppShell from './app/AppShell.vue'
import { router } from './app/router.ts'
import './design/base.css'

createApp(AppShell).use(createPinia()).use(router).mount('#app')
