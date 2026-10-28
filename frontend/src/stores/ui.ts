import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DrawerState = 'closed' | 'half' | 'tall'

export const useUiStore = defineStore('ui', () => {
  const railCollapsed = ref(localStorage.getItem('fai.rail') === 'collapsed')
  const savedDrawer = localStorage.getItem('fai.drawer')
  const drawer = ref<DrawerState>(savedDrawer === 'half' || savedDrawer === 'tall' ? savedDrawer : 'closed')

  function setDrawer(state: DrawerState) {
    drawer.value = state
    localStorage.setItem('fai.drawer', state)
  }

  function toggleRail() {
    railCollapsed.value = !railCollapsed.value
    localStorage.setItem('fai.rail', railCollapsed.value ? 'collapsed' : 'expanded')
  }

  return { railCollapsed, toggleRail, drawer, setDrawer }
})
