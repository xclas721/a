export interface BaseI18nSelect {
  value: any
  i18nText: string
}

export interface BaseSelect {
  value: string
  text: string
}

export const optionSelect: BaseI18nSelect[] = [
  {
    value: '',
    i18nText: 'ui.option-select'
  }
]

export const certoptionSelect: BaseI18nSelect[] = [
  {
    value: '',
    i18nText: 'ui.option-select'
  },
  {
    value: '000000',
    i18nText: 'ui.rba.default'
  }
]

export const optionSelect1: BaseI18nSelect[] = [
  {
    value: '',
    i18nText: 'ui.rba.default'
  },
  {
    value: null,
    i18nText: 'ui.rba.default'
  }
]
export const defaultOptionSelect: BaseI18nSelect[] = [
  {
    value: '00000',
    i18nText: 'ui.rba.default'
  }
]
