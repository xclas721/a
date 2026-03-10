import type { BaseSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

async function findAllIssuer() {
  const schemeOptions: BaseSelect[] = []
  const result = await apiUtil.get('/condition/queryIssuer', {}, {}, true)

  for (const code of result.data as IssuerData[]) {
    schemeOptions.push({
      value: code.oid ?? '',
      text: code.issuerName ?? ''
    })
  }
  return schemeOptions
}

export interface IssuerData {
  issuerName?: string

  bankId?: string

  description?: string

  status?: string

  oid?: string
}

export { findAllIssuer }
