<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.account') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.account) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.user-name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.userName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.group') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.adminGroupOid, issuerGroupData) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.department') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.department) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.password') }}</span>
        <p>
          <span>
            {{ handlePwd('*', dataBefore.pdField) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.cnfrpassword') }}</span>
        <p>
          <span>
            {{ handlePwd('*', dataBefore.cnfrPdfield) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.tel') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.tel) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.ext') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.ext) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.admin-user.email') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.email) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, handlePwd, valOrNA } from '@/utils/util'
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
</script>
