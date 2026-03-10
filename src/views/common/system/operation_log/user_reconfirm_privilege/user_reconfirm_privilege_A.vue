<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-user.code') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.user.account, dataBefore.user.account) }">
            {{ valOrNA(dataAfter.user.account) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-user.name') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.user.userName, dataBefore.user.userName)
            }"
          >
            {{ valOrNA(dataAfter.user.userName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-user.group') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.user.adminGroupOid, dataBefore.user.adminGroupOid)
            }"
          >
            {{ getOptionsByValue(dataAfter.user.adminGroupOid, issuerGroupData) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-user.dep') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.user.department, dataBefore.user.department)
            }"
          >
            {{ valOrNA(dataAfter.user.department) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-user-reconfirm-privilege.function-name') }}</span>
        <div v-if="!dataAfter.dataForm">N/A</div>
        <div v-for="(menuList, index) in dataAfter.dataForm.functions" :key="index">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col" style="width: 60%">
                  <div class="ft-15 font-weight-bold">
                    <b>{{ $t(dataAfter.dataForm.modules[index].i18nCode) }}</b>
                  </div>
                </th>
                <th scope="col">
                  <div class="ft-15 font-weight-bold">
                    {{ $t('ui.issuer-user-reconfirm-privilege.allow-query') }}
                  </div>
                </th>
                <th scope="col">
                  <div class="ft-15 font-weight-bold">
                    {{ $t('ui.issuer-user-reconfirm-privilege.allow-confirm') }}
                  </div>
                </th>
                <th scope="col">
                  <div class="ft-15 font-weight-bold">
                    {{ $t('ui.issuer-user-reconfirm-privilege.allow-confirm-by-self') }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="menu in menuList" :key="menu">
                <td class="ft-15" style="vertical-align: middle">
                  <div>
                    <span>{{ $t(menu.i18nCode) }}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span
                      class="text-center"
                      :class="{
                        'text-danger': accessIdDifferent(
                          dataAfter.dataForm.issuerUserReconfirmPrivilegeMap[menu.accessId],
                          0
                        )
                      }"
                    >
                      ●
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <span
                      class="text-center"
                      :class="{
                        'text-danger': accessIdDifferent(
                          dataAfter.dataForm.issuerUserReconfirmPrivilegeMap[menu.accessId],
                          1
                        )
                      }"
                    >
                      ●
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <span
                      class="text-center"
                      :class="{
                        'text-danger': accessIdDifferent(
                          dataAfter.dataForm.issuerUserReconfirmPrivilegeMap[menu.accessId],
                          2
                        )
                      }"
                    >
                      ●
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const issuerGroupData = ref<BaseSelect[]>([])
onMounted(async () => {
  issuerGroupData.value = await findAllPermissionGroup()
})
const accessIdDifferent = (privileges: Record<string, any>, num: number) => {
  if (privileges) {
    return isPermit(privileges.privileges, num)
  }
  return false
}
const isPermit = (privileges: number, point: number) => {
  if (privileges !== null && privileges !== undefined) {
    return (privileges & (1 << point)) === Math.pow(2, point)
  }
  return false
}
</script>
