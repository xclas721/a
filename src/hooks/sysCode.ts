import ApiUtil from '@/utils/apiUtils'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

async function findByCodeType(code: string) {
  const schemeOptions: BaseI18nSelect[] = []
  const result = await apiUtil.post('/condition/sysCode/findByCodeType', { codeType: code }, {}, true)

  for (const code of result.data as SysCode[]) {
    schemeOptions.push({
      value: code.codeId ?? '',
      i18nText: code.i18nCode ?? ''
    })
  }
  return schemeOptions
}

async function findDistinctCodeType() {
  const schemeOptions: BaseSelect[] = []
  const result = await apiUtil.post('/sysCode/findDistinctCodeType', {}, {}, true)

  for (const item of result.data) {
    schemeOptions.push({
      value: item ?? '',
      text: item ?? ''
    })
  }
  return schemeOptions
}

export interface SysCode {
  codeType?: string

  codeId?: string

  codeTypeDesc?: string

  codeDesc?: string

  codeOrder?: number

  i18nCode?: string
}

export { findByCodeType, findDistinctCodeType }
