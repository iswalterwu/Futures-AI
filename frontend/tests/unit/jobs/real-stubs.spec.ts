// @vitest-environment node
import { describe, expect, test } from 'vitest'
import type { DataClient } from '../../../src/contracts/client.ts'
import { dataMethods } from '../../../src/contracts/methods.ts'
import { dataClient, NotImplementedError } from '../../../src/contracts/real/index.ts'

const requests = {
  bootstrap: () => dataClient.bootstrap(),
  getModuleCatalog: () => dataClient.getModuleCatalog(),
  getDailyBrief: () => dataClient.getDailyBrief(),
  getMarketBoard: () => dataClient.getMarketBoard(),
  getWatchlist: () => dataClient.getWatchlist(),
  getReleaseCalendar: () => dataClient.getReleaseCalendar('2026-10-27', '2026-10-29'),
  getModuleSummary: () => dataClient.getModuleSummary('positions'),
  getNewsTicker: () => dataClient.getNewsTicker(),
  getSourceStatus: () => dataClient.getSourceStatus(),
  getResearchList: () => dataClient.getResearchList(),
  listJobs: () => dataClient.listJobs({ status: 'collecting', type: 'daily', title: '油品' }),
  getJob: () => dataClient.getJob('j-collect'),
  getStageWorkspace: () => dataClient.getStageWorkspace('j-collect', 'collect'),
  resetMockData: () => dataClient.resetMockData(),
  createJob: () => dataClient.createJob({ title: '样例作业', type: 'daily', subject: null, goal: '样例目标' }),
  submitIntake: () => dataClient.submitIntake({ jobId: null, inputKind: 'url', url: 'https://example.invalid/sample', sourceNote: { purpose: '样例', reliability: 'unknown', publishedAt: null, validUntil: null, scopeNote: null } }),
  getIntakePreview: () => dataClient.getIntakePreview('u-unassigned-file'),
  confirmIntake: () => dataClient.confirmIntake('u-unassigned-file', []),
  listUnassignedUploads: () => dataClient.listUnassignedUploads(),
  assignUpload: () => dataClient.assignUpload('u-unassigned-file', 'j-collect'),
  removeUpload: () => dataClient.removeUpload('u-unassigned-file', '样例删除'),
  cancelJob: () => dataClient.cancelJob('j-collect', '样例取消'),
  listInterventions: () => dataClient.listInterventions('j-collect', { stage: 'collect', kind: 'ingest' }),
} satisfies { [Method in keyof DataClient]: () => ReturnType<DataClient[Method]> }

describe('WI real stubs — AC-008-3 partial', () => {
  test('all DataClient keys have explicit stubs and test calls', () => {
    expect(Object.keys(dataClient).sort()).toEqual(Object.keys(dataMethods).sort())
    expect(Object.keys(requests).sort()).toEqual(Object.keys(dataClient).sort())
  })
  test.each(Object.entries(requests))('%s rejects with its named NotImplementedError', async (method, request) => {
    const result = request()
    await expect(result).rejects.toBeInstanceOf(NotImplementedError)
    await expect(result).rejects.toMatchObject({
      name: 'NotImplementedError',
      error: { code: 'internal', retryable: false, message: expect.stringContaining(method) },
    })
  })
})
