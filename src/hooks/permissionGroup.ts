import ApiUtil from '@/utils/apiUtils'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { useAppStoreHook } from '@/stores/app'
const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

async function findAllPermissionGroup(issuerOid: string = '') {
  const groupDataList: BaseSelect[] = []
  if (appStoreHook.organ == 'issuer') {
    const result = await apiUtil.post('/condition/issuerGroup/queryGroup', { issuerOid: issuerOid }, {}, true)
    if (result.success && result.code == '0000') {
      for (const code of result.data) {
        groupDataList.push({
          value: code.oid ?? '',
          text: code.groupName ?? ''
        })
      }
    }
  } else {
    const result = await apiUtil.post('/condition/adminGroup/queryGroup', {}, {}, true)
    if (result.success && result.code == '0000') {
      for (const code of result.data) {
        groupDataList.push({
          value: code.oid ?? '',
          text: code.groupName ?? ''
        })
      }
    }
  }
  return groupDataList
}

export { findAllPermissionGroup }
