import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'

export const messageCategoryOptionSelect: BaseSelect[] = [
  {
    value: '01',
    text: '01-PA'
  },
  {
    value: '02',
    text: '02-NPA'
  }
]
export const uiTypeOptionSelect: BaseSelect[] = [
  {
    value: '01',
    text: '01 = Text'
  },
  {
    value: '02',
    text: '02 = Single Select'
  },
  {
    value: '03',
    text: '03 = Multi Select'
  },
  {
    value: '04',
    text: '04 = OOB'
  },
  {
    value: '05',
    text: '05 = HTML'
  },
  {
    value: '06',
    text: '06 = HTML OOB'
  },
  {
    value: '07',
    text: '07 = Information'
  }
]

export const challengeInfoTextIndOptionSelect: BaseSelect[] = [
  {
    value: 'N',
    text: 'N'
  },
  {
    value: 'Y',
    text: 'Y'
  }
]
export const togglePositionIndOptionSelect: BaseI18nSelect[] = [
  {
    value: '01',
    i18nText: 'challenge.info.toggle.position.01'
  }
]
export const challengeDataEntryKeyboardTypeOptionSelect: BaseI18nSelect[] = [
  {
    value: '01',
    i18nText: 'challenge.data.entry.keyboard.type.01'
  },
  {
    value: '02',
    i18nText: 'challenge.data.entry.keyboard.type.02'
  }
]
export const challengeDataEntryAutofillOptionSelect: BaseSelect[] = [
  {
    value: 'Y',
    text: 'Y'
  }
]

export const challengeDataEntryAutofillTypeOptionSelect: BaseI18nSelect[] = [
  {
    value: '01',
    i18nText: 'challenge.data.entry.autofill.type.01'
  },
  {
    value: '02',
    i18nText: 'challenge.data.entry.autofill.type.02'
  }
]
export const challengeDataEntryMaskingOptionSelect: BaseSelect[] = [
  {
    value: 'N',
    text: 'N'
  },
  {
    value: 'Y',
    text: 'Y'
  }
]
export const challengeDataEntryToggleOptionSelect: BaseSelect[] = [
  {
    value: 'N',
    text: 'N'
  },
  {
    value: 'Y',
    text: 'Y'
  }
]
