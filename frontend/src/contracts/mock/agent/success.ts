import type { AgentScript } from '../index.ts'

const common = { runId: 'sample-success', sessionId: 'sample-session', ts: '2026-10-28T09:00:00+08:00' }

export default [
  { afterMs: 0, event: { ...common, type: 'run.started', prompt: '分析今日油品行情（样例）' } },
  { afterMs: 100, event: { ...common, type: 'step.thinking', stepId: 1, text: '先读取合约价格，', done: false } },
  { afterMs: 200, event: { ...common, type: 'step.thinking', stepId: 1, text: '先读取合约价格，再核对库存指标。', done: true } },
  { afterMs: 300, event: { ...common, type: 'step.tool.call', stepId: 2, toolCallId: 'prices-1', toolName: 'fetch_series', argsSummary: '合成示例：SC2612、PG2612、FU2701；频率 1d。', moduleId: 'market-board' } },
  { afterMs: 900, event: { ...common, type: 'step.tool.result', stepId: 3, toolCallId: 'prices-1', isError: false, resultSummary: '已读取三份合成行情及 60 个样例收盘点。', durationMs: 600, moduleId: 'market-board' } },
  { afterMs: 1100, event: { ...common, type: 'step.text', stepId: 4, text: '样例中原油走高，', done: false } },
  { afterMs: 1200, event: { ...common, type: 'step.text', stepId: 4, text: 'LPG 小幅回落。', done: false } },
  { afterMs: 1400, event: { ...common, type: 'step.text', stepId: 4, text: '样例中原油走高，LPG 小幅回落；这不是实时行情或交易建议。', done: true } },
  { afterMs: 1600, event: { ...common, type: 'hint.navigate', stepId: 5, target: { kind: 'module', id: 'market-board' }, reason: '查看行情价格与样例折线。' } },
  { afterMs: 1800, event: { ...common, type: 'hint.navigate', stepId: 6, target: { kind: 'page', id: '/prices' }, reason: '查看价格页面占位。' } },
  { afterMs: 2000, event: { ...common, type: 'hint.navigate', stepId: 7, target: { kind: 'module', id: 'sample-unavailable-module' }, reason: '样例：该目标不存在，应提示而不跳转。' } },
  { afterMs: 2400, event: { ...common, type: 'run.completed', moduleIds: ['market-board'] } },
] satisfies AgentScript
