import type { AgentScript } from '../index.ts'

const common = { runId: 'sample-retry', sessionId: 'sample-session', ts: '2026-10-28T09:00:00+08:00' }

export default [
  { afterMs: 0, event: { ...common, type: 'run.started', prompt: '更新关注合约（重试样例）' } },
  { afterMs: 200, event: { ...common, type: 'step.tool.call', stepId: 1, toolCallId: 'watchlist-1', toolName: 'fetch_series', argsSummary: '合成示例：关注合约价格。', moduleId: 'watchlist' } },
  { afterMs: 600, event: { ...common, type: 'step.tool.result', stepId: 2, toolCallId: 'watchlist-1', isError: true, resultSummary: 'rate_limited：样例限流，稍后重试。', durationMs: 400, moduleId: 'watchlist' } },
  { afterMs: 700, event: { ...common, type: 'step.error', stepId: 3, message: 'rate_limited：已安排重试，当前运行继续。', willRetry: true } },
  { afterMs: 1100, event: { ...common, type: 'step.tool.call', stepId: 4, toolCallId: 'watchlist-2', toolName: 'fetch_series', argsSummary: '合成示例：重试同一份关注合约价格查询。', moduleId: 'watchlist' } },
  { afterMs: 1700, event: { ...common, type: 'step.tool.result', stepId: 5, toolCallId: 'watchlist-2', isError: false, resultSummary: '重试成功，三个合约价格已就绪。', durationMs: 600, moduleId: 'watchlist' } },
  { afterMs: 1900, event: { ...common, type: 'step.text', stepId: 6, text: '样例重试成功；请到关注列表查看合约价格。', done: true } },
  { afterMs: 2000, event: { ...common, type: 'hint.navigate', stepId: 7, target: { kind: 'module', id: 'watchlist' } } },
  { afterMs: 2200, event: { ...common, type: 'run.completed', moduleIds: ['watchlist'] } },
] satisfies AgentScript
