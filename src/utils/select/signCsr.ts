import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'

export const enrollStatusOptionSelect: BaseI18nSelect[] = [
  {
    value: '0',
    i18nText: 'ENROLL.0'
  },
  {
    value: '1',
    i18nText: 'ENROLL.1'
  }
]
export const credentialStatusOptionSelect: BaseI18nSelect[] = [
  {
    value: '0',
    i18nText: 'ENABLED.0'
  },
  {
    value: '1',
    i18nText: 'ENABLED.1'
  }
]
export const keyLengthOptionSelect: BaseSelect[] = [
  {
    value: '256',
    text: '256 bits (ECDSA)'
  },
  {
    value: '1024',
    text: '1024 bits (RSA)'
  },
  {
    value: '2048',
    text: '2048 bits (RSA)'
  }
]
export const signAlgorithmOptionSelect: BaseSelect[] = [
  {
    value: 'SHA1withRSA',
    text: 'SHA1withRSA'
  },
  {
    value: 'SHA256withRSA',
    text: 'SHA256withRSA'
  },
  {
    value: 'SHA1withECDSA',
    text: 'SHA1withECDSA'
  },
  {
    value: 'SHA256withECDSA',
    text: 'SHA256withECDSA'
  }
]
