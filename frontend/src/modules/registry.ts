import type { Component } from 'vue'
import type { ModuleId } from '../contracts/types.ts'
import MarketBoard from './market-board/MarketBoard.vue'
import Watchlist from './watchlist/Watchlist.vue'
import ReleaseCalendar from './release-calendar/ReleaseCalendar.vue'
import ModuleSummary from './summary/ModuleSummary.vue'

export const moduleComponents: Record<ModuleId, Component> = {
  'market-board': MarketBoard,
  'supply-demand': ModuleSummary,
  'logistics-onwater': ModuleSummary,
  positions: ModuleSummary,
  'doc-catalog': ModuleSummary,
  watchlist: Watchlist,
  'release-calendar': ReleaseCalendar,
}
