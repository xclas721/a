<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.account') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.account, dataBefore.account) }">
            {{ valOrNA(dataAfter.account) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.user-name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.userName, dataBefore.userName) }">
            {{ valOrNA(dataAfter.userName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.group') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.adminGroupOid, dataBefore.adminGroupOid)
            }"
          >
            {{ getOptionsByValue(dataAfter.adminGroupOid, groupOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.department') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.department, dataBefore.department) }">
            {{ valOrNA(dataAfter.department) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.password') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.encryptPdfield, dataBefore.encryptPdfield)
            }"
          >
            {{ handlePwd('*', dataAfter.encryptPdfield) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.cnfrpassword') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.encryptPdfield, dataBefore.encryptPdfield)
            }"
          >
            {{ handlePwd('*', dataAfter.encryptPdfield) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.tel') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.tel, dataBefore.tel) }">
            {{ valOrNA(dataAfter.tel) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.ext') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.ext, dataBefore.ext) }">
            {{ valOrNA(dataAfter.ext) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.email') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.email, dataBefore.email) }">
            {{ valOrNA(dataAfter.email) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, handlePwd, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const groupOptions = ref<BaseSelect[]>([])

onMounted(async () => {
  groupOptions.value = await findAllPermissionGroup()
})
</script>
