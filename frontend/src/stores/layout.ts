import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { dataClient } from '../contracts/index.ts'
import type { ContractError, ErrorResponse, ModuleDef, ModuleId } from '../contracts/types.ts'

export const useLayoutStore = defineStore('layout', () => {
  const catalog = ref<ModuleDef[]>([])
  const order = ref<ModuleId[]>([])
  const status = ref<'loading' | 'ready' | 'error'>('loading')
  const error = ref<ContractError | null>(null)
  const modules = computed(() => order.value.map(id => catalog.value.find(module => module.id === id)!))

  async function loadCatalog() {
    if (status.value === 'ready') return
    status.value = 'loading'
    error.value = null
    try {
      catalog.value = await dataClient.getModuleCatalog()
      order.value = readOrder(catalog.value)
      status.value = 'ready'
    } catch (cause) {
      error.value = (cause as ErrorResponse).error
      status.value = 'error'
    }
  }

  function add(id: ModuleId) {
    if (order.value.includes(id)) return
    order.value.push(id)
    persist()
  }

  function remove(id: ModuleId) {
    order.value = order.value.filter(item => item !== id)
    persist()
  }

  function moveUp(id: ModuleId) {
    const index = order.value.indexOf(id)
    if (index <= 0) return
    order.value.splice(index - 1, 0, ...order.value.splice(index, 1))
    persist()
  }

  function moveDown(id: ModuleId) {
    const index = order.value.indexOf(id)
    if (index < 0 || index === order.value.length - 1) return
    order.value.splice(index + 1, 0, ...order.value.splice(index, 1))
    persist()
  }

  function persist() {
    localStorage.setItem('fai.layout', JSON.stringify(order.value))
  }

  return { catalog, order, status, error, modules, loadCatalog, add, remove, moveUp, moveDown }
})

function readOrder(catalog: ModuleDef[]): ModuleId[] {
  const defaults = catalog.map(module => module.id)
  const stored = localStorage.getItem('fai.layout')
  if (stored === null) return defaults
  let saved: unknown
  try {
    saved = JSON.parse(stored)
  } catch {
    return defaults
  }
  if (!Array.isArray(saved) || !saved.every(id => typeof id === 'string')) return defaults
  const knownIds = new Set<string>(defaults)
  return [...new Set(saved)].filter((id): id is ModuleId => knownIds.has(id))
}
