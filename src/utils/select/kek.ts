import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'

export const encDataTypeOptionSelect: BaseI18nSelect[] = [
  {
    value: '1',
    i18nText: 'ui.kek.enc-data-type.1'
  },
  {
    value: '2',
    i18nText: 'ui.kek.enc-data-type.2'
  },
  {
    value: '3',
    i18nText: 'ui.kek.enc-data-type.3'
  },
  {
    value: '4',
    i18nText: 'ui.kek.enc-data-type.4'
  }
]
export const kekStatusOptionSelect: BaseI18nSelect[] = [
  {
    value: '1',
    i18nText: 'ui.kek.status-enabled'
  },
  {
    value: '0',
    i18nText: 'ui.kek.status-disabled'
  }
]
export const algorithmOptionSelect: BaseSelect[] = [
  {
    value: 'AES',
    text: 'AES'
  },
  {
    value: 'SM4',
    text: 'SM4'
  }
]
export const keySizeOptionSelect: BaseSelect[] = [
  {
    value: '128',
    text: '128'
  },
  {
    value: '192',
    text: '192'
  },
  {
    value: '256',
    text: '256'
  }
]
export const modeOptionSelect: BaseSelect[] = [
  {
    value: 'CBC',
    text: 'CBC'
  },
  {
    value: 'GCM',
    text: 'GCM'
  }
]
export const paddingOptionSelect: BaseSelect[] = [
  {
    value: 'NoPadding',
    text: 'NoPadding'
  },
  {
    value: 'PKCS5Padding',
    text: 'PKCS5Padding'
  },
  {
    value: 'PKCS7Padding',
    text: 'PKCS7Padding'
  }
]
