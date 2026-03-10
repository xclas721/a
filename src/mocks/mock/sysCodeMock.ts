import { http, HttpResponse } from 'msw'
import { appConfig } from '@/config'
const baseUrl = appConfig.API_BASE_URL
export const sysCodeMock = [
  http.post(baseUrl + '/api/condition/sysCode/findByCodeType', () => {
    return HttpResponse.json({
      data: [
        {
          codeType: 'CARD_SCHEME',
          codeId: 'V',
          codeTypeDesc: '卡組織',
          codeDesc: 'Visa',
          codeOrder: 1,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'M',
          codeTypeDesc: '卡組織',
          codeDesc: 'MasterCard',
          codeOrder: 2,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'J',
          codeTypeDesc: '卡組織',
          codeDesc: 'JCB',
          codeOrder: 3,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'A',
          codeTypeDesc: '卡組織',
          codeDesc: 'American Express',
          codeOrder: 4,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'C',
          codeTypeDesc: '卡組織',
          codeDesc: 'CUP',
          codeOrder: 5,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'D',
          codeTypeDesc: '卡組織',
          codeDesc: 'Diners',
          codeOrder: 6,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'U',
          codeTypeDesc: '卡組織',
          codeDesc: 'UL-STP',
          codeOrder: 7,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'P',
          codeTypeDesc: '卡組織',
          codeDesc: 'PayNet',
          codeOrder: 8,
          i18nCode: ''
        },
        {
          codeType: 'CARD_SCHEME',
          codeId: 'S',
          codeTypeDesc: '卡組織',
          codeDesc: 'Saudi MADA',
          codeOrder: 9,
          i18nCode: ''
        }
      ],
      code: '0000',
      message: '',
      success: true
    })
  })
]
