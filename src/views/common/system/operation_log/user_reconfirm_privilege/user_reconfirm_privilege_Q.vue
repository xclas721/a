<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <!-- After change -->
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.admin-user.account') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaIssuerUserAccount) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.admin-user.group') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaIssuerGroupOid, issuerGroupData) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const issuerGroupData = ref<BaseSelect[]>([])
onMounted(async () => {
  issuerGroupData.value = await findAllPermissionGroup()
})
</script>
