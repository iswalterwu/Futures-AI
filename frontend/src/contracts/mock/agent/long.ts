import type { AgentScript } from '../index.ts'

const common = { runId: 'sample-long', sessionId: 'sample-session', ts: '2026-10-28T09:00:00+08:00' }

export default [
  { afterMs: 0, event: { ...common, type: 'run.started', prompt: '持续跟踪油品数据（长运行样例）' } },
  { afterMs: 150, event: { ...common, type: 'step.thinking', stepId: 1, text: '将分批读取样例数据；切换页面或收起抽屉不影响本次运行。', done: true } },
  { afterMs: 300, event: { ...common, type: 'step.tool.call', stepId: 2, toolCallId: 'long-prices', toolName: 'fetch_series', argsSummary: '合成示例：等待行情批次。', moduleId: 'market-board' } },
  { afterMs: 2500, event: { ...common, type: 'step.tool.result', stepId: 3, toolCallId: 'long-prices', isError: false, resultSummary: '行情样例批次已返回。', durationMs: 2200, moduleId: 'market-board' } },
  { afterMs: 4500, event: { ...common, type: 'step.tool.call', stepId: 4, toolCallId: 'long-supply', toolName: 'fetch_series', argsSummary: '合成示例：等待库存批次。', moduleId: 'supply-demand' } },
  { afterMs: 6500, event: { ...common, type: 'step.tool.result', stepId: 5, toolCallId: 'long-supply', isError: false, resultSummary: '库存样例批次已返回。', durationMs: 2000, moduleId: 'supply-demand' } },
  { afterMs: 8500, event: { ...common, type: 'step.text', stepId: 6, text: '样例数据核对完成；后台运行保持同一个 runId。', done: true } },
  { afterMs: 10500, event: { ...common, type: 'hint.navigate', stepId: 7, target: { kind: 'module', id: 'market-board' }, reason: '查看长运行得到的样例结果。' } },
  { afterMs: 12000, event: { ...common, type: 'run.completed', moduleIds: ['market-board', 'supply-demand'] } },
] satisfies AgentScript
