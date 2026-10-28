import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const railCollapsed = ref(localStorage.getItem('fai.rail') === 'collapsed')

  function toggleRail() {
    railCollapsed.value = !railCollapsed.value
    localStorage.setItem('fai.rail', railCollapsed.value ? 'collapsed' : 'expanded')
  }

  return { railCollapsed, toggleRail }
})
