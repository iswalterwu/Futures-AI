import type { AgentScript } from '../index.ts'

const common = { runId: 'sample-failure', sessionId: 'sample-session', ts: '2026-10-28T09:00:00+08:00' }

export default [
  { afterMs: 0, event: { ...common, type: 'run.started', prompt: '读取行情（失败样例）' } },
  { afterMs: 150, event: { ...common, type: 'step.thinking', stepId: 1, text: '尝试读取行情样例数据。', done: true } },
  { afterMs: 300, event: { ...common, type: 'step.tool.call', stepId: 2, toolCallId: 'failed-prices-1', toolName: 'fetch_series', argsSummary: '合成示例：行情适配器限流。', moduleId: 'market-board' } },
  { afterMs: 800, event: { ...common, type: 'step.tool.result', stepId: 3, toolCallId: 'failed-prices-1', isError: true, resultSummary: 'rate_limited：样例数据源限流。', durationMs: 500, moduleId: 'market-board' } },
  { afterMs: 1000, event: { ...common, type: 'step.error', stepId: 4, message: '本次运行不自动重试。', willRetry: false } },
  { afterMs: 1200, event: { ...common, type: 'run.failed', error: { code: 'rate_limited', message: '样例数据源限流，请稍后重试。', retryable: true } } },
] satisfies AgentScript
