import type { BaseSelect } from '@/utils/select/baseSelect'

export const jwsAlgorithmOptionSelect: BaseSelect[] = [
  {
    value: 'PS256',
    text: 'PS256'
  },
  {
    value: 'ES256',
    text: 'ES256'
  }
]
export const jweAlgorithmOptionSelect: BaseSelect[] = [
  {
    value: 'A128CBC-HS256',
    text: 'A128CBC-HS256'
  },
  {
    value: 'A128GCM',
    text: 'A128GCM'
  }
]
