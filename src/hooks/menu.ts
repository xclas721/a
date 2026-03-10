import ApiUtil from '@/utils/apiUtils'
import type { BaseI18nSelect } from '@/utils/select/baseSelect'
import type { AdminMenu } from '@/stores/user'
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

async function findMenu() {
  const baseSelects: BaseI18nSelect[] = []
  const result = await apiUtil.post('/menu/getAllMenu', {}, {}, true)

  for (const code of result.data as AdminMenu[]) {
    baseSelects.push({
      value: code.accessId ?? '',
      i18nText: code.i18nCode
    })
  }
  return baseSelects
}
async function getReconfirmMenu() {
  const baseSelects: BaseI18nSelect[] = []
  const result = await apiUtil.post('/menu/getReconfirmMenu', {}, {}, true)

  for (const code of result.data as AdminMenu[]) {
    baseSelects.push({
      value: code.accessId ?? '',
      i18nText: code.i18nCode
    })
  }
  return baseSelects
}

export { findMenu, getReconfirmMenu }
