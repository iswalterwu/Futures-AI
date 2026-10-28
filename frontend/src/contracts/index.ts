import type { AgentClient, DataClient } from './client.ts'
import { BootstrapSchema } from './types.ts'
import { createMockAgentClient, createMockDataClient } from './mock/index.ts'
import { agentClient as realAgentClient, dataClient as realDataClient } from './real/index.ts'

const mode = BootstrapSchema.shape.mode.parse(import.meta.env.VITE_DATA_MODE ?? 'mock')

export const dataClient: DataClient = mode === 'real' ? realDataClient : createMockDataClient()
export const agentClient: AgentClient = mode === 'real' ? realAgentClient : createMockAgentClient()
