import { http, HttpResponse } from 'msw'
import { appConfig } from '@/config'

const baseUrl = appConfig.API_BASE_URL
export const cardBinMock = [
  http.get(baseUrl + '/api/cardBin/detail', async () => {
    return HttpResponse.json({
      data: {
        oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e',
        createDateTime: '2024-08-27T08:21:21.709058Z',
        updateDateTime: null,
        cardType: 'C',
        cardScheme: 'C',
        binBegin: '6228010000000000',
        binEnd: '6228010000000999',
        decAuthInd: '1',
        merWhiteListInd: '1',
        cupSupportInd: '1',
        acsReferenceNumber: null,
        issuerOid: '22df320b-5cf2-d898-128a-846f75e56d07'
      },
      code: '0000',
      message: '',
      success: true
    })
  }),
  http.post(baseUrl + '/api/cardBin/query', async () => {
    return HttpResponse.json({
      data: {
        entity: {
          oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e',
          createDateTime: '2024-08-27T08:21:21.709058Z',
          updateDateTime: null,
          cardType: 'C',
          cardScheme: 'C',
          binBegin: '6228010000000000',
          binEnd: '6228010000000999',
          decAuthInd: '1',
          merWhiteListInd: '1',
          cupSupportInd: '1',
          acsReferenceNumber: null,
          issuerOid: '22df320b-5cf2-d898-128a-846f75e56d07'
        },
        dto: {
          oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e',
          createDateTime: '2024-08-27T08:21:21.709058Z',
          updateDateTime: null,
          cardType: 'C',
          cardScheme: 'C',
          binBegin: '6228010000000000',
          binEnd: '6228010000000999',
          decAuthInd: '1',
          merWhiteListInd: '1',
          cupSupportInd: '1',
          acsReferenceNumber: null,
          issuerOid: '22df320b-5cf2-d898-128a-846f75e56d07'
        }
      },
      code: '0000',
      message: '',
      success: true
    })
  }),
  http.post(baseUrl + '/api/cardBin/add', async () => {
    return HttpResponse.json({
      data: {
        entity: null,
        dto: {
          oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e',
          createDateTime: '2024-08-27T08:21:21.709058Z',
          updateDateTime: null,
          cardType: 'C',
          cardScheme: 'C',
          binBegin: '6228010000000000',
          binEnd: '6228010000000999',
          decAuthInd: '1',
          merWhiteListInd: '1',
          cupSupportInd: '1',
          acsReferenceNumber: null,
          issuerOid: '22df320b-5cf2-d898-128a-846f75e56d07'
        }
      },
      code: '0000',
      message: 'success',
      success: true
    })
  }),
  http.post(baseUrl + '/api/cardBin/edit', async () => {
    return HttpResponse.json({
      data: {
        entity: null,
        dto: {
          oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e',
          createDateTime: '2024-08-27T08:21:21.709058Z',
          updateDateTime: null,
          cardType: 'C',
          cardScheme: 'C',
          binBegin: '6228010000000000',
          binEnd: '6228010000000999',
          decAuthInd: '1',
          merWhiteListInd: '1',
          cupSupportInd: '1',
          acsReferenceNumber: null,
          issuerOid: '22df320b-5cf2-d898-128a-846f75e56d07'
        }
      },
      code: '0000',
      message: 'success',
      success: true
    })
  })
]
