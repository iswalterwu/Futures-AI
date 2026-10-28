import { z } from 'zod'
import { ContractErrorSchema, ModuleIdSchema, TimestampSchema } from '../contracts/types.ts'

const eventFields = {
  runId: z.string().min(1).describe('运行 ID，所有同次运行的事件保持一致。'),
  sessionId: z.string().min(1).describe('会话 ID，所有同次运行的事件保持一致。'),
  ts: TimestampSchema.describe('事件发生时间，ISO 8601 带偏移。'),
}
const stepFields = {
  ...eventFields,
  stepId: z.int().nonnegative().describe('run 内单调递增的步骤编号；同一步的文本片段与权威全文复用编号。'),
}
const textFields = {
  ...stepFields,
  text: z.string().describe('done=false 时为追加片段；done=true 时为替换该步骤内容的权威全文。'),
  done: z.boolean().describe('是否为本步骤权威全文；不是整个运行的终态。'),
}

export const RunStartedEventSchema = z.object({
  type: z.literal('run.started').describe('运行开始事件。'),
  ...eventFields,
  prompt: z.string().min(1).describe('触发本次运行的用户消息。'),
}).describe('一次运行的首个事件。')

export const ThinkingEventSchema = z.object({
  type: z.literal('step.thinking').describe('思考摘要步骤。'),
  ...textFields,
}).describe('思考摘要的增量或权威全文。')

export const TextEventSchema = z.object({
  type: z.literal('step.text').describe('文本输出步骤。'),
  ...textFields,
}).describe('文本输出的增量或权威全文。')

export const ToolCallEventSchema = z.object({
  type: z.literal('step.tool.call').describe('工具调用步骤。'),
  ...stepFields,
  toolCallId: z.string().min(1).describe('工具调用 ID，用于关联调用与结果。'),
  toolName: z.string().min(1).describe('工具名称。'),
  argsSummary: z.string().describe('可供展开查看的工具参数摘要。'),
  moduleId: ModuleIdSchema.optional().describe('可选的关联模块，收到事件时置运行中角标。'),
}).describe('工具调用开始，不是运行终态。')

export const ToolResultEventSchema = z.object({
  type: z.literal('step.tool.result').describe('工具结果步骤。'),
  ...stepFields,
  toolCallId: z.string().min(1).describe('所对应的工具调用 ID。'),
  isError: z.boolean().describe('工具本次执行是否失败；不决定整个运行的终态。'),
  resultSummary: z.string().describe('可供展开查看的工具结果摘要。'),
  durationMs: z.number().nonnegative().optional().describe('可选的工具执行时长，单位毫秒。'),
  moduleId: ModuleIdSchema.optional().describe('可选的关联模块，运行结束前仍为运行中角标。'),
}).describe('工具调用结果，不是运行终态。')

export const StepErrorEventSchema = z.object({
  type: z.literal('step.error').describe('非终态错误步骤。'),
  ...stepFields,
  message: z.string().min(1).describe('当前步骤错误原因。'),
  willRetry: z.boolean().describe('运行时是否将重试；即使为 false，也须等待独立的运行终态事件。'),
}).describe('可重试的中间失败；不会结束运行。')

export const NavigateEventSchema = z.object({
  type: z.literal('hint.navigate').describe('导航建议步骤。'),
  ...stepFields,
  target: z.object({
    kind: z.enum(['module', 'page']).describe('module 表示工作台模块，page 表示页面路由。'),
    id: z.string().min(1).describe('模块 ID 或页面路径；允许未知目标，由导航界面提示不存在且不跳转。'),
  }).describe('建议导航目标；建议本身不会修改布局或自动跳转。'),
  reason: z.string().optional().describe('可选的跳转建议原因。'),
}).describe('时间线中的可点击导航建议。')

export const RunCompletedEventSchema = z.object({
  type: z.literal('run.completed').describe('运行成功终态。'),
  ...eventFields,
  moduleIds: z.array(ModuleIdSchema).describe('本次完成的关联模块，置完成角标；没有关联时为空列表。'),
}).describe('运行唯一终态的成功分支。')

export const RunFailedEventSchema = z.object({
  type: z.literal('run.failed').describe('运行失败终态。'),
  ...eventFields,
  error: ContractErrorSchema,
}).describe('运行唯一终态的失败分支，复用统一错误详情。')

export const RunAbortedEventSchema = z.object({
  type: z.literal('run.aborted').describe('运行中止终态。'),
  ...eventFields,
}).describe('运行唯一终态的中止分支；v1 不提供中止交互。')

export const AgentEventSchema = z.discriminatedUnion('type', [
  RunStartedEventSchema,
  ThinkingEventSchema,
  TextEventSchema,
  ToolCallEventSchema,
  ToolResultEventSchema,
  StepErrorEventSchema,
  NavigateEventSchema,
  RunCompletedEventSchema,
  RunFailedEventSchema,
  RunAbortedEventSchema,
]).describe('agent 事件，共十种；每个事件都携带 runId、sessionId 与带偏移的 ts。')

export type AgentEvent = z.infer<typeof AgentEventSchema>
export type TerminalEvent = Extract<AgentEvent, {
  type: 'run.completed' | 'run.failed' | 'run.aborted'
}>

export function isTerminalEvent(event: AgentEvent): event is TerminalEvent {
  return event.type === 'run.completed' || event.type === 'run.failed' || event.type === 'run.aborted'
}

export const AgentRunSchema = z.array(AgentEventSchema).superRefine((events, ctx) => {
  const first = events[0]
  if (first?.type !== 'run.started' || events.filter(event => event.type === 'run.started').length !== 1) {
    ctx.addIssue({ code: 'custom', message: '一次 run 必须以唯一的 run.started 开始。' })
  }
  if (events.filter(isTerminalEvent).length !== 1) {
    ctx.addIssue({ code: 'custom', message: '一次 run 必须恰好包含一个终态。' })
  }
  const last = events.at(-1)
  if (last && !isTerminalEvent(last)) {
    ctx.addIssue({ code: 'custom', message: '运行终态必须是最后一个事件。' })
  }

  let previousStep = -1
  for (const [index, event] of events.entries()) {
    if (event.runId !== first?.runId || event.sessionId !== first?.sessionId) {
      ctx.addIssue({ code: 'custom', path: [index], message: '同一 run 的运行与会话 ID 必须一致。' })
    }
    if ('stepId' in event) {
      if (event.stepId < previousStep) {
        ctx.addIssue({ code: 'custom', path: [index, 'stepId'], message: 'stepId 在 run 内必须单调。' })
      }
      previousStep = event.stepId
    }
  }
}).describe('完整的单次运行记录：同一运行与会话、唯一开始、步骤编号单调、恰好一个终态且位于末尾；仅用于完整记录的边界校验，不用于增量订阅。')
