import type { BaseI18nSelect } from '@/utils/select/baseSelect'

export const policyLowRiskOptionSelect: BaseI18nSelect[] = [
  {
    value: '1',
    i18nText: 'ui.mc-rba.policy-frictionless'
  },
  {
    value: '2',
    i18nText: 'ui.mc-rba.policy-acs-rba'
  }
]

export const policyLowRiskOptionSave: BaseI18nSelect[] = [
  {
    value: '1',
    i18nText: 'ui.mc-rba.policy-frictionless'
  },
  {
    value: '2',
    i18nText: 'ui.mc-rba.policy-acs-rba'
  }
]

export const policyNotLowRiskOptionSelect: BaseI18nSelect[] = [
  {
    value: '3',
    i18nText: 'ui.mc-rba.policy-challenge'
  },
  {
    value: '4',
    i18nText: 'ui.mc-rba.policy-reject'
  }
]

export const rbaEvaluationOption: BaseI18nSelect[] = [
  {
    value: '3',
    i18nText: 'ui.mc-rba.policy-challenge'
  },
  {
    value: '2',
    i18nText: 'ui.mc-rba.policy-acs-rba'
  }
]
