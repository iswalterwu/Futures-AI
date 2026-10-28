import { defineStore } from 'pinia'
import { onScopeDispose, ref } from 'vue'
import { T } from '../design/generated/tokens.ts'

export type DrawerState = 'closed' | 'half' | 'tall'

export const useUiStore = defineStore('ui', () => {
  const railCollapsed = ref(localStorage.getItem('fai.rail') === 'collapsed')
  const savedDrawer = localStorage.getItem('fai.drawer')
  const drawer = ref<DrawerState>(savedDrawer === 'half' || savedDrawer === 'tall' ? savedDrawer : 'closed')

  const queries = {
    desktop: matchMedia(`(min-width: ${T.breakpoint.shell_collapse}px)`),
    focus: matchMedia(`(min-width: ${T.breakpoint.focus_expand}px)`),
    three: matchMedia(`(min-width: ${T.breakpoint.grid_three}px)`),
    four: matchMedia(`(min-width: ${T.breakpoint.grid_four}px)`),
  }
  const viewport = ref(readViewport())

  for (const query of Object.values(queries)) query.addEventListener('change', updateViewport)
  onScopeDispose(() => {
    for (const query of Object.values(queries)) query.removeEventListener('change', updateViewport)
  })

  function setDrawer(state: DrawerState) {
    drawer.value = state
    localStorage.setItem('fai.drawer', state)
  }

  function toggleRail() {
    railCollapsed.value = !railCollapsed.value
    localStorage.setItem('fai.rail', railCollapsed.value ? 'collapsed' : 'expanded')
  }

  function updateViewport() {
    viewport.value = readViewport()
  }

  function readViewport() {
    return {
      collapsed: !queries.desktop.matches,
      cols: queries.four.matches ? T.layout.grid_four
        : queries.three.matches ? T.layout.grid_three
          : queries.desktop.matches ? T.layout.grid_default : T.layout.grid_narrow,
      focusCards: queries.focus.matches ? T.layout.focus_expanded : T.layout.focus_compact,
    }
  }

  return { railCollapsed, toggleRail, drawer, setDrawer, viewport }
})
