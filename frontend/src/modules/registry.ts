import type { Component } from 'vue'
import type { ModuleId } from '../contracts/types.ts'
import ModuleShell from './ModuleShell.vue'

// 正文由 T-11 提供，先映射到空壳，避免在注册表复制目录或业务实现。
export const moduleComponents: Record<ModuleId, Component> = {
  'market-board': ModuleShell,
  'supply-demand': ModuleShell,
  'logistics-onwater': ModuleShell,
  positions: ModuleShell,
  'doc-catalog': ModuleShell,
  watchlist: ModuleShell,
  'release-calendar': ModuleShell,
}
