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
