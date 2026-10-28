export interface NavItem {
  id: string
  path: string
  title: string
  en: string
  placeholderOwner?: string
}

export const navItems: readonly NavItem[] = [
  { id: 'workbench', path: '/workbench', title: '工作台', en: 'Workbench' },
  { id: 'jobs', path: '/jobs', title: '作业', en: 'Jobs', placeholderOwner: 'workbench-interaction' },
  { id: 'daily', path: '/daily', title: '日报', en: 'Daily report', placeholderOwner: 'daily-report' },
  { id: 'prices', path: '/prices', title: '价格', en: 'Prices', placeholderOwner: 'prices' },
  { id: 'balance', path: '/balance', title: '平衡表', en: 'Balance sheet', placeholderOwner: 'balance-sheet' },
  { id: 'logistics', path: '/logistics', title: '物流', en: 'Logistics', placeholderOwner: 'logistics' },
  // 格物致知 = 学习循环产品区，docs/plan.md §8 Phase 2C；仓库暂无同名 feature；路由 `/learning` 不改。
  { id: 'learning', path: '/learning', title: '格物致知', en: 'Inquiry', placeholderOwner: 'learning' },
  { id: 'knowledge', path: '/knowledge', title: '知识库', en: 'Knowledge base', placeholderOwner: 'knowledge-base' },
  { id: 'settings', path: '/settings', title: '设置', en: 'Settings', placeholderOwner: 'settings' },
]
