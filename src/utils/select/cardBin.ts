import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'

export const enableORDisableOptions: BaseI18nSelect[] = [
  {
    value: '1',
    i18nText: 'ENABLED.1'
  },
  {
    value: '0',
    i18nText: 'ENABLED.0'
  }
]

export const cardTypeOptions: BaseSelect[] = [
  {
    value: 'C',
    text: 'Credit Card'
  },
  {
    value: 'D',
    text: 'Debit Card'
  }
]

export const cupSupportIndOptions: BaseI18nSelect[] = [
  {
    value: '0',
    i18nText: 'ui.card-bin.cupSupportInd.0'
  },
  {
    value: '1',
    i18nText: 'ui.card-bin.cupSupportInd.1'
  }
]
